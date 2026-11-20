# Section architecture: Physical AI

Written 2026-11-20 for the build. Per section: the h2 blocks in reading order, each with its payoff line (it becomes
the h2 description), the register entries the block cites, the diagrams (numbers refer to `diagram-plan.md`), and
the links to sibling dives. `SCOPE.md` "Numbers by section" holds the figure behind each ID; this file fixes the
shape. An author may merge two adjacent h2 blocks or reword a payoff line, and may leave out an entry that does not
earn its place; an author may not add a block the plan does not have, reorder the concept sequence, or print a
number without an entry.

Owner decisions that bind every section: GR00T 2 is taught as current, labelled as a whitepaper whose code is not
yet released, with GR00T N1.7 as the newest downloadable model; no dollar figures anywhere; placeholders only in
17, 18, 22, 23 and 24; the thread task wording comes from `src/lib/task.ts`; the reservation claim keeps its scope
and date.

Strongest number (SN) is the figure the section lands at least twice.

---

## Part 1. Framing

### 1. One Robot, One Loop (`one-loop`, OneLoop.tsx)
h1 payoff: See the whole loop on one arm before any part is explained, and know which question each part answers.
1. **The bench** - "What is on the table": the SO-101 follower arm, a block, a cup, two cameras, a laptop; the task.
   No figures. (F01-8, F01-26 for the arm's facts if any are stated.)
2. **The loop in one pass** - "Follow one episode around the ring": collect, process and curate, augment, simulate,
   train a policy, train a world model, evaluate, export and deploy, collect again. Diagram 1.1 (animated).
3. **Why it is fifteen workloads** - "The thesis: the stages share a robot and almost nothing else": each stage loads
   a different part of the machine, and that part decides the instance family, the capacity market and the
   scheduler. Plain words; the count is the dive's own grouping (F08-75, F08-78 as our reading).
4. **Nine questions** - "Find the section that answers yours": the nine questions with section numbers (table).
Figures are left to the sections that define their terms. No SN. Links: none.

### 2. Getting Started (`getting-started`, GettingStarted.tsx)
h1 payoff: Four ideas to hold, and the shortest route for the reason you are reading.
1. **Who this is for** - "What is assumed and what is built here": the reader, what the dive skips, links to the
   sibling dives that own training, RL basics, silicon and the network fabric.
2. **Four ideas to hold** - "The foundation every later section stands on": (a) a policy is a function from what the
   robot senses to what it does next, run many times a second; (b) an episode is one recorded attempt, a table of
   timestamped observations and actions plus video; (c) training happens in the cloud or on a workstation, acting
   happens on the robot, and a model must cross that gap; (d) the machine has parts that saturate separately: CPU
   cores, memory, the GPU's tensor cores, its ray-tracing cores, its video engines, storage and network.
   One short paragraph each, with the smallest real example (F01-26, F01-28 for the episode; F08-50 for the parts).
3. **Where each idea is built** - "The prerequisite map": concept, owning section.
4. **Three routes** - "Pick the route for your reason": world models 1, 2, 3, 4, 6, 7, 16, 22; pipeline 1, 2, 3,
   9 to 18; compute 1, 2, 20 to 25. Diagram 2.1 with a route selector. How sections feed each other.
Prose first. Links: rl-agentic-loops, llm-training-systems, silicon-memory-inference, efa (all four are allowed here).

### 3. The Robot as a Computer (`robot-computer`, RobotAsComputer.tsx)
h1 payoff: Know what the arm senses, what it can be told to do, how often, and why 100 milliseconds is a distance.
1. **Scene: a leader arm in the hand** - "What teleoperation looks like": leader, follower, what moves.
2. **What goes in: sensors** - "Two kinds of input": joint encoders and proprioception; wrist and overhead cameras.
   (F01-8, F01-26, F01-30, F01-84, F01-86.) Diagram 3.1.
3. **What comes out: actions** - "What the arm can be told": a servo as a motor with its own position controller
   (F01-16, F01-45, F01-42); degrees of freedom; joint space against end-effector space; absolute against relative.
4. **How often: the rate ladder** - "Three loops at three rates": servo loop, host at 30 Hz, policy once per chunk
   (F01-28, F01-81); the planner and controller split, with one published full ladder as the wider case (F01-73,
   F01-72). Diagram 3.2 (animated).
5. **Worked example: delay is distance** - "Turn milliseconds into millimetres": one tick 33.3 ms; at the
   illustrative 0.25 m/s, 8.3 mm per tick, 25 mm in 100 ms, 62.5 mm in 250 ms (F01-83); the speed ceiling (F01-82);
   encoder step and backlash as the floor (F01-84). Diagram 3.3.
6. **What it costs** - "Tiny state, heavy video, and a deadline": 55.3 MB/s raw video against 1,440 bytes per second
   of state and action (F01-86); one published policy call per device as the deadline's other side (F01-74).
SN: 100 ms is 25 mm at 0.25 m/s (illustrative speed). Links: none needed.

## Part 2. The models

### 4. Learning From Demonstrations (`demonstrations`, LearningFromDemonstrations.tsx)
h1 payoff: Understand why copying a demonstrator fails in a specific way, and the two ideas that fixed it.
1. **Scene: fifty episodes** - (F02-10, F02-67.)
2. **Behaviour cloning** - "Supervised learning on (observation, action) pairs": what the pairs are on the arm.
3. **Why copying drifts** - "A small mistake moves the robot to a state the data never showed": compounding error;
   the T squared times epsilon bound as a worst case from the history paper, with a toy worked example (F02-2).
   Diagram 4.1 (animated, first half).
4. **Action chunking** - "Predict a short run of actions at once": ACT (Action Chunking with Transformers) as the
   worked case; k = 100 at 50 Hz is 2 seconds; the ablation 1% to 44% (F02-6); LeRobot's defaults (F02-11, F02-12).
   Diagram 4.1 (second half).
5. **Several right answers** - "Why averaging two good demonstrations gives a bad action": modes. Diagram 4.2.
   Then how a generative head samples one way: diffusion (F02-16, F02-17) and flow matching (F02-20). Diagram 4.3
   (animated). Tokenised actions (FAST) in an ExpandableSection (F02-25, F02-26, F02-27).
6. **What each costs** - "Train on one GPU, run inside a control period": ACT (F02-9); diffusion (F02-16); pi0's
   stage timings (F02-21, F02-22). Points to section 15 and 17.
SN: 1% to 44% success with chunking (ACT ablation, author reported). Links: none.

### 5. Vision-Language-Action Models (`vla`, VisionLanguageAction.tsx)
h1 payoff: Read any 2026 robot-model announcement and know what the backbone, the action head and the two rates are.
1. **Scene: an instruction in words** - the same arm, told what to do in a sentence.
2. **What a VLA is** - "A vision-language backbone plus an action head": inputs, outputs, shapes; pi0 as the
   clearest picture (F02-32). Diagram 5.1.
3. **Two clocks** - "A slow system that reasons and a fast one that moves": GR00T N1's named rates as the origin
   (F02-33); GR00T 2's ladder as current (F02-44, F02-45). Diagram 5.2 (animated).
4. **The current lines, November 2026** - "What is current, and which have code you can download": the pi0 line to
   pi0.7 (F02-51, F02-52, F02-53); the GR00T line: N1.7 newest with weights (F02-37, F02-38, F02-40), GR00T 2 taught
   as current and labelled whitepaper, code due in December (F02-44, F02-45); SmolVLA (F02-58, F02-60); OpenVLA-OFT
   (F02-68); Gemini Robotics 2.5 (F02-74). Diagram 5.3. Details per line in ExpandableSections.
5. **Which can be fine-tuned for the arm today** - "Where to start on an SO-101": LeRobot v0.7.0's policy list
   (F02-65 and the wave 3 entries that complete it; F02-47 for what was removed).
6. **What it costs** - "Publisher's figures for training and for one action": pointers into 15 and 17, with the
   N1.7 stage timings (F02-40) and pi0.7 serving (F02-52).
SN: SmolVLA's 90% in distribution against ACT's 70% on the SO-101 pick-place task with 50 demonstrations (author
reported, F02-60), or the two rates; author's choice, stated in the claims file. Links: none.

### 6. World Models: Predicting What Happens Next (`world-models`, WorldModels.tsx) - deep treatment
h1 payoff: Know what a world model is for, and the one design choice that separates the two families.
1. **Scene: the arm about to push the block** - what will the camera show next?
2. **The idea** - "A model that answers: if I do this, what happens": next state from current state and action;
   state, action, rollout defined; why a policy alone cannot answer the question.
3. **Five uses** - "What people do with the answer": planning, training a policy in imagination, generating data,
   scoring a policy without a robot, acting directly (world-action models) (F03-88, F03-93). Diagram 6.2 (matrix).
4. **Family one: generate pixels** - "Predict the next frames themselves": how a video generator works at the level
   of compress, denoise, decode (F03-96); Cosmos 3 (F03-94, F03-98, F03-99); Genie (F03-100, F03-101); Dreamer 4
   (F03-90); the 1X World Model (F03-102). What you get: something a person can watch.
5. **Family two: predict in a latent space** - "Predict a summary of the next frame": why predicting every pixel
   spends capacity on detail that cannot be predicted, and what is given up. Hands over to section 7.
   Diagram 6.1 (animated).
6. **World-action models** - "A world model that also outputs the action": GR00T 2 as current, built on
   Cosmos-Predict2.5-2B, whitepaper, code due in December (F03-104); DreamZero (F03-103).
7. **Worked example: one imagined candidate** - "What it costs to imagine one future": the per-candidate times, not
   like for like, each with its GPU (F03-118, F03-25); parameters side by side (F03-117). Diagram 6.3.
8. **What it costs, and which family fits which use** - compute by family; memory only where a first-party figure
   exists (F03-105 and the wave 3 Cosmos memory result); ends on the choice.
SN: 16 seconds per planned action in latent space against 4 minutes with a video model, on one RTX 4090 (author
reported, F03-25). Links: none.

### 7. JEPA: Predicting in Latent Space (`jepa`, Jepa.tsx) - deepest treatment
h1 payoff: Follow a JEPA from pixels to a planned action, and explain why it does not collapse.
1. **Scene: two frames, one patch hidden** - what would you need to know to fill it in?
2. **The idea** - "Encode, predict the hidden part's latent, compare latents": JEPA (Joint-Embedding Predictive
   Architecture) in plain words: encoder, predictor, latent, loss in latent space; why no pixel is drawn.
3. **Worked example: from a clip to latents** - "The real shapes": tubelets of 2 frames by 16 by 16 pixels (F03-3);
   a 16-frame 224 by 224 clip is 8 x 14 x 14 = 1,568 tokens (F03-59, history); encoder sizes (F03-1, F03-4).
   Diagram 7.1.
4. **One training step** - "Which branch learns": masking (F03-9); context encoder, target encoder as an EMA
   (exponential moving average) copy with m = 0.99925 (F03-8), the formula decomposed; stop-gradient; the loss.
   Diagram 7.2 (animated).
5. **Collapse, and how to block it** - "The shortcut that zeroes the loss": Diagram 7.3. Three in depth: the slowly
   moving target with a stop-gradient (F03-65, F03-8); variance and covariance terms (F03-67); a regulariser that
   shapes the latent distribution, SIGReg in LeWorldModel (F03-69, F03-36, F03-37). Two in a paragraph each:
   contrastive negatives as history (F03-70), a frozen pretrained encoder (F03-71).
6. **The line of models** - "From the 2022 position paper to October 2026": I-JEPA and V-JEPA as history; V-JEPA 2
   and its action-conditioned predictor (F03-1, F03-14, F03-15); V-JEPA 2.1 (F03-72, F03-73); RoboJEPA (F03-75,
   F03-76); LeWorldModel read from its code (F03-31, F03-32). Compact; details in ExpandableSections.
7. **Planning in latent space** - "Search over actions inside the model": MPC (model-predictive control) and CEM
   (the cross-entropy method) step by step with the V-JEPA 2 settings: 800 samples, 10 iterations, top 10, horizon
   1 (F03-24); results on the arm tasks (F03-26). Diagram 7.4 (animated).
8. **What a planned action costs** - "Count the predictor passes": 800 x 10 x 1 = 8,000 and the other three
   planners (F03-115); 16 s on an RTX 4090 and 3 s on an A100 for the same settings (F03-25, F03-74); V-JEPA 2.1's
   14 s (F03-73); RoboJEPA's settings (F03-77); LeWM's 0.98 s against 47 s (F03-40, F03-41). Diagram 7.5.
   Training compute pointer to section 15 (F03-119, F03-12).
SN: 8,000 predictor passes per decision, 16 seconds on one RTX 4090 (author reported). Links: none.

### 8. Reinforcement Learning for Robots (`robot-rl`, RobotRl.tsx)
h1 payoff: Know the three places RL is used for robots and what each one waits on.
1. **Scene and one paragraph of RL** - reward, trial, improvement in three sentences; link to the Learning From
   Feedback dive for the algorithms (PPO, GRPO).
2. **Three lanes** - Diagram 8.1.
3. **RL in simulation** - "Thousands of arms at once, waiting on the simulator": 8,192 environments (F04-54); the
   camera's cost (F04-55); the SO-101 pick-cube recipe: 4,096 arms, about 197 million control steps (F04-57,
   F04-58).
4. **RL on top of a pretrained policy** - "Improving a VLA from its own attempts, waiting on rollouts": Recap
   (F04-60, F04-61, F04-64, F04-65); piRL (F04-69); one measured run on AWS without its dollar figure (F04-70,
   F04-71); GR00T 2's real-robot RL result as a vendor claim (F04-68).
5. **RL on the real arm** - "Waiting on the robot, the reset and a person": HIL-SERL (human-in-the-loop sample-
   efficient RL) in LeRobot (F04-76, F04-77), history (F04-72).
6. **What each costs** - what is plentiful and what is scarce per lane; pointer to sections 19 and 20.
SN: about 197 million control steps for the pick-cube recipe (4,096 arms), or 165,000 against 319,000 steps per
second; author's choice. Links: rl-agentic-loops (one).

## Part 3. The data

### 9. Collecting Data (`collecting`, CollectingData.tsx)
h1 payoff: Know what an episode is on disk and what it costs to make one. Depends on section 3.
1. **Three ways to collect** - leader-arm teleoperation, hand-held rigs (F05-8, history), fleets (F05-10). The
   recorder defaults (F05-2, F05-5).
2. **An episode on disk** - "Rows plus video": LeRobot dataset format v3.0 (F05-16); the frame row (F05-23); packing
   limits (F05-20). Diagram 9.1.
3. **A real dataset, weighed** - "86.1 MB for 50 episodes": `lerobot/svla_so101_pickplace` (F05-29); about 775 MB
   per robot-hour against 199 GB uncompressed, one dataset as an example (F05-30).
4. **The codec choice** - "What the default implies for whoever decodes it later": libsvtav1, GOP (group of
   pictures) 2, CRF (constant rate factor) 30 (F05-35); encode load (F05-45); h264 alternative (F05-43); 2024
   benchmark as history (F05-63). Hands over to section 10.
No dollar figures (the vendor price range entry F05-15 is not used). SN: 86.1 MB for 50 episodes; about 257 to 1.

### 10. Processing and Curating (`curating`, ProcessingCurating.tsx)
h1 payoff: See why the first bottleneck in training is often a CPU decoding video. Depends on section 9.
1. **What happens between the robot and the trainer** - decode, filter, embed, deduplicate. Diagram 10.1; Cosmos
   Curator v2.10.0 and its per-stage CPU and GPU shares (F05-68, F05-71); no throughput figure for it (F05-78 only
   as a dated figure about a differently named product, in an ExpandableSection).
2. **Which GPUs can decode which codec** - "The table that turns a codec choice into an instance choice": NVENC and
   NVDEC (the GPU's video encode and decode engines) per card (F05-46, F05-47, F05-48, F05-50, F05-51, F05-52,
   F05-54, F05-49, F08-43, F08-44); the EC2 join (F05-67). Table 10.3.
3. **Why decode can bound a training run** - "The CPU beside the GPU": LeRobot decodes on CPU (F08-77); 24 vCPUs per
   GPU, 12 physical cores (F05-65, F08-57, F08-58); loader defaults and the one decode latency found (F05-61,
   F05-62); moving augmentation to the GPU (F05-59, vendor claim); one input-bound run (F05-76).
   Diagram 10.2 (animated).
4. **Pick codec and instance together** - the reader's next action; how to see it (`nvidia-smi` decoder
   utilisation, F08-31).
SN: 24 vCPUs per GPU. Links: llm-training-systems (data loading), at most one.

### 11. Augmentation and Synthetic Data (`augmentation`, Augmentation.tsx)
h1 payoff: Three ways to get more data than you recorded, and what each one costs. Depends on 6 and 12.
1. **One episode, three ways** - Diagram 11.1.
2. **Image-space augmentation in the dataloader** - (F05-84, F05-87.) Loads: CPU or training GPU.
3. **Demonstration multiplication in simulation** - Isaac Lab Mimic (F05-89, F05-90, F05-91, F05-92); MimicGen as
   history (F05-88). Loads: physics plus rendering.
4. **Generative augmentation with a world model** - Cosmos 3 (F05-95, F05-96, F05-97, F05-98, F03-98, F03-99);
   memory only where printed (F03-105, F05-99 as a dated figure for the superseded model, wave 3 result);
   DreamGen on the SO-100 (F05-102, F05-103). Loads: tensor cores, minutes per clip.
5. **Which kind fits which hardware** - the reader's choice.
SN: 207.78 s per 720p clip on an H100 (vendor claim). Links: none.

## Part 4. Simulation

### 12. Physics Simulation (`physics`, PhysicsSimulation.tsx)
h1 payoff: Know what a physics step is, what it costs, and when it moves from CPU to GPU.
1. **Scene: the arm in MuJoCo.**
2. **The idea** - "A simulator answers: given forces, where is everything one timestep later": state, timestep
   (0.002 s default, F06-10), contact, constraint, integration.
3. **Worked example: one second of the arm** - steps per simulated second from the timestep; the SO-101 pick-cube
   task's own timestep and control step (F06-27 and the wave 3 timestep entries).
4. **The mechanism: one step** - `mj_step`, 26 stages in four groups then the integrator (F06-9).
   Diagram 12.1 (animated).
5. **The simulators, November 2026** - MuJoCo 4.0.1 (F06-1, F06-2), MuJoCo Warp (F06-19), MJX, Newton 1.8.0
   (F06-40), Isaac Sim 6.2.0 and Isaac Lab 3.0.0 (F06-44, F06-45), MuJoCo Playground 1.0 (F06-25). Compact table.
6. **What it costs: from one core to a GPU batch** - our Tier 0 single-run CPU figures (F08-61); first-party CPU
   and GPU figures (F06-15, F06-20, F06-47); memory per world (F06-22). Diagram 12.2.
SN: 57,240 steps per second on one Spark X925 core (our single run, a humanoid model) against 5.77 million on one
GPU at 8,192 worlds (vendor claim). Links: none.

### 13. Rendering and Ray Tracing (`rendering`, Rendering.tsx)
h1 payoff: Understand why a simulator with cameras needs a different GPU than a trainer.
1. **Scene: the policy needs to see.**
2. **Two ways to make an image** - rasterisation and ray tracing, two sentences each. Diagram 13.1 (animated).
3. **Two kinds of GPU work** - "Ray-tracing cores are separate hardware from tensor cores": the GPU as engines
   (F08-43, F06-58, F06-59, F08-36). Diagram 13.2: the shared component `src/components/GpuEngines.tsx`, written by
   this section's author with a `workload` selector, reused by section 20.
4. **Worked example: what one camera costs** - 1,023,698 to 152,124 FPS and 0.93 GB to 57.3 GB (F06-48); the
   manipulation rows (F06-49); the camera resolution from the wave 3 entries; memory ladder (F06-102, F06-63).
   Diagram 13.3.
5. **The rule, with its scope** - "Which simulators need RT cores, in the vendor's words": Isaac Sim 6.2.0
   (F06-52); Isaac Lab 3.0 headless Newton does not (F06-51); a ray tracer written as GPU compute (F06-24).
6. **What it does to the instance choice** - AWS's list with its date (F06-60), G7 and G7e (F08-52, F08-53,
   F08-51), aarch64 (F06-53); the family mapping as our reading (F08-58, F08-85).
SN: one camera per environment costs a factor of 6.7 in throughput and 62 in GPU memory (vendor figures, ratios
derived). Links: silicon-memory-inference (one, optional).

### 14. Sim-to-Real and Real-to-Sim (`sim-to-real`, SimToReal.tsx)
h1 payoff: Know why a policy that works in simulation fails on the bench, and the two ways to close the gap.
1. **Scene: it worked in simulation.**
2. **The gap** - physics, appearance, timing; calibration as a named part (F06-29); it runs both ways (F06-72).
3. **Domain randomisation** - "Vary the simulator so the real world looks like one more variation": the pick-cube
   task's randomisation list (F06-28, F06-27); history (F06-66). Diagram 14.1 (animated, first half).
4. **Worked case: the shipped SO-101 task** - `SO101PickCubeVision` (F06-26, F06-25); what it does and does not
   publish; the pick half only.
5. **Real-to-sim** - system identification: `mujoco.sysid` fits 24 parameters from one episode (F06-30, F06-31,
   F06-6, F06-7); scanned scenes: PolaRiS (F06-73, F06-74), 3DGRUT (F06-75). Diagram 14.1 (second half).
6. **What it costs** - minutes on one GPU for a scan; pointer to 16.
SN: 24 parameters fitted from one teleoperated episode. Links: none.

## Part 5. Training and evaluation

### 15. Training at Three Scales (`training-scales`, TrainingScales.tsx)
h1 payoff: Place any robot-model training job in one of three sizes and know what each asks of the cluster.
Depends on 4 to 7.
1. **Three sizes** - Diagram 15.1.
2. **Per-task adaptation: one GPU** - (F01-90, F02-63, F02-9, F02-46, F02-42, F02-54, F09-81, F09-82, F09-114.)
3. **One-node post-training: eight GPUs** - (F02-28, F09-83, F09-88.)
4. **Multi-node pretraining: the labs** - (F02-39, F02-34, F02-71, F03-97, F03-12, F03-119.) Days on tens to
   hundreds of GPUs in the published figures.
5. **What each asks of the cluster** - memory per GPU, storage, network, reservation (F09-34, F09-30); pointers to
   24 and 25.
No dollar figures (F09-75's cost estimates are not printed). SN: 3.4 hours for 20,000 steps of GR00T N1.7 on one
ml.g7e.2xlarge (AWS's own measurement). Links: llm-training-systems, efa.

### 16. Evaluation (`evaluation`, Evaluation.tsx)
h1 payoff: Know why a falling loss does not mean a working robot, and the three ways to measure what does.
1. **Scene: two checkpoints, one drops the block.**
2. **Open loop against closed loop** - Diagram 16.1; the correlation gap 0.308 against 0.924 (F06-81, history).
3. **Rung one: closed loop in simulation** - (F06-82, F06-87, F06-93, F06-92, F06-83.)
4. **Rung two: scoring with a world model** - (F06-89, F06-90, F06-88.)
5. **Rung three: the real arm, and how many trials** - worked example: 40 of 50 against 45 of 50 (F06-97); trial
   counts in published work (F06-96); LeRobot's Wilson interval (F06-94); the yardstick drifts (F06-91).
   Diagram 16.3.
6. **The ladder** - Diagram 16.2; what it costs per rung; ends on which rung to use when.
SN: r = 0.308 for offline loss against 0.924 for closed-loop simulation (author reported, 2024). Links: none.

## Part 6. The edge

### 17. Running on the Robot (`on-robot`, OnRobot.tsx)
h1 payoff: Fit a policy inside a latency budget on a named device. Depends on 3 and 5.
1. **The devices** - Jetson Orin, Jetson Thor, DGX Spark at current software (F07-36, F07-44, F07-76); no prices.
2. **The budget, from camera to motor** - one policy call per device (F07-1, F07-2, F07-3, F07-5); the measured
   off-board chain (F07-68). Diagram 17.1.
3. **Chunking buys time** - real-time chunking (F07-69); LeRobot remote inference over Zenoh and its refill rule
   (F07-25, F07-26); the limit no setting fixes (F07-22). Diagram 17.2 (animated).
4. **Making the model fit** - quantisation (F07-4, F07-10); TensorRT engines per device type and the compatibility
   mode (F07-77, F07-79, F07-8); GR00T 2 Turbo as a vendor claim (F07-119).
5. **What else runs on the device: the managed side** - AWS IoT Greengrass on the Jetson: the nucleus, components,
   the policy as a container component with GPU access, credentials. From the wave 3 IoT entries. Diagram 17.3.
   One placeholder: the measured footprint on the owner's Jetson and Spark.
SN: 149.0 ms per policy call on Jetson Orin, 4.5 control periods at 30 Hz (vendor claim). Links: none.

### 18. The Fleet (`fleet`, Fleet.tsx)
h1 payoff: Know how a new model reaches a hundred robots safely and how their episodes come back.
1. **From one arm to a fleet** - what changes; the services that exist today and those retired (F07-98, F07-99).
2. **Greengrass and IoT Core in five terms** - thing, core device, component, deployment, thing group; from the
   wave 3 IoT entries (F07-84, F07-85 for versions and footprint).
3. **Delivering a policy** - the 2 GB artifact limit and the route around it (F07-87, F07-54); a component recipe
   (snippet, first-party).
4. **Staged rollout** - jobs, rates, abort (F07-90, F07-92, F07-93, F07-95); a deployment document (snippet).
   Diagram 18.1 (animated).
5. **Episodes back to S3** - what travels over MQTT and what does not (F07-97); S3 multipart (F07-102); stream
   manager or direct upload (wave 3); a published fleet loop's latencies (F07-108, F07-109); sizing model (F07-106).
   Diagram 18.2 (animated).
6. **The hook-up of one Jetson and one Spark** - one placeholder: what will be measured.
"A hundred robots" is an illustration (F07-93, F07-108). SN: 2 GB per component's artifacts against a policy of
about 6 GB. Links: none.

### 19. Agents Running the Loop (`agents`, AgentsLoop.tsx)
h1 payoff: Know what changes when an agent, not an engineer, launches the experiments. Depends on 8.
1. **What the agent does** - ENPIRE's modules, what it may touch, who grades it (F04-5, F04-16). Diagram 19.1.
2. **What it buys** - scaling (F04-18), utilisation (F04-19), tokens (F04-20, F04-22), ideas tried (F04-23).
   Diagram 19.2.
3. **Neighbours** - ASPIRE without its dollar figures (F04-30), "You Don't Need To Stay in The Loop" (F04-36,
   F04-37), RACaP without its dollar figure (F04-42), Eureka as history (F04-39). ExpandableSection.
4. **The agent as a tenant** - the compute it requests; guardrails a scheduler enforces (F04-50); the sandbox as
   the isolation boundary and its limit: no GPU (F09-43, F09-45).
SN: robot utilisation 49.1% with one agent, 29.8% with eight (author reported). Links: rl-agentic-loops, vllm.

## Part 7. The compute

### 20. Fifteen Workloads, Five Shapes (`workloads`, Workloads.tsx)
h1 payoff: One table that says which part of the machine each workload loads.
1. **The parts of the machine** - nine parts plus storage and network (F08-50); the GPU engines figure (13.2).
2. **The fifteen workloads** - for each: what it is in the loop, the part it loads and why, the figure that shows it
   (F08-75 and each stream's compute entries; reuse figures already printed in 3 to 19, cite them again here).
   Diagram 20.1. Details per workload in ExpandableSections grouped by phase.
3. **Five shapes** - duration, coupling, interruptibility (F08-78).
4. **The spans** - GPU memory (F08-45), network (F08-49), storage (F08-46), CPU beside the GPU (F08-57); what "GPU
   utilisation" does and does not say (F08-30, F08-32).
5. **Find your workload** - hands over to 21 to 25.
Our Tier 0 figures appear here labelled single run (F08-61, F08-62, F08-63, F08-66, F08-67). SN: author's choice
from the map, for example the factor of more than 1,000 in network. Links: silicon-memory-inference.

### 21. Reading a Machine: PMU Cards (`pmu-cards`, PmuCards.tsx)
h1 payoff: Read a top-down breakdown and a GPU profile and say what is saturated.
1. **Counters in the processor** - PMU (performance monitoring unit).
2. **Top-down in one picture** - slots, four categories, two questions (F08-2, F08-3). Diagram 21.1 (animated).
3. **Slots per cycle by core** - Intel (F08-8), AMD (F08-11, F08-12), Arm (F08-16, F08-13); the flush correction
   (F08-17, F08-18, F08-19); which EC2 core uses which (F08-56).
4. **Where you can read counters on EC2** - (F08-26, F08-28, F08-21.)
5. **The GPU side** - Nsight Compute, Nsight Systems, DCGM (F08-33, F08-39, F08-32, F08-86).
6. **How to read a card** - Diagram 21.2; hands over to 22.
SN: author's choice (for example 10 slots per cycle on the Cortex-X925 and Neoverse V3). Links:
silicon-memory-inference.

### 22. Our Measurements (`measurements`, Measurements.tsx) - built open
h1 payoff: See measured cards for the arm's workloads on machines we ran.
1. **What was run, and what was not** - two edge machines, CPU stand-ins, one run per pass, two passes (F08-60,
   F08-73).
2. **The cards** - physics step (F08-61), policy stand-in (F08-62, F08-63), camera render stand-in (F08-64),
   capability rows (F08-65, F08-66, F08-67, F08-68). Diagram 22.1. What reproduces and what is not printed (F08-73).
3. **The GPU kernels** - (F08-71, F08-72.)
4. **Limits of these cards** - the missing flush correction (F08-23), report against raw counters (F08-70),
   software versions (F08-73).
5. **What the profiling project will add** - placeholders, one per block: the real workloads (ACT, SmolVLA,
   LeWorldModel, decode, simulation with the SO-101 model); EC2 P, G and Graviton runs; GPU counters.
Every figure says single run and names the machine and software version. SN: 14,507 against 57,240 steps per
second (Jetson A78AE against Spark X925, one core, single run).

### 23. Price-Performance and Latency (`price-performance`, PricePerformance.tsx) - built open
h1 payoff: Compare machines on one unit of work per workload.
1. **One unit of work per workload** - (F08-81.)
2. **The method** - units per second, then per watt for edge and per priced hour for cloud (F08-82 as method, no
   price printed).
3. **What exists today: two edge machines** - units per second (F08-61, F08-62, F08-64); watts (F08-83, vendor
   ranges and our idle readings, no purchase price). Diagram 23.1.
4. **Latency where there is a deadline** - mean only (F08-84); what a percentile needs.
5. **Placeholders** - prices (a dated price pass); EC2 units per second (profiling project); power under load.
No dollar figures: F09-93, F09-75, F09-51, F09-33 prices are not printed. SN: author's choice from the edge rows.

## Part 8. AWS

### 24. Orchestrating It on AWS (`aws-orchestration`, AwsOrchestration.tsx)
h1 payoff: Know what each scheduler is good at and which capacity market each instance family can use.
1. **Three layers, chosen separately** - who decides placement, who provides nodes, where capacity comes from.
   Diagram 24.2.
2. **AWS Batch** - array jobs (F09-5), Spot rules (F09-8, F09-10, F09-11), scale to zero (F09-13), timeouts
   (F04-50). Snippet: a job definition and compute environment for a GPU array job, from a first-party source.
3. **SageMaker HyperPod** - task governance on Kueue (F09-25, F09-26), flexible instance groups and pod density
   (F09-29, F09-115), checkpointless training (F09-30), training plans (F09-34, F09-35). Snippet where first-party.
4. **Amazon EKS: Karpenter and Auto Mode** - versions (F09-38), Auto Mode GPU limits (F09-49, F09-48), Capacity
   Blocks inside Auto Mode (F09-50), resource optimization in preview (F09-46), Nitro Sandboxes (F09-43, F09-45).
   Snippet: a node pool for a simulation fleet.
5. **Queueing on Kubernetes: Kueue, KAI Scheduler, Volcano** - (F09-54, F09-57, F09-59.)
6. **NVIDIA OSMO and the AWS Physical AI Toolchain sample** - (F09-61, F09-69, F09-70 to F09-77 without cost
   figures.) Snippet: an OSMO workflow.
7. **Capacity markets by instance family** - Capacity Blocks (F09-90, F09-91), training plans (F09-35), Spot
   (F09-95, F09-96, F09-97); the reservation statement with its scope and date. Table 24.3.
8. **Glue and the edge** - Step Functions (F09-101); Lambda GPU functions and Deadline Cloud G7 (F09-118, F09-117);
   Greengrass component recipe (snippet) and EKS Hybrid Nodes limits (F09-52, F09-116, wave 3).
   One placeholder: the measured IoT hook-up.
Diagram 24.1 (animated) sits after block 1 or before block 7. Every November 2026 item states its status (preview
or generally available) as its page states it. SN: 2 to 10,000 child jobs per array job. Links: efa,
llm-training-systems.

### 25. Choosing (`choosing`, Choosing.tsx)
h1 payoff: Walk from your workload to a machine, a scheduler and a capacity market.
1. **The decision path** - Diagram 25.1; it is the dive's own (F09-110), with AWS's two published rules (F09-81,
   F09-112).
2. **Rules of thumb with their evidence** - Spot (F09-95, F09-96, F09-97), Capacity Blocks (F09-50), two GPU types
   in one pool (F09-86), the edge as a node (F09-116, F09-52), rendering capacity (F09-117), top of the range
   (F08-54, F09-99, F08-55).
3. **The closing table** - workload, machine part, instance family, orchestrator, capacity market (separating "can
   be reserved for a window" from "On-Demand, Spot and Savings Plans only", stated with its scope and date), why.
   Fifteen rows, our reading throughout.
No dollar figures. Ends on the table. SN: none of its own; it lands the dive's thesis.

### 26. Glossary and Sources (`sources`, GlossaryAndSources.tsx)
Generated by the orchestrator: the glossary from `revamp/glossary/*.json`, the sources from the entries cited on
the page, grouped by tier with access dates.
