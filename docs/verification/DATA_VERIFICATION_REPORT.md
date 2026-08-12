# Data Verification Report

**Campaign close:** 2026-08-12T17:58:09Z  
**Objective:** DATA TRUST — no UI changes, no deploy  
**Starting catalog:** 233 candidate repositories (treated as unverified)  
**Final catalog:** 233 verified-in-place (0 removals)

Machine-readable twin: [`verification-report.json`](./verification-report.json)  
Methodology: [`VERIFICATION_METHODOLOGY.md`](./VERIFICATION_METHODOLOGY.md)

---

## Executive verdict

The catalog is **structurally sound and GitHub-backed**, but it is **not complete** against an independent ecosystem benchmark, and it must **not** claim real-time “latest.”

| Trust dimension | Verdict |
|-----------------|---------|
| Repos real & correctly identified | **Strong** — 233/233 have same-day GitHub API snapshots; 55/55 live API spot-checks OK; 0 renames/404s in sample |
| Metadata current | **Good for weekly cadence** — snapshots `fetchedAt` 2026-08-12T17:35:59Z–17:40:06Z; 60 canonical rows synced from API |
| Classifications & editorial claims | **Mostly good after correction** — 19 category fixes, 13 summary rewrites, 52 maintenance realignments |
| Completeness | **Gaps remain** — 28 important omissions (3 critical) vs blind 120-candidate benchmark; weakest area: model tooling |

**Random audit:** n=75 stratified (expanded after initial >5% signal); **found error rate 1.33%**, **remaining 0%** after one correction.

---

## Scoreboard (required end metrics)

| # | Metric | Value |
|---|--------|------:|
| 1 | Starting repository count | **233** |
| 2 | Final verified repository count | **233** |
| 3 | Repositories removed | **0** |
| 4 | Repositories renamed/transferred (live) | **0** (27 lineage notes already in catalog) |
| 5 | Duplicates consolidated | **0** (none found) |
| 6 | Stale projects identified | **32** |
| 7 | Archived projects identified | **13** |
| 8 | Inaccurate summaries corrected | **13** |
| 9 | Category corrections | **19** (11 primary moves + 8 secondary cleanups) |
| 10 | License problems | **3** source-available, **20** unclear/none, **1** SPDX fix, **2** non-commercial |
| 11 | Important missing repositories found | **28** (3 critical, 22 strong, 3 optional) |
| 12 | Random audit sample size | **75** |
| 13 | Random audit error rate | **1.33% found / 0% remaining** |
| 14 | % verified directly against GitHub snapshots | **100%** (plus 55/55 live API OK) |
| 15 | Exact verification timestamp | **2026-08-12T17:58:09Z** |

Additional activity signal: **27** low-activity; **28** historically important dual-labeled; inactive historical projects **retained**.

---

## Agent group results

### 1 — GitHub metadata

- Coverage: 233 snapshots ↔ 233 canonical (0 missing / 0 orphans)
- Flagged: **13 archived**
- Synced mutable fields into canonical for **60** repos
- History seeded: `data/derived/github-history/2026-08-12/` (233 files)
- Ledger: `data/derived/verification/github-ledger.json`
- Live spot-check: **55 OK / 0 errors / 0 renames**

### 2 — Activity

| Status | Count |
|--------|------:|
| actively_maintained | 146 |
| maintained | 15 |
| low_activity | 27 |
| stale | 32 |
| archived | 13 |
| historically_important (dual) | 28 |

Fixed **52** maintenance mismatches vs `pushedAt`/archived.

### 3 — README / editorial

| Metric | Count |
|--------|------:|
| READMEs fetched | 232 |
| OK | 217 |
| Corrected | 13 |
| Flagged remaining | 2 |
| Fetch failed | 1 (`ali-vilab-vgen` — no README file; homepage used) |

Notable corrections: Continue (unmaintained), nanoGPT (deprecated), torchtune (wound down), MCP servers (samples ≠ production catalog), plus hosting-claim fixes.

### 4 — Categories

19 corrections applied. Examples: `llama.cpp` → local-ai; Transformers/Flax → infrastructure; wandb/OTel semconv → infrastructure; Vane → rag; MovieGenBench → evaluation.

### 5 — Licenses

See [`LICENSE_AUDIT.md`](./LICENSE_AUDIT.md).

| Openness | Count |
|----------|------:|
| open_source | 210 |
| source_available | 3 |
| unclear_or_none | 20 |

Do **not** market the whole directory as uniformly “open source.”

### 6 — Duplicates

See [`DUPLICATE_AUDIT.md`](./DUPLICATE_AUDIT.md). **No true duplicates.** Raw↔canonical selection deltas exist for 3 video IDs each side (intentional curation drift, not dupes).

### 7 — Omissions (blind)

See [`MISSING_IMPORTANT_REPOS.md`](./MISSING_IMPORTANT_REPOS.md).

Against 120 independent candidates: **92 present**, **28 missing**.

**Critical:** LiteLLM, MCP spec repo, `huggingface_hub`.

**Do not auto-add** until verified.

### 8 — Freshness

See [`FRESHNESS_POLICY.md`](./FRESHNESS_POLICY.md).

Honest claim: **periodically refreshed / catalog-current**, not real-time.  
Trending by star growth is **not** available yet (history day 1 only). Home “Trending” must remain labeled as adoption/stars proxy until multi-day history exists.

### 9 — Anomalies

3 informational anomalies; 0 auto-fixes required (round stars confirmed; `llama.cpp` id retains `.`; universal `dateLastVerified=2026-08-12` flagged as provenance smell — see freshness policy).

### 10 — Random audit

Stratified across all 16 categories; expanded to 75 after initial >5% investigation. Final remaining error rate **0%**.

---

## “Latest” definition (binding)

1. **GitHub metadata** — refreshed by scheduled ingest (weekly Actions + local max-age rules); authority = snapshot `fetchedAt`.
2. **Editorial verification** — `dateLastVerified` / ledger `verified_at`; separate from stars.
3. **Trending** — Δstars over documented windows from `data/derived/github-history/`; until enough history, **do not** claim trending velocity.

---

## Completeness note

A directory of **233 excellent verified projects** is preferable to inflating toward noisy thousands. Next curated intake should prioritize the 3 critical omissions and model-tooling strong candidates — still one-by-one verified, never bulk-imported from the omission list.

---

## Deliverables checklist

- [x] `DATA_VERIFICATION_REPORT.md`
- [x] `MISSING_IMPORTANT_REPOS.md`
- [x] `LICENSE_AUDIT.md`
- [x] `DUPLICATE_AUDIT.md`
- [x] `FRESHNESS_POLICY.md`
- [x] `VERIFICATION_METHODOLOGY.md`
- [x] `verification-report.json`

Supporting agent artifacts live alongside this file under `docs/verification/`.
