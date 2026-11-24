# Adversarial review, round 2 (blind, eight files)

| File | Argument | Depth | Clarity | Sentences | Parity | Verdict |
|---|---|---|---|---|---|---|
| doc-A (Getting Started: What Changes When the Model Drives a Robot) | 8 | 7 | 8 | 7 | 7 | distinguishable: weaker (narrowly) |
| doc-B (KV Cache and FlashAttention) | 7 | 9 | 6 | 7 | 7 | distinguishable: weaker (narrowly) |
| doc-C (Learning From Demonstrations) | 9 | 9 | 9 | 8 | 9 | sets the bar |
| doc-D (What RL Does to a Model) | 9 | 9 | 7 | 7 | 8 | not distinguishable by quality from the best files |
| doc-E (One Arm, Fifteen Workloads) | 8 | 8 | 6 | 7 | 7 | distinguishable: weaker (narrowly) |
| doc-F (Thesis and Framing) | 9 | 7 | 6 | 8 | 8 | not distinguishable by quality from the best files |
| doc-G (Cost per Improvement) | 9 | 8 | 8 | 7 | 8 | not distinguishable by quality from the best files |
| doc-H (The Robot as a Computer) | 8 | 9 | 9 | 8 | 8 | not distinguishable by quality from the best files |

Scale used: 8 is publishable beside the best files here; 6 is competent and flat. No file scores below 6 on any axis.

---

## doc-A: 2. Getting Started: What Changes When the Model Drives a Robot

Scores
- argument 8: the first sentence makes a claim ("experience with language models points the wrong way on each") and each of the four parts proves its share with a number; the last fifth is a route map, not argument.
- depth 7: right for an entry section, but each of the four facts stops at one worked number and hands off to a later section.
- clarity 8: every term is built before use; two coined words ("fills", "part") carry more than they are given.
- sentences 7: many are good ("The rows are almost nothing."), several are convoluted or do bookkeeping.
- parity 7: the route-map ending and the list-shaped header set it a step below C and H.

Findings, most damaging first
1. "None of the three common reasons for reading needs all 30 sections." and the block that follows ("World models. To learn what a world model is for ... read sections 3, 4, 6 and 7, then 16 and 22. The data, simulation and AWS sections can wait." / "They assume the four ideas and section 1, and nothing else." / "Sections 5, 8 and 19 are on no route"). The section ends as a tour of the page: section numbers at equal weight, no consequence. "World model" is used as a destination before the reader knows what one is, and JEPA is defined inside a navigation sentence. The section's real ending is the nvidia-smi paragraph; the route map should be a clearly separate navigation aid with one sentence of prose, or the prose should end on the reader's action ("time one call on the robot's computer") and leave the map as a figure.
2. Header description: "Size a robot job, or read a robot-model result, from four facts: the model answers to a 33.3 ms period, its data is video, it is sized once to train and again to run, and a machine fills one part at a time". A four-item list in a description, and the fourth item is opaque before the body explains it. "a machine fills one part at a time" reads as a riddle on first contact, in the description, in the first paragraph and as a heading.
3. "The remedy is to pay for the instance whose full part is the part being bought: decoding belongs on CPU instances, or on the GPU instance with the most cores per GPU." The first clause is circular to the point of being unreadable; the second clause is the actual advice and should stand alone.
4. "Section 1 counts one case by hand, section 20, Fifteen Workloads, Five Shapes, does it for every job in the loop, and the Silicon, Memory & Inference dive covers how a GPU and the memory hierarchy execute a model." Prose about the page, three pointers in one sentence, placed where the paragraph's conclusion should land.
5. "LeRobot is the open-source robot-learning library it is recorded, trained and run with, and several of the numbers that follow are its defaults." The second clause is bookkeeping about the text to come.
6. "Published figures rarely give that: NVIDIA's benchmark of its robot model reports medians, and neither it nor our own runs hold a figure for the slowest calls." "our own runs" appears with no prior mention of any runs; the reader does not know what was run. Either drop it or say what was measured.
7. "LeRobot's hardware guide times one of its policies, Diffusion Policy, at 0.167 s per update at batch 32 on 4 H100 GPUs, which is 32 / 0.167 = 192 samples a second." A careful reader cannot tell whether batch 32 is per GPU or in total, and the conclusion "about one CPU core keeps four GPUs fed" depends on it. The step is a leap presented as arithmetic.
8. "A computer is several parts with separate rates: CPU cores, memory, the units inside a GPU that do arithmetic, the circuits inside it that decode video, storage, the network." Primer register for a reader who runs Kubernetes; "the units inside a GPU that do arithmetic" is a circumlocution where the name plus a clause would do.
9. "What a missed period does depends on a setting." Flat signpost sentence; the next sentence carries the content on its own.
10. "The usual check misleads here." Same: a signpost that could be the fact ("nvidia-smi's utilisation figure counts time, not capacity").
11. Sub-heading "Where to go next, by the question you have" with description "Go straight to the sections your question needs, and know what you can leave for later". Both describe the page rather than state a payoff.

---

## doc-B: KV Cache and FlashAttention

Scores
- argument 7: the opening ties the page to one ratio and names a deciding figure, but the back half (generations, silicon mapping) is a reference manual.
- depth 9: formula, worked sizes, config keys, flags, measured waste figures.
- clarity 6: attention, keys and values, "global cache", RoPE, "compressed sparse attention", SFU units and "ridge point" are used on the assumption the reader arrives knowing them.
- sentences 8 in the first half, 6 in the second; 7 overall.
- parity 7: denser in numbers than most files, but several blocks list facts at equal weight.

Findings, most damaging first
1. "Pick the generation by GPU. FlashAttention-2 supports Ampere, Ada and Hopper GPUs. FlashAttention-3 is a beta built for Hopper (H100); it overlaps asynchronous data movement and Hopper's warpgroup matrix multiplies (wgmma) with the softmax. FlashAttention-4 is written in CuTe DSL (NVIDIA Compilers and Kernel Tooling), targets Hopper and Blackwell (H100, B200) and installs with pip install flash-attn-4. It ships as betas; fa4-v4.0.0.beta35 came out on 2026-10-14." Release notes. A beta tag and a pip command sit at the same weight as the fact that decides the choice (which generation runs on which GPU). "warpgroup" and "CuTe DSL" are named and not explained.
2. "from 327,680 bytes for Llama 3.1 70B to 890 bytes of global cache for DeepSeek-V4.1-Flash." "global cache" is used in the second paragraph and is never defined; fifty lines later the reader learns only that "a separate sliding-window cache sits outside that figure". The headline 300x comparison therefore compares a whole cache with part of one, and the page does not say how large the excluded part is.
3. "What it stores. Each layer's attention produces a key (K) and a value (V) vector per KV head for every token, and each new token attends to all the earlier ones. The server computes them once and keeps them, so the cache grows by one entry per token in every layer." For the stated reader this is the whole explanation of attention, keys, values and heads. What a key is for, what "attends" means and what the cache saves (recomputing every earlier token at every step) are missing, so the formula that follows is a recipe, not a mechanism.
4. "Why KV-cache management is the second lever after batching ... Every technique on this page raises that cap: fewer KV heads (GQA), a compressed latent (MLA), sliding windows and linear-attention layers, fewer bits per entry, and paging." A recap box that restates the first paragraph and talks about the page; the heading description above it already says "every lever on this page raises the batch it can hold".
5. "How this maps to the silicon stack" with "vLLM and TensorRT-LLM both page the KV cache." and "In TensorRT-LLM, KvCacheConfig(dtype='fp8') stores the cache in FP8, and NVFP4 KV is also listed." A vendor-by-vendor appendix repeating facts stated two paragraphs earlier. The one fact with a consequence (host_cache_size defaults to 0, so nothing spills unless you set it) is buried in its last paragraph.
6. "From Llama 3.1 70B to DeepSeek-V4.1-Flash's global cache the spread is more than 300x: the same HBM holds 368 times as many tokens of global cache." Two figures for one ratio in one sentence; say 368 and stop.
7. "Read the table as the formula at work." Prose instructing the reader how to read the page.
8. "while the special function units (SFUs) that compute the softmax's exponentials went from 4.5 to 5 TeraExponentials/s." The unit is not explained and the comparison is left undone: the sentence needs "2.3x against 1.1x" to make its point.
9. "it saves the most and can cost quality" Vague where the page is otherwise numeric.
10. "Which one dominates depends on the deployment." Flat topic sentence; the two cases that follow do not need it.
11. "Mixtral 8x7B, a mixture of experts (MoE) with eight experts per layer, stores the same 128 KiB per token as Mistral 7B, because its layers and KV heads have the same shape." The useful consequence (experts multiply weights, not cache) is implied and not said.
12. Ending: "Flash as a Cache Tier for Inference sizes host DRAM and local NVMe for that tier ... and the KV Offloading and LMCache section of the vLLM Inference Engine dive covers the software that moves it." The page ends on two cross-references. The natural ending (read config.json, compute bytes per token, then size the batch) sits in the middle of the page.

---

## doc-C: 4. Learning From Demonstrations: Why Copying Drifts and What Fixed It

Scores
- argument 9: thesis in sentence one, the square law by sentence four, 600 to 6 decisions and 1% to 44% in paragraph two, and the whole section is organised as "two changes, and their bill".
- depth 9: bound, loss functions, defaults, where code overrides paper, per-call timing split, a symptom-to-setting table.
- clarity 9: every formula has intuition first and a term-by-term reading after; symbol clashes (k, epsilon, the two clocks) are flagged at the switch.
- sentences 8: mostly consequential; a provenance tic and a few muddled lines.
- parity 9: the best file in the batch.

Findings, most damaging first
1. "How each failure looks at the bench is our reading of its mechanism, here and in the closing table: this one is a smooth, confident reach that closes the gripper beside the block." Bookkeeping and self-reference fused to the paragraph's best image. Give the image; put the provenance in the citation.
2. "In our reading, sampling one mode is a strong tendency on human demonstrations and falls short of a law." The sentence that should deliver the OpenVLA-OFT lesson is muddled: "sampling one mode is a strong tendency" does not parse as a claim. Say that a regression head with chunks reached 97.1%, so a generative head is not always required.
3. "pi0 predicts 50 actions and, as its authors report, plays 25 of them on 50 Hz robots before it calls again." / "as the authors report" (table) / "by our count" (twice) / "The authors report" (FAST, three sentences running). Attribution in the sentence where the citation already carries it; repeated often enough to be a tic.
4. The symbol paragraph before the ACT loss ("ACT's loss has one term for each of those two jobs ... and its default beta is set against that mean."). Eleven symbols defined in one unbroken paragraph, ending on an implementation footnote about mean versus sum. It follows the rule (symbols before formula) and still loses the reader; the LeRobot mean-versus-sum note belongs after the formula.
5. "A policy gives the machine two jobs of different shape, training and the call on the arm (section 20, Fifteen Workloads, Five Shapes), and both are matrix arithmetic on a GPU's tensor cores." The penultimate paragraph switches to another section's vocabulary ("shape", "tensor cores", "single-node job") and reads as glue to the compute sections; it is the flattest paragraph on the page.
6. "The time of one call, measured on your GPU, has to stay under half the duration of the actions it plays, or the next call cannot finish before the arm runs out (section 17, Running on the Robot, works the rule)." The closing rule introduces a factor of one half that nothing on the page derives; the stated reason would justify "under the duration", not "under half".
7. "Every policy described here is built on the first, and most of them on the second." Mild self-reference in the opening paragraph.
8. "The table gives each paper's own figures. Each row was timed on a different GPU, so compare within a row." The first sentence is about the page; the second is the useful one.
9. "The tensors are small." (expandable panel) An empty lead sentence.
10. "1% to 44%" is landed six times (description, paragraph two, heading description, ablation, the chunk arithmetic, the ending). Repeating the strongest number is right; six is past the point where it reads as intent.

---

## doc-D: 10. What RL Does to a Model

Scores
- argument 9: one question, one instrument (the pass@k curve), a claim (RLVR mostly sharpens), the exceptions, and a decision at the end.
- depth 9: measured crossings, question-level counts, storage-precision caveats, per-query prices.
- clarity 7: the weights section assumes LoRA rank, policy gradient and advantage, each handled in a parenthesis; several forward references.
- sentences 7: strong when stating results, weakened by "our reading", "the studies read" and signposts.
- parity 8.

Findings, most damaging first
1. "This section answers the dive's first question: what RL does to a model." and "The term it turns on is the capability boundary". Two self-referential sentences in the first two paragraphs. The first restates the title; the second can simply define the term.
2. "Our reading of these studies:" / "Our reading:" / "Our reading, from the definition of pass@k:" / "Our reading, which sets the choice:" / "(our reading)" plus "the studies read here", "the studies read", "the papers read", "in the sources located for this research". Seven "our reading" markers and four references to the reading process. One plain clause, once, is the standard; here the provenance voice competes with the argument on every screen.
3. "The studies read tested four routes, and the base model's own pass@k curve sets their ceiling." followed by a table titled "Three ways to buy sharpening back per query". The prose says four, lists four bold items of which the first ("The curve is a menu") is not a route, and the table says three. The table also cites "Qwen2.5-1.5B", which the prose never mentions.
4. "In Thinking Machines' runs (Llama-3.1-8B base; MATH, a competition-math benchmark, and grade-school math), rank-1 LoRA matched full fine-tuning for policy gradient, the RL update driven by the advantage (how much better an attempt scored than expected)." The section opens on its most compressed sentence: two parentheses, three undefined ideas (rank-1, LoRA here, policy gradient) and no intuition first. The reader meets the result before the reason.
5. "Assuming one bit per completion, their run on MATH with about 10,000 problems and 32 samples each had about 320,000 bits to absorb, against about 3M parameters in a rank-1 LoRA adapter on Llama-3.1-8B". The comparison stops before its conclusion: the sentence never says that 320,000 bits fit ten times over in 3M parameters, which is the point.
6. "The Qwen2.5-Math case shows why each of the three checks matters." Signpost opening a section; the case can start directly.
7. "The key reads the curves from left to right." Prose about the figure.
8. "AIME on a Qwen2.5 base carries the model-family caveat of the trust check below (our reading)." A forward reference to a caveat not yet explained, in a parenthesised provenance voice.
9. "On their information argument, SFT (supervised fine-tuning, training on target answers token by token) arguably supplies information on every token of its target". "On their information argument" and "arguably" double the hedge.
10. Sub-heading "Does RL change only a few weights? Three positions". A taxonomy heading; the finding ("the changes are small enough for bf16 rounding to hide") is the last sentence of the block and should be the heading.
11. "The gap at the right edge is large enough to plan around: on one math benchmark (Minerva) with a 32B model, the base model solved about 9% more problems than the RL model at k = 128". "about 9% more" is ambiguous between points and relative.

---

## doc-E: 1. One Arm, Fifteen Workloads: What Each One Runs On

Scores
- argument 8: a real thesis (two questions place any job) and a worked count by paragraph two; the middle is a fifteen-row table that the prose then annotates.
- depth 8: measured GB/s against demand, stall share, AV1 on H100, vCPUs per GPU, RT cores, Spot notice.
- clarity 6: paragraphs of 200 to 300 words, coined vocabulary ("fills first", "part", "shape", "market") and a worked example whose own numbers raise an unanswered question.
- sentences 7: individually well made, packed too tightly, with provenance asides.
- parity 7.

Findings, most damaging first
1. The first paragraph ("Teaching one small robot arm one task takes about fifteen computing jobs ... That picks the scheduler and the way the capacity is bought."). One block carries the scene, four example jobs, the machine model, the failure it predicts, and two questions each with sub-questions. The thesis ("Two questions place each job before it is benchmarked") arrives in sentence seven. Split at "Two questions" and it becomes a strong opening.
2. "It is six 1024x1024 float32 matrices multiplied in turn, 25.2 MB of weights, more than the processor's caches hold; it stands in for a policy, and the arm's own runs on a GPU." The worked example undercuts itself in a subordinate clause: the stand-in runs on a CPU core, the real policy on a GPU, and the reader is not told why the count still transfers.
3. "On the same core, loops that do nothing but move arrays larger than the caches reached 9.25 GB/s reading and 11.71 GB/s in a STREAM-style streaming test, and those two figures are that core's measured memory limits. The program's demand sits between them, at 9.8 / 11.71 = 84% of the higher one". Demand of 9.8 GB/s exceeds the 9.25 GB/s "limit"; a limit that is exceeded needs a sentence, and "STREAM-style" is not explained. The reader is asked to accept "between them" as the definition of full.
4. Header description: "Ask two questions of any job in a robot's learning loop, which part of the machine it fills first and what it loses when its machine is taken away, and read off the kind of instance, the scheduler and the way to buy the capacity". Forty-five words, two embedded questions and a three-item list; it says the right thing at twice the length.
5. "The split into fifteen and the sorting by shape are ours, and section 20, Fifteen Workloads, Five Shapes, argues both row by row." Bookkeeping about the writer's grouping plus a pointer, in the paragraph that should land the table.
6. "Faster arithmetic would leave the 62.3% of cycles that wait on memory where they are (our reading), so the figure to read on a machine for this job is GB/s." The parenthesis interrupts the section's main conclusion.
7. Sub-heading "A deadline on one job, 500 independent episodes in another". The reader cannot tell what it promises until both paragraphs are read; the payoff is "three properties decide whether a job can lose its machine".
8. Table, row 4 shape: "Inside the training job it feeds; always on when run as a tier of its own". The five shapes are defined in the paragraph after the table, so every shape cell is read before its term is built, and this cell is not one of the five. Row 11 ("Engine build ... Fan-out") is unexplained for a job that runs once on one robot computer.
9. "Workloads 1 to 12 are the ones the owner of one arm can run ... the last three reach that owner as finished models". The table's last row is "14, 15", so "the last three" makes the reader count back to 13.
10. "The questions that come first when this work is sized each turn on a row of the table." Clumsy signpost about the page.
11. "Shape decides the market as much as the scheduler." "market" is not defined (it means how capacity is bought: Spot or on-demand).
12. "And part and shape are separate axes." A taxonomy statement; the laptop-versus-standing-tier example after it makes the point without it.
13. "Split every stage that way and the loop is the fifteen rows of the table." Prose about the table.

---

## doc-F: Thesis and Framing

Scores
- argument 9: a tool in sentence one ("predict how an inference workload will run on a chip before you benchmark it"), the ratio worked in paragraph three (412 against 2 to 10), restated at the end.
- depth 7: an introduction; one number worked fully, the rest named.
- clarity 6: the "Instruction delivery" and "Shape fit" paragraphs are a run of undefined terms.
- sentences 8: short, declarative, consequential.
- parity 8.

Findings, most damaging first
1. "A GPU SM (Streaming Multiprocessor) issues from a warp scheduler and hides a stalled warp's latency by running other warps." and the paragraph around it (BTB, NEFF, "fires a task", "task picker"). Four architectures in five sentences, each with a term the stated reader does not have ("warp" is never explained). The paragraph lists how each chip does it at equal weight and draws no consequence.
2. "Blackwell's tcgen05 instructions read TMEM in fixed data-path layouts. Trainium's systolic array consumes tiles the Neuron compiler sizes." Same fault: instruction names and "systolic array" undefined; the paragraph's one usable sentence is its last ("A kernel with the wrong tile under-fills the unit").
3. "What to ask instead" section: "Roofline and Arithmetic Intensity computes ridge points across chips and precisions. Memory Hierarchy Primer and Anatomy of a Kernel Execution walk the tiers; HBM and the Bandwidth Wall, DDR5, MRDIMM, LPDDR5X and CXL, High Bandwidth Flash and Flash as a Cache Tier for Inference take the ones that hold weights and KV cache." A tour of the dive by section title, eleven titles in one paragraph. Its description, "The question to bring to every chip, and where the dive answers it", announces the tour.
4. Title "Thesis and Framing". A label for the writer's outline; it says nothing the reader can use. The description under it carries the payoff the title should.
5. "This deep dive gives you a way to predict how an inference workload will run on a chip before you benchmark it." The claim is good; the subject is the document. "You can predict..." loses nothing.
6. "A GPU vendor ships the thesis." Refers to the page's own thesis as an object.
7. "Each weight feeds one multiply-add per sequence in the batch, so with 8-bit weights at batch 1 to 5, decode sits at 2 to 10 FLOP per byte". The step from one multiply-add to 2 FLOP per one-byte weight is left to the reader, at the exact point the section's number is derived.
8. "until a fixed latency floor sets the step time." An unexplained limit attached to the central claim.
9. Expandable "Check that the mechanism exists before you port a tuning result": "On WSE-3 the compiler fixes the routes. A model larger than one wafer is split at layer boundaries across several CS-3 systems." Two facts with no link to the panel's point; only the final sentence (the systolic array has no speculation depth) makes it.
10. Sub-heading "Heterogeneity is the organizing fact". An abstraction; the description below it is concrete and should be the heading's content.
11. "The anchor number." / "Sparse aside:" Labels that name the prose's role instead of its content.
12. "the bottleneck is HBM bandwidth staging weights into the tensor pipe." "tensor pipe" is jargon used once.

---

## doc-G: 23. Cost per Improvement

Scores
- argument 9: the choice and its deciding variable in paragraph one, a priced breakeven (665,000) in paragraph two, the formula in paragraph three.
- depth 8: published GPU-hours, token multipliers, caching rates, the idle-time caveat that moves the breakeven.
- clarity 8: followable with no outside knowledge; the training-cost block detours into algorithm definitions.
- sentences 7: clear, with a steady drip of "our arithmetic" and calculator instructions.
- parity 8.

Findings, most damaging first
1. "The published runs collected here range from a few hundred GPU-hours to well over a hundred thousand, and model size alone does not set the bill." The claim is stated and then followed by a catalogue of seven runs (Dr. GRPO, ProRL, R1, DeepSWE, DAPO, GEPA, Qwen3 distillation) with no sentence saying what does set the bill. It reads as a table written out as prose.
2. "A minimal recipe of Dr. GRPO (GRPO Done Right), the GRPO variant of section 9 that drops the division by each answer's length and by the group's standard deviation" and "DAPO ... is the GRPO variant of section 9 that raises the upper clip bound, keeps only prompts whose group of answers is neither all right nor all wrong, and averages the loss over every token in the batch." Algorithm definitions that have no bearing on cost, inserted to satisfy an expand-at-first-use rule; they bury the GPU-hour figures.
3. "216 GPU-hours by our arithmetic" / "(our arithmetic)" / "about 20,400 GPU-hours by our arithmetic" / "2.8 and 4.9 times by our arithmetic" / "(our arithmetic)" twice more / "our arithmetic from the paper's figures" / "The inputs are the paper's; the breakeven and the server time are ours." Eight provenance markers for multiplications a reader can redo; one clause per derived headline figure is enough.
4. "Start with the queries you expect the artifact to serve ... Choose "Your own numbers" in a column to clear it. A preset fills only the values its source reports, each with its citation under the field, and any field you edit becomes yours." A user manual for the widget, in the prose.
5. "The calculator at the end of this section redoes it with your rates" / "The calculator takes your hours as an input." / "so the calculator takes it as an editable input on the per-query side." / "The calculator's one same-model pair of training budgets is GEPA". The prose keeps describing the tool; the last of these makes the widget the grammatical subject of a research finding.
6. "One rate needs care." and "The third option trains nothing." Signposts; the second also introduces a "third option" in a section framed throughout as two.
7. "No typical job length for any model was located in this research" and "The one published comparison with RL from the same checkpoint located in this research". Research-process bookkeeping; the first is a legitimate scoped hedge, the second pads.
8. "that record is the verl team's run, not the DAPO authors'." A provenance aside in "not A" form that the citation already carries.
9. Ending: "then read the result: it names the side of the breakeven you are on and, where the cheaper option scores lower, what each point of quality costs at your volume." Ends on what the widget prints, not on what the reader does with the answer.

---

## doc-H: 3. The Robot as a Computer: Inputs, Outputs and a Deadline

Scores
- argument 8: a strong frame ("twelve numbers and two video streams on a clock", "Lateness on a robot is a distance") with 25 mm in the first paragraph; the observation and action sections are a hardware reference between the argument's two halves.
- depth 9: units, registers, gains, timing report, a four-term latency budget worked to 143.4 ms and 35.9 mm.
- clarity 9: every term built before use, formulas preceded by intuition and followed by a term-by-term reading.
- sentences 8: concrete and consequential, with a glossary cadence and several provenance asides.
- parity 8.

Findings, most damaging first
1. "Capture slot, dated 2026-11-20" / "What will be shown here: Camera footage of the real leader and follower at the bench." An unfilled placeholder is on the rendered page. To a reader this is the clearest sign of an unfinished draft in the batch.
2. "Take the longest value of the two waits, NVIDIA's median for the call, and the model on the Thor beside the arm, so no network: 33.3 + 76.8 + 0 + 33.3 = 143.4 ms". The sentence that sets up the section's main worked number does not parse on first reading: three assumptions run together as a list with the verb doing duty for only the first.
3. "Everything the robot knows at one instant is called an observation." / "Driving a robot by hand like this is teleoperation." / "A robot's sense of its own body is called proprioception" / "That model is called a policy." / "a run called a rollout" / "a step called inverse kinematics". The "X is called Y" pattern recurs through the middle sections and gives them a glossary register; several of these terms are then used once.
4. "(the split into four is ours)" then the formula title "Control-latency budget (our accounting)" then "Source: our accounting". The same provenance stated three times in ten lines; also "(Both angles are made up.)", "(a made-up tolerance)", "chosen for the arithmetic; no one measured it", "By our arithmetic", "and it has not been measured".
5. "Servo limits, for reference: gripper caps and firmware cut-outs" and "A second published ladder: Figure's Helix 02". Two panels that announce themselves as reference material; the Helix panel ("Its newer Helix 2.5, posted 2026-09-17, states none.") changes nothing the reader does.
6. The PID block. The textbook formula and three-term reading take a full screen to reach one usable fact ("I = 0 switches the integral term off ... a joint holding a load can sit slightly short of its goal"), which no later part of the section uses. It sits at the same weight as the latency budget that decides the hardware.
7. "is the 1,440 bytes per second of the opening." Self-reference to the page's own structure.
8. "It leaves out camera exposure, transfer and decoding, the time on the serial bus and the servo's own response, and the sources read on 2026-11-20 give a figure for none of them." The dated research note belongs in the citation.
9. "Put numbers on that condition." Imperative signpost.
10. Two different GR00T latencies carry the argument (76.8 ms on Thor in the opening and the budget, 149.0 ms on Orin in the missed-deadline and sizing sections) with no sentence relating them; a reader can take them for a contradiction.
11. "Joint loop | Position controller inside each servo; rate not stated in the documents read". Table cell bookkeeping.
12. Sub-heading description "Place any model or controller by its rate, and know what each loop has to keep supplied". "keep supplied" is opaque until the caption explains it.

---

## Batch answer

Groups by quality alone

- Group 1, sets the bar: doc-C. It is the only file where the argument, the formulas, the configuration values and the bench symptoms are one continuous line of reasoning, and where the reader is never asked to hold an undefined term.
- Group 2, publishable beside it: doc-H, doc-D, doc-G, doc-F. Each opens on a claim with a number on the first screen and ends on an action. Each has one structural weakness: H a hardware-reference middle and a visible placeholder; D a provenance voice ("our reading") on every screen and a compressed weights section; G a catalogue of training runs and prose about its calculator; F two paragraphs of undefined chip vocabulary and a section-title tour.
- Group 3, one step below: doc-A, doc-B, doc-E. A ends on a 30-section route map and leans on a coined phrase. E packs its thesis into 200-word paragraphs and its worked example raises a question it does not answer. B is the densest in numbers and reads as a reference manual from the FlashAttention generations onward, with core terms never built.

What separates the groups: not the opening (all eight now open on an argument, and none opens on a definition and a tour). The separator is whether the argument holds through the middle and the end. Group 3 files switch mode partway (to navigation, to a table annotated row by row, to vendor reference), and they ask the reader to carry coined or undefined terms.

Would a careful reader tell some files apart by quality alone? Only weakly, and not along topic lines. The gap between groups 2 and 3 is one point, and group 3 contains files from more than one dive (two on the robot topic, one on silicon), while the best file is also on the robot topic. The four robot files (A, C, E, H) are not separable as a set from the RL files (D, G) or the silicon files (B, F): C and H sit at or above the level of D, G and F. What a careful reader would notice is a shared habit rather than a quality gap: the robot and RL files narrate provenance in the prose ("our arithmetic", "our reading", "made up", "as the authors report", "located in this research"), which the silicon files leave to the citation tag. That tic marks six files as a family; it does not mark them as weaker.

Verdicts
- doc-A: distinguishable: weaker. Narrowly; the route-map ending and list-shaped header are the cause.
- doc-B: distinguishable: weaker. Narrowly; reference-manual second half and unbuilt core terms.
- doc-C: sets the bar.
- doc-D: not distinguishable by quality from the best files.
- doc-E: distinguishable: weaker. Narrowly; overpacked paragraphs and a worked example with a loose end.
- doc-F: not distinguishable by quality from the best files.
- doc-G: not distinguishable by quality from the best files.
- doc-H: not distinguishable by quality from the best files, once the capture placeholder is filled or removed.


Key to the blind file names: doc-A this dive section 2; doc-B silicon dive KV Cache and FlashAttention; doc-C this dive section 4; doc-D feedback dive What RL Does to a Model; doc-E this dive section 1; doc-F silicon dive Thesis and Framing; doc-G feedback dive Cost per Improvement; doc-H this dive section 3.
