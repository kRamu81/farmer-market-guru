# ═══════════════════════════════════════════════════════════
#  Price Routes — /prices/*
# ═══════════════════════════════════════════════════════════

from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import pandas as pd
import os

router = APIRouter()

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "ap_vegetable_prices.csv")

VEGETABLE_KEYS = ["tomato", "onion", "potato", "greenchilli"]

# Fallback static prices if CSV not found
STATIC_PRICES = {
    "tomato":      {"today": 15, "retail_low": 18, "retail_high": 23},
    "onion":       {"today": 22, "retail_low": 26, "retail_high": 33},
    "potato":      {"today": 22, "retail_low": 26, "retail_high": 33},
    "greenchilli": {"today": 40, "retail_low": 48, "retail_high": 60},
}


def load_prices():
    """Load prices from CSV or return static fallback."""
    try:
        df = pd.read_csv(DATA_PATH, parse_dates=["date"])
        return df
    except FileNotFoundError:
        return None


@router.get("/today")
def get_today_prices():
    """Get today's prices for all vegetables."""
    df = load_prices()
    today = datetime.now().date()
    result = {}

    for veg in VEGETABLE_KEYS:
        if df is not None and veg in df.columns:
            recent = df[df["date"].dt.date <= today].tail(1)
            if not recent.empty:
                price = float(recent[veg].iloc[0])
                result[veg] = {
                    "price": price,
                    "date": str(today),
                    "unit": "kg",
                }
                continue
        # Fallback
        result[veg] = {**STATIC_PRICES[veg], "date": str(today), "unit": "kg"}

    return {"date": str(today), "market": "Andhra Pradesh", "prices": result}


@router.get("/today/{vegetable}")
def get_today_price(vegetable: str):
    """Get today's price for a specific vegetable."""
    if vegetable not in VEGETABLE_KEYS:
        raise HTTPException(status_code=404, detail=f"Vegetable '{vegetable}' not found")
    data = get_today_prices()
    return data["prices"][vegetable]


@router.get("/history/{vegetable}")
def get_history(vegetable: str, days: int = 365):
    """Get price history for a vegetable."""
    if vegetable not in VEGETABLE_KEYS:
        raise HTTPException(status_code=404, detail=f"Vegetable '{vegetable}' not found")

    df = load_prices()
    if df is None or vegetable not in df.columns:
        # Return synthetic data
        return _generate_synthetic_history(vegetable, days)

    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)
    mask = (df["date"].dt.date >= start_date) & (df["date"].dt.date <= end_date)
    subset = df[mask][["date", vegetable]].dropna()

    return {
        "vegetable": vegetable,
        "days": days,
        "data": [
            {"date": str(row["date"].date()), "price": float(row[vegetable])}
            for _, row in subset.iterrows()
        ]
    }


def _generate_synthetic_history(vegetable: str, days: int):
    """Generate synthetic price history for demo purposes."""
    import numpy as np
    base_prices = {"tomato": 15, "onion": 22, "potato": 22, "greenchilli": 40}
    base = base_prices.get(vegetable, 20)
    data = []
    price = base
    for i in range(days):
        date = (datetime.now() - timedelta(days=days - i)).date()
        noise = np.random.normal(0, base * 0.05)
        seasonal = 1 + 0.2 * np.sin(2 * np.pi * date.month / 12)
        price = max(base * 0.4, price * 0.9 + base * seasonal * 0.1 + noise)
        data.append({"date": str(date), "price": round(price, 1)})
    return {"vegetable": vegetable, "days": days, "data": data}
