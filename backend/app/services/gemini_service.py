import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY is not configured")

# Models in priority order — tested working models first
MODELS_TO_TRY = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
]


def ask_gemini(prompt: str) -> str:
    last_error = None

    for model_name in MODELS_TO_TRY:
        for attempt in range(2):
            try:
                url = (
                    f"https://generativelanguage.googleapis.com/v1beta/models/"
                    f"{model_name}:generateContent?key={API_KEY}"
                )
                payload = {"contents": [{"parts": [{"text": prompt}]}]}
                headers = {"Content-Type": "application/json"}

                response = requests.post(
                    url, json=payload, headers=headers, timeout=25
                )

                if response.status_code == 200:
                    data = response.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        content = candidates[0].get("content", {})
                        parts = content.get("parts", [])
                        if parts:
                            return parts[0].get("text", "")

                err_str = response.text.lower()
                last_error = Exception(
                    f"HTTP {response.status_code} ({model_name}): {response.text[:200]}"
                )

                # Quota / Not Found → skip to next model immediately
                if response.status_code in (429, 404) or any(
                    kw in err_str for kw in ["quota", "exhausted", "no longer available", "not found"]
                ):
                    print(
                        f"[Gemini] {model_name} unavailable "
                        f"({response.status_code}), trying next model..."
                    )
                    break

                # Transient server error → retry with backoff
                if response.status_code == 503 or any(
                    kw in err_str for kw in ["unavailable", "demand"]
                ):
                    time.sleep(1 + attempt * 1.5)
                    continue

                break  # Other errors → skip model

            except requests.exceptions.Timeout:
                last_error = Exception(f"Timeout on {model_name}")
                break
            except requests.exceptions.RequestException as e:
                last_error = e
                time.sleep(1)
                continue

    raise RuntimeError(
        f"Gemini API unavailable across all models. "
        f"Last error: {str(last_error)}"
    )