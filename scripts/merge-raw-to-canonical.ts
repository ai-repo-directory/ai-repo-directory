import type { RepositoryRecord } from "../src/lib/types";
import { repositoryRecordSchema } from "../src/lib/types";
import {
  CANONICAL_DIR,
  ensureDir,
  listJsonFiles,
  RAW_DIR,
  readJsonFile,
  writeJsonFile,
} from "./lib/paths";
import path from "node:path";

function preferRecord(
  a: RepositoryRecord,
  b: RepositoryRecord,
): RepositoryRecord {
  // Prefer featured=true, then non-null stars (higher stars wins on tie)
  if (a.featured !== b.featured) return a.featured ? a : b;
  const aStars = a.stars;
  const bStars = b.stars;
  if (aStars == null && bStars != null) return b;
  if (bStars == null && aStars != null) return a;
  if (aStars != null && bStars != null && aStars !== bStars) {
    return aStars >= bStars ? a : b;
  }
  return a;
}

function main(): void {
  const files = listJsonFiles(RAW_DIR);
  if (files.length === 0) {
    console.error(`No raw JSON files in ${RAW_DIR}`);
    process.exit(1);
  }

  const byId = new Map<string, RepositoryRecord>();
  let skipped = 0;

  for (const file of files) {
    const raw = readJsonFile<unknown>(file);
    if (!Array.isArray(raw)) {
      console.warn(`Skipping non-array file: ${file}`);
      continue;
    }
    for (const item of raw) {
      const parsed = repositoryRecordSchema.safeParse(item);
      if (!parsed.success) {
        skipped++;
        console.warn(
          `Skipping invalid record in ${path.basename(file)}: ${parsed.error.message}`,
        );
        continue;
      }
      const repo = parsed.data;
      const existing = byId.get(repo.id);
      if (!existing) {
        byId.set(repo.id, repo);
      } else {
        byId.set(repo.id, preferRecord(existing, repo));
      }
    }
  }

  const byCategory = new Map<string, RepositoryRecord[]>();
  for (const repo of byId.values()) {
    const list = byCategory.get(repo.primaryCategory) ?? [];
    list.push(repo);
    byCategory.set(repo.primaryCategory, list);
  }

  ensureDir(CANONICAL_DIR);

  let written = 0;
  for (const [category, repos] of [...byCategory.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    repos.sort((a, b) => a.id.localeCompare(b.id));
    const outPath = path.join(CANONICAL_DIR, `${category}.json`);
    writeJsonFile(outPath, repos);
    written += repos.length;
    console.log(`Wrote ${repos.length} → ${path.relative(process.cwd(), outPath)}`);
  }

  console.log(
    `Merged ${written} unique repos into ${byCategory.size} canonical file(s)` +
      (skipped ? ` (${skipped} invalid skipped)` : ""),
  );
}

main();
