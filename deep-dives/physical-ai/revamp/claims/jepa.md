# Claims: section 7, JEPA: Predicting in Latent Space

claim | register ID

A JEPA's loss compares two of its own outputs, so an encoder that outputs a constant zeroes it (collapse); a pixel-predicting model cannot collapse this way | F03-63
V-JEPA 2 takes its targets from a copy of the encoder that receives no gradient and trails the trained encoder | F03-8
LeWorldModel keeps one encoder and adds one regularising loss term; no stop-gradient and no second encoder | F03-35
V-JEPA 2-AC and RoboJEPA train only a predictor on a frozen encoder | F03-71, F03-75
The V-JEPA 2 planner uses 800 samples, 10 iterations, top 10 and horizon 1, which is 800 x 10 x 1 = 8,000 predictor passes per action | F03-24
That plan takes 16 seconds per action on one NVIDIA RTX 4090 (author reported) | F03-25
The SO-101 default control rate is 30 ticks a second; 16 x 30 = 480 ticks per planned action is our arithmetic | F01-28, F03-25
A JEPA encodes both sides and a predictor predicts the target's latent from the context's latent | F03-47
The energy of a JEPA is the prediction error between latents, low when the target is a plausible match | F03-48
Predicting in latent space lets the encoder drop detail that cannot be predicted | F03-51
The V-JEPA 2 authors separate what can be predicted (an object's trajectory) from what cannot (each leaf on a tree) | F03-107
A predicted latent cannot be inspected; the LeWorldModel authors trained a decoder only for inspection and found finer details such as end-effector angle "not fully preserved" | F03-109
V-JEPA 2 cuts video into tubelets of 2 frames by 16 by 16 pixels, one token each | F03-3
A pretraining clip is 16 frames at 256 x 256 and 4 frames per second; 8 x 16 x 16 = 2,048 tokens is our arithmetic | F03-11, F03-3
ViT-g has 1B parameters, 40 layers and width 1408; the pretraining predictor has 22M parameters, 12 layers, width 384 | F03-4
Released masking config: 8 blocks of 15% of the frame area and 2 blocks of 70%, spanning the clip in time | F03-9
Those mask settings hide about 90% of the tokens on average (V-JEPA paper); about 205 of 2,048 visible is our illustration, and the V-JEPA 2 paper prints no ratio | F03-60, F03-9
The predictor receives context outputs plus one learned mask token per hidden position and returns one vector per hidden position | F03-6
The V-JEPA 2 objective as printed: minimize over theta, phi, Delta_y the L1 distance between P_phi(Delta_y, E_theta(x)) and sg(E_theta-bar(y)), applied to masked patches only | F03-2
The released code takes the mean absolute difference, layer-normalises the targets (not in equation 1), and runs the target encoder under torch.no_grad() | F03-7
Target weights are marked requires_grad = False; after each optimiser step target = m x target + (1 - m) x encoder with m = 0.99925 held constant | F03-8
1 - 0.99925 = 0.00075, 0.075% per step, an average over roughly 1,333 recent steps | F03-8
About 924 steps to close half of a gap (our arithmetic, ln 0.5 / ln 0.99925) | F03-8
The V-JEPA authors: the plain regression "would admit a trivial solution"; the LeWorldModel authors: preventing collapse is "one of the central challenges" | F03-63
Collapse is complete (one point) or dimensional (a low-dimensional subspace); the loss shows neither | F03-64, F03-63
EMA target plus stop-gradient prevents collapse by a hypothesis: the predictor evolves faster than the encoder and stays close to optimal | F03-65
The LeWorldModel authors say EMA and stop-gradient do not in general correspond to minimising a well-defined objective | F03-66
A frozen pretrained encoder cannot collapse; the world model is "inherently limited by the state information encoded in the learned representation space" | F03-71
Contrastive negatives push apart different inputs; the position paper argues the number needed grows with dimension | F03-70
VICReg (2022): l(Z, Z') = lambda s + mu [v + v] + nu [c + c]; variance hinge on each dimension's standard deviation, covariance pushed to zero, invariance as mean squared distance | F03-67
PLDM, a VICReg-based JEPA world model, has a seven-term loss with six tunable coefficients, which the LeWorldModel authors say brings training instability and harder tuning (author reported) | F03-68
SIGReg pushes embeddings toward an isotropic Gaussian (unit variance, zero covariance); that one term covers both degrees of collapse follows from those definitions (our reading in the register) | F03-69
LeWorldModel: about 15M parameters, trains on a single GPU in a few hours per its authors, GPU not named | F03-31
LeWorldModel encodes each frame as one vector of width 192 | F03-32
SIGReg projects embeddings on random directions and tests each projection for normality; Cramer-Wold theorem | F03-39
LeWM loss: L_pred = squared L2 between predicted and actual next embedding; L_LeWM = L_pred + lambda SIGReg(Z); lambda = 0.1 and 1,024 projections in the paper | F03-36
The released config sets the SIGReg weight to 0.09, with 17 knots and 1,024 projections | F03-37
Push-T success stays above 80% for lambda between 0.01 and 0.2; performance drops when the embedding dimension falls below about 184 (author reported) | F03-46
Push-T over three seeds: LeWM 96.0%, DINO-WM 92.0%, PLDM 78.0%; all four tasks simulated; DINO-WM slightly ahead on the cube pick-and-place task; no real-robot result (author reported) | F03-42
SIGReg weakens in very simple, low-diversity environments | F03-45
SIGReg in code: empirical characteristic function (mean cos, mean sin) against exp(-t^2/2) at 17 points t in [0, 3], weighted, scaled by batch size, averaged over 1,024 directions | F03-38
V-JEPA 2: encoder pretrained on over 1 million hours of internet video, then V-JEPA 2-AC trained on under 62 hours of robot video with the encoder frozen | F03-1
The V-JEPA 2-AC predictor is about 300M parameters, 24 layers, width 1024 | F03-14
Per time step: one 7-number action token (change in end-effector pose), one 7-number state token (3 position, 3 orientation, 1 gripper), and a 16 x 16 grid of 1408-wide features | F03-15
1 + 1 + 256 = 258 tokens per time step | F03-16
Teacher-forcing loss: L1 against the frozen encoder's features of the real next frame, each guess from true latents | F11-100
Autoregressive prediction accumulates error; the number of action sequences grows exponentially with the horizon | F03-28
V-JEPA 2-AC loss: teacher forcing plus a rollout term with T = 2, minimised over the predictor weights only | F03-18, F11-102
A deterministic predictor trained on a distance learns the conditional mean of multi-modal futures; closed-loop MPC mitigates it in the JEPA-WMs benchmarks | F03-110
Planning energy: L1 distance between the predictor's imagined representation after T actions and the goal image's representation; the plan is its argmin, found by CEM | F03-23, F11-101
MPC: plan a sequence, execute the first part, observe, plan again; V-JEPA 2-AC executes 1 of 1, RoboJEPA 2 of 5, LeWM all 5 of 5 | F03-112
CEM: sample from a Gaussian, score through the world model, keep the lowest-cost elites, refit mean and spread, repeat, return the mean | F03-113
16 s / 8,000 = 2 ms and 3 s / 8,000 = 0.375 ms per pass (our arithmetic) | F03-118
Pick-and-place uses three goal images on a schedule of 4, 10 and 4 time steps; 18 planned actions, 144,000 passes, 288 s (4.8 minutes) at the RTX 4090 rate (our arithmetic) | F03-27, F03-25
V-JEPA 2-AC training used no rewards, task labels or success flags | F03-20
V-JEPA 2-AC results, 10 trials each on two Franka arms: pick-and-place 80% (cup), 65% (box); grasp 65% (cup), 25% (box) (author reported) | F03-26
V-JEPA 2.1 was released 2026-03-16: visible tokens contribute to the loss, loss at several encoder depths, ViT-G encoder of 2B parameters against ViT-g's 1B | F03-72
V-JEPA 2.1 raises cup grasp success from 60% to 70% at the V-JEPA 2 planning settings, 10 trials; the 60% baseline differs from the 65% in the V-JEPA 2 paper (author reported) | F03-73
V-JEPA 2.1 features "better encode depth information" | F03-111
V-JEPA 2.1 at horizon 8 (300 samples, 15 iterations): grasp 80%, 36,000 passes, 14 seconds per action on a single A100 (author reported) | F03-73, F03-74, F03-115
RoboJEPA (7 Oct 2026): predictors from 22M to 8B parameters on a frozen V-JEPA 2.1 encoder | F03-75
RoboJEPA trained on 15,022 hours of robot video, 6,692 with synchronised actions | F03-76
RoboJEPA's fits "already sit close to data saturation"; more diverse interaction data is likely needed | F03-79
RoboJEPA 8B on a Franka with one goal image: 67% grasp, 50% lift, 27% pick-and-place; pi0.5 reference 5%, 0%, 53%; "contextual references" (author reported) | F03-78, F03-77
Predictor passes per decision: 8,000 (V-JEPA 2-AC), 36,000 (V-JEPA 2.1 horizon 8), 45,000 (LeWM on Push-T, 15,000 elsewhere), 204,800 and 307,200 on the first plan (RoboJEPA); our arithmetic | F03-115
One V-JEPA 2-AC pass runs a 300M transformer over 258 tokens per frame; a LeWM pass a 10M transformer over 1 to 3 tokens | F03-115
LeWM plans with 300 samples, 30 iterations on Push-T (10 elsewhere), horizon 5 | F03-40
LeWM full plan 0.98 s against 47 s for DINO-WM; GPU not named; the timed setting is not stated (author reported) | F03-41, F03-118
The same 800 x 10 x 1 plan is listed at 3 seconds per action on a single A100 in the V-JEPA 2.1 paper; neither paper explains the gap (author reported) | F03-74
RoboJEPA real-robot planner: 4,096 samples, 15 iterations first and 10 after, horizon 5; no seconds printed; "several seconds", "not real-time", several GPUs | F03-77
CEM has no guarantee of a global optimum and becomes hard to apply when the action space is large | F03-114
Sampled actions are limited to about 13 cm of gripper travel; the authors tried camera positions by hand | F03-28
The released notebook defaults to 400 samples, 10 CEM steps, top 10, rollout 2, translation and gripper only; 400 x 10 x 2 = 8,000 | F03-29
ViT-g pretraining projection: roughly 60 GPU-years on A100s without progressive resolution, which cuts GPU time 8.4x; the actual run's GPU count and duration are not stated (author reported) | F03-12
The released V-JEPA 2-AC config asks for 4 nodes of 8 GPUs | F03-21
RoboJEPA's 1B predictor run used 32 nodes of 8 H100 GPUs; profiling on one H200 found inference "bound by host-side dispatch, not by matrix multiplication", GEMMs about 26% of GPU time (author reported) | F03-80
Ways to cut planning time named by the authors: more compute, fewer samples and refinement steps, a feed-forward policy, gradient-based planning | F03-116
Gradient planners do well on smooth cost landscapes and fail on contact-rich manipulation; CEM with an L2 cost plans best overall (JEPA-WMs, peer reviewed) | F03-81
