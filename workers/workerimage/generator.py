import os
import sys
import uuid
import logging
import traceback
import warnings
from contextlib import nullcontext
from threading import Lock
from typing import Optional

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
WORKERS_DIR = os.path.dirname(CURRENT_DIR)

if WORKERS_DIR not in sys.path:
    sys.path.insert(0, WORKERS_DIR)

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

warnings.filterwarnings("ignore", message=".*position_ids.*")
warnings.filterwarnings("ignore", message=".*requires torchvision.*")
warnings.filterwarnings("ignore", message=".*cache-system uses symlinks by default.*")

logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("diffusers").setLevel(logging.ERROR)
logging.getLogger("huggingface_hub").setLevel(logging.ERROR)

import torch
from diffusers import AutoPipelineForText2Image

from workerimage.config import settings

OUTPUT_DIR = os.path.join(WORKERS_DIR, "generated_images")
os.makedirs(OUTPUT_DIR, exist_ok=True)

device = "cuda" if torch.cuda.is_available() else "cpu"


def resolve_torch_dtype():
    if device != "cuda":
        return torch.float32

    try:
        major, _minor = torch.cuda.get_device_capability(0)
        if major >= 8:
            return torch.bfloat16
    except Exception:
        pass

    return torch.float16


dtype = resolve_torch_dtype()


class ModelManager:
    def __init__(self):
        self._models = {}
        self._lock = Lock()

    def _resolve_alias(self, requested_model: str):
        value = (requested_model or settings.IMAGE_DEFAULT_MODEL).strip().lower()

        if value in (
            "realvisxl",
            "realvis",
            "realvis xl",
            settings.REALVISXL_MODEL_ID.lower(),
        ):
            return "realvisxl", settings.REALVISXL_MODEL_ID

        if value in (
            "sdxl-turbo",
            "sdxl turbo",
            settings.SDXL_TURBO_MODEL_ID.lower(),
        ):
            return "sdxl-turbo", settings.SDXL_TURBO_MODEL_ID

        if value in (
            "sdxl-base",
            "sdxl base",
            settings.SDXL_BASE_MODEL_ID.lower(),
        ):
            return "sdxl-base", settings.SDXL_BASE_MODEL_ID

        return "realvisxl", settings.REALVISXL_MODEL_ID

    def _load_pipeline(self, alias: str, model_id: str):
        print("Loading model:", alias, "=>", model_id)
        print("Device:", device)
        print("Dtype:", dtype)

        pretrained_kwargs = {
            "torch_dtype": dtype,
            "token": settings.HF_TOKEN or None,
        }

        if device == "cuda" and dtype == torch.float16:
            pretrained_kwargs["variant"] = "fp16"

        pipe = AutoPipelineForText2Image.from_pretrained(
            model_id,
            **pretrained_kwargs,
        )

        if device == "cuda":
            if settings.IMAGE_ENABLE_CPU_OFFLOAD:
                pipe.enable_model_cpu_offload()
            else:
                pipe = pipe.to(device)

            try:
                pipe.vae.enable_slicing()
            except Exception:
                pass
        else:
            pipe = pipe.to("cpu")

        return pipe

    def get_pipeline(self, requested_model: str):
        alias, model_id = self._resolve_alias(requested_model)

        if alias in self._models:
            return alias, model_id, self._models[alias]

        with self._lock:
            if alias in self._models:
                return alias, model_id, self._models[alias]

            pipe = self._load_pipeline(alias, model_id)
            self._models[alias] = pipe
            return alias, model_id, pipe


model_manager = ModelManager()


def clamp(value, min_value, max_value):
    return max(min_value, min(int(value), max_value))


def normalize_dimensions(width: int, height: int):
    width = clamp(width, 512, settings.IMAGE_MAX_WIDTH)
    height = clamp(height, 512, settings.IMAGE_MAX_HEIGHT)

    width = (width // 8) * 8
    height = (height // 8) * 8

    width = max(width, 512)
    height = max(height, 512)

    return width, height


def resolve_generation_params(width: int, height: int, steps: int, guidance: float, quality: str):
    width, height = normalize_dimensions(width, height)

    steps = clamp(steps or settings.IMAGE_DEFAULT_STEPS, 1, 50)
    guidance = float(guidance if guidance is not None else settings.IMAGE_DEFAULT_GUIDANCE)

    if quality == "fast":
        steps = min(steps, 18)
        guidance = min(guidance, 5.5)
    else:
        steps = max(steps, 24)

    return {
        "width": width,
        "height": height,
        "steps": steps,
        "guidance": guidance,
        "quality": quality or "high",
    }


def generate_image_internal(
    prompt: str,
    model: str = "realvisxl",
    width: int = 1024,
    height: int = 1024,
    steps: int = 30,
    guidance: float = 6.0,
    seed: Optional[int] = None,
    negative_prompt: Optional[str] = "",
    quality: str = "high",
):
    prompt = (prompt or "").strip()
    if not prompt:
        raise ValueError("Prompt is required")

    resolved_alias, model_id, pipe = model_manager.get_pipeline(model)
    params = resolve_generation_params(width, height, steps, guidance, quality)

    generator = None
    if seed is not None:
        generator_device = "cpu" if device == "cuda" else device
        generator = torch.Generator(generator_device).manual_seed(int(seed))

    inference_context = (
        torch.autocast("cuda", dtype=dtype) if device == "cuda" else nullcontext()
    )

    try:
        with torch.inference_mode():
            with inference_context:
                image = pipe(
                    prompt=prompt,
                    negative_prompt=(negative_prompt or "").strip() or None,
                    width=params["width"],
                    height=params["height"],
                    num_inference_steps=params["steps"],
                    guidance_scale=params["guidance"],
                    generator=generator,
                ).images[0]
    except Exception as exc:
        print("IMAGE GENERATION ERROR:")
        traceback.print_exc()
        raise RuntimeError(f"Image generation failed: {exc}") from exc

    return {
        "image": image,
        "model": resolved_alias,
        "modelId": model_id,
        "width": params["width"],
        "height": params["height"],
        "steps": params["steps"],
        "guidance": params["guidance"],
        "quality": params["quality"],
        "seed": seed,
    }


def save_generated_image(image):
    filename = f"{uuid.uuid4().hex}.png"
    path = os.path.join(OUTPUT_DIR, filename)
    image.save(path)
    base_url = settings.IMAGE_PUBLIC_BASE_URL.rstrip("/")
    image_url = f"{base_url}/images/{filename}"
    return {
        "filename": filename,
        "path": path,
        "imageUrl": image_url,
        "image": image_url,
    }