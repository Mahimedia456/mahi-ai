from __future__ import annotations

import inspect
import signal
import time
import uuid
from pathlib import Path
from typing import Any, Optional, cast

import numpy as np
import torch
from diffusers.pipelines.hunyuan_video.pipeline_hunyuan_video import (
    HunyuanVideoPipeline,
)
from diffusers.utils.export_utils import export_to_video

try:
    from .config import settings
except ImportError:
    from config import settings


DTYPE_MAP = {
    "float16": torch.float16,
    "fp16": torch.float16,
    "bfloat16": torch.bfloat16,
    "bf16": torch.bfloat16,
    "float32": torch.float32,
    "fp32": torch.float32,
}


class VideoStudioGenerator:
    def __init__(self) -> None:
        self.pipe: Optional[HunyuanVideoPipeline] = None
        self.model_id = settings.model_id
        self.device = settings.device
        self.should_stop = False
        self.active_job_id: Optional[str] = None

        signal.signal(signal.SIGINT, self.handle_stop_signal)
        signal.signal(signal.SIGTERM, self.handle_stop_signal)

    def handle_stop_signal(self, *args: Any) -> None:
        print("[VIDEO] Stop signal received")
        self.should_stop = True

    def request_stop(self, job_id: Optional[str] = None) -> bool:
        if job_id is None or self.active_job_id == job_id:
            self.should_stop = True
            return True
        return False

    def clear_stop(self) -> None:
        self.should_stop = False

    def load(self) -> None:
        if self.pipe is not None:
            return

        print(f"[VIDEO] Loading model: {self.model_id}")
        print(f"[VIDEO] Device: {self.device}")

        pipe = cast(
            HunyuanVideoPipeline,
            HunyuanVideoPipeline.from_pretrained(self.model_id),
        )

        if self.device == "cuda" and torch.cuda.is_available():
            pipe.to("cuda")
        else:
            pipe.to("cpu")

        self.pipe = pipe
        print("[VIDEO] Model loaded successfully")

    def generate(
        self,
        *,
        prompt: str,
        fps: int = 8,
        num_frames: int = 17,
        num_inference_steps: int = 8,
        guidance_scale: float = 4.0,
        seed: Optional[int] = None,
        job_id: Optional[str] = None,
    ) -> dict:

        self.load()
        self.active_job_id = job_id

        pipe = self.pipe
        if pipe is None:
            raise RuntimeError("Pipeline not loaded")

        if seed is None:
            seed = int(time.time())

        print("[VIDEO] Starting generation")

        generator = torch.Generator(device="cpu").manual_seed(seed)

        result = pipe(
            prompt=prompt,
            num_frames=num_frames,
            num_inference_steps=num_inference_steps,
            guidance_scale=guidance_scale,
            generator=generator,
        )

        frames = result.frames[0]

        output_dir = Path("./generated_videos")
        output_dir.mkdir(exist_ok=True)

        output_path = output_dir / f"{uuid.uuid4().hex}.mp4"

        # convert to numpy
        frames_np = []
        for frame in frames:
            if isinstance(frame, torch.Tensor):
                frame = frame.cpu().numpy()
            if frame.dtype != np.uint8:
                frame = (frame * 255).clip(0, 255).astype(np.uint8)
            frames_np.append(frame)

        export_to_video(frames_np, str(output_path), fps=fps)

        print("[VIDEO] Video saved:", output_path)

        return {
            "success": True,
            "output_path": str(output_path),
            "file_size_bytes": output_path.stat().st_size,
        }