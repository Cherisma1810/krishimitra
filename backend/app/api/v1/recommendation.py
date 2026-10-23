from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.soil import SoilHealthMetric
from app.models.spatial import MandalBoundary
from app.services.weather_service import get_mandal_weather
from app.services.recommendation_service import recommendation_engine
from geoalchemy2.shape import to_shape

router = APIRouter(prefix="/crops", tags=["Crop Recommendation AI"])

@router.get("/recommend")
async def get_crop_recommendations_for_farmer(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Automatically gathers the logged-in farmer's mandal soil attributes (PostGIS)
    and live real-time weather metrics, then passes them to the Random Forest model.
    """
    if not current_user.profile:
        raise HTTPException(status_code=400, detail="Farmer profile does not exist.")

    mandal_name = current_user.profile.mandal

    # 1. Fetch soil parameters for this mandal
    soil = db.query(SoilHealthMetric).filter(
        func.lower(SoilHealthMetric.mandal) == mandal_name.lower()
    ).first()

    if not soil:
        # Fallback to default Tirupati regional values if new mandal
        N, P, K, ph = 185.0, 22.0, 210.0, 7.2
    else:
        N, P, K, ph = soil.nitrogen_kg_ha, soil.phosphorus_kg_ha, soil.potassium_kg_ha, soil.ph_level

    # 2. Fetch live weather using centroid or farm coordinates
    lat = current_user.profile.farm_location and to_shape(current_user.profile.farm_location).y or 13.5851
    lon = current_user.profile.farm_location and to_shape(current_user.profile.farm_location).x or 79.3142

    weather_data = await get_mandal_weather(lat=lat, lon=lon)
    temp = weather_data["current"]["temperature_c"] or 28.0
    humidity = weather_data["current"]["humidity_pct"] or 65.0

    # 3. Model Inference
    recommendations = recommendation_engine.recommend(
        nitrogen=N,
        phosphorus=P,
        potassium=K,
        temperature=temp,
        humidity=humidity,
        ph=ph,
        rainfall=650.0,
        top_k=3
    )

    return {
        "mandal": mandal_name,
        "input_parameters": {
            "nitrogen_kg_ha": N,
            "phosphorus_kg_ha": P,
            "potassium_kg_ha": K,
            "soil_ph": ph,
            "ambient_temp_c": temp,
            "relative_humidity_pct": humidity
        },
        "top_recommendations": recommendations
    }