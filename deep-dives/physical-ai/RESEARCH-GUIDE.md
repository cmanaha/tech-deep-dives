# Physical AI: Research Guide

How the research for this dive is organised: the waves and what each answers, the order in which to read the primary
sources, the evidence bar per kind of claim, the open questions, the Tier 0 experiments that the separate profiling
project feeds, and the gates before any app section is written.

Companion to `SCOPE.md`. Bracketed IDs such as (F03-12) point to claim-register entries in `research/2026-11/`.
Dates are absolute. Every source was accessed on 2026-11-20 unless an entry says otherwise.

---

## 1. Where the research stands

As of 2026-11-20: research complete to Gate 1. Nine claim registers hold 915 entries; a refutation and freshness
pass has a verdict on 639 rows; every correction is applied to the registers and to `SCOPE.md`; 155 unknowns are
triaged. No app section exists.

| Register | Feeds sections | Entries | New | Carried from the seed after re-fetch | Wrong or stale in the seed | Unknown (entry level) | Entries with a wave 2 correction | Rows in its UNKNOWN register |
|---|---|---|---|---|---|---|---|---|
| `01-robot-basics.md` | 3 | 92 | 80 | 11 | 0 | 1 | 4 | 15 |
| `02-imitation-and-vla.md` | 4, 5 | 83 | 39 | 43 | 1 | 0 | 6 | 13 |
| `03-world-models-and-jepa.md` | 6, 7 | 120 | 104 | 12 | 3 | 1 | 6 | 17 |
| `04-rl-and-agentic-loops.md` | 8, 19 | 87 | 28 | 58 | 1 | 0 | 3 | 23 |
| `05-data-pipeline.md` | 9 to 11 | 108 | 63 | 43 | 1 | 1 | 3 | 19 |
| `06-simulation-and-sim-to-real.md` | 12 to 14, 16 | 102 | 72 | 30 | 0 | 0 | 1 | 20 |
| `07-edge-and-fleet.md` | 17, 18 | 119 | 68 | 41 | 3 | 7 | 3 | 20 |
| `08-compute-shapes.md` | 20 to 23 | 86 | 77 | 7 | 0 | 2 | 4 | 16 |
| `09-aws-orchestration.md` | 24, 25 | 118 | 51 | 63 | 3 | 1 | 6 | 12 |
| Total | | 915 | 582 | 308 | 12 | 13 | 36 | 155 |

The "wrong or stale in the seed" column counts entries whose own verdict line says so. Each register's section 6
lists every seed claim the fetch changed, 96 rows in all, including the ones corrected inside a carried entry.

Other files: `research/2026-11/wave2-A.md`, `wave2-B.md`, `wave2-C.md` (the refutation pass);
`research/experiments/` (Tier 0 on hand); `sources.md` (by tier); `SCOPE.md` section "Numbers by section" (353
figures, each with its entry ID).

## 2. Research waves

### Wave 0. Seed research (before this dive)

Seven research files, a synthesis, a profiling shortlist, an arm-pipeline story, two PMU cards and a benchmark
report, written between 2026-11-17 and 2026-11-20 for a conference talk on the same subject. Strong on numbers and
AWS patterns, thin on teaching, tier-labelled but without pinned versions or verbatim quotes on every claim. The dive
treats it as a lead list: a seed claim enters a register only after its source was fetched again on 2026-11-20.

### Wave 1. Nine registers, three at a time (2026-11-20)

Shared brief: `research/2026-11/wave1-brief.md`. Each register carries a currency table (newest first-party version
of everything it names, with the release date), pinned sources, numbered entries (claim, location, verdict, evidence
with tier, kind and verbatim quote, use in dive), teaching material for its concept sections, a table of what was
stale or wrong in the seed, mental models, contradictions, an UNKNOWN register, a reading path and a tiered source
list.

| Wave | Register | Sections | Seed |
|---|---|---|---|
| A | `01-robot-basics.md` | 3 | none |
| A | `02-imitation-and-vla.md` | 4, 5 | 01 |
| A | `03-world-models-and-jepa.md` | 6, 7 | thin |
| B | `04-rl-and-agentic-loops.md` | 8, 19 | 01, 05 |
| B | `05-data-pipeline.md` | 9 to 11 | 02 |
| B | `06-simulation-and-sim-to-real.md` | 12 to 14, 16 | 02, 04 |
| C | `07-edge-and-fleet.md` | 17, 18 | 04 |
| C | `08-compute-shapes.md` | 20 to 23 | 08, 10, 11, PMU cards, bench |
| C | `09-aws-orchestration.md` | 24, 25 | 03 |

### Wave 2. Refutation and freshness (2026-11-20)

Brief: `research/2026-11/wave2-brief.md`. Three agents, three registers each, none checking a register it wrote.
Each tries to refute every load-bearing claim at its pinned source and checks that every named version is still the
newest. One verdict row per claim: HOLDS, SCOPE NARROWER, WRONG, STALE, UNVERIFIABLE, with the quote.

**Results.**

| File | Registers | Verdict rows | HOLDS | SCOPE NARROWER | WRONG | STALE | UNVERIFIABLE | How the rows were checked |
|---|---|---|---|---|---|---|---|---|
| `wave2-A.md` | 01, 02, 03 | 186 | 171 | 11 | 1 | 3 | 0 | About 185 fetches. Registers 01 and 02 have 54 and 55 rows, under the 60 aimed for; the skipped entries are listed in the file. |
| `wave2-B.md` | 04, 05, 06 | 297 | 290 | 5 | 2 | 0 | 0 | 201 of 204 cited URLs fetched. About 91 rows read by hand against the claim sentence; the rest had their verbatim quote matched in the fetched source by script. |
| `wave2-C.md` | 07, 08, 09 | 156 | 139 | 9 | 1 | 6 | 0 | About 250 URLs. Registers 07 and 08 have 46 and 48 rows; 37 entries of register 09 had the quote matched by script only. One row of register 08 is superseded by another and counted once. |
| Total | | 639 | 600 | 25 | 4 | 9 | 0 | |

A script-matched row proves the quote is in the source. It does not prove the claim sentence says no more than the
quote. That limit is an open item in the Gate 1 record.

**WRONG (4), each corrected in its register.**
- F01-32: depth images come from RealSense and from Reachy 2 cameras in LeRobot v0.7.0, where the entry said RealSense only.
- F04-42: the $62.55 campaign cost belongs to the RATS baseline in the RACaP paper's table; RACaP's own development cost is "n/a".
- F04-68: a quote was transcribed as "GROOT 2" for the page's "GR00T 2". The figures hold.
- F08-58 and F08-85: EC2 G7 does not have the most CPU cores per GPU. P6e-GB200 has 36 and G5g has 32; G7's 24 is the most among eight-GPU x86 sizes.

**STALE (9), each corrected or added.**
- Figure's Helix 2.5 (2026-09-17) is newer than Helix 02 and publishes no control rates (F01-72).
- "Anything newer than pi0.7: not determined" is now determined: no newer named model as of the 2026-10-20 archive copy; a hosted API beta opened on 2026-10-13 (F02-53).
- The V-JEPA 2 rollout-loss defect a later paper reports was fixed in the repository on 2025-06-20 (F03-82).
- SageMaker HyperPod: higher pod density on EKS-orchestrated clusters, 18 November 2026 (F09-115).
- EKS Hybrid Nodes: billed vCPUs capped at 32 per node, 18 November 2026 (F09-116).
- AWS Deadline Cloud: EC2 G7 in service-managed fleets, 18 November 2026 (F09-117).
- AWS Lambda Managed Instances: GPU functions on G-series instances, 18 November 2026 (F09-118).
- EC2 Detailed Monitoring: one-minute GPU metrics, 19 November 2026 (F08-86).
- GR00T 2's 124 ms on a Jetson Thor was missing from the edge register (F07-119). Also: G7's launch Region list is out of date and is not printed without a re-fetch (F09-98).

**SCOPE NARROWER (25).** Each carries a "Wave 2" line under the entry's verdict with the replacement sentence. The
ones that change what a section says: GR00T 2's 153 ms is one robot and configuration after optimisation (F03-104);
GR00T N1.7's released checkpoint has a 32-layer action head and 16 is the code default (F02-38); LeRobot's
asynchronous inference does not keep the same success rate, 78.3% against 73.3% (F02-61); the RT-core instance list
predates EC2 G7 (F06-60); the one-engine-per-device rule holds on Jetson, and TensorRT 11.5.0 adds a compatibility
mode on Arm server-class Linux (F07-77); two Tier 0 passes exist and some microbenchmark stall splits do not
reproduce (F08-73); ENPIRE's two time figures use different stopping rules and are not combined (F04-20).

**The owner's three from-memory items** (register 09) were verified with their limits: AWS Nitro Sandboxes for EKS
pods, available 9 November 2026, CPU only on accelerated instances (F09-43, F09-45); EKS Auto Mode "resource
optimization", a preview since 17 November 2026 (F09-46); the 2026 Auto Mode additions (F09-47).

### Wave 3. Tier 0 experiments (separate profiling project)

See section 5. The dive does not run hardware.

### Wave 4. Pre-build design (after Gate 1)

Per section: the worked example's numbers fixed, the diagram sketched, the first-use order of terms checked against
the reading routes. Then `src/sections/`.

## 3. Reading path for Carlos

One list per register, at most eight items each, in the order of the registers. For the world-models route read
registers 01, 02 and 03 first. Pinned versions are the registers'.

#### Register 01 (robot basics)

1. SO-ARM100 `README.md` at `141aea7`, sections "Sourcing Parts" and "Optional Hardware" (10 minutes). What the arm physically is, what it costs, and that no computer is in the box.
2. LeRobot `src/lerobot/robots/so_follower/so_follower.py` at v0.7.0, the whole file (about 225 lines). The entire robot driver: six motors, `configure()`, `get_observation()`, `send_action()`. This one file is section 3's mechanism.
3. LeRobot `src/lerobot/scripts/lerobot_record.py` at v0.7.0, the data-flow comment and `record_loop()` (lines 205 to 392). The control loop itself, with its named timing sections.
4. LeRobot `docs/source/il_robots.mdx` at v0.7.0, "Cadence reporting". One printed time budget for a 30 Hz tick, and the best short statement of why timing is part of the data.
5. Feetech STS3215 Product Specification (edition A/0), pages 3 to 5. Speed, torque, gear ratio, encoder, PID and protections: every servo number in one place.
6. LeRobot `docs/source/action_representations.mdx` at v0.7.0, top to "Visual Comparison". Joint against end-effector space, and absolute against relative against delta, with small numeric examples.
7. LeRobot `docs/source/remote_inference.mdx` at v0.7.0, the opening and "How it works" (two diagrams). Slow model, fast loop, buffer in between; it leads into the chunking material of section 4.
8. NVIDIA GR00T 2 research page, section "Think Slow, Move Fast" and its deployment figure. The newest published rate ladder on a humanoid, to set next to the arm's; viewing the figure also settles which box each rate belongs to (unknown 01-U9).

#### Register 02 (imitation learning and VLAs)

1. ACT paper, arXiv 2304.13705v1, Section IV with Fig. 4 and Fig. 5 (about 2 pages), then Fig. 8(a). Chunking, temporal ensembling and the CVAE in the authors' words; Fig. 8(a) is the 1% to 44% ablation that section 4 repeats.
2. DAgger paper, arXiv 1011.0686v3, Section 1 and Section 2.1 only (one page). The T^2 epsilon sentence and Theorem 2.1; skip the rest.
3. Diffusion Policy, arXiv 2303.04137v5, Fig. 1 and Sections 3.1 to 3.4. The multimodality picture and the T_o / T_p / T_a definitions.
4. pi0 paper, arXiv 2410.24164v4, Section IV and Appendix D, Table I. One page of flow matching and the 73 ms breakdown.
5. openpi `src/openpi/models/pi0.py` at SHA 215abfb, lines 188 to 279. The whole of flow matching for actions in about 90 lines; read `compute_loss`, then `sample_actions`.
6. `nvidia/GR00T-N1.7-3B` model card, "System Requirements and Performance" table. The per-stage latency split on eight devices; the best single table for which part of the machine does what.
7. SmolVLA paper, arXiv 2506.01844v1, Sections 3.3 and 4.1, Tables 3 and 4; then LeRobot `docs/source/smolvla.mdx` at v0.7.0. The result closest to the dive's task, then the commands.
8. GR00T 2 project page, sections "Model Architecture" and "Think Slow, Move Fast". Where the VLA line turns into a world-action model.

Left out to stay at eight: LeRobot `configuration_act.py` at v0.7.0 (178 lines; the decoder-layer comment at lines 108 to 111), the FAST paper arXiv 2501.09747v1 (Section IV and Fig. 4), the GR00T N1 paper arXiv 2503.14734v2 (Section 1 and Fig. 2), ScaleVLA arXiv 2611.21607v1 (abstract and Fig. 1).

#### Register 03 (world models and JEPA)

1. LeWorldModel paper, arXiv 2603.19312v3: the section "Method: LeWorldModel", the appendix algorithm "Cross-Entropy Method (CEM) for Action Sequence Optimization", then Figure 7. The whole JEPA world model fits on two pages: encoder, predictor, two-term loss, CEM. Read it first because nothing in it is hidden behind scale.
2. le-wm at SHA `8edfeb336732b5f3ce7b8b210d0ba370a09e2cac`: `train.py` lines 20 to 41, `module.py` class `SIGReg` (lines 10 to 36), `jepa.py` `rollout` and `get_cost`. The paper's formulas as about 80 lines of code; the fastest way to see which tensor goes where.
3. V-JEPA 2 paper, arXiv 2506.09985v1: the overview figure, the pretraining objective, the sections "V-JEPA 2-AC: Learning an Action-Conditioned World Model" and "Planning: Zero-shot Robot Control", then "Limitations". The large-scale version of the same idea, and the source of the planning numbers (16 s against 4 min).
4. vjepa2 at SHA `204698b45b3712590f06245fbfba32d3be539812`: `app/vjepa_droid/train.py` lines 419 to 448 (teacher forcing and rollout), `notebooks/utils/mpc_utils.py` (CEM), `src/models/ac_predictor.py` (how actions are interleaved). What the release really runs, including where it differs from the paper.
5. LeCun, "A Path Towards Autonomous Machine Intelligence" v0.9.2: the parts on energy-based models, "Joint Embedding Predictive Architecture (JEPA)" with Figure 12, and Figure 13 on non-contrastive training. History, and where the vocabulary comes from (energy, collapse, Mode-1 and Mode-2).
6. JEPA-WMs, arXiv 2512.24497v4: the introduction with its list of contributions, the limitations discussion, and the "V-JEPA-2-AC reproduction" paragraph in the appendix. An independent, peer-reviewed check on what matters in this family, including the report on the rollout loss; its per-epoch table also closes unknown 03-U4.
7. RoboJEPA, arXiv 2610.10515v1: abstract, the results table and the limitations section. The newest and largest JEPA robot model, with the honest numbers (27% pick-and-place).
8. NVIDIA/Cosmos at SHA `0eab578a8935e26aa41c2b7dc9f5ab00f790a037`: `docs/reference/models.md` and `docs/reference/inference_benchmarks/cosmos3-nano-generator.md`. What the pixel side is and what it costs today.

Left out to stay at eight: I-JEPA arXiv 2301.08243v3 (Figure 3 and section 3), the GR00T 2 whitepaper ("Architecture" and "GR00T 2 Turbo" paragraphs), DreamZero arXiv 2602.15922v1 (introduction and inference-optimisation results).

Taken from each register's section 10, in the register's order, cut to eight items per register. Pinned versions are
written as the register writes them.

#### Register 04: reinforcement learning and agents running the loop (sections 8 and 19)

1. ENPIRE project page, https://research.nvidia.com/labs/gear/enpire/ . Part: the videos and the scaling charts. Why: ten minutes to see what "an agent runs the loop" looks like physically.
2. ENPIRE paper, arXiv 2606.19980v2. Part: Sec 3 (the two stages), Fig. 7 (utilisation and tokens), Sec 6 (limitations, two paragraphs), the appendix on the prompt. Why: this is section 19's spine. Note: the register's own entries locate the two stages in Sec 2.1 and 2.2 (F04-2), the limitations in Sec 4 (F04-21) and the prompt in Appendix B.1, Figure 10 (F04-4); follow the entries if the section numbers in this item do not match the PDF.
3. ENPIRE repository at SHA 99ee90ac, file `enpire/policy/autoresearch_instruction.md`. Part: the whole file, one page. Why: the actual contract that says what the agent may not touch.
4. SEAR, arXiv 2610.18792v1. Part: Abstract, Sec 2.4 "Protocol" (the sealed judge) and the Sec 4 finding on real robots. Why: the sober counterweight to ENPIRE, and newer than the seed research.
5. Recap, arXiv 2511.14759v2. Part: Fig. 3 and Sec IV-B (advantage conditioning, one page), then Sec VII (limitations). Why: the mechanism section 8 needs for "RL on a pretrained policy".
6. AWS sample `sample-rfm-simulation-on-aws` at SHA 66e0fbef, `docs/results.md`. Part: the section "RL post-training". Why: one measured run with hours, dollars and a failed earlier attempt; the cost story for the same setting.
7. LeRobot v0.7.0, `docs/source/hilserl.mdx`. Part: the sections "Training with Actor-Learner" and "Guide to Human Interventions". Why: what RL on the SO-101 on a desk involves.
8. MuJoCo Playground v1.0.1, `README.md` and `mujoco_playground/tasks/manipulation/pick_cube/so101/deploy/README.md`. Part: both files in full. Why: the SO-101 pick-cube sim-to-real path, the newest item in the register (6 Nov 2026).

Left out of the eight: Isaac Lab v3.0.0 benchmark README and CSV (covered by item 5 of register 06 below), LWD (arXiv 2605.00416v4, abstract and experimental setup), AdaRSI (arXiv 2610.20474v2, Sec 5.4 and Fig. 4b).

#### Register 05: the data pipeline (sections 9, 10 and 11)

1. LeRobot `docs/source/lerobot-dataset-v3.mdx` at v0.7.0. Part: top to the "Image transforms" heading (about 180 lines). Why: the whole format in one read: three kinds of content, shared files, the directory tree. https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/lerobot-dataset-v3.mdx
2. `meta/info.json` of `lerobot/svla_so101_pickplace`. Part: the whole file, one screen. Why: a real SO-101 two-camera dataset's schema: the six joint names, the two video features, the codec. https://huggingface.co/datasets/lerobot/svla_so101_pickplace/resolve/f641879e22172be7e8161d5e6c1503c2d2feb657/meta/info.json
3. LeRobot `benchmarks/video/README.md` at v0.4.0. Part: the introduction and the results table. Why: the reason for GOP 2 and AV1, the access-pattern argument in the authors' words (history, 2024). https://raw.githubusercontent.com/huggingface/lerobot/f25ac02e6c8fa9c467ab8462289e5f4aed3a2e85/benchmarks/video/README.md
4. NVIDIA video encode and decode support matrix. Part: the "Data Center" and "Jetson / IGX" tabs; find A100, H100, B200, L4, L40S, RTX PRO 6000 and Thor, and read the NVENC count and the AV1 columns. Why: ten minutes that explain why data work goes to G-family cards. https://developer.nvidia.com/video-encode-decode-support-matrix
5. LeRobot `docs/source/streaming_video_encoding.mdx` at v0.7.0. Part: the load table. Why: what recording costs the CPU beside the robot. Read its "px/sec" column knowing it counts three colour channels (F05-45, wave 2). https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/streaming_video_encoding.mdx
6. Cosmos Curator `docs/curator/reference/video-pipelines.md` at v2.10.0. Part: the split-annotate stage list and its resource table. Why: the shape of large-scale curation: which stage is CPU, which is a quarter of a GPU. https://raw.githubusercontent.com/NVIDIA/cosmos-curator/95675431e309fd86c1c559a39fcb694ddedaa2a9/docs/curator/reference/video-pipelines.md
7. Isaac Lab `teleop_imitation.rst` at v3.0.0. Part: from "Generating additional demonstrations" to the results note. Why: demonstration multiplication end to end, with timings on a single arm. https://raw.githubusercontent.com/isaac-sim/IsaacLab/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/features/imitation-learning/teleop_imitation.rst
8. Cosmos 3 `docs/reference/models.md` and the Nano benchmark page. Part: the workflow table (what "transfer" takes and returns) and seconds per clip by GPU. Why: the cost of generative augmentation at the current model. https://raw.githubusercontent.com/NVIDIA/cosmos/0eab578a8935e26aa41c2b7dc9f5ab00f790a037/docs/reference/models.md

Left out of the eight: Cosmos Curator `docs/curator/design/curator-next-embeddings.md` (the three-embedding section), DreamGen (arXiv 2505.12705v2: section 1, the SO-100 experiments paragraph, the limitations paragraph), UMI (arXiv 2402.10329v3: figure 1 and the throughput paragraph, history).

#### Register 06: simulation, rendering, sim-to-real and evaluation (sections 12, 13, 14 and 16)

1. MuJoCo 4 announcement (github.com/google-deepmind/mujoco, discussion 3773). Part: the "Then and Now" table and the sim-to-real paragraph. Why: ten minutes that update the whole MuJoCo picture to November 2026.
2. MuJoCo docs, "Computation" chapter at tag 4.0.1 (`doc/computation/index.rst`). Part: the simulation pipeline list. Why: the 26 stages of one step; this is section 12's backbone.
3. MuJoCo docs, MuJoCo Warp chapter at tag 4.0.1 (`doc/mjwarp/index.rst`). Part: the performance section (latency against throughput) and "Batch Rendering", then the nightly benchmark page for the numbers. Why: the one-world-fast against many-worlds-at-once model, from the source.
4. MuJoCo Playground v1.0.1. Part: `tasks/manipulation/pick_cube/so101/deploy/README.md`, then `task.py` in the same directory, then `docs/sysid.rst`. Why: the dive's thread task as shipped code: the randomisation list, the 10 Hz loop, the 64x64 camera, the calibration warning.
5. Isaac Lab release benchmark CSV at v3.0.0 (`docs/source/_static/benchmarks/environment-performance-release.csv`). Part: sort by task; compare the camera rows with the state rows. Why: this is where the cost of a camera is visible.
6. Isaac Sim 6.2.0 requirements page. Part: the GPU table and the RT-core sentence; then the AWS post of 2026-06-09, the instance compatibility paragraph, with its Isaac Sim 5.1 date in mind. Why: the exact sentence section 13 rests on, and its scope.
7. PolaRiS (arXiv 2512.16881v2). Part: the method figure, the correlation results, and the baseline comparison with MSE and LIBERO. Why: real-to-sim and evaluation in one paper.
8. LeRobot v0.7.0, `src/lerobot/utils/eval_stats.py`. Part: the docstring on the Wilson interval. Why: twenty lines that carry section 16's statistics.

Left out of the eight: Isaac Lab v3.0.0 release notes with `docs/source/isaaclab/installation.rst` and `docs/source/concepts/renderers.rst`, RoboWorld (arXiv 2607.01060v4: abstract and the cost paragraph), the AWS Physical AI post of 2026-09-09 (the evaluation section).

One ordered list, at most eight items per register. Pinned versions are written as the registers write them.

#### Register 07: the edge and the fleet

1. **Isaac-GR00T `scripts/deployment/README.md` at SHA 708617f5** (https://raw.githubusercontent.com/NVIDIA/Isaac-GR00T/708617f5716c63fc0a327391492ea2b91977ae90/scripts/deployment/README.md). Part: sections "Performance" and "Build TRT Engines". Why: one table, six devices, four runtimes; the fastest way to see what a device and a compiler are each worth.
2. **Real-time chunking paper, arXiv 2506.07339v2 (NeurIPS 2025).** Part: Figure 2, Figure 3, section 3.2, then appendix A.3 Tables 2 and 3. Why: the two figures are the idea; Table 2 is the only measured camera-side-to-action latency budget found; Table 3 shows where one model call's time goes.
3. **LeRobot `docs/source/rtc.mdx` and `docs/source/remote_inference.mdx` at v0.7.0** (commit 410c095eacc0011d998a73383eb94abed2715af0). Part: "Parameters that matter" and the tuning section. Why: the same idea as runnable flags on an SO-100 or SO-101, and the plain statement of the limit ("no refill value fixes that").
4. **LeRobot `docs/source/inference.mdx` at v0.7.0.** Part: "Cadence Reporting". Why: this is what to run on our own arm to fill the unknowns; it prints the per-stage breakdown and the worst case.
5. **TensorRT docs, "Engine Compatibility"** (https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/engine-compatibility.html, TensorRT 11.5.0). Part: sections "Hardware Compatibility" and "Compatibility Checks". Why: ten minutes; settles why engines are per device, and where DGX Spark is the exception.
6. **Training-time RTC, arXiv 2512.05964v2.** Part: section III and the 20-line code listing in the appendix. Why: the whole method is a mask on the flow-matching time.
7. **AWS IoT "Job configurations" page** (https://docs.aws.amazon.com/iot/latest/developerguide/jobs-configurations-details.html), then the two Greengrass API pages `DeploymentPolicies` and `DeploymentComponentUpdatePolicy`. Part: "Job rollout rates" and the abort note. Why: the rollout example table and the three defaults that decide what happens to a robot mid-task.
8. **"Learning While Deploying", arXiv 2605.00416v4.** Part: the infrastructure appendix (Fig. 10 and Table VI). Why: the one published fleet loop with numbers on it.

Left off to stay within eight: the Jetson AI Lab tutorial "GR00T N1.7 on Thor", section "How the Optimization Works" (it asserts task success without a number), and the AWS "Services in Full Shutdown" page (one screen).

#### Register 08: compute shapes

9. **`deep-dives/physical-ai/research/experiments/E-seed-profiling-2026-11-19/report.md`.** Part: section 3 (three small tables). Why: these are our own numbers; read them first so the method has something to bite on.
10. **Intel VTune cookbook, "Top-down Microarchitecture Analysis Method"** (https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/current/top-down-microarchitecture-analysis-method.html). Part: the first third, up to the four-category diagram. Why: the clearest prose explanation of slots; ignore its "four slots" figure.
11. **Arm Telemetry Solution, `data/pmu/cpu/specifications/cortex/cortex_x925_r0p0_pmu.json` at tag 2026.09.** Part: search for `"frontend_bound"` and `"STALL_FRONTEND_FLUSH"`. Why: the exact formulas for the DGX Spark's big core, the ones our results should be recomputed with.
12. **Linux `tools/perf/pmu-events/arch/arm64/sbsa.json` at v7.3.** Part: four metrics, twenty lines. Why: this is the formula our Tier 0 used; seeing it next to item 11 is the whole comparison.
13. **AWS Graviton guide, `perfrunbook/debug_hw_perf.md`** (aws/aws-graviton-getting-started at SHA 541d1ad524bb1630e16b8e66aef36dcd01a3bbc1). Part: the table under "How to Collect PMU counters". Why: tells you which EC2 size to rent before profiling.
14. **NVIDIA `nvidia-smi` documentation.** Part: section "Utilization" (six short definitions). Why: one sentence changes how every GPU utilisation figure reads.
15. **Nsight Compute Profiling Guide (v2026.4.0).** Part: sections "Streaming Multiprocessor" and "Roofline Charts". Why: the unit list (tensor cores, RT cores) and the GPU's compute-versus-memory picture.
16. **EC2 "Specifications for accelerated computing instances"** (https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html). Part: the "Performance specifications" table, columns vCPUs, CPU cores, Threads per core. Why: the CPU beside each GPU, and the G7 exception.

Left off to stay within eight: Arm's Neoverse V1 white paper, section 3.2 and Appendix C (the Arm definition of a slot, history), and register 08's own three tables under F08-58, F08-76 and F08-74.

#### Register 09: AWS orchestration

17. **The 19 November 2026 AWS post "Train VLA models with Hugging Face LeRobot on Amazon SageMaker AI"** (https://aws.amazon.com/blogs/physical-ai/train-vla-models-with-hugging-face-lerobot-on-amazon-sagemaker-ai/). Part: the instance table, the 20,000-step timing table and "Cost considerations" (F09-81, F09-82). Why: it is the dive's own robot, one day old, and it states the Training Jobs against HyperPod rule in one sentence.
18. **The toolchain README at the pinned commit** (aws-samples/sample-the-physical-ai-toolchain-on-aws at SHA 84984decc51cc07fb4ceb8f3fc1f85d523924bf5; no releases). Part: "How It Maps to AWS", "When to Use OSMO vs. Individual Tools", "Estimated Costs" (F09-71, F09-72, F09-75), then `isaac-gr00t-on-aws/README.md`, "Which Option Should I Use?" (F09-73). Why: AWS's own map from loop stage to compute, with its own cost figures.
19. **EC2 User Guide, "Capacity Blocks for ML".** Part: the two support tables and "Considerations" (F09-90 to F09-92), then the pricing page tables (F09-93). Why: ten minutes; it settles which families can be reserved and what a block forbids.
20. **AWS Batch User Guide.** Part: "Multi-node parallel jobs", the Spot best-practices page with the `Host EC2*` retry, and the quota management page (F09-7, F09-8, F09-10, F09-11, F09-15). Why: this is the service the dive is most likely to use.
21. **The three owner items, each in its primary page.** Part: EC2 guide on Nitro Sandboxes, the limits list (F09-43, F09-45); EKS guide on resource optimization, the preview notice and supported workloads (F09-46); the Auto Mode release notes for 2026 (F09-47). Why: these are the three items the owner asked to have verified.
22. **"Build a Physical AI model factory with NVIDIA Cosmos 3 on SageMaker HyperPod"** (https://aws.amazon.com/blogs/machine-learning/build-a-physical-ai-model-factory-with-nvidia-cosmos-3-on-sagemaker-hyperpod/). Part: only the section "When does Amazon SageMaker HyperPod pay off?" (F09-112), then the HyperPod task governance concepts page (F09-25, F09-26). Why: AWS's own statement of when a persistent cluster earns its cost.
23. **The RobCo post (12 November 2026).** Part: the four-layer figure and the NodePool excerpt (F09-86). Why: the clearest worked case of Ray on HyperPod with Karpenter choosing between two GPU instance types.
24. **OSMO at tag 6.3.1** (NVIDIA/OSMO at SHA ed59b69715e4ee6fff70bcd9d715106358a7205f). Part: the architecture page and the resource pools page (F09-62, F09-64, F09-65). Why: to judge whether a workflow layer above Kubernetes is worth a section or a paragraph.

Left off to stay within eight: Kueue concepts at v0.20.7 (ClusterQueue, Cohort, preemption; F09-55), since HyperPod task governance is these concepts with other names.

## 4. Evidence bar per claim type

| Claim type | What it needs before it ships |
|---|---|
| A product or model version ("the current release is X") | The first-party release page, tag or model card fetched on the access date, with the release date. Never from memory. A register's currency table holds it. |
| A model's architecture or size | The paper at a pinned arXiv version, or the code or model card at a pinned SHA or tag. Where paper and code differ, the code is the authority and both are shown. |
| A default value or behaviour of a framework | The code at a release tag or 40-character SHA, quoted with file and lines. Documentation alone is not enough. |
| A training or inference compute figure | The publisher's own paper, card or README, marked `[author reported]` or `[vendor claim]`, with GPU type, count and conditions. Never compared across publishers as if measured alike. |
| A performance comparison between vendors' products | Shown as each vendor's claim, side by side, labelled. No winner is declared without a Tier 0 measurement. |
| A hardware capability (ray-tracing cores, a codec in hardware, memory) | The vendor's support matrix or instance documentation, fetched on the access date. |
| An AWS service feature or limit | The AWS documentation page or What's New post, with access date. A feature the owner described from memory is unverified until a first-party page states it. |
| A price | The first-party pricing page with access date and Region, or omitted. Prices change; the page shows the date. |
| Our own measurement | Raw outputs in `research/experiments/` with inputs and configuration, the run count stated next to the figure. One run is shown as one run. |
| Arithmetic | `[derived]`, with inputs that each carry a register ID, redoable by hand. |
| A synthesis (shapes, groupings, decision paths) | `[our reading]`, stated as ours, with the entries it rests on. |
| History | A source older than 2025 is labelled as history or as the paper that introduced the concept, and is never the support for "what people use now". |
| An absence | "Not located in this research", with what was searched. Never "does not exist". |

## 5. Tier 0 experiments

The profiling project is separate from this dive. It produces measured results (inputs, configurations, outputs);
the dive consumes them through `research/experiments/`, one folder per experiment, each with a README that states
machine, software versions, command, run count and raw files. The dive never runs hardware, and the profiling
project writes no prose for the page.

### What exists (copied from the seed on 2026-11-20)

`research/experiments/E-seed-profiling-2026-11-19/`: 14 CPU microbenchmark kernels and three CPU stand-in workloads
under `perf stat` with a top-down level 1 breakdown, on a Jetson Orin Nano Super (Cortex-A78AE) and a DGX Spark
(Cortex-X925 and Cortex-A725), one core, **one run per kernel in each of two passes**; one GPU matmul kernel per machine under Nsight Compute.
Limits are listed in `research/experiments/README.md`.

### What the dive asks the profiling project for

The story is one SO-101 task through eight phases. Each row is one card for section 22 and one unit of work for
section 23.


Rows 1 to 8 are the eight phases of register 08's hand-off table (the table under F08-74, its Part G in this register). Rows 9 to 16 are the unknowns triaged close-by-experiment. Machines and tools are only those the registers name. CPU counters on every CPU row: the six slot events plus STALL_FRONTEND_FLUSH, and the level-2 stall events where the core has them (F08-74).

| # | Workload (phase of the SO-101 task) | Machine(s) | What to run and record | Unit of work | Feeds section | Closes unknown |
|---|---|---|---|---|---|---|
| 1 | Record and encode (1 Collect): LeRobot record, two 640x480 cameras at 30 fps, SVT-AV1 software encode, with and without streaming encoding | Jetson Orin Nano, DGX Spark, a laptop-class x86 | CPU top-down on the encoder threads and on the control thread; cores busy; watts (tegrastats VDD_IN); on the Spark, NVENC utilisation when the hardware encoder is used | camera-seconds encoded per second; control-loop period held | 9, 20, 22 | none listed |
| 2 | Decode and embed (2 Process and curate): decode AV1 (dav1d, torchcodec) and embed frames (a ViT-L video encoder) | Spark; c9g and c8g (decode); g6, g6e, g7 (decode engine plus embed) | CPU top-down with flush correction, memory stall; nvidia-smi decoder utilisation; DCGM tensor activity; `ncu` on the embedder's attention kernel | frames decoded per second per core; clips embedded per second | 10, 20, 22, 23 | none listed |
| 3 | Dataloader augment (3 Augment): LeRobot image transforms on CPU and on GPU | Spark; g6e.xlarge against g6e.16xlarge (4 against 64 vCPUs per GPU) | CPU top-down on a worker; SM activity while waiting for data; Nsight Systems timeline for the gap between batches | samples per second delivered to the GPU | 11, 20, 22 | none listed |
| 4 | Simulate (4 Simulate): SO-101 MuJoCo step (CPU); MuJoCo Warp or Playground SO-101 pick-cube with 64x64 camera; Isaac Lab 3.0 with OVRTX | Jetson (CPU only), Spark, c9g, g6e, g7e, and one P size for the Warp renderer | CPU top-down, level 2 core against memory; SM activity, DRAM activity, GPU memory used per environment; whether any counter moves when ray-tracing cores are used; Nsight Compute ComputeWorkloadAnalysis on one MuJoCo Warp step | environment steps per second; frames rendered per second | 12, 13, 20, 22, 23 | 08-U4, 08-U13 |
| 5 | Train the policy (5 Train): ACT then SmolVLA fine-tune on about 50 episodes | Spark; g6, g6e, g7e; one P5 or P6 size | DCGM tensor and SM activity, GPU memory; dataloader CPU top-down; data-wait share from Nsight Systems; EBS or NVMe read throughput | training samples per second; time to 100,000 steps | 15, 20, 22, 23 | none listed |
| 6 | Train the world model (6 Train): LeWorldModel on the same episodes | Spark; g6e, g7e | same as row 5; `ncu` roofline on the predictor | training samples per second | 7, 15, 22 | none listed |
| 7 | Evaluate (7 Evaluate): closed-loop rollouts in simulation with the policy on the GPU | Spark; g6e Spot shards | split of wall time between physics, render and policy; SM activity; CPU top-down on the physics thread | episodes per hour | 16, 20, 22 | none listed |
| 8 | Export and deploy (8 Deploy): TensorRT engine build, then ACT or SmolVLA inference at 30 Hz | Jetson Orin Nano, Spark, AGX Thor if available | tegrastats GR3D_FREQ with clock, EMC_FREQ, rails; `ncu` on the engine's hottest layers; CPU top-down on pre- and post-processing | actions per second; p50 and p99 latency per call; watts | 17, 22, 23 | 07-U5 |
| 9 | On-robot rollout of the arm task with LeRobot's cadence report (the report prints mean and "worst" per stage: observe, process_obs, infer, send, record) | the arm's own computer: Jetson Orin Nano or a laptop GPU, as register 07 names them | per-stage mean and worst; cycles over budget; pacing headroom | control ticks at 30 Hz; worst-case latency per call | 17 | 07-U3, 07-U11 |
| 10 | `perf list` only: which PMU events the reduced set holds, and whether STALL_SLOT, OP_SPEC and STALL_FRONTEND_FLUSH are in it | c9g.2xlarge and c9g.12xlarge | the event list on each size | n/a (capability check) | 21, 22 | 08-U2 |
| 11 | `perf list` only: which CPU PMU events G and P sizes expose | g6e.xlarge, g6e.48xlarge, g7.48xlarge, p5.48xlarge | the event list on each size | n/a (capability check) | 21 | 08-U3 |
| 12 | `perf list` only, or the raw event code 0x8162: whether the kernel exposes STALL_FRONTEND_FLUSH and the level-2 stall events by name | DGX Spark | the event list; one recapture of the workload rows with the flush event | n/a (capability check) | 21, 22 | 08-U15 |
| 13 | Render stand-in re-run with `MUJOCO_GL=osmesa` against `egl`, with tegrastats or nvidia-smi sampling | Jetson Orin Nano, DGX Spark | frames per second under each backend; GPU activity while rendering | frames rendered per second | 13, 22 | 08-U10 |
| 14 | Triad and memory-write microbenchmarks repeated, same binary, several runs (their front-end against back-end split did not reproduce between pass 1 and pass 2) | Jetson Orin Nano, DGX Spark | throughput and all four level-1 categories per run, with spread | GB/s | 22 | none (wave 2 item on F08-73) |

Rows not requested: 07-U12 (T5000 engine on a T4000) and 09-U2 (Batch multi-node job with EFA inside a Capacity Block) had an experiment as one of two wave 2 options; both are triaged accept-as-hedge because the registers name no machine or account run for them.

### Limits of the Tier 0 results on hand

Limits of the existing measurement set, as register 08 records them.

| Limit | Entry |
|---|---|
| Run count: one execution per kernel per core type, one thread pinned to one core, no repeat, no variance. | F08-60, F08-73 |
| Two passes exist (`results-pass1`, `results-pass2`), built from different versions of the benchmark; they are two single runs, not a repeat of one binary. | F08-73 |
| Reproduces across the two passes: the three workload rows (throughput within 2.5%, every level-1 category within 0.5 points). | F08-73 |
| Does not reproduce: the front-end against back-end split of the triad and memory-write microbenchmarks at the same throughput (Jetson `triad_mem`: 5.9% front end and 76.9% back end in pass 1, 78.1% and 7.9% in pass 2). Their throughput may be printed; their stall split may not. | F08-73 |
| Top-down formula: the results use the generic Arm formula that Linux perf ships, with no flush correction. Back-end bound and retiring match Arm's method; front-end bound is too high and bad speculation too low by the same amount; the run did not record STALL_FRONTEND_FLUSH, so corrected values cannot be computed from the files on hand. | F08-20, F08-22 |
| Size of that caveat, illustration only: 1.6 points on the MuJoCo step on the X925, 13.2 points on the branch microbenchmark, under 0.5 points on policy and memory kernels. | F08-23 |
| The four categories adding to exactly 100% is an identity of the formula, true in all 51 rows of pass 2, and is not a validation. | F08-69 |
| Slot count for the Cortex-A78AE (6) is derived from the same counters; Arm publishes no file for that core. The 10 and 5 on the Spark match Arm's files. | F08-68, F08-16 |
| Top-down events and detail events come from two separate executions of the same program, so ratios mixing the two compare two runs. | F08-60 |
| Stand-ins, not the arm's workloads: a humanoid, a dense MLP, an offscreen render of unknown GPU share; level 1 only; no EC2 instance measured; one GPU kernel per machine. | F08-73 |
| The render row cannot compare rendering hardware: the counters describe the CPU thread only. | F08-64 |
| GPU kernels: one kernel, one pass per machine; different matrix sizes (4096x4096 and 2048x2048); the Jetson's SM clock was 306 MHz during profiling; the raw report file for the Spark is not in the experiments folder. | F08-71, F08-72 |
| No power under load was recorded (idle readings only: about 4.8 W and 10 W), and no p99 latency exists. | F08-83, F08-84 |
| The printed report matches the raw counters (36.54% against 36.5%; 26.81% against 26.8%). | F08-70 |

## 6. Open questions and UNKNOWN register

155 rows across the nine UNKNOWN registers, each with one triage value. IDs are register number, then the
register's own U number.

| Triage | Count | Meaning |
|---|---|---|
| closed | 14 | Answered during wave 1 or wave 2; the entry named holds the answer |
| close-by-research | 32 | A fetch or a file read settles it before the section is written; none needs hardware |
| close-by-experiment | 27 | Needs a measurement from the separate profiling project (section 5 lists the runs) |
| accept-as-hedge | 60 | Stays unknown; the page carries the sentence given, in the scope the research supports |
| cut | 22 | No planned section needs it |

Thirteen entries inside the claim registers also carry the verdict UNKNOWN. Each is a recorded absence and maps to
a row below, except three: F01-45 (the servo's inner loop rate is not in either Feetech document read) and F03-105
(Cosmos3-Nano's GPU memory need is not on its model card) are accept-as-hedge with the entry's own sentence; F09-110
(no AWS page comparing Batch, HyperPod and EKS side by side was located in this research) is accept-as-hedge and is
itself a finding for section 25.

#### Register 01 (robot basics)

| ID | Unknown (short, plain words) | Triage | Reason, or the hedge the page carries |
|---|---|---|---|
| 01-U1 | Which LeRobot release made `use_degrees` default to True for the SO arms | cut | Page history. Section 3 needs the default at the pinned release (F01-18, F01-19), and the warning to check which scale a downloaded dataset uses stands without the release number. |
| 01-U2 | Hardware behind the cadence sample in the LeRobot docs | close-by-experiment | Run `lerobot-record` with the two-camera SO-101 setup on the profiling project's host machine and keep its end-of-run cadence table, with run count. Until then the page says: "an example printout from the docs, on unstated hardware" (F01-38). |
| 01-U3 | Whether Feetech issued a datasheet edition later than A/0, and a copy from Feetech's own site | accept-as-hedge | "Servo figures are from Feetech's Product Specification edition A/0, read in a reseller-hosted translation; a later edition was not located in this research." |
| 01-U4 | Whether the servo's magnetic sensor reads the output shaft after the gears | accept-as-hedge | "The datasheet does not state where on the gear train the sensor sits." The backlash-at-the-gripper figure (F01-84) stays as [derived] and [our reading]. |
| 01-U5 | Update rate of the servo's internal PID loop | accept-as-hedge | "Feetech's specification does not state the servo's internal loop rate." The kHz rung of the ladder comes from systems that publish one (F01-72, F01-73). |
| 01-U6 | Where LeRobot puts the six values inside the padded state and action vector | close-by-research | Read the pad step in the pi05 processor files under `src/lerobot/policies/pi05/` at the pinned tag. Sections 3 and 5 draw this vector; until read, the page says "padded", not "the first six slots" (F01-58). |
| 01-U7 | First-party source for wrist force-torque sensors | cut | The stock arm has none (F01-63) and section 3 teaches force sensing only as "absent here, present on larger robots". |
| 01-U8 | Exact control law a Damiao motor applies to the five MIT-mode values | accept-as-hedge | "The formula is the usual form of this control law; Damiao's manual was not read in this research." [our reading] (F01-68) |
| 01-U9 | GR00T 2 paper identity, and which box of the deployment figure each rate label belongs to | close-by-research | Half closed by wave 2: cite it as "NVIDIA whitepaper, November 2026", with no arXiv listing found. Still open: view the rendered deployment figure before the ladder diagram assigns the rates to boxes (F01-73). |
| 01-U10 | Measured gripper speed, and servo speed on the stock supply | close-by-experiment | On the SO-101, time a known joint sweep from `Present_Position` readings. Until then: "under about 1.8 m/s by the datasheet, not measured" (F01-82). |
| 01-U11 | Capture-to-host latency of a USB webcam at the tutorial resolution | close-by-experiment | Film a millisecond clock with the arm's camera on the profiling project's host. Until then the page counts frame age only and says exposure, transfer and decode were not sourced (F01-85). |
| 01-U12 | Whether the newer rustypot release changes the servo table | closed | Closed by wave 2: the diff adds one field, `supports_turn_count_reset`; resolution, baud table and modes are unchanged (F01-11 to F01-15 hold). |
| 01-U13 | Whether Physical Intelligence or Figure published something newer | closed | Closed by wave 2: Helix 2.5 is Figure's newest and publishes no rates (F01-72, Wave 2 line); no Physical Intelligence model is named after pi0.7. Hedge: "As of late October 2026 Physical Intelligence had named no model after pi0.7." |
| 01-U14 | Time on the wire for one sync read and one sync write of six servos | close-by-experiment | Same SO-101 session as 01-U2: `so_follower.py` logs the read time at debug level. Section 3's delay sum lists this term as "not yet measured". |
| 01-U15 | Published payload and reach for the arm | accept-as-hedge | "Reach of about 0.41 m is our sum of the simulation model's link offsets, not a published figure." (F01-50) |

#### Register 02 (imitation learning and VLAs)

| ID | Unknown (short, plain words) | Triage | Reason, or the hedge the page carries |
|---|---|---|---|
| 02-U1 | Depth of the GR00T N1.7 action head: 16 or 32 layers | closed | Closed by wave 2 (F02-38, Wave 2 line): the released checkpoint's config has a 32-layer head; 16 is the repository's code default. The page says: "32 layers in the released checkpoint (the code's default is 16)." |
| 02-U2 | GR00T 2's announcement day and parameter count | accept-as-hedge | The parameter count is answered (2B, F02-45 and F03-104). The day is not printed by NVIDIA. The page says: "Announced November 2026." |
| 02-U3 | Whether GR00T 2 weights will be open, and the licence | accept-as-hedge | Not knowable before the release. "NVIDIA says code arrives in December 2026; the licence is not stated." (F02-44) Recheck at publication. |
| 02-U4 | Wall-clock time and GPU-hours for GR00T N1.5 and N1.6 pretraining | accept-as-hedge | "Not published in the sources we read." The page prints the step counts and batch sizes NVIDIA does give (F02-35, F02-36) and no duration. |
| 02-U5 | Pretraining compute for the pi line | accept-as-hedge | "Physical Intelligence publishes no pretraining compute in the papers we read." Section 15 places the pi line by its fine-tuning and serving figures only (F02-52, F02-54). |
| 02-U6 | Sizes, latency and adaptation hardware for the 2026 Gemini Robotics models | accept-as-hedge | "The 2026 posts give no parameter count, training compute or latency." (F02-74, F02-76) The 2025 report's latency figures stay as the newest Google has published with numbers (F02-78). |
| 02-U7 | Whether Physical Intelligence released anything after pi0.7 | closed | Closed by wave 2 up to the archive copy it read (F02-53, Wave 2 line): no newer model named; the newest post offers a hosted API beta. The page says: "The newer models are offered through a hosted API beta (waitlist), not as open weights." Not checked for the month after that copy; recheck at publication. |
| 02-U8 | What the LeRobot policy packages not read here are, and whether one is a better choice for the arm | close-by-research | Read the release post for the pinned LeRobot release and each unread package's README at the pinned tag. This decides whether section 5's "what can be fine-tuned for the arm today" list is complete (F02-65). Until read the page says "among the policies we read". Register 03 should take the world-model packages. |
| 02-U9 | Whether the stale `drop_n_last_frames` value in LeRobot's Diffusion config is intended | cut | Section 4 prints the horizon and the executed steps from the code (F02-17) and does not show this comment. Wave 2 proposed a one-file read; it changes nothing the page prints unless the profiling project trains this policy, in which case that project reads the file. |
| 02-U10 | SmolVLA inference latency on a named device | close-by-research | Read the SmolVLA paper's efficiency section and the LeRobot SmolVLA docs page at the pinned tag to completion. If neither prints one, it becomes a measurement for the profiling project (SmolVLA is on its list in section 22), and the page says "no first-party latency on a named device was located". |
| 02-U11 | Publication venues for ACT, Diffusion Policy, pi0, FAST, pi0.5 | closed | Mostly closed by wave 2 from the arXiv comments fields: pi0 and OpenVLA-OFT at RSS, real-time chunking at NeurIPS, Diffusion Policy as the journal extension of its RSS paper, DAgger at AISTATS. ACT, FAST and pi0.5 stay labelled "preprint". |
| 02-U12 | Content of the MEM paper | cut | Section 5 names MEM only as an option LeRobot back-ported onto pi0.5 (F02-56) and does not teach it. If it is named, cite the paper with its version, which wave 2 found missing. |
| 02-U13 | DreamZero beyond its existence | closed | Answered in register 03, which read the paper body (F03-93, F03-103). |

#### Register 03 (world models and JEPA)

| ID | Unknown (short, plain words) | Triage | Reason, or the hedge the page carries |
|---|---|---|---|
| 03-U1 | GPU model and measured wall-clock time of LeWM training | close-by-experiment | Train the le-wm Push-T config at the pinned SHA on the profiling project's DGX Spark and record wall-clock time, GPU memory and which epoch count was used (paper against released config, F03-37, F03-43), with run count. Until run: "the authors state a single GPU in a few hours and name no GPU" (F03-31). |
| 03-U2 | GPU and CEM settings behind LeWM's planning time | close-by-experiment | Time the le-wm planning evaluation on the same machine at both CEM iteration counts of F03-40. Until run the page prints the range from the Wave 2 line of F03-118, or drops the per-candidate figure, and says "the paper names no GPU for this timing". |
| 03-U3 | Actual GPU count and wall-clock time of the V-JEPA 2 pretraining run | accept-as-hedge | "The paper gives a projection, not a measured run." (F03-12) The released config's node and GPU request (F03-13) is printed as what the config asks for. |
| 03-U4 | GPU and time for V-JEPA 2-AC predictor training; the cell values of the JEPA-WMs per-epoch table | close-by-research | Read that table of the JEPA-WMs paper at the pinned version in full (F03-120). It gives section 15 a measured per-epoch time on named GPUs for this family. For V-JEPA 2-AC itself the hedge stays: "GPU model and wall-clock time are not stated" (F03-21). |
| 03-U5 | Whether the pinned vjepa2 code still has the rollout-loss defect | closed | Closed by wave 2 (F03-82, Wave 2 line): the repository fixed the line in June 2025 and the pinned SHA has the fix. Not established: that the fix and the third-party report describe the same defect. The page uses the replacement sentence in that Wave 2 line. |
| 03-U6 | GPU memory used by V-JEPA 2-AC planning | close-by-experiment | Run the vjepa2 planning notebook at the pinned SHA with a memory profiler on the DGX Spark, at the paper's CEM settings (F03-24). Section 6's side-by-side has no memory figure for the latent side until this runs. |
| 03-U7 | Genie 4's release date, frame rate, resolution, size and hardware | accept-as-hedge | "Google DeepMind's page gives no release date or model size." (F03-101) |
| 03-U8 | How the LeWM dataset loader works and what adapting it to LeRobot episodes needs | close-by-research | Read the `stable-worldmodel` package at a pinned SHA (F03-44). The profiling project needs this before it can train LeWM on the arm's episodes; the page itself only says which format the pinned code expects. |
| 03-U9 | RoboJEPA: planner GPU count, seconds per decision, total GPU-hours per size | accept-as-hedge | "The authors describe planning as 'several seconds' per plan and print no measured figure." (F03-77, Wave 2 line) Reading the appendix and the planning configs could still close the GPU count; the page does not depend on it. |
| 03-U10 | GPU memory needed to run the Cosmos 3 models | accept-as-hedge | "The memory needed is not printed on the model card or in the benchmark pages we read." (F03-105) Sections 6 and 11 carry this sentence in place of a memory column. It becomes a measurement only if the profiling project runs Cosmos3-Nano. |
| 03-U11 | Rollout length behind the Cosmos3-Nano robot forward-dynamics timing | accept-as-hedge | "NVIDIA does not publish the rollout length for this row." (F03-99) So the page cannot convert it to time per predicted second, which SCOPE's section 6 side-by-side asks for. |
| 03-U12 | Which GPU counts are right for Cosmos 3 pretraining | closed | Closed on wave 2's proposal: the paper's current version gives the same two counts in three passages and no conflicting set was found (F03-97). Check owed: register 03's contradictions table says a second line was "seen again"; its author should point to that passage or drop the row. |
| 03-U13 | Whether AMI Labs has released a model, paper or code | accept-as-hedge | "As of 20 November 2026 the company lists no model, paper or code." (F03-85) Recheck at publication. |
| 03-U14 | DreamerV3's publication venue | cut | It is a single history sentence in section 6 (F03-89); the arXiv citation is enough. |
| 03-U15 | Contents of the eb_jepa and jepa-wms repositories | close-by-research | Read both at a pinned SHA. They may be the most runnable JEPA world-model code after le-wm, which bears on section 7's "read from its code" choice and on the profiling project. If not read, the page does not name them. |
| 03-U16 | Whether any JEPA world model has been trained or run on the arm family | close-by-research | Search the LeRobot hub and issues, and read the `vla_jepa` package README in the pinned LeRobot release (F02-65). Until then the page says "not located in this research", never "nobody has published this". |
| 03-U17 | GR00T 2's training compute and code | accept-as-hedge | "NVIDIA has not released the code; its training compute was not read in this research." (F03-104, Wave 2 line) Recheck after the December release. |

#### Counts per triage value

Register 01: closed 2, close-by-research 2, close-by-experiment 4, accept-as-hedge 5, cut 2 (15 rows). Register 02: closed 4, close-by-research 2, close-by-experiment 0, accept-as-hedge 5, cut 2 (13 rows). Register 03: closed 2, close-by-research 4, close-by-experiment 3, accept-as-hedge 7, cut 1 (17 rows).

Every row of each register's section 9 is listed, with the register's own ID. Triage starts from the wave 2 proposals
in `wave2-B.md` and from the registers' own closure notes. "Profiling project" means the separate measurement project
named in SCOPE.md section 22.

#### Register 04 (reinforcement learning and agent-run loops)

| ID | Unknown (short, plain words) | Triage | Reason, or the hedge the page carries |
|---|---|---|---|
| 04-U1 | How often ENPIRE's agents chose each learning method on each task | accept-as-hedge | Not in the latest paper version. Page carries: "The paper does not publish how often each method was chosen." (F04-3) |
| 04-U2 | Whether ENPIRE's "immutable" verifier and reset are technically enforced or only instructed | accept-as-hedge | Page carries: "These are written rules in the agent's instruction files; the public repository shows no technical lock." (F04-8, F04-13) |
| 04-U3 | Precision and recall of ENPIRE's verifiers; reset reliability and time per reset | accept-as-hedge | Page carries: "The paper does not report the verifiers' precision and recall, or reset reliability and time." (F04-12, F04-14) |
| 04-U4 | Whether ENPIRE's Fig. 7 token counts include cached input | accept-as-hedge | Page carries: "The paper does not say whether Fig. 7 counts cached input tokens." (F04-20, F04-22) |
| 04-U5 | No SO-101 adapter in the ENPIRE repository at the pinned SHA | accept-as-hedge | Absence confirmed at the pinned ref. Page carries: "No adapter for this arm was located in the repository in this research." (F04-26) |
| 04-U6 | GPU type and hours behind ASPIRE's simulator rollouts | accept-as-hedge | Page carries: "The paper does not state the simulator-side GPU type or hours." (F04-31) |
| 04-U7 | GPU type behind DrEureka's wall-clock figure | accept-as-hedge | History entry only. Page carries: "The paper does not state the GPU type." (F04-40) |
| 04-U8 | RACaP campaign cost table not re-located | closed | Closed by wave 2: the campaign cost belongs to the RATS baseline and RACaP's own row reads "n/a". Use the corrected sentence in F04-42. |
| 04-U9 | Queue wait, interruption rate and dollar cost of GPU jobs launched by agents | close-by-experiment | Profiling project: submit scripted bursts of GPU jobs to an AWS Batch queue on Spot and On-Demand EC2 GPU instances and log queue wait, interruptions and cost. Until then the page carries: "No published measurement was located." (F04-48) |
| 04-U11 | Time to a working policy for the Isaac Lab Franka lift task | close-by-experiment | Profiling project: one training run of the task at Isaac Lab v3.0.0 on an RTX PRO 6000 Blackwell class GPU (EC2 G7e), recording wall-clock to the success threshold. Until then: "No published figure for time to a working policy." (F04-54) |
| 04-U12 | Wall-clock and real-world success rate of the Playground SO-101 pick-cube recipe | close-by-experiment | Profiling project: run the default recipe on one GPU for wall-clock. The real success rate needs the arm and counted trials. Until then: "No wall-clock or success rate is published for this recipe." (F04-57, F04-58) |
| 04-U13 | Contents of Isaac Lab's SO-101 stacking task (observations, reward, training time) | close-by-research | One file read at tag v3.0.0: `stack_joint_pos_env_cfg.py` in the task directory. (F04-59) |
| 04-U14 | A standalone Newton RL throughput figure outside Isaac Lab | accept-as-hedge | Page carries: "Newton's absolute throughput is published only through Isaac Lab's benchmark; none was located in Newton's own release." (F04-59, F06-42) |
| 04-U15 | GPU count and hours for one Recap iteration | accept-as-hedge | Page carries: "The paper does not state training compute." (F04-64) |
| 04-U16 | Robot count, episodes, training time and learner hardware for GR00T 2's real-robot RL; definition of "GRPO-induced self-imitation"; page date | accept-as-hedge | Page carries: "NVIDIA's page gives no robot count, episode count, training time or learner hardware for the RL stage and does not define the term; it is dated November 2026 without a day." (F04-68) |
| 04-U17 | Wall-clock per piRL training run | accept-as-hedge | Page carries: "The paper does not state wall-clock per run." The AWS sample's measured run supplies the cost figure for the same setting. (F04-69, F04-70) |
| 04-U18 | Learner GPU type and count for LWD | accept-as-hedge | Page carries: "The paper does not state the learner's GPU type or count." (F04-75) |
| 04-U19 | Measured training time and success rate of LeRobot HIL-SERL on an SO-101 | close-by-experiment | Needs the arm: a run of the pick-and-lift tutorial with counted trials, by the profiling project or the owner. Until then the page quotes the docs' own wording on duration and gives no figure. (F04-80) |
| 04-U20 | A first-party recipe for RL on top of a pretrained policy on the SO-101 | accept-as-hedge | Page carries: "No first-party recipe for this arm was located in this research." A read of `docs/source/hilserl_sim.mdx` at v0.7.0 would firm it up but the section does not depend on it. (F04-81) |
| 04-U21 | GPU model behind AdaRSI's GPU-time figures | accept-as-hedge | Page carries the relative figure only (34% of the GPU time) and: "The paper does not name the GPU." (F04-85) |
| 04-U22 | The level the Physical RSI survey assigns to each system | cut | Section 19 needs only the survey's conclusion sentence, which F04-86 already carries. |
| 04-U23 | Whether Physical Intelligence has published a successor to Recap after Nov 2025 | close-by-research | One fetch of the Physical Intelligence publications page before the build. Until then: "Recap (Nov 2025) is the newest Physical Intelligence RL paper this research located." (F04-60) |
| 04-U24 | Peer-review venue of HIL-SERL | accept-as-hedge | The arXiv record names no venue. Page cites it as "preprint (arXiv 2410.21845v3)". (F04-72) |

Not a row in the register: U10 (SimEX Table 2) was closed during wave 1 and is answered by F04-49.

#### Register 05 (data pipeline)

| ID | Unknown (short, plain words) | Triage | Reason, or the hedge the page carries |
|---|---|---|---|
| 05-U1 | Encoder settings behind the public SO-101 dataset's bytes, so its bytes per frame is one dataset's measurement and not the v0.7.0 default | close-by-experiment | Profiling project: `ffprobe` on the dataset's two MP4 files (any machine, minutes), or record at v0.7.0 defaults. Until then: "One dataset, one encoder setting." (F05-29, F05-30) |
| 05-U2 | H200 video engines and AV1 decode | close-by-experiment | Partly closed by wave 2: NVIDIA's H200 product page lists NVDEC and JPEG decoders. AV1 remains open and needs a decode test on a P5e or P5en instance. Until then: "NVIDIA's codec matrix has no H200 row, so AV1 hardware decode on P5e and P5en is not established." (F05-49, F05-67) |
| 05-U3 | Whether the matrix's A10 row applies to the A10G in EC2 G5 | accept-as-hedge | Page carries: "NVIDIA lists the A10; AWS's G5 card is the A10G variant, for which NVIDIA publishes no separate row." (F05-54) |
| 05-U4 | Jetson Orin Nano hardware decode codecs from a first-party page; release date of the current Jetson Linux | close-by-research | Fetch the Jetson Linux multimedia page for Orin and the release notes. Sections 9 and 10 name this device. (F05-57) |
| 05-U5 | Frames decoded per second per CPU core for the default AV1 settings on a named CPU | close-by-experiment | Profiling project: decode benchmark of a LeRobot dataset with torchcodec on Graviton and Intel EC2 instances and on the DGX Spark. Section 10's payoff line depends on it. Until then the page uses the repository's own per-item latency, labelled, hardware not stated. (F05-62, F05-107) |
| 05-U6 | A converter for LeRobot datasets older than v2.1 | cut | Section 9 gives one sentence on migration and F05-28 covers it. |
| 05-U7 | Collection calendar time for FastUMI-100K; other 2026 hand-held rig papers not read | cut | Section 9 cites the two rigs whose figures are already in the register (F05-9, F05-10); the unread papers are not needed. |
| 05-U8 | The exact rule behind Cosmos Curator's dedup threshold | close-by-research | Read the dedup stage code at v2.10.0. Section 10 explains the deduplicate step. (F05-73) |
| 05-U9 | A throughput figure for Cosmos Curator v2.x or its robot recipes | accept-as-hedge | Page carries: "The only published throughput figure is from a March 2025 NVIDIA post about NeMo Video Curator; none was located for Cosmos Curator 2.x." (F05-78) |
| 05-U10 | NeMo Curator's video hardware requirements at its current version | close-by-research | One fetch of the requirements page for the current release. Low priority: the section names NeMo Curator in one line. (F05-80) |
| 05-U11 | The paper behind LeRobot's progress-score reward model | close-by-research | Fetch the paper named in `sarm.mdx` at v0.7.0. (F05-82) |
| 05-U12 | Whether Isaac Lab v3.0.0 registers a Mimic environment for the SO-101 stacking task, and its generation time | close-by-research | Read the task registration files at the tag; same file pass as 04-U13. Generation time stays "No published generation time for the SO-101 task was located." (F05-93) |
| 05-U13 | A maintained successor to the GR00T-Mimic blueprint | close-by-research | Search NVIDIA's blueprint catalogue. Until then the page says the maintained path is Isaac Lab itself. (F05-94) |
| 05-U14 | Frame count of the Cosmos3-Nano transfer benchmark rows | accept-as-hedge | Page carries: "Seconds per clip; the clip length for these rows is not published." (F05-97) |
| 05-U15 | GPU memory needed by Cosmos3-Nano and Cosmos3-Super on one GPU | close-by-research | Read the Cosmos 3 model cards on the hub. Section 11 promises "memory and time per clip"; today the only memory figure is from the superseded model. (F05-95, F05-99) |
| 05-U16 | An AWS first-party source for Ray-based curation of robot video | accept-as-hedge | No first-party source located; the AWS stream owns the topic. Page carries: "No AWS reference for Ray-based curation of robot video was located in this research." (F05-104) |
| 05-U17 | Newest NVIDIA DALI release and whether it decodes AV1 on the GPU | close-by-research | Fetch the DALI release notes and supported-formats page. Section 10 mentions GPU-decode loaders as the case where the codec matrix matters. (F05-67) |
| 05-U18 | A per-hour teleoperation cost published by a lab | accept-as-hedge | Page carries: "No lab publishes a cost per teleoperation hour that this research located." One vendor's price list is the only figure. (F05-15) |
| 05-U19 | CPU load of the default software encoder for two cameras on the Orin Nano and the DGX Spark | close-by-experiment | Profiling project: record two 640x480 cameras at 30 fps with streaming encoding on each machine and log CPU use and dropped frames. (F05-45, F05-105) |

#### Register 06 (simulation, rendering, sim-to-real, evaluation)

| ID | Unknown (short, plain words) | Triage | Reason, or the hedge the page carries |
|---|---|---|---|
| 06-U1 | No first-party single-thread MuJoCo steps-per-second figure, and none for the SO-101 model | close-by-experiment | Profiling project: `testspeed` on the Menagerie `robotstudio_so101` model on the Jetson Orin Nano, the DGX Spark and the EC2 CPU families. Section 12 promises this figure. (F06-14, F06-15, F06-37) |
| 06-U2 | The MuJoCo Warp nightly benchmark has no row after 2026-09-03 | accept-as-hedge | Page carries: "Nightly benchmark of 2026-09-03 (commit 917a14b), the newest published; it predates the current MuJoCo Warp release." (F06-20) |
| 06-U3 | No published success rate for Playground's SO-101 vision task or NVIDIA's SO-101 typing project | accept-as-hedge | Needs real-arm trials, which the dive does not run. Page carries: "No success rate is published for either." (F06-26, F06-55) |
| 06-U4 | The physics timestep of the Playground SO-101 environment | close-by-research | Read the SO-101 scene XML and environment config at v1.0.1; the value is not in `task.py`. Section 12's worked example uses it. (F06-27) |
| 06-U5 | Playground 1.0 publishes no throughput | close-by-experiment | Profiling project: run Playground's own profiling suite for the SO-101 task on one GPU. Until then: "No throughput is published for Playground 1.0; the paper's figures are for the earlier JAX code." (F06-25, F06-32) |
| 06-U6 | Whether a specific EnvHub or LeIsaac SO-101 environment is current | cut | Sections 12 and 14 use the Playground and Isaac Lab SO-101 paths, both read at pinned tags. (F06-25, F06-54) |
| 06-U7 | Camera resolution behind the Isaac Lab Cartpole camera benchmark rows | close-by-research | Read the task config at v3.0.0; the benchmark file leaves the field empty. Section 13's strongest number pair rests on these rows. (F06-48) |
| 06-U8 | No first-party statement that the compute ray tracers are supported on GPUs without RT cores | close-by-experiment | Profiling project: run the MuJoCo Warp and Newton Warp camera renderers on a P-family instance. Until then: "NVIDIA states that headless Newton simulation needs no RTX hardware; it does not state that the Warp camera renderer is supported on GPUs without RT cores." (F06-51, F06-62) |
| 06-U9 | A100 and B200 product pages and an A10G datasheet not fetched | close-by-research | Three fetches, plus the AWS G7 page for the card wave 2 added to the RT-core list. (F06-58, F06-59, F06-60) |
| 06-U10 | No throughput figure for Gaussian-splat rendering in MuJoCo Warp | accept-as-hedge | Page carries: "No throughput figure with splats is published." (F06-78) |
| 06-U11 | SimReady specification pages not fetched | cut | Section 14 gives SimReady one sentence, which F06-80 supports. |
| 06-U12 | No 2026 publication from 1X with a quantified world-model evaluation result | cut | Section 16 has quantified results from other evaluators (F06-89, F06-90); the 1X post is used only for drift over time, with no correlation attributed to it. (F06-91) |
| 06-U13 | Isaac Lab-Arena's current version | accept-as-hedge | Page carries: "v0.3 (alpha) is the last announced version." (F06-92) |
| 06-U14 | Genesis: no first-party throughput figure read | cut | Genesis is not in section 12's simulator list in SCOPE.md. |
| 06-U15 | NVIDIA's Newton announcement speed-up claims not re-fetched | cut | Not carried; Isaac Lab's benchmark supplies absolute Newton figures. (F06-47) |
| 06-U16 | Correlation values for the MSE and LIBERO baselines in PolaRiS not extracted as numbers | cut | Section 16 quotes the paper's words for those baselines and takes its numbers for offline error from SIMPLER. (F06-81, F06-82) |
| 06-U17 | Seed rows for other simulators and posts not re-fetched | cut | Not carried into the register and not in the section plan. |
| 06-U18 | Venues not confirmed for SIMPLER, RoboArena, WorldGym and the Playground paper | accept-as-hedge | Wave 2 settled the Playground paper (the repository README calls it RSS 2025). The other three carry no venue on their arXiv records and are cited as "preprint". (F06-81, F06-88, F06-90) |
| 06-U19 | Units and gear of the SO-101 actuator gains assumed for the saturation arithmetic | close-by-research | Read the actuator definitions in the SO-101 XML at the pinned tag before section 14 prints any torque arithmetic. (F06-31) |
| 06-U20 | Isaac Sim's licence not recorded; Isaac Lab's reported two ways | close-by-research | Read the LICENSE files at the pinned tags; needed only if the simulator table has a licence column. (F06-44, F06-45) |

#### Counts per triage value

- Register 04 (23 rows): closed 1, close-by-research 2, close-by-experiment 4, accept-as-hedge 15, cut 1.
- Register 05 (19 rows): closed 0, close-by-research 8, close-by-experiment 4, accept-as-hedge 5, cut 2.
- Register 06 (20 rows): closed 0, close-by-research 5, close-by-experiment 3, accept-as-hedge 5, cut 7.

IDs are written register-U-number. Register 08's U08-n and register 09's U09-n become 08-Un and 09-Un.

#### Register 07 (edge and fleet)

| ID | Unknown (short, plain words) | Triage | Reason, or the hedge the page carries |
|---|---|---|---|
| 07-U1 | Which Orin module "Jetson Orin (MAXN)" is in NVIDIA's GR00T latency table | accept-as-hedge | "NVIDIA's table says 'Jetson Orin' without naming the module." Section 17's worked example uses this row, so the hedge sits beside it (F07-5). |
| 07-U2 | Thor video encode and decode stream counts per resolution | close-by-research | Read the Jetson Thor module datasheet before the build. If it is not fetched, the device table prints the product page's engine counts only and says stream counts were not located on that page (F07-40). |
| 07-U3 | Worst-case (p99 or maximum) policy latency on any Jetson | close-by-experiment | One LeRobot rollout with the cadence report, which prints "worst", on the Jetson Orin Nano (Tier 0 request row 9). Until then: "Every published figure is a median or a mean; the dive's own measurement is pending." (F07-3) |
| 07-U4 | Task success of a quantised (FP8 or NVFP4) policy, with episode counts | accept-as-hedge | "No published task-success number for a quantised policy on any Jetson was located." What exists is output similarity (F07-52) and an unquantised 19 of 20 on an H100 (F07-10). |
| 07-U5 | SmolVLA and ACT per-chunk latency on an Orin Nano or a laptop GPU | close-by-experiment | Phase 8 of the profiling hand-off: ACT or SmolVLA inference at 30 Hz on the Jetson Orin Nano and the Spark, recording p50 and p99 per call (Tier 0 request row 8). Until then the worked example uses the published GR00T N1.7 figure and says so (F07-117). |
| 07-U6 | A published latency tolerance for LeRobot remote inference, and a measured robot-to-Local-Zone round trip | accept-as-hedge | "LeRobot states that operating through a router or a private hosted GPU has not been validated yet; no published robot-to-Local-Zone latency was located in this research." (F07-29, F07-115) |
| 07-U7 | Whether and by how much Jetson list prices rose in July 2026 | cut | Press-only. The page prints today's suggested prices with their date and states no percentage rise (F07-42, F07-43). |
| 07-U8 | Release date of JetPack 7.2.2 | closed | Closed by wave 2 to the build date: packages built 12 November 2026 (`nvidia-l4t-core 39.2.2-20261112230500`), recorded in the register's UNKNOWN row for F07-44. |
| 07-U9 | Which TensorRT version JetPack 7.2.2 installs | closed | Closed by wave 2: 11.4.1, from the Jetson apt index; 10.16.2 was JetPack 7.2 and 7.2.1. Consistent with F07-76. |
| 07-U10 | DGX Spark current price | accept-as-hedge | "NVIDIA's product page lists no price." (F07-48) |
| 07-U11 | Camera exposure and readout, USB transfer and servo bus write times on an SO-101 | close-by-experiment | Same session as 07-U3: the cadence report's "observe" and "send" stages on the arm's own computer (Tier 0 request row 9). Until then the latency-budget diagram shows these links as "not published; measure with the cadence report" (F07-118). |
| 07-U12 | Whether an engine built on a T5000 loads on a T4000 | accept-as-hedge | "Same GPU generation; NVIDIA documents a small performance drop across models of one generation on desktop GPUs and says nothing for Thor modules." No T4000 is named as available for a test (F07-80). |
| 07-U13 | Which precisions (FP8, FP4) TensorRT 11.5 accelerates on Orin and Thor | close-by-research | Read the support matrix's precision selector in a browser (it is script-driven). The one sentence on hand covers compute capability 10.3 only (F07-81 wave 2 line). Until read, the page says nothing about Orin's or Thor's accelerated precisions beyond F07-83. |
| 07-U14 | Policy latency under TensorRT Edge-LLM 0.12.0 | close-by-research | One fetch of the project's performance-benchmarks page. If it has no policy row: "No latency figure for a policy under Edge-LLM was located." (F07-82) |
| 07-U15 | AWS's stated replacement for RoboMaker, from a first-party page | cut | Cut the "replacement" sentence, keep the date. The page says RoboMaker reached end of support on September 10, 2025 (F07-98) and cites AWS's current guidance pages for where simulation runs (F09-78, F09-113). |
| 07-U16 | Whether the KVS Edge Agent is still actively offered | accept-as-hedge | Not load-bearing. If mentioned: "access is by request form, and the page still lists a retired install option" (F07-105). |
| 07-U17 | SAFE's added latency per step | accept-as-hedge | "The paper states no runtime overhead figure." (F07-111) |
| 07-U18 | A named operator's first-party description of shadow-mode or canary rollout of a learned policy | accept-as-hedge | "No first-party description by a named robot operator was located in this research." Shadow mode and canary are described as general software practice, labelled [our reading] (F07-114). |
| 07-U19 | GPU type and count of the fleet learner in "Learning While Deploying" | cut | Section 18 uses the loop's latencies and robot count (F07-108, F07-109); the learner's hardware is not needed and the paper does not state it. |
| 07-U20 | Whether a `docker:` image artifact counts against the 2 GB component artifact quota | accept-as-hedge | Not load-bearing. "The quota page does not say whether a container image referenced by a component counts toward the artifact limit." (F07-87, F07-88) |

#### Register 08 (compute shapes)

| ID | Unknown (short, plain words) | Triage | Reason, or the hedge the page carries |
|---|---|---|---|
| 08-U1 | Whether 6 slots per cycle is Arm's documented value for the Cortex-A78AE | accept-as-hedge | "Derived from the counters; Arm publishes no telemetry file for this core." (F08-68, F08-16) |
| 08-U2 | Which events make up the "reduced set" on smaller EC2 sizes | close-by-experiment | `perf list` on c9g.2xlarge and c9g.12xlarge (Tier 0 request row 10). Until then: "AWS documents a 'reduced set' on smaller sizes without listing it." (F08-26) |
| 08-U3 | Which G and P instance sizes expose which CPU PMU events | close-by-experiment | `perf list` on g6e.xlarge, g6e.48xlarge, g7.48xlarge, p5.48xlarge (Tier 0 request row 11). Until then: "AWS's PMU table names no G or P family." (F08-28) |
| 08-U4 | Whether any NVIDIA tool exposes ray-tracing core utilisation | close-by-experiment | Phase 4 of the hand-off records whether any counter moves when ray-tracing cores are used (Tier 0 request row 4). Until then: "No ray-tracing-core counter was located in the tools read (Nsight Compute, nvidia-smi, DCGM, tegrastats)." (F08-36) |
| 08-U5 | Whether a Rubin-based EC2 family exists or is announced | closed | Closed by wave 2 as far as pages allow (F08-55 wave 2 line): Rubin GPUs announced for 2027 to 2028, no EC2 family named as of 20 November 2026. |
| 08-U6 | Every price: On-Demand, Spot, Capacity Block, for every family | close-by-research | Partly closed: Capacity Block prices are fetched and dated in F09-93. On-Demand and Spot need the pricing page read in a browser or the bulk price list. Until then those dollar columns stay empty (F08-59). |
| 08-U7 | The `-funroll-loops` follow-up on the X925 triad kernel | cut | No raw file in the experiments folder holds it; it is not Tier 0 and is not printed (F08-73). |
| 08-U8 | The blank-cell inheritance rule in Intel's TMA file, and so the pipeline width for Granite Rapids and Emerald Rapids | close-by-research | Read the per-platform JSON under `GNR/` and `EMR/` in the same repository at the pinned SHA. Until then no width is printed for a specific EC2 processor (F08-8). |
| 08-U9 | The H200's video engines and AV1 decode support | accept-as-hedge | "NVIDIA's support matrix has no row for the H200." (F08-44) |
| 08-U10 | How much of the Tier 0 render workload ran on the GPU | close-by-experiment | Re-run with `MUJOCO_GL=osmesa` against `egl`, with tegrastats or nvidia-smi sampling, on the Jetson and the Spark (Tier 0 request row 13). Until then the render row carries "GPU share not established" (F08-64). |
| 08-U11 | Launch dates of the older G and P families and the Graviton4 families | cut | Low value; the instance table drops the date column for rows not re-fetched (F08-58). |
| 08-U12 | The body of Yasin's 2014 paper | cut | The dive needs one sentence of history, which Intel's own README supports (F08-1). |
| 08-U13 | Whether GPU physics (MuJoCo Warp, PhysX) uses the tensor pipeline at all | close-by-experiment | Nsight Compute ComputeWorkloadAnalysis on one MuJoCo Warp step, inside phase 4 (Tier 0 request row 4). Until then "general GPU compute, not tensor cores" stays [our reading] (F08-42). |
| 08-U14 | vCPU, memory, network and GPU count per instance for P6e-GB300 | accept-as-hedge | "P6e-GB300 has no row in the EC2 specification table; it is shown from its announcement only." (F08-54) |
| 08-U15 | Whether the DGX Spark's kernel exposes STALL_FRONTEND_FLUSH and the level-2 stall events | close-by-experiment | `perf list` on the Spark, or the raw event code 0x8162 (Tier 0 request row 12). This decides whether the flush correction of F08-19 can be applied to our numbers. |
| 08-U16 | Whether the r39.2.2 tegrastats page applies unchanged to the Orin Nano on L4T R36 | close-by-research | Read the r36.x copy of the same page. If not read: "definitions from the r39.2.2 guide" beside the tegrastats fields (F08-40). |
| 08-new | Pass 1 against pass 2: the stall split of the triad and memory-write microbenchmarks does not reproduce (wave 2 addition, not a register row) | close-by-experiment | Repeat those kernels with one binary (Tier 0 request row 14). Until then: "The three workload rows reproduce across two passes; the microbenchmark stall splits are single-pass and are not printed." (F08-73) |

#### Register 09 (AWS orchestration)

| ID | Unknown (short, plain words) | Triage | Reason, or the hedge the page carries |
|---|---|---|---|
| 09-U1 | Time from Batch job submission to container start on a cold GPU compute environment | accept-as-hedge | "AWS gives 'a few minutes' for a new EC2 instance and no figure for a GPU job with a multi-GB simulator image." (F09-1) The profiling project measures machines, not service start-up, so this is not sent to it. |
| 09-U2 | How a Batch multi-node job with EFA runs inside a Capacity Block, when Batch asks for a placement group and blocks refuse one | accept-as-hedge | "How a Batch multi-node job with EFA is placed inside a Capacity Block is not documented." The decision table does not recommend that combination (F09-9, F09-92). |
| 09-U3 | Whether checkpointless training works for a robot policy or world-model loop | accept-as-hedge | "The documented recipes are language models; no robotics example was located in this research." (F09-30) |
| 09-U4 | Whether any G-family type can be bought through a SageMaker training plan | closed | Wave 2 accepts the documentation: the training-plans page lists no G type on 20 November 2026 (F09-35). The page carries "Training plans cover P and Trainium types only (documentation, 20 November 2026)" and drops the May 2026 post's claim. |
| 09-U5 | Whether HyperPod shipped features between September and November 2026 beyond the 16 November release note | closed | Wave 2 read the What's New feed and found the 18 November 2026 pod-density post (F09-37 wave 2 line, F09-115). |
| 09-U6 | The EKS Auto Mode management fee for G and P instance types | close-by-research | Read the pricing page in a browser (its per-instance table is script-rendered). Until then print only the `c6a.2xlarge` example with its label (F09-51). |
| 09-U7 | Whether HyperPod topology-aware scheduling works with HyperPod-managed Karpenter | cut | The dive names both features separately and does not recommend the combination; multi-node pretraining is vendor scale for this reader (F09-27, F09-56). |
| 09-U8 | How a Jetson joins an OSMO backend, and whether that works with EKS Hybrid Nodes | accept-as-hedge | "OSMO's how-to runs a policy on a Jetson platform; how the Jetson joins the cluster is not described, Jetson Linux is not in the EKS Hybrid Nodes validated list, and the AWS sample's edge component is 'Planned'." (F09-67, F09-52, F09-70) |
| 09-U9 | How often a Spot request for a GPU type is fulfilled at all | accept-as-hedge | "A low interruption bucket does not say a Spot request is fulfilled." (F09-96) |
| 09-U10 | Which GPU families Deadline Cloud service-managed fleets offer | close-by-research | Partly closed: G7 since 18 November 2026 (F09-117). One fetch of the Deadline Cloud fleet documentation settles G6e and G7e; until then the page names G7 only. |
| 09-U11 | Publication or revision dates of the two AWS guidance pages | accept-as-hedge | "The fetched page shows no date." Both are cited with their access date only (F09-78, F09-113). |
| 09-U12 | Region list for G7 and G7e today | close-by-research | Fetch the EC2 instance-types-by-Region page. Until then no Region list is printed: the launch list is out of date (F09-98 wave 2 line). |

Two further wave 2 items in register 09 are contradictions, not UNKNOWN rows, and keep their wave 2 hedges: how P6e-GB300 is bought ("GB300 UltraServers are obtained through AWS sales; the self-service Capacity Blocks list shows GB200 only", F09-99) and the Batch placement-group conflict (covered by 09-U2).

#### Counts per triage value

- Register 07 (20 rows): closed 2, close-by-research 3, close-by-experiment 3, accept-as-hedge 9, cut 3.
- Register 08 (16 register rows, plus 1 wave 2 addition): closed 1, close-by-research 3, close-by-experiment 7 (6 register rows plus the wave 2 addition), accept-as-hedge 3, cut 3.
- Register 09 (12 rows): closed 2, close-by-research 3, close-by-experiment 0, accept-as-hedge 6, cut 1.

## 7. Gates before building the app

The iteration flywheel (ADR-003) puts Gate 1 between research and build. For this dive Gate 1 has five checks.
All five must pass before `src/sections/` exists.

1. **Scope held.** `SCOPE.md` states the reader, thesis, questions and the 26-section plan; every change to the plan
   approved on 2026-11-19 is recorded with its reason; every section names what it gives the reader (mental model or
   practical value); Getting Started sits at position 2 with the reading routes.
2. **Load-bearing claims verified.** Wave 2 has a verdict for every load-bearing claim in the registers. Every
   WRONG, STALE and SCOPE NARROWER is applied to the registers and to `SCOPE.md`. Every number in `SCOPE.md` carries
   a register ID.
3. **UNKNOWNs triaged.** Every UNKNOWN is marked close-by-research, close-by-experiment, accept-as-hedge or cut.
4. **Freshness and Tier 0.** Every product version in the registers was fetched on the access date, none from
   memory; a 15-number spot check against re-fetched sources is recorded; the Tier 0 results on hand are in
   `research/experiments/` with provenance, and sections 22 and 23 carry their condition.
5. **Human approval.** Carlos reads `SCOPE.md` and this guide and approves the section list, or names cuts, and
   answers the open decisions listed in the Gate 1 record.

### Gate 1 record (2026-11-20)

| Check | Result | Evidence |
|---|---|---|
| 1. Scope held | PASS | `SCOPE.md` states the reader, thesis, nine questions and the 26-section plan in the approved order. Twelve changes (C1 to C12) are recorded with reasons; none adds, removes or moves a section. Every section has a "Gives" line. Getting Started is section 2 and carries the three reading routes. |
| 2. Load-bearing claims verified | PASS, with the coverage limit stated below | 639 verdict rows in the three wave 2 files: 600 HOLDS, 25 SCOPE NARROWER, 4 WRONG, 9 STALE, 0 UNVERIFIABLE. All 38 corrections are applied: 36 entries carry a "Wave 2" line, six entries were added (F07-119, F08-86, F09-115 to F09-118), currency tables and UNKNOWN rows were updated. `SCOPE.md` "Numbers by section" holds 353 figures; a script found each of their 2,024 numbers in the text of the entries cited beside it. |
| 3. UNKNOWNs triaged | PASS | 155 of 155 rows have a triage value (section 6); a script compared the IDs in each register's section 9 with the triage tables and found none missing and none extra. |
| 4. Freshness and Tier 0 | PASS | Each register opens with a currency table of versions fetched on 2026-11-20, and wave 2 re-checked them against release pages. Spot check: 15 of 15 (below). Tier 0 results are in `research/experiments/` with checksums and limits; sections 22 and 23 carry their condition in `SCOPE.md`. |
| 5. Human approval | PASS (2026-11-20, by voice) | Carlos approved the 26-section plan as one dive and answered the open decisions; his answers are recorded under "Gate 1 decisions" below. |

**Coverage limit on check 2.** Not every entry was read by a second agent against its claim sentence. Wave 2 B
hand-checked about 91 of its 297 rows and matched the quote by script for the rest. Wave 2 C did the same for 37
entries of register 09 and did not check the `[our reading]` entries F08-74 to F08-83. Wave 2 A skipped the entries
listed in its file. A quote match shows the source says the quoted words; it does not show the claim sentence adds
nothing. Section writers re-read the entry against its quote before printing a figure, and wave 4 (pre-build design)
does this per section.

**Spot check (check 4).** Fifteen entries drawn with a fixed random seed (20261120), at least one per register; the
source was fetched again by the orchestrator and searched for the entry's number or quote.

| Entry | Register | Found in the re-fetched source |
|---|---|---|
| F01-48 | 01 robot basics | yes |
| F02-22, F02-27, F02-66 | 02 imitation and VLAs | yes, all three |
| F03-31 | 03 world models and JEPA | yes |
| F04-70, F04-77 | 04 RL and agentic loops | yes, both |
| F05-47 | 05 data pipeline | yes |
| F06-79 | 06 simulation | yes |
| F07-25 | 07 edge and fleet | yes |
| F08-47, F08-49 | 08 compute shapes | yes, both |
| F09-15, F09-50, F09-88 | 09 AWS orchestration | yes, all three |

15 of 15. Two needed whitespace normalised (a PDF line break, an HTML table); for F09-88 the page prints the
multiplication sign where the register writes "8x".

**Structural check.** A script read all 915 entries for the four required lines and a pinned source. It flagged 28:
`[derived]` joins of other entries, method entries, recorded absences, `[our reading]` entries, and entries that cite
the AWS toolchain sample by a short alias for its pinned commit (84984decc51cc07fb4ceb8f3fc1f85d523924bf5). None is
an external number without a source.

**Gate 1 decisions (Carlos, 2026-11-20, by voice; quoted words are his).** Gate 1 check 5 is PASS.

1. One dive, no split: "definitely go for all of it in one dive", "including the AWS parts, which are super
   important to spend time on those as appropriate. Have the right configuration, the right diagrams, spend time
   also even in animating the diagrams."
2. GR00T 2 is taught as current: "Yes, absolutely." It keeps its label (whitepaper, code not yet released), and
   GR00T N1.7 stays the newest downloadable model.
3. Sections 22 and 23 are built "a bit open": what exists for the Jetson Orin Nano and the DGX Spark as edge
   devices, with placeholders for what the profiling project will bring (EC2 P, G and Graviton runs, GPU
   counters). He will run those against his own AWS account later.
4. A gap he named: "the part that is missing with those is a bit of the IoT aspect, the Greengrass IoT aspect on
   AWS. We have not hooked yet your configuration to AWS." Sections 17, 18 and 24 teach the Greengrass and IoT Core
   path from first-party documentation and carry a placeholder for the measured hook-up of his Jetson and Spark.
5. The four content-changing unknowns are closed before the build: "Go ahead and research that." (Wave 3,
   `research/2026-11/wave3-unknowns.md`.)
6. No dollar figures for now: "you can ship things without dollar figures. We will add the dollar figures on a
   second round if needed." Section 23 keeps its method and a placeholder for prices.
7. The thread task: NOT decided; he asked for more context. The assistant's default until he decides: the story
   stays block-in-cup, and MuJoCo Playground's shipped SO-101 pick-cube task is the first-party worked case for the
   pick half. The wording lives in `src/lib/task.ts` so a switch is a small edit.
8. The reservation claim: NOT escalated; he asked not to worry about it now. The page states it with its scope and
   date ("the lists read on 2026-11-20 name no G-family type").

Placeholders are his explicit instruction for sections 22 and 23, the IoT hook-up and prices, and override the
no-draft-residue rule for those cases only.

The decisions as they were put to him:

**Open decisions for Carlos at Gate 1.**

1. **One dive of 26 sections, or a split.** The registers support all 26. The page will be long: section 7 (JEPA)
   alone has 20 planned figures. A split would cut at Part 7 (compute and AWS, sections 20 to 25).
2. **Whether GR00T 2 is taught as current.** It is a November 2026 NVIDIA whitepaper with code "Available in
   December" (F03-104). The plan shows it as the newest world-action model with that label, and keeps GR00T N1.7 as
   the newest model a reader can download.
3. **Sections 22 and 23 without the profiling project.** Today's Tier 0 is stand-in workloads on two edge machines,
   no EC2 instance, no price-performance figure. Option A: ship both sections with stand-ins labelled. Option B: hold
   both until the 14 requested runs (section 5) land. The recommendation is A for section 21's method and B for any
   chart in 22 and 23 that compares machines.
4. **Which close-by-research items to close before the build.** 32 are listed in section 6. The ones that change a
   section's content: the LeRobot v0.7.0 policy packages not yet read (02-U8), Cosmos 3 memory needs (05-U15), the
   camera resolution behind the Isaac Lab rendering benchmark (06-U7), the Playground SO-101 timestep (06-U4).
5. **Prices.** Only Capacity Block prices were fetched (F09-93). On-Demand and Spot prices for the G and P families
   were not collected (F08-59). Either a dated price pass runs before section 23 is written, or section 23 ships its
   method without dollar figures.
6. **The task itself.** The first-party SO-101 sim-to-real task picks a cube up and has no published success rate
   (F06-26). Placing it in a cup is the dive's own extension. Decide whether the thread task stays block-in-cup or
   becomes the shipped pick-cube task so that every stage has first-party code behind it.
7. **Reservations for simulation.** No G-family type is on the Capacity Blocks or training plans lists (F09-91,
   F09-35). For training plans, an AWS post of May 2026 is the origin of the seed's claim that G6 can be reserved; the
   documentation list fetched on 2026-11-20 has no G-family type. Decide whether to ask the service
   team before the page states this, since it is the finding most likely to be challenged.

## 8. Budget record

| Item | Count |
|---|---|
| Subagents started | 15: nine register agents (wave 1), three refutation agents (wave 2), three read-only integration agents |
| Most subagents running at once | 3 |
| Tool uses reported by wave 1 agents | 837 (64, 80, 115, 94, 90, 105, 88, 90, 111 for registers 01 to 09) |
| Tool uses reported by wave 2 agents | 279 (96, 101, 82) |
| Tool uses reported by integration agents | 62 (19, 21, 22); no network access |
| Sources fetched in wave 2, as each file states | about 185 (A), 201 (B), about 250 (C). C exceeded the brief's guide of 120 because it ran the quote check over every cited URL. |
| Orchestrator fetches | 15, for the spot check |
| Registers written | 9, with 915 entries |
| App sections modified | 0 (none exist) |
| Cloud resources, hardware runs, pushes | 0 |

A tool use is any call an agent made (fetch, search, file read or write), so the wave 1 and wave 2 figures are an
upper bound on fetches. The brief's guide was about 80 fetches per register agent and about 120 per refutation agent.
