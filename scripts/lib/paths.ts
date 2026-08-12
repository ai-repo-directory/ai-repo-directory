import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Repo root (scripts/lib → ../..) */
export const ROOT = path.resolve(__dirname, "../..");

export const RAW_DIR = path.join(ROOT, "data", "raw");
export const CANONICAL_DIR = path.join(ROOT, "data", "canonical");
export const CANDIDATES_DIR = path.join(ROOT, "data", "candidates");
export const DERIVED_DIR = path.join(ROOT, "data", "derived");
export const GITHUB_DIR = path.join(DERIVED_DIR, "github");
/** Daily point-in-time GitHub snapshots for trend deltas (not used by UI yet). */
export const GITHUB_HISTORY_DIR = path.join(DERIVED_DIR, "github-history");
export const SCORES_PATH = path.join(DERIVED_DIR, "scores.json");

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

export function listJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(dir, f))
    .sort();
}

export function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function writeJsonFile(filePath: string, data: unknown): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function githubSnapshotPath(id: string): string {
  return path.join(GITHUB_DIR, `${id}.json`);
}

/** UTC calendar day partition: data/derived/github-history/YYYY-MM-DD/{id}.json */
export function githubHistoryDayDir(isoDay: string): string {
  return path.join(GITHUB_HISTORY_DIR, isoDay);
}

export function githubHistorySnapshotPath(isoDay: string, id: string): string {
  return path.join(githubHistoryDayDir(isoDay), `${id}.json`);
}

export function candidatePath(id: string): string {
  return path.join(CANDIDATES_DIR, `${id}.json`);
}
