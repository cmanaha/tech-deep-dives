# Claims: section 2, Getting Started: Four Ideas and Three Routes

claim | register ID

LeRobot's default rate is 30 per second, 33.3 ms per tick; 50 episodes of up to 60 s with 60 s reset by default | F01-28
The observation is six joint angles and one image per camera; the action is six target joint angles; a row holds observation.state and action as six float32 each | F01-26
LeRobot's documented timing sample at 30 Hz, no hardware named: work mean 18.7 ms, policy mean 5.18 ms, "cycles over the 33.3 ms work budget: 12/1197 (1.0%)", worst cycle 48.1 ms, worst policy call 40.00 ms | F07-23
Published first-party latency figures give medians only; no p99 exists there or in our runs | F08-84
With a synchronous rollout "the robot stops moving every time the policy computes its next chunk of actions"; continuous execution needs "enough usable action playback to cover inference latency and its variation" | F01-87
Readings and targets are 1,440 bytes per second; two 640x480 cameras are 55.3 MB/s raw, 38,400 times as much (derived) | F01-86
A public 50-episode pick-and-place dataset named for the SO-101: 86.1 MB, 11,939 frames, two AV1 video files of 45.5 MB and 40.1 MB, one 0.37 MB row file | F05-29
50 x (60 + 60) s = up to 100 minutes at the bench (our arithmetic on the defaults, marked Derived) | F01-28
An AWS post reports 3.4 hours on ml.g7e.2xlarge and a peak of 41.5 GB of GPU memory for one 20,000-step GR00T N1.7 run on 75 SO-101 episodes at batch 32, backbone frozen (author reported) | F09-82
NVIDIA's benchmark of one GR00T N1.7 call, with TensorRT: median 22.9 ms on an H100, 149.0 ms on a Jetson Orin; 357.9 ms in PyTorch eager on the Orin; each call returns 40 actions (vendor claim) | F01-74
Engines are built on the target device in about 2 to 5 minutes and must be rebuilt for different GPUs | F07-8
A computer is several parts with separate rates; the first to fill sets the speed (our reading) | F08-50
LeRobot's hardware guide: Diffusion Policy 0.167 s per update at batch 32 on 4 H100 (vendor reported) | F01-91
A LeRobot pull request measured about 5 ms per single item, one process, hardware not stated (author reported) | F05-62
32 / 0.167 = 192 samples a second; 192 x 5 ms = 0.96 s of decode per second, about one core for four GPUs (our arithmetic, marked Derived) | F01-91, F05-62
With per-sample transforms in the dataloader workers "the GPU ends up waiting for data" | F05-58
nvidia-smi GPU utilisation is the share of time at least one kernel was executing | F08-30
Decode belongs on CPU instances or on the GPU instance with the most cores per GPU (our reading) | F08-85
The world models route includes sections 3 and 4 because section 7 uses action, chunk and control rate | SCOPE.md plan change C1 (no register entry; navigation)
