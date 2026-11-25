# Accuracy review, wave 1 round 1, part A (sections 5 and 6)

Reviewed: committed text at `6384f0b`, diffed against `9957515`. Line numbers are lines of
`git show 6384f0b:deep-dives/physical-ai/src/sections/<Comp>.tsx`. Registers are in
`deep-dives/physical-ai/research/2026-11/` (file names below are relative to it).

Severity: `error` = wrong, unsupported, or a qualifier lost. `minor` = imprecise but not misleading.
"pre-existing" = the wording was already in the before text, so it is not a regression of the rewrite; it is
listed because every sentence was checked. Every finding was checked against the register text quoted with it.

Figure components (`VlaTokenFlow`, `VlaTwoClocks`, `WmFamilies`) are unchanged between the two commits, so their
labels and step texts were compared with the before text only (identical) and not re-derived.

---

# Section 5, `vla`, `VisionLanguageAction.tsx`

## Errors

### 5-E1. Derived capacity stated as what the head does (line 1002)

- Sentence: "GR00T N1's 120 Hz rests on a head that samples 15.6 chunks a second, each of 16 actions."
- Register: `02-imitation-and-vla.md` F02-33, Use in dive: "`[our reading]` "120 Hz" is the rate at which actions
  come out, not the rate at which the network runs: one sampling of a 16-action chunk takes 63.9 ms (F02-34),
  which is about 15.6 samplings per second or 250 actions per second of capacity `[derived: 1000 / 63.9 = 15.6;
  15.6 x 16 = 250]`." F02-34 quote: "The inference time for sampling a chunk of 16 actions is 63.9ms on an L40 GPU
  using bf16."
- What is wrong: 15.6 is our upper bound from one timing, not a rate the paper says the head runs at. The
  section's own line 553 says the head "has to sample 7.5 chunks a second and can sample 15.6". The closing
  sentence drops "can ... at most", drops that it is our arithmetic, and contradicts line 553.
- Replacement: "GR00T N1's 120 Hz needs 120 / 16 = 7.5 chunks a second from a head that, by our arithmetic from
  NVIDIA's 63.9 ms per chunk on an L40, can sample at most 15.6, each of 16 actions."

### 5-E2. The 63.9 ms figure lost its hardware (lines 249 to 251; also 549)

- Sentence: "The same paper reports 63.9 ms to sample one chunk, the run of future actions a policy returns in one
  answer (section 4, Learning From Demonstrations), and a chunk holds 16 actions."
- Register: F02-34 quote: "The inference time for sampling a chunk of 16 actions is 63.9ms on an L40 GPU using
  bf16."
- Before text: "The same NVIDIA paper reports 63.9 ms to sample one chunk of 16 actions on an L40."
- What is wrong: the L40 is now attached only to the 10 Hz figure in the sentence before. The 63.9 ms appears
  three times in the section (249, 549, and by implication 1002) and none of them names the device. A vendor
  timing must keep its hardware in the sentence.
- Replacement: "The same paper reports 63.9 ms on that L40 to sample one chunk, the run of future actions a policy
  returns in one answer (section 4, Learning From Demonstrations), and a chunk holds 16 actions."

### 5-E3. "NVIDIA alone publishes three" Thor latencies, "the slowest is 93.8" (lines 669 to 671)

- Sentence: "NVIDIA alone publishes three for GR00T N1.7 on one Jetson AGX Thor, and the slowest is 93.8 / 35.6 =
  2.6 times the fastest."
- Register: F02-40 quote: "| AGX Thor | PyTorch Eager | 8.21 ms | 55.26 ms | 81.65 ms | 144.9 ms | 6.9 Hz | 1.00x
  |" and "| | **TensorRT (Full Pipeline)** | **8.21 ms** | **28.89 ms** | **56.64 ms** | **93.8 ms** | **10.7 Hz**
  | **1.54x** |". F02-41 quote: "| AGX Thor (MAXN) | 106.8 | 100.5 | 76.8 | 35.6 |". F02-41 Use in dive: "Three
  first-party Thor figures exist (10.7 Hz, 12.4 Hz, ~28 Hz)", which names a different third figure (12.4 Hz, the
  hardware guide) from the one the list prints (76.8 ms).
- What is wrong: the two quoted tables alone hold six Thor latencies (144.9, 93.8, 106.8, 100.5, 76.8, 35.6 ms),
  and the slowest published is 144.9 ms, not 93.8. The arithmetic 93.8 / 35.6 = 2.63 is right for the three
  listed, so the ratio stands only with the scope restored. New in the rewrite.
- Replacement: "NVIDIA's own pages print several for GR00T N1.7 on one Jetson AGX Thor, and among the three
  TensorRT figures below the slowest is 93.8 / 35.6 = 2.6 times the fastest."

### 5-E4. "pi05, with an 80 GB GPU" turns an example's sizing into the requirement for this arm (line 848)

- Sentence (list label): "`pi05`, with an 80 GB GPU."
- Register: F02-57: "LeRobot's pi0.5 fine-tuning example is "Sized for a single 80 GB GPU" at batch size 64 for
  30,000 steps; the same page gives a batch-size-8 variant." `wave2-A.md` row 38 (F02-55 to F02-57): "The 80 GB
  example fine-tunes from `lerobot/pi05_libero_base` on LIBERO; in the SO-101 options table it should read as
  "LeRobot's LIBERO example", not as an SO-101 recipe."
- Before text: "With a larger GPU, groot or pi05. ... LeRobot's pi0.5 example is sized for a single 80 GB GPU."
- What is wrong: the new label sits beside "`groot`, with a 40 GB GPU", which is a stated minimum (F02-42:
  "**Minimum:** 1 GPU with 40 GB+ VRAM"). For pi05 no minimum is in the register: 80 GB is what one LIBERO
  example at batch 64 is sized for, and the same page has a batch-8 variant. The qualifier "example ... sized
  for" is lost and the wave 2 correction is not applied.
- Replacement: "`pi05`, whose LeRobot example (a LIBERO fine-tune at batch 64) is sized for an 80 GB GPU."

### 5-E5. GR00T 2 Turbo timings without "optimised" and without the robot (lines 614 to 617), pre-existing

- Sentence: "NVIDIA reports one prediction in 38 ms on an RTX 5090 desktop GPU and 124 ms on a Jetson Thor, an
  NVIDIA onboard computer for robots, where the model plans 1.6 s chunks about once per second and a separate
  controller executes them at 50 Hz."
- Register: F02-45 quote: "Optimized, a Turbo prediction for G1 takes 38 ms on an RTX 5090 and 124 ms onboard
  Jetson Thor". `wave2-A.md` row 29 (F02-44, F02-45): "Whitepaper Table 27: "G1, GR00T 2 Turbo, GeForce RTX 5090,
  224.73, 38.40, 5.85x"; "Jetson Thor (120 W), 720.41, 123.97, 5.81x" | Add "with NVIDIA's inference
  optimisations" (the unoptimised Thor figure in the same table is 720 ms) and "for the Unitree G1 checkpoint"."
- What is wrong: the conditions the wave 2 line asks for are missing. Section 6 keeps the matching conditions on
  the 153 ms figure ("after its inference optimisations (449 ms before them)"), so the two sections now differ.
  Not introduced by the rewrite (the before text read the same), but the correction overrides the claim.
- Replacement: "NVIDIA reports, for the Unitree G1 and after its inference optimisations, one prediction in 38 ms
  on an RTX 5090 desktop GPU and 124 ms on the robot's Jetson Thor, an NVIDIA onboard computer for robots, where
  the model plans 1.6 s chunks about once per second and a separate controller executes them at 50 Hz."

## Minor

### 5-m1. Opening generalisation lost its scope (lines 237 to 239)

- Sentence: "The parameter count on a robot-model announcement is the sum of two networks, and the rate in hertz
  printed beside it can be the speed of neither. The larger network, the backbone, is a model that already reads
  images and text."
- Register: F02-51 quote: "The pi0.7 model is a 5B-parameter VLA consisting of a 4B VLM backbone, a MEM-style
  video history encoder and a 860M parameter action expert." (three parts, and the section's own table says
  "about 5B in total with an encoder for recent video").
- Before text: "When an announcement gives one parameter count, it is the sum of the two parts, and in the models
  here the backbone is the larger part."
- Replacement: "In the models covered here, the parameter count on an announcement is, or is nearly, the sum of
  two networks, and the rate in hertz printed beside it can be the speed of neither. The larger of the two, the
  backbone, is a model that already reads images and text."

### 5-m2. "Our arithmetic" marker dropped from 15.6 and 250 (lines 251 to 252, 551, 554)

- Sentence: "That is 1000 / 63.9 = 15.6 chunks a second at most, with room for 15.6 x 16 = 250 actions a second."
- Register: F02-33 Use in dive: "`[derived: 1000 / 63.9 = 15.6; 15.6 x 16 = 250]`".
- Before text: "By our arithmetic that is 1000 / 63.9 = 15.6 chunks a second". Arithmetic redone: 1000 / 63.9 =
  15.65; 15.6 x 16 = 249.6. Both right. `7.5` carries `<Derived>` at lines 551 and 553; `15.6` and `250` carry
  none anywhere.
- Replacement: "By our arithmetic that is 1000 / 63.9 = 15.6 chunks a second at most, with room for 15.6 x 16 =
  250 actions a second." (and wrap `15.6` and `250` in `<Derived>` at lines 251, 252, 551, 554).

### 5-m3. "never text" (lines 307 to 308), new, no entry

- Sentence: "What crosses from backbone to head is vectors, never text, and it crosses by attention, the
  transformer operation in which one token reads from others."
- Register: supported for pi0 (F02-20: "caching the attention keys and values for the prefix o_t") and GR00T N1
  (F02-33: "It cross-attends to the VLM output tokens"). No entry supports "never" across VLAs, and F02-48 (pi0.5:
  "first predicts the semantic subtask ... and then predicts the low-level robot action chunk based on this
  subtask") and F02-89 (FineART-VLA: "a trained language head that predicts the next subtask in language (System
  2), which conditions a flow-matching action expert (System 1)") describe designs where text is produced on the
  way to the action. Uncertain whether those count as "crossing from backbone to head" mechanically, hence minor.
- Replacement: "In pi0 and in GR00T N1, what crosses from backbone to head is vectors, and it crosses by
  attention, the transformer operation in which one token reads from others."

### 5-m4. "GR00T's head" where the entry is GR00T N1 (line 310), relabel

- Sentence: "GR00T's head attends to the output vectors of its VLM."
- Register: F02-33 (the cited entry) is the N1 paper. F02-38 Wave 2: "The 16 that describes the shipped model is
  `select_layer: 16`, the VLM layer whose features feed the head." The section's own table says N1.7 feeds "the
  head from its layer 16", which is not the VLM's output.
- Replacement: "GR00T N1's head attends to the output vectors of its VLM."

### 5-m5. X-VLA: the 9M tuned parameters are presented as the soft prompts (lines 351 to 354), new

- Sentence: "X-VLA, a 0.9B model in LeRobot, feeds the model 32 learned vectors per robot type, called soft
  prompts, and a fine-tune trains them: its authors report 93% success on LIBERO, a suite of simulated
  manipulation tasks, from tuning 9M parameters, 1% of the model."
- Register: F02-70 quote: "By tuning only 1% of the model parameters (9M), X-VLA-0.9B achieves 93% success rate on
  LIBERO". F02-82 quote: "hidden_size: int = 1024" and "num_domains: int = 30 / len_soft_prompts: int = 32".
- What is imprecise: the colon makes the 9M the soft prompts. No entry says what the 9M are, and by the config
  numbers one robot type's prompts are 32 x 1024 = 32,768 numbers (our arithmetic), so the 9M cannot be the
  prompts alone.
- Replacement: "X-VLA, a 0.9B model in LeRobot, feeds the model 32 learned vectors per robot type, called soft
  prompts, and LeRobot's fine-tuning example keeps them trainable. Its authors report 93% success on LIBERO, a
  suite of simulated manipulation tasks, from tuning 9M parameters, 1% of the model."

### 5-m6. "need 7.5 chunks a second" rests on an unstated assumption (lines 550 to 554), new arithmetic

- Sentence: "For GR00T N1, 120 actions a second in chunks of 16 need 120 / 16 = 7.5 chunks a second, and the
  timing allows 15.6."
- Register: F02-33, F02-34 give 120 Hz, 16 actions, 63.9 ms. No entry says how many of the 16 are played before
  the next chunk. Arithmetic redone: 120 / 16 = 7.5, right, and marked `<Derived>`.
- What is imprecise: 7.5 holds only if all 16 actions of every chunk are played. It also sits oddly beside the
  paragraph above (line 517), where "120 / 10 = 12 actions leave on each plan": 7.5 chunks a second cannot each
  use a fresh one of 10 plans a second. Both are labelled as arithmetic from the rates, so not misleading.
- Replacement: "For GR00T N1, 120 actions a second in chunks of 16 need 120 / 16 = 7.5 chunks a second if every
  action of every chunk is played, and the timing allows 15.6."

### 5-m7. "the chunk is what covers the delay the distance adds", for both remote cuts (lines 577 to 578), new

- Sentence: "The last two put the slow side on another machine, and the chunk is what covers the delay the
  distance adds."
- Register: F02-78 quote: "The on-robot Gemini Robotics decoder compensates for the latency of the backbone. ...
  With multiple actions in the chunk (Zhao et al., 2023), the effective control frequency is 50Hz." Use in dive:
  "chunking is what hides the 250 ms" (the register's reading, Gemini Robotics only). F02-45 says nothing about
  what covers the reasoning model's delay in GR00T 2.
- Replacement: "The last two put the slow side on another machine; for Gemini Robotics, in our reading, the chunk
  is what covers the delay the link adds."

### 5-m8. "on one GPU" for pi0.5 (line 584), new, no entry

- Sentence: "One set of weights on one GPU does both."
- Register: F02-48 quote covers one model doing both ("the model first predicts the semantic subtask ... and then
  predicts the low-level robot action chunk"). No entry states pi0.5's inference hardware (compute table row:
  "pi0.5 ... inference latency and device: not published").
- Replacement: "One set of weights does both."

### 5-m9. Owner dropped from the two memory requirements (lines 702 to 703)

- Sentence: "the requirement is more than 8 GB of memory to run pi0 and 16 GB to run GR00T N1.7."
- Register: F02-54 quote: "| Inference | > 8 GB | RTX 4090 |"; F02-42: "Inference needs 16 GB."
- Before text: "more than 8 GB to run pi0 by openpi's table, and 16 GB to run GR00T N1.7 by NVIDIA's guide."
- Replacement: "the requirement is more than 8 GB of memory to run pi0 by openpi's table, and 16 GB to run GR00T
  N1.7 by NVIDIA's guide."

### 5-m10. SmolVLA's 30k GPU-hours used as evidence that pretraining is out of reach (lines 724 to 727), new framing

- Sentence: "Pretraining is out of a reader's reach, which is why the fine-tune is the job to size. ... Even
  SmolVLA, at 450M parameters, took about 30k GPU-hours across its authors' whole project, as they report."
- Register: F02-59 quote: "Pretraining was conducted using 4 GPUs to accomodate for large batch size, but the
  model can easily be trained on a single GPU due to its small size. Overall, the project consumed approximately
  30k GPU hours." Use in dive: "The 30k GPU-hours covers every experiment in the project, not one pretraining
  run."
- What is imprecise: the "whole project" qualifier is kept, but "Even ... took" presents the total as the price
  of pretraining, and the same quote says the model trains on a single GPU.
- Replacement: "Even for SmolVLA, at 450M parameters and pretrained on 4 GPUs, the authors report about 30k
  GPU-hours across their whole project, a total that covers every experiment and not one pretraining run."

### 5-m11. "trained in full" for OpenVLA-OFT (line 754), pre-existing, uncertain

- Sentence: "A 7B backbone trained in full leaves the one-GPU size: the OpenVLA-OFT authors fine-tuned across 8
  A100 or H100 GPUs."
- Register: F02-69 quote: "using a batch size of 64-128 across 8 A100/H100 GPUs." Nothing in F02-68 or F02-69
  says whether the backbone was trained in full or through an adapter. Uncertain: the paper was not re-read, so
  this is "no entry supports it", not "it is false".
- Replacement: "A 7B backbone leaves the one-GPU size: the OpenVLA-OFT authors fine-tuned across 8 A100 or H100
  GPUs."

### 5-m12. "In our reading" dropped from the trail claim (line 780)

- Sentence: "The model in the news and the model you can fine-tune are usually different models."
- Register: F02-53 Use in dive: "the gap between the published frontier (pi0.7, April 2026) and what a reader can
  download (pi0.5, September 2025): about seven months and two model generations `[our reading]`."
- Before text: "In our reading, the second list trails the first by a model generation or more in most lines."
- Replacement: "In our reading of the lines below, the model in the news and the model you can fine-tune are
  usually different models."

### 5-m13. ACT "with no pretrained model to download" (lines 828 to 829), pre-existing

- Sentence: "It is LeRobot's own recommendation for a first policy: small, trained from scratch on your
  recordings, with no pretrained model to download."
- Register: F02-11 quote: "vision_backbone: str = "resnet18" / pretrained_backbone_weights: str | None =
  "ResNet18_Weights.IMAGENET1K_V1"". Fine-tune options table, `act` row: "scratch (ImageNet ResNet-18)".
- Replacement: "It is LeRobot's own recommendation for a first policy: small and trained on your recordings alone,
  with no pretrained robot model to download (its ResNet-18 image backbone starts from ImageNet weights)."

### 5-m14. "Packages with a documented path to the SO-101 come first" (lines 939 to 941), new

- Sentence: "Packages with a documented path to the SO-101 come first, then fits "by shape", then the three with
  no path."
- Register: F02-102 table. The rows now sorted first because they start with "Yes" include `pi0`, `pi0_fast`,
  `pi05` ("Yes by padding to 32"), `lingbot_vla_v2` (F02-95: "the guide's worked example is an arm of the same
  shape as the SO-101 ... on a different robot (OMX) ... No SO-101 checkpoint is named") and `vla_jepa` (F02-99:
  "the three released checkpoints are LIBERO, DROID and SimplerEnv ones and none is for the SO-101"). Those are
  documented mechanisms (padding, slot mapping, re-initialisation), not documented paths to this arm. The
  relabelling of the register's "Yes `[our reading]`" rows as "By shape" is faithful, and "the three with no
  path" (tdmpc, longwam, lingbot_va) is right.
- Replacement: "Packages marked Yes come first: those with a recipe or checkpoint for the SO-101, and those whose
  documentation spells out the padding, slot mapping or re-initialisation that admits it. Then come fits "by
  shape", then the three with no path."

### 5-m15. "GPU memory is what it exhausts first" (lines 985 to 986), new, no entry found

- Sentence: "The fine-tune is a single-GPU run of hours, and GPU memory is what it exhausts first, set by how much
  of the backbone trains"
- Register: F02-42 and F02-54 give memory minimums; teaching material: "fine-tuning for one arm and one task is
  one GPU for hours (F02-63, F02-42)". No entry in register 02 measures which resource runs out first. Uncertain:
  register 08 was not searched to completion for this.
- Replacement: "The fine-tune is a single-GPU run of hours, and the published requirement that gates it is GPU
  memory, set by how much of the backbone trains"

### 5-m16. "90% against ACT's 70%" without "in distribution" (line 993), pre-existing

- Sentence: "the published result on this arm is 90% against ACT's 70%, as the SmolVLA authors report."
- Register: F02-60: "90% success in distribution and 50% out of distribution, against 70% and 40% for ACT". Use
  in dive: "The out-of-distribution column (50%, 40%) is the honest number".
- Replacement: "the published result on this arm is 90% against ACT's 70% when the object starts where the
  demonstrations started, and 50% against 40% when it does not, as the SmolVLA authors report."

### 5-m17. "a longer chunk raises it with no extra compute" (lines 252, 548), pre-existing, uncertain

- Sentence: "The fast rate counts actions, and a longer chunk raises it with no extra compute."
- Register: no entry. A longer chunk is more action tokens in every head pass, so "no extra compute" is not
  literally supported; what the registers support is that the number of calls does not rise.
- Replacement: "The fast rate counts actions, and a longer chunk raises it without one more call to the model."

## GR00T, every version: before against after

| Mention | Before | After | Verdict |
|---|---|---|---|
| GR00T 2, standing label (constant `GROOT2_LABEL`, line 30) | "These are NVIDIA's own figures, from a research page and whitepaper dated November 2026. The code is announced for December and nothing can be downloaded yet." | identical string | unchanged |
| Where the label is printed | Turbo paragraph; adaptation paragraph | Turbo paragraph (line 617); the GR00T 2 lookup paragraph, after the 2B and the adaptation figures (line 903) | every GR00T 2 figure still carries it |
| GR00T 2 row of the dropped currency table | "Nothing yet. Code is announced for December" | table removed; "GR00T 2 is a research page and a whitepaper" (line 781), hollow marker on the timeline | no widening |
| GR00T 2, design sentence | "GR00T 2 is the current form of the idea, and it changes the model underneath." | "GR00T 2 is NVIDIA's current design, and under the agent it changes the action model too." (line 607) | relabel. `minor`. F02-44 quote says "a new generation of foundation world-action models"; "NVIDIA's current design" is consistent with "the current GR00T to learn from" (line 782) but is new wording. To keep it exactly as scoped: "GR00T 2 is the current form of the idea, and under the agent it changes the action model too." |
| "The reasoning model is the only part that runs off the robot." | inside the labelled Turbo paragraph | moved to the "An agent on top" list item (line 602), no label nearby | no figure in it; F02-45: "Everything but the reasoning model runs onboard." Supported |
| GR00T 2 Turbo 38 ms / 124 ms | no "optimised", no robot | same | 5-E5, pre-existing |
| Turbo 2B against the whitepaper's 2B | Turbo paragraph | lookup paragraph (lines 896 to 898), same wording | unchanged |
| Adaptation, 40% to 95% on 50 selected tasks | with "selected", "partly by construction", LoRA | same wording (lines 899 to 903) | unchanged; matches F02-46 Wave 2 |
| "read the GR00T 2 whitepaper for where that line goes next" | present | dropped | narrowing only |
| "GR00T 2 is the current GR00T to learn from, and N1.7 the current GR00T to run" | present | present (line 782) | unchanged |
| GR00T N1: backbone 10 Hz on L40, 120 Hz | "the paper reports" | "NVIDIA's paper ... reports" (line 247) | owner kept |
| GR00T N1: 63.9 ms | "on an L40" | device dropped | 5-E2 |
| GR00T N1 mechanism | "It reads System 2's output tokens and the robot state" (N1) | "GR00T's head attends to the output vectors of its VLM" | 5-m4, widened from N1 to the line |
| GR00T N1: Kahneman sentence | present | dropped | narrowing only |
| GR00T N1: A6000 batch 200 / 16 | absent | new (lines 743 to 745) | supported, F02-34 quote: "a batch size up to 200 can be used. When tuning the vision encoder, a batch size of up to 16 can be used." |
| N1.5, N1.6 | same | same (lines 882 to 885) | unchanged |
| N1.7 "newest GR00T with released weights and code as of 2026-11-20" | present | present (line 886); short forms "the newest GR00T with weights is N1.7" (782), "the newest GR00T you can run" (837) | unchanged; short forms rely on the header's "read 2026-11-20" |
| N1.7 model-card timings | stages and printed total kept apart | same (lines 663 to 665) | matches F02-40 Wave 2 |
| N1.7 Thor figures | 93.8 ms; pointer to the second benchmark | three-item list, "publishes three" | 5-E3 |
| N1.7 memory (35 GB, 40 GB minimum, 80 GB+) | present | present, plus "A 24 GB card is under that minimum" | supported, F02-42 Use in dive |

## "Nothing could be downloaded" statements checked

- GR00T 2: label unchanged (above).
- "the newest with weights is pi0.5" (line 781): F02-53 "openpi ... holds pi0, pi0-FAST and pi0.5 only ...
  neither pi*0.6 nor pi0.7 weights are offered" and Wave 2 "no weights are downloadable". Supported; the date is
  carried by the section header only.
- Lookup line "openpi ... offers no pi*0.6 or pi0.7 weights. A company post of 2026-10-13 offers hosted training
  and inference through an API beta with a waitlist." Matches F02-53 Wave 2. The before sentence "No model newer
  than pi0.7 was named as of a 2026-10-20 archive copy of the company site" was dropped; what remains ("newest ...
  with a paper as of 2026-11-20", F02-51) claims no more than the register does.
- Timeline legend and caption: "no download in the sources read" and "as far as the sources read on 2026-11-20
  state". Scope kept.
- Gemini: "went to early-access partners", "Only the reasoning model is generally reachable, as a hosted API".
  Matches F02-75.
- "LeRobot v0.7.0 has no package of that name." Matches F02-102 directory listing.

## Cross-references checked (all hold at 6384f0b)

- Section 4 defines the chunk (line 324) and "prices that blind interval" ("Inside a chunk the arm is not
  looking", lines 376 to 395; ACT's "blind interval", line 472). Flow matching is there (lines 676 to 755).
- Section 7 draws the patch and tubelet lattice (lines 205 to 245).
- Section 15 has "Full fine-tuning updates every weight, so the GPU holds a gradient and optimiser state for all
  of them" (line 234) and the multi-GPU and multi-node sizes.
- Section 17 works with the 76.8 ms figure (lines 55, 82, 826) and sets latencies against the tick.
- Section 8 covers Recap (pi*0.6's method), lines 330 to 357.
- Section 6 gives the whitepaper's 2B for the full GR00T 2 (its line 665) and treats the world action model.

## Counts, section 5

About 290 claims checked: about 180 in prose, figures and formulas, 25 cells of the five-model table, and 84
cells of the 28-package table (every chunk and fit cell compared with the F02-102 table; all agree). Wave 2 and
wave 3 lines were read for every cited F02 entry. Arithmetic redone: 15.6, 250, 12, 100, 7.5, 1.67, 0.53, 2.6,
73 and 46 (pi0), all correct.

Findings: 22. Errors: 5 (5-E1 to 5-E4 new in the rewrite, 5-E5 pre-existing). Minor: 17 (5-m11, 5-m13, 5-m16,
5-m17 pre-existing), plus the one GR00T 2 relabel recorded in the table.

---

# Section 6, `world-models`, `WorldModels.tsx`

## Errors

### 6-E1. "Both kinds first compress the frame into a smaller set of numbers" (lines 141 to 142), new

- Sentence: "Both kinds first compress the frame into a smaller set of numbers, called a latent."
- Register: `03-world-models-and-jepa.md` F03-15 quote: "our feature maps are encoded using the ViT-g encoder and
  have the shape 16 x 16 x 1408". F03-14 names the config `droid-256px-8f.yaml` (256-pixel frames).
- What is wrong: for the section's own latent model the latent is not smaller. A 256 x 256 colour frame is 256 x
  256 x 3 = 196,608 numbers; its latent is 16 x 16 x 1408 = 360,448 (our arithmetic on the quoted shapes).
  Section 7 says so in a caption (Jepa.tsx lines 238 to 239): "the encoder returns about as many as the clip held
  in pixels, so it re-describes the clip more than it shrinks it", and this section's own line 450 says "The
  latent has about as many positions as the pixel family's grid". The sentence holds for the VAE (F03-96) and for
  LeWorldModel (F03-32: one vector of width 192), not for "both kinds".
- Replacement: "Both kinds first encode the frame into a grid of vectors, called a latent."

### 6-E2. "The two examples so far are video models" (line 281), scope lost

- Sentence: "The two examples so far are video models, and the DreamZero authors list "learned latent
  representations" among the things such a model could predict."
- Register: `02-imitation-and-vla.md` F02-93: "`lawam` is LaWAM (arXiv 2606.15768), a latent world action model:
  a Qwen3-VL 2B backbone, a latent action and world model, and a flow-matching action head." F02-102 counts
  "7 are world action models or carry a world-model training loss (`vla_jepa`, `cosmos3`, `flux3`, `fastwam`,
  `lawam`, `longwam`, `lingbot_va`)". Section 5 prints all seven.
- Before text: "Where two 2026 models from NVIDIA sit, DreamZero and GR00T 2, both met below" and "the latent
  models read for this dive plan by search".
- What is wrong: no examples have been named at this point, so the sentence reads as a statement about the
  world: only two world-action models exist and both predict video. The registers hold more than two, one of
  them latent.
- Replacement: "The two examples met below, DreamZero and GR00T 2, are video models, and the DreamZero authors
  list "learned latent representations" among the things such a model could predict."

### 6-E3. "each call still denoises video", stated of world-action models in general (line 649; h2 at line 636), new

- Sentence: "Inside, each call still denoises video, so its price is the pixel family's product again, with the
  parameter count behind every pass." Heading: "A world-action model answers in one call, and the call still
  denoises video".
- Register: `02-imitation-and-vla.md` F02-88 quote: "FastWAM keeps video modeling during training, but uses
  direct action prediction at inference time instead of iteratively generating future observations." F02-96
  quote (Long-WAM): "IDM conditions action generation on observed history and predicted future latents, without
  decoding future RGB images." Section 5's table prints both.
- Before text: "Inside, predicting the video is part of how it is trained and how it decides."
- What is wrong: it holds for the two models the block then prices (F03-103: "the iterative denoising nature of
  video"; F03-104: "one or two for video and two to four for actions") and is contradicted as a general statement
  by a world-action model in the registers that skips video at inference.
- Replacement (sentence): "Inside, in the two models priced below, each call still denoises video, so its price
  is the pixel family's product again, with the parameter count behind every pass."
- Replacement (heading): "A world-action model answers in one call, and in DreamZero and GR00T 2 the call still
  denoises video"

## Minor

### 6-m1. "tens of times" for the pixel family as a whole (line 143; also 703), new

- Sentence: "The pixel family predicts a latent that must still be able to redraw every pixel, and produces it by
  running a transformer of billions of parameters tens of times."
- Register: the only pass count for a generator is Cosmos 3's 35 (F03-95, Use in dive). F03-104 quote: "a few
  denoising steps suffice: one or two for video and two to four for actions". F03-90: Dreamer 4 "achieves
  real-time interactive inference on a single GPU through a shortcut forcing objective".
- Replacement: "The pixel family predicts a latent that must still be able to redraw every pixel, and in the
  Cosmos 3 examples produces it by running a transformer of billions of parameters 35 times."

### 6-m2. "both families are used to train and to score policies" (line 150), new

- Sentence: "It is loose in between, where both families are used to train and to score policies."
- Register: F03-88 quote (RoboJEPA): "The same world model can then be used to evaluate or improve any policy".
  That is a statement of what is possible; F03-90 and F03-92 report use for the pixel side only. Line 276 quotes
  it correctly.
- Replacement: "It is loose in between: pixel models are used to train and to score policies, and the authors of
  one latent model write that theirs can be."

### 6-m3. "No generator predicts those numbers one by one." (line 308), new universal

- Sentence: "No generator predicts those numbers one by one."
- Register: supported for the generators cited (F03-96 Cosmos 3; F03-104 GR00T 2; F03-90 Dreamer 4 "400M for the
  tokenizer"). No entry supports it for every generator.
- Before text: "Predicting every one of those numbers directly is too much work, so a video generator runs in
  three stages".
- Replacement: "The generators cited here do not predict those numbers one by one."

### 6-m4. The 35 passes rest on a "Use in dive" line, not on a quote (lines 326, 339, 456, 677), uncertain

- Sentence: "The Cosmos 3 model card's examples use 35 passes." and the new "At the model card's 35 passes the
  transformer makes 35 x 2,400 = 84,000 token updates".
- Register: F03-95's verbatim quote does not contain 35. The number is only in its Use in dive line ("refined
  over a number of steps (35 in the model card's examples)") and in the teaching material. The citation label
  ("NVIDIA Cosmos models reference, architecture") names `docs/reference/models.md`, while the sentence says
  "model card". The number was already printed before the rewrite; it is now load-bearing in new arithmetic and
  in the comparison with GR00T 2 at line 677. Not verifiable from the register text.
- Replacement: no change to the wording if the model card line is added to F03-95 as a quote. Until then: "The
  examples NVIDIA gives for Cosmos 3 use 35 passes, a figure our register records without the verbatim line."

### 6-m5. Our arithmetic on the 720p clip is unmarked, and reused as "NVIDIA's figures" (lines 349 to 350, 853)

- Sentence: "That is 7.875 s of video, or 26.4 seconds of compute for each second of it." and "On NVIDIA's
  figures for Cosmos3-Nano, budget 26.4 seconds of H100 compute per second of 720p video".
- Register: F03-98 Use in dive: "[derived] 189 frames / 24 = 7.875 s of video. H100 at 720p: 207.78 / 7.875 =
  26.4 s of compute per second of video". Arithmetic redone: 7.875 and 26.385. Right. Neither number carries
  `<Derived>`; the only citation on the block is the vendor's benchmark page.
- Replacement (line 349): "By our arithmetic that is 189 / 24 = 7.875 s of video, or 207.78 / 7.875 = 26.4
  seconds of compute for each second of it."
- Replacement (line 853): "From NVIDIA's figures for Cosmos3-Nano, by our arithmetic, budget 26.4 seconds of H100
  compute per second of 720p video and a GPU that clears the 58 GiB floor, or the 31 GiB floor with a large
  host."

### 6-m6. The 26.4 s and the 58 GiB floor come from two different runtimes (line 853)

- Sentence: as in 6-m5, second sentence.
- Register: F03-98: "native PyTorch, BF16". F03-121 Use in dive: "These are the floors the NIM container checks
  before it starts ... they are not measured peaks of the open-source PyTorch path". F03-98 Use in dive: "The
  same table lists a NIM (FP8) row at 86.16 s for 720p on the H100."
- Replacement: add to the sentence in 6-m5: "(the time is NVIDIA's native PyTorch row, the floors are those of
  its NIM container)".

### 6-m7. "would shorten" where the authors write "can potentially ... in future work" (lines 588 to 589)

- Sentence: "Beyond smaller settings and more hardware, the authors name two changes of method that would shorten
  it: gradient-based planning, ... and a policy that answers in a single pass, trained inside the world model to
  start the search near a good answer."
- Register: F03-116 quote: "We can potentially reduce the planning time for both models in future work by
  leveraging additional computing resources for planning, reducing the number of samples and refinement steps
  used at each time step, training a feed-froward policy in the world-models' imagination to initialize the
  planning problem, or potentially leveraging gradient-based planning". All four items are in the quote.
- Replacement: "Beyond smaller settings and more hardware, the authors name two changes of method that could
  shorten it in future work: gradient-based planning, which computes through the predictor which way to change
  the actions where the search only samples them, and a policy that answers in a single pass, trained inside the
  world model to start the search near a good answer."

### 6-m8. "the families do not overlap: every pixel-family time ..." (the paragraph before the chart, about lines 593 to 596), new

- Sentence: "On that scale the families do not overlap: every pixel-family time is 300 ms or more per candidate,
  and every latent-family time is 2 ms or less."
- Register: true of the five charted values (F03-118: 2.0 s, 300 ms, 2 ms, 0.375 ms, 22 to 65 microseconds).
  Not true of every pixel-family time in the section: F03-104 "a median of 153 ms to predict an action chunk",
  F03-90 Dreamer 4 "exceeding the 20 FPS of the Minecraft physics engine" on one H100. F03-118 itself says the
  figures are "not like for like".
- Replacement: "Among the five times charted the families do not overlap: each pixel-family time is 300 ms or
  more per candidate, and each latent-family time is 2 ms or less."

### 6-m9. Chart caption calls our divisions "published" and drops whose figures they are (line 601)

- Sentence: "Each bar is one published time to imagine one candidate, with its GPU; the faint end of the last bar
  is a range."
- Register: F03-118 Evidence: "[derived] from the quoted timings | 240 s / (80 x 10) = 0.3 s; 16 s / 8,000 = 2
  ms; 3 s / 8,000 = 0.375 ms; 0.98 s / 45,000 = 21.8 microseconds". Four of the five bars are our division; only
  the Cosmos3-Nano bar is printed by its source.
- Before text: "The figures are not like for like, except the bracketed pair. All are the authors' or the
  vendor's own."
- Replacement: "Each bar is one time to imagine one candidate, with its GPU: the top bar as NVIDIA lists it, the
  others our division of a planning time its authors published by the number of candidates; the faint end of the
  last bar is a range."

### 6-m10. "7 Hz (seven chunks per second)" (line 655), pre-existing, uncertain

- Sentence: "with their optimisations, 7 Hz (seven chunks per second) on 2 GB200 GPUs."
- Register: F03-103 quote: "real-time closed-loop control at 7Hz" and "we enable DreamZero to run at 7Hz using 2
  GB200s". The quote does not say the 7 counts chunks. Section 5 is built on the point that a quoted hertz figure
  may count actions, chunks or backbone passes.
- Replacement: "with their optimisations, closed-loop control at 7 Hz on 2 GB200 GPUs."

### 6-m11. GR00T 2 label reworded, and shortened in the table (lines 661 to 662, 804), relabel

- Sentence: "Its figures come from an NVIDIA whitepaper dated November 2026, with the code announced for December
  and none released on 2026-11-20." Table row: "GR00T 2 (whitepaper)".
- Before text: "NVIDIA whitepaper and project page dated November 2026; the code is announced for December and
  nothing could be downloaded on 2026-11-20." Table row: "GR00T 2 (whitepaper, code not yet released)". A third
  labelled mention ("153 ms ... as NVIDIA reports it in a whitepaper whose code is not yet released") was
  dropped with its paragraph.
- Register: F03-104 Wave 2: "Code is "Available in December", so none of this can be reproduced today. The
  source is an NVIDIA whitepaper dated November 2026, not an arXiv preprint."
- Verdict: "none released" (code) says less than "nothing could be downloaded" and is supported. The table row
  lost its qualifier. The 153 ms at lines 677 to 678 and 684 keeps its owner ("It reports", "GR00T 2's") and its
  conditions (Dexter, three views, RTX 5090, after optimisation, 449 ms before), matching Wave 2.
- Replacement (table row): "GR00T 2 (whitepaper, code not yet released)"

### 6-m12. "3 x 280 = 840 ... for the three camera views of the robot it was timed on" (lines 668 to 670), new arithmetic

- Sentence: "280 tokens per compressed frame and camera at 224 x 320 pixels, so 3 x 280 = 840 per compressed frame
  for the three camera views of the robot it was timed on."
- Register: F03-104 quote: "giving 280 tokens per latent frame and camera at 224 x 320" and "a median of 153 ms
  to predict an action chunk for Dexter from three camera views". Arithmetic right and marked `<Derived>`. The
  quotes do not say Dexter's three views were each 224 x 320, which the 840 assumes.
- Replacement: "280 tokens per compressed frame and camera at 224 x 320 pixels, so 3 x 280 = 840 per compressed
  frame if each of the three camera views of the robot it was timed on is fed at that size."

### 6-m13. "the notes give no peak for a full 189-frame video" (line 740), pre-existing, scope wider than the entry

- Sentence: "That is one frame; the notes give no peak for a full 189-frame video or for an action-conditioned
  rollout."
- Register: F03-124 quote: "TensorRT-LLM with the shipped `cosmos3-nano-1gpu.yaml` 50,623-52,147 MiB after the
  default 720x1280x189 warm-up". Use in dive: "no measured peak for a full 189-frame Nano video through PyTorch
  is in the notes".
- Replacement: "That is one frame; the notes give no PyTorch peak for a full 189-frame video (served through
  TensorRT-LLM they record about 50.6 to 52.1 GiB after a 189-frame warm-up) and none for an action-conditioned
  rollout."

### 6-m14. "Today that is a VLA ..." implies no world-action model can be run yet (lines 870 to 872), pre-existing, softened by the rewrite

- Sentence: "Today that is a VLA such as GR00T N1.7, the newest GR00T with released weights and code (section 5,
  Vision-Language-Action Models): DreamZero's 7 Hz took two GB200 GPUs, and GR00T 2 has no code yet."
- Register: `02-imitation-and-vla.md` F02-90: "`flux3` is FLUX 3 Action, Black Forest Labs' 7B world action
  model ... It ships with an SO-101 checkpoint". F02-84, F02-88: Cosmos 3 and Fast-WAM as LeRobot v0.7.0 policy
  packages.
- Before text: "a VLA today (section 5), or a world-action model once one you can download exists", which the
  same entries contradict more directly.
- Replacement: "Today that is a VLA such as GR00T N1.7, the newest GR00T with released weights and code, or one
  of the world-action models LeRobot v0.7.0 packages (section 5, Vision-Language-Action Models, lists both): of
  the two priced above, DreamZero's 7 Hz took two GB200 GPUs, and GR00T 2 has no code yet."

### 6-m15. "the family you can train and take apart on one GPU is the latent one" (line 879), "train" is new

- Sentence: "For the SO-101 on your bench, the family you can train and take apart on one GPU is the latent one
  (section 7, JEPA)."
- Register: F03-31 quote: "With 15M parameters trainable on a single GPU in a few hours" supports training a
  latent model on one GPU. The exclusive "the family" meets `02-imitation-and-vla.md` F02-90 (a one-GPU LoRA
  recipe for a pixel-family model on an SO-101 dataset) and F02-84 ("Edge, LoRA | 1 | 8 | 21 GB").
- Before text: "the family you can take apart on one GPU is the latent one".
- Replacement: "For the SO-101 on your bench, the family you can train from scratch and take apart on one GPU is
  the latent one (section 7, JEPA)."

### 6-m16. "Every use of a world model is this function called many times" (line 237), pre-existing

- Sentence: "Every use of a world model is this function called many times, so every use has the same bill: the
  number of rollout steps it needs, times the price of one step."
- Register: no entry is contradicted; the section itself says at line 642 "A world-action model is called once".
- Replacement: "Every use of a world model but the last one below is this function called many times, so each
  has the same bill: the number of rollout steps it needs, times the price of one step."

## What was checked and holds

- The headline comparison (lines 152 to 167): 16 s and 4 minutes on one RTX 4090, one tenth the candidates, the
  owner ("The authors of V-JEPA 2-AC"), and the caveat that the video model was Cosmos 1 7B fine-tuned by those
  authors. Matches F03-25 and the `wave2-A.md` row 36 instruction to keep the caveat. Arithmetic redone: 800 x 10
  = 8,000; 16 / 8,000 = 2 ms; 80 x 10 = 800; 240 / 800 = 300 ms; 300 / 2 = 150.
- New arithmetic, all correct and marked `<Derived>`: 640 / 32 = 20, 480 / 32 = 15, 300, 30 / 4 "about 8", 2,400,
  30 x 921,600 = 27.6 million, 35 x 2,400 = 84,000, 16 x 30 = 480, 153 / 33.3 = 4.6, 16 / 10 = 1.6, 1000 / 30 =
  33.3. Unmarked but correct and cited to F03-99 or F03-118: 16,000 GPU-seconds, 4.4 GPU-hours, 0.375 ms, 22 and
  65 microseconds (0.98 / 45,000 = 21.8; 0.98 / 15,000 = 65.3).
- Wave 2 corrections applied in the text: Cosmos 3 "end of May 2026" (F03-94); "pretraining" for the 1,024 GB200
  figure (F03-97); the LeWorldModel range and "GPU not named" (F03-118); the 3 s on an A100 written as "the same
  latent planner at the same settings ... Neither paper explains the gap" (F03-74); Genie 3 dated August 2025
  with its 24 fps and 720p not carried onto Genie 4 (F03-100, F03-101).
- Quotes are verbatim: "must dedicate significant model capacity and compute to capture all the low-level detail
  in the visual input" (F03-106); "evaluate or improve any policy" (F03-88); "learned latent representations"
  (F03-93); "relatively greedy" (F03-24); "fundamentally depend[s]" (F03-111); "the iterative denoising nature of
  video" (F03-103); "a few denoising steps suffice: one or two for video and two to four for actions" (F03-104).
- The loss block: symbols, T = 15, L1, frozen encoder, and the added rollout term match F11-100 and F11-102
  (`11b-formulas-world-models.md`). The two-stage training and the collapse guard match F03-1 and F03-2 ("a
  stop-gradient operation ... and an exponential moving average ... to prevent representation collapse").
- Things described as how the family goes wrong (lines 528 to 550): each of the three is an author's own
  statement with an entry (F03-109, F03-111, F03-110). None is an invented bench or training-curve observation.
- Memory block: 58, 31, 64, 44, 150, 93 GiB match the F03-121 rows; "floors the container checks", "not measured
  peaks", "no resolution or frame count" kept; "we found no first-party memory figure" keeps its scope; 32 and
  128 GB with "we read them as" (F03-123); 33.8 GiB as one image, from notes written for coding agents (F03-124);
  RTX 5070, 21 cases, 128 GB host, inference only (F03-125).
- Parameter table: all eight rows match F03-117. "two of the pixel models have 2B" and "RoboJEPA's largest
  predictor has 8B parameters on a 2B encoder" hold from the table.
- Scope statements dropped but nothing claimed in their place: "nobody we can cite has run Cosmos 3 on an SO-101"
  became "on paper, with Cosmos 3's published ratios"; "None of the models below has been run on an SO-101"
  became "On their own robot arms the V-JEPA 2 authors ...".
- Cross-references hold at 6384f0b: section 3 (33.3 ms tick, `observation.state`, the policy), section 4 (chunk,
  denoising a run of actions), section 5 (VLA; GR00T N1.7 as the newest with weights and code), section 7
  (collapse guards compared, lines 41 to 124 and 276 to 306), section 11 and section 16 (titles and topic),
  section 17 (a chunk covering a slow call).

## Counts, section 6

About 200 claims checked (prose, two figures, the chart's five bars, the eight-row table, the loss block), with
the Wave 2 and wave 3 lines read for every cited F03 entry.

Findings: 19. Errors: 3 (6-E1, 6-E2, 6-E3, all new in the rewrite). Minor: 16 (6-m10, 6-m13, 6-m14, 6-m16
pre-existing; 6-m4 uncertain).
# Accuracy review, wave 1 round 1, part B: sections 7 and 8

Reviewed text: committed sources at `6384f0b` (`git show 6384f0b:deep-dives/physical-ai/src/sections/Jepa.tsx`,
`.../RobotRl.tsx`), rendered text `/tmp/pai-rw/w1-r1/07-jepa.txt` and `08-robot-rl.txt`, compared against
`/tmp/pai-text-before/`. Registers: `deep-dives/physical-ai/research/2026-11/`. Line numbers are lines of the
committed `.tsx` at `6384f0b`. Wave 2, wave 3 and wave 5 files were grepped for every entry ID relied on.
Style is not reported.

---

# Section 7 (`jepa`, `src/sections/Jepa.tsx`)

## Findings

### 7-1. `error` (qualifier lost, and it now invites the comparison the register forbids)

- Where: `Jepa.tsx` lines 930 to 933, caption of the `JepaPasses` figure.
- Sentence, exactly: "The counts are our arithmetic from each paper's settings; the times are the authors' own,
  each on its own GPU, so compare them within a row."
- Before the rewrite the same statement read: "The times are the authors' own, each on its own GPU, so they do not
  compare like for like."
- Register: F03-74 (`03-world-models-and-jepa.md:566`) and its Wave 2 row.
  - F03-74, Use in dive: "Two first-party figures for the same plan: 16 s (RTX 4090, 2025 paper) and 3 s (A100,
    2026 paper). Neither paper explains the difference; see Contradictions. Quote both with their hardware."
  - `wave2-A.md:63` (row 51, F03-74): "Add a guard sentence: Table 6 gives 3 s for V-JEPA 2 as well, so the 16 s
    to 3 s change is between two papers' measurement setups, and neither paper explains it. Do not write it as a
    speed-up of V-JEPA 2.1 or as an A100-versus-4090 hardware ratio."
  - `wave3-unknowns.md:55` (F03-74): "Keep the guard sentence wave 2 added under the entry."
- Why it is wrong: only one row of the figure holds two times, the V-JEPA 2-AC row ("16 s on one RTX 4090", "3 s
  on one A100"). "Compare them within a row" therefore tells the reader to compare exactly the pair that the
  register says must not be read as a hardware ratio. The other three rows have one time each, so nothing else is
  comparable within a row. The "do not compare like for like" qualifier was dropped.
- Fix (replacement sentence): "The counts are our arithmetic from each paper's settings; the times are the authors'
  own, each on its own GPU and from its own paper, so they do not compare like for like, across rows or between
  the two times in the first row."

### 7-2. `error` (new training-curve observable with no register entry)

- Where: `Jepa.tsx` lines 380 to 383.
- Sentences, exactly: "The training loss reports neither. It measures agreement between guess and target, and
  collapsed latents agree perfectly, so a falling loss is what both a working run and a collapsing one show. What
  tells them apart is the spread of the latents across a batch, and every measure against collapse is a way of
  protecting that spread."
- Before the rewrite: "The second is harder to notice, because the latents do vary."
- Register: F03-64 (`03-world-models-and-jepa.md:503`), the entry cited in the block.
  - Evidence quote: "JEPA's prediction task admits failure modes, such as representation collapse, where f_theta
    maps all inputs to nearly identical embeddings (complete collapse) or to a low-dimensional subspace
    (dimensional collapse)".
  - Use in dive: "Dimensional collapse is the harder one to see: the loss looks fine and the embeddings differ,
    but most of the 192 (or 1,408) numbers carry nothing."
  - F03-63 claim: "the loss is zero while the representation is useless."
- What is and is not supported: "the loss does not report collapse" is supported (F03-63, F03-64). Two things are
  new and have no entry. (a) "a falling loss is what ... a working run ... show[s]": no entry describes the loss
  curve of a healthy JEPA run, and with a moving EMA target the register gives no basis for saying it falls.
  (b) "What tells them apart is the spread of the latents across a batch": no entry describes batch spread as the
  diagnostic an operator reads; the register only has spread as what VICReg and SIGReg penalise (F03-67, F03-69).
  I grepped `03-world-models-and-jepa.md` for "falling loss", "loss curve", "spread of the", "effective rank",
  "monitor": only the F03-64 Use line above matches.
- Fix (replacement for the three sentences): "The training loss reports neither. It measures agreement between
  guess and target, and collapsed latents agree perfectly, so a low loss does not show that the latents are of any
  use. Both degrees are defined by how the latents of a batch spread, and the measures that follow either protect
  that spread or fix the targets."

### 7-3. `minor` (three stated mitigations narrowed to one)

- Where: `Jepa.tsx` lines 673 to 674.
- Sentence, exactly: "Its authors add that replanning from the real frame softens the effect in their benchmarks."
- Register: F03-110 (`03-world-models-and-jepa.md:793`), Evidence quote: "A limitation of this class of approaches
  is the deterministic predictor: the MSE loss learns the conditional mean of potentially genuinely multi-modal
  futures. This is mitigated in our benchmarks by their deterministic dynamics, by the latent abstraction of
  task-irrelevant variability and closed-loop MPC providing robustness to prediction errors."
- What the entry says: three mitigations, and the first is that the benchmarks' dynamics are deterministic (the
  limit was not exercised). The sentence keeps only the third, which reads as if replanning is what handles
  multi-modal futures.
- Fix (replacement sentence): "Its authors add that three things soften the effect in their benchmarks: the
  dynamics there are deterministic, the latent leaves out variation the task does not need, and replanning from
  the real frame corrects prediction errors."

### 7-4. `minor` (quote widened from the MSE loss to any distance; uncertain)

- Where: `Jepa.tsx` lines 670 to 673.
- Sentences, exactly: "One limit comes with any predictor trained on a distance. It gives one output per input, so
  where two futures are plausible it learns their average, the fault section 4 found in regression on actions. A
  peer-reviewed study of the family names it: the loss "learns the conditional mean of potentially genuinely
  multi-modal futures"."
- Register: F03-110. Claim line: "a predictor trained with an L1 or L2 loss outputs one future, the average of the
  plausible ones." Evidence quote: "the MSE loss learns the conditional mean of potentially genuinely multi-modal
  futures."
- What is uncertain: the register's claim line supports the sentence as written (L1 or L2). The verbatim quote is
  about the MSE loss only, and the section's own model (V-JEPA 2-AC) trains on L1, whose minimiser is not the mean.
  The text swaps "the MSE loss" for "the loss" outside the quotation marks. I mark it minor because the claim line
  covers it; a verbatim quote outranks a claim line, so the safer wording keeps the quote's subject.
- Fix (replacement for the two sentences): "One limit comes with a predictor trained on a distance. It gives one
  output per input, so where two futures are plausible it settles between them, the fault section 4 found in
  regression on actions. A peer-reviewed study of the family names it for the squared-error loss its models use:
  "the MSE loss learns the conditional mean of potentially genuinely multi-modal futures"."

### 7-5. `minor` ("our reading" label dropped from our own derivation)

- Where: `Jepa.tsx` lines 508 to 511.
- Sentences, exactly: "In the table picture, that is every column with variance 1 and every pair of columns with
  covariance 0. A single point has variance 0 and a flat slice has columns that move together, so by those two
  definitions one term answers both degrees of collapse."
- Before the rewrite: "... so one term answers both degrees of collapse (our reading)."
- Register: F03-69 (`03-world-models-and-jepa.md:533`), Use in dive: "An isotropic Gaussian has unit variance in
  every direction (so no complete collapse) and zero covariance (so no dimensional collapse): it enforces both
  VICReg conditions and the full shape of the distribution with one term [our reading]."
- What the entry says: the conclusion is the register's own reading, labelled as such. "Variance 1" (changed from
  "the same variance") is supported by the same line ("unit variance"). The derivation is shown in view, which is
  why this is minor, but the label that marked it as ours is gone and the sentence follows a LeJEPA citation.
- Fix (replacement sentence): "A single point has variance 0 and a flat slice has columns that move together, so
  by those two definitions one term answers both degrees of collapse (our reading)."

### 7-6. `minor` (uncited generalisation; the register marks it as our reading and supports it with different facts)

- Where: `Jepa.tsx` lines 950 to 953.
- Sentences, exactly: "The published planners keep that space small. V-JEPA 2-AC limits each sampled action to
  about 13 cm of gripper travel, and its authors report trying camera positions by hand before settling on one
  that worked."
- Before the rewrite: "Each sampled action is limited to about 13 cm of gripper travel." (no generalisation).
- Register: F03-114 (`03-world-models-and-jepa.md:819`), Use in dive: "V-JEPA 2-AC's released code keeps the search
  to 4 numbers per step (x, y, z, gripper; F03-29) and RoboJEPA does the same ("3D-translation + 1D-gripper space
  with the end-effector orientation held fixed", Table 13 caption): a small action space is part of what makes CEM
  workable [our reading]." F03-28 Evidence: "we constrain each sampled action to the L1-Ball of radius 0.075 ...
  approximately 13 cm"; "we manually tried different camera positions before settling on one that worked well".
- What the entry says: the generalisation is the register's own reading, and its evidence is the number of action
  dimensions searched (4), in two planners. The text states it as fact, for "the published planners", and supports
  it with the 13 cm clip (a bound on size, in one planner) and camera placement (not about the action space).
- Fix (replacement for the two sentences): "The planners read here keep that space small (our reading): V-JEPA
  2-AC limits each sampled action to about 13 cm of gripper travel, and its released notebook and RoboJEPA's
  real-arm planner search only the x, y, z move and the gripper, with rotation held fixed. The V-JEPA 2 authors
  also report trying camera positions by hand before settling on one that worked."

### 7-7. `minor` (a reason attributed to the order of the authors' list)

- Where: `Jepa.tsx` lines 994 to 996.
- Sentence, exactly: "That is why RoboJEPA's authors can spread a round over several GPUs, and why the V-JEPA 2
  authors' list of ways to cut the time starts with more compute."
- Register: F03-116 (`03-world-models-and-jepa.md:831`), Evidence quote: "We can potentially reduce the planning
  time for both models in future work by leveraging additional computing resources for planning, reducing the
  number of samples and refinement steps used at each time step, training a feed-froward policy in the
  world-models' imagination to initialize the planning problem, or potentially leveraging gradient-based planning".
  F03-77 Evidence: "since CEM planning is heavily parallelizable, we connect the robot directly to the GPU cluster
  and run the planning on multiple GPUs."
- What the entry says: the RoboJEPA half is supported (the authors give parallelism as their reason). The V-JEPA 2
  authors list more compute first but give no reason for the order; "why ... starts with" is ours. The list itself
  is now reproduced correctly (the before text had "a fast policy trained on the planner's output", which the
  quote does not say).
- Fix (replacement sentence): "That is why RoboJEPA's authors can spread a round over several GPUs, and more
  compute is also the first item on the V-JEPA 2 authors' list of ways to cut the time."

### 7-8. `minor` (scope of a setting; unchanged by the rewrite)

- Where: `Jepa.tsx` lines 722 to 723.
- Sentence, exactly: "V-JEPA 2-AC executes 1 action of a 1-step plan, RoboJEPA 2 actions of a 5-step plan, and
  LeWorldModel all 5 action blocks of a 5-step plan."
- Register: F03-112 claim line carries the same words. F03-77 Wave 2 line (`03-world-models-and-jepa.md:584`,
  SCOPE NARROWER): "The 4,096 samples per iteration (15 cold and 10 warm iterations, horizon 5, 2 actions per
  replan, 20 steps) is the real-robot DROID/Franka configuration of Table 13; the simulated RoboCasa runs use
  1,024 samples and an execution prefix of 1."
- What the entry says: "2 actions" is the real-arm setting; in simulation RoboJEPA executes 1. The table further
  down scopes its row ("RoboJEPA on a real arm"); this sentence does not.
- Fix (replacement sentence): "V-JEPA 2-AC executes 1 action of a 1-step plan, RoboJEPA on a real arm 2 actions of
  a 5-step plan, and LeWorldModel all 5 action blocks of a 5-step plan."

### 7-9. `minor` ("video alone"; unchanged by the rewrite)

- Where: `Jepa.tsx` line 258.
- Sentence, exactly: "Pretraining uses video alone, with no actions and no labels."
- Register: F03-1 (`03-world-models-and-jepa.md:113`), claim: "an action-free encoder pretrained on over 1 million
  hours of internet video and 1 million images"; Evidence quote: "on a video and image dataset comprising over 1
  million hours of internet video".
- What the entry says: the pretraining set is video and images. The sentence means "no actions, no labels", which
  is supported; "alone" is the imprecise word.
- Fix (replacement sentence): "Pretraining uses video and images with no actions and no labels."

### 7-10. `minor` (figure label, in `components/figures/JepaPasses.tsx`, not in the section file; unchanged)

- Where: figure labels "LeWorldModel | on Push-T | 300 samples | 30 iterations | horizon 5 | = 45,000 | 0.98 s for
  a full plan | GPU not named".
- Register: F03-118 Wave 2 line (`03-world-models-and-jepa.md:845`): "For LeWM the paper does not say which planning
  setup the 0.98 s used (Figure 3: "averaged over 50 runs"; appendix D gives two iteration counts) and names no
  GPU."
- What the entry says: the 0.98 s is not known to belong to the Push-T count. The prose (line 851) and the table
  (lines 899 to 900) carry the caveat; the figure row pairs the Push-T count with the time and does not.
- Fix (replacement label for "GPU not named"): "GPU and timed setting not named".

## What was checked and holds (Section 7)

About 225 checkable claims (numbers, quotes, attributions, derivations, toy arithmetic, cross-references), each
against the entry cited in its block:

- Header and opening: collapse definition and both quotes (F03-63); the three measures (F03-8, F03-35, F03-71);
  800 x 10 x 1 = 8,000 (F03-24); "the V-JEPA 2 authors report ... 16 seconds on one NVIDIA RTX 4090" (F03-25, owner
  and hardware kept); 30 ticks a second (F01-28) and 16 x 30 = 480.
- "The answer is a description": energy wording (F03-47, F03-48); encoder may drop the unpredictable (F03-51); the
  trajectory against the leaf (F03-107, attributed to the V-JEPA 2 authors); decoder for inspection and "not fully
  preserved" (F03-109, attributed to the LeWorldModel authors).
- "What the encoder reads": tubelet 2 x 16 x 16 (F03-3); 16 frames, 256 x 256, 4 fps (F03-11); 16 / 2 = 8,
  256 / 16 = 16, 8 x 16 x 16 = 2,048; ViT-g 1B, 40 layers, 1408; predictor 22M, 12 layers, 384 (F03-4); masks
  8 x 15% and 2 x 70% (F03-9); about 90% from the V-JEPA paper with the note that the V-JEPA 2 paper prints none
  (F03-60, F03-9); 205 of 2,048 (10% of 2,048 = 204.8). Figure: 2 x 16 x 16 = 512; 16 x 256 x 256 x 3 = 3,145,728
  (3.1 million); 2,048 x 1408 = 2,883,584 (2.9 million); labelled "our arithmetic" and "Illustrative".
- "One training step": mask-token handling (F03-6); equation 1 and its symbols (F03-2); toy L1: differences 1, 0,
  1, 2, sum 4, mean 1, labelled an illustration; mean and layer norm in code (F03-7); `torch.no_grad()` and
  `requires_grad = False` (F03-7, F03-8); m = 0.99925 constant (F03-8); 1 - 0.99925 = 0.00075; 0.99925 x 0.5 +
  0.00075 x 0.9 = 0.5003; 0.4 x 0.00075 = 0.0003; 1 / 0.00075 = 1,333; ln 0.5 / ln 0.99925 = 923.9, printed 924.
- "Collapse": two degrees (F03-64); hypothesis wording (F03-65, kept as the V-JEPA authors' hypothesis);
  "well-defined objective" quote (F03-66, kept as the LeWorldModel authors' objection); frozen encoder and the
  "inherently limited" quote (F03-71); RoboJEPA frozen encoder (F03-75; wave2-A row 47 confirms).
- "Spread as a loss term": contrastive history (F03-70); VICReg terms and equation 6 (F03-67); seven terms, six
  coefficients, instability, attributed to the LeWorldModel authors (F03-68); toy batches: column means 2.5,
  products 0.75 - 0.75 - 0.75 + 0.75 = 0; SIGReg name and target (F03-69); 15M, 192, no target copy, no
  stop-gradient (F03-31, F03-32, F03-35, F03-36); Cramer-Wold (F03-39); equations 1 and 3 (F03-36); 0.1 against
  0.09, 1,024 projections, 17 points (F03-36, F03-37); above 80% for 0.01 to 0.2 on Push-T and the 184 threshold,
  attributed (F03-46); 96.0 / 92.0 / 78.0 over three seeds, all four tasks simulated, DINO-WM ahead on
  OGBench-Cube, no real-robot result (F03-42); the stated weakness (F03-45); SIGReg code: 17 values from 0 to 3,
  weight, batch-size scaling, mean over 1,024 directions (F03-38).
- "Adding actions": two stages, over 1 million hours, under 62 hours (F03-1); 300M, 24 layers, 1024 (F03-14);
  7-number action and state, 16 x 16 x 1408 (F03-15); 1 + 1 + 256 = 258 (F03-16); teacher forcing (F11-100);
  error accumulation (F03-28); rollout loss, T = 2, equal weight, one recurrent step (F03-18, F11-102). F03-82
  (the reported rollout-loss bug) was read: it concerns the released training code, which the section does not
  quote, and the Wave 2 line says the pinned SHA computes the rollout as the paper describes; no caveat is owed.
- "Planning": equation 5 and the argmin (F03-23, F11-101); MPC settings (F03-112); CEM steps (F03-113); toy
  iteration: distances to -10 are 14, 4, 11, 2, 7, 17, 3, 12; three lowest -8, -7, -6; mean -7; sample standard
  deviation 1; labelled an illustration; 16 s / 8,000 = 2 ms (F03-118, Wave 2 confirms); 4 + 10 + 4 = 18,
  18 x 8,000 = 144,000, 18 x 16 = 288 s = 4.8 min, labelled "our arithmetic" and "at the authors' RTX 4090 rate"
  (F03-27; wave2-A row 26 asks for the derived label, which is present); no reward, task label or success flag
  (F03-20); 80% / 65% and 65% / 25%, two Franka arms, 10 trials, attributed (F03-26); V-JEPA 2.1 release date,
  recipe, ViT-G 2B (F03-72); 70% against 60%, 10 trials, cup, the 65% discrepancy, 80% at horizon 8 (F03-73 with
  its Wave 2 line); "better encode depth information" (F03-111); 300 x 15 x 8 = 36,000; RoboJEPA date, sizes,
  15,022 and 6,692 hours (F03-75, F03-76); "already sit close to data saturation" (F03-79); 67 / 50 / 27 against
  5 / 0 / 53, the direction of the pick-and-place result kept as wave2-A row 55 requires, 53 / 27 = 1.96, the
  "contextual references" quote (F03-78); 45,000 / 8,000 = 5.6; 0.98 s with the which-setting caveat (F03-41,
  F03-118 Wave 2); 300M over 258 tokens against 10M over 1 to 3 tokens (F03-115, F03-33); table rows: 8,000;
  36,000 and 14 s on a single A100; 45,000 and 15,000; 0.98 s against 47 s; 204,800 and 307,200, "RoboJEPA on a
  real arm", "not real-time", "several seconds" (F03-24, F03-25, F03-73, F03-74, F03-40, F03-41, F03-77, F03-115);
  3 s / 8,000 = 0.375 ms and "neither paper explains the gap" in the prose (F03-74 guard kept there); CEM limits
  quote (F03-114); notebook defaults and 400 x 10 x 2 = 8,000 (F03-29).
- "What a JEPA asks of a machine": 60 GPU-years on A100s, 8.4x, GPU count and duration not stated, attributed
  (F03-12); 4 nodes of 8 GPUs (F03-21); 32 nodes of 8 H100 (F03-80); single GPU in a few hours, GPU not named
  (F03-31); the V-JEPA 2 authors' list (F03-116); gradient planners and CEM (F03-81); the H200 profile, the
  "bound by host-side dispatch" quote and 26% at a batch of 16, attributed (F03-80); closing recap (F03-24,
  F03-25, F03-115, F03-4). "Tensor cores" is uncited in this section; it is supported by the register's compute
  table (`03-world-models-and-jepa.md:1071` to `1075`) and defined in section 21 (F08-42).
- Cross-references, read at `6384f0b`: section 6 (World Models) defines the pixel and latent families; section 3
  (The Robot as a Computer) has the 30 Hz clock and six joint targets; section 4 (Learning From Demonstrations)
  has the L1 distance on action chunks and the two-modes-average fault; section 15 (Training at Three Scales)
  carries the JEPA training sizes; section 21 (title "Reading a Machine: PMU Cards") defines tensor cores and how
  to tell what a GPU job waits on. All hold.
- No dollar figure. Toy numbers are all labelled as illustrations.

**Section 7 totals: about 225 claims checked, 10 findings (2 `error`, 8 `minor`).**

---

# Section 8 (`robot-rl`, `src/sections/RobotRl.tsx`)

## The GPU unit behind simulated physics: F04-55 against F08-76

**The two entries, quoted.**

F04-55 (`04-rl-and-agentic-loops.md:456`), in full as far as it bears on the question:

- Claim: "Adding a camera costs most of the throughput. Same benchmark, 8,192 environments, one camera per
  environment: a Kuka-Allegro lift task trains at about 28,000 steps per second with PhysX physics and RTX
  rendering, against about 61,000 without the camera; with the Newton physics and Newton renderer pair it is
  about 116,000 against 221,000."
- Evidence (verbatim source text): total_fps_mean values "Isaac-Lift-KukaAllegro ... isaacsim_physx,none ...
  60756.60"; "Isaac-Lift-KukaAllegro-Camera ... isaacsim_physx,isaacsim_rtx ... 27962.00" (vram_mean_gb 24.22);
  "Isaac-Lift-KukaAllegro ... newton_mjwarp,none ... 220831.00"; "Isaac-Lift-KukaAllegro-Camera ...
  newton_mjwarp,newton_renderer ... 115888.50" (vram_mean_gb 13.61); README preset names.
- Use in dive: "section 8, why vision-based RL in simulation is the expensive case, and which part of the GPU it
  loads: physics and the policy use the tensor cores; RTX rendering adds the ray-tracing path and memory (24 GB
  against 17 GB here)."
- Wave 3 note: about the camera size only (F06-103). `wave2-B.md:71` (row 55) rules HOLDS on the throughput and
  memory figures and says nothing about the GPU unit. `wave5-refutation.md` does not mention the entry.
- The same register repeats the Use line in its teaching table (`04-rl-and-agentic-loops.md:701`): "GPU tensor
  cores (physics and the small policy); CPU for orchestration", against F04-54.

F08-76 (`08-compute-shapes.md:595`):

- Claim: "[our reading] The workload table. "Part loaded" names the part that saturates first according to the
  cited evidence ..."
- Row 6: "GPU-parallel physics (4 Simulate; RL rollouts; state-only demo multiplication) | Thousands of copies of
  the arm stepped together on one GPU | General GPU compute (not tensor cores `[our reading]`, F08-42), plus a
  single CPU core feeding it | Same arithmetic as row 5 batched over worlds; tens to hundreds of KB of GPU memory
  per world; throughput falls as contacts add branches | F06-16, F06-17, F06-20, F06-22, F06-47, F06-100, F04-54,
  F05-90".
- Row 7: "Simulated cameras ... | GPU memory capacity first, then the rendering path: RT cores for RTX renderers,
  general compute for the Warp ray tracer | ... adding the camera cut training throughput by a factor of about 2
  to 7".
- No Wave 2, 3 or 5 line corrects it. `wave2-C.md:264` says the `[our reading]` entries F08-74 to F08-83 and
  F08-42 "were not individually ruled on".

The entries row 6 rests on:

- F08-42 (`08-compute-shapes.md:345`), Evidence, verbatim from NVIDIA: "Specialized GPU cores that speed up AI and
  HPC math workloads"; "Tensor Cores enable mixed-precision computing"; and from the Nsight Compute Profiling Guide
  (Tier 1): "The Tensor pipeline executes various MMA instructions." Use in dive: "`[our reading]`: transformer
  training and inference load the tensor pipeline; GPU physics (MuJoCo Warp, PhysX) is general CUDA compute on the
  floating-point and integer units. The physics half of that sentence is inference from what those kernels
  compute, not a measurement; a Tier 0 `ncu` run would settle it (F08-74)."
- F06-100 (`06-simulation-and-sim-to-real.md:744`), claim: "GPU physics (MJX-JAX, MuJoCo Warp, Newton, PhysX GPU)
  loads the GPU's general compute cores and its memory, with a CPU side that still matters"; Use in dive: "GPU
  compute (CUDA kernels, not tensor-core matrix multiplies in the sense of a transformer) ... plus one fast CPU
  core driving the loop." Its verbatim quote is about the host copy only ("requires a device-to-host memory copy
  and pipeline synchronization").
- F08-36 (`08-compute-shapes.md:304`), verbatim unit list from the same guide: "Integer Execution units",
  "Floating Point Execution units", ..., "Tensor Cores", "RT Cores, if available".

**What each says.** F04-55's Use line says simulated physics and the policy run on the tensor cores. F08-76 row 6
says GPU-parallel physics is general GPU compute and not the tensor cores, with one CPU core feeding it, and marks
the "not tensor cores" part as our reading.

**Which one the section follows, and where.** F08-76, in two places and nowhere the other way:

- Lines 265 to 267 (prose): "Stepping thousands of environments together is general GPU compute, the card's
  ordinary arithmetic as opposed to the tensor cores that matrix-heavy training uses, with one CPU core feeding
  it." Cited to F08-76 (line 273), whose chip renders the provenance "our reading".
- Lines 572 to 573 (table cell, "Part it exhausts first"): "General GPU compute for the physics, with one CPU core
  feeding it. With cameras, GPU memory first and then the rendering path". Introduced at lines 548 to 549 with
  "(the parts and shapes in the table are our reading of the cited sources)".
- Lines 166 to 167 ("Rendering, a small network, physics and the update all run on the one GPU") name no unit and
  fit either entry. The camera half (memory first, then a rendering path) is the same in both entries.

**Is following F08-76 right?** Yes, with one condition on wording.

1. A verbatim source quote outranks a Use line, and F04-55 has no quote on the GPU unit at all. Its Evidence is
   throughput and memory columns of a CSV. "Physics and the policy use the tensor cores" is a register author's
   note with nothing quoted behind it.
2. The only verbatim text in the registers about what tensor cores execute is F08-42 and F08-36: "The Tensor
   pipeline executes various MMA instructions" (matrix-multiply-accumulate), listed apart from the integer and
   floating-point execution units. A rigid-body step (collision, constraint solve, integration, "the same
   arithmetic as row 5 batched over worlds") is not a stream of MMA instructions. That quote supports F08-76's
   direction and contradicts F04-55's note for the physics half.
3. Three entries in two registers agree with each other (F08-76 row 6, F08-42, F06-100); F04-55's note and the
   teaching-table row beside it stand alone. Register 08 is the register that owns the part-of-the-machine
   question. Sections 12 and 20 at `6384f0b` already say the same thing as section 8 (`PhysicsSimulation.tsx`
   line 662, `Workloads.tsx` lines 787 to 789), so following F04-55 here would have made the dive contradict
   itself.
4. The condition: no source read states it and nobody measured it. F08-42 says so in terms: "inference from what
   those kernels compute, not a measurement". The section's sentence at lines 265 to 267 is written as a flat
   fact; its only signal is the "our reading" chip at the end of a five-sentence paragraph that also carries a
   vendor-figure citation and an AWS citation. That is finding 8-3 below. F04-55's note also covers the policy
   ("physics and the policy"); the section says nothing about which unit the small policy network or the PPO
   update uses, so it neither follows nor contradicts that half, and it should not start to.

Not a section fix, but it should be recorded: the F04-55 Use line and the teaching-table row at
`04-rl-and-agentic-loops.md:701` still say "tensor cores" for physics. They need a correction line in the
register ("superseded by F08-76 row 6 and F08-42: general GPU compute, our reading, unmeasured"), or the next
author who opens F04-55 will write the opposite sentence. I did not edit the register.

## Findings

### 8-1. `error` (scope widened: a ratio from two manipulation rows stated as what "a camera" costs)

- Where: `RobotRl.tsx` line 125 (h2 description, new in the rewrite), lines 260 to 261 (new in the rewrite), and
  line 570 (table cell, carried over from before).
- Sentences, exactly:
  - "Size a simulator run from three numbers in one file, and expect a camera to take about half of the
    throughput"
  - "Use them for the ratio a camera costs, and measure the rate of your own task."
  - "Simulator and renderer throughput; a camera takes about half of it"
- Register:
  - F04-55 Use: "[derived] 27,962 / 60,757 = 46% of the state-only rate on PhysX plus RTX; 115,889 / 220,831 = 52%
    on Newton." (Kuka-Allegro lift rows only.)
  - F08-76 row 7, the entry the section cites at line 273: "adding the camera cut training throughput by a factor
    of about 2 to 7".
  - F06-48 (`06-simulation-and-sim-to-real.md:417`), same NVIDIA file, Cartpole rows: "Adding the camera cut
    Newton's Cartpole training throughput from 1,023,698 to 152,124, a factor of 6.7".
  - F06-49 Use: "on a contact-heavy task the camera halves throughput (220,831 to 115,889, a factor of 1.9
    [derived]) instead of dividing it by seven, because physics already dominates."
- What the entries say: in the same benchmark file the camera costs a factor of about 2 on one task and 6.7 on
  another; "about half" is the Kuka-Allegro result, and the register explains it by that task's heavy physics.
  The body paragraphs (lines 237 to 241) and the opening (lines 50 to 52, "in NVIDIA's benchmark of another
  robot") keep that scope. The three sentences above drop it and tell the reader to carry the ratio to their own
  run, which the cited row 7 does not support. Whether the SO-101 recipe sits nearer 2 or 7 is not in any entry.
- Fix (three replacement sentences):
  - Line 125: "Size a simulator run from three numbers in one file, and see what a camera cost in NVIDIA's
    benchmark: about half of the throughput on a manipulation task"
  - Lines 260 to 261: "Use them for what a camera cost on a manipulation task, about half, knowing that the same
    file's Cartpole rows lose a factor of 6.7 to the camera, and measure the rate of your own task." (add
    `<Cite id="F06-48">Isaac Lab 3.0 benchmark file, Cartpole rows</Cite>`; F06-48 is in `registry.json`.)
  - Line 570: "Simulator and renderer throughput; in NVIDIA's manipulation rows a camera takes about half of it"

### 8-2. `minor` ("Illustration only" became "an order of magnitude")

- Where: `RobotRl.tsx` lines 244 to 247.
- Sentences, exactly: "At about 28,000 steps a second the SO-101 recipe's 196,608,000 steps would take about 7,000
  s, close to two hours; at about 116,000 a second, about 1,700 s, under half an hour. The robot, the task and the
  simulator all differ from the recipe's, so take the pair as an order of magnitude."
- Register: teaching notes of register 04 (`04-rl-and-agentic-loops.md:677`): "Illustration only, because robot
  and task differ: 196,608,000 steps at those two rates would take 7,031 s (about 2 hours) and 1,697 s (about 28
  minutes). The measured wall-clock for the SO-101 recipe itself is not published in the files read (U12)."
  F04-54 Use: "These are throughput figures; time to a working policy is not in this file (U11)."
- What the entry says: the arithmetic holds (196,608,000 / 27,962 = 7,031 s; / 115,889 = 1,697 s; the text's
  rounded rates give 7,022 s and 1,695 s). The register allows it as an illustration only. "Take the pair as an
  order of magnitude" claims the real run time lies within a factor of ten, which no entry supports: the recipe
  runs 4,096 environments and 20 physics steps per control step on an unnamed GPU, the benchmark 8,192
  environments of another robot. It also sits oddly beside lines 259 to 261, which tell the reader not to use
  these figures as a time.
- Fix (replacement for the second sentence): "The robot, the task, the simulator, the environment count and the
  GPU all differ from the recipe's, so the pair illustrates the arithmetic and is no estimate for this recipe."

### 8-3. `minor` (our reading stated as flat fact; see the subsection above)

- Where: `RobotRl.tsx` lines 265 to 267.
- Sentence, exactly: "Stepping thousands of environments together is general GPU compute, the card's ordinary
  arithmetic as opposed to the tensor cores that matrix-heavy training uses, with one CPU core feeding it."
- Register: F08-76 row 6: "General GPU compute (not tensor cores `[our reading]`, F08-42), plus a single CPU core
  feeding it". F08-42 Use: "The physics half of that sentence is inference from what those kernels compute, not a
  measurement; a Tier 0 `ncu` run would settle it (F08-74)."
- What the entry says: the direction is the register's, labelled our reading and unmeasured. The sentence carries
  no such mark; the "our reading" chip appears four sentences later, after a vendor figure and an AWS quote.
- Fix (replacement sentence): "Stepping thousands of environments together is, on our reading of what those
  kernels compute and with no measurement behind it yet, general GPU compute: the card's ordinary arithmetic as
  opposed to the tensor cores that matrix-heavy training uses, with one CPU core feeding it."

### 8-4. `minor` (subject shifted by moving the sentence)

- Where: `RobotRl.tsx` lines 432 to 434.
- Sentence, exactly: "The algorithm is SAC (Soft Actor-Critic), an RL method that trains from a replay buffer, a
  store of past steps that training samples from again and again, where PPO discards a batch after a few passes."
- Register: F04-76 claim: "LeRobot v0.7.0 (5 Nov 2026) ships HIL-SERL as two programs ... The algorithm is Soft
  Actor-Critic (SAC)." F04-73 Evidence (the paper): "The learner process samples data equally from the demo and RL
  replay buffers, optimizes the policy using RLPD".
- What the entries say: SAC is what LeRobot's implementation runs; the paper names RLPD. Before the rewrite the
  sentence sat in the paragraph about LeRobot's two programs. It now follows the paragraph on the HIL-SERL
  authors' results and precedes "In the HIL-SERL paper the learner keeps two buffers", so "the algorithm" reads
  as the paper's.
- Fix (replacement sentence): "LeRobot's implementation uses SAC (Soft Actor-Critic), an RL method that trains
  from a replay buffer, a store of past steps that training samples from again and again, where PPO discards a
  batch after a few passes."

### 8-5. `minor` (vendor figure kept its owner but lost its stated gaps)

- Where: `RobotRl.tsx` lines 388 to 390.
- Sentence, exactly: "NVIDIA reports a gain of the same kind for GR00T 2 on three contact-rich insertion tasks:
  from 40 to 76% success after supervised training to 88 to 96% with RL on the real robot."
- Before the rewrite: "... with RL on the real robot, driven only by task-level success signals. The page gives no
  robot count, episode count or training time for that stage."
- Register: F04-68 (`04-rl-and-agentic-loops.md:537`), Use: "[vendor claim] The page gives no robot count, episode
  count, training time or learner hardware for the RL stage, and does not define "GRPO-induced self-imitation"
  (U16)." Evidence: "from 40-76% success after supervised post-training to 88-96% with GRPO-induced
  self-imitation."
- What the entry says: the numbers and the owner hold. The conditions sentence was dropped, and "a gain of the
  same kind" now sets a success-rate figure with no trial count beside Recap's throughput figure.
- Fix (replacement sentence): "NVIDIA reports a gain for GR00T 2 on three contact-rich insertion tasks: from 40
  to 76% success after supervised training to 88 to 96% with RL on the real robot. Its page gives no robot count,
  episode count or training time for that stage."

### 8-6. `minor` (scope of "nothing is published")

- Where: `RobotRl.tsx` lines 531 to 532.
- Sentence, exactly: "No success rate is published for it, so the first figure for this policy on a real arm will
  be your own count at your own bench."
- Register: F06-26 claim: "No success rate is published for it"; Use: "The success rate is UNKNOWN (U3)." F04-57
  Use: "The measured real-world success rate of the SO-101 policy is not stated in the files read (U12)." U12
  (`04-rl-and-agentic-loops.md:803`): to close it needs "A run on one GPU (Tier 0), or figures from the Playground
  authors".
- What the entries say: what was checked is the deploy README and the task files at tag v1.0.1, read on
  2026-11-20. F06-26's claim line uses the wide wording, so the sentence matches a register line; F04-57 gives the
  scope that the research supports. The section already scopes the matching wall-clock statement correctly (line
  220: "The recipe's configuration and README at 1.0.1 give no wall-clock time").
- Fix (replacement sentence): "The README and task files at 1.0.1 give no success rate for it, so the first figure
  for this policy on a real arm will be your own count at your own bench."

### 8-7. `minor` (definition with no register line; uncertain)

- Where: `RobotRl.tsx` lines 310 to 312.
- Sentence, exactly: "Its algorithm is GRPO (Group Relative Policy Optimization), which scores each attempt
  against the others collected with it, and its unit of progress is the training step: one round of collecting
  attempts and updating the model, a far larger thing than a control step."
- Register: F04-70 Evidence: "One GRPO step took about 1,490 s (25 min); training took 31.6 h". F04-68 Use: "GRPO
  ... scores each attempt relative to the other attempts in its group".
- What is uncertain: the GRPO gloss is supported. "One round of collecting attempts and updating the model" as
  the meaning of one GRPO step is not stated in F04-70 or anywhere in register 04 (grepped for "GRPO step",
  "global_step", "rollout epoch"). It is plausible for a 25-minute step, and I could not confirm or refute it from
  the registers.
- Fix (replacement sentence): "Its algorithm is GRPO (Group Relative Policy Optimization), which scores each
  attempt against the others collected with it, and its results file counts progress in GRPO steps, each about 25
  minutes long in this run and so a far larger thing than a control step."

### 8-8. `minor` (owner of the recipe renamed)

- Where: `RobotRl.tsx` lines 308 to 309.
- Sentence, exactly: "An AWS sample repository runs a recipe from the piRL team on OpenVLA-OFT, a 7B-parameter
  VLA, in LIBERO's Goal suite."
- Before the rewrite: "... runs a GRPO recipe from the RLinf project on OpenVLA-OFT ...".
- Register: F04-70 claim: "the AWS sample runs RLinf v0.4's GRPO recipe on OpenVLA-OFT (7B) in the LIBERO-Goal
  simulator." F04-69 claim: "piRL (RLinf team, v3 of Jan 2026)".
- What the entries say: the recipe's owner is the RLinf project at v0.4. That the piRL paper comes from the RLinf
  team is in F04-69, so the link is supported, but the sample does not run piRL and the version was dropped.
- Fix (replacement sentence): "An AWS sample repository runs the GRPO recipe of RLinf v0.4, the project of the
  piRL authors, on OpenVLA-OFT, a 7B-parameter VLA, in LIBERO's Goal suite."

### 8-9. `minor` (subject of a quote narrowed to this arm)

- Where: `RobotRl.tsx` lines 476 to 478.
- Sentence, exactly: "For the SO-101 the documentation promises a trained policy "in just a few hours" and the
  guide at v0.7.0 has no table of results, so the hours and the success rate on this arm are yours to measure."
- Register: F04-81 Evidence, the verbatim line: "You will master training a policy with RL on a real robot in just
  a few hours." F04-80 Use: "Measured training time on an SO-101 is stated only as "in just a few hours" (docs
  line 3); no table of results (U19)."
- What the entries say: the guide's promise is about "a real robot", in a guide that covers the SO-100 and
  SO-101; it is not a statement about the SO-101. The Use line of F04-80 reads it the section's way, so this is
  imprecise more than unsupported.
- Fix (replacement sentence): "The guide opens with the promise that you will train a policy on a real robot "in
  just a few hours", and at v0.7.0 it has no table of results, so the hours and the success rate on this arm are
  yours to measure."

### 8-10. `minor` (a bench failure described as fact with no source; unchanged by the rewrite)

- Where: `RobotRl.tsx` lines 77 to 79.
- Sentence, exactly: "Asked to pick up a block and place it in a cup, it closes on the block most of the time, and
  now and then the gripper closes a little early and the block skids away."
- Register: none. No entry in registers 01, 02 or 04 reports this failure for an SO-101 imitation policy; the
  sentence was in the text before the rewrite in two sentences.
- What it is: an invented scene used to motivate RL. It is not marked as an illustration, unlike every other
  invented number in the section.
- Fix (replacement sentence): "Suppose that, asked to pick up a block and place it in a cup, it closes on the
  block most of the time, and now and then the gripper closes a little early and the block skids away (an
  illustration)."

## What was checked and holds (Section 8)

About 170 checkable claims, each against the entry cited in its block:

- Opening: 4,096 x 16 x 3,000 = 196,608,000 (F04-58); 196,608,000 / 10 = 19,660,800 s = 227.6 days, printed
  "about 228 days"; "runs on one GPU" (register 04 compute table, `:704`: "one GPU; a CPU fallback at 64 copies
  exists"); camera about half, scoped to "NVIDIA's benchmark of another robot" (F04-55); 20 s + 5 s = 25 s,
  3,600 / 25 = 144 (F04-77).
- "Scored attempts": classifier or hand marking on gamepad or keyboard (F04-77); PPO alternates sampling and
  optimisation with several epochs per batch (F11-4); figure labels: 4,096, 16, 3,000, 197 million, "The files
  read publish no wall-clock time for this recipe", 64 to 320 on 8 GPUs, 20 s and 5 s, "four attempts in 100 s"
  (F04-58, F04-69, F04-77).
- "A simulator turns one GPU into 4,096 arms": Playground 1.0.1, 64 x 64 wrist camera, 10 Hz, zero-shot (F04-57);
  "the shipped task is the pick half ... the release has no task for placing the block in the cup" (F04-57 Use:
  "the placing half is not in this release"); 64 x 16 x 3,000 = 3,072,000 and 4,096 / 64 = 64 (F04-58, the "For
  CPU" override); CNN of two layers and MLP 256, 256, 128 (F04-58); 20 physics steps of 5 ms per 100 ms (F06-105);
  4,096 x 16 = 65,536; PPO expandable: ratio, clip, min, "say, epsilon = 0.2" and `clip_param = 0.2` (F11-4,
  F04-58); toy: 1.5 x 2 = 3, clip(1.5, 0.8, 1.2) x 2 = 2.4, min = 2.4, labelled invented; no wall-clock in the
  configuration and README at 1.0.1 (F04-58, scope kept); Franka in ten minutes on a single RTX 4090 and 12 of 12,
  attributed to the Playground authors, software rewritten since (F04-56); 165,000 and 319,000 on one RTX PRO
  6000 Blackwell Server Edition with 8,192 environments, attributed to NVIDIA's file (F04-54); 61,000 / 28,000 and
  221,000 / 116,000, 46% and 52% (F04-55; `wave2-B.md:71` HOLDS); 115,889 / 27,962 = 4.1, different engines, plain
  colour against a shaded image, one fixed 64 x 64 camera (F06-103, caution printed as its Use line requires);
  "dirty working tree reported" and no time to a working policy (F04-54); 24.22 GB and 13.61 GB, attributed
  (F04-55); AWS post of June 2026, "requires GPUs with hardware RT Cores", P family without them, scoped to the
  RTX renderer as the F06-60 Use line and Wave 2 line require.
- "On a pretrained policy": 8,192 on one GPU for a small policy (F04-54, F04-69 Use); 64 to 320 on 8 H100 80 GB,
  64 / 8 = 8, 320 / 8 = 40, 8,192 / 40 = 205, 8,192 / 8 = 1,024; 77.1% to 98.3% on LIBERO from one demonstration
  per task, attributed (F04-69); p5en.48xlarge Spot, 8 H200, 75 steps, 31.6 h, 31.6 x 60 / 75 = 25.3 min, 243/500
  and 425/500, "single run", no dollar figure printed (F04-70); earlier run: 8 H100, 38 h under a 40 h cap, 27
  min, 2,280 / 27 = 84.4, stopped at step 83 of 100, checkpoints lost on the instance (F04-71); Recap's three
  stages (F04-60); 670M backbone, steps to success in -1 to 0 (F04-61); advantage conditioning and the per-task
  threshold (F04-62); formula and the two forms of the advantage (F11-6); toy: -0.30 - (-0.40) = +0.10 > +0.05,
  labelled invented and matching the register's toy; corrections labelled true (F04-63); 300 on four robots, 600
  plus 360 on 3 robots (F04-65); Gemma 3 4B and 860M action expert (F04-64); throughput more than doubling,
  attributed and defined (F04-66); 40 to 76% and 88 to 96%, attributed to NVIDIA (F04-68); both Recap limit
  quotes verbatim (F04-67).
- "On the real arm": SO-100 and SO-101, SO-101 leader and its gears (F04-80); 1 to 2.5 hours, 20 to 30
  demonstrations, one RTX 4090, attributed to the authors (F04-72); 2.5 x 144 = 360, 360 x 20 s x 10 = 72,000,
  196,608,000 / 72,000 = 2,731, printed "about 2,700"; two buffers sampled equally (F04-73); intervention replaces
  and is stored (F04-74); actor, learner, gRPC, GPU (F04-76); push every 4 s, the 1 to 2 s note, 100,000
  transitions per buffer, learner address 127.0.0.1 (F04-78, F04-76 Use); "5-10 seconds" quote, 10 + 5 = 15,
  3,600 / 15 = 240 (F04-77); both intervention quotes verbatim, "a few runs" (F04-79).
- "Attempts are only as good as ...": classifier above 95% on its evaluation set, attributed (F04-74); FailBench:
  13 detectors, 2,197 attempts, 0.77, none above 0.60 on contact-intensive assembly, bias toward success,
  attributed, balanced accuracy defined (F04-45); intervals 44.2-53.0% and 81.6-87.9%, disjoint; smoke profile 5
  steps, one L40S, 56 minutes, 45.0% to 50.0%, overlapping (F04-70); randomisation list with plus or minus 2.5 mm
  (F06-28); "can easily be off by 1-2+ cm in end-effector height" (F06-29); "tested on 3 different robot setups
  under various lighting conditions" and the shadow quote (F06-26).
- "Each supply exhausts ...": table rows against F04-58, F04-55, F04-69, F04-70, F04-67, F04-76, F04-72, F04-77,
  F08-76; "No recipe specific to this arm was located in this research" keeps the scope F04-81 requires; "about
  25 minutes each, 75 of them took more than a day on eight GPUs" (F04-70).
- Cross-references, read at `6384f0b`: section 3 (leader arm and teleoperation), section 4 (episode, copying a
  demonstrator), section 5 (VLA), section 12 (Physics Simulation; it also says general compute for GPU physics),
  section 13 (Rendering and Ray Tracing; RT cores), section 14 (title "Sim-to-Real and Real-to-Sim: Widen the
  Simulator or Measure the Arm" matches "the two remedies"), section 16 (Evaluation; intervals), section 19
  (Agents Running the Loop; who writes and freezes the grader), section 20 (Fifteen Workloads, Five Shapes; the
  same row 6 wording). The link `../rl-agentic-loops/` points at a dive that exists in `deep-dives/`. All hold.
- No dollar figure (the register's "about US$1,100" was not printed). Invented numbers are labelled.

**Section 8 totals: about 170 claims checked, 10 findings (1 `error`, 9 `minor`).**
