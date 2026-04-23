import os
from io import BytesIO
from urllib.parse import quote

import requests
from PIL import Image
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
ENV_PATH = ROOT_DIR / ".env"
load_dotenv(ENV_PATH, override=True)


def download_image(url: str) -> Image.Image:
    response = requests.get(url, timeout=180)
    response.raise_for_status()
    return Image.open(BytesIO(response.content)).convert("RGBA")


def image_to_png_bytes(image: Image.Image) -> bytes:
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


def resize_preview(image: Image.Image, max_size: int = 1024) -> Image.Image:
    preview = image.copy()
    preview.thumbnail((max_size, max_size))
    return preview


def upload_bytes_signed(
    upload_token: str,
    bucket: str,
    path: str,
    payload: bytes,
    content_type: str = "image/png",
):
    supabase_url = os.getenv("SUPABASE_URL", "").strip()
    if not supabase_url:
        raise RuntimeError("SUPABASE_URL missing in python worker")

    url = f"{supabase_url}/storage/v1/object/upload/sign/{bucket}/{quote(path)}?token={upload_token}"

    response = requests.put(
        url,
        data=payload,
        headers={"Content-Type": content_type},
        timeout=180,
    )
    response.raise_for_status()