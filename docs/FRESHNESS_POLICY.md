# Freshness Policy

Agent Group 8 — freshness review for AI Repo Directory.  
This document defines what “latest” means here, how metadata ages, and what claims are honest today.

**Verdict:** The directory may call itself **periodically refreshed / catalog-current**, not **real-time** or **live**. Do not advertise real-time stars, activity, or trending.

---

## 1. Definition of “latest” / freshness model

| Claim | Allowed? | Meaning in this project |
|-------|----------|-------------------------|
| **Real-time / live** | **No** | No continuous GitHub polling; no client-side live API. |
| **Latest as of last successful ingest** | **Yes** | Mutable GitHub fields come from `data/derived/github/{id}.json` → `fetchedAt`. |
| **Catalog-current** | **Yes, with caveats** | After a successful weekly Actions refresh lands in the deployed artifact. Deploy lag can add hours–days. |
| **Editorially verified** | **Separate** | `dateLastVerified` is human review of listing copy/classification — not star freshness. |

### Freshness layers (must stay distinct)

1. **GitHub API snapshot** — `github.fetchedAt` (ISO datetime). Source of effective stars/forks/pushedAt/license/language/archived/releases when present.
2. **Editorial verification** — `dateLastVerified` (typically a calendar date). Human inspected the listing; may not equal last API fetch.
3. **Score computation** — `scores.json` → `computedAt`. Derived from (1)+(canonical); recomputed by `pnpm rank`.
4. **Site deployment** — visitors see whatever was in the tree at build/runtime on the host. Refresh commits do not update production until redeploy.

**Honest one-liner for marketing/UI copy:**  
“GitHub stats are refreshed about weekly from the public API; editorial notes are verified separately.”

---

## 2. Repository metadata refresh schedule (Actions)

Workflow: `.github/workflows/refresh-metadata.yml`

| Trigger | When |
|---------|------|
| Cron | `0 6 * * 0` — **Sunday 06:00 UTC** (weekly) |
| Manual | `workflow_dispatch` |

Pipeline:

1. `pnpm ingest -- --force` with `REFRESH_MAX_AGE_HOURS=0` and `GITHUB_TOKEN`
2. `pnpm rank`
3. Commit + push changes under `data/derived` if any

### `REFRESH_MAX_AGE_HOURS` behavior

Implemented in `scripts/ingest-github.ts`:

- Default: **24** hours.
- Skip rule: if `data/derived/github/{id}.json` exists and `now - fetchedAt < maxAge`, the repo is **not** re-fetched (`skipped(fresh)`).
- `--force` bypasses the freshness check entirely (Actions uses both `--force` and `REFRESH_MAX_AGE_HOURS=0`).
- `REFRESH_MAX_AGE_HOURS=0` alone also forces re-fetch (age window is zero).

Local/dev ingest may therefore leave snapshots up to ~24h old by design. Scheduled production refresh aims for a **weekly** full overwrite.

---

## 3. Editorial verification timestamps (separate)

| Field | Location | Meaning |
|-------|----------|---------|
| `dateLastVerified` | Canonical `RepositoryRecord` | Last human verification of editorial fields / listing integrity |
| `sources` | Canonical | URLs inspected during verification |
| `fetchedAt` | `GitHubSnapshot` | Last successful GitHub API pull for that id |

**Rules:**

- Never overwrite `dateLastVerified` from ingest.
- Never treat `fetchedAt` as editorial verification.
- UI label “Last verified” must remain tied to `dateLastVerified` only.
- Bulk-stamping every record to the same calendar day without per-repo review is **not** honest verification (see gaps).

---

## 4. Trending policy

### Policy

- **Total stars are not sufficient** for a claim of “trending.”
- **True trending** requires historical star (and optionally fork/push) snapshots and a documented window (e.g. Δstars over 7 / 28 days).
- **If history is insufficient:** do **not** fabricate deltas. Label proxy rankings honestly (e.g. “Highest stars in catalog,” “Most starred,” “Adoption leaders”).
- Prefer renaming or subtitling the home “Trending” rail until delta history exists.

### Current state

- History directory: `data/derived/github-history/YYYY-MM-DD/{id}.json`
- Bootstrap + ingest append started **2026-08-12** (one day). **Not enough history for deltas.**
- Home “Trending” (`getHomeHighlights`) sorts by `effectiveStars` (total stars). Subtitle already softens to “Highest adoption in the catalog” — title still says “Trending.”

**Update (2026-08-12 completeness freeze):** Home rail renamed to **“Most starred”** with explicit “not star-velocity trending” copy. Internal field remains `highlights.trending` until delta ranking ships.

### Until enough history (recommended threshold)

- Minimum **2** successful history days spanning ≥ **7** calendar days before labeling anything “trending by star growth.”
- Prefer ≥ **4** weekly points (~28 days) for a 28-day trend badge.
- Until then: keep proxy sort; copy must not imply velocity.

---

## 5. Requirements for pages showing mutable GitHub metadata

Every surface that shows stars, forks, pushed/updated time, license, language, archived, or releases **should** eventually expose:

| Requirement | Intent |
|-------------|--------|
| **Freshness source** | e.g. “GitHub API snapshot” vs “canonical fallback” |
| **`github_fetched_at` / `fetchedAt`** | When API data was pulled (or “unavailable — using curated values”) |
| **`last_verified` / `dateLastVerified`** | Only from actual editorial verification |
| **Source URL** | Typically `githubUrl` (+ `sources` on detail) |
| **Stale / missing snapshot** | If no snapshot or fetch failed, do not imply live API |

**Current UI (do not change in this review):** cards show stars/updated with **no** `fetchedAt`; detail shows “Last verified” (`dateLastVerified`) but **not** GitHub fetch time. Gap vs this requirement is open.

---

## 6. Gaps found in current implementation

1. **Not real-time** — weekly Actions + optional local 24h cache; deploy lag unstated in product copy.
2. **`dateLastVerified` vs `fetchedAt` conflation risk** — detail page shows editorial verification next to API-backed stats without showing `fetchedAt`.
3. **Failed API refresh handling** — on HTTP/error, ingest logs a warning, increments `failed`, **leaves the previous snapshot in place**, and **exits 0** even if some/all repos fail. No per-id `fetchStatus` / error stamp. Stale data can look current.
4. **No historical snapshots historically** — only current overwrite files under `data/derived/github/`. True trending was impossible; home “Trending” = total stars.
5. **QC language** — `docs/QC_REPORT.md` says “live stars/activity” which overclaims vs weekly snapshots.
6. **Canonical star fields** — `repo.stars` / `latestCommitAt` can surface via `effective*` when snapshot missing; UI does not flag fallback.
7. **Editorial timestamps** — all 233 canonical `dateLastVerified` values observed as `2026-08-12` (same day as ingest), which may reflect bulk stamping rather than independent per-repo verification.
8. **Score `computedAt`** — not shown in UI; ranking can look “fresh” while GitHub snapshots are older (or vice versa).
9. **History retention** — Actions commits all of `data/derived`; history growth is unbounded unless pruned (future ops concern).

---

## 7. Recommended schema additions

Keep **raw GitHub API snapshots** separate from **editorial** fields.

### Editorial / listing (canonical)

| Field | Type | Notes |
|-------|------|-------|
| `verified_at` | ISO datetime (prefer) or date | Rename/clarify from `dateLastVerified`; set only on human review |
| `verification_status` | enum | e.g. `verified` \| `needs_review` \| `stale_editorial` |
| `sources` | URL[] | Already present — keep required on verify |

### GitHub derived (snapshot; already partly present)

| Field | Type | Notes |
|-------|------|-------|
| `github_fetched_at` | ISO datetime | Alias of existing `fetchedAt` in API/UI contracts |
| `source_url` | URL | `https://github.com/{owner}/{repo}` or API URL used |
| `fetch_status` | enum | `ok` \| `not_found` \| `error` \| `skipped_fresh` |
| `fetch_error` | string \| null | Last failure message; do not clear on skip |

### Enrichment view (UI contract)

Expose explicitly: `github_fetched_at`, `verified_at`, `metadata_source: "github_snapshot" | "canonical_fallback"`, `verification_status`.

### History (separate tree — implemented)

```
data/derived/github-history/
  YYYY-MM-DD/
    {id}.json          # full GitHubSnapshot (same schema as current)
  README.md
```

- Appended by `pnpm ingest` after each **successful** refresh (same-day overwrite).
- Do not merge editorial fields into history files.
- Optional later: slim daily index `YYYY-MM-DD/_index.json` with `{ id, stars, forks, pushedAt, fetchedAt }` for cheaper trend jobs.

---

## 8. Audit of existing trending / ranking logic honesty

| Surface | Behavior | Honest label? |
|---------|----------|---------------|
| Home **Trending** | Top 8 by `effectiveStars` | **Partial** — subtitle “Highest adoption…” is honest; title “Trending” implies velocity → **overclaim** until deltas exist |
| Explore `sort=stars` | Total stars | **Yes** if labeled “Stars” |
| Home **Recently updated** | Sort by `effectivePushedAt` | **Mostly yes** — “Newest known push activity”; still snapshot-aged, not live |
| Home **Emerging** | Curated `emerging` flag | **Yes** (editorial), not GitHub trend |
| Composite **score** | Weighted heuristic incl. log stars + activity | **Yes** per `RANKING_METHODOLOGY.md` — not “trending,” not scientific quality |
| Adoption component | Log of **total** stars | **Yes** as adoption proxy; **not** momentum |

### Ranking honesty notes (`src/lib/ranking.ts` / `scripts/rank.ts`)

- Docs correctly disclaim scientific ranking and star-as-quality.
- Activity uses last push age from snapshot/canonical — honest as “known last push,” not “active today.”
- Missing snapshot → falls back to canonical stars/commit dates without a penalty flag in the score record.
- No use of star history yet (correct — do not invent).

---

## Implementation notes (Agent 8)

- **UI not changed** in this review.
- History collection started: ingest appends to `data/derived/github-history/`; existing current snapshots bootstrapped into `2026-08-12/`.
- Policy path: `docs/verification/FRESHNESS_POLICY.md`
- Machine note: `docs/verification/_agent8_freshness.json`
