# Claims: section 15, Training at Three Scales

claim | register ID

AWS's own measurement, one run: 20,000 steps of GR00T N1.7 on a 75-episode, two-camera SO-101 dataset took 3.4 hours on one ml.g7e.2xlarge (single GPU) at batch 32; the post says it is not a speed benchmark | F09-82
Same table: GR00T N1.7 4.0 hours on ml.g6e.2xlarge at batch 16; pi0.5 with all weights 10.9 hours on ml.g6e.xlarge at batch 8 | F09-82
Peak GPU memory in AWS's runs: ACT 15 GB at batch 32; GR00T N1.7 with backbone frozen 41.5 GB at batch 32 | F09-82
AWS's post passes a priority list of instance types; the job starts on the first with capacity | F09-82
AWS's post of 19 November 2026 trains ACT, GR00T N1.7 and pi0.5 with LeRobot 0.6.1 on an SO-101 pick-and-place dataset, same container on Training Jobs and HyperPod | F09-81
"Post-training" in Meta's usage: V-JEPA 2-AC trained on under 62 hours of robot video with the encoder frozen | F03-1
LeRobot hardware guide (indicative): ACT 30 to 60 minutes on one RTX 4090 or 3090; SmolVLA 3 to 6 hours on one L4 or A10G; pi0 or pi0.5 4 to 8 hours on one A100 40 GB; 5 epochs, about 50 episodes of 30 s, 45,000 frames; real runs deviate +/-50% | F01-90
At the recorder's default 60 s episode the same 50 episodes are 90,000 frames and each time doubles (derived in the entry) | F01-90
openpi: more than 22.5 GB of GPU memory for LoRA fine-tuning, more than 70 GB for full fine-tuning | F02-54
GR00T N1.7 fine-tuning: minimum one GPU with 40 GB, VLM frozen by default; 80 GB or more per GPU recommended when the backbone trains | F02-42
SmolVLA: 20,000 steps at batch size 64, roughly 4 hours on a single A100, from the 450M checkpoint with about 50 episodes (LeRobot's figure) | F02-63
ACT from scratch per task: about 5 hours on one 11 GB RTX 2080 Ti (author reported) | F02-9
GR00T on AWS Batch: 6000 steps "usually takes up to 2 hours on a g6e.4xlarge instance" | F09-114
GR00T 2 (NVIDIA's report): one LoRA fine-tune of about 30 minutes on an RTX 5090 per task, on 50 tasks NVIDIA selected as learnable from five episodes | F02-46
pi0-FAST (author reported): 240k iterations at batch size 256, about 4 days on 8 H100 GPUs, 3B-parameter VLA; 8 x 96 h = 768 GPU-hours (derived in the entry) | F02-28
OpenVLA-OFT (7B) RL post-training on one p5en.48xlarge (8 H200): 31.6 hours of training, measured single run; 8 x 31.6 = 252.8 GPU-hours (our arithmetic). No dollar figure printed | F04-70
Telexistence fine-tuned DreamZero (14 billion parameters) on one p6-b200.48xlarge (eight B200) reserved with Capacity Blocks for ML; no scheduler named, no duration printed | F09-88
AWS pi0 (3 billion parameters) example on one ml.p5.48xlarge (eight H100) under HyperPod with 1.2 TiB FSx for Lustre; a Training Job has "~5 min cold start" | F09-83
X-VLA pretraining (author reported): 64 A100 GPUs, about 4 days, 290K episodes; 64 x 96 h = 6,144 GPU-hours (our arithmetic; the entry rounds to about 6,100) | F02-71
GR00T N1.7 pretraining (NVIDIA model card energy estimate): 64 GB200 nodes x 4 GPUs for 120 hours; 256 x 120 = 30,720 GPU-hours (derived in the entry); one run or cumulative not stated | F02-39
GR00T N1 pretraining: roughly 50,000 H100 GPU-hours, up to 1,024 GPUs for a single model | F02-34
6,144 / 3.4 is about 1,800 (our arithmetic) | F02-71, F09-82
Cosmos 3 pretraining: Nano on 1,024 GB200 GPUs, Super on 2,048; days not stated | F03-97
V-JEPA 2 prints only a projection: roughly 60 GPU-years on A100s at full resolution; progressive resolution cuts GPU time by 8.4x; actual run not stated | F03-12
JEPA world models off the axis: LeWorldModel "a single GPU in a few hours" (GPU not named); V-JEPA 2-AC a 32-GPU job for 94,500 iterations; RoboJEPA-1B 256 H100 GPUs | F03-119
SageMaker training plans: 1 to 182 days, quantities of 1, 2, 4, 8, 16, 32 or 64 instances, bookable up to 8 weeks ahead; GB200 UltraServers through an account manager | F09-34
Checkpointless training: AWS reports over 80% less downtime in internal studies on 16 to over 2,000 GPUs; documented recipes are language models; no robot-policy or world-model example located in this research | F09-30
Not printed: the cost estimates of the AWS toolchain sample (entry not cited in the section) | F09-75
