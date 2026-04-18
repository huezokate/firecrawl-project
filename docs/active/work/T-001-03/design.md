# Design: T-001-03 Firecrawl README Scraping

## Options

### Option A: Firecrawl SDK (sync, thread pool)
- Pros: uses FIRECRAWL_API_KEY, richer scraping, matches ticket spec
- Cons: sync SDK requires `run_in_executor`, slightly more boilerplate
- **Chosen**: matches the spec requirement to use Firecrawl

### Option B: httpx to fetch raw README directly (no Firecrawl)
- Pros: simpler, faster, free
- Cons: doesn't use Firecrawl API key, defeats the purpose of the ticket
- **Rejected**: spec explicitly requires Firecrawl for README content

### Option C: Firecrawl scraping GitHub repo page (HTML)
- Scrape `https://github.com/owner/repo` instead of raw README URL
- Pros: richer content including topics, description metadata
- Cons: much slower (JS-rendered page), more token usage, higher cost
- **Rejected**: raw README URL is faster and sufficient for categorization

## Concurrency Model

Semaphore-limited `asyncio.gather`:
```python
sem = asyncio.Semaphore(5)

async def _limited(url):
    async with sem:
        return await scrape_readme(url)

results = await asyncio.gather(*[_limited(r["readme_url"]) for r in repos])
```

5 concurrent calls is conservative for Firecrawl free tier. Can be tuned up with paid plan.

## Failure Isolation

Each scrape is wrapped in try/except. One failure doesn't abort the batch. Repos with failed scrapes get `readme_snippet: ""` — Claude categorizes them on description alone.

## Module Design

Single module `firecrawl_client.py` with:
- Module-level `_app` initialized lazily (not at import time — avoids crashing if FIRECRAWL_API_KEY not set during tests)
- `scrape_readme(url) -> str` — single URL
- `scrape_readmes(repos) -> list[dict]` — batch, mutates repos in-place adding `readme_snippet`
