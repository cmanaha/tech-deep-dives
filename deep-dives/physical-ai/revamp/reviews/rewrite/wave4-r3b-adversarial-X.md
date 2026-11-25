# Adversarial review, batch w4r3b, set X

| File | Argument | Depth | Clarity | Sentences | Parity | Verdict |
|---|---|---|---|---|---|---|
| doc-A | 6 | 5 | 4 | 6 | 5 | distinguishable: weaker |
| doc-B | 9 | 9 | 7 | 8 | 9 | sets the bar |
| doc-C | 8 | 9 | 8 | 7 | 8 | not distinguishable by quality from the best files |

Quotes are verbatim from the rendered text. Where a quote contains math, the doubled rendering (Unicode plus plain) is collapsed to one copy. Fixes that draw on facts from outside the page are labelled [SPECULATIVE: reviewer's knowledge, not checked]; everything else is derived from the page itself.

---

## doc-A: "Thesis and Framing"

Scores
- Argument 6: the thesis and a worked ratio land in the first three paragraphs (412 FLOP per byte against 2 to 10), then the page turns into a tour of architectures and closes on a table of contents.
- Depth 5: only the data leg of the "triangle" gets a mechanism and a number; the instruction and shape legs get one figure each (10 to 14 cycles, 16 rows of 64 bytes) and no consequence.
- Clarity 4: for the level 100 to 200 reader roughly twenty terms arrive as names only (warp, SM, BTB, out-of-order, speculatively, NEFF, SBUF, PSUM, TMEM, tcgen05, systolic array, tensor core, kernel, prefill, KV cache, 2:4 sparsity, p99.9, CS-3, MRDIMM, LPDDR5X, CXL).
- Sentences 6: some are excellent ("Doubling peak FLOPS does nothing for it", "One decode step crosses two kinds of silicon"); many are lists of named things with no consequence.
- Parity 5: set beside B and C it reads as an earlier draft: it opens on itself, tours, and asks the reader to bring the concepts.

Findings, most damaging first

1. Title: "Thesis and Framing". It names the page's role in the dive, not what it proves. It is the same fault as the owner's "One Robot, One Loop": a reader cannot tell what the section claims. Fix: title the claim, for example "Decode waits on memory: one ratio from the spec sheet predicts it".

2. "This deep dive gives you a way to predict how an inference workload will run on a chip before you benchmark it." The first sentence is about the page, not the subject (fault 4). The header description does the same ("any chip in this dive"), and so does "Each architecture in this dive is a different answer to keeping the three aligned." Fix: open on the claim the second sentence already holds: "Every operation waits on three deliveries at a functional unit, an instruction, its operands and their layout, and decode waits on the operands."

3. "The question to bring to every chip, and where the dive answers it" (sub-heading description) and the paragraph under it: "Roofline and Arithmetic Intensity computes ridge points across chips and precisions. Memory Hierarchy Primer and Anatomy of a Kernel Execution walk the tiers; HBM and the Bandwidth Wall, DDR5, MRDIMM, LPDDR5X and CXL, High Bandwidth Flash and Flash as a Cache Tier for Inference take the ones that hold weights and KV cache..." This is a table of contents in prose, which is the "tour of the page" the owner named (faults 1 and 4). It also brings in four acronyms it never expands. Fix: cut the paragraph. Keep the question and the final paragraph, which already end on the reader's next action. Navigation belongs in the navigation.

4. "Three things must reach the unit in the same cycle: the instruction, the data, and the shape of that data." The thesis's own metaphor breaks on its third leg. A shape is not delivered. It is a property that must match, as the "Shape fit" paragraph then says ("must match what the unit consumes"). A careful reader notices that the "three deliveries" are really two deliveries and one fit condition. Fix: say it as two deliveries and a fit, or define shape delivery as the data arriving already laid out in the tile the unit consumes, and keep that wording throughout.

5. "Across chips the spread is wider. Arm Neoverse host cores, x86 cores with AMX tiles, NVIDIA Hopper and Blackwell GPUs, AWS Trainium and Inferentia, Cerebras wafer-scale engines, the Groq LPU (Language Processing Unit), the SambaNova RDU (Reconfigurable Dataflow Unit) and compute-in-memory devices each place a different bet on how instruction, data and shape reach the unit." A nine-item list whose only predicate is "place a different bet" (fault 2). Nothing in it changes what the reader predicts. Fix: cut it, or keep two chips and state each one's bet as a consequence, for example the wafer that keeps weights in on-chip SRAM, with the bandwidth that buys, against the GPU that streams them from HBM.

6. The three "delivery" paragraphs are a reference-manual tour (fault 6). For example: "A GPU SM (Streaming Multiprocessor) issues from a warp scheduler and hides a stalled warp's latency by running other warps." and "On Trainium it is SBUF (State Buffer) and PSUM (Partial Sum buffer)." and "Blackwell's tcgen05 instructions read TMEM in fixed data-path layouts." Each sentence names a mechanism on one chip and stops. "warp", "systolic array", "tensor core" and "tcgen05" are never explained, and SBUF, PSUM and TMEM are expanded but never said to be anything (size, speed, who fills them). "48 kB of local SRAM" and "16 rows of 64 bytes" sit at the same weight as the fact that decides decode. Fix: keep one chip per delivery and carry each to a consequence the reader can use, for example what a stalled warp costs and how many warps hide it. Explain each term at first use, or move the tour to the sections that cover those chips.

7. "A GPU vendor ships the thesis. ... Within decode, LPX runs latency-sensitive work such as the MoE expert FFNs (feed-forward networks), while Rubin GPUs keep prefill and decode attention over the KV (key-value) cache." The evidence is asserted, not argued. The page never says why the split falls there, and the number that would make the case is missing: the SRAM bandwidth that the 500 MB buys, set against what HBM delivers. "prefill" is never defined. "KV cache" is expanded but not explained. Fix: one sentence of mechanism, for example that expert weights are read once per token at very low FLOP per byte and fit in SRAM, while attention needs the capacity of HBM for a cache that grows with context, with the bandwidth figure cited. Define prefill where decode is defined in paragraph 1.

8. "an MoE (mixture of experts) model reads the experts each token selects" is set up and then dropped. The intensity arithmetic ("Each weight feeds one multiply-add per sequence in the batch, so with 8-bit weights at batch 1 to 5, decode sits at 2 to 10 FLOP per byte") holds for a dense model only. In an MoE model the tokens of a batch can select different experts, so batching does not raise intensity in the same way. The page does not say so. "mixture of experts" is also left unexplained. Fix: one clause scoping the 2 to 10 to dense weights, and one saying which way MoE moves it.

9. "Doubling peak FLOPS does nothing for it; doubling bandwidth roughly doubles tokens per second until a fixed latency floor sets the step time." "a fixed latency floor" is undefined. The reader cannot tell what sets it or at what bandwidth it arrives. Fix: name it (per-step launch and synchronisation overhead, or whatever the source says) and give its size, or cut the clause.

10. "A chip that leads on peak FLOPS can lose to a slower one that makes the three deliveries more consistently on the target workload." A claim with no proof, though the page already holds the numbers to prove it. Fix: work it: on decode at 2 to 10 FLOP per byte, a chip with half the H200's FLOPS and twice its bandwidth runs about twice as fast.

11. Run-in labels in the prose: "Reading a spec sheet for inference.", "The anchor number.", "Sparse aside:", and later "work out its FLOP per byte the way the anchor number does". This is bookkeeping about the page's own parts. The last one makes the reader remember a label rather than the method. Fix: drop the labels. End on "divide the workload's FLOPs per token by the bytes it reads per token".

12. "Heterogeneity is the organizing fact". The sub-heading names a taxonomy, not a result (fault 3). Its description ("The workload decides which delivery binds...") is the real claim. Fix: promote the description's claim into the heading.

13. "A payments ledger (branchy code, a working set in L2 and L3) lives on the front end: branch-prediction accuracy and L3 hit rate set its speed, and the tensor cores sit idle." A payments ledger has no use for tensor cores, so "sit idle" contrasts nothing. Fix: contrast the bottleneck itself: the ledger waits on branch prediction and L3, decode waits on HBM, and adding memory bandwidth to the ledger buys nothing.

14. "An HFT (high-frequency trading) matching engine judged on p99.9 tick-to-trade latency, a RAG (Retrieval-Augmented Generation) pipeline judged on tokens per second per dollar and a training run judged on time to convergence bind on different deliveries, and often land on different silicon." This is a three-item triad that never says which delivery each one binds on, so it asserts rather than shows. RAG and p99.9 are not explained. Fix: name the binding delivery for each, or cut to one example worked through.

15. Expandable "Check that the mechanism exists before you port a tuning result": "A model larger than one wafer is split at layer boundaries across several CS-3 systems." This has nothing to do with the heading, and CS-3 is undefined. Fix: cut it.

16. "a rate that applies only to weights pruned to the 2:4 structured pattern". The 2:4 pattern is not explained. Fix: "two of every four weights set to zero".

---

## doc-B: "22. Our Measurements: The Speed-Up Depends on the Part That Runs Out First"

Scores
- Argument 9: the claim is in the title and the first sentence. Two sentences later it is shown with numbers (2.0 against 4.0 inside the Spark), and every later block tests it or limits it.
- Depth 9: the counters, the formulas, a worked recomputation from raw counts, multiplexing, a self-check of core width, a known bias in the formula with its size bounded, and a command to rerun it. The GPU section is the one thin block.
- Clarity 7: every term is built before use (slot, micro-operation, the four shares, card, TLB, PMU), but the opening paragraph is overloaded and a few sentences are too compressed to parse on first read.
- Sentences 8: specific and consequential ("A split that changes sides at the same speed cannot say where the time went"); a handful are knotted.
- Parity 9: the best argued file in the batch.

Findings, most damaging first

1. Placeholder placement inside the procedure of "Make the card for your own workload". The steps run: count the six slot events (code block), then "On EC2 the instance size decides whether such a card can be made at all...", then the placeholder ("What will land here: the same workloads on Amazon EC2..."), then "For the memory stall, run the program a second time with stall_backend_mem and cpu_cycles in the event list, as our runs did." The EC2 aside and the placeholder split a procedure the reader is following step by step. Fix: put "For the memory stall..." directly after the code block, and move the EC2 paragraph and its placeholder after the closing paragraph, or ahead of the procedure as a "where this works" note. The first placeholder ("cards for the arm's real workloads") also sits between the stand-in table and the three card figures that table introduces. Move it after the camera-render verdict, at the end of that section.

2. The GPU section mostly reports what its measurement cannot show. The table caption says "the two durations do not compare". The expandable then computes them as rates and ends "Each figure carries its own clock and matrix size, so the gap between them does not rank the two GPUs." The one verdict, "this multiply pressed on the SMs harder than on memory", is what any reader expects of a large matrix multiply. The block's real value is three instructions: read Nsight's throughput as the busiest counter, record the clock, profile at the run precision. Fix: keep those and the explanation of 70.49%. Either cut the rates expandable, or make it say something: divide each rate by the recorded clock (16,460 / 2.13 against 406 / 0.306 billion FLOPs per GHz) and say what that ratio does and does not rank.

3. "Record the clock with every GPU profile on a Jetson (tegrastats, the Jetson's built-in monitor, prints it) or pin it". The instruction "pin it" gives no way to do it, and the page never asks whether the profiler itself set the 306 MHz. Fix: name the command, and state whether Nsight Compute's clock control was on for the run. [SPECULATIVE: reviewer's knowledge, not checked: `sudo jetson_clocks` pins Jetson clocks; Nsight Compute's `--clock-control` option defaults to locking the GPU to base clock, which could itself explain a low clock.]

4. "The multiply-add loop measures one unit of the core, its floating-point multiply-add pipes fed by chains that never wait on each other, and on it the X925 finished 6.18 instructions per cycle." The explanation of why the arithmetic ratio says 4.0 stops one number short. It compares the X925 with itself (6.18 against 4.37) and never gives the A725's instructions per cycle on the same loop, so the reader cannot see the loop's ratio split into width and clock the way the physics step's is. Fix: give the A725's figure. By the page's own numbers it should be near 2.1 [SPECULATIVE: 3.98 / 1.38 = 2.9 as the per-cycle ratio, then 6.18 / 2.9]. Say in one clause what makes the X925 finish about three times as many multiply-adds per cycle.

5. The opening paragraph does the next paragraph's work. "A program limited by the core as a whole gains its own ratio, found only by measuring that program, and the multiply-add ratio can overstate it, because the loop behind that ratio loads one unit of the core." This comes after two machines, three cores, a definition of scalar and three ratios, all in one paragraph. The humanoid paragraph then proves the same point with numbers. Fix: end paragraph 1 on "Each ratio carries over only to a program that the same part limits on both machines" and let "A simulated humanoid bears the rule out" carry the overstatement with its 2.0 against 4.0.

6. "On the A78AE a low memory stall alone does not rule memory out: the triad, which streams memory by construction, read only 2.6% in one of two runs of the benchmark set, and its split did not repeat in the other." "read only 2.6%" does not say 2.6% of what. The sentence also pulls in the reproducibility problem, which is explained three sections later. Fix: "the triad, a loop that only streams memory, showed only 2.6% of cycles stalled on memory in one of its two runs (its split did not repeat; see the section on splits you can trust)".

7. "The 6.5, 3.8 and 2.4 come from three of the 14 microbenchmarks we ran on each core type..." This paragraph and the pointer-chase paragraph after it explain the opening's three ratios, but they sit inside the section on stand-in verdicts, between the definition of a card and the stand-in table. The blocks are out of order (fault 6). Fix: move both paragraphs to the ratio section ("A ratio predicts a program only through its bottleneck"), where the table of ratios is, or straight after the opening.

8. "Check that no count was scaled. ... perf prints the share of the measurement each counter was running; below 100% means the count was scaled." The page tells the reader to run the check and never says whether its own cards passed it. Fix: one clause: "every count on these cards ran 100% of the measurement" or name the ones that did not.

9. "Set CPU to the number of one core of that type; look up which numbers those are on your own system." This is the one vague step in an otherwise exact procedure. Fix: give the lookup. [SPECULATIVE: reviewer's knowledge, not checked: on Linux the Arm PMU device lists its CPUs in `/sys/bus/event_source/devices/armv8_pmuv3_1/cpus`.]

10. "Per thousand instructions on the Jetson, the step refills the core's first-level data cache 5.22 times and its second-level cache 4.57 times, each refill a fetch from further out. The policy stand-in, which does wait on memory, refills them 34.23 and 41.82 times." For the policy, the second-level count is higher than the first-level count, which the reader's picture ("each refill a fetch from further out") says cannot happen. The page does not explain it. Fix: one clause on what else refills the second-level cache (prefetches, instruction fetches), or say that the counts are not nested.

11. Expandable "How far the flush bias can move a card's front-end share": "Borrowing that constant for the X925, the physics card would move 1.6 points from front end (12.2% to about 10.6%) to bad speculation (5.6% to about 7.2%)." The arithmetic cannot be redone because the formula is not shown. Fix: one line, mispredicted branches x 4 cycles x 10 slots / total slots, with the physics step's mispredict count.

12. "In MuJoCo, the physics engine of section 12, one X925 core stepped the humanoid 2.0 times as fast as one A725". "Stepped" and "step" are used for the first time here, and the page never says what one step is. Fix: "a step, which advances the simulated world by one time increment".

13. Placeholder wording: "G-family sizes (g6, g6e, g7, g7e) for decode with embedding, augmentation, simulation, training and evaluation". "decode" is not defined on this page, and a reader from inference will read it as token generation. Fix: "video decode".

14. "and the runbook, as read on 2026-11-20, does not list which". This is a date as bookkeeping in the prose (fault 5). The citation already carries the access date. Fix: "and the runbook does not list which".

15. "(derived from its own counters, since no document gives it)" and, later, "a core for which neither the Jetson's Linux kernel nor Arm's files give a figure". The same provenance is given twice. Fix: keep it once, in the expandable that does the derivation, and point to it from the first mention with "derived below".

16. Header description: the page's strongest number is the one the ending lands ("inside the Spark the multiply-add ratio said 4.0, and the physics step ran 2.0 times faster"). The header carries only the three microbenchmark ratios that the page goes on to show mislead. Fix: give the header the 4.0 against 2.0.

---

## doc-C: "4. Learning From Demonstrations: Why Copying Drifts and What Fixed It"

Scores
- Argument 8: the first paragraph makes a claim and the second works a number (600 decisions to 6, 1% to 44%). Each section proves one step. But three of the page's own numbers contradict its framing: flow against diffusion step counts, the load model, and two settings against three.
- Depth 9: objective, bound, toy arithmetic, ablation, real defaults that differ from the papers, per-call time split. It reaches level 400 and gives configuration values the reader will type.
- Clarity 8: the best ramp in the batch. Intuition comes before each formula, every symbol is defined before the formula, and second meanings are flagged (k, epsilon, multimodal). A few terms arrive before they are built.
- Sentences 7: many are excellent ("Behaviour cloning is regression whose test set is written by its own mistakes"). Against that, about twenty "the authors report", "our reading", "by our count" clauses, and two muddled sentences.
- Parity 8: publishable beside B. The faults are of consistency and bookkeeping, not of shape.

Findings, most damaging first

1. The flow-against-diffusion comparison contradicts the page's own numbers. Sub-heading description: "What one denoising step is, why a flow head takes 10 where a diffusion policy trains with 100, and where the steps are paid". Body: "Flow matching is diffusion with a straight path and few steps: 10 in pi0, against the 100 that LeRobot's Diffusion Policy runs when num_inference_steps is unset." Ending: "The third is the price of the head: 1, 10 or 100." The page also says that on real robots the Diffusion Policy paper "uses DDIM ... and runs 16 or 10". So at the settings its authors run, a diffusion head costs 10 to 16 passes, about what pi0 pays. The 100 is a training schedule, or a default the fix table tells the reader to change. Setting 10 against 100 compares inference with training, or a tuned model with an untuned one. Fix: compare like with like: diffusion reaches 10 to 16 passes only through a sampler that skips iterations (DDIM), and flow matching reaches 10 with plain Euler steps because its training target is straight. End on "1, 10 to 16, or 100 if you leave LeRobot's diffusion default unset".

2. The section's model of load is disproved by its own best number. Heading: "The load on the GPU is calls per second times passes per call". Then: "Of the 73 ms, 46 ms (63%) is seeing and reading ... Halving the step count would save 13.5 ms of 73 (27 / 2); the larger share is spent before the first step." If 63% of a call is fixed cost, passes per call is not the unit of load. The closing advice ("write down ... the network passes in one call ... The third is the price of the head") then leads the reader to the lever the pi0 row has just shown is the smaller one. Fix: state the model as calls per second x (fixed cost per call + passes x cost per pass), and make the third number the measured time per call, which the closing paragraph already says to measure.

3. The opening merges two failures. "A network trained to copy a person's demonstrations fails for a reason its training loss never sees. Each small error moves the arm ... and the error feeds itself. ... Two changes contained it." The second change, a head that samples, answers a different failure (averaging two valid motions). It does nothing for compounding error. The thesis paragraph therefore misstates what the page goes on to prove. In the same block: "The chunk length sets how many times a second the policy is called". Two sections later the page shows that the actions played per call, not the chunk length, set the call rate ("Every chunked policy therefore carries two numbers"). Fix: "Copying fails in two ways, and two changes answer them: chunks contain the drift, and a head that samples stops the averaging." Then: "the number of actions played per call sets how many times a second the policy is called".

4. The header description and the ending disagree on the count. Header: "Work out how often a policy runs and what each run costs from two of its settings". Ending: "write down three numbers for it: the actions it predicts per call, the actions it plays before it looks again, and the network passes in one call." Fix: make the header say three, or name the two that set the load (actions played per call, passes per call) and keep the third as the reaction-time setting.

5. The claim that ACT's style variable picks one mode is asserted, and the fix table relies on it. "On the robot that second network is thrown away and z is set to zero, which gives one consistent way." Fix table: "The gripper heads between two demonstrated routes | A head that averages the modes | In ACT, leave use_vae on". The only evidence cited is that the CVAE was "essential in learning precise tasks from human demonstrations", which is a different property. The definition a few lines earlier, "a head that draws a sample is a generative head", does not describe ACT at run time either: with z fixed at zero nothing is sampled. Fix: say what z = 0 does (the decoder returns the motion that the centre of z maps to, one fixed answer and not a blend), scope the fix-table row to what the evidence shows, and drop ACT from "draws a sample" or say that it commits to one answer without sampling.

6. Bookkeeping in the prose (fault 5), six times. Quotes: "How each failure looks at the bench is our reading of its mechanism, here and in the closing table"; "6 x 50 = 300 tokens by our count"; "Against our count of 300 for this arm"; "In our reading, sampling one mode is a strong tendency on human demonstrations and falls short of a law."; "By our arithmetic from LeRobot's tuning rule"; "the paper notes, citing earlier work, that problems exist where it is reached". The arithmetic shows its own provenance, and "our reading" is said where a plain claim would do. Fix: "6 x 50 = 300 tokens"; "300 / 30 = 10 times fewer"; "At the bench this looks like a smooth, confident reach that closes the gripper beside the block", with "illustrative" once in the closing table's caption; "The bound is tight: some problems reach it".

7. Attribution verbs on almost every reported figure: about fourteen in the prose ("its authors report 80 to 90% success", "as its authors report, plays 25", "ACT's authors report about 0.01 s", "For pi0 its authors report 73 ms", "The ACT authors report that they found", "The authors report about 30 tokens", "The authors report about 5x fewer", "the FAST authors report about 4 days", and so on). This is the owner's "as the authors of the faster model report it". The citations already say "author reported", and the timing table's column header says it again. Fix: say once, where the figures begin, that every timing and success rate is the paper's own on its authors' hardware, and then state the figures plainly. Keep the attribution only where a phrase is quoted.

8. "In our reading, sampling one mode is a strong tendency on human demonstrations and falls short of a law." The sentence is muddled, and the evidence before it is confounded. By the page's own description, OpenVLA-OFT changed the decoding (one parallel pass), the output (a whole chunk) and the loss (L1 regression) at once, so its 76.5% to 97.1% does not isolate the head. Fix: "OpenVLA-OFT changed decoding, chunking and loss together, so its 76.5% to 97.1% shows that a regression head can work on LIBERO's demonstrations; it does not show that the sampling head is unnecessary."

9. "The straightness is what saves steps: a step is a straight move, so it follows a straight route exactly however long it is". If the route were straight, one step would do, and the reader is left asking why pi0 takes ten. The path from one noise draw to one demonstration is straight. The field the network learns averages over many such pairs and bends where they cross. Fix: one sentence saying so, which also explains why 10 steps and not 1.

10. "Each step is also cheaper than a full pass: pi0 encodes the observation once and caches the result, so a step re-runs only the action part of the network." The sentence comes straight after the diffusion comparison, so the reader credits flow matching with the saving. The page does not say whether a diffusion policy also encodes the observation once. Fix: say that the caching belongs to pi0's architecture, not to flow matching, and say whether Diffusion Policy does the same. [SPECULATIVE: reviewer's knowledge, not checked: Diffusion Policy also computes its observation features once per call and conditions every denoising pass on them.]

11. Expandable heading "ACT in LeRobot v0.7.0: the tensors, the defaults you will type, and where the code overrides the paper", and its first line, "The tensors are small." The block then gives one width (512) and no tensor shape, so it does not deliver what the heading promises. Fix: give the shapes, image in, feature map out of ResNet-18, number of tokens the transformer reads, 100 x 6 out, or drop "the tensors" from the heading.

12. "The table gives each paper's own figures. Each row was timed on a different GPU, so compare within a row." The first sentence talks about the page (fault 4). The second gives an instruction a reader cannot follow, since each row holds one time. Fix: "Each row was timed on a different GPU, so the times do not rank the policies."

13. Two deadlines for one call, in consecutive paragraphs: "It has to return before the chunk in play runs out, every time, for as long as the arm runs." then "the time of one call, measured on your GPU, has to stay under about half the duration of the chunk it predicts". The reader cannot tell which deadline applies, and the "half" arrives with no reason. Fix: one deadline, with its reason in a clause, and the pointer to section 17 for the derivation.

14. Figure label: "one tick is one pass of the network; the Diffusion Policy authors run 16 or 10 iterations on real robots". On this page "tick" already means one control step (30 a second). Fix: "one mark is one pass".

15. Terms used before they are built. "policy" appears in the header, the opening and about a dozen times before "the fitted network is the policy". The same goes for "Sit at the bench with the leader arm of the SO-101 in your hand" (leader arm never explained), "the host stores 30 times a second" (host never said), and "action_horizon in the openpi code" (openpi never introduced). Fix: one clause each at first use, for example "the policy, the trained network that picks the arm's next action", "the leader arm, an unpowered copy whose joint angles the robot follows", "the host computer", "openpi, Physical Intelligence's released code".

16. "The authors report about 30 tokens per chunk per arm. Against our count of 300 for this arm that is 300 / 30 = 10 times fewer." This divides a count for the paper's chunks by a count for this arm's 50 x 6 chunk, and the page never says the two chunks match in length or joints. Fix: state the chunk behind the 30, or give the paper's compression ratio for a stated chunk.

17. "The authors report about 5x fewer training GPU-hours than flow-matching pi0". The heading claims "cheaper to train", but no mechanism follows, while the slower-to-run half gets two causes. Fix: one clause on why token training converges faster, or say the paper gives no reason.

18. "The Diffusion Policy authors call multimodal action distributions "a well-known challenge for policy learning"." This is an authority quote on a point the paragraph has just shown. It adds weight, not trust. Fix: cut.

19. "The arm is sent their weighted average." Temporal ensembling averages overlapping predictions. Two sections later the page shows averaging to be the failure that steers into the obstacle. A careful reader will ask whether ensembling can average two modes, and the page leaves it open, even where pi0's authors report it "hurt policy performance". Fix: one clause saying whether chunks predicted a tick apart can disagree in mode, or that this was not examined.

20. "A policy gives the machine two jobs of different shape ... (section 20, Fifteen Workloads, Five Shapes) ... (section 10, Processing and Curating) ... section 15, Training at Three Scales, sorts the sizes." A paragraph of cross-references between the fix table and the closing action. Its one new claim, "the cores that decode the episode video can fill before the GPU does", carries no number. Fix: cut it to the training-scale figures (5 hours on one card against 4 days on 8 H100s) and the deadline sentence, or move it above the fix table.

21. "the time one call takes is distance the gripper travels on an old observation". The article is missing ("is the distance") and the equation is loose: time is not distance until it is multiplied by a speed, which the page does later. Fix: "the time one call takes, times the gripper's speed, is the distance it travels on an old observation".

---

## Batch answer

Groups by quality alone:
- Group 1: doc-B and doc-C.
- Group 2: doc-A.

Can a careful reader tell them apart by quality alone? Yes for doc-A against the other two. No between doc-B and doc-C.

What separates the groups:
- B and C state a claim in the title and the first sentence, and work a number in the first two paragraphs.
- B and C build every concept before using it. Each section proves one step, and each ends on a value or command the reader will type.
- A also works a strong number early (412 FLOP per byte against 2 to 10). Around it, though, it opens on itself ("This deep dive gives you"), tours nine architectures as named mechanisms, and asks the reader to know about twenty terms it never builds (warp, systolic array, prefill, KV cache, SBUF, TMEM...). It closes on a table of contents of the dive. Those are faults 1, 2, 4 and 6 of the owner's list, and the reader meets them on the first screen.

B against C: the difference is of kind, not quality.
- B is a measurement report. It is tighter in argument: every ratio is reconciled, its own method is checked, and its biases are bounded. It is denser to read.
- C is a concept build. It gives the level 100 to 200 reader the better ramp (intuition, formula, decomposition, toy numbers). It carries more internal inconsistency: flow against diffusion step counts, the calls x passes load model against its own 73 ms split, "two settings" against "three numbers". It also has more bookkeeping ("our reading", "by our count", about fourteen "the authors report").
- Neither fault set is visible at a glance. A reader would not rank one below the other.

Verdicts:
- doc-A: distinguishable, weaker. It is a framing page that tours rather than proves, and it is unreadable at level 100 to 200 without outside knowledge.
- doc-B: sets the bar.
- doc-C: not distinguishable by quality from the best files. Fix findings 1 to 4 and it matches B on argument.


## Key (appended by the orchestrator after the review)

doc-A silicon dive thesis section; doc-B this dive section 22 (r3); doc-C this dive section 4 (published pilot, bar)
