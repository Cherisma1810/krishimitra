import sys
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
import joblib

# Target artifact paths
ML_DIR = Path(__file__).resolve().parent.parent / "app" / "ml"
ML_DIR.mkdir(parents=True, exist_ok=True)
MODEL_PATH = ML_DIR / "crop_recommender.joblib"

def generate_benchmark_crop_data():
    """
    Generates a calibrated agronomic dataset matching ICAR / Andhra Pradesh 
    regional ranges for Rayalaseema (Tirupati/Chittoor/Annamayya).
    """
    np.random.seed(42)
    crops_profile = {
        "groundnut": {"N": (140, 190), "P": (15, 30), "K": (180, 240), "temp": (24, 32), "humidity": (50, 75), "ph": (6.0, 7.5), "rain": (500, 750), "samples": 300},
        "tomato":    {"N": (180, 240), "P": (25, 45), "K": (200, 280), "temp": (18, 28), "humidity": (60, 80), "ph": (6.2, 7.2), "rain": (400, 600), "samples": 300},
        "sugarcane": {"N": (200, 280), "P": (30, 55), "K": (220, 300), "temp": (26, 35), "humidity": (65, 85), "ph": (6.5, 7.8), "rain": (800, 1200), "samples": 300},
        "redgram":   {"N": (130, 180), "P": (18, 35), "K": (160, 220), "temp": (22, 32), "humidity": (45, 65), "ph": (6.5, 8.0), "rain": (450, 700), "samples": 300},
        "rice":      {"N": (210, 290), "P": (35, 60), "K": (180, 260), "temp": (22, 32), "humidity": (75, 95), "ph": (5.8, 7.2), "rain": (1000, 1500), "samples": 300},
        "maize":     {"N": (170, 230), "P": (20, 40), "K": (170, 230), "temp": (20, 30), "humidity": (55, 75), "ph": (6.0, 7.5), "rain": (500, 800), "samples": 300},
        "chilli":    {"N": (160, 220), "P": (22, 38), "K": (190, 260), "temp": (20, 32), "humidity": (50, 70), "ph": (6.0, 7.0), "rain": (600, 900), "samples": 300}
    }

    rows = []
    for crop, prof in crops_profile.items():
        n = prof["samples"]
        N = np.random.uniform(prof["N"][0], prof["N"][1], n)
        P = np.random.uniform(prof["P"][0], prof["P"][1], n)
        K = np.random.uniform(prof["K"][0], prof["K"][1], n)
        temp = np.random.uniform(prof["temp"][0], prof["temp"][1], n)
        humidity = np.random.uniform(prof["humidity"][0], prof["humidity"][1], n)
        ph = np.random.uniform(prof["ph"][0], prof["ph"][1], n)
        rain = np.random.uniform(prof["rain"][0], prof["rain"][1], n)

        for i in range(n):
            rows.append({
                "N": round(N[i], 1),
                "P": round(P[i], 1),
                "K": round(K[i], 1),
                "temperature": round(temp[i], 1),
                "humidity": round(humidity[i], 1),
                "ph": round(ph[i], 2),
                "rainfall": round(rain[i], 1),
                "crop": crop
            })

    df = pd.DataFrame(rows)
    # Save CSV
    raw_path = Path(__file__).resolve().parent.parent.parent / "data" / "raw" / "crop_recommendation.csv"
    raw_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(raw_path, index=False)
    print(f"Dataset generated with {len(df)} rows across {len(crops_profile)} crops at: {raw_path}")
    return df

def train_and_save_model():
    df = generate_benchmark_crop_data()

    X = df[["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]]
    y = df["crop"]

    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )

    clf = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42)
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Training Complete. Test Accuracy: {acc * 100:.2f}%")

    # Serialize Model + LabelEncoder + Feature Columns
    payload = {
        "model": clf,
        "label_encoder": le,
        "features": list(X.columns)
    }
    joblib.dump(payload, MODEL_PATH)
    print(f"Serialized ML Artifact saved to: {MODEL_PATH}")

if __name__ == "__main__":
    train_and_save_model()