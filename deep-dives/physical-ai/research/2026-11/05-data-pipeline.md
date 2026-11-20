# 05 The data pipeline: research register

## 1. Header

- **Research date:** 2026-11-20. Every URL in this file was accessed 2026-11-20.
- **Area:** stream 05 of the "Physical AI" dive. How robot data is collected (leader-arm teleoperation, hand-held rigs, fleets, human video), how LeRobot stores it (dataset format v3.0, video codecs), how it is processed and curated (decode, filter, embed, deduplicate), how it is multiplied (image transforms, demonstration multiplication in simulation, generative augmentation), and which part of the machine each stage loads.
- **Sections fed:** section 9 "Collecting Data", section 10 "Processing and Curating", section 11 "Augmentation and Synthetic Data".
- **Seed research:** seed 02 sections 1, 2 and 4, and seed 11 ("The data workload"). A seed claim is carried only where its source was re-fetched today.
- **Reader:** knows computers (IT or software), has no robotics background.
- **Quote policy:** quotes are verbatim from the pinned version, with house normalisation: curly quotes become straight quotes, typographic dashes become " - " or a hyphen, arrows are written "->", multiplication signs become "x". Ellipses mark omissions. Code is quoted with its file and line numbers at the pinned ref.
- **Verdicts:** NEW (recorded fresh from the primary source); CARRIED (seed NN, re-fetched); STALE; WRONG; UNKNOWN (see section 9).
- **Labels:** `[derived]` arithmetic with inputs shown; `[vendor claim]` and `[author reported]` for performance figures from the party that built the thing; `[our reading]` for synthesis; `[illustration]` for invented toy numbers.

### Tiers

| Tier | What it covers |
|---|---|
| Tier 0 | Our experiments (none in this file) |
| Tier 1 | Source code at a pinned tag or 40-character SHA; official docs; API responses; vendor support matrices |
| Tier 2 | First-party vendor or lab blogs and talks |
| Tier 3 | Papers ("peer-reviewed (venue)" only where the venue was confirmed, otherwise "preprint"); third-party technical analysis |
| Tier 4 | Tutorials and press. Used only to locate primary sources |

Code is the authority over documentation.

## 2. Currency table

Newest first-party version found on 2026-11-20 for every tool, model, device and instance family this register names.

| Item | Newest version found | Release date | Source | What the seed research named |
|---|---|---|---|---|
| LeRobot | v0.7.0 (tag SHA `410c095eacc0011d998a73383eb94abed2715af0`) | 2026-11-05 | https://github.com/huggingface/lerobot/releases/tag/v0.7.0 | v0.7.0 (same) |
| LeRobot dataset format (`CODEBASE_VERSION`) | "v3.0", at the tag and at the default-branch head `039e05183f38b02d28c5f6ac9dbc7ef1680728cd` read today | introduced with v0.4.0, 2025-10-23 | F05-16 | v3.0 (same) |
| torchcodec (LeRobot's default video decoder) | 0.17.0 (tag SHA `d9dc54238e173000bc3969eb3959777026ff9ae8`) | 2026-09-30 | https://github.com/meta-pytorch/torchcodec/releases/tag/v0.17.0 | not versioned in the seed |
| NVIDIA Cosmos Curator | v2.10.0 (SHA `95675431e309fd86c1c559a39fcb694ddedaa2a9`) | 2026-11-10 | https://github.com/NVIDIA/cosmos-curator/releases/tag/v2.10.0 | the repository, with throughput figures that belong to a 2025 predecessor (F05-78) |
| NVIDIA NeMo Curator | v1.4.0 (SHA `10fba1ea785863872ae6983b580ec6813e72cc79`) | 2026-10-09 | https://github.com/NVIDIA-NeMo/Curator/releases/tag/v1.4.0 | named through its requirements page, no version |
| Isaac Lab (Mimic, SkillGen) | v3.0.0 (SHA `e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4`); v3.0.0-EA was 2026-09-16 | 2026-10-20 | https://github.com/isaac-sim/IsaacLab/releases/tag/v3.0.0 | v3.0.0, with the year inferred; now confirmed from the releases API |
| GR00T-Mimic blueprint | v1.0; last commit `be78013710543995b40a3a122294e6ab21699e67` on 2025-05-20 | 2025-03-18 | https://github.com/NVIDIA-Omniverse-blueprints/synthetic-manipulation-motion-generation/releases/tag/v1.0 | named, no state given; it is stale (F05-94) |
| NVIDIA Cosmos (generative world models) | Cosmos 3: Super 64B, Nano 16B, Edge 4B; repository head `0eab578a8935e26aa41c2b7dc9f5ab00f790a037` (2026-11-19) | "May 2026" in the README; GitHub release "Cosmos3" 2026-06-01; Edge "Jul 2026"; interactive simulation "Oct 2026" | https://github.com/NVIDIA/cosmos (root, read at the SHA) | Cosmos 3 named; timings quoted from Cosmos-Transfer2.5 |
| Cosmos-Transfer2.5, Cosmos-Predict2.5 | retired: "no longer under active development"; last commits `2ff49d0717af02057ae79bc75c00fbff9da1b4e7` (2026-06-07) and `a2c298b0a3df3778b973fe65e9e58877b292d8a7` (2026-06-08) | n/a | F05-95, F05-99 | Transfer 2.5 used as the current timing source (seed 11) |
| DreamGen paper | arXiv 2505.12705v2 (latest version listed) | v1 2025-05-19 | https://arxiv.org/abs/2505.12705v2 | same paper |
| MimicGen paper (history) | arXiv 2310.17596v1 (only version) | 2023-10 | https://arxiv.org/abs/2310.17596v1 | same paper |
| UMI paper (history) | arXiv 2402.10329v3 (latest version listed) | 2024-02 (v1) | https://arxiv.org/abs/2402.10329v3 | same paper |
| Hand-held rig datasets after UMI | FastUMI-100K, arXiv 2510.08022v1; HiFi-UMI-2K dataset card (July 2026) | 2025-10; 2026-07 | F05-9, F05-10 | HiFi-UMI-2K from the LeRobot blog only |
| Generalist data scale | GEN-1 post: "over half a million hours" | 2026-04-02 | https://generalistai.com/blog/gen-1 | 270,000 hours first-party; 500,000 marked as secondary only |
| NVIDIA video encode/decode support matrix | page as served today (unversioned); includes B300, GB300 and DGX Spark rows; no H200 row | accessed 2026-11-20 | https://developer.nvidia.com/video-encode-decode-support-matrix | A100, H100, B200, L4, L40S, RTX PRO 6000 rows |
| Jetson Linux / JetPack | Jetson Linux 39.2.2 / JetPack 7.2.2 found as newest; the Orin Nano statement in F05-57 reads the same in the r36.5 and r39.2.2 guides | not recorded (U4) | https://docs.nvidia.com/jetson/archives/r36.5/DeveloperGuide/SD/Multimedia/SoftwareEncodeInOrinNano.html | Orin Nano measured with "x264 only" (seed 11) |
| EC2 accelerated instance families | page as served today; G7 (RTX PRO 4500), G7e, P6-B200, P6-B300, P6e-GB200 present | accessed 2026-11-20 | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | G7 not named in the seed |
| AWS reference for Cosmos 3 on HyperPod | blog post | 2026-09-04 | F05-104 | same post |

Not determined: the newest release of NVIDIA DALI (not fetched), PyAV and SVT-AV1 versions (LeRobot's pins were not read). See section 9.

## 3. Pinned sources

### Code and repository docs

| Repository | Ref | SHA | Files read | Entries |
|---|---|---|---|---|
| huggingface/lerobot | v0.7.0 | `410c095eacc0011d998a73383eb94abed2715af0` | `src/lerobot/scripts/lerobot_record.py`, `src/lerobot/configs/{dataset,default,video,train}.py`, `src/lerobot/datasets/{dataset_metadata,dataset_writer,dataset_reader,utils,compute_stats,video_utils}.py`, `src/lerobot/utils/constants.py`, `src/lerobot/transforms/transforms.py`, `docs/source/{il_robots,hil_data_collection,lerobot-dataset-v3,training_dataset_streaming,video_encoding_parameters,streaming_video_encoding,using_dataset_tools,sarm,annotation_pipeline}.mdx` | F05-1 to F05-6, F05-16 to F05-22, F05-24 to F05-28, F05-31 to F05-45, F05-58, F05-60, F05-61, F05-81 to F05-87 |
| huggingface/lerobot | v0.4.0 | `f25ac02e6c8fa9c467ab8462289e5f4aed3a2e85` | `benchmarks/video/README.md` (history) | F05-63, F05-64 |
| huggingface/lerobot | default branch head | `039e05183f38b02d28c5f6ac9dbc7ef1680728cd` | format version constant only | F05-16 |
| huggingface/lerobot | pull request 4549 | n/a (PR page) | description and measurements | F05-62 |
| NVIDIA/cosmos-curator | v2.10.0 | `95675431e309fd86c1c559a39fcb694ddedaa2a9` | `README.md`, `docs/curator/reference/video-pipelines.md`, `docs/curator/design/{curator-next-robot-action-split,curator-next-embeddings,curator-next-robot-action-caption,slim-image}.md` | F05-68 to F05-77 |
| NVIDIA-NeMo/Curator | v1.4.0 | `10fba1ea785863872ae6983b580ec6813e72cc79` | `README.md` | F05-80 |
| isaac-sim/IsaacLab | v3.0.0 | `e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4` | `docs/source/features/imitation-learning/{teleop_imitation,humanoids_imitation,skillgen,augmented_imitation}.rst`; tree listing for the SO-101 paths | F05-89 to F05-93, F05-100 |
| NVIDIA-Omniverse-blueprints/synthetic-manipulation-motion-generation | head (after v1.0) | `be78013710543995b40a3a122294e6ab21699e67` | `README.md` | F05-94 |
| NVIDIA/cosmos | head, 2026-11-19 | `0eab578a8935e26aa41c2b7dc9f5ab00f790a037` | `README.md`, `docs/reference/models.md`, `docs/reference/inference_benchmarks/cosmos3-nano-generator.md`, the benchmark methodology page | F05-95 to F05-98 |
| nvidia-cosmos/cosmos-transfer2.5 | head, 2026-06-07 | `2ff49d0717af02057ae79bc75c00fbff9da1b4e7` | `README.md`, `docs/inference.md` | F05-95, F05-99 |
| nvidia-cosmos/cosmos-predict2.5 | head, 2026-06-08 | `a2c298b0a3df3778b973fe65e9e58877b292d8a7` | `README.md` | F05-95 |

### Datasets

| Dataset | Revision SHA | Files read | Entries |
|---|---|---|---|
| lerobot/svla_so101_pickplace | `f641879e22172be7e8161d5e6c1503c2d2feb657` | `meta/info.json`, file listing with sizes | F05-23, F05-29, F05-30 |
| simple-world-lab/HiFi-UMI-2K | `a53b7b5784afdd50b2fda9195c9f724ef75ffdaf` | `README.md` (card) | F05-10 |
| builddotai/Egocentric-100K | `fae604b751b25337d6fd8c4c53e595910c28f68f` | `README.md` (card) | F05-13 |

### Papers

| arXiv | Paper | Venue | Entries |
|---|---|---|---|
| 2402.10329v3 | Universal Manipulation Interface (UMI) | preprint (venue not confirmed in this research) | F05-7, F05-8 |
| 2510.08022v1 | FastUMI-100K | preprint | F05-9 |
| 2310.17596v1 | MimicGen | peer-reviewed (CoRL 2023, per the arXiv comments field) | F05-88 |
| 2505.12705v2 | DreamGen | preprint | F05-101 to F05-103 |

### First-party docs and posts (accessed 2026-11-20)

- NVIDIA video encode and decode GPU support matrix: https://developer.nvidia.com/video-encode-decode-support-matrix (F05-46 to F05-56)
- Jetson Linux developer guide r36.5, "Software Encode in Orin Nano": https://docs.nvidia.com/jetson/archives/r36.5/DeveloperGuide/SD/Multimedia/SoftwareEncodeInOrinNano.html (F05-57)
- Amazon EC2 accelerated computing instance types: https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html (F05-65, F05-66)
- LeRobot v0.7.0 release blog: https://huggingface.co/blog/lerobot/lerobot-release-v070 (F05-14, F05-59)
- NVIDIA Technical Blog, NeMo Video Curator on DGX Cloud (2025-03-18): https://developer.nvidia.com/blog/petabyte-scale-video-processing-with-nvidia-nemo-curator-on-nvidia-dgx-cloud/ (F05-78, F05-79)
- Generalist GEN-0 (2025-11-04) and GEN-1 (2026-04-02) posts: https://generalistai.com/blog/nov-04-2025-GEN-0 and https://generalistai.com/blog/gen-1 (F05-11, F05-12)
- AWS Machine Learning Blog, Cosmos 3 model factory on SageMaker HyperPod (2026-09-04): https://aws.amazon.com/blogs/machine-learning/build-a-physical-ai-model-factory-with-nvidia-cosmos-3-on-sagemaker-hyperpod/ (F05-104)
- Dexset price post (July 2026, a vendor describing its own prices): https://dexset.ai/blogs/robot-training-data-costs-pricing-complete-2026/ (F05-15)

## 4. Claim register

Code URLs for LeRobot use `https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/` (tag v0.7.0, SHA confirmed today with `gh api repos/huggingface/lerobot/git/ref/tags/v0.7.0`). Paths below are relative to that root.

### A. Collection: teleoperation, hand-held rigs, fleets and human video

**F05-1. An SO-101 demonstration is recorded with one command, `lerobot-record`: the person moves the leader arm, the follower arm copies it, and the command stores the follower's joint readings, the commanded joint targets and the camera frames of each episode.**
- Location: `docs/source/il_robots.mdx` lines 173-213 ("Record a dataset"), tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/il_robots.mdx | Tier 1, first-party docs | documentation of support | "During data collection, you'll use a \"teleoperation\" device, such as a leader arm or keyboard to teleoperate the robot and record its motion trajectories." and the command: `lerobot-record --robot.type=so101_follower --robot.port=/dev/tty.usbmodem585A0076841 --robot.id=my_awesome_follower_arm --robot.cameras="{ wrist: {type: opencv, index_or_path: 0, width: 640, height: 480, fps: 30}, top: {type: opencv, index_or_path: 1, width: 640, height: 480, fps: 30}}" --teleop.type=so101_leader --teleop.port=/dev/tty.usbmodem58760431551 --teleop.id=my_awesome_leader_arm --display_data=true --dataset.repo_id=${HF_USER}/record-test --dataset.num_episodes=5 --dataset.single_task="Grab the black cube" --dataset.streaming_encoding=true --dataset.encoder_threads=2` (accessed 2026-11-20; the docs block also carries a second `--robot.cameras` line for one 1920x1080 camera, omitted here)
- Use in dive: section 9, the command the reader would type for the block-in-cup task. Stream 01 (F01 group C) owns the control loop inside it.

**F05-2. The recorder's defaults: 30 frames per second, 60 s per episode, 60 s to reset the scene between episodes, 50 episodes, video encoding on, upload to the Hugging Face hub on.**
- Location: `src/lerobot/configs/dataset.py` lines 33-43, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/configs/dataset.py | Tier 1, code | code behaviour | `fps: int = 30` / `episode_time_s: int | float = 60` / `reset_time_s: int | float = 60` / `num_episodes: int = 50` / `video: bool = True` / `push_to_hub: bool = True` (accessed 2026-11-20). [derived] At the defaults one session is 50 x (60 + 60) s = 100 minutes of operator time for at most 50 minutes of recorded data; half the wall-clock time is resets.
- Use in dive: section 9, the collection-rate arithmetic for one person and one arm.

**F05-3. What the command writes, in order: one row per control tick through `dataset.add_frame`, then `dataset.save_episode()` at the end of each episode, then `dataset.finalize()` to close the Parquet files, then an upload if `push_to_hub` is set. Skipping `finalize()` leaves corrupt Parquet files.**
- Location: `src/lerobot/scripts/lerobot_record.py` lines 373, 562, 579, 592-594; `docs/source/lerobot-dataset-v3.mdx` lines 321-350, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/scripts/lerobot_record.py | Tier 1, code | code behaviour | `dataset.add_frame(frame)` (line 373) / `dataset.save_episode()` (line 562) / `dataset.finalize()` (line 579) / `if cfg.dataset.push_to_hub:` ... `dataset.push_to_hub(tags=cfg.dataset.tags, private=cfg.dataset.private)` (lines 592-594). Docs: "Closes parquet writers to write footer metadata, otherwise the parquet files will be corrupt" (accessed 2026-11-20)
- Use in dive: section 9, the write path as a four-step sequence diagram.

**F05-4. A frame's timestamp is computed from its index and the nominal rate, not read from a clock. If the loop really ran at 25 Hz, the dataset still claims 30 and the recorded motion plays back faster than it happened. The recorder prints the achieved rate per episode so this can be checked.**
- Location: `docs/source/il_robots.mdx` lines 424-443 ("Cadence reporting"), tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/il_robots.mdx | Tier 1, first-party docs | documentation of support | "`lerobot-record` paces the loop at `--dataset.fps` and reports what it actually achieved: a one-line digest for every episode you keep" ... "A frame's timestamp is derived from its index, so a session that ran at 25 Hz still produces a dataset that _claims_ 30 - the recorded motion is simply faster than reality." (accessed 2026-11-20)
- Use in dive: section 9 (what to check before trusting a recording) and section 10 (a quality filter that costs nothing: reject sessions whose achieved rate is off).

**F05-5. LeRobot's guidance for a first dataset: at least 50 episodes, 10 per object location, cameras fixed, the object visible in the cameras.**
- Location: `docs/source/il_robots.mdx` lines 414-420 ("Tips for gathering data"), tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/il_robots.mdx | Tier 1, first-party docs | documentation of support | "We suggest recording at least 50 episodes, with 10 episodes per location. Keep the cameras fixed and maintain consistent grasping behavior throughout the recordings. Also make sure the object you are manipulating is visible on the cameras. A good rule of thumb is you should be able to do the task yourself by only looking at the camera images." (accessed 2026-11-20). This is advice, not a measured threshold.
- Use in dive: section 9, sizes the worked example at 50 episodes; matches the public dataset in F05-29 (50 episodes).

**F05-6. A second collection mode records corrections: the trained policy drives the robot, a person takes over when it is about to fail, and the recovery is saved as new training data.**
- Location: `docs/source/hil_data_collection.mdx` lines 7-16, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/hil_data_collection.mdx | Tier 1, first-party docs | definition | "Standard behavioral cloning trains policies on successful demonstrations only. During deployment, small errors can compound and push the robot into states never seen during training (distribution shift). HIL data collection addresses this by: - Running the trained policy on the real robot - Having a human intervene when the robot is about to fail - Recording the human's recovery and correction as training data - Fine-tuning the policy on the combined dataset" (accessed 2026-11-20)
- Use in dive: section 9, one paragraph; pointer to the section on the improvement loop.

**F05-7. (History, 2024.) UMI, the Universal Manipulation Interface, took the robot out of data collection: a person holds a 3D-printed gripper with a GoPro camera on it, and software reconstructs the gripper's path from the video and the camera's motion sensor. The gripper's parts cost $73 and the camera and accessories $298.**
- Location: arXiv 2402.10329v3, section III ("Putting everything together") and the hardware design list
- Verdict: CARRIED (seed 02 section 1.2, re-fetched)
- Evidence: https://arxiv.org/abs/2402.10329v3 | Tier 3, preprint (v3 is the latest version listed; venue not confirmed in this research) | definition, [author reported] cost | "The UMI gripper weighs 780g, with an external dimension of L310mm x W 175mm x H210mm and finger stroke of 80mm. The 3D printed gripper has a BoM cost of $73, while the GoPro camera and accessories total $298." (accessed 2026-11-20)
- Use in dive: section 9, hand-held rigs as labelled history: the idea that started the line.

**F05-8. (History, 2024.) [author reported] UMI's collection rate: 3 people recorded 1,400 demonstrations of a cup-arrangement task in 12 person-hours across 30 locations, and on that task the hand-held gripper was more than 3 times faster than teleoperation, at 48% of bare-hand speed.**
- Location: arXiv 2402.10329v3, section V (in-the-wild generalisation) and section VI (data collection throughput)
- Verdict: CARRIED (seed 02 section 1.2, re-fetched)
- Evidence: https://arxiv.org/abs/2402.10329v3 | Tier 3, preprint | benchmark claim (author reported) | "Within 12 person-hours, 3 demonstrators collected 1400 demonstrations for the cup arrangement task across 30 diverse physical locations, including homes, offices, restaurants, and outdoor" and "On the cup arrangement task, the UMI gripper is more than 3x faster than teleportation, at 48% speed of the human hand" (accessed 2026-11-20; "teleportation" is the paper's wording for teleoperation). [derived] 1,400 / 12 = 117 demonstrations per person-hour.
- Use in dive: section 9, the rate comparison row: hand-held against leader-arm teleoperation.

**F05-9. [author reported] FastUMI-100K (October 2025), a hand-held-gripper dataset: more than 100,000 demonstration trajectories over 54 tasks, "equivalent to 600 hours", collected by 10 data collectors with 3 support staff; each trajectory is 120 to 500 frames.**
- Location: arXiv 2510.08022v1, abstract and introduction
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.08022v1 | Tier 3, preprint | production report (author reported) | "comprises over 100,000 demonstration trajectories, collected using both single-arm and dual-arm grippers on the FastUMI platform, equivalent to 600 hours of interactive data. A total of 10 data collectors and 3 technical support staff were employed" and "FastUMI-100K contains over 100K+ demonstration trajectories collected across representative household environments, covering 54 tasks and hundreds of object types" ... "Each trajectory has a length ranging from 120 to 500 frames." (accessed 2026-11-20). [derived] 600 h / 100,000 = 21.6 s per trajectory on average. The paper's collection calendar time was not extracted (U7).
- Use in dive: section 9, a 2025 successor with a published size.

**F05-10. HiFi-UMI-2K (July 2026), a hand-held bimanual rig with six synchronised cameras: the public release is a curated 2,000-hour subset of a source corpus of more than 20,000 hours and 4.32 million episodes across more than 480 scenes; it occupies 16.0 TB on the hub in LeRobot format.**
- Location: dataset card `simple-world-lab/HiFi-UMI-2K` at revision `a53b7b5784afdd50b2fda9195c9f724ef75ffdaf` (2026-07-29), "Introduction"; LeRobot v0.7.0 release blog, dataset table
- Verdict: CARRIED (seed 02 section 1.2 gave the 16.0 TB figure from the blog; the card is new)
- Evidence: https://huggingface.co/datasets/simple-world-lab/HiFi-UMI-2K/blob/a53b7b5784afdd50b2fda9195c9f724ef75ffdaf/README.md | Tier 2, first-party dataset card | production report (author reported) | "The release contains a curated **2,000-hour** subset of a source corpus exceeding **20,000 hours** and **4.32 million episodes** across more than **480 scenes**." and "the processing pipeline achieves approximately **98% trajectory reconstruction success** and **98% WBC replay validation success**"; blog table row (https://huggingface.co/blog/lerobot/lerobot-release-v070): "HiFi-UMI-2K | Simple World Lab | Robot-free capture with six synchronized camera views | Handheld UMI grippers, bimanual | 2,000 | 16.0 TB" (accessed 2026-11-20). [derived] 16.0 TB / 2,000 h = 8 GB per hour for six views, about 1.3 GB per camera-hour. [derived] 20,000 h / 4.32 million = 16.7 s per episode. The accompanying report (arXiv 2607.25895) was not read (U7).
- Use in dive: section 9, the current state of hand-held rigs: 20,000 hours from one lab, and a public release curated down to a tenth of it. Also a section 10 data point: curation kept 10%.

**F05-11. [vendor claim] Generalist's GEN-0 post (2025-11-04): the model was pretrained on more than 270,000 hours of real-world manipulation data, growing by more than 10,000 hours a week, collected with thousands of devices and robots; the data operation runs on the order of 10,000 CPU cores of continuous processing and has compressed dozens of petabytes.**
- Location: Generalist blog, "GEN-0", section "Robotics is No Longer Limited By Data"
- Verdict: CARRIED (seed 02 section 1.2, re-fetched)
- Evidence: https://generalistai.com/blog/nov-04-2025-GEN-0 | Tier 2, first-party blog | production report (vendor reported) | "Our Foundation models are trained on an unprecedented corpus of 270,000 hours of real-world manipulation trajectories collected across diverse activities in 1,000s of homes, warehouses, and workplaces worldwide. Today, our robot data operations provide over 10,000 new hours per week and are accelerating. This is all powered by a global network of hardware and 1,000s of data collection devices and robots." and "We've negotiated multi-cloud contracts, built custom upload machines, scaled to O(10K) cores for continual multimodal data processing, compressed dozens of Petabytes of data, using dataloading techniques behind frontier video foundation models, capable of absorbing 6.85 years of real-world manipulation experience per day of training." (accessed 2026-11-20). [derived] 6.85 years x 8,766 h = about 60,000 hours of data consumed per day of training. No GPU type or count is given.
- Use in dive: section 9 (fleet scale) and section 10: the largest published data operation describes its processing as CPU cores and its dataloader as the thing that sets how much experience a training day absorbs.

**F05-12. [vendor claim] Generalist's GEN-1 post (2026-04-02) raises the corpus to "over half a million hours" and states that the base model is pretrained with no robot data, only data from low-cost wearable devices worn by people.**
- Location: Generalist blog, "GEN-1: Scaling Embodied Foundation Models to Mastery", dated April 2, 2026
- Verdict: NEW (the seed had the 500,000-hour figure only from secondary commentary and marked it not verified)
- Evidence: https://generalistai.com/blog/gen-1 | Tier 2, first-party blog | production report (vendor reported) | "trained on our dataset which now includes over half a million hours of high-fidelity physical interaction data" and "for GEN-0 and GEN-1 the base foundation model is trained without any robot data - it instead uses data from low-cost wearable devices on humans doing millions of activities" (accessed 2026-11-20). [derived] From 270,000 h on 2025-11-04 to 500,000 h on 2026-04-02 is 230,000 h in about 21 weeks, about 11,000 hours per week, consistent with F05-11.
- Use in dive: section 9, the 2026 picture: the largest corpus is human-worn devices, not robots.

**F05-13. Human egocentric video at the cheap end: Build AI's Egocentric-100K is 100,405 hours of head-camera video of factory workers, 10.8 billion frames in 2,010,759 clips, stored as H.265 at 456x256 and 30 fps in 24.79 TB.**
- Location: dataset card `builddotai/Egocentric-100K` at revision `fae604b751b25337d6fd8c4c53e595910c28f68f` (last modified 2026-02-16), statistics table
- Verdict: CARRIED (seed 02 section 1.3, re-fetched)
- Evidence: https://huggingface.co/datasets/builddotai/Egocentric-100K/blob/fae604b751b25337d6fd8c4c53e595910c28f68f/README.md | Tier 2, first-party dataset card | production report (author reported) | "| **Total Hours** | 100,405 |", "| **Total Frames** | 10.8 billion |", "| **Video Clips** | 2,010,759 |", "| **Mean Hours per Worker** | 7.06 |", "| **Storage Size** | 24.79 TB |", "| **Format** | H.265/MP4 |", "| **Resolution** | 256p (456x256) |", "| **Frame Rate** | 30 fps |" (accessed 2026-11-20). [derived] 24.79 TB / 100,405 h = 0.247 GB per hour, about a third of the arm dataset's two-camera rate in F05-30 at roughly a third of the pixels per frame for one camera (456 x 256 = 116,736 against 307,200).
- Use in dive: section 9, the base of the data pyramid, and the storage contrast with robot data. Human video has no action labels; stream 02 or 03 covers how models use it.

**F05-14. The open robot-data pool on the Hugging Face hub was "almost 300 TB" in LeRobot format on 2026-11-05.**
- Location: LeRobot v0.7.0 release blog, "300 TB of open Physical AI data"
- Verdict: CARRIED (seed 02 section 1.4, re-fetched)
- Evidence: https://huggingface.co/blog/lerobot/lerobot-release-v070 | Tier 2, first-party blog | production report (vendor reported) | "The Hub now holds almost 300 TB of open Physical AI data in LeRobot format, with some of the largest datasets released in just the past few months." (accessed 2026-11-20)
- Use in dive: section 9, scale anchor for open data against F05-11's "dozens of Petabytes" for one private operation.

**F05-15. [vendor claim] One data vendor's own price ranges (July 2026): teleoperation $28 to $60 per raw hour, egocentric human video $15 to $40 per hour, annotation $8 to $25 per hour on top, and 10 to 30 percent of captured data rejected in quality checks. No lab publishes a cost per teleoperation hour that this research located.**
- Location: Dexset blog, "Robot Training Data Costs and Pricing: The Complete 2026 Guide", dated July 2, 2026, "TL;DR"
- Verdict: CARRIED (seed 02 section 1.1, re-fetched; relabelled from secondary to a vendor's claim about its own operation)
- Evidence: https://dexset.ai/blogs/robot-training-data-costs-pricing-complete-2026/ | Tier 2, vendor blog about its own operation (a seller describing its prices; treat as indicative) | benchmark claim (vendor reported) | "Teleoperation data: $28 to $60 per raw hour (rig amortization + operator + QA), based on DexSet benchmarks. Egocentric human video: $15 to $40 per hour, the cheapest scalable modality." ... "Annotation passes: $8 to $25 per hour extra, on top of any capture modality." ... "QA rejection runs 10 to 30 percent in our pipelines" (accessed 2026-11-20)
- Use in dive: section 9, the cost row, labelled as one vendor's figures. Section 10: the rejection rate is the reason to budget per usable hour.

### B. The LeRobot dataset format at v0.7.0

**F05-16. The LeRobot dataset format version at tag v0.7.0 is "v3.0". The default branch read today (`039e05183f38b02d28c5f6ac9dbc7ef1680728cd`, commit of 2026-11-20) holds the same value, so no newer format version was found.**
- Location: `src/lerobot/datasets/dataset_metadata.py` line 64 (tag v0.7.0 and default-branch head)
- Verdict: CARRIED (seed 02 section 2.1, re-fetched from code)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/dataset_metadata.py | Tier 1, code | code behaviour | `CODEBASE_VERSION = "v3.0"` (accessed 2026-11-20). The docs page states "`LeRobotDataset v3.0` is included in `lerobot >= 0.4.0`." (`docs/source/lerobot-dataset-v3.mdx` line 28).
- Use in dive: section 9, the format name and version the reader will see in `meta/info.json`.

**F05-17. A v3.0 dataset has three kinds of content: tabular signals (joint states, actions, timestamps) in Parquet files, camera frames encoded into MP4 files, and metadata as JSON and Parquet.**
- Location: `docs/source/lerobot-dataset-v3.mdx` lines 58-62, tag v0.7.0
- Verdict: CARRIED (seed 02 section 2.1, re-fetched)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/lerobot-dataset-v3.mdx | Tier 1, first-party docs | definition | "**Tabular data**: Low-dimensional, high-frequency signals (states, actions, timestamps) stored in **Apache Parquet**. ... **Visual data**: Camera frames concatenated and encoded into **MP4**. Frames from the same episode are grouped; videos are sharded per camera for practical sizes. ... **Metadata**: JSON/Parquet records describing schema (feature names, dtypes, shapes), frame rates, normalization stats, and **episode segmentation** (start/end offsets into shared Parquet/MP4 files)." (accessed 2026-11-20)
- Use in dive: section 9, the three-part picture of a dataset on disk.

**F05-18. The on-disk layout is six paths: `meta/info.json`, `meta/stats.json`, `meta/tasks.parquet`, `meta/episodes/chunk-XXX/file-XXX.parquet`, `data/chunk-XXX/file-XXX.parquet` and `videos/<camera key>/chunk-XXX/file-XXX.mp4`.**
- Location: `src/lerobot/datasets/utils.py` lines 96-103 and 174-177, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/utils.py | Tier 1, code | code behaviour | `INFO_PATH = "meta/info.json"` / `STATS_PATH = "meta/stats.json"` / `EPISODES_DIR = "meta/episodes"` / `DATA_DIR = "data"` / `VIDEO_DIR = "videos"` / `CHUNK_FILE_PATTERN = "chunk-{chunk_index:03d}/file-{file_index:03d}"` / `DEFAULT_TASKS_PATH = "meta/tasks.parquet"` / `DEFAULT_EPISODES_PATH = EPISODES_DIR + "/" + CHUNK_FILE_PATTERN + ".parquet"` / `DEFAULT_DATA_PATH = DATA_DIR + "/" + CHUNK_FILE_PATTERN + ".parquet"` / `DEFAULT_VIDEO_PATH = VIDEO_DIR + "/{video_key}/" + CHUNK_FILE_PATTERN + ".mp4"` (accessed 2026-11-20)
- Use in dive: section 9, the directory-tree diagram.

**F05-19. Many episodes share one file. The writer appends each new episode's video to the current MP4 until the file would reach the size target, then starts the next file; episode boundaries live in metadata, not in file names. Version 2 stored one file per episode.**
- Location: `src/lerobot/datasets/dataset_writer.py` lines 547-569; `docs/source/lerobot-dataset-v3.mdx` lines 19-22 and 64, tag v0.7.0
- Verdict: CARRIED (seed 02 section 2.1, re-fetched from code)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/dataset_writer.py | Tier 1, code | code behaviour | `if latest_size_in_mb + ep_size_in_mb >= self._meta.video_files_size_in_mb:` / `chunk_idx, file_idx = update_chunk_file_indices(chunk_idx, file_idx, self._meta.chunks_size)` ... `else:` / `concatenate_video_files([latest_path, ep_path], latest_path,)`. Docs: "**File-based storage**: Many episodes per Parquet/MP4 file (v2 used one file per episode)." and "To scale to millions of episodes, tabular rows and video frames from multiple episodes are **concatenated** into larger files. Episode-specific views are reconstructed **via metadata**, not file boundaries." (accessed 2026-11-20)
- Use in dive: section 9, why a 50-episode dataset is two MP4 files and one Parquet file (F05-29).

**F05-20. The size defaults at v0.7.0 are: at most 1,000 files per chunk directory, 100 MB per data Parquet file, 200 MB per video file.**
- Location: `src/lerobot/datasets/utils.py` lines 92-94 and 206-208, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/utils.py | Tier 1, code | code behaviour | `DEFAULT_CHUNK_SIZE = 1000  # Max number of files per chunk` / `DEFAULT_DATA_FILE_SIZE_IN_MB = 100  # Max size per file` / `DEFAULT_VIDEO_FILE_SIZE_IN_MB = 200  # Max size per file` (accessed 2026-11-20). A dataset written by an earlier release can carry another value in its own `info.json`: the public dataset in F05-29 records `"video_files_size_in_mb": 500`.
- Use in dive: section 9, the numbers on the layout diagram. Section 12 or later (storage): file count is frames times bytes per frame divided by 200 MB, not episode count.

**F05-21. When a chunk directory holds its 1,000th file, the file index returns to 0 and the chunk index goes up by one.**
- Location: `src/lerobot/datasets/utils.py` lines 329-335, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/utils.py | Tier 1, code | code behaviour | `def update_chunk_file_indices(chunk_idx: int, file_idx: int, chunks_size: int) -> tuple[int, int]:` / `if file_idx == chunks_size - 1:` / `file_idx = 0` / `chunk_idx += 1` / `else:` / `file_idx += 1` (accessed 2026-11-20)
- Use in dive: section 9, one line under the layout diagram.

**F05-22. Every frame row carries five bookkeeping columns that the recorder fills in: `timestamp` (float32), `frame_index`, `episode_index`, `index` and `task_index` (all int64).**
- Location: `src/lerobot/utils/constants.py` lines 109-115, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/utils/constants.py | Tier 1, code | code behaviour | `# Dataset meta-features (auto-populated by the recording pipeline)` / `DEFAULT_FEATURES = { "timestamp": {"dtype": "float32", "shape": (1,), "names": None}, "frame_index": {"dtype": "int64", "shape": (1,), "names": None}, "episode_index": {"dtype": "int64", "shape": (1,), "names": None}, "index": {"dtype": "int64", "shape": (1,), "names": None}, "task_index": {"dtype": "int64", "shape": (1,), "names": None}, }` (accessed 2026-11-20)
- Use in dive: section 9, the frame-row table.

**F05-23. For an SO-100/SO-101 two-camera dataset a frame row holds `action` (6 float32: the six joint targets), `observation.state` (6 float32: the six measured joint positions) and the five bookkeeping columns. The two camera features have dtype "video": their pixels are in the MP4 files, not in the Parquet row.**
- Location: `meta/info.json` of the hub dataset `lerobot/svla_so101_pickplace` at revision `f641879e22172be7e8161d5e6c1503c2d2feb657`
- Verdict: NEW
- Evidence: https://huggingface.co/datasets/lerobot/svla_so101_pickplace/resolve/f641879e22172be7e8161d5e6c1503c2d2feb657/meta/info.json | Tier 1, first-party dataset metadata (Hugging Face LeRobot organisation) | code behaviour (a file the recorder wrote) | `"action": { "dtype": "float32", "shape": [6], "names": ["shoulder_pan.pos", "shoulder_lift.pos", "elbow_flex.pos", "wrist_flex.pos", "wrist_roll.pos", "gripper.pos"]` ... `"observation.images.up": { "dtype": "video", "shape": [480, 640, 3], ... "video.codec": "av1", "video.pix_fmt": "yuv420p", ... "video.fps": 30,` (accessed 2026-11-20). The file records `"robot_type": "so100_follower"` although the dataset name says SO-101; the two arms share one follower class in LeRobot (stream 01, F01-9).
- Use in dive: section 9, the frame-row table with real column names.

**F05-24. The per-episode metadata rows say where each episode sits inside the shared files: which data file, the first and last global frame index, and per camera which video file plus the start and end time of the episode inside that file.**
- Location: `src/lerobot/datasets/dataset_writer.py` lines 497-500 and 586-589, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/dataset_writer.py | Tier 1, code | code behaviour | `"data/chunk_index": chunk_idx,` / `"data/file_index": file_idx,` / `"dataset_from_index": global_frame_index,` / `"dataset_to_index": global_frame_index + ep_num_frames,` and `f"videos/{video_key}/chunk_index": chunk_idx,` / `f"videos/{video_key}/file_index": file_idx,` / `f"videos/{video_key}/from_timestamp": latest_duration_in_s,` / `f"videos/{video_key}/to_timestamp": latest_duration_in_s + ep_duration_in_s,` (accessed 2026-11-20)
- Use in dive: section 9, the "episode index" table that makes shared files usable.

**F05-25. To fetch a camera frame, the reader takes the frame's timestamp inside its episode, adds the episode's `from_timestamp` offset for that camera, and asks the decoder for that time in the shared MP4. The default tolerance between the requested and the decoded timestamp is 0.0001 s.**
- Location: `src/lerobot/datasets/dataset_reader.py` lines 429-446; `src/lerobot/datasets/lerobot_dataset.py` line 61, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/dataset_reader.py | Tier 1, code | code behaviour | `shifted_query_ts = shift_timestamps(query_ts, ep[f"videos/{vid_key}/from_timestamp"])` / `video_path = self.root / self._meta.get_video_file_path(ep_idx, vid_key)` / `frames = decode_video_frames(video_path, shifted_query_ts, self._tolerance_s, self._video_backend,` and `lerobot_dataset.py`: `tolerance_s: float = 1e-4,` (accessed 2026-11-20)
- Use in dive: section 9 and section 10, "which number goes where" for one training sample.

**F05-26. `meta/stats.json` holds per-feature statistics used to normalise inputs and outputs. At v0.7.0 the running-statistics class computes mean, standard deviation, min, max and the quantiles 0.01, 0.10, 0.50, 0.90 and 0.99.**
- Location: `src/lerobot/datasets/compute_stats.py` lines 31-56; `docs/source/lerobot-dataset-v3.mdx` line 82, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/compute_stats.py | Tier 1, code | code behaviour | `DEFAULT_QUANTILES = [0.01, 0.10, 0.50, 0.90, 0.99]` and class docstring "standard deviation, min, max, and approximate quantiles." Docs: "**`meta/stats.json`**: global feature statistics (mean/std/min/max) used for normalization; exposed as `dataset.meta.stats`." (accessed 2026-11-20). The public dataset in F05-29, written by an earlier release, has only `min, max, mean, std, count` per feature; `src/lerobot/scripts/augment_dataset_quantile_stats.py` exists at the tag to add quantiles to such datasets.
- Use in dive: section 10, "compute statistics" as a curation step whose output training depends on.

**F05-27. Image statistics are computed on a sample, not on every frame: the number of sampled frames grows as the dataset length to the power 0.75, between 100 and 10,000, and frames larger than 300 pixels on the long side are subsampled toward 150.**
- Location: `src/lerobot/datasets/compute_stats.py` lines 219-252, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/compute_stats.py | Tier 1, code | code behaviour | `def estimate_num_samples(dataset_len: int, min_num_samples: int = 100, max_num_samples: int = 10_000, power: float = 0.75) -> int:` ... "- at 10000, num_samples=1000" ... `return max(min_num_samples, min(int(dataset_len**power), max_num_samples))` and `def auto_downsample_height_width(img: np.ndarray, target_size: int = 150, max_size_threshold: int = 300):` (accessed 2026-11-20)
- Use in dive: section 10, why the statistics pass is cheap next to decode.

**F05-28. Older datasets are converted with one script, `convert_dataset_v21_to_v30`, which merges per-episode Parquet and MP4 files into shared files and writes the episode offsets. A v2.1 dataset is refused at load time with a message naming that script.**
- Location: `docs/source/lerobot-dataset-v3.mdx` lines 304-317; `src/lerobot/datasets/utils.py` lines 36-45; `src/lerobot/scripts/convert_dataset_v21_to_v30.py`, tag v0.7.0
- Verdict: CARRIED (seed 02 section 2.1, re-fetched)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/lerobot-dataset-v3.mdx | Tier 1, first-party docs | documentation of support | "python -m lerobot.scripts.convert_dataset_v21_to_v30 --repo-id=<HF_USER/DATASET_ID>" ... "Aggregates parquet files: `episode_000000.parquet`, `episode_000001.parquet`, ... -> **`file-000.parquet`**, ..." / "Aggregates mp4 files: `episode_000000.mp4`, `episode_000001.mp4`, ... -> **`file-000.mp4`**, ..." / "Updates `meta/episodes/*` (chunked Parquet) with per-episode lengths, tasks, and byte/frame offsets." Code message: "We introduced a new format since v3.0 which is not backward compatible with v2.1." (accessed 2026-11-20). No converter for versions before v2.1 is in `src/lerobot/scripts/` at the tag (U6).
- Use in dive: section 9, one sentence on migration.

**F05-29. A public 50-episode SO-101 pick-and-place dataset, `lerobot/svla_so101_pickplace`, is nine files and 86.1 MB in total: 11,939 frames at 30 fps from two 640x480 cameras stored as AV1 in two MP4 files (45.5 MB and 40.1 MB), one 0.37 MB Parquet file of frame rows, and metadata.**
- Location: Hugging Face hub API, dataset `lerobot/svla_so101_pickplace`, revision `f641879e22172be7e8161d5e6c1503c2d2feb657` (last modified 2025-09-27); `meta/info.json`
- Verdict: NEW
- Evidence: https://huggingface.co/api/datasets/lerobot/svla_so101_pickplace/tree/f641879e22172be7e8161d5e6c1503c2d2feb657?recursive=true | Tier 1, hub API response for a first-party dataset (Hugging Face LeRobot organisation) | production report | file sizes in bytes: `data/chunk-000/file-000.parquet 369943`, `meta/episodes/chunk-000/file-000.parquet 72560`, `meta/info.json 3401`, `meta/stats.json 5914`, `meta/tasks.parquet 2246`, `videos/observation.images.side/chunk-000/file-000.mp4 45541633`, `videos/observation.images.up/chunk-000/file-000.mp4 40124489`; `info.json`: `"total_episodes": 50, "total_frames": 11939, ... "fps": 30` (accessed 2026-11-20). The dataset predates v0.7.0 and its `info.json` does not record GOP size or CRF, so the encoder settings behind these bytes are not known (U1).
- Use in dive: section 9, the worked example. This is the "real arm dataset" the page weighs.

**F05-30. [derived] That dataset is 6.6 minutes of robot time and its video costs about 775 MB per robot-hour for two cameras (about 387 MB per camera-hour, 0.86 Mbit/s per camera, 3,588 bytes per camera frame). The same frames uncompressed would be 199 GB per hour, a ratio of about 257 to 1. The joint data is about 31 bytes per frame, 3.3 MB per hour.**
- Location: arithmetic on F05-29
- Verdict: NEW
- Evidence: inputs from F05-29 | Tier 1 inputs, arithmetic ours | [derived] | 11,939 frames / 30 fps = 397.97 s = 0.11055 h. Video bytes 45,541,633 + 40,124,489 = 85,666,122. 85,666,122 / 0.11055 h = 774.9 MB/h. 85,666,122 / (11,939 x 2) = 3,588 bytes per camera frame. Raw RGB frame 640 x 480 x 3 = 921,600 bytes; 921,600 / 3,588 = 257. Raw rate 921,600 x 2 cameras x 30 fps x 3,600 s = 199.07 GB/h. Bitrate 85,666,122 x 8 / 397.97 s / 2 = 0.861 Mbit/s. Parquet 369,943 / 11,939 = 31.0 bytes per frame. Mean episode length 11,939 / 50 = 238.8 frames = 7.96 s.
- Use in dive: section 9, the strongest number of the collection section: an hour of two-camera arm data is under 1 GB encoded and about 200 GB raw. One dataset, one scene, one encoder setting: label it as an example, not a constant.

**F05-31. LeRobot can also read a dataset stored as Lance tables: `meta/` stays, a `frames` table holds the tabular data and a `videos` table holds the MP4 files as blobs. The format is read-only in LeRobot; conversion copies the videos without re-encoding.**
- Location: `docs/source/lerobot-dataset-v3.mdx` lines 354-366, tag v0.7.0
- Verdict: CARRIED (seed 02 section 2.1, re-fetched from the docs at the tag)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/lerobot-dataset-v3.mdx | Tier 1, first-party docs | documentation of support | "The layout keeps `meta/` unchanged and adds a `frames` table for the tabular data and a `videos` table holding the MP4s as blobs. `\"storage_format\": \"lance\"` in `meta/info.json` selects the reader" ... "**Convert at about the cost of a file copy.** Videos are not re-encoded, so items are bit-identical to the source. DROID converts in 34 minutes." ... "The format is read-only: record and edit datasets in the default format, then convert them with the [`lerobot-lancedb`](https://pypi.org/project/lerobot-lancedb/) package" (accessed 2026-11-20). "34 minutes" is a [vendor claim] with no hardware stated.
- Use in dive: section 10, one line: curation columns (scores, embeddings) can be added next to the frames without rewriting video.

**F05-32. Streaming mode trains without downloading the dataset first: `--dataset.streaming=true` fetches whole episodes (Parquet rows and compressed MP4 byte ranges) into a bounded in-memory pool, and each selected frame is still visited once per epoch.**
- Location: `docs/source/lerobot-dataset-v3.mdx` lines 135-139; `docs/source/training_dataset_streaming.mdx` "How an epoch is read", tag v0.7.0
- Verdict: CARRIED (seed 02 section 2.1, re-fetched from the docs at the tag)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/training_dataset_streaming.mdx | Tier 1, first-party docs | documentation of support | "Set `--dataset.streaming=true` to train without first downloading the dataset's Parquet and video files. Episodes are fetched on the fly into a bounded in-memory pool, and every selected frame is still visited exactly once per epoch" and "Parquet columns and compressed MP4 byte ranges are prefetched from the same byte-aware admission frontier." (accessed 2026-11-20)
- Use in dive: section 9 (format) and section 10 (what the loader does when the data sits in object storage).

**F05-33. Streaming defaults in code: off by default, 8 episodes prefetched per worker, an 8 GB byte budget, 2 decode threads, a queue of 8 decoded samples. If the pool size is unset, a rank mixes 32 episodes split across its workers.**
- Location: `src/lerobot/configs/default.py` lines 57-70; `docs/source/training_dataset_streaming.mdx` "Workers, shards and concurrency", tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/configs/default.py | Tier 1, code | code behaviour | `streaming: bool = False` / `streaming_episode_pool_size: int | None = None` / `streaming_prefetch_episodes: int = 8` / `streaming_byte_budget_gb: float = 8.0` / `streaming_decode_threads: int = 2` / `streaming_decoded_queue_size: int = 8`. Docs: "If you do not set it, the rank mixes 32 episodes and each of the N workers gets 32/N of them." (accessed 2026-11-20)
- Use in dive: section 10, the memory and CPU knobs of the streaming loader.

**F05-34. Streaming needs an index of every MP4 (a "sidecar") that maps frames to byte ranges. If no published sidecar exists, LeRobot builds one locally on the first run; `lerobot-build-mp4-sidecar` builds it ahead of time.**
- Location: `docs/source/training_dataset_streaming.mdx` "MP4 sidecars and the first run", tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/training_dataset_streaming.mdx | Tier 1, first-party docs | documentation of support | "Video streaming uses an MP4 index sidecar. Dataset initialization first checks the revision-keyed local cache, then looks for a valid published sidecar. If neither is available, LeRobot builds the sidecar locally while holding a process lock and installs it atomically." (accessed 2026-11-20). "Maps frames to byte ranges" is [our reading] of "MP4 index" together with "compressed MP4 byte ranges" in F05-32.
- Use in dive: section 10, why the first streaming run starts slower than later ones.

### C. Codecs: how the camera frames are compressed and read back

**F05-35. LeRobot v0.7.0 encodes camera video with the SVT-AV1 software encoder by default: codec `libsvtav1`, pixel format `yuv420p`, GOP size 2, CRF 30, and SVT-AV1 preset 12 when no preset is given.**
- Location: `src/lerobot/configs/video.py` lines 47 and 89-93 and 109-110, tag v0.7.0
- Verdict: CARRIED (seed 02 section 2.2; the seed took the GOP value from a secondary summary, now read from code)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/configs/video.py | Tier 1, code | code behaviour | `LIBSVTAV1_DEFAULT_PRESET: int = 12` / `vcodec: str = "libsvtav1"  # Video codec name. "auto" picks a hardware codec if available, else libsvtav1.` / `pix_fmt: str = "yuv420p"  # Pixel format (e.g. yuv420p).` / `g: int | None = 2  # GOP size (keyframe interval).` / `crf: int | float | None = 30  # Quality level. Lower means better quality and larger files.` / `if self.preset is None and self.vcodec == "libsvtav1": self.preset = LIBSVTAV1_DEFAULT_PRESET` (accessed 2026-11-20)
- Use in dive: section 9, the codec box: four settings, each explained in one line.

**F05-36. A GOP (group of pictures) size of 2 means a keyframe, a frame stored whole, every second frame. The docs define the option as "a keyframe every `g` frames".**
- Location: `docs/source/video_encoding_parameters.mdx`, "Tuning parameters" table, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/video_encoding_parameters.mdx | Tier 1, first-party docs | definition | "`g` | `int` | `2` | GOP size - a keyframe every `g` frames. Emitted as FFmpeg option `g`." and "The defaults are tuned to balance **compression ratio**, **visual quality**, and **decoding/seek speed** for typical robotics datasets." (accessed 2026-11-20)
- Use in dive: section 9, the GOP definition at first use.

**F05-37. Why GOP size matters for training: a training batch asks for frames at random positions, and to produce one frame a decoder must start at the previous keyframe and decode every frame up to the one requested. LeRobot's own code says so.**
- Location: `src/lerobot/datasets/video_utils.py`, docstrings of `decode_video_frames_pyav` (lines 187-189) and `decode_video_frames_torchcodec` (lines 434-438), tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/video_utils.py | Tier 1, code | definition | "Video benefits from inter-frame compression. Instead of storing every frame individually, the encoder stores a reference frame (or a key frame) and subsequent frames as differences relative to that key frame. As a consequence, to access a requested frame, we need to load the preceding key frame, and all subsequent frames until reaching the requested frame. The number of key frames in a video can be adjusted during encoding to take into account decoding time and video size in bytes." (accessed 2026-11-20). [derived] With GOP 2 the worst case is 2 decoded frames per requested frame; with a GOP of 250 (a common streaming-video setting, [illustration]) the worst case is 250 and the average about 125.
- Use in dive: section 9 and section 10, the mechanism that links a recording-time setting to training-time CPU load.

**F05-38. Video encoding at record time goes through PyAV (the Python binding to FFmpeg); it is the only encoding backend at v0.7.0.**
- Location: `src/lerobot/configs/video.py` lines 95-97, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/configs/video.py | Tier 1, code | code behaviour | `video_backend: str = "pyav"  # Encoding backend. Only "pyav" is currently supported.` (accessed 2026-11-20). `pyproject.toml` line 153 pins `av>=15.0.0,<16.0.0`.
- Use in dive: section 9, names the library under the recorder.

**F05-39. At training time the default decode backend is torchcodec (the PyTorch project's video decoder) wherever it is installed and can load FFmpeg; PyAV is the fallback. LeRobot runs torchcodec on the CPU.**
- Location: `src/lerobot/utils/import_utils.py` lines 91-105; `src/lerobot/configs/default.py` line 50; `src/lerobot/datasets/video_utils.py` lines 136-146, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/video_utils.py | Tier 1, code | code behaviour | "backend (str, optional): Backend to use for decoding. Defaults to \"torchcodec\" when available in the platform; otherwise, defaults to \"pyav\"." / "Currently supports torchcodec on cpu and pyav." and `default.py`: `video_backend: str = field(default_factory=get_safe_default_video_backend)`; `import_utils.py`: `if importlib.util.find_spec("torchcodec"):` ... `return "torchcodec"` (accessed 2026-11-20). `pyproject.toml` lines 123-125 pin `torchcodec>=0.3.0,<0.18.0` on Linux x86_64 and macOS arm64 and `torchcodec>=0.11.0,<0.18.0` on Linux aarch64.
- Use in dive: section 10, "decode runs on CPU cores in the dataloader workers" is a statement about LeRobot's default path, from code.

**F05-40. The torchcodec path converts each requested timestamp to a frame index (`round(timestamp x average fps)`) and fetches those frames in one call; decoders are kept in a cache of 100 open files per process by default.**
- Location: `src/lerobot/datasets/video_utils.py` lines 290-299 and 448-455, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/video_utils.py | Tier 1, code | code behaviour | `frame_indices = [round(ts * average_fps) for ts in timestamps]` / `frames_batch = decoder.get_frames_at(indices=frame_indices)` and `DEFAULT_DECODER_CACHE_SIZE = 100` with "Each cached entry retains a torchcodec ``VideoDecoder`` plus an open ``fsspec`` file handle - on the order of a few MB per entry." (accessed 2026-11-20)
- Use in dive: section 10, the last step of "timestamp to pixels" (F05-25).

**F05-41. The code warns against GPU decode inside dataloader workers: setting the torchcodec device to CUDA outside the main process leads to CUDA initialisation errors.**
- Location: `src/lerobot/datasets/video_utils.py` line 432, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/video_utils.py | Tier 1, code | code behaviour | "Note: Setting device=\"cuda\" outside the main process, e.g. in data loader workers, will lead to CUDA initialization errors." (accessed 2026-11-20)
- Use in dive: section 10, why the GPU's hardware decoder is not simply switched on in the stock training loop.

**F05-42. LeRobot lists six hardware encoders it can use at record time: `h264_videotoolbox` and `hevc_videotoolbox` (macOS), `h264_nvenc` and `hevc_nvenc` (NVIDIA), `h264_vaapi` (Linux Intel/AMD) and `h264_qsv` (Intel Quick Sync). `vcodec=auto` picks the first one available and falls back to `libsvtav1`. No AV1 hardware encoder is in the list.**
- Location: `src/lerobot/configs/video.py` lines 33-45 and 182-190, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/configs/video.py | Tier 1, code | code behaviour | `HW_VIDEO_CODECS = [ "h264_videotoolbox",  # macOS "hevc_videotoolbox",  # macOS "h264_nvenc",  # NVIDIA GPU "hevc_nvenc",  # NVIDIA GPU "h264_vaapi",  # Linux Intel/AMD "h264_qsv",  # Intel Quick Sync ]` / `VALID_VIDEO_CODECS: frozenset[str] = frozenset({"h264", "hevc", "libsvtav1", "libaom-av1", "auto", *HW_VIDEO_CODECS})` / `logger.warning("No hardware encoder available, falling back to software encoder 'libsvtav1'")` (accessed 2026-11-20)
- Use in dive: section 9, the "CPU too slow to encode" escape hatch, and the cost: a hardware-encoded dataset is H.264 or HEVC, not AV1.

**F05-43. The trade the docs state: `libsvtav1` gives the smallest files at high CPU use; software `h264` gives files "~30-50% larger" at medium CPU use; hardware encoders give the largest files at very low CPU use.**
- Location: `docs/source/streaming_video_encoding.mdx` section 4 "Choosing a Codec", tag v0.7.0
- Verdict: CARRIED (seed 02 section 2.2, re-fetched at the tag)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/streaming_video_encoding.mdx | Tier 1, first-party docs | documentation of support, [vendor claim] for the size figure | "`libsvtav1` (default) | High | Smallest | Best | Default. Best compression but most CPU-intensive" / "`h264` | Medium | ~30-50% larger | Good | Software H.264. Lower CPU" / "HW encoders | Very Low | Largest | Good | Offloads to dedicated hardware. Best for CPU-constrained systems" and "`libsvtav1` is the default because it provides the best training performance; other vcodecs can reduce CPU usage and be faster, but they typically produce larger files and may affect training time." (accessed 2026-11-20)
- Use in dive: section 9, the codec comparison table.

**F05-44. By default the recorder writes each frame as a PNG and encodes the episode to MP4 after it ends. With `--dataset.streaming_encoding=true` frames go straight to an encoder thread during capture, which makes saving an episode near-instant and puts the encode load on the CPU during the control loop.**
- Location: `docs/source/streaming_video_encoding.mdx` sections 1 to 3; `src/lerobot/configs/dataset.py` lines 65-73, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/streaming_video_encoding.mdx | Tier 1, first-party docs | documentation of support | "Capture frame -> write PNG to disk -> (at episode end) read PNG's -> encode to MP4 -> delete PNG's" / "Capture frame -> queue to encoder thread -> encode to MP4 directly" / "Streaming encoding means the CPU is encoding video **during** the capture loop, not after." Code: `streaming_encoding: bool = False` / `encoder_queue_maxsize: int = 30` / `encoder_threads: int | None = None` (accessed 2026-11-20)
- Use in dive: section 9, the two recording paths and where the CPU load falls.

**F05-45. The docs size the encode load in pixels per second: two 640x480 cameras at 30 fps are 55 million pixels per second ("Low", "Works on most systems"); two 1920x1080 cameras are 373 million ("High", "Requires powerful high-end CPU"). When the encoder falls behind, frames are dropped, not blocked.**
- Location: `docs/source/streaming_video_encoding.mdx` section 3, tag v0.7.0
- Verdict: CARRIED (seed 02 section 2.2, re-fetched at the tag)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/streaming_video_encoding.mdx | Tier 1, first-party docs | documentation of support | "2camsx 640x480x3 @30fps | 55M | Low | Works on most systems" / "2camsx 1920x1080x3 @30fps | 373M | High | Requires powerful high-end CPU" / "New frames are **dropped** (not blocked) - the capture loop continues uninterrupted" / "If ~5% of frames are missing, your system is likely overloaded" (accessed 2026-11-20). [derived] 640 x 480 x 3 x 30 x 2 = 55.3 million; the docs count the three colour channels.
- Use in dive: section 9, the arm task's two 640x480 cameras sit in the lightest row; the dropped-frame warning is the practical check.

### D. Hardware video engines: which GPUs can encode and decode which codec

All rows in this group are from one page, NVIDIA's "Video Encode and Decode Support Matrix", fetched 2026-11-20 as HTML and parsed row by row: https://developer.nvidia.com/video-encode-decode-support-matrix. The page carries no revision date; the pin is the access date. NVENC is NVIDIA's name for the fixed-function video encoder circuit on a GPU and NVDEC for the decoder circuit; both are separate from the cores that run neural networks. "AV1 decode" below is the pair of columns "AV1 8 Bit / 10 Bit" in the decode table; "AV1 encode" is the column "AV1 YUV 4:2:0" in the encode table.

**F05-46. The A100 has no hardware video encoder and cannot hardware-decode AV1: 0 NVENC, 5 NVDEC, AV1 decode NO.**
- Location: support matrix, "Server (Data Center)" tab, encode table row "NVIDIA A100" and decode table row "NVIDIA A100"
- Verdict: CARRIED (seed 02 section 2.2, re-fetched)
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode row: "NVIDIA A100 | Ampere | 7th Gen | 0 | 0 | 0 | N/A ..."; decode row: "NVIDIA A100 | Ampere | 4th Gen | 1 | 5 | 5 | ... AV1: NO | NO" (accessed 2026-11-20)
- Use in dive: section 10, the decode table; EC2 P4d.

**F05-47. The H100 (SXM, PCIe and NVL rows alike) has no hardware video encoder and cannot hardware-decode AV1: 0 NVENC, 7 NVDEC, AV1 decode NO.**
- Location: support matrix, "Server (Data Center)" tab, rows "NVIDIA H100 SXM", "NVIDIA H100 PCIe", "NVIDIA H100 NVL"
- Verdict: CARRIED (seed 02 section 2.2, re-fetched)
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode row: "NVIDIA H100 SXM | Hopper | N/A | 1 | 0 | 0 | N/A ..."; decode row: "NVIDIA H100 SXM | Hopper | 4th Gen | 1 | 7 | 7 | ... AV1: NO | NO" (accessed 2026-11-20)
- Use in dive: section 10, the strongest row of the table: LeRobot's default codec is AV1 (F05-35) and the most common training GPU cannot hardware-decode it. EC2 P5.

**F05-48. The Blackwell data-centre parts (HGX B200, HGX B300, GB200, GB300) have no hardware video encoder and 7 NVDEC engines that decode AV1.**
- Location: support matrix, "Server (Data Center)" tab, rows "NVIDIA HGX B200", "NVIDIA HGX B300", "NVIDIA GB200", "NVIDIA GB300"
- Verdict: CARRIED (seed 02 section 2.2, re-fetched; B300 and GB300 rows are new)
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode rows: "NVIDIA HGX B200 | Blackwell | N/A | 1 | 0 | 0 | N/A ..." and the same for HGX B300, GB200, GB300; decode rows: "NVIDIA HGX B200 | Blackwell | 6th Gen | 1 | 7 | 7 | ... AV1: YES | YES" and the same for HGX B300, GB200, GB300 (accessed 2026-11-20)
- Use in dive: section 10, the decode table; EC2 P6-B200, P6-B300, P6e-GB200.

**F05-49. The H200 has no row in the matrix as fetched today (the string "H200" does not occur in the page), so its engine count and AV1 decode support are not established here.**
- Location: support matrix, whole page (text search)
- Verdict: UNKNOWN (U2)
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | absence in the fetched page | `grep -c "H200"` on the fetched HTML returns 0 (accessed 2026-11-20). The H200 is a Hopper-generation part, so "same as H100" is a reasonable guess [our reading], but the matrix does not say it.
- Use in dive: section 10, leave the P5e/P5en row marked "not listed by NVIDIA" in the table.

**F05-50. The L4 has 2 NVENC and 4 NVDEC engines, and both encodes and decodes AV1.**
- Location: support matrix, "Server (Data Center)" tab, row "NVIDIA L4"
- Verdict: CARRIED (seed 02 section 2.2, re-fetched)
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode row: "NVIDIA L4 | Ada Lovelace | 8th Gen | 1 | 2 | 2 | Unrestricted | ... AV1 YUV 4:2:0: YES"; decode row: "NVIDIA L4 | Ada Lovelace | 5th Gen | 1 | 4 | 4 | ... AV1: YES | YES" (accessed 2026-11-20)
- Use in dive: section 10, EC2 G6: the cheapest card with a full AV1 path.

**F05-51. The L40S has 3 NVENC and 3 NVDEC engines, and both encodes and decodes AV1.**
- Location: support matrix, "Server (Data Center)" tab, row "NVIDIA L40S"
- Verdict: CARRIED (seed 02 section 2.2, re-fetched)
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode row: "NVIDIA L40S | Ada Lovelace | 8th Gen | 1 | 3 | 3 | Unrestricted | ... AV1 YUV 4:2:0: YES"; decode row: "NVIDIA L40S | Ada Lovelace | 5th Gen | 1 | 3 | 3 | ... AV1: YES | YES" (accessed 2026-11-20)
- Use in dive: section 10, EC2 G6e.

**F05-52. The RTX PRO 6000 Blackwell Server Edition has 4 NVENC and 4 NVDEC engines, and both encodes and decodes AV1.**
- Location: support matrix, "Server (Data Center)" tab, row "NVIDIA RTX PRO 6000 Blackwell Server Edition"
- Verdict: CARRIED (seed 02 section 2.2, re-fetched)
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode row: "NVIDIA RTX PRO 6000 Blackwell Server Edition | Blackwell | 9th Gen | 1 | 4 | 4 | Unrestricted | ... AV1 YUV 4:2:0: YES"; decode row: "... | Blackwell | 6th Gen | 1 | 4 | 4 | ... AV1: YES | YES" (accessed 2026-11-20). The page also lists "NVIDIA RTX PRO 4500 Blackwell Server Edition" with 3 NVENC and 3 NVDEC.
- Use in dive: section 10, EC2 G7e.

**F05-53. The T4 has 1 NVENC and 2 NVDEC engines and no AV1 in either direction.**
- Location: support matrix, "Server (Data Center)" tab, row "Tesla T4"
- Verdict: CARRIED (seed 02 section 2.2, re-fetched)
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode row: "Tesla T4 | Turing | 7th Gen | 1 | 1 | 1 | Unrestricted | ... AV1 YUV 4:2:0: NO"; decode row: "Tesla T4 | Turing | 4th Gen | 1 | 2 | 2 | ... AV1: NO | NO" (accessed 2026-11-20)
- Use in dive: section 10, EC2 G4dn.

**F05-54. The A10 has 1 NVENC and 2 NVDEC engines; it decodes AV1 and cannot encode it. The matrix lists "NVIDIA A10", not "A10G", the name AWS uses for the G5 card.**
- Location: support matrix, "Server (Data Center)" tab, row "NVIDIA A10"
- Verdict: NEW
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode row: "NVIDIA A10 | Ampere | 7th Gen | 1 | 1 | 1 | Unrestricted | ... AV1 YUV 4:2:0: NO"; decode row: "NVIDIA A10 | Ampere | 5th Gen | 1 | 2 | 2 | ... AV1: YES | YES" (accessed 2026-11-20). Applying the A10 row to the A10G is [our reading]; the string "A10G" does not occur in the page (U3).
- Use in dive: section 10, EC2 G5 row, with the A10/A10G caveat.

**F05-55. Jetson Thor modules (T2000, T3000, T4000, T5000) have hardware H.264 and HEVC encode, no AV1 encode, and hardware AV1 decode. T2000, T3000 and T4000 have one encoder and one decoder engine; T5000 has two of each.**
- Location: support matrix, "Jetson / IGX" tab, encode and decode tables
- Verdict: NEW
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode rows: "Jetson T5000 | Thor | 9.1th Gen | N/A | 1 | 2 | Unrestricted | ... HEVC B Frame support: YES | AV1 YUV 4:2:0: NO", "Jetson T4000 | Thor | 9.1th Gen | N/A | 1 | 1 | Unrestricted | ... AV1 YUV 4:2:0: NO"; decode rows: "Jetson T5000 | Thor | 6.1th Gen | N/A | 1 | 2 | ... AV1: YES | YES" (accessed 2026-11-20). No Jetson Orin module is in the matrix.
- Use in dive: section 9, recording on a Thor: the hardware encoder gives H.264 or HEVC, so an AV1 dataset still means CPU encode.

**F05-56. The DGX Spark has one NVENC and one NVDEC engine, with AV1 in both directions.**
- Location: support matrix, "DGX" tab, row "DGX Spark"
- Verdict: NEW
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode row: "DGX Spark | Blackwell | 9th Gen | 1 | 1 | 1 | Unrestricted | ... AV1 YUV 4:2:0: YES"; decode row: "DGX Spark | Blackwell | 6th Gen | D | 1 | 1 | 1 | ... AV1: YES | YES" (accessed 2026-11-20)
- Use in dive: section 9 and section 10, the desk-side machine in the dive's hardware set.

**F05-57. The Jetson Orin Nano has no hardware video encoder. NVIDIA's Jetson Linux guide says so in its first sentence and tells the developer to encode in software with FFmpeg's libav encoders.**
- Location: Jetson Linux Developer Guide, "Software Encode in Orin Nano", releases r36.5 (the Orin line) and r39.2.2 (newest release found today); the sentence is identical in both
- Verdict: CARRIED (seed 11 software table recorded "x264 only" on the Orin Nano; now from the vendor guide)
- Evidence: https://docs.nvidia.com/jetson/archives/r36.5/DeveloperGuide/SD/Multimedia/SoftwareEncodeInOrinNano.html | Tier 1, first-party docs | documentation of support | "The NVIDIA Jetson Orin Nano does not have the NVENC engine. This application note provides information about how to migrate to software encoding using the libav (FFmpeg) encoders" (accessed 2026-11-20; same text at https://docs.nvidia.com/jetson/archives/r39.2.2/DeveloperGuide/SD/Multimedia/SoftwareEncodeInOrinNano.html)
- Use in dive: section 9, recording on the cheapest Jetson: every encoded frame costs CPU time on its six Arm cores, which is the budget the control loop also draws on (F05-44). The Orin Nano's hardware decode codecs were not re-fetched from a first-party page (U4).

### E. Why decode can bound training

**F05-58. LeRobot's own docs state the failure: with the default settings the image transforms run per sample in the dataloader worker processes, "and the GPU ends up waiting for data".**
- Location: `docs/source/lerobot-dataset-v3.mdx` line 283, "Running transforms on the GPU", tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/lerobot-dataset-v3.mdx | Tier 1, first-party docs | documentation of support | "By default the transforms run per sample in the DataLoader workers. With several cameras that is often the most expensive thing the workers do, and the GPU ends up waiting for data. Set `backend=gpu` to have the workers decode only and apply the same transforms to each batch on the policy device" (accessed 2026-11-20)
- Use in dive: section 10, the first-party sentence for "the GPU can starve": the CPU side of the input pipeline (decode plus augmentation) sets the pace.

**F05-59. [vendor claim] Moving image augmentation from the CPU workers to the GPU made ACT training 2.8x faster on an H100 and 3.3x faster on an A100. The post gives no dataset, camera count, batch size or CPU.**
- Location: Hugging Face blog, "LeRobot v0.7.0: From Terabytes to Prompting Robots", section "Augment on the GPU" (2026-11-05)
- Verdict: CARRIED (seed 02 section 2.2, re-fetched)
- Evidence: https://huggingface.co/blog/lerobot/lerobot-release-v070 | Tier 2, first-party blog | benchmark claim (vendor reported) | "You can now train faster by moving image augmentation to the GPU. Set --dataset.image_transforms.backend=gpu : ACT trains 2.8x faster on an H100 and 3.3x faster on an A100." (accessed 2026-11-20)
- Use in dive: section 10 and section 11: a 2.8x speed-up from moving CPU work off the input path means the GPU had been idle for most of each step [our reading]. The strongest first-party number that training of a small policy is input-bound.

**F05-60. In LeRobot's streaming reader one dataloader worker uses only about 2 CPU cores, because sample assembly runs Python code that holds the interpreter lock; more worker processes are the way to use more cores. Four workers gave 2.1 to 2.5 times more samples per second [vendor claim].**
- Location: `docs/source/training_dataset_streaming.mdx`, "Why several workers", tag v0.7.0; release blog, "Disk-less streaming"
- Verdict: CARRIED (seed 02 section 2.1 for the 2.1 to 2.5x figure, re-fetched; the two-core statement is new)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/training_dataset_streaming.mdx | Tier 1, first-party docs | documentation of support | "With one worker, the decode threads of a rank wait for each other, so the rank uses only about 2 CPU cores. Each worker is a separate process, so N workers assemble and decode samples in parallel." Blog (Tier 2, https://huggingface.co/blog/lerobot/lerobot-release-v070): "The reader supports DataLoader workers, with 2.1-2.5x more samples per second when using four workers." (accessed 2026-11-20)
- Use in dive: section 10, why "number of dataloader workers" is the knob and why vCPUs per GPU is the ceiling.

**F05-61. LeRobot's training defaults at v0.7.0 are batch size 8, 4 dataloader workers, prefetch factor 4 and 100,000 steps.**
- Location: `src/lerobot/configs/train.py` lines 150-160, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/configs/train.py | Tier 1, code | code behaviour | `num_workers: int = 4` / `batch_size: int = 8` / `prefetch_factor: int = 4` / `persistent_workers: bool = True` / `steps: int = 100_000` (accessed 2026-11-20)
- Use in dive: section 10, inputs to the worked example (frames decoded per step).

**F05-62. [author reported] A LeRobot pull request measured dataset access on a two-camera, 50-episode dataset with the torchcodec backend: about 5 ms per single item (median, one process, warm file cache), and for batches of 32 with a five-frame history window 16.98 ms per item before the change and 4.95 ms after. The hardware is not stated.**
- Location: huggingface/lerobot pull request 4549, "perf(datasets): batched reader access + faster torchcodec decode", opened 2026-09-01, state "open" on 2026-11-20
- Verdict: CARRIED (seed 02 section 2.2, re-fetched)
- Evidence: https://github.com/huggingface/lerobot/pull/4549 | Tier 2, first-party repository pull request (not merged as a whole; not a release note) | benchmark claim (author reported) | "Dataset-access latency on `lerobot/koch_pick_place_5_lego` (37,972 frames, 50 episodes, 2 cameras, v3.0), `main` vs this PR. Single process, warm OS cache, `torchcodec` backend, median ms per item." ... "| random | 16.98 | 4.95 | **3.43x** |" ... "**Single-item access** ... | random | 5.37 | 5.16 |" (accessed 2026-11-20). The v0.7.0 code already contains two of the PR's three changes (the faststart comment at `video_utils.py` line 547 and the "no nearest-match/re-stack needed" comment at lines 451-453), so part of it reached the release by another route [our reading].
- Use in dive: section 10, the only per-item decode latency from the LeRobot repository found today. [derived] 5.16 ms per item is about 194 items per second per process, 388 camera frames per second for two cameras. Use it as an order of magnitude, labelled, until the dive's own measurement (Tier 0) replaces it.

**F05-63. (History, 2024 benchmark carried in the repository until 2025.) LeRobot chose AV1, `yuv420p`, GOP 2, CRF 30 from its own video benchmark. On a 480x640 real-world dataset those settings gave a video 5.59% the size of the original images and a load time 0.48 times that of loading the images, for six consecutive frames with the PyAV decoder.**
- Location: `benchmarks/video/README.md`, sections "Parameters selected for LeRobotDataset" and "Summary", at tag v0.4.0 (`f25ac02e6c8fa9c467ab8462289e5f4aed3a2e85`, released 2025-10-23). The directory is absent at v0.6.1 and v0.7.0; the v0.7.0 docs point to a "video-benchmark" Space instead
- Verdict: NEW (labelled history: the measurements predate 2025)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/f25ac02e6c8fa9c467ab8462289e5f4aed3a2e85/benchmarks/video/README.md | Tier 1, first-party repository docs | benchmark claim (vendor reported) | "Considering these results, we chose what we think is the best set of encoding parameter: - vcodec: `libsvtav1` - pix-fmt: `yuv420p` - g: `2` - crf: `30`" ... "These tables show the results for `g=2` and `crf=30`, using `timestamps-modes=6_frames` and `backend=pyav`" ... "| aliberts/aloha_mobile_shrimp_image | 2.14% | 2.11% | 1.38% | **1.37%** | 5.59% |" (size ratio; last column libsvtav1) and "| aliberts/aloha_mobile_shrimp_image | 11.80 | 7.92 | 0.71 | 0.85 | **0.48** |" (load-time ratio) (accessed 2026-11-20)
- Use in dive: section 9, why the default is what it is: at GOP 2 the AV1 file was larger than H.264 or H.265 (5.59% against 2.14% and 1.38%) and was picked because it loaded fastest. The seed's and the docs' "AV1 gives the smallest files" (F05-43) and this table disagree; see section 8.

**F05-64. The same benchmark states the access pattern that makes robot training unlike watching a film: a policy asks for a few frames at random places, so small GOP sizes pay off.**
- Location: `benchmarks/video/README.md`, "Requested timestamps", tag v0.4.0
- Verdict: NEW (history)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/f25ac02e6c8fa9c467ab8462289e5f4aed3a2e85/benchmarks/video/README.md | Tier 1, first-party repository docs | definition | "Given the way video decoding works, once a keyframe has been loaded, the decoding of subsequent frames is fast. This of course is affected by the `-g` parameter during encoding, which specifies the frequency of the keyframes. Given our typical use cases in robotics policies which might request a few timestamps in different random places" ... "Note that this differs significantly from a typical use case like watching a movie, in which every frame is loaded sequentially from the beginning to the end and it's acceptable to have big values for `-g`." (accessed 2026-11-20)
- Use in dive: section 9, the plain-words reason for GOP 2.

**F05-65. On EC2 the CPU budget per GPU is fixed by the instance type. The eight-GPU sizes of G5, G6, G6e, G7, G7e, P5, P5e, P5en, P6-B200 and P6-B300 all have 192 vCPUs, 24 per GPU; p4d.24xlarge has 96 vCPUs for 8 A100s, 12 per GPU; p6e-gb200.36xlarge has 144 Grace cores for 4 GPUs, 36 per GPU.**
- Location: Amazon EC2 instance types guide, "Specifications for Amazon EC2 accelerated computing instances", performance table
- Verdict: CARRIED (seed 02 section 2.2 gave the P5 figure; re-fetched and extended)
- Evidence: https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | Tier 1, first-party docs | documentation of support | rows (instance type, memory GiB, processor, vCPUs, cores, threads per core, accelerators): "p4d.24xlarge | 1152.00 | Intel Xeon Platinum 8275CL | 96 | 48 | 2 | 8 x NVIDIA A100 GPU", "p5.48xlarge | 2048.00 | AMD EPYC 7R13 | 192 | 96 | 2 | 8 x NVIDIA H100 GPU", "p5en.48xlarge | 2048.00 | Intel Xeon Sapphire Rapids | 192 | 96 | 2 | 8 x NVIDIA H200 GPU", "p6-b200.48xlarge | 2048.00 | Intel Xeon Emerald Rapids | 192 | 96 | 2 | 8 x NVIDIA B200 GPU", "p6-b300.48xlarge | 4096.00 | Intel Xeon Emerald Rapids | 192 | 96 | 2 | 8 x NVIDIA B300 GPU", "p6e-gb200.36xlarge | 960.00 | Nvidia Grace CPU | 144 | 144 | 1 | 4 x NVIDIA B200 GPU", "g6.48xlarge | 768.00 | AMD EPYC 7R13 | 192 | 96 | 2 | 8 x NVIDIA L4 GPU", "g6e.48xlarge | 1536.00 | AMD EPYC 7R13 | 192 | 96 | 2 | 8 x NVIDIA L40S GPU", "g7e.48xlarge | 2048.00 | Intel Xeon Emerald Rapids | 192 | 96 | 2 | 8 x NVIDIA RTX PRO Server 6000 GPU" (accessed 2026-11-20). [derived] 192 / 8 = 24; 96 / 8 = 12; 144 / 4 = 36. A vCPU on the x86 rows is one hardware thread; 24 vCPUs are 12 physical cores.
- Use in dive: section 10, the constraint row of the "cores needed to feed one GPU" example. Stream 06 or 07 owns the instance families; this entry only supplies the ratio.

**F05-66. Single-GPU sizes offer a wider CPU-to-GPU ratio than the eight-GPU sizes: g6.xlarge has 4 vCPUs for one L4, g7e.8xlarge 32 vCPUs for one RTX PRO 6000, p5.4xlarge 16 vCPUs for one H100. EC2 also lists a G7 family with the RTX PRO 4500 (32 GiB), from g7.2xlarge (8 vCPUs, 1 GPU) to g7.48xlarge (192 vCPUs, 8 GPUs).**
- Location: Amazon EC2 instance types guide, accelerated computing specifications, performance table
- Verdict: NEW (the G7 family is not in the seed)
- Evidence: https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | Tier 1, first-party docs | documentation of support | "g6.xlarge | 16.00 | AMD EPYC 7R13 | 4 | 2 | 2 | 1 x NVIDIA L4 GPU", "g7e.8xlarge | 256.00 | Intel Xeon Emerald Rapids | 32 | 16 | 2 | 1 x NVIDIA RTX PRO Server 6000 GPU", "p5.4xlarge | 256.00 | AMD EPYC 7R13 | 16 | 8 | 2 | 1 x NVIDIA H100 GPU", "g7.2xlarge | 32.00 | Intel Xeon Granite Rapids | 8 | 8 | 1 | 1 x NVIDIA RTX PRO 4500 GPU | 32 GiB (1 x 32 GiB)", "g7.48xlarge | 768.00 | Intel Xeon Granite Rapids | 192 | 192 | 1 | 8 x NVIDIA RTX PRO 4500 GPU" (accessed 2026-11-20). The G7 rows show one thread per core, so their 24 vCPUs per GPU are 24 physical cores. The NVIDIA matrix row "NVIDIA RTX PRO 4500 Blackwell Server Edition" has 3 NVENC and 3 NVDEC with AV1 both ways (F05-52); that this is the G7 card is [our reading] of the name.
- Use in dive: section 10, choosing a single-GPU size by its vCPU count when the input pipeline is the limit. Hand the G7 family to the AWS stream as a currency item.

**F05-67. [derived] Hardware decode of LeRobot's default AV1 on EC2: possible on G5 (decode only), G6, G6e, G7, G7e, P6-B200, P6-B300 and P6e-GB200; not possible on G4dn (T4), P4d (A100) or P5 (H100); not established for P5e/P5en (H200). No P-family card can hardware-encode anything.**
- Location: join of F05-46 to F05-54 (NVIDIA matrix) with the accelerator column of F05-65 and F05-66 (EC2 specifications)
- Verdict: CARRIED (seed 02 section 2.2 table, both sources re-fetched; G5, G7, B300 added; H200 downgraded to UNKNOWN)
- Evidence: inputs F05-46 to F05-54, F05-65, F05-66 | Tier 1 inputs, join ours | [derived] | A100: AV1 decode NO. H100: NO. B200, B300, GB200: YES, 0 NVENC. L4, L40S, RTX PRO 6000 and 4500 Blackwell Server Edition: YES both ways. A10: decode YES, encode NO. T4: NO. H200: no row.
- Use in dive: section 10, the one table that turns the codec choice into an instance choice. With LeRobot's stock loader the question is moot, since it decodes on CPU (F05-39, F05-41); it matters for pipelines that decode on the GPU (curation, DALI-style loaders).

### F. Curation: decode, filter, embed, deduplicate

Code and docs URLs for NVIDIA Cosmos Curator use `https://raw.githubusercontent.com/NVIDIA/cosmos-curator/95675431e309fd86c1c559a39fcb694ddedaa2a9/` (tag v2.10.0, released 2026-11-10). The repository the seed and the task call `nvidia-cosmos/cosmos-curate` now redirects to `NVIDIA/cosmos-curator`.

**F05-68. NVIDIA Cosmos Curator is at v2.10.0 (2026-11-10). It describes itself as "a toolkit for curating physical AI training data" whose features are video splitting, annotation, filtering, deduplication and dataset generation, run on Ray.**
- Location: `README.md`, "Overview" and "Features", tag v2.10.0; `gh api repos/NVIDIA/cosmos-curator/releases`
- Verdict: CARRIED (seed 02 section 2.3, re-fetched; version and repository name updated)
- Evidence: https://raw.githubusercontent.com/NVIDIA/cosmos-curator/95675431e309fd86c1c559a39fcb694ddedaa2a9/README.md | Tier 1, first-party repository docs | definition | "Cosmos Curator helps teams build physical AI data curation workflows from reusable components and reference recipes. It supports training data preparation for [Cosmos](https://www.nvidia.com/en-us/ai/cosmos/) at NVIDIA." and "**Video Processing**: Efficient video splitting, annotation, filtering, deduplication, and dataset generation" / "**Distributed Computing**: Scalable processing with Ray Data; existing pipelines also use [Cosmos-Xenna](https://github.com/nvidia-cosmos/cosmos-xenna)" (accessed 2026-11-20)
- Use in dive: section 10, the reference tool for curation at scale.

**F05-69. Its reference "split-annotate" pipeline has seven logical stages: video download, decoding and splitting (a TransNetV2 model finds shot changes), transcoding each clip to H.264, filtering on motion and aesthetics, video embedding, captioning with a vision-language model, and writing clips with metadata.**
- Location: `docs/curator/reference/video-pipelines.md`, "Split-Annotate Pipeline Stages", tag v2.10.0
- Verdict: CARRIED (seed 02 section 2.3 listed five stages from the 2025 blog; the current reference lists seven)
- Evidence: https://raw.githubusercontent.com/NVIDIA/cosmos-curator/95675431e309fd86c1c559a39fcb694ddedaa2a9/docs/curator/reference/video-pipelines.md | Tier 1, first-party docs | definition | "**Video Download**: Downloads the videos from cloud storage or reads them from disk into memory. - **Decoding and Splitting**: Decodes the video frames from the raw mp4 bytes and runs a TransNetV2-based splitting algorithm to split the video into clips based on shot transition. - **Transcoding**: Encodes each of the clips into individual mp4 files under the same encoding (H264). - **Filtering**: Filters out clips based on motion and aesthetics. - **Video Embedding**: Creates an embedding for each clip, which can be used for constructing visual semantic search and/or performing semantic deduplication across dataset. - **Captioning**: Generates a text caption of the clip using a vision-language model (VLM). - **Clip Writer**: Uploads the clips and their metadata back to cloud storage or writes them to local disk." (accessed 2026-11-20)
- Use in dive: section 10, the stage diagram: decode, filter, embed, deduplicate, with caption added.

**F05-70. The pipeline splits CPU work from GPU work on purpose: preparing the inputs of the captioning model is a separate CPU stage so that many CPU workers keep the GPU captioning workers busy.**
- Location: `docs/curator/reference/video-pipelines.md`, note under the stage list, tag v2.10.0
- Verdict: CARRIED (seed 02 section 2.3, re-fetched from the repository)
- Evidence: https://raw.githubusercontent.com/NVIDIA/cosmos-curator/95675431e309fd86c1c559a39fcb694ddedaa2a9/docs/curator/reference/video-pipelines.md | Tier 1, first-party docs | definition | "VLM captioning requires non-trivial preprocessing of the video, which is typically done on CPU and can hurt GPU utilization. To improve upon that, the preprocessing functionality is separated into a VLM input preparation stage, such that - the VLM input preparation stage can scale independently and spawn many parallel CPU workers to keep the captioning stage's GPU workers busy; - the VLM captioning stage is left with mostly GPU work and therefore can achieve high GPU utilization and throughput." (accessed 2026-11-20)
- Use in dive: section 10, the same lesson as training (F05-58): CPU-side video preparation decides whether the GPU is busy.

**F05-71. Stage resource defaults in the reference pipeline, tuned for a 48 GB GPU: the shot-detection, aesthetic and embedding models each take 0.25 of a GPU per worker and the motion filter 0.5; on the CPU side frame decode takes 3 CPUs per worker, transcode 5, clip extraction 3 and captioning-input preparation 3.**
- Location: `docs/curator/reference/video-pipelines.md`, "Options for Performance", tag v2.10.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/cosmos-curator/95675431e309fd86c1c559a39fcb694ddedaa2a9/docs/curator/reference/video-pipelines.md | Tier 1, first-party docs | documentation of support | "`--transnetv2-gpus-per-worker`: number of fractional GPUs per work for `TransNetV2` stage; default to `0.25` targeting 48GB GPU." / "`--motion-score-gpus-per-worker`: ... default to `0.5` targeting 48GB GPU." / "`--embedding-gpus-per-worker`: ... default to `0.25` targeting 48GB GPU." / "`--transnetv2-frame-decode-cpus-per-worker` (default `3.0`): CPU threads per worker for video frame decoding in `ffmpeg_cpu` mode." / "`--transcode-cpus-per-worker` (default `5.0`)" / "`--clip-extraction-cpus-per-worker` (default `3.0`)" / "`--vllm-prepare-num-cpus-per-worker` (default `3.0`)" (accessed 2026-11-20)
- Use in dive: section 10, "what each stage loads": small models share a GPU four to a card; decode and transcode are counted in CPU threads.

**F05-72. The embedding models the classic Cosmos Curator pipeline offers for search and deduplication are InternVideo2 (the default) and NVIDIA's Cosmos-Embed1 at 224p, 336p or 448p; an OpenAI-compatible endpoint is a third option. Cosmos-Embed1 reads 8 frames of a clip and returns a 256-number vector at 224p or a 768-number vector at 336p and 448p.**
- Location: `docs/curator/reference/video-pipelines.md`, "Options for Functionality"; `docs/curator/design/curator-next-video-embed.md` lines 34-36, tag v2.10.0
- Verdict: NEW (the seed plan assumed V-JEPA 2 for embedding; the tool's code and docs name other models)
- Evidence: https://raw.githubusercontent.com/NVIDIA/cosmos-curator/95675431e309fd86c1c559a39fcb694ddedaa2a9/docs/curator/reference/video-pipelines.md | Tier 1, first-party docs | documentation of support | "`--embedding-algorithm`: specifies embedding model, available options are `cosmos-embed1-224p`, `cosmos-embed1-336p`, `cosmos-embed1-448p`, `internvideo2` (default), and `openai`" and `curator-next-video-embed.md`: "| `224p` | 8 RGB frames, 224 x 224 | 256 |" / "| `336p` (default) | 8 RGB frames, 336 x 336 | 768 |" / "| `448p` | 8 RGB frames, 448 x 448 | 768 |" (accessed 2026-11-20). The model registry `cosmos_curator/configs/all_models.json` at the tag has no V-JEPA and no SigLIP entry; it lists `cosmos_embed1_*`, `internvideo2_mm`, `dinov2_small`, `bge_small_en_v1_5`, `clip_vit` among others.
- Use in dive: section 10, name the embedding models the tool really uses.

**F05-73. Deduplication in the classic pipeline is "semantic": it clusters the clip embeddings with K-Means and, inside each cluster, drops clips that sit too close to another by cosine similarity (threshold option `--eps-to-extract`, default 0.01).**
- Location: `docs/curator/reference/video-pipelines.md`, "Dedup Pipeline" and "Dedup Pipeline Configurable Options", tag v2.10.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/cosmos-curator/95675431e309fd86c1c559a39fcb694ddedaa2a9/docs/curator/reference/video-pipelines.md | Tier 1, first-party docs | documentation of support | "The semantic dedup pipeline takes the embedding-parquet path under `output_clip_path` of split-annotate pipeline as its `input_embeddings_path`, and generates deduplication results." / "`--n-clusters`: number of clusters for K-Means clustering." / "`--eps-to-extract`: Epsilon value to extract deduplicated records; default to `0.01`." / "`--sim-metric`: specifies the metric to use for ordering within a cluster w.r.t. the centroid; choices are `cosine`, `l2` and default to `cosine`." (accessed 2026-11-20). "Drops clips that sit too close to another" is [our reading] of the epsilon option; the exact rule was not read in code (U8).
- Use in dive: section 10, the deduplicate step's mechanism: embed, cluster, compare within cluster.

**F05-74. For robot datasets Cosmos Curator has a newer set of recipes ("Curator Next") that reads LeRobot-layout datasets directly: `robot-action-split` cuts each episode into subtask spans using the Parquet episode metadata and keeps each span's video together with its action data, across camera views.**
- Location: `docs/curator/design/curator-next-robot-action-split.md`, "Summary", tag v2.10.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/cosmos-curator/95675431e309fd86c1c559a39fcb694ddedaa2a9/docs/curator/design/curator-next-robot-action-split.md | Tier 1, first-party design docs | definition | "`robot-action-split` builds on the original Curator Next video-split design to support **semantically-bounded span extraction** from LeRobot/Mecka robot datasets. ... this recipe reads parquet-backed episode metadata, identifies subtask boundaries, and cuts each span as a standalone MP4 together with its per-span robot action data (`.bin` file) and a JSON metadata sidecar. Multiple camera views of the same span are treated as a coherent group" and "GOP-aware smart cut - stream-copy for interior frames, re-encode only the head" (accessed 2026-11-20). The README marks Curator Next as incubating: "Its APIs and data contracts are evolving during incubation."
- Use in dive: section 10, robot-specific curation exists as a first-party tool and consumes the LeRobot layout of group B.

**F05-75. In that robot recipe, deduplication does not use a video model. Each clip gets three small embeddings: text (BGE-small, 384 numbers) from the subtask instruction, image (DINOv2-small, 384 numbers) from the clip's first frame, and an action embedding computed from the wrist motion; redundancy and fair task coverage are decided separately.**
- Location: `docs/curator/design/curator-next-embeddings.md` (glossary and the "why the first frame, and why DINOv2" passage); `docs/curator/design/curator-next-curation.md`, "The two questions curation answers", tag v2.10.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/cosmos-curator/95675431e309fd86c1c559a39fcb694ddedaa2a9/docs/curator/design/curator-next-embeddings.md | Tier 1, first-party design docs | definition | "**BGE** | BAAI General Embedding - the small (384-d) sentence-embedding model (`BAAI/bge-small-en-v1.5`) used for the text leg." / "**DINOv2** | A self-supervised vision model (`facebook/dinov2-small`, 384-d) used for the image leg; its features describe visual structure rather than text-alignment." / "ACT2 pose annotation --decode_action_bin--> dual_wrist_motion_descriptor --> PCA --> action embedding". `curator-next-curation.md`: "**Is this recording redundant?** | what the clip *is* - instruction, appearance, motion | multimodal fusion + locality clustering + SemDedup" / "**Is this meaning fairly represented?** | what the clip is *labelled* | annotation semantics + balanced selection" (accessed 2026-11-20)
- Use in dive: section 10, the mental model for robot deduplication: two recordings are duplicates when instruction, look and motion all match; and a balanced dataset is a second, separate question.

**F05-76. The same docs record a curation run that was input-bound: on 32 H100s, 32 captioning replicas delivered 7.1 rows per second against a capacity near 43, with aggregate GPU utilisation about 17%, because fetching the clips was the slow side.**
- Location: `docs/curator/design/curator-next-robot-action-caption.md`, lines 3281-3286, tag v2.10.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/cosmos-curator/95675431e309fd86c1c559a39fcb694ddedaa2a9/docs/curator/design/curator-next-robot-action-caption.md | Tier 1, first-party design docs | production report (vendor reported, one run) | "**The one measured run was fetch-bound, and badly.** On 4x8 H100 against a 131,602-row table (17 fragments, 16 IO slots per node, serial per-actor fetching), 32 engine replicas delivered 7.1 rows/s while their own batch latency of 19.5-27.8 s per 32 rows put their combined capacity near 43 rows/s. Aggregate GPU utilization was about 17%, 10 of the 32 replicas never received a single request" (accessed 2026-11-20)
- Use in dive: section 10, a first-party 2026 measurement of GPUs starved by the data path: 17% utilisation on 32 H100s. Repeat it next to F05-59.

**F05-77. Cosmos Curator's own notes confirm the hardware matrix from the software side: GPU transcoding with `h264_nvenc` is kept for GPUs that have NVENC, and CPU `libopenh264` is the default encoder "for GPUs without NVENC hardware (A100, H100)". For decode it prefers NVIDIA's PyNvVideoCodec over FFmpeg on the GPU, which it found no faster than FFmpeg on the CPU.**
- Location: `docs/curator/design/slim-image.md` lines 52-57, tag v2.10.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/cosmos-curator/95675431e309fd86c1c559a39fcb694ddedaa2a9/docs/curator/design/slim-image.md | Tier 1, first-party design docs | documentation of support | "GPU video decode via PyNvVideoCodec (`pynvc` mode, already the preferred path in `VideoFrameExtractionStage`). The `ffmpeg_gpu` decode mode is removed - benchmarks showed it performed the same as `ffmpeg_cpu`, while `pynvc` is measurably faster." and "GPU FFmpeg transcoding (`h264_nvenc`) retained for teams with NVENC-capable GPUs (e.g. RTX in data center). CPU `libopenh264` remains the default encoder for GPUs without NVENC hardware (A100, H100)." (accessed 2026-11-20)
- Use in dive: section 10, ties F05-46 and F05-47 to a real pipeline's design choice.

**F05-78. [vendor claim] The throughput figures the seed attributes to Cosmos Curator come from a March 2025 NVIDIA post about "NeMo Video Curator" on DGX Cloud: about 195 seconds to process one hour of video per GPU in streaming mode against about 352 seconds in batch mode, and "~1M hours of 720p video data on 2k H100 GPUs in one day". The post does not use the name Cosmos Curator and gives no software version.**
- Location: NVIDIA Technical Blog, "Petabyte-Scale Video Processing with NVIDIA NeMo Curator on NVIDIA DGX Cloud", Mar 18, 2025, "Results and impact" and "Next steps"
- Verdict: CARRIED (seed 02 section 2.3 and seed 11, re-fetched; product name and date corrected, see section 6)
- Evidence: https://developer.nvidia.com/blog/petabyte-scale-video-processing-with-nvidia-nemo-curator-on-nvidia-dgx-cloud/ | Tier 2, first-party blog | benchmark claim (vendor reported) | "the streaming pipeline requires ~195 seconds to process one hour of video per GPU, while the batch pipeline requires ~352 seconds to do the same: resulting in a ~1.8x speedup" and "a 89x performance improvement to date above baseline, resulting in a pipeline capable of processing ~1M hours of 720p video data on 2k H100 GPUs in one day" and "after an initial warm-up period, the auto-scaler can rearrange the resources such that GPU stage workers are kept busy over 99.5% of the time. This experiment was done with 32 GPUs on four nodes." (accessed 2026-11-20). [derived] 3,600 / 195 = 18.5 video-hours per GPU-hour; 2,000 GPUs x 24 h x 18.5 = 886,000 video-hours per day, consistent with "~1M". The pipeline measured (which captioning model, which filters) is not specified beyond the stage list, and no figure for Cosmos Curator v2.x was located (U9).
- Use in dive: section 10, the published order of magnitude for curation cost, with its age and product name stated: 20 months old, a predecessor product, 720p.

**F05-79. [vendor claim] The same post frames curation as a streaming pipeline whose controller measures each stage's throughput and resizes each stage's pool of workers every three minutes, over-provisioning the CPU-only stages so the GPU stages never wait.**
- Location: NVIDIA Technical Blog, same post, "Architecture and implementation details"
- Verdict: CARRIED (seed 02 section 2.3, re-fetched)
- Evidence: https://developer.nvidia.com/blog/petabyte-scale-video-processing-with-nvidia-nemo-curator-on-nvidia-dgx-cloud/ | Tier 2, first-party blog | definition | "Based on the relative throughput, the orchestration thread scales the actor pool size of each stage at three-minute intervals accordingly, so there are more actors for slower stages. The pure-CPU stages can then be over-provisioned so that GPU stages are kept busy even when there is fluctuation in the pipeline." and "the need to split out CPU-dominant tasks, such as video download or clip transcode, from GPU-dominant tasks, such as generating embeddings or running AI classifiers" (accessed 2026-11-20)
- Use in dive: section 10, the orchestration pattern: per-stage autoscaling over mixed CPU and GPU pools. The Cosmos Curator v2.10.0 architecture reference repeats the principle ("scale the actor pool sizes such that the max throughput of all stages are roughly the same").

**F05-80. NVIDIA NeMo Curator, the sibling toolkit, is at v1.4.0 (2026-10-09) and lists video among its modalities: scene detection, clip extraction, motion filtering, deduplication, on Ray.**
- Location: `README.md` at tag v1.4.0 (`10fba1ea785863872ae6983b580ec6813e72cc79`), repository `NVIDIA-NeMo/Curator` (the old name `NVIDIA/NeMo-Curator` redirects)
- Verdict: CARRIED (seed 02 section 2.3 cited its requirements page; version and scope re-fetched)
- Evidence: https://raw.githubusercontent.com/NVIDIA-NeMo/Curator/10fba1ea785863872ae6983b580ec6813e72cc79/README.md | Tier 1, first-party repository docs | documentation of support | "**NeMo Curator helps ML engineers and data teams build repeatable, GPU-accelerated pipelines that load, filter, deduplicate, and transform large text, image, video, and audio datasets for AI training.**" / "| **Video** | Scene detection, clip extraction, motion filtering, deduplication |" / "**2026-02** - NeMo Curator 26.02: Ray-based pipeline architecture for all modalities - text, image, video, and audio." (accessed 2026-11-20). Its video hardware requirements page was not re-fetched (U10).
- Use in dive: section 10, one line naming the alternative; the two toolkits overlap and the dive should not present them as one product.

**F05-81. LeRobot itself ships the small-scale curation tools: `lerobot-edit-dataset` deletes episodes, splits and merges datasets, removes features, re-encodes video and recomputes statistics. The docs call episode deletion "useful for filtering out undesired data".**
- Location: `docs/source/using_dataset_tools.mdx` lines 86-128, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/using_dataset_tools.mdx | Tier 1, first-party docs | documentation of support | "`lerobot-edit-dataset` is a command-line script for editing datasets. It can be used to delete episodes, split datasets, merge datasets, remove features, modify tasks, convert image datasets to video format, re-encode videos, recompute stats and show dataset info." and "Remove specific episodes from a dataset. This is useful for filtering out undesired data." with `lerobot-edit-dataset --repo_id lerobot/pusht --operation.type delete_episodes --operation.episode_indices "[0, 2, 5]"` (accessed 2026-11-20). The tool takes the list of episodes to drop; it does not decide which ones are bad.
- Use in dive: section 10, the arm-scale curation step: watch the 50 episodes in the visualizer, delete the failed ones by index.

**F05-82. Robot-specific quality signal, first-party: LeRobot's reward-model docs say real datasets "contain hesitations, corrections, and variable-quality trajectories", and offer a learned progress score (0 to 1 per frame) that training can use to weight frames, up-weighting those where progress rises and down-weighting those where it stalls or falls.**
- Location: `docs/source/sarm.mdx` lines 13-15 and 405-420, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/sarm.mdx | Tier 1, first-party docs | definition | "Standard behavior cloning treats all demonstration frames equally, but real-world robot datasets are messy. They contain hesitations, corrections, and variable-quality trajectories. Reward models solve this by learning a generalizable notion of **task progress** from demonstrations: given video frames and a task description, they predict how close the robot is to completing the task (0->1)." and "For each training sample, RA-BC computes the progress delta: r_i = phi(o_{t+Delta}) - phi(o_t) Where `phi` is the SARM progress prediction and `Delta` is the policy's `chunk_size`. Samples with positive progress (good demonstrations) get higher weights, while samples with negative or zero progress get down-weighted." (accessed 2026-11-20). SARM is Stage-Aware Reward Modeling; RA-BC is Reward-Aligned Behavior Cloning. The underlying paper was not fetched (U11).
- Use in dive: section 10, quality filtering specific to robot episodes: idle and failed stretches are down-weighted by a learned progress score, a softer tool than deleting episodes.

**F05-83. LeRobot v0.7.0 also annotates: `lerobot-annotate` runs a vision-language model over each episode's video and writes subtasks, plans and question-answer pairs into the dataset's Parquet files. With the defaults a 30-second episode costs about 50 model calls.**
- Location: `docs/source/annotation_pipeline.mdx`, opening and "Roughly how much it costs", tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/annotation_pipeline.mdx | Tier 1, first-party docs | documentation of support | "`lerobot-annotate` watches each episode's video with a vision-language model (VLM) and writes natural-language annotations back into your dataset." and "With the defaults (8 subtasks, 3 interjections, 1 Hz x 3 pairs) on a 30-second episode, that's ~50 VLM calls." (accessed 2026-11-20). [derived] 50 episodes x about 50 calls = about 2,500 calls for the arm dataset, with episode length 30 s [illustration; the public dataset's episodes average 8 s].
- Use in dive: section 10, annotation as the GPU-inference part of curation at arm scale.

### G. Augmentation and synthetic data

#### G1. Image-space augmentation in the dataloader

**F05-84. LeRobot's image transforms are off by default. When enabled, each frame gets up to 3 transforms drawn from six: brightness (factor 0.8 to 1.2), contrast (0.8 to 1.2), saturation (0.5 to 1.5), hue (-0.05 to 0.05), sharpness (0.5 to 1.5) and a small affine move (rotation within 5 degrees, translation up to 5% of the frame).**
- Location: `src/lerobot/transforms/transforms.py` lines 1444-1511 (`ImageTransformsConfig`), tag v0.7.0
- Verdict: CARRIED (seed 11 named "colour jitter, sharpness, affine" from memory; now read from code with ranges)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/transforms/transforms.py | Tier 1, code | code behaviour | `enable: bool = False` / `max_num_transforms: int = 3` / `random_order: bool = False` / `"brightness": ImageTransformConfig(weight=1.0, type="ColorJitter", kwargs={"brightness": (0.8, 1.2)},)` / `kwargs={"contrast": (0.8, 1.2)}` / `kwargs={"saturation": (0.5, 1.5)}` / `kwargs={"hue": (-0.05, 0.05)}` / `type="SharpnessJitter", kwargs={"sharpness": (0.5, 1.5)}` / `type="RandomAffine", kwargs={"degrees": (-5.0, 5.0), "translate": (0.05, 0.05)}` (accessed 2026-11-20)
- Use in dive: section 11, the first and cheapest kind of augmentation, with its real default ranges.

**F05-85. The transforms change only what the model sees during training. The dataset on disk keeps the raw frames, so augmentation choices can be changed without recording again.**
- Location: `docs/source/lerobot-dataset-v3.mdx` lines 182-184, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/lerobot-dataset-v3.mdx | Tier 1, first-party docs | documentation of support | "Currently, transforms are applied during **training time only**, not during recording. When you create or record a dataset, the raw images are stored without transforms. This allows you to experiment with different augmentations later without re-recording data." (accessed 2026-11-20)
- Use in dive: section 11, where image augmentation sits in the pipeline: inside the training input path, after decode.

**F05-86. v0.7.0 adds transforms that imitate what real robot cameras do: Gaussian noise, motion blur, JPEG compression, a bright patch, a random shadow, dropped rectangles, gamma change and colour-temperature shift.**
- Location: `docs/source/lerobot-dataset-v3.mdx` lines 252-258 ("Available transform types"), tag v0.7.0; release blog "Augment on the GPU"
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/lerobot-dataset-v3.mdx | Tier 1, first-party docs | documentation of support | "**`GaussianNoise`**, **`MotionBlur`**, **`JPEGCompression`**, **`GaussianPatchBrightness`**, **`RandomShadow`**, **`CoarseDropout`**, **`GammaCorrection`**, **`PlanckianJitter`**: Camera and lighting effects seen on real robots" (accessed 2026-11-20). Blog (Tier 2): "Eight new robotics-oriented augmentations come with it, from motion blur and random shadows to JPEG compression and color-temperature jitter."
- Use in dive: section 11, the list of robot-specific image augmentations. None of them is in the default set of F05-84.

**F05-87. The transforms can run in two places. The default backend "dataloader" applies them per sample on CPU in the worker processes; backend "gpu" leaves the workers to decode only and applies the same transforms per batch on the training GPU, 32 samples at a time by default, after a one-off compile of 15 to 30 s per image shape. At 480x640 with two frames per sample and a batch of 160, the code comment gives a peak of 2.4 GB of GPU memory.**
- Location: `src/lerobot/transforms/transforms.py` lines 1454-1471; `docs/source/lerobot-dataset-v3.mdx` lines 277-302, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/transforms/transforms.py | Tier 1, code | code behaviour | `backend: ImageTransformsBackend = "dataloader"` with comment "\"dataloader\" applies them per sample in the DataLoader workers (CPU). \"gpu\" leaves the workers to decode only and applies the batched, per-sample equivalents on the policy device inside the training preprocessor" / `gpu_compile: bool = True` ("about three times faster per batch for a one-off compile of 15-30 s per frame shape") / `gpu_chunk_size: int | None = 32` ("At 256x256 with two frames per sample that is 0.5 GB for a batch of 160 at the default against 1.1 GB unbounded; at 480x640, 2.4 GB against 6.3 GB.") (accessed 2026-11-20)
- Use in dive: section 11, which part of the machine image augmentation loads: CPU cores by default, GPU tensor cores and a few GB of GPU memory when moved. Pairs with F05-59 (2.8x on an H100).

#### G2. Demonstration multiplication in simulation

**F05-88. (History, 2023.) [author reported] MimicGen introduced demonstration multiplication: from about 200 human demonstrations it generated over 50,000 across 18 tasks by adapting the human segments to new object positions in simulation.**
- Location: arXiv 2310.17596v1, abstract
- Verdict: CARRIED (seed 02 section 4.1, re-fetched)
- Evidence: https://arxiv.org/abs/2310.17596v1 | Tier 3, peer-reviewed (CoRL 2023, per the arXiv comments field "Conference on Robot Learning (CoRL) 2023") | benchmark claim (author reported) | "We introduce MimicGen, a system for automatically synthesizing large-scale, rich datasets from only a small number of human demonstrations by adapting them to new contexts. We use MimicGen to generate over 50K demonstrations across 18 tasks with diverse scene configurations, object instances, and robot arms from just ~200 human demonstrations." (accessed 2026-11-20). [derived] 50,000 / 200 = 250 generated per human demonstration.
- Use in dive: section 11, the paper that introduced the idea, labelled history.

**F05-89. How it works in Isaac Lab Mimic (Isaac Lab v3.0.0): each human demonstration is cut into subtasks; the tool transforms the subtask segments to fit a new scene, stitches them into a candidate demonstration, runs it in the simulator, and keeps it only if a success check passes. The share of candidates that pass ranges from about 70% in simple cases to under 1%.**
- Location: `docs/source/features/imitation-learning/teleop_imitation.rst` lines 590-595, tag v3.0.0 (`e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4`, released 2026-10-20)
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/isaac-sim/IsaacLab/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/features/imitation-learning/teleop_imitation.rst | Tier 1, first-party docs | definition | "With subtasks defined and annotated, Isaac Lab Mimic utilizes a small number of helper methods to then transform the subtask segments, and generate new demonstrations by stitching them together to match the new task at hand. For each thusly generated candidate demonstration, Isaac Lab Mimic uses a boolean success criteria to determine whether the demonstration succeeded in performing the task, and if so, add it to the output dataset. Success rate of candidate demonstrations can be as high as 70% in simple cases, and as low as <1%" (accessed 2026-11-20)
- Use in dive: section 11, the mechanism: cut, move, stitch, replay, keep the successes. The success rate is the yield of the factory.

**F05-90. [vendor claim] Isaac Lab v3.0.0, Franka cube stacking: generating 1,000 demonstrations takes about 15 minutes for a state-only dataset (1,000 parallel environments) and about 1 hour for a dataset with camera images (300 parallel environments), at a success rate of about 40%, on one RTX PRO 6000 Blackwell.**
- Location: `docs/source/features/imitation-learning/teleop_imitation.rst` lines 405-446, tag v3.0.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/isaac-sim/IsaacLab/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/features/imitation-learning/teleop_imitation.rst | Tier 1, first-party docs | benchmark claim (vendor reported) | commands `--num_envs 1000 --generation_num_trials 1000` (state-based) and `--num_envs 300 --generation_num_trials 1000` (visuomotor); "Data generation success rate: ~40% for both state and visuomotor" / "Data generation time: ~15 mins for state, ~1 hour for visuomotor" / "*Numbers are based on using an RTX PRO 6000 Blackwell GPU with the provided commands.*" (accessed 2026-11-20). [derived] Rendering camera images makes the same 1,000 demonstrations about 4 times slower with 0.3 times the parallel environments.
- Use in dive: section 11, the current-version single-arm figure, and the cost of pixels: with cameras the job is render-bound.

**F05-91. [vendor claim] The seed's "1,000 demonstrations in 19 minutes on one RTX 6000 Ada" is still in the Isaac Lab v3.0.0 docs. It is the GR-1 humanoid pick-and-place example: "typically 65-80%" success over 1,000 demonstrations in 18 to 40 minutes. The harder nut-pouring task with cameras takes about 10 hours for 1,000 demonstrations on the same card.**
- Location: `docs/source/features/imitation-learning/humanoids_imitation.rst` lines 238-239 and 379-380, tag v3.0.0
- Verdict: CARRIED (seed 02 section 4.1 and seed 11, re-fetched at the current tag)
- Evidence: https://raw.githubusercontent.com/isaac-sim/IsaacLab/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/features/imitation-learning/humanoids_imitation.rst | Tier 1, first-party docs | benchmark claim (vendor reported) | "Data generation success for this task is typically 65-80% over 1000 demonstrations, taking 18-40 minutes depending on GPU hardware and success rate (19 minutes on a RTX ADA 6000 @ 80% success rate)." and "Data generation for 1000 demonstrations takes approximately 10 hours on a RTX ADA 6000." (accessed 2026-11-20). [derived] 1,000 / 19 min = about 3,160 demonstrations per GPU-hour for the easy task; 1,000 / 10 h = 100 per GPU-hour for the hard one, a 30-fold spread.
- Use in dive: section 11, the strongest number of the section, with its condition (easy task) and its counterweight (10 hours).

**F05-92. [vendor claim] SkillGen, the Isaac Lab variant that plans the motion between skill segments with a GPU motion planner (cuRobo), is slower and memory-bound: 90 to 120 minutes for 1,000 demonstrations with one environment on an RTX 6000 Ada; about 9.5 GB of GPU memory for one environment and about 22 GB for five; at least 24 GB recommended for 1 to 2 environments and 48 GB for up to about 5.**
- Location: `docs/source/features/imitation-learning/skillgen.rst` lines 449-450 and 543-548, tag v3.0.0
- Verdict: CARRIED (seed 02 section 4.1, re-fetched at the current tag)
- Evidence: https://raw.githubusercontent.com/isaac-sim/IsaacLab/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/features/imitation-learning/skillgen.rst | Tier 1, first-party docs | benchmark claim (vendor reported) | "Generation time: ~90 to 120 minutes for one environment with visualizers disabled for 1000 demonstrations on a RTX 6000 Ada GPU." / "Vanilla Cube Stacking: 1 env ~9.3-9.6 GB steady; 5 envs ~21.8-22.2 GB steady (briefly higher during initialization)." / "Minimum recommended GPU: >=24 GB VRAM for ``--num_envs`` 1-2; >=48 GB VRAM for ``--num_envs`` up to ~5." / "The performance gain is not very significant when num_envs is greater than 1." (accessed 2026-11-20)
- Use in dive: section 11, GPU memory as the instance selector for this kind of job.

**F05-93. Isaac Lab v3.0.0 ships an SO-101 robot asset and a cube-stacking task configured for it, so demonstration multiplication on the dive's arm does not need a custom robot model. No published generation time for the SO-101 task was located.**
- Location: repository tree at tag v3.0.0: `source/isaaclab_assets/isaaclab_assets/robots/so101.py`, `source/isaaclab_tasks/isaaclab_tasks/contrib/stack/config/so101/`, `docs/source/_static/environment-previews/so101_stack.jpg`
- Verdict: NEW
- Evidence: https://github.com/isaac-sim/IsaacLab/tree/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/source/isaaclab_tasks/isaaclab_tasks/contrib/stack/config/so101 | Tier 1, code (file presence read from the git tree API; file contents not read) | documentation of support | paths listed by `gh api repos/isaac-sim/IsaacLab/git/trees/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4?recursive=1`: `source/isaaclab_assets/isaaclab_assets/robots/so101.py`, `source/isaaclab_tasks/isaaclab_tasks/contrib/stack/config/so101/pose_ik_action.py` (accessed 2026-11-20). Whether a Mimic environment is registered for the SO-101 stack task was not checked (U12).
- Use in dive: section 11, the bridge from the published Franka and GR-1 figures to the arm task; the simulator stream owns the details.

**F05-94. The GR00T-Mimic blueprint repository is stale against the current tools: its only release is v1.0 (2025-03-18), its last commit is 2025-05-20, and its container pins Isaac Lab 2.0.2 with Isaac Sim 4.5.0 and Cosmos Transfer1, against Isaac Lab v3.0.0 and Cosmos 3 today. It asks for a 48 GB RTX card for simulation and a separate node with an 80 GB H100 or better for Cosmos.**
- Location: `NVIDIA-Omniverse-blueprints/synthetic-manipulation-motion-generation`, `README.md` at commit `be78013710543995b40a3a122294e6ab21699e67`; `gh api` releases
- Verdict: NEW (the seed named the blueprint without a state)
- Evidence: https://raw.githubusercontent.com/NVIDIA-Omniverse-blueprints/synthetic-manipulation-motion-generation/be78013710543995b40a3a122294e6ab21699e67/README.md | Tier 1, first-party repository docs | documentation of support | "This is a reference workflow for creating exponentially large amounts of synthetic motion trajectories for robot manipulation from a small number of human demonstrations" / "NVIDIA GPU (RTX A 6000 with 48GB VRAM)" / "NVIDIA GPU (H100 or higher) with 80GB of VRAM." / "NVIDIA Cosmos must be run on a node separate from the Isaac Lab simulation due to differing hardware requirements." / "The Blueprint container includes a pre-installed version of Isaac Lab 2.0.2 and Isaac Sim 4.5.0." (accessed 2026-11-20). A newer blueprint under another name was not searched for (U13).
- Use in dive: section 11, name the blueprint as the 2025 reference for chaining kind 2 into kind 3 (simulate, then restyle), and say that the maintained path is Isaac Lab itself. The two-node split (RTX card for simulation, large-memory card for generation) is the durable lesson.

#### G3. Generative augmentation with world models

**F05-95. NVIDIA's current generative family is Cosmos 3, released May 2026 (GitHub release "Cosmos3" on 2026-06-01), with three base models: Cosmos3-Edge (4 billion parameters), Cosmos3-Nano (16 billion) and Cosmos3-Super (64 billion). The Cosmos-Transfer2.5 and Cosmos-Predict2.5 repositories state they are "no longer under active development".**
- Location: `NVIDIA/cosmos` `README.md` and `docs/reference/models.md` at commit `0eab578a8935e26aa41c2b7dc9f5ab00f790a037` (2026-11-19); `nvidia-cosmos/cosmos-transfer2.5` `README.md` at `2ff49d0717af02057ae79bc75c00fbff9da1b4e7`; `nvidia-cosmos/cosmos-predict2.5` `README.md` at `a2c298b0a3df3778b973fe65e9e58877b292d8a7`
- Verdict: CARRIED (seed 02 section 4.3, re-fetched)
- Evidence: https://raw.githubusercontent.com/NVIDIA/cosmos/0eab578a8935e26aa41c2b7dc9f5ab00f790a037/README.md | Tier 1, first-party repository docs | documentation of support | "**[May 2026]** Cosmos 3 released" / "| [Cosmos3-Super](https://huggingface.co/nvidia/Cosmos3-Super) | 64B | H200 / B200 / GB200 | Highest quality; synthetic data generation; teacher for distillation |" / "| [Cosmos3-Nano](https://huggingface.co/nvidia/Cosmos3-Nano) | 16B | RTX Pro 6000 / H100 / B200 | Balanced speed and quality; strong base model to post-train |" / "| [Cosmos3-Edge](https://huggingface.co/nvidia/Cosmos3-Edge) | 4B | Jetson AGX Orin / Thor / RTX Pro 6000 | Edge deployment; real-time robot policy and visual reasoning |". Transfer2.5 README: "This repository is no longer under active development and will receive only limited maintenance updates." (accessed 2026-11-20)
- Use in dive: section 11, the current product names. Stream 03 owns how the model works; this register covers what it costs to use for data.

**F05-96. For data augmentation the relevant Cosmos 3 workflow is "transfer": the model takes a text prompt and a control video (edges, blur, depth or a segmentation map) and writes a new video that keeps the geometry and changes the appearance. A post-trained checkpoint, Cosmos3-Nano-Sim-Transfer, takes simulator-rendered control video and produces up to 600 frames at 30 fps and 480p.**
- Location: `docs/reference/models.md`, "Input / output and workflows" and "Simulation checkpoints", commit `0eab578`
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/cosmos/0eab578a8935e26aa41c2b7dc9f5ab00f790a037/docs/reference/models.md | Tier 1, first-party docs | documentation of support | "v2v - transfer | Text + MP4 video (edge, blur, depth, segmentation map) | Video (256p, 480p, 720p) | Video (256p, 480p, 720p) | Not supported" (Super, Nano, Edge) and "| [Cosmos3-Nano-Sim-Transfer](https://huggingface.co/nvidia/Cosmos3-Nano-Sim-Transfer) | Text + simulator-rendered control video: depth, segmentation, edge or blur | Photoreal video aligned to the input geometry; up to 600 frames at 30 FPS, 480p |" and "\* Sim-Transfer runs up to 8 parallel environments in real time on one GB200." (accessed 2026-11-20; the last figure is a [vendor claim]). "\* 720p uses 1280x720, 480p uses 832x480, and 256p uses 320x192."
- Use in dive: section 11, the generative step in plain terms: same motion, new look. The joint actions of the source episode stay valid because the geometry is kept [our reading].

**F05-97. [vendor claim] Cosmos3-Nano transfer with an edge control, one GPU, seconds per generated clip at 480p and 720p: H100 80GB 148.65 and 527.89 (PyTorch) or 132.06 and 447.24 (Diffusers); B200 81.88 and 288.07 (PyTorch) or 71.04 and 223.24 (Diffusers); RTX PRO 6000 Blackwell 489.90 and 2,102.40 (PyTorch) or 217.90 and 735.35 (Diffusers). The page does not state the frame count of the transfer workload.**
- Location: `docs/reference/inference_benchmarks/cosmos3-nano-generator.md`, "Transfer generation" table, commit `0eab578`
- Verdict: NEW (the seed recorded that no Cosmos 3 per-clip timing was published)
- Evidence: https://raw.githubusercontent.com/NVIDIA/cosmos/0eab578a8935e26aa41c2b7dc9f5ab00f790a037/docs/reference/inference_benchmarks/cosmos3-nano-generator.md | Tier 1, first-party docs | benchmark claim (vendor reported) | rows "| GPU | Transfer control | Engine | GPUs | 256p | 480p | 720p |": "**H100 80GB HBM3** | edge | PyTorch | 1 | 23.36 | 148.65 | 527.89" / "Diffusers | 1 | 21.28 | 132.06 | 447.24"; "**B200** | edge | PyTorch | 1 | 13.52 | 81.88 | 288.07" / "Diffusers | 1 | 12.76 | 71.04 | 223.24"; "**RTX PRO 6000 Blackwell** | edge | PyTorch | 1 | 48.48 | 489.90 | 2102.40" / "Diffusers | 1 | 31.25 | 217.90 | 735.35" (accessed 2026-11-20). The methodology page says "Action rollout lengths, action chunks, and transfer inputs are separate workload dimensions" and "equal model, GPU, and resolution labels alone do not establish an identical workload"; it gives the frame count only for NIM transfer rows ("Transfer uses 25 frames and 50 steps"). So seconds per second of video cannot be derived for the PyTorch and Diffusers rows (U14).
- Use in dive: section 11, the current per-clip cost: minutes of GPU time per clip, and a 1.8 to 2 times gap between H100 and B200. Do not convert to "per hour of video" until the frame count is known.

**F05-98. [vendor claim] For plain text-to-video with Cosmos3-Nano (189 frames at 24 fps, one GPU, PyTorch), a clip takes 59.83 s at 480p and 207.78 s at 720p on an H100 80GB, 33.20 s and 114.85 s on a B200, and 180.81 s and 786.37 s on an RTX PRO 6000 Blackwell.**
- Location: `docs/reference/inference_benchmarks/cosmos3-nano-generator.md`, "Text-to-Video (t2v)" table; `benchmark_methodology.md`, "Reading a Generator table", commit `0eab578`
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/cosmos/0eab578a8935e26aa41c2b7dc9f5ab00f790a037/docs/reference/inference_benchmarks/cosmos3-nano-generator.md | Tier 1, first-party docs | benchmark claim (vendor reported) | "**RTX PRO 6000 Blackwell** | PyTorch | 1 | 13.95 | 180.81 | 786.37" / "**H100 80GB HBM3** | PyTorch | 1 | 7.61 | 59.83 | 207.78" / "**B200** | PyTorch | 1 | 4.56 | 33.20 | 114.85"; methodology: "Nano and Super primary video workloads use 189 frames at 24 FPS." and "Every value is seconds." (accessed 2026-11-20). [derived] 189 frames / 24 fps = 7.875 s of video; H100 at 480p: 59.83 / 7.875 = 7.6 GPU-seconds per second of video; B200: 4.2; RTX PRO 6000: 23.0. Per hour of 480p video on an H100: 7.6 x 3,600 = 27,350 GPU-seconds = 7.6 GPU-hours.
- Use in dive: section 11, the one Cosmos 3 figure that converts to a rate, and the comparison that carries the section: generating an hour of video costs GPU-hours, where curating an hour costs GPU-minutes (F05-78) and recording it costs one person-hour.

**F05-99. (Superseded model, kept for the memory figure.) [vendor claim] Cosmos-Transfer2.5-2B needs 65.4 GB of GPU memory on one GPU and takes 92.25 s on a B200, 264.13 s on an H100 PCIe and 445.52 s on an H100 NVL to generate a 93-frame chunk of 720p video at 16 fps with a segmentation control.**
- Location: `nvidia-cosmos/cosmos-transfer2.5`, `docs/inference.md` lines 11-30, commit `2ff49d0717af02057ae79bc75c00fbff9da1b4e7` (2026-06-07)
- Verdict: STALE (superseded by Cosmos 3, F05-95; figures re-fetched and unchanged from seed 02 section 4.3 and seed 11)
- Evidence: https://raw.githubusercontent.com/nvidia-cosmos/cosmos-transfer2.5/2ff49d0717af02057ae79bc75c00fbff9da1b4e7/docs/inference.md | Tier 1, first-party docs | benchmark claim (vendor reported) | "| Cosmos-Transfer2.5-2B | 65.4 GB |" / "| NVIDIA B200 | 92.25 sec | 186.92 |" / "| NVIDIA H100 NVL | 445.52 sec | 895.33 |" / "| NVIDIA H100 PCIe | 264.13 sec | 533.58 |" / "\* Generation times are listed for 720P video with 16FPS with segmentation control input and disabled guardrails." (accessed 2026-11-20). [derived] 93 frames / 16 fps = 5.8 s of video; 92.25 / 5.8 = 15.9 GPU-seconds per video-second on a B200. No equivalent single-GPU memory figure for Cosmos3-Nano was located in the Cosmos 3 reference pages read (U15).
- Use in dive: section 11, history only, unless the page keeps one memory figure to show why a 24 GB or 48 GB card is not enough for this class of model.

**F05-100. Isaac Lab's own tutorial for restyling simulated demonstrations still uses the 2025 model, Cosmos Transfer1, pinned by commit, at Isaac Lab v3.0.0. The steps are: generate demonstrations with extra camera outputs (segmentation, depth, normals), convert them to MP4, run the transfer model, and train on the mix.**
- Location: `docs/source/features/imitation-learning/augmented_imitation.rst` lines 6-25 and 139-151, tag v3.0.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/isaac-sim/IsaacLab/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/features/imitation-learning/augmented_imitation.rst | Tier 1, first-party docs | documentation of support | "Use `Cosmos <https://www.nvidia.com/en-us/ai/cosmos/>`_ to add visual variation to Isaac Lab demonstrations, then train visuomotor policies on the augmented data." / "The `Cosmos Transfer1 <https://github.com/nvidia-cosmos/cosmos-transfer1/tree/e4055e39ee9c53165e85275bdab84ed20909714a>`_ model used in this tutorial is `supported ...` on Ampere and Hopper GPUs." / "Visual augmentation can include changes to lighting, textures, backgrounds, and other visual elements while preserving the original motion and actions." (accessed 2026-11-20)
- Use in dive: section 11, the pipeline shape for kind 3 on top of kind 2, and a freshness warning: the documented recipe lags the current model by two generations.

**F05-101. DreamGen (GR00T-Dreams) is the other generative route: instead of restyling existing episodes it has a video model invent new ones. Four steps: fine-tune a video world model on the target robot, prompt it with a first frame and an instruction to generate videos, recover the actions from the videos with an inverse-dynamics or latent-action model, and train the policy on the resulting "neural trajectories".**
- Location: arXiv 2505.12705v2, section 1 (the 4-step recipe)
- Verdict: CARRIED (seed 02 section 4.2, re-fetched; v2 is the latest version listed)
- Evidence: https://arxiv.org/abs/2505.12705v2 | Tier 3, preprint | definition | "(1) We fine-tune video world models on a target robot to capture the dynamics and kinematics of the specific embodiment; (2) we prompt the model with pairs of initial frames and language instructions to generate large volumes of robot videos, capturing both familiar behaviors from fine-tuning and novel ones in unseen settings; (3) we then extract pseudo-actions using either a latent action model [13] or an inverse dynamics model (IDM)[14]; (4) finally, we use the resulting video-action sequence pairs, dubbed neural trajectories, for training downstream visuomotor policies." (accessed 2026-11-20)
- Use in dive: section 11, the mechanism of generated episodes: video first, actions inferred afterwards. An inverse-dynamics model is a network that looks at two frames and outputs the action that happened between them.

**F05-102. [author reported] DreamGen was tested on the SO-100, the SO-101's predecessor: with 10 and 13 real demonstrations per task plus 40 and 50 generated ones, average success on two SO-100 tasks rose from 21% to 45.5%.**
- Location: arXiv 2505.12705v2, section 1 and section 4 ("Real-world Experiments")
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2505.12705v2 | Tier 3, preprint | benchmark claim (author reported) | "from 37% to 46.4% on average of 4 GR1 humanoid tasks, 23% to 37% on average of 3 Franka tasks, and from 21% to 45.5% on average of 2 SO-100 tasks, all using just 10 to 13 real-world trajectories per task." and "For the two SO-100 tasks, we collect 40 and 50 trajectories for the strawberry pick-and-place and tic-tac-toe tasks, respectively. ... 25% of the collected trajectories for SO-100 tasks (10 and 13 trajectories per task). We generate ... 40 and 50 neural trajectories for the two SO-100 tasks, respectively, to co-train with real-world trajectories with a 1:1 sampling ratio." (accessed 2026-11-20)
- Use in dive: section 11, the worked example on the arm: a published result on the same class of arm and a pick-and-place task.

**F05-103. [author reported] DreamGen's published GPU bill: generating 240,000 neural trajectories for the RoboCasa benchmark took 54 hours on 1,500 NVIDIA L40 GPUs.**
- Location: arXiv 2505.12705v2, limitations paragraph of the conclusion
- Verdict: CARRIED (seed 02 section 4.2, re-fetched)
- Evidence: https://arxiv.org/abs/2505.12705v2 | Tier 3, preprint | production report (author reported) | "DreamGen currently requires significant compute. For instance, generating the 240k-sample RoboCasa dataset took 54 hours on 1500 NVIDIA L40 GPUs." (accessed 2026-11-20). [derived] 54 x 1,500 = 81,000 L40 GPU-hours; 81,000 / 240,000 = 0.34 GPU-hours, about 20 GPU-minutes, per trajectory.
- Use in dive: section 11, the cost line for generated episodes: about 20 GPU-minutes each on a 48 GB card, against seconds each for simulation replay (F05-91: about 1.1 GPU-seconds per demonstration on the easy task).

**F05-104. AWS's reference for running this on its services (2026-09-04) describes a four-stage loop on SageMaker HyperPod: ingest and curate real data into Amazon S3 and FSx for Lustre, have a Cosmos3-Super "teacher" generate synthetic data, post-train a Cosmos3-Nano policy on the mix, and evaluate in closed-loop simulation. All its workloads run on p5en.48xlarge nodes (8 H200 each).**
- Location: AWS Machine Learning Blog, "Build a Physical AI model factory with NVIDIA Cosmos 3 on SageMaker HyperPod", 04 SEP 2026, sections 2 and 3
- Verdict: CARRIED (seed 02 section 4.3 named the post; re-fetched)
- Evidence: https://aws.amazon.com/blogs/machine-learning/build-a-physical-ai-model-factory-with-nvidia-cosmos-3-on-sagemaker-hyperpod/ | Tier 2, first-party blog | documentation of support | "(1) Ingest and curate real-world Physical AI data (DROID, BridgeData2, AV sensor logs) into a shared corpus on Amazon Simple Storage Service (Amazon S3) and Amazon FSx for Lustre. (2) A Cosmos3-Super teacher generates synthetic data to augment that corpus. (3) The combined synthetic and real corpus post-trains a deployable Cosmos3-Nano policy" and "All three run end-to-end on p5en.48xlarge (8x NVIDIA H200 GPUs) nodes with real checkpoints." (accessed 2026-11-20). The post was searched for "Ray" and "Curator": neither word occurs, so it is not a source for a Ray-based curation pipeline on HyperPod (U16).
- Use in dive: section 11, the pointer to the AWS-side reference; the AWS stream owns the detail.

### H. What each stage loads on the machine

Each entry here is [our reading]: a join of entries above, with no new source.

**F05-105. Collection loads CPU cores on the machine next to the robot. The default codec is a software encoder (F05-35, F05-38); with streaming encoding the encoder threads share the CPU with the control loop (F05-44); a machine without a hardware encoder, such as the Jetson Orin Nano (F05-57), has no way to move that work off the CPU; a machine with one can do so only by giving up AV1 (F05-42, F05-55).**
- Location: synthesis of F05-35, F05-38, F05-42, F05-44, F05-45, F05-55, F05-57
- Verdict: NEW
- Evidence: entries listed | Tier 1 inputs, synthesis ours | [our reading] | The measured encode load for two 640x480 cameras at 30 fps is 55 million pixel-values per second, the lightest row of LeRobot's table (F05-45). No published CPU-utilisation figure for that row was located; the dive's own measurement on the Orin Nano and the DGX Spark would be Tier 0.
- Use in dive: section 9, the "which part of the machine" line for collection: CPU (encode), storage write under 1 GB per hour (F05-30), no GPU tensor work.

**F05-106. Processing and curation load three different parts. Decode and transcode load CPU cores, or the GPU's separate decode engines where the card has them for the codec (F05-67, F05-71, F05-77). Filtering, embedding and captioning load GPU tensor cores, with small models sharing a card four to a GPU (F05-71). Getting clips to the models loads storage and network, and that is what starved 32 H100s to 17% utilisation in the one run NVIDIA reports (F05-76).**
- Location: synthesis of F05-67, F05-69 to F05-71, F05-76 to F05-79
- Verdict: NEW
- Evidence: entries listed | Tier 1 and Tier 2 inputs, synthesis ours | [our reading] | Published scale: about 195 GPU-seconds per video-hour on H100 for a 2025 predecessor pipeline at 720p (F05-78). For the arm dataset of 6.6 minutes (F05-29): 0.11 h x 195 s = 22 GPU-seconds [derived, and an extrapolation three orders of magnitude below the scale the figure was measured at].
- Use in dive: section 10, the per-stage hardware table: CPU, decode engines, tensor cores, storage and network, each with one entry ID.

**F05-107. Training-time decode and image augmentation load CPU cores in the dataloader workers by default, since LeRobot decodes with torchcodec on the CPU (F05-39) and augments in the workers (F05-87). The fixed ratio of 24 vCPUs per GPU on most eight-GPU EC2 sizes (F05-65) is then the ceiling on frames per second per GPU. Moving augmentation to the GPU (F05-59) and choosing a single-GPU size with more vCPUs (F05-66) are the two levers the sources document.**
- Location: synthesis of F05-37, F05-39, F05-41, F05-58 to F05-62, F05-65, F05-66, F05-87
- Verdict: NEW
- Evidence: entries listed | Tier 1 and Tier 2 inputs, synthesis ours | [our reading] | No first-party measurement of frames decoded per second per CPU core for AV1 at 640x480 on a named EC2 CPU was located (U5). The closest is 5.16 ms per two-camera item on unstated hardware (F05-62).
- Use in dive: section 10, "why decode can bound training" in one paragraph, and the hand-off to the dive's own decode benchmark.

**F05-108. Augmentation loads a different part for each kind. Image transforms: CPU cores, or GPU tensor cores plus a few GB of GPU memory (F05-87). Demonstration multiplication: a simulator, so GPU memory per parallel environment and, when cameras are rendered, the GPU's rendering path; 15 minutes without cameras against 1 hour with them for the same 1,000 demonstrations (F05-90, F05-92). Generative augmentation: GPU tensor cores and tens of GB of GPU memory for minutes per clip (F05-97 to F05-99, F05-103).**
- Location: synthesis of F05-87, F05-90 to F05-92, F05-97 to F05-99, F05-103
- Verdict: NEW
- Evidence: entries listed | Tier 1 and Tier 3 inputs, synthesis ours | [our reading] | Order-of-magnitude ladder per added episode [derived from the entries]: image transform, milliseconds of CPU; simulated replay, about 1 to 36 GPU-seconds (3,160 down to 100 demonstrations per GPU-hour, F05-91); generated video, about 20 GPU-minutes (F05-103).
- Use in dive: section 11, the closing comparison table: three kinds, three parts of the machine, three orders of magnitude in cost.

## 5. Teaching material

Toy numbers are marked [illustration]. The toy dataset used in all three sections: 50 episodes of 30 s at 30 fps from two 640x480 cameras [illustration; the 50 episodes, 30 fps and 640x480 are real defaults or real dataset values, F05-2, F05-5, F05-23; the 30 s length is invented, and the public dataset's episodes average 11,939 / 50 = 239 frames, about 8 s, F05-29].

### Section 9, Collecting Data

**The plain-words idea.** A robot learns the block-in-cup task from recordings of the task being done. A recording, called an episode, is a table with one row per tick of the control loop (30 per second): where each of the six joints was, where each joint was told to go, and one picture from each camera. A person produces the episodes by moving a second, hand-driven arm (the leader) while the robot arm (the follower) copies it (F05-1, F05-23). Everything else in the section is about getting more such tables for less human time: recording without a robot through a hand-held gripper (F05-7 to F05-10), or with wearable devices and head cameras on people (F05-12, F05-13).

**Worked example on the arm task.**
- Rows: 50 episodes x 30 s x 30 ticks/s = 45,000 rows. Camera frames: 45,000 x 2 = 90,000 [derived].
- One row of numbers: 6 joint targets + 6 joint readings as float32, plus five bookkeeping columns (F05-22, F05-23). In the public dataset this compresses to about 31 bytes per row (F05-30), so 45,000 rows are about 1.4 MB [derived].
- One camera frame uncompressed: 640 x 480 x 3 = 921,600 bytes. 90,000 frames = 82.9 GB [derived].
- The same frames as AV1 at the public dataset's measured 3,588 bytes per frame (F05-30): 90,000 x 3,588 = 323 MB [derived; the encoder settings behind that figure are not recorded, U1].
- Human time: 25 minutes of robot motion. With the recorder's default 60 s reset between episodes (F05-2), add 50 minutes: about 75 minutes in total [derived from the defaults; real sessions vary].
- The lesson of the numbers: the pictures are 99.9998% of the raw bytes (82.9 GB against 1.4 MB), which is why the format treats video and numbers separately and why the codec is the design decision that matters.

**The mechanism.**
1. Each tick, the recorder reads the follower's joints, the leader's joints (they become the action) and one frame per camera, and calls `dataset.add_frame` (F05-3).
2. The frame's time is computed, `timestamp = frame_index / fps`, with `frame_index` counting ticks inside the episode and `fps` the nominal rate. It is not read from a clock, so a loop that ran slow produces a dataset that plays fast (F05-4).
3. At the end of the episode `save_episode()` appends the rows to the current Parquet file and the frames to the current MP4 per camera, and writes one metadata row saying where the episode sits: file indices, first and last global row, and for each camera the start and end time inside the shared MP4 (F05-17, F05-19, F05-24).
4. Video: by default frames are written as PNG during the episode and encoded afterwards; with streaming encoding they go to an encoder thread during capture (F05-44). The encoder is SVT-AV1 in software with a keyframe every 2 frames (F05-35, F05-36).
5. `finalize()` closes the Parquet files; then the upload (F05-3).
6. To read frame `i` of episode `e` from camera `c` later: `seek_time = timestamp(i) + from_timestamp(e, c)`, where `from_timestamp(e, c)` is the offset of episode `e` inside camera `c`'s shared MP4 (F05-25).

**What it costs in compute.**
- CPU, on the machine beside the robot: software AV1 encode of 2 x 640 x 480 x 30 = 18.4 million pixels per second, which LeRobot's docs count as 55 million pixel-values per second and rate "Low" (F05-45). No published CPU percentage was located.
- Video encode engines: usable only by leaving AV1, since LeRobot's hardware list is H.264 and HEVC (F05-42). The Jetson Orin Nano has none (F05-57); Thor has H.264 and HEVC (F05-55); the DGX Spark has one engine with AV1 (F05-56), which LeRobot's list does not use.
- Storage: under 1 GB per robot-hour for two cameras (775 MB per hour in the public dataset, F05-30).
- GPU tensor cores: none, unless a policy drives the robot during correction collection (F05-6).
- At fleet scale the load moves to CPU farms: Generalist reports about 10,000 CPU cores of continuous processing (F05-11) [vendor claim].
- Money: the one price list located is a vendor's own, $28 to $60 per teleoperation hour against $15 to $40 for egocentric video (F05-15) [vendor claim].

### Section 10, Processing and Curating

**The plain-words idea.** Recorded data is not ready to train on. Three things happen to it first. The video has to be turned back into pictures every time training asks for a frame (decoding). The numbers have to be summarised so the model sees inputs on a common scale (statistics). And the episodes have to be checked: failed attempts, hesitations and near-copies are removed or weighted down (curation). On a 50-episode dataset one person does the last step by watching; on a million hours it is a pipeline of small models that score, describe and compare clips.

**Worked example on the arm task.**
- Training defaults: batch size 8, 4 worker processes (F05-61). One training step needs 8 rows x 2 cameras = 16 pictures from random places in the two MP4 files.
- With a keyframe every 2 frames, producing one picture means decoding at most 2 frames, so at most 32 decoded frames per step (F05-36, F05-37) [derived]. With a keyframe every 250 frames (a common streaming-video setting) [illustration] the worst case would be 16 x 250 = 4,000.
- Decode time: about 5.16 ms per two-camera row in one process (F05-62) [author reported, hardware not stated]. 8 rows = 41 ms of CPU work per step; spread over 4 workers, about 10 ms of wall time, a ceiling near 100 steps per second [derived; replace with the dive's own measurement].
- Statistics: for a 900-frame video the sampler takes 900^0.75 = 164 frames (F05-27) [derived; whether the count applies per episode or per file was not checked in code].
- Curation at the published rate: 25 minutes of video x 195 GPU-seconds per video-hour = 81 GPU-seconds on an H100 (F05-78) [derived, and far below the scale that figure was measured at].
- Small-scale curation is one command: `lerobot-edit-dataset` deletes the bad episodes and recomputes statistics (F05-81).

**The mechanism.**
1. Random access. A video codec stores most frames as differences from earlier frames; only keyframes are stored whole. To return frame `t` the decoder seeks to the last keyframe at or before `t` and decodes forward. Cost per requested frame is at most `G` decoded frames, where `G` is the GOP size (frames per keyframe). LeRobot sets `G = 2` and accepts larger files for it (F05-35 to F05-37, F05-63, F05-64).
2. Where decode runs. torchcodec on the CPU, inside the dataloader worker processes; one open decoder per file, cached (F05-39, F05-40). GPU decode inside workers is warned against (F05-41).
3. Normalisation statistics. Mean, standard deviation, min, max and five quantiles per feature, on a sample of frames for images (F05-26, F05-27). The policy subtracts and divides by these; the policy streams own the formula.
4. Large-scale curation pipeline (Cosmos Curator's reference, F05-69): download, decode and split at shot changes, transcode to H.264, filter on motion and aesthetics, embed, caption with a vision-language model, write. CPU stages and GPU stages are separate pools sized so the GPU stages never wait (F05-70, F05-71, F05-79).
5. Deduplication. Each clip becomes a vector (an embedding: a list of numbers placed so that similar clips land near each other). Similarity of clips `a` and `b` is the cosine `cos(a, b) = (a . b) / (|a| |b|)`, where `a . b` is the sum of the element-wise products and `|a|` the length of the vector; 1 means same direction. Clips are clustered with K-Means and near-duplicates inside a cluster are dropped (F05-73; the exact rule is U8).
6. Robot-specific version. Cut episodes into subtasks from the dataset's own metadata, keep video and action together, and embed three ways: the instruction text (384 numbers), the first frame (384 numbers) and the wrist motion (F05-74, F05-75).
7. Quality weighting. A learned progress score from 0 to 1 per frame lets training up-weight frames where the task advances (F05-82).

**What it costs in compute.**
- CPU cores: training-time decode and default image augmentation (F05-39, F05-58). EC2's eight-GPU sizes give 24 vCPUs per GPU, p4d 12, P6e-GB200 36 (F05-65).
- Video decode engines: hardware AV1 decode exists on L4, L40S, A10, RTX PRO 6000 and Blackwell parts, and is absent on T4, A100 and H100 (F05-46 to F05-54, F05-67). LeRobot's default path does not use it (F05-39).
- GPU tensor cores: filters and embedding models at a quarter of a 48 GB GPU each (F05-71); captioning is the heavy stage.
- Storage and network: the one first-party run reported was starved by clip fetching, 17% GPU utilisation on 32 H100s (F05-76).
- Published scale: about 195 GPU-seconds per hour of 720p video on H100 for the 2025 predecessor pipeline, "~1M hours ... on 2k H100 GPUs in one day" (F05-78) [vendor claim]. No figure for v2.x was located (U9).

### Section 11, Augmentation and Synthetic Data

**The plain-words idea.** Fifty episodes show the task under one light, one table, one set of block positions. Augmentation makes more training examples out of the ones recorded, in three ways that differ in what they change and what they cost. Changing the pictures a little (brightness, a small shift) costs almost nothing and teaches the model to ignore such changes. Replaying the recorded motions in a simulator with the block somewhere else produces new, physically checked episodes. Asking a video-generating model to repaint an episode, or to invent one, produces variety in appearance that neither of the others can, at the price of minutes of GPU time per clip.

**Worked example on the arm task.**
- Kind 1, image transforms: each of the 16 pictures in a step gets up to 3 of 6 transforms, for example brightness x 1.1, hue + 0.02, rotation by 3 degrees [illustration inside the default ranges of F05-84]. The joint numbers are untouched. Nothing is written to disk (F05-85).
- Kind 2, multiplication in simulation: record 10 demonstrations in the simulator [illustration]; the tool cuts each into subtasks (reach the block, grasp, carry, release over the cup) and produces 1,000 new ones. Published time for a comparable single-arm task with cameras: about 1 hour on one RTX PRO 6000 Blackwell at a success rate of about 40% (F05-90) [vendor claim; Franka arm, cube stacking]. At 40%, 1,000 kept demonstrations imply about 2,500 attempts [derived, if the 1,000 counts kept demonstrations; our reading]. An SO-101 stacking task ships in Isaac Lab v3.0.0 (F05-93); no timing for it was located.
- Kind 3a, restyle: repaint 50 clips with Cosmos3-Nano transfer at 480p on one H100: 50 x 148.65 s = 2.1 GPU-hours [derived from F05-97; the clip length of that benchmark is not stated, U14].
- Kind 3b, invent: DreamGen's SO-100 experiment used 10 and 13 real demonstrations plus 40 and 50 generated ones and reports 21% to 45.5% average success on two tasks (F05-102) [author reported]. At the paper's RoboCasa rate of 0.34 L40 GPU-hours per trajectory, 50 trajectories would be about 17 GPU-hours (F05-103) [derived, an extrapolation from a different benchmark].

**The mechanism.**
- Kind 1. A transform is a function of the picture only. Brightness: `out = clamp(f x in, 0, 1)` with `f` drawn uniformly from 0.8 to 1.2 for each sample; `in` is the picture tensor of shape (3, 480, 640) with values from 0 to 1, and `clamp` cuts values back into that range. Up to `max_num_transforms = 3` are drawn per sample (F05-84). Runs on CPU in the workers, or on the GPU per batch in chunks of 32 (F05-87).
- Kind 2. Cut each human demonstration at subtask boundaries; for a new scene, move each segment so that it has the same position relative to the object it acts on; stitch the moved segments; run the result in the simulator; keep it only if the success check passes (F05-89). The pose arithmetic (object-relative transform of the gripper path) is in the MimicGen paper and was not extracted here; the section writer should take the formula from arXiv 2310.17596v1 (F05-88). SkillGen replaces the straight-line joins between segments with planned, collision-free motion (F05-92).
- Kind 3a, transfer. Input: a text prompt and a control video derived from the episode (edges, depth or segmentation). Output: a new video with the same geometry and a different look (F05-96). Because the geometry is kept, the recorded joint actions still describe the new video [our reading].
- Kind 3b, generated episodes. Fine-tune a video model on the robot; prompt it with a first frame and an instruction; get a video; run an inverse-dynamics model (two frames in, the action between them out) to label it with actions; train on the result (F05-101).

**What it costs in compute.**
- Kind 1: CPU cores by default; on the GPU, tensor cores and about 2.4 GB of GPU memory at 480x640 for a batch of 160 (F05-87). Reported effect of moving it: ACT trains 2.8 times faster on an H100 (F05-59) [vendor claim].
- Kind 2: a GPU simulator. Easy humanoid task: 1,000 demonstrations in 19 minutes on an RTX 6000 Ada; hard task with cameras: 10 hours (F05-91). GPU memory per parallel environment selects the card: about 9.5 GB for one SkillGen environment, about 22 GB for five (F05-92). With cameras the renderer is the bound: 15 minutes without, 1 hour with (F05-90).
- Kind 3: GPU tensor cores and large GPU memory. Cosmos3-Nano text-to-video at 480p: 7.6 GPU-seconds per second of video on an H100, 4.2 on a B200, 23.0 on an RTX PRO 6000 Blackwell (F05-98) [derived from vendor figures]. Cosmos3-Super is listed for H200, B200 and GB200 (F05-95). The retired Transfer2.5 model needed 65.4 GB on one GPU (F05-99). DreamGen: 81,000 L40 GPU-hours for 240,000 trajectories (F05-103).
- The ladder per added episode: milliseconds of CPU, then seconds of GPU, then tens of GPU-minutes (F05-108).

## 6. Stale or wrong in the seed research

| Seed file | Seed claim | What the source says now | Entry |
|---|---|---|---|
| seed 02 section 2.3, seed 11 | "about 195 GPU-seconds per hour of 720p video in NVIDIA's curator", read as Cosmos Curator | The figure is from a March 2025 post about "NeMo Video Curator" on DGX Cloud. Cosmos Curator v2.10.0 publishes no throughput figure that this research located | F05-78, U9 |
| seed 02 section 2.3 | curation pipeline of five stages | the current reference pipeline lists seven, with CPU and GPU stages split on purpose | F05-69, F05-70 |
| seed 11, phase 2 | "V-JEPA 2 ViT-L embed" for deduplication | A design choice of the seed, not a source claim. The tools as shipped use InternVideo2 or Cosmos-Embed1 (classic pipeline) and BGE-small, DINOv2-small and an action embedding (robot recipe) | F05-72, F05-75 |
| seed 02 section 1.2 | Generalist "500,000+ hours appears only in secondary commentary" | First-party since 2026-04-02: "over half a million hours" in the GEN-1 post | F05-12 |
| seed 02 section 2.2 | GOP size 2 taken from a secondary summary | Confirmed in code at v0.7.0: `g: int | None = 2`, with CRF 30 and `libsvtav1` | F05-35 |
| seed 02 section 2.2 table | hardware codec table without an H200 row, P5e/P5en treated like P5 | The NVIDIA matrix has no H200 row today; H200 decode support is UNKNOWN | F05-49, F05-67, U2 |
| seed 02 section 2.2 | EC2 families up to G7e | The EC2 page also lists G7 with the RTX PRO 4500 (32 GiB) | F05-66 |
| seed 02 section 4.3 | no per-clip timing published for Cosmos 3 | The Cosmos repository now has benchmark pages with seconds per clip by GPU, engine and resolution | F05-97, F05-98 |
| seed 11, augmentation kind 3 | Cosmos Transfer 2.5 "needs 65.4 GB VRAM and takes 92 s (B200) vs 446 s (H100)" as the current figure | Figures unchanged, model retired ("no longer under active development"). Also two H100 rows exist: 445.52 s is the H100 NVL, the H100 PCIe takes 264.13 s | F05-95, F05-99 |
| seed 11, augmentation kind 1 | "colour jitter, sharpness, affine" from memory | Confirmed with ranges; v0.7.0 adds eight robot-camera transforms and a GPU backend | F05-84, F05-86, F05-87 |
| seed 11, augmentation kind 2 | "1,000 demos in 19 minutes on one RTX 6000 Ada for an easy task" | Still in the v3.0.0 docs. It is a humanoid task at 80% success; the current single-arm figure is 15 minutes (state) or 1 hour (cameras) on an RTX PRO 6000 Blackwell at about 40% | F05-90, F05-91 |
| seed 02 section 4.1 | Isaac Lab v3.0.0 release year inferred | Confirmed: 2026-10-20 from the releases API | section 2 |
| seed 02 section 4 | GR00T-Mimic blueprint as a current reference | Last commit 2025-05-20; pins Isaac Lab 2.0.2 and Cosmos Transfer1 | F05-94 |
| seed 02 sections 1 and 2 | "Ray on EKS" proposed for curation (the seed's own mapping); this stream's task also expected an AWS post on Ray on HyperPod among the seed's sources | No such post was found in seed 02 or seed 11, and the AWS Cosmos 3 post does not mention Ray or a curator. No AWS source for a Ray-based curation pipeline was located in this research | F05-104, U16 |

## 7. Mental models worth teaching

1. **A robot dataset is a table with two video columns.** One row per control tick; the numbers are tiny, the pictures are almost all the bytes (1.4 MB against 82.9 GB raw in the toy dataset). Everything in the format follows from handling the two differently. (F05-17, F05-23, F05-30)
2. **Episodes are an index, files are containers.** Many episodes share one Parquet file and one MP4; a metadata row per episode holds the offsets. Fewer, larger files suit object storage and streaming. (F05-19, F05-24, F05-25, F05-32)
3. **Training watches video the wrong way round.** A viewer plays frames in order; training asks for a few frames at random places. A keyframe every 2 frames trades file size for cheap random access. (F05-36, F05-37, F05-63, F05-64)
4. **The video engine is a separate part of the GPU, and the big training cards mostly lack it.** A100, H100 and Blackwell parts have no encoder; A100 and H100 cannot hardware-decode AV1; L4, L40S and RTX PRO 6000 do both. This is one reason a pipeline uses G-family cards for data work. (F05-46 to F05-52, F05-67)
5. **Decode is CPU work inside the training job, and EC2 fixes the CPU per GPU.** 24 vCPUs per GPU on most eight-GPU sizes. When the workers cannot keep up, "the GPU ends up waiting for data". (F05-39, F05-58, F05-65, F05-107)
6. **Curation is a chain of CPU stages feeding GPU stages, and the chain is as fast as its slowest link.** One first-party run had 32 H100s at 17% utilisation because fetching clips was the slow link. (F05-70, F05-76, F05-79)
7. **For robots, a duplicate is judged on three things: what was asked, what it looked like, how the wrist moved.** Text, first-frame and action embeddings, small models, no video model. (F05-74, F05-75)
8. **Three kinds of augmentation change three different things.** Image transforms change pixels and keep everything else. Simulation replay changes the scene and the motion and checks the result with physics. Generation changes the look (transfer) or invents the episode (DreamGen) and checks nothing. (F05-84, F05-89, F05-96, F05-101)
9. **Each kind costs about a thousand times the one before, per added episode.** Milliseconds of CPU; 1 to 36 GPU-seconds; about 20 GPU-minutes. (F05-91, F05-103, F05-108)
10. **Collection is priced in human hours, everything after it in machine hours.** UMI's contribution was to cut the human hour's cost by removing the robot; fleets and wearables push the same lever. (F05-7, F05-8, F05-12, F05-15)

## 8. Contradictions between sources

1. **AV1 "smallest files" against LeRobot's own 2024 benchmark.** The v0.7.0 docs rank `libsvtav1` as the smallest output (F05-43). The 2024 benchmark table that justified the default shows AV1 at GOP 2 and CRF 30 producing a larger file than x264 and x265 at the same nominal settings (5.59% of the image size against 2.14% and 1.38%), and AV1 being chosen for load time and quality (F05-63). CRF values are not comparable across codecs, so the two statements can both hold; the dive should say AV1 was chosen for decode behaviour at small GOP, and avoid a bare "smallest".
2. **Video file size target: 200 MB or 500 MB.** Code default at v0.7.0 is 200 MB (F05-20); the public SO-101 dataset's `info.json` records 500 (F05-23). The dataset predates the release; the default changed. Code at the tag is the authority for new recordings.
3. **Hardware decode: the support matrix against the tool builders.** NVIDIA's matrix presents NVDEC engines as the decode path (F05-46 to F05-54). Cosmos Curator's own design notes say FFmpeg GPU decode was no faster than FFmpeg on the CPU and prefer a different library (F05-77), and LeRobot decodes on the CPU and warns against GPU decode in workers (F05-39, F05-41). Having the engine and benefiting from it are separate claims.
4. **"Cosmos 3 is current" against the tutorials that use Cosmos.** The Cosmos repositories retire Transfer2.5 (F05-95); Isaac Lab v3.0.0's augmentation tutorial pins Transfer1 (F05-100); the GR00T-Mimic blueprint pins Transfer1 with Isaac Lab 2.0.2 (F05-94). A reader following the documented recipe runs a model two generations old.
5. **Dataset name against its metadata.** `lerobot/svla_so101_pickplace` records `"robot_type": "so100_follower"` (F05-23). Not a conflict in substance (one follower class serves both arms) but the page should not present the file as proof of an SO-101 recording.
6. **Two H100 figures for the same Transfer2.5 clip.** 445.52 s (H100 NVL) and 264.13 s (H100 PCIe) in one table (F05-99). The seed quoted the slower one as "H100". The source gives no reason for the gap.
7. **How many demonstrations are enough.** LeRobot advises at least 50 episodes (F05-5); DreamGen reports gains from 10 to 13 real ones plus generated data (F05-102). Different methods, different base models, both author statements; the dive should not turn either into a threshold.

## 9. UNKNOWN register

| ID | Unknown | Where it arises | What would close it |
|---|---|---|---|
| U1 | Encoder settings (GOP, CRF, preset) behind the public SO-101 dataset's bytes; so the 3,588 bytes per frame is a measurement of one dataset, not of the v0.7.0 defaults | F05-29, F05-30 | Run `ffprobe` on the two MP4 files, or record at v0.7.0 defaults (Tier 0) |
| U2 | H200 video engines and AV1 decode: no H200 row in NVIDIA's matrix today | F05-49, F05-67 | A first-party H200 page or an `nvidia-smi` and decode test on a P5e/P5en |
| U3 | Whether the matrix's "A10" row applies to the A10G in EC2 G5 | F05-54, F05-67 | NVIDIA or AWS statement on A10G engines, or a decode test on G5 |
| U4 | Jetson Orin Nano hardware decode codecs from a first-party page; release date of Jetson Linux 39.2.2 | F05-57, section 2 | The Jetson Linux multimedia page for Orin; the release notes |
| U5 | Frames decoded per second per CPU core for AV1 640x480 at GOP 2 on a named CPU | F05-62, F05-107 | The dive's own decode benchmark (Tier 0) on Graviton, Intel and the Spark |
| U6 | A converter for LeRobot datasets older than v2.1 | F05-28 | Read older release tags for a v2.0 to v2.1 script |
| U7 | FastUMI-100K collection calendar time; the HiFi-UMI report (arXiv 2607.25895) and the other 2026 hand-held rig papers found by search only (YUBI 2606.10244, OmniUMI 2604.10647, TacUMI 2601.14550, UMI-3D 2604.14089) were not read | F05-9, F05-10 | Fetch each paper at its latest version |
| U8 | The exact rule behind Cosmos Curator's dedup epsilon | F05-73 | Read the dedup stage code at v2.10.0 |
| U9 | A throughput figure (GPU-seconds per video-hour) for Cosmos Curator v2.x or for the robot recipes | F05-78, F05-106 | A current NVIDIA benchmark, or a measured run |
| U10 | NeMo Curator's video hardware requirements at v1.4.0 | F05-80 | Fetch the requirements page for the current release |
| U11 | The paper behind LeRobot's progress-score reward model (SARM) | F05-82 | Fetch the paper named in `sarm.mdx` |
| U12 | Whether Isaac Lab v3.0.0 registers a Mimic environment for the SO-101 stacking task, and its generation time | F05-93 | Read the task registration files at the tag; the simulator stream may already have this |
| U13 | A maintained successor to the GR00T-Mimic blueprint | F05-94 | Search NVIDIA's blueprint catalogue and Isaac GR00T repositories |
| U14 | Frame count of the Cosmos3-Nano transfer benchmark rows for PyTorch and Diffusers, so transfer cannot be stated per second of video | F05-97 | The benchmark scripts in the Cosmos repository |
| U15 | GPU memory needed by Cosmos3-Nano and Cosmos3-Super on one GPU | F05-95, F05-99 | The Cosmos 3 model cards on the hub, not read |
| U16 | An AWS first-party source for Ray-based curation on HyperPod or EKS for robot video | F05-104 | Search AWS blogs and samples; the AWS stream may own it |
| U17 | Newest NVIDIA DALI release and whether it decodes AV1 on the GPU for training | section 2 | DALI release notes and supported-formats page |
| U18 | A per-hour teleoperation cost published by a lab (as against a vendor price list) | F05-15 | None located; likely stays open |
| U19 | CPU utilisation of SVT-AV1 at two 640x480 cameras, 30 fps, on the Orin Nano and the DGX Spark | F05-45, F05-105 | The dive's own recording test (Tier 0) |

## 10. Reading path for Carlos

1. **LeRobot `docs/source/lerobot-dataset-v3.mdx` at v0.7.0**, top to the "Image transforms" heading (about 180 lines). The whole format in one read: three kinds of content, shared files, the directory tree. https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/lerobot-dataset-v3.mdx
2. **`meta/info.json` of `lerobot/svla_so101_pickplace`** (one screen). A real SO-101 two-camera dataset's schema: the six joint names, the two video features, the codec. https://huggingface.co/datasets/lerobot/svla_so101_pickplace/resolve/f641879e22172be7e8161d5e6c1503c2d2feb657/meta/info.json
3. **LeRobot `benchmarks/video/README.md` at v0.4.0**, the introduction and the results table. Why GOP 2 and AV1: the access pattern argument in the authors' words (history, 2024). https://raw.githubusercontent.com/huggingface/lerobot/f25ac02e6c8fa9c467ab8462289e5f4aed3a2e85/benchmarks/video/README.md
4. **NVIDIA video encode and decode support matrix**, "Data Center" and "Jetson / IGX" tabs: find A100, H100, B200, L4, L40S, RTX PRO 6000 and Thor, and read the NVENC count and the AV1 columns. Ten minutes that explain why data work goes to G-family cards. https://developer.nvidia.com/video-encode-decode-support-matrix
5. **LeRobot `docs/source/streaming_video_encoding.mdx` at v0.7.0**, the load table. What recording costs the CPU beside the robot. https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/streaming_video_encoding.mdx
6. **Cosmos Curator `docs/curator/reference/video-pipelines.md` at v2.10.0**, the split-annotate stage list and its resource table. The shape of large-scale curation: which stage is CPU, which is a quarter of a GPU. https://raw.githubusercontent.com/NVIDIA/cosmos-curator/95675431e309fd86c1c559a39fcb694ddedaa2a9/docs/curator/reference/video-pipelines.md
7. **Cosmos Curator `docs/curator/design/curator-next-embeddings.md`**, the three-embedding section. How a robot clip is compared with another. https://raw.githubusercontent.com/NVIDIA/cosmos-curator/95675431e309fd86c1c559a39fcb694ddedaa2a9/docs/curator/design/curator-next-embeddings.md
8. **Isaac Lab `teleop_imitation.rst` at v3.0.0**, from "Generating additional demonstrations" to the results note. Demonstration multiplication end to end with timings on a single arm. https://raw.githubusercontent.com/isaac-sim/IsaacLab/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/features/imitation-learning/teleop_imitation.rst
9. **DreamGen, arXiv 2505.12705v2**, section 1 (the four steps), the real-robot experiments paragraph on SO-100, and the limitations paragraph (the GPU bill). https://arxiv.org/abs/2505.12705v2
10. **Cosmos 3 `docs/reference/models.md` and the Nano benchmark page.** The workflow table (what "transfer" takes and returns) and seconds per clip by GPU. https://raw.githubusercontent.com/NVIDIA/cosmos/0eab578a8935e26aa41c2b7dc9f5ab00f790a037/docs/reference/models.md
11. **UMI, arXiv 2402.10329v3**, figure 1 and the data-collection throughput paragraph (history). Why taking the robot out of collection mattered. https://arxiv.org/abs/2402.10329v3

## 11. Source list by tier

### Tier 1: code at pinned refs, official docs, API responses, vendor matrices

- huggingface/lerobot at v0.7.0, `410c095eacc0011d998a73383eb94abed2715af0`: https://github.com/huggingface/lerobot/tree/410c095eacc0011d998a73383eb94abed2715af0 (files in section 3)
- huggingface/lerobot at v0.4.0, `f25ac02e6c8fa9c467ab8462289e5f4aed3a2e85`, `benchmarks/video/README.md` (history)
- huggingface/lerobot default-branch head `039e05183f38b02d28c5f6ac9dbc7ef1680728cd`: https://github.com/huggingface/lerobot (format version constant)
- Hub dataset `lerobot/svla_so101_pickplace` at `f641879e22172be7e8161d5e6c1503c2d2feb657`: `meta/info.json` and file listing
- NVIDIA/cosmos-curator at v2.10.0, `95675431e309fd86c1c559a39fcb694ddedaa2a9`: https://github.com/NVIDIA/cosmos-curator/tree/95675431e309fd86c1c559a39fcb694ddedaa2a9
- NVIDIA-NeMo/Curator at v1.4.0, `10fba1ea785863872ae6983b580ec6813e72cc79`, `README.md`
- isaac-sim/IsaacLab at v3.0.0, `e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4`: https://github.com/isaac-sim/IsaacLab/tree/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/features/imitation-learning
- NVIDIA-Omniverse-blueprints/synthetic-manipulation-motion-generation at `be78013710543995b40a3a122294e6ab21699e67`, `README.md`
- NVIDIA/cosmos at `0eab578a8935e26aa41c2b7dc9f5ab00f790a037`: https://github.com/NVIDIA/cosmos/tree/0eab578a8935e26aa41c2b7dc9f5ab00f790a037/docs/reference
- nvidia-cosmos/cosmos-transfer2.5 at `2ff49d0717af02057ae79bc75c00fbff9da1b4e7` and nvidia-cosmos/cosmos-predict2.5 at `a2c298b0a3df3778b973fe65e9e58877b292d8a7`
- NVIDIA video encode and decode GPU support matrix: https://developer.nvidia.com/video-encode-decode-support-matrix
- Jetson Linux Developer Guide r36.5 and r39.2.2, "Software Encode in Orin Nano": https://docs.nvidia.com/jetson/archives/r36.5/DeveloperGuide/SD/Multimedia/SoftwareEncodeInOrinNano.html
- Amazon EC2 accelerated computing instance types: https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html

### Tier 2: first-party blogs, dataset cards, pull requests

- LeRobot v0.7.0 release blog (2026-11-05): https://huggingface.co/blog/lerobot/lerobot-release-v070
- huggingface/lerobot pull request 4549 (open on 2026-11-20): https://github.com/huggingface/lerobot/pull/4549
- NVIDIA Technical Blog, NeMo Video Curator on DGX Cloud (2025-03-18): https://developer.nvidia.com/blog/petabyte-scale-video-processing-with-nvidia-nemo-curator-on-nvidia-dgx-cloud/
- Generalist, GEN-0 (2025-11-04): https://generalistai.com/blog/nov-04-2025-GEN-0 ; GEN-1 (2026-04-02): https://generalistai.com/blog/gen-1
- HiFi-UMI-2K dataset card: https://huggingface.co/datasets/simple-world-lab/HiFi-UMI-2K/blob/a53b7b5784afdd50b2fda9195c9f724ef75ffdaf/README.md
- Egocentric-100K dataset card: https://huggingface.co/datasets/builddotai/Egocentric-100K/blob/fae604b751b25337d6fd8c4c53e595910c28f68f/README.md
- AWS Machine Learning Blog, Cosmos 3 on SageMaker HyperPod (2026-09-04): https://aws.amazon.com/blogs/machine-learning/build-a-physical-ai-model-factory-with-nvidia-cosmos-3-on-sagemaker-hyperpod/
- Dexset, robot training data prices (July 2026; a vendor on its own prices, indicative only): https://dexset.ai/blogs/robot-training-data-costs-pricing-complete-2026/

### Tier 3: papers

- MimicGen, arXiv 2310.17596v1, peer-reviewed (CoRL 2023, per the arXiv comments field); history: https://arxiv.org/abs/2310.17596v1
- UMI, arXiv 2402.10329v3, preprint (venue not confirmed here); history: https://arxiv.org/abs/2402.10329v3
- DreamGen, arXiv 2505.12705v2, preprint: https://arxiv.org/abs/2505.12705v2
- FastUMI-100K, arXiv 2510.08022v1, preprint: https://arxiv.org/abs/2510.08022v1

### Tier 4: used only to locate primary sources

- Web searches for 2026 hand-held data-collection papers and for data-collection price lists. Nothing from a search snippet is cited as fact; the four papers found this way and not read are listed in U7.
