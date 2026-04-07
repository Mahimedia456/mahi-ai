from fastapi import FastAPI
from pydantic import BaseModel
from agent_worker.llm_client import generate_chat_completion
from agent_worker.prompts import build_system_prompt

app = FastAPI()

class GenerateRequest(BaseModel):
    history: list = []
    prompt: str
    model: str | None = None

@app.get("/health")
async def health():
    return {
        "success": True,
        "message": "Mahi AI Python agent worker running"
    }

@app.post("/generate")
async def generate(payload: GenerateRequest):
    messages = [
        {
            "role": "system",
            "content": build_system_prompt()
        },
        *payload.history,
        {
            "role": "user",
            "content": payload.prompt
        }
    ]

    result = await generate_chat_completion(
        messages=messages,
        model=payload.model
    )

    content = (
        result.get("choices", [{}])[0]
        .get("message", {})
        .get("content", "")
    )

    return {
        "success": True,
        "data": {
            "content": content,
            "raw": result
        }
    }