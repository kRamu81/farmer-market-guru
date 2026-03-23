# ═══════════════════════════════════════════════════════════
#  Prediction Routes — /predict/*
# ═══════════════════════════════════════════════════════════

from fastapi import APIRouter, HTTPException
from models.predict import predict_next_day, predict_year
import os

router = APIRouter()

VEGETABLE_KEYS = ["tomato", "onion", "potato", "greenchilli"]


@router.get("/tomorrow/{vegetable}")
def get_tomorrow_prediction(vegetable: str):
    """ML prediction for tomorrow's price."""
    if vegetable not in VEGETABLE_KEYS:
        raise HTTPException(status_code=404, detail=f"Vegetable '{vegetable}' not found")
    return predict_next_day(vegetable)


@router.get("/year/{vegetable}")
def get_year_prediction(vegetable: str):
    """12-month seasonal forecast."""
    if vegetable not in VEGETABLE_KEYS:
        raise HTTPException(status_code=404, detail=f"Vegetable '{vegetable}' not found")
    return predict_year(vegetable)


@router.get("/all/tomorrow")
def get_all_tomorrow():
    """Tomorrow predictions for all vegetables."""
    return {veg: predict_next_day(veg) for veg in VEGETABLE_KEYS}
