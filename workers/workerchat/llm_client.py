import json
import httpx

from workerchat.config import settings


VALID_MODES = {"chat", "fast", "code"}


def is_mode_value(value: str | None) -> bool:
    return str(value or "").strip().lower() in VALID_MODES


def resolve_model(mode: str | None = None, explicit_model: str | None = None):
    explicit = str(explicit_model or "").strip()

    if explicit and not is_mode_value(explicit):
        return explicit

    resolved_mode = str(mode or explicit_model or "chat").strip().lower()

    if resolved_mode == "code":
        return settings.OLLAMA_CODE_MODEL

    if resolved_mode == "fast":
        return settings.OLLAMA_FAST_MODEL

    return settings.OLLAMA_CHAT_MODEL


def build_ollama_options(mode: str | None = None):
    resolved_mode = str(mode or "chat").strip().lower()

    if resolved_mode == "fast":
        return {
            "num_predict": min(settings.OLLAMA_NUM_PREDICT, 220),
            "num_ctx": min(settings.OLLAMA_NUM_CTX, 1536),
            "temperature": 0.2,
            "top_p": 0.85,
            "top_k": 30,
            "repeat_penalty": 1.05,
        }

    if resolved_mode == "code":
        return {
            "num_predict": max(settings.OLLAMA_NUM_PREDICT, 700),
            "num_ctx": max(settings.OLLAMA_NUM_CTX, 3072),
            "temperature": 0.15,
            "top_p": 0.9,
            "top_k": 40,
            "repeat_penalty": 1.08,
        }

    return {
        "num_predict": settings.OLLAMA_NUM_PREDICT,
        "num_ctx": settings.OLLAMA_NUM_CTX,
        "temperature": settings.OLLAMA_TEMPERATURE,
        "top_p": settings.OLLAMA_TOP_P,
        "top_k": settings.OLLAMA_TOP_K,
        "repeat_penalty": settings.OLLAMA_REPEAT_PENALTY,
    }


async def stream_chat_completion(messages, model=None, mode=None):
    resolved_model = resolve_model(mode=mode, explicit_model=model)

    payload = {
        "model": resolved_model,
        "messages": messages,
        "stream": True,
        "options": build_ollama_options(mode),
    }

    async with httpx.AsyncClient(
        timeout=None,
        headers={"Content-Type": "application/json"},
    ) as client:
        async with client.stream(
            "POST",
            f"{settings.OLLAMA_URL.rstrip('/')}/api/chat",
            json=payload,
        ) as response:
            try:
                response.raise_for_status()
            except httpx.HTTPStatusError as exc:
                body = ""
                try:
                    raw = await response.aread()
                    body = raw.decode("utf-8", errors="ignore")
                except Exception:
                    pass

                detail = body.strip() or str(exc)
                raise RuntimeError(
                    f"Ollama request failed ({response.status_code}) for "
                    f"{settings.OLLAMA_URL.rstrip('/')}/api/chat using model "
                    f"'{resolved_model}'. Details: {detail}"
                ) from exc

            async for line in response.aiter_lines():
                if not line:
                    continue

                try:
                    data = json.loads(line)
                except json.JSONDecodeError:
                    continue

                if data.get("error"):
                    raise RuntimeError(str(data["error"]))

                token = (data.get("message") or {}).get("content", "")
                if token:
                    yield token

                if data.get("done"):
                    break