/**
 * Agent 1 — GitHub canonical metadata verification.
 *
 * Compares every canonical repo to same-day API snapshots in
 * data/derived/github/*.json, flags issues, optionally live spot-checks,
 * syncs mutable GitHub fields from snapshots into canonical, and writes
 * verification ledgers + history copies.
 *
 * Usage:
 *   pnpm tsx scripts/verify-github-metadata.ts
 *   pnpm tsx scripts/verify-github-metadata.ts --no-sync
 *   pnpm tsx scripts/verify-github-metadata.ts --no-live
 *   pnpm tsx scripts/verify-github-metadata.ts --live-sample 30
 */
import fs from "node:fs";
import path from "node:path";
import {
  githubSnapshotSchema,
  repositoryRecordSchema,
  type GitHubSnapshot,
  type RepositoryRecord,
} from "../src/lib/types";
import {
  CANONICAL_DIR,
  DERIVED_DIR,
  ensureDir,
  GITHUB_DIR,
  githubHistorySnapshotPath,
  githubSnapshotPath,
  listJsonFiles,
  readJsonFile,
  ROOT,
  writeJsonFile,
} from "./lib/paths";

const HISTORY_DAY = "2026-08-12";
const SNAPSHOT_DAY_EXPECTED = "2026-08-12";
const USER_AGENT = "ai-repo-directory-verify-agent1";
const API = "https://api.github.com";

const AGENT1_JSON = path.join(
  ROOT,
  "docs",
  "verification",
  "_agent1_github_verification.json",
);
const AGENT1_MD = path.join(ROOT, "docs", "verification", "_agent1_github.md");
const LEDGER_PATH = path.join(
  DERIVED_DIR,
  "verification",
  "github-ledger.json",
);

type FlagCode =
  | "missing_snapshot"
  | "stale_snapshot"
  | "archived"
  | "disabled"
  | "owner_repo_url_mismatch"
  | "star_drift"
  | "empty_required_field"
  | "snapshot_schema_invalid";

type LedgerStatus = "ok" | "flagged" | "missing_snapshot" | "mismatch";

type FieldCompare = {
  field: string;
  canonical: unknown;
  snapshot: unknown;
  match: boolean;
};

type LiveCheck = {
  id: string;
  owner: string;
  repo: string;
  method: "api" | "html" | "raw_readme" | "skipped";
  ok: boolean;
  detail: string;
  httpStatus?: number;
};

type RepoVerification = {
  id: string;
  owner: string;
  repo: string;
  githubUrl: string;
  primaryCategory: string;
  source: "github_api_snapshot" | null;
  github_fetched_at: string | null;
  status: LedgerStatus;
  flags: FlagCode[];
  flagDetails: string[];
  fields: FieldCompare[];
  syncedFields: string[];
  live?: LiveCheck;
};

type LedgerEntry = {
  id: string;
  verified_at: string;
  github_fetched_at: string | null;
  source: "github_api_snapshot" | "live_api" | "live_html" | "live_raw" | null;
  status: LedgerStatus;
  flags: FlagCode[];
};

function argvFlag(name: string): boolean {
  return process.argv.includes(name);
}

function argvInt(name: string, fallback: number): number {
  const i = process.argv.indexOf(name);
  if (i < 0) return fallback;
  const n = Number(process.argv[i + 1]);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function loadCanonicalWithFiles(): {
  repos: RepositoryRecord[];
  byFile: Map<string, RepositoryRecord[]>;
} {
  const repos: RepositoryRecord[] = [];
  const byFile = new Map<string, RepositoryRecord[]>();
  for (const file of listJsonFiles(CANONICAL_DIR)) {
    const raw = readJsonFile<unknown>(file);
    if (!Array.isArray(raw)) continue;
    const list: RepositoryRecord[] = [];
    for (const item of raw) {
      const parsed = repositoryRecordSchema.safeParse(item);
      if (parsed.success) {
        repos.push(parsed.data);
        list.push(parsed.data);
      } else {
        console.warn(`Invalid canonical record in ${file}, skipping`);
      }
    }
    byFile.set(file, list);
  }
  return { repos, byFile };
}

function parseGithubUrl(
  url: string,
): { owner: string; repo: string } | null {
  try {
    const u = new URL(url);
    if (!/^(www\.)?github\.com$/i.test(u.hostname)) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    return {
      owner: parts[0]!,
      repo: parts[1]!.replace(/\.git$/i, ""),
    };
  } catch {
    return null;
  }
}

function starDrift(
  canonicalStars: number | null,
  snapshotStars: number,
): { drifted: boolean; abs: number; pct: number | null } {
  if (canonicalStars == null) {
    return { drifted: false, abs: 0, pct: null };
  }
  const abs = Math.abs(snapshotStars - canonicalStars);
  const pct =
    canonicalStars === 0
      ? snapshotStars > 0
        ? 1
        : 0
      : abs / canonicalStars;
  return {
    drifted: abs > 100 && pct > 0.2,
    abs,
    pct,
  };
}

function compareFields(
  repo: RepositoryRecord,
  snap: GitHubSnapshot,
): FieldCompare[] {
  const expectedUrl = `https://github.com/${repo.owner}/${repo.repo}`;
  const urlParsed = parseGithubUrl(repo.githubUrl);
  return [
    {
      field: "owner",
      canonical: repo.owner,
      snapshot: urlParsed?.owner ?? null,
      match: urlParsed ? urlParsed.owner === repo.owner : false,
    },
    {
      field: "repo",
      canonical: repo.repo,
      snapshot: urlParsed?.repo ?? null,
      match: urlParsed ? urlParsed.repo === repo.repo : false,
    },
    {
      field: "githubUrl",
      canonical: repo.githubUrl,
      snapshot: expectedUrl,
      match:
        repo.githubUrl.replace(/\/$/, "").toLowerCase() ===
        expectedUrl.toLowerCase(),
    },
    {
      field: "stars",
      canonical: repo.stars,
      snapshot: snap.stars,
      match: repo.stars === snap.stars,
    },
    {
      field: "forks",
      canonical: repo.forks,
      snapshot: snap.forks,
      match: repo.forks === snap.forks,
    },
    {
      field: "archived",
      canonical: repo.archived,
      snapshot: snap.archived,
      match: repo.archived === snap.archived,
    },
    {
      field: "disabled",
      canonical: null,
      snapshot: snap.disabled,
      match: snap.disabled === false,
    },
    {
      field: "language",
      canonical: repo.language,
      snapshot: snap.language,
      match: repo.language === snap.language,
    },
    {
      field: "license",
      canonical: repo.license,
      snapshot: snap.license,
      match: repo.license === snap.license,
    },
    {
      field: "createdAt",
      canonical: null,
      snapshot: snap.createdAt,
      match: snap.createdAt != null,
    },
    {
      field: "updatedAt",
      canonical: null,
      snapshot: snap.updatedAt,
      match: snap.updatedAt != null,
    },
    {
      field: "pushedAt",
      canonical: repo.latestCommitAt,
      snapshot: snap.pushedAt,
      match: repo.latestCommitAt === snap.pushedAt,
    },
    {
      field: "latestRelease",
      canonical: repo.latestRelease,
      snapshot: snap.latestRelease,
      match: repo.latestRelease === snap.latestRelease,
    },
    {
      field: "homepage",
      canonical: repo.homepage,
      snapshot: snap.homepage || null,
      match: (repo.homepage || null) === (snap.homepage || null),
    },
    {
      field: "description",
      canonical: repo.description,
      snapshot: snap.description,
      match: repo.description === snap.description,
    },
    {
      field: "defaultBranch",
      canonical: null,
      snapshot: snap.defaultBranch,
      match: snap.defaultBranch != null && snap.defaultBranch.length > 0,
    },
  ];
}

function verifyOne(repo: RepositoryRecord): RepoVerification {
  const flags: FlagCode[] = [];
  const flagDetails: string[] = [];
  const snapPath = githubSnapshotPath(repo.id);

  const required: Array<keyof RepositoryRecord> = [
    "owner",
    "repo",
    "githubUrl",
    "name",
    "editorialSummary",
    "whyCare",
    "primaryCategory",
  ];
  for (const key of required) {
    const v = repo[key];
    if (v == null || v === "") {
      flags.push("empty_required_field");
      flagDetails.push(`empty required field: ${key}`);
    }
  }

  const urlParsed = parseGithubUrl(repo.githubUrl);
  if (
    !urlParsed ||
    urlParsed.owner !== repo.owner ||
    urlParsed.repo !== repo.repo
  ) {
    flags.push("owner_repo_url_mismatch");
    flagDetails.push(
      `owner/repo (${repo.owner}/${repo.repo}) vs githubUrl (${repo.githubUrl})`,
    );
  }

  if (!fs.existsSync(snapPath)) {
    flags.push("missing_snapshot");
    flagDetails.push(`no snapshot at ${path.relative(ROOT, snapPath)}`);
    return {
      id: repo.id,
      owner: repo.owner,
      repo: repo.repo,
      githubUrl: repo.githubUrl,
      primaryCategory: repo.primaryCategory,
      source: null,
      github_fetched_at: null,
      status: "missing_snapshot",
      flags: [...new Set(flags)],
      flagDetails,
      fields: [],
      syncedFields: [],
    };
  }

  let snapRaw: unknown;
  try {
    snapRaw = readJsonFile<unknown>(snapPath);
  } catch (err) {
    flags.push("snapshot_schema_invalid");
    flagDetails.push(`unreadable snapshot: ${err}`);
    return {
      id: repo.id,
      owner: repo.owner,
      repo: repo.repo,
      githubUrl: repo.githubUrl,
      primaryCategory: repo.primaryCategory,
      source: null,
      github_fetched_at: null,
      status: "flagged",
      flags: [...new Set(flags)],
      flagDetails,
      fields: [],
      syncedFields: [],
    };
  }

  const parsed = githubSnapshotSchema.safeParse(snapRaw);
  if (!parsed.success) {
    flags.push("snapshot_schema_invalid");
    flagDetails.push(`snapshot schema: ${parsed.error.message}`);
    return {
      id: repo.id,
      owner: repo.owner,
      repo: repo.repo,
      githubUrl: repo.githubUrl,
      primaryCategory: repo.primaryCategory,
      source: null,
      github_fetched_at: null,
      status: "flagged",
      flags: [...new Set(flags)],
      flagDetails,
      fields: [],
      syncedFields: [],
    };
  }

  const snap = parsed.data;
  const fetchedDay = snap.fetchedAt.slice(0, 10);
  if (fetchedDay !== SNAPSHOT_DAY_EXPECTED) {
    flags.push("stale_snapshot");
    flagDetails.push(
      `fetchedAt day ${fetchedDay} != expected ${SNAPSHOT_DAY_EXPECTED}`,
    );
  }

  if (snap.archived) {
    flags.push("archived");
    flagDetails.push("snapshot.archived=true");
  }
  if (snap.disabled) {
    flags.push("disabled");
    flagDetails.push("snapshot.disabled=true");
  }

  const drift = starDrift(repo.stars, snap.stars);
  if (drift.drifted) {
    flags.push("star_drift");
    flagDetails.push(
      `stars canonical=${repo.stars} snapshot=${snap.stars} abs=${drift.abs} pct=${(
        (drift.pct ?? 0) * 100
      ).toFixed(1)}%`,
    );
  }

  const fields = compareFields(repo, snap);

  let status: LedgerStatus = "ok";
  if (flags.includes("owner_repo_url_mismatch")) status = "mismatch";
  else if (
    flags.some((f) =>
      [
        "archived",
        "disabled",
        "star_drift",
        "empty_required_field",
        "stale_snapshot",
        "snapshot_schema_invalid",
      ].includes(f),
    )
  ) {
    status = "flagged";
  }

  return {
    id: repo.id,
    owner: repo.owner,
    repo: repo.repo,
    githubUrl: repo.githubUrl,
    primaryCategory: repo.primaryCategory,
    source: "github_api_snapshot",
    github_fetched_at: snap.fetchedAt,
    status,
    flags: [...new Set(flags)],
    flagDetails,
    fields,
    syncedFields: [],
  };
}

/** Sync mutable GitHub fields from authoritative same-day snapshot into canonical. */
function syncFromSnapshot(
  repo: RepositoryRecord,
  snap: GitHubSnapshot,
): { repo: RepositoryRecord; syncedFields: string[] } {
  const next = { ...repo };
  const syncedFields: string[] = [];

  const apply = <K extends keyof RepositoryRecord>(
    key: K,
    value: RepositoryRecord[K],
  ) => {
    if (JSON.stringify(next[key]) !== JSON.stringify(value)) {
      next[key] = value;
      syncedFields.push(key);
    }
  };

  apply("stars", snap.stars);
  apply("forks", snap.forks);
  apply("language", snap.language);
  apply("license", snap.license);
  apply("latestCommitAt", snap.pushedAt);
  apply("latestRelease", snap.latestRelease);
  apply("archived", snap.archived);
  apply("description", snap.description);
  // homepage: snapshot may be "" — normalize to null; only set if valid URL or null
  const home = snap.homepage && snap.homepage.trim() ? snap.homepage.trim() : null;
  if (home === null || /^https?:\/\//i.test(home)) {
    apply("homepage", home);
  }

  return { repo: next, syncedFields };
}

function pickStratifiedSample(
  repos: RepositoryRecord[],
  verifications: Map<string, RepoVerification>,
  n: number,
): RepositoryRecord[] {
  const byCat = new Map<string, RepositoryRecord[]>();
  for (const r of repos) {
    const list = byCat.get(r.primaryCategory) ?? [];
    list.push(r);
    byCat.set(r.primaryCategory, list);
  }
  for (const list of byCat.values()) {
    list.sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
  }

  const picked: RepositoryRecord[] = [];
  const seen = new Set<string>();

  const take = (r: RepositoryRecord | undefined) => {
    if (!r || seen.has(r.id)) return;
    seen.add(r.id);
    picked.push(r);
  };

  // Ensure archived / flagged / high-star / mid / low coverage
  for (const r of repos) {
    const v = verifications.get(r.id);
    if (v?.flags.includes("archived")) take(r);
  }

  const categories = [...byCat.keys()].sort();
  let round = 0;
  while (picked.length < n && round < 50) {
    for (const cat of categories) {
      if (picked.length >= n) break;
      const list = byCat.get(cat) ?? [];
      // tier by round: top, mid, bottom
      let idx = 0;
      if (round === 0) idx = 0;
      else if (round === 1) idx = Math.floor(list.length / 2);
      else if (round === 2) idx = Math.max(0, list.length - 1);
      else idx = (round * 3 + categories.indexOf(cat)) % Math.max(list.length, 1);
      take(list[idx]);
    }
    round++;
  }

  return picked.slice(0, n);
}

async function checkRateRemaining(
  token: string | undefined,
): Promise<number | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": USER_AGENT,
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API}/rate_limit`, { headers });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      resources?: { core?: { remaining?: number } };
      rate?: { remaining?: number };
    };
    return json.resources?.core?.remaining ?? json.rate?.remaining ?? null;
  } catch {
    return null;
  }
}

async function liveVerifyRepo(
  repo: RepositoryRecord,
  snap: GitHubSnapshot | null,
  apiRemaining: number | null,
  token: string | undefined,
): Promise<LiveCheck> {
  const base: Omit<LiveCheck, "method" | "ok" | "detail" | "httpStatus"> = {
    id: repo.id,
    owner: repo.owner,
    repo: repo.repo,
  };

  // Prefer API when rate allows
  if (apiRemaining != null && apiRemaining > 5) {
    try {
      const headers: Record<string, string> = {
        Accept: "application/vnd.github+json",
        "User-Agent": USER_AGENT,
        "X-GitHub-Api-Version": "2022-11-28",
      };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(
        `${API}/repos/${repo.owner}/${repo.repo}`,
        { headers },
      );
      if (res.status === 200) {
        return {
          ...base,
          method: "api",
          ok: true,
          detail: "API 200",
          httpStatus: 200,
        };
      }
      if (res.status === 404) {
        return {
          ...base,
          method: "api",
          ok: false,
          detail: "API 404 not found",
          httpStatus: 404,
        };
      }
      // fall through to HTML on rate limit / other errors
    } catch {
      /* fall through */
    }
  }

  // HTML existence check
  try {
    const res = await fetch(`https://github.com/${repo.owner}/${repo.repo}`, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html",
      },
      redirect: "follow",
    });
    const text = await res.text();
    const is404 =
      res.status === 404 ||
      /Page not found/i.test(text) ||
      /Repository not found/i.test(text);
    if (!is404 && res.status >= 200 && res.status < 400) {
      return {
        ...base,
        method: "html",
        ok: true,
        detail: `HTML ${res.status} exists`,
        httpStatus: res.status,
      };
    }
    if (is404) {
      return {
        ...base,
        method: "html",
        ok: false,
        detail: `HTML indicates missing (status=${res.status})`,
        httpStatus: res.status,
      };
    }
  } catch (err) {
    // try raw readme
    void err;
  }

  // raw README on default branch (or main/master fallbacks)
  const branches = [
    snap?.defaultBranch,
    "main",
    "master",
  ].filter((b): b is string => Boolean(b));
  const tried = new Set<string>();
  for (const branch of branches) {
    if (tried.has(branch)) continue;
    tried.add(branch);
    try {
      const url = `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${branch}/README.md`;
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
      });
      if (res.status === 200) {
        return {
          ...base,
          method: "raw_readme",
          ok: true,
          detail: `README.md on ${branch}`,
          httpStatus: 200,
        };
      }
      if (res.status === 404) {
        // try next branch
        continue;
      }
    } catch {
      continue;
    }
  }

  return {
    ...base,
    method: "raw_readme",
    ok: false,
    detail: "HTML and raw README checks failed or inconclusive",
  };
}

function ensureHistoryCopies(snaps: GitHubSnapshot[]): {
  written: number;
  skipped: number;
} {
  let written = 0;
  let skipped = 0;
  for (const snap of snaps) {
    const dest = githubHistorySnapshotPath(HISTORY_DAY, snap.id);
    if (fs.existsSync(dest)) {
      skipped++;
      continue;
    }
    writeJsonFile(dest, snap);
    written++;
  }
  return { written, skipped };
}

function writeMarkdownSummary(args: {
  verifiedAt: string;
  total: number;
  withSnapshot: number;
  ok: number;
  flagged: number;
  missing: number;
  mismatch: number;
  flagCounts: Record<string, number>;
  syncedRepos: number;
  syncedFieldCounts: Record<string, number>;
  history: { written: number; skipped: number };
  live: LiveCheck[];
  sample: RepoVerification[];
}): string {
  const pct =
    args.total === 0
      ? 0
      : Math.round((args.withSnapshot / args.total) * 1000) / 10;
  const liveOk = args.live.filter((l) => l.ok).length;
  const lines: string[] = [];
  lines.push("# Agent 1 — GitHub Canonical Metadata Verification");
  lines.push("");
  lines.push(`**Verified at:** ${args.verifiedAt}`);
  lines.push(`**Snapshot source:** \`data/derived/github/*.json\` (same-day API snapshots)`);
  lines.push(`**Expected snapshot day:** ${SNAPSHOT_DAY_EXPECTED}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- **Canonical repos:** ${args.total}`);
  lines.push(
    `- **Verified against GitHub snapshots:** ${args.withSnapshot}/${args.total} (${pct}%)`,
  );
  lines.push(`- **Status ok:** ${args.ok}`);
  lines.push(`- **Status flagged:** ${args.flagged}`);
  lines.push(`- **Status missing_snapshot:** ${args.missing}`);
  lines.push(`- **Status mismatch:** ${args.mismatch}`);
  lines.push(
    `- **Canonical synced from snapshots:** ${args.syncedRepos > 0 ? `yes (${args.syncedRepos} repos)` : "no changes needed"}`,
  );
  lines.push(
    `- **History batch ${HISTORY_DAY}:** written=${args.history.written}, already present=${args.history.skipped}`,
  );
  lines.push("");
  lines.push("## Flag counts");
  lines.push("");
  const flagKeys = Object.keys(args.flagCounts).sort();
  if (flagKeys.length === 0) {
    lines.push("_No flags._");
  } else {
    for (const k of flagKeys) {
      lines.push(`- \`${k}\`: ${args.flagCounts[k]}`);
    }
  }
  lines.push("");
  lines.push("## Canonical field sync");
  lines.push("");
  lines.push(
    "Mutable GitHub fields copied from snapshot → canonical when snapshot is present and authoritative:",
  );
  lines.push(
    "`stars`, `forks`, `language`, `license`, `latestCommitAt` ← `pushedAt`, `latestRelease`, `archived`, `description`, `homepage`",
  );
  lines.push("");
  if (Object.keys(args.syncedFieldCounts).length === 0) {
    lines.push("No field updates required.");
  } else {
    for (const [k, v] of Object.entries(args.syncedFieldCounts).sort()) {
      lines.push(`- \`${k}\`: ${v} repos updated`);
    }
  }
  lines.push("");
  lines.push("## Live spot-check");
  lines.push("");
  lines.push(
    `Stratified sample of **${args.live.length}** repos (API rate limit often exhausted; falls back to HTML / raw README).`,
  );
  lines.push("");
  lines.push(`- **Passed:** ${liveOk}/${args.live.length}`);
  lines.push(
    `- **Failed:** ${args.live.length - liveOk}/${args.live.length}`,
  );
  lines.push("");
  lines.push("| id | method | ok | detail |");
  lines.push("|----|--------|----|--------|");
  for (const l of args.live) {
    lines.push(
      `| \`${l.id}\` | ${l.method} | ${l.ok ? "yes" : "no"} | ${l.detail.replace(/\|/g, "/")} |`,
    );
  }
  lines.push("");
  lines.push("## Notable flagged repos");
  lines.push("");
  const notable = args.sample.filter((v) => v.flags.length > 0).slice(0, 40);
  if (notable.length === 0) {
    lines.push("_None in summary sample (see JSON for full list)._");
  } else {
    for (const v of notable) {
      lines.push(
        `- \`${v.id}\` — **${v.status}** — ${v.flags.join(", ")}${v.flagDetails.length ? ` (${v.flagDetails[0]})` : ""}`,
      );
    }
  }
  lines.push("");
  lines.push("## Artifacts");
  lines.push("");
  lines.push("- `docs/verification/_agent1_github_verification.json`");
  lines.push("- `data/derived/verification/github-ledger.json`");
  lines.push(`- \`data/derived/github-history/${HISTORY_DAY}/{id}.json\``);
  lines.push("");
  return `${lines.join("\n")}\n`;
}

async function main(): Promise<void> {
  const doSync = !argvFlag("--no-sync");
  const doLive = !argvFlag("--no-live");
  const liveSample = argvInt("--live-sample", 30);
  const verifiedAt = new Date().toISOString();
  const token = process.env.GITHUB_TOKEN || undefined;

  const { repos, byFile } = loadCanonicalWithFiles();
  if (repos.length === 0) {
    console.error("No canonical repos found");
    process.exit(1);
  }

  const verifications: RepoVerification[] = [];
  const byId = new Map<string, RepoVerification>();
  const snapById = new Map<string, GitHubSnapshot>();

  for (const file of listJsonFiles(GITHUB_DIR)) {
    try {
      const raw = readJsonFile<unknown>(file);
      const parsed = githubSnapshotSchema.safeParse(raw);
      if (parsed.success) snapById.set(parsed.data.id, parsed.data);
    } catch {
      /* ignore */
    }
  }

  for (const repo of repos) {
    const v = verifyOne(repo);
    verifications.push(v);
    byId.set(repo.id, v);
  }

  // Sync mutable fields from snapshots into canonical
  const syncedFieldCounts: Record<string, number> = {};
  let syncedRepos = 0;
  if (doSync) {
    for (const [file, list] of byFile) {
      let fileChanged = false;
      const nextList = list.map((repo) => {
        const snap = snapById.get(repo.id);
        if (!snap) return repo;
        // Only treat same-day (or any present) snapshot as authoritative for mutable GitHub fields
        const { repo: updated, syncedFields } = syncFromSnapshot(repo, snap);
        if (syncedFields.length > 0) {
          fileChanged = true;
          syncedRepos++;
          for (const f of syncedFields) {
            syncedFieldCounts[f] = (syncedFieldCounts[f] ?? 0) + 1;
          }
          const v = byId.get(repo.id);
          if (v) v.syncedFields = syncedFields;
          return updated;
        }
        return repo;
      });
      if (fileChanged) {
        // Re-validate before write
        for (const item of nextList) {
          const p = repositoryRecordSchema.safeParse(item);
          if (!p.success) {
            console.warn(
              `Post-sync schema failure for ${item.id}: ${p.error.message}`,
            );
          }
        }
        writeJsonFile(file, nextList);
      }
    }
  }

  // History copies for today
  const history = ensureHistoryCopies([...snapById.values()]);

  // Live stratified sample
  const liveChecks: LiveCheck[] = [];
  if (doLive) {
    const sampleRepos = pickStratifiedSample(repos, byId, liveSample);
    let remaining = await checkRateRemaining(token);
    console.log(
      `Live spot-check: sample=${sampleRepos.length}, API remaining=${remaining ?? "?"}`,
    );
    for (const repo of sampleRepos) {
      const snap = snapById.get(repo.id) ?? null;
      const check = await liveVerifyRepo(repo, snap, remaining, token);
      liveChecks.push(check);
      const v = byId.get(repo.id);
      if (v) v.live = check;
      if (check.method === "api" && remaining != null) {
        remaining = Math.max(0, remaining - 1);
      }
      // be polite on HTML
      await new Promise((r) => setTimeout(r, 120));
    }
  }

  const flagCounts: Record<string, number> = {};
  let ok = 0;
  let flagged = 0;
  let missing = 0;
  let mismatch = 0;
  let withSnapshot = 0;
  for (const v of verifications) {
    if (v.source === "github_api_snapshot") withSnapshot++;
    if (v.status === "ok") ok++;
    else if (v.status === "flagged") flagged++;
    else if (v.status === "missing_snapshot") missing++;
    else if (v.status === "mismatch") mismatch++;
    for (const f of v.flags) {
      flagCounts[f] = (flagCounts[f] ?? 0) + 1;
    }
  }

  const ledger: {
    verified_at: string;
    expected_snapshot_day: string;
    total: number;
    entries: LedgerEntry[];
  } = {
    verified_at: verifiedAt,
    expected_snapshot_day: SNAPSHOT_DAY_EXPECTED,
    total: verifications.length,
    entries: verifications.map((v) => {
      let source: LedgerEntry["source"] = v.source;
      if (v.live?.ok) {
        if (v.live.method === "api") source = "live_api";
        else if (v.live.method === "html") source = "live_html";
        else if (v.live.method === "raw_readme") source = "live_raw";
      }
      return {
        id: v.id,
        verified_at: verifiedAt,
        github_fetched_at: v.github_fetched_at,
        source,
        status: v.status,
        flags: v.flags,
      };
    }),
  };

  const agentPayload = {
    agent: "agent1-github-metadata",
    verifiedAt,
    expectedSnapshotDay: SNAPSHOT_DAY_EXPECTED,
    counts: {
      total: verifications.length,
      withSnapshot,
      ok,
      flagged,
      missing_snapshot: missing,
      mismatch,
      syncedRepos,
      historyWritten: history.written,
      historySkipped: history.skipped,
      liveSample: liveChecks.length,
      livePassed: liveChecks.filter((l) => l.ok).length,
      liveFailed: liveChecks.filter((l) => !l.ok).length,
    },
    flagCounts,
    syncedFieldCounts,
    liveChecks,
    repositories: verifications,
  };

  ensureDir(path.dirname(AGENT1_JSON));
  ensureDir(path.dirname(LEDGER_PATH));
  writeJsonFile(AGENT1_JSON, agentPayload);
  writeJsonFile(LEDGER_PATH, ledger);

  const flaggedSample = verifications
    .filter((v) => v.flags.length > 0)
    .sort((a, b) => a.id.localeCompare(b.id));

  const md = writeMarkdownSummary({
    verifiedAt,
    total: verifications.length,
    withSnapshot,
    ok,
    flagged,
    missing,
    mismatch,
    flagCounts,
    syncedRepos,
    syncedFieldCounts,
    history,
    live: liveChecks,
    sample: flaggedSample,
  });
  fs.writeFileSync(AGENT1_MD, md, "utf8");

  const pct =
    verifications.length === 0
      ? 0
      : Math.round((withSnapshot / verifications.length) * 1000) / 10;
  console.log(
    `Verify done: ${withSnapshot}/${verifications.length} (${pct}%) against snapshots; ok=${ok} flagged=${flagged} missing=${missing} mismatch=${mismatch}; syncedRepos=${syncedRepos}; live=${liveChecks.filter((l) => l.ok).length}/${liveChecks.length}; history written=${history.written} skipped=${history.skipped}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
