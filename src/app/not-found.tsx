import Link from "next/link";

export default function NotFound() {
  return (
    <div className="site-container flex flex-col items-start py-16 sm:py-24">
      <p className="mono text-sm text-ink-faint">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-ink-muted">
        That route does not exist, or the repository / category was removed from
        the catalog.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/"
          className="border border-ink bg-ink px-4 py-2 text-sm font-medium text-paper no-underline hover:border-accent hover:bg-accent"
        >
          Home
        </Link>
        <Link
          href="/explore"
          className="border border-border bg-paper-elevated px-4 py-2 text-sm font-medium text-ink no-underline hover:border-border-strong"
        >
          Explore
        </Link>
      </div>
    </div>
  );
}
