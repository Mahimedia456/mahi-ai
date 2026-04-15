import asyncio
from workerchat.tools.serper_search import google_search
from workerchat.tools.page_reader import extract_page_async
from workerchat.tools.rank_sources import rank_sources


async def deep_search(query: str, mode: str | None = "chat"):
    search_results = google_search(query, max_results=2)

    if not search_results:
        return []

    top_results = search_results[:2]

    docs = []
    for result in top_results:
        docs.append(
            {
                "title": result["title"],
                "url": result["url"],
                "snippet": result.get("snippet", ""),
                "content": result.get("snippet", "") or "",
                "engine": result.get("engine", "google-serper"),
            }
        )

    if mode == "fast":
        return rank_sources(docs, query=query)[:2]

    tasks = [extract_page_async(result["url"]) for result in top_results]
    contents = await asyncio.gather(*tasks, return_exceptions=True)

    enriched_docs = []
    for base_doc, content in zip(docs, contents):
        if isinstance(content, Exception) or not content:
            enriched_docs.append(base_doc)
            continue

        enriched_docs.append(
            {
                **base_doc,
                "content": content[:1000],
            }
        )

    return rank_sources(enriched_docs, query=query)[:2]