# ═══════════════════════════════════════════════════════════
#  ML Model Training — LSTM + XGBoost Ensemble
#  Run: python models/train_model.py
#  Trains on: backend/data/ap_vegetable_prices.csv
# ═══════════════════════════════════════════════════════════

import numpy as np
import pandas as pd
import os, joblib, warnings
warnings.filterwarnings("ignore")

DATA_PATH   = os.path.join(os.path.dirname(__file__), "..", "data", "ap_vegetable_prices.csv")
SAVE_DIR    = os.path.join(os.path.dirname(__file__), "saved")
os.makedirs(SAVE_DIR, exist_ok=True)

VEGETABLES  = ["tomato", "onion", "potato", "greenchilli"]
LOOKBACK    = 30   # days of history used as features
EPOCHS      = 50
BATCH_SIZE  = 32

# ── Feature engineering ──────────────────────────────────────────────────────

def build_features(series: pd.Series, lookback: int = 30):
    """Build sliding-window feature matrix."""
    prices = series.values.astype(float)
    X, y = [], []

    for i in range(lookback, len(prices)):
        window = prices[i - lookback:i]
        date = series.index[i]

        feats = list(window)              # last 30 days prices
        feats.append(date.month)          # month
        feats.append(date.weekday())      # day of week
        feats.append(date.dayofyear / 365.0)  # seasonal position
        feats.append(np.mean(window))     # rolling mean
        feats.append(np.std(window))      # rolling std
        feats.append(window[-1] - window[-7])  # 1-week momentum
        feats.append(window[-1] - window[-30]) # 1-month momentum

        X.append(feats)
        y.append(prices[i])

    return np.array(X), np.array(y)


# ── XGBoost model ─────────────────────────────────────────────────────────────

def train_xgboost(vegetable: str, df: pd.DataFrame):
    from xgboost import XGBRegressor
    from sklearn.model_selection import TimeSeriesSplit
    from sklearn.metrics import mean_absolute_percentage_error

    print(f"\n  Training XGBoost for {vegetable}...")
    series = df[vegetable].dropna()
    series.index = pd.to_datetime(df["date"][series.index])
    series = series.sort_index()

    X, y = build_features(series, LOOKBACK)

    # Time-series split (no data leakage)
    tscv = TimeSeriesSplit(n_splits=5)
    scores = []

    model = XGBRegressor(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        n_jobs=-1,
    )

    for train_idx, val_idx in tscv.split(X):
        model.fit(X[train_idx], y[train_idx], eval_set=[(X[val_idx], y[val_idx])], verbose=False)
        preds = model.predict(X[val_idx])
        mape = mean_absolute_percentage_error(y[val_idx], preds)
        scores.append(mape)

    accuracy = round((1 - np.mean(scores)) * 100, 1)
    print(f"  XGBoost accuracy: {accuracy}%")

    # Final train on all data
    model.fit(X, y)
    save_path = os.path.join(SAVE_DIR, f"{vegetable}_xgb.pkl")
    joblib.dump(model, save_path)
    print(f"  Saved → {save_path}")
    return accuracy


# ── LSTM model ────────────────────────────────────────────────────────────────

def train_lstm(vegetable: str, df: pd.DataFrame):
    """Train LSTM for time-series prediction."""
    try:
        import tensorflow as tf
        from sklearn.preprocessing import MinMaxScaler
    except ImportError:
        print("  TensorFlow not installed — skipping LSTM")
        return None

    print(f"\n  Training LSTM for {vegetable}...")
    series = df[vegetable].dropna().values.astype(float).reshape(-1, 1)

    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(series)

    # Build sequences
    seq_len = 14
    X, y = [], []
    for i in range(seq_len, len(scaled)):
        X.append(scaled[i - seq_len:i])
        y.append(scaled[i])
    X, y = np.array(X), np.array(y)

    split = int(len(X) * 0.85)
    X_train, X_val = X[:split], X[split:]
    y_train, y_val = y[:split], y[split:]

    # Model architecture
    model = tf.keras.Sequential([
        tf.keras.layers.LSTM(64, return_sequences=True, input_shape=(seq_len, 1)),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.LSTM(32),
        tf.keras.layers.Dropout(0.1),
        tf.keras.layers.Dense(16, activation="relu"),
        tf.keras.layers.Dense(1),
    ])
    model.compile(optimizer="adam", loss="mse", metrics=["mae"])

    callbacks = [
        tf.keras.callbacks.EarlyStopping(patience=8, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(patience=4, factor=0.5),
    ]

    model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=EPOCHS, batch_size=BATCH_SIZE,
        callbacks=callbacks, verbose=0,
    )

    # Save
    model.save(os.path.join(SAVE_DIR, f"{vegetable}_lstm.h5"))
    joblib.dump(scaler, os.path.join(SAVE_DIR, f"{vegetable}_scaler.pkl"))
    print(f"  LSTM saved → {SAVE_DIR}/{vegetable}_lstm.h5")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("═" * 60)
    print("  Farmer Market Guru — ML Model Training")
    print("═" * 60)

    if not os.path.exists(DATA_PATH):
        print(f"\n⚠️  Data file not found: {DATA_PATH}")
        print("   Run scripts/scrape_prices.py first to collect data.")
        print("   Using synthetic data for demonstration...\n")
        _generate_synthetic_csv()

    df = pd.read_csv(DATA_PATH)
    print(f"\n  Loaded {len(df)} rows × {len(df.columns)} columns")
    print(f"  Date range: {df['date'].min()} → {df['date'].max()}")
    print(f"  Vegetables: {[c for c in df.columns if c != 'date']}\n")

    results = {}
    for veg in VEGETABLES:
        if veg not in df.columns:
            print(f"  ⚠️  Column '{veg}' not in CSV — skipping")
            continue
        acc = train_xgboost(veg, df)
        train_lstm(veg, df)
        results[veg] = acc

    print("\n" + "═" * 60)
    print("  Training Complete!")
    print("═" * 60)
    for veg, acc in results.items():
        bar = "█" * int(acc / 5) + "░" * (20 - int(acc / 5))
        print(f"  {veg:15s} {bar} {acc}%")
    print()


def _generate_synthetic_csv():
    """Generate synthetic 10-year data for demo."""
    import random
    dates = pd.date_range("2015-01-01", "2024-12-31", freq="D")
    data = {"date": dates.strftime("%Y-%m-%d")}
    bases = {"tomato": 15, "onion": 22, "potato": 20, "greenchilli": 38}

    for veg, base in bases.items():
        prices = []
        p = base
        for d in dates:
            seasonal = 1 + 0.3 * np.sin(2 * np.pi * (d.month - 3) / 12)
            p = max(base * 0.4, p * 0.88 + base * seasonal * 0.12 + random.gauss(0, base * 0.04))
            prices.append(round(p, 1))
        data[veg] = prices

    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
    pd.DataFrame(data).to_csv(DATA_PATH, index=False)
    print(f"  Synthetic data saved → {DATA_PATH}")


if __name__ == "__main__":
    main()
