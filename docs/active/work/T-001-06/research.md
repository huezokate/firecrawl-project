# Research: T-001-06 Deployment Config

## Cloudflare Pages (Frontend)

- Build command: `npm run build`
- Output directory: `dist`
- Root: `frontend/`
- SPA routing requires `_redirects` file in `public/` (or root of output): `/* /index.html 200`
- `wrangler.toml` is optional for Pages — Cloudflare dashboard picks up build settings
  - But `wrangler.toml` in the project root enables `wrangler pages deploy` CLI usage
- Env var `VITE_API_URL` set via CF Pages dashboard (Settings → Environment Variables)

## Railway (Backend)

- Railway auto-detects Python projects and uses nixpacks builder
- `Procfile` tells Railway how to start the app: `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
- `railway.toml` can specify build + start commands explicitly (overrides auto-detect)
- Root dir set to `backend/` in Railway project settings OR via `railway.toml`

## Current State

- `backend/requirements.txt` — exists and complete
- `frontend/package.json` — has `build` script outputting to `dist/`
- No deployment config files exist yet

## What's Needed

- `frontend/public/_redirects` — SPA fallback routing
- `frontend/wrangler.toml` — Cloudflare Pages config for CLI deploy
- `backend/Procfile` — Railway process definition
- `backend/railway.toml` — Railway build config
- `README.md` updated with deploy steps
