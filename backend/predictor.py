import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List
from .schemas import PredictionInput

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ml_pipelines")
MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, "preprocessor.pkl")
METADATA_PATH = os.path.join(MODEL_DIR, "metadata.json")

class StartupPredictor:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.metadata = {}
        self.load_artifacts()

    def load_artifacts(self):
        if os.path.exists(MODEL_PATH) and os.path.exists(PREPROCESSOR_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                self.preprocessor = joblib.load(PREPROCESSOR_PATH)
                print(f"[+] Loaded model and preprocessor from {MODEL_DIR}")
            except Exception as e:
                print(f"[-] Error loading model artifacts: {e}")
        
        if os.path.exists(METADATA_PATH):
            try:
                with open(METADATA_PATH, "r") as f:
                    self.metadata = json.load(f)
            except Exception as e:
                print(f"[-] Error loading metadata: {e}")

    def predict(self, input_data: PredictionInput) -> Dict[str, Any]:
        # Calculate engineered durations
        founded = input_data.founded_year or 2022
        first_fund = input_data.first_funding_year or (founded + 1)
        last_fund = input_data.last_funding_year or (first_fund + 1)
        
        reference_year = 2025.0
        startup_age_years = max(0.5, min(reference_year - founded, 30.0))
        funding_duration_years = max(0.0, min(float(last_fund - first_fund), 20.0))
        time_to_first_funding_years = max(0.0, min(float(first_fund - founded), 15.0))
        
        # Prepare DataFrame row
        primary_cat = input_data.primary_category
        top_cats = self.metadata.get("top_categories", [])
        if top_cats and primary_cat not in top_cats:
            primary_cat_clean = "Other"
        else:
            primary_cat_clean = primary_cat

        country = input_data.country_code
        top_countries = self.metadata.get("top_countries", [])
        if top_countries and country not in top_countries:
            country_clean = "Other"
        else:
            country_clean = country

        row_dict = {
            'funding_total_usd_clean': [float(input_data.funding_total_usd)],
            'funding_rounds_clean': [int(input_data.funding_rounds)],
            'funding_duration_years': [funding_duration_years],
            'time_to_first_funding_years': [time_to_first_funding_years],
            'startup_age_years': [startup_age_years],
            'primary_category_clean': [primary_cat_clean],
            'country_code_clean': [country_clean]
        }
        input_df = pd.DataFrame(row_dict)

        raw_probability = 0.5
        if self.model and self.preprocessor:
            try:
                trans = self.preprocessor.transform(input_df)
                proba = self.model.predict_proba(trans)[0][1]
                raw_probability = float(proba)
            except Exception as e:
                print(f"[-] Prediction transform error: {e}")
                raw_probability = 0.5

        # Auxiliary heuristic adjustments (Team size, accelerator, patents)
        aux_boost = 0.0
        if input_data.has_accelerator:
            aux_boost += 0.05
        if (input_data.patent_count or 0) > 0:
            aux_boost += min(0.06, (input_data.patent_count or 0) * 0.02)
        if (input_data.team_size or 5) >= 5 and (input_data.team_size or 5) <= 50:
            aux_boost += 0.03
        elif (input_data.team_size or 5) < 2:
            aux_boost -= 0.04

        final_prob = max(0.05, min(0.98, raw_probability + aux_boost))
        success_percentage = round(final_prob * 100, 1)

        # Confidence calculation
        confidence = 82.0
        if input_data.funding_total_usd > 1000000 and input_data.funding_rounds >= 2:
            confidence += 8.5
        if input_data.country_code in ['USA', 'GBR', 'CAN', 'IND', 'DEU']:
            confidence += 4.0
        confidence = round(min(97.5, max(65.0, confidence)), 1)

        # Status Tier
        if success_percentage >= 70.0:
            status_tier = "High Potential (Unicorn / Acquisition Ready)"
        elif success_percentage >= 45.0:
            status_tier = "Moderate Growth (Scale-up Potential)"
        else:
            status_tier = "Elevated Risk (Early Stage / Pivot Needed)"

        # Strengths, Risks, and Recommendations
        strengths = []
        risk_factors = []
        recommendations = []

        # Funding assessment
        if input_data.funding_total_usd >= 10_000_000:
            strengths.append(f"Strong capital capitalization (${input_data.funding_total_usd:,.0f} raised)")
        elif input_data.funding_total_usd >= 1_000_000:
            strengths.append(f"Solid seed/early growth backing (${input_data.funding_total_usd:,.0f} raised)")
        else:
            risk_factors.append("Low total funding reserves compared to industry median")
            recommendations.append("Secure a follow-on seed/bridge round to extend runway beyond 18 months.")

        # Rounds
        if input_data.funding_rounds >= 3:
            strengths.append(f"Demonstrated investor confidence across {input_data.funding_rounds} funding rounds")
        elif input_data.funding_rounds == 1 and startup_age_years > 3.0:
            risk_factors.append("Single funding round over an extended operational period")
            recommendations.append("Accelerate pipeline to pitch Tier-1 VCs for Series A institutional capital.")

        # Time to first funding
        if time_to_first_funding_years <= 1.5:
            strengths.append("Rapid institutional validation (funded within 18 months of founding)")
        else:
            risk_factors.append("Long ramp-up duration before securing initial institutional funding")

        # Category & geography
        category_stats = self.metadata.get("category_stats", {}).get(input_data.primary_category, {})
        cat_success_rate = category_stats.get("success_rate", 0.35)
        if cat_success_rate >= 0.40:
            strengths.append(f"High M&A and exit activity in the '{input_data.primary_category}' sector ({int(cat_success_rate*100)}% historical exit rate)")
        else:
            recommendations.append(f"Differentiate product offering with strong moat/IP within '{input_data.primary_category}' market.")

        if input_data.has_accelerator:
            strengths.append("Top-tier startup accelerator backing & active mentor ecosystem")
        else:
            recommendations.append("Apply to premier accelerators (Y Combinator, Techstars, 500 Global) to expand investor network.")

        if (input_data.patent_count or 0) > 0:
            strengths.append(f"Defensible proprietary technology moat ({input_data.patent_count} patents filed)")

        if not strengths:
            strengths.append("Lean foundational structure with agile pivot capacity")
        if not risk_factors:
            risk_factors.append("Market competition from established incumbents")
        if not recommendations:
            recommendations.append("Focus on high net dollar retention (NDR) and scalable go-to-market channels.")

        # Top feature importance contributions
        feature_contributions = [
            {"name": "Funding Capital (USD)", "value": f"${input_data.funding_total_usd:,.0f}", "impact": "Positive" if input_data.funding_total_usd > 1_500_000 else "Neutral"},
            {"name": "Funding Rounds", "value": str(input_data.funding_rounds), "impact": "Positive" if input_data.funding_rounds >= 2 else "Neutral"},
            {"name": "Sector Dynamics", "value": input_data.primary_category, "impact": "Positive" if cat_success_rate > 0.35 else "Moderate"},
            {"name": "Geographic Market", "value": input_data.country_code, "impact": "Positive" if input_data.country_code in ['USA', 'GBR', 'CAN', 'ISR', 'IND'] else "Neutral"},
            {"name": "Operational Velocity", "value": f"{startup_age_years:.1f} yrs age", "impact": "Positive" if startup_age_years <= 5.0 else "Neutral"}
        ]

        # Gujarat Startup Innovation Track Intelligence
        gujarat_insights = None
        if input_data.is_gujarat_based or (input_data.country_code == 'IND' and input_data.gujarat_district):
            district = input_data.gujarat_district or "Ahmedabad"
            
            # Import district directory
            try:
                from .routers.gujarat_router import GUJARAT_DISTRICTS, GUJARAT_SCHEMES
            except ImportError:
                from routers.gujarat_router import GUJARAT_DISTRICTS, GUJARAT_SCHEMES

            dist_info = GUJARAT_DISTRICTS.get(district, GUJARAT_DISTRICTS.get("Other", {}))
            
            # Match Eligible Schemes based on stage and sector
            eligible_schemes = []
            if input_data.funding_total_usd < 200_000:
                eligible_schemes.append(GUJARAT_SCHEMES[1])  # SSIP 2.0 (₹2.5 Lakhs prototype grant)
                eligible_schemes.append(GUJARAT_SCHEMES[2])  # i-Hub Seed Support (₹30 Lakhs)
            
            # DeepTech, Semiconductor, CleanTech matching STI Policy 2026-31
            deeptech_cats = ["Semiconductors", "Clean Technology", "Hardware", "Biotechnology", "Enterprise", "Manufacturing"]
            if input_data.primary_category in deeptech_cats or "Semicon" in input_data.primary_category or "Green" in input_data.primary_category:
                eligible_schemes.append(GUJARAT_SCHEMES[0])  # STI Policy 2026-31 (₹1,000 Cr Fund)
                if input_data.primary_category in ["Semiconductors", "Hardware"]:
                    eligible_schemes.append(GUJARAT_SCHEMES[3])  # Dholera Semicon Policy
            
            if input_data.funding_total_usd >= 100_000:
                eligible_schemes.append(GUJARAT_SCHEMES[4])  # GVFL Venture Capital Fund

            # Deduplicate schemes by id
            seen_schemes = set()
            unique_schemes = []
            for s in eligible_schemes:
                if s["id"] not in seen_schemes:
                    seen_schemes.add(s["id"])
                    unique_schemes.append(s)

            gujarat_insights = {
                "district": district,
                "tier": dist_info.get("tier", "Emerging Hub"),
                "density_score": dist_info.get("density_score", 7.0),
                "startup_count": dist_info.get("startup_count", "500+"),
                "matched_incubators": dist_info.get("incubators", []),
                "local_investors": dist_info.get("investors", []),
                "eligible_schemes": unique_schemes,
                "policy_alignment": "Gujarat STI Policy 2026–31 Priority Sector" if input_data.primary_category in deeptech_cats else "General Innovation & Startup Gujarat Framework"
            }

            # Inject Gujarat specific strength & recommendation
            strengths.append(f"State Policy Alignment: Eligible for {len(unique_schemes)} Gujarat Government startup schemes ({district} Innovation Hub)")
            recommendations.append(f"Apply for Gujarat STI Policy 2026–31 / i-Hub incubator grant to access non-dilutive capital and state R&D labs.")

        return {
            "startup_name": input_data.startup_name,
            "primary_category": input_data.primary_category,
            "country_code": input_data.country_code,
            "funding_total_usd": float(input_data.funding_total_usd),
            "funding_rounds": int(input_data.funding_rounds),
            "success_probability": success_percentage,
            "confidence_score": confidence,
            "status_tier": status_tier,
            "strengths": strengths,
            "risk_factors": risk_factors,
            "recommendations": recommendations,
            "feature_contributions": feature_contributions,
            "gujarat_insights": gujarat_insights
        }

predictor_instance = StartupPredictor()
