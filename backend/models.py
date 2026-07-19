from datetime import UTC, datetime
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base


def utc_now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(30), default="analyst")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    predictions = relationship("Prediction", back_populates="user")

class Prediction(Base):
    __tablename__ = "predictions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    startup_name: Mapped[str] = mapped_column(String(160))
    country: Mapped[str] = mapped_column(String(80))
    industry: Mapped[str] = mapped_column(String(80))
    funding: Mapped[float] = mapped_column(Float)
    team_size: Mapped[int] = mapped_column(Integer)
    experience: Mapped[float] = mapped_column(Float)
    revenue: Mapped[float] = mapped_column(Float)
    burn_rate: Mapped[float] = mapped_column(Float)
    market_size: Mapped[float] = mapped_column(Float)
    product_stage: Mapped[str] = mapped_column(String(40))
    investors: Mapped[int] = mapped_column(Integer)
    competition: Mapped[float] = mapped_column(Float)
    growth_rate: Mapped[float] = mapped_column(Float)
    prediction: Mapped[str] = mapped_column(String(20))
    probability: Mapped[float] = mapped_column(Float)
    model_accuracy: Mapped[float] = mapped_column(Float, default=0.87)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, index=True)
    user = relationship("User", back_populates="predictions")

class ApiLog(Base):
    __tablename__ = "api_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    event: Mapped[str] = mapped_column(String(40))
    method: Mapped[str] = mapped_column(String(10))
    path: Mapped[str] = mapped_column(String(255))
    status_code: Mapped[int] = mapped_column(Integer)
    detail: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, index=True)

class LoginEvent(Base):
    __tablename__ = "login_events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    success: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, index=True)
