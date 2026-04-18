# Design: T-001-05 React Frontend

## Component Architecture

Single `App.tsx` handles data fetching and state. Child components are pure/presentational:
- `Header` — title, subtitle, refresh button
- `CategoryChart` — donut chart, click to filter
- `RepoGrid` — filtered card grid

Small enough that splitting into files-per-component is fine. All in `src/components/`.

## Data Fetching

`useEffect` on mount → fetch `/api/repos`. Simple fetch API, no React Query (overkill for one endpoint).

```tsx
useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/repos`)
    .then(r => r.json())
    .then(setData)
    .catch(() => setError("Failed to load data"))
    .finally(() => setLoading(false))
}, [])
```

## Filter Logic

`activeCategory: string | null` — null means "show all". Clicking a donut slice or category pill toggles it.

```tsx
const filtered = activeCategory
  ? data.repos.filter(r => r.category === activeCategory)
  : data.repos
```

## Chart Choice

Recharts `PieChart` with `innerRadius` (donut). Responsive via `ResponsiveContainer`.
Click on slice → sets `activeCategory`.
Click same slice again → clears filter (toggle behavior).

## Refresh Flow

```
Click "Refresh" → setRefreshing(true)
→ POST /api/refresh
→ response.json() → setData(fresh)
→ setRefreshing(false)
→ setActiveCategory(null)
```

## Design Decisions

- Monospace font for repo names (`font-mono`) — developer aesthetic
- Star count with ⭐ emoji — clear visual
- Language badge: colored pill using a simple hash → consistent color per language
- Category tag: uses same color map as chart slices
- "No repos" empty state when filter produces 0 results
- `README.md` snippet shown in card as collapsed text (no expand — keep cards compact)

## Responsiveness

Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
Chart: `ResponsiveContainer width="100%" height={320}`
