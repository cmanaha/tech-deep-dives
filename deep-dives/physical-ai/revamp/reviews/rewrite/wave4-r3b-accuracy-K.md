# Accuracy review, wave 4 round 3, reviewer K: sections 21, 22, 23 and 2, and the pointers to held sections (confirming check)

Read from HEAD (7e6021e) with `git show`; diffs as given in the task (21: 43f3b41..ee3eb3c; 22: ee42ea2..14c520b;
23 and 2: c61ed95). No section or register file changed between those commits and HEAD (`git diff --stat` empty).
Rendered text from `/tmp/pai-rw/w4-r3b/` (matches HEAD). Registers: `research/2026-11/*.md` at HEAD. Earlier findings
from `/tmp/pai-rw/review/w4r2/accuracy-I.md` Part 2 (section 21) and `/tmp/pai-rw/review/w4r2b/accuracy-J.md` Parts 1
to 3 (sections 22, 23 and 2). Published texts of sections 20 and 24 to 29 from `git show add2a9f:...` (equal to
`/tmp/pai-text-before/`). Experiment files: `research/experiments/E-seed-profiling-2026-11-19/`.

## Part 1. Section 21, Reading a Machine (`PmuCards.tsx`)

### Earlier findings (accuracy-I Part 2, section 21): 4 of 4 resolved

| ID | Status | What the page says now |
|---|---|---|
| M21-R2-1 (SpeedOfLight read as a share of peak) | RESOLVED | "Each is the highest of the percentages its constituent counters report, so it says how close the busiest of them came to its limit and need not be a share of the chip's peak arithmetic rate or of its memory bandwidth." (F08-34) |
| M21-R2-2 (h2 overstated the wider core) | RESOLVED | h2 now "A wider core can do more work at a lower share". |
| M21-R2-3 (mispredicts and cycles from one execution) | RESOLVED | "with the mispredicts counted in a second execution of the program, gives 256,608,053 x 4 / 7,794,987,434 = 13.17 points". Recomputed: 13.168. |
| M21-R2-4 (root needed on the Spark unstated) | RESOLVED | "On a Jetson it must run as root; our pass on the DGX Spark needed root as well." |

### Changed sentences checked and holding

- "each core's clock, which the cards do not record": the two PMU cards (`pmu-cards/dgx-spark.md`,
  `jetson-orin-nano.md`) record GPU clocks only (SM 2.13 GHz and graphics 2392 MHz on the Spark, 306 MHz on the Jetson)
  and no CPU core clock; the CSVs carry no duration. Consistent with section 22's "The cards carry cycle counts and no
  clock rate". The arithmetic holds: 4.57 / 3.05 = 1.50, 57,240 / 28,662 = 2.00, 2.0 / 1.5 = 1.33 (F08-61).
- F08-87 citations (perf multiplexing): "can lose accuracy", "its count is scaled", "the share of the measurement each
  counter was running" are all in the entry; the page prints no per-core counter count, as the Use line requires. The
  "six" and "eight" events are our run script's (F08-60).
- F08-88 citation (PyTorch `set_float32_matmul_precision`, v2.15.0): default "highest" computes in float32; "high"
  permits TensorFloat32 "when a fast kernel for it is available"; 10 against 23 stored mantissa bits. All in the entry.
  See findings M21-R3-2 and M21-R3-6 for what the paragraph around it does with the entry.
- Branch microbenchmark: generic 37.65% front end and 11.91% bad speculation; c = 13.168 gives 24.48 and 25.08.
  Physics step: c = 1.598 gives 10.6 and 7.2. Mispredicts per cycle 0.0329 against 0.0040. Kept micro-ops per cycle
  4.566; IPC 4.367. All recomputed from F08-61 and F08-23.
- Memory stall 0.394% of cycles; 144.92 / 123.96 = 1.169 (F08-61, F08-70).
- "refilled its level-2 data cache 0.38 times per thousand instructions against the X925's 0.12" (F08-61).
- "Arm's level-2 metrics for the X925, A725 and Neoverse V3 split back-end stalls into core-bound and memory-bound,
  with data-cache stalls on the memory side" (F08-24).
- V1 fixed 4 cycles (F08-17); V2 1 front end and 3 back end, now in the expandable with "the uncorrected V2 error is
  our arithmetic" (F08-18); V3, X925, A725 measured `STALL_FRONTEND_FLUSH` (F08-19).
- AWS's next step, mispredicts per thousand instructions (F08-29); method history (F08-1, F08-11, F08-14); the
  single-runs statement (F08-73); the main-memory comparison (F08-66).
- Pointers to section 12 and section 23 hold.

### Findings

**M21-R3-1 (minor). F08-87 and F08-88 render with the wrong access date.**
- Sentence: h1 description "... before you pay for more of the wrong part (sources read 2026-11-20)", and the two
  citations render "(accessed 2026-11-20)".
- Evidence: F08-87 and F08-88 both say "(accessed 2026-11-25)"; they are the only register entries read after
  2026-11-20. `Cite.tsx` line 23 prints the single constant `ACCESSED = '2026-11-20'` for every source. The same applies
  to the two F08-87 and F08-88 citations in section 22 (not counted again there).
- Fix: h1 "(sources read 2026-11-20; perf multiplexing and PyTorch precision pages read 2026-11-25)", and give F08-87
  and F08-88 their own access date in the citation registry or the `Cite` component.

**M21-R3-2 (minor). The "not recorded" scope from F08-88's Use line was dropped.**
- Sentences: "Its default, "highest", computes in float32. "high" permits TensorFloat32 ... when a fast kernel for it
  is available. ... Record the setting on the card beside the kernel name".
- Evidence: F08-88 Use line: "The PyTorch version and the precision setting of our run were not recorded, so the page
  may say the documented default keeps a float32 multiply in float32 and that "high" permits TensorFloat32, but not
  which setting our run used." Round 2 carried "which precision or PyTorch setting would have sent it there is outside
  what the run recorded"; the rewrite removed it. Placed right after the simt kernel, the default reads as the
  setting our run used. Section 22 states the scope ("at a version and precision setting our run did not record").
- Fix: add after the F08-88 sentences "Our run recorded neither the PyTorch version nor this setting."

**M21-R3-3 (minor). The simt parenthesis makes SIMT mean the CUDA-core path.**
- Sentence: "The kernel's name, cutlass_80_simt_sgemm_128x128_8x4_nn_align1, carries simt (single instruction,
  multiple threads, the ordinary CUDA-core path), the general floating-point path".
- Evidence: no register entry defines SIMT. F08-71 gives "general floating-point path" as `[our reading]`; F08-42 says
  "ordinary CUDA code". SIMT is how every CUDA kernel's threads execute, tensor-core kernels included; the `simt` tag in
  CUTLASS kernel names marks the non-tensor-core operator class. The expansion as written equates the two.
- Fix: "carries simt, which in CUTLASS's kernel names marks the ordinary CUDA-core path rather than the tensor cores
  (SIMT: single instruction, multiple threads), the general floating-point path".

**M21-R3-4 (minor). The "each by c" error lost its per-core scope.**
- Sentence: "A card computed without c therefore reads front-end bound too high and bad speculation too low, each by
  c."
- Evidence: round 2 said "by c on the V1, V3, X925 and A725 ... On the V2, where Arm takes 1 of ...". On the Neoverse
  V2 the 4 cycles split 1 front end and 3 back end (F08-18, F08-22), so the uncorrected error there is not c on each
  of the two shares. The preceding paragraph and formula concern the V3, X925 and A725, which limits the harm, and the
  V2 case is in the expandable.
- Fix: "On these three cores and the Neoverse V1, a card computed without c reads front-end bound too high and bad
  speculation too low, each by c; the Neoverse V2 splits it between front end and back end (below)."

**M21-R3-5 (minor). The reason given for counting the level-2 events does not hold.**
- Sentence: "Where the core's file defines them, count STALL_FRONTEND_FLUSH and the level-2 events the same way, so
  that the card's front-end share carries Arm's own correction and its verdict on memory against core rests on a
  measurement rather than a count of whole cycles."
- Evidence: Arm's level-2 split is `backend_mem_bound: "STALL_BACKEND_MEMBOUND / STALL_BACKEND * 100"` (F08-24), a ratio
  of back-end stall cycle counts (F08-29 treats back-end stalls as cycles, `stall_backend_pkc`; the slot events are the
  `STALL_SLOT_*` family, F08-15). The level-2 verdict is therefore also built on counts of whole cycles. The same
  overreach sits in "A level-2 count would settle it", though that sentence is otherwise sourced (F08-24).
- Fix: "... and its verdict on memory against core comes from Arm's level-2 split of back-end stalls rather than from
  one memory event", and "A level-2 count would narrow it".

**M21-R3-6 (minor). "Nothing in the result" goes past the entry.**
- Sentence: "The output stays float32 either way, so nothing in the result shows which path ran."
- Evidence: F08-88 supports the dtype only ("The output dtype stays float32"). Whether the values differ detectably is
  not in the entry; TensorFloat32 rounding changes the values.
- Fix: "The output stays float32 either way, so the result's type does not show which path ran."

Claims checked: about 100 (every changed sentence, formula, chart label, caption and header in the round 3 diff, plus
the four earlier findings). Findings: 6 (0 errors, 6 minor).

## Part 2. Section 22, Measurements (`Measurements.tsx`)

### Earlier findings (accuracy-J Part 1, section 22): 7 of 7 resolved

| ID | Status | What the page says now |
|---|---|---|
| E22-R2-1 (ratios carried to any program) | RESOLVED | "Each ratio carries over only to a program that the same part limits on both machines. A program limited by the core as a whole gains its own ratio". |
| M22-R2-1 (refill counts unnamed) | RESOLVED | Names L1d 5.22 and L2 4.57 against 34.23 and 41.82; "refill counts" plural (F08-61, F08-62). |
| M22-R2-2 (flush share on the A78AE) | RESOLVED | "whether part of that share is recovery after a wrong prediction cannot be checked on this core". |
| M22-R2-3 (both signs claimed for both machines) | RESOLVED | "Where both signs hold on both machines ...; for this stand-in they hold on the Jetson only." |
| M22-R2-4 (render GPU share) | RESOLVED | "drives MuJoCo's renderer through EGL, and the GPU's share of the work was not established". |
| M22-R2-5 (multiplexing "loses accuracy") | RESOLVED | "can lose accuracy"; "count the six slot events in one execution" (F08-87). |
| M22-R2-6 (PyTorch setting unscoped) | RESOLVED | "at a version and precision setting our run did not record. In PyTorch v2.15.0 ..." (F08-88). |

### Changed sentences checked and holding

- Card data against F08-61, F08-62 and F08-64. Ratios recomputed: 6.52, 3.98, 1.01, 1.17, 3.95, 2.00, 5.05, 1.40,
  5.70, 1.27; 4.37 / 2.48 = 1.76; 3.95 / 1.76 = 2.24; 4.37 / 3.01 = 1.45; 2.0 / 1.45 = 1.38; 35.3 / 43.95 = 80%;
  9.81 / 11.71 = 84%; 273 / 102 = 2.68.
- "within 0.7 points": the register's reproducibility note gives retiring 0.69 as the largest spread.
- EC2 sizes (F08-25, F08-26, U08-2); 6.18 IPC (F08-65); 16,460 and 406; "an eighth of the work".
- The expandable's "a core for which neither the Jetson's Linux kernel nor Arm's files give a figure" (F08-16, F08-68).
- "The chains are scalar, so the figure leaves out the vector units and Arm's vector instructions, NEON and SVE":
  "leaves out" reads as "does not measure", which F08-65 supports ("does not measure vector (NEON or SVE) throughput").
- Noted, not flagged: "points at its execution units" sits beside section 21's statement that the execution units and
  caches are not yet told apart; it is hedged and unchanged since round 2.

### Findings

**E22-R3-1 (error). The A78AE width hedge is widened to a claim about every document.**
- Sentence: "A core's width is its slots per cycle: 6 on the Jetson's Cortex-A78AE (derived from its own counters, since
  no document gives it), and on the Spark, which carries two kinds of core, 10 on the wide Cortex-X925 and 5 on the
  narrow Cortex-A725."
- Evidence: U08-1 asks for "The Cortex-A78AE technical reference manual or a telemetry file for the core; neither was
  located". F08-16: "The repository has no file for the Cortex-A78AE." F08-68: "the Jetson's kernel reports 0". The
  research shows that two named sources lack it and that no other was located, not that no document gives it. The
  section's own expandable scopes it correctly ("neither the Jetson's Linux kernel nor Arm's files give a figure").
- Fix: "(derived from its own counters, since neither the Jetson's kernel nor Arm's files give it)".

**M22-R3-1 (minor). "Left idle" asserts a hardware fact no entry supports.**
- Sentence: "Scalar means one number per instruction, with the vector units, which work on several numbers at once,
  left idle."
- Evidence: F08-65 says only that the kernel "does not measure vector (NEON or SVE) throughput"; `micro.c` speaks of
  "up to 6 FP pipes". On these Arm cores scalar floating-point instructions issue to the same FP/ASIMD pipelines that
  run the vector instructions, so the units are not idle; one lane of each is used. Round 2 had "vector units unused";
  the rewrite kept and expanded the claim.
- Fix: "Scalar means one number per instruction, so the vector instructions, which work on several numbers at once,
  are not used."

Claims checked: about 90 (every changed sentence, table cell, chart label, caption and header in the round 3 diff,
plus the seven earlier findings). Findings: 2 (1 error, 1 minor). Section 21's M21-R3-1 (access date of F08-87 and
F08-88) also applies to this section's two citations of them.

## Part 3. Section 23, Price-Performance and Latency (`PricePerformance.tsx`), and section 2, Getting Started (`GettingStarted.tsx`)

### Earlier findings (accuracy-J Part 2, section 23): 6 of 6 resolved

| ID | Status | What the page says now |
|---|---|---|
| E23-R2-1 (3.8 as a floor) | RESOLVED | "The two cores' test figures differ 3.8 times, but neither single run is shown to be its core's ceiling, and the X925's demand already exceeds its own, so 3.8 neither caps nor explains the 5.0." |
| E23-R2-2 (24 to 125 W band) | RESOLVED | "so that line sits above 5.0 x 4.8 = 24 W, and at or below 5.0 x 25 = 125 W only if the Jetson board stays within its 25 W under load, which no reading shows." |
| M23-R2-1 (single runs in h1) | RESOLVED | h1 "(our measurements: single runs on two edge machines; vendor documentation read 2026-11-20)". |
| M23-R2-2 (P5 core count unscoped) | RESOLVED | "the 12 physical cores per GPU of its eight-GPU size" (F08-58). |
| M23-R2-3 (which bars pass the check) | RESOLVED | Caption "The two Spark bars of the physics and policy panels pass every like-for-like check (one machine, one software install); across machines the bar labels carry the MuJoCo version that fails the software check"; text "Across machines the policy pair meets the first two checks". The policy bars carry no MuJoCo version, which is consistent. |
| M23-R2-4 (two rates named for three options) | RESOLVED | "the rates to measure are the frames one CPU core decodes per second, the training samples per second on each instance, and, for the re-encode, its one-off cost". |

The "Superand" join is also fixed: `{JETSON}{' '}` added; the rendered text reads "Orin Nano Super and 1,968".

### Earlier finding (accuracy-J Part 3, section 2's chunk margin): resolved

| ID | Status | What the page says now |
|---|---|---|
| Section 2 chunk margin ("about nine times the call" as the margin) | RESOLVED | "Played one per tick they last 40 x 33.3 ms = 1.33 s. In an asynchronous mode the actions left when a chunk lands must cover the next call, so a call may take up to half the chunk, 667 ms, about 667 / 149.0 = 4.5 times the 149.0 ms median." F07-22 now cited. 667 / 149.0 = 4.48. The close reads "check that the chunk it returns lasts at least twice your slowest call (section 17, Running on the Robot)", which is the same rule. |

### Changed sentences checked and holding

- Section 23: every sentence in the c61ed95 diff (h1, the 5.0 ratio join, the 3.8 paragraph, the caption, the
  policy-pair sentence, the P5 cores, the decode rates, the watts line). Numbers unchanged: 1,968 / 390 = 5.0;
  5.0 x 4.8 = 24; 5.0 x 25 = 125. A slight tension remains between "so one run of that test is not its ceiling" and
  section 22's open question about weights read from DRAM; accepted in round 2 and not flagged.
- Section 2: the 149.0 ms median stays NVIDIA's (F01-74, in the preceding paragraph); 40 actions (F01-74); 33.3 ms
  (F01-28).

### Findings

**M2-R3-1 (minor). The half-chunk rule is stated for every asynchronous mode.**
- Sentence: "In an asynchronous mode the actions left when a chunk lands must cover the next call, so a call may take
  up to half the chunk, 667 ms, about 667 / 149.0 = 4.5 times the 149.0 ms median."
- Evidence: F07-22's quote is scoped: "For alignment and RTC, check usable playback after trimming, not the nominal
  chunk length." F07-27 lists a third join, append, which keeps the full slice and trims nothing, so the half-chunk
  bound is not what applies there. Aligned is the default ("the `auto` default"), so the sentence is right for the
  default mode.
- Fix: "In LeRobot's default asynchronous mode, which drops the actions a late chunk has already missed (and in RTC),
  the actions left when a chunk lands must cover the next call, so a call may take up to half the chunk, ..."

Claims checked: about 25 (the section 23 and section 2 sentences of c61ed95 and the seven earlier findings). Findings:
1 (0 errors, 1 minor), in section 2. Section 23: no new findings.

## Part 4. Pointers from sections 15 to 19 and 21 to 23 to section 20 and sections 24 to 29

Ruled against the published texts at add2a9f: 20 "Fifteen Workloads, Five Shapes"; 24 "Orchestrating Physical AI on
AWS"; 25 "AWS Batch"; 26 "AWS Parallel Computing Service"; 27 "Amazon SageMaker HyperPod"; 28 "Amazon EKS"; 29
"Choosing". Sections 17, 19, 21 and 22 at HEAD carry no pointer to these sections. Eight pointers found.

| # | Where | Pointer | Ruling |
|---|---|---|---|
| 1 | Section 15, Training at Scale (`TrainingScales.tsx`, closing paragraph) | "The width then sets the save interval and the market, which together make the job's shape (section 20, Fifteen Workloads, Five Shapes)" | Minor, P4-1 |
| 2 | Section 15, same paragraph | "Section 24, Orchestrating Physical AI on AWS, picks the scheduler for each." | Minor, P4-2 |
| 3 | Section 16, Evaluation (`Evaluation.tsx`) | "(section 24, Orchestrating Physical AI on AWS, runs one policy's evaluation that way)" | HOLDS: section 24's running example is "the evaluation of one policy ... 500 simulated episodes, each with its own random seed", run as a Batch array job on Spot, "one child per seed". |
| 4 | Section 18, The Fleet (`Fleet.tsx`) | "AWS's example recipe of that kind, printed in section 24, Orchestrating Physical AI on AWS, only lists buckets" | HOLDS: section 24 prints `com.example.ListS3Buckets`, "A component that uses the token exchange service to list S3 buckets". |
| 5 | Section 23 (`PricePerformance.tsx`) | "Every workload of section 20, Fifteen Workloads, Five Shapes, has such a unit." | HOLDS: section 20 lists fifteen workloads; section 23's two unit tables name all fifteen. |
| 6 | Section 23, table caption | "The batch workloads of section 20, and the unit of work to count for each" | HOLDS: row names are section 20's; the batch and clock grouping is section 23's own and is not attributed to section 20. |
| 7 | Section 23 | "whether on demand, Spot capacity that AWS may take back, or capacity reserved ahead (section 24, Orchestrating Physical AI on AWS)" | HOLDS: section 24's "The capacity markets" covers On-Demand, ODCR, Capacity Block, training plan and Spot. |
| 8 | Section 23 | "price a workload on the instance built around the part it exhausts first (section 20 names that part for each workload)" | Minor, P4-3 |

### Findings

**P4-1 (minor). Section 15 makes the market part of the shape.**
- Sentence: "The width then sets the save interval and the market, which together make the job's shape (section 20,
  Fifteen Workloads, Five Shapes): saves every 30 minutes or less and Spot for one GPU, durable saves and a reservation
  or accepted hours of loss for a node, and as a rule a reservation for many nodes."
- Evidence: published section 20: "A shape is three properties of a job: Duration ... Coupling ... Interruptibility",
  and "The shape chooses how the machine is bought and scheduled on AWS". The market follows from the shape; it is not
  one of its properties, and the save interval is a response to interruptibility rather than the property itself.
- Fix: "The width then sets the job's shape (section 20, Fifteen Workloads, Five Shapes: how long it runs, whether its
  parts exchange data, whether it survives an interruption), and with it the save interval and the market: saves every
  30 minutes or less and Spot for one GPU, ..."

**P4-2 (minor). Section 24 has no scheduler row for a single node.**
- Sentence: "Section 24, Orchestrating Physical AI on AWS, picks the scheduler for each."
- Evidence: "each" covers one GPU, one node and many nodes. Section 24's training row reads "One GPU: Batch,
  SageMaker. Many nodes: HyperPod, PCS"; for the single node of up to eight GPUs the section has only AWS's general rule
  "Training Jobs for a fully managed service, HyperPod for a team that already runs Kubernetes or Slurm ... and wants a
  persistent cluster".
- Fix: "Section 24, Orchestrating Physical AI on AWS, picks the scheduler for one GPU and for many nodes, and quotes
  AWS's one-sentence rule for training jobs."

**P4-3 (minor). Section 20 does not name one part for every workload.**
- Sentence: "price a workload on the instance built around the part it exhausts first (section 20 names that part for
  each workload), since every other part is paid for and left idle."
- Evidence: section 20's table marks a "first" part for fourteen of the fifteen workloads. Closed-loop evaluation has
  only "mix" cells ("A mix of the physics, camera and inference rows, in many independent copies"), and generative
  augmentation has two "first" cells (minutes per clip; tens of GB).
- Fix: "(section 20 names that part for each workload, and for closed-loop evaluation the mix it draws on)".

Pointers checked: 8. Findings: 3 (0 errors, 3 minor); 5 hold.

## Totals

Findings: 13 (1 error, 12 minor). Earlier findings: 18 of 18 resolved (section 21 4 of 4, section 22 7 of 7, section 23
6 of 6, section 2 1 of 1), plus the section 23 "Superand" join.

Errors:
- E22-R3-1, section 22: "since no document gives it" widens the A78AE width hedge (U08-1: "neither was located").
