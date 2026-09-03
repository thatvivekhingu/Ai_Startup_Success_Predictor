from functools import lru_cache
from pathlib import Path
import pandas as pd
import numpy as np
import joblib

try:
    import shap
    HAS_SHAP = True
except ImportError:
    HAS_SHAP = False

MODEL_PATH = Path(__file__).parent / "model" / "startup_model.pkl"

@lru_cache(maxsize=1)
def get_explainer():
    if not HAS_SHAP or not MODEL_PATH.exists():
        return None, None
    try:
        pipeline = joblib.load(MODEL_PATH)
        preprocessor = pipeline.named_steps.get("preprocessor")
        model = pipeline.named_steps.get("model")
        if preprocessor is None or model is None:
            return None, None
        explainer = shap.TreeExplainer(model)
        return explainer, preprocessor
    except Exception:
        return None, None

def calculate_shap_explanations(startup_data: dict) -> list[dict]:
    """
    Computes exact mathematical Shapley Additive exPlanations for individual startup predictions.
    Returns positive and negative driver impact scores.
    """
    explainer, preprocessor = get_explainer()
    if explainer is None or preprocessor is None:
        return []

    try:
        frame = pd.DataFrame([{k: v for k, v in startup_data.items() if k != "startup_name"}])
        
        # Ensure engineered features
        funding = float(frame.get("funding", [0])[0])
        burn_rate = float(frame.get("burn_rate", [1])[0])
        revenue = float(frame.get("revenue", [0])[0])
        team_size = float(frame.get("team_size", [1])[0])
        market_size = float(frame.get("market_size", [1])[0])

        frame["runway_months"] = funding / max(burn_rate, 1)
        frame["revenue_per_employee"] = revenue / max(team_size, 1)
        frame["funding_market_ratio"] = funding / max(market_size, 1)

        X_trans = preprocessor.transform(frame)
        feature_names = preprocessor.get_feature_names_out()

        shap_values = explainer.shap_values(X_trans)

        if isinstance(shap_values, list) and len(shap_values) > 1:
            vals = shap_values[1][0]
        elif hasattr(shap_values, "shape") and len(shap_values.shape) == 3:
            vals = shap_values[0, :, 1]
        else:
            vals = shap_values[0]

        explanations = []
        for name, val in zip(feature_names, vals):
            clean_name = name.split("__")[-1].replace("_", " ").title()
            val_flt = float(val)
            explanations.append({
                "feature": clean_name,
                "impact": round(val_flt * 100, 1),
                "direction": "positive" if val_flt >= 0 else "negative",
                "detail": f"SHAP marginal impact: {val_flt:+.3f} to success probability"
            })

        return sorted(explanations, key=lambda x: abs(x["impact"]), reverse=True)
    except Exception:
        return []
