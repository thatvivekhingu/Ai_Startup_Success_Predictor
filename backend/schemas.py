from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr
from datetime import datetime

# User Schemas
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: Optional[str] = "Student Innovator"
    institution: Optional[str] = "Gujarat Technological University (GTU) • SSIP 2.0 Cohort"
    avatar: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class SocialAuthRequest(BaseModel):
    provider: str  # google, microsoft, github
    email: EmailStr
    name: str
    username: Optional[str] = None
    avatar: Optional[str] = None
    role: Optional[str] = "Student Innovator"
    institution: Optional[str] = "Gujarat Technological University (GTU) • SSIP 2.0 Cohort"

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    institution: Optional[str] = None
    avatar: Optional[str] = None

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    role: Optional[str] = "Student Innovator"
    institution: Optional[str] = None
    avatar: Optional[str] = None
    provider: Optional[str] = "local"
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    username: Optional[str] = None

class FundingDealOut(BaseModel):
    id: int
    startup_name: str
    amount: str
    amount_usd: float
    round: str
    lead_investors: str
    existing_investors: Optional[str] = None
    sector: str
    valuation: Optional[str] = None
    source_url: str
    source_title: str
    summary: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

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
    is_gujarat_based: Optional[bool] = False
    gujarat_district: Optional[str] = None

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
    gujarat_insights: Optional[Dict[str, Any]] = None
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
