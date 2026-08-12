import type { SearchFilters } from "@/lib/search";

export function SearchForm({
  defaultQuery = "",
  compact = false,
  autofocus = false,
}: {
  defaultQuery?: string;
  compact?: boolean;
  autofocus?: boolean;
}) {
  return (
    <form
      action="/explore"
      method="get"
      role="search"
      className={compact ? "flex w-full gap-2" : "flex w-full flex-col gap-2 sm:flex-row"}
    >
      <label htmlFor="search-q" className="sr-only">
        Search repositories
      </label>
      <input
        id="search-q"
        name="q"
        type="search"
        defaultValue={defaultQuery}
        placeholder="Search agents, RAG, inference, local AI…"
        autoFocus={autofocus}
        autoComplete="off"
        className="w-full border border-border bg-paper-elevated px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus-visible:border-accent"
      />
      <button
        type="submit"
        className="shrink-0 border border-ink bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent hover:border-accent"
      >
        Search
      </button>
    </form>
  );
}

export function SearchFormWithFilters({
  filters,
}: {
  filters: SearchFilters;
}) {
  return (
    <form action="/explore" method="get" role="search" className="flex gap-2">
      <label htmlFor="explore-q" className="sr-only">
        Search query
      </label>
      <input
        id="explore-q"
        name="q"
        type="search"
        defaultValue={filters.q ?? ""}
        placeholder="Search repositories…"
        autoComplete="off"
        className="w-full border border-border bg-paper-elevated px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
      />
      {/* Preserve active filters when searching */}
      {filters.category ? (
        <input type="hidden" name="category" value={filters.category} />
      ) : null}
      {filters.language ? (
        <input type="hidden" name="language" value={filters.language} />
      ) : null}
      {filters.license ? (
        <input type="hidden" name="license" value={filters.license} />
      ) : null}
      {filters.maintenance ? (
        <input type="hidden" name="maintenance" value={filters.maintenance} />
      ) : null}
      {filters.difficulty ? (
        <input type="hidden" name="difficulty" value={filters.difficulty} />
      ) : null}
      {filters.selfHostable ? (
        <input type="hidden" name="selfHostable" value="1" />
      ) : null}
      {filters.localOfflineCapable ? (
        <input type="hidden" name="localOfflineCapable" value="1" />
      ) : null}
      {filters.minStars != null ? (
        <input type="hidden" name="minStars" value={String(filters.minStars)} />
      ) : null}
      {filters.sort && filters.sort !== "score" ? (
        <input type="hidden" name="sort" value={filters.sort} />
      ) : null}
      <button
        type="submit"
        className="shrink-0 border border-ink bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-accent hover:border-accent"
      >
        Search
      </button>
    </form>
  );
}
