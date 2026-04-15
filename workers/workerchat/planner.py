def plan_task(prompt: str):
    text = (prompt or "").lower()

    if "search" in text or "latest" in text or "current" in text:
        return {"agent": "research", "tool": "web_search"}

    if "calculate" in text:
        return {"agent": "tool", "tool": "calculator"}

    if any(word in text for word in ("code", "bug", "error", "fix", "refactor")):
        return {"agent": "coder"}

    return {"agent": "writer"}