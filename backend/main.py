import os
import time
from collections import Counter

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from claude_client import categorize_repos
from firecrawl_client import scrape_readmes
from github_client import search_firecrawl_repos

load_dotenv()

app = FastAPI(title="Firecrawl Explorer API")

ALLOWED_ORIGINS = [
    "https://firecrawl-project.pages.dev",
    "http://localhost:5173",
    "http://localhost:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

_cache: dict = {}
_CACHE_TTL = 3600


def _cache_valid() -> bool:
    return bool(_cache) and (time.time() - _cache.get("cached_at", 0)) < _CACHE_TTL


async def _run_pipeline() -> dict:
    repos = await search_firecrawl_repos()
    repos = await scrape_readmes(repos)
    repos = await categorize_repos(repos)

    counts = dict(Counter(r["category"] for r in repos))
    data = {"repos": repos, "categories": counts}

    _cache.clear()
    _cache["data"] = data
    _cache["cached_at"] = time.time()
    return data


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/api/repos")
async def get_repos():
    if _cache_valid():
        return _cache["data"]
    try:
        return await _run_pipeline()
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))


@app.post("/api/refresh")
async def refresh():
    _cache.clear()
    try:
        return await _run_pipeline()
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
