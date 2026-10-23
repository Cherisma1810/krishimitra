from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.auth import router as auth_router
from app.api.v1.soil import router as soil_router
from app.api.v1.recommendation import router as crop_router
from app.api.v1.disease import router as disease_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="KrishiMitra Agricultural Decision Support System API (Tirupati Pilot)",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(soil_router, prefix="/api/v1")
app.include_router(crop_router, prefix="/api/v1")
app.include_router(disease_router, prefix="/api/v1")

@app.get("/health", tags=["System"])
def health_check():
    return {"status": "ok", "app": settings.PROJECT_NAME, "env": settings.ENVIRONMENT}