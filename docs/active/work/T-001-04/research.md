# Research: T-001-04 Claude Categorization + FastAPI Endpoint

## Existing Code

### backend/claude_client.py — bare `pass` stub
### backend/main.py — FastAPI app with `/health` only, CORS configured

## Anthropic SDK

Package: `anthropic==0.42.0` (in requirements.txt)
Client: `anthropic.Anthropic(api_key=...)`
Model: `claude-sonnet-4-20250514` (as specified)

Messages API:
```python
client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=50,
    messages=[{"role": "user", "content": "..."}]
)
```
Returns `response.content[0].text`

## Categories (from ticket spec)

Exactly these 7:
- RAG Pipeline
- AI Agent
- Lead Gen
- Content Scraper
- Research Automation
- Dev Tool
- Other

## Prompt Strategy

Single-turn classification prompt. Keep it short — we're calling this 100 times per refresh.
Prompt should:
1. Show repo name, description, README snippet
2. Ask for exactly one category from the list
3. Return just the category name, nothing else

Low max_tokens (50) is fine — we only need one category string back.

## Caching Strategy

In-memory cache with TTL. Since this is a single-process server (Railway), a module-level dict + timestamp works fine.
- Cache key: `"repos"` (only one query ever)
- TTL: 3600 seconds (1 hour)
- Cache stores: `{"repos": [...], "categories": {...}, "cached_at": float}`
- `POST /api/refresh` busts it by clearing the cache dict

## FastAPI Endpoint

`GET /api/repos` — returns cached data or fetches fresh
`POST /api/refresh` — clears cache, triggers fresh fetch, returns new data

Response model:
```json
{
  "repos": [
    {
      "name": "owner/repo",
      "description": "...",
      "stars": 42,
      "language": "Python",
      "url": "https://github.com/owner/repo",
      "category": "RAG Pipeline",
      "readme_snippet": "..."
    }
  ],
  "categories": {
    "RAG Pipeline": 12,
    "AI Agent": 8,
    ...
  }
}
```

## Cost Estimate

100 repos × ~800 input tokens + ~10 output tokens ≈ 81,000 input tokens + 1,000 output tokens per refresh.
At claude-sonnet-4-20250514 pricing (~$3/MTok input, $15/MTok output): ~$0.25 per refresh.
Acceptable for a demo app with 1-hour cache.

## Pipeline Orchestration (in main.py)

```
repos = await search_firecrawl_repos()    # github_client
repos = await scrape_readmes(repos)       # firecrawl_client
repos = await categorize_repos(repos)     # claude_client
```
