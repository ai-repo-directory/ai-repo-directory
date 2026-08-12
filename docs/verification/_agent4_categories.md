# Agent 4 — Category Verification

**Verified:** 2026-08-12  
**Repos reviewed:** 233  
**Corrections applied:** 19 (11 primary/file moves, 8 secondary-only)  
**Borderline left unchanged:** 12

## Rules applied

- Avoid category inflation
- Using an LLM internally ≠ ai-agents
- coding-agents = software engineering/coding agents; general multi-agent frameworks = ai-agents
- vector DBs stay in vector-db (not rag)
- MCP servers/SDKs in mcp-tools
- local-ai = local/offline UIs and runtimes (Ollama, Open WebUI, llama.cpp)—not everything self-hostable
- research = research/paper implementations—not every ML library
- secondaryCategories must not repeat primaryCategory
- canonical filename must match primaryCategory

## Counts by primary category (after)

| Category | Count |
|----------|------:|
| `ai-agents` | 15 |
| `audio-ai` | 16 |
| `coding-agents` | 18 |
| `datasets` | 14 |
| `evaluation` | 15 |
| `image-ai` | 18 |
| `infrastructure` | 19 |
| `llm-inference` | 12 |
| `local-ai` | 17 |
| `mcp-tools` | 15 |
| `multimodal` | 15 |
| `rag` | 9 |
| `research` | 9 |
| `training` | 17 |
| `vector-db` | 9 |
| `video-ai` | 15 |
| **Total** | **233** |

## Corrections applied

### Primary category / file moves

| id | from → to | secondary change | reason |
|----|-----------|------------------|--------|
| `ggml-org-llama.cpp` | `llm-inference` → `local-ai` | `['local-ai']` → `['llm-inference']` | Rule explicitly lists llama.cpp as a local/offline runtime; inference engine role stays secondary. |
| `huggingface-transformers` | `research` → `infrastructure` | `['training', 'llm-inference', 'multimodal']` → `['training', 'llm-inference', 'multimodal']` | Shared model zoo/library, not paper-code research; research category is for research implementations. |
| `google-flax` | `research` → `infrastructure` | `['training']` → `['training', 'research']` | General JAX neural-net library (ML framework), not a paper implementation; closer to infrastructure than research. |
| `lastmile-ai-mcp-agent` | `mcp-tools` → `ai-agents` | `['ai-agents']` → `['mcp-tools']` | Agent/workflow orchestration framework that uses MCP; not an MCP server/SDK (mcp-tools). |
| `itzcrazykns-vane` | `local-ai` → `rag` | `['rag']` → `['local-ai']` | Self-hosted AI search/answering product is a RAG app; local-ai is for local UIs/runtimes, not every self-hosted AI app. |
| `wandb-wandb` | `evaluation` → `infrastructure` | `['training', 'infrastructure']` → `['evaluation', 'training']` | Core product is MLOps/experiment tracking (peer to MLflow); evaluation notes already marked partial fit. |
| `open-telemetry-semantic-conventions` | `evaluation` → `infrastructure` | `['infrastructure']` → `['evaluation']` | Telemetry naming standards for GenAI spans/attributes—observability infrastructure, not an evaluation framework. |
| `ai-hypercomputer-maxtext` | `research` → `training` | `['training', 'infrastructure']` → `['research', 'infrastructure']` | High-performance LLM pretraining codebase/recipes; training is the primary job, research is secondary context. |
| `lightning-ai-litgpt` | `research` → `training` | `['training']` → `['research']` | From-scratch LLM implementations with pretrain/finetune/deploy recipes—practitioner training toolkit more than paper artifact. |
| `idea-research-grounded-sam-2` | `multimodal` → `image-ai` | `['image-ai', 'video-ai']` → `['video-ai', 'multimodal']` | Grounding DINO + Florence-2 + SAM 2 segmentation/tracking pipeline; vision editing stack, not a VLM multimodal model. |
| `facebookresearch-moviegenbench` | `video-ai` → `evaluation` | `['evaluation', 'research']` → `['video-ai', 'research']` | Official notes: benchmarks only (no Movie Gen model weights); evaluation is the primary artifact. |

### Secondary-only cleanups (inflation)

| id | primary (unchanged) | secondary change | reason |
|----|---------------------|------------------|--------|
| `langgenius-dify` | `ai-agents` | `['rag', 'local-ai', 'infrastructure']` → `['rag', 'infrastructure']` | Remove local-ai: self-hostable platform ≠ local/offline UI/runtime category. |
| `instructlab-instructlab` | `datasets` | `['training', 'local-ai']` → `['training']` | Remove local-ai: taxonomy/synthetic-data CLI is not a local AI UI/runtime. |
| `axolotl-ai-cloud-axolotl` | `training` | `['local-ai']` → `[]` | Remove local-ai: fine-tuning framework running on GPUs is not a local AI UI/runtime. |
| `bitsandbytes-foundation-bitsandbytes` | `training` | `['llm-inference', 'local-ai']` → `['llm-inference']` | Remove local-ai: quantization library dependency, not a local AI UI/runtime. |
| `hiyouga-llamafactory` | `training` | `['multimodal', 'local-ai']` → `['multimodal']` | Remove local-ai: training toolkit with optional WebUI ≠ local-ai runtimes like Ollama/Open WebUI. |
| `open-webui-open-webui` | `local-ai` | `['rag', 'ai-agents']` → `['rag']` | Remove ai-agents: ChatGPT-style local UI with tools/MCP is not an agent framework (avoid LLM→agent inflation). |
| `openai-whisper` | `audio-ai` | `['local-ai', 'multimodal']` → `['local-ai']` | Remove multimodal: Whisper is speech recognition (audio-ai); multimodal reserved for cross-modal VLMs/etc. |
| `facebookresearch-audiocraft` | `audio-ai` | `['research', 'multimodal']` → `['research']` | Remove multimodal: MusicGen/EnCodec are audio generation; multimodal secondary was category inflation. |

## Borderline cases left unchanged

### `langchain-ai-langchain` (LangChain)
- **Kept:** primary `rag`, secondary `['ai-agents']`
- **Why:** Equally an agent framework, but RAG primitives remain a defining use-case and LangGraph already covers orchestration under ai-agents; left as RAG peer to LlamaIndex/Haystack.

### `huggingface-smolagents` (smolagents)
- **Kept:** primary `ai-agents`, secondary `['research']`
- **Why:** Code-acting agents write/run code as an action space, but the library is a general agent framework—not a software-engineering coding agent product. Kept in ai-agents.

### `openinterpreter-openinterpreter` (Open Interpreter)
- **Kept:** primary `coding-agents`, secondary `['local-ai', 'ai-agents']`
- **Why:** General local code-execution agent vs SE-specific coding agent; retained in coding-agents given code-centric product positioning and local open-model focus.

### `meilisearch-meilisearch` (Meilisearch)
- **Kept:** primary `vector-db`, secondary `['rag', 'infrastructure']`
- **Why:** Primarily a full-text/hybrid search engine that added vectors; kept in vector-db because hybrid retrieval is how it enters AI stacks, with infrastructure already secondary.

### `helicone-helicone` (helicone)
- **Kept:** primary `evaluation`, secondary `['infrastructure']`
- **Why:** Gateway/observability platform; evaluation category in this directory intentionally holds LLMOps eval+tracing tools (alongside Langfuse/Phoenix). Not moved with wandb.

### `langfuse-langfuse` (langfuse)
- **Kept:** primary `evaluation`, secondary `['infrastructure']`
- **Why:** Tracing + evals + prompt management; same editorial bucket as other LLM observability/eval suites. Borderline with infrastructure but left with peers.

### `ml-explore-mlx` (MLX)
- **Kept:** primary `llm-inference`, secondary `['local-ai', 'research']`
- **Why:** General Apple Silicon array framework, but directory framing is LLM/local inference path (with mlx-lm). Left as llm-inference rather than infrastructure.

### `eleutherai-gpt-neox` (GPT-NeoX)
- **Kept:** primary `research`, secondary `['training', 'infrastructure']`
- **Why:** Large-scale training codebase, but historically a research/open-LM artifact (Eleuther). Unlike MaxText/LitGPT, kept under research.

### `tabbyml-tabby` (Tabby)
- **Kept:** primary `coding-agents`, secondary `['local-ai', 'infrastructure']`
- **Why:** Self-hosted autocomplete/chat assistant more than autonomous coding agent; coding-agents category here includes IDE coding assistants, so left unchanged.

### `huggingface-chat-ui` (chat-ui)
- **Kept:** primary `local-ai`, secondary `[]`
- **Why:** Self-hosted HuggingChat UI often backed by remote HF Inference—not strictly local/offline—but kept with other ChatGPT-clone clients (NextChat/Chatbox).

### `danny-avila-librechat` (LibreChat)
- **Kept:** primary `local-ai`, secondary `['ai-agents']`
- **Why:** Product has first-class agents; secondary ai-agents retained (contrast Open WebUI where agent secondary was removed as weaker).

### `vespa-engine-vespa` (Vespa)
- **Kept:** primary `vector-db`, secondary `['rag', 'infrastructure']`
- **Why:** Full search/ranking platform beyond pure vector DB; left in vector-db for AI retrieval/hybrid role, infrastructure secondary.

## Method notes

- Reviewed all 16 `data/canonical/*.json` files (233 unique repos).
- When primary changed, the record was moved so the filename matches `primaryCategory`.
- Updated `dateLastVerified` to `2026-08-12` and appended a short category-verification note on corrected records.
- See `_agent4_categories.json` for machine-readable corrections.
