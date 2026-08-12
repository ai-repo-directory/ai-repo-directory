# Architecture

## Overview

AI Repo Directory is a Next.js App Router application backed by curated JSON data and a GitHub metadata refresh pipeline.

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Research /     │────▶│ data/canonical/  │────▶│  Next.js site   │
│  editorial      │     │ RepositoryRecord │     │  lib/data.ts    │
└─────────────────┘     └────────┬─────────┘     └─────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼                         ▼
           scripts/ingest-github      scripts/rank
                    │                         │
                    ▼                         ▼
           data/derived/github/      data/derived/scores.json
```

## Why file-backed storage

- Reviewable PRs for every listing change
- No database required to deploy or contribute
- Schema is DB-ready (`RepositoryRecord`, `GitHubSnapshot`, `ScoreRecord`) for a later Postgres/SQLite migration

## Runtime data path

1. `loadCanonicalRepositories()` reads `data/canonical/*.json`
2. Optional GitHub snapshots merge live stats
3. Scores enrich ranking
4. `filterRepositories()` applies URL-shareable search params

Page requests **do not** call the GitHub API. Ingestion is offline/scheduled.

## Key modules

| Path | Role |
|------|------|
| `src/lib/types.ts` | Zod schemas and types |
| `src/lib/data.ts` | Loaders and homepage aggregates |
| `src/lib/search.ts` | Filters + Fuse.js search |
| `src/lib/ranking.ts` | Composite scoring |
| `src/lib/categories.ts` | Category catalog |
| `src/lib/collections.ts` | Editorial collections |
| `scripts/*` | Validate, merge, ingest, rank, discover |

## Discovery flow

`scripts/discover.ts` writes **candidates** only (`data/candidates/`). Humans promote into `data/raw/` → merge → canonical.

## Deployment

Static-friendly Node server (Next.js). See `DEPLOYMENT.md`.
