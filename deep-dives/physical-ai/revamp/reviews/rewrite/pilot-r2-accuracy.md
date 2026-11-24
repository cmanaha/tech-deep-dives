# Accuracy review, round 2: sections 1 to 4 (Physical AI deep dive)

Checked: the current rendered text (`/tmp/pai-rw/after-r2/`) against the round 1 rendered text
(`/tmp/pai-rw/after-r1/`), the section sources in `src/sections/`, the registers in `research/2026-11/`
(claim, verbatim quote, "Use in dive", Wave 2 / Wave 3 / wave5 rows for each ID) and `src/data/registry.json`.
Round 1 findings are the ones in `revamp/reviews/rewrite/pilot-r1-accuracy.md`. No web requests were made. No
dollar figure is printed in any of the four sections. Severity: `error` = wrong, unsupported, or a qualifier
lost; `minor` = imprecise but not misleading.

| Section | Round 1 findings | Closed | Partly | Open | Claims checked (r2) | New findings | error | minor |
|---|---|---|---|---|---|---|---|---|
| 1 one-loop | 9 | 9 | 0 | 0 | about 95 | 8 | 1 | 7 |
| 2 getting-started | 2 | 2 | 0 | 0 | about 70 | 6 | 1 | 5 |
| 3 robot-computer | 16 | 15 | 1 | 0 | about 105 | 3 | 0 | 3 |
| 4 demonstrations | 15 | 14 | 1 | 0 | about 60 | 4 | 1 | 3 |

The three errors:

1. Section 1: "Section 20 ... does the count for every row, and section 21 ... confirms it on the processor's
   counters." Section 20 does the demand-against-supply count for one case (the stand-in); section 21 holds no
   counters for the stand-in or for the rows.
2. Section 2: "section 20, Fifteen Workloads, Five Shapes, does it for every job in the loop". Same
   cross-reference, same gap.
3. Section 4: "The time of one call ... has to stay under half the duration of the actions it plays, or the next
   call cannot finish before the arm runs out". Our derivation (F07-22, `[derived]`) printed as the cited guide's
   rule, and on the wrong quantity (the entry's rule is on the predicted chunk).

---

## Section 1: one-loop (OneLoop.tsx)

The section was rewritten again (24 KB to 17.5 KB of rendered text). Checked in full, sentence by sentence,
including the table of fifteen workloads against F08-76 (rows 1 to 15) and F08-78 (shape membership). All 24
cited IDs exist in the registers and in `registry.json`.

### Round 1 findings

| R1 | Status | Current text |
|---|---|---|
| M1 "most of its gain" (F08-62, F08-63) | CLOSED | "Faster arithmetic would leave the 62.3% of cycles that wait on memory where they are (our reading), so the figure to read on a machine for this job is GB/s." |
| M2 runtime and statistic of 149.0 ms (F07-5) | CLOSED | "NVIDIA reports a median of 149.0 ms for one call of its GR00T N1.7 policy on a Jetson Orin with TensorRT, the fastest runtime in its table for that device, which is 4.5 of those periods." The second use of the figure is gone ("NVIDIA's benchmarked call returns 40"). |
| M3 ray-tracing cores for any renderer (F08-76 row 7) | CLOSED | "GPU memory first, then the ray-tracing cores when an RTX renderer draws them." |
| M4 "training-class cards" (F06-52) | CLOSED | "need a GPU that has RT (ray-tracing) cores, and the A100 and the H100 lack them" |
| M5 sim-to-real as a result (F06-66, F06-30) | CLOSED | Sentence deleted; neither ID is cited any more. |
| M6 who builds the frozen pieces (F04-2) | CLOSED | Sentence deleted. |
| M7 one comparison as a property (F03-25) | CLOSED | Sentence deleted. |
| M8 limits sentence (F08-73) | CLOSED | Sentence deleted. The scope it carried survives in "We ran it once, in NumPy, on one Cortex-A78AE core", "it stands in for a policy, and the arm's own runs on a GPU", the "single run" badge and "in our run on the Jetson core". |
| M9 "the joints" for state plus action (F01-86) | CLOSED | Sentence moved to section 2: "the readings and targets come to 1,440 bytes per second". |

### New findings: error

**E1. Cross-reference: sections 20 and 21 do not hold what the sentence says (new sentence in r2).**
- Sentence: "Section 20, Fifteen Workloads, Five Shapes, does the count for every row, and section 21, Reading a Machine, confirms it on the processor's counters."
- Section 20 (`Workloads.tsx`, rendered `20-workloads.txt`): the block "Which part each workload fills first"
  names the part for every row "with the figure an earlier section printed for it". The count the paragraph
  describes (one unit's bytes times units per second, against supply) is done once, for the stand-in: "The
  cleanest case we own is a stand-in for a policy ... 390 x 25.2 MB = 9.8 GB/s".
- Section 21 (`PmuCards.tsx`) teaches the counter method on one sample card, a MuJoCo physics step on a DGX Spark
  core. It has no counters for the policy stand-in (62.3% appears in sections 20 and 22) and none per row.
- Round 1 wording was "Section 20 ... does both for all fifteen" (part and shape), which held.
- Fix: "Section 20 names the part for every row with the figure behind it, and section 21, Reading a Machine,
  shows how to confirm a part on the processor's counters."

### New findings: minor

**N1. The stand-in's result is assigned to the arm's policy job (F08-76 row 12, F08-62 limit).**
- Sentence: "One arm, two jobs: the first wants memory bandwidth on a machine it never loses, the second wants many small machines it can afford to lose."
- "The first" is "The policy on the arm". F08-76 row 12: "GPU tensor cores on a machine whose CPU and GPU share
  one memory; memory bandwidth is the shared part". F08-62 limit: "this is not ACT and not a VLA; it is a dense
  layer stack ... on the CPU, where real policies run convolutions and attention on the GPU". The sentence was in
  round 1 too, but round 1 also had "The figures stay with the stand-in", now deleted.
- Fix: "the first is sized by a deadline on a machine it never loses".

**N2. "Every other job" against the table's own row 1 (F08-78, F08-79).**
- Sentence: "So this job is measured in milliseconds per call where every other job in the loop is measured in throughput, and the computer beside the arm is sized for the deadline."
- F08-79: "shape E has a deadline per unit ... where every other shape has only a throughput". F08-78: shape E is
  "rows 1, 12". The table in this section gives workload 1 the shape "On the arm's clock" and says such a job
  "has a deadline on every unit".
- Fix: "where the jobs of every other shape are measured in throughput".

**N3. "Does not wait" against the default backend (F01-87).**
- Sentence: "The arm takes a new target 30 times a second, one every 33.3 ms, and it does not wait for a slow answer."
- F01-87: "With the default synchronous backend the arm stops while the model thinks"; quote "with a synchronous
  rollout the robot stops moving every time the policy computes its next chunk of actions". Section 2 states this
  correctly. Also 30 a second is LeRobot's recording default (F01-28); "by default" is missing here (the same
  point as round 1's section 3 M13). Unchanged from round 1, not raised then.
- Fix: "By default the arm takes a new target 30 times a second, one every 33.3 ms, and the clock does not slow for a late answer."

**N4. Condition dropped from the chunk answer (F01-87, F01-74).**
- Sentence: "Can the model I trained drive the arm in time? A call several periods long can, because each call returns many actions and the arm plays them while the next call computes: NVIDIA's benchmarked call returns 40 (section 17, Running on the Robot)."
- F01-87: the asynchronous backends "only work if the buffered actions outlast the inference time"; with the
  default synchronous backend the arm stops. F01-74 supports the 40 and the owner is kept. Section 2 carries the
  condition; this answer does not.
- Fix: add "provided the actions it holds outlast the call".

**N5. A flat cause where the entry says "often" (F08-77, F08-76 row 8).**
- Sentence: "Why is my GPU idle during training? The cores that decode the video are full before the GPU is (section 10, Processing and Curating)."
- F08-77: "the first part to saturate is often a CPU core". F08-76 row 8: data loading was 0.011 to 0.015 s of a
  0.167 to 2.548 s step in LeRobot's own timing, "unless row 4 starves it". Section 2 works a case where one core
  feeds four GPUs. The same section says it correctly earlier: "the first thing to check".
- Fix: "Check first whether the cores that decode the video are full before the GPU is".

**N6. Conditions of the 199 dropped, and the citation label credits the wrong formula (F06-97).**
- Sentence: "telling a true 80% from 90% takes about 199 trials per policy (section 16, Evaluation)." with the label "our arithmetic, with the formulas of LeRobot eval_stats.py".
- F06-97: "with 80% power at the 5% level takes about 199 trials per policy"; "The sample-size figure uses the
  standard two-proportion normal approximation, which is not in the LeRobot file". Section 16 does hold the
  figure, with both conditions.
- Fix: add "at 80% power and the 5% level"; label the 199 as the standard two-proportion approximation.

**N7. "Our reading" dropped from the figure caption; one tag is the second part to fill (F08-76 row 7).**
- Caption: "Each tag is the part that fills first in that stage's commonest workloads. Illustrative, not measured."
- Round 1 caption: "in our reading of the sources behind the table in section 20". F08-76 is `[our reading]`.
  Stage 4 carries the tag "GPU ray-tracing cores"; row 7 reads "GPU memory capacity first, then the rendering
  path: RT cores for RTX renderers".
- Fix: restore "in our reading"; tag stage 4 "GPU memory" or say "fills first or next".

### Checked and found supported (no finding)

- **Opening:** six motors (F01-8); wrist and overhead camera (F01-30, within the Wave 2 wording); "about
  fifteen" (F08-75); "the part that fills first is often a CPU core, on a machine bought for its GPU" (F08-77,
  "often" kept).
- **Stand-in paragraph:** six 1024x1024 float32 matrices, 25.2 MB (6 x 1024 x 1024 x 4 = 25,165,824 bytes), more
  than the caches hold (Jetson L3 2M, 4M total); one run, NumPy, one Cortex-A78AE core; 390 per second;
  390 x 25.2 MB = 9.8 GB/s; 9.25 GB/s read and 11.71 GB/s triad as "that core's measured memory limits" (the
  wording of F08-63); 9.8 / 11.71 = 0.837, 84%; 62.3% of cycles stalled (F08-62). The triad kernel's own stall
  split, which F08-73 Wave 2 forbids, is not printed.
- **Deadline and episodes:** 1 / 30 = 33.3 ms; 149.0 / 33.3 = 4.47; 149.0 is the lowest figure in the Orin row
  (357.9, 224.3, 149.0) (F07-5); 500 episodes as one array job, children read their index (F09-5, the register's
  own worked example); two-minute notice, best effort (F10-520, F09-95); retried job to the front of the queue
  (F09-10).
- **Three properties:** duration, coupling, interruptibility as F08-78 defines them.
- **Table of fifteen, column "the part it fills first", against F08-76:** rows 1 to 15 each match the entry's
  "Part loaded first" and mechanism (software encoder; decode engines "where the card decodes that format";
  small models share a card; worker processes; one core per scene with data-dependent branches; general GPU
  compute with one CPU core feeding it, not tensor cores; GPU memory then RT cores for RTX renderers; GPU memory
  as the gate "unless workload 4 starves the trainer"; "lightly"; the mix of physics, cameras and inference; the
  device's own GPU and CPU for minutes; shared memory; tens of GB and minutes per clip; tensor cores across
  machines, network and storage).
- **Table of fifteen, column "its shape", against F08-78:** fan-out for 2, 3, 5, 6, 7, 10, 11, 13 (shape A's
  eight rows); one node for hours for 8, 9; many nodes as one for 14, 15; on the arm's clock for 1, 12; row 4
  "inside the training job it feeds; always on when run as a tier of its own" (F08-76 row 4 "inside 8", F08-78
  shape D). The descriptions of 14 and 15 match "that row 8 starts from" and "that rows 9 and 13 start from".
- **Shape paragraph:** what each shape loses (F08-78, F08-79); workloads 1 to 12 on a desk machine or one EC2
  instance, the last three at vendor scale (F08-75); "The split into fifteen and the sorting by shape are ours".
  "Split every stage that way and the loop is the fifteen rows" is loose against F08-75 (twelve from splitting
  plus three added), but the next paragraph states the twelve and the three.
- **AV1 paragraph:** AV1 by default, written and read by CPU code, H100 cannot hardware-decode it (F08-77,
  F05-47, "EC2 P5"); 192 / 8 = 24 vCPUs, 12 physical cores, "on most eight-GPU sizes" (F08-57; the g7 and p4d
  exceptions are covered by "most").
- **Isaac Sim quote** verbatim (F06-52). **Batch quote** "30 minutes or less" (F09-11). **One workload, two
  shapes** (F08-80). **Spot quote** "tightly coupled between instance nodes" verbatim (F09-95).
- **Evaluation answer:** 40 in 50 against 45 in 50 not distinguishable (F06-97, Fisher p = 0.26).
- **Cross-references that hold:** section 17 (40-action chunk), section 10 (decode bounding a run), sections 12
  and 13 (one scene on a CPU core; RT cores), section 16 (199 trials), sections 24 to 29 (title of 24 matches),
  section 20 "argues both row by row" (the fifteen and the shapes). Titles match `revamp/tools/sections.json`.

Claims checked: about 95. Round 1: 9 of 9 closed. New findings: 8 (1 error, 7 minor).

---

## Section 2: getting-started (GettingStarted.tsx)

Almost every sentence is new against round 1, and twelve register IDs are new to the section (F01-86, F01-87,
F01-91, F05-29, F05-58, F05-62, F07-8, F07-23, F08-30, F08-84, F08-85, F09-82). Checked in full, including the
four worked blocks against their entries. All 16 cited IDs exist in the registers and in `registry.json`.

### Round 1 findings

| R1 | Status | Current text |
|---|---|---|
| M1 runtime of the vendor benchmark (F01-74) | CLOSED | "NVIDIA's benchmark of one policy call reports, with TensorRT, its inference compiler, a median of 22.9 ms on an H100, a data-centre GPU, and 149.0 ms on a Jetson Orin" |
| M2 "nearly every part has a counter" (F08-50) | CLOSED | Sentence deleted, with the ray-tracing-core sentence (F08-36 is no longer cited). |

### New findings: error

**E1. Cross-reference: section 20 does one count, not one per job (new sentence in r2).**
- Sentence: "Section 1 counts one case by hand, section 20, Fifteen Workloads, Five Shapes, does it for every job in the loop, and the Silicon, Memory & Inference dive covers how a GPU and the memory hierarchy execute a model."
- Section 20 does the demand-against-supply count for the same single case as section 1 (the stand-in) and, for
  the other rows, names the part "with the figure an earlier section printed for it". See section 1, E1.
- Round 1 wording: "Section 20 works out which part each workload fills from demand and supply."
- Fix: "section 20 names the part for every job in the loop".

### New findings: minor

**N1. "The ratio survives compression" (F05-29, F01-86).**
- Sentence: "The ratio survives compression."
- The ratio just stated is 38,400. In the dataset cited next, video is 45.5 + 40.1 = 85.6 MB against 0.37 MB of
  rows: 85,666,122 / 369,943 = 232 to 1. Video is still 99.5% of the bytes, so the heading holds; the ratio falls
  by a factor of about 166.
- Fix: "The imbalance survives compression: video is still about 230 times the rows (our arithmetic)."

**N2. Qualifiers of the quoted sentence dropped (F05-58).**
- Sentence: "With image transforms applied per sample, LeRobot's documentation says, "the GPU ends up waiting for data": the full part is now the CPU cores, and a faster GPU would train no faster."
- Quote in the entry: "By default the transforms run per sample in the DataLoader workers. With several cameras
  that is often the most expensive thing the workers do, and the GPU ends up waiting for data." "With several
  cameras" and "often" are gone, and "the full part is now the CPU cores" is stated flat. "Change one setting"
  also sits oddly with "By default".
- Fix: "With several cameras and image transforms applied per sample, LeRobot's documentation says, that "is often the most expensive thing the workers do, and the GPU ends up waiting for data"".

**N3. Two tables of the AWS post joined into "one run" (F09-82).**
- Sentence: "an AWS post reports 3.4 hours on one GPU and a peak of 41.5 GB of GPU memory for one run that adapted it to 75 SO-101 episodes over 20,000 steps at batch 32, with the model's backbone frozen."
- F09-82: the 3.4 h comes from "the 20,000-step timing table" (row "GR00T N1.7 | Standard | ml.g7e.2xlarge | 32 |
  3.4 h"); the 41.5 GB and "backbone frozen" come from "the GPU memory table" ("GR00T N1.7 (projector and
  diffusion head, backbone frozen) 41.5 GB at batch 32"). Both are at batch 32; the entry does not say the timed
  row is the frozen-backbone configuration. Owner, batch size and dataset are kept as Wave 2 asks.
- Fix: "reports 3.4 hours on one GPU for one run ... at batch 32, and in its memory table a peak of 41.5 GB at the same batch with the backbone frozen".

**N4. Hidden assumption in our arithmetic (F01-91, F05-62).**
- Sentence: "LeRobot's hardware guide times one of its policies, Diffusion Policy, at 0.167 s per update at batch 32 on 4 H100 GPUs, which is 32 / 0.167 = 192 samples a second."
- 32 / 0.167 = 191.6 is right if 32 is the batch across all four GPUs. F01-91 says "on 4 x H100 80 GB at batch
  32" and does not say whether 32 is per GPU or in total. If it is per GPU the demand is 4 x 192 = 766 samples a
  second and "about one CPU core keeps four GPUs fed" becomes about four cores (766 x 5 ms = 3.8 s per second).
  The conclusion "the GPUs are the full part" stands either way (data loading 0.015 s of a 0.167 s step,
  F01-91). The 5 ms is also the PR's median for a single item with a warm file cache (F05-62), conditions the
  sentence leaves out. The label "our arithmetic from the two sources" is present.
- Fix: read the guide's table note for the batch convention and state it; add "median, warm cache" to the 5 ms.

**N5. A documentation sample read as a machine's result (F07-23).**
- Sentence: "A machine that fits the mean with room to spare still missed the period on 1.0% of its ticks."
- F07-23: "These are the doc's illustrative figures, with no hardware named"; "The example's stage figures are a
  doc sample, not a benchmark; label them as such." The paragraph does label it two sentences earlier ("prints a
  sample of its own timing report at 30 Hz, with no hardware named"), so the scope is kept; this sentence then
  speaks of "a machine".
- Fix: "In that sample, a loop that fits the mean with room to spare still ran over the period on 1.0% of its ticks."

### Checked and found supported (no finding)

- **Block 1 (deadline):** observation and action shapes (F01-26); 30 ticks a second "by default", 33.3 ms
  (F01-28); mean tick 18.7 ms, mean policy call 5.18 ms, worst cycle 48.1 ms, worst policy call 40.00 ms, and
  the quote "cycles over the 33.3 ms work budget: 12/1197 (1.0%)" verbatim (F07-23); medians only, no figure
  for the slowest calls in NVIDIA's benchmark or in our runs (F08-84: "No p99 exists in either"); the
  synchronous-rollout quote verbatim (F01-87); section 3 turns the delay into a distance (8.3 mm per tick there).
- **Block 2 (data):** six float32 each (F01-26); (6 + 6) x 4 x 30 = 1,440 bytes per second; 2 x 30 x 921,600 =
  55,296,000, "of raw pixels"; ratio 38,400 (F01-86); 86.1 MB, 11,939 frames, 45.5 MB and 40.1 MB, 0.37 MB,
  "named for the SO-101" as the Wave 3 correction asks, AV1 (F05-29); 50 episodes, up to 60 s, 60 s reset,
  50 x (60 + 60) s = 6,000 s = 100 minutes, with "up to" (F01-28). Sections 9 and 10 hold what the pointer says.
- **Block 3 (sized twice):** 3.4 hours, 41.5 GB, 75 episodes, 20,000 steps, batch 32, "an AWS post reports"
  (F09-82, see N3); 22.9 ms and 149.0 ms medians with TensorRT and "NVIDIA's benchmark" (F01-74); 22.9 < 33.3
  and 149.0 / 33.3 = 4.5; 357.9 ms in PyTorch on the same Orin, "NVIDIA's table gives" (F01-74, F07-5); built on
  the target device, about 2 to 5 minutes, rebuilt for a different GPU (F07-8); 40 actions per benchmarked call
  (F01-74); the quote "enough usable action playback to cover inference latency and its variation" verbatim
  (F01-87); section 17 holds the 40-action chunk.
- **Block 4 (one part at a time):** the parts list, with "our reading" (F08-50); 0.167 s per update, batch 32,
  4 H100, attributed to LeRobot's hardware guide (F01-91); "A LeRobot pull request measured about 5 ms ... on
  hardware it does not state" (F05-62, owner and the hardware gap kept); 192 x 5 ms = 0.96 s; the nvidia-smi
  definition (F08-30); "decoding belongs on CPU instances, or on the GPU instance with the most cores per GPU"
  (F08-85; no family is named, so the Wave 2 correction on the G7 superlative does not bite).
- **Routes:** 8, 13 and 12 sections as the figure marks them (W on 1, 2, 3, 4, 6, 7, 16, 22; P on 1, 2, 3, 9 to
  18; C on 1, 2, 20 to 29); 30 sections; sections 5, 8 and 19 on no route, each described correctly; the JEPA
  gloss; "Learning From Feedback" and "Silicon, Memory & Inference" are the titles of the two sibling dives
  (`rl-agentic-loops`, `silicon-memory-inference`). Section titles match `sections.json`.

Claims checked: about 70. Round 1: 2 of 2 closed. New findings: 6 (1 error, 5 minor).

---

## Section 3: robot-computer (RobotAsComputer.tsx)

Checked against `research/2026-11/01-robot-basics.md`, the register 01 rows of `wave2-A.md`, F08-78 and F08-79
in `08-compute-shapes.md`, the Cite IDs in the source, and `registry.json`. Round 1 closures, plus every
sentence that changed between the two rendered texts (about 290 changed lines).

### Round 1 findings

| R1 | Status | Current text |
|---|---|---|
| E1 stale chunk actions (F01-83, F01-87) | CLOSED | "What remains is the distance: the arm has travelled for the whole of the delay by the time the first action of a new chunk is played." The block clause is gone and the arm is the thing that moves. |
| E2 bench symptom for the servo protections (F01-47) | CLOSED | Sentence deleted. |
| E3 "every SO-101 example" (F01-30, wave2-A row 17) | CLOSED | "The code sets no default resolution; the documentation's advice and the SO-101 tutorial use 640x480 pixels at 30 frames per second." |
| M1 protection list (F01-47) | CLOSED | "The datasheet lists four triggers for it: 2 s blocked at more than 80% of stall torque, 2 s drawing more than 2 A, a supply outside 4 V to 7.4 V, and a temperature over 70 degrees C." |
| M2 "most of a tick" (F01-38) | CLOSED | "Most of a tick's work is reading sensors." |
| M3 conversion (F01-53) | CLOSED | "What the person's hand asked for is stored as six target angles, so for a model that outputs joint targets, LeRobot's default, a demonstration needs no conversion before training (section 4, Learning From Demonstrations)." F01-53 is now cited. |
| M4 single data line (F01-44) | CLOSED | `<Cite id="F01-44">` added after "The six share one serial bus, a single data line to the host on which each servo answers by its ID." |
| M5 flat sentence on the other registers (F01-46) | CLOSED | "The other registers would be a crude stand-in for force at best: the load figure is the duty cycle of the motor drive, on the far side of a 1/345 gearbox from the joint." The entry's own wording. |
| M6 rate decides placement (F01-73) | CLOSED | "On the humanoid only the slowest of the four leaves the robot: everything but the reasoning model runs onboard, by NVIDIA's account." The causal clause is gone. |
| M7 50 ms timeout as scale (F01-25) | CLOSED | Sentence and citation deleted. |
| M8 "rarely" (F01-87) | CLOSED | "In this example the buffer is not what runs out." |
| M9 registry link for pi0.7 (F01-59) | PARTLY | The label now reads "pi0.5 and pi0.7 papers, control mode", but `registry.json` still maps F01-59 only to `https://arxiv.org/abs/2504.16054v1` (pi0.5). The sentence is about pi0.7 (2604.15483v2). Registry matter. |
| M10 "optimised" (F01-73) | CLOSED | "124 ms per optimised prediction on the robot's onboard computer" |
| M11 frame age and "worst case" (F01-85) | CLOSED | "Take the longest value of the two waits, NVIDIA's median for the call, and the model on the Thor beside the arm, so no network"; the left-out list now names "camera exposure, transfer and decoding". See N2. |
| M12 "only" (F01-41) | CLOSED | "so the host needs no GPU and keeps the cameras and the motors." |
| M13 "by default" (F01-28) | CLOSED | "and by default the exchange repeats 30 times a second, once every 33.3 ms." |

### New findings: minor

**N1. Three "our reading" labels present in round 1 were removed; the register marks each `[our reading]`.**
- "The servos also hold speed, load and current registers, but the driver reads position only, so a model driving this arm gets positions and pixels and no measure of how hard the arm is pushing." F01-23: "'No velocity, load or current' is [our reading] of `get_observation()` reading only `Present_Position`". Round 1 had "in our reading of the driver".
- "one rides on the arm and sees what is between the fingers, the other is fixed over the scene." F01-31: "What each camera looks at is [our reading] of the names and of the mounts in F01-7". Round 1 had "In our reading of the names and the mounts". The sentence sits ahead of the Tier 1 tutorial citation.
- "A loose object has six, three of position and three of orientation, so five joints cannot reach every position at every angle." F01-52: "[our reading, general kinematics, no source fetched]". Round 1 had "in our reading of general kinematics". Textbook kinematics, and it now sits after the citations: the weakest of the three.
- Not misleading in any case: the code reads only `Present_Position`, and the entries' claims state the placement.
- Fix: restore "in our reading" on the first two.

**N2. "Floor" follows a sum built from maxima (F01-85, F01-83).**
- Sentence: "Treat the sum as a floor."
- The 143.4 ms is built from "the longest value of the two waits" (33.3 + 33.3) plus NVIDIA's median. F01-85
  gives the frame age as "between 0 and 33.3 ms", so the counted terms can come to as little as 76.8 ms. The sum
  is a floor only for the terms it leaves out. Round 1's "The real delay is longer than the sum" had the same weakness.
- Fix: "The real chain adds terms the sum leaves out: camera exposure, ...".

**N3. "The one job" against the register's two rows on the robot's clock (F08-78, F08-79).**
- Sentence: "The policy is the one job around the arm that is sized by a deadline; the others are sized by throughput."
- F08-78: "E: tied to the robot's clock, not interruptible (rows 1, 12)". Row 1 is record-and-encode, and this
  section says the recording loop overruns the same 33.3 ms period. No ID is cited for the sentence now; round 1
  pointed at section 20. Same point as section 1, N2.
- Fix: "The policy is the model-serving job that is sized by a deadline; the training-side jobs are sized by throughput", or restore the section 20 pointer.

### Checked and found supported (changed sentences)

- **Lede and opening:** "twelve numbers ... on a 30 Hz clock" (F01-26, F01-28); "1,440 bytes per second of
  measured and target angles" (F01-86, "state plus action"); "at an illustrative 0.25 m/s" keeps the label
  (F01-83, wave2-A row 46).
- **Teleoperation:** "The standard SO-101 setup is two arms" (F01-2); leader motors off, read and handed over as
  targets (F01-24, code behaviour). The slogan the register labels as our reading is gone.
- **Degrees of freedom:** five joints plus gripper (F01-8, F01-52). **Units:** "under the same key name"
  (F01-18, F01-19).
- **Arithmetic redone:** 6 x 4 = 24 bytes; 640 x 480 x 3 = 921,600; 2 x 30 x 921,600 = 55,296,000 with "of raw
  frames in memory" kept; (6 + 6) x 4 x 30 = 1,440; 60 x 55,296,000 = 3.32 GB; 50 / 30 = 1.67 s; 149 / 33.3 =
  4.5; 33.3 + 76.8 + 0 + 33.3 = 143.4 ms = 4.3 ticks = 35.9 mm; 0.010 / 0.25 = 40 ms; 22.9 and 149.0 ms are 1 and
  5 ticks at 30 Hz.
- **Action space:** F01-53 and F01-55 definitions and defaults; "NVIDIA's README describes ... as deltas" and
  "credits it for transfer" keep the owner (F01-60); "The authors of ... pi0.7 ... found no noticeable gain"
  keeps the owner (F01-59); "(Both angles are made up.)" with the Toy marker.
- **Servo:** goal angle (F01-14); no force mode (F01-15); gripper caps 50%, 50%, 25% and "to avoid burnout"
  (F01-17). The F01-45 "rate not stated" sentence left the PID paragraph, but the table cell "rate not stated in
  the documents read" still carries it with its scope.
- **Ladder:** "Played to its end at 30 Hz" keeps the wave2-A row 44 condition; the interpolation paragraph
  (F01-39) was deleted and nothing left depends on it; the Figure rows follow the wave2-A row 36 wording (Helix
  02 on 2026-01-27; Helix 2.5, posted 2026-09-17, states no rate).
- **Delay:** "a modest working pace chosen for the arithmetic; no one measured it" and "(a made-up tolerance)"
  keep both illustration labels; "the 76.8 ms median NVIDIA reports" keeps owner and statistic; "A local network
  added 10 to 20 ms in the setup of the real-time chunking paper" keeps the owner (F01-80); TensorRT against
  106.8 ms PyTorch (F01-74); "the sources read on 2026-11-20 give a figure for none of them" keeps the scope of
  F01-85's note; the chunk example lost "By our arithmetic" in the sentence but its citation is still
  `kind="derived"`.
- **Cross-references:** sections 4, 5, 9, 10 and 17 hold as in round 1. The section 20 pointer was removed (N3).

Claims checked: about 105. Round 1: 15 of 16 closed, 1 partly (M9). New findings: 3 (0 error, 3 minor).

---

## Section 4: demonstrations (LearningFromDemonstrations.tsx)

Checked against `02-imitation-and-vla.md` (F02-5 to F02-29, F02-49, F02-67, F02-68), F07-22 in
`07-edge-and-fleet.md` (new to the section), the `wave2-A.md` rows for those IDs and `registry.json`. Round 1
closures, plus every sentence that changed between the two rendered texts (about 60 changed sentences).

### Round 1 findings

| R1 | Status | Current text |
|---|---|---|
| E1 "every current policy is built from both" | CLOSED | "Two changes contained it. Every policy described here is built on the first, and most of them on the second." ACT, Diffusion Policy, pi0, the FAST token model and OpenVLA-OFT all chunk; OpenVLA-OFT does not sample. |
| E2 cause assigned to ACT's taper (F02-6, F02-15) | CLOSED | "The ACT authors give no reason for the taper; the Diffusion Policy authors, who measured the same trade, name slow reaction time." `<Cite id="F02-15">` added. See N3 on the scope of "give no reason". |
| E3 derivation inside an "authors report" sentence (F02-26) | CLOSED | "for this arm's 6 numbers over a chunk of 50 actions, 6 x 50 = 300 tokens by our count." and "The authors report about 30 tokens per chunk per arm. Against our count of 300 for this arm that is 300 / 30 = 10 times fewer." |
| M1 bench symptom without the label (F02-2) | CLOSED | "How each failure looks at the bench is our reading of its mechanism, here and in the closing table: this one is a smooth, confident reach that closes the gripper beside the block." |
| M2 "more often late in the episode" | CLOSED | Cell is now "A smooth reach that closes beside the block". The column head is "What you would see"; the label the table's lead-in carried in round 1 now sits in the M1 sentence ("here and in the closing table"). |
| M3 "ten times the paper's" (F02-16, F02-17) | CLOSED | "the default can be ten times what the paper ran for its 0.1 s real-robot figure." |
| M4 condition of the 73 ms figure (F02-21) | CLOSED | "For pi0 its authors report 73 ms per call on an RTX 4090 with 3 cameras" |
| M5 15% against 75% on two schedules (F02-27, F02-22) | CLOSED | The 75% sentence is deleted. What remains is pi0's own 146 ms per second, about 15%, and "the token model's 750 ms is 188 mm (0.25 x 0.75)". |
| M6 "Predicting long keeps the motion coherent" (F02-15) | CLOSED | Sentence deleted. |
| M7 "Announcements" (F02-29) | CLOSED | "Configuration files call flow steps denoising steps too" |
| M8 qualifier on the OpenVLA-OFT figure (F02-68) | CLOSED | "report average success across the four task suites of LIBERO, a simulated manipulation benchmark, rising from 76.5% to 97.1%." |
| M9 two cross-references to section 5 | CLOSED | Both parentheticals removed. The remaining pointer, "(section 5, Vision-Language-Action Models, takes the model apart)" for pi0, held in round 1. |
| M10 DAgger limitation (F02-4) | CLOSED | "does not supply one for free" |
| M11 citation label and tier (F02-23) | PARTLY | The cell now cites the paper as well ("pi0 paper, section IV", F02-18), so the number has a correctly graded source. The badge "Tier 3 preprint openpi pi0_config.py" is unchanged: `registry.json` still maps F02-23 to the paper. Registry matter. |
| M12 linear layer and feature grid (F02-11, F02-13) | CLOSED | "Each camera image goes through ResNet-18, a standard image network. A transformer of width 512 reads its output with the joint angles and emits chunk_size rows of target angles." |

### New findings: error

**E1. Our derivation printed as the guide's rule, on a different quantity (F07-22; new sentence and new citation in r2).**
- Sentence: "The time of one call, measured on your GPU, has to stay under half the duration of the actions it plays, or the next call cannot finish before the arm runs out (section 17, Running on the Robot, works the rule)." followed by `<Cite id="F07-22">LeRobot remote inference guide, tuning</Cite>` (Tier 1).
- F07-22, guide's text: "If inference takes 1 second out of a 1.67-second prediction, only about 0.67 seconds
  remain. Another 1-second request cannot fit". The half is ours: "`[derived: H x dt - L >= L, so L <= H x dt /
  2]`", "latency must be under half the chunk duration". Section 17 words it that way: "In our arithmetic from
  that rule, the turnaround has to stay under about half the chunk's duration".
- Two departures. (1) No "our arithmetic" label, with a Tier 1 guide cited behind it. (2) The entry's quantity is
  the predicted chunk (H x dt, the "1.67-second prediction"); the sentence says "the actions it plays", which
  this paragraph has just defined as a separate, smaller number. For pi0 as this section reports it (50
  predicted, 25 played at 50 Hz) the entry's bound is 0.5 s and the sentence's is 0.25 s.
- Round 1 wording: "the result has to stay well under 1 (section 17 ... gives the rule for how far under)", which held.
- Fix: "By our arithmetic from LeRobot's tuning rule, the time of one call has to stay under about half the duration of the chunk it predicts (section 17, Running on the Robot, works it)."

### New findings: minor

**N1. One paper's result turned into a general statement (F02-10).**
- Sentence: "Fifty is enough to train on."
- F02-10: "50 demonstrations per task ... for 80 to 90% success on six real tasks", benchmark claim (author
  reported); wave2-A: "HOLDS (history)". The next sentence keeps the owner ("its authors report"). Round 1 had
  "Fifty is a working number."
- Fix: "Fifty was enough for ACT's authors."

**N2. "Our reading" dropped, and the comparison sets inference steps against training iterations (F02-20, F02-16).**
- Sentence: "Flow matching is diffusion with a straight path and few steps: 10 in pi0, where Diffusion Policy trains with 100 iterations."
- F02-20: "10 steps against Diffusion Policy's 100 training iterations (F02-16) is the practical argument for
  flow matching `[our reading]`". F02-16: at inference Diffusion Policy runs "16 (or 10) on real robots with
  DDIM". Both numbers are right and sourced; the sentence offers 10 against 100 as the evidence for "few steps"
  while the paper's own real-robot inference runs 10 or 16. Round 1 carried "In our reading".
- Fix: "10 in pi0, against the 100 that LeRobot's Diffusion Policy runs when num_inference_steps is unset (F02-17)", or restore "in our reading".

**N3. A claim about a source's silence, wider than what was read (F02-6).**
- Sentence: "The ACT authors give no reason for the taper"
- F02-6 holds two sentences of the ablation passage; they give no cause. The entry does not establish that the
  paper gives none anywhere. (This wording follows round 1's suggested fix.)
- Fix: "The ablation passage gives no reason for the taper".

### Checked and found supported (changed sentences)

- "ACT took the other road and shortened T", now cited to F02-5 (chunking cuts the effective horizon k-fold);
  the unsupported "robot imitation mostly" is gone.
- Illustration labels kept after rewording: "An illustrative 20-second episode"; "ϵ = 0.001, an illustrative
  rate"; "With toy numbers"; "the illustrative 0.25 m/s".
- Temporal ensemble: "The oldest prediction weighs most", w_i = exp(-m i) with i = 0 for the oldest, smaller m
  counts a new observation sooner (F02-7).
- "pi0 builds a chunk of 50 actions this way in 10 Euler steps of size 0.1" (F02-18, F02-20). The new sentence on
  straight paths and step count is numerical-integration reasoning in view, with no number attached.
- Head list: one pass, up to a hundred passes, ten short passes, a few dozen tokens (F02-16, F02-17, F02-20,
  F02-26, F02-27). CVAE gloss unchanged in substance (F02-11).
- "The table gives each paper's own figures. Each row was timed on a different GPU, so compare within a row.";
  column head "Authors' reported time per call" keeps the owner.
- Arithmetic redone: 600 / 100 = 6; 6 x 50 = 300; 300 / 30 = 10; 1 / 0.073 = 13.7; 2 x 73 = 146 ms, 14.6%;
  0.25 x 0.073 = 0.018 m; 0.25 x 0.75 = 0.1875 m.
- Closing block: "two jobs of different shape, training and the call on the arm (section 20)" (F08-76 rows 8 and
  12, shapes B and E); "about 5 hours on one 11 GB RTX 2080 Ti for about 80M parameters" with "ACT's authors
  report" (F02-9); "That is a single-node job"; "about 4 days on 8 H100 GPUs for one run of a 3B-parameter token
  model" with "the FAST authors report" (F02-28).
- The deleted sentence "In our reading that is also how tokens avoid the average" had no entry; nothing depends on it.
- Cross-references: sections 3, 5, 10, 15, 17 and 20 hold as in round 1; the two section 5 pointers that failed are gone.

Claims checked: about 60 (15 closures and the changed sentences). Round 1: 14 of 15 closed, 1 partly (M11). New
findings: 4 (1 error, 3 minor).
