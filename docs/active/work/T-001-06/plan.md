# Plan: T-001-06 Deployment Config

## Steps

### Step 1 — Frontend Cloudflare config
- Write `frontend/public/_redirects`
- Write `frontend/wrangler.toml`

### Step 2 — Backend Railway config
- Write `backend/Procfile`
- Write `backend/railway.toml`

### Step 3 — Update README.md
- Add Deploy section with Railway and CF Pages instructions

### Step 4 — Verify build still passes
- `cd frontend && npm run build` — dist should include _redirects

### Step 5 — Commit and push
- `git add` all new files + README.md
- Commit: "chore: add deployment config for Railway and Cloudflare Pages"
- `git push`

## Verification Criteria

- `frontend/dist/_redirects` exists after `npm run build`
- `backend/Procfile` has correct uvicorn command
- `backend/railway.toml` has healthcheck path `/health`
- README deploy section covers both platforms
