import fs from "node:fs";
import path from "node:path";
import {
  githubSnapshotSchema,
  repositoryRecordSchema,
  scoreRecordSchema,
  type EnrichedRepository,
  type GitHubSnapshot,
  type RepositoryRecord,
  type ScoreRecord,
} from "./types";
import { enrichRepository } from "./ranking";
import type { CollectionMeta } from "./collections";
import { COLLECTIONS } from "./collections";

const ROOT = process.cwd();
const CANONICAL_DIR = path.join(ROOT, "data", "canonical");
const GITHUB_DIR = path.join(ROOT, "data", "derived", "github");
const SCORES_PATH = path.join(ROOT, "data", "derived", "scores.json");

function readJsonFile<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

function listJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(dir, f));
}

export function loadCanonicalRepositories(): RepositoryRecord[] {
  const files = listJsonFiles(CANONICAL_DIR);
  const repos: RepositoryRecord[] = [];
  const seen = new Set<string>();

  for (const file of files) {
    const raw = readJsonFile<unknown>(file);
    if (!Array.isArray(raw)) continue;
    for (const item of raw) {
      const parsed = repositoryRecordSchema.safeParse(item);
      if (!parsed.success) {
        console.warn(`Invalid record in ${file}:`, parsed.error.message);
        continue;
      }
      if (seen.has(parsed.data.id)) continue;
      seen.add(parsed.data.id);
      repos.push(parsed.data);
    }
  }

  return repos;
}

export function loadGitHubSnapshots(): Map<string, GitHubSnapshot> {
  const map = new Map<string, GitHubSnapshot>();
  for (const file of listJsonFiles(GITHUB_DIR)) {
    const raw = readJsonFile<unknown>(file);
    const parsed = githubSnapshotSchema.safeParse(raw);
    if (parsed.success) map.set(parsed.data.id, parsed.data);
  }
  return map;
}

export function loadScores(): Map<string, ScoreRecord> {
  const map = new Map<string, ScoreRecord>();
  const raw = readJsonFile<unknown>(SCORES_PATH);
  if (!Array.isArray(raw)) return map;
  for (const item of raw) {
    const parsed = scoreRecordSchema.safeParse(item);
    if (parsed.success) map.set(parsed.data.id, parsed.data);
  }
  return map;
}

export function loadEnrichedRepositories(): EnrichedRepository[] {
  const repos = loadCanonicalRepositories();
  const github = loadGitHubSnapshots();
  const scores = loadScores();
  return repos
    .map((repo) =>
      enrichRepository(
        repo,
        github.get(repo.id) ?? null,
        scores.get(repo.id) ?? null,
      ),
    )
    .sort((a, b) => b.score - a.score);
}

export function getRepositoryById(
  id: string,
): EnrichedRepository | undefined {
  return loadEnrichedRepositories().find((r) => r.id === id);
}

export function getRepositoriesByCategory(
  categoryId: string,
): EnrichedRepository[] {
  return loadEnrichedRepositories().filter(
    (r) =>
      r.primaryCategory === categoryId ||
      r.secondaryCategories.includes(categoryId as EnrichedRepository["primaryCategory"]),
  );
}

export function getSimilarRepositories(
  repo: EnrichedRepository,
  limit = 6,
): EnrichedRepository[] {
  return loadEnrichedRepositories()
    .filter((r) => r.id !== repo.id)
    .map((r) => {
      let affinity = 0;
      if (r.primaryCategory === repo.primaryCategory) affinity += 5;
      for (const c of r.secondaryCategories) {
        if (
          c === repo.primaryCategory ||
          repo.secondaryCategories.includes(c)
        ) {
          affinity += 2;
        }
      }
      for (const t of r.tags) {
        if (repo.tags.includes(t)) affinity += 1;
      }
      return { r, affinity };
    })
    .filter((x) => x.affinity > 0)
    .sort((a, b) => b.affinity - a.affinity || b.r.score - a.r.score)
    .slice(0, limit)
    .map((x) => x.r);
}

function matchesCollection(
  repo: EnrichedRepository,
  collection: CollectionMeta,
): boolean {
  const f = collection.filter;
  switch (f.type) {
    case "featured-category":
      return (
        repo.featured &&
        (repo.primaryCategory === f.category ||
          repo.secondaryCategories.includes(
            f.category as EnrichedRepository["primaryCategory"],
          ))
      );
    case "categories":
      return f.categories.some(
        (c) =>
          repo.primaryCategory === c ||
          repo.secondaryCategories.includes(
            c as EnrichedRepository["primaryCategory"],
          ),
      );
    case "flag":
      if (f.flag === "beginner") return repo.difficulty === "beginner";
      if (f.flag === "featured") return repo.featured;
      if (f.flag === "emerging") return repo.emerging;
      if (f.flag === "selfHostable") return repo.selfHostable;
      if (f.flag === "localOfflineCapable") return repo.localOfflineCapable;
      return false;
    case "tag-any":
      return f.tags.some((t) => repo.tags.includes(t));
    case "composite": {
      const flagOk = f.flags.every((flag) => {
        if (flag === "beginner") return repo.difficulty === "beginner";
        if (flag === "featured") return repo.featured;
        if (flag === "emerging") return repo.emerging;
        if (flag === "selfHostable") return repo.selfHostable;
        if (flag === "localOfflineCapable") return repo.localOfflineCapable;
        return false;
      });
      if (!flagOk) return false;
      if (!f.categories?.length) return true;
      return f.categories.some(
        (c) =>
          repo.primaryCategory === c ||
          repo.secondaryCategories.includes(
            c as EnrichedRepository["primaryCategory"],
          ),
      );
    }
    default:
      return false;
  }
}

export function getCollectionRepositories(
  slug: string,
): EnrichedRepository[] {
  const collection = COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) return [];
  return loadEnrichedRepositories().filter((r) =>
    matchesCollection(r, collection),
  );
}

export function getHomeHighlights(repos: EnrichedRepository[]) {
  const featured = repos.filter((r) => r.featured).slice(0, 8);
  const trending = [...repos]
    .sort((a, b) => (b.effectiveStars ?? 0) - (a.effectiveStars ?? 0))
    .slice(0, 8);
  const recentlyUpdated = [...repos]
    .filter((r) => r.effectivePushedAt)
    .sort(
      (a, b) =>
        new Date(b.effectivePushedAt!).getTime() -
        new Date(a.effectivePushedAt!).getTime(),
    )
    .slice(0, 8);
  const emerging = repos.filter((r) => r.emerging).slice(0, 8);
  const local = repos
    .filter((r) => r.localOfflineCapable || r.primaryCategory === "local-ai")
    .slice(0, 8);
  const coding = repos
    .filter(
      (r) =>
        r.primaryCategory === "coding-agents" ||
        r.secondaryCategories.includes("coding-agents"),
    )
    .slice(0, 8);

  return { featured, trending, recentlyUpdated, emerging, local, coding };
}
