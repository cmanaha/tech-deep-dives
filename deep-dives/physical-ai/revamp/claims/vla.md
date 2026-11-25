# Claims: section 5, Vision-Language-Action Models

Claim the section proves: a VLA is a vision-language backbone with an action head, run at two rates; the split says where the time of a call goes, what keeps the control clock (the chunk) and what GPU memory a fine-tune needs.

Anchor numbers: GR00T N1's 10 Hz backbone and 120 Hz of actions against 63.9 ms on an L40 per 16-action chunk (author reported, F02-33, F02-34), at most 15.6 chunks a second by our arithmetic, landed in the opening, in the two-rates block and in the closing check; pi0's split of 3B backbone and 300M head (F02-32), landed in the opening, the figure and the table.

claim | register ID

A VLA's observation is camera images, a language command and the joint angles; the output is an action chunk | F02-18
A VLA is a VLM pretrained on web images and text, extended with robot state in and an action chunk out through an action expert | F02-32
pi0 (October 2024): PaliGemma backbone of 3B parameters, action expert of 300M, 3.3B in total | F02-32, F02-18
GR00T N1 (March 2025): VLM (System 2) at 10 Hz on an L40, motor actions from the action head (System 1) at 120 Hz (author reported) | F02-33
GR00T N1 samples a 16-action chunk in 63.9 ms on an L40 (author reported); the paper does not say whether that includes a backbone pass | F02-34
63.9 ms per chunk is about 15.6 chunks a second and room for 250 actions a second (our arithmetic, printed in the entry) | F02-33
120 actions a second in chunks of 16 need 7.5 chunks a second if every action of every chunk is played (our arithmetic, shown) | F02-33, F02-34
At 10 Hz and 120 Hz, 12 actions leave per backbone pass, and passes are 100 ms apart (our arithmetic, shown) | F02-33
pi0 encodes the prefix once and caches the attention keys and values; each refinement step re-runs only the action tokens; 10 steps of size 0.1 | F02-20
GR00T N1's head cross-attends to the VLM's output tokens and uses embodiment-specific encoders and decoders; in pi0 and GR00T N1 what crosses from backbone to head is vectors | F02-33, F02-20
The SO-101 runs at 30 actions a second with six joint numbers and two cameras at 640 x 480 | F02-67
GR00T N1.7's default fine-tune freezes the VLM and stays under about 35 GB; minimum one GPU with 40 GB; 80 GB or more per GPU recommended once the VLM or vision encoder trains; a 24 GB card is under the minimum; inference needs 16 GB | F02-42
VLAs are pretrained on web data and on other robots' recordings (pi0; SmolVLA's community datasets) | F02-32, F02-59
pi0's state and action vectors are padded to 32 in the open code (18 in the paper); the SO-101's six numbers fill six slots | F02-23
LeRobot v0.7.0's pi0 keeps a 50-step chunk, padding to 32 and 10 inference steps | F02-29
GR00T N1.7's code pads state and action to 132, sets a chunk of 40 and 4 inference steps; the released checkpoint has a 32-layer DiT (code default 16) and feeds the head from VLM layer 16 | F02-38
NVIDIA's repository documents fine-tuning N1.7 for the SO-100 and SO-101 with the NEW_EMBODIMENT tag | F02-43
X-VLA: 0.9B, 32 soft-prompt vectors for each of up to 30 robot types, trainable in LeRobot's fine-tuning example; tuning 9M parameters (1%) reaches 93% on LIBERO (author reported) | F02-70, F02-82
SmolVLA (June 2025): 450M parameters, about 100M in the action expert, first 16 language-model layers, 50-action chunks in 10 steps, VLM frozen | F02-58
GR00T N1: 2.2B parameters with 1.34B in the VLM, 16-action chunk, 4 inference steps | F02-34
GR00T N1.7 (April 2026): 3B parameters, Cosmos-Reason2-2B as System 2, flow-matching DiT as System 1 | F02-37
pi0.7 (April 2026): about 5B, 4B backbone, 860M action expert, video-history encoder, 50-step chunks in 5 denoising steps, plays 15 or 25 | F02-51
pi0's loss is the loss at one flow time; tau is drawn per example, more often near the noisy end | F11-5
pi0 training loss and forward Euler step (formulas) | F02-19, F02-20
SmolVLA in LeRobot v0.7.0 predicts 50 actions and plays 50 by default; at 30 Hz that is one call every 1.67 s (our arithmetic, shown) | F02-62, F02-67
LeRobot's GR00T N1.7 example for a new arm sets chunk_size 16 and n_action_steps 16; at 30 Hz a call every 0.53 s (our arithmetic, shown) | F02-81, F02-67
pi0.5 (April 2025) writes a text subtask, then the action chunk conditioned on it, in one model | F02-48
The GR00T N1 line up to N1.7 pairs a VLM with a DiT action head; the N1.7 model card times backbone and action head separately | F02-37, F02-40
The first Gemini Robotics (March 2025): backbone in the cloud under 160 ms, decoder on the robot, about 250 ms end to end, effective 50 Hz (vendor claim); the chunk covers the link's delay (our reading) | F02-78
In GR00T 2 a reasoning model acts as System 2 and calls the action model as a tool; everything but the reasoning model runs on the robot | F02-45
GR00T 2 is a world action model: one diffusion transformer denoises future video and the action chunk together | F02-44
GR00T 2 Turbo, for the Unitree G1 after NVIDIA's inference optimisations: 38 ms on an RTX 5090, 124 ms on the robot's Jetson Thor, 1.6 s chunks about once per second, controller at 50 Hz (vendor claim, with the GR00T 2 label) | F02-45
GR00T 2 Turbo: 2B parameters on the project page, the same figure the whitepaper gives for the full model; not reconciled (lookup panel, with the label) | F02-45
GR00T 2 adaptation: on 50 tasks NVIDIA selected as learnable from five episodes, 40% with no demonstration and 95% after five demonstrations and a LoRA fine-tune of about 30 minutes on an RTX 5090; high partly by construction (vendor claim, with the label) | F02-46
pi0 on an RTX 4090 with 3 cameras: 14 ms image encoders, 32 ms observation pass, 27 ms for ten action passes, 73 ms total, 46 ms seeing and reading (author reported) | F02-21
GR00T N1.7 on an H100, 4 denoising steps, 1 camera: eager PyTorch 31.3 ms backbone and 48.2 ms action head; TensorRT stages 6.2 ms, 8.8 ms, 12.3 ms beside a printed total of 27.9 ms (35.9 Hz); Jetson AGX Thor with TensorRT 93.8 ms (10.7 Hz) (vendor claim) | F02-40
Isaac-GR00T deployment guide on AGX Thor: 76.8 ms with TensorRT for a different checkpoint with two cameras; 35.6 ms with NVFP4 quantisation, the README's "~28 Hz" (vendor claim); NVIDIA prints several Thor latencies, and among the three TensorRT figures listed 93.8 / 35.6 = 2.6 (our arithmetic, shown) | F02-41, F02-40
pi0.7 served from one H100: 38 ms minimal (3 cameras, 5 denoising steps), 127 ms worst case with the video-history encoder and subgoal images (author reported) | F02-52, F02-51
More than 8 GB of GPU memory to run pi0 (openpi's table); 16 GB to run GR00T N1.7 (NVIDIA's guide) | F02-54, F02-42
Camera capture and decode are separate CPU or video-engine work, in a published latency only where the table says so (our reading) | F02-40
GR00T N1 pretraining: roughly 50,000 H100 GPU-hours on up to 1,024 GPUs (author reported) | F02-34
SmolVLA: pretrained on 4 GPUs; about 30k GPU-hours for the whole project, every experiment and not one pretraining run (author reported) | F02-59
SmolVLA trains only the action expert (train_expert_only) | F02-58, F02-62
GR00T N1 fine-tuning on a single A6000: batch up to 200 tuning only adapter layers and DiT, up to 16 when tuning the vision encoder (author reported) | F02-34
openpi: more than 22.5 GB for a LoRA fine-tune, more than 70 GB for a full one | F02-54
LeRobot's pi0.5 example, a LIBERO fine-tune at batch 64, is sized for a single 80 GB GPU; no minimum for the SO-101 is stated | F02-57
OpenVLA-OFT fine-tuning ran across 8 A100 or H100 GPUs (author reported) | F02-69
LeRobot v0.7.0 has one LoRA switch (--peft.method_type=LORA); before it, --policy.use_peft=true alone ran a full fine-tune silently | F02-83
openpi holds pi0, pi0-FAST and pi0.5 only, no pi*0.6 or pi0.7 weights; a 2026-10-13 post offers hosted training and inference through an API beta with a waitlist | F02-53
GR00T N1.7 is the newest GR00T with released weights and code as of 2026-11-20 (blog 17 April 2026, release tag 18 April 2026); 20,854 hours of egocentric human video | F02-37
GR00T 2: research page dated November 2026 and a whitepaper, no code yet | F02-44
Gemini Robotics 2 (30 July 2026): three models; only the reasoning model generally reachable; VLAs for early-access partners | F02-75
LeRobot v0.7.0 (released 2026-11-05) ships 28 policy packages behind one lerobot-train interface | F02-65, F02-102
SmolVLA fine-tune: 450M checkpoint, about 50 episodes, 20,000 steps roughly 4 hours on a single A100 (vendor claim) | F02-63
On the SO-101 pick-place task with 50 demonstrations SmolVLA reports 90% in distribution and 50% out of distribution, ACT 70% and 40%; SmolVLA was not pretrained on SO-101 data (author reported) | F02-60
ACT is LeRobot's recommended first policy; no pretrained robot model, but its ResNet-18 image backbone starts from ImageNet weights | F02-66, F02-11
LeRobot v0.7.0's groot policy supports N1.7 only, rejects N1.5 checkpoints and points to lerobot==0.5.1 | F02-47
LeRobot v0.7.0 carries pi0.5 and adds optional visual and proprioceptive memory to it | F02-56
molmoact2: first-party SO-100/SO-101 checkpoint trained under an older calibration convention; without a correction the arm may move in the wrong direction; the converted checkpoint applies it | F02-97
g05: first-party SO-101 checkpoint and fine-tune command, non-commercial licence | F02-91
flux3: 7B world action model with a first-party SO-101 checkpoint and one-GPU LoRA recipe; full fine-tuning in the vendor's repository | F02-90
pi*0.6 (November 2025): Gemma 3 4B VLM, 860M action expert, learns from the robot's own experience | F02-50
pi0.7 is the newest Physical Intelligence model with a paper as of 2026-11-20 (first posted 16 April 2026); prompt with episode metadata and subgoal images | F02-51
GR00T N1.5 (2025) froze the VLM in pretraining and fine-tuning | F02-35
GR00T N1.6 (December 2025) doubled the DiT to 32 layers | F02-36
LeRobot v0.7.0's SmolVLA defaults match the paper | F02-62
OpenVLA-OFT (February 2025): 7B VLA, whole chunk in one parallel pass, LIBERO 76.5% to 97.1% with 26x throughput (author reported); no LeRobot package of that name | F02-68, F02-102
Gemini Robotics 2.5 (10 November 2026): newest Gemini Robotics VLA located; tested on over 200 tasks; no parameter count, training compute or latency (vendor claim) | F02-74
Gemini Robotics On-Device 2 shown adapted to the SO-101, in a bi-arm setup behind early access | F02-76
Timeline dates: pi0.5, pi*0.6, pi0.7, GR00T N1, N1.7, GR00T 2, SmolVLA, OFT, Gemini Robotics releases | F02-34, F02-37, F02-44, F02-48, F02-50, F02-51, F02-53, F02-58, F02-68, F02-74, F02-75, F02-77, F02-78, F02-79
The 28-row table (package, what it is, default chunk, SO-101 fit; "By shape" rows are our reading), sorted by fit | F02-102, with F02-17, F02-29, F02-57, F02-63, F02-66, F02-80 to F02-82, F02-84 to F02-101
The model in the news and the model a reader can fine-tune are usually different models (our reading) | F02-53
Fine-tuning a VLA for one arm is a single-GPU run of hours, gated by GPU memory | F02-63, F02-42, F02-54
