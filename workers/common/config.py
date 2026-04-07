import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    VLLM_BASE_URL = os.getenv("VLLM_BASE_URL", "http://127.0.0.1:8000/v1")
    VLLM_API_KEY = os.getenv("VLLM_API_KEY", "mahi-local-key")
    AI_DEFAULT_MODEL = os.getenv("AI_DEFAULT_MODEL", "mahi-chat")

settings = Settings()