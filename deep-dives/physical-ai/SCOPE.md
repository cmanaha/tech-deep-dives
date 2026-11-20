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
planned diagram, the registers that feed it. Numbers and their register IDs are in "Numbers by section" below, added
at integration.

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
on parameters, memory and time per predicted second, from first-party figures.
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
shortcut where every input maps to one point, and the three ways to block it (a slowly moving target encoder with a
stop-gradient, variance and covariance terms, a regulariser that shapes the latent distribution). Planning in latent
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
Generative augmentation with a world model (Cosmos Transfer and Predict at their current versions, with memory and
time per clip).
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
multi-node pretraining (weeks, done by the labs). Published figures for each. Links to the LLM Training Systems dive
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
Content: depends on 3 and 5. The devices at current versions and prices: Jetson Orin, Jetson Thor, DGX Spark. The
latency budget from camera to motor. Real-time chunking: how a slow model keeps a fast loop fed. Quantisation.
TensorRT engines and why one is built per device type.
Gives: practical (device choice, export path) and mental model (the budget).
Diagram: a latency budget bar from frame capture to motor command; a device table; D3 and Cloudscape.
Registers: 07.

**18. The Fleet**
Payoff: Know how a new model reaches a hundred robots safely and how their episodes come back.
Content: delivery and staged rollout with the AWS services that exist for it today, and what replaced the retired
robot-specific ones. Episode upload: what to send and what to keep. How the loop closes.
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
Spark, one run each. The separate profiling project adds the real workloads (ACT, SmolVLA, LeWorldModel, decode,
simulation with the SO-101 model) and the EC2 families. Every figure carries its run count.
Gives: practical (measured numbers) and mental model (the cards from 21 filled in).
Diagram: one card per workload per machine; D3.
Registers: 08; `research/experiments/`.
Condition: ships with the stand-ins labelled as such if the profiling project has not delivered by build time.

**23. Price-Performance and Latency**
Payoff: Compare machines on one unit of work per workload.
Content: the unit of work per workload (simulation steps, clips embedded, training samples, actions). Units per
dollar-hour for cloud instances; watts and purchase price for edge devices. Latency percentiles where the workload
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

## Changes to the approved 26-section plan

The plan approved on 2026-11-19 stands at 26 sections in the same order. Changes are recorded here with the reason;
the integration pass adds any that the research forced.

| # | Change | Reason |
|---|---|---|
| C1 | The "I want world models" route gains sections 3 and 4 (was 1, 2, 6, 7, 16, 22). | Section 7's planner outputs an action and its predictor takes one in; a reader who skipped 3 and 4 meets "action", "chunk" and "control rate" undefined, which the explaining-concepts standard forbids. |
| C2 | Section 7 is titled "JEPA: Predicting in Latent Space" (was "JEPA"). | A bare acronym in a heading is the first place the reader meets it; the title now says what it does. |
| C3 | Sections 22 and 23 carry an explicit condition on the profiling project's results. | Only CPU stand-in workloads on two edge machines exist today, one run each; no EC2 measurement exists. |

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
