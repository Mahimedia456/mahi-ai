import torch
from PIL import Image, ImageFilter
from diffusers import StableDiffusionInpaintPipeline
from config import Settings

_pipe = None
_pipe_device = None


def build_pipe(device: str):
    dtype = torch.float16 if device == "cuda" and Settings.DTYPE == "float16" else torch.float32

    pipe = StableDiffusionInpaintPipeline.from_pretrained(
        Settings.INPAINT_MODEL,
        torch_dtype=dtype,
        token=Settings.HF_TOKEN or None,
        use_safetensors=False,
        safety_checker=None,
        requires_safety_checker=False,
    )

    pipe = pipe.to(device)
    return pipe


def get_pipe():
    global _pipe, _pipe_device

    target_device = "cuda" if Settings.DEVICE == "cuda" and torch.cuda.is_available() else "cpu"

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
    mask = mask.filter(ImageFilter.MaxFilter(size=13))
    mask = mask.filter(ImageFilter.GaussianBlur(radius=2.5))
    return mask


def generative_fill(
    input_image: Image.Image,
    mask_image: Image.Image,
    prompt: str,
    negative_prompt: str | None = None,
    strength: float = 0.7,
) -> Image.Image:
    image = input_image.convert("RGB")
    mask = prepare_mask(mask_image)

    pipe, _device = get_pipe()

    try:
        result = pipe(
            prompt=prompt or "",
            negative_prompt=negative_prompt or "low quality, blur, distorted, duplicate, artifacts, text, watermark",
            image=image,
            mask_image=mask,
            strength=float(strength),
            guidance_scale=Settings.INPAINT_GUIDANCE,
            num_inference_steps=Settings.INPAINT_STEPS,
        ).images[0]
        return result.convert("RGBA")

    except RuntimeError as exc:
        if "CUDA" not in str(exc).upper():
            raise

        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        pipe, _device = rebuild_cpu_pipe()

        result = pipe(
            prompt=prompt or "",
            negative_prompt=negative_prompt or "low quality, blur, distorted, duplicate, artifacts, text, watermark",
            image=image,
            mask_image=mask,
            strength=float(strength),
            guidance_scale=Settings.INPAINT_GUIDANCE,
            num_inference_steps=Settings.INPAINT_STEPS,
        ).images[0]

        return result.convert("RGBA")