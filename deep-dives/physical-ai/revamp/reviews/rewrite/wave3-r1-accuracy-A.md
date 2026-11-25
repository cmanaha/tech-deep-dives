# Accuracy review, wave 3 round 1, reviewer A: sections 15, 16, 17

Read from HEAD (f8956ca). Registers: `research/2026-11/*.md`. Before/after text from `/tmp/pai-text-before/` and
`/tmp/pai-rw/w3-r1/`.

## Section 15, Training at Three Scales (`TrainingScales.tsx`)

### Findings

**E15-1 (error). The lost-machine story lands on the wrong number: 29 GPU-hours is the tail after step 75, not what
the run lost. The reader's ~320 is right in size.**
- Sentence: "The eight steps after the last save alone were about 8 x 27 = 216 minutes on eight GPUs, 29 GPU-hours,
  and a save on the machine's own disk dies with the machine."
- Register F04-71: "GRPO training then ran for the 38 h left under the 40 h cap at about 27 minutes per step and was
  stopped by that cap at step 83 of 100." and "No RL eval exists for this run: the timeout exit code tripped the
  script's ERR trap before the latest checkpoint was uploaded, and the instance terminated with the checkpoints of
  steps 25, 50 and 75 on its disk." Claim line: the run "lost its last checkpoints".
- Arithmetic redone. The paragraph opens with the rule "A lost node costs the work of all eight GPUs since the last
  save that survives it", and the text's own facts say all three saves (25, 50, 75) were on the instance's own disk
  when it terminated and that such a save "dies with the machine". So no save survived and the loss runs from step 0:
  83 x 27 = 2,241 min = 37.4 h, x 8 = about 299 GPU-hours; on the source's own "38 h" of training, 8 x 38 = 304
  GPU-hours; on the 40-hour cap the instance ran, 8 x 40 = 320 GPU-hours. 8 x 27 = 216 min = 3.6 h, x 8 = 28.8 = 29
  is arithmetically right but is only the steps after the last save, and the last save did not survive. Even on the
  most generous reading (steps 25 and 50 had been copied off earlier, which the source does not say), the loss is
  steps 51 to 83: 33 x 27 = 891 min, x 8 = about 119 GPU-hours, still four times 29.
- Also: this run was stopped by its own wall-clock cap, not by a lost node; the text says so ("hit its 40-hour
  wall-clock cap"), but the paragraph frames it as the lost-node case. The lesson carries (a save on local disk dies
  with the instance), the number has to be the whole run.
- Fix: "None of the three saves had left the machine, so the run kept nothing: about 38 hours of training on eight
  GPUs, 8 x 38 = <Derived>304</Derived> GPU-hours (<Derived>320</Derived> over the 40 hours the instance ran)." Drop 29.

**E15-2 (error). The frozen-backbone step time is set against a full-weight gradient exchange; the 3% and "more than
double" describe no job.**
- Sentence: "For scale, a step of AWS's frozen-backbone run took about 32 / 52 = 0.62 s: a second of exchange would
  more than double a step of that length, and 16 ms would add about 0.016 / 0.62 = 3%."
- Registers: F09-82 (the 0.62 s step is GR00T N1.7 "projector and diffusion head, backbone frozen", batch 32);
  F08-49 (50 and 3,200 Gbps); the 6.3 GB is the gradient of all 3.14B weights (F02-37).
- Arithmetic reproduces (32 / 52.29 = 0.61 s; 6.3 / 6.25 = 1.0 s; 6.3 GB / 400 GB/s = 15.75 ms; 0.016 / 0.62 = 2.6%),
  but the two halves come from different jobs. A step that trains every weight runs the backward pass and the optimiser
  over all 3.14B parameters and is longer than 0.62 s; the frozen-backbone run exchanges only the gradient of its
  trainable part, which is smaller than 6.3 GB. The preceding sentence also calls both exchange times "floors", so the
  ratio is neither an upper nor a lower bound: the numerator is a floor, the denominator is too short for the job it
  is paired with.
- Fix: drop the step comparison, or say only the order of magnitude: "a full-weight step does more work than the 0.62 s
  of AWS's frozen-backbone step, so on 50 Gbps the exchange is the same order as the step, and on 3,200 Gbps it is
  not."

**E15-3 (error). "the model before N1.7" is wrong: GR00T N1.5 and N1.6 came between.**
- Sentence: "On one A6000 GPU, NVIDIA's GR00T N1, the model before N1.7, fit batches of up to 200 when only its action
  layers trained, and 16 once the vision encoder ... trained as well"
- Registers: F02-35 (GR00T N1.5, 2025), F02-36 (GR00T N1.6, December 2025). F02-34 supports the batch figures and
  marks them vendor reported ("Compute-constrained finetuning was tested in the context of a single A6000 GPU").
- Fix: "NVIDIA's first GR00T release, N1, fit batches of up to 200 in NVIDIA's test on one A6000 GPU ..."

**E15-4 (error). Our arithmetic now reads as the hardware guide's statement.**
- Sentence: "These are indicative figures that real runs miss by up to 50% either way, and at the recorder's default of
  60 s per episode the same 50 episodes are 90,000 frames and each training time doubles. [F01-90]"
- Register F01-90, Wave 2 line: "At LeRobot's default 60 s episode (F01-28) the same 50 episodes are 90,000 frames and
  each time doubles [derived]." The before text said "by our arithmetic each time doubles"; the rewrite dropped that and
  the citation now covers the doubling.
- Fix: "... are 90,000 frames, and by our arithmetic each training time doubles", or wrap the clause in `<Derived>`.

**E15-5 (error). Two author/vendor compute figures lost their owner in the rewrite.**
- Sentences: "Time sends a job here: pi0-FAST, a 3-billion-parameter VLA, trained for about 4 days on 8 H100 GPUs, 8 x
  96 = 768 GPU-hours" and "At the top of the scale, GR00T N1 took roughly 50,000 H100 GPU-hours on up to 1,024 GPUs."
- Registers: F02-28 "benchmark claim (author reported)", "approximately 4 days on 8xH100 GPUs"; F02-34 "benchmark claim
  (vendor reported)", "GR00T-N1-2B used roughly 50,000 H100 GPU hours". The before text carried the owners ("Physical
  Intelligence's authors report training pi0-FAST ...", "NVIDIA prints the total directly"). The chart rows keep
  "Authors' figure" and "NVIDIA's figure"; the prose does not.
- Fix: "pi0-FAST, a 3-billion-parameter VLA, trained for about 4 days on 8 H100 GPUs by its authors' account" and "At the
  top of the scale, NVIDIA reports roughly 50,000 H100 GPU-hours for GR00T N1, on up to 1,024 GPUs."

**M15-1 (minor). "The one-GPU sizes do not have it" generalises from two named sizes.**
- Sentence: "The one-GPU sizes do not have it: g6e.4xlarge (20 Gbps) and g7e.2xlarge go without EFA, and p5.48xlarge
  carries it."
- Register F08-49 lists "the training fabric is absent on the small sizes" and names g6.xlarge, g6e.4xlarge and
  g7e.2xlarge. It says nothing of the larger one-GPU sizes (g6e.8xlarge, g6e.16xlarge, g7e.8xlarge), so "the one-GPU
  sizes" as a class is wider than the entry.
- Fix: "The small one-GPU sizes do not have it: g6e.4xlarge (20 Gbps) and g7e.2xlarge go without EFA ..."

**M15-2 (minor). "cannot be reserved either way" can read as "cannot be reserved".**
- Sentence: "Training plans leave out the G family too, so the G instances of the one-GPU size cannot be reserved
  either way, while an eight-GPU P node can."
- F09-91 and F09-35 support the exclusion from Capacity Blocks and from training plans. On-Demand Capacity
  Reservations do cover G instances (F10-534's location is the EKS guide heading "Consider On-Demand, Amazon EC2 Spot or
  On-Demand Capacity Reservations (ODCRs) for G Amazon EC2 instances"; F10-425).
- Fix: "... so neither a Capacity Block nor a training plan reserves the G instances of the one-GPU size, while both
  reserve an eight-GPU P node."

**M15-3 (minor). The figure description calls all five one-GPU runs fine-tunes; the ACT row trains from scratch.**
- Text: `<desc>` "Five one-GPU fine-tunes sit between half a GPU-hour and 10.9"
- F02-9: ACT is trained "from scratch for each task"; the LeRobot guide's ACT row (F01-90) is the same policy. The body
  text says so correctly ("a small policy from random weights").
- Fix: "Five one-GPU runs sit between ...".

### Checked and holding

Spot two-minute best-effort warning (F09-95); N1.7 run 20,000 steps, 75 episodes, 3.4 h, ml.g7e.2xlarge, 96 GB GPU,
single run, not a benchmark (F09-82); 64 x 4 GB200 x 120 h = 30,720, 30,720 / 3.4 = 9,035 = "about 9,000", energy
estimate caveat kept (F02-39); frozen VLM in the AWS run (F09-82); 200 / 16 = 12.5 (F02-34); 3,144,016,000 x 2 B =
6.29 GB (F02-37, F02-42); openpi > 22.5 GB LoRA and > 70 GB full (F02-54); (70 - 22.5) / 3 = 15.8, 3.14 x 18 = 56.5,
both `<Derived>`; 80 GB+ with `--tune-llm`/`--tune-visual` and under ~35 GB default, 40 GB minimum (F02-42); 41.5 GB at
batch 32 (F09-82); gradient checkpointing quote (F02-80); `--policy.use_peft=true` silent full fine-tune before
v0.7.0, `--peft.method_type=LORA` (F02-83); 640,000 / (3.4 x 3600) = 52.3 and 320,000 / (4 x 3600) = 22.2 (F09-82);
131.33 / 52.3 = 2.51 and the Server Edition GPU (F02-42, F08-53); SmolVLA 4 GPUs, batch 256, "easily ... on a single
GPU" (F02-59); chart values unchanged from the before text and their cites (F02-46, F01-90, F09-82, F02-63, F04-70,
F02-28, F02-71, F02-39, F02-34); V-JEPA 2-AC under 62 h, encoder frozen (F03-1); 4 x 8 x 8 = 256 (F03-21); ACT ~80M,
from scratch, ~5 h on 11 GB RTX 2080 Ti (F02-9); guide's 50 x 30 s, 5 epochs, batch 8 ACT / 4 pi0, 30 to 60 min, 4 to
8 h on A100 40 GB, +/-50% (F01-90); decode and augmentation in workers (F05-107); 4 to 64 vCPUs single-GPU, 24 vCPUs
/ 12 cores per GPU on eight-GPU sizes (F08-57); GR00T on Batch, saves every 2000 of 6000 steps, "up to 2 hours",
2 h / 3 = 40 min (F09-114); 30 minutes or less (F09-11); 6000 x 30 / 120 = 1,500; `--spot`, priority list (F09-81,
F09-82); managed Spot parameters, S3 copy, no On-Demand fallback (F10-536); 8 x 96 = 768, 768 / 24 = 32 days
(F02-28); FSDP on one ml.p5.48xlarge, pi0 3B (F09-83); PyTorch port lacks FSDP and LoRA (F02-55); OpenVLA-OFT 7B,
p5en.48xlarge 8 H200, 31.6 h (F04-70); 25 x 27 = 675 min, cap at step 83, checkpoints on disk (F04-71); EKS two-tier
checkpoint advice (F10-535); FSx for Lustre, image cached, "~5 min cold start" (F09-83); 31 October 2026, three
Regions, Spot fallback (F04-71); Capacity Blocks P and Trainium, no G (F09-91); training plans no G (F09-35);
Telexistence p6-b200.48xlarge, Capacity Blocks, 14B (F09-88); 30,720 / 8 = 3,840 h = 160 days (F02-39); 16 x 8 x 24
= 3,072 (F03-13); 50 Gbps = 6.25 GB/s, 3,200 Gbps p5.48xlarge, g6e.4xlarge 20 Gbps no EFA, g7e.2xlarge no EFA
(F08-49); EFA definition (F08-48); EFA no cross-AZ, HyperPod one AZ (F09-36); Batch EFA cluster placement group
(F09-9); shape C coupling (F08-78, our reading); checkpointless 80%, 16 to 2,000+ GPUs, NeMo language-model recipes,
owner kept (F09-30); tiered checkpointing (F09-31); Spot "tightly coupled" quote (F09-95); Batch MNP no Spot (F09-8);
HPC blog 3 h 25 min, 14%, 55%, three injected interruptions, Slurm, owner kept (F10-58); training plans 1 to 182 days,
up to 64, 8 weeks (F09-34); 20,000 x 64 = 1,280,000; / 192.57 = 1.85 h; / 52.3 = 6.8 h (F02-81, F02-42, F09-82);
cross-references to sections 4, 5, 7, 8, 10, 20, 24 match `revamp/tools/sections.json`.

Claims checked: 96. Findings: 8 (5 error, 3 minor).

## Section 16, Evaluation (`Evaluation.tsx`)

### Arithmetic, redone

Every derived number reproduces with the section's own formulas (z = 1.96, z_power = 0.84):
- Wilson 95%: 40/50 = 66.96 to 88.76 (67.0 to 88.8); 45/50 = 78.64 to 95.65 (78.6 to 95.7); 35/50 = 56.25 to 80.90
  (56.2 to 80.9; 56.2496 rounds down); 80/100 = 71.12 to 86.66; 160/200 = 73.91 to 84.95; 9/10 = 0.596 to 0.982;
  12/12 lower end 1 / (1 + 3.84 / 12) = 0.7576; 243/500 = 44.25 to 52.97 and 425/500 = 81.60 to 87.86 (the sample's
  printed 44.2-53.0 and 81.6-87.9; widths 8.7 and 6.3, "under 9 points").
- Centre 0.7786, half-width 0.1090, z^2/2n = 0.0384, 1 + z^2/n = 1.0768, p(1-p)/n = 0.0032, z^2/4n^2 = 0.000384.
- Wald: 9/10 = 0.714 to 1.086; 40/50 = 68.9% to 91.1%; 12/12 = 1 plus or minus 0.
- Fisher exact, two-sided: 40/50 against 45/50, p = 0.2623 (0.26); 45/50 against 35/50, p = 0.0228 (0.023).
- Sample size: 80% against 90%, 1.96 x 0.50498 = 0.9898, 0.84 x 0.5 = 0.42, (1.41)^2 / 0.01 = 198.8, so 199 (198.96 with
  exact z, still 199). 45% against 55%: 390.8, so 391 (391.3 with exact z = 0.8416, which would round up to 392;
  the text fixes z_power = 0.84, so 391 is consistent with what it shows). 391 / 199 = 1.96, "nearly twice".
- 21.8 to 11.1 points; 5 x 199 = 995; 64 / 8 = 8, 320 / 8 = 40; 100 / 8 = 12.5; 100 x 3,600 / 4,186 = 86.0.

### Findings

**E16-1 (error). "six to eight policies" is not supported for WorldGym, one of the three correlations it covers.**
- Sentences: "These correlations are computed over six to eight policies." and the h2 description "know what a
  correlation over six to eight policies can show". The preceding paragraph lists WorldGym (r = 0.78), HF-WM
  (r = 0.983) and RoboWorld (r = 0.989).
- Registers: F06-89 gives "8 policies" for RoboWorld; F06-90 gives "six RoboArena policies" for HF-WM and no policy
  count for WorldGym ("Pearson correlation of r = 0.78 ... success rates differ by an average of only 3.3%"). New in
  the rewrite; the before text gave no count.
- Fix: "RoboWorld's and HF-WM's correlations are computed over eight and six policies (WorldGym's count is not in
  this research)." and in the description "know what a correlation over a few policies can show".

**M16-1 (minor). PolaRiS's "handful of policies" rests on a count no quoted evidence carries (the F06-83 point).**
- Sentence: "... and then reports an average r = 0.9 against real trials across six paired environments, 0.81 in the
  worst, over a handful of policies."
- F06-83's evidence quotes r = 0.9, the worst-case 0.81 over six environments, r = 0.98 with RoboArena and 20 real
  rollouts per policy; only its use note says "four policies". F06-82's use note lists four (pi0, pi0-FAST,
  PaliGemma-binning, pi0.5), also outside the quote. The before text said "The figure rests on four policies"; the
  rewrite softened it to "a handful", which is not wrong if four holds but is still unquoted.
- Fix: register first: add a Wave 3 line to F06-83 quoting the paper's policy list (section 5.1/5.2). Until then
  drop "over a handful of policies" from the sentence.

**M16-2 (minor). Our arithmetic on RoboWorld's figures lost its label.**
- Sentences: "That is 100 / 8 = 12.5 GPU-hours per policy, and 100 x 3,600 / 4,186 = 86 GPU-seconds to imagine each
  30-second rollout." (no `<Derived>`; the before text opened with "Our arithmetic from their figures"), and in the last
  block "at about 86 GPU-seconds per imagined rollout in RoboWorld's figures", which reads as RoboWorld's own number.
- F06-89 marks both as `[derived]`; the paper prints only "only 100 H100 GPU hours" for 8 policies and 4,186 rollouts.
  The arithmetic is visible in the first sentence, so this stays minor.
- Fix: wrap both quotients in `<Derived>`; in the last block write "about 86 GPU-seconds per imagined rollout by our
  arithmetic from RoboWorld's figures".

**M16-3 (minor). The million-steps figure belongs to one physics engine, which the sentence does not name.**
- Sentence: "8,192 environments of its Cartpole task, state only and with no camera, process about a million
  environment steps a second, policy updates included, in 0.93 GB of GPU memory."
- F06-47: Newton MJWarp 1,023,698 FPS at 0.93 GB; Isaac Sim PhysX 557,215 at 7.12 GB on the same benchmark.
- Fix: "... process about a million environment steps a second with the Newton physics engine ...".

**M16-4 (minor). "A 20-point gap clears the noise" at 50 trials holds near the top of the scale, not everywhere.**
- Sentences: "A 20-point gap clears the noise: 45 of 50 against 35 of 50 gives p = 0.023" and "a 20-point gap shows".
- F06-97 use note: "only differences near 20 points clear it (45/50 against 35/50 gives p = 0.023)". Redone: 40/50
  against 30/50, p = 0.049; 35/50 against 25/50, p = 0.066; 30/50 against 20/50, p = 0.071. The section itself
  teaches that p(1-p) is largest at one half. Carried from the before text, not introduced by the rewrite.
- Fix: "A 20-point gap near the top of the scale clears the noise: ..." and "a 20-point gap near 80 to 90% shows".

**M16-5 (minor). The intro's p-value gloss drops "at least".**
- Sentence: "it finds that two equal policies would look this different about one time in four."
- The later block states it correctly ("equal policies would look at least this different").
- Fix: "would look at least this different about one time in four".

### Checked and holding

ABC validation loss down then up while performance improved, action error significant, loss "is not significantly
correlated", fixed diffusion steps, "cannot reliably predict task success rates or reveal failure modes" (F06-84);
10 to 50 episodes per task (F06-94); SIMPLER three tasks, r = 0.308 averaged, 0.924 matched view, quote, 2024 (F06-81);
REAL-I three closed-loop effects, one team used open-loop error for checkpoint selection and overfitting, ICRA 2026
(F06-85); Telexistence quotes in the expandable (F06-86); LeRobot Wilson rationale quote, Fisher recommendation,
`wilson_interval(9, 10)` = 0.596 to 0.982, sampling-noise-only and seeds quotes (F06-95); Wilson formula (F11-203);
Playground 12 of 12, PolaRiS 20 per policy per environment, ABC 50 per task, STEP quote and 2025 (F06-96); `lerobot-eval`
closed loop, environment server in its own Docker image, `pc_success_ci95` (F06-94); AWS sample 243/500 and 425/500
with intervals (F04-70); no SO-101 simulator, LIBERO and LIBERO-plus wrapped, `sim` robot type (F06-38);
`SO101PickCubeVision` same task code, cube only, no published success rate (F06-26); PolaRiS 2 to 5 minute video
(F06-73), 1k steps on about 350 demonstrations from 15 scenes (F06-74), r = 0.9 over six environments, worst 0.81
(F06-83); LIBERO 90 to 95% quote (F06-82); LIBERO-Plus seven dimensions and quote, LIBERO-PRO quote (F06-87);
Isaac Lab-Arena v0.3 alpha perturbation sweep quote (F06-92); RoboWorld first frame of each RoboArena episode, 30 s,
GPT-4o, 8 policies, 4,186 rollouts, r = 0.989, Spearman 0.970, quote, 100 H100 GPU-hours (F06-89); RoboArena seven
institutions, DROID, own tasks, blind, 600+ episodes, seven policies (F06-88); WorldGym 0.78 and 3.3%, HF-WM 0.983 over
six with GPT-5, Ctrl-World quote and mis-ranking (F06-90); figure caption ranges 0.81 to 0.924 and 0.78 to 0.989
match `EvalLadder` (F06-81, F06-83, F06-89, F06-90); 1X 2024 quotes (F06-91); STEP sequential test and quote, TRI 2024
quote (F06-98); camera factors 6.7 and 62 (F06-48); piRL 64 to 320 environments on 8 H100 (F04-69); Isaac Lab-Arena
5.41, 2,390, 185 and 428 ms, 1,255.2 s and 157.8 s, "7.95x" (F06-93); array job and child index (F09-5); 30 minutes
or less (F09-11); two-minute notice (F09-12); RT cores, P family has none, scoped to the RTX renderer per F06-60's Wave 2
line (F06-60); RLWRLD p5e/p5en and g6e (F09-87); Telexistence p6-b200 and g7e (F09-88); Wilson figure labels and
caption (F06-97); cross-references to sections 1, 4, 5, 6, 8, 12, 13, 14, 24 match `sections.json` and their content
(section 24 runs the 500-episode evaluation as one array job).

Claims checked: 88. Findings: 6 (1 error, 5 minor).

## Section 17, Running on the Robot (`OnRobot.tsx`)

### The new figure (`RtcZones`) and the adapted `docker run` line

- `RtcZones` holds. Labels and `<desc>` match F07-65 (Figure 3: "a_{0:3} are 'frozen' ... full guidance weight of 1",
  "a_{4:10} ... exponentially decreasing guidance weight", "the last s = 5 actions are beyond the end of the previous
  chunk") and F07-66 (weight 1 for the first d, 0 for the last s, decay in between, "actions further in the future
  should be treated with more uncertainty"). 4 frozen + 7 guided + 5 free = 16 slots, the paper's example. The drawn
  weights 0.71, 0.49, 0.32, 0.19, 0.10, 0.04, 0.01 reproduce equation 5 as transcribed in F07-66's use note
  (c_i = (H - s - i) / (H - s - d + 1) with H = 16, s = 5, d = 4): calling the decay "illustrative" is the safe label,
  since F07-66 asks for a check against the rendered paper. "d = 4" under frozen and "s = 5" under free are the paper's
  symbols for those zones. The paragraph's mapping of LeRobot's `execution_horizon` to the paper's H - s is our
  reading (F07-65 use note) and is consistent: the admission rule d <= H - s <= H - d is the same inequality as the
  paper's d <= s <= H - d.
- The run line holds. `--rm`, `--network=host` and the two `-e` variables are in the cited F07-150 example
  ("docker run --network=host -e AWS_CONTAINER_AUTHORIZATION_TOKEN -e AWS_CONTAINER_CREDENTIALS_FULL_URI --rm
  list-s3-buckets"); `--runtime nvidia` is from the two AWS samples (F07-157, cited in the paragraph above and named in
  the "ours" line); `--device /dev/video0` and `--device /dev/ttyACM0` are declared ours, and F07-156 confirms no AWS
  page shows them; the image placeholder is AWS's own (F07-153), so "our choice" undersells it, which is harmless. The
  title says "assembled, not yet run on a device".

### Arithmetic, redone

149.0 / 33.3 = 4.47; 40 / 30 = 1.33 s; 357.9 / 33.3 = 10.75; 0.25 m/s x 149.0 ms = 37 mm, x 357.9 ms = 89 mm; 40.00 -
5.18 = 34.8; 149.0 / (1,333 + 149.0) = 10.1%, cycle 1.48 s; 357.9 / (1,333 + 357.9) = 21.2%; 40 / 2 = 20 ticks, 20 /
4.5 = 4.4; floor(4.47) = 4; 0.5 x 30 = 15; 0.5 - 0.0333 = 0.467, / 0.149 = 3.1; 97 / 76 = 1.28; 18 + 44 = 62; 10 x
33.3 = 333 ms; 16 x 20 = 320 ms; 357.9 / 149.0 = 2.40, 200.8 / 116.6 = 1.72, 106.8 / 76.8 = 1.39; 357.9 - 149.0 =
208.9 (the largest saving in the table); 76.8 / 35.6 = 2.16, 35.6 / 33.3 = 1.07 periods; 45 - 17.2 = 27.8 and 27 -
13.6 = 13.4; 132 / 54 = 2.44, 54 - 49 = 5; 6 / 102 = 59 ms = 1.8 periods; 273 / 204.8 = 1.33; 209.9 / 101.1 = 2.08;
149.0 / 76.8 = 1.94; 96 MB / 8 GB = 1.2%, 15.8 MB / 8 GB = 0.19%; 5 s x 0.25 m/s = 1.25 m. All reproduce except the
rounding in M17-5.

### Findings

**E17-1 (error). The text has the paper round NVIDIA's Orin median; the paper only defines the floor, and the
application is ours.**
- Sentence: "The paper rounds the 149.0 ms Orin median at 30 Hz, 4.47 ticks, down to 4; rounding up to 5 freezes one
  action more, the safer side when calls run longer than the median."
- Register F07-63: the paper defines "d := floor(delta / Delta-t)"; applying it to 149 ms and 33.3 ms is the use note's
  "Worked example input" (ours). The paper never saw NVIDIA's Orin figure. F07-15's use note, for LeRobot, rounds the
  other way ("dividing by the control period and rounding up").
- Fix: "The paper's definition, d = floor(L / dt), takes the 149.0 ms Orin median at 30 Hz, 4.47 ticks, down to 4;
  rounding up to 5 ..."

**E17-2 (error). "no quantised figure at all" widens the scope from NVIDIA's table to everything NVIDIA publishes.**
- Sentence: "For the Orin, NVIDIA publishes no quantised figure at all."
- Registers: F07-4 "No other device has a quantised figure in the table"; F07-58 use note "The repository table has no
  quantised row for Orin"; F07-83 records NVIDIA documenting FP8 KV-cache storage for Orin in TensorRT-Edge-LLM, and
  U13 (which precisions TensorRT accelerates on Orin) is open. The before text said "No other device in the table has a
  quantised figure". The same section keeps the right scope a few blocks later ("the only device in the table with a
  quantised figure").
- Fix: "For the Orin, NVIDIA's table has no quantised figure."

**M17-1 (minor). GR00T N1.7 on a Jetson Orin under LeRobot's settings: hedged once, applied three more times without
the hedge.**
- The hedge: "LeRobot's guide gives its settings for SmolVLA, pi0 and pi0.5, while GR00T N1.7 ships with NVIDIA's own
  deployment path, so read the Orin numbers as worked arithmetic."
- Unhedged uses: (a) "For a chunk of 40 the call may take about 20 ticks ... The compiled Orin median takes 4.5, so a
  worst call up to about four times the median still fits." (b) "it holds until the slowest round trip passes 0.5 -
  0.033 = 0.467 s, about three times the 149.0 ms Orin median", which also sets an on-device call against a remote
  turnaround that "includes encoding, network, queueing, inference and decoding" (F07-26). (c) The closing paragraph's
  "NVIDIA's compiled Orin median, 4.5 ticks against the 20 that half a 40-tick chunk allows, leaves room for a worst
  call about four times longer".
- What the entries support: remote inference has run ACT, SmolVLA, XVLA, EVO1 and LaWAM on real robots (F07-29), not
  GR00T; RTC settings are given for SmolVLA, pi0 and pi0.5 (F07-15) and trained mode needs pi0.5 (F07-17); LeRobot's
  Jetson container targets JetPack 6.2 (F07-34) while the 149.0 ms is NVIDIA's JetPack 7.2 TensorRT path (F07-9). No
  entry shows GR00T N1.7 running under LeRobot's asynchronous backends on any Jetson. Each use is arithmetic, not a
  claim of a working run, so this stays minor. Also: LeRobot v0.7.0 does ship a `groot` policy wrapping N1.7 (F02-47),
  so "while GR00T N1.7 ships with NVIDIA's own deployment path" should not read as "LeRobot lacks it".
- Fix: move the hedge up to the opening block ("NVIDIA's figure, from NVIDIA's own TensorRT path; this research found
  no documented LeRobot asynchronous run of GR00T N1.7 on a Jetson, so the sections below apply LeRobot's rules to
  NVIDIA's number"), and in (b) compare the 0.467 s with a turnaround (for example the measured 108.76 ms and 138.98 ms
  chains of F07-68), not with an on-device call.

**M17-2 (minor). "with an older software stack" rests on an entry the sentence does not cite, and understates the
difference.**
- Sentence: "A third-party paper measured GR00T N1.7 at 209.9 ms on an AGX Orin and 101.1 ms on an AGX Thor, 2.08
  times, with an older software stack".
- F07-73 (cited) gives the figures; F07-74 (not cited) gives the conditions: TensorRT 10.3 and 10.13, only the action
  head compiled with the backbone in eager PyTorch, timing that excludes preprocessing and host-to-device transfer.
- Fix: cite F07-74 and write "with an older software stack and only the action head compiled".

**M17-3 (minor). The model card's slower Orin figure gets a single cause the card does not state.**
- Sentence: "Fewer images, and slower, because the backbone ran uncompiled".
- F02-40, Wave 2: the 216.5 ms is "TensorRT on the action head only, 'because TRT 10.3 does not support the backbone
  engine'". The build also ran an older TensorRT; "because" is our reading (plausible, given F07-7's "dominates
  inference time").
- Fix: "Fewer images, and slower, with the backbone left uncompiled on an older TensorRT".

**M17-4 (minor). "avoids" is stronger than the guide's "reducing".**
- Sentence: "keep the default join, aligned: it drops the incoming actions whose time has passed and replaces only the
  future, which avoids backward bumps between chunks."
- F07-27: "Remove incoming steps already passed and replace only the future, reducing backward bumps between
  independent chunks."
- Fix: "which reduces backward bumps between chunks".

**M17-5 (minor). Rounding of the frame-transfer time.**
- Sentence: "about 1.8 MB for two 640x480 frames, which is about 14 ms of every turnaround on a gigabit link".
- F07-28: 640 x 480 x 3 = 921,600 bytes per frame. Two frames are 1,843,200 bytes = 14.7 Mbit, 14.7 ms at 1 Gbit/s;
  14 comes from the rounded 1.8 MB.
- Fix: "about 15 ms".

### Checked and holding

149.0 ms TensorRT and 357.9 ms PyTorch on "Jetson Orin", vendor owner kept (F07-1, F07-5); action horizon 40, LIBERO
checkpoint, batch 1, four denoising steps, two 256x256 inputs, preprocessing and decoding in, RPC out (F07-2); median
of 60 calls, MAXN, "do not measure closed-loop task success" (F07-3); 216.5 ms model-card figure (F02-40); frame up to
33.3 ms old and no published camera or bus timing on an SO-101 (F07-118); cadence sample 5.18 / 40.00 / 0.67 / 620.00
ms, hardware unnamed (F07-23); workstation chains 97.43 / 96.89 model, 6.89 / 21.20 network, 1.44 / 11.22 resize,
108.76 / 138.98 total, 50 calls, wired LAN, spreads (F07-68); figure values (F07-1, F07-5, F07-68, F07-118);
synchronous stop quote (F01-87) and the dynamics shift (F07-62); remote-inference failing-case quote and remedies
(F07-22); d = floor(delta/dt) and d <= s <= H - d (F07-63, F07-65); local RTC in a background thread, remote client
loads no weights, Zenoh (F01-40, F07-20, F07-25); refill formula and 0.5 s default (F07-26); append, aligned and RTC
joins (F07-27); raw RGB default, JPEG 90, congestion drops observations (F07-28); five validated policies and the
"has not been validated yet" quote (F07-29); seam quote and the obstacle picture (F07-64); inpainting, hard-mask
weakness, soft-mask quote (F07-65, F07-66); backward pass per step, 2.5x per step, 76 to 97 ms, 62 ms unchanged
(F07-13, F07-67, F07-17); `execution_horizon` 10, 8 to 12, `max_guidance_weight` 10.0 for SmolVLA, pi0, pi0.5
(F07-14, F07-15); LINEAR code default with to-do, EXP recommended (F07-14, F07-16); training-time RTC prefix, 0 to 10
delays, 200 ms quote, better at delays of 2 or more (F07-70, F07-71, F07-72); trained mode needs pi0.5 and the
admission rule (F07-17, F07-18); 480 episodes, 28 hours, "no degradation", "degrades linearly", protective stop
(F07-69); seven engines and "dominates inference time" (F07-7); TensorRT build-time selection and 11.5 (F07-76);
compile factors (F07-1); BF16 default and the optimised profile's caching, fusion and CUDA graphs, 35.6 ms (F07-4);
FP8 E4M3 and FP4 E2M1 (F07-81); NVFP4 per-block scaling, native on Thor, 10 calibration samples (F07-58); FP16
overflow quote (F07-53); ViT at FP32 "for accuracy" (F07-7); accuracy-sensitive layers at FP8, 27 to 13.6 and 45 to
17.2 ms, one camera (F07-57, F07-56); pi0.5 on Thor 132 / 54 / 49 ms at action horizon 10 (F07-51); LIBERO 20/20 and
19/20 on an H100, BF16 engine (F07-10); tutorial asserts unchanged success with no figure (F07-59); cosine 0.9995 and
0.9946 (F07-52) against the 0.999 verify step (F07-8); engine records TensorRT version and compute capability 8.7 /
11.0 / 12.1, "will fail to deserialize" (F07-79); 2 to 5 minute builds (F07-8); hardware compatibility on Arm SBSA
only, not JetPack (F07-77 with its Wave 2 line); TensorRT pinned to 10.16.1.11 on Spark (F07-9); Orin Nano Super 8 GB,
102 GB/s, 7 to 25 W (F07-36); pi0.5 weights "~6 GB+" (F07-54); no Orin Nano latency for SmolVLA or ACT (F07-117);
AGX Orin 64GB 204.8 GB/s, 15 to 60 W (F07-35); Thor T5000 128 GB, 273 GB/s, 40 to 130 W, "7.5x" claim owned by NVIDIA
(F07-39); Spark 128 GB, 273 GB/s, 240 W supply, 140 W chip (F07-47); Spark slower than Thor with no reason given
(F07-6); MIG on Thor under JetPack 7.2 (F07-46); JetPack 7.2.2 on Ubuntu 24.04 for both families (F07-44); GR00T guide
drops JetPack 6 (F07-9); LeRobot Jetson Dockerfile JetPack 6.2, community-maintained (F07-34); Greengrass definition and
nucleus (F07-120); component, recipe and artifacts (F07-122, F07-151); private-ECR recipe copied verbatim (F07-153);
pin by tag or digest (F07-154); no GPU or device flag in the four AWS recipes (F07-156); `--runtime nvidia` in AWS
samples and `--runtime nvidia --gpus all` in NVIDIA's command (F07-157, F07-11); TES certificate, role, one hour, in
memory (F07-148); container needs host network and two variables, less secure (F07-150); Java nucleus 2.18.4, 256 MB
disk, 96 MB RAM (F07-84); lite drops the CLI (F07-135); 14.6 and 15.8 MB on a Raspberry Pi 4, AWS's measurement owned
(F07-138); 64-bit Arm Linux with no distribution named (F07-140); lite packages name Ubuntu 24.04, no Jetson (F07-142);
placeholder dated and scoped; local RTC budgets 5 s, 10 s and "starting values" quote (F07-21); starvation grace 1 s
then fault (F07-20); symptom table rows (F07-62, F07-64, F07-22, F07-69, F07-79, F07-8); cadence-report reading quote
(F07-24); cross-references to sections 3, 4, 5, 16 and 18 match `sections.json`.

Claims checked: 131. Findings: 7 (2 error, 5 minor).
