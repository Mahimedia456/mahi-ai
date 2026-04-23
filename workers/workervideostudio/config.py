from dataclasses import dataclass
import os


def _bool(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _int(name: str, default: int) -> int:
    value = os.getenv(name)
    if value is None or value == "":
        return default
    return int(value)


def _float(name: str, default: float) -> float:
    value = os.getenv(name)
    if value is None or value == "":
        return default
    return float(value)


@dataclass
class VideoStudioSettings:
    model_id: str = os.getenv(
        "VIDEO_STUDIO_MODEL_ID",
        "hunyuanvideo-community/HunyuanVideo",
    )
    device: str = os.getenv("VIDEO_STUDIO_DEVICE", "cpu").lower()
    dtype: str = os.getenv("VIDEO_STUDIO_DTYPE", "float32").lower()
    output_dir: str = os.getenv("VIDEO_STUDIO_OUTPUT_DIR", "./generated_videos")

    fps: int = _int("VIDEO_STUDIO_FPS", 16)
    num_frames: int = _int("VIDEO_STUDIO_NUM_FRAMES", 49)
    num_inference_steps: int = _int("VIDEO_STUDIO_STEPS", 30)
    guidance_scale: float = _float("VIDEO_STUDIO_GUIDANCE", 6.0)

    height: int = _int("VIDEO_STUDIO_HEIGHT", 720)
    width: int = _int("VIDEO_STUDIO_WIDTH", 1280)

    enable_cpu_offload: bool = _bool("VIDEO_STUDIO_ENABLE_CPU_OFFLOAD", True)
    enable_vae_tiling: bool = _bool("VIDEO_STUDIO_ENABLE_VAE_TILING", True)
    enable_vae_slicing: bool = _bool("VIDEO_STUDIO_ENABLE_VAE_SLICING", True)


settings = VideoStudioSettings()