from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth_router, prediction_router, analytics_router, gujarat_router
from .predictor import predictor_instance

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Startup Predictor API",
    description="Machine Learning Powered Startup Success & Growth Predictor API",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router.router)
app.include_router(prediction_router.router)
app.include_router(analytics_router.router)
app.include_router(gujarat_router.router)

@app.on_event("startup")
def seed_real_indian_startups():
    from .database import SessionLocal
    from .models import Prediction
    
    db = SessionLocal()
    try:
        count = db.query(Prediction).count()
        if count < 8:
            real_startups = [
                {
                    "startup_name": "Zerodha (Bengaluru)",
                    "primary_category": "Finance",
                    "country_code": "IND",
                    "funding_total_usd": 100000,
                    "funding_rounds": 1,
                    "founded_year": 2010,
                    "success_probability": 0.942,
                    "confidence_score": 0.96,
                    "status_tier": "Acquired / Profitable (Elite)",
                    "strengths": ["Zero external debt", "Profitable from Day 1", "78%+ client retention rate"],
                    "risk_factors": ["Regulatory market volatility", "Discount brokerage competition"],
                    "recommendations": ["Expand into asset management (Zerodha Fund House)", "Scale developer APIs (Kite Connect)"],
                    "input_details": {"founder": "Nithin & Nikhil Kamath", "valuation": "$2.0 Billion"}
                },
                {
                    "startup_name": "Zepto (Mumbai/Bengaluru)",
                    "primary_category": "E-Commerce",
                    "country_code": "IND",
                    "funding_total_usd": 650000000,
                    "funding_rounds": 5,
                    "founded_year": 2021,
                    "success_probability": 0.885,
                    "confidence_score": 0.91,
                    "status_tier": "Operating (High Growth Unicorn)",
                    "strengths": ["10-min delivery dark store network", "High order frequency", "Dense metro coverage"],
                    "risk_factors": ["High dark store rental overheads", "Blinkit and Instamart rivalry"],
                    "recommendations": ["Scale high-margin private labels", "Increase average order value via Zepto Cafe"],
                    "input_details": {"founder": "Aadit Palicha & Kaivalya Vohra", "valuation": "$5.0 Billion"}
                },
                {
                    "startup_name": "Razorpay (Bengaluru)",
                    "primary_category": "Finance",
                    "country_code": "IND",
                    "funding_total_usd": 741000000,
                    "funding_rounds": 7,
                    "founded_year": 2014,
                    "success_probability": 0.928,
                    "confidence_score": 0.95,
                    "status_tier": "Operating (Decacorn Tier)",
                    "strengths": ["Developer-first payment gateway", "YC W15 alumni", "RazorpayX neo-banking ecosystem"],
                    "risk_factors": ["RBI PA/PG regulatory compliance", "Payment interchange margin compression"],
                    "recommendations": ["Expand cross-border payments in Southeast Asia", "Deepen enterprise corporate card penetration"],
                    "input_details": {"founder": "Harshil Mathur & Shashank Kumar", "valuation": "$7.5 Billion"}
                },
                {
                    "startup_name": "Zomato & Blinkit (Gurugram)",
                    "primary_category": "E-Commerce",
                    "country_code": "IND",
                    "funding_total_usd": 910000000,
                    "funding_rounds": 8,
                    "founded_year": 2008,
                    "success_probability": 0.954,
                    "confidence_score": 0.97,
                    "status_tier": "Acquired / Public IPO (NSE/BSE)",
                    "strengths": ["Listed on NSE/BSE", "Blinkit turnaround into positive EBITDA", "Nationwide dining & delivery network"],
                    "risk_factors": ["Delivery fleet attrition", "Restaurant commission renegotiation"],
                    "recommendations": ["Scale Hyperpure B2B kitchen supply", "Expand 'District' entertainment app"],
                    "input_details": {"founder": "Deepinder Goyal", "valuation": "$22+ Billion"}
                },
                {
                    "startup_name": "Matter Motor Works (Ahmedabad, Gujarat)",
                    "primary_category": "Clean Technology",
                    "country_code": "IND",
                    "funding_total_usd": 42000000,
                    "funding_rounds": 3,
                    "founded_year": 2019,
                    "success_probability": 0.862,
                    "confidence_score": 0.89,
                    "status_tier": "Operating (iCreate Incubated)",
                    "strengths": ["Proprietary liquid-cooled EV powertrain", "Patented geared electric motorcycle", "Gujarat EV policy subsidies"],
                    "risk_factors": ["Capital-intensive automotive tooling", "Charging infrastructure rollout speed"],
                    "recommendations": ["Expand dealership network to Maharashtra and South India", "Accelerate deliveries of AERA e-motorcycle"],
                    "input_details": {"founder": "Mohal Lalbhai", "valuation": "₹1,200+ Crore"}
                },
                {
                    "startup_name": "Petpooja (Ahmedabad, Gujarat)",
                    "primary_category": "Software",
                    "country_code": "IND",
                    "funding_total_usd": 15000000,
                    "funding_rounds": 3,
                    "founded_year": 2011,
                    "success_probability": 0.897,
                    "confidence_score": 0.92,
                    "status_tier": "Operating (Market Leader)",
                    "strengths": ["Operating in 75,000+ restaurants across India & UAE", "Low churn rate", "Integrated billing, inventory, and Zomato/Swiggy sync"],
                    "risk_factors": ["Entry of global POS players", "Hardware support logistics across Tier-2/3 cities"],
                    "recommendations": ["Scale payroll and procurement marketplace modules", "Expand Middle East footprint"],
                    "input_details": {"founder": "Parth Joshi & Apurv Patel", "valuation": "₹900+ Crore"}
                },
                {
                    "startup_name": "Beardo (Ahmedabad, Gujarat)",
                    "primary_category": "E-Commerce",
                    "country_code": "IND",
                    "funding_total_usd": 8500000,
                    "funding_rounds": 3,
                    "founded_year": 2015,
                    "success_probability": 0.965,
                    "confidence_score": 0.98,
                    "status_tier": "Acquired (100% Marico Exit)",
                    "strengths": ["Pioneered men's beard and grooming D2C niche in India", "Viral influencer marketing", "Profitable exit to FMCG giant Marico"],
                    "risk_factors": ["High offline retail distribution barriers", "FMCG conglomerate competition"],
                    "recommendations": ["Leverage Marico's rural distribution network", "Expand men's fragrances and salon-grade styling"],
                    "input_details": {"founder": "Ashutosh Valani & Priyank Shah", "valuation": "₹350 Crore"}
                },
                {
                    "startup_name": "Lenskart (Delhi NCR)",
                    "primary_category": "E-Commerce",
                    "country_code": "IND",
                    "funding_total_usd": 1100000000,
                    "funding_rounds": 9,
                    "founded_year": 2010,
                    "success_probability": 0.912,
                    "confidence_score": 0.94,
                    "status_tier": "Operating (Profitable Unicorn)",
                    "strengths": ["2,000+ omnichannel retail stores", "In-house automated robotic manufacturing", "Profitable operation"],
                    "risk_factors": ["International store expansion costs in Japan/SE Asia", "Raw material inflation"],
                    "recommendations": ["Prepare for domestic public listing (IPO)", "Scale AI virtual 3D try-on features"],
                    "input_details": {"founder": "Peyush Bansal", "valuation": "$4.5 Billion"}
                }
            ]

            for s in real_startups:
                db_item = Prediction(**s)
                db.add(db_item)
            db.commit()
            print(f"Successfully seeded {len(real_startups)} real Indian startup benchmarks into SQLite database.")
    except Exception as e:
        print("Error seeding Indian startups:", e)
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "AI Startup Predictor API",
        "version": "1.0.0",
        "model_loaded": predictor_instance.model is not None,
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_ready": predictor_instance.model is not None,
        "metadata_ready": bool(predictor_instance.metadata)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
