# Adversarial review, batch w2r3 / inX

| File | Argument | Depth | Clarity | Sentences | Parity | Verdict |
|---|---|---|---|---|---|---|
| doc-A (26. Fine-Tuning & Learning Loops on AWS) | 4 | 6 | 5 | 5 | 5 | distinguishable: weaker |
| doc-B (10. Processing and Curating: How Many CPU Cores Keep a Training GPU Fed) | 8 | 8 | 7 | 7 | 8 | not distinguishable by quality from the best files |
| doc-C (12. Physics Simulation: One Scene on a Core, Thousands on a GPU) | 8 | 9 | 7 | 8 | 9 | sets the bar |
| doc-D (9. Collecting Data: What an Episode Weighs and What It Costs to Record) | 7 | 8 | 8 | 8 | 8 | not distinguishable by quality from the best files |

---

## doc-A: 26. Fine-Tuning & Learning Loops on AWS

- **Argument 4.** Opens on a taxonomy (two stacks, four product families, three levels). Its one thesis, "one grader, two update targets", is tagged "our reading" and taken back in the next sentence.
- **Depth 6.** It has real recipe-level detail: GAE overridden to GRPO, 8 samples per prompt, `age_tolerance: 2`, a 12-minute compile per shape. It works no number at all, and it lists configuration options by count without deciding between them.
- **Clarity 5.** Value model, critic, verl, logit-based distillation and NeuronCore are never built. SFT appears in the header and the first paragraph before it is expanded. Several sentences hold up only if the reader already knows sections 4, 9, 13, 15, 22, 23 and 25.
- **Sentences 5.** They are concrete and correct, but 19 "our reading" clauses, research-process narration and price provenance in the prose make the voice careful and flat.
- **Parity 5.** It is clearly below B, C and D: it shows faults 1, 2, 3, 5 and 6 from the owner's list.

### Findings, most damaging first

1. **Opens on a definition and a tour, with no argument and no number.** "AWS runs both kinds of learning loop this dive compares." and "They sit in four product families, Amazon Bedrock, Amazon SageMaker AI, Amazon Bedrock AgentCore and the Neuron SDK for Trainium, at three levels of control, and each level asks you to bring a different component." This is fault 1 and fault 2 exactly: a count of families and levels where the section should open on a consequence. The next paragraph is navigation: "The challenge is to find the service for the path you chose in section 25, Choosing a Technique: Fine-Tuning, a Text Loop or a Hybrid, and to know what you own once you get there." A good opening would state the decision the page settles: what you must own before AWS will run any loop for you, and what that costs per hour.

2. **The thesis is labelled as bookkeeping and then withdrawn.** "Our reading of the two services: one grader, two update targets. The grader you write first can drive a weight update or a prompt rewrite. The pages read do not say one Lambda runs unchanged in both, so check each service's input and output format before reusing one." The organising claim is asserted, flagged as the writer's inference, and undercut within three sentences. The section and its closing table are then built on it, so the reader cannot tell whether it holds. Fix: show the two contracts side by side (RFT reward Lambda in and out, Advanced Prompt Optimization metric Lambda in and out) and say what has to change. Otherwise drop the slogan.

3. **Bookkeeping throughout: 19 "our reading" clauses** (fault 5). Examples: "reading them as REINFORCE++ and a variant of GRPO aimed at pass@k, the chance that at least one of k attempts succeeds, is our reading." "Any loop from sections 16 to 18 can run against Bedrock models with nothing AWS-specific beyond the model API (our reading)." That second hedge sits on a self-evident claim. Also "which this dive would write pass@4 (our reading)" and "Two of section 25's paths have no dedicated service, on our reading of the services covered here." The owner asked for one plain clause, once. Here the hedge is the voice of the page.

4. **The strongest number is never worked, and every cost is deferred.** "$80.00 per training hour" appears in the header, the figure, the RFT block and the ending, and nothing ever multiplies it. "Section 23, Cost per Improvement, turns the hourly rate into a breakeven against a text loop." "Section 23, Cost per Improvement, sets distillation's bill beside RL's GPU-hours." The page gives "$1.49 per million tokens trained" and a cap of 15K pairs but no worked bill: pairs x tokens x epochs x rate. The file contains no arithmetic at all. A level-400 section on managed services has to put at least one job's cost on the page.

5. **Options are listed by count instead of being decided** (faults 2 and 6). "advantage_method defaults to group_based and takes nine values, among them rloo ..." and "The loss is a second setting, loss_fn, with three values and ppo as the default". The reader learns how many settings exist and nothing about when to leave the default. "SageMaker AI model customisation lists six techniques: ..." is a list. "Section 25's SFT path runs here as well as on Bedrock." gives no basis for choosing Bedrock SFT or SageMaker SFT, and that is the configuration decision a reader arrives with.

6. **Terms used before they are built.** "GRPO compares each response with the others sampled for the same prompt, so the advantage, how much better a response did than its group, needs no separate value model." The value model is never introduced, so the benefit has nothing to stand on. "verl's PPO (Proximal Policy Optimization) trainer": verl is never said to be a library, and PPO is expanded but not explained. "GAE (Generalized Advantage Estimation), the critic-based one": critic is undefined. "logit-based and on-policy distillation are described on the page as not currently supported": logit-based is undefined. One sentence carries five acronyms: "Its methods are SFT (supervised fine-tuning) on labelled answers, distillation on a teacher model's answers, DPO (Direct Preference Optimization) on preferred and rejected pairs, and RFT (reinforcement fine-tuning) against a grader, which Bedrock runs with GRPO (Group Relative Policy Optimization), often training a LoRA (Low-Rank Adaptation) adapter, a small set of matrices added beside frozen weights." "Often" is vague, and a later block says it is a rank-32 adapter.

7. **Research-process narration instead of facts.** "On Trainium, GRPO and PPO were not found in the Neuron v2.33.0 documentation searched". "Across the 149 verl-grpo-* files the instance types are ...". "On the pages read, none of the words-side services is described as changing model weights". These sentences describe what the writer did. Each hedge has the right scope, but the reader needs the consequence first: "Neuron v2.33.0 documents no GRPO or PPO procedure; the GRPO route on Trainium is TRL's."

8. **Prose about the page, and a page that leans on other sections.** "The amber boxes mark what you bring." The figure caption is provenance only: "Schematic. The price, versions and model names are cited in the blocks below. "One grader, two update targets" is our reading of the Bedrock RFT and Advanced Prompt Optimization pages." It says nothing about what the figure shows. The page makes 22 section cross-references, and two of them carry the argument: section 25 for the paths, section 23 for every number. The header description opens the same way: "Find the AWS service for each path from section 25 and what you bring to it".

9. **A trivial limit given its own block** (fault 6). "A Region detail when you plan the job" spends a block on the pricing page heading Regions differently from the model table. The SFT venue decision gets one sentence.

10. **Provenance of a price written into the prose.** "$80.00 per training hour for each of the three models, gpt-oss-20b and Qwen3 32B on the pricing page and Nova 2 Lite in the AWS Price List". Which page lists which model belongs in the citation.

11. **The vendor-claim label appears twice, and the result that matters goes unread.** The heading "AWS's own test of episodic memory on tau2-bench (a vendor claim)" is followed at once by "AWS has measured it in its own test, a vendor claim." The paragraph then reports that in airline, stored episodes (43.0%) beat reflections (41%). That bears on which retrieval mode to configure, yet the paragraph closes on the test's limits and draws no consequence. Mixed precision ("43.0% against 41% ... and 24%") reads as transcription.

12. **A forward reference.** "The two open-weight models have no console judge" comes a paragraph before the models are named ("OpenAI gpt-oss-20B and Qwen3 32B").

13. **The best block stops one step short.** The TRL compile paragraph has a number and an action ("Bucket prompt and completion lengths before the first run, because every new size costs a compile"). It does not work the budget: buckets of 128 tokens up to your maximum length, times about 12 minutes each. The ending ("Write the grader first; the service follows from which of these components you are ready to own.") is a sound next action, but it rests on the hedged thesis of finding 2.

---

## doc-B: 10. Processing and Curating: How Many CPU Cores Keep a Training GPU Fed

- **Argument 8.** The first sentence is a claim ("A training GPU fed robot video can sit idle while the CPU cores beside it decode the frames"). Paragraph two works 1 / 2.8 = 36%, and paragraph three sets a contrasting case. The curation half loosens the line.
- **Depth 8.** The W >= B / (r x u) inequality is derived and worked on measured rates, and SMT and physical cores are explained. It covers the NVDEC (GPU video decoder) codec matrix, the CUDA-in-worker failure, nvidia-smi semantics and Cosmos Curator budgets. Two load-bearing steps lack a mechanism (findings 1 and 2).
- **Clarity 7.** Terms are built at first use (dataloader, vCPU, NVDEC, codec, GOP, Ray, embedding, K-Means). The measurement the section ends on is never defined, and one paragraph ends in a circle.
- **Sentences 7.** Mostly consequential, with a few reconciliation and provenance sentences and an awkward header.
- **Parity 8.** It sits alongside C and D.

### Findings, most damaging first

1. **The instance advice rests on an unproven step: workers scale with physical cores, not vCPUs.** "compare instances by physical cores per GPU instead: 12 (24 vCPUs) on most eight-GPU sizes, 6 on p4d.24xlarge, 24 on g7.48xlarge" and "Raise the worker count from its default of 4 toward B / (r x u), within the physical cores beside the GPU". The page explains SMT but never says why a second hardware thread adds nothing to software video decode. No measurement shows it either. The claim that g7.48xlarge offers "twice the 12 of the other eight-GPU x86 sizes" depends on it. Give the mechanism or a measurement, or hedge the ranking.

2. **The measured rates come without the mechanism that would let a reader transfer them.** "5.37 ms per random single row on LeRobot's main branch and 5.16 ms with the pull request's change" and later "The pull request's own change ... cuts the row to 4.95 ms (3.43x faster)". The same change buys 4% on single rows and 3.43x on five-frame windows, and the page never says why. The reader cannot predict whether it helps their loader. The 5.16 figure is never used again.

3. **The measurement the ending prescribes is not defined.** "Set your run's data-loading time per step beside its update time." and "That is one worker building one batch of heavier rows, a different measurement from the guide's 0.015 s of loading per training step on its own dataset." The reader is never told whether `dataloading_s` is the GPU's wait for a prefetched batch or the time to build one. The two readings give different rules (any wait above zero means the GPU is starved, against "under a tenth of the update"). The reconciliation sentence is source bookkeeping standing in for that explanation.

4. **One paragraph ends in a circle.** "If steps per second rise when you add workers, the workers were setting the pace; if they stay flat, the limit is elsewhere: set the loading time beside the update time to tell the GPU from a slow read." It opened by setting loading beside update, called changing W the "firmer test", and then sends the reader back to the first test. "A slow read" is a third bottleneck the loader half never introduced.

5. **The title's answer is never computed, though every input is on the page.** With 12 physical cores per GPU, r = 59 rows/s and B = 32, the shortest update the cores can feed is 32 / (59 x 12) = 45 ms. One line like that would answer "How Many CPU Cores Keep a Training GPU Fed" for the heavy-row case. The page leaves the reader to assemble it.

6. **A curation rate with no GPU named.** "about 195 seconds per hour of video per GPU in streaming mode ... At that rate an illustrative 1,000 hours of video take about 54 GPU-hours". GPU-hours of which card? A reader sizing the G6e worked two paragraphs earlier cannot carry the figure over. "it is the nearest published rate we located" is research-process phrasing. The hedge is honest, but it reads as the writer's notes.

7. **Provenance in prose** (fault 5). "(the EC2 family beside each card is our pairing of the matrix with the EC2 tables)" repeats the "EC2 family (our pairing)" table header and the citation. "by our reading of its options, drops the clips that sit too close to another" is the same fault.

8. **The curation half drifts from the title.** The deduplication paragraph is definitions (embedding, K-Means, cosine similarity) whose only link to the CPU/GPU feed is its first sentence, "Deduplication never decodes the video again." The Spot paragraph is a pointer to section 24. Both sit at the same weight as the 17% utilisation finding, which is the curation half's real payoff.

9. **The header is awkward.** "Tell before you rent, and confirm from one short run, whether the CPU cores decoding your video or the GPU will set your training speed". Two clauses sit between the verb and its object, and "Tell" is weak.

10. **The keyframe material repeats doc-D.** "Count one training step ..." re-explains GOP and re-derives a 125x worst case that the collecting-data section already establishes. On this page it is correct and self-contained. Across the dive it is a second pass over the same mechanism.

---

## doc-C: 12. Physics Simulation: One Scene on a Core, Thousands on a GPU

- **Argument 8.** The first paragraph makes the claim (a sequential step suits a core; a GPU pays only with thousands of copies). Paragraphs two to four work 286x real time, 3.9 billion steps and 704 steps per copy. The ending's decision rule has no price.
- **Depth 9.** It gives the equation of motion with intuition, formula and decomposition, and a worked semi-implicit Euler step. It explains why contact makes the solve a search, why branching broad-phase hurts batches, and covers nconmax/njmax, the substep rounding trap (30 Hz becoming 28.6 Hz), the 4.0.0 solver fault, the Amdahl share and memory per world. A few configuration knobs are named without values.
- **Clarity 7.** Almost every term is built before use (state, timestep, model in its second meaning, contact, constraint, Jacobian, world vs environment). The implicitfast sentence and "accelerators run branching code poorly" leap past the reader.
- **Sentences 8.** Specific and consequential. Provenance of the team's own run is repeated four times.
- **Parity 9.** The best file in the batch.

### Findings, most damaging first

1. **The decision rule that ends the section has no price, and the crossover the title promises is never located.** "The batch is the buy when it delivers more steps per unit of price than those cores." and "No figure read on 2026-11-20 times one scene at several world counts, so the crossover for your scene is a measurement too". The header promises to "choose between CPU cores and a GPU batch". The page ends with "about a hundred X925 cores' worth" and no cost on either side, so the reader cannot divide. One illustrative instance price per side would close it. The second sentence is also research-process phrasing.

2. **A claim and its contrary quote are left unresolved.** "Physics memory does not bind at these counts; ... MuJoCo Warp's documentation warns that "simulation throughput is often limited by memory requirements for large numbers of worlds", and computation scales with the per-world limits too, so tight limits pay in steps per second." The reader cannot tell whether memory matters. Separate capacity (it does not bind at 4,096 worlds) from per-step memory traffic (it does, which is why tight nconmax/njmax pay).

3. **Provenance of the team's own measurement is repeated four times** (fault 5): "our measurement, a single run, with the humanoid standing in for the SO-101 arm, whose own scene was not measured"; "At the rate of our single run on one X925 core (DGX Spark, MuJoCo 4.0.1, humanoid stand-in)"; "In our single runs on the DGX Spark with MuJoCo 4.0.1"; and the chart caption. Say it once in a plain clause and let the citation carry the rest.

4. **Solver knobs are named without values or guidance.** "Playground's simulation config exposes the solver and its iteration limits as solver, iterations and ls_iterations (the line-search steps inside each iteration); the pick-cube task sets none of them, so MuJoCo's defaults apply." The defaults are not given. Nothing says when to lower iterations, the throughput lever a GPU user reaches for. "Line-search" is undefined.

5. **The contact caps have no failure mode.** "(nconmax=64 and njmax=256)" and "advises setting them as small as possible without the simulation exceeding them." The page never says what happens when a world exceeds a cap (contacts dropped silently, a warning, or an error). Without it the reader cannot judge the risk of the advice.

6. **The integrator recommendation is asserted and left incomplete.** "Each SO-101 joint is a position servo in the model, with a gain between 218 and 265 identified from the real arm, and the task is a grasp: that case exactly." The gain has no unit and no comparison that shows it is stiff. The advice to try discrete goes against the integrator both shipped files chose, without stating what discrete costs or whether MuJoCo Warp, the engine the page recommends for RL, supports it.

7. **The implicitfast mechanism is too dense for the reader.** "In the velocity line it rescales the acceleration by a matrix built from how the speed-dependent forces, such as damping, change with speed, which approximates an update that uses the acceleration at the new speed in place of the old one." One sentence carries the whole mechanism, with no intuition for why it is more stable (damping can no longer overshoot within a step). After the careful Euler build-up, this is a leap.

8. **The GPU-contact argument rests on an unexplained assertion.** "Accelerators run branching code poorly, and the broad phase branches on each world's positions, so the copies in a batch stop doing the same work." It needs the clause that GPU threads run in lockstep groups, so a branch taken differently serialises them.

9. **Vague where the page has a number.** "MuJoCo can simulate most robotic systems a lot faster than real time". The page has already worked 286x.

10. **An attribution-led sentence carries no fact.** "MuJoCo Warp, the rewrite for NVIDIA GPUs, is described as "resolving several performance bottlenecks exhibited in MJX-JAX"." It does not say which bottlenecks; name them or delete the sentence. "For Newton the Isaac Lab install guide says so in one line" is attribution padding of the same kind.

11. **The qualifier is separated from its estimate.** The 11-minute, 36-minute and 19-hour estimates are followed two paragraphs later by the 24% physics share that caps them. The Amdahl paragraph belongs beside the estimate.

12. **Reference-manual residue.** The release table ("ranked by how directly this arm uses them") includes Isaac Sim, which the arm's path never uses. The expandable "What each of the four stage groups computes" restates the mj_step paragraph. Both are demoted, so the cost is low.

---

## doc-D: 9. Collecting Data: What an Episode Weighs and What It Costs to Record

- **Argument 7.** The first screen makes the claim (the video is nearly all of an episode) and works 257 to 1 by paragraph two. "The ratio is paid for in computing, twice" is a real tool. The last block (person-hours, UMI, a hand-held data collection rig) is a second argument the header does not announce.
- **Depth 8.** It covers the seek-time formula, timestamps computed from the frame index (25 Hz recorded as 30 is 1.2x too fast), vcodec=auto silently switching codec, streaming encoding, the finalize() failure, the reset-time arithmetic and HiFi-UMI at 1.3 GB per camera-hour. The size side of the GOP trade and the encode load stay unquantified.
- **Clarity 8.** The best-built page for the reader. Parquet, codec, keyframe, GOP, CRF, HEVC and "encoder" in its second meaning are all built at first use.
- **Sentences 8.** Declarative and consequential. One reconciliation detour and a little provenance remain.
- **Parity 8.**

### Findings, most damaging first

1. **The size side of the GOP trade is left as homework.** "More keyframes buy that cheaper read with a larger file. The example dataset does not record its GOP, so to put a number on the size side for your own scene, record one episode at g = 2 and one at a long GOP and compare the two files." The page tells the reader to keep g at 2 and never says what that costs in bytes. The 2024 benchmark it calls "the source of the defaults" is used only to rank codecs. A trade with one side priced is half an argument.

2. **An overstated rule that contradicts the page's own fact.** "Its decoders decide whether AV1 is acceptable, and if it decodes on CPU cores, those cores pay for every frame of GOP you add". The page has already said "LeRobot decodes on CPU cores by default", and in software any machine decodes AV1. Hardware decoders decide only for software that calls them. As written, a reader may reject a P5 for training a stock LeRobot policy on AV1 data. "every frame of GOP you add" is also vague.

3. **A comparison the page has every input for and does not make.** "UMI's authors report that 3 people recorded 1,400 demonstrations ... which is 1,400 / 12 = 117 per person-hour" and "On that task the authors put the hand-held gripper at more than 3 times faster than teleoperation." The page's own arithmetic gives 50 episodes in 100 minutes (30 per person-hour) at defaults and 50 in 56.6 minutes (53 per person-hour) for the short-episode case. Setting 117 beside 30 or 53 would carry the claim. The authors' ratio is used instead.

4. **The encode half of the title stays qualitative.** The encoder table rates CPU use as "High", "Medium" and "Very low", and "In the sources read on 2026-11-20 the sizing stops at those two ratings". The page names the Jetson Orin Nano ("has no hardware video encoder") but never says whether its cores can SVT-AV1 encode two 640x480 streams at 30 fps. That is the question a reader with that board brings. The honest hedge is phrased as research process.

5. **The source-reconciliation detour runs too long.** "The current docs rate libsvtav1 "Smallest", where the 2024 benchmark found AV1's file the largest ... The two rankings can both hold, because a CRF of 30 is a different quality in each codec, and either way the default was chosen for the read." Two paragraphs resolve a doc-versus-benchmark conflict and end on "either way". The reconciliation is the writer's inference and is not marked as such. It could be one sentence. A related puzzle goes unexplained: "it loaded six consecutive frames in 0.48 times the time the images took". Video loading faster than images runs against the decode-cost intuition the page built, and needs a clause of why.

6. **The second argument is not tied to the first.** The header description covers compression only ("set the compression at the bench knowing that every later reader of the data pays for it"). The final block ("At the recorder's defaults, a person-hour at the bench buys at most half an hour of data") is a separate argument about labour and rigs. The one bridge, "Disk aside, what a recording costs at the bench is those CPU cores and a person.", sits in the opening. The section reads as two good sections joined.

7. **A fact without a use.** "The file count therefore follows the bytes far more than the episodes." The paragraph proves it but never says what a file count costs the reader (object-store requests, listing time, Hub limits). Without that, the v2-to-v3 contrast is a fact with no consequence.

8. **Prose about the page.** "(Through section 11, encoder means the video compressor, not section 3's angle sensor on a joint.)" The disambiguation is needed, but it is phrased as page scoping. "From here, encoder means the video compressor" says the same without the section bookkeeping.

9. **Provenance with no reader payoff.** "Its metadata records the robot type as so100_follower, which LeRobot uses for both the SO-100 and the SO-101, so the files do not prove an SO-101 recorded it." This is bookkeeping about the example and changes nothing the reader does.

10. **The ending is diluted.** The section lands well on "Then record one episode and check it ..." and then appends a different scenario: "Before you pick a machine to train on a dataset someone hands you, open meta/info.json and read video.codec for each camera; the public dataset says av1." The last word should be the first-episode check.

11. **Decorative captions.** "The same simulated episode from an overhead camera and a camera on the gripper. Each camera becomes its own video file in the dataset, and these two streams are what a policy receives as its images." The frames are simulated, not from the dataset, and add little the text has not said.

---

## Batch answer

**Groups by quality alone.**

- **Upper group: C, B, D.** All three open on a claim, work a number by the second or third paragraph, build each term before using it, and turn mechanisms into settings the reader can change (substep rounding, nconmax, the W >= B / (r x u) inequality, vcodec=auto, reset_time_s). C sets the bar. It runs intuition, then formula, then decomposition, works one integration step with small numbers, and sets measured and vendor rates side by side with explicit order-of-magnitude limits. D is the cleanest for the target reader. B is the densest. B and D cannot be told from C by quality. Their gaps are individual missing steps (a mechanism, a priced side of a trade), not a weaker register.
- **Lower group: A.** It opens on a taxonomy and a tour of the page (families, levels, stacks). Its one thesis is tagged "our reading" and withdrawn in the next sentence. It carries 19 "our reading" clauses and 22 section cross-references. It contains no worked arithmetic, and every cost is deferred to section 23. It lists options by count ("nine values", "six techniques") instead of deciding between them, and it gives a Region discrepancy the weight of a configuration choice. These are faults 1, 2, 3, 5 and 6 of the owner's list, at a rate the other three files do not show.

**Would a careful reader tell them apart by quality alone?** Yes. A is distinguishable from B, C and D within its first screen: B, C and D open with an argument and a worked number, and A opens with a definition, a count and navigation. Within B, C and D, a careful reader would not reliably separate them by quality.

**Verdicts.**

- **A: distinguishable: weaker.** It tours instead of arguing, its voice is bookkeeping, it works no numbers, and it lists configuration options rather than deciding between them.
- **B: not distinguishable by quality from the best files.** It is argument-first, and its formula is derived and worked on measured rates. The physical-core step and the measurement it ends on need a mechanism.
- **C: sets the bar.** It has the deepest mechanism and the best formula handling, with a decision rule on the first screen. Its ending lacks a price.
- **D: not distinguishable by quality from the best files.** It builds terms best and has strong practical failure modes. The GOP size side is unpriced, and the section joins two arguments.

The upper group shares some weaker habits at a low rate: own-run provenance repeated in the prose (C), research-process phrasing such as "read on 2026-11-20", "we located" and "the sources read" (B, C, D), and decision rules left without a price (C, D). B and D also explain keyframes and work the GOP 2 versus 250 (125x) comparison twice across adjacent sections.


Key to the blind file names: doc-A feedback dive AWS section; doc-B this dive section 10 (round 3); doc-C this dive section 12 (passed round 1, bar); doc-D this dive section 9 (round 3)
