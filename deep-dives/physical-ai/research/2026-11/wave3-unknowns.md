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

What the page can now say: the Kuka-Allegro lift rows (F06-49, F04-55) use one fixed base camera per environment at 64 x 64 pixels, read from the `rgb64` and `simple_shading_full_mdl64` preset definitions at tag v3.0.0; the Newton renderer row renders RGB and the RTX rows render the `simple_shading_full_mdl` data type, so the renderer comparison is not the same output pixel for pixel (F06-103). For the Cartpole camera rows (F06-48) the size is not settled: the task config says 96 x 96 at the tag and at the commit the benchmark ran on, while the benchmark's group label (`_R64`) and README ("the fixed 64x64 comparison") say 64; the export's resolution column is empty and its notes say the working tree was dirty (F06-104). Keep "one small camera per environment" for Cartpole and print no pixel count for it.

What was tried for Cartpole: the task configs at the tag and at benchmark commit `cfa9e35c2a756849f3fea4bde9eac947f85a8300`, the benchmarks README, every column of the release CSV, and `scripts/benchmarks/training.py` (no camera or resolution argument). The runner that would force 64 pixels is NVIDIA's internal one and is not in the repository.

### A4. The MuJoCo Playground SO-101 pick-cube physics timestep (register 06, unknown U4): CLOSED

Entries F06-105 and F06-106. Tag v1.0.1 (commit `084e7957842792725d70866ee840d8fd79f17bbe`, 2026-11-09) is still the newest.

What the page can now say: the SO-101 pick-cube environments step physics every 5 ms (200 Hz). The vision task (`SO101PickCubeVision`) acts every 100 ms, so one policy step is 20 physics steps; the state-only task (`SO101PickCube`) keeps the 20 ms default, 4 physics steps per policy step (F06-105). The scene uses the `implicitfast` integrator, elliptic friction cones and `impratio` 10, inherited from the base plane model, and the vision task raises the convex-collision iteration limit to 300 (F06-105, F06-106).

Hedge that remains: the solver type and the solver and line-search iteration counts are not set anywhere in the task code (they are `None` in the config, so MuJoCo's defaults apply; the default values were not re-fetched). The Menagerie SO-101 XML is referenced without a commit.

## Task B. Hand-read check of the headline claims

(in progress; rows are appended as they are checked)

