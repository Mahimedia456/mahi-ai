import re

SEARCH_KEYWORDS = {
    "search",
    "find",
    "latest",
    "recent",
    "current",
    "news",
    "price",
    "pricing",
    "company",
    "website",
    "brand",
    "firmware",
    "update",
    "downgrade",
    "release",
    "version",
    "specs",
    "camera",
    "monitor",
    "recorder",
    "device",
    "product",
    "model",
    "support",
    "manual",
    "documentation",
    "download",
    "driver",
    "compatibility",
    "install",
}

NO_SEARCH_PATTERNS = [
    r"^write\b",
    r"^rewrite\b",
    r"^improve\b",
    r"^fix this code\b",
    r"^translate\b",
    r"^summarize\b",
    r"^make a post\b",
    r"^draft\b",
]


def should_use_web_search(prompt: str, mode: str | None = None) -> bool:
    text = (prompt or "").strip().lower()
    if not text:
        return False

    if mode == "code":
        return False

    for pattern in NO_SEARCH_PATTERNS:
        if re.search(pattern, text):
            return False

    if any(keyword in text for keyword in SEARCH_KEYWORDS):
        return True

    if len(text.split()) <= 10:
        return True

    return False