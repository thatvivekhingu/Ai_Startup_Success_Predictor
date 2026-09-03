from pathlib import Path
from functools import lru_cache
import torch
import torch.nn as nn
import pandas as pd
import numpy as np
import joblib

WEIGHTS_PATH = Path(__file__).parent / "model" / "pytorch_startup_model.pth"
CLASSICAL_MODEL_PATH = Path(__file__).parent / "model" / "startup_model.pkl"

class StartupTabularNN(nn.Module):
    def __init__(self, input_dim: int = 15):
        super(StartupTabularNN, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.BatchNorm1d(128),
            nn.GELU(),
            nn.Dropout(0.3),
            nn.Linear(128, 64),
            nn.BatchNorm1d(64),
            nn.GELU(),
            nn.Dropout(0.3),
            nn.Linear(64, 32),
            nn.BatchNorm1d(32),
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(32, 1)
        )

    def forward(self, x):
        return self.network(x)

@lru_cache(maxsize=1)
def load_pytorch_model():
    if not WEIGHTS_PATH.exists() or not CLASSICAL_MODEL_PATH.exists():
        return None, None
    try:
        pipeline = joblib.load(CLASSICAL_MODEL_PATH)
        preprocessor = pipeline.named_steps.get("preprocessor")
        if preprocessor is None:
            return None, None

        # Determine input dimension from preprocessor
        dummy_df = pd.DataFrame([{
            "country": "USA", "industry": "SaaS", "funding": 1000000.0, "team_size": 10,
            "experience": 5.0, "revenue": 500000.0, "burn_rate": 50000.0, "market_size": 100000000.0,
            "product_stage": "MVP", "investors": 2, "competition": 50.0, "growth_rate": 30.0,
            "runway_months": 20.0, "revenue_per_employee": 50000.0, "funding_market_ratio": 0.01
        }])
        X_dummy = preprocessor.transform(dummy_df)
        input_dim = X_dummy.shape[1]

        model = StartupTabularNN(input_dim=input_dim)
        state_dict = torch.load(WEIGHTS_PATH, map_location=torch.device("cpu"))
        
        # Check matching dimension before loading
        first_weight = state_dict.get("network.0.weight")
        if first_weight is not None and first_weight.shape[1] == input_dim:
            model.load_state_dict(state_dict)
        model.eval()
        return model, preprocessor
    except Exception:
        return None, None

def score_with_pytorch(startup_data: dict) -> tuple[str, float] | None:
    """
    Scores a startup using the PyTorch Deep Tabular Neural Network.
    Returns ('Likely to succeed' | 'High risk', probability).
    """
    model, preprocessor = load_pytorch_model()
    if model is None or preprocessor is None:
        return None

    try:
        frame = pd.DataFrame([{k: v for k, v in startup_data.items() if k != "startup_name"}])
        funding = float(frame.get("funding", [0])[0])
        burn_rate = float(frame.get("burn_rate", [1])[0])
        revenue = float(frame.get("revenue", [0])[0])
        team_size = float(frame.get("team_size", [1])[0])
        market_size = float(frame.get("market_size", [1])[0])

        frame["runway_months"] = funding / max(burn_rate, 1)
        frame["revenue_per_employee"] = revenue / max(team_size, 1)
        frame["funding_market_ratio"] = funding / max(market_size, 1)

        X_trans = preprocessor.transform(frame)
        X_tensor = torch.tensor(X_trans, dtype=torch.float32)

        model.eval()
        with torch.no_grad():
            logit = model(X_tensor)
            probability = round(torch.sigmoid(logit).item(), 4)

        label = "Likely to succeed" if probability >= 0.50 else "High risk"
        return label, probability
    except Exception:
        return None
