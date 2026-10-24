# Verification: Quantization and Precision

Verified: 2026-10-23. Claims checked: 60 (sampled: 0; every claim in the list was opened
against its source). Confirmed 54, wrong 0, unsupported 6, mislabelled 0, unverifiable 0.

## Gate 3 score: 8/10

Every vendor figure, format constant and checkpoint fact checked out against its source. No
number was wrong. The six failures were three Rubin attributions resting on pages that never
name Rubin, two paraphrases of DeepSeek-V3's "all tensors" that dropped its FP8 scope, and one
"matched" that the NVFP4 pretraining abstract only calls "comparable". All six are fixed. The
section gives the reader a working model (exponent bits buy range, mantissa bits buy resolution,
a shared block scale gives the range back; the ridge moves with the math precision; MoE lowers
per-expert intensity by k/N) and concrete actions (check the matrix units, requantize INT8
before B300, Rubin or Trainium, evaluate KV precision separately). Economy and shape hold it at
8: INT8 is told twice, 1.8x lands three times, and no supporting evidence is demoted.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 54 of 60 confirmed on first read. The 6 unsupported were citation or scope gaps (Rubin = 10.7 x3, DeepSeek "every tensor" x2, "matched"), all fixed. No load-bearing figure was wrong. |
| Mental model or practical value | 9 | Ladder (range vs resolution), block scaling, ridge-moves-with-precision (206 / 412 FP/B, both at 206 tokens), MoE k/N per-expert intensity, and five actions in "Choosing a precision". The weakest block is "Start from a stack that combines the levers": a kernel inventory that tells the reader where to start but not how to choose. |
| Shape | 7 | Introduces quantization before the ladder. The h2 descriptions state the payoff ("Check that the target chip runs your format..."). The strongest number (690 GB to 415 GB, 1.66x) lands twice, in the intro and the Alert. No ExpandableSection: the accuracy deltas and the kernel list sit inline. It ends on a kernel list, not on the reader's strongest action. |
| Writing | 8 | no-ai-tells passes. Attribution in sentences is load-bearing: "NVIDIA rates its risk..." (vendor-claim strength), "Neuron lists no signed INT8 type" (silence), "Measured by NVIDIA" (source grade). Things are defined by what they are. |
| Economy | 7 | +35% (896 to 1,206 words, author's count; my fixes add about 8). INT8 is stated in the table row and again in the paragraph under it. "1.8x" appears in the NVFP4 column, the Alert and the composition paragraph. Each added block answers a register correction, but the INT8 table cell could drop to "see below" (Backlog). |
| Diagrams | 8 | PrecisionLadder: `role="img"`, `aria-labelledby` with an asserting `<title>`. Probe "ok" at 1440 and 390. At 1440 no overlap. At 390 it scrolls sideways inside its wrapper (minWidth 640) and text renders at about 8 px. Not changed in this pass. |

## Claims

Source text quoted from fetches made 2026-10-23 unless noted.

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | DeepSeek-V3.2 takes 690 GB at FP8 (intro, Alert) | deepseekV32Files | CONFIRMED | HF tree API at a7e62ac: 163 safetensors, 689,483,049,129 bytes (689.48 GB). config.json: `"quant_method": "fp8"`, `"fmt": "e4m3"` | - |
| 2 | 415 GB at NVFP4 | deepseekV32Nvfp4Files | CONFIRMED | HF tree API at 7c0f62c: 163 safetensors, 415,061,565,152 bytes (415.06 GB) | - |
| 3 | a 1.66x cut / about 1.66x | deepseekV32Nvfp4Card | CONFIRMED | "reducing the disk size and GPU memory requirements by approximately 1.66x" (card l.103) | - |
| 4 | Only linear layers in transformer blocks quantized, so under 1.8x; 689.5 / 415.1 = 1.66, 8 / 4.5 = 1.78 (derived) | deepseekV32Nvfp4Card | CONFIRMED | "Only the weights and activations of the linear operators within transformer blocks are quantized." 689.48 / 415.06 = 1.661; 8 / 4.5 = 1.778 | - |
| 5 | No score moved more than 0.014: GPQA 0.849 to 0.835, AIME 2025 0.934 to 0.923, MMLU Pro 0.802 to 0.799; note LiveCodeBench 0.756 both, SciCode 0.391 to 0.401 (measured) | deepseekV32Nvfp4Card | CONFIRMED | Eval table FP8 / NVFP4: 0.802/0.799, 0.849/0.835, 0.756/0.756, 0.391/0.401, 0.934/0.923. Largest move 0.014 | - |
| 6 | Note: B200, temperature 1.0, top_p 0.95 | deepseekV32Nvfp4Card | CONFIRMED | "**Test Hardware:** B200"; "Benchmarked with temperature=1.0, top_p=0.95" | - |
| 7 | Recipe: TensorRT Model Optimizer, linear layers only | deepseekV32Nvfp4Card | CONFIRMED | "quantized using the TensorRT Model Optimizer" (l.19) | - |
| 8 | FP64: B300 10 TFLOPS per 8-GPU board against B200's 296 | hgxPage | CONFIRMED | "FP64/FP64 Tensor Core: 10 TFLOPS / 296 TFLOPS"; "Form Factor 8x NVIDIA Blackwell Ultra SXM / 8x NVIDIA Blackwell SXM" | - |
| 9 | TF32 from compute capability 8.0; FP32 range, 10-bit mantissa | ptxIsa | CONFIRMED | ".tf32 alternate floating point type mma operation with .m16n8k4 and .m16n8k8 shapes requires sm_80 or higher"; "same range as .f32 and reduced precision (>=10 bits)" | - |
| 10 | TF32, BF16, FP16, FP32 on Trainium | neuronDataTypes | CONFIRMED | NeuronCore v2 list: "32 and 16-bit Floating Point (FP32 / FP16)", "TensorFloat-32 (TF32)", "Brain Floating Point (BFloat16)" | - |
| 11 | BF16 on x86 CPUs with AMX (TDPBF16PS) | clangAmxIntrin | CONFIRMED | "This intrinsic corresponds to the TDPBF16PS instruction" (amxintrin.h l.218, llvmorg-23.1.3) | - |
| 12 | FP8 on Hopper | h200Page | CONFIRMED | "FP8 Tensor Core²: 3,958 TFLOPS"; "2 With sparsity." | - |
| 13 | FP8 on Blackwell and Rubin | hgxPage | CONFIRMED | "FP8/FP6 Tensor Core²: 72 PFLOPS" (B300, B200); Rubin GPU "FP8/FP6 Training²: 17.5 PFLOPS" | - |
| 14 | FP8 on Trainium2 and Trainium3 | neuronDataTypes | CONFIRMED | FP8_e5m2 / FP8_e4m3 / FP8_e3m4 in the NeuronCore v2 table; "Trn2 supports all of the data types available on NeuronCore v2"; "Trn3 supports all of the data types available on NeuronCore v3". Also trainium3Arch "FP8 (TFLOPS) 1299 / 2517" | - |
| 15 | FP8 on AMD MI355X | mi355xPage | CONFIRMED (archived copy) | "Peak Open Compute Project Eight-bit Precision Matrix (OCP-FP8) Performance (E5M2, E4M3) 5 PFLOPs" (Wayback 2026-09-11; live page timed out, see Checks) | - |
| 16 | FP8 use: "E4M3 for weights, activations and, with block scales, every training tensor" | deepseekV3Report | UNSUPPORTED (scope) | "we adopt the E4M3 format on all tensors" refers to FP8 GEMM inputs; the same section says "most compute-density operations are conducted in FP8, while a few key operations are strategically maintained in their original data formats" | "every FP8 training tensor" |
| 17 | E5M2 for gradients in the older hybrid recipe | deepseekV3Report | CONFIRMED | "the hybrid FP8 format adopted by prior work ..., which uses E4M3 ... in Fprop and E5M2 ... in Dgrad and Wgrad" | - |
| 18 | MXFP8 on Blackwell and Rubin; note "sm_100 family covers 10.0, 10.3 and 10.7 (Rubin)" on ptxIsa | ptxIsa | UNSUPPORTED (Rubin) | PTX 9.4 tcgen05.mma Target ISA Notes: "sm_100f or higher in the same family"; kinds `.kind::mxf8f6f4`, `.kind::mxf4`, `.kind::mxf4nvf4`. PTX names no GPU for sm_107 ("Adds support for sm_107 target architecture"). CC appendix Table 28: "compute_100f 10.0 10.3 10.7", no "Rubin" string on the page. CUTLASS 4.8.0: "Added initial Rubin support (SM107)" | ptxIsa note now quotes the family rule; computeCapabilities and cutlassChangelog cites added |
| 19 | MXFP8 on Trainium3; "Trainium3's 8-bit mode" | trn3Page | CONFIRMED | "Trainium3 supports FP32, BF16, MXFP8, and MXFP4 precision modes" | - (tension noted for the orchestrator) |
| 20 | MXFP8 on MI355X | mi355xPage | CONFIRMED (archived copy) | "Peak Microscaling Eight-bit Precision Matrix (MXFP8) Performance 5 PFLOPs" | - |
| 21 | MiniMax-M3-MXFP8 checkpoint | minimaxM3Mxfp8 | CONFIRMED | config.json at c5454eb: `"quant_method": "mxfp8"`, `"weight_block_size": [1, 32]` | - |
| 22 | NVFP4 on NVIDIA Blackwell and Rubin | nvfp4Blog, hgxPage | CONFIRMED | Blog: NVFP4 introduced "with the NVIDIA Blackwell GPU architecture". HGX Rubin GPU: "NVFP4 Inference 50 PFLOPS", "NVFP4 Training² 35 PFLOPS" | - |
| 23 | NVFP4 use: NVIDIA's own checkpoints | deepseekV32Nvfp4Card | CONFIRMED | "The NVIDIA DeepSeek-V3.2-NVFP4 model is a quantized version of DeepSeek AI's DeepSeek-V3.2" | - |
| 24 | MXFP4 on NVIDIA Blackwell and Rubin | nvfp4Blog, ptxIsa | UNSUPPORTED (Rubin) | Blog Table 1 covers "Blackwell-supported" formats and names no Rubin. ptxIsa `.kind::mxf4` on the sm_100f family; Rubin = SM107 only in the CUTLASS changelog | ptxIsa note quotes the family rule; computeCapabilities and cutlassChangelog cites added |
| 25 | MXFP4 on Trainium3 (not Trainium2) | trainium3Arch | CONFIRMED | "2,517 MXFP8/MXFP4 TFLOPS"; table "MXFP4 (TFLOPS) \| Not applicable \| 2517" | - |
| 26 | MXFP4 on MI355X | mi355xPage | CONFIRMED (archived copy) | "Peak Microscaling Four-bit Precision Matrix (MXFP4) Performance 10.1 PFLOPs" | - |
| 27 | gpt-oss ships MoE weights in MXFP4; attention, router, embeddings, lm_head unconverted | gptOssConfig | CONFIRMED | config.json at b5c939d: `"quant_method": "mxfp4"`, `"modules_to_not_convert": ["model.layers.*.self_attn", "model.layers.*.mlp.router", "model.embed_tokens", "lm_head"]` | - |
| 28 | Kimi K3 MXFP4 weights, MXFP8 activations, quantization-aware trained from SFT onward | kimiK3Readme | CONFIRMED | "Kimi K3 applies quantization-aware training from the SFT stage onward, using MXFP4 weights with MXFP8 activations" (README §4, f831ab6) | - |
| 29 | INT8: Hopper and B200 at the FP8 rate | h200Page, hgxPage | CONFIRMED | H200: "FP8 Tensor Core² 3,958 TFLOPS", "INT8 Tensor Core² 3,958 TFLOPS". HGX B200: "INT8 Tensor Core² 72 POPS", FP8 72 PFLOPS | - |
| 30 | B300 at 1/24 of FP8, Rubin at 1/70 (derived, like-for-like labels) | hgxPage | CONFIRMED | B300 "INT8 Tensor Core² 3 POPS" vs FP8 72 PFLOPS, both footnote 2 (sparse): 72 / 3 = 24. Rubin "INT8² 250 TOPS" vs "FP8/FP6 Training² 17.5 PFLOPS", both "Dense specification": 17,500 / 250 = 70. PTX agrees: `.kind::i8` is listed only for sm_100a / sm_110a | - |
| 31 | Note: "INT8 3,958 TOPS and FP8 3,958 TFLOPS, both with sparsity" | h200Page | CONFIRMED | Page prints the INT8 row in "TFLOPS"; the number and the sparsity footnote match | - |
| 32 | Neuron lists no signed INT8 and converts integer matmuls to FP32 | neuronDataTypes | CONFIRMED | Types: "Unsigned 8-bit integer (UINT8)", "32-bit signed and unsigned integer (INT32 and UINT32)"; "Some operations lack a native integer datapath: ... matrix multiplication" "auto-converted to FP32" | - |
| 33 | MI355X: 5 POPs INT8 and 5 PFLOPs OCP-FP8, both without sparsity | mi355xPage | CONFIRMED (archived copy) | "Peak INT8 Matrix Performance 5 POPs"; "... with Structured Sparsity 10.1 POPs"; OCP-FP8 5 / 10.1 | - |
| 34 | AMX TDPBSSD: signed 8-bit dot product into 32-bit accumulators | clangAmxIntrin | CONFIRMED | "Multiply groups of 4 adjacent pairs of signed 8-bit integers in src0 with corresponding signed 8-bit integers in src1, producing 4 intermediate 32-bit results" (l.136-143) | - |
| 35 | Ladder layouts FP64 1+11+52 ... FP8 E4M3 1+4+3 | llvmApFloat, neuronDataTypes | CONFIRMED | APFloat.cpp l.71-105: half {15, -14, 11, 16}, BFloat {127, -126, 8, 16}, single {127, -126, 24, 32}, double {1023, -1022, 53, 64}, TF32 {127, -126, 11, 19}; Neuron table FP32 1/8/23, TF32 1/8/10, BF16 1/8/7, FP16 1/5/10, e5m2 1/5/2, e4m3 1/4/3 | - |
| 36 | Ladder maxima FP64 1.8e308, FP32 / TF32 / BF16 3.4e38, FP16 65,504 (derived) | llvmApFloat | CONFIRMED | (2 - 2^-52) x 2^1023 = 1.797e308; (2 - 2^-23) x 2^127 = 3.403e38; (2 - 2^-10) x 2^127 = 3.401e38; (2 - 2^-7) x 2^127 = 3.39e38; (2 - 2^-10) x 2^15 = 65,504 | - |
| 37 | E4M3 max 448, E5M2 max 57,344 | ocpMx | CONFIRMED | Table 2 (p.11): "Max normal S 1111 110 = ± 2^8 x 1.75 = ± 448"; "S 11110 11 = ± 2^15 x 1.75 = ± 57,344" | - |
| 38 | E2M1: 16 codes, largest value 6 | ocpMx | CONFIRMED | FP4 table (p.12): "Max normal S 11 1 = ± 2^2 x 1.5 = ± 6.0"; 4 bits = 16 codes | - |
| 39 | MX block of 32 with one 8-bit E8M0 scale (MXFP8, MXFP4) | ocpMx | CONFIRMED | Table 1 (p.10): MXFP8 "8 \| 32 \| E8M0 \| 8"; MXFP4 "FP4 (E2M1) \| 4 \| 32 \| E8M0 \| 8" | - |
| 40 | MXFP4 4.25 bits, MXFP8 8.25 bits; ladder bytes 1.03, 0.56, 0.53 (derived) | ocpMx, nvfp4Blog | CONFIRMED | 4 + 8/32 = 4.25; 8 + 8/32 = 8.25; 8.25/8 = 1.031; 4.5/8 = 0.5625; 4.25/8 = 0.531 | - |
| 41 | NVFP4: one E4M3 scale per 16 values plus FP32 per tensor, 4.5 bits per value | nvfp4Blog | CONFIRMED | "applies a fine-grained E4M3 scaling factor to each 16-value micro-block"; "a second-level FP32 scalar per tensor"; "one FP8 scale per 16 values (4.5 bits per value)" | - |
| 42 | NVFP4 about 1.8x smaller than FP8 (column, composition paragraph) | nvfp4Blog | CONFIRMED | "approximately 3.5x relative to FP16" and about 1.8x compared to FP8 | - |
| 43 | E4M3 scale can be fractional, fits tighter than power-of-two | nvfp4Blog | CONFIRMED | E8M0 "Snaps the scale factor to nearest 2^n"; E4M3 fits a fractional scale per block, lowering rounding error | - |
| 44 | NVIDIA rates MXFP4's accuracy-drop risk vs FP8 higher than NVFP4's (vendor-claim) | nvfp4Blog | CONFIRMED | Table 1: MXFP4 "Risk of noticeable accuracy drop compared to FP8"; NVFP4 "Lower risk of noticeable accuracy drop particularly for larger models" | - |
| 45 | MXFP4 runs on NVIDIA Blackwell (4-bit section) | nvfp4Blog | CONFIRMED | Table 1 titled for "Blackwell-supported" formats, MXFP4 included | - |
| 46 | NVFP4 via tcgen05.mma `.kind::mxf4nvf4` on Blackwell and Rubin; note "10.0, 10.3 and 10.7 (Rubin)" on computeCapabilities | ptxIsa, computeCapabilities | UNSUPPORTED (Rubin) | Kind and family rule confirmed (row 18); CC appendix lists 10.7 but names no GPU | Note restated to what the page says; cutlassChangelog cite added |
| 47 | DeepSeek-V3 used E4M3 "on every tensor", tile- and block-wise scaling | deepseekV3Report | UNSUPPORTED (scope) | As row 16; "we adopt the E4M3 format on all tensors for higher precision. We attribute the feasibility ... to our fine-grained quantization strategy, i.e., tile and block-wise scaling" | "on every FP8 tensor, gradients included" |
| 48 | 12B model on 10T tokens in NVFP4 "matched" its FP8 baseline (measured, Tier 3) | nvfp4Pretraining | UNSUPPORTED (wording) | Abstract (v2): "training a 12-billion-parameter model on 10 trillion tokens"; "achieves training loss and downstream task accuracies comparable to an FP8 baseline" | "reached loss and downstream accuracy comparable to its FP8 baseline" |
| 49 | FP8 to NVFP4 cuts bytes per weight about 1.8x (derived, 8 vs 4.5 bits) | nvfp4Blog | CONFIRMED | 8 / 4.5 = 1.78 | - |
| 50 | H200 dense ridge 206 FLOP/B at BF16, 412 at FP8; both compute-bound at about 206 tokens (derived) | h200Page | CONFIRMED | BF16 1,979 and FP8 3,958 TFLOPS "With sparsity", 4.8 TB/s. 989.5 / 4.8 = 206.1; 1,979 / 4.8 = 412.3; intensity B (BF16) and 2B (FP8) reach the ridge at B = 206. The H200 page itself does not state "dense is half"; the HGX page states it for Blackwell ("Dense is ½ sparse spec shown") | - |
| 51 | DeepSeek-V3 routes each token to 8 of 256 routed experts, 1/32 | deepseekV3Config | CONFIRMED | config.json at e815299: `"num_experts_per_tok": 8`, `"n_routed_experts": 256` | - |
| 52 | Per-expert decode batches "usually within 256 tokens", bound by memory access | deepseekV3Report | CONFIRMED | "the batch size per expert is relatively small (usually within 256 tokens), and the bottleneck is memory access rather than computation" (§3.4.2) | - |
| 53 | About 6,600 tokens in flight per step (derived) | deepseekV3Config | CONFIRMED | 206 x 256 / 8 = 6,592 | - |
| 54 | Kimi K2.5 native INT4 | kimiK25Readme | CONFIRMED | "## 4. Native INT4 Quantization"; "Kimi-K2.5 adopts the same native int4 quantization method as Kimi-K2-Thinking" (4d01dfe) | - |
| 55 | DeepSeek-V4-Pro stores its experts in FP4 | deepseekV4ProConfig | CONFIRMED | config.json at 72e1d32: `"expert_dtype": "fp4"` | - |
| 56 | DeepSeek's vLLM command for V4-Pro serves an FP8 KV cache | deepseekV4ProReadme | CONFIRMED | "vllm serve deepseek-ai/DeepSeek-V4-Pro-0813 \ --trust-remote-code --kv-cache-dtype fp8" (README l.105-106) | - |
| 57 | V4.1-Flash: FP4 main KV (E2M1, one E4M3 scale per 16 channels), 890 bytes per token | deepseekV41Flash | CONFIRMED; scope tightened | "Combined with FP4 main KV caching (E2M1 format, one E4M3 scale per 16 channels), these designs reduce the global KV cache footprint to 890 bytes per token" | "brings its global KV cache to 890 bytes per token" |
| 58 | TensorRT-LLM ships NVFP4 MoE kernels | trtllmV100 | CONFIRMED | v1.0.0 (published 2025-09-24): "Add TRTLLM MoE nvfp4 cubins for mid-high concurrency" | - |
| 59 | TensorRT-LLM wide expert-parallel example | wideEpExample | CONFIRMED | examples/wide_ep at v1.2.1: README.md, ep_load_balancer, slurm_scripts | - |
| 60 | NKI library MoE kernels with MXFP8 variants; vLLM `flashinfer_trtllm` and `flashinfer_cutlass` MoE backends | nkiLibNotes, vllmKernelConfig | CONFIRMED | NKI 2.32.0 "Blockwise MM Forward MXFP8", 2.30.0 "MX MoE Block TKG Wrapper". vLLM kernel.py at v0.31.0 l.118-141 `MoEBackend = Literal[...]` includes "flashinfer_trtllm", "flashinfer_cutlass" | - |

Pins and tiers: every Hugging Face URL is pinned to a revision SHA and every GitHub URL to a
tag (pinned-refs gate passes). All 30 records carry the same title, publisher and tier as the
same URL in other source files (scripted cross-file check). deepseekV3Report is Tier 2 as a
vendor technical report, consistent with six other files. nvfp4Pretraining is Tier 3
`measured`, per the paper rule.

## ORCH-NOTES items

- **"10.7 (Rubin)" cited to a page that never names Rubin.** CONFIRMED as a gap and fixed. The
  CC appendix has no "Rubin" string (re-fetched 2026-10-23). It lists 10.7 under compute_100f.
  PTX ISA 9.4 names only the sm_107 target. I reused NVIDIA Blackwell's `cutlassChangelog`
  record (same key, title, URL, tier, accessed 2026-10-16). CUTLASS 4.8.0 says "Added initial
  Rubin support (SM107)". It is now cited at all three Rubin = 10.7 points: the MXFP8 row, the
  MXFP4 row (where Rubin had no Rubin-naming cite at all) and the NVFP4 paragraph.
- **AMD MI355X (BF16 2.5 PFLOPS dense).** CONFIRMED, no change. The live amd.com page could not
  be fetched today: curl exit 92 and then 28, and WebFetch timed out. I used the Wayback copy
  of 2026-09-11 (`https://web.archive.org/web/20260911232808/https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html`).
  MXFP4 10.1, MXFP6 10.1, MXFP8 5, OCP-FP8 5 (10.1 sparse) PFLOPs, INT8 5 (10.1 sparse) POPs
  and BF16 2.5 (5 sparse) PFLOPs all match the Roofline verifier's 2026-10-18 live read. This
  section claims BF16 "All current GPUs" and makes no MI355X BF16 figure or silence claim, so
  the Roofline correction does not apply here.
- **Format facts.** CONFIRMED. E4M3 448 and E5M2 57,344 (OCP MX v1.0 Table 2, p.11). MX block
  of 32 with an 8-bit E8M0 scale (Table 1, p.10), so 4.25 bits for MXFP4. NVFP4 uses one E4M3
  scale per 16 values plus an FP32 per-tensor scale, 4.5 bits (NVFP4 blog).
- **Per-chip precision support.** CONFIRMED for every chip named, with three Rubin citations
  added. Hopper: h200Page. Blackwell and Rubin: hgxPage, plus ptxIsa, computeCapabilities and
  cutlassChangelog. Trainium2/3 FP8: Neuron data types by inheritance ("Trn2 supports all of
  the data types available on NeuronCore v2"; "Trn3 supports all of the data types available
  on NeuronCore v3"); trainium3Arch also gives FP8 1,299 / 2,517 TFLOPS. Trainium MX:
  the Neuron data-types page never mentions MXFP8 or MXFP4. The section cites trn3Page and
  trainium3Arch for those, correctly, and trainium3Arch marks MXFP4 "Not applicable" on
  Trainium2. MI355X: row 15 and the AMD item above. x86 AMX: clangAmxIntrin. Graviton: the
  section makes no Graviton claim, so there was nothing to check.
- **DeepSeek-V3 FP8, Kimi K2.5 INT4, gpt-oss MXFP4, checkpoint sizes.** CONFIRMED at the pinned
  revisions: rows 1-3, 27, 51, 54. The DeepSeek-V3 FP8 paraphrase lost the report's FP8 scope
  (rows 16, 47); both fixed. The shared records (deepseekV32Files, deepseekV32Nvfp4Files,
  deepseekV32Nvfp4Card, deepseekV3Config, gptOssConfig, kimiK3Readme, deepseekV4ProConfig) agree
  with the MoE verification's reads.
- **Length +35%.** Economy 7. Each added block maps to a register correction (author report),
  and the cut list was real. The remaining redundancy is INT8 told twice (table cell and
  paragraph) and 1.8x told three times; cut candidates are in the Backlog. It does not hold the
  section under 7.

## Fixes applied

1. `src/sources/QuantizationAndPrecision.ts:49`: added the `cutlassChangelog` record, copied
   from `src/sources/NvidiaBlackwell.ts` (title "CUTLASS CHANGELOG at tag v4.8.0", NVIDIA,
   `https://github.com/NVIDIA/cutlass/blob/v4.8.0/CHANGELOG.md`, Tier 1, accessed 2026-10-16).
2. `src/sections/QuantizationAndPrecision.tsx:92-97` (MXFP8 row): ptxIsa note before "tcgen05.mma
   .kind::mxf8f6f4. tcgen05 targets the sm_100 family, which covers compute capability 10.0, 10.3
   and 10.7 (Rubin)." After "tcgen05.mma .kind::mxf8f6f4; tcgen05.mma is supported on 'sm_100f or
   higher in the same family'." Added `computeCapabilities` ("Family target compute_100f runs on
   compute capability 10.0, 10.3 and 10.7.") and `cutlassChangelog` ("4.8.0: Added initial Rubin
   support (SM107).") cites.
3. `:132-134` (MXFP4 row): ptxIsa note extended with the same family quote; added the same
   computeCapabilities and cutlassChangelog cites.
4. `:296-297` (NVFP4 paragraph): computeCapabilities note before "tcgen05 builds for the sm_100
   family run on compute capability 10.0, 10.3 and 10.7 (Rubin)." After "Family target
   compute_100f runs on compute capability 10.0, 10.3 and 10.7."; added the cutlassChangelog
   cite.
5. `:81` (FP8 row): "every training tensor" became "every FP8 training tensor".
6. `:219-220`: "used E4M3 (...) on every tensor, with tile- and block-wise scaling." became "used
   E4M3 (...) on every FP8 tensor, gradients included, with tile- and block-wise scaling."
7. `:222`: "in NVFP4 matched its FP8 baseline in loss and downstream accuracy." became "in NVFP4
   reached loss and downstream accuracy comparable to its FP8 baseline."
8. `:412-413`: "part of what brings it to 890 bytes per token." became "part of what brings its
   global KV cache to 890 bytes per token."

No change to `src/components/PrecisionLadder.tsx`.

## Checks

- `pnpm exec tsc --noEmit 2>&1 | grep -E "QuantizationAndPrecision|PrecisionLadder|sources/QuantizationAndPrecision" || echo ...`: "no type errors in my files" (exit 0).
- `pnpm exec eslint src/sections/QuantizationAndPrecision.tsx src/sources/QuantizationAndPrecision.ts src/components/PrecisionLadder.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t QuantizationAndPrecision`: 1 passed, 34 skipped (exit 0).
- Gates from the repo root: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0, pre-overflow exit 0. No hits for QuantizationAndPrecision or PrecisionLadder in any output.
- `pnpm exec vite build --outDir /tmp/vf-QuantizationAndPrecision-dist --emptyOutDir`: exit 0. `node scripts/shoot.mjs --sections quantization --widths 1440,390 ...`: "1 SVG diagram(s), 0 React Flow, ok" at both widths (exit 0). PNGs read: no overlap at 1440. At 390 the ladder scrolls sideways inside its wrapper and the format table wraps.
- Network: every request used WebFetch or curl's default User-Agent, with no personal data. The amd.com page failed (curl exit 92, then 28; WebFetch timeout), so I used the Wayback copy.

## For the orchestrator

- **Trainium3 FP8 versus MXFP8.** The Neuron data-types page says Trn3 inherits the FP8 types
  (E4M3, E5M2, E3M4). The Trn3 product page lists only "FP32, BF16, MXFP8, and MXFP4 precision
  modes". trainium3Arch gives "FP8 (TFLOPS) 2517", the same as its MXFP8/MXFP4 figure. This
  section says both "Trainium3 runs FP8" and "MXFP8 is Trainium3's 8-bit mode", each correctly
  cited. Any section stating Trn3's 8-bit format or rate should name which AWS page it follows.
- **MI355X live page.** amd.com did not answer curl or WebFetch on 2026-10-23. The Wayback
  snapshot above matches the 2026-10-18 live read, so verifiers can use it.
- **DeepSeek-V3 "E4M3 on all tensors".** No other section paraphrases it as "every tensor"
  (grep). Any future reuse should keep the FP8-GEMM scope.
- **H200 INT8 unit.** NVIDIA's H200 page prints the INT8 row in "TFLOPS". Sections that quote
  "3,958 TOPS" are right on the number but not on NVIDIA's label. No change needed.
- **Still open from the author's report.** The CapitalMarketsLens "Section 25" reference is gone
  (grep finds none). The arXiv tier question for 2412.19437 is settled by the brief's "vendor
  technical reports" Tier 2 rule and seven files agree.

## Backlog

- Economy: drop the INT8 table cell to "Hopper and B200 at the FP8 rate; see below" and let the
  paragraph carry B300, Rubin and Trainium. Keep 1.8x in the NVFP4 column and the Alert only.
  Together these save about 30 words.
- Shape: demote the accuracy-delta list in the Alert and the kernel inventory in "Start from a
  stack" into ExpandableSections. Reorder "Choosing a precision" so it ends on "Validate accuracy
  on your own evaluation" or the requantize action rather than a kernel list.
- The ladder `<title>` says each step down "cuts the bits", but FP32 to TF32 and E4M3 to MXFP8
  do not cut stored bits. "Moving from FP64 toward 4-bit formats cuts the bits" would be exact.
- The H200 ridge note's "Dense is half NVIDIA's sparse figures" is the 2:4 convention, which the
  HGX page states for Blackwell and the H200 page does not state. A cite to the HGX footnote
  would close it.
- MI355X MXFP6 runs at the MXFP4 rate (10.1 PFLOPs), and the ladder and table have no MXFP6 rung.
