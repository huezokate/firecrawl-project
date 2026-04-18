# Plan: T-001-05 React Frontend

## Steps

### Step 1 — Create constants.ts
- CATEGORY_COLORS, CATEGORIES array

### Step 2 — Create RepoCard.tsx
- Pure component, no state, renders one repo

### Step 3 — Create RepoGrid.tsx
- Renders filtered grid of RepoCards + empty state

### Step 4 — Create CategoryChart.tsx
- Recharts donut + category pill filter row

### Step 5 — Create Header.tsx
- Title, subtitle, refresh button

### Step 6 — Rewrite App.tsx
- Wire all state, fetch logic, pass props to components

### Step 7 — Clean up App.css
- Remove Vite defaults

### Step 8 — Build verify
- `cd frontend && npm run build` — must pass with 0 TS errors

### Step 9 — Commit
- `git add frontend/src/ docs/active/work/T-001-05/`
- Commit: "feat: React frontend with chart and repo cards"

## Verification Criteria

- `npm run build` passes with no TypeScript errors
- All 4 components render without runtime errors
- Filter by category works (click chart slice or pill)
- Refresh button calls POST /api/refresh (can verify in network tab)
- Responsive grid: 1/2/3 col at sm/lg breakpoints
