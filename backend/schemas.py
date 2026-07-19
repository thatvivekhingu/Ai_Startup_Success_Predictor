from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator


class RequestModel(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)


class AuthRequest(RequestModel):
    username: str = Field(min_length=1, max_length=80)
    password: str = Field(min_length=1, max_length=128)
    remember_me: bool = False


class RegisterRequest(RequestModel):
    username: str = Field(min_length=3, max_length=80, pattern=r"^[A-Za-z0-9._-]+$")
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class ProfileUpdate(RequestModel):
    username: str = Field(min_length=3, max_length=80, pattern=r"^[A-Za-z0-9._-]+$")
    email: EmailStr


class PasswordChange(RequestModel):
    current_password: str = Field(min_length=1, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


class UserAdminUpdate(RequestModel):
    role: Literal["admin", "analyst"] | None = None
    is_active: bool | None = None

    @model_validator(mode="after")
    def require_change(self):
        if self.role is None and self.is_active is None:
            raise ValueError("Provide a role or active status")
        return self

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class PredictionCreate(RequestModel):
    model_config = ConfigDict(str_strip_whitespace=True, allow_inf_nan=False)
    startup_name: str = Field(min_length=2, max_length=160)
    country: str = Field(min_length=2, max_length=80)
    industry: str = Field(min_length=2, max_length=80)
    funding: float = Field(ge=0)
    team_size: int = Field(ge=1, le=100000)
    experience: float = Field(ge=0, le=60)
    revenue: float = Field(ge=0)
    burn_rate: float = Field(ge=0)
    market_size: float = Field(ge=0)
    product_stage: Literal["Idea", "MVP", "Early Revenue", "Growth", "Scale"]
    investors: int = Field(ge=0, le=100000)
    competition: float = Field(ge=0, le=100)
    growth_rate: float = Field(ge=-100, le=1000)

class PredictionOut(PredictionCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    prediction: str
    probability: float
    model_accuracy: float
    created_at: datetime
    username: str | None = None
