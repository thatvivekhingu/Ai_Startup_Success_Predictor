from pathlib import Path
import json
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, precision_score, recall_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

try:
    from xgboost import XGBClassifier
    HAS_XGB = True
except ImportError:
    HAS_XGB = False

try:
    from lightgbm import LGBMClassifier
    HAS_LGBM = True
except ImportError:
    HAS_LGBM = False

from .feature_engineering import add_features
from .preprocessing import make_preprocessor

ROOT = Path(__file__).resolve().parents[1]
DATA = Path(__file__).parent / "data" / "startup.csv"
MODEL = ROOT / "backend" / "model" / "startup_model.pkl"
METRICS = ROOT / "backend" / "model" / "metrics.json"

def get_classifiers():
    models = {
        "random_forest": RandomForestClassifier(n_estimators=300, max_depth=7, class_weight="balanced", random_state=42),
        "gradient_boosting": GradientBoostingClassifier(n_estimators=250, learning_rate=0.06, max_depth=5, random_state=42),
        "decision_tree": DecisionTreeClassifier(max_depth=5, class_weight="balanced", random_state=42),
        "logistic_regression": LogisticRegression(max_iter=1500, solver="liblinear", class_weight="balanced", random_state=42),
    }
    if HAS_XGB:
        models["xgboost"] = XGBClassifier(n_estimators=250, max_depth=5, learning_rate=0.06, eval_metric="logloss", random_state=42)
    if HAS_LGBM:
        models["lightgbm"] = LGBMClassifier(n_estimators=250, max_depth=5, learning_rate=0.06, verbose=-1, random_state=42)
    return models

def train():
    frame = add_features(pd.read_csv(DATA))
    X = frame.drop(columns=["success"])
    y = frame["success"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)
    candidates = get_classifiers()
    
    results = {}
    trained = {}
    
    for name, estimator in candidates.items():
        pipeline = Pipeline([("preprocessor", make_preprocessor()), ("model", estimator)])
        pipeline.fit(X_train, y_train)
        
        pred = pipeline.predict(X_test)
        prob = pipeline.predict_proba(X_test)[:, 1]
        
        results[name] = {
            "accuracy": round(accuracy_score(y_test, pred), 4),
            "precision": round(precision_score(y_test, pred, zero_division=0), 4),
            "recall": round(recall_score(y_test, pred, zero_division=0), 4),
            "f1": round(f1_score(y_test, pred, zero_division=0), 4),
            "roc_auc": round(roc_auc_score(y_test, prob), 4)
        }
        trained[name] = pipeline
        
    best = max(
        results,
        key=lambda name: (results[name]["f1"], results[name]["roc_auc"], results[name]["accuracy"], name in ["xgboost", "random_forest", "lightgbm"])
    )
    
    MODEL.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(trained[best], MODEL)
    METRICS.write_text(json.dumps({"best_model": best, "models": results}, indent=2), encoding="utf-8")
    return best, results

if __name__ == "__main__":
    best, metrics = train()
    print(json.dumps({"best_model": best, "models": metrics}, indent=2))
