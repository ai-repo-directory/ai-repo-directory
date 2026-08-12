import type { Metadata } from "next";
import Link from "next/link";
import { CategoryNav } from "@/components/CategoryNav";
import { EmptyState } from "@/components/EmptyState";
import { RepoGrid } from "@/components/RepoGrid";
import { SearchForm } from "@/components/SearchForm";
import { SectionHeader } from "@/components/SectionHeader";
import { CATEGORIES } from "@/lib/categories";
import { COLLECTIONS } from "@/lib/collections";
import { getHomeHighlights, loadEnrichedRepositories } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import type { EnrichedRepository } from "@/lib/types";

export const metadata: Metadata = {
  title: "AI Repo Directory — Curated AI discovery",
  description:
    "Search and browse a curated, independently verified directory of AI repositories: coding agents, local AI, RAG, inference servers, and more.",
};

export default function HomePage() {
  const repos = loadEnrichedRepositories();
  const highlights = getHomeHighlights(repos);

  return (
    <div className="site-container py-8 sm:py-10">
      <section className="border-b border-border pb-8" aria-labelledby="home-heading">
        <h1
          id="home-heading"
          className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          AI Repo Directory
        </h1>
        <p className="mt-2 max-w-2xl text-base text-ink-muted">
          Curated, regularly refreshed AI repos — scored for usefulness, not stars
          alone.
        </p>
        <div className="mt-5 max-w-xl">
          <SearchForm autofocus />
        </div>
        <p className="mt-3 text-sm text-ink-faint">
          {repos.length > 0 ? (
            <>
              <span className="mono text-ink">{formatNumber(repos.length)}</span>{" "}
              curated projects ·{" "}
              <Link href="/explore" className="text-accent underline-offset-2 hover:underline">
                Browse all
              </Link>
              {" · "}
              <Link
                href="/methodology"
                className="text-accent underline-offset-2 hover:underline"
              >
                How scoring works
              </Link>
            </>
          ) : (
            <>No listings loaded yet — run <span className="mono">pnpm merge-data</span>.</>
          )}
        </p>
      </section>

      <section className="py-8" aria-labelledby="categories-heading">
        <SectionHeader
          id="categories-heading"
          title="Categories"
          description={`${CATEGORIES.length} topic areas`}
        />
        <CategoryNav />
      </section>

      {repos.length === 0 ? (
        <EmptyState
          title="No repositories yet"
          description="Merge research data into data/canonical to populate the directory."
          actionHref="/explore"
          actionLabel="Open explore"
        />
      ) : (
        <>
          <HomeSection
            title="Editor's picks"
            description="Featured projects with strong practical signal"
            href="/explore?sort=score"
            repos={highlights.featured}
          />
          <HomeSection
            title="Most starred"
            description="Highest adoption in the catalog (not star-velocity trending)"
            href="/explore?sort=stars"
            repos={highlights.trending}
          />
          <HomeSection
            title="Recently updated"
            description="Newest known push activity"
            href="/explore?sort=recent"
            repos={highlights.recentlyUpdated}
          />
          <HomeSection
            title="Emerging"
            description="Newer projects with momentum"
            href="/collection/emerging-ai"
            repos={highlights.emerging}
          />
          <HomeSection
            title="Local AI"
            description="Run capable stacks on your own hardware"
            href="/collection/best-local-ai"
            repos={highlights.local}
          />
          <HomeSection
            title="Coding agents"
            description="AI pair programmers and developer automation"
            href="/collection/best-coding-agents"
            repos={highlights.coding}
          />

          <section className="border-t border-border py-8" aria-labelledby="collections-heading">
            <SectionHeader
              id="collections-heading"
              title="Collections"
              description="Opinionated shortlists for common discovery jobs"
            />
            <ul className="mt-4 grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {COLLECTIONS.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/collection/${c.slug}`}
                    className="block border border-border bg-paper-elevated p-3 no-underline transition-colors hover:border-border-strong"
                  >
                    <span className="text-sm font-semibold text-ink">{c.title}</span>
                    <span className="mt-1 block text-xs text-ink-muted line-clamp-2">
                      {c.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

function HomeSection({
  title,
  description,
  href,
  repos,
}: {
  title: string;
  description: string;
  href: string;
  repos: EnrichedRepository[];
}) {
  if (repos.length === 0) return null;
  return (
    <section className="border-t border-border py-8">
      <SectionHeader title={title} description={description} href={href} />
      <RepoGrid repos={repos} />
    </section>
  );
}
