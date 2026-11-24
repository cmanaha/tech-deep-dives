# Adversarial review, round 3 (blind, seven files)

Judged only on the rendered text in `/tmp/pai-rw/review/r3/in/`. Citation markers, diagram labels and calculator field labels are not marked as prose faults.

| File | Argument | Depth | Clarity | Sentences | Parity | Verdict |
|---|---|---|---|---|---|---|
| doc-A (23. Cost per Improvement) | 7 | 7 | 6.5 | 6 | 6.5 | distinguishable: weaker |
| doc-B (1. One Arm, Fifteen Workloads) | 7.5 | 7 | 6.5 | 6.5 | 7 | distinguishable: weaker |
| doc-C (Roofline and Arithmetic Intensity) | 8.5 | 9 | 6 | 8 | 8.5 | sets the bar |
| doc-D (4. Learning From Demonstrations) | 9 | 9 | 8 | 8 | 9 | sets the bar |
| doc-E (Thesis and Framing) | 7.5 | 7 | 5 | 7 | 6.5 | distinguishable: weaker |
| doc-F (2. Getting Started) | 8 | 7.5 | 7.5 | 7.5 | 8 | not distinguishable by quality from the best files |
| doc-G (10. What RL Does to a Model) | 8 | 8.5 | 7 | 7 | 7.5 | not distinguishable by quality from the best files (narrowly; one tic gives it away) |

---

## doc-A: 23. Cost per Improvement

Scores
- argument 7: opens on a real decision (pay once or pay per query) and lands 665,000 by paragraph two, but the middle two sub-sections stop arguing and catalogue published runs.
- depth 7: the breakeven formula, the idle-GPU correction and the 69-day load figure are level 400; the training-cost section is a list of other people's GPU-hours with no rule that turns them into the reader's bill.
- clarity 6.5: Dr. GRPO and DAPO are defined by mechanisms this section has not built (clip bound, division by standard deviation); "the third option" arrives after the opening said there are two places to buy.
- sentences 6: the provenance tics ("by our arithmetic", "our arithmetic", "our reading", "located in this research") appear about ten times and flatten the voice.
- parity 6.5: a careful reader would place it a clear step below doc-D and doc-C.

Findings, most damaging first

1. "216 GPU-hours by our arithmetic" / "74 times the 7B recipe's GPU-hours, on a newer GPU (our arithmetic)" / "about 20,400 GPU-hours by our arithmetic" / "2.8 and 4.9 times by our arithmetic" / "about 665,000 served problems, our arithmetic from the paper's figures" / "(our arithmetic)" twice more / "The inputs are the paper's; the breakeven and the server time are ours." Bookkeeping in the prose, eight or more times in one section. A multiplication the reader can redo needs no ownership label; say it once, in the expandable arithmetic panel, and delete the rest.
2. "The published runs collected here range from a few hundred GPU-hours to well over a hundred thousand, and model size alone does not set the bill." The sub-section then lists five runs (Dr. GRPO, ProRL, R1, DeepSWE, DAPO) at equal weight and never says what does set the bill. "Model size alone does not set the bill" is the thesis and it is left as a negative. The reader finishes with numbers and no sizing rule (steps, samples per step, tokens per sample).
3. "Two 32B runs sit between them." A sentence whose only job is to announce a list. It also sits under a heading ("Two 32B runs: DeepSWE and verl's DAPO reproduction") that is a label for a pile of facts.
4. "A minimal recipe of Dr. GRPO (GRPO Done Right), the GRPO variant of section 9 that drops the division by each answer's length and by the group's standard deviation, on Qwen2.5-Math-7B took 27 hours on 8 A100s" and "DAPO ... is the GRPO variant of section 9 that raises the upper clip bound, keeps only prompts whose group of answers is neither all right nor all wrong, and averages the loss over every token in the batch." Two definitions by internal mechanism that have no bearing on cost and that this section's reader cannot parse (GRPO itself is defined only two paragraphs later). The definition interrupts the number. Name the variant, point to section 9, give the GPU-hours.
5. "that record is the verl team's run, not the DAPO authors'." Provenance that belongs in the citation, and a "not A" definition.
6. "The calculator at the end of this section redoes it with your rates, your volume and the quality gap you measure." and "The calculator opens on the Training-Free GRPO pair above, a cross-model example." and "The calculator takes your hours as an input." Prose about the page. Three sentences describe the widget instead of the decision.
7. "At those prices the text loop stays cheaper until about 665,000 served problems (our arithmetic)." This repeats the second paragraph almost word for word ("At its prices the text loop stays cheaper until about 665,000 served problems"). Repeating the strongest number is fine; repeating the sentence is padding. The second landing should add the consequence (the 69 days of continuous load), which currently comes two sentences later.
8. "Our reading of these figures: a text loop is cheap to train, and it pays at serving mostly when it rides on a larger model than the RL alternative." This is the section's actual finding and it is buried as the last paragraph of the third sub-section, behind the label "Our reading of these figures". It should be in the first screen.
9. "The third option trains nothing." The opening says "An improvement can be bought in two places." The reader has to reconcile two with three; the sampler was folded into the second place in paragraph one and is now counted separately.
10. "Start with the queries you expect the artifact to serve before it is retrained or retired. Each column then takes a training quantity with your price per unit, a cost per query and the quality you measured; the per-query column adds the token multiplier. Choose "Your own numbers" in a column to clear it. A preset fills only the values its source reports, each with its citation under the field, and any field you edit becomes yours." A user manual for a form, in body prose. A descriptive list of fields with no consequence.
11. "No typical job length for any model was located in this research" and "The one published comparison with RL from the same checkpoint located in this research is Qwen3's". Honest scoping, but the phrase is the writer's log leaking into the text twice.
12. "Section 16, Memories, Playbooks & Skill Libraries, compares the two methods on 32B-class models." A pointer tacked on the end of the paragraph that most needed a conclusion.
13. Header description "Know the four numbers the decision turns on, and which of them only you can supply": the text then says "Three of the four inputs are yours alone" without ever listing the four. The reader has to infer them from the formula.
14. Title "Cost per Improvement": acceptable, but the section's own framing ("pay once or pay per query") is sharper than the title.

What is good and should be kept: "A cost per query measured at full load is a floor."; "Cost settles half the decision."; the 1,664-hour check on the paper's own breakeven.

---

## doc-B: 1. One Arm, Fifteen Workloads: What Each One Runs On

Scores
- argument 7.5: two questions, each tied to a purchase, and a worked count (390 x 25.2 MB = 9.8 GB/s against 11.71) by the fifth paragraph; then it turns into a fifteen-row table and a five-item question list.
- depth 7: the bandwidth count, the AV1/H100 fact, the RT-core fact and the 24 vCPUs per GPU are real; most of the fifteen rows assert a "part" with no number, and the five shapes get one clause each.
- clarity 6.5: a private vocabulary ("part", "fills first", "shape", "nodes that talk") carries the whole section, and the 149 ms against 33.3 ms contradiction is left open for two screens.
- sentences 6.5: many are well made; a noticeable minority are primer register or coined phrasing that needs a second read.
- parity 7: close to doc-F, a step under doc-D.

Findings, most damaging first

1. "Place any job in a robot's learning loop with two questions: which part of the machine it fills first, and what it loses with its machine" (header description). "What it loses with its machine" does not parse on first read, and "fills first" is not yet a term. This is the same fault as the owner's "What does that mean?". The first paragraph then repeats both questions nearly verbatim. Fix: "which resource it exhausts first, and what work is lost if the machine is taken away."
2. "A part is anything in a computer that runs out separately: its CPU cores, its memory, each kind of unit inside a GPU. A job runs as fast as the first part to run out. That part is full, the job has filled it first, and the rest of the machine sits partly idle behind it." The second and third sentences say one thing three times, and "part" is a primer word standing in for "resource" or "bottleneck", which this reader already knows. The careful, flat voice of fault 7.
3. "NVIDIA reports a median of 149.0 ms for one call of its GR00T N1.7 policy on a Jetson Orin with TensorRT, the fastest runtime in its table for that device, which is 4.5 of those periods." The paragraph has just said the arm "does not wait for a slow answer". The reader concludes the policy cannot work and is not told otherwise until "Placing a job of your own", some forty lines later ("each call returns many actions"). A leap left open across two sub-sections.
4. "A program small enough to count by hand stands in for it: six 1024x1024 float32 matrices multiplied in turn, 25.2 MB of weights" then "The arm's own policy runs on a GPU, and the count is made the same way there". The worked example is a NumPy toy on a CPU core, and the text concedes the real policy runs elsewhere. The reader is not told what is multiplied by the matrices (a vector?), which is what justifies "one decision reads every weight of the model once" and therefore the 9.8 GB/s. The key arithmetic rests on an unstated assumption.
5. "Teaching one small robot arm one task takes about fifteen computing jobs (by our count), and they share the arm and almost nothing else." Good sentence spoiled by "(by our count)" in the first line of the dive and by "about fifteen" for a number that is exactly fifteen in the table.
6. "Before the arm can repeat the task unaided, the episode is recorded, cleaned, multiplied into more samples, joined by simulated attempts and used to train a policy. The policy is scored and sent to the arm, and what the arm does next is recorded as new episodes." The eight-stage list in sentence form: it describes and lists, carries no consequence.
7. "A stage of the loop is a step in the arm's story. A workload is narrower: a job with one part that fills first." Primer register ("the arm's story"), and a taxonomy sentence where the following one ("Simulation is one stage and three workloads, because ...") does the real work alone.
8. "Sorted by those three, the jobs round the arm come in five shapes." followed by five one-sentence definitions. "An always-on job handles a steady stream item by item and loses one item." is the thinnest; nothing says which scheduler or market each shape forces until the Q&A, and then for two of the five only.
9. The fifteen-row table: facts at equal weight. Row 9 ("GPU tensor cores, lightly: one GPU for a few hours") and row 11 ("That computer's own GPU and CPU, for minutes") sit beside row 4 and row 7, which decide an instance purchase. Terms arrive in cells before they are built: "RTX renderer" (explained three paragraphs later), "closed-loop", "engine build", "the general arithmetic units of a GPU" (a part the parts paragraph never named).
10. "Workloads 1, 2 and 4 have one cause." Cause of what? The sentence refers to an effect (all three land on CPU cores) that it does not state.
11. "Placing a job of your own" is a list of five questions each answered by a pointer ("(section 10, Processing and Curating)", "(sections 24 to 29, starting at Orchestrating Physical AI on AWS)"). It is a table of contents in question form. The answers carry numbers, which saves it, but "telling a true 80% from 90% takes about 199 trials per policy" drops a number with no hint of where 199 comes from.
12. "For a job that is none of the fifteen, count as the stand-in was counted." Self-referential and stiff. "Section 20, Fifteen Workloads, Five Shapes, does the count for every workload, and section 21, Reading a Machine, confirms it on the processor's counters." A pointer as the last sentence.
13. Caption: "Read clockwise from stage 1; the blue dot is one episode. Each tag is the part that fills first in that stage's commonest workloads. Illustrative, not measured." Instructions for reading the figure, no statement of what it shows.

What is good: "Those cores are the part bought by accident, and the first thing to check on a training run whose GPU sits idle."; "One arm, two jobs: the first wants memory bandwidth on a machine it never loses, the second wants many small machines it can afford to lose."; the 84% and 62.3% count.

---

## doc-C: Roofline and Arithmetic Intensity

Scores
- argument 8.5: one claim (precision moves the ridge more than a chip generation) stated in the header, proved with the table, restated with numbers; every sub-section ends on a consequence.
- depth 9: ridge points for eight chips at three precisions, the 69 tokens/s ceiling, the Rubin regime change at FP8, the Trainium3 FP4 case, the three Rubin bandwidth figures. This is level 400.
- clarity 6: written for a reader who already knows prefill, decode, KV cache, tensor cores and GEMMs. The level 100 to 200 reader is carried only if earlier sections did the work; on this page alone several steps are leaps.
- sentences 8: dense, specific, consequential; few wasted words.
- parity 8.5: with doc-D, the best in the batch.

Findings, most damaging first

1. "Three quantities. Arithmetic intensity is FLOP per byte of DRAM (dynamic random-access memory) traffic, a property of the workload and its implementation. Peak FLOPS is the chip's arithmetic ceiling at one precision. Peak bandwidth is its DRAM throughput, HBM (High Bandwidth Memory) on every accelerator in this section." Four definitions in a row with no intuition first and no sentence on why dividing one by the other gives a threshold. FLOP is never expanded. For the stated reader this is formula before intuition; one sentence ("a chip can do X arithmetic per second and fetch Y bytes per second, so a workload that needs fewer than X/Y operations per byte runs out of bytes first") would fix it.
2. "Prefill processes the whole prompt in parallel to fill the KV (key-value) cache, so every weight read serves every prompt token in the batch." KV cache is expanded and never explained anywhere in the section, though it then caps the batch ("KV-cache capacity caps the batch") and enters the tokens-per-second ceiling ("the active parameter bytes plus the KV-cache bytes").
3. "Second, GQA (grouped-query attention), KV-cache quantization, FlashAttention-class fusion and speculative decoding speed up decode by cutting the bytes moved per useful FLOP." A four-item list of unexplained techniques at equal weight. Expanded acronyms are names, not explanations.
4. "Batch size, operator fusion and precision are the three levers you control at serving time, and each one stops at a different limit" (header description). The text gives batching's limit (KV-cache capacity) and precision's (the FLOPS rate may not rise with it) and never states where fusion stops. A promise the section does not keep.
5. "One kernel for several operators keeps intermediate tensors in SMEM (shared memory), TMEM (Tensor Memory) or SBUF (State Buffer) instead of HBM." Three on-chip tiers named by acronym only; the reader cannot tell they are on-chip from this sentence, which is the whole point.
6. "Quantization and Precision covers the full ladder and the numerics that make FP8 and FP4 usable at model scale." The section ends on a pointer. The sentence before it ("Before you pick a precision, read your chip's row in the ridge table ...") is the real ending and should be last.
7. "Cerebras Wafer-Scale, Groq, SambaNova and Dataflow and Compute-in-Memory cover each." and "KV Cache and FlashAttention walks that trade-off, and Flash as a Cache Tier for Inference covers a KV cache that outgrows HBM." Prose that is a link list.
8. "Sparse rates apply only to weights pruned to the 2:4 structured pattern, so every ridge on this page uses the dense rate." "2:4 structured pattern" is never explained, and "on this page" is the page talking about itself. "The tables use the individual-GPU figures because FLOPS and bandwidth there come from one table." is the same family, though the consequence that follows ("Compute the ridge from the system you are buying") redeems the paragraph.
9. "The roofline, placed" (sub-heading). Placed where, by whom? A clipped label; its description does the work.
10. "It still works seventeen years on because it reduces that question to a ratio of two figures every vendor publishes." Good sentence; "seventeen years on" will date.
11. "A dense model does about 2 FLOP per parameter per token" is asserted with no reason (one multiply and one add per weight). One clause would close the gap.

What sets the bar: "A 70-billion-parameter dense model in FP8 reads about 70 GB per token, so one H200 tops out near 69 tokens per second."; "FP8 doubles both the ridge and decode's intensity, so decode runs about twice as fast and stays just as far from the ridge."; "Your precision choice decides where the ridge sits more than your chip choice does."

---

## doc-D: 4. Learning From Demonstrations: Why Copying Drifts and What Fixed It

Scores
- argument 9: first sentence is a claim ("fails for a reason its training loss never sees"), the second paragraph works 600 decisions down to 6 and quotes 1% to 44%, the third turns the two fixes into the compute bill. Everything after proves it.
- depth 9: the bound with its decomposition, the predicted/played pair per codebase, the pass counts per head, the 73 ms breakdown, defaults that differ from papers, a symptom-to-setting table.
- clarity 8: every symbol defined before its formula, toy numbers labelled, symbol collisions flagged at the switch. A few terms slip through and two symbol paragraphs are walls.
- sentences 8: mostly specific and consequential; a handful are overloaded or bookkeeping.
- parity 9: the best file in the batch.

Findings, most damaging first

1. "In our reading, sampling one mode is a strong tendency on human demonstrations and falls short of a law." The sentence does not say what it means. The point is that a generative head usually helps and one strong counter-example shows plain regression over a chunk can win; "sampling one mode is a strong tendency" is not that. It is the conclusion of the paragraph and the weakest sentence in the file.
2. "How each failure looks at the bench is our reading of its mechanism, here and in the closing table: this one is a smooth, confident reach that closes the gripper beside the block." Bookkeeping plus self-reference ("here and in the closing table") stapled to a good image. Give the image; put the provenance in one clause or the citation.
3. "ACT's loss has one term for each of those two jobs: copy the chunk, and keep z carrying so little that it can be dropped." followed by a single paragraph that defines eleven symbols, then adds "LeRobot's code takes the mean of the absolute differences where the bars add them up, and its default β is set against that mean." The definitions are in the right place but the paragraph is a wall, and the implementation footnote sits at equal weight with the definitions of the loss. Same for "The paper's algorithm box labels the first term MSE (mean squared error); its text and LeRobot's code use L1." Trivial facts beside deciding ones.
4. "Follow one number of one chunk, with toy values. The noise is 0.8 and the demonstrated value is 0.2, so the direction is 0.2 - 0.8 = -0.6. Each of ten steps moves it by 0.1 x -0.6 = -0.06". With a constant velocity one step of size 1 would arrive exactly, so the example invites the question "why ten?" and the text does not answer it: the learned field averages many noise-demonstration pairs and is not straight everywhere. The earlier sentence ("leaves a curved one unless the steps are short") gestures at it; the example undercuts it.
5. "and the time one call takes is distance the gripper travels on an old observation (section 3, The Robot as a Computer)." In the third paragraph this is cryptic; it is only earned near the end (0.25 m/s x 0.073 s = 18 mm). Either work it there or cut it from the opening.
6. "Sit at the bench with the leader arm of the SO-101 in your hand" and "the host stores 30 times a second". "Leader arm" and "host" are used with no explanation; "teleoperation" gets one a paragraph later.
7. "Flow matching is diffusion with a straight path and few steps: 10 in pi0, where Diffusion Policy trains with 100 iterations." This is the third statement of the same comparison (after the opening and the sub-heading description). The useful new fact is the next sentence (the observation is encoded once and cached).
8. "And the openpi code runs the time axis the opposite way to the paper, with noise at 1 and the finished chunk at 0, by its own comment, so say which convention a formula uses before you compare it with the source." "By its own comment" is provenance in the prose, and the advice ("say which convention") is addressed to a writer, not to this reader.
9. "The table gives each paper's own figures. Each row was timed on a different GPU, so compare within a row." The first sentence is prose about the page; the second is the one that matters.
10. "A policy gives the machine two jobs of different shape, training and the call on the arm (section 20, Fifteen Workloads, Five Shapes), and both are matrix arithmetic on a GPU's tensor cores." The penultimate paragraph is a cross-link block ("section 20", "section 10", "section 15") that interrupts the run from the symptom table to the closing instruction. "Shape" is another section's term, used here unbuilt.
11. "The time of one call, measured on your GPU, has to stay under half the duration of the actions it plays, or the next call cannot finish before the arm runs out (section 17, Running on the Robot, works the rule)." A new rule ("half") introduced in the last paragraph with its reason deferred. The reason given ("cannot finish before the arm runs out") would justify "under the duration", not "under half".
12. "A language model produces tokens, so the fourth design writes the chunk as tokens ... 6 x 50 = 300 tokens by our count." and "Against our count of 300 for this arm". "By our count" twice in two paragraphs.
13. Captions: "Three views of the same 10 steps, every second one shown. First, one joint of one chunk ... Second ... Third ... the readout under the clock repeats the toy values of the text." A paragraph-long inventory of the figure, ending in self-reference. The first caption ("Steps 1 to 5 are the drift, steps 6 and 7 the chunks.") is the same.
14. Sub-heading descriptions that restate the topic: "What a demonstration is as data, and how few of them a policy trained from scratch needs"; "What one denoising step is, why a flow head takes 10 where a diffusion policy trains with 100, and where the steps are paid". Set beside "Decide once per chunk: the change that moved one paper's success from 1% to 44%, and where a longer chunk stops helping", they are the weaker pattern.
15. Second paragraph of the section: "ACT (Action Chunking with Transformers) is the 2023 policy that made chunks standard in robot imitation, and in its authors' own test of the idea success went from 1% with no chunks to 44% with chunks of 100, averaged over four settings." Overloaded; the number is the point and it is behind a definition, an attribution and a qualifier.

What sets the bar: "Behaviour cloning is regression whose test set is written by its own mistakes."; "halve ε and the ceiling halves, halve T and it drops to a quarter. T is the factor to go after."; "When a paper and its code disagree, the code is what you run."; "Chunks make a slow call possible, and the call still costs distance."; the closing "The third is the price of the head: 1, 10 or 100."

---

## doc-E: Thesis and Framing

Scores
- argument 7.5: states a method and proves the decode case with one division (1,979 TFLOPS / 4.8 TB/s = 412 against 2 to 10) in the third paragraph; the triangle that the title promises is then described and never used to predict anything.
- depth 7: the anchor paragraph is level 400; the three "delivery" sub-sections are a catalogue of mechanism names per vendor with one number each at most.
- clarity 5: the stated reader is lost in "Instruction delivery" (BTB, warp scheduler, SM, NEFF, ISA, WSE-3, task picker in five sentences), and "functional unit", "front end", "retires", "systolic array" and "2:4 structured pattern" are never explained.
- sentences 7: confident and compact, some excellent; several are lists and one paragraph is a table of contents.
- parity 6.5: the anchor paragraph is as good as anything in the batch; the rest is not.

Findings, most damaging first

1. "The front end fetches, decodes and issues the operation. Out-of-order host cores do it speculatively, with a branch predictor and a BTB (Branch Target Buffer). A GPU SM (Streaming Multiprocessor) issues from a warp scheduler and hides a stalled warp's latency by running other warps. ... On Trainium the Neuron compiler fixes most of the schedule ahead of time in a NEFF (Neuron Executable File Format); Trainium2 and Trainium3 add ISA (instruction set architecture) support for dynamic shapes and control flow. On a Cerebras WSE-3 ... each core's own task picker chooses what runs next." Four architectures described at equal weight, each in its own jargon, with no consequence drawn. A reader who knows what a GPU is does not know what a warp is. This is the describe-and-list fault at its densest, in the opening section of a dive.
2. "Bring one question to every chip: on this workload, which delivery binds, and what does the silicon do when it is late? Roofline and Arithmetic Intensity computes ridge points across chips and precisions. Memory Hierarchy Primer and Anatomy of a Kernel Execution walk the tiers; HBM and the Bandwidth Wall, DDR5, MRDIMM, LPDDR5X and CXL, High Bandwidth Flash and Flash as a Cache Tier for Inference take the ones that hold weights and KV cache. The silicon sections, Graviton Deep Dive through Compute-in-Memory, show ..." A tour of the dive in prose, under a description that announces it: "The question to bring to every chip, and where the dive answers it".
3. Title "Thesis and Framing". A label for the writer's outline. It names no thesis. Same family as the owner's "What does that mean?".
4. "Heterogeneity is the organizing fact" (sub-heading) and "A GPU vendor ships the thesis." Abstract nouns where a claim should be. The description under the heading ("The workload decides which delivery binds, which is why NVIDIA's Vera Rubin platform pairs its GPU racks with a rack of a second kind of chip for decode") is the heading that should have been written.
5. "Every operation needs three deliveries at a functional unit: an instruction, its operands and their layout." Second sentence of the dive, and "functional unit" is never defined. "An operation retires when a functional unit executes it." repeats the problem with "retires".
6. "Reading a spec sheet for inference. The headline figure is peak FLOPS, often quoted with sparsity. Decode does little arithmetic per byte: a dense model reads every weight once per generated token, and an MoE (mixture of experts) model reads the experts each token selects." The two halves are not joined: the reader has to supply "but FLOPS is the wrong figure, because". The run-in label ("Reading a spec sheet for inference.") and "The anchor number." and "Sparse aside:" are outline headings left in the prose.
7. "Across chips the spread is wider. Arm Neoverse host cores, x86 cores with AMX tiles, NVIDIA Hopper and Blackwell GPUs, AWS Trainium and Inferentia, Cerebras wafer-scale engines, the Groq LPU (Language Processing Unit), the SambaNova RDU (Reconfigurable Dataflow Unit) and compute-in-memory devices each place a different bet on how instruction, data and shape reach the unit." An eight-item list whose predicate ("each place a different bet") says nothing.
8. "On Trainium most of the schedule is fixed at compile time, so stalls are largely visible in the compiled schedule. On WSE-3 the compiler fixes the routes. A model larger than one wafer is split at layer boundaries across several CS-3 systems." Three facts in a row with no connection to the heading ("Check that the mechanism exists before you port a tuning result"). The third is a non sequitur. The last sentence of the panel is the only one that makes the point.
9. "An HFT (high-frequency trading) matching engine judged on p99.9 tick-to-trade latency, a RAG (Retrieval-Augmented Generation) pipeline judged on tokens per second per dollar and a training run judged on time to convergence bind on different deliveries, and often land on different silicon." A triad for cadence; none of the three is tied to a delivery.
10. "Shape fit": "A kernel with the wrong tile under-fills the unit or falls back to a slower path that misses tensor-core throughput." The third leg of the triangle gets no number and no example a newcomer can picture. The triangle is the section's organising idea and one of its three corners is asserted only.
11. "doubling bandwidth roughly doubles tokens per second until a fixed latency floor sets the step time." "A fixed latency floor" is introduced and dropped.
12. "What to ask instead" (sub-heading). Instead of what? It depends on a sentence two sub-sections up.
13. First sentence, "This deep dive gives you a way to predict how an inference workload will run on a chip before you benchmark it." It is the dive talking about itself, though it does state a payoff.

What is good: the anchor paragraph ("about 40 to 200 times below the ridge ... Doubling peak FLOPS does nothing for it"); "Peak FLOPS assumes all three deliveries arrive on time."; "'We cut p99 by raising speculation depth' gives a systolic array nothing to act on: it has no speculation depth."

---

## doc-F: 2. Getting Started: What Changes When the Model Drives a Robot

Scores
- argument 8: "Four facts about a robot arm change what you buy for it, and experience with language models points the wrong way on each", then four sub-sections whose headings are the four claims, each with its number and its setting. One sub-section does not prove its claim.
- depth 7.5: worst-cycle figures, 38,400x rows-to-pixels, 22.9 against 149.0 against 357.9 ms, the nvidia-smi definition. Right for an entry section; shallower than doc-D by design.
- clarity 7.5: builds policy, observation, action, episode in order; slips on "chunk", "frozen backbone", "quantising", "cosine similarity", "closed-loop".
- sentences 7.5: mostly short and consequential; one run-on and a few flat connectors.
- parity 8: reads as the same hand as doc-D at lower intensity.

Findings, most damaging first

1. "Three shorter paths, one per reason for coming" / "Read only the sections your question needs" / "One path is for models that predict what the arm's actions will do before the motors move (world models), one follows the pipeline from a recorded attempt to many robots, and one is for choosing machines and a scheduler. Each is a subset of the 30 sections." A site map as the first sub-section, between the opening argument and its proof. It is a tour of the dive, it is a list sentence, and it stops the argument the first three paragraphs started. Move it to the end or out of the section.
2. Sub-section "A job runs as fast as the first part of the machine to run out": the description promises "stop reading a GPU utilisation figure as proof that the GPU is the limit", and the one worked number ("an update takes 0.167 s, of which loading the data is 0.015 s. The GPUs are the full part") shows the case where the GPU is the limit. The opposite case, the one the heading is about, gets only a quotation ("the GPU ends up waiting for data") and no figure. The claim is not proved.
3. "A GPU that spends part of every step waiting for data can still read as busy, and the team buys a larger one. Decoding belongs on CPU instances, or on the GPU instance with the most cores per GPU." The second sentence is a configuration recommendation dropped with no reasoning and no number. A leap.
4. "On every tick of the arm's clock the computer beside it reads the cameras and the six joint angles, which together are the observation, the policy returns six target joint angles, which are the action, and the targets go to the motors." A comma-spliced run-on carrying two definitions. It also says one call returns one action; the section later relies on "each benchmarked call returns 40 actions" without marking the change, and quotes "its next chunk of actions" before "chunk" is built.
5. "With LeRobot's default synchronous rollout, "the robot stops moving every time the policy computes its next chunk of actions". The asynchronous rollouts ... need "enough usable action playback to cover inference latency and its variation"." Two quotations doing the explaining, in the source's vocabulary ("rollout", "chunk", "action playback"), none of it built for this reader.
6. "An instance is CPU cores, memory, storage, a network link and, inside each GPU, separate units for matrix arithmetic and for decoding video. A job uses them in some proportion, and it runs as fast as the first one to run out. That part is full, the others sit partly idle, and a larger instance helps only if it has more of that part." The heading, the opening paragraph and this paragraph each state the same sentence. Third time is padding.
7. "LeRobot's inference guide prints a sample of its own timing report at 30 Hz, with no hardware named." Provenance in the sentence; "with no hardware named" is a caveat that belongs with the citation or in one clause attached to the numbers.
8. Unbuilt terms at equal weight: "with the model's backbone frozen", "quantising the model to a format it calls mixed NVFP4", "the expected cosine similarity of the outputs is 0.999 or higher", "do not measure closed-loop task success". Each is a level 400 detail delivered to a reader who has not been given the word.
9. "The software on the robot moves the answer as much as the chip does." and "One setting moves the answer." and "A setting decides what a slow call does to the arm." The same connector three times; the first is a strong claim, the other two are flat.
10. Header description: "Know the four ways a robot job differs from serving a language model, each with the number that shows it and the setting it forces (LeRobot v0.7.0 and the Isaac-GR00T repository, read 2026-11-20)". Good payoff; the parenthesis is bookkeeping in the most visible line of the section.
11. Title "Getting Started: What Changes When the Model Drives a Robot". "Getting Started" is a slot name; the half after the colon is the title.
12. "The arm is an SO-101, a small desktop arm with six motors and two cameras, learning to pick up a block and place it in a cup. LeRobot is the open-source robot-learning library it is recorded, trained and run with." Two definition sentences hanging at the end of the opening, attached to nothing.

What is good: "A model that serves requests is judged by its throughput, or by a latency someone chose. A policy is judged against a period the arm sets, call by call, and an average hides the calls that matter."; "The largest outlier in the sample is neither: writing the recording took 620.00 ms at its worst."; "Nothing in the training run reports that second size."; the four-number ending.

---

## doc-G: 10. What RL Does to a Model

Scores
- argument 8: a real thesis (RL mostly sharpens; a frozen model can buy part of it back per query) reached in paragraph two with a number, defended against its own counter-evidence, and closed with a test the reader can run. The first paragraph is a definition and an announcement.
- depth 8.5: measured crossings, question-level counts, three boundary-moving settings with their scope, bits-per-attempt argument, sparsity against storage precision, a price per route.
- clarity 7: pass@k and the boundary are built well; LoRA rank, policy gradient, MCMC, low-curvature regions and "the words track" are not.
- sentences 7: precise and scoped, and weighed down by a hedging apparatus that repeats in nearly every sub-section.
- parity 7.5: substance at the level of doc-C; voice a notch more cautious and more self-aware than doc-D.

Findings, most damaging first

1. "This section answers the dive's first question: what RL does to a model." Prose about itself, restating the title, as the fourth sentence. And the section's first sentence is a definition: "RL (reinforcement learning) with verifiable rewards, RLVR, trains a model on tasks where a program checks each answer and the check is the reward (section 9, RLVR & GRPO)." The opening should be the claim that now sits in paragraph two: "RLVR mostly sharpens".
2. "Our reading of these studies:" (twice), "Our reading:" (twice), "Our reading, from the definition of pass@k:", "Our reading, which sets the choice:", "(our reading)", plus "in the studies read here", "The studies read tested four routes", "in the sources located for this research", "in any of the papers read", "in the studies read". About a dozen provenance labels. The owner's fault 5 exactly: the writer's derivation needs one plain clause, once. Here it is a refrain, and it makes the section's strongest conclusions sound like the least certain.
3. "The studies read tested four routes" against the table titled "Three ways to buy sharpening back per query". Four in the prose, three in the table; the learned verifier is folded into the first row without saying so. The table also puts "Capped by the base model's pass@K" in the column "Where it was shown", which it does not answer, and names "Qwen2.5-1.5B", a model the prose never mentions.
4. "The Qwen2.5-Math case shows why each of the three checks matters." Throat-clearing as an entire paragraph. Then "Our reading of these studies turns the three checks into questions:" introduces three items that are statements.
5. "In Thinking Machines' runs (Llama-3.1-8B base; MATH, a competition-math benchmark, and grade-school math), rank-1 LoRA matched full fine-tuning for policy gradient, the RL update driven by the advantage (how much better an attempt scored than expected)." The sub-section opens on its evidence, with two parentheses and three unbuilt terms (rank-1, LoRA, policy gradient), before the claim ("The size of the update follows from how little a reward says"), which is the sentence that should lead.
6. "Does RL change only a few weights? Three positions": three papers summarised at equal weight ("One study ... A second paper ... A third ..."), including "Optimiser state was not analysed in any of the papers read." which is a stray fact. The practical payoff is one sentence at the end. A literature review inside an argument; "low-curvature regions" is unexplained.
7. "The key reads the curves from left to right." and "Marker 4 in the diagram above is that ceiling." Sentences about the figure's furniture.
8. "AIME on a Qwen2.5 base carries the model-family caveat of the trust check below (our reading)." A forward reference to a caveat the reader has not met, with a label.
9. "on one math benchmark (Minerva) with a 32B model, the base model solved about 9% more problems than the RL model at k = 128". Nine percentage points or nine percent more? The sentence that says the gap is "large enough to plan around" leaves its unit ambiguous.
10. "DeepSeek dropped PRMs as a training reward: steps are hard to define, step correctness is hard to label at scale, and a model-based PRM leads to reward hacking ... Against the compute it adds in large-scale RL its benefit was limited, while a PRM still helps rerank the top answers". A digression about training rewards inside a paragraph about inference-time selection; only the last clause belongs.
11. "It uses MCMC (Markov chain Monte Carlo) to resample blocks of tokens according to their base-model likelihoods". An expanded acronym with no explanation, at the one place the sampler's mechanism is described.
12. "The curve is a menu." A coined label as a run-in heading; the next sentence explains a ceiling, which is a different image.
13. Last sentence: "Section 23, Cost per Improvement, prices the per-query route against training, and the words track from section 14, A Text Loop Is RL on the Context, onward takes up what a loop can learn that RL mostly does not: instructions, procedures and facts." A long pointer after a strong ending, with "the words track" unexplained.
14. Heading "How far the evidence reaches" and its first sentence "No frontier lab has published, in the sources located for this research, a comparison ..." The scoping is right; the embedded clause is the log again.

What is good: "ProRL ... solved 28% of questions in one attempt against 4% for its base model; at 1,024 attempts the base model reached 40% and ProRL 30%"; "so the entropy curve is the large-k loss seen from inside the run"; "A gain shown on Qwen2.5-Math is a gain on that family until another family reproduces it."; the closing "So measure before you train." paragraph.

---

## Across the batch

### Groups by quality

Group 1, sets the bar: doc-D and doc-C.
Both open on a claim and prove it with arithmetic the reader can redo, and nearly every paragraph ends on something the reader would do or decide. doc-D does it while teaching from zero (symbols defined before each formula, toy numbers labelled, measured evidence kept apart from the bound). doc-C does it at higher density and assumes the vocabulary; it is the stronger argument per line and the weaker teacher.

Group 2, at the bar with visible blemishes: doc-F and doc-G.
doc-F has the best sub-headings in the batch (each is the claim) and a number plus a setting per section; it loses to group 1 on the site map placed in the middle of the argument and on one sub-section whose evidence shows the opposite case from its heading. doc-G has group 1 substance; it loses on an opening that defines and announces, and on a provenance refrain ("our reading", "the studies read") of about a dozen instances.

Group 3, weaker: doc-B, doc-E and doc-A.
- doc-B argues well for a screen, then hands over to a fifteen-row table and a question list that is a table of contents. Its private vocabulary ("part", "fills first", "loses with its machine", "shape", "nodes that talk") reads as a primer and makes the header line hard to parse.
- doc-E has one paragraph as good as anything here (the 412 FLOP/byte anchor) inside a section that otherwise catalogues vendor mechanisms in jargon and ends on a tour of the dive. Its title and two of its headings are outline labels.
- doc-A has the right frame and one good worked case; half of it is a catalogue of other people's GPU-hours with no sizing rule, a form manual for the calculator, and the heaviest "our arithmetic" bookkeeping in the batch.

### What separates the groups

1. Whether the middle keeps arguing. Group 1 never hands the reader a list to interpret alone; group 3 does at the centre of each file (doc-A's run catalogue, doc-B's table, doc-E's delivery catalogue).
2. Whether the prose talks about the page or the log. doc-D and doc-C do it a handful of times; doc-A and doc-G do it constantly ("our arithmetic", "our reading", "located in this research"); doc-E and doc-B end on tours of other sections; doc-F puts the tour in the middle.
3. Whether the vocabulary is the field's or the writer's. doc-D teaches the field's words (chunk, mode, head, horizon). doc-B replaces known words with coined ones. doc-E and doc-C use the field's words without teaching them.
4. Whether headings are claims. doc-D, doc-F and most of doc-C: yes. doc-E ("Thesis and Framing", "Heterogeneity is the organizing fact", "What to ask instead") and doc-A ("What a training run costs", "What each query costs"): labels.

### Direct answer

Yes. A careful reader would tell some files from others by quality alone, independent of topic.

- doc-A, doc-B and doc-E would be picked out as weaker. doc-A by its catalogue middle and its bookkeeping; doc-B by its primer vocabulary, its table at equal weight and its index-style ending; doc-E by its jargon density, its outline-label headings and its table-of-contents paragraph.
- doc-F and doc-G would not be picked out by quality. Each has a signature that identifies it (doc-F's route map, doc-G's "our reading" refrain), and both would be noticed on a close read, but neither drops the file below publishable beside doc-D and doc-C.
- doc-D and doc-C are the reference. They differ from each other in clarity, not in quality of argument: doc-C would lose a level 100 to 200 reader that doc-D keeps.

### Verdicts

- doc-A: distinguishable: weaker. Reason: the argument stops for a catalogue of runs, the thesis is buried under "Our reading of these figures", and provenance labels appear in almost every paragraph.
- doc-B: distinguishable: weaker. Reason: a header line that does not parse on first read, a coined primer vocabulary, a contradiction (149 ms against 33.3 ms) left open for two sub-sections, and a reference table plus question index where the proof should continue.
- doc-C: sets the bar. Reason: one claim, proved with numbers across eight chips, consequences in every paragraph. Its fault is clarity for the stated reader, not quality of writing.
- doc-D: sets the bar. Reason: argument from the first sentence, a worked number in the second paragraph, formulas with intuition and decomposition, an ending the reader can act on.
- doc-E: distinguishable: weaker. Reason: outline-label title and headings, a jargon catalogue the stated reader cannot follow, a table of contents in prose; one excellent paragraph does not carry the section.
- doc-F: not distinguishable by quality from the best files. Reason: claim headings, a number and a setting in each sub-section, an actionable ending. Fix the route map placement and the fourth sub-section's evidence and it is group 1.
- doc-G: not distinguishable by quality from the best files, narrowly. Reason: level 400 substance and a strong ending; the definitional opening and the "our reading" refrain are the only things that would give it away, and they are frequent enough that a strict reader could argue it down a group.


Key to the blind file names: doc-A feedback dive Cost per Improvement; doc-B this dive section 1; doc-C silicon dive Roofline; doc-D this dive section 4; doc-E silicon dive Thesis and Framing; doc-F this dive section 2; doc-G feedback dive What RL Does to a Model.
