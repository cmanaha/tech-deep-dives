# Claims: section 8, Reinforcement Learning for Robots

claim | register ID

LeRobot's RL example on a real arm: episode at most 20 s, reset wait 5 s, 10 frames per second; reward classifier optional, success can be marked by hand on a gamepad or keyboard; "Focus on tasks that can be completed in 5-10 seconds." | F04-77
At most 144 attempts an hour on the real arm (3,600 / (20 + 5)); 240 an hour for a 10 s episode (3,600 / 15); 2.5 hours is at most 360 attempts, at most 72,000 control steps (360 x 20 s x 10 a second); 196,608,000 is about 2,700 times 72,000 | derived from F04-77 and F04-58 (our arithmetic, shown on the page)
PPO alternates between collecting a batch and updating the policy from it, with several passes over a batch; clipped surrogate objective (equation 7); the paper suggests a clip range of 0.2 | F11-4
MuJoCo Playground 1.0.1 ships SO101PickCubeVision: PPO from a 64 x 64 wrist camera image, 10 Hz control, deployed zero-shot on the real SO-101; pick half only, no task for placing the block in the cup | F04-57
The default recipe: 4,096 environments x 16 control steps x 3,000 iterations = 196,608,000, about 197 million control steps; 19,660,800 simulated seconds, about 228 days; clip range 0.2; no wall-clock stated in the files read (configuration and README at 1.0.1) | F04-58
The deploy README's CPU override is 64 environments; 64 x 16 x 3,000 = 3,072,000 control steps | F04-58 (override), our arithmetic
The actor is a two-layer convolutional encoder feeding a 256-256-128 MLP; 4,096 x 16 = 65,536 steps per update | F04-58, our arithmetic
The vision task steps physics every 5 ms and acts every 100 ms: 20 physics steps per control step | F06-105
The Playground authors' 2025 paper: a camera-based Franka pick task trained in ten minutes on a single RTX 4090 and succeeded in 12 of 12 real trials; the software has been rewritten since (author reported) | F04-56
Isaac Lab 3.0, 8,192 environments, one RTX PRO 6000 Blackwell Server Edition: Franka cube lift from state at about 165,000 steps per second (PhysX) and about 319,000 (Newton MuJoCo-Warp) (vendor claim) | F04-54
Kuka-Allegro lift with one 64 x 64 camera per environment: about 28,000 against 61,000 (PhysX with RTX rendering, 46%), about 116,000 against 221,000 (Newton pair, 52%); GPU memory 24.22 GB and 13.61 GB on the camera rows (vendor claim) | F04-55
Illustration: 196,608,000 steps at about 28,000 a second is about 7,000 s, at about 116,000 about 1,700 s; different robot, task, simulator, environment count and GPU, so it illustrates the arithmetic and is no estimate for the recipe | our arithmetic from F04-58 and F04-55
The benchmark file's quality notes read "dirty working tree reported"; figures are training throughput, and the file holds no time to a working policy; the camera cost about half on the Kuka-Allegro manipulation rows and a factor of 6.7 on Newton's Cartpole rows | F04-54, F06-48
The benchmark camera is one fixed base camera at 64 x 64; the Newton row renders plain colour, the RTX row a shaded data type; the two rows use different physics engines | F06-103, F04-55
GPU-parallel physics loads general GPU compute with one CPU core feeding it (our reading of what the kernels compute, not measured); simulated cameras load GPU memory first, then the rendering path (our reading) | F08-76, F08-42
AWS (post of June 2026): the Omniverse RTX Renderer "requires GPUs with hardware RT Cores"; P-family instances lack them | F06-60
piRL: PPO on pi0 and pi0.5, 8 H100 80 GB GPUs, 64 to 320 parallel environments; pi0.5 from 77.1% to 98.3% on LIBERO from one demonstration per task (author reported) | F04-69
8 to 40 environments per GPU against 8,192, about 200 to 1,000 times fewer (rough: GPUs, simulators and tasks differ) | our arithmetic from F04-69 and F04-54
AWS sample run: RLinf v0.4's GRPO recipe (RLinf is the piRL authors' project) on OpenVLA-OFT 7B in LIBERO-Goal, one p5en.48xlarge Spot (8 H200), 75 GRPO steps in 31.6 hours, about 25 minutes per step, as the results file counts them, 48.6% (243/500) to 85.0% (425/500); single run, author reported; 95% intervals 44.2-53.0% and 81.6-87.9%; short test profile on one L40S, 5 steps, 56 minutes, 45.0% to 50.0% with overlapping intervals; dollar figure not printed | F04-70
An earlier run on 8 H100 had 38 hours left under a 40-hour cap at about 27 minutes per step, was stopped at step 83 of 100 and lost its last checkpoints because the timeout fired before the upload; 38 h = 2,280 min, room for about 84 steps | F04-71, our arithmetic
Recap repeats three stages: autonomous attempts with optional corrections, train a value function, retrain the policy | F04-60
Recap's value model: 670M-parameter VLM backbone, steps to success scaled to between -1 and 0 | F04-61
Advantage conditioning: label each action by advantage above a per-task threshold, train by supervised learning on all data with the label as input, ask for the positive label at run time | F04-62
Recap's advantage uses the whole episode in pre-training and a fixed lookahead for on-robot rollouts | F11-6
Actions supplied as human corrections are labelled true | F04-63
pi*0.6 has a Gemma 3 4B VLM and an 860M-parameter action expert | F04-64
Recap data per iteration: 300 autonomous trajectories on four robots (T-shirt folding); 600 autonomous trials and 360 with interventions on 3 robots (box assembly) (author reported) | F04-65
With on-robot data, throughput (successful tasks per hour) more than doubles on diverse laundry folding and espresso (author reported) | F04-66
Recap "relies on human labeling and effort for reward feedback, interventions, and episode resets"; it "collects a batch of data, retrains the model, and repeats" | F04-67
GR00T 2: three contact-rich insertion tasks from 40 to 76% after supervised training to 88 to 96% with real-robot RL; the page gives no robot count, episode count or training time for that stage (vendor claim) | F04-68
LeRobot v0.7.0 ships HIL-SERL for the SO-100 and SO-101 and recommends the SO-101 leader for takeovers because its geared joints track the follower; the guide promises a policy trained on a real robot "in just a few hours", no table of results in the guide | F04-80, F04-81
HIL-SERL in LeRobot is two programs, actor and learner, talking over gRPC; replay buffers and gradient updates in the learner; LeRobot's implementation uses SAC; the learner needs a GPU; default learner address is the local machine | F04-76
HIL-SERL paper: near-perfect success within 1 to 2.5 hours, from 20 to 30 demonstrations, one RTX 4090 (author reported, 2024 history) | F04-72
HIL-SERL paper: two buffers (demonstrations, robot experience), each batch drawn equally from both | F04-73
HIL-SERL paper: reward classifier generally above 95% accuracy on its evaluation set; a human intervention replaces the policy's action and is stored | F04-74
LeRobot learner defaults: weights pushed every 4 seconds (lower to 1-2 s for fresher weights at the cost of network traffic); buffers of 100,000 transitions | F04-78
"The learning process is very sensitive to the intervention strategy"; it takes a few runs to learn to intervene; "A successful experiment is one where the human has to intervene at the start but then reduces the amount of interventions as the policy improves." | F04-79
FailBench: 13 VLM-based detectors, 2,197 attempts, best 0.77 mean balanced accuracy, none above 0.60 on contact-intensive assembly, bias toward predicting success (author reported) | F04-45
The SO-101 task randomises per episode: fingertip friction, actuator gains, joint damping, cube size, colours, lighting and camera parameters, base height by plus or minus 2.5 mm, joint-reading calibration bias | F06-28
Manual calibration "can easily be off by 1-2+ cm in end-effector height" | F06-29
The SO-101 policy was "tested on 3 different robot setups under various lighting conditions", "there may still be visual domain gap with darker shadows"; the README and task files at 1.0.1 give no success rate for it | F06-26, F04-57
For the SO-101: Playground recipe in simulation, LeRobot HIL-SERL on the real arm, no arm-specific recipe located in this research for the pretrained-policy lane (our reading) | F04-81
