# Claims: section 14, Sim-to-Real and Real-to-Sim

claim | register ID

A shipped script fits 24 servo parameters (armature, friction loss, stiffness, damping for each of 6 joints) from one teleoperated excitation episode, by Gauss-Newton least squares on rollout tracking error, and estimates and logs the serial transport delay; no timing published | F06-30
The script lives in Playground's tasks/sysid/so101; mujoco.sysid ships with MuJoCo 4.0, installed with pip install -U "mujoco[sysid]" | F06-30, F06-6
MuJoCo Playground 1.0.0 ships paired sim and real packages for the SO-101 | F06-25
SO101PickCubeVision is trained in simulation and deployed "zero-shot onto the real robot"; it learns to pick the cube up; placing it in the cup is this dive's extension | F06-26
Servo PD gains "identified from real teleop data"; each episode scales PD gains and joint damping and redraws friction, calibration bias, delay, colours, lighting and camera | F06-31, F06-28, F06-27
Calibration by hand: hold each joint at mid-range, then sweep the full range while the software records the extremes | F01-20
Manual middle-pose calibration "can easily be off by 1-2+ cm in end-effector height" (10 to 20 mm or more) | F06-29
Base height randomised by plus or minus 2.5 mm, for mounting offsets | F06-28
The per-episode bias exists "to tolerate moderate calibration error, but larger offsets will eventually degrade grasp success or cause the robot to slam the table" | F06-29
Joint-reading bias per episode plus step-wise noise | F06-28
The widths of the gain, damping, friction, cube-size and joint-bias ranges were not recorded in this research | F06-28 (hedge)
Physics every 5 ms, policy every 100 ms | F06-105, F06-27
Command delay 0 to 4 ms; 64 x 64 wrist-camera image per decision | F06-27
Cube and floor colours drawn "with high visual contrast"; pixel_noise_std=0.02 | F06-28
"Tested on 3 different robot setups under various lighting conditions"; "there may still be visual domain gap with darker shadows"; remedies: lighting that prevents darker shadows, or a new "domain randomization recipe for the pixels inputs"; no success rate published | F06-26
The maker's model file: motor parameters "are adapted from the Open Duck Mini project" | F06-36
LeRobot writes P = 16, I = 0, D = 32 to each servo on connect | F01-16
Simulated stiffness 218 to 265, damping 17.5 to 34.2, armature 0.109 to 0.199, friction loss near zero on five joints and 0.25 on the gripper | F06-31
Friction loss is dry friction in the joint | F11-211
SIMPLER (2024): real controller gains copied into simulation ended in "a missed grasp on the coke can"; after system identification the replayed actions grasped it | F06-71
0.25 m/s x 4 ms = 1 mm (0.25 m/s is section 3's illustrative speed) | toy number, our arithmetic
Domain randomisation, 2017: "the real world may appear to the model as just another variation"; detector accurate to 1.5 cm from non-realistic random textures (author reported) | F06-66
Domain randomisation objective: expectation over sampled parameters of the expected return | F11-202
One draw of the parameters per episode, held fixed; the shipped task's joint-reading noise is redrawn every step | F11-202, F06-28
A policy that wins a wider average can give up reward at the bench's value; no figure found for this arm | our inference from F11-202 (one plain clause)
Default PPO recipe: 4,096 arms, about 197 million control steps | F04-58
Isaac Lab paper: friction, armature, gravity, mass; texture, material, lighting; such parameters "may be difficult to estimate accurately or may vary over time in the real world" | F06-67
Isaac Lab 3.0.0 event functions (scale, material, mass, inertia, centre of mass, collider offsets, gravity, actuator gains, joint and tendon parameters, visual materials and colours, pushes, reset states) | F06-68
Under PhysX (November 2025 paper), physics parameters "must be modified through the CPU API"; randomisation is a CPU cost inside a GPU pipeline | F06-69
Servo modelled as torque = kp (target - q) - kd q-dot, capped | F11-212, F06-31
Cap 2.94 N m from STS3215 stall torque 30 kg-cm at 12 V; not fitted | F06-31
2.94 / 218 = 0.0135 rad, conditional on the gains being in N m per rad (units not stated) | our arithmetic from F06-31
The follower in the bill of materials uses 7.4 V STS3215 servos; 7.4 V version rated 16.5 kg-cm at 6 V; 12 V version 30 kg-cm | F01-4, F01-5
16.5 kg-cm = 1.62 N m; 2.94 / 1.62 = 1.8 | our arithmetic from F01-5, F06-31
The README sets no length or pattern for the excitation episode | F06-30 (hedge)
24 + 1 = 25 replays per Gauss-Newton step, conditional on finite differences | our arithmetic, conditional
No spread of fitted values between arms was found | F06-31 (hedge)
MuJoCo 4.0 adds pid, dcmotor (datasheet) actuators and actuator delays | F06-7
Isaac Lab neural-network actuators "to better emulate the dynamic response of the actuator in the real world" | F06-70
SO-101 typing project on Isaac Lab 3.0 ships tools that fit the keyboard pose and joint-angle calibration from recorded key presses | F06-55
AWS (post of 2026-09-09, one engagement): fine-tuned on real demonstrations scored 0% in simulation; clean-simulation models 35% to 45%; no trial counts (vendor claim) | F06-72
PolaRiS: 2 to 5 minute video, camera poses, splats with mesh, meshes in Isaac Sim, splats on robot links; "typically completes within 30 minutes on an NVIDIA RTX 4090"; under 20 minutes of human effort; under one hour wall time (author reported) | F06-73
PolaRiS: object physics are Isaac Sim defaults, arm physics manufacturer defaults; 1k fine-tuning steps on about 350 demonstrations from 15 other scenes | F06-74
PolaRiS: average Pearson r = 0.9 over six environments, worst 0.81; 20 real rollouts per policy per environment; four policies (author reported) | F06-83
MuJoCo Warp batch renderer ray traces splat files and composites them with simulated objects, no RTX hardware | F06-78
Isaac Sim 6.2.0 renders OpenUSD ParticleField splats natively through RTX; docs point to 3DGRUT for training splats | F06-77
Isaac Sim does not support GPUs without RT cores (A100, H100) | F06-52
DrEureka (2024): 16 configurations for a quadruped trained in parallel, 3 hours against 10 and 20 hours for two iterative searches (author reported) | F04-40
3DGRUT v1.1.0 on an RTX 5090: 3DGRT 479 s (NeRF Synthetic) and 2,869 s (MipNeRF360); 3DGUT 215 s and 686 s; 3DGRT wants RT cores (author reported) | F06-75
479 / 215 = 2.2; 2,869 / 686 = 4.2 | our arithmetic from F06-75
lerobot-calibrate runs the hand calibration | F01-21
Diagram 14.1 shapes are illustrative, not measured | none (schematic)
