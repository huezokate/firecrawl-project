# Design: T-001-04 Claude Categorization + FastAPI Endpoint

## Claude Client Design

### Option A: One Claude call per repo (sequential)
- Simpler, predictable rate
- 100 sequential calls at ~1s each = ~100s total — too slow for a web request
- **Rejected**

### Option B: Batch Claude calls with asyncio (concurrency-limited)
- Wrap sync Anthropic SDK in `run_in_executor` like Firecrawl
- Cap concurrency at 10 (Anthropic has generous rate limits on Sonnet)
- 100 calls / 10 concurrency = ~10s total assuming ~1s per call
- **Chosen**: acceptable latency with good resource use

### Option C: Claude batch API
- Async batch processing, results polled later
- Overkill for 100 items; adds complexity; results not immediate
- **Rejected**: real-time response is better UX for a web app

## Prompt Design

Keep prompt minimal:
```
Classify this GitHub repository into exactly one category.
Categories: RAG Pipeline, AI Agent, Lead Gen, Content Scraper, Research Automation, Dev Tool, Other

Repo: {name}
Description: {description}
README excerpt:
{readme_snippet}

Reply with only the category name, nothing else.
```

If the response doesn't match a valid category exactly, default to "Other".

## Cache Design

Module-level dict in `main.py`:
```python
_cache: dict = {}
_CACHE_TTL = 3600

def _cache_valid() -> bool:
    return "data" in _cache and (time.time() - _cache["cached_at"]) < _CACHE_TTL
```

Simple and correct for a single-process deployment (Railway runs one process). No Redis needed.

## Endpoint Design

`GET /api/repos`:
- If cache valid → return cached data immediately
- If cache miss → run full pipeline, store in cache, return

`POST /api/refresh`:
- Clear cache
- Run full pipeline
- Return fresh data
- Frontend calls this on "Refresh" button click

## Error Handling

- If GitHub fails: 503 with message
- If pipeline partially fails: return whatever succeeded (scrape/categorize with empty snippets)
- If Claude returns garbage: default to "Other" category
