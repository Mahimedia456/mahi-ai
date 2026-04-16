import os
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Any

from utils import (
    download_image,
    image_to_png_bytes,
    resize_preview,
    upload_bytes_signed,
)
from tools.remove_bg import remove_background
from tools.upscale import upscale_image
from tools.generative_fill import generative_fill
from tools.replace_bg import replace_background
from tools.erase_object import erase_object
from config import Settings

app = FastAPI(title="Mahi AI Image Editor Worker")


class SignedUpload(BaseModel):
    path: str
    token: str


class EditRequest(BaseModel):
    job_id: str
    tool_type: str
    prompt: Optional[str] = None
    negative_prompt: Optional[str] = None
    input_url: str
    mask_url: Optional[str] = None
    strength: Optional[float] = 0.65
    scale_factor: Optional[int] = 2
    face_enhance: Optional[bool] = False
    denoise: Optional[bool] = False
    meta: Optional[dict[str, Any]] = {}
    output_upload: SignedUpload
    preview_upload: SignedUpload
    bucket: str


@app.get("/health")
def health():
    return {
        "ok": True,
        "service": "image_editor_worker",
        "device": Settings.DEVICE,
        "remove_bg_model": Settings.RMBG_MODEL,
        "inpaint_model": Settings.INPAINT_MODEL,
        "python_image_url": Settings.PYTHON_IMAGE_URL,
    }


@app.post("/edit")
def edit_image(payload: EditRequest):
    try:
        source = download_image(payload.input_url)
        mask = download_image(payload.mask_url) if payload.mask_url else None

        if payload.tool_type == "remove_background":
            result = remove_background(source)

        elif payload.tool_type == "generative_fill":
            if not mask:
                raise HTTPException(status_code=400, detail="mask_url required for generative_fill")

            result = generative_fill(
                input_image=source,
                mask_image=mask,
                prompt=payload.prompt or "high quality realistic seamless fill",
                negative_prompt=payload.negative_prompt,
                strength=payload.strength or 0.72,
            )

        elif payload.tool_type == "replace_background":
            result = replace_background(
                input_image=source,
                mask_image=mask,
                prompt=payload.prompt or "luxury outdoor garden area, cinematic premium portrait background, natural sunlight, high detail",
                negative_prompt=payload.negative_prompt,
                strength=payload.strength or 0.75,
            )

        elif payload.tool_type == "add_object":
            if not mask:
                raise HTTPException(status_code=400, detail="mask_url required for add_object")

            result = generative_fill(
                input_image=source,
                mask_image=mask,
                prompt=payload.prompt or "realistic object inserted naturally with correct perspective, lighting, and shadows",
                negative_prompt=payload.negative_prompt or (
                    "distorted object, floating object, blur, duplicate, bad perspective, watermark, text"
                ),
                strength=payload.strength or 0.8,
            )

        elif payload.tool_type == "erase_element":
            if not mask:
                raise HTTPException(status_code=400, detail="mask_url required for erase_element")

            result = erase_object(
                input_image=source,
                mask_image=mask,
                strength=payload.strength or 0.82,
            )

        elif payload.tool_type == "upscale":
            result = upscale_image(
                source,
                scale_factor=payload.scale_factor or 2,
                denoise=False,
                face_enhance=False,
            )

        elif payload.tool_type == "face_enhance":
            result = upscale_image(
                source,
                scale_factor=payload.scale_factor or 2,
                denoise=False,
                face_enhance=True,
            )

        elif payload.tool_type == "noise_reduction":
            result = upscale_image(
                source,
                scale_factor=payload.scale_factor or 2,
                denoise=True,
                face_enhance=False,
            )

        else:
            raise HTTPException(status_code=400, detail=f"Unsupported tool_type: {payload.tool_type}")

        output_png = image_to_png_bytes(result)
        preview_png = image_to_png_bytes(resize_preview(result, max_size=1024))

        upload_bytes_signed(
            upload_token=payload.output_upload.token,
            bucket=payload.bucket,
            path=payload.output_upload.path,
            payload=output_png,
            content_type="image/png",
        )

        upload_bytes_signed(
            upload_token=payload.preview_upload.token,
            bucket=payload.bucket,
            path=payload.preview_upload.path,
            payload=preview_png,
            content_type="image/png",
        )

        return {
            "ok": True,
            "meta": {
                "tool_type": payload.tool_type,
                "width": result.width,
                "height": result.height,
            },
        }

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))