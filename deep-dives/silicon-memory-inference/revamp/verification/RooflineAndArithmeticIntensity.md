# Verification: Roofline and Arithmetic Intensity

Verified: 2026-10-18. Claims checked: 54 (sampled: 0, every claim checked). Confirmed 48, wrong 3,
unsupported 3, mislabelled 0, unverifiable 0.

## Gate 3 score: 8/10
The section gives the reader a working model (ridge = dense peak / HBM bandwidth; a precision step moves the ridge more than a generation does) and something to do with it (compute a ridge, a batch-1 ceiling, a crossover batch). Every input figure checked out against its source. The six failures were in our own arithmetic and silence claims: the headline "stays flat or falls" sentence contradicted the section's own FP8 and FP4 columns, and the MI355X BF16 dash claimed a silence the AMD page does not have. All six are fixed. What holds it at 8 is economy: the ridge table, the dot plot and the inputs disclosure carry the same 24 numbers three times, and the regime paragraph is dense.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 48 of 54 confirmed; 3 wrong (a rounding, the fixed-precision model sentence, a range claim) and 3 unsupported (MI355X BF16 silence, 2:4 pattern, FA4 on Blackwell), all fixed. No vendor input figure was wrong. |
| Mental model or practical value | 9 | Every block passes: the roofline plot places decode about 200x below the ridge; the ridge table plus the precision-step paragraph is the model; the 70B-on-H200 ceiling and the crossover batches are things to compute. No block fails both tests. |
| Shape | 8 | Introduces the model before the three quantities; h2 descriptions state the payoff; "about 200x below the ridge" lands in the chart, the prose and the batching lever (near 200 sequences); inputs and the Rubin conflict sit in an ExpandableSection; ends on "read your chip's row before you pick a precision". |
| Writing | 8 | no-ai-tells gate clean; attribution kept only where load-bearing ("NVIDIA's pages give three HBM4 bandwidths", sources disagree). The regime paragraph ("Halving the bytes matches a doubling of the FLOPS rate...") asks a lot of one read. |
| Economy | 7 | +29% words (982 to 1,269). Ridge table and dot plot repeat the same 24 values by design; the disclosure repeats them again as inputs. Length fits, with little slack. |
| Diagrams | 9 | Both SVGs carry role="img", aria-labelledby and a title; probe "ok" at 1440 and 390; at 390 the wrapper scrolls (640 / 308 px) and text renders at 10 px; the Trainium3 FP8/FP4 overlap is gone. |

## Claims
| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | Roofline model by Williams, Waterman and Patterson, CACM, April 2009 | roofline | CONFIRMED | Crossref: "Roofline", Williams / Waterman / Patterson, Communications of the ACM 52(4), published April 2009 | - |
| 2 | "seventeen years on" | roofline | CONFIRMED | 2026 - 2009 = 17 | - |
| 3 | H100 SXM 3.35 TB/s | h100Page | CONFIRMED | "GPU Memory Bandwidth 3.35TB/s" (H100 SXM column) | - |
| 4 | H100 BF16 989.5 dense / 1,979 sparse, ridge 295 | h100Page, hopperArchBlog | CONFIRMED | "BFLOAT16 Tensor Core* 1,979 teraFLOPS", "* With sparsity"; 989.5 / 3.35 = 295.4 | - |
| 5 | H100 FP8 1,979 dense / 3,958 sparse, ridge 591 | h100Page | CONFIRMED | "FP8 Tensor Core 3,958 teraFLOPS" (sparse); 1,979 / 3.35 = 590.7 | - |
| 6 | H200 SXM 4.8 TB/s HBM3e | h200Page | CONFIRMED | "GPU Memory Bandwidth 4.8TB/s", 141GB | - |
| 7 | H200 BF16 989.5 / 1,979, ridge 206 | h200Page | CONFIRMED | "BFLOAT16 Tensor Core² 1,979 TFLOPS", "2 With sparsity."; 989.5 / 4.8 = 206.1 | - |
| 8 | H200 FP8 1,979 / 3,958, ridge 412 (the anchor) | h200Page | CONFIRMED | "FP8 Tensor Core² 3,958 TFLOPS"; 1,979 / 4.8 = 412.3 | - |
| 9 | Hopper blog lists dense/sparse pairs at 1:2 | hopperArchBlog | CONFIRMED | Table 3: "Peak FP8 Tensor TFLOPS with FP32 Accumulate 2000/4000", "Peak BF16 ... 1000/2000", footnote "Effective TOPS / TFLOPS using the Sparsity feature" | - |
| 10 | B200 8 TB/s (DGX 64 / 8) | dgxB200 | CONFIRMED | "8x NVIDIA Blackwell GPUs", "1,440 GB total, 64 TB/s HBM3e bandwidth" | - |
| 11 | B200 BF16 2.25 dense / 4.5 sparse, ridge 281 | hgxPage | CONFIRMED | HGX B200 "FP16/BF16 Tensor Core² 36 PFLOPS", fn 2 "Specification in Sparse. Dense is ½ sparse spec shown."; 2,250 / 8 = 281.25 | - |
| 12 | B200 FP8 4.5 / 9, ridge 562 | dgxB200 | CONFIRMED | "FP8 Tensor Core: 72 PFLOPS**", "** Specification shown in sparse. Dense performance is ½ sparse spec shown."; 4,500 / 8 = 562.5, shown half-to-even | - |
| 13 | B200 NVFP4 9 / 18, ridge 1,125 | hgxPage | CONFIRMED | HGX B200 "FP4 Tensor Core¹ 144 PFLOPS \| 72 PFLOPS", fn 1 "Specification in Sparse \| Dense" | - |
| 14 | B300 8 TB/s | blackwellUltraBlog | CONFIRMED | "Bandwidth: 8 TB/s per GPU"; Table 2 "Max HBM bandwidth 8 TB/s" | - |
| 15 | B300 (HGX) BF16 281, FP8 562 | hgxPage | CONFIRMED | HGX B300 "FP16/BF16 Tensor Core² 36 PFLOPS", "FP8/FP6 Tensor Core² 72 PFLOPS" | - |
| 16 | HGX B300 NVFP4 13.5 / 18, ridge 1,688 | hgxPage | CONFIRMED | HGX B300 "FP4 Tensor Core¹ 144 PFLOPS \| 108 PFLOPS"; 13,500 / 8 = 1,687.5 | - |
| 17 | GB300 NVL72 NVFP4 15 / 20 per GPU, 8 TB/s, ridge 1,875 | gb300Nvl72 | CONFIRMED | "72 NVIDIA Blackwell Ultra GPUs", "FP4 Tensor Core 1440 \| 1080²", fn 2 "Without sparsity.", "20 TB \| Up to 576 TB/s" | - |
| 18 | Rubin 22 TB/s HBM4 (individual-GPU table) | hgxPage | CONFIRMED | Individual NVIDIA Rubin GPU: "288 GB HBM4 \| 22 TB/s" | - |
| 19 | Rubin BF16 4 PFLOPS dense, ridge 182 | hgxPage | CONFIRMED | "FP16/BF16² 4 PFLOPS", fn "2. Dense specification."; 4,000 / 22 = 181.8 | - |
| 20 | Rubin FP8 17.5 dense, ridge 795 | hgxPage | CONFIRMED | "FP8/FP6 Training² 17.5 PFLOPS"; 17,500 / 22 = 795.5 | - |
| 21 | Rubin NVFP4 35 dense (ridge 1,591); 50 is sparse (2,273) | hgxPage | CONFIRMED | "NVFP4 Training² 35 PFLOPS"; NVL8 table "NVFP4 Inference¹ 400 PFLOPS", fn "1. Sparse specification."; Vera Rubin NVL72 page "NVFP4 Inference² 50 PFLOPS", "2. Sparse specification." | - |
| 22 | MI355X 8 TB/s | amdMi355x | CONFIRMED | "Peak Memory Bandwidth 8 TB/s" (spec list) | - |
| 23 | MI355X OCP FP8 5 dense / 10.1 sparse, ridge 625 | amdMi355x | CONFIRMED | "Peak ... (OCP-FP8) Performance (E5M2, E4M3) 5 PFLOPs"; "... with Structured Sparsity ... 10.1 PFLOPs" | - |
| 24 | MI355X MXFP4 10.1, ridge 1,262 | amdMi355x | CONFIRMED | "Peak Microscaling Four-bit Precision Matrix (MXFP4) Performance 10.1 PFLOPs"; 10,100 / 8 = 1,262.5, shown half-to-even | - |
| 25 | MI355X BF16 "-" ("a dash means the cited source gives no figure for that precision") | amdMi355x | UNSUPPORTED | "Peak bfloat16 (BF16) Matrix Performance 2.5 PFLOPs"; "... with Structured Sparsity 5 PFLOPs" | Filled: ridge 313 (2,500 / 8 = 312.5), inputs row added, dot-plot point added, BF16 range 137 to 313 in chart title and band |
| 26 | Trainium2 2.9 TB/s | trainium2Arch | CONFIRMED | "96 GiB of device memory with 2.9 TB/sec of bandwidth." | - |
| 27 | Trainium2 BF16 667, ridge 230 | trainium2Arch | CONFIRMED | "667 BF16/FP16/TF32 TFLOPS"; 667 / 2.9 = 230.0 | - |
| 28 | Trainium2 FP8 1,299, ridge 448 | trainium2Arch | CONFIRMED | "1,299 FP8 TFLOPS"; 1,299 / 2.9 = 447.9 | - |
| 29 | Trainium2 FP4 "-" | trainium2Arch | CONFIRMED | page lists no FP4 or MXFP4 figure | - |
| 30 | H100 / H200 FP4 "-" | h100Page, h200Page | CONFIRMED | neither spec table has an FP4 row | - |
| 31 | Trainium3 4.9 TB/s | trainium3Arch | CONFIRMED | "144 GiB of device memory, with 4.9 TB/sec of bandwidth." | - |
| 32 | Trainium3 BF16 671, ridge 137 | trainium3Arch | CONFIRMED | "671 BF16/FP16/TF32 TFLOPS"; 671 / 4.9 = 136.9 | - |
| 33 | Trainium3 MXFP8 and MXFP4 2,517, ridge 514 both; FP4 does not move the ridge | trainium3Arch | CONFIRMED | "2,517 MXFP8/MXFP4 TFLOPS"; 2,517 / 4.9 = 513.7 | - |
| 34 | Decode batch 1: about 1 FLOP/byte (16-bit), 2 (FP8), about 200x below either ridge | h200Page (derived) | CONFIRMED | 206 / 1 = 206; 412 / 2 = 206 | - |
| 35 | Batch 64, FP8 weights: about 128 FLOP/byte, still on the slope | h200Page (derived) | CONFIRMED | 2 x 64 = 128 < 412 | - |
| 36 | 4k prompt x batch 16 = 65,536 tokens; weight term over 100,000 FLOP/byte | h200Page (derived) | CONFIRMED | 4,096 x 16 = 65,536; 2 x 65,536 / 1 byte = 131,072 | - |
| 37 | Chart: prefill, 4k-token prompt, thousands of FLOP/byte (marker at 8,192) | h200Page (derived) | CONFIRMED | 2 x 4,096 / 1 byte = 8,192 > 412 | - |
| 38 | 70B dense FP8 on one H200 "tops out near 68 tokens per second" | h200Page (derived) | WRONG | 4,800 GB/s / 70 GB = 68.57, which rounds to 69 (the note itself says 68.6) | "near 69" |
| 39 | Disaggregation removes prefill/decode interference and lets each phase be sized on its own | distServe | CONFIRMED | Abstract: "assigns prefill and decoding computation to different GPUs, hence eliminating prefill-decoding interferences"; "co-optimizes the resource allocation and parallelism strategy tailored for each phase" | - |
| 40 | "At a fixed precision the ridge stays flat or falls" | ridge table (derived) | WRONG | The section's own table: FP8 562 (B200) to 795 (Rubin); FP4 1,125 (B200) to 1,688 (HGX B300) | Restated as "stays within a factor of 2 from H100 to Rubin, and at BF16 it falls" (BF16 max/min 1.6, FP8 1.9, FP4 1.5) |
| 41 | BF16 295 (H100), 281 (B200), 182 (Rubin); Rubin HBM4 grew faster than its BF16 rate | h100Page, hgxPage, dgxB200 (derived) | CONFIRMED | vs B200: bandwidth 8 to 22 = 2.75x, BF16 2.25 to 4 = 1.78x | - |
| 42 | Precision step 2x on H200 (206 to 412), almost 9x on Rubin (182 to 1,591) | derived | CONFIRMED | 1,591 / 182 = 8.74 | - |
| 43 | Rubin BF16 to FP8 4 to 17.5 PFLOPS; weight-GEMM crossover B = 182 at BF16, 398 at FP8 | hgxPage (derived) | CONFIRMED | 795 / 2 = 397.7 | - |
| 44 | Groq 3 LPX: each LPU uses 500 MB on-chip SRAM as primary working storage | lpxBlog | CONFIRMED | "500 MB of high-speed on-chip SRAM serves as the primary working storage for inference." (MEM section, Mar 16, 2026) | - |
| 45 | Sparse rates apply only to weights pruned to the 2:4 structured pattern | h200Page | UNSUPPORTED | H200 page has only "With sparsity."; Hopper blog says "fine-grained structured sparsity", no 2:4 | Added sparsityBlog (NVIDIA, Tier 2): "sparse Tensor Cores, which require a 2:4 sparsity pattern" |
| 46 | H200 FP8 sparse ridge 825; Rubin NVFP4 sparse ridge 2,273 | h200Page, hgxPage (derived) | CONFIRMED | 3,958 / 4.8 = 824.6; 50,000 / 22 = 2,272.7 | - |
| 47 | Rubin HBM4: 22 TB/s (HGX individual GPU), 19.2 TB/s (Vera Rubin NVL72 page), HGX Rubin NVL8 130 TB/s across 8 GPUs with 130 PFLOPS dense FP8 | hgxPage, veraRubinNvl72 | CONFIRMED | NVL72 page: "288 GB HBM4 \| 19.2 TB/s"; HGX NVL8: "2 TB HBM4 \| 130 TB/s", "FP8/FP6 Training² 130 PFLOPS" | - |
| 48 | At 19.2 TB/s: 208 / 911 / 1,823; NVL8 FP8 ridge 1,000 | hgxPage (derived) | CONFIRMED | 4,000 / 19.2 = 208.3; 17,500 / 19.2 = 911.5; 35,000 / 19.2 = 1,822.9; 130 / 130 = 1,000 | - |
| 49 | "On all three the BF16 ridge stays inside the range of earlier generations" | hgxPage (derived) | WRONG | Earlier generations in the table span 206 (H200) to 295 (H100); Rubin at 22 TB/s gives 182, below that range (19.2 gives 208, NVL8 32 PFLOPS / 130 TB/s gives 246) | "stays below H100's 295"; NVL8 BF16 arithmetic added to the note |
| 50 | H200 weight GEMMs reach the ridge near 200 sequences, BF16 or FP8 | h200Page (derived) | CONFIRMED | 2B = 412 gives B = 206; B = 206 | - |
| 51 | FlashAttention-3 on Hopper | flashAttentionReadme | CONFIRMED | "FlashAttention-3 is optimized for Hopper GPUs (e.g. H100)." | - |
| 52 | FlashAttention-4, in beta, on Blackwell | fa4Release | UNSUPPORTED (Blackwell part) | Release page: "Pre-release", tag beta35, no architecture named. README at the same tag: "FlashAttention-4 is written in CuTeDSL and optimized for Hopper and Blackwell GPUs (e.g. H100, B200)." | Added fa4Readme record (same URL, title and tier as KV Cache and FlashAttention) and cited it |
| 53 | Chart caption: H200 dense 989.5 BF16, 1,979 FP8, 4.8 TB/s HBM3e; chart ridges 206 / 412 | h200Page, hopperArchBlog | CONFIRMED | as rows 6 to 9 | - |
| 54 | Ridge-map title: BF16 137 to 295, FP8 412 to 795, FP4 1,125 to 1,688, 2 to 9x per chip | derived | CONFIRMED as shown (for the points then plotted) | Ranges match the plotted data; per-chip spread 2x (H100, H200, Trn2) to 8.7x (Rubin) | Updated to 137 to 313 as a consequence of row 25 |

## ORCH-NOTES items

1. AMD MI355X figures: CONFIRMED, plus one fix. Re-fetched 2026-10-18 with curl (WebFetch timed out twice). amd.com MI355X page spec list: "Peak Open Compute Project Eight-bit Precision Matrix (OCP-FP8) Performance (E5M2, E4M3) 5 PFLOPs"; "... with Structured Sparsity (E5M2, E4M3) 10.1 PFLOPs"; "Peak Microscaling Four-bit Precision Matrix (MXFP4) Performance 10.1 PFLOPs"; "Peak Memory Bandwidth 8 TB/s"; "Peak bfloat16 (BF16) Matrix Performance 2.5 PFLOPs"; "... with Structured Sparsity 5 PFLOPs". FP8 625, MXFP4 1,262 and 8 TB/s CONFIRMED. BF16 dash UNSUPPORTED: the page gives 2.5 PFLOPS dense, so the "dash means the cited source gives no figure" caption was false for this cell. Fixed: BF16 ridge 313 in the table and the dot plot, an MI355X BF16 row (2.5 dense, 5 sparse, 8 TB/s) in the inputs disclosure, `accessed` on amdMi355x moved to 2026-10-18.

2. Trainium3 FP4 marker on its FP8 marker, no value label: FIXED. When FP8 and FP4 share a ridge, the square now sits 8 units left of the value and the diamond 8 units right (3-unit gap between them); FP8 is labelled above, FP4 below; the plot bottom moved from +22 to +30 below the last row to make room. Verified on screenshots: /tmp/vf-RooflineAndArithmeticIntensity-shots/roofline-1440-svg1.png shows "514" above the square and "514" below the diamond, both clear. At 390 the per-diagram shot is clipped by the scroll wrapper, so a separate shot scrolled to the right (/tmp/vf-RooflineAndArithmeticIntensity-shots/wrapper1-right.png) shows the same two labels, clear, at 10 px rendered text. Probe "ok" at both widths.

3. Rubin HBM4 bandwidth: CONFIRMED, names its page and figure. The ridge table cites the HGX page's Individual NVIDIA Rubin GPU table ("288 GB HBM4 | 22 TB/s"). The disclosure names all three: 22 TB/s (HGX individual-GPU table), 19.2 TB/s (Vera Rubin NVL72 page, "288 GB HBM4 | 19.2 TB/s"), and the HGX Rubin NVL8 board ("2 TB HBM4 | 130 TB/s" across eight GPUs, which is 16.25 per GPU, shown as the board figure rather than per GPU). It states why the table uses 22 and gives the ridges at 19.2 and on the NVL8 board. One sentence in that paragraph was wrong ("On all three the BF16 ridge stays inside the range of earlier generations": 182 at 22 TB/s is below H200's 206) and now reads "stays below H100's 295".

## Fixes applied

- src/sections/RooflineAndArithmeticIntensity.tsx:170-175, MI355X BF16 ridge cell. Before: `'-'`. After: `313` with a derived Cite on amdMi355x, "Peak BF16 matrix 2.5 PFLOPS (5 with structured sparsity). 2,500 / 8 = 312.5."
- src/sections/RooflineAndArithmeticIntensity.tsx:313, inputs table. Added row "MI355X, BF16 | 2.5 PFLOPS | 5 PFLOPS | 8 TB/s", cited to amdMi355x.
- src/sections/RooflineAndArithmeticIntensity.tsx:426. Before: "tops out near 68 tokens per second". After: "near 69" (4,800 / 70 = 68.57).
- src/sections/RooflineAndArithmeticIntensity.tsx:468-471. Before: "At a fixed precision the ridge stays flat or falls: BF16 runs 295 on H100, 281 on B200 and 182 on Rubin, whose HBM4 grew faster than its BF16 rate." After: "At a fixed precision the ridge stays within a factor of 2 from H100 to Rubin, and at BF16 it falls: 295 on H100, 281 on B200 and 182 on Rubin, whose HBM4 grew faster than its BF16 rate." (Spread from H100 to Rubin: BF16 1.6x, FP8 1.9x, FP4 1.5x, or 1.7x with GB300.)
- src/sections/RooflineAndArithmeticIntensity.tsx:513, added `<Cite s={S.sparsityBlog} />` to "Sparse rates apply only to weights pruned to the 2:4 structured pattern".
- src/sections/RooflineAndArithmeticIntensity.tsx:527-529. Before: "On all three the BF16 ridge stays inside the range of earlier generations." After: "On all three the BF16 ridge stays below H100's 295."; derived note extended with "32 PFLOPS / 130 TB/s = 246 for BF16".
- src/sections/RooflineAndArithmeticIntensity.tsx:568, added `<Cite s={S.fa4Readme} />` after the fa4Release cite for "FlashAttention-4, in beta, on Blackwell".
- src/sources/RooflineAndArithmeticIntensity.ts:45-51, new record fa4Readme (same URL, title, publisher and tier 1 as KvCacheAndFlashAttention.ts), accessed 2026-10-18.
- src/sources/RooflineAndArithmeticIntensity.ts:80-86, new record sparsityBlog, "Structured Sparsity in the NVIDIA Ampere Architecture and Applications in Search Engines (2023-07-03)", NVIDIA developer blog, tier 2, accessed 2026-10-18. Text: "sparse Tensor Cores, which require a 2:4 sparsity pattern".
- src/sources/RooflineAndArithmeticIntensity.ts:135, amdMi355x accessed 2026-10-16 to 2026-10-18; header comment notes the three verification-pass fetches.
- src/components/RooflineChart.tsx:204, MI355X `bf16: 313` added to ridgeChips.
- src/components/RooflineChart.tsx:226, BF16 band `to: 295` to `to: 313`.
- src/components/RooflineChart.tsx:238, title "BF16 ridges fall between 137 and 295" to "137 and 313".
- src/components/RooflineChart.tsx:213-214, plotBottom `+ 22` to `+ 30`.
- src/components/RooflineChart.tsx:284-325, shared FP8/FP4 point: markers split by 8 units each way (was 6, which left them touching), FP8 label above its square, FP4 label (previously suppressed) below its diamond.

## Checks

- `pnpm exec tsc --noEmit 2>&1 | grep -E "RooflineAndArithmeticIntensity|RooflineChart|sources/RooflineAndArithmeticIntensity"`: no hits (grep exit 1), no type errors in my files.
- `pnpm exec eslint src/sections/RooflineAndArithmeticIntensity.tsx src/sources/RooflineAndArithmeticIntensity.ts src/components/RooflineChart.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t RooflineAndArithmeticIntensity`: exit 0, 1 passed, 34 skipped.
- Gates from the repo root, `grep -E "RooflineAndArithmeticIntensity|RooflineChart"` on each output: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0, pre-overflow exit 0; no hits in my files.
- `pnpm exec vite build --outDir /tmp/vf-RooflineAndArithmeticIntensity-dist --emptyOutDir`: exit 0.
- `node scripts/shoot.mjs --sections roofline --widths 1440,390 --out /tmp/vf-RooflineAndArithmeticIntensity-shots --dist /tmp/vf-RooflineAndArithmeticIntensity-dist`: exit 0, "roofline @1440: 2 SVG diagram(s), 0 React Flow, ok" and "roofline @390: ... ok". PNGs read: roofline chart unchanged and clean; dot plot clean at both widths, including the Trainium3 row. Extra 390 shot with the scroll wrapper scrolled right (script in /tmp/vf-roof-scripts): wrapper 640 px wide in a 308 px viewport, text at 10 px, labels clear.

## For the orchestrator

- MI355X BF16: the AMD page gives "Peak bfloat16 (BF16) Matrix Performance 2.5 PFLOPs" (5 with structured sparsity). The register's ridge table (research/2026-10-refresh/05-workloads.md) has no MI355X BF16 row, and the author's report says "MI355X BF16 ... no figure in the cited sources". Any other section that shows MI355X BF16 as missing or says AMD gives no BF16 figure should be corrected (HbmAndBandwidthWall and QuantizationAndPrecision cite the same page).
- The register's "at a fixed precision the ridge does not march right" is right; this section had hardened it to "stays flat or falls", which its own FP8 column (B200 562, Rubin 795) contradicts. If another section (Thesis and Framing, Quantization and Precision) repeats "flat or falls", it has the same error.
- The ridge-point reference table rounds x.5 halves to even (562.5 to 562, 1,262.5 to 1,262, 1,687.5 to 1,688). The new MI355X BF16 cell rounds 312.5 up to 313. Within rounding either way; flag only if the dive wants one rule.
- Glossary: no new acronyms from these fixes.

## Backlog

- Economy: the inputs disclosure could drop the columns that only restate the ridge table, or the dot plot could replace the ridge table's numbers; an enhancement, not a correction.
- The inputs table's sparse column shows "-" for Trainium2 and Trainium3, whose pages do give sparse figures ("2,563 FP8/FP16/BF16/TF32 sparse TFLOPS"; "2,517 FP16/BF16/TF32 sparse TFLOPS"). The header says "Sparse peak (2:4)" and Trainium sparsity is not documented as 2:4 only, so the dash is defensible; a footnote naming Trainium's own sparse figures would be clearer.
- MI355X MXFP6 runs at the MXFP4 rate (10.1 PFLOPS); the section could note it alongside the Trainium3 MXFP4-at-MXFP8 point.
