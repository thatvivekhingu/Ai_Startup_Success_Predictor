import re
import io
import json

def parse_unstructured_text(text: str) -> dict:
    """
    Extracts numerical metrics from natural language text entered by founder or voice transcript
    (e.g., 'Last month revenue was 28 lakh and burn was 11 lakh with 15 engineers in Ahmedabad').
    """
    extracted = {}
    
    # Revenue regex (Lakhs, Cr, K, Millions)
    rev_match = re.search(r'revenue\s*(?:was|is|of)?\s*(?:₹|\$)?\s*([\d\.]+)\s*(lakh|lac|cr|crore|k|m|million)?', text, re.IGNORECASE)
    if rev_match:
        val = float(rev_match.group(1))
        unit = (rev_match.group(2) or "").lower()
        if unit in ["lakh", "lac"]:
            val *= 100000
        elif unit in ["cr", "crore"]:
            val *= 10000000
        elif unit == "k":
            val *= 1000
        elif unit in ["m", "million"]:
            val *= 1000000
        extracted["monthly_revenue"] = val

    # Burn regex
    burn_match = re.search(r'burn\s*(?:rate|was|is|of)?\s*(?:₹|\$)?\s*([\d\.]+)\s*(lakh|lac|cr|crore|k|m|million)?', text, re.IGNORECASE)
    if burn_match:
        val = float(burn_match.group(1))
        unit = (burn_match.group(2) or "").lower()
        if unit in ["lakh", "lac"]:
            val *= 100000
        elif unit in ["cr", "crore"]:
            val *= 10000000
        elif unit == "k":
            val *= 1000
        elif unit in ["m", "million"]:
            val *= 1000000
        extracted["monthly_burn"] = val

    # Cash / Funding regex
    cash_match = re.search(r'(?:cash|funding|bank|runway cash)\s*(?:was|is|of)?\s*(?:₹|\$)?\s*([\d\.]+)\s*(lakh|lac|cr|crore|k|m|million)?', text, re.IGNORECASE)
    if cash_match:
        val = float(cash_match.group(1))
        unit = (cash_match.group(2) or "").lower()
        if unit in ["lakh", "lac"]:
            val *= 100000
        elif unit in ["cr", "crore"]:
            val *= 10000000
        elif unit == "k":
            val *= 1000
        elif unit in ["m", "million"]:
            val *= 1000000
        extracted["cash_balance"] = val

    # Team size regex
    team_match = re.search(r'(\d+)\s*(?:team members|employees|engineers|people|headcount)', text, re.IGNORECASE)
    if team_match:
        extracted["headcount"] = int(team_match.group(1))

    # Customer regex
    cust_match = re.search(r'(\d+)\s*(?:customers|clients|users|accounts)', text, re.IGNORECASE)
    if cust_match:
        extracted["customer_count"] = int(cust_match.group(1))

    return extracted
