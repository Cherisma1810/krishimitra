from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.core.database import Base

class SoilHealthMetric(Base):
    __tablename__ = "soil_health_metrics"

    id = Column(Integer, primary_key=True, index=True)
    district = Column(String(50), nullable=False, index=True)
    mandal = Column(String(50), nullable=False, index=True)
    nitrogen_kg_ha = Column(Float, nullable=False)      # N
    phosphorus_kg_ha = Column(Float, nullable=False)    # P
    potassium_kg_ha = Column(Float, nullable=False)     # K
    ph_level = Column(Float, nullable=False)            # pH
    organic_carbon_pct = Column(Float, nullable=False)  # OC %
    texture = Column(String(50), default="Red Sandy Loam")