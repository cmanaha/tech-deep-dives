# Claims: section 12, Physics Simulation

claim | register ID

One CPU core runs a physics step well; one MuJoCo Warp step is expected to be slower than one MuJoCo step; MuJoCo is tuned for latency, MuJoCo Warp for throughput | F06-16
Our measurement, single run (one run per pass, two passes), MuJoCo humanoid standing in for the SO-101 (whose scene was not measured), one core: 57,240 steps/s on a DGX Spark Cortex-X925 with MuJoCo 4.0.1; 28,662 on a DGX Spark Cortex-A725 with 4.0.1; 14,507 on a Jetson Orin Nano Super Cortex-A78AE with 3.17.0 (chart) | F08-61, F08-73
The humanoid's timestep is 0.005 s, so the X925 core ran it at 57,240 x 0.005 = 286 times real time | F08-61 (derived in the entry)
Viewing a model and running one policy belong on CPU MuJoCo | F06-16
The SO-101 vision RL recipe runs 4,096 worlds, 16 control steps each per iteration, 3,000 iterations: 196,608,000 decisions | F04-58
That recipe's task acts every 100 ms on a 5 ms physics step: 20 physics steps per decision, so 196,608,000 x 20 = 3,932,160,000 (about 3.9 billion) physics steps (our arithmetic) | F06-105, F04-58
MuJoCo Warp nightly benchmark (vendor figure), one RTX 6000 Ada, row dated 2026-09-03: humanoid 5.77 million steps/s at 8192 worlds | F06-20
5,770,000 / 8192 = 704 steps/s per copy, about 80 times slower than the X925 core; the batch equals 5,770,000 / 57,240 = 101 X925 cores (our arithmetic; different machines, versions and sources, order of magnitude only) | F06-20, F08-61
The state is joint angles and speeds plus the loose object's position, orientation and their rates | F06-9 (teaching material 5.1)
MuJoCo Menagerie carries an SO-101 model derived from the hardware maker's file, with primitive collision shapes added for gripper and arm, and gripper contact solver defaults "that work well for manipulation" | F06-37
MuJoCo's default timestep is 0.002 s (1 / 0.002 = 500 steps per simulated second); the docs call it the single most important parameter for the speed-accuracy trade-off; real time needs CPU time per step below the timestep | F06-10
MuJoCo Playground 1.0.0 (2026-11-06) ships SO101PickCubeVision with paired sim and real packages, on MuJoCo Warp; the shipped task picks the cube up, the first half of the dive's block-in-cup story | F06-25, SCOPE change C7
SO-101 pick-cube steps physics every 5 ms (2.5 times coarser than the default, 200 steps per simulated second, 40% of the default's calls); vision task acts every 100 ms (20 substeps); state task SO101PickCube acts every 20 ms (4 substeps, 50 decisions a second, our arithmetic) | F06-105
Playground computes the substep count as round(control_timestep / simulation_timestep); a 33.3 ms (30 Hz) period would round 6.67 to 7 substeps, 35 ms, 28.6 decisions a second (our arithmetic) | F06-105, F07-23
Too large a timestep makes the simulation unstable; too small wastes CPU time without meaningful gain in accuracy | F06-13
mj_step is 26 stages in four groups (position, velocity, force and acceleration, integrator); collision is stage 8, constraint Jacobian stage 9, constraint forces stage 22, output mjData.qacc | F06-9
Playground's Sim config exposes solver, iterations and ls_iterations; the pick-cube task sets none, so MuJoCo's defaults apply | F06-106
Equation of motion M v-dot + c = tau + J^T f, symbols as in MuJoCo's docs; J^T maps constraint force to joint force | F11-200
Constraint types include contact, friction loss (dry friction in a joint) and limits; each scalar constraint is a row of J | F11-211
The SO-101 scene writes friction loss onto every joint, so the arm carries constraints when nothing touches | F11-212, F11-211 (use in dive)
Semi-implicit Euler v_{t+h} = v_t + h a_t, q_{t+h} = q_t + h v_{t+h}, called standard in physics simulation; elbow numbers are illustrative | F11-201
The base plane scene of the pick-cube task sets timestep="0.005" integrator="implicitfast" on its option element | F06-106
implicitfast is MuJoCo's recommended integrator, usually the best trade-off of stability and performance | F06-13
implicitfast keeps the position line and rescales the acceleration with M-hat = M + hD, D from velocity derivatives of the forces, approximating an update that uses the acceleration at the new speed | F11-210
Models with many floating objects (many contacts) are more demanding; stability also depends on the solver settings, softer constraints allow larger timesteps | F06-11
Collision detection is broad, mid and near phase; checking all pairs in detail "is prohibitively expensive for large systems" | F06-12
Same MuJoCo Warp benchmark (vendor figure): idle Franka Panda 25.2 million steps/s at 32768 worlds; Aloha pot 2.51 million at 8192; Aloha clutter 342 thousand at 2048; per copy 769, 306, 167; 769 / 167 = 4.6 (our arithmetic); robot, contacts and batch size all change between the rows | F06-20
discrete integrator: choose "when stiff springs, position servos or strong damping interact with contacts" | F06-13
SO-101 servo position gains identified from real teleop data, between 218 and 265 | F06-31
MuJoCo 4.0.1 released 2026-11-11 | F06-1
4.0.1 fixes a 4.0.0 sparse Cholesky fault that gave the Newton solver a wrong Hessian factor, "causing slow convergence, wrong accelerations and divergence" | F06-2
A world is an independent copy of the scene; CPU recipe is one world per thread, as many threads as logical cores | F06-14
Pick-cube per-world limits for MuJoCo Warp, reserved up front per world: nconmax=64 contacts, njmax=256 constraints | F06-105
Memory and computation scale with the per-world limits; set them as small as possible without exceeding them; throughput is often limited by memory for large numbers of worlds | F06-23
Accelerators run branching code poorly; MJX-JAX ships a branchless broad phase less powerful than MuJoCo's; MJX-JAX throughput falls faster than CPU MuJoCo as contacts are added | F06-17
MuJoCo docs (vendor figures), humanoid: 650 thousand steps/s on an Apple M3 Max, 1.8 million on a 64-core AMD 3995WX at 2 threads per core, 950 thousand for MJX-JAX on one A100 at batch 8192 | F06-15
5.77 / 1.8 = 3.2; 3,932,160,000 physics steps take about 11 minutes (681 s), about 36 minutes (2,184 s) and about 19 hours (68,696 s) at 5.77 million, 1.8 million and 57,240 steps/s (our arithmetic, illustration; Tier 0 rate keeps its qualifiers) | F06-20, F06-15, F08-61
MuJoCo Warp GPU memory: 466 MB for 8192 humanoid worlds (about 57 KB per world), about 84 KB per world for Aloha pot, 468 KB for Aloha clutter (468 / 84 = 5.6, our arithmetic); card has 48 GB | F06-22, F06-20
At 468 KB a 48 GB card holds about 48,000,000 / 468 = 100,000 worlds if memory grows in proportion, far past the recipe's 4,096; capacity does not bind at these counts (our arithmetic) | F06-22, F06-20, F04-58
First Playground paper (author reported), Franka pick from pixels on MJX and an RTX 4090: physics 24%, rendering 18%, policy update 57% of training time; halving physics saves 12% (our arithmetic) | F06-33
MJX is a JAX API over MJX-JAX (NVIDIA and AMD GPUs, Apple Silicon, Google TPUs) and MJX-Warp (NVIDIA GPUs); MuJoCo Warp resolves several MJX-JAX bottlenecks | F06-18
MuJoCo Warp v4.0.1 (2026-11-11), written in Warp, NVIDIA GPU with CPU for debugging | F06-19
Newton v1.8.0 (2026-11-11); some solvers labelled experimental | F06-40
Isaac Lab runs on Newton (with MJWarp among its solvers) or PhysX | F06-46
Isaac Sim 6.2.0 (2026-10-14) | F06-44
Isaac Lab 3.0.0 (2026-10-20); Isaac Sim is now optional | F06-45
Isaac Lab release benchmark (vendor figures), Franka lift, 8,192 environments, RTX PRO 6000 Blackwell Server Edition: 318,651 training FPS and 5.41 GB on Newton MJWarp, 164,777 and 14.74 GB on PhysX, whole training process | F06-47
Our measurement, single runs on the DGX Spark: physics on the X925 has 0.4% of cycles stalled on memory; the A725 core's 28,662 is half the X925's rate (28,662 / 57,240 = 0.50, our arithmetic) | F08-61, F08-73
Our measurement, single run: the policy-inference stand-in on the same X925 core has 22.4% of cycles stalled on memory | F08-62
GPU physics loads GPU compute and memory | F06-100
"Headless Newton simulation does not require RTX hardware"; the default CUDA 13 stack needs Turing or newer (compute capability 7.5) | F06-51
Isaac Lab paper (author reported): throughput can depend on single-core CPU performance, through parts of PhysX and the main training loop | F06-65
testspeed rolls out 10,000 steps by default and prints CPU time, contact and constraint counts; --nthread runs one world per thread | F06-14
No figure read on 2026-11-20 times one scene at several world counts (scoped gap: the benchmark gives each robot one world count), so the crossover is the reader's measurement; the batch equals about a hundred X925 cores on the humanoid | F06-20, F06-15, F08-61
