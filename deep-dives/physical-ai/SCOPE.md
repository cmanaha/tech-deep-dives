# Physical AI: Scope

**Title:** Physical AI: From a Robot's Demonstrations to a Fleet That Learns
**Subtitle:** One arm, one task, every workload in the loop: the models, the data, the simulation, the machine each one loads, and how to orchestrate it on AWS.
**Directory:** `deep-dives/physical-ai`
**Status:** research complete to Gate 1; no app sections written. Gate 1 record in `RESEARCH-GUIDE.md` section 7.
**Date:** 2026-11-20. Every version named here was fetched on that date; see the currency tables in the registers.

Bracketed IDs such as (F03-12) point to claim-register entries in `research/2026-11/`. A number without an ID does
not ship. `[derived]` marks our arithmetic, `[vendor claim]` and `[author reported]` mark figures the source
published about its own work, `[our reading]` marks synthesis.

---

## The reader

A technical reader at level 100 to 200: works in IT or software, reads Python or TypeScript, runs infrastructure,
knows what a model, training, weights and a GPU are, and has heard of vision-language models. No robotics background,
no control theory, no reinforcement learning beyond the name. The reader may own a small arm (the SO-101) or be about
to, and may be asked to decide which instances and which scheduler a robotics team should use.

What the reader wants (the owner's words, 2026-11-19 and 2026-11-20): to learn world models, JEPA especially, and
every phase of the loop; to "understand really well the different parts that attach to the computer on physical AI
processes", "not only the shape and the instances that we are using", "but also to get the right orchestration"; with
"updated information", nothing "three years old". Teaching is "a bit more strong" but "balanced".

## Thesis

Physical AI is a loop, and the loop is about fifteen workloads. They share a robot and almost nothing else: one
decodes video on CPU cores, one traces rays, one multiplies tensors for weeks, one waits on a robot that moves at the
speed of a robot. Each loads a different part of the machine, and the part it loads decides the instance family, the
capacity market and the scheduler. The dive follows one task on one arm (an SO-101 picks up a block and places it in
a cup) through every workload, teaches the model behind each stage before sizing it, and ends with a table: workload,
machine part, instance family, orchestrator, capacity market, why.

The thesis carries no number of its own. The count of workloads and shapes is our grouping `[our reading]`, built in
section 20 from the registers; the figures that set each workload's shape are cited where they appear.

## The questions the dive answers

1. What is a robot, seen as a computer: what goes in, what comes out, how fast, and why delay is distance? (3)
2. How does a policy learn from demonstrations, and what do vision-language-action models add? (4, 5)
3. What is a world model for, what is the difference between generating pixels and predicting in latent space, and
   how does JEPA work, down to the predictor, the loss, collapse and planning? (6, 7)
4. Where does reinforcement learning fit for robots, and what happens when an agent runs the loop? (8, 19)
5. What happens to data between the robot and the trainer, and why can video decode bound training? (9 to 11)
6. What does simulation cost, why do ray-tracing cores decide the GPU, and how far can a simulator be trusted?
   (12 to 14, 16)
7. What runs on the robot, inside which latency budget, and how does the fleet close the loop? (17, 18)
8. Which part of the machine does each workload load, and how do we know? (20 to 23)
9. Which AWS orchestrator and which capacity market fit each workload? (24, 25)

## How sections are built

**Concept sections (3 to 8, 12 to 14, 16)** use one fixed order:
1. A scene on the arm: what the reader would see at the bench.
2. The idea in plain words, every term explained at first use.
3. One small worked example with real numbers on the block-in-cup task. Toy numbers are labelled as illustrations
   and the arithmetic can be redone by hand.
4. The mechanism: which tensor goes where, the formula with every symbol defined before it, then which term carries
   which part of the intuition.
5. What it costs in compute, and which part of the machine it loads. This step ties each concept to sections 20 to 25.

**Practical sections (9 to 11, 15, 17 to 25)** open by naming the concept section they depend on, link to it, and do
not re-teach it.

**Weight:** 10 sections teach concepts, 8 walk the pipeline, 7 cover compute and AWS, 1 is the glossary and sources.
World models and JEPA (6, 7) get the deepest treatment.

**Standards:** `docs/standards/explaining-concepts.md` (basics first, intuition then formula then decomposition),
`deep-dives/efa/revamp/section-shape-standard.md` (every block builds a mental model or is practical to know),
the repo's acronym, diagram and no-AI-tells rules. Every h2 description states the payoff.

**Freshness:** every model, simulator, framework, service feature, instance family and device the page names carries
the version and date fetched on 2026-11-20. A source older than 2025 appears only as labelled history or as the paper
that introduced a concept.

---

## Section plan (26 sections)

Each entry: payoff line, content in reading order, what it gives the reader (mental model or practical value), the
planned diagram, the registers that feed it. Numbers and their register IDs are in "Numbers by section" below.

### Part 1. Framing

**1. One Robot, One Loop**
Payoff: See the whole loop on one arm before any part is explained, and know which question each part answers.
Content: the scene (an SO-101 follower arm, a block, a cup, two cameras, a laptop). The loop in one pass: collect
demonstrations, process and curate, augment, simulate, train a policy, train a world model, evaluate, export and
deploy, then collect again from what the robot did. The thesis in plain words. The dive's nine questions with the
section that answers each. Figures are left to the sections that define their terms.
Gives: mental model (a loop of unlike workloads sharing one robot).
Diagram: the loop as a ring of eight stages around the arm, each stage tagged with the machine part it loads; inline SVG.
Registers: 08, 09 for the map; all others by reference.

**2. Getting Started**
Payoff: Four ideas to hold, and the shortest route for the reason you are reading.
Content: who this is for (above) and what is assumed. The foundation layer, specific to this dive: (a) a policy is a
function from what the robot senses to what it does next, run many times a second; (b) an episode is one recorded
attempt at the task, a table of timestamped observations and actions plus video; (c) training happens in the cloud
or on a workstation, acting happens on the robot, and a model must cross that gap; (d) "the machine" has parts that
saturate separately: CPU cores, memory, the GPU's tensor cores, its ray-tracing cores, its video engines, storage and
network. The prerequisite map with the section that owns each idea. The reading routes: "I want world models": 1, 2,
3, 4, 6, 7, 16, 22; "I want the pipeline": 1, 2, 3, 9 to 18 in order; "I want the compute answer": 1, 2, 20 to 25.
How sections feed each other. Links to sibling dives for what they own.
Gives: practical (a route) and mental model (the four ideas).
Diagram: a dependency map of the 26 sections with the three routes drawn over it; inline SVG. Prose first.
Registers: none of its own.

**3. The Robot as a Computer**
Payoff: Know what the arm senses, what it can be told to do, how often, and why 100 milliseconds is a distance.
Content, in the fixed order: the scene (leader arm in the hand, follower arm copying it). Sensors: joint encoders and
what proprioception means, cameras at the wrist and over the scene. Actuators: a servo as a motor with its own small
position controller. Degrees of freedom. Two ways to state an action: joint targets or a gripper pose (joint space
against end-effector space), absolute or relative. The rate ladder: the servo's inner loop, the policy, a slower
planner; the planner-versus-controller split. Latency as distance: speed times delay. The SO-101 and the LeRobot
stack as the concrete case: what `observation.state` and `action` hold, the recording rate, what drives the arm.
Gives: mental model (a robot is a sampled input-output system with a deadline) and practical (what the SO-101 kit is).
Diagram: the arm with each sensor and actuator labelled and the three loops drawn at their rates; a small
"delay to distance" chart; inline SVG and D3.
Registers: 01.

### Part 2. The models

**4. Learning From Demonstrations**
Payoff: Understand why copying a demonstrator fails in a specific way, and the two ideas that fixed it.
Content: the scene (fifty teleoperated episodes of block-in-cup). Behaviour cloning as supervised learning on
(observation, action) pairs. Compounding error: a small mistake moves the robot to a state the data never showed.
Action chunking: predict a short run of future actions at once. ACT (Action Chunking with Transformers) as the
worked case on the arm. Why averaging over several valid ways to do the task produces a bad action, and how diffusion
policies and flow matching sample one valid way instead. What each costs to train and to run.
Gives: mental model (errors compound over steps; chunks shorten the horizon; generative heads keep modes apart).
Diagram: a trajectory drifting off the demonstrated band, with and without chunks; a denoising sequence turning noise
into an action chunk; inline SVG.
Registers: 02.

**5. Vision-Language-Action Models**
Payoff: Read any 2026 robot-model announcement and know what the backbone, the action head and the two rates are.
Content: what a VLA (vision-language-action model) is: a vision-language backbone plus an action head; what goes in
and what comes out. The fast and slow split: a slower reasoning system and a faster action system, with published
rates. The current lines as of November 2026: the pi0 line, the GR00T line, SmolVLA, the OpenVLA successors, Gemini
Robotics, each with version and date. Which of them can be fine-tuned for an SO-101 today. Published training and
inference compute, labelled as the publisher's figures.
Gives: mental model (backbone plus action head, two clocks) and practical (which model to start from).
Diagram: one VLA drawn as blocks with token and tensor shapes on the arrows; a timeline of releases; inline SVG.
Registers: 02.

**6. World Models: Predicting What Happens Next**
Payoff: Know what a world model is for, and the one design choice that separates the two families.
Content: the scene (the arm about to push the block: what will the camera show next?). A world model predicts the
next state from the current state and an action. Five uses: planning, training a policy in imagination, generating
data, scoring a policy without a robot, and acting directly (world-action models). Family one generates pixels:
Cosmos at its current version, Genie, world-action models such as DreamZero. Family two predicts in a latent space:
why predicting every pixel spends capacity on detail that cannot be predicted, and what is given up. A side-by-side
on parameters and published time per clip, per rollout or per planned action, from first-party figures, each with
its GPU. Memory is shown only where a first-party figure exists.
Gives: mental model (predict the future, in pixels or in a learned summary) and practical (which family fits which use).
Diagram: the two families side by side, same input frame and action, pixels out against a latent vector out;
a use-by-family matrix; inline SVG.
Registers: 03.

**7. JEPA: Predicting in Latent Space**
Payoff: Follow a JEPA from pixels to a planned action, and explain why it does not collapse.
Content: the deepest section. The scene (two frames of the arm, a patch hidden). JEPA (Joint-Embedding Predictive
Architecture): an encoder turns frames into latent vectors, a predictor fills in the latents of the hidden or future
part, and the loss compares latents, never pixels. Worked example: frames to patch tokens to latents with real
shapes. The line: the 2022 position paper as origin, I-JEPA and V-JEPA as history, V-JEPA 2 and its
action-conditioned predictor, what followed in 2025 and 2026, and LeWorldModel read from its code. Collapse: the
shortcut where every input maps to one point, and the ways to block it: three taught in depth (a slowly moving
target encoder with a stop-gradient, variance and covariance terms, a regulariser that shapes the latent
distribution) and two in a paragraph each (contrastive negatives as history, a frozen pretrained encoder). Planning in latent
space: model-predictive control and the cross-entropy method, step by step, with the count of predictor passes per
decision. Training and inference compute.
Gives: mental model (encode, predict in latent space, compare; block the shortcut; plan by searching actions).
Diagram: the JEPA training graph with the gradient path and the stop-gradient marked; a collapse illustration; the
cross-entropy method as an animated sequence of sampled trajectories narrowing; inline SVG, D3 for the planner.
Registers: 03.

**8. Reinforcement Learning for Robots**
Payoff: Know the three places RL is used for robots and what each one waits on.
Content: one paragraph and a link to the Learning From Feedback dive for RL basics. RL in simulation: thousands of
parallel environments on one GPU. RL on top of a pretrained policy: improving a VLA from its own attempts. RL on the
real robot: the robot's time, resets and a human's corrections as the scarce inputs. What each costs.
Gives: mental model (same algorithm family, three different bottlenecks).
Diagram: three lanes (simulator, pretrained policy, real robot), each showing what is plentiful and what is scarce.
Registers: 04.

### Part 3. The data

**9. Collecting Data**
Payoff: Know what an episode is on disk and what it costs to make one.
Content: depends on 3. Teleoperation with a leader arm, hand-held rigs, fleets. The LeRobot dataset format at its
current version: what is in the tables, what is in the video files, how episodes are packed. Codecs: what the default
is and what it implies for whoever decodes it later. Bytes per hour.
Gives: practical (the format, the codec choice) and mental model (data is rows plus video).
Diagram: one episode exploded into its files and columns; inline SVG.
Registers: 05.

**10. Processing and Curating**
Payoff: See why the first bottleneck in training is often a CPU decoding video.
Content: depends on 9. Decode, filter, embed, deduplicate. Curation pipelines as a mixed CPU and GPU graph (Cosmos
Curator at its current version and equivalents). Which GPUs can decode which codec in hardware and which cannot.
Why decode in the dataloader can bound a training run.
Gives: practical (pick codec and instance together) and mental model (the data path has its own machine).
Diagram: the curation graph with CPU and GPU stages coloured; a codec-by-GPU support matrix as a Cloudscape table.
Registers: 05, 08.

**11. Augmentation and Synthetic Data**
Payoff: Three ways to get more data than you recorded, and what each one costs.
Content: depends on 6 and 12. Image-space augmentation in the dataloader. Demonstration multiplication in simulation.
Generative augmentation with a world model (Cosmos 3, which superseded the separate Cosmos Transfer and Predict
2.5 models, with the published time per clip; the 2.5 figures appear only as dated figures).
Gives: practical (which kind fits which hardware).
Diagram: one recorded episode fanning out three ways, each lane tagged with its cost; inline SVG.
Registers: 05, 03.

### Part 4. Simulation

**12. Physics Simulation**
Payoff: Know what a physics step is, what it costs, and when it moves from CPU to GPU.
Content: the scene (the arm in MuJoCo). What a simulator computes each step: contacts, constraints, integration.
MuJoCo, MJX and MuJoCo Warp, Newton, Isaac Sim and Isaac Lab at current versions. Steps per second on a CPU core
(our Tier 0 measurement, one run) against thousands of parallel environments on a GPU (published figures).
Gives: mental model (a step is a small solve; parallel worlds are the GPU's job) and practical (which simulator).
Diagram: one step's pipeline; a throughput chart, CPU core against GPU batch, sources labelled; D3.
Registers: 06, 08 (Tier 0).

**13. Rendering and Ray Tracing**
Payoff: Understand why a simulator with cameras needs a different GPU than a trainer.
Content: a policy that sees needs images from the simulator. Rasterisation against ray tracing in two sentences each.
Ray-tracing cores as separate hardware from tensor cores. Which simulators require them, in the vendor's words, and
which GPU families have them. What that does to the instance choice.
Gives: mental model (two kinds of GPU work) and practical (the rule that splits G from P).
Diagram: a GPU drawn as separate engines (tensor, ray tracing, video encode, video decode) with each workload lit on
the engine it uses; inline SVG. Reused in 20.
Registers: 06, 08.

**14. Sim-to-Real and Real-to-Sim**
Payoff: Know why a policy that works in simulation fails on the bench, and the two ways to close the gap.
Content: the gap (physics, appearance, timing). Domain randomisation: vary the simulator so the real world looks
like one more variation. Real-to-sim: build the simulated scene from scans of the real one.
Gives: mental model (make the real world a sample from training, or make training a copy of the real world).
Diagram: the gap as two distributions; randomisation widening one, a scan moving the other; inline SVG.
Registers: 06.

### Part 5. Training and evaluation

**15. Training at Three Scales**
Payoff: Place any robot-model training job in one of three sizes and know what each asks of the cluster.
Content: depends on 4 to 7. Per-task adaptation (one GPU, minutes to hours), one-node post-training (hours to days),
multi-node pretraining (days on tens to hundreds of GPUs in the published figures, done by the labs). Published figures for each. Links to the LLM Training Systems dive
for distributed training.
Gives: practical (which size is yours).
Diagram: three scales on one log axis of GPU-hours with named runs placed on it; D3.
Registers: 02, 03, 09.

**16. Evaluation**
Payoff: Know why a falling loss does not mean a working robot, and the three ways to measure what does.
Content: the scene (two checkpoints with the same loss, one drops the block). Why offline loss misleads: the policy's
own actions change what it sees next. Closed-loop evaluation in simulation. Scoring with a world model. Real-robot
trials and how many it takes to tell two policies apart. Published correlations between simulated and real results.
Gives: mental model (closed loop against open loop) and practical (an evaluation ladder).
Diagram: open loop against closed loop as two block diagrams; a ladder from cheap to trusted; inline SVG.
Registers: 06.

### Part 6. The edge

**17. Running on the Robot**
Payoff: Fit a policy inside a latency budget on a named device.
Content: depends on 3 and 5. The devices at current versions: Jetson Orin, Jetson Thor, DGX Spark, with a price only
where the vendor's own page prints one. The
latency budget from camera to motor. Real-time chunking: how a slow model keeps a fast loop fed. Quantisation.
TensorRT engines: why one is built per device type on Jetson, and the compatibility mode that TensorRT 11.5.0 adds
on Arm server-class Linux.
Gives: practical (device choice, export path) and mental model (the budget).
Diagram: a latency budget bar from frame capture to motor command; a device table; D3 and Cloudscape.
Registers: 07.

**18. The Fleet**
Payoff: Know how a new model reaches a hundred robots safely and how their episodes come back.
Content: delivery and staged rollout with the AWS services that exist for it today, and which robot-specific
services were retired (no first-party statement of what replaces RoboMaker was located in this research). Episode upload: what to send and what to keep. How the loop closes.
Gives: practical (the services and their limits).
Diagram: the rollout as stages with gates; the upload path; inline SVG.
Registers: 07.

**19. Agents Running the Loop**
Payoff: Know what changes when an agent, not an engineer, launches the experiments.
Content: depends on 8. ENPIRE in full: its modules, what the agent may touch, who grades it, its utilisation and
token figures, its stated limits. Its neighbours: ASPIRE and "You Don't Need To Stay in The Loop". Reward design by
language model as history. The compute an agent requests and the guardrails a scheduler can enforce.
Gives: mental model (the agent is a new kind of tenant) and practical (guardrails).
Diagram: the agent loop with the robot, the GPU queue and the grader; a utilisation chart from the paper's figures; D3.
Registers: 04, 09.

### Part 7. The compute

**20. Fifteen Workloads, Five Shapes**
Payoff: One table that says which part of the machine each workload loads.
Content: the map. For each workload: what it is in the loop, the machine part it loads and why, the figure that shows
it. The grouping into shapes by duration, coupling and interruptibility `[our reading]`.
Gives: mental model (the map) and practical (find your workload).
Diagram: a workload-by-machine-part heat matrix; the GPU-engines figure from 13; D3 and inline SVG.
Registers: 08, and each stream's compute entries.

**21. Reading a Machine: PMU Cards**
Payoff: Read a top-down breakdown and a GPU profile and say what is saturated.
Content: the PMU (performance monitoring unit): counters in the processor that count events. Top-down analysis from
the vendors' own method documents, on Arm and on x86: where pipeline slots go (front end, back end, retiring, bad
speculation). What GPU counters exist (Nsight Compute, Nsight Systems). What a card shows. Links to the silicon dive.
Gives: mental model (four places a slot can go) and practical (how to read a card).
Diagram: a pipeline with slots flowing to four buckets; a sample card; inline SVG.
Registers: 08.

**22. Our Measurements**
Payoff: See measured cards for the arm's workloads on machines we ran.
Content: Tier 0 results from `research/experiments/`: today, CPU stand-in workloads on a Jetson Orin Nano and a DGX
Spark, one run per kernel in each of two passes. The workload rows reproduce between the passes; the stall split
of two memory microbenchmarks does not and is not printed. The separate profiling project adds the real workloads (ACT, SmolVLA, LeWorldModel, decode,
simulation with the SO-101 model) and the EC2 families. Every figure carries its run count.
Gives: practical (measured numbers) and mental model (the cards from 21 filled in).
Diagram: one card per workload per machine; D3.
Registers: 08; `research/experiments/`.
Condition: ships with the stand-ins labelled as such if the profiling project has not delivered by build time.

**23. Price-Performance and Latency**
Payoff: Compare machines on one unit of work per workload.
Content: the unit of work per workload (simulation steps, clips embedded, training samples, actions). Units per
dollar-hour for cloud instances, where a dated first-party price was fetched (today only Capacity Block prices); watts and purchase price for edge devices. Latency percentiles where the workload
has a deadline.
Gives: practical (a comparison method that survives new instance types).
Diagram: per-workload bar charts on a common unit; D3.
Registers: 08; `research/experiments/`.
Condition: the method ships; numbers ship only where a Tier 0 result or a first-party figure exists.

### Part 8. AWS

**24. Orchestrating It on AWS**
Payoff: Know what each scheduler is good at and which capacity market each instance family can use.
Content: AWS Batch, SageMaker HyperPod, EKS with Karpenter and Auto Mode, Kueue and the KAI scheduler, NVIDIA OSMO,
the AWS Physical AI Toolchain sample, capacity markets per instance family, Step Functions as glue. Each at its
November 2026 state from first-party pages.
Gives: practical (what each offers) and mental model (scheduler times capacity market).
Diagram: schedulers against workload shapes; capacity markets against instance families; Cloudscape tables and one
inline SVG of the control plane.
Registers: 09.

**25. Choosing**
Payoff: Walk from your workload to a machine, a scheduler and a capacity market.
Content: the decision path and the closing table: workload, machine part it loads, instance family, orchestrator,
capacity market, why.
Gives: practical (the decision).
Diagram: a decision tree; the table; inline SVG and Cloudscape.
Registers: 09, 08.

**26. Glossary and Sources**
Every acronym and term with its plain meaning; sources grouped by tier with access dates.

---

## Numbers by section

The figures each section will print, each tied to the register entry that holds its pinned source and verbatim quote.
Where an entry carries a wave 2 correction, the corrected figure is the one shown. Labels are the source's:
`[vendor claim]` and `[author reported]` for a publisher's figure about its own work, `[derived]` for our arithmetic,
`[our reading]` for synthesis, Tier 0 for our measurement with its run count. A script checked every number below
against the text of the entries cited beside it (2,024 numbers, none missing). Sections 1, 2 and 26 print no figures
of their own.

### Section 3. The Robot as a Computer

- One 30 Hz tick is 33.3 ms; at an illustrative working speed of 0.25 m/s the gripper travels 8.3 mm in one tick, 25 mm in 100 ms and 62.5 mm in 250 ms. This is the entry behind the payoff line's "100 milliseconds is a distance". [derived], speed is an [illustration] (F01-83)
- The gripper's speed ceiling is under about 1.8 m/s, no load, at 6 V, from the datasheet speed times the arm length; it is lower on the stock 5 V supply and has not been measured. [derived] (F01-82)
- LeRobot's default recording rate is 30 frames per second, with a default episode length of 60 s, a reset time of 60 s and an episode count of 50. (F01-28)
- In LeRobot v0.7.0 the SO-101 follower is six `sts3215` motors on one serial bus with IDs 1 to 6; five position the arm and the sixth drives the gripper. (F01-8)
- A recorded SO-101 frame holds a 6-element float32 `observation.state`, a 6-element float32 `action` and one image entry per camera. (F01-26)
- Camera resolution and frame rate have no default in the code; the documentation and every SO-101 example use 640x480 at 30 fps. (F01-30)
- One 640x480 RGB frame is 921,600 bytes; two cameras at 30 fps are 55.3 MB/s raw against 1,440 bytes per second of state plus action, a ratio of 38,400 to 1. [derived] (F01-86)
- One encoder step of 0.088 degrees is 0.63 mm at the gripper at 0.413 m from the shoulder; gear backlash of up to 0.5 degrees is 3.6 mm at the same radius. [derived] (F01-84)
- On connect LeRobot writes position loop gains P = 16, I = 0, D = 32 into each follower servo; the loop then runs inside the servo, at a rate neither Feetech document states. [our reading] for where the loop runs (F01-16, F01-45)
- The 7.4 V STS3215 with 1/345 gearing has a no-load speed of 42 RPM at 6 V and a stall torque of 16.5 kg.cm at 6 V in the manufacturer datasheet. [vendor claim] (F01-42)
- On the arm itself the host writes goals at 30 Hz by default and a chunking policy is called once per chunk, every 1.67 s for a 50-action chunk. [our reading] (F01-81)
- NVIDIA's GR00T 2 page (dated November 2026) gives a full ladder for a Unitree G1: 1.6 s chunks planned about once per second, 124 ms per prediction on Jetson AGX Thor and 38 ms on an RTX 5090, a 50 Hz whole-body controller, joint PD control labelled 1 kHz. [vendor claim] (F01-73)
- Figure's Helix 02 (2026-01-27) runs a 10-million-parameter System 0 at 1 kHz under System 1 at 200 Hz; Helix 2.5, posted 2026-09-17, is the newest model and states no control rate. [vendor claim] (F01-72)
- One complete GR00T N1.7 policy call (action horizon 40, four denoising steps, two 256x256 cameras, batch 1) has a median of 22.9 ms on an H100, 76.8 ms on Jetson AGX Thor and 149.0 ms on Jetson Orin with TensorRT. [vendor claim] (F01-74)

### Section 4. Learning From Demonstrations

- ACT's ablation moves success from 1% without chunking (k = 1) to 44% at k = 100, averaged over four settings. This is the section's strongest number. [author reported] (F02-6)
- ACT's chunk is k = 100 actions at a 50 Hz control rate, which is 2 seconds of motion per forward pass. (F02-6)
- The compounding-error bound: a policy that disagrees with the expert with probability epsilon per step can make up to T^2 * epsilon mistakes over a T-step task. It is a worst-case bound from the history paper, to be shown as such. (F02-2)
- SCOPE's "fifty teleoperated episodes" ties to two entries: ACT used 50 demonstrations per task, about 10 minutes of teleoperation, for 80 to 90% success on six real tasks, and the LeRobot recorder's default is 50 episodes. [author reported] for the success range (F02-10, F02-67)
- ACT's published cost is about 80M parameters, about 5 hours of training from scratch on one 11 GB RTX 2080 Ti, and about 0.01 s per inference on the same machine. [author reported] (F02-9)
- LeRobot's ACT at v0.7.0 defaults to `chunk_size = 100`, `n_action_steps = 100`, `latent_dim = 32` and `kl_weight = 10.0`; the defaults target bimanual ALOHA, so an SO-101 user may shorten the chunk. (F02-11)
- LeRobot's ACT sets `n_decoder_layers = 1` although the paper's table says 7; the code is the authority. (F02-12)
- Diffusion Policy uses 100 denoising iterations in training and cuts inference to 16 (or 10) on real robots with DDIM, giving 0.1 s per inference on an NVIDIA 3080. [author reported] (F02-16)
- LeRobot's Diffusion Policy at v0.7.0 defaults to `horizon = 64` and `n_action_steps = 32`, and runs 100 denoising passes per inference unless the user sets fewer. (F02-17)
- pi0 samples a chunk with 10 forward Euler steps of size 0.1 along the learned velocity field, with the observation encoded once and cached. (F02-20)
- pi0 on an RTX 4090 with 3 cameras takes 14 ms in the image encoders, 32 ms in the observation forward pass and 27 ms in the ten action passes: 73 ms on-board, 86 ms with 13 ms of network latency. [author reported] (F02-21)
- pi0 executes chunks open-loop and runs a new inference every 0.5 s on 50 Hz robots (after 25 actions) and every 0.8 s on 20 Hz robots (after 16 actions). [author reported] (F02-22)
- FAST compresses a chunk to about 30 tokens per chunk per arm, where naive binning uses one of 256 bins per joint per timestep. [author reported] for the token count (F02-26, F02-25)
- The trade FAST makes: about 5x fewer training GPU-hours than flow-matching pi0, but about 750 ms per chunk at inference against under 100 ms. [author reported] (F02-27)

### Section 5. Vision-Language-Action Models

- In pi0 the backbone is PaliGemma (3B parameters) and the action expert adds 300M parameters trained from scratch, 3.3B in total. This is the "backbone plus action head" picture in one model (history). (F02-32)
- GR00T N1 (March 2025) named the two rates: System 2, the VLM, at 10 Hz on an NVIDIA L40, and System 1, a diffusion transformer, producing motor actions at 120 Hz. [author reported] (F02-33)
- GR00T N1.7 (blog 17 April 2026, release tag 18 April 2026) is the newest GR00T with released weights and code as of 2026-11-20: a 3B-parameter VLA with Cosmos-Reason2-2B as System 2, pretrained with 20,854 hours of human egocentric video. (F02-37)
- The released GR00T N1.7 checkpoint has a 32-layer DiT action head (the repository's code default is 16), `action_horizon = 40`, `max_action_dim = 132` and 4 inference timesteps. (F02-38)
- NVIDIA's N1.7 model on an H100 with the TensorRT full pipeline (4 denoising steps, 1 camera): stages of 6.2 ms data processing, 8.8 ms backbone and 12.3 ms action head, with a printed end-to-end figure of 27.9 ms (35.9 Hz); 93.8 ms (10.7 Hz) on a Jetson AGX Thor. The Jetson Orin figure of 216.5 ms (4.6 Hz) is a different build with TensorRT on the action head only. [vendor claim] (F02-40)
- GR00T 2 (NVIDIA page dated November 2026, code "Available in December") is a world-action model; GR00T 2 Turbo is a 2B-parameter variant whose prediction takes 38 ms on an RTX 5090 and 124 ms on a Jetson Thor, planning 1.6 s chunks about once per second for a 50 Hz controller. [vendor claim] (F02-44, F02-45)
- pi0.7 (arXiv 2604.15483, v1 16 April 2026) is the newest Physical Intelligence model with a paper as of 2026-11-20: about 5B parameters with an 860M flow-matching action expert, 50-step chunks generated in 5 denoising steps. (F02-51)
- pi0.7 is served from one NVIDIA H100: 38 ms per inference in the minimal configuration (3 cameras, 5 denoising steps) and 127 ms worst case with memory and subgoal images. [author reported] (F02-52)
- openpi holds pi0, pi0-FAST and pi0.5 only (last commit 2026-08-24) and offers neither pi*0.6 nor pi0.7 weights; no model newer than pi0.7 was named as of a 2026-10-20 archive copy, and the 2026-10-13 post offers hosted training and inference through a Pi API beta with a waitlist. (F02-53)
- SmolVLA (June 2025) is a 450M-parameter VLA with about 100M in the action expert, using the first 16 language-model layers and producing 50-action chunks in 10 steps. (F02-58)
- On the SO-101 pick-place task with 50 demonstrations, SmolVLA reports 90% success in distribution and 50% out of distribution, against 70% and 40% for ACT. [author reported] (F02-60)
- OpenVLA-OFT (February 2025) is a 7B VLA that predicts the whole chunk in one parallel pass; on LIBERO success went from 76.5% to 97.1% with 26x the action throughput. [author reported] The register's currency table located no later successor. (F02-68)
- Gemini Robotics 2.5 (10 November 2026) was tested on over 200 tasks; the post gives no parameter count, training compute or latency. [vendor claim] for the task count (F02-74)
- LeRobot v0.7.0 (released 2026-11-05) ships 28 policy packages; the list of what the arm can fine-tune today stays "among the policies we read" until the unread packages are checked (see the unknowns table). (F02-65)

### Section 6. World Models: Predicting What Happens Next

- The current Cosmos family is Cosmos 3, released at the end of May 2026 (the GitHub tag and press release are dated 2026-06-01), in three sizes: Super 64B, Nano 16B and Edge 4B parameters, with Edge released July 2026. (F03-94)
- Cosmos3-Nano takes 207.78 s on an H100 80GB and 114.85 s on a B200 to generate a 189-frame, 24 frames-per-second clip at 720p in native PyTorch. [vendor claim] (F03-98)
- Cosmos3-Nano used as an action-conditioned world model is listed at about 2.0 s per rollout on an H100 80GB and 3.7 s on an RTX PRO 6000 Blackwell; the rollout length for that row is not published. [vendor claim] (F03-99)
- Cosmos 3 also works in a compressed space: a frozen video VAE compresses video 4 times in time and 32 by 32 in space, and a decoder turns the result back into pixels. (F03-96)
- The GPU memory needed to run Cosmos3-Nano is not printed on the model card or in the benchmark pages read, so the side-by-side cannot carry a memory column for it. (F03-105)
- V-JEPA 2-AC plans in 16 seconds per action on one NVIDIA RTX 4090, against 4 minutes per action for an action-conditioned Cosmos video model with one tenth as many samples. [author reported] (F03-25)
- Time to imagine, side by side and not like for like: Cosmos 1 7B fine-tuned for planning 300 ms per candidate on an RTX 4090, V-JEPA 2-AC 2 ms per candidate on an RTX 4090 and 0.375 ms on an A100, LeWM between 22 and 65 microseconds per candidate step. [author reported], the LeWM range is [derived] (F03-118)
- Parameters, side by side: Cosmos3-Nano 16B, DreamZero 14B, GR00T 2 2B, V-JEPA 2-AC about 1B frozen encoder plus about 300M predictor, RoboJEPA 22M to 8B predictor on a 2B frozen encoder, LeWorldModel about 15M in total. (F03-117)
- DreamZero is a 14B video diffusion transformer that outputs video and actions together: about 5.7 seconds per action chunk on one GPU unoptimised, 7 Hz on 2 GB200 GPUs with the authors' optimisations. [author reported] (F03-103)
- GR00T 2 is a single 2B-parameter world-action model; its 153 ms per action chunk is one robot (Dexter, three camera views) on an RTX 5090 after optimisation (449 ms unoptimised), with 180 ms on the YAM arms. [vendor claim] (F03-104)
- Genie 3 (5 Aug 2025) is navigable in real time at 24 frames per second at 720p; the Genie 4 page states a limit of around a minute of continuous interaction and carries no date, frame rate, resolution, model size or hardware. [vendor claim] (F03-100, F03-101)
- The 1X World Model (12 Jan 2026) generates 5 seconds of video with a 14B model, and one inference takes 11 seconds on multiple GPUs plus 1 second for the action extraction. [vendor claim] (F03-102)
- Dreamer 4 (29 Sep 2025) is a 2B-parameter world model that runs interactively in real time on a single H100. [author reported] (F03-90)
- SCOPE's "five uses" ties to two entries: the primary sources name planning, policy improvement in imagination, synthetic experience and evaluation, and the world-action model adds acting directly. The count is our grouping. [our reading] (F03-88, F03-93)

### Section 7. JEPA: Predicting in Latent Space

- V-JEPA 2 is trained in two stages: an encoder pretrained on over 1 million hours of internet video and 1 million images, then an action-conditioned predictor (V-JEPA 2-AC) trained on under 62 hours of robot video with the encoder frozen. (F03-1)
- Worked-example shape, step one: V-JEPA 2 cuts video into tubelets of 2 frames by 16 by 16 pixels, and each tubelet becomes one token. (F03-3)
- Worked-example shape, step two (history, V-JEPA): a 16-frame 224 x 224 clip becomes 8 x 14 x 14 = 1,568 tokens. (F03-59)
- The V-JEPA 2 encoder comes in three sizes: ViT-L 300M, ViT-H 600M and ViT-g 1B parameters (width 1408, depth 40); the pretraining predictor is 22M parameters, width 384, depth 12. (F03-1, F03-4)
- The target encoder is an EMA copy: after each optimiser step every target weight becomes m times itself plus (1 - m) times the matching encoder weight, with m = 0.99925 held constant. (F03-8)
- Masking in the released config: one generator with 8 blocks each covering 15% of the frame area and one with 2 blocks each covering 70%, all spanning the full clip in time. (F03-9)
- The V-JEPA 2-AC predictor is a transformer of about 300M parameters: 24 layers, 16 heads, width 1024. (F03-14)
- Per time step the predictor takes one action token (7 numbers), one end-effector state token (7 numbers) and the frame's 16 x 16 grid of 1408-wide encoder features. (F03-15)
- CEM settings in the V-JEPA 2 robot experiments: 800 samples, 10 refinement iterations using the top 10 samples, planning horizon 1. (F03-1, F03-24)
- That plan takes 16 seconds per action on one NVIDIA RTX 4090 in the V-JEPA 2 paper and 3 seconds per action on a single A100 in the successor paper's Table 6 for the same settings; print both with their GPU. [author reported] (F03-25, F03-74)
- V-JEPA 2-AC robot results, 10 trials each on two Franka arms: pick-and-place 80% (cup) and 65% (box), grasp 65% (cup) and 25% (box). [author reported] (F03-1, F03-26)
- V-JEPA 2.1 (released 2026-03-16) on one object (a cup), 10 trials per skill: grasp success rises from 60% to 70% at the V-JEPA 2 planning settings and to 80% with horizon 8 (300 samples, 15 iterations, 14 s per action); pick-and-place stays at 80%. [author reported] (F03-72, F03-73)
- RoboJEPA (arXiv 2610.10515v1, 7 Oct 2026) is the newest JEPA robot world model found: predictors from 22M to 8B parameters on a frozen V-JEPA 2.1 ViT-G encoder, trained on 15,022 hours of robot video of which 6,692 hours carry synchronised actions. (F03-75, F03-76)
- RoboJEPA's real-robot planner uses 4,096 CEM samples per iteration, 15 iterations on the first plan and 10 afterwards, horizon 5; its simulated runs use 1,024 samples. The authors print no seconds-per-plan figure and say "several seconds". (F03-77)
- LeWorldModel is about 15M parameters trained end to end with two loss terms, with a ViT-Tiny encoder of about 5M parameters that gives one vector of width 192 per frame; the authors state it trains on a single GPU in a few hours and name no GPU. [author reported] for the training time (F03-31, F03-32)
- LeWM's loss weight on SIGReg is lambda = 0.1 in the paper and 0.09 in the released training config, with 1,024 projections and 17 knots; give both. (F03-36, F03-37)
- LeWM plans with CEM: 300 candidate action sequences, 30 iterations on Push-T (10 on the other environments), top 30 kept, horizon 5 steps where each step is a block of 5 environment actions. (F03-40)
- LeWM's full plan takes 0.98 s against 47 s for DINO-WM, which is the "48x" in the abstract; the GPU used for the timing is not named. [author reported] (F03-41)
- Predictor steps per decision: V-JEPA 2-AC 800 x 10 x 1 = 8,000; V-JEPA 2.1 long-horizon setting 300 x 15 x 8 = 36,000; LeWM on Push-T 300 x 30 x 5 = 45,000; RoboJEPA 4,096 x 10 x 5 = 204,800 (307,200 on the first plan). This is the count the planner diagram prints. [derived] (F03-115)
- SCOPE's "three ways" to block collapse undercounts the registers: they record the three SCOPE names plus contrastive negatives (history) and a frozen pretrained encoder, which is how V-JEPA 2-AC and DINO-WM avoid it. [our reading] (F03-65, F03-67, F03-69, F03-70, F03-71)

### Section 8. Reinforcement Learning for Robots

- Isaac Lab 3.0 (released 20 Oct 2026) publishes training throughput with 8,192 parallel environments on one RTX PRO 6000 Blackwell Server Edition: for a Franka arm lifting a cube from state observations, PPO (RSL-RL) runs at about 165,000 environment steps per second on PhysX and about 319,000 on the Newton MuJoCo-Warp backend. [vendor claim] (F04-54)
- SCOPE's phrase "thousands of parallel environments on one GPU" ties to two entries: 8,192 environments in the Isaac Lab benchmark and 4,096 simulated arms in the Playground recipe for the dive's arm. (F04-54, F04-58)
- A camera costs most of the throughput: same benchmark, 8,192 environments, one camera each, a Kuka-Allegro lift task trains at about 28,000 steps per second with PhysX physics and RTX rendering against about 61,000 without the camera; with the Newton physics and renderer pair it is about 116,000 against 221,000. [vendor claim] (F04-55)
- MuJoCo Playground 1.0 (6 Nov 2026; v1.0.1 on 9 Nov 2026) ships an SO-101 pick-cube environment trained with PPO from a 64 x 64 wrist camera and deployed zero-shot on the real arm; it is the first half of the thread task (pick, without the place). (F04-57)
- The default PPO recipe for that task runs 4,096 simulated arms in parallel, collects 16 control steps from each per iteration and trains for 3,000 iterations, about 197 million control steps in total; the actor is a two-layer convolutional encoder feeding a 256-256-128 MLP. Wall-clock is not published. (F04-58)
- Recap (Physical Intelligence, Nov 2025) trains a separate value model with a 670M-parameter VLM backbone that outputs a distribution over 201 value bins, normalised per task to between -1 and 0. (F04-60, F04-61)
- The model Recap improves, pi*0.6, is built on a Gemma 3 4B vision-language model with an 860M-parameter action expert that outputs commands at 50 Hz. (F04-64)
- Recap's data per iteration is hundreds of episodes on three or four robots: T-shirt folding used 300 autonomous trajectories on four robots per iteration for two iterations; box assembly used 600 autonomous trials and 360 with interventions per iteration, on 3 robots. [author reported] (F04-65)
- NVIDIA's GR00T 2 page (Nov 2026, page read 2026-11-20, no day printed) reports three contact-rich insertion tasks going from 40 to 76% success after supervised post-training to 88 to 96% with real-robot RL; the page gives no robot count, episode count or training time. [vendor claim] (F04-68)
- piRL (v3 of Jan 2026) fine-tunes pi0 and pi0.5 with PPO in simulation on 8 H100 80 GB GPUs with 64 to 320 parallel simulated environments; pi0.5 trained from one demonstration per task rises from 77.1% to 98.3% average on LIBERO. [author reported] (F04-69)
- One measured RL post-training run on AWS: RLinf v0.4's GRPO recipe on OpenVLA-OFT (7B) in LIBERO-Goal, on one p5en.48xlarge Spot instance (8 H200), took 75 GRPO steps in 31.6 hours of training (about 25 minutes per step), 32.3 hours for the whole run and about US$1,100, and lifted success from 48.6% (243/500) to 85.0% (425/500). Single run. [author reported] (F04-70)
- The same sample records an earlier 8 x H100 run that hit its 40-hour wall-clock cap at step 83 of 100 and lost its last checkpoints because the timeout fired before the upload. (F04-71)
- LeRobot v0.7.0 (5 Nov 2026) ships HIL-SERL for the real arm; in its example configs images are resized to 128 x 128, the control rate is 10 frames per second, an episode lasts at most 20 seconds and the reset wait is 5 seconds. (F04-76, F04-77)
- History (Oct 2024, v3 Mar 2025): HIL-SERL reached near-perfect success on contact-rich tasks within 1 to 2.5 hours of real-robot training, starting from 20 to 30 human demonstrations, on one RTX 4090. [author reported] (F04-72)

### Section 9. Collecting Data

- The LeRobot dataset format version at tag v0.7.0 is "v3.0". (F05-16)
- A public 50-episode SO-101 pick-and-place dataset, `lerobot/svla_so101_pickplace`, is nine files and 86.1 MB in total: 11,939 frames at 30 fps from two 640x480 cameras stored as AV1 in two MP4 files (45.5 MB and 40.1 MB) plus one 0.37 MB Parquet file. (F05-29)
- That dataset is 6.6 minutes of robot time; its video costs about 775 MB per robot-hour for two cameras (3,588 bytes per camera frame), against 199 GB per hour uncompressed, a ratio of about 257 to 1. One dataset, one encoder setting: an example, not a constant. [derived] (F05-30)
- The recorder's defaults are 30 frames per second, 60 s per episode, 60 s to reset the scene and 50 episodes. (F05-2)
- SCOPE's "fifty teleoperated episodes" (in the demonstrations section) ties to LeRobot's guidance for a first dataset: at least 50 episodes, 10 per object location. (F05-5)
- The default codec settings at LeRobot v0.7.0 are `libsvtav1`, `yuv420p`, GOP size 2, CRF 30 and SVT-AV1 preset 12. (F05-35)
- Size defaults at v0.7.0: at most 1,000 files per chunk directory, 100 MB per data Parquet file, 200 MB per video file. (F05-20)
- For an SO-100/SO-101 two-camera dataset a frame row holds `action` (6 float32), `observation.state` (6 float32) and five bookkeeping columns; the pixels are in the MP4 files. (F05-23)
- Encode load for two 640x480 cameras at 30 fps is 18.4 million pixels per second; the docs' "55M px/sec" label counts three colour channels and is quoted only with that label. [derived] (F05-45)
- The docs state that software `h264` gives files "~30-50% larger" than `libsvtav1` at medium CPU use. (F05-43)
- History (2024 benchmark): at GOP 2 and CRF 30 the AV1 video was 5.59% the size of the original images with a load time 0.48 times that of loading the images, on a 480x640 dataset. (F05-63)
- History (2024): 3 people recorded 1,400 UMI demonstrations in 12 person-hours across 30 locations, more than 3 times faster than teleoperation on that task. [author reported] (F05-8)
- One data vendor's own price ranges (July 2026): teleoperation $28 to $60 per raw hour, with 10 to 30 percent of captured data rejected in quality checks; no lab's cost per teleoperation hour was located in this research. [vendor claim] (F05-15)
- HiFi-UMI-2K (July 2026) is a curated 2,000-hour public subset of a source corpus of more than 20,000 hours and occupies 16.0 TB in LeRobot format. (F05-10)

### Section 10. Processing and Curating

- The H100 has 0 NVENC and 7 NVDEC engines and cannot hardware-decode AV1, the codec LeRobot writes by default. (F05-47)
- The A100 has 0 NVENC and 5 NVDEC engines and cannot hardware-decode AV1. (F05-46)
- The Blackwell data-centre parts (HGX B200, HGX B300, GB200, GB300) have no hardware encoder and 7 NVDEC engines that decode AV1. (F05-48)
- The G-family cards carry a full AV1 path: L4 has 2 NVENC and 4 NVDEC engines, L40S 3 and 3, RTX PRO 6000 Blackwell Server Edition 4 and 4. (F05-50, F05-51, F05-52)
- The A10 has 1 NVENC and 2 NVDEC engines and decodes AV1 without encoding it; NVIDIA's matrix lists "NVIDIA A10", and "A10G" (the G5 card) has no row of its own. (F05-54)
- The H200 has no row in NVIDIA's matrix, so AV1 hardware decode on P5e/P5en is not established; on EC2 it is possible on G5 (decode only), G6, G6e, G7, G7e, P6-B200, P6-B300 and P6e-GB200, and not possible on G4dn (T4), P4d (A100) or P5 (H100). [derived] (F05-49, F05-67)
- Moving image augmentation from the CPU workers to the GPU made ACT training 2.8x faster on an H100 and 3.3x faster on an A100; the post gives no dataset, camera count, batch size or CPU. [vendor claim] (F05-59)
- One input-bound curation run, recorded in a design note for an incubating recipe and cancelled before it completed: on 32 H100s (4 nodes of 8), 32 captioning replicas delivered 7.1 rows per second against a capacity near 43, aggregate GPU utilisation was about 17%, and 10 replicas never received a request. (F05-76)
- The CPU budget per GPU is fixed by the instance type: the eight-GPU sizes of G5, G6, G6e, G7, G7e, P5, P5e, P5en, P6-B200 and P6-B300 all have 192 vCPUs, 24 per GPU; p4d.24xlarge has 96 vCPUs for 8 A100s, 12 per GPU. (F05-65)
- LeRobot's training defaults at v0.7.0 are batch size 8, 4 dataloader workers, prefetch factor 4 and 100,000 steps. (F05-61)
- The only per-item decode latency found in the LeRobot repository: about 5 ms per single item with torchcodec on a two-camera, 50-episode dataset, and 16.98 ms falling to 4.95 ms per item for batches of 32; the hardware is not stated. [author reported] (F05-62)
- Cosmos Curator is at v2.10.0 (2026-11-10). (F05-68)
- Its reference pipeline, tuned for a 48 GB GPU, gives the shot-detection, aesthetic and embedding models 0.25 of a GPU per worker and the motion filter 0.5; frame decode takes 3 CPUs per worker and transcode 5. (F05-71)
- The only published curation throughput is from a March 2025 NVIDIA post about "NeMo Video Curator": about 195 seconds per hour of video per GPU in streaming mode against about 352 in batch mode; the post does not name Cosmos Curator. [vendor claim] (F05-78)
- The RTX PRO 4500 Blackwell Server Edition, the GPU of the G7 family, has 3 NVENC and 3 NVDEC engines and handles AV1 in both directions, per NVIDIA's support matrix. (F08-43, F08-44)
- NVIDIA's support matrix has no row for the H200 (the P5e and P5en GPU), so hardware decode on those instances is not established from the matrix. (F08-44)
- AWS's product page describes the G7 GPU's video hardware as "Ninth-generation NVENC and sixth-generation NVDEC engines", with 32 GB per GPU. (F08-43)
- Eight-GPU sizes of G5, G6, G6e, G7e, P5, P5e, P5en, P6-B200, P6-B300 have 192 vCPUs / 8 = 24 vCPUs per GPU, which is 12 physical cores (2 threads per core): this is the CPU budget for software decode next to each GPU. [derived] (F08-57)
- g7.48xlarge has 192 / 8 = 24 physical cores per GPU (1 thread per core), twice the physical cores per GPU of every other eight-GPU x86 size (24 against 12); it is not the highest overall, since p6e-gb200.36xlarge has 144 Grace cores for 4 GPUs, 36 per GPU, and g5g.16xlarge has 64 Graviton2 cores for 2 GPUs, 32 per GPU. [derived] (F08-57, F08-58)
- Single-GPU sizes run from 4 vCPUs (g6.xlarge, g6e.xlarge) to 64 (g6.16xlarge, g6e.16xlarge); g7 and g7e single-GPU sizes run from 8 to 32. [derived] (F08-57)
- LeRobot's default video is AV1 produced and consumed by CPU code, and the GPUs most used for training either cannot decode it (A100, H100) or have no row in NVIDIA's matrix (H200). [our reading] (F08-77)
- `nvidia-smi` reports encoder, decoder and JPEG decoder utilisation as separate figures from the compute part; on a GPU split with MIG none of them can be queried. (F08-31)
- SCOPE's text for this section carries no number of its own; nothing to tie.

### Section 11. Augmentation and Synthetic Data

- SCOPE names "Cosmos Transfer and Predict at their current versions"; the registers record the current family as Cosmos 3 (Super 64B, Nano 16B, Edge 4B) and say the Cosmos-Predict2.5 repository is no longer under active development. (F03-94)
- Time per clip at full resolution: a 189-frame, 24 frames-per-second clip at 720p takes Cosmos3-Nano 207.78 s on an H100 80GB, 114.85 s on a B200 and 786.37 s on an RTX PRO 6000 Blackwell (native PyTorch, BF16). [vendor claim] (F03-98)
- Time per clip at low resolution: the same clip at "256p" (320 x 192) takes 7.61 s on the H100. [vendor claim] (F03-98)
- Memory per clip: not printed on the model card or in the benchmark pages read; the card only says a layer-wise offload flag "can help reduce memory usage". (F03-105)
- Action-conditioned generation (first observation plus an action trajectory in, rollout video out) is listed at about 2.0 s per rollout on an H100 80GB; the rollout length is not published. [vendor claim] (F03-99)
- Cosmos 3 generates in a compressed space, 4 times smaller in time and 32 by 32 in space, behind a frozen video VAE (the Wan2.2-TI2V-5B encoder). (F03-96)
- The current NVIDIA generative family is Cosmos 3: Cosmos3-Nano (16 billion parameters) and Cosmos3-Super (64 billion) were released in May 2026, Cosmos3-Edge (4 billion) in July 2026; Cosmos-Transfer2.5 and Cosmos-Predict2.5 are superseded and in limited maintenance. SCOPE's "Cosmos Transfer and Predict at their current versions" should name Cosmos 3 workflows. (F05-95)
- Cosmos3-Nano text-to-video (189 frames at 24 fps, one GPU, PyTorch) takes 59.83 s per clip at 480p and 207.78 s at 720p on an H100 80GB, 33.20 s and 114.85 s on a B200, and 180.81 s and 786.37 s on an RTX PRO 6000 Blackwell. [vendor claim] (F05-98)
- Cosmos3-Nano transfer with an edge control (PyTorch), seconds per clip at 480p and 720p: 148.65 and 527.89 on an H100 80GB, 81.88 and 288.07 on a B200, 489.90 and 2,102.40 on an RTX PRO 6000 Blackwell; the frame count of these rows is not published, so no per-second figure. [vendor claim] (F05-97)
- The post-trained Cosmos3-Nano-Sim-Transfer checkpoint produces up to 600 frames at 30 fps and 480p from simulator-rendered control video. (F05-96)
- Memory figure from the superseded model: Cosmos-Transfer2.5-2B needs 65.4 GB of GPU memory and takes 92.25 s on a B200 for a 93-frame chunk of 720p video at 16 fps. [vendor claim] (F05-99)
- Isaac Lab v3.0.0, Franka cube stacking: 1,000 demonstrations take about 15 minutes state-only (1,000 parallel environments) and about 1 hour with camera images (300 parallel environments), at a success rate of about 40%, on one RTX PRO 6000 Blackwell. [vendor claim] (F05-90)
- The GR-1 humanoid example reaches "typically 65-80%" success over 1,000 demonstrations in 18 to 40 minutes on one RTX 6000 Ada; the harder nut-pouring task with cameras takes about 10 hours for 1,000 demonstrations on the same card. [vendor claim] (F05-91)
- In Isaac Lab Mimic the share of generated candidates that pass the success check ranges from about 70% in simple cases to under 1%. (F05-89)
- SkillGen takes 90 to 120 minutes for 1,000 demonstrations with one environment on an RTX 6000 Ada and needs about 9.5 GB of GPU memory for one environment and about 22 GB for five. [vendor claim] (F05-92)
- LeRobot's image transforms are off by default; when enabled each frame gets up to 3 transforms drawn from six, for example brightness with a factor of 0.8 to 1.2 and rotation within 5 degrees. (F05-84)
- With the "gpu" backend the transforms run per batch on the training GPU, 32 samples at a time by default, after a one-off compile of 15 to 30 s per image shape; the code comment gives a peak of 2.4 GB of GPU memory at 480x640 with a batch of 160. (F05-87)
- DreamGen on the SO-100: with 10 and 13 real demonstrations per task plus 40 and 50 generated ones, average success on two tasks rose from 21% to 45.5%. [author reported] (F05-102)
- DreamGen's published GPU bill: 240,000 neural trajectories for the RoboCasa benchmark took 54 hours on 1,500 NVIDIA L40 GPUs. [author reported] (F05-103)
- History (2023): MimicGen generated over 50,000 demonstrations across 18 tasks from about 200 human ones. [author reported] (F05-88)

### Section 12. Physics Simulation

- The newest MuJoCo release is 4.0.1, dated November 11, 2026; 4.0.0 shipped November 6, 2026 and carries a solver regression that 4.0.1 fixes, so the page pins 4.0.1. (F06-1, F06-2)
- The default MuJoCo timestep is 0.002 s (2 ms). (F06-10)
- One call to `mj_step` is 26 stages in four groups: position, velocity, force and acceleration, then the integrator. (F06-9)
- First-party CPU throughput for the classic humanoid, timed with `testspeed` at two threads per core: 650K steps per second on an Apple M3 Max and 1.8M on a 64-core AMD 3995WX; the same scene on MJX-JAX reached 950K on one NVIDIA A100 at batch size 8192. [vendor claim] (F06-15)
- SCOPE's steps-per-second figure for a CPU core (our own measurement, one run) has no entry in this register: no first-party single-thread figure and none for the arm's model was located; that measured figure belongs to the measurements register. The tool for it is `testspeed`, which rolls a model out for 10,000 steps by default. (F06-14)
- MuJoCo Warp's nightly benchmark (one NVIDIA RTX 6000 Ada Generation, 48 GB; newest row dated 2026-09-03 at commit 917a14b, before the current release): humanoid, 8192 worlds, 5.77 million steps per second; Aloha "pot" scene, 8192 worlds, 2.51 million; idle Franka Panda arm, 32768 worlds, 25.2 million; Aloha "clutter" scene, 2048 worlds, 342 thousand. [vendor claim] (F06-20)
- SCOPE's "thousands of parallel environments on a GPU (published figures)" ties to 8192 worlds in the MuJoCo Warp nightly data and 8,192 environments in the Isaac Lab benchmark. (F06-20, F06-47)
- GPU memory per world in MuJoCo Warp: humanoid 466 MB for 8192 worlds, about 57 KB per world; Aloha clutter 958 MB for 2048 worlds, about 468 KB per world. [derived from vendor data] (F06-22)
- Isaac Lab's release benchmark (2026-10-12 snapshot, 8,192 environments, one RTX PRO 6000 Blackwell Server Edition, RSL-RL), Franka lift from state: Newton MJWarp 318,651 training FPS at 5.41 GB; Isaac Sim PhysX 164,777 at 14.74 GB. [vendor claim] (F06-47)
- MuJoCo Warp's newest release is v4.0.1 (2026-11-11), numbered in step with MuJoCo. (F06-19)
- Newton's newest release is v1.8.0, published on GitHub 2026-11-11; the v1.0.0 tag was published 2026-04-13. (F06-40)
- Isaac Sim's newest general-availability release is 6.2.0 (GitHub release 2026-10-14); a 7.0.0a1 alpha was tagged on 2026-09-18. (F06-44)
- Isaac Lab 3.0.0 became generally available on 2026-10-20 and no longer requires Isaac Sim. (F06-45)
- MuJoCo Playground 1.0.0 (2026-11-06) is a rebuild in PyTorch on MuJoCo Warp that ships paired `sim/` and `real/` packages for the SO-101. (F06-25)

### Section 13. Rendering and Ray Tracing

- The Isaac Sim 6.2.0 requirements page carries the sentence "GPUs without RT Cores (A100, H100) are not supported."; its tiers are GeForce RTX 4080 (minimum), GeForce RTX 5080 (good) and RTX PRO 6000 Blackwell (ideal) with 16 GB, 16 GB and 48 GB of VRAM. (F06-52)
- One camera per environment cut Newton's Cartpole training throughput from 1,023,698 to 152,124 FPS, a factor of 6.7, and raised GPU memory from 0.93 GB to 57.3 GB, a factor of 62. This is the section's strongest number pair. [vendor claim; ratios derived] (F06-48)
- On a manipulation task with a 64-pixel camera (8,192 environments): Newton plus the Newton Warp renderer 115,889 training FPS at 13.6 GB; Isaac Sim PhysX plus Isaac RTX 27,962 at 24.2 GB; without a camera 220,831 and 60,757. [vendor claim] (F06-49)
- RT core counts from NVIDIA's product pages: A10 72 RT cores, 24 GB; L40S (G6e) 142 third-generation RT cores, 48 GB; RTX PRO 6000 Blackwell Server Edition (G7e) 188 fourth-generation RT cores, 96 GB; the L4 (G6) page prints no count. (F06-58)
- AWS's rule (post of 2026-06-09, written against Isaac Sim 5.1): the RTX renderer needs RT cores; G5, G6, G6e and G7e are compatible; P4d, P4de, P5, P5e, P5en, P6-B200, P6-B300 and P6e-GB200 are not. Wave 2 adds that EC2 G7 (RTX PRO 4500 Blackwell Server Edition, 32 GB, "4th Gen RT Cores") is a further RT-core family the post does not list. (F06-60)
- The Isaac Lab 3.0 install guide narrows the rule: "Headless Newton simulation does not require RTX hardware"; only RTX rendering has its own GPU requirements. (F06-51)
- MuJoCo Warp's batch renderer, a ray tracer written as GPU compute: 8192 worlds, one 64x64 camera each, about 756 ns per world per frame on an RTX 6000 Ada, about 1.3 million frames per second, using 44.4 GB of GPU memory in total (about 5.4 MB per world). [vendor claim; frames per second derived] (F06-24)
- Isaac Lab's high-fidelity "USD camera" runs out of memory beyond 48 cameras on a 96 GB RTX PRO 6000. [author reported] (F06-63)
- The Playground paper's time breakdown for a Franka pick task with a camera (37,000 environment steps per second, one RTX 4090): physics 24% of training time, rendering 18%, policy inference 1%, policy update 57%. [author reported] (F06-33)
- GPU memory per environment as one ladder: state-only physics 57 KB to 468 KB per world; one small camera per environment 1.7 MB to 7.8 MB; one full-fidelity USD camera about 2 GB. [derived] (F06-102)
- NVIDIA's H100 and H200 product pages do not mention RT cores; the H100 table lists 80 GB or 94 GB of memory and 7 NVDEC plus 7 JPEG decoders, the H200 table 141 GB. (F06-59)
- On aarch64, Isaac Sim 6.2.0 supports only the NVIDIA DGX Spark (DGX OS 7, driver 580.159.03). (F06-53)
- AWS's G7 product page lists "5th Gen Tensor Cores, and 4th Gen RT Cores" on one GPU with 32 GB per GPU: three kinds of unit on one card. (F08-43)
- The requirement that splits the families, as quoted in the instance-table entry from the Isaac Sim 6.2.0 requirements: "GPUs without RT Cores (A100, H100) are not supported." (F08-58)
- G7 became generally available 18 June 2026, with up to 8 RTX PRO 4500 Blackwell Server Edition GPUs with 32 GB each, on Intel Xeon 6 (Granite Rapids) with simultaneous multithreading off. (F08-52)
- G7e became generally available on 20 January 2026, with up to 8 RTX PRO 6000 Blackwell Server Edition GPUs with 96 GB each, up to 192 vCPUs and up to 1,600 Gbps of EFA networking. (F08-53)
- In the EC2 specification page on the fetch date, nothing newer than G7 and G7e appears in G, and nothing newer than P6-B300 and P6e-GB200 in P. (F08-51)
- GPU memory per GPU on EC2 spans 2.79 GiB (one eighth of an L4 on g6f.large) to 268 GiB (one B300 on p6-b300.48xlarge); the docs print usable GiB, so an "L4 24 GB" shows as 22 GiB and an "L40S 48 GB" as 44 GiB. (F08-45)
- NVIDIA's profiling guide lists "RT Cores, if available" among a multiprocessor's shared units; no RT core metric was found in that page, so ray-tracing-core use has no counter located in this research. (F08-36)
- RTX camera rendering can only be priced on G families. [our reading] (F08-85)
- SCOPE's "the rule that splits G from P" is the quoted requirement above plus the family table; it is a rule in the vendor's words, with the family mapping as [our reading]. (F08-58)

### Section 14. Sim-to-Real and Real-to-Sim

- Playground 1.0 ships `SO101PickCubeVision`, trained in simulation and deployed "zero-shot onto the real robot"; no success rate is published, and the README says it was "tested on 3 different robot setups under various lighting conditions". (F06-26)
- That task runs its policy at 10 Hz (`control_timestep = 0.1`), renders one 64x64 wrist-camera image per policy step and injects a random command delay of 0 to 4 ms. (F06-27)
- Its per-episode randomisation list includes the robot base height by plus or minus 2.5 mm, next to friction, actuator gains, colours, lighting and joint-reading calibration bias. (F06-28)
- Calibration is a named part of the gap: manual middle-pose calibration "can easily be off by 1-2+ cm in end-effector height". (F06-29)
- System identification for the arm is a shipped script: `mujoco.sysid` fits 24 parameters (four for each of the 6 joints) from one teleoperated excitation episode and also estimates the serial transport delay. (F06-30)
- The identified servo parameters in the repository: position gains between 218 and 265, damping between 17.5 and 34.2, armature between 0.109 and 0.199, and a torque limit from the STS3215's stall torque of 30 kg-cm at 12 V (2.94 N m). (F06-31)
- History (2017): domain randomisation trained an object detector accurate to 1.5 cm in the real world from simulated images alone. (F06-66)
- PolaRiS builds a scanned twin from a 2 to 5 minute video; reconstruction "typically completes within 30 minutes on an NVIDIA RTX 4090" and human effort is "typically less than 20 minutes". [author reported] (F06-73)
- The scanned twin alone was not enough: PolaRiS fine-tunes policies for 1k steps on about 350 simulated demonstrations from 15 other scanned scenes before evaluating them. (F06-74)
- 3DGRUT (v1.1.0, 2026-06-10) training averages on an RTX 5090: 3DGRT 479 s (NeRF Synthetic) and 2,869 s (MipNeRF360); 3DGUT 215 s and 686 s. [author reported] (F06-75)
- The gap runs both ways: in an AWS engagement (post of 2026-09-09) a model fine-tuned on real demonstrations scored 0% success in simulation while models trained on clean simulation data reached 35% to 45% there. [vendor claim] (F06-72)
- MuJoCo 4.0 ships a system-identification toolbox (`mujoco.sysid`) and adds `pid` and `dcmotor` actuators and actuator delays aimed at real servos. (F06-6, F06-7)

### Section 15. Training at Three Scales

- Per-task adaptation, LeRobot's hardware guide for 5 epochs on about 50 episodes: ACT in 30 to 60 minutes on one RTX 4090 or 3090, SmolVLA in 3 to 6 hours on one L4 or A10G, pi0 or pi0.5 in 4 to 8 hours on one A100 40 GB. These assume 30 s episodes (~45k frames) with "Real runs deviate by +/-50%"; at the recorder's default 60 s episode the same 50 episodes are 90,000 frames and each time doubles. [vendor claim, stated as indicative], the doubling is [derived] (F01-90)
- Per-task adaptation, SmolVLA: 20,000 steps at batch size 64 take roughly 4 hours on a single A100, from the 450M `smolvla_base` checkpoint with about 50 recorded episodes. [vendor claim] (F02-63)
- Per-task training from scratch, ACT: about 5 hours on one 11 GB RTX 2080 Ti. [author reported] (F02-9)
- Per-task adaptation, GR00T 2: on 50 tasks NVIDIA selected as learnable from five episodes, success goes from 40% zero-shot to 95% after five demonstrations and one LoRA fine-tune of about 30 minutes on an RTX 5090 per task. [vendor claim] (F02-46)
- Fine-tuning N1.7 (NVIDIA) needs one GPU with 40 GB or more of memory and stays under about 35 GB with the VLM frozen; measured throughput is 192.57 samples/s on an H100 and 56.42 on an L40. [vendor claim] (F02-42)
- openpi's memory requirements: more than 8 GB of GPU memory for inference, more than 22.5 GB for LoRA fine-tuning and more than 70 GB for full fine-tuning; the "no multi-node" sentence applies to the JAX path only. (F02-54)
- One-node post-training, pi0-FAST: 240k iterations at batch size 256, about 4 days on 8 H100 GPUs for a 3B-parameter VLA. [author reported] (F02-28)
- Multi-node pretraining, NVIDIA's N1.7: 64 GB200 nodes with 4 GPUs each for 120 hours, from the model card's energy estimate. [vendor claim] (F02-39)
- Multi-node pretraining, GR00T N1: roughly 50,000 H100 GPU-hours on up to 1,024 GPUs. [author reported] (F02-34)
- Multi-node pretraining, X-VLA: 64 NVIDIA A100 GPUs, global batch size 1024, about 4 days, on 290K episodes. [author reported] (F02-71)
- Multi-node pretraining, Cosmos 3: Nano with 1,024 GB200 GPUs and Super with 2,048 GB200 GPUs; days and GPU-hours are not stated. [vendor claim] (F03-97)
- V-JEPA 2's only printed pretraining figure is a projection: roughly 60 GPU-years on A100s for ViT-g at full resolution throughout, with progressive resolution cutting GPU time by 8.4x; the actual run's GPU count and wall-clock time are not stated. [author reported] (F03-1, F03-12)
- The JEPA world models sit at all three scales: LeWorldModel "a single GPU in a few hours" (GPU not named), V-JEPA 2-AC a 32-GPU job for 94,500 iterations, RoboJEPA-1B 256 H100 GPUs, with durations not stated. [author reported] (F03-119)
- SCOPE's "minutes to hours", "hours to days" and "weeks" are scale labels, not sourced figures; the two multi-node pretraining runs above that publish a duration ran for days, so "weeks" has no entry behind it. [our reading] (F02-39, F02-71)
- AWS's post of 19 November 2026 trains ACT, GR00T N1.7 and pi0.5 with LeRobot 0.6.1 on an SO-101 pick-and-place dataset, with the same container on Training Jobs and HyperPod. (F09-81)
- From that post, one 20,000-step post-training run on a 75-episode, two-camera 640x480 SO-101 dataset on SageMaker Training Jobs: GR00T N1.7 on ml.g7e.2xlarge at batch 32 took 3.4 hours; on ml.g6e.2xlarge at batch 16, 4.0 hours; pi0.5 full weights on ml.g6e.xlarge at batch 8 took 10.9 hours. [vendor claim: AWS's own measurement] (F09-82)
- Peak GPU memory in the same runs: ACT 15 GB at batch 32; GR00T N1.7 (projector and diffusion head, backbone frozen) 41.5 GB at batch 32; pi0.5 all weights 41 GB at batch 16. [vendor claim: AWS's own measurement] (F09-82)
- AWS's embodied AI post (2 December 2025, updated 6 May 2026) fine-tunes GR00T on AWS Batch: 6000 steps "usually takes up to 2 hours on a g6e.4xlarge instance". [vendor claim] (F09-114)
- One node, eight GPUs: the 10 September 2026 AWS post fine-tunes pi0 (3 billion parameters) on one ml.p5.48xlarge (eight H100) with a 1.2 TiB FSx for Lustre file system; a Training Job has "~5 min cold start". (F09-83)
- One node, eight GPUs: Telexistence (9 September 2026) fine-tuned DreamZero, a 14 billion parameter world action model, on one p6-b200.48xlarge (eight B200) reserved with Capacity Blocks; inference held about 583 ms per step, about 8 times faster than on g7e. [author reported] (F09-88)
- The AWS sample's own cost estimates (its figures, not price-list lookups): GR00T full fine-tune about $79 on ml.g5.12xlarge for 11 hours; DreamZero 1000 steps about $93 on ml.g7e.24xlarge for 4 h 11 min; Isaac Lab reinforcement learning about $10 to $30 on ml.g5.xlarge for 2 to 4 hours. [vendor claim] (F09-75)
- Multi-node: checkpointless training reports over 80% less downtime in internal studies on 16 to over 2,000 GPUs; the documented recipes are language models on 2 or 16 `p5.48xlarge` nodes. [vendor claim] (F09-30)
- A SageMaker training plan runs 1 to 182 days in 1-day steps, in quantities of 1, 2, 4, 8, 16, 32 or 64 instances, bookable up to 8 weeks ahead. (F09-34)
- SCOPE's "one GPU, minutes to hours" and "one-node post-training (hours to days)" tie to the hour figures above (F09-82, F09-114). (F09-82, F09-114)

### Section 16. Evaluation

- History (2024): across the SIMPLER tasks, ranking policies by validation action MSE gave Pearson r of 0.308 with real-world success (MMRV 0.375), against 0.924 (MMRV 0.056) for closed-loop simulated evaluation with visual matching. This is the section's strongest number. [author reported] (F06-81)
- PolaRiS's scanned-twin evaluation correlated with real results at "an average Pearson correlation of r = 0.9" across six paired environments (worst single environment r = 0.81), with 20 real rollouts per policy per environment and 50 simulated rollouts per task. [author reported] (F06-83)
- A saturated benchmark misleads too: nearly all tested policies scored "between 90 and 95% success in Libero" while spanning the full range in the real world. [author reported] (F06-82)
- LIBERO-Plus reports performance "dropping from 95% to below 30% under modest perturbations"; LIBERO-PRO reports models above 90% whose "performance collapses to 0.0%". [author reported] (F06-87)
- What 50 trials can tell: 40 successes in 50 trials is 80% with a 95% Wilson interval of 67.0% to 88.8%; a second policy at 45 of 50 (90%, interval 78.6% to 95.7%) overlaps it, with p = 0.26 by Fisher's exact test; telling a true 80% from 90% with 80% power at the 5% level takes about 199 trials per policy. [derived] (F06-97)
- Real-trial counts in published work: 12 trials for one task in the Playground paper (12 of 12 successes), 20 real rollouts per policy per environment in PolaRiS, 50 trials per task in ABC. (F06-96)
- LeRobot v0.7.0's `lerobot-eval` reports the success rate with a 95% Wilson confidence interval (`pc_success_ci95`). (F06-94)
- RoboWorld (arXiv v4 of 15 Jul 2026) scores policies inside a video world model: across 8 policies and 4,186 generated rollouts of 30 seconds it reports Pearson r = 0.989 and Spearman 0.970 against the RoboArena leaderboard, for "only 100 H100 GPU hours". [author reported] (F06-89)
- Other world-model evaluators: WorldGym reports Pearson r = 0.78; HF-WM reports r = 0.983 over six RoboArena policies and 540 policy-session evaluations; a third-party test found Ctrl-World mis-ranked policies (MMRV 0.22). [author reported] (F06-90)
- RoboArena, the real-world reference, reports "more than 600 pairwise real-robot evaluation episodes across seven generalist policies". [author reported] (F06-88)
- Isaac Lab-Arena's scaling on one RTX 5880 Ada (49 GB), camera-free with a zero-action policy: 1 environment 5.41 environment-steps per second, 1,024 environments 2,390; eight independent runs on L40 GPUs took 1,255.2 s on one GPU and 157.8 s on eight, "a 7.95x speedup". [vendor claim] (F06-93)
- Isaac Lab-Arena's last announced version is v0.3 (alpha), on 2026-09-10. (F06-92)
- The real robot is not a fixed yardstick: 1X's post of 17 September 2024 says a shirt-folding model "degrades in performance over the course of 50 days"; it publishes no correlation figure. (F06-91)

### Section 17. Running on the Robot

- GR00T N1.7 with the full TensorRT pipeline takes a median 149.0 ms on Jetson Orin, 76.8 ms on AGX Thor, 116.6 ms on DGX Spark, 35.0 ms on an L40, 24.7 ms on an RTX Pro 6000 Blackwell and 22.9 ms on an H100, per one complete policy call. [vendor claim] (F07-1)
- Conditions of that table: the `nvidia/GR00T-N1.7-LIBERO` checkpoint (32 DiT blocks), batch size 1, action horizon 40, four denoising steps, two 256x256 camera inputs; each figure is the median of 60 timed calls and the table does "not measure closed-loop task success". (F07-2, F07-3)
- Worked example on the arm's control rate: 149.0 ms per call on Jetson Orin is 1.94 times Thor's 76.8 ms, against 357.9 ms in plain PyTorch; at a 30 Hz control rate, 149 ms is 4.5 control periods. The README does not say which Orin module this is. [vendor claim for the latencies] (F07-5)
- On AGX Thor, mixed NVFP4 quantisation cuts the call from 76.8 ms to 35.6 ms, a factor of 2.16; from PyTorch eager (106.8 ms) the factor is 3.0. No other device has a quantised figure in the table. [vendor claim] (F07-4)
- Real-time chunking on real robots: pi0.5 with H = 50 and dt = 20 ms (a 50 Hz robot), a starting delay of about d = 6, then +100 ms and +200 ms of injected latency (d about 11 and 16); six two-armed tasks, 480 episodes, 28 hours; "no degradation" for RTC. [author reported] (F07-69)
- The one measured off-board latency chain found: desktop robot computer model 97.43 ms, network 6.89 ms, image resize 1.44 ms, other 3.00 ms, total 108.76 ms; small on-robot computer (Intel NUC) model 96.89 ms, network 21.20 ms, image resize 11.22 ms, other 9.67 ms, total 138.98 ms. [author reported] (F07-68)
- The limit no setting fixes, in LeRobot's words: "If inference takes 1 second out of a 1.67-second prediction, only about 0.67 seconds remain. Another 1-second request cannot fit; no refill value fixes that." (F07-22)
- LeRobot remote inference asks for the next chunk at `refill_seconds` (default 0.5 s of remaining playback), with the floor "Effective refill is `max(refill_seconds, recent maximum turnaround + 1 / fps)`". (F07-26)
- NVIDIA's suggested prices on 2026-11-20: AGX Thor Developer Kit $5499; T5000 module $4999 (1KU+); AGX Orin Developer Kit $3499; Orin NX 16GB $999 (1KU+); Orin Nano Super Developer Kit $399. DGX Spark's price was not found on an NVIDIA page. (F07-42, F07-48)
- Jetson Orin Nano Super Developer Kit: 67 INT8 TOPS, 8 GB LPDDR5 at 102 GB/s, 7 W to 25 W. [vendor claim] (F07-36)
- Current software: JetPack 7.2.2 with Jetson Linux 39.2.2, Linux kernel 6.8 and Ubuntu 24.04, for both Thor and the Orin family; the newest TensorRT is 11.5.0 (GitHub release dated 2026-11-18), while JetPack 7.2.2's table lists TensorRT 11.4.1. (F07-44, F07-76)
- Engines per device type: "By default, TensorRT engines are only compatible with the type of device where they were built."; the rule holds on Jetson (JetPack), and TensorRT 11.5.0 adds a hardware compatibility mode on Arm server-class Linux, DGX Spark included. Jetson AGX Orin is compute capability 8.7, Jetson AGX Thor is 11.0 and DGX Spark is 12.1; the engine build takes about 2 to 5 minutes. SCOPE's phrase "why one is built per device type" needs that DGX Spark qualifier; SCOPE's text for this section carries no number of its own. (F07-77, F07-79, F07-8)
- What quantisation costs in task success: the one check is on an H100, one LIBERO task, 20 episodes: PyTorch 20 of 20, TensorRT full pipeline 19 of 20, for an unquantised (BF16) engine; no success figure exists for the NVFP4 engine or for any Jetson. [vendor claim] (F07-10)
- Newer than the table: GR00T 2 (November 2026, whitepaper only, no released code or weights) reports 124 ms per action chunk on a Jetson Thor at 120 W for its Turbo variant. [vendor claim] (F07-119)

### Section 18. The Fleet

- One Greengrass component's artifacts may total at most 2 GB, and the limit cannot be raised; the recipe may be at most 16 KB and `CreateComponentVersion` is limited to 1 request per second per Region. (F07-87)
- The policy weights in NVIDIA's Thor tutorial are "~6 GB+", above that artifact limit, so a policy travels as a container image or an S3 object with the component carrying the reference. [our reading for the delivery route] (F07-54, F07-87)
- The Greengrass nucleus is at version 2.18.4 (GitHub release 2026-10-14) and needs a Java runtime of version 8 or later, at least 256 MB of disk and 96 MB of RAM on Linux. (F07-84)
- Greengrass nucleus lite "uses less than 15MB RAM" and needs 5 MB of storage; it was introduced with Greengrass 2.14.0, and GitHub's newest release is v2.7.0 (2026-09-25). (F07-85)
- By default Greengrass asks components before updating them and waits 60 seconds (`timeoutInSeconds` defaults to 60), then the deployment proceeds on the device. (F07-90)
- A job's rollout is a constant `maximumPerMinute` (minimum 1 device per minute) or an exponential rate with a `baseRatePerMinute` from 1 to 1000 and an `incrementFactor` from 1.1 to 5. (F07-92)
- AWS's own exponential example: a base rate of 50 per minute and an increment factor of 2, with the rate doubling each time another 1,000 devices have been notified or have succeeded, gives 50, 100, 200, 400 per minute. (F07-93)
- An abort stops the spread and does not undo it: "only QUEUED job executions are canceled". (F07-95)
- An MQTT message through AWS IoT Core can be at most 128 KB, a connection can make 100 publish requests per second, and data on one connection is processed at 512 KB per second. (F07-97)
- AWS RoboMaker's end-of-support date is September 10, 2025; AWS IoT Greengrass V1 ended October 7, 2026. (F07-98, F07-99)
- S3 multipart upload: up to 10,000 parts of 5 MiB to 5 GiB each, with a maximum object size of 48.8 TiB. (F07-102)
- A published fleet loop: 16 two-armed robots upload complete episodes at episode boundaries and the learner broadcasts an updated shared policy every 50 training steps; on an 8-hour, 16-robot run an episode reaches the learner in 41 s at the median (148 s at the 99th percentile) and a published model reaches a robot in 38 s at the median (55 s at the 99th percentile). [author reported] (F07-108, F07-109)
- Upper bound on data volume, a sizing model: 38.41 MB/s for a reference robot with seven 1920x1080, 30 fps video streams, 3.32 TB per robot per day; for 120 robots 4.61 GB/s and 11.95 PB per 30 days. [author reported, modelled] (F07-106)
- SCOPE's "a hundred robots" is an illustration, not a sourced figure: AWS's rollout example steps at 1,000 devices and the published fleet loop has 16 robots. (F07-93, F07-108)

### Section 19. Agents Running the Loop

- ENPIRE's robot utilisation on pin insertion is 49.1% with one agent, 30.9% with four and 29.8% with eight; GPU utilisation is 29.4%, 32.5% and 49.0%. This is the section's strongest number. [author reported] (F04-19)
- The fleet's token rate is 9,269 tokens per minute with one agent, 40,029 with four and 140,310 with eight: 15x the tokens for 8x the agents. [author reported] (F04-20)
- Tokens to a successful policy rise from 2.5 million to 7.7 million to 16.8 million while time to success falls from 4.5 h to 3.2 h to 2.0 h; these Fig. 7 times measure completing the objective (100% over every window of 50 consecutive episodes) and must not be combined with Fig. 3's times. [author reported] (F04-20)
- Fig. 3 scaling, time to first reach the target: Push-T falls from 4.7 h with one agent to 3.1 h with four and 2.0 h with eight; pin insertion falls from 2.5 h to 0.89 h to 0.67 h. Eight robots buy roughly 2.4x to 3.7x, not 8x. [author reported] (F04-18)
- The fleet is eight stations, each with two 6-DoF arms (14 actuated joints), one NVIDIA RTX 5090 (32 GB), an Intel Core Ultra 9 285K (24 cores) and 128 GB RAM, with no shared cluster. (F04-5)
- The headline result is 99% success with up to eight in-context retries ("pass@8"); it is a recovery measure, and the one-shot rate of the final policies is not given. [author reported] (F04-16)
- On a simplified real Push-T task with Codex, one agent used 80M tokens in total, of which 77M were cached input, 2.4M fresh input and 0.27M output; about 96% of tokens are re-reads of cached context. [author reported] (F04-22)
- In the published eight-agent pin-insertion run the team tried 86 ideas in about 3.4 hours; 28 raised the team's best success rate and 58 did not. [author reported] (F04-23)
- ASPIRE v2 prices the agent on the 10 LIBERO-Pro Goal tasks: Claude Opus 5.5 reaches 99.2% at $18.29 per task, Claude Sonnet 5.5 98.8% at $12.11, GPT-6 Luna 14.8% at $0.83; mean agent time is 31 to 139 minutes per task. [author reported] (F04-30)
- "You Don't Need To Stay in The Loop" ran on one Quadro RTX 8000: rounds 0 to 26 over five calendar days, 121.6 GPU-hours over 5,475 real evaluation episodes; the controller's token cost was not kept. [author reported] (F04-36)
- The same paper reports against its own thesis: taking the final checkpoint beat every measurement-driven selector by 5.6 to 10.0 points, and re-running one evaluation cell with the same seeds flipped 22 of 100 episode outcomes. [author reported] (F04-37)
- Corrected by wave 2: RACaP (arXiv 2609.29394v1) reports 54.4% in-domain on LIBERO; its only dollar figure for its own method is run time, $0.089 and 32.9 s per episode on Robosuite. The $62.55 campaign cost belongs to the RATS baseline. [author reported] (F04-42)
- History (2023): one Eureka run is 5 iterations of 16 candidate rewards, each scored by a full RL training, on one station with 8 A100 GPUs in under one day. [author reported] (F04-39)
- Guardrail outside the agent's code: AWS Batch has no job timeout unless `attemptDurationSeconds` (minimum 60 seconds) is set; Batch then sends SIGTERM at the limit and SIGKILL 30 seconds later, and a timed-out job is not retried. (F04-50)

### Section 20. Fifteen Workloads, Five Shapes

- Where fifteen comes from: eight phases of the one-arm story split wherever two steps load different parts gives twelve workloads, plus three known only from published vendor numbers. [our reading] (F08-75)
- The five shapes A to E are defined by duration, coupling and interruptibility and nothing else. [our reading] (F08-78)
- The machine has nine parts in the dive's grouping, plus storage and network outside the chip. [our reading] (F08-50)
- CPU physics (MuJoCo humanoid, one core): 14,507 steps/s on the Jetson A78AE, 28,662 on the Spark A725, 57,240 on the Spark X925; the A78AE loses 31.0% of slots to the front end, the X925 loses 36.5% to the back end with almost no memory stall (0.4% of cycles). Tier 0 (our measurement, one run per pass; the workload rows reproduce across two passes within 2.5% on throughput). (F08-61, F08-73)
- Memory bandwidth from one core: 11.71 GB/s on the Jetson A78AE, 43.95 GB/s on the Spark A725, 44.38 GB/s on the Spark X925; the Spark delivers 3.8 times the Jetson. Tier 0 (our measurement, one run). (F08-66)
- Memory latency: 291.58 ns per load on the Jetson A78AE, 144.92 ns on the Spark A725, 123.96 ns on the Spark X925. Tier 0 (our measurement, one run). (F08-67)
- Why the policy stand-in is memory-bound: its weights are 6 x 1024 x 1024 x 4 bytes = 25.2 MB, and 390 x 25.2 MB = 9.8 GB/s on the Jetson core sits at that core's measured memory limits (9.25 GB/s read, 11.71 GB/s triad). [derived] from Tier 0 (one run). (F08-63)
- The CPU beside the GPU: 192 vCPUs / 8 = 24 vCPUs per GPU, which is 12 physical cores (2 threads per core), on most eight-GPU sizes. [derived] (F08-57)
- Network spans a factor of more than 1,000: g6.xlarge 2.5 Gbps baseline, no EFA; g7.48xlarge 700 Gbps with EFA; p5.48xlarge 3,200 Gbps; p6-b300.48xlarge 6,400 Gbps. (F08-49)
- Storage ceiling per instance: EBS on g6.xlarge 125 MB/s baseline (625 burst), g6e.4xlarge 1,000 MB/s, g7e.48xlarge and p5en.48xlarge 12,500 MB/s. (F08-46)
- GPU memory per GPU spans 2.79 GiB to 268 GiB. (F08-45)
- "GPU utilisation" in `nvidia-smi` is the percentage of time at least one kernel was executing; NVIDIA's guidance for DCGM "SM Activity" is that 0.8 or more is "necessary, but not sufficient" for effective use. (F08-30, F08-32)
- SCOPE's "about fifteen workloads" and "Five Shapes" tie to the grouping above and stay [our reading]; the AWS orchestration register's workload-to-orchestration table uses sixteen rows, a different cut of the same loop. (F08-75, F08-78)

### Section 21. Reading a Machine: PMU Cards

- Intel's definition: "A pipeline slot represents the hardware resources needed to process one uOp."; the same page's "four pipeline slots" per cycle is out of date for current cores. (F08-2)
- Pipeline width in Intel's current metrics file: 4 from Sandy Bridge, 5 from Ice Lake, 6 from Alder Lake and Sapphire Rapids, 8 from Lunar Lake and Arrow Lake. (F08-8)
- AMD Zen 4 counts 6 dispatch slots per cycle; Zen 5 uses the same formulas with 8, and the Zen 6 file also says 8. (F08-11, F08-12)
- Slots per cycle in Arm's files: Neoverse V1 8, Neoverse V2 8, Neoverse V3 10, Cortex-X925 10, Cortex-A725 5 (Neoverse N1 5); there is no file for the Cortex-A78AE. (F08-16)
- Arm's Telemetry Solution, where those files live, is at release 2026.09 (2026-09-29). (F08-13)
- Arm's branch-mispredict correction: 4 cycles per mispredicted branch on the Neoverse V1; on the Neoverse V2 the 4-cycle term is taken 1 cycle from the front end and 3 cycles from the back end; the Neoverse V3, Cortex-X925 and Cortex-A725 use a measured event, STALL_FRONTEND_FLUSH. (F08-17, F08-18, F08-19)
- Which EC2 core uses which formula: Graviton3 is Neoverse V1, Graviton4 is Neoverse V2, Graviton5 is Neoverse V3 at 3,300 MHz; M9g and M9gd (generally available 10 June 2026), C9g and C9gd (30 June 2026), R9g and R9gd (31 August 2026). (F08-56)
- Full PMU support on EC2: `*9g` at 12xlarge, 24xlarge and 48xlarge; `*8g` at 24xlarge and 48xlarge; `*7g` and `*6g` at 16xlarge; `*8i` at 48xlarge; `*7i`, `*8a`, `*7a` and `*6a` at 24xlarge and 48xlarge; `*6i` at 16xlarge and 32xlarge. (F08-26)
- In the accelerated-computing table, "Metal instances available" is yes only for G4dn and G5g, so a PMU card for a GPU instance is a card of a virtual machine. (F08-28)
- Linux perf at v7.3 has directories for Cortex-A78 and Cortex-X1/X2 but none for Cortex-X925 or Cortex-A725, so on a DGX Spark `perf stat --topdown` would use the generic formula. [our reading for the last clause] (F08-21)
- GPU tools at current versions: Nsight Compute 2026.4.0 (per kernel), Nsight Systems 2026.6 (timeline), DCGM newest tag v4.7.0 (fleet fields). (F08-33, F08-39, F08-32)
- Since 19 November 2026 EC2 Detailed Monitoring can publish one-minute GPU metrics with no agent inside the instance; which fields was not read. (F08-86)
- SCOPE's "four places a slot can go" ties to Intel's four categories, decided by two questions: was a micro-operation delivered, and did it retire. (F08-3)

### Section 22. Our Measurements

- What was run: 14 single-thread CPU microbenchmarks and 3 CPU stand-in workloads on a DGX Spark and a Jetson Orin Nano Super, each under `perf stat` twice (six top-down events, then eight detail events), plus one GPU matrix-multiply kernel per machine. Tier 0 (single run). (F08-60)
- Physics step: 14,507 steps/s on the Jetson A78AE, 28,662 on the Spark A725, 57,240 on the Spark X925; retiring is the largest category on all three (43.2%, 61.0%, 45.7%). Tier 0 (one run; a MuJoCo humanoid, not the arm). (F08-61)
- Policy inference stand-in (six 1024x1024 float32 matrix-vector products with ReLU): 390 inferences/s on the Jetson A78AE, 1,404 on the Spark A725, 1,968 on the Spark X925; the Jetson spends 63.9% of slots back-end bound and 62.3% of cycles stalled on memory. Tier 0 (one run). (F08-62)
- Camera render stand-in (MuJoCo offscreen 640x480 through EGL): 209 frames/s on the Jetson A78AE, 937 on the Spark A725, 1,191 on the Spark X925; on the X925 69.2% of slots are back-end bound with only 3.4% of cycles in memory stall. Tier 0 (one run; GPU share of each frame not established). (F08-64)
- Floating-point capability: 3.411 billion fused multiply-adds per second on the A78AE, 5.595 on the A725, 22.242 on the X925, a ratio of 6.5; the X925 retires 61.8% of its 10 slots at 6.18 instructions per cycle. Tier 0 (one run). (F08-65)
- Slots per cycle as measured: 10 on the Cortex-X925, 5 on the Cortex-A725, 6 on the Cortex-A78AE, the last derived from the counters at exactly 6.000 on three different kernels. Tier 0 (one run). (F08-68)
- Size of the missing flush correction, as an illustration: MuJoCo step on the X925 moves 1.6 points from front end (12.2% to about 10.6%) to bad speculation (5.6% to about 7.2%); the branch microbenchmark moves 13.2 points; policy and memory kernels move by under 0.5 points. [derived, illustration] (F08-23)
- GPU, DGX Spark: a 4096x4096 float32 matrix multiply ran in 8.35 ms under Nsight Compute 2025.3.1: compute (SM) throughput 70.49%, memory throughput 50.47%, achieved occupancy 16.62%, SM clock 2.13 GHz; about 16,460 GFLOP/s [derived]. Tier 0 (one kernel, one pass). (F08-71)
- GPU, Jetson Orin Nano Super: a 2048x2048 float32 matrix multiply ran in 42.31 ms under Nsight Compute 2024.3.1: compute (SM) throughput 74.49%, memory throughput 48.27%, achieved occupancy 33.10%; the SM clock was 306 MHz, so the duration is not comparable with the Spark's. Tier 0 (one kernel, one pass). (F08-72)
- Report against raw counters: 36.54% recomputed where the report says 36.5%; 26.81% recomputed where the report says 26.8%. [derived] (F08-70)
- Reproduction across the two passes: the three workload rows reproduce (throughput within 2.5%, every level-1 category within 0.5 points); the triad stall split does not (Jetson `triad_mem` at 11.66 GB/s with 5.9% front end and 76.9% back end in pass 1, 11.71 GB/s with 78.1% and 7.9% in pass 2). Throughput may be printed; that stall split may not. (F08-73)
- Software differed between the machines: MuJoCo 4.0.1 on the Spark, 3.17.0 on the Jetson. (F08-73)
- SCOPE's "one run each" is narrowed: two passes exist, built from different versions of the benchmark; say "one run per pass, two passes" and print only what reproduces. (F08-73)

### Section 23. Price-Performance and Latency

- Cloud formula: units per dollar = units per second x 3,600 / price per hour, with a dated first-party price for a named Region and purchase option. [derived, method] (F08-82)
- Units of work, one per workload row; row 12 is actions (or chunks) per second with p50 and p99 latency per call. [our reading] (F08-81)
- No On-Demand or Spot price was collected in register 08, so those dollar columns stay empty. (F08-59)
- The dated first-party prices that do exist are Capacity Block prices, per instance hour: p5.48xlarge $47.757 ($5.970 per GPU), p5e.48xlarge $54.924, p5en.48xlarge $63.158 ($7.895 per GPU), p6-b200.48xlarge $113.666 ($14.208 per GPU), p6-b300.48xlarge $129.168 ($16.146 per GPU); the next price update is scheduled for January 2027. (F09-93)
- Edge inputs: Jetson Orin Nano Super 7 W to 25 W and 399 dollars for the developer kit; AGX Thor T5000 40 W to 130 W; DGX Spark 240 W supply with a 140 W chip budget, price not on an NVIDIA page. [vendor claim] (F08-83)
- Our own idle readings: Jetson board idle about 4.8 W; Spark GPU idle 10 W. Tier 0 (single reading); no run recorded power under load. (F08-83)
- Latency from the stand-in is a mean only: 1 / 390 per second = 2.56 ms per inference on the Jetson core, 0.51 ms on the X925 [derived]; no p99 exists in ours or in the published "median of 60 timed calls". (F08-84)
- Per-part pricing: G7's 24 physical cores per GPU is the most among eight-GPU x86 sizes; P6e-GB200 has 36 Grace cores per GPU and G5g has 32 Graviton2 cores per GPU. [our reading] (F08-85)
- The AWS sample's own hourly estimates (its figures): Cosmos 3 Predict about $37 per hour on p5.48xlarge under a Capacity Block; Cosmos Transfer 2.5 about $8 per hour on g6e.12xlarge on Spot; full OSMO deployment about $5 per hour. [vendor claim] (F09-75)
- EKS Auto Mode adds a fee per instance: AWS's worked example charges $0.03672 per hour on a `c6a.2xlarge` priced at $0.306 per hour; the fee for G and P types was not readable. (F09-51)
- HyperPod bills per provisioned instance-hour; AWS's own example of 4 `ml.g5.24xlarge` for 30 days totals $29,374.40 with storage. (F09-33)
- Graviton Spot savings in the advisor file: 53% to 79% against On-Demand in US West (Oregon) for C8g and M8g. (F09-97)
- SCOPE's text for this section carries no number of its own; its "units per dollar-hour for cloud instances" ships as a method with Capacity Block prices only. (F08-59, F09-93)

### Section 24. Orchestrating It on AWS

- A Batch array job is one submission that spawns 2 to 10,000 child jobs, each reading its index from `AWS_BATCH_JOB_ARRAY_INDEX` (starting at 0). (F09-5)
- Batch under Spot: multi-node parallel jobs do not run on Spot compute environments; the documented retry is up to 10 attempts matching `Host EC2*`; guidance is to avoid jobs of an hour or more and checkpoint into parts of 30 minutes or less. (F09-8, F09-10, F09-11)
- Batch scale to zero: `minvCpus` 0 holds no instances when the queue is empty, and since 2 March 2026 `minScaleDownDelayMinutes` keeps an instance for 20 minutes to 1 week after its last job. (F09-13)
- HyperPod task governance is built on Kueue: add-on version v1.6.1-eksbuild.1 installs Kueue v0.19.2; a team can borrow up to 10,000% of its allocation. (F09-25, F09-26)
- HyperPod flexible instance groups (16 April 2026 release note; What's New dated 17 April 2026) list up to 20 instance types in priority order; since 18 November 2026 HyperPod supports higher pod density per node on EKS-orchestrated clusters. (F09-29, F09-115)
- Versions fetched, which is what SCOPE's "November 2026 state" rests on: Karpenter v1.15.2 for the AWS provider (released 12 November 2026); Kueue v0.20.7 (19 November 2026); KAI Scheduler v0.19.0 (11 November 2026); Volcano v1.16.0 (14 October 2026); OSMO 6.3.1 (22 June 2026). (F09-38, F09-54, F09-57, F09-59, F09-61)
- EKS Auto Mode GPU limits: G7e is supported; G7 is not supported in Auto Mode "as of November 2026"; Auto Mode nodes live at most 21 days. (F09-49, F09-48)
- AWS Nitro Sandboxes (announced 9 November 2026, Kubernetes 1.36 or later) run a pod in its own microVM and cannot use a GPU; up to 5 sandboxes per parent vCPU and 896 per instance, at least 256 MiB each. (F09-43, F09-45)
- EKS Auto Mode "resource optimization" is in PREVIEW since 17 November 2026: seven Regions, Deployments and StatefulSets only, CPU and memory only ("doesn't size GPUs"), about 12 hours of usage history first. (F09-46)
- A Capacity Block for ML: start time up to eight weeks ahead, offerings that start in as little as 30 minutes, up to 64 instances per block and 256 across blocks, length up to six months; it ends at 11:30 UTC. (F09-90)
- Capacity Blocks cover P and Trainium types only: p4d.24xlarge, p4de.24xlarge, p5.4xlarge, p5.48xlarge, p5e.48xlarge, p5en.48xlarge, p6-b200.48xlarge, p6-b300.48xlarge, trn1.32xlarge, trn2.3xlarge, trn2.48xlarge; no G family and no P6e-GB300 appears, and no G-family type is on the training plans list. (F09-91, F09-35)
- Spot interruption buckets (file last modified 20 March 2026), US East (N. Virginia): 7 of 8 G5 sizes and 5 of 8 G6e sizes are in the ">20%" bucket; p5.48xlarge, p5.4xlarge and p5en.48xlarge are in the "<5%" bucket; G7 has no rows. (F09-96)
- The AWS Physical AI Toolchain sample was created 9 July 2026 and announced on 7 October 2026, with no tagged releases; its Isaac Lab component runs 4096 parallel environments on SageMaker and Batch. (F09-69, F09-70)
- Step Functions as glue: a Distributed Map state with no concurrency set runs 10,000 child executions in parallel; at most 1000 Map Runs can be open at once. (F09-101)

### Section 25. Choosing

- No AWS first-party page that compares AWS Batch, SageMaker HyperPod and Amazon EKS side by side was located (searches run on 2026-11-20), so the decision path is the dive's own. [our reading] (F09-110)
- AWS's one-sentence rule from its 19 November 2026 post: Training Jobs for a fully managed service, HyperPod for a team that already runs Kubernetes or Slurm and wants a persistent cluster. (F09-81)
- When the persistent cluster pays, per an AWS post of 4 September 2026: "many concurrent jobs, continuous synthetic generation, reserved capacity, and the tens-of-nodes tail where failures are statistically frequent"; its three workloads run on p5en.48xlarge nodes. (F09-112)
- Capacity Block price for the common eight-GPU choice: p5.48xlarge $47.757 per instance hour ($5.970 per GPU). (F09-93)
- A Capacity Block inside Auto Mode: nodes start draining 10 minutes before EC2 begins terminating them, and EC2 terminates 30 minutes before the block's end, 60 for UltraServers. (F09-50)
- Spot: two minutes' warning on a best-effort basis, and a rule of thumb to be flexible across at least 10 instance types per workload. (F09-95)
- G7e on Spot differs by Region: 3 of 6 sizes above 20% in US East (N. Virginia), 4 of 6 sizes in "<5%" in US East (Ohio), in the file last modified 20 March 2026. (F09-96)
- CPU work on Graviton Spot: C8g and M8g each have 12 sizes with rows in 25 and 30 Regions; in US West (Oregon) 7 of 12 C8g sizes and 8 of 12 M8g sizes are in the "<5%" bucket. (F09-97)
- Customer evidence for two GPU types in one NodePool: RobCo (12 November 2026) lists ml.g6.12xlarge and ml.g6e.12xlarge, removes a node 60 seconds after its last pod leaves, and reports about 15% lower cost per run. [author reported] (F09-86)
- Top of the P range: P6e-GB300 UltraServers were announced generally available on 2 December 2025, with 1.5 times the GPU memory and FP4 compute of P6e-GB200, and are obtained through an AWS sales representative. [vendor claim for the 1.5 times] (F08-54, F09-99)
- Rubin: AWS's press release of 26 August 2026 names "an additional 2 million NVIDIA Blackwell Ultra, Rubin and Rubin Ultra GPUs in 2027-2028"; no Rubin-based EC2 instance family is named or documented as of 20 November 2026. (F08-55)
- Edge as a Kubernetes node: since 18 November 2026 EKS Hybrid Nodes cap the billed vCPUs at 32 per node; NVIDIA's Jetson Linux is not in the validated list. (F09-116, F09-52)
- G7 rendering capacity has a managed route outside Auto Mode: since 18 November 2026 AWS Deadline Cloud supports EC2 G7 instances in service-managed fleets, g7.2xlarge to g7.48xlarge, On-Demand or Spot. (F09-117)
- SCOPE's text for this section carries no number of its own; the closing table's instance, orchestrator and market columns are [our reading] throughout. (F09-110)

---

## Changes to the approved 26-section plan

The plan approved on 2026-11-19 stands at 26 sections in the same order. Changes are recorded here with the reason;
C4 to C12 are changes of content inside a section that the research forced; no section was added, removed or moved.

| # | Change | Reason |
|---|---|---|
| C1 | The "I want world models" route gains sections 3 and 4 (was 1, 2, 6, 7, 16, 22). | Section 7's planner outputs an action and its predictor takes one in; a reader who skipped 3 and 4 meets "action", "chunk" and "control rate" undefined, which the explaining-concepts standard forbids. |
| C2 | Section 7 is titled "JEPA: Predicting in Latent Space" (was "JEPA"). | A bare acronym in a heading is the first place the reader meets it; the title now says what it does. |
| C3 | Sections 22 and 23 carry an explicit condition on the profiling project's results. | Only CPU stand-in workloads on two edge machines exist today, one run per kernel in each of two passes, with no repeat of the same binary (F08-73); no EC2 measurement exists. |
| C4 | Section 13 teaches the ray-tracing rule with its scope: RT cores are required for RTX rendering and for Isaac Sim, and headless physics on the Newton backend runs without them. EC2 G7 joins the list of RT-core families. | Isaac Sim 6.2.0: "GPUs without RT Cores (A100, H100) are not supported" (F06-52). Isaac Lab 3.0: "Headless Newton simulation does not require RTX hardware" (F06-51). The AWS list of June 2026 predates G7 (F06-60). The plan's line "which simulators require them" stays; the seed's blanket rule goes. |
| C5 | Section 7's model line runs to V-JEPA 2.1 and RoboJEPA, and its planning-cost figures are shown per GPU. | V-JEPA 2.1 (2026-03-16) and RoboJEPA (2026-10-07) are newer than V-JEPA 2-AC (F03-72, F03-75). The 16 seconds per action is on an RTX 4090; the same settings take 3 seconds on an A100 (F03-25, F03-74). LeWorldModel's paper names no GPU for its training or timing (F03-31, F03-41). |
| C6 | Section 6 presents GR00T 2 as the current world-action model, built on Cosmos-Predict2.5-2B, and labels it as a whitepaper without released code. DreamZero stays as a compared model. | The whitepaper states the base model and "Available in December" for code (F03-104). The seed had GR00T 2 building on DreamZero. |
| C7 | Section 14's worked case is MuJoCo Playground 1.0's SO-101 pick-cube task and its system identification script. Section 12 lists Playground beside the simulators. | A first-party sim-to-real pipeline for the dive's own arm shipped on 2026-11-06 (F06-25, F06-26, F06-30). No success rate is published for it, and the section says so. The shipped task picks the cube up; placing it in a cup is the dive's own extension and is labelled as such. |
| C8 | Section 17 describes LeRobot's remote inference (policy server, Zenoh transport) where the plan assumed asynchronous inference. Section 5 names GR00T N1.7 as the GR00T model LeRobot v0.7.0 supports. | v0.7.0 removed the asynchronous inference module and N1.5 support (F07-25, F02-47). |
| C9 | Section 10 cites no throughput figure for Cosmos Curator. The 195 seconds per video-hour figure appears only as a dated figure from a March 2025 post about NeMo Video Curator. | The seed attributed that figure to Cosmos Curator; the source never names it (F05-78). |
| C10 | Section 24 adds four items announced in November 2026: Nitro Sandboxes for EKS pods (CPU only), EKS Auto Mode resource optimization (preview), GPU functions on Lambda Managed Instances, and EC2 G7 in Deadline Cloud. Section 19 uses the sandbox as the isolation boundary for agent-written code and states that it cannot hold a GPU. | F09-43, F09-45, F09-46, F09-117, F09-118. The owner asked for the first two from memory; both were verified with their limits. |
| C11 | Section 25's closing table carries a capacity-market column that separates "can be reserved for a window" from "On-Demand, Spot and Savings Plans only". | Capacity Blocks list P and Trainium types only and the training plans list has no G family (F09-91, F09-35), so the simulation and rendering rows cannot use the reservation the training rows use. |
| C12 | Section 6's side-by-side drops memory and "time per predicted second" as fixed columns; section 7 names five ways to block collapse, three in depth; section 15 describes pretraining as days on tens to hundreds of GPUs; section 11 names Cosmos 3. | Cosmos3-Nano's memory need is not published (F03-105) and its rollout length is not stated (F03-99). The register records five mechanisms (F03-70, F03-71). Published pretraining runs are 120 hours on 256 GPUs for GR00T N1.7 and about 4 days on 64 A100s for X-VLA (F02-39, F02-71). Cosmos 3 superseded the 2.5 models (F05-95). |

## Sibling dives

- **Learning From Feedback** (`rl-agentic-loops`): owns reinforcement learning basics, policy gradients, reward
  design, agentic learning loops in text. Sections 8 and 19 link there.
- **LLM Training Systems** (`llm-training-systems`): owns distributed training, data loading at scale, checkpointing.
  Section 15 links there.
- **Silicon, Memory and Inference** (`silicon-memory-inference`): owns how a GPU and memory hierarchy execute a
  model. Sections 20 and 21 link there.
- **EFA** (`efa`): owns the network fabric for multi-node training. Sections 15 and 24 link there.
- **vLLM** and **SGLang**: own language-model serving. Section 19 links there for the agent's own model.

## Out of scope

Autonomous vehicles except as a labelled precedent; humanoid whole-body control beyond one paragraph; robot
hardware design; safety certification; company and market surveys; any measurement the dive would have to run itself.
