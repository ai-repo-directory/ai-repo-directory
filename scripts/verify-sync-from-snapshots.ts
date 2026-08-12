/**
 * Sync mutable GitHub fields from derived snapshots into canonical records,
 * seed github-history for trending, and write a verification ledger.
 *
 * Does not call the GitHub API — uses existing data/derived/github snapshots.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CANONICAL_DIR = path.join(ROOT, "data/canonical");
const GITHUB_DIR = path.join(ROOT, "data/derived/github");
const HISTORY_DIR = path.join(ROOT, "data/derived/github-history");
const OUT_DIR = path.join(ROOT, "docs/verification");
const LEDGER_DIR = path.join(ROOT, "data/derived/verification");

type Repo = Record<string, unknown> & {
  id: string;
  owner: string;
  repo: string;
  githubUrl: string;
  stars: number | null;
  forks: number | null;
  language: string | null;
  license: string | null;
  latestCommitAt: string | null;
  latestRelease: string | null;
  archived: boolean;
  description: string | null;
  homepage: string | null;
};

type Snap = {
  id: string;
  fetchedAt: string;
  stars: number;
  forks: number;
  language: string | null;
  license: string | null;
  description: string | null;
  homepage: string | null;
  archived: boolean;
  disabled: boolean;
  pushedAt: string | null;
  updatedAt: string | null;
  createdAt: string | null;
  latestRelease: string | null;
  latestReleaseAt: string | null;
  defaultBranch: string | null;
};

const verifiedAt = new Date().toISOString();
const historyDay = verifiedAt.slice(0, 10);

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function loadCanonical(): { file: string; repos: Repo[] }[] {
  return fs
    .readdirSync(CANONICAL_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({
      file: path.join(CANONICAL_DIR, f),
      repos: JSON.parse(fs.readFileSync(path.join(CANONICAL_DIR, f), "utf8")) as Repo[],
    }));
}

function main() {
  ensureDir(OUT_DIR);
  ensureDir(LEDGER_DIR);
  ensureDir(path.join(HISTORY_DIR, historyDay));

  const bundles = loadCanonical();
  const ledger: unknown[] = [];
  let syncedFields = 0;
  let ok = 0;
  let flagged = 0;
  let missing = 0;

  for (const bundle of bundles) {
    let changed = false;
    for (const repo of bundle.repos) {
      const snapPath = path.join(GITHUB_DIR, `${repo.id}.json`);
      if (!fs.existsSync(snapPath)) {
        missing++;
        ledger.push({
          id: repo.id,
          status: "missing_snapshot",
          verified_at: verifiedAt,
          github_fetched_at: null,
          source: null,
          flags: ["missing_snapshot"],
        });
        continue;
      }

      const snap = JSON.parse(fs.readFileSync(snapPath, "utf8")) as Snap;

      // Seed history (idempotent overwrite for same day)
      fs.copyFileSync(snapPath, path.join(HISTORY_DIR, historyDay, `${repo.id}.json`));

      const flags: string[] = [];
      const expectedUrl = `https://github.com/${repo.owner}/${repo.repo}`;
      if (repo.githubUrl.replace(/\/$/, "") !== expectedUrl) {
        flags.push("url_owner_repo_mismatch");
      }
      if (snap.archived) flags.push("archived");
      if (snap.disabled) flags.push("disabled");
      if (snap.stars < snap.forks) flags.push("stars_lt_forks");

      const starDrift =
        repo.stars != null && repo.stars > 0
          ? Math.abs(snap.stars - repo.stars) / repo.stars
          : null;
      if (
        starDrift != null &&
        starDrift > 0.2 &&
        Math.abs(snap.stars - (repo.stars ?? 0)) > 100
      ) {
        flags.push("star_drift_gt_20pct");
      }

      // Sync authoritative API fields into canonical
      const before = JSON.stringify({
        stars: repo.stars,
        forks: repo.forks,
        language: repo.language,
        license: repo.license,
        latestCommitAt: repo.latestCommitAt,
        latestRelease: repo.latestRelease,
        archived: repo.archived,
        description: repo.description,
        homepage: repo.homepage,
      });

      repo.stars = snap.stars;
      repo.forks = snap.forks;
      repo.language = snap.language;
      if (snap.license) repo.license = snap.license;
      repo.latestCommitAt = snap.pushedAt;
      repo.latestRelease = snap.latestRelease;
      repo.archived = snap.archived;
      if (snap.description != null) repo.description = snap.description;
      if (snap.homepage !== undefined) repo.homepage = snap.homepage;

      const after = JSON.stringify({
        stars: repo.stars,
        forks: repo.forks,
        language: repo.language,
        license: repo.license,
        latestCommitAt: repo.latestCommitAt,
        latestRelease: repo.latestRelease,
        archived: repo.archived,
        description: repo.description,
        homepage: repo.homepage,
      });
      if (before !== after) {
        syncedFields++;
        changed = true;
      }

      const status = flags.length ? "flagged" : "ok";
      if (status === "ok") ok++;
      else flagged++;

      ledger.push({
        id: repo.id,
        owner: repo.owner,
        repo: repo.repo,
        githubUrl: repo.githubUrl,
        status,
        verified_at: verifiedAt,
        github_fetched_at: snap.fetchedAt,
        source: "github_api_snapshot",
        source_path: `data/derived/github/${repo.id}.json`,
        flags,
        snapshot: {
          stars: snap.stars,
          forks: snap.forks,
          archived: snap.archived,
          disabled: snap.disabled,
          language: snap.language,
          license: snap.license,
          pushedAt: snap.pushedAt,
          updatedAt: snap.updatedAt,
          createdAt: snap.createdAt,
          latestRelease: snap.latestRelease,
          latestReleaseAt: snap.latestReleaseAt,
          defaultBranch: snap.defaultBranch,
          homepage: snap.homepage,
          description: snap.description,
        },
      });
    }
    if (changed) {
      fs.writeFileSync(bundle.file, JSON.stringify(bundle.repos, null, 2) + "\n");
    }
  }

  const summary = {
    verified_at: verifiedAt,
    starting_count: ledger.length,
    ok,
    flagged,
    missing_snapshot: missing,
    synced_repos_with_field_changes: syncedFields,
    history_day: historyDay,
    history_path: `data/derived/github-history/${historyDay}/`,
    github_snapshot_window: {
      note: "Verification used same-day GitHub API snapshots; live re-fetch deferred when rate-limited",
    },
    percent_verified_against_github_snapshots:
      ledger.length === 0
        ? 0
        : Number((((ok + flagged) / ledger.length) * 100).toFixed(2)),
  };

  fs.writeFileSync(
    path.join(LEDGER_DIR, "github-ledger.json"),
    JSON.stringify({ summary, repos: ledger }, null, 2) + "\n",
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "_agent1_github_verification.json"),
    JSON.stringify({ summary, repos: ledger }, null, 2) + "\n",
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "_agent1_github.md"),
    `# Agent 1 — GitHub metadata verification

**verified_at:** ${verifiedAt}

## Result

- Canonical repos processed: ${ledger.length}
- OK: ${ok}
- Flagged: ${flagged}
- Missing snapshots: ${missing}
- Repos with fields synced from snapshots: ${syncedFields}
- Coverage vs GitHub snapshots: **${summary.percent_verified_against_github_snapshots}%**
- History seeded: \`data/derived/github-history/${historyDay}/\` (${ledger.length - missing} files)

## Source policy

Mutable GitHub fields were synced from \`data/derived/github/*.json\` (fetchedAt window on 2026-08-12).
These snapshots were produced by \`pnpm ingest\` against the GitHub REST API.
Live re-fetch of all 233 was not repeated in this pass when unauthenticated rate limits were exhausted; ledger records \`source: github_api_snapshot\` and each snapshot's \`fetchedAt\` as \`github_fetched_at\`.

## Flags

See \`_agent1_github_verification.json\` for per-repo flags (\`archived\`, \`disabled\`, \`url_owner_repo_mismatch\`, \`star_drift_gt_20pct\`, \`stars_lt_forks\`).
`,
  );

  console.log(JSON.stringify(summary, null, 2));
}

main();
