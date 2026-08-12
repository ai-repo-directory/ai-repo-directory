import Link from "next/link";
import { Badge } from "./Badge";
import { getCategoryById } from "@/lib/categories";
import { formatDate, formatNumber } from "@/lib/format";
import type { EnrichedRepository } from "@/lib/types";

export function RepoCard({
  repo,
  showCategory = true,
}: {
  repo: EnrichedRepository;
  showCategory?: boolean;
}) {
  const category = getCategoryById(repo.primaryCategory);

  return (
    <article className="group border border-border bg-paper-elevated transition-colors hover:border-border-strong hover:bg-white">
      <Link
        href={`/repo/${repo.id}`}
        className="block p-4 no-underline focus-visible:outline-offset-[-2px]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[0.975rem] font-semibold text-ink group-hover:text-accent">
              {repo.name}
            </h3>
            <p className="mono mt-0.5 truncate text-xs text-ink-faint">
              {repo.owner}/{repo.repo}
            </p>
          </div>
          <span
            className="mono shrink-0 text-xs font-medium text-ink-muted"
            title={`Discovery score ${repo.score}`}
          >
            {repo.score.toFixed(1)}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
          {repo.editorialSummary}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-faint">
          {showCategory && category ? (
            <Badge tone="accent">{category.shortLabel}</Badge>
          ) : null}
          {repo.effectiveLanguage ? (
            <span>{repo.effectiveLanguage}</span>
          ) : null}
          <span title="Stars">★ {formatNumber(repo.effectiveStars)}</span>
          {repo.effectivePushedAt ? (
            <span>Updated {formatDate(repo.effectivePushedAt)}</span>
          ) : null}
          {repo.effectiveArchived ? <Badge tone="warning">Archived</Badge> : null}
          {repo.emerging ? <Badge tone="success">Emerging</Badge> : null}
        </div>
      </Link>
    </article>
  );
}
