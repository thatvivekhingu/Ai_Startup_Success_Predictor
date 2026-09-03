import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.health_engine import calculate_startup_health
from backend.forecasting_engine import generate_forecast
from backend.simulation_engine import run_what_if_simulation, PRESETS
from backend.monte_carlo_engine import run_monte_carlo_simulation
from backend.early_warning_engine import detect_early_warnings
from backend.agentic_copilot import agent_copilot

client = TestClient(app)

def test_startup_health_calculation():
    sample = {
        "monthly_revenue": 1800000,
        "monthly_burn": 1200000,
        "cash_balance": 8500000,
        "growth_rate": 18.0,
        "churn_rate": 2.2,
        "retention_rate": 97.8,
        "headcount": 12,
        "avg_experience_years": 5.5,
        "market_size": 250000000,
        "competition": 45.0
    }
    res = calculate_startup_health(sample)
    assert 0 <= res["overall_health"] <= 100
    assert len(res["pillars"]) == 6
    assert res["status"] in ["HEALTHY", "STABLE / MONITOR", "CRITICAL INTERVENTION"]
    assert res["runway_months"] > 0

def test_forecasting_engine():
    res = generate_forecast([], horizon_months=12)
    assert len(res["forecast_periods"]) == 12
    assert len(res["revenue_forecast"]["base"]) == 12
    assert len(res["cash_trajectory"]["base"]) == 12

def test_simulation_engine_what_if():
    baseline = {
        "monthly_revenue": 1800000,
        "monthly_burn": 1200000,
        "cash_balance": 8500000,
        "growth_rate": 15.0,
        "headcount": 10
    }
    variables = PRESETS["bootstrap"]["variables"]
    res = run_what_if_simulation(baseline, variables)
    assert res["simulated"]["burn"] < baseline["monthly_burn"]
    assert res["simulated"]["runway_months"] >= res["baseline"]["runway_months"]

def test_monte_carlo_risk_simulation():
    baseline = {
        "cash_balance": 8500000,
        "monthly_revenue": 1800000,
        "monthly_burn": 1200000,
        "growth_rate": 15.0
    }
    res = run_monte_carlo_simulation(baseline, num_simulations=500, horizon_months=12)
    assert 0 <= res["survival_probability_pct"] <= 100
    assert len(res["fan_chart"]["expected_p50"]) == 12

def test_early_warning_engine():
    critical_sample = {
        "monthly_revenue": 500000,
        "monthly_burn": 2000000,
        "cash_balance": 3000000, # 2 months runway
        "growth_rate": 5.0,
        "headcount": 18,
        "churn_rate": 5.0
    }
    warnings = detect_early_warnings(critical_sample)
    assert len(warnings) > 0
    assert any(w["severity"] == "critical" for w in warnings)

def test_agentic_copilot_tool_execution():
    sample = {
        "startup_name": "NovaAI Technologies",
        "country": "India",
        "industry": "SaaS",
        "monthly_revenue": 1800000,
        "monthly_burn": 1200000,
        "cash_balance": 8500000,
        "growth_rate": 18.0,
        "headcount": 12,
        "team_size": 12,
        "experience": 5.0,
        "market_size": 250000000,
        "competition": 45.0,
        "product_stage": "Seed",
        "investors": 3
    }
    res = agent_copilot.execute_plan("How can I survive the next 12 months?", sample)
    assert len(res["tools_called"]) >= 4
    assert res["health_score"] > 0
    assert "response_markdown" in res
