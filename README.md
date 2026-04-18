# What are devs building with Firecrawl?

A web app that discovers public GitHub repos using Firecrawl as a dependency, scrapes their READMEs, categorizes them via Claude, and displays the results as an interactive chart + repo card grid.

## Stack

- **Backend**: Python / FastAPI → Railway
- **Frontend**: React + TypeScript + Vite → Cloudflare Pages
- **APIs**: GitHub Search, Firecrawl, Anthropic Claude (claude-sonnet-4-20250514)

## Local Development

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # fill in your API keys
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # set VITE_API_URL=http://localhost:8000
npm run dev
```

## Deploy

### Backend → Railway

1. Create new Railway project → "Deploy from GitHub repo"
2. Set **Root Directory** to `backend/`
3. Railway auto-detects Python via nixpacks; `railway.toml` configures the start command
4. Add environment variables in Railway dashboard:
   - `GITHUB_TOKEN`
   - `ANTHROPIC_API_KEY`
   - `FIRECRAWL_API_KEY`
5. Copy the Railway public URL (e.g. `https://firecrawl-api.up.railway.app`)

### Frontend → Cloudflare Pages

1. Create new Cloudflare Pages project → "Connect to Git"
2. Set **Root Directory** to `frontend/`
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Add environment variable:
   - `VITE_API_URL` = your Railway URL from above
6. Deploy — Cloudflare builds and serves the React app globally

### CLI deploy (optional)

```bash
# Backend
cd backend && railway up

# Frontend
cd frontend && npx wrangler pages deploy dist --project-name firecrawl-explorer
```

## Categories

Repos are classified into: RAG Pipeline, AI Agent, Lead Gen, Content Scraper, Research Automation, Dev Tool, Other
