# StartupPulse AI - Startup Success Predictor

[![GitHub Repo](https://img.shields.io/badge/GitHub-thatvivekhingu%2FAi__Startup__Success__Predictor-blue?logo=github)](https://github.com/thatvivekhingu/Ai_Startup_Success_Predictor)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.3+-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An end-to-end full-stack machine learning application designed to forecast the potential success probability, growth trajectory, and risk factors of early-to-growth stage startups based on investment funding, rounds, industry vertical, geography, and lifecycle milestones.

**Repository**: [https://github.com/thatvivekhingu/Ai_Startup_Success_Predictor](https://github.com/thatvivekhingu/Ai_Startup_Success_Predictor)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Machine Learning Pipeline](#machine-learning-pipeline)
- [Quickstart Guide](#quickstart-guide)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Docker Deployment](#docker-deployment)
- [API Endpoints](#api-endpoints)
- [Author](#author)

---

## Overview

The **AI Startup Success Predictor** leverages historical startup investment data (66,000+ records) from Crunchbase to train machine learning classification algorithms. It provides founders, venture capitalists, and accelerators with actionable intelligence:
- **Success Probability Scoring (0-100%)**
- **Model Confidence Rating**
- **Automated Strengths & Risk Factors Detection**
- **Tailored AI-Driven Growth Recommendations**
- **Historical Prediction Portfolio & Analytics Hub**

---

## Key Features

- **Interactive Prediction Studio**: Flexible form with real-time sliders, funding shortcuts ($250K to $60M+), sector dropdowns, and country selectors.
- **1-Click Archetype Presets**: Pre-populated benchmark templates for AI SaaS, FinTech Scale-ups, HealthTech Diagnostics, and Bootstrapped E-Commerce.
- **Outcome Visualization**: Circular radial score gauge, status tier badges, celebration effects, and feature contribution drivers.
- **Strategic Advice Engine**: Dynamic recommendations tailored to runway, stage, team size, IP patents, and market dynamics.
- **User Authentication**: Secure JWT signup/login with password hashing (Bcrypt) and personalized history tracking.
- **Portfolio Ledger**: Filterable, searchable dashboard table of past evaluations with deletion and reload capabilities.
- **Model Intelligence Hub**: Real-time telemetry showing ROC-AUC, Accuracy, Precision, Recall, Confusion Matrix, and Gini feature importances.
- **Jupyter Notebook Included**: Beginner-friendly, step-by-step notebook (`ml_pipelines/startup_model_training.ipynb`) covering data preprocessing, EDA, model training, and artifact serialization.

---

## Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TailwindCSS, Lucide React, Recharts, Canvas Confetti |
| **Backend** | Python 3.10+, FastAPI, Uvicorn, SQLAlchemy, Pydantic, Python-JOSE |
| **Machine Learning** | Scikit-learn, Pandas, NumPy, Joblib, GradientBoosting, RandomForest |
| **Database** | SQLite (SQLAlchemy ORM) |
| **DevOps & Container** | Docker, Docker Compose, Nginx |

---

## System Architecture

```
[Crunchbase Startup Data]
           │
           ▼
[Data Cleaning & Feature Engineering]
           │
           ▼
[Jupyter Notebook: startup_model_training.ipynb]
           │
           ▼
[Trained Artifacts: model.pkl + preprocessor.pkl + metadata.json]
           │
           ▼
[FastAPI REST Backend] ◄──► [SQLite DB: Users & Predictions]
           ▲
           │ JSON API (Port 8000)
           ▼
[React + Vite + TailwindCSS Frontend] (Port 5173 / 3000)
```

---

## Project Structure

```
Ai_Startup_Success_Predictor/
├── backend/                      # FastAPI Python Backend
│   ├── routers/
│   │   ├── auth_router.py        # Registration, login & user profile
│   │   ├── prediction_router.py  # Prediction inference, history & presets
│   │   └── analytics_router.py   # Model telemetry & dataset metrics
│   ├── auth.py                   # JWT generation & password hashing
│   ├── database.py               # SQLite engine & session setup
│   ├── models.py                 # SQLAlchemy ORM models
│   ├── predictor.py              # ML inference & recommendation engine
│   ├── schemas.py                # Pydantic validation schemas
│   ├── main.py                   # FastAPI app entrypoint
│   ├── Dockerfile                # Backend container config
│   └── requirements.txt          # Python dependencies
│
├── frontend/                     # React + Vite + TailwindCSS Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation, auth actions & server status
│   │   │   ├── PredictionForm.jsx# Interactive form & archetype presets
│   │   │   ├── PredictionResult.jsx # Radial score meter & AI insights
│   │   │   ├── Dashboard.jsx     # Evaluation ledger & portfolio table
│   │   │   ├── ModelInsights.jsx # ROC curves, metrics & feature charts
│   │   │   └── AuthModal.jsx     # Login & Signup modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global user state management
│   │   ├── api.js                # Axios client with JWT interceptor
│   │   ├── App.jsx               # Main view controller
│   │   ├── main.jsx              # React DOM mounting
│   │   └── index.css             # Tailwind utilities & glassmorphism
│   ├── Dockerfile                # Multi-stage production container
│   ├── nginx.conf                # Nginx reverse proxy configuration
│   ├── package.json              # Node dependencies
│   ├── tailwind.config.js        # Theme & color definitions
│   └── vite.config.js            # Vite build & proxy settings
│
├── ml_pipelines/                 # Machine Learning Pipelines & Notebooks
│   ├── startup_model_training.ipynb # Step-by-step human-style Jupyter Notebook
│   ├── train_model.py            # Standalone model training script
│   ├── create_notebook.py        # Notebook generation utility
│   ├── model.pkl                 # Serialized Champion Model (GradientBoosting)
│   ├── preprocessor.pkl          # Serialized ColumnTransformer pipeline
│   └── metadata.json             # Model metrics, feature importances & stats
│
├── datasets/                     # Startup Datasets
│   └── startup_data.csv          # Prepared Crunchbase dataset
│
├── docker-compose.yml            # Multi-container orchestration
├── .gitignore                    # Git ignore file
└── README.md                     # Project documentation
```

---

## Machine Learning Pipeline

The model training workflow is documented cell-by-cell in [`ml_pipelines/startup_model_training.ipynb`](ml_pipelines/startup_model_training.ipynb):

1. **Import libraries**: Pandas, NumPy, Matplotlib, Scikit-learn, Joblib.
2. **Load dataset**: Inspection of 66,368 Crunchbase startup records.
3. **Data Cleaning**:
   - Currency sanitization for `funding_total_usd`.
   - Datetime conversion for `founded_at`, `first_funding_at`, `last_funding_at`.
4. **Feature Engineering**:
   - `startup_age_years`: Operating duration since founding.
   - `funding_duration_years`: Span between first and latest funding round.
   - `time_to_first_funding_years`: Ramp-up velocity to initial capital.
   - `primary_category_clean`: Primary industry sector extraction.
   - `country_code_clean`: Top country market segmentation.
5. **Target Definition**:
   - Binary classification: **Success (1)** = Acquired or IPO vs **Closed (0)** = Discontinued.
6. **Data Preprocessing**:
   - `ColumnTransformer` with `StandardScaler` for numeric values and `OneHotEncoder` for categoricals.
7. **Model Evaluation & Champion Selection**:
   - Comparison across **Logistic Regression**, **Random Forest**, and **Gradient Boosting**.
   - **Selected Model**: `GradientBoostingClassifier`
     - **ROC-AUC**: **83.1%**
     - **Precision**: **77.3%**
     - **Recall**: **80.4%**
     - **Accuracy**: **74.9%**
8. **Artifact Serialization**: Saving `model.pkl` and `preprocessor.pkl`.

---

## Quickstart Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- Git

### 1. Clone Repository

```bash
git clone https://github.com/thatvivekhingu/Ai_Startup_Success_Predictor.git
cd Ai_Startup_Success_Predictor
```

### 2. Backend Setup

```bash
# Optional: create virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run ML model training (if artifacts need regeneration)
python ml_pipelines/train_model.py

# Start FastAPI backend server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

- API Base URL: `http://127.0.0.1:8000`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend

# Install packages
npm install

# Start Vite development server
npm run dev
```

- Web App URL: `http://localhost:5173`

---

## Docker Deployment

To build and run the entire application using Docker:

```bash
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

---

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register new user account.
- `POST /api/auth/login`: Authenticate and receive JWT access token.
- `GET /api/auth/me`: Get current user profile.

### Predictions & Presets
- `GET /api/presets`: Retrieve benchmark startup archetypes.
- `POST /api/predict`: Evaluate startup parameters and return probability score, strengths, risks, and recommendations.
- `GET /api/predictions/history`: Fetch saved evaluations for the user.
- `GET /api/predictions/{id}`: Fetch single evaluation record.
- `DELETE /api/predictions/{id}`: Delete an evaluation from the ledger.

### Analytics & Telemetry
- `GET /api/analytics/model-metrics`: Retrieve algorithm comparison, ROC-AUC, accuracy, and feature importances.
- `GET /api/analytics/industry-stats`: Sector-wise and country-wise historical success rates.
- `GET /api/analytics/summary`: Aggregate counts and portfolio metrics.

---

## Author

**Vivek Hingu**  
GitHub: [@thatvivekhingu](https://github.com/thatvivekhingu)  
Repository: [https://github.com/thatvivekhingu/Ai_Startup_Success_Predictor](https://github.com/thatvivekhingu/Ai_Startup_Success_Predictor)
