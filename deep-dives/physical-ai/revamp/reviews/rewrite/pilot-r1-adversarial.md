# Adversarial review, round 1 (blind)

Reader assumed throughout: IT or software, level 100 to 200 on the topic, to be taken to level 400.
All eight files were read end to end. Citation markers and loose diagram labels were not marked as faults.

## Scores

| File | Argument | Depth | Clarity | Sentences | Parity | Verdict |
|---|---|---|---|---|---|---|
| doc-A (Thesis and Framing) | 9 | 8 | 5 | 8 | 8 | sets the bar (for argument and sentence craft; it fails the stated reader on clarity) |
| doc-B (3. The Robot as a Computer) | 8 | 9 | 8 | 6 | 7 | distinguishable: weaker, narrowly, and at sentence level only |
| doc-C (1. One Loop) | 6 | 4 | 7 | 6 | 5 | distinguishable: weaker |
| doc-D (1. One Arm, Fifteen Workloads) | 7 | 6 | 6 | 6 | 6 | distinguishable: weaker |
| doc-E (4. Learning From Demonstrations) | 9 | 9 | 8 | 8 | 9 | sets the bar |
| doc-F (Roofline and Arithmetic Intensity) | 8 | 9 | 5 | 7 | 8 | not distinguishable by quality from the best files |
| doc-G (2. Getting Started) | 5 | 4 | 7 | 6 | 5 | distinguishable: weaker |
| doc-H (9. RLVR & GRPO) | 8 | 9 | 6 | 7 | 8 | not distinguishable by quality from the best files |

A mechanical count that backs the sentence scores (phrases in prose, citation markers excluded as far as a
grep can): "in our reading" appears 8 times in B, 4 in E, 3 in H, 1 in D, 0 in A, C, F, G. "as X reports /
describes / lists it" appears 5 times in B, 3 in E, 0 elsewhere. "illustration / illustrative / not measured /
nobody measured" appears 11 times in B, 12 in E, 2 in D, 2 in H, 0 in A, C, F, G. "section N" pointers: 50 in C
(2,600 words), 30 in H, 30 in E, 22 in G, 9 in B, 7 in D, 0 in A and F (which point by section name instead).

---

## doc-A: Thesis and Framing

Scores
- argument 9: hands the reader a tool in sentence 1 and works it to a number (412 FLOP per byte against 2 to 10) by paragraph 3; the ending returns to that number.
- depth 8: ridge arithmetic, the sparse-headline trap, and a real production example; the middle block is a catalogue.
- clarity 5: a level 100 to 200 reader is lost in the "Instruction delivery" and "Data delivery" paragraphs, which are runs of expanded but unexplained acronyms.
- sentences 8: short, consequential, few wasted words; the best aphorisms in the batch.
- parity 8: argument and economy are the batch's best; reader care is among its worst.

Findings
1. "Out-of-order host cores do it speculatively, with a branch predictor and a BTB (Branch Target Buffer). A GPU SM (Streaming Multiprocessor) issues from a warp scheduler and hides a stalled warp's latency by running other warps." Six topic terms (out-of-order, speculative, BTB, SM, warp, warp scheduler) in two sentences, none built. An expanded acronym is a name. The stated reader gets nothing from this paragraph, and the next two paragraphs (NEFF, ISA, WSE-3, SMEM, TMEM, SBUF, PSUM, AMX, tcgen05, systolic array) repeat the fault.
2. "Every operation needs three deliveries at a functional unit: an instruction, its operands and their layout." The thesis sentence rests on "functional unit", which is never defined, and names the third delivery "layout" here and "shape" everywhere after.
3. "The headline figure is peak FLOPS, often quoted with sparsity." FLOPS is never expanded or explained, and "sparsity" is unexplained until the aside two paragraphs on, where "the 2:4 structured pattern" is itself unexplained.
4. "Each weight feeds one multiply-add per sequence in the batch, so with 8-bit weights at batch 1 to 5, decode sits at 2 to 10 FLOP per byte". The step that makes the number (a multiply-add is 2 FLOP, an 8-bit weight is 1 byte) is skipped, and "batch 1 to 5" is an unexplained range. This is the anchor calculation; it should be redoable.
5. "doubling bandwidth roughly doubles tokens per second until a fixed latency floor sets the step time." What floor? A limit is asserted and never named.
6. "Heterogeneity is the organizing fact". A heading that says nothing a reader can act on; "organizing fact" of what? Its description carries the content and should be the heading.
7. "Across chips the spread is wider. Arm Neoverse host cores, x86 cores with AMX tiles, NVIDIA Hopper and Blackwell GPUs, AWS Trainium and Inferentia, Cerebras wafer-scale engines, the Groq LPU (Language Processing Unit), the SambaNova RDU (Reconfigurable Dataflow Unit) and compute-in-memory devices each place a different bet on how instruction, data and shape reach the unit." A list of eight names with one shared, empty predicate ("place a different bet").
8. "Roofline and Arithmetic Intensity computes ridge points across chips and precisions. Memory Hierarchy Primer and Anatomy of a Kernel Execution walk the tiers; HBM and the Bandwidth Wall, DDR5, MRDIMM, LPDDR5X and CXL, High Bandwidth Flash and Flash as a Cache Tier for Inference take the ones that hold weights and KV cache." A table of contents written as prose, under the heading "What to ask instead" (instead of what is left to the reader).
9. "A tensor-core pipeline bubble costs the matrix FLOPs that did not retire that cycle." Near-tautology: a stalled cycle costs the work of that cycle. In the same panel, "On WSE-3 the compiler fixes the routes. A model larger than one wafer is split at layer boundaries across several CS-3 systems." is a fact with no link to the panel's point about porting tuning results.
10. "Thesis and Framing". The title is a label for the author, and "the bottleneck is HBM bandwidth staging weights into the tensor pipe" uses "tensor pipe", defined nowhere.
11. "This deep dive gives you a way to predict", "Each architecture in this dive is a different answer", "A GPU vendor ships the thesis." Mild self-reference; the first is redeemed by what follows it, the third is a good line that still asks the reader to remember what "the thesis" is.

---

## doc-B: 3. The Robot as a Computer: Inputs, Outputs and a Deadline

Scores
- argument 8: first screen makes the claim (lateness is a distance) and works three numbers; the middle third stops arguing and documents.
- depth 9: PD gains and their consequence, encoder and backlash floor, a four-term latency budget worked to 143.4 ms and 35.9 mm, three failure modes with the setting that moves each.
- clarity 8: every term is built before use; the reader is never lost, only slowed.
- sentences 6: many strong ones, and a provenance tic on roughly one sentence in fifteen, a visible placeholder, and the same three numbers restated four or five times.
- parity 7: equal to the best on substance; a careful reader would mark it down for hedging and bagginess.

Findings
1. "in our reading of general kinematics a five-joint arm cannot reach every position at every angle"; "In our reading of the names and the mounts, the first rides on the arm and sees what is between the fingers"; "in our reading a position controller answers a standing error with a standing push"; "in our reading of the code, teleoperation on this kit is copying six numbers from one arm to the other"; "so in our reading one name can carry two units"; "in our reading of the driver it reads position only"; "In our reading neither is a torque at the joint"; "In our reading of the defaults, played to its end at 30 Hz it lasts 1.67 s". Eight uses of one hedge, several on textbook facts (five joints cannot span six degrees of freedom; a camera called wrist is on the wrist; 50 / 30 = 1.67). This is the owner's fault 5 at its densest in the batch. It reads as a writer protecting himself, and it flattens the claims that do need a hedge.
2. "Capture slot, dated 2026-11-20 / What will be shown here: Camera footage from the real arms: the leader in the hand and the follower copying it at the bench. / Until then: The clip above shows the same arm model and the same task in simulation." A production placeholder is on the page. Nothing else in the batch ships an unfinished slot.
3. "Press play to watch it.Capture: MuJoCo 4.0.1, offscreen renderer; 2026-11-20; made for this dive on a Mac; scripted motion, no learned policy." Caption as build log; "made for this dive on a Mac" helps no reader, and there is a missing space after "it.".
4. The action section ("The action: six target angles for six position servos") is a reference manual. Its description promises "the two choices that fix its units", and they arrive in the eighth paragraph, after PID, the lack of a force mode, the gripper caps, the firmware cut-outs ("after 2 s blocked at more than 80% of its stall torque, after 2 s drawing more than 2 A, or at a temperature over 70 degrees C, as the datasheet lists it") and degrees of freedom. The fact that decides whether a reader's recordings can be used ("Read the action space off a model's documentation before you fine-tune it") sits last, at the same weight as a thermal cut-out.
5. "Read down either column and each rung is slower and does more thinking than the one beneath it." The table lists the joint loop first and the planner last, so reading down, each row is slower than the one above it on the page. The sentence mixes the ladder's "beneath" with the table's layout and comes out backwards. "does more thinking" is primer register.
6. "The bottom rung is the one the SO-101's documents leave unstated and the humanoid puts at 1 kHz, a thousand passes a second." A paragraph's closing sentence that restates one table cell and a research gap.
7. "The formula is the standard one. Neither of the two Feetech documents read states how often the servo runs it." The first sentence repeats the formula's own label ("textbook form"); the second is research bookkeeping. "The time on the serial bus and the servo's own response were not sourced in this research and are left out." is the same fault.
8. "With 𝑣 the gripper's speed in metres per second, 𝜏 the delay from capture to command in seconds and 𝑑 the distance in metres" followed by a boxed formula d = vτ with a source line "our arithmetic speed times delay". Distance equals speed times time does not need symbol ceremony and a citation; the sentence before it already said it. Padding dressed as rigour.
9. Repetition past the point of "land the number twice": "100 ms ... 25 mm" appears five times, the 76.8 ms figure four times, and the 1,440 bytes / 55.3 MB/s / 38,400 times set is derived in paragraph 2, half-derived in the observation section ("24 bytes of joints beside two frames of 921,600 bytes each") and fully re-derived in the last section. The final section "What the arm asks of a machine" is largely the second paragraph again at three times the length.
10. "An arm learns to pick up a block and place it in a cup from recordings of a person doing it through the robot, and on this kit the person's tool is a second arm." Clumsy first sentence of the first sub-section: "through the robot" and "this kit" (no kit has been named) both stall the reader.
11. "To the software that runs it, the SO-101 is twelve numbers and two video streams on a clock." A strong opener that names "the SO-101" without saying it is a small robot arm, and says "twelve numbers" where the header description directly above says "six numbers with units".
12. "The rate of commands and the rate of the policy are separate settings. With --interpolation_multiplier N LeRobot sends commands to the servos at 30 x N Hz while policy inference and recording still advance at 30 Hz. The default N is 1." A flag stated with no consequence: when would the reader raise N, and what does it buy?
13. "Helix 2.5, posted 2026-09-17, is Figure's newest model and states no control rate." A fact that gives the reader neither a model nor an action.
14. "so this is the one workload of the loop with a deadline per unit of work where the others have a throughput: a job on the robot's clock (section 20, Fifteen Workloads, Five Shapes)." Leans on a taxonomy from a section this reader has not read, in a sentence that has to be read twice.
15. "Each joint that moves independently is one degree of freedom (DoF)". Defined 3,000 words after "six joints" has carried the whole section; by here it is a vocabulary note.
16. "Read ... as six numbers with units and two video streams, place every loop on the rate ladder, and turn a delay into millimetres on the table (LeRobot v0.7.0, the SO-ARM100 hardware repository and the Feetech STS3215 datasheet, read 2026-11-20)". The header description uses the coined "rate ladder" cold and ends in a 20-word source list.

What is good and should not be lost: "a late answer is an answer about a place the gripper has already left"; "a latency figure for a robot is half a number until a speed stands beside it"; "Nothing enforces the clock."; the backlash floor (3.6 mm) against one tick of travel (8.3 mm); the ending on "the width of your cup".

---

## doc-C: 1. One Loop: What It Learns From and Where It Keeps It

Scores
- argument 6: there is a thesis (where the update lands decides cost and reach) and it arrives in paragraph 4, stated as a three-way taxonomy, then never proved on the page.
- depth 4: one number in 2,600 words (8.84 times the tokens); every mechanism is deferred to a later section.
- clarity 7: each term is glossed at first use, and the glosses are good; the volume of names defeats them.
- sentences 6: accurate and flat; many exist to point somewhere else.
- parity 5: an annotated table of contents beside files that argue.

Findings
1. No number is worked on the first screen, or anywhere. The only figure is "at about 8.84 times the tokens per answer", which arrives around paragraph 15, attached to "One training-free sampler nearly matched the single-shot score of GRPO ... on a math benchmark" (which sampler, which benchmark, how nearly?). The table that carries the thesis has cells such as "Little up front: attempts sampled and scored, plus the calls that write the update (section 23)" and "The cost of serving the model it trained (section 23)". A claim that the store "sets the bill" should show one bill.
2. Fifty "section N" pointers in 2,600 words. "Section 3 maps every fine-tuning technique by where its signal comes from."; "Sections 6 and 7 build PPO, and section 9 builds GRPO."; "Section 13, The Reward Is a Proxy, builds a grader for a training run and a text loop alike."; "The second of section 25's three decision questions starts here: what signal do you have?" The prose is about the dive, the owner's fault 4.
3. "Each name below is a method a later section introduces properly; the gloss here is enough to place it." Prose about itself, introducing three paragraphs that are a name avalanche: "It holds memories, playbooks and skill libraries, which keep lessons, procedures or code from past attempts and add them to later prompts: ExpeL, ACE (Agentic Context Engineering), Dynamic Cheatsheet, Voyager and Training-Free GRPO, a text loop named after the RL method (section 16)." Roughly 30 method names in the block; a level 100 to 200 reader retains none.
4. "The table compares the three stores on four questions, and a few of its terms are new here. A training step is one pass of the loop ... Generation is ... Prompt caching is ... The base model is ... Sharpening makes ... A calibrated model's confidence ..." A paragraph of eight definitions stacked in front of a table: a glossary placed in the argument's path, announced by a sentence about the table.
5. "Fine-tuning is any further training of a pretrained model's weights. Reinforcement learning (RL) is the family of fine-tuning this dive covers in most depth". The second paragraph is a run of definitions and scope statements; "The models in question are the ones you already use" and "The challenge this dive takes on is" are the dive describing itself.
6. "Seven sources run through the dive, each with the section that covers it:" followed by seven bullets; and "Five questions, and where each is answered" with the description "Go straight to the question you came with: each has a section that answers it, and a short answer here". Lists that describe, and a tour of the page (faults 1 and 2).
7. "One Loop". The title's first half is the same kind of cryptic counting phrase as "One Robot, One Loop"; only the subtitle carries meaning.
8. "A fourth route stores nothing." A fourth item appears after a heading and a figure that say three, so the taxonomy leaks at the moment the reader has just memorised it.
9. "Both carry the word policy, which is RL's name for whatever chooses the actions"; "Our reading of the sections each cell names; the evidence and its scope are in those sections."; "The short answer, our reading of the studies the dive draws on: where the gap is reasoning skill, ..." Bookkeeping; the last one is also an answer with no verb ("Where do the words fall short? ... where the gap is ...").
10. "PPO (Proximal Policy Optimization) stops pushing a token's probability further once training has moved it a set fraction from the version of the model that sampled the data." A correct one-line gloss that still needs "sampled the data" and "a set fraction" unpacked for this reader; on a first screen it is a wall.
11. "Your next step: section 2, Getting Started, gives the five ideas to hold and the shortest reading route for the reason you are here." Ends on navigation.

---

## doc-D: 1. One Arm, Fifteen Workloads: What Each One Runs On

Scores
- argument 7: claim in sentence 1, a two-question tool in paragraph 1, a worked number in paragraph 2; then the evidence is disowned, and the last third is a contents table.
- depth 6: one real demand-against-supply calculation and a good Spot/array-job example; the rest is assertion by table.
- clarity 6: "fills first" and "the full part" are used for 1,200 words before "Full" is defined; the nine short answers use unbuilt terms.
- sentences 6: some of the batch's best lines beside count-juggling and bookkeeping.
- parity 6: better built than doc-C, visibly below A, E, F, H.

Findings
1. "The stand-in is a stack of dense layers on a CPU core. The arm's real policy runs convolutions and attention on the GPU of such a machine ... The figures stay with the stand-in." and later "Every measurement of ours is a single run of a stand-in program on one core of an edge machine, which shows the method and is too little to size an EC2 instance." The section's lead evidence is a NumPy toy that the text itself says does not describe the arm's policy and cannot size an instance, in a section whose header promises to "Place any job ... on an instance". The method survives; the first-screen number does not earn the weight put on it.
2. "it asked memory for 390 x 25.2 MB = 9.8 GB/s. A loop that streams through arrays larger than the caches reached 11.71 GB/s on the same core ... That core is out of memory bandwidth". 9.8 of 11.71 is 84%; "out of" is carried by the 62.3% stall figure, and the text does not say why 84% of the streaming rate counts as full.
3. "(The split into fifteen is ours; section 20, Fifteen Workloads, Five Shapes, shows it.)", "(NumPy, single run)", "(single run)", "(our single runs)", and in the caption "in our reading of the sources behind the table in section 20, Fifteen Workloads, Five Shapes. The drawing of the arm is illustrative, not measured." Bookkeeping in the first paragraph and the first figure; nobody supposes a drawing of an arm was measured.
4. Count-juggling as structure: "Eight stages make fifteen workloads, and three properties sort them into five shapes", "the eight stages give twelve workloads", "Three more reach the owner as finished models", "nine questions", "four schedulers", "the four ideas and three routes". The twelve are never listed (only simulation's three are shown), so "twelve" and "fifteen" are numbers the reader must take on trust. This is the owner's fault 2 (eight stages, five uses) in its original form.
5. "'Full' has one meaning throughout: the part that sets the job's speed while the others sit partly idle." The section's central term is defined in the fourth block, after "fills first" has been used since paragraph 1, and the definition is announced by a sentence about the text. "Running the policy has a shape as well as a full part." shows what the undefined jargon costs.
6. "What each job computes: nine questions, with short answers" / "Start from the question you came with: each has a short answer, and the sections that argue it" / "Placing a workload means knowing what it computes, so the questions people bring are about the models, the data and the simulator before they are about instances. Each has a short answer." A third of the file is a tour of the dive (fault 1). The short answers then lose the reader: "JEPA (Joint-Embedding Predictive Architecture) is the design that trains such a model by predicting one encoding from another."; "in the ENPIRE system those are written rules, and the repository files read show no mechanism that prevents the edit" ("the edit" has no antecedent); "survives the move to the bench when training varied the simulator's parameters widely or someone measured the arm and corrected them (sim-to-real)".
7. "A job with a deadline on every unit of work cannot be stopped and resumed, so no capacity that can be taken back will do: it runs on the computer beside the arm". The conclusion (beside the arm) follows from latency, which the previous sentence established; the Spot argument answers a proposal nobody would make.
8. "The bench: two arms, two cameras and a laptop" with "Picture the hardware every later figure refers to". A description block placed after 700 words that already used the arm, its 33.3 ms period and its policy: out of order, and its header description is about the page.
9. "Four of the eight boxes carry a CPU tag". Prose reading its own diagram back (the "Look at the tags again" family), though the consequence that follows ("Those cores are the part bought by accident") is good.
10. Stage table, row 6: "GPU tensor cores, lightly for the small model one arm trains." and row 7: "A mix inside every attempt: physics, simulated cameras and policy inference." Rows at equal weight whose content is "same as above"; the table has eight rows because the loop has eight stages, and three of them tell the reader nothing new.
11. "It can run on Spot, EC2 capacity that AWS takes back after a notice issued two minutes before, on a best-effort basis." Tangled; the best-effort clause attaches to the wrong noun.
12. "To place a job of your own, do what the first screen did." Self-reference in the closing action; the last sentence is a pointer to "the four ideas and three routes".
13. "The first question, worked." A fragment label in place of a sentence, with a matching heading "The second question: ...": the structure is narrated.

What is good: "they share the arm and almost nothing else"; "Size the loop as "GPU training" and the part that fills first is often a CPU core, on a machine bought for its GPU."; "What a job loses when it stops is what it has not yet written to storage, so the checkpoint interval is a setting that decides the market"; the laptop-versus-standing-tier example for "Part and shape are separate axes."

---

## doc-E: 4. Learning From Demonstrations: Why Copying Drifts and What Fixed It

Scores
- argument 9: the first sentence is a claim with a mechanism, paragraph 2 works two numbers (600 decisions to 6; 1% to 44%), paragraph 3 says what it costs; every block advances the same argument and the ending collects it.
- depth 9: the T squared bound and which factor to attack, four action heads with losses decomposed, call-time breakdown (46 of 73 ms before the first flow step), defaults that differ from the papers, a symptom-to-setting table.
- clarity 8: intuition, then formula, then decomposition, with toy numbers that can be redone; two symbol collisions are flagged at the switch.
- sentences 8: the best run of consequential sentences in the batch, with some provenance clutter and a few label fragments.
- parity 9: the file I would hold the others against for this reader.

Findings
1. "Two changes contained it, and every current policy is built from both." Against, 7,000 words later, "How far the generative head is needed is less settled. The authors of OpenVLA-OFT ... changed its head to predict the whole chunk in one parallel pass with a plain L1 regression loss, and report success ... rising from 76.5% to 97.1%." The opening overclaims and the closing walks it back. Scope the opening sentence.
2. "Flow matching keeps the plan, noise in and a chunk out, and straightens the route so that far fewer steps are needed." and "Flow matching is diffusion with a straight path and few steps." Why a straight path permits fewer steps (a straight line is followed exactly by coarse steps, a curved one is not) is never said. The toy example shows a straight path being walked; it does not show the saving. This is the section's one real leap.
3. "In our reading, robot imitation mostly took the other road"; "In our reading that is also how tokens avoid the average"; "In our reading, 10 steps where Diffusion Policy trains with 100 iterations is the practical case for it"; "In our reading, sampling one mode is a strong tendency on human demonstrations and falls short of a law"; "The symptoms in the first column are our reading of the mechanisms; the causes and the settings are the cited ones."; "That rate is an illustration; nobody measured it."; "The obstacle is our illustration and the property is general"; the column header "Time per call, as the authors report it". The same tic as doc-B at about half the density. It is the one thing that marks this file as kin to B, D and G.
4. "The token model, if its chunks are the one-second chunks the same passage describes for pi0, spends 750 ms of each second, 75%." The writer's uncertainty about a source, worked out in front of the reader. Decide, or drop the figure.
5. "For the machine, a policy is two jobs of different shape" and then three are described (training from scratch, "another size of job" inside a large pretrained model, and "The call on the arm"). "That is one GPU for an afternoon with no second machine to talk to" is an odd way to say single-node.
6. "Multiply by the time of one call measured on your GPU and the result has to stay well under 1 (section 17, Running on the Robot, gives the rule for how far under)." The closing action defers the one threshold it needs.
7. "The weights are w_i = exp(−m i), where w_0 belongs to the oldest prediction and m sets how fast a new observation takes over (a smaller m is faster)." Formula inline with no intuition for why the oldest prediction gets the largest weight, and "smaller m is faster" is left for the reader to work out.
8. "The table from above." (twice, as caption and as step text). It means the table top seen from overhead; on a page with five data tables it reads as "the table mentioned earlier".
9. Label fragments that narrate the structure: "Put toy numbers in.", "Back to the toy episode.", "Four symbols.", "Now the product.", "Two things to know before you open the code." Each is harmless; five is a habit.
10. "Fifty is a working number." Unclear ("a number that works"? "a rule of thumb"?). "The distance is routine." has no clear antecedent for "distance".
11. "pi0, a robot model from Physical Intelligence" is glossed in paragraph 2 and again, in the same words, in the flow-matching block.
12. "A style variable (ACT)." / "Denoising (diffusion policy)." / "A velocity field (flow matching)." Three of the "Four designs" get run-in labels, spread over two h2 blocks, and the fourth (tokens) gets an h2 and no label. The parallel structure promised by "Four designs are in use" is not kept.
13. "CVAE (conditional variational autoencoder), a model trained to rebuild its input through a small random vector." Too compressed to carry meaning; the next two sentences do the work and this gloss could go. "keep z small enough to drop" is likewise loose until the decomposition paragraph.
14. "so read across a row and compare rows with care." Say the reason in the clause (each row is a different GPU), which the sentence before already holds.
15. The header description runs to about 60 words, uses "chunk length", "action head" and "tick" cold, and ends in a source list.

Sentences that set the bar: "A network trained to copy a person's demonstrations fails for a reason its training loss never sees."; "Behaviour cloning is regression whose test set is written by its own mistakes."; "halve ϵ and the ceiling halves, halve T and it drops to a quarter. T is the factor to go after."; "Chunking survived from ACT into the pi0 line and ensembling did not."; "Chunks make a slow call possible, and the call still costs distance."

---

## doc-F: Roofline and Arithmetic Intensity

Scores
- argument 8: one clear claim (precision moves the ridge more than a chip generation) backed by a table; the first two paragraphs are history and three definitions.
- depth 9: ridges across eight chips and three precisions, the Rubin regime flip, the 69 tokens per second ceiling, three levers with the limit each one hits.
- clarity 5: written for someone who already knows prefill, decode, KV cache, GEMM and fused kernels; the 2 FLOP per weight is asserted, never shown.
- sentences 7: dense and consequential in the analysis, listy where it names techniques and tools.
- parity 8: with doc-A, the most economical file; with doc-A, the least kind to the stated reader.

Findings
1. "A precision step on one chip moves it 2x on H200 (206 to 412) and almost 9x on Rubin (182 at BF16 to 1,591 at NVFP4)." The H200 figure is one step (BF16 to FP8); the Rubin figure is two steps (BF16 to FP8 to FP4). The comparison that carries the section's thesis is not like for like. One step on Rubin is 4.4x (182 to 795), which still makes the point honestly.
2. "A 4k-token prompt at batch 16 puts 65,536 tokens behind each weight read, far above the H200 ridge." Tokens are compared with a ridge in FLOP per byte with no conversion, and 65,536 assumes 4k means 4,096 without saying so.
3. "A dense model does about 2 FLOP per parameter per token: about 1 FLOP per byte with FP16 (16-bit floating point) or BF16 weights, about 2 with FP8". The origin of the 2 (one multiply, one add per weight) is never stated, in the section whose whole method is this ratio.
4. "The roofline model, published by Williams, Waterman and Patterson in Communications of the ACM in April 2009, ... answers one question about any workload on any chip". The first sentence spends its opening on a bibliography entry. "Three quantities." then opens a paragraph of three definitions (fault 1: definition first).
5. "Second, GQA (grouped-query attention), KV-cache quantization, FlashAttention-class fusion and speculative decoding speed up decode by cutting the bytes moved per useful FLOP." Four unexplained techniques in one list with one shared predicate. "Disaggregated serving instead runs prefill and decode on separate GPUs" is then offered under "Two consequences" as an unnumbered third, joined by "instead".
6. "That is why vLLM (including vLLM Neuron on Trainium), TensorRT-LLM and SGLang spend so much code on continuous batching." and "CUTLASS, CuTe and Triton on NVIDIA and NKI (Neuron Kernel Interface) on Trainium emit fused kernels; NVIDIA Compilers and Kernel Tooling and AWS Compilers and Kernel Tooling cover them." Name lists; "continuous batching" and "fused kernel" are not built for this reader.
7. "Tokens per second tracks HBM bandwidth almost linearly until another limit binds." Which limit? Same unnamed limit as doc-A's "fixed latency floor".
8. "Prefill processes the whole prompt in parallel to fill the KV (key-value) cache". Prefill, decode and the KV cache are used as known; an expanded acronym is the only help offered.
9. "HBM bandwidth divided by the bytes read per token, the active parameter bytes plus the KV-cache bytes. A 70-billion-parameter dense model in FP8 reads about 70 GB per token". The formula includes KV-cache bytes and the worked example silently drops them.
10. "The roofline, placed". An odd heading; its description does the work.
11. The ending: "Quantization and Precision covers the full ladder and the numerics that make FP8 and FP4 usable at model scale." The section closes on a pointer, one sentence after a good action ("Before you pick a precision, read your chip's row in the ridge table").

What sets the bar here: "FP8 doubles both the ridge and decode's intensity, so decode runs about twice as fast and stays just as far from the ridge."; the Rubin paragraph ("a decode batch that was compute-bound at BF16 can land back on the bandwidth slope at FP8, faster but bandwidth-limited again"); "Compute the ridge from the system you are buying."

---

## doc-G: 2. Getting Started: Four Ideas and Three Routes

Scores
- argument 5: the four ideas are each a claim with a consequence; everything after them is navigation, presented four times.
- depth 4: two good numbers (22.9 ms against 149.0 ms; 90,000 rows for up to 50 minutes of steering); no mechanism, by design.
- clarity 7: easy to follow; idea 4 turns into an inventory.
- sentences 6: the ideas are well made, the rest describes the page.
- parity 5: a navigation page; no file from another dive in this batch is of the same kind, so the comparison is against sections that argue, and it loses.

Findings
1. The section list is given four times: the "Idea / Built in / What you get there" table, the three route bullets, the route map with its W, P, C letters, and the nine-row "Part / Sections / What it hands on, and what it needs" table. Roughly 60% of the page is a table of contents in different shapes. One map and one sentence per route would carry it.
2. "Hold four ideas and any section opens out of order; then take the route of eight, thirteen or twelve sections that matches why you came". A header description about the page, with three counts that mean nothing until the page has been read. The title "Four Ideas and Three Routes" has the same fault, and the h2 descriptions repeat it: "Check that the starting point is yours, and know which sibling dive holds what is left out"; "Pick the route for your reason and read eight, thirteen or twelve sections in place of all thirty".
3. "Each idea is stated here in a paragraph and built in full elsewhere. A route that skips the building section still reads, because the paragraph is all a later section assumes."; "Each robotics term is built in the sentence that first needs it, on one example"; "A route can skip ahead because the parts feed each other in one direction. Where a section needs an earlier one, the last column says so." Prose about the prose (fault 4), including a promise about writing method that the reader has no use for.
4. "Nine parts on the chip are tracked from section 20 on. Two belong to the CPU: the front end, which fetches and decodes instructions, and the back end, which executes them. Two belong to memory ... Five belong to the GPU ... Storage and network are parts outside the chip. (The grouping is ours.)" An eleven-item inventory inside what was a clean idea, with glosses too thin to use and a bookkeeping parenthesis. It is the owner's "eight stages, five uses, four objects" exactly.
5. "The exception is the ray-tracing cores: the NVIDIA profiling guide read on 2026-11-20 lists them as a unit, and no metric for them was found in its text." A research note about one counter, on the getting-started page, at the same weight as the four ideas.
6. "Read top to bottom: every route runs in section order. The outlined cells are the selected route, and the letters on a cell say which routes pass through it, which shows where two routes share a section. A cell with no letter is on no route." A user manual for a widget, as a caption. If a figure needs four sentences of operating instructions it is the wrong figure.
7. "Read front to back, the 30 sections follow an episode round the loop and then size what it met." "size what it met" is obscure, and "the loop" has not been named on this page.
8. "The starting point is someone who builds or runs software. ... vision-language models are at least a name. ... of reinforcement learning (training by trial and reward) only the name." The page describing its reader in the third person; "at least a name" is coy.
9. "Section 1 worked one case:", "(our single runs)", "(our arithmetic on those defaults)". Self-reference and bookkeeping in the four ideas, which are otherwise the best part.
10. "Section 5, Vision-Language-Action Models, covers policies built on a network that also reads a text instruction; go there when an announcement names one." A strange trigger for reading a section.
11. "Four ideas are enough to open any of the 30 sections out of order". The first sentence is about the page's navigation; the claim that matters ("Each one changes a decision") is the second sentence and should lead.

What is good: "A model that serves requests is judged by its throughput, or by a latency someone chose. A policy is judged against a period the arm sets, and an action that arrives after its tick is an action for a scene that has already changed."; "The first figure fits inside a tick and the second is several ticks long."

---

## doc-H: 9. RLVR & GRPO

Scores
- argument 8: paragraph 1 gives a result (15.6% to 77.9%), paragraph 2 gives the claim (same-score groups give no gradient) with the writer's own measurement; the last block proves it with a formula that predicts the measurement. The middle is knob tables.
- depth 9: advantage worked by hand, six successors mapped to the term each changes, defaults in two frameworks at pinned versions, a docs-versus-code discrepancy, p^G + (1 - p)^G checked against a run.
- clarity 6: leans on sections 6 and 7 for baseline, clip, ratio and critic; "rollout", "gradient" and "step" are used in paragraph 2 without being built here.
- sentences 7: precise and consequential in the worked parts; table cells and several paragraphs are dense reference text.
- parity 8: argument at both ends, manual in the middle; the closing block is as good as anything in the batch.

Findings
1. "RLVR (RL with verifiable rewards, where RL is reinforcement learning) uses a program as the reward: a rule that compares a boxed final answer with the reference, or a compiler that runs the code against predefined test cases". Opens on a definition with a nested parenthesis; "a compiler that runs the code" is loose (compilers do not run tests). The title "RLVR & GRPO" is two acronyms and no claim.
2. "the step spends its rollouts on that prompt for no gradient". Rollout is never defined in this file, and "step" and "gradient" are assumed. The paragraph that states the thesis is the hardest for the stated reader.
3. "GRPO is the sampled-baseline route of section 6, Policy Gradient." The mechanism section opens by placing GRPO in another section's taxonomy; "baseline" is not rebuilt, so a reader arriving here gets a pointer where an intuition was due.
4. The successors table is reference-manual text at equal weight (fault 6): six rows, and nothing says which one a first run needs. Cells lose the reader: "REINFORCE++'s authors argue that per-prompt normalisation is a biased estimator with a tendency to overfit." (why?); "In Qwen's MoE runs, GRPO needed a training strategy called Routing Replay to converge and GSPO did not." (Routing Replay is a name only); "while a likely token is not held back" (unexplained). The last row packs two methods into one cell.
5. "'Bias' in this table means a systematic tilt in the objective, a different sense from the statistical bias of section 6. Two terms from section 7 recur. The probability ratio is ... the clip is ... Entropy measures ..." A definitions paragraph in front of a table, opened by a sentence about the table's vocabulary (same pattern as doc-C finding 4).
6. "The paper's first arXiv version reported 71.0%; the second arXiv version and the Nature paper report 77.9%". Version history of a source. It changes nothing the reader does.
7. "That base family is a special case: GRPO with randomly assigned rewards raised Qwen2.5-Math-7B's score on MATH-500 (500 competition-math problems) by 21.4 points". The most startling fact in the file is dropped in mid-paragraph with no consequence drawn (do not trust RL gains measured on this base), then handed to another section.
8. "AWS suggests importance_sampling for a team new to multi-turn RL, and calls PPO with clip thresholds of 0.8 and 1.2 the safe baseline for any first run". Two recommendations for the same reader that appear to conflict, left unresolved; "importance_sampling" and "cispo" are identifiers with no explanation. The whole "The same knobs on a managed job" block is a settings table with one sentence of guidance.
9. "in our reading of the code" (twice), "(REINFORCE++, in our reading of the identifier)", "(our arithmetic)" (three times), "The page gives the identifiers; the right-hand column is our mapping onto the terms above." The bookkeeping fault, at lower density than B and better placed (it marks real code readings), but seven instances.
10. "Those two divisors, the answer's length and the group's standard deviation, are the first terms the successors in the next block change."; "a variant the next blocks return to"; "Read prompt A first."; "The table maps each term onto its setting in both frameworks." Prose about the page.
11. "On the 32B base where RL worked, distillation from DeepSeek-R1 did better still; section 11, Distillation or RL, gives the comparison and when each wins." A one-sentence paragraph that exists to point elsewhere, with no number.
12. "Section 25, Choosing a Technique: Fine-Tuning, a Text Loop or a Hybrid, turns the same measurement into its second decision question: what the model scores on your signal today." The file ends on a pointer, one sentence after the best closing action in the batch.

What sets the bar here: the two-prompt worked advantage; "Either one alone leaves the other tilt in place"; "The curve is symmetric: a prompt solved 99% of the time is as silent as one solved 1% of the time."; "Before you pay for a run, sample a group of answers from the starting model for each training prompt ... and count the prompts that pass every time or never."

---

## Batch answer

### Groups by quality alone

Group 1, files that argue and reach level 400: E, then A, F, H, with B at the lower edge.
Group 2, files that open as an argument and then turn into a tour: D.
Group 3, files that are mostly a map of other sections: C, G.

What separates group 1 from groups 2 and 3:
- A claim is proved on the page. E proves the T squared ceiling and prices four heads; F proves the precision claim from a table; H predicts its own experiment with a formula; A derives 412 against 2 to 10. C defers every proof to "section N" (50 times). G is navigation after its fourth idea. D proves one thing on a stand-in and then says the figures do not transfer.
- Numbers are worked, early, and reused. A, B, D, E, H have a worked figure by the third paragraph; F by the fourth; C has one figure in the file; G has two.
- Configuration and failure are tied to mechanism. B, E, F and H end blocks on what to set or check and why. C, D and G end blocks on where to read next.

What separates files inside group 1:
- A and F are the most economical and the least kind to the stated reader. Both assume prefill, decode, KV cache, FLOPS, warps and fused kernels; clarity 5. Their fault is omission.
- B and E are the kindest to the stated reader and the longest. Their fault is commission: provenance clauses ("in our reading", "as its authors report", "an illustration; nobody measured it"), structure-narrating fragments, restated numbers. B has all three at roughly twice E's density, plus a visible "Capture slot" placeholder and a manual-style action block, and that is why B sits below E.
- H sits between: argument at both ends, reference tables in the middle, some of the same bookkeeping.

### Would a careful reader tell some files apart by quality alone?

Yes, on two different lines.

1. By whether the file argues or tours: C, D and G are distinguishable from A, B, E, F and H. C and G plainly; D less so, because its first screen is built like the good files and only the evidence and the last third let it down. This is not just genre. Doc-A is also a framing section and it argues, with a number, in 1,300 words; doc-C and doc-D have the same job and spend it on contents tables. C comes from a different dive than D and G (by its subject), so "overview that tours" is a fault shared across dives, not the mark of one.

2. By a sentence-level tell: B, D, E and G share a provenance habit (the writer telling the reader which claims are "our reading", "our arithmetic", "ours", "illustrative, not measured") that A and F do not have at all and H has lightly. A careful reader would group those four files by that habit without looking at topic. In E it is a blemish on the best file in the batch. In B it is frequent enough to change the voice from confident to defensive. So the habit identifies a family; it does not by itself make a file weak.

The converse also holds and should be said: on argument, depth and care for the level 100 to 200 reader, E is better than every other file, and B is at least level with A, F and H. If the question is whether B and E can sit beside A, F and H: E can without qualification; B can once the hedges, the placeholder and the repetition are cut. D, G and C cannot as they stand.

### Verdicts

- doc-A: sets the bar. Tool in sentence 1, number by paragraph 3, ending that returns to it. Marked down only because a level 100 to 200 reader cannot follow its middle.
- doc-B: distinguishable: weaker, narrowly and at sentence level only. Substance equal to the best; eight "in our reading", five "as X reports it", a shipped placeholder, the same figures derived three times, and an action block ordered like a manual.
- doc-C: distinguishable: weaker. A taxonomy and a map; one number; 50 section pointers; nothing proved on the page.
- doc-D: distinguishable: weaker. Right shape on the first screen, but the lead evidence is a stand-in the text disowns, the central term is defined late, the counts (8, 12, 15, 5, 9) stand in for content, and a third of it is a contents table.
- doc-E: sets the bar. Claim, mechanism, worked numbers, defaults against papers, symptom-to-setting table, action ending. Fix the opening overclaim, the straight-path leap and the provenance clutter.
- doc-F: not distinguishable by quality from the best files. Strong thesis and numbers; one like-for-unlike comparison at the centre (finding 1), a definitional opening, and little help for the stated reader.
- doc-G: distinguishable: weaker. Four good ideas, then the section list four times and prose about the page.
- doc-H: not distinguishable by quality from the best files. Argument and proof at both ends, a reference manual in the middle, light bookkeeping.


Key to the blind file names: doc-A silicon dive Thesis and Framing; doc-B this dive section 3; doc-C feedback dive One Loop; doc-D this dive section 1; doc-E this dive section 4; doc-F silicon dive Roofline; doc-G this dive section 2; doc-H feedback dive RLVR and GRPO.
