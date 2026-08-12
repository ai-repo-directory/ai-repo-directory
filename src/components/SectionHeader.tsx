import Link from "next/link";
import type { ReactNode } from "react";

export function SectionHeader({
  title,
  description,
  href,
  linkLabel = "View all",
  id,
  children,
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  id?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 id={id} className="text-lg font-semibold tracking-tight text-ink">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-ink-muted">{description}</p>
        ) : null}
        {children}
      </div>
      {href ? (
        <Link
          href={href}
          className="shrink-0 text-sm font-medium text-accent underline-offset-2 hover:underline"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
