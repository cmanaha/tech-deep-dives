# Change report: RooflineAndArithmeticIntensity (nav id `roofline`)

Register: research/2026-10-refresh/05-workloads.md section 3 and the ridge-point
reference table; 02-nvidia.md sections 0 to 2 (B200, B300, Rubin); 03-aws-cpus.md
sections 0 and 1 (Trainium2, Trainium3). Files: src/sections/RooflineAndArithmeticIntensity.tsx,
src/components/RooflineChart.tsx (now exports RooflineChart and RidgeMapChart),
src/sources/RooflineAndArithmeticIntensity.ts (new, 16 records).

Self-fetched during authoring (accessed 2026-10-17): NVIDIA HGX page, for the HGX B200
and HGX B300 FP16/BF16 (36 PFLOPS sparse per 8 GPUs) and FP8 (72 PFLOPS sparse) rows,
the footnote "dense is half the sparse figure", the Rubin "Individual GPU Specifications"
table (NVFP4 inference 50 sparse, NVFP4 training 35 dense, FP8/FP6 17.5 dense, FP16/BF16 4
dense, 288 GB HBM4 at 22 TB/s), and the HGX Rubin NVL8 board row (2 TB HBM4 at 130 TB/s,
FP8/FP6 130 PFLOPS dense). The AMD MI355X page timed out twice; its figures come from the
register only.

## Word count

Rendered `main` text at 1440, citation badges and SVG text excluded, disclosures closed
(Playwright `innerText` of `main`). Before: 982. After: 1,269 (+29%). The first full draft
measured 1,537; the trim cut the separate precision-step paragraph under the chart, merged
the duplicated decode numbers, and shortened the batching, fusion and precision levers.

Growth above 20%, by block, all register-required NEW content:
- Ridge table, 8 chips by 3 precisions plus its format caption (3.7, 3.9): about +110 over
  the old 3-row table and the UNKNOWN alert it replaces.
- Precision-step model, two paragraphs replacing one (3.24, the orchestrator's named
  strongest model): about +90.
- Worked decode ceiling (70B FP8 on one H200, 3.14 practical): about +30.
- Attention limit on batching (3.16) and the LPX sentence (3.25): about +40.
The dense/sparse inputs, the 2:4 note and the Rubin bandwidth conflict sit in a closed
ExpandableSection and are not counted.

## Claims changed

| # | Before | After | Source key | Tier | Kind |
| --- | --- | --- | --- | --- | --- |
| 3.1 | Williams, Waterman, Patterson, CACM April 2009, as plain `Link` to dl.acm.org | same fact, `Cite` to the Crossref record used by Thesis and Framing | roofline | 3 | spec |
| 3.2 | "held up across fifteen years" | "Seventeen years on" | roofline | 3 | spec |
| 3.3 | H100 FP8 (sparse) 3,958, 3.35 TB/s, ridge 1,181 | ridge matrix: H100 FP8 591 dense; inputs table 1,979 dense / 3,958 sparse; BF16 295 added | h100Page, hopperArchBlog | 2 | derived |
| 3.4 | H200 FP8 (sparse) 3,958, ridge 825 | H200 FP8 412 dense (bold, the anchor); sparse 825 in the disclosure | h200Page, hopperArchBlog | 2 | derived |
| 3.5 | "H200 SXM BF16 tensor 1,979 TFLOPS, ridge 412" (WRONG) | H200 BF16 989.5 dense / 1,979 sparse, ridge 206 | h200Page, hopperArchBlog | 2 | derived |
| 3.6 | "All vendor-cited figures accessed 2026-04-23" | removed; every cell carries its own Cite with accessed date | - | - | - |
| 3.7 | UNKNOWN alert, B200/B300 per-GPU HBM bandwidth | B200 8 TB/s (DGX B200 64/8), B300 8 TB/s; ridges BF16 281, FP8 562, FP4 1,125 (B200), 1,688 (HGX B300) and 1,875 (GB300 NVL72) | dgxB200, hgxPage, blackwellUltraBlog, gb300Nvl72 | 2 | derived |
| 3.9 | (absent) | Rubin 22 TB/s, ridges 182 / 795 / 1,591 (NVFP4 dense; 50 PFLOPS inference figure labelled sparse, 2,273); MI355X 625 (OCP FP8) and 1,262 (MXFP4); Trainium2 230 / 448; Trainium3 137 / 514 / 514 | hgxPage, amdMi355x (T2); trainium2Arch, trainium3Arch (T1) | 2, 1 | derived |
| 3.10, 3.28 | "Prefill on a long prompt sits near the ridge"; chart drew prefill left of the ridge on the slope | prefill runs on the compute ceiling, far right of the ridge; chart marker on the FP8 ceiling at about 8,000 FLOP/byte, labelled "thousands of FLOP/byte" | h200Page | 2 | derived |
| 3.11 | 4k prompt at batch 16 clears the ridge | kept; note states the weight term alone exceeds 100,000 FLOP/byte | h200Page | 2 | derived |
| 3.12 | "~2 FLOPs/byte" for FP16 at batch 1 (WRONG) | about 1 FLOP/byte with FP16 or BF16 weights, about 2 with FP8 | h200Page | 2 | derived |
| 3.13 | "three orders of magnitude under H200's BF16 ridge of 412" (WRONG) | "about two orders of magnitude" short of the dense BF16 ridge of 206 | h200Page | 2 | derived |
| 3.14 | decode TPS = bandwidth / active parameter bytes | adds "plus the KV-cache bytes"; worked example: 70B dense model in FP8 on one H200 tops out near 68 tokens/s before KV reads | h200Page | 2 | derived |
| 3.15 | every technique incl. disaggregation "works by changing arithmetic intensity" (WRONG) | GQA, KV quantization, fusion, speculative decoding change bytes per useful FLOP; disaggregation removes prefill/decode interference and lets each phase be sized separately | distServe | 3 | spec |
| 3.16 | batching 2x / 64x | kept for the weight GEMMs; adds attention limit (each sequence reads its own KV) | h200Page (derived note on the batch crossover) | 2 | derived |
| 3.17 | "vLLM, TensorRT-LLM, SGLang, Neuron-Distributed" | "vLLM, TensorRT-LLM, SGLang and NxD Inference on Trainium" | none (no number) | - | - |
| 3.18 | "The ceiling on batch size is KV cache capacity" | "KV-cache capacity caps the batch, because each request's KV cache grows with context length" | none (qualitative, register CORRECT) | - | - |
| 3.19 | "Section 22 covers the current state (FlashAttention-3, paged variants)" | "The current kernels are FlashAttention-3 on Hopper and FlashAttention-4, in beta, on Blackwell"; KV Cache and FlashAttention named as the section that covers them | flashAttentionReadme, fa4Release | 1 | spec |
| 3.21 | "FP8 roughly doubles arithmetic intensity versus BF16" | kept: "FP8 weights roughly double intensity against BF16" | none (derived, no figure) | - | - |
| 3.20 | "Sections 14 and 16" | "NVIDIA Compilers and Kernel Tooling and AWS Compilers and Kernel Tooling" | - | - | - |
| 3.22 | "NVFP4 (E2M1) and MXFP8 push further" (WRONG) | "NVFP4 and MXFP4 push further" | - | - | - |
| 3.23 | "Section 21 covers the full precision ladder" | "Quantization and Precision covers the full ladder" | - | - | - |
| 3.24 | "ridge drifts right each generation" (STALE) | precision-step model: at fixed precision the ridge stays flat or falls (BF16 295, 281, 182); a precision step on one chip moves it 2x to almost 9x (Rubin 182 to 1,591); faster HBM pulls it left | ridge-table cites | 1, 2 | derived |
| 3.25 | Cerebras and compute-in-memory avoid HBM | adds NVIDIA Groq 3 LPX, 500 MB on-chip SRAM per LPU as primary working storage (worded per the cross-section note: never "SRAM-only") | lpxBlog | 2 | spec |
| 3.26 | chart "Decode (batch 1) ~2" with FP16 framing | two markers: batch 1 BF16 weights about 1 (hollow), batch 1 FP8 weights about 2 | h200Page | 2 | derived |
| 3.27 | chart "Decode (batch 64) ~128" | "Decode, batch 64, FP8 weights: about 128" | h200Page | 2 | derived |
| 3.29 | chart comment "H200 BF16 ~412" | chart computes both ridges from constants: BF16 206, FP8 412 | h200Page | 2 | derived |
| (not in register) | "at batch 64 it is well-utilized" | batch 64 with FP8 weights reaches about 128 FLOP/byte, still on the bandwidth slope; H200 weight GEMMs reach the ridge near 200 sequences at BF16 or FP8 | h200Page | 2 | derived |

## Claims removed

- 3.8, NVLink "1.8 TB/s GPU-to-GPU, 14.4 TB/s total" (was inside the UNKNOWN alert): NVLink is not
  an input to an HBM roofline, so it fails the mental-model-or-practical test here. NVIDIA
  Blackwell carries it, labelled bidirectional.
- "The software lever that is invisible to benchmarks but dominant in production": unsourced.
- "At batch 64 it is well-utilized": contradicted by the section's own arithmetic (128 < 412).
- The chart's "Dense GEMM (large tiles)" marker: no intensity value to place on a numeric axis;
  prefill is the large-GEMM case and carries the point.
- "Vendor page" link column: replaced by per-cell `Cite`.
- "paged variants" of FlashAttention: no source in the register for current paged kernels; the
  sentence keeps FlashAttention-3 and FlashAttention-4 beta, both cited.
- "on H100/H200-class silicon" qualifier on prefill being compute-bound: folded into the H200
  ridge comparison that carries the claim.
- CUT candidates: the register lists none for section 3.

## UNKNOWNs and doc conflicts

- Rubin HBM4 bandwidth: three NVIDIA figures. HGX individual-GPU table 22 TB/s (used, because its
  FLOPS come from the same table); Vera Rubin NVL72 page 19.2 TB/s per GPU; HGX Rubin NVL8 board
  130 TB/s for 8 GPUs with 130 PFLOPS dense FP8. The disclosure states all three and the ridges
  they give (19.2: 208 / 911 / 1,823; NVL8 board FP8: 1,000), and tells the reader to compute the
  ridge from the system being bought.
- MI355X BF16 and Trainium2 FP4, H100/H200 FP4: no figure in the cited sources; shown as a dash
  with "the cited source gives no figure for that precision".
- Sparse figures for Rubin FP8/BF16, MI355X MXFP4 and Trainium: dash in the sparse column (not
  tabulated from the cited source); no claim that the vendor publishes none.

## NEW content and sources

- Ridge matrix (8 chips x BF16 / FP8 / FP4) with derived cites carrying each division.
- RidgeMapChart: dot plot of the same ridges on a log axis, precision bands shaded.
- Disclosure with dense and sparse inputs for 19 chip-precision rows, the 2:4 sparse note
  (H200 825, Rubin 2,273) and the Rubin bandwidth conflict.
- Regime paragraph: Rubin BF16 to FP8 (4 to 17.5 PFLOPS) moves the weight-GEMM crossover batch
  from 182 to 398 (hgxPage, derived); Trainium3 MXFP4 at the MXFP8 rate (trainium3Arch).
- 70B FP8 on one H200, about 68 tokens/s ceiling (h200Page, derived).

## Diagram changes

- RooflineChart: rebuilt as a numeric log-log H200 roofline (x 0.5 to 20,000 FLOP/byte, y 2 to
  5,000 TFLOPS) with one 4.8 TB/s slope and two dense ceilings (BF16 989.5, FP8 1,979); ridges at
  206 and 412; decode markers at 1, 2 and 128; prefill on the FP8 ceiling; an annotation carrying
  the precision-step model. `role="img"`, `aria-labelledby="roofline-h200-title"`, `<title>`,
  viewBox only, width 100% / height auto, full-bleed white rect, sans-serif, fonts 11-12px.
  `aria-label` removed.
- RidgeMapChart (new): `aria-labelledby="ridge-map-title"`, same contract.

Rendered check (`scripts/shoot.mjs --sections roofline --widths 1440,390`): probe reports
"2 SVG diagram(s), ok" at both widths, no text overlap, no clipping, no page-level horizontal
overflow. Read the PNGs at 1440: no label crosses a line, ridge labels sit in the empty region
above the slope, ceiling labels sit between and under the two ceilings, the prefill label hangs
from a dashed leader clear of the BF16 label; the dot plot's value labels clear their markers and
the precision bands do not overlap. At 390 both SVGs scale to the column and stay intact, but
11px text renders near 5px, the same as every 760-860 unit diagram in this dive; the numbers are
all in the tables beside them. The first 390 run showed the disclosure table collapsing to
one-character columns (badge column squeezing the rest); column `minWidth`s now make both tables
scroll horizontally instead, page height fell from 12,331 to 7,202 px.

## Leverage pass

| Block | What it means to the reader | Model | How the reader uses it |
| --- | --- | --- | --- |
| Intro, three quantities | the vocabulary for the rest of the dive | ridge = peak FLOPS / bandwidth decides the regime | compute a ridge from any spec sheet |
| The roofline, placed (chart + paragraph) | where their own decode and prefill sit | decode about 200x below the ridge at BF16 or FP8; a precision step moves ridge and decode together | predict that FP8 doubles decode speed without changing the regime on H200 |
| Prefill and decode | why the two phases want different silicon | prefill follows FLOPS, decode follows bandwidth | size by bandwidth for decode, by FLOPS for prefill |
| Two consequences alert | a back-of-envelope ceiling and a taxonomy of decode speedups | tokens/s <= bandwidth / bytes per token | estimate a batch-1 ceiling (70B FP8 on H200, about 68 tokens/s); sort techniques by bytes moved vs phase separation |
| Ridge table + dot plot | compare chips at the precision they will run | the precision step moves the ridge more than the generation (BF16 137-295 on every chip; Rubin 182 to 1,591) | choose chip and precision together; read across the row before buying |
| Regime paragraph | when a precision step changes the bottleneck | crossover batch moves only when the FLOPS rate moves by other than 2x | Rubin FP8 needs about 2x the batch of BF16 to be compute-bound; Trainium3 MXFP4 gains bytes, not FLOPS |
| HBM / on-chip memory paragraph | why SRAM-first chips belong in the comparison | the denominator can change, not only the numerator | route to Cerebras, Groq/SambaNova, Compute-in-Memory sections |
| Disclosure | evidence for every input and the Rubin conflict | - | check a number; compute a Rubin ridge for the system bought |
| Levers | the three things they control at serving time | batching raises weight-GEMM intensity only; fusion keeps tensors on chip; precision cuts bytes | batch toward about 200 on H200, watch KV capacity, pick precision from the ridge row |

The chart now carries the precision-step model visually (two ceilings over one slope, plus the
annotation), and the dot plot carries the cross-chip version, so neither model lives only in prose.

Claim-set diff (assertions in the after that were not in the before, with source):
1. Dense/sparse split for H100 and H200 BF16 and FP8; H200 BF16 ridge 206: h100Page, h200Page, hopperArchBlog (derived).
2. B200 and B300 bandwidth 8 TB/s and ridges 281 / 562 / 1,125 / 1,688 / 1,875: dgxB200, hgxPage, blackwellUltraBlog, gb300Nvl72 (derived).
3. Rubin 22 TB/s, ridges 182 / 795 / 1,591, sparse 2,273: hgxPage (derived).
4. MI355X 8 TB/s, ridges 625 and 1,262: amdMi355x (derived).
5. Trainium2 2.9 TB/s, ridges 230 and 448; Trainium3 4.9 TB/s, ridges 137 and 514, MXFP4 at the MXFP8 rate: trainium2Arch, trainium3Arch (derived).
6. "At a fixed precision the ridge stays flat or falls"; "Rubin's HBM4 grew faster than its BF16 rate"; "almost 9x": arithmetic on 2-5 (derived).
7. Rubin BF16-to-FP8 crossover batch 182 to 398: hgxPage (derived note).
8. Decode at batch 1 about 1 FLOP/byte (16-bit) and 2 (FP8), about 200x below either H200 ridge; FP8 doubles decode speed: h200Page (derived note).
9. H200 weight GEMMs reach the ridge near 200 sequences: h200Page (derived note).
10. 70B dense FP8 on one H200 tops out near 68 tokens/s: h200Page (derived).
11. Attention intensity stays roughly flat as batch grows (each sequence reads its own KV): register 3.16 (derived reasoning, labelled as such in the register).
12. Disaggregation removes prefill/decode interference and lets each phase be sized separately: distServe.
13. FlashAttention-4 in beta on Blackwell: fa4Release; FlashAttention-3 on Hopper: flashAttentionReadme.
14. Groq 3 LPX LPUs each use 500 MB of on-chip SRAM as primary working storage: lpxBlog.
15. Three Rubin HBM4 bandwidths (22, 19.2, 130 per 8 GPUs) and the ridges they give: hgxPage (fetched 2026-10-17), veraRubinNvl72 (derived).
16. Sparse rates apply only to 2:4 pruned weights: h200Page (same wording and cite as Thesis and Framing).
No assertion in the after lacks a source.

## Orchestrator actions (shared files)

- Glossary acronyms introduced or used: BF16, FP8, FP16, FP4, NVFP4, MXFP4, MXFP8, OCP (Open
  Compute Project), GEMM, GQA, KV, HBM, DRAM, SRAM, SMEM, TMEM, SBUF, NKI, LPU.
- Cross-section note: Rubin HBM4 per-GPU bandwidth appears as 22 (HGX individual GPU),
  19.2 (Vera Rubin NVL72 page) and 16.25 (HGX Rubin NVL8 board, 130 TB/s / 8). Any section
  quoting a Rubin ridge or bandwidth should name which figure it uses.
- New source records not used elsewhere yet: amdMi355x (T2), distServe (T3, arXiv), fa4Release (T1).

## Checks

- `tsc --noEmit`: no errors in my files.
- `eslint --max-warnings 0` on the three files: clean.
- `vitest run src/__tests__/sections.test.tsx -t RooflineAndArithmeticIntensity`: 1 passed.
- `no-ai-tells.sh`, `svg-a11y.sh`, `pinned-refs.sh`: no hits in my files (gates still fail on
  other files, for example CimDiagram.tsx em-dashes).
- `shoot.mjs` at 1440 and 390: ok, see Diagram changes.

## Status

Complete. Not committed.

## Orchestrator follow-up

- Both charts now sit in a horizontal-scroll wrapper with `minWidth: 640`, the dive's
  convention for wide diagrams, so labels keep their size at 390 px instead of shrinking
  to about 5 px. Re-shot at 1440 and 390: probe ok.
- The AMD MI355X page timed out on re-check; its figures rest on the 2026-10-16 register
  read. Listed for the verification pass.
