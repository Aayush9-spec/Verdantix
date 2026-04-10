# =============================================================================
# Voice Service — Google Cloud Speech-to-Text + ElevenLabs Text-to-Speech
# Google Docs:     https://cloud.google.com/speech-to-text/docs
# ElevenLabs Docs: https://docs.elevenlabs.io/api-reference
# =============================================================================

import os
import base64
import requests

# ── Config ───────────────────────────────────────────────────────────────────
GOOGLE_CLOUD_API_KEY = os.getenv("GOOGLE_CLOUD_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")  # Default: Rachel


def speech_to_text(audio_bytes: bytes, language: str = "hi-IN") -> dict:
    """
    Convert audio (WAV/FLAC/OGG) to text using Google Cloud Speech-to-Text.
    
    Supported languages for Indian farmers:
    - "hi-IN" → Hindi (default)
    - "en-IN" → English (India)
    - "mr-IN" → Marathi
    - "pa-IN" → Punjabi
    - "ta-IN" → Tamil
    - "te-IN" → Telugu
    """
    url = f"https://speech.googleapis.com/v1/speech:recognize?key={GOOGLE_CLOUD_API_KEY}"

    # Base64 encode the audio
    audio_content = base64.b64encode(audio_bytes).decode("utf-8")

    payload = {
        "config": {
            "encoding": "LINEAR16",  # Change based on input format
            "sampleRateHertz": 16000,
            "languageCode": language,
            "alternativeLanguageCodes": ["en-IN", "hi-IN"],  # Auto-detect
            "model": "latest_long",
            "enableAutomaticPunctuation": True,
        },
        "audio": {
            "content": audio_content
        }
    }

    resp = requests.post(url, json=payload, timeout=30)
    resp.raise_for_status()
    data = resp.json()

    if "results" in data and data["results"]:
        best = data["results"][0]["alternatives"][0]
        return {
            "transcript": best["transcript"],
            "confidence": round(best.get("confidence", 0), 3),
            "language_detected": language,
            "success": True
        }

    return {"transcript": "", "confidence": 0, "success": False}


def text_to_speech(text: str, voice_id: str = None) -> bytes:
    """
    Convert text to natural speech using ElevenLabs.
    Returns raw audio bytes (mp3).
    
    Great for:
    - Chatbot voice responses
    - Accessibility for farmers who can't read
    """
    vid = voice_id or ELEVENLABS_VOICE_ID

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{vid}"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",  # Supports Hindi!
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.4
        }
    }

    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    resp.raise_for_status()

    return resp.content  # Raw MP3 bytes


def list_elevenlabs_voices() -> list:
    """
    List available ElevenLabs voices.
    Useful for letting user pick a voice in settings.
    """
    url = "https://api.elevenlabs.io/v1/voices"
    headers = {"xi-api-key": ELEVENLABS_API_KEY}

    resp = requests.get(url, headers=headers, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    return [
        {"voice_id": v["voice_id"], "name": v["name"], "labels": v.get("labels", {})}
        for v in data.get("voices", [])
    ]
