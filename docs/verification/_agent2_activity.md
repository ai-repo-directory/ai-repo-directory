# Agent 2 — Activity Verification

**Verified:** 2026-08-12  
**Repos assessed:** 233  
**Signal priority:** `pushedAt` → `latestReleaseAt` → `updatedAt` (never rely on `updatedAt` alone)

## Status rules

| Status | Rule | Canonical `maintenance` |
|--------|------|-------------------------|
| `actively_maintained` | push ≤30d, not archived | `active` |
| `maintained` | push ≤90d, not archived | `moderate` |
| `low_activity` | push ≤365d (>90), not archived | `slow` |
| `stale` | push >365d, not archived | `stale` |
| `archived` | GitHub or canonical archived | `archived` |
| `historically_important` | stale/archived + `historicallySignificant` (dual-label) | (preserve flag) |

## Counts by primary status

- **actively_maintained:** 146
- **maintained:** 15
- **low_activity:** 27
- **stale:** 32
- **archived:** 13
- **historically_important (dual-label):** 28

## Mismatches

Found **52** mismatches between assigned status and canonical `maintenance`.
Fixed **52** (clearly wrong based on `pushedAt` / archived).

### Fixes applied

| id | old → new | primary_status | days_since_push | pushedAt | histSig |
|----|-----------|----------------|-----------------|----------|---------|
| `acly-krita-ai-diffusion` | `active` → `moderate` | `maintained` | 42.5 | 2026-06-30T12:33:40Z | False |
| `ailab-cvc-videocrafter` | `moderate` → `slow` | `low_activity` | 214.4 | 2026-01-09T15:01:22Z | True |
| `ali-vilab-vgen` | `slow` → `stale` | `stale` | 578.6 | 2025-01-10T09:09:13Z | True |
| `allenai-dolma` | `moderate` → `slow` | `low_activity` | 279.1 | 2025-11-05T22:00:12Z | False |
| `allenai-molmo` | `slow` → `stale` | `stale` | 607.3 | 2024-12-12T17:37:41Z | False |
| `answerdotai-ragatouille` | `slow` → `stale` | `stale` | 451.5 | 2025-05-17T12:45:38Z | False |
| `automatic1111-stable-diffusion-webui` | `moderate` → `slow` | `low_activity` | 162.7 | 2026-03-02T07:00:53Z | True |
| `black-forest-labs-flux` | `moderate` → `stale` | `stale` | 376.4 | 2025-07-31T13:58:55Z | False |
| `deepseek-ai-deepseek-vl2` | `moderate` → `stale` | `stale` | 531.8 | 2025-02-26T05:03:42Z | False |
| `determined-ai-determined` | `slow` → `stale` | `stale` | 509.2 | 2025-03-20T19:09:46Z | False |
| `facebookresearch-audiocraft` | `moderate` → `slow` | `low_activity` | 161.1 | 2026-03-03T21:50:32Z | True |
| `facebookresearch-moviegenbench` | `slow` → `stale` | `stale` | 521.7 | 2025-03-08T07:58:21Z | True |
| `facebookresearch-segment-anything` | `slow` → `stale` | `stale` | 692.3 | 2024-09-18T17:46:55Z | True |
| `genmoai-mochi` | `moderate` → `slow` | `low_activity` | 270.9 | 2025-11-14T01:17:56Z | False |
| `guoyww-animatediff` | `slow` → `stale` | `stale` | 741.9 | 2024-07-31T01:14:15Z | True |
| `haotian-liu-llava` | `slow` → `stale` | `stale` | 729.6 | 2024-08-12T09:52:38Z | True |
| `harvardnlp-annotated-transformer` | `slow` → `stale` | `stale` | 856.6 | 2024-04-07T09:58:46Z | True |
| `hpcaitech-open-sora` | `moderate` → `slow` | `low_activity` | 124.9 | 2026-04-09T01:52:40Z | True |
| `huggingface-fineweb-2` | `moderate` → `slow` | `low_activity` | 288.2 | 2025-10-27T18:15:38Z | False |
| `hzwer-eccv2022-rife` | `moderate` → `slow` | `low_activity` | 335.7 | 2025-09-10T06:32:03Z | True |
| `idea-research-grounded-sam-2` | `moderate` → `slow` | `low_activity` | 273.5 | 2025-11-11T12:16:57Z | False |
| `itzcrazykns-vane` | `moderate` → `slow` | `low_activity` | 122.4 | 2026-04-11T14:33:06Z | False |
| `karpathy-mingpt` | `slow` → `stale` | `stale` | 726.8 | 2024-08-15T04:09:40Z | True |
| `karpathy-nanogpt` | `moderate` → `slow` | `low_activity` | 272.2 | 2025-11-12T19:52:34Z | True |
| `lastmile-ai-mcp-agent` | `moderate` → `slow` | `low_activity` | 198.3 | 2026-01-25T16:35:16Z | False |
| `lightricks-ltx-video` | `moderate` → `slow` | `low_activity` | 218.1 | 2026-01-05T22:37:07Z | False |
| `llava-vl-llava-next` | `active` → `moderate` | `maintained` | 57.7 | 2026-06-15T06:32:49Z | False |
| `lllyasviel-fooocus` | `moderate` → `slow` | `low_activity` | 253.2 | 2025-12-01T19:17:07Z | False |
| `lllyasviel-stable-diffusion-webui-forge` | `moderate` → `stale` | `stale` | 376.9 | 2025-07-31T01:33:17Z | False |
| `meta-llama-synthetic-data-kit` | `moderate` → `slow` | `low_activity` | 287.2 | 2025-10-28T20:10:55Z | False |
| `microsoft-autogen` | `moderate` → `slow` | `low_activity` | 118.5 | 2026-04-15T11:59:09Z | True |
| `microsoft-bitnet` | `moderate` → `active` | `actively_maintained` | 15.8 | 2026-07-27T05:52:06Z | False |
| `microsoft-unilm` | `moderate` → `slow` | `low_activity` | 200.8 | 2026-01-23T04:09:35Z | True |
| `mlc-ai-mlc-llm` | `moderate` → `active` | `actively_maintained` | 11.9 | 2026-07-31T03:03:18Z | False |
| `mosaicml-streaming` | `active` → `moderate` | `maintained` | 47.4 | 2026-06-25T15:02:27Z | False |
| `myshell-ai-openvoice` | `slow` → `stale` | `stale` | 479.3 | 2025-04-19T16:00:00Z | False |
| `openai-clip` | `moderate` → `slow` | `low_activity` | 139.2 | 2026-03-25T18:46:40Z | True |
| `openai-evals` | `moderate` → `slow` | `low_activity` | 119.4 | 2026-04-14T15:29:57Z | True |
| `opengvlab-internvl` | `moderate` → `slow` | `low_activity` | 323.9 | 2025-09-22T01:36:48Z | False |
| `openrlhf-openrlhf` | `moderate` → `active` | `actively_maintained` | 28.9 | 2026-07-14T01:57:21Z | False |
| `quivrhq-quivr` | `slow` → `stale` | `stale` | 398.5 | 2025-07-09T12:55:23Z | False |
| `qwenlm-qwen3-vl` | `moderate` → `slow` | `low_activity` | 193.8 | 2026-01-30T04:47:30Z | False |
| `salesforce-lavis` | `active` → `moderate` | `maintained` | 70.2 | 2026-06-02T18:14:49Z | True |
| `sillytavern-sillytavern` | `active` → `moderate` | `maintained` | 31.1 | 2026-07-11T22:43:10Z | True |
| `stability-ai-generative-models` | `moderate` → `slow` | `low_activity` | 238.6 | 2025-12-16T08:36:18Z | True |
| `systran-faster-whisper` | `moderate` → `slow` | `low_activity` | 265.4 | 2025-11-19T14:40:46Z | False |
| `tencent-hunyuan-hunyuanvideo` | `active` → `moderate` | `maintained` | 43.6 | 2026-06-29T09:33:50Z | False |
| `togethercomputer-redpajama-data` | `active` → `moderate` | `maintained` | 69.3 | 2026-06-03T16:00:12Z | True |
| `vibrantlabsai-ragas` | `moderate` → `slow` | `low_activity` | 168.7 | 2026-02-24T07:47:19Z | True |
| `vision-cair-minigpt-4` | `slow` → `stale` | `stale` | 708.6 | 2024-09-02T09:07:21Z | True |
| `wan-video-wan2-1` | `moderate` → `slow` | `low_activity` | 159.6 | 2026-03-05T09:38:07Z | False |
| `zai-org-cogvideo` | `moderate` → `slow` | `low_activity` | 280.5 | 2025-11-04T11:19:04Z | True |

## Historically important (dual-labeled) — 28

| id | primary_status | days_since_push | maintenance |
|----|----------------|-----------------|-------------|
| `abanteai-archive-old-cli-mentat` | `archived` | 581.0 | `archived` |
| `ali-vilab-vgen` | `stale` | 578.6 | `stale` |
| `antonosika-gpt-engineer` | `archived` | 454.6 | `archived` |
| `browserbase-mcp-server-browserbase` | `archived` | 22.1 | `archived` |
| `coqui-ai-tts` | `stale` | 725.5 | `stale` |
| `eleutherai-the-pile` | `stale` | 1202.1 | `stale` |
| `facebookresearch-chameleon` | `archived` | 743.1 | `archived` |
| `facebookresearch-demucs` | `archived` | 839.1 | `archived` |
| `facebookresearch-moviegenbench` | `stale` | 521.7 | `stale` |
| `facebookresearch-segment-anything` | `stale` | 692.3 | `stale` |
| `guoyww-animatediff` | `stale` | 741.9 | `stale` |
| `haotian-liu-llava` | `stale` | 729.6 | `stale` |
| `harvardnlp-annotated-transformer` | `stale` | 856.6 | `stale` |
| `huggingface-text-generation-inference` | `archived` | 143.5 | `archived` |
| `karpathy-mingpt` | `stale` | 726.8 | `stale` |
| `lllyasviel-controlnet` | `stale` | 898.6 | `stale` |
| `nomic-ai-gpt4all` | `stale` | 441.2 | `stale` |
| `qwenlm-qwen-vl` | `stale` | 734.9 | `stale` |
| `roocodeinc-roo-code` | `archived` | 88.2 | `archived` |
| `smol-ai-developer` | `stale` | 856.7 | `stale` |
| `sourcegraph-cody-public-snapshot` | `archived` | 375.4 | `archived` |
| `state-spaces-s4` | `stale` | 755.3 | `stale` |
| `suno-ai-bark` | `stale` | 722.7 | `stale` |
| `tencent-ailab-ip-adapter` | `stale` | 774.9 | `stale` |
| `tensorflow-tensor2tensor` | `archived` | 1166.2 | `archived` |
| `vision-cair-minigpt-4` | `stale` | 708.6 | `stale` |
| `voideditor-void` | `archived` | 70.1 | `archived` |
| `xinntao-real-esrgan` | `stale` | 735.4 | `stale` |

## Notes

- Inactive projects were **not** deleted.
- `historicallySignificant` was preserved on all entries.
- When fixing, set `dateLastVerified` to `2026-08-12` and appended a brief activity-verification note.
- Outputs: `docs/verification/_agent2_activity.json`, `docs/verification/_agent2_activity.md`
