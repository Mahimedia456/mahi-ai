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
    HOST = os.getenv("IMAGE_EDITOR_HOST", "127.0.0.1")
    PORT = int(os.getenv("IMAGE_EDITOR_PORT", "8010"))

    DEVICE = os.getenv("IMAGE_EDITOR_DEVICE", "cpu")
    DTYPE = os.getenv("IMAGE_EDITOR_DTYPE", "float32")

    HF_TOKEN = os.getenv("HF_TOKEN", "")
    RMBG_MODEL = os.getenv("IMAGE_EDITOR_RMBG_MODEL", "u2netp")

    INPAINT_MODEL = os.getenv(
        "IMAGE_EDITOR_INPAINT_MODEL",
        "runwayml/stable-diffusion-inpainting",
    )

    INPAINT_STEPS = to_int(os.getenv("IMAGE_EDITOR_INPAINT_STEPS"), 14)
    INPAINT_GUIDANCE = to_float(os.getenv("IMAGE_EDITOR_INPAINT_GUIDANCE"), 7.5)

    REPLACE_BG_MIN_SIZE = to_int(os.getenv("REPLACE_BG_MIN_SIZE"), 512)
    REPLACE_BG_MAX_SIZE = to_int(os.getenv("REPLACE_BG_MAX_SIZE"), 768)
    REPLACE_BG_TIMEOUT = to_int(os.getenv("REPLACE_BG_TIMEOUT"), 600)
    REPLACE_BG_STEPS = to_int(os.getenv("REPLACE_BG_STEPS"), 10)
    REPLACE_BG_GUIDANCE = to_float(os.getenv("REPLACE_BG_GUIDANCE"), 5.5)