# Structure: T-001-04 Claude Categorization + FastAPI Endpoint

## Files Modified

### backend/claude_client.py

Public interface:
```python
async def categorize_repo(name: str, description: str, readme_snippet: str) -> str
async def categorize_repos(repos: list[dict]) -> list[dict]
```

`categorize_repo` — single repo, returns category string
`categorize_repos` — concurrent batch, adds "category" key to each repo dict

### backend/main.py

Add to existing file:
- `import time` + `from github_client import ...` + `from firecrawl_client import ...` + `from claude_client import ...`
- `_cache` dict + `_CACHE_TTL` constant + `_cache_valid()` helper + `_run_pipeline()` async function
- `GET /api/repos` endpoint
- `POST /api/refresh` endpoint

## Response Models (inline, no separate models.py needed)

Both endpoints return the same shape:
```python
{
    "repos": list[dict],
    "categories": dict[str, int]
}
```

## Key Invariants

- `categorize_repos` adds "category" key in-place and returns the list
- Category is always one of the 7 valid strings (defaulting "Other" on bad output)
- Cache is busted by clearing `_cache` dict entirely
- Pipeline runs: github → firecrawl → claude → build category counts → cache → return
