from datetime import UTC, datetime
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base

def utc_now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)

# ==========================================
# 1. CORE AUTH & AUDIT (PRESERVED)
# ==========================================
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(30), default="analyst")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    
    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")
    startups = relationship("StartupProfile", back_populates="owner", cascade="all, delete-orphan")
    agent_runs = relationship("AgentRun", back_populates="user")

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

# ==========================================
# 2. STARTUP DIGITAL TWIN CORE ENTITIES
# ==========================================
class StartupProfile(Base):
    __tablename__ = "startup_profiles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String(160), index=True)
    sector: Mapped[str] = mapped_column(String(80), default="Technology")
    industry: Mapped[str] = mapped_column(String(80), default="SaaS")
    country: Mapped[str] = mapped_column(String(80), default="India")
    state_city: Mapped[str] = mapped_column(String(120), default="Ahmedabad, Gujarat")
    stage: Mapped[str] = mapped_column(String(40), default="Seed")
    founding_year: Mapped[int] = mapped_column(Integer, default=2024)
    business_model: Mapped[str] = mapped_column(String(60), default="B2B Subscription")
    currency: Mapped[str] = mapped_column(String(10), default="INR")
    is_demo: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

    owner = relationship("User", back_populates="startups")
    financial_snapshots = relationship("FinancialSnapshot", back_populates="startup", cascade="all, delete-orphan")
    customer_metrics = relationship("CustomerMetric", back_populates="startup", cascade="all, delete-orphan")
    team_metrics = relationship("TeamMetric", back_populates="startup", cascade="all, delete-orphan")
    market_signals = relationship("MarketSignal", back_populates="startup", cascade="all, delete-orphan")
    events = relationship("StartupEvent", back_populates="startup", cascade="all, delete-orphan")
    early_warnings = relationship("EarlyWarning", back_populates="startup", cascade="all, delete-orphan")
    scenarios = relationship("SimulationScenario", back_populates="startup", cascade="all, delete-orphan")
    recommendations = relationship("AIRecommendation", back_populates="startup", cascade="all, delete-orphan")
    documents = relationship("MultimodalDocument", back_populates="startup", cascade="all, delete-orphan")
    agent_runs = relationship("AgentRun", back_populates="startup")

class FinancialSnapshot(Base):
    __tablename__ = "financial_snapshots"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    startup_id: Mapped[int] = mapped_column(ForeignKey("startup_profiles.id"))
    period_date: Mapped[str] = mapped_column(String(20)) # e.g. '2026-08'
    monthly_revenue: Mapped[float] = mapped_column(Float, default=0.0)
    monthly_expenses: Mapped[float] = mapped_column(Float, default=0.0)
    monthly_burn: Mapped[float] = mapped_column(Float, default=0.0)
    cash_balance: Mapped[float] = mapped_column(Float, default=0.0)
    total_funding: Mapped[float] = mapped_column(Float, default=0.0)
    valuation: Mapped[float] = mapped_column(Float, default=0.0)
    runway_months: Mapped[float] = mapped_column(Float, default=0.0)
    gross_margin_pct: Mapped[float] = mapped_column(Float, default=70.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    startup = relationship("StartupProfile", back_populates="financial_snapshots")

class CustomerMetric(Base):
    __tablename__ = "customer_metrics"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    startup_id: Mapped[int] = mapped_column(ForeignKey("startup_profiles.id"))
    period_date: Mapped[str] = mapped_column(String(20))
    customer_count: Mapped[int] = mapped_column(Integer, default=0)
    new_customers: Mapped[int] = mapped_column(Integer, default=0)
    churn_rate: Mapped[float] = mapped_column(Float, default=2.0)
    retention_rate: Mapped[float] = mapped_column(Float, default=95.0)
    cac: Mapped[float] = mapped_column(Float, default=0.0)
    ltv: Mapped[float] = mapped_column(Float, default=0.0)
    concentration_pct: Mapped[float] = mapped_column(Float, default=15.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    startup = relationship("StartupProfile", back_populates="customer_metrics")

class TeamMetric(Base):
    __tablename__ = "team_metrics"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    startup_id: Mapped[int] = mapped_column(ForeignKey("startup_profiles.id"))
    period_date: Mapped[str] = mapped_column(String(20))
    headcount: Mapped[int] = mapped_column(Integer, default=5)
    engineers: Mapped[int] = mapped_column(Integer, default=3)
    sales_reps: Mapped[int] = mapped_column(Integer, default=1)
    hiring_rate: Mapped[float] = mapped_column(Float, default=0.0)
    attrition_rate: Mapped[float] = mapped_column(Float, default=0.0)
    avg_experience_years: Mapped[float] = mapped_column(Float, default=5.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    startup = relationship("StartupProfile", back_populates="team_metrics")

class MarketSignal(Base):
    __tablename__ = "market_signals"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    startup_id: Mapped[int] = mapped_column(ForeignKey("startup_profiles.id"))
    signal_type: Mapped[str] = mapped_column(String(40)) # funding, macro, competitor, hiring
    title: Mapped[str] = mapped_column(String(160))
    source: Mapped[str] = mapped_column(String(80), default="Market Adapter")
    impact_score: Mapped[float] = mapped_column(Float, default=0.0) # -100 to +100
    confidence: Mapped[float] = mapped_column(Float, default=0.85)
    detail: Mapped[str] = mapped_column(Text)
    is_external: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    startup = relationship("StartupProfile", back_populates="market_signals")

class StartupEvent(Base):
    __tablename__ = "startup_events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    startup_id: Mapped[int] = mapped_column(ForeignKey("startup_profiles.id"))
    event_date: Mapped[str] = mapped_column(String(30))
    event_type: Mapped[str] = mapped_column(String(40)) # funding, hiring, product, metric_shift
    title: Mapped[str] = mapped_column(String(160))
    description: Mapped[str] = mapped_column(Text)
    metric_affected: Mapped[str | None] = mapped_column(String(80), nullable=True)
    change_value: Mapped[str | None] = mapped_column(String(80), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    startup = relationship("StartupProfile", back_populates="events")

class EarlyWarning(Base):
    __tablename__ = "early_warnings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    startup_id: Mapped[int] = mapped_column(ForeignKey("startup_profiles.id"))
    severity: Mapped[str] = mapped_column(String(20)) # critical, warning, opportunity
    category: Mapped[str] = mapped_column(String(40)) # cash, growth, hiring, competition
    title: Mapped[str] = mapped_column(String(160))
    description: Mapped[str] = mapped_column(Text)
    metric_affected: Mapped[str] = mapped_column(String(80))
    previous_value: Mapped[float] = mapped_column(Float)
    current_value: Mapped[float] = mapped_column(Float)
    confidence: Mapped[float] = mapped_column(Float, default=0.90)
    recommended_action: Mapped[str] = mapped_column(Text)
    is_resolved: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    startup = relationship("StartupProfile", back_populates="early_warnings")

class SimulationScenario(Base):
    __tablename__ = "simulation_scenarios"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    startup_id: Mapped[int] = mapped_column(ForeignKey("startup_profiles.id"))
    name: Mapped[str] = mapped_column(String(120))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    preset_type: Mapped[str] = mapped_column(String(40), default="custom") # aggressive, bootstrap, etc.
    variables_json: Mapped[dict] = mapped_column(JSON, default=dict)
    results_json: Mapped[dict] = mapped_column(JSON, default=dict)
    monte_carlo_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    is_baseline: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    startup = relationship("StartupProfile", back_populates="scenarios")

class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    startup_id: Mapped[int] = mapped_column(ForeignKey("startup_profiles.id"))
    category: Mapped[str] = mapped_column(String(40))
    title: Mapped[str] = mapped_column(String(160))
    impact: Mapped[str] = mapped_column(String(20), default="High") # High, Medium, Low
    urgency: Mapped[str] = mapped_column(String(20), default="Critical") # Critical, Warning, Routine
    confidence: Mapped[float] = mapped_column(Float, default=0.88)
    effort: Mapped[str] = mapped_column(String(20), default="Medium")
    action_steps_json: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(20), default="pending") # pending, confirmed, dismissed
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    startup = relationship("StartupProfile", back_populates="recommendations")

class AgentRun(Base):
    __tablename__ = "agent_runs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    startup_id: Mapped[int] = mapped_column(ForeignKey("startup_profiles.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    query: Mapped[str] = mapped_column(Text)
    intent: Mapped[str] = mapped_column(String(80), default="general_query")
    tools_called_json: Mapped[list] = mapped_column(JSON, default=list)
    reasoning_trace: Mapped[str] = mapped_column(Text, default="")
    response_markdown: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), default="completed")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    user = relationship("User", back_populates="agent_runs")
    startup = relationship("StartupProfile", back_populates="agent_runs")

class MultimodalDocument(Base):
    __tablename__ = "multimodal_documents"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    startup_id: Mapped[int] = mapped_column(ForeignKey("startup_profiles.id"))
    doc_type: Mapped[str] = mapped_column(String(30)) # text, csv, excel, pdf, voice
    filename: Mapped[str] = mapped_column(String(255))
    file_size: Mapped[int] = mapped_column(Integer, default=0)
    extracted_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    extracted_metrics_json: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    startup = relationship("StartupProfile", back_populates="documents")
