# Design: T-001-06 Deployment Config

## Cloudflare Pages Config

`wrangler.toml` in `frontend/` with `[pages]` section:
- `name` = "firecrawl-explorer"
- `pages_build_output_dir` = "dist"

`_redirects` in `frontend/public/`:
- `/* /index.html 200` — standard SPA fallback

## Railway Config

`Procfile` in `backend/`:
- `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
- Railway injects `$PORT` automatically

`railway.toml` in `backend/`:
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
```

## CORS Update

`main.py` currently allows `allow_origins=["*"]`. For production, should restrict to Cloudflare Pages domain. But since the CF Pages URL isn't known until after deploy, keep `*` for now — acceptable for a public read-only demo API.

## README Update

Add "Deploy" section with step-by-step for both platforms.
