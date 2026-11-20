# Claims: section 11, Augmentation and Synthetic Data

claim | register ID

Cosmos3-Nano writes one 189-frame, 24 fps text-to-video clip at 720p in 207.78 s on an H100 80GB, 114.85 s on a B200, 786.37 s on an RTX PRO 6000 Blackwell (NVIDIA's figures) | F03-98
The three kinds load three machine parts: CPU or training GPU; simulator physics plus rendering; GPU tensor cores and large GPU memory | F05-108
Per added episode: milliseconds of CPU, about 1 to 36 GPU-seconds for a simulated replay, about 20 GPU-minutes for a generated one (our arithmetic) | F05-108
LeRobot image transforms are off by default; enabled, up to 3 of six per frame: brightness (0.8 to 1.2), contrast, saturation, hue, sharpness, small affine move (rotation within 5 degrees, translation up to 5%) | F05-84
LeRobot v0.7.0 adds eight transforms imitating real robot cameras (motion blur, random shadow, JPEG compression, colour temperature shift among them) | F05-86
Transforms apply at training time only; the dataset keeps raw frames, so the recipe can change without re-recording | F05-85
Default backend runs transforms per sample on CPU in the dataloader workers; backend "gpu" runs them per batch on the training GPU, 32 samples at a time, after a one-off compile of 15 to 30 s per image shape; code comment: peak 2.4 GB at 480x640 with a batch of 160 | F05-87
Hugging Face reports ACT training 2.8 times faster on an H100 after moving augmentation to the GPU; no dataset, batch size or CPU given; flag --dataset.image_transforms.backend=gpu | F05-59
Isaac Lab Mimic cuts demonstrations into subtasks, transforms the segments to a new scene, stitches them, runs the candidate and keeps it only if a success check passes; yield from about 70% to under 1% | F05-89
MimicGen (2023): authors report over 50,000 demonstrations across 18 tasks from about 200 human ones | F05-88
Isaac Lab v3.0.0 ships an SO-101 asset and a cube-stacking task for it; no generation time located; Mimic registration not checked | F05-93
Franka cube stacking on one RTX PRO 6000 Blackwell: 1,000 demonstrations in about 15 minutes state-only (1,000 parallel environments), about 1 hour with cameras (300 environments), success about 40% (NVIDIA's figures) | F05-90
GR-1 humanoid pick-and-place: 65 to 80% success, 18 to 40 minutes per 1,000 demonstrations; nut pouring with cameras about 10 hours per 1,000 on an RTX 6000 Ada (NVIDIA's figures) | F05-91
SkillGen: 90 to 120 minutes for 1,000 demonstrations with one environment on an RTX 6000 Ada; about 9.5 GB for one environment, about 22 GB for five (NVIDIA's figures) | F05-92
Cosmos 3 transfer takes a text prompt and a control video (edges, depth, segmentation) and writes a video keeping geometry and changing appearance; Cosmos3-Nano-Sim-Transfer writes up to 600 frames at 30 fps and 480p from simulator-rendered control video | F05-96
The recorded joint actions still describe a transferred video because geometry is kept (our reading) | F05-96
DreamGen recipe: fine-tune a video model on the robot, prompt with first frame and instruction, recover actions with an inverse-dynamics model, train on the result | F05-101
Cosmos 3 is the current family: Nano (16 billion) and Super (64 billion) released May 2026, Edge (4 billion) July 2026; Cosmos-Transfer2.5 and Cosmos-Predict2.5 superseded, limited maintenance; Nano listed for RTX Pro 6000 / H100 / B200, Super for H200 / B200 / GB200 | F05-95
Isaac Lab v3.0.0's augmentation tutorial pins Cosmos Transfer1, the 2025 model | F05-100
Cosmos3-Nano transfer with an edge control: 527.89 s per 720p clip on an H100 80GB (PyTorch); frame count of the rows not published (NVIDIA's figure) | F05-97
Cosmos 3 generates on a grid 32 by 32 times smaller in space than the frame | F03-96
Text-to-video at 480p takes 59.83 s on the H100; the clip is 7.875 s of video; 7.6 GPU-seconds per second of video, 7.6 GPU-hours per hour (our arithmetic from NVIDIA's figure) | F05-98
NIM support matrix floors for Cosmos3-Nano: 58 GiB generation and 64 GiB transfer at BF16 resident, 44 GiB at FP8, 31 GiB with layer offload; Super 150 GiB at BF16; startup minimums of the NIM runtime per device, not measured peaks, no resolution or frame count given | F03-121
Cosmos framework FAQ: 32 GB for Nano, 128 GB for Super, no conditions given; read as weights only (our reading) | F03-123
Measured (agent notes file, one H100 80 GB): Nano peaks at 33.8 GiB for one 1280 x 720 image; about 50.6 to 52.1 GiB through TensorRT-LLM after a 189-frame warm-up; no measured peak for a full video through PyTorch | F03-124
Benchmark tables encode memory fit as GPU count: every Nano row one GPU at 720p, Super's primary PyTorch rows eight; measured setups, not requirements | F03-126
The Cosmos3-Nano model card prints no memory figure | F03-105
A weight-streaming adapter completed all 21 cases on an RTX 5070 (12 GB) with 128 GB of host memory; inference only | F03-125
Superseded model, dated: Cosmos-Transfer2.5-2B, 65.4 GB and 92.25 s on a B200 for a 93-frame 720p chunk at 16 fps (docs at a June 2026 commit) | F05-99
DreamGen on the SO-100: 10 and 13 real demonstrations plus 40 and 50 generated; average success on two tasks from 21% to 45.5% (author reported) | F05-102
DreamGen: 240,000 trajectories took 54 hours on 1,500 L40 GPUs; 81,000 GPU-hours, about 20 GPU-minutes each (our arithmetic) | F05-103
Cosmos3-Nano action-conditioned rollout: about 2.0 s on an H100 80GB; rollout length not published (NVIDIA's figure) | F03-99
The 2025 GR00T-Mimic blueprint, pinned to older tools, asked for a 48 GB RTX card for simulation and a separate node with an 80 GB H100 or better for Cosmos | F05-94
