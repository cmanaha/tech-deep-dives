# Accuracy review E, wave 4 round 1: sections 20 and 21

Read from HEAD (80f8dab). Sources: `git show HEAD:deep-dives/physical-ai/src/sections/{Workloads,PmuCards}.tsx`,
the before/after text files, the registers in `research/2026-11/` (including Wave 2/3 lines, the F08-16 note at
line 846, the U08 unknowns table and `wave2-C.md`), and the raw CSV
`experiments/E-seed-profiling-2026-11-19/results-pass2/results-spark-x925.csv`. All arithmetic was redone in Python.

---

## Section 20, Fifteen Workloads, Five Shapes (`Workloads.tsx`)

### error 1: "the count" does not turn up the CPU-first fact; the section's only count shows the GPU filling first

- Sentence: "Across the fifteen jobs the arm's loop hands to computers, from recording video to training and running
  the policy, the count turns up a fact that a GPU's own figures hide: on a machine rented for its GPU, the first part
  to fill is often a CPU core, and the number that decides it is the instance type's cores per GPU."
- Entries: F08-77 (our reading), F05-59 (vendor claim, Tier 2), F05-58, F05-62, F05-60, F01-91.
- What they say: the section's one CPU-per-GPU count (5.16 ms per item, F05-62; about 2 cores per worker, F05-60;
  32 / 0.167 = 192 samples a second, F01-91) gives "about 2 of the 12 cores each GPU gets", and the next paragraph
  says "Plain decoding leaves the GPU full". The CPU-first evidence is LeRobot's docs ("the GPU ends up waiting for
  data", F05-58) and Hugging Face's 2.8x for ACT with an unnamed CPU (F05-59). F08-77 is our reading. No count in the
  section shows a CPU core filling first. This is the problem the reader reported, and it is still there.
- Fix: replace "the count turns up" with the evidence that does show it: "LeRobot's own documentation and its 2.8x
  result show that ...", and keep "often" tied to per-sample transforms.

### error 2: "Three of the CPU rows have one cause" contradicts the section's own count for the dataloader row

- Sentence: "Three of the CPU rows have one cause: LeRobot's video is AV1, written and read by CPU code by default.
  [...] In training, the GPUs most used either cannot decode AV1 (A100, H100) or are not listed as able to [...], so
  on them decoding stays on the CPU." (The h2 description repeats it: "three CPU rows share one cause you can check
  before renting".)
- Entries: F08-77 (our reading), F05-39, F05-67, F05-58.
- What they say: the section's own count puts plain AV1 decode at about 2 of 12 cores per GPU. It says per-sample
  transforms are what fill the CPU ("there the CPU fills first"; F05-58: transforms are "often the most expensive
  thing the workers do"). In the dataloader row, then, the cause is the transforms, not AV1. The "so" is also undercut
  by the section's own sentence "LeRobot's stock loader decodes with torchcodec [...] on the CPU whatever the card"
  (F05-39). F05-67's "Use in dive" says that with the stock loader the codec question "is moot".
- Fix: limit "one cause" to record and decode. Give the dataloader row its own cause (per-sample transforms on CPU
  workers, with CPU decode under them). Drop the "so" that blames the GPU's codec support for training-time decode.

### error 3: "close to none of the three" is false; 3.9 is next to the 3.8 bandwidth factor

- Sentence: "The physics stand-in, which leans on both halves of the core, ran 57,240 / 14,507 = 3.9 times faster on
  the X925, with the newer MuJoCo, close to none of the three"
- Entries: F08-61, F08-65, F08-66, F08-67.
- What they say: FMA 22.242 / 3.411 = 6.52; bandwidth 44.38 / 11.71 = 3.79; latency 291.58 / 123.96 = 2.35;
  physics 57,240 / 14,507 = 3.95. The physics factor is close to the bandwidth factor, although the physics run has
  0.4% memory stall on the X925 (F08-61), so the closeness is a coincidence and not a cause.
- Fix: "3.9 times faster, near the bandwidth factor by coincidence (0.4% of its X925 cycles stall on memory) and far
  from the other two: one speedup figure ..."

### error 4: the evidence row and the grid disagree on which half CPU physics fills first

- Sentences: evidence row "CPU cores, one world per core: the back end first on the Spark, the front end on the
  Jetson." and "CPU physics loads both halves, the back end most on the Spark and the front end on the Jetson."
  Grid row "CPU physics step": "also: branches in collision" (front end) and "first: arithmetic, one world per core"
  (back end).
- Entries: F08-61 (A78AE FE 31.0 / BE 21.5; X925 FE 12.2 / BE 36.5), F08-76 row 5 ("CPU back end, core-bound, with a
  front-end share").
- What they say: the rewritten prose says the front end is first on the Jetson. The grid, whose caption says "first"
  marks "the part that fills first on the evidence for that row", still marks only the back end. The rewrite added
  the Jetson reading and left the grid as it was.
- Fix: mark both CPU halves "first" for this row, with the per-machine split in the cell text, or say in the row and
  in the caption that the grid shows the Spark reading.

### error 5: Cosmos Curator's figure has lost its owner (two places)

- Sentences: "in one cancelled run of Cosmos Curator, NVIDIA's data curation toolkit, fetching the clips held 32 H100s
  at about 17% utilisation." and "The Cosmos Curator run at about 17% was a GPU waiting on its input."
- Entry: F05-76 (vendor-reported production report, one run; Wave 2: "a design note for the incubating robot
  captioning recipe records one run [...] the run was cancelled").
- What it says: the figure is NVIDIA's own report in a design note. The before text kept the owner ("in the design
  notes of Cosmos Curator"); the rewrite states it as a plain fact. The second sentence also turns 32 GPUs at 17% in
  aggregate into "a GPU".
- Fix: "NVIDIA's design notes for Cosmos Curator record one cancelled run in which fetching the clips held 32 H100s at
  about 17% aggregate utilisation"; second sentence: "In that run 32 GPUs waited on their input."

### minor findings

1. Slot shares from cores of different width are printed side by side, and the front-end shares have no caveat.
   Sentence: "did useful work in 43.2% of its slots on the Jetson's Cortex-A78AE [...] On the Spark's X925 it did
   useful work in 45.7%". The conclusions drawn are within-core (which half loses more), so no cross-width comparison
   is stated. But the widths (6 and 10 slots per cycle, F08-68) are missing, and section 21 says "Compare shares only
   between cores of the same width". The newly printed front-end shares (31.0%, 12.2%) also lack the generic-formula
   caveat that F08-22 asks for beside every front-end figure (F08-61: "front-end figures carry the caveat of F08-22").
   The A78AE has no Arm file (U08-1). Fix: add "(each a share of that core's own slots, 6 a cycle on the A78AE and 10
   on the X925; front-end shares lean high under the generic formula)".
2. "None of the fifteen fills latency first." The before text had "by the evidence we hold". The F08-76 our-reading
   badge carries part of that, but the scope words were dropped. Fix: add "on the evidence we hold".
3. "For the two halves of a CPU core and the units inside a GPU there is no supply figure to count against". GPU
   arithmetic has a published supply figure, the peak compute that forms the roofline's flat part (F08-35). The
   section itself points to the roofline for "a GPU's arithmetic against its memory". What needs a counter is the
   split between tensor and general units. Fix: "no supply figure that says which unit a program uses".
4. "Plain decoding leaves the GPU full: data loading is 0.015 s of that 0.167 s step." F01-91: the guide's
   `dataloading_s` "includes preprocessing", and the guide does not say whether transforms were on. "Plain decoding"
   is our inference. Fix: "LeRobot's own timing leaves the GPU full: data loading, preprocessing included, is ...".
5. "about 1000 / 5.16 = 194 items a second from a worker that LeRobot's docs put at about 2 CPU cores". The 2-core
   figure (F05-60) is for the streaming reader with one worker. The 5.16 ms (F05-62) is single-process access on
   unnamed hardware. Putting the two together is our inference. Fix: move "from a worker [...] about 2 CPU cores" into
   the Toy, or say "if one such process uses the 2 cores LeRobot's streaming docs give a worker".
6. "One call to `mj_step`, MuJoCo's step function, runs from collision detection to the constraint solve". F06-9:
   the 26 stages start with forward kinematics and end with the integrator. Fix: "runs from kinematics and collision
   detection through the constraint solve to integration".
7. "A policy's training and its calls are matrix arithmetic; batched physics leaves the tensor cores idle and fills
   the general units." F08-42 says the physics half is "inference from what those kernels compute, not a
   measurement". The before text had "by our reading" in the sentence; only the F08-76 badge carries it now. Fix: "by
   our reading, batched physics ...".
8. "If the pieces exchange data at every step, Batch will not run the job on Spot and the size needs EFA." F09-8 is
   about multi-node parallel jobs. A one-node job whose GPUs exchange gradients is shape B (the section's own table:
   "None beyond the one machine"). Fix: "If pieces on different nodes exchange data at every step".
9. "A GiB is 1.074 GB, so convert before comparing: 24 GB is 22.4 GiB, already over an L4". The arithmetic is right,
   but F08-45's rewrite check says EC2's GiB column follows no single rule (80 GB H100 printed as 80 GiB, 48 GB L40S
   as 44 GiB). LeRobot's "GB" unit is also not stated. Fix: soften to "on the figures as printed, 24 GB is 22.4 GiB".
10. "the Isaac Lab paper's authors note that throughput 'can also be dependent on single-core CPU performance'"
    (GPU-parallel physics row). The full quote (F06-65) gives the cause as "bottlenecks in some parts of PhysX
    simulation and the main training loop". The row covers MuJoCo Warp too. Fix: add "for PhysX" after the quote.
11. Section 8 pointer ("Section 20 [...] sets them beside the other jobs around the arm", meaning its three lanes).
    Section 20 still places the simulator lane (GPU-parallel physics and camera rows, the Playground SO-101 recipe as
    shape B, multi-node RL toward C; F08-76 rows 6 and 7, which section 8 cites). No row or shape names the
    pretrained-policy lane (8 GPUs, one node, more than a day) or the real-arm lane (HIL-SERL actor and learner).
    The gap was already there before the rewrite. Fix: one clause in section 20's shapes text (pretrained-policy RL
    is shape B; the real-arm actor is shape E), or narrow section 8's pointer to the simulator lane.

### checked and holding (section 20)

- Counts redone: 390 x 25.2 MB = 9.8 GB/s; 9.8 / 11.71 = 84%; 102 / 11.71 = 8.7; 1 - 1/2.8 = 64%; 2^30 / 10^9 =
  1.074, 24 GB = 22.35 GiB, 40 GB = 37.25 GiB; 466,485,248 / 8192 = 56.9 KB; 57.29 GB = 53.4 GiB above 44 GiB;
  Toy 4.4 x 8 / 2.5 = 14.1 s and / 700 = 0.050 s; 1000 / 5.16 = 193.8; 32 / 0.167 = 191.6; 64 B / 291.58 ns =
  0.22 GB/s; 25.2M / 32768 = 769, 342,053 / 2048 = 167, ratio 4.6, 16x fewer worlds; 2,390.22 / 5.41 = 442;
  1,255.2 / 157.8 = 7.95; 1,023,698 / 152,124 = 6.73; 57,240 x 0.005 = 286; 149 / 33.3 = 4.47; 3 h / 0.5 h = 6 to
  6 h / 0.5 h = 12; 6,400 / 2.5 = 2,560, 6,400 / 8 = 800, 800 / 2.5 = 320; 12,500 / 125 = 100; 64 / 4 = 16;
  268 / 2.79 = 96 ("almost 100"); "about half" = 7 of 15 rows marked tensor-first. Every input traces to a cited entry
  or a Toy/Derived label.
- Tier 0 scope: "single runs", "one core", stand-in wording and the MuJoCo version split (F08-73 item 6) are all
  present. Nothing of ours is presented as an EC2 result. Triad stall splits are not printed (F08-73 Wave 2).
- Parts and shapes as the dive's own reading: said once ("a grouping of ours like the parts and the place of each
  job in them", with F08-50, F08-78 and F08-76 badges). The Figure carries `cites="F08-50 F08-76"`.
- Vendor owners kept: Hugging Face 2.8x; NVIDIA 102 / 273 GB/s; LeRobot guide memory, times, step timing, ~90%;
  MuJoCo Warp; Isaac Lab Cartpole; NVIDIA support matrix; LeRobot PR 5.16 ms; Isaac Lab-Arena; GR00T README 149.0 /
  22.9 ms (both TensorRT, F07-1); Cosmos3-Nano 207.78 s and Transfer2.5 65.4 GB; GR00T N1 50,000 GPU-hours; Cosmos 3
  1,024 GB200; LeWorldModel "a single GPU in a few hours".
- AWS rules: Spot two-minute best-effort notice (F10-520); Batch hour / 30-minute guidance (F09-11); MNP not on Spot
  (F09-8); "tightly coupled between instance nodes" (F09-95); `Host EC2*` retry, front of queue,
  `AWS_BATCH_JOB_ATTEMPT` (F09-10); EBS, network, EFA and accelerator-memory figures (F08-45/46/48/49); vCPU and core
  ratios (F08-57); AV1 hardware decode G6, G6e, G7, G7e, P6, not P5 (F05-67); H100 0 NVENC / 7 NVDEC no AV1, L4 2/4
  AV1 both ways (F05-47, F05-50); Jetson Orin Nano no NVENC (F05-57); Isaac Sim RT-core quote (F06-52); "usable" not
  used (F08-45 rewrite check).
- Cross-references: section 1 stand-in and three properties (OneLoop lines 578 to 622); section 3 six joints;
  section 4 ACT and Diffusion Policy; section 5 SmolVLA and pi0; section 8 PPO; section 21 "Reading a Machine" (title
  matches sections.json; it covers front end against back end and tensor against SM activity); section 24 maps jobs
  to shapes and schedulers.

Claims checked: about 125. Findings: 5 errors, 11 minor.

---

## Section 21, Reading a Machine: The Counters That Say Which Part Is Full (`PmuCards.tsx`)

### error 1: "memory bound, so more bandwidth helps" is a new rule the entries do not support, and the section's own test case breaks it

- Sentences: "its second level splits a back-end loss in two: waiting on memory, where more bandwidth helps and a
  faster core does not, or waiting on the core's own execution units, where the reverse holds." And in the fourth
  card question: "For the back end, memory or the execution units, and the answer decides the purchase: more
  bandwidth for the first, a faster or wider core for the second. This is the question that keeps a core-bound job
  off a machine bought for its bandwidth."
- Entries: F08-6 (Memory Bound: "stalled due to demand load or store instructions"; nothing about bandwidth),
  F08-41 (bandwidth and latency are "two different limits"), F08-67.
- What they say: memory-bound covers latency-bound code. The section's own known-answer test is exactly that case: a
  pointer chase that lands at 97.6% to 99.0% back-end bound and is limited by the 124 to 292 ns per load, not by
  GB/s. More bandwidth would not help it. Section 20 makes the bandwidth/latency split one of its parts. The before
  text said only that "a faster core will not help"; the rewrite added "more bandwidth helps".
- Fix: "waiting on memory, where faster memory helps (more bandwidth if the loads stream, lower latency if each
  waits for the one before) and a faster core does not". In question 4: "faster memory for the first".

### minor findings

1. "The four percentages say whether a faster core, more memory bandwidth or different code would help, before you
   pay for any of them." Level 1 cannot separate memory from core. The section itself goes on to need level 2 or a
   memory-stall counter for that (F08-6, F08-24). Fix: "The four percentages, and the second level beneath them, say
   ...".
2. "at 70.49% of the GPU's compute throughput and 50.47% of its memory throughput". F08-34: SpeedOfLight throughputs
   are "the maximum percentage value of their constituent counters". The figures are not shares of peak FLOP/s or of
   bandwidth (16,460 GFLOP/s / 0.7049 does not give the chip's peak). Fix: "a compute (SM) throughput of 70.49% and a
   memory throughput of 50.47% in Nsight Compute's SpeedOfLight section, each the busiest unit's share of its own
   peak".
3. "And RT (ray-tracing) cores [...] have no counter in these tools: [...] none of the utilisation or profiling fields
   of nvidia-smi, DCGM or tegrastats covers them." The searched scope matches U08-4 (those four tools were searched).
   But F08-36 asks for "'Not located in this research', not 'does not exist'", and the before text had "no counter
   [...] was located in this research". The cited entries (F08-38, F08-36) cover only the Nsight Compute guide. Fix:
   "have no counter we located in these tools' documentation".
4. "a tenth of the 0.5 below which NVIDIA reads the GPU as used ineffectively". NVIDIA's words (F08-32): "likely
   indicates ineffective GPU usage". The paragraph before keeps "likely". Fix: "below which NVIDIA says usage is
   likely ineffective".
5. Tool table, Nsight Compute, "What it cannot tell you: Whether the GPU is waiting on the CPU". This cites F08-39
   with no our-reading label, but F08-39 marks the waiting-for-CPU reading as ours. Fix: add "; our reading" to that
   cite label.

### checked and holding (section 21)

- Slot formula and every symbol: S, CPU_CYCLES, STALL_SLOT_FRONTEND / BACKEND, STALL_SLOT (their sum, F08-15,
  F08-69), OP_SPEC (dispatched, including thrown-away), OP_RETIRED, slots, filled and kept are all defined before
  the formula. The four lines match `sbsa.json` term by term (F08-20). Toy 400-slot example: 54 / 6 / 15 / 25,
  filled 0.6, kept 0.9; Toy-wrapped.
- Physics card recomputed from the raw CSV row `wl_sim`: slots 199,582,563,580; FE 12.20%; BE 36.54%; filled 0.5126;
  kept 0.8907; retiring 45.66%; bad speculation 5.60%; width 9.999997 = 10.000 (all Derived).
- Generic-formula bias (F08-22): FE high and bad speculation low by the same amount on V1, V3, X925 and A725, with
  back end and retiring unchanged. V2 back end leans high by 3 of 4 cycles (F08-18), labelled our arithmetic, which
  checks against the V2 file. Flush correction (F08-23): 79,584,976 x 4 / 19,922,115,591 = 1.598 points; 12.2 to
  10.6, 5.6 to 7.2. Branch kernel: c = 0.1317, and the unrounded CSV gives FE 37.65 to 24.48 ("about 24.5" holds;
  wave2-C's 24.4 came from rounded inputs) and BS 11.91 to 25.08; the flip is real. It is disclosed that the estimate
  mixes two executions and borrows the V1 constant (F08-60, F08-23).
- Width caveats as the entries give them: N1 width 5, no slot-stall events, cycle accounting (F08-16 note, line 846);
  A78AE has no Arm file, kernel reports 0, derived 6.000, nothing to check it against (F08-16, F08-68, U08-1 wording
  per wave2-C). Width table: Intel 4/5/6/8 (F08-8); AMD 6/8/8 (F08-11, F08-12); Arm (F08-16). Graviton 3/4/5 = V1/V2/V3
  (F08-56); V3 file identical to X925 (F08-19).
- Residual: 4.57 / 3.05 = 1.498, 57,240 / 28,662 = 1.997, ratio 1.333. Retiring x S equals OP_RETIRED per cycle, so
  the remaining factor is exactly clock x micro-operations per step, as stated.
- Memory verdict: `b_stall_backend_mem` 78,552,977 / 19,922,115,591 = 0.394% of cycles. With the cycle counts nearly
  equal (19,922,115,591 against 19,958,256,358), whole stalled cycles can hold at most 0.4 of the 36.5 points. The
  hedge about memory waits in partly filled cycles and "in our reading" are present. Level 1 only (F08-73, F08-24).
- Spark GPU kernel (F08-71): one pass, 8.35 ms, 2 x 4096^3 / 8.35 ms = 16,460 GFLOP/s, needed root, `simt` reading
  labelled ours. Single-run scope kept; not presented as EC2.
- EC2 PMU table matches F08-26 (including "*6a" with no basic support); metal and SPE/CMN (F08-27); G4dn and G5g the
  only metal GPU families (F08-28); EC2 Detailed Monitoring hedge kept (F08-86); Linux v7.3 dated October 2026, with
  the fallback labelled our reading (F08-21); nvidia-smi 1/6 s to 1 s (F08-30); DCGM 1 Hz, 0.8 "necessary, but not
  sufficient", 0.5 "likely" (F08-32); root on Jetson (F08-37); shared L2/DRAM caveat (F08-38); tegrastats fields
  (F08-40); 2014 Intel paper (F08-1); Ice Lake fixed counter (F08-10); Zen 4 SMT bucket (F08-11).
- Cross-references: section 12, Physics Simulation (CPU physics, one scene on a core); section 22, Our Measurements
  (three stand-ins on three core types across two machines); section 23, Price-Performance and Latency (units per
  price for cloud, per joule/watt for edge, a deadline column). Section 21 no longer references section 20.

Claims checked: about 100. Findings: 1 error, 5 minor.
