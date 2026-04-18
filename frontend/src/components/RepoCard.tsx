import type { Repo } from "../types";
import { CATEGORY_COLORS } from "../constants";

interface Props {
  repo: Repo;
}

function languageColor(lang: string): string {
  const colors: Record<string, string> = {
    Python: "#3572A5",
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Go: "#00ADD8",
    Rust: "#dea584",
    Java: "#b07219",
    Ruby: "#701516",
    Unknown: "#6b7280",
  };
  return colors[lang] ?? "#6b7280";
}

export function RepoCard({ repo }: Props) {
  const categoryColor = CATEGORY_COLORS[repo.category] ?? "#6b7280";

  return (
    <div className="bg-surface border border-gray-800 rounded-lg p-4 flex flex-col gap-3 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-accent hover:underline truncate"
        >
          {repo.name}
        </a>
        <span className="text-gray-400 text-xs whitespace-nowrap">⭐ {repo.stars}</span>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
        {repo.description || "No description"}
      </p>

      <div className="flex items-center gap-2 flex-wrap mt-auto">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: `${categoryColor}22`, color: categoryColor, border: `1px solid ${categoryColor}44` }}
        >
          {repo.category}
        </span>
        {repo.language !== "Unknown" && (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${languageColor(repo.language)}22`, color: languageColor(repo.language), border: `1px solid ${languageColor(repo.language)}44` }}
          >
            {repo.language}
          </span>
        )}
      </div>
    </div>
  );
}
