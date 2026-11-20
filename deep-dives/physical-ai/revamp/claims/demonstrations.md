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
Toy with chunks: 600 / 100 = 6 decisions, ceiling 0.036, 10,000 times lower (illustration, our arithmetic) | F02-11
LeRobot ACT names the two chunk numbers chunk_size and n_action_steps (both 100 by default) | F02-11
ACT in LeRobot uses a ResNet-18 vision backbone | F02-11
ACT's training loss is L1 on the chunk (plus a weighted KL term) | F02-13
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
