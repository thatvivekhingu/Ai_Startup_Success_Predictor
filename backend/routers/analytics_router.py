from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Prediction
from ..schemas import ModelMetricsResponse
from ..predictor import predictor_instance

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/model-metrics", response_model=ModelMetricsResponse)
def get_model_metrics():
    meta = predictor_instance.metadata
    return {
        "best_model": meta.get("best_model", "GradientBoosting"),
        "metrics": meta.get("metrics", {}),
        "models_comparison": meta.get("models_comparison", {}),
        "top_features": meta.get("top_features", []),
        "dataset_summary": meta.get("dataset_summary", {}),
        "top_categories": meta.get("top_categories", []),
        "top_countries": meta.get("top_countries", []),
        "trained_at": meta.get("trained_at", "")
    }

@router.get("/industry-stats")
def get_industry_stats():
    meta = predictor_instance.metadata
    return {
        "categories": meta.get("category_stats", {}),
        "countries": meta.get("country_stats", {})
    }

@router.get("/summary")
def get_app_summary(db: Session = Depends(get_db)):
    total_preds = db.query(func.count(Prediction.id)).scalar() or 0
    avg_prob = db.query(func.avg(Prediction.success_probability)).scalar() or 0.0
    high_potential_count = db.query(func.count(Prediction.id)).filter(Prediction.success_probability >= 70.0).scalar() or 0
    
    return {
        "total_predictions": total_preds,
        "average_success_probability": round(float(avg_prob), 1),
        "high_potential_startups": high_potential_count
    }
