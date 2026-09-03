from datetime import UTC, datetime, timedelta
import os
from typing import Annotated
from fastapi import Depends, FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from io import StringIO
import csv
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import desc, func
from sqlalchemy.orm import Session

from .database import Base, engine, get_db, SessionLocal
from .csv_service import analyze_csv
from .models import (
    ApiLog, LoginEvent, Prediction, User,
    StartupProfile, FinancialSnapshot, CustomerMetric,
    TeamMetric, MarketSignal, StartupEvent, EarlyWarning,
    SimulationScenario, AIRecommendation, AgentRun, MultimodalDocument
)
from .schemas import (
    AuthRequest, PasswordChange, PredictionCreate, ProfileUpdate,
    RegisterRequest, TokenResponse, UserAdminUpdate, UserOut
)
from .seed import seed_demo_workspace
from .seed_v2 import seed_nova_ai_digital_twin
from .services import CSV_FIELDS, analyze_startup, dashboard_stats, feature_importance, model_accuracy, model_metrics, record_log, score_startup
from .shap_service import calculate_shap_explanations
from .llm_copilot import copilot
from .health_engine import calculate_startup_health
from .forecasting_engine import generate_forecast
from .simulation_engine import run_what_if_simulation, PRESETS
from .monte_carlo_engine import run_monte_carlo_simulation
from .early_warning_engine import detect_early_warnings
from .agentic_copilot import agent_copilot
from .multimodal_service import parse_unstructured_text
from .signals_engine import signals_provider

SECRET_KEY = os.getenv("JWT_SECRET", "startup-predictor-demo-secret-change-in-production")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer = HTTPBearer(auto_error=False)

app = FastAPI(title="Foundr.AI 2.0 API", description="AI Digital Twin & Decision Intelligence Platform for Startups", version="2.0.0")

cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    if origin.strip()
]
app.add_middleware(CORSMiddleware, allow_origins=cors_origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.middleware("http")
async def audit_requests(request: Request, call_next):
    try:
        response = await call_next(request)
        code, detail = response.status_code, None
    except Exception as exc:
        code, detail = 500, str(exc)[:500]
        db = SessionLocal()
        try:
            record_log(db, "error", request.method, request.url.path, code, user_id=getattr(request.state, "user_id", None), detail=detail)
        finally:
            db.close()
        raise
    event = "error" if code >= 400 else "login" if request.url.path == "/login" else "api_request"
    db = SessionLocal()
    try:
        record_log(db, event, request.method, request.url.path, code, user_id=getattr(request.state, "user_id", None), detail=detail)
    finally:
        db.close()
    return response

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    demo = db.query(User).filter(User.username == "demo").first()
    if not demo:
        demo = User(username="demo", email="demo@foundr.ai", password_hash=pwd_context.hash("demo1234"), role="admin")
        db.add(demo)
        db.commit()
        db.refresh(demo)
    seed_demo_workspace(db, demo)
    seed_nova_ai_digital_twin(db, demo)
    db.close()

def make_token(user: User, remember: bool = False):
    expiry = datetime.now(UTC) + timedelta(days=7 if remember else 1)
    return jwt.encode({"sub": str(user.id), "exp": expiry}, SECRET_KEY, algorithm=ALGORITHM)

def current_user(request: Request, credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)], db: Session = Depends(get_db)) -> User:
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except (JWTError, TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User unavailable")
    request.state.user_id = user.id
    return user

def require_admin(user: User):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Administrator permissions required")

# ==========================================
# AUTH & PROFILE MANAGEMENT
# ==========================================
@app.post("/login")
def login(payload: AuthRequest, request: Request = None, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or not user.is_active or not pwd_context.verify(payload.password, user.password_hash):
        db.add(LoginEvent(user_id=user.id if user else None, success=False))
        db.commit()
        raise HTTPException(status_code=401, detail="Invalid username or password")
    db.add(LoginEvent(user_id=user.id, success=True))
    db.commit()
    return {"token": make_token(user, payload.remember_me), "user": {"id": user.id, "username": user.username, "role": user.role, "email": user.email}}

@app.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(400, "Username already registered")
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(400, "Email already registered")
    user = User(username=payload.username, email=payload.email, password_hash=pwd_context.hash(payload.password), role="analyst")
    db.add(user)
    db.commit()
    db.refresh(user)
    seed_nova_ai_digital_twin(db, user)
    return {"token": make_token(user), "user": {"id": user.id, "username": user.username, "role": user.role, "email": user.email}}

@app.get("/me")
def me(user: User = Depends(current_user)):
    return {"id": user.id, "username": user.username, "role": user.role, "email": user.email}

@app.put("/profile", response_model=UserOut)
def update_profile(payload: ProfileUpdate, db: Session = Depends(get_db), user: User = Depends(current_user)):
    existing = db.query(User).filter(User.id != user.id, (User.username == payload.username) | (User.email == payload.email)).first()
    if existing:
        raise HTTPException(409, "Username or email is already taken by another account")
    user.username = payload.username
    user.email = payload.email
    db.commit()
    db.refresh(user)
    return user

@app.post("/change-password")
def change_password(payload: PasswordChange, db: Session = Depends(get_db), user: User = Depends(current_user)):
    if not pwd_context.verify(payload.current_password, user.password_hash):
        raise HTTPException(400, "Incorrect current password")
    user.password_hash = pwd_context.hash(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

@app.get("/users")
def users(db: Session = Depends(get_db), user: User = Depends(current_user)):
    require_admin(user)
    items = db.query(User).order_by(User.created_at.desc()).all()
    return {"items": [UserOut.model_validate(u) for u in items]}

@app.put("/users/{user_id}", response_model=UserOut)
def update_user(user_id: int, payload: UserAdminUpdate, db: Session = Depends(get_db), user: User = Depends(current_user)):
    require_admin(user)
    target = db.get(User, user_id)
    if not target:
        raise HTTPException(404, "User not found")
    if target.id == user.id and payload.is_active is False:
        raise HTTPException(400, "Cannot deactivate your own administrator account")
    if payload.role is not None:
        target.role = payload.role
    if payload.is_active is not None:
        target.is_active = payload.is_active
    db.commit()
    db.refresh(target)
    return target

# ==========================================
# FOUNDR.AI 2.0 DIGITAL TWIN ENDPOINTS
# ==========================================
def get_user_startup(db: Session, user: User) -> StartupProfile:
    startup = db.query(StartupProfile).filter(StartupProfile.user_id == user.id).first()
    if not startup:
        startup = seed_nova_ai_digital_twin(db, user)
    return startup

@app.get("/api/startup/twin")
def get_digital_twin(db: Session = Depends(get_db), user: User = Depends(current_user)):
    startup = get_user_startup(db, user)
    fin_snaps = db.query(FinancialSnapshot).filter(FinancialSnapshot.startup_id == startup.id).order_by(FinancialSnapshot.period_date.asc()).all()
    cust_snaps = db.query(CustomerMetric).filter(CustomerMetric.startup_id == startup.id).order_by(CustomerMetric.period_date.asc()).all()
    team_snaps = db.query(TeamMetric).filter(TeamMetric.startup_id == startup.id).order_by(TeamMetric.period_date.asc()).all()
    signals = db.query(MarketSignal).filter(MarketSignal.startup_id == startup.id).all()
    events = db.query(StartupEvent).filter(StartupEvent.startup_id == startup.id).order_by(StartupEvent.event_date.desc()).all()

    latest_fin = fin_snaps[-1] if fin_snaps else None
    latest_cust = cust_snaps[-1] if cust_snaps else None
    latest_team = team_snaps[-1] if team_snaps else None

    state_dict = {
        "monthly_revenue": latest_fin.monthly_revenue if latest_fin else 1860000.0,
        "monthly_burn": latest_fin.monthly_burn if latest_fin else 1240000.0,
        "cash_balance": latest_fin.cash_balance if latest_fin else 8210000.0,
        "growth_rate": 18.0,
        "headcount": latest_team.headcount if latest_team else 13,
        "churn_rate": latest_cust.churn_rate if latest_cust else 2.4,
        "retention_rate": latest_cust.retention_rate if latest_cust else 97.6,
        "market_size": 250000000.0,
        "competition": 45.0
    }

    health = calculate_startup_health(state_dict)

    return {
        "startup": {
            "id": startup.id,
            "name": startup.name,
            "sector": startup.sector,
            "industry": startup.industry,
            "country": startup.country,
            "state_city": startup.state_city,
            "stage": startup.stage,
            "founding_year": startup.founding_year,
            "currency": startup.currency,
            "is_demo": startup.is_demo
        },
        "health_score": health["overall_health"],
        "health_status": health["status"],
        "health_summary": health["summary"],
        "runway_months": health["runway_months"],
        "burn_multiple": health["burn_multiple"],
        "current_financials": {
            "revenue": state_dict["monthly_revenue"],
            "burn": state_dict["monthly_burn"],
            "cash": state_dict["cash_balance"],
            "valuation": latest_fin.valuation if latest_fin else 35000000.0,
            "funding": latest_fin.total_funding if latest_fin else 5000000.0
        },
        "current_customers": {
            "count": latest_cust.customer_count if latest_cust else 445,
            "churn_rate": state_dict["churn_rate"],
            "retention_rate": state_dict["retention_rate"],
            "cac": latest_cust.cac if latest_cust else 18500.0,
            "ltv": latest_cust.ltv if latest_cust else 145000.0
        },
        "current_team": {
            "headcount": state_dict["headcount"],
            "engineers": latest_team.engineers if latest_team else 8,
            "sales": latest_team.sales_reps if latest_team else 3
        },
        "historical_financials": [
            {"period": f.period_date, "revenue": f.monthly_revenue, "burn": f.monthly_burn, "cash": f.cash_balance, "runway": f.runway_months}
            for f in fin_snaps
        ],
        "signals_count": len(signals),
        "events_count": len(events)
    }

@app.get("/api/startup/health")
def get_health_score(db: Session = Depends(get_db), user: User = Depends(current_user)):
    startup = get_user_startup(db, user)
    fin_snaps = db.query(FinancialSnapshot).filter(FinancialSnapshot.startup_id == startup.id).order_by(FinancialSnapshot.period_date.asc()).all()
    latest_fin = fin_snaps[-1] if fin_snaps else None
    metrics = {
        "monthly_revenue": latest_fin.monthly_revenue if latest_fin else 1860000.0,
        "monthly_burn": latest_fin.monthly_burn if latest_fin else 1240000.0,
        "cash_balance": latest_fin.cash_balance if latest_fin else 8210000.0,
        "growth_rate": 18.0,
        "headcount": 13,
        "churn_rate": 2.4,
        "retention_rate": 97.6,
        "market_size": 250000000.0,
        "competition": 45.0
    }
    return calculate_startup_health(metrics)

@app.get("/api/startup/timeline")
def get_timeline(db: Session = Depends(get_db), user: User = Depends(current_user)):
    startup = get_user_startup(db, user)
    events = db.query(StartupEvent).filter(StartupEvent.startup_id == startup.id).order_by(StartupEvent.event_date.desc()).all()
    return [
        {"id": e.id, "date": e.event_date, "type": e.event_type, "title": e.title, "description": e.description, "metric": e.metric_affected, "change": e.change_value}
        for e in events
    ]

@app.get("/api/early-warnings")
def get_early_warnings_api(db: Session = Depends(get_db), user: User = Depends(current_user)):
    startup = get_user_startup(db, user)
    db_warnings = db.query(EarlyWarning).filter(EarlyWarning.startup_id == startup.id).order_by(EarlyWarning.severity.asc()).all()
    if not db_warnings:
        fin_snaps = db.query(FinancialSnapshot).filter(FinancialSnapshot.startup_id == startup.id).all()
        latest_fin = fin_snaps[-1] if fin_snaps else None
        current_metrics = {
            "monthly_revenue": latest_fin.monthly_revenue if latest_fin else 1860000.0,
            "monthly_burn": latest_fin.monthly_burn if latest_fin else 1240000.0,
            "cash_balance": latest_fin.cash_balance if latest_fin else 8210000.0,
            "growth_rate": 18.0,
            "headcount": 13
        }
        return detect_early_warnings(current_metrics)
    return [
        {
            "id": w.id, "severity": w.severity, "category": w.category, "title": w.title,
            "description": w.description, "metric_affected": w.metric_affected,
            "previous_value": w.previous_value, "current_value": w.current_value,
            "confidence": w.confidence, "recommended_action": w.recommended_action
        }
        for w in db_warnings
    ]

@app.get("/api/forecast")
def get_forecast_api(db: Session = Depends(get_db), user: User = Depends(current_user)):
    startup = get_user_startup(db, user)
    fin_snaps = db.query(FinancialSnapshot).filter(FinancialSnapshot.startup_id == startup.id).order_by(FinancialSnapshot.period_date.asc()).all()
    cust_snaps = db.query(CustomerMetric).filter(CustomerMetric.startup_id == startup.id).order_by(CustomerMetric.period_date.asc()).all()
    history_arr = []
    for i, f in enumerate(fin_snaps):
        c = cust_snaps[i] if i < len(cust_snaps) else None
        history_arr.append({
            "period_date": f.period_date, "monthly_revenue": f.monthly_revenue,
            "monthly_burn": f.monthly_burn, "cash_balance": f.cash_balance,
            "customer_count": c.customer_count if c else 300
        })
    return generate_forecast(history_arr, horizon_months=12)

@app.post("/api/simulation")
def run_simulation_api(payload: dict, db: Session = Depends(get_db), user: User = Depends(current_user)):
    startup = get_user_startup(db, user)
    fin_snaps = db.query(FinancialSnapshot).filter(FinancialSnapshot.startup_id == startup.id).order_by(FinancialSnapshot.period_date.asc()).all()
    latest_fin = fin_snaps[-1] if fin_snaps else None
    baseline = {
        "monthly_revenue": latest_fin.monthly_revenue if latest_fin else 1860000.0,
        "monthly_burn": latest_fin.monthly_burn if latest_fin else 1240000.0,
        "cash_balance": latest_fin.cash_balance if latest_fin else 8210000.0,
        "growth_rate": 18.0,
        "headcount": 13,
        "market_size": 250000000.0,
        "competition": 45.0
    }
    variables = payload.get("variables", PRESETS["bootstrap"]["variables"])
    return run_what_if_simulation(baseline, variables)

@app.post("/api/simulation/monte-carlo")
def run_monte_carlo_api(payload: dict | None = None, db: Session = Depends(get_db), user: User = Depends(current_user)):
    startup = get_user_startup(db, user)
    fin_snaps = db.query(FinancialSnapshot).filter(FinancialSnapshot.startup_id == startup.id).order_by(FinancialSnapshot.period_date.asc()).all()
    latest_fin = fin_snaps[-1] if fin_snaps else None
    baseline = {
        "monthly_revenue": latest_fin.monthly_revenue if latest_fin else 1860000.0,
        "monthly_burn": latest_fin.monthly_burn if latest_fin else 1240000.0,
        "cash_balance": latest_fin.cash_balance if latest_fin else 8210000.0,
        "growth_rate": 18.0
    }
    return run_monte_carlo_simulation(baseline, num_simulations=1500)

@app.get("/api/scenarios")
def get_scenarios(db: Session = Depends(get_db), user: User = Depends(current_user)):
    startup = get_user_startup(db, user)
    scenarios = db.query(SimulationScenario).filter(SimulationScenario.startup_id == startup.id).all()
    return [
        {"id": s.id, "name": s.name, "description": s.description, "preset_type": s.preset_type, "variables": s.variables_json, "results": s.results_json, "is_baseline": s.is_baseline}
        for s in scenarios
    ]

@app.post("/api/scenarios/compare")
def compare_scenarios_api(db: Session = Depends(get_db), user: User = Depends(current_user)):
    startup = get_user_startup(db, user)
    scenarios = db.query(SimulationScenario).filter(SimulationScenario.startup_id == startup.id).all()
    matrix = []
    for s in scenarios:
        res = s.results_json.get("simulated", {})
        deltas = s.results_json.get("deltas", {})
        matrix.append({
            "name": s.name,
            "preset_type": s.preset_type,
            "projected_revenue": res.get("revenue", 0),
            "projected_burn": res.get("burn", 0),
            "runway_months": res.get("runway_months", 0),
            "health_score": res.get("health_score", 0),
            "risk_impact": deltas.get("risk_impact", "Neutral"),
            "risk_color": deltas.get("risk_color", "emerald")
        })
    return matrix

@app.post("/api/agent/run")
def run_agent_copilot(payload: dict, db: Session = Depends(get_db), user: User = Depends(current_user)):
    startup = get_user_startup(db, user)
    fin_snaps = db.query(FinancialSnapshot).filter(FinancialSnapshot.startup_id == startup.id).order_by(FinancialSnapshot.period_date.asc()).all()
    latest_fin = fin_snaps[-1] if fin_snaps else None
    query = payload.get("query", "How can I survive the next 12 months?")
    startup_data = {
        "startup_name": startup.name,
        "country": startup.country,
        "industry": startup.industry,
        "monthly_revenue": latest_fin.monthly_revenue if latest_fin else 1860000.0,
        "monthly_burn": latest_fin.monthly_burn if latest_fin else 1240000.0,
        "cash_balance": latest_fin.cash_balance if latest_fin else 8210000.0,
        "funding": latest_fin.total_funding if latest_fin else 5000000.0,
        "growth_rate": 18.0,
        "headcount": 13,
        "team_size": 13,
        "experience": 5.4,
        "market_size": 250000000.0,
        "competition": 45.0,
        "product_stage": startup.stage,
        "investors": 3
    }
    history_arr = [
        {"period_date": f.period_date, "monthly_revenue": f.monthly_revenue, "monthly_burn": f.monthly_burn, "cash_balance": f.cash_balance, "customer_count": 300}
        for f in fin_snaps
    ]
    agent_res = agent_copilot.execute_plan(query, startup_data, history_arr)
    db.add(AgentRun(
        startup_id=startup.id,
        user_id=user.id,
        query=query,
        intent=agent_res["intent"],
        tools_called_json=agent_res["tools_called"],
        reasoning_trace=agent_res["reasoning_trace"],
        response_markdown=agent_res["response_markdown"],
        status="completed"
    ))
    db.commit()
    return agent_res

@app.get("/api/signals")
def get_signals_api(db: Session = Depends(get_db), user: User = Depends(current_user)):
    startup = get_user_startup(db, user)
    db_signals = db.query(MarketSignal).filter(MarketSignal.startup_id == startup.id).all()
    if db_signals:
        return [
            {"id": s.id, "type": s.signal_type, "title": s.title, "source": s.source, "impact": s.impact_score, "confidence": s.confidence, "detail": s.detail, "is_external": s.is_external}
            for s in db_signals
        ]
    return signals_provider.fetch_signals(startup.sector, startup.country)

@app.post("/api/ingest/text")
def ingest_text_metrics(payload: dict, db: Session = Depends(get_db), user: User = Depends(current_user)):
    text = payload.get("text", "")
    extracted = parse_unstructured_text(text)
    return {
        "raw_text": text,
        "extracted_metrics": extracted,
        "status": "success" if extracted else "no_metrics_found",
        "message": f"Successfully extracted {len(extracted)} digital twin parameters." if extracted else "Could not extract numerical metrics from statement."
    }

@app.get("/api/data-quality")
def get_data_quality(db: Session = Depends(get_db), user: User = Depends(current_user)):
    startup = get_user_startup(db, user)
    fin_count = db.query(FinancialSnapshot).filter(FinancialSnapshot.startup_id == startup.id).count()
    completeness = 92 if fin_count >= 6 else 65
    freshness = 95 if startup.updated_at >= datetime.now(UTC).replace(tzinfo=None) - timedelta(days=30) else 70
    reliability = 88
    overall = round((completeness * 0.4 + freshness * 0.3 + reliability * 0.3))
    return {
        "overall_quality": overall,
        "quality_label": "EXCELLENT" if overall >= 85 else "GOOD" if overall >= 70 else "NEEDS ENRICHMENT",
        "completeness_pct": completeness,
        "freshness_pct": freshness,
        "reliability_pct": reliability,
        "total_historical_months": fin_count,
        "disclaimer": "Metrics are evaluated against venture completeness benchmarks. Low data completeness directly lowers model confidence intervals."
    }

@app.post("/api/reports/generate")
def generate_intelligence_report(db: Session = Depends(get_db), user: User = Depends(current_user)):
    startup = get_user_startup(db, user)
    fin_snaps = db.query(FinancialSnapshot).filter(FinancialSnapshot.startup_id == startup.id).order_by(FinancialSnapshot.period_date.asc()).all()
    latest_fin = fin_snaps[-1] if fin_snaps else None
    startup_dict = {
        "startup_name": startup.name,
        "country": startup.country,
        "industry": startup.industry,
        "funding": latest_fin.total_funding if latest_fin else 5000000.0,
        "team_size": 13,
        "experience": 5.4,
        "revenue": latest_fin.monthly_revenue * 12 if latest_fin else 22000000.0,
        "burn_rate": latest_fin.monthly_burn if latest_fin else 1240000.0,
        "market_size": 250000000.0,
        "product_stage": startup.stage,
        "investors": 3,
        "competition": 45.0,
        "growth_rate": 18.0
    }
    advisory = copilot.generate_advisory(startup_dict)
    health = calculate_startup_health(startup_dict)
    warnings = detect_early_warnings(startup_dict)
    report_md = f"""# 🏛️ Foundr.AI 2.0 — Comprehensive Startup Intelligence Report
**Entity:** {startup.name} | **Location:** {startup.state_city}, {startup.country}
**Sector:** {startup.sector} ({startup.industry}) | **Stage:** {startup.stage}
**Date of Assessment:** {datetime.now().strftime('%d %B %Y')}

---

## 1. Executive Summary & Health Index
- **Overall Startup Health Score:** `{health['overall_health']}/100` ({health['status']})
- **ML Predicted Success Probability:** `{advisory['probability'] * 100:.1f}%` ({advisory['verdict']})
- **Funded Runway:** `{health['runway_months']} Months`
- **Assessment Tier:** `{advisory['tier']}`

---

## 2. 6-Pillar Health Score Breakdown
"""
    for p in health["pillars"]:
        report_md += f"- **{p['name']} ({p['score']}/100 - {p['status']}):** {p['detail']}\n"
    report_md += f"""
---

## 3. Active Early Warnings & Risk Anomalies
"""
    for w in warnings[:3]:
        report_md += f"- **[{w['severity'].upper()}] {w['title']}:** {w['description']}\n  *Recommended Remedy:* {w['recommended_action']}\n"
    report_md += f"""
---

## 4. LLM Executive Investment Memo
{advisory['investment_memo_markdown']}

---

## 5. Methodology & Disclaimers
*Report generated by Foundr.AI 2.0 Decision Intelligence Engine combining Gradient Boosted Trees (ROC-AUC 0.82 on 66k records), PyTorch Deep Tabular Networks, SHAP Explainability, and Google Gemini LLM reasoning. Predictions reflect statistical probabilities, not financial guarantees.*
"""
    return {"startup_name": startup.name, "report_markdown": report_md, "health_score": health["overall_health"], "success_probability": advisory["probability"]}

# ==========================================
# PRESERVED PREDICTION, CSV & DASHBOARD ROUTES
# ==========================================
@app.post("/predict")
def predict_single(payload: PredictionCreate, db: Session = Depends(get_db), user: User = Depends(current_user)):
    data = payload.model_dump()
    prediction_label, probability = score_startup(data)
    acc = model_accuracy()
    pred_obj = Prediction(
        user_id=user.id,
        startup_name=payload.startup_name,
        country=payload.country,
        industry=payload.industry,
        funding=payload.funding,
        team_size=payload.team_size,
        experience=payload.experience,
        revenue=payload.revenue,
        burn_rate=payload.burn_rate,
        market_size=payload.market_size,
        product_stage=payload.product_stage,
        investors=payload.investors,
        competition=payload.competition,
        growth_rate=payload.growth_rate,
        prediction=prediction_label,
        probability=probability,
        model_accuracy=acc
    )
    db.add(pred_obj)
    db.commit()
    db.refresh(pred_obj)
    analysis = analyze_startup(data, probability=probability, accuracy=acc)
    return {"prediction": pred_obj, "analysis": analysis}

@app.post("/simulate")
def simulate(payload: PredictionCreate, db: Session = Depends(get_db), user: User = Depends(current_user)):
    data = payload.model_dump()
    prediction_label, probability = score_startup(data)
    acc = model_accuracy()
    analysis = analyze_startup(data, probability=probability, accuracy=acc)
    return {"persisted": False, "prediction": prediction_label, "probability": probability, "model_accuracy": acc, "analysis": analysis}

@app.post("/predict/csv")
async def predict_csv(file: UploadFile = File(...), db: Session = Depends(get_db), user: User = Depends(current_user)):
    content = await file.read()
    results = analyze_csv(content)
    # Persist valid rows into user predictions
    for item in results.get("preview", []):
        try:
            pred_obj = Prediction(
                user_id=user.id,
                startup_name=item.get("startup_name", "CSV Venture"),
                country=item.get("country", "India"),
                industry=item.get("industry", "Technology"),
                funding=float(item.get("funding", 0)),
                team_size=int(item.get("team_size", 5)),
                experience=float(item.get("experience", 3)),
                revenue=float(item.get("revenue", 0)),
                burn_rate=float(item.get("burn_rate", 0)),
                market_size=float(item.get("market_size", 10000000)),
                product_stage=item.get("product_stage", "MVP"),
                investors=int(item.get("investors", 1)),
                competition=float(item.get("competition", 50)),
                growth_rate=float(item.get("growth_rate", 10)),
                prediction=item.get("prediction", "Likely to succeed"),
                probability=float(item.get("probability", 0.75)),
                model_accuracy=0.87
            )
            db.add(pred_obj)
        except Exception:
            continue
    db.commit()
    return {"created": results.get("valid_count", 0), "skipped": results.get("invalid_count", 0), "results": results.get("preview", [])}

@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db), user: User = Depends(current_user)):
    preds = db.query(Prediction).filter(Prediction.user_id == user.id).order_by(Prediction.created_at.desc()).all()
    stats = dashboard_stats(db, user_id=None if user.role == "admin" else user.id)
    latest_analysis = None
    if preds:
        latest = preds[0]
        data = {
            "startup_name": latest.startup_name, "country": latest.country, "industry": latest.industry,
            "funding": latest.funding, "team_size": latest.team_size, "experience": latest.experience,
            "revenue": latest.revenue, "burn_rate": latest.burn_rate, "market_size": latest.market_size,
            "product_stage": latest.product_stage, "investors": latest.investors, "competition": latest.competition,
            "growth_rate": latest.growth_rate
        }
        latest_analysis = {"startup": data, "analysis": analyze_startup(data, probability=latest.probability, accuracy=latest.model_accuracy)}
    return {"stats": stats, "recent": [{"id": p.id, "startup_name": p.startup_name, "prediction": p.prediction, "probability": p.probability} for p in preds[:5]], "latest_analysis": latest_analysis}

@app.get("/history")
def history(db: Session = Depends(get_db), user: User = Depends(current_user), limit: int = 20, offset: int = 0, sort_by: str = "date_desc", industry: str | None = None):
    q = db.query(Prediction).filter(Prediction.user_id == user.id)
    if industry:
        q = q.filter(Prediction.industry == industry)
    items = q.order_by(Prediction.created_at.desc()).offset(offset).limit(limit).all()
    return {"items": [{"id": p.id, "startup_name": p.startup_name, "industry": p.industry, "prediction": p.prediction, "probability": p.probability, "created_at": p.created_at} for p in items]}

@app.get("/analytics")
def analytics(db: Session = Depends(get_db), user: User = Depends(current_user)):
    preds = db.query(Prediction).filter(Prediction.user_id == user.id).all()
    stats = dashboard_stats(db, user_id=None if user.role == "admin" else user.id)
    ind_counts = {}
    for p in preds:
        ind_counts[p.industry] = ind_counts.get(p.industry, 0) + 1
    return {
        "stats": stats,
        "industries": [{"name": k, "count": v} for k, v in ind_counts.items()],
        "users": [{"name": user.username, "count": len(preds)}]
    }

@app.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db), user: User = Depends(current_user)):
    return dashboard_stats(db, user_id=None if user.role == "admin" else user.id)

@app.get("/feature-importance")
def get_feature_importance():
    return feature_importance()

@app.get("/model-metrics")
def get_model_metrics():
    return model_metrics()

@app.post("/copilot/advisory")
def generate_copilot_advisory(payload: PredictionCreate, user: User = Depends(current_user)):
    return copilot.generate_advisory(payload.model_dump())

@app.get("/download-csv")
def download_csv(db: Session = Depends(get_db), user: User = Depends(current_user)):
    rows = db.query(Prediction).filter(Prediction.user_id == user.id).order_by(desc(Prediction.created_at)).all()
    if not rows:
        raise HTTPException(404, "No predictions available to export")
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=CSV_FIELDS)
    writer.writeheader()
    for row in rows:
        writer.writerow({
            "username": user.username,
            "date": row.created_at.isoformat(),
            "startup": row.startup_name,
            "funding": row.funding,
            "industry": row.industry,
            "prediction": row.prediction,
            "probability": row.probability,
            "accuracy": row.model_accuracy
        })
    headers = {"Content-Disposition": 'attachment; filename="foundr-ai-predictions.csv"'}
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv", headers=headers)
