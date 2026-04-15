import os
import sys

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
WORKERS_DIR = os.path.dirname(CURRENT_DIR)

if WORKERS_DIR not in sys.path:
    sys.path.insert(0, WORKERS_DIR)

from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from workerchat.llm_client import stream_chat_completion
from workerchat.prompts import build_system_prompt
from workerchat.retrieval import search_context, format_retrieved_context
from workerchat.tools.decide_tools import should_use_web_search
from workerchat.tools.deep_search import deep_search

app = FastAPI(title="Mahi AI Chat Worker")


class GenerateRequest(BaseModel):
    history: list = []
    prompt: str
    model: str | None = None
    mode: str | None = "chat"
    userId: str | None = None
    projectId: str | None = None


@app.get("/health")
async def health():
    return {
        "success": True,
        "message": "Mahi AI Python chat worker running",
    }


def build_search_context(docs: list[dict]) -> str:
    if not docs:
        return ""

    blocks = []
    for index, doc in enumerate(docs[:2], start=1):
        title = doc.get("title", "Untitled")
        url = doc.get("url", "")
        snippet = doc.get("snippet", "")
        content = (doc.get("content", "") or "")[:1000]

        block = f"""[{index}] {title}
URL: {url}
Snippet: {snippet}

{content}
"""
        blocks.append(block)

    return "\n\n---\n\n".join(blocks)


@app.post("/generate_stream")
async def generate_stream(payload: GenerateRequest):
    async def token_generator():
        retrieved_chunks = []
        docs = []

        if payload.projectId:
            yield "[[PROGRESS:Checking project knowledge]]"
            try:
                retrieved_chunks = await search_context(
                    payload.prompt,
                    project_id=payload.projectId,
                    limit=4,
                )
            except Exception:
                retrieved_chunks = []

        use_search = should_use_web_search(payload.prompt, payload.mode)

        if use_search:
            yield "[[PROGRESS:Searching web]]"
            docs = await deep_search(payload.prompt, payload.mode)
            yield "[[PROGRESS:Reading sources]]"

        retrieved_context = format_retrieved_context(retrieved_chunks)
        search_context = build_search_context(docs)

        system_prompt = build_system_prompt(
            mode=payload.mode,
            retrieved_context=retrieved_context,
            search_context=search_context,
        )

        trimmed_history = payload.history[-6:] if payload.history else []

        messages = [
            {"role": "system", "content": system_prompt},
            *trimmed_history,
            {"role": "user", "content": payload.prompt},
        ]

        yield "[[PROGRESS:Writing answer]]"

        async for token in stream_chat_completion(
            messages,
            model=payload.model,
            mode=payload.mode,
        ):
            yield token

    return StreamingResponse(
        token_generator(),
        media_type="text/plain; charset=utf-8",
    )