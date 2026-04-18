# Structure: T-001-03 Firecrawl README Scraping

## Files Modified

### backend/firecrawl_client.py

Replace `pass` with full implementation. Public interface:

```python
async def scrape_readme(readme_url: str) -> str: ...
async def scrape_readmes(repos: list[dict]) -> list[dict]: ...
```

Internal helpers:
```python
def _get_app() -> FirecrawlApp: ...   # lazy singleton
def _sync_scrape(url: str) -> str: ...  # blocking, runs in executor
```

## Files Not Modified

- All other backend files unchanged
- `main.py` not touched — endpoint wired in T-001-04

## Key Invariants

- `scrape_readmes` mutates repos list in-place (adds `readme_snippet` key) AND returns the same list
- `readme_snippet` is always present after `scrape_readmes`, even if `""` on failure
- Module does not crash on import if `FIRECRAWL_API_KEY` is missing (lazy init)
- Each `scrape_readme` call is independently error-isolated
