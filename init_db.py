import sqlite3
import uuid
import datetime
import json

DATABASE = "verdantix.db"

def build_production_db():
    print(f"🏗️  Initializing Verdantix Production Database: {DATABASE}")
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    # 1. Predictions Ledger
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id TEXT PRIMARY KEY,
            timestamp TEXT,
            land REAL,
            crop TEXT,
            fertilizer TEXT,
            water TEXT,
            lat REAL,
            lon REAL,
            carbon_score REAL,
            value_inr REAL,
            is_offline INTEGER DEFAULT 0
        )
    ''')

    # 2. Chat Vault
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            role TEXT,
            content TEXT,
            msg_type TEXT
        )
    ''')

    # 3. Weather Logbook
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS weather_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            lat REAL,
            lon REAL,
            temp REAL,
            humidity REAL,
            condition TEXT
        )
    ''')
    
    # 4. Inject Seed Data (To make the dashboard look live)
    seed_predictions = [
        (str(uuid.uuid4())[:8], '2026-04-10T10:00:00', 5.5, 'Rice', 'Organic', 'Irrigation', 26.8, 75.2, 88.5, 3850.0, 0),
        (str(uuid.uuid4())[:8], '2026-04-11T09:12:00', 12.0, 'Wheat', 'Chemical', 'Rain-fed', 28.1, 77.4, 62.3, 8500.0, 1),
    ]
    
    cursor.executemany("""
        INSERT OR IGNORE INTO predictions 
        (id, timestamp, land, crop, fertilizer, water, lat, lon, carbon_score, value_inr, is_offline) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, seed_predictions)

    conn.commit()
    conn.close()
    print("✅ Database built and seeded successfully!")

if __name__ == "__main__":
    build_production_db()
