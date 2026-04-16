import torch
from PIL import Image, ImageFilter
from diffusers import StableDiffusionInpaintPipeline
from config import Settings

_pipe = None
_pipe_device = None


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
    new_w = max(512, (w // 8) * 8)
    new_h = max(512, (h // 8) * 8)

    # keep aspect, but make valid multiples of 8
    if new_w != w or new_h != h:
        return image.resize((new_w, new_h), Image.LANCZOS)
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

    if device == "cuda":
        try:
            pipe.enable_attention_slicing()
        except Exception:
            pass
    else:
        try:
            pipe.enable_attention_slicing()
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
    mask = mask.filter(ImageFilter.MaxFilter(size=15))
    mask = mask.filter(ImageFilter.GaussianBlur(radius=3))
    return mask


def generative_fill(
    input_image: Image.Image,
    mask_image: Image.Image,
    prompt: str,
    negative_prompt: str | None = None,
    strength: float = 0.72,
) -> Image.Image:
    image = input_image.convert("RGB")
    mask = prepare_mask(mask_image)

    original_size = image.size
    image = _normalize_size(image)
    mask = mask.resize(image.size, Image.LANCZOS)

    pipe, device = get_pipe()

    generator = None
    if device == "cuda":
        generator = torch.Generator(device=device).manual_seed(42)
    else:
        generator = torch.Generator().manual_seed(42)

    final_negative = negative_prompt or (
        "low quality, blur, distorted, duplicate, artifacts, text, watermark, "
        "bad anatomy, extra limbs, extra fingers, malformed face, deformed body"
    )

    try:
        result = pipe(
            prompt=(prompt or "").strip(),
            negative_prompt=final_negative,
            image=image,
            mask_image=mask,
            strength=max(0.65, min(float(strength), 0.9)),
            guidance_scale=Settings.INPAINT_GUIDANCE,
            num_inference_steps=Settings.INPAINT_STEPS,
            generator=generator,
        ).images[0]

    except RuntimeError as exc:
        if "CUDA" not in str(exc).upper():
            raise

        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        pipe, _device = rebuild_cpu_pipe()

        result = pipe(
            prompt=(prompt or "").strip(),
            negative_prompt=final_negative,
            image=image,
            mask_image=mask,
            strength=max(0.65, min(float(strength), 0.9)),
            guidance_scale=Settings.INPAINT_GUIDANCE,
            num_inference_steps=Settings.INPAINT_STEPS,
            generator=torch.Generator().manual_seed(42),
        ).images[0]

    result = result.resize(original_size, Image.LANCZOS)
    return result.convert("RGBA")