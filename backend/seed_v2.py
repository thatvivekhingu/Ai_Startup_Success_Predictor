from sqlalchemy.orm import Session
from .models import (
    User, StartupProfile, FinancialSnapshot, CustomerMetric,
    TeamMetric, MarketSignal, StartupEvent, EarlyWarning,
    SimulationScenario, AIRecommendation
)
from .simulation_engine import PRESETS, run_what_if_simulation
from .monte_carlo_engine import run_monte_carlo_simulation

def seed_nova_ai_digital_twin(db: Session, user: User) -> StartupProfile:
    """
    Seeds a realistic, high-fidelity startup digital twin:
    'NovaAI Technologies' (Ahmedabad, Gujarat — B2B SaaS/AI Seed Stage)
    with 12 months of chronological snapshots, signals, and early warnings.
    """
    existing = db.query(StartupProfile).filter(
        StartupProfile.user_id == user.id,
        StartupProfile.name == "NovaAI Technologies"
    ).first()
    
    if existing:
        return existing

    startup = StartupProfile(
        user_id=user.id,
        name="NovaAI Technologies",
        sector="Artificial Intelligence",
        industry="B2B SaaS / Enterprise Automation",
        country="India",
        state_city="Ahmedabad, Gujarat",
        stage="Seed",
        founding_year=2025,
        business_model="B2B Subscription + Usage",
        currency="INR",
        is_demo=True
    )
    db.add(startup)
    db.commit()
    db.refresh(startup)

    # 12 Months of Chronological History (Oct 2025 -> Sep 2026)
    history_data = [
        {"period": "2025-10", "rev": 850000, "burn": 750000, "cash": 4500000, "cust": 110, "team": 5, "churn": 2.0},
        {"period": "2025-11", "rev": 920000, "burn": 780000, "cash": 4360000, "cust": 128, "team": 5, "churn": 1.8},
        {"period": "2025-12", "rev": 1050000, "burn": 820000, "cash": 4590000, "cust": 150, "team": 6, "churn": 1.5},
        {"period": "2026-01", "rev": 1180000, "burn": 900000, "cash": 4870000, "cust": 185, "team": 7, "churn": 2.2},
        {"period": "2026-02", "rev": 1300000, "burn": 950000, "cash": 5220000, "cust": 220, "team": 8, "churn": 1.9},
        {"period": "2026-03", "rev": 1420000, "burn": 1050000, "cash": 8500000, "cust": 265, "team": 9, "churn": 2.0}, # Seed round closed (+50L)
        {"period": "2026-04", "rev": 1510000, "burn": 1100000, "cash": 8910000, "cust": 305, "team": 10, "churn": 2.4},
        {"period": "2026-05", "rev": 1600000, "burn": 1140000, "cash": 9370000, "cust": 340, "team": 11, "churn": 2.1},
        {"period": "2026-06", "rev": 1680000, "burn": 1180000, "cash": 9870000, "cust": 372, "team": 12, "churn": 2.6},
        {"period": "2026-07", "rev": 1740000, "burn": 1200000, "cash": 9410000, "cust": 398, "team": 12, "churn": 2.8},
        {"period": "2026-08", "rev": 1800000, "burn": 1220000, "cash": 8830000, "cust": 420, "team": 12, "churn": 2.5},
        {"period": "2026-09", "rev": 1860000, "burn": 1240000, "cash": 8210000, "cust": 445, "team": 13, "churn": 2.4}
    ]

    for h in history_data:
        net_b = max(1.0, h["burn"] - h["rev"])
        r_months = round(h["cash"] / net_b if net_b > 0 else 36.0, 1)

        db.add(FinancialSnapshot(
            startup_id=startup.id,
            period_date=h["period"],
            monthly_revenue=h["rev"],
            monthly_expenses=h["burn"],
            monthly_burn=h["burn"],
            cash_balance=h["cash"],
            total_funding=5000000.0,
            valuation=35000000.0,
            runway_months=r_months,
            gross_margin_pct=76.0
        ))

        db.add(CustomerMetric(
            startup_id=startup.id,
            period_date=h["period"],
            customer_count=h["cust"],
            new_customers=int(h["cust"] * 0.12),
            churn_rate=h["churn"],
            retention_rate=round(100.0 - h["churn"], 1),
            cac=18500.0,
            ltv=145000.0,
            concentration_pct=14.0
        ))

        db.add(TeamMetric(
            startup_id=startup.id,
            period_date=h["period"],
            headcount=h["team"],
            engineers=max(1, int(h["team"] * 0.6)),
            sales_reps=max(1, int(h["team"] * 0.25)),
            hiring_rate=8.5,
            attrition_rate=0.0,
            avg_experience_years=5.4
        ))

    # Market Signals
    db.add(MarketSignal(
        startup_id=startup.id,
        signal_type="macro",
        title="India AI B2B SaaS Sector Expansion",
        source="Venture Intelligence India",
        impact_score=+18.0,
        confidence=0.92,
        detail="Enterprise adoption of workflow AI automation in Indian mid-market expanded 34% YoY with high retention.",
        is_external=True
    ))
    db.add(MarketSignal(
        startup_id=startup.id,
        signal_type="hiring",
        title="Gujarat Tech Cluster Talent Surge",
        source="Tech Ecosystem Report",
        impact_score=+8.0,
        confidence=0.88,
        detail="Ahmedabad & Gandhinagar tech corridor seeing 22% increase in senior engineering candidates relocating from tier-1 metros.",
        is_external=True
    ))

    # Chronological Events
    db.add(StartupEvent(
        startup_id=startup.id,
        event_date="2026-03-15",
        event_type="funding",
        title="Closed ₹50 Lakhs Seed Financing",
        description="Secured institutional seed check from regional venture syndicate to accelerate enterprise product rollout.",
        metric_affected="cash_balance",
        change_value="+₹50,00,000"
    ))
    db.add(StartupEvent(
        startup_id=startup.id,
        event_date="2026-06-01",
        event_type="product",
        title="Enterprise Multi-Agent Workflow Launch",
        description="Shipped core enterprise orchestration engine, driving 28 net new business accounts.",
        metric_affected="customer_count",
        change_value="+28 accounts"
    ))

    # Early Warnings
    db.add(EarlyWarning(
        startup_id=startup.id,
        severity="warning",
        category="cash",
        title="Monthly Burn Creep (+18% over 6 months)",
        description="Operating burn expanded from ₹10.5L to ₹12.4L per month. Current runway stands at 13.2 months.",
        metric_affected="monthly_burn",
        previous_value=1050000.0,
        current_value=1240000.0,
        confidence=0.94,
        recommended_action="Audit infrastructure cloud costs and sequence non-essential marketing spend."
    ))
    db.add(EarlyWarning(
        startup_id=startup.id,
        severity="opportunity",
        category="growth",
        title="Strong LTV / CAC Unit Economics (7.8x Ratio)",
        description="Customer lifetime value (₹1.45L) significantly exceeds acquisition cost (₹18.5k), creating high capital leverage.",
        metric_affected="ltv_cac_ratio",
        previous_value=6.2,
        current_value=7.8,
        confidence=0.96,
        recommended_action="Increase outbound SDR capacity by +2 reps to scale enterprise lead velocity."
    ))

    # AI Recommendations
    db.add(AIRecommendation(
        startup_id=startup.id,
        category="Fundraising",
        title="Prepare Series-A Data Room for Q1 2027",
        impact="High",
        urgency="Warning",
        confidence=0.91,
        effort="Medium",
        action_steps_json=[
            "Consolidate cohort retention charts showing >92% net revenue retention.",
            "Standardize ARR bridge analysis and gross margin breakdown.",
            "Target ₹3.5 Cr institutional round at ₹22-25 Cr pre-money valuation."
        ],
        status="pending"
    ))

    # Pre-built Scenarios
    baseline_dict = {
        "monthly_revenue": 1860000.0,
        "monthly_burn": 1240000.0,
        "cash_balance": 8210000.0,
        "growth_rate": 18.0,
        "headcount": 13,
        "market_size": 250000000.0,
        "competition": 45.0
    }
    
    for key, preset in PRESETS.items():
        sim_res = run_what_if_simulation(baseline_dict, preset["variables"])
        mc_res = run_monte_carlo_simulation(baseline_dict, num_simulations=1000) if key == "funded_expansion" else None
        
        db.add(SimulationScenario(
            startup_id=startup.id,
            name=preset["name"],
            description=preset["description"],
            preset_type=key,
            variables_json=preset["variables"],
            results_json=sim_res,
            monte_carlo_json=mc_res,
            is_baseline=(key == "bootstrap")
        ))

    db.commit()
    db.refresh(startup)
    return startup
