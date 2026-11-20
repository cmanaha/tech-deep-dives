# Claims: section 3, The Robot as a Computer

claim | register ID

The standard kit is two arms, a leader moved by hand and a follower that copies it | F01-2
The leader is read, not driven; teleoperation copies six joint positions from leader to follower (our reading) | F01-24
Neither arm contains a computer; a host reaches each arm over USB, cameras on the same host | F01-88
The encoder counts 4096 steps per full turn | F01-11
The follower's observation reads position only; no speed, load or current (our reading) | F01-23
The tutorial uses two cameras named wrist and top | F01-31
Camera resolution has no default in code; docs and examples use 640x480 at 30 fps | F01-30
observation.state and action are 6-element float32 vectors, plus one image entry per camera | F01-26
Calibration records each joint's minimum and maximum so leader and follower report the same values in the same pose | F01-20
Arm joints are reported in degrees from the middle of the calibrated range, the gripper on 0 to 100; degrees = (raw - mid) x 360 / 4095 | F01-18
The recorded action is the leader's pose at that tick; observation.state is the follower's measured pose just before | F01-27
The host writes a goal position and reads the present position through the servo's register table | F01-14
LeRobot writes P = 16, I = 0, D = 32 into each follower servo on connect; the loop runs inside the servo (our reading) | F01-16
Neither Feetech document read states how often the servo's position loop runs | F01-45
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
GR00T 2 on a Unitree G1: 1.6 s chunks about once per second, 124 ms per prediction on Jetson AGX Thor, 50 Hz whole-body controller, joint PD control labelled 1 kHz, only the reasoning model off the robot (vendor claim) | F01-73
Helix 02 (2026-01-27): 10-million-parameter System 0 at 1 kHz under System 1 at 200 Hz; Helix 2.5 (2026-09-17) states no control rate (vendor claim) | F01-72
At an illustrative 0.25 m/s: 33.3 ms is 8.3 mm, 100 ms is 25 mm, 250 ms is 62.5 mm; at the ceiling 100 ms is 182 mm (derived) | F01-83
Datasheet no-load speed 42 RPM at 6 V (vendor claim) | F01-42
Gripper speed ceiling under about 1.8 m/s, no load, 6 V, 0.413 m arm; lower on the stock 5 V supply; not measured (derived) | F01-82
One encoder step, 0.088 degrees, is 0.63 mm at the gripper; backlash up to 0.5 degrees is 3.6 mm (derived) | F01-84
One 640x480 RGB frame is 921,600 bytes; two cameras at 30 fps are 55,296,000 bytes/s (55.3 MB/s) against 1,440 bytes/s of state and action; 38,400 to 1 (derived) | F01-86
GR00T N1.7 policy call, 40 actions: median 22.9 ms on H100, 76.8 ms on Jetson AGX Thor, 149.0 ms on Jetson Orin; 1 to 5 control ticks at 30 Hz (vendor claim) | F01-74

Not register claims (marked in the page): the 40-degree and 5-degree action examples, the encoder example (3072, 2048, 1024, 90.02) and the 10 mm tolerance are illustrations (Toy); the 40 ms budget is our arithmetic shown inline (Derived).
