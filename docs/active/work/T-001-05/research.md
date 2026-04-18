# Research: T-001-05 React Frontend

## Existing Frontend State

- `frontend/src/App.tsx` — placeholder `<div>Loading...</div>`
- `frontend/src/types.ts` — `Repo`, `CategoryCounts`, `ApiResponse` interfaces defined
- `frontend/src/index.css` — Tailwind directives added
- `frontend/tailwind.config.js` — custom colors: `accent: "#00ff88"`, `surface: "#1a1a1a"`, `base: "#0a0a0a"`
- `frontend/src/App.css` — Vite default CSS, orphaned (can delete)
- Recharts installed
- Build passes (`npm run build` ✓)

## API Contract

`GET {VITE_API_URL}/api/repos` returns:
```json
{
  "repos": [{ "name", "description", "stars", "language", "url", "category", "readme_snippet" }],
  "categories": { "RAG Pipeline": 12, "AI Agent": 8, ... }
}
```

`POST {VITE_API_URL}/api/refresh` — triggers fresh fetch, returns same shape.

## Component Plan

```
App
├── Header
├── ChartSection
│   └── Recharts DonutChart (PieChart with inner radius)
├── FilterBar (category pills)
└── RepoGrid
    └── RepoCard[]
```

## Recharts Donut Pattern

```tsx
<PieChart width={400} height={400}>
  <Pie data={data} cx={200} cy={200} innerRadius={100} outerRadius={160}
       dataKey="value" onClick={handleSliceClick}>
    {data.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>
```

## Category Colors (7 categories)

```
RAG Pipeline        → #00ff88 (accent green)
AI Agent            → #3b82f6 (blue)
Lead Gen            → #f59e0b (amber)
Content Scraper     → #ef4444 (red)
Research Automation → #8b5cf6 (purple)
Dev Tool            → #06b6d4 (cyan)
Other               → #6b7280 (gray)
```

## Design Tokens (from tailwind.config.js)

- Background: `bg-base` (#0a0a0a)
- Card background: `bg-surface` (#1a1a1a)
- Accent: `text-accent` (#00ff88)
- Text: `text-gray-300`, `text-gray-400`
- Borders: `border-gray-800`

## State Management

Simple local state in App — no Redux/Zustand needed:
- `data: ApiResponse | null`
- `loading: boolean`
- `error: string | null`
- `activeCategory: string | null` (filter)
- `refreshing: boolean`
