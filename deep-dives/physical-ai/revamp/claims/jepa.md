# Claims: section 7, JEPA: Predicting in Latent Space

claim | register ID

The V-JEPA 2 planner uses 800 samples, 10 iterations, top 10 and horizon 1, which is 800 x 10 x 1 = 8,000 predictor passes per action | F03-24
That plan takes 16 seconds per action on one NVIDIA RTX 4090 (author reported) | F03-25
The V-JEPA 2 authors separate what can be predicted (an object's trajectory) from what cannot (each leaf on a tree) | F03-107
A JEPA encodes both sides and a predictor predicts the target's latent from the context's latent; it does not produce the target itself | F03-47
The energy of a JEPA is the prediction error between latents, low when the target is a plausible match | F03-48
Predicting in latent space lets the encoder drop detail that cannot be predicted | F03-51
V-JEPA 2 cuts video into tubelets of 2 frames by 16 by 16 pixels, one token each | F03-3
A pretraining clip is 16 frames at 256 x 256 and 4 frames per second; 8 x 16 x 16 = 2,048 tokens is our arithmetic | F03-11, F03-3
The V-JEPA paper prints 8 x 14 x 14 = 1,568 tokens for a 16-frame 224-pixel clip | F03-59
Encoder sizes: ViT-L 300M, ViT-H 600M, ViT-g 1B with 40 layers and width 1408; pretraining predictor 22M, 12 layers, width 384 | F03-4
Released masking config: 8 blocks of 15% of the frame area and 2 blocks of 70%, spanning the clip in time | F03-9
Those mask settings hide about 90% of the tokens on average (V-JEPA paper) | F03-60
The predictor receives context outputs plus one learned mask token per hidden position and returns one vector per hidden position | F03-6
The V-JEPA 2 objective as printed: minimize over theta, phi, Delta_y the L1 distance between P_phi(Delta_y, E_theta(x)) and sg(E_theta-bar(y)), applied to masked patches only | F03-2
The released code takes the mean absolute difference, and runs the target encoder under torch.no_grad() | F03-7
Target weights are marked requires_grad = False; after each optimiser step target = m x target + (1 - m) x encoder with m = 0.99925 held constant | F03-8
1 - 0.99925 = 0.00075, 0.075% per step, an average over roughly 1,333 recent steps | F03-8
About 924 steps to close half of a gap (our arithmetic, ln 0.5 / ln 0.99925) | F03-8
Collapse: the encoder can output a constant for every input, which zeroes the loss; a pixel-predicting model cannot collapse this way | F03-63
Collapse is complete (one point) or dimensional (a low-dimensional subspace) | F03-64
EMA target plus stop-gradient prevents collapse by a hypothesis: the predictor evolves faster than the encoder and stays close to optimal | F03-65
The LeWorldModel authors say EMA and stop-gradient do not in general correspond to minimising a well-defined objective | F03-66
VICReg (2022): l(Z, Z') = lambda s + mu [v + v] + nu [c + c]; variance hinge on each dimension's standard deviation, covariance pushed to zero, invariance as mean squared distance | F03-67
PLDM, a VICReg-based JEPA world model, has a seven-term loss with six tunable coefficients, per the LeWorldModel authors (author reported) | F03-68
SIGReg pushes embeddings toward an isotropic Gaussian; that one term covers both degrees of collapse is our reading | F03-69
LeWorldModel: about 15M parameters, trains on a single GPU in a few hours per its authors, GPU not named | F03-31
LeWorldModel encodes each frame as one vector of width 192 | F03-32
LeWorldModel has no stop-gradient and no second encoder | F03-35
SIGReg projects embeddings on random directions and tests each projection for normality; Cramer-Wold theorem | F03-39
LeWM loss: L_pred = squared L2 between predicted and actual next embedding; L_LeWM = L_pred + lambda SIGReg(Z); lambda = 0.1 and 1,024 projections in the paper | F03-36
The released config sets the SIGReg weight to 0.09, with 17 knots and 1,024 projections | F03-37
Push-T success stays above 80% for lambda between 0.01 and 0.2 (author reported) | F03-46
Push-T is a simulated 2D pushing task; LeWM's four tasks are all simulated and no real-robot result is reported | F03-42
SIGReg weakens in very simple, low-diversity environments | F03-45
SIGReg in code: empirical characteristic function (mean cos, mean sin) against exp(-t^2/2) at 17 points t in [0, 3], weighted, scaled by batch size, averaged over 1,024 directions | F03-38
Contrastive negatives push apart different inputs; the position paper argues the number needed grows with dimension | F03-70
A frozen pretrained encoder cannot collapse; V-JEPA 2-AC works this way; the representation is limited to what pretraining kept | F03-71
V-JEPA 2: encoder pretrained on over 1 million hours of internet video, then V-JEPA 2-AC trained on under 62 hours of robot video with the encoder frozen | F03-1
The V-JEPA 2-AC predictor is about 300M parameters, 24 layers, width 1024 | F03-14
Per time step: one 7-number action token (change in end-effector pose), one 7-number state token (3 position, 3 orientation, 1 gripper), and a 16 x 16 grid of 1408-wide features | F03-15
1 + 1 + 256 = 258 tokens per time step | F03-16
V-JEPA 2-AC loss: L1 against the frozen encoder's features of the real next frame, plus a two-step rollout term | F03-18
I-JEPA (2023) is the image instantiation and V-JEPA (2024) the first video one | F03-54, F03-59
V-JEPA 2.1 was released 2026-03-16 with a new recipe and a ViT-G encoder of 2B parameters | F03-72
V-JEPA 2.1 raises cup grasp success from 60% to 70% at the V-JEPA 2 planning settings, 10 trials (author reported) | F03-73
RoboJEPA (7 Oct 2026): predictors from 22M to 8B parameters on a frozen V-JEPA 2.1 encoder | F03-75
RoboJEPA trained on 15,022 hours of robot video, 6,692 with synchronised actions | F03-76
Planning energy: L1 distance between the predictor's imagined representation after T actions and the goal image's representation | F03-23
MPC: plan a sequence, execute the first part, observe, plan again | F03-112
CEM: sample from a Gaussian, score through the world model, keep the lowest-cost elites, refit mean and spread, repeat, return the mean | F03-113
Sampled actions are limited to about 13 cm of gripper travel | F03-28
Pick-and-place uses three goal images on a schedule of 4, 10 and 4 time steps | F03-27
V-JEPA 2-AC results, 10 trials each on two Franka arms: pick-and-place 80% (cup), 65% (box); grasp 65% (cup), 25% (box) (author reported) | F03-26
RoboJEPA 8B on a Franka with one goal image: 67% grasp, 50% lift, 27% pick-and-place; pi0.5 reference 5%, 0%, 53% (author reported) | F03-78, F03-77
The released notebook defaults to 400 samples, 10 CEM steps, top 10, rollout 2, translation and gripper only; 400 x 10 x 2 = 8,000 | F03-29
Predictor passes per decision: 8,000 (V-JEPA 2-AC), 36,000 (V-JEPA 2.1 horizon 8), 45,000 (LeWM on Push-T), 204,800 and 307,200 on the first plan (RoboJEPA); our arithmetic | F03-115
One V-JEPA 2-AC pass runs a 300M transformer over 258 tokens per frame; a LeWM pass a 10M transformer over 1 to 3 tokens | F03-115
The same 800 x 10 x 1 plan is listed at 3 seconds per action on a single A100 in the V-JEPA 2.1 paper; neither paper explains the gap (author reported) | F03-74
16 s / 8,000 = 2 ms and 3 s / 8,000 = 0.375 ms per pass (our arithmetic) | F03-118
V-JEPA 2.1 at horizon 8 (300 samples, 15 iterations): 14 seconds per action on a single A100 (author reported) | F03-73, F03-74
RoboJEPA real-robot planner: 4,096 samples, 15 iterations first and 10 after, horizon 5; no seconds printed; "several seconds", "not real-time", several GPUs | F03-77
LeWM plans with 300 samples, 30 iterations on Push-T, horizon 5 | F03-40
LeWM full plan 0.98 s against 47 s for DINO-WM (a world model on a frozen pretrained encoder); GPU not named (author reported) | F03-41
One pick-and-place: 4 + 10 + 4 = 18 planned actions, 144,000 predictor passes, 288 s (4.8 minutes) at the RTX 4090 rate (our arithmetic) | F03-27, F03-25
V-JEPA 2-AC training used no rewards, task labels or success flags | F03-20
Ways to cut planning time named by the authors: more compute, fewer samples and refinement steps, a feed-forward policy, gradient-based planning | F03-116
ViT-g pretraining projection: roughly 60 GPU-years on A100s without progressive resolution, which cuts GPU time 8.4x (author reported) | F03-12
