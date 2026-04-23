from fastapi import FastAPI, HTTPException
import traceback

try:
    from .generator import VideoStudioGenerator
    from .schemas import GenerateVideoRequest
except ImportError:
    from generator import VideoStudioGenerator
    from schemas import GenerateVideoRequest

app = FastAPI()
generator = VideoStudioGenerator()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/generate_video")
def generate_video(payload: GenerateVideoRequest):
    try:
        prompt = payload.prompt or payload.motionPrompt
        if not prompt:
            raise HTTPException(status_code=400, detail="Prompt required")

        return generator.generate(
            prompt=prompt,
            fps=payload.fps or 8,
            num_inference_steps=payload.steps or 8,
            guidance_scale=payload.guidanceScale or 4,
            job_id=payload.jobId,
        )

    except Exception as e:
        print("[VIDEO] Error occurred")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))