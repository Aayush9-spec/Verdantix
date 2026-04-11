  # =============================================================================
# AI Chatbot Service — OpenAI + Groq (Dual LLM Support)
# OpenAI Docs: https://platform.openai.com/docs/api-reference
# Groq Docs:   https://console.groq.com/docs
# =============================================================================

import os
import json
import requests
from groq import Groq

# ── Config ───────────────────────────────────────────────────────────────────
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

# Use Groq as default (FREE), fall back to OpenAI
USE_GROQ = bool(GROQ_API_KEY)

# ── System Prompt (THE KILLER FEATURE — tune this) ──────────────────────────
SYSTEM_PROMPT = """You are EarthLedger AI — a smart, friendly agricultural carbon intelligence assistant.

Your expertise:
- Carbon credit calculation and optimization for Indian farmers
- Soil health, crop rotation, and sustainable farming practices
- Weather impact on carbon sequestration
- Government schemes (PM-KISAN, Soil Health Card, etc.)

Rules:
1. Keep answers concise (2-4 sentences max unless asked for detail).
2. Always relate advice back to carbon credits / sustainability.
3. DO NOT use Hinglish. If language is Hindi, use Hindi script exclusively. If English, use English exclusively.
4. Use simple farmer-friendly language, avoid jargon.
5. If unsure, say so honestly — don't hallucinate data.
6. When giving numbers (credits, pricing), clarify they are estimates.

You have access to the user's farm data if provided in the context."""


def chat_with_groq(message: str, context: dict = None, history: list = None, language: str = 'en') -> dict:
    """
    Chat using Groq (FREE tier — llama3/mixtral).
    """
    client = Groq(api_key=GROQ_API_KEY)

    lang_instruction = "IMPORTANT: You must respond ONLY in Hindi." if language == 'hi' else "IMPORTANT: You must respond ONLY in English."
    messages = [{"role": "system", "content": f"{SYSTEM_PROMPT}\n\n{lang_instruction}"}]

    # Inject farm context if available
    if context:
        messages.append({
            "role": "system",
            "content": f"User's farm data context: {json.dumps(context)}"
        })

    # Add conversation history for multi-turn
    if history:
        messages.extend(history[-6:])  # Keep last 6 messages to save tokens

    messages.append({"role": "user", "content": message})

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=messages,
        temperature=0.7,
        max_tokens=500,
    )

    reply = response.choices[0].message.content
    return {
        "reply": reply,
        "model": GROQ_MODEL,
        "provider": "groq",
        "tokens_used": response.usage.total_tokens if response.usage else 0
    }


def chat_with_openai(message: str, context: dict = None, history: list = None, language: str = 'en') -> dict:
    """
    Chat using OpenAI GPT (paid, higher quality).
    """
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }

    lang_instruction = "IMPORTANT: You must respond ONLY in Hindi." if language == 'hi' else "IMPORTANT: You must respond ONLY in English."
    messages = [{"role": "system", "content": f"{SYSTEM_PROMPT}\n\n{lang_instruction}"}]

    if context:
        messages.append({
            "role": "system",
            "content": f"User's farm data context: {json.dumps(context)}"
        })

    if history:
        messages.extend(history[-6:])

    messages.append({"role": "user", "content": message})

    payload = {
        "model": OPENAI_MODEL,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 500
    }

    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    resp.raise_for_status()
    data = resp.json()

    reply = data["choices"][0]["message"]["content"]
    return {
        "reply": reply,
        "model": OPENAI_MODEL,
        "provider": "openai",
        "tokens_used": data["usage"]["total_tokens"]
    }


def chat(message: str, context: dict = None, history: list = None, language: str = 'en') -> dict:
    """
    Unified chat function — auto-selects Groq (free) or OpenAI.
    """
    try:
        if USE_GROQ:
            return chat_with_groq(message, context, history, language)
        elif OPENAI_API_KEY:
            return chat_with_openai(message, context, history, language)
        else:
            return {
                "reply": "⚠️ No AI provider configured. Please set GROQ_API_KEY or OPENAI_API_KEY in .env",
                "model": "none",
                "provider": "fallback",
                "tokens_used": 0
            }
    except Exception as e:
        return {
            "reply": f"AI service temporarily unavailable. Error: {str(e)}",
            "model": "error",
            "provider": "error",
            "tokens_used": 0
        }
