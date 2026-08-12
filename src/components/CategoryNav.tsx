import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export function CategoryNav({
  dense = false,
  activeSlug,
}: {
  dense?: boolean;
  activeSlug?: string;
}) {
  return (
    <nav aria-label="Categories">
      <ul
        className={
          dense
            ? "flex list-none flex-wrap gap-2 p-0"
            : "grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-4"
        }
      >
        {CATEGORIES.map((category) => {
          const active = activeSlug === category.slug;
          return (
            <li key={category.id}>
              <Link
                href={`/category/${category.slug}`}
                className={
                  dense
                    ? `inline-flex border px-2.5 py-1 text-sm no-underline transition-colors ${
                        active
                          ? "border-ink bg-ink text-paper"
                          : "border-border bg-paper-elevated text-ink-muted hover:border-border-strong hover:text-ink"
                      }`
                    : `block h-full border border-border bg-paper-elevated p-3 no-underline transition-colors hover:border-border-strong ${
                        active ? "border-ink ring-1 ring-ink" : ""
                      }`
                }
              >
                {dense ? (
                  category.shortLabel
                ) : (
                  <>
                    <span className="block text-sm font-semibold text-ink">
                      {category.name}
                    </span>
                    <span className="mt-1 block text-xs text-ink-muted line-clamp-2">
                      {category.description}
                    </span>
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
