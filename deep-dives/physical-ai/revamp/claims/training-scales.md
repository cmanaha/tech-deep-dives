# Claims: section 15, Training at Three Scales

claim | register ID

Spot: AWS can take an instance back after a two-minute warning, sent on a best-effort basis | F09-95
AWS's own measurement, one run: 20,000 steps of GR00T N1.7 on a 75-episode SO-101 dataset took 3.4 hours on one ml.g7e.2xlarge (single 96 GB GPU); the post says it is not a speed benchmark | F09-82
GR00T N1.7 pretraining (NVIDIA model card energy estimate): 64 GB200 nodes x 4 GPUs for 120 hours; 256 x 120 = 30,720 GPU-hours (derived in the entry); one run or cumulative not stated | F02-39
30,720 / 3.4 is about 9,000 (our arithmetic) | F02-39, F09-82
AWS's N1.7 run trained the projector and diffusion head with the backbone frozen | F09-82
Training mechanism: a trained weight needs a gradient and optimiser state, the backward pass needs activations per sample, a frozen weight is only read (textbook mechanism kept from the earlier text and promised by section 5; effect evidenced by F02-34, F02-54, F02-80) | F02-34, F02-54, F02-80
GR00T N1 on one A6000: tuning adapter layers and DiT allows batch up to 200; tuning the vision encoder too allows up to 16; 200 / 16 = 12.5 (our arithmetic) | F02-34
GR00T N1.7 has 3,144,016,000 parameters; bf16; 3,144,016,000 x 2 bytes = 6.3 GB (our arithmetic) | F02-37, F02-42
openpi: more than 22.5 GB of GPU memory for LoRA fine-tuning, more than 70 GB for full fine-tuning | F02-54
pi0 has 3 billion parameters | F09-83
(70 - 22.5) / 3 = about 16 bytes per trainable parameter, read as the price of making weights trainable (our arithmetic and reading, labelled in the text) | F02-54, F09-83
3.14 x (16 + 2) = about 57 GB for training every weight of N1.7 before activations (our arithmetic); NVIDIA recommends 80 GB or more per GPU with --tune-llm or --tune-visual | F02-37, F02-42
NVIDIA's default N1.7 recipe (projector and diffusion head, VLM frozen) stays under about 35 GB per GPU; minimum one GPU with 40 GB | F02-42
AWS's LeRobot run of the frozen-backbone setting peaked at 41.5 GB at batch 32; 41.5 > 40, so that batch does not fit a 40 GB card (our arithmetic) | F09-82
LeRobot's pi0 example turns on gradient checkpointing and bf16 to fit a full fine-tune on one GPU; gradient checkpointing "reduces memory usage significantly" (recompute-instead-of-store is the textbook definition) | F02-80
Before LeRobot v0.7.0, --policy.use_peft=true alone ran a full fine-tune; v0.7.0 has one LoRA switch, --peft.method_type=LORA | F02-83
AWS's two N1.7 runs: batch 32 on ml.g7e.2xlarge, 640,000 samples in 3.4 h (about 52 per second, derived in the entry); batch 16 on ml.g6e.2xlarge, 320,000 samples in 4.0 h (about 22 per second, our arithmetic) | F09-82
NVIDIA lists 131.33 samples/s for N1.7 training on an RTX Pro 6000 Blackwell (Isaac-GR00T code); 131.33 / 52 = 2.5 (our arithmetic); the g7e GPU is the RTX PRO 6000 Blackwell Server Edition; AWS's run used LeRobot | F02-42, F08-53, F09-82, F09-81
Data parallelism: each GPU holds a copy and a share of the batch; batch per update = per-GPU batch x GPUs (textbook definition; the identity is shown in F03-13 and F03-21) | F03-13, F03-21
SmolVLA pretraining used 4 GPUs to accommodate a large batch (global batch 256); the authors say it can easily be trained on a single GPU | F02-59
Chart rows: GR00T 2 LoRA 30 min on RTX 5090; ACT 30 to 60 min on RTX 4090/3090; N1.7 3.4 h; SmolVLA 4 h on A100; pi0.5 10.9 h; OpenVLA-OFT 8 x 31.6 h; pi0-FAST 8 x 96 h; X-VLA 64 x 96 h; N1.7 256 x 120 h; N1 roughly 50,000 H100 GPU-hours | F02-46, F01-90, F09-82, F02-63, F04-70, F02-28, F02-71, F02-39, F02-34
AWS's N1.7 run is called post-training in the post and ran on one GPU | F09-82
V-JEPA 2-AC is trained on under 62 hours of robot video with the encoder frozen | F03-1
V-JEPA 2-AC released config: 4 nodes of 8 GPUs at 8 clips per GPU, batch 256; GPU model and wall-clock not stated | F03-21
ACT: about 80M parameters, trained from scratch per task in about 5 hours on one 11 GB RTX 2080 Ti (author reported) | F02-9
LeRobot hardware guide (indicative): about 50 episodes of 30 s, 5 epochs, batch 8 (ACT) and 4 (pi0); ACT 30 to 60 min on one RTX 4090 or 3090; pi0 or pi0.5 4 to 8 h on one A100 40 GB; real runs deviate +/-50%; at 60 s episodes 90,000 frames and each time doubles (derived in the entry) | F01-90
LeRobot decodes and augments on CPU cores in the dataloader workers, so cores beside the GPU cap frames per second | F05-107
Single-GPU sizes run from 4 vCPUs (g6e.xlarge) to 64 (g6e.16xlarge); most eight-GPU sizes carry 24 vCPUs per GPU, 12 physical cores | F08-57
GR00T on AWS Batch: 6000 steps, checkpoints every 2000 steps, "usually takes up to 2 hours on a g6e.4xlarge instance"; up to a third of the run, at most 40 minutes, lost to an interruption (our arithmetic) | F09-114
Batch Spot guidance: parts of 30 minutes or less; 6000 x 30 / 120 = 1,500 steps at the 2-hour ceiling (our arithmetic) | F09-11
SageMaker Training Jobs start instances for one job and shut them down; AWS's post uses --spot for managed Spot prices and passes a priority list of instance types | F09-81, F09-82
Managed Spot training: EnableManagedSpotTraining, MaxWaitTimeInSeconds larger than MaxRuntimeInSeconds; checkpoints copied local to S3 and back; resumes from last checkpoint; does not fall back to on-demand | F10-536
pi0-FAST about 4 days on 8 H100, 3B-parameter VLA; 8 x 96 = 768 GPU-hours (derived in the entry); 768 / 24 = 32 days on one GPU at the same GPU-hours (our arithmetic) | F02-28
FSDP shards weights, gradients and optimiser state (textbook definition); AWS's pi0 example uses FSDP sharding on one ml.p5.48xlarge (8 H100) | F09-83
openpi's PyTorch port lacks FSDP and LoRA; those need the JAX path | F02-55
OpenVLA-OFT (7B) RL on one p5en.48xlarge (8 H200): 31.6 hours of training, measured single run. No dollar figure printed | F04-70
Earlier 8 x H100 RL run: about 27 minutes per step, checkpoints of steps 25, 50 and 75; 25 x 27 = 675 minutes, about 11 hours (our arithmetic); 40 h cap hit at step 83 of 100; timeout ended the script before the latest checkpoint was uploaded; instance terminated with the checkpoints of steps 25, 50 and 75 on its disk; the eight steps after the last save are about 8 x 27 = 216 minutes on 8 GPUs, 29 GPU-hours (our arithmetic) | F04-71
EKS guide, large models: fast local every 5 to 30 minutes for transients, durable hourly for major failures | F10-535
HyperPod pi0 example: data and checkpoints on FSx for Lustre, image cached, new job starts at once; Training Job "~5 min cold start" | F09-83
31 October 2026 (one evening): no On-Demand 8 x 80 GB instance of the list free in three Regions; the run fell back to Spot | F04-71
Capacity Blocks cover P and Trainium types only; no G family | F09-91
Training plans list no G-family type | F09-35
Telexistence fine-tuned DreamZero (14 billion parameters, world action model) on one p6-b200.48xlarge reserved with Capacity Blocks | F09-88
30,720 / 8 = 3,840 hours, 160 days on one node of eight at the same GPU-hours (our arithmetic) | F02-39
V-JEPA 2 ViT-L pretraining config: 16 nodes x 8 GPUs x 24 clips = global batch 3,072 | F03-13
Illustration: a bf16 gradient for every N1.7 weight is 6.3 GB; at 50 Gbps (6.25 GB/s, g7e.2xlarge) about a second, at 3,200 Gbps (p5.48xlarge) about 16 ms, both floors (our arithmetic; gradient-exchange volume is the textbook data-parallel mechanism) | F08-49, F02-37
Yardstick for the exchange: a step of AWS's frozen-backbone g7e run took about 32 / 52 = 0.62 s; a 1 s exchange would more than double it, 16 ms would add about 0.016 / 0.62 = 3% (our arithmetic, illustration) | F09-82, F08-49
EFA bypasses the kernel and uses AWS's own reliable datagram transport so many machines can train as one | F08-48
g6e.4xlarge 20 Gbps no EFA; g7e.2xlarge 50 Gbps no EFA; p5.48xlarge 3,200 Gbps with EFA | F08-49
EFA cannot cross Availability Zones; HyperPod deploys in a single AZ by default | F09-36
Batch EFA jobs need all instances in the same cluster placement group | F09-9
Synchronous multi-node training cannot be interrupted without losing the whole step on every node (our reading) | F08-78
Checkpointless training: recovers a failed node's state from healthy peers; AWS reports over 80% less downtime in internal studies on 16 to over 2,000 GPUs; NeMo-based; documented recipes are language models | F09-30
Managed tiered checkpointing: CPU memory, replicated to adjacent nodes, periodically persisted to durable storage such as S3; PyTorch on EKS-orchestrated HyperPod | F09-31
Spot "not suitable for workloads that are ... tightly coupled between instance nodes" | F09-95
Batch MNP jobs do not run on Spot compute environments | F09-8
AWS HPC post (Slurm, three injected interruptions): a 3 h 25 min tightly coupled simulation on checkpointed Spot took 14% longer and cost 55% less (vendor claim) | F10-58
Training plans: P and Trainium types, 1 to 182 days, up to 8 weeks ahead, quantities up to 64 | F09-34
GR00T N1: roughly 50,000 H100 GPU-hours, up to 1,024 GPUs | F02-34
LeRobot's N1.7 example: batch 64, 20,000 steps; 1,280,000 samples at 192.57 samples/s on an H100 is about 1.8 h (derived illustration in the entry); at 52 samples/s about 6.8 h (our arithmetic, illustration) | F02-81, F02-42, F09-82
Section 20 sorts jobs into shapes partly by what a stop costs (back to the last checkpoint); section 24 gives each training workload a scheduler | cross-reference, checked in Workloads.tsx and AwsOrchestration.tsx
Not printed: the cost of the RL run and the 57 GB checkpoint size in the register 04 table (no entry quote carries it) | F04-70
