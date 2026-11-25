# Adversarial review, batch w4r2b, inputs inX

| File | Argument | Depth | Clarity | Sentences | Parity | Verdict |
|---|---|---|---|---|---|---|
| doc-A (Our Measurements: the speed-up depends on the part that runs out first) | 8 | 9 | 7 | 7 | 8 | not distinguishable by quality from the best files |
| doc-B (Getting Started: what changes when the model drives a robot) | 8 | 7 | 8 | 7 | 8 | not distinguishable by quality from the best files |
| doc-C (Price-Performance and Latency: when the faster machine is the better buy) | 9 | 8 | 8 | 8 | 9 | sets the bar |
| doc-D (Graviton Deep Dive) | 5 | 6 | 5 | 5 | 5 | distinguishable: weaker |

Verdict reasons:
- doc-C sets the bar. Its first sentence is the tool, every sub-heading is a rule that is then worked with a number, its hedges keep their scope, and it ends on a procedure.
- doc-A is not distinguishable by quality from the best files. It makes the same moves at greater depth. Its weaknesses are ordering and density (its thesis is refined two-thirds down; some blocks are out of order), not a lower class of writing.
- doc-B is not distinguishable by quality from the best files. It has the same voice and the same moves, adjusted to a first section. Its closing route map is the one block below the bar, and two figure pairs conflict on the page.
- doc-D is distinguishable: weaker. It opens on a definition and a launch timeline, labels itself, uses terms before building them, never measures the penalty its thesis rests on, contradicts itself on where the inference gain comes from, and closes on unreasoned bullets and a link.

---

## doc-A: "Our Measurements: The Speed-Up Depends on the Part That Runs Out First"

Scores:
- Argument 8: the claim and three numbers are on the first screen, and paragraph 2 already tests the claim against a measured ratio. It loses a point because the rule as first stated fails on that same example, and the rule that holds arrives two-thirds of the way down.
- Depth 9: slot accounting with its formulas, a recomputation from raw counters (36.54%), demand-against-triad arithmetic, an IPC-times-clock decomposition, multiplexing, the flush bias, per-core PMU sources and a working command. This is level 400.
- Clarity 7: every term (slot, retiring, front-end bound, TLB, PMU, card) is built before it is used. The density is very high, though, and several steps leave the reader to guess ("Two other counts do"). The GPU block also drifts away from the thesis.
- Sentences 7: most sentences carry a number and a consequence. About a dozen are knotted, vague or talk about the page.
- Parity 8: same class as the best file in the batch. It is denser and less cleanly ordered.

Findings, most damaging first:

1. **The opening rule is contradicted by its own first example, and the real thesis is buried.** Paragraph 1: "A program gains only the ratio of the part that limits it: the core's own execution, the rate memory streams at, or the time one read takes." Paragraph 2: "The physics step is limited by the core's execution, and the core's arithmetic ratio still overstates its speed-up twofold." Read literally, the rule fails on the first program it is applied to. The rule that survives is about 250 lines down: "A microbenchmark's ratio predicts a program only when the program is limited by the unit the loop measures. For a program limited by the core as a whole no loop stands in: measure the program on both machines, and its instructions per cycle times the clock take the ratio apart." This is fault 3: the thesis is buried, and the version on the first screen is wrong.
   Fix: open on the rule that survives, with the physics numbers as its proof. For example: "A microbenchmark's ratio carries over to a program only when the program is limited by the one unit the loop loads. Inside the Spark the X925 does multiply-adds 4.0 times as fast as the A725, and the physics step, limited by the core as a whole, ran 2.0 times as fast." Then bring in 6.5, 3.8 and 2.4 as the three rulers.

2. **The EC2 rule and its own example disagree, in the sentence that decides which instance a reader rents to profile.** "sizes that hold an entire dedicated processor socket generally get every PMU event: full support starts at c9g.12xlarge and c8g.24xlarge". A c8g.24xlarge (96 vCPUs) is a whole 96-core Graviton4 socket. A Graviton5 package has 192 cores, though, so a c9g.12xlarge (48 vCPUs) is a quarter of one. Either the socket rule or the c9g size is wrong, and the reader cannot tell which.
   Fix: check the guide's table and state only what it supports. For example: "full support starts at c8g.24xlarge, a whole Graviton4 socket, and at c9g.12xlarge on Graviton5". Drop the socket generalisation if it does not hold for Graviton5.

3. **The reader is told three times to record the core's clock and never told how.** "The clock ratio itself is inferred, because the cards carry cycle counts and no clock rate: record each core's clock beside its counters." / "Write down the rate, the four shares and the core's clock". The command block counts six PMU events and no clock, and the clock is what the section's own 1.4 inference was missing.
   Fix: add `task-clock` to the `-e` list and say that cpu_cycles divided by task-clock in nanoseconds is the run's mean clock in GHz. Alternatively, sample `/sys/devices/system/cpu/cpu$CPU/cpufreq/scaling_cur_freq` during the run.

4. **"Drew" treats a demand estimate as measured DRAM traffic.** "A triad figure is what one loop reached, not the most a core can draw: the X925's stand-in drew 49.5 GB/s." The 49.5 GB/s is passes times 25.2 MB. It equals DRAM traffic only if no byte of any pass is served from a cache. The conclusion that the triad is not the X925's ceiling rests on that assumption, which the text never states. A second possible cause is how the triad counts its own bytes (write traffic) against a read-only loop, which would also let a read-mostly program pass the triad figure.
   Fix: write "asked for 49.5 GB/s; if every byte came from DRAM, that is past its triad figure". Then count a last-level refill or bus-access event on the next run to measure the traffic, and keep "drew" for the measured figure.

5. **"Two other counts do", but only one appears.** "On the A78AE a low memory stall alone does not clear a program: ... Two other counts do." The next sentence gives one count, L2 refills per thousand instructions (4.57 against 41.82). The following paragraph's evidence, the X925 against the A725 at the same memory, is about the Spark, not the A78AE.
   Fix: name both counts in one sentence, or write "One other count does".

6. **Blocks out of order.** (a) At the physics verdict: "the triad, which streams memory by construction, read only 2.6% in one of two runs of the benchmark set". This raises the repeatability problem about 120 lines before "A split you can trust repeats" explains it, so the reader takes a doubt and no resolution into the verdicts. (b) The flush bias is introduced twice. Once for the A78AE ("The formula behind these cards also books the restart after a wrong prediction as front-end bound, and how much of the 31.0% that is cannot be checked"), and again 120 lines later ("One bias is known in advance.").
   Fix: put a short "how far to trust a card" block (repeatability, flush bias, the two-execution caveat) before the three verdicts. Alternatively, cut both early mentions down to one forward pointer.

7. **The GPU block never reads the shares its description promises, and it leaves the section's thesis.** Description: "Read the two throughput shares Nsight Compute gives for one matrix multiply, and record the GPU clock before you trust a duration from a Jetson". The body defines what 70.49% means and then turns to clocks and sizes. It never says what 70% compute against 50% memory implies for this kernel's bottleneck, which is the question the rest of the section trains the reader to ask.
   Fix: add one sentence of verdict, saying which unit is closer to its ceiling, whether either is near it, and what that predicts for a policy's kernels (which, with a SIMT kernel and no tensor-core figure, it mostly does not). Optionally also give the per-clock check: the 406 billion operations a second against what the Jetson's GPU could do at 306 MHz, which shows the clock rather than the chip set the 42.31 ms.

8. **A placeholder splits the how-to, and another sits away from what it replaces.** In "Make the card for your own workload" the order is: instruction, then EC2 sizes, then the placeholder (EC2 capability check), then the code block, then the closing steps. The reader is told "Pin the program to one core and count the six slot events as one group" and has to cross a placeholder to reach the command that does it. Separately, the first placeholder ("cards for the arm's real workloads ... in place of the stand-ins") follows the methods panel rather than the stand-in table it will replace.
   Fix: put the code block right after the "Pin the program" paragraph. Follow it with the EC2 paragraph and its placeholder, then the two closing paragraphs. Move the first placeholder to just after the stand-in table.

9. **The step for picking a core is knotted and incomplete.** "Set CPU to the number of a core of the type whose event source you name." The reader is not told how to find which CPU numbers are X925s.
   Fix: "Set CPU to one of the cores listed in /sys/bus/event_source/devices/armv8_pmuv3_1/cpus (the X925s); the same file under armv8_pmuv3_0 lists the A725s."

10. **Paragraph 2 hands over two numbers and withholds their meaning.** "one Jetson core stepped it 14,507 times a second and one Spark X925 core 57,240 times, under different MuJoCo versions. The clean comparison is inside the Spark". The ratio, 3.9, first appears in the table about 230 lines later.
    Fix: give 3.9 here and say in one clause why it cannot be read as hardware, or drop the cross-machine pair from the opening.

11. **Prose about the page, and bookkeeping (faults 4 and 5).** "Section 23, Price-Performance and Latency, takes up the method of comparing two machines on a unit of work." / "Every CPU figure here is a single run of one program pinned to one core" / the code caption "Our choices: the variable names and the program path."
    Fix: cut the section-23 sentence, or turn it into a link on "unit of work". Write "Every CPU figure is a single run...". Drop the "Our choices" line.

12. **Vague or knotted sentences.** "A program's ratio between two machines means something when the same program, at the same version, has the same bottleneck on both." ("means something" says nothing). "Across the Jetson and the Spark none of the three stand-ins passes." (passes what? The conditions were never called a test). "and how much of the 31.0% that is cannot be checked". "That leans the open question of its bottleneck on the Spark toward the core."
    Fix: "predicts the machines' ratio only when..."; "none of the three stand-ins meets those conditions"; "the part of the 31.0% that is flush recovery cannot be checked"; "So the Spark's open question leans toward the core."

13. **Minor: terms before they are built.** "one of three stand-ins run in place of the arm's real workloads" comes in paragraph 3, and the SO-101 is introduced 25 lines later. The opening's "vector units unused" comes before NEON and SVE are explained.
    Fix: name the SO-101 in paragraph 3, and say "the vector units, which work on several numbers at once" in the opening.

---

## doc-B: "Getting Started: What Changes When the Model Drives a Robot"

Scores:
- Argument 8: the first sentence is a claim ("experience with language models points the wrong way on each"), numbers arrive in paragraph 1, and each sub-heading is a claim its block proves. It loses a point for opening as a counted preview of its own sub-headings and for ending on a navigation map after its real ending.
- Depth 7: synchronous against asynchronous calls, chunk arithmetic, a 41.5 GB peak against 24 GB and 48 GB cards, backend=gpu, the nvidia-smi definition, cores per GPU and TensorRT's cosine check. That is level 300 to 400. The section's own claim that video is paid for in CPU cores has no decode rate behind it, and two pairs of its figures conflict on the page.
- Clarity 8: plain and mostly built in order. Policy, LeRobot and ACT are used before they are introduced.
- Sentences 7: many are crisp and consequential ("The monitor is the trap."; "So a dataset is small, and what it costs is a person's time."). There is a run of repetition in "sized twice" and a knotted sentence in paragraph 2.
- Parity 8: same moves and the same voice as the best file. The closing map is the one block below the bar.

Findings, most damaging first:

1. **The chunk margin is overstated about twofold, in the number a reader would size a robot computer on.** "Played one per tick they last 40 x 33.3 ms = 1.33 s, about nine times the call that produced them." The closing check reads: "check that the chunk it returns outlasts the call with room for the slowest ones". The section itself says an asynchronous call is planned "from an older observation". The actions covering the call's own duration are already past when it lands, and the rest must cover the next call. So with one call in flight, a call may take at most half the chunk: 667 ms, which is 4.5 times the 149.0 ms median, not nine. "Outlasts the call" is the wrong test.
   Fix: "...they last 1.33 s. The first 149 ms of them are past when the call lands and the rest must cover the next call, so a call may take up to half the chunk, 667 ms, 4.5 times this median." Change the closing check to "takes at most half of what the chunk lasts, its slowest calls included".

2. **Two figures from the same timing report conflict.** "with a worst cycle of 48.1 ms" and "writing the recording took 620.00 ms at its worst, more than 18 ticks, and no faster policy or camera removes a stall like that." If a 620 ms write sat inside a control cycle, the worst cycle would be at least 620 ms. Either the write runs outside the cycle (at episode end, or on another thread), in which case it does not stall the arm and the lesson drawn from it is wrong, or the two figures time different things. The reader cannot tell which.
   Fix: say where the write runs and what it holds up. If it runs between episodes, the lesson becomes "the 620 ms lands between attempts, where it costs bench time, not control".

3. **The section ends on a tour of the dive (faults 1 and 4).** Heading: "Shorter routes for a single question". Then: "Each of three routes covers part of the 30 sections: one for world models, one for the pipeline from a recorded attempt to many robots, and one for choosing machines and a scheduler." Caption: "The map shows which sections each route passes through, with the selected route outlined." This is the family of the owner's example "find the section that answers your question". It also comes after the real ending ("get four numbers"), so the last thing the reader meets is navigation rather than an action.
   Fix: move the map to section 1 or to the dive's navigation. If it must stay, put it before the closing paragraph, give each route the question it answers and the decision it ends on (for example, "Compute: which instance and scheduler for each workload, ending at section 29, Choosing"), and cut the caption's description of itself.

4. **A categorical claim closes off an option the reader has.** "Moving the decoding to the GPU would not help on the H100, a GPU widely used for training, which cannot hardware-decode AV1. So what you buy for video is CPU cores per GPU." That is true for an H100. GPUs with AV1 decoders exist on EC2, and a one-time re-encode is a third route.
   Fix: "So on an H100, what you buy for video is CPU cores per GPU; a GPU with AV1 decoders, or one re-encode of the dataset, is the other way out."

5. **The claim "video is paid for in CPU cores" has no quantity.** The sub-heading and the closing "four numbers" ask the reader to buy cores per GPU. Nowhere does the section say how many frames one core decodes per second, or how many frames a trainer consumes, so "cores per GPU" cannot be turned into a count.
   Fix: give one published or measured decode rate for 640x480 AV1 per core, and a trainer's frame consumption. If neither exists yet, say so and name the two rates to measure.

6. **Wrong noun in the definition that carries the GPU-utilisation trap.** "it is the share of the sample period in which at least one program was running on the GPU." The counter measures time during which at least one kernel was executing. A program can hold the GPU with nothing running.
   Fix: "at least one kernel, a function launched on the GPU, was running".

7. **Terms used before they are built.** "makes a small policy train 2.8 times faster" (paragraph 2) comes before "The policy is the trained model in control of the arm." "one LeRobot setting, backend=gpu" (paragraph 2) comes before LeRobot is introduced. "ACT, a small policy" never expands the acronym or says what ACT does. "for Diffusion Policy, one of its policies" says nothing about what it is.
   Fix: name the policy in paragraph 1 ("the model that drives it, its policy"). Move LeRobot's one-line introduction to paragraph 1. Write "ACT (Action Chunking with Transformers), a small policy that returns a chunk of actions per call".

8. **Repetition.** "A policy is trained where the GPUs are, with no deadline on any single step, and it runs on the computer beside the arm against the 33.3 ms tick. A model served from a data centre is trained and run on data-centre GPUs. A policy is trained on one and run on a small computer beside the arm, so the same weights are sized twice..." The first and third sentences say the same thing, and "trained on one" has no clear antecedent. Elsewhere, "Text needs almost no preparation before it is trained on" returns as "Text costs a language model almost nothing to prepare", and the H100 is defined twice.
   Fix: "A served model is trained and run on data-centre GPUs; a policy is trained on them and run on a small computer beside the arm, so the same weights are sized twice: in hours and gigabytes to train, in milliseconds against the 33.3 ms tick to run." Cut the second text-preparation sentence and the second H100 gloss.

9. **The comparison is asserted without its second number.** "The software on the robot moves the answer as much as the chip does." The paragraph gives the runtime effect (357.9 against 149.0 ms) but never the chip effect. 76.8 ms appears only as the Thor's figure before quantisation.
   Fix: "On the same Orin, TensorRT takes the call from 357.9 to 149.0 ms, 2.4 times; moving that TensorRT build to a Jetson AGX Thor takes it to 76.8 ms, 1.9 times."

10. **Knotted sentence in paragraph 2.** "one call of NVIDIA's robot model takes a median 22.9 ms on a training GPU and 149.0 ms on a robot's computer, in NVIDIA's benchmark with TensorRT, its inference compiler, on both."
    Fix: "In NVIDIA's benchmark, one call of its robot model compiled with TensorRT, NVIDIA's inference compiler, takes a median 22.9 ms on a training GPU and 149.0 ms on a robot's computer."

11. **The title names a topic.** "Getting Started: What Changes When the Model Drives a Robot". The claims are in the description and the sub-headings.
    Fix: "Getting Started: A Robot's Model Is Sized by Its Deadline, Its Video and the CPU Cores That Feed It".

12. **A "number" that is not a number.** "get four numbers: the control period (33.3 ms on this arm), the time of one call of your model on the robot's computer, the format of your recorded video, and the CPU cores per GPU".
    Fix: replace the format with "the frames per second one core decodes in your recorded format", which also answers finding 5.

13. **Minor bookkeeping (fault 5).** "The video is still about 230 times the rows (our arithmetic)." and "...64% of each step (our arithmetic)."
    Fix: move the provenance into the citation, or say it in one plain clause once.

---

## doc-C: "Price-Performance and Latency: When the Faster Machine Is the Better Buy"

Scores:
- Argument 9: the first sentence is the tool ("the better buy only if it costs less than five times as much, or ... draws less than five times the watts"). Paragraph 2 works it on 5.0, and every sub-heading states a rule its block then works with a number (the 1.94 against 2.4, the 4.5, 0.99^60).
- Depth 8: the room a chunk leaves a call, the percentile read as a miss rate, why 60 timed calls miss the tail, whole-instance pricing, finished units on Spot, physical cores per GPU across ten instance types, AV1 decode by GPU, VDD_IN against GPU-only watts, and a bounded power line. It loses a point because purchase price and energy are never joined into one figure, and one "floor" rests on an assumption it does not state.
- Clarity 8: built in order with one gloss per term. MAXN is never explained, and the half-chunk rule's assumption is unstated.
- Sentences 8: tight and consequential. There is one typo, one sentence in the opening about the page's own placeholders, and two display formulas that carry nothing.
- Parity 9: the bar for this batch.

Findings, most damaging first:

1. **The "floor" assumes something it never says.** "The two cores' test figures differ 3.8 times, and since the X925's figure is not its ceiling, 3.8 is a floor on what memory allows." The 3.8 is a floor only if the Jetson's 11.71 GB/s is the Jetson's own ceiling. The paragraph argues that the X925's figure is not its ceiling and says nothing about the Jetson's.
   Fix: "...and taking the Jetson's 11.71 GB/s as its ceiling, which its 62.3% memory stall at 84% of that figure supports, 3.8 is a floor on what memory allows."

2. **Purchase price and energy are left as two scores that rank in opposite directions.** "The purchase price enters as a cost per unit of capacity: price divided by units per second, where lower is better, while for units per joule higher is better." The case the section exists for, a Spark that costs more and may draw more, is exactly the case where the two disagree, and the reader is given no way to combine them.
   Fix: one sentence that combines them over a service life. For example: cost per unit = purchase price / (units per second x seconds in service) + energy price x watts / units per second. Alternatively, say which of the two decides beside a battery-powered robot (units per joule, since the battery caps run time) and which on a mains-powered bench.

3. **The opening talks about the page (fault 4).** "No price and no power reading under load has been collected yet, so placeholders hold the verdicts." In paragraph 1 this tells the reader the payoff is not here, and it names the page's own blocks.
   Fix: state the gap as a fact about the machines and move on to what can be worked: "No dated price or power reading under load exists yet for these machines, so the rule is worked here on the one ratio that does: 5.0."

4. **Whole-board watts for the Spark are demanded but no tool is named.** "No whole-system reading of the Spark is in our records, and dividing by one part's watts flatters the machine." The closing procedure says "record the whole board's watts ... from VDD_IN in tegrastats on a Jetson and never from a GPU-only reading" but names a source only for the Jetson. "is in our records" is also bookkeeping (fault 5).
   Fix: name a whole-system source for the Spark (for example, a power meter at the wall socket, which also counts the supply's loss), and write "No whole-system reading of the Spark exists yet".

5. **The deadline rule's assumption is unstated.** "The rest, what the chunk lasts minus one call, must keep the arm busy for the whole of the next call, so a call may take up to half of what its chunk lasts". This holds when the next call starts as the previous one lands, with one call in flight. A scheduler that starts calls earlier changes the bound.
   Fix: add the condition: "with one call in flight, the next starting when the last lands".

6. **The lead example fails the section's own like-for-like test, and the failure is flagged only later.** The opening demands "from one model and one software release, or it measures something other than the machines", then prices the 5.0. Later: "The policy pair meets the first two checks and leaves the third open: no NumPy release was recorded." Paragraph 3 hedges this, but not where the ratio is introduced.
   Fix: flag it where 5.0 first appears: "a per-core ratio of 5.0, with the NumPy release on each machine unrecorded, so a ratio of these two setups rather than of the two chips".

7. **Typo.** "NVIDIA Jetson Orin Nano Superand 1,968". Fix: "Super and".

8. **Two display formulas carry nothing.** "units per currency unit = units per second x 3,600 / price per hour" and "units per joule = units per second / watts" are unit conversions set out as display equations, at the same weight as the section's real rules (fault 6, mild).
   Fix: put them inline ("divide units per hour, units per second x 3,600, by the price of an hour"), or keep a display only for the combined figure of finding 2.

9. **The batch table gives every row equal weight, and its title is doubled.** "The unit of work for each batch workload" is followed by "The batch workloads of section 20, and the unit of work to count for each". Rows such as "Generative augmentation | Clips per GPU-hour, from published figures." and the pretraining row are never used in the prose.
   Fix: put the batch table in an expandable lookup under the clock table, with one title.

10. **MAXN is never explained.** "with its Orin in MAXN mode", "in MAXN mode", "Our Jetson ran in its MAXN_SUPER power mode". The reader is not told what the mode sets, which matters because it is why the 25 W ceiling may not hold.
    Fix: at first use, say what MAXN sets (the clocks and the power cap).

11. **Minor: a term defined in a placeholder before the body defines it.** "G (GPUs that also carry graphics and video hardware)" appears in the first placeholder, and then the body says "G7, one of EC2's G families (GPUs that also carry graphics and video hardware)".
    Fix: define it in the body and drop the gloss from the placeholder.

12. **Minor: the title points at the rule without stating it.** "Price-Performance and Latency: When the Faster Machine Is the Better Buy".
    Fix: "...: The Faster Machine Wins Only When Its Price and Watts Rise Less Than Its Speed".

---

## doc-D: "Graviton Deep Dive"

Scores:
- Argument 5: the thesis (two 96-core domains; keep a job inside one) is in the header and paragraph 2. But the section opens on a definition and a launch timeline, its inference block undercuts the thesis, and its placement advice is asserted in bullets with no reasons.
- Depth 6: the MMLA operand shapes, the ONNX Runtime session option, the numactl commands and the 16xlarge-spans-two-nodes surprise are level 400. The mechanism the thesis rests on, the cost of crossing nodes on Graviton5, is never quantified, and the bandwidth "per core" figures are peaks divided by the core count.
- Clarity 5: NUMA is used in the header, the thesis, the figure and the table before it is defined. Decode, GEMM, SGEMM, Neon, KV cache, Trainium, MIG, afp and wfxt are never built.
- Sentences 5: many are specific, but listy (dates, feature flags, instance names). Several carry no consequence, and a description and a caption are taken up with provenance.
- Parity 5: visibly below the other three.

Findings, most damaging first:

1. **The inference argument contradicts itself.** "SLM decode is bound by memory bandwidth (Roofline and Arithmetic Intensity, Small Language Models), so on Graviton5 the memory system is a larger lever than the instruction set." Then: "The 57% is a package figure: spread across 192 busy cores it is 4.4 GB/s per core, 21% less than Graviton4". Then: "The MMLA instructions do the same work they did on Graviton3 and Graviton4; the data reaches them faster." If decode is bandwidth-bound and each busy core gets 21% less DRAM bandwidth, the data reaches each core more slowly at full load, not faster. The block leaves out the two things that do favour Graviton5 per core: the clock (3.3 against 2.8 GHz, which the figure gives) and the LLC per core (2.6x). It also never says what comparison stands behind "AWS claims Graviton5 runs machine learning (ML) inference up to 35% faster than Graviton4" (the same vCPU count? whole instances?).
   Fix: state the comparison behind the 35%, then say which lever carries it. Per core at equal vCPUs, that is the clock and the larger LLC. Per package, it is the 57% more bandwidth. Then say that a decode job filling every core of a 48xlarge gets less DRAM bandwidth per core than on Graviton4.

2. **The penalty the thesis rests on is never measured.** Header: "keep a job inside one of them". Paragraph 2: "keep a job inside one domain where you can". The only crossing cost given is Graviton4's "crossing sockets measured 138.6 ns on average", a two-socket figure. The only Graviton5 latency figure, "AWS credits the single package with up to 33% lower inter-core latency than Graviton4", points the other way. The reader cannot tell whether binding to one node is worth giving up half of a 16xlarge.
   Fix: give Graviton5's same-node against other-node latency and bandwidth (a published measurement, or a placeholder for one). If none was found, say plainly that the advice rests on the topology alone.

3. **The opening is a definition and a timeline (the owner's fault 1, and fault 6).** "Graviton is AWS's own line of Arm Neoverse server CPUs." / "Graviton4 (Neoverse V2) was announced at re:Invent 2023" / "M9g became generally available in June 2026" / "Graviton5 is the first CPU in the AWS fleet with PCIe Gen6 and DDR5-8800" / "M9g and M9gd introduced the Nitro Isolation Engine (NIE)". Launch dates, PCIe Gen6 and NIE are never used again.
   Fix: open on paragraph 2's claim and its numbers: "A 192-core Graviton5 runs as two 96-core NUMA domains, each with its own 96 MB last-level cache; its DRAM bandwidth rose 57% while each busy core's share fell 21%." Move the dates and NIE into a table row, or cut them.

4. **"The model to carry." is prose labelling itself (fault 4).** It is the same family as "The number to carry out of this section".
   Fix: delete the label; the next sentence stands on its own.

5. **A theoretical peak divided by the core count is presented as bandwidth per thread.** "Databases sensitive to bandwidth per thread: 4.4 GB/s per busy core against 5.6 on Graviton4" and "a job that streams past the LLC on every core gets about a fifth less DRAM bandwidth per thread than on Graviton4". The 4.4 is the channel peak divided by 192. It describes only a package with every core streaming at once, and only at a peak no loop reaches. A thread on a partly loaded package is limited by its own outstanding misses, and one core can stream far more than 4.4 GB/s. The checklist row drops even the "every core busy" condition, and the section never says how memory channels are shared on sizes smaller than the package.
   Fix: label the figure "theoretical peak shared evenly by all 192 cores" wherever it appears, keep the condition in the checklist, and tell the reader to run a STREAM-style triad on the size they will rent.

6. **The placement lists assert without reasons, and one entry breaks the list's own rule.** "KV-cache management, tokenizer fleets, embedding servers" / "Microservices with locality-friendly data structures" / "Workloads sensitive to inter-core latency" / "JVM (Java Virtual Machine) garbage collection where heap traversal misses cache". None carries a reason or a number. A KV cache typically runs to gigabytes, far past the "Working sets that fit one node's LLC: 96 MB on 24xlarge and 48xlarge, 48 MB on 16xlarge and smaller" that heads the same column.
   Fix: give each entry the property that puts it there (its working set against 48 or 96 MB, its bandwidth per core), or cut the list to the rows the section has argued. Drop "KV-cache management", or say which part of it fits (its index, not the cache).

7. **Terms used before they are built.** NUMA appears in the header, paragraph 2, the figure and the table before "A NUMA node is a group of cores with the cache and memory closest to them" under the third heading. "SLM decode" never says what decode is. "QGEMM" and "SGEMM" never expand GEMM. "Neon", "KV-cache (key-value cache)" (expanded, not explained), "Trainium", "(Isolation: NIE and MIG)" and "afp and wfxt" are never built.
   Fix: move the NUMA sentence into paragraph 2. Give one clause each to decode ("generating one token at a time, which reads every weight for each token"), GEMM ("general matrix multiply") and Neon ("Arm's 128-bit SIMD instructions"). Cut afp, wfxt, NIE and MIG if nothing uses them.

8. **The instruction paragraphs describe without consequence (fault 2).** "Each one multiplies a 2x8 int8 matrix by an 8x2 int8 matrix into a 2x2 block of int32 accumulators, inside one 128-bit vector register." Also: "Graviton3 has the bf16 and int8 features, Graviton4 adds SVE2 (Scalable Vector Extension 2) forms of both, and Graviton5's additions are afp and wfxt", followed by "BF16 and MMLA are supported on Graviton3, Graviton4 and Graviton5", which repeats the first clause. The shapes and flags never become something the reader does or expects.
   Fix: add one sentence of consequence. For example: "That is 32 multiply-accumulates per instruction, twice a dot-product instruction's 16; Graviton5 adds no matrix instruction, so kernels built for Graviton3 and 4 run unchanged and gain only from clock and memory."

9. **Provenance takes the place of payoff in the description and the caption (fault 5).** Description: "The figures that size a move from Graviton4 to Graviton5, with AWS specifications, our arithmetic and third-party measurements marked apart". Caption: "bandwidth, per-core figures and the 96-core domains are our arithmetic on those ... AWS's processor table does not list metal-48xl."
   Fix: the description should state the payoff (for example, "Twice the cores and 57% more bandwidth, split across two LLCs: the rows that change a sizing decision"), and the caption should say what the figure shows. Put the provenance in the citations.

10. **The spec table reads like a reference manual (fault 6).** Rows such as "64 / 64 KB T1 AWS; 4-cycle L1D T3 Chips and Cheese measured" and "2 MB T1 AWS; 11 cycles T3 Chips and Cheese measured" carry Graviton4-only latencies that nothing uses. They sit at equal weight beside the rows that decide placement (LLC per node, NUMA nodes per size, bandwidth per core), and the figure above already shows the same data.
    Fix: keep the rows the prose uses and move the rest to an expandable.

11. **The binding advice leaves out what it costs.** "On 16xlarge and 48xlarge, confirm the layout with numactl --hardware, then bind threads and memory to one node". On a 16xlarge, that binds the job to 32 of its 64 vCPUs.
    Fix: "Bound to one node, a job gets half of a 16xlarge; run one copy per node, or rent a 24xlarge for 96 vCPUs on one node."

12. **The same arithmetic appears five times.** 537.6 against 844.8 GB/s, 5.6 against 4.4 GB/s, and 57% against 21% appear in paragraph 2, the figure, the table, the "DRAM bandwidth per core fell about 21%" block and the SLM block. Repeating the strongest number once lands it; five times is padding.
    Fix: derive it once, in the bandwidth block, and refer back to it after that.

13. **The title and one heading are generic.** "Graviton Deep Dive" names a topic. "What this means for workload placement" is the generic "what this means" heading.
    Fix: "Graviton5: Two 96-Core Domains in One Package"; "Keep a job inside one 96-core node: which sizes do it".

14. **The ending points away from the section.** "and start from the AWS Graviton getting-started guide". The last action is a link.
    Fix: end on the placement rule applied: "On a 16xlarge or 48xlarge, bind to one node before you benchmark, or the run measures the crossing."

15. **Minor: vague.** "Both current generations serve general server work and, increasingly, the host side of inference". "Increasingly" has nothing behind it. Fix: cut it, or give a figure.

---

## Batch answer (step 4)

**Groups by quality alone**

- **Group 1: doc-C, doc-A, doc-B.** All three:
  - open on a claim the reader can use and work a number by the second paragraph (5.0; 4.0 against 2.0; 33.3 ms and 38,400 times);
  - state a rule in each sub-heading and prove it with arithmetic the reader can redo;
  - scope every hedge ("single run", "an illustration", "not settled on the Spark");
  - end on what the reader types or measures.

  The differences inside the group are of degree, not class. doc-C is the cleanest. doc-A is the deepest and the densest, and its opening rule is refined only two-thirds of the way down. doc-B is written in a first-section register, puts a navigation map after its real ending, and has two pairs of figures that conflict on the page (the 620 ms write against a 48.1 ms worst cycle; "nine times" against the half-chunk rule).
- **Group 2: doc-D.** It is weaker in kind:
  - its first sentence is a definition, followed by launch dates and features nothing uses;
  - it labels itself ("The model to carry.");
  - NUMA, decode, GEMM and other terms are used before they are built;
  - the thesis (keep a job inside one 96-core node) never gets a Graviton5 crossing cost;
  - the inference block claims "the data reaches them faster" right after showing that per-core bandwidth fell 21%;
  - placement advice comes as bullets without reasons, one of which (KV cache in a 96 MB LLC) breaks its own column's rule;
  - provenance fills its description and caption, and it ends on a link.

**Would a careful reader tell them apart by quality alone?** Yes for doc-D. A careful reader separates it from the other three within the first screen, and the gap widens in its inference and placement blocks. No for doc-A, doc-B and doc-C among themselves. A careful reader would notice doc-A's density and doc-B's closing map, but would not put either in a lower class than doc-C. Fixing doc-A's findings 1 and 6 and doc-B's findings 1 to 3 would close what gap there is.

**Cross-file note.** doc-B's chunk test ("outlasts the call", "about nine times") and doc-C's rule ("a call may take up to half of what its chunk lasts", 4.5 times) disagree about the same GR00T call on the same arm. A reader who meets doc-B first carries away twice the real margin.


## Key (appended by the orchestrator after the review)

doc-A this dive section 22 (r2); doc-B this dive section 2 (published pilot, bar); doc-C this dive section 23 (r2); doc-D silicon dive Graviton
