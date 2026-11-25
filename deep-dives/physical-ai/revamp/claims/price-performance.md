# Claims: section 23, Price-Performance and Latency

claim | register ID
--- | ---
390 inferences per second for the policy stand-in on one Cortex-A78AE core of a Jetson Orin Nano Super, single run | F08-62
1,404 and 1,968 inferences per second on the DGX Spark Cortex-A725 and Cortex-X925 cores, single run | F08-62
1,968 / 390 = 5.0 times the work per second (our arithmetic) | F08-62, Derived
The Spark core is ahead per joule only if it drew less than 5.0 times the Jetson's watts, per price only if it cost less than 5.0 times as much (arithmetic in view) | F08-83, Derived
No run recorded power under load; no dated price was collected | F08-83, F08-59
The 5.0 is a ratio of memory traffic: each inference reads all 25.2 MB of weights, more than any cache on either machine; 390 x 25.2 MB = 9.8 GB/s against the 11.71 GB/s the Jetson core reached in the triad test, 62.3% of cycles stalled on memory; the X925 pulls 49.5 GB/s; memory bandwidth is the part to weigh price and watts against | F08-63, F08-62
The NumPy version of the policy stand-in is not recorded in our report (figure caption) | F08-62 (report and raw results read: no NumPy or BLAS version recorded)
Physics step stand-in: 14,507 (Jetson A78AE), 28,662 (Spark A725), 57,240 (Spark X925) steps per second, single run | F08-61
57,240 / 28,662 = 2.0 inside the Spark, same MuJoCo 4.0.1 (our arithmetic); ranks two core types inside one chip | F08-61, F08-73, Derived
57,240 / 14,507 = 3.9 mixes a processor with a MuJoCo release; a Jetson run on MuJoCo 4.0.1 would separate them (logic in view) | F08-61, F08-73, Derived
Camera render stand-in at 640x480: 209, 937 and 1,191 frames per second, single run | F08-64
The render run went through EGL (hardware-accelerated headless rendering); how much of each frame the GPU drew was not established (figure caption) | F08-64, F08-73
The stand-ins are a humanoid where the arm is an SO-101, and a policy on a CPU where real policies run convolutions and attention on a GPU | F08-73, F08-62 (use-in-dive line)
NVIDIA measured its GR00T N1.7 device medians with TensorRT; a call time compares with them only for the same model compiled the same way | F07-5 (logic in view)
GPU utilisation in nvidia-smi is the share of time at least one kernel was executing; one small kernel back to back reads 100% | F08-30
One unit of work per workload, fifteen workloads (twelve batches, three held against a clock); rows 13 to 15 come from published figures; GPU-hours per run is a cost per unit | F08-81 (batch or clock grouping is our reading)
Three workloads answer to a clock: encode keeps real time (1.0 per camera), the dataloader keeps pace with the GPU, the policy meets a deadline counted in control periods | F08-81, F08-84
Control period is 33.3 ms at 30 Hz | F08-84
Cloud formula: units per currency unit = units per second x 3,600 / price per hour, with a dated first-party price for a named Region and purchase option | F08-82
Divide by the whole instance price; on Spot count only units that finished | F08-82
Price per part: price a workload on the instance built around the part it exhausts first, since every other part is paid for and left idle | F08-85
For the policy stand-in the part is memory bandwidth, 9.8 of the 11.71 GB/s one Jetson core can stream | F08-63, F08-85
Video decoded in software and CPU physics fill CPU cores; CPU instances or a GPU instance with many cores per GPU | F08-85
G7 has 24 physical cores per GPU, twice the 12 of every other eight-GPU x86 size | F08-85 (wave 2 line), F08-58 (wave 2 line)
P5 is an EC2 training instance with H100 GPUs, which have no AV1 decode, so AV1 video is decoded on the CPU (12 cores per GPU on the eight-GPU size) or re-encoded | F08-85, F08-58
Ray-traced camera simulation can be priced only on G families; P-family GPUs lack RT cores | F08-85, F08-58
AV1 is LeRobot's default recording codec | F05-43, section 9
Edge formula: units per joule = units per second / watts | F08-83
Purchase price per unit of rate = price / units per second | F08-83
Units per joule times what a battery holds is the work one charge buys | F08-83, arithmetic
Watts are the whole board's (Jetson VDD_IN covers the board; Spark nvidia-smi is GPU only); dividing by one part's watts raises the result | F08-83 (machine cards), arithmetic
The Spark ran MuJoCo 4.0.1 and the Jetson MuJoCo 3.17.0 | F08-73
No EC2 instance measured | F08-73
NVIDIA states 7 W to 25 W for the Jetson Orin Nano Super Developer Kit | F07-36
Our idle readings: Jetson board about 4.8 W (tegrastats VDD_IN), Spark GPU 10 W (nvidia-smi), single reading; they describe machines doing none of the work, and the Spark figure leaves out the CPU | F08-83
If the board drew no more than 25 W, the stand-in did at least 390 / 25 = 15.6 inferences per joule; the true figure is higher because one core of six was busy and the GPU idle | F08-83, F07-36, Derived
Half-chunk rule: the actions for the time a call took are dropped when its chunk lands; what the chunk lasts minus one call must cover the next call, so a call may take up to half the chunk; no setting repairs a call that is too long | F07-22 (section 17 sets it out in symbols)
GR00T N1.7 benchmark returns 40 actions; 40 / 30 = 1.33 s; half is 20 control periods; 149.0 ms with TensorRT on a Jetson Orin (module not named) = 4.5 periods; 20 / 4.5 = 4.4 (our arithmetic) | F07-2, F07-5, Derived
Mean latency of the stand-in: 1 / 390 s = 2.56 ms per call on the Jetson core (our arithmetic); neither mean nor median sees a rare slow call | F08-84, Derived
A percentile is a miss rate: hold the p99 against the room when one late call in a hundred is tolerable, the worst call when none is | F08-84, F07-22 (logic in view)
NVIDIA's GR00T N1.7 device table reports the median of 60 timed calls | F07-3
Sixty calls hold on average 60 x 0.01 = 0.6 calls beyond the p99; the chance of none is 0.99 to the power 60 = 0.55 (our arithmetic) | F07-3, Derived
No p99 exists in our stand-in or in NVIDIA's table | F08-84
No price was collected for this build | F08-59
Worked examples (machines A and B; a 20 W device; a call every 20 periods, 1.5 calls a second, 67 s; an hour at 1.5 calls a second, 5,400 calls, 54 beyond the p99) | none: invented numbers, wrapped in Toy
