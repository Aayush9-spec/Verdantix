import requests
import json

data = {
    "land": 5,
    "crop": "wheat",
    "fertilizer": "organic",
    "water_source": "irrigation",
    "temperature": 28,
    "humidity": 60,
    "rainfall": 120
}

try:
    res = requests.post("http://localhost:5100/predict", json=data)
    print(res.json())
except Exception as e:
    print(f"Error: {e}")
