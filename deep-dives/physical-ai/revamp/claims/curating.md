# Claims: section 10, Processing and Curating

claim | register ID

On most eight-GPU EC2 sizes the CPU budget is 24 vCPUs per GPU, fixed by the instance type | F05-65
At arm scale curation is done by hand: watch the 50 episodes, delete failed ones by index with lerobot-edit-dataset, which recomputes statistics | F05-81
Cosmos Curator is a toolkit for curating physical AI training data, at v2.10.0 (2026-11-10), run on Ray | F05-68
Its reference pipeline has seven stages: download, decode and split, transcode to H.264, filter on motion and aesthetics, embed, caption with a vision-language model, write | F05-69
Stage defaults tuned for a 48 GB GPU: frame decode 3 CPUs per worker, transcode 5, captioning-input preparation 3; shot-detection, aesthetic and embedding models 0.25 of a GPU per worker, motion filter 0.5 | F05-71
Captioning-input preparation is a separate CPU stage so that many CPU workers keep the GPU captioning workers busy | F05-70
Cosmos Curator has a GPU decode path, keeps GPU transcoding for cards with NVENC, and defaults to a CPU encoder because the A100 and H100 have no encoder engine; FFmpeg GPU decode performed the same as FFmpeg CPU decode | F05-77
Deduplication is a second pipeline that clusters the stored clip embeddings and drops near copies (diagram 10.1) | F05-73
No throughput figure for Cosmos Curator v2.10.0 was located in this research; the one published figure is from a March 2025 NVIDIA post about NeMo Video Curator: about 195 seconds per video-hour per GPU streaming against about 352 batch; the post does not name Cosmos Curator | F05-78
T4 (G4dn): 1 NVENC, 2 NVDEC, no AV1 decode | F05-53
A10 (G5): 1 NVENC, 2 NVDEC, AV1 decode yes, encode no; the matrix lists "NVIDIA A10", the A10G has no row of its own | F05-54
L4 (G6): 2 NVENC, 4 NVDEC, AV1 both ways | F05-50
L40S (G6e): 3 NVENC, 3 NVDEC, AV1 both ways | F05-51
RTX PRO 4500 Blackwell Server Edition (G7): 3 NVENC, 3 NVDEC, AV1 both ways | F08-44
RTX PRO 6000 Blackwell Server Edition (G7e): 4 NVENC, 4 NVDEC, AV1 both ways | F05-52
A100 (P4d): 0 NVENC, 5 NVDEC, no AV1 decode | F05-46
H100 (P5): 0 NVENC, 7 NVDEC, no AV1 decode | F05-47
H200 (P5e, P5en): no row in NVIDIA's matrix, so AV1 hardware decode is not established | F05-49
B200, B300, GB200 (P6-B200, P6-B300, P6e-GB200): 0 NVENC, 7 NVDEC, AV1 decode yes | F05-48
The EC2 family column and the possible / not possible / not established lists are our join of the NVIDIA matrix with the EC2 specifications | F05-67
LeRobot's default decoder is torchcodec, run on the CPU | F05-39
Setting the torchcodec device to CUDA inside a dataloader worker leads to CUDA initialisation errors | F05-41
With the stock loader AV1 is decoded by CPU cores on every card, including those with an AV1 decode engine | F08-77
LeRobot training defaults: batch size 8, 4 dataloader workers, prefetch factor 4, 100,000 steps | F05-61
8 rows x 2 cameras = 16 frames per step; at most 2 decodes each at a keyframe every second frame = 32 decoded frames (our arithmetic) | F05-61
Only per-item decode latency found in the LeRobot repository: about 5 ms per item (torchcodec, two cameras, 50 episodes), 16.98 ms to 4.95 ms per item for batches of 32; hardware not stated; author reported | F05-62
8 x 5 ms = 40 ms of CPU work per batch, about 10 ms over 4 workers, a ceiling near 100 steps per second (our arithmetic, order of magnitude) | F05-62
Image transforms run per sample in the dataloader workers by default, "and the GPU ends up waiting for data" | F05-58
Hugging Face reports ACT training 2.8x faster on an H100 and 3.3x on an A100 with augmentation moved to the GPU (--dataset.image_transforms.backend=gpu); no dataset, camera count, batch size or CPU given | F05-59
Eight-GPU sizes of G5, G6, G6e, G7e, P5, P5e, P5en, P6-B200, P6-B300: 192 vCPUs, 24 per GPU, which is 12 physical cores at 2 threads per core | F05-65, F08-57
p4d.24xlarge: 96 vCPUs for 8 A100s, 12 per GPU | F05-65
g7.48xlarge: 1 thread per core, 24 physical cores per GPU, twice every other eight-GPU x86 size | F05-65, F08-57
Single-GPU sizes run from 4 vCPUs (g6.xlarge) to 64 (g6.16xlarge) | F08-57
One input-bound curation run: 32 H100s (4 nodes of 8), 32 captioning replicas, 7.1 rows per second against a capacity near 43, about 17% GPU utilisation, 10 replicas never received a request, run cancelled | F05-76
nvidia-smi reports decoder utilisation separately from the compute part; on a MIG-enabled GPU these figures cannot be queried | F08-31
In LeRobot's streaming reader one worker uses about 2 CPU cores; more worker processes are how more cores get used | F05-60
