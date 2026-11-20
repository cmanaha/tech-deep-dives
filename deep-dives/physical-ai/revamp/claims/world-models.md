# Claims: section 6, World Models: Predicting What Happens Next

claim | register ID

Planning one action took 16 seconds with a latent model (V-JEPA 2-AC) and 4 minutes with an action-conditioned Cosmos video model using one tenth as many samples, on one RTX 4090 (author reported) | F03-25
A world model predicts the future state of the world from past observations and actions | F03-87
Rollouts compound prediction error; the V-JEPA 2 authors name long horizons as a limit | F03-28
The primary sources name four uses: planning, improving a policy in imagination, generating synthetic experience, evaluating other action sequences | F03-88
A world-action model predicts future observations and actions together; the term comes from the DreamZero paper (February 2026) | F03-93
Counting five uses is our grouping | F03-88, F03-93
Dreamer 4 trains its policy by reinforcement learning inside a frame-generating world model; main result in a video game; 2B parameters; real time on a single H100 (author reported) | F03-90
RoboJEPA's authors say the same world model can evaluate or improve any policy | F03-88
To see what a latent model imagines, V-JEPA 2 and LeWorldModel train a separate decoder used only for inspection | F03-109
NVIDIA lists a Cosmos 3 checkpoint (Cosmos3-Nano-Sim-Bimanual) for closed-loop robot policy simulation | F03-92
The DreamZero authors list learned latent representations among the things a world-action model could predict | F03-93
The latent models read (V-JEPA 2-AC, LeWorldModel, RoboJEPA) plan by search | F03-112
Pixel family mostly generates data and acts directly, latent family mostly plans, in 2026 (our reading) | F03-88, F03-93, F03-25
One 640x480 colour frame is 640 x 480 x 3 = 921,600 numbers; the camera delivers 30 per second | F01-86
Cosmos 3 uses a frozen video VAE that compresses 4 times in time and 32 by 32 in space; the transformer generates in that space and a decoder returns pixels | F03-96
Cosmos 3's generating transformer is trained with rectified flow matching; the model card's examples use 35 passes | F03-95
Applied to the arm's camera: 20 by 15 = 300 positions per compressed frame, about 8 compressed frames and roughly 2,400 tokens per second (our arithmetic, shown on the page) | F03-96, F01-86
Cosmos 3 was released at the end of May 2026 in three sizes: Super 64B, Nano 16B, Edge 4B (Edge in July 2026) | F03-94
Cosmos3-Nano: 207.78 s on one H100 80GB for a 189-frame, 24 frames-per-second clip at 720p (1280 x 720); 7.61 s at 320 x 192; 114.85 s on a B200 at 720p (vendor claim) | F03-98
Cosmos 3 has an autoregressive transformer for text and a diffusion transformer for generation, sharing weights | F03-95
Cosmos3-Nano as an action-conditioned world model: about 2.0 s per rollout on an H100 80GB; rollout length not published (vendor claim) | F03-99
Genie 3 (August 2025): navigable in real time at 24 frames per second at 720p (vendor claim) | F03-100
Genie 4: limit of around a minute of continuous interaction, early robotics experiments; the page carries no date, frame rate, resolution, model size or hardware | F03-101
1X World Model: 14B video model generates 5 seconds of video, an inverse dynamics model extracts actions; 11 seconds on multiple GPUs plus 1 second (vendor claim) | F03-102
Predicting in latent space lets the model drop irrelevant or unpredictable detail; pixel prediction spends capacity and compute on low-level detail | F03-106
V-JEPA 2 example: trajectory of a moving object is predictable, each blade of grass is not | F03-107
V-JEPA 2 authors: video world models are seldom judged on planning, "perhaps due to the computational cost of planning by generating video" | F03-108
V-JEPA 2-AC's predictor reads each frame as a 16 x 16 grid of 1408-wide features | F03-15
V-JEPA 2-AC's predictor has about 300M parameters; the encoder is frozen | F03-14
LeWorldModel keeps one vector of width 192 per frame | F03-32
LeWorldModel's decoded rollout keeps the global scene; finer details such as end-effector angle are not fully preserved | F03-109
V-JEPA 2-AC "fundamentally depend[s]" on what the representation space captured | F03-111
A predictor trained with a mean-error loss outputs the mean of the plausible futures; named as a limit of the family | F03-110
GR00T 2: NVIDIA whitepaper dated November 2026, code announced for December; one 2B-parameter transformer built on Cosmos-Predict2.5-2B; frozen VAE 4x in time and 8x per spatial dimension; 280 tokens per latent frame and camera at 224 x 320; flow matching on video and actions; median 153 ms per action chunk for Dexter with three camera views on an RTX 5090 after optimisation (449 ms unoptimised); 180 ms on the YAM arms (vendor claim) | F03-104
GR00T N1.7 is the newest GR00T with released weights and code | F02-37
DreamZero: 14B, video and actions together; about 5.7 seconds per action chunk on one GPU unoptimised; 7 Hz on 2 GB200 GPUs with optimisations (vendor claim) | F03-103
V-JEPA 2-AC planner settings: 800 samples, 10 refinement rounds, horizon 1 | F03-24
800 x 10 x 1 = 8,000 predictor passes per action (our arithmetic) | F03-115
16 s / 8,000 = 2 ms per candidate; 240 s / 800 = 300 ms per candidate; 150 times; pixel side was Cosmos 1 7B, a 2025 model fine-tuned by the V-JEPA 2 authors | F03-25, F03-118
8,000 Cosmos3-Nano rollouts one at a time: about 16,000 GPU-seconds, 4.4 GPU-hours; batching behaviour not published (our arithmetic) | F03-99
Same planner settings: 3 seconds per action on a single A100, 0.375 ms per candidate; the gap is unexplained | F03-74, F03-118
LeWorldModel: full plan in 0.98 s; planner setting timed and GPU not stated; 22 to 65 microseconds per candidate step (derived) | F03-41, F03-118
Parameter counts side by side; Cosmos3-Nano about 1,070 times LeWorldModel | F03-117 (rows: F03-94, F03-103, F03-102, F03-104, F03-90, F03-4, F03-14, F03-75, F03-72, F03-31)
NIM support matrix floors for Cosmos3-Nano: 58 GiB per device for generation in BF16 with the model resident; 31 GiB with layer offload and a 64 GiB host floor; FP8 44 GiB; Cosmos3-Super 150 GiB BF16 and 93 GiB FP8; floors are minimums checked at startup, with no resolution or frame count | F03-121
Cosmos framework FAQ: 32 GB for Nano, 128 GB for Super, conditions not given; read as weight size (16B x 2 bytes, 64B x 2 bytes) | F03-123
Measured: Cosmos3-Nano peaks at 33.8 GiB allocated on one H100 80 GB for one 1280 x 720 image; agent-notes file; no measured peak for a 189-frame video or a rollout | F03-124
Weight-streaming adapter: FP8 Cosmos3-Nano completed all 21 cases on an RTX 5070 (12 GB) with 128 GB host memory; inference only | F03-125
Cosmos3-Nano pretraining used 1,024 GB200 GPUs (vendor claim) | F03-97
LeWorldModel: about 15M parameters, trains on a single GPU in a few hours, GPU not named (author reported) | F03-31
No first-party memory figure located for the latent planners or GR00T 2 (scope: this research) | none (hedge; register 03 unknown U6)
World models are GPU tensor-core work and do not use ray-tracing cores (our reading; register 03 teaching material 5.1, no entry of its own) | none
