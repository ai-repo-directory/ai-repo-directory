import Link from "next/link";
import { SearchForm } from "./SearchForm";

const NAV = [
  { href: "/explore", label: "Explore" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/95 backdrop-blur-sm">
      <div className="site-container flex h-[var(--header-height)] items-center gap-4">
        <Link
          href="/"
          className="shrink-0 no-underline"
          aria-label="AI Repo Directory home"
        >
          <span className="block text-sm font-semibold tracking-tight text-ink">
            AI Repo Directory
          </span>
          <span className="hidden text-[0.65rem] uppercase tracking-wider text-ink-faint sm:block">
            Open-source discovery
          </span>
        </Link>

        <div className="mx-auto hidden min-w-0 max-w-md flex-1 md:block">
          <SearchForm compact />
        </div>

        <nav aria-label="Primary" className="ml-auto">
          <ul className="flex list-none items-center gap-1 p-0 sm:gap-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="px-2 py-1 text-sm text-ink-muted no-underline hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
