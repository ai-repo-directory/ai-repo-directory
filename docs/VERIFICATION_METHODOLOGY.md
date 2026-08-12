# Verification Methodology

**Campaign:** Independent dataset trust verification  
**Timestamp:** 2026-08-12T18:20:00Z (campaign close; see machine report for exact per-agent times)  
**Starting catalog size:** 233 canonical repositories  
**Principle:** Treat the prior research catalog as an **unverified candidate dataset**. Do not trust prior research agents to grade their own work.

## Architecture

Ten independent agent groups with separated responsibilities:

| Group | Responsibility | Primary outputs |
|------:|----------------|-----------------|
| 1 | GitHub canonical metadata | `_agent1_github_verification.json`, live spot-check, `data/derived/verification/github-ledger.json` |
| 2 | Activity / maintenance | `_agent2_activity.json` |
| 3 | README / editorial | `_agent3_readme.json`, README cache |
| 4 | Categories / tags | `_agent4_categories.json` |
| 5 | Licenses / openness | `LICENSE_AUDIT.md`, `_agent5_licenses.json` |
| 6 | Duplicates / renames / forks | `DUPLICATE_AUDIT.md` |
| 7 | Important omissions (blind) | `_agent7_independent_candidates.md` → `MISSING_IMPORTANT_REPOS.md` |
| 8 | Freshness / “latest” honesty | `FRESHNESS_POLICY.md` |
| 9 | Statistical anomalies | `_agent9_anomalies.json` |
| 10 | Stratified random audit (≥50) | `_agent10_random_audit.json` |

Agent 7 was instructed **not** to inspect `data/canonical`, `data/raw`, or `data/derived` before building its candidate list.

## Authoritative sources

| Fact type | Source of truth (priority order) |
|-----------|----------------------------------|
| Stars, forks, archived, pushed, license SPDX, default branch, releases | GitHub REST API → stored in `data/derived/github/{id}.json` |
| What the project does / audience / local claims | Official README → official docs → official homepage |
| Category / editorial judgment | Human/agent review against README; never repo-name inference alone |
| Openness class | GitHub license metadata + LICENSE file semantics; not “source is visible” |

Blog posts are **not** sources of truth.

## Provenance fields

| Field | Meaning |
|-------|---------|
| `github_fetched_at` / snapshot `fetchedAt` | When GitHub API data was pulled |
| `verified_at` (ledger) | When a verification pass inspected the record |
| `dateLastVerified` (canonical) | Editorial verification date (must not be fabricated from ingest) |
| `source` | e.g. `github_api_snapshot`, `github_api_live`, `readme_raw` |
| `verification status` | `ok` / `flagged` / `missing_snapshot` / etc. |

**Separation rule:** Raw GitHub API snapshots stay under `data/derived/github/`. Editorial fields stay in `data/canonical/`. Do not mix assertions.

## GitHub verification procedure (Group 1)

1. Confirm 1:1 snapshot coverage for all canonical IDs.
2. Sync mutable API fields (stars, forks, language, license when present, pushedAt→latestCommitAt, releases, archived, description, homepage) from snapshots into canonical.
3. Seed `data/derived/github-history/YYYY-MM-DD/` for future trending deltas.
4. Live re-verify a stratified sample via GitHub API when rate limits allow.
5. Flag archived/disabled/URL mismatches/star drift.

**This campaign:** Snapshots fetched 2026-08-12T17:35:59Z–17:40:06Z via `pnpm ingest`. Unauthenticated live re-fetch of all 233 was blocked by rate limits; **55/55** stratified live API checks succeeded (0 missing, 0 renames). Ledger marks `source: github_api_snapshot` with each snapshot’s `fetchedAt`.

## Activity procedure (Group 2)

Status from `pushedAt` (not `updatedAt` alone), plus archived + `historicallySignificant`:

- actively_maintained ≤30d  
- maintained ≤90d  
- low_activity ≤365d  
- stale >365d  
- archived if GitHub/canonical archived  
- historically_important as dual-label when significant

Inactive historically important projects are **retained**.

## README procedure (Group 3)

Fetch `raw.githubusercontent.com/{owner}/{repo}/{defaultBranch}/README.md` (branch from snapshot; main/master fallbacks). Compare editorialSummary/whyCare/self-host/local claims. Rewrite only when clearly wrong.

## Category procedure (Group 4)

Re-check primary/secondary/tags; avoid inflation (LLM-using ≠ agent framework). Move records so filename matches `primaryCategory`.

## License procedure (Group 5)

Classify each repo:

- `open_source` — OSI-style / commonly accepted FOSS SPDX  
- `source_available` — restrictive visible source (Elastic, NC, etc.)  
- `unclear_or_none` — missing / undetected  

Never equate “on GitHub” with open source.

## Omissions procedure (Group 7)

1. Blind ecosystem research → candidate list  
2. Compare to catalog with rename/transfer equivalence  
3. Rank Critical / Strong / Optional  
4. **Do not auto-add**

## Random audit procedure (Group 10)

Stratified ≥50 repos across all categories (seed `20260812`). If error rate >5%, expand sample and correct. Threshold this campaign: **2.0%** on n=50 (no expansion required).

## “Latest” definition

See [`FRESHNESS_POLICY.md`](./FRESHNESS_POLICY.md). Short form:

- **Not real-time.**  
- GitHub metadata: refreshed on a defined schedule (weekly Actions + local cache rules).  
- Editorial verification: separate timestamp.  
- Trending: requires historical snapshots; until then, label star proxy rankings honestly.

## Trending

Total stars ≠ trending. History collection started 2026-08-12 under `data/derived/github-history/`. Do not fabricate past star counts. Ingest now appends daily history copies when available.

## Final report set

- `DATA_VERIFICATION_REPORT.md`  
- `MISSING_IMPORTANT_REPOS.md`  
- `LICENSE_AUDIT.md`  
- `DUPLICATE_AUDIT.md`  
- `FRESHNESS_POLICY.md`  
- `VERIFICATION_METHODOLOGY.md`  
- Machine-readable: `verification-report.json`
