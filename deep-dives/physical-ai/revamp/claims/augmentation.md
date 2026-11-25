# Claims: section 11, Augmentation and Synthetic Data

claim | register ID

Cosmos3-Nano writes one 189-frame, 24 fps text-to-video clip at 720p in 207.78 s on an H100 80GB, 114.85 s on a B200, 786.37 s on an RTX PRO 6000 Blackwell (NVIDIA's figures) | F03-98
At 720p the H100 spends 207.78 / 7.875 = 26.4 GPU-seconds per second of video (arithmetic shown) | F03-98
The three kinds load three machine parts: CPU or training GPU; simulator physics plus rendering; GPU tensor cores and large GPU memory | F05-108
Per added item: milliseconds of CPU per image (our estimate), about 1 to 36 GPU-seconds for a simulated episode, about 20 GPU-minutes for an invented one (our arithmetic) | F05-108
LeRobot image transforms are off by default; enabled, up to 3 of six per frame: brightness and contrast (0.8 to 1.2), saturation and sharpness (0.5 to 1.5), hue (within 0.05 either way), small affine move (rotation within 5 degrees, translation up to 5%) | F05-84
The actions are not adjusted to the picture, so a rotation range raised far past 5 degrees would show a motion the stored actions no longer describe (logical consequence of the code, stated plainly) | F05-84
LeRobot v0.7.0 adds eight transforms imitating real robot cameras (Gaussian noise, motion blur, JPEG compression, bright patch, random shadow, dropped rectangles, gamma change, colour temperature shift); none is in the default set | F05-86
Transforms apply at training time only; the dataset keeps raw frames, so the recipe can change without re-recording | F05-85
Default backend runs transforms per sample on CPU in the dataloader workers; backend "gpu" runs them per batch on the training GPU, 32 samples at a time, after a one-off compile of 15 to 30 s per image shape; code comment, two frames per sample at 480x640 and a batch of 160: peak 2.4 GB with the default chunk against 6.3 GB with no chunking | F05-87
The workers' cores are a fixed budget: 24 vCPUs per GPU on most eight-GPU EC2 sizes | F05-107
Hugging Face reports ACT training 2.8 times faster on an H100 and 3.3 times faster on an A100 after moving augmentation to the GPU; no dataset, camera count, batch size or CPU given; flag --dataset.image_transforms.backend=gpu | F05-59
Isaac Lab Mimic cuts demonstrations into subtasks, transforms the segments to a new scene, stitches them, runs the candidate and keeps it only if a success check passes; yield from about 70% to under 1% | F05-89
Candidates simulated per episode kept are one divided by the yield: 2.5 at 40%, 100 at 1% (our arithmetic, shown) | F05-89, F05-90
MimicGen (2023): authors report over 50,000 demonstrations across 18 tasks from about 200 human ones, 250 per human demonstration | F05-88
Isaac Lab v3.0.0 ships an SO-101 asset and a cube-stacking task for it; no published generation time located in this research; Mimic registration to be checked by the reader (not checked in the research) | F05-93
Franka cube stacking on one RTX PRO 6000 Blackwell: 1,000 demonstrations in about 15 minutes state-only (1,000 parallel environments), about 1 hour with cameras (300 environments), success about 40%; with cameras 4 times as long (NVIDIA's figures) | F05-90
GR-1 humanoid pick-and-place: 65 to 80% success, 18 to 40 minutes per 1,000 demonstrations, 19 minutes on an RTX 6000 Ada at 80%; nut pouring with cameras about 10 hours per 1,000 on the same card (NVIDIA's figures); 1.1 against 36 GPU-seconds per demonstration, a 30-fold spread (our arithmetic) | F05-91
SkillGen: 90 to 120 minutes for 1,000 demonstrations with one environment on an RTX 6000 Ada; about 9.5 GB for one environment, about 22 GB for five; at least 24 GB recommended for one or two environments, 48 GB for up to about five; gain from more than one environment not very significant (NVIDIA's figures) | F05-92
Cosmos 3 transfer takes a text prompt and a control video (edges, depth, segmentation) and writes a video keeping geometry and changing appearance; Cosmos3-Nano-Sim-Transfer writes up to 600 frames at 30 fps and 480p from simulator-rendered control video | F05-96
Visual augmentation changes lighting, textures and backgrounds "while preserving the original motion and actions" (Isaac Lab docs), so the recorded actions still label a transferred clip | F05-100
DreamGen recipe: fine-tune a video model on the robot, prompt with first frame and instruction, recover pseudo-actions with an inverse-dynamics model, train on the result | F05-101
Cosmos 3 is NVIDIA's current family; Cosmos3-Nano (16 billion parameters) listed for RTX Pro 6000 / H100 / B200, Cosmos3-Super (64 billion) for H200 / B200 / GB200 | F05-95
Isaac Lab v3.0.0's augmentation tutorial pins Cosmos Transfer1, a 2025 model two generations behind Cosmos 3 | F05-100
Cosmos3-Nano transfer with an edge control on an H100 80GB (PyTorch): 148.65 s per clip at 480p, 527.89 s at 720p; frame count of the rows not published (NVIDIA's figures); an illustrative 50 clips at 480p is 50 x 148.65 s = 2.1 GPU-hours (our arithmetic) | F05-97
Cosmos 3 generates on a grid 4 times smaller in time and 32 by 32 times smaller in space; a 189-frame 720p clip is (189 / 4) x (720 / 32) x (1280 / 32), on the order of 42,000 cells | F03-96
Text-to-video at 480p takes 59.83 s on the H100; the clip is 7.875 s of video; 59.83 / 7.875 = 7.6 GPU-seconds per second of video, 7.6 GPU-hours per hour (arithmetic shown) | F05-98
NIM support matrix floors for Cosmos3-Nano: 58 GiB generation and 64 GiB transfer at 16-bit resident, 44 GiB with 8-bit weights, 31 GiB with layer offload; Super 150 GiB at 16-bit; startup minimums the container checks, per device, not measured peaks, no resolution or frame count given; Nano at full precision is a job for an 80 GB class card, a 48 GB card needs 8-bit weights or offload | F03-121
Cosmos framework FAQ: 32 GB for Nano, 128 GB for Super, no conditions given; 16 billion parameters at 2 bytes each is 32 GB, so it matches the weights alone | F03-123
Measured (agent notes file, one H100 80 GB): Nano peaks at 33.8 GiB for one 1280 x 720 image; about 50.6 to 52.1 GiB through TensorRT-LLM after a 189-frame warm-up; no measured peak for a full video through PyTorch | F03-124
Benchmark tables encode memory fit as GPU count: every Nano row one GPU at 720p, Super's primary PyTorch rows eight; measured setups, not requirements | F03-126
A weight-streaming adapter completed all 21 cases on an RTX 5070 (12 GB) with 128 GB of host memory; inference only | F03-125
DreamGen on the SO-100: 10 and 13 real demonstrations plus 40 and 50 generated; average success on two tasks from 21% to 45.5% (author reported) | F05-102
DreamGen: 240,000 trajectories took 54 hours on 1,500 L40 GPUs; 81,000 GPU-hours, about 20 GPU-minutes each (our arithmetic) | F05-103
The 2025 GR00T-Mimic blueprint, pinned to older tools, asked for a 48 GB RTX card for simulation and a separate node with an 80 GB H100 or better for Cosmos | F05-94
