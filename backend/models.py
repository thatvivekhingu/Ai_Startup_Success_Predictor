from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    startup_name = Column(String(100), nullable=False)
    primary_category = Column(String(100), nullable=False)
    country_code = Column(String(10), nullable=False)
    funding_total_usd = Column(Float, default=0.0)
    funding_rounds = Column(Integer, default=1)
    founded_year = Column(Integer, nullable=True)
    
    success_probability = Column(Float, nullable=False)
    confidence_score = Column(Float, nullable=False)
    status_tier = Column(String(50), nullable=False)
    
    strengths = Column(JSON, nullable=True)
    risk_factors = Column(JSON, nullable=True)
    recommendations = Column(JSON, nullable=True)
    input_details = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="predictions")
