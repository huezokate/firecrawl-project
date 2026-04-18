import asyncio
import os

import anthropic

VALID_CATEGORIES = [
    "RAG Pipeline",
    "AI Agent",
    "Lead Gen",
    "Content Scraper",
    "Research Automation",
    "Dev Tool",
    "Other",
]

_client = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    return _client


def _sync_categorize(name: str, description: str, readme_snippet: str) -> str:
    prompt = f"""Classify this GitHub repository into exactly one category.
Categories: {", ".join(VALID_CATEGORIES)}

Repo: {name}
Description: {description}
README excerpt:
{readme_snippet}

Reply with only the category name, nothing else."""

    try:
        response = _get_client().messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=50,
            messages=[{"role": "user", "content": prompt}],
        )
        category = response.content[0].text.strip()
        return category if category in VALID_CATEGORIES else "Other"
    except Exception:
        return "Other"


async def categorize_repo(name: str, description: str, readme_snippet: str) -> str:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None, _sync_categorize, name, description, readme_snippet
    )


async def categorize_repos(repos: list[dict]) -> list[dict]:
    sem = asyncio.Semaphore(10)

    async def _limited(repo: dict) -> None:
        async with sem:
            repo["category"] = await categorize_repo(
                repo["name"], repo["description"], repo.get("readme_snippet", "")
            )

    await asyncio.gather(*[_limited(r) for r in repos])
    return repos
