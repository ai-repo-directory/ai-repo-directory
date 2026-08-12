import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { MAINTENANCE_SIGNALS, DIFFICULTIES } from "@/lib/types";
import type { SearchFilters } from "@/lib/search";

const selectClass =
  "w-full border border-border bg-paper-elevated px-2.5 py-1.5 text-sm text-ink";

const labelClass = "mb-1 block text-[0.6875rem] font-medium uppercase tracking-wide text-ink-faint";

export function FilterBar({
  filters,
  languages,
  licenses,
  resultCount,
}: {
  filters: SearchFilters;
  languages: string[];
  licenses: string[];
  resultCount: number;
}) {
  const clearHref = filters.q ? `/explore?q=${encodeURIComponent(filters.q)}` : "/explore";
  const hasActive =
    Boolean(filters.category) ||
    Boolean(filters.language) ||
    Boolean(filters.license) ||
    Boolean(filters.maintenance) ||
    Boolean(filters.difficulty) ||
    Boolean(filters.selfHostable) ||
    Boolean(filters.localOfflineCapable) ||
    filters.minStars != null ||
    (filters.sort && filters.sort !== "score");

  return (
    <form
      action="/explore"
      method="get"
      className="border border-border bg-paper-elevated p-4"
      aria-label="Filter repositories"
    >
      {filters.q ? <input type="hidden" name="q" value={filters.q} /> : null}

      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm text-ink-muted">
          <span className="mono font-medium text-ink">{resultCount}</span>{" "}
          {resultCount === 1 ? "result" : "results"}
        </p>
        {hasActive ? (
          <Link
            href={clearHref}
            className="text-sm text-accent underline-offset-2 hover:underline"
          >
            Clear filters
          </Link>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="filter-category" className={labelClass}>
            Category
          </label>
          <select
            id="filter-category"
            name="category"
            defaultValue={filters.category ?? ""}
            className={selectClass}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-language" className={labelClass}>
            Language
          </label>
          <select
            id="filter-language"
            name="language"
            defaultValue={filters.language ?? ""}
            className={selectClass}
          >
            <option value="">Any language</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-license" className={labelClass}>
            License
          </label>
          <select
            id="filter-license"
            name="license"
            defaultValue={filters.license ?? ""}
            className={selectClass}
          >
            <option value="">Any license</option>
            {licenses.map((lic) => (
              <option key={lic} value={lic}>
                {lic}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-maintenance" className={labelClass}>
            Maintenance
          </label>
          <select
            id="filter-maintenance"
            name="maintenance"
            defaultValue={filters.maintenance ?? ""}
            className={selectClass}
          >
            <option value="">Any status</option>
            {MAINTENANCE_SIGNALS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-difficulty" className={labelClass}>
            Difficulty
          </label>
          <select
            id="filter-difficulty"
            name="difficulty"
            defaultValue={filters.difficulty ?? ""}
            className={selectClass}
          >
            <option value="">Any level</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-minStars" className={labelClass}>
            Min stars
          </label>
          <input
            id="filter-minStars"
            name="minStars"
            type="number"
            min={0}
            step={100}
            defaultValue={filters.minStars ?? ""}
            placeholder="e.g. 1000"
            className={selectClass}
          />
        </div>

        <div>
          <label htmlFor="filter-sort" className={labelClass}>
            Sort by
          </label>
          <select
            id="filter-sort"
            name="sort"
            defaultValue={filters.sort ?? "score"}
            className={selectClass}
          >
            <option value="score">Discovery score</option>
            <option value="stars">Stars</option>
            <option value="recent">Recently updated</option>
            <option value="name">Name</option>
          </select>
        </div>

        <fieldset className="sm:col-span-2 lg:col-span-1">
          <legend className={labelClass}>Capabilities</legend>
          <div className="flex flex-col gap-2 pt-1">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="selfHostable"
                value="1"
                defaultChecked={filters.selfHostable === true}
                className="border-border"
              />
              Self-hostable
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="localOfflineCapable"
                value="1"
                defaultChecked={filters.localOfflineCapable === true}
                className="border-border"
              />
              Local / offline
            </label>
          </div>
        </fieldset>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="border border-ink bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-accent hover:border-accent"
        >
          Apply filters
        </button>
      </div>
    </form>
  );
}
