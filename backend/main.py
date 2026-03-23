# ═══════════════════════════════════════════════════════════
#  Farmer Market Guru — FastAPI Backend
#  Run: uvicorn main:app --reload
# ═══════════════════════════════════════════════════════════

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.prices import router as prices_router
from routes.predictions import router as predictions_router
import uvicorn

app = FastAPI(
    title="Farmer Market Guru API",
    description="AI-powered vegetable price prediction for Andhra Pradesh farmers",
    version="1.0.0",
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prices_router,      prefix="/prices",      tags=["Prices"])
app.include_router(predictions_router, prefix="/predict",     tags=["Predictions"])

@app.get("/")
def root():
    return {
        "name": "Farmer Market Guru API",
        "version": "1.0.0",
        "endpoints": ["/prices/today", "/prices/history/{vegetable}", "/predict/tomorrow/{vegetable}", "/predict/year/{vegetable}"]
    }

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
