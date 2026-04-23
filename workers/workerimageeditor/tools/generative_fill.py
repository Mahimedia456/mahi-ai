from typing import Any, cast
import random

import torch
from PIL import Image, ImageFilter
from diffusers.pipelines.stable_diffusion.pipeline_stable_diffusion_inpaint import (
    StableDiffusionInpaintPipeline,
)

from workerimageeditor.config import Settings

_pipe = None
_pipe_device = None
RESAMPLE = Image.Resampling.LANCZOS


def _best_device() -> str:
    if Settings.DEVICE == "cuda" and torch.cuda.is_available():
        return "cuda"
    return "cpu"


def _best_dtype(device: str):
    if device == "cuda" and Settings.DTYPE == "float16":
        return torch.float16
    return torch.float32


def _normalize_size(image: Image.Image) -> Image.Image:
    w, h = image.size

    new_w = max(512, int(round(w / 8) * 8))
    new_h = max(512, int(round(h / 8) * 8))

    if new_w != w or new_h != h:
        return image.resize((new_w, new_h), RESAMPLE)

    return image


def build_pipe(device: str):
    dtype = _best_dtype(device)

    pipe = StableDiffusionInpaintPipeline.from_pretrained(
        Settings.INPAINT_MODEL,
        torch_dtype=dtype,
        token=Settings.HF_TOKEN or None,
        safety_checker=None,
        requires_safety_checker=False,
    )

    pipe = pipe.to(device)

    try:
        pipe.enable_attention_slicing()
    except Exception:
        pass

    if device == "cuda":
        try:
            pipe.enable_xformers_memory_efficient_attention()
        except Exception:
            pass

    return pipe


def get_pipe():
    global _pipe, _pipe_device

    target_device = _best_device()

    if _pipe is None or _pipe_device != target_device:
        _pipe = build_pipe(target_device)
        _pipe_device = target_device

    return _pipe, _pipe_device


def rebuild_cpu_pipe():
    global _pipe, _pipe_device
    _pipe = build_pipe("cpu")
    _pipe_device = "cpu"
    return _pipe, _pipe_device


def prepare_mask(mask_image: Image.Image) -> Image.Image:
    mask = mask_image.convert("L")
    mask = mask.filter(ImageFilter.MaxFilter(size=21))
    mask = mask.filter(ImageFilter.GaussianBlur(radius=3.2))
    return mask


def _build_negative_prompt(user_negative: str | None = None) -> str:
    base = (
        "low quality, blur, distorted, duplicate, artifacts, text, watermark, "
        "bad anatomy, extra limbs, extra fingers, malformed face, deformed body, "
        "unchanged masked area, empty masked area, invisible object, weak change"
    )

    extra = (user_negative or "").strip()
    if extra:
        return f"{extra}, {base}"

    return base


def _extract_first_image(output: Any) -> Image.Image:
    if hasattr(output, "images"):
        images = getattr(output, "images")
        if isinstance(images, list) and len(images) > 0 and isinstance(images[0], Image.Image):
            return cast(Image.Image, images[0])

    if isinstance(output, tuple) and len(output) > 0:
        first = output[0]
        if isinstance(first, list) and len(first) > 0 and isinstance(first[0], Image.Image):
            return cast(Image.Image, first[0])
        if isinstance(first, Image.Image):
            return cast(Image.Image, first)

    if isinstance(output, list) and len(output) > 0:
        first = output[0]
        if isinstance(first, Image.Image):
            return cast(Image.Image, first)

    if isinstance(output, Image.Image):
        return cast(Image.Image, output)

    raise RuntimeError("Inpainting pipeline did not return a valid PIL image output")


def _prepare_for_change(
    image: Image.Image,
    mask: Image.Image,
) -> Image.Image:
    """
    Masked area ko lightly disturb karte hain taa ke model original
    pixels ko preserve na kare aur visible change kare.
    """
    base = image.convert("RGB")
    mask_l = mask.convert("L")

    disturbed = base.copy()

    px = disturbed.load()
    mpx = mask_l.load()

    if px is None or mpx is None:
        return image.convert("RGB")

    w, h = disturbed.size

    for y in range(h):
        for x in range(w):
            mv = mpx[x, y]
            mv = int(mv[0] if isinstance(mv, tuple) else mv)
            if mv > 150:
                px[x, y] = (
                    random.randint(75, 185),
                    random.randint(75, 185),
                    random.randint(75, 185),
                )

    disturbed = disturbed.filter(ImageFilter.GaussianBlur(radius=1.4))
    return disturbed


def generative_fill(
    input_image: Image.Image,
    mask_image: Image.Image,
    prompt: str,
    negative_prompt: str | None = None,
    strength: float = 0.86,
) -> Image.Image:
    original_image = input_image.convert("RGB")
    prepared_mask = prepare_mask(mask_image)

    original_size = original_image.size

    working_image = _normalize_size(original_image)
    working_mask = prepared_mask.resize(working_image.size, RESAMPLE)

    # Force visible change in masked area
    prepared_image = _prepare_for_change(working_image, working_mask)

    pipe, device = get_pipe()

    generator = (
        torch.Generator(device=device).manual_seed(42)
        if device == "cuda"
        else torch.Generator().manual_seed(42)
    )

    final_prompt = (prompt or "").strip()
    if not final_prompt:
        final_prompt = "high quality realistic visible edit in the masked area"

    final_negative = _build_negative_prompt(negative_prompt)
    final_strength = max(0.82, min(float(strength), 0.95))

    try:
        output = pipe(
            prompt=final_prompt,
            negative_prompt=final_negative,
            image=prepared_image,
            mask_image=working_mask,
            strength=final_strength,
            guidance_scale=Settings.INPAINT_GUIDANCE,
            num_inference_steps=Settings.INPAINT_STEPS,
            generator=generator,
        )
        result: Image.Image = _extract_first_image(output)

    except RuntimeError as exc:
        if "CUDA" not in str(exc).upper():
            raise

        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        pipe, _device = rebuild_cpu_pipe()

        output = pipe(
            prompt=final_prompt,
            negative_prompt=final_negative,
            image=prepared_image,
            mask_image=working_mask,
            strength=final_strength,
            guidance_scale=Settings.INPAINT_GUIDANCE,
            num_inference_steps=Settings.INPAINT_STEPS,
            generator=torch.Generator().manual_seed(42),
        )
        result = _extract_first_image(output)

    result = result.resize(original_size, RESAMPLE)
    return result.convert("RGBA")