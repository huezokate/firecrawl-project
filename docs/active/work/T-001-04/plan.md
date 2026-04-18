# Plan: T-001-04 Claude Categorization + FastAPI Endpoint

## Steps

### Step 1 — Implement claude_client.py
- Valid categories constant
- `_sync_categorize(name, description, readme_snippet) -> str`
- `categorize_repo(...)` async wrapper via run_in_executor
- `categorize_repos(repos)` semaphore-limited gather, adds "category" in-place

### Step 2 — Update main.py
- Import all three client modules
- Add cache globals + helper
- Add `_run_pipeline()` async function
- Add `GET /api/repos` endpoint
- Add `POST /api/refresh` endpoint

### Step 3 — Smoke test claude_client
- `ANTHROPIC_API_KEY=... python3 -c "import asyncio; from claude_client import categorize_repo; print(asyncio.run(categorize_repo('mendableai/firecrawl', 'Web scraping for AI', 'Firecrawl is a tool to turn websites into LLM-ready data...')))"` 
- Expect: one of the 7 category strings

### Step 4 — Integration test endpoint
- Start server: `uvicorn main:app --port 8000`
- `curl http://localhost:8000/api/repos` — should trigger full pipeline and return JSON
- Note: first call takes ~30-60s (100 repos × GitHub + Firecrawl + Claude)

### Step 5 — Commit
- `git add backend/claude_client.py backend/main.py docs/active/work/T-001-04/`
- Commit: "feat: Claude categorization pipeline and FastAPI endpoints"

## Verification Criteria

- `categorize_repo` returns one of the 7 valid category strings
- `/api/repos` returns JSON with `repos` array and `categories` dict
- Second call to `/api/repos` returns immediately (cache hit)
- `/api/refresh` clears cache and returns fresh data
- All repos have `name`, `description`, `stars`, `language`, `url`, `category`, `readme_snippet`
