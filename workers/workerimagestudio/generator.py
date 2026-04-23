import io
import time
import base64
import random
import signal
from typing import Any

import torch
from diffusers.pipelines.auto_pipeline import AutoPipelineForText2Image
from diffusers.schedulers.scheduling_dpmsolver_multistep import DPMSolverMultistepScheduler

from config import settings
from presets import PRESET_PROMPT_PREFIX, FIDELITY_STEP_MULTIPLIER


class ImageStudioGenerator:
    def __init__(self):
        self.pipe: Any = None
        self.model_id = settings.model_id
        self.device = settings.device
        self.should_stop = False
        self.active_job_id = None

        signal.signal(signal.SIGINT, self.handle_stop_signal)
        signal.signal(signal.SIGTERM, self.handle_stop_signal)

    def handle_stop_signal(self, *args):
        print("🛑 Image Studio generation stopped manually")
        self.should_stop = True

    def request_stop(self, job_id=None):
        if job_id is None or self.active_job_id == job_id:
            self.should_stop = True
            return True
        return False

    def clear_stop(self):
        self.should_stop = False

    def load(self):
        if self.pipe is not None:
            return self.pipe

        dtype = torch.float16 if settings.torch_dtype == "float16" else torch.float32

        kwargs = {
            "torch_dtype": dtype,
            "use_safetensors": True,
        }

        if dtype == torch.float16:
            kwargs["variant"] = "fp16"

        # RealVisXL only
        self.pipe = AutoPipelineForText2Image.from_pretrained(
            self.model_id,
            **kwargs,
        )

        self.pipe.scheduler = DPMSolverMultistepScheduler.from_config(
            self.pipe.scheduler.config
        )

        if settings.device == "cpu":
            self.pipe = self.pipe.to("cpu")
        else:
            self.pipe = self.pipe.to(settings.device)
            if settings.enable_cpu_offload:
                try:
                    self.pipe.enable_model_cpu_offload()
                except Exception:
                    pass

        return self.pipe

    def _build_prompt(self, prompt, style_key, exclusion_prompt=None):
        prefix = PRESET_PROMPT_PREFIX.get(style_key, PRESET_PROMPT_PREFIX["cinematic"])
        full_prompt = f"{prefix}, {prompt}".strip(", ")

        if exclusion_prompt:
            full_prompt = f"{full_prompt}. Avoid: {exclusion_prompt}"

        return full_prompt

    def generate(
        self,
        job_id=None,
        prompt="",
        negative_prompt=None,
        exclusion_prompt=None,
        style_key="cinematic",
        width=512,
        height=512,
        steps=20,
        guidance_scale=7.5,
        sample_count=1,
        fidelity_level="STANDARD_01",
        seed=None,
    ):
        self.clear_stop()
        self.active_job_id = job_id

        pipe = self.load()

        width = min(width, settings.max_width)
        height = min(height, settings.max_height)

        multiplier = FIDELITY_STEP_MULTIPLIER.get(fidelity_level, 1.0)
        actual_steps = max(1, int(steps * multiplier))
        final_prompt = self._build_prompt(prompt, style_key, exclusion_prompt)

        started_at = time.time()
        outputs = []

        try:
            for index in range(sample_count):
                if self.should_stop:
                    raise RuntimeError("Generation cancelled by user.")

                current_seed = (
                    seed + index if seed is not None else random.randint(0, 2147483647)
                )

                generator = torch.Generator(device="cpu").manual_seed(current_seed)
                if settings.device != "cpu":
                    generator = torch.Generator(device=settings.device).manual_seed(current_seed)

                result = pipe(
                    prompt=final_prompt,
                    negative_prompt=negative_prompt,
                    width=width,
                    height=height,
                    num_inference_steps=actual_steps,
                    guidance_scale=guidance_scale,
                    generator=generator,
                )

                if self.should_stop:
                    raise RuntimeError("Generation cancelled by user.")

                image = result.images[0].convert("RGB")
                buffer = io.BytesIO()
                image.save(buffer, format="PNG")

                outputs.append(
                    {
                        "base64": base64.b64encode(buffer.getvalue()).decode("utf-8"),
                        "width": image.width,
                        "height": image.height,
                        "seed": current_seed,
                        "model": self.model_id,
                    }
                )

            latency_ms = int((time.time() - started_at) * 1000)

            return {
                "model": self.model_id,
                "latency_ms": latency_ms,
                "outputs": outputs,
            }
        finally:
            self.active_job_id = None
            self.clear_stop()