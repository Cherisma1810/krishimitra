from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from geoalchemy2.elements import WKTElement
from geoalchemy2.shape import to_shape
import json

from app.core.database import get_db
from app.models.spatial import MandalBoundary
from app.models.soil import SoilHealthMetric
from app.services.weather_service import get_mandal_weather

router = APIRouter(prefix="/soil", tags=["Soil & Geospatial Intel"])

@router.get("/layers")
def get_mandal_layers(district: str = "Tirupati", db: Session = Depends(get_db)):
    """
    Returns GeoJSON FeatureCollection of all mandals in the district
    including groundwater levels and dominant soil type.
    """
    mandals = db.query(MandalBoundary).filter(MandalBoundary.district_name == district).all()
    
    features = []
    for m in mandals:
        shapely_geom = to_shape(m.geom)
        features.append({
            "type": "Feature",
            "geometry": json.loads(json.dumps(shapely_geom.__geo_interface__)),
            "properties": {
                "id": m.id,
                "mandal": m.mandal_name,
                "district": m.district_name,
                "soil_type": m.soil_type_dominant,
                "groundwater_depth_m": m.groundwater_depth_m
            }
        })
        
    return {
        "type": "FeatureCollection",
        "features": features
    }

@router.get("/intel")
async def get_mandal_soil_and_weather(
    mandal: str = Query(..., description="Target mandal name"),
    db: Session = Depends(get_db)
):
    """
    Fetches real N-P-K, pH, Organic Carbon, groundwater depth,
    and real-time meteorological metrics for the selected mandal.
    """
    soil_record = db.query(SoilHealthMetric).filter(
        func.lower(SoilHealthMetric.mandal) == mandal.lower()
    ).first()

    boundary = db.query(MandalBoundary).filter(
        func.lower(MandalBoundary.mandal_name) == mandal.lower()
    ).first()

    if not soil_record:
        raise HTTPException(status_code=404, detail=f"Soil data not found for mandal '{mandal}'.")

    # Calculate centroid coordinates for weather extraction
    lat, lon = 13.6288, 79.4192  # Default Tirupati Urban
    if boundary:
        shapely_poly = to_shape(boundary.geom)
        centroid = shapely_poly.centroid
        lon, lat = centroid.x, centroid.y

    # Fetch live weather forecast via Open-Meteo
    weather_data = await get_mandal_weather(lat=lat, lon=lon)

    return {
        "mandal": soil_record.mandal,
        "district": soil_record.district,
        "soil_profile": {
            "nitrogen_kg_ha": soil_record.nitrogen_kg_ha,
            "phosphorus_kg_ha": soil_record.phosphorus_kg_ha,
            "potassium_kg_ha": soil_record.potassium_kg_ha,
            "ph_level": soil_record.ph_level,
            "organic_carbon_pct": soil_record.organic_carbon_pct,
            "texture": soil_record.texture,
            "groundwater_depth_m": boundary.groundwater_depth_m if boundary else None
        },
        "weather": weather_data
    }