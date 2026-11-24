# Claims: section 1, One Arm, Fifteen Workloads: What Each One Runs On

claim | register ID

On this arm's pipeline the first part to fill is often a CPU core, on a machine bought for its GPU (our reading) | F08-77
The policy stand-in is six 1024x1024 float32 matrices, NumPy on one core; 390 inferences per second on one Cortex-A78AE core of a Jetson Orin Nano Super; 62.3% of cycles stalled on memory (single run) | F08-62
The stand-in's weights are 25.2 MB, more than the caches hold, read once per inference; 390 x 25.2 MB = 9.8 GB/s asked (our arithmetic) | F08-63
The same core streamed 11.71 GB/s in a loop over arrays larger than the caches (single run) | F08-66
The stand-in is a dense layer stack on a CPU core where real policies run convolutions and attention on the GPU; the figures are single runs of stand-ins on one core | F08-62, F08-73
The arm takes a target 30 times a second, one every 33.3 ms; NVIDIA reports 149.0 ms per call of GR00T N1.7 on a Jetson Orin, 4.5 periods (vendor claim) | F07-5
A job on the robot's clock has a deadline per unit where every other shape has a throughput; it is not interruptible (our reading) | F08-79, F08-78
Evaluating one policy is 500 simulated episodes, one seed each, as one AWS Batch array job of 500 children that each read their index (the worked example is our reading) | F09-5
The Spot interruption notice is issued two minutes before, on a best-effort basis | F10-520
Batch's documented Spot pattern retries a job whose host was reclaimed, and the retried job goes to the front of its queue | F09-10
Shape is three properties: duration, coupling, interruptibility (our reading) | F08-78
The standard setup is two arms: a leader a person moves by hand and a follower that copies it | F01-2
The SO-101 follower has six motors; five position the arm and the sixth opens and closes the gripper (the split is our reading) | F01-8
The SO-101 examples use two cameras, wrist and top, at 640x480 and 30 frames per second | F01-30
Joint data is 1,440 bytes per second; two cameras are 55.3 MB/s of raw pixels, 38,400 times as much (our arithmetic) | F01-86
A machine has parts that fill separately: CPU cores, memory bandwidth, GPU tensor cores, GPU ray-tracing cores, GPU video engines, GPU memory (our reading) | F08-50
An episode frame holds joint readings, motor commands and one image entry per camera | F01-26
Stage table and diagram tags, stage 1 Collect: CPU cores beside the robot; LeRobot's default encoder is a software AV1 encoder (row 1) | F08-76
Stage 2 Process and curate: CPU cores or the GPU's decode engines; decoding is branchy integer code or a fixed-function engine separate from the tensor cores (row 2) | F08-76
Stage 3 Augment: CPU cores per GPU in the dataloader workers (row 4); GPU memory for generative augmentation (row 13); 24 vCPUs per GPU on most eight-GPU sizes, 12 physical cores | F08-76, F08-57
Stage 4 Simulate: one world per CPU core, branchy scalar code (row 5); cameras fill GPU memory first, then RT cores for RTX renderers (row 7) | F08-76
Stage 5 Train a policy: GPU tensor cores with GPU memory as the gate, unless the dataloader starves it (row 8) | F08-76
Stage 6 Train a world model: GPU tensor cores, lightly (row 9) | F08-76
Stage 7 Evaluate: a mix of physics, cameras and policy inference; episodes independent (row 10) | F08-76
Stage 8 Export and deploy: engine build on the target device (row 11); tensor cores on a shared-memory machine, memory bandwidth the shared part (row 12) | F08-76
Splitting the eight stages by machine part gives twelve workloads runnable for one arm, plus three known at vendor scale: fifteen (our reading) | F08-75
Five shapes: fan-out, one node for hours, many nodes as one, always on, on the robot's clock, with what each loses on a stop (our reading) | F08-78
What a job loses on a stop is what it has not yet written, so a one-node job is defined by its checkpoint interval (our reading) | F08-79
Batch's guidance under Spot: split or checkpoint into parts of 30 minutes or less | F09-11
Decoding 50 episodes is minutes on a laptop; the same code ingesting video continuously is a standing CPU tier; the part stays, the shape changes (our reading) | F08-80
Questions table: six joint angles in and out, one image per camera, 30 times a second | F01-26, F01-28
Questions table: one mistake moves a copied policy to states the demonstrations never covered; a chunk of k actions divides the horizon by k | F02-2, F02-5
Questions table: a VLA is a vision-language model with robot state in and an action chunk out | F02-32
Questions table: 16 seconds per planned action with a latent model against 4 minutes with a video model given one tenth as many samples, one RTX 4090 (author reported) | F03-25
Questions table: a JEPA predicts the representation of one input from the representation of another | F03-47
Questions table: the default SO-101 PPO recipe runs 4,096 simulated arms and about 197 million control steps | F04-58
Questions table: people and agents build and freeze the reset, the success check and the safety limits; these are written rules with no mechanism in the files read that prevents the edit | F04-2, F04-8
Questions table: LeRobot's default video is AV1 written and read by CPU code and the H100 cannot hardware-decode it (our reading) | F08-77
Questions table: Isaac Sim 6.2.0: "GPUs without RT Cores (A100, H100) are not supported." | F06-52
Questions table: domain randomisation varies the simulator until reality falls inside the range; system identification measures the arm and corrects the parameters | F06-66, F06-30
Questions table: one Greengrass component may carry at most 2 GB of artifacts; a policy travels as a container image or an S3 object | F07-87
Questions table: our measurements are single runs of stand-ins on one core, no EC2 instance measured | F08-73
Questions table: the EC2 guide says Spot is not suitable for workloads "tightly coupled between instance nodes" | F09-95
