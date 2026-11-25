# Adversarial review, batch w2r2/inY

| File | Argument | Depth | Clarity | Sentences | Parity | Verdict |
|---|---|---|---|---|---|---|
| doc-A (9. RLVR & GRPO) | 7 | 9 | 6 | 7 | 7 | distinguishable: weaker |
| doc-B (13. Rendering and Ray Tracing) | 9 | 9 | 8 | 8 | 9 | sets the bar |
| doc-C (3. The Robot as a Computer) | 8 | 8 | 8 | 8 | 9 | sets the bar |
| doc-D (10. Processing and Curating) | 8 | 9 | 8 | 7 | 8 | not distinguishable by quality from the best files |

---

## doc-A: "9. RLVR & GRPO"

Scores
- Argument 7: a real thesis (spend each step on prompts that can teach) arrives in paragraph 2 with our own run's numbers. But the title and first sentence are definitions, and the middle third becomes a catalogue of successors and settings.
- Depth 9: the most code-level page in the batch. It has the worked advantage table, the divisor that lets a silent group shrink the other groups' update, the TRL docs-vs-code Dr. GRPO trap, the p^G + (1 - p)^G table and a Tier-0 run.
- Clarity 6: several terms are used before they are built or never built: entropy bonus, dense, Routing Replay, multi-turn RL, importance_sampling, cispo, grpo_passk, DGX Spark. The page leans on sections 6 and 7 for KL, the ratio and the clip.
- Sentences 7: most are specific. There is much bookkeeping ("our arithmetic", "in our reading of the code"), and several sentences only point at other blocks or sections.
- Parity 7: it matches the best files on depth. It falls below them on its opening, its title and its middle structure.

Findings (most damaging first)
1. Title: "RLVR & GRPO". This is two unexpanded acronyms with no claim. A level 100 to 200 reader cannot decode either, which puts it in the same family as "One Robot, One Loop". Fix: a claim title, for example "GRPO learns only from groups that disagree".
2. First sentence: "RLVR (RL with verifiable rewards, where RL is reinforcement learning) uses a program as the reward: a rule that compares a boxed final answer with the reference, or a compiler that runs the code against predefined test cases". The section opens on a definition with a nested acronym expansion. "Boxed" is unexplained until line 19. The thesis sentence, "The challenge is to spend each step on prompts that can teach the model something.", waits for paragraph 2. Opening on the silent-group fact and the 9-of-20 zero-loss steps would put the argument on the first screen.
3. Header promise vs content: "Read the knobs on a managed GRPO job: which knob fixes which bias, and why always-solved prompts waste the step". Three problems:
   - The managed-job block is the thinnest on the page.
   - The successor table never uses the word "bias".
   - The only measured evidence is never-solved groups, at a 4% base rate, not always-solved ones.
4. Self-contradicting definition: ""Bias" in this table means a systematic tilt in the objective, a different sense from the statistical bias of section 6." The table has no cell that uses "bias" in that sense. The one row that uses the word uses the statistical sense the note excludes: "REINFORCE++'s authors argue that per-prompt normalisation is a biased estimator with a tendency to overfit."
5. Reference-manual middle. Three tables run back to back (successors, TRL/verl mapping, SageMaker settings), with every row at equal weight.
   - Dynamic sampling, the row that carries the section's own thesis, sits fourth of six beside REINFORCE++.
   - Methods are introduced inside table cells (GSPO, REINFORCE++, RLOO).
   - "GRPO needed a training strategy called Routing Replay to converge and GSPO did not" never says what Routing Replay is.
   - A glossary paragraph precedes the table: "Two terms from section 7 recur. The probability ratio is ... and the clip is ... Entropy measures how spread out the next-token distribution is."
6. Terms used before they are built:
   - "TRL's defaults switch off the KL (Kullback-Leibler divergence) penalty of section 7 and the entropy bonus". Entropy is first defined one block later, and KL is expanded but not explained.
   - "a 7B dense and a 16B MoE (mixture of experts) base". MoE gets a name but no explanation, and "dense" is never explained.
   - "multi-turn RL" names a SageMaker product and is never explained.
   - The choices "importance_sampling, ppo, cispo" and "grpo_passk" are listed with no gloss.
7. Advice the reader cannot act on: "AWS suggests importance_sampling for a team new to multi-turn RL, and calls PPO with clip thresholds of 0.8 and 1.2 the safe baseline for any first run". These are two different first-run recommendations, left unreconciled, and the first names a loss the page never explains.
8. Bookkeeping in the prose (owner's fault 5):
   - "(our arithmetic)" on 128 x 8 = 1,024 and on 1 + 0.28 = 1.28, arithmetic too trivial to need provenance.
   - "in our reading of the code", twice.
   - "(REINFORCE++, in our reading of the identifier)".
   - "The page gives the identifiers; the right-hand column is our mapping onto the terms above."
   - "(our arithmetic on the E0 figures)".
   - "The paper's first arXiv version reported 71.0%; the second arXiv version and the Nature paper report 77.9%". This is a paper's version history in the body, and it belongs in the citation.
9. Prose about itself, and pointer paragraphs:
   - "a variant the next blocks return to"
   - "are the first terms the successors in the next block change"
   - "The table maps each term onto its setting in both frameworks."
   - "Read prompt A first."
   - A one-sentence paragraph that is only a pointer and withholds the number: "On the 32B base where RL worked, distillation from DeepSeek-R1 did better still; section 11, Distillation or RL, gives the comparison and when each wins."
   - The page ends on a pointer, "Section 25, Choosing a Technique: ... turns the same measurement into its second decision question", after its strong next action has already landed.
10. Bedrock gap. The sub-heading promises "Find the group size, the advantage method and the clip range in a Bedrock or SageMaker AI job". The Bedrock paragraph lists fields ("next to batch size, epochs, learning rate, length limits and reasoning effort") and never says whether the advantage method or the clip can be set there.
11. Orphan trivia at equal weight: "Eight is the default group size in TRL's GRPO trainer ... and in SageMaker AI multi-turn RL". This one-sentence paragraph follows the page's most consequential point (a silent group shrinks the other groups' update) and is repeated in two later tables.
12. Sentence construction: "a group whose answers all score the same gives every answer an advantage, its score relative to the group, of 0". The appositive splits "advantage ... of 0". "On our DGX Spark run" uses DGX Spark without saying what it is.

---

## doc-B: "13. Rendering and Ray Tracing: Why Simulated Cameras Pick the GPU"

Scores
- Argument 9: the claim is in the title. The first screen quotes the vendor rule ("GPUs without RT Cores (A100, H100) are not supported."), turns it into an EC2-family consequence, and by paragraph 3 works the 6.7x and 62x camera factors.
- Depth 9: it covers the BVH walk as the RT-core step and the ray-count product, and splits memory into fixed and per-environment parts with correct ceiling/floor reasoning. It also has the four-order memory ladder, the camera type that fails with out-of-memory, and a measurement recipe that uses GiB rather than GB.
- Clarity 8: rasterisation vs ray tracing and the GPU's units are built before they are used. Lapses: USD, the SO-101 and "the bench" are assumed, and the estimate-bias paragraph is dense.
- Sentences 8: consequential throughout ("a card with RTX in its name running a renderer that is not an RTX renderer"). There is some research-process language and one truncated cross-reference.
- Parity 9: the bar for the batch.

Findings (most damaging first)
1. Visible placeholder: "Capture slot, dated 2026-11-20" / "What will be shown here: The same SO-101 scene ray traced by Isaac Sim, captured on our own machines." This is a production note left on the page. It promises the rasterised vs ray-traced comparison that the surrounding argument sets up, and it does not deliver it.
2. Truncated cross-reference: "(section 29, Choosing)". The section title is cut off, so the reference tells the reader nothing.
3. A whole sub-section rests on a guessed unit: "it records a render time of 756 per world per frame. Taking that as nanoseconds, the unit its physics rows imply, one batch of images takes 8192 x 756 ns = 6.2 ms". It is then extrapolated 75x to "close to half a second for every step of the policy". This is honestly flagged, but the figure feeds no later decision, since the section sizes cards by memory. Confirm the unit or move the paragraph into an expandable section.
4. Terms that are not built:
   - "Pick the USD-Camera for a batch of thousands". USD is never expanded or explained.
   - "At the bench the SO-101 is asked to pick up a block" assumes section 3's arm and bench.
   - "a Kuka arm and an Allegro hand" are names with no gloss.
5. Bookkeeping and an overclaim:
   - "By our reading of the renderers' documentation, the renderers of Isaac Sim, Isaac Lab and MuJoCo fall into three groups by where the BVH walk runs." The paragraph opens on provenance and a taxonomy.
   - "A Warp renderer keeps P-family GPUs open, and one test run decides it." The first clause asserts what the next sentence concedes is untested: "No vendor sentence naming the A100, H100 or B200 as supported for a Warp renderer was located in this research". That second sentence is also research-process language.
6. A dense passage with no worked number: "Dividing the card by the average per environment charges the fixed part in proportion to the count. Where the card holds less than the run used, as with Cartpole's 57.3 GB, that charges too little of the fixed part and the estimate is a ceiling." The reasoning is correct, but a reader at level 200 cannot check it without one example that assumes a fixed part.
7. An unlabelled inference stated as fact: "contact physics already takes much of each step, so the camera adds less on top". The benchmark does not measure this.
8. Diagram padding: the GPU-units figure draws "Video encode engines (NVENC)" and "Video decode engines (NVDEC)" rows that the prose never uses.
9. A small confusion: "AWS's compatibility list predates G7" sits beside a list that includes G7e. The reader is not told that G7e shipped first.

---

## doc-C: "3. The Robot as a Computer: Inputs, Outputs and a Deadline"

Scores
- Argument 8: the strongest opening in the batch ("is twelve numbers and two video streams on a clock"; "Lateness on a robot is a distance"), with numbers in paragraph 1. The central latency budget, however, models every millimetre travelled as error without stating when that holds.
- Depth 8: level 400 in many places: P = 16, I = 0, D = 32 and the resulting steady offset, timestamps derived from the frame index, the busy-wait cost on macOS and Windows, use_degrees, 4095 vs 4096, encoder step vs backlash. The budget's modelling gap lowers it.
- Clarity 8: concepts are built in order (servo, encoder, DoF, observation, action, IK, PID), with intuition, then formula, then decomposition. LeRobot is never introduced, VLA is defined last, and "Figure" is ambiguous.
- Sentences 8: the best lines in the batch ("a latency figure for a robot is half a number until a speed stands beside it"; "The arm is a peripheral."). Several bookkeeping clauses remain.
- Parity 9: a joint bar-setter with doc-B.

Findings (most damaging first)
1. The budget conflates travel with error. The section says "Decide how far off the gripper may be, divide by its speed, and the result is the delay the whole chain from camera to servo may take." It concludes "at 0.25 m/s the gripper travels 35.9 mm on old information. Against the 40 ms budget that is more than three times over".
   - Motion during the delay becomes position error only to the extent the scene or the plan changes within it.
   - With the default absolute joint targets, which the page itself recommends, and a static block, travel along a correct trajectory costs nothing.
   - The page never states the case its budget models, so its headline penalty is a worst case presented as the general case.
   - Fix: one sentence saying the budget applies when the policy must react to something that moved during the delay.
2. Visible placeholder: "Capture slot, dated 2026-11-20" / "What will be shown here: Camera footage of the real leader and follower at the bench."
3. Bookkeeping in the prose (owner's fault 5, near-verbatim):
   - "The chain that has to fit in that budget is a sum of four waits (the split into four is ours)." This is the same move as "Counting them as five is our grouping".
   - "Each term has a cited size on this arm." The prose describes its own citations.
   - "the sources read on 2026-11-20 give a figure for none of them"
   - "rate not stated in the documents read"
   - "By their names and the mounts the hardware repository ships"
4. The Figure/Helix paragraph: "Figure's last published rates, for its Helix 02 humanoid model on 2026-01-27, have the same shape ... Its newer Helix 2.5, posted 2026-09-17, states none."
   - The company Figure is never introduced, and on a web page full of figures the name reads as one.
   - The second sentence is publication bookkeeping.
   - The paragraph repeats the shape the table has just shown. Cut it, or introduce Figure in one clause.
5. Terms built late or thinly:
   - GR00T N1.7 is used from paragraph 2, but "GR00T N1.7 is a vision-language-action model (VLA)" arrives in the last section.
   - LeRobot is never introduced in the prose ("so for a model that outputs joint targets, LeRobot's default").
   - "the real-time chunking paper" is cited before RTC is explained.
   - RTC's own definition, "the technique for a model too slow for the tick, computes the following chunk in a background thread", does not separate it from plain asynchronous inference.
6. Numbers from two models mixed: "A 50-action chunk at 30 Hz lasts 1,667 ms, and a 149 ms call, NVIDIA's Jetson Orin figure for GR00T N1.7, uses 4.5 ticks of it." The 50-action chunk is the SmolVLA/pi0.5 default, while the page's own GR00T benchmark is "returning 40 actions". Use 40 actions (1,333 ms) or a single model throughout.
7. A reference-manual block: "Servo limits, for reference: gripper caps and firmware cut-outs". It is followed by a list with no consequence: "The datasheet lists four triggers for it: 2 s blocked at more than 80% of stall torque, 2 s drawing more than 2 A, ...". The page never says what a policy that holds a squeeze for 2 s will see.
8. Prose about itself (mild):
   - "is the 1,440 bytes per second of the opening"
   - "so the middle line, a tenth of a second at this pace"
   - "The line has a ceiling."
9. A near-empty sentence in the formula decomposition: "The sum adds the waits into one delay."
10. Terminology clash: "Robotics calls the first a planner and the second a controller". The table's top rung is then labelled "Planner" with a different meaning (choosing the task).

---

## doc-D: "10. Processing and Curating: When the Cores That Decode the Video Starve the GPU"

Scores
- Argument 8: the claim is in the title and the opening is an argument ("a faster GPU only waits longer"). Two contrasting runs are worked by paragraph 3. However, no run on the page shows decode as the bottleneck.
- Depth 9:
   - It has the W >= B / (r x u) formula, built from intuition first.
   - It explains why decode cannot move to the GPU (CUDA initialisation inside workers).
   - It covers GOP decode cost, and physical cores vs vCPUs by instance.
   - It explains what nvidia-smi utilisation does and does not prove, and the curation budgets on a G6e.
- Clarity 8: dataloader, vCPU, NVDEC, GOP and SMT are each built at first use. Cosmos Curator appears before it is introduced, and "bind" is jargon.
- Sentences 7: mostly concrete. More provenance bookkeeping than B or C, and one tangled opener.
- Parity 8: same construction and depth as the best files. Its faults are polish, not class.

Findings (most damaging first)
1. The title claim is not proved on the page. The title says "When the Cores That Decode the Video Starve the GPU", but the two measured starvation cases are other causes:
   - Augmentation: "trained 2.8x faster on an H100 once its image augmentation ... moved from the CPU workers to the GPU".
   - Fetching: "The slow link was fetching the clips."

   The page's own decode numbers show the defaults keeping up: "the default 4 workers keep up with any update of about 11 ms or longer". The hardware guide's runs agree: "in all three the GPUs set the pace". State the thesis as the condition under which decode binds (long GOP, heavy history windows, few physical cores per GPU, as on p4d) instead of implying it is the usual case.
2. The diagnostic leaves out a third pace-setter: "If steps per second rise when you add workers, the workers were setting the pace; if they stay flat, the GPU was." Flat can also mean storage or fetch, which the page itself shows binding in curation.
3. Bookkeeping in the prose:
   - "For sizing the GPUs, the nearest published end-to-end rate we located is NVIDIA's, from March 2025, for a predecessor it called NeMo Video Curator, version unnamed, on its DGX Cloud service, for 720p video". Most of the sentence is provenance.
   - "(the EC2 family named beside each card here is our pairing of that matrix with the EC2 tables)"
   - "by our reading of its options"
   - "(v2.10.0, released 2026-11-10)"
   - "still open on 2026-11-20"
   - "That is one worker building one batch of heavier rows; the guide's 0.015 s is the loading time its own training loop recorded per step, on its own dataset, so the two figures measure different things." This is the writer reconciling two sources in the body.
4. A tangled, self-referential sentence: "Hugging Face reports a run that, by the arithmetic below, the cores paced." The relative clause is inverted and points ahead to arithmetic that comes two sentences later.
5. A term used before it is introduced: "Cosmos Curator removed its FFmpeg GPU decode mode because its benchmarks showed it performing the same as FFmpeg on the CPU". Cosmos Curator is introduced only in the next section.
6. A sub-section opens on a definition and repeats the opening: "NVDEC has an encoding partner, NVENC (NVIDIA Encoder). Both sit apart from the tensor cores, so a card can train at full load while its decoder sits unused." The heading's claim waits for the second paragraph.
7. A descriptive, off-thesis sentence: "For robot episodes the newer recipes deduplicate with no video model: a clip is embedded by its instruction text, its first frame and its wrist motion, and the three are fused and clustered." It has no consequence for cores, GPUs or cost.
8. Pointers and instructions:
   - "(section 24, Orchestrating Physical AI on AWS, places it there)"
   - "Read down the panels"
   - "When the workers bind" (jargon for "set the pace")

---

## Batch answer

Groups by quality alone:
- **Group 1: doc-B and doc-C.** Each opens on an argument that hands the reader a tool, and works a number in paragraph 1 or 3. Each builds every core term in reading order and ends on a measurable next action. Their faults are local: a visible "Capture slot ... What will be shown here" placeholder in both, a truncated cross-reference in B, scattered "ours" and "documents read" clauses, and one modelling gap in C's latency budget.
- **Group 2: doc-D.** It has the same construction and depth. It carries more provenance bookkeeping, and its title claims a mechanism (decode starvation) for which its own evidence shows no measured case. A careful reader would not separate it from Group 1 by quality.
- **Group 3: doc-A.** Its quantitative core matches anything here: the worked advantage table, its own run and the p^G + (1 - p)^G table. A careful reader would still tell it apart by quality, on these counts:
  - an acronym-pair title;
  - a definition-first opening;
  - three reference tables back to back in mid-section, with the thesis row at equal weight;
  - more terms used before they are built (entropy bonus, dense, Routing Replay, multi-turn RL, cispo, importance_sampling);
  - dense "our arithmetic / our reading" tagging, even on 128 x 8;
  - an ending on a pointer to another section.

  The gap is one step (7 against 8 to 9), not a difference in class.

Verdicts:
- **doc-B: sets the bar.** Claim title, an argument opening, and depth and clarity sustained to a practical close. It must lose the placeholder and fix "(section 29, Choosing)".
- **doc-C: sets the bar.** The best sentences and the best ramp-up in the batch. It needs the travel-vs-error condition stated, the placeholder removed, and the 50/40-action mismatch fixed.
- **doc-D: not distinguishable by quality from the best files.** Equal depth and construction. It is slightly heavier in bookkeeping, and its title overstates what its evidence shows.
- **doc-A: distinguishable: weaker.** Title, opening and mid-section structure fall into the owner's fault families 1, 4, 5 and 6, and it has the most terms left unbuilt, although its depth equals the best.


Key to the blind file names: doc-A feedback dive RLVR and GRPO; doc-B this dive section 13 (round 2); doc-C this dive section 3 (published pilot); doc-D this dive section 10 (round 2)
