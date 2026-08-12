import Link from "next/link";
import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  children?: ReactNode;
}) {
  return (
    <div
      role="status"
      className="border border-dashed border-border-strong bg-paper-elevated px-5 py-10 text-center"
    >
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
          {description}
        </p>
      ) : null}
      {children}
      {actionHref && actionLabel ? (
        <p className="mt-4">
          <Link
            href={actionHref}
            className="text-sm font-medium text-accent underline-offset-2 hover:underline"
          >
            {actionLabel}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
