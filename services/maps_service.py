# =============================================================================
# Maps & Geolocation Service — Mapbox API Integration
# Docs: https://docs.mapbox.com/api/
# =============================================================================

import os
import requests

MAPBOX_ACCESS_TOKEN = os.getenv("MAPBOX_ACCESS_TOKEN")
BASE_URL = "https://api.mapbox.com"


def reverse_geocode(lat: float, lon: float) -> dict:
    """
    Convert lat/lon to a human-readable address.
    Useful for displaying farmer's location context.
    """
    url = f"{BASE_URL}/geocoding/v5/mapbox.places/{lon},{lat}.json"
    params = {
        "access_token": MAPBOX_ACCESS_TOKEN,
        "types": "place,region,country",
        "limit": 1
    }

    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    if data["features"]:
        feature = data["features"][0]
        return {
            "place_name": feature["place_name"],
            "region": next((c["text"] for c in feature.get("context", []) if "region" in c["id"]), ""),
            "country": next((c["text"] for c in feature.get("context", []) if "country" in c["id"]), ""),
            "coordinates": {"lat": lat, "lon": lon}
        }

    return {"place_name": "Unknown", "coordinates": {"lat": lat, "lon": lon}}


def forward_geocode(place_name: str) -> dict:
    """
    Convert a place name (e.g. 'Pune, India') to lat/lon.
    Used when farmer types a location instead of using GPS.
    """
    url = f"{BASE_URL}/geocoding/v5/mapbox.places/{place_name}.json"
    params = {
        "access_token": MAPBOX_ACCESS_TOKEN,
        "limit": 1,
        "country": "IN"  # Bias to India
    }

    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    if data["features"]:
        coords = data["features"][0]["center"]
        return {
            "place_name": data["features"][0]["place_name"],
            "lat": coords[1],
            "lon": coords[0]
        }

    return None


def get_mapbox_static_map_url(lat: float, lon: float, zoom: int = 12, width: int = 600, height: int = 400) -> str:
    """
    Generate a static map image URL for embedding in responses or dashboards.
    """
    return (
        f"{BASE_URL}/styles/v1/mapbox/satellite-streets-v12/static/"
        f"pin-l+22c55e({lon},{lat})/{lon},{lat},{zoom}/{width}x{height}@2x"
        f"?access_token={MAPBOX_ACCESS_TOKEN}"
    )
