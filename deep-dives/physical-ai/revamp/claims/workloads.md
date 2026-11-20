# Claims: section 20, Fifteen Workloads, Five Shapes

claim | register ID

The machine is grouped into nine parts on the chip plus storage and network outside it; four CPU and memory parts, five GPU parts (the dive's grouping) | F08-50
The front end is the part of a core that fetches and decodes instructions; it is full when the executing part is ready and no decoded instruction arrives | F08-4
The back end executes the decoded instructions; it is full, with little waiting on memory, when the arithmetic units are busy or operations depend on each other | F08-6
Memory bandwidth (rate limit) and memory latency (time per access) are two separate limits | F08-41
Tensor cores execute matrix multiply-accumulate instructions; DCGM tensor activity is the fraction of cycles the tensor pipeline was active | F08-42, F08-32
General GPU compute is the integer and floating-point units inside each streaming multiprocessor; SM activity is its counter | F08-36, F08-32
RT cores speed up the search for which triangle a ray hits | F06-57
No RT-core utilisation counter was located in this research | F08-36
nvidia-smi reports encoder and decoder utilisation apart from the compute figure | F08-31
DRAM activity is the fraction of cycles data moved to or from device memory | F08-32
Storage throughput has a per-instance ceiling set by the instance type | F08-46
ENA is ordinary IP networking; EFA bypasses the operating system so many machines can train as one | F08-48
Policy stand-in (six 1024x1024 float32 matrix-vector products, one core): 390 inferences/s on the Jetson Orin Nano Super's Cortex-A78AE, 62.3% of cycles stalled on memory; Tier 0, single run | F08-62
Stand-in weights are 6 x 1024 x 1024 x 4 bytes = 25.2 MB; 390 x 25.2 MB = 9.8 GB/s against 11.71 GB/s streamed by a loop sweeping arrays larger than the caches on the same core | F08-63, F08-66
Memory bandwidth from one core: 44.38 GB/s on the DGX Spark's Cortex-X925, 3.8 times the Jetson core; Tier 0, single run | F08-66
Memory latency: 291.58 ns per load on the Jetson core, 123.96 ns on the X925, a gap of 2.4 times; Tier 0, single run | F08-67
Limits of our measurements: one run, one core, stand-in programs, no EC2 instance; MuJoCo 4.0.1 on the Spark and 3.17.0 on the Jetson | F08-73
The H100 has no hardware video encoder and cannot hardware-decode AV1 | F05-47
The G7 family's GPU carries tensor cores, RT cores and both kinds of video engine | F08-43
Fifteen = eight phases split wherever two steps load different parts (twelve) plus three vendor-scale workloads (our reading) | F08-75
The workload by part matrix: which part saturates first per workload (our reading) | F08-76
Recording, decoding and the dataloader are one cause: AV1 written and read by CPU code, on GPUs that cannot decode it or have no row in NVIDIA's matrix | F08-77
Most eight-GPU sizes have 24 vCPUs per GPU, which is 12 physical cores; g7.48xlarge has 24 physical cores per GPU; single-GPU sizes run from 4 to 64 vCPUs | F08-57
Record and encode: LeRobot's default encoder is software AV1 | F05-35
The Jetson Orin Nano has no hardware video encoder | F05-57
Two 640x480 cameras at 30 fps produce 55.3 MB/s of raw pixels | F01-86
Hardware AV1 decode on EC2 is possible on G6, G6e, G7, G7e and not on P5 | F05-67
One cancelled curation run left 32 H100s at about 17% utilisation because fetching clips was slow | F05-76
LeRobot: with default settings "the GPU ends up waiting for data" | F05-58
One mj_step is 26 stages | F06-9
CPU physics (MuJoCo humanoid stand-in, one core): 14,507 steps/s Jetson A78AE, 28,662 Spark A725, 57,240 Spark X925; X925 36.5% back-end bound, 0.4% memory stall; Tier 0, single run | F08-61
GPU physics loads general GPU compute, not tensor cores (our reading) | F08-42
MuJoCo Warp reports 5.77 million steps/s for a humanoid across 8192 worlds on one RTX 6000 Ada | F06-20
One small camera per environment took a Cartpole run to 57.3 GB and cut throughput by a factor of 6.7 | F06-48
ACT trains in 30 to 60 minutes on one RTX 4090 or 3090 on about 50 episodes (indicative) | F01-90
LeWorldModel, about 15M parameters, trains on a single GPU in a few hours; GPU not named | F03-31
Isaac Lab-Arena: eight independent runs took 1,255.2 s on one L40 and 157.8 s on eight, "a 7.95x speedup", physics only | F06-93
A TensorRT engine build runs on the target device and takes about 2 to 5 minutes | F07-8
GR00T N1.7 takes 149.0 ms per call on a Jetson Orin, 4.5 control periods at 30 Hz | F07-5
Cosmos3-Nano takes 207.78 s for one 720p clip on an H100 80GB | F05-98
GR00T N1 pretraining took roughly 50,000 H100 GPU-hours on up to 1,024 GPUs | F02-34
Cosmos3-Nano was pretrained on 1,024 GB200 GPUs; duration not stated | F03-97
Five shapes A to E defined by duration, coupling and interruptibility, with their workloads (our reading) | F08-78
Coupling maps to the training fabric, interruptibility to storage and checkpoints, duration against the robot's clock to latency (33.3 ms at 30 Hz) | F08-79
One workload can change shape with scale while loading the same part (decode: shape A for one arm, shape D as a standing tier) | F08-80
GPU memory per GPU on EC2 spans 2.79 GiB (g6f.large) to 268 GiB (p6-b300.48xlarge), a factor of almost 100 | F08-45
Network spans 2.5 Gbps without EFA (g6.xlarge) to 6,400 Gbps with EFA (p6-b300.48xlarge); 6,400 / 2.5 = 2,560 | F08-49
EBS throughput spans 125 MB/s baseline (g6.xlarge) to 12,500 MB/s (g7e.48xlarge, p5en.48xlarge); one arm's 55.3 MB/s is under half of the low end | F08-46
nvidia-smi "GPU utilisation" is the percentage of time one or more kernels was executing; one small kernel back to back reads 100% | F08-30
DCGM SM activity of 0.8 or more is "necessary, but not sufficient" for effective use | F08-32
The loop figure: six stages, the machine part each loads (our reading) | F08-76, F08-78
The loop figure, service row: a Batch array job with one child per shard or seed, retried on Spot reclaim | F09-5, F09-10
The loop figure, service row: recordings land in S3, simulation on Batch and EKS, training on Batch and SageMaker, deployment through AWS IoT Greengrass | F09-80, F07-84
The loop figure, service row: SageMaker Training Jobs or HyperPod for training; HyperPod or managed Slurm (PCS) for many nodes | F09-81, F09-84, F09-109
What each of the fifteen workloads does for the arm, grouped by loop stage (our reading) | F08-75, F08-76
The DGX Spark and the Jetson Orin Nano Super are the two machines of our measurements; both share one memory between CPU and GPU | F08-60, F08-76
