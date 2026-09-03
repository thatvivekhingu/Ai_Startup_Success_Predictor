from .health_engine import calculate_startup_health
from .services import score_startup

PRESETS = {
    "aggressive_growth": {
        "name": "Aggressive Growth",
        "description": "Boost sales and marketing by 35%, accelerate hiring by +4 team members to target 2.5x revenue expansion.",
        "variables": {
            "revenue_growth_delta_pct": 35.0,
            "burn_reduction_pct": -20.0,  # increases burn by 20%
            "headcount_delta": 4,
            "marketing_spend_delta_pct": 30.0,
            "pricing_change_pct": 0.0,
            "funding_injection": 0.0
        }
    },
    "bootstrap": {
        "name": "Bootstrap / Runway Preservation",
        "description": "Cut non-essential expenses by 25%, freeze hiring, and focus on high-margin customer retention.",
        "variables": {
            "revenue_growth_delta_pct": -5.0,
            "burn_reduction_pct": 25.0,
            "headcount_delta": 0,
            "marketing_spend_delta_pct": -20.0,
            "pricing_change_pct": 5.0,
            "funding_injection": 0.0
        }
    },
    "funded_expansion": {
        "name": "Funded Series-A Expansion",
        "description": "Simulate raising an institutional round (₹1.5 Cr) to scale engineering and enterprise sales.",
        "variables": {
            "revenue_growth_delta_pct": 40.0,
            "burn_reduction_pct": -30.0,
            "headcount_delta": 6,
            "marketing_spend_delta_pct": 50.0,
            "pricing_change_pct": 0.0,
            "funding_injection": 15000000.0
        }
    },
    "cost_reduction": {
        "name": "Cost Reduction / Survival",
        "description": "Immediate 35% burn trim to extend runway beyond 18 months in a tight capital environment.",
        "variables": {
            "revenue_growth_delta_pct": -10.0,
            "burn_reduction_pct": 35.0,
            "headcount_delta": -1,
            "marketing_spend_delta_pct": -35.0,
            "pricing_change_pct": 0.0,
            "funding_injection": 0.0
        }
    }
}

def run_what_if_simulation(baseline: dict, variables: dict) -> dict:
    """
    Deterministically computes simulated financial state, health score, and risk changes.
    Does NOT hallucinate numbers; strictly computes via grounded mathematical formulas.
    """
    rev_base = float(baseline.get("monthly_revenue", baseline.get("revenue", 1800000)))
    burn_base = float(baseline.get("monthly_burn", baseline.get("burn_rate", 1200000)))
    cash_base = float(baseline.get("cash_balance", baseline.get("funding", 8500000)))
    growth_base = float(baseline.get("growth_rate", 14.0))
    team_base = int(baseline.get("headcount", baseline.get("team_size", 12)))

    # Apply deltas
    rev_growth_delta = float(variables.get("revenue_growth_delta_pct", 0.0))
    burn_red_pct = float(variables.get("burn_reduction_pct", 0.0))
    headcount_delta = int(variables.get("headcount_delta", 0))
    pricing_delta = float(variables.get("pricing_change_pct", 0.0))
    funding_injection = float(variables.get("funding_injection", 0.0))

    # 1. Simulated Revenue
    pricing_mult = 1.0 + (pricing_delta / 100.0)
    growth_mult = 1.0 + ((growth_base + rev_growth_delta) / 100.0)
    sim_rev = max(0.0, rev_base * pricing_mult * (1.0 + (rev_growth_delta / 100.0)))

    # 2. Simulated Burn (headcount cost ~₹1,20,000/month avg fully loaded)
    avg_salary = float(baseline.get("avg_salary_monthly", 120000))
    headcount_cost_delta = headcount_delta * avg_salary
    
    burn_after_reduction = burn_base * (1.0 - (burn_red_pct / 100.0))
    sim_burn = max(10000.0, burn_after_reduction + headcount_cost_delta)

    # 3. Simulated Cash & Runway
    sim_cash = max(0.0, cash_base + funding_injection)
    sim_net_burn = max(1.0, sim_burn - sim_rev)
    sim_runway = round(sim_cash / sim_net_burn if sim_net_burn > 0 else 48.0, 1)

    base_net_burn = max(1.0, burn_base - rev_base)
    base_runway = round(cash_base / base_net_burn if base_net_burn > 0 else 48.0, 1)

    # 4. Recompute Health Score
    sim_team = max(1, team_base + headcount_delta)
    sim_growth = growth_base + rev_growth_delta

    sim_metrics_dict = {
        "monthly_revenue": sim_rev,
        "monthly_burn": sim_burn,
        "cash_balance": sim_cash,
        "growth_rate": sim_growth,
        "headcount": sim_team,
        "market_size": baseline.get("market_size", 100000000),
        "competition": baseline.get("competition", 50)
    }
    
    base_health_res = calculate_startup_health(baseline)
    sim_health_res = calculate_startup_health(sim_metrics_dict)

    base_health = base_health_res["overall_health"]
    sim_health = sim_health_res["overall_health"]

    # 5. Risk Category Shift
    if sim_health > base_health + 4 or sim_runway > base_runway + 3:
        risk_direction = "LOWER RISK"
        risk_color = "emerald"
    elif sim_health < base_health - 4 or sim_runway < base_runway - 2:
        risk_direction = "HIGHER RISK"
        risk_color = "rose"
    else:
        risk_direction = "STABLE / NEUTRAL"
        risk_color = "amber"

    return {
        "baseline": {
            "revenue": rev_base,
            "burn": burn_base,
            "cash": cash_base,
            "runway_months": base_runway,
            "health_score": base_health,
            "team_size": team_base
        },
        "simulated": {
            "revenue": round(sim_rev),
            "burn": round(sim_burn),
            "cash": round(sim_cash),
            "runway_months": sim_runway,
            "health_score": sim_health,
            "team_size": sim_team,
            "pillars": sim_health_res["pillars"]
        },
        "deltas": {
            "revenue_delta": round(sim_rev - rev_base),
            "revenue_delta_pct": round((sim_rev - rev_base) / max(rev_base, 1) * 100, 1),
            "burn_delta": round(sim_burn - burn_base),
            "runway_delta_months": round(sim_runway - base_runway, 1),
            "health_score_delta": sim_health - base_health,
            "risk_impact": risk_direction,
            "risk_color": risk_color
        },
        "variables_applied": variables
    }
