# Completeness Intake Report

**Date:** 2026-08-12  
**Prior catalog:** 233  
**Final catalog:** 256 (+23)  
**Source lists:** [`MISSING_IMPORTANT_REPOS.md`](./MISSING_IMPORTANT_REPOS.md), [`_agent7_independent_candidates.md`](./_agent7_independent_candidates.md)

Policy: quality over count. Do not bulk-import the 120-candidate benchmark.

---

## Critical omissions

| owner/repo | Decision | Category | Reason |
|------------|----------|----------|--------|
| `BerriAI/litellm` | **ADD** | infrastructure | De-facto LLM gateway; MIT core (enterprise/ separate); active; excellent docs |
| `modelcontextprotocol/modelcontextprotocol` | **ADD** | mcp-tools | Official MCP spec home; fills protocol gap beside SDKs/servers |
| `huggingface/huggingface_hub` | **ADD** | infrastructure | Foundational Hub client/CLI; Apache-2.0; active |

**Critical rejected:** none.

---

## Strong candidates

| owner/repo | Decision | Category | Reason |
|------------|----------|----------|--------|
| `microsoft/agent-framework` | **ADD** | ai-agents | MS unified AutoGen/SK successor; distinct product |
| `browser-use/browser-use` | **ADD** | ai-agents | Category-defining browser agent library |
| `stanfordnlp/dspy` | **ADD** | rag | LM programming/optimizers; unique vs LangChain/LlamaIndex |
| `infiniflow/ragflow` | **ADD** | rag | Deployable RAG engine/UI; distinct from library stacks |
| `microsoft/graphrag` | **ADD** | rag | Canonical graph-RAG approach |
| `microsoft/onnxruntime` | **ADD** | infrastructure | Foundational ONNX runtime gap |
| `ggml-org/ggml` | **ADD** | infrastructure | Tensor substrate behind llama.cpp/whisper.cpp |
| `ml-explore/mlx-lm` | **ADD** | local-ai | Complements existing `mlx` array framework |
| `huggingface/tokenizers` | **ADD** | infrastructure | Core HF tokenizer runtime |
| `openai/tiktoken` | **ADD** | infrastructure | OpenAI BPE/count standard |
| `567-labs/instructor` | **ADD** | infrastructure | Structured outputs (canonical after instructor-ai redirect) |
| `dottxt-ai/outlines` | **ADD** | infrastructure | Constrained decoding |
| `NVIDIA/TransformerEngine` | **ADD** | training | FP8/FP4 Transformer kernels |
| `flashinfer-ai/flashinfer` | **ADD** | llm-inference | Serving-oriented attention kernels |
| `vercel/ai` | **ADD** | infrastructure | Dominant TypeScript AI SDK |
| `modelcontextprotocol/go-sdk` | **ADD** | mcp-tools | Official Go SDK parity |
| `mosaicml/llm-foundry` | **ADD** | training | Composer/YAML prod LLM stack (slow but significant) |
| `SWE-bench/SWE-bench` | **ADD** | evaluation | Canonical coding-agent benchmark |
| `deepseek-ai/DeepSeek-V3` | **ADD** | research | Flagship open MoE research/release artifact |
| `Wan-Video/Wan2.2` | **ADD** | video-ai | Material upgrade over Wan2.1 lineage |
| `AutoGPTQ/AutoGPTQ` | **REJECT** | — | Archived; successor is ModelCloud/GPTQModel |
| `NVIDIA/NeMo` (umbrella) | **REJECT** | — | Redirects to Speech; already catalogued |
| `meta-llama/llama` | **REJECT** | — | Deprecated pointer repo; not a living tool |
| `Lightning-AI/pytorch-lightning` | **DEFER** | — | Excellent but general ML; LitGPT/Accelerate cover LLM UX |
| `karpathy/llm.c` | **DEFER** | — | Edu artifact; nanoGPT/minGPT already cover |

---

## Optional / niche

| owner/repo | Decision | Reason |
|------------|----------|--------|
| `punkpeye/awesome-mcp-servers` | **REJECT** | Meta list; Registry/servers already present |
| `Open-Orca/OpenOrca` | **REJECT** | No GitHub repo (HF dataset only) |
| `karpathy/llm.c` | **DEFER** | See strong table |

---

## New-addition verification

- Snapshots: 23/23 ingested  
- Schema: pass  
- Scores: recomputed for 256  
- Random audit: **15/23 (65%), error rate 0%** — [`_completeness_intake_audit.json`](./_completeness_intake_audit.json)

---

## Category coverage confidence (post-intake)

| Category | Count | Newly added | Remaining known strong omissions | Confidence |
|----------|------:|------------:|----------------------------------|------------|
| infrastructure | 28 | 9 | few niche kernels/wrappers | **Strong** |
| training | 19 | 2 | NeMo Automodel/RL subrepos; GPTQModel | **Good** |
| coding-agents | 18 | 0 | optional Tabby-class | **Strong** |
| image-ai | 18 | 0 | — | **Strong** |
| local-ai | 18 | 1 | optional Jan/llamafile | **Strong** |
| ai-agents | 17 | 2 | ADK-class niche | **Good** |
| mcp-tools | 17 | 2 | — | **Strong** |
| audio-ai | 16 | 0 | — | **Strong** |
| evaluation | 16 | 1 | — | **Good** |
| video-ai | 16 | 1 | — | **Good** |
| multimodal | 15 | 0 | — | **Good** |
| datasets | 14 | 0 | influential HF-only corpora | **Moderate** |
| llm-inference | 13 | 1 | Dynamo already present; niche engines | **Good** |
| rag | 12 | 3 | — | **Good** |
| research | 10 | 1 | llama-models/cookbook later | **Moderate** |
| vector-db | 9 | 0 | — | **Good** |

Weakest residual areas: **datasets** (HF-only corpora), **research** (Meta living repos), optional depth in local-ai niche apps.

---

*Completeness intake closed for Dataset v1.*
