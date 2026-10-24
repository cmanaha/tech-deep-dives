# Change report: QuantizationAndPrecision (nav id `quantization`)

Register: `research/2026-10-refresh/05-workloads.md`, "Section 25 - QuantizationAndPrecision"
(claims 25.1 to 25.35 and Recommended edits 1 to 5), "Ridge-point reference table" and
"Cross-section findings for the integrator" (items 2 and 3). Format support from
`02-nvidia.md` sections 0 to 2 and `03-aws-cpus.md` sections 0 and 1. P3 must-fix #9
(`docs/verification/2026-08-01/P3-silicon-numbers.md`, the 690 GB to 415 GB figure) is
closed for this section.

Files: `src/sections/QuantizationAndPrecision.tsx` (rewritten),
`src/components/PrecisionLadder.tsx` (rebuilt), `src/sources/QuantizationAndPrecision.ts`
(new, 30 records).

Shared records reuse URL, title, publisher and tier from existing files: `ptxIsa`,
`computeCapabilities`, `nvfp4Blog`, `h200Page`, `hgxPage` (NvidiaBlackwell.ts),
`trainium3Arch` (ThesisAndFraming.ts), `trn3Page`, `deepseekV3Config`, `deepseekV41Flash`
(FlashCacheTier.ts), `clangAmxIntrin` (ThesisAndFraming.ts), `deepseekV3Report` (Tier 2,
DeepSeek-AI, as in ThesisAndFraming.ts and FlashCacheTier.ts), `trtllmV100`,
`wideEpExample` (NvidiaCompilersAndTooling.ts).

Stable keys for the Mixture of Experts author: `deepseekV32Files`,
`deepseekV32Nvfp4Files`, `deepseekV32Nvfp4Card`. Use "1.66x".

## Fetched during authoring (records carry 2026-10-17)

- Hugging Face API at the pinned revisions: DeepSeek-V3.2 @ a7e62ac sums to
  689,483,049,129 bytes of safetensors (689.5 GB); DeepSeek-V3.2-NVFP4 @ 7c0f62c sums to
  415,061,565,152 bytes (415.1 GB). Ratio 1.661.
- NVIDIA model card @ 7c0f62c: "reduces the number of bits per parameter from 8 to 4,
  reducing the disk size and GPU memory requirements by approximately 1.66x"; "Only the
  weights and activations of the linear operators within transformer blocks are
  quantized"; quantized with TensorRT Model Optimizer; test hardware B200. Accuracy table
  FP8 / NVFP4: MMLU Pro 0.802 / 0.799, GPQA Diamond 0.849 / 0.835, LiveCodeBench V6
  0.756 / 0.756, SciCode 0.391 / 0.401, AIME 2025 0.934 / 0.923.
- OCP MX v1.0 Table 1 (MXFP8, MXFP6, MXFP4, MXINT8: block 32, E8M0 scale, 8 bits) and
  Table 2 (E4M3 max 448, E5M2 max 57,344); E2M1 max 6.0.
- LLVM APFloat.cpp @ llvmorg-23.1.3 lines 71-105: fltSemantics {maxExponent, minExponent,
  precision, sizeInBits} for half, BFloat, single, double, TF32 {127, -126, 11, 19},
  Float8E4M3FN, Float8E5M2, Float4E2M1FN.
- PTX ISA 9.4: tf32 "same range as .f32 and reduced precision (>=10 bits)"; ".tf32 ...
  mma operation ... requires sm_80 or higher"; tcgen05 `.kind::mxf8f6f4`,
  `.kind::mxf4`, `.kind::mxf4nvf4`.
- Neuron Data Types page: layout table (TF32 1/8/10 and others); no signed INT8 in the
  list (UINT8, INT32, UINT32; INT64 from Trn2); "matrix multiplication [is]
  auto-converted to FP32" for integers; Trn2 and Trn3 inherit the NeuronCore-v2 types.
- HGX page: HGX B300 / B200 FP8/FP6 72 / 72, INT8 3 / 72 POPS (sparse, "Dense is 1/2
  sparse"), FP64 10 / 296 TFLOPS; Rubin per GPU FP8/FP6 training 17.5 PFLOPS and INT8
  250 TOPS, both footnote 2 "Dense specification".
- H200 page: FP8 and INT8 Tensor Core both 3,958 (sparse).
- AMD MI355X page: MXFP4 and MXFP6 10.1 PFLOPs, MXFP8 5 PFLOPs, OCP-FP8 (E5M2, E4M3)
  5 PFLOPs, INT8 5 POPs (all without sparsity).
- Trainium3 architecture page: "2,517 MXFP8/MXFP4 TFLOPS"; Trn2 vs Trn3 table lists
  MXFP4 "Not applicable" for Trainium2. Trn3 page: "Trainium3 supports FP32, BF16,
  MXFP8, and MXFP4 precision modes".
- NVFP4 blog: "4.5 bits per value"; E4M3 fractional scale versus power-of-two; Table 1
  accuracy risk wording for MXFP4 versus NVFP4; 3.5x / 1.8x.
- DeepSeek-V3 report (arXiv HTML v2): "we adopt the E4M3 format on all tensors";
  hybrid prior recipe E4M3 Fprop, E5M2 Dgrad/Wgrad; "the batch size per expert is
  relatively small (usually within 256 tokens), and the bottleneck is memory access
  rather than computation". DeepSeek-V3 config: 256 routed experts, 8 per token.
- arXiv 2509.25149 abstract: 12B model, 10T tokens, NVFP4, comparable to FP8 baseline.
- gpt-oss-120b config, Kimi K2.5 and K3 READMEs, Kimi K2-Thinking config (INT4 group 32),
  DeepSeek-V4-Pro config (`expert_dtype: fp4`) and README (`--kv-cache-dtype fp8`),
  DeepSeek-V4.1-Flash README, MiniMax-M3-MXFP8 config, TensorRT-LLM v1.0.0 notes
  ("Add TRTLLM MoE nvfp4 cubins for mid-high concurrency"), NKI Library release notes
  (kernel list: Blockwise MM Forward MXFP8, MX MoE Block TKG Wrapper), vLLM
  `config/kernel.py` @ v0.31.0 lines 118-141 (`MoEBackend`), clang `amxintrin.h`
  (`_tile_dpbssd`, signed INT8).

## Length

Visible words (rendered `main` at 1440, every disclosure open, nav, Cite badges, SVG
text and code excluded; `/tmp/kl-tools/wc.mjs`): **896 before, 1,206 after (+35%)**.
The first full draft was 1,440; the pass cut it back. Growth by added block, each
required by the register:
- INT8 paragraph under the table (about 65 words): 25.12 WRONG, the de-emphasis needs its
  ratios and the requantize action.
- "Start with the checkpoint" (about 60): 25.3, recommended edit 5.
- KV cache paragraph (about 45): 25.21 STALE.
- MoE rewrite (about 50 more than before): 25.22, 25.23 WRONG, recommended edit 4.
- Accuracy deltas and the 1.66x-versus-1.8x sentence in the Alert (about 40): 25.17,
  recommended edit 1.
- MXFP8 table row (about 20): 25.35 NEW.
- FP4 training sentence (about 22): 25.20.
Cut to pay for it: the "Why this section" narration with section numbers, the
"What still goes wrong" disclosure, the Alert of stack names with the marketing-number
opinion, the "3.5x over FP16" repeat, the two-level-scale disclosure (folded into the
NVFP4 column), and the ladder's notes column.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| 25.1, 25.17 | "690 GB FP8 to 415 GB ... a 1.7x reduction with negligible accuracy loss", cited to the InferenceMAX blog | 690 GB at FP8, 415 GB at NVFP4, about 1.66x; only linear layers in transformer blocks quantized, so under the format's 1.8x; no score moved more than 0.014 (GPQA 0.849 to 0.835, AIME 2025 0.934 to 0.923, MMLU Pro 0.802 to 0.799), measured by NVIDIA | deepseekV32Files, deepseekV32Nvfp4Files (T1 spec); deepseekV32Nvfp4Card (T1 spec, derived, measured) |
| 25.3 | "FP32 master weights, BF16 or FP8 ... FP8 / FP4 / INT8 weights at inference" | kept, plus natively low-bit checkpoints: gpt-oss MXFP4 MoE weights, Kimi K2.5 INT4, Kimi K3 MXFP4 weights / MXFP8 activations by quantization-aware training from SFT onward, DeepSeek-V4-Pro FP4 experts | gptOssConfig, kimiK25Readme, kimiK3Readme, deepseekV4ProConfig (T1) |
| 25.4 | FP64 "All GPUs (HPC paths only)" | "Data-center GPUs. B300 rates 10 TFLOPS per 8-GPU board against B200's 296" | hgxPage (T2) |
| 25.6, 25.28 | TF32 "4 storage / 19 mantissa"; ladder "FP19 mantissa" | 1 + 8 + 10, "19 bits used of 32 stored", FP32 range; NVIDIA from compute capability 8.0, and Trainium | ptxIsa, neuronDataTypes, llvmApFloat (T1; derived for the max) |
| 25.8 | FP8 on "Hopper / Blackwell / Trainium" | Hopper, Blackwell and Rubin, Trainium2 and Trainium3, AMD MI355X | h200Page, hgxPage (T2), neuronDataTypes (T1), mi355xPage (T2) |
| 25.9 | E4M3 "Forward pass", E5M2 "Backward gradients" | E4M3 for weights, activations and, with block scales, every training tensor; E5M2 for gradients in the older hybrid recipe | deepseekV3Report (T2) |
| 25.10, 25.33 | NVFP4 "Blackwell only" (table and ladder) | NVIDIA Blackwell and Rubin; tcgen05 `.kind::mxf4nvf4` on the sm_100 family (CC 10.0, 10.3, 10.7) | nvfp4Blog, hgxPage (T2), ptxIsa, computeCapabilities (T1) |
| 25.11 | MXFP4 "Multi-vendor (OCP)" | NVIDIA Blackwell and Rubin, Trainium3, AMD MI355X; 4.25 bits per value | nvfp4Blog (T2), ptxIsa, trainium3Arch (T1), mi355xPage (T2), ocpMx (T1, derived) |
| 25.12 | INT8 "All silicon (CPU, GPU, Trainium)" | Hopper and B200 at the FP8 rate; B300 at 1/24 of FP8 and Rubin at 1/70; no signed INT8 on Trainium, integer matmuls converted to FP32; MI355X and AMX keep INT8; requantize before B300, Rubin or Trainium | h200Page, hgxPage (T2, derived ratios with like-for-like sparse/dense labels in the note), neuronDataTypes (T1), mi355xPage (T2), clangAmxIntrin (T1) |
| 25.13 | NVFP4 "3.5x over FP16 and 1.8x over FP8" | 4.5 bits per value, about 1.8x smaller than FP8; E4M3 scale fractional | nvfp4Blog (T2) |
| 25.20 | "FP8 forward + FP8 backward training is now standard" | FP8 training holds at scale (DeepSeek-V3, E4M3 on every tensor); 12B model on 10T tokens in NVFP4 matched FP8 baseline | deepseekV3Report (T2); nvfp4Pretraining (T3, measured) |
| 25.21 | "KV-cache quantization (FP8 or INT8) is increasingly common" | DeepSeek's V4-Pro vLLM command uses an FP8 KV cache; V4.1-Flash keeps main KV in FP4 (E2M1, E4M3 per 16 channels), part of reaching 890 bytes per token; evaluate separately | deepseekV4ProReadme, deepseekV41Flash (T1) |
| 25.22, 25.23 | MoE "arithmetic intensity rises by the (k/N) ratio"; "All four levers are multiplicative ... can be compute-bound" | MoE keeps batch-1 intensity, lowers per-expert intensity by k/N; DeepSeek-V3 8 of 256 (1/32); per-expert decode batch "usually within 256 tokens", memory-bound; about 6,600 tokens in flight to give each expert 206 on H200 FP8; size by tokens per expert | deepseekV3Config (T1; derived), deepseekV3Report (T2), h200Page (T2, derived) |
| 25.25 | "AWS Neuron MoE NKI with FP8 on Trn2 UltraServer" | NKI library MoE kernels with MXFP8 variants | nkiLibNotes (T1) |
| 25.26 | "vLLM with FlashInfer FP4 cubins" | vLLM selects FlashInfer MoE kernels through `flashinfer_trtllm` and `flashinfer_cutlass` | vllmKernelConfig (T1). "FP4" dropped: kernel.py names backends, not precisions |
| 25.24 | "NVIDIA Wide-EP with NVFP4 MoE on NVL72" | TensorRT-LLM ships NVFP4 MoE kernels and a wide expert-parallel example | trtllmV100, wideEpExample (T1) |
| 25.27, 25.30-25.32 | Ladder range column "~10^4 dynamic range" (FP16), "~10^4" (E4M3), "~10^15" (E5M2) | Column "Max magnitude": FP64 1.8e308, FP32 / TF32 / BF16 3.4e38, FP16 65,504, E5M2 57,344, E4M3 448, E2M1 6 (MX and NVFP4 "x scale") | llvmApFloat (T1, derived), ocpMx (T1) |
| 25.35 | (absent) | MXFP8 row (table and ladder): Blackwell and Rubin, Trainium3, MI355X; Trainium3's 8-bit mode; MiniMax-M3-MXFP8 checkpoint; 8.25 bits | ptxIsa (T1), trn3Page, mi355xPage (T2), minimaxM3Mxfp8 (T1), ocpMx (T1, derived) |

CORRECT claims kept and re-cited: 25.2 (mechanism, uncited, no number, derived),
25.5, 25.7, 25.14 (tcgen05), 25.15, 25.16 (gpt-oss MXFP4, now in the checkpoint
paragraph), 25.18 (16 codes), 25.19 (16 or 32), 25.29, 25.34.

## Claims removed

- "Section 3 listed precision ... Section 23 (MoE) showed ..." intro: section numbers and
  page narration.
- "the marketing number for each generation tends to be one single-axis improvement, but
  the deployed wins compound": unsourced opinion.
- "FP4 inference is generally safe for stable open-weights models ...; less safe for models
  with unusual activation distributions or extreme weight outliers": no source; replaced by
  the validate-on-your-own-evaluation action.
- "attention scores are sensitive to dynamic range across the KV": no source; the action
  (evaluate KV precision separately) stays.
- "For MoE specifically that footprint reduction means fewer GPUs needed for EP": the MoE
  composition paragraph now carries MoE; NvidiaBlackwell keeps the footprint sentence.
- "Older inference deployments" (FP16 where-it-ships): not a hardware fact.
- No CUT candidates were listed for this section.

## UNKNOWNs

None in the register for section 25. Hedges kept at their scope: KV FP8 is stated as
DeepSeek's V4-Pro command, not as an industry default; Neuron's silence on signed INT8 is
stated as "Neuron lists no signed INT8 type"; NVIDIA's accuracy is stated as NVIDIA's
recipe on NVIDIA's benchmarks.

## NEW content and sources

- INT8 ratios across generations (hgxPage, h200Page, mi355xPage, neuronDataTypes,
  clangAmxIntrin).
- Natively low-bit checkpoints (gptOssConfig, kimiK25Readme, kimiK3Readme,
  deepseekV4ProConfig).
- MXFP8 row and ladder rung (ocpMx, ptxIsa, trn3Page, mi355xPage, minimaxM3Mxfp8).
- Ridge-moves-with-precision: H200 206 at BF16, 412 at FP8, so both reach compute-bound at
  about 206 tokens per weight read (h200Page, derived; matches the ridge table and the
  Roofline section's own derivation).
- The 1.66x versus 1.8x explanation (deepseekV32Nvfp4Card, derived note).

## Diagram

`PrecisionLadder.tsx` rebuilt: `viewBox="0 0 880 482"` (computed), `role="img"`,
`aria-labelledby="precision-ladder-title"` with an asserting `<title>`, no `aria-label`,
full-bleed white rect, Idiom A classes prefixed `pl-`, fonts 11 to 13px sans-serif,
`minWidth: 640` inside an `overflowX: auto` wrapper (same mobile treatment as
BlackwellDieDiagram and FlashTierLadder). Ten rungs drawn at one scale (6 units per bit):
sign / exponent / mantissa segments, an amber amortized block-scale segment for MXFP8,
NVFP4 and MXFP4, and a dashed "stored but unused" outline for TF32. Columns: layout,
bytes, max magnitude. Every number is cited in the caption under the SVG.

Rendered check (`scripts/shoot.mjs`, build in `/tmp/silicon-dist-quantization`): probe
"1 SVG diagram(s), 0 React Flow, ok" at 1440 and 390 (no overlaps, no clipping, no
page-level horizontal overflow). Read the PNGs: at 1440 every label sits clear of the bars
and columns; the FP64 "64 bits" label sits inside its bar so it does not reach the layout
column. At 390 the SVG scrolls sideways inside its wrapper and stays legible; the format
table scrolls horizontally inside the Cloudscape table.

## Leverage pass: claim-set diff

New assertions in the after, each with its source:
1. DeepSeek-V3.2 checkpoint sizes and 1.66x: deepseekV32Files, deepseekV32Nvfp4Files, deepseekV32Nvfp4Card.
2. Only linear layers in transformer blocks quantized; therefore under 1.8x: deepseekV32Nvfp4Card (derived note).
3. NVIDIA-measured scores: deepseekV32Nvfp4Card (measured).
4. Bit layouts and maxima: llvmApFloat (derived), neuronDataTypes, ocpMx.
5. NVFP4 4.5 bits, fractional E4M3 scale, MXFP4 higher accuracy risk (vendor-claim): nvfp4Blog.
6. MX 0.25 bits per value, 4.25 and 8.25 bits: ocpMx (derived).
7. TF32 from sm_80; tcgen05 block-scaled kinds; sm_100 family covers 10.7: ptxIsa, computeCapabilities.
8. Format support per chip: h200Page, hgxPage, neuronDataTypes, trainium3Arch, trn3Page, mi355xPage, clangAmxIntrin.
9. FP64 10 vs 296 TFLOPS: hgxPage.
10. INT8 1/24 (B300), 1/70 (Rubin), equal on H200, B200, MI355X: hgxPage, h200Page, mi355xPage (derived ratios).
11. Neuron: no signed INT8, integer matmuls to FP32: neuronDataTypes.
12. DeepSeek-V3 E4M3 on all tensors, hybrid E5M2 recipe, per-expert batch quote: deepseekV3Report.
13. 8 of 256 experts: deepseekV3Config. 6,600 tokens: derived (206 x 256 / 8).
14. H200 dense ridges 206 and 412, batch 206 both: h200Page (derived).
15. 12B on 10T tokens in NVFP4: nvfp4Pretraining (measured, T3).
16. Native low-bit checkpoints: gptOssConfig, kimiK25Readme, kimiK3Readme, deepseekV4ProConfig, minimaxM3Mxfp8.
17. KV FP8 and FP4, 890 bytes per token: deepseekV4ProReadme, deepseekV41Flash.
18. TensorRT-LLM NVFP4 MoE kernels, wide_ep example; NKI MXFP8 MoE kernels; vLLM FlashInfer backends: trtllmV100, wideEpExample, nkiLibNotes, vllmKernelConfig.

Guidance sentences (requantize INT8 before B300/Rubin/Trainium; size MoE decode by tokens
per expert; validate on your own evaluation; evaluate KV precision separately; start from
a stack that combines the levers) are actions drawn from items 10, 11, 13, 3 and 17-18;
they add no facts.

## For the orchestrator

- Tier conflict to rule on: `https://arxiv.org/abs/2412.19437` (DeepSeek-V3 report) is
  Tier 2 / DeepSeek-AI in ThesisAndFraming.ts and FlashCacheTier.ts; I kept Tier 2 for
  URL consistency, though the brief grades arXiv papers Tier 3. The new arXiv record
  (`nvfp4Pretraining`, 2509.25149) is Tier 3 / arXiv per the brief.
- New URLs other sections may reuse: OCP MX v1.0 spec (T1), Neuron Data Types (T1),
  AMD MI355X page (T2), the two DeepSeek-V3.2 Hugging Face trees and the NVIDIA card
  (T1), NKI Library release notes (T1), vLLM kernel.py at v0.31.0 (T1).
- Glossary acronyms used here: FP64, FP32, TF32 (TensorFloat-32), BF16 (bfloat16), FP16,
  FP8, E4M3, E5M2, E2M1, E8M0, MX / MXFP8 / MXFP4 (OCP Microscaling), OCP (Open Compute
  Project), NVFP4, INT8, INT4, HBM, KV, MoE, HPC, AMX (Advanced Matrix Extensions), NKI
  (Neuron Kernel Interface), SFT is spelled out (supervised fine-tuning).
- Cross-links by name: Roofline and Arithmetic Intensity, KV Cache and FlashAttention,
  Mixture of Experts and Sparse Activation. The MoE section should state the same
  k/N per-expert intensity model (register items 23.6, 23.60 coordinate with 25.22).
- CapitalMarketsLens.tsx:473 still refers to this section as "Section 25".
