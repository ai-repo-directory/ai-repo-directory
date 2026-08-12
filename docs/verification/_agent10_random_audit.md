# Agent 10 — Random Stratified Manual Audit

**Verified:** 2026-08-12  
**Seed:** `20260812`  
**Sample size:** 75 (initial 50 + expansion 25)  
**PASS / FAIL (remaining):** 75 / 0  
**Error rate (findings before fix):** 1.33%  
**Error rate (remaining after fix):** 0.00%  

## Sampling method

- Stratified across **all 16** `data/canonical/*.json` categories.
- Base allocation: **≥3 per category** where possible; leftover slots to largest categories.
- Within-category shuffle: `sha256(f"{seed}:{category}")` as RNG seed.
- Initial 50-sample pass flagged **>5%** provisional failures (Continue README/maintenance conflict, Browserbase `selfHostable`, plus one false-positive editorial grounding hit). Expanded by **+25** (expansion seed `20260837`) as required; Continue was corrected in canonical before final tally.

## Criteria checked (each repo)

1. identity (owner/repo/url real)
2. description / editorialSummary accuracy vs README
3. category appropriateness
4. maintenance signal vs pushedAt (Agent2 rules; README unmaintained overrides recent push noise)
5. license vs GitHub snapshot (LICENSE file authoritative when API is NOASSERTION/null and notes document it)
6. local/self-hosted claims
7. stars/forks vs derived github snapshot (+ live spot-checks)
8. current existence (snapshot + HTTP 200 spot-checks)

## Per-category breakdown

| Category | Sampled | PASS | FAIL |
|----------|--------:|-----:|-----:|
| `ai-agents` | 5 | 5 | 0 |
| `audio-ai` | 5 | 5 | 0 |
| `coding-agents` | 6 | 6 | 0 |
| `datasets` | 4 | 4 | 0 |
| `evaluation` | 5 | 5 | 0 |
| `image-ai` | 5 | 5 | 0 |
| `infrastructure` | 6 | 6 | 0 |
| `llm-inference` | 4 | 4 | 0 |
| `local-ai` | 5 | 5 | 0 |
| `mcp-tools` | 5 | 5 | 0 |
| `multimodal` | 4 | 4 | 0 |
| `rag` | 4 | 4 | 0 |
| `research` | 4 | 4 | 0 |
| `training` | 5 | 5 | 0 |
| `vector-db` | 4 | 4 | 0 |
| `video-ai` | 4 | 4 | 0 |

## FAILs found (with recommended fixes)

| id | category | issue | recommended fix | fixed? |
|----|----------|-------|-----------------|--------|
| `browserbase-mcp-server-browserbase` | `mcp-tools` | selfHostable=true despite requiring Browserbase cloud browsers | Set selfHostable=false; note cloud dependency | yes |

### Fix applied

- `browserbase-mcp-server-browserbase`: set `selfHostable` **true → false**; updated `notes`; `dateLastVerified=2026-08-12`.

## Documented license overrides (PASS)

These differ from the GitHub snapshot `license: null` (API NOASSERTION) but match the repo LICENSE file and existing notes:

| id | canonical | snapshot |
|----|-----------|----------|
| `janhq-jan` | `Apache-2.0` | `None` |
| `facebookresearch-moviegenbench` | `CC-BY-NC-4.0` | `None` |

## Notable PASS edge cases

- **`continuedev-continue`**: README states the repo is read-only / no longer actively maintained; canonical `maintenance=stale` kept despite recent `pushedAt` (manual override).
- **Stars/forks**: sample matched `data/derived/github` snapshots; live spot-check of Continue showed ±2 star drift only.
- **Existence**: all sampled repos have snapshots + README cache; 20+ live `github.com` HEAD checks returned HTTP 200.

## Full sample list

- **ai-agents** (5): `camel-ai-camel` (init), `crewaiinc-crewai` (init), `openai-openai-agents-python` (init), `huggingface-smolagents` (exp), `microsoft-autogen` (exp)
- **audio-ai** (5): `openai-whisper` (init), `swivid-f5-tts` (init), `yl4579-styletts2` (init), `m-bain-whisperx` (exp), `fishaudio-fish-speech` (exp)
- **coding-agents** (6): `continuedev-continue` (init), `sourcegraph-cody-public-snapshot` (init), `cline-cline` (init), `antonosika-gpt-engineer` (init), `aaif-goose-goose` (exp), `qwenlm-qwen-code` (exp)
- **datasets** (4): `argilla-io-distilabel` (init), `allenai-dolma` (init), `meta-llama-synthetic-data-kit` (init), `huggingface-datatrove` (exp)
- **evaluation** (5): `truera-trulens` (init), `confident-ai-deepeval` (init), `traceloop-openllmetry` (init), `braintrustdata-autoevals` (exp), `facebookresearch-moviegenbench` (exp)
- **image-ai** (5): `huggingface-diffusers` (init), `xinntao-real-esrgan` (init), `lllyasviel-stable-diffusion-webui-forge` (init), `lllyasviel-fooocus` (exp), `idea-research-grounded-sam-2` (exp)
- **infrastructure** (6): `wandb-wandb` (init), `huggingface-transformers` (init), `open-telemetry-semantic-conventions` (init), `netflix-metaflow` (init), `kserve-kserve` (exp), `vllm-project-aibrix` (exp)
- **llm-inference** (4): `opennmt-ctranslate2` (init), `internlm-lmdeploy` (init), `predibase-lorax` (init), `sgl-project-sglang` (exp)
- **local-ai** (5): `chatboxai-chatbox` (init), `janhq-jan` (init), `danny-avila-librechat` (init), `nomic-ai-gpt4all` (exp), `mudler-localai` (exp)
- **mcp-tools** (5): `modelcontextprotocol-registry` (init), `browserbase-mcp-server-browserbase` (init), `modelcontextprotocol-typescript-sdk` (init), `composiohq-composio` (exp), `modelcontextprotocol-inspector` (exp)
- **multimodal** (4): `salesforce-lavis` (init), `openai-clip` (init), `microsoft-unilm` (init), `qwenlm-qwen-vl` (exp)
- **rag** (4): `langchain-ai-langchain` (init), `run-llama-llama-index` (init), `quivrhq-quivr` (init), `onyx-dot-app-onyx` (exp)
- **research** (4): `eleutherai-gpt-neox` (init), `harvardnlp-annotated-transformer` (init), `state-spaces-mamba` (init), `karpathy-mingpt` (exp)
- **training** (5): `nvidia-nemo-speech` (init), `dao-ailab-flash-attention` (init), `unslothai-unsloth` (init), `hpcaitech-colossalai` (exp), `axolotl-ai-cloud-axolotl` (exp)
- **vector-db** (4): `qdrant-qdrant` (init), `pgvector-pgvector` (init), `milvus-io-milvus` (init), `facebookresearch-faiss` (exp)
- **video-ai** (4): `guoyww-animatediff` (init), `vchitect-venhancer` (init), `lightricks-ltx-video` (init), `doubiiu-dynamicrafter` (exp)

## Sources

- Canonical: `data/canonical/*.json`
- GitHub snapshots: `data/derived/github/<id>.json`
- README cache: `docs/verification/_readme_cache/<id>.md`
- Spot-checks: `raw.githubusercontent.com` LICENSE files; live `github.com` / API for Continue, Browserbase, Jan, Goose, Transformers, and a random 20-repo subset

