# Agent 9 — Statistical Anomaly Report

Generated: 2026-08-12

## Summary

- Canonical repositories scanned: **256**
- Derived GitHub snapshots available: **256**
- Total anomalies: **3**
- Fixes applied: **0**

### Counts by type

| Type | Count |
| --- | ---: |
| `impossible_negative_counts` | 0 |
| `suspicious_star_counts` | 1 |
| `stars_lower_than_forks` | 0 |
| `impossible_dates` | 0 |
| `release_before_created` | 0 |
| `malformed_github_url` | 0 |
| `missing_required_fields` | 0 |
| `duplicate_editorial_text` | 0 |
| `repetitive_ai_phrasing` | 0 |
| `identical_metadata` | 0 |
| `canonical_derived_mismatch` | 0 |
| `owner_repo_url_mismatch` | 0 |
| `id_slug_mismatch` | 1 |
| `fabricated_date_last_verified` | 1 |

## Fixes applied

No confirmed clear data errors required automatic fixes.

## Anomalies by type

### impossible_negative_counts (0)

_None detected._

### suspicious_star_counts (1)

- [info] **internlm-lmdeploy**: Round star count 8000 confirmed by derived GitHub snapshot (likely real)

### stars_lower_than_forks (0)

_None detected._

### impossible_dates (0)

_None detected._

### release_before_created (0)

_None detected._

### malformed_github_url (0)

_None detected._

### missing_required_fields (0)

_None detected._

### duplicate_editorial_text (0)

_None detected._

### repetitive_ai_phrasing (0)

_None detected._

### identical_metadata (0)

_None detected._

### canonical_derived_mismatch (0)

_None detected._

### owner_repo_url_mismatch (0)

_None detected._

### id_slug_mismatch (1)

- [info] **ggml-org-llama.cpp**: id keeps literal '.' from repo name; schema prefers hyphenated "ggml-org-llama-cpp"

### fabricated_date_last_verified (1)

- [info] dateLastVerified "2026-08-12" shared by 256/256 projects (all have github fetchedAt)

## Notes

- Star counts were **not** invented or overwritten from snapshots.
- Repositories were **not** deleted.
- UI code was not changed.
- Canonical vs derived star/fork gaps under significance thresholds are omitted.
