from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth_router, prediction_router, analytics_router
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
