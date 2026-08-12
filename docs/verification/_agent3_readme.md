# Agent 3 — README / documentation verification

**Date:** 2026-08-12  
**Scope:** All 233 canonical repos in `data/canonical/*.json`  
**Method:** Fetch GitHub README via `raw.githubusercontent.com/{owner}/{repo}/{defaultBranch}/README.md` (branch from `data/derived/github` snapshots; fallbacks `main`/`master` and common README filenames). Compare `editorialSummary`, `whyCare`, audience, `selfHostable` / `localOfflineCapable`, and classification cues to README facts. Prefer README over name-based inference. Depth prioritized for featured, high-star, maintenance-mismatch, and slop-prone copy.

## Totals

| Metric | Count |
|--------|------:|
| Repos reviewed | 233 |
| READMEs fetched | 232 |
| Status `ok` | 217 |
| Status `flagged` | 2 |
| Status `corrected` | 13 |
| Status `fetch_failed` | 1 |

Machine-readable per-repo results: [`_agent3_readme.json`](./_agent3_readme.json).

## Fetch failures

- **`ali-vilab-vgen`** — `README.md` returns 404 on the default branch (jsDelivr mirror agrees: no README file). Homepage [i2vgen-xl.github.io](https://i2vgen-xl.github.io) confirms the I2VGen-XL image-to-video project; GitHub description matches the VGen ecosystem framing. Marked **`unverified_readme`**; editorial left unchanged; notes/sources updated with homepage.

## Overall editorial quality

Most featured and high-star summaries already tracked README reality well (Ollama, A1111, Transformers, llama.cpp, Whisper, vLLM, CrewAI, FAISS, etc.). Systematic false positives (e.g. “summary doesn’t repeat the project name”) were ignored. Real problems clustered on **stale maintenance framing**, **overselling reference/sample repos as production**, and a few **hosting capability flags**.

## Top corrections

1. **`continuedev-continue`** — README: repo is read-only / no longer actively maintained after final 2.0.0. Editorial still sold a mature active IDE agent; `maintenance` was `active` → **`stale`**. Rewrote summary/whyCare as historical reference.
2. **`karpathy-nanogpt`** — README (Nov 2025): deprecated in favor of **nanochat**. Editorial called it the default/best starting point → rewritten as classic educational artifact with successor pointer; `maintenance` → **`stale`**, `historicallySignificant` → true.
3. **`meta-pytorch-torchtune`** — README: development wound down in 2025 / not actively maintained. Editorial + `maintenance=active` omitted that → rewritten; `maintenance` → **`stale`**.
4. **`modelcontextprotocol-servers`** — whyCare told readers to “ship production” from this monorepo; README WARNING: educational reference implementations, use MCP Registry for server lists → rewritten.
5. **`itzcrazykns-vane`** — `localOfflineCapable=false` contradicted README (“runs entirely on your own hardware”, Ollama) → **`true`** (summary already OK).
6. **`browserbase-mcp-server-browserbase`** — `selfHostable=false` but README describes a self-hostable MCP server (still Browserbase-cloud-dependent; archived) → **`true`**.
7. **`giskard-ai-giskard-oss`** — Editorial was generic LLM/ML testing; README centers **v3 agentic rewrite** and notes v2 unmaintained → rewritten.
8. **`voideditor-void`** — README says **deprecated** (not only archived) → editorial updated.
9. **`openhands-openhands`** — Aligned with current README: ACP-compatible agents + Agent Canvas multi-backend control center.
10. **`run-llama-llama-index`** — README lead is agentic apps over private data; RAG-only framing updated.
11. **`zylon-ai-private-gpt`** — Matched README “API layer for private AI apps” positioning.
12. **`fishaudio-fish-speech`** — Softened unqualified “SOTA” to Seed-TTS Eval WER evidence from README + license caveat.
13. **`sgl-project-sglang`** — Removed “cutting-edge” slop; kept RadixAttention / structured-generation facts.

## Flagged (not rewritten)

- **`langchain-ai-langchain`** — Editorial still leads with RAG primitives; current README leads with agents/LLM apps. Directionally fair (RAG remains in the ecosystem) but mild drift.
- **`confident-ai-deepeval`** — `localOfflineCapable=false` while README stresses local pytest-style metrics; may be intentional if LLM-as-judge needs APIs. Left for human judgment.

## Audience / classification / hosting

- No widespread audience hallucinations found against README signals.
- Framework vs app vs library vs service tagging was generally consistent with README blurbs for featured/high-star repos.
- Hosting flags were mostly accurate; the clear errors fixed were **Vane** (local) and **Browserbase MCP** (self-hostable).

## Notes for follow-up

- Re-check **Continue** / **torchtune** / **nanoGPT** if upstream status changes again.
- **VGen**: if a README appears later, re-verify the ModelScope / I2VGen-XL editorial.
- Spot-check remaining soft LangChain RAG framing when category copy is next refreshed.
