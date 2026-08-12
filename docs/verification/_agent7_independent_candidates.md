# Agent Group 7 — Independent Important-Omission Candidates

**Role:** Important Omissions researcher (independent ecosystem scan)  
**As of:** August 2026  
**Method:** Web research only; did **not** inspect `data/canonical`, `data/raw`, `data/derived`, or any project repository lists.  
**Target:** ~80–120 high-signal repos a serious AI tools directory should include.

**Importance tiers**

| Tier | Meaning |
|------|---------|
| **Critical omission** | Foundational / category-defining; directory looks incomplete without it |
| **Strong candidate** | Widely used or technically important; high inclusion value |
| **Optional/niche** | Valuable for depth or specialization; not required for a core directory |

---

## Summary counts

| Importance | Count |
|------------|------:|
| Critical omission | 36 |
| Strong candidate | 75 |
| Optional/niche | 9 |
| **Total** | **120** |

---

## Candidates

### Inference / serving

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| vllm-project/vllm | https://github.com/vllm-project/vllm | Default high-throughput OpenAI-compatible LLM serving (PagedAttention, continuous batching). | inference / serving | Critical omission |
| sgl-project/sglang | https://github.com/sgl-project/sglang | Fast LLM/VLM serving with RadixAttention; strong for agents, structured output, and multimodal. | inference / serving | Critical omission |
| NVIDIA/TensorRT-LLM | https://github.com/NVIDIA/TensorRT-LLM | NVIDIA peak-throughput LLM/visual-gen inference stack for production GPU fleets. | inference / serving | Critical omission |
| triton-inference-server/server | https://github.com/triton-inference-server/server | Enterprise multi-model inference server; common front door for TensorRT-LLM and ensembles. | inference / serving | Strong candidate |
| ai-dynamo/dynamo | https://github.com/ai-dynamo/dynamo | Datacenter-scale distributed inference framework (disagg serving, KV-aware routing). | inference / serving | Strong candidate |
| InternLM/lmdeploy | https://github.com/InternLM/lmdeploy | High-performance serving/quantization stack widely used with Asian open models. | inference / serving | Strong candidate |
| microsoft/onnxruntime | https://github.com/microsoft/onnxruntime | Cross-platform ONNX runtime underpinning many production and edge inference paths. | inference / serving | Strong candidate |

### Local AI

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| ollama/ollama | https://github.com/ollama/ollama | De-facto “Docker for local LLMs”: simplest model pull/run/API for developers. | local AI | Critical omission |
| ggml-org/llama.cpp | https://github.com/ggml-org/llama.cpp | Foundational C/C++ GGUF inference engine powering most local LLM tooling. | local AI | Critical omission |
| ggml-org/ggml | https://github.com/ggml-org/ggml | Tensor library behind llama.cpp/whisper.cpp; core of portable local AI. | local AI | Strong candidate |
| open-webui/open-webui | https://github.com/open-webui/open-webui | Leading ChatGPT-like self-hosted UI for Ollama and OpenAI-compatible backends. | local AI | Critical omission |
| mudler/LocalAI | https://github.com/mudler/LocalAI | Drop-in OpenAI API replacement for fully local multimodal stacks. | local AI | Strong candidate |
| ml-explore/mlx | https://github.com/ml-explore/mlx | Apple’s array framework for fast ML on Apple Silicon. | local AI | Strong candidate |
| ml-explore/mlx-lm | https://github.com/ml-explore/mlx-lm | Native Apple Silicon LLM inference/fine-tuning on MLX. | local AI | Strong candidate |
| mlc-ai/mlc-llm | https://github.com/mlc-ai/mlc-llm | Universal compiler-backed local LLM runtime (mobile, browser, desktop). | local AI | Strong candidate |

### Coding agents

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| OpenHands/OpenHands | https://github.com/OpenHands/OpenHands | Leading open autonomous coding agent / agent canvas (ex-OpenDevin); SWE-bench leader. | coding agents | Critical omission |
| Aider-AI/aider | https://github.com/Aider-AI/aider | Canonical Git-native terminal pair-programmer; auto-commits every edit. | coding agents | Critical omission |
| cline/cline | https://github.com/cline/cline | Dominant VS Code / JetBrains / CLI agentic coding extension (BYOK). | coding agents | Critical omission |
| continuedev/continue | https://github.com/continuedev/continue | Open IDE assistant across VS Code + JetBrains with agent/chat/edit/autocomplete. | coding agents | Strong candidate |
| anomalyco/opencode | https://github.com/anomalyco/opencode | Massively adopted provider-agnostic terminal coding agent (Claude Code alternative). | coding agents | Critical omission |
| openai/codex | https://github.com/openai/codex | Official OpenAI open-source Codex CLI with sandboxing. | coding agents | Strong candidate |
| block/goose | https://github.com/block/goose | Local-first, MCP-driven general/coding agent (Linux Foundation AAIF). | coding agents | Strong candidate |
| SWE-agent/SWE-agent | https://github.com/SWE-agent/SWE-agent | Research-origin agent framework that defined modern SWE-bench agent loops. | coding agents | Strong candidate |

### General agents

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| langchain-ai/langgraph | https://github.com/langchain-ai/langgraph | Production standard for stateful, durable, graph-based agent orchestration. | general agents | Critical omission |
| langchain-ai/langchain | https://github.com/langchain-ai/langchain | Largest LLM app framework ecosystem; integrations backbone for agents/RAG. | general agents | Critical omission |
| crewAIInc/crewAI | https://github.com/crewAIInc/crewAI | Most popular role-based multi-agent framework for fast crew-style workflows. | general agents | Strong candidate |
| openai/openai-agents-python | https://github.com/openai/openai-agents-python | Official OpenAI Agents SDK for tool-using multi-agent apps. | general agents | Strong candidate |
| microsoft/agent-framework | https://github.com/microsoft/agent-framework | Microsoft’s unified successor to AutoGen + Semantic Kernel for enterprise agents. | general agents | Strong candidate |
| pydantic/pydantic-ai | https://github.com/pydantic/pydantic-ai | Type-safe Python agent framework with strong schema/validation ergonomics. | general agents | Strong candidate |
| agno-agi/agno | https://github.com/agno-agi/agno | Fast multi-agent framework focused on self-hosted runtimes. | general agents | Strong candidate |
| browser-use/browser-use | https://github.com/browser-use/browser-use | Leading open browser-automation agent for web task completion. | general agents | Strong candidate |

### RAG

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| run-llama/llama_index | https://github.com/run-llama/llama_index | Purpose-built data/RAG framework (indexing, retrieval, workflows). | RAG | Critical omission |
| stanfordnlp/dspy | https://github.com/stanfordnlp/dspy | Programmatic prompt/pipeline optimization; foundational for systematic RAG/agent tuning. | RAG | Strong candidate |
| infiniflow/ragflow | https://github.com/infiniflow/ragflow | End-to-end open RAG engine with deep document understanding and UI. | RAG | Strong candidate |
| microsoft/graphrag | https://github.com/microsoft/graphrag | Influential graph-based RAG approach from Microsoft Research. | RAG | Strong candidate |
| deepset-ai/haystack | https://github.com/deepset-ai/haystack | Mature production NLP/RAG pipeline framework. | RAG | Strong candidate |
| explodinggradients/ragas | https://github.com/explodinggradients/ragas | Standard open toolkit for evaluating RAG quality. | RAG | Strong candidate |

### Vector / search

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| facebookresearch/faiss | https://github.com/facebookresearch/faiss | Foundational similarity-search library used under countless vector systems. | vector/search | Critical omission |
| qdrant/qdrant | https://github.com/qdrant/qdrant | Top self-hosted production vector DB (Rust, filtering, low latency). | vector/search | Critical omission |
| milvus-io/milvus | https://github.com/milvus-io/milvus | Cloud-native vector database for billion-scale deployments. | vector/search | Strong candidate |
| weaviate/weaviate | https://github.com/weaviate/weaviate | Hybrid (vector + BM25) search DB with modular vectorizers. | vector/search | Strong candidate |
| chroma-core/chroma | https://github.com/chroma-core/chroma | Default embeddable vector store for local/prototype RAG. | vector/search | Strong candidate |
| pgvector/pgvector | https://github.com/pgvector/pgvector | Postgres extension bringing vectors into mainstream SQL stacks. | vector/search | Strong candidate |
| lancedb/lancedb | https://github.com/lancedb/lancedb | Developer-friendly embedded/cloud vector DB on Lance columnar format. | vector/search | Strong candidate |

### Image

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| Comfy-Org/ComfyUI | https://github.com/Comfy-Org/ComfyUI | De-facto node graph for open image/video/audio generation workflows. | image | Critical omission |
| huggingface/diffusers | https://github.com/huggingface/diffusers | Standard library for diffusion pipelines (SD, Flux, video, audio). | image | Critical omission |
| black-forest-labs/flux | https://github.com/black-forest-labs/flux | Official inference code for FLUX open image models (current SOTA open T2I line). | image | Strong candidate |
| AUTOMATIC1111/stable-diffusion-webui | https://github.com/AUTOMATIC1111/stable-diffusion-webui | Historic mass-market Stable Diffusion WebUI; still widely used. | image | Strong candidate |
| Stability-AI/generative-models | https://github.com/Stability-AI/generative-models | Official Stability generative model training/inference code (SD3 family lineage). | image | Strong candidate |

### Video

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| Wan-Video/Wan2.2 | https://github.com/Wan-Video/Wan2.2 | Leading Apache-licensed open video foundation models (MoE generation stack). | video | Critical omission |
| Lightricks/LTX-Video | https://github.com/Lightricks/LTX-Video | Fast open DiT video (and AV) generation; deep ComfyUI ecosystem integration. | video | Strong candidate |
| Tencent-Hunyuan/HunyuanVideo | https://github.com/Tencent-Hunyuan/HunyuanVideo | Major open Hunyuan video generation release from Tencent. | video | Strong candidate |

### Audio / speech

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| openai/whisper | https://github.com/openai/whisper | Foundational open multilingual ASR model (ecosystem root). | audio / speech | Critical omission |
| SYSTRAN/faster-whisper | https://github.com/SYSTRAN/faster-whisper | Production default Whisper reimplementation (CTranslate2; much faster). | audio / speech | Critical omission |
| ggml-org/whisper.cpp | https://github.com/ggml-org/whisper.cpp | Portable C/C++ Whisper for on-device / Apple Silicon / embedded ASR. | audio / speech | Critical omission |
| m-bain/whisperX | https://github.com/m-bain/whisperX | Whisper + forced alignment + diarization for subtitle-grade transcripts. | audio / speech | Strong candidate |
| coqui-ai/TTS | https://github.com/coqui-ai/TTS | Major open text-to-speech toolkit (multi-speaker, cloning, training). | audio / speech | Strong candidate |

### Multimodal

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| haotian-liu/LLaVA | https://github.com/haotian-liu/LLaVA | Seminal open vision-language assistant architecture and training recipe. | multimodal | Strong candidate |
| OpenGVLab/InternVL | https://github.com/OpenGVLab/InternVL | Leading open multimodal / vision-language model family and tooling. | multimodal | Strong candidate |
| facebookresearch/sam2 | https://github.com/facebookresearch/sam2 | Segment Anything 2 — foundational video/image segmentation foundation model. | multimodal | Strong candidate |
| facebookresearch/segment-anything | https://github.com/facebookresearch/segment-anything | Original SAM; still a core vision primitive for multimodal apps. | multimodal | Strong candidate |
| QwenLM/Qwen3-VL | https://github.com/QwenLM/Qwen3-VL | Strong open Qwen vision-language model release line (widely deployed). | multimodal | Strong candidate |

### Training / fine-tuning

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| huggingface/transformers | https://github.com/huggingface/transformers | Universal model hub library for training and inference across modalities. | training / fine-tuning | Critical omission |
| huggingface/trl | https://github.com/huggingface/trl | Canonical RLHF/DPO/GRPO trainer APIs others wrap. | training / fine-tuning | Critical omission |
| huggingface/peft | https://github.com/huggingface/peft | Standard parameter-efficient fine-tuning (LoRA/QLoRA/adapters). | training / fine-tuning | Critical omission |
| huggingface/accelerate | https://github.com/huggingface/accelerate | Distributed training launcher abstraction used across the HF stack. | training / fine-tuning | Critical omission |
| microsoft/DeepSpeed | https://github.com/microsoft/DeepSpeed | ZeRO / large-scale training & inference optimization engine. | training / fine-tuning | Critical omission |
| axolotl-ai-cloud/axolotl | https://github.com/axolotl-ai-cloud/axolotl | YAML-driven post-training framework (LoRA→RL) with strong multi-GPU matrix. | training / fine-tuning | Strong candidate |
| unslothai/unsloth | https://github.com/unslothai/unsloth | Fastest popular single-GPU LoRA/QLoRA path (kernel-optimized). | training / fine-tuning | Strong candidate |
| hiyouga/LLaMA-Factory | https://github.com/hiyouga/LLaMA-Factory | No/low-code fine-tuning UI covering 100+ models and many recipes. | training / fine-tuning | Strong candidate |
| NVIDIA/Megatron-LM | https://github.com/NVIDIA/Megatron-LM | Industry-standard large-model parallel training framework. | training / fine-tuning | Strong candidate |
| meta-pytorch/torchtune | https://github.com/meta-pytorch/torchtune | Official PyTorch-native LLM fine-tuning library. | training / fine-tuning | Strong candidate |
| NVIDIA/NeMo | https://github.com/NVIDIA/NeMo | NVIDIA end-to-end framework for speech/LLM training and alignment. | training / fine-tuning | Strong candidate |
| mosaicml/llm-foundry | https://github.com/mosaicml/llm-foundry | Composer/LLM Foundry training stack used for efficient large-scale LLM training. | training / fine-tuning | Strong candidate |

### Evaluation

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| EleutherAI/lm-evaluation-harness | https://github.com/EleutherAI/lm-evaluation-harness | Standard open LLM academic eval harness (Open LLM Leaderboard backend). | evaluation | Critical omission |
| princeton-nlp/SWE-bench | https://github.com/princeton-nlp/SWE-bench | Defining benchmark for real GitHub issue-solving coding agents. | evaluation | Strong candidate |
| promptfoo/promptfoo | https://github.com/promptfoo/promptfoo | Developer-centric LLM eval/red-team CLI used in CI. | evaluation | Strong candidate |
| confident-ai/deepeval | https://github.com/confident-ai/deepeval | Popular unit-test style LLM evaluation framework. | evaluation | Strong candidate |
| stanford-crfm/helm | https://github.com/stanford-crfm/helm | Holistic Evaluation of Language Models (CRFM). | evaluation | Strong candidate |

### Observability

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| langfuse/langfuse | https://github.com/langfuse/langfuse | Leading open-source LLM observability (traces, prompts, evals; self-hostable). | observability | Critical omission |
| Arize-ai/phoenix | https://github.com/Arize-ai/phoenix | OTel-native open tracing + evals for LLM/RAG apps. | observability | Strong candidate |
| BerriAI/litellm | https://github.com/BerriAI/litellm | Universal LLM proxy/gateway (100+ providers) with spend/logging hooks. | observability | Critical omission |
| Helicone/helicone | https://github.com/Helicone/helicone | Gateway-style LLM logging/caching/cost observability (historically major). | observability | Strong candidate |
| traceloop/openllmetry | https://github.com/traceloop/openllmetry | OpenTelemetry instrumentation standards/SDKs for LLM apps. | observability | Strong candidate |

### MCP (Model Context Protocol)

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| modelcontextprotocol/modelcontextprotocol | https://github.com/modelcontextprotocol/modelcontextprotocol | MCP specification / protocol home — the standard for tool/context wiring. | MCP | Critical omission |
| modelcontextprotocol/servers | https://github.com/modelcontextprotocol/servers | Official reference MCP servers and ecosystem pointers. | MCP | Critical omission |
| modelcontextprotocol/python-sdk | https://github.com/modelcontextprotocol/python-sdk | Official Python MCP SDK (servers + clients). | MCP | Critical omission |
| modelcontextprotocol/typescript-sdk | https://github.com/modelcontextprotocol/typescript-sdk | Official TypeScript MCP SDK (Node/Bun/Deno). | MCP | Strong candidate |
| modelcontextprotocol/go-sdk | https://github.com/modelcontextprotocol/go-sdk | Official Go MCP SDK (with Google collaboration). | MCP | Strong candidate |

### Datasets

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| huggingface/datasets | https://github.com/huggingface/datasets | Standard dataset loading/processing library for ML/LLM work. | datasets | Critical omission |
| allenai/dolma | https://github.com/allenai/dolma | Major open pretraining corpus from Ai2 (transparent data pipeline). | datasets | Strong candidate |

### AI infrastructure

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| ray-project/ray | https://github.com/ray-project/ray | Distributed compute backbone for training, serving, and agent workloads. | AI infrastructure | Critical omission |
| skypilot-org/skypilot | https://github.com/skypilot-org/skypilot | Multi-cloud GPU job launcher widely used for LLM experiments/training. | AI infrastructure | Strong candidate |
| kserve/kserve | https://github.com/kserve/kserve | Kubernetes-native model serving standard for cloud ML platforms. | AI infrastructure | Strong candidate |
| kubeflow/kubeflow | https://github.com/kubeflow/kubeflow | End-to-end ML platform on Kubernetes (pipelines, training, serving). | AI infrastructure | Strong candidate |
| Lightning-AI/pytorch-lightning | https://github.com/Lightning-AI/pytorch-lightning | High-level PyTorch training framework used across research and production. | AI infrastructure | Strong candidate |

### Model tooling

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| huggingface/huggingface_hub | https://github.com/huggingface/huggingface_hub | Client for the Hub — download/upload/version models and datasets. | model tooling | Critical omission |
| huggingface/tokenizers | https://github.com/huggingface/tokenizers | Fast production tokenizers used across HF models. | model tooling | Strong candidate |
| Dao-AILab/flash-attention | https://github.com/Dao-AILab/flash-attention | FlashAttention kernels — foundational speed/memory win for Transformers. | model tooling | Critical omission |
| bitsandbytes-foundation/bitsandbytes | https://github.com/bitsandbytes-foundation/bitsandbytes | 8-bit/4-bit optimizers & quantization enabling consumer-GPU fine-tuning. | model tooling | Strong candidate |
| openai/tiktoken | https://github.com/openai/tiktoken | Fast BPE tokenizer used as the practical token-counting standard. | model tooling | Strong candidate |
| instructor-ai/instructor | https://github.com/instructor-ai/instructor | Structured output extraction via Pydantic for many LLM providers. | model tooling | Strong candidate |
| dottxt-ai/outlines | https://github.com/dottxt-ai/outlines | Constrained/structured generation library (JSON/grammar guidance). | model tooling | Strong candidate |
| AutoGPTQ/AutoGPTQ | https://github.com/AutoGPTQ/AutoGPTQ | Widely used GPTQ quantization tooling for local/prod weight compression. | model tooling | Strong candidate |
| NVIDIA/TransformerEngine | https://github.com/NVIDIA/TransformerEngine | FP8 Transformer building blocks for Hopper/Blackwell training & inference. | model tooling | Strong candidate |
| flashinfer-ai/flashinfer | https://github.com/flashinfer-ai/flashinfer | High-performance attention/KV kernels used by modern serving engines. | model tooling | Strong candidate |
| vercel/ai | https://github.com/vercel/ai | Dominant TypeScript AI SDK for app developers (Vercel AI SDK). | model tooling | Strong candidate |


### Additional optional / niche depth

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| mozilla-ai/llamafile | https://github.com/mozilla-ai/llamafile | Single-file portable LLM executables combining llama.cpp + Cosmopolitan libc. | local AI | Optional/niche |
| janhq/jan | https://github.com/janhq/jan | Offline-first desktop local AI app with growing MCP support. | local AI | Optional/niche |
| tabbyml/tabby | https://github.com/tabbyml/tabby | Self-hosted open coding assistant / autocomplete server. | coding agents | Optional/niche |
| google/adk-python | https://github.com/google/adk-python | Google Agent Development Kit for building agents on GCP-oriented stacks. | general agents | Optional/niche |
| rhasspy/piper | https://github.com/rhasspy/piper | Fast local neural TTS popular for edge and home-assistant use. | audio / speech | Optional/niche |
| punkpeye/awesome-mcp-servers | https://github.com/punkpeye/awesome-mcp-servers | Widely used curated index of community MCP servers. | MCP | Optional/niche |
| Open-Orca/OpenOrca | https://github.com/Open-Orca/OpenOrca | Influential open instruction-tuning dataset family. | datasets | Optional/niche |
| karpathy/llm.c | https://github.com/karpathy/llm.c | Pure-C LLM training/inference — influential systems-education artifact. | research implementations | Optional/niche |
| huggingface/text-generation-inference | https://github.com/huggingface/text-generation-inference | Historically important HF production LLM server (now maintenance-mode). | inference / serving | Optional/niche |

### Research implementations

| owner/repo | URL | Why it matters | Category | Importance |
|------------|-----|----------------|----------|------------|
| karpathy/nanoGPT | https://github.com/karpathy/nanoGPT | Minimal, educational GPT training codebase; research/onboarding staple. | research implementations | Strong candidate |
| EleutherAI/gpt-neox | https://github.com/EleutherAI/gpt-neox | Large-scale open training codebase that powered early open LLMs. | research implementations | Strong candidate |
| meta-llama/llama | https://github.com/meta-llama/llama | Official Llama model cards/code lineage anchoring the open-weights era. | research implementations | Strong candidate |
| deepseek-ai/DeepSeek-V3 | https://github.com/deepseek-ai/DeepSeek-V3 | Open MoE model release with major research + systems impact. | research implementations | Strong candidate |

---

## Notes for directory maintainers

1. **Canonical vs. forks:** Prefer primary orgs above (e.g. `OpenHands/OpenHands`, `Comfy-Org/ComfyUI`, `ggml-org/llama.cpp`) over historical mirrors when merging against an existing catalog.
2. **Maintenance-aware:** Include historically important repos even if slowed (TGI, Aider, Helicone) at Strong/Optional — they still matter for completeness and redirects.
3. **Not exhaustive:** Intentionally omitted endless model-weight-only repos, one-off paper code, and low-signal wrappers; prioritize tools people install and operate.
4. **Category overlaps:** Several projects span buckets (e.g. LiteLLM = tooling + observability; LangChain = agents + RAG). Primary bucket is assigned by dominant use.
5. **Independence:** This list was built from ecosystem surveys and public sources as of Aug 2026, without reading the project’s existing dataset files.

---

*Generated by Agent Group 7 — Important Omissions researcher.*
