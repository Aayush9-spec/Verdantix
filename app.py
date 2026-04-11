import os
import json
import uuid
import datetime
import joblib
import sqlite3
import psycopg2
import requests
from psycopg2.extras import RealDictCursor
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from dotenv import load_dotenv

# =============================================================================
# CONFIGURATION & ENV LOADING
# =============================================================================
load_dotenv()

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.getenv("DATABASE_URL") 
MODEL_PATH = "model.pkl"

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
            db = g._database = psycopg2.connect(DATABASE_URL)
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
    conn = psycopg2.connect(DATABASE_URL) if DATABASE_URL else sqlite3.connect("verdantix.db")
    cursor = conn.cursor()
    for sql in tables:
        cursor.execute(sql)
    conn.commit()
    conn.close()
    print("🚀 Satellite Database Synchronized")

init_db()

# =============================================================================
# ML INFERENCE CORE
# =============================================================================

def get_ml_prediction(features):
    if not ML_BUNDLE:
        return 75.0, "B", 0.9 
    
    model = ML_BUNDLE["model"]
    # Expecting: [temp, humidity, rain, crop_id, fert_id, water_id]
    pred = model.predict([features])[0]
    score = max(0, min(100, float(pred)))
    grade = "A" if score >= 85 else "B" if score >= 65 else "C"
    return round(score, 2), grade, 0.95

# =============================================================================
# PRODUCTION API ENDPOINTS
# =============================================================================

@app.route("/weather", methods=["GET"])
def weather():
    lat = request.args.get("lat", 28.61)
    lon = request.args.get("lon", 77.23)
    api_key = os.getenv("OPENWEATHER_API_KEY")

    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        res = requests.get(url, timeout=5).json()
        
        rain_h = res.get("rain", {}).get("1h", 0)
        projected_rain = round(rain_h * 24, 1) # Scaling to daily magnitude

        return jsonify({
            "success": True,
            "data": {
                "temperature": round(res["main"]["temp"], 1),
                "humidity": res["main"]["humidity"],
                "rainfall": projected_rain,
                "condition": res["weather"][0]["main"],
                "location_name": res.get("name", "Field GPS Lock")
            }
        })
    except Exception as e:
        return jsonify({"success": True, "data": {"temperature": 25, "humidity": 70, "rainfall": 100, "condition": "Cloudy (Sim)"}})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    try:
        # 1. Prepare Telemetry Matrix
        features = [
            data.get("temperature", 25), 
            data.get("humidity", 70), 
            data.get("rainfall", 100),
            0, 1, 1 # crop_id, fert_id, water_id
        ]
        score, grade, conf = get_ml_prediction(features)
        
        p_id = str(uuid.uuid4())[:12]
        ts = datetime.datetime.utcnow().isoformat()
        
        # 2. Persist to Postgres
        execute_db(
            """INSERT INTO predictions 
            (id, land, crop, fertilizer, water_source, temperature, humidity, rainfall, carbon_score, grade, confidence, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (p_id, data['land'], data['crop'], data['fertilizer'], data['water_source'], 
             features[0], features[1], features[2], score, grade, conf, ts)
        )
        
        return jsonify({
            "success": True,
            "id": p_id,
            "carbon_score": score,
            "grade": grade,
            "confidence": conf
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/dashboard", methods=["GET"])
def dashboard():
    try:
        stats = query_db("SELECT COUNT(*) as total, AVG(carbon_score) as avg_score FROM predictions", one=True)
        dist = query_db("SELECT crop, COUNT(*) as count FROM predictions GROUP BY crop")
        
        return jsonify({
            "success": True,
            "data": {
                "total_predictions": stats['total'],
                "average_score": round(stats['avg_score'] or 0, 2),
                "crop_distribution": [dict(r) for r in dist]
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/chat", methods=["POST"])
def chat():
    from services.chatbot_service import chat as ai_chat
    data = request.json
    try:
        res = ai_chat(message=data.get("message", ""), context=data.get("context", {}))
        return jsonify({"success": True, "data": res})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/sync", methods=["POST"])
def sync():
    data = request.json
    pending = data.get("pending_predictions", [])
    synced_count = 0
    try:
        for p in pending:
            exists = query_db("SELECT id FROM predictions WHERE id = ?", (p.get("id", ""),), one=True)
            if exists: continue
            
            p_id = p.get("id") or str(uuid.uuid4())[:12]
            ts = p.get("timestamp") or datetime.datetime.utcnow().isoformat()
            
            execute_db(
                """INSERT INTO predictions (id, land, crop, fertilizer, water_source, temperature, humidity, rainfall, carbon_score, grade, confidence, timestamp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
                (p_id, p['land'], p['crop'], p['fertilizer'], p['water_source'], p.get('temperature', 25), p.get('humidity', 70), p.get('rainfall', 100), p.get('carbon_score', 0), p.get('grade', 'N/A'), p.get('confidence', 0), ts)
            )
            synced_count += 1
        return jsonify({"success": True, "synced_total": synced_count})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/health")
def health():
    return jsonify({"success": True, "status": "running", "postgres": DATABASE_URL is not None})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5100)))