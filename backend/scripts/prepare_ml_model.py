import sys
from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib


BASE_DIR = Path(__file__).resolve().parent.parent.parent
RAW_DATA_PATH = BASE_DIR / "data" / "raw" / "Crop_recommendation.csv"
ML_DIR = BASE_DIR / "backend" / "app" / "ml"
ML_DIR.mkdir(parents=True, exist_ok=True)
MODEL_PATH = ML_DIR / "crop_recommender.joblib"

def train_and_save_empirical_model():

    if not RAW_DATA_PATH.exists():
        raise FileNotFoundError(
            f"[-] Could not find 'Crop_recommendation.csv' at {RAW_DATA_PATH}. "
            "Please ensure the Kaggle dataset is placed in 'data/raw/Crop_recommendation.csv'."
        )

    print(f"[+] Loading empirical dataset from: {RAW_DATA_PATH}")
    df = pd.read_csv(RAW_DATA_PATH)


    if "label" in df.columns:
        df = df.rename(columns={"label": "crop"}) 

    
    feature_cols = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    X = df[feature_cols]
    y = df["crop"]

    
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )


    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=15,
        random_state=42
    )
    clf.fit(X_train, y_train)

    
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\n[+] Empirical Model Training Complete!")
    print(f"[+] Test Accuracy: {acc * 100:.2f}%\n")
    print(classification_report(y_test, y_pred, target_names=le.classes_))

    payload = {
        "model": clf,
        "label_encoder": le,
        "features": feature_cols
    }
    
    joblib.dump(payload, MODEL_PATH)
    print(f"[+] Serialized ML Artifact saved to: {MODEL_PATH}")

if __name__ == "__main__":
    train_and_save_empirical_model()
