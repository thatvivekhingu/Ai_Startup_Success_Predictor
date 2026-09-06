# StartupPulse AI — Startup Success Predictor & Venture Intelligence Platform

[![GitHub Repo](https://img.shields.io/badge/GitHub-thatvivekhingu%2FAi__Startup__Success__Predictor-blue?logo=github)](https://github.com/thatvivekhingu/Ai_Startup_Success_Predictor)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.3+-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An end-to-end full-stack venture intelligence and machine learning platform designed to forecast startup success probabilities, analyze exit trajectories, track live Indian funding rounds, navigate government grants (SSIP 2.0 / Gujarat STI Policy), and deliver automated ecosystem notifications.

**Repository**: [https://github.com/thatvivekhingu/Ai_Startup_Success_Predictor](https://github.com/thatvivekhingu/Ai_Startup_Success_Predictor)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Machine Learning Pipeline](#machine-learning-pipeline)
- [Venture Ecosystem & Modules](#venture-ecosystem--modules)
  - [1. Predictive Intelligence Engine](#1-predictive-intelligence-engine)
  - [2. Venture Funding Deals Radar](#2-venture-funding-deals-radar)
  - [3. Student Innovation & Grant Navigator (StudentProHub)](#3-student-innovation--grant-navigator-studentprohub)
  - [4. Gujarat Startup Notifier Engine](#4-gujarat-startup-notifier-engine)
- [Quickstart Guide](#quickstart-guide)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Gujarat Startup Notifier (Optional Background Service)](#4-gujarat-startup-notifier-optional-background-service)
- [Docker Deployment](#docker-deployment)
- [API Endpoints Reference](#api-endpoints-reference)
- [Author & Acknowledgements](#author--acknowledgements)

---

## Overview

The **AI Startup Success Predictor** is trained on 66,000+ historical startup investment records from Crunchbase. It provides founders, venture capitalists, student entrepreneurs, and policymakers with actionable intelligence:

- **Success Probability Scoring (0–100%)** via calibrated Gradient Boosting.
- **Model Confidence Rating & Feature Attribution** revealing critical performance drivers.
- **Dynamic Risk & Strength Detection** providing customized operational roadmaps.
- **Live Venture Funding Radar** aggregating verified Indian deals, valuations, and lead syndicates.
- **Statewide Ecosystem Directory & Grant Engine** mapping Gujarat incubators, SSIP 2.0 schemes, and TRL readiness scores.
- **Automated Multi-Channel Alert Bot** notifying stakeholders on Telegram and WhatsApp of new funding and grant milestones.

---

## Key Features

- **Interactive Prediction Studio**: Real-time evaluation sliders for funding, investment rounds, startup age, sectors, and geographical markets with instant scoring.
- **1-Click Archetype Presets**: Pre-configured benchmark templates for AI SaaS Unicorns, FinTech Scale-ups, DeepTech CleanTech, Bootstrapped E-Commerce, and Student Prototypes.
- **Startup Orbit Visualizer**: Interactive visualizer mapping investor backing, IP moat protection, MRR velocity, runway duration, and exit probability.
- **Dedicated Venture Funding Deals Radar**: Live searchable table of Indian funding rounds featuring deals from Emergent, River Mobility, Udaan, Zepto, Razorpay, and more, complete with official sources.
- **Student Innovation Hub (SSIP 2.0 & TRL 1–9)**: Technology Readiness Level self-assessment, AI grant proposal drafter, and directory of university maker labs (GUSEC, iCreate, PDEU, GTU).
- **Gujarat Startup Notifier**: Autonomous background scraper monitoring Google News RSS and incubator feeds with SQLite deduplication and Telegram/WhatsApp notifications.
- **JWT Authentication & Demo Profiles**: Secure user registration, bcrypt password hashing, and instant 1-click demo logins (Founder, Investor, Research Fellow, Student).
- **Portfolio Ledger & History**: Personal evaluation archive with reloadable parameters and CSV export capabilities.
- **Model Telemetry Hub**: Full statistical transparency displaying ROC-AUC (83.1%), Accuracy, Precision, Recall, Confusion Matrix, and Gini feature importances.

---

## Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18.3, Vite 5.4, TailwindCSS 3.4, Lucide React, Recharts, Canvas Confetti |
| **Backend** | Python 3.10+, FastAPI, Uvicorn, SQLAlchemy, Pydantic v2, Python-JOSE (JWT), Passlib (Bcrypt) |
| **Machine Learning** | Scikit-learn 1.3+, Pandas, NumPy, Joblib, GradientBoostingClassifier, RandomForest |
| **Notifier & Scraper** | Python, BeautifulSoup4, Feedparser, Requests, Python-Telegram-Bot, Twilio (WhatsApp) |
| **Database** | SQLite (SQLAlchemy ORM) with automatic seeding of verified Indian venture records |
| **DevOps & Container** | Docker, Docker Compose, Nginx |

---

## System Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │          Crunchbase (66K+ Startups)          │
                    └──────────────────────┬───────────────────────┘
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │      ML Pipeline & Feature Engineering       │
                    │      (startup_model_training.ipynb)          │
                    └──────────────────────┬───────────────────────┘
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │ Trained Artifacts (model.pkl, preprocessor)  │
                    └──────────────────────┬───────────────────────┘
                                           ▼
┌───────────────────────────────┐     ┌────────────────────────────────────────────────────────┐
│   Gujarat Startup Notifier    │     │                   FastAPI Backend                      │
│   - RSS Feeds / Live News     │     │                                                        │
│   - SQLite Deduplication      │ ──► │  • /api/auth             • /api/predict                │
│   - Telegram / WhatsApp Alert │     │  • /api/analytics        • /api/funding                │
└───────────────────────────────┘     │  • /api/gujarat-ecosystem (Schemes & Incubators)       │
                                      └───────────────────────────┬────────────────────────────┘
                                                                  ▲
                                                                  │ JSON REST API (Port 8000)
                                                                  ▼
                                      ┌────────────────────────────────────────────────────────┐
                                      │             React + Vite + TailwindCSS                 │
                                      │                                                        │
                                      │  • Landing & Triple-Device Dashboard                   │
                                      │  • Prediction Studio & Radial Score Meter              │
                                      │  • Venture Funding Deals Radar                         │
                                      │  • Student Innovation & SSIP 2.0 Hub                   │
                                      │  • Model Telemetry & Audit Hub                         │
                                      └────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
Ai_Startup_Success_Predictor/
├── backend/                              # FastAPI Python REST Backend
│   ├── routers/
│   │   ├── auth_router.py                # JWT authentication, signup & profile management
│   │   ├── prediction_router.py          # ML inference engine, history ledger & archetype presets
│   │   ├── analytics_router.py           # Model telemetry, ROC metrics & sector distributions
│   │   ├── funding_router.py             # Live Indian venture funding deals & investor syndicates
│   │   └── gujarat_router.py             # Gujarat STI schemes, SSIP 2.0 grants & incubator hubs
│   ├── auth.py                           # Token creation & bcrypt password verification
│   ├── database.py                       # SQLite database connection & session factory
│   ├── models.py                         # SQLAlchemy ORM models (User, Prediction, FundingDeal)
│   ├── predictor.py                      # Model loader, scoring engine & heuristic recommendations
│   ├── schemas.py                        # Pydantic request/response validation schemas
│   ├── main.py                           # Application factory, CORS & database startup seeders
│   ├── Dockerfile                        # Production container definition
│   └── requirements.txt                  # Python dependencies
│
├── frontend/                             # React + Vite Single Page Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                # Navigation, authentication state & server heartbeat
│   │   │   ├── HeroSection.jsx           # Hero banner with value proposition & quick actions
│   │   │   ├── FigmaLandingSections.jsx  # Ecosystem stats, Indian founder testimonials & showcase
│   │   │   ├── FigmaFooter.jsx           # Ecosystem links, open-source badges & platform provenance
│   │   │   ├── PredictionForm.jsx        # Interactive inputs, funding shortcuts & benchmark presets
│   │   │   ├── PredictionResult.jsx      # Radial score gauge, confidence meter & growth advice
│   │   │   ├── StartupOrbit.jsx          # Interactive 3D radar displaying runway, MRR & moat
│   │   │   ├── FundingDealsPage.jsx      # Dedicated Venture Funding Radar & deal filter
│   │   │   ├── StudentProHub.jsx         # SSIP 2.0 navigator, TRL 1-9 calculator & lab directory
│   │   │   ├── Dashboard.jsx             # User portfolio ledger & saved evaluations table
│   │   │   ├── ModelInsights.jsx         # Algorithm benchmark tables, ROC curves & feature bars
│   │   │   ├── AuthModal.jsx             # Pop-up login/signup dialog with demo credentials
│   │   │   ├── LoginPage.jsx             # Standalone authentication page
│   │   │   └── UserProfileModal.jsx      # Profile details & session manager
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Global user authentication provider
│   │   ├── api.js                        # Axios HTTP client with Bearer token interceptor
│   │   ├── App.jsx                       # Root routing and active tab coordinator
│   │   ├── main.jsx                      # DOM mount point
│   │   └── index.css                     # Tailwind base styles, custom fonts & glassmorphism
│   ├── public/                           # Static assets & founder portraits
│   ├── tailwind.config.js                # Theme tokens, brand colors & Samsung Sharp Sans fonts
│   ├── vite.config.js                    # Vite bundler & backend reverse proxy
│   └── package.json                      # Node packages & build scripts
│
├── gujarat_startup_notifier/             # Autonomous Ecosystem News & Grant Notifier
│   ├── fetcher.py                        # Google News RSS parser & incubator feed scraper
│   ├── notifier.py                       # Telegram bot & Twilio WhatsApp notification engine
│   ├── db.py                             # SQLite deduplication storage (`news_cache.db`)
│   ├── config.py                         # Environment variables, channels & keywords
│   ├── main.py                           # Periodic runner & CLI entrypoint
│   └── requirements.txt                  # Notifier dependencies
│
├── ml_pipelines/                         # Machine Learning Pipeline & Notebooks
│   ├── startup_model_training.ipynb     # Interactive Jupyter Notebook for EDA & model training
│   ├── train_model.py                    # Standalone reproducible training script
│   ├── model.pkl                         # Serialized Champion Gradient Boosting model
│   ├── preprocessor.pkl                  # Serialized ColumnTransformer preprocessing pipeline
│   └── metadata.json                     # Serialized evaluation metrics & feature weights
│
├── datasets/                             # Raw & Processed Datasets
│   └── startup_data.csv                  # 66,000+ records dataset derived from Crunchbase
│
├── docker-compose.yml                    # Multi-container orchestration
├── .gitignore                            # Excluded files & temporary directories
└── README.md                             # Comprehensive project documentation
```

---

## Machine Learning Pipeline

The end-to-end model development lifecycle is fully documented in [`ml_pipelines/startup_model_training.ipynb`](ml_pipelines/startup_model_training.ipynb):

1. **Dataset Inspection**: 66,368 Crunchbase company profiles containing investment rounds, funding totals, industry categories, founded years, and operational states.
2. **Data Cleansing & Sanitization**:
   - Extraction of numeric values from formatted currency strings (`funding_total_usd`).
   - Conversion of date attributes (`founded_at`, `first_funding_at`, `last_funding_at`) into temporal features.
3. **Engineered Features**:
   - `startup_age_years`: Operating lifespan of the startup.
   - `funding_duration_years`: Timeline from initial angel/seed to latest venture stage.
   - `time_to_first_funding_years`: Velocity from incorporation to first capital injection.
   - `primary_category_clean`: Normalized sector taxonomy (Finance, Software, Biotechnology, E-Commerce, etc.).
   - `country_code_clean`: Top country markets (USA, IND, GBR, CAN, DEU, etc.).
4. **Target Classification Definition**:
   - **Successful (1)**: Acquired or Initial Public Offering (IPO).
   - **Closed (0)**: Operating ceased / dissolved.
5. **Preprocessing Transformation**:
   - `StandardScaler` for numeric values.
   - `OneHotEncoder(handle_unknown='ignore')` for high-cardinality categoricals.
6. **Champion Algorithm Selection**:
   - Rigorously compared against Logistic Regression and Random Forest.
   - **Champion Model**: `GradientBoostingClassifier`
     - **ROC-AUC**: **83.1%**
     - **Accuracy**: **74.9%**
     - **Precision**: **77.3%**
     - **Recall**: **80.4%**
7. **Artifact Export**: Stored as portable binaries (`model.pkl`, `preprocessor.pkl`, `metadata.json`) loaded at runtime via FastAPI startup hooks.

---

## Venture Ecosystem & Modules

### 1. Predictive Intelligence Engine
- Evaluates operational factors, funding velocity, and market segment to compute a calibrated success probability.
- Automatically generates diagnostic strengths (e.g., strong capitalization, multi-round backing) and risk flags (e.g., delayed seed round, market saturation).
- Generates strategic recommendations categorized by runway preservation, talent expansion, and IP patenting.

### 2. Venture Funding Deals Radar
- Real-time catalog of recent, verified Indian funding rounds.
- Detailed metrics including investment amount ($USD), round stage (Pre-Seed to Series C / Debt), lead investors (Lightspeed, SoftBank, Creaegis, Yamaha), valuations, and source links.
- Filter by round type or sector and cross-link directly into the Prediction Studio.

### 3. Student Innovation & Grant Navigator (StudentProHub)
- Dedicated workspace for collegiate founders and student builders.
- **SSIP 2.0 Guidance**: Up to ₹2.5 Lakhs prototype grants and ₹75,000 patent reimbursements.
- **Gujarat STI Policy (2026–31)**: ₹1,000 Crore fund overview for deep-tech and semiconductors.
- **TRL 1–9 Assessment**: Heuristic readiness calculator evaluating prototype maturity, faculty mentorship, and prior art searches.
- **AI Proposal Generator**: Drafts university innovation committee review templates directly from project specifications.

### 4. Gujarat Startup Notifier Engine
- Autonomous background monitor querying high-impact keywords (e.g., *iCreate*, *GUSEC*, *Dholera semiconductor*, *Gujarat funding*).
- Stores unique hash IDs in SQLite to eliminate repetitive noise.
- Transmits instant markdown cards with titles, summaries, and direct source links to Telegram channels and WhatsApp groups.

---

## Quickstart Guide

### Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: 18 or higher (with npm)
- **Git**: Installed and configured

### 1. Clone Repository

```bash
git clone https://github.com/thatvivekhingu/Ai_Startup_Success_Predictor.git
cd Ai_Startup_Success_Predictor
```

### 2. Backend Setup

```bash
# Create and activate virtual environment (optional but recommended)
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS / Linux:
# source venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt

# (Optional) Re-train the machine learning model
python ml_pipelines/train_model.py

# Start FastAPI server on port 8000
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

- **Interactive API Documentation (Swagger)**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Alternative Redoc Documentation**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### 3. Frontend Setup

In a new terminal window:

```bash
cd frontend

# Install npm dependencies
npm install

# Start development server
npm run dev
```

- **Web Application URL**: [http://localhost:5173](http://localhost:5173)

### 4. Gujarat Startup Notifier (Optional Background Service)

In a third terminal window:

```bash
cd gujarat_startup_notifier

# Install notifier dependencies
pip install -r requirements.txt

# Copy example environment configuration
copy .env.example .env     # On Windows
# cp .env.example .env     # On Linux / macOS

# Configure your Telegram BOT_TOKEN and CHAT_ID in .env, then run:
python main.py
```

---

## Docker Deployment

To launch the full stack (FastAPI Backend + React Nginx Frontend) in containerized mode:

```bash
docker-compose up --build
```

- **Frontend Container**: [http://localhost:3000](http://localhost:3000)
- **Backend API Container**: [http://localhost:8000](http://localhost:8000)

---

## API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT bearer token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `PUT` | `/api/auth/profile` | Update user metadata, role, or institution |

### Predictions & Presets (`/api`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/presets` | Retrieve benchmark archetypes (AI SaaS, FinTech, etc.) |
| `POST` | `/api/predict` | Run ML inference and obtain success score & diagnostic advice |
| `GET` | `/api/predictions/history` | List user's saved predictions |
| `GET` | `/api/predictions/{id}` | Retrieve specific prediction dossier |
| `DELETE` | `/api/predictions/{id}` | Delete prediction from historical ledger |

### Venture Funding Radar (`/api/funding`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/funding` | Fetch verified Indian funding deals (supports sector/round filters) |
| `GET` | `/api/funding/stats` | Retrieve total tracked venture capital and deal counts |

### Gujarat Ecosystem (`/api/gujarat-ecosystem`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/gujarat-ecosystem/news` | Real-time curated & RSS news updates |
| `GET` | `/api/gujarat-ecosystem/schemes` | Catalog of state grant policies (SSIP 2.0, STI Policy) |
| `GET` | `/api/gujarat-ecosystem/districts-and-hubs` | Innovation hubs, incubator directory, and rankings |

### Analytics & Telemetry (`/api/analytics`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/analytics/model-metrics` | Retrieve ROC-AUC, accuracy, and Gini feature importances |
| `GET` | `/api/analytics/industry-stats` | Sector and geographic success distributions |
| `GET` | `/api/analytics/summary` | Aggregate portfolio count & global predictions tally |

---

## Author & Acknowledgements

**Vivek Hingu**  
- GitHub: [@thatvivekhingu](https://github.com/thatvivekhingu)  
- Project Repository: [https://github.com/thatvivekhingu/Ai_Startup_Success_Predictor](https://github.com/thatvivekhingu/Ai_Startup_Success_Predictor)

*Data sourced from Crunchbase historical investment records. Government policy and scheme information referenced from the Education Department and Department of Science & Technology (DST), Government of Gujarat.*
