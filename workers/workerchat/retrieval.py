from workerchat.qdrant_store import client


async def search_context(query: str, project_id: str, limit: int = 4):
    try:
        # Yahan apna actual Qdrant search logic rakh sakte ho.
        # Filhal safe fallback taa ke worker boot ho jaye.
        return []
    except Exception:
        return []


def format_retrieved_context(chunks: list[dict]) -> str:
    if not chunks:
        return ""

    blocks = []
    for index, chunk in enumerate(chunks, start=1):
        title = chunk.get("title", f"Chunk {index}")
        content = chunk.get("content", "") or ""
        blocks.append(f"[{index}] {title}\n{content}")

    return "\n\n---\n\n".join(blocks)