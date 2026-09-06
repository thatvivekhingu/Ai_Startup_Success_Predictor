from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr
from datetime import datetime

# User Schemas
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    username: Optional[str] = None

# Prediction Schemas
class PredictionInput(BaseModel):
    startup_name: str
    primary_category: str
    country_code: str
    funding_total_usd: float
    funding_rounds: int
    founded_year: Optional[int] = 2022
    first_funding_year: Optional[int] = 2023
    last_funding_year: Optional[int] = 2024
    team_size: Optional[int] = 5
    has_accelerator: Optional[bool] = False
    patent_count: Optional[int] = 0

class PredictionOutput(BaseModel):
    id: Optional[int] = None
    startup_name: str
    primary_category: str
    country_code: str
    funding_total_usd: float
    funding_rounds: int
    success_probability: float  # 0 to 100
    confidence_score: float     # 0 to 100
    status_tier: str            # "High Potential (Unicorn / Acquisition Ready)", "Moderate Growth", "Elevated Risk"
    strengths: List[str]
    risk_factors: List[str]
    recommendations: List[str]
    feature_contributions: List[Dict[str, Any]]
    created_at: Optional[datetime] = None

class PredictionHistoryItem(BaseModel):
    id: int
    startup_name: str
    primary_category: str
    country_code: str
    funding_total_usd: float
    funding_rounds: int
    success_probability: float
    confidence_score: float
    status_tier: str
    created_at: datetime

    class Config:
        from_attributes = True

# Analytics Schemas
class ModelMetricsResponse(BaseModel):
    best_model: str
    metrics: Dict[str, Any]
    models_comparison: Dict[str, Any]
    top_features: List[Dict[str, Any]]
    dataset_summary: Dict[str, Any]
    top_categories: List[str]
    top_countries: List[str]
    trained_at: str
