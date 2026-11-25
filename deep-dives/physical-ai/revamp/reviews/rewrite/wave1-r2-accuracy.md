# Accuracy review, wave 1 round 2 (sections 5 to 8)

Text reviewed: `git show 636ebff:deep-dives/physical-ai/src/sections/<Comp>.tsx` and
`git show 636ebff:deep-dives/physical-ai/src/components/figures/JepaPasses.tsx`. Fix diff:
`git diff 5153f7b 636ebff -- deep-dives/physical-ai/src` (round 1 reviewed 6384f0b, whose `src` is identical to
5153f7b). Registers: `deep-dives/physical-ai/research/2026-11/` at HEAD (unmodified in the working tree; includes
the F03-124 correction line from 984f70c). Citation links checked against `src/data/registry.json` at 636ebff.
Sentences are quoted as rendered (JSX entities resolved). Only sentences the fix diff changed or added were
re-checked; unchanged text was not re-reviewed.

Severity as in the brief: `error` = wrong, unsupported, or a qualifier lost; `minor` = imprecise, not misleading.

---

# Section 5, `vla`, `VisionLanguageAction.tsx`

## Round 1 findings

| ID | Closed | Current sentence at 636ebff |
|---|---|---|
| 5-E1 | yes | "GR00T N1's 120 Hz needs 120 / 16 = 7.5 chunks a second from a head that, by our arithmetic from NVIDIA's 63.9 ms per chunk on an L40, can sample at most 15.6, each of 16 actions." (7.5 and 15.6 in `Derived`) |
| 5-E2 | yes | "The same paper reports 63.9 ms on that L40 to sample one chunk, the run of future actions a policy returns in one answer (section 4, Learning From Demonstrations), and a chunk holds 16 actions." Also "the paper's 63.9 ms on an L40 bounds it" and the closing sentence above. |
| 5-E3 | yes | "NVIDIA's own pages print several for GR00T N1.7 on one Jetson AGX Thor, and among the three TensorRT figures below the slowest is 93.8 / 35.6 = 2.6 times the fastest." The three listed are 93.8 ms (TensorRT full pipeline, F02-40), 76.8 ms (TensorRT full pipeline) and 35.6 ms ("TensorRT optimized + mixed NVFP4"), both F02-41: all TensorRT. 93.8 / 35.6 = 2.63. |
| 5-E4 | yes | List label: "`pi05`, whose LeRobot example (a LIBERO fine-tune at batch 64) is sized for an 80 GB GPU." Matches F02-57 and `wave2-A.md` row 38. |
| 5-E5 | yes | "NVIDIA reports, for the Unitree G1 and after its inference optimisations, one prediction in 38 ms on an RTX 5090 desktop GPU and 124 ms on the robot's Jetson Thor, an NVIDIA onboard computer for robots, where the model plans 1.6 s chunks about once per second and a separate controller executes them at 50 Hz." Matches `wave2-A.md` row 29. |
| 5-m1 | yes, see 5-N1 | "In the models covered here, the parameter count on an announcement is, or is nearly, the sum of two networks, and the rate in hertz printed beside it can be the speed of neither. The larger of the two, the backbone, is a model that already reads images and text." |
| 5-m2 | yes | "By our arithmetic that is 1000 / 63.9 = 15.6 chunks a second at most, with room for 15.6 x 16 = 250 actions a second." `Derived` on 15.6 and 250 at all four places (opening x2, formula paragraph x2, closing). |
| 5-m3 | yes | "In pi0 and in GR00T N1, what crosses from backbone to head is vectors, and it crosses by attention, the transformer operation in which one token reads from others." |
| 5-m4 | yes | "GR00T N1's head attends to the output vectors of its VLM." (F02-33: "cross-attends to the VLM output tokens") |
| 5-m5 | yes | "X-VLA, a 0.9B model in LeRobot, feeds the model 32 learned vectors per robot type, called soft prompts, and LeRobot's fine-tuning example keeps them trainable. Its authors report 93% success on LIBERO, a suite of simulated manipulation tasks, from tuning 9M parameters, 1% of the model." (F02-82 claim: "the fine-tuning example runs 20,000 steps with the soft prompts trainable") |
| 5-m6 | yes | "For GR00T N1, 120 actions a second in chunks of 16 need 120 / 16 = 7.5 chunks a second if every action of every chunk is played, and the timing allows 15.6." |
| 5-m7 | yes | "The last two put the slow side on another machine; for Gemini Robotics, in our reading, the chunk is what covers the delay the link adds." |
| 5-m8 | yes | "One set of weights does both." |
| 5-m9 | yes | "the requirement is more than 8 GB of memory to run pi0 by openpi's table, and 16 GB to run GR00T N1.7 by NVIDIA's guide." |
| 5-m10 | yes | "Even for SmolVLA, at 450M parameters and pretrained on 4 GPUs, the authors report about 30k GPU-hours across their whole project, a total that covers every experiment and not one pretraining run." (F02-59 claim and Use line) |
| 5-m11 | yes | "A 7B backbone leaves the one-GPU size: the OpenVLA-OFT authors fine-tuned across 8 A100 or H100 GPUs." |
| 5-m12 | yes | "In our reading of the lines below, the model in the news and the model you can fine-tune are usually different models." |
| 5-m13 | yes | "It is LeRobot's own recommendation for a first policy: small and trained on your recordings alone, with no pretrained robot model to download (its ResNet-18 image backbone starts from weights trained on ImageNet, a public set of labelled photos)." Cite F02-11 added; its quote `"ResNet18_Weights.IMAGENET1K_V1"` supports it, and the registry link opens `configuration_act.py`. |
| 5-m14 | yes | "Packages marked Yes come first: those with a recipe or checkpoint for the SO-101, and those whose documentation spells out the padding, slot mapping or re-initialisation that admits it." Checked every "Yes" row of `POLICIES`: act, gaussian_actor, smolvla, groot, eo1 (recipe or guide), g05, molmoact2, flux3 (checkpoint), pi0, pi0_fast, pi05 (padding), lingbot_vla_v2 (slot mapping), vla_jepa (re-initialisation). Each falls in one of the two kinds. |
| 5-m15 | yes | "The fine-tune is a single-GPU run of hours, and the published requirement that gates it is GPU memory, set by how much of the backbone trains". F08-76 row 8: "GPU tensor cores, with GPU memory as the gate". |
| 5-m16 | yes | "the published result on this arm is 90% against ACT's 70% when the object starts where the demonstrations started, and 50% against 40% when it does not, as the SmolVLA authors report." |
| 5-m17 | yes | "The fast rate counts actions, and a longer chunk raises it without one more call to the model." and "The first factor is the cheap one: a longer chunk raises the action rate without one more call to the model." |
| 5-t1 (GR00T 2 relabel) | yes | "GR00T 2 is the current form of the idea, and under the agent it changes the action model too." |

Closed: 23 of 23.

## New findings in changed sentences

### 5-N1. `minor`. The narrowed opening still covers a counterexample in the same section

- Sentence: "In the models covered here, the parameter count on an announcement is, or is nearly, the sum of two
  networks, and the rate in hertz printed beside it can be the speed of neither."
- Register: F02-44 quote: "One diffusion transformer denoises future video and robot actions together." F02-45
  quote: "a smaller joint video-action transformer (2B parameters)". The section covers GR00T 2 later, in the cuts list and the paragraph after it.
- What is imprecise: "the models covered here" includes GR00T 2, whose parameter count is one transformer, not
  a backbone plus a head. The section itself describes it as one network, so the reader is not misled for long.
- Replacement: "In most of the models covered here, the parameter count on an announcement is, or is nearly, the
  sum of two networks, and the rate in hertz printed beside it can be the speed of neither."

## Also checked in changed sentences, holds

- "63.9 ms on that L40" and "by our arithmetic": F02-34 quote "63.9ms on an L40 GPU using bf16"; F02-33 Use
  `[derived]`. Arithmetic: 1000 / 63.9 = 15.65; 15.6 x 16 = 249.6; 120 / 16 = 7.5.
- "the robot's Jetson Thor": F02-45 quote "124 ms onboard Jetson Thor".
- "NVIDIA's own pages print several": F02-40 (model card) and F02-41 (deployment README) hold six Thor figures
  between them.
- ImageNet gloss ("a public set of labelled photos"): common knowledge; the weights name in F02-11 is
  `IMAGENET1K_V1`.
- The SmolVLA item above still calls ACT "the small trained-from-scratch policy of section 4" (unchanged text). It
  matches the register's own options-table label "scratch (ImageNet ResNet-18)", and the ACT item now carries
  the ImageNet caveat, so it does not reopen 5-m13.

Counts, section 5: 31 changed or added sentences, about 45 claims (numbers, owners, qualifiers, citations)
checked. Round 1: 23 of 23 closed. New findings: 1 (0 error, 1 minor).

---

# Section 6, `world-models`, `WorldModels.tsx`

## Round 1 findings

| ID | Closed | Current sentence at 636ebff |
|---|---|---|
| 6-E1 | yes | "Both kinds first encode the frame into vectors, called a latent." The fixer's departure from the replacement ("vectors" for "a grid of vectors") is right: LeWorldModel's latent is one vector of width 192 (F03-32). |
| 6-E2 | yes | "The two examples met below, DreamZero and GR00T 2, are video models, and the DreamZero authors list "learned latent representations" among the things such a model could predict." |
| 6-E3 | yes | "Inside, in the two models priced below, each call still denoises video, so its price is the pixel family's product again, with the parameter count behind every pass." Heading: "A world-action model answers in one call, and in DreamZero and GR00T 2 the call still denoises video". |
| 6-m1 | yes, see 6-N1 | "The pixel family predicts a latent that must still be able to redraw every pixel, and in NVIDIA's Cosmos 3 examples produces it by running a transformer of billions of parameters 35 times." Also "A pixel generator such as Cosmos 3 runs a transformer of billions of parameters tens of times per clip". |
| 6-m2 | yes | "It is loose in between: pixel models are used to train and to score policies, and the authors of one latent model write that theirs can be." (F03-90, F03-92; F03-88 for RoboJEPA) |
| 6-m3 | yes | "The generators cited here do not predict those numbers one by one." |
| 6-m4 | yes | "The examples NVIDIA gives for Cosmos 3 use 35 passes, a figure this research records without the verbatim line." and "At those 35 passes the transformer makes 35 x 2,400 = 84,000 token updates". F03-95 still has 35 only in its Use line. |
| 6-m5 | yes | "By our arithmetic that is 189 / 24 = 7.875 s of video, or 207.78 / 7.875 = 26.4 seconds of compute for each second of it." and "From NVIDIA's figures for Cosmos3-Nano, by our arithmetic, budget 26.4 seconds of H100 compute per second of 720p video". 189 / 24 = 7.875; 207.78 / 7.875 = 26.385. |
| 6-m6 | yes | "... or the 31 GiB floor with a large host (the time is NVIDIA's native PyTorch row, the floors are those of its NIM container)." F03-98 "native PyTorch, BF16"; F03-121 rows "nano, BF16, None, Resident ... 58 GiB" and "nano, BF16, Layer, Offloaded ... 31 GiB, 64 GiB host". |
| 6-m7 | yes | "Beyond smaller settings and more hardware, the authors name two changes of method that could shorten it in future work: ..." |
| 6-m8 | yes | "Among the five times charted the families do not overlap: each pixel-family time is 300 ms or more per candidate, and each latent-family time is 2 ms or less." |
| 6-m9 | yes, see 6-N2 | Caption: "Each bar is one time to imagine one candidate, with its GPU: the top bar as NVIDIA lists it, the others our division of a planning time its authors published by the number of candidates; the faint end of the last bar is a range." Top bar in `CANDIDATES` is the Cosmos3-Nano rollout, 2.0 s, printed by NVIDIA (F03-99). |
| 6-m10 | yes | "with their optimisations, closed-loop control at 7 Hz on 2 GB200 GPUs." |
| 6-m11 | yes | Table row: "GR00T 2 (whitepaper, code not yet released)". |
| 6-m12 | yes | "280 tokens per compressed frame and camera at 224 x 320 pixels, so 3 x 280 = 840 per compressed frame if each of the three camera views of the robot it was timed on is fed at that size." |
| 6-m13 | yes | "That is one frame; the notes give no PyTorch peak for a full 189-frame video (served through TensorRT-LLM they record 50,623-52,147 MiB after a 189-frame warm-up) and none for an action-conditioned rollout." Judgement below. |
| 6-m14 | yes, see 6-N3 | "Today that is a VLA such as GR00T N1.7, the newest GR00T with released weights and code, or one of the world-action models LeRobot v0.7.0 packages (section 5, Vision-Language-Action Models, lists both): of the two priced above, DreamZero's 7 Hz took two GB200 GPUs, and GR00T 2 has no code yet." Cite F02-102 added. |
| 6-m15 | yes | "For the SO-101 on your bench, the family you can train from scratch and take apart on one GPU is the latent one (section 7, JEPA)." |
| 6-m16 | yes | "Every use of a world model but the last one below is this function called many times, so each has the same bill: the number of rollout steps it needs, times the price of one step." The last use below is the world-action model ("The last thing that can come back is the action itself"). |

Closed: 19 of 19.

## Judgement on 6-m13: printing the source's MiB figures

The fixer was right, and the register correction is right.

- F03-124 quote: "TensorRT-LLM with the shipped `cosmos3-nano-1gpu.yaml` 50,623-52,147 MiB after the default
  720x1280x189 warm-up".
- Arithmetic redone: 50,623 / 1,024 = 49.44 GiB; 52,147 / 1,024 = 50.92 GiB. The claim sentence's "50.6 to 52.1
  GiB" is the MiB figure divided by 1,000, which is neither GiB nor decimal GB (in GB the range is 53.1 to 54.7).
  The correction line added in 984f70c ("That is 49.4 to 50.9 GiB ... Print the source's MiB figures") is
  correct.
- Printing the verbatim MiB range is the safest form: it adds no conversion of ours, and the sentence does not
  call it a peak, which matches the quote (no "peak" on that figure). "after a 189-frame warm-up" keeps the
  quote's condition; the 720 x 1280 size is implied by the box's 1280 x 720 context.
- Follow-ups outside this section, not counted here:
  1. F03-124's Use line still says "a serving warm-up for the 50 to 52 GiB figure"; the correction line names only
     the claim sentence. Extend it to the Use line.
  2. Section 11 (Augmentation and Synthetic Data) prints the wrong conversion at 636ebff and at HEAD:
     `Augmentation.tsx` line 334, "sits at about 50.6 to 52.1 GiB when served through TensorRT-LLM". Same in
     `revamp/claims/augmentation.md` line 33. Replace with "50,623-52,147 MiB" as in section 6.

## New findings in changed sentences

### 6-N1. `minor`. The 35 passes are printed at first use without the hedge 6-m4 added

- Sentence: "The pixel family predicts a latent that must still be able to redraw every pixel, and in NVIDIA's
  Cosmos 3 examples produces it by running a transformer of billions of parameters 35 times."
- Register: F03-95, Evidence quote has no 35; the number is only in its Use line ("35 in the model card's
  examples"). The fix for 6-m4 hedges the second mention ("a figure this research records without the verbatim
  line"); this first mention, new in the fix for 6-m1, states it flat.
- Replacement: "The pixel family predicts a latent that must still be able to redraw every pixel, and in NVIDIA's
  Cosmos 3 examples produces it by running a transformer of billions of parameters tens of times." (Or add the
  model-card line to F03-95 as a quote, and both hedges can go.)

### 6-N2. `minor`. The new caption clause misdescribes the last bar's divisor

- Sentence: "the others our division of a planning time its authors published by the number of candidates"
- Register: F03-118 Evidence: "0.98 s / 45,000 = 21.8 microseconds", with 45,000 or 15,000 the candidate steps
  (300 samples x 30 or 10 iterations x horizon 5). The bar's own label reads "22 to 65 microseconds per step", and
  the list item under the chart says "one step of one candidate". For the other three divided bars the horizon is
  1, so candidates and candidate steps coincide.
- Replacement: "the others our division of a planning time its authors published by the number of candidates (for
  the last bar, by the number of candidate steps)"

### 6-N3. `minor`. LeRobot's world-action models offered for "an action several times a second" with no timing behind them

- Sentence: "Today that is a VLA such as GR00T N1.7, the newest GR00T with released weights and code, or one of the
  world-action models LeRobot v0.7.0 packages (section 5, Vision-Language-Action Models, lists both): ..."
- Register: the bullet's heading is "An action several times a second". F02-84 (`cosmos3`: 30 denoising steps,
  memory only), F02-88 (`fastwam`: "No training memory figure is printed"), F02-90 (`flux3`: "No GPU model, memory
  figure or wall-clock time is printed"), F02-93 (`lawam`: "No memory or GPU figure"), F02-94 (`lingbot_va`:
  "the slowest inference loop in the list by step count"), F02-96 (`longwam`: tested on a GB200, no time). No
  entry gives an inference latency or rate for any of them; only GR00T N1.7 has one (F02-40, 10.7 Hz on Thor).
- What is imprecise: the sentence places these models under a rate requirement no entry shows they meet. This is
  the round 1 replacement wording, which fixed the opposite implication (that no world-action model can be run).
- Replacement: "Today that is a VLA such as GR00T N1.7, the newest GR00T with released weights and code, or one of
  the world-action models LeRobot v0.7.0 packages, for none of which this research found a published inference
  time (section 5, Vision-Language-Action Models, lists both): of the two priced above, DreamZero's 7 Hz took two
  GB200 GPUs, and GR00T 2 has no code yet."

## Also checked in changed sentences, holds

- 6-m2 support: F03-90 Dreamer 4 trains its agent inside a frame-generating model; F03-92 lists
  Cosmos3-Nano-Sim-Bimanual for "Closed-loop interactive robot policy simulation"; F03-88 RoboJEPA "evaluate or
  improve any policy".
- 6-m14 cross-reference: section 5 lists GR00T N1.7 and all seven world-action packages in its 28-package table.
  F02-102 is in `registry.json` (link: LeRobot v0.7.0 `policies` tree).
- Not accuracy, not counted: after the 6-m3 fix, "It works in three stages" has the plural "The generators cited
  here" as its antecedent. "Each works in three stages" restores the grammar.

Counts, section 6: 24 changed or added sentences (including the caption, the h2 title and one table cell), about
40 claims checked. Round 1: 19 of 19 closed. New findings: 3 (0 error, 3 minor).

---

# Section 7, `jepa`, `Jepa.tsx` and `JepaPasses.tsx`

## Round 1 findings

| ID | Closed | Current sentence at 636ebff |
|---|---|---|
| 7-1 | yes | Caption: "The counts are our arithmetic from each paper's settings; the times are the authors' own, each on its own GPU and from its own paper, so they do not compare like for like, across rows or between the two times in the first row." First row of `PLANNERS` is V-JEPA 2-AC with "16 s on one RTX 4090" and "3 s on one A100". |
| 7-2 | yes | "The training loss reports neither. It measures agreement between guess and target, and collapsed latents agree perfectly, so a low loss does not show that the latents are of any use. Both degrees are defined by how the latents of a batch spread, and the measures that follow either protect that spread or fix the targets." The measures that follow are the slow target (answers "hold almost still"), the frozen encoder ("the targets are fixed"), and the spread terms (VICReg, SIGReg); the sentence covers them. |
| 7-3 | yes, see 7-N1 | "Its authors add that three things soften the effect in their benchmarks: the dynamics there are deterministic, the latent leaves out variation the task does not need, and replanning from the real frame corrects prediction errors." |
| 7-4 | yes | "One limit comes with a predictor trained on a distance. It gives one output per input, so where two futures are plausible it settles between them, the fault section 4 found in regression on actions. A peer-reviewed study of the family names it for the squared-error loss its models use: "the MSE loss learns the conditional mean of potentially genuinely multi-modal futures"." |
| 7-5 | yes | "A single point has variance 0 and a flat slice has columns that move together, so by those two definitions one term answers both degrees of collapse (our reading)." |
| 7-6 | yes, see 7-N2 | "The planners read here keep that space small (our reading): V-JEPA 2-AC limits each sampled action to about 13 cm of gripper travel, and its released notebook and RoboJEPA's real-arm planner search only the x, y, z move and the gripper, with rotation held fixed." Cite F03-29 added; "The V-JEPA 2 authors also report trying camera positions by hand before settling on one that worked." (F03-28). |
| 7-7 | yes | "That is why RoboJEPA's authors can spread a round over several GPUs, and more compute is also the first item on the V-JEPA 2 authors' list of ways to cut the time." |
| 7-8 | yes | "V-JEPA 2-AC executes 1 action of a 1-step plan, RoboJEPA on a real arm 2 actions of a 5-step plan, and LeWorldModel all 5 action blocks of a 5-step plan." |
| 7-9 | yes | "Pretraining uses video and images with no actions and no labels." |
| 7-10 | yes | Figure label "GPU and timed setting not named"; SVG desc "0.98 seconds for a full plan, with the GPU and the timed setting not named." |

Closed: 10 of 10.

## New findings in changed sentences

### 7-N1. `minor`. "corrects prediction errors" is stronger than the quote

- Sentence: "... and replanning from the real frame corrects prediction errors."
- Register: F03-110 quote: "closed-loop MPC providing robustness to prediction errors".
- What is imprecise: replanning keeps the plan robust to the model's errors; it does not correct the predictions.
- Replacement: "... and replanning from the real frame makes the plan robust to prediction errors."

### 7-N2. `minor`. New citation label names a file its link does not open

- Sentence: the new `<Cite id="F03-29">vjepa2 notebooks/utils/mpc_utils.py, lines 98 to 104</Cite>`.
- Register: F03-29 Location names both `world_model_wrapper.py` and `mpc_utils.py`, and its quote holds the
  zero-rotation lines; `registry.json` links F03-29 to `notebooks/utils/world_model_wrapper.py`, and `Cite`
  takes its link from the registry. The same section's other F03-29 citation is labelled
  "world_model_wrapper.py, lines 20 to 29", which matches the link.
- Replacement label: `<Cite id="F03-29">vjepa2 notebooks, world_model_wrapper.py and mpc_utils.py</Cite>` (or add
  the `mpc_utils.py` URL to the registry for this entry).

## Also checked in changed sentences, holds

- 7-6 content: F03-29 quote `torch.zeros((len(action_samples), 3)` between `[:, :3]` and `[:, -1:]` (x, y, z and
  gripper kept, rotation zeroed); RoboJEPA's "3D-translation + 1D-gripper space with the end-effector orientation
  held fixed" is quoted in F03-114's Use line (cited in the same block), from Table 13, the real-robot
  configuration (F03-77 Wave 2). Register note, not counted: that RoboJEPA quote lives only in the Use line of an
  entry whose source is the LeWorldModel paper, and wave 2 sampled F03-114 out; moving it into F03-77's evidence
  would give it a proper home.
- 7-4: "its models use" the squared-error loss is the quote's own subject ("this class of approaches ... the MSE
  loss").
- 7-7: F03-116 quote begins its list with "leveraging additional computing resources for planning".
- 7-1: every time in the figure comes from a different paper or GPU (F03-25, F03-74, F03-73, F03-41); RoboJEPA
  has none.

Counts, section 7: 14 changed or added sentences (prose, caption, figure label, SVG desc, one citation), about 25
claims checked. Round 1: 10 of 10 closed. New findings: 2 (0 error, 2 minor).

---

# Section 8, `robot-rl`, `RobotRl.tsx`

## Round 1 findings

| ID | Closed | Current sentence at 636ebff |
|---|---|---|
| 8-1 | yes, see 8-N1 | h2 description: "Size a simulator run from three numbers in one file, and see what a camera cost in NVIDIA's benchmark: about half of the throughput on a manipulation task". Body: "Use them for what a camera cost on a manipulation task, about half, knowing that the same file's Cartpole rows lose a factor of 6.7 to the camera, and measure the rate of your own task." (Cite F06-48 added). Table cell: "Simulator and renderer throughput; in NVIDIA's manipulation rows a camera takes about half of it". The Kuka-Allegro lift rows are the only manipulation camera rows in the registers (F04-55, F06-49). |
| 8-2 | yes, see 8-N2 | "The robot, the task, the simulator, the environment count and the GPU all differ from the recipe's, so the pair illustrates the arithmetic and is no estimate for this recipe." |
| 8-3 | yes | "Stepping thousands of environments together is, on our reading of what those kernels compute and with no measurement behind it yet, general GPU compute: the card's ordinary arithmetic as opposed to the tensor cores that matrix-heavy training uses, with one CPU core feeding it." (F08-42 Use: "inference from what those kernels compute, not a measurement") |
| 8-4 | yes | "LeRobot's implementation uses SAC (Soft Actor-Critic), an RL method that trains from a replay buffer, a store of past steps that training samples from again and again, where PPO discards a batch after a few passes." |
| 8-5 | yes | "NVIDIA reports a gain for GR00T 2 on three contact-rich insertion tasks: from 40 to 76% success after supervised training to 88 to 96% with RL on the real robot. Its page gives no robot count, episode count or training time for that stage." |
| 8-6 | yes | "The README and task files at 1.0.1 give no success rate for it, so the first figure for this policy on a real arm will be your own count at your own bench." (F06-26 deploy README; F04-57 "not stated in the files read", README and task.py) |
| 8-7 | yes | "Its algorithm is GRPO (Group Relative Policy Optimization), which scores each attempt against the others collected with it, and its results file counts progress in GRPO steps, each about 25 minutes long in this run and so a far larger thing than a control step." F04-70: `docs/results.md`, "`global_step_75`", "One GRPO step took about 1,490 s (25 min)". |
| 8-8 | yes | "An AWS sample repository runs a recipe of RLinf v0.4, the project of the piRL authors, on OpenVLA-OFT, a 7B-parameter VLA, in LIBERO's Goal suite." (F04-70 "RLinf v0.4's GRPO recipe"; F04-69 "piRL (RLinf team ...)") |
| 8-9 | yes | "The guide opens with the promise that you will train a policy on a real robot "in just a few hours", and at v0.7.0 it has no table of results, so the hours and the success rate on this arm are yours to measure." (F04-80 Use: "docs line 3"; F04-81 quote) |
| 8-10 | yes | "Suppose that, asked to pick up a block and place it in a cup, it closes on the block most of the time, and now and then the gripper closes a little early and the block skids away (an illustration)." |

Closed: 10 of 10.

## New findings in changed sentences

### 8-N1. `error`. The 6.7 factor lost its engine: it is Newton's Cartpole pair, not the Cartpole rows

- Sentence: "Use them for what a camera cost on a manipulation task, about half, knowing that the same file's
  Cartpole rows lose a factor of 6.7 to the camera, and measure the rate of your own task."
- Register: F06-48 claim: "Adding the camera cut Newton's Cartpole training throughput from 1,023,698 to 152,124,
  a factor of 6.7". The same entry lists the other Cartpole camera rows: Newton plus OVRTX 127,990, Isaac Sim
  PhysX plus Isaac RTX 65,619; F06-47 gives Cartpole without a camera at 557,215 on PhysX.
- What is wrong: by our arithmetic the other pairs lose more, 1,023,698 / 127,990 = 8.0 and 557,215 / 65,619 =
  8.5, so "the Cartpole rows lose a factor of 6.7" widens a one-pair figure to all rows. The direction of the
  contrast with "about half" is unchanged; the qualifier the entry carries is lost. (The wording came from the
  round 1 replacement.)
- Replacement: "Use them for what a camera cost on a manipulation task, about half, knowing that in the same file
  Newton's Cartpole rows lose a factor of 6.7 to the camera, and measure the rate of your own task."

### 8-N2. `minor`. "the GPU ... differ" where the recipe names no GPU

- Sentence: "The robot, the task, the simulator, the environment count and the GPU all differ from the recipe's,
  so the pair illustrates the arithmetic and is no estimate for this recipe."
- Register: F04-55 and F04-54: 8,192 environments on one RTX PRO 6000 Blackwell Server Edition. F04-58: the recipe
  is `nworld: int = 4096` and names no GPU; register 04 compute table: "one GPU; a CPU fallback at 64 copies
  exists"; U12 leaves the recipe's wall-clock open. The environment count does differ (8,192 against 4,096).
- What is imprecise: no GPU is given for the recipe, so it cannot be said to differ. (The "simulator" holds as
  Isaac Lab against Playground, although the Newton row's physics, MuJoCo Warp, is what Playground 1.0 is built on,
  F04-54 and F04-57; no change needed there.)
- Replacement: "The robot, the task, the simulator and the environment count differ from the recipe's, and the
  recipe names no GPU, so the pair illustrates the arithmetic and is no estimate for this recipe."

## Also checked in changed sentences, holds

- 6.7: 1,023,697.6 / 152,123.9 = 6.73 (F06-48). F06-48 is in `registry.json` (link: the Isaac Lab CSV at the
  v3.0.0 SHA). F06-48's Wave 3 note forbids a pixel count for the Cartpole rows; none is printed.
- "about half": 27,962 / 60,757 = 46%, 115,889 / 220,831 = 52% (F04-55).
- "25 minutes": 1,490 s = 24.8 min (F04-70 quote); 31.6 h x 60 / 75 = 25.3 min.
- 8-5: F04-68 Use: "no robot count, episode count, training time or learner hardware for the RL stage".
- No dollar figure added; the register's "about US$1,100" is still not printed.

Counts, section 8: 14 changed or added sentences (prose, h2 description, one table cell, two citations), about 30
claims checked. Round 1: 10 of 10 closed. New findings: 2 (1 error, 1 minor).

---

# Totals

| Section | Round 1 closed | New error | New minor |
|---|---|---|---|
| 5 `vla` | 23 / 23 | 0 | 1 (5-N1) |
| 6 `world-models` | 19 / 19 | 0 | 3 (6-N1, 6-N2, 6-N3) |
| 7 `jepa` | 10 / 10 | 0 | 2 (7-N1, 7-N2) |
| 8 `robot-rl` | 10 / 10 | 1 (8-N1) | 1 (8-N2) |

Outside the four sections (6-m13 follow-ups): F03-124's Use line still says "50 to 52 GiB"; section 11
`Augmentation.tsx` line 334 and `revamp/claims/augmentation.md` line 33 still print "about 50.6 to 52.1 GiB".
