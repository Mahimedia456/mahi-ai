from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class GenerateVideoRequest(BaseModel):
    jobId: str
    userId: str
    title: Optional[str] = None

    mode: str
    prompt: Optional[str] = None
    negativePrompt: Optional[str] = None
    motionPrompt: Optional[str] = None

    durationSeconds: float = Field(default=5.0, ge=2.0, le=12.0)
    aspectRatio: str = "16:9"
    fps: int = Field(default=24, ge=8, le=30)
    resolution: str = "720p"

    style: Optional[str] = None
    modelKey: Optional[str] = None
    seed: Optional[int] = None
    guidanceScale: Optional[float] = None
    steps: Optional[int] = None
    motionStrength: int = Field(default=50, ge=0, le=100)

    inputImagePath: Optional[str] = None
    inputImageUrl: Optional[str] = None
    meta: Dict[str, Any] = Field(default_factory=dict)