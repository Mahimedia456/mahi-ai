import httpx
import trafilatura

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}


async def extract_page_async(url: str):
    try:
        async with httpx.AsyncClient(
            headers=HEADERS,
            follow_redirects=True,
            timeout=httpx.Timeout(2.2, connect=1.2),
        ) as client:
            response = await client.get(url)

        if response.status_code != 200:
            return ""

        extracted = trafilatura.extract(
            response.text,
            include_comments=False,
            include_tables=False,
            include_links=False,
        )

        if extracted:
            return extracted[:1000]

    except Exception:
        pass

    return ""