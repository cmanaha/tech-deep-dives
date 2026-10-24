# Verification: Small Language Models

Verified: 2026-10-23. Claims checked: 63 (sampled: 0, every claim checked). Confirmed 58,
wrong 2, unsupported 0, mislabelled 3, unverifiable 0.

Fetch notes. AMD's site timed out twice on 2026-10-23 (curl and WebFetch). The EPYC 9755 page was
read from the Wayback capture of 2026-06-18 (`web.archive.org/web/20260618055756/...`). The EPYC
9005 data sheet was read from the capture of 2026-07-11 (`.../20260711015948id_/...`). An earlier
2026-07-10 capture of the 9755 page holds only an Akamai "Access Denied" page and was not used.
Every other source was fetched live on 2026-10-23 with the default User-Agent. No request
carried personal data. Hugging Face facts were read at the pinned revision SHAs through
`/api/models/<repo>/revision/<sha>` (safetensors totals) and `/<repo>/raw/<sha>/README.md`.

## Gate 3 score: 8/10

The section gives a working mental model (batch-1 decode is bandwidth over bytes per token,
worked for a Turin socket and an r8i node) and two practical moves: size by the stored count,
and start from the vendor's QAT checkpoint. Its strongest number (naive 4-bit costs Llama 3.2 1B
11 GSM8K points) opens the page and returns in the closing block. One load-bearing figure was
wrong: the B300 MIG slice attributed to the Blackwell Ultra blog, which a P6-B300 reader would
size against. That is fixed. The section stops at 8 because it is 26% longer with expandables
closed, and the MIG paragraph is now dense with source comparison.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 8 | 58 of 63 confirmed. Wrong: the B300 MIG attribution (load-bearing) and the "2025-2026" lineup heading over two 2024 rows. Mislabelled: three vendor benchmark cites marked `measured`. All fixed |
| Mental model or practical value | 9 | Every block passes. The bandwidth budget and hybrid attention blocks give models, and the lineup, placement and 4-bit blocks give choices. No block fails both tests |
| Shape | 9 | Introduces SLMs before dissecting them. Each h2 description states the payoff. The 11-point figure lands twice. The chart table and the vLLM config sit in ExpandableSections. Ends on "start from the vendor's QAT checkpoint ... rerun your own evaluation" |
| Writing | 8 | The no-ai-tells gate is clean. Attribution in the sentence is load-bearing where it remains: "On Google's evaluation" and "Meta scored" mark vendor claims, and "NVIDIA's MIG page lists, as preliminary specifications" marks a source conflict. The h2 "What SLMs do not replace" frames the block by negation (backlog) |
| Economy | 7 | +26% closed and +18% open (author's count), justified block by block in the author report. The MIG paragraph now carries four citations in three sentences |
| Diagrams | 9 | SlmParamsChart is inline SVG with `role="img"`, `aria-labelledby` and a `<title>` that states the assertion. At 1440 nothing overlaps. At 390 the scroll wrapper keeps labels at about 10 px. Probe: `slm @1440 ok`, `slm @390 ok` |

## Claims

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | SLM = under 15B parameters | chart data | CONFIRMED | Largest stored total in the chart: Ministral 3 14B 13,945,032,240 (HF API, rev 29439f8) | |
| 2 | Naive 4-bit costs Llama 3.2 1B 11 GSM8K points; Meta's QAT checkpoint wins them back | llama32Card (derived) | CONFIRMED | GSM8K (CoT) row: bf16 44.4, Vanilla PTQ 33.1, Spin Quant 40.6, QLoRA 46.5. 44.4 - 33.1 = 11.3 | |
| 3 | Qwen3.5-0.8B: 0.87B stored, 262K | qwen35_08b | CONFIRMED | safetensors total 873,438,784 at 2fc0636; README "Context Length: 262,144 natively" | |
| 4 | Qwen3.5-2B: 2.3B, 262K | qwen35_2b | CONFIRMED | total 2,274,069,824 at 15852e8; README "262,144 natively" | |
| 5 | Qwen3.5-4B: 4.7B, 262K | qwen35_4b | CONFIRMED | total 4,659,865,088 at 851bf6e; "262,144 natively and extensible up to 1,010,000 tokens" | |
| 6 | Qwen3.5-9B: 9.7B, 262K | qwen35_9b | CONFIRMED | total 9,653,104,368 at c202236; same context line | |
| 7 | Gemma 4 E2B: 5.1B stored, 2.3B effective, 128K | gemma4E2b | CONFIRMED | total 5,123,178,051 at 3e22461; "2.3B effective (5.1B with embeddings)"; "Context Length 128K tokens" | |
| 8 | Gemma 4 E4B: 8.0B stored, 4.5B effective, 128K | gemma4E4b | CONFIRMED | total 7,996,156,490 at ee0ef60; "4.5B effective (8B with embeddings)"; 128K | |
| 9 | Gemma 4 12B: 12B, 256K | gemma4_12b, gemma4E2b | CONFIRMED | total 11,959,730,224 at 707f0a3; table "11.95B", "256K tokens" | |
| 10 | Ministral 3 3B: 3.8B, 256K | ministral3_3b | CONFIRMED | total 3,849,090,048 at b35d4df; "3.4B Language Model", "0.4B Vision Encoder", "Supports a 256k context window" | |
| 11 | Ministral 3 8B: 8.9B, 256K | ministral3_8b | CONFIRMED | total 8,918,026,716 at 5b26027; "8.4B Language Model", "0.4B Vision Encoder", 256k | |
| 12 | Ministral 3 14B: 14B, 256K | ministral3_14b | CONFIRMED | total 13,945,032,240 at 29439f8; "13.5B Language Model", 256k | |
| 13 | SmolLM3-3B: 3.1B, 64K trained, 128K extended | smollm3 | CONFIRMED | total 3,075,098,624 at a07cc9a; "Trained on 64k context and supports up to 128k tokens using YARN extrapolation" | |
| 14 | Phi-4-mini: 3.8B, 128K | phi4Mini | CONFIRMED | total 3,836,021,760 at cfbefac; config `max_position_embeddings: 131072`; README "supports 128K token context length" | |
| 15 | Llama 3.2 1B: 1.2B, 128K | llama32Card, llama32_1b | CONFIRMED | total 1,235,814,400 at 4e20de3; card "1B (1.23B) ... 128k" | |
| 16 | Llama 3.2 3B: 3.2B, 128K | llama32Card, llama32_3b | CONFIRMED | total 3,212,749,824 at 13afe51; card "3B (3.21B)" | |
| 17 | Stored totals include any vision and audio encoders | chart READMEs | CONFIRMED | Qwen3.5 "Causal Language Model with Vision Encoder"; Gemma E2B/E4B "Vision Encoder ~150M", "Audio Encoder ~300M"; Ministral "0.4B Vision Encoder" | |
| 18 | Chart title: 14 models, six families, 0.87B to 14B, 128K to 262K except SmolLM3 at 64K | chart data | CONFIRMED | Rows 3 to 16 | |
| 19 | E2B stores 5.1B and computes like 2.3B because PLE tables are read by lookup | gemma4E2b | CONFIRMED | "These embedding tables are large but are only used for quick lookups, which is why the effective parameter count is much smaller than the total" | |
| 20 | Llama 3.2 (September 2024) is still Meta's newest small general-purpose model on HF | hfMetaListing | CONFIRMED (re-queried 2026-10-23) | Newest meta-llama repos: Llama-Prompt-Guard-2 (2025-04-28), Llama-Guard-4-12B, Llama 4 Scout/Maverick (2025-04), Llama-3.3-70B (2024-11-26), Llama-3.2 INT4 builds (2024-10-23); Llama-3.2-1B/3B created 2024-09-18 | |
| 21 | Heading "The 2025-2026 small-model lineup" | chart data | WRONG | Llama 3.2 1B and 3B rows date from September 2024 (HF createdAt 2024-09-18; card release date "Oct 24, 2024" for the quantized refresh) | "The 2024-2026 small-model lineup" |
| 22 | Batch-1 decode about 200x below the H200 ridge | h200Page (derived) | CONFIRMED | "BFLOAT16 Tensor Core² 1,979 TFLOPS", "² With sparsity", "GPU Memory Bandwidth 4.8TB/s". 989.5 / 4.8 = 206 | |
| 23 | 1B at INT8 = 1 GB, twice the 512 MB L3 of the largest Turin parts | epyc9005Datasheet (derived) | CONFIRMED | Data sheet (Wayback 2026-07-11): 9755 and 9175F rows "512", no SKU above 512 MB | |
| 24 | r8i Xeon 6 node has 160 MB L3 | chipsAndCheeseXeon6 | CONFIRMED | "each core is able to access a huge 160 MB pool of L3 cache on its tile"; "AWS has further configured the chip in SNC3 mode" | |
| 25 | Graviton5 NUMA node at most 96 MB | gravitonReadme | CONFIRMED | LLC row: "48MB per NUMA (<= 16xlarge), or 96MB per NUMA (24xlarge and 48xlarge)" | |
| 26 | Turin socket 614 GB/s | epyc9755Page | CONFIRMED (Wayback 2026-06-18) | "Per Socket Mem BW 614 GB/s"; "Up to 6400 MT/s" | |
| 27 | About 614 tokens/s, 1.6 ms per token for 1 GB | epyc9755Page (derived) | CONFIRMED | 614 / 1 = 614; 1 / 614 s = 1.63 ms. Derived ceiling, not a measurement | |
| 28 | One r8i node 230.4 GB/s, about 230 tokens/s | chipsAndCheeseXeon6 (derived) | CONFIRMED | "12 memory controllers, or four per compute die"; "DDR5-7200". 4 x 7.2 GT/s x 8 B = 230.4 GB/s. The note omitted these inputs | Note now shows the inputs |
| 29 | Sub-ms batch-1 needs under about 0.6B params at INT8 on a socket | epyc9755Page (derived) | CONFIRMED | 0.614 GB / 1 B per param = 0.614B | |
| 30 | AMX on Xeon 6 P-cores | llvmX86Td | CONFIRMED | X86.td at llvmorg-23.1.3: `GNRAdditionalFeatures = [FeatureAMXFP16, ...]`, GNR = SPR features + these | |
| 31 | BF16 and INT8 MMLA on Graviton3, 4 and 5 | gravitonLlamaCpp | CONFIRMED | "Graviton3(E) ..., Graviton4 ..., and Graviton5 ... CPUs support BFloat16 format and MMLA instructions"; "quantized GEMM kernels are optimized ... using Arm Neon and SVE based matrix multiply-accumulate (MMLA) instructions" | |
| 32 | Qwen3.5 Gated DeltaNet (linear attention) in 3 of every 4 layers | qwen35_08b | CONFIRMED | "Hidden Layout: 6 × (3 × (Gated DeltaNet → FFN) → 1 × (Gated Attention → FFN))"; "Number of Linear Attention Heads" | |
| 33 | Gemma 4 E2B/E4B interleave 512-token sliding-window layers with global ones | gemma4E2b | CONFIRMED | "interleaves local sliding window attention with full global attention"; "Sliding Window 512 tokens" | |
| 34 | Qwen3.5-2B KV at 262,144 tokens about 3.2 GB, a quarter of 12.9 GB all-global | qwen35_2bConfig (derived) | CONFIRMED | config: `layer_types` 6 full_attention and 18 linear_attention, `num_key_value_heads` 2, `head_dim` 256. 6 x 2 x 2 x 256 x 2 = 12,288 B/token; x 262,144 = 3.22 GB; x 4 = 12.88 GB | |
| 35 | gpt-oss-20b 21B params, 3.6B active, within 16 GB | gptOss20b | CONFIRMED | "21B parameters with 3.6B active parameters"; "the gpt-oss-20b model run within 16GB of memory" | |
| 36 | DGX Spark 128 GB at 273 GB/s | sparkHardware | CONFIRMED | "128 GB LPDDR5x unified system memory, 256-bit interface, 4266 MHz, 273 GB/s bandwidth" | |
| 37 | Jetson AGX Thor 128 GB at 273 GB/s | thorBlog | CONFIRMED | Spec table: "Memory 128 GB 256-bit LPDDR5X, 273 GB/s" | |
| 38 | 7B: 14 / 7 / 4 GB in BF16 / FP8 / NVFP4; NVFP4 = 4 bits plus an 8-bit scale per 16 values | nvfp4Blog (derived) | CONFIRMED | "one 4-bit value plus minor overhead of one FP8 scale per 16 values (4.5 bits per value)". 7 x 4.5 / 8 = 3.94 GB | |
| 39 | MIG: up to seven hardware-isolated instances | migSupportedGpus, migConcepts | CONFIRMED | Supported GPUs "Max Number of Instances ... 7"; Concepts comparison: MIG "Max Partitions 7", "SM Performance Isolation Yes", "Memory Bandwidth QoS Yes", "Error Isolation Yes" | |
| 40 | B200 `1g.23gb` gives seven per GPU | migSupportedProfiles | CONFIRMED | Table 6, B200 180 GB: "MIG 1g.23gb 1/8 1/7 ... 7" | |
| 41 | "NVIDIA's Blackwell Ultra blog splits B300's 288 GB into up to seven of 34 GB" | blackwellUltraBlog | WRONG (product attribution) | Blog: "Blackwell Ultra GPUs can be partitioned ... seven instances with 34 GB each" (no product named). MIG product page, "MIG Specifications": GB300 NVL72 "7x 34 GB 4x 69 GB 2x 139 GB 1x 279 GB"; HGX B300 "7x 32 GB 4x 67 GB 2x 135 GB 1x 270 GB"; "Preliminary specifications. All values are up to and may be subject to change." | Now cites migProductPage: seven 34 GB for GB300 NVL72, seven 32 GB for HGX B300, as preliminary specifications |
| 42 | The MIG guide has no HGX B300 table | migSupportedGpus | CONFIRMED, scope widened | Supported MIG Profiles ("Last updated on Oct 13, 2026") has tables for GB300 (DGX Station, 252 GB), B200, RTX PRO, Thor, H100, H200, A100 and others; no B300 and no GB300 NVL72. Supported GPUs Table 1 has no B300 row | "no table for either", now also cites migSupportedProfiles |
| 43 | A 7B FP8 model leaves about 16 GB of a 23 GB slice | migSupportedProfiles (derived) | CONFIRMED | 23 - 7 = 16. "About" covers the profile name's rounding (180 / 8 = 22.5 GB) | |
| 44 | Gemma 4 publishes an MTP assistant for every size | gemma4Qat | CONFIRMED | "Available for Gemma 4 E2B, E4B, 12B, 26B A4B, and 31B, and their drafter models"; all five `google/gemma-4-*-it-assistant` repos return 200 | |
| 45 | 78M parameters for E2B | gemma4E2bAssistant | CONFIRMED | safetensors total 77,993,476 at 2d874ef (BF16 77,731,332 plus 262,144 I64); both round to 78M | |
| 46 | Qwen3.5 small models carry an MTP layer | qwen35_2bConfig | CONFIRMED | `mtp_num_hidden_layers: 1`; README "MTP: trained with multi-steps" | |
| 47 | vLLM rates the shipped drafter above a separate draft model at high request rates | vllmSpecReadme | CONFIRMED | v0.31.0 table, High QPS: "EAGLE ... Medium to high gain", "MTP ... Medium to high gain", "Draft model ... Medium gain" (qualitative) | |
| 48 | Gemma 4 assistants run as `"method": "mtp"`; a `method='draft_model'` startup log means no Gemma 4 MTP support | vllmSpecReadme | CONFIRMED | "Use `"method": "mtp"` with the assistant"; "If startup logs show `SpeculativeConfig(method='draft_model', ...)` ... the installed vLLM version does not include Gemma 4 MTP support" | |
| 49 | Qwen3.5 card recommends `{"method":"qwen3_next_mtp","num_speculative_tokens":2}` | qwen35_2b | CONFIRMED | README: `--speculative-config '{"method":"qwen3_next_mtp","num_speculative_tokens":2}'` | |
| 50 | A draft model must share the vocabulary unless `use_heterogeneous_vocab`, which requires greedy draft sampling | vllmDraftModel | CONFIRMED | "By default, vLLM requires the draft and target models to share the same vocabulary"; "`use_heterogeneous_vocab` requires `draft_sample_method='greedy'`" | |
| 51 | Gemma 4 E2B 19.1% vs 31B 66.4% (MRCR v2 8-needle 128K); Tau2 24.5% vs 76.9% | gemma4E2b | MISLABELLED (values CONFIRMED) | "MRCR v2 8 needle 128k (average) 66.4% ... 19.1%"; "Tau2 (average over 3) 76.9% ... 24.5%". Google's own evaluation of its own model, so a vendor claim | `kind` measured -> vendor-claim |
| 52 | Llama 3.2 1B MMLU 49.3 / 43.3 / 47.3 / 49.0 | llama32Card | MISLABELLED (values CONFIRMED) | MMLU row "49.3 43.3 47.3 49.0". Meta's evaluation of its own model | Column cite measured -> vendor-claim |
| 53 | GSM8K 44.4 / 33.1 / 40.6 / 46.5 | llama32Card | MISLABELLED (values CONFIRMED) | GSM8K (CoT) row as in claim 2 | Column cite measured -> vendor-claim |
| 54 | Decode 19.2 / 50.2 / 45.8 tokens/s on a OnePlus 12 | llama32Card (vendor-claim) | CONFIRMED | "1B BF16 (baseline) 19.2", "1B SpinQuant 50.2 (2.6x)", "1B QLoRA 45.8 (2.4x)"; "ExecuTorch framework ... ARM CPU as a backend using Android OnePlus 12 device". Meta's measurement, labelled vendor-claim, hardware named in the prose | |
| 55 | File 2,358 / 1,083 / 1,127 MB | llama32Card | CONFIRMED | "Model size (PTE file size in MB)": 2358, 1083 (-54.1%), 1127 (-52.2%) | |
| 56 | Naive PTQ not released; its decode and file not published | llama32Card | CONFIRMED | "for comparison purposes only. Model not released"; the speed table has no PTQ row | |
| 57 | Four-bit weights halve the file and speed phone decode 2.4x to 2.6x | llama32Card (vendor-claim) | CONFIRMED | -54.1% / -52.2%; 2.6x / 2.4x | |
| 58 | Naive PTQ -11, SpinQuant -4, QAT plus LoRA +2 GSM8K | llama32Card (derived) | CONFIRMED | 11.3, 3.8, 2.1 | |
| 59 | Quantized builds at 8K context, against 128K for BF16 | llama32Card | CONFIRMED | "Llama 3.2 Quantized (text only) ... 8k"; "Llama 3.2 (text only) ... 128k" | |
| 60 | SpinQuant = learned rotations plus GPTQ | llama32Card | CONFIRMED | "SpinQuant was applied, together with generative post-training quantization (GPTQ). For the SpinQuant rotation matrix fine-tuning ..." | |
| 61 | Meta QAT checkpoint `Llama-3.2-1B-Instruct-QLORA_INT4_EO8` | llama32Qat | CONFIRMED | Repo exists at 3fdf98b (created 2024-10-23) | |
| 62 | Gemma 4 Q4_0 GGUF for every size; w4a16 for vLLM on E2B, E4B, 12B, 31B | gemma4Qat | CONFIRMED | "GGUF (Q4_0) ... Available for Gemma 4 E2B, E4B, 12B, 26B A4B, and 31B"; "Compressed Tensors (w4a16) ... vLLM. Available for Gemma 4 E2B, E4B, 12B, and 31B" | |
| 63 | A QAT target needs the QAT build of its MTP assistant at the same precision | gemma4Qat | CONFIRMED | "the assistant model must also be a QAT checkpoint with the same precision" | |

Tiers: every shared URL carries the same tier and title in every source file (checked by script
against all `src/sources/*.ts`). Every Hugging Face and GitHub URL is pinned to a SHA or tag.
Licences: the page states none (see Backlog).

Tokens-per-second and latency figures: the 614 tokens/s, 1.6 ms, 230 tokens/s and sub-ms
figures are our derived bandwidth ceilings (no hardware run, `derived`, weights only). The 19.2 /
50.2 / 45.8 tokens/s and 2.4x to 2.6x figures are Meta's measurements on a OnePlus 12 (ExecuTorch,
Arm CPU backend), labelled `vendor-claim`. The page has no other speed or latency figure.

## ORCH-NOTES items

- **B300 MIG wording (SmallLanguageModels.tsx:222-230): WRONG, fixed.** The brief's premise
  needs one correction. NVIDIA's MIG user guide page Supported MIG Profiles ("Last updated on
  Oct 13, 2026", re-read 2026-10-23) gives no figure for either product. Its Blackwell tables
  are GB300 (DGX Station, 252 GB: 1g.31gb x 7) and B200 (180 GB: 1g.23gb x 7), and it has no
  B300 or GB300 NVL72 table. Supported GPUs has no B300 row. The 7 x 34 GB (GB300 NVL72) and
  7 x 32 GB (HGX B300) figures come from NVIDIA's MIG product page,
  `https://www.nvidia.com/en-us/technologies/multi-instance-gpu/`, under "MIG Specifications"
  and marked "Preliminary specifications". That page is `migProductPage` (Tier 2) in
  IsolationNie.ts. The Isolation verification says the same. The fixed line cites
  `migProductPage` for both figures and keeps "the MIG guide has no table for either", citing
  `migSupportedProfiles` and `migSupportedGpus`. All four records are copied exactly from
  IsolationNie.ts. `blackwellUltraBlog` is no longer cited here and was removed from this file.
- **B200 `1g.23gb`, seven per GPU: CONFIRMED** (Table 6). **"23 GB minus about 7 GB of FP8
  weights = about 16 GB": CONFIRMED** as arithmetic. The profile name rounds 22.5 GB. CUDA
  context and activations come out of the 16 GB, and "about" plus the note's "KV cache and
  activations" cover that.
- Other ORCH-NOTES items (Rubin HBM4, NeuronLink-v4, MI355X, Cerebras, LPX, DeepEP, NVLink
  direction, Xeon 6 brief, DeepSeek KV): NOT APPLICABLE. The section quotes none of them.

## Fixes applied

- `src/sections/SmallLanguageModels.tsx:227-231` (claim 41, 42). Before: "NVIDIA's Blackwell
  Ultra blog splits B300's 288 GB into up to seven of 34 GB <Cite blackwellUltraBlog />, though
  the MIG guide has no HGX B300 table. <Cite migSupportedGpus />". After: "NVIDIA's MIG page
  lists, as preliminary specifications, seven 34 GB instances for GB300 NVL72 and seven 32 GB
  instances for HGX B300 <Cite migProductPage />, though the MIG guide has no table for either.
  <Cite migSupportedProfiles /><Cite migSupportedGpus />".
- `src/sources/SmallLanguageModels.ts`: `blackwellUltraBlog` record replaced by `migProductPage`,
  copied exactly from IsolationNie.ts (T2, accessed 2026-10-18; re-read 2026-10-23, unchanged).
  The header comment was updated to match.
- `src/sections/SmallLanguageModels.tsx:78` (claim 21): "The 2025-2026 small-model lineup" ->
  "The 2024-2026 small-model lineup".
- `src/sections/SmallLanguageModels.tsx:281` (claim 51): `<Cite s={S.gemma4E2b} kind="measured" />`
  -> `kind="vendor-claim"`.
- `src/sections/SmallLanguageModels.tsx:314, 325` (claims 52, 53): MMLU and GSM8K column cites
  `kind="measured"` -> `kind="vendor-claim"`.
- `src/sections/SmallLanguageModels.tsx:16` (claim 28): `ceilingNote` now shows the 230.4 GB/s
  inputs: "One r8i SNC3 node has four memory controllers at DDR5-7200: 4 x 7.2 GT/s x 8 bytes =
  230.4 GB/s, / 1 GB = 230 tokens/s."
- `src/sections/SmallLanguageModels.tsx:199`: cross-reference `<em>Edge Shared-Memory
  Silicon</em>` -> `<em>Edge Shared-Memory Silicon: DGX Spark and Jetson</em>` (the
  sectionTitles.ts name).
- SlmParamsChart.tsx: no change.

## Checks

- `pnpm exec tsc --noEmit | grep -E "SmallLanguageModels|SlmParamsChart|sources/SmallLanguageModels"`: "no type errors in my files".
- `pnpm exec eslint src/sections/SmallLanguageModels.tsx src/sources/SmallLanguageModels.ts src/components/SlmParamsChart.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t SmallLanguageModels`: 1 passed, 34 skipped.
- `pnpm exec vitest run src/__tests__/sources.test.ts`: 853 passed, 1 failed (sources.md
  snapshot). The snapshot was already out of date before my change: the diff is mostly other
  sections' new records (471 -> 476 distinct sources, AwsCompilersAndTooling Neuron 2.32.0 rows).
  My change moves SmallLanguageModels from the Blackwell Ultra blog's "Cited in" list to the MIG
  product page's. Pinning, tier-consistency and record-completeness tests pass.
- Gates: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0, pre-overflow exit 0, none of
  them with a hit in my files.
- `pnpm exec vite build --outDir /tmp/vf-SmallLanguageModels-dist --emptyOutDir`: exit 0.
- `node scripts/shoot.mjs --sections slm --widths 1440,390 ...`: `slm @1440: 1 SVG diagram(s),
  0 React Flow, ok`; `slm @390: ... ok`. PNGs read: at 1440 the bars, value labels and context
  column are separated and nothing overlaps. At 390 the chart scrolls sideways at 640 px and
  the labels stay legible.

## For the orchestrator

- Regenerate sources.md (`vitest run -u`). This section now cites `migProductPage` and no
  longer cites `blackwellUltraBlog`, and the snapshot was already stale from other sections.
- ORCH-NOTES wording: the line "NVIDIA's MIG page gives 7 x 34 GB for GB300 NVL72 and 7 x 32 GB
  for HGX B300" refers to the MIG product page (`migProductPage`, T2, preliminary), not the
  MIG user guide's Supported MIG Profiles page. That page (updated 2026-10-13) has no B300 or
  GB300 NVL72 table. My brief said "Supported Profiles page", so a reader of the notes can
  confuse the two.
- For any section that sizes models to B200 slices: the MIG product page gives HGX B200 "7x 21
  GB" and GB200 NVL72 "7x 23 GB", while the MIG guide's B200 (180 GB) table names `1g.23gb` x 7.
  This section and Isolation follow the guide (Tier 1). No change made.
- Register 04 SL10 ("B300 MIG unsourced") can close as: a preliminary product-page figure (T2),
  with no MIG-guide table.

## Backlog

- Tier 0: run `nvidia-smi mig -lgip` on P6-B300 (HGX B300) to replace the preliminary 7 x 32 GB
  with real profile names (Isolation has the same item).
- Licence column for the chart table. HF cardData at the pinned revisions: Qwen3.5, Gemma 4,
  Ministral 3, SmolLM3 and gpt-oss-20b are apache-2.0, Phi-4-mini is mit, and Llama 3.2 is
  llama3.2 (gated, manual approval). This is practical for choosing a model; the page states no
  licence today.
- A measured KV headroom for a 7B FP8 model on a B200 `1g.23gb` slice would replace "about 16 GB".
- The h2 "What SLMs do not replace" frames its block by negation; its description ("Where a
  larger model still earns its cost") would serve as a positive title. This is style, not a
  correction.
- "Llama 3.2 is still Meta's newest small model" is time-sensitive. Re-query the listing each
  iteration (unchanged on 2026-10-23).
- Economy: the MIG paragraph carries four citations in three sentences. A future pass could move
  the B300 and GB300 source comparison into the Isolation section and keep only the B200 sizing
  here.
