# Claims: section 14, Sim-to-Real and Real-to-Sim

claim | register ID

Manual middle-pose calibration on the SO-101 "can easily be off by 1-2+ cm in end-effector height" | F06-29
The task tolerates moderate calibration error through a per-episode bias; larger offsets "will eventually degrade grasp success or cause the robot to slam the table" | F06-29
AWS reports a model fine-tuned on real demonstrations scored 0% in simulation while models trained on clean simulation data reached 35% to 45%; trial counts not stated (vendor claim, post of 2026-09-09) | F06-72
Domain randomisation, 2017: with enough variability "the real world may appear to the model as just another variation"; detector accurate to 1.5 cm from simulated images alone (author reported) | F06-66
Randomised parameters "may be difficult to estimate accurately or may vary over time in the real world" | F06-67
SO101PickCubeVision randomises per episode: fingertip friction, PD gains, joint damping, cube size; cube, floor and link colours (high contrast), lighting, camera parameters, pixel noise; joint-reading calibration bias, base height by plus or minus 2.5 mm | F06-28
The task injects a random command delay of 0 to 4 ms, runs the policy at 10 Hz and renders one 64 x 64 wrist-camera image per policy step | F06-27
MuJoCo Playground 1.0.0 (2026-11-06) ships paired sim and real packages for the SO-101 | F06-25
SO101PickCubeVision is trained in simulation and deployed "zero-shot onto the real robot"; same task code in both modes; pick half only | F06-26
"Tested on 3 different robot setups under various lighting conditions"; a visual gap may remain under darker shadows; no success rate published | F06-26
Physics steps every 5 ms, policy every 100 ms, 20 physics steps per decision; the 0 to 4 ms delay is under one physics step | F06-105, F06-27
0.25 m/s x 4 ms = 1 mm (0.25 m/s is section 3's illustrative speed) | toy number, our arithmetic
Base-height range is 5 mm wide; a 10 to 20 mm calibration error is two to four times that width | our arithmetic from F06-28, F06-29
The width of the calibration-bias range was not recorded in this research | F06-28 (hedge)
64 x 64 = 4,096 pixels per decision | our arithmetic from F06-27
The servo is modelled as torque = kp x (target - angle) - kd x speed, capped at a torque limit | F06-31
Identified values: stiffness 218 to 265, damping 17.5 to 34.2, armature 0.109 to 0.199, friction loss near zero on five joints and 0.25 on the gripper | F06-31
Torque cap computed from the STS3215 stall torque, 30 kg-cm at 12 V, 2.94 N m; units of the fitted values not checked | F06-31
mujoco.sysid script fits 24 parameters (armature, friction loss, stiffness, damping for each of 6 joints) from one teleoperated excitation episode by Gauss-Newton least squares on tracking error, and estimates the serial transport delay; no timing published | F06-30
This dive read the script and values and did not run the fit | F06-30 (hedge)
mujoco.sysid ships with MuJoCo 4.0 | F06-6
MuJoCo 4.0 adds a pid actuator, a datasheet dcmotor actuator and actuator delays | F06-7
SIMPLER (history, 2024): real PD gains used directly in simulation ended in "a missed grasp on the coke can"; after system identification the replayed actions grasped it | F06-71
PolaRiS builds a scene from a 2 to 5 minute video with Gaussian splats for appearance and a mesh for contact; reconstruction "typically completes within 30 minutes on an NVIDIA RTX 4090"; human effort under 20 minutes (author reported) | F06-73
PolaRiS fine-tunes policies for 1k steps on about 350 simulated demonstrations from 15 other scanned scenes before evaluating | F06-74
MuJoCo Warp's batch renderer draws 3D Gaussian splat scenes composited with simulated objects | F06-78
Under PhysX, physics parameters "must be modified through the CPU API" | F06-69
3DGRUT v1.1.0 average training on an RTX 5090: 3DGRT 479 s and 2,869 s; 3DGUT 215 s and 686 s; 3DGRT wants RT cores (author reported) | F06-75
Diagram 14.1 shapes are illustrative, not measured | none (schematic)
