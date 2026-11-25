# Claims: section 10, Processing and Curating

claim | register ID

LeRobot decodes video on CPU cores inside the training job, whatever the card; its default decoder is torchcodec, run on the CPU | F05-39
On most eight-GPU EC2 sizes the CPU budget is 24 vCPUs per GPU, fixed by the instance type | F05-65
Hugging Face reports ACT training 2.8x faster on an H100 and 3.3x on an A100 with augmentation moved from the CPU workers to the GPU (--dataset.image_transforms.backend=gpu); no dataset, camera count, batch size or CPU given | F05-59
A 2.8x speed-up from moving CPU work off the input path means the GPU was busy for at most 1 / 2.8 = 36% of each step (our arithmetic, shown) | F05-59
LeRobot's hardware guide: Diffusion Policy on 4 x H100 at batch 32 took 0.167 s per update (6 steps per second, our arithmetic) with 0.015 s of data loading per step, so the GPUs set the pace; across its three policies data loading is 0.011 to 0.015 s against updates of 0.167 to 2.548 s (under a tenth, our arithmetic); dataloading_s includes preprocessing; GPU utilisation about 80 to 95%; columns update_s and dataloading_s | F01-91
LeRobot records AV1 by default, with a GOP of 2 | F05-35, F05-36
LeRobot can also record H.264 or HEVC (valid codecs include h264 and hevc) | F05-42
The H100 (P5): 0 NVENC, 7 NVDEC, no AV1 decode | F05-47
To return one frame a decoder loads the preceding keyframe and decodes every frame up to the one requested; cost per requested frame is at most the GOP size | F05-37
Robot training requests a few frames at random places, unlike playback, which decodes each frame once in order | F05-64
LeRobot training defaults: batch size 8, 4 dataloader workers | F05-61
8 rows x 2 cameras = 16 frames per step; at most 2 decodes each at a GOP of 2 = 32; at an illustrative GOP of 250 the worst case is 16 x 250 = 4,000, 125 times the default's worst case (our arithmetic) | F05-61, F05-37
Setting the torchcodec device to CUDA inside a dataloader worker leads to CUDA initialisation errors (the code's warning) | F05-41
With the stock loader AV1 is decoded by CPU cores on every card, including those with an AV1 decode engine | F08-77
An open LeRobot pull request times dataset access on a two-camera, 50-episode dataset with torchcodec: random single rows 5.37 ms on main and 5.16 ms with its change (medians, one process, warm file cache, hardware not stated); on main about 186 rows per second | F05-62
One worker builds a default batch of 8 in 8 / 186 = 43 ms, so 4 workers keep up with an update of about 11 ms or longer if they scale linearly (our arithmetic: the workers keep the GPU fed when W >= B / (r x u)) | F05-62, F05-61
The same pull request: batches of 32 read at random with a five-frame history window, 16.98 ms per item on main and 4.95 ms with its change (3.43x); 59 rows per second per worker on main, 32 / 59 = 0.54 s per batch for one worker (our arithmetic) | F05-62
Paired for illustration with the guide's 0.167 s Diffusion Policy update, those rows need 32 / (59 x 0.167) = 3.2 workers' worth; the change divides that by 3.43, to about one (our arithmetic across two sources, labelled an illustration) | F05-62, F01-91
The pull request ("batched reader access + faster torchcodec decode") was open on 2026-11-20 | F05-62
Hugging Face's release post reports 2.1 to 2.5 times more samples per second from four workers in the streaming reader (blog, Tier 2; the blog is cited through F05-59's URL, the figure is recorded in F05-60) | F05-60, F05-59
Neither the pull request nor the release post names the hardware behind its figure | F05-62, F05-60
LeRobot's image transforms are off by default | F05-84
Once enabled, image transforms run per sample in the dataloader workers by default; with several cameras that is often the most expensive thing the workers do, "and the GPU ends up waiting for data"; backend=gpu leaves the workers decoding only | F05-58
Eight-GPU sizes of G5, G6, G6e, G7e, P5, P5e, P5en, P6-B200, P6-B300: 192 vCPUs, 24 per GPU, which is 12 physical cores at 2 threads per core | F05-65, F08-57
p4d.24xlarge: 96 vCPUs for 8 A100s, 12 vCPUs and 6 physical cores per GPU | F05-65, F08-57
g7.48xlarge: 1 thread per core, 24 physical cores per GPU, twice the 12 of the other eight-GPU x86 sizes and four times p4d's 6 | F05-65, F08-57
LeRobot v0.7.0's decoder "supports torchcodec on cpu and pyav", so it has no GPU decode path | F05-39
Single-GPU sizes run from 4 vCPUs (g6.xlarge) to 64 (g6.16xlarge) beside one L4; p5.4xlarge has 16 vCPUs for one H100 | F08-57, F05-66
NVENC and NVDEC are fixed-function engines separate from the tensor cores; a card has a set number of each and each handles a fixed list of codecs | F05-67
A100 (P4d): 0 NVENC, 5 NVDEC, no AV1 decode | F05-46
T4 (G4dn): 1 NVENC, 2 NVDEC, no AV1 decode | F05-53
H200 (P5e, P5en): no row in NVIDIA's matrix as read on 2026-11-20, so AV1 hardware decode is not established | F05-49
B200, B300, GB200 (P6-B200, P6-B300, P6e-GB200): 0 NVENC, 7 NVDEC, AV1 decode yes | F05-48
A10 (G5): 1 NVENC, 2 NVDEC, AV1 decode yes, encode no; the matrix lists "NVIDIA A10", the A10G has no row of its own, so G5's answer rests on the A10 row and a decode test settles it (closure named in U3) | F05-54
L4 (G6): 2 NVENC, 4 NVDEC, AV1 both ways | F05-50
L40S (G6e): 3 NVENC, 3 NVDEC, AV1 both ways | F05-51
RTX PRO 4500 Blackwell Server Edition (G7): 3 NVENC, 3 NVDEC, AV1 both ways | F08-44
RTX PRO 6000 Blackwell Server Edition (G7e): 4 NVENC, 4 NVDEC, AV1 both ways | F05-52
The EC2 family pairing and the possible / not possible / not established answers are our join of the NVIDIA matrix with the EC2 specifications; no P-family card has an encoder | F05-67
LeRobot's docs put software H.264 files about 30-50% larger than AV1, keep AV1 the default because it gives the best training performance, and say other codecs "may affect training time" | F05-43
Cosmos Curator removed its FFmpeg GPU decode mode because it performed the same as FFmpeg on the CPU, and decodes on the GPU through PyNvVideoCodec; its default encoder is a CPU one because the A100 and H100 have no encoder engine | F05-77
At arm scale curation is done by hand: watch the 50 episodes of the recorder's default, delete failed ones by index with lerobot-edit-dataset, which recomputes statistics | F05-2, F05-81
Cosmos Curator is a toolkit for curating physical AI training data, at v2.10.0 (2026-11-10), run on Ray | F05-68
Its reference pipeline decodes and splits at shot changes, transcodes to H.264, filters on motion and aesthetics, embeds and captions | F05-69
Stage defaults tuned for a 48 GB GPU: frame decode 3 CPUs per worker, transcode 5, captioning-input preparation 3; most models 0.25 of a GPU per worker | F05-71
On an eight-GPU G6e (L40S, a 48 GB card) each GPU holds four quarter-GPU model workers; 8 decode workers at 3 vCPUs would take all 24 vCPUs and 4 transcode workers at 5 take 20, so running both splits the cores (our arithmetic) | F05-71, F05-65, F08-45
The captioning-input stage is a separate CPU stage so that it can spawn many CPU workers to keep the captioning stage's GPU workers busy | F05-70
One input-bound curation run (design note, incubating robot captioning recipe): 32 H100s (4 nodes of 8), 32 captioning replicas, 7.1 rows of its input table per second against a capacity near 43, about 17% GPU utilisation, 10 replicas never received a request, fetch-bound, run cancelled | F05-76
Deduplication is a second pipeline over the stored clip embeddings: K-Means clustering, clips ordered within a cluster by cosine similarity to the centroid; dropping near copies under --eps-to-extract (default 0.01) is our reading of the option | F05-73
In the robot recipes deduplication uses no video model: a clip is embedded by instruction text, first frame and wrist motion; text and image embeddings are 384 numbers each from small models | F05-75
A curation pass is short independent units, interruptible, so a lost machine costs the clips it held (section 24 places it on Spot) | F08-78
The nearest published curation rate located is from a March 2025 NVIDIA post about a predecessor, NeMo Video Curator on DGX Cloud: about 195 seconds per video-hour per GPU in streaming mode, 3,600 / 195 = 18.5 video-hours per GPU-hour; an illustrative 1,000 hours is about 54 GPU-hours (our arithmetic); the post names no software version | F05-78
nvidia-smi GPU utilisation is the percentage of the sample period during which at least one kernel was executing; it says nothing about how much of the GPU the kernel used | F08-30
nvidia-smi reports decoder utilisation separately from the compute part; on a MIG-split GPU none of these figures can be queried | F08-31
The March 2025 post describes a controller that resizes each stage's worker pool every three minutes from measured throughput, over-provisioning the CPU-only stages | F05-79
NVIDIA reports GPU-stage workers busy over 99.5% of the time after warm-up, on 32 GPUs across four nodes | F05-78
lerobot-edit-dataset can re-encode a dataset's videos | F05-81
Keep the recording at a short GOP (from the keyframe mechanism) | F05-37
Whether the workers bind: steps per second rise with W when the workers set the pace and stay flat when the GPU does (our derivation from the min of the two rates) | F05-61
LeRobot's loader never calls NVDEC, the GPU's video decode engine, a fixed circuit separate from the tensor cores | F05-39, F05-67
The GOP is set when a video is encoded, trading decode time against file size; a dataset re-encoded at a long GOP pays on every step; re-encoding is how a GOP changes | F05-37, F05-81
The heavy-row 0.54 s is one worker building one batch; the guide's 0.015 s is the loading time its training loop recorded per step on its own dataset, a different measure | F05-62, F01-91
In all three of the guide's runs data loading is under a tenth of the update and the GPUs set the pace | F01-91
On a G6e the CPU budgets alone cannot say how decode and transcode split the cores; each stage's measured throughput on a short run does (our inference from the budgets) | F05-71
Find the slow link, the fetch included, before adding GPUs (the one input-bound run was fetch-bound) | F05-76
