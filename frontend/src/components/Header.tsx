interface Props {
  repoCount: number;
  onRefresh: () => void;
  refreshing: boolean;
}

export function Header({ repoCount, onRefresh, refreshing }: Props) {
  return (
    <header className="border-b border-gray-800 pb-6 mb-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-mono font-bold text-white mb-1">
            What are devs building with{" "}
            <span className="text-accent">Firecrawl</span>?
          </h1>
          <p className="text-gray-500 text-sm">
            {repoCount} public repos discovered via GitHub · categorized by Claude
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-gray-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono"
        >
          {refreshing ? (
            <>
              <span className="animate-spin">⟳</span> Refreshing...
            </>
          ) : (
            <>⟳ Refresh data</>
          )}
        </button>
      </div>
    </header>
  );
}
