from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from config import settings
from generator import ImageStudioGenerator

app = FastAPI(title="Mahi Image Studio Worker")
generator = ImageStudioGenerator()


class GenerateRequest(BaseModel):
    job_id: Optional[str] = None
    prompt: str
    negative_prompt: Optional[str] = None
    exclusion_prompt: Optional[str] = None
    style_key: str = "cinematic"
    aspect_ratio: str = "1:1"
    width: int = 512
    height: int = 512
    steps: int = 8
    guidance_scale: float = 6.0
    sample_count: int = 1
    fidelity_level: str = "STANDARD_01"
    entropy: float = 0.75
    seed: Optional[int] = None


class CancelRequest(BaseModel):
    job_id: Optional[str] = None


@app.get("/health")
async def health():
    return {
        "ok": True,
        "service": "workerimagestudio",
        "model": settings.model_id,
    }


@app.post("/generate")
async def generate(payload: GenerateRequest):
    try:
        return generator.generate(
            job_id=payload.job_id,
            prompt=payload.prompt,
            negative_prompt=payload.negative_prompt,
            exclusion_prompt=payload.exclusion_prompt,
            style_key=payload.style_key,
            width=payload.width,
            height=payload.height,
            steps=payload.steps,
            guidance_scale=payload.guidance_scale,
            sample_count=payload.sample_count,
            fidelity_level=payload.fidelity_level,
            seed=payload.seed,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/cancel")
async def cancel(payload: CancelRequest):
    stopped = generator.request_stop(payload.job_id)
    return {
        "ok": True,
        "stopped": stopped,
        "active_job_id": generator.active_job_id,
    }