# Claims: section 10, Processing and Curating

claim | register ID

LeRobot decodes video on CPU cores inside the training job; its default decoder is torchcodec, run on the CPU | F05-39
On most eight-GPU EC2 sizes the CPU budget is 24 vCPUs per GPU, fixed by the instance type | F05-65
Hugging Face reports ACT training 2.8x faster on an H100 and 3.3x on an A100 with augmentation moved to the GPU (--dataset.image_transforms.backend=gpu); no dataset, camera count, batch size or CPU given | F05-59
A 2.8x speed-up from moving CPU work off the input path means the GPU was busy for at most 1 / 2.8 = 36% of each step (our arithmetic, shown) | F05-59
LeRobot records AV1 by default, with a GOP of 2 | F05-35, F05-36
The H100 (P5): 0 NVENC, 7 NVDEC, no AV1 decode | F05-47
To return one frame a decoder loads the preceding keyframe and decodes every frame up to the one requested; cost per requested frame is at most the GOP size | F05-37
Robot training requests a few frames at random places, unlike playback, which decodes each frame once in order | F05-64
LeRobot training defaults: batch size 8, 4 dataloader workers | F05-61
8 rows x 2 cameras = 16 frames per step; at most 2 decodes each at a GOP of 2 = 32; at an illustrative GOP of 250 the worst case is 16 x 250 = 4,000 (our arithmetic) | F05-61, F05-37
Setting the torchcodec device to CUDA inside a dataloader worker leads to CUDA initialisation errors (the code's warning) | F05-41
With the stock loader AV1 is decoded by CPU cores on every card, including those with an AV1 decode engine | F08-77
An open LeRobot pull request reports 5.16 ms per row for random single-row reads (torchcodec, two cameras, 50 episodes; median, one process, warm file cache, hardware not stated): about 194 rows per second | F05-62
Ceiling at the defaults: 4 x 194 / 8 = 97 steps per second from decode alone (our arithmetic: steps per second <= W x r / B) | F05-62, F05-61
The same pull request: batches of 32 with a five-frame history window, 16.98 ms per item before its change and 4.95 ms after (3.43x); that is 59 and 202 rows per second per worker, 7.4 and 25 steps per second from four workers at batch 32 (our arithmetic) | F05-62
LeRobot's hardware guide: Diffusion Policy on 4 x H100 at batch 32 took 0.167 s per update (6 steps per second, our arithmetic); data loading 0.011 to 0.015 s per step against updates of 0.167 to 2.548 s; GPU utilisation about 80 to 95%; columns update_s and dataloading_s | F01-91
Image transforms run per sample in the dataloader workers by default; with several cameras that is often the most expensive thing the workers do, "and the GPU ends up waiting for data"; backend=gpu leaves the workers decoding only | F05-58
Eight-GPU sizes of G5, G6, G6e, G7e, P5, P5e, P5en, P6-B200, P6-B300: 192 vCPUs, 24 per GPU, which is 12 physical cores at 2 threads per core | F05-65, F08-57
p4d.24xlarge: 96 vCPUs for 8 A100s (12 per GPU, half of 24) | F05-65
g7.48xlarge: 1 thread per core, 24 physical cores per GPU, twice every other eight-GPU x86 size | F05-65, F08-57
In LeRobot's streaming reader Hugging Face reports 2.1 to 2.5 times more samples per second from four workers | F05-60
At that scaling four workers supply 59 x 2.1 / 32 = 3.9 to 59 x 2.5 / 32 = 4.6 steps per second, under the 6 of the Diffusion Policy run (our arithmetic across three sources, labelled an order of magnitude) | F05-62, F05-60, F01-91
LeRobot v0.7.0's decoder "supports torchcodec on cpu and pyav", so it has no GPU decode path | F05-39
Single-GPU sizes run from 4 vCPUs (g6.xlarge) to 64 (g6.16xlarge) beside one L4; p5.4xlarge has 16 vCPUs for one H100 | F08-57, F05-66
NVENC and NVDEC are fixed-function engines separate from the tensor cores; a card has a set number of each and each handles a fixed list of codecs | F05-67
A100 (P4d): 0 NVENC, 5 NVDEC, no AV1 decode | F05-46
T4 (G4dn): 1 NVENC, 2 NVDEC, no AV1 decode | F05-53
H200 (P5e, P5en): no row in NVIDIA's matrix as fetched on 2026-11-20, so AV1 hardware decode is not established | F05-49
B200, B300, GB200 (P6-B200, P6-B300, P6e-GB200): 0 NVENC, 7 NVDEC, AV1 decode yes | F05-48
A10 (G5): 1 NVENC, 2 NVDEC, AV1 decode yes, encode no; the matrix lists "NVIDIA A10", the A10G has no row of its own | F05-54
L4 (G6): 2 NVENC, 4 NVDEC, AV1 both ways | F05-50
L40S (G6e): 3 NVENC, 3 NVDEC, AV1 both ways | F05-51
RTX PRO 4500 Blackwell Server Edition (G7): 3 NVENC, 3 NVDEC, AV1 both ways | F08-44
RTX PRO 6000 Blackwell Server Edition (G7e): 4 NVENC, 4 NVDEC, AV1 both ways | F05-52
The EC2 family pairing and the possible / not possible / not established answers are our join of the NVIDIA matrix with the EC2 specifications; no P-family card has an encoder | F05-67
LeRobot's docs put software H.264 files about 30-50% larger than the default | F05-43
Cosmos Curator removed its FFmpeg GPU decode mode because it performed the same as FFmpeg on the CPU, and prefers PyNvVideoCodec ("measurably faster"); its default encoder is a CPU one because the A100 and H100 have no encoder engine, with GPU transcoding kept for cards that have NVENC | F05-77
At arm scale curation is done by hand: watch the 50 episodes, delete failed ones by index with lerobot-edit-dataset, which recomputes statistics | F05-81
Cosmos Curator is a toolkit for curating physical AI training data, at v2.10.0 (2026-11-10), run on Ray | F05-68
Its reference pipeline decodes and splits at shot changes, transcodes to H.264, filters on motion and aesthetics, embeds and captions | F05-69
Stage defaults tuned for a 48 GB GPU: frame decode 3 CPUs per worker, transcode 5, captioning-input preparation 3; most models 0.25 of a GPU per worker | F05-71
On an eight-GPU G6e (L40S, a 48 GB card) each GPU holds four quarter-GPU model workers, and its 24 vCPUs hold 24 / 3 = 8 decode workers, or 4 transcode workers with 4 vCPUs left (our arithmetic) | F05-71, F05-65, F08-45
Captioning-input preparation is a separate CPU stage so that many CPU workers keep the GPU captioning workers busy | F05-70
One input-bound curation run (design note, incubating robot captioning recipe): 32 H100s (4 nodes of 8), 32 captioning replicas, 7.1 rows per second against a capacity near 43, about 17% GPU utilisation, 10 replicas never received a request, fetch-bound, run cancelled | F05-76
Deduplication is a second pipeline that clusters the stored clip embeddings with K-Means and drops near copies within a cluster by cosine similarity (diagram 10.1) | F05-73
In the robot recipes a clip is embedded by instruction text, first frame and wrist motion, with no video model | F05-75
A curation pass is short independent units, interruptible | F08-78
The nearest published curation rate is from a March 2025 NVIDIA post about a predecessor, NeMo Video Curator on DGX Cloud: about 195 seconds per video-hour per GPU in streaming mode; the post names no software version | F05-78
nvidia-smi GPU utilisation is the percentage of the sample period during which at least one kernel was executing | F08-30
nvidia-smi reports decoder utilisation separately from the compute part | F08-31
