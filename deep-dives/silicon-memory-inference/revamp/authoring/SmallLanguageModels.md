# Change report: SmallLanguageModels (nav id `slm`, "Small Language Models")

Status: COMPLETE (not committed)

Files: `src/sections/SmallLanguageModels.tsx`, `src/components/SlmParamsChart.tsx`,
`src/sources/SmallLanguageModels.ts` (new, 37 records, all cited), this report.

Register: `research/2026-10-refresh/04-other-arch.md` section 0 (SLM row) and section 7
(SL1 to SL32, Recommended edits 1 to 8). Cross-section notes in `revamp/REVAMP-PLAN.md`
followed: no claim that SLM weights fit a CPU cache; r8i is SNC3 with 160 MB L3 per node;
Graviton5 LLC is per NUMA node (at most 96 MB); MIG rows match Isolation: NIE and MIG.

## Fetched during authoring (records carry 2026-10-17)

- Llama 3.2 MODEL_CARD.md at llama-models `0e0b8c5`: quantization scheme, the 1B/3B table
  (BF16, vanilla PTQ "for comparison purposes only. Model not released", SpinQuant, QLoRA),
  OnePlus 12 decode/size table, "8k" context for quantized models, "128k" for BF16.
- Hugging Face API safetensors totals at every pinned revision in the chart (values below),
  and the meta-llama listing re-queried on 2026-10-17 (newest general small model still
  Llama 3.2 1B/3B, 2024-09-18; later uploads are Llama 4 MoE and guard models).
- Qwen3.5-0.8B/2B/4B/9B READMEs and configs: layouts, "262,144 natively"; Qwen3.5-2B config
  `layer_types` (6 full, 18 linear of 24), `num_key_value_heads` 2, `head_dim` 256,
  `mtp_num_hidden_layers` 1; README vLLM MTP command.
- Gemma 4 E2B and E4B READMEs (effective counts, PLE, 512-token sliding window, final layer
  global, 128K/256K, benchmark table incl. MRCR v2 and Tau2); Gemma 4 E2B QAT GGUF README
  (formats per size, assistant compatibility); Gemma 4 E2B assistant (MTP drafter, safetensors
  total 77,993,476).
- Ministral 3 3B/8B/14B READMEs (3.4B LM + 0.4B vision, 256k, FP8 instruct); SmolLM3-3B
  README (64k trained, 128k with YaRN); Phi-4-mini config (131072); gpt-oss-20b README.
- vLLM v0.31.0 `speculative_decoding/README.md` (method table, Gemma 4 assistant note) and
  `draft_model.md` (shared vocabulary, `use_heterogeneous_vocab` greedy only).
- Qwen3.5-35B-A3B README (read, then cut for length; no record kept).

## Word count

Rendered page (`main`, 1440 px), SVG text and citation badges excluded, Playwright
text-node walk (script in /tmp/slm-words, outside the repo). `main` also holds a 183-word
app header that is the same before and after; it is subtracted below.

- Before: 931 words with expandables closed, 1,126 open.
- After: 1,169 closed (+26%), 1,330 open (+18%). First draft was 1,554 closed; cut by
  removing the four-reasons block, compressing MIG, demoting the vLLM drafter ratings into
  an ExpandableSection, and dropping the Orin measured rate, the gpt-oss-20b-on-Spark
  vendor figure and the Qwen3.5-35B-A3B example.

Growth over 20% (closed), per added block:
- Hybrid attention paragraph (SL31, register asks for one paragraph): about +85 words.
- Small-active MoE (SL32): about +50 words.
- Stored versus effective sentence plus Llama status (SL30, Recommended edit 1): about +40.
- QAT table and checkpoint guidance (SL17, Recommended edit 4) replace a 45-word paragraph:
  about +190 words including the table. This is the register's "most practical fact" and
  the section's closing action.
- Offsetting cuts: four-reasons block (-200), the cache Alert and MIG-math paragraph (-140),
  the three limits expandables collapsed to one paragraph.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| SL1 | "1B-7B parameter range" | "under 15B parameters" (chart spans 0.87B to 14B stored) | chart data |
| SL2 | "Sections 22 and 23 covered LLM decode..."; Section 3, 9, 11, 26, 28 numbers | Section names only: Roofline and Arithmetic Intensity, Intel Xeon 6, Graviton Deep Dive, KV Cache and FlashAttention, Mixture of Experts and Sparse Activation, Edge Shared-Memory Silicon, Isolation: NIE and MIG, Disaggregated Serving and Speculative Decoding | n/a |
| SL4 | "Sub-millisecond per-token decode is achievable on host CPU" | 1B INT8 = 1 GB; Turin socket 614 GB/s allows about 614 tokens/s, 1.6 ms/token; one r8i node 230.4 GB/s about 230; sub-ms needs under about 0.6B params at INT8 on a whole socket | epyc9755Page (T1, derived), chipsAndCheeseXeon6 (T3, derived) |
| SL5 | "Llama 3.2 1B was sized for on-device deployment with explicit SpinQuant numbers" | Table: decode 19.2 / 50.2 / 45.8 tokens/s on OnePlus 12; file 2,358 / 1,083 / 1,127 MB; quantized builds at 8K context vs 128K | llama32Card (T1; decode vendor-claim, file and context spec) |
| SL6 | Gemma 3 1B at 32K | Gemma 4 E2B/E4B 128K, 12B 256K in the chart | gemma4E2b, gemma4E4b (T1) |
| SL7 | "Llama 3.2 1B drafting Llama 3.3 70B is a common pattern" | New families ship drafters: Gemma 4 MTP assistant for every size, 78M params for E2B; Qwen3.5 MTP layer; vLLM rates the shipped drafter above a draft model at high request rates; config details in an expandable | gemma4Qat, gemma4E2bAssistant, qwen35_2bConfig, qwen35_2b, vllmSpecReadme, vllmDraftModel (all T1) |
| SL8 | 14 / 7 / ~3.5 GB for 7B | 14 / 7 / 4 GB (NVFP4 4.5 bits per weight) | nvfp4Blog (T2, derived) |
| SL10, SL16 | B300 MIG 7 x ~34 GB as the slicing math | B200 `1g.23gb` x 7; B300 7 x 34 GB attributed to NVIDIA's Blackwell Ultra blog; MIG guide has no HGX B300 table; 7B FP8 leaves about 16 GB of a 23 GB slice | migSupportedProfiles (T1; derived for 16 GB), blackwellUltraBlog (T2), migSupportedGpus (T1) |
| SL11 | hardware-isolated SMs and bandwidth | "up to seven hardware-isolated instances" | migSupportedGpus, migConcepts (T1) |
| SL13 | "Xeon 6 with AMX FP16, Graviton5 with SVE2 BFMMLA" | AMX on Xeon 6 P-cores; BF16 and INT8 MMLA on Graviton3, 4 and 5 (no implication that it is new on Graviton5); both pay off in prefill and batched decode, not batch-1 | llvmX86Td (T1), gravitonLlamaCpp (T1) |
| SL14 | Alert "The working set fits in cache" | 1 GB is twice the 512 MB L3 of the largest Turin parts; r8i node 160 MB; Graviton5 NUMA node at most 96 MB; every token streams from DRAM | epyc9005Datasheet (T1, derived), chipsAndCheeseXeon6 (T3), gravitonReadme (T1) |
| SL15 | "two orders of magnitude below the H200 ridge" | "about 200 times below the H200's ridge point", same derivation as Roofline (206 FLOP/byte) | h200Page (T2, derived) |
| SL17 | "Quantization is essentially free" | Meta's Llama 3.2 1B table (MMLU 49.3/43.3/47.3/49.0; GSM8K 44.4/33.1/40.6/46.5), naive PTQ -11, SpinQuant -4, QAT+LoRA +2 GSM8K; start from the vendor QAT checkpoint (Llama-3.2-1B-Instruct-QLORA_INT4_EO8; Gemma 4 Q4_0 GGUF every size, w4a16 for vLLM on E2B/E4B/12B/31B; QAT assistant at same precision) | llama32Card (T1, measured; derived for deltas), llama32Qat (T1), gemma4Qat (T1) |
| SL18 | Phi-3-mini 128K / Llama 3.2 context; "materially below" | Gemma 4 E2B vs 31B: MRCR v2 8-needle 128K 19.1% vs 66.4%; Tau2 24.5% vs 76.9% (Google's evaluation) | gemma4E2b (T1, measured) |
| SL20 | Unpinned HF links, "Access dates 2026-04-25" | Cite records pinned to revision SHAs, in a table under the chart | all chart records (T1) |
| SL21 to SL29 | 14-row late-2024 chart (Gemma 2 2B drawn at 2B, Qwen 2.5 7B at 7B, Mistral "sliding window") | 14-row 2025-2026 lineup; the three wrong values left with their rows | see Diagram |

## Claims removed

- SL3: "order of magnitude less per token", "one-tenth to one-hundredth the cost" (UNKNOWN, CUT).
- SL9: "hosts dozens of concurrent SLM tenants" (CUT); replaced by "past seven tenants,
  isolation is the serving software's job".
- SL12: "on a public cloud", and "cleanest economic story" (CUT).
- SL19: the 80/20 routing split and "deployments that win in 2026 are routing systems"
  (CUT); routing kept as guidance with no number.
- "Increasingly competitive on focused tasks", "the cost lever often dominates", "the
  cloud-versus-on-device tradeoff is now a live design question": unsourced, failed the
  section-shape test.
- "Each instance hosts a separate SLM at full FP16 without contention": unsourced.
- "Frontier multilingual and domain capability typically lives in the 70B+ range":
  unsourced number; replaced by the sourced Gemma 4 within-family comparison.
- SL17's INT8/FP8 "within calibration noise": UNKNOWN, not restated in any form.
- The whole four-reasons block (cost, latency, on-device, drafters): its sourced content
  moved to the bandwidth, drafter and 4-bit blocks; the rest was unsourced.
- "vLLM, TensorRT-LLM and SGLang all support this pattern" and "borrows cycles on the
  LLM's silicon": covered by Disaggregated Serving and Speculative Decoding.

## UNKNOWNs and how the page handles each

- SL3 cost ratio, SL7 "common pattern", SL9 "dozens", SL12 public-cloud MIG, SL19 80/20:
  removed.
- SL17 INT8/FP8 accuracy: not claimed in any form; the page gives only the 4-bit evidence.
- Xeon 6900P 504 MB L3 (register: Intel returned 403): not used; the page uses r8i's 160 MB
  per node from Chips and Cheese, as Intel Xeon 6 does.
- B300 MIG: no MIG-guide table; the page attributes 7 x 34 GB to NVIDIA's Blackwell Ultra
  blog and says the guide has no HGX B300 table, matching Isolation: NIE and MIG. This
  departs from register SL10 ("unsourced"), because the Isolation author located the blog
  figure after the register was written.
- Meta's small-Llama status is scoped to Meta's Hugging Face listing on 2026-10-17.

## NEW content and sources

- Lineup chart and table (SL29, SL30): pinned HF revisions (qwen35_08b, qwen35_2b, qwen35_4b,
  qwen35_9b, gemma4E2b, gemma4E4b, gemma4_12b, ministral3_3b, ministral3_8b, ministral3_14b,
  smollm3, phi4Mini, llama32Card, llama32_1b, llama32_3b), hfMetaListing.
- Hybrid attention (SL31): qwen35_08b, gemma4E2b, qwen35_2bConfig (derived 3.2 GB KV at
  262,144 tokens versus 12.9 GB all-global).
- Small-active MoE (SL32): gptOss20b; DGX Spark and Jetson AGX Thor 128 GB at 273 GB/s:
  sparkHardware (T1), thorBlog (T2).
- Drafters (SL7): gemma4Qat, gemma4E2bAssistant, qwen35_2bConfig, qwen35_2b, vllmSpecReadme,
  vllmDraftModel.
- 4-bit guidance (SL17): llama32Card, llama32Qat, gemma4Qat.
- Limits: gemma4E2b benchmark table (MRCR v2, Tau2).

## Diagram: SlmParamsChart

- Rebuilt from the pinned lineup. Stored parameters (safetensors totals at the pinned
  revision): Qwen3.5-0.8B 0.873B, 2B 2.274B, 4B 4.660B, 9B 9.653B; Gemma 4 E2B 5.123B
  (2.3B effective), E4B 7.996B (4.5B effective), 12B 11.960B; Ministral 3 3B 3.849B,
  8B 8.918B, 14B 13.945B; SmolLM3-3B 3.075B; Phi-4-mini 3.836B; Llama 3.2 1B 1.236B,
  3B 3.213B. Displayed at two significant figures. Every bar labelled "stored", Gemma E
  bars also "effective" with a light segment for stored-only parameters. Context per row.
- The data array (`slmModels`) is exported and rendered as the table of sources under the
  chart, so every drawn number carries a Cite there.
- SVG contract: `role="img"`, `aria-labelledby="slm-params-title"`, `<title>` states the
  assertion, `aria-label` removed, viewBox 720 x 472 only, full-bleed white rect, fonts
  10 to 12 px sans-serif, no em-dashes. Wide-diagram phone convention: `overflowX: auto`
  wrapper, svg `minWidth: 640`.
- Rendered check (`scripts/shoot.mjs`, final build): `slm @1440 ... ok`, `slm @390 ... ok`
  (no overlapping text, no text out of its box, no viewBox clipping, no page overflow).
  Read the PNGs: at 1440 the bars, value labels and context column are separated with
  clear gaps (the longest label, "8.0B stored, 4.5B effective", ends well before the
  context column). At 390 the chart renders at 640 px inside the scroll wrapper, text at
  about 10 px, legible; the reader scrolls sideways for the context column. Full-page
  shots at both widths show the two Cloudscape tables scrolling inside their containers,
  no page-level overflow.

## Leverage pass: claim-set diff (assertions in the after that were not in the before)

1. SLM defined as under 15B parameters: chart data.
2. Naive 4-bit costs Llama 3.2 1B 11 GSM8K points; QAT recovers them: llama32Card (derived).
3. Stored counts include vision and audio encoders: model READMEs (Qwen3.5, Gemma 4,
   Ministral 3) in the chart table.
4. SmolLM3-3B 64K trained, 128K extended: smollm3.
5. Gemma 4 E2B 5.1B stored, 2.3B effective, via PLE lookup tables: gemma4E2b.
6. Llama 3.2 (September 2024) is Meta's newest small general-purpose model on HF: hfMetaListing.
7. Batch-1 decode about 200x below the H200 ridge: h200Page (derived, same as Roofline).
8. 1B INT8 = 1 GB, twice the 512 MB L3 of the largest Turin parts: epyc9005Datasheet (derived).
9. r8i node 160 MB L3: chipsAndCheeseXeon6. Graviton5 NUMA node at most 96 MB: gravitonReadme.
10. Turin 614 GB/s gives at most about 614 tokens/s (1.6 ms) for 1 GB; r8i node 230.4 GB/s
    about 230: epyc9755Page, chipsAndCheeseXeon6 (derived).
11. Sub-ms batch-1 needs under about 0.6B params at INT8 on a socket: epyc9755Page (derived).
12. AMX on Xeon 6 P-cores, BF16/INT8 MMLA on Graviton3 to 5 pay off in batched work, not
    batch-1: llvmX86Td, gravitonLlamaCpp; reasoning consistent with Intel Xeon 6.
13. Qwen3.5 Gated DeltaNet in 3 of 4 layers: qwen35_08b. Gemma 4 E2B/E4B 512-token sliding
    window interleaved with global layers: gemma4E2b.
14. Qwen3.5-2B KV at 262,144 tokens about 3.2 GB BF16, a quarter of all-global: qwen35_2bConfig (derived).
15. gpt-oss-20b 21B total, 3.6B active, within 16 GB: gptOss20b.
16. DGX Spark and Jetson AGX Thor 128 GB at 273 GB/s: sparkHardware, thorBlog.
17. 7B weights 14 / 7 / 4 GB in BF16 / FP8 / NVFP4: nvfp4Blog (derived).
18. MIG up to seven hardware-isolated instances: migSupportedGpus, migConcepts. B200
    `1g.23gb` x 7: migSupportedProfiles. B300 7 x 34 GB: blackwellUltraBlog. No HGX B300
    table: migSupportedGpus. 16 GB KV headroom: derived.
19. Gemma 4 MTP assistant for every size: gemma4Qat; 78M params for E2B: gemma4E2bAssistant.
    Qwen3.5 MTP layer: qwen35_2bConfig. vLLM rating: vllmSpecReadme. Gemma 4 `method: mtp`
    and draft_model log signature: vllmSpecReadme. Qwen3.5 MTP command: qwen35_2b. Shared
    vocabulary and greedy-only heterogeneous vocab: vllmDraftModel.
20. Gemma 4 E2B vs 31B MRCR v2 19.1% vs 66.4%, Tau2 24.5% vs 76.9%: gemma4E2b (measured).
21. Meta's three 4-bit builds, MMLU/GSM8K/decode/file values, 2.4x to 2.6x decode, more than
    halved file, 8K vs 128K context: llama32Card.
22. Meta QAT checkpoint name: llama32Qat. Gemma 4 QAT formats and assistant compatibility: gemma4Qat.

Reasoning statements labelled as guidance, no source needed: "a host CPU suits low-rate
tenants"; "compare such a model against a dense 3B to 7B one"; "past seven tenants,
isolation is the serving software's job"; "route mixed traffic"; "rerun your own evaluation".

## Orchestrator actions

- Glossary acronyms used here: SLM, MIG, INT8, BF16, FP8, NVFP4, KV, MoE, AMX, MMLA, NUMA,
  PLE (Per-Layer Embeddings), MTP (multi-token prediction), EAGLE, QAT (quantization-aware
  training), PTQ (post-training quantization), LoRA (low-rank adaptation), GPTQ (generative
  post-training quantization), MMLU, GSM8K, MRCR (multi-round coreference resolution),
  w4a16 (4-bit weights, 16-bit activations), QPS (in a citation note).
- Regenerate sources.md: 37 records, 25 new URLs (all model and vLLM records plus the HF
  listing); 12 shared records copied exactly.
- `sparkHardware` changed in EdgeSharedMemorySilicon.ts during this run (product page T2 to
  docs.nvidia.com hardware overview T1). This file now matches the current Edge record; if
  the Edge author changes it again, this copy must follow.
- Register 04 SL10 says the B300 MIG figure is unsourced; Isolation: NIE and MIG and this
  section attribute it to the Blackwell Ultra blog. The verifier should check the blog.
