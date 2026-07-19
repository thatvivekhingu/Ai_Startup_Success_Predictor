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
from .models import ApiLog, LoginEvent, Prediction, User
from .schemas import (
    AuthRequest,
    PasswordChange,
    PredictionCreate,
    ProfileUpdate,
    RegisterRequest,
    TokenResponse,
    UserAdminUpdate,
    UserOut,
)
from .seed import seed_demo_workspace
from .services import CSV_FIELDS, analyze_startup, dashboard_stats, feature_importance, model_accuracy, model_metrics, record_log, score_startup

SECRET_KEY = os.getenv("JWT_SECRET", "startup-predictor-demo-secret-change-in-production")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer = HTTPBearer(auto_error=False)
app = FastAPI(title="Foundr.AI API", version="1.1.0")
cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
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
        try: record_log(db, "error", request.method, request.url.path, code, user_id=getattr(request.state, "user_id", None), detail=detail)
        finally: db.close()
        raise
    event = "error" if code >= 400 else "login" if request.url.path == "/login" else "prediction" if request.url.path == "/predict" else "api_request"
    db = SessionLocal()
    try: record_log(db, event, request.method, request.url.path, code, user_id=getattr(request.state, "user_id", None), detail=detail)
    finally: db.close()
    return response

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    demo = db.query(User).filter(User.username == "demo").first()
    if not demo:
        demo = User(username="demo", email="demo@startupsignal.dev", password_hash=pwd_context.hash("demo1234"), role="admin")
        db.add(demo)
        db.commit()
        db.refresh(demo)
    seed_demo_workspace(db, demo)
    db.close()

def make_token(user: User, remember: bool = False):
    expiry = datetime.now(UTC) + timedelta(days=7 if remember else 1)
    return jwt.encode({"sub": str(user.id), "exp": expiry}, SECRET_KEY, algorithm=ALGORITHM)

def current_user(request: Request, credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)], db: Session = Depends(get_db)) -> User:
    if not credentials: raise HTTPException(status_code=401, detail="Authentication required")
    try: payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM]); user_id = int(payload.get("sub"))
    except (JWTError, TypeError, ValueError): raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.get(User, user_id)
    if not user or not user.is_active: raise HTTPException(status_code=401, detail="User unavailable")
    request.state.user_id = user.id
    return user

def prediction_query(db: Session, user: User):
    query = db.query(Prediction)
    return query if user.role == "admin" else query.filter(Prediction.user_id == user.id)

def prediction_inputs(p: Prediction):
    return {
        "startup_name": p.startup_name,
        "country": p.country,
        "industry": p.industry,
        "funding": p.funding,
        "team_size": p.team_size,
        "experience": p.experience,
        "revenue": p.revenue,
        "burn_rate": p.burn_rate,
        "market_size": p.market_size,
        "product_stage": p.product_stage,
        "investors": p.investors,
        "competition": p.competition,
        "growth_rate": p.growth_rate,
    }

def peer_context(db: Session, user: User, industry: str, exclude_id: int | None = None):
    query = prediction_query(db, user).filter(Prediction.industry == industry)
    if exclude_id is not None:
        query = query.filter(Prediction.id != exclude_id)
    peers = [row[0] for row in query.with_entities(Prediction.probability).all()]
    return peers, f"{industry} workspace peers"

def require_admin(user: User):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Administrator access required")

def auth_response(user: User, remember=False): return {"access_token": make_token(user, remember), "token_type": "bearer", "user": UserOut.model_validate(user)}

@app.get("/health")
def health(): return {"status": "ok", "service": "Foundr.AI API"}

@app.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest, request: Request, db: Session = Depends(get_db)):
    username = payload.username.strip()
    email = str(payload.email).lower()
    if db.query(User).filter((func.lower(User.username) == username.lower()) | (func.lower(User.email) == email)).first():
        raise HTTPException(409, "Username or email already exists")
    user = User(username=username, email=email, password_hash=pwd_context.hash(payload.password))
    db.add(user); db.commit(); db.refresh(user); db.add(LoginEvent(user_id=user.id)); db.commit(); request.state.user_id = user.id
    return auth_response(user)

@app.post("/login", response_model=TokenResponse)
def login(payload: AuthRequest, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(func.lower(User.username) == payload.username.lower()).first()
    valid = bool(user and user.is_active and pwd_context.verify(payload.password, user.password_hash))
    db.add(LoginEvent(user_id=user.id if user else None, success=valid)); db.commit()
    if not valid: raise HTTPException(401, "Invalid username or password")
    request.state.user_id = user.id
    return auth_response(user, payload.remember_me)

@app.get("/me", response_model=UserOut)
def me(user: User = Depends(current_user)): return user


@app.patch("/me", response_model=UserOut)
def update_profile(payload: ProfileUpdate, db: Session = Depends(get_db), user: User = Depends(current_user)):
    username = payload.username.strip()
    email = str(payload.email).lower()
    duplicate = db.query(User).filter(
        User.id != user.id,
        (func.lower(User.username) == username.lower()) | (func.lower(User.email) == email),
    ).first()
    if duplicate:
        raise HTTPException(409, "Username or email already exists")
    user.username = username
    user.email = email
    db.commit()
    db.refresh(user)
    return user


@app.post("/me/password", status_code=204)
def change_password(payload: PasswordChange, db: Session = Depends(get_db), user: User = Depends(current_user)):
    if not pwd_context.verify(payload.current_password, user.password_hash):
        raise HTTPException(400, "Current password is incorrect")
    if payload.current_password == payload.new_password:
        raise HTTPException(400, "New password must be different")
    user.password_hash = pwd_context.hash(payload.new_password)
    db.commit()

@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db), user: User = Depends(current_user)):
    user_id = None if user.role == "admin" else user.id
    stats = dashboard_stats(db, user_id)
    recent = prediction_query(db, user).order_by(desc(Prediction.created_at)).limit(6).all()
    industry_query = db.query(Prediction.industry, func.count(Prediction.id).label("count"))
    if user_id is not None: industry_query = industry_query.filter(Prediction.user_id == user_id)
    industries = industry_query.group_by(Prediction.industry).order_by(desc("count")).limit(6).all()
    latest_analysis = None
    if recent:
        peers, scope = peer_context(db, user, recent[0].industry, recent[0].id)
        latest_analysis = {
            "startup": prediction_dict(recent[0]),
            "analysis": analyze_startup(
                prediction_inputs(recent[0]),
                recent[0].probability,
                recent[0].model_accuracy,
                peers,
                scope,
            ),
        }
    return {"stats": stats, "recent": [prediction_dict(p) for p in recent], "industries": [{"name": n, "count": c} for n,c in industries], "latest_analysis": latest_analysis}

def prediction_dict(p: Prediction):
    return {"id": p.id, "startup_name": p.startup_name, "country": p.country, "industry": p.industry, "funding": p.funding, "prediction": p.prediction, "probability": p.probability, "model_accuracy": p.model_accuracy, "created_at": p.created_at.isoformat(), "username": p.user.username if p.user else None}

@app.post("/predict")
def predict(payload: PredictionCreate, db: Session = Depends(get_db), user: User = Depends(current_user)):
    values = payload.model_dump()
    label, probability = score_startup(values)
    accuracy = model_accuracy()
    peers, scope = peer_context(db, user, payload.industry)
    p = Prediction(user_id=user.id, **values, prediction=label, probability=probability, model_accuracy=accuracy)
    db.add(p); db.commit(); db.refresh(p)
    return {**prediction_dict(p), "inputs": values, "analysis": analyze_startup(values, probability, accuracy, peers, scope)}

@app.post("/simulate")
def simulate(payload: PredictionCreate, db: Session = Depends(get_db), user: User = Depends(current_user)):
    values = payload.model_dump()
    label, probability = score_startup(values)
    accuracy = model_accuracy()
    peers, scope = peer_context(db, user, payload.industry)
    return {
        "startup_name": payload.startup_name,
        "prediction": label,
        "probability": probability,
        "model_accuracy": accuracy,
        "inputs": values,
        "analysis": analyze_startup(values, probability, accuracy, peers, scope),
        "persisted": False,
    }

def csv_public_result(result: dict):
    return {key: value for key, value in result.items() if key != "valid_payloads"}

@app.post("/csv/validate")
async def validate_csv(file: UploadFile = File(...), user: User = Depends(current_user)):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(422, "Upload a .csv file")
    try:
        result = analyze_csv(await file.read())
    except ValueError as exc:
        raise HTTPException(422, str(exc)) from exc
    return csv_public_result(result)

@app.post("/csv/predict")
async def predict_csv(file: UploadFile = File(...), db: Session = Depends(get_db), user: User = Depends(current_user)):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(422, "Upload a .csv file")
    try:
        validation = analyze_csv(await file.read())
    except ValueError as exc:
        raise HTTPException(422, str(exc)) from exc
    if not validation["valid_payloads"]:
        raise HTTPException(422, "No valid rows are available for prediction")

    accuracy = model_accuracy()
    peer_cache = {}
    results = []
    try:
        for item in validation["valid_payloads"]:
            values = item["values"]
            industry = values["industry"]
            if industry not in peer_cache:
                peers, scope = peer_context(db, user, industry)
                peer_cache[industry] = {"probabilities": peers, "scope": scope}
            context = peer_cache[industry]
            label, probability = score_startup(values)
            prediction = Prediction(
                user_id=user.id,
                **values,
                prediction=label,
                probability=probability,
                model_accuracy=accuracy,
            )
            db.add(prediction)
            db.flush()
            analysis = analyze_startup(
                values,
                probability,
                accuracy,
                context["probabilities"],
                context["scope"],
            )
            context["probabilities"].append(probability)
            results.append({
                **prediction_dict(prediction),
                "source_row": item["row"],
                "success_index": analysis["success_index"],
                "badge": analysis["badge"],
            })
        db.commit()
    except Exception:
        db.rollback()
        raise

    return {
        "created": len(results),
        "skipped": validation["invalid_count"],
        "results": results,
        "validation": csv_public_result(validation),
    }

@app.get("/history")
def history(search: str | None = None, outcome: str | None = None, start_date: str | None = None, end_date: str | None = None, page: int = 1, page_size: int = 10, db: Session = Depends(get_db), user: User = Depends(current_user)):
    q = prediction_query(db, user).order_by(desc(Prediction.created_at))
    if search: q = q.filter(Prediction.startup_name.ilike(f"%{search}%"))
    if outcome: q = q.filter(Prediction.prediction == outcome)
    try:
        if start_date: q = q.filter(Prediction.created_at >= datetime.fromisoformat(start_date))
        if end_date: q = q.filter(Prediction.created_at < datetime.fromisoformat(end_date) + timedelta(days=1))
    except ValueError: raise HTTPException(422, "Dates must use YYYY-MM-DD format")
    page, page_size = max(page, 1), min(max(page_size, 1), 100)
    total = q.count(); items = q.offset((page - 1) * page_size).limit(page_size).all()
    return {"items": [prediction_dict(p) for p in items], "total": total, "page": page, "page_size": page_size, "pages": max(1, (total + page_size - 1) // page_size)}

@app.get("/analytics")
def analytics(db: Session = Depends(get_db), user: User = Depends(current_user)):
    rows = prediction_query(db, user).order_by(Prediction.created_at).all()
    login_query = db.query(LoginEvent).filter(LoginEvent.success.is_(True))
    if user.role != "admin": login_query = login_query.filter(LoginEvent.user_id == user.id)
    logins = login_query.order_by(LoginEvent.created_at).all()

    visible_users = db.query(User).order_by(User.username).all() if user.role == "admin" else [user]
    user_metrics = {item.id: {"name": item.username, "predictions": 0, "confidence": 0.0, "accuracy": 0.0} for item in visible_users}
    daily_counts, industry_counts, country_counts = {}, {}, {}
    monthly, login_daily, login_weekly, login_monthly = {}, {}, {}, {}
    for row in rows:
        day = row.created_at.strftime("%Y-%m-%d")
        month = row.created_at.strftime("%Y-%m")
        monthly[month] = monthly.get(month, 0) + 1
        for bucket, key in ((daily_counts, day), (industry_counts, row.industry), (country_counts, row.country)):
            values = bucket.setdefault(key, {"count": 0, "confidence": 0.0})
            values["count"] += 1; values["confidence"] += row.probability
        values = user_metrics.setdefault(row.user_id, {"name": row.user.username, "predictions": 0, "confidence": 0.0, "accuracy": 0.0})
        values["predictions"] += 1; values["confidence"] += row.probability; values["accuracy"] += row.model_accuracy
    for item in logins:
        day = item.created_at.strftime("%Y-%m-%d"); week = f"{item.created_at.isocalendar().year}-W{item.created_at.isocalendar().week:02d}"; month = item.created_at.strftime("%Y-%m")
        login_daily[day] = login_daily.get(day, 0) + 1; login_weekly[week] = login_weekly.get(week, 0) + 1; login_monthly[month] = login_monthly.get(month, 0) + 1
    funding_bins = [{"name":"<$100K","min":0,"max":100_000,"count":0},{"name":"$100K-$500K","min":100_000,"max":500_000,"count":0},{"name":"$500K-$2M","min":500_000,"max":2_000_000,"count":0},{"name":"$2M-$10M","min":2_000_000,"max":10_000_000,"count":0},{"name":"$10M+","min":10_000_000,"max":float("inf"),"count":0}]
    confidence_bins = [{"name":f"{start}-{start+9}%","min":start/100,"max":(start+10)/100,"count":0} for start in range(0,100,10)]
    heatmap_counts = {}
    for row in rows:
        for item in funding_bins:
            if item["min"] <= row.funding < item["max"]: item["count"] += 1; break
        for item in confidence_bins:
            if item["min"] <= row.probability < item["max"] or row.probability == 1 and item["max"] == 1: item["count"] += 1; break
        heatmap_counts[(row.industry, row.country)] = heatmap_counts.get((row.industry, row.country), 0) + 1

    def aggregate(items):
        return [{"name": name, "count": values["count"], "confidence": round(values["confidence"] / values["count"] * 100, 1)} for name, values in items.items()]

    users = [{"name": values["name"], "predictions": values["predictions"], "confidence": round(values["confidence"] / values["predictions"] * 100, 1) if values["predictions"] else 0, "accuracy": round(values["accuracy"] / values["predictions"] * 100, 1) if values["predictions"] else 0} for values in user_metrics.values()]
    daily = aggregate(daily_counts)[-30:]
    by_industry, by_country = aggregate(industry_counts), aggregate(country_counts)
    top_industry = max(by_industry, key=lambda item: item["count"])["name"] if by_industry else None
    user_id = None if user.role == "admin" else user.id
    return {
        "daily": [{"date": item["name"], "count": item["count"], "confidence": item["confidence"]} for item in daily],
        "monthly": [{"date": key, "count": value} for key,value in monthly.items()],
        "industries": by_industry,
        "countries": by_country,
        "funding_distribution": [{"name": item["name"], "count": item["count"]} for item in funding_bins],
        "confidence_histogram": [{"name": item["name"], "count": item["count"]} for item in confidence_bins],
        "scatter": [{"startup": row.startup_name, "funding": row.funding, "probability": round(row.probability*100,1), "growth": row.growth_rate} for row in rows[-100:]],
        "heatmap": [{"industry": industry, "country": country, "count": count} for (industry,country),count in heatmap_counts.items()],
        "feature_importance": feature_importance(), "users": users,
        "login_daily": [{"date": k,"count":v} for k,v in login_daily.items()][-30:], "login_weekly": [{"date":k,"count":v} for k,v in login_weekly.items()][-12:], "login_monthly": [{"date":k,"count":v} for k,v in login_monthly.items()][-12:],
        "highlights": {"highest_accuracy_user": max(users,key=lambda x:x["accuracy"])["name"] if users else None, "most_active_user": max(users,key=lambda x:x["predictions"])["name"] if users else None, "top_industry": top_industry},
        "stats": dashboard_stats(db, user_id), "model_metrics": model_metrics()
    }

@app.get("/logs")
def logs(db: Session = Depends(get_db), user: User = Depends(current_user)):
    query = db.query(ApiLog)
    if user.role != "admin": query = query.filter(ApiLog.user_id == user.id)
    rows = query.order_by(desc(ApiLog.created_at)).limit(100).all()
    return {"items": [{"id": r.id, "event": r.event, "method": r.method, "path": r.path, "status_code": r.status_code, "detail": r.detail, "created_at": r.created_at.isoformat()} for r in rows]}

@app.get("/users")
def users(db: Session = Depends(get_db), user: User = Depends(current_user)):
    require_admin(user)
    return {"items": [UserOut.model_validate(u) for u in db.query(User).order_by(User.username).all()]}


@app.patch("/users/{user_id}", response_model=UserOut)
def update_user(user_id: int, payload: UserAdminUpdate, db: Session = Depends(get_db), user: User = Depends(current_user)):
    require_admin(user)
    target = db.get(User, user_id)
    if not target:
        raise HTTPException(404, "User not found")
    if target.id == user.id and (
        (payload.role is not None and payload.role != user.role)
        or payload.is_active is False
    ):
        raise HTTPException(400, "You cannot remove your own admin access")
    if payload.role is not None:
        target.role = payload.role
    if payload.is_active is not None:
        target.is_active = payload.is_active
    db.commit()
    db.refresh(target)
    return target

@app.get("/download-csv")
def download_csv(db: Session = Depends(get_db), user: User = Depends(current_user)):
    rows = prediction_query(db, user).order_by(desc(Prediction.created_at)).all()
    if not rows: raise HTTPException(404, "No predictions are available to export")
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=CSV_FIELDS)
    writer.writeheader()
    for row in rows:
        writer.writerow({"username": row.user.username, "date": row.created_at.isoformat(), "startup": row.startup_name, "funding": row.funding, "industry": row.industry, "prediction": row.prediction, "probability": row.probability, "accuracy": row.model_accuracy})
    headers = {"Content-Disposition": 'attachment; filename="foundr-ai-predictions.csv"'}
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv", headers=headers)
