# Claims: section 12, Physics Simulation

claim | register ID

Our measurement, single run (one run per pass, two passes), MuJoCo humanoid (not the arm), one core: 57,240 steps/s on a DGX Spark Cortex-X925, 28,662 on a DGX Spark Cortex-A725, 14,507 on a Jetson Orin Nano Super Cortex-A78AE | F08-61
The humanoid stand-in uses a 0.005 s timestep, so the X925 core ran it at 57,240 x 0.005 = 286 times real time | F08-61 (derived in the entry)
MuJoCo 4.0.1 on the Spark, 3.17.0 on the Jetson; stand-in model; two passes on disk | F08-73
MuJoCo Warp nightly benchmark (vendor figure): humanoid, 8192 worlds, 5.77 million steps/s on one RTX 6000 Ada, row dated 2026-09-03 | F06-20
Same benchmark: idle Franka Panda 25.2 million steps/s at 32768 worlds; cluttered Aloha scene 342 thousand at 2048 worlds | F06-20
5,770,000 / 8192 = about 704 steps/s per world | derived from F06-20 (our arithmetic, shown on the page)
MuJoCo Menagerie carries an SO-101 model derived from the hardware maker's file, with primitive collision shapes added for gripper and arm | F06-37
MuJoCo Playground 1.0.0 (2026-11-06) ships SO-101 tasks with paired sim and real packages; runs on MuJoCo Warp | F06-25
The shipped task picks the cube up; placing it in the cup is the dive's extension | F06-25, SCOPE change C7
MuJoCo's default timestep is 0.002 s; the docs call it the single most important parameter for the speed-accuracy trade-off | F06-10
A too-large timestep makes the simulation unstable; implicitfast is the recommended integrator | F06-13
Models with many floating objects (many contacts) are more demanding computationally | F06-11
SO-101 pick-cube steps physics every 5 ms (2.5 times coarser than the default); vision task acts every 100 ms: 20 substeps, 200 physics steps and 10 policy steps per simulated second | F06-105
State-only task SO101PickCube keeps the 20 ms control step: 4 substeps; 1 / 0.02 = 50 policy steps per second | F06-105 (50 is our arithmetic)
Pick-cube per-world limits for MuJoCo Warp: 64 contacts, 256 constraints | F06-105
mj_step is 26 stages in four groups: position, velocity, force and acceleration, integrator; collision is stage 8, constraint Jacobian stage 9, constraint forces stage 22; qacc is the main output | F06-9
Equation of motion M x qacc = tau - c + J^T x f, standard form | register 06 teaching material 5.1 (no entry of its own; stage names from F06-9)
The base scene of the pick-cube task selects implicitfast | F06-106
MuJoCo 4.0.1 released 2026-11-11 | F06-1
4.0.1 fixes a 4.0.0 solver regression that gave wrong accelerations | F06-2
MJX is a JAX API over MJX-JAX (NVIDIA and AMD GPUs, Apple Silicon, Google TPUs) and MJX-Warp (NVIDIA GPUs) | F06-18
MuJoCo Warp v4.0.1 (2026-11-11), written in Warp, NVIDIA GPU with CPU for debugging | F06-19
Newton v1.8.0 (2026-11-11); some solvers labelled experimental | F06-40
Newton offers several solvers including MJWarp; Isaac Lab runs on Newton or PhysX | F06-46
Isaac Sim 6.2.0 (2026-10-14) | F06-44
Isaac Lab 3.0.0 (2026-10-20); Isaac Sim is now optional | F06-45
CPU recipe: one world per thread, as many threads as logical cores | F06-14
MuJoCo is tuned for latency, MuJoCo Warp for throughput; one step is expected to be slower on MuJoCo Warp | F06-16
Collision detection branches and accelerators run branching code poorly | F06-17
MuJoCo docs (vendor figures), humanoid: 650K steps/s on an Apple M3 Max, 1.8M on a 64-core AMD 3995WX (2 threads per core, 128 threads), 950K for MJX-JAX on one A100 at batch 8192 | F06-15
MuJoCo Warp GPU memory: 466 MB for 8192 humanoid worlds, about 57 KB per world | F06-22
Isaac Lab release benchmark (vendor figures), Franka lift, 8,192 environments, RTX PRO 6000 Blackwell Server Edition: 318,651 training FPS on Newton MJWarp, 164,777 on PhysX | F06-47
"Headless Newton simulation does not require RTX hardware" | F06-51
