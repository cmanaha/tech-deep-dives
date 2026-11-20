# Claims: section 23, Price-Performance and Latency

claim | register ID
--- | ---
390 inferences per second for the policy stand-in on one Cortex-A78AE core of a Jetson Orin Nano Super, single run | F08-62
1,404 and 1,968 inferences per second on the DGX Spark Cortex-A725 and Cortex-X925 cores, single run | F08-62
Physics step stand-in: 14,507 (Jetson A78AE), 28,662 (Spark A725), 57,240 (Spark X925) steps per second, single run | F08-61
Camera render stand-in at 640x480: 209, 937 and 1,191 frames per second, single run | F08-64
The render run did not establish the GPU's share of each frame, so it cannot rank rendering hardware | F08-64
GPU utilisation in nvidia-smi is the share of time at least one kernel was executing | F08-30
One unit of work per workload, fifteen rows; the units are the dive's own choice | F08-81
Control period is 33.3 ms at 30 Hz | F08-84
Cloud formula: units per currency unit = units per second x 3,600 / price per hour, with a dated first-party price for a named Region and purchase option | F08-82
Divide by the whole instance price; count units lost to reclaimed spare capacity | F08-82
Edge formula: units per joule = units per second / watts | F08-83
The Spark ran MuJoCo 4.0.1 and the Jetson MuJoCo 3.17.0 | F08-73
Stand-ins are a humanoid, six dense layers on a CPU, an offscreen render; one core; no EC2 instance measured | F08-73
Choose the machine by the part the workload fills, compute the figure there, then check the tail on the robot's clock | F08-85
NVIDIA states 7 W to 25 W for the Jetson Orin Nano Super Developer Kit | F07-36
NVIDIA states a 240 W power supply and a 140 W chip power budget for DGX Spark | F07-47
Our idle readings: Jetson board about 4.8 W (tegrastats), Spark GPU 10 W (nvidia-smi); single reading; no power under load recorded | F08-83
The 25 W ceiling gives only a floor: one core of six busy, GPU idle | F08-83
Mean latency of the stand-in: 1 / 390 per second = 2.56 ms on the Jetson core, 0.51 ms on the Cortex-X925, our arithmetic from a single run | F08-84
The playback left after a call must still cover the next call; no setting repairs a call that is too long | F07-22
NVIDIA's GR00T N1.7 device table reports the median of 60 timed calls | F07-3
149.0 ms on Jetson Orin is 4.5 control periods at 30 Hz; no p99 exists in ours or in the published table | F08-84
No price was collected for this build | F08-59
Worked example (machines A and B, 20 W device) and the 5 calls per second illustration | none: invented numbers, wrapped in Toy
