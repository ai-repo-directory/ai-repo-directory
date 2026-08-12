# Data Provenance

## Sources

Listings combine:

1. **Editorial research** — maintainers inspect project READMEs, docs sites, and public GitHub metadata
2. **GitHub API snapshots** — stars, forks, license, pushedAt, archived, releases (`data/derived/github/`)
3. **Human curation** — featured flags, collections, difficulty, documentation quality, why-it-matters copy

## Rules

- Never fabricate stars, licenses, commit dates, or releases — use `null` when unknown
- Do not trust GitHub one-line descriptions alone for editorial summaries
- Record `sources` URLs inspected and `dateLastVerified`
- Mark `archived`, `stale`, and historically significant projects explicitly
- Candidates from automated discovery are **not** production listings until reviewed

## Refresh

GitHub-derived fields are refreshed by `pnpm ingest` (scheduled via GitHub Actions). Editorial fields change only via deliberate data PRs.

## Attribution

All repositories remain the property of their respective copyright holders. This directory provides discovery metadata and commentary under the project license (see repository root).
