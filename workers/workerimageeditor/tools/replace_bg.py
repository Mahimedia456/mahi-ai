from PIL import Image, ImageFilter

from workerimageeditor.config import Settings
from workerimageeditor.tools.remove_bg import remove_background
from workerimage.generator import generate_image_internal


def clamp_dimension(value: int, min_size: int = 512, max_size: int = 768) -> int:
    return min(max(int(value), min_size), max_size)


def generate_background_internal(
    prompt: str,
    negative_prompt: str | None,
    width: int,
    height: int,
) -> Image.Image:
    safe_width = clamp_dimension(
        width,
        Settings.REPLACE_BG_MIN_SIZE,
        Settings.REPLACE_BG_MAX_SIZE,
    )
    safe_height = clamp_dimension(
        height,
        Settings.REPLACE_BG_MIN_SIZE,
        Settings.REPLACE_BG_MAX_SIZE,
    )

    result = generate_image_internal(
        prompt=prompt,
        model="realvisxl",
        width=safe_width,
        height=safe_height,
        steps=Settings.REPLACE_BG_STEPS,
        guidance=Settings.REPLACE_BG_GUIDANCE,
        negative_prompt=negative_prompt
        or (
            "person, portrait, man, woman, face, subject, human, watermark, text, "
            "logo, duplicate subject, blur, distorted scene, extra limbs, bad anatomy"
        ),
        quality="high",
    )

    return result["image"].convert("RGBA")


def soften_subject_edges(subject_rgba: Image.Image) -> Image.Image:
    r, g, b, a = subject_rgba.split()
    a = a.filter(ImageFilter.GaussianBlur(radius=0.8))
    return Image.merge("RGBA", (r, g, b, a))


def composite_subject_over_background(
    subject_rgba: Image.Image,
    background_rgba: Image.Image,
) -> Image.Image:
    bg = background_rgba.convert("RGBA").resize(subject_rgba.size, Image.LANCZOS)
    subject = soften_subject_edges(subject_rgba)
    return Image.alpha_composite(bg, subject)


def replace_background(
    input_image: Image.Image,
    mask_image: Image.Image | None,
    prompt: str,
    negative_prompt: str | None = None,
    strength: float = 0.75,
) -> Image.Image:
    subject = remove_background(input_image)

    background_prompt = (
        prompt.strip()
        if prompt and prompt.strip()
        else "premium beige studio background, soft lighting, realistic shadows"
    )

    background = generate_background_internal(
        prompt=background_prompt,
        negative_prompt=negative_prompt,
        width=input_image.size[0],
        height=input_image.size[1],
    )

    return composite_subject_over_background(subject, background)