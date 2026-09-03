import numpy as np

def run_monte_carlo_simulation(baseline: dict, num_simulations: int = 1500, horizon_months: int = 12) -> dict:
    """
    Runs stochastic Monte Carlo simulations to calculate 12-month survival probabilities,
    cash shortage probability, and uncertainty fan-charts.
    """
    np.random.seed(42)

    initial_cash = float(baseline.get("cash_balance", baseline.get("funding", 8500000)))
    monthly_rev = float(baseline.get("monthly_revenue", baseline.get("revenue", 1800000)))
    monthly_burn = float(baseline.get("monthly_burn", baseline.get("burn_rate", 1200000)))
    base_growth = float(baseline.get("growth_rate", 14.0)) / 100.0 / 12.0 # monthly growth rate

    # Volatility assumptions
    rev_volatility = 0.12 # 12% standard deviation in revenue
    burn_volatility = 0.08 # 8% standard deviation in unexpected expenses

    all_cash_trajectories = np.zeros((num_simulations, horizon_months))
    survived_count = 0

    for sim in range(num_simulations):
        cash = initial_cash
        rev = monthly_rev
        survived = True

        for m in range(horizon_months):
            # Stochastic revenue shocks
            rev_growth_shock = np.random.normal(base_growth, rev_volatility)
            rev = max(0.0, rev * (1.0 + rev_growth_shock))

            # Stochastic burn shocks
            burn_shock = np.random.normal(1.0, burn_volatility)
            burn = max(1000.0, monthly_burn * burn_shock)

            # Net cash change
            net_cashflow = rev - burn
            cash += net_cashflow

            if cash <= 0:
                cash = 0.0
                survived = False

            all_cash_trajectories[sim, m] = cash

        if survived:
            survived_count += 1

    survival_prob = round((survived_count / num_simulations) * 100, 1)
    cash_shortage_prob = round(100.0 - survival_prob, 1)

    # Calculate percentiles across months
    p10_trajectory = np.percentile(all_cash_trajectories, 10, axis=0).tolist()
    p50_trajectory = np.percentile(all_cash_trajectories, 50, axis=0).tolist()
    p90_trajectory = np.percentile(all_cash_trajectories, 90, axis=0).tolist()

    month_12_outcomes = all_cash_trajectories[:, -1]
    worst_case_12m = round(float(np.percentile(month_12_outcomes, 10)))
    expected_12m = round(float(np.percentile(month_12_outcomes, 50)))
    best_case_12m = round(float(np.percentile(month_12_outcomes, 90)))

    # Value at Risk (95% confidence)
    var_95 = round(max(0.0, initial_cash - np.percentile(month_12_outcomes, 5)))

    months_labels = [f"M+{i+1}" for i in range(horizon_months)]

    return {
        "num_simulations": num_simulations,
        "horizon_months": horizon_months,
        "survival_probability_pct": survival_prob,
        "cash_shortage_probability_pct": cash_shortage_prob,
        "verdict": "STRONG RUNWAY" if survival_prob >= 80 else "MODERATE RISK" if survival_prob >= 55 else "HIGH DEFAULT RISK",
        "month_12_estimates": {
            "worst_case_p10": worst_case_12m,
            "expected_p50": expected_12m,
            "best_case_p90": best_case_12m
        },
        "value_at_risk_95": var_95,
        "timeline_labels": months_labels,
        "fan_chart": {
            "worst_case_p10": [round(x) for x in p10_trajectory],
            "expected_p50": [round(x) for x in p50_trajectory],
            "best_case_p90": [round(x) for x in p90_trajectory]
        },
        "assumptions": [
            f"Initial Cash: ${initial_cash:,.0f} USD / INR",
            f"Monthly Burn: ${monthly_burn:,.0f} (8% volatility σ)",
            f"Monthly Revenue: ${monthly_rev:,.0f} (12% market volatility σ)",
            f"Number of Stochastic Trials: {num_simulations:,}"
        ]
    }
