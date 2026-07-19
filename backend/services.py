from datetime import UTC, datetime
from pathlib import Path
from functools import lru_cache
import json
from sqlalchemy import func
from sqlalchemy.orm import Session
from .models import ApiLog, Prediction

MODEL_PATH = Path(__file__).parent / "model" / "startup_model.pkl"
METRICS_PATH = Path(__file__).parent / "model" / "metrics.json"
CSV_FIELDS = ["username", "date", "startup", "funding", "industry", "prediction", "probability", "accuracy"]

STAGE_SCORES = {
    "Idea": 20,
    "MVP": 42,
    "Early Revenue": 64,
    "Growth": 82,
    "Scale": 94,
}


def clamp(value: float, lower: float = 0, upper: float = 100) -> float:
    return max(lower, min(float(value), upper))


def band(score: float) -> str:
    if score >= 75:
        return "Strong"
    if score >= 50:
        return "Developing"
    return "Needs attention"


def risk_band(risk: float) -> str:
    if risk >= 65:
        return "High"
    if risk >= 35:
        return "Moderate"
    return "Low"


def analyze_startup(
    data: dict,
    probability: float | None = None,
    accuracy: float | None = None,
    peer_probabilities: list[float] | None = None,
    benchmark_scope: str | None = None,
) -> dict:
    """Build a transparent decision-support layer around the core model score."""
    if probability is None:
        _, probability = score_startup(data)
    accuracy = model_accuracy() if accuracy is None else accuracy

    funding = max(float(data["funding"]), 0)
    revenue = max(float(data["revenue"]), 0)
    burn_rate = max(float(data["burn_rate"]), 0)
    market_size = max(float(data["market_size"]), 1)
    team_size = max(int(data["team_size"]), 1)
    experience = max(float(data["experience"]), 0)
    investors = max(int(data["investors"]), 0)
    competition = clamp(data["competition"])
    growth_rate = clamp(data["growth_rate"], -100, 1000)
    stage = STAGE_SCORES.get(data["product_stage"], 42)

    runway_months = funding / max(burn_rate, 1)
    monthly_revenue = revenue / 12
    burn_multiple = burn_rate / max(monthly_revenue, 1)
    revenue_market_ratio = revenue / market_size

    funding_readiness = clamp(
        clamp(runway_months / 24 * 100) * 0.48
        + clamp(investors / 6 * 100) * 0.22
        + stage * 0.18
        + clamp(revenue / max(funding, 1) * 100) * 0.12
    )
    market_fit = clamp(
        clamp((growth_rate + 10) / 110 * 100) * 0.34
        + clamp(revenue_market_ratio / 0.02 * 100) * 0.2
        + stage * 0.24
        + (100 - competition) * 0.12
        + clamp(market_size / 500_000_000 * 100) * 0.1
    )
    team_strength = clamp(
        clamp(experience / 15 * 100) * 0.42
        + clamp(team_size / 45 * 100) * 0.28
        + clamp(investors / 6 * 100) * 0.16
        + stage * 0.14
    )
    burn_resilience = clamp(
        clamp(runway_months / 24 * 100) * 0.55
        + clamp(2.2 / max(burn_multiple, 0.1) * 100) * 0.25
        + clamp((growth_rate + 10) / 110 * 100) * 0.2
    )

    dimensions = [
        {
            "key": "funding_readiness",
            "name": "Funding readiness",
            "score": round(funding_readiness),
            "status": band(funding_readiness),
            "detail": f"{runway_months:.1f} months of funded runway at the current burn rate.",
        },
        {
            "key": "market_fit",
            "name": "Market fit",
            "score": round(market_fit),
            "status": band(market_fit),
            "detail": f"{growth_rate:.0f}% growth with a {competition:.0f}/100 competition index.",
        },
        {
            "key": "team_strength",
            "name": "Team strength",
            "score": round(team_strength),
            "status": band(team_strength),
            "detail": f"{team_size} team members and {experience:.1f} years of founder experience.",
        },
        {
            "key": "burn_resilience",
            "name": "Burn resilience",
            "score": round(burn_resilience),
            "status": band(burn_resilience),
            "detail": f"Monthly burn is {burn_multiple:.1f}x estimated monthly revenue.",
        },
    ]

    business_average = sum(item["score"] for item in dimensions) / len(dimensions)
    success_index = round(clamp(probability * 100 * 0.55 + business_average * 0.45))

    raw_contributions = [
        ("Growth momentum", (clamp((growth_rate + 20) / 170 * 100) - 50) / 50 * 18, f"Annual growth is {growth_rate:.0f}%"),
        ("Funded runway", (clamp(runway_months / 24 * 100) - 50) / 50 * 17, f"Runway is {runway_months:.1f} months"),
        ("Revenue traction", (clamp(revenue / 1_000_000 * 100) - 50) / 50 * 14, f"Annual revenue is ${revenue:,.0f}"),
        ("Product maturity", (stage - 50) / 50 * 13, f"Product is at {data['product_stage']} stage"),
        ("Founder experience", (clamp(experience / 15 * 100) - 50) / 50 * 10, f"Founder experience is {experience:.1f} years"),
        ("Market opportunity", (clamp(market_size / 500_000_000 * 100) - 50) / 50 * 9, f"Addressable market is ${market_size:,.0f}"),
        ("Competition pressure", -((competition - 50) / 50) * 10, f"Competition index is {competition:.0f}/100"),
        ("Burn efficiency", -((clamp(burn_multiple / 5 * 100) - 40) / 60) * 11, f"Burn multiple is {burn_multiple:.1f}x"),
    ]
    explanations = [
        {
            "feature": name,
            "impact": round(value, 1),
            "direction": "positive" if value >= 0 else "negative",
            "detail": detail,
        }
        for name, value, detail in sorted(raw_contributions, key=lambda item: abs(item[1]), reverse=True)
    ]

    completeness = sum(data.get(key) not in (None, "") for key in (
        "funding", "team_size", "experience", "revenue", "burn_rate",
        "market_size", "product_stage", "investors", "competition", "growth_rate",
    )) / 10
    margin = clamp(4 + (1 - accuracy) * 18 + (1 - completeness) * 10, 4, 14)
    estimate = round(probability * 100, 1)
    confidence_interval = {
        "estimate": estimate,
        "lower": round(clamp(estimate - margin), 1),
        "upper": round(clamp(estimate + margin), 1),
        "margin": round(margin, 1),
        "label": "Estimated uncertainty range",
    }

    peers = peer_probabilities or []
    if peers:
        percentile = round(sum(item <= probability for item in peers) / len(peers) * 100)
        source = "workspace peers"
    else:
        percentile = round(clamp(10 + probability * 82))
        source = "model reference band"
    top_percent = max(1, 100 - percentile)
    benchmark = {
        "percentile": percentile,
        "top_percent": top_percent,
        "peer_count": len(peers),
        "scope": benchmark_scope or data["industry"],
        "source": source,
        "summary": f"Scores in the top {top_percent}% of {benchmark_scope or data['industry']} comparisons.",
    }

    risks = [
        {"name": "Funding", "risk": round(100 - funding_readiness)},
        {"name": "Market", "risk": round(100 - market_fit)},
        {"name": "Team", "risk": round(100 - team_strength)},
        {"name": "Product", "risk": round(100 - stage)},
        {"name": "Unit economics", "risk": round(100 - burn_resilience)},
    ]
    for item in risks:
        item["status"] = risk_band(item["risk"])

    lowest = sorted(dimensions, key=lambda item: item["score"])
    recommendations = []
    recommendation_map = {
        "funding_readiness": "Extend runway toward 18-24 months or validate a milestone-based funding plan.",
        "market_fit": "Strengthen customer evidence through retention, conversion, and repeatable acquisition metrics.",
        "team_strength": "Close the most material capability gap with a senior hire, advisor, or committed operator.",
        "burn_resilience": "Reduce burn multiple by improving revenue efficiency or sequencing non-critical spend.",
    }
    for item in lowest[:2]:
        recommendations.append(recommendation_map[item["key"]])
    if competition >= 70:
        recommendations.append("Clarify differentiation against crowded-market alternatives before the next raise.")
    elif growth_rate < 20:
        recommendations.append("Prioritize one measurable growth loop and review it against a 90-day target.")

    if success_index >= 82:
        badge = {"name": "Unicorn potential", "tone": "strong"}
    elif success_index >= 68:
        badge = {"name": "Investor ready", "tone": "strong"}
    elif success_index >= 50:
        badge = {"name": "Steady grower", "tone": "watch"}
    else:
        badge = {"name": "High risk", "tone": "risk"}

    return {
        "success_index": success_index,
        "dimensions": dimensions,
        "explanations": explanations,
        "confidence_interval": confidence_interval,
        "benchmark": benchmark,
        "risk_heatmap": risks,
        "recommendations": recommendations[:3],
        "badge": badge,
        "derived_metrics": {
            "runway_months": round(runway_months, 1),
            "burn_multiple": round(burn_multiple, 1),
            "revenue_per_employee": round(revenue / team_size),
        },
        "method": "Deployed probability combined with transparent operating-signal scorecards.",
    }

@lru_cache(maxsize=1)
def load_model():
    if not MODEL_PATH.exists():
        return None
    try:
        import joblib

        return joblib.load(MODEL_PATH)
    except (OSError, ValueError, EOFError, ImportError, AttributeError):
        # A stale artifact should not take the prediction API down.
        return None

def score_startup(data: dict) -> tuple[str, float]:
    model = load_model()
    if model is not None:
        import pandas as pd

        frame = pd.DataFrame([{k: v for k, v in data.items() if k != "startup_name"}])
        frame["runway_months"] = frame["funding"] / frame["burn_rate"].clip(lower=1)
        frame["revenue_per_employee"] = frame["revenue"] / frame["team_size"].clip(lower=1)
        frame["funding_market_ratio"] = frame["funding"] / frame["market_size"].clip(lower=1)
        try:
            probabilities = model.predict_proba(frame)[0]
            classes = list(getattr(model, "classes_", getattr(model[-1], "classes_", [0, 1])))
            success_index = classes.index(1) if 1 in classes else len(classes) - 1
            probability = round(float(probabilities[success_index]), 4)
            return ("Likely to succeed" if probability >= 0.5 else "High risk"), probability
        except (AttributeError, IndexError, KeyError, TypeError, ValueError):
            pass
    stage_score = {"Idea": 0.15, "MVP": 0.35, "Early Revenue": 0.6, "Growth": 0.82, "Scale": 0.92}.get(data["product_stage"], 0.4)
    funding_score = min(data["funding"] / 10_000_000, 1) * 0.2
    revenue_score = min(data["revenue"] / 5_000_000, 1) * 0.18
    growth_score = min(max(data["growth_rate"], -20) / 150, 1) * 0.2
    team_score = min(data["team_size"] / 80, 1) * 0.08 + min(data["experience"] / 20, 1) * 0.08
    market_score = min(data["market_size"] / 100_000_000, 1) * 0.15
    investor_score = min(data["investors"] / 8, 1) * 0.05
    burn_penalty = min(data["burn_rate"] / max(data["funding"], 1), 1) * 0.15
    competition_penalty = min(data["competition"] / 100, 1) * 0.1
    probability = 0.12 + stage_score * 0.22 + funding_score + revenue_score + growth_score + team_score + market_score + investor_score - burn_penalty - competition_penalty
    probability = round(max(0.03, min(probability, 0.98)), 4)
    return ("Likely to succeed" if probability >= 0.58 else "High risk"), probability

def record_log(db: Session, event: str, method: str, path: str, status_code: int, user_id: int | None = None, detail: str | None = None):
    db.add(ApiLog(user_id=user_id, event=event, method=method, path=path, status_code=status_code, detail=detail))
    db.commit()

def dashboard_stats(db: Session, user_id: int | None = None):
    def scoped(query):
        return query if user_id is None else query.filter(Prediction.user_id == user_id)

    total = scoped(db.query(func.count(Prediction.id))).scalar() or 0
    successful = scoped(db.query(func.count(Prediction.id)).filter(Prediction.prediction == "Likely to succeed")).scalar() or 0
    today = datetime.now(UTC).date()
    today_count = scoped(db.query(func.count(Prediction.id)).filter(func.date(Prediction.created_at) == today)).scalar() or 0
    avg_confidence = scoped(db.query(func.avg(Prediction.probability))).scalar() or 0
    avg_accuracy = scoped(db.query(func.avg(Prediction.model_accuracy))).scalar() or 0
    return {"total_predictions": total, "success_rate": round(successful / total * 100, 1) if total else 0, "failure_rate": round((total-successful) / total * 100, 1) if total else 0, "today_predictions": today_count, "average_confidence": round(avg_confidence * 100, 1), "average_accuracy": round(avg_accuracy * 100, 1)}

def model_metrics():
    if not METRICS_PATH.exists(): return {"best_model": "scoring_fallback", "models": {}}
    return json.loads(METRICS_PATH.read_text(encoding="utf-8"))

def model_accuracy():
    metrics = model_metrics()
    best = metrics.get("best_model")
    return float(metrics.get("models", {}).get(best, {}).get("accuracy", 0.87))

def feature_importance():
    model = load_model()
    if model is None: return []
    try:
        names = model.named_steps["preprocessor"].get_feature_names_out()
        estimator = model.named_steps["model"]
        raw = estimator.feature_importances_ if hasattr(estimator, "feature_importances_") else abs(estimator.coef_[0])
        pairs = sorted(zip(names, raw), key=lambda item: float(item[1]), reverse=True)[:10]
        return [{"name": name.split("__", 1)[-1].replace("_", " ").title(), "importance": round(float(value) * 100, 2)} for name, value in pairs]
    except (AttributeError, KeyError, ValueError):
        return []
