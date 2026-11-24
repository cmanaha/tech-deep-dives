# Claims: section 3, The Robot as a Computer

claim | register ID

The standard kit is two arms, a leader moved by hand and a follower that copies it | F01-2
The leader is read, not driven; its six joint positions are handed to the follower as targets | F01-24
Neither arm contains a computer; a host reaches each arm over USB, cameras on the same host | F01-88
The encoder counts 4096 steps per full turn | F01-11
The follower's driver reads position only; no speed, load or current | F01-23
The tutorial uses two cameras named wrist and top | F01-31
Camera resolution has no default in code; the docs' advice and the SO-101 tutorial use 640x480 at 30 fps | F01-30
observation.state and action are 6-element float32 vectors, plus one image entry per camera | F01-26
Calibration records each joint's minimum and maximum so leader and follower report the same values in the same pose | F01-20
Arm joints are reported in degrees from the middle of the calibrated range, the gripper on 0 to 100; degrees = (raw - mid) x 360 / 4095 | F01-18
The recorded action is the leader's pose at that tick; observation.state is the follower's measured pose just before | F01-27
The host writes a goal position and reads the present position through the servo's register table | F01-14
LeRobot writes P = 16, I = 0, D = 32 into each follower servo on connect; the loop runs inside the servo (our reading) | F01-16
SO-101 joint-loop rate: not stated in the documents read (table cell only) | F01-45
The STS3215 has no torque (current) mode | F01-15
Six sts3215 motors: five position the arm, the sixth drives the gripper | F01-8
Five degrees of freedom plus a gripper; a free body has six, so a five-joint arm cannot reach every pose (our reading) | F01-52
Joint-space action is one target per motor and is LeRobot's default; end-effector action is a gripper pose and needs a kinematic model | F01-53
Absolute, relative and delta actions; absolute is LeRobot's default; deltas accumulate error | F01-55
GR00T N1.7 uses a relative end-effector action space, which NVIDIA credits for cross-embodiment transfer (vendor claim) | F01-60
The loop reads the robot, decides, sends the action, records, then sleeps until the tick's deadline | F01-33
Default recording rate 30 Hz; one tick is 33.3 ms | F01-28
A slow tick only logs a warning; nothing enforces the rate | F01-36
On the arm: host writes goals at 30 Hz; a 50-action chunk means one policy call every 1.67 s; optional language planner (our reading) | F01-81
GR00T 2 on a Unitree G1: 1.6 s chunks about once per second, 124 ms per optimised prediction on Jetson AGX Thor, 50 Hz whole-body controller, joint PD control labelled 1 kHz, only the reasoning model off the robot (vendor claim) | F01-73
Helix 02 (2026-01-27) carries the last control rates Figure published: 10-million-parameter network at 1 kHz under a 200 Hz layer; Helix 2.5 (2026-09-17) states none (vendor claim) | F01-72
At an illustrative 0.25 m/s: 33.3 ms is 8.3 mm, 100 ms is 25 mm, 250 ms is 62.5 mm; at the ceiling 100 ms is 182 mm (derived) | F01-83
Datasheet no-load speed 42 RPM at 6 V (vendor claim) | F01-42
Gripper speed ceiling under about 1.8 m/s, no load, 6 V, 0.413 m arm; lower on the stock 5 V supply; not measured (derived) | F01-82
One encoder step, 0.088 degrees, is 0.63 mm at the gripper; backlash up to 0.5 degrees is 3.6 mm (derived) | F01-84
One 640x480 RGB frame is 921,600 bytes; two cameras at 30 fps are 55,296,000 bytes/s (55.3 MB/s) against 1,440 bytes/s of state and action; 38,400 to 1 (derived) | F01-86
GR00T N1.7 policy call, 40 actions: median 22.9 ms on H100, 76.8 ms on Jetson AGX Thor, 149.0 ms on Jetson Orin; 1 to 5 control ticks at 30 Hz (vendor claim) | F01-74
A 76.8 ms policy call on Jetson AGX Thor is 2.3 control periods of 33.3 ms (our arithmetic, shown inline) | F01-74, F01-28
The six servos share one serial bus and answer by ID (IDs 1 to 6) | F01-8
With use_degrees off the arm joints are on a -100 to 100 scale; the gripper is always 0 to 100 | F01-18
Check which scale a downloaded dataset or checkpoint uses before mixing recordings | F01-19
The servo's load figure is the motor drive's duty cycle, ahead of a 1/345 gearbox: a crude stand-in for force | F01-46
One camera rides on the arm, the other is fixed over the scene | F01-31
LeRobot caps the gripper servo: torque limit 50%, protection current 50%, overload torque 25%, "to avoid burnout" | F01-17
The servo firmware lists four protection triggers: 2 s blocked above 80% of stall, 2 s above 2 A, supply outside 4 V to 7.4 V, above 70 degrees C | F01-47
NVIDIA's README calls offsets from the current pose "deltas", the form LeRobot calls relative | F01-60
pi0.7 experiments use joint-space control; no noticeable gain from end-effector control with earlier models (author reported) | F01-59
One tick is one sync read of six positions plus the latest camera frames, and one sync write of six goals | F01-22
Plain teleoperation defaults to 60 Hz | F01-29
Docs' sample cadence report, hardware unstated: observe 13.65 ms (74.4% of work), teleop 1.80 ms, send 0.90 ms, record 1.70 ms, work mean 18.4 ms, 15.1 ms slept, worst work 45.1 ms | F01-38
SmolVLA and pi0.5 default to a 50-action chunk; 50 actions at 30 Hz last 1.67 s | F01-57
The loop takes the most recent camera frame without waiting for a fresh one | F01-85
GR00T N1.7 on Jetson AGX Thor: 76.8 ms with TensorRT, 106.8 ms in PyTorch (vendor claim) | F01-74
Pacing sleeps to an absolute deadline; a slow tick borrows time from the following ticks | F01-34
The overrun warning names camera FPS, policy inference and CPU starvation | F01-36
Timestamps derive from frame index and nominal fps: a 25 Hz session yields a dataset that claims 30 | F01-37
Default inference backend is synchronous and blocks the loop; RTC computes chunks in a background thread; remote uses a policy server | F01-40
Remote inference: the robot computer keeps cameras and motors, a GPU machine runs the policy | F01-41
A synchronous rollout stops the robot while the policy computes; asynchronous playback must cover inference latency and its variation; a 50-action chunk at 30 Hz lasts 1,667 ms and a 149 ms call uses 4.5 ticks (derived) | F01-87
One default 60 s episode is 3.32 GB raw before video encoding (derived) | F01-86
On Linux the loop uses time.sleep; on macOS and Windows it busy-waits the last 10 ms of each sleep | F01-35
On Jetson, video decoding runs on the CPU by default and the CUDA build is community-maintained | F01-89
The serial bus is a single half-duplex data line on which each servo answers by ID | F01-44
A demonstration needs no conversion for a model that outputs joint targets, LeRobot's default | F01-53, F01-24
The latency sum leaves out camera exposure, transfer and decoding, bus time and servo response; the sources read on 2026-11-20 give no figure for them | F01-85, F01-45

Not register claims (marked in the page): the 40-degree and 5-degree action examples, the encoder example (3072, 2048, 1024, 90.02) and the 10 mm tolerance are illustrations (Toy); the 40 ms budget, the 2.3 periods and the 143.4 ms, 4.3 tick, 35.9 mm worst case are our arithmetic shown inline (Derived).
