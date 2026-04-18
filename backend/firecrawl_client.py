import asyncio
import os

_app = None


def _get_app():
    global _app
    if _app is None:
        from firecrawl import FirecrawlApp
        _app = FirecrawlApp(api_key=os.environ["FIRECRAWL_API_KEY"])
    return _app


def _sync_scrape(url: str) -> str:
    try:
        result = _get_app().scrape_url(url, params={"formats": ["markdown"]})
        if isinstance(result, dict):
            content = result.get("markdown") or ""
        else:
            content = getattr(result, "markdown", None) or ""
        return content[:1500]
    except Exception:
        return ""


async def scrape_readme(readme_url: str) -> str:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _sync_scrape, readme_url)


async def scrape_readmes(repos: list[dict]) -> list[dict]:
    sem = asyncio.Semaphore(5)

    async def _limited(repo: dict) -> None:
        async with sem:
            repo["readme_snippet"] = await scrape_readme(repo["readme_url"])

    await asyncio.gather(*[_limited(r) for r in repos])
    return repos
