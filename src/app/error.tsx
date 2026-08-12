"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="site-container flex flex-col items-start py-16 sm:py-24">
      <p className="mono text-sm text-ink-faint">Error</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-ink-muted">
        An unexpected error occurred while rendering this page. You can retry or
        return home.
      </p>
      {error.digest ? (
        <p className="mono mt-2 text-xs text-ink-faint">
          Digest: {error.digest}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="border border-ink bg-ink px-4 py-2 text-sm font-medium text-paper hover:border-accent hover:bg-accent"
        >
          Try again
        </button>
        <a
          href="/"
          className="border border-border bg-paper-elevated px-4 py-2 text-sm font-medium text-ink no-underline hover:border-border-strong"
        >
          Home
        </a>
      </div>
    </div>
  );
}
