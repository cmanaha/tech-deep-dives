# Claims: section 5, Vision-Language-Action Models

Strongest number (author's choice): SmolVLA's 90% in distribution against ACT's 70% on the SO-101 pick-place task with 50 demonstrations (author reported, F02-60). It lands in the scene, in the "where to start" list, in the SmolVLA detail and in the closing paragraph.

claim | register ID

A VLA's observation is camera images, a language command and the joint angles; the output is an action chunk | F02-18
A VLA is a VLM pretrained on web images and text, extended with robot state in and an action chunk out through an action expert | F02-32
SmolVLA was pretrained on community robot datasets before fine-tuning | F02-59
On the SO-101 pick-place task with 50 demonstrations SmolVLA reports 90% in distribution and 50% out of distribution, ACT 70% and 40%; SmolVLA was not pretrained on SO-101 data (author reported) | F02-60
pi0 (October 2024): PaliGemma backbone of 3B parameters, action expert of 300M initialised from scratch, 3.3B in total | F02-32, F02-18
pi0 encodes the prefix once and caches it; each refinement step re-runs only the action tokens; 10 steps | F02-20
pi0's state and action vectors are padded to 32 in the open code; the SO-101's six numbers fill six slots | F02-23
LeRobot v0.7.0's pi0 keeps a 50-step chunk, padding to 32 and 10 inference steps | F02-29
SO-101 recording examples: two cameras at 640 x 480, 30 frames per second, six joint numbers | F02-67
GR00T N1 (March 2025) named System 2 (the VLM, 10 Hz on an L40) and System 1 (a DiT, motor actions at 120 Hz); names from Kahneman (author reported) | F02-33
GR00T N1 samples a 16-action chunk in 63.9 ms on an L40 (author reported) | F02-34
63.9 ms per chunk is about 15.6 chunks a second and room for 250 actions a second (our arithmetic, printed in the entry) | F02-33
SmolVLA in LeRobot v0.7.0 predicts 50 actions and plays 50 by default; at 30 Hz that is one call every 1.67 s (our arithmetic) | F02-62, F02-67
pi0.5 (April 2025) writes a text subtask, then the action chunk conditioned on it | F02-48
The GR00T N1 line up to N1.7 pairs a VLM (System 2) with a DiT action head (System 1) | F02-37
The first Gemini Robotics (March 2025): backbone in the cloud under 160 ms, decoder on the robot, about 250 ms end to end, effective 50 Hz (vendor claim) | F02-78
In GR00T 2 a reasoning model acts as System 2 and calls the action model as a tool | F02-45
GR00T 2 is a world action model: one diffusion transformer denoises future video and the action chunk together; page dated November 2026, whitepaper, code "Available in December" | F02-44
GR00T 2 Turbo: 2B parameters, 38 ms on an RTX 5090, 124 ms on a Jetson Thor, 1.6 s chunks about once per second, controller at 50 Hz, reasoning model off the robot (vendor claim) | F02-45
The published list and the downloadable list differ by a model generation or more (our reading) | F02-53
pi0.7: paper first posted 16 April 2026, about 5B parameters, 4B backbone, 860M action expert, 50-step chunks in 5 denoising steps, plays 15 or 25, prompt with episode metadata and subgoal images | F02-51
openpi holds pi0, pi0-FAST and pi0.5 only, last commit 2026-08-24, no pi*0.6 or pi0.7 weights; nothing newer than pi0.7 named as of a 2026-10-20 archive copy; 2026-10-13 post offers a hosted API beta with a waitlist | F02-53
LeRobot v0.7.0 carries pi0, pi0-FAST and pi0.5 and adds optional visual and proprioceptive memory to pi0.5 | F02-56
pi*0.6 (November 2025): Gemma 3 4B VLM, 860M action expert, learns from the robot's own experience | F02-50
GR00T N1.7: blog 17 April 2026, release tag 18 April 2026, newest GR00T with released weights and code as of 2026-11-20, 3B parameters, Cosmos-Reason2-2B as System 2, flow-matching DiT as System 1, 20,854 hours of human egocentric video | F02-37
The released N1.7 checkpoint has a 32-layer DiT (code default 16), action_horizon 40, max_action_dim 132, 4 inference timesteps | F02-38
LeRobot v0.7.0's groot policy supports N1.7 only, rejects N1.5 checkpoints and points to lerobot==0.5.1 | F02-47
GR00T N1: 2.2B parameters, 16-action chunk, roughly 50,000 H100 GPU-hours on up to 1,024 GPUs (author reported) | F02-34
GR00T N1.5 (2025) froze the VLM in pretraining and fine-tuning | F02-35
GR00T N1.6 (December 2025) doubled the DiT to 32 layers | F02-36
GR00T 2 adaptation: on 50 tasks NVIDIA selected as learnable from five episodes, 40% zero-shot and 95% after five demonstrations and a LoRA fine-tune of about 30 minutes on an RTX 5090; high partly by construction (vendor claim) | F02-46
SmolVLA (June 2025): 450M parameters, about 100M in the action expert, first 16 language-model layers, 50-action chunks in 10 steps, VLM frozen | F02-58
LeRobot v0.7.0's SmolVLA defaults match the paper; only the action expert trains | F02-62
No SmolVLA successor located as of 2026-11-20 | F02-64
OpenVLA-OFT (February 2025): 7B VLA, whole chunk in one parallel pass, LIBERO 76.5% to 97.1% with 26x throughput (author reported); repository last pushed 2025-09-09, no 2026 successor located; generative heads are a tendency (our reading) | F02-68
Gemini Robotics 2.5 (10 November 2026): tested on over 200 tasks; no parameter count, training compute or latency (vendor claim) | F02-74
Gemini Robotics 2 (30 July 2026): three models (VLA, reasoning VLM, on-device VLA); only the reasoning model generally reachable; VLAs for early-access partners | F02-75
Gemini Robotics On-Device 2 names the SO-101 among adapted bodies, in a bi-arm setup behind early access | F02-76
First Gemini Robotics On-Device (June 2025) and Gemini Robotics 1.5 (September 2025), dates on the timeline | F02-77, F02-79
LeRobot v0.7.0 (released 2026-11-05) ships 28 policy packages behind one lerobot-train interface; 19 imitation policies or VLAs, 7 world action models or with a world-model loss, 2 RL components; none trained on an SO-101 in this research | F02-102, F02-65
ACT is LeRobot's recommended first policy | F02-66
SmolVLA fine-tune: 450M checkpoint, about 50 episodes, 20,000 steps roughly 4 hours on a single A100 (vendor claim) | F02-63
Fine-tuning GR00T N1.7 needs one GPU with 40 GB or more; default recipe keeps the VLM frozen under about 35 GB; inference needs 16 GB | F02-42
LeRobot's pi0.5 example is sized for a single 80 GB GPU | F02-57
flux3: 7B world action model with a first-party SO-101 checkpoint and one-GPU LoRA recipe | F02-90
g05: first-party SO-101 checkpoint and fine-tune command, non-commercial licence | F02-91
molmoact2: first-party SO-100/SO-101 checkpoint with a calibration correction the converted checkpoint applies | F02-97
The 28-row table (package, what it is, default chunk, SO-101 fit) | F02-102, with F02-17, F02-29, F02-57, F02-63, F02-66, F02-80 to F02-82, F02-84 to F02-101
pi0 on an RTX 4090 with 3 cameras: 14 ms image encoders, 32 ms observation pass, 27 ms for ten action passes, 73 ms total, 46 ms seeing and reading (author reported) | F02-21
GR00T N1.7 on an H100, TensorRT full pipeline, 4 denoising steps, 1 camera: 6.2 ms, 8.8 ms, 12.3 ms stages, printed total 27.9 ms (35.9 Hz); Jetson AGX Thor 93.8 ms (10.7 Hz); eager PyTorch on H100 31.3 ms backbone, 48.2 ms action head (vendor claim) | F02-40
pi0.7 served from one H100: 38 ms minimal (3 cameras, 5 denoising steps), 127 ms worst case (author reported) | F02-52
More than 8 GB of GPU memory to run pi0 (openpi) | F02-54
SmolVLA: about 30k GPU-hours for the whole project (author reported) | F02-59
OpenVLA-OFT fine-tuning ran across 8 A100 or H100 GPUs (author reported) | F02-69
