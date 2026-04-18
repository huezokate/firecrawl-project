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
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    seen: dict[str, dict] = {}
    async with httpx.AsyncClient(timeout=30) as client:
        for query in QUERIES:
            for page in range(1, 3):
                items = await _fetch_page(client, headers, query, page)
                for item in items:
                    repo = item["repository"]
                    name = repo["full_name"]
                    if name not in seen:
                        seen[name] = _normalize(repo)
                    if len(seen) >= MAX_REPOS:
                        return list(seen.values())
    return list(seen.values())


async def _fetch_page(
    client: httpx.AsyncClient, headers: dict, query: str, page: int
) -> list:
    response = await client.get(
        f"{GITHUB_API}/search/code",
        headers=headers,
        params={"q": query, "per_page": 100, "page": page},
    )
    if response.status_code == 403:
        raise RuntimeError("GitHub rate limit exceeded")
    if response.status_code in (404, 422):
        return []
    response.raise_for_status()
    return response.json().get("items", [])


def _normalize(repo: dict) -> dict:
    full_name = repo["full_name"]
    branch = repo.get("default_branch") or "main"
    return {
        "name": full_name,
        "description": repo.get("description") or "",
        "stars": repo.get("stargazers_count", 0),
        "language": repo.get("language") or "Unknown",
        "url": repo["html_url"],
        "readme_url": f"https://raw.githubusercontent.com/{full_name}/{branch}/README.md",
    }
