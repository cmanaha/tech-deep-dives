# Accuracy review, wave 3 round 3, reviewer F: sections 17, 18, 19 (confirming check)

Read from HEAD (e027b5f) with `git show`; diffs as given in the task (17: 4e4d22d..763b214; 19: a49ddf6..be3fcea;
18: db6ac27). Rendered text from `/tmp/pai-rw/w3-r3/`. Registers: `research/2026-11/*.md` (unchanged in the working
tree). Earlier findings from `/tmp/pai-rw/review/w3r2/accuracy-D.md`. The blind points are from
`/tmp/pai-rw/review/w3r3/adversarial-X.md` (doc-B is section 17, doc-D is section 19).

## Part 1. Section 17, Running on the Robot (`OnRobot.tsx`)

### Earlier findings (accuracy-D Part 1): 7 of 7 resolved

| ID | Status | What the page says now |
|---|---|---|
| E17-R2-1 (device-stack caption lost "a plan") | RESOLVED | "A plan assembled from AWS's and NVIDIA's documents, read from the top: ..." |
| M17-R2-1 ("NVIDIA does not name the module") | RESOLVED | The parenthetical is deleted, so nothing widens F07-5's use note. The scoped statement stays in the board h2: "NVIDIA's table says 'Jetson Orin' without naming the module". The opening now carries no module hedge at all; see M17-R3-5 (blind point 3). |
| M17-R2-2 ("The one difference the guide does state") | RESOLVED | "One difference the guide does state is software". The sentence before it was reworded and now widens F07-6: see M17-R3-1. |
| E17-R2-2 (h2 "must be built on the device") | RESOLVED | "and on a Jetson every engine must be built on the type of board that runs it" (F07-77 and its Wave 2 line: "type of device", JetPack only). |
| M17-R2-3 (`--device` stated flatly) | RESOLVED | "The camera and the servo bus can be passed with Docker's `--device` flag, which no AWS page read shows." (F07-156 use note.) |
| M17-R2-4 (Greengrass recipes "leave out" the flags) | RESOLVED | h2 description: "with the flags the recipes in AWS's Greengrass guide leave out" (F07-156; F07-157's samples are not in the guide). |
| M17-R2-5 (15.8 MB without load and version) | RESOLVED | "measured nucleus lite's v2.5.0 packages at 15.8 MB with six small components on a Raspberry Pi 4 (14.6 MB idle)" (F07-138). |

### Changed sentences checked and holding

- Opening: "can answer four or five control periods late and still keep the SO-101 supplied with an action on every
  tick": 149.0 / 33.3 = 4.47 (F07-5), inside the half-chunk bound of 20 ticks for a 40-action chunk (F07-2, F07-22).
  "Two things ... A third thing shortens the call itself" restates F07-2, F07-5.
- "so a shorter call takes its saving off the age of every action"; 37 mm and 89 mm (0.25 m/s x 149.0 ms and
  357.9 ms; F01-83).
- "up to one camera frame period old, 33.3 ms": F07-118's derived 1/30 s for a 30 fps camera.
- Two-part model and "step count" gloss; conditions list (F07-2, F07-3); 216.5 ms "with one camera instead of two
  ... There TensorRT compiles only the action head, on an older TensorRT release, and the backbone runs uncompiled"
  (F02-40 Wave 2: "TensorRT (DiT-only)", "because TRT 10.3 does not support the backbone engine").
- "An illustrative sample report in LeRobot's documentation ... on hardware it does not name": F07-23 ("the doc's
  illustrative figures, with no hardware named"); 40.00 - 5.18 = 34.8, "about 35".
- RTC chain paragraph: RTC gloss "makes each new chunk continue the motion already under way" (F07-12, "guiding the new
  chunk so it aligns smoothly"); 50 calls, wired Ethernet, desktop and NUC (F07-68); "barely moved" (97.43 vs 96.89);
  138.98 - 108.76 = 30.2, "about 30"; network 21.20 - 6.89 = 14.3 plus resize 11.22 - 1.44 = 9.8 is 24.1 of 30.2,
  "most of it"; resize "on its CPU" (F07-68 quote). Jitter: model +/-0.16 and +/-0.28, network +/-3.12 and +/-2.39,
  "about 0.2 ms" and "2 to 3 ms".
- Chart caption: 97.43 + 6.89 + 1.44 + 3.00 = 108.76; 96.89 + 21.20 + 11.22 + 9.67 = 138.98 (F07-68).
- "Do this arithmetic again ... NVIDIA timed GR00T N1.7 on its own TensorRT path, which on an Orin needs JetPack 7.2
  ... while LeRobot's Jetson container targets JetPack 6.2" (F07-9: "Orin uses JetPack 7.2 ... JetPack 6.x ... is no
  longer supported"; F07-34). The second half raises M17-R3-3.
- "Local RTC runs the method on the robot computer itself, the policy in a background thread with no network in the
  path" (F01-40, F07-20).
- Chunk clock, now 40 actions: ask at 40 - 15 = 25, fast call lands at 30, slow call at 55, old chunk ends at 40.
  Caption "the slow call also breaks the half-chunk rule of 20 ticks, and no refill value would save it" (30 > 20;
  F07-22 "no refill value fixes that"). Frames re-derived from the constants: the dry frame (48) is past 40 and before
  55; the fast landed frame (36) drops old cells from 30. Step 3's "5 ticks: the 149.0 ms ... rounded up" holds.
- Append: "plays out the rest of the old chunk and then starts the new one at its first action, so every action of the
  new chunk plays late by the actions that were left when the request went out: 15 ticks, half a second". F07-27:
  "Preserve the full accepted execution slice ... the next chunk can begin from an older observation". Ask at 25,
  15 left, new action 0 plays at 40: 15 late.
- Refill paragraph: aligned join, action i plays i ticks after its frame; ask at action 25, plus the 5-tick call,
  last action about 30, 30 / 30 = 1.0 s, 0.25 x 1.0 = 250 mm; compiled against PyTorch is 208.9 ms x 0.25 = 52 mm
  (89 - 37); the 25 ticks of H minus the refill are "the larger part". The quote "Higher usually requests earlier;
  lower allows more of the plan to execute." is verbatim in F07-26.
- Network paragraph: "The remote path has run five policy types on real robots, ACT (section 4) and SmolVLA among
  them" (F07-29: ACT, SmolVLA, XVLA, EVO1, LaWAM); both quotes verbatim (F07-29).
- Inpainting: `d = floor(L / dt)`, 4.47 down to 4 (F07-63); frozen first `d` (F07-65); "The actions past the old
  chunk's end have no counterpart and are generated freely" (F07-65). Caption "a delay of 4 ticks with 7 guided
  actions and 5 free ones": a4 to a10 is 7, last s = 5 (F07-65). The free zone's "s = 5" label is gone, which removes
  the clash with LeRobot's usage.
- `inference_delay`: "4 for the Orin median, or 5 if you round its 4.47 ticks up" (F07-15, F07-63).
- `execution_horizon`: "the frozen and guided zones together, 11 in the figure" (4 + 7); "10 by default, typically 8
  to 12" (F07-14, F07-15); "decaying schedules run from `inference_delay` to `execution_horizon`" (F07-16).
- Constraint mapping: with LeRobot's horizon equal to the paper's H - s, `d <= s <= H - d` becomes
  `d <= H - s <= H - d`, the same form (F07-65), and LeRobot's trained-mode check has that form (F07-18). "4 to 36";
  "the default 10 fits with 6 actions guided"; PyTorch 357.9 / 33.3 = 10.7, so 10 or 11, where 10 - 10 leaves no
  guided zone and 11 > 10 breaks the lower bound.
- `max_guidance_weight` "10.0 by default, the value LeRobot gives for the 10-step flow matching of SmolVLA, pi0 and
  pi0.5" (F07-15); "LeRobot's guide gives no value for a four-step head" is scoped to the guide (F07-2: four steps).
  Applicability: M17-R3-3. Schedule code/doc disagreement unchanged (F07-14, F07-16).
- Trained mode: "the same constraint with the trained delay in place of `inference_delay`" (F07-18).
- "In this table compiling paid most where the call was longest": 208.9 ms is the largest saving across all six rows
  of F07-1 (next is L40, 88.7).
- BF16 "keeps the eight-bit exponent of FP32"; FP16 "five-bit exponent ... overflows in the attention layers ...
  'compounds over the denoising loop'" (F07-53); "These policies default to BF16" (F07-4 "unquantized BF16 remain the
  defaults"; F07-53).
- FP8 1 + 4 + 3, FP4 1 + 2 + 1 (F07-81); 2 x 2 x 2 x 2 = 16; NVFP4 as FP4 plus a per-block scale (F07-81 use, F07-58).
  The credit sentence raises M17-R3-2.
- Thor tutorial split, "timed with one camera where the README uses two" (F07-56, F07-2); 45 - 17.2 = 27.8, 27 - 13.6
  = 13.4 (F07-57).
- "On JetPack there is no way around the rule. Elsewhere the way around it is a hardware compatibility mode, which
  TensorRT 11.5.0 adds only on Arm server-class Linux" (F07-77: "not supported on ... NVIDIA JetPack. Starting in
  TensorRT 11.5.0, hardware compatibility is supported on Linux ARM SBSA"); Spark pinned to 10.16.1.11 (F07-9).
- "so budget on a board's timed call, not on its memory" (our advice, follows from 116.6 against 76.8 at equal
  memory); "on the older TensorRT pinned for it" (F07-9).
- "The Thor's Blackwell GPU runs NVFP4 natively, and the Thor is the only device in the table with a quantised figure,
  35.6 ms; the table has none for the DGX Spark" (F07-4: "No other device has a quantised figure in the table";
  F07-58).
- JetPack paragraph (F07-44, F07-9, F07-34). Blind point 4 is ruled in Part 4.
- Greengrass h2 title and description; "a `docker run` line in the `Run` step of that recipe's lifecycle" (F07-153:
  "starts it with a plain `docker run` in the `Run` lifecycle"). Snippet title "the AWS samples' Jetson flags": both
  samples pass `--rm`, `--runtime nvidia` and `--network host` (F07-157).
- Footprint: 96 / 8,192 = 1.2%, "about 1%"; 15.8 / 8,192 = 0.19%, "about 0.2%" (F07-84, F07-138, F07-36); "beside a
  policy whose weights take about 6 GB or more, as pi0.5's do" (F07-54).
- Install expandable: Java runtime and 256 MB of disk (F07-84); lite "drops some, the Greengrass command-line tool on
  the device among them" (F07-135); "it runs Docker containers" (F07-86: "Run Docker containers in components | Yes |
  Yes | Yes"); platforms (F07-140, F07-142).
- Table cell "Switch to local RTC or remote inference" (F01-40).
- Closing: infer and observe shares (F07-24); "620.00 ms against a 0.67 ms mean in LeRobot's own sample, is the
  blocking save of an episode" (F07-23 quote and use note); pacing headroom quote (F07-24); 4.5 against 20.

### Findings

**M17-R3-1 (minor). "NVIDIA gives no reason for the gap" widens a statement about one README to NVIDIA.**
- Sentence: "... 116.6 ms against 76.8 ms compiled in the same table, so budget on a board's timed call, not on its
  memory. NVIDIA gives no reason for the gap."
- F07-6 use note: "The README gives no reason; one stated difference is the software stack (F07-9). `[our reading]`".
  This is the same widening M17-R2-1 removed for the module name.
- Fix: "NVIDIA's README gives no reason for the gap."

**M17-R3-2 (minor). The NVFP4 credit is narrowed to the per-block scaling; the tutorial credits the format, a 4-bit
floating-point format with per-block scaling, against 4-bit integer formats.**
- Sentence: "NVIDIA credits the per-block scaling with 4-bit quantisation \"without the accuracy collapse you would get
  from 4-bit integer formats\"."
- F07-58: "Thor's Blackwell GPU has native NVFP4 support, a 4-bit floating-point format with per-block scaling, which
  is what makes the aggressive quantization in this tutorial possible without the accuracy collapse you would get from
  4-bit integer formats." The contrast is floating point against integer as much as it is scaling.
- Fix: "NVIDIA credits NVFP4, floating point with a scale per block, with 4-bit quantisation \"without the accuracy
  collapse you would get from 4-bit integer formats\"."

**M17-R3-3 (minor; blind point 2). The RTC settings are worked for GR00T N1.7, but the register puts LeRobot's RTC
configuration on four other policies.**
- Sentences: "and LeRobot, though it wraps GR00T N1.7, gives its RTC settings for three other vision-language-action
  policies of section 5, SmolVLA, pi0 and pi0.5"; then "`inference_delay` is d ... 4 for the Orin median, or 5 if you
  round its 4.47 ticks up"; "For a chunk of 40 at the compiled Orin median that is 4 to 36"; and "so treat 10.0 as a
  starting point and sweep it on your arm".
- F02-31: "RTC is a first-class module in LeRobot v0.7.0: a `policies/rtc` package, an `rtc_config` field on the pi0,
  pi0.5, pi0-FAST and SmolVLA configs" (Wave 2: "RTC as a module with `rtc_config` on four policies", HOLDS).
  F02-47: LeRobot "wraps GR00T N1.7". No entry shows an RTC configuration on LeRobot's GR00T policy or a GR00T run
  with RTC in LeRobot. F07-15's "SmolVLA, Pi0, Pi0.5" scopes only the 10.0 guidance value. The method itself applies to
  flow policies (F02-30: "applicable to any diffusion- or flow-based VLA"; F02-38: GR00T's head "remains flow-matching
  DiT"), so the arithmetic is sound; what the page leaves open is whether the reader can set these values on GR00T in
  LeRobot v0.7.0, and "sweep it on your arm" implies they can.
- Fix, in the "Do this arithmetic again" paragraph: "and LeRobot v0.7.0, though it wraps GR00T N1.7, attaches its RTC
  configuration to pi0, pi0.5, pi0-FAST and SmolVLA, so the RTC values worked below are the arithmetic for any policy
  with GR00T's call time, not a GR00T setup LeRobot documents." And in the guidance sentence: "LeRobot's guide gives no
  value for a head with fewer steps, such as GR00T's four, so on such a policy treat 10.0 as a starting point and sweep
  it."

**M17-R3-4 (minor; blind point 1). The run line gives the container one camera; the dive's arm and LeRobot's own RTC
example use two.**
- Snippet title: "The policy's docker run line: the AWS samples' Jetson flags, plus the camera and the servo bus";
  line `--device /dev/video0 --device /dev/ttyACM0`; ours line: "Our choices: the two --device paths; the line has not
  been run on a device". Paragraph: "The camera and the servo bus can be passed with Docker's `--device` flag".
- F07-19: LeRobot's real-robot RTC command passes two cameras, `gripper: {... index_or_path: 1 ...}, front: {...
  index_or_path: 0 ...}`. F07-156 use note picks `--device /dev/video0` "for a camera". Section 2 describes the arm as
  having "six motors and two cameras", and the section's own benchmark conditions are "two 256x256 camera images"
  (F07-2). Copied as printed, a two-camera policy gets one. The snippet may not change, so the fix goes in the title,
  the ours line and the sentence.
- Fix: title "... plus one camera and the servo bus"; ours "the two `--device` paths, for one camera and the servo
  bus; a second camera, as on the two-camera arm of LeRobot's RTC example, takes another `--device` flag; the line has
  not been run on a device"; sentence "Each camera and the servo bus can be passed with its own Docker `--device`
  flag, which no AWS page read shows."

**M17-R3-5 (minor; blind point 3). The Orin ratio is set against AGX Orin figures without saying the module is
assumed, and its direction depends on that assumption.**
- Sentence: "... 209.9 ms on an AGX Orin and 101.1 ms on an AGX Thor, 2.08 times ..., and NVIDIA's own table gives 1.94
  times for its Orin: far below the peak claim, and above the bandwidth ratio."
- F07-5 use and U1: "Which Orin module 'Jetson Orin (MAXN)' is in the Isaac-GR00T table (AGX Orin 64GB is likely; not
  stated)". The peak claim is "7.5x the performance ... of AGX Orin" (F07-39 use) and the bandwidth ratio is 273 /
  204.8 for the AGX Orin 64GB (F07-35). `[SPECULATIVE: our arithmetic]` Were the module an Orin NX 16GB (102.4 GB/s,
  F07-35) or an Orin Nano Super (102 GB/s, F07-36), the bandwidth ratio would be 273 / 102.4 = 2.67, and 1.94 would
  sit below it. The device table hedges ("149.0 ms is labelled only 'Jetson Orin'" in the AGX Orin row); this
  sentence does not, and the opening ("on a Jetson Orin, a small computer built to ride on a robot"), which carries the
  149.0 ms through the first half of the section, no longer names the gap at all.
- Fix: "and NVIDIA's own table gives 1.94 times for its unnamed Orin: if that is an AGX Orin, as is likely but not
  stated, far below the peak claim and above the bandwidth ratio." Optional, opening: "on a Jetson Orin, a small
  computer built to ride on a robot (NVIDIA's benchmark table does not name which Orin module)".

**M17-R3-6 (minor; blind point 6). The 6 GB behind the 59 ms bound is a storage prerequisite at an unstated
precision, and the page does not say so.**
- Sentence: "pi0.5, the policy of NVIDIA's Thor tutorial, needs about 6 GB or more for its weights alone, so a policy
  of that size leaves little of the board for anything else. Bandwidth sets a lower bound too: a call reads every
  weight at least once, so at that size and 102 GB/s it takes at least 6 / 102 = 59 ms".
- F07-54: "NVMe SSD recommended (model weights are ~6 GB+)", in the tutorial's prerequisites, before the FP8/NVFP4
  build; no precision is stated (the chain starts from a "JAX Checkpoint"). F07-53 says pi0.5 "uses BF16 natively",
  which does not date the 6 GB to BF16. The blind review's "6 GB is the BF16 figure" is not in any entry. The page does
  not apply the figure to GR00T: it names pi0.5 and says "at that size". The arithmetic holds (6 / 102 = 58.8 ms, 1.76
  periods). What is missing is what the size is, and that the bound falls with the bytes actually read: the page's own
  quantisation paragraph says fewer bits move less memory. The register has GR00T N1.7's own size: "GR00T N1.7 is a ~3B
  parameter model (bfloat16)" (F02-42), about 6 GB at two bytes a number `[derived]`, so the bound carries over to the
  section's policy at BF16.
- Fix: "pi0.5, the policy of NVIDIA's Thor tutorial, lists about 6 GB or more of weights among its storage
  prerequisites, at a precision the tutorial does not state, and GR00T N1.7 is about 3 billion parameters in BF16,
  about 6 GB at two bytes each. Loaded at that size, a policy leaves little of the board for anything else. Bandwidth
  sets a lower bound too: a call reads every weight at least once, so at 6 GB and 102 GB/s it takes at least 6 / 102 =
  59 ms ...; an engine quantised to fewer bits reads fewer bytes and lowers the bound." (F02-42 would need adding to the
  paragraph's citations.)

Claims checked: about 115 (every changed or moved sentence, caption, figure label, constant-derived frame and header
in the round 3 diff, the seven earlier findings, and the six blind points). Findings: 6 (0 errors, 6 minor; 4 of them
from the blind points).

## Part 2. Section 19, Agents Running the Loop (`AgentsLoop.tsx`)

### Earlier findings (accuracy-D Part 3): 4 of 4 resolved

| ID | Status | What the page says now |
|---|---|---|
| E19-R2-1 (a reset before each attempt) | RESOLVED | Definition paragraph: "A rollout is one reset followed by up to eight attempts, and pass@8 counts a rollout as a success if any of its attempts succeeds. No reset comes between the attempts". Opening: "the reset that puts the scene back"; cycle: "Code does the first three steps on every rollout"; label: "Reset: sets the scene for the next rollout"; limits: "crossing one fails the rollout at once and triggers a reset" (F04-10: "an immediate task failure and an automated reset"). |
| M19-R2-1 ("wider still" at any rate) | RESOLVED | "\"100 held-out episodes give a +/-9.5-point interval\", at the success rates it was measuring ... so at those rates its interval is wider still: about 9.5 sqrt(2) = 13.4 points when the two counts are independent". 9.5 x 1.414 = 13.4, marked Derived. |
| M19-R2-2 ("the two routes") | RESOLVED | "two routes to a grade without a better policy". |
| M19-R2-3 (sandbox clauses) | RESOLVED | (a) "and ENPIRE runs it with permission prompts off and unrestricted internet access" (F04-11). (b) "for when you need to control the agent's network" is gone; the network sentence now reads "where that network may reach is a limit to design separately", which claims nothing for F09-43. |

### Against the corrected F04-16 line

F04-16, Rewrite check (2026-11-25): "pass@8 counts a success anywhere in up to eight attempts after one reset; it
mixes first-try skill and recovery and cannot be split without a first-try rate, which the paper's text does not
give." The page holds on every point:
- One reset: "A rollout is one reset followed by up to eight attempts ... No reset comes between the attempts".
- Success anywhere: "pass@8 counts a rollout as a success if any of its attempts succeeds".
- Mixes the two: "That count mixes first tries with retries"; h2 "99% pass@8 counts first tries and retries
  together".
- Cannot be split: "the paper's text gives no first-try rate for its final policies to show where in that range the
  99% sits".
- Not a recovery measure: no sentence calls it one. The only "recover" is the project page's own case ("a policy that
  cannot recover from a failure, which 'stays near pass@1'"), not a gloss on pass@8.
- "their definition does not say how that failure is passed on to the next attempt" is scoped to the quoted
  definition. F04-16's claim line says "in-context retries" without a quote for it, so the scope is the right one.

### Changed sentences checked and holding

- 0.56^8 = 0.0097, so 1 - 0.0097 = 99.0%; 1 - 0.01^(1/8) = 0.438; 1 - 0.87^8 = 0.67. "67% if every retry is a fresh
  draw, 13% if a retry after a failure almost never succeeds" (F04-16 project-page quote). "A first try below 44%
  reaches it only if retries succeed more often than first tries" holds: if no retry beats p, pass@8 <= 1 - (1-p)^8.
- h1 description, "one agent-run loop reports" (F04-16).
- Station: "No policy work leaves the station" and "That one 32 GB card carries all the station's GPU work" (F04-5:
  "All policy inference and on-station computation run on this single GPU, with no shared cluster or off-station
  compute"); reset detection and GPU motion planning (F04-14); "Two arms and three cameras" (F04-5).
- Precision advice "state the share of failures the check may pass, the figure that belongs to the check": in the toy,
  that share is 0.1 in both cases (0.04 / 0.4 and 0.08 / 0.8). Blind point 6 is ruled in Part 4.
- "a running best averaged over the team": an unpacking of the quoted name (F04-23), recorded as such in
  `revamp/claims/agents.md`.
- "keeps the change only if it passes the configured gates: enough successes, and no regression on what already
  worked" (F04-9: "the configured success and regression gates").
- "The agent's loop is counted in minutes per idea, the arm's in milliseconds per action": 19 agent-minutes per idea
  (derived in the section) against 33 ms at 30 Hz (F04-6).
- Caption: the diagram's box titles are "The agent may change" and "Frozen: the agent reads, never changes"; "not
  measured" kept.
- Limits split in two paragraphs; force bound, unattended stations, SECURITY.md quotes (F04-10).
- h2 description, "a model check"; "13 such models" (F04-45: "13 VLM-based detectors"); "no model above 0.60"
  (F04-45 quote).
- "the project page's data for the 86 ideas gives each one's time, its agent and whether it raised the best rate, with
  no episode count" (F04-23: "{relMin:...,idx:...,hid:...,agent:...,raised:...}").
- 22 of 100 flipped with the total unchanged (F04-37). "Without the count, a reader cannot tell ENPIRE's one-point
  gains from noise" follows from +0.9 and +1.3 against 13.4.
- Gate: "a gate against false promotions" (F04-35 abstract: "false-promotion control"); the 63% to 56.5% over 1,200
  episodes quote is in F04-35's use line, from Sec 4.2, which the citation now names; 1.5w and the paired test
  (F04-35). 5.6 to 10.0 points (F04-37).
- "AdaRSI, an agent loop tested on the SO-101 itself" (F04-85: "SO-ARM101").
- pass@8 h2: "The authors contrast their retries with best-of-N sampling, where each attempt is a fresh, independent
  draw" (F04-16: "Unlike measuring success by i.i.d. best-of-N sampling, where each attempt is independent").
- "So the 99% covers the task from that phase on ..." sits under "By our reading" (F04-14, F04-84).
- "So the robots did not set the fleet's pace; the agents did, and left the robots idle more than half the time at
  every fleet size": idle 50.9%, 69.1%, 70.2% (F04-19); agent activity (F04-21). "a number the operator approves in
  advance" (F04-9 "approved number of real-world trials"; F04-49 "operator-approved trial budget").
- Tokens: "The paper does not say whether the fleet figures count cached input, and its numbers suggest they do not
  ... the match is a hint, not proof": 2.5M (F04-20), 80M and uncached work 2.6M (F04-22), and F04-22's use note
  ("which suggests Fig. 7 does not count cached input; the paper does not say").
- Harness and camera paragraphs: 54.41, 62.01, 105.00; 105.00 / 54.41 = 1.93; 54.67, 72.32, 99.18; "The authors
  suggest why no images beat the tool" paraphrases F04-25's "This suggests ... repeated image function calls introduce
  additional overhead".
- Batch: "Set the timeout from the longest training run one idea should need" (advice under "The design that follows
  is ours"); consumable resources and fair share (F04-51, F04-52).
- Nitro Sandboxes: "isolated mode is there to 'Protect the node and other pods from a compromised workload'" (F09-44
  quote); network annotation "boots the sandbox with no network device" (F09-43 use line).
- AgentCore: 8 hours and 15 minutes idle "by default" (F04-53 claim line: "the idle timeout defaults to 15 minutes");
  campaign lengths (F04-17, F04-36).
- Close: success check, judge, reset, start states, limits; "with independent tries, a first try of 44% is already
  enough for 99% within eight".

### Findings

**M19-R3-1 (minor; blind point 3). The order paragraph drops the authors as owners of the "binding resource" claim,
gives it as the reason for the instruction file's order, and renames it "scarcest". No entry says why real attempts
are capped.**
- Sentences: "Every idea follows one order, set in the repository's instruction file, and the order spends robot time
  last, because on hardware the budget of real attempts, not compute, is the loop's scarcest input." Later: "What stays
  scarce on hardware, in the authors' words 'the agent's robot-access budget, not its compute', is the number of real
  attempts each idea may spend, a number the operator approves in advance. That cap binds even while robot hours go
  unused."
- F04-21's use line: the related-work section says "we ... run the loop directly on hardware, where the binding
  resource is the agent's robot-access budget, not its compute" (Sec 5.2). F04-9 gives the order ("Run only the
  approved number of real-world trials") with no reason for it. F04-49: the budget is "operator-approved". Round 2 had
  "the resource the authors call binding" (M19-5's fix); round 3 states it in the page's voice and makes it the cause
  of the order. On the blind point: no entry gives a reason for capping real attempts (wear, supervision, reset
  failures or risk are not in F04-9, F04-10, F04-14, F04-21 or F04-49; F04-14 notes reset reliability is unreported,
  U3). The later sentence reconciles "scarce" with the 70% idle figure correctly (the cap is a count set in advance, so
  it limits each idea whatever the robot's idle time), but "That cap binds" is our reading of the authors' "binding",
  not a measurement.
- Fix: order paragraph: "... and the order spends robot time last, on the resource the authors call binding on
  hardware: 'the agent's robot-access budget, not its compute'." Pace paragraph: "What the authors call binding on
  hardware, 'the agent's robot-access budget, not its compute', is a count: the real attempts each idea may spend,
  which the operator approves in advance. A count set in advance limits each idea however long the robot sits idle;
  the sources read do not say why the operator caps it."

**M19-R3-2 (minor). The new h2 states as the cause of the sub-linear speed-up what the authors report as
underutilisation.**
- Header: "Eight robots bought less than four times the speed, because the agents set the pace".
- "less than four times" holds (3.7, 2.4 and 2.25; F04-18, F04-20). F04-21 says "Robot and compute resources are
  underutilized" because agents spend time "reading logs, writing code, debugging, or waiting for the language-model
  backbone" and summarising peer branches. It does not say this is why eight robots bought 2.4 to 3.7 times rather
  than eight; F04-18 reports the speed-up with no cause. The body's "The cause is the agent's pace" carried the same
  reading in round 2; the h2 now makes it the section's headline.
- Fix: "Eight robots bought less than four times the speed, and the robots waited on the agents".

**M19-R3-3 (minor; blind smaller fault). "The prompt's objective gives the smaller figure" is right only for one of
its two possible referents.**
- Sentence: "The prompt's objective gives the smaller figure. On pin insertion, the authors report the time to
  complete it as 4.5 hours with one agent and 2.0 with eight, 4.5 / 2.0 = 2.25 times faster."
- The preceding sentence prints two speed-ups, 3.7 (pin insertion, first target, F04-18) and 2.4 (Push-T). The
  objective's 2.25 (F04-20) is smaller than both, so the statement is true of the speed-up, and it is smaller than
  pin insertion's 3.7 on the same task. "the smaller figure" reads as "the smaller of the two just given", which is
  2.4, a figure the objective does not give. Read as time, the objective gives the larger figures (4.5 and 2.0 h
  against 2.5 and 0.67 h).
- Fix: "The prompt's objective gives a smaller speed-up still. On pin insertion, ... 4.5 / 2.0 = 2.25 times faster,
  against 3.7 to the first target."

Claims checked: about 85 (every changed sentence, diagram label, caption and header in the round 3 diff, the four
earlier findings, the corrected F04-16 line, and the three blind points). Findings: 3 (0 errors, 3 minor).

## Part 3. Section 18, The Fleet (`Fleet.tsx`), commit db6ac27

All six minor findings of accuracy-D Part 2 are fixed as proposed. No later commit touches `Fleet.tsx`
(`git log db6ac27..HEAD -- Fleet.tsx` is empty).

| ID | Status | What the page says now |
|---|---|---|
| M18-R2-1 (abort timing without the link) | RESOLVED | "At the example's pace, on the illustrative link, the failed starts that would set the abort off arrive only after every arm has been told to update." |
| M18-R2-2 (canary group as AWS's model) | RESOLVED | "A staged update, the general software practice this section recommends, goes first to a canary group" (F07-114 use: canary as general practice). |
| M18-R2-3 ("the one point in favour") | RESOLVED | "a point in favour of the S3 route". |
| M18-R2-4 ("saves more than 81 MB") | RESOLVED | "saves about 80 MB (96 - 15)"; 96 - 15 = 81, "about 80" keeps F07-84's floor against F07-85's ceiling. |
| M18-R2-5 (Spark "can serve the policy") | RESOLVED | "the example policy server for LeRobot's remote inference in section 17 (Running on the Robot)"; section 17 says "for example a DGX Spark on the desk" (F07-25). |
| M18-R2-6 ("No worked example covers") | RESOLVED | "No worked example was found for the whole path" (F07-199 scope). |

Claims checked: 6. Findings: 0.

## Part 4. Blind points that are questions of fact or applicability

### Section 17 (doc-B)

| Blind point | Ruling | Basis and correction |
|---|---|---|
| 1. The run line passes one camera, `/dev/video0`, while the setup has two | **minor** (M17-R3-4) | F07-19's two-camera RTC command, section 2's two-camera arm, F07-2's two images. Fix the title, the ours line and the sentence as in M17-R3-4; the snippet stays. |
| 2. Whether LeRobot's real-time chunking runs on GR00T N1.7, given the worked `inference_delay` and `execution_horizon` | **minor** (M17-R3-3) | F02-31 puts `rtc_config` on pi0, pi0.5, pi0-FAST and SmolVLA; no entry shows it on LeRobot's GR00T wrapper. Say the worked values are the arithmetic for a policy with GR00T's call time, not a documented GR00T setup. |
| 3. Which Orin module the 149.0 ms belongs to, and whether the ratio treats it as an AGX Orin | **minor** (M17-R3-5) | U1: not stated, AGX Orin 64GB likely. The ratio sentence compares against AGX Orin figures, and its "above the bandwidth ratio" would flip for a 102 GB/s module. Hedge the ratio; optionally restore a scoped hedge to the opening. |
| 4. JetPack 7.2 for NVIDIA's TensorRT path against LeRobot's JetPack 6.2 container: is the reader left without a path? | **holds** | Both requirements are stated correctly (F07-9, F07-34), and the page claims no combined setup: "Do this arithmetic again with your own call, timed on the software you will run, because the Orin figure and LeRobot's settings come from different stacks." F07-34's use note frames it the same way: "A reader with an Orin Nano must pick which stack to flash." No entry documents LeRobot on JetPack 7.2 or LeRobot driving NVIDIA's TensorRT engines, so the page cannot name a tested path. Optional, register-backed clarifier for the JetPack paragraph: "The two stacks are documented separately, so on one Jetson you choose one; LeRobot's remote inference can keep its client on the robot and serve the policy from another machine (F07-25)." |
| 6. The 6 GB pi0.5 weights for a GR00T N1.7 bandwidth bound: what precision, and does the page say so? | **minor** (M17-R3-6) | The page applies it to "a policy of that size", not to GR00T by name. F07-54's ~6 GB+ is a storage prerequisite at no stated precision (the blind review's "BF16 figure" is not in the register). F02-42 gives GR00T N1.7 as "~3B parameter model (bfloat16)", about 6 GB at two bytes `[derived]`. Say what the 6 GB is, add GR00T's own size, and say the bound falls with fewer bits. |
| 11. RTC's "no degradation": degradation of which metric? | **holds** | The page matches F07-69's quote: "RTC is completely robust to injected delay, showing no degradation, whereas synchronous degrades linearly". Neither the quote nor the claim line names the metric. The page cannot add one without a new register entry from the paper's section 4.2 and Figure 6, which F07-69's location already points to. The imprecision is in the register, not a departure from it. |

### Section 19 (doc-D)

| Blind point | Ruling | Basis and correction |
|---|---|---|
| 3. "scarcest input" beside "a robot stood idle the other 70% of the time": does a register say why real attempts are capped? | **minor** (M19-R3-1) | No. F04-9 and F04-49 say only that the trial budget is operator-approved; F04-21's "binding resource" is the authors' related-work claim, not a measured cause. The page drops the owner and makes it the reason for the order. Restore "the authors call binding" and say the sources give no reason for the cap. |
| 6. Is "the share of failures the check passes" the false-positive rate, for the numbers printed? | **holds** | Taking "positive" as the check's pass, the toy check passes 0.04 of 0.4 failing attempts and 0.08 of 0.8, so its false-positive rate is 0.1 in both cases, the "one in ten" the page prints. The page does not use the name, which is not an accuracy fault. If the name is added, it must be "false-positive rate", the share of true failures passed. It must not be confused with 1 - precision, the false discovery rate (0.04 / 0.64 = 0.06 and 0.08 / 0.28 = 0.29), which is the figure that moves. |
| Smaller fault: "The prompt's objective gives the smaller figure" | **minor** (M19-R3-3) | The speed-up is 2.25 (F04-20), smaller than both 3.7 and 2.4, but "the smaller figure" points at 2.4. Fix: "gives a smaller speed-up still ... against 3.7 to the first target." |

## Summary

- Section 17: about 115 claims checked; earlier findings 7 of 7 resolved; new findings 6 (0 errors, 6 minor).
- Section 18: 6 claims checked; earlier findings 6 of 6 resolved; new findings 0.
- Section 19: about 85 claims checked; earlier findings 4 of 4 resolved; new findings 3 (0 errors, 3 minor).
