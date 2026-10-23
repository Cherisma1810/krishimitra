import httpx
from typing import Dict, Any

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

async def get_mandal_weather(lat: float, lon: float) -> Dict[str, Any]:
    """
    Fetches real-time weather and 7-day agrometeorological forecast 
    for the farmer's PostGIS coordinates.
    """
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": ["temperature_2m", "relative_humidity_2m", "precipitation", "wind_speed_10m"],
        "daily": ["temperature_2m_max", "temperature_2m_min", "precipitation_sum", "precipitation_probability_max"],
        "timezone": "Asia/Kolkata"
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(OPEN_METEO_URL, params=params)
        response.raise_for_status()
        data = response.json()

    current = data.get("current", {})
    daily = data.get("daily", {})

    return {
        "current": {
            "temperature_c": current.get("temperature_2m"),
            "humidity_pct": current.get("relative_humidity_2m"),
            "precipitation_mm": current.get("precipitation"),
            "wind_speed_kmh": current.get("wind_speed_10m"),
        },
        "forecast_7d": {
            "dates": daily.get("time", []),
            "temp_max": daily.get("temperature_2m_max", []),
            "temp_min": daily.get("temperature_2m_min", []),
            "rain_sum_mm": daily.get("precipitation_sum", []),
            "rain_prob_pct": daily.get("precipitation_probability_max", [])
        }
    }