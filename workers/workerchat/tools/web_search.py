from duckduckgo_search import DDGS


def web_search(query, max_results=5):
    results = []

    with DDGS() as ddgs:
        for r in ddgs.text(query, max_results=max_results):
            results.append(
                {
                    "title": r["title"],
                    "url": r["href"],
                    "snippet": r["body"],
                }
            )

    return results