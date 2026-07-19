import pandas as pd

def add_features(frame: pd.DataFrame) -> pd.DataFrame:
    data = frame.copy()
    data["runway_months"] = data["funding"] / data["burn_rate"].clip(lower=1)
    data["revenue_per_employee"] = data["revenue"] / data["team_size"].clip(lower=1)
    data["funding_market_ratio"] = data["funding"] / data["market_size"].clip(lower=1)
    return data

