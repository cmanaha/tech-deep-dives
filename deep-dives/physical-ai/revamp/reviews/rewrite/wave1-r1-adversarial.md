# Adversarial review, batch w1r1 (blind)

Seven files, each read end to end as the stated reader (IT or software, level 100 to 200 on the topic). Scores are 1 to 10; 8 means publishable beside the best files here with no embarrassment, 6 competent and flat.

| file | argument | depth | clarity | sentences | parity | verdict |
|---|---|---|---|---|---|---|
| doc-A (7. JEPA: Predicting in Latent Space) | 9 | 9 | 8 | 8 | 9 | sets the bar |
| doc-B (Roofline and Arithmetic Intensity) | 9 | 8 | 6 | 9 | 8 | not distinguishable by quality from the best files (different in kind: shorter, denser, assumes more) |
| doc-C (5. Vision-Language-Action Models) | 8 | 9 | 8 | 8 | 9 | sets the bar |
| doc-D (4. Learning From Demonstrations) | 9 | 9 | 9 | 8 | 9 | sets the bar |
| doc-E (8. Reinforcement Learning for Robots) | 9 | 8 | 8 | 8 | 8 | not distinguishable by quality from the best files |
| doc-F (9. RLVR & GRPO) | 6 | 8 | 6 | 6 | 6 | distinguishable: weaker |
| doc-G (6. World Models) | 9 | 8 | 8 | 8 | 8 | not distinguishable by quality from the best files |

## doc-A: "7. JEPA: Predicting in Latent Space"

Scores
- argument 9: the first paragraph states a claim (the loss contains no camera frame, so a constant encoder scores zero) and the third prices the planner at 8,000 passes, 16 s, 480 control ticks. Every later block serves one of those two claims.
- depth 9: loss with stop-gradient and EMA worked numerically, both degrees of collapse, VICReg and SIGReg down to the released code, CEM with a redoable toy iteration, pass counts for four planners, code-versus-paper differences. This is level 400.
- clarity 8: almost every symbol is defined before its formula and every toy number is redoable. It slips where four model names arrive on the first screen and in one garbled comparison near the end.
- sentences 8: mostly short and consequential ("Where paper and code differ, the code is what trains."). Pulled down by the drumbeat of "the authors report" and by sub-heading descriptions all cut from one imperative template.
- parity 9: with doc-C, the strongest file in the batch.

Findings (most damaging first)

1. "Name the measure that keeps a JEPA's encoder from returning one vector for every frame, and price its planner in predictor passes before you read a benchmark (the V-JEPA 2, V-JEPA 2.1, RoboJEPA and LeWorldModel papers with the vjepa2 and le-wm code, read 2026-11-20)"
   The payoff is real, but the parenthesis is a bibliography in the header: four paper names and two repository names before the reader knows what a JEPA is. Provenance belongs in the citations. Cut the parenthesis.

2. The sub-heading descriptions are one template, an imperative verb addressed to the reader: "Count the vectors one clip of the arm becomes, and see how little of the clip the encoder is shown"; "Read V-JEPA 2's objective for which weights the gradient may change, and work out how slowly the answers move"; "Recognise the failure that the loss cannot report, in both its degrees, and judge what a slow target and a frozen encoder each cost"; "Follow the measure that trains encoder and predictor together with no second copy, and find the two settings that matter when you run it"; "See what turns a video encoder into a world model for an arm, and why its predictor is trained on its own outputs as well as on real frames"; "Place JEPA training and JEPA planning on a machine from their published figures, and cost the next planner you read about the same way".
   Each alone is acceptable. Seven in a row read as a form being filled in, and "See what turns ..." and "Follow the measure ..." describe the reading rather than state a result. The headings above them already carry the result ("Planning: 8,000 predictor passes to choose one action"); the descriptions should add the consequence, as "Why predicting the latent of a hidden grasp teaches how grippers and blocks move, and what the encoder is free to leave out" does.

3. "The text-conditioned policy pi0.5, which they give as a reference, scores 5%, 0% and 53%: under the planner on the two short skills and about twice its rate on the full task."
   The reader has to rebuild the comparison: the subject of "under the planner" is dropped, and "its rate" could be either system's. The sentence before it ("and that is where latent planning still trails a trained policy") announces the conclusion with a "that" pointing at nothing yet stated. State it straight: the planner wins grasp and lift (67% and 50% against 5% and 0%) and loses the full pick-and-place (27% against 53%).

4. Attribution as a tic. "which the V-JEPA 2 authors report takes 16 seconds", "the authors report 16 seconds for it", "at the authors' RTX 4090 rate", "the authors report pick-and-place succeeding", "its authors report cup grasping", "the authors report success for the 8B model", "as its authors report" (the last four words of the section). Marking a self-reported benchmark once per figure is right; the same clause on the same 16 seconds four times is bookkeeping. The closing sentence in particular ends the section on a provenance clause instead of on the number.

5. "(JEPAs are the latent family of section 6, World Models)"
   A cross-reference in the second sentence of the section, using a label ("the latent family") that only means something to a reader who remembers section 6's taxonomy. It interrupts the best opening in the batch.

6. "V-JEPA 2, Meta's video model, takes its answers from a copy of the encoder that the loss cannot change and that trails the trained encoder slowly. LeWorldModel keeps one encoder and adds one loss term that penalises a batch of latents for bunching together. V-JEPA 2-AC and RoboJEPA, which plan for real arms, train only a predictor on an encoder that is frozen."
   Four model names in three sentences on the first screen, before any is built. The three measures are the point; the names could wait for their sections. A level-100 reader holds the measures and loses the names.

7. "Every job here runs a transformer on a GPU's tensor cores, the part of the chip that multiplies matrices, and the jobs differ widely in size (section 15, Training at Three Scales)."
   The weakest opening sentence of any block in the file: a generality ("differ widely in size") plus a cross-reference. The next sentence (60 GPU-years, 8.4x) is the real opening.

8. "(the V-JEPA 2 paper prints no ratio of its own)" and "The difference is one trial, and the 60% is the newer paper's own figure for V-JEPA 2, where the V-JEPA 2 paper printed 65%."
   Research bookkeeping in the reader's path. The second matters (the baseline moved between papers) but is phrased as a note to self; the first belongs in the citation.

9. "Measuring the miss between latents is what the design buys."
   Awkward: a design does not buy a measurement. The following two sentences say it properly; this one can go.

10. "The loss is the distance between guess and target, which the paper that defined the architecture calls the energy: low when the target is a plausible match for what was seen, high when it is not."
    "Energy" arrives as a synonym the reader must carry for 1,100 lines until the planning objective uses it. Introduced with no reason for a second name. Either say why the word exists (the planner will minimise it) or introduce it at the planner.

11. "The evidence says that weight is forgiving."
    Prose about the evidence. "The weight is forgiving:" followed by the 0.01 to 0.2 range does the same work.

12. Caption: "Follow the blue outline: one tubelet from the stack of frames, to its place in the lattice, to one token, to one latent."
    Minor. An instruction for using the figure, though the second sentence of the caption ("the encoder returns about as many as the clip held in pixels, so it re-describes the clip more than it shrinks it") is a real finding and earns the caption.

Not faults, noted because they are what the weaker files lack: the first-screen arithmetic (800 x 10 x 1 = 8,000; 16 x 30 = 480 ticks); the EMA half-life worked from ln 0.5 / ln 0.99925; the 4.8 minutes of GPU time for one pick-and-place; the ending, which hands the reader two questions and answers them for one model.
## doc-B: "Roofline and Arithmetic Intensity"

Scores
- argument 9: the header states the thesis ("your precision choice moves the ridge further than a chip generation does"), the first paragraph reduces the topic to one question, and the ridge table plus the paragraph under it prove the thesis with 206 to 412 against 295 to 281 to 182.
- depth 8: ridge points for eight chips at three precisions, the 69 tokens-per-second ceiling worked from the spec sheet, the regime flip on Rubin, the three conflicting Rubin bandwidths. Level 400 in content. It is short, and several mechanisms are asserted in one clause each.
- clarity 6: written for someone who already serves LLMs. Decode, prefill, FLOP, Tensor Core, 2:4 sparsity and a row of technique names are used with no build-up, and the roofline itself (attainable rate = the lower of the compute ceiling and intensity times bandwidth) is never stated in words. The stated reader loses the thread at the first figure.
- sentences 9: the most economical prose in the batch. Nearly every sentence carries a consequence ("Below the ridge a workload is memory-bound and extra FLOPS do nothing for it").
- parity 8: argument and sentence quality match the best; ramp-up for a newcomer does not.

Findings (most damaging first)

1. "Where decode and prefill land on an H200, and what one precision step does to the chip and to the workload" and, under the figure, "Decode at batch 1 sits about 200 times below the ridge at either precision."
   Decode and prefill are placed on the chart and reasoned about a full section before "Prefill processes the whole prompt in parallel ..." and "Decode generates one token per sequence per step ..." say what they are. A term used before it is built. The reader this is written for cannot read the figure on first pass. Swap the order, or give each one clause at the figure.

2. "Three quantities. Arithmetic intensity is FLOP per byte of DRAM (dynamic random-access memory) traffic, a property of the workload and its implementation. Peak FLOPS is the chip's arithmetic ceiling at one precision. Peak bandwidth is its DRAM throughput, HBM (High Bandwidth Memory) on every accelerator in this section. The ridge point is peak FLOPS divided by peak bandwidth."
   A definition list opened by a fragment, and it lists four things after announcing three. FLOP (one floating-point operation) is never defined. More important, the model itself is missing: nowhere does the text say that attainable throughput is intensity times bandwidth until that product hits peak FLOPS, which is the one sentence that makes the picture a tool. The figure carries it alone.

3. "A dense model does about 2 FLOP per parameter per token"
   The number every later figure rests on (1 FLOP/byte, 2 FLOP/byte, 128, the 69 tokens per second) arrives with no reason. One clause (each weight is multiplied once and added once) would make it redoable.

4. "Second, GQA (grouped-query attention), KV-cache quantization, FlashAttention-class fusion and speculative decoding speed up decode by cutting the bytes moved per useful FLOP."
   Four technique names in a row, each expanded at most, none explained. The unifying claim at the end is good; the list is a roll-call for readers who already know all four.

5. "One kernel for several operators keeps intermediate tensors in SMEM (shared memory), TMEM (Tensor Memory) or SBUF (State Buffer) instead of HBM."
   Three expanded acronyms that are names, with no statement of what they are (on-chip memories of three different chip families) or why three. "CUTLASS, CuTe and Triton on NVIDIA and NKI (Neuron Kernel Interface) on Trainium emit fused kernels" is the same fault: a roster.

6. "Sparse rates apply only to weights pruned to the 2:4 structured pattern, so every ridge on this page uses the dense rate."
   "2:4 structured pattern" is undefined (two of every four weights zeroed). Also "on this page" is the prose speaking about itself.

7. "The roofline, placed"
   As a sub-heading it means little until the figure has been read. The description under it does the work the title should.

8. "Cerebras Wafer-Scale, Groq, SambaNova and Dataflow and Compute-in-Memory cover each." / "KV Cache and FlashAttention walks that trade-off, and Flash as a Cache Tier for Inference covers a KV cache that outgrows HBM." / "NVIDIA Compilers and Kernel Tooling and AWS Compilers and Kernel Tooling cover them." / "Quantization and Precision covers the full ladder and the numerics that make FP8 and FP4 usable at model scale."
   Four signpost sentences in a short section, and the last one is the final sentence of the file. The section ends on a pointer to another section. The sentence before it ("Before you pick a precision, read your chip's row in the ridge table ...") is the real ending.

9. "The tables use the individual-GPU figures because FLOPS and bandwidth there come from one table."
   Method note in the body. It is one clause, said once, and the paragraph it sits in ends on an instruction ("Compute the ridge from the system you are buying"), so it is minor.

10. "It still works seventeen years on because it reduces that question to a ratio of two figures every vendor publishes."
    Good sentence, with one slip: the count will be wrong next year. Minor.

What it does that the weaker files do not: the thesis is in the header; the strongest number (about 200x below the ridge) lands three times; the Rubin paragraph turns a research discrepancy into an instruction instead of narrating the research.
## doc-C: "5. Vision-Language-Action Models: Reading the Parameter Count and the Hertz Figure"

Scores
- argument 8: the best first screen in the batch. Sentence one is a claim ("the rate in hertz printed beside it can be the speed of neither") and paragraph two proves it with 1000 / 63.9 = 15.6 chunks and 15.6 x 16 = 250 actions. The argument holds through latency and fine-tune memory, then the last third turns into a release catalogue.
- depth 9: one call as 1 backbone pass + 10 head passes, the latency split (14 + 32 + 27 = 73 ms), a 2.6x spread across three published numbers for one model on one device, frozen-versus-unfrozen memory (35 GB, 40 GB, 80 GB), a silent full fine-tune behind a LoRA flag. Level 400, and practical.
- clarity 8: backbone, head, chunk, prefix, embodiment, flow time are each built before use. Slips: "keys and values" unexplained, and one tangled sentence on the first screen.
- sentences 8: many are very good ("The pretraining is someone else's bill. Yours is the adaptation and the call."). Marked down for repeated attribution clauses, one paragraph repeated verbatim, and the imperative template in the descriptions.
- parity 9: with doc-A, sets the level.

Findings (most damaging first)

1. The section "What you can download trails what is published" and its two "For lookup" panels.
   From here the file stops arguing and inventories: "LeRobot v0.7.0, released 2026-11-05, ships 28 policy packages behind one command, lerobot-train --policy.type=..., and four of them come first on this arm."; "Three more packages ship a first-party checkpoint for this arm, and each comes with a condition."; then release-by-release notes and a 28-row table. The heading states a real claim and the first paragraph proves it ("GR00T 2 is the current GR00T to learn from, and N1.7 the current GR00T to run"); what follows is facts at equal weight, a licence note beside a calibration fault that can drive the arm the wrong way. Labelling panels "For lookup" is honest and the right demotion, but a reader meets about 100 lines of catalogue before the closing argument.

2. "The clock of the SO-101, the small six-motor arm followed here, ticks 30 times a second, and it is kept by playing the chunk, one action per tick, so a model that needs several ticks to answer can still drive the arm."
   On the first screen, and it takes two readings. "it is kept by playing the chunk" has a passive with an unclear agent, and the sentence carries an introduction of the arm, the tick rate, the playback rule and the consequence at once. Split it: the consequence (a model slower than the tick can still drive the arm) is the point and comes last and smallest.

3. "These are NVIDIA's own figures, from a research page and whitepaper dated November 2026. The code is announced for December and nothing can be downloaded yet."
   This two-sentence block appears twice word for word (after the GR00T 2 Turbo timings and again in the GR00T 2 lookup note). It is provenance bookkeeping in the prose both times; the second sentence is useful to the reader once.

4. Attribution clauses that add nothing the citation marker does not already say: "took about 30k GPU-hours across its authors' whole project, as they report"; "the published result on this arm is 90% against ACT's 70%, as the SmolVLA authors report"; "In our reading, capturing and decoding the camera frames is separate work for the CPU or the GPU's video engine"; "is the newest Gemini Robotics VLA located"; "16 per chunk (our arithmetic)"; "none of the 28 was run on the arm for it."
   The first two trail off a sentence on a provenance clause. "located" and "In our reading" are the writer's research log showing through.

5. "At the bench the visible change is a text box."
   Coy. The change from what is not said until the next sentence, and "a text box" is not what changes (the task becomes an input). It reads as a line written for effect. The two sentences after it say it plainly.

6. Sub-heading descriptions in one imperative mould: "Follow pi0 on the SO-101 from two camera frames and a sentence to a tensor of 50 actions by 32 numbers, and see what the head reads from the backbone"; "Tell which of three things a quoted hertz figure counts, and get the head's real speed from the time to sample one chunk"; "Split a published latency into seeing, reading and action steps, and check the build, the checkpoint and the camera count before comparing two of them"; "Place the fine-tune and the call on a machine, and test any announced rate with one division".
   Most name a real result, which is why this is not higher. "Follow ... and see ..." describes the reading. "Place the fine-tune and the call on a machine" is vague beside the others.

7. "Every term of the call is tensor arithmetic on a GPU, and the GPU also has to hold the weights: the requirement is more than 8 GB of memory to run pi0 and 16 GB to run GR00T N1.7."
   The closing paragraph of the latency section is a leftover drawer: a truism, two memory minimums and a note about camera decoding. The section's argument ended two paragraphs earlier at the 2.6x spread.

8. "pi0's action tokens attend to the keys and values the backbone's attention computed for the prefix."
   "Keys and values" are not built anywhere on the page; attention was given one clause ("one token reads from others"). A level-100 reader cannot use the distinction this sentence draws between pi0 and GR00T.

9. "GR00T 2 is NVIDIA's current design, and under the agent it changes the action model too. It is a world action model: one diffusion transformer refines future video and the action chunk together ..." and the Turbo paragraph after it.
   News attached to the fourth item of a list. It leaves the section's question (what does a hertz figure count) for two paragraphs and returns nowhere.

10. "Pretraining is out of a reader's reach, which is why the fine-tune is the job to size."
    The prose refers to "a reader". "You will not pretrain one" or simply opening on the 50,000 H100 GPU-hours does the job.

11. "(section 7, JEPA, draws the grid)"; "(section 4 prices that blind interval)"; "Section 17, Running on the Robot, sets latencies like these against the tick."
    Cross-references in the reading path; the third is a paragraph's last sentence.

12. "(the paper does not say whether that time includes a backbone pass)"
    This caveat bears directly on the headline 15.6, yet it is tucked in a parenthesis inside the sentence that calls 63.9 ms "the real speed of the network". Either the bound holds either way (say so) or the caveat deserves its own sentence.

13. Header: "(papers, model cards and LeRobot v0.7.0, read 2026-11-20)"
    Provenance in the header description. Shorter than doc-A's, same fault.

What it does that the weaker files do not: opens on a misreading the reader is about to make and corrects it with a division; repeats its strongest number (15.6 chunks, 120 Hz) at the end; the "Check which of these runs you started" paragraph turns a release note into something to do.
## doc-D: "4. Learning From Demonstrations: Why Copying Drifts and What Fixed It"

Scores
- argument 9: the title is the argument, the first sentence is a claim ("fails for a reason its training loss never sees"), and paragraph two works it: 600 decisions become 6, 1% becomes 44%, passes per chunk are 1, 10 or 100. Every later section is one step of that proof.
- depth 9: the behaviour-cloning objective read for its subscript, the T-squared bound decomposed factor by factor and worked (360 against 3.6), predicted-versus-played settings per codebase, four heads priced in passes, the pi0 call split to 2.7 ms a step, symptom-to-setting table.
- clarity 9: the best ramp in the batch. Each idea is met at the bench first, then in symbols, then in toy numbers, and symbol collisions (k, epsilon, the two clocks) are flagged where they happen.
- sentences 8: many sentences a reader will keep ("Behaviour cloning is regression whose test set is written by its own mistakes."). Marked down for the writer's bookkeeping ("our count", "our reading", "our arithmetic") and one penultimate paragraph made of cross-references.
- parity 9: sets the level with doc-A and doc-C, and is the most even of the three.

Findings (most damaging first)

1. "How each failure looks at the bench is our reading of its mechanism, here and in the closing table: this one is a smooth, confident reach that closes the gripper beside the block."
   A disclaimer about the document's method, with a pointer to a table 900 lines away, placed in the middle of the paragraph that introduces compounding error. It is the clearest case in the file of the prose talking about itself. The image after the colon is good and should stand alone; the provenance needs one plain clause at most.

2. The same family, four more times: "6 x 50 = 300 tokens by our count"; "Against our count of 300 for this arm that is 300 / 30 = 10 times fewer"; "In our reading, sampling one mode is a strong tendency on human demonstrations and falls short of a law."; "By our arithmetic from LeRobot's tuning rule, the time of one call, measured on your GPU, has to stay under about half the duration of the chunk it predicts".
   Once is honest; five flags is bookkeeping. The third is worse than a flag: it is the section's qualification of its own second thesis (do you need a generative head at all?) and it is delivered as a hedged opinion in one sentence, after the OpenVLA-OFT result that prompts it. That question deserves either an argument or a plain "not settled".

3. "A policy gives the machine two jobs of different shape, training and the call on the arm (section 20, Fifteen Workloads, Five Shapes), and both are matrix arithmetic on a GPU's tensor cores."
   Opens the second-to-last paragraph with a truism and a cross-reference, and the paragraph then cites sections 10 and 15 as well. Three pointers in six sentences; the facts in it (5 hours on an 11 GB card, 4 days on 8 H100s) are at equal weight with them. The paragraph's last two sentences ("It has to return before the chunk in play runs out, every time, for as long as the arm runs.") are the part worth keeping.

4. Header: "(the ACT, Diffusion Policy, pi0 and FAST papers, LeRobot v0.7.0 and the openpi code, read 2026-11-20)"
   A source list in the header description, as in doc-A and doc-C.

5. "pi0 predicts 50 actions and, as its authors report, plays 25 of them on 50 Hz robots before it calls again." and, in the table, "25 on 50 Hz robots (a call every 0.5 s) and 16 on 20 Hz robots (every 0.8 s), as the authors report"
   A configuration fact does not need "as its authors report"; the citation marker carries it. The clause is right on measured success rates and timings, and wrong here.

6. "The table gives each paper's own figures. Each row was timed on a different GPU, so compare within a row." and "The pi0 row shows where a call's time goes."
   Prose that directs the eye round a table. The second sentence of the first pair is a useful warning and belongs in the caption; the others can go.

7. "What it costs to let a language model write the chunk one token at a time, and why one model line trains with tokens and runs with flow"
   The description promises a why. The body gives one sentence ("pi0.5, a later model in the same line, takes both sides of the trade: it is pretrained with FAST tokens and then given a flow-matching action head for inference") and leaves the reader to infer the reason from the 5x and 750 ms figures above it. Say it: cheap training from tokens, fast calls from flow.

8. "LeRobot's code takes the mean of the absolute differences where the bars add them up, and its default β is set against that mean."
   "Set against that mean" is unclear: the reader cannot tell whether beta is scaled for the mean or compared with it. And it sits inside the symbol definitions, before the formula, where it is a detail about one codebase.

9. "Every policy described here is built on the first, and most of them on the second."
   Mild self-reference ("described here") in the opening paragraph. "Every policy since is built on the first" says more.

10. "(section 5, Vision-Language-Action Models, takes the model apart)", "(section 3, The Robot as a Computer)", "section 16, Evaluation", "section 8, Reinforcement Learning for Robots", "section 17, Running on the Robot" (three times).
    Nine cross-references by section number and title. Individually harmless; together they keep reminding the reader that this is one tab of a larger document.

What it does that the weaker files do not: it makes the reader want the formula before showing it ("the formula states that in a subscript"); it distinguishes its toy arithmetic from the measured evidence in two short sentences ("The arithmetic shows why the direction is right. The measured evidence is the ablation: 1% to 44%."); it ends on three numbers to write down and what each one is the price of.
## doc-E: "8. Reinforcement Learning for Robots: Where the Attempts Come From"

Scores
- argument 9: one claim (what the run waits on is decided by where the attempts come from), stated in sentence one and proved on the first screen with 4,096 x 16 x 3,000 = 197 million steps, 228 days of one arm, against 144 attempts an hour. The whole file is organised by it and the ending cashes it out as three counts.
- depth 8: level 400 on sizing and operations (a camera halves simulator throughput, 8 to 40 environments per GPU for a VLA, the 40-hour cap that killed a run at step 83, weights up to 4 s stale, buffers larger than a run can fill). Thinner on the algorithms themselves: PPO is done properly in a panel, SAC and GRPO get one clause each.
- clarity 8: reward, rollout, environment, advantage, replay buffer and domain randomisation are each defined at first use. Slips: the value function is used a sentence before it is defined, and one PPO sentence is too abstract to follow cold.
- sentences 8: specific and consequential throughout, with fewer memorable sentences than doc-D. Marked down for saying the thesis too many times, a coined second name for the same thing, and research-log remarks.
- parity 8: publishable beside A, C and D. A shade below them on mechanism, level with them on argument.

Findings (most damaging first)

1. The thesis is stated five times before the second section. Header: "Tell what a robot RL run will wait on by asking where its attempts come from: one GPU's simulator throughput, a large model's forward passes, or an arm and a person". First sentence: "What a robot RL (reinforcement learning) run waits on, and so the machine it needs, is decided by where its attempts come from." End of the opening: "So the first thing to ask of any robot RL recipe is which supply it draws on." First sub-heading description: "Read any robot RL recipe as a supply of scored attempts, and name what it waits on". Then: "The supply then fixes what the run waits on." followed by the three supplies described a second time in full, and the figure a third.
   Repeating the strongest number is good; repeating the strongest sentence is padding. The paragraph beginning "The supply then fixes what the run waits on" adds only two definitions (simulator, VLA) to what the opening paragraph already said.

2. "Call each supply a lane."
   A second name for a thing that already has one, coined in four words and then used in every heading and table row ("In the simulator lane", "this lane pays twice", "Choose the lane"). The reader now carries supply and lane as if they differed. It is the taxonomy habit: the label is doing the work a consequence should.

3. "What a robot RL (reinforcement learning) run waits on, and so the machine it needs, is decided by where its attempts come from."
   The right claim in an awkward frame: a twelve-word noun clause as subject, an aside inside it, a passive verb, and the point last. Compare doc-D's first sentence. "Where a robot RL run gets its attempts decides what it waits on, and so the machine it needs" is the same sentence the right way round.

4. Research-log remarks in the reader's path: "The recipe's configuration and README at 1.0.1 give no wall-clock time, so how long its 197 million steps take on a given GPU has to be measured."; "The nearest published figure from the same project is for another arm and older code."; "(the parts and shapes in the table are our reading of the cited sources)"; "No recipe specific to this arm was located in this research."; figure text "The files read publish no wall-clock time for this recipe."
   The first is a legitimate finding (the source is silent, so measure) but is phrased as a note on the files. The rest are the writer accounting for the search.

5. "NVIDIA's figures are training throughput for other robots, from a benchmark its own notes flag as "dirty working tree reported", and its file holds no time to a working policy."
   "Dirty working tree reported" is version-control jargon dropped in as a quotation with no gloss; the reader cannot tell whether it matters. The useful instruction is the next sentence ("Use them for the ratio a camera costs, and measure the rate of your own task").

6. "Recap ... improves a VLA from a few hundred of its own attempts per round by repeating three stages: collect autonomous attempts, with a person free to take over and correct; train a value function on all the data; retrain the policy." then, after a citation, "A value function is a second model that looks at the current moment and predicts how well the attempt will end."
   The term is used, then defined. One sentence of reordering fixes it.

7. "A batch can move the policy only a limited distance before it stops describing the policy it came from, so PPO makes a few passes over it, discards it and collects another."
   The key idea of PPO in a sentence a newcomer cannot unpack: how does a batch "move" a policy, and what is it to "describe" one? The expandable panel explains it well; the body sentence needs the plain version (the attempts were made by the old policy, and after a few updates the policy is no longer the one that made them).

8. "The Learning From Feedback dive derives the algorithm."; "Section 20, Fifteen Workloads, Five Shapes, sets them beside the other jobs around the arm."; "(section 19, Agents Running the Loop, takes up who may write the grader)"; "Section 14, Sim-to-Real and Real-to-Sim, covers the two remedies"
   Signpost sentences. Ten cross-references in the file; these four are whole sentences or clauses whose only content is the pointer.

9. "NVIDIA reports a gain of the same kind for GR00T 2 on three contact-rich insertion tasks: from 40 to 76% success after supervised training to 88 to 96% with RL on the real robot."
   A vendor result appended to the end of the Recap paragraph, with nothing said about method, attempts or people, the three things this file measures everything else by. A fact at equal weight with the ones that carry the argument.

10. "The algorithm is SAC (Soft Actor-Critic), an RL method that trains from a replay buffer, a store of past steps that training samples from again and again, where PPO discards a batch after a few passes."
    The contrast with PPO is exactly right and is the consequence that matters. But SAC itself stays a name: nothing on what the actor and the critic are, though "actor" then appears as the name of a program two paragraphs later with a different meaning. That collision is not flagged.

11. "The GPUs, simulators and tasks differ, so the ratio is rough, and its size is the point."
    Three clauses of hedge and reassurance. "The setups differ; a gap of 200 to 1,000 times survives that." is the claim.

12. "The formula is the form the paper uses for its pre-training data, where the outcome is the whole rest of the episode. For attempts collected on the robot the paper shortens the outcome to ..."
    Two sentences on which variant of a formula appears where in the paper. Accurate, and about the paper more than about the mechanism.

What it does that the weaker files do not: 228 days of one arm on the first screen; the cap arithmetic (2,280 minutes, room for 84 steps, stopped at 83, checkpoints lost) told as an instruction; "Whether a run helped is itself a count with an error bar", with two intervals that do not overlap and two that do.
## doc-F: "9. RLVR & GRPO"

Scores
- argument 6: there is a real thesis (a group whose answers all score alike costs a full set of rollouts and yields no gradient), and it is stated in paragraph two with the file's own measurement. Then it is dropped for two reference sections and a model-size survey, and proved only in the last section. The header leads with the least interesting promise ("Read the knobs").
- depth 8: the content is level 400: which divisor causes which tilt, the two TRL settings that must be set together, verl's default being PPO with one answer per prompt, a first-hand run, p^G + (1 - p)^G worked to 0.70 and checked against 28 and 29 of 40 groups.
- clarity 6: leans on sections 6 and 7 for policy gradient, the clip, KL, entropy and the critic, and uses several terms with no build at all (sampled-baseline route, gae, importance sampling, Routing Replay, entropy collapse, MoE beyond its expansion). The stated reader can follow the advantage arithmetic and the last section, and little of the two tables.
- sentences 6: accurate and compact, but many are inventory ("X is Y in file Z"), a good share talk about the page, and the research log shows ("in our reading of the code", "our arithmetic", "E0").
- parity 6: the last section would sit beside the best files. The middle would not.

Findings (most damaging first)

1. Order. The claim "the step spends its rollouts on that prompt for no gradient" appears in paragraph two, is illustrated once (prompt B), and then waits behind "Each successor changes one term of GRPO", "What a trainer runs when you ask for GRPO" and "The same knobs on a managed job" until "Always-solved and never-solved prompts waste the step". The formula that turns the claim into a tool, p^G + (1 - p)^G, is the last thing in the file. A reader who stops at the settings tables leaves with a reference card and without the argument. This is the buried thesis and the out-of-order blocks in one.

2. "Read the knobs on a managed GRPO job: which knob fixes which bias, and why always-solved prompts waste the step (TRL v1.16.0 and verl v0.9.1, read 2026-10-30)"
   Three promises, strongest last, plus a provenance parenthesis. "Read the knobs" describes an activity. Neither TRL nor verl is a managed job, so the first clause and the parenthesis do not even match.

3. "9. RLVR & GRPO"
   Two unexpanded acronyms and an ampersand. It names a topic and claims nothing. Every other numbered file in the batch has a title that states its angle after the colon.

4. "RLVR (RL with verifiable rewards, where RL is reinforcement learning) uses a program as the reward: a rule that compares a boxed final answer with the reference, or a compiler that runs the code against predefined test cases"
   Opens on a definition, with a nested expansion inside the parenthesis. The DeepSeek number in the next sentence is impressive but is not the section's claim; the claim is the first sentence of paragraph two, and that one is framed as "The challenge is to ...".

5. Prose about the page, repeatedly: "The minimal recipe of Dr. GRPO (GRPO Done Right), a variant the next blocks return to"; "Those two divisors, the answer's length and the group's standard deviation, are the first terms the successors in the next block change."; "Read prompt A first."; ""Bias" in this table means a systematic tilt in the objective, a different sense from the statistical bias of section 6."; "Two terms from section 7 recur."; "The table maps each term onto its setting in both frameworks."; "The page gives the identifiers; the right-hand column is our mapping onto the terms above."; "exposes more of this section's terms as named settings".
   Eight sentences whose subject is a block, a table, a column or a section. This is the fault the owner named, at higher density than in any other file here.

6. Research bookkeeping: "The paper's first arXiv version reported 71.0%; the second arXiv version and the Nature paper report 77.9%"; "in our reading of the code" (twice); "reinforce_pp (REINFORCE++, in our reading of the identifier)"; "(our arithmetic)" (twice in table cells); "(our arithmetic on the E0 figures)"; "On the E0 figures"; "4.4% (E0)"; "as an example value rather than a default".
   The arXiv-version sentence has no consequence for the reader at all. "E0" is an internal experiment label that the prose never introduces; it is used three times as if the reader knew it.

7. "GRPO is the sampled-baseline route of section 6, Policy Gradient."
   The opening sentence of the central block defines its subject by a label from another section. The next three sentences define it properly and make this one unnecessary.

8. The section "A program as the reward" after its first paragraph: "In DeepSeek's early experiments, RL from a base model failed to give meaningful AIME gains on a 7B dense and a 16B MoE (mixture of experts) base, which drifted into repetition as their responses grew, and worked on a 32B dense base (Qwen's) and on 230B and 671B MoE bases." / "A 7B math base did respond to RL, in DeepSeek's own later run on Qwen2-Math-7B ... and in other work." / "That base family is a special case: GRPO with randomly assigned rewards raised Qwen2.5-Math-7B's score on MATH-500 (500 competition-math problems) by 21.4 points"
   Results at equal weight, each qualifying the last, with three one-line pointers to other sections between them. The most surprising fact in the file (random rewards gain 21.4 points) is given no consequence: what should a reader conclude about any benchmark gain on that base? The section's question, on which bases does this work, never gets an answer the reader can use.

9. "The same knobs on a managed job" as a whole. "The job request carries the group size as trainingSamplePerPrompt, next to batch size, epochs, learning rate, length limits and reasoning effort; the documented request sets 4 samples per prompt, as an example value rather than a default". Then a settings table with "cispo" and "grpo_passk" unexplained, and a last sentence, "AWS suggests importance_sampling for a team new to multi-turn RL, and calls PPO with clip thresholds of 0.8 and 1.2 the safe baseline for any first run", which gives two different recommendations for a first run and resolves neither.
   A reference-manual page. Nothing in it changes a decision except the mapping of clip thresholds to 1 - 0.2 and 1 + 0.2.

10. The successors table. "With a symmetric 0.2, a token at probability 0.01 can rise only to 0.012 in one update, while a likely token is not held back, so the clip can restrain exploration; DAPO's naive GRPO run showed entropy collapse." / "In Qwen's MoE runs, GRPO needed a training strategy called Routing Replay to converge and GSPO did not."
    The first is the best cell in the table (a number that shows the mechanism) and then ends on "entropy collapse" with no word on what the reader would see. "Routing Replay" is a name with nothing behind it. Six methods in six rows is a list; the paragraph under the table ("Check how your trainer averages the loss before you read a growing length as longer reasoning") is the only place a row is turned into something to do.

11. "Know what a verifier checks, and on which base models RL from scratch has worked" and "Know the GRPO your framework runs by default, and the setting that turns each fix on"
    "Know" is the weakest verb available for a payoff line. Both describe a topic.

12. "Section 25, Choosing a Technique: Fine-Tuning, a Text Loop or a Hybrid, turns the same measurement into its second decision question: what the model scores on your signal today."
    The final sentence of the file is a cross-reference. The two sentences before it ("your count tells you how much of your run would do the same. Drop or replace those prompts, or filter them during training.") are the ending.

13. "Our DGX Spark run shows the mechanism on a live trainer: Qwen2.5-0.5B-Instruct, full fine-tuning, fresh synthetic arithmetic of the form (a + b) * c - d scored 1 for the exact integer, 2 prompts with 8 answers each per step, TRL v1.16.0 defaults for the loss, the KL term and the reward scaling, seed 0, two runs."
    A lab-notebook header written as a sentence: nine configuration items after a colon, before the result. The result (9 and 10 of 20 steps with a loss of exactly 0.0) should come first and the setup after, or in the citation.

What it does well, and the other files should not lose sight of: the last section. One measured base rate, one formula with its assumptions stated, a prediction (0.70 x 0.70 = 0.49, about 10 steps in 20) checked against the log, a table showing where doubling the group helps and where it does not, and a test to run before paying. That is as good as anything in A, C, D or E. It is the wrong end of the file for it.
## doc-G: "6. World Models: Predict Pixels or Predict a Summary"

Scores
- argument 9: the title is a choice, the first sentence says what decides it ("what it is asked to predict sets the price of every prediction"), and paragraphs three and four price it on one GPU: 16 s against 4 minutes, 2 ms against 300 ms per imagined future, 150 times. The fifth paragraph hands the reader the two questions the rest of the file answers.
- depth 8: compress, denoise, decode with 2,400 tokens and 84,000 token updates for one second of video; the teacher-forcing loss decomposed; three ways a latent fails; memory floors of 58 and 31 GiB. Lighter than A and D on configuration choices, and one section is a survey.
- clarity 8: latent, rollout, candidate, token, teacher forcing and collapse are built before use, and the bench scene (bet on the block, not the glint) carries the central idea. Slips: the first paragraph says "Both kinds" before any kind is named, and one section leans on three model names in three sentences.
- sentences 8: several of the best in the batch ("The saving is in how often they are visited, and by what."). Marked down for hedges about the writer's own reading, a provenance sentence in the body, and one four-item tour.
- parity 8: publishable beside A, C and D with no embarrassment; a little less even.

Findings (most damaging first)

1. The section "What has to leave the model: a score, frames, a policy's input or an action", with the description "Planning wants a score, data generation wants frames, a policy under test wants its next input, and a robot wants an action".
   The heading is a list of four, the description is the same list with verbs, and the body is one paragraph per item. This is the "four objects" fault: it tours uses where the opening had already reduced them to two questions (how many futures, and does anything read the pixels). The third paragraph is the weakest in the file: "Neither family owns these two. Dreamer 4, from Google DeepMind, trains its policy inside a model that generates frames, and its main result is in a video game. ... NVIDIA lists a checkpoint of Cosmos 3, its video model, for closed-loop robot policy simulation. ... The authors of RoboJEPA, a latent world model for robot arms, write that the same world model can be used to "evaluate or improve any policy"." Three citations at equal weight standing in for a claim.

2. "In 2026 pixel models generate training video and drive robots directly, and latent models plan by search, in our reading of the models cited here. The sorting is firm at those ends, because generation needs few predicted futures and search needs thousands for one decision. It is loose in between, where both families are used to train and to score policies."
   The second paragraph of the file. "in our reading of the models cited here" is bookkeeping on the first screen, and "firm at those ends ... loose in between" is a spatial metaphor with no object: which ends, between what? The idea (two uses are settled, two are contested) is sound and is said clearly three paragraphs later.

3. "A world model predicts what a robot's cameras will show after it acts, and what it is asked to predict sets the price of every prediction. Both kinds first compress the frame into a smaller set of numbers, called a latent."
   "Both kinds" refers to kinds the reader has not been given; they arrive in the next two sentences. The first half of sentence one is also a definition, though the second half rescues it. Name the two kinds, then say what they share.

4. "It was Cosmos 1, a 2025 model with 7B parameters, which they fine-tuned for the test, so the comparison was run by the authors of the faster model."
   The conflict of interest matters and deserves saying. Here it trails a sentence about something else as a "so" clause, and the same point is repeated in a figure label ("as the V-JEPA 2 authors report it"). Say it once, as its own short sentence, where the 16 s and the 4 minutes are first set side by side.

5. "GR00T 2 cuts the parameters and the passes. Its figures come from an NVIDIA whitepaper dated November 2026, with the code announced for December and none released on 2026-11-20."
   A one-line paragraph that opens on a claim and spends its second sentence on provenance and release status. The reader needs "no code yet" once, and the ending already says it ("GR00T 2 has no code yet").

6. "For the latent planners and for GR00T 2 we found no first-party memory figure, so measure it along with the round."; "so we read them as memory for the weights, with working memory on top"; "Notes written for coding agents in the same NVIDIA repository record Cosmos3-Nano peaking at 33.8 GiB"
   The research log again. The first is useful advice wrapped in "we found no". The third describes where a number was dug up in a way that makes the reader doubt it without saying whether to.

7. "One tick before the push: bet on the block, decline to bet on the glint"
   As a heading read cold, it invites the owner's question about another title: what does that mean? It pays off two paragraphs later and is then the best image in the file. The description under it ("What you can predict about the next frame, what you cannot, and why a frame generator has to produce both") is the plain version and could be the heading.

8. "Parameter count does not separate the families: RoboJEPA's largest predictor has 8B parameters on a 2B encoder, and two of the pixel models have 2B."
   A real and slightly surprising point, placed as a caption to a table between the machine-sizing section and the closing choices, where it interrupts both. It belongs with the argument that the price is passes times tokens, since it is the evidence that parameters alone are the wrong thing to count.

9. "The other published times come from different hardware, resolution, horizon and batch size, so the chart is for orders of magnitude and no finer." followed by three note-style paragraphs opening "A current pixel model:", "The same latent planner at the same settings:", "A small latent model:".
   Prose about a chart, then annotations to it at equal weight. The sentence between them is the finding and gets lost: "every pixel-family time is 300 ms or more per candidate, and every latent-family time is 2 ms or less".

10. "With those two words the prediction is one function:" followed by "next state = f(state, action)".
    A displayed formula for something the heading above it already said in six words ("State and action in, next state out"). The paragraph after it (the output has the same form as the input, so the model can be fed its own prediction) is the content; the display adds ceremony.

11. Cross-references: "(a new action every 33.3 ms, section 3, The Robot as a Computer)", "(section 11, Augmentation and Synthetic Data)", "(section 16, Evaluation)", "(section 7, JEPA, compares the guards)", "(section 4, Learning From Demonstrations)", "the policy type of section 5", "(section 17, Running on the Robot)", and "(Section 3 uses the word more narrowly, for observation.state, the six measured joint angles.)"
    Eight. The last is a justified warning about a word with two meanings; the rest are the same low-level noise as in A, C, D and E.

What it does that the weaker files do not: "Divide each time by the futures it bought" turns two published times into a unit price in one line; the closing "Choose by what has to come back" gives a budget for each answer (26.4 s of H100 per second of 720p; 10 rounds of about 1.6 s; a VLA for anything faster) and a check to copy (decode a rollout and look for the gripper angle).
## Across the batch

### Groups by quality

Group 1, the level to match: doc-D, doc-A, doc-C (in that order).
Each opens on a claim the reader did not have, works a number on the first screen, and keeps every later block in the service of that claim. D is the most even and has the best ramp for a newcomer. A goes deepest. C has the best first screen of the seven and loses a point for a catalogue in its last third.

Group 2, publishable beside group 1: doc-E, doc-G, and doc-B.
E and G are built the same way as group 1 and argue as well. E is thinner on the algorithms it names and says its thesis too often; G has one four-item survey section and more hedging about its own reading. The gap to group 1 is half a point, visible only side by side.
B is a different kind of text: a third of the length, thesis in the header, almost no sentence without a consequence, and no ramp. It beats every other file on economy and loses to all of group 1 on whether a newcomer can follow it (decode and prefill are charted before they are defined; the roofline itself is never stated in words).

Group 3, weaker: doc-F.

### What separates the groups

1. Where the claim sits and whether the order serves it. In A, C, D, E and G the sentence a reader should leave with is in the first paragraph and the last. In F it is in paragraph two and the final section, with a model-size survey and two settings references in between, and the header advertises the references.
2. What the middle of the file is made of. Group 1 middles are mechanism worked in numbers the reader can redo (360 against 3.6; 0.5000 to 0.5003; 14 + 32 + 27 = 73 ms). F's middle is tables of identifiers. C's last third and G's third section drift the same way, which is why neither tops D.
3. How much the prose talks about the page. F has eight sentences whose subject is a block, a table, a column or a section ("a variant the next blocks return to", "Read prompt A first.", "The table maps each term onto its setting in both frameworks."). The other files have one to three such sentences each, plus cross-references.
4. Titles and openings. F is titled with two acronyms and opens on a definition. Every other file's title or header states an angle, and every other file's first or second sentence is a claim.

### Would a careful reader tell some files from others by quality alone?

Yes for one file, no for the rest.

doc-F is distinguishable, and by quality, not topic. The tells: a bare title; a definition for a first sentence; a thesis that disappears for two-thirds of the file; reference tables as the body; "the next block", "this table", "the terms above"; an internal experiment label ("E0") used as if the reader knew it; a final sentence that is a cross-reference. Its last section is as good as anything in the batch, which makes the middle look worse.

doc-A, doc-C, doc-D, doc-E and doc-G are not distinguishable from one another by quality. A careful reader would rank D and A slightly above E and G, and would not sort them into different classes. They are, however, recognisable as one family by shared habits, and all five carry the same residual faults:
- a source list in the header description ("(the ACT, Diffusion Policy, pi0 and FAST papers, LeRobot v0.7.0 and the openpi code, read 2026-11-20)");
- sub-heading descriptions cut from one imperative template ("Count ...", "Read ...", "Follow ... and see ...", "Place ...", "Size ...");
- the writer's ledger in the prose: "our reading", "our count", "our arithmetic", "in this research", "we found no", "located", and "as its authors report" on facts the citation already attributes (C repeats a two-sentence provenance block word for word);
- eight to ten cross-references by section number and title per file;
- a penultimate "on the machine" paragraph that opens on a truism about GPUs (A: "Every job here runs a transformer on a GPU's tensor cores"; C: "Every term of the call is tensor arithmetic on a GPU"; D: "both are matrix arithmetic on a GPU's tensor cores").
None of these is the sloppiness the owner described (no vague title, no tour for an opening, no primer voice). They are the marks of one careful process repeated, and they are the next thing to remove.

doc-B is distinguishable by register, not by rank: a reader would know at once it was written to a different length and for a more expert audience. Judged for the stated reader it is the hardest file to follow; judged sentence by sentence it is the tightest.

### Verdicts

- doc-A: sets the bar. Claim and price on the first screen, every formula decomposed, an ending that hands over two questions and answers them.
- doc-B: not distinguishable by quality from the best files. Best economy and a thesis in the header; clarity 6 for this reader because terms are used before they are built.
- doc-C: sets the bar. The best opening in the batch; the release catalogue at the end is the only stretch below level.
- doc-D: sets the bar. The most even file and the best ramp from bench to formula to numbers.
- doc-E: not distinguishable by quality from the best files. Same construction and argument; thesis over-repeated, "lane" coined for "supply", algorithms named more than explained.
- doc-F: distinguishable: weaker. Buried thesis, reference-manual middle, prose about the page, bare title. The final section shows the file can be rebuilt around it.
- doc-G: not distinguishable by quality from the best files. Excellent first screen (150 times per imagined future); one listy section and visible hedging keep it just under A and D.


Key to the blind file names: doc-A this dive section 7; doc-B silicon dive Roofline; doc-C this dive section 5; doc-D this dive section 4 (already published); doc-E this dive section 8; doc-F feedback dive RLVR and GRPO; doc-G this dive section 6.
