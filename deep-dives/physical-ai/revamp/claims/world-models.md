# Claims: section 6, World Models: Predict Pixels or Predict a Summary

claim | register ID

Planning one action by search took 16 seconds with V-JEPA 2-AC (latent, Meta) and 4 minutes with an action-conditioned Cosmos video model given one tenth as many candidates per round, on one RTX 4090 (author reported; the V-JEPA 2 authors built both sides) | F03-25
800 candidates x 10 rounds = 8,000 futures in 16 s is 2 ms each; 80 x 10 = 800 in 240 s is 300 ms each; 150 times per imagined future (our arithmetic, shown) | F03-24, F03-25, F03-118
The arm takes a new action every 33.3 ms at 30 Hz (1/30 s, marked Derived; section 3 owns it) | F01-28 (section 3)
A world model predicts the future state of the world from what has been observed and the actions taken | F03-87
Rollouts compound prediction error; the V-JEPA 2 authors name long rollouts as a limit | F03-28
V-JEPA 2-AC scores a candidate by the L1 distance between the predicted latent and the latent of a goal image; no frame is drawn | F03-23
To get pictures out of a latent model, the V-JEPA 2 and LeWorldModel authors train a separate decoder, used only for inspection | F03-109
Dreamer 4 trains its policy inside a frame-generating world model; main result in a video game (reaches diamonds in Minecraft from offline data); 2B parameters; real time on a single H100 (author reported) | F03-90
NVIDIA lists a Cosmos 3 checkpoint for closed-loop robot policy simulation | F03-92
RoboJEPA's authors write that the same world model can be used to "evaluate or improve any policy" | F03-88
V-JEPA 2-AC, LeWorldModel and RoboJEPA all choose actions by search | F03-112
One 640x480 colour frame is 640 x 480 x 3 = 921,600 numbers; the camera delivers 30 per second (27.6 million numbers per second, Derived) | F01-86
Cosmos 3 uses a frozen video VAE that compresses 4 times in time and 32 by 32 in space | F03-96
On the arm's camera: 20 by 15 = 300 tokens per compressed frame, about 8 compressed frames, roughly 2,400 tokens per second; 35 x 2,400 = 84,000 token updates (our arithmetic, Derived, shown) | F03-96, F03-95, F01-86
Pixel prediction "must dedicate significant model capacity and compute to capture all the low-level detail in the visual input"; latent prediction can drop irrelevant or unpredictable detail | F03-106
Cosmos 3 was released at the end of May 2026 in three sizes: Super 64B, Nano 16B, Edge 4B (Edge in July 2026) | F03-94
Cosmos 3 has an autoregressive transformer for text and a diffusion transformer for generation, sharing weights | F03-95
Cosmos3-Nano 720p clip: 114.85 s on a B200 (vendor claim) | F03-98
Cosmos3-Nano as an action-conditioned world model: about 2.0 s per rollout on an H100 80GB; rollout length not published (vendor claim) | F03-99
Genie 3 (August 2025): navigable in real time at 24 frames per second at 720p (vendor claim) | F03-100
1X World Model: 14B video model generates 5 seconds of video, an inverse dynamics model extracts actions; 11 seconds on multiple GPUs plus 1 second (vendor claim) | F03-102
V-JEPA 2 example: trajectory of a moving object is predictable, each blade of grass is not | F03-107
V-JEPA 2-AC's predictor reads each frame as a 16 x 16 grid of 1408-wide vectors (256 positions) | F03-15, F03-32
V-JEPA 2-AC's predictor has about 300M parameters; the encoder is frozen | F03-14
LeWorldModel keeps one vector of width 192 per frame | F03-32
Teacher-forcing loss of V-JEPA 2-AC: mean L1 distance between 15 predicted and real next latents over a 16-frame clip; trains the predictor only | F11-100
V-JEPA 2-AC adds a rollout loss term | F11-102
V-JEPA 2 is trained in two stages: encoder on over 1 million hours of internet video without actions, then the predictor on under 62 hours of robot video with the encoder frozen | F03-1
The encoder's pretraining masks part of a video and predicts the latent of the masked part; the target comes from a second copy of the encoder; the paper names representation collapse | F03-2
LeWorldModel's decoded rollout keeps the global scene; end-effector angle is not fully preserved | F03-109
V-JEPA 2-AC "fundamentally depend[s]" on what the representation space captured | F03-111
A predictor trained on mean error outputs the mean of the plausible futures; JEPA-WMs names this as a limit of the family | F03-110
V-JEPA 2-AC planner settings: 800 samples, 10 refinement rounds, horizon 1; tasks "relatively greedy" | F03-24
800 x 10 x 1 = 8,000 predictor calls per action (our arithmetic) | F03-115
Long horizons: error accumulates and the number of action trajectories grows exponentially | F03-28
16 s is 16 x 30 = 480 control periods (our arithmetic, Derived) | F03-25
Ways the authors say could shorten planning in future work: more computing resources, fewer samples and refinement steps, gradient-based planning, a feed-forward policy trained in imagination to initialise the search | F03-116
8,000 Cosmos3-Nano rollouts one at a time: about 16,000 GPU-seconds, 4.4 GPU-hours; batching behaviour not published (our arithmetic) | F03-99
Same planner settings: 3 seconds per action on a single A100, 0.375 ms per candidate; the gap is unexplained | F03-74, F03-118
LeWorldModel: full plan in 0.98 s; planner setting timed not stated (45,000 or 15,000 candidate steps); 22 to 65 microseconds per candidate step (derived) | F03-41, F03-118
Among the five charted times, each pixel-family time is 300 ms or more per candidate and each latent-family time 2 ms or less; the top bar is NVIDIA's figure, the others our division of a published planning time by the candidate count | F03-118
DreamZero: 14B; about 5.7 seconds per action chunk on one GPU unoptimised; closed-loop control at 7 Hz on 2 GB200 GPUs; authors attribute the cost to parameter size and "the iterative denoising nature of video" (vendor claim) | F03-103
GR00T 2: NVIDIA whitepaper and project page dated November 2026, code announced for December, nothing downloadable on 2026-11-20; one 2B-parameter transformer built on Cosmos-Predict2.5-2B; frozen VAE 4x in time and 8x per spatial dimension; 280 tokens per latent frame and camera at 224 x 320 (3 x 280 = 840 for three views if each is fed at that size, Derived); "one or two [denoising steps] for video and two to four for actions"; median 153 ms per action chunk for Dexter with three camera views on an RTX 5090 after optimisation (449 ms unoptimised); 180 ms on the YAM arms (vendor claim) | F03-104
A latent planner at the V-JEPA 2 settings runs ten batches of 800 per action; 16 s is 10 rounds of about 1.6 s (Derived) | F03-24, F03-25
NIM support matrix floors for Cosmos3-Nano: 58 GiB per device for generation in BF16 with the model resident; 31 GiB with layer offload and a 64 GiB host floor; FP8 44 GiB; Cosmos3-Super 150 GiB BF16 and 93 GiB FP8; floors are minimums checked at startup, with no resolution or frame count | F03-121
Cosmos framework FAQ: 32 GB for Nano, 128 GB for Super, conditions not given; read as weight size (16B x 2 bytes, 64B x 2 bytes) | F03-123
Measured: Cosmos3-Nano peaks at 33.8 GiB allocated on one H100 80 GB for one 1280 x 720 image; agent-notes file; no PyTorch peak for a 189-frame video (TensorRT-LLM serving: 50,623-52,147 MiB after a 189-frame warm-up) and none for a rollout | F03-124
Weight-streaming adapter: FP8 Cosmos3-Nano completed all 21 cases on an RTX 5070 (12 GB) with 128 GB host memory; inference only | F03-125
Cosmos3-Nano pretraining used 1,024 GB200 GPUs (vendor claim) | F03-97
LeWorldModel: about 15M parameters, trains from scratch on a single GPU in a few hours, GPU not named (author reported) | F03-31

The video model in that comparison was Cosmos 1 with 7B parameters, a 2025 model fine-tuned by the V-JEPA 2 authors, who ran the comparison | F03-25, F03-118
In 2026 pixel models generate training video and act directly, latent models plan by search (our reading, labelled once, in the opening); pixel models are used to train and score policies, and RoboJEPA's authors write that theirs can be | F03-88, F03-90, F03-92, F03-93, F03-112
A world-action model outputs the action together with its prediction; named by the DreamZero paper (NVIDIA, February 2026); the two examples met in the section, DreamZero and GR00T 2, are video models; its authors list learned latent representations among the things such a model could predict | F03-93
LeWorldModel is a latent model of about 15M parameters | F03-31
The examples NVIDIA gives for Cosmos 3 use 35 denoising passes (Use line only, no verbatim quote in the register) | F03-95
Cosmos3-Nano (16B): 207.78 s on one H100 80GB for a 189-frame, 24 fps clip at 720p (1280 x 720); 7.875 s of video and 26.4 s of compute per second of video (our arithmetic); 7.61 s at 320 x 192 (vendor claim); the time is the native PyTorch row, the memory floors are the NIM container's | F03-98, F03-94, F03-121
Genie 4 is limited to around a minute of continuous interaction | F03-101
Encoder and predictor are trained together in V-JEPA 2 pretraining; a constant output would zero the loss (representation collapse); the target comes from a moving-average copy of the encoder behind a stop-gradient | F03-2
GR00T 2's 153 ms is 153 / 33.3 = 4.6 control periods (our arithmetic, Derived) | F03-104
GR00T N1.7 is the newest GR00T with released weights and code; LeRobot v0.7.0 also packages world-action models | F02-37, F02-102
Parameter counts side by side; RoboJEPA predictor up to 8B on a 2B encoder; two pixel models at 2B | F03-117 (rows: F03-94, F03-103, F03-102, F03-104, F03-90, F03-4, F03-14, F03-75, F03-72, F03-31)
No first-party memory figure found for the latent planners or GR00T 2 (scope: this research) | none (hedge; register 03 unknown U6)
Dropped in the rewrite: the four-uses list as a list (F03-88), F03-108 (the 'perhaps' quote), the 1,070 times ratio, Cosmos 3's flow-matching objective, the tensor-core and ray-tracing reading | none
Both kinds encode the frame into vectors called a latent; for V-JEPA 2-AC the latent is not smaller than the frame | F03-15, F03-96, F03-32
In the Cosmos 3 examples the pixel family runs a transformer of billions of parameters 35 times | F03-95
In DreamZero and GR00T 2 each world-action call still denoises video; FastWAM and Long-WAM skip video at inference | F03-103, F03-104, F02-88, F02-96
