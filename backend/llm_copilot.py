import os
import json
import urllib.request
import urllib.error
from pathlib import Path
from dotenv import load_dotenv
from .services import analyze_startup, score_startup

load_dotenv()

class LLMStartupCopilot:
    """
    Enterprise AI Startup Copilot & Strategic Advisory Engine.
    Combines Machine Learning risk scores, SHAP feature attributions, and Google Gemini LLM reasoning.
    """

    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")

    def call_gemini_llm(self, prompt: str) -> str | None:
        if not self.gemini_api_key:
            return None

        models_to_try = [
            "gemini-3.6-flash",
            "gemini-3.1-pro-preview",
            "gemini-2.0-flash",
            "gemini-1.5-flash"
        ]

        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 1000
            }
        }
        data_bytes = json.dumps(payload).encode("utf-8")

        for model_name in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={self.gemini_api_key}"
            req = urllib.request.Request(
                url,
                data=data_bytes,
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            try:
                with urllib.request.urlopen(req, timeout=12) as response:
                    res_data = json.loads(response.read().decode("utf-8"))
                    candidates = res_data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        if parts and "text" in parts[0]:
                            return parts[0]["text"]
            except Exception:
                continue
        return None

    def generate_advisory(self, startup_data: dict) -> dict:
        """
        Generates full advisory report including investment memo, risk diagnosis, and founder action plan.
        """
        prediction_label, probability = score_startup(startup_data)
        analysis = analyze_startup(startup_data, probability=probability)

        startup_name = startup_data.get("startup_name", "Venture Candidate")
        industry = startup_data.get("industry", "Technology")
        country = startup_data.get("country", "Global")
        funding = float(startup_data.get("funding", 0))
        revenue = float(startup_data.get("revenue", 0))
        burn_rate = float(startup_data.get("burn_rate", 1))
        team_size = int(startup_data.get("team_size", 1))
        experience = float(startup_data.get("experience", 0))
        stage = startup_data.get("product_stage", "MVP")
        growth_rate = float(startup_data.get("growth_rate", 0))
        competition = float(startup_data.get("competition", 50))

        runway_months = round(funding / max(burn_rate, 1), 1)
        burn_multiple = round(burn_rate / max(revenue / 12, 1), 1)
        rev_per_employee = round(revenue / max(team_size, 1))

        if probability >= 0.70:
            tier = "Tier 1 — High Growth / Institutional Grade"
            verdict = "HIGH SUCCESS PROBABILITY"
            action_headline = "Prepare for Institutional Capital Scale-Up"
        elif probability >= 0.50:
            tier = "Tier 2 — Moderate Trajectory / Strategic Optimization Needed"
            verdict = "BALANCED GROWTH"
            action_headline = "Focus on Unit Economics & Margin Optimization"
        else:
            tier = "Tier 3 — High Operational Risk / Critical Runway Intervention"
            verdict = "ELEVATED RISK"
            action_headline = "Immediate Burn Reduction & Capital Restructuring"

        action_plan = []
        if runway_months < 12:
            action_plan.append({
                "category": "Capital Preservation",
                "priority": "Critical",
                "action": f"Extend current runway from {runway_months} months to 18+ months by reducing non-core expenditures or securing bridge financing."
            })
        else:
            action_plan.append({
                "category": "Growth Acceleration",
                "priority": "High",
                "action": f"Deploy healthy {runway_months} months runway into high-conversion customer acquisition and product iteration loops."
            })

        if burn_multiple > 2.5:
            action_plan.append({
                "category": "Unit Economics",
                "priority": "High",
                "action": f"Burn multiple is elevated ({burn_multiple}x monthly revenue). Target burn multiple below 1.8x before next priced round."
            })
        else:
            action_plan.append({
                "category": "Capital Efficiency",
                "priority": "Medium",
                "action": f"Strong capital efficiency ({burn_multiple}x burn multiple). Highlight this metric prominently to prospective investors."
            })

        if competition >= 70:
            action_plan.append({
                "category": "Competitive Moat",
                "priority": "High",
                "action": f"In a crowded {industry} market (competition score {competition}/100), build proprietary technical moats and sticky enterprise workflows."
            })
        elif growth_rate < 25:
            action_plan.append({
                "category": "Topline Growth",
                "priority": "High",
                "action": f"Annual growth rate ({growth_rate}%) is below venture benchmark (>40%). Prioritize high-retention expansion loops."
            })

        # Try Gemini API for customized narrative
        gemini_prompt = f"""
You are a senior Venture Capital Partner evaluating a startup investment.
Write a concise, professional 3-paragraph executive investment memo for:
Startup: {startup_name}
Industry: {industry} ({country})
Stage: {stage}
Total Funding: ${funding:,.0f} | Monthly Burn: ${burn_rate:,.0f} | Runway: {runway_months} months
Annual Revenue: ${revenue:,.0f} | Growth Rate: {growth_rate}% YoY
ML Success Probability: {probability * 100:.1f}% ({verdict})
Key Risk Factors: Competition {competition}/100, Burn multiple {burn_multiple}x.

Format in clean markdown with sections:
### 1. Executive Thesis
### 2. Risk & Traction Diagnostics
### 3. Investment Committee Verdict & Next Steps
"""
        gemini_memo = self.call_gemini_llm(gemini_prompt)

        if gemini_memo:
            memo = gemini_memo
            source = "Google Gemini AI (Live LLM)"
        else:
            source = "Foundr.AI Core Intelligence"
            memo = f"""### 🏛️ Executive Investment Memo: {startup_name}

**Sector:** {industry} | **Geographic Base:** {country} | **Product Stage:** {stage}  
**Assessment Tier:** {tier}  
**Success Index:** {analysis['success_index']}/100 | **Model Success Probability:** {probability * 100:.1f}% ({prediction_label})

---

#### 1. Executive Summary & Thesis
{startup_name} is operating in the {industry} vertical with ${funding:,.0f} in capital raised to date and annual revenue of ${revenue:,.0f}. The quantitative AI scoring engine assesses this venture at **{probability * 100:.1f}% success likelihood**, placing it in **{tier}**.

#### 2. Financial & Operating Dynamics
- **Funded Runway:** {runway_months} months at current burn (${burn_rate:,.0f}/month).
- **Burn Multiple:** {burn_multiple}x net monthly revenue.
- **Team Productivity:** ${rev_per_employee:,.0f} ARR per full-time employee across {team_size} team members.
- **Growth Velocity:** {growth_rate:.1f}% year-over-year revenue expansion.

#### 3. Explainable Feature Attribution (Top Drivers)
"""
            for exp in analysis.get("explanations", [])[:5]:
                sign = "🟢 POSITIVE" if exp["direction"] == "positive" else "🔴 NEGATIVE"
                memo += f"- **{exp['feature']} ({sign}):** Impact {exp['impact']:+.1f}% — {exp['detail']}\n"

            memo += f"""
#### 4. Strategic Recommendation for Leadership
**Verdict:** [{verdict}]  
*Key Focus:* {action_headline}.
"""

        return {
            "startup_name": startup_name,
            "tier": tier,
            "verdict": verdict,
            "action_headline": action_headline,
            "probability": probability,
            "success_index": analysis["success_index"],
            "investment_memo_markdown": memo,
            "copilot_source": source,
            "action_plan": action_plan,
            "metrics": {
                "runway_months": runway_months,
                "burn_multiple": burn_multiple,
                "revenue_per_employee": rev_per_employee,
                "growth_rate": growth_rate,
                "team_size": team_size
            },
            "top_drivers": analysis.get("explanations", [])[:6]
        }

copilot = LLMStartupCopilot()
