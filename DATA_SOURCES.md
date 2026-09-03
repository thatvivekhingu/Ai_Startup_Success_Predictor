# 📊 Foundr.AI 2.0 — Data Sources, Methodologies & Limitations

This document provides transparent, scientific documentation of the datasets, preprocessing logic, model assumptions, and limitations governing **Foundr.AI 2.0**.

---

## 1. 🗄️ Primary Benchmark Dataset: Crunchbase Startup Outcomes

* **Dataset Source:** Yan Maksi / Crunchbase Research Archive (`Data/big_startup_secsees_dataset.csv`)
* **Total Records:** 66,368 globally tracked ventures (1995–2020)
* **Target Classification:**
  - **Success (`1`):** Startups that reached definitive liquidity events: **Acquisition** (`5,549`) or **Initial Public Offering (IPO)** (`1,547`).
  - **Closed / Failed (`0`):** Startups that ceased operations and shut down (`6,238`).
  - **Active / Operating (`53,034`):** Ongoing companies (used for longitudinal state modeling).

### Key Features Used in ML Benchmark:
1. `funding_total_usd`: Total institutional venture capital raised (USD).
2. `funding_rounds`: Total number of priced rounds.
3. `funding_duration_years`: Time elapsed between first and final recorded funding rounds.
4. `age_at_first_funding_years`: Velocity from founding to first venture check.
5. `funding_per_round`: Average check size per institutional stage.
6. `primary_category`: High-level industry sector (Biotechnology, Software, E-Commerce, etc.).
7. `country_clean`: Regional ecosystem (USA, GBR, IND, CAN, DEU, etc.).

---

## 2. 🧠 Model Performance & Accuracy Benchmarks

Evaluated on stratified held-out test split (25%):

| Algorithm | ROC-AUC | F1-Score | Accuracy | Precision | Recall |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **🌲 Random Forest** | **0.8203** | **0.7598** | **74.42%** | **75.91%** | **76.04%** |
| **🚀 Gradient Boosting / XGBoost** | 0.8138 | 0.7606 | 74.00% | 74.55% | 77.62% |
| **🧠 PyTorch Deep Tabular NN** | 0.8090 | 0.7498 | 73.10% | 74.20% | 75.80% |
| **🌳 Decision Tree** | 0.8022 | 0.7259 | 72.44% | 77.07% | 68.60% |
| **📈 Logistic Regression** | 0.7983 | 0.7287 | 72.56% | 76.86% | 69.28% |

---

## 3. ⚠️ Data & Modeling Limitations (Important Disclaimers)

1. **Survival Bias:** Historical venture databases over-index on companies that received institutional funding. Bootstrapped companies may exhibit different survival distributions.
2. **Probabilistic Nature:** An 80% success probability does **not** guarantee an acquisition or IPO; it indicates statistical similarity to historical ventures that achieved positive exits.
3. **Macroeconomic Shifts:** Changing interest rate environments, sector-specific hype cycles, and regional policy shifts can alter baseline venture failure rates.
4. **Data Freshness:** Predictions should be interpreted alongside real-time internal financial snapshots rather than standalone historical datasets.

---

## 4. 🏢 Demo / Synthetic Operational Profiles

To enable rich 5-minute interactive simulations, Foundr.AI provides realistic synthetic operational profiles (such as **NovaAI Technologies — Ahmedabad, Gujarat**). Synthetic demo records are explicitly labeled with `is_demo=True` across all API payloads and UI components.
