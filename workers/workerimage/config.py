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


def to_bool(value, default=False):
    if value is None:
        return default
    return str(value).strip().lower() in ("1", "true", "yes", "on")


class Settings:
    HF_TOKEN = os.getenv("HF_TOKEN", "")
    IMAGE_PUBLIC_BASE_URL = os.getenv("IMAGE_PUBLIC_BASE_URL", "http://127.0.0.1:8200")

    IMAGE_DEFAULT_MODEL = os.getenv("IMAGE_DEFAULT_MODEL", "realvisxl")
    REALVISXL_MODEL_ID = os.getenv("REALVISXL_MODEL_ID", "SG161222/RealVisXL_V5.0")
    SDXL_TURBO_MODEL_ID = os.getenv("SDXL_TURBO_MODEL_ID", "stabilityai/sdxl-turbo")
    SDXL_BASE_MODEL_ID = os.getenv(
        "SDXL_BASE_MODEL_ID",
        "stabilityai/stable-diffusion-xl-base-1.0",
    )

    IMAGE_DEFAULT_WIDTH = to_int(os.getenv("IMAGE_DEFAULT_WIDTH"), 1024)
    IMAGE_DEFAULT_HEIGHT = to_int(os.getenv("IMAGE_DEFAULT_HEIGHT"), 1024)
    IMAGE_DEFAULT_STEPS = to_int(os.getenv("IMAGE_DEFAULT_STEPS"), 30)
    IMAGE_DEFAULT_GUIDANCE = to_float(os.getenv("IMAGE_DEFAULT_GUIDANCE"), 6.0)

    IMAGE_MAX_WIDTH = to_int(os.getenv("IMAGE_MAX_WIDTH"), 1024)
    IMAGE_MAX_HEIGHT = to_int(os.getenv("IMAGE_MAX_HEIGHT"), 1024)

    IMAGE_ENABLE_CPU_OFFLOAD = to_bool(os.getenv("IMAGE_ENABLE_CPU_OFFLOAD"), True)


settings = Settings()