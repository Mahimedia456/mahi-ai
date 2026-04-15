def rank_sources(docs: list[dict], query: str = ""):
    if not docs:
        return []

    query_words = set((query or "").lower().split())

    def score(doc):
        title = (doc.get("title") or "").lower()
        snippet = (doc.get("snippet") or "").lower()
        content = (doc.get("content") or "").lower()

        title_hits = sum(1 for word in query_words if word and word in title)
        snippet_hits = sum(1 for word in query_words if word and word in snippet)
        body_hits = sum(1 for word in query_words if word and word in content)

        return (title_hits * 5) + (snippet_hits * 2) + body_hits

    return sorted(docs, key=score, reverse=True)[:5]