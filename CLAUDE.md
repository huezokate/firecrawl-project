# CLAUDE.md

## Project

firecrawl-project (full-stack web app) — "What are devs building with Firecrawl?" — FastAPI backend + React frontend that discovers GitHub repos using Firecrawl, categorizes them via Claude, and displays results as interactive charts and repo cards.



### Directory Conventions

```
docs/active/tickets/    # Ticket files (markdown with YAML frontmatter)
docs/active/stories/    # Story files (same frontmatter pattern)
docs/active/work/       # Work artifacts, one subdirectory per ticket ID
```

---

The RDSPI workflow definition is in docs/knowledge/rdspi-workflow.md and is injected into agent context by lisa automatically.
