# Contributing

Thanks for helping improve the AI Repo Directory.

## Add or update a repository

1. Add/edit a record in `data/raw/<category>.json` (or directly in `data/canonical/` for small fixes)
2. Follow `docs/DATA_SCHEMA.md` — prefer `null` over guessing
3. Run `pnpm validate` and `pnpm merge-data`
4. Optionally `pnpm ingest` + `pnpm rank` with a `GITHUB_TOKEN`
5. Open a PR with why the project belongs (significance, maintenance, usefulness)

## Quality bar

Include projects for technical significance, adoption, maintenance, docs, ecosystem relevance, or practical usefulness — not merely because the README says “AI”.

## Discoveries

Automated candidates land in `data/candidates/`. To promote: copy into raw/canonical with full editorial fields, set `status: approved` on the candidate.

## Code changes

- TypeScript strict, App Router
- `pnpm lint && pnpm typecheck && pnpm test && pnpm build` before merge
- No secrets in the repo — use `.env.example`

## Editorial tone

Write like a senior engineer recommending tools to peers: specific, skeptical of hype, clear about trade-offs.
