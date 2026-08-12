# AI Repo Directory

A searchable, continuously updateable directory of high-quality AI repositories — curated and independently verified for discovery, not star-chasing.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · curated JSON + GitHub metadata pipeline

## Features

- Curated listings across inference, agents, coding agents, RAG, local AI, multimodal, training, eval, MCP, infra, and more
- Shareable search & filters (category, language, license, activity, self-hostable, local/offline, difficulty)
- Repository pages with editorial context, maintenance signals, and similar projects
- Category pages and editorial collections
- Transparent composite ranking (not stars-only) — see [RANKING_METHODOLOGY.md](./RANKING_METHODOLOGY.md)
- GitHub metadata refresh (weekly cadence) + candidate discovery pipeline (GitHub Actions)
- Dataset milestone: [docs/DATASET_V1.md](./docs/DATASET_V1.md)

## Quick start

```bash
pnpm install
cp .env.example .env.local
pnpm merge-data    # raw research → canonical
pnpm refresh       # optional: ingest GitHub stats + rank (needs GITHUB_TOKEN)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server |
| `pnpm build` / `pnpm start` | Production |
| `pnpm validate` | Schema + duplicate checks |
| `pnpm merge-data` | Merge `data/raw` → `data/canonical` |
| `pnpm ingest` | Refresh GitHub snapshots |
| `pnpm rank` | Recompute scores |
| `pnpm discover` | Write pending candidates |
| `pnpm test` | Vitest |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [docs/DATA_SCHEMA.md](./docs/DATA_SCHEMA.md)
- [RANKING_METHODOLOGY.md](./RANKING_METHODOLOGY.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [DATA_PROVENANCE.md](./DATA_PROVENANCE.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [docs/EXECUTION_PLAN.md](./docs/EXECUTION_PLAN.md)

## License

MIT (directory code and editorial metadata). Listed projects retain their own licenses.
