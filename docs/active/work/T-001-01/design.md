# Design: T-001-01 Project Scaffold

## Options Considered

### Option A: Monorepo with shared tooling (turborepo / nx)
- Pros: unified lint/test commands, shared TypeScript types
- Cons: overkill for a two-service app; adds tooling complexity; slows onboarding
- **Rejected**: complexity not justified for this scope

### Option B: Separate repos for frontend and backend
- Pros: clean separation, independent deploy pipelines
- Cons: harder to navigate locally; no single git history; coordination overhead
- **Rejected**: single repo is simpler for a solo project / showcase app

### Option C: Single repo, two top-level directories (chosen)
- `backend/` — Python package, self-contained
- `frontend/` — Vite/React app, self-contained
- Pros: one git repo, easy to navigate, independent deploy without coupling
- Cons: slightly manual — no shared scripts layer, but `README.md` covers local dev
- **Chosen**: right size for this project

## Frontend Scaffolding Decision

Use `npm create vite@latest frontend -- --template react-ts` rather than manual setup.
- Gets `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.tsx` baseline correct
- Adds Tailwind manually post-scaffold (Vite template doesn't include it)
- Adds Recharts for charts

## Backend Structure Decision

Plain Python files (no package `__init__.py` structure) since FastAPI + uvicorn run from the `backend/` directory directly. This keeps Railway deployment simple (`uvicorn main:app`).

## Environment Variable Strategy

- `backend/.env.example` — documents GITHUB_TOKEN, ANTHROPIC_API_KEY, FIRECRAWL_API_KEY
- `frontend/.env.example` — documents VITE_API_URL
- Neither committed. `python-dotenv` loads `.env` locally; Railway/CF Pages inject via dashboard.

## Git Strategy

- Initialize git in project root
- `.gitignore` covers: `__pycache__`, `.env`, `node_modules`, `dist`, `.DS_Store`, `.lisa/signals`
- Initial commit after scaffold is complete

## What's Stubbed (left for later tickets)

- `github_client.py`: placeholder file with `pass`
- `firecrawl_client.py`: placeholder file with `pass`
- `claude_client.py`: placeholder file with `pass`
- `main.py`: minimal FastAPI app with health check only
- `App.tsx`: placeholder with "Loading..." — real UI in T-001-05
