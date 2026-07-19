from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

CATEGORICAL = ["country", "industry", "product_stage"]
NUMERICAL = ["funding", "team_size", "experience", "revenue", "burn_rate", "market_size", "investors", "competition", "growth_rate", "runway_months", "revenue_per_employee", "funding_market_ratio"]

def make_preprocessor():
    numeric = Pipeline([("imputer", SimpleImputer(strategy="median")), ("scaler", StandardScaler())])
    categorical = Pipeline([("imputer", SimpleImputer(strategy="most_frequent")), ("encoder", OneHotEncoder(handle_unknown="ignore"))])
    return ColumnTransformer([("numeric", numeric, NUMERICAL), ("categorical", categorical, CATEGORICAL)])

