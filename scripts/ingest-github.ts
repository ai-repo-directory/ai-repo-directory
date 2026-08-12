import {
  githubSnapshotSchema,
  type GitHubSnapshot,
  type RepositoryRecord,
} from "../src/lib/types";
import { repositoryRecordSchema } from "../src/lib/types";
import {
  CANONICAL_DIR,
  ensureDir,
  githubHistorySnapshotPath,
  githubSnapshotPath,
  GITHUB_DIR,
  GITHUB_HISTORY_DIR,
  listJsonFiles,
  readJsonFile,
  writeJsonFile,
} from "./lib/paths";
import fs from "node:fs";

const API = "https://api.github.com";
const CONCURRENCY = 3;
const USER_AGENT = "ai-repo-directory-ingest";

function maxAgeHours(): number {
  const raw = process.env.REFRESH_MAX_AGE_HOURS ?? "24";
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 24;
}

function forceRefresh(): boolean {
  return process.argv.includes("--force");
}

function loadCanonical(): RepositoryRecord[] {
  const repos: RepositoryRecord[] = [];
  for (const file of listJsonFiles(CANONICAL_DIR)) {
    const raw = readJsonFile<unknown>(file);
    if (!Array.isArray(raw)) continue;
    for (const item of raw) {
      const parsed = repositoryRecordSchema.safeParse(item);
      if (parsed.success) repos.push(parsed.data);
      else console.warn(`Invalid canonical record in ${file}, skipping`);
    }
  }
  return repos;
}

function isFresh(snapshotPath: string, maxAgeMs: number): boolean {
  if (!fs.existsSync(snapshotPath)) return false;
  try {
    const snap = readJsonFile<GitHubSnapshot>(snapshotPath);
    const fetched = new Date(snap.fetchedAt).getTime();
    if (Number.isNaN(fetched)) return false;
    return Date.now() - fetched < maxAgeMs;
  } catch {
    return false;
  }
}

type RateState = { remaining: number | null; resetAt: number | null };

async function sleep(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

async function maybeWaitForRateLimit(state: RateState): Promise<void> {
  if (state.remaining == null) return;
  if (state.remaining > 5) return;
  const resetMs = state.resetAt
    ? Math.max(0, state.resetAt * 1000 - Date.now()) + 1000
    : 60_000;
  // Fail fast on long unauthenticated waits; caller can re-run with a token.
  if (resetMs > 120_000 && !process.env.GITHUB_TOKEN) {
    throw new Error(
      `GitHub rate limit exhausted (remaining=${state.remaining}). Set GITHUB_TOKEN and re-run.`,
    );
  }
  console.warn(
    `Rate limit low (remaining=${state.remaining}); waiting ${Math.ceil(resetMs / 1000)}s`,
  );
  await sleep(resetMs);
}

function updateRate(res: Response, state: RateState): void {
  const rem = res.headers.get("x-ratelimit-remaining");
  const reset = res.headers.get("x-ratelimit-reset");
  if (rem != null) state.remaining = Number(rem);
  if (reset != null) state.resetAt = Number(reset);
}

async function githubGet(
  path: string,
  token: string | undefined,
  state: RateState,
): Promise<{ ok: true; json: unknown; status: number } | { ok: false; status: number; body: string }> {
  await maybeWaitForRateLimit(state);
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { headers });
  updateRate(res, state);

  if (res.status === 403 && state.remaining === 0) {
    await maybeWaitForRateLimit(state);
    const retry = await fetch(`${API}${path}`, { headers });
    updateRate(retry, state);
    if (!retry.ok) {
      return { ok: false, status: retry.status, body: await retry.text() };
    }
    return { ok: true, json: await retry.json(), status: retry.status };
  }

  if (!res.ok) {
    return { ok: false, status: res.status, body: await res.text() };
  }
  return { ok: true, json: await res.json(), status: res.status };
}

type GhRepo = {
  stargazers_count?: number;
  forks_count?: number;
  subscribers_count?: number;
  open_issues_count?: number;
  language?: string | null;
  license?: { spdx_id?: string | null; key?: string | null } | null;
  description?: string | null;
  homepage?: string | null;
  topics?: string[];
  archived?: boolean;
  disabled?: boolean;
  pushed_at?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  default_branch?: string | null;
};

type GhRelease = {
  tag_name?: string;
  published_at?: string | null;
  created_at?: string | null;
};

async function fetchSnapshot(
  repo: RepositoryRecord,
  token: string | undefined,
  state: RateState,
): Promise<GitHubSnapshot | null> {
  const repoRes = await githubGet(`/repos/${repo.owner}/${repo.repo}`, token, state);
  if (!repoRes.ok) {
    if (repoRes.status === 404) {
      console.warn(`404 not found: ${repo.owner}/${repo.repo} (${repo.id})`);
      return null;
    }
    console.warn(
      `Failed ${repo.owner}/${repo.repo}: HTTP ${repoRes.status} ${repoRes.body.slice(0, 200)}`,
    );
    return null;
  }

  const g = repoRes.json as GhRepo;

  let latestRelease: string | null = null;
  let latestReleaseAt: string | null = null;
  const relRes = await githubGet(
    `/repos/${repo.owner}/${repo.repo}/releases/latest`,
    token,
    state,
  );
  if (relRes.ok) {
    const rel = relRes.json as GhRelease;
    latestRelease = rel.tag_name ?? null;
    latestReleaseAt = rel.published_at ?? rel.created_at ?? null;
  } else if (relRes.status !== 404) {
    console.warn(
      `Release fetch warning for ${repo.id}: HTTP ${relRes.status}`,
    );
  }

  const license =
    g.license?.spdx_id && g.license.spdx_id !== "NOASSERTION"
      ? g.license.spdx_id
      : g.license?.key && g.license.key !== "other"
        ? g.license.key
        : null;

  const snapshot: GitHubSnapshot = {
    id: repo.id,
    fetchedAt: new Date().toISOString(),
    stars: g.stargazers_count ?? 0,
    forks: g.forks_count ?? 0,
    watchers: g.subscribers_count ?? 0,
    openIssues: g.open_issues_count ?? 0,
    language: g.language ?? null,
    license,
    description: g.description ?? null,
    homepage: g.homepage || null,
    topics: Array.isArray(g.topics) ? g.topics : [],
    archived: Boolean(g.archived),
    disabled: Boolean(g.disabled),
    pushedAt: g.pushed_at ?? null,
    updatedAt: g.updated_at ?? null,
    createdAt: g.created_at ?? null,
    latestRelease,
    latestReleaseAt,
    defaultBranch: g.default_branch ?? null,
  };

  const parsed = githubSnapshotSchema.safeParse(snapshot);
  if (!parsed.success) {
    console.warn(`Snapshot schema failed for ${repo.id}: ${parsed.error.message}`);
    return null;
  }
  return parsed.data;
}

/** UTC YYYY-MM-DD from an ISO timestamp (for daily history partitions). */
function utcDay(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return d.toISOString().slice(0, 10);
}

/**
 * Append a same-day point-in-time copy under github-history/.
 * Idempotent for re-runs on the same UTC day (overwrites that day's file).
 * Does not delete prior days. Failure here must not block current-snapshot ingest.
 */
function appendHistorySnapshot(snap: GitHubSnapshot): void {
  try {
    const day = utcDay(snap.fetchedAt);
    writeJsonFile(githubHistorySnapshotPath(day, snap.id), snap);
  } catch (err) {
    console.warn(`History append failed for ${snap.id}:`, err);
  }
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker(): Promise<void> {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]!);
    }
  }
  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

async function main(): Promise<void> {
  const force = forceRefresh();
  const maxAgeMs = maxAgeHours() * 60 * 60 * 1000;
  const token = process.env.GITHUB_TOKEN || undefined;
  if (!token) {
    console.warn(
      "GITHUB_TOKEN not set — using unauthenticated GitHub API (low rate limits)",
    );
  }

  const repos = loadCanonical();
  if (repos.length === 0) {
    console.error(
      "No canonical repos found. Run `pnpm merge-data` first or add data/canonical/*.json",
    );
    process.exit(1);
  }

  ensureDir(GITHUB_DIR);
  ensureDir(GITHUB_HISTORY_DIR);
  const rate: RateState = { remaining: null, resetAt: null };

  let refreshed = 0;
  let skipped = 0;
  let failed = 0;
  let historyAppended = 0;

  await mapPool(repos, CONCURRENCY, async (repo) => {
    const out = githubSnapshotPath(repo.id);
    if (!force && isFresh(out, maxAgeMs)) {
      skipped++;
      return;
    }
    try {
      const snap = await fetchSnapshot(repo, token, rate);
      if (!snap) {
        failed++;
        return;
      }
      writeJsonFile(out, snap);
      appendHistorySnapshot(snap);
      historyAppended++;
      refreshed++;
      console.log(
        `Updated ${repo.id} (★${snap.stars}, remaining=${rate.remaining ?? "?"})`,
      );
    } catch (err) {
      failed++;
      console.warn(`Error ingesting ${repo.id}:`, err);
    }
  });

  console.log(
    `Ingest done: refreshed=${refreshed}, skipped(fresh)=${skipped}, failed=${failed}, historyAppended=${historyAppended}, total=${repos.length}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
