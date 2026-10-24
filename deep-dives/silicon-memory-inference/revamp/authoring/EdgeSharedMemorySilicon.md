# Change report: EdgeSharedMemorySilicon (nav id `edge-shared-memory`)

Register: `research/2026-10-refresh/04-other-arch.md` section 0 (DGX Spark, Jetson and RTX
Spark rows) and section 6 (ES1 to ES43, Recommended edits 1 to 7, all applied).

Files: `src/sections/EdgeSharedMemorySilicon.tsx` (rewritten in place),
`src/components/EdgeSocComparisonDiagram.tsx` (rebuilt), `src/components/SparkTopologyCapture.tsx`
(root svg tag rewritten at load, caption cited), `src/sources/EdgeSharedMemorySilicon.ts` (new,
29 records, all cited: 5 Tier 0, 6 Tier 1, 17 Tier 2, 1 Tier 3).

Tier 0: the DGX Spark capture under `research/dgx-spark/` (NOTES.md, lstopo.txt, lscpu.txt,
nvidia-smi.txt, spark-topology.svg), cited at origin/main commit
d65693b49ca8245ff06cd8c452e47f70a3e8c3ad, publisher "Our experiment", per the orchestrator's
correction (this branch is never pushed). `git ls-tree` confirmed all five files exist at that
commit.

Fetched during authoring (records carry 2026-10-17): Hot Chips 2025 GB10 slides (PDF, text
extracted: "~600GB/s of aggregate bandwidth", "GPU has access to entire system bandwidth over the
C2C interface", "S-dielet (CPU, memory subsystem, etc.) + G-dielet (GPU core)", "Both S-dielet
and G-dielet in TSMC 3nm", "Advanced 2.5D packaging", "16MB L3 cache per cluster", "Hardware-
enabled bidirectional coherency", "Removes the performance overhead of Cache Management
Operations"), DGX Spark product page (64 GB OEM footnote, 273 GB/s, "Up to 1 PFLOP FP4" with no
sparsity footnote, up to four units, 400B and 700B rows, no price), GB10 newsroom release
("CPU+GPU-coherent memory model with 5x the bandwidth of fifth-generation PCIe"), DGX Spark 64GB
blog (1.7x is "compared with a single system" in a Qwen 3.8 27B test; "up to
100-billion-parameter models"; "Starting Friday, Oct. 23", "starting at $4,999"; no bandwidth
figure), Jetson Thor blog ("2070 TFLOPS (Sparse FP4)", "128 GB 256-bit LPDDR5X, 273 GB/s",
"14-core Arm Neoverse-V3AE", "40 W - 130 W"), Orin Nano Super Boost blog ("same hardware
architecture", "with just a software update"), RTX Spark blog (20-core Grace CPU, 1 petaflop
Blackwell GPU with no sparse or dense label, up to 128 GB, no bandwidth, no chip name, October),
LMSYS review (803 tokens/s prefill, 2.7 decode, FP8; batch size not stated for that result).

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| ES1, ES12 | Spark "128 GB LPDDR5X, unified and coherent" | 128 GB, or 64 GB from OEM partners only | sparkProductPage (T2), sparkHardware (T1) |
| ES2, ES21 | "Teardown analysis describes two TSMC N3 dies ... CoWoS-R ...; NVIDIA's own documentation does not state a die count" | GB10 is two dielets in TSMC 3 nm on 2.5D packaging: S-dielet (CPU and memory subsystem), G-dielet (Blackwell GPU) | gb10HotChips (T2) |
| ES3 | Jetson "sharing is free because there is only one memory controller" | a Jetson module is one Tegra SoC whose CPU and integrated GPU share the same DRAM, "no chip-to-chip link to cross" | tegraAppNote (T1) |
| ES4 | "an NVL72 rack holds 30 TB ... 130 TB/s NVLink domain" | a GB200 NVL72 rack, about 30 TB (13.4 TB HBM3e + 17 TB LPDDR5X), 130 TB/s aggregate | gb200Nvl72 (T2, derived; record reused from GraceBlackwellUltraServer) |
| ES5 | "Section 1, 3, 7, 14, 24, 25, 26" | section names from the brief's table | - |
| ES7 | "The porting guide confirms the layout" | porting guide confirms the mixed clusters only; L3 conflict stated: lstopo 8 MB + 16 MB, porting guide 16 MB "high-performance cluster" / 8 MB "high-efficiency cluster" (contradicting its own mixed-cluster text), Hot Chips 16 MB per cluster | sparkLstopo (T0, measured), sparkPortingGuide (T1), gb10HotChips (T2) |
| ES10, ES11 | sparse footnote attributed to the product page | "with sparsity" attributed to the hardware overview; no dense figure in hardware overview, product page or Hot Chips slides | sparkHardware (T1), gb10HotChips (T2) |
| ES15, ES22, ES23 | "no absolute GB/s published" (table, diagram, warning Alert, UNKNOWN item 1, lens question 3); TechInsights derivation | about 600 GB/s aggregate (vendor figure, Hot Chips 2025) in table, diagram, link paragraph and lens; "5x PCIe Gen 5" kept; the warning Alert and UNKNOWN item 1 deleted | gb10HotChips (T2), gb10Newsroom (T2) |
| ES17, ES33 | "two-unit cluster up to 405B params" (table, diagram, expandable) | up to four units; product page 2x 256 GB up to 400B, 4x 512 GB up to 700B; hardware overview 405B dual-Spark, conflict stated | sparkProductPage (T2), sparkHardware (T1) |
| ES18 | Spark price "UNKNOWN"; Jetson "$249 developer kit" | Spark $4,699 Founders Edition, MSRP as of 23 February 2026; 64 GB OEM from $4,999 on sale from 23 October 2026; Orin Nano Super kit $399 as of October 2026 | sparkPriceChange (T2), spark64Gb (T2), jetsonFaq (T2) |
| ES19 | "$499 to $249" price history | removed (see below); the TOPS, bandwidth and clock uplift kept, plus "same hardware, JetPack upgrade" | orinNanoSuperPage (T2), orinSuperBoostBlog (T2) |
| ES24 | "unified memory on Tegra pays cache management ... NVIDIA recommends stream-attach prefetch hints" | On Orin coherency is one-way (I/O): GPU still runs cache maintenance at launch and sync; app note examples use `cudaStreamAttachMemAsync`; Thor is the first Jetson with full two-way coherency | tegraAppNote (T1) |
| ES26 | "Llama 3.1 8B (NVIDIA-published config) 38.65" | Llama 3.1 8B (NVFP4, TensorRT-LLM) 38.65 | sparkPerfBlog (T2, vendor-claim) |
| ES27 | gpt-oss-20B "50 to 80 t/s (sources disagree)", gpt-oss-120B "35 to 53 t/s", Tier 3 | gpt-oss-20b 82.74 and gpt-oss-120b 55.37 (MXFP4, llama.cpp), NVIDIA Oct 2025; January 2026 llama.cpp MoE uplift of 35% on average and NVFP4 plus speculative decoding up to 2.6x on dual Spark, both per NVIDIA | sparkPerfBlog, sparkSoftwareBlog (T2, vendor-claim) |
| ES28 | "Llama 3.1 70B (FP8, SGLang, batch 1) 2.7 t/s" | 2.7 (FP8, SGLang); the cite note states LMSYS gives no batch size for this result | lmsysSpark (T3, measured; re-fetched) |
| ES29 | "Qwen3 235B (over ConnectX-7) 11.73" | Qwen3 235B (NVFP4, TensorRT-LLM) 11.73 | sparkPerfBlog (T2, vendor-claim) |
| ES35 | "Both land at 70 to 80 percent" | "about 70 and 75%" | lmsysSpark, jetsonAiLab (derived) |
| ES36 | "Spark: 10,256.9 t/s ... NVIDIA-published" under "The same machines prefill" | "Spark prefills at thousands ...: NVIDIA reports 10,256.9 tokens/s (NVFP4, TensorRT-LLM, 2,048 input tokens)" | sparkPerfBlog (T2, vendor-claim) |
| (shape) | h2 "Evaluation lens" was followed by the UNKNOWN register | UNKNOWN register moved into a collapsed container before the lens, so the section ends on the reader's checks | - |

CORRECT claims kept and re-cited: ES6, ES8, ES9 (CUDA cores), ES13, ES14, ES16, ES20, ES30, ES31,
ES32, ES38, ES39.

## Claims removed

- ES25 (Tier 3 GPU wattage, 94 W and 120 W): CUT candidate.
- ES34 (Tier 4 GLM 1-bit, 1.5 to 8.9 t/s): CUT candidate.
- ES37 (EXO Labs prefill on Spark, decode elsewhere): CUT candidate, not re-verified. The
  prefill/decode asymmetry stays and points to Disaggregated Serving and Speculative Decoding.
- CoWoS-R / TechInsights attribution: no URL in the register and not re-fetched; NVIDIA's own
  "advanced 2.5D packaging" carries the point.
- Tier 3 llama.cpp discussion thread and JetsonHacks ranges, and the "60.85 vs 79.74" note:
  superseded by NVIDIA's own table (ES27).
- "The community converged on MoE models (... Qwen3-Coder-30B-A3B)": its Tier 3 sources were
  dropped; the page now argues from the table instead.
- Jetson price history ($499 to $249): failed the test (no decision depends on it; the current
  price is in the table).
- Jetson CPU topology "one quad cluster + one dual cluster", Jetson "GbE only" scale-out, Spark
  "1.2 kg", "5th-gen Tensor Cores" in the table: trivia or unsourced in the register; dropped to
  make room for the Thor column.
- "Three orders of magnitude in capacity and bandwidth": compared NVLink domain bandwidth with
  memory bandwidth; removed.
- "Whisper-class ASR" stays only as an open item (unchanged scope).

## UNKNOWNs and how the page handles each

Collapsed container "Open items: what NVIDIA does not publish", placed before the lens:
1. Dense FP4 for Spark, Tensor and RT Core counts for GB10 (ES38): scoped to the hardware
   overview, product page and Hot Chips slides.
2. GB10 CPU clocks: our lscpu stands in (ES8).
3. NEW: memory bandwidth for RTX Spark, Orin Nano 2 and T4000: "not given in the NVIDIA
   announcements read for this section".
4. ConnectX-7 not enumerating on our uncabled unit (ES39): stated in the clustering expandable
   with the practical reading (an empty `lspci` on an uncabled unit does not prove the NIC is
   missing) and listed as unresolved.
5. Whisper-class ASR on the Orin Nano tier: "none located at Tier 1 or 2 during this research".

Not used: the higher NVIDIA Marketplace price [T3-10] (search snippet only). The Spark price is
dated to the 23 February 2026 MSRP change, not claimed as today's price.

## NEW content and sources

- Jetson AGX Thor (T5000) as the middle of the continuum: third table column, third diagram
  panel, intro sentence, coherence paragraph (thorBlog T2, tegraAppNote T1, jetsonFaq T2).
- Jetson T4000 (64 GB, 40 to 70 W, 1,200 FP4 TFLOPS sparse): one clause (t4000Blog T2).
- RTX Spark: one sentence, kind roadmap (rtxSpark T2).
- Jetson Orin Nano 2: one sentence, kind roadmap, vendor claims kept as claims (orinNano2 T2).
- DGX Spark 64 GB and four-unit clustering (sparkProductPage, spark64Gb T2).
- Tier 0 additions from the existing capture: OpenCL view of 48 compute units and 121 GB
  (sparkTopologySvg), per-process GPU allocation still listed while Memory-Usage is "Not
  Supported" (sparkNvidiaSmi).
- gpt-oss-120b 117B total / 5.1B active, to explain the 2.7 vs 55.37 tokens/s gap
  (gptOss120bReadme T1, record reused from MoeAndSparseActivation).

## Diagrams

- `EdgeSocComparisonDiagram`: rebuilt from two panels of spec rows (duplicating the table) into
  three panels that show the mechanism: on Spark the G-dielet reaches the LPDDR5X through the
  S-dielet over NVLink-C2C (about 600 GB/s aggregate, two-way coherent); Thor and Orin are one SoC
  each, two-way versus one-way coherence; each pool's capacity, bus width and bandwidth. Now
  `role="img"`, `aria-labelledby="edge-soc-title"` with a sentence-level `<title>`, viewBox 920 x
  372 only, full-bleed white background, fonts 11 to 13 px sans-serif, `esc-` class prefix,
  wide-diagram phone convention (`overflowX: auto` wrapper, `minWidth: 640`). Every drawn figure
  is cited in the spec table directly below it.
- `SparkTopologyCapture`: the lstopo SVG asset is untouched (it mirrors the Tier 0 file); the
  component rewrites the root tag at module load: XML prolog stripped, `aria-label` replaced with
  `aria-labelledby` plus a `<title id="spark-lstopo-title">`, and the width attribute replaced
  with `width: 100%; min-width: 1000px; height: auto`. Threshold: lstopo draws 10 px text in a
  1261-unit viewBox, so 1000 px keeps it near 7.9 px on a phone, where the dive's 640 default
  would shrink it to about 5 px. Caption trimmed to the GPU fact and cited Tier 0.
- Rendered check (`scripts/shoot.mjs`, 1440 and 390): probe reports "2 SVG diagram(s), ok" at
  both widths (no overlaps, no clipping, no page overflow). Visual read of the PNGs: at 1440 the
  three panels are clean, labels sit beside the arrows, nothing crosses a line; at 390 both
  diagrams scroll sideways inside their container with legible text. The decode table first cut
  off its decode column at 390; merging precision and backend into the model column and
  narrowing min widths fixed it (re-shot, all three columns visible). The four-column spec table
  scrolls sideways at 390 (Cloudscape default).

## Word count

Counter `/tmp/edge-tools/wc.mjs` (copy of `/tmp/kl-tools/wc.mjs`: rendered `main` at 1440, every
disclosure open, Cite badges, SVG text and code excluded): **2,138 before, 2,482 after (+16%)**.
Growth comes from register NEW items: the Thor column and sentences (ES41, edit 4), T4000,
RTX Spark and Orin Nano 2 (ES42, ES43, edit 5), the 64 GB and four-unit clustering text (ES40,
ES17, edit 2), and the January 2026 uplift sentence (ES27, edit 3). Offsets: the warning Alert,
the GLM, EXO and wattage sentences, the Tier 3 range notes, three table rows and the duplicated
intro paragraph were cut.

## Leverage pass: claim-set diff (assertions in the after that were not in the before)

| New assertion | Source |
| --- | --- |
| 64 GB OEM configuration | sparkProductPage |
| Thor: 14 Neoverse-V3AE, Blackwell, 128 GB 256-bit LPDDR5X at 273 GB/s, 2,070 TFLOPS sparse FP4, 40 to 130 W | thorBlog (fetched) |
| T4000: 64 GB, 40 to 70 W, 1,200 FP4 TFLOPS sparse | t4000Blog |
| RTX Spark facts and its silences (no bandwidth, no chip name) | rtxSpark (fetched) |
| Orin Nano 2: 78 TOPS, 8 GB, 2x claim, H1 2027, no bandwidth figure | orinNano2 |
| GB10 dielets, TSMC 3 nm, 2.5D, ~600 GB/s aggregate, two-way coherence removes CMO overhead, 16 MB L3 per cluster | gb10HotChips (fetched) |
| "The link is wider than the 273 GB/s memory behind it, so memory sets the decode ceiling" | gb10HotChips ("GPU has access to entire system bandwidth over the C2C interface") plus sparkHardware |
| Orin one-way coherence, Thor full coherency, `cudaStreamAttachMemAsync` in examples | tegraAppNote |
| Prices and dates | sparkPriceChange, spark64Gb (fetched), jetsonFaq |
| Four-unit clustering, 400B / 700B vs 405B, 64 GB up to 100B, 1.7x vs one system | sparkProductPage (fetched), sparkHardware, spark64Gb |
| "Product page lists both memory options and a single bandwidth, 273 GB/s" | sparkProductPage (fetched) |
| gpt-oss-20b 82.74, gpt-oss-120b 55.37 | sparkPerfBlog |
| 35% llama.cpp MoE uplift, 2.6x NVFP4 + speculative decoding | sparkSoftwareBlog |
| gpt-oss-120b 117B total, 5.1B active | gptOss120bReadme |
| 100 W for the rest of the system | sparkHardware |
| Super mode on the same hardware via a JetPack upgrade | orinSuperBoostBlog (fetched) |
| "Check which mode a deployment runs, because the mode sets the bandwidth that decode tracks" | our reading of orinNanoSuperPage (68 vs 102 GB/s by mode) |
| "With 8 GB again, the size of model that fits does not change" | our reading of orinNano2 (8 GB) |
| Per-process GPU allocation still listed (2,772 MiB) | sparkNvidiaSmi (T0) |
| OpenCL view: 48 compute units, 121 GB | sparkTopologySvg (T0) |
| "Size models against about 122 GB, not 128" | our reading of sparkLstopo / sparkNotes (T0) |
| "An empty lspci on an uncabled unit does not prove the NIC is missing" | sparkNotes (T0) plus twoSparksPlaybook |
| GB200 NVL72 about 30 TB | gb200Nvl72 (derived sum) |
| LMSYS gives no batch size for the 2.7 result (cite note) | lmsysSpark (fetched) |

No assertion in the after lacks a source.

## Orchestrator actions

- Regenerate `sources.md` (the sources test fails only on the sync check; tier consistency and
  pinning pass).
- Glossary acronyms introduced or used in this section, expanded at first use: LPDDR, VRAM, OEM,
  MoE, SLM, SoC, TDP, MSRP, HBM3e, NUMA, TOPS, NVFP4, MXFP4, MLC, VLM, KV, NIC, RoCE, RDMA, ASR,
  RT (ray tracing), C2C. Check which are missing from `GlossaryAndSources.tsx`.
- Cross-section notes for later authors: GB10 NVLink-C2C is "~600GB/s of aggregate bandwidth"
  (NVIDIA, Hot Chips 2025, Tier 2), never "unpublished"; GB10 is S-dielet plus G-dielet in TSMC
  3 nm. Jetson Thor is the first Jetson with two-way CPU-GPU coherence (CUDA for Tegra app note);
  Orin is one-way. DGX Spark MSRP $4,699 Founders Edition since 23 February 2026; Jetson Orin
  Nano Super developer kit $399 (Jetson FAQ, October 2026).
- `App.tsx` nav title ("Edge Shared-Memory Silicon: DGX Spark and Jetson") already matches the h1.
