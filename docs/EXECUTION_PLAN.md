# Execution Plan — AI Repo Directory

## Product

A production-ready, searchable, continuously updateable directory of high-quality open-source AI repositories. Not a static awesome-list.

## Architecture (high level)

```
data/canonical/*.json   → curated seed + editorial metadata (source of truth for listings)
scripts/ingest          → GitHub API refresh (stars, forks, activity, license, archived)
scripts/discover        → candidate discovery → data/candidates/
scripts/rank            → composite score → data/derived/scores.json
lib/data.ts             → load + filter + search (file-backed; swap to DB later)
app/                    → Next.js App Router UI
.github/workflows/      → scheduled refresh
```

Persistence: JSON files in-repo for portability and reviewable PRs. Schema is DB-ready. Optional SQLite/Postgres later without rewriting the product surface.

## Parallel workstreams

### Batch A — Research (category ownership)

| Agent | Category ID | Focus |
|-------|-------------|-------|
| R1 | llm-inference | Inference, runtimes, serving |
| R2 | ai-agents | Agent frameworks |
| R3 | coding-agents | Coding agents & AI devtools |
| R4 | rag | RAG / retrieval / knowledge |
| R5 | local-ai | Local / self-hosted AI |
| R6 | image-ai | Image generation/editing |
| R7 | video-ai | Video generation |
| R8 | audio-ai | Speech TTS/STT, music, audio |
| R9 | training | Training / fine-tuning / post-training |
| R10 | evaluation | Eval / observability / benchmarks |
| R11 | mcp-tools | MCP / tools / integrations |
| R12 | multimodal | Multimodal AI |
| R13 | datasets | Datasets / synthetic data |
| R14 | infrastructure | AI infrastructure |
| R15 | research | Research implementations |

Each writes `data/raw/<category>.json` conforming to `DATA_SCHEMA.md`.

### Batch B — Quality control

| Agent | Task |
|-------|------|
| Q1 | Duplicate / fork / rename detection |
| Q2 | Metadata verification vs GitHub |
| Q3 | Classification consistency |
| Q4 | Abandoned / stale detection |
| Q5 | Editorial quality pass |

### Batch C — Engineering

| Agent | Task |
|-------|------|
| E1 | Next.js scaffold, design system, layout |
| E2 | Schema, loaders, search/filter, ranking |
| E3 | GitHub ingestion + Actions + discovery |
| E4 | Pages: home, repo, category, collection, explore |
| E5 | SEO, a11y, tests, docs, deployment config |

## Milestones

1. Schema + scaffold + empty data loaders
2. Research merge (canonical data)
3. Ingestion + ranking working offline
4. Full UI + collections
5. Tests green, docs complete, first commit

## Ranking (summary)

Transparent composite of: adoption, maintenance, activity, docs, maturity, ecosystem, usefulness — not stars alone. See `RANKING_METHODOLOGY.md`.

## Non-goals (v1)

- User accounts / comments
- Real-time GitHub on every request
- Auto-promote discoveries to featured without review
