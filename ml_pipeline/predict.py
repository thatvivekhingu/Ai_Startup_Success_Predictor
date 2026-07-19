from pathlib import Path
import joblib
import pandas as pd
from .feature_engineering import add_features

def predict_one(values: dict):
    model_path = Path(__file__).resolve().parents[1] / "backend" / "model" / "startup_model.pkl"
    model = joblib.load(model_path); frame = add_features(pd.DataFrame([values])); probability = float(model.predict_proba(frame)[0,1])
    return {"prediction": "Likely to succeed" if probability >= .5 else "High risk", "probability": round(probability,4)}

