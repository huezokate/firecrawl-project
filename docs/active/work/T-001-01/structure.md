# Structure: T-001-01 Project Scaffold

## Files Created

### Root
- `.gitignore` — Python + Node + env ignore patterns
- `README.md` — project overview, local dev, deploy instructions placeholder

### backend/
- `main.py` — FastAPI app, health check route only, CORS setup stub
- `github_client.py` — empty module (pass), filled in T-001-02
- `firecrawl_client.py` — empty module (pass), filled in T-001-03
- `claude_client.py` — empty module (pass), filled in T-001-04
- `requirements.txt` — pinned deps: fastapi, uvicorn, httpx, anthropic, python-dotenv, firecrawl-py
- `.env.example` — documents all three API key env vars + PORT

### frontend/ (Vite scaffold + additions)
- `package.json` — react, react-dom, recharts; devDeps: typescript, tailwindcss, vite, @vitejs/plugin-react
- `vite.config.ts` — base config with react plugin
- `tailwind.config.ts` — content paths for src/
- `postcss.config.js` — tailwind + autoprefixer
- `tsconfig.json` — strict mode, paths
- `index.html` — root HTML with dark bg meta
- `src/main.tsx` — ReactDOM render entry
- `src/App.tsx` — placeholder component
- `src/types.ts` — shared TypeScript interfaces: `Repo`, `ApiResponse`, `CategoryCounts`
- `src/index.css` — Tailwind directives (@tailwind base/components/utilities)
- `.env.example` — VITE_API_URL=http://localhost:8000

## Files Modified

- `CLAUDE.md` — update project description to "What are devs building with Firecrawl? — full-stack app (FastAPI + React) that discovers and categorizes GitHub repos using Firecrawl"

## Module Boundaries

- `backend/` has no knowledge of `frontend/`
- `frontend/` communicates with backend only via `VITE_API_URL` HTTP calls
- Each directory is independently installable/runnable

## Key Interfaces (types.ts)

```typescript
interface Repo {
  name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
  category: string;
  readme_snippet: string;
}

interface CategoryCounts {
  [category: string]: number;
}

interface ApiResponse {
  repos: Repo[];
  categories: CategoryCounts;
}
```

These types are the contract between T-001-04 (backend JSON shape) and T-001-05 (frontend rendering).
