import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { RepoGrid } from "@/components/RepoGrid";
import { COLLECTIONS, getCollectionBySlug } from "@/lib/collections";
import { getCollectionRepositories } from "@/lib/data";
import { formatNumber } from "@/lib/format";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "Collection not found" };
  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const repos = getCollectionRepositories(collection.slug);
  const others = COLLECTIONS.filter((c) => c.id !== collection.id);

  return (
    <div className="site-container py-8 sm:py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-faint">
        <ol className="flex list-none flex-wrap items-center gap-1.5 p-0">
          <li>
            <Link href="/" className="hover:text-accent">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink-muted">{collection.title}</li>
        </ol>
      </nav>

      <header className="mt-4 max-w-3xl border-b border-border pb-6">
        <p className="mono text-xs uppercase tracking-wider text-ink-faint">
          Collection
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
          {collection.title}
        </h1>
        <p className="mt-2 text-base text-ink-muted">
          {collection.description}
        </p>
        <p className="mt-2 text-sm text-ink-faint">
          <span className="mono text-ink">{formatNumber(repos.length)}</span>{" "}
          repositories
        </p>
      </header>

      <div className="mt-8">
        {repos.length === 0 ? (
          <EmptyState
            title="This collection is empty"
            description="No matching repositories yet — check back after the catalog is refreshed."
            actionHref="/explore"
            actionLabel="Explore all"
          />
        ) : (
          <RepoGrid repos={repos} />
        )}
      </div>

      {others.length > 0 ? (
        <section aria-labelledby="more-collections" className="mt-12">
          <h2
            id="more-collections"
            className="text-lg font-semibold tracking-tight text-ink"
          >
            More collections
          </h2>
          <ul className="mt-3 grid list-none gap-2 p-0 sm:grid-cols-2">
            {others.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/collection/${c.slug}`}
                  className="block border border-border bg-paper-elevated p-3 text-sm no-underline hover:border-border-strong"
                >
                  <span className="font-semibold text-ink">{c.title}</span>
                  <span className="mt-1 block text-xs text-ink-muted line-clamp-2">
                    {c.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
