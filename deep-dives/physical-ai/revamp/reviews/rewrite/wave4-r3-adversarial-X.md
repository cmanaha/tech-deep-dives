# Adversarial review, batch w4r3 / inX (blind)

| File | Argument | Depth | Clarity | Sentences | Parity | Verdict |
|---|---|---|---|---|---|---|
| doc-A | 8 | 9 | 7 | 8 | 9 | sets the bar |
| doc-B | 8 | 8 | 8 | 8 | 8 | not distinguishable by quality from the best files |
| doc-C | 7 | 8 | 6 | 7 | 7 | distinguishable: weaker |
| doc-D | 7 | 8 | 7 | 7 | 7 | distinguishable: weaker |

Quotes are verbatim from the rendered text, except that maths rendered letter by letter is written as plain symbols.

---

## doc-A: "21. Reading a Machine: Counters Tell a Core Limit From a Memory Limit"

**Scores**
- Argument 8: the first sentence is a claim the reader can use ("Whether a faster core or faster memory would speed a job up can be read before you pay for either"). A number is worked by paragraph 2, and the section includes a test that could fail. It loses a point because its own sample card does not do what the title says counters do.
- Depth 9: formulas taken apart with toy and real counts, a known-answer test, the width trap, a flush correction that reverses which loss looks larger, EC2 event availability, multiplexing, and nvidia-smi against DCGM. The GPU half is thinner.
- Clarity 7: every term gets built, but the opening paragraph carries seven new ideas, and the flush correction asks the reader to hold a share of cycles against a share of slots.
- Sentences 8: specific and consequential almost throughout. A few sentences are knotted.
- Parity 9: the best file in the batch on argument and depth.

**Findings**

1. **The title promises what the worked card does not show.** Title: "Counters Tell a Core Limit From a Memory Limit". Card section: "This card's own counters place the loss in the back end and go no further, because the run counted level 1 only." and "The call between the core and main memory comes from comparing two cores of the same chip." The headline says counters separate core from memory. In the one card the section reads, they could not: a comparison of two cores with a bandwidth benchmark made the call. A reader who takes the title at its word comes away with a claim the section's evidence does not back. Fix: keep the title and add one sentence to the opening: "At level 1 the counters stop at the back end; a level-2 count, or a second core on the same memory, separates core from memory, and the sample card needed the second."

2. **One leg of a two-leg conclusion is not a leg.** "The bound and the comparison both point at the core rather than at main memory, and a faster core is the purchase this card supports." Two paragraphs earlier the section establishes that back-end bound is neutral between core and memory, and that the 0.4% figure rules out only whole-cycle stalls. The bound points at the back end, not at the core. Fix: "The comparison points at the core; the level-1 counters are consistent with it and cannot decide it."

3. **The same comparison is argued three times.** Opening: "The same step ran twice as fast on that core as on the machine's smaller Cortex-A725, although main memory streams data to either core at about the same rate, so main memory does not explain the gap." Card section: "The X925 stepped the model twice as fast as the Spark's Cortex-A725, while main memory serves either core at about the same rate." The width section uses the same pair a third time. The conclusion is spent twice before its numbers (44.38 against 43.95 GB/s, 123.96 against 144.92 ns) arrive, so the card section reads as a re-run. Fix: put the two bandwidth figures in the opening sentence that makes the claim, and cut the restatement in the card section down to the latency figure and the 1.17 ratio.

4. **The opening loads seven ideas and names one of them twice.** "A core splits each instruction into micro-operations, smaller internal steps, and in every clock cycle it has a fixed number of chances to start one. Its counters record what became of every chance." ... "Those four percentages, and a second level that splits the back end's share in two, carry the decision." Then: "Each chance is a slot". The first paragraph introduces the PMU, the bottleneck, micro-operations, chances, front and back end, four buckets and an empty "second level". The reader then has to rename "chance" as "slot". Fix: use "slot" at first mention, and cut the second-level clause from paragraph 1, because paragraph 3 introduces it with its content.

5. **A sentence that parses wrong on first reading.** "That rules out the stalls it counts as a real part of the loss, and leaves open memory waits in cycles that still moved some slots, which the event does not count." On first pass "the stalls it counts as a real part" reads as one phrase. Fix: "Whole-cycle memory stalls are too few to matter. Memory waits in cycles that still moved some slots are not counted by this event, so they stay open."

6. **The GPU half answers the title's question with a pointer.** "the GPU's version of memory bound against core bound (the Silicon, Memory & Inference dive builds the roofline in full)" and "Here the compute side came closer to its limit than the memory side, so the next question is which compute path did the work." The CPU gets a full mechanism for core against memory. The GPU gets a cross-reference, and the one measured kernel is never placed under its roof, although its size makes that a one-line calculation. The section then ends on a TF32 setting: a sound action, but not the section's payoff. Fix: add one paragraph that computes the 4096 x 4096 multiply's operations per byte (2n^3 operations over at least 3 x n^2 x 4 bytes) and says which side of the ridge that puts it on. Otherwise, cut the GPU half to the nvidia-smi/DCGM contrast and the simt finding.

7. **A third of the gap is left open.** "The remaining factor, about 2.0 / 1.5 = 1.33, is what a per-cycle share leaves out: each core's clock, and the micro-operations each needs per step." Leaving it open is honest, but a level-400 reader leaves with an unexplained factor and a to-do. Fix: give each core's clock during the run if it is known. If it is not, say so in one clause so the reader knows the factor is unmeasured rather than unexplained.

8. **Prose pointing at itself.** "Back-end bound splits at the second level into the memory bound and core bound of the opening." Fix: "into memory bound and core bound."

9. **An unexpanded term carries a finding.** "carries simt, the general floating-point path". The verdict on the tensor cores rests on reading "simt" in a kernel name, and the reader is never told what the letters stand for. Fix: "simt (single instruction, multiple threads: the ordinary CUDA-core path)".

---

## doc-B: "3. The Robot as a Computer: Inputs, Outputs and a Deadline"

**Scores**
- Argument 8: the thesis arrives in paragraph 1 with a number ("Lateness on a robot is a distance: at an illustrative 0.25 m/s, 100 ms of delay is 25 mm"), and the budget arithmetic shows the chain running 3.6 times over its budget. It loses a point because the distance model is never qualified and the tolerance it is measured against keeps changing.
- Depth 8: the register-level interface, the PID gains and what I = 0 costs, the calibration formula, the timing report, chunk arithmetic, and a delay budget with a cited size for each term. The distance model itself stays first-order.
- Clarity 8: the best ramp in the batch, with each term built before it is used. It slips where GR00T is used four times before it is called a VLA, and where "planner" names two different rungs.
- Sentences 8: concrete and often quotable ("a latency figure for a robot is half a number until a speed stands beside it"). A few bookkeeping clauses.
- Parity 8: publishable beside doc-A. It trades some of doc-A's depth for a cleaner ramp.

**Findings**

1. **The central model treats all travel during the delay as a miss, and never says when that holds.** "Run the formula backwards and it gives a budget. Decide how far off the gripper may be, divide by its speed, and the result is the delay the whole chain from camera to servo may take." This equates distance travelled during the delay with positional error. With LeRobot's default absolute joint targets, which the section recommends, an action computed from a stale frame is still a target pose that the servos reach. Travel becomes miss distance only when the decision depended on where the arm or the scene was: a relative action applied to the current pose, a correction for a slipping block, a cup that moved, or the seam between two chunks. A level-400 reader needs to know which of these the budget covers. Fix: one paragraph after the three worked lines. It should say what v x tau measures (how far the world has moved since the frame the decision used) and when that becomes a miss, tied to the absolute and relative choice the section has already explained.

2. **The yardstick changes four times.** "100 ms of delay is 25 mm of travel on stale orders, most of the width of a cup's mouth." / "A cup's mouth is a few centimetres across, so the middle line, a tenth of a second at this pace, spends most of that margin." / "Say the block must arrive within 10 mm of the centre of the cup." / "hold the millimetres against the width of your cup." The tolerance is the clearance between block and rim, not the mouth. The thesis lands on a geometry the section never states, and the last sentence sends the reader back to the wrong measure. Fix: set one illustrative geometry at first use (for example a 70 mm mouth and a 50 mm block, 10 mm each side), use that 10 mm everywhere, and end on "against your clearance".

3. **Bookkeeping in the prose.** "The chain that has to fit in that budget is a sum of four waits (the split into four is ours)." This is exactly the "Counting them as five is our grouping" fault. Fix: delete the parenthesis. The formula shows the split.

4. **The model the whole budget rests on is explained last.** First use, paragraph 2: "NVIDIA reports a median of 76.8 ms for one call of its GR00T N1.7 robot model on a Jetson AGX Thor". Explained only in the final section: "GR00T N1.7 is a vision-language-action model (VLA), a policy built on a network that takes camera images and a text instruction". In between, the reader also meets "the SmolVLA and pi0.5 policies" with VLA undefined. Fix: move the one-clause definition to the first mention.

5. **A paragraph that does neither job.** "Figure's last published rates, for its Helix 02 humanoid model on 2026-01-27, have the same shape: ... Its newer Helix 2.5, posted 2026-09-17, states none." "Figure" the company reads at first as a figure on the page. The post dates are bookkeeping, the shape has already been shown with GR00T 2, and the last sentence reports an absence that changes nothing for the reader. Fix: cut it, or reduce it to one clause in the table's lead-in: "Figure AI's Helix 02 humanoid model publishes the same shape: 1 kHz joints under 200 Hz body targets."

6. **"Planner" names two rungs.** "Robotics calls the first a planner and the second a controller, and larger robots stack more of them." Here the policy is the planner. One line later the table has a separate "Planner" row, "Optional language model that picks the next instruction", above the policy. The word changes meaning without notice. Fix: in the table, rename that row "Task choice", or say at the switch that the top row plans tasks while the policy plans motion.

7. **The title lists topics; the thesis sits in an h2.** "The Robot as a Computer: Inputs, Outputs and a Deadline". "Delay is distance", the section's best idea, is not in the title. Fix: "The Robot as a Computer: A Deadline Measured in Millimetres".

8. **Two models' numbers are mixed in one example.** "A 50-action chunk at 30 Hz lasts 1,667 ms, and a 149 ms call, NVIDIA's Jetson Orin figure for GR00T N1.7, uses 4.5 ticks of it." The section later says GR00T's call returns "40 actions" (1.33 s at 30 Hz), so this pairs a SmolVLA chunk length with a GR00T latency. Fix: use 40 actions and 1,333 ms with the GR00T figure.

9. **A term used before it is defined.** "A local network added 10 to 20 ms in the setup of the real-time chunking paper." RTC is defined two sections later. Fix: add the clause "real-time chunking, which computes the next chunk while the current one plays" here.

10. **A reference panel without consequences.** "Servo limits, for reference: gripper caps and firmware cut-outs" lists "2 s blocked at more than 80% of stall torque, 2 s drawing more than 2 A, a supply outside 4 V to 7.4 V, and a temperature over 70 degrees C" and never says what the arm does when one trips, or which policy behaviour trips it (a gripper pressed into the table, for example). Fix: add one sentence on the consequence, or cut the panel.

11. **A discrepancy reported without its size.** "The code divides by 4095, the encoder resolution minus one, where the datasheet gives the step as 360 / 4096." The reader cannot tell whether this matters. It is a 0.02% scale difference, 0.02 degrees at 90 degrees. Fix: give that size and say it is negligible, or cut the sentence.

12. **Prose about itself.** "is the 1,440 bytes per second of the opening." and "Each term has a cited size on this arm." Fix: "is 1,440 bytes per second"; delete the second sentence, because the citations already show it.

13. **Provenance inside the sentence.** "By their names and the mounts the hardware repository ships, one rides on the arm and sees what is between the fingers, and the other is fixed over the scene." Fix: state the fact and let the citation carry the source.

14. **Caption seam.** "...cleaner than a person or a trained model would make it.Capture: MuJoCo 4.0.1" has no separator between the caption and its capture line, and "The clip runs 8.2 s" adds nothing. Fix: add a line break and cut the duration.

The "Capture slot, dated 2026-11-20" block is fine in wording and placement: it sits directly under the simulated clip it will complement and names what will appear there. No finding.

---

## doc-C: "20. Fifteen Workloads, Five Shapes: Count the Bottleneck Before You Benchmark"

**Scores**
- Argument 7: it opens on a method and works a number by paragraph 3 (9.8 against 11.71 GB/s, 84%). It then turns to taxonomy (three properties, five shapes, letters A to E) and leaves its strongest finding, "Six of the fifteen are settled before tensor throughput matters", about twenty paragraphs down.
- Depth 8: GiB gates, codec lists, gradient-exchange arithmetic, cores per GPU, the transform trap, Spot rules and Advisor buckets. Some rows carry no figure a reader can size by.
- Clarity 6: most terms are well built. But "back end" changes meaning, the grid needs an 11-column key and five tag words, and the shapes have to be held as letters.
- Sentences 7: mostly consequential ("Having the engine does not mean using it", "The match is a coincidence"). Some paragraphs are lists, and some clauses point at the section itself.
- Parity 7: as deep as doc-A and doc-B, but a careful reader sees the scaffolding before the argument.

**Findings**

1. **The title leads with the writer's counts.** "Fifteen Workloads, Five Shapes: Count the Bottleneck Before You Benchmark". "Fifteen" and "five" are the writer's own groupings and mean nothing until the reader has met them. This is the "Fifteen is our reading" family. Fix: put the finding in the title, for example "Count the Bottleneck Before You Rent: Many Robot Jobs Fill CPU Cores or GPU Memory Before Tensor Cores".

2. **The thesis is buried and phrased as a count.** "Six of the fifteen are settled before tensor throughput matters. ... Size those rows by their cores, their memory or their video engine: the largest tensor-core instance buys the wrong part for them." This is the section's most consequential claim: it tells the reader not to buy the biggest GPU. It appears only after the parts table, the spec-sheet gates, the CPU-core argument and a supply table. Fix: state it in the opening paragraph as the claim the method proves, and let the grid confirm it.

3. **Taxonomy before consequence, twice.** Opening: "What a stop loses (interruptibility) is one of three properties of a job, with how long one unit runs (duration) and whether its pieces exchange data while they run (coupling); section 1 calls the three the job's shape." Spot section: "Three properties sort the fifteen into five shapes, and each shape gets one answer on Spot. Duration sorts first: fan-out, short units in a job that ends (A); long runs (B and C); always-on work, items that never stop arriving (D); and work on the robot's clock, where a deadline per unit takes the place of a duration (E)." The reader is asked to hold three property names and five letters before learning what any of them decides. The rules that do the work come after: checkpoint every 30 minutes or less, Batch runs no coupled job on Spot, a deadline rules out interruption. Fix: open the Spot section on those three rules and let the shape table collect the letters. In the opening, keep only the two rules already stated and drop the property definitions.

4. **"Back end" means two things.** Parts table: "CPU back end ... Work queues inside the core with little waiting on memory: the arithmetic units are busy, or each operation waits for the result of the one before." Physics row: "the X925 lost 36.5% to the back end and 12.2% to the front end". In the table, back end excludes memory, which gets its own two rows. In the physics row, back end is the top-down bucket, which includes memory waits. The word switches meaning without notice. Fix: rename the table row "CPU execution units (core bound)", or say at the physics row that the 36.5% includes memory waits.

5. **The grid says "first" where the text says "maybe".** The CPU physics row reads "first: branches in collision, on the Jetson | first: arithmetic, one world per core, on the Spark". The caption defines "first" as "where a measurement or a printed figure shows it". The measurement is a level-1 split that cannot name branches or arithmetic, and the expandable concedes "the Jetson's front-end lead of 31.0 - 21.5 = 9.5 points holds only if the A78AE's excess is under 9.5 points." Fix: tag both cells "likely first" and drop the causes, or move the causes into the evidence row with their caveat.

6. **The weaker evidence is used when the stronger is on the page.** "The 3.9 sits next to the bandwidth factor of 3.8, yet only 0.4% of the test's X925 cycles stall on memory. The match is a coincidence". A count of whole-cycle memory stalls cannot see memory waits in cycles that still did some work, so 0.4% does not settle the point. The section already holds a decisive fact: an X925 core and an A725 core stream at the same rate (44.38 and 43.95 GB/s) yet step the model 2.0 times apart. Fix: make the coincidence argument on that fact, and give the 0.4% as supporting evidence with what the event counts.

7. **A list in the second paragraph that the table repeats.** "A machine is a set of parts that run out separately: a CPU core, main memory, the GPU's matrix units, general units, ray-tracing cores, video engines and its own memory, storage and the network." Nine items at equal weight before any consequence, with an ambiguous "its own memory". Fix: "A machine is a set of parts that run out separately", and let the parts table list them.

8. **A legend the reader has to learn.** "The other tags name what else the job loads: at the same time (also), next (then), instead (or), as a fit it must pass (gate), or in one share of the job (mix)." Five tag words for an 11-column grid in which most cells are empty. The secondary tags are bookkeeping, and they are repeated in the evidence rows. Fix: keep "first" and "likely first" in the grid and leave the secondary loads to the evidence rows.

9. **Rows at equal weight, one with nothing to size by.** "Tensor cores, lightly: the authors of LeWorldModel, a model of about 15M parameters, state that it trains on \"a single GPU in a few hours\" without naming the GPU." This sits beside the GiB gate and the transform arithmetic but gives the reader no figure. Fix: one clause ("no sizing figure is published; any current GPU card") or drop the row's evidence.

10. **An example that seems to contradict the rule beside it.** "In an AWS sample, one run on a pretrained policy took 31.6 hours of training on one p5en.48xlarge Spot instance with eight H200 GPUs." A few paragraphs after the advice to checkpoint every 30 minutes, the reader meets a 31.6-hour Spot run and is not told whether it checkpointed or was reclaimed. Fix: say whether it checkpointed, and at what interval.

11. **Prose about the page.** "section 1 calls the three the job's shape". Fix: "Together the three are the job's shape."

12. **What EFA buys is left unsaid.** "a run split across nodes also wants a size with EFA, whose traffic between instances bypasses the operating system." This says what EFA does, not why a gradient exchange needs it. Fix: one clause on what bypassing the kernel buys each exchange: lower latency per message and less CPU per byte.

---

## doc-D: "9. RLVR & GRPO"

**Scores**
- Argument 7: from paragraph 2 onward every block makes a claim and proves it, ending on the silent-group share measured on a live trainer and predicted by p^G + (1 - p)^G. But the section opens on a definition, and its first subsection surveys base models without drawing the conclusion.
- Depth 8: line-level defaults in two frameworks, the two-setting Dr. GRPO pitfall, a silent group shrinking the other groups' update, the verl n = 1 trap, and a closed-form silent share checked against a run. The GRPO objective itself is never shown.
- Clarity 7: the terms are built (advantage, critic, ratio, clip, entropy, and "bias" in its second sense, flagged at the switch). But the divisors are discussed without the formula they divide, and several named options arrive unexplained.
- Sentences 7: many sharp sentences ("Check how your trainer averages the loss before you read a growing length as longer reasoning"), alongside clauses that point at the page, bookkeeping, and a fragment.
- Parity 7: its middle is as good as anything in the batch. Its frame (title, opening, first subsection) and its bookkeeping are not.

**Findings**

1. **The title is two bare acronyms.** "9. RLVR & GRPO". It is a topic, not a claim, and a newcomer cannot tell what either acronym means. It fails the owner's "What does that mean?" test more plainly than any other heading in the batch. Fix: put the section's claim in it, for example "GRPO Learns Only Where a Group Disagrees: Checker Rewards and the Knobs That Fix Their Tilts".

2. **It opens on a definition, with a clumsy nested expansion.** "RLVR (RL with verifiable rewards, where RL is reinforcement learning) uses a program as the reward". The definition and a historical score come first, and the challenge waits until paragraph 2 ("The challenge is to spend each step on prompts that can teach the model something."). Fix: open with that challenge and the measured 9 of 20 silent steps, and define RLVR in a clause after it ("reinforcement learning with verifiable rewards, where a program is the reward").

3. **The divisors are argued over with no formula to point at.** "The objective then averages the per-token loss over each answer's tokens, dividing by the answer's length, and over the G answers." The per-token loss is never written. The next two blocks, the Dr. GRPO row, the DAPO token-level row and the whole settings table all turn on "the length divisor" and "token averaging", and the reader holds them only in words. Fix: write the objective once, with the 1/G, the 1/|o_i| and the clipped ratio times A, mark the two divisors, then name them.

4. **A survey with its conclusion left out.** "A 7B math base did respond to RL, in DeepSeek's own later run on Qwen2-Math-7B ... and in other work." and "That base family is a special case: GRPO with randomly assigned rewards raised Qwen2.5-Math-7B's score on MATH-500 (500 competition-math problems) by 21.4 points, and spurious rewards that help Qwen models often fail on Llama 3 and OLMo 2". The subsection lists results base by base and then hands off to section 10. The consequence for the reader is never stated: a gain on Qwen2.5-Math does not show the reward worked, so test on a second base family. "and in other work" is vague, and the one-sentence pointer paragraph ("On the 32B base where RL worked, distillation from DeepSeek-R1 did better still; section 11 ...") is a signpost. Fix: end the subsection on that consequence, replace "and in other work" with a citation or cut it, and fold the distillation pointer into the previous paragraph.

5. **Prose that talks about itself.** "a variant the next blocks return to"; "are the first terms the successors in the next block change"; "The table maps each term onto its setting in both frameworks."; "SageMaker AI multi-turn RL exposes more of this section's terms as named settings". Fix: cut each one. The headings and the table already do the routing.

6. **Bookkeeping in the prose and in table cells.** "The paper's first arXiv version reported 71.0%; the second arXiv version and the Nature paper report 77.9%"; "The page gives the identifiers; the right-hand column is our mapping onto the terms above."; "reinforce_pp (REINFORCE++, in our reading of the identifier)"; "(our arithmetic on the E0 figures)", plus "(our arithmetic)" in two cells. The version history is page history. The rest is provenance that belongs in the citation, or in one plain clause once. Fix: move the arXiv history into the citation; head the column "Term (our mapping)" and drop the per-cell notes.

7. **Managed-job advice the reader cannot act on.** "AWS suggests importance_sampling for a team new to multi-turn RL, and calls PPO with clip thresholds of 0.8 and 1.2 the safe baseline for any first run". The two recommendations point different ways for a first run. importance_sampling and cispo are listed as loss choices and never explained, and grpo_passk is not explained either. Fix: one clause on what the importance_sampling loss does differently from PPO's clipped form, and one sentence saying which recommendation applies when.

8. **A bare identifier.** "On the E0 figures, a 4% base rate left 9 and 10 of 20 steps with no gradient at all" and the table row "4.4% (E0)". "E0" is defined only inside a citation marker. Fix: "on our DGX Spark run".

9. **Two runs with one seed give different counts, unexplained.** "seed 0, two runs" followed by "9 of 20 steps in the first run and 10 of 20 in the second". A careful reader expects identical runs. Fix: say what made them differ (non-deterministic generation, for example), or give the second seed.

10. **A named fix the reader cannot weigh.** "In Qwen's MoE runs, GRPO needed a training strategy called Routing Replay to converge and GSPO did not." The reader does not learn what Routing Replay does, so cannot judge what GSPO saves. Fix: add the clause "Routing Replay, which reuses the experts each token was routed to at sampling time when computing the update's ratio".

11. **A fragment standing in for a hedge.** "One base model and one benchmark." Fix: "The ablation covers one base model and one benchmark, so the size of each gain may not carry to others."

12. **Caption advice that does not follow from its own reason.** "For sparse rewards, SageMaker AI's guidance is a moderate group size with a larger batch or more steps, or a lower learning rate, because each step's useful gradient is diluted". "Moderate" is not quantified, a lower learning rate does not follow from a diluted gradient, and the advice sits under a table that shows larger groups help most at 10% to 90%. Fix: reconcile it with the table, or move it into the prose and give AWS's stated reason.

13. **An orphan fact.** "Eight is the default group size in TRL's GRPO trainer ... and in SageMaker AI multi-turn RL ..." This is a one-sentence paragraph with no consequence. Fix: fold it into the silent-share table's lead-in ("at the default G = 8 in TRL and SageMaker AI").

14. **The section ends on a signpost.** "Section 25, Choosing a Technique: Fine-Tuning, a Text Loop or a Hybrid, turns the same measurement into its second decision question: what the model scores on your signal today." The reader's action ("Drop or replace those prompts, or filter them during training.") is the last thing that should land. Fix: move the pointer before the action, or into the citation.

15. **The header description promises a different section.** "Read the knobs on a managed GRPO job". Most of the knobs covered are TRL and verl settings, and the managed services get one short subsection. Fix: "Read the knobs on a GRPO job, in TRL, verl or a managed service".

---

## Batch answer

**Groups by quality**

- **Group 1: doc-A and doc-B.** Both open on a claim the reader can use: "Whether a faster core or faster memory would speed a job up can be read before you pay for either"; "Lateness on a robot is a distance". Both work a number within the first two paragraphs. Their headings are mostly claims, nearly every paragraph ends on a consequence or an action, and they hardly ever talk about themselves. doc-A has the deeper mechanism (a known-answer test, a correction that reverses which loss looks larger). doc-B has the cleaner ramp for the level 100 to 200 reader. Both have real faults (doc-A's title outruns its card; doc-B's distance model is unqualified and its tolerance keeps changing), but these are faults of argument, not of craft.
- **Group 2: doc-C and doc-D.** Sentence for sentence and in depth they are close to group 1. doc-C's GiB gate and transform arithmetic, and doc-D's two-setting Dr. GRPO pitfall and silent-share formula, are as good as anything in the batch. What separates them is the frame:
  - titles that name a count ("Fifteen Workloads, Five Shapes") or two acronyms ("RLVR & GRPO") instead of a claim;
  - a thesis that surfaces late (doc-C's "six of the fifteen") or opens on a definition (doc-D);
  - scaffolding the reader has to learn (doc-C's shapes A to E, five tag words and an 11-column grid; doc-D's "the next blocks", "our mapping", "E0" and an arXiv version history);
  - more facts given equal weight (doc-C's evidence rows, doc-D's base-model survey).

**Can a careful reader tell them apart by quality alone?** Yes, narrowly. The difference shows in the frame (title, first screen, organisation, bookkeeping), not in the middle of a paragraph. It does not follow topic: doc-A and doc-C draw on the same measurements and machines and still fall into different groups. Within group 2, neither file is clearly weaker than the other.

**Verdicts**
- doc-A: sets the bar. It argues from the first sentence and reaches the deepest mechanism in the batch. Its faults are an overreaching title and one overreaching conclusion.
- doc-B: not distinguishable by quality from the best files. Its thesis lands early, its ramp is the cleanest in the batch, and its faults are fixable in place: the distance model needs qualifying, the tolerance needs to be one number, and one bookkeeping clause should go.
- doc-C: distinguishable: weaker. Its title leads with taxonomy, its thesis is buried, a 15 x 11 grid with a five-word legend carries the organisation, and one term ("back end") carries two meanings.
- doc-D: distinguishable: weaker. Its title is two acronyms, it opens on a definition, its first subsection is a survey with no conclusion, and it has a cluster of self-reference and bookkeeping clauses. Its core blocks are at group 1's level.


## Key (appended by the orchestrator after the review)

doc-A this dive section 21 (r3); doc-B this dive section 3 (published pilot, bar); doc-C this dive section 20 (r3); doc-D rl dive RLVR and GRPO
