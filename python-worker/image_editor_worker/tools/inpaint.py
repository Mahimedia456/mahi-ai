import torch
from PIL import Image
from diffusers import AutoPipelineForInpainting
from config import Settings

_pipeline = None

def get_pipeline():
    global _pipeline
    if _pipeline is None:
        dtype = torch.float16 if Settings.TORCH_DTYPE == "float16" else torch.float32
        _pipeline = AutoPipelineForInpainting.from_pretrained(
            Settings.INPAINT_MODEL,
            torch_dtype=dtype,
            variant="fp16" if dtype == torch.float16 else None,
        )
        _pipeline = _pipeline.to(Settings.DEVICE)
    return _pipeline

def inpaint_image(
    input_image: Image.Image,
    mask_image: Image.Image,
    prompt: str,
    negative_prompt: str | None = None,
    strength: float = 0.65
) -> Image.Image:
    pipe = get_pipeline()

    base = input_image.convert("RGB")
    mask = mask_image.convert("L")

    result = pipe(
        prompt=prompt or "",
        negative_prompt=negative_prompt or None,
        image=base,
        mask_image=mask,
        strength=strength,
        guidance_scale=7.5,
        num_inference_steps=30,
    ).images[0]

    return result.convert("RGBA")