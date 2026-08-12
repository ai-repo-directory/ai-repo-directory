/**
 * Agent Group 9 — Statistical anomaly detection for canonical vs derived data.
 * Run: pnpm tsx scripts/verify-anomalies.ts
 */
import fs from "node:fs";
import path from "node:path";
import {
  CANONICAL_DIR,
  GITHUB_DIR,
  ROOT,
  SCORES_PATH,
  listJsonFiles,
  readJsonFile,
  writeJsonFile,
} from "./lib/paths";
import {
  repositoryRecordSchema,
  type GitHubSnapshot,
  type RepositoryRecord,
  type ScoreRecord,
} from "../src/lib/types";

const TODAY = "2026-08-12";
const TODAY_MS = Date.parse(`${TODAY}T23:59:59.999Z`);

/** Well-known projects that should not have 0/null stars if present */
const FAMOUS_IDS = new Set([
  "huggingface-transformers",
  "ollama-ollama",
  "langchain-ai-langchain",
  "AUTOMATIC1111-stable-diffusion-webui",
  "automatic1111-stable-diffusion-webui",
  "comfyanonymous-comfyui",
  "ggerganov-llama-cpp",
  "openai-whisper",
  "pytorch-pytorch",
  "tensorflow-tensorflow",
  "facebookresearch-faiss",
  "milvus-io-milvus",
  "qdrant-qdrant",
  "chroma-core-chroma",
  "run-llama-llama-index",
  "deepspeedai-deepspeed",
  "openai-openai-python",
  "vllm-project-vllm",
  "sgl-project-sglang",
  "open-webui-open-webui",
]);

type Severity = "error" | "warning" | "info";

type Anomaly = {
  type: string;
  severity: Severity;
  id?: string;
  file?: string;
  message: string;
  details?: Record<string, unknown>;
};

type LoadedRepo = RepositoryRecord & { _file: string; _index: number };

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();
}

/** Jaccard similarity over word sets */
function jaccard(a: string, b: string): number {
  const wa = new Set(normalizeText(a).split(" ").filter(Boolean));
  const wb = new Set(normalizeText(b).split(" ").filter(Boolean));
  if (wa.size === 0 || wb.size === 0) return 0;
  let inter = 0;
  for (const w of wa) if (wb.has(w)) inter++;
  return inter / (wa.size + wb.size - inter);
}

/** Canonical slug: owner-repo, lowercase; underscores and dots → hyphens */
function expectedId(owner: string, repo: string): string {
  return `${owner}-${repo}`
    .toLowerCase()
    .replace(/[_.]/g, "-");
}

/** Accept hyphenated slug OR literal owner-repo lowercase (dots kept) */
function idMatchesOwnerRepo(id: string, owner: string, repo: string): boolean {
  const hyphenated = expectedId(owner, repo);
  const literal = `${owner}-${repo}`.toLowerCase();
  return id === hyphenated || id === literal;
}

function parseGithubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const u = new URL(url);
    if (!/(^|\.)github\.com$/i.test(u.hostname)) return null;
    const parts = u.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/i, "");
    if (!owner || !repo) return null;
    return { owner, repo };
  } catch {
    return null;
  }
}

function isRoundSuspicious(n: number): boolean {
  if (n < 1000) return false;
  // Exactly 1000, 5000, 10000, 50000, etc. or multiples of 1000 ending in many zeros
  if (n >= 1000 && n % 1000 === 0 && String(n).match(/^[1-9]0+$/)) return true;
  if (n >= 10000 && n % 10000 === 0) return true;
  return false;
}

function loadCanonical(): LoadedRepo[] {
  const out: LoadedRepo[] = [];
  for (const file of listJsonFiles(CANONICAL_DIR)) {
    const raw = readJsonFile<unknown>(file);
    if (!Array.isArray(raw)) continue;
    raw.forEach((item, index) => {
      out.push({ ...(item as RepositoryRecord), _file: file, _index: index });
    });
  }
  return out;
}

function loadSnapshots(): Map<string, GitHubSnapshot> {
  const map = new Map<string, GitHubSnapshot>();
  if (!fs.existsSync(GITHUB_DIR)) return map;
  for (const file of listJsonFiles(GITHUB_DIR)) {
    try {
      const snap = readJsonFile<GitHubSnapshot>(file);
      if (snap?.id) map.set(snap.id, snap);
    } catch {
      // ignore unreadable
    }
  }
  return map;
}

function detect(
  repos: LoadedRepo[],
  snapshots: Map<string, GitHubSnapshot>,
  scores: ScoreRecord[],
): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const requiredKeys = [
    "id",
    "name",
    "owner",
    "repo",
    "githubUrl",
    "homepage",
    "description",
    "editorialSummary",
    "whyCare",
    "primaryCategory",
    "secondaryCategories",
    "tags",
    "language",
    "license",
    "stars",
    "forks",
    "latestCommitAt",
    "latestRelease",
    "archived",
    "maintenance",
    "selfHostable",
    "localOfflineCapable",
    "audience",
    "difficulty",
    "documentationQuality",
    "demoAvailable",
    "featured",
    "emerging",
    "historicallySignificant",
    "dateLastVerified",
    "sources",
  ] as const;

  // --- per-repo checks ---
  for (const r of repos) {
    const rel = path.relative(ROOT, r._file);

    // 1. impossible negative counts
    if (typeof r.stars === "number" && r.stars < 0) {
      anomalies.push({
        type: "impossible_negative_counts",
        severity: "error",
        id: r.id,
        file: rel,
        message: `Negative stars: ${r.stars}`,
        details: { stars: r.stars },
      });
    }
    if (typeof r.forks === "number" && r.forks < 0) {
      anomalies.push({
        type: "impossible_negative_counts",
        severity: "error",
        id: r.id,
        file: rel,
        message: `Negative forks: ${r.forks}`,
        details: { forks: r.forks },
      });
    }

    // 2. suspicious star counts
    if (r.stars === null) {
      anomalies.push({
        type: "suspicious_star_counts",
        severity: "info",
        id: r.id,
        file: rel,
        message: "stars is null",
      });
    } else if (r.stars === 0 && FAMOUS_IDS.has(r.id)) {
      anomalies.push({
        type: "suspicious_star_counts",
        severity: "warning",
        id: r.id,
        file: rel,
        message: "Famous project has 0 stars",
        details: { stars: 0 },
      });
    } else if (typeof r.stars === "number" && isRoundSuspicious(r.stars)) {
      const snapForStars = snapshots.get(r.id);
      const confirmedBySnap =
        snapForStars != null && snapForStars.stars === r.stars;
      anomalies.push({
        type: "suspicious_star_counts",
        severity: confirmedBySnap ? "info" : "warning",
        id: r.id,
        file: rel,
        message: confirmedBySnap
          ? `Round star count ${r.stars} confirmed by derived GitHub snapshot (likely real)`
          : `Extremely round star count looks potentially fabricated: ${r.stars}`,
        details: {
          stars: r.stars,
          derivedStars: snapForStars?.stars ?? null,
          confirmedBySnapshot: confirmedBySnap,
        },
      });
    }

    // 3. stars lower than forks
    if (
      typeof r.stars === "number" &&
      typeof r.forks === "number" &&
      r.stars < r.forks
    ) {
      anomalies.push({
        type: "stars_lower_than_forks",
        severity: "warning",
        id: r.id,
        file: rel,
        message: `stars (${r.stars}) < forks (${r.forks})`,
        details: { stars: r.stars, forks: r.forks },
      });
    }

    // 4. impossible / future dates
    const dateFields: Array<[string, string | null | undefined]> = [
      ["latestCommitAt", r.latestCommitAt],
      ["dateLastVerified", r.dateLastVerified],
      ["latestRelease", null], // release tag string — skip unless ISO-looking
    ];
    for (const [field, val] of dateFields) {
      if (!val) continue;
      // Only check ISO-like timestamps / dates
      if (!/^\d{4}-\d{2}-\d{2}/.test(val)) continue;
      const ms = Date.parse(val);
      if (Number.isNaN(ms)) {
        anomalies.push({
          type: "impossible_dates",
          severity: "error",
          id: r.id,
          file: rel,
          message: `Unparseable date in ${field}: ${val}`,
          details: { field, value: val },
        });
      } else if (ms > TODAY_MS) {
        anomalies.push({
          type: "impossible_dates",
          severity: "warning",
          id: r.id,
          file: rel,
          message: `Future date in ${field}: ${val} (after ${TODAY})`,
          details: { field, value: val },
        });
      } else {
        const year = new Date(ms).getUTCFullYear();
        if (year < 2005) {
          anomalies.push({
            type: "impossible_dates",
            severity: "warning",
            id: r.id,
            file: rel,
            message: `Implausibly old date in ${field}: ${val}`,
            details: { field, value: val },
          });
        }
      }
    }

    // 6. malformed GitHub URLs
    const ghParsed = parseGithubUrl(r.githubUrl);
    if (!ghParsed) {
      anomalies.push({
        type: "malformed_github_url",
        severity: "error",
        id: r.id,
        file: rel,
        message: `Malformed githubUrl: ${r.githubUrl}`,
        details: { githubUrl: r.githubUrl },
      });
    }

    // 7. missing required fields
    const parsed = repositoryRecordSchema.safeParse(r);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        anomalies.push({
          type: "missing_required_fields",
          severity: "error",
          id: r.id,
          file: rel,
          message: `${issue.path.join(".") || "(root)"}: ${issue.message}`,
          details: { path: issue.path },
        });
      }
    } else {
      for (const key of requiredKeys) {
        if (!(key in r) || (r as Record<string, unknown>)[key] === undefined) {
          anomalies.push({
            type: "missing_required_fields",
            severity: "error",
            id: r.id,
            file: rel,
            message: `Missing required field: ${key}`,
          });
        }
      }
    }

    // 12. owner/repo vs githubUrl inconsistency
    if (ghParsed) {
      const urlOwner = ghParsed.owner;
      const urlRepo = ghParsed.repo;
      if (
        urlOwner.toLowerCase() !== r.owner.toLowerCase() ||
        urlRepo.toLowerCase() !== r.repo.toLowerCase()
      ) {
        anomalies.push({
          type: "owner_repo_url_mismatch",
          severity: "error",
          id: r.id,
          file: rel,
          message: `owner/repo (${r.owner}/${r.repo}) != URL (${urlOwner}/${urlRepo})`,
          details: {
            owner: r.owner,
            repo: r.repo,
            urlOwner,
            urlRepo,
            githubUrl: r.githubUrl,
          },
        });
      }
    }

    // 13. id not matching owner-repo slug pattern
    const expect = expectedId(r.owner, r.repo);
    if (!idMatchesOwnerRepo(r.id, r.owner, r.repo)) {
      anomalies.push({
        type: "id_slug_mismatch",
        severity: "warning",
        id: r.id,
        file: rel,
        message: `id "${r.id}" does not match expected slug from owner/repo (expected ~"${expect}")`,
        details: { expected: expect, owner: r.owner, repo: r.repo },
      });
    } else if (r.id !== expect && r.repo.includes(".")) {
      // Schema prefers hyphenated; keeping literal dots is a mild convention drift
      anomalies.push({
        type: "id_slug_mismatch",
        severity: "info",
        id: r.id,
        file: rel,
        message: `id keeps literal '.' from repo name; schema prefers hyphenated "${expect}"`,
        details: { expected: expect, owner: r.owner, repo: r.repo },
      });
    }

    // 5 + 11 + snapshot-related
    const snap = snapshots.get(r.id);
    if (snap) {
      // 5. latest release predating repository creation
      if (snap.createdAt && snap.latestReleaseAt) {
        const created = Date.parse(snap.createdAt);
        const released = Date.parse(snap.latestReleaseAt);
        if (!Number.isNaN(created) && !Number.isNaN(released) && released < created) {
          anomalies.push({
            type: "release_before_created",
            severity: "error",
            id: r.id,
            file: rel,
            message: `latestReleaseAt (${snap.latestReleaseAt}) before createdAt (${snap.createdAt})`,
            details: {
              latestReleaseAt: snap.latestReleaseAt,
              createdAt: snap.createdAt,
              latestRelease: snap.latestRelease,
            },
          });
        }
      }

      // future dates on snapshot
      for (const [field, val] of [
        ["fetchedAt", snap.fetchedAt],
        ["pushedAt", snap.pushedAt],
        ["updatedAt", snap.updatedAt],
        ["createdAt", snap.createdAt],
        ["latestReleaseAt", snap.latestReleaseAt],
      ] as const) {
        if (!val) continue;
        const ms = Date.parse(val);
        if (!Number.isNaN(ms) && ms > TODAY_MS + 24 * 60 * 60 * 1000) {
          anomalies.push({
            type: "impossible_dates",
            severity: "warning",
            id: r.id,
            file: rel,
            message: `Future snapshot date ${field}: ${val}`,
            details: { field, value: val, source: "derived" },
          });
        }
      }

      // 11. canonical vs derived mismatches
      const starDiff =
        typeof r.stars === "number"
          ? Math.abs(r.stars - snap.stars)
          : null;
      const forkDiff =
        typeof r.forks === "number"
          ? Math.abs(r.forks - snap.forks)
          : null;

      // Significant: absolute gap > 500 OR relative > 25% when both > 100
      const significantStars =
        starDiff !== null &&
        (starDiff > 500 ||
          (r.stars! > 100 && snap.stars > 100 && starDiff / Math.max(r.stars!, snap.stars) > 0.25));
      const significantForks =
        forkDiff !== null &&
        (forkDiff > 200 ||
          (r.forks! > 50 && snap.forks > 50 && forkDiff / Math.max(r.forks!, snap.forks) > 0.25));

      if (significantStars) {
        anomalies.push({
          type: "canonical_derived_mismatch",
          severity: "warning",
          id: r.id,
          file: rel,
          message: `stars mismatch: canonical=${r.stars} derived=${snap.stars}`,
          details: { field: "stars", canonical: r.stars, derived: snap.stars },
        });
      }
      if (significantForks) {
        anomalies.push({
          type: "canonical_derived_mismatch",
          severity: "warning",
          id: r.id,
          file: rel,
          message: `forks mismatch: canonical=${r.forks} derived=${snap.forks}`,
          details: { field: "forks", canonical: r.forks, derived: snap.forks },
        });
      }
      if (
        r.license != null &&
        snap.license != null &&
        r.license !== snap.license
      ) {
        anomalies.push({
          type: "canonical_derived_mismatch",
          severity: "info",
          id: r.id,
          file: rel,
          message: `license mismatch: canonical=${r.license} derived=${snap.license}`,
          details: { field: "license", canonical: r.license, derived: snap.license },
        });
      }
      if (r.archived !== snap.archived) {
        anomalies.push({
          type: "canonical_derived_mismatch",
          severity: "warning",
          id: r.id,
          file: rel,
          message: `archived mismatch: canonical=${r.archived} derived=${snap.archived}`,
          details: {
            field: "archived",
            canonical: r.archived,
            derived: snap.archived,
          },
        });
      }
    }
  }

  // 8. duplicate editorial summaries / whyCare
  const editorialMap = new Map<string, string[]>();
  const whyCareMap = new Map<string, string[]>();
  for (const r of repos) {
    const e = normalizeText(r.editorialSummary || "");
    const w = normalizeText(r.whyCare || "");
    if (e.length > 20) {
      if (!editorialMap.has(e)) editorialMap.set(e, []);
      editorialMap.get(e)!.push(r.id);
    }
    if (w.length > 20) {
      if (!whyCareMap.has(w)) whyCareMap.set(w, []);
      whyCareMap.get(w)!.push(r.id);
    }
  }
  for (const [text, ids] of editorialMap) {
    if (ids.length > 1) {
      anomalies.push({
        type: "duplicate_editorial_text",
        severity: "warning",
        message: `Identical editorialSummary across ${ids.length} projects`,
        details: { ids, field: "editorialSummary", preview: text.slice(0, 120) },
      });
    }
  }
  for (const [text, ids] of whyCareMap) {
    if (ids.length > 1) {
      anomalies.push({
        type: "duplicate_editorial_text",
        severity: "warning",
        message: `Identical whyCare across ${ids.length} projects`,
        details: { ids, field: "whyCare", preview: text.slice(0, 120) },
      });
    }
  }

  // 9. suspiciously repetitive AI-generated descriptions (near-identical phrasing)
  const AI_PATTERNS = [
    /^this (repository|project|tool|library) (is|provides|offers|enables)/i,
    /empower(s|ing)? (developers|users|teams) to/i,
    /seamlessly (integrat|connect)/i,
    /cutting[- ]edge (ai|ml|machine learning|artificial intelligence)/i,
    /leverag(e|es|ing) the power of/i,
    /in today'?s (fast[- ]paced|rapidly evolving)/i,
    /whether you'?re a (beginner|seasoned|experienced)/i,
  ];
  const patternHits = new Map<string, string[]>();
  for (const r of repos) {
    const blob = `${r.editorialSummary}\n${r.whyCare}\n${r.description ?? ""}`;
    for (const pat of AI_PATTERNS) {
      if (pat.test(blob)) {
        const key = pat.source;
        if (!patternHits.has(key)) patternHits.set(key, []);
        patternHits.get(key)!.push(r.id);
      }
    }
  }
  for (const [pattern, ids] of patternHits) {
    if (ids.length >= 3) {
      anomalies.push({
        type: "repetitive_ai_phrasing",
        severity: "warning",
        message: `AI-ish phrasing pattern matched ${ids.length} projects: /${pattern}/`,
        details: { pattern, ids },
      });
    }
  }

  // Near-identical pairwise (sample O(n^2) but n~200)
  const nearPairs: Array<{ a: string; b: string; score: number; field: string }> = [];
  for (let i = 0; i < repos.length; i++) {
    for (let j = i + 1; j < repos.length; j++) {
      const a = repos[i];
      const b = repos[j];
      const es = jaccard(a.editorialSummary, b.editorialSummary);
      if (es >= 0.85 && normalizeText(a.editorialSummary) !== normalizeText(b.editorialSummary)) {
        nearPairs.push({ a: a.id, b: b.id, score: es, field: "editorialSummary" });
      }
      const wc = jaccard(a.whyCare, b.whyCare);
      if (wc >= 0.85 && normalizeText(a.whyCare) !== normalizeText(b.whyCare)) {
        nearPairs.push({ a: a.id, b: b.id, score: wc, field: "whyCare" });
      }
    }
  }
  // Cap reporting
  for (const p of nearPairs.slice(0, 50)) {
    anomalies.push({
      type: "repetitive_ai_phrasing",
      severity: "info",
      message: `Near-identical ${p.field} (jaccard=${p.score.toFixed(2)}) between ${p.a} and ${p.b}`,
      details: p,
    });
  }

  // 10. identical metadata across unrelated projects
  const metaKey = (r: LoadedRepo) =>
    [
      r.language ?? "",
      r.license ?? "",
      String(r.stars),
      String(r.forks),
      r.latestCommitAt ?? "",
      r.latestRelease ?? "",
      String(r.archived),
      r.maintenance,
      String(r.selfHostable),
      String(r.localOfflineCapable),
      r.difficulty,
      r.documentationQuality,
      String(r.demoAvailable),
      String(r.featured),
      String(r.emerging),
      String(r.historicallySignificant),
      r.dateLastVerified,
    ].join("|");
  const metaMap = new Map<string, string[]>();
  for (const r of repos) {
    const k = metaKey(r);
    if (!metaMap.has(k)) metaMap.set(k, []);
    metaMap.get(k)!.push(r.id);
  }
  for (const [k, ids] of metaMap) {
    if (ids.length > 1) {
      anomalies.push({
        type: "identical_metadata",
        severity: "warning",
        message: `Identical metadata fingerprint across ${ids.length} unrelated projects`,
        details: { ids, fingerprint: k.slice(0, 200) },
      });
    }
  }

  // 14. dateLastVerified fabricated / identical everywhere without github fetchedAt
  const dlvCounts = new Map<string, string[]>();
  for (const r of repos) {
    const d = r.dateLastVerified;
    if (!dlvCounts.has(d)) dlvCounts.set(d, []);
    dlvCounts.get(d)!.push(r.id);
  }
  const total = repos.length;
  for (const [date, ids] of dlvCounts) {
    if (ids.length >= Math.max(10, Math.floor(total * 0.4))) {
      const withoutFetch = ids.filter((id) => {
        const snap = snapshots.get(id);
        return !snap?.fetchedAt;
      });
      anomalies.push({
        type: "fabricated_date_last_verified",
        severity: withoutFetch.length > 0 ? "warning" : "info",
        message: `dateLastVerified "${date}" shared by ${ids.length}/${total} projects${
          withoutFetch.length
            ? ` (${withoutFetch.length} lack derived github fetchedAt)`
            : " (all have github fetchedAt)"
        }`,
        details: {
          date,
          count: ids.length,
          withoutFetchedAt: withoutFetch.slice(0, 30),
          sampleIds: ids.slice(0, 20),
        },
      });
    }
  }

  // Also flag dateLastVerified far in the future
  for (const r of repos) {
    const ms = Date.parse(r.dateLastVerified);
    if (!Number.isNaN(ms) && ms > TODAY_MS) {
      // already covered in impossible_dates if ISO — ensure type tag too
      if (!/^\d{4}-\d{2}-\d{2}/.test(r.dateLastVerified)) continue;
    }
  }

  // Derived snapshot sanity + score coverage
  for (const [id, snap] of snapshots) {
    if (snap.stars < 0 || snap.forks < 0) {
      anomalies.push({
        type: "impossible_negative_counts",
        severity: "error",
        id,
        message: `Derived snapshot has negative counts stars=${snap.stars} forks=${snap.forks}`,
        details: { stars: snap.stars, forks: snap.forks, source: "derived" },
      });
    }
  }
  const scoreIds = new Set(scores.map((s) => s.id));
  for (const r of repos) {
    if (!scoreIds.has(r.id)) {
      anomalies.push({
        type: "canonical_derived_mismatch",
        severity: "info",
        id: r.id,
        file: path.relative(ROOT, r._file),
        message: "Missing score record in data/derived/scores.json",
      });
    }
  }

  return anomalies;
}

type Fix = {
  id: string;
  file: string;
  action: string;
  before?: unknown;
  after?: unknown;
};

function applyFixes(repos: LoadedRepo[]): Fix[] {
  const fixes: Fix[] = [];
  // Group by file for rewriting
  const byFile = new Map<string, LoadedRepo[]>();
  for (const r of repos) {
    if (!byFile.has(r._file)) byFile.set(r._file, []);
    byFile.get(r._file)!.push(r);
  }

  for (const [file, list] of byFile) {
    const original = readJsonFile<RepositoryRecord[]>(file);
    let changed = false;
    const next = original.map((rec, index) => {
      const r = { ...rec };
      const rel = path.relative(ROOT, file);

      // Fix negative counts → null (do not invent positive values)
      if (typeof r.stars === "number" && r.stars < 0) {
        fixes.push({
          id: r.id,
          file: rel,
          action: "set negative stars to null",
          before: r.stars,
          after: null,
        });
        r.stars = null;
        changed = true;
      }
      if (typeof r.forks === "number" && r.forks < 0) {
        fixes.push({
          id: r.id,
          file: rel,
          action: "set negative forks to null",
          before: r.forks,
          after: null,
        });
        r.forks = null;
        changed = true;
      }

      // Fix malformed github URLs / owner-repo mismatch from URL
      const parsed = parseGithubUrl(r.githubUrl);
      if (!parsed) {
        // Try to reconstruct from owner/repo if those look sane
        if (r.owner && r.repo && /^[A-Za-z0-9_.-]+$/.test(r.owner) && /^[A-Za-z0-9_.-]+$/.test(r.repo)) {
          const fixedUrl = `https://github.com/${r.owner}/${r.repo}`;
          fixes.push({
            id: r.id,
            file: rel,
            action: "reconstruct malformed githubUrl from owner/repo",
            before: r.githubUrl,
            after: fixedUrl,
          });
          r.githubUrl = fixedUrl;
          changed = true;
        }
      } else {
        // Prefer URL as source of truth for owner/repo when mismatch
        if (
          parsed.owner.toLowerCase() !== r.owner.toLowerCase() ||
          parsed.repo.toLowerCase() !== r.repo.toLowerCase()
        ) {
          // If URL is clearly github.com/owner/repo, sync owner/repo to URL
          // (unless URL path looks wrong vs id)
          const idFromUrl = expectedId(parsed.owner, parsed.repo);
          const idFromFields = expectedId(r.owner, r.repo);
          if (r.id === idFromUrl || r.id === `${parsed.owner}-${parsed.repo}`.toLowerCase()) {
            fixes.push({
              id: r.id,
              file: rel,
              action: "sync owner/repo to githubUrl",
              before: { owner: r.owner, repo: r.repo },
              after: { owner: parsed.owner, repo: parsed.repo },
            });
            r.owner = parsed.owner;
            r.repo = parsed.repo;
            changed = true;
          } else if (
            r.id === idFromFields ||
            r.id === `${r.owner}-${r.repo}`.toLowerCase()
          ) {
            const fixedUrl = `https://github.com/${r.owner}/${r.repo}`;
            fixes.push({
              id: r.id,
              file: rel,
              action: "sync githubUrl to owner/repo (id matches fields)",
              before: r.githubUrl,
              after: fixedUrl,
            });
            r.githubUrl = fixedUrl;
            changed = true;
          } else {
            // Default: trust URL, sync owner/repo
            fixes.push({
              id: r.id,
              file: rel,
              action: "sync owner/repo to githubUrl (default)",
              before: { owner: r.owner, repo: r.repo, githubUrl: r.githubUrl },
              after: { owner: parsed.owner, repo: parsed.repo },
            });
            r.owner = parsed.owner;
            r.repo = parsed.repo;
            changed = true;
          }
        }

        // Normalize accidental trailing junk / .git
        const clean = `https://github.com/${parsed.owner}/${parsed.repo}`;
        if (
          r.githubUrl !== clean &&
          /^https?:\/\/(www\.)?github\.com\//i.test(r.githubUrl)
        ) {
          // Only auto-normalize if clearly same owner/repo with .git or trailing slash or www
          const rough = r.githubUrl
            .replace(/\/+$/, "")
            .replace(/\.git$/i, "")
            .replace(/^https?:\/\/(www\.)?github\.com/i, "https://github.com");
          if (rough === clean && r.githubUrl !== clean) {
            fixes.push({
              id: r.id,
              file: rel,
              action: "normalize githubUrl",
              before: r.githubUrl,
              after: clean,
            });
            r.githubUrl = clean;
            changed = true;
          }
        }
      }

      // Keep LoadedRepo in sync for re-detect if needed
      Object.assign(list[index], r, { _file: file, _index: index });
      return r;
    });

    if (changed) {
      writeJsonFile(file, next);
    }
  }

  return fixes;
}

function countByType(anomalies: Anomaly[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const a of anomalies) {
    counts[a.type] = (counts[a.type] || 0) + 1;
  }
  return counts;
}

function toMarkdown(
  anomalies: Anomaly[],
  counts: Record<string, number>,
  fixes: Fix[],
  meta: { totalRepos: number; snapshots: number },
): string {
  const ALL_TYPES = [
    "impossible_negative_counts",
    "suspicious_star_counts",
    "stars_lower_than_forks",
    "impossible_dates",
    "release_before_created",
    "malformed_github_url",
    "missing_required_fields",
    "duplicate_editorial_text",
    "repetitive_ai_phrasing",
    "identical_metadata",
    "canonical_derived_mismatch",
    "owner_repo_url_mismatch",
    "id_slug_mismatch",
    "fabricated_date_last_verified",
  ];

  const lines: string[] = [];
  lines.push("# Agent 9 — Statistical Anomaly Report");
  lines.push("");
  lines.push(`Generated: ${TODAY}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Canonical repositories scanned: **${meta.totalRepos}**`);
  lines.push(`- Derived GitHub snapshots available: **${meta.snapshots}**`);
  lines.push(`- Total anomalies: **${anomalies.length}**`);
  lines.push(`- Fixes applied: **${fixes.length}**`);
  lines.push("");
  lines.push("### Counts by type");
  lines.push("");
  lines.push("| Type | Count |");
  lines.push("| --- | ---: |");
  for (const type of ALL_TYPES) {
    lines.push(`| \`${type}\` | ${counts[type] ?? 0} |`);
  }
  // Any unexpected types
  for (const [type, n] of Object.entries(counts)) {
    if (!ALL_TYPES.includes(type)) {
      lines.push(`| \`${type}\` | ${n} |`);
    }
  }
  lines.push("");

  lines.push("## Fixes applied");
  lines.push("");
  if (fixes.length === 0) {
    lines.push("No confirmed clear data errors required automatic fixes.");
  } else {
    for (const f of fixes) {
      lines.push(
        `- **${f.id}** (\`${f.file}\`): ${f.action}` +
          (f.before !== undefined
            ? ` — \`${JSON.stringify(f.before)}\` → \`${JSON.stringify(f.after)}\``
            : ""),
      );
    }
  }
  lines.push("");

  const byType = new Map<string, Anomaly[]>();
  for (const a of anomalies) {
    if (!byType.has(a.type)) byType.set(a.type, []);
    byType.get(a.type)!.push(a);
  }

  lines.push("## Anomalies by type");
  lines.push("");
  for (const type of ALL_TYPES) {
    const list = byType.get(type) ?? [];
    lines.push(`### ${type} (${list.length})`);
    lines.push("");
    if (list.length === 0) {
      lines.push("_None detected._");
      lines.push("");
      continue;
    }
    const show = list.slice(0, 40);
    for (const a of show) {
      const id = a.id ? `**${a.id}**: ` : "";
      lines.push(`- [${a.severity}] ${id}${a.message}`);
    }
    if (list.length > show.length) {
      lines.push(`- _…and ${list.length - show.length} more (see JSON report)_`);
    }
    lines.push("");
  }

  lines.push("## Notes");
  lines.push("");
  lines.push("- Star counts were **not** invented or overwritten from snapshots.");
  lines.push("- Repositories were **not** deleted.");
  lines.push("- UI code was not changed.");
  lines.push("- Canonical vs derived star/fork gaps under significance thresholds are omitted.");
  lines.push("");
  return lines.join("\n");
}

function main(): void {
  const repos = loadCanonical();
  const snapshots = loadSnapshots();
  let scores: ScoreRecord[] = [];
  try {
    scores = readJsonFile<ScoreRecord[]>(SCORES_PATH);
    if (!Array.isArray(scores)) scores = [];
  } catch {
    scores = [];
  }

  // Apply clear fixes first, then re-detect
  const fixes = applyFixes(repos);
  // Reload after fixes
  const reposAfter = loadCanonical();
  const anomalies = detect(reposAfter, snapshots, scores);
  const counts = countByType(anomalies);

  const outDir = path.join(ROOT, "docs", "verification");
  fs.mkdirSync(outDir, { recursive: true });

  const ALL_TYPES = [
    "impossible_negative_counts",
    "suspicious_star_counts",
    "stars_lower_than_forks",
    "impossible_dates",
    "release_before_created",
    "malformed_github_url",
    "missing_required_fields",
    "duplicate_editorial_text",
    "repetitive_ai_phrasing",
    "identical_metadata",
    "canonical_derived_mismatch",
    "owner_repo_url_mismatch",
    "id_slug_mismatch",
    "fabricated_date_last_verified",
  ];
  const countsByTypeFull: Record<string, number> = {};
  for (const t of ALL_TYPES) countsByTypeFull[t] = counts[t] ?? 0;
  for (const [t, n] of Object.entries(counts)) {
    if (!(t in countsByTypeFull)) countsByTypeFull[t] = n;
  }

  const report = {
    generatedAt: new Date().toISOString(),
    today: TODAY,
    totals: {
      canonicalRepos: reposAfter.length,
      githubSnapshots: snapshots.size,
      scoreRecords: scores.length,
      anomalies: anomalies.length,
      fixesApplied: fixes.length,
    },
    countsByType: countsByTypeFull,
    fixes,
    anomalies,
  };

  const jsonPath = path.join(outDir, "_agent9_anomalies.json");
  const mdPath = path.join(outDir, "_agent9_anomalies.md");
  writeJsonFile(jsonPath, report);
  fs.writeFileSync(
    mdPath,
    toMarkdown(anomalies, countsByTypeFull, fixes, {
      totalRepos: reposAfter.length,
      snapshots: snapshots.size,
    }),
    "utf8",
  );

  console.log(`Scanned ${reposAfter.length} repos, ${snapshots.size} snapshots, ${scores.length} scores`);
  console.log(`Anomalies: ${anomalies.length}`);
  console.log("Counts:", countsByTypeFull);
  console.log(`Fixes applied: ${fixes.length}`);
  console.log(`Wrote ${jsonPath}`);
  console.log(`Wrote ${mdPath}`);
}

main();
