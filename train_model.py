import os
import pandas as pd
import joblib
import datetime
from sklearn.linear_model import LinearRegression

DATA_PATH = "data.csv"
MODEL_PATH = "model.pkl"
CROP_MAP = {"rice": 0, "wheat": 1, "maize": 2, "soybean": 3}

def train_ml_model():
    """Trains a realistic Verdantix ML model grounded in Kaggle data."""
    if not os.path.exists(DATA_PATH):
        print(f"❌ Error: {DATA_PATH} not found.")
        return False

    # 1. Load and Clean
    df = pd.read_csv(DATA_PATH)
    df = df[["temperature", "humidity", "rainfall", "label"]]
    df = df[df["label"].isin(CROP_MAP.keys())]
    
    # 2. Map Features
    df["crop_id"] = df["label"].map(CROP_MAP)
    df["fertilizer"] = df["humidity"].apply(lambda x: 1 if x > 60 else 0)
    df["water"] = df["rainfall"].apply(lambda x: 1 if x > 100 else 0)
    
    # 3. Target Engineering (Realistic Logic)
    # carbon_score = (0.25*temp + 0.25*hum + 0.25*rain + 10*fert + 8*water + 5*crop)
    df["raw_score"] = (
        0.25 * df["temperature"] + 
        0.25 * df["humidity"] + 
        0.25 * df["rainfall"] + 
        10 * df["fertilizer"] + 
        8 * df["water"] + 
        5 * df["crop_id"]
    )
    
    # 4. Normalize to 0-100
    max_score = df["raw_score"].max()
    df["carbon_score"] = (df["raw_score"] / max_score) * 100
    
    # 5. Training
    X = df[["temperature", "humidity", "rainfall", "crop_id", "fertilizer", "water"]]
    y = df["carbon_score"]
    
    model = LinearRegression()
    model.fit(X, y)
    
    # 6. Generate Trained Dataset
    df["predicted_score"] = model.predict(X)
    df.to_csv("trained_data.csv", index=False)
    print("✅ trained_data.csv generated")
    
    bundle = {
        "model": model,
        "metadata": {
            "model_type": "Linear Regression (Grounded)",
            "training_samples": len(df),
            "last_trained": datetime.datetime.utcnow().isoformat() + "Z",
            "accuracy": round(model.score(X, y), 4),
            "max_training_score": max_score
        }
    }
    
    joblib.dump(bundle, MODEL_PATH)
    print(f"✅ ML Model persistent at {MODEL_PATH} (Accuracy: {bundle['metadata']['accuracy']})")
    return True

if __name__ == "__main__":
    train_ml_model()
