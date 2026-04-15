from io import BytesIO
import requests
from PIL import Image

from config import Settings
from .remove_bg import remove_background


def generate_background_from_image_worker(prompt: str, width: int, height: int) -> Image.Image:
    payload = {
        "prompt": prompt,
        "width": min(width, 1024),
        "height": min(height, 1024),
        "steps": 22,
        "guidance": 6.5,
        "quality": "high",
        "negativePrompt": "person, portrait, man, woman, face, subject, human, watermark, text, logo, cropped object",
    }

    response = requests.post(
        f"{Settings.PYTHON_IMAGE_URL}/generate_image",
        json=payload,
        timeout=180,
    )
    response.raise_for_status()

    data = response.json()
    image_url = data.get("imageUrl") or data.get("image")

    if not image_url:
        raise RuntimeError("Image worker did not return image URL")

    image_response = requests.get(image_url, timeout=180)
    image_response.raise_for_status()

    return Image.open(BytesIO(image_response.content)).convert("RGBA")


def composite_subject_over_background(subject_rgba: Image.Image, background_rgba: Image.Image) -> Image.Image:
    bg = background_rgba.convert("RGBA").resize(subject_rgba.size)
    return Image.alpha_composite(bg, subject_rgba)


def replace_background(
    input_image: Image.Image,
    mask_image: Image.Image | None,
    prompt: str,
    negative_prompt: str | None = None,
    strength: float = 0.75,
) -> Image.Image:
    subject = remove_background(input_image)

    background_prompt = (
        prompt
        or "luxury outdoor garden area, cinematic premium portrait background, natural sunlight, high detail"
    )

    background = generate_background_from_image_worker(
        prompt=background_prompt,
        width=input_image.size[0],
        height=input_image.size[1],
    )

    return composite_subject_over_background(subject, background)