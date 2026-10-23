from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# Engine manages database connections
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Automatically tests connection freshness before checkout
    echo=(settings.ENVIRONMENT == "development")  # Prints generated SQL in dev mode
)

# Session factory for route-level dependency injection
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base that all ORM models inherit from
Base = declarative_base()

def get_db():
    """FastAPI dependency yielding an isolated session per HTTP request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()