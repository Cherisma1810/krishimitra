import io
from pathlib import Path
from typing import Dict, Any
from PIL import Image
from ultralytics import YOLO

MODEL_PATH = Path(__file__).resolve().parent.parent / "ml" / "disease_model.pt"

# Detailed Telugu & English advisory records for core Andhra Pradesh / Indian crops
DISEASE_DB: Dict[str, Dict[str, Any]] = {
    "Tomato___Early_blight": {
        "disease_telugu": "టమోటా ఆకు ఎండు తెగులు (Tomato Early Blight)",
        "pathogen": "Alternaria solani (శిలీంధ్రం)",
        "severity": "మధ్యస్థం (Medium)",
        "symptoms": "ఆకులపై నల్లటి వలయాకార మచ్చలు ఏర్పడి, ఆకులు పసుపు రంగులోకి మారి రాలిపోతాయి.",
        "chemical_remedy": "మాంకోజెబ్ (Mancozeb 75% WP) @ 2.5 గ్రాములు లేదా కాపర్ ఆక్సిక్లోరైడ్ @ 3 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయాలి.",
        "organic_remedy": "వేప నూనె (Neem Oil 10,000 ppm) @ 2 మి.లీ లీటరు నీటికి కలిపి పిచికారీ చేయాలి. ట్రైకోడెర్మా విరిడిని భూమిలో వేయాలి."
    },
    "Tomato___Late_blight": {
        "disease_telugu": "టమోటా మాడు తెగులు (Tomato Late Blight)",
        "pathogen": "Phytophthora infestans (శిలీంధ్రం)",
        "severity": "తీవ్రం (High)",
        "symptoms": "చల్లని, తేమ వాతావరణంలో ఆకుల చివర్లు తడిసినట్లు నల్లబడి కుళ్ళిపోతాయి.",
        "chemical_remedy": "మెటలాక్సిల్ + మాంకోజెబ్ (Ridomil MZ) @ 2 గ్రాములు లీటరు నీటికి కలిపి వెంటనే పిచికారీ చేయాలి.",
        "organic_remedy": "వ్యాధి సోకిన మొక్కల భాగాలను తీసి కాల్చివేయాలి. నీరు నిలవకుండా డ్రైనేజీ సరిచేయాలి."
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "disease_telugu": "టమోటా ఆకు ముడత వైరస్ (Tomato Yellow Leaf Curl Virus)",
        "pathogen": "Begomovirus (తెల్లదోమ ద్వారా వ్యాప్తి)",
        "severity": "తీవ్రం (High)",
        "symptoms": "ఆకులు పైకి ముడుచుకుపోయి, పసుపు రంగులోకి మారి మొక్క ఎదుగుదల ఆగిపోతుంది.",
        "chemical_remedy": "తెల్లదోమ నివారణకు డైఫెన్థియురాన్ @ 1.25 గ్రాములు లేదా ఇమిడాక్లోప్రిడ్ @ 0.5 మి.లీ లీటరు నీటికి కలిపి పిచికారీ చేయాలి.",
        "organic_remedy": "ఎకరాకు 15-20 పసుపు రంగు జిగురు అట్టలను (Yellow Sticky Traps) పొలంలో అమర్చాలి."
    },
    "Pepper,_bell___Bacterial_spot": {
        "disease_telugu": "మిరప / క్యాప్సికమ్ బాక్టీరియా మచ్చ తెగులు (Bacterial Spot)",
        "pathogen": "Xanthomonas campestris (బాక్టీరియా)",
        "severity": "మధ్యస్థం (Medium)",
        "symptoms": "ఆకులపై చిన్న నీటిలో నానినట్లుండే గోధుమ మచ్చలు ఏర్పడి ఆకులు రాలిపోతాయి.",
        "chemical_remedy": "కాపర్ హైడ్రాక్సైడ్ @ 2 గ్రాములు + స్ట్రెప్టోసైక్లిన్ @ 0.15 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయాలి.",
        "organic_remedy": "సూడోమోనాస్ ఫ్లోరోసెన్స్ (Pseudomonas fluorescens) @ 5 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయాలి."
    },
    "Potato___Early_blight": {
        "disease_telugu": "బంగాళాదుంప ఆకు ఎండు తెగులు (Potato Early Blight)",
        "pathogen": "Alternaria solani (శిలీంధ్రం)",
        "severity": "మధ్యస్థం (Medium)",
        "symptoms": "ముదురు ఆకులపై గోధుమ రంగు వలయాకార మచ్చలు ఏర్పడతాయి.",
        "chemical_remedy": "క్లోరోథలోనిల్ (Kavach) @ 2 గ్రాములు లేదా మాంకోజెబ్ @ 2.5 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయాలి.",
        "organic_remedy": "వేప నూనె పిచికారీ చేసి, పంట మార్పిడి పద్ధతిని పాటించాలి."
    },
    "Potato___Late_blight": {
        "disease_telugu": "బంగాళాదుంప మాడు తెగులు (Potato Late Blight)",
        "pathogen": "Phytophthora infestans (శిలీంధ్రం)",
        "severity": "తీవ్రం (High)",
        "symptoms": "ఆకులపై ముదురు ఆకుపచ్చ నుండి నలుపు రంగు మచ్చలు వేగంగా వ్యాపిస్తాయి.",
        "chemical_remedy": "సైమోక్సానిల్ + మాంకోజెబ్ (Curzate) @ 2.5 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయాలి.",
        "organic_remedy": "వ్యాధి సోకిన ఆకులను తొలగించి నాశనం చేయాలి; అధిక నీటిపారుదల తగ్గించాలి."
    }
}


def _format_label(raw_label: str) -> tuple[str, str]:
    """Splits 'Tomato___Early_blight' into ('Tomato', 'Early blight')."""
    if "___" in raw_label:
        crop, disease = raw_label.split("___", 1)
    else:
        crop, disease = "Crop", raw_label
    crop = crop.replace("_", " ").replace(",", "").strip()
    disease = disease.replace("_", " ").strip()
    return crop, disease


def _get_disease_info(raw_label: str) -> Dict[str, Any]:
    """
    Returns curated Telugu/English advisory if available in DISEASE_DB,
    and safely generates structured guidance for all remaining 38 classes.
    """
    if raw_label in DISEASE_DB:
        return DISEASE_DB[raw_label]

    crop, disease = _format_label(raw_label)

    # Handle all 12 '___healthy' classes cleanly
    if disease.lower() == "healthy":
        return {
            "disease_telugu": f"ఆరోగ్యకరమైన {crop} పంట ({crop} - Healthy Leaf)",
            "pathogen": "తెగుళ్లు లేవు (None)",
            "severity": "సాధారణం (Normal)",
            "symptoms": "ఆకు ఆకుపచ్చగా, ఎలాంటి వ్యాధి లక్షణాలు లేకుండా పుష్టిగా ఉంది.",
            "chemical_remedy": "ఎలాంటి రసాయన మందులు అవసరం లేదు.",
            "organic_remedy": "పంట ఎదుగుదలకు క్రమం తప్పకుండా 19-19-19 లేదా జీవామృతం అందించండి."
        }

    # Dynamic fallback for the remaining PlantVillage disease classes
    is_viral = "virus" in disease.lower() or "curl" in disease.lower() or "greening" in disease.lower()
    is_bacterial = "bacterial" in disease.lower()

    if is_viral:
        pathogen = f"{disease} (వైరస్ / కీటక వాహకాల ద్వారా వ్యాప్తి)"
        chem = "రసం పీల్చే పురుగుల నివారణకు ఇమిడాక్లోప్రిడ్ @ 0.5 మి.లీ లేదా థయోమెథాక్సామ్ @ 0.3 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయాలి."
    elif is_bacterial:
        pathogen = f"{disease} (బాక్టీరియా)"
        chem = "కాపర్ ఆక్సిక్లోరైడ్ @ 3 గ్రాములు + స్ట్రెప్టోసైక్లిన్ @ 0.15 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయాలి."
    else:
        pathogen = f"{disease} (శిలీంధ్ర / పంట తెగులు)"
        chem = "మాంకోజెబ్ (Mancozeb 75% WP) @ 2.5 గ్రాములు లేదా కార్బండజిమ్ @ 1 గ్రాము లీటరు నీటికి కలిపి పిచికారీ చేయాలి."

    return {
        "disease_telugu": f"{crop} - {disease}",
        "pathogen": pathogen,
        "severity": "మధ్యస్థం నుండి తీవ్రం (Moderate to High)",
        "symptoms": f"{crop} ఆకులపై {disease} లక్షణాలు (మచ్చలు, రంగు మారడం లేదా ఆకు ఎండడం) గుర్తించబడ్డాయి.",
        "chemical_remedy": chem,
        "organic_remedy": "వ్యాధి సోకిన ఆకులను తొలగించి, వేప నూనె (Neem Oil 10,000 ppm) @ 2 మి.లీ లీటరు నీటికి కలిపి పిచికారీ చేయాలి."
    }


class PlantDiseaseEngine:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"YOLOv8 disease model not found at: {MODEL_PATH}")
        self.model = YOLO(str(MODEL_PATH))
        print(f"Loaded 38-class YOLOv8 disease model from {MODEL_PATH}")

    def diagnose(self, image_bytes: bytes) -> Dict[str, Any]:
        if self.model is None:
            self._load_model()

        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        results = self.model.predict(source=image, verbose=False)
        result = results[0]

        top_idx = int(result.probs.top1)
        raw_label = result.names[top_idx]
        confidence = round(float(result.probs.top1conf) * 100, 1)

        info = _get_disease_info(raw_label)

        return {
            "disease_key": raw_label,
            "disease_telugu": info["disease_telugu"],
            "confidence_pct": confidence,
            "severity": info["severity"],
            "pathogen": info["pathogen"],
            "symptoms": info["symptoms"],
            "chemical_remedy": info["chemical_remedy"],
            "organic_remedy": info["organic_remedy"]
        }


disease_engine = PlantDiseaseEngine()
