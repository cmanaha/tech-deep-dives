# Adversarial review, batch w3r2, input inX

| file | argument | depth | clarity | sentences | parity | verdict |
|---|---|---|---|---|---|---|
| doc-A | 9 | 9 | 7 | 8 | 8 | not distinguishable by quality from the best files |
| doc-B | 9 | 9 | 9 | 9 | 9 | sets the bar |
| doc-C | 8 | 9 | 7 | 8 | 8 | not distinguishable by quality from the best files |
| doc-D | 5 | 3 | 4 | 5 | 3 | distinguishable: weaker |
| doc-E | 9 | 9 | 8 | 8 | 8 | not distinguishable by quality from the best files |

---

## doc-A: "19. Agents Running the Loop: What the Agent May Touch and Who Grades It"

Scores
- argument 9: the first sentence is the claim (reset, success check and safety limits must sit outside the agent's reach) and the third paragraph works 44% first-try to 99% pass@8; every later section proves a piece of it.
- depth 9: precision drifting with the policy's success mix, Wilson lower ends, the SIGTERM-to-SIGKILL window, Karpenter's eventually-checked limit, the cached share of tokens. Level 400 throughout.
- clarity 7: the concept the thesis rests on (what a retry inside pass@8 physically is) is never pinned down, and one gain metric and one figure are used without being shown.
- sentences 8: mostly specific and consequential; a few knotted or hypothetical sentences in the evaluation-count paragraph and in the close.
- parity 8: same voice and bar as the best file; denser, with more loose ends.

Findings
1. "pass@8 counts a success anywhere in a rollout of up to eight attempts, each made after seeing the previous failure." and later "the authors' 13% is their case of retries that add nothing." The thesis of the section rests on how retries differ from fresh draws, but the reader is never told who "sees" the failure (the policy, conditioned on it? the agent?) or whether the scene is reset between attempts. Without that, "retries that add nothing" and "retries succeed more often than first tries" are abstractions the reader cannot picture. One sentence on what happens physically between attempt k and attempt k+1, or a plain statement that the paper does not say, fixes it.
2. "raised what the authors call the "team-average best success rate" by 10.8 percentage points." The metric is never defined (best of what, averaged over which team, on how many episodes), yet the later argument about small gains ("batch-size tuning (+0.9) and controller compensation (+1.3)") is built on deltas of this same metric. ENPIRE's own episode count is never given, so the conclusion "Measured on 100 episodes each, AgenticRobotics' count, gains of +0.9 and +1.3 would sit inside the interval that count gives." is a hypothetical borrowed from another paper, in a sentence that has to be read twice. Define the metric in one clause, give ENPIRE's count or say it is unpublished, and land the interval on that.
3. "The bar the same figure labels uncached work, 2.6M, sits at the fleet figures' scale." Points at a bar in the paper's figure 13, which is not on the page. Say "the paper gives uncached work as 2.6M" or show the sum (2.4M fresh input + 0.27M output).
4. "Every idea follows one order, set in the repository's instruction file, and the order spends robot time last, the resource the authors call binding." "Binding" is economist's shorthand the level 100-200 reader lacks, delivered as attribution (owner's fault 5). The same paragraph ends on "passes the success and regression gates", a term used nowhere else. Say "the scarcest resource, the one that limits progress", and say what a regression gate checks.
5. "so the agent's sandbox keeps a network, and what that network may reach is the setting you control." The section flagged the agent's "unrestricted internet access" as the reason it needs a fence, then names the control without naming the setting (Kubernetes network policy, security groups for pods, an egress proxy). The one place the AWS design stops a step short of level 400.
6. "A session on its microVMs ends after at most 8 hours, and an idle one after 15 minutes by default." The section computed 19 agent-minutes per idea, much of it waiting on training and robot runs, but does not draw the consequence that an agent waiting on a Batch job can trip the 15-minute idle default. "a session that ends ... ends a session and not the campaign" covers recovery, not the setting to raise.
7. Header description: "(ENPIRE paper v2 and repository, AWS documentation, read 2026-11-20)". Provenance and read date in the reader's payoff line; it belongs in the citation (owner's fault 5). Shared by all four files from this dive.
8. "(the Learning From Feedback dive builds the idea in its section 13, The Reward Is a Proxy)" Navigation prose inside the sentence that introduces the optimiser idea, splitting it. Put the pointer after the sentence or in a link.
9. Repetition without gain. The panel "What one ENPIRE station holds" ("Each station is one two-arm robot with three cameras, on one workstation...") restates the paragraph just above it ("Each station pairs one robot with one GPU that both trains and runs the policy, and its own agent."). The 44% is derived in full twice, once as 0.56^8 ≈ 0.01 in the opening and again as p = 1 - 0.01^(1/8) ≈ 0.44 in section 4. Landing the number twice is right; deriving it twice is padding.
10. Caption: "Illustrative layout, not measured." on a box-and-arrow diagram. An empty disclaimer; nobody reads a box diagram as a measurement.
11. Section title "Eight robots reached the target 2.4 to 3.7 times sooner, and the robots waited", while its second paragraph gives the speed-up on the agent's own objective as 2.25, outside the headline range. The headline picks the flattering finish line.
12. Closing sentence: "That rate is the number to compare across policies; a 99% within eight attempts is reached by independent tries at 44%." The inversion reads as if independent tries were the mechanism of the 99%. Plain form: "with independent tries, 44% on the first is enough for 99% within eight."

---

## doc-B: "3. The Robot as a Computer: Inputs, Outputs and a Deadline"

Scores
- argument 9: "Lateness on a robot is a distance" is in the first paragraph with 25 mm worked; every section returns to it and the close hands the reader the method.
- depth 9: encoder steps to degrees, PD with I = 0 and its steady-state consequence, timestamps derived from frame index corrupting a dataset recorded at 25 Hz, the macOS busy-wait cost, the backlash floor and the speed ceiling of the delay line.
- clarity 9: concepts built in order (servo, encoder, DoF, calibration, action spaces, PID intuition then formula then term-by-term); only two terms arrive before they are built.
- sentences 9: short, specific, consequence-bearing ("a latency figure for a robot is half a number until a speed stands beside it").
- parity 9: the reference file of this batch.

Findings
1. "The chain that has to fit in that budget is a sum of four waits (the split into four is ours)." Bookkeeping in the prose, the exact pattern of the owner's "Counting them as five is our grouping". Drop the parenthesis; the citation already marks the arithmetic as the writer's.
2. "Figure's last published rates, for its Helix 02 humanoid model on 2026-01-27, have the same shape: ... Its newer Helix 2.5, posted 2026-09-17, states none." The company Figure is never introduced, and on a page full of figures "Figure's" reads as a diagram reference. The second sentence is release tracking with no consequence for the reader. Introduce "Figure AI, a humanoid maker," and cut the Helix 2.5 sentence.
3. "Put numbers on that condition. A 50-action chunk at 30 Hz lasts 1,667 ms, and a 149 ms call, NVIDIA's Jetson Orin figure for GR00T N1.7, uses 4.5 ticks of it." Pairs the 50-action chunk of SmolVLA and pi0.5 with a GR00T call that, two paragraphs later, is "returning 40 actions". The arithmetic survives, but the reader is handed a combination that does not exist. Use 40 actions (1,333 ms) or a 50-action policy's call.
4. Panel "Servo limits, for reference: gripper caps and firmware cut-outs": "The datasheet lists four triggers for it: 2 s blocked at more than 80% of stall torque, 2 s drawing more than 2 A, a supply outside 4 V to 7.4 V, and a temperature over 70 degrees C." A list with no consequence: the reader is not told what a cut-out looks like mid-episode (does the joint go limp, does LeRobot log it) or how to tell it from a policy failure. "for reference" in the heading admits the reference-manual problem (owner's fault 6). One sentence on what the operator sees would make it earn its place.
5. "The code divides by 4095, the encoder resolution minus one, where the datasheet gives the step as 360 / 4096." A 0.02% discrepancy, with its own worked result (90.02 degrees), at the same weight as the calibration point that decides whether a model transfers between arms. Trivia; cut or demote.
6. Terms before they are built. "A local network added 10 to 20 ms in the setup of the real-time chunking paper." cites RTC two sections before RTC is introduced. The chart caption "The dashed line is the slack in the gears" shows backlash two paragraphs before the prose explains it.
7. Video caption: "The clip runs 8.2 s. ... Capture: MuJoCo 4.0.1, offscreen renderer; 2026-11-20; scripted motion, no learned policy. SO-101 model from TheRobotStudio/SO-ARM100 at commit 141aea7 (Apache-2.0)." Production metadata and clip length in a reader's caption; the line that matters is "A script moves the arm here, so the motion is cleaner than a person or a trained model would make it." Also a missing space: "make it.Capture".
8. "Each term has a cited size on this arm." A sentence about the citations rather than the terms. Cut it and let the four sizes follow.
9. "By their names and the mounts the hardware repository ships, one rides on the arm and sees what is between the fingers" Narrates how the writer inferred camera placement. State where the cameras sit and cite.
10. Header description: "(LeRobot v0.7.0, the SO-ARM100 hardware repository and the Feetech STS3215 datasheet, read 2026-11-20)". Same provenance-in-the-payoff fault as the other files of this dive.

The "Capture slot, dated 2026-11-20" block ("What will be shown here: Camera footage of the real leader and follower at the bench.") is clearly worded and sits right after the simulated clip it will complement. No fault.

---

## doc-C: "17. Running on the Robot: Driving the Arm With a Policy Slower Than Its Clock"

Scores
- argument 8: the claim (a call 4.5 periods long still drives the arm; chunking hides the delay and leaves its age in every action) lands in three paragraphs with numbers, but a methods disclaimer closes the first screen.
- depth 9: the half-chunk rule, refill-floor arithmetic, guidance as a backward pass per denoising step (76 ms to 97 ms), the LINEAR-versus-EXP code and documentation disagreement, engines bound to compute capability, the Thor graph rewrite saving twice what the bits saved.
- clarity 7: the same bound is given in two notations with a name collision, the chunk size switches from 40 to 50 in the animation, and the opening disclaimer is hard to parse.
- sentences 8: many strong ("Chunking hides a slow call from the clock and leaves its age in every action."), but several paragraphs are stacks of figures.
- parity 8: same bar as the best file, with heavier notation and a weaker first screen.

Findings
1. Opening, fourth paragraph: "LeRobot v0.7.0, the library that drives this arm, ships a wrapper for GR00T N1.7 but gives its settings for joining chunks smoothly for SmolVLA, pi0 and pi0.5, and NVIDIA timed the 149.0 ms on its own TensorRT path. Where the Orin figure meets one of LeRobot's rules, it illustrates the arithmetic, and a timed call of your own policy replaces it." A methods disclaimer on the first screen, about the page's own use of a number ("it illustrates the arithmetic"), using "joining chunks smoothly" before RTC is built (owner's faults 4 and 5). It dilutes a strong opening. Put one clause at the first place the Orin figure meets a LeRobot setting (the inference_delay paragraph), or in the citation.
2. The same bound twice, in two notations: "The real-time chunking paper states the same bound in ticks. It counts the delay d as the call's length in whole periods, d = floor(L / dt) ... the paper requires d <= s <= H - d ... For a chunk of 40 and d = 4, s can be anything from 4 to 36." and later "execution_horizon is ... H−s in the paper's symbols. ... (The paper calls s itself the execution horizon.)" The reader now holds L and Δt, d and dt, s, and two opposite meanings of "execution horizon"; the range "4 to 36" is never used. Meanwhile the section description promises "Set inference_delay, execution_horizon and the guidance mode from your measured call", but execution_horizon is given only as "10 by default, typically 8 to 12", not derived from the call. Cut the paper's restatement to what the settings need, and give the rule that ties execution_horizon to the measured d.
3. "Take GR00T N1.7, NVIDIA's robot policy, on a Jetson Orin, a small computer built to ride on a robot (NVIDIA does not name the module)." A provenance aside in the second sentence of the page. It matters in the device table; it belongs there.
4. "inference averaged 5.18 ms and its worst call took 40.00 ms, a stall of about 35 ms on top of the typical call, and recording averaged 0.67 ms and once took 620.00 ms, the blocking save of an episode." The policy behind 5.18 ms is not named, so the reader cannot tell what kind of call has this tail. The 620 ms blocking save, about 19 ticks and the largest stall on the page, gets no consequence: does it freeze the arm during a rollout that records, and should recording be off during evaluation?
5. Animation caption: "The chunk drawn is the example size in LeRobot's RTC guide, 50 actions, so half of it is 25 ticks; the call times are illustrative." The prose runs on 40-action chunks and a 20-tick half; the figure switches to 50 and 25 and spends a caption sentence explaining the switch. Draw 40.
6. "TensorRT 11.5 documents FP8, eight bits made of a sign bit, four for the exponent and three for the mantissa, and FP4, four bits: a sign bit, two exponent bits and one mantissa bit. NVFP4 is that FP4 with a scale factor per block of numbers" Bit layouts listed without the consequence that makes them matter: FP4 represents only a handful of distinct values, which is why it needs a per-block scale and calibration data. The next paragraph does this for FP16; this one stays descriptive (owner's fault 2).
7. Expandable heading: "AWS's container recipe, the credential flags that keep long-lived keys off the robot, and the nucleus's footprint and platforms". A four-topic list as a title. Its paragraph "The Java nucleus (v2.18.4) ... 96 MB of RAM ... 15.8 MB with six small components running" repeats the footprint figures given just above it.
8. Placeholder wording: "Where it will come from: our own hook-up of the two machines to AWS IoT, which has not been done yet. Nothing in this block was run on a device." The block holds no results, so "Nothing in this block was run" has no referent; it presumably means the docker run line and recipe above, which their caption already covers. Cut the last sentence. Placement, at the end of the Greengrass part it will replace, is right.
9. Heading "The deployment agent that installs the policy must hand it the GPU" and "On paper the agent is small". In this dive "agent" means a coding agent (section 19); calling the Greengrass nucleus "the deployment agent" invites the collision. "The device software that installs the policy" avoids it.
10. "Five policy types, ACT and SmolVLA among them, have run on real robots this way. A router, a private hosted GPU or a Hugging Face Space "has not been validated yet"" Validation-status listing at the weight of the bandwidth figure before it. The consequence (test your own network path) is in the following quote; the list can shrink to it.
11. Header description: "(NVIDIA's Isaac-GR00T and TensorRT documentation, LeRobot v0.7.0 and the AWS IoT Greengrass guide, read 2026-11-20)". Shared provenance fault.

---

## doc-D: "Thesis and Framing"

Scores
- argument 5: there is a thesis and a worked number by the third paragraph (a ridge of 412 FLOP per byte against decode at 2 to 10), then the section tours a taxonomy and ends on a table of contents.
- depth 3: one ratio. No failure mode is worked, no configuration choice, and the "instruction" and "shape" deliveries carry no number at all.
- clarity 4: acronyms are expanded and left unexplained (BTB, SM, warp, NEFF, SBUF, PSUM, TMEM, tcgen05, systolic array, prefill, KV cache, roofline); the level 100-200 reader loses the thread in the triangle subsections.
- sentences 5: the anchor paragraph is crisp; elsewhere run-in labels, lists of chips, triads and unsupported "can lose" claims.
- parity 3: reads as a different, earlier standard next to the other four.

Findings
1. Title "Thesis and Framing". Names the section's role, not its content: the same family as "One Robot, One Loop". A title that states the claim ("Decode waits on memory: read bandwidth before FLOPS") would do the work.
2. First sentence: "This deep dive gives you a way to predict how an inference workload will run on a chip before you benchmark it." Prose about the page (owner's faults 1 and 4).
3. The closing section is a table of contents in prose: "Roofline and Arithmetic Intensity computes ridge points across chips and precisions. Memory Hierarchy Primer and Anatomy of a Kernel Execution walk the tiers; HBM and the Bandwidth Wall, DDR5, MRDIMM, LPDDR5X and CXL, High Bandwidth Flash and Flash as a Cache Tier for Inference take the ones that hold weights and KV cache." with the description "The question to bring to every chip, and where the dive answers it". A tour of the page.
4. The three delivery subsections are a per-chip tour with no consequence and no number: "Out-of-order host cores do it speculatively, with a branch predictor and a BTB (Branch Target Buffer). A GPU SM (Streaming Multiprocessor) issues from a warp scheduler and hides a stalled warp's latency by running other warps." and "On Trainium it is SBUF (State Buffer) and PSUM (Partial Sum buffer)." An expanded acronym is a name, not an explanation; warp, front end, retire, register file and systolic array are never built. Worse, "Data delivery", the delivery the section says binds decode, never mentions HBM, bandwidth or the 412 ridge: the thesis and its proof sit in different places.
5. "Arm Neoverse host cores, x86 cores with AMX tiles, NVIDIA Hopper and Blackwell GPUs, AWS Trainium and Inferentia, Cerebras wafer-scale engines, the Groq LPU (Language Processing Unit), the SambaNova RDU (Reconfigurable Dataflow Unit) and compute-in-memory devices each place a different bet on how instruction, data and shape reach the unit." A list where a consequence should be (owner's fault 2). Not one of the bets is named.
6. The anchor number's premise is left unexamined: "so with 8-bit weights at batch 1 to 5, decode sits at 2 to 10 FLOP per byte, about 40 to 200 times below the ridge." Why batch 1 to 5? A served model usually batches far more; at batch 64 the same arithmetic gives 128 FLOP per byte, a 3x gap rather than 40x. KV-cache reads, which grow with context and batch, are left out, and "until a fixed latency floor sets the step time" is undefined. The whole argument rides on this paragraph and it stops below level 400.
7. Unsupported claims: "A chip that leads on peak FLOPS can lose to a slower one that makes the three deliveries more consistently on the target workload." and "bind on different deliveries, and often land on different silicon." No example, no number, and the second never says which workload binds on which delivery.
8. The best evidence is asserted, not argued: "Within decode, LPX runs latency-sensitive work such as the MoE expert FFNs (feed-forward networks), while Rubin GPUs keep prefill and decode attention over the KV (key-value) cache." Why experts suit 500 MB of on-chip SRAM and attention suits HBM is exactly what the triangle should explain, and it does not. "prefill" is never defined; "KV cache" is only expanded.
9. "Three things must reach the unit in the same cycle: the instruction, the data, and the shape of that data." Layout is a property of the data, not a third thing that arrives. The "triangle" reads as a taxonomy made for the page (owner's fault 3), and the reader cannot picture a shape arriving.
10. Box "Check that the mechanism exists before you port a tuning result": "On WSE-3 the compiler fixes the routes. A model larger than one wafer is split at layer boundaries across several CS-3 systems." The second sentence has nothing to do with porting a tuning result, and CS-3 is undefined. It dilutes the box's good last line ("gives a systolic array nothing to act on: it has no speculation depth").
11. Run-in labels and self-talk: "Reading a spec sheet for inference.", "The anchor number.", "Sparse aside:". Headings "Heterogeneity is the organizing fact" (taxonomy phrasing) and "What to ask instead" (instead of what?). "Roofline" first appears in the closing tour ("move it on the roofline") and is never explained.
12. Header description: "A way to predict how a model will run on any chip in this dive, from one ratio you can work out from a spec sheet". "in this dive" is self-reference; otherwise the payoff is fair.

---

## doc-E: "18. The Fleet: A 6 GB Policy, a 2 GB Package and No Reverse Gear"

Scores
- argument 9: the title is the thesis, the first paragraph proves two of the three constraints with ratios, and the rollout settings are ranked by what they break.
- depth 9: digest checks against a replaced S3 key, Range-request resume with no attempt limit, a 120 s install timeout against a 480 s download, run-versus-startup success semantics, a version-pin conflict between thing and group deployments, a revert revision that uninstalls the uploader, Parquet valid only after finalize().
- clarity 8: AWS IoT terms are built before use (thing, thing group, job, job execution, canary), but the first screen leans on an example not yet shown.
- sentences 8: concrete and consequential; bookkeeping about what documentation pages say recurs, and captions carry disclaimers.
- parity 8: same bar as the best file; the tail and the unquantified trial gate keep it from leading.

Findings
1. The decisive gate is unquantified: "It holds its startup step open through a set of trial episodes and reports RUNNING only if enough succeed". The canary design rests on this trial, and the dive's own Wilson arithmetic (section 16) would show that a handful of episodes cannot tell a 95% policy from a 70% one. "a set" and "enough" leave the reader without the number that decides the startup timeout and the canary wait. Give a count and the interval it buys.
2. First screen leans on an unseen artifact: "AWS's example deployment shows what those facts do to a small fleet. ... The example's rule that cancels a failing rollout can never fire, because it waits until 100 arms have been notified and the fleet has 20." The example is printed three sections later, and "notified" and "rollout rate" have not been built. Name it in one clause ("the deployment document in AWS's Greengrass guide, printed below") or hold this arithmetic until the JSON.
3. The page does not end on the reader's action. After the strong close ("Time the first cloud deployment end to end over your own link...") come "Deployment limits and defaults, for lookup" and "Retired and neighbouring AWS services, as listed on 2026-11-20", a grab-bag: "AWS IoT Core, Greengrass V2 and AWS IoT Device Management appear in none of AWS's lists of services in maintenance, in sunset or shut down on 2026-11-20." and "Secure tunneling gives an operator a session such as SSH to a device behind a firewall, with no inbound port, on both nuclei." Facts at equal weight with no consequence (owner's fault 6). The Greengrass V1 end is worth one clause where a reader might meet a V1 tutorial; the rest can go.
4. Documentation-status bookkeeping recurs: "The mechanisms are documented, and the three routes are designs built from them for weights this size." / "The design is ours, built from documented parts." / "none of the AWS posts and samples from 2025 or 2026 that were searched runs a GPU policy container" / table cell "The pages read say nothing about GPUs." The owner's rule is one plain clause, once; here the research process is narrated in four places.
5. An unlike comparison: "Those spans show how fast a loop with no staging can close: under a minute each way at the median, with a learner broadcasting weights to every robot at once on the authors' own network and model." The model size and link speed of that run are not given, so its 38 s cannot be held against the 8-minute 6 GB download it is set beside, and the trade-off that follows ("Deploy to the whole fleet group at once where a fresher policy is worth more than a brake") rests on it.
6. Two recommendations with no boundary: "Beside an arm, run the Java nucleus. Nucleus lite ... saves more than 81 MB (96 - 15), little on a board with gigabytes" and later "Where a small board runs nucleus lite, write the direct component instead". After the first, which board beside an arm runs lite? Say when lite is the right choice, or that it is not.
7. The eleven-item list "AWS's printed recipe and deployment document need these changes before they carry a policy to twenty arms, in the order you would make them:" re-lists the section nearly line for line. It is actionable, so it partly earns its place, but it is a summary box in list form, and the order-of-work list in the last section repeats much of it a third time.
8. Caption loaded with disclaimers: "It assumes a minimum the group can reach and a pace slow enough to leave arms queued when failures arrive; the example's settings give neither. Illustrative: the counts, the versions and the moment failures arrive are invented; the 60 s is the documented default wait for a component that does not answer." Two sentences of provenance in a caption whose job is to say what the figure shows. The second figure's caption does the same ("The rest is a schematic, with the arm count and version numbers invented.").
9. "Earlier sections used the word rollout for one run of a policy on one arm; from here on it means this spread across a fleet." The switch of meaning has to be flagged, but this phrasing is about the page. Fold it into the definition: "a rollout, here the staged spread of a version across the arms (section 3 used the word for one run of a policy)".
10. "Whether a policy that size also fits in a smaller board's memory, beside everything else the board runs, is a check to make on that board before planning its delivery." A vague hedge inside the opening's proof. The dive has the numbers (8 GB shared on the smallest Jetson against 6 GB of weights); say it in one clause or drop it.
11. The AWS deployment JSON is printed whole, with "com.example.IndustrialDashboard" and boiler tags the reader must wade past. Trimming to deploymentPolicies and iotJobConfiguration would put the four bad settings in front of the eye.
12. Header description: "(read from Greengrass nucleus v2.18.4 and AWS documentation on 2026-11-20, not run on a device)". Shared provenance fault.

The "Placeholder, dated 2026-11-20" block is clearly worded (what will land, where it will come from) and well placed, after the order of work and before the closing action. Its seven items overlap almost entirely with the placeholder in doc-C (section 17), so a reader of both meets the same promise twice; one of them could point to the other.

---

## Batch answer

Groups, by quality alone:
- Group 1: doc-B. Argument in the first paragraph with a worked number, every term built before it is used, intuition before formula, failure modes with the setting that moves each, and a close that hands over the method. Its faults are isolated sentences.
- Group 2: doc-A, doc-C, doc-E. The same voice and the same bar: each opens on a claim, works numbers by the second or third paragraph, reaches level 400 (mechanisms, defaults that differ from documentation, failure modes, settings) and ends on the reader's next measurement. What keeps them a step behind B is density and loose ends, not a lower standard: more narration of what sources do and do not say, a few terms or figures used without being shown (A's retry mechanism and gain metric, C's two notations for one bound, E's unquantified trial gate and trailing lookup panels), and more figures per paragraph.
- Group 3: doc-D. Opens on the page talking about itself, carries one worked ratio, then tours a taxonomy chip by chip with acronyms expanded but not explained, has no failure mode or configuration choice, and ends on a table of contents.

Would a careful reader tell some files apart by quality alone? Yes: doc-D, at once, by its title, its first sentence, its list-of-chips middle and its table-of-contents ending. Among A, B, C and E, a careful reader would find B the cleanest read but would not put the other three in a different quality tier. The provenance parenthetical in the header description is shared by all four of these files, so it does not separate them.

Verdicts
- doc-A: not distinguishable by quality from the best files. Same argument-first structure and depth as B; weaker only on the undefined retry mechanism and gain metric.
- doc-B: sets the bar.
- doc-C: not distinguishable by quality from the best files. Depth equal to B; the first-screen disclaimer and the doubled notation for the RTC bound are the gaps.
- doc-D: distinguishable: weaker. Self-referential title and opening, taxonomy tour, acronyms without explanation, one number, table-of-contents close.
- doc-E: not distinguishable by quality from the best files. The strongest argument structure after B (settings ranked by damage); held back by the unquantified trial gate and the grab-bag panels after the close.


---
Key (added after the review): doc-A this dive section 19 (r2); doc-B this dive section 3 (published pilot, bar); doc-C this dive section 17 (r2); doc-D silicon dive thesis and framing; doc-E this dive section 18 (r2)
