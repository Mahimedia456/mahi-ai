import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    def __init__(self):
        self.host = os.getenv("IMAGE_STUDIO_HOST", "127.0.0.1")
        self.port = int(os.getenv("IMAGE_STUDIO_PORT", "8400"))
        self.device = os.getenv("IMAGE_STUDIO_DEVICE", "cpu")
        self.torch_dtype = os.getenv("IMAGE_STUDIO_TORCH_DTYPE", "float32")

        # RealVisXL only
        self.model_id = os.getenv("IMAGE_STUDIO_MODEL_ID", "SG161222/RealVisXL_V5.0")

        self.default_width = int(os.getenv("IMAGE_STUDIO_DEFAULT_WIDTH", "512"))
        self.default_height = int(os.getenv("IMAGE_STUDIO_DEFAULT_HEIGHT", "512"))
        self.default_steps = int(os.getenv("IMAGE_STUDIO_DEFAULT_STEPS", "20"))
        self.default_guidance = float(os.getenv("IMAGE_STUDIO_DEFAULT_GUIDANCE", "7.5"))

        self.max_width = int(os.getenv("IMAGE_STUDIO_MAX_WIDTH", "768"))
        self.max_height = int(os.getenv("IMAGE_STUDIO_MAX_HEIGHT", "768"))
        self.enable_cpu_offload = os.getenv("IMAGE_STUDIO_ENABLE_CPU_OFFLOAD", "false").lower() == "true"


settings = Settings()