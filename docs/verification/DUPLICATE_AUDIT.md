# Duplicate / Rename / Fork Audit

**Agent:** Group 6  
**Date:** 2026-08-12  
**Scope:** `data/canonical/*.json` (233 entries, 16 files) · `data/raw/*.json` (233 entries, 15 files) · `data/derived/github/*.json` (233 snapshots)  
**Machine-readable companion:** [`_agent6_duplicates.json`](./_agent6_duplicates.json)

## Verdict

**No true duplicate canonical entries.** No consolidations were performed.

Identical `githubUrl`, `owner/repo`, case-insensitive owner/repo, duplicate IDs, same-name/different-owner collisions, and distinct-ID/same-URL collisions are all **zero** in canonical. Known renames and org transfers are already represented as a **single** canonical URL with notes documenting prior paths. Intentional lineage pairs (forks / successors) are present as separate projects and should stay that way.

---

## Summary counts

| Check | Count |
|-------|------:|
| Identical `githubUrl` duplicates (canonical) | **0** |
| Exact `owner/repo` duplicates | **0** |
| Case-insensitive `owner/repo` duplicates | **0** |
| Duplicate IDs | **0** |
| Same display name, different owner/repo | **0** |
| Different IDs → same `githubUrl` | **0** |
| True duplicates consolidated this pass | **0** |
| Snapshots without canonical / canonical without snapshot | **0 / 0** |
| Redirect suspects confirmed (HTTP follow) | **30** |
| Related lineage pairs kept (not duplicates) | **5** |
| Canonical notes documenting rename/transfer/alias | **27** |
| Raw-only IDs (selection delta vs canonical) | **3** |
| Canonical-only IDs (selection delta vs raw) | **3** |

---

## Method

1. **Full dataset scan** of every canonical and raw record for URL, owner/repo (exact + case-insensitive), ID, normalized name, homepage, and `sources[]` collisions.
2. **Notes / editorial mining** for rename, redirect, transfer, fork, formerly, predecessor, and known patterns (`aphrodite→sonar`, AutoGen/AG2, Phidata→Agno, OpenDevin→OpenHands, etc.).
3. **Targeted redirect confirmation** only for suspected old paths (not all 233). GitHub REST API was rate-limited (403); confirmation used `curl -L` HTTP redirects against `github.com/...`.
4. **Consolidation policy:** merge only when two canonical rows clearly represent the same live GitHub repository. Do not collapse historically distinct lineage repos.

---

## Exact duplicate scan (canonical)

All empty:

- Identical `githubUrl`
- Exact and case-insensitive `owner/repo`
- Duplicate `id`
- Distinct `id` with identical `githubUrl`
- Same `name` under different owners

Raw also has **no** duplicate URLs across its 15 category files.

Benign shared homepages (not project duplicates):

| Homepage | IDs |
|----------|-----|
| `https://www.eleuther.ai` | `eleutherai-lm-evaluation-harness`, `eleutherai-gpt-neox` |
| `https://modelcontextprotocol.io` | `modelcontextprotocol-inspector`, `modelcontextprotocol-servers` |

---

## Snapshot ↔ canonical alignment

| Side | Count | Orphans |
|------|------:|---------|
| `data/derived/github/*.json` | 233 | none |
| Canonical IDs | 233 | none |
| `data/derived/scores.json` IDs | 233 | none (no score ID dups) |

Every snapshot stem matches a canonical `id` and vice versa.

---

## Raw ↔ canonical deltas (not duplicates)

Same **233** entry counts, but membership differs in `video-ai`, and canonical splits vector DBs into their own file.

### Category files

- Canonical-only file: `vector-db.json` (9 repos). Those IDs still exist in raw under `rag.json`.
- Raw has no extra category file.

### ID selection mismatch (`video-ai`)

| Only in canonical | Only in raw |
|-------------------|-------------|
| `ailab-cvc-videocrafter` | `pku-yuangroup-open-sora-plan` |
| `facebookresearch-moviegenbench` | `tencentarc-motionctrl` |
| `vchitect-venhancer` | `vchitect-vbench` |

These are **different projects**, not renames of each other. No consolidation indicated; treat as editorial selection drift between raw snapshot and curated canonical.

---

## Confirmed redirects / renames / transfers

Old paths resolve to the listed canonical repo. **None** of the old paths appear as a second canonical entry.

| Queried (old / alias) | Resolves to | Canonical ID |
|-----------------------|-------------|--------------|
| `ggerganov/whisper.cpp` | `ggml-org/whisper.cpp` | `ggml-org-whisper-cpp` |
| `block/goose` | `aaif-goose/goose` | `aaif-goose-goose` |
| `All-Hands-AI/OpenHands` | `OpenHands/OpenHands` | `openhands-openhands` |
| `OpenDevin/OpenDevin` | `OpenHands/OpenHands` | `openhands-openhands` |
| `princeton-nlp/SWE-agent` | `SWE-agent/SWE-agent` | `swe-agent-swe-agent` |
| `Aphrodite-Engine/aphrodite-engine` | `dphnAI/sonar` | `dphnai-sonar` |
| `PygmalionAI/aphrodite-engine` | `dphnAI/sonar` | `dphnai-sonar` |
| `explodinggradients/ragas` | `vibrantlabsai/ragas` | `vibrantlabsai-ragas` |
| `danswer-ai/danswer` | `onyx-dot-app/onyx` | `onyx-dot-app-onyx` |
| `ItzCrazyKns/Perplexica` | `ItzCrazyKns/Vane` | `itzcrazykns-vane` |
| `oobabooga/text-generation-webui` | `oobabooga/textgen` | `oobabooga-textgen` |
| `microsoft/DeepSpeed` | `deepspeedai/DeepSpeed` | `deepspeedai-deepspeed` |
| `OpenAccess-AI-Collective/axolotl` | `axolotl-ai-cloud/axolotl` | `axolotl-ai-cloud-axolotl` |
| `pytorch/torchtune` | `meta-pytorch/torchtune` | `meta-pytorch-torchtune` |
| `volcengine/verl` | `verl-project/verl` | `verl-project-verl` |
| `google/maxtext` | `AI-Hypercomputer/maxtext` | `ai-hypercomputer-maxtext` |
| `THUDM/CogVideo` | `zai-org/CogVideo` | `zai-org-cogvideo` |
| `Yidadaa/ChatGPT-Next-Web` | `ChatGPTNextWeb/NextChat` | `chatgptnextweb-nextchat` |
| `NVIDIA/NeMo-Curator` | `NVIDIA-NeMo/Curator` | `nvidia-nemo-curator` |
| `NVIDIA/NeMo`, `NVIDIA-NeMo/NeMo` | `NVIDIA-NeMo/Speech` | `nvidia-nemo-speech` |
| `giskard-ai/giskard` | `Giskard-AI/giskard-oss` | `giskard-ai-giskard-oss` |
| `phidatahq/phidata` | `agno-agi/agno` | `agno-agi-agno` |
| `hiyouga/LLaMA-Factory` | `hiyouga/LlamaFactory` | `hiyouga-llamafactory` |
| `KillianLucas/open-interpreter`, `OpenInterpreter/open-interpreter` | `openinterpreter/openinterpreter` | `openinterpreter-openinterpreter` |
| `microsoft/Phi-3CookBook` | `microsoft/PhiCookBook` | `microsoft-phicookbook` |
| `QwenLM/Qwen2-VL`, `QwenLM/Qwen2.5-VL` | `QwenLM/Qwen3-VL` | `qwenlm-qwen3-vl` |
| `jlowin/fastmcp` | `PrefectHQ/fastmcp` | `prefecthq-fastmcp` |

### Explicit non-redirect

| Queried | Result | Implication |
|---------|--------|-------------|
| `microsoft/autogen` | Stays `microsoft/autogen` | **Not** the same listing as `ag2ai/ag2`; keep both |

### Notes accuracy nit (not a duplicate)

`openinterpreter-openinterpreter` notes say “open-interpreter redirects,” but `github.com/open-interpreter/open-interpreter` returns **404**. Confirmed redirects are from `KillianLucas/open-interpreter` and `OpenInterpreter/open-interpreter`. Optional notes tweak only; no merge needed.

---

## Related lineage pairs (keep both)

These share history or naming but are **different** GitHub repositories. Notes already cross-link where relevant.

| Pair | Relationship | Why not merge |
|------|--------------|---------------|
| `ag2ai-ag2` ↔ `microsoft-autogen` | Community fork / continuation | Distinct URLs; MS repo does not redirect to AG2 |
| `cline-cline` ↔ `roocodeinc-roo-code` | Fork / evolution | Separate repos; Roo archived but historically useful |
| `haotian-liu-llava` ↔ `llava-vl-llava-next` | Predecessor / successor codebase | Different orgs and URLs |
| `qwenlm-qwen-vl` ↔ `qwenlm-qwen3-vl` | Series predecessor vs current | Older research repo vs current VL line (Qwen2/2.5-VL redirect into Qwen3-VL only) |
| `lllyasviel-stable-diffusion-webui-forge` ↔ `vladmandic-sdnext` | Sibling A1111-family forks | Independent projects |

---

## Known pattern checklist

| Pattern | Status in catalog |
|---------|-------------------|
| Aphrodite → Sonar (`dphnAI/sonar`) | Single entry `dphnai-sonar`; old Aphrodite paths redirect; no duplicate Aphrodite row |
| AutoGen org / AG2 continuation | Both `microsoft-autogen` and `ag2ai-ag2` present intentionally |
| Phidata → Agno | Single entry `agno-agi-agno`; `phidatahq/phidata` redirects here |
| OpenDevin / All-Hands → OpenHands | Single entry `openhands-openhands` |
| Perplexica → Vane | Single entry `itzcrazykns-vane` |
| Danswer → Onyx | Single entry `onyx-dot-app-onyx` |
| text-generation-webui → textgen | Single entry `oobabooga-textgen` |
| whisper.cpp ggerganov → ggml-org | Single entry `ggml-org-whisper-cpp` |

---

## Consolidations performed

**None.** No clear true duplicates existed in canonical.

---

## Follow-ups (optional, non-blocking)

1. Tighten `openinterpreter-openinterpreter` notes to name the real prior owners (`KillianLucas` / `OpenInterpreter`).
2. Decide whether raw `video-ai` should be re-synced to canonical’s three replacements (selection hygiene, not dedupe).
3. Consider adding an explicit `notes` alias line on `agno-agi-agno` (Phidata redirect is confirmed; currently only in `editorialSummary`).

---

## Provenance

Full structured findings: [`docs/verification/_agent6_duplicates.json`](./_agent6_duplicates.json).
