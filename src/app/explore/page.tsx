import type { Metadata } from "next";
import { EmptyState } from "@/components/EmptyState";
import { FilterBar } from "@/components/FilterBar";
import { RepoGrid } from "@/components/RepoGrid";
import { SearchFormWithFilters } from "@/components/SearchForm";
import { loadEnrichedRepositories } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import {
  filterRepositories,
  parseFilters,
  uniqueLanguages,
  uniqueLicenses,
} from "@/lib/search";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Search and filter open-source AI repositories by category, language, license, maintenance, and more. Filters are shareable via URL.",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const all = loadEnrichedRepositories();
  const results = filterRepositories(all, filters);
  const languages = uniqueLanguages(all);
  const licenses = uniqueLicenses(all);

  return (
    <div className="site-container py-8 sm:py-10">
      <header className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Explore
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Full-text search plus filters. Query parameters are shareable — copy
          the URL to preserve your view.
        </p>
        <div className="mt-4">
          <SearchFormWithFilters filters={filters} />
        </div>
      </header>

      <div className="mt-6">
        <FilterBar
          filters={filters}
          languages={languages}
          licenses={licenses}
          resultCount={results.length}
        />
      </div>

      <p className="mt-4 text-sm text-ink-faint" aria-live="polite">
        <span className="mono text-ink">{formatNumber(results.length)}</span>{" "}
        {results.length === 1 ? "result" : "results"}
        {all.length > 0 ? (
          <>
            {" "}
            of <span className="mono">{formatNumber(all.length)}</span>
          </>
        ) : null}
      </p>

      <div className="mt-6">
        {results.length === 0 ? (
          <EmptyState
            title={
              all.length === 0
                ? "Catalog is empty"
                : "No repositories match these filters"
            }
            description={
              all.length === 0
                ? "Load canonical repository data to populate explore results."
                : "Clear filters or try a broader search query."
            }
            actionHref="/explore"
            actionLabel="Reset explore"
          />
        ) : (
          <RepoGrid repos={results} />
        )}
      </div>
    </div>
  );
}
