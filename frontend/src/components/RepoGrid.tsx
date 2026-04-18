import type { Repo } from "../types";
import { RepoCard } from "./RepoCard";

interface Props {
  repos: Repo[];
  activeCategory: string | null;
}

export function RepoGrid({ repos, activeCategory }: Props) {
  const filtered = activeCategory
    ? repos.filter((r) => r.category === activeCategory)
    : repos;

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        No repos in this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((repo) => (
        <RepoCard key={repo.name} repo={repo} />
      ))}
    </div>
  );
}
