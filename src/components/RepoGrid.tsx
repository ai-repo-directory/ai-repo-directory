import { EmptyState } from "./EmptyState";
import { RepoCard } from "./RepoCard";
import type { EnrichedRepository } from "@/lib/types";

export function RepoGrid({
  repos,
  emptyTitle = "No repositories found",
  emptyDescription = "Try adjusting filters or check back after the catalog is refreshed.",
  showCategory = true,
}: {
  repos: EnrichedRepository[];
  emptyTitle?: string;
  emptyDescription?: string;
  showCategory?: boolean;
}) {
  if (repos.length === 0) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <ul className="grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <li key={repo.id}>
          <RepoCard repo={repo} showCategory={showCategory} />
        </li>
      ))}
    </ul>
  );
}
