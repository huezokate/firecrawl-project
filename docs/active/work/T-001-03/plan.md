# Plan: T-001-03 Firecrawl README Scraping

## Steps

### Step 1 — Implement firecrawl_client.py
- Replace `pass` stub with full implementation
- Lazy `_get_app()` singleton
- `_sync_scrape(url)` — blocking SDK call, truncate to 1500 chars
- `scrape_readme(url)` — async wrapper via run_in_executor, try/except
- `scrape_readmes(repos)` — semaphore-limited gather, mutate in-place

### Step 2 — Smoke test
- `FIRECRAWL_API_KEY=... python3 -c "import asyncio; from firecrawl_client import scrape_readme; print(asyncio.run(scrape_readme('https://raw.githubusercontent.com/mendableai/firecrawl/main/README.md'))[:200])"`
- Expect: 200 chars of Firecrawl's own README

### Step 3 — Commit
- `git add backend/firecrawl_client.py docs/active/work/T-001-03/`
- Commit: "feat: Firecrawl README scraping client"

## Verification Criteria

- Single URL scrape returns non-empty string for a valid readme_url
- Returns "" for a bad URL (no exception)
- `scrape_readmes` adds `readme_snippet` to all repos in list
- Max length of any `readme_snippet` is 1500 chars
