# Structure: T-001-05 React Frontend

## Files Created

### frontend/src/components/Header.tsx
- Title: "What are devs building with Firecrawl?"
- Subtitle: repo count + last updated note
- Refresh button (calls onRefresh prop, shows spinner when refreshing)

### frontend/src/components/CategoryChart.tsx
- Recharts ResponsiveContainer + PieChart (donut)
- Props: categories, activeCategory, onCategoryClick
- Category pills row below chart for mobile-friendly filter

### frontend/src/components/RepoCard.tsx
- Props: repo (Repo type)
- Shows: name (linked, monospace), description, category tag, language badge, star count

### frontend/src/components/RepoGrid.tsx
- Props: repos, activeCategory, onCategoryClick
- Renders filtered RepoCard grid
- Empty state when no repos match filter

### frontend/src/constants.ts
- CATEGORY_COLORS map (7 categories → hex colors)
- CATEGORIES array (ordered)

## Files Modified

### frontend/src/App.tsx
- Replace placeholder with full data-fetching app shell
- Manages: data, loading, error, activeCategory, refreshing state

### frontend/src/App.css
- Delete contents (replaced by Tailwind)

## Files Not Modified

- `frontend/src/types.ts` — already correct
- `frontend/src/index.css` — already has Tailwind directives
- `frontend/vite.config.ts` — no changes needed
- `frontend/tailwind.config.js` — already configured
