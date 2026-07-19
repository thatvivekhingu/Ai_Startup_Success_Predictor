# Foundr.AI

Foundr.AI is a startup decision-intelligence workspace built on React/Vite, FastAPI, SQLAlchemy, and scikit-learn. It turns operating inputs into a model probability, a multi-dimensional Success Index, explainable local drivers, risk signals, peer benchmarks, and investor-ready reports while preserving authenticated history and portfolio analytics.

## MVP capabilities

- Manual startup assessment with persistent prediction history
- Success Index with funding readiness, market fit, team strength, and burn resilience
- Local explainability chart, estimated uncertainty range, peer benchmark, and recommended actions
- Funding, market, team, product, and unit-economics risk heatmap
- Non-persisting what-if simulator for funding, revenue, burn, team size, and growth
- Investor-ready PDF report generated in the browser
- CSV auto-mapping, validation, quality scoring, outlier/duplicate checks, preview, and batch prediction
- Responsive dark-first dashboard, animated charts, analytics, audit logs, and CSV exports
- JWT authentication with admin and analyst workspace isolation
- Editable account profiles, password rotation, session-expiration recovery, and admin user access controls
- Reproducible model training with a transparent fallback scorer

## Run locally

### 1. Backend

From the repository root:

```powershell
python -m venv backend/.venv
.\backend\.venv\Scripts\python.exe -m pip install -r backend/requirements.txt
.\backend\.venv\Scripts\python.exe -m uvicorn backend.main:app --reload --port 8000
```

The API seeds a demo user on first start:

`demo` / `demo1234`

Copy values from `backend/.env.example` into your shell or deployment environment. The important settings are:

- `DATABASE_URL` - SQLite for local use or a PostgreSQL URL in production
- `JWT_SECRET` - a long random signing secret; never use the development default in production
- `CORS_ORIGINS` - comma-separated frontend origins allowed to call the API

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Set `VITE_API_URL` in `frontend/.env` when the API is hosted elsewhere.
`frontend/.env.example` contains the local API setting.

The UI defaults to dark mode for new users and preserves each user's theme selection in browser storage.

## Train the model

From the repository root, install the backend requirements and run:

```powershell
python -m ml_pipeline.train
```

The script compares Logistic Regression, Decision Tree, Random Forest, and SVM using a shared preprocessing pipeline, writes the best pipeline to `backend/model/startup_model.pkl`, and records comparison metrics in `backend/model/metrics.json`. The API uses that artifact for probability inference and falls back to a transparent scoring formula if an artifact is missing or incompatible. The Foundr.AI analysis layer then combines that probability with transparent operating-signal scorecards; it does not present heuristic explanations as SHAP values.

## CSV import

Use the template available from the CSV batch tab. Imports support up to 200 rows and 2 MB per file. Common aliases such as `company`, `sector`, `employees`, `arr`, `monthly_burn`, `tam`, and `yoy_growth` are mapped automatically. Invalid rows are skipped and reported; valid rows are saved to the same history used by manual assessments.

## API surface

Core endpoints:

- `POST /login`, `POST /register`, `GET /me`
- `PATCH /me`, `POST /me/password` for account management
- `POST /predict` for persisted manual analysis
- `POST /simulate` for non-persisting what-if analysis
- `POST /csv/validate`, `POST /csv/predict`
- `GET /dashboard`, `GET /history`, `GET /analytics`
- `GET /logs`, `GET /download-csv`
- `GET /users`, `PATCH /users/{user_id}` for administrator account controls

Interactive OpenAPI documentation is available at `http://localhost:8000/docs`.

## Verification

```powershell
.\backend\.venv\Scripts\python.exe -m unittest discover -s backend\tests -v
cd frontend
npm run build
npm run test:e2e
```

The end-to-end smoke test expects the API at `http://127.0.0.1:8012`, the frontend at `http://127.0.0.1:5173`, and Microsoft Edge at its standard Windows path. Override these with `E2E_BASE_URL`, `E2E_CSV_PATH`, and `E2E_BROWSER_PATH` when needed.

## Production notes

Set `DATABASE_URL` to a PostgreSQL URL, `JWT_SECRET` to a long random value, and `CORS_ORIGINS` to the exact deployed frontend origins. From `backend`, run `alembic upgrade head` for a fresh database (or `alembic stamp head` when adopting an existing database created by the development bootstrap). Terminate TLS at the edge and serve the frontend and API over HTTPS.

Administrators can open the Team page to promote analysts or suspend access. The currently signed-in administrator cannot demote or suspend their own account, preventing accidental loss of administrative access. Suspended users retain prediction history but cannot sign in or use existing sessions.
