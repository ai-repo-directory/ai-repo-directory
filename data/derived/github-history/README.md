# GitHub snapshot history

Point-in-time copies of `data/derived/github/*.json`, partitioned by UTC calendar day.

```
github-history/
  YYYY-MM-DD/
    {repo-id}.json
```

- Written by `pnpm ingest` after each successful API refresh (idempotent same-day overwrite).
- Used for future star-delta / true trending — **not** consumed by the UI yet.
- Do not invent intermediate days; missing days mean no successful refresh that day.
- Keep raw API fields here; do not mix editorial `dateLastVerified` into these files.
