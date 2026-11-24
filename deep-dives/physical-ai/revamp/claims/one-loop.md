# Claims: section 1, One Arm, Fifteen Workloads: What Each One Runs On

claim | register ID

The SO-101 follower has six motors | F01-8
The SO-101 examples use two cameras, wrist and top | F01-30
A machine has parts that run out separately (CPU cores, memory, the units inside a GPU, general compute among them); the part a job exhausts first is its bottleneck (our reading) | F08-50
Sized as "GPU training", the bottleneck is often a CPU core, on a machine bought for its GPU (our reading) | F08-77
The stand-in is six 1024x1024 float32 matrix-vector products, NumPy on one core, one run; 390 passes per second on one Cortex-A78AE core of a Jetson Orin Nano Super; 62.3% of cycles stalled on memory; it is not the arm's policy, which runs on a GPU | F08-62
The stand-in's weights are 25.2 MB, larger than the caches, read once per pass; 390 x 25.2 MB = 9.8 GB/s; the figure sits at that core's measured memory limits (the text prints the 11.71 GB/s streaming figure only) | F08-63
The same core streamed 11.71 GB/s in a loop over arrays larger than the caches (one run) | F08-66
11.71 GB/s / 25.2 MB = 465 passes per second as the expected ceiling; 390 is 84% of it, which is also 9.8 / 11.71 (our arithmetic, marked Derived) | F08-63, F08-66
62.3% of cycles wait on memory whatever the speed of the arithmetic (stated from the stall figure) | F08-62
By default the arm takes a target 30 times a second, one every 33.3 ms; NVIDIA reports a median of 149.0 ms per call of GR00T N1.7 on a Jetson Orin with TensorRT, 4.5 periods (vendor claim) | F07-5, F01-28
A job on the robot's clock has a deadline per unit where every job of another shape has a throughput (our reading) | F08-79
Evaluating one policy is 500 simulated episodes, one seed each, as one AWS Batch array job of 500 children that each read their index (the worked example is our reading) | F09-5
The Spot interruption notice is issued two minutes before, on a best-effort basis | F10-520
Batch's documented Spot pattern retries a job whose host was reclaimed; the retried job goes to the front of its queue | F09-10
Shape is three properties: duration, coupling, interruptibility (our reading) | F08-78
An episode frame holds joint readings, motor commands and one image entry per camera | F01-26
Ring diagram tags per stage: the part that fills first or next in the stage's commonest workloads (our reading; rows 1, 2, 4, 5, 7, 8, 9, 10, 12, 13) | F08-76
The table of fifteen workloads: stage, what each is and the part it exhausts first (rows 1 to 15; row 4 inside training; row 7 RT cores when ray traced; rows 13 to 15 vendor scale) | F08-76
The shape of each workload: independent units (rows 2, 3, 5, 6, 7, 10, 11, 13), one long run (8, 9; row 4 is shown with them because it runs inside the training job), nodes that talk (14, 15), always on (row 4 only as a standing tier; continuous decode of incoming video), on the robot's clock (1, 12), and what each loses on a stop | F08-78
Twelve workloads one arm's owner can run on a desk machine or one EC2 instance, three at vendor scale: fifteen (our reading) | F08-75
LeRobot's default video is AV1 written and read by CPU code; recording, decoding and the dataloader (rows 1, 2 and 4) land on CPU cores for that reason (our reading) | F08-77
The H100 (EC2 P5) cannot hardware-decode AV1 | F05-47
24 vCPUs per GPU, 12 physical cores, on most eight-GPU sizes | F08-57
Isaac Sim 6.2.0 requirements: "GPUs without RT Cores (A100, H100) are not supported." | F06-52
What a job loses on a stop is what it has not yet written, so the checkpoint interval says whether a long run can be bought as Spot (our reading) | F08-79
Batch's guidance under Spot: split or checkpoint into parts of 30 minutes or less | F09-11
Decoding 50 episodes is minutes on a laptop; the same code ingesting video continuously is a standing CPU tier; part stays, shape changes (our reading) | F08-80
NVIDIA's benchmarked GR00T N1.7 call returns 40 actions (action horizon 40); median 22.9 ms on an H100 and 149.0 ms on a Jetson Orin, both with TensorRT (vendor claim) | F01-74
40 of 50 and 45 of 50 are not distinguishable; about 199 trials per policy to tell a true 80% from 90% at 80% power and the 5% level, by the standard two-proportion approximation (derived) | F06-97
The EC2 guide says Spot is not suitable for workloads "tightly coupled between instance nodes" | F09-95
The asynchronous rollout keeps the arm moving only if the actions it holds outlast the call | F01-87
At an illustrative 0.25 m/s, 149.0 ms is 37 mm of travel (speed times delay; our arithmetic, marked Derived) | F01-83, F07-5
40 actions played one per 33.3 ms tick last 1.33 s, about nine times the 149.0 ms call (our arithmetic, marked Derived) | F01-74, F01-28
Multi-node parallel jobs in AWS Batch do not run on Spot compute environments | F09-8
A persistent cluster suits reserved capacity and the many-node tail (the basis for 'a standing cluster on reserved capacity') | F09-112
AWS IoT Greengrass is software on the device that receives deployments from the cloud; on-robot work has no cloud scheduler (our reading) | F07-84
On most eight-GPU instances each GPU has 12 physical cores | F08-57
On-robot inference runs on a machine whose CPU and GPU share one memory, so memory bandwidth is the shared part (row 12, our reading) | F08-76
