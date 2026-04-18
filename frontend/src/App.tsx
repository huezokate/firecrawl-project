import { useEffect, useState } from "react";
import type { ApiResponse } from "./types";
import { Header } from "./components/Header";
import { CategoryChart } from "./components/CategoryChart";
import { RepoGrid } from "./components/RepoGrid";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

function App() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/repos`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: ApiResponse) => setData(d))
      .catch(() => setError("Failed to load data. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setActiveCategory(null);
    try {
      const r = await fetch(`${API_URL}/api/refresh`, { method: "POST" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d: ApiResponse = await r.json();
      setData(d);
      setError(null);
    } catch {
      setError("Refresh failed.");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <p className="font-mono text-accent animate-pulse">Fetching repos...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <p className="font-mono text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Header
          repoCount={data?.repos.length ?? 0}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />

        {data && (
          <>
            <section className="mb-10">
              <h2 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-6">
                Category Breakdown
              </h2>
              <CategoryChart
                categories={data.categories}
                activeCategory={activeCategory}
                onCategoryClick={setActiveCategory}
              />
            </section>

            <section>
              <h2 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">
                {activeCategory ? `${activeCategory} repos` : "All repos"}{" "}
                <span className="text-gray-600">
                  ({activeCategory ? (data.categories[activeCategory] ?? 0) : data.repos.length})
                </span>
              </h2>
              <RepoGrid repos={data.repos} activeCategory={activeCategory} />
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
