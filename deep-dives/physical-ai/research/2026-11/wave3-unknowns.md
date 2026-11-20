# Wave 3: four unknowns closed by research, and a hand-read check of the headline claims

**Date:** 2026-11-20 (access date for every source). **Registers edited (append only):** `02-imitation-and-vla.md`, `03-world-models-and-jepa.md`, `04-rl-and-agentic-loops.md`, `06-simulation-and-sim-to-real.md`. Registers 01, 05, 07, 08 and 09 were not touched; corrections for their entries are in the Task B table only.

Method: every figure below comes from a source fetched on 2026-11-20 into a fresh directory under `/tmp` (release archives at a tag or 40-character SHA, model cards at a revision, first-party doc pages). Nothing downloaded was executed. New register quotes were checked against the downloaded text by a script (whitespace and markdown-table normalisation only) and the misses were read by hand.

## Task A. What was closed

### A1. The LeRobot v0.7.0 policy packages that were not read (register 02, unknown U8): CLOSED

Entries F02-84 to F02-101 (one per unread package) and F02-102 (the complete list of 28 with a one-line description, default chunk and SO-101 fit for each). Tag v0.7.0 resolves to commit `410c095eacc0011d998a73383eb94abed2715af0` and is still the newest release.

What the page can now say: LeRobot v0.7.0 ships 28 policy packages behind one `lerobot-train --policy.type=...` interface, and the table in F02-102 can be printed whole, without the "among the policies we read" hedge. Three of the packages wave 1 did not read ship a first-party SO-100/SO-101 checkpoint: FLUX 3 Action (`flux3`, a 7B world action model from Black Forest Labs with a one-GPU LoRA recipe on an SO-101 dataset, F02-90), Galaxea G0.5 (`g05`, with a fine-tune command for `lerobot/g05_so101` and a non-commercial licence, F02-91) and MolmoAct2 (`molmoact2`, F02-97). Seven of the 28 are world action models or train with a world-model loss (F02-84, F02-88, F02-90, F02-93, F02-94, F02-96, F02-99); two do not fit the arm as documented: LingBot-VA predicts end-effector poses, not joint positions (F02-94), and Long-WAM documents only its 7-number LIBERO action space (F02-96).

Hedge that remains: for the rows marked "Yes `[our reading]`" the fit is read from padding or dataset-contract code and docs; none of the 28 was trained on an SO-101 in this research. The v0.7.0 release blog post was not fetched (the code and docs at the tag were the source).

### A2. Cosmos 3 GPU memory (register 03, unknown U10): CLOSED, with one gap named

Entries F03-121 to F03-127. The Hugging Face model cards for Cosmos3-Nano and Cosmos3-Super print no memory figure (re-read at their current revisions); the figures are in three other first-party places.

What the page can now say: NVIDIA's NIM support matrix states a minimum GPU memory per device for each configuration. Cosmos3-Nano (16B) at full precision needs 58 GiB with everything resident on the GPU, 44 GiB in FP8, and 31 GiB when the weights are offloaded layer by layer to at least 64 GiB of host memory; Cosmos3-Super (64B) needs 150 GiB per device at full precision and 93 GiB in FP8 (F03-121). The open-source framework's FAQ gives 32 GB for Nano and 128 GB for Super, which matches the size of the BF16 weights (F03-123), and measured peaks on one H100 80 GB are 33.8 GiB for one 720p Nano image and 12.4 GiB for a 121-frame Cosmos3-Edge video (F03-124, from notes written for coding agents in NVIDIA's repository, weaker provenance than a product page). Cosmos3-Edge (4B) runs on a 16 GB Jetson (F03-127), and Nano has been run on a 12 GB RTX 5070 by streaming weights from 128 GB of host memory (F03-125). For fine-tuning Cosmos 3 as a robot policy, LeRobot measured 21 GB for an Edge LoRA and 64 GB for a Nano LoRA on 80 GB GPUs (register 02, F02-84).

Still open inside it: no measured peak for a full 189-frame Nano video on the PyTorch path, and none for the robot forward-dynamics rollout whose latency F03-99 quotes. One contradiction was added to register 03 section 8: the framework FAQ labels the models "8B" and "32B" where the model cards say 16B and 64B; use the cards.

### A3. The camera behind the Isaac Lab 3.0 benchmark (register 06, unknown U7; cross-referenced from F04-55): CLOSED for the manipulation rows, STILL OPEN for Cartpole

Entries F06-103 (Kuka-Allegro rows) and F06-104 (Cartpole rows). Notes pointing to them were added under F06-48, F06-49 and F04-55.

What the page can now say: the Kuka-Allegro lift rows (F06-49, F04-55) use one fixed base camera per environment at 64 x 64 pixels, read from the `rgb64` and `simple_shading_full_mdl64` preset definitions at tag v3.0.0; the Newton renderer row renders RGB and the RTX rows render the `simple_shading_full_mdl` data type, so the renderer comparison is not the same output pixel for pixel (F06-103). For the Cartpole camera rows (F06-48) the size is not settled: the task config says 96 x 96 at the tag and at the commit the benchmark ran on, while the benchmark's group label (`_R64`) and README ("the fixed 64×64 comparison") say 64; the export's resolution column is empty and its notes say the working tree was dirty (F06-104). Keep "one small camera per environment" for Cartpole and print no pixel count for it.

What was tried for Cartpole: the task configs at the tag and at benchmark commit `cfa9e35c2a756849f3fea4bde9eac947f85a8300`, the benchmarks README, every column of the release CSV, and `scripts/benchmarks/training.py` (no camera or resolution argument). The runner that would force 64 pixels is NVIDIA's internal one and is not in the repository.

### A4. The MuJoCo Playground SO-101 pick-cube physics timestep (register 06, unknown U4): CLOSED

Entries F06-105 and F06-106. Tag v1.0.1 (commit `084e7957842792725d70866ee840d8fd79f17bbe`, 2026-11-09) is still the newest.

What the page can now say: the SO-101 pick-cube environments step physics every 5 ms (200 Hz). The vision task (`SO101PickCubeVision`) acts every 100 ms, so one policy step is 20 physics steps; the state-only task (`SO101PickCube`) keeps the 20 ms default, 4 physics steps per policy step (F06-105). The scene uses the `implicitfast` integrator, elliptic friction cones and `impratio` 10, inherited from the base plane model, and the vision task raises the convex-collision iteration limit to 300 (F06-105, F06-106).

Hedge that remains: the solver type and the solver and line-search iteration counts are not set anywhere in the task code (they are `None` in the config, so MuJoCo's defaults apply; the default values were not re-fetched). The Menagerie SO-101 XML is referenced without a commit.

## Task B. Hand-read check of the headline claims

Each entry was looked up in the wave 2 refutation files. Where wave 2 had only matched the quote by script, or the quote printed in the register did not carry every part of the claim, the claim was read against the quote and the source was fetched again on 2026-11-20. "Read quote only" means the quote in the register carries the whole claim and no fetch was needed. No entry is WRONG. Five are SCOPE NARROWER: two found in this wave (F05-29, F05-65) and three where wave 2 had already written the correction into the register (F02-40, F03-104, F05-76).

Corrections for registers 05, 07, 08 and 09 are written here only, as instructed. No new correction line was needed in registers 02, 03, 04 or 06: their two SCOPE NARROWER entries already carry the wave 2 correction.

| Entry | What it claims | Verdict | How checked | Corrected wording or note |
|---|---|---|---|---|
| F02-6 | ACT (Action Chunking with Transformers) success rates and chunk size 100 at 50 Hz | HOLDS | re-fetched (arXiv 2304.13705v1) | Paper text has the averaged-over-4-settings rate, chunk size 100 and 50 Hz as the register states. |
| F02-60 | pi0.7 headline (Physical Intelligence) | HOLDS | read quote only | Quote carries the claim. |
| F02-40 | GR00T N1.7 inference latency figure from the model card | SCOPE NARROWER | re-fetched (model card) | Wave 2 correction already in the register and confirmed: the figure is for 4 denoising steps and 1 camera; the Jetson Orin figure is the action head (DiT) on TensorRT only; the printed stage times add to 27.3 ms against a printed total of 27.9 ms. Print the conditions next to the number. |
| F02-44 | GR00T N1.7 fine-tuning requirement | HOLDS | read quote only | Quote carries the claim. |
| F02-51 | pi0.7 backbone (Gemma3 4B) and prompt contents (subgoal images, episode metadata) | HOLDS | re-fetched (arXiv 2604.15483v2) | |
| F03-25 | V-JEPA 2 headline figure | HOLDS | read quote only | Quote carries the claim. |
| F03-74 | V-JEPA 2-AC planning figure | HOLDS | read quote only | Keep the guard sentence wave 2 added under the entry. |
| F03-98 | Cosmos 3 generation latency rows | HOLDS | re-fetched (benchmark methodology page at commit 0eab578a8935e26aa41c2b7dc9f5ab00f790a037) | Rows are in the quote; BF16 precision and 189 frames confirmed on the methodology page. Memory for these rows: F03-121 to F03-124. |
| F03-104 | Cosmos 3 scope statement | SCOPE NARROWER | read quote only | Wave 2 correction already in the register; nothing to add. |
| F03-115 | Derived comparison of planning cost across world models | HOLDS | read quote only, arithmetic redone | Inputs F03-24, F03-73, F03-40 and F03-77 reproduce the figure; the 4,096-sample figure is the real-robot configuration. |
| F03-41 | DINO-WM builds on a frozen DINOv2 encoder | HOLDS | re-fetched (arXiv 2603.19312v3) | |
| F03-8 | V-JEPA EMA (exponential moving average) momentum 0.99925 | HOLDS | re-fetched (training config at pinned SHA) | `ema: [0.99925, 0.99925]`: a linear schedule between two equal values, so the momentum is constant. |
| F04-54 | Isaac Lab 3.0 benchmark tasks train with PPO via RSL-RL | HOLDS | re-fetched (config at tag v3.0.0) | |
| F04-55 | Isaac Lab 3.0 Kuka-Allegro camera training rows | HOLDS | re-fetched (preset definitions at tag v3.0.0) | Camera size is now known: one 64 x 64 base camera per environment (F06-103). |
| F04-19 | PPO clipping detail | HOLDS | read quote only | Quote carries the claim. |
| F04-18 | PPO derived figure | HOLDS | read quote only, arithmetic redone | |
| F04-70 | RLinf GRPO fine-tuning result on LIBERO-Goal | HOLDS | re-fetched (results file) | The "(7B)" model size in the claim comes from F02-68, not from this file; cite both. |
| F04-65 | RECAP: two improvement iterations, autonomous data only, 300 episodes on four robots | HOLDS | re-fetched (arXiv 2511.14759v2) | |
| F05-29 | Public SO-101 pick-and-place dataset: AV1, 640x480, 30 fps, 50 episodes | SCOPE NARROWER | re-fetched (dataset `meta/info.json`) | Codec, resolution and frame rate hold. The dataset's own metadata records `robot_type: so100_follower`. Corrected wording: "A public 50-episode pick-and-place dataset named for the SO-101 (`lerobot/svla_so101_pickplace`; its info.json records robot_type so100_follower, see F05-23) stores AV1 video at 640x480 and 30 fps." |
| F05-35 | Video decode cost in the data loader | HOLDS | read quote only | Quote carries the claim. |
| F05-47 | Dataset format detail (LeRobotDataset v3) | HOLDS | read quote only | Quote carries the claim. |
| F05-65 | vCPUs per GPU on eight-GPU EC2 sizes | SCOPE NARROWER | re-fetched (EC2 accelerated-computing instance types page) | The sentence "A vCPU on the x86 rows is one hardware thread; 24 vCPUs are 12 physical cores" is false for G7. Corrected wording: "On the eight-GPU sizes of G5, G6, G6e, G7e, P5, P5e, P5en, P6-B200 and P6-B300, the 24 vCPUs per GPU are 12 physical cores with 2 threads each. g7.48xlarge is the exception among the x86 rows: 192 vCPUs on 192 cores, 1 thread per core, so 24 physical cores per GPU." F08-57 already states it this way. |
| F05-76 | Storage throughput claim | SCOPE NARROWER | read quote only | Wave 2 correction already in register 05; nothing to add. |
| F06-48 | Isaac Lab 3.0 Cartpole camera benchmark rows | HOLDS | re-fetched (release CSV and task config at tag v3.0.0) | Numbers hold. Print no pixel count: config says 96 x 96, benchmark label says 64 (F06-104). |
| F06-49 | Isaac Lab 3.0 Kuka-Allegro camera benchmark rows | HOLDS | re-fetched (release CSV and presets at tag v3.0.0) | Camera is 64 x 64 (F06-103). |
| F06-52 | Isaac Sim 6.2.0: "GPUs without RT Cores (A100, H100) are not supported", GPU tiers, Linux driver 595.58.03 | HOLDS | re-fetched (6.2.0 requirements page) | The driver version is not in the register quote; the page reads "Linux: 595.58.03" under all three tiers. Minimum-tier VRAM cell reads "16GB [2]", the footnote already quoted. |
| F06-51 | Isaac Lab 3.0 install guide: Newton-only needs a CUDA GPU, no RTX | HOLDS | re-fetched (installation.rst at SHA e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4) | The fourth quoted sentence ("Isaac Sim's workstation memory requirements do not apply to a Newton-only installation.") is absent from the Evidence line and present in the file, line 107. |
| F06-20 | MuJoCo Warp nightly throughput on one RTX 6000 Ada | HOLDS | read quote only | Quote carries every figure; 25.15 / 0.342 = 73.5, the entry rounds to 74. |
| F06-81 | SIMPLER: validation MSE Pearson r 0.308 against 0.924 for closed-loop simulation | HOLDS | read quote only | Quote carries all four table rows. |
| F06-83 | PolaRiS: average r = 0.9, worst 0.81, r = 0.98 with RoboArena; 20 real and 50 simulated rollouts | HOLDS | re-fetched (arXiv 2512.16881v2) | The 50 was not in the register quote; the paper reads "then run 50 rollouts per task in simulation to compute the policy's performance". |
| F06-26 | MuJoCo Playground detail | HOLDS | re-fetched (README at tag v1.0.1) | |
| F06-30 | MuJoCo Playground detail | HOLDS | re-fetched (README at tag v1.0.1) | |
| F07-1 | GR00T N1.7 latency table across six devices (22.9 ms on H100 to 149.0 ms on Jetson Orin, TensorRT) | HOLDS | read quote only | Quote carries all six rows. |
| F07-4 | Mixed NVFP4 on AGX Thor: 76.8 ms to 35.6 ms | HOLDS | read quote only, arithmetic redone | 76.8 / 35.6 = 2.16; 106.8 / 35.6 = 3.0; 1000 / 35.6 = 28.1. |
| F07-87 | Edge component size row (6 MB) | HOLDS | re-fetched | |
| F07-92 | Edge deployment documentation claim | HOLDS | read quote only | The wave 2 fix to the URL (trailing colon) stands. |
| F08-57 | CPU cores per GPU across EC2 GPU sizes | HOLDS | re-fetched (EC2 accelerated-computing instance types page) | All rows match, including the ones not in the register quote: g5, g6, p5, p5e, p5en, p6-b200 and p6-b300 .48xlarge at 192 vCPUs / 96 cores / 2 threads; g6.xlarge and g6e.xlarge at 4 vCPUs; g7.2xlarge to g7.8xlarge at 8 to 32 vCPUs, 1 thread per core. |
| F09-91 | Register 09 headline | HOLDS | read quote only | Quote carries the claim. |
| F09-35 | Register 09 headline | HOLDS | read quote only | Quote carries the claim. |
| F09-5 | AWS Batch array jobs: index starts at 0; parent goes to FAILED when any child fails | HOLDS | re-fetched (AWS Batch user guide) | Page reads "starting at index 0" and "the parent job transitions to FAILED when all child jobs complete". |
| F09-49 | Register 09 headline | HOLDS | read quote only | Quote carries the claim. |

Rows whose "What it claims" cell is generic (F02-60, F02-44, F03-25, F03-74, F03-104, F04-19, F04-18, F05-35, F05-47, F05-76, F06-26, F06-30, F07-87, F07-92, F09-91, F09-35, F09-49) were read in full in the register; the cell is a pointer, and the register entry is the wording of record.

## New sources to add to sources.md

All accessed 2026-11-20. Grouped by tier.

### Tier 1 (first-party docs, code and data at a pinned tag, SHA or revision)

LeRobot v0.7.0, commit 410c095eacc0011d998a73383eb94abed2715af0:
- https://github.com/huggingface/lerobot/tree/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies (the 28 packages)
- https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/docs/source/ : `cosmos3.mdx`, `eo1.mdx`, `fastwam.mdx`, `flux3.mdx`, `g05.mdx`, `lawam.mdx`, `lingbot_va.mdx`, `lingbot_vla_v2.mdx`, `longwam.mdx`, `molmoact2.mdx`, `multi_task_dit.mdx`, `policy_fineart_vla_README.md`, `vla_jepa.mdx`, `wall_oss_05.mdx`
- https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/ : `dm05/configuration_dm05.py`, `evo1/configuration_evo1.py`, `gaussian_actor/configuration_gaussian_actor.py`, `wall_x/configuration_wall_x.py`

Cosmos 3 memory:
- https://docs.nvidia.com/nim/cosmos/latest/support-matrix.html (NIM support matrix; unversioned "latest" URL, so the access date is the pin)
- https://github.com/NVIDIA/cosmos-framework/blob/82d6f4e7c08b04f4cfa7c6de103d9be2e30af213/docs/faq.md
- https://github.com/NVIDIA/cosmos-framework/blob/82d6f4e7c08b04f4cfa7c6de103d9be2e30af213/README.md
- https://github.com/NVIDIA/cosmos-framework/blob/82d6f4e7c08b04f4cfa7c6de103d9be2e30af213/packages/diffusers-cpu-offloading/README.md
- https://github.com/NVIDIA/cosmos-framework/blob/82d6f4e7c08b04f4cfa7c6de103d9be2e30af213/.agents/skills/cosmos3-inference-generate-media/references/skill-notes.md (first-party repository, but notes written for coding agents: grade it below a product page when citing)
- https://raw.githubusercontent.com/NVIDIA/Cosmos/0eab578a8935e26aa41c2b7dc9f5ab00f790a037/docs/reference/inference_benchmarks/cosmos3-super-generator.md
- https://huggingface.co/nvidia/Cosmos3-Edge (model card, read at revision 6afc1256321c3a8e623d89be3bc5117a1e90f96b)

Isaac Lab v3.0.0, commit e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4:
- https://github.com/isaac-sim/IsaacLab/blob/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/source/isaaclab_tasks/isaaclab_tasks/core/lift/config/kuka_allegro/camera_cfg.py
- https://github.com/isaac-sim/IsaacLab/blob/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/source/isaaclab_tasks/isaaclab_tasks/core/cartpole/cartpole_common.py

MuJoCo Playground v1.0.1, commit 084e7957842792725d70866ee840d8fd79f17bbe:
- https://github.com/google-deepmind/mujoco_playground/blob/084e7957842792725d70866ee840d8fd79f17bbe/third_party/reaf_sim/reaf/simulation/torch/_src/builders/config.py
- https://github.com/google-deepmind/mujoco_playground/blob/084e7957842792725d70866ee840d8fd79f17bbe/mujoco_playground/_src/objects/assets/primitive/plane.xml

### Tier 2 and 3 (linked from the LeRobot policy docs; cited in register 02 as pointers, not as the source of any number)

- https://allenai.org/blog/molmoact2 (Tier 2, vendor blog)
- https://github.com/black-forest-labs/flux-action (Tier 1 repository, unpinned: pin to a SHA before citing a figure from it)
- https://github.com/RLinf/LaWAM (Tier 3 repository, unpinned: same)
- https://arxiv.org/pdf/2509.11766 (Tier 3, preprint)
- https://x2robot.com/en/research/68bc2cde8497d7f238dde690 (Tier 2, vendor page)
- https://huggingface.co/datasets/maximellerbach/omx_multicubes (Tier 3, community dataset)

Sources fetched again for Task B were already in sources.md through their registers; none is new.

