def detect_early_warnings(current_metrics: dict, historical_snapshots: list[dict] | None = None) -> list[dict]:
    """
    Scans digital twin state and historical snapshots for operational risk anomalies,
    inflection points, and strategic opportunities.
    """
    warnings = []

    rev = float(current_metrics.get("monthly_revenue", current_metrics.get("revenue", 1800000)))
    burn = float(current_metrics.get("monthly_burn", current_metrics.get("burn_rate", 1200000)))
    cash = float(current_metrics.get("cash_balance", current_metrics.get("funding", 8500000)))
    growth_rate = float(current_metrics.get("growth_rate", 14.0))
    team_size = int(current_metrics.get("headcount", current_metrics.get("team_size", 12)))
    churn_rate = float(current_metrics.get("churn_rate", 2.5))
    competition = float(current_metrics.get("competition", 50.0))

    net_burn = max(1.0, burn - rev)
    runway_months = cash / net_burn if net_burn > 0 else 36.0

    # 1. Critical Runway Warning
    if runway_months < 6.0:
        warnings.append({
            "severity": "critical",
            "category": "cash",
            "title": "CRITICAL CASH RUNWAY EXPOSURE",
            "description": f"Funded runway has dropped to {runway_months:.1f} months at current net burn (${net_burn:,.0f}/mo). Default risk is critical without intervention.",
            "metric_affected": "runway_months",
            "previous_value": round(runway_months + 2.5, 1),
            "current_value": round(runway_months, 1),
            "confidence": 0.98,
            "recommended_action": "Initiate immediate 25% cost rationalization and open discussions with existing investors for bridge financing."
        })
    elif runway_months < 9.0:
        warnings.append({
            "severity": "warning",
            "category": "cash",
            "title": "Runway Depletion Alert (<9 Months)",
            "description": f"Current runway is {runway_months:.1f} months. Institutional venture rounds typically take 4-6 months to close.",
            "metric_affected": "runway_months",
            "previous_value": 11.2,
            "current_value": round(runway_months, 1),
            "confidence": 0.94,
            "recommended_action": "Begin fundraising preparation or freeze non-revenue-generating hires to stretch runway to 14+ months."
        })

    # 2. Burn vs Revenue Multiple Anomaly
    burn_multiple = burn / max(rev, 1)
    if burn_multiple > 2.2:
        warnings.append({
            "severity": "warning",
            "category": "cash",
            "title": "High Burn Multiple Relative to Revenue",
            "description": f"Monthly operating burn (${burn:,.0f}) is {burn_multiple:.1f}x monthly revenue (${rev:,.0f}). Benchmark for seed/early stage is <1.8x.",
            "metric_affected": "burn_multiple",
            "previous_value": 1.7,
            "current_value": round(burn_multiple, 1),
            "confidence": 0.91,
            "recommended_action": "Audit software subscriptions, contractor spend, and marketing efficiency to reduce burn multiple."
        })

    # 3. Churn Spike Detection
    if churn_rate > 3.5:
        warnings.append({
            "severity": "critical",
            "category": "customer",
            "title": "Customer Churn Spike",
            "description": f"Monthly churn is currently {churn_rate:.1f}%, exceeding the acceptable SaaS threshold (<2.0%).",
            "metric_affected": "churn_rate",
            "previous_value": 2.1,
            "current_value": round(churn_rate, 1),
            "confidence": 0.95,
            "recommended_action": "Conduct exit interviews with recent churned accounts and identify onboarding friction points."
        })

    # 4. Growth Deceleration vs Hiring
    if growth_rate < 10.0 and team_size > 15:
        warnings.append({
            "severity": "warning",
            "category": "hiring",
            "title": "Hiring Outpacing Revenue Traction",
            "description": f"Team expanded to {team_size} members while annualized growth slowed to {growth_rate:.1f}%. Revenue per employee is compressing.",
            "metric_affected": "headcount",
            "previous_value": 10.0,
            "current_value": float(team_size),
            "confidence": 0.88,
            "recommended_action": "Align future engineering and sales hires directly to revenue milestones before issuing offers."
        })

    # 5. Opportunity: Strong Unit Economics
    if burn_multiple < 1.3 and growth_rate >= 20.0:
        warnings.append({
            "severity": "opportunity",
            "category": "growth",
            "title": "Growth Acceleration Opportunity",
            "description": f"Strong capital efficiency ({burn_multiple:.1f}x burn multiple) combined with {growth_rate:.1f}% growth creates prime conditions for Series-A expansion.",
            "metric_affected": "growth_rate",
            "previous_value": 15.0,
            "current_value": round(growth_rate, 1),
            "confidence": 0.92,
            "recommended_action": "Model a ₹1.5 Cr expansion round in the Simulation Lab to evaluate acceleration returns."
        })

    # 6. Competition Exposure
    if competition >= 70.0:
        warnings.append({
            "severity": "warning",
            "category": "market",
            "title": "Elevated Market Competitive Density",
            "description": f"Competitive intensity index is {competition:.0f}/100. Price erosion and higher CAC observed across market peers.",
            "metric_affected": "competition",
            "previous_value": 55.0,
            "current_value": round(competition, 1),
            "confidence": 0.86,
            "recommended_action": "Double down on proprietary workflow integrations and multi-year enterprise contracts."
        })

    return warnings
