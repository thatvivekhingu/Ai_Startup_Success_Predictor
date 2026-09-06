import os
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

def train_startup_model(dataset_path="datasets/startup_data.csv", output_dir="ml_pipelines"):
    print(f"[*] Loading dataset from {dataset_path}...")
    if not os.path.exists(dataset_path):
        dataset_path = "Data/big_startup_secsees_dataset.csv"
        
    df = pd.read_csv(dataset_path)
    print(f"[*] Initial dataset shape: {df.shape}")
    
    # 1. Clean funding_total_usd
    def clean_funding(val):
        if pd.isna(val):
            return 0.0
        val_str = str(val).strip().replace(',', '').replace('$', '')
        if val_str == '-' or val_str == '':
            return 0.0
        try:
            return float(val_str)
        except:
            return 0.0

    df['funding_total_usd_clean'] = df['funding_total_usd'].apply(clean_funding)
    df['funding_rounds_clean'] = pd.to_numeric(df['funding_rounds'], errors='coerce').fillna(1)
    
    # 2. Date parsing & feature engineering
    df['founded_dt'] = pd.to_datetime(df['founded_at'], errors='coerce')
    df['first_funding_dt'] = pd.to_datetime(df['first_funding_at'], errors='coerce')
    df['last_funding_dt'] = pd.to_datetime(df['last_funding_at'], errors='coerce')
    
    reference_year = 2015.0
    df['startup_age_years'] = df['founded_dt'].apply(lambda d: reference_year - d.year if pd.notnull(d) else 3.0)
    df['startup_age_years'] = df['startup_age_years'].apply(lambda x: max(0.5, min(x, 30.0)))
    
    df['funding_duration_years'] = (df['last_funding_dt'] - df['first_funding_dt']).dt.days / 365.25
    df['funding_duration_years'] = df['funding_duration_years'].fillna(0.0).apply(lambda x: max(0.0, min(x, 20.0)))
    
    df['time_to_first_funding_years'] = (df['first_funding_dt'] - df['founded_dt']).dt.days / 365.25
    df['time_to_first_funding_years'] = df['time_to_first_funding_years'].fillna(1.5).apply(lambda x: max(0.0, min(x, 15.0)))
    
    # 3. Categorical features: category_list & country_code
    def extract_primary_category(cat):
        if pd.isna(cat) or str(cat).strip() == '':
            return 'Other'
        cats = [c.strip() for c in str(cat).split('|') if c.strip()]
        return cats[0] if cats else 'Other'
        
    df['primary_category'] = df['category_list'].apply(extract_primary_category)
    top_categories = df['primary_category'].value_counts().head(25).index.tolist()
    df['primary_category_clean'] = df['primary_category'].apply(lambda c: c if c in top_categories else 'Other')
    
    df['country_code_clean'] = df['country_code'].fillna('Other')
    top_countries = df['country_code_clean'].value_counts().head(20).index.tolist()
    if 'Other' not in top_countries:
        top_countries.append('Other')
    df['country_code_clean'] = df['country_code_clean'].apply(lambda c: c if c in top_countries else 'Other')
    
    # 4. Target variable creation
    # Acquired / IPO = 1 (Successful Exit), Closed = 0 (Failure)
    resolved_mask = df['status'].isin(['acquired', 'ipo', 'closed'])
    resolved_df = df[resolved_mask].copy()
    resolved_df['target'] = resolved_df['status'].apply(lambda s: 1 if s in ['acquired', 'ipo'] else 0)
    
    print(f"[*] Resolved dataset shape for classification: {resolved_df.shape}")
    
    # Feature columns
    num_features = ['funding_total_usd_clean', 'funding_rounds_clean', 'funding_duration_years', 'time_to_first_funding_years', 'startup_age_years']
    cat_features = ['primary_category_clean', 'country_code_clean']
    
    X = resolved_df[num_features + cat_features]
    y = resolved_df['target']
    
    # Preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_features),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), cat_features)
        ]
    )
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Transform
    X_train_trans = preprocessor.fit_transform(X_train)
    X_test_trans = preprocessor.transform(X_test)
    
    # Train Models
    models = {
        'RandomForest': RandomForestClassifier(n_estimators=150, max_depth=12, min_samples_split=5, random_state=42, class_weight='balanced'),
        'GradientBoosting': GradientBoostingClassifier(n_estimators=120, learning_rate=0.08, max_depth=5, random_state=42),
        'LogisticRegression': LogisticRegression(max_iter=1000, random_state=42, class_weight='balanced')
    }
    
    results = {}
    best_model_name = None
    best_roc_auc = 0
    best_model = None
    
    for name, model in models.items():
        print(f"[*] Training {name}...")
        model.fit(X_train_trans, y_train)
        y_pred = model.predict(X_test_trans)
        y_proba = model.predict_proba(X_test_trans)[:, 1]
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        roc = roc_auc_score(y_test, y_proba)
        
        results[name] = {
            'accuracy': round(float(acc), 4),
            'precision': round(float(prec), 4),
            'recall': round(float(rec), 4),
            'f1_score': round(float(f1), 4),
            'roc_auc': round(float(roc), 4),
            'confusion_matrix': confusion_matrix(y_test, y_pred).tolist()
        }
        print(f"    {name} -> Accuracy: {acc:.4f}, Precision: {prec:.4f}, Recall: {rec:.4f}, F1: {f1:.4f}, ROC-AUC: {roc:.4f}")
        
        if roc > best_roc_auc:
            best_roc_auc = roc
            best_model_name = name
            best_model = model
            
    print(f"[+] Best performing model: {best_model_name} (ROC-AUC: {best_roc_auc:.4f})")
    
    # Extract feature importance
    cat_encoder = preprocessor.named_transformers_['cat']
    cat_feature_names = cat_encoder.get_feature_names_out(cat_features).tolist()
    all_feature_names = num_features + cat_feature_names
    
    if hasattr(best_model, 'feature_importances_'):
        importances = best_model.feature_importances_
        feature_importance_dict = sorted(
            [{'feature': name, 'importance': round(float(imp), 4)} for name, imp in zip(all_feature_names, importances)],
            key=lambda x: x['importance'],
            reverse=True
        )[:15]
    else:
        feature_importance_dict = []

    # Category and Country success stats for frontend analytics
    category_stats = {}
    for cat in top_categories:
        sub = df[df['primary_category'] == cat]
        total = len(sub)
        success_cnt = len(sub[sub['status'].isin(['acquired', 'ipo'])])
        category_stats[cat] = {
            'total': total,
            'success_rate': round(success_cnt / total if total > 0 else 0, 3),
            'avg_funding': round(float(sub['funding_total_usd_clean'].mean()), 2)
        }
        
    country_stats = {}
    for country in top_countries:
        sub = df[df['country_code_clean'] == country]
        total = len(sub)
        success_cnt = len(sub[sub['status'].isin(['acquired', 'ipo'])])
        country_stats[country] = {
            'total': total,
            'success_rate': round(success_cnt / total if total > 0 else 0, 3)
        }
        
    os.makedirs(output_dir, exist_ok=True)
    
    joblib.dump(best_model, os.path.join(output_dir, "model.pkl"))
    joblib.dump(preprocessor, os.path.join(output_dir, "preprocessor.pkl"))
    
    metadata = {
        "best_model": best_model_name,
        "models_comparison": results,
        "metrics": results[best_model_name],
        "top_features": feature_importance_dict,
        "num_features": num_features,
        "cat_features": cat_features,
        "top_categories": top_categories,
        "top_countries": top_countries,
        "category_stats": category_stats,
        "country_stats": country_stats,
        "dataset_summary": {
            "total_rows": int(len(df)),
            "resolved_rows": int(len(resolved_df)),
            "operating_count": int((df['status'] == 'operating').sum()),
            "acquired_count": int((df['status'] == 'acquired').sum()),
            "closed_count": int((df['status'] == 'closed').sum()),
            "ipo_count": int((df['status'] == 'ipo').sum()),
        },
        "trained_at": datetime.utcnow().isoformat()
    }
    
    with open(os.path.join(output_dir, "metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)
        
    print(f"[+] Model and artifacts successfully saved to {output_dir}/")
    return metadata

if __name__ == "__main__":
    train_startup_model()
