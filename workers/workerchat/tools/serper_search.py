import requests
from workerchat.config import settings


def google_search(query: str, max_results: int | None = None):
    api_key = settings.SERPER_API_KEY
    if not api_key:
        return []

    url = "https://google.serper.dev/search"
    payload = {
        "q": query,
        "num": max_results or settings.MAX_SEARCH_RESULTS,
    }
    headers = {
        "X-API-KEY": api_key,
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=12)
        response.raise_for_status()
        data = response.json()
    except Exception:
        return []

    results = []
    for item in data.get("organic", []) or []:
        link = item.get("link")
        title = item.get("title")
        snippet = item.get("snippet", "")

        if not link or not title:
            continue

        results.append(
            {
                "title": title,
                "url": link,
                "snippet": snippet,
                "engine": "google-serper",
            }
        )

    return results