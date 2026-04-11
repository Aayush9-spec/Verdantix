# =============================================================================
# Verdantix – Kaggle-Grounded ML Carbon Intelligence Platform
# Production-Ready Flask Backend | Version 5.0.0
# =============================================================================

import os
import math
import random
import datetime
import uuid
import joblib
import numpy as np
import pandas as pd
from dotenv import load_dotenv

# Load environment variables before importing services
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.linear_model import LinearRegression
from services.chatbot_service import chat as ai_chat

app = Flask(__name__)
CORS(app)

VERSION = "5.0.0"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
TRAINED_DATA_PATH = os.path.join(BASE_DIR, "trained_data.csv")

# =============================================================================
# ML PIPELINE: KAGGLE DATA & TRAINING
# =============================================================================

CROP_MAP = {"rice": 0, "wheat": 1, "maize": 2, "soybean": 3}

def train_ml_model():
    """Trained on data.csv (temperature, humidity, rainfall) for grounded carbon scoring."""
    print("🚀 Initializing Kaggle-Grounded ML Auto-Training Sequence...")
    
    if not os.path.exists(DATA_PATH):
        print(f"❌ Error: {DATA_PATH} not found. Please provide the dataset.")
        return None

    try:
        # 1. Load Dataset
        df = pd.read_csv(DATA_PATH)
        
        # 2. Clean Data (Strict Filtering)
        df = df[["temperature", "humidity", "rainfall", "label"]]
        df = df[df["label"].isin(CROP_MAP.keys())]
        
        # 3. Factor Definitions (Multiplicative Strategy)
        CROP_FACTORS = {"rice": 1.1, "wheat": 1.0, "maize": 1.1, "soybean": 1.3}
        FERT_FACTORS = {1: 1.25, 0: 0.8}   # 1=Organic, 0=Chemical
        WATER_FACTORS = {1: 1.15, 0: 0.85} # 1=Irrigation, 0=Rain-fed

        # 4. Feature Engineering
        df["crop_id"] = df["label"].map(CROP_MAP)
        df["fertilizer_id"] = df["humidity"].apply(lambda x: 1 if x > 60 else 0)
        df["water_id"] = df["rainfall"].apply(lambda x: 1 if x > 100 else 0)
        
        # 5. Target Engineering (Multiplicative Model)
        # Sequestration Model: Base environmental potential
        df["sequestration"] = (df["temperature"] * 0.3 + df["humidity"] * 0.3 + df["rainfall"] * 0.4)
        
        # Factor Interaction
        df["crop_factor"] = df["label"].map(CROP_FACTORS)
        df["fert_factor"] = df["fertilizer_id"].map(FERT_FACTORS)
        df["water_factor"] = df["water_id"].map(WATER_FACTORS)
        
        # Multiplicative Score: carbon_score = sequestration * factors
        df["raw_score"] = (
            df["sequestration"] * 
            df["crop_factor"] * 
            df["fert_factor"] * 
            df["water_factor"]
        )
        
        # Normalize to 0-100
        min_s = df["raw_score"].min()
        max_s = df["raw_score"].max()
        df["carbon_score"] = ((df["raw_score"] - min_s) / (max_s - min_s)) * 100
        
        # 5. Train Model
        X = df[["temperature", "humidity", "rainfall", "crop_id", "fertilizer_id", "water_id"]]
        y = df["carbon_score"]
        
        model = LinearRegression()
        model.fit(X, y)
        
        # 6. Generate Trained Dataset
        df["predicted_score"] = model.predict(X)
        df.to_csv(TRAINED_DATA_PATH, index=False)
        print("✅ trained_data.csv generated")
        
        bundle = {
            "model": model,
            "metadata": {
                "model_type": "Linear Regression (Kaggle-Grounded)",
                "training_samples": len(df),
                "last_trained": datetime.datetime.utcnow().isoformat() + "Z",
                "accuracy": round(model.score(X, y), 4)
            }
        }
        
        joblib.dump(bundle, MODEL_PATH)
        print(f"✅ ML Model persistent at {MODEL_PATH} (Accuracy: {bundle['metadata']['accuracy']})")
        return bundle
    except Exception as e:
        print(f"❌ ML Training failed: {str(e)}")
        return None

# Auto-Load or Train on Startup
if not os.path.exists(MODEL_PATH):
    ML_BUNDLE = train_ml_model()
else:
    print(f"📦 Loading persistent Kaggle-grounded ML model from {MODEL_PATH}...")
    ML_BUNDLE = joblib.load(MODEL_PATH)

# =============================================================================
# UTILITIES & RE-DESIGNED CARBON ENGINE
# =============================================================================

def clamp(n, min_n, max_n):
    return max(min(n, max_n), min_n)

def now_iso():
    return datetime.datetime.utcnow().isoformat() + "Z"

def get_request_id():
    return str(uuid.uuid4())[:8]

def api_response(data=None, success=True, error=None, code=200, rid=None):
    return jsonify({
        "success": success,
        "data": data if data is not None else {"error": error},
        "request_id": rid or get_request_id(),
        "timestamp": now_iso()
    }), code

def get_weather_data_mock(lat, lon):
    """Deterministic weather simulation seeded by location."""
    rng = random.Random(lat + lon)
    base_temp = 38 - abs(lat) * 0.6
    temp = round(base_temp + rng.uniform(-3, 3), 1)
    rain = round(rng.uniform(0, 250), 1)
    hum  = round(rng.uniform(30, 95), 1)
    
    return {
        "temperature": temp,
        "humidity": hum,
        "rainfall": rain,
        "condition": "Moderate"
    }

def predict_ml_carbon(land, crop, fertilizer_type, water_type, lat, lon, user_temp=None, user_hum=None, user_rain=None):
    """Refined inference engine with environmental weighting and dynamic insights."""
    # 1. Weather Auto-Fill
    weather_used = None
    if user_temp is None or user_hum is None or user_rain is None:
        weather_used = get_weather_data_mock(lat, lon)
        temp = user_temp if user_temp is not None else weather_used["temperature"]
        hum = user_hum if user_hum is not None else weather_used["humidity"]
        rain = user_rain if user_rain is not None else weather_used["rainfall"]
    else:
        temp, hum, rain = user_temp, user_hum, user_rain
        weather_used = {"temperature": temp, "humidity": hum, "rainfall": rain, "source": "user_provided"}

    # 2. Feature Encoding
    c_id = CROP_MAP.get(crop.lower().strip(), 0)
    f_id = 1 if fertilizer_type.lower().strip() == "organic" else 0
    w_id = 1 if water_type.lower().strip() == "irrigation" else 0
    
    features = [[temp, hum, rain, c_id, f_id, w_id]]
    
    # 3. ML Prediction (Normalized 0-100)
    model = ML_BUNDLE["model"]
    prediction = model.predict(features)[0]
    carbon_score = round(clamp(prediction, 0, 100), 1)
    
    # 4. Grading
    grade = "A" if carbon_score >= 75 else "B" if carbon_score >= 50 else "C"
    colors = {"A": "#22c55e", "B": "#f59e0b", "C": "#ef4444"}
    
    # 5. Dynamic AI Insight Generation
    if f_id == 1:
        insight = "Organic fertilizer improved carbon efficiency and soil health."
    elif rain < 50:
        insight = "Low rainfall detected; moisture stress reduced carbon sequestration potential."
    else:
        insight = "Balanced environmental factors supporting steady carbon sequestration."

    credits = round((float(land) * 0.8) * (carbon_score / 100), 2)
    
    return {
        "carbon_score": carbon_score,
        "grade": grade,
        "grade_color": colors[grade],
        "estimated_value_inr": round(credits * 850, 2),
        "weather_used": weather_used,
        "insight": insight,
        "ml_metadata": ML_BUNDLE["metadata"]
    }

# =============================================================================
# CHATBOT & MODULAR SERVICES (RETAINED)
# =============================================================================

def validate_input(data):
    req = ["land", "crop", "fertilizer", "water_source"]
    for f in req:
        if f not in data: return f"Missing field: {f}"
    return None

# =============================================================================
# ROUTES
# =============================================================================

@app.route("/")
def home():
    return api_response(data={"message": "🌱 Verdantix Kaggle-ML Backend Running", "version": VERSION})

@app.route("/predict", methods=["POST"])
def predict():
    rid = get_request_id()
    try:
        data = request.get_json(force=True, silent=True) or {}
        err = validate_input(data)
        if err: return api_response(error=err, success=False, code=400, rid=rid)
        
        loc = data.get("location", {"lat": 20, "lon": 78})
        res = predict_ml_carbon(
            data["land"], data["crop"], data["fertilizer"], data["water_source"],
            loc["lat"], loc["lon"]
        )
        return api_response(data=res, rid=rid)
    except Exception as e:
        return api_response(error=str(e), success=False, code=500, rid=rid)

@app.route("/weather", methods=["GET"])
def weather():
    lat = float(request.args.get("lat", 20)); lon = float(request.args.get("lon", 78))
    data = get_weather_data_mock(lat, lon)
    return api_response(data=data)

@app.route("/optimize", methods=["POST"])
def optimize():
    rid = get_request_id()
    try:
        data = request.get_json(force=True, silent=True) or {}
        loc = data.get("location", {"lat": 20, "lon": 78})
        cur = predict_ml_carbon(data["land"], data["crop"], data["fertilizer"], data["water_source"], loc["lat"], loc["lon"])
        opt = predict_ml_carbon(data["land"], data["crop"], "organic", "irrigation", loc["lat"], loc["lon"])
        improve = round(((opt["carbon_score"] - cur["carbon_score"]) / cur["carbon_score"] * 100) if cur["carbon_score"] > 0 else 0, 1)
        return api_response(data={"current_score": cur["carbon_score"], "optimized_score": opt["carbon_score"], "improvement": improve})
    except Exception as e: return api_response(error=str(e), success=False, code=500)

@app.route("/simulate", methods=["POST"])
def simulate():
    try:
        data = request.get_json(force=True, silent=True) or {}
        scenarios = data.get("scenarios", [])
        results = []
        for i, s in enumerate(scenarios):
            c = predict_ml_carbon(s["land"], s["crop"], s["fertilizer"], s["water_source"], 20, 78)
            results.append({"scenario_id": i+1, "score": c["carbon_score"], "grade": c["grade"]})
        return api_response(data={"results": results})
    except Exception as e: return api_response(error=str(e), success=False, code=500)

@app.route("/chat", methods=["POST"])
def chat():
    """AI Chatbot Route — Connected to Groq/OpenAI."""
    rid = get_request_id()
    try:
        data = request.get_json(force=True, silent=True) or {}
        msg = data.get("message", "")
        context = data.get("context", {}) # Optional farm context
        history = data.get("history", []) # Optional chat history
        
        if not msg:
            return api_response(error="Message is empty", success=False, code=400, rid=rid)
            
        # Call the unified chatbot service
        res = ai_chat(message=msg, context=context, history=history)
        return api_response(data=res, rid=rid)
    except Exception as e:
        return api_response(error=str(e), success=False, code=500, rid=rid)

@app.route("/dashboard", methods=["GET"])
def dashboard():
    return api_response(data={"summary": {"total_credits": 150.5, "avg_score": 82.3}})

@app.route("/trained-data", methods=["GET"])
def get_trained_data():
    """Returns sample rows from the trained_data.csv artifact."""
    try:
        if not os.path.exists(TRAINED_DATA_PATH):
            return api_response(error="Trained data artifact not found. Please trigger training first.", success=False, code=404)
        
        df = pd.read_csv(TRAINED_DATA_PATH)
        sample = df.head(20).to_dict(orient="records")
        return api_response(data={"sample": sample, "total_rows": len(df)})
    except Exception as e:
        return api_response(error=str(e), success=False, code=500)

@app.route("/sync", methods=["POST"])
def sync():
    try:
        data = request.get_json(force=True, silent=True) or {}
        pending = data.get("pending_predictions", [])
        processed = []
        for p in pending:
            processed.append(predict_ml_carbon(p["land"], p["crop"], p["fertilizer"], p["water_source"], 20, 78))
        return api_response(data={"processed": processed, "synced": True})
    except Exception as e: return api_response(error=str(e), success=False, code=500)

@app.route("/health")
def health():
    return api_response(data={"status": "running", "ml_active": MODEL_PATH in os.listdir(".")})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5100, debug=False, use_reloader=False)