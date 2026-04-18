import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { CategoryCounts } from "../types";
import { CATEGORY_COLORS, CATEGORIES } from "../constants";

interface Props {
  categories: CategoryCounts;
  activeCategory: string | null;
  onCategoryClick: (category: string | null) => void;
}

export function CategoryChart({ categories, activeCategory, onCategoryClick }: Props) {
  const data = CATEGORIES
    .filter((c) => (categories[c] ?? 0) > 0)
    .map((c) => ({ name: c, value: categories[c] ?? 0 }));

  const handleSliceClick = (entry: { name?: string }) => {
    const name = entry.name;
    if (!name) return;
    onCategoryClick(activeCategory === name ? null : name);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={90}
            outerRadius={140}
            dataKey="value"
            onClick={handleSliceClick}
            cursor="pointer"
            stroke="none"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={CATEGORY_COLORS[entry.name]}
                opacity={activeCategory && activeCategory !== entry.name ? 0.3 : 1}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #374151", borderRadius: "8px", color: "#d1d5db" }}
          />
          <Legend
            formatter={(value) => <span style={{ color: "#9ca3af", fontSize: 13 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-2 justify-center">
        {data.map((entry) => (
          <button
            key={entry.name}
            onClick={() => onCategoryClick(activeCategory === entry.name ? null : entry.name)}
            className="text-xs px-3 py-1 rounded-full transition-all"
            style={{
              backgroundColor: activeCategory === entry.name ? `${CATEGORY_COLORS[entry.name]}33` : "transparent",
              color: CATEGORY_COLORS[entry.name],
              border: `1px solid ${CATEGORY_COLORS[entry.name]}${activeCategory === entry.name ? "88" : "44"}`,
            }}
          >
            {entry.name} ({entry.value})
          </button>
        ))}
        {activeCategory && (
          <button
            onClick={() => onCategoryClick(null)}
            className="text-xs px-3 py-1 rounded-full text-gray-400 border border-gray-700 hover:border-gray-500 transition-colors"
          >
            Clear filter
          </button>
        )}
      </div>
    </div>
  );
}
