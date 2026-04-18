# Plan: T-001-01 Project Scaffold

## Steps

### Step 1 — Git init + root files
- `git init` in project root
- Write `.gitignore`
- Write `README.md` (skeleton)
- Commit: "chore: initialize repo"

### Step 2 — Backend scaffold
- `mkdir backend`
- Write `backend/requirements.txt`
- Write `backend/.env.example`
- Write `backend/main.py` (FastAPI health check)
- Write `backend/github_client.py` (stub)
- Write `backend/firecrawl_client.py` (stub)
- Write `backend/claude_client.py` (stub)
- Verify: `cd backend && pip install -r requirements.txt` (dry-run check)
- Commit: "chore: backend scaffold"

### Step 3 — Frontend scaffold
- Run `npm create vite@latest frontend -- --template react-ts` from project root
- Install Tailwind: `npm install -D tailwindcss postcss autoprefixer` + `npx tailwindcss init -p`
- Install runtime deps: `npm install recharts`
- Write `src/types.ts`
- Write `src/index.css` (Tailwind directives)
- Update `tailwind.config.ts` with content paths
- Replace `src/App.tsx` with placeholder
- Verify: `npm run build` passes
- Commit: "chore: frontend scaffold"

### Step 4 — Update CLAUDE.md
- Update project description line
- Commit: "chore: update CLAUDE.md with project description"

## Verification

- `cd backend && python -c "from main import app; print('ok')"` — FastAPI importable
- `cd frontend && npm run build` — Vite build succeeds, no TS errors
- `git log --oneline` — 3-4 clean commits

## Testing Strategy

No unit tests in this ticket — scaffold only. Tests added in T-001-02 through T-001-05 alongside feature code.
