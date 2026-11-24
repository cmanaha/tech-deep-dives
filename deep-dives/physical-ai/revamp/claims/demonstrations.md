# Claims: section 4, Learning From Demonstrations

claim | register ID

LeRobot records two cameras and six joint values at 30 frames per second; the recorder's default is 50 episodes; one action is six target positions | F02-67
ACT used 50 demonstrations per task, about 10 minutes of teleoperation, for 80 to 90% success on six real tasks (author reported) | F02-10
Behaviour cloning is supervised learning that predicts the expert's action from the observation the expert saw | F02-1
The policy's own outputs decide its next inputs, which breaks the supervised-learning assumption | F02-1
50 episodes of 20 s at 30 ticks a second are 30,000 pairs (toy episode length, our arithmetic) | F02-67
Compounding error: one mistake moves the policy to observations the demonstrations never covered | F02-2
A policy that disagrees with the expert with probability epsilon per step can make up to T^2 x epsilon mistakes over T steps; worst-case bound | F02-2
The bound is tight: problems exist where the extra cost grows quadratically in T | F02-3
Toy worked example: T = 600, epsilon = 0.001, T x epsilon = 0.6, T^2 x epsilon = 360 (illustration, our arithmetic) | F02-2
An action chunk: the policy predicts the next k actions from one observation, a k-fold reduction in the effective horizon | F02-5
ACT dates from 2023 | F02-5
ACT's chunk is k = 100 at 50 Hz, 2 seconds of motion per forward pass | F02-6
ACT ablation: success from 1% at k = 1 to 44% at k = 100, averaged over four settings (author reported) | F02-6
LeRobot ACT defaults to chunk_size = 100; at 30 Hz that is 3.33 s | F02-11
Toy with chunks: 600 / 100 = 6 decisions, ceiling 0.036 wrong decisions, 3.6 wrong ticks, 100 times lower than 360 (illustration, our arithmetic) | F02-11
LeRobot ACT names the two chunk numbers chunk_size and n_action_steps (both 100 by default) | F02-11
ACT in LeRobot uses a ResNet-18 vision backbone and a transformer of width 512 | F02-11
ACT's training loss is L1 on the chunk plus a weighted KL term; the algorithm box prints MSE, the text and LeRobot's code use L1 | F11-2, F02-13
LeRobot ACT defaults target bimanual ALOHA tasks; an SO-101 user may shorten the chunk | F02-11
LeRobot sets n_decoder_layers = 1 where the paper's table says 7; the original code used only the first layer | F02-12
Temporal ensembling queries the policy every step and averages overlapping predictions | F02-7
Temporal ensembling is off by default in LeRobot ACT | F02-13
Multimodal action distributions are a known challenge for policy learning; averaging two ways gives an action nobody demonstrated (the obstacle example is our illustration) | F02-14
ACT's CVAE: an encoder compresses the demonstrated chunk into z during training; at test time the encoder is discarded and z is set to zero | F02-8
Diffusion Policy: start from Gaussian noise shaped like an action sequence, repeatedly subtract predicted noise, conditioned on the observation; trained to predict added noise | F02-14
Diffusion Policy: 100 training iterations; 16 or 10 inference iterations with DDIM on real robots; 0.1 s per inference at 10 iterations on an NVIDIA 3080 (author reported) | F02-16
LeRobot Diffusion Policy runs 100 denoising passes per inference unless num_inference_steps is set | F02-17
pi0 models an action chunk of 50 actions | F02-18
Flow matching training: blend the demonstrated chunk with noise and regress the network onto A minus noise | F02-19
pi0 samples with 10 forward Euler steps of size 0.1 from noise; the observation is encoded once and cached | F02-20
10 flow steps against 100 diffusion training iterations is the practical case for flow matching (our reading) | F02-20, F02-16
Naive action tokens: one of 256 bins per joint per timestep, hundreds of tokens per chunk, learns badly at high control rates | F02-25
FAST: DCT, quantise, BPE; about 30 tokens per chunk per arm (author reported) | F02-26
FAST: about 5x fewer training GPU-hours than flow pi0; about 750 ms per chunk against under 100 ms; 30 to 60 tokens decoded one at a time (author reported) | F02-27
ACT: about 80M parameters, about 5 hours on one 11 GB RTX 2080 Ti, about 0.01 s per inference (author reported) | F02-9
pi0 on an RTX 4090 with 3 cameras: 14 ms image encoders, 32 ms observation pass, 27 ms ten action passes, 73 ms total (author reported) | F02-21
pi0 executes chunks without re-observing and runs a new inference every 0.5 s on 50 Hz robots, after 25 actions (author reported) | F02-22
73 ms at an illustrative 0.25 m/s is about 18 mm (toy speed, our arithmetic) | F02-21
The behaviour cloning objective averages the loss over the states the expert visits only (equation 2) | F11-1
Network passes per chunk: 1 for ACT, 10 for pi0, 100 by default in LeRobot's diffusion policy | F02-16, F02-20, F02-17
ACT's ablation tapers slightly at chunk sizes above 100 (author reported) | F02-6
DAgger (2011): run the policy, have the expert label the states it reaches, retrain; the guarantee returns to linear in T; it needs an expert who can be queried on the learner's states | F02-4
ACT shortened the horizon instead of querying the expert again | F02-4, F02-5
Diffusion Policy: predict T_p actions, execute T_a; an execution horizon above 1 helps consistency, too long reduces performance through slow reaction time; 8 was best for most tasks tested; the paper's values are 16 and 8 (author reported) | F02-15, F02-17
LeRobot Diffusion Policy defaults: horizon 64, n_action_steps 32, one call every 1.07 s at 30 Hz, four times the paper's lengths | F02-17
openpi names the chunk length action_horizon (50); LeRobot names it chunk_size | F02-23, F02-29
pi0 on 20 Hz robots runs inference every 0.8 s, after 16 actions (author reported) | F02-22
Temporal ensembling weights are w_i = exp(-m i), w_0 for the oldest prediction, smaller m incorporating new observations faster; it was introduced to improve smoothness and avoid discrete switching between executing and observing | F02-7
At k = 100 and 50 Hz, plain chunking needs 0.5 forward passes per second and temporal ensembling 50 | F02-7
ACT's 0.01 s per inference is about 100 forward passes per second, so it can afford ensembling at 50 Hz | F02-9
pi0 at 73 ms per call manages 13.7 calls per second (our arithmetic) | F02-21
pi0's authors tried temporal ensembling, found it hurt policy performance, and execute chunks open loop | F02-22
LeRobot ACT: temporal_ensemble_coeff (paper value 0.01) requires n_action_steps = 1 | F02-13
LeRobot ACT: transformer width 512, latent z of 32 numbers, kl_weight 10, use_vae on by default | F02-11
The ACT authors found the CVAE objective essential in learning precise tasks from human demonstrations (author reported) | F02-8
Diffusion Policy training draws one random denoising iteration per example | F11-3
LeRobot's pi0 names its flow steps num_inference_steps, 10 by default | F02-29
openpi's code runs the flow time axis opposite to the paper (noise at 1) | F02-24
Naive binning of a 6-number action over a 50-action chunk is 300 tokens; FAST's about 30 is a tenth | F02-25, F02-26
FAST decodes through the full 2B language model where flow pi0 runs 10 steps of a 300M action expert (author reported) | F02-27
pi0.5 pretrains with FAST tokens, then adds a flow-matching action expert for inference | F02-49
pi0: 46 of 73 ms (63%) is image encoders plus the observation pass; ten action passes are 27 ms, 2.7 ms each; 86 ms with 13 ms of network latency off-board (author reported) | F02-21
pi0 at 2 calls per second of 73 ms is busy 146 ms per second, about 15% (our arithmetic) | F02-22, F02-21
750 ms at an illustrative 0.25 m/s is 188 mm (toy speed, our arithmetic) | F02-27
OpenVLA-OFT: a 7B token model given a parallel, L1-regression chunk head went from 76.5% to 97.1% average success across the four LIBERO task suites (author reported); sampling is a tendency, not a law (our reading) | F02-68
One pi0-FAST training run: about 4 days on 8 H100 GPUs for a 3B-parameter model (author reported) | F02-28
Bench symptoms for each failure (drift, stale chunk, chunk seams, averaged route, slow diffusion call) are our reading; causes and settings as cited | F02-2, F02-6, F02-15, F02-7, F02-13, F02-8, F02-11, F02-16, F02-17
The time of one call must stay under about half the duration of the predicted chunk (our arithmetic from the guide's rule) | F07-22
An Euler step follows a straight path exactly at any step size (geometric reasoning, no source) | F02-19, F02-20
The ablation passage gives no cause for the taper at larger k; the Diffusion Policy authors name slow reaction time for the same trade | F02-6, F02-15
