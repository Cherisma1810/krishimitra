import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry

from app.core.database import Base

class UserRole(str, enum.Enum):
    FARMER = "farmer"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(15), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.FARMER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    profile = relationship("FarmerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")

class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Regional Location (Defaulting to Tirupati District)
    state = Column(String(50), default="Andhra Pradesh", nullable=False)
    district = Column(String(50), default="Tirupati", nullable=False)
    mandal = Column(String(50), nullable=False)
    village = Column(String(50), nullable=False)
    
    # AP Meebhoomi passbook metadata
    khata_number = Column(String(30), nullable=True)
    survey_number = Column(String(30), nullable=True)

    preferred_language = Column(String(10), default="te", nullable=False)
    total_acreage = Column(String(20), nullable=True)
    irrigation_source = Column(String(50), nullable=True)
    
    # Spatial Point: SRID 4326 (WGS 84)
    farm_location = Column(Geometry(geometry_type="POINT", srid=4326), nullable=True)

    user = relationship("User", back_populates="profile")