# Claims: section 8, Reinforcement Learning for Robots

claim | register ID

LeRobot's RL example on a real arm: episode at most 20 s, reset wait 5 s, 10 frames per second, images resized to 128 x 128; reward classifier optional, success can be marked by hand | F04-77
At most 144 attempts an hour on the real arm (3,600 / (20 + 5)); 2.5 hours is at most 360 attempts | derived from F04-77 (our arithmetic, shown on the page)
MuJoCo Playground 1.0 ships SO101PickCubeVision: PPO from a 64 x 64 wrist camera image, 10 Hz control, deployed zero-shot on the real SO-101; pick half only | F04-57
The default recipe: 4,096 arms x 16 control steps x 3,000 iterations = 196,608,000, about 197 million control steps; 19,660,800 simulated seconds, about 228 days; no wall-clock published in the files read | F04-58
The actor is a two-layer convolutional encoder feeding a 256-256-128 MLP | F04-58
The vision task steps physics every 5 ms and acts every 100 ms: 20 physics steps per control step | F06-105
Remaining solver settings are inherited from Playground's base scene | F06-106
Isaac Lab 3.0, 8,192 environments, one RTX PRO 6000 Blackwell Server Edition: Franka cube lift from state at about 165,000 steps per second (PhysX) and about 319,000 (Newton MuJoCo-Warp) (vendor claim) | F04-54
Kuka-Allegro lift with one camera per environment: about 28,000 against 61,000 (PhysX with RTX rendering), about 116,000 against 221,000 (Newton pair) (vendor claim) | F04-55
The benchmark file's quality notes read "dirty working tree reported"; rows are throughput, not time to a working policy | F04-54
The benchmark camera is one fixed base camera at 64 x 64 read from preset code; Newton row renders RGB, RTX row a shaded data type | F06-103
Recap repeats three steps: autonomous rollouts with optional corrections, train a value function, retrain the policy | F04-60
Recap's value model: 670M-parameter VLM backbone, steps to success scaled to between -1 and 0, distribution over 201 bins | F04-61
Advantage conditioning: label each action by advantage above a per-task threshold, train by supervised learning on all data with the label as input, ask for the positive label at run time | F04-62
Actions supplied as human corrections are labelled true | F04-63
pi*0.6 has a Gemma 3 4B VLM and an 860M-parameter action expert | F04-64
Recap data per iteration: 300 autonomous trajectories on four robots (T-shirt folding); 600 autonomous trials and 360 with interventions on 3 robots (box assembly) (author reported) | F04-65
Recap "relies on human labeling and effort for reward feedback, interventions, and episode resets" | F04-67
piRL: PPO on pi0 and pi0.5, 8 H100 80 GB GPUs, 64 to 320 parallel environments; pi0.5 from 77.1% to 98.3% on LIBERO (author reported) | F04-69
AWS sample run: GRPO (RLinf) on OpenVLA-OFT 7B in LIBERO-Goal, one p5en.48xlarge Spot (8 H200), 75 steps in 31.6 hours, about 25 minutes per step, 48.6% (243/500) to 85.0% (425/500); single run, author reported; dollar figure not printed | F04-70
An earlier run hit a 40-hour cap at step 83 of 100 and lost its last checkpoints because the timeout fired before the upload | F04-71
GR00T 2: three insertion tasks from 40 to 76% to 88 to 96% with real-robot RL; no robot count, episode count or training time (vendor claim) | F04-68
LeRobot v0.7.0 ships HIL-SERL for the SO-100 and SO-101 and recommends the SO-101 leader as the intervention device | F04-80
HIL-SERL in LeRobot is two programs, actor and learner, talking over gRPC; replay buffers and gradient updates in the learner; the algorithm is SAC; the learner needs a GPU | F04-76
HIL-SERL paper: near-perfect success within 1 to 2.5 hours, from 20 to 30 demonstrations, one RTX 4090 (author reported, 2024 history) | F04-72
"A successful experiment is one where the human has to intervene at the start but then reduces the amount of interventions as the policy improves." | F04-79
For the SO-101: Playground recipe in simulation, LeRobot HIL-SERL on the real arm, no arm-specific recipe located for the pretrained-policy lane (our reading) | F04-81
