# Research: T-001-02 Backend GitHub Search

## GitHub Search API Patterns

### Code Search
Endpoint: `GET https://api.github.com/search/code`
- `q` parameter supports: `filename:requirements.txt firecrawl` and `filename:package.json firecrawl`
- Returns: `items[]` each with `repository` object containing full repo metadata
- Rate limit: 10 req/min unauthenticated, 30 req/min authenticated
- Max results per page: 100 (per_page=100)
- Result cap: GitHub caps code search at 1000 total results per query

### Response Shape (relevant fields)
```json
{
  "items": [
    {
      "repository": {
        "full_name": "owner/repo",
        "description": "...",
        "stargazers_count": 42,
        "language": "Python",
        "default_branch": "main",
        "html_url": "https://github.com/owner/repo"
      }
    }
  ]
}
```

### README URL Construction
Raw README URL pattern: `https://raw.githubusercontent.com/{full_name}/{default_branch}/README.md`
This is used by the Firecrawl client in T-001-03.

## Existing Code

`backend/github_client.py` — currently a bare `pass`. No existing logic to preserve.

`backend/main.py` — FastAPI app with CORS and health check. `github_client` is not yet imported.

## Constraints

- Must use `GITHUB_TOKEN` env var for auth headers
- `httpx.AsyncClient` is the right choice (already in requirements.txt, consistent with async FastAPI)
- Deduplication needed: same repo can appear in both queries (has both requirements.txt and package.json with firecrawl)
- GitHub code search returns file matches, not unique repos — must deduplicate by `repository.full_name`

## Output Contract

Function signature:
```python
async def search_firecrawl_repos() -> list[dict]
```

Each dict:
```python
{
    "name": str,           # full_name e.g. "owner/repo"
    "description": str,    # may be None -> coerce to ""
    "stars": int,
    "language": str,       # may be None -> coerce to "Unknown"
    "url": str,            # html_url
    "readme_url": str,     # raw githubusercontent URL
}
```

## Pagination Strategy

Fetch pages 1 and 2 (100 results each = 200 max) per query. Two queries (requirements.txt + package.json) = up to 400 raw results. After dedup by full_name, expect 100-250 unique repos.
