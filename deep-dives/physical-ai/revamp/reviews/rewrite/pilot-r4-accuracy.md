# Accuracy review, round 3 of the pilot: sections 1 to 4 (Physical AI deep dive)

Checked: the current rendered text (`/tmp/pai-rw/after-r4/`) against the round 2 rendered text
(`/tmp/pai-rw/after-r2/`), the section sources in `src/sections/`, the registers in `research/2026-11/`
(claim, verbatim quote, "Use in dive", Wave 2 / Wave 3 / wave5 rows for each ID) and `src/data/registry.json`.
Round 2 findings are the ones in `revamp/reviews/rewrite/pilot-r2-accuracy.md`. Sections 1 and 2 were read in
full, sentence by sentence. Sections 3 and 4 were checked where the two rendered texts differ (4 and 5 changed
passages) plus the two "partly" items. No web requests were made. No dollar figure is printed in any of the four
sections. Severity: `error` = wrong, unsupported, or a qualifier lost; `minor` = imprecise but not misleading.

| Section | Round 2 findings | Closed | Still open | Claims checked (this round) | New findings | error | minor |
|---|---|---|---|---|---|---|---|
| 1 one-loop | 8 | 8 | 0 | about 110 | 7 | 1 | 6 |
| 2 getting-started | 6 | 6 | 0 | about 85 | 6 | 2 | 4 |
| 3 robot-computer | 3, plus 1 "partly" | 4 | 0 | 12 | 0 | 0 | 0 |
| 4 demonstrations | 4, plus 1 "partly" | 5 | 0 | 12 | 0 | 0 | 0 |

The three errors:

1. Section 1, twice: the simulated-cameras row and the "Which GPU does simulation need?" answer now say
   ray-tracing cores are needed whenever cameras are ray traced. The register says RT cores are for RTX
   renderers and that the Warp ray tracer runs on general GPU compute. This reopens round 1's finding M3, which
   round 2 had closed.
2. Section 2: "A model served from a data centre usually runs on the kind of GPU that trained it, and one sizing
   covers both." No entry, and not something this dive's reader can be assumed to hold as true.
3. Section 2: "and nothing on the GPU itself says so", said of a GPU waiting 64% of each step. By the
   nvidia-smi definition the section cites two paragraphs later (F08-30), that GPU reads about 36% busy.

---

## Section 1: one-loop (OneLoop.tsx)

Rewritten again since round 2 (17.5 KB to 22.7 KB of rendered text): the worked count is now three paragraphs,
the five shapes are a list, and the table is regrouped under four shape headings with a Stage column. All 30
cited IDs exist in the registers and in `registry.json`.

### Round 2 findings

| R2 | Status | Current text |
|---|---|---|
| E1 sections 20 and 21 cross-reference | CLOSED | "(section 20, Fifteen Workloads, Five Shapes, names the part for every row with the figure behind it, and section 21, Reading a Machine, shows how to confirm a part on the processor's counters)" |
| N1 stand-in's result assigned to the arm's policy | CLOSED | "the first is sized by a deadline on a machine it never loses". Also new: "The six-matrix program shows the method, and its figures are not that policy's." |
| N2 "every other job" against row 1 | CLOSED | "So the computer beside the arm is sized by a deadline, in milliseconds per call. Every job off the robot's clock is measured in throughput." |
| N3 "does not wait", "by default" | CLOSED | "By default the arm takes a new target 30 times a second, one every 33.3 ms, and the clock does not slow for a late answer." |
| N4 condition on the chunk | CLOSED | "The arm plays the chunk one action per period while the next call computes, provided the actions it holds outlast the call." |
| N5 flat cause for the idle GPU | CLOSED | "Check first whether the cores that decode the video are full before the GPU is" |
| N6 conditions of the 199, formula credit | CLOSED | "the standard sample-size approximation for comparing two proportions asks for about 199 trials per policy to tell a true 80% from a true 90%, at 80% power ... and the 5% level". The label still reads "our arithmetic, with the formulas of LeRobot eval_stats.py", which is right for the 40 in 50 against 45 in 50 half; the sentence itself now credits the 199 to the standard approximation, as F06-97 requires. |
| N7 "our reading" on the figure caption; stage 4 tag | CLOSED | "Each stage is tagged with the parts its commonest workloads exhaust first or next (in our reading)." |

### New findings: error

**E1. Ray-tracing cores required for any ray-traced camera (F08-76 row 7, F06-62, F06-57). Reopens round 1 M3.**
- Sentence (table, workload 7): "GPU memory first, then the GPU ray-tracing cores when the image is drawn by tracing rays. Some training GPUs have none."
- Sentence (answers): "Which GPU does simulation need? None for one scene's physics, which runs on a CPU core, and one with ray-tracing cores once the cameras are ray traced, which rules out the A100 and the H100 (section 12, Physics Simulation, and section 13, Rendering and Ray Tracing)."
- F08-76 row 7: "GPU memory capacity first, then the rendering path: RT cores for RTX renderers, general compute
  for the Warp ray tracer". F06-62: MuJoCo Warp's default camera renderer "is a software ray tracer on Warp's
  BVH"; the OptiX fallback "is the first-party evidence that the Warp path does not depend on RTX hardware".
  F06-57: BVH traversal "can run on RT cores ... or as ordinary CUDA code on the general compute cores (Warp's
  BVH, Madrona's ray tracer). The first needs an RTX GPU; the second does not ask for one."
- Round 2 text, which held: "then the ray-tracing cores when an RTX renderer draws them" and "once an RTX
  renderer draws the cameras". The paragraph above the answers still says it correctly ("Cameras drawn by an RTX
  renderer ... need a GPU that has RT (ray-tracing) cores").
- Fix (cell): "GPU memory first, then the GPU ray-tracing cores when an RTX renderer draws the image. Some training GPUs have none."
- Fix (answer): "None for one scene's physics, which runs on a CPU core, and one with ray-tracing cores once an RTX renderer draws the cameras, which rules out the A100 and the H100 (section 12, Physics Simulation, and section 13, Rendering and Ray Tracing)."

### New findings: minor

**N1. The 465 is printed as a hard ceiling; the entry gives two limits and marks the choice of the higher one as our reading (F08-63).**
- Sentence: "So before the program runs, the count puts its ceiling near 465 passes per second, however fast the core's arithmetic."
- F08-63: "The Jetson figure sits at that core's measured memory limits (9.25 GB/s read, 11.71 GB/s triad)"; caveat:
  "the triad figure is the better ceiling `[our reading]`". Against the 9.25 GB/s read figure the same count
  gives 367 passes, below the 390 measured, so which kernel stands for "what memory delivers" is a choice. Round
  2 printed both limits; the 9.25 is now gone. The arithmetic holds: 11.71 GB/s / 25.2 MB = 465; 390 / 465 =
  84%; 390 x 25.2 MB = 9.8 GB/s; 62.3% (F08-62).
- Fix: "So before the program runs, the count puts its ceiling near 465 passes per second if that sweep is the most this core's memory delivers (our reading), however fast the core's arithmetic."

**N2. Workload 4 sits under "One long run" and its always-on case is gone from the table (F08-78).**
- Text: group heading "One long run. One job on one machine. Spot is open as far as the checkpoint interval allows." over row "4. Dataloader decode and augment", and "the fifteen workloads of the table, grouped by shape" (five shapes, four groups).
- F08-78 puts rows 8 and 9 in shape B and row 4 in shape D: "always on and steady, interruptible per item (row 4
  when run as a standing preprocessing tier; continuous decode of incoming video)". F08-76 row 4: "3 Augment,
  and inside 8". Round 2's cell had both: "Inside the training job it feeds; always on when run as a tier of its
  own". The "Always on" bullet covers standing decode (F08-80), not row 4.
- Fix: add to row 4's last cell: "Run as a standing tier of its own, this is the always-on shape."

**N3. "The eight stages become the fifteen" (F08-75).**
- Sentence: "Split every stage that way and the eight stages become the fifteen workloads of the table, grouped by shape and labelled with their stage."
- F08-75: splitting the eight phases "gives twelve workloads"; "Add the three that the arm's owner consumes as
  finished checkpoints". The table itself labels 13, 14 and 15 "Vendor scale", which is none of the eight
  stages. Round 2 passed the same clause because the next paragraph stated the twelve and the three; that
  paragraph is gone and the nearest statement is now below the table.
- Fix: "Split every stage that way and the eight stages become twelve workloads; three more, run only at vendor scale, make the fifteen of the table, grouped by shape and labelled with their stage."

**N4. "Across more machines" (F08-76 row 15).**
- Sentence (table, workload 15): "The same three parts as robot-model pretraining, across more machines."
- F08-76 row 15: "Same as row 14, at larger scale"; evidence "1,024 GB200 GPUs for one current model; 16 to 256
  data-centre GPUs for the JEPA line" against row 14's "up to 1,024 GPUs". The entry does not support a larger
  machine count.
- Fix: "The same three parts as robot-model pretraining, at larger scale."

**N5. A ranking of five with no entry and no label (F08-77, F08-76).**
- Sentence: "Five of the fifteen are the easiest to buy wrong, and they are in bold: recording, decoding, the dataloader, the simulated cameras and on-robot inference." (also the table head "bold: easiest to buy wrong" and the h2 description)
- F08-77 supports the first three as one pattern ("on machines bought for their GPU"), F06-52 the cameras, and
  F08-76 row 12 the shared memory. No entry picks five or ranks them; the selection is ours. New in this round.
- Fix: "Five of the fifteen are, in our reading, the easiest to buy wrong, and they are in bold: ..."

**N6. Vendor figure without the vendor as the one reporting it (F01-74). Borderline.**
- Sentence: "NVIDIA's GR00T N1.7 call is a median 22.9 ms on an H100 and 149.0 ms on a Jetson Orin, both with TensorRT."
- F01-74 is a `[vendor claim]`. "NVIDIA's" here owns the model, and the figure reads as a plain fact. The badge
  says "vendor claim" and the earlier paragraph has "NVIDIA reports a median of 149.0 ms".
- Fix: "NVIDIA reports a median of 22.9 ms on an H100 and 149.0 ms on a Jetson Orin for one GR00T N1.7 call, both with TensorRT."

### Checked and found supported (no finding)

- **Opening:** six motors (F01-8); wrist and overhead camera (F01-30); "often a CPU core, on a machine bought
  for its GPU" keeps "often" (F08-77); the three markets are common AWS knowledge.
- **Worked count:** six 1024x1024 float32 matrices; "one pass reads all 25.2 MB of weights" is now said of the
  stand-in (F08-63: "every inference reads all of them"), where round 2 said it of the policy; more than the
  caches hold (Jetson L3 2M, 4M total); 11.71 GB/s on one Cortex-A78AE core of a Jetson Orin Nano Super, "single
  run" badge (F08-66); "We then ran it once, in NumPy, on that core"; 390 passes per second; 62.3% of cycles
  stalled on memory (F08-62). The triad kernel's own stall split, which F08-73 Wave 2 forbids, is not printed.
  "Those stalled cycles wait on memory whatever the speed of the arithmetic" lost round 2's "(our reading)", but
  it restates what a memory stall is.
- **Deadline:** 149.0 ms median, GR00T N1.7, Jetson Orin with no module named, TensorRT as the fastest runtime
  in the row (357.9, 224.3, 149.0), "NVIDIA reports" (F07-5); 149.0 / 33.3 = 4.47.
- **Chunk paragraph:** 40 actions "in that benchmark" (F01-74, action horizon 40); the outlast condition
  (F01-87); 0.25 x 0.149 = 37 mm with "illustrative" kept (F01-83); 40 x 33.3 ms = 1.33 s; 1.33 / 0.149 = 8.9,
  "about nine". Section 17 holds "a chunk of 40 actions" and the turnaround rule.
- **Episodes and Spot:** 500 children, each reading its index (F09-5, the register's own example); two-minute
  notice on a best-effort basis (F10-520); retried job to the front of the queue (F09-10).
- **Five shapes, and what each forces:** independent units, a queue that retries, Spot open (F08-78 shape A,
  F09-5); one long run, loses the work since the checkpoint, "30 minutes or less" (F08-79, F09-11); nodes that
  talk, for days, "losing one node loses the step on all of them", Batch multi-node jobs not on Spot (F09-8),
  "tightly coupled between instance nodes" verbatim (F09-95), reserved capacity (F09-112); always on, one item
  lost, "a few minutes on a laptop" against a standing tier, CPU cores at both sizes (F08-78 shape D, F08-80);
  on the robot's clock, not interruptible, Greengrass as "software on the device that receives deployments from
  the cloud" (F08-78 shape E, F07-84).
- **Table of fifteen against F08-76 and F08-78:** group membership 2, 3, 5, 6, 7, 10, 11, 13 (A); 8, 9 (B); 14,
  15 (C); 1, 12 (E). Cells for rows 1 to 6 and 8 to 14 match the entry's "Part loaded first" and mechanism,
  including "24 vCPUs per GPU on most eight-GPU sizes" in row 4 and "unless the dataloader starves the trainer"
  in row 8. Stage labels match the entry's phases.
- **AV1 and H100:** AV1 by default, written and read by CPU code (F08-77); H100 cannot hardware-decode AV1,
  "EC2 P5" (F05-47). **Cores:** 192 / 8 = 24 vCPUs, 12 physical cores, "on most eight-GPU sizes" (F08-57; g7
  and p4d are the exceptions "most" covers). Section 10 holds the same figures.
- **RT-core quotation** verbatim, version 6.2.0, A100 and H100 only (F06-52).
- **199 trials:** with both conditions; 40 in 50 against 45 in 50 not distinguishable (F06-97, Fisher p = 0.26).
- **Cross-references:** sections 3, 10, 12, 13, 16, 17, 20, 21 and 24 hold what is claimed; titles match
  `revamp/tools/sections.json`.

Claims checked: about 110. Round 2: 8 of 8 closed. New findings: 7 (1 error, 6 minor).

---

## Section 2: getting-started (GettingStarted.tsx)

Reworked since round 2 (13.9 KB to 16.9 KB). The lede, the timing-report paragraph, the training half of block
3 and all of block 4 are new. Nine IDs are new to the section (F02-5, F05-47, F05-59, F06-58, F07-3, F07-4,
F07-24, F08-57, F08-77); F05-62, F08-84 and the pointer to section 20 are gone. All 23 cited IDs exist in the
registers and in `registry.json`.

### Round 2 findings

| R2 | Status | Current text |
|---|---|---|
| E1 "section 20 ... does it for every job" | CLOSED | Sentence deleted; the section no longer points at section 20. |
| N1 "The ratio survives compression" | CLOSED | "The imbalance survives compression. ... The video is still about 230 times the rows (our arithmetic)." (85,666,122 / 369,943 = 232) |
| N2 qualifiers of the LeRobot quote (F05-58) | CLOSED | "By default LeRobot applies its image transforms ... per sample ... With several cameras, its documentation says, that is often the most expensive thing the workers do, and "the GPU ends up waiting for data"." |
| N3 two tables joined into one run (F09-82) | CLOSED | "its timing table gives 3.4 hours at batch 32 on ml.g7e.2xlarge" and, separately, "The post's memory table gives a peak of 41.5 GB of GPU memory at batch 32, and that is with the backbone frozen" |
| N4 hidden assumption in 32 / 0.167 = 192 (F01-91, F05-62) | CLOSED | The 192 samples a second, the 5 ms and the "one core feeds four GPUs" arithmetic are deleted. See N3 below for what replaced them. |
| N5 doc sample read as a machine's result (F07-23) | CLOSED | "in the sample timing report of LeRobot's inference guide, which runs at 30 ticks a second on hardware the guide does not name" |

### The sentences that contrast robots with language-model serving

The author states these rest on no register entry. Judged one by one:

| Sentence | Judgement |
|---|---|
| "Four facts about a robot arm change what you buy for it, and experience with language models points the wrong way on each." | Framing; it stands or falls with the four below. Acceptable once E1 is fixed. |
| "A model that serves requests is judged by its throughput, or by a latency someone chose." | Common knowledge for this reader (a service-level target is chosen). Consistent with F08-79. No finding. |
| "Text is ready to train on as it is stored, and video is not." | Overstated (text is tokenised first). See N4. |
| "A model served from a data centre usually runs on the kind of GPU that trained it, and one sizing covers both." | Unsupported. See E1. |
| "Text costs a language model almost nothing to prepare, and images cost a robot trainer CPU time on every sample." | Common knowledge in the first half; F05-58 supports the second. No finding. |

### New findings: error

**E1. Unsupported claim about language-model serving (no entry).**
- Sentence: "A model served from a data centre usually runs on the kind of GPU that trained it, and one sizing covers both."
- No register entry. It is not common knowledge either: large models are routinely trained on one fleet and
  served on another (other cards, other memory needs, quantised weights), and training and serving are sized
  separately. The point the paragraph needs is narrower: both ends of a served model are data-centre GPUs, and a
  policy's two ends are a data-centre GPU and a small onboard computer.
- Fix: "A model served from a data centre is trained and run on data-centre GPUs. A policy is trained on one and run on a small computer beside the arm, so the same weights are sized twice, in hours and gigabytes to train and in milliseconds to run."

**E2. "Nothing on the GPU itself says so", and our 64% printed without its bound or its label (F05-59, F08-30).**
- Sentence: "If the figure holds, the H100 had been waiting on the workers for 1 - 1/2.8 = 64% of each step, and nothing on the GPU itself says so."
- F08-30, cited two paragraphs later: utilisation is the "Percent of time over the past sample period during
  which one or more kernels was executing on the GPU". A GPU with nothing to run for 64% of each step reads
  about 36% on that figure, so the GPU's own monitor does say so. Section 1 calls the same condition a GPU that
  "sits idle". What F08-30 supports is the reverse caution (a high reading does not show a full GPU), which the
  next paragraph states correctly.
- The 64% is ours (F05-59: "the GPU had been idle for most of each step `[our reading]`"; the post gives the
  2.8x only). It is a lower bound: the faster run also does the transforms on the GPU, so the GPU's own work per
  step did not shrink. The arithmetic holds (1 - 1/2.8 = 0.643), the 2.8x keeps its owner ("Hugging Face ...
  reports"), and "it gives no dataset, camera count or batch size" matches the entry.
- Fix: "If the figure holds, the H100 had been waiting on the workers for at least 1 - 1/2.8 = 64% of each step (our arithmetic)."

### New findings: minor

**N1. "Image preparation" for image augmentation (F05-59, F05-58).**
- Sentence: "Hugging Face reports that one setting, which moves image preparation off those cores, makes a small policy train 2.8 times faster on an H100."
- F05-59: "moving image augmentation to the GPU". F05-58: with the setting "the workers decode only". Decoding is
  image preparation and stays on the CPU cores.
- Fix: "which moves image augmentation off those cores".

**N2. The Thor speed-up is assigned to quantisation alone (F07-4).**
- Sentence: "On a Jetson AGX Thor, NVIDIA reports that quantising the model, which is storing its numbers in fewer bits (in a format NVIDIA calls mixed NVFP4), cuts the call from 76.8 ms to 35.6 ms."
- F07-4: "quantising GR00T N1.7 to mixed NVFP4 with the "optimized" execution profile cuts the call from 76.8 ms
  to 35.6 ms"; quote: "adds `--execution-profile optimized` (cross-attention K/V caching, projection fusion, and
  CUDA graphs) and `--quantization fp8|mixed_nvfp4`".
- Fix: "NVIDIA reports that quantising the model, which is storing its numbers in fewer bits (in a format NVIDIA calls mixed NVFP4), together with its optimised execution profile, cuts the call from 76.8 ms to 35.6 ms."

**N3. Data loading printed as a part of the update time (F01-91).**
- Sentence: "for Diffusion Policy, one of its policies, an update takes 0.167 s, of which loading the data is 0.015 s, 9% of the step."
- F01-91 quotes two columns, `update_s` 0.167 and `dataloading_s` 0.015, and reads them side by side ("GPU
  update time dominates data loading by 10x"). It does not say the second is inside the first. If they add, the
  share is 0.015 / 0.182 = 8%. The conclusion ("In that run the GPUs are the limit") holds either way, and the
  owner ("LeRobot's hardware guide times") is kept.
- Fix: "an update takes 0.167 s and loading the data 0.015 s, about a tenth as long."

**N4. "Ready to train on as it is stored" (no entry).**
- Sentence: "Text is ready to train on as it is stored, and video is not."
- Text is tokenised before training; the cost is small, which is what the later sentence says ("Text costs a
  language model almost nothing to prepare").
- Fix: "Text needs almost no preparation before it is trained on, and video has to be decoded first."

### Checked and found supported (no finding)

- **Lede:** 33.3 ms (F01-28); 38,400 times, "before compression" (F01-86); 22.9 ms and 149.0 ms medians "in
  NVIDIA's benchmark with TensorRT ... on both" (F01-74); 2.8 times on an H100 with "Hugging Face reports"
  (F05-59).
- **Block 1 (deadline):** observation and action (F01-26); 30 ticks a second "by default" (F01-28); chunking
  (F02-5) and the deadline on the chunk (F01-87); mean tick 18.7 ms, mean policy call 5.18 ms, the quote "cycles
  over the 33.3 ms work budget: 12/1197 (1.0%)" verbatim, worst cycle 48.1 ms, worst policy call 40.00 ms
  (F07-23); "the median of 60 timed calls" (F07-3); "published figures rarely give them" (F08-84, not cited
  here: "Published first-party figures give medians only"); both quoted fragments of the reading guide verbatim
  (F07-24); 620.00 ms worst for record, 620 / 33.3 = 18.6 ticks (F07-23); default synchronous mode, the arm
  stands still; asynchronous modes need the actions in hand to outlast the call "and its variation" (F01-87).
- **Block 2 (data):** 1,440 bytes per second; 55.3 MB/s "of raw pixels"; 38,400 (F01-86); 86.1 MB, 11,939
  frames, 45.5 MB, 40.1 MB, 0.37 MB, "named for the SO-101" as Wave 3 requires (F05-29); 50 x (60 + 60) s = 100
  minutes with "up to" (F01-28); AV1 by default, decoded on CPU by the stock loader (F08-77; F05-39 holds the
  code fact); H100 cannot hardware-decode AV1 (F05-47).
- **Block 3 (sized twice):** 75 SO-101 episodes, 20,000 steps, 3.4 hours at batch 32 on ml.g7e.2xlarge, "an AWS
  post" (F09-82); one 96 GB GPU, 24 GB on G5 and G6, 48 GB L40S on G6e (F06-58); 41.5 GB at batch 32 with the
  backbone frozen (F09-82); 41.5 / 48 = 86%, "most of"; 22.9 ms on an H100 and 149.0 ms on a Jetson Orin with
  TensorRT, "NVIDIA's benchmark ... reports" (F01-74); 40 x 33.3 ms = 1.33 s, about nine times; "That holds in an
  asynchronous mode" (F01-87); 357.9 ms in PyTorch on the same Orin, "NVIDIA's table gives" (F01-74); built on
  the target device, about 2 to 5 minutes, rebuilt for a different GPU, cosine similarity 0.999 or higher
  (F07-8); "do not measure" closed-loop success, attributed to NVIDIA (F07-3). Section 17 holds the chunk check.
- **Block 4 (input-bound case):** the parts list as our reading (F08-50); defaults, "several cameras", "often",
  the quote and the `backend=gpu` behaviour (F05-58); ACT, 2.8 times, H100, owner kept (F05-59); 4 H100 at batch
  32, 0.167 s and 0.015 s (F01-91); the nvidia-smi definition (F08-30); "A GPU that waits for data for part of
  every step can still read as busy" holds for small waits (F01-91: about 90% with data loading at a tenth of
  the update); 24 vCPUs and 12 physical cores on most eight-GPU instances; g7.48xlarge 24 physical cores, "the
  most among the eight-GPU x86 sizes", which is the Wave 2 wording (F08-57, F08-85).
- **Routes:** unchanged from round 2.

Claims checked: about 85. Round 2: 6 of 6 closed. New findings: 6 (2 error, 4 minor).

---

## Section 3: robot-computer (RobotAsComputer.tsx)

Four passages differ between the two rendered texts. Each was read against its entry.

### Round 2 findings

| R2 | Status | Current text |
|---|---|---|
| R1 M9, "partly": citation for the pi0.7 sentence (F01-59) | CLOSED as far as the section can close it | Label: "pi0.5 and pi0.7 papers, control mode". F01-59's evidence is both preprints (arXiv 2504.16054v1 and 2604.15483v2), both Tier 3, author reported. Label, badge ("Tier 3 preprint author reported") and entry agree. Residual, outside the section: `registry.json` gives F01-59 one URL, the pi0.5 paper, so the link opens the paper that does not hold the quoted finding; the label tells the reader which paper does. |
| N1 three "our reading" labels removed (F01-23, F01-31, F01-52) | CLOSED | "but the driver's observation reads the position register only, so a model driving this arm gets positions and pixels" states the code fact the reading rests on (F01-23). "By their names and the mounts the hardware repository ships, one rides on the arm ..., and the other is fixed over the scene." gives the basis F01-31 names, and adds `<Cite id="F01-7">SO-ARM100 README, camera mounts</Cite>` (Tier 1, overhead and wrist mounts). The third, textbook kinematics, was the weakest and is unchanged. |
| N2 "Treat the sum as a floor" (F01-85) | CLOSED | "The sum is not the whole chain. It takes the longest value of the two waits, which overstates a typical tick, and NVIDIA's median call, which understates a slow one. It also leaves out camera exposure, ... Each of those adds delay, and the sources read on 2026-11-20 give a figure for none of them." The date scope is kept. |
| N3 "the one job ... sized by a deadline" (F08-78) | CLOSED | "The policy is the model-serving job that is sized by a deadline; the training-side jobs are sized by throughput." |

No findings. Checked: the four closures, the new F01-7 citation against its entry and `registry.json`, and that
no other line of the rendered text changed.

Claims checked: 12. Round 2: 4 of 4 closed. New findings: 0.

---

## Section 4: demonstrations (LearningFromDemonstrations.tsx)

Five passages differ between the two rendered texts. Each was read against its entry.

### Round 2 findings

| R2 | Status | Current text |
|---|---|---|
| E1 our half-chunk rule printed as the guide's (F07-22) | CLOSED | "By our arithmetic from LeRobot's tuning rule, the time of one call, measured on your GPU, has to stay under about half the duration of the chunk it predicts (section 17, Running on the Robot, works it)." The label is back and the quantity is the predicted chunk, as in the entry's derivation (L <= H x dt / 2). Section 17 words it the same way. |
| N1 "Fifty is enough to train on" (F02-10) | CLOSED | "Fifty was enough for ACT's authors." |
| N2 10 steps against 100 training iterations (F02-20, F02-17) | CLOSED | "10 in pi0, against the 100 that LeRobot's Diffusion Policy runs when num_inference_steps is unset." The citation is now F02-17 (Tier 1, `configuration_diffusion.py`): "`num_inference_steps = None`, which the model resolves to the training value: 100 denoising passes per inference". Inference against inference. |
| N3 "The ACT authors give no reason" (F02-6) | CLOSED | "The ablation passage gives no reason for the taper" |
| R1 M11, "partly": label and badge for the padding and horizon cell (F02-23) | CLOSED as far as the section can close it | Label: "pi0 paper, section V-A, and openpi pi0_config.py". F02-23's evidence is the paper (Tier 3) and the code at a pinned SHA (Tier 1, "action_dim: int = 32 / action_horizon: int = 50"). The label now names both and agrees with the entry. The badge "Tier 3 preprint" is the lower of the two tiers, so it understates the code-sourced 50 and overstates nothing. Residual, outside the section: `registry.json` gives F02-23 one URL, the paper, and the 50 is in the code file. |

No findings. Checked: the five closures and that no other line of the rendered text changed.

Claims checked: 12. Round 2: 5 of 5 closed. New findings: 0.
