# Agent 1 — GitHub metadata verification

**verified_at:** 2026-08-12T19:25:08.664Z

## Result

- Canonical repos processed: 256
- OK: 243
- Flagged: 13
- Missing snapshots: 0
- Repos with fields synced from snapshots: 17
- Coverage vs GitHub snapshots: **100%**
- History seeded: `data/derived/github-history/2026-08-12/` (256 files)

## Source policy

Mutable GitHub fields were synced from `data/derived/github/*.json` (fetchedAt window on 2026-08-12).
These snapshots were produced by `pnpm ingest` against the GitHub REST API.
Live re-fetch of all 233 was not repeated in this pass when unauthenticated rate limits were exhausted; ledger records `source: github_api_snapshot` and each snapshot's `fetchedAt` as `github_fetched_at`.

## Flags

See `_agent1_github_verification.json` for per-repo flags (`archived`, `disabled`, `url_owner_repo_mismatch`, `star_drift_gt_20pct`, `stars_lt_forks`).
