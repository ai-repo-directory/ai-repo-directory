# Ranking Methodology

This directory does **not** rank projects by GitHub stars alone.

Scores are a transparent, practical discovery heuristic (0–100). They are **not** a scientific measure of quality. Editorial judgment still matters for featured picks and collections.

## Composite formula

| Signal | Weight | What it measures |
|--------|--------|------------------|
| Adoption | 18% | Log-scaled star count (diminishing returns) |
| Maintenance | 16% | Curated maintenance signal; archived heavily penalized |
| Activity | 16% | Recency of last push / commit when known |
| Documentation | 12% | Curated documentation quality rating |
| Maturity | 12% | Releases, historical significance, featured status |
| Ecosystem | 12% | Cross-category relevance, tags, featured/emerging |
| Usefulness | 14% | Self-hostable, local/offline, demos, docs, clarity |

Implementation: `src/lib/ranking.ts`. Scores are recomputed by `pnpm rank` into `data/derived/scores.json`.

## What we intentionally avoid

- Treating star count as quality
- Fake precision (we round to one decimal)
- Auto-promoting newly discovered repos into top ranks
- Hiding archived or stale projects without labels

## Editorial overrides

- **Featured** and **collections** are human-curated
- **Emerging** flags highlight momentum beyond raw score
- Historically significant but stale projects remain listed with clear maintenance labels

## Updating scores

```bash
pnpm ingest   # refresh GitHub metadata (cached)
pnpm rank     # recompute scores
```
