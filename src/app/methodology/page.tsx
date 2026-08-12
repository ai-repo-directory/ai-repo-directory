import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ranking methodology",
  description:
    "How AI Repo Directory computes transparent discovery scores from adoption, maintenance, activity, documentation, and usefulness signals.",
};

export default function MethodologyPage() {
  return (
    <div className="site-container py-8 sm:py-10">
      <article className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Ranking methodology
        </h1>
        <p className="mt-3 text-base text-ink-muted">
          Scores are a practical discovery heuristic (0–100), not a scientific
          ranking of research quality. They help surface maintained, useful,
          well-documented projects alongside raw popularity.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-ink">Weighted signals</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-muted">
          <li>
            <span className="font-medium text-ink">Adoption (18%)</span> —
            log-scaled stars as a proxy for community uptake.
          </li>
          <li>
            <span className="font-medium text-ink">Maintenance (16%)</span> —
            editorial maintenance signal; archived projects are heavily
            down-weighted.
          </li>
          <li>
            <span className="font-medium text-ink">Activity (16%)</span> — recency
            of pushes / commits.
          </li>
          <li>
            <span className="font-medium text-ink">Documentation (12%)</span> —
            assessed documentation quality.
          </li>
          <li>
            <span className="font-medium text-ink">Maturity (12%)</span> —
            releases, historical significance, archive status.
          </li>
          <li>
            <span className="font-medium text-ink">Ecosystem (12%)</span> — tags,
            secondary categories, featured / emerging flags.
          </li>
          <li>
            <span className="font-medium text-ink">Usefulness (14%)</span> —
            self-hostable, local/offline, demos, beginner-friendliness.
          </li>
        </ul>

        <h2 className="mt-8 text-lg font-semibold text-ink">Editorial layer</h2>
        <div className="prose-tight mt-3 text-sm">
          <p>
            Every listed repository includes human-written summaries and
            &ldquo;why care&rdquo; notes. Featured and emerging flags are
            editorial judgments on top of the numeric score.
          </p>
          <p>
            Implementation lives in{" "}
            <span className="mono text-ink">src/lib/ranking.ts</span>; scores are
            written by <span className="mono text-ink">pnpm rank</span> to{" "}
            <span className="mono text-ink">data/derived/scores.json</span>. See
            also <span className="mono text-ink">RANKING_METHODOLOGY.md</span> in
            the repository.
          </p>
        </div>

        <p className="mt-8 text-sm">
          <Link
            href="/explore"
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            Explore repositories
          </Link>
          {" · "}
          <Link
            href="/about"
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            About this directory
          </Link>
        </p>
      </article>
    </div>
  );
}
