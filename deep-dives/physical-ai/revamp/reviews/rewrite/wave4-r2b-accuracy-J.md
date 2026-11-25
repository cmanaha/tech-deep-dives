# Accuracy review, wave 4 round 2, reviewer J: sections 22 and 23 (confirming check), plus one cross-section point

Read from HEAD (4bc3e54) with `git show`; both files are unchanged since their round 2 commits (22: `664d899..ee42ea2`;
23: `e33a88b..b3b36c7`). Rendered text from `/tmp/pai-rw/w4-r2b/22-measurements.txt` and `23-price-performance.txt`.
Registers: `research/2026-11/*.md` at HEAD (none modified in the working tree), including F08-87 and F08-88
(7db4480) and the F08-58 rewrite check (dbd8480). Earlier findings from `/tmp/pai-rw/review/w4r1b/accuracy-H.md`
(Part 1 section 22, Part 2 section 23). Where a claim rests on our own files, `experiments/E-seed-profiling-2026-11-19/`
(`run.sh`, `report.md`, `pmu-cards/`) and `experiments/README.md`. All arithmetic redone. Section 2 read from HEAD
(`GettingStarted.tsx`) for Part 3 only.

## Part 1. Section 22, Our Measurements: The Speed-Up Depends on the Part That Runs Out First (`Measurements.tsx`)

### Earlier findings (accuracy-H, Part 1): 8 of 8 resolved

| ID | Status | What the page says now |
|---|---|---|
| H22-m1 (header: "one core of a desktop machine", run scope and date dropped) | RESOLVED | "the large core of a desktop machine beats a robot computer's core 6.5 times on scalar arithmetic, 3.8 times on streaming memory and 2.4 times on a single memory read (our single runs, results read 2026-11-20)". |
| H22-m2 (first Spark figure does not name its core) | RESOLVED | "One Cortex-X925 core of an NVIDIA DGX Spark ... does scalar multiply-adds ... 6.5 times as fast"; "one Spark X925 core 57,240 times". |
| H22-m3 (whole-program counting and loop-only timing, no register entry) | RESOLVED | The loop-timing half is gone. What remains, "The counters give instructions per cycle over the whole program, start-up included", rests on F08-60's quoted run line (`perf stat ... -- "$@"`, which wraps the whole `python workloads.py` process). The register line H proposed was not added and is no longer needed. |
| H22-m4 (whole-program IPC used as the loop's, condition unstated) | RESOLVED | "taken as the loop's, they are 4.37 on the X925 and 2.48 on the A78AE"; "If a step takes the same instructions on both cores, and the whole-program figures again stand for the loop's, the remaining 2.0 / 1.45 = 1.4 is the ratio of their clocks." |
| H22-m5 (MuJoCo versions cited to entries that lack them) | RESOLVED | "The Jetson ran MuJoCo 3.17.0 and the Spark 4.0.1" now cites F08-73; the later "spans two MuJoCo versions" also cites F08-73. |
| H22-m6 ("not the X925's", our reading stated flatly) | RESOLVED | "memory limits the Jetson's rate far more than the X925's (62.3% of cycles stalled on memory against 22.4%)". |
| H22-m7 (render reading drops "or as idle") | RESOLVED | "a thread waiting for the GPU can also read as back-end bound or as idle". |
| H22-m8 (closing cross-reference misdescribes section 23) | RESOLVED | "Section 23, Price-Performance and Latency, takes up the method of comparing two machines on a unit of work." Section 23's h1 and body do that. |

### The points the task singled out

- **F08-87 (perf multiplexing).** Use line: what to look for in perf's output, and "do not print a counter count from
  this entry". The page prints no counter count per core: "When perf cannot schedule every requested event at once it
  multiplexes them ... perf prints the share of the measurement each counter was running; below 100% means the count
  was scaled." The "running" share and the scaling are both in the entry ("percentage of measurement time the counter
  was running"; "a counter running less than 100% of the time was multiplexed and scaled"). The page makes no claim
  that our own counts were or were not scaled, and no entry records it, so nothing to check there. One hardening and
  one word choice: M22-R2-5. The Use line names section 21; the working-tree section 21 also prints both F08-87 and
  F08-88, so the two sections will carry the same material (not an accuracy point).
- **F08-88 (PyTorch float32 matmul precision).** Use line: the page may say the documented default keeps a float32
  multiply in float32 and that "high" permits TensorFloat32, "but not which setting our run used"; version and
  setting were not recorded. The page states the default and the "high" setting correctly ("computes in float32 by
  default"; "lets it use TensorFloat32, a lower internal precision with a float32 result, where a fast kernel
  exists": entry, "if the appropriate fast matrix multiplication algorithms are available", "The output dtype stays
  float32"). It never states our run's setting. It also never says the setting and version were not recorded, and the
  sentence "The Spark's multiply ran in PyTorch, where a float32 matrix multiply computes in float32 by default",
  placed right after the simt reading, invites the reader to take our run as the default at v2.15.0 (the chip's
  label). M22-R2-6.
- **The opening rule.** Ruled in E22-R2-1: yes, as printed it states something the page's own figures contradict on
  the core side, and it lacks the both-machines condition the page later requires.

### Changed sentences checked and holding

- Arithmetic, all redone: 6 x 1024 x 1024 x 4 = 25,165,824 B = 25.2 MB; 390, 1,404 and 1,968 x 25.17 MB = 9.81, 35.3
  and 49.5 GB/s; 9.81 / 11.71 = 84%; 35.33 / 43.95 = 80%; 22.242 / 3.411 = 6.52; 44.38 / 11.71 = 3.79; 291.58 / 123.96
  = 2.35; new column X925 against A725: 22.242 / 5.595 = 3.98, 44.38 / 43.95 = 1.01, 144.92 / 123.96 = 1.17, 57,240 /
  28,662 = 2.00, 1,968 / 1,404 = 1.40, 1,191 / 937 = 1.27 (printed 4.0, 1.0, 1.2, 2.0, 1.4, 1.3); 57,240 / 14,507 =
  3.95; 4.37 / 2.48 = 1.76; 3.95 / 1.76 = 2.24; 4.37 / 3.01 = 1.45; 2.00 / 1.45 = 1.38; policy-implied clock ratio
  1.40 / (3.07 / 2.96) = 1.35, so "matches that clock ratio" holds at the printed precision; 4.0 / 2.0 = "twofold";
  1,968 / 390 = 5.05; 1,191 / 209 = 5.70; 36.54% and 26.8% (F08-70); 273 / 102 = 2.68.
- Opening paragraphs: the A725 "smaller" cores and "ten" of each (F07-47); "(one number per instruction, vector units
  unused)" (F08-65: scalar, no NEON or SVE); "one version, one memory" inside the Spark (F08-73 item 6, per machine);
  "The physics step is limited by the core's execution" (F08-61 use, `[our reading]`); single run of one program
  pinned to one core (F08-60, F08-73).
- Method block: top-down analysis and `perf stat` (F08-9, F08-60); the slot at rename and widths 6, 10, 5 (F08-14,
  F08-68, F08-16); the three slot classes (F08-3); bad speculation as discarded work and the restart (F08-7, Intel's
  definition; the page states twice that the cards' formula books the restart in the front end); memory stall as a
  share of cycles (F08-60 detail group).
- Microbenchmark glosses: 24 independent chains in registers, scalar (F08-65); triad over arrays larger than the
  caches (F08-66); pointer chase, one read in flight, TLB misses, "at whatever page size the system used" (F08-67: page
  size not recorded; the new wording claims no page size).
- Stand-in table: "Its bottleneck" cells match the verdicts below them (F08-61, F08-62, F08-64); 25.2 MB "more than any
  cache on either machine" (F08-63).
- Physics verdict: "read only 2.6% in one of two runs" (F08-66, pass 2; printing the anomaly is what F08-66's use line
  asks for, and "one of two runs" keeps F08-73 Wave 2's non-reproduction in view); L2 refills 4.57 against 41.82 per
  thousand instructions (F08-61, F08-62, the L2 column); X925 2.0 against triad 1.0 from the same memory (F08-61,
  F08-66); X925 36.5% back end with 0.4% memory stall, A78AE 31.0% front end (F08-61); "Arm's telemetry files ... hold
  no corrected formula for the A78AE" (F08-16).
- Policy verdict on the Spark: "the counters do not name one bottleneck"; demand against stalls; `STALL_BACKEND_MEMBOUND`
  beside `STALL_BACKEND` (F08-24: `backend_mem_bound = STALL_BACKEND_MEMBOUND / STALL_BACKEND`, defined for the X925
  and the A725; its use line calls core against memory bound "directly measurable" on those cores, so "would settle
  it" holds).
- "A triad figure is what one loop reached, not the most a core can draw: the X925's stand-in drew 49.5 GB/s. The
  benchmark offers no higher ceiling for that core: its loop that only reads memory was held back by its own
  instructions (28.94 GB/s, 82.9% front-end bound)." F08-63 and its caveat (the read kernel "understates the bandwidth
  available"; the triad "the better ceiling" than it). "Drew" rests on F08-63's premise that every pass reads all 25.2
  MB from beyond the caches; the preceding paragraph calls the same figure a demand ("asks for").
- Render verdict (F08-64, F08-9).
- Expandable method: two executions of six and eight events, 14 microbenchmarks and three stand-ins, mixing the groups
  compares two executions (F08-60 and its use line); width from `stall_slot + op_spec` over `cpu_cycles`, 10 and 5
  recovered, 6.000 on three programs, the Jetson's kernel reports 0 (F08-68, F08-15, F08-16); the four formulas are
  term for term `sbsa.json` (F08-20).
- Validation block: the sum to 100% as an identity (F08-69); known-answer programs, 97.6% to 99.0% and 0.0% (F08-67,
  F08-65, F08-69 use line); two builds, 2.5% and 0.7 points (F08-73 Wave 2, Wave 4 reproducibility note); triad pass 1
  and pass 2 values (F08-73 Wave 2, F08-66); the triad rate as the ruler, two widths at the same figure (F08-66); the
  flush bias scoped to the X925 and the A725, `STALL_FRONTEND_FLUSH`, back end and retiring unchanged (F08-19, F08-20,
  F08-22); the borrowed-constant illustration, 1.6 and 13.2 points, "measure nothing" keeps its illustration status
  (F08-23; the dropped clause about the substitute branch event is a detail the "measure nothing" label covers).
- GPU block: kernel names, sizes, throughputs, clocks, profiler versions (F08-71, F08-72); "Neither card records a
  figure for the tensor cores"; "going by its name the Spark's kernel did not use them at all" keeps F08-71's
  `[our reading]` as "going by its name"; 16,460 and 406 billion, an eighth of the work; tegrastats prints the clock
  (F08-72 use line, F08-40).
- Own-workload block: `armv8_pmuv3_1` and `armv8_pmuv3_0` (F08-68); the snippet against `run.sh` lines 9 to 15 (same
  six events, `taskset`, `-x,`; "Adapted from" covers the dropped `-n` and `-o`); EC2 PMU rule: "full support starts at
  c9g.12xlarge and c8g.24xlarge", "generally", reduced set, "possibly none" (F08-25, F08-26); Graviton cores are Neoverse
  (F08-56).
- Cross-references: sections 4, 5, 7, 12, 13, 17 and 23 match `sections.json` at HEAD; the Silicon, Memory & Inference
  dive link is unchanged.
- Placeholders: four, each "Placeholder, dated 2026-11-20". Three moved next to the block they complete; wording
  changes ("Jetson Orin Nano Super", "the current cards", "on the same two machines", the p50 and p99 gloss) keep each
  one's meaning. No dollar figure.

### Findings

**E22-R2-1 (error, the task's point). The opening rule, as printed, is contradicted by the page's own core-limited
example and drops the condition that the page later says a ratio needs.**
- Sentence: "A program gains only the ratio of the part that limits it: the core's own execution, the rate memory
  streams at, or the time one read takes."
- It closes a paragraph whose three sentences give, in the same order, the multiply-add ratio (6.5, F08-65), the
  streaming ratio (3.8, F08-66) and the latency ratio (2.4, F08-67), and the h1 description sets up the same three. Read
  that way, a core-limited program gains the multiply-add ratio. The page's own core-limited program says otherwise:
  the physics step gains 2.0 inside the Spark against a multiply-add ratio of 4.0 (F08-61, F08-65: 57,240 / 28,662 =
  2.00; 22.242 / 5.595 = 3.98), and 3.9 across the machines against 6.5. The very next paragraph says so ("the core's
  arithmetic ratio still overstates its speed-up twofold"), and the corrected rule arrives two-thirds down ("A
  microbenchmark's ratio predicts a program only when the program is limited by the unit the loop measures. For a
  program limited by the core as a whole no loop stands in"). The rule also omits the condition the page states later,
  "the same bottleneck on both": the policy stand-in, memory-limited on the Jetson, gains 5.0 against the streaming
  ratio of 3.8 (F08-62, F08-63). No figure on the page contradicts the memory and latency halves where that condition
  holds. So the rule fails on its first example only on the core part, but that is the part the paragraph sets up.
- Fix: "A program can gain one of these ratios only when the part that ratio measures limits the program on both
  machines: the streaming ratio for a program that waits on streaming memory, the latency ratio for one that waits on
  single reads. A program limited by the core as a whole gains its own ratio, which no loop gives: the multiply-add
  loop measures one unit of the core."

**M22-R2-1 (minor). "Two other counts do" announces two counts and the page names one.**
- Sentence: "On the A78AE a low memory stall alone does not clear a program: the triad, which streams memory by
  construction, read only 2.6% in one of two runs of the benchmark set. Two other counts do. On the Jetson the step
  refills its L2 cache, the core's second-level cache, from further out 4.57 times per thousand instructions, against
  41.82 for the policy stand-in, which does wait on memory."
- F08-61 and F08-62 give the L2 refill count (4.57 against 41.82). No second count is named in that paragraph, and the
  validation block later says "the physics verdict on the refill count" (singular). F08-61 also carries L1d refills
  (5.22 against 34.23 for the policy), which would serve as a second count if one is meant.
- Fix: "Another count does." Or name the second: "Two other counts do: on the Jetson the step refills its L1 data
  cache 5.22 times and its L2 cache 4.57 times per thousand instructions, against 34.23 and 41.82 for the policy
  stand-in."

**M22-R2-2 (minor). The flush-restart booking is stated as a fact of the A78AE card; F08-22 establishes it for the
X925 and the A725, and no file exists for the A78AE.**
- Sentence: "The formula behind these cards also books the restart after a wrong prediction as front-end bound, and how
  much of the 31.0% that is cannot be checked: Arm's telemetry files, the event and formula definitions Arm publishes
  for each core, hold no corrected formula for the A78AE."
- F08-22: front end too high by `STALL_FRONTEND_FLUSH / CPU_CYCLES` "on X925, A725 and V3". F08-16: "The repository has
  no file for the Cortex-A78AE." Whether that core's `STALL_SLOT_FRONTEND` counts flush recovery is in no entry. The
  validation block scopes the same bias correctly ("So on those two cores ...").
- Fix: "On the X925 and the A725 the formula behind these cards books the restart after a wrong prediction as
  front-end bound; whether it does so on the A78AE, and how much of the 31.0% that would be, cannot be checked: ..."

**M22-R2-3 (minor). "Where both hold, as here, compare machines by the GB/s one core streams" sets the condition on one
machine.**
- Sentence: "With demand that close to the triad figure and most cycles waiting on memory, more arithmetic would buy
  nothing. Where both hold, as here, compare machines by the GB/s one core streams."
- "As here" is the Jetson (F08-62, F08-63). On the X925 the conditions do not hold (demand past the triad figure,
  22.4% memory stall), and the page's own comparison shows the streaming ratio mispredicting this stand-in (5.0 against
  3.8). The closing block states the rule correctly ("only when ... the bottleneck is the same").
- Fix: "Where both hold on both machines, compare them by the GB/s one core streams; for this stand-in they hold on the
  Jetson only."

**M22-R2-4 (minor). "MuJoCo's GPU rasteriser" states that the GPU drew the frames, which was not established.**
- Sentence (table cell): "Not known: the counters see only the CPU thread that drives MuJoCo's GPU rasteriser"
- F08-73 evidence (experiments README): "MuJoCo offscreen rendering at 640x480 (whether the GPU took part was not
  established)". F06-61: EGL is MuJoCo's context "for hardware accelerated headless rendering", the route, not a proof
  that our run used the GPU. Section 23 keeps the scope ("how much of each frame the GPU drew was not established").
- Fix: "Not known: the counters see only the CPU thread that drives MuJoCo's rasteriser through EGL, whose GPU share was
  not established".

**M22-R2-5 (minor). The multiplexing paragraph hardens F08-87's "can lose accuracy", and "as one group" reads as a
perf event group, which our run did not use.**
- Sentences: "a ratio of two events not counted at the same time, such as instructions per cycle, loses accuracy." and
  "Pin the program to one core and count the six slot events as one group, the way these runs did."
- F08-87: "A ratio of two events not counted at the same time, such as instructions per cycle, can lose accuracy"
  (quote: "accuracy for metrics like instructions per cycle can be lower"). `run.sh` (F08-60) passes the six events
  as one `-e` list without perf's group braces, and the snippet does the same; with the multiplexing paragraph two
  blocks up, "as one group" invites the reading that perf was made to schedule them together. In the page's own
  earlier usage "group" means one execution's set of events, which is accurate.
- Fix: "... can lose accuracy." and "count the six slot events in one execution, the way these runs did."

**M22-R2-6 (minor, the task's F08-88 point). The PyTorch paragraph omits the scope F08-88's use line attaches.**
- Sentence: "The Spark's multiply ran in PyTorch, where a float32 matrix multiply computes in float32 by default."
- F08-88 use line: "The PyTorch version and the precision setting of our run were not recorded, so the page may say the
  documented default keeps a float32 multiply in float32 and that "high" permits TensorFloat32, but not which setting
  our run used." The page does not name our setting, but it states the default with no version (the entry documents
  v2.15.0) directly after the simt reading, so the reader takes our run as the default.
- Fix: "The Spark's multiply ran in PyTorch; our run recorded neither the PyTorch version nor the precision setting. In
  PyTorch v2.15.0 a float32 matrix multiply computes in float32 by default, and calling ..."

Claims checked: about 95 (every changed or moved sentence, table cell, card label, caption, header, snippet line and
placeholder in the round 2 diff, plus the eight earlier findings). Findings: 7 (1 error, 6 minor).

## Part 2. Section 23, Price-Performance and Latency: When the Faster Machine Is the Better Buy (`PricePerformance.tsx`)

### Earlier findings (accuracy-H, Part 2): 9 of 9 resolved

| ID | Status | What the page says now |
|---|---|---|
| H23-e1 (one-core ratio set against whole-machine watts and price) | RESOLVED | "a per-core speed ratio of 1,968 / 390 = 5.0. The job keeps one core busy, so each machine's rate is that core's, and the Spark is the better buy for it only if the whole Spark costs less than 5.0 times as much as the Jetson, or draws less than 5.0 times the Jetson board's watts. A job that loads every core, or the GPU, needs its own ratio ... (section 22, Our Measurements)." |
| H23-e2 (5.0 called a memory ratio; 49.5 beside the Jetson's figures) | RESOLVED | "A ratio of memory traffic" and "pulls" are gone. "Memory sets the Jetson's side of that ratio" (9.8 against 11.71, 62.3%); "The Spark core is not held the same way. At 1,968 inferences per second the X925 asks for 49.5 GB/s, more than the 44.38 GB/s its own memory test reached, so one run of that test is not its ceiling, and only 22.4% of its cycles stalled on memory"; "arithmetic ... adds nothing" is now scoped "On the Jetson". The replacement sentence about 3.8 raises E23-R2-1. |
| H23-e3 (15.6 floor drops the power mode) | RESOLVED | "gives a floor that holds on one condition. Our Jetson ran in its MAXN_SUPER power mode, and no reading shows the board stayed within the 25 W at the top of that range. If it did, ... at least 390 / 25 = 15.6"; h2 "a conditional floor". The new paragraph after it drops the same condition: E23-R2-2. |
| H23-m4 (idle readings lose "single reading") | RESOLVED | "our single idle reading there was about 4.8 W"; "10 W idle in our single reading". |
| H23-m5 (the 5.0 never put through the third check) | RESOLVED | "The policy pair meets the first two checks and leaves the third open: no NumPy release was recorded"; and "with the NumPy release on each machine unrecorded nothing splits them". |
| H23-m6 (NVIDIA's medians not TensorRT alone) | RESOLVED | "NVIDIA's table gives one median per runtime, plain PyTorch, torch.compile (PyTorch's own compiler) and TensorRT, with its Orin in MAXN mode, so a call time of yours compares only with NVIDIA's figure for the same model, runtime and mode." |
| H23-m7 ("every other eight-GPU x86 size") | RESOLVED | "The other eight-GPU sizes that list 24 vCPUs per GPU (G5, G6, G6e, G7e, P5, P5e, P5en, P6-B200, P6-B300) run two threads to a core and have 12". |
| H23-m8 (4.4 from a rounded input) | RESOLVED | "667 / 149.0 = 4.5". |
| H23-m9 ("never stops to wait") | RESOLVED | "so the arm need not stop to wait for it". |

### The points the task singled out

- **"3.8 is a floor."** 3.8 is 44.38 / 11.71 = 3.79, the ratio of the two cores' single triad runs (F08-66, "The Spark
  delivers 3.8 times the Jetson", one core each). "Floor" does not follow from the entries: E23-R2-1. The second half
  of the check holds: the page does not set 49.5 and 44.38 side by side as comparable. It calls 49.5 a demand ("asks
  for"), says why it exceeds 44.38 ("so one run of that test is not its ceiling", F08-63 and its caveat), and keeps the
  X925's figures in their own paragraph, apart from the Jetson's 9.8 and 11.71.
- **Cores per GPU against the F08-58 rewrite check (2026-11-25).** Holds. The check forbids "every other eight-GPU x86
  size" and gives the comparison set (G5, G6, G6e, G7e, P5, P5e/P5en, P6-B200, P6-B300: 24 vCPUs, 12 cores). The page
  compares only with "the other eight-GPU sizes that list 24 vCPUs per GPU", names exactly that set, and gives 12 cores
  at two threads per core (F08-57). G7: 192 vCPUs, 192 cores, one thread per core, 24 per GPU (F08-57). The restrictive
  clause excludes G4dn and P4d (12 vCPUs, 6 cores per GPU) by construction; the page does not print the check's "four
  times G4dn's and P4d's", and nothing on it contradicts that. No "most cores per GPU" claim remains.
- **Headroom "667 / 149.0 = 4.5".** Holds. Chunk 40 actions (F07-2), played at the arm's 30 Hz: 40 / 30 = 1.333 s. The
  section's half-chunk rule ("a call may take up to half of what its chunk lasts"; F07-22 use line, `L <= H x dt / 2`)
  gives 0.667 s, which is 20 periods of 33.33 ms = 666.7 ms, printed 667. 666.7 / 149.0 = 4.47 and 667 / 149.0 = 4.48,
  both 4.5. The 149.0 ms keeps its owner and conditions: "NVIDIA's TensorRT median", "two 256x256 camera inputs on an
  unnamed Orin in MAXN mode" (F07-2, F07-3, F07-5 and U1). Section 17 prints "about four times" for the same quantity
  with a tick of margin kept (20 - 1 = 19 ticks, 19 / 4.47 = 4.25); the two agree.

### Changed sentences checked and holding

- Arithmetic, all redone: 1,968 / 390 = 5.05; 25.2 MB, 9.8 and 49.5 GB/s as in Part 1; 357.9 / 149.0 = 2.40; 149.0 /
  76.8 = 1.94 (1.94 < 2.4, "less than the runtime gained"); 57,240 / 28,662 = 2.0; 57,240 / 14,507 = 3.9; 390 / 25 =
  15.6; 5.0 x 4.8 = 24; 5.0 x 25 = 125; 1 / 390 s = 2.56 ms; (99 + 10) / 100 = 1.09; 30 / 20 = 1.5 and 100 / 1.5 = 67
  (toy); 60 x 0.01 = 0.6; 0.99^60 = 0.547; 3,600 x 1.5 = 5,400 and 54.
- Opening: "No price and no power reading under load has been collected yet" (F08-59, F08-83 use line); five-times rule
  as a necessary condition on price or watts (F08-82, F08-83).
- Memory paragraph on the Jetson: 9.8 "close to" 11.71, 62.3% (F08-63, F08-62); "exhausts first" (F08-63, "at that
  core's measured memory limits"; section 20 use line).
- Same-unit block: "a module its latency table does not name" (F07-5, U1); 357.9 and 149.0 with NVIDIA as owner
  ("NVIDIA reports"); AGX Thor 76.8 ms (F07-1, F07-5); MAXN (F07-3); the h2 description's "a change of runtime can move
  one policy's call time further than a change of machine" holds for the pair printed.
- Stand-ins paragraph and chart: one core of each core type; humanoid against SO-101; dense layers on a CPU core
  (F08-73, F08-62); bar labels keep "single run" and the MuJoCo versions (F08-61, F08-62, F08-64, F08-73). "No NumPy
  release was recorded": no register entry states the absence, and none of our files records one (`report.md`,
  `pmu-cards/`, `experiments/README.md` contain no NumPy version); it is a statement about our own records and holds.
- "On the Spark this physics step goes to its ten X925 cores before its ten A725 cores": ten of each (F07-47); our
  reading from the 2.0, a core-bound job.
- Render "ranks neither CPU cores nor GPUs, because how much of each frame the GPU drew was not established" (F08-64,
  F08-73).
- Price block: dated price, Region, purchase options (F08-82); the two corrections (F08-82 use line); physical cores,
  "two vCPUs can be two threads of one core" (F08-57: "A vCPU that is a hyperthread is not a core"); CPU-first
  workloads on CPU instances or many cores per GPU (F08-85); AV1 by default (F05-43); H100 has no AV1 decode (F05-47 via
  F08-58); RTX PRO 4500 "three hardware video decoders that handle it" (F08-44: 3 NVDEC, AV1 decode YES); B200 decodes
  AV1 (F05-48); section 10 does list the other GPUs (`ProcessingCurating.tsx`, the decode table); P families lack RT
  cores (F06-60, F08-58).
- Joule block: tegrastats rails and VDD_IN for the whole board (F08-40, F08-83's "Idle board power ... (tegrastats
  VDD_IN)"); nvidia-smi 10 W for the GPU alone, no whole-system Spark reading (F08-83); purchase price per unit of rate
  (F08-83); 7 W to 25 W for the developer kit (F07-36); MAXN_SUPER (F08-83 evidence); "and more, since one core of six
  was busy and the GPU idle" (F08-83 use line: "the true figure is higher"); 140 W chip budget and 240 W supply with
  NVIDIA as owner (F07-47).
- Deadline block: chunk trimming and the half-chunk rule (F07-22); local RTC in a background thread, hold the last
  target for up to one second by default, then fault, on a supported robot (F07-20); "Only a faster call, a longer
  chunk the policy supports or a different action rate makes more room" (F07-22's three remedies, and the only three
  terms in `H x dt - L`); medians of 60 timed calls (F07-3, F08-84); no p99 in either (F08-84).
- Steps: power mode beside the unit (F07-3); one-core rate only for a one-core job; VDD_IN and never a GPU-only
  reading (F08-83, F08-40).
- Cross-references: sections 3, 9, 10, 13, 17, 20, 22 and 24 match `sections.json` at HEAD and contain what they are
  cited for.
- Placeholders: four, each "Placeholder, dated 2026-11-20". The round 1 combined power-and-latency placeholder is split
  into two, each keeping its half; the price placeholder keeps "not yet collected"; the EC2 one says "No EC2 instance has
  been measured yet" (F08-73 item 7). No dollar figure anywhere in the section.

### Findings

**E23-R2-1 (error, the task's point). "3.8 is a floor on what memory allows" needs the Jetson's 11.71 GB/s to be that
core's ceiling, which no entry establishes.**
- Sentences: "The two cores' test figures differ 3.8 times, and since the X925's figure is not its ceiling, 3.8 is a
  floor on what memory allows. The rest of the 5.0 may come from memory the test did not reach, from the core or from
  software, and with the NumPy release on each machine unrecorded nothing splits them: ..."
- 3.8 = 44.38 / 11.71, two single triad runs (F08-66). Raising the X925's side (its demand of 49.5 GB/s exceeds its own
  run, F08-63) raises the ratio only if the Jetson's side is a true ceiling. Nothing says it is: F08-63 calls 9.25 and
  11.71 "that core's measured memory limits", measured figures; F08-66's anomaly note says the A78AE triad reads 78.1%
  front-end bound with 2.6% memory stall, "which does not look like a memory-bound loop"; F08-73 Wave 2 says that
  split does not reproduce. The page's own reasoning, "one run of that test is not its ceiling" here and "A triad figure
  is what one loop reached, not the most a core can draw" in section 22, applies to the Jetson's run as much as to the
  X925's. If the Jetson core can stream more than 11.71 GB/s, the ratio of what memory allows is below 3.8. "The rest
  of the 5.0" then treats 3.8 as a factor of the 5.0, which would hold only if memory bounded both sides, and the
  paragraph's own first sentence says the X925 is "not held the same way" (22.4% stalled). Our derivation is stated as
  a bound the entries do not give.
- Fix: "The two cores' test figures differ 3.8 times, but neither single run is shown to be its core's ceiling, and the
  X925's demand already exceeds its own, so 3.8 neither caps nor explains the 5.0. Memory the test did not reach, the
  core and the software may each contribute, and with the NumPy release on each machine unrecorded nothing splits them:
  measure the Spark with the software you will run before pricing it on this ratio."

**E23-R2-2 (error). The Spark's per-joule line is printed as "between 24 W and 125 W", dropping the condition the
paragraph before it just set on the 25 W.**
- Sentence: "A board under load draws at least what it draws idle, about 4.8 W for this Jetson, so that line sits
  between 5.0 x 4.8 = 24 W and 5.0 x 25 = 125 W."
- The 125 W is 5.0 times the 25 W at the top of NVIDIA's developer-kit range (F07-36), and holds only if the board
  stayed within it under load. The preceding paragraph says "no reading shows the board stayed within the 25 W", our
  Jetson ran in MAXN_SUPER, and F08-83 allows a bound from the vendor's ceiling "and only a bound". This is the
  condition accuracy-H's error 3 required for the 15.6, now printed for the 15.6 and dropped one paragraph later for
  the line built from the same 25 W. The 24 W lower end rests on the idle reading and stands.
- Fix: "... so that line sits above 5.0 x 4.8 = 24 W, and at or below 5.0 x 25 = 125 W only if the Jetson board stays
  within its 25 W under load, which no reading shows."

**M23-R2-1 (minor). The h1 description drops "single runs" from our measurements.**
- Sentence: "... (our measurements on two edge machines; vendor documentation read 2026-11-20)"
- Before: "(our measurements are single runs on two edge machines; ...)". F08-60 to F08-64, F08-73: "Tier 0, single
  run". The header prints no figure of ours, and the body ("(single runs)") and every bar label keep the scope, so the
  reader is told before any number.
- Fix: "(our measurements: single runs on two edge machines; vendor documentation read 2026-11-20)".

**M23-R2-2 (minor). "its 12 physical cores per GPU" drops "on the eight-GPU size" for P5.**
- Sentence: "A P5 training run on those recordings therefore decodes them on its 12 physical cores per GPU, or
  re-encodes them first, and the price per training sample includes that CPU work."
- Before: "12 per GPU on the eight-GPU size". F08-57: 12 cores per GPU for the eight-GPU sizes; F08-85's evidence row is
  p5.48xlarge (192 vCPUs, 96 cores). F08-58's P5 row: GPUs "(1, 8)" and "24 (16 on p5.4xlarge)" vCPUs per GPU, so the
  single-GPU size does not have 12 cores per GPU. The preceding paragraph lists P5 among the eight-GPU sizes with 12,
  which carries most of the scope.
- Fix: "decodes them on the 12 physical cores per GPU of its eight-GPU size".

**M23-R2-3 (minor). The caption says only the physics pair inside the Spark passes every check; the policy pair
inside the Spark passes too.**
- Sentences: caption "Only the two Spark bars of the physics panel pass every like-for-like check; the bar labels carry
  the MuJoCo version that fails the check across machines." and text "The policy pair meets the first two checks and
  leaves the third open: no NumPy release was recorded."
- The section's three checks are unit, model and software. The two Spark policy bars are one unit, one model and one
  machine's software: `run.sh` (F08-60, whole file) runs every workload with the machine's one `venv/bin/python`, and
  F08-73 item 6 records software per machine. Whatever the NumPy release was, it was the same on both Spark cores.
  Section 22 uses that pair (1,968 / 1,404 = 1.4) as a clean within-Spark comparison. The unrecorded release leaves
  open only the cross-machine policy pair, which "The policy pair" does not say.
- Fix: caption "The two Spark bars of the physics and policy panels pass every like-for-like check (one machine, one
  software install); across machines the bar labels carry the MuJoCo version that fails the software check." Text:
  "Across machines the policy pair meets the first two checks and leaves the third open: no NumPy release was
  recorded."

**M23-R2-4 (minor). "two measured rates decide" between three decode options leaves out what the cloud formula needs
for each instance.**
- Sentence: "Between CPU decode on a P5, one re-encode, and a GPU that decodes AV1, two measured rates decide: the frames
  one CPU core decodes per second, and the frames a training run consumes per second, which the P5's cores must keep
  pace with. With those and dated prices, the cloud formula says which costs least per training sample."
- The cloud formula (F08-82) needs units per second on each instance priced. A G7 or P6-B200 run has its own training
  rate (a different GPU), and the re-encode option has its own one-off cost; neither is one of the two rates named.
  F08-85 supports the P5 decode budget, not the claim that two rates settle the choice. Our reasoning, incomplete.
- Fix: "... the rates to measure are the frames one CPU core decodes per second, the training samples per second on
  each instance, and, for the re-encode, its one-off cost. With those and dated prices, the cloud formula says which
  costs least per training sample."

Not an accuracy finding, but visible on the page: the rendered text reads "NVIDIA Jetson Orin Nano Superand 1,968"
(line 260 of the source ends with `{JETSON}` and the next line starts with "and"; JSX drops the line break). Add
`{' '}` after `{JETSON}`.

Claims checked: about 80 (every changed or moved sentence, table cell, caption, header, list step and placeholder in
the round 2 diff, plus the nine earlier findings). Findings: 6 (2 errors, 4 minor).

## Part 3. Cross-section: section 2's "about nine times" against section 23's 4.5

**Ruling: section 23 is right; section 2 is wrong (error in section 2).**

- Section 2 (`GettingStarted.tsx`, HEAD): "A 149.0 ms call can still drive a 33.3 ms clock, because each benchmarked
  call returns a chunk of 40 actions. Played one per tick they last 40 x 33.3 ms = 1.33 s, about nine times the call
  that produced them. That holds in an asynchronous mode; in LeRobot's default synchronous mode the arm would stand
  still for every one of those calls." And its close: "... and check that the chunk it returns outlasts the call with
  room for the slowest ones (section 17, Running on the Robot)."
- Section 23: "so a call has half of them, 20 periods or 667 ms. NVIDIA's TensorRT median on its Jetson Orin is 149.0
  ms, and 667 / 149.0 = 4.5: ... a worst call up to 4.5 times the median still fits."
- Entries: F07-2 and F01-74 (action horizon 40); F07-5 and F01-74 (149.0 ms, NVIDIA's median); F07-22 ("after the
  steps consumed during inference are trimmed off, the remaining playback must still cover the next inference"; use
  line `L <= H x dt / 2`; the docs' own example, a 1 s call out of a 1.67 s chunk, "cannot fit"); F01-87 (section 2's
  own citation: the asynchronous backends "only work if the buffered actions outlast the inference time"; use line,
  "chunk duration left to play must exceed model latency").
- Both numbers are correct arithmetic for different quantities. 1.333 / 0.149 = 8.95 is the chunk's length in calls.
  0.667 / 0.149 = 4.47 is the room a call has, and the room is what decides whether a call fits: the actions left after
  one call's worth has been trimmed must cover the next call, so a call may take at most half the chunk. Section 23 gives
  the room (and section 17 gives "about four times" for the same quantity, with one tick of margin kept). Section 2
  offers the nine as the reason the call "can still drive" the clock, and its closing check states the fit condition as
  the chunk outlasting the call, a condition F07-22's own failing example meets (1.67 s outlasts 1 s). Read as the
  margin, which is how the blind reviewer read it, the nine overstates the room twofold.
- Fix wording for section 2:
  - "A 149.0 ms call can still drive a 33.3 ms clock, because each benchmarked call returns a chunk of 40 actions.
    Played one per tick they last 40 x 33.3 ms = 1.33 s. In an asynchronous mode the actions left when a chunk lands
    must cover the next call, so a call may take up to half the chunk, 667 ms, about 4.5 times the 149.0 ms median. In
    LeRobot's default synchronous mode the arm would stand still for every one of those calls." (667 and 4.5 as
    `<Derived>`; F07-22 or F01-87 cited for the half.)
  - Close: "... and check that the chunk it returns lasts at least twice your slowest call (section 17, Running on the
    Robot)."

Claims checked: 4 (the two sentences in section 2, the headroom sentence in section 23, section 17's counterpart).
Findings: 1 (1 error, in section 2).
