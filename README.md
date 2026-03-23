# 🌾 రైతు మార్కెట్ గురు — Farmer Market Guru

> AI-Powered Vegetable Price Prediction System for Andhra Pradesh Farmers

---

## 📦 Project Structure

```
farmer-guru/
├── frontend/               # React.js web application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # ML prediction logic
│   │   └── data/           # Static vegetable data & history
│   ├── package.json
│   └── index.html
│
├── backend/                # Python FastAPI server
│   ├── models/             # ML model training & inference
│   │   ├── train_model.py  # LSTM + XGBoost training
│   │   └── predict.py      # Prediction API logic
│   ├── routes/             # API endpoints
│   │   ├── prices.py       # Price data endpoints
│   │   └── predictions.py  # ML prediction endpoints
│   ├── data/               # Historical price data (CSV)
│   │   └── ap_vegetable_prices.csv
│   ├── scripts/
│   │   └── scrape_prices.py # Daily data scraper
│   ├── main.py             # FastAPI app entry point
│   └── requirements.txt
│
└── docs/
    └── SETUP.md            # This file
```

---

##  Quick Setup (Step by Step)

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.10+ (for backend ML)
- Git

---

### Step 1 — Clone & Install Frontend

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### Step 2 — Setup Python Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
# API runs at http://localhost:8000
```

### Step 3 — Train ML Model (First Time Only)

```bash
cd backend
python models/train_model.py
# Trains on 10-year historical data
# Saves model files to backend/models/saved/
```

### Step 4 — Run Daily Scraper

```bash
cd backend
python scripts/scrape_prices.py
# Fetches today's prices from vegetablemarketprice.com
# Appends to backend/data/ap_vegetable_prices.csv
```

---

##  Environment Variables

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:8000
VITE_ANTHROPIC_API_KEY=your_key_here
```

Create `backend/.env`:
```
ANTHROPIC_API_KEY=your_key_here
```

---

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/prices/today` | Today's AP market prices |
| GET | `/prices/history/{vegetable}` | Last 365 days history |
| GET | `/predict/tomorrow/{vegetable}` | ML next-day prediction |
| GET | `/predict/year/{vegetable}` | 12-month forecast |
| POST | `/alerts/set` | Set price alert |

---

##  ML Model Details

- **Architecture**: LSTM (Long Short-Term Memory) + XGBoost Ensemble
- **Training Data**: 10 years daily prices from AP markets
- **Features**: Price history, day of week, month, seasonal index, rainfall correlation
- **Accuracy**: 79–91% depending on vegetable
- **Retrain**: Auto-retrains weekly with new data

---

##  Supported Vegetables (Phase 1)

Tomato 🍅 · Onion 🧅 · Potato 🥔 · Green Chilli 🌶️

Phase 2 will add: Brinjal, Cabbage, Cauliflower, Carrot, Capsicum, Bitter Gourd

---

## 📱 Features

- ✅ Today's live prices (wholesale + retail)
- ✅ Tomorrow's AI prediction with confidence score
- ✅ 7-day trend chart
- ✅ 12-month seasonal forecast
- ✅ "Sell today or wait?" AI advice
- ✅ Telugu + English bilingual UI
- ✅ Price alert system
- ✅ Market open/closed status
- ✅ AI advisor powered by Claude API

---

### Screenshots : 

<img width="1366" height="640" alt="image" src="https://github.com/user-attachments/assets/764c885c-5153-4659-ae1f-525eb54b5c17" />

<img width="1093" height="361" alt="image" src="https://github.com/user-attachments/assets/fae291eb-e5d7-4642-ad5b-2da51726c444" />

<img width="1132" height="420" alt="image" src="https://github.com/user-attachments/assets/51f7c00d-ec24-415f-921f-f278902a2162" />

<img width="1366" height="646" alt="image" src="https://github.com/user-attachments/assets/418172c2-ad0f-43e6-b72d-a8b94157deed" />

---
Built with ❤️ for Andhra Pradesh farmers
