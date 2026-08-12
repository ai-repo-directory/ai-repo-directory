import { computeScore } from "../src/lib/ranking";
import {
  githubSnapshotSchema,
  repositoryRecordSchema,
  type GitHubSnapshot,
  type RepositoryRecord,
  type ScoreRecord,
} from "../src/lib/types";
import {
  CANONICAL_DIR,
  ensureDir,
  GITHUB_DIR,
  listJsonFiles,
  readJsonFile,
  SCORES_PATH,
  writeJsonFile,
} from "./lib/paths";
import path from "node:path";

function loadCanonical(): RepositoryRecord[] {
  const repos: RepositoryRecord[] = [];
  for (const file of listJsonFiles(CANONICAL_DIR)) {
    const raw = readJsonFile<unknown>(file);
    if (!Array.isArray(raw)) continue;
    for (const item of raw) {
      const parsed = repositoryRecordSchema.safeParse(item);
      if (parsed.success) repos.push(parsed.data);
    }
  }
  return repos;
}

function loadSnapshots(): Map<string, GitHubSnapshot> {
  const map = new Map<string, GitHubSnapshot>();
  for (const file of listJsonFiles(GITHUB_DIR)) {
    try {
      const raw = readJsonFile<unknown>(file);
      const parsed = githubSnapshotSchema.safeParse(raw);
      if (parsed.success) map.set(parsed.data.id, parsed.data);
    } catch {
      console.warn(`Could not read snapshot ${path.basename(file)}`);
    }
  }
  return map;
}

function main(): void {
  const repos = loadCanonical();
  if (repos.length === 0) {
    console.error("No canonical repos to rank. Run `pnpm merge-data` first.");
    process.exit(1);
  }

  const snapshots = loadSnapshots();
  const scores: ScoreRecord[] = repos.map((repo) =>
    computeScore(repo, snapshots.get(repo.id) ?? null),
  );

  scores.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  ensureDir(path.dirname(SCORES_PATH));
  writeJsonFile(SCORES_PATH, scores);

  console.log(
    `Wrote ${scores.length} scores → ${path.relative(process.cwd(), SCORES_PATH)} ` +
      `(${snapshots.size} GitHub snapshots used)`,
  );
}

main();
