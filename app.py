import os
import json
import uuid
import datetime
import joblib
import sqlite3
import psycopg2
import requests
import numpy as np
import pandas as pd
from psycopg2.extras import RealDictCursor
from flask import Flask, request, jsonify, g, Blueprint
from flask_cors import CORS
from dotenv import load_dotenv

# =============================================================================
# CONFIGURATION & ENV LOADING
# =============================================================================
load_dotenv()

app = Flask(__name__)
CORS(app)

# Define API Blueprint (MANDATORY for Vercel standardized routing)
api = Blueprint('api', __name__)

DATABASE_URL = os.getenv("DATABASE_URL") 
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "model.pkl")

# Load ML Bundle once on startup
try:
    ML_BUNDLE = joblib.load(MODEL_PATH)
    print("✅ ML Production Bundle Ready")
except Exception as e:
    print(f"⚠️ Model Warning: {e}")
    ML_BUNDLE = None

# =============================================================================
# DATABASE LAYER (HYBRID ENGINE)
# =============================================================================

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        if DATABASE_URL:
            try:
                # Try Postgres (Supabase/Neon)
                db = g._database = psycopg2.connect(DATABASE_URL, connect_timeout=5)
                print("🔗 Connected to Production PostgreSQL")
            except Exception as e:
                print(f"⚠️ Postgres Connection Failed: {e}. Falling back to SQLite.")
                db = g._database = sqlite3.connect("verdantix.db")
                db.row_factory = sqlite3.Row
        else:
            db = g._database = sqlite3.connect("verdantix.db")
            db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def query_db(query, args=(), one=False):
    db = get_db()
    if DATABASE_URL:
        cursor = db.cursor(cursor_factory=RealDictCursor)
        query = query.replace("?", "%s")
        cursor.execute(query, args)
    else:
        cursor = db.execute(query, args)
    rv = cursor.fetchall()
    cursor.close()
    return (rv[0] if rv else None) if one else rv

def execute_db(query, args=()):
    db = get_db()
    if DATABASE_URL:
        cursor = db.cursor()
        query = query.replace("?", "%s")
        cursor.execute(query, args)
        cursor.close()
    else:
        db.execute(query, args)
    db.commit()

# =============================================================================
# SCHEMA INITIALIZATION
# =============================================================================

def init_db():
    tables = [
        '''CREATE TABLE IF NOT EXISTS predictions (
            id TEXT PRIMARY KEY,
            land REAL, crop TEXT, fertilizer TEXT, water_source TEXT,
            temperature REAL, humidity REAL, rainfall REAL,
            carbon_score REAL, grade TEXT, confidence REAL,
            timestamp TEXT
        )''',
        f'''CREATE TABLE IF NOT EXISTS chat_history (
            id {"SERIAL" if DATABASE_URL else "INTEGER"} PRIMARY KEY {"" if DATABASE_URL else "AUTOINCREMENT"},
            message TEXT, response TEXT, language TEXT, timestamp TEXT
        )''',
        f'''CREATE TABLE IF NOT EXISTS weather_logs (
            id {"SERIAL" if DATABASE_URL else "INTEGER"} PRIMARY KEY {"" if DATABASE_URL else "AUTOINCREMENT"},
            lat REAL, lon REAL, temperature REAL, humidity REAL, 
            rainfall REAL, condition TEXT, timestamp TEXT
        )'''
    ]
    try:
        if DATABASE_URL:
            try:
                conn = psycopg2.connect(DATABASE_URL, connect_timeout=5)
            except Exception:
                print("⚠️ Postgres connection failed during init. Using SQLite.")
                conn = sqlite3.connect("verdantix.db")
        else:
            conn = sqlite3.connect("verdantix.db")
            
        cursor = conn.cursor()
        for sql in tables:
            cursor.execute(sql)
        conn.commit()
        conn.close()
        print("🚀 Satellite Database Synchronized")
    except Exception as e:
        print(f"⚠️ DB Init Warning: {e}")

init_db()

# =============================================================================
# UTILITIES & RE-DESIGNED CARBON ENGINE
# =============================================================================

def clamp(n, min_n, max_n):
    return max(min(n, max_n), min_n)

def api_response(data=None, success=True, error=None, code=200, rid=None):
    return jsonify({
        "success": success,
        "data": data if data is not None else {"error": error},
        "request_id": rid or str(uuid.uuid4())[:8],
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }), code

def predict_ml_carbon(land, crop, fertilizer_type, water_type, lat, lon, user_temp=None, user_hum=None, user_rain=None):
    # Multiplicative Factors (Scientific Logic)
    CROP_MAP = {"rice": 0, "wheat": 1, "maize": 2, "soybean": 3}
    
    # 1. Weather Fallback
    temp = user_temp if user_temp is not None else 25
    hum = user_hum if user_hum is not None else 70
    rain = user_rain if user_rain is not None else 100
    
    # 2. Encoding
    c_id = CROP_MAP.get(crop.lower().strip(), 0)
    f_id = 1 if fertilizer_type.lower().strip() == "organic" else 0
    w_id = 1 if water_type.lower().strip() == "irrigation" else 0
    
    # 3. ML Inference
    if not ML_BUNDLE:
        score = 75.0
    else:
        model = ML_BUNDLE["model"]
        features = [[temp, hum, rain, c_id, f_id, w_id]]
        prediction = model.predict(features)[0]
        score = clamp(prediction, 0, 100)
    
    grade = "A" if score >= 75 else "B" if score >= 50 else "C"
    colors = {"A": "#22c55e", "B": "#f59e0b", "C": "#ef4444"}
    
    return {
        "carbon_score": round(score, 1),
        "grade": grade,
        "grade_color": colors[grade],
        "estimated_value_inr": round((float(land) * 850) * (score / 100), 2),
        "temperature": temp,
        "humidity": hum,
        "rainfall": rain
    }

# =============================================================================
# PRODUCTION API ENDPOINTS (BLUEPRINT)
# =============================================================================

@api.route("/health")
def health():
    return api_response(data={"status": "running", "ml_active": ML_BUNDLE is not None, "postgres": DATABASE_URL is not None})

@api.route("/weather", methods=["GET"])
def weather():
    lat = request.args.get("lat", 28.61)
    lon = request.args.get("lon", 77.23)
    api_key = os.getenv("OPENWEATHER_API_KEY")

    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        res = requests.get(url, timeout=5).json()
        
        rain_h = res.get("rain", {}).get("1h", 0)
        projected_rain = round(rain_h * 24, 1)

        data = {
            "temperature": round(res["main"]["temp"], 1),
            "humidity": res["main"]["humidity"],
            "rainfall": projected_rain,
            "condition": res["weather"][0]["main"],
            "location_name": res.get("name", "Field GPS Lock")
        }
        return api_response(data=data)
    except Exception as e:
        return api_response(data={"temperature": 25, "humidity": 70, "rainfall": 100, "condition": "Cloudy (Sim)"})

@api.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True, silent=True) or {}
        loc = data.get("location", {"lat": 20, "lon": 78})
        
        res = predict_ml_carbon(
            data.get("land", 1), data.get("crop", "rice"), 
            data.get("fertilizer", "organic"), data.get("water_source", "irrigation"),
            loc["lat"], loc["lon"]
        )
        
        p_id = str(uuid.uuid4())[:12]
        ts = datetime.datetime.utcnow().isoformat() + "Z"
        
        # Persist to DB
        execute_db(
            """INSERT INTO predictions 
            (id, land, crop, fertilizer, water_source, temperature, humidity, rainfall, carbon_score, grade, confidence, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (p_id, data.get('land'), data.get('crop'), data.get('fertilizer'), data.get('water_source'), 
             res['temperature'], res['humidity'], res['rainfall'], res['carbon_score'], res['grade'], 0.95, ts)
        )
        
        return api_response(data=res, rid=p_id)
    except Exception as e:
        return api_response(error=str(e), success=False, code=500)

@api.route("/optimize", methods=["POST"])
def optimize():
    try:
        data = request.get_json(force=True, silent=True) or {}
        loc = data.get("location", {"lat": 20, "lon": 78})
        cur = predict_ml_carbon(data["land"], data["crop"], data["fertilizer"], data["water_source"], loc["lat"], loc["lon"])
        opt = predict_ml_carbon(data["land"], data["crop"], "organic", "irrigation", loc["lat"], loc["lon"])
        improve = round(((opt["carbon_score"] - cur["carbon_score"]) / cur["carbon_score"] * 100) if cur["carbon_score"] > 0 else 0, 1)
        return api_response(data={"current_score": cur["carbon_score"], "optimized_score": opt["carbon_score"], "improvement": improve})
    except Exception as e:
        return api_response(error=str(e), success=False, code=500)

@api.route("/dashboard", methods=["GET"])
def dashboard():
    try:
        stats = query_db("SELECT COUNT(*) as total, AVG(carbon_score) as avg_score FROM predictions", one=True)
        dist = query_db("SELECT crop, COUNT(*) as count FROM predictions GROUP BY crop")
        
        return api_response(data={
            "total_predictions": stats.get('total', 0) if stats else 0,
            "average_score": round(stats.get('avg_score', 0) or 0, 2) if stats else 0,
            "crop_distribution": [dict(r) for r in dist] if dist else []
        })
    except Exception as e:
        return api_response(error=str(e), success=False, code=500)

@api.route("/chat", methods=["POST"])
def chat():
    from services.chatbot_service import chat as ai_chat
    try:
        data = request.get_json(force=True, silent=True) or {}
        res = ai_chat(message=data.get("message", ""), context=data.get("context", {}))
        return api_response(data=res)
    except Exception as e:
        return api_response(error=str(e), success=False, code=500)

@api.route("/sync", methods=["POST"])
def sync():
    try:
        data = request.get_json(force=True, silent=True) or {}
        pending = data.get("pending_predictions", [])
        synced_count = 0
        for p in pending:
            p_id = p.get("id") or str(uuid.uuid4())[:12]
            ts = p.get("timestamp") or datetime.datetime.utcnow().isoformat() + "Z"
            execute_db(
                """INSERT INTO predictions (id, land, crop, fertilizer, water_source, temperature, humidity, rainfall, carbon_score, grade, confidence, timestamp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
                (p_id, p['land'], p['crop'], p['fertilizer'], p['water_source'], p.get('temperature', 25), p.get('humidity', 70), p.get('rainfall', 100), p.get('carbon_score', 0), p.get('grade', 'N/A'), p.get('confidence', 0), ts)
            )
            synced_count += 1
        return api_response(data={"synced_total": synced_count})
    except Exception as e:
        return api_response(error=str(e), success=False, code=500)

# Register Blueprint with /api prefix
app.register_blueprint(api, url_prefix='/api')

@app.route("/")
def index():
    return api_response(data={"message": "🌱 Verdantix Core Active", "api_root": "/api"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5100)))