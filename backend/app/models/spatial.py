from sqlalchemy import Column, Integer, String, Float
from geoalchemy2 import Geometry
from app.core.database import Base

class MandalBoundary(Base):
    __tablename__ = "mandal_boundaries"

    id = Column(Integer, primary_key=True, index=True)
    district_name = Column(String(50), nullable=False, index=True)
    mandal_name = Column(String(50), nullable=False, index=True)
    soil_type_dominant = Column(String(50), default="Red Loam")
    groundwater_depth_m = Column(Float, nullable=True)  # Depth in meters below ground level
    
    # PostGIS MultiPolygon in WGS84 (SRID 4326)
    geom = Column(Geometry(geometry_type="MULTIPOLYGON", srid=4326), nullable=False)