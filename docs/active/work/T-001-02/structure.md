# Structure: T-001-02 Backend GitHub Search

## Files Modified

### backend/github_client.py
Replace stub `pass` with full implementation:

```python
import os
import httpx

GITHUB_API = "https://api.github.com"
MAX_REPOS = 100
QUERIES = [
    'filename:requirements.txt "firecrawl"',
    'filename:package.json "firecrawl"',
]

async def search_firecrawl_repos() -> list[dict]:
    token = os.environ["GITHUB_TOKEN"]
    headers = { ... }
    seen: dict[str, dict] = {}
    async with httpx.AsyncClient(timeout=30) as client:
        for query in QUERIES:
            for page in range(1, 3):   # pages 1 and 2
                items = await _fetch_page(client, headers, query, page)
                for item in items:
                    repo = item["repository"]
                    name = repo["full_name"]
                    if name not in seen:
                        seen[name] = _normalize(repo)
                    if len(seen) >= MAX_REPOS:
                        return list(seen.values())
    return list(seen.values())

async def _fetch_page(client, headers, query, page) -> list:
    ...

def _normalize(repo: dict) -> dict:
    ...
```

## Files Not Modified

- `backend/main.py` — not touched in this ticket (endpoint added in T-001-04)
- All other backend files — unchanged

## Public Interface

One public async function: `search_firecrawl_repos() -> list[dict]`

No FastAPI imports. No global state. Reads `GITHUB_TOKEN` from `os.environ` at call time (not module load time) so tests can patch the env.
