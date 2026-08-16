"use client";

import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { FilterBar } from "@/components/FilterBar";
import { RepoGrid } from "@/components/RepoGrid";
import { SearchFormWithFilters } from "@/components/SearchForm";
import { formatNumber } from "@/lib/format";
import { filterRepositories, parseFilters, uniqueLanguages, uniqueLicenses } from "@/lib/search";
import type { EnrichedRepository } from "@/lib/types";

export function ExploreClient({ repositories }: { repositories: EnrichedRepository[] }) {
  const searchParams = useSearchParams();
  const filters = parseFilters(searchParams);
  const results = filterRepositories(repositories, filters);
  const languages = uniqueLanguages(repositories);
  const licenses = uniqueLicenses(repositories);

  return (
    <div className="site-container py-8 sm:py-10">
      <header className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Explore</h1>
        <p className="mt-2 text-sm text-ink-muted">Full-text search plus filters. Query parameters are shareable — copy the URL to preserve your view.</p>
        <div className="mt-4"><SearchFormWithFilters filters={filters} /></div>
      </header>
      <div className="mt-6"><FilterBar filters={filters} languages={languages} licenses={licenses} resultCount={results.length} /></div>
      <p className="mt-4 text-sm text-ink-faint" aria-live="polite"><span className="mono text-ink">{formatNumber(results.length)}</span> {results.length === 1 ? "result" : "results"} of <span className="mono">{formatNumber(repositories.length)}</span></p>
      <div className="mt-6">
        {results.length === 0 ? <EmptyState title="No repositories match these filters" description="Clear filters or try a broader search query." actionHref="/explore" actionLabel="Reset explore" /> : <RepoGrid repos={results} />}
      </div>
    </div>
  );
}
