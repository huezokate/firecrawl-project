# Research: T-001-03 Firecrawl README Scraping

## Firecrawl Python SDK

Package: `firecrawl-py` (already in requirements.txt as 1.9.0)
Client: `FirecrawlApp(api_key=...)`
Key method: `app.scrape_url(url, formats=["markdown"])` → returns dict with `markdown` key

Firecrawl is a sync SDK. For async FastAPI, we must run it in a thread pool executor to avoid blocking the event loop.

## What We're Scraping

Input: `readme_url` from github_client — raw.githubusercontent.com URL
These are plain markdown files served directly. Firecrawl can scrape them and return markdown content.

Alternative: scrape the GitHub repo page (html). Raw URL is simpler and cheaper — Firecrawl won't need to render JS for a raw markdown file.

## Current State

`backend/firecrawl_client.py` — bare `pass` stub.

## Concurrency Constraints

- 100 repos from GitHub search = 100 Firecrawl calls
- Firecrawl free tier has rate limits — concurrent calls will hit them
- Use `asyncio.Semaphore(5)` to cap concurrency at 5 simultaneous scrapes
- `asyncio.gather(*tasks)` with the semaphore wrapping each coroutine

## Error Handling

- Network timeout: return `""` (empty string)
- Firecrawl API error / bad status: return `""`
- SDK raises exceptions on failure — catch broadly, return `""`
- Empty result (no markdown key): return `""`

## Output Contract

```python
async def scrape_readme(readme_url: str) -> str:
    """Returns up to 1500 chars of markdown, or "" on failure."""

async def scrape_readmes(repos: list[dict]) -> list[dict]:
    """Adds 'readme_snippet' key to each repo dict in-place. Returns repos."""
```

`scrape_readmes` is the main entry point used by T-001-04's pipeline.

## SDK Usage Pattern

```python
from firecrawl import FirecrawlApp
import asyncio

app = FirecrawlApp(api_key=os.environ["FIRECRAWL_API_KEY"])

def _sync_scrape(url: str) -> str:
    result = app.scrape_url(url, formats=["markdown"])
    return (result.markdown or "")[:1500]

async def scrape_readme(url: str) -> str:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _sync_scrape, url)
```
