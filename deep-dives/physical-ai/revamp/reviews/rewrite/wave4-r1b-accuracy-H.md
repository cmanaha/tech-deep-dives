# Accuracy review H, wave 4 round 1: sections 22 and 23

Read from HEAD (39c464e): `git show HEAD:deep-dives/physical-ai/src/sections/{Measurements,PricePerformance}.tsx`,
the change from `git diff 9957515 HEAD`, the before texts in `/tmp/pai-text-before/` and the after texts in
`/tmp/pai-rw/w4-r1b/`. Checked against `research/2026-11/08-compute-shapes.md` (sections G and J, the U08 table,
the contradictions table and the Wave 4 notes at the end), register 07 (F07-2, F07-3, F07-5, F07-22, F07-36,
F07-42, F07-47), F05-43, F06-60, F06-61, and, where a claim rests on our own files, `experiments/E-seed-profiling-
2026-11-19/workloads.py`, `run.sh` and `pmu-cards/jetson-orin-nano.md`. All arithmetic redone.

---

## Part 1. Section 22, Our Measurements: Three Stand-Ins on Two Edge Machines (`Measurements.tsx`)

### minor 1: the header gives the X925's ratios as "one core of a desktop machine" and drops the run scope and date

- Sentence (h1 description): "One core of a robot computer and one core of a desktop machine are 6.5 times apart on
  arithmetic, 3.8 on streaming from memory and 2.4 on a single memory read: learn to read a workload's gap from the
  part it fills, and carry the method to your own job"
- Entries: F08-65, F08-66, F08-67, F08-73.
- What they say: the three ratios are the Cortex-X925 against the Cortex-A78AE (22.242 / 3.411 = 6.52; 44.38 / 11.71
  = 3.79; 291.58 / 123.96 = 2.35). The Spark's other core gives other ratios against the Jetson (5.595 / 3.411 = 1.64;
  43.95 / 11.71 = 3.75; 291.58 / 144.92 = 2.01). The before header carried "(our own measurements ..., one run per
  pass, two passes; results read 2026-11-20)". That scope and date are gone from the header. Paragraph 1 restores
  "single runs" but not the date.
- Fix: "One core of a robot computer and the desktop machine's large core are 6.5 times apart ... (our single runs,
  read 2026-11-20): ..."

### minor 2: the first Spark figure does not name its core

- Sentence: "One core of an NVIDIA Jetson Orin Nano Super, a small robot computer, stepped a simulated humanoid 14,507
  times a second; one core of an NVIDIA DGX Spark, a desktop machine, stepped it 57,240 times, 3.9 times as many."
- Entry: F08-61.
- What it says: 57,240 steps/s is the Spark's Cortex-X925. The Spark's Cortex-A725 stepped 28,662. The core is first
  named in the next paragraph.
- Fix: "one Cortex-X925 core of an NVIDIA DGX Spark, a desktop machine, stepped it 57,240 times".

### minor 3: a new claim about how the counts were taken, with no register entry behind it

- Sentence: "The cycles were counted over the whole program, start-up included, while the rate was timed over the loop
  alone, so the cycle counts do not give the clock."
- Entries cited: F08-61, F08-60.
- What they say: no register entry states this. Our own files support it. F08-60's evidence shows `perf stat ... --
  "$@"` wrapping the whole command. `workloads.py` (in F08-62's Location) times only the loop with
  `time.perf_counter()` and `RUN_SEC = 5.0`. The claim is true, but it is in the files and not in the register.
- Fix: keep the sentence, and add a line under F08-60 giving the `workloads.py` lines 20 to 26 and the `run.sh` perf
  wrapper as its evidence.

### minor 4 (flagged point): the IPC decompositions are right and keep their stated condition, but leave out a second one

- Sentences: "The Spark's Cortex-X925 core finished 4.37 instructions per cycle and the Jetson's Cortex-A78AE 2.48, a
  factor of 1.76, so the other 3.9 / 1.76 = 2.2 is clock rate and instructions per step together." and "If a step
  takes the same instructions on both cores, as one program at one version should, the remaining 2.0 / 1.45 = 1.4 is
  the ratio of their clocks."
- Entries: F08-61 (IPC 2.48, 3.01, 4.37), F08-68, F08-60.
- What they say: the arithmetic checks out. 4.37 / 2.48 = 1.762; 57,240 / 14,507 = 3.946; 3.946 / 1.762 = 2.24
  (printed 2.2). 57,240 / 28,662 = 1.997; 4.37 / 3.01 = 1.452; 1.997 / 1.452 = 1.375 (printed 1.4). The condition
  "same instructions on both cores" is kept. The retiring check (45.7% x 10 = 4.57 against 61.0% x 5 = 3.05
  micro-operations a cycle, a ratio of 1.50) supports "because it kept a smaller share of its slots". The unstated
  condition: the IPCs come from the second execution's `inst_retired` and `cpu_cycles` (F08-60) over the whole
  program, start-up included. The page says this makes the cycle counts unusable for the clock, yet it uses those
  same whole-program IPCs as the loop's IPCs.
- Fix: append to the second sentence: "..., taking the whole-program instructions per cycle, start-up included, as
  the loop's."

### minor 5: the MuJoCo versions are cited to entries that do not hold them

- Sentence: "The machines also ran different MuJoCo versions, 4.0.1 on the Spark and 3.17.0 on the Jetson, and a new
  version can change the instructions a step takes."
- Entries cited: F08-61, F08-60. The versions are in F08-73, item 6, and nowhere else.
- Fix: add `<Cite id="F08-73">limits of our measurements</Cite>` to that paragraph.

### minor 6: "not the X925's" is our reading, stated flatly

- Sentence: "The Jetson core drew 84% of its triad figure and the X925 more than all of its own, so the ratio, 1,968 /
  390 = 5.0, runs past the streaming ratio of 3.8: memory bounds the Jetson's side of the division and not the
  X925's."
- Entries: F08-62, F08-63, F08-66.
- What they say: the arithmetic holds. 9.815 / 11.71 = 0.84; 49.53 / 44.38 = 1.12; 3.79 x 1.12 / 0.84 = 5.05. F08-63
  places only the Jetson "at that core's measured memory limits". No entry says the X925 side is free of a memory
  limit. The page's own evidence points both ways: 22.4% memory stall against 62.3% points away from a memory limit,
  but demand above the X925's own triad figure and 67.0% back-end bound point toward one.
- Fix: "... runs past the streaming ratio of 3.8: memory holds the Jetson's side of the division far more than the
  X925's (62.3% of cycles stalled on memory against 22.4%)."

### minor 7: the render reading drops "or as idle"

- Sentence: "Here it can also mean the thread is waiting for the GPU, which the CPU counters see as back-end bound,
  and perf's documentation limits the four shares to a workload bound by the CPU."
- Entry: F08-64 (and F08-9 for the perf clause, which is right).
- What it says: "a thread waiting on the GPU can read as back-end bound or as idle".
- Fix: "... waiting for the GPU, which the CPU counters can read as back-end bound or as idle, ..."

### minor 8: the closing cross-reference misdescribes what section 23 does

- Sentence: "Where the test passes, section 23, Price-Performance and Latency, turns the two rates into work per
  price, per watt and per deadline."
- Entries: F08-62, F08-63 (as section 22 reads them); section 23 at HEAD.
- What they say: section 22 says the policy stand-in fails its test across the machines, because the part that
  limits it changes. Yet section 23's worked figures (the 5.0 ratio and the 15.6 inferences per joule floor) come from
  that stand-in. Its one passing pair, 2.0 inside the Spark, is not turned into price or watts. The short title is
  acceptable.
- Fix: "Section 23, Price-Performance and Latency, gives the method that turns such rates into work per price, per
  watt and per deadline." Alternatively, fix section 23's 5.0 paragraph (Part 2, error 2).

### Checked with no finding

- "0.7 points": the Wave 4 reproducibility note supports it. 35 of 36 values are within 0.5 points; A725 policy
  retiring moves 0.69 (55.50 against 54.81). The section prints "within 0.7 points". Throughput within 2.5% matches
  F08-73 Wave 2.
- U08-7: not printed. The page gives neither the `-funroll-loops` figures nor a cause for the triad split anomaly. It
  prints the split only as the example that did not reproduce, with throughput kept (F08-66, F08-73 Wave 2). "One
  triad run understates it" rests on 49.5 against 44.38 (F08-63, F08-66), which is a derivation in view, not U08-7.
- Cross-references: section 21 is not named anywhere in the rendered text; the only mention is a code comment. No
  "PMU Cards" remains. Sections 4, 5, 7, 12, 13, 17 and 23 are named correctly.
- Placeholders: four, each "Placeholder, dated 2026-11-20", with what and source text unchanged.
- No dollar figure.
- All card values (F08-61, F08-62, F08-64); the ratio table (6.5, 3.8, 2.4, 3.9, 5.0 and 5.7, all redone); 27.1% x
  98.8% = 26.8% (F08-70); 36.54% (F08-70); 51 rows (F08-69); the slot width and 6.000 on three programs (F08-68,
  F08-16); 25.2 MB, 9.8, 35.3 and 49.5 GB/s, 84% and 80% (F08-63); the 1.6 and 13.2 point illustration (F08-23,
  F08-17); the flush formula difference (F08-19, F08-20, F08-22); 1,968 / 1,404 = 1.40 at IPC 3.07 and 2.96 (F08-62);
  102 and 273 GB/s owned by NVIDIA, ratio 2.68 (F07-36, F07-47); the Nsight figures, 16,460 and 406 billion a second,
  and "an eighth of the work" (F08-71, F08-72, F08-34); the pointer chase at 97.6% to 99.0% and FMA at 0.0% front end
  (F08-67, F08-65); the Jetson triad pass 1 and pass 2 values (F08-73 Wave 2, F08-66); the EC2 PMU rule and table
  (F08-25, F08-26, F08-56).

Claims checked: 78. Findings: 8 (0 error, 8 minor).

---

## Part 2. Section 23, Price-Performance and Latency: One Unit of Work per Workload (`PricePerformance.tsx`)

### error 1 (blind reviewer's point): a one-core speed ratio set against whole-machine watts and price, without saying so

- Sentence: "The Spark core does 1,968 / 390 = 5.0 times the work per second, so it wins per joule only if it draws
  less than 5.0 times the Jetson's watts, and per unit of price only if it costs less than 5.0 times as much."
- Entries: F08-62 (one core each, single run), F08-83 and F08-82 (the divisors are the machine's watts and the whole
  instance's price), F08-66, F07-36, F07-47.
- What they say and the ruling: the page does not say what it compares. The top of the ratio is one core against one
  core. The divisors are whole machines: this section's own per-joule block uses "the average power the whole board
  draws", and a core has no price of its own. The rule holds only for a job that keeps one core busy on each machine,
  so that the machine's rate is that core's rate. Section 22 warns that single-core ratios do not predict machine
  ratios (3.8 per core against NVIDIA's 102 and 273 GB/s, a ratio of 2.7). As written, the sentence widens our
  one-core Tier 0 figure into a rule for buying the machine.
- Fix: "For a job that keeps one core busy, as this one does, the machine's rate is that core's, so the Spark wins per
  joule only if the whole Spark draws less than 5.0 times the Jetson board's watts, and per unit of price only if it
  costs less than 5.0 times as much; a job that uses every core has its own ratio (section 22)."

### error 2 (flagged point): the 5.0 is called a memory ratio, and 49.5 GB/s is set beside the Jetson's figures as if comparable

- Sentences: "The 5.0 is a ratio of memory traffic." ... "The X925 core pulls 49.5 GB/s through the same weights.
  Memory bandwidth is the part to weigh price and watts against for this program: arithmetic beyond what memory can
  feed adds nothing to its rate."
- Entries: F08-63 ([derived]: "49.5 GB/s on the X925", with the caveat that the Spark's derived traffic sits above
  its measured read figure and the triad is "the better ceiling"), F08-66 (X925 triad 44.38 GB/s; X925 against A78AE
  3.8), F08-62 (memory stall 62.3% on the Jetson, 22.4% on the X925).
- What they say: the page does not reconcile 49.5 with 44.38. It never prints 44.38. It sets 49.5 beside the Jetson's
  9.8 and 11.71, which reads as if the X925 streamed 49.5 against the Jetson's 11.71. In fact 49.5 is above the
  X925's own single triad run. "Pulls" turns a derived demand (rate x 25.2 MB) into a measured draw. A traffic ratio
  equals the rate ratio by construction, so calling the 5.0 "a ratio of memory traffic" explains nothing. The measured
  streaming ratio is 3.8. Section 22 reads the same 5.0 as running past 3.8 because memory bounds only the Jetson's
  side. On the Spark, the X925 got 1.4 times the A725's rate from the same memory (F08-62; triad 43.95 against
  44.38), so "arithmetic ... adds nothing" does not hold on that side.
- Fix: "On the Jetson the 5.0 is set by memory: 390 x 25.2 MB = 9.8 GB/s against the 11.71 GB/s its core reached on
  the triad, with 62.3% of cycles stalled on memory. At 1,968 inferences per second the X925 would ask for 49.5 GB/s,
  above the 44.38 GB/s of its own triad run, with 22.4% of cycles stalled, so the 5.0 runs past the 3.8 streaming
  ratio of the two cores (section 22). Memory bandwidth is the part to weigh price and watts against on the Jetson."

### error 3 (flagged point): the 15.6 floor drops the power mode our Jetson ran in

- Sentences: "Until a reading under load exists, the vendor's range gives a floor. NVIDIA states 7 W to 25 W for the
  Jetson developer kit. If the board drew no more than 25 W, the stand-in did at least 390 / 25 = 15.6 inferences per
  joule, and more by an amount nobody measured, since one core of six was busy and the GPU idle." (The h2 description
  says: "take a floor from the vendor's power range until that reading exists".)
- Entries: F08-83, F07-36.
- What they say: the condition is stated ("If the board drew no more than 25 W"), and 390 / 25 = 15.6 is right.
  F08-83 permits a bound "and only a bound" and words the ceiling as "the module's 25 W". F08-83's evidence records the
  run's conditions: "Power mode: MAXN_SUPER. Idle board power about 4.8 W (tegrastats VDD_IN)". F07-36 gives "7W-25W"
  for the developer kit, tied to no power mode. No register entry says that MAXN_SUPER keeps the board within 25 W.
  The power mode, a stated condition of the 390, appears nowhere on the page, and "the vendor's range gives a floor"
  presents the condition as met. The page also applies to the whole board a figure that F08-83 calls the module's.
- Fix: "Our Jetson ran in its MAXN_SUPER power mode, and no reading shows the board stayed inside the 25 W at the top
  of NVIDIA's 7 W to 25 W range for the developer kit; if it did, the stand-in did at least 390 / 25 = 15.6 inferences
  per joule, ..." Change the h2 description to "take a conditional floor from the vendor's power range".

### minor 4: the idle readings lose "single reading" in the prose

- Sentence: "Our idle readings, about 4.8 W for the whole Jetson board from tegrastats and 10 W for the Spark's GPU
  alone from nvidia-smi, describe machines doing none of the work, and the second leaves out the CPU core the
  stand-ins ran on."
- Entry: F08-83 ("Tier 0, single reading").
- What it says: the before text labelled these "(single reading)". The citation chip still says "single run".
- Fix: "Our single idle readings, about 4.8 W ...".

### minor 5: the ratio the opening ranks on is never put through the page's own third check

- Sentence (h2 description): "... one of our ratios passes and one fails". In the figure caption: "the NumPy version
  of the policy stand-in is not recorded in our report".
- Entries: F08-62, F08-73.
- What they say: the 5.0 that the opening uses to rank machines is the policy stand-in's ratio. The page's third
  check, the same software release, cannot be confirmed for it, because the NumPy version was not recorded.
- Fix: add after the physics paragraph: "The policy stand-in's 5.0 cannot pass the third check either: the NumPy
  version of each run was not recorded."

### minor 6: NVIDIA's medians were not measured with TensorRT alone

- Sentence: "A vendor's figure meets the same checks: NVIDIA measured its GR00T N1.7 device medians with TensorRT,
  its inference compiler, so a call time of yours compares with them only for the same model compiled the same way."
- Entries: F07-5, F07-1.
- What they say: the table gives each device's median per runtime. For the Jetson Orin, "357.9 | 224.3 | 149.0" are
  PyTorch eager, torch.compile and TensorRT full pipeline.
- Fix: "NVIDIA's GR00T N1.7 table gives each device's median per runtime, PyTorch, torch.compile and TensorRT, its
  inference compiler, so a call time of yours compares only with the column for the same model compiled the same
  way."

### minor 7: "every other eight-GPU x86 size" has 12 cores per GPU is not true of P4d or G4dn

- Sentence: "G7, one of EC2's G families (GPUs that also carry graphics and video hardware), has 24 physical cores per
  GPU, twice the 12 of every other eight-GPU x86 size."
- Entries: F08-57, F08-58 (Wave 2 line), F08-85 (Wave 2 line).
- What they say: F08-57 gives p4d.24xlarge 96 vCPUs and 48 cores for 8 GPUs, which is 6 cores per GPU. F08-58's G4dn
  row gives g4dn.metal 96 / 8 = 12 vCPUs, which is 6 cores. The page's wording is the Wave 2 line of F08-58
  ("every other eight-GPU x86 size (24 against 12)"), and that line contradicts F08-57's own P4d row. This sentence is
  new in the rewrite.
- Fix: "twice the 12 of the other current eight-GPU x86 sizes (G5, G6, G6e, G7e, P5, P5e, P5en, P6-B200, P6-B300)".
  Also correct the F08-58 Wave 2 line.

### minor 8: the 4.4 comes from a rounded input

- Sentence: "A worst call up to about 20 / 4.5 = 4.4 times that median still fits."
- Entry: F07-5 (149.0 ms; "149.0 ms / 33.3 ms = 4.47 periods").
- What it says: redone from the unrounded inputs, 20 periods is 666.7 ms, and 666.7 / 149.0 = 4.47, about 4.5. The
  printed 4.4 comes from first rounding 4.47 to 4.5.
- Fix: "A worst call up to about 20 / 4.47 = 4.5 times that median still fits."

### minor 9: "never stops to wait" holds only while the half-chunk rule holds

- Sentence: "With asynchronous calls the arm keeps playing while the next call runs, so it never stops to wait."
- Entry: F07-22.
- What it says: the remaining playback must still cover the next inference; "Another 1-second request cannot fit; no
  refill value fixes that." Section 17 says "the arm need not stop to wait".
- Fix: "... so it need not stop to wait while a call runs."

### Checked with no finding

- Placeholders: three, each "Placeholder, dated 2026-11-20", with what and source text unchanged in meaning.
- No dollar figure. The toy example is relative to P and marked as Toy: 3,600,000 / P, 3,000,000 / P, 0.83.
- Every figure of ours keeps "single run", "one core", the core name and, in the chart, the MuJoCo version.
- Cross-references: sections 3, 9, 13, 17, 20, 22 and 24 are named with the right titles and the content they are
  cited for: the 33.3 ms period, AV1 by default, RT cores, the half-chunk rule in symbols, the workloads, the
  stand-ins and purchase options. Section 21 is not named. No "PMU Cards".
- Checked: nvidia-smi utilisation and "one small kernel ... reads 100%" (F08-30); the unit table and the counts
  twelve and three (F08-81); the cloud formula and both corrections (F08-82); the edge formula and purchase price
  (F08-83); "No price was collected" (F08-59); AV1 by default (F05-43); P5 has no AV1 decode and 12 cores per GPU
  (F08-58, F08-57); P families lack RT cores (F06-60, F08-58); physics 2.0 passes and 3.9 fails (F08-61, F08-73);
  40 actions and 1.33 s (F07-2); 149.0 ms and 4.5 periods, module unnamed (F07-5, U1); 2.56 ms (F08-84); the mean
  rising 9% (99 + 10 = 109); 30 / 20 = 1.5 calls a second and 100 / 1.5 = 67 s; 60 timed calls (F07-3);
  60 x 0.01 = 0.6 and 0.99^60 = 0.547; 5,400 and 54 calls; VDD_IN covers the whole board (F08-83, F08-40).

Claims checked: 56. Findings: 9 (3 error, 6 minor).
