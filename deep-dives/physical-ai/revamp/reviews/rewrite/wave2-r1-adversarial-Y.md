# Adversarial review, batch w2r1, input inY

| File | Argument | Depth | Clarity | Sentences | Parity | Verdict |
|---|---|---|---|---|---|---|
| doc-A (One Arm, Fifteen Workloads) | 6 | 6 | 6 | 6 | 5 | distinguishable: weaker |
| doc-B (Rendering and Ray Tracing) | 8 | 9 | 7 | 8 | 7 | not distinguishable by quality from the best files (one unfinished placeholder block aside) |
| doc-C (What RL Does to a Model) | 8 | 8 | 7 | 7 | 8 | not distinguishable by quality from the best files |
| doc-D (Sim-to-Real and Real-to-Sim) | 9 | 8 | 8 | 8 | 8 | sets the bar |
| doc-E (Physics Simulation) | 9 | 9 | 8 | 8 | 9 | sets the bar |

---

## doc-A: "1. One Arm, Fifteen Workloads: What Each One Runs On"

Scores
- Argument 6: the two-question thesis is on the first screen, but the only worked proof is on a stand-in program, and the claim the page cares most about (CPU cores starving a training GPU) is asserted, never counted.
- Depth 6: real numbers (25.2 MB, 11.71 GB/s, 465 vs 390 passes, 62.3% stalls, 149.0 ms, 24 vCPUs per GPU, 199 trials), but the two bottlenecks named as easiest to buy wrong get no count at all.
- Clarity 6: three numbering schemes on one page (stages 1-8, workloads 1-15, section numbers), stacked appositives, and definitions dropped in ahead of their use.
- Sentences 6: many are specific, but the page counts and grades itself ("in our reading", "make the fifteen of the table") and ends on a tour of other sections.
- Parity 5: shows the owner's fault family (count-led title, taxonomy, bookkeeping, tour) where the other four files carry one argument through.

Findings, most damaging first
1. "Split every stage that way and the eight stages become twelve workloads; three more, run only at vendor scale, make the fifteen of the table." This is the page explaining how it reached its own count. It is the "Fifteen is our reading" fault almost word for word. The reader gains nothing from knowing that 8 became 12 became 15. Cut it, and stop leading with the count.
2. Title, "One Arm, Fifteen Workloads: What Each One Runs On", and first sentence, "Fifteen computing jobs stand behind one small robot arm learning one task, and they share the arm and almost nothing else." Both open on a count, the "eight stages, five uses" pattern, and the title echoes the rejected "One Robot, One Loop". The thesis is the two questions from the header description, and it belongs in the title.
3. "A program small enough to count by hand stands in for it, to show the method (its figures are not the policy's)". The page's one worked count is on a toy that touches none of the fifteen workloads. Then "The same three terms size the arm's own policy on its GPU: what one call reads and computes, calls per second, and what that machine delivers." That is a promise the page never keeps: the policy is never counted. Fix: apply the count to the arm's real policy (weight bytes per call against the robot computer's GB/s), next to NVIDIA's 149.0 ms.
4. "CPU code writes it and CPU code reads it back, and the H100, the GPU of EC2's P5 training instances, cannot hardware-decode it." and "Those cores are the part bought by accident, and the first thing to check on a training run whose GPU sits idle." This is the page's strongest practical fact. It arrives about two-thirds of the way down (buried thesis), and the page's own method is never run on it: no AV1 frames per second per core set against the samples per second a GPU trains on. Without that count, "often a CPU core" stays an opinion.
5. "On-robot inference can be limited by the same memory the six-matrix program ran into". "Can be", with no number. The page names it as one of the five easiest to buy wrong, and gives neither the model's weight size nor the device's memory bandwidth.
6. "The policy on the arm has a deadline." Then the call is shown at 4.5 periods and still drives the arm, and then "So the computer beside the arm is sized by a deadline, in milliseconds per call." The reader never learns what the deadline is: 33.3 ms? The 1.33 s a chunk lasts (it surfaces only in the FAQ)? The 37 mm of staleness? The argument contradicts itself until one number is named as the constraint.
7. "comes down to three properties: duration, ...; coupling, ...; and interruptibility". The fifth shape, "On the robot's clock ... cannot be interrupted at all", is defined by a deadline, and a deadline is not one of the three properties. The taxonomy does not follow from its own axes.
8. The group header "Independent units. A lost machine costs one unit. In the cloud: a queue that retries, with Spot open." sits above row 11, whose cell says "the build runs on the device it is for, outside any queue." The row contradicts the group it is filed under.
9. "(section 20, Fifteen Workloads, Five Shapes, names the part for every row with the figure behind it, and section 21, Reading a Machine, shows how to confirm a part on the processor's counters)" and "(sections 24 to 29, starting at Orchestrating Physical AI on AWS, take each scheduler in turn)". The closing block tours the dive. With "Choose the instance for that part. Then ask what work is lost..." it ends by restating the opening, so the payoff does not land.
10. "Whichever of its three ingredients fills first: physics, simulated cameras or policy inference." In a column titled "The part it exhausts first", this is a non-answer.
11. Two numbering schemes collide: the diagram's "4. Simulate" and the table's "4. Dataloader decode and augment". The table rows are also printed out of numeric order (2, 3, 5, 6, 7, 10, 11, 13, 4, 8, ...), so the numbers serve no purpose and the reader cannot match them.
12. "NVIDIA reports a median of 149.0 ms for one call of GR00T N1.7, its robot model, on a Jetson Orin, one of its onboard computers for robots, with TensorRT, its inference compiler and the fastest runtime in its table for that device." Four stacked appositives bury the number. Split the sentence.
13. "Augmentation multiplies an episode into variants, and a world model is a model that predicts what the scene becomes after an action." Two glossary entries stapled together, connected to nothing around them.
14. Bookkeeping in prose: "if that sweep is the most this core's memory delivers (our reading)", "Five of the fifteen are, in our reading, the easiest to buy wrong", and the caption's "(in our reading)". Say it once, in one plain clause, or move it to the citation.
15. "Around it, one job compresses video on CPU cores, one traces rays on a GPU, one multiplies matrices for hours, and one has to answer inside a tick of the arm's clock." A four-item list used for cadence, and "a tick of the arm's clock" is not defined until twenty lines later.
16. "Which GPU does simulation need? None for one scene's physics ..." The answer leaves out the batched GPU physics that the page's own table row 6 assigns to "GPU general compute".

---

## doc-B: "13. Rendering and Ray Tracing: Why Simulated Cameras Pick the GPU"

Scores
- Argument 8: claim in the title and first paragraph ("the renderer can rule out the GPU the trainer wants"), and a number by paragraph four; every later section proves part of it.
- Depth 9: BVH walk as the unit that decides the hardware, the ray-count product, a 6.2 ms to 465 ms extrapolation flagged as one, memory per environment across tasks, a ceiling/floor argument for scaled estimates, Capacity Blocks versus ODCR, and a measurement recipe.
- Clarity 7: the first three paragraphs give the whole conclusion in terms (ray tracers "written as ordinary GPU code", Warp, Newton, headless) that the page only builds later; product-name density is high.
- Sentences 8: specific and consequential ("The rule reaches as far as Isaac Sim and RTX rendering, and no further."), with a little repetition.
- Parity 7: the prose is at the bar, but a visible "to be recorded ... Until then" placeholder would mark the page as unfinished to any careful reader.

Findings, most damaging first
1. "Capture slot, dated 2026-11-20 / What will be shown here: Isaac Sim capture of the SO-101 scene, to be recorded on our own machines: the same scene drawn by a ray-traced renderer, with shadows and reflections. / Until then: MuJoCo's own renderer, which rasterises, drew the colour, depth and segmentation frame of the arm." Draft scaffolding on the reader's page, and page history ("Until then"). Remove the slot, or ship the capture.
2. "Ray tracers written as ordinary GPU code, the kind MuJoCo Warp and Isaac Lab 3.0 ship, ask for no RT cores in their documentation, which stops short of naming a training GPU as supported." This sits in paragraph three, before the page has said which step of ray tracing RT cores accelerate (the BVH walk, about 60 lines later). The reader is handed the rule before the mechanism that makes it make sense. "Warp" is defined only at "Newton Warp is a ray tracer built on Warp, NVIDIA's compiler from Python to GPU code", long after "MuJoCo Warp" and "the Warp path" are in use.
3. The opening works as an abstract that the body then re-proves. The Isaac Sim A100/H100 rule appears in paragraph 1, in paragraph 2, in "Isaac Sim carries the requirement into every job it runs ...", in the renderer table, in the expandable and in the closing. The headless-Newton point appears four times. Landing the strongest number twice is fine; restating a conclusion six times reads as a draft that summarised itself first.
4. "NVIDIA's memory figures are one total per row for the whole training process, learner included, so where the rest of the megabytes sit is not published." The number that sizes the card (1.7 to 7.8 MB per camera environment, about 140 times the image) is left unexplained. The page shows the pixels do not account for it, but it does not reason about what plausibly does, such as rollout storage of observations across the update horizon or renderer buffers. Honest scope, but it stops short of level 400 on the page's own key quantity. The two-run measurement recipe at the end partly makes up for it.
5. "Isaac Lab 3.0 offers three renderers. Newton Warp is ... The other two are RTX renderers: OVRTX, ... and Isaac RTX, which runs inside Isaac Sim and is labelled legacy." With PhysX, Newton, Warp and MuJoCo Warp in the next paragraphs, the level 100-200 reader is juggling seven product names. A one-line map (engine, renderer, application) before this paragraph would hold them.
6. "the Isaac Lab authors found a camera that casts its rays with Warp to be faster at low resolutions, and their tiled RTX camera faster at higher ones". No crossover resolution is given, so "its speed turns on image size" cannot be acted on.
7. "G; P by our reading, with no vendor statement for the P-family GPUs located". Bookkeeping inside a table cell; "P untested by any vendor" says the same thing.
8. The 16 x 12 note is printed three times in one figure: the label "Drawn at 16 x 12 pixels so each one shows", the step-1 text, and the caption.
9. "On aarch64, the Arm processor architecture, Isaac Sim 6.2.0 supports only NVIDIA's DGX Spark desktop machine, so Graviton, AWS's Arm processor family, is not on its list." A trivial limit given the same weight as the family-deciding facts around it, though it is in an expandable.

---

## doc-C: "10. What RL Does to a Model"

Scores
- Argument 8: by paragraph two the page states the thesis (RLVR mostly sharpens; a frozen model can buy part of it back at 8.84 times the tokens) and gives the tool (the pass@k crossing), then proves it study by study.
- Depth 8: crossings with real figures (28%/4% versus 40%/30%), question-level counts (175 lost, 48 gained), an information argument (320,000 bits against about 3M adapter parameters), a contamination test, a priced sampler. The per-query versus once-in-training price is never made into a break-even figure.
- Clarity 7: LoRA, rank-1 and MCMC are named but not explained on the page; "the words track" is dive jargon; pass@k is used once before it is defined.
- Sentences 7: precise, well scoped hedges, but "Our reading" opens or tags eight separate sentences, and the page talks about itself several times.
- Parity 8: same argument-first shape and density as the best files here; its faults are fixable at sentence level.

Findings, most damaging first
1. The headline buy-back figure fails the page's own trust check. "On Qwen2.5-Math-7B and MATH-500 it scored 0.748, against 0.496 for the base model and 0.785 for GRPO trained on MATH" is the sampler result behind the opening claim "a training-free sampler nearly matched the single-shot score of GRPO ... on a math benchmark". It is on the exact model and benchmark the trust check flags as contaminated. The page applies that caveat to the prompt result ("Our reading: the contamination result in the trust check concerns the same model and benchmark, so it applies to this gain too.") and not to the sampler. Either apply it here too, or lead with the sampler's result on a non-Math family, which the page says was tested.
2. Bookkeeping in prose, eight times: "Our reading of these studies: RL sharpens by default", "Our reading: a model that samples nearly the same answer", "Our reading: the three disagree about sparsity", "Our reading of these studies turns the three checks into questions:", "Our reading, from the definition of pass@k:", "Our reading: the contamination result", "Our reading, which sets the choice:", "(our reading)". The owner's rule is one plain clause, once. Here the label is a verbal tic.
3. "The studies read tested four routes" against the table title "Three ways to buy sharpening back per query". The prose gives four (perfect-verifier best-of-K, power sampling, trigger prompt, learned verifier) and the table merges two. Pick one count.
4. "This section answers the dive's first question: what RL does to a model." Prose about itself, in the opening paragraph. Also "The key reads the curves from left to right.", "Marker 4 in the diagram above is that ceiling.", and "the model-family caveat of the trust check below".
5. "Our reading, which sets the choice: inference-time sharpening is paid on every query, where RL is paid once in training and then served at the normal price." The header description promises "at what price", but the page never turns 8.84 times the tokens into a break-even query count against a training run. The price comparison is handed off to section 23.
6. "It uses MCMC (Markov chain Monte Carlo) to resample blocks of tokens according to their base-model likelihoods". The expansion is a name, not an explanation. The reader needs one clause on what the chain does (propose a rewrite of a block, keep it with a probability set by the sharpened likelihood). Likewise "rank-1 LoRA matched full fine-tuning" and "through a LoRA adapter, section 3": LoRA and rank are never explained on the page.
7. "Our reading of these studies turns the three checks into questions:". What follows are three statements, not questions.
8. "A crossing marks sharpening". A crossing marks lost coverage (the diagram's own marker 3: "RL narrowed its coverage"). Pure sharpening inside the set predicts curves that converge at large k without crossing. At level 400 the two should not be conflated.
9. "...and the words track from section 14, A Text Loop Is RL on the Context, onward takes up what a loop can learn". "The words track" is unexplained dive structure, and the last sentence ends on a tour instead of on the reader's action, which the sentence before it had already landed.
10. "against about 3M parameters in a rank-1 LoRA adapter on Llama-3.1-8B". The inference (capacity exceeds the information, so rank 1 is enough) is left for the reader to draw. State it.
11. "the base model solved about 9% more problems than the RL model at k = 128". Is that percentage points or relative? It matters at the scale of the gap.
12. "performance traded against entropy on a fitted curve". Which curve? The form is the mechanism; give it or drop "fitted".
13. The table cell "Helped Qwen2.5-Math and Qwen2.5-1.5B" introduces Qwen2.5-1.5B, which the prose never mentions.
14. Literature-review register in "What changes in the weights" and its expandable: "One study ...", "A second paper ...", "A third found ...", with "Optimiser state was not analysed in any of the papers read." given the same weight as the finding that decides how to read a sparsity figure.

---

## doc-D: "14. Sim-to-Real and Real-to-Sim: Widen the Simulator or Measure the Arm"

Scores
- Argument 9: "A simulator is a set of typed-in numbers, and a policy trained in one learns those numbers along with the task." The first screen sets the choice (widen or measure) and where each is paid for, and the page carries that choice to an ordered bench procedure.
- Depth 8: the PD cap saturating below one degree (2.94 / 218 = 0.0135 rad), the 12 V versus 7.4 V servo mismatch (1.8 times), the randomisation objective decomposed, the excitation-episode design derived from each constant's role, and PolaRiS's r = 0.9 with its sample size. The ranges themselves are missing.
- Clarity 8: both formulas follow the intuition-symbols-formula-decomposition order; terms are built before use; a few undefined dataset names.
- Sentences 8: many strong ("A scan measures the look of a scene and the shape of its surfaces, and nothing of how they push back."), with one ambiguity and some listy descriptions.
- Parity 8: at the bar; its ending is the best in the batch.

Findings, most damaging first
1. "Where a row gives no number, the scale factor is set in the task's task.py, the file to read before you widen any of them." The section's subject is ranges against the bench, and its randomisation table gives almost no ranges: gain scale, damping scale, fingertip friction, cube half-extents and the joint-reading bias are all unquantified. The page cites "SO-101 task.py, resetters" for every one of them, so the numbers were in hand. Put them in the table.
2. "The guide sizes it only in words". The guide does, but the code that the page cites sizes it in radians. Converting that bias to millimetres at the gripper and setting it against "10 to 20 mm or more" would be the section's sharpest number, and it is the one the calibration argument needs ("The rest of a hand calibration's error has to fall inside a second range.").
3. "The checked-in values came from teleoperation data on someone else's arm, and no spread between arms was found." This reads as "the spread was measured and is zero". The intended meaning is that no figure for the spread was located. Preserve the scope of the hedge.
4. "If the changes are found by re-simulating with each constant nudged in turn, one step costs 24 + 1 = 25 replays of the episode" and, in the cost table, "The README publishes no timing." A conditional about the method, and no compute figure, in a section headed "What each fix costs". An estimate from episode length, 200 steps per simulated second and a single-core step rate would give the row a number.
5. The description "The servos, joints, fingertips, calibration, timing, camera and cube each meet a measured constant, a randomised range or both, and the command delay is the one range you can check against your own arm". It opens on a seven-item list; the payoff is the clause after it.
6. "reports averages on one RTX 5090 on the NeRF Synthetic and MipNeRF360 scene sets: 479 s and 2,869 s for its ray-traced method, 215 s and 686 s for its rasterised one." A reference-manual table cell. The scene sets are never explained, and the reader needs only the 2.2 to 4.2 times ratio and "under an hour". The DrEureka quadruped figure in the row above is similarly off-axis for this arm.
7. "placing the block in the cup is this dive's extension". The page talks about the dive.
8. "In a post of 2026-09-09 on one engagement, AWS reports". "On one engagement" is consulting jargon that tells the reader nothing about what was tested.
9. Missed connection: "small corrections near the target for the gain" is right, and the reason is the page's own finding that the spring term saturates at 0.0135 rad. Saying so would tie the excitation design to the saturation finding.

---

## doc-E: "12. Physics Simulation: One Scene on a Core, Thousands on a GPU"

Scores
- Argument 9: the first paragraph gives the mechanism (a step is a short ordered chain whose work depends on contacts), the second gives the decision rule and a measured number (57,240 steps per second, 286 times real time), and the page closes on the measurement that settles the reader's own case.
- Depth 9: the equation of motion with every symbol built first, semi-implicit Euler with redoable numbers, why constraints make the solve a search, the period-rounding pitfall (33.3 ms becoming 35 ms), nconmax/njmax as reserved worst-case memory, the integrator choice tied to this arm's servos, the 4.0.0 solver fault, and an Amdahl check on physics' share of training.
- Clarity 8: built from state upward; a few mechanisms are asserted rather than shown (branch divergence, implicitfast).
- Sentences 8: specific and consequential ("Speeds belong in it because an arm at rest and an arm swinging through the same pose are in different places a moment later."), with one self-contradicting pair.
- Parity 9: the strongest file in the batch.

Findings, most damaging first
1. "the RL recipe's 3,932,160,000 physics steps would take about 11 minutes on the GPU batch". The GPU rate is the 8192-world figure, and the recipe runs 4,096 arms ("runs 4,096 simulated arms side by side"). A batch half the size will not run at the same throughput, and the page does not flag the mismatch the way it flags the machine and version differences.
2. "with the humanoid standing in for the SO-101 arm, whose own scene was not measured". Yet a caption shows the SO-101 model loaded in MuJoCo 4.0.1 on the same date ("Capture: MuJoCo 4.0.1, offscreen renderer; 2026-11-20; ... SO-101 model"), and the closing tells the reader to run testspeed on their own scene. The page about this arm prices this arm with a humanoid it could have replaced with one command.
3. "Accelerators run branching code poorly, and the broad phase branches on each world's positions, so the copies in a batch stop doing the same work." This asserts the mechanism without showing it. The level 100-200 reader is not told that GPU threads run in lockstep groups, so a divergent branch makes the group run both paths. That one clause is what makes "stop doing the same work" cost time.
4. "Capacity does not bind at these counts. MuJoCo Warp's documentation warns that "simulation throughput is often limited by memory requirements for large numbers of worlds"". Read in sequence, the second sentence contradicts the first. The reconciliation (per-world limits drive compute as well as memory) is folded into a trailing clause. Lead with it.
5. "In the velocity line it rescales the acceleration by a matrix built from how the speed-dependent forces, such as damping, change with speed, which approximates an update that uses the acceleration at the new speed in place of the old one." Dense, and it never says why this matters here: this arm's stiff term is servo damping (the kd of each position servo), which is exactly what the implicit velocity update stabilises.
6. "the pick-cube task sets none of them, so MuJoCo's defaults apply." It does not say what the defaults are (which solver, how many iterations), even though these are the knobs it has just named for a reader who has to tune them.
7. "The batch is the buy when it delivers more steps per unit of price than those cores." and "buy CPU physics by the speed of one core, then by the number of cores". The page ends on a price comparison and gives no price and no instance type for either side.
8. The heading "Each stage of a step waits for the one before, and contacts turn the force stage into a search" and its description "...and see why contact turns a direct calculation into a search" say the same thing twice.
9. "MuJoCo can simulate most robotic systems a lot faster than real time". "A lot" is vague on a page that elsewhere gives 286 times.

---

## Batch answer

Groups by quality alone
- Group 1, sets the bar: doc-E and doc-D. Each opens on a claim that carries a mechanism, works a number on the first screen, builds every term before the formula that uses it, decomposes each formula against the intuition, names failure modes tied to configuration (period rounding, nconmax/njmax, FORCERANGE, the transport delay check), and ends on an ordered procedure. Their faults are single missing numbers (D's ranges, E's own-scene timing), not faults of shape.
- Group 2, at the bar with fixable faults: doc-B and doc-C. B has the deepest number work in the batch, but carries a visible placeholder and an opening that front-loads the conclusion in terms built later. C is argued as well as Group 1 but labels its own inference ("Our reading") eight times, talks about itself, and lets its headline buy-back figure escape its own contamination check. A careful reader would not rank these below Group 1 on writing. They would notice B's placeholder as unfinished work, which is a fault of finish rather than of writing.
- Group 3, weaker: doc-A. It has the owner's fault family: a count-led title and first sentence, a paragraph on how the page arrived at fifteen, "in our reading" in prose, a method demonstrated only on a stand-in while the two bottlenecks it calls easiest to buy wrong go uncounted, a self-contradicting "deadline", a taxonomy whose fifth shape is not defined by its own three properties, a fifteen-row table at equal weight under clashing numbering, and an ending that tours sections 20, 21 and 24 to 29.

Can a careful reader tell them apart by quality alone? Yes, for one file. doc-A reads as a weaker, more catalogue-like piece than the other four, whatever the topic. doc-B, C, D and E are not separable by quality; their remaining faults are sentence-level or single omissions.

Verdicts
- doc-A: distinguishable: weaker. Taxonomy and self-bookkeeping in place of a counted argument; the load-bearing claims are uncounted.
- doc-B: not distinguishable by quality from the best files. Argument and depth at the bar; remove the capture placeholder and thin the abstract-first opening.
- doc-C: not distinguishable by quality from the best files. Argument-first and precise; strip the repeated "Our reading", apply its own trust check to the sampler result, reconcile four routes with three.
- doc-D: sets the bar. Clear choice carried to a bench procedure, level-400 servo findings; add the randomisation ranges from task.py.
- doc-E: sets the bar. Mechanism, formulas and configuration pitfalls built in order for the newcomer; flag the 4,096 versus 8,192 batch mismatch and time the SO-101 scene itself.


Key to the blind file names: doc-A this dive section 1 (published pilot); doc-B this dive section 13; doc-C feedback dive What RL Does; doc-D this dive section 14; doc-E this dive section 12
