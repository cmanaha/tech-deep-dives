# Diagram plan: Physical AI

Written 2026-11-20 for the build. Every diagram the dive draws: the section, the mental model it carries, the
rendering tool, static or animated, and what an animation shows step by step.

## 1. The contract (applies to every diagram)

**Tools.** Inline SVG for every diagram and every chart. Charts use the small scale helpers in `src/lib/scale.ts`
in place of D3: no dive in this repository ships D3, and the brief forbids a new heavy dependency. React Flow is
not used: no diagram here needs pan, zoom or automatic layout, and the largest graph (the 26-section map) is a
fixed grid. Tables that are really tables are Cloudscape `Table` or `ColumnLayout`, never drawings.

**SVG.** Literal `viewBox`, `role="img"`, `aria-labelledby="<slug>-title"` with a matching `<title id>`; a `<desc>`
where the picture needs more than its title; `style={{ width: '100%', height: 'auto' }}`; a light background rect
painted first; `fontFamily="sans-serif"`; text at least 12 viewBox units. Slugs are prefixed with the section id.

**Colour.** One palette across the dive so the machine parts read the same everywhere:

| Meaning | Fill | Stroke or text |
| --- | --- | --- |
| CPU cores | `#e8f1fb` | `#1f5fa8` |
| Memory (bandwidth, latency, capacity) | `#efe9fb` | `#5b3fa8` |
| GPU tensor cores (training, inference) | `#e6f6ea` | `#1e7b3a` |
| GPU ray-tracing cores (rendering) | `#fdeedd` | `#a85a0a` |
| GPU video engines (encode, decode) | `#fde8ef` | `#a8274f` |
| Storage and network | `#eef0f2` | `#44505c` |
| The robot, the real world | `#fff6d6` | `#7a5c00` |
| Neutral box | `#ffffff` | `#5f6b7a` |
| Emphasis (the thing this step is about) | `#0972d3` stroke 2.5 | |
| Body text in figures | | `#16191f` |

Colour is never the only carrier: every coloured box also has a text label.

**Phones.** Text painted under 8.5 px tall at 390 px is a finding. Draw narrow (viewBox about 400 wide) and stack
vertically, or give the `Figure` a `minWidth` so it scrolls inside its own box. No page-level sideways scroll.

**Wrappers.** `Figure` (static) and `AnimatedFigure` (animated), both from `src/components/Figure.tsx`. Each takes
`cites` (the register entries behind every number drawn) and a caption that says how to read the figure.

**Animation rules.** Motion is used only where it carries the idea: something travels, repeats on a clock, narrows
or converges, or is split step by step. Every animation starts paused, plays once, has Play, Pause, Back, Step and
Reset buttons reachable by keyboard, a text caption per step, and under `prefers-reduced-motion` shows its final
step with no timed playback. Each step is a legible still frame. 4 to 9 steps; more than 9 means the idea should be
split.

**Charts.** Labelled axes with units, sources named in the caption through `cites`, and one sentence under the
chart saying how to read it. Log axes say "log scale". Bars and points carry their value as text.

**Verification.** After authoring: `revamp/tools/check-section.mjs` at 1440 and 390 px probes every diagram and
every animation step for overlapping text, text outside its box, clipping and tiny text, and the author reads every
PNG.

## 2. The diagrams, section by section

Type: S = static inline SVG, A = animated inline SVG, C = chart (inline SVG with scales), T = Cloudscape table or
layout. 51 figures, 17 of them animated.

| # | Section | Diagram | Mental model it carries | Type |
| --- | --- | --- | --- | --- |
| 1.1 | 1 One Robot, One Loop | The loop: eight stages in a ring around the arm, each tagged with the machine part it loads | Physical AI is a loop of unlike workloads sharing one robot | A |
| 2.1 | 2 Getting Started | The 26 sections as a grid in eight parts, with the three reading routes drawn over it (a selector highlights one route) | Where each idea is built and the shortest route for your reason | S (interactive selector, no motion) |
| 3.1 | 3 The Robot as a Computer | The arm with its sensors and actuators labelled: six servos, encoders, wrist and overhead camera, the serial bus, the host | A robot is inputs (state, images) and outputs (joint targets) | S |
| 3.2 | 3 | The rate ladder: servo loop, host writing goals at 30 Hz, policy called once per chunk | Three loops at three rates, each feeding the next | A |
| 3.3 | 3 | Delay to distance: gripper travel against delay at the illustrative working speed | Latency is distance: speed times delay | C |
| 4.1 | 4 Learning From Demonstrations | A trajectory drifting off the demonstrated band, step by step, then the same with chunks | Errors compound over steps; chunks shorten the horizon | A |
| 4.2 | 4 | Two valid ways around an obstacle and their average | Averaging modes gives an action nobody demonstrated | S |
| 4.3 | 4 | A flow-matching head turning noise into an action chunk over its integration steps | A generative head samples one valid way | A |
| 5.1 | 5 Vision-Language-Action Models | One VLA as blocks: cameras and text into the backbone, state into the action head, a chunk out, with shapes on the arrows | Backbone plus action head | S |
| 5.2 | 5 | Two clocks: the slow system updating a plan, the fast system emitting actions | Two rates in one model | A |
| 5.3 | 5 | Release timeline of the current model lines, 2025 to November 2026 | What is current, and what has code | S |
| 6.1 | 6 World Models | Same frame and action into two families: pixels out against a latent vector out | Predict the future in pixels, or in a learned summary | A |
| 6.2 | 6 | Five uses by two families (matrix) | Which family fits which use | T |
| 6.3 | 6 | Time per imagined candidate on a log axis, each bar with its GPU | Orders of magnitude between families, not like for like | C |
| 7.1 | 7 JEPA | Frames to tubelets to tokens to latents, with real shapes | What the encoder sees and emits | S |
| 7.2 | 7 | The JEPA training step: context encoder, predictor, target encoder, loss in latent space, gradient path, stop-gradient, EMA update | Encode, predict in latent space, compare; only one branch learns | A |
| 7.3 | 7 | Collapse: every input mapped to one point, against a spread latent space | The shortcut that makes the loss zero and the model useless | S |
| 7.4 | 7 | Planning with the cross-entropy method: sample action sequences, imagine each in latent space, score against the goal latent, keep the best, refit, repeat | Plan by searching actions inside the model | A |
| 7.5 | 7 | Predictor passes per decision for four planners, log axis | What a planned action costs | C |
| 8.1 | 8 RL for Robots | Three lanes: simulator, pretrained policy, real robot; what is plentiful and what is scarce in each | Same algorithm family, three different bottlenecks | S |
| 9.1 | 9 Collecting Data | One episode exploded into its files and columns: Parquet rows, MP4 files, metadata | Data is rows plus video | S |
| 10.1 | 10 Processing and Curating | The curation graph with CPU and GPU stages coloured by machine part | The data path has its own machine | S |
| 10.2 | 10 | Decode bounding a training step: frames queue at the CPU decoder while the GPU waits | Why a trainer can be CPU-bound | A |
| 10.3 | 10 | Codec by GPU support matrix | Pick codec and instance together | T |
| 11.1 | 11 Augmentation | One recorded episode fanning out three ways, each lane tagged with the machine part and the published cost | Three ways to get more data, three different machines | S |
| 12.1 | 12 Physics Simulation | One physics step: position, velocity, force and acceleration stages, then integrate, with the arm's state updating | A step is a small solve | A |
| 12.2 | 12 | Steps per second: CPU core against GPU batch, log axis, sources labelled | Parallel worlds are the GPU's job | C |
| 13.1 | 13 Rendering | Rasterising a triangle against tracing a ray through a pixel, bounce and shade | Two ways to make an image; one needs a different engine | A |
| 13.2 | 13 | A GPU as separate engines (tensor, ray tracing, video encode, video decode, memory) with a workload selector that lights the engine each uses. Shared component, reused in section 20 | Two kinds of GPU work on one card | S (interactive selector) |
| 13.3 | 13 | What one camera costs: throughput and memory with and without a camera | Rendering, not physics, sets the fleet size | C |
| 14.1 | 14 Sim-to-Real | The gap as two distributions; randomisation widens the simulated one until it covers the real one; a scan moves it onto the real one | Make the real world a sample from training, or training a copy of the real world | A |
| 15.1 | 15 Training at Three Scales | Named runs on one log axis of GPU-hours, in three bands | Which size is yours | C |
| 16.1 | 16 Evaluation | Open loop against closed loop as two block diagrams | The policy's actions change what it sees next | S |
| 16.2 | 16 | The evaluation ladder from cheap to trusted, with the published correlation at each rung | What each rung can and cannot tell you | S |
| 16.3 | 16 | Two confidence intervals from 50 trials each, overlapping | How many trials it takes | C |
| 17.1 | 17 Running on the Robot | The latency budget bar from frame capture to motor command | The budget | C |
| 17.2 | 17 | Chunks against the control clock: a slow model keeps a fast loop fed, and what happens when inference takes longer than the refill window | Chunking buys time; it has a limit | A |
| 17.3 | 17 | What runs on the Jetson: Greengrass nucleus, components, the policy container, the camera and servo drivers | The device is a managed computer | S |
| 18.1 | 18 The Fleet | A new policy travelling from S3 through a deployment to a canary group, a gate, then the fleet, with an abort | Rollout is stages with gates | A |
| 18.2 | 18 | Episodes travelling back: device disk, upload, S3, training, and the loop closing | How the loop closes | A |
| 19.1 | 19 Agents Running the Loop | The agent loop: agent, GPU queue, robots, grader, with what the agent may touch | The agent is a new kind of tenant | S |
| 19.2 | 19 | Utilisation and time to success against the number of agents | Eight robots do not buy 8x | C |
| 20.1 | 20 Fifteen Workloads | Workload by machine-part heat matrix | The map | S (HTML grid with text in every cell) |
| 21.1 | 21 PMU Cards | A pipeline with slots flowing each cycle into four buckets, decided by two questions | Four places a slot can go | A |
| 21.2 | 21 | A sample card with its parts labelled | How to read a card | S |
| 22.1 | 22 Our Measurements | One card per stand-in workload per machine, stacked bars of the four categories | The cards filled in | C |
| 23.1 | 23 Price-Performance | Units of work per second per workload on the two edge machines | One unit per workload | C |
| 24.1 | 24 Orchestrating on AWS | Jobs of five shapes leaving a queue and landing on Batch, HyperPod and EKS | Scheduler times capacity market | A |
| 24.2 | 24 | The control plane: who decides placement, who provides nodes, where capacity comes from | Three layers that are chosen separately | S |
| 24.3 | 24 | Capacity markets by instance family | What can be reserved | T |
| 25.1 | 25 Choosing | The decision path from workload to machine, scheduler and market | The decision | S |

## 3. Animation scripts

Each line is one step. The caption text is written by the section author in plain words; the list fixes what the
frame shows.

**1.1 One episode through the loop.** (1) The arm, a block, a cup: a person teleoperates one episode. (2) The
episode lands on disk as rows plus video. (3) Processing and curating: decode, filter (CPU and video engines lit).
(4) Augmentation and simulation multiply it (ray-tracing cores lit). (5) Training a policy (tensor cores lit).
(6) Evaluation, in simulation and on the arm. (7) Export and deploy to the device by the arm. (8) The arm runs the
policy; what it does becomes the next episodes, and the ring closes.

**3.2 The rate ladder.** (1) The servo's own position loop holds a target. (2) The host writes a new goal every
33.3 ms. (3) The policy is called and returns a chunk of 50 actions. (4) The host plays the chunk one action per
tick while the policy is idle. (5) The chunk runs out after 1.67 s and the policy is called again.

**4.1 Compounding error and chunks.** (1) The demonstrated band and a policy starting inside it. (2) A small error
at one step. (3) The next observation is slightly outside the data; the next action is worse. (4) The drift grows
until the gripper misses the block. (5) Reset: the same policy predicting a chunk of actions at once. (6) Fewer
decisions are taken across the same motion, so fewer chances to drift. (7) The chunked path stays in the band.

**4.3 Flow matching to an action chunk.** (1) A chunk of pure noise: scattered points over time. (2) to (5) Each
integration step moves every point along the learned velocity field. (6) The points have become a smooth
trajectory to the cup. Caption notes the step count of the cited model.

**5.2 Two clocks.** (1) Camera frames and the instruction enter the slow system. (2) It emits a plan or
conditioning once. (3) to (5) The fast system emits several actions per slow tick, reusing the last plan. (6) The
slow system updates and the fast system picks up the new plan without stopping.

**6.1 Two families.** (1) One camera frame and one action enter both models. (2) The pixel model encodes to a
compressed space. (3) It denoises there over many steps. (4) It decodes a full frame: every pixel, shadows and
texture included. (5) The latent model encodes the frame into a short vector. (6) Its predictor outputs the next
vector in one pass; no image is made. (7) Side by side: an image a person can inspect against a vector a planner
can score.

**7.2 One JEPA training step.** (1) A clip is cut into tokens; some are masked. (2) The context encoder sees only
the visible tokens. (3) The target encoder, a slowly moving copy, sees the whole clip. (4) The predictor fills in
latents for the masked positions. (5) The loss compares predicted and target latents: no pixel is drawn.
(6) Gradients flow back through the predictor and the context encoder only; the stop-gradient blocks the target
branch. (7) The target encoder's weights move a small fraction toward the context encoder's (the EMA update).

**7.4 Planning with the cross-entropy method.** (1) The current frame and the goal image are encoded into latents.
(2) Sample many candidate action sequences from a wide distribution. (3) The predictor imagines where each one
ends, in latent space. (4) Score each by distance to the goal latent. (5) Keep the best few. (6) Refit the
sampling distribution to them: it narrows. (7) Repeat: the cloud of imagined endpoints tightens on the goal.
(8) Execute the first action of the best sequence, then plan again.

**10.2 Decode bounds the trainer.** (1) Compressed video sits on disk. (2) Dataloader workers on CPU cores decode
frames. (3) Batches queue for the GPU. (4) With few cores per GPU the queue runs empty: the GPU waits. (5) With
more cores per GPU, or decode on the GPU's video engine where the codec is supported, the queue stays full.

**12.1 One physics step.** (1) The state: joint positions and velocities. (2) Position stage: where every body is,
which pairs touch. (3) Velocity stage. (4) Force and acceleration stage: actuator forces, then the constraint
solve that stops bodies passing through each other. (5) The integrator advances time by one timestep. (6) The new
state; repeat hundreds of times per simulated second.

**13.1 Raster against ray.** (1) A scene: block, cup, a light, a camera. (2) Rasterising: project each triangle
onto the image and fill it. (3) Tracing: shoot a ray through one pixel. (4) It hits the block; a second ray goes to
the light and is blocked by the cup: shadow. (5) Repeat for every pixel of every camera of every environment.

**14.1 Closing the gap.** (1) Two distributions that barely overlap: what the simulator produces and what the
bench produces. (2) Domain randomisation widens the simulated one. (3) It now covers the real one: the bench is one
more variation. (4) Reset: real-to-sim moves the simulated distribution onto the real one by building the scene
from a scan and fitting the servo parameters.

**17.2 Chunks against the control clock.** (1) The control clock ticks; a chunk is playing. (2) With playback
remaining at the refill threshold, the next inference is requested. (3) The robot keeps moving on the old chunk
while the model computes. (4) The new chunk arrives and playback switches at the join. (5) The slow case:
inference takes longer than the playback that remains. (6) The queue runs dry and the arm stops and waits.

**18.1 Staged rollout.** (1) A new policy version in S3 and a component version that references it. (2) A
deployment targets the canary thing group. (3) Each canary device downloads, the running component is asked, the
new one starts. (4) The gate: health reported back. (5) Rollout widens at an increasing rate. (6) The abort case:
failures cross the threshold and queued devices are cancelled; devices already updated stay updated.

**18.2 Episodes back.** (1) The arm finishes an episode; rows and video sit on the device disk. (2) An upload
component sends the files to S3 at the episode boundary. (3) They join the dataset. (4) Curation and training run
on them. (5) A new policy version is published. (6) It returns to the arm through the rollout: the loop has closed.

**21.1 Where slots go.** (1) A core's pipeline: front end, back end, retirement; a fixed number of slots per
cycle. (2) A slot that receives a micro-operation which retires: retiring. (3) A slot that receives one which is
thrown away after a mispredicted branch: bad speculation. (4) A slot that receives nothing because the front end
had nothing ready: front-end bound. (5) A slot that receives nothing because the back end could not accept it:
back-end bound. (6) All slots of a run sorted into the four buckets: the top-down breakdown.

**24.1 Jobs landing.** (1) A queue holding five job shapes. (2) Thousands of short independent jobs (simulation,
rendering, evaluation) go to an AWS Batch array job. (3) A multi-day multi-node training job goes to a HyperPod
cluster on reserved capacity. (4) A long-lived mixed fleet with sharing between teams goes to EKS with a queueing
layer. (5) Each landing shows the capacity market under it. (6) The queue is empty; the compute that scaled to
zero is shown as gone.
