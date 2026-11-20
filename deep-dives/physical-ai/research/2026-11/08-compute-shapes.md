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
- Use in dive: section 21, the event glossary. It also explains two things seen in Tier 0: front end plus back end stall slots equal STALL_SLOT exactly in every row (F08-@IDENT), and (STALL_SLOT + OP_SPEC) / CPU_CYCLES returns the slot count (F08-@SLOTS).

**F08-16. Slots per cycle in Arm's files: Neoverse V1 8, Neoverse V2 8, Neoverse V3 10, Cortex-X925 10, Cortex-A725 5 (Neoverse N1 5). The repository has no file for the Cortex-A78AE.**
- Location: `product_configuration.num_slots` in each file under `data/pmu/cpu/specifications/neoverse/` and `.../cortex/`; directory listing of both folders
- Verdict: NEW
- Evidence: https://gitlab.arm.com/telemetry-solution/telemetry-solution/-/tree/ea533b733b9bad52223d16e768b7dab03cabb830/data/pmu/cpu/specifications | Tier 1, vendor specification files at tag 2026.09 | definition | `neoverse_v1_r1p2_pmu.json`: "\"product_name\": \"Neoverse V1\" ... \"num_slots\": 8"; `neoverse_v2_r0p0_pmu.json`: "\"num_slots\": 8"; `neoverse_v3_r0p0_pmu.json`: "\"num_slots\": 10"; `cortex_x925_r0p0_pmu.json`: "\"product_name\": \"Cortex-X925\" ... \"num_slots\": 10"; `cortex_a725_r0p0_pmu.json`: "\"num_slots\": 5"; the `cortex` folder lists only `cortex_a725_r0p0_pmu.json` and `cortex_x925_r0p0_pmu.json` (accessed 2026-11-20)
- Use in dive: sections 21 and 22. Confirms the two DGX Spark values the Tier 0 run read from the kernel (10 and 5). The Jetson's value of 6 for the Cortex-A78AE has no Arm file to check against (UNKNOWN U08-1).

**F08-17. Arm's level-1 formulas for the Neoverse V1 (Graviton3's core, F08-@GRAV). Back end and retiring are the plain ratios. Front end is reduced, and bad speculation increased, by a branch-mispredict term: 4 cycles per mispredicted branch.**
- Location: `data/pmu/cpu/specifications/neoverse/neoverse_v1_r1p2_pmu.json`, object `metrics`; the same formulas are printed in the white paper's Appendix C
- Verdict: NEW
- Evidence: https://gitlab.arm.com/telemetry-solution/telemetry-solution/-/blob/ea533b733b9bad52223d16e768b7dab03cabb830/data/pmu/cpu/specifications/neoverse/neoverse_v1_r1p2_pmu.json | Tier 1, vendor specification file at tag 2026.09 | definition | frontend_bound: "100 * (STALL_SLOT_FRONTEND / (CPU_CYCLES * 8) - BR_MIS_PRED * 4 / CPU_CYCLES)"; backend_bound: "STALL_SLOT_BACKEND / (8 * CPU_CYCLES) * 100"; retiring: "(1 - STALL_SLOT / (CPU_CYCLES * 8)) * (OP_RETIRED / OP_SPEC) * 100"; bad_speculation: "100 * ((1 - OP_RETIRED / OP_SPEC) * (1 - STALL_SLOT / (CPU_CYCLES * 8)) + BR_MIS_PRED * 4 / CPU_CYCLES)" (accessed 2026-11-20)
- Use in dive: section 21, Arm formula box for Graviton3.

**F08-18. Arm's level-1 formulas for the Neoverse V2 (Graviton4's core, F08-@GRAV). Same shape, but the 4-cycle mispredict term is taken 1 cycle from the front end and 3 cycles from the back end.**
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
- Use in dive: section 21 (core-bound versus memory-bound is directly measurable on the Spark's cores), section 22 (the events the next Tier 0 pass should add, F08-@NEXT).

