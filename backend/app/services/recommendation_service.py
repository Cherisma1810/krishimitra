from pathlib import Path
import numpy as np
import joblib
from typing import Dict, Any, List

MODEL_PATH = Path(__file__).resolve().parent.parent / "ml" / "crop_recommender.joblib"

CROP_DETAILS = {
    "groundnut": {
        "telugu": "వేరుశనగ (Groundnut)",
        "duration_days": "105 - 115",
        "irrigation_need": "Medium (బోరు బావి / వర్షాధారం)",
        "fertilizer_tip": "Apply Gypsum @ 200 kg/acre at 40-45 DAS for optimal pod filling."
    },
    "tomato": {
        "telugu": "టమోటా (Tomato)",
        "duration_days": "90 - 120",
        "irrigation_need": "High (Drip Irrigation Recommended)",
        "fertilizer_tip": "High Potassium demand during fruit set. Foliar spray 13-0-45."
    },
    "sugarcane": {
        "telugu": "చెరకు (Sugarcane)",
        "duration_days": "300 - 360",
        "irrigation_need": "Heavy (Canal / Frequent Borewell)",
        "fertilizer_tip": "Split Nitrogen application into 3 equal doses at 30, 60, and 90 DAP."
    },
    "redgram": {
        "telugu": "కంది (Red Gram / Pigeonpea)",
        "duration_days": "150 - 180",
        "irrigation_need": "Low (Drought-tolerant, Rainfed)",
        "fertilizer_tip": "Inoculate seeds with Rhizobium culture before sowing to boost nitrogen fixation."
    },
    "rice": {
        "telugu": "వరి (Paddy / Rice)",
        "duration_days": "120 - 140",
        "irrigation_need": "Very High (Canal / Standing Water)",
        "fertilizer_tip": "Apply Zinc Sulphate @ 20 kg/acre in alkaline soils to prevent Khaira disease."
    },
    "maize": {
        "telugu": "మొక్కజొన్న (Maize)",
        "duration_days": "90 - 105",
        "irrigation_need": "Medium (Canal / Sprinkler)",
        "fertilizer_tip": "Top-dress Urea at knee-high and tasseling stages."
    },
    "chilli": {
        "telugu": "మిరప (Red Chilli)",
        "duration_days": "150 - 180",
        "irrigation_need": "Medium-High",
        "fertilizer_tip": "Ensure balanced micronutrient spray (Boron + Calcium) to prevent flower drop."
    }
}

class CropRecommendationEngine:
    def __init__(self):
        self.model_data = None
        self._load()

    def _load(self):
        if MODEL_PATH.exists():
            self.model_data = joblib.load(MODEL_PATH)
        else:
            self.model_data = None

    def recommend(
        self,
        nitrogen: float,
        phosphorus: float,
        potassium: float,
        temperature: float,
        humidity: float,
        ph: float,
        rainfall: float = 650.0,
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        if not self.model_data:
            self._load()
            if not self.model_data:
                raise RuntimeError("ML Model artifact is not trained yet. Run prepare_ml_model.py first.")

        model = self.model_data["model"]
        le = self.model_data["label_encoder"]

        # Format input vector
        features = np.array([[nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]])
        probabilities = model.predict_proba(features)[0]

        # Get top-k crop indices sorted by probability
        top_indices = np.argsort(probabilities)[::-1][:top_k]

        results = []
        for idx in top_indices:
            crop_name = le.inverse_transform([idx])[0]
            confidence = round(float(probabilities[idx]) * 100, 1)
            meta = CROP_DETAILS.get(crop_name, {
                "telugu": crop_name,
                "duration_days": "100-120",
                "irrigation_need": "Medium",
                "fertilizer_tip": "Balanced NPK application based on soil test."
            })

            results.append({
                "crop": crop_name,
                "crop_telugu": meta["telugu"],
                "confidence_pct": confidence,
                "duration_days": meta["duration_days"],
                "irrigation_need": meta["irrigation_need"],
                "fertilizer_advisory": meta["fertilizer_tip"]
            })

        return results

recommendation_engine = CropRecommendationEngine()