import csv
import re
from io import StringIO

from pydantic import ValidationError

from .schemas import PredictionCreate


FIELD_ALIASES = {
    "startup_name": ["startup_name", "startup", "company_name", "company", "name"],
    "country": ["country", "location", "hq_country", "headquarters"],
    "industry": ["industry", "sector", "vertical", "category"],
    "funding": ["funding", "funding_raised", "total_funding", "capital_raised"],
    "team_size": ["team_size", "employees", "employee_count", "headcount"],
    "experience": ["experience", "founder_experience", "experience_years"],
    "revenue": ["revenue", "annual_revenue", "arr", "sales"],
    "burn_rate": ["burn_rate", "monthly_burn", "burn", "monthly_burn_rate"],
    "market_size": ["market_size", "tam", "addressable_market", "total_addressable_market"],
    "product_stage": ["product_stage", "stage", "company_stage"],
    "investors": ["investors", "investor_count", "active_investors"],
    "competition": ["competition", "competition_index", "competitive_intensity"],
    "growth_rate": ["growth_rate", "growth", "annual_growth", "yoy_growth"],
}

NUMERIC_FIELDS = {
    "funding",
    "team_size",
    "experience",
    "revenue",
    "burn_rate",
    "market_size",
    "investors",
    "competition",
    "growth_rate",
}
INTEGER_FIELDS = {"team_size", "investors"}
MAX_ROWS = 200


def normalize_header(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", value.strip().lower()).strip("_")


def detect_mapping(headers: list[str]) -> dict[str, str | None]:
    normalized = {normalize_header(header): header for header in headers}
    mapping = {}
    for target, aliases in FIELD_ALIASES.items():
        mapping[target] = next(
            (normalized[alias] for alias in aliases if alias in normalized),
            None,
        )
    return mapping


def parse_number(value: str, percent: bool = False) -> float:
    cleaned = value.strip().replace(",", "").replace("$", "")
    if percent:
        cleaned = cleaned.replace("%", "")
    if not cleaned:
        raise ValueError("empty value")
    return float(cleaned)


def coerce_row(row: dict, mapping: dict[str, str | None]) -> dict:
    values = {}
    for target, source in mapping.items():
        raw = "" if source is None else str(row.get(source, "") or "").strip()
        if target in NUMERIC_FIELDS:
            number = parse_number(raw, target == "growth_rate")
            values[target] = int(number) if target in INTEGER_FIELDS else number
        else:
            values[target] = raw
    return values


def percentile(values: list[float], fraction: float) -> float:
    ordered = sorted(values)
    position = (len(ordered) - 1) * fraction
    lower = int(position)
    upper = min(lower + 1, len(ordered) - 1)
    weight = position - lower
    return ordered[lower] * (1 - weight) + ordered[upper] * weight


def analyze_csv(content: bytes) -> dict:
    if len(content) > 2_000_000:
        raise ValueError("CSV files must be 2 MB or smaller")
    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        raise ValueError("CSV must use UTF-8 encoding") from exc

    reader = csv.DictReader(StringIO(text))
    if not reader.fieldnames:
        raise ValueError("CSV header row is missing")
    rows = list(reader)
    if not rows:
        raise ValueError("CSV does not contain any data rows")
    if len(rows) > MAX_ROWS:
        raise ValueError(f"CSV supports up to {MAX_ROWS} rows per batch")

    mapping = detect_mapping(reader.fieldnames)
    unmapped = [field for field, source in mapping.items() if source is None]
    issues = []
    if unmapped:
        issues.append({
            "severity": "error",
            "type": "mapping",
            "message": f"Missing required columns: {', '.join(unmapped)}",
            "count": len(unmapped),
        })

    valid_payloads = []
    row_errors = []
    numeric_values = {field: [] for field in NUMERIC_FIELDS}
    names = []
    for index, row in enumerate(rows, start=2):
        try:
            values = coerce_row(row, mapping)
            payload = PredictionCreate.model_validate(values)
            dumped = payload.model_dump()
            valid_payloads.append({"row": index, "values": dumped})
            names.append(dumped["startup_name"].strip().lower())
            for field in NUMERIC_FIELDS:
                numeric_values[field].append(float(dumped[field]))
        except (ValueError, TypeError, ValidationError) as exc:
            row_errors.append({"row": index, "message": str(exc).splitlines()[0][:180]})

    if row_errors:
        issues.append({
            "severity": "error",
            "type": "invalid_rows",
            "message": f"{len(row_errors)} row(s) contain missing or invalid values.",
            "count": len(row_errors),
        })

    duplicate_count = len(names) - len(set(names))
    if duplicate_count:
        issues.append({
            "severity": "warning",
            "type": "duplicates",
            "message": f"{duplicate_count} duplicate startup name(s) detected.",
            "count": duplicate_count,
        })

    outlier_counts = {}
    for field, values in numeric_values.items():
        if len(values) < 4:
            continue
        q1, q3 = percentile(values, 0.25), percentile(values, 0.75)
        spread = q3 - q1
        if spread <= 0:
            continue
        lower, upper = q1 - 1.5 * spread, q3 + 1.5 * spread
        count = sum(value < lower or value > upper for value in values)
        if count:
            outlier_counts[field] = count
    if outlier_counts:
        detail = ", ".join(f"{field}: {count}" for field, count in outlier_counts.items())
        issues.append({
            "severity": "warning",
            "type": "outliers",
            "message": f"Potential numeric outliers detected ({detail}).",
            "count": sum(outlier_counts.values()),
        })

    error_penalty = sum(item["count"] for item in issues if item["severity"] == "error")
    warning_penalty = sum(item["count"] for item in issues if item["severity"] == "warning")
    quality_score = round(max(0, 100 - error_penalty / max(len(rows), 1) * 70 - warning_penalty / max(len(rows), 1) * 15))
    preview = [item["values"] for item in valid_payloads[:8]]

    return {
        "mapping": mapping,
        "source_columns": reader.fieldnames,
        "row_count": len(rows),
        "valid_count": len(valid_payloads),
        "invalid_count": len(row_errors),
        "quality_score": quality_score,
        "issues": issues,
        "row_errors": row_errors[:20],
        "preview": preview,
        "valid_payloads": valid_payloads,
    }
