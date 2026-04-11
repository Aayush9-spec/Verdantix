import requests
import random

BASE_URL = "http://localhost:5000"

def random_input():
    return {
        "land": round(random.uniform(1, 10), 2),
        "crop": random.choice(["rice", "wheat", "maize", "soybean"]),
        "fertilizer": random.choice(["organic", "chemical"]),
        "water_source": random.choice(["irrigation", "rain"]),
        "location": {
            "lat": round(random.uniform(8, 35), 4),
            "lon": round(random.uniform(68, 90), 4)
        }
    }

def test_predict():
    data = random_input()
    res = requests.post(f"{BASE_URL}/predict", json=data)
    print("\n🔮 /predict")
    print("Input:", data)
    print("Output:", res.json())

def test_weather():
    lat = random.uniform(8, 35)
    lon = random.uniform(68, 90)
    res = requests.get(f"{BASE_URL}/weather?lat={lat}&lon={lon}")
    print("\n🌦️ /weather")
    print("Output:", res.json())

def test_optimize():
    data = random_input()
    res = requests.post(f"{BASE_URL}/optimize", json=data)
    print("\n⚡ /optimize")
    print("Input:", data)
    print("Output:", res.json())

def test_simulate():
    scenarios = [random_input() for _ in range(3)]
    res = requests.post(f"{BASE_URL}/simulate", json={"scenarios": scenarios})
    print("\n🧪 /simulate")
    print("Input:", scenarios)
    print("Output:", res.json())

def test_chat():
    messages = [
        "How to improve soil?",
        "Best fertilizer for wheat?",
        "Rainfall impact on crops?"
    ]
    res = requests.post(f"{BASE_URL}/chat", json={
        "message": random.choice(messages),
        "language": random.choice(["en", "hi"])
    })
    print("\n🤖 /chat")
    print("Output:", res.json())

def test_dashboard():
    res = requests.get(f"{BASE_URL}/dashboard")
    print("\n📊 /dashboard")
    print("Output:", res.json())

def test_health():
    res = requests.get(f"{BASE_URL}/health")
    print("\n❤️ /health")
    print("Output:", res.json())

if __name__ == "__main__":
    print("🚀 Testing EarthLedger Backend...\n")

    test_health()
    test_predict()
    test_weather()
    test_optimize()
    test_simulate()
    test_chat()
    test_dashboard()

    print("\n✅ All tests completed!")
