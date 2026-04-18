# Design: T-001-02 Backend GitHub Search

## Options

### Option A: Use PyGithub library
- Pros: typed, abstracts pagination
- Cons: adds a dependency; code search via PyGithub is less flexible; overkill
- **Rejected**: httpx direct calls are simpler and already a dependency

### Option B: httpx sync client
- Pros: simpler code
- Cons: blocks the event loop; defeats FastAPI async
- **Rejected**

### Option C: httpx AsyncClient with manual pagination (chosen)
- Fetch pages sequentially per query (avoid hitting secondary rate limits from parallel code searches)
- Run two queries sequentially (requirements.txt then package.json)
- Deduplicate by full_name using a dict
- **Chosen**: cleanest, no extra deps, async-safe

## Deduplication Strategy

Use `dict[full_name, repo_dict]` — first occurrence wins. Both queries are essentially equivalent for our purposes; whichever finds the repo first is fine.

## Error Handling

- 403 → rate limit hit: raise `RuntimeError("GitHub rate limit exceeded")`
- 422 → bad query (shouldn't happen with fixed queries): log and skip
- Network errors: let httpx raise, FastAPI returns 500

## README URL Strategy

Construct raw URL from `full_name` + `default_branch`:
```
https://raw.githubusercontent.com/{full_name}/{default_branch}/README.md
```
Stored in the returned dict as `readme_url`. Firecrawl client will use it. If `default_branch` is null (shouldn't happen), fall back to `"main"`.

## Result Cap

Cap at 100 unique repos before returning. This keeps Claude API costs predictable in T-001-04 (100 Claude calls max per refresh).

## Auth Headers

```python
headers = {
    "Authorization": f"Bearer {github_token}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}
```
