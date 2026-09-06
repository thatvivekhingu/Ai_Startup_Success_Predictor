from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Prediction
from ..schemas import PredictionInput, PredictionOutput, PredictionHistoryItem
from ..auth import get_optional_user, get_current_user
from ..predictor import predictor_instance

router = APIRouter(prefix="/api", tags=["Predictions"])

# Presets for fast testing
PRESETS = [
    {
        "id": "ai-saas",
        "name": "Generative AI Enterprise SaaS",
        "primary_category": "Software",
        "country_code": "USA",
        "funding_total_usd": 15000000,
        "funding_rounds": 3,
        "founded_year": 2022,
        "first_funding_year": 2022,
        "last_funding_year": 2024,
        "team_size": 18,
        "has_accelerator": True,
        "patent_count": 2
    },
    {
        "id": "fintech-scaleup",
        "name": "Cross-Border FinTech Platform",
        "primary_category": "Finance",
        "country_code": "GBR",
        "funding_total_usd": 42000000,
        "funding_rounds": 4,
        "founded_year": 2020,
        "first_funding_year": 2020,
        "last_funding_year": 2023,
        "team_size": 45,
        "has_accelerator": True,
        "patent_count": 1
    },
    {
        "id": "healthtech-diagnostics",
        "name": "BioAI Oncology Diagnostics",
        "primary_category": "Biotechnology",
        "country_code": "USA",
        "funding_total_usd": 28500000,
        "funding_rounds": 3,
        "founded_year": 2019,
        "first_funding_year": 2020,
        "last_funding_year": 2023,
        "team_size": 22,
        "has_accelerator": False,
        "patent_count": 6
    },
    {
        "id": "ecommerce-bootstrapped",
        "name": "Direct-to-Consumer Apparel",
        "primary_category": "E-Commerce",
        "country_code": "IND",
        "funding_total_usd": 250000,
        "funding_rounds": 1,
        "founded_year": 2023,
        "first_funding_year": 2024,
        "last_funding_year": 2024,
        "team_size": 6,
        "has_accelerator": False,
        "patent_count": 0
    }
]

@router.get("/presets")
def get_startup_presets():
    return PRESETS

@router.post("/predict", response_model=PredictionOutput)
def predict_startup_success(
    input_data: PredictionInput,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    result = predictor_instance.predict(input_data)
    
    # Save to database
    db_pred = Prediction(
        user_id=current_user.id if current_user else None,
        startup_name=result["startup_name"],
        primary_category=result["primary_category"],
        country_code=result["country_code"],
        funding_total_usd=result["funding_total_usd"],
        funding_rounds=result["funding_rounds"],
        founded_year=input_data.founded_year,
        success_probability=result["success_probability"],
        confidence_score=result["confidence_score"],
        status_tier=result["status_tier"],
        strengths=result["strengths"],
        risk_factors=result["risk_factors"],
        recommendations=result["recommendations"],
        input_details=input_data.model_dump()
    )
    db.add(db_pred)
    db.commit()
    db.refresh(db_pred)
    
    result["id"] = db_pred.id
    result["created_at"] = db_pred.created_at
    return result

@router.get("/predictions/history", response_model=List[PredictionHistoryItem])
def get_prediction_history(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    query = db.query(Prediction)
    if current_user:
        query = query.filter(Prediction.user_id == current_user.id)
    predictions = query.order_by(Prediction.created_at.desc()).limit(50).all()
    return predictions

@router.get("/predictions/{prediction_id}")
def get_prediction_by_id(
    prediction_id: int,
    db: Session = Depends(get_db)
):
    pred = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return pred

@router.delete("/predictions/{prediction_id}")
def delete_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pred = db.query(Prediction).filter(
        Prediction.id == prediction_id,
        Prediction.user_id == current_user.id
    ).first()
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction not found or unauthorized")
    db.delete(pred)
    db.commit()
    return {"message": "Prediction deleted successfully"}
