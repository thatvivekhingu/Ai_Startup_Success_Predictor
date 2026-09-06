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
# Real Indian Startup Success Presets
PRESETS = [
    {
        "id": "zerodha-bootstrapped",
        "name": "Zerodha (Bengaluru) – Bootstrapped FinTech",
        "primary_category": "Finance",
        "country_code": "IND",
        "funding_total_usd": 100000,
        "funding_rounds": 1,
        "founded_year": 2010,
        "first_funding_year": 2011,
        "last_funding_year": 2011,
        "team_size": 120,
        "has_accelerator": False,
        "patent_count": 2,
        "is_gujarat_based": False,
        "founder": "Nithin & Nikhil Kamath",
        "valuation": "$2.0 Billion (Profitable Day 1)"
    },
    {
        "id": "zepto-quickcommerce",
        "name": "Zepto (Mumbai/BLR) – 10-Min Quick Commerce",
        "primary_category": "E-Commerce",
        "country_code": "IND",
        "funding_total_usd": 650000000,
        "funding_rounds": 5,
        "founded_year": 2021,
        "first_funding_year": 2021,
        "last_funding_year": 2024,
        "team_size": 350,
        "has_accelerator": True,
        "patent_count": 1,
        "is_gujarat_based": False,
        "founder": "Aadit Palicha & Kaivalya Vohra",
        "valuation": "$5.0 Billion (Series E Unicorn)"
    },
    {
        "id": "razorpay-payments",
        "name": "Razorpay (Bengaluru) – Full-Stack FinTech",
        "primary_category": "Finance",
        "country_code": "IND",
        "funding_total_usd": 741000000,
        "funding_rounds": 7,
        "founded_year": 2014,
        "first_funding_year": 2015,
        "last_funding_year": 2023,
        "team_size": 300,
        "has_accelerator": True,
        "patent_count": 4,
        "is_gujarat_based": False,
        "founder": "Harshil Mathur & Shashank Kumar",
        "valuation": "$7.5 Billion (YC W15 Decacorn)"
    },
    {
        "id": "zomato-foodtech",
        "name": "Zomato & Blinkit (Gurugram) – FoodTech & Q-Commerce",
        "primary_category": "E-Commerce",
        "country_code": "IND",
        "funding_total_usd": 910000000,
        "funding_rounds": 8,
        "founded_year": 2008,
        "first_funding_year": 2010,
        "last_funding_year": 2021,
        "team_size": 450,
        "has_accelerator": False,
        "patent_count": 3,
        "is_gujarat_based": False,
        "founder": "Deepinder Goyal",
        "valuation": "$22+ Billion (NSE/BSE Listed Mega IPO)"
    },
    {
        "id": "lenskart-omnichannel",
        "name": "Lenskart (Delhi NCR) – Omnichannel D2C Eyewear",
        "primary_category": "E-Commerce",
        "country_code": "IND",
        "funding_total_usd": 1100000000,
        "funding_rounds": 9,
        "founded_year": 2010,
        "first_funding_year": 2011,
        "last_funding_year": 2024,
        "team_size": 500,
        "has_accelerator": False,
        "patent_count": 5,
        "is_gujarat_based": False,
        "founder": "Peyush Bansal",
        "valuation": "$4.5 Billion (Profitable Scale)"
    },
    {
        "id": "physicswallah-edtech",
        "name": "PhysicsWallah / PW (Noida) – Profitable EdTech Unicorn",
        "primary_category": "Education",
        "country_code": "IND",
        "funding_total_usd": 310000000,
        "funding_rounds": 2,
        "founded_year": 2020,
        "first_funding_year": 2022,
        "last_funding_year": 2024,
        "team_size": 280,
        "has_accelerator": False,
        "patent_count": 1,
        "is_gujarat_based": False,
        "founder": "Alakh Pandey & Prateek Maheshwari",
        "valuation": "$2.8 Billion (Profitable Scale)"
    },
    {
        "id": "postman-saas",
        "name": "Postman (Bengaluru) – Global API Platform SaaS",
        "primary_category": "Software",
        "country_code": "IND",
        "funding_total_usd": 433000000,
        "funding_rounds": 4,
        "founded_year": 2014,
        "first_funding_year": 2015,
        "last_funding_year": 2022,
        "team_size": 220,
        "has_accelerator": False,
        "patent_count": 2,
        "is_gujarat_based": False,
        "founder": "Abhinav Asthana",
        "valuation": "$5.6 Billion (Global Enterprise SaaS)"
    },
    {
        "id": "matter-motor-works",
        "name": "Matter Motor Works (Ahmedabad, Gujarat) – Liquid-Cooled EV Tech",
        "primary_category": "Clean Technology",
        "country_code": "IND",
        "funding_total_usd": 42000000,
        "funding_rounds": 3,
        "founded_year": 2019,
        "first_funding_year": 2021,
        "last_funding_year": 2024,
        "team_size": 95,
        "has_accelerator": True,
        "patent_count": 12,
        "is_gujarat_based": True,
        "gujarat_district": "Ahmedabad",
        "founder": "Mohal Lalbhai",
        "valuation": "₹1,200+ Crore (iCreate Incubated)"
    },
    {
        "id": "petpooja-saas",
        "name": "Petpooja (Ahmedabad, Gujarat) – Restaurant Operating System",
        "primary_category": "Software",
        "country_code": "IND",
        "funding_total_usd": 15000000,
        "funding_rounds": 3,
        "founded_year": 2011,
        "first_funding_year": 2015,
        "last_funding_year": 2023,
        "team_size": 180,
        "has_accelerator": True,
        "patent_count": 1,
        "is_gujarat_based": True,
        "gujarat_district": "Ahmedabad",
        "founder": "Parth Joshi & Apurv Patel",
        "valuation": "₹900+ Crore (Powers 75,000+ F&B Outlets)"
    },
    {
        "id": "beardo-d2c",
        "name": "Beardo (Ahmedabad, Gujarat) – Men's Grooming D2C Brand",
        "primary_category": "E-Commerce",
        "country_code": "IND",
        "funding_total_usd": 8500000,
        "funding_rounds": 3,
        "founded_year": 2015,
        "first_funding_year": 2016,
        "last_funding_year": 2018,
        "team_size": 60,
        "has_accelerator": False,
        "patent_count": 0,
        "is_gujarat_based": True,
        "gujarat_district": "Ahmedabad",
        "founder": "Ashutosh Valani & Priyank Shah",
        "valuation": "₹350 Crore (100% Acquired by Marico)"
    },
    {
        "id": "student-ssip-prototype",
        "name": "SSIP 2.0 Student Grantee (GTU Gujarat) – Campus IoT DeepTech",
        "primary_category": "Hardware",
        "country_code": "IND",
        "funding_total_usd": 30000,
        "funding_rounds": 1,
        "founded_year": 2024,
        "first_funding_year": 2024,
        "last_funding_year": 2024,
        "team_size": 4,
        "has_accelerator": True,
        "patent_count": 1,
        "is_gujarat_based": True,
        "gujarat_district": "Ahmedabad",
        "founder": "Student Innovator Team",
        "valuation": "₹2.5 Lakhs SSIP Govt Grant (TRL 4)"
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
