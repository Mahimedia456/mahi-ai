import os
from dotenv import load_dotenv

load_dotenv()

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

    INPAINT_STEPS = int(os.getenv("IMAGE_EDITOR_INPAINT_STEPS", "14"))
    INPAINT_GUIDANCE = float(os.getenv("IMAGE_EDITOR_INPAINT_GUIDANCE", "7.5"))

    PYTHON_IMAGE_URL = os.getenv("PYTHON_IMAGE_URL", "http://127.0.0.1:8200")