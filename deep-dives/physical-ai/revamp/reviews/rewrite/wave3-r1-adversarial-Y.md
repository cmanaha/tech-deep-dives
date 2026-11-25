# Adversarial review, batch w3r1, input set Y

| File | Argument | Depth | Clarity | Sentences | Parity | Verdict |
|---|---|---|---|---|---|---|
| doc-A (26. Fine-Tuning & Learning Loops on AWS) | 5 | 6 | 5 | 4 | 4 | distinguishable: weaker |
| doc-B (18. The Fleet: A 6 GB Policy, a 2 GB Package and No Reverse Gear) | 9 | 9 | 7 | 8 | 9 | sets the bar |
| doc-C (3. The Robot as a Computer: Inputs, Outputs and a Deadline) | 8 | 8 | 8 | 8 | 8 | not distinguishable by quality from the best files |

---

## doc-A.txt: "26. Fine-Tuning & Learning Loops on AWS"

Scores:

- argument 5: there is a thesis ("one grader, two update targets; write the grader first"), but the writer hedges it into an unverified "reading" in paragraph 2, and the body between is a service catalogue that never argues which service to pick.
- depth 6: real source-level material (recipe line numbers, GAE overridden to GRPO, 149 recipe files, 12-minute Neuron compiles, `sample()/forward_backward()/optim_step()`), but not one cost is worked, and the configuration choice the section exists for (Bedrock or SageMaker AI, for SFT and for RFT) is never decided.
- clarity 5: 22 cross-references to other sections carry the concepts; the section leans on SFT, DPO, GRPO, advantage, value model, rollout, LoRA and on-policy as already known, and uses at least one term before it names it.
- sentences 4: 19 instances of "our reading", plus "the pages read", "the documentation searched"; the prose keeps reporting its own research process instead of stating consequences.
- parity 4: set beside doc-B and doc-C it reads as a draft of a different standard: no worked number, a hedged thesis, and the page narrating its own sources.

Findings, most damaging first:

1. **The thesis is withdrawn the moment it is stated.** "Our reading of the two services: one grader, two update targets. The grader you write first can drive a weight update or a prompt rewrite. The pages read do not say one Lambda runs unchanged in both, so check each service's input and output format before reusing one." The section's organising claim, repeated in the figure, in the last heading and in the closing paragraph, is admitted in its first appearance to be unsupported by the sources. Either check the two input/output contracts and say whether one Lambda serves both (that would be a level-400 fact), or drop "one grader" as the spine and argue something the sources carry.

2. **No number is ever worked.** The section quotes $80.00 per training hour three times, $1.49 per million tokens and $1.95 a month, and never turns any of them into a job's cost. "Section 23, Cost per Improvement, turns the hourly rate into a breakeven against a text loop" and "Section 23, Cost per Improvement, sets distillation's bill beside RL's GPU-hours" push the arithmetic to another page. A reader leaves unable to say whether a Bedrock RFT run costs $400 or $40,000. One worked example (records x responses per prompt x tokens, or a stated typical wall-clock) would fix it; so would one SFT line (for example 10,000 pairs x 1,000 tokens x 2 epochs = 20M tokens x $1.49 = $29.80, labelled as an illustration).

3. **The decision the section promises is never made.** The header promises "Find the AWS service for each path", but for SFT the answer is "Section 25's SFT path runs here as well as on Bedrock" and for RFT the closing table lists "Bedrock RFT; SageMaker AI RFT and multi-turn RL; HyperPod recipes" with no criterion. SageMaker AI RFT gets no price, no model list beyond "as small as Qwen3 0.6B", and no reason to prefer it over Bedrock's three models at $80/hour. The level-400 content here is the fork: which models, what price model, what control you gain or lose at each level. It is missing.

4. **Bookkeeping crowds the prose (fault 5).** "our reading" appears 19 times, e.g. "Two of section 25's paths have no dedicated service, on our reading of the services covered here."; "reading them as REINFORCE++ and a variant of GRPO aimed at pass@k ... is our reading"; "which this dive would write pass@4 (our reading)"; "On the pages read, none of the words-side services is described as changing model weights". Also "On Trainium, GRPO and PPO were not found in the Neuron v2.33.0 documentation searched" narrates the search instead of stating the fact ("Neuron v2.33.0 documents no GRPO or PPO trainer"). Provenance belongs in the citation; the writer's own derivation needs one plain clause, once.

5. **Opening is a definition and a tour (fault 1).** First sentence: "AWS runs both kinds of learning loop this dive compares." It talks about the dive, then lists: "They sit in four product families, Amazon Bedrock, Amazon SageMaker AI, Amazon Bedrock AgentCore and the Neuron SDK for Trainium, at three levels of control". Second paragraph: "The challenge is to find the service for the path you chose in section 25, Choosing a Technique: Fine-Tuning, a Text Loop or a Hybrid, and to know what you own once you get there." No tool and no number is handed over in the first three paragraphs.

6. **The header description is an overloaded list with bookkeeping inside it.** "Find the AWS service for each path from section 25 and what you bring to it: Bedrock and SageMaker AI run SFT and distillation from a teacher's answers, one grader can drive a weight update or a prompt rewrite, and Bedrock's managed RL costs $80.00 per training hour (AWS pages read 2026-10-30 and 2026-11-07; HyperPod recipes 2.0.11, Neuron v2.33.0 and TRL v1.16.0)". Three claims plus a parenthetical of access dates and versions; that last part is citation metadata, not a payoff.

7. **Self-referential navigation (fault 4).** 22 references to other sections, many as load-bearing explanation: "Supervised fine-tuning is section 4's SFT run as a managed job"; "On-policy distillation, section 11's method"; "the kind of signal section 13, The Reward Is a Proxy, and section 15, Verbal Reinforcement & Self-Correction, identify as weak"; "Any loop from sections 16 to 18"; "the asynchronous design of section 22, An RL Step Is an Inference Job Inside a Training Job". Plus "The amber boxes mark what you bring." The section cannot be read on its own; each reference should be replaced by the half-sentence of the idea it points to.

8. **Sub-heading descriptions in the "See ..." register the owner rejected.** "See which services change weights and which change words, and the one component you own at each level" mirrors the rejected "See the whole loop on one arm before any part is explained". "Run any loop from sections 16 to 18 on Bedrock models, and assemble the two paths that have no dedicated service among those covered here" is self-referential and hedged. The heading above it, "Words, self-run, and two paths with no dedicated service", is a filing label.

9. **Reference-manual weighting (fault 6).** The distillation block gives equal weight to "distillation is not currently available for Anthropic models", "The pairs are text to text only", "a job takes at most 15K prompts ... with at least 100 pairs recommended" and the bill. The AgentCore block spends a sentence on "Recommendations, batch evaluations and A/B tests have been generally available since 2026-06-17". The multi-turn RL panel lists `advantage_method` has "nine values" and `loss_fn` has "three values and ppo as the default" (only one of the three is named) without saying when to change either. Facts are reported; none is ranked.

10. **Facts with the consequence left off.** "It inherits verl's PPO trainer configuration, which sets the estimator to GAE ... and overrides it under the comment 'switch from GAE (upstream default) to GRPO'". Why it matters is not said: GAE needs a critic model, so a recipe without the override would train and hold a second network. Likewise "samples 8 responses per prompt" is not turned into "eight generations per prompt, so rollout inference dominates the step". And "repeats inference, grading and rewriting until proprietary internal parameters end the loop" is not followed by its consequence: you cannot cap iterations, so you cannot cap the inference bill in advance.

11. **Term used before it is named.** "The two open-weight models have no console judge" comes one paragraph before the reader learns which models they are ("OpenAI gpt-oss-20B and Qwen3 32B in us-west-2"). Swap the paragraphs.

12. **Likely misreading of the tau2-bench metric, and the fix is bookkeeping.** "the agent succeeded at least once in four attempts, the blog's Pass^1" and "the stricter Pass^3, at least three successes in four". In the tau-bench family, pass^k is conventionally the chance that all k trials succeed, and pass^1 is the mean success rate [SPECULATIVE: reviewer's knowledge, not checked against the AWS blog]. If the blog really defined Pass^1 as "any of four", say so in one clause; the current text redefines it, renames it pass@4 "(our reading)", and gives "at least three successes in four" for Pass^3, which matches neither convention. Precision is also mixed: "43.0% against 41% for reflections and 24%".

13. **The figure caption is bookkeeping, not a reading aid.** "Schematic. The price, versions and model names are cited in the blocks below. 'One grader, two update targets' is our reading of the Bedrock RFT and Advanced Prompt Optimization pages." It tells the reader nothing about what to see (down each column AWS runs less and you bring more).

14. **Garbled hedge in the Region panel.** "On our reading the model table is the availability list and the pricing heading covers more Regions than it does" ("than it does" has no clear referent). Say: "Plan for us-west-2; the pricing page's heading also names us-east-1, but the model table does not."

15. **Smaller faults.** Acronym expansions carry no explanation at this point: "DPO (Direct Preference Optimization) on preferred and rejected pairs", "GRPO (Group Relative Policy Optimization)", "NxD Training (NeuronX Distributed Training)"; "NeuronCore", "Trn2 and Trn3" are used bare. Inconsistent forms: "15K prompts" vs "15k pairs"; "gpt-oss-20B" vs "gpt-oss-20b". "AWS has measured it in its own test, a vendor claim." repeats its own panel title "(a vendor claim)".

What works: the ending ("Write the grader first; the service follows from which of these components you are ready to own.") is an action; the Trainium compile panel ("each new prompt size still compiles for about 12 minutes ... a step takes about 25 s ... Bucket prompt and completion lengths before the first run") is exactly the level-400 practical fact the rest of the section lacks, and it is hidden in an expandable; the SageMaker distillation paragraph carries a real consequence ("the student never trained on states its own early mistakes lead to").

---

## doc-B.txt: "18. The Fleet: A 6 GB Policy, a 2 GB Package and No Reverse Gear"

Scores:

- argument 9: the first paragraph states three fixed facts with numbers, the second works them (480 s, 160 minutes, "can never fire"), and every later block ends in a choice or a setting; the four bad rollout settings are explicitly ranked "in order of what each one breaks".
- depth 9: mechanism down to nucleus source (HTTP Range resume "retried once a minute with no attempt limit", 10 GB component store, 120 s install timeout), failure modes (abort cancels only QUEUED executions; a revert that drops the uploader uninstalls it), configuration and why.
- clarity 7: the Greengrass vocabulary is built fast and in order (nucleus, core device, component, recipe, artifact, digest, thing group), but several names are used bare or before they are introduced, and the opening asks the reader to accept a claim whose reason arrives far later.
- sentences 8: mostly short, concrete and consequential ("A revert that lists only the old policy would remove the episode uploader with it."); a little research-narration and a few metaphors.
- parity 9: the strongest file in the batch; the bar the others are measured against.

Findings, most damaging first:

1. **The fixes are argued but never assembled.** The section prints AWS's container recipe and AWS's industrial-dashboard deployment document verbatim ("components": "com.example.IndustrialDashboard" with boiler temperature tags), then spends four blocks saying what is wrong with them: Run instead of startup, no accessControl, no socket mount, no SVCUID / AWS_GG_NUCLEUS_DOMAIN_SOCKET_FILEPATH_FOR_COMPONENT, minimum 100, timeout 5 minutes, no pinned nucleus. The reader who wants to type the result has to rebuild it from four places. Print the corrected recipe and the arm-sized deployment document (minimum 5, threshold 20%, timeout from the measured download, pinned dependencies) once, after the ranked list; the boiler tags add nothing.

2. **The 6 GB policy and the 8 GB computer are never reconciled.** The title and opening are built on "about 6 GB of weights for pi0.5", sourced from a tutorial "on a Jetson Thor", while the stream-manager decision says "The documented minimums of the nucleus and stream manager add to 96 + 70 = 166 MB, taken from the same 8 GB that holds the policy on an Orin Nano", and the hook-up and placeholder use an Orin Nano Super. Whether a 6 GB policy plus the OS, a CUDA context, a Java nucleus and stream manager fits in 8 GB is the question a level-400 reader asks next, and the page does not ask it. Either say which policy the Orin Nano runs or state the memory budget.

3. **The opening asks for trust it pays back two hundred lines later.** "its rule that cancels a failing rollout can never fire, and its pace reaches every arm within 3 minutes." The reason (the rule waits for 100 notified arms and the fleet has 20) is only given in the ranked list. One clause ("because it waits for 100 arms and there are 20") makes paragraph 2 self-proving.

4. **Scope outruns the title, and a lookup table interrupts the argument (fault 6).** The block "Greengrass core device or Kubernetes hybrid node" and the panel "Retired and neighbouring AWS services, as listed on 2026-11-20" (RoboMaker shutdown, Greengrass V1 end date, "Secure tunneling gives an operator a session such as SSH ...") belong to neither the package, the rollout nor the return path the opening announces. "Deployment limits and defaults, for lookup" sits between "Rollout settings ..." and "A brake and no reverse gear", splitting one argument in two; move it to the end. The hybrid-node block is good on its own terms; it needs one sentence tying it to the fleet thesis or a section of its own.

5. **Terms used before they are built.** "pi0.5" appears in paragraph 1 and is identified only in paragraph 4 ("Physical Intelligence's vision-language-action policy"); "SO-101 arms" and "LeRobot video file" are bare in the opening; "fleet indexing can find ... in one query" names a service never introduced; "a node on Systems Manager credentials can take up to 30 minutes to rejoin" and "a VPN or Direct Connect" use AWS names with no gloss; "Its Parquet files are valid only after finalize()" assumes the format.

6. **Research narration (fault 5).** "No AWS page describing a managed update of a Linux device's operating system was located"; "AWS has published no post or sample from 2025 or 2026, among those searched, that runs a GPU policy container on a Jetson". The scope-preserving hedge is honest, but the second opens an h2 with the search instead of the action. The header description ends in a parenthetical of provenance: "(read from Greengrass nucleus v2.18.4 and AWS documentation on 2026-11-20, not run on a device)". The last clause earns its place (it grades the claims); the dates belong in the citations.

7. **Pointers that carry no content (fault 4).** "Section 19, Agents Running the Loop, hands a loop like this to a coding agent and asks what it may touch." closes the broadcast-versus-staged decision with a signpost. "Section 24, Orchestrating Physical AI on AWS, prints the recipe for a component that calls S3 with the token exchange credentials" defers the one recipe the nucleus-lite reader is told to write.

8. **Arithmetic that cannot be redone here.** "the same frames raw would be 199 GB an hour per arm, about 257 times as much": the frame rate (30 fps) and 3 bytes per pixel are not stated on this page. The Robot Data Factory paragraph carries the citation "our arithmetic from the file sizes of the example dataset", which is not where its 38.41 MB/s came from.

9. **Smaller faults.** Quote marks around an invented query read as a quotation: "fleet indexing can find "arms on the new policy whose success rate fell" in one query". "s3:PutObject with the multipart actions" leaves the reader to guess which actions. "none finishes in 8" drops the unit. "Earlier sections used rollout for one run of the policy on one arm; from here it means ..." is a needed word-switch note but sits in the middle of the three-facts argument; it would read better at the first use of "rollout".

Placeholder ("Placeholder, dated 2026-11-20"): placement is right, directly after the hook-up steps it will measure and before the closing action. Wording is specific (each measurement named) but it is one 80-word sentence; a short list would read faster. The ending that follows ("The per-device timeout is set from the slowest arm, and with a 6 GB policy against a 2 GB component limit it also tells you what the route you chose costs in minutes on every arm.") lands the strongest number and an action.

---

## doc-C.txt: "3. The Robot as a Computer: Inputs, Outputs and a Deadline"

Scores:

- argument 8: the first screen hands over a tool ("Lateness on a robot is a distance: at an illustrative 0.25 m/s, 100 ms of delay is 25 mm") and works numbers by paragraph 2; the central tool's scope is left unstated and conflicts with the page's own account of the default inference backend.
- depth 8: real mechanism (position register only, load as duty cycle behind a 1/345 gearbox, P = 16 / I = 0 / D = 32 and its steady-state consequence, deadline pacing that borrows from later ticks, timestamps derived from index so a 25 Hz session claims 30), with a worked latency chain.
- clarity 8: builds servo, encoder, DoF, calibration, observation, action and PID in order, with intuition before formula and every symbol defined before use; a few names arrive late or ambiguously.
- sentences 8: specific and often memorable ("a latency figure for a robot is half a number until a speed stands beside it"); one bookkeeping aside and a few "See ..." descriptions.
- parity 8: publishable beside doc-B; its faults are a scope gap in the central model and a few late definitions, not a weaker register.

Findings, most damaging first:

1. **The central model contradicts the default the page describes later.** "Delay is distance" opens with "The arm does not pause while the computer works" and builds the whole budget on travel during the call ("at 0.25 m/s the gripper travels 35.9 mm on old information"). Two blocks later: "the default is synchronous inference: the loop blocks until the action is computed" and "The arm moves, halts for the length of one call, and moves again." Under the default backend the arm does not travel during inference, so the 143.4 ms chain does not turn into 35.9 mm. Say which backend d = v x tau describes (asynchronous or RTC playback, where the arm keeps executing the old chunk) and what lateness costs under the synchronous default (a halt per chunk).

2. **Travel during the delay is equated with placement error without argument.** "Say the block must arrive within 10 mm of the centre of the cup. At 0.25 m/s the budget is ... 40 ms" and "Against the 40 ms budget that is more than three times over". With absolute joint targets (the page's recommended default) and a still scene, a late target is still the right target; the arm arrives late, not 36 mm off [SPECULATIVE: reviewer's reasoning]. The miss appears when the scene moves or when a chunk's time-indexed actions are played late against a pose the arm has left. The page needs that one step, or it is selling a verdict ("three times over") its own model does not prove. The 10 mm tolerance, which decides the verdict, is also an invented figure introduced with "Say", not labelled as an illustration, and it sits awkwardly beside the opening's "25 mm ... most of the width of a cup's mouth".

3. **The two-moves conclusion leaves out the move the page itself teaches.** "A chain slower than its budget leaves two moves: slow the arm, or shorten the chain." The next h2 presents a third: keep the arm moving through the call with RTC or remote inference and a chunk long enough to cover latency. Either make it three moves or say why chunking does not count.

4. **Two models are mixed in one worked example.** "A 50-action chunk at 30 Hz lasts 1,667 ms, and a 149 ms call, NVIDIA's Jetson Orin figure for GR00T N1.7, uses 4.5 ticks of it." The 50-action chunk is the SmolVLA / pi0.5 default; the page later says the GR00T call returns 40 actions (1,333 ms). The conclusion survives, but the arithmetic should use one model.

5. **A central name is defined at the end of the page.** GR00T N1.7 is used in paragraph 2, in the action block, in the latency chain and in the chunk example; "GR00T N1.7 is a vision-language-action model (VLA), a policy built on a network that takes camera images and a text instruction" arrives in the last h2. Move the gloss to its first use. "SmolVLA" and "pi0.5" are used bare. "the real-time chunking paper" appears before "RTC (real-time chunking), the technique for a model too slow for the tick" is defined.

6. **Bookkeeping in the prose (fault 5).** "The chain that has to fit in that budget is a sum of four waits (the split into four is ours)." is the same family as the owner's "Counting them as five is our grouping"; the split needs no owner. "and the sources read on 2026-11-20 give a figure for none of them" narrates the research; "no source gives a figure for any of them" keeps the hedge without the date. The header description ends in "(LeRobot v0.7.0, the SO-ARM100 hardware repository and the Feetech STS3215 datasheet, read 2026-11-20)".

7. **An ambiguous proper noun.** "Figure's last published rates, for its Helix 02 humanoid model on 2026-01-27, have the same shape" reads as "the figure's" on a page full of figures; the reader at level 100 to 200 does not know Figure is a company. "Its newer Helix 2.5, posted 2026-09-17, states none." is release-date trivia with no consequence.

8. **Deferred "why" at two load-bearing points (fault 4).** "which the host plays one per tick (section 4, Learning From Demonstrations, shows why this works)" hands off the reason action chunks work at the moment the reader meets them; "Section 17, Running on the Robot, covers how a new chunk is joined to the one being played" ends the RTC paragraph on a pointer. "the 1,440 bytes per second of the opening" refers to the page itself.

9. **A heading description promises what the block does not deliver.** "Recognise each failure by what the log and the arm do, and know which setting moves it": the block names the backends but gives no setting (no flag or config key) for any of the three failures. Name the setting or drop the promise.

10. **Reference facts with the consequence left off (fault 6, mild).** The panel "Servo limits, for reference" lists four firmware triggers and the gripper caps ("torque limit at 50%, protection current at 50%, and 25% torque once overloaded") without saying what the host or the policy sees when one trips, or what a 50% gripper cap means for the block. The calibration panel gives "The code divides by 4095 ... where the datasheet gives the step as 360 / 4096" without saying the difference is 0.02 degrees and harmless.

11. **Smaller faults.** "The other, the follower, makes the same move a moment later, so it is the follower that has to pick up a block and place it in a cup" ("so" does not follow). "a vector of six float32 values that carries the six joint names" (the floats do not carry names; the feature metadata does). Two descriptions in the rejected "See ..." register: "See where the computer sits at the bench, and why a recording is already in the units a trained model outputs". The video caption contains "would make it.Capture:" (missing space) and the low-value "The clip runs 8.2 s." The "Capture slot, dated 2026-11-20" block ("What will be shown here: Camera footage of the real leader and follower at the bench.") is placed well, beside the simulated clip it will replace.

The ending ("Multiply that delay by the speed of your gripper, and hold the millimetres against the width of your cup.") returns the opening tool as the reader's action.

---

## Batch answer

Groups by quality alone:

- Group 1: doc-B and doc-C. Both open on a claim with a number and work it by the second paragraph (B: 480 s per arm and 160 minutes for twenty; C: 25 mm at 100 ms, 38,400 times the joint data). Both rank facts by what they break or decide, state their own derivations in one plain clause, build each term before using it with few exceptions, and end on an action the reader can measure. Their faults are local: a missing reconciliation (B's 6 GB policy on an 8 GB board), a scope contradiction in the central tool (C's d = v x tau against the synchronous default), a few late definitions.
- Group 2: doc-A. It opens on "AWS runs both kinds of learning loop this dive compares" and a tour of four product families at three levels; its thesis is hedged as unverified in the same paragraph that states it; "our reading" appears 19 times (B: 2, C: 3) and other sections are cited 22 times as stand-ins for explanation (B: 7, C: 8); it quotes $80.00/hour, $1.49 per million tokens and $1.95/month and works none of them; and it lists services and limits at equal weight without the criterion that picks Bedrock over SageMaker AI for the same path.

A careful reader would tell doc-A apart from doc-B and doc-C by quality alone within the first screen: the first two paragraphs of A describe the page and its sources, where B and C argue and compute. B and C are not distinguishable from each other as tiers; B is marginally stronger on argument and depth.

One fault shared by all three: the header description ends in a parenthetical of versions and access dates, which is citation metadata in the most visible line of the section.

Verdicts:

- doc-A: distinguishable: weaker. Tour opening, thesis hedged into an unverified reading, no worked number, no selection criterion, pervasive bookkeeping and cross-references.
- doc-B: sets the bar. Argument from the first sentence, every block ends in a setting or a choice, failure modes ranked by consequence, worked arithmetic throughout.
- doc-C: not distinguishable by quality from the best files. Same argued, worked, built-up register; its main fault (the delay model's unstated scope) is a correctness gap inside a strong argument, not a drop in writing quality.


---
Key (added after the review): doc-A rl dive AWS section; doc-B this dive section 18; doc-C this dive section 3 (published pilot, bar)
