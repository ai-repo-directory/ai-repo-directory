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

## GitHub Pages (production)

The public production target is GitHub Pages. The app uses Next.js static export, so no Node runtime is needed after build.

1. Create the public organization/repository and enable **Settings → Pages → Source: GitHub Actions**.
2. Set the chosen organization Pages URL in `.github/workflows/ci.yml` and `.github/workflows/deploy-pages.yml`.
3. Push `main`. The deployment workflow validates, builds `out/`, and deploys it.
4. Confirm the Pages URL, `/sitemap.xml`, `/robots.txt`, `/explore/`, and several repository pages after the first deployment.

For the preferred handle, the build environment is:

```bash
NEXT_PUBLIC_SITE_URL=https://ai-repo-directory.github.io/ai-repo-directory
NEXT_PUBLIC_BASE_PATH=/ai-repo-directory
```

If the organization handle differs, replace both values everywhere they occur in the Pages and CI workflows, README, and this document.

## Data-only updates

Editorial PRs that only touch `data/**` still require a rebuild/redeploy so the static export includes updated JSON. A merge to `main` automatically triggers Pages deployment.
