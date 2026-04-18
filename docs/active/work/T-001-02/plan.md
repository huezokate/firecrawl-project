# Plan: T-001-02 Backend GitHub Search

## Steps

### Step 1 — Implement github_client.py
- Replace `pass` with full implementation
- `_normalize(repo)` helper: extract fields, coerce None to defaults
- `_fetch_page(client, headers, query, page)` helper: GET /search/code, handle 403
- `search_firecrawl_repos()`: loop queries/pages, deduplicate, cap at 100

### Step 2 — Verify
- Set up local venv: `cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`
- Create `backend/.env` with real GITHUB_TOKEN
- Quick smoke test: `python -c "import asyncio; from github_client import search_firecrawl_repos; print(asyncio.run(search_firecrawl_repos())[:2])"`
- Expect: 2 repo dicts printed with name, stars, language, url, readme_url

### Step 3 — Commit
- `git add backend/github_client.py`
- Commit: "feat: GitHub search API client"

## Verification Criteria

- Function returns a list of dicts
- Each dict has: name, description, stars, language, url, readme_url
- No duplicate names in result
- Stars is an int, language defaults to "Unknown" when null
- readme_url is a valid raw.githubusercontent.com URL
