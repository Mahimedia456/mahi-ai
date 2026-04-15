import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parents[1]
ENV_PATH = ROOT_DIR / ".env"

load_dotenv(ENV_PATH, override=True)


def to_int(value, default):
    try:
        return int(value)
    except Exception:
        return default


def to_float(value, default):
    try:
        return float(value)
    except Exception:
        return default


class Settings:
    OLLAMA_URL = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434")

    OLLAMA_CHAT_MODEL = os.getenv("OLLAMA_CHAT_MODEL", "phi3:mini")
    OLLAMA_FAST_MODEL = os.getenv("OLLAMA_FAST_MODEL", "phi3:mini")
    OLLAMA_CODE_MODEL = os.getenv("OLLAMA_CODE_MODEL", "qwen2.5-coder:14b")

    OLLAMA_NUM_PREDICT = to_int(os.getenv("OLLAMA_NUM_PREDICT"), 350)
    OLLAMA_NUM_CTX = to_int(os.getenv("OLLAMA_NUM_CTX"), 2048)
    OLLAMA_TEMPERATURE = to_float(os.getenv("OLLAMA_TEMPERATURE"), 0.2)
    OLLAMA_TOP_P = to_float(os.getenv("OLLAMA_TOP_P"), 0.85)
    OLLAMA_TOP_K = to_int(os.getenv("OLLAMA_TOP_K"), 30)
    OLLAMA_REPEAT_PENALTY = to_float(os.getenv("OLLAMA_REPEAT_PENALTY"), 1.05)

    SERPER_API_KEY = os.getenv("SERPER_API_KEY", "")
    MAX_SEARCH_RESULTS = to_int(os.getenv("MAX_SEARCH_RESULTS"), 2)
    MAX_PAGE_CHARS = to_int(os.getenv("MAX_PAGE_CHARS"), 1000)

    QDRANT_URL = os.getenv("QDRANT_URL", "http://127.0.0.1:6333")
    PYTHON_INGEST_URL = os.getenv("PYTHON_INGEST_URL", "http://127.0.0.1:8300")


settings = Settings()