# Wave 1 accuracy fixes, sections 5 to 8

## Section 7, jepa (Jepa.tsx, JepaPasses.tsx, claims/jepa.md)

| Finding | Closed | How |
|---|---|---|
| 7-1 | yes | Caption now says the times do not compare like for like, across rows or between the two times in the first row (replacement wording). |
| 7-2 | yes | Falling-loss and batch-spread diagnostic sentences replaced with the finding's wording (low loss shows no use; both degrees defined by batch spread; measures protect it or fix the targets). |
| 7-3 | yes | Three mitigations named (deterministic dynamics, latent abstraction, replanning), replacement wording. |
| 7-4 | yes | Uncertain; applied: "a predictor", "settles between them", quote now keeps its subject "the MSE loss", scoped to the squared-error loss of that study's models. |
| 7-5 | yes | "(our reading)" restored after "one term answers both degrees of collapse". |
| 7-6 | yes | "The planners read here keep that space small (our reading)", 13 cm plus notebook and RoboJEPA x, y, z and gripper search; camera sentence split and attributed; added Cite F03-29. |
| 7-7 | yes | Reason removed from list order: "more compute is also the first item on the V-JEPA 2 authors' list". |
| 7-8 | yes | "RoboJEPA on a real arm 2 actions of a 5-step plan". |
| 7-9 | yes | "Pretraining uses video and images with no actions and no labels." |
| 7-10 | yes | JepaPasses label "GPU and timed setting not named"; the SVG desc updated to match. |

## Section 8, robot-rl (RobotRl.tsx, claims/robot-rl.md)

| Finding | Closed | How |
|---|---|---|
| 8-1 | yes | All three sentences scoped to NVIDIA's manipulation rows (h2 description, the "Use them for" sentence, table cell); added the Cartpole factor of 6.7 with Cite F06-48. |
| 8-2 | yes | "Order of magnitude" replaced: robot, task, simulator, environment count and GPU differ, so the pair illustrates the arithmetic and is no estimate for this recipe. |
| 8-3 | yes | Sentence now says "on our reading of what those kernels compute and with no measurement behind it yet". |
| 8-4 | yes | "LeRobot's implementation uses SAC (Soft Actor-Critic) ...". |
| 8-5 | yes | "a gain of the same kind" dropped; restored "Its page gives no robot count, episode count or training time for that stage." |
| 8-6 | yes | "The README and task files at 1.0.1 give no success rate for it". |
| 8-7 | yes | Uncertain; applied: no register line defines a GRPO step, so the gloss now says the results file counts progress in GRPO steps of about 25 minutes each. |
| 8-8 | yes | "a recipe of RLinf v0.4, the project of the piRL authors"; "GRPO" moved out of this sentence because the acronym is expanded in the next one. |
| 8-9 | yes | "The guide opens with the promise that you will train a policy on a real robot "in just a few hours", and at v0.7.0 it has no table of results". |
| 8-10 | yes | Bench scene marked: "Suppose that, asked to ..., ... skids away (an illustration)." |

## Section 5, vla (VisionLanguageAction.tsx, claims/vla.md, glossary/vla.json)

| Finding | Closed | How |
|---|---|---|
| 5-E1 | yes | Closing sentence: "needs 120 / 16 = 7.5 chunks a second from a head that, by our arithmetic from NVIDIA's 63.9 ms per chunk on an L40, can sample at most 15.6"; 7.5 and 15.6 in Derived. |
| 5-E2 | yes | "63.9 ms on that L40" in the opening; the L40 also attached at the formula paragraph (line 549) and the closing (5-E1). |
| 5-E3 | yes | "NVIDIA's own pages print several ... among the three TensorRT figures below the slowest is 93.8 / 35.6 = 2.6". All three listed are TensorRT builds (F02-40, F02-41). |
| 5-E4 | yes | "`pi05`, whose LeRobot example (a LIBERO fine-tune at batch 64) is sized for an 80 GB GPU." |
| 5-E5 | yes | Turbo timings now "for the Unitree G1 and after its inference optimisations ... on the robot's Jetson Thor". |
| 5-m1 | yes | Opening scoped: "In the models covered here, ... is, or is nearly, the sum of two networks"; "The larger of the two". |
| 5-m2 | yes | "By our arithmetic" restored; 15.6 and 250 wrapped in Derived at all four places. |
| 5-m3 | yes | "In pi0 and in GR00T N1, what crosses from backbone to head is vectors"; "never text" dropped. |
| 5-m4 | yes | "GR00T N1's head attends to the output vectors of its VLM." |
| 5-m5 | yes | Colon removed: "LeRobot's fine-tuning example keeps them trainable. Its authors report 93% ... 9M parameters". Supported by F02-82 claim line. |
| 5-m6 | yes | "if every action of every chunk is played". |
| 5-m7 | yes | "for Gemini Robotics, in our reading, the chunk is what covers the delay the link adds". |
| 5-m8 | yes | "One set of weights does both." |
| 5-m9 | yes | Owners restored: "by openpi's table", "by NVIDIA's guide". |
| 5-m10 | yes | "Even for SmolVLA, at 450M parameters and pretrained on 4 GPUs, the authors report about 30k GPU-hours across their whole project, a total that covers every experiment and not one pretraining run." |
| 5-m11 | yes | Uncertain; applied: "trained in full" dropped (F02-68, F02-69 say nothing about full or adapter). |
| 5-m12 | yes | "In our reading of the lines below, the model in the news ...". |
| 5-m13 | yes | "small and trained on your recordings alone, with no pretrained robot model to download (its ResNet-18 image backbone starts from weights trained on ImageNet, a public set of labelled photos)"; Cite F02-11 added; ImageNet explained at first use and added to the glossary. |
| 5-m14 | yes | "Packages marked Yes come first: those with a recipe or checkpoint for the SO-101, and those whose documentation spells out the padding, slot mapping or re-initialisation that admits it." |
| 5-m15 | yes | Uncertain; applied: "the published requirement that gates it is GPU memory". F08-76 row 8 names tensor cores as the part loaded and memory as the gate, so the original "exhausts first" did not hold. |
| 5-m16 | yes | Added "when the object starts where the demonstrations started, and 50% against 40% when it does not". |
| 5-m17 | yes | Uncertain; applied at both places: "without one more call to the model"; "The first factor is free" became "the cheap one". |
| 5-t1 (GR00T 2 relabel, review table) | yes | "GR00T 2 is the current form of the idea, and under the agent it changes the action model too." |

## Section 6, world-models (WorldModels.tsx, claims/world-models.md)

| Finding | Closed | How |
|---|---|---|
| 6-E1 | yes | "Both kinds first encode the frame into vectors, called a latent." Adapted from the replacement's "a grid of vectors": LeWorldModel's latent is one vector of width 192 (F03-32), so "grid" would not hold for it. |
| 6-E2 | yes | "The two examples met below, DreamZero and GR00T 2, are video models". |
| 6-E3 | yes | Sentence: "Inside, in the two models priced below, each call still denoises video"; h2 title: "... and in DreamZero and GR00T 2 the call still denoises video". |
| 6-m1 | yes | Opening: "in NVIDIA's Cosmos 3 examples produces it by running a transformer of billions of parameters 35 times"; line 703 scoped to "A pixel generator such as Cosmos 3". |
| 6-m2 | yes | "pixel models are used to train and to score policies, and the authors of one latent model write that theirs can be". |
| 6-m3 | yes | "The generators cited here do not predict those numbers one by one." |
| 6-m4 | yes | Uncertain; read F03-95: 35 is in the Use line and teaching notes only, no verbatim quote, and the cited file is docs/reference/models.md. Applied: "The examples NVIDIA gives for Cosmos 3 use 35 passes, a figure this research records without the verbatim line" ("our register" adapted to "this research" for the reader); "At the model card's 35 passes" became "At those 35 passes". |
| 6-m5 | yes | "By our arithmetic that is 189 / 24 = 7.875 s ... 207.78 / 7.875 = 26.4"; closing bullet "From NVIDIA's figures for Cosmos3-Nano, by our arithmetic"; 7.875 and 26.4 in Derived. |
| 6-m6 | yes | Added "(the time is NVIDIA's native PyTorch row, the floors are those of its NIM container)". |
| 6-m7 | yes | "could shorten it in future work". |
| 6-m8 | yes | "Among the five times charted the families do not overlap: each ... each ...". |
| 6-m9 | yes | Caption: "the top bar as NVIDIA lists it, the others our division of a planning time its authors published by the number of candidates" (top bar checked: Cosmos3-Nano). |
| 6-m10 | yes | "closed-loop control at 7 Hz on 2 GB200 GPUs". |
| 6-m11 | yes | Table row restored to "GR00T 2 (whitepaper, code not yet released)". |
| 6-m12 | yes | "if each of the three camera views of the robot it was timed on is fed at that size". |
| 6-m13 | yes | "no PyTorch peak for a full 189-frame video (served through TensorRT-LLM they record 50,623-52,147 MiB after a 189-frame warm-up)". Printed the verbatim MiB figures, not the replacement's "50.6 to 52.1 GiB": 50,623 MiB is 49.4 GiB, so the register's claim-line conversion (F03-124) is wrong and needs a register correction. |
| 6-m14 | yes | "or one of the world-action models LeRobot v0.7.0 packages (section 5 ... lists both): of the two priced above, ..."; Cite F02-102 added. |
| 6-m15 | yes | "the family you can train from scratch and take apart on one GPU". |
| 6-m16 | yes | "Every use of a world model but the last one below is this function called many times, so each has the same bill". |

## Verification (2026-11-24)

- vite build to /tmp/pai-dist-w1fix: built. check-section, 4 sections at 1440 and 390: all eight views "ok", last line "all clean", exit 0 (first run flagged 52147 in 6-m13; fixed by printing the verbatim "50,623-52,147 MiB").
- typecheck 0, lint 0, no-ai-tells 0, svg-a11y 0, pre-overflow 0, pinned-refs 0, check-renumber 0.
- Register follow-up, not editable here: F03-124 claim line converts 50,623-52,147 MiB to "50.6 to 52.1 GiB"; it is 49.4 to 50.9 GiB.
