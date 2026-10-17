# Change report: NvidiaBlackwell (nav id `blackwell`)

Register: `research/2026-10-refresh/02-nvidia.md` section 2 (B1 to B42), plus
section 0 (Vera Rubin, AWS P6 families) and section 6 (pinned example 92 URL).
Also applies the 2026-08-01 audit findings (`docs/verification/2026-08-01/P3-silicon-numbers.md` section 3).

Files: `src/sections/NvidiaBlackwell.tsx`, `src/components/BlackwellDieDiagram.tsx`,
`src/sources/NvidiaBlackwell.ts` (new, 22 records).

Re-fetched on 2026-10-17 to confirm load-bearing labels (records carry that date):
HGX page (INT8 row footnote "Specification in Sparse. Dense is 1/2 sparse"; FP4 row
"Sparse | Dense"; FP64 296 vs 10 TFLOPS), Vera Rubin NVL72 page (NVFP4 inference
footnote "Sparse specification", training "Dense specification"; NVLink row carries
no direction label), AWS P6 page ("1.5x GPU TFLOPS (at FP4, without sparsity)
compared to P6-B200"; 6.4 vs 3.2 Tbps EFA), Blackwell Ultra blog (quotes in B2, B6,
B8, B13, B40).

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| B1, B2 | Die "GB100 (two reticles + NV-HBI)" / "GB100-derived" | Two reticle-limited dies, NV-HBI 10 TB/s, 208B transistors, TSMC 4NP / same design, up to 160 SMs | blackwellArchitecture (T2), blackwellUltraBlog (T2) |
| B3 | B300 "HBM3e+" | HBM3e in eight 12-high stacks | blackwellUltraBlog (T2) |
| B4 | 180 GB / 288 GB | kept; added AWS per-GPU memory row, 179 GiB / 268 GiB | blackwellTuningGuide (T1), blackwellUltraBlog (T2), ec2AcceleratedSpecs (T1) |
| B5 | "~8 TB/s class" | 8 TB/s (B200 derived from DGX B200 64 TB/s / 8) | dgxB200 (T2, derived), blackwellUltraBlog (T2) |
| B6 | NVLink 1.8 TB/s unlabelled (table and diagram) | "1.8 TB/s bidirectional (900 GB/s each way)" everywhere | hgxPage (T2), blackwellUltraBlog (T2) |
| B10 | FP4 "B200 -, B300 14 PFLOPS" | NVFP4 dense / sparse per GPU: B200 9/18 (HGX), 10/20 (GB200 NVL72); B300 13.5/18 (HGX), 15/20 (GB300 NVL72) | hgxPage, gb200Nvl72, gb300Nvl72 (T2, derived) |
| B11 | B300 column "P6e UltraServer (GB200)" | B200: P6-B200, P6e-GB200; B300: P6-B300, P6e-GB300 | ec2AcceleratedSpecs (T1), p6eGb300Ga (T2) |
| B14 | TMEM "between SMEM and the Tensor Core", Tensor Core "consumes operands from TMEM" | TMEM holds accumulator D; B from SMEM; A from SMEM or TMEM; tcgen05.mma single-thread issue vs collective mma.sync/wgmma | ptxIsa (T1) |
| B15 | NVFP4 "roughly halves" FP8 footprint | about 1.8x smaller than FP8 | nvfp4Blog (T2) |
| B17 | "FP4 reaching 14 PFLOPS per GPU on B300" | 15 PFLOPS dense NVFP4 per GPU (NVIDIA's Blackwell Ultra figure; HGX B300 rates 13.5) | blackwellUltraBlog (T2) |
| B18 | "fitting in a single rack" | one 8-GPU node vs two: 1T params at FP8 is about 1 TB; P5en 8 x 141 GiB vs P6-B300 8 x 268 GiB | ec2AcceleratedSpecs (T1, derived) |
| B19 | NV-HBI "roughly 10 TB/s aggregate (NVIDIA stated at announcement ... I fetched)" | 10 TB/s; first-person parenthetical removed | blackwellArchitecture (T2) |
| B23, B24, B30 | Example 92 "first ... SM100 target" (link on `main`), "first appeared in v4.0.0" | example 92 adds Blackwell MoE GEMMs tuned for low-latency inference from v4.2.0; link pinned to tag v4.8.0 | cutlassChangelog (T1), cutlassExample92 (T1) |
| B27 | "Operators not yet on tcgen05 path, falls back" | wgmma requires sm_90a, so Hopper wgmma kernels need a tcgen05 rewrite; confirm a Blackwell build | ptxIsa (T1) |
| B28 | "Hopper economics may win" | kept, now sourced: P5en On-Demand cut 25% from the May 31, 2025 baseline | gpuPriceCut (T2), h200Page (T2) |
| B34 | Diagram "~104B transistors" per die | "208B transistors on TSMC 4NP across two dies" | blackwellArchitecture (T2) |
| B35 | Diagram "4 HBM3e stacks per die" next to "UNKNOWN per-die HBM split" | "288 GB in eight 12-high stacks (B300)"; "How the stacks split between the two dies is not published" | blackwellUltraBlog (T2) |
| B36 | Diagram caption "14 PFLOPS per GPU" | removed from the SVG; FP4 lives in the table with dense/sparse labels | (see B10) |

CORRECT claims kept and re-cited: B4, B5, B7, B8, B9 (folded into the NVFP4 paragraph), B13, B16, B19, B25, B28.

## Claims removed

- B12 "10th-generation" ordinal: UNKNOWN, CUT candidate.
- B20 Alert "Per-die specifics not directly fetched": page-history voice, CUT candidate. One sentence remains: "NVIDIA does not state how the stacks split between the two dies."
- B21 "seven new instructions": wrong; register edit 2 says drop rather than restate the count.
- B22 "2x to 4x faster than wgmma": UNKNOWN, unsourceable.
- B26 DeepSeek-V3.2 690 GB to 415 GB (prose and diagram): wrong source and internally inconsistent.
- B29 "Tooling maturity ... catching up": STALE.
- B31, B32, B33 and the ExpandableSection "Why Blackwell silicon and Blackwell software shipped on different schedules": CUT candidate (version trivia). B31/B32 were CORRECT but carried no reader action; B33 was UNKNOWN. The practical point ("note the library release it landed in") is kept in the checklist, with example 92 at v4.2.0 as the instance.
- "Throughput-per-watt-sensitive deployments" bullet: no source in the register or the section; it gave no action.
- "No NUMA" kept (B13 CORRECT), now with NUMA expanded.

## UNKNOWNs

- B1/B2 die codenames: dropped; the table describes construction instead.
- B12 ordinal: dropped.
- B22: dropped.
- B33: dropped with the version list.
- B34 per-die transistor count: replaced with the 208B total.
- B35 per-die HBM split: stated as not published (register shows it was checked), B200 stack count left out because no Tier 1/2 source gives it.

## NEW content

- B37: compute capability row (10.0 `sm_100` / 10.3 `sm_103`, cudaGpus T1) and the `compute_100f` family target covering 10.0, 10.3 and 10.7 (computeCapabilities T1).
- B38: INT8 72 to 3 POPS (sparse, per 8-GPU HGX board) and FP64 296 to 10 TFLOPS (hgxPage T2); `.kind::i8` listed for `sm_100a` and `sm_110a` only (ptxIsa T1); FP8 holds at 72 PFLOPS sparse on both boards (hgxPage T2). Action: INT8/FP64 on B200, or requantize before B300.
- B39: dense NVFP4 +1.5x (72 to 108 PFLOPS per HGX board), sparse unchanged at 144 (hgxPage T2); AWS's "1.5x ... (at FP4, without sparsity)" framing for P6-B300 vs P6-B200 (p6Page T2, vendor-claim).
- B40: SFU throughput doubled, "up to 2x faster attention-layer compute compared to Blackwell GPUs" (blackwellUltraBlog T2, vendor-claim).
- B41: SMEM stays 228 KB per SM within 256 KB L1+SMEM; TMEM is the new in-SM capacity (blackwellTuningGuide T1). Phrased "inside the SM" because the same guide reports GB200's L2 growing to 126 MB.
- B42: Vera Rubin successor block. Shipping (nvidiaQ2Fy27 T1, spec); 288 GB HBM4, 35 PFLOPS dense / 50 sparse NVFP4 per GPU (veraRubinNvl72 T2); CC 10.7, 328 KB SMEM (computeCapabilities T1); no Rubin instance on the EC2 spec page as of October 2026 (ec2AcceleratedSpecs T1); AWS deployment plan for 2027-2028 (awsNvidia2026 T2, roadmap); Rubin Ultra and Feynman roadmap (gtc2026 T2, roadmap). Rubin NVLink and HBM4 bandwidth are left out: two NVIDIA pages disagree (3 vs 3.6 TB/s; 19.2 vs 22 TB/s) and neither NVLink figure carries a direction label; the rack-level conflict belongs to Grace-Blackwell and UltraServer.
- From section 0: P6-B300 6.4 Tbps EFA vs P6-B200 3.2 Tbps (p6Page T2).
- ExpandableSection "Where the per-GPU NVFP4 figures come from": the four board/rack sparse | dense pairs behind the derived per-GPU values.

## Diagram

`BlackwellDieDiagram.tsx` rebuilt: `viewBox="0 0 880 448"`, `role="img"`,
`aria-labelledby="bw-die-title"` with an asserting `<title>`, full-bleed white
rect, Idiom A classes prefixed `bwd-`, fonts 11 to 13px sans-serif, no
`aria-label`, no em-dashes. Content: package (one CUDA device, 208B, TSMC 4NP,
up to 160 SMs), two dies with the NV-HBI 10 TB/s bridge, coherent shared L2 bar,
HBM3e bar (180 GB / 288 GB in eight 12-high stacks / 8 TB/s; split not
published), NVLink 5 bar labelled bidirectional with 900 GB/s each way, and a new
lower band carrying the TMEM model (SMEM 228 KB gives A and B to the Tensor Core,
D accumulates into TMEM 256 KB, dashed optional A from TMEM). All figures are
cited in a caption box the section renders under the SVG.

Mobile: at 390 the plain `width: 100%` SVG rendered 308 px wide, so 11-unit text
was about 4 px. The SVG now has `minWidth: 640` inside an `overflowX: auto`
wrapper (the diagram plan's scroll-rather-than-shrink rule), so text renders
near 8 px and the reader scrolls sideways.

Rendered check (`scripts/shoot.mjs`, build in /tmp/silicon-dist-blackwell):
probe reported "1 diagram(s), ok" at 1440 and 390 (no overlaps, no viewBox
clipping, no page-level horizontal overflow). Read the PNGs: at 1440 all labels
sit inside their boxes, arrow labels sit above or below their lines, no text
crosses a line. At 390 the diagram scrolls inside its wrapper and is legible;
the spec table scrolls horizontally inside the Cloudscape table (spec column
min width lowered to 130 to give the data columns more room).

## Leverage pass: claim-set diff

New assertions in the after that were not in the before, each with its source:

1. B200 is CC 10.0, B300 is CC 10.3: cudaGpus.
2. `compute_100f` code runs on 10.0, 10.3 and 10.7: computeCapabilities.
3. INT8 72 to 3 POPS sparse, FP64 296 to 10 TFLOPS, FP8 72 PFLOPS sparse on both, FP4 sparse 144 on both, dense 72 to 108: hgxPage.
4. `.kind::i8` listed for sm_100a and sm_110a only: ptxIsa. "B300's sm_103 is not on that list" is our reading of that list.
5. AWS 1.5x FP4 without sparsity and 1.5x GPU memory, P6-B300 vs P6-B200: p6Page (vendor-claim).
6. P6-B300 6.4 Tbps vs P6-B200 3.2 Tbps EFA: p6Page.
7. SFU doubling and up to 2x attention: blackwellUltraBlog (vendor-claim).
8. Accumulator in registers on Hopper wgmma, in TMEM on Blackwell; operand placement; single-thread semantics: ptxIsa.
9. wgmma requires sm_90a: ptxIsa.
10. SMEM 228 KB per SM, 256 KB L1+SMEM, as on Hopper: blackwellTuningGuide.
11. B300 up to 160 SMs, eight 12-high stacks, coherent shared L2, NVLink 18 x 100 GB/s bidirectional: blackwellUltraBlog.
12. 179 GiB / 268 GiB / 141 GiB per GPU on P6-B200 / P6-B300 / P5en: ec2AcceleratedSpecs.
13. 1T params at FP8 is about 1 TB: our arithmetic (derived), stated as such in the Cite note.
14. P6e-GB300 exists as the B300 UltraServer: p6eGb300Ga.
15. P5en On-Demand cut 25% from May 31, 2025: gpuPriceCut.
16. Vera Rubin shipping, partners named: nvidiaQ2Fy27. 288 GB HBM4, 35 dense / 50 sparse: veraRubinNvl72. CC 10.7, 328 KB SMEM: computeCapabilities. No Rubin EC2 instance: ec2AcceleratedSpecs. AWS 2027-2028 plan: awsNvidia2026 (roadmap). Rubin Ultra and Feynman roadmap: gtc2026, awsNvidia2026.
17. Example 92 since v4.2.0: cutlassChangelog.
18. "Kernel libraries add these paths release by release": framing sentence, evidenced by item 17; no broader claim.

Guidance sentences ("run INT8-quantized models and FP64 work on B200, or move INT8
models to FP8 or NVFP4", "target compute_100f when one build has to cover the
fleet", "price Hopper first") are actions drawn from items 2, 3 and 15; they add
no facts.

## For the orchestrator

- `src/__tests__/sources.test.ts` currently fails for every file: `src/sources/index.ts`
  globs `./*.ts` excluding only `index.ts`, so it loads `markdown.ts`, which has no `S`
  export ("Cannot convert undefined or null to object" at index.ts:52). Exclude
  `./markdown.ts` from the glob. `sources.md` also needs regenerating with `-u` once
  that is fixed, since this file adds 22 records.
- Shared URLs other NVIDIA sections will also cite, with the tiers used here: T1
  ec2 ac.html, Blackwell Tuning Guide, PTX ISA, compute capabilities, cuda-gpus,
  CUTLASS v4.8.0 CHANGELOG and example 92, NVIDIA 8-K; T2 AWS P6 page, P6e-GB300
  What's New, AWS price-cut blog, H200, Blackwell architecture page, Blackwell
  Ultra blog, DGX B200, HGX, GB200 NVL72, GB300 NVL72, Vera Rubin NVL72, AWS/NVIDIA
  2M GPUs newsroom, GTC 2026 blog, NVFP4 blog. All match the register.
- Glossary acronyms introduced or used here: NV-HBI, TMEM, SM, SMEM, HBM/HBM3e/HBM4,
  NVFP4, E2M1, E4M3, MoE, KV, NUMA, MMA, GEMM, CUTLASS, PTX, POPS, SFU, EFA, NVLink,
  HGX, NVL72, FP4/FP8/FP16/FP32/FP64, INT8.
- Cross-links by name: NVIDIA Hopper, Grace-Blackwell and UltraServer, NVIDIA
  Compilers and Kernel Tooling, Mixture of Experts and Sparse Activation,
  Quantization and Precision.
