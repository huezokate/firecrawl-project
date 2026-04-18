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

- **Frontend**: Cloudflare Pages — connect repo, set build command `npm run build`, output dir `dist`, add `VITE_API_URL` env var
- **Backend**: Railway — connect repo, set root dir to `backend/`, add env vars from `.env.example`

## Categories

Repos are classified into: RAG Pipeline, AI Agent, Lead Gen, Content Scraper, Research Automation, Dev Tool, Other
