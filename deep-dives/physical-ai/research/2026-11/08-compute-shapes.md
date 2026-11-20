# 08 Compute shapes: which part of the machine each workload loads: research register

## 1. Header

- **Research date:** 2026-11-20. Every URL in this file was accessed 2026-11-20.
- **Area:** stream 08 of the "Physical AI" dive. The map from workload to machine part (CPU front end and back end, memory, GPU tensor cores, GPU ray-tracing cores, video engines, GPU memory, storage, network), how to read a machine with its own counters (top-down analysis on x86 and Arm, GPU counters), our own measurements (Tier 0), the EC2 families that carry each part, and the method for price-performance.
- **Sections fed:** 20 "Fifteen Workloads, Five Shapes", 21 "Reading a Machine: PMU Cards", 22 "Our Measurements", 23 "Price-Performance and Latency"; the instance table also serves section 25.
- **Thread task:** an SO-101 robot arm picks up a block and places it in a cup.
- **Reader:** technical, level 100 to 200 (IT or software), no robotics background.
- **Quote policy:** quotes are verbatim from the pinned version, with house normalisation: curly quotes become straight quotes, typographic dashes become " - " or a hyphen, inline math is shown as plain text. Ellipses mark omissions.
- **Verdicts:** NEW (recorded fresh from the primary source); CARRIED (seed NN, re-fetched); STALE (superseded by a newer version); WRONG (seed said X, source says Y); UNKNOWN (unresolved, see the UNKNOWN register).
- **Labels:** `[vendor claim]` and `[author reported]` for performance figures printed by the party that built the thing; `[derived]` for arithmetic, with inputs shown; `[our reading]` for synthesis.
- **Seed:** "the seed research": seed 08 (synthesis, the workload rows and five shapes), seed 10 (profiling shortlist), seed 11 (the one-arm pipeline in eight phases), seed 03 section 1 (instance table).
- **Reused from the other registers, not re-fetched:** per-workload compute figures (registers 01 to 06), the NVIDIA video encode and decode matrix (register 05, F05-46 to F05-57), ray-tracing cores and the Isaac Sim rule (register 06, F06-56 to F06-60). They are cited here by entry ID.
- **Tier 0 in this file:** the measured results in `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/`. Every figure from that folder is **one run**, one core, one thread, on stand-in workloads.

### Tiers

| Tier | What it covers |
|---|---|
| Tier 0 | Our experiments: `research/experiments/E-seed-profiling-2026-11-19/` (single run) |
| Tier 1 | Source code at a pinned tag or 40-character SHA; official docs; API references; vendor event and metric files |
| Tier 2 | First-party vendor or lab blogs, announcements and talks |
| Tier 3 | Papers ("peer-reviewed (venue)" only where the venue was confirmed, otherwise "preprint"); third-party technical analysis |
| Tier 4 | Tutorials and press. Used only to locate primary sources |

Code over docs over blogs. Vendor and author performance numbers are claims, not measurements.

**Evidence kinds:** definition, documentation of support, benchmark claim (author or vendor reported), our measurement, code behaviour.

## 2. Currency table

Newest first-party version or announcement found on 2026-11-20. "Date not recorded" means the release date was not captured in this pass; it does not mean the release is undated.

| Item | Newest version found | Release date | Source URL | What the seed research named |
|---|---|---|---|---|
| EC2 G families | G7 (RTX PRO 4500 Blackwell Server Edition) and G7e (RTX PRO 6000 Blackwell Server Edition) | G7: 2026-06-18; G7e: 2026-01-20 | https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-ec2-g7-generally-available/ ; https://aws.amazon.com/about-aws/whats-new/2026/01/amazon-g7e-instances-generally-available/ | G5, G6, Gr6, G6f, G6e, G7, G7e (same newest families) |
| EC2 P families | In the specification table: P6-B200, P6-B300, P6e-GB200. Announced and absent from the table: P6e-GB300. No Rubin-based family located (U08-5) | P6e-GB300: 2025-12-02; P6-B200 and P6-B300: month known from URL paths only (U08-11) | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html ; https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-p6e-gb300-ultraservers-nvidia-gb300-nvl72-generally-available | P4d, P5, P5e, P5en, P6-B200, P6e-GB200/GB300 |
| AWS Graviton | Graviton5 (Neoverse V3) in M9g/M9gd, C9g/C9gd, R9g/R9gd | 2026-06-10, 2026-06-30, 2026-08-31 | https://aws.amazon.com/about-aws/whats-new/2026/06/ec2-m9g-m9gd-instances-graviton5-processors-available/ (others in section 11) | C8g and M8g (Graviton4 generation); Graviton5 not named |
| Intel top-down metrics file | TMA_Metrics-full.csv, version "5.2-full" | Repository head commit 2026-11-20; date of version 5.2 itself not recorded | https://github.com/intel/perfmon at c6875bae4fe4322e88c6b265962901672bfa97c9 | No version named |
| Intel VTune cookbook, top-down page | "2025.4 (latest)" | 2025-06-30 | https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/current/top-down-microarchitecture-analysis-method.html | No version named |
| Linux kernel (perf, metric files) | v7.3 (v7.4-rc3 is the newest release candidate) | 2026-10-18 | https://github.com/torvalds/linux at tag v7.3, c03c1a14507dfaf8b856c2608f9ac216021fc222 | The Tier 0 machines ran perf 6.17.13 (Spark); no kernel source version named |
| Arm Telemetry Solution | Tag 2026.09 (adds Cortex-X925 and Cortex-A725 files; previous tag 2025.09) | 2026-09-29 | https://gitlab.arm.com/telemetry-solution/telemetry-solution at ea533b733b9bad52223d16e768b7dab03cabb830 | "Arm's telemetry spec", no version; the formula check was left open |
| AWS Graviton performance guide | Repository head | 2026-11-18 | https://github.com/aws/aws-graviton-getting-started at 541d1ad524bb1630e16b8e66aef36dcd01a3bbc1 | Not named |
| NVIDIA Nsight Compute | 2026.4.0 | Date not recorded | https://docs.nvidia.com/nsight-compute/ReleaseNotes/index.html | 2025.3.1 (Spark) and 2024.3.1 (Jetson), as installed |
| NVIDIA Nsight Systems | 2026.6 (2026.6.1) | Date not recorded | https://docs.nvidia.com/nsight-systems/ReleaseNotes/index.html | 2025.3.2 and 2024.5.4, as installed |
| NVIDIA DCGM | v4.7.0 | Date not recorded | https://github.com/NVIDIA/DCGM at tag v4.7.0, 9fae2867e6e5264fa0fca22a07dc898d591baa21 | Named without a version |
| Jetson Linux (tegrastats page) | r39.2.2 (JetPack 7.2.2, F07-44) | See F07-44 | https://docs.nvidia.com/jetson/archives/r39.2.2/DeveloperGuide/AT/JetsonLinuxDevelopmentTools/TegrastatsUtility.html | The Jetson ran L4T R36.4.7 |
| NVIDIA video encode and decode matrix | Page as fetched today (undated page) | Not dated | https://developer.nvidia.com/video-encode-decode-support-matrix | Used without a date |

## 3. Pinned sources

### Papers

| Paper | Version or venue | Role | Entries |
|---|---|---|---|
| A. Yasin, "A Top-Down Method for Performance Analysis and Counters Architecture" | ISPASS 2014 (venue as printed in Intel's repository README), DOI 10.1109/ISPASS.2014.6844459; body not fetched (U08-12) | History: the paper that introduced the method | F08-1 |
| Arm, "Arm Neoverse V1 Core: Performance Analysis Methodology" | Vendor white paper, no date found on the PDF; https://armkeil.blob.core.windows.net/developer/Files/pdf/white-paper/neoverse-v1-core-performance-analysis.pdf | Arm's definition of a slot and of the four categories | F08-14, F08-15, F08-17 |

### Code and vendor data files

| Repository | Ref | 40-character SHA | Files read |
|---|---|---|---|
| https://github.com/intel/perfmon | default branch head, 2026-11-20 | c6875bae4fe4322e88c6b265962901672bfa97c9 | `TMA_Metrics-full.csv`, `README.md` |
| https://github.com/torvalds/linux | tag v7.3 | c03c1a14507dfaf8b856c2608f9ac216021fc222 | `tools/perf/Documentation/perf-stat.txt`, `tools/perf/Documentation/topdown.txt`, `tools/perf/pmu-events/arch/x86/amdzen4/pipeline.json`, `amdzen5/pipeline.json`, `amdzen6/pipeline.json`, `tools/perf/pmu-events/arch/arm64/sbsa.json`, `arch/arm64/arm/neoverse-v1/metrics.json`, `neoverse-n2-v2/metrics.json`, `neoverse-v3/metrics.json`, `tools/perf/arch/arm64/util/pmu.c` |
| https://gitlab.arm.com/telemetry-solution/telemetry-solution | tag 2026.09 | ea533b733b9bad52223d16e768b7dab03cabb830 | `RELEASE_NOTES.md`, `data/pmu/cpu/mapping.json`, `data/pmu/cpu/specifications/neoverse/neoverse_v1_r1p2_pmu.json`, `neoverse_v2_r0p0_pmu.json`, `neoverse_v3_r0p0_pmu.json`, `neoverse_n1_r4p1_pmu.json`, `data/pmu/cpu/specifications/cortex/cortex_x925_r0p0_pmu.json`, `cortex_a725_r0p0_pmu.json` |
| https://github.com/aws/aws-graviton-getting-started | default branch head, 2026-11-18 | 541d1ad524bb1630e16b8e66aef36dcd01a3bbc1 | `perfrunbook/debug_hw_perf.md`, `README.md` |
| https://github.com/NVIDIA/DCGM | tag v4.7.0 | 9fae2867e6e5264fa0fca22a07dc898d591baa21 | Tag list only (newest version); the field definitions come from the docs page |

The GitHub path `ARM-software/telemetry-solution` returned 404 on 2026-11-20; the GitLab URL above is the one that resolves.

### Docs (all accessed 2026-11-20)

- Intel VTune Profiler cookbook, "Top-down Microarchitecture Analysis Method", version 2025.4.
- EC2 instance type specifications: accelerated computing (`ac.html`), general purpose (`gp.html`), compute optimized (`co.html`).
- EC2 User Guide, Elastic Fabric Adapter (`efa.html`). FSx for Lustre User Guide, performance page.
- AWS What's New posts for G7, G7e, P6e-GB300, M9g, C9g, R9g; the G7 and M9g product pages; the About Amazon article of 2026-08-26.
- NVIDIA: `nvidia-smi` documentation; DCGM User Guide, Feature Overview; Nsight Compute 2026.4.0 Profiling Guide and Release Notes; Nsight Systems 2026.6 Release Notes; Jetson Linux r39.2.2 Tegrastats Utility; Video Encode and Decode Support Matrix; Tensor Cores product page.
- Full URLs are in section 11.

## 4. Claim register

Sections A to D are the method (how a machine is read). E defines the machine parts. F is the instance table. G is
Tier 0. H and I are the workload map and the shapes. J is the price-performance method.

### A. Top-down analysis on x86: Intel's method and AMD's equivalent (section 21)

**F08-1. (History.) Top-down analysis was introduced by Ahmad Yasin of Intel in a 2014 conference paper. Intel's own metrics repository still names that paper as the method's reference.**
- Location: `README.md`, heading "Top-down Microarchitecture Analysis (TMA)" and the references list
- Verdict: NEW
- Evidence: https://github.com/intel/perfmon/blob/c6875bae4fe4322e88c6b265962901672bfa97c9/README.md | Tier 1, first-party repository at a pinned SHA (the paper itself, DOI 10.1109/ISPASS.2014.6844459, is Tier 3, peer-reviewed (ISPASS 2014) per this README, and its body was not fetched) | definition | "A Top-Down Method for Performance Analysis and Counters Architecture. Ahmad Yasin. In IEEE International Symposium on Performance Analysis of Systems and Software, ISPASS 2014." and "Official TMA releases. Performance architect maintained metrics for Top-down analysis methodology." (accessed 2026-11-20)
- Use in dive: section 21, one sentence of history: the method is from 2014, the formulas the reader should use are the current files below.

**F08-2. A pipeline slot is the unit the method counts. Intel's VTune documentation: "A pipeline slot represents the hardware resources needed to process one uOp." Each core has a fixed number of slots per clock cycle.**
- Location: VTune Profiler Performance Analysis Cookbook, "Top-down Microarchitecture Analysis Method", version label "2025.4 (latest)", page date 6/30/2025
- Verdict: NEW
- Evidence: https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/current/top-down-microarchitecture-analysis-method.html | Tier 1, first-party docs | definition | "A pipeline slot represents the hardware resources needed to process one uOp." and "for each CPU core, on each clock cycle, there are four pipeline slots available." (accessed 2026-11-20)
- Use in dive: section 21, the definition of a slot. The "four" in the second quote is out of date for current cores (F08-8, and section 8).

**F08-3. Intel's VTune page classifies each slot in each cycle into one of four categories by two questions: was a micro-operation delivered to the slot, and did it retire.**
- Location: same page, the paragraphs that walk the classification
- Verdict: NEW
- Evidence: https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/current/top-down-microarchitecture-analysis-method.html | Tier 1, first-party docs | definition | "Generally, if the stall is caused by the Front-end's inability to fill the slot with a uOp" ... "it will be classified as a Front-End Bound slot for this cycle"; "In the case where the Front-end has a uOp ready but cannot deliver it because the Back-end is not ready to handle it," ... "the empty pipeline slot will be classified as Back-End Bound."; "If it does retire, the slot is classified as Retiring."; "If it does not, either because of incorrect branch predictions by the Front-end" ... "the slot will be classified as Bad Speculation." (accessed 2026-11-20; quoted in fragments as returned by the fetch, order as on the page)
- Use in dive: section 21, the decision tree diagram: slot filled? retired? gives the four boxes.

**F08-4. Front-End Bound, Intel's definition in the current metrics file: the fraction of slots where the front end undersupplies the back end. The front end predicts the next address, fetches cache lines, parses them into instructions and decodes them into micro-operations.**
- Location: `TMA_Metrics-full.csv` (file header "TMA,Version,5.2-full"), row `Frontend_Bound`, column "Metric Description"
- Verdict: NEW
- Evidence: https://github.com/intel/perfmon/blob/c6875bae4fe4322e88c6b265962901672bfa97c9/TMA_Metrics-full.csv | Tier 1, vendor metric file at a pinned SHA | definition | "This category represents fraction of slots where the processor's Frontend undersupplies its Backend. Frontend denotes the first part of the processor core responsible to fetch operations that are executed later on by the Backend part. Within the Frontend; a branch predictor predicts the next address to fetch; cache-lines are fetched from the memory subsystem; parsed into instructions; and lastly decoded into micro-operations (uops). Ideally the Frontend can issue Pipeline_Width uops every cycle to the Backend. Frontend Bound denotes unutilized issue-slots when there is no Backend stall; i.e. bubbles where Frontend delivered no uops while Backend could have accepted them. For example; stalls due to instruction-cache misses would be categorized under Frontend Bound." (accessed 2026-11-20; the file uses ";" where prose would use ",")
- Use in dive: sections 20 and 21, the definition of the CPU front end as a machine part.

**F08-5. Back-End Bound, Intel's definition: slots where no micro-operation is delivered because the back end lacks the resources to accept one. It splits into Memory Bound and Core Bound.**
- Location: same file, row `Backend_Bound`, "Metric Description"
- Verdict: NEW
- Evidence: https://github.com/intel/perfmon/blob/c6875bae4fe4322e88c6b265962901672bfa97c9/TMA_Metrics-full.csv | Tier 1, vendor metric file | definition | "This category represents fraction of slots where no uops are being delivered due to a lack of required resources for accepting new uops in the Backend. Backend is the portion of the processor core where the out-of-order scheduler dispatches ready uops into their respective execution units; and once completed these uops get retired according to program order. For example; stalls due to data-cache misses or stalls due to the divider unit being overloaded are both categorized under Backend Bound. Backend Bound is further divided into two main categories: Memory Bound and Core Bound." (accessed 2026-11-20)
- Use in dive: sections 20 and 21, the definition of the CPU back end.

**F08-6. Memory Bound and Core Bound, Intel's level-2 split of the back end. Memory Bound: the pipeline is likely stalled on load or store instructions. Core Bound: a shortage of compute resources or dependencies between the program's instructions, for example a chain of long-latency floating-point operations.**
- Location: same file, rows `Memory_Bound` and `Core_Bound`
- Verdict: NEW
- Evidence: https://github.com/intel/perfmon/blob/c6875bae4fe4322e88c6b265962901672bfa97c9/TMA_Metrics-full.csv | Tier 1, vendor metric file | definition | "Memory Bound estimates fraction of slots where pipeline is likely stalled due to demand load or store instructions." and "This metric represents fraction of slots where Core non-memory issues were of a bottleneck. Shortage in hardware compute resources; or dependencies in software's instructions are both categorized under Core Bound. Hence it may indicate the machine ran out of an out-of-order resource; certain execution units are overloaded or dependencies in program's data- or instruction-flow are limiting the performance (e.g. FP-chained long-latency arithmetic operations)." Formula on the oldest column: "Backend_Bound - Memory_Bound" (accessed 2026-11-20)
- Use in dive: section 20 (core-bound versus memory-bound as two different parts), section 21 (level 2).

**F08-7. Bad Speculation and Retiring, Intel's definitions. Bad Speculation: slots that issued micro-operations which never retired, plus slots blocked while the pipeline recovered. Retiring: slots used by micro-operations that did retire; 100% would mean the core ran at its full width, and a high value does not prove there is nothing left to gain.**
- Location: same file, rows `Bad_Speculation` and `Retiring`
- Verdict: NEW
- Evidence: https://github.com/intel/perfmon/blob/c6875bae4fe4322e88c6b265962901672bfa97c9/TMA_Metrics-full.csv | Tier 1, vendor metric file | definition | "This category represents fraction of slots wasted due to incorrect speculations. This include slots used to issue uops that do not eventually get retired and slots for which the issue-pipeline was blocked due to recovery from earlier incorrect speculation." and "This category represents fraction of slots utilized by useful work i.e. issued uops that eventually get retired. Ideally; all pipeline slots would be attributed to the Retiring category. Retiring of 100% would indicate the maximum Pipeline_Width throughput was achieved. ... Note that a high Retiring value does not necessary mean there is no room for more performance." (accessed 2026-11-20)
- Use in dive: section 21. The second half of the Bad Speculation definition (recovery slots) is the part our Tier 0 formula leaves in the front-end bucket (F08-22).

**F08-8. Intel's level-1 formulas, in slots. Total slots = pipeline width x core clock cycles. Pipeline width in the current file: 4 from Sandy Bridge, 5 from Ice Lake, 6 from Alder Lake and Sapphire Rapids, 8 from Lunar Lake and Arrow Lake. On the oldest column: Frontend_Bound = IDQ_UOPS_NOT_DELIVERED.CORE / SLOTS; Retiring = retired slots / SLOTS; Bad_Speculation = (issued - retired + width x recovery cycles) / SLOTS; Backend_Bound = 1 - the other three. From Ice Lake the four are read from a dedicated metrics register.**
- Location: same file, rows `SLOTS`, `#Pipeline_Width`, `Frontend_Bound`, `Bad_Speculation`, `Backend_Bound`, `Retiring`; columns SNB, ICL, ADL/RPL, LNL/ARL
- Verdict: NEW
- Evidence: https://github.com/intel/perfmon/blob/c6875bae4fe4322e88c6b265962901672bfa97c9/TMA_Metrics-full.csv | Tier 1, vendor metric file | definition | SLOTS (SNB column): "#Pipeline_Width * CORE_CLKS", description "Total issue-pipeline slots (per-Physical Core till ICL; per-Logical Processor ICL onward)"; `#Pipeline_Width`: SNB "4", ICL "5", ADL/RPL "6", LNL/ARL "8"; Frontend_Bound (SNB): "IDQ_UOPS_NOT_DELIVERED.CORE / SLOTS"; Bad_Speculation (SNB): "( UOPS_ISSUED.ANY - #Retired_Slots + #Pipeline_Width * #Recovery_Cycles ) / SLOTS"; Backend_Bound (SNB): "1 - ( Frontend_Bound + Bad_Speculation + Retiring )"; Retiring (SNB): "#Retired_Slots / SLOTS"; Retiring (ICL): "PERF_METRICS.RETIRING / #PERF_METRICS_SUM if #PERF_METRICS_MSR else UOPS_RETIRED.SLOTS / SLOTS"; Bad_Speculation (ICL): "max( 1 - ( Frontend_Bound + Backend_Bound + Retiring ) , 0 )" (accessed 2026-11-20)
- Use in dive: section 21, the x86 formula box. Reading note `[our reading]`: in this file a blank cell takes the value of the nearest filled cell to its right (older core), so Granite Rapids (no own value) uses the ADL/RPL width of 6. The file does not state that rule in the rows read; confirm against the README before printing a width for a specific EC2 processor.

**F08-9. Linux `perf stat --topdown` prints the level-1 split with whatever metrics the CPU supports. The perf documentation adds the caveat the dive should repeat: the split describes the bottleneck only if the workload is bound by the CPU and not by something else.**
- Location: `tools/perf/Documentation/perf-stat.txt`, option `--topdown`, Linux v7.3 (tagged 2026-10-18)
- Verdict: NEW
- Evidence: https://github.com/torvalds/linux/blob/c03c1a14507dfaf8b856c2608f9ac216021fc222/tools/perf/Documentation/perf-stat.txt | Tier 1, source tree at tag v7.3 | documentation of support | "Print top-down metrics supported by the CPU. This allows to determine bottle necks in the CPU pipeline for CPU bound workloads, by breaking the cycles consumed down into frontend bound, backend bound, bad speculation and retiring." and "Frontend bound means that the CPU cannot fetch and decode instructions fast enough. Backend bound means that computation or memory access is the bottle neck. Bad Speculation means that the CPU wasted cycles due to branch mispredictions and similar issues. Retiring means that the CPU computed without an apparently bottleneck. The bottleneck is only the real bottleneck if the workload is actually bound by the CPU and not by something else." (accessed 2026-11-20)
- Use in dive: section 21, the command the reader types, and the limit of the method: a GPU-bound training job shows a CPU split that says nothing about the GPU.

**F08-10. On Intel cores from Ice Lake, the kernel exposes a fixed counter named SLOTS ("cycles multiplied by core issue width") and a metrics register holding the four ratios, so top-down costs no general-purpose counter. From Sapphire Rapids the same register carries four level-2 metrics, and the other four follow by subtraction.**
- Location: `tools/perf/Documentation/topdown.txt`, headings "New Topdown features in Intel Ice Lake", "Using TopDown through RDPMC in applications on Intel Ice Lake" and "Extension on Intel Sapphire Rapids Server"
- Verdict: NEW
- Evidence: https://github.com/torvalds/linux/blob/c03c1a14507dfaf8b856c2608f9ac216021fc222/tools/perf/Documentation/topdown.txt | Tier 1, source tree at tag v7.3 | documentation of support | "With Ice Lake CPUs the TopDown metrics are directly available as fixed counters and do not require generic counters." ; "On Ice Lake, there is a new fixed counter 3: SLOTS, which reports \"pipeline SLOTS\" (cycles multiplied by core issue width) and a metric register that reports slots ratios for the different bottleneck categories." ; "Four more TopDown metric events are exposed for the end-users, topdown-heavy-ops, topdown-br-mispredict, topdown-fetch-lat and topdown-mem-bound." ; "Core_Bound = Backend_Bound - Memory_Bound" (accessed 2026-11-20)
- Use in dive: section 21, the `topdown-*` event names (`topdown-retiring` appears in the same file's `perf record` example) and how level 2 is obtained on Sapphire Rapids and later.

**F08-11. AMD Zen 4 has the same four categories in Linux perf, counted in dispatch slots: 6 slots per cycle. Zen 4 adds a fifth bucket that Intel and Arm do not have at level 1, `smt_contention`: slots left unused because the sibling hardware thread was selected.**
- Location: `tools/perf/pmu-events/arch/x86/amdzen4/pipeline.json`, metrics `total_dispatch_slots`, `frontend_bound`, `bad_speculation`, `backend_bound`, `smt_contention`, `retiring`
- Verdict: NEW
- Evidence: https://github.com/torvalds/linux/blob/c03c1a14507dfaf8b856c2608f9ac216021fc222/tools/perf/pmu-events/arch/x86/amdzen4/pipeline.json | Tier 1, source tree at tag v7.3 (the AMD event files in this tree are contributed by AMD; authorship of this file was not checked in the git log) | definition | "Total dispatch slots (upto 6 instructions can be dispatched in each cycle)." with expression "6 * ls_not_halted_cyc"; frontend_bound "d_ratio(de_no_dispatch_per_slot.no_ops_from_frontend, total_dispatch_slots)"; bad_speculation "d_ratio(de_src_op_disp.all - ex_ret_ops, total_dispatch_slots)"; backend_bound "d_ratio(de_no_dispatch_per_slot.backend_stalls, total_dispatch_slots)"; smt_contention "Fraction of dispatch slots that remained unused because the other thread was selected."; retiring "d_ratio(ex_ret_ops, total_dispatch_slots)" (accessed 2026-11-20)
- Use in dive: section 21, AMD row of the cross-vendor formula table.

**F08-12. AMD Zen 5 uses the same formulas with 8 dispatch slots per cycle. The Zen 6 file in the same tree also says 8.**
- Location: `tools/perf/pmu-events/arch/x86/amdzen5/pipeline.json` and `amdzen6/pipeline.json`, metric `total_dispatch_slots`
- Verdict: NEW
- Evidence: https://github.com/torvalds/linux/blob/c03c1a14507dfaf8b856c2608f9ac216021fc222/tools/perf/pmu-events/arch/x86/amdzen5/pipeline.json | Tier 1, source tree at tag v7.3 | definition | "Total dispatch slots (up to 8 instructions can be dispatched in each cycle)." with expression "8 * ls_not_halted_cyc"; the same sentence and expression open `amdzen6/pipeline.json` at the same tag (accessed 2026-11-20)
- Use in dive: section 21. AMD's level-2 memory split is also in the Zen 4 file: `backend_bound_memory` = "backend_bound * d_ratio(ex_no_retire.load_not_complete, ex_no_retire.not_complete)".

### B. Top-down analysis on Arm, and how our Tier 0 formula compares (sections 21 and 22)

**F08-13. Arm publishes its top-down method as machine-readable files, one per core, in the Telemetry Solution repository. The newest release is 2026.09 (2026-09-29). Its home is Arm's GitLab; the GitHub path `ARM-software/telemetry-solution` returns 404 today.**
- Location: repository root, `RELEASE_NOTES.md`, heading "2026.09"; tag `2026.09`
- Verdict: NEW
- Evidence: https://gitlab.arm.com/telemetry-solution/telemetry-solution/-/blob/ea533b733b9bad52223d16e768b7dab03cabb830/RELEASE_NOTES.md | Tier 1, first-party repository at tag 2026.09 | documentation of support | "Product: Telemetry Solution, Arm Top-Down tool" and "CPU telemetry specifications and detection mappings for Neoverse V3AE, Cortex-A725, Cortex-X925 and Arm C2-Ultra." and "The old `tools/topdown_tool/topdown-tool` launcher is removed; use the installed CLI or `uv run --locked topdown-tool` from the tool directory." (accessed 2026-11-20; `gh api repos/ARM-software/telemetry-solution` returned HTTP 404)
- Use in dive: section 21, where Arm's method lives and that the two DGX Spark core types (Cortex-X925, Cortex-A725) gained official files in September 2026.

**F08-14. Arm defines a slot at the rename unit, the stage that separates the front end from the back end, and the slot count per cycle is a fixed property of each core.**
- Location: "Arm Neoverse V1 Core: Performance Analysis Methodology" white paper, section 3.2 "Neoverse V1: Topdown Performance Analysis Methodology" (PDF page 16)
- Verdict: NEW
- Evidence: https://armkeil.blob.core.windows.net/developer/Files/pdf/white-paper/neoverse-v1-core-performance-analysis.pdf | Tier 2, first-party white paper (no date found in the PDF text; it describes Neoverse V1, so it is history for the definition, and the per-core files of F08-16 to F08-19 are the current formulas) | definition | "The total execution bandwidth of the processor can be measured in execution slots for operations. Slots are defined as the execution slots in the rename unit which partitions the frontend and backend of the processor. Frontend of the processor decodes and decomposes AArch64 instructions to micro-operations that can be executed by the backend execution units" and "The number of slots supported by the core determines the execution bandwidth of the processor for top-down accounting. This is a micro-architectural parameter that is part of the formulae" (accessed 2026-11-20)
- Use in dive: section 21, the Arm definition of a slot, next to Intel's (F08-2).

**F08-15. The seven Arm events the method uses, as Arm's Cortex-X925 file defines them. STALL_SLOT counts slots per cycle in which no operation moved, for any reason, and on this core equals STALL_SLOT_FRONTEND plus STALL_SLOT_BACKEND. OP_SPEC counts micro-operations dispatched; OP_RETIRED counts those retired. CPU_CYCLES counts core clock cycles.**
- Location: `data/pmu/cpu/specifications/cortex/cortex_x925_r0p0_pmu.json`, object `events` (file timestamp "27 Jul 16:16:42 2026")
- Verdict: NEW
- Evidence: https://gitlab.arm.com/telemetry-solution/telemetry-solution/-/blob/ea533b733b9bad52223d16e768b7dab03cabb830/data/pmu/cpu/specifications/cortex/cortex_x925_r0p0_pmu.json | Tier 1, vendor specification file at tag 2026.09 | definition | STALL_SLOT (0x003F): "Counts slots per cycle in which no operations are sent to the rename unit from the frontend or from the rename unit to the backend for any reason (either frontend or backend stall). STALL_SLOT is the sum of STALL_SLOT_FRONTEND and STALL_SLOT_BACKEND."; STALL_SLOT_FRONTEND (0x003E): "Counts slots per cycle in which no operations are sent to the rename unit from the frontend due to frontend resource constraints."; STALL_SLOT_BACKEND (0x003D): "Counts slots per cycle in which no operations are sent from the rename unit to the backend due to backend resource constraints."; OP_RETIRED (0x003A): "Counts micro-operations that are architecturally executed."; OP_SPEC (0x003B): "Counts micro-operations speculatively executed. This is the count of the number of micro-operations dispatched in a cycle."; BR_MIS_PRED_RETIRED (0x0022): "Counts branches counted by BR_RETIRED which were mispredicted and caused a pipeline flush."; CPU_CYCLES (0x0011): "Counts CPU clock cycles (not timer cycles)." (accessed 2026-11-20)
- Use in dive: section 21, the event glossary. It also explains two things seen in Tier 0: front end plus back end stall slots equal STALL_SLOT exactly in every row (F08-69), and (STALL_SLOT + OP_SPEC) / CPU_CYCLES returns the slot count (F08-68).

**F08-16. Slots per cycle in Arm's files: Neoverse V1 8, Neoverse V2 8, Neoverse V3 10, Cortex-X925 10, Cortex-A725 5 (Neoverse N1 5). The repository has no file for the Cortex-A78AE.**
- Location: `product_configuration.num_slots` in each file under `data/pmu/cpu/specifications/neoverse/` and `.../cortex/`; directory listing of both folders
- Verdict: NEW
- Evidence: https://gitlab.arm.com/telemetry-solution/telemetry-solution/-/tree/ea533b733b9bad52223d16e768b7dab03cabb830/data/pmu/cpu/specifications | Tier 1, vendor specification files at tag 2026.09 | definition | `neoverse_v1_r1p2_pmu.json`: "\"product_name\": \"Neoverse V1\" ... \"num_slots\": 8"; `neoverse_v2_r0p0_pmu.json`: "\"num_slots\": 8"; `neoverse_v3_r0p0_pmu.json`: "\"num_slots\": 10"; `cortex_x925_r0p0_pmu.json`: "\"product_name\": \"Cortex-X925\" ... \"num_slots\": 10"; `cortex_a725_r0p0_pmu.json`: "\"num_slots\": 5"; the `cortex` folder lists only `cortex_a725_r0p0_pmu.json` and `cortex_x925_r0p0_pmu.json` (accessed 2026-11-20)
- Use in dive: sections 21 and 22. Confirms the two DGX Spark values the Tier 0 run read from the kernel (10 and 5). The Jetson's value of 6 for the Cortex-A78AE has no Arm file to check against (UNKNOWN U08-1).

**F08-17. Arm's level-1 formulas for the Neoverse V1 (Graviton3's core, F08-56). Back end and retiring are the plain ratios. Front end is reduced, and bad speculation increased, by a branch-mispredict term: 4 cycles per mispredicted branch.**
- Location: `data/pmu/cpu/specifications/neoverse/neoverse_v1_r1p2_pmu.json`, object `metrics`; the same formulas are printed in the white paper's Appendix C
- Verdict: NEW
- Evidence: https://gitlab.arm.com/telemetry-solution/telemetry-solution/-/blob/ea533b733b9bad52223d16e768b7dab03cabb830/data/pmu/cpu/specifications/neoverse/neoverse_v1_r1p2_pmu.json | Tier 1, vendor specification file at tag 2026.09 | definition | frontend_bound: "100 * (STALL_SLOT_FRONTEND / (CPU_CYCLES * 8) - BR_MIS_PRED * 4 / CPU_CYCLES)"; backend_bound: "STALL_SLOT_BACKEND / (8 * CPU_CYCLES) * 100"; retiring: "(1 - STALL_SLOT / (CPU_CYCLES * 8)) * (OP_RETIRED / OP_SPEC) * 100"; bad_speculation: "100 * ((1 - OP_RETIRED / OP_SPEC) * (1 - STALL_SLOT / (CPU_CYCLES * 8)) + BR_MIS_PRED * 4 / CPU_CYCLES)" (accessed 2026-11-20)
- Use in dive: section 21, Arm formula box for Graviton3.

**F08-18. Arm's level-1 formulas for the Neoverse V2 (Graviton4's core, F08-56). Same shape, but the 4-cycle mispredict term is taken 1 cycle from the front end and 3 cycles from the back end.**
- Location: `data/pmu/cpu/specifications/neoverse/neoverse_v2_r0p0_pmu.json`, object `metrics`
- Verdict: NEW
- Evidence: https://gitlab.arm.com/telemetry-solution/telemetry-solution/-/blob/ea533b733b9bad52223d16e768b7dab03cabb830/data/pmu/cpu/specifications/neoverse/neoverse_v2_r0p0_pmu.json | Tier 1, vendor specification file at tag 2026.09 | definition | frontend_bound: "100 * (STALL_SLOT_FRONTEND / (CPU_CYCLES * 8) - BR_MIS_PRED / CPU_CYCLES)"; backend_bound: "100 * (STALL_SLOT_BACKEND / (CPU_CYCLES * 8) - BR_MIS_PRED * 3 / CPU_CYCLES)"; retiring: "100 * (OP_RETIRED / OP_SPEC * (1 - STALL_SLOT / (CPU_CYCLES * 8)))"; bad_speculation: "100 * ((1 - OP_RETIRED / OP_SPEC) * (1 - STALL_SLOT / (CPU_CYCLES * 8)) + BR_MIS_PRED * 4 / CPU_CYCLES)" (accessed 2026-11-20)
- Use in dive: section 21, Arm formula box for Graviton4. The four still sum to 100%: 1 + 3 cycles removed, 4 cycles added.

**F08-19. Arm's level-1 formulas for the Neoverse V3, Cortex-X925 and Cortex-A725 replace the fixed 4-cycle estimate with a measured event, STALL_FRONTEND_FLUSH: the cycles the front end spent recovering from a flush. Those cycles are subtracted from front-end bound and added to bad speculation.**
- Location: `neoverse_v3_r0p0_pmu.json`, `cortex_x925_r0p0_pmu.json`, `cortex_a725_r0p0_pmu.json`, object `metrics`; event `STALL_FRONTEND_FLUSH` (0x8162)
- Verdict: NEW
- Evidence: https://gitlab.arm.com/telemetry-solution/telemetry-solution/-/blob/ea533b733b9bad52223d16e768b7dab03cabb830/data/pmu/cpu/specifications/cortex/cortex_x925_r0p0_pmu.json | Tier 1, vendor specification file at tag 2026.09 | definition | frontend_bound: "(STALL_SLOT_FRONTEND / (10 * CPU_CYCLES) - STALL_FRONTEND_FLUSH / CPU_CYCLES) * 100"; backend_bound: "STALL_SLOT_BACKEND / (10 * CPU_CYCLES) * 100"; retiring: "(1 - STALL_SLOT / (CPU_CYCLES * 10)) * (OP_RETIRED / OP_SPEC) * 100"; bad_speculation: "(1 - STALL_SLOT / (10 * CPU_CYCLES)) * (1 - OP_RETIRED / OP_SPEC) * 100 + STALL_FRONTEND_FLUSH / CPU_CYCLES * 100"; STALL_FRONTEND_FLUSH: "Counts cycles when the frontend could not send any micro-operations to the rename stage as the frontend is recovering from a machine flush or resteer. Example scenarios that cause a flush include branch mispredictions, taken exceptions, micro-architectural flush etc." The Cortex-A725 file has the same four expressions with 5 in place of 10; the Neoverse V3 file is identical to the X925 one. (accessed 2026-11-20)
- Use in dive: sections 21 and 22. These are the formulas the DGX Spark results should have used.

**F08-20. Linux perf carries a generic Arm fallback with no correction term, and it is, term for term, the formula our Tier 0 results used. perf reads the slot count from the kernel (`caps/slots`).**
- Location: `tools/perf/pmu-events/arch/arm64/sbsa.json`; `tools/perf/arch/arm64/util/pmu.c`, function `tool_pmu__cpu_slots_per_cycle`
- Verdict: NEW
- Evidence: https://github.com/torvalds/linux/blob/c03c1a14507dfaf8b856c2608f9ac216021fc222/tools/perf/pmu-events/arch/arm64/sbsa.json | Tier 1, source tree at tag v7.3 | code behaviour | frontend_bound: "100 * (stall_slot_frontend / (#slots * cpu_cycles))"; bad_speculation: "100 * ((1 - op_retired / op_spec) * (1 - stall_slot / (#slots * cpu_cycles)))"; retiring: "100 * ((op_retired / op_spec) * (1 - stall_slot / (#slots * cpu_cycles)))"; backend_bound: "100 * (stall_slot_backend / (#slots * cpu_cycles))"; and in `pmu.c`: "perf_pmu__pathname_scnprintf(path, sizeof(path), pmu->name, \"caps/slots\");" (accessed 2026-11-20)
- Use in dive: section 22, the honest label for our numbers: "the generic Arm formula that Linux perf ships, without Arm's per-core flush correction".

**F08-21. The same Linux tree carries Arm's per-core corrections for the Neoverse cores (V1 with the constant 8 and the 4-cycle term; V3 with the constant 10 and STALL_FRONTEND_FLUSH), and has directories for Cortex-A78 and Cortex-X1/X2 but none for Cortex-X925 or Cortex-A725 at v7.3. On a DGX Spark, `perf stat --topdown` at this tag would therefore use the generic formula.**
- Location: `tools/perf/pmu-events/arch/arm64/arm/` directory listing; `arm/neoverse-v1/metrics.json`, `arm/neoverse-v3/metrics.json`
- Verdict: NEW
- Evidence: https://github.com/torvalds/linux/tree/c03c1a14507dfaf8b856c2608f9ac216021fc222/tools/perf/pmu-events/arch/arm64/arm | Tier 1, source tree at tag v7.3 | code behaviour | directory names returned: "cmn cortex-a34 cortex-a35 cortex-a510 cortex-a53 cortex-a55 cortex-a57-a72 cortex-a65-e1 cortex-a710 cortex-a73 cortex-a75 cortex-a76 cortex-a77 cortex-a78 cortex-x1 cortex-x2 neoverse-n1 neoverse-n2-v2 neoverse-n3 neoverse-v1 neoverse-v3"; `neoverse-v3/metrics.json` frontend_bound: "(STALL_SLOT_FRONTEND / (10 * CPU_CYCLES) - STALL_FRONTEND_FLUSH / CPU_CYCLES) * 100"; `neoverse-v1/metrics.json` bad_speculation: "(100 * (((1 - (OP_RETIRED / OP_SPEC)) * (1 - (STALL_SLOT / (CPU_CYCLES * 8)))) + ((BR_MIS_PRED * 4) / CPU_CYCLES)))" (accessed 2026-11-20; "would use the generic formula" is `[our reading]` of the missing directories, not tested)
- Use in dive: section 21, a practical warning: the number `perf` prints depends on whether the kernel tree knows the core.

**F08-22. [our reading] Where the Tier 0 formula differs from Arm's method. Back-end bound and retiring: identical on Cortex-X925, Cortex-A725, Neoverse V1 and V3. Front-end bound: ours is too high, and bad speculation too low, by the same amount: STALL_FRONTEND_FLUSH / CPU_CYCLES on X925, A725 and V3 (BR_MIS_PRED x 4 / CPU_CYCLES on V1). The Tier 0 run did not record STALL_FRONTEND_FLUSH, so the corrected values cannot be computed from the files we have.**
- Location: comparison of `pmu-cards/dgx-spark.md` ("TMA level 1: formula and first capture") with F08-19; event list in `run.sh` line `TD=`
- Verdict: NEW (closes the open item the seed flagged: "not yet checked line by line against Arm's telemetry spec")
- Evidence: `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/run.sh` | Tier 0 (method file) compared with Tier 1 (F08-19) | code behaviour | `run.sh`: "TD=\"stall_slot,stall_slot_frontend,stall_slot_backend,op_retired,op_spec,cpu_cycles\""; card: "frontend bound = stall_slot_frontend / slots ... bad speculation = (1 - stall_slot / slots) x (1 - op_retired / op_spec)"; Arm: "(STALL_SLOT_FRONTEND / (10 * CPU_CYCLES) - STALL_FRONTEND_FLUSH / CPU_CYCLES) * 100" (accessed 2026-11-20)
- Use in dive: section 22, the caveat printed beside every front-end and bad-speculation figure. Direction is known (front end overstated, bad speculation understated, back end and retiring unaffected); size is not.

**F08-23. [derived, illustration] How large the missing correction could be. Using Arm's own Neoverse V1 and V2 constant of 4 cycles per mispredicted branch as a stand-in for the unrecorded flush cycles: MuJoCo step on the X925, 79,584,976 mispredicts x 4 / 19,922,115,591 cycles = 1.6 points moved from front end (12.2% to about 10.6%) to bad speculation (5.6% to about 7.2%). The branch microbenchmark on the X925: 256,608,053 x 4 / 7,794,987,434 = 13.2 points (front end 37.6% to about 24.5%, bad speculation 11.9% to about 25.1%). The policy and memory kernels move by under 0.5 points.**
- Location: `results-pass2/results-spark-x925.csv`, rows `wl_sim` and `branch`, fields `b_br_mis_pred_retired` and `b_cpu_cycles`
- Verdict: NEW
- Evidence: `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/results-pass2/results-spark-x925.csv` | Tier 0, single run, plus Tier 1 constant from F08-17 | our measurement, arithmetic | "wl_sim|sim 57240 steps/s|...b_cpu_cycles=19922115591;...b_br_mis_pred_retired=79584976;" and "branch|branch 323.5 Mbranch/s|...b_cpu_cycles=7794987434;...b_br_mis_pred_retired=256608053;" (accessed 2026-11-20)
- Use in dive: section 22, sizing the caveat. This is not Arm's X925 formula: it borrows a constant from another core and uses BR_MIS_PRED_RETIRED where Arm's V1 formula uses BR_MIS_PRED. It shows which results are sensitive (branchy code) and which are not (memory-bound and floating-point kernels).

**F08-24. Arm's files for the V3, X925 and A725 define a second level that the older cores lack: front-end stalls split into core-bound (flush recovery, waiting on the branch predictor) and memory-bound (instruction cache, instruction TLB), back-end stalls split into core-bound (rename registers, issue queues full) and memory-bound (L1 and L2 data cache, data TLB, stores).**
- Location: `cortex_x925_r0p0_pmu.json`, `groups.metrics.Topdown_Frontend` and `Topdown_Backend`; `methodologies.topdown_methodology.metric_grouping.stage_1`
- Verdict: NEW
- Evidence: https://gitlab.arm.com/telemetry-solution/telemetry-solution/-/blob/ea533b733b9bad52223d16e768b7dab03cabb830/data/pmu/cpu/specifications/cortex/cortex_x925_r0p0_pmu.json | Tier 1, vendor specification file at tag 2026.09 | definition | "\"stage_1\": [\"Topdown_L1\", \"Topdown_Frontend\", \"Topdown_Backend\"]"; Topdown_Backend metrics: "backend_core_bound", "backend_mem_bound", "backend_core_rename_bound", "backend_busy_bound", "backend_mem_cache_bound", "backend_mem_tlb_bound", "backend_mem_store_bound", "backend_cache_l1d_bound", "backend_cache_l2d_bound"; backend_mem_bound: "STALL_BACKEND_MEMBOUND / STALL_BACKEND * 100"; backend_core_bound: "STALL_BACKEND_CPUBOUND / STALL_BACKEND * 100" (the Neoverse V1 and V2 files list only "Topdown_L1" in stage_1) (accessed 2026-11-20)
- Use in dive: section 21 (core-bound versus memory-bound is directly measurable on the Spark's cores), section 22 (the events the next Tier 0 pass should add, F08-74).

### C. Whether the counters are visible on EC2 (section 21)

**F08-25. AWS states the rule for CPU counters on EC2 in its Graviton technical guide: not every instance size supports PMU event collection. Sizes that hold an entire dedicated socket get every event; smaller sizes of newer generations get a reduced set; smaller sizes of older generations may get none.**
- Location: `perfrunbook/debug_hw_perf.md`, heading "How to Collect PMU counters"
- Verdict: NEW (the seed left this unverified)
- Evidence: https://github.com/aws/aws-graviton-getting-started/blob/541d1ad524bb1630e16b8e66aef36dcd01a3bbc1/perfrunbook/debug_hw_perf.md | Tier 1, first-party AWS repository at a pinned SHA (commit of 2026-11-18) | documentation of support | "Not all instance sizes support PMU event collection. Generally instance sizes which have an entire dedicated socket have full access to all PMU events, and smaller instance sizes of the newer generations have a reduced set of events suitable for most profiling needs. For older generations smaller instance sizes may not support any PMU event collection." (accessed 2026-11-20)
- Use in dive: section 21, the first thing to check before promising a PMU card for an EC2 instance.

**F08-26. The same page gives the table, for Graviton and x86 alike. Full PMU support: `*9g` at 12xlarge, 24xlarge and 48xlarge; `*8g` at 24xlarge and 48xlarge; `*7g` and `*6g` at 16xlarge; `*8i` at 48xlarge; `*7i`, `*8a`, `*7a` and `*6a` at 24xlarge and 48xlarge; `*6i` at 16xlarge and 32xlarge. "Basic support at smaller sizes" is yes for the 9g, 8a, 8i, 8g, 7a, 7g, 7i and 6g rows and no for 6a, 6i and 5.**
- Location: same file, the table under "How to Collect PMU counters"
- Verdict: NEW
- Evidence: https://github.com/aws/aws-graviton-getting-started/blob/541d1ad524bb1630e16b8e66aef36dcd01a3bbc1/perfrunbook/debug_hw_perf.md | Tier 1, first-party AWS repository | documentation of support | "|Instance Family | Sizes with Full PMU Event Support | Basic Support at Smaller Sizes" / "|*9g | 12xlarge, 24xlarge, 48xlarge | yes |" / "|*8a | 24xlarge, 48xlarge | yes |" / "|*8i | 48xlarge | yes |" / "|*8g | 24xlarge, 48xlarge | yes |" / "|*7a | 24xlarge, 48xlarge | yes |" / "|*7g | 16xlarge | yes |" / "|*7i | 24xlarge, 48xlarge | yes |" / "|*6a | 24xlarge, 48xlarge | no |" / "|*6g | 16xlarge | yes |" / "|*6i | 16xlarge, 32xlarge | no |" / "|*5 | c5.9xlarge, *5.12xlarge | no" (accessed 2026-11-20)
- Use in dive: section 21, a table the reader can act on: profile on c9g.12xlarge or larger, or c8g.24xlarge or larger, when the full event list matters. The page does not list which events make up the "reduced set", so whether the slot events of F08-15 are in it is UNKNOWN (U08-2).

**F08-27. On bare-metal instances AWS exposes every hardware PMU, including two that virtualised sizes do not get: the Statistical Profiling Extension (per-instruction sampling) and the mesh interconnect's counters, which measure system-wide memory bandwidth. SPE is enabled on Graviton2, 3, 4 and 5 metal instances.**
- Location: same file, heading "Additional PMUs and PMU events" and its two sub-headings
- Verdict: NEW
- Evidence: https://github.com/aws/aws-graviton-getting-started/blob/541d1ad524bb1630e16b8e66aef36dcd01a3bbc1/perfrunbook/debug_hw_perf.md | Tier 1, first-party AWS repository | documentation of support | "On metal instances, all available hardware PMUs and their events are exposed to instances and can be accessed so long as driver support by the OS in use is available." and "SPE is enabled on Graviton 2, 3, 4, and 5 metal instances." and "CMN counters are only accessible on Graviton metal-type instances and certain OSes and kernels." (accessed 2026-11-20)
- Use in dive: section 21, bare metal versus virtualised. Memory bandwidth of the whole machine is a metal-only measurement on Graviton.

**F08-28. The GPU families have almost no bare-metal option, so a PMU card for a GPU instance is a card of a virtual machine. In the EC2 accelerated-computing table, "Metal instances available" is yes only for G4dn and G5g; it is no for G5, G6, G6e, G6f, Gr6, G7, G7e, P4d, P5, P5e, P5en, P6-B200, P6-B300 and P6e-GB200.**
- Location: "Specifications for Amazon EC2 accelerated computing instances", table "Instance family summary", column "Metal instances available"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | Tier 1, first-party docs | documentation of support | rows as parsed from the page: "G4dn | Nitro v3 | Intel (x86_64) | ✓ Yes"; "G5g | Nitro v2 | AWS Graviton (arm64) | ✓ Yes"; "G6e | Nitro v4 | AMD (x86_64) | ✗ No"; "G7 | Nitro v6 | Intel (x86_64) | ✗ No"; "G7e | Nitro v6 | Intel (x86_64) | ✗ No"; "P5 | Nitro v4 | AMD (x86_64) | ✗ No"; "P6-B200 | Nitro v6 | Intel (x86_64) | ✗ No"; "P6e-GB200 | Nitro v5 | NVIDIA Grace (arm64) | ✗ No" (accessed 2026-11-20)
- Use in dive: section 21. The PMU table of F08-26 names general-purpose family patterns (`*8i`, `*7i`, `*6a`); it does not name any G or P family, so which G and P sizes expose which CPU events is UNKNOWN (U08-3). `[our reading]`: the 48xlarge sizes are the candidates, by the "entire dedicated socket" rule of F08-25.

**F08-29. AWS's own top-down recipe for Graviton does not use the slot formulas. It starts from instructions per cycle, then compares front-end and back-end stalled cycles per thousand cycles (`stall_frontend_pkc`, `stall_backend_pkc`), then drills into branch, cache and TLB misses per thousand instructions.**
- Location: same file, heading "Top-down method to debug hardware performance"
- Verdict: NEW
- Evidence: https://github.com/aws/aws-graviton-getting-started/blob/541d1ad524bb1630e16b8e66aef36dcd01a3bbc1/perfrunbook/debug_hw_perf.md | Tier 1, first-party AWS repository | documentation of support | "Start by measuring `ipc` (Instructions per cycle) on each instance-type. A higher IPC is better." and "Next, measure `stall_frontend_pkc` and `stall_backend_pkc` (pkc = per kilo cycle) and determine which is higher. If stalls in the frontend are higher, it indicates the part of the CPU responsible for predicting and fetching the next instructions to execute is causing slow-downs." (accessed 2026-11-20)
- Use in dive: section 21. A cycle-based split (was the whole cycle stalled) is the fallback when the slot events are missing; it is coarser than the slot split because a cycle that moved 2 of 8 slots counts as not stalled.

### D. GPU counters: what each tool measures (section 21)

**F08-30. What "GPU utilisation" in `nvidia-smi` measures: the percentage of time in the sample period during which at least one kernel was executing. It says nothing about how much of the GPU that kernel used.**
- Location: `nvidia-smi` documentation, section "Utilization", fields GPU and Memory
- Verdict: NEW
- Evidence: https://docs.nvidia.com/deploy/nvidia-smi/index.html | Tier 1, first-party docs | definition | "GPU Percent of time over the past sample period during which one or more kernels was executing on the GPU. The sample period may be between 1 second and 1/6 second depending on the product." and "Memory Percent of time over the past sample period during which global (device) memory was being read or written." (accessed 2026-11-20)
- Use in dive: section 21, the sentence that reframes every "GPU at 95%" claim in the dive (for example F01-91's "about 80 to 95%"): one small kernel running back to back reads 100%.

**F08-31. `nvidia-smi` reports the video engines separately from the compute part: encoder, decoder, JPEG decoder and optical-flow accelerator each have their own utilisation figure. On a GPU split with MIG, none of these can be queried.**
- Location: same page, section "Utilization", fields Encoder, Decoder, JPEG, OFA, and the first note
- Verdict: NEW
- Evidence: https://docs.nvidia.com/deploy/nvidia-smi/index.html | Tier 1, first-party docs | definition | "Encoder Percent of time over the past sample period during which the GPU's video encoder was being used." ; "Decoder Percent of time over the past sample period during which the GPU's video decoder was being used." ; "JPEG Percent of time over the past sample period during which the GPU's JPEG decoder was being used." ; "Note: On MIG-enabled GPUs, querying the utilization of encoder, decoder, jpeg, ofa, gpu, and memory is not currently supported." (accessed 2026-11-20)
- Use in dive: sections 20 and 21. The tool itself treats the video engines as parts separate from the compute cores, which is the dive's "parts saturate separately" idea in the vendor's own output.

**F08-32. NVIDIA's Data Center GPU Manager (DCGM, newest tag v4.7.0) adds finer fields. "SM Activity" is the fraction of time at least one group of threads was active on a multiprocessor, and NVIDIA's own guidance is that 0.8 or more is "necessary, but not sufficient" for effective use. "Tensor Activity" is the fraction of cycles the tensor pipe was active. "DRAM activity" is the fraction of cycles data moved to or from device memory.**
- Location: DCGM User Guide, "Feature Overview", section on profiling metrics, table "Device Level GPU Metrics"; repository tag list
- Verdict: NEW
- Evidence: https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/feature-overview.html | Tier 1, first-party docs (version: tag `v4.7.0`, SHA 9fae2867e6e5264fa0fca22a07dc898d591baa21, is the newest in github.com/NVIDIA/DCGM; the docs page is the "latest" alias) | definition | "SM Activity The fraction of time at least one warp was active on a multiprocessor, averaged over all multiprocessors. Note that \"active\" does not necessarily mean a warp is actively computing. For instance, warps waiting on memory requests are considered active. ... A value of 0.8 or greater is necessary, but not sufficient, for effective use of the GPU. A value less than 0.5 likely indicates ineffective GPU usage." (PROF_SM_ACTIVE, ID 1002); "Tensor Activity The fraction of cycles the tensor (HMMA / IMMA) pipe was active. ... Higher values indicate higher utilization of the Tensor Cores." (PROF_PIPE_TENSOR_ACTIVE, ID 1004); "The fraction of cycles where data was sent to or received from device memory." (PROF_DRAM_ACTIVE, ID 1005); "Graphics Engine Activity The fraction of time any portion of the graphics or compute engines were active." (PROF_GR_ENGINE_ACTIVE, ID 1001) (accessed 2026-11-20)
- Use in dive: section 21, the three fleet-level GPU fields worth a column on a PMU card: SM activity, tensor activity, DRAM activity. DCGM samples at 1 Hz by default ("minimum is 100ms" per the same section).

**F08-33. Nsight Compute, current version 2026.4.0, is the per-kernel profiler. It groups metrics into sections and sections into sets; `basic` is the default and `full` collects everything. More metrics need more replays of the kernel, so the cost of a deep profile is run time.**
- Location: Nsight Compute "Profiling Guide" (page header "v2026.4.0"), headings "Sets and Sections" and the overhead discussion; Release Notes heading "Updates in 2026.4"
- Verdict: NEW (the Tier 0 cards used 2025.3.1 on the DGX Spark and 2024.3.1 on the Jetson)
- Evidence: https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html | Tier 1, first-party docs | documentation of support | "NVIDIA Nsight Compute uses Section Sets (short sets) to decide, on a very high level, the number of metrics to be collected." ; "The `basic` set is collected when no `--set`, `--section` and no `--metrics` options are passed on the command line." ; "The full set of sections can be collected with `--set full`." ; "only a limited number of metrics can be collected in a single pass of the kernel execution." Release notes (https://docs.nvidia.com/nsight-compute/ReleaseNotes/index.html), under "Updates in 2026.4": "Added limited support for C2C metrics for GB10B." ; under 2026.3: "Added support for the Rubin GPU architecture." (accessed 2026-11-20; quotes returned as fragments by the fetch)
- Use in dive: section 21. GB10B is the chip name the DGX Spark card recorded as `gb10b`, so the Spark's GPU is still gaining metrics in the current release.

**F08-34. The Nsight Compute sections that matter for a PMU card: SpeedOfLight (throughput of compute and memory as a share of the GPU's maximum), the roofline charts (including one for tensor cores), ComputeWorkloadAnalysis (which pipeline inside the multiprocessor is busy) and MemoryWorkloadAnalysis (memory units busy, bandwidth exhausted, or memory instruction pipes busy).**
- Location: same guide, table of sections
- Verdict: NEW
- Evidence: https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html | Tier 1, first-party docs | definition | SpeedOfLight: "High-level overview of the throughput for compute and memory resources of the GPU."; "GPU Speed Of Light Hierarchical Roofline Chart (Tensor Core)"; ComputeWorkloadAnalysis: "Detailed analysis of the compute resources of the streaming multiprocessors (SM), including the achieved instructions per clock (IPC) and the utilization of each available pipeline. Pipelines with very high utilization might limit the overall performance."; MemoryWorkloadAnalysis: "Detailed analysis of the memory resources of the GPU. Memory can become a limiting factor for the overall kernel performance when fully utilizing the involved hardware units (Mem Busy), exhausting the available communication bandwidth between those units (Max Bandwidth), or by reaching the maximum throughput of issuing memory instructions (Mem Pipes Busy)."; "Throughput metrics return the maximum percentage value of their constituent counters." (accessed 2026-11-20)
- Use in dive: section 21 (GPU half of the card) and section 22: the Tier 0 figures "Compute (SM) throughput 70.49%, Memory throughput 50.47%" (F08-71) are SpeedOfLight throughputs, each the maximum over its constituent counters.

**F08-35. The roofline chart, in NVIDIA's words: a kernel's speed depends on how fast the GPU computes and on how fast it can be fed data. The chart plots achieved floating-point operations per second against arithmetic intensity (operations per byte of memory traffic). The sloped part of the roof is the memory bandwidth limit; the flat part is the peak compute limit.**
- Location: same guide, section "Roofline Charts", "Overview"
- Verdict: NEW
- Evidence: https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html | Tier 1, first-party docs | definition | "Kernel performance is not only dependent on the operational speed of the GPU. Since a kernel requires data to work on, performance is also dependent on the rate at which the GPU can feed data to the kernel. A typical roofline chart combines the peak performance and memory bandwidth of the GPU, with a metric called Arithmetic Intensity (a ratio between Work and Memory Traffic), into a single chart" ; "Memory Bandwidth Boundary - The memory bandwidth boundary is the sloped part of the roofline. By default, this slope is determined entirely by the memory transfer rate of the GPU" ; "Peak Performance Boundary - The peak performance boundary is the flat part of the roofline By default, this value is determined entirely by the peak performance of the GPU" (accessed 2026-11-20)
- Use in dive: sections 20 and 21, the definition of GPU memory bandwidth as a part separate from GPU compute, and the GPU analogue of core-bound versus memory-bound.

**F08-36. Inside each GPU multiprocessor NVIDIA lists the parts this dive separates: integer and floating-point execution units, memory load and store units, tensor cores, and, shared across the multiprocessor, texture units and "RT Cores, if available". Nsight Compute has pipeline metrics for the tensor units. In the profiling guide fetched today, the only mention of RT cores is that list: no RT core metric, and no mention of OptiX, was found in the page text.**
- Location: same guide, section "Streaming Multiprocessor" (unit lists) and the pipeline glossary ("tensor", "tc")
- Verdict: NEW for the unit list; UNKNOWN for a ray-tracing-core utilisation counter (U08-4)
- Evidence: https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html | Tier 1, first-party docs | definition | "The Streaming Multiprocessor (SM) is the core processing unit in the GPU. The SM is optimized for a wide diversity of workloads, including general-purpose computations, deep learning, ray tracing, as well as lighting and shading." ; unit list items: "Integer Execution units", "Floating Point Execution units", "Memory Load/Store units", "Special Function unit", "Tensor Cores", and under the shared units "RT Cores, if available" ; "The Tensor pipeline executes various MMA instructions." (accessed 2026-11-20; a text search of the saved page for "OptiX" returned nothing and for "RT Core" returned only the list item)
- Use in dive: section 21. The honest statement: with the tools read here, tensor-core use is measurable per kernel and per GPU (F08-32), video engine use is measurable per GPU (F08-31), and ray-tracing-core use has no counter we located. "Not located in this research", not "does not exist".

**F08-37. Nsight Compute needs elevated permissions for GPU performance counters by default, and on "mobile platforms" (the Jetson family) it must run as root. Its timeline sampling works "on all platforms except vGPU".**
- Location: same guide, error list entry `ERR_NVGPUCTRPERM`; section on PM sampling
- Verdict: NEW (matches what the Tier 0 cards hit on both machines)
- Evidence: https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html | Tier 1, first-party docs | documentation of support | "ERR_NVGPUCTRPERM - The user does not have permission to access NVIDIA GPU Performance Counters on the target device." ; "By default, NVIDIA drivers require elevated permissions to access GPU performance counters. On mobile platforms, profile as root/using sudo. On other platforms, you can either start profiling as root/using sudo, or by enabling non-admin profiling." ; "PM sampling is supported on all platforms except vGPU." (accessed 2026-11-20)
- Use in dive: section 21, the permissions row of the PMU card; section 22 (the Tier 0 cards: "It needs root ... without it, ERR_NVGPUCTRPERM").

**F08-38. One engine can pollute another's numbers. Nsight Compute warns that the display, copy engine, video encoder and video decoder share the GPU's L2 cache, memory, PCIe and NVLink with the compute cores, so a small profiled kernel can show memory traffic that is not its own.**
- Location: same guide, section on measurement values outside the expected range
- Verdict: NEW
- Evidence: https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html | Tier 1, first-party docs | definition | "GPU engines other than the one measured by a metric (display, copy engine, video encoder, video decoder, etc.) potentially access shared resources during profiling. Such chip-global shared resources include L2, DRAM, PCIe, and NVLINK. If the kernel launch is small, the other engine(s) can cause significant confusion in e.g. the DRAM results, since it is not possible to isolate the DRAM traffic of the SM." (accessed 2026-11-20)
- Use in dive: section 20: the parts saturate separately but share memory and the bus, so a decode-heavy data loader and a training kernel on one GPU compete for GPU memory bandwidth `[our reading]`.

**F08-39. Nsight Systems, current version 2026.6 (highlights headed "Nsight Systems 2026.6.1"), is the whole-application timeline: CPU sampling, CUDA calls and kernels on one time axis. It answers "is the GPU waiting for the CPU", which neither top-down nor Nsight Compute can.**
- Location: Nsight Systems Release Notes, heading "Nsight Systems 2026.6.1 Highlights"
- Verdict: NEW (the Tier 0 cards found 2025.3.2 on the DGX Spark and 2024.5.4 on the Jetson, neither run)
- Evidence: https://docs.nvidia.com/nsight-systems/ReleaseNotes/index.html | Tier 1, first-party docs | documentation of support | "Nsight Systems 2026.6.1 Highlights:" ; "Added support for CUDA 13.5." ; "CUDA kernel tooltips now show CTA/CGA occupancy." ; "Improved CPU event sampling: the time spent reading event counts is now included in `--event-sampling-interval`" (accessed 2026-11-20; "answers is the GPU waiting for the CPU" is `[our reading]` of a timeline tool, not a quote)
- Use in dive: section 21, the third tool in the ladder: always-on counters (nvidia-smi, DCGM, tegrastats), timeline (Nsight Systems), per-kernel (Nsight Compute).

**F08-40. On a Jetson the always-on tool is `tegrastats`, and its GPU figure is the same kind of number as `nvidia-smi`'s: "Proportion of GPU activation time in a period" (GR3D_FREQ). It also reports what a data-centre tool does not: memory-controller bandwidth in use (EMC_FREQ), per-rail power in milliwatts (VDD_*), and the hardware encoder load (NVENC) where the module has one.**
- Location: Jetson Linux Developer Guide r39.2.2, "Tegrastats Utility", table "Reported Statistics"
- Verdict: NEW
- Evidence: https://docs.nvidia.com/jetson/archives/r39.2.2/DeveloperGuide/AT/JetsonLinuxDevelopmentTools/TegrastatsUtility.html | Tier 1, first-party docs (r39.2.2 is the newest archive listed at docs.nvidia.com/jetson/archives/ today; whether it applies to the Orin Nano, which the Tier 0 card found on L4T R36.4.7, was not checked) | definition | "The tegrastats utility reports memory usage and processor usage for NVIDIA Jetson-based devices." ; GR3D_FREQ: "The GPU of Jetson AGX Orin series contains two GPCs and the GPU of Jetson Thor contains three GPCs. Each GPC has its own frequency controller. Proportion of GPU activation time in a period." ; EMC_FREQ: "External memory controller statistics. All sysmem/carve-out/GART memory accesses go through the memory controller. Percentage of EMC memory bandwidth in use relative to the current running frequency" ; VDD: "Power consumption statistics for a power block. ... Block's current power consumption in milliwatts Block's average power consumption in milliwatts" ; the table also lists "NVENC0 X %" (accessed 2026-11-20)
- Use in dive: sections 21 and 23. The Jetson card gets its watts from `tegrastats` rails (the Tier 0 card read "Idle board power about 4.8 W (tegrastats VDD_IN)"), and on a shared-memory machine EMC_FREQ is the one counter that shows CPU and GPU competing for the same memory.

### E. The parts of the machine, each defined from a first-party source (section 20)

The CPU front end is defined in F08-4, the CPU back end in F08-5, core-bound versus memory-bound in F08-6. Ray-tracing
cores are defined in register 06 (F06-56, F06-57). The entries below add the remaining parts.

**F08-41. Memory bandwidth and memory latency are two different limits, and Intel's metrics file names them separately. Bandwidth: performance hurt by approaching the rate limit of external memory. Latency: performance hurt by the time one access to external memory takes.**
- Location: `TMA_Metrics-full.csv`, rows `MEM_Bandwidth` and `MEM_Latency` (level 4 under Memory_Bound / DRAM_Bound), and the bottleneck rows `Data_Cache_Memory_Bandwidth` and `Data_Cache_Memory_Latency`
- Verdict: NEW
- Evidence: https://github.com/intel/perfmon/blob/c6875bae4fe4322e88c6b265962901672bfa97c9/TMA_Metrics-full.csv | Tier 1, vendor metric file at a pinned SHA | definition | MEM_Bandwidth: "This metric estimates fraction of cycles where the core's performance was likely hurt due to approaching bandwidth limits of external memory - DRAM ([SPR-HBM] and/or HBM). ... This metric does not aggregate non-data-read requests by this logical processor; requests from other IA Logical Processors/Physical Cores/sockets; or other non-IA devices like GPU; hence the maximum external memory bandwidth limits may or may not be approached when this metric is flagged (see Uncore counters for that)."; MEM_Latency: "This metric estimates fraction of cycles where the performance was likely hurt due to latency from external memory - DRAM ([SPR-HBM] and/or HBM)."; "Total pipeline cost of external Memory- or Cache-Bandwidth related bottlenecks"; "Total pipeline cost of external Memory- or Cache-Latency related bottlenecks" (accessed 2026-11-20)
- Use in dive: section 20, two memory parts. The Tier 0 microbenchmarks isolate each one: the triad kernel streams through memory (bandwidth, GB/s, F08-66) and the pointer chase waits for one load at a time (latency, ns per load, F08-67). Intel's caveat matters on a robot computer: a per-core counter cannot see the GPU's share of a shared memory bus.

**F08-42. Tensor cores are, in NVIDIA's words, "Specialized GPU cores that speed up AI and HPC math workloads", and they work by mixed-precision computing. In the profiler they are a pipeline of their own that executes matrix-multiply-accumulate (MMA) instructions, separate from the general floating-point and integer units that run ordinary CUDA code.**
- Location: NVIDIA "Tensor Cores" product page; Nsight Compute Profiling Guide, pipeline glossary and SM unit list (F08-36)
- Verdict: NEW
- Evidence: https://www.nvidia.com/en-us/data-center/tensor-cores/ | Tier 2, first-party product page | definition | "Specialized GPU cores that speed up AI and HPC math workloads" ; "Tensor Cores enable mixed-precision computing, dynamically adapting calculations to accelerate throughput" ; "The NVIDIA Rubin platform introduces enhanced fifth-generation Tensor Cores." ; and from https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html (Tier 1): "The Tensor pipeline executes various MMA instructions." (accessed 2026-11-20; product-page quotes returned as fragments by the fetch)
- Use in dive: section 20, "GPU tensor cores" versus "general CUDA compute" as two parts. `[our reading]`: transformer training and inference load the tensor pipeline; GPU physics (MuJoCo Warp, PhysX) is general CUDA compute on the floating-point and integer units. The physics half of that sentence is inference from what those kernels compute, not a measurement; a Tier 0 `ncu` run would settle it (F08-74).

**F08-43. The GPU in the G7 family (RTX PRO 4500 Blackwell Server Edition) carries all three kinds of unit. AWS's product page: "5th Gen Tensor Cores, and 4th Gen RT Cores", 32 GB per GPU, and "Ninth-generation NVENC and sixth-generation NVDEC engines".**
- Location: Amazon EC2 G7 instances product page, feature list and the "Advanced video encoding and decoding engines" block
- Verdict: NEW (register 06, F06-58 and F06-60, lists RT cores for the A10, L4, L40S and RTX PRO 6000; G7 was not in the AWS post it quotes)
- Evidence: https://aws.amazon.com/ec2/instance-types/g7/ | Tier 2, first-party product page | documentation of support | "Up to 8 NVIDIA RTX PRO 4500 Blackwell Server Edition GPUs per instance with 32 GB memory per GPU" ; "5th Gen Tensor Cores, and 4th Gen RT Cores." ; "Ninth-generation NVENC and sixth-generation NVDEC engines support 4:2:2 encoding and decoding" ; "G7 instances deliver up to 2.1x performance for hybrid graphics-AI workloads such as ADAS and robotics simulations," (accessed 2026-11-20; quotes returned as fragments by the fetch; the performance figure is a `[vendor claim]`)
- Use in dive: section 20 (one card, three separate parts), sections 23 and 25 (G7 row of the instance table).

**F08-44. The RTX PRO 4500 Blackwell Server Edition has 3 NVENC and 3 NVDEC engines and handles AV1 in both directions, per NVIDIA's support matrix. The matrix still has no row for the H200 (the P5e and P5en GPU).**
- Location: NVIDIA "Video Encode and Decode Support Matrix", data-centre table, rows "NVIDIA RTX PRO 4500 Blackwell Server Edition" in the encode and decode halves
- Verdict: NEW for the RTX PRO 4500 row; the H200 gap confirms F05-49
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, first-party vendor matrix | documentation of support | encode row as parsed: "NVIDIA RTX PRO 4500 Blackwell Server Edition | Blackwell | 9th Gen | 1 | 3 | 3 | Unrestricted | YES | YES | ..." (twelve YES cells, the last column being "AV1 YUV 4:2:0"); decode row: "NVIDIA RTX PRO 4500 Blackwell Server Edition | Blackwell | 6th Gen | 1 | 3 | 3 | YES ..." (all cells YES, including "AV1 8 Bit" and "AV1 10 Bit"); a text search of the saved page for "H200" returned nothing (accessed 2026-11-20)
- Use in dive: sections 20 and 23, the NVENC/NVDEC column for G7; with F05-46 to F05-54 it completes the video column of the instance table.

**F08-45. GPU memory capacity on EC2 today spans a factor of almost 100 between the smallest and largest per-GPU figure: 2.79 GiB (one eighth of an L4 on g6f.large) to 268 GiB (one B300 on p6-b300.48xlarge). The docs print usable GiB, which is why an "L4 24 GB" shows as 22 GiB and an "L40S 48 GB" as 44 GiB.**
- Location: "Specifications for Amazon EC2 accelerated computing instances", table "Performance specifications", column "Accelerator memory"
- Verdict: CARRIED (seed 03 section 1.1, re-fetched)
- Evidence: https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | Tier 1, first-party docs | documentation of support | rows as parsed: "g6f.large | 8.00 | AMD EPYC 7R13 | 2 | 1 | 2 | 0.125 x NVIDIA L4 GPU | 2.79 GiB"; "g6.xlarge | ... | 1 x NVIDIA L4 GPU | 22 GiB (1 x 22 GiB)"; "g6e.xlarge | ... | 1 x NVIDIA L40S GPU | 44 GiB (1 x 44 GiB)"; "g7.2xlarge | ... | 1 x NVIDIA RTX PRO 4500 GPU | 32 GiB (1 x 32 GiB)"; "g7e.2xlarge | ... | 1 x NVIDIA RTX PRO Server 6000 GPU | 96 GiB (1 x 96 GiB)"; "p5.48xlarge | ... | 8 x NVIDIA H100 GPU | 640 GiB (8 x 80 GiB)"; "p6-b300.48xlarge | ... | 8 x NVIDIA B300 GPU | 2148 GiB (8 x 268 GiB)" (accessed 2026-11-20)
- Use in dive: section 20, GPU memory capacity as its own part: it decides whether a job fits at all (F06-48: about 57 to 64 GB for 8,192 camera environments; F02-42: 40 GB to fine-tune GR00T N1.7; F01-90: 2 to 6 GB for ACT), independently of how fast the GPU computes.

**F08-46. Storage throughput has a per-instance ceiling that the instance type sets, like the vCPU count. EBS: g6.xlarge 125 MB/s baseline (625 burst), g6e.4xlarge 1,000 MB/s, g7e.48xlarge and p5en.48xlarge 12,500 MB/s. Local NVMe: from 1 x 250 GB on g6.xlarge to 8 x 3,800 GB on the eight-GPU P sizes.**
- Location: same page, tables "Amazon EBS specifications" (column "Baseline / Maximum throughput (MB/s, 128 KiB I/O)") and "Instance store specifications"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | Tier 1, first-party docs | documentation of support | EBS rows as parsed: "g6.xlarge | 1000.00 / 5000.00 | 125.00 / 625.00 | 4000.00 / 20000.00"; "g6e.4xlarge | 8000.00 | 1000.00 | 32000.00"; "g7e.48xlarge | 100000.00 | 12500.00 | 400000.00"; "p5en.48xlarge | 100000.00 | 12500.00 | 400000.00"; instance store rows: "g6.xlarge | 1 x 250 GB | NVMe SSD | 40,625 / 20,000"; "g7e.48xlarge | 4 x 3800 GB | NVMe SSD | 2,200,000 / 1,100,000"; "p5.48xlarge | 8 x 3800 GB | NVMe SSD | 4,400,000 / 2,200,000" (accessed 2026-11-20)
- Use in dive: section 20, storage as a part. Worked check for the arm `[derived]`: two 640x480 cameras at 30 fps are 55.3 MB/s raw (F01-86), under half of g6.xlarge's 125 MB/s EBS baseline, so storage is not what limits one arm; it becomes the limit at fleet and curation scale (F05-76).

**F08-47. For a shared file system the rule is "the lower of the network throughput and disk throughput". FSx for Lustre states it in those words, and gives the per-client ceiling by network interface: 100 Gbps over ENA, 700 Gbps over EFA, 1,200 Gbps over EFA with GPUDirect Storage.**
- Location: FSx for Lustre User Guide, "Amazon FSx for Lustre performance", sections on how file systems work and "Throughput to individual client instances"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html | Tier 1, first-party docs | definition | "When you write data to your file system, or when you read data that isn't stored on the in-memory cache, file system performance is determined by the lower of the network throughput and disk throughput." ; "If you are creating a file system with over 10 GBps of throughput capacity, we recommend enabling Elastic Fabric Adapter (EFA) to optimize throughput per client instance." ; table "Maximum throughput per client, Gbps": "Non EFA-enabled Any 100 Gbps*", "EFA-enabled EFA 700 Gbps", "EFA-enabled EFA with GDS 1200 Gbps" (accessed 2026-11-20)
- Use in dive: section 20: storage and network are two parts that limit one another, and the EFA adapter serves storage traffic as well as training traffic.

**F08-48. The network has two personalities on EC2, and they are two different devices. ENA "offers traditional IP networking": moving data. EFA is for "inter-instance communication that is critical for scaling AI/ML and HPC applications": it bypasses the operating system kernel and uses AWS's own reliable datagram transport, so many machines can train as one.**
- Location: Amazon EC2 User Guide, "Elastic Fabric Adapter for AI/ML and HPC workloads on Amazon EC2", introduction and "EFA basics"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html | Tier 1, first-party docs | definition | "An Elastic Fabric Adapter (EFA) is a network device that you can attach to your Amazon EC2 instance to accelerate Artificial Intelligence (AI), Machine Learning (ML), and High Performance Computing (HPC) applications." ; "It enhances the performance of inter-instance communication that is critical for scaling AI/ML and HPC applications." ; "The EFA device provides capabilities like built-in OS-bypass and congestion control through the Scalable Reliable Datagram (SRD) protocol." ; "While the ENA device offers traditional IP networking." (accessed 2026-11-20)
- Use in dive: section 20, network as two parts: data movement (uploading episodes, reading datasets) and the tightly coupled training fabric (shape C). The repo's own EFA deep dive covers the mechanism; this dive only needs the split.

**F08-49. Network capacity scales with the instance by a factor of more than 1,000 inside the accelerated families, and the training fabric is absent on the small sizes. g6.xlarge: 2.5 Gbps baseline, no EFA. g6e.4xlarge: 20 Gbps, no EFA. g7.48xlarge: 700 Gbps with EFA. g7e.48xlarge: 1,600 Gbps. p5.48xlarge, p5en.48xlarge, p6-b200.48xlarge: 3,200 Gbps. p6-b300.48xlarge: 6,400 Gbps.**
- Location: "Specifications for Amazon EC2 accelerated computing instances", table "Network specifications"
- Verdict: CARRIED (seed 03 section 1.1, re-fetched)
- Evidence: https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | Tier 1, first-party docs | documentation of support | rows as parsed (bandwidth, EFA): "g6.xlarge | 2.5 / 10.0 | ✗ No"; "g6e.4xlarge | 20 Gigabit | ✗ No"; "g6e.48xlarge | 400 Gigabit | ✓ Yes"; "g7.48xlarge | 700 Gigabit | ✓ Yes"; "g7e.2xlarge | 50 Gigabit | ✗ No"; "g7e.48xlarge | 1600 Gigabit | ✓ Yes"; "p5.48xlarge | 3200 Gigabit | ✓ Yes"; "p6-b300.48xlarge | 6400 Gigabit | ✓ Yes" (accessed 2026-11-20)
- Use in dive: section 20, the network column: single-GPU fan-out jobs (shape A) do not get, and do not need, the fabric; 6,400 / 2.5 = 2,560 `[derived]`.

**F08-50. [our reading] The nine parts the dive uses, and the counter that shows each one. (1) CPU front end: front-end bound slots. (2) CPU back end, core: back-end bound slots not attributed to memory. (3) Memory bandwidth and (4) memory latency: memory-bound slots or memory stall cycles, told apart by throughput versus time per access. (5) GPU tensor cores: DCGM tensor activity, Nsight Compute tensor pipeline. (6) General GPU compute: SM activity and the floating-point pipelines. (7) GPU ray-tracing cores: no counter located. (8) GPU video engines: encoder and decoder utilisation. (9) GPU memory capacity and bandwidth: memory used, DRAM activity, the roofline's sloped part. Storage and network are parts outside the chip, read from the instance's limits and the operating system's I/O counters.**
- Location: synthesis of F08-4 to F08-6, F08-30 to F08-36, F08-41 to F08-49
- Verdict: NEW
- Evidence: this register, entries listed in Location | synthesis over Tier 1 sources | definition | "Tensor Activity The fraction of cycles the tensor (HMMA / IMMA) pipe was active." (F08-32); "Encoder Percent of time over the past sample period during which the GPU's video encoder was being used." (F08-31); "RT Cores, if available" (F08-36) (accessed 2026-11-20)
- Use in dive: section 20, the legend of the workload table; section 21, the columns of a PMU card. The list of parts is the dive's own grouping, labelled as such.

### F. The instances: EC2 accelerated and Arm families as of 2026-11-20 (sections 20, 23, 25)

**F08-51. The G and P families in the EC2 accelerated-computing specification page today: G4ad, G4dn, G5, G5g, G6, G6e, G6f, Gr6, Gr6f, G7, G7e; P4d, P4de, P5, P5e, P5en, P6-B200, P6-B300, P6e-GB200. Nothing newer than G7 and G7e appears in G, nothing newer than P6-B300 and P6e-GB200 in P, and neither P6e-GB300 nor any P7 has a row.**
- Location: "Specifications for Amazon EC2 accelerated computing instances", tables "Instance family summary" and "Performance specifications"
- Verdict: CARRIED (seed 03 section 1.1, re-fetched; unchanged since the seed's fetch of 2026-11-17)
- Evidence: https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | Tier 1, first-party docs | documentation of support | instance-type prefixes found in the page text: "dl1, dl2q, f2, g4ad, g4dn, g5, g5g, g6, g6e, g6f, g7, g7e, gr6, gr6f, inf1, inf2, p4d, p4de, p5, p5e, p5en, p6-b200, p6-b300, p6e-gb200, trn1, trn1n, trn2, trn2u, vt1" (accessed 2026-11-20; the page shows no last-updated date in its HTML)
- Use in dive: sections 20, 23, 25: the list the instance table is built from.

**F08-52. G7 is the newest G family: generally available 18 June 2026 in US East (Ohio) and US West (Oregon), up to 8 RTX PRO 4500 Blackwell Server Edition GPUs with 32 GB each, on Intel Xeon 6 (Granite Rapids) with simultaneous multithreading off, so every vCPU is a physical core.**
- Location: AWS What's New post "Amazon EC2 G7 ... generally available"; `ac.html` rows g7.*; G7 product page
- Verdict: CARRIED (seed 03, re-fetched)
- Evidence: https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-ec2-g7-generally-available/ | Tier 2, first-party announcement | documentation of support | "Posted on: Jun 18, 2026" ; "NVIDIA RTX PRO 4500 Blackwell Server Edition GPUs" ; "32 GB of memory per GPU" ; "up to 4.6x AI inference performance and up to 2.1x graphics performance compared to G6" `[vendor claim]` ; "You can purchase G7 instances as On-Demand Instances, as part of Savings Plans, or Spot Instances." ; docs row: "g7.48xlarge | 768.00 | Intel Xeon Granite Rapids | 192 | 192 | 1 | 8 x NVIDIA RTX PRO 4500 GPU | 256 GiB (8 x 32 GiB)" (vCPUs 192, CPU cores 192, threads per core 1) ; product page: "With simultaneous multi-threading disabled, these custom processors deliver maximum per-core compute performance" (accessed 2026-11-20)
- Use in dive: sections 20 and 25. G7 is the only G or P family in the table where 24 vCPUs per GPU means 24 physical cores (F08-57).

**F08-53. G7e became generally available on 20 January 2026 in US East (N. Virginia) and US East (Ohio): up to 8 RTX PRO 6000 Blackwell Server Edition GPUs with 96 GB each, up to 192 vCPUs, up to 1,600 Gbps of EFA networking, and AWS names "physical AI models" among its workloads.**
- Location: AWS What's New post "Amazon EC2 G7e instances are now generally available"
- Verdict: CARRIED (seed 03, re-fetched)
- Evidence: https://aws.amazon.com/about-aws/whats-new/2026/01/amazon-g7e-instances-generally-available/ | Tier 2, first-party announcement | documentation of support | "Jan 20, 2026" ; "96 GB of memory per GPU." ; "up to 2.3x inference performance compared to G6e." `[vendor claim]` ; "8 NVIDIA RTX PRO 6000 Blackwell Server Edition GPUs" (accessed 2026-11-20; the Regions and the workload list were returned in paraphrase by the fetch, not as quotes)
- Use in dive: sections 20 and 25.

**F08-54. P6e-GB300 UltraServers were announced generally available on 2 December 2025, with 1.5 times the GPU memory and FP4 compute of P6e-GB200, and are obtained through an AWS sales representative. They have no row in the EC2 specification table today, so their vCPU, memory and network figures are not established here.**
- Location: AWS What's New post of 2025-12-02; absence from `ac.html` (F08-51)
- Verdict: CARRIED (seed 03, re-fetched)
- Evidence: https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-p6e-gb300-ultraservers-nvidia-gb300-nvl72-generally-available | Tier 2, first-party announcement | documentation of support | "Posted on: Dec 2, 2025" ; "Today, AWS announces the general availability of Amazon Elastic Compute Cloud (Amazon EC2) P6e-GB300 UltraServers." ; "P6e-GB300 UltraServers, accelerated by NVIDIA GB300 NVL72, provide 1.5x GPU memory and 1.5x FP4 compute (without sparsity) compared to P6e-GB200." ; "To get started with P6e-GB300 UltraServers, please contact your AWS sales representative." (accessed 2026-11-20)
- Use in dive: section 25, as the top of the P range, shown from the announcement only.

**F08-55. No Rubin-based EC2 instance family (a "P7" or any other name) was located on AWS first-party pages today. AWS's statement of 26 August 2026 says NVIDIA Vera CPUs "are coming to AWS" and names no instance family.**
- Location: About Amazon article "AWS and NVIDIA to deploy 2 million more GPUs for AI in 2027-2028"; `ac.html` (F08-51); an AWS-domain web search for "P7" and "Vera Rubin"
- Verdict: UNKNOWN (U08-5) for any Rubin instance; NEW for the Vera statement
- Wave 2 (2026-11-20, SCOPE NARROWER): AWS's press release of 26 August 2026 does name Rubin: "AWS plans to deploy an additional 2 million NVIDIA Blackwell Ultra, Rubin and Rubin Ultra GPUs in 2027-2028 across AWS Global Infrastructure, including AI factories" (https://press.aboutamazon.com/aws/2026/8/aws-and-nvidia-to-deliver-2-million-additional-gpus-and-next-generation-infrastructure-for-agentic-and-physical-ai, accessed 2026-11-20). No Rubin-based EC2 instance family is named or documented as of 20 November 2026; the newest P families on the specification page are P6-B300 and P6e-GB200. Closes U08-5 as far as research can.
- Evidence: https://www.aboutamazon.com/news/aws/aws-nvidia-2-million-gpus-ai | Tier 2, first-party announcement | documentation of support | "Published: August 26, 2026" ; "NVIDIA Vera CPUs are coming to AWS, providing an additional compute option for agentic AI." ; "Vera is built for the CPU work behind agentic AI and reinforcement learning" (accessed 2026-11-20; the fetch reported that the words "Rubin" and "P7" do not occur in the article body it read, although the search-result summary of the same page mentioned Rubin GPUs; that mismatch is unresolved)
- Use in dive: section 25, one line: the P family tops out at Blackwell Ultra in the documentation as of 2026-11-20; a Rubin family is "not located in this research".

**F08-56. The newest Graviton generation is Graviton5, and three families use it: M9g and M9gd (generally available 10 June 2026), C9g and C9gd (30 June 2026), R9g and R9gd (31 August 2026). AWS's Graviton guide gives the cores: Graviton3 is Neoverse V1, Graviton4 is Neoverse V2, Graviton5 is Neoverse V3 at 3,300 MHz. The largest size has 192 vCPUs, one per physical core.**
- Location: AWS What's New posts for M9g, C9g, R9g; `README.md` table "Building for Graviton" in the Graviton guide; `gp.html` and `co.html` specification tables
- Verdict: NEW (the seed's instance table stops at Graviton4-era names)
- Evidence: https://github.com/aws/aws-graviton-getting-started/blob/541d1ad524bb1630e16b8e66aef36dcd01a3bbc1/README.md | Tier 1, first-party AWS repository | documentation of support | table row "Core |[Neoverse-N1]...|[Neoverse-V1]...|[Neoverse-V2]... | [Neoverse-V3]..." under the header "Processor|Graviton2 |Graviton3(E) | Graviton4 | Graviton5 |" ; "Frequency |2500MHz |2600MHz |2800MHz (2700MHz for 48xlarge) | 3300MHz" ; and from https://aws.amazon.com/about-aws/whats-new/2026/06/ec2-m9g-m9gd-instances-graviton5-processors-available/ (Tier 2): "Posted on: Jun 10, 2026", "deliver up to 25% better compute performance compared to AWS Graviton4-based M8g and M8gd instances." `[vendor claim]` ; https://aws.amazon.com/about-aws/whats-new/2026/06/ec2-c9g-c9gd-instances-graviton5-processors-available/ : "Jun 30, 2026" ; https://aws.amazon.com/about-aws/whats-new/2026/08/amazon-ec2-r9g-and-r9gd-memory-optimized-instances-are-now-available/ : "Posted on: Aug 31, 2026" ; docs rows (https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html): "c9g.48xlarge | 384.00 | AWS Graviton5 | 192 | 192 | 1" and "c8g.48xlarge | 384.00 | AWS Graviton4 Processor | 192 | 192 | 1" (accessed 2026-11-20)
- Use in dive: sections 20, 21, 25. It ties the Arm formulas to EC2: Graviton3 uses F08-17, Graviton4 uses F08-18, Graviton5 uses the Neoverse V3 formula of F08-19, with 8, 8 and 10 slots per cycle (F08-16). The DGX Spark's X925 shares the V3's formula and slot count, so Tier 0 results on the X925 are the closest stand-in we own for a C9g core `[our reading]`; they are not a measurement of one.

**F08-57. [derived] CPU per GPU, from the docs table. Eight-GPU sizes of G5, G6, G6e, G7e, P5, P5e, P5en, P6-B200, P6-B300: 192 vCPUs / 8 = 24 vCPUs per GPU, which is 12 physical cores (2 threads per core). g7.48xlarge: 192 / 8 = 24 physical cores per GPU (1 thread per core). p4d.24xlarge: 96 / 8 = 12 vCPUs, 6 cores. p6e-gb200.36xlarge: 144 / 4 = 36 Grace cores. Single-GPU sizes run from 4 vCPUs (g6.xlarge, g6e.xlarge) to 64 (g6.16xlarge, g6e.16xlarge); g7 and g7e single-GPU sizes run from 8 to 32.**
- Location: `ac.html`, table "Performance specifications", columns vCPUs, CPU cores, Threads per core, Accelerators
- Verdict: CARRIED (register 05, F05-65 and F05-66, state the vCPU ratios; the physical-core reading and the G7 exception are new here)
- Evidence: https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | Tier 1, first-party docs | documentation of support, arithmetic | "g6e.48xlarge | 1536.00 | AMD EPYC 7R13 | 192 | 96 | 2 | 8 x NVIDIA L40S GPU"; "g7.48xlarge | 768.00 | Intel Xeon Granite Rapids | 192 | 192 | 1 | 8 x NVIDIA RTX PRO 4500 GPU"; "g7e.48xlarge | 2048.00 | Intel Xeon Emerald Rapids | 192 | 96 | 2 | 8 x NVIDIA RTX PRO Server 6000 GPU"; "p4d.24xlarge | 1152.00 | Intel Xeon Platinum 8275CL | 96 | 48 | 2 | 8 x NVIDIA A100 GPU"; "p6e-gb200.36xlarge | 960.00 | Nvidia Grace CPU | 144 | 144 | 1 | 4 x NVIDIA B200 GPU"; "g6.16xlarge | 256.00 | AMD EPYC 7R13 | 64 | 32 | 2 | 1 x NVIDIA L4 GPU"; "g7e.8xlarge | 256.00 | Intel Xeon Emerald Rapids | 32 | 16 | 2 | 1 x NVIDIA RTX PRO Server 6000 GPU" (accessed 2026-11-20)
- Use in dive: sections 20 and 23: the CPU budget for decode, augmentation and physics next to each GPU (F05-107). A vCPU that is a hyperthread is not a core; the table should print cores.

**F08-58. [our reading] The instance table for the dive. RT cores: from F06-58, F06-59, F06-60 and F08-43. Video engines: F05-46 to F05-54 and F08-44. vCPU per GPU: F08-57. Dates: only where re-fetched in this register. Prices: not collected (F08-59).**
- Location: synthesis; see the table below
- Verdict: NEW
- Wave 2 (2026-11-20, WRONG (G7 superlative)): G7 does not have the most CPU cores per GPU. p6e-gb200.36xlarge has 144 Grace cores for 4 GPUs, 36 per GPU, and g5g.16xlarge has 64 Graviton2 cores for 2 GPUs, 32 per GPU [derived from the same docs page]. Corrected: G7 has twice the physical cores per GPU of every other eight-GPU x86 size (24 against 12).
- Evidence: entries named in the table | synthesis over Tier 1 and Tier 2 sources | documentation of support | "GPUs without RT Cores (A100, H100) are not supported." (F06-52, Isaac Sim 6.2.0 requirements, quoted there) (accessed 2026-11-20)
- Use in dive: sections 20, 23, 25.

| Family | GPU (count per instance) | GPU memory, GiB per GPU (docs) | RT cores | NVENC / NVDEC engines, AV1 | vCPU per GPU (largest multi-GPU size) | Launch date fetched here | Fits (our reading) |
|---|---|---|---|---|---|---|---|
| G4dn | T4 (1, 4, 8) | 16 | not checked in registers 06 or 08 | 1 / 2, no AV1 (F05-53) | 12 (g4dn.metal, 96 / 8) | not re-fetched | old; no AV1; avoid for LeRobot's default video |
| G5 | A10G (1, 4, 8) | 22 | yes, 72 on the A10 (F06-58) | 1 / 2, AV1 decode only, row is "A10" (F05-54) | 24 | not re-fetched | small-model training, RTX sim at low scale |
| G5g | T4g (1, 2), Graviton2 | 16 | not checked | no row checked for T4g | 32 (g5g.16xlarge, 64 / 2) | not re-fetched | the only Graviton plus NVIDIA family; old GPU |
| G6 | L4 (1, 4, 8) | 22 | yes, "third-generation", no count (F06-58) | 2 / 4, AV1 both (F05-50) | 24 | not re-fetched | decode and embed, ACT and SmolVLA training, small RTX sim |
| G6f, Gr6f | fraction of an L4 (1/8 to 1/2) | 2.79 to 11.18 | as L4 | as L4 (sharing not checked) | n/a | not re-fetched | viewers and light inference; below Isaac Sim's 16 GB minimum (F06-52) |
| Gr6 | L4 (1), 1:8 vCPU to RAM | 22 | as L4 | as L4 | n/a | not re-fetched | L4 jobs that need more host RAM |
| G6e | L40S (1, 4, 8) | 44 | yes, 142 third-generation (F06-58) | 3 / 3, AV1 both (F05-51) | 24 | not re-fetched | RTX sim with cameras, curation, VLA fine-tune up to about 40 GB |
| G7 | RTX PRO 4500 Blackwell SE (1, 2, 4, 8) | 32 | yes, "4th Gen RT Cores", no count (F08-43) | 3 / 3, AV1 both (F08-44) | 24 physical cores (wave 2: the most among eight-GPU x86 sizes; P6e-GB200 has 36 and G5g 32 per GPU) | 2026-06-18 (F08-52) | sim plus decode plus training on one card; most CPU cores per GPU |
| G7e | RTX PRO 6000 Blackwell SE (1, 2, 4, 8) | 96 | yes, 188 fourth-generation (F06-58) | 4 / 4, AV1 both (F05-52) | 24 | 2026-01-20 (F08-53) | thousands of camera environments (F06-48), world-model generation, large VLA fine-tune |
| P4d, P4de | A100 (8) | 40, 80 | no (F06-60) | 0 / 5, no AV1 (F05-46) | 12 | not re-fetched | legacy training |
| P5 | H100 (1, 8) | 80 | no (F06-59, F06-60) | 0 / 7, no AV1 decode (F05-47) | 24 (16 on p5.4xlarge) | not re-fetched | training; video must be decoded on the CPU or re-encoded |
| P5e, P5en | H200 (8) | 141 | no (F06-59, F06-60) | no row in NVIDIA's matrix (F05-49, F08-44) | 24 | not re-fetched | training, larger models |
| P6-B200 | B200 (8) | 179 | no (F06-60) | 0 / 7, AV1 decode (F05-48) | 24 | month in URL only: 2025-05 | training; first P family that hardware-decodes AV1 |
| P6-B300 | B300 (8) | 268 | no (F06-60) | 0 / 7, AV1 decode (F05-48) | 24 | month in URL only: 2025-11 | training at the largest single-node memory |
| P6e-GB200 | GB200, Grace CPU (4 per instance) | 185 | no (F06-60) | 0 / 7, AV1 decode (F05-48) | 36 | not re-fetched | tightly coupled pretraining (shape C) |
| P6e-GB300 | GB300 NVL72 | not in docs table | not stated; `[our reading]` same class as GB200 | 0 / 7, AV1 decode (F05-48) | UNKNOWN | 2025-12-02 (F08-54) | vendor-scale pretraining, via sales |
| C9g, M9g, R9g | none (Graviton5, Neoverse V3) | n/a | n/a | n/a (CPU decode) | n/a, up to 192 cores | 2026-06-30, 2026-06-10, 2026-08-31 (F08-56) | CPU physics, software video decode, preprocessing |
| C8g, M8g, R8g | none (Graviton4, Neoverse V2) | n/a | n/a | n/a | n/a, up to 192 cores | not re-fetched | same, previous generation |

**F08-59. Prices were not collected. No dated first-party price for any family above was fetched in this register, so every price-performance figure in the dive stays a method (F08-85) until a dated price source is recorded.**
- Location: n/a
- Verdict: UNKNOWN (U08-6)
- Evidence: none fetched | n/a | n/a | "Not located in this research": the EC2 On-Demand pricing page renders its tables in the browser and was not attempted; AWS's public bulk price list file was not downloaded (it is a multi-gigabyte file); no AWS API was called, by the rules of this pass (accessed 2026-11-20)
- Use in dive: section 23. Seed figures ("g6e.4xlarge ~$1.86/h", "p5.48xlarge ... $55.04/hour") were not re-fetched and must not be carried.

### G. Tier 0: our own measurements (section 22)

Every entry in this section cites files under `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/`
(shortened below to `E-seed/`). Tier 0, **single run**: one execution per kernel per core type, one thread pinned to
one core, no repeat, no variance. Front-end and bad-speculation percentages use the generic formula without Arm's
flush correction (F08-22); back-end and retiring percentages match Arm's method on the DGX Spark cores.

**F08-60. What was run. On an NVIDIA DGX Spark (Cortex-X925 and Cortex-A725 cores, GB10 GPU) and an NVIDIA Jetson Orin Nano Super (Cortex-A78AE cores): 14 single-thread CPU microbenchmarks and 3 CPU stand-in workloads, each under `perf stat` twice (once for the six top-down events, once for eight detail events), plus one GPU matrix-multiply kernel per machine under Nsight Compute.**
- Location: `E-seed/run.sh` (whole file); `experiments/README.md`, table and "How to cite these results"
- Verdict: NEW (Tier 0 registered from the copied seed results)
- Evidence: `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/run.sh` | Tier 0, single run | our measurement (method) | "TD=\"stall_slot,stall_slot_frontend,stall_slot_backend,op_retired,op_spec,cpu_cycles\"" ; "L2=\"inst_retired,cpu_cycles,stall_backend_mem,br_mis_pred_retired,l1d_cache_refill,l2d_cache_refill,l1i_cache_refill,ll_cache_miss_rd\"" ; "m=$(sudo -n taskset -c \"$CPU\" \"$PERF\" stat -x, -o /tmp/pai-bench.a -e \"$(ev $TD)\" -- \"$@\" ..." ; README: "Tier 0, **single run**: every figure comes from one execution per kernel per core type. No repeat count, no variance." (accessed 2026-11-20)
- Use in dive: section 22, the method box. Limit: the top-down events and the detail events come from two separate executions of the same program, so ratios that mix the two (for example mispredicts per cycle against front-end slots) compare two runs.

**F08-61. Physics step (MuJoCo humanoid, one core, one run): 14,507 steps/s on the Jetson A78AE, 28,662 on the Spark A725, 57,240 on the Spark X925. Retiring is the largest category on all three (43.2%, 61.0%, 45.7%). What is lost differs: the A78AE loses 31.0% of slots to the front end, the X925 loses 36.5% to the back end with almost no memory stall (0.4% of cycles).**
- Location: `E-seed/report.md`, section 3, table "Physics sim step (MuJoCo humanoid)"; raw rows `wl_sim` in the three files under `E-seed/results-pass2/`
- Verdict: NEW
- Evidence: `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/report.md` | Tier 0, single run | our measurement | "| Jetson A78AE | 14507 steps/s | 31.0% | 21.5% | 43.2% | 4.3% | 2.2% | 2.48 | 1.78 | 5.22 | 4.57 | 7.22 |" ; "| Spark A725 | 28662 steps/s | 10.1% | 22.0% | 61.0% | 6.9% | 0.7% | 3.01 | 1.38 | 5.42 | 0.38 | 6.53 |" ; "| Spark X925 | 57240 steps/s | 12.2% | 36.5% | 45.7% | 5.6% | 0.4% | 4.37 | 0.91 | 3.64 | 0.12 | 6.38 |" (columns: throughput, front end, back end, retiring, bad speculation, memory stall as a share of cycles, IPC, branch misses, L1d, L2 and L1i refills per thousand instructions) (accessed 2026-11-20)
- Use in dive: section 22, first workload row; section 20, evidence that CPU physics is a core-bound and front-end workload, not a memory one `[our reading]`. Limits: a humanoid model, not the SO-101; random controls; the model's timestep is 0.005 s (`humanoid.xml`: "<option timestep=\"0.005\"/>"), so one X925 core steps this model at 57,240 x 0.005 = 286 times real time `[derived]`; front-end figures carry the caveat of F08-22 (about 1.6 points on this row by the illustration in F08-23).

**F08-62. Policy inference stand-in (six 1024x1024 float32 matrix-vector products with ReLU, NumPy on one core, one run): 390 inferences/s on the Jetson A78AE, 1,404 on the Spark A725, 1,968 on the Spark X925. The Jetson spends 63.9% of slots back-end bound and 62.3% of cycles stalled on memory.**
- Location: `E-seed/report.md`, section 3, table "Policy inference (6x1024 MLP, CPU)"; `E-seed/workloads.py`, branch `mode == "policy"`
- Verdict: NEW
- Evidence: `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/report.md` | Tier 0, single run | our measurement | "| Jetson A78AE | 390 infer/s | 9.0% | 63.9% | 26.8% | 0.3% | 62.3% | 0.93 | 0.36 | 34.23 | 41.82 | 1.41 |" ; "| Spark A725 | 1404 infer/s | 22.8% | 21.6% | 54.8% | 0.8% | 22.8% | 2.96 | 0.40 | 65.05 | 65.21 | 0.69 |" ; "| Spark X925 | 1968 infer/s | 4.5% | 67.0% | 28.0% | 0.5% | 22.4% | 3.07 | 0.38 | 13.52 | 62.37 | 0.62 |" ; `workloads.py`: "W = [rs.standard_normal((1024, 1024), dtype=np.float32) * 0.03 for _ in range(6)]" (accessed 2026-11-20)
- Use in dive: section 22, second workload row. Limit: this is not ACT and not a VLA; it is a dense layer stack with batch 1 on the CPU, where real policies run convolutions and attention on the GPU.

**F08-63. [derived] Why that stand-in is memory-bound: its weights are 6 x 1024 x 1024 x 4 bytes = 25.2 MB, larger than any cache on either machine, and every inference reads all of them. At the measured rates that is 390 x 25.2 MB = 9.8 GB/s on the Jetson core, 35.3 GB/s on the A725 and 49.5 GB/s on the X925. The Jetson figure sits at that core's measured memory limits (9.25 GB/s read, 11.71 GB/s triad).**
- Location: `E-seed/workloads.py` (matrix sizes); `E-seed/report.md` section 1 rows "Triad DRAM" and "Mem read"; PMU cards, "Caches (lscpu)"
- Verdict: NEW
- Evidence: `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/report.md` | Tier 0, single run | our measurement, arithmetic | "| Triad DRAM | GB/s | 11.71 | 43.95 | 44.38 |" ; "| Mem read | GB/s | 9.25 | 22.08 | 28.94 |" ; `pmu-cards/jetson-orin-nano.md`: "Caches (lscpu): L1d 64K, L1i 64K, L2 256K (1.5M total), L3 2M (4M total)" ; `pmu-cards/dgx-spark.md`: "L2 512K (25M total), L3 8M (24M total)" (accessed 2026-11-20)
- Use in dive: section 22, the worked reading of a PMU card: throughput x bytes touched = bandwidth demanded, compared with bandwidth available. Section 20: memory bandwidth as the saturated part. Caveat: on the Spark cores the derived traffic (35.3 and 49.5 GB/s) is above the "Mem read" kernel's figure, which says that kernel understates the bandwidth available (on the X925 it was 82.9% front-end bound, so the loop and not the memory limited it); the triad figure is the better ceiling `[our reading]`.

**F08-64. Camera render stand-in (MuJoCo offscreen 640x480 through EGL, with a physics step per frame, one core, one run): 209 frames/s on the Jetson A78AE, 937 on the Spark A725, 1,191 on the Spark X925. On the X925 69.2% of slots are back-end bound with only 3.4% of cycles in memory stall.**
- Location: `E-seed/report.md`, section 3, table "Camera render (MuJoCo offscreen 640x480)"; `E-seed/workloads.py`, branch `mode == "render"`; `run.sh` (`MUJOCO_GL=egl`)
- Verdict: NEW
- Evidence: `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/report.md` | Tier 0, single run | our measurement | "| Jetson A78AE | 209 frames/s | 34.0% | 38.5% | 25.9% | 1.6% | 6.2% | 1.45 | 2.01 | 4.11 | 6.65 | 7.98 |" ; "| Spark A725 | 937 frames/s | 19.1% | 42.1% | 35.0% | 3.8% | 6.3% | 1.73 | 1.92 | 11.90 | 12.33 | 14.46 |" ; "| Spark X925 | 1191 frames/s | 8.2% | 69.2% | 21.6% | 0.9% | 3.4% | 2.11 | 0.19 | 5.77 | 6.30 | 7.91 |" (accessed 2026-11-20)
- Use in dive: section 22, third workload row, with its limit stated beside it: EGL is "hardware accelerated headless rendering" (F06-61), and the run did not establish how much of each frame the GPU did. The counters describe the CPU thread only; a thread waiting on the GPU can read as back-end bound or as idle, so this row cannot be used to compare rendering hardware.

**F08-65. Floating-point capability (24 independent multiply-add chains, one core, one run): 3.411 billion fused multiply-adds per second on the A78AE, 5.595 on the A725, 22.242 on the X925, a ratio of 6.5 between the Jetson core and the Spark's big core. The X925 retires 61.8% of its 10 slots on this kernel at 6.18 instructions per cycle, with 0.0% front-end bound.**
- Location: `E-seed/report.md`, section 1 row "FMA" and section 2 rows "FMA"; `E-seed/micro.c`, comment above `b_fma`
- Verdict: NEW
- Evidence: `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/report.md` | Tier 0, single run | our measurement | "| FMA | Gfma/s | 3.411 | 5.595 | 22.242 |" ; X925 table: "| FMA | 0.0% | 38.1% | 61.8% | 0.0% | 0.0% | 6.18 |" ; A78AE table: "| FMA | 33.1% | 30.8% | 36.1% | 0.0% | 0.0% | 2.17 |" ; `micro.c`: "24 independent scalar chains held in registers. With 8 chains the loop was bound by FMA latency (IPC 2.5 on every core). 24 chains cover latency 4 x up to 6 FP pipes, so this measures multiply-add throughput, not latency." (accessed 2026-11-20; 22.242 / 3.411 = 6.52 `[derived]`)
- Use in dive: section 22, the capability table (what the core can do at best), against which a workload row is read; section 20, the back-end, core-bound part. The kernel is scalar: it does not measure vector (NEON or SVE) throughput.

**F08-66. Memory bandwidth from one core (STREAM-style triad over a footprint larger than the caches, one run): 11.71 GB/s on the Jetson A78AE, 43.95 GB/s on the Spark A725, 44.38 GB/s on the Spark X925. The two Spark core types reach the same figure although one is twice as wide: the memory, not the core, is the limit. The Spark delivers 3.8 times the Jetson.**
- Location: `E-seed/report.md`, section 1 row "Triad DRAM"; section 2 rows "Triad DRAM"
- Verdict: NEW
- Evidence: `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/report.md` | Tier 0, single run | our measurement | "| Triad DRAM | GB/s | 11.71 | 43.95 | 44.38 |" ; X925: "| Triad DRAM | 24.5% | 61.0% | 14.4% | 0.0% | 39.9% | 1.63 |" ; A725: "| Triad DRAM | 3.7% | 50.4% | 45.8% | 0.1% | 44.6% | 2.27 |" ; A78AE: "| Triad DRAM | 78.1% | 7.9% | 14.0% | 0.0% | 2.6% | 0.98 |" (accessed 2026-11-20; 44.38 / 11.71 = 3.79 `[derived]`)
- Use in dive: sections 20 and 22, memory bandwidth as a part that saturates on its own. For scale, the vendors' whole-machine figures are 102 GB/s for the Orin Nano Super (F07-36) and 273 GB/s for the DGX Spark (F07-47); ours are one core. Anomaly to print, not hide: on the A78AE the kernel reads 78.1% front-end bound with 2.6% memory stall, which does not look like a memory-bound loop; the seed handoff reports the same kind of artefact on the X925 triad L1 kernel disappearing with `-funroll-loops`, a result with no raw file here (U08-7).

**F08-67. Memory latency (pointer chase, one dependent load at a time, footprint larger than the caches, one run): 291.58 ns per load on the Jetson A78AE, 144.92 ns on the Spark A725, 123.96 ns on the Spark X925. In cache the same loop takes 1.03 to 2.32 ns (L1) and 5.81 to 10.08 ns (L3). At DRAM the back end is 97.6% to 99.0% bound on all three cores.**
- Location: `E-seed/report.md`, section 1 rows "Latency L1" to "Latency DRAM"; section 2 rows "Latency DRAM"; `E-seed/micro.c`, comment above `b_chase`
- Verdict: NEW
- Evidence: `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/report.md` | Tier 0, single run | our measurement | "| Latency L1 | ns/load | 2.32 | 1.43 | 1.03 |" ; "| Latency L3 | ns/load | 10.08 | 6.29 | 5.81 |" ; "| Latency DRAM | ns/load | 291.58 | 144.92 | 123.96 |" ; X925: "| Latency DRAM | 0.3% | 99.0% | 0.7% | 0.0% | 79.0% | 0.07 |" ; `micro.c`: "Pointer chase: dependent loads through a full-period LCG permutation. One 64-byte node per cache line" (accessed 2026-11-20)
- Use in dive: section 20, memory latency as a different part from memory bandwidth: the triad and the chase are both "memory-bound", and the Spark beats the Jetson by 3.8 times on one and 2.4 times on the other (291.58 / 123.96 = 2.35 `[derived]`). Limit: with random 64-byte nodes over a large footprint, the figure includes address-translation (TLB) misses, not only the memory access; page size was not recorded.

**F08-68. Slots per cycle as measured: 10 on the Cortex-X925, 5 on the Cortex-A725 (both read from the kernel and both equal to Arm's published `num_slots`, F08-16), 6 on the Cortex-A78AE (the Jetson's kernel reports 0, so the value was derived as (STALL_SLOT + OP_SPEC) / CPU_CYCLES, which came out at exactly 6.000 on three different kernels).**
- Location: `E-seed/report.md`, "Slots-per-cycle self check"; `E-seed/pmu-cards/jetson-orin-nano.md`, "CPU counters"; `E-seed/pmu-cards/dgx-spark.md`, "CPU counters"
- Verdict: NEW
- Evidence: `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/report.md` | Tier 0, single run | our measurement | "| Jetson A78AE | 6.000 | 6.000 | 6.000 |" ; "| Spark A725 | 5.000 | 5.000 | 5.000 |" ; "| Spark X925 | 10.000 | 10.000 | 10.000 |" ; Jetson card: "The PMU reports slots = 0, so the kernel does not give slots-per-cycle. [MEASURED 2026-11-18] Derived it as (stall_slot + op_spec) / cpu_cycles = 6.000 on this box." ; Spark card: "`armv8_pmuv3_1` (X925, slots = 10) and `armv8_pmuv3_0` (A725, slots = 5)" (accessed 2026-11-20)
- Use in dive: sections 21 and 22. The derivation works because of how Arm defines the events (F08-15): in every cycle each slot either stalls (STALL_SLOT) or dispatches a micro-operation (OP_SPEC). It recovers 10 and 5 where Arm's files say 10 and 5, which supports the 6 for the A78AE; Arm publishes no file for that core (U08-1).

**F08-69. [derived] The four Tier 0 categories add to exactly 100% in every row, and that is an identity of the formula, not a validation. Front end + back end = (STALL_SLOT_FRONTEND + STALL_SLOT_BACKEND) / slots = STALL_SLOT / slots, because the two stall counters add up to STALL_SLOT exactly in all 51 rows of pass 2; retiring + bad speculation = 1 - STALL_SLOT / slots by construction.**
- Location: the three files under `E-seed/results-pass2/`; formula in `E-seed/pmu-cards/dgx-spark.md`
- Verdict: NEW (corrects the reading in the card: "the four categories sum to about 100% on both core types, so the formula is self-consistent here")
- Evidence: `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/results-pass2/results-spark-x925.csv` | Tier 0, single run | our measurement, arithmetic | row `wl_sim`: "stall_slot=97275014000;stall_slot_frontend=24352200609;stall_slot_backend=72922813391;" and 24,352,200,609 + 72,922,813,391 = 97,275,014,000 (checked by script for every row of the three files: the difference is 0 in each) (accessed 2026-11-20)
- Use in dive: section 22: do not present "sums to 100%" as evidence the split is right. What would be evidence is a kernel with a known answer landing in the right bucket, and the microbenchmarks do provide that for the back end (pointer chase 99.0% back-end bound, F08-67) and for the unstalled case (FMA on the X925: 0.0% front end, F08-65).

**F08-70. [derived] Two report percentages recomputed from the raw counters; both match. (a) X925, MuJoCo step, back-end bound: 72,922,813,391 / (19,958,256,358 x 10) = 36.54%; report says 36.5%. (b) Jetson A78AE, policy stand-in, retiring: slots = 9,282,097,967 x 6 = 55,692,587,802; used share = 1 - 40,582,845,984 / 55,692,587,802 = 0.27131; retire ratio = 14,929,778,229 / 15,109,739,034 = 0.98809; product = 26.81%; report says 26.8%.**
- Location: `E-seed/results-pass2/results-spark-x925.csv` row `wl_sim`; `E-seed/results-pass2/results-jetson-a78ae.csv` row `wl_policy`; `E-seed/report.md` section 3
- Verdict: NEW
- Evidence: `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/results-pass2/results-jetson-a78ae.csv` | Tier 0, single run | our measurement, arithmetic | "wl_policy|policy 390 infer/s|stall_slot=40582845984;stall_slot_frontend=4994509009;stall_slot_backend=35588336975;op_retired=14929778229;op_spec=15109739034;cpu_cycles=9282097967;..." ; X925 `wl_sim`: "stall_slot_backend=72922813391;op_retired=91123888968;op_spec=102307494220;cpu_cycles=19958256358;" (accessed 2026-11-20; a script recomputed all four categories for all 51 rows of pass 2 and every value agreed with `report.md` to the printed decimal)
- Use in dive: section 22, the statement "report.md matches the CSV", and a second worked example for section 21.

**F08-71. GPU, DGX Spark (GB10), one kernel, one pass: a 4096x4096 float32 matrix multiply in PyTorch ran as `cutlass_80_simt_sgemm_128x128_8x4_nn_align1` in 8.35 ms under Nsight Compute 2025.3.1 (`basic` set): compute (SM) throughput 70.49%, memory throughput 50.47%, achieved occupancy 16.62%, SM clock 2.13 GHz. That is 2 x 4096^3 / 8.35 ms = about 16,460 GFLOP/s `[derived]`.**
- Location: `E-seed/pmu-cards/dgx-spark.md`, "GPU kernel under Nsight Compute [MEASURED 2026-11-20]"
- Verdict: NEW
- Evidence: `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/pmu-cards/dgx-spark.md` | Tier 0, single run | our measurement | "Kernel launched: `cutlass_80_simt_sgemm_128x128_8x4_nn_align1`, compute capability 12.1." ; "Duration 8.35 ms, SM frequency 2.13 GHz, Compute (SM) throughput 70.49%, Memory throughput 50.47%, achieved occupancy 16.62%." ; "It needs root (`sudo -n /usr/local/cuda/bin/ncu`); without it, ERR_NVGPUCTRPERM." (accessed 2026-11-20)
- Use in dive: section 22, the GPU half of the Spark card. Reading `[our reading]`: "simt" in the kernel name is the general floating-point path; a float32 multiply did not go through the tensor pipeline, so this run says nothing about tensor cores. The raw `.ncu-rep` report file is not in the experiments folder; only the card's summary line is.

**F08-72. GPU, Jetson Orin Nano Super, one kernel, one pass: a 2048x2048 float32 matrix multiply ran as `ampere_sgemm_128x128_nn` in 42.31 ms under Nsight Compute 2024.3.1: compute (SM) throughput 74.49%, memory throughput 48.27%, achieved occupancy 33.10%. The SM clock was 306 MHz during the profiled run, so the duration is not comparable with the Spark's.**
- Location: `E-seed/pmu-cards/jetson-orin-nano.md`, "GPU kernel under Nsight Compute [MEASURED 2026-11-20]"
- Verdict: NEW
- Evidence: `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/pmu-cards/jetson-orin-nano.md` | Tier 0, single run | our measurement | "Kernel launched: `ampere_sgemm_128x128_nn`, compute capability 8.7." ; "Duration 42.31 ms, SM frequency 306 MHz, Compute (SM) throughput 74.49%, Memory throughput 48.27%, achieved occupancy 33.10%." ; "The 306 MHz clock is far below what an unprofiled run reaches (about 1,080 GFLOP/s unprofiled vs about 406 here) [INFERRED arithmetic]." (accessed 2026-11-20; 2 x 2048^3 / 42.31 ms = 406 GFLOP/s `[derived]`)
- Use in dive: section 22, with the lesson attached: on a Jetson the GPU clock scales with load (tegrastats prints it, F08-40), so a profile must record the clock or pin it. The two machines also ran different matrix sizes (4096 and 2048), a second reason not to put the two durations in one chart.

**F08-73. The limits of this Tier 0 set, in one place: (1) single run, no variance; (2) one core, one thread, so nothing about scaling or shared-memory contention; (3) stand-ins: a humanoid, a dense MLP, an offscreen render of unknown GPU share; (4) generic top-down formula without the flush correction, slot count for the A78AE derived from the same counters; (5) level 1 only; (6) two machines with different software versions (MuJoCo 4.0.1 on the Spark, 3.17.0 on the Jetson, per the seed's status table); (7) no EC2 instance measured; (8) one GPU kernel per machine, not a workload.**
- Location: `experiments/README.md`, "How to cite these results"; `E-seed/pmu-cards/*.md`, "Gaps before this is a real card"
- Verdict: NEW
- Wave 2 (2026-11-20, SCOPE NARROWER): Two passes exist in the experiments folder (`results-pass1`, `results-pass2`), built from different versions of the benchmark. The three workload rows reproduce across them (throughput within 2.5%, every level-1 category within 0.5 points). The front-end against back-end split of the triad and memory-write microbenchmarks does not reproduce at the same throughput (for example Jetson `triad_mem` at 11.66 GB/s with 5.9% front end and 76.9% back end in pass 1, 11.71 GB/s with 78.1% and 7.9% in pass 2). Their throughput may be printed; their stall split may not.
- Evidence: `deep-dives/physical-ai/research/experiments/README.md` | Tier 0 (method notes) | our measurement (limits) | "The three workloads are CPU stand-ins: a MuJoCo humanoid model (not the SO-101), a 6x1024 MLP (not ACT or a VLA), MuJoCo offscreen rendering at 640x480 (whether the GPU took part was not established)." ; "One follow-up experiment is recorded only in the seed handoff note, without raw files ... Until its raw output lands here it is an UNKNOWN for the dive, not Tier 0." (accessed 2026-11-20; item 6 comes from seed 11's software status table, which is not in the experiments folder)
- Use in dive: section 22, the limits box; every chart caption says "one run".

**F08-74. [our reading] What Tier 0 the dive still needs, per phase of the arm story, for the separate profiling project. Each row is one PMU card: a unit of work, a machine list, and the counters to capture. CPU counters everywhere: the six slot events plus STALL_FRONTEND_FLUSH (the correction, F08-19), and the level-2 stall events of F08-24 where the core has them. GPU counters: DCGM or tegrastats at 1 Hz for SM, tensor, DRAM, encoder and decoder activity and power; Nsight Compute on the two or three hottest kernels.**
- Location: synthesis of seed 11's eight phases with F08-19, F08-24, F08-30 to F08-40, F08-73
- Verdict: NEW
- Evidence: this register | synthesis | n/a | Arm X925 formula: "(STALL_SLOT_FRONTEND / (10 * CPU_CYCLES) - STALL_FRONTEND_FLUSH / CPU_CYCLES) * 100" (F08-19); "Not all instance sizes support PMU event collection." (F08-25) (accessed 2026-11-20)
- Use in dive: section 22 (what is measured and what is still owed), and the hand-off to the profiling project.

| Phase (seed 11) | Workload | Machines | Unit of work | Counters to capture |
|---|---|---|---|---|
| 1 Collect | LeRobot record: two 640x480 cameras at 30 fps, SVT-AV1 software encode, with and without streaming encoding (F05-35, F05-44) | Jetson Orin Nano, DGX Spark, a laptop-class x86 | camera-seconds encoded per second; control-loop period held (F01-35) | CPU top-down on the encoder threads and on the control thread; cores busy; watts (tegrastats VDD_IN); on the Spark, NVENC utilisation when the hardware H.264 or AV1 encoder is used |
| 2 Process and curate | decode AV1 (dav1d, torchcodec) and embed frames (a ViT-L video encoder) | Spark; c9g and c8g (decode); g6, g6e, g7 (decode engine plus embed) | frames decoded per second per core; clips embedded per second | CPU top-down with flush correction, memory stall; nvidia-smi decoder utilisation; DCGM tensor activity; `ncu` on the embedder's attention kernel |
| 3 Augment | LeRobot image transforms in the dataloader on CPU and on GPU (F05-58, F05-59) | Spark; g6e.xlarge against g6e.16xlarge (4 against 64 vCPUs per GPU) | samples per second delivered to the GPU | CPU top-down on a worker; SM activity while waiting for data; Nsight Systems timeline for the gap between batches |
| 4 Simulate | SO-101 MuJoCo step (CPU); MuJoCo Warp or Playground SO-101 pick-cube with 64x64 camera (F04-57, F04-58); Isaac Lab 3.0 with OVRTX (F06-50) | Jetson (CPU only), Spark, c9g, g6e, g7e, and one P size for the Warp renderer | environment steps per second; frames rendered per second | CPU top-down, level 2 core versus memory; SM activity, DRAM activity, GPU memory used per environment; whether any counter moves when ray-tracing cores are used (U08-4) |
| 5 Train the policy | ACT then SmolVLA fine-tune on about 50 episodes (F01-90) | Spark; g6, g6e, g7e; one P5 or P6 size | training samples per second; time to 100,000 steps | DCGM tensor and SM activity, GPU memory; dataloader CPU top-down; data-wait share from Nsight Systems; EBS or NVMe read throughput |
| 6 Train the world model | LeWorldModel on the same episodes (F03-119: "a single GPU in a few hours") | Spark; g6e, g7e | training samples per second | same as phase 5; `ncu` roofline on the predictor |
| 7 Evaluate | closed-loop rollouts in simulation with the policy on the GPU | Spark; g6e Spot shards | episodes per hour | split of wall time between physics (CPU or GPU), render and policy; SM activity; CPU top-down on the physics thread |
| 8 Export and deploy | TensorRT engine build, then ACT or SmolVLA inference at 30 Hz | Jetson Orin Nano, Spark, AGX Thor if available | actions per second; p50 and p99 latency per call; watts | tegrastats GR3D_FREQ with clock, EMC_FREQ, rails; `ncu` on the engine's hottest layers; CPU top-down on pre- and post-processing |

### H. The map: fifteen workloads and the part each one loads (section 20)

**F08-75. [our reading] Selection rule for the fifteen. Take the eight phases of the one-arm story (collect, process and curate, augment, simulate, train the policy, train the world model, evaluate, export and deploy) and split a phase wherever two steps in it load different parts of the machine. That gives twelve workloads a reader can run for one SO-101 on a desk machine or one EC2 instance. Add the three that the arm's owner consumes as finished checkpoints or services and that are known only from published vendor numbers: generative augmentation with a pixel world model, pretraining of a robot foundation model, pretraining of a world model.**
- Location: seed 11 (the eight phases) and seed 08 sections 1.1 to 1.6 (rows D1 to X8), regrouped
- Verdict: NEW (the seed counted "about fifteen" across six stages and more than thirty rows; it did not fix a list)
- Evidence: seed 11, table "Phases", and seed 08, section 1 | seed synthesis, not a source | definition | seed 11: "One task (the SO-101 arm picks up a block and places it in a cup), followed through every phase of the loop. Each phase is a different workload, each lands on a different machine" (read 2026-11-20)
- Use in dive: section 20, the sentence that says where the number fifteen comes from. Left out on purpose, and why: fleet-scale ingest, fleet rollout and agent orchestration (seed rows D1, X5 to X7, A1 to A4) load the control plane, storage and people more than a part of one machine, and sections 18 and 19 carry them; on-robot online RL (seed T7) repeats workloads 8 and 12 on one box.

**F08-76. [our reading] The workload table. "Part loaded" names the part that saturates first according to the cited evidence; "why" is the mechanism. Rows 13 to 15 are vendor scale, from published numbers only. Evidence IDs point to the register that holds the pinned source.**
- Location: synthesis; table below
- Verdict: NEW
- Evidence: entries named in the table | synthesis over the other registers' Tier 1 to Tier 3 sources and this register's Tier 0 | definition | Tier 0 anchors quoted in section G, for example "| Spark X925 | 57240 steps/s | 12.2% | 36.5% | 45.7% | 5.6% | 0.4% | 4.37 |" (F08-61) (accessed 2026-11-20)
- Use in dive: section 20, the central table and its diagram (fifteen rows, nine part columns, one filled cell per row for "saturates first").

| # | Workload (phase) | What it is | Part loaded first | Why (mechanism) | Evidence | Seed row |
|---|---|---|---|---|---|---|
| 1 | Record and encode (1 Collect) | Read joints and two cameras at 30 Hz, write frames, compress to AV1 video | CPU cores next to the robot (back end, vector code); USB for capture | LeRobot's default encoder is a software AV1 encoder; no NVIDIA part hardware-encodes AV1 through LeRobot's list, and the Orin Nano has no hardware encoder at all | F05-35, F05-42, F05-44, F05-57, F05-105, F01-35, F01-86 | D1, X7 |
| 2 | Decode and filter (2 Curate) | Turn video back into frames, drop bad episodes, resize, compute statistics | CPU cores, or the GPU's separate decode engines (NVDEC) where the card decodes that codec | Decoding is entropy decoding and prediction: branchy integer code on a CPU, or a fixed-function engine that is not the tensor cores | F05-67, F05-71, F05-77, F05-106, F08-31 | D2, D3 |
| 3 | Embed and deduplicate (2 Curate) | Run a vision encoder over clips, cluster the embeddings, drop near-duplicates | GPU tensor cores; small models share a card | A vision transformer is matrix multiplies; the reference pipeline gives each model 0.25 of a GPU, and a starved input path left 32 H100s at about 17% | F05-71, F05-72, F05-73, F05-76, F05-106 | D3 |
| 4 | Dataloader decode and augment (3 Augment, and inside 8) | Per training sample: seek and decode a few frames, apply image transforms | CPU cores per GPU | Random access into video and per-sample transforms run in Python worker processes; the instance fixes the CPU budget at 24 vCPUs (12 cores) per GPU on most eight-GPU sizes | F05-39, F05-58, F05-59, F05-60, F05-62, F05-107, F08-57 | D4 |
| 5 | CPU physics step (4 Simulate) | One `mj_step`: kinematics, collision detection, constraint solve, integration | CPU back end, core-bound, with a front-end share; one world per core | 26 stages of scalar and small-matrix code with data-dependent branches in collision; little memory traffic at this model size | F06-9, F06-12, F06-14, F06-99; Tier 0: F08-61 | S1 |
| 6 | GPU-parallel physics (4 Simulate; RL rollouts; state-only demo multiplication) | Thousands of copies of the arm stepped together on one GPU | General GPU compute (not tensor cores `[our reading]`, F08-42), plus a single CPU core feeding it | Same arithmetic as row 5 batched over worlds; tens to hundreds of KB of GPU memory per world; throughput falls as contacts add branches | F06-16, F06-17, F06-20, F06-22, F06-47, F06-100, F04-54, F05-90 | S1 |
| 7 | Simulated cameras (4 Simulate; camera demo multiplication) | Render what each simulated camera sees, every step | GPU memory capacity first, then the rendering path: RT cores for RTX renderers, general compute for the Warp ray tracer | One small camera per environment costs megabytes, not kilobytes: 8,192 environments use about 57 to 64 GB; adding the camera cut training throughput by a factor of about 2 to 7 | F06-24, F06-48, F06-49, F06-50, F06-52, F06-62, F06-63, F06-101, F06-102, F04-55, F05-90 | S2 |
| 8 | Policy fine-tune (5 Train) | ACT from scratch or SmolVLA from its base checkpoint on about 50 episodes | GPU tensor cores, with GPU memory as the gate (2 to 6 GB for ACT, 10 to 16 GB for SmolVLA, 24 to 40 GB for pi0-class) | Transformer forward and backward passes; data loading was 0.011 to 0.015 s of a 0.167 to 2.548 s step in LeRobot's own timing, unless row 4 starves it | F01-90, F01-91, F02-63, F02-42, F02-54, F05-58 | T4 |
| 9 | World-model training (6 Train) | Learn to predict the next latent from frames and actions (LeWorldModel, about 15M parameters) | GPU tensor cores, lightly; the same data path as row 8 | A small encoder and predictor: "a single GPU in a few hours" | F03-117, F03-119, F03-37 | S3 class |
| 10 | Closed-loop evaluation (7 Evaluate) | Run each checkpoint in simulation for many episodes and count successes | A mix, per shard: physics (row 5 or 6), cameras (row 7), policy inference (row 12) | Each episode is independent, so the job is many small copies; the published harness numbers are for physics only, without rendering or a policy | F06-93, F06-94, F06-95, F06-97 | E1 |
| 11 | Engine build (8 Deploy) | Export to ONNX, compile a TensorRT engine on the target device, check outputs | The target device's own GPU and CPU for minutes | Engines are built per device; the documented build takes about 2 to 5 minutes | F07-7, F07-8, F07-54 | X4 |
| 12 | On-robot inference (8 Deploy) | One policy call per chunk, inside a 33.3 ms control period at 30 Hz | GPU tensor cores on a machine whose CPU and GPU share one memory; memory bandwidth is the shared part | A 3B-parameter policy takes 149.0 ms on a Jetson Orin and 76.8 ms on AGX Thor with TensorRT; our CPU stand-in hit the Jetson core's memory bandwidth at 9.8 GB/s | F07-1, F07-4, F07-5, F07-23, F01-74; Tier 0: F08-62, F08-63 | X1 |
| 13 | Generative augmentation (vendor scale) | A pixel world model re-renders or invents video clips | GPU memory capacity (tens of GB) and tensor cores, for minutes per clip | Diffusion over video tokens: 65.4 GB for one older model; 71 to 149 s per 480p clip on a B200 or H100 for the current one | F05-97, F05-98, F05-99, F05-103, F05-108 | S3 |
| 14 | Robot foundation-model pretraining (vendor scale) | Train the base VLA that row 8 starts from | Tensor cores across many nodes, the training network fabric between them, and storage feeding them | Tens of thousands of GPU-hours on up to 1,024 GPUs; synchronous gradient exchange needs the low-latency fabric | F02-34, F02-37, F02-35, F08-48, F08-49 | T2 |
| 15 | World-model pretraining (vendor scale) | Train the pixel or latent world model that rows 9 and 13 start from | Same as row 14, at larger scale | 1,024 GB200 GPUs for one current model; 16 to 256 data-centre GPUs for the JEPA line | F03-119, F03-120 | T1 |

**F08-77. [our reading] Three rows in that table are the same physical cause seen from three sides: the CPU beside the GPU. Row 1 (software encode on the robot's computer), row 2 (software decode where the GPU cannot decode the codec) and row 4 (decode and augmentation in the dataloader) all come from one fact: LeRobot's default video is AV1 produced and consumed by CPU code, and the GPUs most used for training either cannot decode it (A100, H100) or have no row in NVIDIA's matrix (H200).**
- Location: synthesis of F05-35, F05-39, F05-46, F05-47, F05-49, F05-67 and F08-44
- Verdict: NEW
- Evidence: entries listed in Location; this register re-read NVIDIA's matrix today for the H200 (F08-44) | Tier 1 sources in register 05 | documentation of support | from the matrix as parsed today, decode header and row: "AV1 | 8 Bit | 10 Bit" ... "NVIDIA RTX PRO 4500 Blackwell Server Edition | Blackwell | 6th Gen | 1 | 3 | 3 | YES ..." ; no "H200" string in the page (accessed 2026-11-20)
- Use in dive: section 20, the strongest single pattern in the map: on this arm's pipeline the first part to saturate is often a CPU core, on machines bought for their GPU.

### I. The five shapes (section 20)

**F08-78. [our reading] Five shapes, defined by three properties of a job and nothing else: how long one unit runs (duration), whether its parts must exchange data while running (coupling), and whether it can be stopped and resumed without losing more than one unit (interruptibility). A: short independent units, interruptible (rows 2, 3, 5, 6, 7, 10, 11, 13). B: one node for hours, interruptible at checkpoints (rows 8, 9). C: many nodes exchanging gradients for days, not interruptible without losing the whole step (rows 14, 15). D: always on and steady, interruptible per item (row 4 when run as a standing preprocessing tier; continuous decode of incoming video). E: tied to the robot's clock, not interruptible (rows 1, 12).**
- Location: synthesis; seed 08 section 2 names five shapes A to E with the same letters, grouped by AWS purchasing pattern
- Verdict: NEW (the grouping rule is restated; the letters are kept so the seed's rows map across)
- Evidence: seed 08, section 2, table "The five shapes and the five patterns" | seed synthesis, not a source | definition | seed: "A. Fan-out of short GPU units (seconds to hours, independent, checkpointable)" ; "C. Tightly coupled multi-node (days to months)" ; "E. Edge and near-edge" (read 2026-11-20)
- Use in dive: section 20, second half: the shape decides how the machine is bought and scheduled (sections 24 and 25), the part decides which machine. Two axes, kept separate.

**F08-79. [our reading] Each property maps to one machine part or one constraint the reader has already met. Coupling is the training fabric: a shape C job needs the EFA device and its absence on small sizes (F08-48, F08-49) is why shape A jobs run on single-GPU instances without penalty. Interruptibility is storage: what a job loses on a stop is what it has not yet written, so shape B is defined by its checkpoint interval. Duration against the robot's clock is latency: shape E has a deadline per unit (33.3 ms at 30 Hz, F01-28) where every other shape has only a throughput.**
- Location: synthesis of F08-48, F08-49, F01-28, F07-23
- Verdict: NEW
- Evidence: entries listed in Location | Tier 1 docs (EFA) and register 01 and 07 sources | definition | "It enhances the performance of inter-instance communication that is critical for scaling AI/ML and HPC applications." (F08-48) (accessed 2026-11-20)
- Use in dive: section 20, the bridge from shapes to parts; section 23, why shape E is measured in latency percentiles and the others in units per dollar.

**F08-80. [our reading] One workload can change shape with scale while loading the same part. Decode for one arm's 50 episodes is a few minutes on a laptop (shape A, a single unit); the same code at a company ingesting video continuously is a standing CPU tier (shape D). Physics for evaluation is shape A; the same physics inside a multi-node RL run that synchronises a policy across nodes moves toward B or C. The part (CPU cores, general GPU compute) does not change; the purchasing pattern does.**
- Location: synthesis; scale figures from F05-76 (32 H100s input-bound) and F06-65 (8 GPUs, 16,384 environments)
- Verdict: NEW
- Evidence: F05-76, F06-65 | sources pinned in registers 05 and 06 | definition | F06-65 header as recorded there: "With eight GPUs and 16384 environments, the DextrAH teacher task reaches over 900,000 frames per second in training" (accessed 2026-11-20 by register 06)
- Use in dive: section 20, a short caution after the shapes table so the reader does not treat shape as a property of the code.

### J. Price-performance and latency: the method (section 23)

**F08-81. [our reading] The unit of work per workload. Row 1: camera-seconds encoded per second (real time is 1.0 per camera). Rows 2 and 4: frames decoded per second. Row 3: clips embedded per second. Rows 5 and 6: environment steps per second. Row 7: frames rendered per second at a stated resolution. Rows 8 and 9: training samples per second, and wall time to a fixed step count. Row 10: episodes evaluated per hour. Row 11: minutes per engine. Row 12: actions (or chunks) per second with p50 and p99 latency per call. Rows 13 to 15: clips per GPU-hour and GPU-hours per run, from published figures.**
- Location: synthesis; seed 10 section "Price-performance and latency" states the method in one paragraph
- Verdict: NEW
- Evidence: seed 10 | seed synthesis, not a source | definition | seed 10: "Per workload, one unit of work (sim steps, clips embedded, training samples, actions). Price-performance = units per second divided by On-Demand dollars per hour. Latency = p50 and p99 per unit for rows 5 (planning) and 6 (inference). Edge machines have no hourly price; show watts per unit and purchase price instead." (read 2026-11-20)
- Use in dive: section 23, first table. A unit must be something the next stage consumes; "GPU utilisation" is not one (F08-30).

**F08-82. [derived, method] Cloud: units per dollar = units per second x 3,600 / price per hour. The price must be a dated first-party figure for a named Region and purchase option; none is recorded in this register (F08-59), so the dive can print the formula and the throughput column and must leave the dollar column empty or marked.**
- Location: method
- Verdict: NEW (method); UNKNOWN for every dollar value (U08-6)
- Evidence: n/a | method | arithmetic | illustration with an invented price, labelled as such: a job at 1,000 units per second on an instance at an invented 2.00 dollars per hour gives 1,000 x 3,600 / 2.00 = 1,800,000 units per dollar (the price is a toy number, not AWS's) (2026-11-20)
- Use in dive: section 23. Two corrections the method needs `[our reading]`: divide by the whole instance price even when the job uses one part of it (a decode job on a GPU instance pays for an idle GPU), and for shape A jobs on Spot count the units lost to interruptions.

**F08-83. [derived, method] Edge: units per joule = units per second / watts, and purchase price per unit of rate = price / units per second. First-party inputs exist in register 07: Jetson Orin Nano Super 7 W to 25 W and 399 dollars for the developer kit (F07-36, F07-42); AGX Thor T5000 40 W to 130 W (F07-39); DGX Spark 240 W supply with a 140 W chip budget, price not on an NVIDIA page (F07-47, F07-48). Our own readings: Jetson board idle about 4.8 W; Spark GPU idle 10 W.**
- Location: method; `E-seed/pmu-cards/jetson-orin-nano.md` "Identity"; `E-seed/pmu-cards/dgx-spark.md` "GPU profiling layers"
- Verdict: NEW
- Evidence: `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/pmu-cards/jetson-orin-nano.md` | Tier 0, single reading | our measurement | "Power mode: MAXN_SUPER. Idle board power about 4.8 W (tegrastats VDD_IN)." ; Spark card: "`nvidia-smi` returns utilization, power (10 W idle), temperature, graphics clock (2392 MHz)." (accessed 2026-11-20)
- Use in dive: section 23. No Tier 0 run recorded power under load, so no units-per-joule figure of ours exists yet. A bound is possible from the vendor's ceiling, and only a bound `[derived]`: the Jetson's policy stand-in at 390 inferences per second, drawing at most the module's 25 W, is at least 390 / 25 = 15.6 inferences per joule; the true figure is higher because one core of six was busy and the GPU idle.

**F08-84. Latency is reported per call as p50 and p99 and compared with the control period, not averaged into a throughput. Published first-party figures give medians only (GR00T N1.7: "median of 60 timed calls", F07-3); our Tier 0 stand-in gives a mean only: 1 / 390 per second = 2.56 ms per inference on the Jetson core, 0.51 ms on the X925 `[derived]`. No p99 exists in either.**
- Location: `E-seed/report.md` section 3 (throughputs); register 07 entries F07-1, F07-3, F07-5
- Verdict: NEW
- Evidence: `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/report.md` | Tier 0, single run | our measurement, arithmetic | "| Jetson A78AE | 390 infer/s |" and "| Spark X925 | 1968 infer/s |" ; 1,000 / 390 = 2.56 ms, 1,000 / 1,968 = 0.51 ms (accessed 2026-11-20)
- Use in dive: section 23, the latency half: at 30 Hz the period is 33.3 ms, a 149.0 ms call on a Jetson Orin is 4.5 periods (F07-5), and the tail (p99) is what decides whether an action chunk runs out (F07-22). The p99 is a named gap for Tier 0 phase 8 (F08-74 table).

**F08-85. [our reading] Price-performance has to be computed per part, because the cheapest machine for a workload is the one whose saturated part is the one being paid for. Three consequences the evidence supports: decode and CPU physics belong on CPU instances or on the GPU instance with the most cores per GPU (G7: 24 physical cores per GPU, F08-57); RTX camera rendering can only be priced on G families (F06-60, F08-58); training on P5 with AV1 video pays for CPU decode on a 12-core-per-GPU budget (F05-67, F08-57).**
- Location: synthesis of F08-57, F08-58, F05-67, F06-60
- Verdict: NEW
- Wave 2 (2026-11-20, WRONG (G7 superlative)): Same correction as F08-58: G7's 24 physical cores per GPU is the most among eight-GPU x86 sizes, not among all GPU instances; P6e-GB200 has 36 Grace cores per GPU and G5g has 32 Graviton2 cores per GPU.
- Evidence: entries listed in Location | Tier 1 and Tier 2 sources pinned there | definition | docs rows: "g7.48xlarge | 768.00 | Intel Xeon Granite Rapids | 192 | 192 | 1 | 8 x NVIDIA RTX PRO 4500 GPU" and "p5.48xlarge | 2048.00 | AMD EPYC 7R13 | 192 | 96 | 2 | 8 x NVIDIA H100 GPU" (accessed 2026-11-20)
- Use in dive: section 23, the closing guidance: choose the instance by the part the workload saturates, then compute units per dollar on that instance, then check the latency tail if the shape is E.

### Wave 2 addition (2026-11-20)

**F08-86. Since 19 November 2026 EC2 Detailed Monitoring can publish one-minute GPU metrics, with no agent inside the instance. Which GPU fields it publishes was not read.**
- Location: AWS What's New, 19 November 2026.
- Verdict: NEW (added in wave 2; source fetched by the refuter, `wave2-C.md` register 08 row 17)
- Evidence: https://aws.amazon.com/about-aws/whats-new/2026/11/ec2-performance-status-checks/ | Tier 1, first-party announcement | documentation of support | "Amazon EC2 launches performance status checks and new utilization metrics for EC2 Detailed Monitoring ... without setup within the instance ... support for OpenTelemetry metrics, one-minute GPU metrics that help teams tune accelerated workloads, and a new, higher resolution 10-second CPU utilization metric" (accessed 2026-11-20)
- Use in dive: section 21, the cheapest GPU signal on EC2. Fetch the EC2 User Guide page before naming any metric field.

## 5. Teaching material

### 5.1 Section 20, "Fifteen Workloads, Five Shapes"

**The plain-words idea.** A computer is several machines sharing a box. The processor has a part that fetches and decodes instructions and a part that executes them; memory has a rate at which it can stream data and a separate delay for fetching one item; a GPU has units for matrix arithmetic, units for general arithmetic, units for tracing rays, and fixed-function engines that only compress or decompress video; storage and network have their own rates. A workload fills one of these first, and once that part is full, the others sit partly idle while the job goes no faster. Naming the part that fills first is what tells you which machine to choose (F08-50, F08-76).

**Worked example on the arm (real figures, arithmetic redoable).**
- Collection. Two cameras at 640x480, 30 frames per second, 3 bytes per pixel: 640 x 480 x 3 = 921,600 bytes per frame; x 30 x 2 = 55,296,000 bytes per second = 55.3 MB/s raw (F01-86). LeRobot's default of 50 episodes of 60 s (F05-2) is 3,000 s, so 55.3 x 3,000 = 165.9 GB of raw pixels pass through the host `[derived]`. The part that must keep up is the CPU running the AV1 encoder (F05-35); storage is not close to a limit, since 55.3 MB/s is under half of the 125 MB/s EBS baseline of the smallest G6 size (F08-46).
- Training. LeRobot's own timing on 4 x H100 at batch 32: 0.167 s per update for Diffusion Policy (F01-91), so 32 / 0.167 = 192 samples per second `[derived]`. One dataset item costs about 5 ms to fetch and decode in one process (F05-62, hardware not stated), so 192 x 0.005 s = 0.96 seconds of decode work per second: about one CPU core busy feeding four GPUs `[derived]`. Here the GPUs are the full part. Turn on per-sample image augmentation in the workers and the balance tips: LeRobot states "the GPU ends up waiting for data" (F05-58).
- Simulation. One X925 core stepped a humanoid 57,240 times per second in our single run (F08-61). The arm's control rate is 30 Hz and MuJoCo's default timestep is 2 ms (F06-10), so one simulated second is 500 steps; the PPO recipe for the SO-101 collects 197 million control steps (F04-58). Illustration with a toy assumption, labelled: if an SO-101 scene stepped as fast as the humanoid and each control step took one physics step, 197,000,000 / 57,240 = 3,442 core-seconds, about 57 minutes on one core. The published recipe instead runs 4,096 arms on one GPU (F04-58), which is the same arithmetic moved to general GPU compute (row 6).
- Inference. A 3B-parameter policy takes 149.0 ms per call on a Jetson Orin with TensorRT (F07-5): 149.0 / 33.3 = 4.5 control periods at 30 Hz. The part is the GPU's tensor cores on a machine where CPU and GPU share one memory.

**The mechanism.** For each workload, write down what it touches per unit of work and compare with what the part can deliver. Our policy stand-in is the cleanest case we own: six 1024x1024 float32 matrices are 25.2 MB, every inference reads all of them, and at 390 inferences per second that is 9.8 GB/s on a Jetson core whose measured streaming limit is 9.25 to 11.71 GB/s (F08-63). The counters agree from the other side: 63.9% of slots back-end bound, 62.3% of cycles stalled on memory (F08-62). Demand equals supply, and the stall counters name the part: that is a saturated part.

**What it costs in compute, and which part.** The table in F08-76 carries it per workload. The figures that anchor the section: CPU physics 14,507 to 57,240 steps per second per core, core-bound (F08-61, Tier 0, one run); GPU physics 2.51 to 25.2 million steps per second on one RTX 6000 Ada at under 1 GB (F06-20, F06-22); simulated cameras about 57 to 64 GB of GPU memory for 8,192 environments (F06-48); policy fine-tune 2 to 6 GB (ACT) to 24 to 40 GB (pi0-class) of GPU memory and 30 minutes to 8 hours on one GPU (F01-90); on-robot inference 35.6 to 149.0 ms per call for a 3B policy (F07-1, F07-4); vendor-scale pretraining about 50,000 H100 GPU-hours (F02-34) and 1,024 GB200 GPUs (F03-119). The instance table is F08-58; the CPU-per-GPU ratios are F08-57.

**The five shapes.** F08-78 to F08-80: duration, coupling, interruptibility. Teach them after the parts, as a second axis: the part chooses the machine, the shape chooses how it is bought and scheduled.

### 5.2 Section 21, "Reading a Machine: PMU Cards"

**The plain-words idea.** A processor core can start a fixed number of micro-operations in every clock cycle: 10 on the DGX Spark's big core, 5 on its small one, 8 on a Graviton4 core (F08-16). Each of those chances is a slot. Top-down analysis asks, for every slot, where it went, and there are only four answers: it did useful work (retiring); it did work that was thrown away after a wrong guess (bad speculation); it stayed empty because the front of the core had nothing ready (front-end bound); it stayed empty because the back of the core could not accept more (back-end bound) (F08-2, F08-3, F08-14). Four percentages that add to 100 tell you which half of the core, or which guess, is costing you. A PMU card is those four numbers plus the GPU's equivalents, for one workload on one machine.

**Worked example with our own counters: one MuJoCo step loop on the Cortex-X925** (Tier 0, one run; raw row `wl_sim` in `results-pass2/results-spark-x925.csv`, F08-61, F08-70).
- Counters: CPU_CYCLES 19,958,256,358; STALL_SLOT 97,275,014,000; STALL_SLOT_FRONTEND 24,352,200,609; STALL_SLOT_BACKEND 72,922,813,391; OP_SPEC 102,307,494,220; OP_RETIRED 91,123,888,968.
- Slots: 19,958,256,358 cycles x 10 slots per cycle = 199,582,563,580 slots.
- Front-end bound: 24,352,200,609 / 199,582,563,580 = 12.20%.
- Back-end bound: 72,922,813,391 / 199,582,563,580 = 36.54%.
- Slots that were not stalled: 1 - 97,275,014,000 / 199,582,563,580 = 1 - 0.48739 = 0.51261.
- Share of started micro-operations that retired: 91,123,888,968 / 102,307,494,220 = 0.89069.
- Retiring: 0.51261 x 0.89069 = 45.66%. Bad speculation: 0.51261 x (1 - 0.89069) = 5.60%.
- Check of the slot count: (97,275,014,000 + 102,307,494,220) / 19,958,256,358 = 10.000 (F08-68).
- Reading: just under half the slots do useful physics; the largest loss is the back end (36.5%), and the memory stall counter in the second run is 0.4% of cycles, so the back end is waiting on computation (dependent floating-point chains, limited execution ports), not on memory. Instructions per cycle from the second run: 87,008,530,550 / 19,922,115,591 = 4.37.
- The correction this example lacks: Arm's formula for this core subtracts STALL_FRONTEND_FLUSH / CPU_CYCLES from the front end and adds it to bad speculation (F08-19). That event was not recorded. With 0.91 mispredicted branches per thousand instructions on this row, the shift is small here (about 1.6 points by the borrowed-constant illustration in F08-23); it is large for branchy code.

**The mechanism.** Every vendor counts the same thing with different events. Intel: slots = pipeline width x core clocks, with width 4, 5, 6 or 8 by generation; from Ice Lake a fixed counter counts slots and a register holds the four ratios (F08-8, F08-10). AMD: 6 dispatch slots per cycle on Zen 4, 8 on Zen 5, plus a fifth bucket for slots lost to the sibling hardware thread (F08-11, F08-12). Arm: slots are counted at the rename stage; STALL_SLOT_FRONTEND and STALL_SLOT_BACKEND count empty slots by cause, OP_SPEC and OP_RETIRED count started and finished micro-operations, and each core's file adds a correction that moves flush-recovery time from the front end to bad speculation (F08-15, F08-17 to F08-19). Level 2 splits the back end into core-bound and memory-bound (F08-6, F08-24). The GPU has no single equivalent: `nvidia-smi` utilisation is only "was any kernel running" (F08-30); DCGM adds SM, tensor and memory activity (F08-32); Nsight Compute gives per-kernel throughput against the GPU's maximum and a roofline that separates the compute limit from the memory bandwidth limit (F08-34, F08-35). Video engines have their own utilisation fields (F08-31); ray-tracing cores have no counter that this research located (F08-36).

**What it costs.** `perf stat` counting six events adds no extra run of the workload; on our two machines it needed sudo on the Spark, where `perf_event_paranoid` is 4 (Tier 0 cards, F08-60). Its overhead was not measured. Nsight Compute replays the kernel once per group of metrics, so `full` is slow, and it needs root on a Jetson (F08-33, F08-37). On EC2 the cost is the instance size: full PMU access generally needs a size that owns a whole socket (c9g.12xlarge and up, c8g.24xlarge and up), and the GPU families have no bare-metal sizes (F08-25, F08-26, F08-28).

**A caution the section should print.** The four numbers describe the CPU thread that was measured. `perf` documentation: "The bottleneck is only the real bottleneck if the workload is actually bound by the CPU and not by something else." (F08-9). And the four adding to 100% is arithmetic, not validation (F08-69).

### 5.3 Sections 22 and 23

Section 22 uses section G as written; every figure carries "one run". Section 23 uses F08-81 to F08-85: units of work, units per dollar with the dollar column empty until a dated price is recorded, units per joule with vendor power ceilings as bounds only, and latency as p50 and p99 against the 33.3 ms control period.

## 6. Stale or wrong in the seed research

| Seed file | Seed claim | What the source says now | Entry |
|---|---|---|---|
| seed PMU card (DGX Spark) | The top-down formula is "simplified from Arm's top-down method; not yet checked line by line against Arm's telemetry spec" | Checked. It equals the generic Arm formula Linux perf ships. Arm's own X925 and A725 files subtract STALL_FRONTEND_FLUSH / CPU_CYCLES from front-end bound and add it to bad speculation; back end and retiring are identical | F08-19, F08-20, F08-22 |
| seed PMU card (DGX Spark) | "the four categories sum to about 100% on both core types, so the formula is self-consistent here" | The sum is 100% by construction: the two stall counters add to STALL_SLOT exactly in all 51 rows. It validates nothing | F08-69 |
| seed PMU card (Jetson) | slots = 6 for the Cortex-A78AE, "Check ... against Arm's documentation" still open | Arm's Telemetry Solution 2026.09 has no A78AE file. X925 = 10 and A725 = 5 are confirmed there | F08-16, U08-1 |
| seed 10 | "Whether virtualized P, G and Graviton sizes expose the PMU counters needed for top-down: not verified" | AWS publishes a table by family generation and size for Graviton and general-purpose x86; G and P families are not named in it and have almost no metal sizes | F08-25, F08-26, F08-28, U08-3 |
| seed workload rows | The Arm CPU families named are C8g and M8g (Graviton4 generation); Graviton5 is not named | Graviton5 (Neoverse V3) is generally available in M9g (2026-06-10), C9g (2026-06-30) and R9g (2026-08-31) | F08-56 |
| seed 08 row D4, seed 03 | "p5.48xlarge = 24 vCPU per GPU" | Correct, and it is 12 physical cores per GPU (2 threads per core). g7.48xlarge is the exception: 24 physical cores per GPU | F08-57 |
| seed PMU cards | Nsight Compute 2025.3.1 (Spark) and 2024.3.1 (Jetson); Nsight Systems 2025.3.2 and 2024.5.4 | Current: Nsight Compute 2026.4.0, with new GB10B metrics; Nsight Systems 2026.6.1. The Jetson's L4T R36.4.7 is two major releases behind Jetson Linux 39.2.2 (F07-44) | F08-33, F08-39, F08-40 |
| seed 03 section 1.1 | Prices: "g6e.4xlarge ~$1.86/h", p5.48xlarge "$55.04/hour" On-Demand | Not re-fetched; not carried | F08-59, U08-6 |
| seed 08 section 2 | Five shapes grouped by capacity market and orchestrator | Kept the letters; the grouping rule is restated as duration, coupling, interruptibility so that the shape is a property of the job, with the AWS pattern left to sections 24 and 25 | F08-78 |
| seed 08 section 1 | "about fifteen" workloads over more than thirty rows | Fixed list of fifteen with a stated rule | F08-75, F08-76 |

## 7. Mental models worth teaching

1. **A machine has parts that fill separately.** The part that fills first sets the speed, and the rest idle. Nine parts on the chip, plus storage and network (F08-50, F08-76).
2. **A slot is one chance per cycle to start one micro-operation, and it can go four places.** Retiring, bad speculation, front-end bound, back-end bound (F08-2, F08-3, F08-14).
3. **Demand against supply.** Bytes or operations a unit of work needs, times units per second, compared with what the part delivers: 25.2 MB x 390 per second = 9.8 GB/s against an 11.7 GB/s core (F08-63).
4. **"Memory-bound" is two things.** Streaming is limited by bandwidth (GB/s), chasing is limited by latency (ns per load); the Spark beats the Jetson by 3.8 times on one and 2.4 times on the other (F08-41, F08-66, F08-67).
5. **GPU utilisation means "a kernel was running".** It is not a measure of how full the GPU is. Use SM activity, tensor activity and memory activity, or a roofline (F08-30, F08-32, F08-35).
6. **One GPU is three or four machines.** Tensor cores, general compute, ray-tracing cores, and video engines are separate units, present or absent per model: a P5's H100 has no ray-tracing cores, no encoder and no AV1 decode; a G7's card has all of them (F08-36, F08-43, F08-44, F08-58).
7. **The CPU beside the GPU is a part you buy by accident.** 24 vCPUs per GPU is 12 cores on most eight-GPU sizes; decode, augmentation and physics all land there (F08-57, F08-77).
8. **The same counter name can hide different formulas.** "Front-end bound" on an Arm core has at least three definitions in current tools; say which one (F08-17 to F08-20).
9. **Shape and part are two axes.** Part chooses the machine; duration, coupling and interruptibility choose how it is bought (F08-78, F08-79).

## 8. Contradictions between sources

| Topic | Source A | Source B | Reading |
|---|---|---|---|
| Slots per cycle on Intel | VTune cookbook (version 2025.4): "there are four pipeline slots available" (F08-2) | Intel's own metrics file: pipeline width 4, 5, 6, 8 by generation (F08-8) | The cookbook text is older than the cores EC2 sells; use the metrics file |
| Arm front-end bound | Linux perf generic file: no correction (F08-20) | Arm's V1 and V2 files: minus 4 cycles (V1) or 1 cycle (V2) per mispredict; Arm's V3, X925, A725 files: minus measured flush cycles (F08-17 to F08-19) | Three formulas under one metric name. A card must state the formula and the tool version |
| What "top-down" means on Graviton | Arm: four slot-based categories (F08-14) | AWS Graviton guide: IPC, then stalled cycles per thousand cycles (F08-29) | Cycle-based is the fallback when slot events are unavailable; the two do not give the same percentages |
| GPU "utilisation" | nvidia-smi: time a kernel was executing (F08-30) | DCGM: SM activity, with "0.8 or greater is necessary, but not sufficient" (F08-32) | Different quantities; do not compare a figure from one tool with a figure from the other |
| GPU memory of an L4 or L40S | AWS product pages and NVIDIA: 24 GB, 48 GB (F06-58) | EC2 docs table: 22 GiB, 44 GiB (F08-45) | Units and usable memory; quote the docs figure with "GiB" |
| Ray-tracing cores on the G5's GPU | Seed 03 quotes the AWS G5 page: "80 ray tracing cores" per A10G (not re-fetched here) | NVIDIA's A10 page: 72 RT cores (F06-58) | Unresolved here; the A10G is an AWS variant of the A10 |
| Tier 0 memory bandwidth of a Spark core | "Mem read" kernel: 22.08 and 28.94 GB/s (report section 1) | Policy stand-in's implied traffic: 35.3 and 49.5 GB/s; triad: 43.95 and 44.38 GB/s (F08-63, F08-66) | The read kernel is limited by its own loop (82.9% front-end bound on the X925), not by memory; treat triad as the ceiling |
| Rubin on AWS | Search-result summary of the About Amazon page of 2026-08-26: mentions Rubin GPUs for 2027 to 2028 | The fetch of that page's body: the word "Rubin" not found (F08-55) | Unresolved; no instance family is named either way |

## 9. UNKNOWN register

| ID | Unknown | Where it arises | What would close it |
|---|---|---|---|
| U08-1 | Whether 6 slots per cycle is Arm's documented value for the Cortex-A78AE | F08-16, F08-68 | The Cortex-A78AE technical reference manual or a telemetry file for the core; neither was located (the Telemetry Solution at tag 2026.09 has none) |
| U08-2 | Which events make up the "reduced set" on smaller EC2 sizes, and whether STALL_SLOT, OP_SPEC and STALL_FRONTEND_FLUSH are in it | F08-26 | `perf list` on, for example, c9g.2xlarge and c9g.12xlarge (a Tier 0 check; not run, by the rules of this pass) |
| U08-3 | Which G and P instance sizes expose which CPU PMU events | F08-28 | An AWS statement, or `perf list` on g6e.xlarge, g6e.48xlarge, g7.48xlarge, p5.48xlarge |
| U08-4 | Whether any NVIDIA tool exposes ray-tracing core utilisation | F08-36 | Searched: Nsight Compute profiling guide 2026.4.0 (no "OptiX", "RT Core" only in a unit list), nvidia-smi utilisation fields, DCGM profiling fields, tegrastats. Not searched: Nsight Graphics, OptiX and Omniverse profilers |
| U08-5 (CLOSED by wave 2 as far as pages allow: Rubin GPUs announced for 2027 to 2028, no EC2 family named; see F08-55) | Whether a Rubin-based EC2 family exists or is announced, and its name | F08-55 | An AWS What's New post or a row in the EC2 specification table |
| U08-6 | Every price: On-Demand, Spot, Capacity Block, for every family in F08-58 | F08-59, F08-82 | A dated first-party price per Region: the EC2 pricing page read in a browser, or the public bulk price list file with its publication date |
| U08-7 | The `-funroll-loops` follow-up (X925 triad L1 from 39.6% to 1.6% front-end bound, 183 to 246 GB/s) | F08-66; `experiments/README.md` | The raw output of that run landing in the experiments folder |
| U08-8 | The exact inheritance rule for blank cells in Intel's TMA file, and therefore the pipeline width for Granite Rapids and Emerald Rapids | F08-8 | The file's README section on column inheritance, or the per-platform JSON under `GNR/` and `EMR/` in the same repository |
| U08-9 | The H200's video engines and AV1 decode support | F08-44, F05-49 | A row in NVIDIA's support matrix, or `nvidia-smi` decoder fields on a p5en instance |
| U08-10 | How much of the Tier 0 render workload ran on the GPU | F08-64 | Re-run with `MUJOCO_GL=osmesa` against `egl`, with tegrastats or nvidia-smi sampling |
| U08-11 | Launch dates of G4dn, G5, G5g, G6, G6e, P4d, P5, P5e, P5en, P6e-GB200 and the Graviton4 families (not re-fetched); P6-B200 and P6-B300 are known to the month from their What's New URL paths only | F08-58 | The What's New post for each |
| U08-12 | The body of Yasin's 2014 paper (not fetched) | F08-1 | The IEEE copy or the author's copy |
| U08-13 | Whether GPU physics (MuJoCo Warp, PhysX) uses the tensor pipeline at all | F08-42, F08-76 row 6 | Nsight Compute ComputeWorkloadAnalysis on one MuJoCo Warp step |
| U08-14 | vCPU, memory, network and GPU count per instance for P6e-GB300 | F08-54 | A row in the EC2 specification table |
| U08-15 | Whether the DGX Spark's kernel exposes STALL_FRONTEND_FLUSH and the level-2 stall events by name (the card counted 78 named events and did not list them) | F08-22, F08-24, F08-74 | `perf list` on the Spark, or the raw event code 0x8162 |
| U08-16 | Whether Jetson Linux r39.2.2's tegrastats page applies unchanged to the Orin Nano on L4T R36 | F08-40 | The r36.x copy of the same page |

## 10. Reading path for Carlos

1. `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/report.md`, section 3 (three small tables). Why: these are our own numbers; read them first so the method has something to bite on.
2. Intel VTune cookbook, "Top-down Microarchitecture Analysis Method" (https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/current/top-down-microarchitecture-analysis-method.html), the first third, up to the four-category diagram. Why: the clearest prose explanation of slots; ignore its "four slots" figure.
3. Arm's Neoverse V1 white paper, section 3.2 and Appendix C (PDF pages 15 to 17 and the metrics table near the end). Why: the Arm definition of a slot and the first appearance of the mispredict correction.
4. Arm Telemetry Solution, `data/pmu/cpu/specifications/cortex/cortex_x925_r0p0_pmu.json` at tag 2026.09: search for `"frontend_bound"` and `"STALL_FRONTEND_FLUSH"`. Why: the exact formulas for the DGX Spark's big core, the ones our results should be recomputed with.
5. Linux `tools/perf/pmu-events/arch/arm64/sbsa.json` at v7.3 (four metrics, twenty lines). Why: this is literally the formula our Tier 0 used; seeing it next to item 4 is the whole comparison.
6. AWS Graviton guide, `perfrunbook/debug_hw_perf.md`, the table under "How to Collect PMU counters". Why: tells you which EC2 size to rent before profiling.
7. NVIDIA `nvidia-smi` documentation, section "Utilization" (six short definitions). Why: one sentence changes how every GPU utilisation figure reads.
8. Nsight Compute Profiling Guide, sections "Streaming Multiprocessor" and "Roofline Charts". Why: the unit list (tensor cores, RT cores) and the GPU's compute-versus-memory picture.
9. EC2 "Specifications for accelerated computing instances" (https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html), the "Performance specifications" table, columns vCPUs, CPU cores, Threads per core. Why: the CPU beside each GPU, and the G7 exception.
10. This register, the tables under F08-58 (instances), F08-76 (workloads) and F08-74 (Tier 0 still owed). Why: the three tables sections 20, 22 and 25 are built from.

## 11. Source list by tier

### Tier 0 (our experiments, single run)

- `deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/`: `report.md`, `results-pass2/results-jetson-a78ae.csv`, `results-pass2/results-spark-a725.csv`, `results-pass2/results-spark-x925.csv`, `pmu-cards/dgx-spark.md`, `pmu-cards/jetson-orin-nano.md`, `run.sh`, `workloads.py`, `micro.c`, `humanoid.xml`; and `deep-dives/physical-ai/research/experiments/README.md`.

### Tier 1 (code and vendor files at a pinned ref, official docs)

- intel/perfmon at c6875bae4fe4322e88c6b265962901672bfa97c9: `TMA_Metrics-full.csv`, `README.md` (https://github.com/intel/perfmon/blob/c6875bae4fe4322e88c6b265962901672bfa97c9/TMA_Metrics-full.csv)
- torvalds/linux at tag v7.3, c03c1a14507dfaf8b856c2608f9ac216021fc222: `tools/perf/Documentation/perf-stat.txt`, `tools/perf/Documentation/topdown.txt`, `tools/perf/pmu-events/arch/x86/amdzen4/pipeline.json`, `amdzen5/pipeline.json`, `amdzen6/pipeline.json`, `tools/perf/pmu-events/arch/arm64/sbsa.json`, `arm64/arm/neoverse-v1/metrics.json`, `neoverse-n2-v2/metrics.json`, `neoverse-v3/metrics.json`, `tools/perf/arch/arm64/util/pmu.c`
- Arm Telemetry Solution at tag 2026.09, ea533b733b9bad52223d16e768b7dab03cabb830 (https://gitlab.arm.com/telemetry-solution/telemetry-solution): `RELEASE_NOTES.md`, `data/pmu/cpu/mapping.json`, `data/pmu/cpu/specifications/neoverse/neoverse_v1_r1p2_pmu.json`, `neoverse_v2_r0p0_pmu.json`, `neoverse_v3_r0p0_pmu.json`, `neoverse_n1_r4p1_pmu.json`, `data/pmu/cpu/specifications/cortex/cortex_x925_r0p0_pmu.json`, `cortex_a725_r0p0_pmu.json`
- aws/aws-graviton-getting-started at 541d1ad524bb1630e16b8e66aef36dcd01a3bbc1: `perfrunbook/debug_hw_perf.md`, `README.md`
- Intel VTune Profiler cookbook, Top-down Microarchitecture Analysis Method: https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/current/top-down-microarchitecture-analysis-method.html
- EC2 instance type specifications: https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html , https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html , https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html
- EC2 User Guide, Elastic Fabric Adapter: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html
- FSx for Lustre performance: https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html
- NVIDIA nvidia-smi documentation: https://docs.nvidia.com/deploy/nvidia-smi/index.html
- NVIDIA DCGM User Guide, Feature Overview: https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/feature-overview.html (newest repository tag v4.7.0, 9fae2867e6e5264fa0fca22a07dc898d591baa21)
- NVIDIA Nsight Compute 2026.4.0 Profiling Guide and Release Notes: https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html , https://docs.nvidia.com/nsight-compute/ReleaseNotes/index.html
- NVIDIA Nsight Systems 2026.6 Release Notes: https://docs.nvidia.com/nsight-systems/ReleaseNotes/index.html
- NVIDIA Jetson Linux Developer Guide r39.2.2, Tegrastats Utility: https://docs.nvidia.com/jetson/archives/r39.2.2/DeveloperGuide/AT/JetsonLinuxDevelopmentTools/TegrastatsUtility.html
- NVIDIA Video Encode and Decode Support Matrix: https://developer.nvidia.com/video-encode-decode-support-matrix

### Tier 2 (first-party announcements, product pages, white papers)

- Arm, "Arm Neoverse V1 Core: Performance Analysis Methodology" white paper: https://armkeil.blob.core.windows.net/developer/Files/pdf/white-paper/neoverse-v1-core-performance-analysis.pdf
- AWS What's New: G7 (2026-06-18) https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-ec2-g7-generally-available/ ; G7e (2026-01-20) https://aws.amazon.com/about-aws/whats-new/2026/01/amazon-g7e-instances-generally-available/ ; P6e-GB300 (2025-12-02) https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-p6e-gb300-ultraservers-nvidia-gb300-nvl72-generally-available ; M9g (2026-06-10) https://aws.amazon.com/about-aws/whats-new/2026/06/ec2-m9g-m9gd-instances-graviton5-processors-available/ ; C9g (2026-06-30) https://aws.amazon.com/about-aws/whats-new/2026/06/ec2-c9g-c9gd-instances-graviton5-processors-available/ ; R9g (2026-08-31) https://aws.amazon.com/about-aws/whats-new/2026/08/amazon-ec2-r9g-and-r9gd-memory-optimized-instances-are-now-available/
- AWS product pages: G7 https://aws.amazon.com/ec2/instance-types/g7/ ; M9g https://aws.amazon.com/ec2/instance-types/m9g/
- About Amazon, AWS and NVIDIA (2026-08-26): https://www.aboutamazon.com/news/aws/aws-nvidia-2-million-gpus-ai
- NVIDIA Tensor Cores product page: https://www.nvidia.com/en-us/data-center/tensor-cores/

### Tier 3 (papers)

- A. Yasin, "A Top-Down Method for Performance Analysis and Counters Architecture", ISPASS 2014, DOI 10.1109/ISPASS.2014.6844459. History; cited through Intel's repository README; body not fetched.

### Tier 4 (used only to locate primary sources; nothing cited as fact)

- Web searches restricted to aws.amazon.com, docs.aws.amazon.com and aboutamazon.com to locate the Graviton5, P6 and Rubin pages. Two search-result summaries are mentioned as unresolved leads (F08-55 and section 8) and are not used as evidence.
