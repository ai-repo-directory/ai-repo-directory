# Missing Important Repositories

**Date:** 2026-08-12  
**Method:** Agent Group 7 independently researched ~120 high-signal AI repos **without** reading this project's dataset. Only afterward was the candidate list compared to `data/canonical` (with rename/transfer equivalence mapping).  
**Machine companion:** [`_agent7_comparison.json`](./_agent7_comparison.json), [`_agent7_independent_candidates.md`](./_agent7_independent_candidates.md)

**Policy:** Do **not** auto-add these. Promote only after GitHub + README + license + category verification.

> **Update 2026-08-12:** Completeness intake closed for Dataset v1.  
> Critical 3/3 added; 20 strong ADDs; rejects/defers preserved in [`CANDIDATE_BACKLOG.md`](./CANDIDATE_BACKLOG.md).  
> Full decisions: [`COMPLETENESS_INTAKE.md`](./COMPLETENESS_INTAKE.md). Catalog size **256**.

## Coverage vs independent benchmark

| Metric | Count |
|--------|------:|
| Independent candidates | 120 |
| Already in dataset (exact or equivalent) | 92 |
| Still missing | 28 |
| Critical omissions among missing | 3 |
| Strong candidates among missing | 22 |
| Optional/niche among missing | 3 |

Independent-list category coverage (present / missing after matching):

| Area | Present | Missing |
|------|--------:|--------:|
| inference / serving | 7 | 1 |
| local AI | 8 | 2 |
| coding agents | 9 | 0 |
| general agents | 7 | 2 |
| RAG | 3 | 3 |
| vector/search | 7 | 0 |
| image | 5 | 0 |
| video | 3 | 0 |
| audio / speech | 6 | 0 |
| multimodal | 5 | 0 |
| training / fine-tuning | 11 | 1 |
| evaluation | 4 | 1 |
| observability | 4 | 1 |
| MCP | 3 | 3 |
| datasets | 2 | 1 |
| AI infrastructure | 4 | 1 |
| model tooling | 2 | 9 |
| research implementations | 2 | 3 |

**Weakest coverage:** model tooling (tokenizers, structured output, quantization helpers, JS AI SDK).

## Partial / version notes (not full omissions)

| Independent candidate | Our entry | Note |
|-----------------------|-----------|------|
| `Wan-Video/Wan2.2` | `wan-video-wan2-1` | Have Wan2.1 lineage; consider Wan2.2 as version upgrade candidate |
| `NVIDIA/NeMo` | `nvidia-nemo-speech` | Have NeMo speech subtree; full NeMo umbrella still a gap |
| `microsoft/DeepSpeed` | `deepspeedai-deepspeed` | Covered via org transfer |
| `hiyouga/LLaMA-Factory` | `hiyouga-llamafactory` | Covered |
| `explodinggradients/ragas` | `vibrantlabsai-ragas` | Covered via rename |
| `block/goose` | `aaif-goose-goose` | Covered via AAIF transfer |

---

## Critical omission

| owner/repo | URL | Why it matters | Suggested category |
|------------|-----|----------------|--------------------|
| `BerriAI/litellm` | https://github.com/BerriAI/litellm | De-facto open LLM gateway / proxy used across agents, eval, and prod stacks | infrastructure / evaluation |
| `modelcontextprotocol/modelcontextprotocol` | https://github.com/modelcontextprotocol/modelcontextprotocol | Official MCP specification repository | mcp-tools |
| `huggingface/huggingface_hub` | https://github.com/huggingface/huggingface_hub | Foundational Hub client for models/datasets/spaces | infrastructure |

---

## Strong candidate

| owner/repo | URL | Why it matters | Suggested category |
|------------|-----|----------------|--------------------|
| `microsoft/onnxruntime` | https://github.com/microsoft/onnxruntime | Cross-platform ONNX runtime for production/edge inference | llm-inference / infrastructure |
| `ggml-org/ggml` | https://github.com/ggml-org/ggml | Tensor library behind llama.cpp / whisper.cpp | local-ai / infrastructure |
| `ml-explore/mlx-lm` | https://github.com/ml-explore/mlx-lm | Native Apple Silicon LLM inference/fine-tune on MLX | local-ai / llm-inference |
| `microsoft/agent-framework` | https://github.com/microsoft/agent-framework | Microsoft unified successor path for AutoGen + Semantic Kernel | ai-agents |
| `browser-use/browser-use` | https://github.com/browser-use/browser-use | Leading open browser-automation agent | ai-agents |
| `stanfordnlp/dspy` | https://github.com/stanfordnlp/dspy | Programming model for LM pipelines / optimizers | rag / infrastructure |
| `infiniflow/ragflow` | https://github.com/infiniflow/ragflow | Popular open RAG engine / document QA platform | rag |
| `microsoft/graphrag` | https://github.com/microsoft/graphrag | Graph-based RAG approach from Microsoft Research | rag |
| `mosaicml/llm-foundry` | https://github.com/mosaicml/llm-foundry | Production LLM training/finetuning stack | training |
| `princeton-nlp/SWE-bench` | https://github.com/princeton-nlp/SWE-bench | Canonical coding-agent benchmark | evaluation |
| `modelcontextprotocol/go-sdk` | https://github.com/modelcontextprotocol/go-sdk | Official Go MCP SDK | mcp-tools |
| `Lightning-AI/pytorch-lightning` | https://github.com/Lightning-AI/pytorch-lightning | Widely used training framework | training / infrastructure |
| `huggingface/tokenizers` | https://github.com/huggingface/tokenizers | Fast tokenizers library | infrastructure |
| `openai/tiktoken` | https://github.com/openai/tiktoken | BPE tokenizer used across OpenAI ecosystem | infrastructure |
| `instructor-ai/instructor` | https://github.com/instructor-ai/instructor | Structured LLM output helpers | infrastructure |
| `dottxt-ai/outlines` | https://github.com/dottxt-ai/outlines | Structured generation / constrained decoding | infrastructure |
| `AutoGPTQ/AutoGPTQ` | https://github.com/AutoGPTQ/AutoGPTQ | GPTQ quantization tooling | llm-inference / training |
| `NVIDIA/TransformerEngine` | https://github.com/NVIDIA/TransformerEngine | FP8 transformer kernels for training/inference | training / infrastructure |
| `flashinfer-ai/flashinfer` | https://github.com/flashinfer-ai/flashinfer | High-performance LLM attention kernels | llm-inference |
| `vercel/ai` | https://github.com/vercel/ai | Dominant TypeScript AI SDK for apps | infrastructure |
| `meta-llama/llama` | https://github.com/meta-llama/llama | Foundational Llama research/release repo | research |
| `deepseek-ai/DeepSeek-V3` | https://github.com/deepseek-ai/DeepSeek-V3 | Important open model release/research artifact | research |

Also consider promoting **full `NVIDIA/NeMo`** (beyond speech) and **Wan2.2** as version/coverage upgrades.

---

## Optional / niche

| owner/repo | URL | Why it matters | Suggested category |
|------------|-----|----------------|--------------------|
| `punkpeye/awesome-mcp-servers` | https://github.com/punkpeye/awesome-mcp-servers | Curated MCP server list (meta) | mcp-tools |
| `Open-Orca/OpenOrca` | https://github.com/Open-Orca/OpenOrca | Influential instruction dataset lineage | datasets |
| `karpathy/llm.c` | https://github.com/karpathy/llm.c | Educational pure-C LLM training/inference | research |

---

## Completeness benchmark (current catalog)

Canonical primary counts after category verification (233 total):

| Category | Included | Critical missing | Strong missing | Stale/archived notables in catalog |
|----------|--------:|-----------------:|---------------:|------------------------------------|
| llm-inference | 12 | 0 | onnxruntime, flashinfer, AutoGPTQ, mlx-lm | huggingface-text-generation-inference (archived) |
| ai-agents | 15 | 0 | agent-framework, browser-use | openai/swarm lineage notes; several moderate |
| coding-agents | 18 | 0 | 0 (SWE-bench is eval) | continue (stale/read-only), void, roo-code, cody snapshot, mentat, gpt-engineer archived |
| rag | 9 | 0 | dspy, ragflow, graphrag | quivr, ragatouille stale |
| vector-db | 9 | 0 | 0 | — |
| local-ai | 17 | 0 | ggml | gpt4all stale |
| image-ai | 18 | 0 | 0 | controlnet, several-anything, IP-Adapter stale |
| video-ai | 15 | Wan2.2 (version) | 0 | several GenBench moved to evaluation |
| audio-ai | 16 | 0 | 0 | demucs/piper/vall-e-x archived or stale; bark/coqui stale |
| multimodal | 15 | 0 | 0 | chameleon archived; several VL repos stale |
| training | 17 | 0 | llm-foundry, pytorch-lightning, TransformerEngine | torchtune unmaintained |
| evaluation | 15 | litellm (obs/gateway) | SWE-bench | — |
| mcp-tools | 15 | MCP spec repo | go-sdk | browserbase server archived |
| datasets | 14 | 0 | OpenOrca (optional) | The Pile stale; instructlab archived |
| infrastructure | 19 | huggingface_hub | tokenizers, tiktoken, instructor, outlines, vercel/ai | — |
| research | 9 | 0 | meta-llama/llama, DeepSeek-V3, llm.c | minGPT/tensor2tensor/etc. historical |

**Guideline:** Prefer ~300 excellent verified projects over inflating to thousands. Next intake should prioritize the 3 critical omissions + model-tooling strong candidates.
