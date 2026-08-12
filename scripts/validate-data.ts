import {
  repositoryRecordSchema,
  type RepositoryRecord,
} from "../src/lib/types";
import { CANONICAL_DIR, listJsonFiles, RAW_DIR, readJsonFile } from "./lib/paths";

type Issue = { file: string; message: string };

/**
 * Prefer canonical (post-merge source of truth). Fall back to raw seeds
 * when canonical is empty so research batches can be checked early.
 */
function resolveTargetDir(): { dir: string; label: string } | null {
  if (listJsonFiles(CANONICAL_DIR).length > 0) {
    return { dir: CANONICAL_DIR, label: "data/canonical" };
  }
  if (listJsonFiles(RAW_DIR).length > 0) {
    return { dir: RAW_DIR, label: "data/raw" };
  }
  return null;
}

function main(): void {
  const target = resolveTargetDir();
  if (!target) {
    console.error("No JSON files found in data/canonical or data/raw");
    process.exit(1);
  }

  const { dir, label } = target;
  const issues: Issue[] = [];
  const files = listJsonFiles(dir);
  const seenIds = new Map<string, string>();
  let total = 0;
  let valid = 0;

  for (const file of files) {
    let raw: unknown;
    try {
      raw = readJsonFile<unknown>(file);
    } catch (err) {
      issues.push({ file, message: `Failed to parse JSON: ${err}` });
      continue;
    }

    if (!Array.isArray(raw)) {
      issues.push({ file, message: "Expected a JSON array" });
      continue;
    }

    for (let i = 0; i < raw.length; i++) {
      total++;
      const parsed = repositoryRecordSchema.safeParse(raw[i]);
      if (!parsed.success) {
        const detail = parsed.error.issues
          .map((e) => `${e.path.join(".") || "(root)"}: ${e.message}`)
          .join("; ");
        issues.push({ file, message: `index ${i}: ${detail}` });
        continue;
      }

      const repo: RepositoryRecord = parsed.data;
      valid++;

      const prev = seenIds.get(repo.id);
      if (prev) {
        issues.push({
          file,
          message: `duplicate id "${repo.id}" (also in ${prev})`,
        });
      } else {
        seenIds.set(repo.id, file);
      }

      if (repo.secondaryCategories.includes(repo.primaryCategory)) {
        issues.push({
          file,
          message: `id "${repo.id}": secondaryCategories must not include primaryCategory "${repo.primaryCategory}"`,
        });
      }
    }
  }

  if (issues.length > 0) {
    console.error(`Validation failed (${issues.length} issue(s)) in ${label}:\n`);
    for (const issue of issues) {
      console.error(`  ${issue.file}: ${issue.message}`);
    }
    console.error(`\nChecked ${total} records (${valid} schema-valid).`);
    process.exit(1);
  }

  console.log(`OK: ${valid} records across ${files.length} file(s) in ${label}`);
}

main();
