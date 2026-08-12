# QC Report

Date: 2026-08-12

## Totals

- Canonical repositories after merge: **233**
- Canonical category files: **16** (includes `vector-db` split from RAG research)
- GitHub snapshots: **233** (`pnpm ingest`, 0 failures)
- Validation: `pnpm validate` — OK (no duplicate IDs or GitHub URLs)

## Checks performed

1. **Duplicate IDs / URLs** — none in canonical after merge
2. **Same-name collisions across owners** — none detected
3. **Featured + archived** — none
4. **Schema** — all canonical records pass Zod `repositoryRecordSchema`
5. **GitHub metadata** — live stars/activity/license refreshed into `data/derived/github/`

## Follow-ups

- Promote vetted `data/candidates/` entries only after editorial write-up
- Periodic spot-checks of coding-agents vs ai-agents classification
- Weekly Actions workflow refreshes derived metadata

## Provenance

See `DATA_PROVENANCE.md`.
