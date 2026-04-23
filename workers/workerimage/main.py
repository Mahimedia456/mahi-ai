import os
import sys
import warnings

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
WORKERS_DIR = os.path.dirname(CURRENT_DIR)

if WORKERS_DIR not in sys.path:
    sys.path.insert(0, WORKERS_DIR)

warnings.filterwarnings(
    "ignore",
    message=".*Siglip2ImageProcessorFast.*",
)

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from typing import Optional

from workerimage.generator import (
    OUTPUT_DIR,
    device,
    dtype,
    model_manager,
    generate_image_internal,
    save_generated_image,
)
from workerimage.config import settings

app = FastAPI(title="Mahi AI Image Worker - RealVisXL")
app.mount("/images", StaticFiles(directory=OUTPUT_DIR), name="images")


class ImageRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    model: str = "realvisxl"
    width: int = 1024
    height: int = 1024
    steps: int = 30
    guidance: float = 6.0
    seed: Optional[int] = None
    negativePrompt: Optional[str] = ""
    quality: str = "high"


@app.get("/health")
async def health():
    return {
        "success": True,
        "message": "Mahi AI Python image worker running",
        "device": device,
        "dtype": str(dtype),
        "default_model": settings.IMAGE_DEFAULT_MODEL,
        "loaded_models": list(model_manager._models.keys()),
        "output_dir": OUTPUT_DIR,
    }


@app.post("/generate_image")
async def generate_image(data: ImageRequest):
    try:
        result = generate_image_internal(
            prompt=data.prompt,
            model=data.model,
            width=data.width,
            height=data.height,
            steps=data.steps,
            guidance=data.guidance,
            seed=data.seed,
            negative_prompt=data.negativePrompt,
            quality=data.quality,
        )

        save_info = save_generated_image(result["image"])

        return {
            "success": True,
            "image": save_info["image"],
            "imageUrl": save_info["imageUrl"],
            "model": result["model"],
            "modelId": result["modelId"],
            "width": result["width"],
            "height": result["height"],
            "steps": result["steps"],
            "guidance": result["guidance"],
            "quality": result["quality"],
            "seed": result["seed"],
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc