# Dataset v1 (frozen)

**Milestone tag:** `dataset-v1`  
**Freeze date:** 2026-08-12  
**Editorial verification date:** 2026-08-12  
**GitHub snapshot window:** 2026-08-12 (same-day ingest; history seed under `data/derived/github-history/2026-08-12/`)

This milestone freezes a **curated, independently verified** catalog after verification + completeness intake. It is a strong directory, not an exhaustive map of all AI repositories on GitHub.

---

## Counts

| Metric | Value |
|--------|------:|
| Canonical repositories | **256** |
| Prior verified catalog | 233 |
| Net additions this freeze | **23** |
| GitHub snapshots (`data/derived/github`) | **256** (1:1 with canonical) |
| Scores (`data/derived/scores.json`) | **256** |

### Category counts (primary)

| Category | Count |
|----------|------:|
| infrastructure | 28 |
| training | 19 |
| coding-agents | 18 |
| image-ai | 18 |
| local-ai | 18 |
| ai-agents | 17 |
| mcp-tools | 17 |
| audio-ai | 16 |
| evaluation | 16 |
| video-ai | 16 |
| multimodal | 15 |
| datasets | 14 |
| llm-inference | 13 |
| rag | 12 |
| research | 10 |
| vector-db | 9 |
| **Total** | **256** |

---

## What v1 claims (honest product language)

- **Curated** — editorial inclusion, not bulk GitHub scraping
- **Independently verified** — GitHub metadata + README/docs review (see `docs/verification/`)
- **Regularly refreshed** — GitHub metadata ingest on a weekly Actions cadence (plus local max-age rules)
- **Growing** — completeness intake continues via the candidate backlog

### What v1 does **not** claim

- Real-time / live GitHub data
- Star-velocity “trending”
- Exhaustive coverage of all AI repositories
- Uniform OSI open-source licensing for every listing

Home “Most starred” is a **total-stars / adoption proxy**, not velocity trending. True Δstars trending requires multi-day history (seeded 2026-08-12 only).

---

## Integrity gates at freeze

| Check | Result |
|-------|--------|
| Schema validation (`pnpm validate`) | Pass — 256 records |
| Duplicate id / URL / owner-repo | None |
| Snapshot completeness | 256/256 |
| Anomaly detector | 3 informational (pre-existing: round-star smell, `llama.cpp` id slug, universal `dateLastVerified`) — 0 auto-fixes required |
| New-addition random audit | n=15 / 23 (65%); **error rate 0%** |

---

## Completeness intake (this freeze)

**Critical omissions added (3/3):**

| Repository | Category |
|------------|----------|
| `BerriAI/litellm` | infrastructure |
| `modelcontextprotocol/modelcontextprotocol` | mcp-tools |
| `huggingface/huggingface_hub` | infrastructure |

**Strong candidates added (20):** see `docs/verification/COMPLETENESS_INTAKE.md`.

**Critical rejected:** none (all three critical omissions qualified).

Deferred / rejected candidates are preserved in `docs/verification/CANDIDATE_BACKLOG.md`.

---

## Policies (binding for v1)

### Stale / historical projects

Inactive but historically important projects are **retained** with honest `maintenance` (`slow` / `stale` / `archived`) and `historicallySignificant` when applicable. Do not delete lineage-defining research releases solely for low push activity.

### Source-available / dual license

- Prefer SPDX from GitHub when clear.
- When GitHub reports `NOASSERTION`, record `license: null` or the clarified SPDX from the LICENSE file and document in `notes`.
- Do **not** market the entire directory as uniformly “open source.” Dual-license / enterprise subtrees (e.g. LiteLLM `enterprise/`) must be noted.

### Freshness

See [`FRESHNESS_POLICY.md`](./verification/FRESHNESS_POLICY.md) (and root `docs/FRESHNESS_POLICY.md`).

| Layer | Cadence |
|-------|---------|
| GitHub mutable metadata | Weekly scheduled ingest (not real-time) |
| Editorial verification | `dateLastVerified` / verification ledger |
| Trending by star growth | Unavailable until ≥2 history days spanning ≥7 calendar days |

---

## Known limitations

1. **Not exhaustive** — 28 omission candidates were reviewed; only quality ADDs entered v1. Model-tooling coverage improved but niche wrappers remain out of scope.
2. **History day 1 only** — cannot claim star-velocity trending yet.
3. **Some licenses unclear** — MCP transition licenses and dual-license repos need careful reading of `notes`.
4. **Coverage uneven** — vector-db and research remain smaller by design; weakest residual gaps are listed in the intake report.
5. **Wan2.1 + Wan2.2 both present** — intentional lineage; prefer Wan2.2 for new work.

---

## Deferred candidates

See [`docs/verification/CANDIDATE_BACKLOG.md`](./verification/CANDIDATE_BACKLOG.md) for structured reevaluation notes (pytorch-lightning, llm.c, GPTQModel successor, etc.).

---

## How to reproduce freeze checks

```bash
pnpm validate
pnpm ingest          # requires GITHUB_TOKEN for full refresh
pnpm rank
npx tsx scripts/verify-sync-from-snapshots.ts
npx tsx scripts/verify-anomalies.ts
```

---

*Frozen for Dataset v1 — 2026-08-12.*
