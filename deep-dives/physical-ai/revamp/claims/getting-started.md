# Claims: section 2, Getting Started: What Changes When the Model Drives a Robot

claim | register ID

LeRobot's default rate is 30 per second, 33.3 ms per tick; 50 episodes of up to 60 s with 60 s reset by default | F01-28
The observation is six joint angles and one image per camera; the action is six target joint angles; a row holds observation.state and action as six float32 each | F01-26
LeRobot's documented timing sample at 30 Hz, no hardware named: work mean 18.7 ms, policy mean 5.18 ms, "cycles over the 33.3 ms work budget: 12/1197 (1.0%)", worst cycle 48.1 ms, worst policy call 40.00 ms | F07-23
Each figure in NVIDIA's benchmark is the median of 60 timed calls; the figures time calls on fixed inputs and do not measure closed-loop task success | F07-3
Per the docs a high infer share "points at the policy or the device", a high observe share "points at the cameras"; record worst 620.00 ms in the sample | F07-24, F07-23
In LeRobot's default synchronous mode the arm stops while the policy computes its next chunk; the asynchronous modes keep it moving only if the actions in hand outlast the call and its variation | F01-87
Readings and targets are 1,440 bytes per second; two 640x480 cameras are 55.3 MB/s raw, 38,400 times as much (derived) | F01-86
A public 50-episode pick-and-place dataset named for the SO-101: 86.1 MB, 11,939 frames, two AV1 video files of 45.5 MB and 40.1 MB, one 0.37 MB row file; video is still about 230 times the rows (our arithmetic, marked Derived) | F05-29
50 x (60 + 60) s = up to 100 minutes at the bench (our arithmetic on the defaults, marked Derived) | F01-28
An AWS post's timing table: 3.4 hours for one 20,000-step GR00T N1.7 fine-tune on 75 SO-101 episodes at batch 32 on ml.g7e.2xlarge; its memory table: peak 41.5 GB of GPU memory at batch 32 with the backbone frozen (author reported; two tables, not joined as one run) | F09-82
NVIDIA's benchmark of one GR00T N1.7 call, with TensorRT: median 22.9 ms on an H100, 149.0 ms on a Jetson Orin; 357.9 ms in PyTorch eager on the Orin; each call returns 40 actions (vendor claim); 40 x 33.3 ms = 1.33 s, about nine times the call (our arithmetic, marked Derived) | F01-74, F01-28
Engines are built on the target device in about 2 to 5 minutes and must be rebuilt for different GPUs | F07-8
A machine is several parts; one fills while the others sit partly idle (our reading) | F08-50
LeRobot's hardware guide: Diffusion Policy 0.167 s per update, of which data loading 0.015 s, 9% of the step (our arithmetic, marked Derived), at batch 32 on 4 H100 (vendor reported) | F01-91
By default the transforms run per sample in the dataloader workers; with several cameras that is often the most expensive thing the workers do and "the GPU ends up waiting for data"; backend=gpu has the workers decode only and applies the transforms per batch on the policy device | F05-58
The H100 cannot hardware-decode AV1; LeRobot's stock loader decodes on CPU cores on every card (our reading) | F05-47, F08-77
On AGX Thor, quantising to mixed NVFP4 cuts the call from 76.8 ms to 35.6 ms (vendor claim) | F07-4
The build verifies outputs against PyTorch, expected cosine similarity 0.999 or higher | F07-8
nvidia-smi GPU utilisation is the share of time at least one kernel was executing | F08-30
Decode belongs on CPU instances or on the GPU instance with the most cores per GPU (our reading); most eight-GPU sizes have 12 physical cores per GPU, g7.48xlarge 24, the most among eight-GPU x86 sizes | F08-85, F08-57
The world models route includes sections 3 and 4 because section 7 uses action, chunk and control rate | SCOPE.md plan change C1 (no register entry; navigation)
Action chunking: one call predicts the next k actions from one observation | F02-5
Record worst 620.00 ms is more than 18 ticks of 33.3 ms (our arithmetic, marked Derived) | F07-23
Hugging Face reports ACT training 2.8 times faster on an H100 with image augmentation moved to the GPU, with no dataset, camera count or batch size given (vendor claim); 1 - 1/2.8 = 64% of each step waiting (our arithmetic, marked Derived) | F05-59
GPU memory of the EC2 G families' GPUs: 24 GB (G5, G6), 48 GB L40S (G6e), 96 GB (G7e) | F06-58
Two cameras' raw pixels are 38,400 times the bytes of the joint readings and targets (opening paragraph) | F01-86
