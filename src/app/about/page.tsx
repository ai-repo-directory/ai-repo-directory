import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "About AI Repo Directory — a curated, independently verified directory of AI repositories for engineers and researchers.",
};

export default function AboutPage() {
  return (
    <div className="site-container py-8 sm:py-10">
      <article className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">About</h1>
        <div className="prose-tight mt-4 text-base">
          <p>
            AI Repo Directory is a curated, growing discovery catalog of
            high-signal AI projects: coding agents, RAG stacks, inference
            servers, local AI, infrastructure, and related research
            implementations. It is not an exhaustive index of every AI
            repository on GitHub.
          </p>
          <p>
            Listings are independently verified against GitHub metadata and
            project docs. GitHub stats are refreshed on a weekly cadence (not
            real-time). Composite scores help you scan quickly and dig deeper
            when something looks relevant.
          </p>
          <p>
            Most entries are open source; some are source-available or have
            dual licensing. Maintenance signals and licenses are shown
            honestly — density over marketing.
          </p>
        </div>

        <h2 className="mt-8 text-lg font-semibold text-ink">What you can do</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-muted">
          <li>
            Search and filter the catalog on{" "}
            <Link
              href="/explore"
              className="text-accent underline-offset-2 hover:underline"
            >
              Explore
            </Link>
          </li>
          <li>Browse categories and curated collections from the homepage</li>
          <li>
            Read per-repo score breakdowns and similar projects on detail pages
          </li>
          <li>
            Learn how ranking works on{" "}
            <Link
              href="/methodology"
              className="text-accent underline-offset-2 hover:underline"
            >
              Methodology
            </Link>
          </li>
        </ul>

        <p className="mt-8 text-sm text-ink-faint">
          Not affiliated with GitHub or any of the listed projects. Metadata is
          editorially maintained and refreshed periodically — it may lag
          upstream changes. Home “Most starred” ranks by total stars, not
          star-velocity trending.
        </p>
      </article>
    </div>
  );
}
