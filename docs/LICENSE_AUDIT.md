# License Audit — Agent Group 5

**Date:** 2026-08-12  
**Scope:** All 233 repositories in `data/canonical/*.json` vs `data/derived/github/*.json`  
**Authority:** GitHub API `license` field is primary; canonical is compared and corrected only when GitHub has a clear SPDX identifier.

## Summary counts by openness

| Class | Count | Definition |
|-------|------:|------------|
| `open_source` | 210 | OSI-style / commonly accepted FOSS (MIT, Apache-2.0, BSD, GPL, AGPL, MPL, LGPL, ISC, CC-BY-4.0*, …) |
| `source_available` | 3 | Source visible but restrictive (Elastic-2.0, SSPL/BUSL-class, CC-BY-NC, proprietary, …) |
| `unclear_or_none` | 20 | null / NOASSERTION / missing / Other without clarity |
| **Total** | **233** | |

\* CC-BY-4.0 is permissive and treated as open for directory purposes, but flagged `unusual_for_software` (CC is not recommended for software by Creative Commons / not an OSI software license).

## Method

1. Read `license` from every file in `data/derived/github/*.json` (GitHub API SPDX key or null).
2. Compare to each listing’s `license` in `data/canonical/*.json`.
3. Classify using an effective license: **GitHub SPDX if clear**, otherwise canonical if present, otherwise none.
4. Flag missing GitHub detection, canonical/GitHub conflicts, non-commercial, and non-OSI source-available terms.
5. **Do not** call a repo open source merely because code is on GitHub.
6. If canonical ≠ clear GitHub SPDX → **fix canonical** to match GitHub and record the fix.

## Conflicts fixed

**1** canonical license field(s) updated to match GitHub SPDX:

| Repo ID | Canonical file | From | To | Reason |
|---------|----------------|------|----|--------|
| `microsoft-autogen` | `ai-agents.json` | `MIT` | `CC-BY-4.0` | Canonical license differed from clear GitHub SPDX; GitHub is authoritative. |

## Flag frequency

| Flag | Count |
|------|------:|
| `missing_github_license` | 31 |
| `missing_license` | 20 |
| `canonical_present_github_null` | 11 |
| `source_available_not_osi` | 3 |
| `creative_commons_nc` | 2 |
| `non_commercial` | 2 |
| `canonical_fixed_to_github` | 1 |
| `conflicting_metadata` | 1 |
| `creative_commons` | 1 |
| `elastic_license` | 1 |
| `unusual_for_software` | 1 |

## Source-available / restrictive

| ID | Effective | GitHub | Canonical | Flags |
|----|-----------|--------|-----------|-------|
| `arize-ai-phoenix` | `Elastic-2.0` | `None` | `Elastic-2.0` | `missing_github_license`, `canonical_present_github_null`, `source_available_not_osi`, `elastic_license` |
| `facebookresearch-moviegenbench` | `CC-BY-NC-4.0` | `None` | `CC-BY-NC-4.0` | `missing_github_license`, `canonical_present_github_null`, `non_commercial`, `source_available_not_osi`, `creative_commons_nc` |
| `facebookresearch-seamless-communication` | `CC-BY-NC-4.0` | `None` | `CC-BY-NC-4.0` | `missing_github_license`, `canonical_present_github_null`, `non_commercial`, `source_available_not_osi`, `creative_commons_nc` |

## Non-commercial

| ID | Effective | GitHub | Canonical |
|----|-----------|--------|-----------|
| `facebookresearch-moviegenbench` | `CC-BY-NC-4.0` | `None` | `CC-BY-NC-4.0` |
| `facebookresearch-seamless-communication` | `CC-BY-NC-4.0` | `None` | `CC-BY-NC-4.0` |

## Unusual / Creative Commons / custom

| ID | Effective | Openness | Flags |
|----|-----------|----------|-------|
| `microsoft-autogen` | `CC-BY-4.0` | `open_source` | `conflicting_metadata`, `creative_commons`, `unusual_for_software`, `canonical_fixed_to_github` |

## Metadata conflicts (canonical vs GitHub)

Includes (a) different non-null SPDX values and (b) canonical has a license while GitHub API returns null.

**12** repos:

| ID | Canonical | GitHub | Openness | Notes |
|----|-----------|--------|----------|-------|
| `ai-dynamo-dynamo` | `Apache-2.0` | `None` | `open_source` | GH undetected; classified via canonical |
| `ailab-cvc-videocrafter` | `Apache-2.0` | `None` | `open_source` | GH undetected; classified via canonical |
| `arize-ai-phoenix` | `Elastic-2.0` | `None` | `source_available` | GH undetected; classified via canonical |
| `facebookresearch-moviegenbench` | `CC-BY-NC-4.0` | `None` | `source_available` | GH undetected; classified via canonical |
| `facebookresearch-seamless-communication` | `CC-BY-NC-4.0` | `None` | `source_available` | GH undetected; classified via canonical |
| `janhq-jan` | `Apache-2.0` | `None` | `open_source` | GH undetected; classified via canonical |
| `langfuse-langfuse` | `MIT` | `None` | `open_source` | GH undetected; classified via canonical |
| `microsoft-autogen` | `CC-BY-4.0` | `CC-BY-4.0` | `open_source` | fixed |
| `mlfoundations-open-clip` | `MIT` | `None` | `open_source` | GH undetected; classified via canonical |
| `mozilla-ai-llamafile` | `Apache-2.0` | `None` | `open_source` | GH undetected; classified via canonical |
| `openai-evals` | `MIT` | `None` | `open_source` | GH undetected; classified via canonical |
| `tabbyml-tabby` | `Apache-2.0` | `None` | `open_source` | GH undetected; classified via canonical |

## Unclear or none (both sides empty / no effective license)

**20** repos classified `unclear_or_none`:

| ID | Canonical | GitHub | Flags |
|----|-----------|--------|-------|
| `ali-vilab-vgen` | `None` | `None` | `missing_github_license`, `missing_license` |
| `facebookresearch-chameleon` | `None` | `None` | `missing_github_license`, `missing_license` |
| `fishaudio-fish-speech` | `None` | `None` | `missing_github_license`, `missing_license` |
| `langgenius-dify` | `None` | `None` | `missing_github_license`, `missing_license` |
| `meilisearch-meilisearch` | `None` | `None` | `missing_github_license`, `missing_license` |
| `modelcontextprotocol-inspector` | `None` | `None` | `missing_github_license`, `missing_license` |
| `modelcontextprotocol-registry` | `None` | `None` | `missing_github_license`, `missing_license` |
| `modelcontextprotocol-servers` | `None` | `None` | `missing_github_license`, `missing_license` |
| `modelcontextprotocol-typescript-sdk` | `None` | `None` | `missing_github_license`, `missing_license` |
| `nvidia-megatron-lm` | `None` | `None` | `missing_github_license`, `missing_license` |
| `nvidia-tensorrt-llm` | `None` | `None` | `missing_github_license`, `missing_license` |
| `onyx-dot-app-onyx` | `None` | `None` | `missing_github_license`, `missing_license` |
| `open-webui-open-webui` | `None` | `None` | `missing_github_license`, `missing_license` |
| `pgvector-pgvector` | `None` | `None` | `missing_github_license`, `missing_license` |
| `quivrhq-quivr` | `None` | `None` | `missing_github_license`, `missing_license` |
| `qwenlm-qwen-vl` | `None` | `None` | `missing_github_license`, `missing_license` |
| `sdv-dev-sdv` | `None` | `None` | `missing_github_license`, `missing_license` |
| `significant-gravitas-autogpt` | `None` | `None` | `missing_github_license`, `missing_license` |
| `tencent-hunyuan-hunyuanvideo` | `None` | `None` | `missing_github_license`, `missing_license` |
| `vchitect-venhancer` | `None` | `None` | `missing_github_license`, `missing_license` |

## GitHub license distribution

| GitHub license | Count |
|----------------|------:|
| `Apache-2.0` | 114 |
| `MIT` | 67 |
| `None` | 31 |
| `AGPL-3.0` | 7 |
| `BSD-3-Clause` | 7 |
| `GPL-3.0` | 4 |
| `BSD-2-Clause` | 1 |
| `CC-BY-4.0` | 1 |
| `MPL-2.0` | 1 |

## Full classification table

| ID | Canonical | GitHub | Openness | Flags |
|----|-----------|--------|----------|-------|
| `aaif-goose-goose` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `abanteai-archive-old-cli-mentat` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `acly-krita-ai-diffusion` | `GPL-3.0` | `GPL-3.0` | `open_source` |  |
| `ag2ai-ag2` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `agno-agi-agno` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `ai-dynamo-dynamo` | `Apache-2.0` | `None` | `open_source` | missing_github_license, canonical_present_github_null |
| `ai-hypercomputer-maxtext` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `aider-ai-aider` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `ailab-cvc-videocrafter` | `Apache-2.0` | `None` | `open_source` | missing_github_license, canonical_present_github_null |
| `ali-vilab-vgen` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `allenai-dolma` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `allenai-molmo` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `anomalyco-opencode` | `MIT` | `MIT` | `open_source` |  |
| `answerdotai-ragatouille` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `antonosika-gpt-engineer` | `MIT` | `MIT` | `open_source` |  |
| `argilla-io-argilla` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `argilla-io-distilabel` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `arize-ai-phoenix` | `Elastic-2.0` | `None` | `source_available` | missing_github_license, canonical_present_github_null, source_available_not_osi, elastic_license |
| `automatic1111-stable-diffusion-webui` | `AGPL-3.0` | `AGPL-3.0` | `open_source` |  |
| `axolotl-ai-cloud-axolotl` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `bentoml-bentoml` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `bitsandbytes-foundation-bitsandbytes` | `MIT` | `MIT` | `open_source` |  |
| `black-forest-labs-flux` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `blinkdl-rwkv-lm` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `braintrustdata-autoevals` | `MIT` | `MIT` | `open_source` |  |
| `browserbase-mcp-server-browserbase` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `camel-ai-camel` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `chatboxai-chatbox` | `GPL-3.0` | `GPL-3.0` | `open_source` |  |
| `chatgptnextweb-nextchat` | `MIT` | `MIT` | `open_source` |  |
| `chroma-core-chroma` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `cline-cline` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `comfy-org-comfyui` | `GPL-3.0` | `GPL-3.0` | `open_source` |  |
| `composiohq-composio` | `MIT` | `MIT` | `open_source` |  |
| `confident-ai-deepeval` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `continuedev-continue` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `coqui-ai-tts` | `MPL-2.0` | `MPL-2.0` | `open_source` |  |
| `crewaiinc-crewai` | `MIT` | `MIT` | `open_source` |  |
| `cursortouch-windows-mcp` | `MIT` | `MIT` | `open_source` |  |
| `danny-avila-librechat` | `MIT` | `MIT` | `open_source` |  |
| `dao-ailab-flash-attention` | `BSD-3-Clause` | `BSD-3-Clause` | `open_source` |  |
| `datadreamer-dev-datadreamer` | `MIT` | `MIT` | `open_source` |  |
| `deepseek-ai-deepseek-vl2` | `MIT` | `MIT` | `open_source` |  |
| `deepset-ai-haystack` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `deepspeedai-deepspeed` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `determined-ai-determined` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `doubiiu-dynamicrafter` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `dphnai-sonar` | `AGPL-3.0` | `AGPL-3.0` | `open_source` |  |
| `eleutherai-gpt-neox` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `eleutherai-lm-evaluation-harness` | `MIT` | `MIT` | `open_source` |  |
| `eleutherai-the-pile` | `MIT` | `MIT` | `open_source` |  |
| `exo-explore-exo` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `facebookresearch-audiocraft` | `MIT` | `MIT` | `open_source` |  |
| `facebookresearch-chameleon` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `facebookresearch-demucs` | `MIT` | `MIT` | `open_source` |  |
| `facebookresearch-faiss` | `MIT` | `MIT` | `open_source` |  |
| `facebookresearch-moviegenbench` | `CC-BY-NC-4.0` | `None` | `source_available` | missing_github_license, canonical_present_github_null, non_commercial, source_available_not_osi, creative_commons_nc |
| `facebookresearch-sam2` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `facebookresearch-seamless-communication` | `CC-BY-NC-4.0` | `None` | `source_available` | missing_github_license, canonical_present_github_null, non_commercial, source_available_not_osi, creative_commons_nc |
| `facebookresearch-segment-anything` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `fishaudio-fish-speech` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `flyteorg-flyte` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `genmoai-mochi` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `ggml-org-llama.cpp` | `MIT` | `MIT` | `open_source` |  |
| `ggml-org-whisper-cpp` | `MIT` | `MIT` | `open_source` |  |
| `giskard-ai-giskard-oss` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `github-github-mcp-server` | `MIT` | `MIT` | `open_source` |  |
| `google-adk-python` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `google-flax` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `google-gemini-gemini-cli` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `guoyww-animatediff` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `hao-ai-lab-fastvideo` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `haotian-liu-llava` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `harvardnlp-annotated-transformer` | `MIT` | `MIT` | `open_source` |  |
| `helicone-helicone` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `hiyouga-llamafactory` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `hpcaitech-colossalai` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `hpcaitech-open-sora` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `huggingface-accelerate` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `huggingface-chat-ui` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `huggingface-datasets` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `huggingface-datatrove` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `huggingface-diffusers` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `huggingface-fineweb-2` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `huggingface-peft` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `huggingface-smolagents` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `huggingface-text-generation-inference` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `huggingface-transformers` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `huggingface-trl` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `hzwer-eccv2022-rife` | `MIT` | `MIT` | `open_source` |  |
| `idea-research-grounded-sam-2` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `idea-research-groundingdino` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `instantx-research-instantid` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `instructlab-instructlab` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `internlm-lmdeploy` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `invoke-ai-invokeai` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `itzcrazykns-vane` | `MIT` | `MIT` | `open_source` |  |
| `janhq-jan` | `Apache-2.0` | `None` | `open_source` | missing_github_license, canonical_present_github_null |
| `karpathy-mingpt` | `MIT` | `MIT` | `open_source` |  |
| `karpathy-nanogpt` | `MIT` | `MIT` | `open_source` |  |
| `khoj-ai-khoj` | `AGPL-3.0` | `AGPL-3.0` | `open_source` |  |
| `kserve-kserve` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `kubeflow-kubeflow` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `lancedb-lancedb` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `langchain-ai-langchain` | `MIT` | `MIT` | `open_source` |  |
| `langchain-ai-langchain-mcp-adapters` | `MIT` | `MIT` | `open_source` |  |
| `langchain-ai-langgraph` | `MIT` | `MIT` | `open_source` |  |
| `langfuse-langfuse` | `MIT` | `None` | `open_source` | missing_github_license, canonical_present_github_null |
| `langgenius-dify` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `lastmile-ai-mcp-agent` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `lightning-ai-litgpt` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `lightricks-ltx-video` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `llava-vl-llava-next` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `lllyasviel-controlnet` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `lllyasviel-fooocus` | `GPL-3.0` | `GPL-3.0` | `open_source` |  |
| `lllyasviel-stable-diffusion-webui-forge` | `AGPL-3.0` | `AGPL-3.0` | `open_source` |  |
| `llm-d-llm-d` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `lostruins-koboldcpp` | `AGPL-3.0` | `AGPL-3.0` | `open_source` |  |
| `lucidrains-x-transformers` | `MIT` | `MIT` | `open_source` |  |
| `m-bain-whisperx` | `BSD-2-Clause` | `BSD-2-Clause` | `open_source` |  |
| `mark3labs-mcp-go` | `MIT` | `MIT` | `open_source` |  |
| `mcmonkeyprojects-swarmui` | `MIT` | `MIT` | `open_source` |  |
| `mcp-use-mcp-use` | `MIT` | `MIT` | `open_source` |  |
| `meilisearch-meilisearch` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `meta-llama-synthetic-data-kit` | `MIT` | `MIT` | `open_source` |  |
| `meta-pytorch-torchtune` | `BSD-3-Clause` | `BSD-3-Clause` | `open_source` |  |
| `microsoft-autogen` | `CC-BY-4.0` | `CC-BY-4.0` | `open_source` | conflicting_metadata, creative_commons, unusual_for_software, canonical_fixed_to_github |
| `microsoft-bitnet` | `MIT` | `MIT` | `open_source` |  |
| `microsoft-phicookbook` | `MIT` | `MIT` | `open_source` |  |
| `microsoft-playwright-mcp` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `microsoft-semantic-kernel` | `MIT` | `MIT` | `open_source` |  |
| `microsoft-unilm` | `MIT` | `MIT` | `open_source` |  |
| `milvus-io-milvus` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `mintplex-labs-anything-llm` | `MIT` | `MIT` | `open_source` |  |
| `ml-explore-mlx` | `MIT` | `MIT` | `open_source` |  |
| `mlc-ai-mlc-llm` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `mlc-ai-web-llm` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `mlflow-mlflow` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `mlfoundations-open-clip` | `MIT` | `None` | `open_source` | missing_github_license, canonical_present_github_null |
| `modelcontextprotocol-inspector` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `modelcontextprotocol-python-sdk` | `MIT` | `MIT` | `open_source` |  |
| `modelcontextprotocol-registry` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `modelcontextprotocol-servers` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `modelcontextprotocol-typescript-sdk` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `modelscope-diffsynth-studio` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `mosaicml-streaming` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `mozilla-ai-llamafile` | `Apache-2.0` | `None` | `open_source` | missing_github_license, canonical_present_github_null |
| `mudler-localai` | `MIT` | `MIT` | `open_source` |  |
| `myshell-ai-openvoice` | `MIT` | `MIT` | `open_source` |  |
| `netflix-metaflow` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `neuml-txtai` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `nomic-ai-gpt4all` | `MIT` | `MIT` | `open_source` |  |
| `nvidia-megatron-lm` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `nvidia-nemo-curator` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `nvidia-nemo-speech` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `nvidia-tensorrt-llm` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `ollama-ollama` | `MIT` | `MIT` | `open_source` |  |
| `onyx-dot-app-onyx` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `oobabooga-textgen` | `AGPL-3.0` | `AGPL-3.0` | `open_source` |  |
| `open-telemetry-opentelemetry-collector` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `open-telemetry-semantic-conventions` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `open-webui-open-webui` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `openai-clip` | `MIT` | `MIT` | `open_source` |  |
| `openai-codex` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `openai-evals` | `MIT` | `None` | `open_source` | missing_github_license, canonical_present_github_null |
| `openai-openai-agents-python` | `MIT` | `MIT` | `open_source` |  |
| `openai-swarm` | `MIT` | `MIT` | `open_source` |  |
| `openai-whisper` | `MIT` | `MIT` | `open_source` |  |
| `openbmb-minicpm-v` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `opengvlab-internvl` | `MIT` | `MIT` | `open_source` |  |
| `openhands-openhands` | `MIT` | `MIT` | `open_source` |  |
| `openinterpreter-openinterpreter` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `opennmt-ctranslate2` | `MIT` | `MIT` | `open_source` |  |
| `openrlhf-openrlhf` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `pgvector-pgvector` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `plachtaa-vall-e-x` | `MIT` | `MIT` | `open_source` |  |
| `predibase-lorax` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `prefecthq-fastmcp` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `promptfoo-promptfoo` | `MIT` | `MIT` | `open_source` |  |
| `pydantic-pydantic-ai` | `MIT` | `MIT` | `open_source` |  |
| `qdrant-qdrant` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `quivrhq-quivr` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `qwenlm-qwen-code` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `qwenlm-qwen-vl` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `qwenlm-qwen3-vl` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `ray-project-ray` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `rhasspy-piper` | `MIT` | `MIT` | `open_source` |  |
| `roocodeinc-roo-code` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `run-llama-llama-index` | `MIT` | `MIT` | `open_source` |  |
| `rvc-project-retrieval-based-voice-conversion-webui` | `MIT` | `MIT` | `open_source` |  |
| `salesforce-lavis` | `BSD-3-Clause` | `BSD-3-Clause` | `open_source` |  |
| `sdv-dev-sdv` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `sgl-project-sglang` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `significant-gravitas-autogpt` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `sillytavern-sillytavern` | `AGPL-3.0` | `AGPL-3.0` | `open_source` |  |
| `skypilot-org-skypilot` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `smol-ai-developer` | `MIT` | `MIT` | `open_source` |  |
| `sourcegraph-cody-public-snapshot` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `stability-ai-generative-models` | `MIT` | `MIT` | `open_source` |  |
| `stanford-crfm-helm` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `state-spaces-mamba` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `state-spaces-s4` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `suno-ai-bark` | `MIT` | `MIT` | `open_source` |  |
| `swe-agent-swe-agent` | `MIT` | `MIT` | `open_source` |  |
| `swivid-f5-tts` | `MIT` | `MIT` | `open_source` |  |
| `systran-faster-whisper` | `MIT` | `MIT` | `open_source` |  |
| `tabbyml-tabby` | `Apache-2.0` | `None` | `open_source` | missing_github_license, canonical_present_github_null |
| `tencent-ailab-ip-adapter` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `tencent-hunyuan-hunyuanvideo` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `tensorflow-tensor2tensor` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `togethercomputer-redpajama-data` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `traceloop-openllmetry` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `triton-inference-server-server` | `BSD-3-Clause` | `BSD-3-Clause` | `open_source` |  |
| `truera-trulens` | `MIT` | `MIT` | `open_source` |  |
| `ukgovernmentbeis-inspect-ai` | `MIT` | `MIT` | `open_source` |  |
| `unslothai-unsloth` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `upstash-context7` | `MIT` | `MIT` | `open_source` |  |
| `vchitect-venhancer` | `None` | `None` | `unclear_or_none` | missing_github_license, missing_license |
| `verl-project-verl` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `vespa-engine-vespa` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `vibrantlabsai-ragas` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `vision-cair-minigpt-4` | `BSD-3-Clause` | `BSD-3-Clause` | `open_source` |  |
| `vladmandic-sdnext` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `vllm-project-aibrix` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `vllm-project-llm-compressor` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `vllm-project-vllm` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `voideditor-void` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `wan-video-wan2-1` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `wandb-wandb` | `MIT` | `MIT` | `open_source` |  |
| `weaviate-weaviate` | `BSD-3-Clause` | `BSD-3-Clause` | `open_source` |  |
| `xinntao-real-esrgan` | `BSD-3-Clause` | `BSD-3-Clause` | `open_source` |  |
| `yl4579-styletts2` | `MIT` | `MIT` | `open_source` |  |
| `zai-org-cogvideo` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |
| `zylon-ai-private-gpt` | `Apache-2.0` | `Apache-2.0` | `open_source` |  |

## Machine-readable output

- Per-repo JSON: [`_agent5_licenses.json`](./_agent5_licenses.json) — fields: `id`, `canonicalLicense`, `githubLicense`, `openness`, `flags[]`

## Notes for curators

- GitHub returning `null` does **not** prove the repo is unlicensed; detection often fails for custom LICENSE text, dual licenses, or non-root license files. Those rows are flagged `missing_github_license` / `canonical_present_github_null` when canonical still records a SPDX.
- Elastic License 2.0 and CC-BY-NC-* are **not** OSI open source; they are `source_available` (and NC flagged `non_commercial`).
- Prefer verifying LICENSE files manually for the 31 GitHub-null repos before marketing them as open source in copy.

