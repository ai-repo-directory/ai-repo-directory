# Agent 1 — GitHub Canonical Metadata Verification

**Verified at:** 2026-08-13T01:40:45.922Z
**Snapshot source:** `data/derived/github/*.json` (same-day API snapshots)
**Expected snapshot day:** 2026-08-12

## Summary

- **Canonical repos:** 256
- **Verified against GitHub snapshots:** 256/256 (100%)
- **Status ok:** 243
- **Status flagged:** 13
- **Status missing_snapshot:** 0
- **Status mismatch:** 0
- **Canonical synced from snapshots:** no changes needed
- **History batch 2026-08-12:** written=0, already present=256

## Flag counts

- `archived`: 13

## Canonical field sync

Mutable GitHub fields copied from snapshot → canonical when snapshot is present and authoritative:
`stars`, `forks`, `language`, `license`, `latestCommitAt` ← `pushedAt`, `latestRelease`, `archived`, `description`, `homepage`

No field updates required.

## Live spot-check

Stratified sample of **30** repos (API rate limit often exhausted; falls back to HTML / raw README).

- **Passed:** 30/30
- **Failed:** 0/30

| id | method | ok | detail |
|----|--------|----|--------|
| `facebookresearch-demucs` | api | yes | API 200 |
| `plachtaa-vall-e-x` | api | yes | API 200 |
| `rhasspy-piper` | api | yes | API 200 |
| `abanteai-archive-old-cli-mentat` | api | yes | API 200 |
| `antonosika-gpt-engineer` | api | yes | API 200 |
| `roocodeinc-roo-code` | api | yes | API 200 |
| `sourcegraph-cody-public-snapshot` | api | yes | API 200 |
| `voideditor-void` | api | yes | API 200 |
| `instructlab-instructlab` | api | yes | API 200 |
| `huggingface-text-generation-inference` | api | yes | API 200 |
| `browserbase-mcp-server-browserbase` | api | yes | API 200 |
| `facebookresearch-chameleon` | api | yes | API 200 |
| `tensorflow-tensor2tensor` | api | yes | API 200 |
| `significant-gravitas-autogpt` | api | yes | API 200 |
| `openai-whisper` | api | yes | API 200 |
| `anomalyco-opencode` | api | yes | API 200 |
| `huggingface-datasets` | api | yes | API 200 |
| `langfuse-langfuse` | api | yes | API 200 |
| `automatic1111-stable-diffusion-webui` | api | yes | API 200 |
| `huggingface-transformers` | api | yes | API 200 |
| `vllm-project-vllm` | api | yes | API 200 |
| `ollama-ollama` | api | yes | API 200 |
| `modelcontextprotocol-servers` | api | yes | API 200 |
| `openai-clip` | api | yes | API 200 |
| `langchain-ai-langchain` | api | yes | API 200 |
| `deepseek-ai-deepseek-v3` | html | yes | HTML 200 exists |
| `hiyouga-llamafactory` | html | yes | HTML 200 exists |
| `meilisearch-meilisearch` | html | yes | HTML 200 exists |
| `hpcaitech-open-sora` | html | yes | HTML 200 exists |
| `openai-openai-agents-python` | html | yes | HTML 200 exists |

## Notable flagged repos

- `abanteai-archive-old-cli-mentat` — **flagged** — archived (snapshot.archived=true)
- `antonosika-gpt-engineer` — **flagged** — archived (snapshot.archived=true)
- `browserbase-mcp-server-browserbase` — **flagged** — archived (snapshot.archived=true)
- `facebookresearch-chameleon` — **flagged** — archived (snapshot.archived=true)
- `facebookresearch-demucs` — **flagged** — archived (snapshot.archived=true)
- `huggingface-text-generation-inference` — **flagged** — archived (snapshot.archived=true)
- `instructlab-instructlab` — **flagged** — archived (snapshot.archived=true)
- `plachtaa-vall-e-x` — **flagged** — archived (snapshot.archived=true)
- `rhasspy-piper` — **flagged** — archived (snapshot.archived=true)
- `roocodeinc-roo-code` — **flagged** — archived (snapshot.archived=true)
- `sourcegraph-cody-public-snapshot` — **flagged** — archived (snapshot.archived=true)
- `tensorflow-tensor2tensor` — **flagged** — archived (snapshot.archived=true)
- `voideditor-void` — **flagged** — archived (snapshot.archived=true)

## Artifacts

- `docs/verification/_agent1_github_verification.json`
- `data/derived/verification/github-ledger.json`
- `data/derived/github-history/2026-08-12/{id}.json`
