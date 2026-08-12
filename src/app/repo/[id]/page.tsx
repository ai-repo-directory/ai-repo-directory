import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { RepoGrid } from "@/components/RepoGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { Stat } from "@/components/Stat";
import { getCategoryById } from "@/lib/categories";
import {
  getRepositoryById,
  getSimilarRepositories,
  loadEnrichedRepositories,
} from "@/lib/data";
import { formatDate, formatNumber } from "@/lib/format";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return loadEnrichedRepositories().map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const repo = getRepositoryById(id);
  if (!repo) {
    return { title: "Repository not found" };
  }
  const description =
    repo.editorialSummary ||
    repo.description ||
    `${repo.owner}/${repo.repo} on AI Repo Directory`;
  return {
    title: `${repo.name} — ${repo.owner}/${repo.repo}`,
    description,
    openGraph: {
      title: repo.name,
      description,
      url: `/repo/${repo.id}`,
    },
  };
}

export default async function RepoPage({ params }: Props) {
  const { id } = await params;
  const repo = getRepositoryById(id);
  if (!repo) notFound();

  const category = getCategoryById(repo.primaryCategory);
  const similar = getSimilarRepositories(repo);
  const breakdown = repo.scoreBreakdown;
  const secondary = repo.secondaryCategories
    .map((c) => getCategoryById(c))
    .filter(Boolean);

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
          {category ? (
            <>
              <li>
                <Link
                  href={`/category/${category.slug}`}
                  className="hover:text-accent"
                >
                  {category.shortLabel}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
            </>
          ) : null}
          <li className="text-ink-muted">{repo.name}</li>
        </ol>
      </nav>

      <header className="mt-4 max-w-3xl border-b border-border pb-6">
        <div className="flex flex-wrap items-start gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            {repo.name}
          </h1>
          {repo.featured ? <Badge tone="accent">Featured</Badge> : null}
          {repo.emerging ? <Badge tone="success">Emerging</Badge> : null}
          {repo.effectiveArchived ? (
            <Badge tone="warning">Archived</Badge>
          ) : null}
        </div>
        <p className="mono mt-1 text-sm text-ink-faint">
          {repo.owner}/{repo.repo}
        </p>

        <section className="mt-4" aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="sr-only">
            Overview
          </h2>
          <p className="text-base text-ink-muted">{repo.editorialSummary}</p>
        </section>

        <p className="mt-3 text-sm text-ink">
          <span className="font-medium">Why it matters: </span>
          <span className="text-ink-muted">{repo.whyCare}</span>
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={repo.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex border border-ink bg-ink px-4 py-2 text-sm font-medium text-paper no-underline hover:border-accent hover:bg-accent"
          >
            View on GitHub
          </a>
          {repo.homepage ? (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex border border-border bg-paper-elevated px-4 py-2 text-sm font-medium text-ink no-underline hover:border-border-strong"
            >
              Homepage
            </a>
          ) : null}
        </div>
      </header>

      <dl className="mt-8 grid grid-cols-2 gap-4 border border-border bg-paper-elevated p-4 sm:grid-cols-3 lg:grid-cols-6">
        <Stat
          label="Score"
          value={repo.score.toFixed(1)}
          hint="Discovery score"
        />
        <Stat label="Stars" value={formatNumber(repo.effectiveStars)} />
        <Stat label="Forks" value={formatNumber(repo.effectiveForks)} />
        <Stat label="Language" value={repo.effectiveLanguage ?? "—"} />
        <Stat label="License" value={repo.effectiveLicense ?? "—"} />
        <Stat label="Updated" value={formatDate(repo.effectivePushedAt)} />
      </dl>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-6">
          <section aria-labelledby="details-heading">
            <h2
              id="details-heading"
              className="text-lg font-semibold tracking-tight text-ink"
            >
              Details
            </h2>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-ink-faint">Primary category</dt>
                <dd className="mt-0.5">
                  {category ? (
                    <Link
                      href={`/category/${category.slug}`}
                      className="text-accent underline-offset-2 hover:underline"
                    >
                      {category.name}
                    </Link>
                  ) : (
                    repo.primaryCategory
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-ink-faint">Maintenance</dt>
                <dd className="mt-0.5 capitalize text-ink">{repo.maintenance}</dd>
              </div>
              <div>
                <dt className="text-ink-faint">Difficulty</dt>
                <dd className="mt-0.5 capitalize text-ink">{repo.difficulty}</dd>
              </div>
              <div>
                <dt className="text-ink-faint">Documentation</dt>
                <dd className="mt-0.5 capitalize text-ink">
                  {repo.documentationQuality}
                </dd>
              </div>
              <div>
                <dt className="text-ink-faint">Self-hostable</dt>
                <dd className="mt-0.5 text-ink">
                  {repo.selfHostable ? "Yes" : "No"}
                </dd>
              </div>
              <div>
                <dt className="text-ink-faint">Local / offline</dt>
                <dd className="mt-0.5 text-ink">
                  {repo.localOfflineCapable ? "Yes" : "No"}
                </dd>
              </div>
              {repo.latestRelease || repo.github?.latestRelease ? (
                <div>
                  <dt className="text-ink-faint">Latest release</dt>
                  <dd className="mono mt-0.5 text-ink">
                    {repo.latestRelease ?? repo.github?.latestRelease}
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="text-ink-faint">Last verified</dt>
                <dd className="mt-0.5 text-ink">
                  {formatDate(repo.dateLastVerified)}
                </dd>
              </div>
            </dl>

            {(category || secondary.length > 0 || repo.tags.length > 0) && (
              <ul
                className="mt-4 flex list-none flex-wrap gap-1.5 p-0"
                aria-label="Categories and tags"
              >
                {category ? (
                  <li>
                    <Link href={`/category/${category.slug}`}>
                      <Badge tone="accent">{category.name}</Badge>
                    </Link>
                  </li>
                ) : null}
                {secondary.map((c) =>
                  c ? (
                    <li key={c.id}>
                      <Link href={`/category/${c.slug}`}>
                        <Badge>{c.name}</Badge>
                      </Link>
                    </li>
                  ) : null,
                )}
                {repo.tags.map((tag) => (
                  <li key={tag}>
                    <Badge>{tag}</Badge>
                  </li>
                ))}
              </ul>
            )}

            {repo.audience.length > 0 ? (
              <p className="mt-4 text-sm text-ink-muted">
                Audience:{" "}
                <span className="text-ink">{repo.audience.join(", ")}</span>
              </p>
            ) : null}
          </section>

          {breakdown ? (
            <section aria-labelledby="score-heading">
              <h2
                id="score-heading"
                className="text-lg font-semibold tracking-tight text-ink"
              >
                Score breakdown
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Practical discovery heuristic — see{" "}
                <Link
                  href="/methodology"
                  className="text-accent underline-offset-2 hover:underline"
                >
                  methodology
                </Link>
                .
              </p>
              <ul className="mt-3 list-none space-y-2 p-0">
                {(
                  [
                    ["Adoption", breakdown.adoption],
                    ["Maintenance", breakdown.maintenance],
                    ["Activity", breakdown.activity],
                    ["Documentation", breakdown.documentation],
                    ["Maturity", breakdown.maturity],
                    ["Ecosystem", breakdown.ecosystem],
                    ["Usefulness", breakdown.usefulness],
                  ] as const
                ).map(([label, value]) => (
                  <li key={label} className="flex items-center gap-3 text-sm">
                    <span className="w-28 shrink-0 text-ink-muted">{label}</span>
                    <div
                      className="h-2 flex-1 bg-border"
                      role="meter"
                      aria-label={label}
                      aria-valuenow={Math.round(value)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full bg-accent"
                        style={{ width: `${Math.min(100, value)}%` }}
                      />
                    </div>
                    <span className="mono w-10 text-right text-ink">
                      {value.toFixed(0)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="h-fit border border-border bg-paper-elevated p-4">
          <h2 className="text-sm font-semibold text-ink">Quick facts</h2>
          <ul className="mt-3 list-none space-y-2 p-0 text-sm text-ink-muted">
            <li>Demo available: {repo.demoAvailable ? "Yes" : "No"}</li>
            <li>
              Historically significant:{" "}
              {repo.historicallySignificant ? "Yes" : "No"}
            </li>
            {repo.notes ? <li className="pt-2 text-xs">{repo.notes}</li> : null}
          </ul>
          {repo.sources.length > 0 ? (
            <div className="mt-4 border-t border-border pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Sources
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-ink-muted">
                {repo.sources.map((s) => (
                  <li key={s} className="break-all">
                    <a href={s} rel="noopener noreferrer" target="_blank">
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>

      <section aria-labelledby="similar-heading" className="mt-12">
        <SectionHeader
          id="similar-heading"
          title="Similar projects"
          description="Related by category and tags."
        />
        <RepoGrid
          repos={similar}
          emptyTitle="No similar projects found"
          emptyDescription="Not enough related repositories in the catalog yet."
        />
      </section>
    </div>
  );
}
