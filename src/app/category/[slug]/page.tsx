import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryNav } from "@/components/CategoryNav";
import { EmptyState } from "@/components/EmptyState";
import { RepoGrid } from "@/components/RepoGrid";
import { CATEGORIES, getCategoryBySlug } from "@/lib/categories";
import { getRepositoriesByCategory } from "@/lib/data";
import { formatNumber } from "@/lib/format";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const repos = getRepositoriesByCategory(category.id);

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
          <li>
            <Link href="/explore" className="hover:text-accent">
              Explore
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink-muted">{category.name}</li>
        </ol>
      </nav>

      <header className="mt-4 max-w-3xl border-b border-border pb-6">
        <p className="mono text-xs uppercase tracking-wider text-ink-faint">
          Category
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
          {category.name}
        </h1>
        <p className="mt-2 text-base text-ink-muted">{category.description}</p>
        <p className="mt-2 text-sm text-ink-faint">
          <span className="mono text-ink">{formatNumber(repos.length)}</span>{" "}
          repositories
          {" · "}
          <Link
            href={`/explore?category=${category.id}`}
            className="text-accent underline-offset-2 hover:underline"
          >
            Open in explore
          </Link>
        </p>
      </header>

      <div className="mt-6">
        <CategoryNav dense activeSlug={category.slug} />
      </div>

      <div className="mt-8">
        {repos.length === 0 ? (
          <EmptyState
            title={`No repositories in ${category.name}`}
            description="This category is empty until canonical data is loaded."
            actionHref="/explore"
            actionLabel="Explore all"
          />
        ) : (
          <RepoGrid repos={repos} showCategory={false} />
        )}
      </div>
    </div>
  );
}
