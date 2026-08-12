import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { COLLECTIONS } from "@/lib/collections";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-paper-elevated">
      <div className="site-container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-semibold text-ink">AI Repo Directory</p>
          <p className="mt-2 text-sm text-ink-muted">
            A curated, scored index of open-source AI repositories for engineers
            and researchers.
          </p>
        </div>

        <div>
          <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-ink-faint">
            Browse
          </p>
          <ul className="mt-2 list-none space-y-1.5 p-0 text-sm">
            <li>
              <Link href="/explore" className="text-ink-muted no-underline hover:text-accent">
                Explore all
              </Link>
            </li>
            {COLLECTIONS.slice(0, 4).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/collection/${c.slug}`}
                  className="text-ink-muted no-underline hover:text-accent"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-ink-faint">
            Categories
          </p>
          <ul className="mt-2 list-none space-y-1.5 p-0 text-sm">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/category/${c.slug}`}
                  className="text-ink-muted no-underline hover:text-accent"
                >
                  {c.shortLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-ink-faint">
            About
          </p>
          <ul className="mt-2 list-none space-y-1.5 p-0 text-sm">
            <li>
              <Link href="/methodology" className="text-ink-muted no-underline hover:text-accent">
                Ranking methodology
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-ink-muted no-underline hover:text-accent">
                About this project
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="site-container flex flex-wrap items-center justify-between gap-2 py-4 text-xs text-ink-faint">
          <p>Editorial curation + transparent scoring. Not affiliated with GitHub.</p>
          <p className="mono">ai-repo-directory</p>
        </div>
      </div>
    </footer>
  );
}
