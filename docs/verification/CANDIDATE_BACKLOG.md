# Candidate Backlog

**Purpose:** Preserve deferred / rejected-but-interesting omission candidates for future discovery runs.  
**Created:** 2026-08-12 (Dataset v1 freeze)  
**Status values:** `deferred` | `rejected_watch` | `reevaluate`

Do not auto-add. Each row requires fresh GitHub + docs verification before promotion.

| repository | category | status | reason deferred / notes | date evaluated | reevaluation notes |
|------------|----------|--------|-------------------------|----------------|--------------------|
| Lightning-AI/pytorch-lightning | training / infrastructure | deferred | Excellent general DL framework; LitGPT + Accelerate already cover Lightning/HF LLM training UX for this catalog | 2026-08-12 | Promote only if expanding beyond LLM-centric training infra |
| karpathy/llm.c | research | deferred | Influential systems-education artifact; redundant with nanoGPT/minGPT for v1 research coverage | 2026-08-12 | Revisit for a “systems education” collection |
| ModelCloud/GPTQModel | llm-inference / training | rejected_watch | Successor to archived AutoGPTQ; not on original omission list | 2026-08-12 | Evaluate as quantization tooling replacement for AutoGPTQ |
| NVIDIA-NeMo/Automodel | training | rejected_watch | NeMo org split; Speech + Curator already listed; Automodel may deepen training coverage | 2026-08-12 | Intake with RL / Megatron-Bridge if training depth needed |
| NVIDIA-NeMo/RL | training | rejected_watch | Post-split NeMo RL stack | 2026-08-12 | Pair with Automodel evaluation |
| meta-llama/llama-models | research | rejected_watch | Living Meta models repo; `meta-llama/llama` rejected as deprecated pointer | 2026-08-12 | Prefer over deprecated llama inference starter |
| meta-llama/llama-cookbook | research | rejected_watch | Official recipes; may fill Meta presence gap | 2026-08-12 | Check license + redundancy with other fine-tune UIs |
| mozilla-ai/llamafile | local-ai | deferred | Optional/niche portable single-file LLM | 2026-08-12 | From Agent7 optional list |
| janhq/jan | local-ai | deferred | Optional/niche desktop local AI | 2026-08-12 | From Agent7 optional list |
| tabbyml/tabby | coding-agents | deferred | Optional self-hosted coding assistant | 2026-08-12 | Coding-agents already Strong |
| google/adk-python | ai-agents | deferred | GCP-oriented agent kit; niche relative to catalog peers | 2026-08-12 | From Agent7 optional list |
| rhasspy/piper | audio-ai | deferred | Edge/home-assistant TTS; audio coverage already Strong | 2026-08-12 | From Agent7 optional list |
| punkpeye/awesome-mcp-servers | mcp-tools | rejected_watch | Meta curated list; Registry/servers present | 2026-08-12 | Do not add list-only repos unless product wants meta indexes |
| Open-Orca/OpenOrca | datasets | rejected_watch | HF dataset only (no GitHub repo) — fails verified-repo gate | 2026-08-12 | Only if directory gains HF-dataset entities |
| huggingface/text-generation-inference | llm-inference | deferred | Historically important; maintenance-mode / optional | 2026-08-12 | May already be present as archived — confirm before re-add |
| ai-dynamo/dynamo peers / kserve | infrastructure | deferred | Strong infra peers already partly covered; deepen only for KServe/Kubeflow gaps | 2026-08-12 | Independent scan had KServe/Kubeflow as strong; verify presence next run |

---

## Intake rules for future runs

1. Prefer foundational libraries and category-defining products over wrappers and awesome-lists.  
2. Require canonical GitHub URL (follow redirects; record notes).  
3. Reject abandoned projects unless historically significant.  
4. DEFER when uncertain — never force into a freeze.  
5. After any ADD batch: ingest snapshots, validate, rank, audit ≥25% (min 15).
