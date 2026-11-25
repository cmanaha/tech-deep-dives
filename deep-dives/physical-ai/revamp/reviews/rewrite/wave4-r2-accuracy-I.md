# Accuracy review, wave 4 round 2, reviewer I: sections 20 and 21 (confirming check)

Read from the committed sources with `git show`: section 20 at 13ac6ff, section 21 at 43f3b41 (neither file changed
since; HEAD is now 7db4480). Diffs: 20 `dd443a2..13ac6ff`, 21 `80f8dab..43f3b41`. Rendered text from
`/tmp/pai-rw/w4-r2/20-workloads.txt` and `21-pmu-cards.txt`. Registers: `research/2026-11/*.md`, unchanged since
round 1 except for two entries added at 7db4480 (F08-87, perf multiplexing; F08-88, PyTorch float32 matmul
precision), which neither section cites yet. Earlier findings: `/tmp/pai-rw/review/w4r1/accuracy-E.md`. Every figure
below was recomputed in Python.

## Part 1. Section 20, Fifteen Workloads, Five Shapes: Count the Bottleneck Before You Benchmark (`Workloads.tsx`)

### Earlier findings (accuracy-E, section 20): 15 of 16 resolved, 1 partly resolved

| ID | Status | What the page says now |
|---|---|---|
| E20-1 (the count turns up a CPU-first fact) | PARTLY | The sentence is gone. The CPU-first case now rests on its own evidence: "its documentation says that with several cameras that is 'often the most expensive thing the workers do, and the GPU ends up waiting for data'", the 2.8x owned by Hugging Face, and "With the transforms on the CPU, then, the cores can fill first". The section's own count now says the opposite plainly: "LeRobot's own timing agrees that the GPU is the full part". The body is right; the new h2 title and description drop the "can"/"often" again: see E20-R2-1. |
| E20-2 (three CPU rows, one cause) | RESOLVED | "Three of the CPU rows have one cause" and the "so on them decoding stays on the CPU" are gone, and the h2 description no longer says it. The dataloader row now gives its own cause: "the stock loader decodes on the CPU, and by default the image transforms run per sample in the worker processes on top of it" (F05-39, F05-58). F08-77 survives only as a cite label on the record row and the engine paragraph. |
| E20-3 (3.9 "close to none of the three") | RESOLVED | "The 3.9 sits next to the bandwidth factor of 3.8, yet only 0.4% of the test's X925 cycles stall on memory. The match is a coincidence: a speedup that equals one part's factor proves nothing about which part is full." (57,240 / 14,507 = 3.95; 44.38 / 11.71 = 3.79; F08-61.) |
| E20-4 (grid and evidence disagree on CPU physics) | RESOLVED | Grid row: "first: branches in collision, on the Jetson" and "first: arithmetic, one world per core, on the Spark"; caption: "for CPU physics each is the half that loses most on one machine". Figure `cites` now includes F08-61. |
| E20-5 (Cosmos Curator figure lost its owner) | RESOLVED | "NVIDIA's design notes for Cosmos Curator, its data curation toolkit, record a cancelled run in which fetching the clips held 32 H100s at about 17% aggregate utilisation". The "a GPU waiting on its input" sentence is deleted. The new lead-in raises M20-R2-7. |
| m20-1 (slot widths, front-end caveat) | RESOLVED | "Each share is of that core's own slots, 10 a cycle on the X925 and 6 on the A78AE, so read each core on its own", followed by a sized front-end caveat (see M20-R2-9 for two details). |
| m20-2 ("on the evidence we hold") | RESOLVED | "and on the evidence we hold, no row fills memory latency first". |
| m20-3 (no supply figure for GPU units) | RESOLVED | "The rest depend on a program's instruction mix, which no spec sheet gives: whether it fills a CPU core's front end ... or its back end ..., and which units of a GPU it uses", and "For a GPU's arithmetic against its own memory a count does exist, and it is the roofline" (F08-35). |
| m20-4 ("Plain decoding leaves the GPU full") | RESOLVED | "data loading, preprocessing included, is 0.015 s of that 0.167 s step" (F01-91). |
| m20-5 (2-core worker outside the Toy) | RESOLVED | Inside the Toy: "If that process uses the 2 cores LeRobot's streaming docs give a worker", with "if the batch of 32 is per GPU" added. |
| m20-6 (`mj_step` stages) | RESOLVED | "runs from kinematics and collision detection through the constraint solve to integration" (F06-9). |
| m20-7 ("by our reading" for physics on general units) | RESOLVED | "Which units the arithmetic then fills is, by our reading, the tensor cores for a policy's training and its calls and the general units for batched physics, and a counter would settle it" (F08-42). |
| m20-8 (EFA only across nodes) | RESOLVED | "If pieces on different nodes exchange data at every step, Batch will not run the job on Spot and it belongs on a size with EFA". |
| m20-9 (GiB conversion) | RESOLVED | "so on the figures as printed 24 GB is 22.4 GiB and 40 GB is 37.3 GiB: the pi0 class cannot be counted on to fit an L4 and fits an L40S" (F08-45 rewrite check). |
| m20-10 (PhysX cause of the quote) | RESOLVED | "'can also be dependent on single-core CPU performance', from parts of the PhysX simulation and the main training loop" (F06-65). |
| m20-11 (section 8's lanes) | RESOLVED | New paragraph: "On a pretrained policy it is shape B ... Its actor runs the policy on the robot, which makes it shape E." The learner gets no shape letter, only "no deadline of its own"; that is a gap in placement, not a wrong fact. |

### The points the task singled out

- **Gate count (GR00T N1.7 against the Orin Nano Super).** The facts hold: F01-92 quotes the README, "Inference: 1 GPU
  with 16 GB+ VRAM (e.g., RTX 4090, L40, H100, Jetson AGX Thor/Orin, DGX Spark)", and the register's claim sentence
  reads that list as "Jetson AGX Thor and Orin and DGX Spark", as the page does. F07-36 gives 8 GB, and its use note
  says it is "one pool shared by the CPU and the GPU". In the on-robot row, 16 / 8 = 2 ("twice the Orin Nano Super's
  whole memory") is right and stays scoped to GR00T N1.7. The conclusion in the main paragraph widens to "a policy of
  that class": E20-R2-2.
- **Sized front-end caveat.** 79,584,976 x 4 / 19,922,115,591 = 1.598 points; 12.2 - 1.6 = 10.6; 31.0 - 21.5 = 9.5.
  Widths 10 and 6 match F08-68. The page names the borrowed constant. Two details go past the entries: M20-R2-9.
- **Section 8's lanes.** The pretrained-policy run as shape B: F04-70 gives "one p5en.48xlarge Spot instance (8 H200),
  75 GRPO steps took 31.6 hours of training", one run. No dollar figure is printed. Section 8's table gives the same
  lane "One node for more than a day". The real-arm lane: F04-76 gives the two programs, the actor that "runs the
  policy on the robot", the learner that "does the gradient updates", gRPC, and "without blocking each other". "By
  default it shares the actor's" machine rests on F04-78's `learner_host: str = "127.0.0.1"`, which F04-76's use note
  cites. The takeover gloss is F04-74. All hold.
- **Five-shape table, row by row.** Membership matches F08-78 (A: rows 2, 3, 5, 6, 7, 10, 11, 13; B: 8, 9, plus
  GPU physics inside RL per F08-80; C: 14, 15; D: row 4 as a standing tier and continuous decode; E: 1, 12).
  - Row A, Spot and capacity: "Spot, through a queue that fans the units out and retries the reclaimed ones" matches
    F10-537 ("The runtime for your jobs is typically 30 minutes or less") and F09-10. The engine-build exception
    follows F07-8 ("Build the TensorRT engines on the target device"). The Spot cell drops the retry condition:
    M20-R2-3.
  - Row B: "Open when the run checkpoints every 30 minutes or less" is F09-11. "Spot with checkpoints; On-Demand for
    a run of more than an hour that cannot be interrupted" is F10-537's own pair, nearly word for word. Holds.
  - Row C, Spot: "Closed: Batch runs no multi-node job on Spot, and EC2 lists tightly coupled work among what Spot
    does not suit" gives both reasons exactly (F09-8 rule, F09-95 advice). Capacity: "a fixed window of P or Trainium
    instances, paid up front" is F09-90 ("the fee is charged up front", fixed window) and F09-91 ("P and Trainium types
    only"), offered as "for example". Holds.
  - Row E: "The robot's own computer ... AWS IoT Greengrass, software on the device that receives deployments from
    the cloud (section 18, The Fleet)" is F07-84. Section 18's title in `sections.json` starts "The Fleet". Holds.
- **Row C against row B (the blind reviewer's contradiction).** Ruling: no fact in either cell is wrong, but the
  Yes/No contrast is not carried by the cell text under the page's own definition. See M20-R2-1.
- **Row D, how the capacity is bought (the blind reviewer's gap).** Ruling: as a matter of fact the reviewer is
  right. The cell describes how the capacity is held, not how it is bought, and no register entry names a purchase
  option for shape D. See M20-R2-2.

### Changed sentences checked and holding

- Opening: "wherever the part's supply is printed on a spec sheet or measured once"; F08-50 now cited. Stand-in
  count 390 x 25.2 MB = 9.83 GB/s, 9.83 / 11.71 = 84%, 102 / 11.71 = 8.7 (F08-63, F08-62, F08-66, F07-36). "A loop
  that does nothing but stream" is the triad, and only its throughput is printed, per F08-73's Wave 2 line. 62.3% of
  cycles stalled on memory (F08-62). "102 GB/s for the whole machine" keeps NVIDIA as its owner.
- Second paragraph: "on Spot ... AWS Batch will not run a job whose nodes must run together" (F09-8); "a long run's
  checkpoint interval decides whether Spot suits it at all" (F09-11).
- Parts paragraph: CPU cores per GPU added to the spec-sheet list (F08-57); the hardware-counter gloss. The table's
  SM activity definition matches F08-32 ("The fraction of time at least one warp was active on a multiprocessor").
- Bandwidth expandable: 44.38 / 11.71 = 3.79; 43.95 against 44.38 from cores of 5 and 10 slots (F08-66, F08-68);
  "which NVIDIA lists at 102 GB/s on the Jetson and 273 GB/s on the Spark" (F07-36, F07-47).
- GPU memory: batch-8 peaks 2 to 6, 10 to 16, 24 to 40 GB (F01-90); 22, 44, 80 GiB (F08-45); 24 / 1.0737 = 22.35,
  40 / 1.0737 = 37.25.
- Decode: G6, G6e, G7, G7e, P6; not P4d (A100) or P5 (H100); H200 "not established" (F05-67).
- Network Toy: 4.4 x 8 / 2.5 = 14.08 s; / 700 = 0.050 s; 1 + 14.08 = 15.1 s and 1.05 s, inside the Toy. EFA bypasses
  the operating system (F08-48: "built-in OS-bypass"); 2.5, 20, 700 Gbps and EFA flags (F08-49).
- Supply-range expandable (moved): 268 / 2.79 = 96; 6,400 / 2.5 = 2,560; 6,400 / 8 = 800; 800 / 2.5 = 320; 12,500 /
  125 = 100; 64 / 4 = 16 (F08-45, F08-49, F08-46, F08-57).
- CPU section: 24 vCPUs = 12 cores, g7.48xlarge 24 physical cores per GPU, single-GPU sizes 4 to 64 vCPUs (F08-57);
  5.16 ms, single process, two cameras, torchcodec, unnamed hardware (F05-62); Toy 1000 / 5.16 = 193.8, 32 / 0.167 =
  191.6; the F05-58 quote is verbatim; 2.8x owned by Hugging Face (F05-59); 1 - 1 / 2.8 = 64% as `<Derived>`; the
  two levers (F05-107; F05-58 "have the workers decode only").
- "Which part" paragraph: the four workload glosses (F08-76 rows 9, 10, 11, 13; F07-8 "GPU-architecture-specific");
  nvidia-smi's figure (F08-30) and the ~90% (F01-91); the roofline (F08-35).
- Speedup paragraph: 22.242 / 3.411 = 6.52; 3.79; 291.58 / 123.96 = 2.35; 3.95; MuJoCo 4.0.1 against 3.17.0
  (F08-73 item 6); 0.4% (F08-61); single runs stated.
- Evidence rows: SVT-AV1 and the Orin Nano's missing encoder (F05-35, F05-57: "does not have the NVENC engine");
  CPU physics figures (F08-61) and 286x real time (57,240 x 0.005); MuJoCo Warp 5.77M, 25.2M at 32,768 worlds, 342k at
  2,048 (F06-20), 769, 167, 4.6 and 16, with the new "holds only if both runs filled the card"; Arena 5.41 and 2,390
  on one RTX 5880 Ada, 2,390.22 / 5.41 = 442 (F06-93); Cosmos3-Nano 207.78 s at 720p on an H100 80GB (F05-98);
  Transfer2.5 65.4 GB, 264.13 s on an H100 PCIe, 93 frames, segmentation control (F05-99).
- Shapes text: Spot notice two minutes, best effort (F10-520); SmolVLA 3 to 6 h on one L4 (F01-90), 3 / 0.5 = 6 to
  6 / 0.5 = 12; `Host EC2*`, front of queue, `AWS_BATCH_JOB_ATTEMPT` (F09-10); 149.0 / 33.3 = 4.47; the
  duration-first ordering (F08-78); eight Arena runs, 1,255.2 s and 157.8 s, "a 7.95x speedup" (F06-93).
- Placing paragraph: five supplies; "shape E: it runs beside the arm and cannot be interrupted" (F08-78, F08-79).
- No dollar figure appears in the section.

### Findings

**E20-R2-1 (error). The new h2 title and description state as a rule what the entries give as "often" and the body as
"can", and make a default setting the cause.**
- Sentences: title "The CPU cores beside a GPU fill first when image transforms run on them"; description "Count the
  cores a training GPU needs for its video, see why that count leaves the GPU full, and catch the default setting
  that turns the cores into the bottleneck".
- F05-58: "With several cameras that is often the most expensive thing the workers do, and the GPU ends up waiting
  for data." F05-59: one 2.8x result for ACT, and "The post gives no dataset, camera count, batch size or CPU." F05-84:
  "LeRobot's image transforms are off by default" (`enable: bool = False`). F05-87: once enabled, the default backend
  "dataloader" applies them per sample in the workers. The body keeps the hedge ("they can turn the answer round",
  "the cores can fill first", "it does not say at how many cameras, or for which policy, they start to"). The title
  drops it, and the description names a default as the cause when the default runs no transforms at all.
- Fix: title "The CPU cores beside a GPU can fill first when image transforms run on them"; description "..., and
  catch the default placement of enabled transforms, in the dataloader workers, that can turn the cores into the
  bottleneck".

**E20-R2-2 (error). The gate count widens one model's stated requirement to "a policy of that class".**
- Sentence: "NVIDIA's GR00T N1.7, a policy of 3 billion parameters, needs a GPU with 16 GB or more for inference, and
  its README lists Jetson AGX Thor and Orin and DGX Spark among the devices that qualify. The Jetson Orin Nano Super
  holds 8 GB in all, one memory shared by its CPU and GPU, so a policy of that class is ruled out on it before any
  timing is run."
- F01-92: the 16 GB+ is the Isaac-GR00T README's requirement for GR00T N1.7 alone. No entry gives a memory
  requirement for 3B-parameter policies as a class or for any other policy on the Orin Nano. F07-117 and U5: no
  first-party figure for SmolVLA or ACT on an Orin Nano was located. After "a policy of 3 billion parameters", "that
  class" reads as every policy of that size. F07-36's 8 GB shared pool and the comparison itself hold.
- Fix: "..., so GR00T N1.7 is ruled out on it by its own stated requirement before any timing is run."

**M20-R2-1 (minor; the row C ruling). Row C's "No" and row B's "Yes" name the same loss.**
- Sentences: row C, Interruptibility: "No: a lost node stops the step on every node, back to the last checkpoint";
  row B: "Yes, back to the last checkpoint".
- Ruling: no fact in either cell is wrong. F08-78 (our reading) gives B "interruptible at checkpoints" and C "not
  interruptible without losing the whole step". F09-95 lists work "tightly coupled between instance nodes" as
  unsuitable for Spot, and F09-8 keeps multi-node parallel jobs off Spot. The page, however, defines interruptibility
  as "how much work a stop loses", and both cells give the same loss. What separates C is that one node's stop costs
  every node's work since the checkpoint. That fact is in the cell, but it does not make "No" follow from the page's
  definition. The contradiction the blind reviewer read is in the labels, not in the facts. The Spot column already
  carries the rule.
- Fix: row C "Only as a whole: losing any one node stops the step on every node, and all of them go back to the last
  checkpoint".

**M20-R2-2 (minor; the row D ruling). Row D says how the capacity is held, not how it is bought.**
- Sentence: "A standing fleet kept at its size all day, where the other shapes queue jobs."
- Ruling: the reviewer is right as a matter of fact. Every other row names a purchase option: A and B Spot or
  On-Demand (F10-537), C a Capacity Block (F09-90). Row D names none. F08-80 supports "a standing CPU tier", which is
  how the capacity is held. No register entry ties a purchase option to shape D. F09-51 lists EC2's options
  (On-Demand, Reserved Instances, Compute Savings Plans, Spot) without tying any to a steady load. The only purchase
  fact the page gives for D is the Spot column's "Open per item".
- Fix: "A standing fleet kept at its size all day, where the other shapes queue jobs; Spot is open to it item by item
  (previous column), and no other purchase option for it was located in this research."

**M20-R2-3 (minor). Row A's Spot cell makes Batch's retry unconditional.**
- Sentence: "Open on EC2 for all but the engine build, which runs on the device it targets: a reclaim costs the unit
  in flight, and Batch retries a reclaimed job at the front of its queue"
- F09-10: "if you set the retry parameter, the job is placed at the front of the job queue". The pattern is a retry
  strategy with `evaluateOnExit` on `Host EC2*`. F10-537: "set automated retries ... we recommend that you set at least
  1-3". The paragraph above says "Batch's documented Spot pattern retries"; the cell drops the condition.
- Fix: "..., and with a retry strategy set, Batch retries a reclaimed job at the front of its queue".

**M20-R2-4 (minor). "can use Spot" turns Batch's advice into a capability.**
- Sentences: "A training run's checkpoint interval, a setting in its script, decides whether the run can use Spot."
  The h1 description has the same problem: "... decide whether it can run on Spot".
- F09-11: "We advise against running jobs that take an hour or more when using Amazon EC2 Spot instances". F10-537:
  choose On-Demand when jobs run more than an hour "and you can't tolerate interruptions". This is advice, and the
  same paragraph reports it correctly ("advises against"). The section's own intro words it as "decides whether Spot
  suits it at all".
- Fix: "decides whether Spot suits the run"; h1 "... decide whether Spot suits it".

**M20-R2-5 (minor). "by default" reads as transforms running by default; they are off by default.**
- Sentences: "LeRobot runs them by default in the dataloader workers, one sample at a time, ..." and the dataloader
  row: "by default the image transforms run per sample in the worker processes on top of it."
- F05-84: "LeRobot's image transforms are off by default". F05-87: the default backend "dataloader" applies them per
  sample on the CPU once enabled. F05-58's "By default the transforms run per sample in the DataLoader workers" is
  about where they run, not whether they run.
- Fix: "Once enabled (they are off by default), LeRobot runs them in the dataloader workers, one sample at a time,
  ..."; row: "once enabled, the image transforms run per sample in the worker processes by default".

**M20-R2-6 (minor). "a different setup" asserts what the post does not say.**
- Sentence: "That result comes from a different policy on a different setup, with ACT's own step time."
- F05-59: "The post gives no dataset, camera count, batch size or CPU." Whether its setup differs from the guide's
  4 x H100 run is unknown.
- Fix: "That result comes from a different policy, on a setup the post does not describe, with ACT's own step time."

**M20-R2-7 (minor). "The one large run on record" widens one design note's run.**
- Sentence: "The one large run on record went the other way."
- F05-76, Wave 2: "a design note for the incubating robot captioning recipe records one run ... One aborted run". The
  note's "The one measured run" belongs to that recipe; the page makes it the only large run on record anywhere.
- Fix: "One recorded run went the other way."

**M20-R2-8 (minor). The size-by list leaves out general GPU compute.**
- Sentence: "For the half that is not tensor-core work, the part to size by is CPU cores, GPU memory or a video
  engine, and the largest tensor-core instance buys the wrong part."
- F08-76 row 6 gives GPU-parallel physics "General GPU compute (not tensor cores [our reading])", and the section's
  own grid marks that cell "first".
- Fix: "the part to size by is CPU cores, general GPU compute, GPU memory or a video engine".

**M20-R2-9 (minor). The front-end caveat prints F08-23's illustration as the excess and asserts its direction on the
A78AE.**
- Sentences: "The front-end shares also run high, because our top-down formula counts some cycles lost to
  mispredicted branches as front end. On the X925 the excess is about 1.6 points of the 12.2% (to about 10.6%, using a
  constant borrowed from another Arm core); on the A78AE it is not known, ..."
- F08-23 is tagged "[derived, illustration]": "This is not Arm's X925 formula: it borrows a constant from another core
  and uses BR_MIS_PRED_RETIRED". F08-22 establishes the direction (front end too high, back end unaffected) for the
  X925, A725, V1 and V3 only. The A78AE has no Arm file (F08-16, U08-1). The conditional on the 9.5-point lead also
  assumes the A78AE's back-end share is unaffected, which F08-22 does not cover.
- Fix: "On the X925 an estimate puts the excess at about 1.6 points ... ; on the A78AE, which has no Arm file to
  compare with, it is not known, ..."

**M20-R2-10 (minor). NVIDIA's "can change" becomes "change".**
- Sentence: "NVIDIA's page warns that cameras, policies and scene contents change both throughput and capacity, so the
  rest of the mix has to be timed on your own scene."
- F06-93: "Cameras, policies, scene contents, and physics settings can change both throughput and capacity."
- Fix: "... warns that cameras, policies and scene contents can change both throughput and capacity, ...".

Claims checked: about 120 (every new or changed sentence, cell, caption, header and grid label in the round 2 diff,
plus the sixteen earlier findings). Findings: 12 (2 errors, 10 minor).

## Part 2. Section 21, Reading a Machine: The Counters That Say Which Part Is Full (`PmuCards.tsx`)

### Earlier findings (accuracy-E, section 21): 6 of 6 resolved

| ID | Status | What the page says now |
|---|---|---|
| E21-1 ("memory bound, so more bandwidth helps") | RESOLVED | "waiting on memory, where faster memory helps (more bandwidth if the loads stream, lower latency if each waits for the one before) and a faster core does not". Question 4: "faster memory for the first, a faster core for the second", now citing F08-6 and F08-41. The section's own pointer-chase test is the latency case, and F08-41 separates the two limits. |
| m21-1 (level 1 cannot separate memory from core) | RESOLVED | "Those four percentages, and the second level beneath them, carry the decision." |
| m21-2 (SpeedOfLight shares) | RESOLVED | "Nsight Compute's SpeedOfLight section put the kernel's compute (SM) throughput at 70.49% and its memory throughput at 50.47% ... need not be a share of the chip's peak FLOP/s or of its memory bandwidth." A wording detail remains: M21-R2-1. |
| m21-3 (RT cores "no counter") | RESOLVED | "have no counter we located in these tools' documentation" (F08-36, U08-4). |
| m21-4 ("likely") | RESOLVED | "a tenth of the 0.5 below which NVIDIA says usage is likely ineffective" (F08-32). |
| m21-5 (our-reading label on the tool table) | RESOLVED | The cite now reads "Nsight Systems release notes; the waiting-on-CPU limit is our reading" (F08-39). |

### The points the task singled out

- **Memory-bound definition.** It holds. F08-6: Memory Bound is "stalled due to demand load or store instructions";
  F08-41: bandwidth and latency are "two different limits". The parenthesis names both, so the definition no longer
  contradicts the section's own pointer-chase test (97.6% to 99.0% back-end bound, limited by 124 to 292 ns per load,
  F08-67). "Where the reverse holds" for core bound is refined later in the section, and F08-6 supports the
  refinement: "Core bound means its execution units are busy, or each operation waits for the result of the one
  before".
- **SpeedOfLight definition.** It holds in substance. F08-34: "Throughput metrics return the maximum percentage value
  of their constituent counters"; its use note: "each the maximum over its constituent counters". The conclusion
  (not a share of peak FLOP/s or bandwidth) follows. The register's word is "counters", not "units": M21-R2-1.
- **Scoped X925 verdict.** It holds. "The evidence points at the execution units: in our reading a faster core is the
  likelier help, and a level-2 count is what would rule out faster memory." It is labelled as ours. The level-1 limit
  is F08-73 item 5 and the level-2 split is F08-24 ("backend_core_bound", "backend_mem_bound"). The bound is stated
  as covering "only the cycles it counted": 78,552,977 / 19,922,115,591 = 0.394% of cycles, against 19,958,256,358
  cycles in the slot run (F08-23, F08-70). "Whether a wider core ... would help as well is a further question,
  because core bound covers both execution units that are busy and operations that wait on each other's results" is
  F08-6's two causes.

### Changed sentences checked and holding

- Opening: "faster core, faster memory or different code"; cite label "of which counter shows each machine part"
  (F08-50, our reading).
- Toy paragraph: F08-14 added; 54 / 6 / 15 / 25 unchanged.
- "it began in a 2014 Intel paper, and Intel, AMD and Arm now all sort slots this way" (F08-1; F08-11, whose
  evidence says the AMD event files in the tree "are contributed by AMD"; F08-14).
- Physics-card intro: 36.5% is "the largest of the three losses" (front end 12.2, bad speculation 5.6); 0.4% of cycles
  (F08-61); PMU-card definition; "one counter cannot settle it" kept.
- GPU paragraph: "the CPU shares name a job's bottleneck only when the job is bound by that CPU" (F08-9: "The
  bottleneck is only the real bottleneck if the workload is actually bound by the CPU").
- Slot paragraph: rename unit and "execution bandwidth ... for top-down accounting" (F08-14); STALL_SLOT definition
  (F08-15); the 4-slot cycle in the Toy.
- h2 "Four shares from six counters": the six `TD` events of the run script (F08-60).
- Known-answer test moved: 97.6% to 99.0% on each of three cores (F08-67); "on this test the formula puts a known
  memory wait where it belongs" (F08-69 use note: "a kernel with a known answer landing in the right bucket").
- Intel and AMD expandable: moved unchanged (F08-10, F08-11).
- Width files: Intel (F08-8), Arm (F08-13: "machine-readable files, one per core"), AMD (F08-11).
- Width example: 0.457 x 10 = 4.57; 0.610 x 5 = 3.05; 4.57 / 3.05 = 1.498; 57,240 / 28,662 = 1.997; 1.997 / 1.498 =
  1.333; the advice to record duration and step count is a method note.
- "a width taken from the cookbook is wrong for every Intel core from Ice Lake on": F08-2 "four pipeline slots";
  F08-8 widths 5 from Ice Lake, 6 from Alder Lake and Sapphire Rapids, 8 from Lunar Lake and Arrow Lake.
- N1 and A78AE paragraph moved: F08-56's README row now cited for "the core of Graviton2"; 10.000, 5.000 and 6.000
  (F08-68); no A78AE file (F08-16).
- Flush correction: formula moved out of the expandable (F08-19); V1 at 4 cycles per mispredicted branch (F08-17);
  front end too high and bad speculation too low by c on V1, V3, X925 and A725, back end and retiring matching
  (F08-22); V2 overstating front end by 1 and back end by 3 cycles per mispredict, labelled our arithmetic (F08-18
  formulas). Branch: 256,608,053 x 4 / 7,794,987,434 = 13.17 points; 37.65 to 24.48, 11.91 to 25.08, so the flip holds
  on unrounded inputs (F08-23). Physics: 1.598 points, 12.2 to 10.6, 5.6 to 7.2. "Counting STALL_FRONTEND_FLUSH lets
  Arm's own formula make the correction" (F08-19). Whether the Spark's kernel exposes the event by name is U08-15, and
  the closing paragraph scopes it: "Where the core's file defines them".
- EC2 section moved: the rule (F08-25); the table matches F08-26, "*6a" included; "plan a top-down run on a size with
  full support, Graviton and x86 alike"; fallback (F08-29); SPE and the mesh counters with "certain OSes and kernels"
  quoted (F08-27); G4dn and G5g the only metal GPU families (F08-28).
- GPU section: Nsight Systems as the first reading, our reading (F08-39); tensor cores (F08-36, F08-42); tegrastats
  (F08-40); Detailed Monitoring moved to an expandable, with the field list still unconfirmed (F08-86: "Which GPU
  fields it publishes was not read").
- Nsight Compute: replay (F08-33); 2 x 4096^3 / 8.35 ms = 16,460 GFLOP/s; "in PyTorch" (F08-71); `simt` reading
  labelled ours. "Which precision or PyTorch setting would have sent it there is outside what the run recorded" is
  consistent with F08-88, added after round 2 ("not which setting our run used"). Per-pipeline figures
  (F08-34 ComputeWorkloadAnalysis: "the utilization of each available pipeline"). Shared L2 and memory (F08-38).
- Card SVG: band 1 now carries "perf stat on one core, six slot events" and "Generic Arm formula from Linux perf,
  without the flush correction" (F08-60, F08-21, F08-22). The caption matches the four bands.
- Card questions: Q1's 1.6 points "if the Neoverse V1's constant is borrowed" (F08-23) and the two executions (F08-60);
  Q2's "A share is per slot of one core's width and is never a speed"; Q4 as above; the GPU readings (F08-32, F08-35).
- Closing: the six events, then STALL_FRONTEND_FLUSH and the level-2 events "where the core's file defines them"
  (F08-19, F08-24), and repeated runs (F08-73 item 1).
- Cross-references: section 12, Physics Simulation; section 23, Price-Performance and Latency (both titles match
  `sections.json`).

### Findings

**M21-R2-1 (minor). SpeedOfLight: "units" stands in for the register's "constituent counters".**
- Sentence: "Each is the highest percentage among the units behind it, every unit measured against its own peak, so it
  says how close the busiest unit came to its limit and need not be a share of the chip's peak FLOP/s or of its memory
  bandwidth."
- F08-34: "Throughput metrics return the maximum percentage value of their constituent counters"; SpeedOfLight is
  "throughput of compute and memory as a share of the GPU's maximum". The substance holds. But the guide speaks of
  counters, and two lines after "compute (SM) throughput" a reader can take "units" for SMs, which is not what the
  maximum runs over.
- Fix: "Each is the highest of the percentages its constituent counters report, so it says how close the busiest of
  them came to its limit and need not be a share of the chip's peak FLOP/s or of its memory bandwidth."

**M21-R2-2 (minor). The new h2 turns one pair of single runs into a rule.**
- Sentence: "A wider core does more work at a lower share"
- F08-61: one run per core. The A725 retires 61.0% of 5 slots and the X925 45.7% of 10, which is 3.05 against 4.57
  kept slots per cycle. The body states it for this pair ("the lower share is more kept work per cycle"); the title
  states it for wider cores in general.
- Fix: "A wider core can do more work at a lower share".

**M21-R2-3 (minor). The branch estimate no longer says it mixes two executions.**
- Sentence: "Taking c from the V1's 4 cycles per mispredicted branch moves 13.2 points between them, to about 24.5% and
  about 25.1%, and bad speculation becomes the larger of the two."
- F08-23 takes `b_br_mis_pred_retired` and `b_cpu_cycles` from the detail run. F08-60: "ratios that mix the two (for
  example mispredicts per cycle against front-end slots) compare two runs." Round 1 covered both estimates with one
  disclosure. Round 2 puts the branch estimate first and discloses the second execution only for the physics step.
- Fix: "Taking c from the V1's 4 cycles per mispredicted branch, with the mispredicts counted in a second execution of
  the program, moves 13.2 points between them, ...".

**M21-R2-4 (minor). "as in our pass on a DGX Spark, it must run as root" extends the Jetson rule to the Spark.**
- Sentence: "Nsight Compute profiles one kernel at a time and replays it ..., so a full profile costs run time, and on
  a Jetson, as in our pass on a DGX Spark, it must run as root."
- F08-37: "On mobile platforms, profile as root/using sudo. On other platforms, you can either start profiling as
  root/using sudo, or by enabling non-admin profiling." F08-71: our pass "needs root (`sudo -n ...`); without it,
  ERR_NVGPUCTRPERM". No entry says whether the Spark counts as a mobile platform or allows non-admin profiling. Round 1
  said "the profile needed root on the Spark too".
- Fix: "and on a Jetson it must run as root; our pass on the DGX Spark needed root as well."

Claims checked: about 90 (every new, changed or moved sentence, formula, cite label, card label, caption and header
in the round 2 diff, plus the six earlier findings). Findings: 4 (0 errors, 4 minor).
