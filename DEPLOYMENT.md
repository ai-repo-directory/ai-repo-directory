# Deployment

## Quick start

```bash
pnpm install
cp .env.example .env.local
# optional: GITHUB_TOKEN for ingest
pnpm merge-data   # if starting from data/raw
pnpm refresh      # ingest + rank (needs network + token for best results)
pnpm dev
```

## Production build

```bash
pnpm build
pnpm start
```

## Environment

| Variable | Purpose |
|----------|---------|
| `GITHUB_TOKEN` | GitHub API for ingest/discover (higher rate limits) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for sitemap/OG |
| `REFRESH_MAX_AGE_HOURS` | Skip re-fetching fresh snapshots (default 24) |

## Hosting

Works on any Node host that supports Next.js (Vercel, Fly, Railway, self-hosted).

Recommended:

1. Set `NEXT_PUBLIC_SITE_URL`
2. Enable the `refresh-metadata` GitHub Action with `contents: write` and a token that can call the GitHub API
3. Deploy on push to `main`

## Data-only updates

Editorial PRs that only touch `data/**` still require a rebuild/redeploy so the app bundle picks up JSON changes (file reads happen at build/runtime from disk depending on host). On Vercel, a production redeploy after merge is sufficient.
