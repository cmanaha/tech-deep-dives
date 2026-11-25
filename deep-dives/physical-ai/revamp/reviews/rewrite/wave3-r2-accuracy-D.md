# Accuracy review, wave 3 round 2, reviewer D: sections 17, 18, 19 (confirming check)

Read from HEAD (aa672f2) with `git show`; diffs as given in the task (17: f8956ca..4e4d22d; 18: 251417f..aa672f2;
19: 5905bbb..a49ddf6). Rendered text from `/tmp/pai-rw/w3-r2/`. Registers: `research/2026-11/*.md` (none modified in
the working tree). Earlier findings from `/tmp/pai-rw/review/w3r1/accuracy-A.md` (section 17), `accuracy-B.md`
(section 18) and `accuracy-C.md` Part 1 (section 19).

## Part 1. Section 17, Running on the Robot (`OnRobot.tsx`)

### Earlier findings (accuracy-A, section 17): 7 of 7 resolved

| ID | Status | What the page says now |
|---|---|---|
| E17-1 (paper rounds NVIDIA's median) | RESOLVED | "The paper's definition, `d = floor(L / dt)`, takes the 149.0 ms Orin median at 30 Hz, 4.47 ticks, down to 4". The application is now ours; F07-63 defines the floor. |
| E17-2 ("NVIDIA publishes no quantised figure at all") | RESOLVED | Sentence deleted. The table-scoped "the only device in the table with a quantised figure" remains. |
| M17-1 (GR00T under LeRobot's rules, unhedged) | RESOLVED | The hedge now sits in the opening block ("Where the Orin figure meets one of LeRobot's rules, it illustrates the arithmetic, and a timed call of your own policy replaces it"), and it says LeRobot v0.7.0 "ships a wrapper for GR00T N1.7" (F02-47). Use (b) now compares the 0.467 s with the 138.98 ms measured turnaround (F07-68), not with an on-device call. |
| M17-2 (older stack, F07-74 uncited) | RESOLVED | "with an older software stack and only the action head compiled", F07-74 cited. |
| M17-3 (single cause for 216.5 ms) | RESOLVED | "with the backbone left uncompiled on an older TensorRT" (F02-40 Wave 2). |
| M17-4 ("avoids") | RESOLVED | "which reduces backward bumps between chunks" (F07-27). |
| M17-5 (14 ms) | RESOLVED | "about 15 ms" (1,843,200 B x 8 / 1 Gbit/s = 14.7 ms). |

### Changed sentences checked and holding

- h1 description's "read 2026-11-20": every F07 entry the section cites carries "accessed 2026-11-20".
- "(LIBERO is a suite of simulated manipulation tasks)" (F07-10, "LIBERO Closed-Loop Sim Evaluation").
- Chart title "One compiled GR00T N1.7 call, NVIDIA's medians": the three bars are the TensorRT column (149.0, 116.6,
  76.8; F07-1, F07-5, F07-6). Chain label "over wired Ethernet, 50 calls" (F07-68: "wired Ethernet connection",
  "50 inference calls").
- Cadence report: "the observe line times the camera reads and the send line the motor write" (F07-23: "observe
  (cameras)", "send (motor write)").
- "the right half is what guarantees 'that an action is always available when it is needed'": F07-63 attaches that
  quote to "So long as d <= H - s", which is the right half of d <= s <= H - d (F07-65). "For a chunk of 40 and d = 4,
  s can be anything from 4 to 36": 40 - 4 = 36, marked Derived, chunk 40 from F07-2 (now cited).
- "more than three times the 138.98 ms chain ... with a small on-robot computer": 0.467 / 0.13898 = 3.36; the NUC is
  the robot computer in F07-68.
- Chunk-clock caption: the code asks at tick 35 of a 50-action chunk (15 ticks left = 0.5 s x 30), the slow call lands
  at 65, the old chunk ends at 50. "half of it is 25 ticks" (Derived). "the call times are illustrative" keeps the
  illustration label.
- Joins: aligned "drops the incoming actions whose time has passed and replaces only the future, which reduces backward
  bumps"; append "plays out the rest of the old chunk and starts the new one after it, so the new chunk can begin from
  an older observation"; RTC "inference itself conditions on the actions still to play" (F07-27: the register's claim
  line reads append as "keep the old slice, start the new one after it"; the doc says "the remaining trajectory").
- "a working transport alone does not establish a usable motion budget" is verbatim in F07-29.
- Free zone: "the new chunk takes over s actions into the old one, so its last s actions lie past the old chunk's
  end" matches F07-65 ("the last s = 5 actions are beyond the end of the previous chunk"), read as the offset between
  the two chunks.
- Moved real-robot paragraph: pi0.5, H = 50, 50 Hz, 97 ms RTC call, LAN 10 to 20 ms, d about 6, +100 and +200 ms to
  about 11 and 16, 16 x 20 = 320 ms, 480 episodes, 28 hours, "no degradation", "degrades linearly", temporal ensembling
  at neither added delay, protective stop: all in F07-69. Arithmetic: (97 + 10..20) / 20 = 5.4 to 5.9; +100: 10.4 to
  10.9; +200: 15.4 to 15.9.
- `prediction_steps` as the chunk length is consistent with F07-18's bound and F07-17.
- FP8 "a sign bit, four for the exponent and three for the mantissa" and FP4 "a sign bit, two exponent bits and one
  mantissa bit": F07-81 with its use note's 1 + 4 + 3 and 1 + 2 + 1.
- Profile glosses (projection fusion, CUDA graphs) and "NVIDIA's Thor tutorial splits a saving of the same kind, timed
  with one camera where the README uses two" (F07-4, F07-56, F07-57; F07-2 two inputs). 45 - 17.2 = 27.8; 27 - 13.6 =
  13.4.
- "19 of 20 (95%)" (F07-10). "10.16.1.11" now carries F07-9 in the same block.
- MIG paragraph: two isolated instances with their own compute, cache and memory bandwidth, best-effort beside
  latency-sensitive (F07-46).
- Greengrass opening: "open source edge runtime" (F07-120); nucleus manages deployment and lifecycle (F07-120);
  "details, dependencies, artifacts, and lifecycles" (F07-151); JSON or YAML (F07-122, F07-151); container started by
  `docker run` in the lifecycle (F07-153, F07-156).
- Run-line snippet: `--rm --runtime nvidia --network host` is verbatim in the Physical AI Toolchain sample's aarch64
  manifest (F07-157), so "Adapted from" F07-157 holds; the "ours" line keeps "no AWS page read on 2026-11-20 shows"
  and "has not been run on a device" (F07-156 use note).
- Footprint: 96 / 8,192 = 1.2%, 15.8 / 8,192 = 0.19%; "a documented floor" (F07-84 "Minimum 96 MB RAM") and "a
  measurement on another board" (F07-138, Raspberry Pi 4). Expandable: Java 2.18.4, 256 MB, 96 MB; lite v2.7.0 drops
  the CLI; v2.5.0 packages, 14.6 / 15.8 MB, six components (F07-84, F07-135, F07-138). "Neither nucleus names JetPack
  among its platforms" (F07-140: "Ubuntu 24.04, JetPack and NVIDIA are not named"; F07-142: "No Jetson is named").
- Closing paragraph's infer/observe/pacing reading (F07-24).

### Findings

**E17-R2-1 (error). The device-stack caption drops "a plan" and now presents the assembled stack as documented.**
- Sentence: "The parts as AWS's and NVIDIA's documents describe them, read from the top: the cloud service names the
  components, the nucleus installs and starts them, and the policy component starts the container that holds the
  control loop."
- Before: "The layout is a plan built from AWS's and NVIDIA's documents."
- The figure is titled "What runs on the Jetson" and draws a Greengrass nucleus on "The Jetson (JetPack, Ubuntu
  24.04)" with a policy container holding a camera reader and a servo bus driver. No entry documents that assembly:
  F07-140 says the nucleus page names no JetPack, F07-142 names no Jetson for lite, F07-156 says no AWS page shows the
  device flags, and the placeholder below says "Nothing in this block was run on a device". The parts are documented;
  the stack is our plan. The qualifier was the label that said so.
- Fix: "A plan assembled from AWS's and NVIDIA's documents, read from the top: ..."

**M17-R2-1 (minor). "(NVIDIA does not name the module)" widens a statement about one table to NVIDIA.**
- Sentence: "Take GR00T N1.7, NVIDIA's robot policy, on a Jetson Orin, a small computer built to ride on a robot
  (NVIDIA does not name the module)."
- F07-5 use note and U1: "The README does not say which Orin module". The later sentence keeps the right scope
  ("NVIDIA's table says 'Jetson Orin' without naming the module").
- Fix: "(NVIDIA's benchmark table does not name the module)".

**M17-R2-2 (minor). "The one difference the guide does state" makes the register's "one stated difference" the only
one.**
- Sentence: "The table gives no reason. The one difference the guide does state is software: the Spark runs a
  separate dependency stack, with TensorRT pinned to 10.16.1.11."
- F07-6 use note: "The README gives no reason; one stated difference is the software stack (F07-9). `[our reading]`".
  F07-9 also states CUDA 13.0, PyTorch 2.10.0 and a flash-attn build "for `sm121`", the Spark's GPU architecture.
- Fix: "One difference the guide does state is software: ..."

**E17-R2-2 (error). The compile h2 description hardens "is built" to "must be built" for every engine, which F07-77's
Wave 2 line forbids for the DGX Spark.**
- Sentence: "... and every engine must be built on the device that runs it".
- F07-77 Wave 2 (SCOPE NARROWER): "The one-engine-per-device-type rule holds on Jetson (JetPack). TensorRT 11.5.0 adds
  a hardware compatibility mode on Arm server-class Linux, DGX Spark included ... so do not state the rule for the DGX
  Spark without that qualifier." F07-77's quote is also about the "type of device", not the unit. The body states the
  exception correctly; the header, which the reader meets first, now states the rule as a "must" for every engine.
- Fix: "and on a Jetson every engine must be built on the type of board that runs it".

**M17-R2-3 (minor). "each need Docker's `--device` flag" states our reading flatly.**
- Sentence: "The camera and the servo bus each need Docker's `--device` flag."
- F07-156 use note: "`[our reading; the last two flags are standard Docker and appear in no AWS page read today]`".
  The snippet's "ours" line, directly below, carries the scope, so the reader is told within one block.
- Fix: "The camera and the servo bus can be passed with Docker's `--device` flag, which no AWS page read shows."

**M17-R2-4 (minor). The Greengrass h2 description says "AWS IoT Greengrass recipes leave out" the flags; AWS's own
sample Greengrass recipes pass the GPU flag.**
- Sentence: "Give the policy container the GPU, the camera and the servo bus with the flags AWS IoT Greengrass recipes
  leave out, ..."
- F07-156: the four recipes on the guide's "Run a Docker container" page have no GPU or device flag. F07-157: the
  genai-at-edge `recipe.json` and the Physical AI Toolchain edge stack are Greengrass recipes that pass
  `--runtime nvidia`. The body scopes it correctly.
- Fix: "with the flags the recipes in AWS's Greengrass guide leave out".

**M17-R2-5 (minor). The main footprint sentence drops the load and version of the 15.8 MB.**
- Sentence: "AWS documents a floor of 96 MB of RAM for the Java nucleus and measured nucleus lite at 15.8 MB on a
  Raspberry Pi 4".
- F07-138: 15.8 MB is the v2.5.0 packages "under a load of six small components" (14.6 MB idle). The expandable
  restates both, and the sentence's own "a measurement on another board" keeps the main scope.
- Fix: "measured nucleus lite's v2.5.0 packages at 15.8 MB with six small components on a Raspberry Pi 4".

Claims checked: 64 (every changed or moved sentence, figure label, caption, header and snippet line in the round 2
diff, plus the seven earlier findings). Findings: 7 (2 errors, 5 minor).

## Part 2. Section 18, The Fleet (`Fleet.tsx`)

### Earlier findings (accuracy-B): 15 of 16 resolved, 1 partly resolved

| ID | Status | What the page says now |
|---|---|---|
| E18-1 (6 GB policy placed in the Orin Nano's 8 GB) | RESOLVED | The 166 MB sentence now ends "before any policy loads, little beside a board's gigabytes", with no board named and F07-36 no longer cited there. A new paragraph scopes the figure: "The 6 GB is a size on disk ... lists the weights as '~6 GB+' among its storage prerequisites ... Whether a policy that size also fits in a smaller board's memory ... is a check to make on that board". No sentence in the section now puts pi0.5 on an Orin Nano; the only Orin Nano mention is the placeholder's planned hook-up. |
| E18-2 (five absences widened) | RESOLVED | "The quota page does not say whether the 2 GB counts a `docker:` image, or give a maximum image size"; "The mechanisms are documented, and the three routes are designs built from them"; "the subdeployment page does not say whether one may pin a version different from its parent's"; "The stream manager pages do not say whether it resumes an upload after the device reboots"; edge table "The pages read say nothing about GPUs", and the second hybrid-node GPU sentence is gone. Each is now scoped to pages read (F07-168, F07-165, F07-173, F09-122). |
| E18-3 (both samples cited for the image route) | RESOLVED | "a GPU container started from a recipe, as in both AWS samples that run a model on a Jetson. Neither settles the size question: the Physical AI Toolchain sample fetches its model file as a separate S3 artifact", with F07-195 cited. |
| E18-4 (nucleus lite's 15 MB as plain fact) | RESOLVED | "documented at under 15 MB of memory" (twice). |
| m18-1 (2 GB as a device-software check) | RESOLVED | P1: "AWS's device software installs what it delivers in packages called components, and one component may carry at most 2 GB" (F07-87). The h1 now says "may carry", not "accepts". |
| m18-2 ("about 6 GB") | RESOLVED | "6 GB or more of weights". |
| m18-3 (no undo / no brake) | RESOLVED | "is not automatically undone", "no automatic reverse gear", "no automatic undo", "no automatic brake". |
| m18-4 (timing holds only on the illustrative link) | PARTLY RESOLVED | Item 3 now says "on the illustrative link, notifies all twenty before any arm can finish its download". The restatement in "A brake and no reverse gear" does not: see M18-R2-1. |
| m18-5 (Docker application manager "runs Docker") | RESOLVED | "the Greengrass component that pulls images for you". |
| m18-6 (section 17 "set one up", "timed") | RESOLVED | Both phrases are gone. The replacement Spark clause raises M18-R2-5. |
| m18-7 (lite "cannot use shadows") | RESOLVED | "Nucleus lite has no shadow support of its own." |
| m18-8 ("takes" 6 to 8 minutes) | RESOLVED | "can take 6 to 8 minutes". |
| m18-9 (our-reading labels) | RESOLVED | (a) now framed as a consequence of the two limits just shown ("The two limits split the traffic"), with F07-176 cited; (b) replaced by the register's own fact: "stream manager is itself a Java program: its settings include arguments for the Java virtual machine" (F07-139, `JVM_ARGS`). |
| m18-10 (four endpoints) | RESOLVED | "For basic operation ... four endpoints ... A private image adds the endpoints of ECR" (F07-190). |
| m18-11 (Java 8 cited to F07-143) | RESOLVED | F07-84 now cited. |
| m18-12 (caption: twenty arms upload) | RESOLVED | "from three of the twenty arms". |

### The two points the task singled out

- **6 GB and the Orin Nano.** Checked every occurrence of "6 GB", "8 GB", "Orin Nano", "small board" and "gigabytes"
  in the rendered text. The 6 GB appears as the size to deliver (P1, P5, the routes, item 4, the canary wait), as "a
  size on disk" from the Thor tutorial's storage prerequisites (F07-54: "NVMe SSD recommended (model weights are ~6
  GB+)"), and never against a board's memory. The memory sentences ("166 MB before any policy loads, little beside a
  board's gigabytes"; "little on a board with gigabytes"; "Where a small board runs nucleus lite") name no board and
  no policy. Holds.
- **Rollout figure counts.** `fleetState` draws 17 fleet devices: indices 0 to 6 new (7), 7 and 8 failed (2), 9 to 16
  cancelled (8); 7 + 2 + 8 = 17, and 3 canaries + 17 = 20. The SVG `desc`, the group label "seventeen arms, still on
  policy 1.4.0" and the caption agree. The caption marks them invented: "Illustrative: the counts, the versions and
  the moment failures arrive are invented". The new caption clause "the two that failed are back on 1.4.0 by the
  default failure handling" is F07-163 ("rolls back that core device to its previous configuration"), and F07-163 is
  now in the figure's `cites`. Holds.

### Changed sentences checked and holding

- P1 to P5: 6 GB / 2 GB = 3; 200 MB / 128 KB = 1,600 (F07-54, F07-87, F05-20, F07-97); brake and second deployment
  (F07-95, F07-164); core device, deployment, components and artifacts (F07-120, F07-121, F07-123); the abort minimum
  of 100 against 20 arms, 5 a minute, doubling after 10 notified, 10 at 5 then 10 at 10 = 3 minutes (F07-162, F07-94,
  F07-93); 6 x 8,000 = 48,000 Mbit, / 100 = 480 s, past the 5-minute timeout, 20 x 8 = 160 min (Toy 20 kept).
- Routes table: Range request gloss; split row's "install step that joins the pieces, and disk for the joined copy"
  is a consequence of splitting that the cell derives in view.
- "a training loop that registers every hourly checkpoint as a component version, deployed or not": F07-167 counts
  versions per component per Region. 5,000 / 24 = 208.
- Startup gate: `UpdateState` from inside a container through the socket and the two variables (F07-129, F07-155);
  "both nuclei offer the operation" (F07-137 lists `UpdateState` for lite, and its use note says the gate "is
  available on both runtimes"). ERRORED, rollback quote, BROKEN after three errors (F07-163, F07-130).
- Job execution as "an instance of a job on a target device" and the job's own three settings (F07-178, F07-162).
- Item 1's setting advice; item 3's "1,000 devices, a fleet fifty times this one" (1,000 / 20 = 50); item 4's
  IN_PROGRESS clock, TIMED_OUT, ALL, 1 minute to 7 days (F07-162, F07-94).
- Lite paragraph: "an update stays away from a moving arm only if the arms stay idle from the deployment's creation
  until each has swapped, up to 160 minutes" follows from F07-179's use note (no maintenance window; the equivalent
  without deferral is creating the deployment at an idle hour) and the 160 minutes derived above.
- Trial judges: a classifier trained beforehand on success and failure frames (F04-74), optional in LeRobot, where
  success "can be marked manually with your gamepad or keyboard" (F04-77). Section 8 says the same (RobotRl.tsx: "a
  small image classifier can supply it, or a person marks each success by hand on a gamepad or keyboard").
- Corrections list: digest pinning (F07-154 and the section's own tag-versus-digest paragraph), `--runtime nvidia`
  (F07-157), startup and `UpdateState` (F07-129), 120 s startup default (F07-128), the socket and two variables
  (F07-155), revision from the current one and pinning AWS's components (the section's paragraphs on F07-123 and
  F07-166), 5 and Toy 20%. Item 5's `accessControl` grant rests on F07-155's claim line, whose quote is generic, as
  accuracy-B noted; unchanged from round 1, no finding.
- OS paragraph: "The AWS pages read describe no managed update" keeps the scope (F07-185); Jetson Linux in JetPack
  (F07-44); image-based updates with no fleet service (F07-186).
- Raw video moved to an expandable: 640 x 480 x 3 x 30 x 2 x 3,600 = 199.07 GB; / 775 MB = 257 (F05-30). Robot Data
  Factory paragraph unchanged in substance (F07-106).
- MQTT split, shadow and fleet indexing gloss (F07-176, F07-177, F07-182). Parquet "valid only after `finalize()`"
  and "shipped only once a recording session ends" (F05-3).
- Upload paragraphs: 96 + 70 = 166 MB "before any policy" (F07-84, F07-171 and its use note); stream manager a Java
  program needing at least 70 MB (F07-139, F07-171); lite under 15 MB (F07-85); 200 / 5 = 40 parts (F07-102); AWS's
  example recipe "only lists buckets", printed in section 24 (F07-175; AwsOrchestration.tsx prints
  `com.example.ListS3Buckets`).
- `s3:PutObject`, `s3:AbortMultipartUpload`, `s3:ListMultipartUploadParts`: stream manager's own list (F07-175).
- Loop paragraph: 41 s and 38 s medians, "under a minute each way", the authors' own network and model kept
  (F07-109); 3 x 8 = 24 minutes.
- Edge placement: deployment on next connection (F07-123); DDIL quote (F09-119); "one of the two ways a hybrid node
  gets them" (F09-120: IAM Roles Anywhere or SSM hybrid activations); 30 minutes (F09-125); VPN or Direct Connect
  (F09-120 use note).
- Steps: endpoints "for basic operation" plus ECR (F07-190); Java 8 (F07-84).
- Retired services expandable: moved, wording unchanged in substance (F07-98, F07-99, F07-191, F07-183).

### Findings

**M18-R2-1 (minor, carried from m18-4). The abort paragraph's timing claim still lacks "on the illustrative link".**
- Sentence: "At the example's pace, the failed starts that would set the abort off arrive only after every arm has
  been told to update."
- The 3 minutes of notification are the example's (F07-162), but a failed start comes after a download whose length
  is the link's. At 100 Mbit/s one arm alone needs 8 minutes; five arms notified in the first minute on a 10 Gbit/s
  link would finish 30 GB in about 24 s. Item 3 carries the qualifier; this restatement does not.
- Fix: "At the example's pace, on the illustrative link, the failed starts ...".

**M18-R2-2 (minor). The canary group is defined as how a staged update goes, cited to entries that do not mention
canaries.**
- Sentence: "A staged update goes first to a canary group, a few arms in a thing group of their own that take it
  before the rest, and then to the fleet group."
- Cited: F07-121 (thing, core device, thing groups) and F07-123 (deployments). F07-114's use line: describe canary
  "as general software practice, labelled `[our reading]`"; AWS's pages use rollout and abort, and the documented
  near-equivalent is a subdeployment (F07-165, `wave3-iot.md`). The section's own advice ("Stage with a canary group")
  is fine; the definitional sentence reads as AWS's model.
- Fix: "A staged update, the general software practice this section recommends, goes first to a canary group ...".

**M18-R2-3 (minor). "the one point in favour of the S3 route" overlooks what the routes table itself shows.**
- Sentence: "A new S3 key passed in the deployment's configuration spends no version at all, the one point in favour
  of the S3 route."
- The routes table gives the S3 route a different limit that bites (the 120 s install timeout) and neither the 2 GB
  artifact quota (F07-87, which applies to artifacts) nor the 10 GB component store (F07-170) applies to an object
  the install script fetches itself. A route that sidesteps both size limits has at least a second point in its
  favour. This is our judgement, not a register claim.
- Fix: "..., a point in favour of the S3 route."

**M18-R2-4 (minor). "saves more than 81 MB" sets a documented floor against a documented ceiling that AWS's own
measurement exceeds.**
- Sentence: "Nucleus lite, written for constrained devices and documented at under 15 MB of memory, saves more than
  81 MB (96 - 15), little on a board with gigabytes".
- F07-84: "Minimum 96 MB RAM allocated" (a floor). F07-85: "uses less than 15MB RAM". F07-138: AWS measured 15.8 MB
  under six small components (`[vendor claim]`). The subtraction is right; "more than" holds only on the documented
  ceiling.
- Fix: "saves about 80 MB (96 - 15)".

**M18-R2-5 (minor). The DGX Spark "can serve the policy ... through LeRobot's remote inference" rests on an entry that
does not name it.**
- Sentence: "... and a DGX Spark, NVIDIA's desk-side machine, which can serve the policy to an arm through LeRobot's
  remote inference."
- F07-25 (cited) says remote inference moves the checkpoint to a policy server; it names no Spark. F07-29 lists what
  has been validated (policies and robots, a GPU on the same network), and no entry shows LeRobot's server on a Spark.
  Section 17 uses the Spark as an example policy server; the placeholder here plans to test it.
- Fix: "a DGX Spark, NVIDIA's desk-side machine, the example policy server for LeRobot's remote inference in section
  17".

**M18-R2-6 (minor). "No worked example covers the whole path" opens with an absence the search cannot support; the
scope follows the colon.**
- Sentence: "No worked example covers the whole path: none of the AWS posts and samples from 2025 or 2026 that were
  searched runs a GPU policy container on a Jetson with Greengrass V2 and uploads its episodes to S3."
- F07-199: "was located in this research"; use line: "'Not located in two searches and four repositories' is the
  scope". The first clause also reaches beyond AWS, which was the only publisher searched.
- Fix: "No worked example was found for the whole path: none of ...".

Claims checked: about 120 (every changed or moved sentence, table cell, list item, caption, figure label and header in
the round 2 diff, plus the sixteen earlier findings). Findings: 6 (0 errors, 6 minor, one of them carried from m18-4).


## Part 3. Section 19, Agents Running the Loop (`AgentsLoop.tsx`)

Diff `5905bbb..a49ddf6`, rendered text `/tmp/pai-rw/w3-r2/19-agents.txt`, earlier findings accuracy-C Part 1.

### Earlier findings (accuracy-C, Part 1): 23 of 23 resolved

| ID | Status | What the page says now |
|---|---|---|
| E19-1 (pass@8 as recovery) | RESOLVED | Header description "Work out which first-try rates a 99% within eight attempts allows"; opening "That count mixes first tries with retries"; h2 "99% pass@8 counts first tries and retries together"; the close "a 99% within eight attempts is reached by independent tries at 44%". No sentence calls pass@8 a measure of recovery. This follows F04-16's Rewrite check (2026-11-25) on the gloss. The definition sentence raises a new error on the reset, see E19-R2-1. |
| E19-2 (h2 joins fig. 7 and fig. 3 ratios) | RESOLVED | "Eight robots reached the target 2.4 to 3.7 times sooner": 4.7/2.0 = 2.35 (register 4.7/1.983 = 2.37) and 2.5/0.67 = 3.7, both figure 3 (F04-17). |
| E19-3 (scope added to SECURITY.md) | RESOLVED | "for every real-robot command, and neither source says how that fits stations that run unattended" (F04-10). |
| E19-4 (absence moved to targets) | RESOLVED | "The paper does not report the precision and recall its checks achieved" (F04-13). |
| E19-5 ("outright" dropped) | RESOLVED | "outright ... a smaller positive gain is kept only if a paired test ... confirms it" (F04-35). |
| E19-6 (unbacked absence) | RESOLVED | Sentence removed. |
| M19-1 (policy "uses" the failure) | RESOLVED | "the authors credit their retries with seeing the previous failure"; section 3 quote kept. |
| M19-2 (survey widened, SEAR applied flat) | RESOLVED | "By our reading, SEAR's caution about practice and test applies to the 99% as well", F04-14 cited, survey dropped. |
| M19-3 (thesis carried by F04-2) | RESOLVED | The opening paragraph carries no citation; it reads as the section's thesis. |
| M19-4 ("cannot study") | RESOLVED | "a test the agent cannot train on", matching the quote that follows. |
| M19-5 (three widenings) | RESOLVED | "most notable"; the "team-average best success rate" quote (F04-23); "the resource the authors call binding" (F04-21); "such as" on the removed calls (F04-24). |
| M19-6 (fence treated as text only) | RESOLVED | "a written rule whose enforcement is unpublished (ENPIRE)"; table cell "by written rule; the files read show no mechanism enforcing it". |
| M19-7 (SO-101 hardened) | RESOLVED | "No SO-101 adapter appears in the ENPIRE repository's file list at the pinned commit, so the robot interface would be yours to write"; F04-5 chip relabelled "figure 1 and appendix B.2". |
| M19-8 (+/-9.5 belongs to its own levels) | RESOLVED | "gains of +0.9 and +1.3 would sit inside the interval that count gives". A new sentence beside it raises M19-R2-1. |
| M19-9 (uncited entries) | RESOLVED | F04-36 and F04-82 now cited. |
| M19-10 ("the authors report" lost) | RESOLVED | "The authors report 9,269 ...". |
| M19-11 ("dominates the bill") | RESOLVED | "decides the bill", tied to the uncached-work bar (F04-22, 2.6M). |
| M19-12 (missing `<Derived>`) | RESOLVED | Wrappers added on the derived figures. |
| M19-13 (fair share, GPU-hours) | RESOLVED | "the fair-share page names no GPU-hour cap" (F04-51). |
| M19-14 (SIGTERM window) | RESOLVED | "a job that handles SIGTERM has about 30 seconds" (F04-52). |
| M19-15 (consumable resources) | RESOLVED | "no two jobs that declare it", and the submit service adds the declaration (F04-50). |
| M19-16 (Nitro Sandbox details) | RESOLVED | "each pod or task"; the no-network annotation would cut the agent off from its model and Git (F09-43). The replacement clause raises M19-R2-3. |
| M19-17 (caption lost "not measured") | RESOLVED | "Illustrative layout, not measured." restored. |

### Changed sentences checked and holding

- Arithmetic, all redone: toy precision 0.6/0.64 = 0.94 and 0.2/0.28 = 0.71 (labelled toy); 1 - 0.01^(1/8) = 0.438,
  the 44%; 1 - 0.87^8 = 0.67; Wilson lower end 10/13.84 = 0.72 and 50/53.84 = 0.93; 86 ideas / 3.4 h / 8 stations =
  3.2 per station-hour; 3.4 x 60 x 8 / 86 = 19 minutes; 2.5/0.67 = 3.7; 4.7/2.0 = 2.35, about 2.4; 4.5/2.0 = 2.25;
  77/80 = 96%; 105.00/54.41 = 1.9. All carry `<Derived>` or `<Toy>` where they are ours.
- "It is a different quantity from the success rate section 16 counts ... read as one it can make a 44% policy look
  like a 99% one": both 44% figures are `<Derived>`, and the independence condition is in the sentence before.
- F04-22 (2.6M uncached), F04-45 (13 judges, 2,197 attempts, September 2026, the saturation and chance quote), F04-17
  (8 h Push-T, 4 h pin insertion, "an experiment apart from the fleet timings"), F04-36 (five calendar days), F04-53
  (8 h, 15 min), F04-10 use note ("a force bound in the actuator"), F04-25 ("single runs on one simplified task" kept
  as indicative), F04-35 (stagnation forces a strategy-class switch), F04-37 ("an episode's initial state, not its
  outcome"; 22 of 100 flipped), F04-23 (86 ideas, 3.37 h), F04-21 (binding resource), F04-19 (robot idle 50.9%,
  69.1%, 70.2% from 49.1, 30.9, 29.8), F04-4 (the prompt does not define an episode), F04-49 (published budgets), F04-6
  (three endpoints, 30 Hz, 100 Hz), F04-5 (eight stations, one RTX 5090 each), F04-11 (one repository, prompts
  bypassed, internet unrestricted, pruning), F04-9 (six-step order, trial budget), F04-12 (binary check, zip tie two
  views, 150 ms), F09-43 (runtimeClassName `isolated-sandbox`, Kubernetes 1.36, 9 November 2026, the "safely execute
  LLM-generated code" quote), F09-45 (CPU only, GPU passthrough unavailable), F04-50 to F04-52 (Batch facts), AgentCore
  8 h and 15 min idle.
- Cross-references: section 8 (classifier and gamepad, RobotRl.tsx), section 13 of the Learning From Feedback dive
  (The Reward Is a Proxy), section 16 (counting successes, the Wilson interval), section 24
  (`com.example.ListS3Buckets` in AwsOrchestration.tsx). All resolve.
- Design text: "The design that follows is ours, built from AWS documentation" opens the AWS block; the two-graders
  arrangement and the submit step sit under it.

### Findings

**E19-R2-1 (error). Merging "trial" into "attempt" puts a reset before each of pass@8's eight attempts; F04-16 says
one reset per rollout.**
- Sentences:
  - "the reset that puts the scene back before each attempt at the task" (opening);
  - "Code does the first three steps on every attempt: the reset, the run and the success check" (cycle paragraph);
  - "Reset: sets the scene for the next attempt" (loop diagram label);
  - "crossing one ends the attempt and triggers a reset" (limits paragraph);
  - and the definition, which lost its reset: "pass@8 counts a success anywhere in a rollout of up to eight attempts,
    each made after seeing the previous failure".
- F04-16, Rewrite check (2026-11-25): "pass@8 counts a success anywhere in up to eight attempts after one reset ...
  Print it that way." Round 1 printed "one reset followed by up to eight attempts". The page defines an attempt as "one
  try at the task", so with a reset before each attempt every retry would restart from a fresh scene, which is the
  independent-draw case the section sets against the authors' retries. F04-10 says a limit crossing triggers "an
  immediate task failure and an automated reset" and ends "the episode", not an attempt.
- Fix: definition "pass@8 counts a success anywhere in a rollout: one reset, then up to eight attempts, each retry made
  after seeing the previous failure"; opening "the reset that puts the scene back before each rollout"; cycle "on every
  rollout"; label "Reset: sets the scene for the next rollout"; limits "ends the rollout and triggers a reset".

**M19-R2-1 (minor). "its interval is wider still" holds at AgenticRobotics' rates, not near ENPIRE's 97%.**
- Sentence: "A gain is the difference of two such rates, so its interval is wider still."
- `[SPECULATIVE: our arithmetic]` For two independent 100-episode samples at about 60%, the 95% half-width of the
  difference is about 13.6 points against 9.5 for one rate; near 97% it is about 5 points, below 9.5. F04-35 and F04-37
  describe paired, seeded episodes, which can narrow it further. The conclusion of the paragraph (+0.9 and +1.3 sit
  inside the interval) holds either way.
- Fix: "A gain is the difference of two such rates, so at those rates its interval is wider still."

**M19-R2-2 (minor). "the two routes to a grade without a better policy" claims exclusivity the page itself contradicts.**
- Sentence: "Each leaks the task's state or grants a retry, the two routes to a grade without a better policy."
- The opening names a third route, editing the check. F04-24 lists the removed calls ("APIs such as") and does not say
  these are the only routes.
- Fix: "two routes to a grade without a better policy".

**M19-R2-3 (minor). Two clauses on the agent's sandbox go past their entries.**
- (a) "with permission prompts off and, in ENPIRE, unrestricted internet access": the "in ENPIRE" scope covers only the
  internet access, but F04-11 makes both ENPIRE's settings. Fix: "with, in ENPIRE, permission prompts off and
  unrestricted internet access".
- (b) "The first host, for when you need to control the agent's network" and "what that network may reach is the
  setting you control" are cited to F09-43, which says nothing about controlling a sandbox's egress or about AgentCore's
  network. They sit under "The design that follows is ours", so the harm is small. Fix: drop "for when you need to
  control the agent's network", or cite an entry that documents egress control for Nitro Sandboxes.

Claims checked: about 95 (every changed sentence, table cell, diagram label, caption and header in the round 2 diff,
plus the twenty-three earlier findings). Findings: 4 (1 error, 3 minor).
