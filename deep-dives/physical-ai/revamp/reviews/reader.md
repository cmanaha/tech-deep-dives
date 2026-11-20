# Test-reader review: Physical AI deep dive

Persona: working software / infrastructure engineer (reads TypeScript and Python, runs cloud infrastructure), level 100 to 200 on robotics, ML theory, simulation and CPU performance counters. Read in order: sections 1 to 8, then 20 to 25, from `/tmp/pai-text/`. Only what the page had said so far counted as known. Placeholder blocks were not marked down.

Scale: 10 = followed everything and could explain it to a colleague; 7 = followed the main line, lost a few details; below 7 = lost the main line somewhere.

## Scores

| Section | Score |
|---|---|
| 1. One Robot, One Loop | 9 |
| 2. Getting Started | 9 |
| 3. The Robot as a Computer | 9 |
| 4. Learning From Demonstrations | 8 |
| 5. Vision-Language-Action Models | 7.5 |
| 6. World Models | 9 |
| 7. JEPA | 7.5 |
| 8. Reinforcement Learning for Robots | 8 |
| 20. Fifteen Workloads, Five Shapes | 7.5 |
| 21. Reading a Machine: PMU Cards | 9 |
| 22. Our Measurements | 8 |
| 23. Price-Performance and Latency | 9 |
| 24. Orchestrating It on AWS | 9 |
| 25. Choosing | 8.5 |

Average: 118 / 14 = 8.4. No section below 7. Lowest three: 5, 7 and 20, all at 7.5.

---

## 1. One Robot, One Loop: 9

First lost: nowhere on the main line. One count did not add up:

- "Add three that the arm's owner uses as finished models and that only large labs run (generating video with a world model, and pretraining the big models the small ones start from), and the count is fifteen." The parenthesis lists two things for "three". I could not tell what the third was until section 20 (which splits pretraining into robot-model and world-model pretraining).

Further:

- "One multiplies tensors on many machines for days." "Tensor" is never said to be an array of numbers; I inferred it from "tensor cores are its units for matrix arithmetic". Small.
- "The part it fills first picks the machine: an instance sold for its GPU is the wrong buy for a job waiting on CPU cores." Fine, but "fills first" is carrying the whole dive and is only defined in passing ("the part that sets its speed while the rest sit partly idle"). It works; it would be stronger said once as its own sentence.

Worked best: the eight-stage list where every stage gets one plain sentence, and the definition of "shape" as three questions (how long a unit runs, whether pieces exchange data, whether it can be stopped). I could repeat both from memory.

## 2. Getting Started: 9

First lost: nowhere.

Further (minor):

- "Sections 3 and 4 are on the route because section 7 plans actions, and it uses action, chunk and control rate as known terms." "Chunk" has not been explained yet. Acceptable as a forward pointer, but it is the first appearance of the word.
- "The dive assumes no robotics: no control theory, no kinematics" names kinematics as something I do not need, then section 3 leans on "general kinematics" without a definition (see below).

Worked best: the four ideas, each with a real number on the SO-101 (six angles in, six targets out, 30 ticks a second, 1,800 rows per episode, 22.9 ms against 149.0 ms). The "training there, acting here" idea with the two latency figures made the rest of the dive make sense.

## 3. The Robot as a Computer: 9

First lost (a detail, not the line):

- "degrees = (raw - mid) x 360 / 4095" Two paragraphs earlier the page says "the SO-101's encoders count 4096 steps per full turn", and later "One encoder step is 0.088 degrees" (which is 360 / 4096). The formula divides by 4095 with no word on why the number changed. I stopped to check whether it was a typo.

Further:

- "A loose object has six degrees of freedom, three of position and three of orientation, so in our reading of general kinematics a five-joint arm cannot reach every position at every angle." "Kinematics" is used as a known field; it is never defined (only "inverse kinematics" is, two paragraphs later). The sentence is still followable from the six-versus-five count.
- "By our arithmetic, one joint swinging the fully stretched arm, 0.413 m long, at that speed moves the gripper at under about 1.8 m/s." The arithmetic is not shown (42 RPM to radians per second times arm length). Every other number in the section is redoable; this one is not without knowing the conversion.
- "LeRobot writes P = 16, I = 0 and D = 32 into each follower servo" The PID paragraph is good, but units of the gains are not given, so 16 and 32 are just labels to me. Harmless.

Worked best: "delay is distance". The three lines (8.3 mm, 25 mm, 62.5 mm), then the ceiling, the floor (backlash 3.6 mm) and the budget run backwards to 40 ms. This is the single most useful idea in the first eight sections and I could explain it at a whiteboard. The rate ladder (servo, host, policy) is a close second.

## 4. Learning From Demonstrations: 8

First lost:

- "ACT uses a CVAE (conditional variational autoencoder), a model trained to rebuild its input through a small random vector." I cannot picture "rebuild its input through a small random vector". What is random, and why does setting z to zero later give "one consistent way" and not a blurred average? The next sentences ("a second network looks at the demonstrated chunk and squeezes 'which way the person did it' into a vector z") rescued the intuition, but the one-line definition of CVAE did not help; missing: what an autoencoder is (encode to something small, decode back) before the conditional and variational parts.

Further:

- "Each camera image goes through ResNet-18, a standard image network, and comes out as a grid of feature vectors. The six joint angles go through one linear layer." "Feature vectors" and "linear layer" are not explained. I read it as "numbers describing parts of the image" and "a matrix multiply" and moved on.
- "A language model produces tokens, so one more option is to write the chunk as tokens and let the language model inside the robot model predict them one at a time." Two gaps: "token" is not defined anywhere before this, and "the language model inside the robot model" refers to an architecture that section 5 introduces. It sits in an expandable, so it cost little.
- "n_decoder_layers = 1, where the paper's table lists 7." "Decoder layers" is undefined. Also in an expandable; the practical point (code overrides paper) still landed.

Worked best: the T squared times epsilon bound. Symbols defined before the formula, each factor of T explained in words, then 0.6 against 360 with toy numbers, then "halve T and the ceiling drops to a quarter", which leads straight into chunking and the 1% to 44% result. The flow-matching worked number (0.8 to 0.2 in ten steps of -0.06) was also redoable and made the update rule concrete.

## 5. Vision-Language-Action Models: 7.5

First lost:

- "It turns each camera image and the instruction into tokens, and its job is to understand the scene and the request." "Token" is load-bearing from here on (image tokens, text tokens, prefix, output tokens, "280 tokens per compressed frame") and is not defined until section 6 ("Each position in the grid is one token, one vector the transformer processes") and again in section 7. For text I could guess; for "image tokens" I had no picture of what one is.

Further:

- "By our arithmetic that is about 15.6 chunks a second, and 15.6 x 16 gives room for 250 actions a second. So 120 Hz is a rate of actions; the model as a whole samples a chunk about 15.6 times a second." I lost the thread here. The paragraph before says System 2 (the VLM) runs at 10 Hz. Now the "model as a whole" samples 15.6 chunks a second. Does the 63.9 ms include the slow system or not? And if there is room for 250, where does 120 come from? The lesson ("ask which of the two it counts") is clear; the worked numbers left me with three rates (10, 15.6, 120) I could not reconcile.
- "N1.5 (2025) froze the VLM during training." "Frozen" is defined in section 6 ("meaning its weights are not updated while the rest of the model trains"), after it is used several times here ("keeps the VLM frozen", "how much of the backbone stays frozen"). I guessed correctly, but the definition is one section late.
- "vqbet: VQ-BeT: a transformer that predicts discrete action codes" and the rest of the 28-row table: "discrete action codes", "actor network", "mid-trained", "learned prompt vectors", backbone names (Qwen2.5-VL, InternVL3, Wan 2.2). As a lookup table inside an expandable this is fine; as reading it is a wall, and I skimmed it.

Also noticed: "The project page calls its on-robot variant, GR00T 2 Turbo, a smaller transformer and prints 2B parameters for it, the same figure the whitepaper gives for the full model (section 6); NVIDIA's two documents do not reconcile them." I followed it, but it is a source-discrepancy note in the middle of the two-clocks argument and it broke the flow.

Worked best: "a backbone plus an action head", with the pi0 walk-through in four steps (prefix, state padded from 6 to 32, action head refining 50 x 32 noise in 10 steps, host keeps six columns). Plus the cost formula `time per call = t_see + t_read + K x t_step` with pi0's 14 + 32 + 27 = 73 ms, which told me where the time goes. The practical ladder at the end (act, then smolvla, then groot or pi05 with GPU sizes) is something I could act on tomorrow.

## 6. World Models: 9

First lost: nowhere on the main line.

Further (details):

- "The result is then split into patches, giving 280 tokens per compressed frame and camera at 224 x 320 pixels." "Patches" is not explained until section 7. I could not redo the 280.
- "A small latent model: LeWorldModel's authors report a full plan in 0.98 s without saying which of two planner settings was timed, so one step of one candidate comes out between 22 and 65 microseconds." The two settings are not given, so the range cannot be reproduced, unlike the 2 ms and 300 ms lines above it.
- "With their optimisations it runs at 7 Hz, seven chunks per second, on 2 GB200 GPUs." GB200 (and B200, B300 later) is never introduced the way H100 and Jetson were. From context: a newer data-centre GPU.

Worked best: the glint on the cup. "You would bet on where the block goes and decline to bet on the glint" set up the whole pixel-versus-latent argument before any term appeared, and the section came back to it when it mattered. `next state = f(state, action)` set beside `action = policy(observation)` is the cleanest definition in the dive. The 8,000-candidate bill (16 s / 8,000 = 2 ms against 240 s / 800 = 300 ms) is arithmetic I could redo, and the page was honest that the slow side was set up by the authors of the fast side.

## 7. JEPA: 7.5

I followed the main line: encoder, target, predictor, loss between latents, why it could collapse, how planning works with CEM and what it costs. I lost several of the mechanisms inside "collapse".

First lost:

- "Why that is enough is a hypothesis, and the V-JEPA authors state it as one: the slow target ensures that the predictor evolves faster than the encoder and stays close to optimal, and that prevents collapse." I do not see why a predictor that "stays close to optimal" prevents collapse. The context encoder still receives gradient, and the target follows it by EMA, so both could still drift to a constant, only slowly. The page is honest that this is a hypothesis, but I came away with "it works in practice" and no intuition, for the mechanism the page says shapes its main model.

Further:

- "Z and Z' are two batches of latents that should match row by row. s is the invariance term, the mean squared distance between matching rows. v is the variance term: zero while the standard deviation of every column stays above a threshold, and growing when one falls below. c is the covariance term, which grows with the covariance between any two different columns." Too much at once, and it assumes I can compute a covariance. Where Z and Z' come from in a JEPA (predicted and target latents?) is not said. The toy batches helped for v; "their covariance works out to 0" I had to take on trust.
- "If every shadow is Gaussian, so is the cloud (the Cramer-Wold theorem)." and, in the expandable, "A distribution has a fingerprint, its characteristic function. For a batch it is estimated by two averages, mean_n cos(t p_n) and mean_n sin(t p_n), at a chosen value t." The "shadows" picture is good and I kept it. The characteristic-function block lost me completely: why cosines and sines of the projections fingerprint a distribution is not explained. It is in an expandable, so the cost is small.
- "Put the first row on the thread task." "Thread task" is not a term the page has used. I assume it means the dive's running pick-and-place task; it reads like internal vocabulary.

Smaller: "The predictor used in pretraining is the same for all three and far smaller: 22M parameters, 12 layers, vectors of 384 numbers." The encoder emits vectors of 1408 numbers and the loss compares predictor output with target-encoder output, so how a 384-wide predictor produces 1408-wide guesses is unexplained. And "ViT-g" (1B) against "ViT-G" (2B) differ only by capital letter with no remark.

Worked best: the CEM toy iteration (eight candidates, keep the three lowest, refit to mean -7 and spread 1). After that, "800 samples x 10 iterations x horizon 1 = 8,000 predictor passes" and the closing five questions for reading any JEPA paper felt earned. The stop-gradient and EMA explanations were also at the right level: "treat this value as a constant", and 0.5000 moving to 0.5003.

## 8. Reinforcement Learning for Robots: 8

First lost:

- "GRPO (Group Relative Policy Optimization) scores each attempt against the others in its group, so it needs no second model to judge them." What second model? Nothing so far has said RL normally uses one. It becomes clear much later, with Recap's value function. The page says it takes both algorithms as given and points at the sibling dive, which is allowed, but the clause explains GRPO by the absence of something not yet introduced.

Further:

- "It predicts the steps left until success as a negative number scaled to between -1 and 0, spread over 201 bins." "Spread over 201 bins" lost me: is the output a number or a choice among 201 buckets?
- "The formula below is the form the paper uses for its pre-training data, where the outcome is the whole rest of the episode. For the rollouts collected on the robot the paper shortens the outcome: the rewards over a fixed number of steps ahead plus the value predicted at that later step." Too much before the formula. I had not yet seen `A_t = R_t - V(o_t, l)` and was already being told about two variants of R_t. The worked numbers after it (-0.30 minus -0.40 = +0.10, above the threshold of +0.05, so "better") fixed it.
- "The Newton row renders plain colour and the RTX row a shaded data type, so the two renderers do not produce the same output." I do not know what a "shaded data type" is. In an expandable.

Smaller: "A trial is one attempt by the current policy, also called an episode or a rollout." "Rollout" meant an imagined chain of predictions in section 6; here it is a real attempt, and the switch is not flagged. "a two-layer convolutional encoder": "convolutional" is undefined.

Worked best: the three lanes, each with plentiful, scarce and "waits on". The contrast of 144 attempts an hour on the real arm against 197 million simulated control steps (228 days of one arm) is the number I will remember. The closing advice by what you own (one GPU, a few hours of attention, eight GPUs with a wall-clock cap) is directly usable, and the lost-checkpoint story is the kind of practical detail I came for.

## 20. Fifteen Workloads, Five Shapes: 7.5

First lost:

- "CPU back end: The second half: it runs micro-operations on the arithmetic units and retires them in order." with its sign "Back-end bound slots with little waiting on memory, called core-bound: the arithmetic units are busy, or each operation waits for the one before." This table arrives one paragraph after slots and micro-operations are introduced in a single sentence, and uses "retires", "bound", "front-end bound slots" and "core-bound" as if built. Section 21 builds them properly and the page says so, but in reading order the first table of the compute route is written in vocabulary that is taught one section later. I read the four CPU rows twice and only really understood them after section 21.

Further:

- "In our measurement, a single run on one Cortex-A78AE core of an NVIDIA Jetson Orin Nano Super, it ran 390 inferences per second" and then "one Cortex-X925 core of an NVIDIA DGX Spark streamed 44.38 GB/s". The DGX Spark is not introduced here (section 21 calls it a desktop machine, section 22 describes it). "Measured streaming limit" is also unexplained: I did not know how one measures it until section 22's "triad loop".
- "One captioning run in the same tool's design notes, cancelled before it completed, left 32 H100s at about 17% utilisation because fetching the clips was the slow side." "The same tool" has no antecedent in the text; no tool has been named in that bullet. (The citation label says Cosmos Curator.)
- "In Isaac Lab's benchmark file, one small camera per environment took a Cartpole run to 57.3 GB of GPU memory and cut its throughput by a factor of 6.7" "Cartpole" is not explained (a benchmark task, I assume). Section 8 said "A camera takes about half of that away" from the same file; here it is 6.7 times, with no word on why the two differ.

Also: the workload map is hard to read as text; the cell qualifiers ("first", "also", "then", "or", "gate", "mix") are explained only in the caption after the grid. In the rendered page this may be fine.

Worked best: the five shapes table, and the sentence "Coupling is the training fabric ... Interruptibility is storage ... Duration against the robot's clock is latency". As an infrastructure person this is the section's payoff and it maps directly onto how I already think about batch, checkpointed and real-time work. The demand-against-supply example (390 x 25.2 MB = 9.8 GB/s against 11.71 GB/s) is a method I can reuse. The note that nvidia-smi "utilisation" is time occupied, not capacity used, was new and practical.

## 21. Reading a Machine: PMU Cards: 9

First lost: nowhere on the main line. This is the best-built section I read; I had never seen top-down analysis and can now explain the four buckets.

Further (details):

- "Its roofline chart plots a kernel's achieved speed against how much arithmetic it does per byte of memory moved. It is the GPU counterpart of core bound against memory bound: the flat part of the roof is the peak compute limit, the sloped part is the memory bandwidth limit" Hard to picture without the picture. I kept "it tells you compute-limited or memory-limited" and nothing more.
- "SM activity is the fraction of time at least one group of threads was active on an SM." "Group of threads" on a GPU is not explained.
- "Linux v7.3 carries per-core files for the Neoverse cores and none for the Cortex-X925 or Cortex-A725, so our reading is that perf stat --topdown on a DGX Spark prints the uncorrected split." Followed, but the flush-correction block is long for the size of the effect on the cards I was shown. It did pay off in section 22's limits.

Worked best: the hand-sorted run (400 slots: 60, 100, 216, 24) followed by the formula read back against the two questions (0.6 x 0.9 = 0.54), followed by the same arithmetic on the real counters. Three passes at the same idea at rising realism. And "The X925 has the lower percentage and does more: 0.457 x 10 = 4.57 useful slots per cycle against 0.610 x 5 = 3.05" is exactly the trap I would have fallen into.

## 22. Our Measurements: 8

First lost:

- "On the Spark the memory stall is 22.8% of cycles on the A725 and 22.4% on the X925, and the throughput is 1,404 and 1,968 inferences per second against the Jetson core's 390." The read-aloud stops without a verdict for the Spark. The X925 card shows 67.0% back-end bound with only 22.4% memory stall, which by section 21's rule ("With a low memory share the arithmetic is the limit") would say core-bound; but the demand arithmetic further down gives 49.5 GB/s against a 44.38 GB/s triad, which says memory-bound. And the A725 card has memory stall (22.8% of cycles) larger than back-end bound (21.6% of slots), which I could not square. I do not know what part the policy stand-in saturates on the Spark, and the page does not say whether that is known.

Further:

- "A triad loop that streams through arrays larger than the caches" "Triad" is never explained (what the loop computes), and it is the reference for every bandwidth figure in sections 20 and 22. The difference from "a plain read loop" (9.25 against 11.71 GB/s on the same core) is also unexplained: why would the richer loop move more bytes?
- "The Jetson core loses 31.0% of its slots to the front end, the half that fetches and decodes instructions." No reason is offered for why the same physics code is front-end limited on one core and back-end limited on another. Perhaps unknown; if so, saying so would help.
- "Our reading of the Spark's kernel name is that 'simt' marks the general floating-point path, so this run says nothing about tensor cores" I followed the conclusion but had to take the reading of the name on trust.

Worked best: the stand-in table with its third column, "What it leaves out", and the closing line "take the method and leave the ranking". The five limits made me trust the numbers more. The triad split that flipped between passes (5.9% / 76.9% against 78.1% / 7.9% at the same throughput) is a useful warning about single runs.

## 23. Price-Performance and Latency: 9

First lost: nowhere.

Further (minor):

- "Actions, or chunks of actions, per second, with the p50 and p99 latency of one call (block 4 defines both)." "Block 4" made me count headings; a named pointer ("Latency where there is a deadline, below") would be easier.
- "units per currency unit = units per second x 3,600 / price per hour" Clear, but with no price printed anywhere the section stays abstract. The invented A and B example (2.5 times faster, 0.83 of the work per unit of money) carried it. This follows from the intentional price placeholder, so not marked down.

Worked best: "A unit of work is the thing one stage hands to the next", the per-workload unit table, and the p50 / p99 explanation tied to chunks ("If that call outlasts the actions left in the chunk, the arm has nothing to play"). The observation that NVIDIA's 149.0 ms is a median of 60 calls, so nobody has a p99, was a sharp, practical point. The five-step "what you can do today" list is something I could hand to a teammate.

## 24. Orchestrating It on AWS: 9

This is my home ground and the section respected it: three layers (queue, node provider, capacity market), then each product placed on them.

First lost: nowhere on the main line.

Further (details):

- "B. One node for hours: One Batch job, or a SageMaker training job" A fourth service appears in the mapping table; the introduction named three (Batch, HyperPod, EKS). SageMaker Training Jobs is only defined in section 25 ("runs one training container and keeps nothing running afterwards").
- "By our reading it helps the loop's long-running services and leaves its batch jobs, which are Kubernetes Jobs short of GPUs, as they are." I could not parse "Kubernetes Jobs short of GPUs".
- "Both lists hold P and Trainium types" Trainium is not explained until section 25 ("AWS's own training chip").

Smaller: the Greengrass recipe is the documentation's list-S3-buckets example, and the text says an uploader "replaces the script". Honest, but it is the one snippet I could not adapt directly, unlike the three Batch snippets.

Worked best: the three Batch snippets with a "changed / added / removed" account against the documentation's own examples, and the explanation of the retry block as a filter ("a bug in your code does not burn five machines"). The capacity-market table by family, with the finding that no G-family type is on the Capacity Block or training plan lists, is something I would not have found quickly myself. "Reach for HyperPod or a queueing layer on EKS when you can name the second team that will share the machines" is a rule I will reuse.

## 25. Choosing: 8.5

First lost (a detail):

- "Several G types, a second Region, or an ODCR." ODCR appears in the Simulated cameras row with no expansion; it is expanded in the legend under the table. Section 24 spelled out "On-Demand Capacity Reservation" but never gave the acronym.

Further:

- "No Rubin-based EC2 instance family is named or documented as of 20 November 2026." "Rubin" is not explained anywhere in my reading. From context it is a future GPU generation.
- "On-Demand, Spot and Savings Plans only Spot first." In the text the two market labels ("On-Demand, Spot and Savings Plans only", "Can be reserved for a window") run into each cell's own advice, and what the labels mean is explained only after the table. Probably clearer when rendered as badges; the legend would still read better above the table.
- "P5en or P6-B200: the sizes AWS's Cosmos 3 table gives for multi-node post-training, taken here as our reading for pretraining" "Post-training" is undefined (fine-tuning at scale, I assume).

Smaller: in the Record and encode row, "Uploads land in S3, and a Step Functions task can submit a Batch job for each" does not say what that Batch job does, so "The upload jobs: On-Demand or Spot Graviton" was unclear.

Worked best: the four ordering questions at the top ("each answer narrows the next") and the grounding in one real figure for this arm, 3.4 to 10.9 hours on one GPU, leading to "a service that runs a job and goes away, and no cluster". The "what would change a row" list (scale, cameras, company) tells me when to come back and re-read. The closing table is the artefact I would bookmark.

---

## Patterns across the 14 sections

1. **A few core terms are used one section before they are defined.** "Token" (used in 4 and 5, defined in 6 and 7), "frozen" (used in 5, defined in 6), "patch" (used in 6, defined in 7), front end / back end / retire / bound (used in 20, built in 21), ODCR and Trainium (used in 24 or the 25 table, defined later in 25), SageMaker Training Jobs (used in 24, defined in 25).
2. **Worked examples with small redoable numbers are the strongest device on the page**, and the places I got lost are almost exactly the places without one: the CVAE, the slow-target argument, the VICReg covariance, the 10 / 15.6 / 120 Hz paragraph, the Spark policy cards.
3. **Hardware names are introduced unevenly.** H100, Jetson Orin, Jetson Thor and Graviton get a clause each. GB200, B200, B300, DGX Spark (at first use in 20), Franka, Rubin and Cartpole do not.
4. **Internal vocabulary leaks in two places:** "the thread task" (section 7) and "block 4" (section 23).
5. **Sections 20 to 25 mostly handle back-pointers well.** ACT, VLA, latent, engine and closed-loop evaluation are all re-explained in a clause when they reappear. The compute route is readable after sections 1 and 2 alone, apart from the CPU rows of section 20's parts table.
