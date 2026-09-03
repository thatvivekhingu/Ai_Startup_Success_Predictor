def clamp(val: float, low: float = 0.0, high: float = 100.0) -> float:
    return max(low, min(float(val), high))

def band_label(score: float) -> str:
    if score >= 80:
        return "Excellent"
    if score >= 65:
        return "Strong"
    if score >= 50:
        return "Developing"
    if score >= 35:
        return "Needs Attention"
    return "Critical"

def calculate_startup_health(metrics: dict) -> dict:
    """
    Computes a transparent, 6-pillar Startup Health Score (0-100) based on
    grounded operational, financial, customer, team, and market dynamics.
    """
    revenue = max(float(metrics.get("monthly_revenue", metrics.get("revenue", 0))), 0)
    burn = max(float(metrics.get("monthly_burn", metrics.get("burn_rate", 1))), 1)
    cash = max(float(metrics.get("cash_balance", metrics.get("funding", 0))), 0)
    growth_rate = float(metrics.get("growth_rate", 15))
    churn_rate = float(metrics.get("churn_rate", 2.5))
    retention_rate = float(metrics.get("retention_rate", 92.0))
    team_size = max(int(metrics.get("headcount", metrics.get("team_size", 5))), 1)
    experience = float(metrics.get("avg_experience_years", metrics.get("experience", 5.0)))
    market_size = max(float(metrics.get("market_size", 100_000_000)), 1)
    competition = float(metrics.get("competition", 50.0))

    # Derived metrics
    runway_months = cash / burn if burn > 0 else 24.0
    burn_multiple = burn / max(revenue, 1)

    # 1. Financial Health (Runway, Burn Multiple, Margin)
    # Target: 18-24m runway, burn multiple < 1.5x
    runway_score = clamp(runway_months / 24.0 * 100)
    burn_mult_score = clamp((3.0 - min(burn_multiple, 3.0)) / 2.5 * 100)
    financial_health = round(runway_score * 0.55 + burn_mult_score * 0.45)

    # 2. Growth Velocity (MoM / YoY revenue expansion & low churn)
    growth_score = clamp((growth_rate + 10) / 70.0 * 100)
    retention_score = clamp(retention_rate)
    growth_velocity = round(growth_score * 0.60 + retention_score * 0.40)

    # 3. Cash Resilience (Buffer & absolute runway strength)
    resilience_score = clamp((runway_months - 3) / 18.0 * 100)
    cash_resilience = round(resilience_score)

    # 4. Team Dynamics (Experience, execution capability, size balance)
    exp_score = clamp(experience / 12.0 * 100)
    size_score = clamp(min(team_size, 30) / 25.0 * 100)
    team_dynamics = round(exp_score * 0.65 + size_score * 0.35)

    # 5. Market Attractiveness (TAM size & low competitive resistance)
    tam_score = clamp(market_size / 500_000_000 * 100)
    moat_score = clamp(100 - competition)
    market_attractiveness = round(tam_score * 0.45 + moat_score * 0.55)

    # 6. Operational Stability (Low churn, predictable cost ratio)
    churn_score = clamp((10.0 - min(churn_rate, 10.0)) / 8.0 * 100)
    operational_stability = round(churn_score * 0.60 + (100 - min(burn_multiple * 20, 100)) * 0.40)

    # Overall Weighted Health Score
    overall_health = round(
        financial_health * 0.25 +
        growth_velocity * 0.20 +
        cash_resilience * 0.18 +
        team_dynamics * 0.15 +
        market_attractiveness * 0.12 +
        operational_stability * 0.10
    )

    if overall_health >= 75:
        overall_status = "HEALTHY"
        status_color = "emerald"
        summary = "Strong operational efficiency with healthy runway and solid traction momentum."
    elif overall_health >= 55:
        overall_status = "STABLE / MONITOR"
        status_color = "amber"
        summary = "Moderate operational health. Certain pillars require proactive optimization before scaling."
    else:
        overall_status = "CRITICAL INTERVENTION"
        status_color = "rose"
        summary = "Elevated operational vulnerability. Immediate burn reduction and runway preservation recommended."

    pillars = [
        {
            "key": "financial_health",
            "name": "Financial Health",
            "score": financial_health,
            "status": band_label(financial_health),
            "weight": 25,
            "detail": f"{runway_months:.1f} months runway | Burn Multiple: {burn_multiple:.1f}x"
        },
        {
            "key": "growth_velocity",
            "name": "Growth Velocity",
            "score": growth_velocity,
            "status": band_label(growth_velocity),
            "weight": 20,
            "detail": f"{growth_rate:.1f}% growth rate | {retention_rate:.1f}% customer retention"
        },
        {
            "key": "cash_resilience",
            "name": "Cash Resilience",
            "score": cash_resilience,
            "status": band_label(cash_resilience),
            "weight": 18,
            "detail": f"Cash runway buffer of {max(0, runway_months - 6):.1f} months above minimum threshold"
        },
        {
            "key": "team_dynamics",
            "name": "Team Dynamics",
            "score": team_dynamics,
            "status": band_label(team_dynamics),
            "weight": 15,
            "detail": f"{team_size} team members | {experience:.1f} yrs avg founder/operator experience"
        },
        {
            "key": "market_attractiveness",
            "name": "Market Attractiveness",
            "score": market_attractiveness,
            "status": band_label(market_attractiveness),
            "weight": 12,
            "detail": f"Addressable market ${market_size:,.0f} | Competition index {competition:.0f}/100"
        },
        {
            "key": "operational_stability",
            "name": "Operational Stability",
            "score": operational_stability,
            "status": band_label(operational_stability),
            "weight": 10,
            "detail": f"Monthly churn {churn_rate:.1f}% | Unit economics alignment"
        }
    ]

    return {
        "overall_health": overall_health,
        "status": overall_status,
        "status_color": status_color,
        "summary": summary,
        "runway_months": round(runway_months, 1),
        "burn_multiple": round(burn_multiple, 1),
        "pillars": pillars
    }
