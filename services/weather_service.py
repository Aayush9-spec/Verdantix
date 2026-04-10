# =============================================================================
# Weather Service — OpenWeather API Integration
# Docs: https://openweathermap.org/api/one-call-3
# =============================================================================

import os
import requests

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5"


def get_current_weather(lat: float, lon: float) -> dict:
    """
    Fetch current weather for a given lat/lon.
    Returns temperature (°C), humidity (%), rainfall, wind, and description.
    """
    url = f"{BASE_URL}/weather"
    params = {
        "lat": lat,
        "lon": lon,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"  # Celsius
    }

    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    return {
        "temperature": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"],
        "humidity": data["main"]["humidity"],
        "pressure": data["main"]["pressure"],
        "wind_speed": data["wind"]["speed"],
        "description": data["weather"][0]["description"],
        "icon": data["weather"][0]["icon"],
        "rainfall_1h": data.get("rain", {}).get("1h", 0),
        "clouds": data["clouds"]["all"],
        "city": data.get("name", "Unknown"),
        "country": data.get("sys", {}).get("country", ""),
    }


def get_5day_forecast(lat: float, lon: float) -> list:
    """
    Fetch 5-day / 3-hour forecast.
    Returns simplified list of forecasts.
    """
    url = f"{BASE_URL}/forecast"
    params = {
        "lat": lat,
        "lon": lon,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }

    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    forecasts = []
    for item in data["list"]:
        forecasts.append({
            "datetime": item["dt_txt"],
            "temp": item["main"]["temp"],
            "humidity": item["main"]["humidity"],
            "description": item["weather"][0]["description"],
            "rain_3h": item.get("rain", {}).get("3h", 0),
            "wind": item["wind"]["speed"],
        })

    return forecasts


def generate_agri_recommendations(weather: dict) -> list:
    """
    Generate agriculture-specific tips based on live weather data.
    This replaces the old deterministic mock.
    """
    tips = []
    temp = weather["temperature"]
    hum = weather["humidity"]
    rain = weather["rainfall_1h"]

    if temp > 40:
        tips.append("🔥 Extreme heat — avoid midday watering, use mulch to retain soil moisture.")
    elif temp > 35:
        tips.append("☀️ High temperature — consider drip irrigation to reduce water loss.")
    elif temp < 10:
        tips.append("❄️ Cold snap expected — protect seedlings with row covers.")

    if hum > 85:
        tips.append("💧 Very high humidity — monitor crops for fungal diseases (blight, mildew).")
    elif hum < 30:
        tips.append("🏜️ Low humidity — increase watering frequency to prevent wilting.")

    if rain > 50:
        tips.append("🌧️ Heavy rain expected — ensure proper field drainage to avoid waterlogging.")
    elif rain > 10:
        tips.append("🌦️ Moderate rain — good conditions, reduce manual irrigation.")
    elif rain == 0:
        tips.append("☁️ No rain expected — plan irrigation schedule accordingly.")

    tips.append("🌱 Maintain organic soil cover for optimal carbon sequestration.")

    return tips[:5]
