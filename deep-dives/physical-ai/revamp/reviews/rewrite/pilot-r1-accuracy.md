# Accuracy review, round 1: sections 1 to 4 (Physical AI deep dive)

Checked against the registers in `deep-dives/physical-ai/research/2026-11/` (claim, verbatim quote, "Use in dive",
and Wave 2 / Wave 3 / wave5 rows for each ID). Severity: `error` = wrong, unsupported, or a qualifier lost;
`minor` = imprecise but not misleading. No web requests were made.

| Section | Claims checked | Findings | error | minor |
|---|---|---|---|---|
| 1 one-loop | 96 | 9 | 0 | 9 |
| 2 getting-started | 52 | 2 | 0 | 2 |
| 3 robot-computer | 167 | 16 | 3 | 13 |
| 4 demonstrations | about 155 (plus 13 cross-references) | 15 | 3 | 12 |

## Section 1: one-loop (OneLoop.tsx)

The section was rebuilt (9 KB to 24 KB of rendered text): the worked stand-in example, the deadline and
500-episode pair, the stage table, the five shapes and the answered nine-question table are all new text. All 43
cited IDs exist in the registers and in `registry.json`. No dollar figure is printed.

### Findings: minor

**M1. Author-flagged inference (F08-62, F08-63). Supported in direction, unlabelled, and "most" is not derivable.**
- Sentence: "Faster arithmetic on the same memory would spend most of its gain waiting; the figure to read on a machine for this job is GB/s."
- F08-62 gives "62.3% of cycles stalled on memory" and "63.9% of slots back-end bound" for the Jetson core. The
  register's own synthesis (`08-compute-shapes.md`, section "The mechanism") says "Demand equals supply, and the
  stall counters name the part: that is a saturated part." No entry says what a faster core would gain. The
  direction follows from the two figures in view (9.8 GB/s asked of an 11.71 GB/s core; 62.3% of cycles stalled),
  so this is a consequence the text derives, and it is not an error. Two imprecisions: it carries no "our reading"
  mark although the three citations after it are measurements, and "most of its gain" is a quantity no entry or
  arithmetic produces (the stalled share bounds what faster arithmetic can remove at the remaining 37.7% of
  cycles; it does not say how a given gain is split).
- Fix: "Faster arithmetic would leave the 62.3% of cycles that wait on memory where they are (our reading); the figure to read on a machine for this job is GB/s."

**M2. Runtime and statistic of the vendor figure not stated (F07-5, F07-1). Two places.**
- Sentences: "NVIDIA reports 149.0 ms for one call of its GR00T N1.7 policy on a Jetson Orin, which is 4.5 of those periods." and "A large policy misses the control period several times over: NVIDIA reports 149.0 ms per call of GR00T N1.7 on a Jetson Orin, 4.5 periods at 30 Hz."
- F07-5: "On Jetson Orin the same policy needs 149.0 ms per call with TensorRT ... and 357.9 ms in plain PyTorch."
  F07-1: "With the full TensorRT pipeline, one complete policy call takes a median 149.0 ms on Jetson Orin".
  149.0 is the median of the fastest runtime in that row. The owner ("NVIDIA reports") is kept and 149.0 / 33.3 =
  4.47 is right. The conclusion holds a fortiori for the slower runtimes, so graded minor; both sentences are new
  text, so nothing was dropped from a before sentence.
- Fix: "NVIDIA reports a median of 149.0 ms with TensorRT for one call ..." in both places.

**M3. Ray-tracing cores attributed to any renderer that traces rays (F08-76 row 7).**
- Sentence: "The cameras are a second workload: GPU memory first, then the GPU's ray-tracing cores when the renderer traces rays."
- F08-76 row 7: "GPU memory capacity first, then the rendering path: RT cores for RTX renderers, general compute for the Warp ray tracer". The Warp renderer traces rays and uses general GPU compute.
- Fix: "then the GPU's ray-tracing cores when an RTX renderer draws them".

**M4. Quote that names two cards used for a class of cards (F06-52).**
- Sentence: "Cameras drawn by RTX ray tracing need a GPU with RT (ray-tracing) cores, which the training-class cards lack: the Isaac Sim 6.2.0 requirements page says \"GPUs without RT Cores (A100, H100) are not supported.\""
- F06-52 Wave 2 row: "The sentence names A100 and H100 only; H200, B200 and B300 are not named on this page." The quote is exact; "the training-class cards" is wider than what it names.
- Fix: "which the A100 and H100 lack".

**M5. Transfer stated as a result where the entries give two techniques (F06-66, F06-30).**
- Sentence: "A policy trained there survives the move to the bench when training varied the simulator's parameters widely or someone measured the arm and corrected them (sim-to-real)."
- F06-66 is the 2017 paper's own result for an object detector trained on randomised rendering ("accurate to 1.5 cm"), labelled history. F06-30 documents that a system-identification script for the SO-101 ships. Neither says a policy survives the move when either is done.
- Fix: "Two techniques narrow the gap: varying the simulator's parameters widely in training, and measuring the arm to correct them (sim-to-real)."

**M6. Who builds the frozen pieces (F04-2).**
- Sentence: "A coding agent can run the same experiments unattended once people have built and frozen the reset, the success check and the safety limits; in the ENPIRE system those are written rules, and the repository files read show no mechanism that prevents the edit."
- F04-2: "Stage one (EN) is human-guided and one-off: agents build the safety limits, the automatic reset and the verifier for one task"; quote "coding agents construct an autonomous environment interface from human feedback". Agents build them under human guidance. The scope qualifier from F04-8 ("the repo files read do not show a mechanism") is kept correctly.
- Fix: "once the reset, the success check and the safety limits have been built under human guidance and frozen".

**M7. One comparison stated as a property of the two kinds (F03-25).**
- Sentence: "the other predicts a latent, a compact learned summary of the scene, and the summary is far cheaper per imagined future: the V-JEPA 2 authors report 16 seconds to plan one action with their latent model against 4 minutes with a video model given one tenth as many samples, on one RTX 4090."
- F03-25 supports every number and the owner is kept. The entry and its Wave 2 row ask that the baseline be identified: one Cosmos 1 model fine-tuned by the V-JEPA 2 authors ("Keep the register's caveat in the page text"). "a video model" does not misname it, but "far cheaper" as a general statement rests on that single author-run baseline.
- Fix: "... against 4 minutes with the one video model they fine-tuned as a baseline, given one tenth as many samples".

**M8. Limits sentence narrower than the entry (F08-73).**
- Sentence: "Every measurement of ours is a single run of a stand-in program on one core of an edge machine, which shows the method and is too little to size an EC2 instance."
- F08-73 lists "(8) one GPU kernel per machine" beside the one-core runs, and its Wave 2 line records that two passes exist in the experiments folder (workload rows reproduce within 2.5%). "Single run" is the label the register keeps for citing; "every ... on one core" leaves out the GPU kernel.
- Fix: "Our CPU measurements are single runs of stand-in programs on one core of two small Arm machines".

**M9. "The joints" for state plus action (F01-86).**
- Sentence: "The joints come to 1,440 bytes per second and the two cameras to 55.3 MB/s of raw pixels, 38,400 times as much"
- F01-86: "State plus action: (6 + 6) x 4 bytes x 30 = 1,440 bytes per second." The figure counts the readings and the targets. Arithmetic redone: 12 x 4 x 30 = 1,440; 2 x 30 x 921,600 = 55,296,000; ratio 38,400.
- Fix: "The joint readings and targets come to 1,440 bytes per second".

### Checked and found supported (no finding)

- Stand-in paragraph: six 1024x1024 float32 matrices = 25,165,824 bytes = 25.2 MB (F08-63, Wave 2 recomputation);
  390 inferences/s on one A78AE core, NumPy, single run (F08-62); 390 x 25.2 MB = 9.8 GB/s (F08-63); 11.71 GB/s
  triad on the same core (F08-66); 62.3% of cycles stalled on memory (F08-62); "more than the processor's caches
  hold" (Jetson L3 2M, 4M total, F08-63). "That core is out of memory bandwidth" matches the register's "Demand
  equals supply ... a saturated part". The stall split of the triad kernel itself, which F08-73 Wave 2 forbids
  printing, is not printed.
- Limits paragraph (F08-62 "Limit", F08-73): dense layer stack on a CPU core, real policies run convolutions and
  attention on the GPU; "The figures stay with the stand-in" keeps the scope.
- Deadline and episodes: 1/30 = 33.3 ms (F01-28); 149.0 / 33.3 = 4.47 (F07-5); deadline per unit against
  throughput (F08-79); array job, children read their index, 500 episodes as the register's own worked example
  (F09-5); two-minute notice, best effort (F10-520, F09-95); retried job goes to the front of the queue (F09-10).
- Three properties and five shapes (F08-78): definitions of duration, coupling, interruptibility; membership of
  each shape (rows 2, 5, 7, 10 in fan-out; 8, 9 one node; 14, 15 many nodes; continuous decode always on; 1, 12
  on the robot's clock). "what it has not yet written to storage" (F08-79). "30 minutes or less", attributed to
  the AWS Batch guide (F09-11). One workload, two shapes: 50 episodes, a few minutes on a laptop, standing CPU
  tier (F08-80).
- Bench: leader and follower (F01-2); six motors, five plus gripper (F01-8); wrist and top camera, 640x480 at
  30 fps "in the SO-101 examples" (F01-30; the wording stays inside the Wave 2 note that "every example" is too
  strong).
- Stage table against F08-76 rows 1, 2, 4, 5, 7, 8, 9, 10, 11, 12, 13: software AV1 encoder; branchy integer
  decode or fixed-function engine; worker processes and 24 vCPUs per GPU "on most eight-GPU sizes" (F08-57,
  192 / 8 = 24, 96 / 8 = 12 cores; the g7 and p4d exceptions are covered by "most"); one world per core;
  tensor cores with GPU memory as the gate "unless row 4 starves it"; "lightly"; independent episodes; shared
  memory on the robot's computer. "Four of the eight boxes carry a CPU tag": stages 1 to 4, counted in the figure.
- Fifteen: twelve plus three, simulation as three workloads (rows 5, 6, 7), the three vendor-scale ones (F08-75).
  "The split into fifteen is ours" keeps the owner.
- Nine-question table: six in, six out, one image per camera (F01-26); T^2 mechanism and k-fold reduction
  (F02-2, F02-5); VLA definition (F02-32); JEPA definition (F03-47); 4,096 arms, 4,096 x 16 x 3,000 =
  196,608,000 (F04-58); AV1 by CPU code and no H100 hardware decode (F08-77); Isaac Sim quote verbatim (F06-52);
  2 GB per component, container image or S3 object (F07-87); Spot quote verbatim (F09-95); four schedulers.
- Cross-references: titles of sections 2 to 29 match `revamp/tools/sections.json`; section 20 (`Workloads.tsx`)
  carries the demand-against-supply reading and the fifteen; section 2 has four ideas and three routes.
- Figure caption keeps "in our reading of the sources" and "illustrative, not measured".

Claims checked: 96. Findings: 9 (0 error, 9 minor).

## Section 2: getting-started (GettingStarted.tsx)

All 7 cited IDs exist (F01-26, F01-28, F01-74, F08-36, F08-50, F08-63, F08-66). No dollar figure is printed.

### Findings: minor

**M1. Runtime of the vendor benchmark not stated (F01-74). Unchanged from the before text.**
- Sentence: "NVIDIA's benchmark of one call to its GR00T N1.7 policy reports a median of 22.9 ms on an H100, a data-centre GPU, and 149.0 ms on a Jetson Orin, one of its onboard computers for robots."
- F01-74: the six medians are "all with TensorRT; PyTorch eager on the same devices takes 101.5 ... and 357.9 ms"; its Wave 2 row says "name the workload with every figure". Owner and "median" are kept. The rewrite added the sentence "The first figure fits inside a tick and the second is several ticks long" (22.9 < 33.3; 149.0 / 33.3 = 4.5, both right), which leans on the TensorRT figures: in PyTorch eager the H100 figure, 101.5 ms, does not fit inside a tick.
- Fix: "reports, with TensorRT, a median of 22.9 ms on an H100 ...".

**M2. "No metric was found" kept, "nearly every part has a counter" slightly wider than the entry (F08-50).**
- Sentence: "Nearly every part has a counter that shows when it is the full one, so a choice of instance can be tested on a running job."
- F08-50 names a counter for eight of the nine parts and "(7) GPU ray-tracing cores: no counter located"; it tells memory bandwidth from memory latency "by throughput versus time per access", one shared counter for two parts. The following sentence keeps the scope of F08-36 exactly ("the NVIDIA profiling guide read on 2026-11-20 lists them as a unit, and no metric for them was found in its text").
- Fix: none needed if "nearly every" is read as eight of nine; optionally "Eight of the nine have a counter".

### Checked and found supported (no finding)

- Lead: 33.3 ms = 1/30 s (F01-28); "the longest is 13 sections" and "eight, thirteen or twelve": routes counted
  from the text and the figure (1, 2, 3, 4, 6, 7, 16, 22 = 8; 1, 2, 3, 9 to 18 = 13; 1, 2, 20 to 29 = 12).
- Idea 1: observation and action shapes (F01-26); 30 ticks a second at LeRobot's defaults (F01-28).
- Idea 2: six float32 each, 6 x 4 = 24 bytes (F01-26 derived); 60 s, 30 fps, 1,800 rows, 50 episodes, 60 s reset
  (F01-28); 50 x 1,800 = 90,000 and 50 x 60 s = 50 minutes, marked "our arithmetic on those defaults".
- Idea 3: 22.9 ms and 149.0 ms medians, vendor-owned (F01-74); "Each benchmarked call returns 40 actions" (F01-74:
  "action horizon 40", "each call returns 40 actions"); section 17 (`OnRobot.tsx`) carries the 40-action chunk.
- Idea 4: 9.8 GB/s against 11.71 GB/s, "our single runs" (F08-63, F08-66); nine parts as two CPU, two memory,
  five GPU, storage and network outside the chip, "The grouping is ours" (F08-50); ray-tracing-core sentence with
  its date and scope (F08-36).
- Cross-references: section 9 (`CollectingData.tsx`) states what an episode weighs on disk and the recording
  setting later readers inherit; section 20 uses demand and supply; section 29 (`Choosing.tsx`) has the table of
  all fifteen; section titles match `sections.json`; the three sections on no route (5, 8, 19) match the figure.

Claims checked: 52. Findings: 2 (0 error, 2 minor).

## Section 3: robot-computer (RobotAsComputer.tsx)

Reviewed: `/tmp/pai-rw/after-r1/03-robot-computer.txt` against `/tmp/pai-text-before/03-robot-computer.txt`,
the Cite IDs in `src/sections/RobotAsComputer.tsx`, register `research/2026-11/01-robot-basics.md`
(entries F01-2 to F01-89 as cited, plus its section 5 teaching material), the Wave 2 rows for register 01 in
`research/2026-11/wave2-A.md` (rows 1 to 54 and the summary lines), and `src/data/registry.json`.
No F01 entry is mentioned in `wave3-*.md` or `wave5-refutation.md` (grep count 0). All 52 cited IDs exist in the
register and in `registry.json`. No dollar figure is printed.

### Findings: error

**E1. Author-flagged inference, stale chunk actions (F01-83, F01-87). Unsupported, presented as derived fact.**
- Sentence: "The first actions of each new chunk were computed from an observation several ticks old, and at 0.25 m/s every 100 ms of that age is 25 mm: the gripper closes where the block was when the frame was taken."
- F01-83 is arithmetic only: "Distance travelled blind = speed x delay", 0.25 m/s x 0.100 s = 25 mm, where the
  thing that travels is the gripper. F01-87 gives the docs quote on synchronous rollout, the playback condition and
  the derived "149 / 33.3 = 4.5 ticks". Neither entry says anything about where the gripper closes, and neither
  says the block moves.
- The clause also changes which object moved. In the register (and in this section's own intro, "a place the
  gripper has already left") the gripper travels during the delay; the block on the table is static, so "where the
  block was when the frame was taken" is where the block still is. As written the clause describes a hit, not a
  miss, unless the block moved, which no entry claims.
- It sits directly in front of a `kind="derived"` citation ("our arithmetic, speed times delay") with no "in our
  reading" label, so it reads as a consequence of the cited arithmetic.
- Fix: end the sentence at "25 mm" in the register's terms ("the arm has travelled 25 mm since the frame those
  actions were computed from"), or keep the consequence only with an explicit "in our reading" label and with the
  gripper, not the block, as the thing that moved.

**E2. Author-flagged inference, bench symptom for the servo protections (F01-47). Unsupported, not labelled.**
- Sentence: "At the bench that is a joint that stops holding its angle, and the cause to check is at that servo: a stall, an over-current or heat."
- F01-47 claim: the servo "cuts torque after being blocked for 2 s above 80% of stall, after drawing more than 2 A
  for 2 s, outside 4 V to 7.4 V, or above 70 degrees C". Quotes: "It enters the protection after being blocked at
  more than 80% of the locked rotor and lasts for 2s"; "turn off the output and enter the over-current
  protection"; "greater than 7.4V or less than 4V to enter the protection"; "Turn off the torque output when the
  temperature is higher than 70 deg C". "Use in dive" is only: the safety layer is in firmware and unaware of the
  policy.
- The entry has no description of what the reader sees at the bench. The symptom is the dive's inference from
  "turn off the output", it is placed after the citation and carries no "in our reading" label. For the stall case
  the datasheet quote says only "enters the protection", and F01-17 quotes a register comment "25% torque when
  overloaded", so the register does not establish that a stalled joint goes fully slack.
- The list of causes is also incomplete against the entry: supply voltage outside 4 V to 7.4 V is the fourth
  protection and is missing from "a stall, an over-current or heat".
- Fix: label it ("in our reading, at the bench that would show as a joint that stops holding its angle") and add
  supply voltage to the causes, or drop the sentence.

**E3. Wave 2 correction not applied (F01-30). Pre-existing, unchanged by the rewrite.**
- Sentence: "The code sets no default resolution; the documentation and every SO-101 example use 640x480 pixels at 30 frames per second."
- wave2-A row 17 (F01-30, F01-31): "The teleoperate script's own docstring example uses 'width: 1920, height:
  1080, fps: 30', so 'every SO-101 example uses 640x480' is slightly too strong; write 'the docs' advice and the
  SO-101 tutorial'."
- Fix: "the documentation's advice and the SO-101 tutorial use 640x480 pixels at 30 frames per second."

### Findings: minor

**M1. Protection list narrowed (F01-47).**
- Sentence: "The servo's firmware switches its output off after 2 s blocked at more than 80% of its stall torque, after 2 s drawing more than 2 A, or at a temperature over 70 degrees C, as the datasheet lists it."
- The entry lists four conditions; "outside 4 V to 7.4 V" is dropped while "as the datasheet lists it" implies the
  list is the datasheet's. Fix: add "at a supply voltage outside 4 V to 7.4 V".

**M2. "Most of a tick" against the 74.4% figure (F01-38).**
- Sentence: "Most of a tick goes to reading sensors."
- The entry: observe mean 13.65 ms, "74.4% of work", work mean 18.4 ms, 15.1 ms slept. 13.65 / 33.3 = 41% of a
  tick; it is most of the loop's work, and less than the sleep. Fix: "Most of a tick's work goes to reading sensors."

**M3. New over-broad statement on conversion (F01-53, F01-24).**
- Sentence: "A recording made this way is a demonstration, and it needs no conversion before training."
- Holds for joint-space policies (F01-53: joint space "maps directly to motor commands"). The section's own later
  sentence says recordings "must first pass through a kinematic model of your arm" for an end-effector model. No
  entry supports the unqualified form. Fix: "for a policy that outputs joint targets, LeRobot's default, it needs
  no conversion".

**M4. Citation does not carry the new clause (F01-8; support is in F01-44).**
- Sentence: "The six share one serial bus, a single data line to the host on which each servo answers by its ID."
- F01-8 supports six motors on one bus with IDs 1 to 6. "A single data line" and answering by ID are in F01-44
  (half-duplex serial; "one data line, everyone takes turns, each servo answers by ID"), which is not cited in the
  section. Fix: add `<Cite id="F01-44">`.

**M5. Flat sentence ahead of the "our reading" label (F01-46).**
- Sentence: "Reading the other registers would not supply one."
- F01-46 labels "Neither is a torque measurement" as [our reading], and its "Use in dive" calls motor current "a
  crude stand-in for force". The text states flatly that the registers supply no measure of push, then labels the
  reasoning two sentences later. Fix: move "in our reading" to this sentence, or write "would supply only a crude one".

**M6. Unlabelled causal reading on the humanoid ladder (F01-73).**
- Sentence: "The rate also decides where a rung's computer can sit: on the humanoid, as NVIDIA describes it, everything but the reasoning model runs on the robot."
- F01-73 supports the second half ("Everything but the reasoning model runs onboard"). That rate is what decides
  placement is the dive's inference; the entry gives no reason. Fix: label the first clause "in our reading".

**M7. Timeout offered as scale for bus time (F01-25).**
- Sentence: "The bus code gives a sense of scale for the first: it waits 50 ms per attempt for a servo's reply, a timeout its comment calls "longer than the 16 ms latency timer of a USB adapter"."
- Numbers and quote match the entry. The 50 ms is a per-attempt timeout, an upper bound, not a bus time; the
  entry's own use is "a USB-serial adapter can hold data for milliseconds". The same section reports 13.65 ms mean
  for joints plus cameras together. Fix: say it is a ceiling per attempt ("the code allows up to 50 ms per attempt").

**M8. Generalisation from one worked example (F01-87, F01-57, F01-74).**
- Sentence: "On this arm the buffer is rarely what runs out."
- F01-87 gives one derived example (50-action chunk, 1,667 ms, against a 149 ms call). "Rarely" is not in any
  entry, and the example pairs a GR00T N1.7 latency with the SmolVLA and pi0.5 chunk length (GR00T's default is 40,
  F01-57; wave2-A row 30 notes LeRobot's GR00T example uses 16). Fix: "In this example the buffer is not what runs out."

**M9. Registry link for the pi0.7 sentence resolves to the pi0.5 paper (F01-59).**
- Sentence: "The authors of Physical Intelligence's pi0.7 model report the other choice: their experiments use joint-space control, and they found no noticeable gain from end-effector control with their earlier models."
- The entry supports the sentence from arXiv 2604.15483v2 (pi0.7). `registry.json` maps F01-59 to
  `https://arxiv.org/abs/2504.16054v1`, the pi0.5 paper, while the Cite label reads "pi0.7 paper, control mode".
  Fix: point the registry URL for this use at 2604.15483v2.

**M10. "Optimized" dropped from NVIDIA's 124 ms (F01-73). Pre-existing.**
- Table cell: "Plans 1.6 s chunks about once per second; 124 ms per prediction on the robot's onboard computer"
- Quote: "Optimized, a Turbo prediction for G1 takes 38 ms on an RTX 5090 and 124 ms onboard Jetson Thor"; wave2-A
  row 37: "Both latencies are after NVIDIA's inference optimisations (720 ms eager on Thor ...)". Fix: "124 ms per
  optimised prediction".

**M11. Frame-age term and "worst case" (F01-85, F01-74). Pre-existing.**
- Sentences: "The frame age is between 0 and 33.3 ms: the camera and the loop both run at 30 Hz, they are not synchronised, and the loop takes the most recent frame in the buffer without waiting for a fresh one." and "Take the worst case with the model on a Thor beside the arm, so no network: 33.3 + 76.8 + 0 + 33.3 = 143.4 ms"
- F01-85 scopes the 0 to 33.3 ms as "before exposure, USB transfer and decoding are counted (those were not
  sourced, U11)". The paragraph on what is left out names only the serial bus and the servo response. The "worst
  case" sum also uses NVIDIA's median for the inference term. Fix: add camera exposure, transfer and decoding to
  the left-out list; write "the worst case for the two waits, with NVIDIA's median call".

**M12. "Only" narrows the docs' list (F01-41).**
- Sentence: "Remote inference sends observations to a policy server on another machine, so the host needs no GPU and keeps only the cameras and the motors."
- Quote: "the robot computer keeps control of cameras, motors, teleoperation and recording". Fix: drop "only".

**M13. "By default" missing in the lede (F01-28, F01-29).**
- Sentence: "Six measured joint angles and two camera frames come in, six target angles go out, and the exchange repeats 30 times a second, once every 33.3 ms."
- 30 is the recording default (F01-28); plain teleoperation defaults to 60 Hz (F01-29), which the section says
  later. Fix: "30 times a second by default".

### Verdict on the two author-flagged inferences

- F01-47 bench symptom ("a joint that stops holding its angle"): not in the entry, not labelled as the dive's
  reading, placed after the citation as fact. Error E2. The cause list also drops the voltage protection.
- F01-83 / F01-87 ("the gripper closes where the block was when the frame was taken"): not in either entry,
  attached to an "our arithmetic" citation whose arithmetic does not produce it, and wrong about which object
  moved. Error E1.

### Checked and found supported (no finding)

- Arithmetic redone: 76.8 / 33.3 = 2.3; 1 / 30 = 33.3 ms; (6 + 6) x 4 x 30 = 1,440; 640 x 480 x 3 = 921,600;
  2 x 30 x 921,600 = 55,296,000 (55.3 MB/s); ratio 38,400; 60 s x 55,296,000 = 3.32 GB; 6 x 4 = 24 bytes;
  1024 x 360 / 4095 = 90.02; 50 / 30 = 1.67 s (1,667 ms); 149 / 33.3 = 4.5; 0.25 x 0.0333 = 8.3 mm, x 0.100 =
  25 mm, x 0.250 = 62.5 mm; 1.82 x 0.100 = 182 mm; 0.010 / 0.25 = 40 ms; 33.3 + 76.8 + 0 + 33.3 = 143.4 ms =
  4.3 ticks = 35.9 mm, more than 3 x 40 ms; 22.9 to 149.0 ms = 1 to 5 ticks; 8.3 mm more than twice 3.6 mm.
- Numbers against entries: F01-11 (4096), F01-16 (P 16, I 0, D 32), F01-17 (50%, 50%, 25%, quote "to avoid
  burnout"), F01-18 (degrees from mid-range, 0 to 100, -100 to 100, divisor 4095), F01-25 (50 ms, 16 ms quote),
  F01-28 (30 Hz, 60 s episode), F01-29 (60 Hz), F01-35 (10 ms busy-wait, macOS and Windows, Linux sleeps),
  F01-38 (13.65, 74.4%, 1.80, 0.90, 1.70, 18.4, 15.1, worst 45.1, "near zero means the loop is saturated",
  hardware not stated), F01-39 (30 x N, default 1), F01-42 (42 RPM at 6 V, vendor named), F01-46 (duty cycle,
  6.5 mA, 1/345, "our reading" kept), F01-57 (50 for SmolVLA and pi0.5), F01-72 (dates, 200 Hz, 10M, 1 kHz,
  Helix 2.5 states no rate, per Wave 2), F01-73 (1.6 s, once per second, 50 Hz, 1 kHz "labelled", owner kept),
  F01-74 (22.9, 76.8, 149.0, 40 actions, TensorRT, 106.8 PyTorch on Thor, "NVIDIA reports" kept), F01-80 (10 to
  20 ms, authors named), F01-82 (0.413 m, 1.82 m/s, 5 V and not-measured caveats kept, per Wave 2), F01-84
  (0.088 degrees, 0.63 mm, 0.5 degrees, 3.6 mm).
- Quotes verbatim: F01-87 / F01-41 "with a synchronous rollout the robot stops moving every time the policy
  computes its next chunk of actions"; F01-87 "enough usable action playback to cover inference latency and its
  variation".
- Qualifiers kept: "in our reading" on teleoperation as copying (F01-24), position-only driver (F01-23), two
  units under one key (F01-19), camera placement (F01-31, newly labelled), five-joint reach (F01-52), standing
  push (F01-17 use), chunk defaults "played to its end" (F01-81, Wave 2 condition); "Neither of the two Feetech
  documents read" and "rate not stated in the documents read" (F01-45); 0.25 m/s "illustration ... no one
  measured it" (F01-83); "raw frames in memory" (F01-86, Wave 2); "the split into four is ours"; Toy and Derived
  markers on the invented and computed numbers.
- New sentences supported by entries not previously used: calibration lets a model trained on one arm drive
  another (F01-20 quote); "never tunes that loop again" (register section 5.3); gripper caps (F01-17); NVIDIA's
  "deltas" equals LeRobot's "relative" (F01-60 note); pi0.7 joint-space (F01-59); absolute-deadline pacing and
  borrowed ticks (F01-34); warning causes (F01-36); timestamp from index, 25 Hz claims 30 (F01-37); backends
  (F01-40, F01-41); Jetson CPU decoding, community-maintained build (F01-89); `use_degrees` scales (F01-18).
- Cross-references: section 4 (LearningFromDemonstrations: chunks, six target angles), section 5 (VLA defined),
  section 9 (video compression for storage), section 10 (decode for training), section 17 (OnRobot: TensorRT
  against PyTorch, joining a new chunk), section 20 (Workloads: shape E, a deadline per unit, the robot's clock)
  each contain what the sentence says. Titles match `revamp/tools/sections.json` in short form.

### Count

Claims checked: 167. Findings: 16 (3 error, 13 minor). Of these, E3, M10 and M11 are in text the rewrite did not
change.

## Section 4: demonstrations (LearningFromDemonstrations.tsx)

Reviewed: rendered text after (`/tmp/pai-rw/after-r1/04-demonstrations.txt`) against the before text, the section
source, and register entries F02-1 to F02-29, F02-49, F02-67, F02-68 (`research/2026-11/02-imitation-and-vla.md`),
F11-1 to F11-3 (`11a-formulas-imitation-rl.md`), the wave 2 rows for the same IDs (`wave2-A.md` lines 99 to 115,
130, 146, 155), `wave3-unknowns.md` (F02-6 row) and `wave5-refutation.md` (no row for any ID cited here). Every
cited ID was found. Cross-references were checked in `revamp/tools/sections.json` and the named section sources.

### Findings: error

**E1. Scope widened, no entry, and contradicted inside the section.**
- Sentence: "Two changes contained it, and every current policy is built from both."
- Register ID: none cited for it; F02-68 contradicts it.
- Before text: "The models in section 5, Vision-Language-Action Models, are built from both." The rewrite widens
  "the models in section 5" to "every current policy". F02-68 (OpenVLA-OFT) is a policy with chunking and a plain
  L1 regression head, no sampling, and the section itself later says "How far the generative head is needed is less
  settled".
- Fix: restore the scoped form, for example "Two changes contained it, and the models in section 5 are built from
  both", or "chunking is in every policy this section covers; most also sample".

**E2. A cause is assigned to ACT's taper that the entry does not give.**
- Sentence: "A longer chunk helps up to a point; what pushes back is reaction time." (same block as the quote
  "slightly tapers down with higher k"; the h2 description also promises "why a longer chunk stops helping").
- Register ID: F02-5, F02-6 (the block's citations).
- Entry: F02-6 quotes "then slightly tapers down with higher k. This illustrates that more chunking and a lower
  effective horizon generally improve performance." No cause for the taper is stated. The reaction-time
  explanation is F02-15, the Diffusion Policy authors' finding about their execution horizon ("too long a horizon
  reduces performance due to slow reaction time"), which is not cited in this block.
- Fix: attribute it and cite it: "The ACT authors give no reason for the taper; the Diffusion Policy authors, who
  measured the same trade, name slow reaction time" with `<Cite id="F02-15">`.

**E3. Our derivation sits inside an "authors report" sentence.**
- Sentence: "The authors report about 30 tokens per chunk per arm, a tenth of the plain count."
- Register ID: F02-26 (and F02-25 for the 300).
- Entry: the authors report "roughly 30 action tokens per chunk per robot arm". The 10x is
  "`[derived, from F02-25's count and this quote]`", and the 300 it divides is itself our count for a 6-number arm
  over 50 actions (F02-25 "Worked count `[derived]`"), not a figure from the FAST paper's domains.
- Fix: split and mark: "The authors report about 30 tokens per chunk per arm. Against our count of 300 for this
  arm, that is a tenth (`<Derived>`)."

### Findings: minor

**M1. Bench symptom stated without the "our reading" label, under a citation (unchanged from the before text).**
- Sentence: "At the bench it looks like a smooth, confident reach that closes the gripper beside the block."
- Register ID: F02-2. Entry: the T^2 epsilon quote and "it may encounter completely different observations ...
  leading to a compounding of errors". Nothing about how the failure looks. The same symptom is labelled "our
  reading" in the table at the end of the section but not here.
- Fix: add "in our reading" or move the cite ahead of this sentence.

**M2. Labelled symptom goes past what the mechanism says.**
- Cell: "A smooth reach that closes beside the block, more often late in the episode" (table row 1, F02-2, F02-6).
- Entry: F02-2 is a worst-case bound; "Use in dive: ... not a prediction of a given robot's failure rate". The
  section itself says the bound "makes no claim about what a given arm will do". "More often late in the episode"
  is a timing prediction no entry carries. It is covered by the lead-in label, so not an error.
- Fix: drop "more often late in the episode" or keep it and accept it as labelled inference.

**M3. "Ten times the paper's" compares against one of three paper settings.**
- Sentence: "How much repetition is a setting, and the default can be ten times the paper's."
- Register ID: F02-16, F02-17. Entry: the paper uses 100 inference iterations in simulation, 16 on real-robot
  benchmarks, and 10 for the 0.1 s figure. LeRobot's 100 is 10x only against the 10-iteration setting, 6.25x
  against 16, and equal to the paper's simulation setting.
- Fix: "ten times what the paper ran for its 0.1 s real-robot figure".

**M4. Condition of the 73 ms figure dropped in two new sentences.**
- Sentences: "For pi0 its authors report 73 ms per call on an RTX 4090, which is 1 / 0.073 = 13.7 calls per
  second" and "2 calls per second, each 73 ms".
- Register ID: F02-21. Entry: "on an RTX 4090 with 3 cameras", on-board. The cost table keeps "with 3 cameras";
  these sentences do not. (The before text also used a bare 73 ms outside the table.)
- Fix: add "with 3 cameras" at the first of the two uses.

**M5. The 15% against 75% comparison rests on two different call schedules.**
- Sentence: "The token model, if its chunks are the one-second chunks the same passage describes for pi0, spends
  750 ms of each second, 75%."
- Register ID: F02-27, F02-22. Entry F02-27 supports "one second action chunks" for pi0 and 750 ms per chunk for
  the token model. The stated condition is present. The unstated second assumption is that the token model plays
  a whole chunk per call (1 call per second), while the pi0 line just above is computed at 2 calls per second
  (25 of 50 actions played, F02-22). At pi0's schedule the token model would need 1,500 ms per second.
- Fix: add "and plays each chunk whole" to the condition.

**M6. Uncited general statement not carried by the cited entry.**
- Sentence: "Predicting long keeps the motion coherent."
- Register ID: F02-15 (block citation). Entry: consistency is attributed to the execution horizon ("having an
  action horizon greater than 1 helps the policy predict consistent actions"), not to the prediction length.
- Fix: delete, or reword to what the entry says (the next sentence already does).

**M7. "Announcements" has no entry in the block.**
- Sentence: "Announcements and configuration files call flow steps denoising steps too: LeRobot's pi0 setting is
  num_inference_steps, 10 by default."
- Register ID: F02-29, F02-24. Entry F02-29 supports the configuration file ("num_inference_steps: int = 10  #
  Number of denoising steps during inference"). Neither entry is an announcement.
- Fix: "Configuration files call flow steps denoising steps too".

**M8. Qualifier shortened on the OpenVLA-OFT figure.**
- Sentence: "report success on LIBERO, a suite of simulated manipulation tasks, rising from 76.5% to 97.1%."
- Register ID: F02-68. Entry quote: "average success rate across four task suites from 76.5% to 97.1%". "Average"
  and "four task suites" are dropped, and LIBERO is called "a suite".
- Fix: "report average success across the four LIBERO task suites rising from 76.5% to 97.1%".

**M9. Two cross-references to section 5 point at content section 5 does not hold (as of `VisionLanguageAction.tsx` now).**
- "pi0.5 ... is pretrained with FAST tokens and then given a flow-matching action head for inference (section 5,
  Vision-Language-Action Models)": section 5 covers pi0.5 through F02-48 (the text subtask) and never cites
  F02-49 or describes the tokens-then-flow recipe. The claim itself is supported by F02-49.
- "In our reading, sampling one mode is a strong tendency on human demonstrations and falls short of a law
  (section 5, Vision-Language-Action Models)": section 5 has OpenVLA-OFT as a timeline marker and one table row
  (size, repository date); it has no regression-head discussion.
- Fix: drop the two parentheticals, or add the material when section 5 is rewritten.

**M10. DAgger limitation stated more strongly than the entry.**
- Sentence: "a recording session with a leader arm does not supply one."
- Register ID: F02-4. Entry: "which teleoperated robot demonstrations do not give for free".
- Fix: "does not supply one for free" or "does not supply one by itself".

**M11. Citation label and tier disagree.**
- Rendered: "Tier 3 preprint openpi pi0_config.py" (`<Cite id="F02-23">`, pi0 row of the chunk-length table).
- `registry.json` maps F02-23 to the pi0 paper (tier 3, preprint); the entry's code evidence (`action_horizon: int
  = 50`, tier 1, pinned SHA) is what the cell uses. The number is supported; the badge shows a code file as a
  preprint.
- Fix: registry matter; note for the registry owner, or cite F02-18 (H = 50, paper) beside it.

**M12. Unchanged from before, not in the cited entries.**
- Sentence: "Each camera image goes through ResNet-18 ... and comes out as a grid of feature vectors. The six
  joint angles go through one linear layer."
- Register ID: F02-11, F02-13. Entries support ResNet-18, width 512, chunk_size; neither states the linear layer
  or the feature grid.
- Fix: none needed for this round if a code read backs it; otherwise trim to what F02-11 lists.

### The "our reading" symptoms (authors' flag)

- The label is present once, as the sentence before the table: "The symptoms in the first column are our reading
  of the mechanisms; the causes and the settings are the cited ones." It is not repeated in the rows; the Source
  column of each row carries citations with no marker that column 1 is exempt, so the label depends on the reader
  having read the lead-in.
- Row 1 (reach closes beside the block): follows from F02-2 as an illustration; "more often late in the episode"
  goes past it (M2). Cause and fix supported (F02-2, F02-6).
- Row 2 (arm completes its motion to where the cup was): follows from open-loop chunk execution (F02-22
  "execute action chunks open-loop"; F02-15 "slow reaction time"). Fix supported: 8 "optimal for most tasks that
  we tested" (F02-15).
- Row 3 (hitch at each chunk boundary): follows from F02-7 "avoid discrete switching between executing and
  observing"; the cause cell is that quote. Fix supported (F02-7, F02-13); section 17 does hold the early-start
  option (real-time chunking).
- Row 4 (gripper heads between two routes): follows from F02-8's claim (a plain regressor averages
  demonstrations) and F02-14's labelled illustration. Fix supported (`use_vae = True`, F02-11).
- Row 5 is not a reading: 100 passes when `num_inference_steps` is unset and "16 or 10" are F02-17 and F02-16.
- Stated without the label elsewhere: the row 1 symptom in the compounding-error block under F02-2 (M1). "if
  someone nudges the cup, the arm finishes the old plan first" is also unlabelled but is the direct meaning of
  open-loop playback and matches the before text.
- Other "our reading" labels checked and present where the register marks `[our reading]`: "robot imitation
  mostly took the other road and shortened T" (F02-4), "10 steps where Diffusion Policy trains with 100 iterations
  is the practical case for it" (F02-20), "sampling one mode is a strong tendency ... falls short of a law"
  (F02-68). "In our reading that is also how tokens avoid the average" is labelled and has no entry, which is
  what the label says.

### Checked and supported (no finding)

- Numbers, all matching their entries: 1% to 44%, k = 100, 50 Hz, four settings (F02-6, wave 3 HOLDS); 50
  demonstrations, about 10 minutes, 80 to 90%, six real tasks, with "its authors report" kept (F02-10); 30 times
  a second, two cameras, six angles, 50 episodes default (F02-67); chunk_size 100, n_action_steps 100, width 512,
  kl_weight 10, latent 32, use_vae on, ALOHA note (F02-11); n_decoder_layers 1 against 7 (F02-12);
  temporal_ensemble_coeff off, 0.01 in the paper, n_action_steps = 1 (F02-13); T_p 16, T_a 8, "four times longer"
  (F02-15, F02-17); horizon 64, n_action_steps 32, 100 passes when unset (F02-17); 100 training iterations, 16 or
  10 with DDIM, 0.1 s at 10 iterations on an NVIDIA 3080 kept together as wave 2 asks (F02-16); H = 50 (F02-18);
  10 Euler steps of 0.1, cached prefix (F02-20); 14 + 32 + 27 = 73 ms, 13 ms, 86 ms, RTX 4090 (F02-21); 25
  actions and 0.5 s at 50 Hz, 16 and 0.8 s at 20 Hz, ensembling "hurt policy performance" (F02-22);
  action_horizon 50 (F02-23); chunk_size comment and num_inference_steps 10 (F02-29); mirrored time axis by the
  code's own comment (F02-24); 256 bins (F02-25); about 30 tokens (F02-26); 5x, 750 ms, under 100 ms on an NVIDIA
  4090, 30 to 60 tokens, 2B and 300M (F02-27); about 4 days on 8 H100, 3B (F02-28); about 80M, about 5 hours, 11 GB
  RTX 2080 Ti, about 0.01 s, with "ACT's authors report" kept (F02-9); FAST tokens then flow for pi0.5 (F02-49);
  7B, parallel pass, L1 regression, 76.5% to 97.1% with "report" kept (F02-68).
- Quotes, verbatim against the entries: "slightly tapers down with higher k"; "reduces performance due to slow
  reaction time"; "to improve smoothness and avoid discrete switching between executing and observing"; "hurt
  policy performance"; "a well-known challenge for policy learning"; "essential in learning precise tasks from
  human demonstrations".
- Formulas: behaviour cloning objective (F11-1, equation 2); T^2 epsilon bound and its tightness note (F02-3);
  ACT loss with L1 typeset and the MSE-in-the-box sentence (F11-2); diffusion loss, equation 5, "one k per
  sample" (F11-3); Euler step and flow-matching loss, tau from 0 noise to 1 data (F02-19, F02-20); temporal
  ensemble weights, w_0 oldest, smaller m faster (F02-7).
- Arithmetic redone: 20 x 30 = 600; 50 x 20 x 30 = 30,000; 600 x 0.001 = 0.6; 360,000 x 0.001 = 360; 600 / 100 =
  6; 6 x 6 x 0.001 = 0.036; 0.036 x 100 = 3.6; 360 / 3.6 = 100; 100 / 50 = 2 s; 100 / 30 = 3.33 s; 32 / 30 =
  1.07 s; 50 / 100 = 0.5 and 50 passes per second; 1 / 0.01 = 100; 1 / 0.073 = 13.7; 6 x 50 = 300; 46 / 73 = 63%;
  27 / 10 = 2.7; 27 / 2 = 13.5; 2 x 73 = 146 ms, 14.6%; 0.25 x 0.073 = 0.018 m; 0.25 x 0.75 = 0.1875 m (188 mm);
  0.8 to 0.2 in ten steps of -0.06.
- Qualifiers kept: "the episode length is an illustration"; "That rate is an illustration; nobody measured it";
  "Illustrative, not measured" on all three figures; "the obstacle is our illustration"; "as the authors report"
  on the pi0 cadence; "each paper's own figures, on its own GPU"; "the illustrative 0.25 m/s"; the access date in
  the header. No dollar figure is printed.
- Cross-references that hold: section 3 (0.25 m/s illustration, delay as distance), section 8 (human
  interventions, F04-79), section 10 (decode on CPU cores bounds the trainer), section 15 (pi0-FAST 8 H100 run
  among the scales), section 16 (loss against counted successes), section 17 (start the next call early; "under
  about half the chunk's duration" rule), section 20 (title; GPU tensor cores). All titles match `sections.json`.

Claims checked: about 155 (numbers, quotes, formulas, qualifiers and attributions), plus 13 cross-references.
Findings: 15 (3 error, 12 minor).
