# Claims: section 1, One Arm, Fifteen Workloads: What Each One Runs On

claim | register ID

The SO-101 follower has six motors | F01-8
The SO-101 examples use two cameras, wrist and top | F01-30
A machine has parts that fill separately (CPU cores, memory, the units inside a GPU); the first to fill sets the speed (our reading) | F08-50
On this arm's pipeline the first part to fill is often a CPU core, on a machine bought for its GPU (our reading) | F08-77
The stand-in is six 1024x1024 float32 matrices, NumPy on one core, one run; 390 passes per second on one Cortex-A78AE core of a Jetson Orin Nano Super; 62.3% of cycles stalled on memory; it is not the arm's policy, which runs on a GPU | F08-62
The stand-in's weights are 25.2 MB, larger than the caches, read once per pass; 390 x 25.2 MB = 9.8 GB/s; the figure sits at that core's measured memory limits (the text prints the 11.71 GB/s streaming figure only) | F08-63
The same core streamed 11.71 GB/s in a loop over arrays larger than the caches (one run) | F08-66
9.8 / 11.71 = 84% (our arithmetic, marked Derived) | F08-63, F08-66
62.3% of cycles wait on memory whatever the speed of the arithmetic (stated from the stall figure) | F08-62
The arm takes a target 30 times a second, one every 33.3 ms; NVIDIA reports a median of 149.0 ms per call of GR00T N1.7 on a Jetson Orin with TensorRT, 4.5 periods (vendor claim) | F07-5
A job on the robot's clock has a deadline per unit where every other shape has a throughput (our reading) | F08-79
Evaluating one policy is 500 simulated episodes, one seed each, as one AWS Batch array job of 500 children that each read their index (the worked example is our reading) | F09-5
The Spot interruption notice is issued two minutes before, on a best-effort basis | F10-520
Batch's documented Spot pattern retries a job whose host was reclaimed; the retried job goes to the front of its queue | F09-10
Shape is three properties: duration, coupling, interruptibility (our reading) | F08-78
An episode frame holds joint readings, motor commands and one image entry per camera | F01-26
Ring diagram tags per stage (rows 1, 2, 4, 5, 7, 8, 9, 10, 12, 13) | F08-76
The table of fifteen workloads: what each is and the part it fills first (rows 1 to 15; row 7 RT cores for RTX renderers) | F08-76
The shape of each workload: fan-out (rows 2, 3, 5, 6, 7, 10, 11, 13), one node for hours (8, 9), many nodes as one (14, 15), always on (row 4 as a standing tier), on the robot's clock (1, 12), and what each loses on a stop | F08-78
Twelve workloads one arm's owner can run on a desk machine or one EC2 instance, three at vendor scale: fifteen (our reading) | F08-75
LeRobot's default video is AV1 written and read by CPU code; the H100 cannot hardware-decode it; rows 1, 2 and 4 share that cause (our reading) | F08-77
The H100 (EC2 P5) cannot hardware-decode AV1 | F05-47
24 vCPUs per GPU, 12 physical cores, on most eight-GPU sizes | F08-57
Isaac Sim 6.2.0 requirements: "GPUs without RT Cores (A100, H100) are not supported." | F06-52
What a job loses on a stop is what it has not yet written, so the checkpoint interval defines a one-node job (our reading) | F08-79
Batch's guidance under Spot: split or checkpoint into parts of 30 minutes or less | F09-11
Decoding 50 episodes is minutes on a laptop; the same code ingesting video continuously is a standing CPU tier; part stays, shape changes (our reading) | F08-80
NVIDIA's benchmarked GR00T N1.7 call returns 40 actions (action horizon 40) | F01-74
40 of 50 and 45 of 50 are not distinguishable; about 199 trials per policy to tell a true 80% from 90% (derived) | F06-97
The EC2 guide says Spot is not suitable for workloads "tightly coupled between instance nodes" | F09-95
