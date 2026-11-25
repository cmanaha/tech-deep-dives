# 04 Reinforcement learning for robots, and agents that run the loop: claim register

## 1. Header

- **Research date:** 2026-11-20. Every URL in this file was accessed 2026-11-20.
- **Area:** stream 04 of the "Physical AI" dive. Part A: reinforcement learning (RL) for robots in three settings (in simulation, on top of a pretrained policy, on the real robot). Part B: coding agents that run the robot-learning loop themselves (ENPIRE and its siblings), who grades them, and what compute they request and waste.
- **Sections fed:** section 8 "Reinforcement Learning for Robots" and section 19 "Agents Running the Loop".
- **Out of scope here:** RL basics (policy gradient, PPO, reward, advantage) are owned by the sibling dive `deep-dives/rl-agentic-loops/`; this register gives one sentence and the note "link to the Learning From Feedback dive". Simulator internals are stream 06. AWS scheduler detail is stream 09; only the first-party guardrail facts are recorded here.
- **Reader:** technical, level 100 to 200, no robotics background. The thread task: an SO-101 arm picks up a block and places it in a cup.
- **Quote policy:** quotes are verbatim from the pinned version, with house normalisation: curly quotes become straight quotes, long dashes become " - " or a hyphen, inline math is shown as plain text. Ellipses mark omissions. The multiplication sign is shown as "x", plus-minus as "+/-", Greek letters by name (pi, epsilon, beta, lambda), arrows as "->". PDF text was extracted with `pdftotext`; line-break hyphenation is rejoined.
- **Verdicts:** NEW (recorded fresh from the primary source); CARRIED (seed NN, re-fetched); STALE (superseded by ...); WRONG (seed said X; source says Y); UNKNOWN (unresolved, see the UNKNOWN register).
- **Labels:** `[author reported]` and `[vendor claim]` for performance figures; `[derived]` for arithmetic, with inputs; `[our reading]` for synthesis; "read off Fig. N" for a value taken from a chart, always given as a range.
- **Seed research:** "seed 01" is the models-and-learning file (sections 3.4, 16, 17); "seed 05" is the agentic-loops file. Both read-only; every carried claim was re-fetched.

### Tiers

| Tier | What it covers |
|---|---|
| Tier 0 | Our experiments (none in this file) |
| Tier 1 | Source code at a pinned tag or 40-character SHA; official docs; API references |
| Tier 2 | First-party vendor or lab blogs, project pages and talks |
| Tier 3 | Papers ("peer-reviewed (venue)" only where the venue was confirmed; otherwise "preprint"); third-party technical analysis |
| Tier 4 | Tutorials and press. Used only to locate primary sources |

## 2. Currency table

Newest first-party version found on 2026-11-20 for every item this register names. "Seed" is what the seed research named or read.

| Item | Newest version found | Date | Source | What the seed named |
|---|---|---|---|---|
| ENPIRE paper | arXiv 2606.19980v2 (CoRL 2026) | v1 18 Jun 2026; v2 20 Sep 2026 | https://arxiv.org/abs/2606.19980 | v2 (same) |
| ENPIRE code | No tagged release; default branch at SHA 99ee90ac | last commit 2026-09-09 | https://github.com/NVlabs/ENPIRE | repo cited at its default branch, no pin |
| ASPIRE paper | arXiv 2607.00272v2 | v1 30 Jun 2026; v2 20 Oct 2026 | https://arxiv.org/abs/2607.00272 | v1 (v2 adds dollar costs and the Rubik's Cube study) |
| ASPIRE code | No tagged release; default branch at SHA fa00f0ef | last commit 2026-10-16 | https://github.com/NVlabs/ASPIRE | repo cited at its default branch, no pin |
| "You Don't Need To Stay in The Loop" (AgenticRobotics) | arXiv 2608.07555v2 | v2 8 Nov 2026 | https://arxiv.org/abs/2608.07555 | v2 (same) |
| SimEX | arXiv 2609.38982v1 | 30 Sep 2026 | https://arxiv.org/abs/2609.38982 | v1 (same) |
| CaP-X paper and code | arXiv 2603.22435v2; capgym/cap-x v0.0.1 | v2 2 Jul 2026; tag 2026-04-01 | https://arxiv.org/abs/2603.22435 | named |
| SEAR, AdaRSI, Physical RSI survey, RE-0 | 2610.18792v1; 2610.20474v2; 2610.18842v1; 2609.32416v1 | 13 Oct; 17 Nov; 13 Oct; 26 Sep 2026 | arXiv listings | not in the seed |
| pi*0.6 / Recap | arXiv 2511.14759v2 | 19 Nov 2025 | https://arxiv.org/abs/2511.14759 | named; no newer Physical Intelligence RL paper was located in this pass (U23) |
| GR00T 2 real-robot RL | First-party page (no paper located for the RL stage) | page read 2026-11-20; publication date not re-confirmed | https://research.nvidia.com/labs/gear/gr00t-2/ | same page |
| piRL paper | arXiv 2510.25889v3 | 29 Jan 2026 | https://arxiv.org/abs/2510.25889 | named |
| RLinf (framework behind piRL and the AWS GRPO recipe) | v0.4, SHA 2348ece3 | 2026-10-20 | https://github.com/RLinf/RLinf/releases/tag/v0.4 | named |
| AWS sample `sample-rfm-simulation-on-aws` | v1.0.0 (SHA 1baf622d); default branch at SHA 66e0fbef carries the RL target | tag 2026-10-22; head 2026-11-19 | https://github.com/aws-samples/sample-rfm-simulation-on-aws | GRPO figures cited without a pin; they are not in v1.0.0 |
| HIL-SERL paper (history) | arXiv 2410.21845v3 | v1 Oct 2024; v3 20 Mar 2025 | https://arxiv.org/abs/2410.21845 | named |
| HIL-SERL reference code | No release; SHA c32939bc | last commit 2025-10-27 | https://github.com/rail-berkeley/hil-serl | paper named |
| LeRobot | v0.7.0, SHA 410c095e (previous: v0.6.1, 2026-08-03) | 2026-11-05 | https://github.com/huggingface/lerobot/releases/tag/v0.7.0 | LeRobot's RL implementation was not covered |
| LWD (fleet RL) | arXiv 2605.00416v4 | 16 Sep 2026 | https://arxiv.org/abs/2605.00416 | named by ID |
| Isaac Lab | v3.0.0, SHA e3f7d9ff (targets Isaac Sim 6.2) | 2026-10-20 | https://github.com/isaac-sim/IsaacLab/releases/tag/v3.0.0 | no Isaac Lab throughput figure |
| MuJoCo Playground | v1.0.1, SHA 084e7957 (v1.0.0 on 2026-11-06: PyTorch rewrite on MuJoCo Warp) | 2026-11-09 | https://github.com/google-deepmind/mujoco_playground/releases/tag/v1.0.1 | not covered; the 2025 paper is 2502.08844v1 |
| Newton physics engine | v1.8.0, SHA 425db81f | 2026-11-11 | https://github.com/newton-physics/newton/releases/tag/v1.8.0 | stream 06 owns; Isaac Lab 3.0 targets 1.6.1 |
| Eureka, DrEureka (history) | 2310.12931v2 (ICLR 2024); 2406.01967v1 (RSS 2024) | 2023; 2024 | arXiv listings | named |
| VLM judges: FailBench, D&A, VLMeg, ARS | 2609.03611v1; 2611.03622v1; 2610.15401v1; 2609.34484v1 | Sep to Nov 2026 | arXiv listings | named |
| RACaP | arXiv 2609.29394v1 | Sep 2026 | https://arxiv.org/abs/2609.29394 | named |
| AWS Batch user guide (timeouts, fair share, consumable resources) | living docs | accessed 2026-11-20 | https://docs.aws.amazon.com/batch/latest/userguide/ | named (seed 05 section 10.2) |
| Amazon Bedrock AgentCore limits page | living docs | accessed 2026-11-20 | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/bedrock-agentcore-limits.html | named (seed 05 section 8.4); values unchanged |

## 3. Pinned sources

### Papers

| Short name | arXiv ID and version read | Venue status | Entries |
|---|---|---|---|
| ENPIRE | 2606.19980v2 | peer-reviewed (CoRL 2026, per arXiv comment and project page) | F04-1 to F04-26, F04-48 |
| ASPIRE | 2607.00272v2 | preprint | F04-27 to F04-33 |
| AgenticRobotics ("You Don't Need To Stay in The Loop") | 2608.07555v2 | preprint (single author, labelled a preview) | F04-34 to F04-38 |
| Eureka | 2310.12931v2 | peer-reviewed (ICLR 2024, per arXiv comment); history | F04-39 |
| DrEureka | 2406.01967v1 | peer-reviewed (RSS 2024, per arXiv comment); history | F04-40 |
| CaP-X | 2603.22435v2 | preprint | F04-41 |
| RACaP | 2609.29394v1 | preprint | F04-42 |
| SimEX | 2609.38982v1 | preprint | F04-43, F04-44, F04-49 |
| FailBench | 2609.03611v1 | preprint | F04-45 |
| D&A | 2611.03622v1 | preprint | F04-46 |
| VLMeg | 2610.15401v1 | preprint | F04-47 |
| ARS | 2609.34484v1 | preprint | F04-47 |
| MuJoCo Playground | 2502.08844v1 | peer-reviewed (RSS 2025, per the repository README) | F04-56 |
| pi*0.6 / Recap | 2511.14759v2 | preprint | F04-60 to F04-67 |
| piRL | 2510.25889v3 | preprint | F04-69 |
| HIL-SERL | 2410.21845v3 | preprint (venue not confirmed in this pass, U24); history | F04-72 to F04-74 |
| LWD ("Learning While Deploying") | 2605.00416v4 | preprint | F04-75 |
| SEAR | 2610.18792v1 | preprint | F04-82 to F04-84 |
| AdaRSI | 2610.20474v2 | preprint | F04-85 |
| Physical RSI survey ("Who Improves the Robot?") | 2610.18842v1 | preprint (survey) | F04-86 |
| RE-0 | 2609.32416v1 | preprint (abstract only) | F04-87 |

### Code

| Repository | Tag | 40-character SHA | Files read |
|---|---|---|---|
| NVlabs/ENPIRE | none (default branch, 2026-09-09) | 99ee90acf65b5b18957c8382ad580db999528be3 | `README.md`, `enpire/policy/autoresearch_instruction.md`, file tree |
| NVlabs/ASPIRE | none (default branch, 2026-10-16) | fa00f0ef2bc1d91d594b9aa502c22133c9f538f7 | `README.md`, file tree |
| huggingface/lerobot | v0.7.0 | 410c095eacc0011d998a73383eb94abed2715af0 | `docs/source/hilserl.mdx`, `src/lerobot/policies/gaussian_actor/configuration_gaussian_actor.py`, `src/lerobot/rl/algorithms/sac/configuration_sac.py`, `src/lerobot/rl/data_sources/data_mixer.py`, file tree of `src/lerobot/rl/` |
| isaac-sim/IsaacLab | v3.0.0 | e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4 | `docs/source/_static/benchmarks/environment-performance-release.csv`, `docs/source/_static/benchmarks/README.md`, release notes, file tree (SO-101 paths) |
| google-deepmind/mujoco_playground | v1.0.1 | 084e7957842792725d70866ee840d8fd79f17bbe | `README.md`, `mujoco_playground/tasks/manipulation/pick_cube/so101/task.py`, `.../so101/deploy/README.md`, `mujoco_playground/_src/rl/rsl_rl/env_rl_config.py` |
| newton-physics/newton | v1.8.0 | 425db81f01e402b51f96f560e154d529d645c6de | release listing only |
| aws-samples/sample-rfm-simulation-on-aws | v1.0.0 | 1baf622dc6c7ebfd91035d803149d58bbed4fddb | checked that the RL target is absent |
| aws-samples/sample-rfm-simulation-on-aws | none (default branch, 2026-11-19) | 66e0fbef60d4d345d72c38505d3911d6a4cfff89 | `README.md`, `CHANGELOG.md`, `docs/results.md`, `docs/cost.md`, `docs/architecture.md`, `models/rlinf-oft-libero.yaml` |
| RLinf/RLinf | v0.4 | 2348ece3df113874671478be1360ae3115b346e3 | release listing only (the pin the AWS sample uses) |
| rail-berkeley/hil-serl | none (default branch, 2025-10-27) | c32939bccb65f3b8c43a9f9add3d322d4ab0264a | commit listing only |
| capgym/cap-x | v0.0.1 | not recorded | release listing only |

### Docs and first-party pages

- ENPIRE project page: https://research.nvidia.com/labs/gear/enpire/ and the chart data in its script bundle, https://research.nvidia.com/labs/gear/enpire/_next/static/chunks/11dgx9quo0zhy.js (Tier 2; the bundle file name can change when the page is rebuilt).
- GR00T 2 page: https://research.nvidia.com/labs/gear/gr00t-2/ (Tier 2).
- AWS Batch user guide: job timeouts, https://docs.aws.amazon.com/batch/latest/userguide/job_timeouts.html ; fair-share scheduling, https://docs.aws.amazon.com/batch/latest/userguide/fair-share-scheduling.html ; resource-aware scheduling, https://docs.aws.amazon.com/batch/latest/userguide/resource-aware-scheduling.html (Tier 1).
- Amazon Bedrock AgentCore limits: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/bedrock-agentcore-limits.html (Tier 1).

## 4. Claim register

Order: headings A to E and K cover agents running the loop (section 19); headings G to J cover RL for robots (section 8). There is no heading F. Entries are numbered in the order they were written, so section 8 entries are F04-54 to F04-81.

### A. ENPIRE: a coding agent runs the real-robot improvement loop (section 19)

Sources for this heading: the paper at v2 read in full from the PDF, appendices A to D included (28 pages); the repository at a pinned SHA; the first-party project page and the chart data embedded in its script bundle. ENPIRE v2 = arXiv 2606.19980v2, "ENPIRE: Agentic Robot Policy Self-Improvement in the Real World" (NVIDIA, CMU, UC Berkeley), dated 20 Sep 2026.

**F04-1. ENPIRE is a harness for coding agents built from four modules whose initials give the name: Environment (EN: automatic reset and verification), Policy Improvement (PI), Rollout (R), Evolution (E). The loop it runs is reset the scene, execute a policy, verify the outcome, refine.**
- Location: 2606.19980v2, Abstract; repo `README.md` lines 17 to 24.
- Verdict: CARRIED (seed 05 section 1, re-fetched). The seed did not spell out the acronym.
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026: arXiv comment "2026 Conference on Robot Learning"; project page "Accepted to CoRL 2026") | definition | "we introduce ENPIRE, a harness framework for coding agents that instantiates this physical feedback routine with four core modules: an Environment module (EN) for automatic reset and verification, a Policy Improvement module (PI) that launches policy refinement, a Rollout module (R) to evaluate policies with single or multiple physical robots operating in parallel, and an Evolution module (E) in which coding agents analyze logs, consult literature, improve training infrastructure and algorithm code to address failure modes." (accessed 2026-11-20)
- Use in dive: section 19, the opening definition and the label set for the loop diagram. The repo README states the same loop as "reset -> execute -> verify -> record -> refine" (README at SHA 99ee90ac, written there with arrows).

**F04-2. ENPIRE runs in two stages. Stage one (EN) is human-guided and one-off: agents build the safety limits, the automatic reset and the verifier for one task, and these are then frozen as immutable APIs. Stage two (PIRE) is autonomous: agents improve the policy using only the verifier's signal.**
- Location: 2606.19980v2, Sec 1 (Introduction), paragraph 3; Sec 2.1 and 2.2.
- Verdict: CARRIED (seed 05 section 1.1, re-fetched)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | definition | "In the first phase (EN in ENPIRE), coding agents construct an autonomous environment interface from human feedback. Through this initial research loop, agents implement and optimize procedural tool calls that establish safety boundaries, automated reset, and verification procedures for a specific task. They are optimized offline with a one-time setup cost; once finalized, they serve as immutable APIs that are reused throughout the subsequent stage. The second phase (PIRE in ENPIRE) transitions to a fully autonomous autoresearch procedure, where coding agents refine policies based on real-world feedback." (accessed 2026-11-20)
- Use in dive: section 19, the two-stage walk-through. The human cost sits in stage one: "Human effort is a one-time cost that will be amortized across all implementations on all robots" (Sec 2.1).

**F04-3. In stage two the agent has write access to a training codebase and decides the learning method itself: behaviour cloning, real-world RL (online, offline, offline-to-online), heuristic learning, or code-based policy synthesis, plus hyperparameters. It reads the literature, forms a hypothesis and edits the training code.**
- Location: 2606.19980v2, Sec 2.2 ("A motivating example"), Sec 3 (paragraph 4), Sec 3.2.
- Verdict: CARRIED (seed 05 section 1.1, re-fetched)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | definition | "the agent operates through a Policy Improvement module (PI in ENPIRE), where it reviews the literature to generate insights, formulates hypotheses, and directly modifies the training code - such as behavior cloning or RL algorithms - to optimize performance based on real-world automatic verification results." and (Sec 3.2) "The agents tested multiple methods to improve the policy, including behavior cloning (BC), iterative BC with online rollout data aggregation, and online, offline, and offline-to-online RL with a BC regularization term. The agents also tuned parameters such as batch size, the actor-critic policy update rate, and the BC-term hyperparameters." (accessed 2026-11-20)
- Use in dive: section 19, "what the agent decides". How often each method was chosen is not published (U1).

**F04-4. The prompt each station's agent receives is nine lines. It sets the goal (100% success over every window of 50 consecutive episodes), tells the agent to split into subagents across RL, BC and hybrid methods, and tells it to coordinate with the other stations through Git branches.**
- Location: 2606.19980v2, Appendix B.1, Figure 10.
- Verdict: CARRIED (seed 05 section 1.1, re-fetched)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | definition | "/goal Achieve a 100% success rate over each window of 50 consecutive episodes. Read @auto_research.md and fan out a subagent team to study different algorithms (RL, BC, hybrid). You may reuse checkpoints or data buffers across hypotheses. Create your own branch from autorl following the instructions. Do not directly work on or push to autorl. You must actively monitor other branches and commits from origin that branched off autorl to leverage knowledge from those branches. You must actively push your branch to contribute to the repo and pull from origin. Collaborate with other agents via Git." (accessed 2026-11-20)
- Use in dive: section 19, show the prompt verbatim; it is the whole of the human instruction in stage two.

**F04-5. The fleet is eight identical stations. Each has two 6-DoF YAM arms with a 1-DoF gripper (14 actuated joints), three RealSense D405 cameras (one top, two wrist; GPU insertion adds a side D435i), and one workstation with one NVIDIA RTX 5090 (32 GB), an Intel Core Ultra 9 285K (24 cores) and 128 GB RAM. No shared cluster or off-station compute is used.**
- Location: 2606.19980v2, Figure 1 caption; Appendix B.2, Table 1; Appendix B.4.
- Verdict: CARRIED (seed 05 section 1.2, re-fetched)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | definition | "The fleet contains eight bimanual YAM robot stations. Each station owns its robot hardware, compute, and coding agent." and (B.2) "Each arm is a 6-DoF manipulator equipped with a 1-DoF parallel-jaw gripper, giving seven actuated joints per arm and fourteen across the bimanual pair." and "All policy inference and on-station computation run on this single GPU, with no shared cluster or off-station compute." Table 1: "GPU 1x NVIDIA RTX 5090, 32 GB", "CPU Intel Core Ultra 9 285K, 24 cores", "RAM 128 GB", "OS Ubuntu 22.04 LTS", "GPU stack NVIDIA driver 595.58.03, CUDA 13.2". (accessed 2026-11-20)
- Use in dive: section 19, the hardware panel. One consumer GPU per robot is the unit; the binding resource is the robot (F04-21).

**F04-6. The policy runs at 30 Hz and the joint controllers track its targets at 100 Hz over CAN bus. The agent never talks to motors: its hardware requests go through a local FastAPI server with three endpoints, `/start` (begin a rollout), `/restart` (new rollout buffer directory) and `/home`.**
- Location: 2606.19980v2, Appendix B.1 ("Control endpoints"), B.2 ("Perception"), B.3.
- Verdict: CARRIED (seed 05 section 1.2, re-fetched)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | definition | "The FastAPI server exposes a small set of endpoints through which the agent drives data collection and execution: /start begins a rollout on the real hardware, /restart allocates a fresh rollout buffer directory, and /home returns the arms to the home configuration." and "Policy actions are inferred at 30 Hz, and each action target is tracked by the low-level joint controllers running at 100 Hz over the CAN bus." (accessed 2026-11-20)
- Use in dive: section 19, the "narrow door" between agent and robot. Each rollout lands in its own directory "so that the data from different hypotheses or experiments is never mixed together".

**F04-7. Agents coordinate only through Git. There is no central server: each station pushes code, configs, tools and results to a shared repository, and agents merge or cherry-pick each other's commits.**
- Location: 2606.19980v2, Sec 2.2 ("Accelerating autoresearch via multi-agent scaling"); Appendix B.1.
- Verdict: CARRIED (seed 05 section 1.2, re-fetched)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | definition | "Coordination across stations is mediated entirely through Git: rather than streaming state to a central server, stations share code, configurations, tools, and results by pushing to and pulling from a common repository" and "This keeps the fleet loosely coupled and fault-tolerant, since stations run, fail, and recover independently, while the shared Git history serves as the single source of truth for what each station has tried and learned." Also (Sec 2.2): "This protocol deploys N agents across N physical robots to test N hypotheses asynchronously." (accessed 2026-11-20)
- Use in dive: section 19, how the agents coordinate. One agent per robot, one branch per agent.

**F04-8. What the agent may not touch: the environment, the reset procedure, the verifier, the safety limits, the evaluation seeds and the artifact schema. The scoring code and the robot-side reward code are read-only to it. Hardware confirmations, workspace limits and the emergency stop must never be weakened.**
- Location: repo NVlabs/ENPIRE at SHA 99ee90ac, `enpire/policy/autoresearch_instruction.md` lines 3 to 5 and 43 to 52; `AGENTS.md` line 87 (rule 8).
- Verdict: CARRIED (seed 05 section 1.3, re-fetched at a pinned SHA; the seed cited the default branch)
- Evidence: https://raw.githubusercontent.com/NVlabs/ENPIRE/99ee90acf65b5b18957c8382ad580db999528be3/enpire/policy/autoresearch_instruction.md | Tier 1, code repository instruction file | definition | "An auto-research agent may improve policy and training code, but it must not change the environment, reset procedure, verifier, safety limits, evaluation seeds, or artifact schema." and "Never weaken or bypass a hardware confirmation, workspace limit, or emergency stop." and "Never redefine success inside the policy." and "The score implementation and robot-side event/reward code are read-only to a policy researcher; changing them invalidates comparison with prior runs." AGENTS.md rule 8: "Policy code must not modify reset, verification, or safety implementation." (accessed 2026-11-20)
- Use in dive: section 19, the "may touch / may not touch" table. These are written rules in an instruction file. The repo files read do not show a mechanism that technically prevents the agent from editing those files; the paper's word is "immutable Gym APIs" (Sec 2.1). Whether immutability is enforced by file permissions is U2.

**F04-9. The contract also fixes a required order of work: one falsifiable hypothesis, the smallest policy-side change, unit tests and offline evaluation first, only the approved number of real-world trials, then keep the change only if it passes the success and regression gates. Failed trials are kept as part of the record.**
- Location: repo NVlabs/ENPIRE at SHA 99ee90ac, `enpire/policy/autoresearch_instruction.md` lines 7 to 14, 29, 50, 54 to 58.
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVlabs/ENPIRE/99ee90acf65b5b18957c8382ad580db999528be3/enpire/policy/autoresearch_instruction.md | Tier 1, code repository instruction file | definition | "1. Record one falsifiable hypothesis. 2. Make the smallest policy-side change needed to test it. 3. Run the configured unit tests and offline evaluation first. 4. Run only the approved number of real-world trials. 5. Inspect `result.json`, events, metrics, and video evidence. 6. Keep the change only when it passes the configured success and regression gates." and "Pause at the budget boundary and compute the frozen rolling-success metric." and "Preserve failed trials; they are part of the experiment record." (accessed 2026-11-20)
- Use in dive: section 19, the loop as six numbered steps. The budget the contract names is a trial budget set by the operator; no GPU-hour, token or dollar budget appears in the three repo files or the paper (searched for "budget").

**F04-10. Physical safety does not depend on the agent behaving. Position and motion limits are hard constraints that end the episode and trigger a reset; the gripper is torque-limited so a bad contact stalls instead of pushing; and real-robot commands require a physical emergency stop within reach.**
- Location: 2606.19980v2, Sec 2.1 ("Hard safety constraints"), Appendix B.3; repo `SECURITY.md` lines 36 to 37.
- Verdict: CARRIED (seed 05 section 1.3, re-fetched)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | definition | "We restrict the configuration space and kinematic behaviors of the robot to a safe operational limit. The safety regions are sufficient for task completion and serve as hard constraints: violating these limits triggers an immediate task failure and an automated reset." and (B.3) "Because the fleet operates autonomously and unattended across all 8 stations, this bounded-force behavior is essential: a bad contact results in a safe stall rather than a hardware-damaging push, with no human in the loop to intervene." SECURITY.md at SHA 99ee90ac: "Real-robot commands require explicit operator intent, a verified station and calibration profile, and a physical emergency stop within reach." (accessed 2026-11-20)
- Use in dive: section 19, safety design. Three layers: a limit in software that fails the episode, a force bound in the actuator, a human-reachable stop.

**F04-11. Inside its sandbox the agent is given wide latitude: permission prompts are bypassed and internet access is unrestricted. The sandbox is one repository. Between sessions, prior rollout data, checkpoints and logs are pruned.**
- Location: 2606.19980v2, Appendix B.1 ("Agent sandbox and context").
- Verdict: CARRIED (seed 05 section 1.3, re-fetched)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | definition | "Each station's coding agent operates within a sandbox scoped to a single autoresearch repository. Within this sandbox the agent runs with elevated autonomy: action-level permission prompts are bypassed, so it can execute commands without per-step human approval, and it is granted unrestricted internet access." and "For ordinary fresh sessions, raw repository state, rollout data, checkpoints, and transient logs from prior sessions are pruned before initialization, so that the agent starts from a clean, isolated workspace." (accessed 2026-11-20)
- Use in dive: section 19, the permissive half of the "may touch" table. [our reading] The design is "free inside the repository, fenced at the robot interface".

**F04-12. Who grades: a binary reward function that the agent itself wrote in stage one from a few minutes of labelled success and failure recordings, then frozen. For pin insertion it combines visual alignment, end-effector height and a force estimate; for the zip tie it uses two camera views and runs in under 150 ms.**
- Location: 2606.19980v2, Sec 2.1 ("Automated verification"), Figure 4, Appendix A.2, Figure 9.
- Verdict: CARRIED (seed 05 section 5.1, re-fetched)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | definition | "coding agents are tasked with synthesizing a binary reward function from procedural tool calls to distinguish task outcomes. Given only a few minutes of success and failure demonstrations, the agents use the videos and proprioception recordings to maximize the prediction accuracy score while minimizing processing latency. For example, autoresearch discovers a robust reward function for pin insertion that is based on visual alignment, end-effector height, and force estimates." Figure 9 code: "reward = is_aligned and height_correct and force_correct". Appendix A.2: "meets the 150 ms latency budget by converting to ONNX". (accessed 2026-11-20)
- Use in dive: section 19, "who grades it". The grader is code with three conditions, where two of the three are not vision. Contrast with VLM judges (F04-41).

**F04-13. The verifier is protected from the agent that built it by a held-out set: the agent may study failures but cannot train on the test set or change how the metric is computed. Human effort in reward design is two steps: record a few minutes of success and failure examples, and state the required precision, recall and latency.**
- Location: 2606.19980v2, Appendix A.2.
- Verdict: CARRIED (seed 05 section 1.3, re-fetched)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | definition | "This procedure requires human effort in only two steps: first, collect a few minutes of representative success and failure demonstrations; second, specify the reward design requirements, including target precision, recall, and inference latency." and "we record a few minutes of labeled success and failure snapshots of zip tie fastening as a sandboxed held-out evaluation set - the agent may study failures, but cannot train on the test set or alter metric computation." (accessed 2026-11-20)
- Use in dive: section 19, the guard against an agent grading its own homework. The measured precision and recall of the resulting verifiers are not reported in the paper (U3).

**F04-14. Reset is also agent-written code. It composes SAM3 (open-vocabulary detection), BundleSDF (6-DoF pose tracking) and cuRobo (GPU motion planning), uses gripper torque as a stand-in for touch, and returns the scene to the start of the hardest phase of the task instead of the very beginning.**
- Location: 2606.19980v2, Sec 2.1 ("Automated reset"); Appendix A.1.
- Verdict: CARRIED (seed 05 section 5.1, re-fetched)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | definition | "coding agents can synthesize long-horizon reset functions by composing perception and planning APIs, including SAM3 for open-vocabulary object detection ..., BundleSDF for continuous 6-DOF pose tracking, and cuRobo for GPU-accelerated collision-free trajectory optimization." and "we employ procedural tool calls inspired by CaP-X (15), using modular manipulation skills to reset the environment directly to the start of the most challenging phase. By positioning the robot at the precise onset of critical actions, such as inserting a pin, seating a GPU, or grasping scissors, we strategically focus the learning system on these precision bottlenecks." (accessed 2026-11-20)
- Use in dive: section 19, autonomous reset; section 8, "resets are the scarce input" (the reset itself is a perception and planning workload on the station GPU). Reset reliability and reset time per episode are not reported (U3).

**F04-15. Real-world RL inside ENPIRE uses an actor-learner design in three processes: a deployment layer next to the robot, a learner on a GPU host that trains actor and critic from pixels through a pretrained visual backbone, and an actor endpoint. Episodes are written to disk and a daemon ingests them into an online replay buffer or a demonstration buffer by action source.**
- Location: 2606.19980v2, Appendix B.5.
- Verdict: CARRIED (seed 05 section 1.2, re-fetched)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | definition | "The infrastructure is developed following the asynchronous design of SERL (27; 28). We implement it as a three-tier distributed system that decouples robot interaction, policy learning, and inference across separate processes." and "a daemon thread (DiskBufferIngestor) polls this directory periodically, parses newly finalized episodes, and routes transitions by action-source label following the RLPD-style data-mixing protocol (4): RL-generated transitions populate the online replay buffer, while human and manual transitions populate a separate demonstration buffer that is mixed into each training batch." (accessed 2026-11-20)
- Use in dive: sections 8 and 19. The same actor-learner split as HIL-SERL (F04-73), here driven by an agent instead of a person.

**F04-16. Headline result: policies developed under ENPIRE reach 99% success with up to eight in-context retries ("pass@8") on the showcased real tasks. The retries are sequential attempts inside one rollout after seeing the previous failure, so this is a recovery measure and is different from a one-shot success rate.**
- Location: 2606.19980v2, Abstract and Sec 3 (paragraph 3); project page, "Learned Manipulation Policy".
- Verdict: CARRIED (seed 05 section 1.4, re-fetched)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | benchmark claim (author reported) | "We measure success as the chance of completing a task in one rollout, given a fixed number of retries (here, eight). Unlike measuring success by i.i.d. best-of-N sampling, where each attempt is independent, our retries happen after witnessing the previous failure" Project page https://research.nvidia.com/labs/gear/enpire/ (Tier 2): "Policies trained with ENPIRE reach a 99% pass@8 success rate across the showcased manipulation tasks." and "a policy that can't stays near pass@1 (a 13% policy stays ~13%, not 99%)". (accessed 2026-11-20)
- Use in dive: section 19, results, with the metric defined before the number. [author reported] The one-shot (pass@1) rate of the final policies is not given in the paper text.
- Rewrite check (2026-11-25, CORRECTION (reading)): "so this is a recovery measure" is our gloss, not the authors', and our own arithmetic refutes it: eight independent attempts at 44% each already give 1 - 0.56^8 = 99%. pass@8 counts a success anywhere in up to eight attempts after one reset; it mixes first-try skill and recovery and cannot be split without a first-try rate, which the paper's text does not give. Print it that way.

**F04-17. Single agent, real robot, by coding agent. Push-T (heuristic policy, 8 hours): mean normalized score 0.94 for Codex with GPT-5.5, 0.75 for Claude Code with Opus 4.7, 0.63 for Kimi Code with Kimi K2.6. Pin insertion (trained policy, 4 hours): mean success 0.96 Codex, 0.98 Claude Code, 0.79 Kimi Code.**
- Location: 2606.19980v2, Figure 3 (left panels) and Sec 3; the same chart's data series in the project page script bundle (`pushtModel` and `pinModel`, field `mean`, last element).
- Verdict: CARRIED (seed 05 section 1.4 read these off the figure as about 93 / 75 / 62 and 95 / 97 / 79; the embedded data give 0.9375 / 0.75 / 0.625 and 0.955 / 0.975 / 0.79)
- Evidence: https://research.nvidia.com/labs/gear/enpire/_next/static/chunks/11dgx9quo0zhy.js | Tier 2, first-party project page (chart data in the page's script; the chunk file name changes when the page is rebuilt) | benchmark claim (author reported) | pushtModel: codex "mean:[0,.6144518761048563,.7775476455972508,.9375]", claude code "mean:[0,.4395335852123945,.6481242519221289,.75]", kimi "mean:[0,.5186681937041029,.5983188945016216,.625]"; pinModel: codex "mean:[.475,.7826720636456649,.9160097014121072,.955]", claude "mean:[.5650000000000001,.8185810723915099,.9194716668744478,.975]", kimi "mean:[.4905000000000001,.6824803122222325,.7776086956521739,.79]". Paper text (Sec 3.1): "the real-world environment proves significantly more challenging, causing two of the three agents to fail." (accessed 2026-11-20)
- Use in dive: section 19, results per task. Number of runs behind each mean is not stated in the text (the series carry several runs each). In simulation all three agents solve Push-T (Fig. 5: Claude Code and Codex "achieve 95% success rate within approximately 2 hours, while Kimi Code (black) takes twice the time").

**F04-18. Scaling with robots. Push-T: time to a normalized score of 1.0 falls from 4.7 h with one agent to 3.1 h with four and 2.0 h with eight. Pin insertion: time to 100% falls from 2.5 h (94% at 1.3 h) with one agent to 0.89 h with four and 0.67 h with eight. Eight robots buy roughly 2.4x to 3.7x, not 8x.**
- Location: 2606.19980v2, Figure 3 (right panels), Sec 3.3; project page script bundle, `pushtScaling` and `pinScaling`.
- Verdict: CARRIED (seed 05 section 1.4, re-fetched; exact points now from the embedded data)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | benchmark claim (author reported) | "In Push-T, scaling from one to eight agents reduces the time to reach a 1.0 normalized score from roughly five to two hours. In pin insertion, scaling from one to eight agents reduces the time to reach a near-perfect success rate from more than 1.5 hours to approximately 40 minutes." Project page data (Tier 2, https://research.nvidia.com/labs/gear/enpire/_next/static/chunks/11dgx9quo0zhy.js): pushtScaling last points "[4.7,1]" (1 agent), "[3.11666667,1]" (4), "[1.98333333,1]" (8); pinScaling "[1.3008333333333333,.94]" then "[2.499721666666667,1]" (1 agent), "[.8916666666666667,1]" (4), "[.6666666666666666,1]" (8). (accessed 2026-11-20)
- Use in dive: section 19, the scaling chart. [derived] Push-T speed-up 4.7 / 1.98 = 2.4x; pin insertion 2.50 / 0.667 = 3.7x to 100% (or 1.30 / 0.667 = 1.95x if the one-agent run is stopped at 94%).

**F04-19. Utilisation, measured on pin insertion per the text. Robot utilisation (share of research wall-clock time the robot is executing an experiment) is 49.1% with one agent, 30.9% with four, 29.8% with eight. GPU utilisation is 29.4%, 32.5%, 49.0%. Neither approaches 100% for any agent tested.**
- Location: 2606.19980v2, Sec 2.2 (metric definitions), Sec 3.6, Figure 7a; project page Figure 6 and its data object `utilization`.
- Verdict: CARRIED (seed 05 section 1.5 read "about 49 / 31 / 30" and "about 29 / 32 / 49" off Fig. 7; the page's embedded data give the exact means and standard deviations)
- Evidence: https://research.nvidia.com/labs/gear/enpire/_next/static/chunks/11dgx9quo0zhy.js | Tier 2, first-party project page (chart data) | benchmark claim (author reported) | "utilization:[{agentCount:1,robotMean:49.14,robotStd:24.93,gpuMean:29.41,gpuStd:11.43},{agentCount:4,robotMean:30.87,gpuMean:32.52,robotStd:10.86,gpuStd:12.86},{agentCount:8,robotMean:29.78,gpuMean:48.96,robotStd:9.48,gpuStd:30.15}]". Paper definitions (Tier 3, https://arxiv.org/abs/2606.19980v2): "Mean Robot Utilization (MRU) is the fraction of research wall-clock time during which the robot is actively executing an experiment. GPU utilization is the fraction of research wall-clock time during which the GPU is actively in use. A perfectly resource-saturated agent would push both metrics toward 1; in practice, neither metric reaches this value for any frontier coding agent we evaluate." (accessed 2026-11-20)
- Use in dive: section 19, the utilisation chart and the section's strongest number: the robot sits idle half the time with one agent and 70% of the time with eight. Read off the PDF's Fig. 7a the same bars sit at about 47 to 51 (robot, 1 agent) and 28 to 31 (GPU, 1 agent), consistent with the data. The standard deviations are wide (GPU at eight agents: 49.0 plus or minus 30.2).

**F04-20. Tokens. The fleet's token rate is 9,269 tokens per minute with one agent, 40,029 with four and 140,310 with eight: 15x the tokens for 8x the agents. Tokens to a successful policy rise from 2.5 million to 7.7 million to 16.8 million while time to success falls from 4.5 h to 3.2 h to 2.0 h.**
- Location: 2606.19980v2, Sec 3.6 and Sec 4 ("Token cost grows super-linearly with fleet size"), Figure 7b and 7c; project page data objects `tokenRate` and `tokensToSuccess`.
- Verdict: CARRIED (seed 05 section 1.5, re-fetched; exact values from the embedded data replace the seed's chart read-offs of about 9K / 40K / 142K and 2.6M / 7.7M / 17M)
- Wave 2 (2026-11-20, SCOPE NARROWER): The token and time figures hold. The remark in section 8 that Fig. 7's times may come from a mislabelled task is withdrawn. Fig. 7c's time to success (4.5, 3.2, 2.0 h, pin insertion per Sec 3.6) is longer than Fig. 3's time to first reach 100% on pin insertion (2.5, 0.89, 0.67 h) because Fig. 7 measures time to complete the autoresearch objective, which the prompt sets as 100% over every window of 50 consecutive episodes. Quote each figure with its own definition and do not combine them. See `wave2-B.md` row F04-20.
- Evidence: https://research.nvidia.com/labs/gear/enpire/_next/static/chunks/11dgx9quo0zhy.js | Tier 2, first-party project page (chart data) | benchmark claim (author reported) | "tokenRate:[{agentCount:1,mean:9269.21,std:2648.62},{agentCount:4,mean:40028.72,std:29441.58},{agentCount:8,mean:140310.43,std:14912.4}],tokensToSuccess:[{agentCount:1,meanTokens:2.5,stdTokens:.72,successHours:4.5},{agentCount:4,meanTokens:7.69,stdTokens:5.65,successHours:3.2},{agentCount:8,meanTokens:16.84,stdTokens:1.79,successHours:2}]". Paper (Tier 3, Sec 4): "MTU remains close to the linear projection up to four agents, but rises sharply at eight agents (Fig. 7b)." and "larger fleets reach success sooner, but require a disproportionately higher token budget." (accessed 2026-11-20)
- Use in dive: section 19, the token chart. [derived] 140,310 / 9,269 = 15.1x; the linear projection in the chart is the one-agent mean times the agent count (9,269, 37,077, 74,154), so eight agents use 1.9x the linear projection. Tokens to success: 16.84 / 2.5 = 6.7x the tokens for 4.5 / 2.0 = 2.25x less time. The main text says the token figures aggregate input and output tokens (Appendix C.2); whether cached input is counted in Fig. 7 is not stated (see F04-22 and U4). No dollar cost is stated anywhere in the paper.

**F04-21. The paper's own limitations section has two items: robots and GPUs are underused because agents spend time reading logs, writing code, debugging and waiting on the language model, and teams spend more time summarising each other's branches; and token cost grows faster than fleet size.**
- Location: 2606.19980v2, Sec 4 "Limitations", both paragraphs, quoted in full.
- Verdict: CARRIED (seed 05 section 1.7, re-fetched)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | production report | "Robot and compute resources are underutilized. Coding agents do not fully utilize robot resource when they are reading logs, writing code, debugging, or waiting for the language-model backbone. Moreover, as we scale the number of robots, MRU decreases, while GPU active utilization increases (Fig. 7a). Compared to a single-robot setup, the composition of agent activity causes agent teams to spend more of their time summarizing peer branches and less time actually operating the robot. Coding agents may also fail to launch parallel training sessions to exhaust GPU resources." and "Token cost grows super-linearly with fleet size. As the fleet size increases, token usage grows faster than the ideal linear trend. MTU remains close to the linear projection up to four agents, but rises sharply at eight agents (Fig. 7b). The total token budget required to obtain a successful policy shows the same trend, increasing much more rapidly than the corresponding reduction in wall-clock time (Fig. 7c). Thus, increasing the fleet size trades token efficiency for faster policy improvement: larger fleets reach success sooner, but require a disproportionately higher token budget." (accessed 2026-11-20)
- Use in dive: section 19, limitations verbatim. The related-work section names the binding resource: "we ... run the loop directly on hardware, where the binding resource is the agent's robot-access budget, not its compute." (Sec 5.2).

**F04-22. Where the tokens go, on a simplified real Push-T task with Codex: one agent used 80M tokens in total, of which 77M were cached input, 2.4M fresh input, 0.27M output and 0.08M reasoning. With four agents: 209M total, 201M cached, 7.3M fresh input, 0.69M output. About 96% of tokens are re-reads of cached context.**
- Location: 2606.19980v2, Appendix C.2, Figure 13 (values printed on the bars).
- Verdict: CARRIED (seed 05 section 1.5, re-fetched)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | benchmark claim (author reported) | Figure 13 bar labels: Total "80M", "118M", "209M"; Input "79M", "118M", "208M"; Cached input "77M", "114M", "201M"; Fresh input "2.4M", "4.2M", "7.3M"; Output "0.27M", "0.40M", "0.69M"; Reasoning "0.08M", "0.14M", "0.22M"; Uncached work "2.6M", "4.6M", "7.9M" (for 1, 2 and 4 agents). Caption: "Token-utilization breakdown for Codex agents on the simplified real-world Push-T task." (accessed 2026-11-20)
- Use in dive: section 19, what an agent-run loop costs in tokens. [derived] 77 / 80 = 96% cached; 201 / 209 = 96%. The bill therefore depends on the provider's cached-input price. These totals (80M for one agent) are far above Fig. 7's 2.5M tokens-to-success for one agent on a different task, which suggests Fig. 7 does not count cached input; the paper does not say (U4).

**F04-23. Most of what the agents try does not help. In the published eight-agent pin-insertion run the team tried 86 ideas in about 3.4 hours; 28 raised the team's best success rate and 58 did not. One idea (adding a behaviour-cloning regularisation term) gave +10.8 percentage points; later ideas gave about +1.**
- Location: 2606.19980v2, Appendix B.6 and Figure 12; project page Figure 1 and its data (`e3` node list with a `raised` flag per idea, and the hill-climb curve).
- Verdict: CARRIED (seed 05 section 1.6 counted "about 28 of 86, plus or minus 3" from the rendered figure; the page data give exactly 86 nodes, 28 with raised = true, across agents 1 to 8, last node at 202.4 minutes)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | production report | "Solid green nodes mark ideas that improved the team-average best success rate, while hollow nodes were evaluated but yielded no gain." and "a few high-impact ideas account for most of the progress - most notably BC regularization (I37, +10.8 pp) - while later ideas such as batch-size tuning (I66, +0.9 pp) and controller compensation (I76, +1.3 pp) contribute smaller, incremental refinements as the success rate approaches 100%." Project page data (Tier 2, https://research.nvidia.com/labs/gear/enpire/_next/static/chunks/11dgx9quo0zhy.js): 86 objects of the form "{relMin:...,idx:...,hid:...,agent:...,raised:!0|!1}", 28 with "raised:!0"; hill-climb curve ends at "[192.98,97.38]". (accessed 2026-11-20)
- Use in dive: section 19, the idea tree and "what compute the agent wastes". [derived] 58 / 86 = 67% of ideas gave no gain; 86 ideas / 3.37 h = about 26 ideas per hour across eight agents, about 3 per agent-hour. Several early ideas are infrastructure fixes, for example idea 2: "Infrastructure fix: auto-detect the available GPU instead of a hard-coded device so training launches reliably." (project page idea text).

**F04-24. In simulation (RoboCasa365, eight kitchen tasks, 40 fixed-seed episodes each), ENPIRE's agent-written scripts that call a GR00T policy as one tool beat the GR00T N1.5 policy alone and beat zero-shot tool use without the research loop. Mean success, read off Fig. 6: about 75 to 78% against about 50 to 54% and about 25 to 28%.**
- Location: 2606.19980v2, Figure 6 (bar chart, no printed values), Sec 3.5, Appendix D.2.
- Verdict: CARRIED (seed 05 section 1.4, re-fetched; values are chart read-offs)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | benchmark claim (author reported) | "On RoboCasa365 (34) benchmark, ENPIRE outperforms end-to-end VLA (GR00T (5)) and zero-shot agentic tool use without autoresearch (CaP-X (15))." and (Sec 3.5) "the agent boosted the success rate of the GR00T VLA (5) by using motion planning and detection tools to hover above an object before grasping. We successfully transferred this strategy to the real world, where the agent learned to hover over scissors, grasp them, and cut a zip tie". Appendix D.2: "For each reported 40-episode evaluation, we use a fixed list of seed triplets." (accessed 2026-11-20)
- Use in dive: section 19, the agent composing a pretrained policy with classical tools. Read off Fig. 6 with wide error bars; per-task numbers are not printed. To stop the agent cheating in simulation, state-leaking and retry APIs are removed from its namespace: "the environment disables APIs such as get_task_info, reset_env, reset_to_initial, task-specific CLI helpers, and oracle-target queries" (Appendix D.1).

**F04-25. Two ablations on what the agent needs. Giving the agent native image input matters: first success on simplified real Push-T came at 54.67 minutes with native vision, 72.32 minutes with no vision at all, and 99.18 minutes when vision was a separate tool the agent had to call. Harness matters: 54.41 minutes for Codex with GPT-5.5, 62.01 for Claude Code with Opus 4.7, 105.00 for the Codex harness driving Opus 4.7.**
- Location: 2606.19980v2, Appendix C.3 and C.4, Figures 14 and 15 (values printed on the bars).
- Verdict: CARRIED (seed 05 section 1.5, re-fetched)
- Evidence: https://arxiv.org/abs/2606.19980v2 | Tier 3, peer-reviewed (CoRL 2026) | ablation | "Codex with native vision reaches success first. Surprisingly, the no-vision baseline succeeds before the function-call vision baseline. This suggests that even without direct visual access, the coding agent can infer useful task state from other logging signals, while repeated image function calls introduce additional overhead during task solving." and "Codex solves the task fastest, while the Codex harness using the Opus API is the least efficient among the tested configurations." Figure 14 "First success" bars: 54.67, 99.18, 72.32; Figure 15 bars: 54.41, 62.01, 105.00. (accessed 2026-11-20)
- Use in dive: section 19, a short "what the agent needs" note. Single runs on one simplified task; treat as indicative.

**F04-26. Code release: github.com/NVlabs/ENPIRE, Apache-2.0, last commit 2026-09-09 (SHA 99ee90ac), no tagged release. It ships the environment tooling, the code-as-policy runtime, the actor-learner RL runtime and the agent contract; real-robot use needs a registered, calibrated station.**
- Location: repo root; `README.md` lines 12 to 27 and 62 to 66; `AGENTS.md` lines 92 to 101.
- Verdict: NEW (the seed cited the repo without a pin)
- Evidence: https://github.com/NVlabs/ENPIRE (default branch at SHA 99ee90acf65b5b18957c8382ad580db999528be3, committed 2026-09-09) | Tier 1, code repository | documentation of support | "Code-as-Policy (CaP) supports heuristic learning through Python skill scripts; the real-world RL environment supports neural policy training with an actor/learner pipeline." and "Real-robot runs require a registered station, calibrated cameras and robot transforms, and the task's perception and control services." AGENTS.md lists the task code as imported from internal branches: "GPU insertion: Forge internal branch `@682f7937`" and "Do not assume the target checkout contains the latest task implementation." (accessed 2026-11-20)
- Use in dive: section 19, "can I run it": the harness is public, the robot adapter in the tree is for the YAM arm (`robot_adapters/real_yam.py`). No SO-101 adapter was found in the file list (U5).

### B. ENPIRE's siblings: ASPIRE and the statistically gated loop (section 19)

**F04-27. ASPIRE stands for "Agentic Skill Programming through Iterative Robot Exploration". A coordinator starts one coding agent per task; each agent writes a robot control program, runs it, reads per-step traces to find the failure, repairs it, and the validated repair is stored as a text "skill" that later agents retrieve. No model weights are trained.**
- Location: 2607.00272v2, Abstract; Figure 1 caption; Sec 2.2. The arXiv title of v2 is "ASPIRE: Agentic /Skills Discovery for Robotics"; the expansion is given in the abstract.
- Verdict: CARRIED (seed 05 section 2.1, ID verified; the seed read v1 of 30 Jun 2026, the latest is v2 of 20 Oct 2026, 41 pages)
- Evidence: https://arxiv.org/abs/2607.00272v2 | Tier 3, preprint (NVIDIA, UMich, UIUC, UC Berkeley, CMU) | definition | "We introduce ASPIRE (Agentic Skill Programming through Iterative Robot Exploration), a continual learning system for robotics that autonomously writes and refines robot control programs in a code-as-policy paradigm while compounding experience into a reusable skill library." and (Fig. 1) "A coordinator spawns an actor agent (coding agent) per task, enabling parallel learning across tasks." (accessed 2026-11-20)
- Use in dive: section 19, the second pattern: the agent writes the policy as code and the thing that accumulates is a library of written repairs.

**F04-28. A skill enters ASPIRE's library only after a second, fresh agent reproduces the fix from the written proposal alone, and the coordinator checks it used only allowed APIs. The check happens once; entries are never re-validated.**
- Location: 2607.00272v2, Sec 2.2 (last paragraph); Sec 5 "Skill library management".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2607.00272v2 | Tier 3, preprint | definition | "Skill admission has two checks. Each actor reports structured findings: the failure mode, the validated fix, and any potentially transferable repair pattern as a proposed skill. A fresh verifier actor then receives the proposed skill and attempts the source task independently on a subset of seeds, recording which entries are sound, defective, or untested. The coordinator verifies compliance with the allowed API policy and promotes only reusable entries whose success the verifier reproduced." and (Sec 5) "Entries are not re-validated as the library grows, so some may later become stale, redundant, or misleading for a new task" (accessed 2026-11-20)
- Use in dive: section 19, "who grades it" for the skill-library pattern: a second agent plus the simulator's success check.

**F04-29. Skills found in simulation cut the tokens an agent needs to program a different real robot. On a bimanual YAM station with GPT-5.5 in Codex: lifting a soda can took 61.94M tokens without the skill and 6.58M with it (success 13/20 to 19/20); bowl on plate 8.65M to 5.11M (20/20 both); drawer 334.92M to 81.67M (0/20 to 11/20).**
- Location: 2607.00272v2, Sec 3.6, Table 1.
- Verdict: CARRIED (seed 05 section 2.1, re-fetched at v2; numbers unchanged)
- Evidence: https://arxiv.org/abs/2607.00272v2 | Tier 3, preprint | benchmark claim (author reported) | Table 1 rows (Total Tokens (M) without / with skills; success without / with): "Put bowl on plate 8.65 5.11 20/20 20/20", "Lift soda can 61.94 6.58 13/20 19/20", "Open/push drawer 334.92 81.67 0/20 11/20". Caption: "Token counts are measured until the first successful real-robot program, or until the debugging budget is exhausted for runs that do not reach success." (accessed 2026-11-20)
- Use in dive: section 19, the token cost of an agent-written policy and what a skill library buys. The drawer row is the caution: 335M tokens and still 0 of 20 without the skill.

**F04-30. ASPIRE v2 publishes dollar cost. On the 10 LIBERO-Pro Goal tasks under position perturbation, success and cost per task by model: Claude Opus 5.5 99.2% at $18.29, Claude Sonnet 5.5 98.8% at $12.11, GPT-6 Astra 94.4% at $35.37, Claude Opus 4.6 55.6% at $23.58, GPT-6 Luna 14.8% at $0.83; mean agent time 31 to 139 minutes per task.**
- Location: 2607.00272v2, Sec 3.8 ("Cost/success Pareto frontier"); Appendix E.6, Table 18.
- Verdict: NEW (not in the seed, which read v1; the seed's "15% to 99%" came from the repo README)
- Evidence: https://arxiv.org/abs/2607.00272v2 | Tier 3, preprint | benchmark claim (author reported) | Table 18 caption: "Held-out success on the 10 LIBERO-Pro Goal tasks under the position perturbation (50 seeds each), using ASPIRE iterative debugging without evolutionary search and with an initially empty skill library. Cost is estimated at list API prices; agent time is the mean time per task." Rows: "Claude Opus 5.5 99.2% $18.29 $183 51", "Claude Sonnet 5.5 98.8% $12.11 $121 56", "GPT-6 Astra 94.4% $35.37 $354 31", "Claude Opus 4.6 55.6% $23.58 $236 61", "GPT-6 Luna 14.8% $0.83 $8 47", "Kimi K3 [open weights] 78.4% $58.19 $582 139". (accessed 2026-11-20)
- Use in dive: section 19, cost of the agent itself in dollars: about $10 to $60 of model calls per simulated task. Same harness, same tasks: success moves from 15% to 99% with the model alone.

**F04-31. At campaign scale the cost is tokens and simulator rollouts, not GPUs. A 60-task ASPIRE run with Claude Opus 5.5 used 1,538.3M tokens (1,493.5M of them cache reads), 7,896 model calls and 10,555 simulator rollouts, for an estimated $650 ($10.8 per task) and 46 minutes of agent time per task.**
- Location: 2607.00272v2, Appendix E.7, Table 20 ("Without evolutionary search" block).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2607.00272v2 | Tier 3, preprint | benchmark claim (author reported) | Table 20 columns Claude Opus 4.6 / Opus 5 / Opus 5.5 / GPT-6 Astra: "Total tokens 2,009.3M 2,542.9M 1,538.3M 522.1M", "Cache-read tokens 1,966.5M 2,471.7M 1,493.5M 505.4M", "Output tokens 8.18M 13.44M 8.02M 2.57M", "Est. cost (USD) $1,376 $1,925 $650 $776", "Cost per task (USD) $22.9 $32.1 $10.8 $12.9", "Sim rollouts 12,214 10,941 10,555 7,905", "LLM calls 9,405 8,535 7,896 5,950", "Actor time per task (min) 79 60 46 27". (accessed 2026-11-20)
- Use in dive: section 19, compute the agent requests. [derived] 1,493.5 / 1,538.3 = 97% of tokens are cache reads, the same pattern as ENPIRE (F04-22). 10,555 rollouts / 60 tasks = about 176 simulator rollouts per task. GPU type and GPU-hours for the simulator side are not stated (U6).

**F04-32. ASPIRE's limits, in the authors' words: on the real robot a human still gives the task guidance, scrambles the cube and resets the scene between episodes; results depend on the frozen language model; the agent can only express what the predefined robot API allows; the loop "is compute-intensive, consuming many LLM calls and simulator or robot rollouts per task".**
- Location: 2607.00272v2, Sec 5 "Limitations" (five paragraphs).
- Verdict: CARRIED (seed 05 section 2.1, re-fetched; v2 wording)
- Evidence: https://arxiv.org/abs/2607.00272v2 | Tier 3, preprint | production report | "In the Rubik's Cube experiment (§3.7), for example, a human operator still provides the initial task guidance, scrambles the cube, and resets the scene between episodes. Unlike simulation, where success checking and scene resets are cheap and programmatic, real-world deployment still requires robust success detection, safe reset, safety monitoring, and calibration maintenance." and "Compute cost. The debugging and evolutionary-search loop is compute-intensive, consuming many LLM calls and simulator or robot rollouts per task. Scaling to very large task suites will require cheaper LLM inference, more sample-efficient search, or stronger mechanisms for reusing prior repairs." (accessed 2026-11-20)
- Use in dive: section 19, the contrast with ENPIRE: ASPIRE has the skill library but not the automatic real-world reset and verifier; ENPIRE has those but learns one task at a time. The repo adds a security caveat: "Trial processes and watchdogs are not a security sandbox. Run generated code on an isolated host without credentials or sensitive mounts" (README at SHA fa00f0ef, line 192).

**F04-33. Online on a real robot, ASPIRE with GPT-6 Astra learned to turn the faces of a Rubik's Cube: the first episode stayed unsolved after 50 min 54 s; the next two solved it in 39 min and 77 min 10 s. Time per completed face turn fell from 16 min 58 s to 3 min 05 s and tokens per turn from 11.27M to 2.01M (estimated $16.85 to $2.89 per turn).**
- Location: 2607.00272v2, Sec 3.7, Figure 6.
- Verdict: NEW (v2 addition)
- Evidence: https://arxiv.org/abs/2607.00272v2 | Tier 3, preprint | benchmark claim (author reported) | "The first attempt remains unsolved after 50 min 54 s; subsequent episodes solve the cube in 39 min and 77 min 10 s. Their logs report 3, 5, and 25 completed face turns, respectively" and "Across the first and final episodes, tokens per turn fall from 11.27 M to 2.01 M, and estimated model cost, at OpenAI API prices [OpenAI, 2026e], from $16.85 to $2.89." and "learning through context refinement rather than model-weight updates." (accessed 2026-11-20)
- Use in dive: section 19, one concrete picture of "the agent as the slow thinking layer": minutes and dollars per physical move. Three episodes, one session.

**F04-34. "You Don't Need To Stay in The Loop" (AgenticRobotics, single author, labelled a preview) frames one research round as a transaction: Bind, Analyze, Act, Measure, Score, Commit. An LLM controller owns the measurement and the decision; disposable worker agents do the analysis and the runs; the objective is immutable; every step is logged before the next so a crash resumes at the first missing phase.**
- Location: 2608.07555v2, Abstract; Sec 1; Figure 1.
- Verdict: CARRIED (seed 05 section 2.2, re-fetched; latest version is v2 of 8 Nov 2026, arXiv comment "Agentic Robotics Preview Version")
- Evidence: https://arxiv.org/abs/2608.07555v2 | Tier 3, preprint (independent researcher) | definition | "AgenticRobotics is a backend-independent control plane in which an LLM controller drives disposable workers through durable train-evaluate-improve transactions: an immutable objective, controller-owned measurement, commit-keyed crash recovery, an evidence-graded skill library, and a tool registry with a standardized, recorded call surface." and "The controller never touches the robot's physics, since embodiment lives behind the tool boundary." (accessed 2026-11-20)
- Use in dive: section 19, the third pattern: the agent as a control plane around ordinary training and evaluation jobs. This is the one closest to what a cloud scheduler runs.

**F04-35. Its promotion gate is statistical. With w the half-width of a 95% interval on the difference of two success rates, a new checkpoint is promoted outright only if it beats the best so far by at least 1.5w; a smaller positive gain goes to a paired confirmation test (McNemar or paired bootstrap); no gain counts as stagnation and forces a change of strategy.**
- Location: 2608.07555v2, Sec 3.5 "Evidence-Gated Promotion".
- Verdict: CARRIED (seed 05 section 2.2, re-fetched)
- Evidence: https://arxiv.org/abs/2608.07555v2 | Tier 3, preprint | definition | "An improvement is promoted outright only when Delta = m_new - m_best >= 1.5w (sign reversed for minimization); a positive but smaller delta triggers confirmation, judged by McNemar or a paired bootstrap on paired episodes. Nonimprovement increments stagnation, which forces a strategy-class switch but never terminates the run. An optional locked acceptance evaluation is read only at exit" Abstract: "The gates provide measured false-promotion control (0.001 false promotions per run with the hardened margin, against 0.005-0.021 with the shipped rule)". (accessed 2026-11-20)
- Use in dive: section 19, why a gate is needed at all: with 100 evaluation episodes the measuring instrument is wide, "100 held-out episodes give a +/-9.5-point interval against an 8-point min_delta" (Sec 5). The paper's own example: a checkpoint that measured 63% once "pooled to 56.5% over 1,200 episodes, so 63% is a metric-best observation, not an estimate of skill" (Sec 4.2).

**F04-36. Its published compute: one Quadro RTX 8000; a SmolVLA improvement campaign on LIBERO-10 committed rounds 0 to 26 over five calendar days, about three of them active GPU time; total cost read from artifacts 121.6 GPU-hours over 5,475 real evaluation episodes. The controller's token cost was not kept.**
- Location: 2608.07555v2, Sec 4 (opening), Sec 4.2, Sec 5 (last paragraph).
- Verdict: CARRIED (seed 05 section 2.2, re-fetched)
- Evidence: https://arxiv.org/abs/2608.07555v2 | Tier 3, preprint | production report | "We audit ledgers and evaluation artifacts from two proof-of-concept campaigns on a Quadro RTX 8000." and "Rounds 0-26 committed over five calendar days (roughly three days of active GPU time). The operator stopped an incomplete round 27, so the loop never satisfied its own exit condition." and "Read from artifacts, the cost was 121.6 GPU-hours over 5,475 real episodes, 9.9 of them for these experiments. Controller token cost was not retained, which is a design defect, since efficiency claims are unfalsifiable without it." (accessed 2026-11-20)
- Use in dive: section 19, GPU-hours and calendar time for an agent-run loop on one GPU. [derived] 5 calendar days = 120 hours; about 3 days active = about 72 hours, a duty cycle of about 60%. The backend is a LeRobot checkout ("The external LeRobot checkout is e40b58a8dfa9").

**F04-37. The paper reports against its own thesis: on the one lineage measured, simply taking the final checkpoint beat every measurement-driven selector, the paper's included, by 5.6 to 10.0 points of held-out success. Re-running one evaluation cell with the same seeds flipped 22 of 100 episode outcomes.**
- Location: 2608.07555v2, Sec 5 (Table 3 discussion); Abstract.
- Verdict: CARRIED (seed 05 section 2.2, re-fetched)
- Evidence: https://arxiv.org/abs/2608.07555v2 | Tier 3, preprint | production report | "The oracle arm is the lineage's final checkpoint, so the trivial human script achieves zero regret at zero evaluation cost, while every measurement-driven strategy, ours included, loses 5.6-10.0 points of held-out success." and "A serial control re-measured one cell alone on the GPU. The aggregate was identical, but 22 of 100 episodes flipped outcome, so fixed-seed evaluation reproduces an episode's initial state, not its outcome." (accessed 2026-11-20)
- Use in dive: section 19, the honest limit of agent-run selection: evaluation noise is large relative to the gains being chased. Two single-seed campaigns on one benchmark; the paper's Limitations section says: "Two single-seed, small-n campaigns on one benchmark suite motivate the design but do not validate it".

**F04-38. What the human still does in that design: writes the immutable objective (metric, direction, threshold, evaluation command), sets allowed executables, paths, budgets, hardware access and approval points, and provides independent safety interlocks for any real robot.**
- Location: 2608.07555v2, "Safety" paragraph in the impact statement; Abstract; Figure 1.
- Verdict: CARRIED (seed 05 section 2.2, re-fetched)
- Evidence: https://arxiv.org/abs/2608.07555v2 | Tier 3, preprint | definition | "Objectives must constrain executables, paths, budgets, hardware access, and human approval points, and real-robot deployment requires independent safety interlocks, since a controller and a statistical gate are not safety certification." and (Abstract) "The title is an operational claim, not a selection claim: the operator can leave because promotion is evidence-gated, state is recoverable, and capability quality is derived from records, not because the loop picks better checkpoints than a human." (accessed 2026-11-20)
- Use in dive: section 19, "what the human still does". In the audited campaign the human also ended it: "The operator stopped an incomplete round 27".

### C. Reward design by language model: history and 2026 successors (section 19)

**F04-39. History (2023): Eureka has a language model write the reward function as code. One run is 5 iterations of 16 candidate rewards, each scored by a full RL training in a GPU simulator; the best candidate and a text summary of its training statistics seed the next iteration. Published compute: one station with 8 A100 GPUs, under one day per run, each RL run at most 8 GB of GPU memory.**
- Location: 2310.12931v2, Sec 3.2 (last paragraph); Appendix D.4 "Computation Resources".
- Verdict: CARRIED (seed 05 section 3.1, re-fetched from the PDF; labelled history, source predates 2025)
- Evidence: https://arxiv.org/abs/2310.12931v2 | Tier 3, peer-reviewed (ICLR 2024, per the arXiv comment) | benchmark claim (author reported) | "In all our experiments, Eureka conducts 5 independent runs per environment, and for each run, searches for 5 iterations with K = 16 samples per iteration." and "All our experiments took place on a single 8 A100 GPU station. Each individual Eureka run took less than one day of wall clock time on our GPU station. Given that Eureka evaluates at most 16 reward functions at a time, and each RL run on Isaac Gym takes at most 8GB of GPU memory, Eureka can be run on 4 V100 GPUs" (accessed 2026-11-20)
- Use in dive: section 19, the origin of "an agent launches training jobs": 5 x 16 = 80 RL trainings per run [derived], in bursts of 16. Headline result: "Eureka outperforms human experts on 83% of the tasks, leading to an average normalized improvement of 52%" (Abstract). The seed's note that the HTML rendering shows "55 iterations" is resolved by the PDF text: 5.

**F04-40. History (2024): DrEureka extends the idea to the simulation settings that make a policy survive the real world. The language model writes the reward and then proposes 16 domain-randomisation configurations, trained in parallel: 3 hours of wall-clock against 10 and 20 hours for two iterative search baselines. The resulting quadruped policies beat human-designed ones by 34% in forward velocity and 20% in distance travelled.**
- Location: 2406.01967v1, Abstract and contribution list; Sec V (baseline comparison paragraph).
- Verdict: CARRIED (seed 05 section 3.2, re-fetched; labelled history, source predates 2025)
- Evidence: https://arxiv.org/abs/2406.01967v1 | Tier 3, peer-reviewed (RSS 2024, per the arXiv comment) | benchmark claim (author reported) | "DrEureka-trained policies outperform those trained with human-designed reward functions and DR parameters by 34% in forward velocity and 20% in distance travelled across various real-world evaluation" and "since these baselines are iterative, DrEureka incurs a significantly shorter wall-clock runtime of 3 hours, compared to 10 and 20 for CEM and BayRn." (accessed 2026-11-20)
- Use in dive: section 19, one entry of history; define domain randomisation at first use (varying friction, mass, gravity and similar in simulation so the policy does not overfit one simulator setting). GPU type for DrEureka is not stated in the text (U7).

**F04-41. CaP-X (2026) is the benchmark and toolkit the NVIDIA agents build on: an environment where a coding agent controls a robot by writing programs that call perception and control functions, tested across 12 models. Human-written reference programs reach 88.5% average success and took 2 to 3 weeks of development per contact-rich task; an agent evaluation takes about 2 minutes per trial.**
- Location: 2603.22435v2, Abstract; Appendix (human reference and timing discussion, PDF text lines 3577 to 3593).
- Verdict: CARRIED (seed 05 section 4.1, re-fetched; v2 of 2 Jul 2026 is the latest)
- Evidence: https://arxiv.org/abs/2603.22435v2 | Tier 3, preprint (NVIDIA, UC Berkeley, Stanford, CMU) | benchmark claim (author reported) | "The iterated human reference achieves 88.5% average success on single-turn tiers" and "took 2-3 weeks of iterative development per task" and "complete evaluation of CaP-Agent0 on a Robosuite task takes approximately 2 minutes per trial (see Appendix K.2)." (accessed 2026-11-20)
- Use in dive: section 19, one line of lineage: Code as Policies (2023) to CaP-X (2026) to ENPIRE and ASPIRE, which both cite it for their tool calls. Code: github.com/capgym/cap-x, tag v0.0.1 (2026-04-01).

**F04-42. RACaP (Sep 2026) publishes the dollar cost of an agent evolving its own robot-control library in simulation, in tens of dollars per campaign, and results on LIBERO: 54.4% in-domain, 45.0% zero-shot on LIBERO-PRO, 46.0% on long-horizon LIBERO-Long.**
- Location: 2609.29394v1, Abstract; Sec 1.
- Verdict: CARRIED (seed 05 section 4.2, existence and headline results re-fetched; the run-time cost per episode was re-located; the seed's Table 6 campaign figures ($62.55 for 15 rounds, 2,474 API calls) were not re-located by text search in this pass and stay UNKNOWN, U8)
- Wave 2 (2026-11-20, WRONG): The tens-of-dollars campaign cost belongs to the RATS baseline, not to RACaP. Corrected claim: RACaP (arXiv 2609.29394v1) reports 54.4% in-domain on LIBERO, 45.0% zero-shot on LIBERO-PRO and 46.0% on LIBERO-Long. Its only dollar figure for its own method is run time: $0.089 and 32.9 s per episode on Robosuite (RACaP-RS), against $0.159 and 90.7 s for RATS-RS. Table 6 prices the development campaign only for the RATS baseline ($62.55 for 15 rounds and 2,474 API calls); the RACaP row (32 proposals, 596 simulator episodes) lists API calls and cost as "n/a". Closes U8. See `wave2-B.md` row F04-42.
- Evidence: https://arxiv.org/abs/2609.29394v1 | Tier 3, preprint (CUHK and collaborators) | benchmark claim (author reported) | "On LIBERO, RACaP achieves 54.4% in-domain success, transfers zero-shot to LIBERO-PRO with 45.0% success, and solves 46.0% of long-horizon tasks on LIBERO-Long" and, on run-time cost, "$0.089 per episode versus 90.7 seconds and $0.159 for RATS-RS" (accessed 2026-11-20)
- Use in dive: section 19, optional one-line mention. Lower success than ASPIRE on related suites; different models and protocol, so not directly comparable.

**F04-43. SimEX (30 Sep 2026; UT Austin, NVIDIA-affiliated authors) does the agent's trial and error in simulation first and spends only five real trials, about 10 minutes of robot time per task, to repair the result. On a physical YAM robot it succeeded in 26 of 30 trials across three tasks, where the authors' re-implementations of ENPIRE and ASPIRE under the same five-trial budget succeeded in at most 3 of 30.**
- Location: 2609.38982v1, Abstract; Sec 3.1 (baselines); Sec 3.3, Table 1.
- Verdict: CARRIED (seed 05 section 7.2, re-fetched). The head-to-head against re-implemented ENPIRE and ASPIRE was not in the seed: NEW.
- Evidence: https://arxiv.org/abs/2609.38982v1 | Tier 3, preprint | benchmark claim (author reported) | Table 1 "Physical-robot successful evaluation trials out of 10" (Plate / Towel / Barcode): "Direct CaP 0/10 0/10 0/10", "ENPIRE* 2/10 1/10 0/10", "ZS Sim2Real 0/10 2/10 0/10", "ASPIRE* 2/10 0/10 0/10", "SimEX (ours) 10/10 8/10 8/10". Text: "These five trials amount to only about 10 minutes of wall-clock robot interaction per task. Between each trial, a human operator resets the scene." and "An asterisk marks a baseline that we reimplement under our common interface and budget." (accessed 2026-11-20)
- Use in dive: section 19, the newest counterpoint to ENPIRE: when robot time is the scarce input, move the search into simulation. Caveats to state: the ENPIRE and ASPIRE rows are the SimEX authors' re-implementations under a five-trial budget, which is far below the hours ENPIRE is designed to run; and SimEX still uses a human to reset the scene.

**F04-44. SimEX's agent cost per task: in the simulation stage each of four population members makes 840 orchestrator calls with 5.4 hours of model thinking time, 1.98M output tokens and 155M cache-read input tokens; the real-robot stage adds 124 calls, 31 minutes and 19.5M cache-read tokens. The finished toolbox then needs one model call of about 30 seconds per task.**
- Location: 2609.38982v1, Appendix A.3, Table 3; Table 2 (budgets).
- Verdict: CARRIED (seed 05 section 7.2, re-fetched)
- Evidence: https://arxiv.org/abs/2609.38982v1 | Tier 3, preprint | benchmark claim (author reported) | Table 3 "Coding agent orchestration cost", Stage 1 (per member) / Stage 2 (per run): "Orchestrator calls 840 124", "Agent thinking time 5.4 h 31 min", "Output tokens (reasoning) 1.98M (1.16M) 161k (64k)", "Cache-read input tokens 155M 19.5M". Text: "once the toolbox is optimized, running inference for a given task takes only around 30 seconds." Its one hard rule for the agent: "The only HARD rule is the no-cheating constraint". (accessed 2026-11-20)
- Use in dive: section 19, compute the agent requests: hours of model time and hundreds of millions of cached tokens per task, against minutes of robot time.

### D. Who grades the agent: learned judges and resets (section 19)

**F04-45. A vision-language model (VLM) used as a success judge is unreliable where it matters most. FailBench (Sep 2026) tested 13 VLM-based detectors on 2,197 real and simulated manipulation attempts: the best reached 0.77 mean balanced accuracy, none exceeded 0.60 on contact-heavy assembly, and errors lean toward declaring success.**
- Location: 2609.03611v1, Abstract.
- Verdict: CARRIED (seed 05 section 5.2, re-fetched)
- Evidence: https://arxiv.org/abs/2609.03611v1 | Tier 3, preprint | benchmark claim (author reported) | "Evaluating 13 VLM-based detectors, we find that the best model achieves only 0.77 mean balanced accuracy" and "detection approaches saturation when success is determined by observable object motion, but approaches chance when success depends on establishing contact, with no model exceeding 0.60 balanced accuracy on contact-intensive assembly tasks. Analysis of model reasoning reveals a systematic bias toward predicting success under ambiguous evidence. Increasing reasoning effort does not alleviate this bias, as incorrect predictions tend to receive longer reasoning traces." (accessed 2026-11-20)
- Use in dive: section 19, "who grades it" and why ENPIRE's verifier fuses force and height with vision (F04-12). Define balanced accuracy at first use: the mean of the detection rate on successes and the detection rate on failures; 0.5 is chance. For block-in-cup the outcome is visible object motion, the favourable case; for insertion-style tasks it is the unfavourable one [our reading].

**F04-46. A VLM can also be the reward for real-robot RL when prompted in two steps (describe what happened, then assess progress). D&A (Nov 2026, UW and NVIDIA-affiliated authors) reports real-robot RL reaching 100% success in about 90 minutes of wall-clock time on one task with such a reward; the stated limits are the judge's latency, token cost and context window.**
- Location: 2611.03622v1, Abstract; real-robot RL result paragraph; limitations.
- Verdict: CARRIED (seed 05 section 5.2, re-fetched)
- Evidence: https://arxiv.org/abs/2611.03622v1 | Tier 3, preprint | benchmark claim (author reported) | "D&A provides this signal, assigning zero reward to ice-cream-cone trajectories and high, dense reward for manipulating the banana, raising the success rate to 100% in ~90 minutes of wallclock time." Limitations: "it inherits the systemic constraints of off-the-shelf frontier models, including high inference latency, token cost, and restricted context windows." (accessed 2026-11-20)
- Use in dive: section 19 and section 8 (real-robot RL needs a reward source: a small trained classifier as in HIL-SERL, F04-74, or a large general model as here). One task; indicative.

**F04-47. Calling a large VLM on every episode is costly enough that 2026 systems gate or structure the calls. VLMeg (Oct 2026) only sends "judgment-worthy" observations to the judge; ARS (Sep 2026) runs an open 27B model as a two-agent reward system and finds that several reward baselines give credit when the robot manipulates the wrong object.**
- Location: 2610.15401v1, Abstract and Sec 1; 2609.34484v1, Abstract and Sec 4 (model choice).
- Verdict: CARRIED (seed 05 section 5.2, re-fetched)
- Evidence: https://arxiv.org/abs/2610.15401v1 | Tier 3, preprint | definition | "First, the inference cost and latency of large models are non-negligible, especially for leading closed-source models, while RL usually requires a massive number of environment samples. How to avoid redundant VLM usage and reduce the training burden is therefore critical." https://arxiv.org/abs/2609.34484v1 | Tier 3, preprint | benchmark claim (author reported) | "We evaluate ARS using a 27B general-purpose VLM." and "evaluated reward baselines assign spurious progress to wrong-object manipula[tion]"; the model is "open-weight Qwen3.6-27B". (accessed 2026-11-20)
- Use in dive: section 19, one sentence: the judge is itself an inference workload that scales with the number of episodes.

### E. What compute the agent requests and wastes, and what a scheduler can enforce (section 19)

AWS scheduler mechanics are owned by stream 09. The entries below record only the first-party facts that bear on agent guardrails, each re-fetched.

**F04-48. Across the three 2026 agent loops that publish resource figures, the pattern is the same: the GPU the agent owns is busy a minority of the time (ENPIRE 29% to 49% of research wall-clock; AgenticRobotics about 3 active GPU-days in 5 calendar days), most experiments are discarded (ENPIRE 58 of 86 ideas), and tokens, mostly cache reads, are the fastest-growing cost.**
- Location: synthesis of F04-19, F04-20, F04-22, F04-23, F04-31, F04-36.
- Verdict: NEW ([our reading]; every input is an entry above)
- Evidence: https://arxiv.org/abs/2606.19980v2 and https://arxiv.org/abs/2608.07555v2 and https://arxiv.org/abs/2607.00272v2 | Tier 3 (peer-reviewed CoRL 2026; preprint; preprint) | production report | ENPIRE Sec 4: "Coding agents may also fail to launch parallel training sessions to exhaust GPU resources."; AgenticRobotics Sec 4.2: "five calendar days (roughly three days of active GPU time)"; ASPIRE Table 20: "Total tokens ... 1,538.3M", "Cache-read tokens ... 1,493.5M". (accessed 2026-11-20)
- Use in dive: section 19, the compute paragraph. [our reading] An agent that owns a GPU idles it; an agent that shares a queue needs limits it cannot edit. No robotics paper read reports queue waits, interruptions or the dollar cost of agent-launched GPU jobs (U9).

**F04-49. None of the three loops lets the agent choose its hardware, and none publishes a GPU-hour or token budget enforced on the agent. The budgets that exist are a real-trial budget set by the operator (ENPIRE), fixed iteration and trial counts (SimEX: 4 population members, 20 iterations each, 5 adaptation trials), and a required timeout on every tool call (AgenticRobotics).**
- Location: ENPIRE repo `autoresearch_instruction.md` line 12 and 26; 2609.38982v1 Table 2 as carried by seed 05 section 7.2 (budget rows not re-read in this pass); 2608.07555v2 Sec 3.
- Verdict: CARRIED (seed 05, re-fetched for ENPIRE and for SimEX Table 2, whose rows read "Independent population members 4", "Optimization iterations per member 20", "Broad probe configurations per iteration 24-32", "Robot rollouts per iteration 1", "Repair candidates per iteration 4", "Adaptation trials per run 5")
- Evidence: https://raw.githubusercontent.com/NVlabs/ENPIRE/99ee90acf65b5b18957c8382ad580db999528be3/enpire/policy/autoresearch_instruction.md | Tier 1, code repository instruction file | definition | "4. Run only the approved number of real-world trials." and "6. Resume the robot loop only after the operator-approved trial budget begins." (accessed 2026-11-20)
- Use in dive: section 19, the gap a cloud deployment must fill: in the papers the cap on compute is the one GPU bolted to the station.

**F04-50. AWS Batch has no job timeout unless one is set. With `attemptDurationSeconds` (minimum 60 seconds) on the job definition or at submission, Batch sends SIGTERM when the time is up and SIGKILL 30 seconds later; a job ended by its timeout is not retried; children of an array job inherit the parent's timeout.**
- Location: AWS Batch User Guide, "Job timeouts".
- Verdict: CARRIED (seed 05 section 10.2, re-fetched)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/job_timeouts.html | Tier 1, first-party docs | documentation of support | "By default, AWS Batch doesn't have a job timeout. If you don't define a job timeout, the job runs until the container exits." and "You specify an attemptDurationSeconds parameter, which must be at least 60 seconds, either in your job definition, or when you submit the job." and "If a job is terminated for exceeding the timeout duration, it isn't retried." and "For array jobs, child jobs have the same timeout configuration as the parent job." (accessed 2026-11-20)
- Use in dive: section 19, the simplest guardrail for agent-launched jobs: a hard wall-clock cap that lives in the job definition, outside the code the agent edits. "Timeout terminations are handled on a best-effort basis."

**F04-51. AWS Batch fair-share scheduling divides a queue among "share identifiers" (one per team or agent). A weight factor sets relative share (lower weight gets more: 0.125 gets eight times the compute of weight 1), and a compute reservation holds capacity back so one share identifier cannot take the whole queue.**
- Location: AWS Batch User Guide, "Use fair-share scheduling to help schedule jobs".
- Verdict: CARRIED (seed 05 section 10.2, re-fetched)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/fair-share-scheduling.html | Tier 1, first-party docs | documentation of support | "Compute reservation - Prevents jobs in a single share identifier from using up all the resources that are attached to the job queue. The reserved ratio is (computeReservation/100)^ActiveFairShares where ActiveFairShares is the number of active share identifiers." and "A lower value lets jobs from the share identifier run or gives additional runtime to the share identifier. For example, jobs that use a share identifier with a weight factor of 0.125 (1/8) are assigned eight times the compute resources of jobs that use a share identifier with a weight factor of 1." (accessed 2026-11-20)
- Use in dive: section 19, how to stop a burst of agent jobs starving people. Fair share allocates relative shares; it is not an absolute GPU-hour budget [our reading of the page, which names no absolute cap].

**F04-52. AWS Batch "consumable resources" let a job wait for something that is not CPU, GPU or memory: the docs' examples are licence tokens, database bandwidth and third-party API throttles. Batch tracks the count and starts a job only when its required quantity is free. Works with FIFO and fair-share policies, on EKS, ECS and Fargate, and with array and multi-node jobs.**
- Location: AWS Batch User Guide, "Resource-aware scheduling".
- Verdict: CARRIED (seed 05 section 10.2, re-fetched)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/resource-aware-scheduling.html | Tier 1, first-party docs | documentation of support | "AWS Batch resource-aware scheduling lets you schedule jobs based on consumable resources that are needed to run your jobs - 3rd party license tokens, database access bandwidth, the need to throttle calls to a third-party API, and so on." and "Batch keeps track of how many consumable resources are available for the jobs in your job queues and makes sure that a job is scheduled to run only when all the required consumable resources are available" and "Resource-aware scheduling is available for both FIFO and Fair-share scheduling policies and can be used with all compute platforms supported by Batch including EKS, ECS, and Fargate." (accessed 2026-11-20)
- Use in dive: section 19. [our reading] A physical robot station is exactly such a resource (count 1 per arm): modelling "robot-station" as a consumable resource is our proposal, not an AWS-documented robotics pattern.

**F04-53. Amazon Bedrock AgentCore Runtime sessions end after at most 8 hours on microVMs (14 days on the Instances type); the idle timeout defaults to 15 minutes; a synchronous request times out at 15 minutes; asynchronous jobs run up to 8 hours (microVMs) or 14 days (Instances); a session gets 2 vCPU and 8 GB by default, up to 8 vCPU and 32 GB.**
- Location: AgentCore Developer Guide, "Quotas" page (runtime lifecycle and limits tables).
- Verdict: CARRIED (seed 05 section 8.4, re-fetched; values unchanged)
- Evidence: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/bedrock-agentcore-limits.html | Tier 1, first-party docs | documentation of support | "Maximum session duration 8 hours ... On microVMs, AgentCore Runtime terminates the execution environment regardless of activity. The maximum is 8 hours. On Instances, AgentCore Runtime stops the agent after any in-flight invocation finishes. ... The maximum is 14 days" and "Idle session timeout 15 minutes of inactivity" and "Request timeout 15 minutes" and "Asynchronous job maximum duration 8 hours (microVMs), 14 days (Instances)" and "Maximum hardware allocation per session 2 vCPU/8 GB (default), up to 8 vCPU/32 GB with resource configurations" (accessed 2026-11-20)
- Use in dive: section 19, one sentence: an agent hosted there cannot simply block on a multi-day campaign; ENPIRE's single-agent runs were 4 and 8 hours (F04-17) and the AgenticRobotics campaign five days (F04-36), so campaign state has to live outside the session (Git in ENPIRE, an append-only ledger in AgenticRobotics).

### G. RL in simulation: thousands of copies of the robot on one GPU (section 8)

RL basics in one sentence, then a pointer: reinforcement learning improves a policy from its own attempts, scored by a reward, and PPO (Proximal Policy Optimization) is the standard algorithm that takes small, bounded update steps from batches of fresh attempts (link to the Learning From Feedback dive for policy gradient, PPO, reward and advantage). Simulator internals are stream 06; the entries here record the RL usage.

**F04-54. Isaac Lab 3.0 (released 20 Oct 2026) publishes training throughput for its tasks on one GPU with 8,192 parallel environments. For a Franka arm lifting a cube from state observations, PPO training (RSL-RL) runs at about 165,000 environment steps per second on the PhysX backend and about 319,000 on the Newton MuJoCo-Warp backend, on one RTX PRO 6000 Blackwell Server Edition.**
- Location: IsaacLab at tag v3.0.0, `docs/source/_static/benchmarks/environment-performance-release.csv`, rows dated 2026-10-12 for task `Isaac-Lift-Franka`; `docs/source/_static/benchmarks/README.md`.
- Verdict: NEW (the seed named no Isaac Lab throughput; newest version found is v3.0.0, not the 2.x line)
- Evidence: https://raw.githubusercontent.com/isaac-sim/IsaacLab/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/_static/benchmarks/environment-performance-release.csv | Tier 1, first-party repository data at a release tag | benchmark claim (vendor reported) | Columns task, physics_backend, rendering_backend, total_fps_mean, collection_fps_mean, vram_mean_gb, gpu_util_mean_pct: "Isaac-Lift-Franka ... isaacsim_physx,none,8192 ... 164777.20 ... 194789.44 ... 14.74 ... 50.41"; "Isaac-Lift-Franka ... newton_mjwarp,none,8192 ... 318650.60 ... 455387.42 ... 5.41 ... 41.33"; gpu_name "NVIDIA RTX PRO 6000 Blackwell Server Edition", cpu_name "INTEL(R) XEON(R) GOLD 5512U". README: "All plotted runs use 8,192 environments and the same single-GPU hardware. Runs use RSL-RL" and "Each measured row supplies Collection FPS (rollouts and policy inference) and Training FPS (including policy updates)". (accessed 2026-11-20)
- Use in dive: section 8, "RL in simulation" and the simulated half of the worked example. [vendor claim] The rows carry the quality note "dirty working tree reported", and the Newton row adds "Total FPS coefficient of variation >25%"; the README says "The release display label does not verify release-tag source commits." These are throughput figures; time to a working policy is not in this file (U11).

**F04-55. Adding a camera costs most of the throughput. Same benchmark, 8,192 environments, one camera per environment: a Kuka-Allegro lift task trains at about 28,000 steps per second with PhysX physics and RTX rendering, against about 61,000 without the camera; with the Newton physics and Newton renderer pair it is about 116,000 against 221,000.**
- Location: IsaacLab at tag v3.0.0, same CSV, rows dated 2026-10-12 for `Isaac-Lift-KukaAllegro` and `Isaac-Lift-KukaAllegro-Camera`.
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/isaac-sim/IsaacLab/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/_static/benchmarks/environment-performance-release.csv | Tier 1, first-party repository data at a release tag | benchmark claim (vendor reported) | total_fps_mean values: "Isaac-Lift-KukaAllegro ... isaacsim_physx,none ... 60756.60"; "Isaac-Lift-KukaAllegro-Camera ... isaacsim_physx,isaacsim_rtx ... 27962.00" (vram_mean_gb 24.22); "Isaac-Lift-KukaAllegro ... newton_mjwarp,none ... 220831.00"; "Isaac-Lift-KukaAllegro-Camera ... newton_mjwarp,newton_renderer ... 115888.50" (vram_mean_gb 13.61). README: Kuka camera tasks use "`rgb64` and `simple_shading_full_mdl64`" presets, that is 64 x 64 images. (accessed 2026-11-20)
- Use in dive: section 8, why vision-based RL in simulation is the expensive case, and which part of the GPU it loads: physics and the policy use the tensor cores; RTX rendering adds the ray-tracing path and memory (24 GB against 17 GB here). [derived] 27,962 / 60,757 = 46% of the state-only rate on PhysX plus RTX; 115,889 / 220,831 = 52% on Newton.
- Wave 3 note (2026-11-20): camera confirmed as one fixed base camera at 64 x 64 per environment (`single_camera` preset; RGB for the Newton renderer row, the `simple_shading_full_mdl` data type for the RTX row). Source and caveats in register 06, F06-103. The matching Cartpole rows are not confirmed (F06-104).

**F04-56. MuJoCo Playground reports PPO training throughput per task on one A100: 140,386 environment steps per second for a Franka arm picking a cube from state, 38,015 for the pixel-based version of the same task. Its sim-to-real pick-cube policy from pixels trained in ten minutes on one RTX 4090 and succeeded in 12 of 12 real trials.**
- Location: 2502.08844v1, Sec IV-C (manipulation, training and results paragraphs); Appendix Table IX.
- Verdict: NEW (seed 01 section 16 did not carry Playground figures)
- Evidence: https://arxiv.org/abs/2502.08844v1 | Tier 3, peer-reviewed (RSS 2025: the repository README at v1.0.1 calls the original environments "the original RSS 2025 JAX/MJX environments") | benchmark claim (author reported) | Table IX "PPO Steps per Second": "PandaPickCube ... 140386 +/- 1707", "PandaPickCubeCartesian ... 38015 +/- 5302", caption "Training throughput is displayed for all the Manipulation environments on an A100 GPU device across 5 seeds using brax PPO". Text: "Training in simulation takes ten minutes on a single RTX 4090. d) Results: Our policy achieves a 100% success rate in 12 real-world trials, robustly grasping the block and lifting it clear of the table." Abstract: "researchers can train policies in minutes on a single GPU." (accessed 2026-11-20)
- Use in dive: section 8, the published "wall-clock to a working policy" figure for a pick task: ten minutes on one consumer GPU, from pixels, transferring to a real Franka arm. Paper dated Feb 2025; the software has since been rewritten (F04-57).

**F04-57. MuJoCo Playground 1.0 (6 Nov 2026; v1.0.1 on 9 Nov 2026) is a rewrite in PyTorch on MuJoCo Warp, and it ships the thread task's first half for the thread robot: an SO-101 pick-cube environment trained with PPO from a 64 x 64 wrist camera and deployed zero-shot on the real arm.**
- Location: mujoco_playground at tag v1.0.1: `README.md` lines 9 to 17 and 85 to 113; `mujoco_playground/tasks/manipulation/pick_cube/so101/deploy/README.md`; `mujoco_playground/tasks/manipulation/pick_cube/so101/task.py` lines 315 and 382 to 394.
- Verdict: NEW (not in the seed; changes what is possible for the SO-101)
- Evidence: https://github.com/google-deepmind/mujoco_playground/tree/v1.0.1 (tag commit 084e7957842792725d70866ee840d8fd79f17bbe) | Tier 1, source code and docs at a release tag | documentation of support | README: "MuJoCo Playground is a suite of robot environments, reinforcement learning tasks, and hardware workflows written in PyTorch and built on `reaf-sim`, MuJoCo, and MuJoCo Warp." and "Train a PPO policy across parallel GPU environments with RSL-RL". Deploy README: "Train a visual policy to pick up a cube in sim and deploy zero-shot onto the real robot." task.py: "cfg.sim.control_timestep = 0.1  # 10 Hz control frequency" and camera "width=64, height=64". (accessed 2026-11-20)
- Use in dive: section 8, the SO-101 path for RL in simulation, and section 8's worked example. It is pick-cube, not block-in-cup: the placing half is not in this release. The measured real-world success rate of the SO-101 policy is not stated in the files read (U12).

**F04-58. The default PPO recipe for that SO-101 vision task runs 4,096 simulated arms in parallel, collects 16 control steps from each per iteration, and trains for 3,000 iterations: about 197 million control steps in total. The actor is a two-layer convolutional encoder on the camera image feeding a 256-256-128 MLP.**
- Location: mujoco_playground at tag v1.0.1, `mujoco_playground/_src/rl/rsl_rl/env_rl_config.py` lines 133 to 173 (class `PickCubeVisionRslRlOnPolicyRunnerCfg`).
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/google-deepmind/mujoco_playground/084e7957842792725d70866ee840d8fd79f17bbe/mujoco_playground/_src/rl/rsl_rl/env_rl_config.py | Tier 1, source code at a release tag | code behaviour | "nworld: int = 4096", "max_iterations: int = 3000", "num_steps_per_env: int = 16"; CNN "output_channels=(16, 32), kernel_size=(5, 3), stride=(2, 2)"; actor "hidden_dims=(256, 256, 128)"; critic "hidden_dims=(512, 256, 128)"; "self.algorithm.clip_param = 0.2". The deploy README notes a CPU fallback: "# --overrides='{"nworld": 64}'  # For CPU". (accessed 2026-11-20)
- Use in dive: section 8, the worked example's simulated side. [derived] 4,096 x 16 x 3,000 = 196,608,000 control steps; at the 10 Hz control rate (F04-57) that is 19,660,800 simulated seconds, about 228 days of one arm's experience. Wall-clock for this recipe is not stated in the files read (U12); the 2025 paper's figure for the Franka version was ten minutes on one RTX 4090 (F04-56).

**F04-59. Isaac Lab 3.0 also carries SO-101 assets and tasks (a cube-stacking task and a keyboard-typing deployment guide), and its release notes pin the stack it was built on: Isaac Sim 6.2, Newton 1.6.1, RSL-RL 5.5.1, PyTorch 2.11 with CUDA 13.0.**
- Location: IsaacLab at tag v3.0.0: file list (`source/isaaclab_assets/isaaclab_assets/robots/so101.py`, `source/isaaclab_tasks/isaaclab_tasks/contrib/stack/config/so101/`, `docs/source/policy_deployment/06_so101_typing/so101_typing_policy.rst`); GitHub release notes for v3.0.0.
- Verdict: NEW
- Evidence: https://github.com/isaac-sim/IsaacLab/releases/tag/v3.0.0 (tag commit e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4) | Tier 1, first-party release notes and source tree at a release tag | documentation of support | "Isaac Lab 3.0 is now generally available." and "This release targets Isaac Sim 6.2, Python 3.12, PyTorch 2.11 with CUDA 13.0, NVIDIA Warp 1.17, Newton 1.6.1, and RSL-RL 5.5.1." and "Newton is a Warp-native physics backend with multiple solver paths, including MuJoCo-Warp, VBD, and MPM." (accessed 2026-11-20)
- Use in dive: section 8, one line on where the SO-101 exists in simulation. The SO-101 task files were located by path only; their contents (observation, reward, training time) were not read in this pass (U13). Newton's own newest release is v1.8.0 (11 Nov 2026), newer than the 1.6.1 that Isaac Lab 3.0 targets; no standalone Newton RL throughput figure was located (U14).

### H. RL on top of a pretrained policy (section 8)

**F04-60. Recap ("RL with Experience and Corrections via Advantage-conditioned Policies", Physical Intelligence, Nov 2025) improves a pretrained vision-language-action (VLA) model from its own deployments in three repeated steps: collect autonomous rollouts (with optional human corrections), train a value function on all the data, retrain the policy conditioned on whether each action was better than expected.**
- Location: 2511.14759v2, title and Abstract; Sec IV-C "Method summary"; Algorithm 1.
- Verdict: CARRIED (seed 01 section 3.4, re-fetched; latest version is v2 of 19 Nov 2025)
- Evidence: https://arxiv.org/abs/2511.14759v2 | Tier 3, preprint (first-party lab) | definition | "the method can be fully defined through application of three subroutines: collecting data through autonomous rollouts (with optional corrective interventions from an expert), training a value function according to Equation 1, and training a policy according to Equation 3. The only thing that changes between different steps of the method is the data provided to each subroutine" Algorithm 1 title: "RL with Experience and Corrections via Advantage-conditioned Policies (RECAP)". (accessed 2026-11-20)
- Use in dive: section 8, the second RL setting. Plain words: the robot practises, a second model learns to tell how well things are going, and the policy is retrained to act the way it acted when things went better than expected.

**F04-61. The value function in Recap predicts how many steps remain until the task succeeds (as a negative number, normalised per task to between -1 and 0). It is a separate, smaller model: a 670M-parameter VLM backbone, outputting a distribution over 201 value bins, trained by cross-entropy on the returns actually observed in the data.**
- Location: 2511.14759v2, Sec IV-A (Eq. 1); Sec V-C "Reward definition and value function training"; Figure 4 caption.
- Verdict: CARRIED (seed 01 section 3.4, re-fetched)
- Evidence: https://arxiv.org/abs/2511.14759v2 | Tier 3, preprint | definition | "we train p_phi(V|o_t, l) by first discretizing the empirical return value R_t(tau) into B = 201 bins ..., and then minimizing the cross-entropy H over the trajectories in the current dataset D" and (Fig. 4) "We train a multi-task value function to predict the number of steps to success, normalized by maximum task length to (-1, 0), where 0 corresponds to successful completion." and "uses the same architecture design, with a smaller 670M parameter VLM backbone that is also initialized from Gemma 3". (accessed 2026-11-20)
- Use in dive: section 8, the mechanism. Symbols: o_t is the observation (camera images and joint state) at time t, l the language instruction, R_t the return from time t to the end of the episode (here, minus the number of remaining steps, with a penalty on failure), p_phi the value model with weights phi. The reward is deliberately generic: "we use a general sparse reward definition that can be applied to essentially any task."

**F04-62. Advantage conditioning, the mechanism: the policy gets one extra input, a binary flag I_t that says "this action was better than expected". The flag is true when the action's advantage (how much better the outcome was than the value function predicted) exceeds a per-task threshold. The policy is trained by ordinary supervised learning on all the data, good and bad, with the flag attached; at run time the flag is set to true.**
- Location: 2511.14759v2, Sec IV-B "Policy extraction via advantage conditioning"; Figure 3 caption; Sec V-D.
- Verdict: CARRIED (seed 01 section 3.4 mentioned the method only by name; mechanism re-fetched and recorded here)
- Evidence: https://arxiv.org/abs/2511.14759v2 | Tier 3, preprint | definition | "we use a variant of advantage conditioning [48], where the policy is trained on all of the data with supervised learning, but with an additional input indicating how optimal the action is based on the advantage." and (Fig. 3) "The VLA is conditioned on a binarized advantage indicator, obtained from a separate value function initialized from a pre-trained but smaller VLM model." and (Sec V-D) "We set epsilon_l to the 30% percentile of values predicted by the value function for the task l." and "During training, we randomly omit the indicator I_t ... to allow us to either directly sample from the policy with I_t = True ..., or to use both a conditional and unconditional model to implement classifier-free guidance (CFG), which enables inference with beta > 1." (accessed 2026-11-20)
- Use in dive: section 8, mechanism at "which tensor goes where": value model reads (images, state, instruction) and outputs a value; advantage = observed outcome minus that value; flag = advantage above threshold epsilon_l; the flag is one more conditioning input to the VLA next to the instruction. Why this form: it avoids policy-gradient updates through a flow-matching action head and it does not discard the poor episodes. Link to the Learning From Feedback dive for what an advantage is.

**F04-63. Human corrections enter the same way: any action a human supplied while taking over during an autonomous rollout is given the flag "true" by fiat.**
- Location: 2511.14759v2, Sec IV-B (last paragraph before the flow-matching discussion).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2511.14759v2 | Tier 3, preprint | definition | "To include human corrections, we found it useful to force I_t = True (i.e., positive) for actions provided as human corrections during autonomous rollouts. This choice is reasonable if we assume that human experts always provide good corrective actions." (accessed 2026-11-20)
- Use in dive: section 8, one sentence tying the three data sources (demonstrations, autonomous episodes, corrections) to one training rule.

**F04-64. The model being improved, pi*0.6, is a VLA built on a Gemma 3 4B vision-language model with an 860M-parameter action expert that outputs joint and gripper commands at 50 Hz.**
- Location: 2511.14759v2, Sec V-A and V-B.
- Verdict: CARRIED (seed 01 section 3.4, re-fetched)
- Evidence: https://arxiv.org/abs/2511.14759v2 | Tier 3, preprint | definition | "(ii) The base VLM is Gemma 3 [78] 4B model. (iii) The size of the action expert is increased to 860M parameters." and "The arms are controlled at 50 Hz with joint positions." (accessed 2026-11-20)
- Use in dive: section 8, the size of what is being retrained each iteration (stream 02 owns the model family). Learner GPU count and hours per iteration are not stated in the paper (searched the text for "GPU"; no training-compute statement found), U15.

**F04-65. Data per Recap iteration is hundreds of episodes on three or four robots. T-shirt folding: 300 autonomous trajectories on four robots per iteration, two iterations. Box assembly: 600 autonomous trials and 360 with interventions per iteration, on 3 robots. The paper's sentence "about 1000 autonomous and 280 + 378 correction episodes spread over 3 robots" describes the failure-mode-removal ablation.**
- Location: 2511.14759v2, Sec VI-B.2 (iteration study); Appendix (data collection details, the paragraph that begins with the diverse laundry counts).
- Verdict: WRONG in the seed (seed 01 section 3.4 and section 16 quote "spread over 33 robots" and call it the overall total; the PDF and the HTML source both read 3 robots, and the sentence is scoped to one ablation)
- Evidence: https://arxiv.org/abs/2511.14759v2 | Tier 3, preprint | production report | "We collect 300 trajectories on four robots in each iteration. Box assembly uses both autonomous trials and trials with expert teleoperator interventions, with 600 autonomous trials and 360 trials with interventions in each iteration." and (Appendix) "For the diverse laundry folding task we collect 450 evaluation episodes and 287 correction episodes. For the failure mode removal ablation we collect both autonomous and policy correction data. In total we collect ~1000 autonomous and 280 + 378 correction episodes spread over 3 robots. For box assembly we collect data in the deployment scenario directly, collecting 600 demonstrations and 360 correction episodes in each iteration, using 3 robots in total." (accessed 2026-11-20)
- Use in dive: section 8, "episodes and robots used". The "33" comes from the arXiv HTML rendering, where the inline math "3" is emitted twice (the HTML source has the number once as MathML content and once as its annotation); the PDF text reads "3 robots". Note the appendix says "600 demonstrations" where the main text says "600 autonomous trials" for box assembly; recorded under Contradictions.

**F04-66. Results [author reported]: on the hardest tasks (diverse laundry folding, espresso making) adding on-robot experience more than doubles throughput (successful tasks per hour) and roughly halves the failure rate. The system ran espresso making for 13 hours straight. One iteration is often enough.**
- Location: 2511.14759v2, Abstract; Sec I; Sec VI-B.1; Figure 7 caption.
- Verdict: CARRIED (seed 01 section 3.4, re-fetched)
- Evidence: https://arxiv.org/abs/2511.14759v2 | Tier 3, preprint | benchmark claim (author reported) | "Throughput more than doubles on the diverse laundry folding and espresso tasks from including on-robot data (the improvement from offline RL + SFT to the final pi*0.6 model), and the rate of failure reduces by about a factor of two." and "we were able to run it to make espresso drinks for 13 hours straight, fold novel laundry items in a new home for over two hours without interruptions" and "in practice we found that even one iteration often leads to significantly improved results." Fig. 7: "We show the number of successfully completed tasks per hour ... This metric measures both success and speed." (accessed 2026-11-20)
- Use in dive: section 8, results, with the metric (throughput = successes per hour) defined first.

**F04-67. Recap's stated limits name the scarce inputs of real-world RL: people still label rewards, intervene and reset the scene; exploration is mostly greedy; and updates are batch ("collects a batch of data, retrains the model, and repeats"), not a continuous online loop.**
- Location: 2511.14759v2, Sec VII (Discussion and future work).
- Verdict: NEW (the seed characterised it as batch-iterative; the authors' own limitation text is recorded here)
- Evidence: https://arxiv.org/abs/2511.14759v2 | Tier 3, preprint | production report | "First, our system is not fully autonomous: it relies on human labeling and effort for reward feedback, interventions, and episode resets." and "Lastly, RECAP performs iterated "offline" updates (i.e., it collects a batch of data, retrains the model, and repeats), rather than running a fully online RL loop where the policy and value function are updated in real time as data is collected. We make this decision out of convenience" (accessed 2026-11-20)
- Use in dive: section 8, "what the scarce inputs are", and the bridge to section 19: reward labelling and resets are exactly the two things ENPIRE has agents build (F04-12, F04-14).

**F04-68. NVIDIA's GR00T 2 page (Nov 2026) reports real-robot RL on top of a post-trained policy: three contact-rich insertion tasks go from 40 to 76% success after supervised post-training to 88 to 96% with "GRPO-induced self-imitation", using only task-level success signals. Swapping the RL-trained policy into an agent-run task raised full-task success from 12 to 19 of 20 runs on cables and from 2 to 20 of 20 on chargers.**
- Location: research.nvidia.com/labs/gear/gr00t-2/, sections "Contact-Rich Skills with Real-World RL" and "Agentic Control".
- Verdict: CARRIED (seed 01 section 16, re-fetched; first-party page confirms 40-76% to 88-96%)
- Wave 2 (2026-11-20, WRONG (quote transcription)): The figures hold. The page's sentence reads "RL-trained GR00T 2" (zeros); this entry's quote printed the letter O. The page carries "November 2026" and no day; cite as page read 2026-11-20.
- Evidence: https://research.nvidia.com/labs/gear/gr00t-2/ | Tier 2, first-party lab page | benchmark claim (vendor reported) | "Reinforcement learning on the real robot, driven only by task-level success signals, lifts all three contact-rich tasks: from 40-76% success after supervised post-training to 88-96% with GRPO-induced self-imitation." and "Replacing the supervised policy with the RL-trained GR00T 2 raises full-task success from 12 to 19 of 20 runs on cables and from 2 to 20 of 20 on chargers." (accessed 2026-11-20)
- Use in dive: section 8, a second first-party data point for RL on a pretrained policy. [vendor claim] The page gives no robot count, episode count, training time or learner hardware for the RL stage, and does not define "GRPO-induced self-imitation" (U16). GRPO (Group Relative Policy Optimization) is an RL algorithm that scores each attempt relative to the other attempts in its group, so it needs no separate value model; link to the Learning From Feedback dive.

**F04-69. RL fine-tuning of a VLA can also be done entirely in simulation with PPO. piRL (RLinf team, v3 of Jan 2026) fine-tunes the flow-based pi0 and pi0.5 models on 8 H100 80 GB GPUs with 64 to 320 parallel simulated environments: pi0.5 trained from one demonstration per task rises from 77.1% to 98.3% average on LIBERO; on ManiSkill pi0 goes from 38.4% to 77.8% and pi0.5 from 40.1% to 90.9%.**
- Location: 2510.25889v3, Sec 5 (experimental setup and analysis paragraphs for Tables 2 and 4); Appendix J hyperparameter tables.
- Verdict: CARRIED (seed 01 section 16, re-fetched at v3, the latest)
- Evidence: https://arxiv.org/abs/2510.25889v3 | Tier 3, preprint | benchmark claim (author reported) | "Our experiments are conducted on 8 NVIDIA H100 80GB GPUs" and "While the pi0.5 few-shot SFT baseline achieves a decent average performance of 77.1% ... piRL reaches 98.3% final performance" and "the success rate of pi0 increases from 38.4% to 77.8%, while pi0.5 improves from 40.1% to 90.9%." Appendix J rows: "Parallel environments 64" (LIBERO) and "256" / "320" (ManiSkill); "Clip ratio epsilon 0.2", "GAE lambda 0.95". (accessed 2026-11-20)
- Use in dive: section 8, the contrast with F04-54: a small MLP policy trains with 8,192 environments on one GPU, a multi-billion-parameter VLA with 64 to 320 environments on eight GPUs, because each simulated step now needs a forward pass of the large model. Wall-clock per run is not stated in the paper text searched (U17); see F04-70 for a measured figure.

**F04-70. A measured cost for RL post-training of a VLA on AWS: the AWS sample runs RLinf v0.4's GRPO recipe on OpenVLA-OFT (7B) in the LIBERO-Goal simulator. On one p5en.48xlarge Spot instance (8 H200), 75 GRPO steps took 31.6 hours of training (about 25 minutes per step), 32.3 hours for the whole run, about US$1,100, and lifted success from 48.6% (243/500) to 85.0% (425/500).**
- Location: aws-samples/sample-rfm-simulation-on-aws at SHA 66e0fbef (default branch, 2026-11-19), `docs/results.md` section "RL post-training (`rlinf-oft-libero`)"; `docs/cost.md` section "RL post-training". The target is not in the v1.0.0 tag (2026-10-22); it was added afterwards.
- Verdict: CARRIED (seed synthesis file cites these figures; re-fetched at a pinned SHA)
- Evidence: https://github.com/aws-samples/sample-rfm-simulation-on-aws (default branch at SHA 66e0fbef60d4d345d72c38505d3911d6a4cfff89), file https://raw.githubusercontent.com/aws-samples/sample-rfm-simulation-on-aws/66e0fbef60d4d345d72c38505d3911d6a4cfff89/docs/results.md | Tier 1, first-party sample repository (measured run log) | production report | "Measured `full` run (`2026-11-03-0717`, ap-northeast-1, `p5en.48xlarge` Spot, 8 x H200, 500 eval envs, `--rl-steps 75`): SFT baseline 48.6% (243/500, 95% CI 44.2-53.0%), RL checkpoint `global_step_75` 85.0% (425/500, 81.6-87.9%), +36.4 points with disjoint intervals." and "One GRPO step took about 1,490 s (25 min); training took 31.6 h, the whole deploy 32.3 h (`run_wall_s` 116211), about US$1,100 of EC2 at the Spot price of that day (US$33.9-34.2 per hour)." (accessed 2026-11-20)
- Use in dive: section 8, "what it costs in compute" for RL on a pretrained policy in simulation: 8 datacenter GPUs for more than a day. Single run. The same file records the smoke profile (one L40S, 5 LoRA steps, 56 minutes, about US$5.2, 45.0% to 50.0% with overlapping intervals) and RLinf's own published figure for the full recipe (49.40% to 93.96%).

**F04-71. The same sample records what long RL jobs do to a schedule: an earlier 8 x H100 run hit its 40-hour wall-clock cap at step 83 of 100 and lost its last checkpoints because the timeout fired before the upload; and on 31 Oct 2026 no On-Demand 8-GPU instance of the listed types was available in three Regions, so the run fell back to Spot.**
- Location: aws-samples/sample-rfm-simulation-on-aws at SHA 66e0fbef, `docs/results.md` ("Earlier `full` run"); `docs/cost.md` ("Capacity and the Spot fallback").
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/aws-samples/sample-rfm-simulation-on-aws/66e0fbef60d4d345d72c38505d3911d6a4cfff89/docs/results.md | Tier 1, first-party sample repository (measured run log) | production report | "GRPO training then ran for the 38 h left under the 40 h cap at about 27 minutes per step and was stopped by that cap at step 83 of 100." and "No RL eval exists for this run: the timeout exit code tripped the script's ERR trap before the latest checkpoint was uploaded, and the instance terminated with the checkpoints of steps 25, 50 and 75 on its disk." cost.md: "On 2026-10-31 (21:55-23:50Z) no On-Demand 8 x 80 GB instance of the `full` list was free in `us-east-1`, `us-west-2` or `ap-northeast-1` (every type in every AZ returned `InsufficientInstanceCapacity`), and no p5 Capacity Block was offered there." (accessed 2026-11-20)
- Use in dive: section 8 (practical: checkpoint to durable storage during training, size the cap from a measured step time) and section 19 (a timeout is a guardrail that also needs a save path, F04-50). A point-in-time capacity observation from one evening.

### I. RL on the real robot (section 8)

**F04-72. History (Oct 2024, v3 Mar 2025): HIL-SERL showed that RL run directly on one real robot, starting from 20 to 30 human demonstrations and helped by human corrections during training, reaches near-perfect success on contact-rich tasks within 1 to 2.5 hours of training, on one RTX 4090.**
- Location: 2410.21845v3, Abstract; Sec 3.2; Sec 4 (results preamble).
- Verdict: CARRIED (seed 01 section 16, re-fetched; labelled history: first posted Oct 2024, latest version v3 of 20 Mar 2025)
- Evidence: https://arxiv.org/abs/2410.21845v3 | Tier 3, preprint | benchmark claim (author reported) | "learn policies that achieve near-perfect success rates and fast cycle times within just 1 to 2.5 hours of training. We show that our method significantly outperforms imitation learning baselines and prior RL approaches, with an average 2x improvement in success rate and 1.8x faster execution." and "The training time includes all scripted motion, policy rollouts, intended stops, as well as onboard computation which is carried on a single NVIDIA RTX 4090 GPU." (accessed 2026-11-20)
- Use in dive: section 8, the third RL setting, as the paper that introduced the recipe. The results section is more specific than the abstract: "HIL-SERL achieved a success rate of 100% within 1 to 2.5 hours of real-world training on nearly all the tasks. This is a significant improvement over the HG-DAgger baseline, which achieved an average success rate of 49.7% across all tasks."

**F04-73. HIL-SERL's system is three parts: an actor process that runs the current policy on the robot and sends transitions back, a learner process that trains on them, and a replay buffer inside the learner. Two buffers are kept, one for demonstrations and one for the robot's own experience, and each training batch draws equally from both. The policy acts at 10 Hz.**
- Location: 2410.21845v3, Sec 3.2 "System Overview"; Figure 2; Appendix tables 2 and 3.
- Verdict: CARRIED (seed 01 section 16, re-fetched)
- Evidence: https://arxiv.org/abs/2410.21845v3 | Tier 3, preprint | definition | "Our system is composed of three major components: the actor process, the learner process, and the replay buffer residing inside the learner process, all operating in a distributed fashion ... The actor process interacts with the environment by executing the current policy on the robot and sends the data back to the replay buffer." and "The learner process samples data equally from the demo and RL replay buffers, optimizes the policy using RLPD, and periodically sends the updated policy to the actor process." Appendix tables list "10 HZ" control and "100 environment steps" per episode for two tasks. (accessed 2026-11-20)
- Use in dive: section 8, the actor-learner mechanism. Why split: the robot must act on a fixed clock, while gradient updates take as long as they take; two processes let neither wait for the other.

**F04-74. The reward in HIL-SERL comes from a small image classifier trained beforehand on success and failure frames (reported accuracy above 95% on its evaluation set), and the human can take over with a teleoperation device at any time; the intervention replaces the policy's action and is stored.**
- Location: 2410.21845v3, Sec 3.2 and 3.3; Figure 2 and Figure 3.
- Verdict: CARRIED (seed 01 section 16, re-fetched)
- Evidence: https://arxiv.org/abs/2410.21845v3 | Tier 3, preprint | definition | "trained reward classifier generally achieves an accuracy of greater than 95% in the evaluation data set. We then collect 20-30 trajectories" and Figure 3 labels: "1. Train Reward Classifier", "2. Collect Demonstrations ... 20~30 Demos", "3. Train RL Online". Figure 2 shows "Actor Process a* = a_itv or a_RL" (the executed action is the human's when intervening, otherwise the policy's). (accessed 2026-11-20)
- Use in dive: section 8, "who supplies the reward and the corrections" on a single arm. Compare the classifier's 95% with general VLM judges (F04-45).

**F04-75. Fleet-scale version (2026): "Learning While Deploying" (LWD; AGIBOT and Shanghai Innovation Institute, v4 of 16 Sep 2026) runs online RL on a pretrained VLA across 16 dual-arm robots. Edge actors upload whole episodes, one central learner updates a shared policy and publishes it back. With a 4-hour wall-clock budget, about 60 robot-hours of data, one generalist policy reaches 95% average success across eight tasks.**
- Location: 2605.00416v4, Abstract; Sec V (experimental setup).
- Verdict: CARRIED (seed 01 cites "LWD", arXiv 2605.00416; ID verified, latest version v4)
- Evidence: https://arxiv.org/abs/2605.00416v4 | Tier 3, preprint | benchmark claim (author reported) | "We validate LWD on a fleet of 16 dual-arm robots across eight real-world manipulation tasks, including semantic grocery restocking and 3-5 minute long-horizon tasks. A single generalist policy improves as fleet experience accumulates, reaching an average success rate of 95%" and "The fleet is connected to a distributed actor-learner system: edge actors upload complete episodes, a centralized learner fetches versioned replay data, and publishes the updated policies to each actor" and "For each online experiment, each method is allocated a 4-hour wall-clock budget, corresponding to approximately 60 total hours of online data collected across the robot fleet." (accessed 2026-11-20)
- Use in dive: section 8, how the actor-learner split scales: 16 actors, one learner. [derived] 60 robot-hours / 4 wall-clock hours = 15 robots' worth of continuous collection, consistent with 16 robots less resets and idle time. The reference policy is pi0.5 fine-tuned "on 336.6 hours of demonstration data". Learner GPU type and count were not located in the text searched (U18).

**F04-76. LeRobot v0.7.0 (5 Nov 2026) ships HIL-SERL as two programs started separately: `lerobot.rl.learner` (initialises the policy, holds the replay buffers, opens a gRPC server, does the gradient updates) and `lerobot.rl.actor` (connects over gRPC, runs the policy on the robot, sends transitions, receives new weights). The algorithm is Soft Actor-Critic (SAC).**
- Location: lerobot at tag v0.7.0, `docs/source/hilserl.mdx` section "Training with Actor-Learner" (lines 831 to 880).
- Verdict: NEW (seed 01 did not cover LeRobot's implementation; newest tag found is v0.7.0)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/hilserl.mdx | Tier 1, first-party docs at a release tag | documentation of support | "The LeRobot system uses a distributed actor-learner architecture for training. This architecture decouples robot interactions from the learning process, allowing them to run concurrently without blocking each other. The actor server handles robot observations and actions, sending interaction data to the learner server. The learner server performs gradient descent and periodically updates the actor's policy weights. You will need to start two processes: a learner and an actor." and "python -m lerobot.rl.learner --config_path rl/train_config.json" and "python -m lerobot.rl.actor --config_path rl/train_config.json"; learner: "Opens a `gRPC` server to communicate with actors". (accessed 2026-11-20)
- Use in dive: section 8, "what runs where": the actor sits with the arm (CPU plus camera capture plus a small policy forward pass), the learner needs the GPU ("A Nvidia GPU" is listed under requirements). Defaults in code: learner address "127.0.0.1" port 50051, that is both on one machine unless reconfigured (F04-78).

**F04-77. In the LeRobot implementation the reward classifier is optional (success can be marked by hand with the gamepad or keyboard), images are cropped to the workspace and resized to 128 x 128, the control rate in the example configs is 10 frames per second, an episode lasts at most 20 seconds and the reset wait is 5 seconds. Recommended tasks are ones "that can be completed in 5-10 seconds".**
- Location: lerobot at tag v0.7.0, `docs/source/hilserl.mdx` lines 40 to 50, 110 to 112, 385 to 401, 615 to 625.
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/hilserl.mdx | Tier 1, first-party docs at a release tag | documentation of support | "Avoid extremely long horizon tasks. Focus on tasks that can be completed in 5-10 seconds." and "reset_time_s: float = 5.0    # Time to wait during reset" and "control_time_s: float = 20.0    # Maximum episode duration" and example config ""fps": 10" and "Most vision-based policies have been validated on square inputs of either 128x128 (default) or 64x64 pixels." and "Training a reward classifier is optional. You can start the first round of RL experiments by annotating the success manually with your gamepad or keyboard device." (accessed 2026-11-20)
- Use in dive: section 8, the real-robot side of the worked example (episode length, reset time, control rate) and the camera resolution RL actually uses (128 x 128, far below the camera's native resolution).

**F04-78. Code defaults for the LeRobot learner at v0.7.0: the learner pushes new weights to the actor every 4 seconds; learning starts after 100 online steps; replay buffers hold 100,000 transitions each (online and offline); update-to-data ratio 1; discount 0.99; the vision encoder is frozen by default and shared between actor and critic.**
- Location: lerobot at tag v0.7.0, `src/lerobot/policies/gaussian_actor/configuration_gaussian_actor.py` lines 57 to 59, 131 to 139, 153 to 161; `src/lerobot/rl/algorithms/sac/configuration_sac.py` lines 54 and 80.
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/gaussian_actor/configuration_gaussian_actor.py | Tier 1, source code at a release tag | code behaviour | "learner_host: str = "127.0.0.1"", "learner_port: int = 50051", "policy_parameters_push_frequency: int = 4", "storage_device: str = "cpu"", "freeze_vision_encoder: bool = True", "shared_encoder: bool = True", "online_steps: int = 1000000", "online_buffer_capacity: int = 100000", "offline_buffer_capacity: int = 100000", "online_step_before_learning: int = 100". configuration_sac.py: "discount: float = 0.99", "utd_ratio: int = 1". (accessed 2026-11-20)
- Use in dive: section 8, mechanism detail and tuning notes. The docs add: "Decrease to 1-2 s to provide fresher weights (at the cost of more network traffic)" and, for `storage_device`, "Keeping the weights on-GPU removes CPU->GPU transfer overhead and can significantly increase the number of learner updates per second."

**F04-79. The LeRobot docs state the human's role plainly: interventions are what make it efficient, and a healthy run is one where the human intervenes a lot at the start and less and less as the policy improves. In their example plot, interventions cut the number of steps to reach maximum reward to a quarter.**
- Location: lerobot at tag v0.7.0, `docs/source/hilserl.mdx` sections "Human in the Loop" and "Guide to Human Interventions".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/hilserl.mdx | Tier 1, first-party docs at a release tag | documentation of support | "A successful experiment is one where the human has to intervene at the start but then reduces the amount of interventions as the policy improves." and "We can observe that the number of steps where the policy starts achieving the maximum reward is cut by a quarter when human interventions are present." and "The learning process is very sensitive to the intervention strategy. It will takes a few runs to understand how to intervene effectively." (accessed 2026-11-20)
- Use in dive: section 8, the scarce inputs on a real arm: robot time, resets and a person's attention. "cut by a quarter" is ambiguous in the source (reduced by, or to, a quarter); quote it instead of paraphrasing a number.

### J. RL on the SO-101 specifically (section 8)

**F04-80. LeRobot v0.7.0 supports HIL-SERL on the SO-100 and SO-101 arms. The docs use `so100_follower` and `so100_leader` device types with the SO-101 URDF for kinematics, and recommend the SO-101 leader arm as the intervention device because its geared joints let it track the follower so a takeover is smooth.**
- Location: lerobot at tag v0.7.0, `docs/source/hilserl.mdx` lines 307 to 322 and 489 to 528.
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/hilserl.mdx | Tier 1, first-party docs at a release tag | documentation of support | "--robot.type=so100_follower" ... "--teleop.type=so100_leader" ... "--urdf_path=SO-ARM100/Simulation/SO101/so101_new_calib.urdf" and "The SO101 leader arm has reduced gears that allows it to move and track the follower arm during exploration. Therefore, taking over is much smoother than the gearless SO100." and "SO101 leader teleoperation example, the leader tracks the follower, press `space` to intervene". Requirements: "A gamepad (recommended) or keyboard to control the robot", "A Nvidia GPU", "A real robot with a follower and leader arm (optional if you use the keyboard or the gamepad)", "A URDF file for the robot for the kinematics package". (accessed 2026-11-20)
- Use in dive: section 8, "RL on this arm, today": supported, documented, with pick-and-lift cube as the tutorial task and "Pick and place cube" listed as a next step. The example dataset is named "username/pick_lift_cube" with "num_episodes_to_record": 15 demonstrations. Measured training time on an SO-101 is stated only as "in just a few hours" (docs line 3); no table of results (U19).

**F04-81. For the SO-101 the three RL settings map to three first-party code paths as of November 2026: in simulation, MuJoCo Playground 1.0's `SO101PickCubeVision` PPO task with zero-shot real deployment (F04-57, F04-58); on the real arm, LeRobot's HIL-SERL actor and learner (F04-76, F04-80); on top of a pretrained policy, no SO-101-specific first-party recipe was located.**
- Location: synthesis of F04-57, F04-58, F04-59, F04-76, F04-80.
- Verdict: NEW ([our reading])
- Evidence: https://github.com/google-deepmind/mujoco_playground/tree/v1.0.1 and https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/hilserl.mdx | Tier 1, source and docs at release tags | documentation of support | Playground README: "# Train SO-101 Pick-Cube"; LeRobot docs: "You will master training a policy with RL on a real robot in just a few hours." (accessed 2026-11-20)
- Use in dive: section 8, the closing "what you can do with the arm on the desk" block. "Not located in this research" for the third path; it is not a claim that none exists (U20).

### K. Newer than the seed: agent-run loops, October and November 2026 (section 19)

Located by two web searches on 2026-11-20, then read from the arXiv listing and PDF. None of these four is in the seed research.

**F04-82. SEAR (13 Oct 2026) is a framework and benchmark that asks whether an agent improving a robot is "really learning, or just trying more often". It runs an agent in three modes: code-as-policy (the agent writes the program that is the policy), agent-as-policy (the agent stays in the control loop), and auto-research (the agent fine-tunes a VLA on rollouts it collects), across seven language models, 330 simulated tasks and five physical tasks.**
- Location: 2610.18792v1, Abstract; Sec 1; Figure 2.
- Verdict: NEW (not in the seed; v1 is the only version)
- Evidence: https://arxiv.org/abs/2610.18792v1 | Tier 3, preprint | definition | "The framework runs an agent in three modes: it writes code that becomes the policy (code-as-policy), acts live in the control loop (agent-as-policy), or works as a researcher that fine-tunes a vision-language-action model (auto-research). The benchmark adds controls that separate retained experience from repeated attempts, familiar tasks, privileged simulator state, larger budgets, and luck. Across seven frontier language models, 330 simulated and five physical tasks, and over four years of agent runtime, we highlight three findings." Figure 2: "Time budget 1 h per simulation task, 12 h per real-world task". (accessed 2026-11-20)
- Use in dive: section 19, the vocabulary for "what the agent may touch": ENPIRE (F04-1) is the auto-research mode; CaP-X and RACaP (F04-41, F04-42) are code-as-policy. The physical platform is "two YAM-Ultra arms with parallel-jaw grippers, a fixed overview camera, and two wrist cameras", the same arm family as ENPIRE.

**F04-83. SEAR's grading rule is a sealed judge: the agent works in its own container, and when the budget ends its policy is frozen and handed to a separate judge that holds the held-out start states and the grading logic "and ignores any success the policy claims".**
- Location: 2610.18792v1, Sec 2.4 "Protocol", paragraph "Sealed judge".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2610.18792v1 | Tier 3, preprint | definition | "Sealed judge. The agent works in its own container, where it can run local simulations, inspect failures, install packages, and train checkpoints. When the budget ends or the agent submits, its policy is frozen, and only the frozen program with its imported skills, or the AR checkpoint, is passed to a separate judge. The judge holds the held-out initial states and the grading logic, and ignores any success the policy claims." (accessed 2026-11-20)
- Use in dive: section 19, "who grades": the clearest published statement of the separation the section needs (agent may train and test; a process it cannot reach scores). Pairs with ENPIRE's immutable verifier (F04-12) and the open question of enforcement (U2).

**F04-84. On the real robot, SEAR reports that success during the agent's own practice overstates success on the test, because the agent resets the scene itself and rarely creates the hard starting states an operator sets up. It also prices the practice: about US$3.7, US$11 and US$18 of API spend per scored success for three models.**
- Location: 2610.18792v1, Sec 4 (finding box) and the real-robot cost paragraph ("Cost.").
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2610.18792v1 | Tier 3, preprint | benchmark claim (author reported) | "On a real robot, success in practice overstates success in the test: during practice the agent resets the scene itself and rarely creates the hard starting states that an operator sets up for the test." and "Per scored forward success, practice costs about $3.7 in API spend for Fable, $11 for Opus, and $18 for GPT-6-astra. For the Cup Upright segment the recorded API costs are about $96, $254, and $368, respectively." and "a live episode takes a median of 12.8 minutes of robot time, against 3.8 for a frozen code policy." (accessed 2026-11-20)
- Use in dive: section 19, the caution on self-graded loops (an agent that builds its own reset also chooses its own test distribution) and a second token-cost data point next to ENPIRE's (F04-20, F04-22). Model names are quoted as the paper prints them.

**F04-85. AdaRSI (v2, 17 Nov 2026) has a coding agent fix how it calls a frozen VLA first (instructions, tools, procedure) and fine-tune only the sub-steps that stay unreliable. On RoboCasa365 unseen composite tasks it reaches 13.3% success against 11.1% for fine-tuning every sub-step, with 34% of the GPU time and 36% of the demonstrations. It includes real-robot tests on an SO-ARM101.**
- Location: 2610.20474v2, Abstract; Sec 5.3 "Success against cost"; Table 4; Sec 5.4 and Appendix D (SO-ARM101).
- Verdict: NEW (not in the seed; v2 is the latest)
- Evidence: https://arxiv.org/abs/2610.20474v2 | Tier 3, preprint | benchmark claim (author reported) | "AdaRSI reaches 13.3% success versus 11.1% for Always train, using 34% of its GPU time and 36% of its demonstrations (Tab. 4). GPU time includes all temporary probes and joint fine-tuning." and "We evaluate AGIBOT A3U and SO-ARM101 robots with pi0.5 [21] as the VLA and Claude Opus 5.5 as the agent." and "SO-ARM101. The three placement tasks vary object identity, size and orientation in OOD configurations (Fig. 4b). Harness development raises OOD success from 65% to 100% on S1 and from 50% to 100% on S2. For S3, the agent collects demonstrations of grasping a small toy goblet and adapts a specialist, raising OOD success from 50% with the harness to 80%." (accessed 2026-11-20)
- Use in dive: section 19, the nearest published agent-run loop on the dive's own arm: tasks are "S1 places a toy in a bowl; S2 stacks a medicine box on a tea box; S3 places an ointment container in a bowl", 10 trials per configuration, base VLA fine-tuned on 50 human demonstrations per SO-ARM101 task. Table 4's last row reads "AdaRSI ... 13.3 894 2,106" (success %, demonstrations, GPU minutes); [derived] 2,106 GPU minutes = 35.1 GPU-hours. GPU model not stated in the text searched (U21). Absolute success on the simulated suite is low (13.3%).

**F04-86. A 30-author survey (13 Oct 2026) grades self-improving robot systems on a six-level scale, L0 to L5, and concludes that no surveyed system, ENPIRE and ASPIRE included, yet shows a robot improving its own improvement procedure with independently verified gains.**
- Location: 2610.18842v1, Abstract; Sec 2.3 "The L0-L5 Framework"; the timeline figure that places systems by level.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2610.18842v1 | Tier 3, preprint (survey) | definition | "We present an L0-L5 framework that differentiates capability-level from meta-level updates and within-task from across-task gains, reserving L5 for independently verified recursive gain." and "Our analysis reveals that, despite substantial progress in self-improvement, the surveyed literature does not yet demonstrate Physical RSI as defined by our framework." and, on ENPIRE: "In the pin-insertion experiment considered here, ENPIRE (Xiao et al., 2026) trains and evaluates on the same task." (accessed 2026-11-20)
- Use in dive: section 19, the closing calibration: third-party framing of what the 2026 loops do (improve a policy on the task they practise) and do not do. Third-party analysis; the level assigned to each system is the survey authors' judgement, and the figure text did not extract cleanly enough to quote a level per system (U22).

**F04-87. RE-0 (26 Sep 2026) is a fourth sibling located but read at abstract level only: it improves code-as-policy agents by asking a stronger teacher model for corrections on the student's own failures and keeping only the corrections that the environment confirms help.**
- Location: 2609.32416v1, Abstract.
- Verdict: NEW (abstract only; body not read)
- Evidence: https://arxiv.org/abs/2609.32416v1 | Tier 3, preprint | definition | "RE-0 requests local corrections from the teacher on the student's own failure histories and checks in the environment whether each correction is genuinely beneficial; verified corrections yield immediate improvement." (accessed 2026-11-20)
- Use in dive: section 19, optional one-line mention under "verify before you keep it", the same idea as the promotion gate (F04-35). Do not cite results from it without reading the body.

## 5. Teaching material

### 5.1 Section 8: Reinforcement Learning for Robots

**The plain-words idea.** Imitation gives a robot a policy that copies what people showed it. Reinforcement learning (RL) lets the policy get better than its demonstrations by trying the task, having each attempt scored, and shifting toward what scored well (link to the Learning From Feedback dive for reward, advantage and PPO). For a robot the whole question is where the attempts come from, because a real arm makes about a hundred an hour and a simulator makes millions. That gives three settings: in simulation with thousands of copies of the arm (F04-54, F04-57), on top of a pretrained policy using its own deployment episodes (F04-60), and directly on one real arm with a person helping (F04-72, F04-76).

**Worked example on the arm task (real figures, arithmetic marked [derived]).**

1. Attempts per hour on the real arm. LeRobot's RL defaults give an episode at most 20 s and a reset wait of 5 s, at 10 control steps per second (F04-77). [derived] 20 s + 5 s = 25 s per attempt, so at most 3,600 / 25 = 144 attempts per hour, each at most 200 control steps: at most 28,800 control steps per hour. For a task finished in 10 s (the docs recommend 5 to 10 s tasks) it is 3,600 / 15 = 240 attempts per hour.
2. Attempts per hour in simulation. Isaac Lab 3.0 trains a Franka cube-lift task at 164,777 control steps per second with 8,192 copies on one GPU (F04-54; a different arm and no camera). [derived] At 200 steps per attempt that is 164,777 / 200 = 824 attempts per second, about 2.97 million per hour: roughly 20,000 times the real arm's 144.
3. What one published SO-101 recipe consumes. MuJoCo Playground's SO-101 pick-cube recipe uses 4,096 simulated arms x 16 steps x 3,000 iterations = 196,608,000 control steps at 10 Hz (F04-57, F04-58). [derived] 196,608,000 / 200 = 983,040 attempts of 20 s. On the real arm at 144 per hour that would be 983,040 / 144 = 6,827 hours, about 284 days without a break.
4. What the camera does to it. With one 64 x 64 camera per copy, the Isaac Lab benchmark's camera task trains at 27,962 steps per second on PhysX with RTX rendering and 115,889 on Newton (F04-55; a Kuka-Allegro hand, not the SO-101). Illustration only, because robot and task differ: 196,608,000 steps at those two rates would take 7,031 s (about 2 hours) and 1,697 s (about 28 minutes). The measured wall-clock for the SO-101 recipe itself is not published in the files read (U12).
5. The real-arm alternative. HIL-SERL-style training reaches a working policy in 1 to 2.5 hours on tasks of this size (F04-72), that is a few hundred attempts by step 1, which works only because it starts from 15 to 30 demonstrations and a person corrects it (F04-74, F04-79, F04-80).

Arm figures owned by other streams: joint count and native camera resolution of the SO-101 (stream 01). Fetched here: 10 Hz control and a 64 x 64 wrist image in the Playground task (F04-57); 10 frames per second and 128 x 128 crops in LeRobot RL (F04-77).

**Mechanism 1: advantage conditioning (Recap, RL on a pretrained policy).** Entries F04-60 to F04-63.

- Intuition: do not push the policy with a gradient that says "more reward". Label every recorded action as better or worse than expected, train the policy to imitate all of them with that label as an input, then at run time ask for "better than expected".
- Tensors: a value model V takes (camera images and joint state o_t, instruction l) and outputs a distribution over 201 bins of "steps remaining until success", normalised to the range -1 to 0 (F04-61). It is a 670M-parameter VLM, separate from the policy.
- Formula, in words then symbols. Advantage A_t = (what actually happened from step t) - (what V predicted at step t). Flag I_t = true if A_t > epsilon_l, where epsilon_l is a per-task threshold; I_t = true is forced for human correction actions (F04-62, F04-63). The policy pi(a_t | o_t, l, I_t) is trained by the same supervised loss as before on every episode, with I_t as one more conditioning input, and I_t is randomly dropped during training so the model can also run without it. At run time I_t = true; the optional guidance weight beta > 1 sharpens the effect.
- Toy numbers (illustration, simplified to a whole-episode return): the task's longest allowed episode is 200 steps. At step 40 the value model predicts -0.40 (80 more steps). The arm in fact finishes 60 steps later, a return of -0.30. A = -0.30 - (-0.40) = +0.10. With a threshold of +0.05 the flag for that step is true, so that grasp is filed under "better than expected". Had the block slipped and the episode run 120 more steps (-0.60), A = -0.20 and the flag is false; the data is still used.
- Which term carries what: V carries "how well is this going", A carries "was this action a pleasant or unpleasant surprise", the flag carries that surprise into the policy in a form a flow-matching action head can consume.

**Mechanism 2: the actor-learner split (RL on the real robot).** Entries F04-73, F04-76, F04-78, F04-75.

- Intuition: the arm must be commanded on a fixed clock (10 Hz here), and gradient steps take as long as they take. So two programs: the actor runs the current policy on the arm and records; the learner trains and periodically sends new weights.
- What flows where: actor to learner, transitions (observation, action, reward, next observation, and whether a human was intervening) over gRPC; learner to actor, policy weights every 4 s by default (F04-78). The learner keeps two replay buffers of 100,000 transitions (robot experience and demonstrations) and, in the original paper, draws each batch half from each (F04-73).
- Reward: a small image classifier trained on success and failure frames, or a human key press (F04-74, F04-77).
- Scaling it: LWD keeps the same shape with 16 robots as actors and one central learner (F04-75).

**What it costs in compute, and what it loads.**

| Setting | Published figure | Entry | Part of the machine loaded |
|---|---|---|---|
| RL in simulation, state observations | 164,777 steps/s (PhysX) or 318,651 (Newton MJWarp), 8,192 copies, one RTX PRO 6000 Blackwell; 14.7 GB or 5.4 GB GPU memory; GPU utilisation 41 to 50% | F04-54 | GPU tensor cores (physics and the small policy); CPU for orchestration |
| RL in simulation, with a camera | 27,962 steps/s with RTX rendering (24.2 GB), 115,889 with the Newton renderer (13.6 GB) | F04-55 | adds the GPU's ray-tracing or rasterisation path and memory |
| Pick-cube from pixels, sim to real (Franka) | ten minutes on one RTX 4090 [author reported] | F04-56 | one consumer GPU |
| SO-101 pick-cube recipe | 4,096 copies, 196.6M steps; wall-clock unpublished | F04-58, U12 | one GPU; a CPU fallback at 64 copies exists |
| RL on a VLA in simulation (piRL) | 8 H100 80 GB, 64 to 320 parallel environments | F04-69 | 8 GPUs: each simulated step needs a large-model forward pass |
| RL on a VLA in simulation (GRPO on OpenVLA-OFT, AWS sample) | one p5en.48xlarge (8 H200), 31.6 h training, about 25 min per step, about US$1,100 Spot, 57 GB per checkpoint | F04-70 | 8 GPUs, plus storage and network for 57 GB checkpoints |
| RL on a pretrained policy from real episodes (Recap) | 670M value model plus a VLA with a 4B backbone and 860M action expert; 300 to 960 episodes per iteration on 3 or 4 robots; learner hardware unpublished | F04-61, F04-64, F04-65, U15 | robot time and people first; then a fine-tuning job |
| RL on one real arm (HIL-SERL) | one RTX 4090, 1 to 2.5 h | F04-72 | one GPU for the learner; CPU and cameras for the actor |
| Fleet RL (LWD) | 16 robots, 4 h wall-clock, about 60 robot-hours; learner hardware not located | F04-75, U18 | robots, network (episode uploads, weight pushes), one learner |

### 5.2 Section 19: Agents Running the Loop

**The plain-words idea.** Improving a robot policy is a loop a research engineer runs by hand: put the scene back, run the policy, decide whether it worked, look at the failures, change the training code, train again. In 2026 several groups handed that loop to a coding agent (a language model that reads and writes files and runs commands). The agent does not move the motors and does not grade itself: people first build and freeze the things that define the task (safety limits, the reset, the success check), and the agent then spends hours changing training code and running trials against that frozen check (F04-1, F04-2, F04-8).

**ENPIRE walk-through, on the arm task.** ENPIRE's published tasks use a two-arm YAM station, and its repository has no SO-101 adapter (U5); the mapping below is [our reading] with ENPIRE's real numbers.

1. Stage one, with a person (F04-2, F04-12, F04-13, F04-14). Record a few minutes of the block landing in the cup and of misses. The agent writes a binary success check from those recordings and a reset routine (take the block out of the cup, put it back at the start). The person states the precision, recall and latency required. Then safety limits, reset and check are frozen.
2. Stage two, alone (F04-3, F04-4, F04-9). The agent gets a nine-line prompt with the goal (100% over every window of 50 consecutive episodes) and a training codebase it may edit. It picks the method (behaviour cloning, real-world RL, a scripted policy, or a mix), states one hypothesis, makes the smallest change, tests offline, runs the approved number of real trials through a three-endpoint local server (F04-6), and keeps the change only if it passes.
3. What comes back (F04-18 to F04-23). On pin insertion one agent on one station reached 100% in 2.5 h; eight stations did it in 0.67 h. In the eight-station run 86 ideas were tried and 28 helped. The robot was executing an experiment 30 to 49% of the time and the station's GPU was busy 29 to 49% of the time. The fleet's token rate went from 9,269 to 140,310 tokens per minute for 8x the agents. [derived] token rate x time to success reproduces the paper's tokens-to-success: 9,269 x 60 x 4.5 h = 2.50M; 40,029 x 60 x 3.2 h = 7.69M; 140,310 x 60 x 2.0 h = 16.84M.
4. The headline number and how to read it (F04-16): 99% is "pass@8", success within up to eight sequential retries in one rollout.

**What the agent may touch, and who grades.**

| System | Agent may change | Frozen or out of reach | Who grades | Entries |
|---|---|---|---|---|
| ENPIRE | training code, method, hyperparameters, policy-side code | environment, reset, verifier, safety limits, evaluation seeds, artifact schema | a reward function the agent wrote in stage one, then frozen, checked against a held-out set | F04-8, F04-12, F04-13 |
| ASPIRE | robot control programs and text skills (no weights) | the robot API | a second, fresh agent must reproduce the fix; the coordinator checks allowed APIs | F04-27, F04-28 |
| AgenticRobotics | analysis and training runs (worker agents) | the objective: metric, direction, threshold, evaluation command | an LLM controller that owns measurement, with a statistical promotion gate | F04-34, F04-35, F04-38 |
| SEAR | anything inside its container | held-out start states and grading logic | a sealed judge that "ignores any success the policy claims" | F04-83 |

Physical safety is outside all of this: hard motion limits, torque-limited grippers and an emergency stop do not depend on the agent (F04-10).

**The limits to teach with it.** Self-built practice flatters the agent: on real robots success in practice overstated success on operator-set tests (F04-84). General VLM judges top out near 0.77 balanced accuracy and lean toward declaring success (F04-45). Evaluation noise can exceed the gains being chased: 22 of 100 outcomes flipped on a re-run with the same seeds (F04-37). A survey of the field puts none of these systems at its top level (F04-86).

**What it costs in compute.**

| Cost | Published figure | Entry |
|---|---|---|
| Station hardware | one RTX 5090 (32 GB), 24-core CPU, 128 GB RAM per station; no shared cluster | F04-5 |
| GPU and robot idle time | GPU busy 29 to 49%, robot busy 30 to 49% of research wall-clock | F04-19 |
| Tokens | 80M tokens for one agent on simplified Push-T, 96% of them cache reads; 2.5M to 16.8M (as plotted) to reach success on the scaling study | F04-20, F04-22, U4 |
| Dollars, simulation-only skill learning | US$0.83 to US$35.37 per task by model; about US$650 for a 60-task campaign | F04-30, F04-31 |
| Dollars, real robot | about US$3.7 to US$18 of API spend per scored success | F04-84 |
| GPU-hours, selection loop | 121.6 GPU-hours on one Quadro RTX 8000 over 5,475 evaluation episodes | F04-36 |
| GPU-minutes, agent-directed fine-tuning | 2,106 GPU-minutes against 6,113 for fine-tuning everything | F04-85 |
| What a scheduler can enforce | job timeout (none by default), per-agent fair share, countable tokens for scarce things such as a robot or an API quota | F04-50, F04-51, F04-52 |

Which part of the machine: the agent itself is a remote inference workload (tokens, almost all cache reads); locally it loads CPU and disk (logs, rollouts, Git); the GPU is used in bursts when a training run or the verifier's vision models execute, which is why it sits idle most of the time (F04-19, F04-21).

## 6. Stale or wrong in the seed research

| Seed file | Seed claim | What the source says now | Entry |
|---|---|---|---|
| seed 01, sections 3.4 and 16 | Recap data was "spread over 33 robots"; robots per task "4-33" | The PDF reads "spread over 3 robots", and the sentence is about one ablation. The "33" is an artefact of the arXiv HTML math rendering. Robots per experiment are 3 or 4. | F04-65 |
| seed 05, ASPIRE section | Read at v1 | v2 (20 Oct 2026) adds dollar cost per task by model, the 60-task campaign cost and the online Rubik's Cube study | F04-30, F04-31, F04-33 |
| seed 05, ENPIRE scaling and utilisation | Values read off charts as approximate ranges (for example time to success about 4.4, 3.3, 2.0 h) | Exact values are in the project page's chart data: 4.5, 3.2, 2.0 h; robot utilisation 49.14, 30.87, 29.78%; GPU 29.41, 32.52, 48.96%; token rate 9,269, 40,029, 140,310 per minute | F04-18, F04-19, F04-20 |
| seed 05, repositories | ENPIRE and ASPIRE repositories cited at the default branch | Pinned here to SHAs 99ee90ac and fa00f0ef; neither has a tagged release | F04-26 |
| seed 03 and the seed synthesis file | AWS sample GRPO figures (48.6% to 85.0%, about US$1,100) cited against the sample without a pin | The figures are real but exist only on the default branch (SHA 66e0fbef, 2026-11-19); release v1.0.0 does not contain the RL target | F04-70 |
| seed 01, section 16 (gap, not an error) | Carried no Isaac Lab throughput and no MuJoCo Playground figures | Isaac Lab is at 3.0.0 with a Newton backend and published throughput tables; MuJoCo Playground is at 1.0.1, rewritten in PyTorch on MuJoCo Warp, with an SO-101 sim-to-real task | F04-54, F04-57 |
| seed 01, section 16 (gap, not an error) | Did not cover LeRobot's RL implementation | LeRobot v0.7.0 ships it as `lerobot.rl` with SO-100 and SO-101 instructions; fleet RL (LWD) is at v4 | F04-76, F04-80, F04-75 |
| seed 05, siblings (gap, not an error) | Covers ENPIRE, ASPIRE, AgenticRobotics, SimEX, RACaP | Four newer papers exist: SEAR, AdaRSI (tests on an SO-ARM101), a Physical RSI survey, RE-0 | F04-82 to F04-87 |

## 7. Mental models worth teaching

1. **RL for robots is a question about where attempts come from.** A real arm gives about 144 attempts an hour; a simulator on one GPU gives about 3 million. Every method in section 8 is a way of living with one of those two numbers (F04-54, F04-77, section 5.1).
2. **In simulation, the camera is the expensive part.** Turning on one small camera per copy halves training throughput or worse, and adds a rendering workload to a GPU that was only doing physics and a small network (F04-55).
3. **Putting a large model in the loop changes the scale by orders of magnitude.** A small policy trains with 8,192 copies on one GPU in minutes; RL on a VLA uses 64 to 320 copies on 8 GPUs and takes more than a day (F04-54, F04-69, F04-70).
4. **Advantage conditioning is RL done as labelled imitation.** Score every recorded action as better or worse than expected, train on all of it with the score as an input, ask for "better" at run time (F04-62).
5. **Actor and learner are separate because the robot has a clock and the GPU does not.** The same split serves one desk arm, an agent-run station and a 16-robot fleet (F04-73, F04-76, F04-15, F04-75).
6. **On a real robot the scarce inputs are resets, rewards and a person's attention, not GPUs.** Recap, HIL-SERL and LeRobot all say so in their own words (F04-67, F04-74, F04-79).
7. **An agent-run loop is two stages: people freeze the task, then the agent edits the training.** What makes it trustworthy is what the agent cannot change (F04-2, F04-8, F04-83).
8. **More robots buy time at a steep price in tokens and idle hardware.** Eight stations gave 2.4x to 3.7x, for 15x the tokens, with GPUs busy under half the time (F04-18, F04-19, F04-20).
9. **The grader is the weak point.** General VLM judges err toward "success", self-built practice overstates test performance, and re-running an evaluation can flip a fifth of the outcomes (F04-45, F04-84, F04-37).

## 8. Contradictions between sources

| Topic | Source A | Source B | Reading |
|---|---|---|---|
| ENPIRE Fig. 7 task | The text says the utilisation and token study was run on pin insertion (F04-19) | Its time-to-success values (4.5, 3.2, 2.0 h) match the Push-T scaling curve (4.7, 3.1, 2.0 h), not pin insertion (2.5, 0.89, 0.67 h) (F04-18, F04-20) | Wave 2 resolved it: Fig. 7 measures time to complete the autoresearch objective (100% over every window of 50 consecutive episodes), a stricter stop than Fig. 3's first 100%. Quote each with its own definition (see F04-20) |
| Recap robot count | arXiv HTML renders "33 robots" | The PDF reads "3 robots" (F04-65) | PDF is right; HTML duplicates the inline number |
| Recap box-assembly data | Main text: "600 autonomous trials and 360 trials with interventions in each iteration" | Appendix: "600 demonstrations and 360 correction episodes in each iteration" (F04-65) | Unresolved wording difference inside one paper; quote the main text and note the appendix |
| HIL-SERL headline | Abstract: "near-perfect success rates" | Results: "a success rate of 100% ... on nearly all the tasks" (F04-72) | Consistent once "nearly all" is kept; do not shorten to "100%" |
| GRPO on OpenVLA-OFT, LIBERO-Goal | RLinf's published figure: 49.40% to 93.96% | AWS sample's measured run: 48.6% to 85.0% after 75 of the recipe's steps (F04-70) | Different step counts and one run; the sample's own text states the gap |
| Agent loops under a small real-trial budget | ENPIRE and ASPIRE report high success in their own protocols (F04-16, F04-29) | SimEX reports its re-implementations of both at 3 of 30 or fewer under a five-trial budget (F04-43) | The comparison is SimEX's re-implementation under SimEX's budget, not the original authors' runs |
| Measurement-driven selection | AgenticRobotics argues for a statistical promotion gate (F04-35) | Its own data: taking the final checkpoint beat every selector by 5.6 to 10.0 points (F04-37) | The author reports both; present the gate as a design, not a proven gain |
| Newton version | Isaac Lab 3.0 targets Newton 1.6.1 (F04-59) | Newton's newest release is 1.8.0 (currency table) | Not a conflict: the Isaac Lab benchmark numbers belong to 1.6.1 |
| "Cut by a quarter" | LeRobot docs: steps to maximum reward "cut by a quarter" with interventions (F04-79) | No number in the text | Ambiguous (by or to a quarter); quote, do not convert |

## 9. UNKNOWN register

| ID | Unknown | Where it arises | What would close it |
|---|---|---|---|
| U1 | How often ENPIRE's agents chose each learning method on each task | F04-3 | Per-task method counts from the authors or the run logs |
| U2 | Whether ENPIRE's "immutable" verifier and reset are technically enforced (file permissions, separate process) or only instructed | F04-8, F04-13 | Reading the harness code path that loads the verifier, or an author statement |
| U3 | Precision and recall achieved by ENPIRE's verifiers, and reset reliability and time per reset | F04-12, F04-14 | Numbers from the paper's authors; none in v2 |
| U4 | Whether ENPIRE Fig. 7 token counts include cached input | F04-20, F04-22 | Author clarification; compare with the 80M total in the cost breakdown |
| U5 | No SO-101 adapter in the ENPIRE repository at SHA 99ee90ac | F04-26 | A later commit or a community port |
| U6 | GPU type and hours behind ASPIRE's simulator rollouts | F04-31 | Author statement |
| U7 | GPU type used for DrEureka's 3-hour figure | F04-40 | Re-read of the DrEureka appendix |
| U8 (CLOSED by wave 2: the $62.55 is the RATS baseline's; RACaP's row reads "n/a", see F04-42) | RACaP campaign cost table (the seed's $62.55 for 15 rounds, 2,474 API calls) not re-located | F04-42 | Reading the table from the PDF page images |
| U9 | Queue wait, interruption rate and dollar cost of GPU jobs launched by agents | F04-48 | Our own experiment (stream 08) or a production report |
| U11 | Time to a working policy for the Isaac Lab Lift-Franka task | F04-54 | A training run (Tier 0) or Isaac Lab's training-curve data |
| U12 | Wall-clock and measured real-world success rate of the Playground SO-101 pick-cube recipe | F04-57, F04-58 | A run on one GPU (Tier 0), or figures from the Playground authors |
| U13 | Contents of Isaac Lab's SO-101 stacking task (observations, reward, training time) | F04-59 | Reading the task files at tag v3.0.0 |
| U14 | A standalone Newton RL throughput figure outside Isaac Lab | F04-59 | Newton docs or benchmarks at v1.8.0 (stream 06) |
| U15 | GPU count and hours for one Recap iteration (value model and VLA fine-tune) | F04-64 | Not in the paper; a Physical Intelligence statement |
| U16 | Robot count, episodes, training time and learner hardware for GR00T 2's real-robot RL; the definition of "GRPO-induced self-imitation"; the page's publication date | F04-68 | A GR00T 2 paper or technical report |
| U17 | Wall-clock per piRL training run | F04-69 | A table in the appendix not found by text search, or the RLinf docs |
| U18 | Learner GPU type and count for LWD | F04-75 | Re-read of the LWD appendix |
| U19 | Measured training time and success rate of LeRobot HIL-SERL on an SO-101 | F04-80 | A run on the arm (Tier 0) or a LeRobot benchmark table |
| U20 | A first-party recipe for RL on top of a pretrained policy on the SO-101 | F04-81 | LeRobot docs at a later tag; `docs/source/hilserl_sim.mdx` was not read |
| U21 | GPU model behind AdaRSI's GPU-minute figures | F04-85 | The paper's supplementary material |
| U22 | The level the Physical RSI survey assigns to each system | F04-86 | Reading the survey's level table from the PDF pages |
| U23 | Whether Physical Intelligence has published a successor to Recap after Nov 2025 | Currency table | Their publications page |
| U24 | Peer-review venue of HIL-SERL | Pinned sources | The arXiv comment field or the project page |

U10 (SimEX Table 2) was closed during this pass; see F04-49.

## 10. Reading path for Carlos

1. ENPIRE project page, https://research.nvidia.com/labs/gear/enpire/ : the videos and the scaling charts. Ten minutes to see what "an agent runs the loop" looks like physically.
2. ENPIRE paper, arXiv 2606.19980v2: Sec 3 (the two stages), Fig. 7 (utilisation and tokens), Sec 6 (limitations, two paragraphs), Appendix on the prompt. This is section 19's spine.
3. ENPIRE repository at SHA 99ee90ac, file `enpire/policy/autoresearch_instruction.md`: one page, the actual contract that says what the agent may not touch.
4. SEAR, arXiv 2610.18792v1: Abstract, Sec 2.4 "Protocol" (the sealed judge) and the Sec 4 finding on real robots. The sober counterweight to ENPIRE, and newer than the seed.
5. Recap, arXiv 2511.14759v2: Fig. 3 and Sec IV-B (advantage conditioning, one page), then Sec VII (limitations). The mechanism section 8 needs for "RL on a pretrained policy".
6. AWS sample at SHA 66e0fbef, `docs/results.md` section "RL post-training": one measured run with hours, dollars and a failed earlier attempt. The cost story for the same setting.
7. LeRobot v0.7.0 `docs/source/hilserl.mdx`: the sections "Training with Actor-Learner" and "Guide to Human Interventions". What RL on the SO-101 on a desk involves.
8. MuJoCo Playground v1.0.1 `README.md` and `mujoco_playground/tasks/manipulation/pick_cube/so101/deploy/README.md`: the SO-101 pick-cube sim-to-real path, newest item in this file (6 Nov 2026).
9. Isaac Lab v3.0.0 `docs/source/_static/benchmarks/README.md` and the CSV next to it: where the steps-per-second figures come from and their caveats.
10. LWD, arXiv 2605.00416v4: Abstract and the experimental-setup section. The fleet version of the actor-learner split.
11. AdaRSI, arXiv 2610.20474v2: Sec 5.4 and Fig. 4b. An agent-run loop tested on the same arm family as the dive's thread task.

## 11. Source list by tier

**Tier 0 (our experiments):** none.

**Tier 1 (source code at a pinned ref, official docs):**
- huggingface/lerobot at v0.7.0 (SHA 410c095eacc0011d998a73383eb94abed2715af0): https://github.com/huggingface/lerobot/releases/tag/v0.7.0
- isaac-sim/IsaacLab at v3.0.0 (SHA e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4): https://github.com/isaac-sim/IsaacLab/releases/tag/v3.0.0
- google-deepmind/mujoco_playground at v1.0.1 (SHA 084e7957842792725d70866ee840d8fd79f17bbe): https://github.com/google-deepmind/mujoco_playground/tree/v1.0.1
- newton-physics/newton at v1.8.0 (SHA 425db81f01e402b51f96f560e154d529d645c6de): https://github.com/newton-physics/newton/releases/tag/v1.8.0
- NVlabs/ENPIRE at SHA 99ee90acf65b5b18957c8382ad580db999528be3: https://github.com/NVlabs/ENPIRE
- NVlabs/ASPIRE at SHA fa00f0ef2bc1d91d594b9aa502c22133c9f538f7: https://github.com/NVlabs/ASPIRE
- aws-samples/sample-rfm-simulation-on-aws at SHA 66e0fbef60d4d345d72c38505d3911d6a4cfff89 (and tag v1.0.0, SHA 1baf622dc6c7ebfd91035d803149d58bbed4fddb): https://github.com/aws-samples/sample-rfm-simulation-on-aws
- RLinf/RLinf at v0.4 (SHA 2348ece3df113874671478be1360ae3115b346e3): https://github.com/RLinf/RLinf
- rail-berkeley/hil-serl at SHA c32939bccb65f3b8c43a9f9add3d322d4ab0264a: https://github.com/rail-berkeley/hil-serl
- AWS Batch user guide: https://docs.aws.amazon.com/batch/latest/userguide/job_timeouts.html ; https://docs.aws.amazon.com/batch/latest/userguide/fair-share-scheduling.html ; https://docs.aws.amazon.com/batch/latest/userguide/resource-aware-scheduling.html
- Amazon Bedrock AgentCore limits: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/bedrock-agentcore-limits.html

**Tier 2 (first-party lab and vendor pages):**
- ENPIRE project page and chart data: https://research.nvidia.com/labs/gear/enpire/
- GR00T 2 page: https://research.nvidia.com/labs/gear/gr00t-2/

**Tier 3 (papers; peer-reviewed where the venue was confirmed):**
- Peer-reviewed: ENPIRE, https://arxiv.org/abs/2606.19980v2 (CoRL 2026); Eureka, https://arxiv.org/abs/2310.12931v2 (ICLR 2024, history); DrEureka, https://arxiv.org/abs/2406.01967v1 (RSS 2024, history); MuJoCo Playground, https://arxiv.org/abs/2502.08844v1 (RSS 2025).
- Preprints, RL: Recap, https://arxiv.org/abs/2511.14759v2 ; piRL, https://arxiv.org/abs/2510.25889v3 ; HIL-SERL, https://arxiv.org/abs/2410.21845v3 (history) ; LWD, https://arxiv.org/abs/2605.00416v4
- Preprints, agent loops: ASPIRE, https://arxiv.org/abs/2607.00272v2 ; AgenticRobotics, https://arxiv.org/abs/2608.07555v2 ; CaP-X, https://arxiv.org/abs/2603.22435v2 ; RACaP, https://arxiv.org/abs/2609.29394v1 ; SimEX, https://arxiv.org/abs/2609.38982v1 ; SEAR, https://arxiv.org/abs/2610.18792v1 ; AdaRSI, https://arxiv.org/abs/2610.20474v2 ; Physical RSI survey, https://arxiv.org/abs/2610.18842v1 ; RE-0, https://arxiv.org/abs/2609.32416v1 (abstract only)
- Preprints, judges: FailBench, https://arxiv.org/abs/2609.03611v1 ; D&A, https://arxiv.org/abs/2611.03622v1 ; VLMeg, https://arxiv.org/abs/2610.15401v1 ; ARS, https://arxiv.org/abs/2609.34484v1

**Tier 4 (used only to locate sources, never cited as fact):** web search result pages for the item-11 search on 2026-11-20.
