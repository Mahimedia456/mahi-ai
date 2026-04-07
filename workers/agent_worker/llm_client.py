import httpx
from common.config import settings

async def generate_chat_completion(messages, model=None):
    payload = {
        "model": model or settings.AI_DEFAULT_MODEL,
        "messages": messages,
        "temperature": 0.7,
        "stream": False,
    }

    headers = {
        "Authorization": f"Bearer {settings.VLLM_API_KEY}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            f"{settings.VLLM_BASE_URL}/chat/completions",
            json=payload,
            headers=headers,
        )
        response.raise_for_status()
        return response.json()