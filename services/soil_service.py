# =============================================================================
# Soil & Agriculture Data Service — FAO API + Simulated Data
# FAO: https://www.fao.org/faostat/en/#data
# =============================================================================

import os
import requests
import random

FAO_API_BASE = os.getenv("FAO_API_BASE_URL", "https://www.fao.org/faostat/api/v1")


def get_soil_profile(lat: float, lon: float) -> dict:
    """
    Get soil characteristics for a location.
    Uses SoilGrids (ISRIC) — free, no API key needed.
    Docs: https://rest.isric.org/soilgrids/v2.0/docs
    """
    url = "https://rest.isric.org/soilgrids/v2.0/properties/query"
    params = {
        "lon": lon,
        "lat": lat,
        "property": ["clay", "sand", "silt", "phh2o", "soc", "nitrogen"],
        "depth": "0-30cm",
        "value": "mean"
    }

    try:
        resp = requests.get(url, params=params, timeout=15)
        resp.raise_for_status()
        data = resp.json()

        properties = {}
        for layer in data.get("properties", {}).get("layers", []):
            name = layer["name"]
            value = layer["depths"][0]["values"].get("mean", 0)
            unit = layer.get("unit_measure", {}).get("mapped_units", "")
            properties[name] = {"value": value, "unit": unit}

        return {
            "coordinates": {"lat": lat, "lon": lon},
            "properties": properties,
            "source": "ISRIC SoilGrids v2.0",
            "depth": "0-30cm"
        }

    except Exception:
        return _simulated_soil_profile(lat, lon)


def _simulated_soil_profile(lat: float, lon: float) -> dict:
    """Simulated soil profile when API is unavailable."""
    rng = random.Random(lat + lon)

    return {
        "coordinates": {"lat": lat, "lon": lon},
        "properties": {
            "clay": {"value": round(rng.uniform(15, 45), 1), "unit": "%"},
            "sand": {"value": round(rng.uniform(20, 60), 1), "unit": "%"},
            "silt": {"value": round(rng.uniform(10, 35), 1), "unit": "%"},
            "ph": {"value": round(rng.uniform(5.5, 8.5), 1), "unit": "pH"},
            "organic_carbon": {"value": round(rng.uniform(5, 30), 1), "unit": "g/kg"},
            "nitrogen": {"value": round(rng.uniform(0.5, 3.0), 2), "unit": "g/kg"},
        },
        "source": "simulated",
        "depth": "0-30cm"
    }


def get_crop_calendar(country: str = "India", crop: str = "rice") -> dict:
    """
    Get planting/harvesting calendar for a crop in a region.
    Fallback to curated data since FAO API is messy.
    """
    # Curated crop calendars for Indian agriculture
    calendars = {
        "rice": {
            "kharif": {"sowing": "Jun-Jul", "harvesting": "Oct-Nov"},
            "rabi": {"sowing": "Nov-Dec", "harvesting": "Mar-Apr"},
            "season": "Kharif (primary), Rabi (secondary)",
            "water_requirement": "High (1200-2000 mm)",
            "carbon_note": "Rice paddies are major methane emitters — alternate wetting & drying reduces emissions by 30-50%."
        },
        "wheat": {
            "rabi": {"sowing": "Oct-Nov", "harvesting": "Mar-Apr"},
            "season": "Rabi",
            "water_requirement": "Moderate (400-600 mm)",
            "carbon_note": "Wheat stubble burning is a major emission source — mulching retains carbon."
        },
        "maize": {
            "kharif": {"sowing": "Jun-Jul", "harvesting": "Sep-Oct"},
            "season": "Kharif (primary)",
            "water_requirement": "Moderate (500-800 mm)",
            "carbon_note": "Maize residue has excellent carbon sequestration potential when composted."
        },
        "soybean": {
            "kharif": {"sowing": "Jun-Jul", "harvesting": "Oct-Nov"},
            "season": "Kharif",
            "water_requirement": "Moderate (450-700 mm)",
            "carbon_note": "Soybean fixes atmospheric nitrogen, reducing fertilizer emissions substantially."
        }
    }

    crop_data = calendars.get(crop.lower(), calendars["rice"])
    return {"country": country, "crop": crop, **crop_data, "source": "curated (FAO/ICAR)"}


def get_soil_health_score(properties: dict) -> dict:
    """
    Calculate a simplified Soil Health Score (0-100) from soil properties.
    Good for UI display and gamification.
    """
    scores = {}

    # pH scoring (ideal: 6.0-7.5)
    ph = properties.get("ph", {}).get("value", 7.0)
    if 6.0 <= ph <= 7.5:
        scores["ph"] = 100
    elif 5.5 <= ph <= 8.0:
        scores["ph"] = 70
    else:
        scores["ph"] = 40

    # Organic carbon scoring (higher = better)
    oc = properties.get("organic_carbon", {}).get("value", 10)
    scores["organic_carbon"] = min(100, round(oc * 5))

    # Nitrogen scoring
    n = properties.get("nitrogen", {}).get("value", 1.0)
    scores["nitrogen"] = min(100, round(n * 40))

    overall = round(sum(scores.values()) / len(scores))

    return {
        "overall_score": overall,
        "component_scores": scores,
        "grade": "A" if overall >= 75 else "B" if overall >= 50 else "C",
        "recommendation": "Excellent soil health!" if overall >= 75 else "Consider adding organic matter." if overall >= 50 else "Soil needs immediate attention — compost and cover crops recommended."
    }
