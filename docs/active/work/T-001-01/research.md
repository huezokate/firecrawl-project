# Research: T-001-01 Project Scaffold

## Current State

Empty directory initialized by `lisa init`. Contains:
- `docs/` hierarchy (tickets, stories, work, archive, knowledge)
- `CLAUDE.md` (generic lisa template, needs updating)
- `.lisa.toml`, `.lisa/` hooks, `.claude/settings.local.json`
- No application code, no git history

## Target Stack

### Backend
- **Python 3.11+** / **FastAPI** — async-first, standard for ML/AI projects
- **uvicorn** as ASGI server
- **httpx** for async HTTP (GitHub + Firecrawl calls)
- **anthropic** SDK for Claude
- **python-dotenv** for local env loading

### Frontend
- **Vite** — fast dev server, optimal for React + TS
- **React 18** + **TypeScript**
- **Tailwind CSS** — utility-first, no runtime overhead
- **Recharts** — composable chart library for React, good donut support
- No UI component library (keep it lean, custom dark theme)

## Directory Shape

```
firecrawl-project/
├── backend/
│   ├── main.py
│   ├── github_client.py       # (stub, ticket T-001-02)
│   ├── firecrawl_client.py    # (stub, ticket T-001-03)
│   ├── claude_client.py       # (stub, ticket T-001-04)
│   ├── requirements.txt
│   ├── .env.example
│   ├── Procfile               # (added in T-001-06)
│   └── railway.toml           # (added in T-001-06)
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── components/
│   │   └── types.ts
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── wrangler.toml          # (added in T-001-06)
├── .gitignore
├── README.md
└── CLAUDE.md (updated)
```

## Constraints

- `backend/` and `frontend/` must be self-contained — each deployable independently
- Env vars must not be committed; `.env.example` documents them
- Node tooling goes in `frontend/`, Python tooling in `backend/` — no monorepo manager needed at this size
- React app communicates with backend via `VITE_API_URL` (configurable per environment)

## Assumptions

- Python 3.11 available locally (`python3 --version`)
- Node 18+ available locally for Vite scaffold
- No existing git history to preserve
- `vite` scaffold via `npm create vite@latest` with react-ts template is the fastest path
