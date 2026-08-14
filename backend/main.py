import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.ask import router as ask_router

# Try to import upload router (optional)
try:
    from app.api.upload import router as upload_router
    HAS_UPLOAD = True
except ImportError:
    HAS_UPLOAD = False

from app.tools.get_schema import get_schema

# ==========================================
# LOGGING
# ==========================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("datamind")


# ==========================================
# APP
# ==========================================

app = FastAPI(
    title="DataMind AI API",
    description="AI-powered natural language data analysis API",
    version="2.0.0",
)


# ==========================================
# CORS CONFIGURATION
# ==========================================

allowed_origins_env = os.environ.get("ALLOWED_ORIGINS")
if allowed_origins_env:
    allow_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
else:
    allow_origins = [
        "http://localhost:8081",
        "http://127.0.0.1:8081",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# HEALTH ENDPOINT
# ==========================================

@app.get("/health")
def health_check():
    """Basic health check endpoint for deployment validation."""
    return {
        "status": "healthy",
        "service": "DataMind AI Backend"
    }


# ==========================================
# API ROUTES
# ==========================================

app.include_router(
    ask_router,
    prefix="/api",
)

if HAS_UPLOAD:
    app.include_router(
        upload_router,
        prefix="/api",
    )


# ==========================================
# SCHEMA ENDPOINT
# ==========================================

@app.get("/api/schema")
def get_database_schema():
    """Return the current database schema for the frontend schema explorer."""
    try:
        schema = get_schema()
        return {
            "success": True,
            "schema": schema,
        }
    except Exception as e:
        logger.error(f"Schema fetch error: {e}")
        return {
            "success": False,
            "error": str(e),
        }


# ==========================================
# ROOT
# ==========================================

@app.get("/")
def root():
    return {
        "message": "DataMind AI Backend is running",
        "docs": "/docs",
        "health": "/health"
    }