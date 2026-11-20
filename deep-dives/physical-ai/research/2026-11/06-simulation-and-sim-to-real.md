# 06 Simulation, rendering, sim-to-real and evaluation: research register

## 1. Header

- **Research date:** 2026-11-20. Every URL in this file was accessed 2026-11-20.
- **Area:** stream 06 of the "Physical AI" dive. Physics simulation (what a step computes, where it runs, what it costs), camera rendering in simulation (rasterisation versus ray tracing, which GPUs have ray-tracing cores), the sim-to-real gap and real-to-sim twins, and evaluation (closed-loop in simulation, world-model scoring, real-robot trials).
- **Sections fed:** 12 "Physics Simulation", 13 "Rendering and Ray Tracing", 14 "Sim-to-Real and Real-to-Sim", 16 "Evaluation".
- **Thread task:** an SO-101 robot arm picks up a block and places it in a cup.
- **Reader:** technical, level 100 to 200 (IT or software), no robotics background.
- **Quote policy:** quotes are verbatim from the pinned version, with house normalisation: curly quotes become straight quotes, typographic dashes become " - " or a hyphen, inline math is shown as plain text. Ellipses mark omissions.
- **Verdicts:** NEW (recorded fresh from the primary source); CARRIED (seed NN, re-fetched); STALE (superseded by a newer version); WRONG (seed said X, source says Y); UNKNOWN (unresolved, see the UNKNOWN register).
- **Labels:** `[vendor claim]` and `[author reported]` for performance figures printed by the party that built the thing; `[derived]` for arithmetic, with inputs shown; `[our reading]` for synthesis.
- **Seed:** "the seed research", files seed 02 (data and simulation, sections 3, 5, 6) and seed 04 (edge and sim-to-real, section 4). A seed claim appears here only after its source was re-fetched.

### Tiers

| Tier | What it covers |
|---|---|
| Tier 0 | Our experiments (none in this file) |
| Tier 1 | Source code at a pinned tag or 40-character SHA; official docs; API references; release notes on the vendor's own repository |
| Tier 2 | First-party vendor or lab blogs, announcements and talks |
| Tier 3 | Papers ("peer-reviewed (venue)" only where the venue was confirmed, otherwise "preprint"); third-party technical analysis |
| Tier 4 | Tutorials and press. Used only to locate primary sources |

Code over docs over blogs. Vendor and author performance numbers are claims, not measurements.

## 2. Currency table

Newest first-party version found on 2026-11-20, against what the seed research named.

| Item | Newest version found | Release date | Source | What the seed named |
|---|---|---|---|---|
| MuJoCo | 4.0.1 | 2026-11-11 (4.0.0 on 2026-11-06) | https://github.com/google-deepmind/mujoco/releases/tag/4.0.1 | 4.0.1 on one machine, 3.17.0 on another; the Isaac Sim 6.2.0 notes quoted "MuJoCo and MuJoCo Warp 3.12.0" |
| MuJoCo Warp | v4.0.1 (versioned in step with MuJoCo) | 2026-11-11 | https://github.com/google-deepmind/mujoco_warp/releases/tag/v4.0.1 | no version; one unofficial pull-request figure |
| MuJoCo Playground | v1.0.1 | 2026-11-09 (v1.0.0 on 2026-11-06) | https://github.com/google-deepmind/mujoco_playground/releases/tag/v1.0.1 | the February 2025 paper only |
| Newton | v1.8.0 | 2026-11-11 | https://github.com/newton-physics/newton/releases/tag/v1.8.0 | 1.0 (2026-03-16) and 1.6.1 as bundled by Isaac Lab 3.0.0 |
| Isaac Sim | v6.2.0 (general availability); a v7.0.0a1 alpha exists | 2026-10-14 (alpha 2026-09-18) | https://github.com/isaac-sim/IsaacSim/releases/tag/v6.2.0 | 6.2.0 |
| Isaac Lab | v3.0.0 | 2026-10-20 | https://github.com/isaac-sim/IsaacLab/releases/tag/v3.0.0 | v3.0.0, "Oct 20", year inferred |
| LeRobot | v0.7.0 | 2026-11-05 | https://github.com/huggingface/lerobot/releases/tag/v0.7.0 | not named in seed 02 section 3 |
| LeIsaac | v0.4.0 | 2026-04-15 | https://github.com/LightwheelAI/leisaac/releases/tag/v0.4.0 | not named |
| Genesis | v1.4.7 | 2026-11-17 | https://github.com/Genesis-Embodied-AI/Genesis/releases/tag/v1.4.7 | "1.0, May 2026 blog" |
| 3DGRUT | v1.1.0 | 2026-06-10 | https://github.com/nv-tlabs/3dgrut/releases/tag/v1.1.0 | "v2.0.0 June 2026" |

| Isaac Lab-Arena | v0.3 (alpha) announced; a `release/0.4.0` branch exists, no announcement found | 2026-09-10 (0.3); branch commit 2026-11-19 | https://github.com/isaac-sim/IsaacLab-Arena/discussions/1245 | v0.3 alpha, 2026-09-10 |
| Isaac Sim requirements page | 6.2.0 page (same content as "latest") | fetched 2026-11-20 | https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/requirements.html | "current, references Isaac Sim 6.0 on DGX Spark" |
| MuJoCo Warp nightly benchmarks | last data row 2026-09-03 (commit 917a14b) | 2026-09-03 | https://google-deepmind.github.io/mujoco_warp/nightly/ | not used by the seed |
| Isaac Lab release benchmark export | snapshot of 2026-10-12 (GA 3.0) | 2026-10-12 | Isaac Lab v3.0.0, `docs/source/_static/benchmarks/environment-performance-release.csv` | not used by the seed |
| Isaac Lab paper | arXiv 2511.04831v1 (no later version) | 2025-11-06 | https://arxiv.org/abs/2511.04831v1 | same |
| MuJoCo Playground paper | arXiv 2502.08844v1 (no later version) | 2025-02-12 | https://arxiv.org/abs/2502.08844v1 | same |
| PolaRiS | arXiv 2512.16881v2 | 2025-12-30 | https://arxiv.org/abs/2512.16881v2 | unversioned |
| RoboArena | arXiv 2506.18123v2 | 2025-11-29 | https://arxiv.org/abs/2506.18123v2 | same revision date |
| RoboWorld | arXiv 2607.01060v4 | 2026-07-15 | https://arxiv.org/abs/2607.01060v4 | v3 |
| LIBERO successors | LIBERO-Plus arXiv 2510.13626v3; LIBERO-PRO arXiv 2510.03827v2 | 2025-12-26; 2026-05-25 | arXiv listings | seed called LIBERO "close to saturated" without naming successors |
| MuJoCo Menagerie | no releases; commit 370c439 | 2026-11-10 | https://github.com/google-deepmind/mujoco_menagerie | not named |
| TheRobotStudio/SO-ARM100 | no releases; commit 141aea7 | 2026-11-20 | https://github.com/TheRobotStudio/SO-ARM100 | not named in seed 02 section 3 |

Version skew to keep in view: Isaac Lab 3.0.0 pins Newton 1.6.1 and Warp 1.17; Newton's own newest is 1.8.0 on Warp 1.19; the Isaac Sim 6.2.0 release notes quoted by the seed bundle "MuJoCo and MuJoCo Warp 3.12.0" while MuJoCo itself is at 4.0.1.

## 3. Pinned sources

All accessed 2026-11-20.

**Papers (arXiv ID with version; venue as confirmed)**

| arXiv | Paper | Venue | Entries |
|---|---|---|---|
| 2502.08844v1 | MuJoCo Playground | preprint (repository labels the code "RSS 2025"; venue not confirmed here) | F06-32 to F06-34, F06-96 |
| 2511.04831v1 | Isaac Lab: A GPU-Accelerated Simulation Framework for Multi-Modal Robot Learning | preprint, first-party lab | F06-63 to F06-65, F06-67, F06-69, F06-70 |
| 1703.06907v1 | Domain Randomization (Tobin et al.) | preprint (submitted to IROS 2017 per arXiv comment); history | F06-66 |
| 2405.05941v1 | SIMPLER: Evaluating Real-World Robot Manipulation Policies in Simulation | preprint; history | F06-71, F06-81 |
| 2512.16881v2 | PolaRiS | preprint | F06-73, F06-74, F06-82, F06-83, F06-90, F06-96 |
| 2506.18123v2 | RoboArena | preprint (venue not confirmed here) | F06-88 |
| 2607.01060v4 | RoboWorld | preprint | F06-89 |
| 2506.00613v3 | WorldGym | preprint | F06-90 |
| 2610.13522v1 | Beyond Successful Robot Demonstrations (HF-WM) | preprint | F06-90 |
| 2606.27375v1 | ABC: Scalable Behavior Cloning with Open Data, Training, and Evaluation | preprint | F06-84, F06-96 |
| 2609.13679v2 | Lessons Learned From the REAL-I Challenge at ICRA 2026 | preprint | F06-85 |
| 2510.13626v3, 2510.03827v2 | LIBERO-Plus, LIBERO-PRO (abstracts only) | preprint | F06-87 |
| 2503.10966v4 | STEP: Policy Comparison with Near-Optimal Stopping (abstract only) | peer-reviewed, RSS 2025 (arXiv comment) | F06-96, F06-98 |
| 2409.09491v2 | Robot Learning as an Empirical Science (abstract only) | preprint; history | F06-98 |
| 2608.07555 | promotion gate paper | owned by stream 04; referenced, not read | F06-98 |

**Code and release notes (tag and 40-character SHA)**

| Repository | Tag | SHA | Files read | Entries |
|---|---|---|---|---|
| google-deepmind/mujoco | 4.0.1 | 4ed093a9f06b170bd1564942fa37e1bb907d93e3 | release notes 4.0.0 and 4.0.1; `doc/computation/index.rst`, `doc/XMLreference.rst`, `doc/programming/samples.rst`, `doc/programming/rendering.rst`, `doc/mjx.rst`, `doc/mjwarp/index.rst` | F06-1, F06-2, F06-9 to F06-18, F06-23, F06-24, F06-61, F06-78, F06-99, F06-100 |
| google-deepmind/mujoco | default branch | 23c23e0dc1643e99bb2a0abaf5dc4cf873e0bd77 | `doc/mjwarp/index.rst` (OptiX section) | F06-62 |
| google-deepmind/mujoco | discussion 3773 | n/a | "MuJoCo 4" announcement, 2026-11-07 | F06-3 to F06-8 |
| google-deepmind/mujoco_warp | v4.0.1 | 2db59f4d929dab714d85fab946d93427d2aa56e7 | `README.md`, `pyproject.toml` | F06-19 |
| google-deepmind/mujoco_warp | none (benchmarked commit) | 917a14b77735944140b66345325c8a14f2fe6be7 | `benchmarks/README.md`, `benchmarks/render/README.md`, `benchmarks/*/__init__.py`; nightly data files | F06-20, F06-22, F06-24 |
| google-deepmind/mujoco_warp | pull requests 1113 (merged 2026-02-06) and 1932 (closed, unmerged) | n/a | descriptions | F06-21, F06-24 |
| google-deepmind/mujoco_playground | v1.0.1 | 084e7957842792725d70866ee840d8fd79f17bbe | `README.md`, `mujoco_playground/docs/{changelog,sim2real,sysid}.rst`, `tasks/manipulation/pick_cube/so101/{task.py,deploy/README.md}`, `tasks/sysid/so101/README.md`, `robots/so101/sim/constant.py`, `profiling/README.md` | F06-25 to F06-31 |
| google-deepmind/mujoco_menagerie | none | 370c43965323c0944b433b202aac5058b5f907a9 | `robotstudio_so101/README.md`, directory listing | F06-37 |
| TheRobotStudio/SO-ARM100 | none | 141aea7bcac2744d92998e30268c413202a56f96 | `Simulation/SO101/README.md`, directory listing | F06-35, F06-36 |
| newton-physics/newton | v1.8.0 | 425db81f01e402b51f96f560e154d529d645c6de | release notes, `README.md`, `docs/concepts/sensors.rst` | F06-39 to F06-43 |
| newton-physics/newton | default branch | 9bd0215d9c82508ea8d759c41df1b4577423d6ea | `docs/concepts/sensors.rst` (OptiX sentence) | F06-62 |
| isaac-sim/IsaacSim | v6.2.0 | 74a9356b20250dd60337d90b4b4d913c9454d32b | release entry | F06-44 |
| isaac-sim/IsaacLab | v3.0.0 | e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4 | release notes; `docs/source/concepts/{renderers,physics_backends}.rst`, `docs/source/isaaclab/installation.rst`, `docs/source/_static/benchmarks/{README.md,environment-performance-release.csv}`, `source/isaaclab_assets/isaaclab_assets/robots/so101.py`, `docs/source/policy_deployment/06_so101_typing/so101_typing_policy.rst`, `source/isaaclab/isaaclab/envs/mdp/events.py` | F06-45 to F06-51, F06-54, F06-55, F06-68, F06-102 |
| isaac-sim/IsaacLab-Arena | none (`release/0.4.0` branch head) | 2281e1256bd10bf9b62b67ccccec9c87cd51fc6f | branch list; discussion 1245 | F06-80, F06-92 |
| huggingface/lerobot | v0.7.0 | 410c095eacc0011d998a73383eb94abed2715af0 | `docs/source/simulation.mdx`, `src/lerobot/utils/eval_stats.py`, `src/lerobot/scripts/lerobot_eval.py`, `src/lerobot/sim/integrations/` listing | F06-38, F06-94, F06-95, F06-97 |
| nv-tlabs/3dgrut | v1.1.0 | 0a5832248698ab8456b181d6ea17fe02eda58637 | release notes, `README.md` | F06-75, F06-76 |
| Genesis-Embodied-AI/Genesis | v1.4.7 | 0a9e28ac6af9206baf26285f7b71104d670a5e51 | `README.md` (searched for throughput figures; none found) | comparison table note |
| LightwheelAI/leisaac | v0.4.0 | 1651c321e9b0c1bb54233211fc7b3cd70d8373d5 | release list only | U6 |

**Documentation and first-party web pages (unversioned unless noted)**

- https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/requirements.html (F06-52, F06-53, F06-101)
- https://docs.isaacsim.omniverse.nvidia.com/6.2.0/assets/usd_assets_nurec.html (F06-77)
- https://isaac-sim.github.io/IsaacLab-Arena/main/pages/references/performance.html (F06-93)
- https://google-deepmind.github.io/mujoco_warp/nightly/ (F06-20, F06-22, F06-24)
- https://developer.nvidia.com/discover/ray-tracing (F06-56, F06-57)
- https://www.nvidia.com/en-us/data-center/products/a10-gpu/ , https://www.nvidia.com/en-us/data-center/l4/ , https://www.nvidia.com/en-us/data-center/l40s/ , https://www.nvidia.com/en-us/data-center/rtx-pro-6000-blackwell-server-edition/ , https://www.nvidia.com/en-us/data-center/h100/ , https://www.nvidia.com/en-us/data-center/h200/ (F06-58, F06-59)
- https://aws.amazon.com/blogs/machine-learning/scale-robot-reinforcement-learning-with-nvidia-isaac-lab-on-amazon-sagemaker-ai/ (2026-06-09; F06-60)
- https://aws.amazon.com/blogs/physical-ai/bringing-a-frontier-world-model-to-the-convenience-store-inside-telexistences-dreamzero-experiment-on-aws/ (2026-09-09; F06-72, F06-86)
- https://aousd.org/blog/foundations-of-open-3d-development-introducing-aousd-core-specification-1-0/ (F06-79)
- https://www.1x.tech/discover/1x-world-model (2024-09-17; F06-91)

## 4. Claim register

### A. MuJoCo at its current release

**F06-1. The newest MuJoCo release is 4.0.1, dated November 11, 2026; 4.0.0 shipped November 6, 2026 and 3.17.0 on October 22, 2026.**
- Location: GitHub releases list of google-deepmind/mujoco; release body heading "Version 4.0.1 (November 11, 2026)".
- Verdict: CARRIED (seed 02 named both 4.0.1 and 3.17.0 as seen on two machines; the releases list settles the order)
- Evidence: https://github.com/google-deepmind/mujoco/releases/tag/4.0.1 (tag commit 4ed093a9f06b170bd1564942fa37e1bb907d93e3) | Tier 1, release notes | documentation of support | "Version 4.0.1 (November 11, 2026)" and, on the 4.0.0 release, "Version 4.0.0 (November 6, 2026)" (accessed 2026-11-20)
- Use in dive: section 12, the version line in the simulator table. A machine still on 3.17.0 is one major version behind by two weeks, not years.

**F06-2. MuJoCo 4.0.1 fixes a 4.0.0 regression in the sparse Cholesky factorisation that gave the Newton solver a wrong Hessian factor, "causing slow convergence, wrong accelerations and divergence". Anyone on 4.0.0 should move to 4.0.1.**
- Location: 4.0.1 release notes, "Bug fixes", item 3.
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/releases/tag/4.0.1 | Tier 1, release notes | code behaviour | "Fixed a bug in the sparse Cholesky factorization introduced in 4.0.0, which merged rows with different descendants into one supernode and gave the Newton solver a wrong Hessian factor when the constraint Jacobian is sparse, causing slow convergence, wrong accelerations and divergence" (accessed 2026-11-20)
- Use in dive: section 12, practical note: pin 4.0.1, not 4.0.0. Also a concrete illustration that the contact solver is the delicate part of a physics step.

**F06-3. Since 3.5 MuJoCo's middle version number marks breaking changes, so the jump to 4.0 is a deliberate "big step": the 4.0 announcement lists three pillars, MuJoCo Studio with the Filament renderer, matured deformables, and rebuilt collisions with speculative contacts.**
- Location: discussion 3773 "MuJoCo 4: Studio & Filament, Deformables, Speculative Contacts" (2026-11-07), opening paragraphs and Pillars 1 to 3.
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/discussions/3773 | Tier 2, first-party announcement | documentation of support | "Since `3.5`, the middle version number simply marks breaking changes, so we saved `4.0` for a big step. Today we are releasing MuJoCo 4, together with MuJoCo Playground 1.0." (accessed 2026-11-20)
- Use in dive: section 12, "what changed in the 4.x line" in two sentences.

**F06-4. The 4.0 announcement's own "Then and Now" table lists where MuJoCo runs in 2026: CPU, `mujoco.batch` multi-world CPU, MJX, MuJoCo Warp (with NVIDIA) and the browser through WebAssembly. In 2023 it was CPU plus GPU and TPU through MJX.**
- Location: discussion 3773, table "Then and Now", row "Where it runs".
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/discussions/3773 | Tier 2, first-party announcement | documentation of support | "Where it runs | CPU; GPU and TPU via MJX | CPU, `mujoco.batch` multi-world CPU, MJX, MuJoCo Warp (with NVIDIA), browser (WebAssembly, `@mujoco/mujoco` on npm)" (accessed 2026-11-20)
- Use in dive: section 12, the map of back ends for one model file: same MJCF, five places to step it.

**F06-5. Speculative contacts, new in 4.0, sweep fast-moving shapes ahead of time so thin objects are not tunnelled through in one timestep. DeepMind reports a robot arm catching a 0.7 mm playing card "every time with a 16 ms timestep, where discrete collision detection misses it at anything above 8 ms", and thin-object grasping running "6 to 9 times faster" because the timestep can be larger. CPU only in 4.0. [vendor claim]**
- Location: discussion 3773, "Pillar 3: Rebuilt Collisions & Speculative Contacts".
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/discussions/3773 | Tier 2, first-party announcement | benchmark claim (vendor reported) | "In our tests, a robot arm catches a 0.7 mm playing card falling at over 2 m/s every time with a 16 ms timestep, where discrete collision detection misses it at anything above 8 ms. Humanoid stair climbing and thin-object grasping run 6 to 9 times faster, because they can use larger timesteps. In 4.0, speculative contacts cover convex primitives and meshes on CPU; heightfields, SDFs, flexes, MJX and MuJoCo Warp will follow." (accessed 2026-11-20)
- Use in dive: section 12, why contacts make simulation hard: a contact that starts and ends between two timesteps is never seen. Ties the timestep choice to the thinnest, fastest object in the scene (the cup wall, the block edge).

**F06-6. MuJoCo 4.0 ships a system-identification toolbox (`mujoco.sysid`, installed with `pip install "mujoco[sysid]"`) and lists it, with MuJoCo Playground 1.0, as its sim-to-real answer; in 3.0 the entry in the same row was "bring your own".**
- Location: discussion 3773, "Then and Now", row "Sim-to-real"; install block.
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/discussions/3773 | Tier 2, first-party announcement | documentation of support | "Sim-to-real | bring your own | `mujoco.sysid`, MuJoCo Playground 1.0" and "pip install -U \"mujoco[sysid]\" # system identification toolbox" (accessed 2026-11-20)
- Use in dive: section 14, system identification is now a packaged step in the simulator the reader already has.

**F06-7. MuJoCo 4.0 adds actuator models aimed at real servos: a `pid` actuator, a datasheet `dcmotor` actuator and actuator delays.**
- Location: discussion 3773, "Then and Now", row "Actuators and sensors".
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/discussions/3773 | Tier 2, first-party announcement | documentation of support | "plus `pid`, datasheet `dcmotor`, `SO(3)` `orientation`, delays, `tactile`, `contact`, camera `rangefinder`" (accessed 2026-11-20)
- Use in dive: section 14, actuator modelling for a hobby servo arm: the simulator can now express a PID position loop, a DC motor from datasheet values and a delay, which are the three things a cheap servo gets wrong when modelled as an ideal position actuator.

**F06-8. The 4.0 announcement says the collision stack rebuilt during 3.x is "fully multithreaded", with constraint islands on by default and sleeping for large scenes; the native convex collision code replaced `libccd` for "a ~4x speedup" over multicontact with `libccd`. [vendor claim]**
- Location: discussion 3773, Pillar 3 first paragraph; "Then and Now" rows "Collision detection" and "Large scenes".
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/discussions/3773 | Tier 2, first-party announcement | benchmark claim (vendor reported) | "`nativeccd` replaced `libccd`, and single-shot multicontact (`multiccd`) has expanded to all geom types (including with `margin`), resulting in a ~4x speedup and significant robustness improvements over multicontact with `libccd`. The entire collision stack (geoms, SDFs, and flexes) is now fully multithreaded" (accessed 2026-11-20)
- Use in dive: section 12, what loads the CPU: collision detection and the constraint solve, each of which can now use several cores inside one world.

### B. What a physics step computes, and what it costs on a CPU

**F06-9. MuJoCo's own documentation lists what one call to `mj_step` does, as 26 stages in four groups: position (forward kinematics, inertia matrix, collision detection, constraint construction), velocity (passive forces, Coriolis and gravity terms), force and acceleration (actuator forces, then the constraint solve that yields the joint acceleration `qacc`), and finally the integrator that advances the state by one timestep.**
- Location: MuJoCo docs, Computation chapter, "Simulation pipeline", "Forward dynamics", stages 1 to 26 (`doc/computation/index.rst` at tag 4.0.1).
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/computation/index.rst | Tier 1, first-party docs at a pinned tag | definition | "The top-level function mj_step invokes the entire sequence of stages below 1-26." ... "8. Construct the list of active contacts. This includes both broad-phase and near-phase collision detection: mj_collision" ... "9. Construct the constraint Jacobian, compute the constraint residuals, construct islands" ... "22. Compute the constraint forces with the selected solver, and update the joint acceleration so as to account for the constraint forces. This yields the vector mjData.qacc which is the main output of forward dynamics: mj_fwdConstraint" (accessed 2026-11-20)
- Use in dive: section 12, the anchor diagram: positions in, find contacts, solve for contact forces, integrate, positions out. Three boxes for the reader (collision detection, constraint solve, integration), with the 26-stage list behind an expandable section.

**F06-10. The default MuJoCo timestep is 0.002 s (2 ms), and the docs call the timestep "the single most important parameter affecting the speed-accuracy trade-off". Real time requires the timestep to be larger than the CPU time per step.**
- Location: MuJoCo XML reference, `option/timestep` (`doc/XMLreference.rst` at tag 4.0.1).
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/XMLreference.rst | Tier 1, first-party docs at a pinned tag | definition | "timestep: real, \"0.002\" Simulation time step in seconds. This is the single most important parameter affecting the speed-accuracy trade-off which is inherent in every physics simulation. Smaller values result in better accuracy and stability. To achieve real-time performance, the time step must be larger than the CPU time per step (or 4 times larger when using the RK4 integrator)." (accessed 2026-11-20)
- Use in dive: section 12, the worked example's first input: 2 ms physics step. At a 30 Hz policy that is 1/30 s / 0.002 s = 16.7 physics steps per policy step [derived]; teams round by picking a control period that is a whole multiple of the timestep.

**F06-11. Contacts are what make the step demanding: the same docs entry says MuJoCo "can simulate most robotic systems a lot faster than real-time, however models with many floating objects (resulting in many contacts) are more demanding computationally", and that stability depends on the constraint solver settings as well as the timestep.**
- Location: MuJoCo XML reference, `option/timestep`.
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/XMLreference.rst | Tier 1, first-party docs at a pinned tag | definition | "MuJoCo can simulate most robotic systems a lot faster than real-time, however models with many floating objects (resulting in many contacts) are more demanding computationally. Keep in mind that stability is determined not only by the time step but also by the CSolver; in particular softer constraints can be simulated with larger time steps." (accessed 2026-11-20)
- Use in dive: section 12, "why contacts make it hard" in the simulator's own words. On the arm task the block and the cup are the floating objects; the arm alone is cheap.

**F06-12. Collision detection in MuJoCo is three phases: a broad phase (sweep-and-prune over body pairs), a mid phase (bounding-volume hierarchies per body pair) and a near phase that checks geom pairs in detail and returns the active contacts. Checking all pairs in detail "is prohibitively expensive for large systems".**
- Location: MuJoCo docs, Computation chapter, "Collision detection".
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/computation/index.rst | Tier 1, first-party docs at a pinned tag | definition | "The output of collision detection is the list of active contacts, defined as having contact distance smaller than their margin" ... "pairs in detail (also known as near-phase collision detection) is prohibitively expensive for large systems" ... "The body pairs are generated via broad-phase collision detection based on a modified sweep-and-prune algorithm." (accessed 2026-11-20)
- Use in dive: section 12, mechanism: branching, pair-pruning code. This is the part that ports badly to GPUs (F06-17).

**F06-13. MuJoCo recommends the `implicitfast` integrator for most models, and added a `discrete` integrator for the case a servo arm is in: "when stiff springs, position servos or strong damping interact with contacts". A too-large timestep makes a simulation unstable; a too-small one wastes CPU time.**
- Location: MuJoCo docs, Computation chapter, admonition "Choosing timestep and integrator".
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/computation/index.rst | Tier 1, first-party docs at a pinned tag | definition | "The time step is perhaps the single most important parameter that the user can adjust. If it is too large, the simulation will become unstable. If it is too small, CPU time will be wasted without meaningful improvement in accuracy." ... "The recommended integrator is implicitfast which usually has the best tradeoff of stability and performance." ... "Choose discrete when stiff springs, position servos or strong damping interact with contacts" (accessed 2026-11-20)
- Use in dive: section 12, the integration box of the diagram; section 14, position servos are numerically stiff, which is one reason a cheap-servo arm is harder to simulate well than its size suggests.

**F06-14. MuJoCo ships a timing tool, `testspeed`, that rolls a model out for 10,000 steps by default and prints contact counts, constraint counts and CPU time. With `--nthread=N` it runs N identical simulations in parallel on one model, "as in Reinforcement Learning scenarios where samples are collected in parallel"; "the optimal nthread usually equals the number of logical cores".**
- Location: MuJoCo docs, Programming chapter, Code samples, `testspeed` (`doc/programming/samples.rst` at tag 4.0.1).
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/programming/samples.rst | Tier 1, first-party docs at a pinned tag | documentation of support | "When nthread > 1 is specified, the code allocates a single mjModel and per-thread mjData, and runs nthread identical simulations in parallel. This tests performance with all cores active, as in Reinforcement Learning scenarios where samples are collected in parallel. The optimal nthread usually equals the number of logical cores." (accessed 2026-11-20)
- Use in dive: section 12, the practical recipe for the reader's own number (and the Tier 0 experiment stream 08 can run on the SO-101 model). CPU MuJoCo scales by running one world per logical core.

**F06-15. First-party CPU throughput for the classic MuJoCo humanoid, timed with `testspeed` at two threads per core: 650K steps per second on an Apple M3 Max and 1.8M steps per second on a 64-core AMD 3995WX. The same scene on MJX-JAX reached 950K on one NVIDIA A100 at batch size 8192 and 2.7M on an 8-chip v5 TPU machine at batch size 16384. [vendor claim]**
- Location: MuJoCo docs, MJX chapter, "Large, complex scenes with many contacts" (`doc/mjx.rst` at tag 4.0.1).
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/mjx.rst | Tier 1, first-party docs at a pinned tag | benchmark claim (vendor reported) | "We simulate this scene using CPU MuJoCo on an Apple M3 Max and a 64-core AMD 3995WX and time it using testspeed, using 2 x numcore threads. We time the MJX-JAX simulation on an Nvidia A100 GPU using a batch size of 8192 and an 8-chip v5 TPU machine using a batch size of 16384." ... "The values for a single humanoid (leftmost datapoints) for the four timed architectures are 650K, 1.8M, 950K and 2.7M steps per second, respectively." (accessed 2026-11-20)
- Use in dive: section 12, the surprising number: a 64-core workstation CPU out-ran an A100 running MJX-JAX on this scene. Per-thread rate: 1.8M / 128 threads = about 14,000 steps per second per thread [derived]; at a 2 ms timestep that is about 28 times real time per thread [derived: 14,000 x 0.002]. The docs do not print a single-thread figure (U1).

**F06-16. MuJoCo is tuned for latency (time for one step) and MuJoCo Warp for throughput (total steps per unit time): "It is expected that a simulation step with MJWarp will be less performant than a step with MuJoCo for the same simulation." CPU MuJoCo is the documented choice for model-predictive control, interactive viewers and simulation-based teleoperation; MuJoCo Warp for reinforcement learning.**
- Location: MuJoCo docs, MuJoCo Warp chapter, "When To Use MJWarp?", "Low latency" (`doc/mjwarp/index.rst` at tag 4.0.1).
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/mjwarp/index.rst | Tier 1, first-party docs at a pinned tag | definition | "MJWarp is optimized for throughput: the total number of simulation steps per unit time whereas MuJoCo is optimized for latency: time for one simulation step. It is expected that a simulation step with MJWarp will be less performant than a step with MuJoCo for the same simulation. As a result, MJWarp is well suited for applications where large numbers of samples are required, like reinforcement learning, while MuJoCo is likely more useful for real-time applications like online control (e.g., model predictive control) or interactive graphical interfaces (e.g., simulation-based teleoperation)." (accessed 2026-11-20)
- Use in dive: section 12, the mental model for CPU versus GPU physics: one world fast, or thousands of worlds at once. Evaluating one imitation-learning policy on the arm task is the first case; training with reinforcement learning is the second.

**F06-17. GPUs handle branching code poorly, and collision detection branches. The MJX docs say so directly and show MJX-JAX throughput falling faster than CPU MuJoCo as contacts are added.**
- Location: MuJoCo docs, MJX chapter, "Large, complex scenes with many contacts".
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/mjx.rst | Tier 1, first-party docs at a pinned tag | definition | "Accelerators exhibit poor performance for branching code. Branching is used in broad-phase collision detection, when identifying potential collisions between large numbers of bodies in a scene. MJX-JAX ships with a simple branchless broad-phase algorithm (see performance tuning) but it is not as powerful as the one in MuJoCo." ... "as we increase the number of humanoids (which increases the number of potential contacts in a scene), MJX-JAX throughput decreases more rapidly than MuJoCo" (accessed 2026-11-20)
- Use in dive: section 12, why "put it on the GPU" is not automatic for physics; the reason MuJoCo Warp exists (F06-19).

### C. GPU physics from the MuJoCo family: MJX, MuJoCo Warp, Playground

**F06-18. MJX is now a JAX API over two implementations: MJX-JAX, the JAX re-implementation that runs on NVIDIA and AMD GPUs, Apple Silicon and Google TPUs, and MJX-Warp, which calls MuJoCo Warp and targets NVIDIA GPUs. MJX-Warp "does not support automatic differentiation".**
- Location: MuJoCo docs, MJX chapter, introduction and "MJX-Warp".
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/mjx.rst | Tier 1, first-party docs at a pinned tag | documentation of support | "A JAX re-implementation of MuJoCo (MJX-JAX) is available. MJX-JAX runs on: Nvidia and AMD GPUs, Apple Silicon, and Google Cloud TPUs. A Warp implementation of MuJoCo (MJX-Warp) optimizes performance specifically for NVIDIA GPUs, resolving several performance bottlenecks exhibited in MJX-JAX." ... "Note that unlike MJX-JAX, MJX-Warp does not support automatic differentiation and has no immediate plans to support auto-diff." (accessed 2026-11-20)
- Use in dive: section 12, the naming a 2025 reader will get wrong: "MJX" no longer means only the JAX engine.

**F06-19. MuJoCo Warp is "an implementation of MuJoCo written in Warp and optimized for NVIDIA hardware and parallel simulation", developed jointly by NVIDIA and Google DeepMind as part of the Newton project. Its newest release is v4.0.1 (2026-11-11), numbered in step with MuJoCo. It needs an NVIDIA GPU for speed and runs on CPU for debugging.**
- Location: MuJoCo docs, MuJoCo Warp chapter, first paragraphs; mujoco_warp README at v4.0.1.
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco_warp/tree/2db59f4d929dab714d85fab946d93427d2aa56e7 (tag v4.0.1, README.md) | Tier 1, first-party repository at a pinned tag | documentation of support | "MJWarp is a GPU-accelerated version of the MuJoCo physics simulator, designed for NVIDIA hardware." ... "MJWarp is maintained by Google DeepMind and NVIDIA as part of the Newton project." ... "MuJoCo Warp requires an NVIDIA GPU for fast simulation but supports CPU for development and debugging." (accessed 2026-11-20)
- Use in dive: section 12, simulator table row. The README at v4.0.1 carries no "beta" label; the seed treated MuJoCo Warp as pre-release.

**F06-20. Published MuJoCo Warp throughput, from the project's own nightly benchmark page (one NVIDIA RTX 6000 Ada Generation, 48 GB; newest row dated 2026-09-03 at commit 917a14b): humanoid, 8192 worlds, 5.77 million steps per second; Aloha "pot" manipulation scene, 8192 worlds, 2.51 million; an idle Franka Panda arm, 32768 worlds, 25.2 million; Aloha "clutter" scene with YCB objects, 2048 worlds, 342 thousand. [vendor claim]**
- Location: "MuJoCo Warp Nightly Benchmarks" page, system box and per-benchmark data files (`humanoid.jsonl`, `aloha_pot.jsonl`, `franka_emika_panda.jsonl`, `aloha_clutter.jsonl`, field `steps_per_second`, last row); world counts in `benchmarks/*/__init__.py` at the benchmarked commit.
- Verdict: NEW (replaces the seed's unofficial pull-request figure, see F06-21)
- Evidence: https://google-deepmind.github.io/mujoco_warp/nightly/ and https://github.com/google-deepmind/mujoco_warp/tree/917a14b77735944140b66345325c8a14f2fe6be7/benchmarks | Tier 1, first-party benchmark data | benchmark claim (vendor reported) | "These benchmarks were recorded on a workstation with the following specifications: GPU: NVIDIA RTX 6000 Ada Generation VRAM: 48 GB CPU: AMD Ryzen Threadripper PRO 5995WX 64-Cores"; data rows: humanoid "steps_per_second": 5765714.44, "converged_worlds": 8192; aloha_pot 2507435.28, 8192; franka_emika_panda 25154053.51, 32768; aloha_clutter 342052.78, 2048; all with "timestamp": "2026-09-03T09:17:57+00:00" (accessed 2026-11-20)
- Use in dive: section 12, GPU throughput column, with the lesson in the spread: the same GPU does 25 million steps per second on an arm touching nothing and 0.34 million on a cluttered table, a factor of 74 [derived: 25.15 / 0.342]. Contacts set the price. The page's newest data point is 11 weeks old (U2).

**F06-21. The seed's MuJoCo Warp figure (humanoid, 8192 worlds, 9.58M steps per second on an RTX PRO 6000) comes from the description of pull request 1932, written by an external contributor; that pull request is closed and was not merged.**
- Location: google-deepmind/mujoco_warp pull request 1932, "Avoid atomics in deterministic actuator and sparse contact kernels".
- Verdict: CARRIED (seed 02 section 3.2, re-fetched) with a downgrade: treat as an unofficial contributor measurement, not a project figure.
- Evidence: https://github.com/google-deepmind/mujoco_warp/pull/1932 | Tier 3, third-party measurement posted on the first-party repository | benchmark claim (author reported) | "mjwarp-testspeed with ATOMICS on main 5cfac7b4, median of 3, RTX PRO 6000: humanoid at 8192 worlds 1.79M to 2.55M steps/s (NONE 9.58M)" (state: closed, merged_at: null; accessed 2026-11-20)
- Use in dive: not for the page. Use F06-20. Kept so the next pass does not re-import the number.

**F06-22. GPU memory per world for MuJoCo Warp, from the same nightly data: humanoid 466 MB for 8192 worlds, about 57 KB per world; Aloha pot scene 692 MB for 8192 worlds, about 84 KB per world; Aloha clutter 958 MB for 2048 worlds, about 468 KB per world. State-only physics is cheap in memory; thousands of worlds fit in under 1 GB. [derived from vendor data]**
- Location: nightly data files, field `total_memory` (bytes), last row.
- Verdict: NEW
- Evidence: https://google-deepmind.github.io/mujoco_warp/nightly/ | Tier 1, first-party benchmark data | benchmark claim (vendor reported) | humanoid "total_memory": 466485248; aloha_pot "total_memory": 691994624; aloha_clutter "total_memory": 958070784 (accessed 2026-11-20). [derived]: 466,485,248 / 8192 = 56,944 bytes; 691,994,624 / 8192 = 84,472 bytes; 958,070,784 / 2048 = 467,808 bytes.
- Use in dive: sections 12 and the compute-cost notes: GPU memory per physics environment. Contrast with camera environments in section 13 (F06-24, and the Isaac Lab entries).

**F06-23. Memory and computation in MuJoCo Warp scale with fixed per-world buffers the user sets up front: the maximum number of contacts (`nconmax` or `naconmax`) and constraints (`njmax`). "Simulation throughput is often limited by memory requirements for large numbers of worlds."**
- Location: MuJoCo docs, MuJoCo Warp chapter, "Performance Tuning" and "Memory".
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/mjwarp/index.rst | Tier 1, first-party docs at a pinned tag | definition | "Memory and computation scales with the values of these parameters. For best performance, the values of these parameters should be set as small as possible while ensuring the simulation does not exceed these limits." ... "Simulation throughput is often limited by memory requirements for large numbers of worlds." (accessed 2026-11-20)
- Use in dive: section 12, mechanism: a GPU cannot grow an array mid-kernel, so every world reserves room for its worst-case contact count. This is the "which tensor goes where" for GPU physics: arrays of shape (number of worlds, max contacts).

**F06-24. MuJoCo Warp includes a batch camera renderer that ray traces on the GPU with Warp's bounding-volume hierarchies. Published render benchmark: 8192 worlds, one 64x64 camera each, about 756 ns per world per frame on an RTX 6000 Ada, about 1.3 million frames per second, using 44.4 GB of GPU memory in total (about 5.4 MB per world). The cost "scales linearly with resolution and number of cameras". [vendor claim; frames per second derived]**
- Location: MuJoCo docs, MuJoCo Warp chapter, "Batch Rendering"; `benchmarks/render/README.md` at commit 917a14b; nightly `primitives.jsonl` last row; pull request 1113 "Limitations".
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/mjwarp/index.rst | Tier 1, first-party docs at a pinned tag | documentation of support | "MJWarp provides a batch renderer for high-throughput ray tracing built on Warp's accelerated BVHs for rendering worlds with multiple cameras in parallel." Benchmark table (https://github.com/google-deepmind/mujoco_warp/tree/917a14b77735944140b66345325c8a14f2fe6be7/benchmarks/render): "Cameras | 1", "Resolution | 64x64", "Worlds | 8192"; nightly row: "render": 756.09, "total_memory": 44352733184. Pull request 1113 (merged 2026-02-06): "The renderer currently scales linearly with resolution and number of cameras, as it scales with the total number of rays that need to be raycast." (accessed 2026-11-20). [derived]: 1e9 / 756 ns = 1.32M world-frames per second; 44,352,733,184 / 8192 = 5.41 MB per world. The nanosecond unit is inferred from the physics rows, where `step` x `steps_per_second` = 1e9 (171.59 x 5,765,714 = 0.99e9).
- Use in dive: section 13, a ray tracer that is ordinary GPU compute: it walks a tree in CUDA kernels and does not call the RTX hardware path (see F06-57 and F06-62 in group H for the RT-core question). Also the cost shape: a 64x64 image is 4,096 rays; a 640x480 image is 307,200 rays, 75 times more [derived].

### D. MuJoCo Playground: the 2025 paper and the 1.0 rebuild

**F06-25. MuJoCo Playground 1.0.0 (2026-11-06) is a rebuild, not an update of the 2025 paper's code: it is written in PyTorch on `reaf-sim` and MuJoCo Warp, trains with RSL-RL, and ships paired `sim/` and `real/` robot packages for the SO-101, the i2rt YAM, the Trossen WXAI and the Unitree G1. The JAX and MJX environments of the paper remain under an `rss2025` directory.**
- Location: mujoco_playground at tag v1.0.1: `mujoco_playground/docs/changelog.rst`, "Version 1.0.0 (November 6, 2026)"; README first paragraph and note.
- Verdict: NEW (the seed describes Playground only through the February 2025 paper)
- Evidence: https://github.com/google-deepmind/mujoco_playground/tree/084e7957842792725d70866ee840d8fd79f17bbe (tag v1.0.1) | Tier 1, first-party repository at a pinned tag | documentation of support | "Rebuilt on `reaf-sim` (`reaf.simulation.torch`) and MuJoCo Warp with declarative `flat_scene` environments, paired `sim/` and `real/` robot packages (SO-101, YAM, Trossen WXAI, Unitree G1), RSL-RL training, teleop, `mujoco.sysid`, and sim-to-real deployment." README: "MuJoCo Playground is a suite of robot environments, reinforcement learning tasks, and hardware workflows written in PyTorch and built on `reaf-sim`, MuJoCo, and MuJoCo Warp." and "Looking for the original RSS 2025 JAX/MJX environments? They remain available under `rss2025`." (accessed 2026-11-20)
- Use in dive: section 12 and section 14. The single most relevant freshness finding of this stream: two weeks before this research, Google DeepMind shipped an SO-101 pick-cube environment with a sim-to-real deployment path. The dive's thread task has a first-party simulation.

**F06-26. Playground 1.0 includes `SO101PickCubeVision`: a vision policy trained in simulation to pick up a cube and deployed "zero-shot onto the real robot", with the same task code running in simulation (`--mode=sim`) and on the physical follower arm (`--mode=real`). No success rate is published for it; the README says it was "tested on 3 different robot setups under various lighting conditions" and warns of a remaining visual gap under dark shadows.**
- Location: `mujoco_playground/tasks/manipulation/pick_cube/so101/deploy/README.md` at v1.0.1, title line and "Hardware Behavior & Useful Flags".
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco_playground/blob/084e7957842792725d70866ee840d8fd79f17bbe/mujoco_playground/tasks/manipulation/pick_cube/so101/deploy/README.md | Tier 1, first-party repository at a pinned tag | documentation of support | "Train a visual policy to pick up a cube in sim and deploy zero-shot onto the real robot." ... "We tested on 3 different robot setups under various lighting conditions, but there may still be visual domain gap with darker shadows. If you see this, make sure the lighting conditions prevent darker shadows, or help submit a more robust domain randomization recipe for the pixels inputs!" (accessed 2026-11-20)
- Use in dive: section 14, the worked sim-to-real case on the reader's own arm, with an honest statement of the residual appearance gap. The success rate is UNKNOWN (U3). Note the task is pick-a-cube, not pick-and-place-in-a-cup.

**F06-27. The SO-101 vision task runs its policy at 10 Hz (`control_timestep = 0.1`), renders one 64x64 wrist-camera image per policy step, and injects a random command delay of 0 to 4 ms.**
- Location: `mujoco_playground/tasks/manipulation/pick_cube/so101/task.py` at v1.0.1, function `so101_pick_cube_pixels_env` (lines 300 to 400) and the `control_delay` processor (lines 138 to 143).
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco_playground/blob/084e7957842792725d70866ee840d8fd79f17bbe/mujoco_playground/tasks/manipulation/pick_cube/so101/task.py | Tier 1, code at a pinned tag | code behaviour | "cfg.sim.control_timestep = 0.1  # 10 Hz control frequency" ... "width=64, height=64, render_rate_hz=render_rate_hz" ... "processors.StochasticSubstepCommands, keys=\"robot/ctrl\", delay=(0.000, 0.004)" (accessed 2026-11-20)
- Use in dive: section 14, the timing part of the gap handled in code: the simulator delays commands by a random amount because the real serial bus does. Section 13: a sim-trained vision policy can work from a 64x64 image, which is why low-fidelity batch rendering is enough for this class of task. The physics timestep used by this environment was not read (U4).

**F06-28. What the SO-101 task randomises per episode, read from the code: fingertip friction, actuator PD gains, joint damping, cube size, cube and floor colours (kept high-contrast), robot link colours, robot base height by plus or minus 2.5 mm, joint-reading calibration bias, lighting and camera parameters, plus per-pixel image noise.**
- Location: same file, `_configure_so101_robot` (lines 93 to 110) and the resetters block (lines 405 to 530).
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco_playground/blob/084e7957842792725d70866ee840d8fd79f17bbe/mujoco_playground/tasks/manipulation/pick_cube/so101/task.py | Tier 1, code at a pinned tag | code behaviour | comments in the code: "# Randomize fingertip sliding, torsional, and rolling friction coefficients." "# Scale proportional (kp) and derivative (kd) PD gains across robot actuators." "# Scale passive joint damping across all robot degrees of freedom." "# Randomize target cube half-extents." "# Per-scenario bias that mimics off-calibrated robots, plus step-wise noise." "# Randomize robot base z-height at startup for mounting height offsets." "# Randomize all robot link RGB colors on episode reset." "# Randomize floor and cube RGB colors on reset with high visual contrast." "# Activates camera domain randomization." and "pixel_noise_std=0.02" (accessed 2026-11-20)
- Use in dive: section 14, domain randomisation on the arm task as a concrete list, in three groups the section teaches: physics (friction, gains, damping), appearance (colours, light, camera, pixel noise), and calibration and timing (joint bias, base height, command delay).

**F06-29. Calibration is a named source of the gap on this arm: the deploy README says manual middle-pose calibration "can easily be off by 1-2+ cm in end-effector height", which is why the task trains with a per-episode calibration bias.**
- Location: deploy README at v1.0.1, "Hardware Behavior & Useful Flags".
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco_playground/blob/084e7957842792725d70866ee840d8fd79f17bbe/mujoco_playground/tasks/manipulation/pick_cube/so101/deploy/README.md | Tier 1, first-party repository at a pinned tag | production report | "Manual middle-pose calibration on the physical SO101 arm can easily be off by 1-2+ cm in end-effector height. `SO101PickCubeVision` trains with per-episode calibration bias randomization to tolerate moderate calibration error, but larger offsets will eventually degrade grasp success or cause the robot to slam the table" (accessed 2026-11-20)
- Use in dive: section 14, a gap the reader would not guess: the simulator's arm knows where its gripper is; the real one is 1 to 2 cm off after a hand calibration, on a task where the cube is a few centimetres across.

**F06-30. System identification for the SO-101 is a shipped script: `mujoco.sysid` fits 24 parameters (armature, friction loss, stiffness and damping for each of the 6 joints) from one teleoperated excitation episode logged to MCAP, by Gauss-Newton least squares on the tracking error between measured and simulated rollouts. It also estimates the serial command transport delay.**
- Location: `mujoco_playground/tasks/sysid/so101/README.md` at v1.0.1.
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco_playground/blob/084e7957842792725d70866ee840d8fd79f17bbe/mujoco_playground/tasks/sysid/so101/README.md | Tier 1, first-party repository at a pinned tag | documentation of support | "The optimizer fits a 24-parameter model (`armature`, `frictionloss`, `stiffness`, `damping` for all 6 joints) from teleoperation MCAP logs by minimizing rollout tracking error in MuJoCo physics." ... "1. Estimate and log the serial command transport delay (t_1 - t_0). 2. Align control times with measurement physics rollouts. 3. Run Gauss-Newton least squares optimization on the 24 dynamic parameters. 4. Generate an interactive HTML report." (accessed 2026-11-20)
- Use in dive: section 14, the mechanism of system identification in one paragraph: move the real arm, replay the same commands in simulation, adjust the simulated motor parameters until the two joint traces overlap. The formula is a least-squares fit: choose parameters theta to minimise the sum over time of (measured joint angle minus simulated joint angle under theta) squared.

**F06-31. The identified SO-101 servo parameters are checked into the repository: position gains (stiffness) between 218 and 265, damping between 17.5 and 34.2, armature between 0.109 and 0.199, and a torque limit computed from the STS3215's stall torque of 30 kg-cm at 12 V (2.94 N m). Friction loss is near zero on five joints and 0.25 on the gripper.**
- Location: `mujoco_playground/robots/so101/sim/constant.py` at v1.0.1, lines 25 to 64.
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco_playground/blob/084e7957842792725d70866ee840d8fd79f17bbe/mujoco_playground/robots/so101/sim/constant.py | Tier 1, code at a pinned tag | code behaviour | "# Position servo PD gains identified from real teleop data." "STIFFNESS = { \"shoulder_pan\": 251.5896, \"shoulder_lift\": 265.0958, \"elbow_flex\": 243.9844, \"wrist_flex\": 223.2804, \"wrist_roll\": 218.4066, \"gripper\": 223.3508, }" ... "FORCERANGE = 30 * 9.81 / 100  # STS3215 stall torque: 30 kg-cm @ 12V." (accessed 2026-11-20). [derived]: 30 x 9.81 / 100 = 2.943 N m.
- Use in dive: section 14, real numbers for the actuator model of a cheap servo. The servo is modelled as a spring-damper pulling the joint toward the commanded angle, capped at 2.94 N m: torque = kp x (target - angle) - kd x velocity, clipped to the limit.

**F06-32. The 2025 Playground paper's throughput table, on one NVIDIA A100 with PPO: PandaPickCube 140,386 environment steps per second, AlohaSinglePegInsertion 121,119, LeapCubeReorient 76,354, PandaPickCubeCartesian (the vision variant's physics) 38,015. These figures are for the JAX and MJX code that 1.0 moved to `rss2025`. [author reported]**
- Location: arXiv 2502.08844v1, Appendix C.3, Table IX.
- Verdict: CARRIED (seed 02 section 3.2, re-fetched)
- Evidence: https://arxiv.org/abs/2502.08844v1 | Tier 3, preprint (the repository calls these the "RSS 2025" environments; venue not confirmed here) | benchmark claim (author reported) | "PandaPickCube 140386 +- 1707", "AlohaSinglePegInsertion 121119 +- 2159", "LeapCubeReorient 76354 +- 143", "PandaPickCubeCartesian 38015 +- 5302"; caption "Training throughput is displayed for all the Manipulation environments on an A100 GPU device across 5 seeds using brax PPO" (accessed 2026-11-20)
- Use in dive: section 12, labelled history for scale: training throughput, physics plus policy update, on a 2020-generation data-centre GPU. Not a statement about Playground 1.0, whose throughput is not published (U5).

**F06-33. With a camera, the same paper measured 403,000 environment steps per second for Cartpole and 37,000 for the Franka pick task (MJX physics plus Madrona batch rendering, one RTX 4090). In its time breakdown for the Franka task, physics is 24% of training time, rendering 18%, policy inference 1% and the policy update 57%. [author reported]**
- Location: arXiv 2502.08844v1, Section IV.D.1 and Appendix D.3, Tables X and XI.
- Verdict: CARRIED (seed 02 section 3.2, re-fetched) with the breakdown added
- Evidence: https://arxiv.org/abs/2502.08844v1 | Tier 3, preprint | benchmark claim (author reported) | "By pairing MJX physics with Madrona batch rendering, our Cartpole and Franka environments unroll at roughly 403,000 and 37,000 steps per second respectively. Note that our Franka physics are over 20x more costly than Cartpole's". Table XI, PandaPickCubeCartesian: "Time/Env Step (s) 1.56 x 10^-5 [physics] 1.15 x 10^-5 [rendering] 6.45 x 10^-7 [inference] 3.62 x 10^-5 [policy update]; Fraction 0.24 0.18 0.01 0.57"; "Results averaged over 5 runs on an RTX4090." (accessed 2026-11-20)
- Use in dive: section 13, the cost of adding a camera, and a correction to intuition: with a small image and a small network, the learner's gradient step is the largest cost, the renderer the smallest of the three big ones.

**F06-34. The Madrona batch renderer used in that paper has two back ends: "a software-based batch ray tracer written in CUDA (used for the experiments in this work) and a Vulkan-based rasterizer". The vision pick task trained in ten minutes on one RTX 4090 and succeeded in 12 of 12 real trials on a Franka arm from a 64x64 image. [author reported]**
- Location: arXiv 2502.08844v1, Section III and Section IV.C (pick-cube from pixels).
- Verdict: CARRIED (seed 02 section 3.1, re-fetched)
- Evidence: https://arxiv.org/abs/2502.08844v1 | Tier 3, preprint | definition and benchmark claim (author reported) | "Madrona provides two rendering backends: a software-based batch ray tracer written in CUDA (used for the experiments in this work) and a Vulkan-based rasterizer." ... "The policy receives a 64 x 64 RGB image as input" ... "Training in simulation takes ten minutes on a single RTX 4090." ... "Our policy achieves a 100% success rate in 12 real-world trials" (accessed 2026-11-20)
- Use in dive: section 13, a ray tracer that is plain CUDA code. Section 16: 12 of 12 is a small sample; its 95% Wilson interval is 76% to 100% [derived, see teaching material], a ready example of why trial counts matter.

### E. The SO-101 in simulation: what models exist and where

**F06-35. TheRobotStudio's own repository carries the SO-101 simulation files under `Simulation/SO101`: URDF and MuJoCo MJCF for the follower in two calibration conventions (`so101_new_calib.urdf` and `.xml`, `so101_old_calib.urdf` and `.xml`), variants with a wrist camera (`so101_new_calib_camera.urdf` and `.xml`), a `scene.xml`, and a leader-arm URDF. They were generated from the Onshape CAD with onshape-to-robot. No USD file is in that directory.**
- Location: TheRobotStudio/SO-ARM100 at commit 141aea7bcac2744d92998e30268c413202a56f96, `Simulation/SO101/` listing and `Simulation/SO101/README.md`.
- Verdict: NEW
- Evidence: https://github.com/TheRobotStudio/SO-ARM100/tree/141aea7bcac2744d92998e30268c413202a56f96/Simulation/SO101 | Tier 1, first-party repository at a pinned SHA | documentation of support | "This repository contains the URDF and MuJoCo (MJCF) files for the SO101 robot." ... "The robot model files were generated using the onshape-to-robot plugin from a CAD model designed in Onshape." ... "Base collision meshes were removed due to problematic collision behavior during simulation and planning." (accessed 2026-11-20)
- Use in dive: section 12, where the reader gets the arm's model file. Yes, there is an official MJCF and URDF.

**F06-36. Two caveats the hardware vendor states about its own model: the motor parameters "are adapted from the Open Duck Mini project" (not measured on this arm), and LeRobot's gripper convention (0 closed, 100 open, linear) "is not yet reflected in the current URDF and MuJoCo files".**
- Location: `Simulation/SO101/README.md`, "Motor Parameters" and "Gripper Note".
- Verdict: NEW
- Evidence: https://github.com/TheRobotStudio/SO-ARM100/blob/141aea7bcac2744d92998e30268c413202a56f96/Simulation/SO101/README.md | Tier 1, first-party repository at a pinned SHA | documentation of support | "Motor properties for the STS3215 motors used in the robot are adapted from the Open Duck Mini project." ... "In LeRobot, the gripper is represented as a linear joint, where: 0 = fully closed, 100 = fully open. This mapping is not yet reflected in the current URDF and MuJoCo files." (accessed 2026-11-20)
- Use in dive: section 14, why a downloaded model is a starting point: borrowed motor constants are exactly what system identification replaces (F06-30, F06-31).

**F06-37. MuJoCo Menagerie, DeepMind's curated model library, has a `robotstudio_so101` package (Apache 2.0) derived from the vendor's `so101_new_calib.xml`: floats rounded, integrator switched to `implicitfast`, primitive collision shapes added for gripper and arm, contact solver defaults tuned for manipulation, a camera mount added. It also still carries the older `trs_so_arm100` (SO-100).**
- Location: google-deepmind/mujoco_menagerie at commit 370c43965323c0944b433b202aac5058b5f907a9, `robotstudio_so101/README.md`, "MJCF derivation steps".
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco_menagerie/tree/370c43965323c0944b433b202aac5058b5f907a9/robotstudio_so101 | Tier 1, first-party repository at a pinned SHA | documentation of support | "1. Copied `so101_new_calib.xml` (commit SHA aec17bbc256d1a7342d53aaa4950595d4c30b40d). 2. Rounded floats and reformatted the XML for readability. 3. Switched to implicitfast. 4. Use default `forcerange` for actuators rather than 3.35 N/m. 5. Added primitive collision geometries for the gripper and arm. 6. Add default collision solver parameters for the gripper that work well for manipulation. 7. Add a camera mount." (accessed 2026-11-20)
- Use in dive: section 12, the recommended starting file, and a mechanism point: collision uses simple boxes and capsules while the picture uses the detailed mesh. Two geometries per link, one for physics, one for the camera.

**F06-38. LeRobot v0.7.0 has no SO-101 simulator of its own. Its simulation layer wraps external benchmarks (LIBERO, LIBERO-plus, Meta-World, RoboCasa, RoboCerebra, RoboLab, RoboMME, RoboTwin, VLABench, and EnvHub repositories) behind one interface, and a `sim` robot type that lets a simulated environment stand in for a real robot; an SO-101 leader can teleoperate "an SO-101 twin" when the environment declares matching action names.**
- Location: huggingface/lerobot at tag v0.7.0: `src/lerobot/sim/integrations/` listing; `docs/source/simulation.mdx`, "Run a sim robot".
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/docs/source/simulation.mdx | Tier 1, first-party docs at a pinned tag | documentation of support | "A sim robot is a robot: swap `--robot.type=sim --robot.env.*` for the real follower's `--robot.*`, and everything else stays. A teleoperator drives it as it drives the real follower (`--teleop.type=so101_leader` for an SO-101 twin), when the environment declares the follower's action names and units" (accessed 2026-11-20)
- Use in dive: sections 12 and 16. For an SO-101 twin under LeRobot the environment comes from outside (an EnvHub repository such as LeIsaac, or Playground); LeRobot supplies the plumbing. Whether a specific EnvHub SO-101 environment is current was not verified (U6).

### F. Newton

**F06-39. Newton is "a GPU-accelerated physics simulation engine built upon NVIDIA Warp" that "integrates MuJoCo Warp as its primary backend". It is a Linux Foundation project, Apache 2.0, "initiated by Disney Research, Google DeepMind, and NVIDIA".**
- Location: newton-physics/newton README at tag v1.8.0, first paragraphs.
- Verdict: CARRIED (seed 02 section 3.2, re-fetched from the repository instead of the NVIDIA blog)
- Evidence: https://github.com/newton-physics/newton/tree/425db81f01e402b51f96f560e154d529d645c6de (tag v1.8.0, README.md) | Tier 1, first-party repository at a pinned tag | definition | "Newton is a GPU-accelerated physics simulation engine built upon NVIDIA Warp, specifically targeting roboticists and simulation researchers. Newton extends and generalizes Warp's (deprecated) `warp.sim` module, and integrates MuJoCo Warp as its primary backend." ... "Newton is a Linux Foundation project that is community-built and maintained. Code is licensed under Apache-2.0." ... "Newton was initiated by Disney Research, Google DeepMind, and NVIDIA." (accessed 2026-11-20)
- Use in dive: section 12, simulator table and the family tree: Warp (NVIDIA's Python-to-CUDA kernel compiler) underneath, MuJoCo Warp as the rigid-body solver, Newton as the engine that adds other solvers and OpenUSD around it, Isaac Lab on top.

**F06-40. Newton's newest release is v1.8.0, published on GitHub 2026-11-11 (its changelog heading says 2026-11-12). It is past 1.0: the v1.0.0 tag was published 2026-04-13, and there have been eight feature releases since. Individual solvers inside it are still labelled experimental.**
- Location: GitHub releases list of newton-physics/newton; v1.8.0 release body, "Highlights".
- Verdict: NEW. The seed gave "Newton 1.0 GA (GTC, 2026-03-16)"; the GitHub tag for v1.0.0 is dated 2026-04-13 (see Contradictions).
- Evidence: https://github.com/newton-physics/newton/releases/tag/v1.8.0 | Tier 1, release notes | documentation of support | "Newton v1.8.0 is a feature release following v1.7.0. It introduces the experimental Steel solver for articulated rigid bodies and adds routed tendons and richer deformable simulation and rendering." Release list (GitHub API, published_at): v1.8.0 2026-11-11, v1.7.0 2026-10-14, v1.6.1 2026-10-05, v1.0.0 2026-04-13 (accessed 2026-11-20)
- Use in dive: section 12, "is it beta or generally available": the engine is released and versioned; treat a solver as production only if its docs do not say experimental.

**F06-41. Newton v1.8.0 adds an experimental rigid-body solver, Steel, "developed in collaboration with Skild AI", that "targets high-throughput, memory-efficient simulation for contact-rich reinforcement learning" with a matrix-free projected Gauss-Seidel solver. The release prints no throughput figure for it.**
- Location: v1.8.0 release body, "Highlights", first bullet.
- Verdict: NEW
- Evidence: https://github.com/newton-physics/newton/releases/tag/v1.8.0 | Tier 1, release notes | documentation of support | "New experimental solver: SolverSteel. Developed in collaboration with Skild AI, Steel targets high-throughput, memory-efficient simulation for contact-rich reinforcement learning. Its matrix-free projected Gauss-Seidel solver handles environments containing multiple rigid bodies and articulations, with support for run-to-run determinism, island-based sleeping, and patch-based Coulomb friction." (accessed 2026-11-20)
- Use in dive: section 12, one line on where GPU physics is heading: solvers written for contact-rich manipulation at reinforcement-learning batch sizes, co-developed with a robot foundation-model company.

**F06-42. The benchmarks Newton publishes in its release notes are relative to its previous release, on a GH200 and a GeForce RTX 5080: batched inverse dynamics for 1,024 Franka arms "takes 49% less time on GH200 and 62% less on GeForce RTX 5080" against 1.7.0. No absolute steps-per-second table is in the release. [vendor claim]**
- Location: v1.8.0 release body, "Performance improvements".
- Verdict: NEW
- Evidence: https://github.com/newton-physics/newton/releases/tag/v1.8.0 | Tier 1, release notes | benchmark claim (vendor reported) | "Benchmarks against Newton 1.7.0 were run on Ubuntu 24.04 with CUDA 13.4 and an R615 driver, using each release's Warp version (1.18 and 1.19). Batched inverse dynamics. Evaluating mass matrices, gravity and Coriolis terms for 1,024 Franka arms takes 49% less time on GH200 and 62% less on GeForce RTX 5080." (accessed 2026-11-20)
- Use in dive: section 12 table, "published throughput" column for Newton: relative only. Absolute Newton numbers come through Isaac Lab's benchmark export (F06-47 to F06-49).

**F06-43. Newton's GPU floor is the Warp wheel's: with Warp 1.19, an NVIDIA Turing-generation GPU or newer (CUDA compute capability 7.5+) and driver R580+. No CUDA Toolkit install is needed; macOS runs on CPU only.**
- Location: README at v1.8.0, "Requirements".
- Verdict: NEW
- Evidence: https://github.com/newton-physics/newton/tree/425db81f01e402b51f96f560e154d529d645c6de | Tier 1, first-party repository at a pinned tag | documentation of support | "GPU: This release is tested with Warp 1.19, whose standard wheel requires an NVIDIA Turing GPU (compute capability 7.5+) and driver R580+ for CUDA acceleration." ... "No local CUDA Toolkit is required; macOS runs on CPU." (accessed 2026-11-20)
- Use in dive: section 12 and the machine-load notes: the requirement is a CUDA compute capability, with no mention of RTX or ray-tracing hardware. Physics on Newton is general GPU compute.

### G. Isaac Sim and Isaac Lab at their current versions

**F06-44. Isaac Sim's newest general-availability release is 6.2.0 (GitHub release 2026-10-14). A 7.0.0a1 alpha was tagged on 2026-09-18, and the repository's default branch is already `release/6.3`.**
- Location: GitHub releases list of isaac-sim/IsaacSim; v6.2.0 release body; repository metadata.
- Verdict: CARRIED (seed 02 section 3.1 named 6.2.0; re-fetched) with the alpha and branch added
- Evidence: https://github.com/isaac-sim/IsaacSim/releases/tag/v6.2.0 (tag commit 74a9356b20250dd60337d90b4b4d913c9454d32b) | Tier 1, release notes | documentation of support | "Isaac Sim 6.2.0 GA" (published_at 2026-10-14T03:05:54Z); release list also shows "v7.0.0a1 | 2026-09-18 | prerelease"; default branch "release/6.3" (accessed 2026-11-20)
- Use in dive: sections 12 and 13, version line. A 6.3 and a 7.0 are in flight; re-check before publishing.

**F06-45. Isaac Lab 3.0.0 became generally available on 2026-10-20. Its organising idea is one task API over several physics and rendering back ends: Newton (kit-less, on Warp), OV libraries (`OVPhysX` for PhysX and `OVRTX` for RTX rendering as standalone libraries) and Isaac Sim, which "remains the complete path when a workflow needs the full PhysX/RTX stack, ROS bridge, XR, livestreaming, or Kit tooling, but now fully optional".**
- Location: isaac-sim/IsaacLab release v3.0.0 body, opening section.
- Verdict: CARRIED (seed 02 section 3.1, re-fetched); the year the seed inferred is confirmed as 2026 by the API timestamp.
- Evidence: https://github.com/isaac-sim/IsaacLab/releases/tag/v3.0.0 (tag commit e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4, published_at 2026-10-20T02:05:51Z) | Tier 1, release notes | documentation of support | "Isaac Lab 3.0 is now generally available." ... "one task API across multiple physics, rendering, and visualization backends; kit-less execution with Newton and OV library backends" ... "Isaac Sim remains the complete path when a workflow needs the full PhysX/RTX stack, ROS bridge, XR, livestreaming, or Kit tooling, but now fully optional." ... "This release targets Isaac Sim 6.2, Python 3.12, PyTorch 2.11 with CUDA 13.0, NVIDIA Warp 1.17, Newton 1.6.1, and RSL-RL 5.5.1." (accessed 2026-11-20)
- Use in dive: section 12, the 2026 change in one sentence: Isaac Lab no longer requires Isaac Sim. Note the pin: Isaac Lab 3.0.0 bundles Newton 1.6.1, two feature releases behind Newton's own 1.8.0.

**F06-46. Isaac Lab 3.0 supports three physics back ends behind the same task code: Isaac Sim PhysX (through Omniverse Kit, TGS or PGS solver), Newton ("Warp-native simulation without Isaac Sim", with MJWarp and Kamino solvers for rigid robots, VBD for cloth and soft bodies, MPM for particles) and OvPhysX (PhysX without Kit).**
- Location: Isaac Lab docs at v3.0.0, `docs/source/concepts/physics_backends.rst`.
- Verdict: CARRIED (seed 02 section 3.1, re-fetched at the release tag)
- Evidence: https://github.com/isaac-sim/IsaacLab/blob/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/concepts/physics_backends.rst | Tier 1, first-party docs at a pinned tag | documentation of support | "Isaac Lab supports PhysX, Newton, and OvPhysX through shared asset, sensor, and scene APIs." ... "Newton runs on Warp without requiring Isaac Sim. Its solvers cover different simulation needs: MJWarp and Kamino for rigid robots, VBD for cloth and soft bodies, and MPM for particle materials." (accessed 2026-11-20)
- Use in dive: section 12, simulator table row for Isaac Lab and the answer to "which engines does Isaac Lab support now".

**F06-47. Isaac Lab's own release benchmark (2026-10-12 snapshot, 8,192 environments, one RTX PRO 6000 Blackwell Server Edition, RSL-RL), state-only tasks, training frames per second and mean GPU memory. Cartpole: Newton MJWarp 1,023,698 FPS at 0.93 GB; Isaac Sim PhysX 557,215 at 7.12 GB. Franka lift: Newton MJWarp 318,651 at 5.41 GB; Isaac Sim PhysX 164,777 at 14.74 GB. Franka reach: Newton MJWarp 549,161 at 1.74 GB; Isaac Sim PhysX 299,665 at 8.04 GB. [vendor claim]**
- Location: Isaac Lab at v3.0.0, `docs/source/_static/benchmarks/environment-performance-release.csv`, rows with `benchmark_date_utc` 2026-10-12, columns `total_fps_mean` and `vram_mean_gb`; method in `docs/source/_static/benchmarks/README.md`.
- Verdict: NEW
- Evidence: https://github.com/isaac-sim/IsaacLab/blob/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/_static/benchmarks/environment-performance-release.csv | Tier 1, first-party benchmark data at a pinned tag | benchmark claim (vendor reported) | README: "All plotted runs use 8,192 environments and the same single-GPU hardware." and "Each measured row supplies Collection FPS (rollouts and policy inference) and Training FPS (including policy updates)". Rows (task, physics, total_fps_mean, vram_mean_gb): "Isaac-Cartpole, newton_mjwarp, 1023697.60, 0.93"; "Isaac-Cartpole, isaacsim_physx, 557214.80, 7.12"; "Isaac-Lift-Franka, newton_mjwarp, 318650.60, 5.41"; "Isaac-Lift-Franka, isaacsim_physx, 164777.20, 14.74"; "Isaac-Reach-Franka, newton_mjwarp, 549161.20, 1.74"; "Isaac-Reach-Franka, isaacsim_physx, 299665.40, 8.04"; gpu_name "NVIDIA RTX PRO 6000 Blackwell Server Edition", gpu_memory_total_gb 94.97 (accessed 2026-11-20)
- Use in dive: section 12, the current-version throughput numbers for the table, on the GPU that AWS sells in G7e. Per-environment memory for the Franka lift task: 5.41 GB / 8192 = 0.66 MB on Newton, 14.74 GB / 8192 = 1.8 MB on PhysX [derived]. These are whole-process figures including the learner.

**F06-48. The same benchmark with one camera per environment. Cartpole with camera, training FPS and mean GPU memory: Newton MJWarp plus Newton Warp renderer 152,124 FPS at 57.3 GB; Newton plus OVRTX 127,990 at 60.7 GB; OvPhysX plus OVRTX 115,053 at 63.7 GB; Isaac Sim PhysX plus Isaac RTX 65,619 at 63.7 GB. Adding the camera cut Newton's Cartpole training throughput from 1,023,698 to 152,124, a factor of 6.7, and raised memory from 0.93 GB to 57.3 GB, a factor of 62. [vendor claim; ratios derived]**
- Location: same CSV, `Isaac-Cartpole-Camera` rows of 2026-10-12; presets per the README.
- Verdict: NEW
- Evidence: https://github.com/isaac-sim/IsaacLab/blob/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/_static/benchmarks/environment-performance-release.csv | Tier 1, first-party benchmark data at a pinned tag | benchmark claim (vendor reported) | rows (physics, renderer, total_fps_mean, collection_fps_mean, vram_mean_gb, preset): "newton_mjwarp, newton_renderer, 152123.90, 604030.55, 57.29, rgb"; "newton_mjwarp, ovrtx, 127990.40, 354140.23, 60.71, simple_shading_full_mdl"; "ovphysx, ovrtx, 115053.10, 269692.96, 63.73, simple_shading_full_mdl"; "isaacsim_physx, isaacsim_rtx, 65619.00, 98635.46, 63.73, simple_shading_full_mdl". README: "Camera comparisons use a single camera with `rgb` for the Newton renderer and `simple_shading_full_mdl` for OV RTX and Isaac Sim RTX" (accessed 2026-11-20). [derived]: 1,023,697.6 / 152,123.9 = 6.73; 57.29 / 0.93 = 61.6; 57.29 GB / 8192 = 7.0 MB per camera environment.
- Use in dive: section 13, the section's strongest number pair: one small camera per environment costs 6.7 times the throughput and 62 times the GPU memory. The camera, not the physics, sizes the GPU. The CSV's `camera_resolution` column is empty for these rows, so the image size behind the numbers is not stated in the export (U7).
- Wave 3 note (2026-11-20): the image size for these Cartpole rows is still not settled (task config 96 x 96, benchmark label 64): see F06-104. Keep "one small camera"; do not print a pixel count.

**F06-49. On a manipulation task with a 64-pixel camera (Kuka arm with Allegro hand lifting a cube, 8,192 environments, same GPU): Newton plus Newton Warp renderer 115,889 training FPS at 13.6 GB; Newton plus OVRTX 97,307 at 18.6 GB; Isaac Sim PhysX plus Isaac RTX 27,962 at 24.2 GB. The same task without a camera: Newton 220,831 at 7.2 GB; Isaac Sim PhysX 60,757 at 17.1 GB. [vendor claim]**
- Location: same CSV, `Isaac-Lift-KukaAllegro-Camera` and `Isaac-Lift-KukaAllegro` rows of 2026-10-12.
- Verdict: NEW
- Evidence: https://github.com/isaac-sim/IsaacLab/blob/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/_static/benchmarks/environment-performance-release.csv | Tier 1, first-party benchmark data at a pinned tag | benchmark claim (vendor reported) | rows: "Isaac-Lift-KukaAllegro-Camera, newton_mjwarp, newton_renderer, 115888.50, vram 13.61, presets cube,rgb64,single_camera"; "newton_mjwarp, ovrtx, 97306.60, vram 18.58, cube,simple_shading_full_mdl64,single_camera"; "isaacsim_physx, isaacsim_rtx, 27962.00, vram 24.22"; "Isaac-Lift-KukaAllegro, newton_mjwarp, none, 220831.00, vram 7.21"; "isaacsim_physx, none, 60756.60, vram 17.13" (accessed 2026-11-20)
- Use in dive: section 13, the manipulation-task version of F06-48: on a contact-heavy task the camera halves throughput (220,831 to 115,889, a factor of 1.9 [derived]) instead of dividing it by seven, because physics already dominates.
- Wave 3 note (2026-11-20): the "64-pixel camera" is one fixed base camera at 64 x 64 per environment, read from the `rgb64` and `simple_shading_full_mdl64` preset definitions at the tag: see F06-103. The Newton row renders RGB and the RTX rows render a shaded data type.

**F06-50. Isaac Lab 3.0 has three camera renderers. Newton Warp: "a lightweight, kit-less Warp ray tracer included in the base install", direct lighting only. OVRTX: "kit-less RTX rendering with path-traced and Minimal modes", the recommended RTX renderer. Isaac RTX: RTX inside Isaac Sim, labelled legacy. "In the release benchmarks, Newton Warp has the highest throughput, and OVRTX outperforms Isaac RTX."**
- Location: Isaac Lab docs at v3.0.0, `docs/source/concepts/renderers.rst`, "Choosing a renderer backend", "Renderer details", "Performance".
- Verdict: CARRIED (seed 02 section 3.1, re-fetched at the release tag)
- Evidence: https://github.com/isaac-sim/IsaacLab/blob/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/concepts/renderers.rst | Tier 1, first-party docs at a pinned tag | documentation of support | "OVRTX is the recommended RTX renderer. Isaac RTX is the legacy RTX renderer" ... "Warp ray tracing with direct lighting. Use it when camera throughput and memory matter more than material and lighting fidelity." ... "A lightweight, kit-less Warp ray tracer included in the base install. Pairs with Newton, OvPhysX, or Isaac Sim PhysX." ... "In the release benchmarks, Newton Warp has the highest throughput, and OVRTX outperforms Isaac RTX." (accessed 2026-11-20)
- Use in dive: section 13, the renderer menu and its trade: fidelity (reflections, transparency, indirect light) against throughput and memory.

**F06-51. The Isaac Lab 3.0 install guide states the hardware split directly: a Newton-only install needs "a CUDA-capable NVIDIA GPU" of Turing generation or newer, and "Headless Newton simulation does not require RTX hardware"; "RTX rendering has its own GPU and driver requirements"; "Isaac Sim's workstation memory requirements do not apply to a Newton-only installation."**
- Location: Isaac Lab docs at v3.0.0, `docs/source/isaaclab/installation.rst`, requirements table and "Optional Isaac Sim and rendering".
- Verdict: NEW. This is the first-party sentence behind what the seed called the "2026 exception" and marked as its own inference.
- Evidence: https://github.com/isaac-sim/IsaacLab/blob/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/isaaclab/installation.rst | Tier 1, first-party docs at a pinned tag | documentation of support | "GPU training - A CUDA-capable NVIDIA GPU supported by the selected Newton solver and PyTorch. The default CUDA 13 stack requires Turing or newer (compute capability 7.5+)." ... "Rendering: Headless Newton simulation does not require RTX hardware. Add the requirements of your chosen renderer or visualizer when you need camera images or an interactive view. RTX rendering has its own GPU and driver requirements." (accessed 2026-11-20)
- Use in dive: sections 12 and 13, the rule that decides the instance family. State-only physics on Newton: any CUDA GPU of compute capability 7.5 or higher. RTX rendering: an RTX GPU. The sentence covers headless simulation; whether the Newton Warp camera renderer is supported on a GPU without RT cores is not stated on this page (U8).

**F06-52. The Isaac Sim 6.2.0 requirements page carries the sentence "GPUs without RT Cores (A100, H100) are not supported." Its GPU tiers are GeForce RTX 4080 (minimum), GeForce RTX 5080 (good) and RTX PRO 6000 Blackwell (ideal), with 16 GB, 16 GB and 48 GB of VRAM, 32 GB, 64 GB and 64 GB of RAM, and 4, 8 and 16 CPU cores. Tested Linux driver 595.58.03.**
- Location: Isaac Sim docs 6.2.0, "Isaac Sim Requirements", table "Requirements for x86_64" and the note below it.
- Verdict: CARRIED (seed 02 section 3.1, re-fetched on the versioned 6.2.0 URL)
- Evidence: https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/requirements.html | Tier 1, first-party docs | documentation of support | "GPUs without RT Cores (A100, H100) are not supported." Table: "GPU | GeForce RTX 4080 | GeForce RTX 5080 | RTX PRO 6000 Blackwell"; "VRAM | 16GB | 16GB | 48GB"; "RAM | 32GB | 64GB | 64GB"; "Cores | 4 | 8 | 16"; footnote "GPUs with less than 16GB VRAM may be insufficient to run a complex scene rendering more than 16MP per frame." (accessed 2026-11-20)
- Use in dive: section 13, the exact sentence the section title rests on. The requirement itself did not change in 2026: the sentence is on the 6.2.0 page as it was on earlier ones. What changed is that Isaac Lab stopped requiring Isaac Sim (F06-45, F06-51).

**F06-53. On aarch64, Isaac Sim 6.2.0 supports only the NVIDIA DGX Spark (DGX OS 7, driver 580.159.03), and "the Isaac Sim container is only supported on Linux".**
- Location: same page, "Requirements for aarch64".
- Verdict: CARRIED (seed 02 section 3.1, re-fetched)
- Evidence: https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/requirements.html | Tier 1, first-party docs | documentation of support | "Isaac Sim aarch64 builds are currently only supported on DGX Spark system." (accessed 2026-11-20)
- Use in dive: section 13, practical note for a reader with a DGX Spark on the desk; no Graviton path for Isaac Sim.

**F06-54. Isaac Lab 3.0.0 ships an SO-101 asset and tasks: `SO101_CFG` loads a USD (`so101_new_calib.usda`, in a directory named `so101_new_calib_SysID`) whose physics variant holds system-identified actuator parameters for Newton MJWarp and a separate `physx` variant; contributed tasks cover cube stacking and keyboard typing.**
- Location: Isaac Lab at v3.0.0, `source/isaaclab_assets/isaaclab_assets/robots/so101.py` (module docstring and `SO101_CFG`); task directories `source/isaaclab_tasks/isaaclab_tasks/contrib/stack/config/so101/` and `contrib/keyboard/`.
- Verdict: NEW
- Evidence: https://github.com/isaac-sim/IsaacLab/blob/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/source/isaaclab_assets/isaaclab_assets/robots/so101.py | Tier 1, code at a pinned tag | code behaviour | "The SO-101 is a low-cost 5-DOF arm (`shoulder_pan`, `shoulder_lift`, `elbow_flex`, `wrist_flex`, `wrist_roll`) plus a single revolute `gripper` jaw. Because the arm has only 5 actuated DOF, it cannot achieve an arbitrary 6-DOF end-effector pose" ... "The default actuator parameters are authored in the USD. Multi-backend tasks select the `physx` physics variant for PhysX and the SysID `physics` variant for Newton MJWarp." ... "usd_path=(f\"{ISAAC_NUCLEUS_DIR}/Robots_Multiphysics/RobotStudio/so101_new_calib_SysID/so101_new_calib.usda\")" (accessed 2026-11-20)
- Use in dive: section 12, the SO-101 exists as USD too, served from NVIDIA's asset store and referenced by Isaac Lab. Section 14: the asset's name says its motor parameters were identified from hardware.

**F06-55. NVIDIA documents an SO-101 sim-to-real project built on Isaac Lab 3.0: a follower arm trained in simulation (Newton's MJWarp solver, PPO through RSL-RL) to press keys on a keyboard, then run on hardware through LeRobot. The policy uses a fixed key-position map and no camera; "hardware inference does not require Isaac Sim or a GPU". No success rate is given on the page.**
- Location: Isaac Lab docs at v3.0.0, `docs/source/policy_deployment/06_so101_typing/so101_typing_policy.rst`.
- Verdict: NEW
- Evidence: https://github.com/isaac-sim/IsaacLab/blob/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/policy_deployment/06_so101_typing/so101_typing_policy.rst | Tier 1, first-party docs at a pinned tag | documentation of support | "The SO-101 typing project trains an SO-101 follower to press letters on a fixed Logitech MX Keys keyboard with its typing jaw, then runs the learned policy on hardware through LeRobot." ... "An Isaac Lab typing environment using Newton's MJWarp solver and configurable actuator models, with PPO training and evaluation through RSL-RL." ... "Tools to measure the fixture and fit the simulated keyboard pose and joint-angle calibration from recorded real key presses." ... "The policy uses a fixed A-Z key-position map without camera input; it cannot adjust to a moved keyboard." ... "Hardware inference does not require Isaac Sim or a GPU." (accessed 2026-11-20)
- Use in dive: section 14, a second first-party SO-101 sim-to-real result from 2026 (with F06-26). Both lean on calibration fitted from real data, which is real-to-sim in its smallest form. Results in numbers were not located (U3).

### H. Rendering: rasterisation, ray tracing and which GPUs have RT cores

Quotes from nvidia.com product and developer pages in this section were extracted by the fetch tool from the rendered page; re-read the page before quoting them in the app.

**F06-56. NVIDIA's own definitions: "Rasterization is a technique used to display three-dimensional objects on a two-dimensional screen", fast at deciding what is visible; "Ray tracing is a rendering technique that can realistically simulate the lighting of a scene and its objects by rendering physically accurate reflections, refractions, shadows, and indirect lighting."**
- Location: NVIDIA Developer, "Ray Tracing" discover page (undated; its references are from 2018).
- Verdict: NEW (concept definition; an undated first-party explainer)
- Evidence: https://developer.nvidia.com/discover/ray-tracing | Tier 2, first-party vendor explainer | definition | "Rasterization can determine visible objects and render many areas of a scene well and with high performance." ... "Ray tracing is best utilized for rendering physically accurate reflections, refractions, and shadows." (accessed 2026-11-20)
- Use in dive: section 13, the plain-words idea. Rasterisation projects each triangle onto the image and fills the pixels it covers. Ray tracing goes the other way: for each pixel, follow a ray into the scene and find what it hits, then follow more rays toward lights and reflections.

**F06-57. What an RT core is, in NVIDIA's words: hardware that accelerates traversal of the bounding-volume hierarchy (BVH), the tree a ray tracer walks to find which triangle a ray hits, "the most time consuming part of the ray tracing calculations".**
- Location: same page, hardware section.
- Verdict: NEW
- Evidence: https://developer.nvidia.com/discover/ray-tracing | Tier 2, first-party vendor explainer | definition | "RT Cores that accelerate BVH traversal, the most time consuming part of the ray tracing calculations." and "Bounding Volume Hierarchy (BVH) is a popular ray tracing acceleration technique" (accessed 2026-11-20)
- Use in dive: section 13, the mechanism in one sentence, and the hinge of the whole section: BVH traversal can run on RT cores (through OptiX or the RTX renderer) or as ordinary CUDA code on the general compute cores (Warp's BVH, Madrona's ray tracer). The first needs an RTX GPU; the second does not ask for one.

**F06-58. RT core counts on the GPUs AWS sells in its G families, from NVIDIA's product pages: A10 (the G5's A10G is its AWS variant) 72 RT cores, 24 GB; L40S (G6e) 142 third-generation RT cores, 48 GB; RTX PRO 6000 Blackwell Server Edition (G7e) 188 fourth-generation RT cores, 96 GB. The L4 (G6) page describes "third-generation RT Cores" and 24 GB but prints no count.**
- Location: NVIDIA product pages for A10, L4, L40S and RTX PRO 6000 Blackwell Server Edition, specification tables.
- Verdict: NEW
- Evidence: https://www.nvidia.com/en-us/data-center/products/a10-gpu/ ("72 RT Cores", "24GB GDDR6"); https://www.nvidia.com/en-us/data-center/l4/ ("With third-generation RT Cores and AI-powered NVIDIA Deep Learning Super Sampling 3 (DLSS 3)", "GPU memory | 24GB"); https://www.nvidia.com/en-us/data-center/l40s/ ("NVIDIA Third-Generation RT Cores" "142", "48GB GDDR6 with ECC"); https://www.nvidia.com/en-us/data-center/rtx-pro-6000-blackwell-server-edition/ ("NVIDIA RT Cores" "188 (4th Gen)", "96 GB GDDR7") | Tier 1, first-party product specifications | documentation of support | quotes as given (accessed 2026-11-20)
- Use in dive: section 13, the hardware table. The mapping of GPU to AWS instance family is from the AWS post in F06-60; the A10G-specific datasheet was not fetched (the A10 page is the nearest first-party source).

**F06-59. NVIDIA's H100 and H200 product pages do not mention RT cores, ray tracing or rendering in their content or specification tables. The H100 table lists 80 GB or 94 GB of memory and 7 NVDEC plus 7 JPEG decoders; the H200 table lists 141 GB.**
- Location: NVIDIA H100 and H200 product pages, specification tables.
- Verdict: NEW. An absence on a page is weak evidence by itself; the positive statement is F06-52 (Isaac Sim) and F06-60 (AWS).
- Evidence: https://www.nvidia.com/en-us/data-center/h100/ and https://www.nvidia.com/en-us/data-center/h200/ | Tier 1, first-party product specifications | documentation of support | H100: "GPU Memory | 80GB | 94GB", "Decoders | 7 NVDEC 7 JPEG"; H200: "GPU Memory | 141GB"; no occurrence of "RT Cores" in either page's product content (accessed 2026-11-20)
- Use in dive: section 13, supporting evidence only. The A100 and B200 pages were not fetched (U9).

**F06-60. AWS states the rule for its instance families (post of 2026-06-09): the Omniverse RTX Renderer "requires GPUs with hardware RT Cores"; G5 (A10G), G6 (L4), G6e (L40S) and G7e (RTX PRO 6000) are compatible; P4d, P4de, P5, P5e, P5en, P6-B200, P6-B300 and P6e-GB200 (A100, H100, H200, B200, B300, GB200) are not. The post was written against Isaac Sim 5.1.**
- Location: AWS Machine Learning Blog, "Scale Robot Reinforcement Learning with NVIDIA Isaac Lab on Amazon SageMaker AI", section "GPU instance compatibility" and its table.
- Verdict: CARRIED (seed 02 section 3.1, re-fetched), with one caution added: it predates Isaac Lab 3.0.
- Wave 2 (2026-11-20, SCOPE NARROWER): The list G5, G6, G6e, G7e is the AWS post's list as of June 2026. EC2 G7 (RTX PRO 4500 Blackwell Server Edition, 32 GB, "4th Gen RT Cores" on the AWS G7 page; F05-66, F08-58) is a further RT-core family the post does not list.
- Evidence: https://aws.amazon.com/blogs/machine-learning/scale-robot-reinforcement-learning-with-nvidia-isaac-lab-on-amazon-sagemaker-ai/ | Tier 2, first-party vendor blog (AWS), dated 09 JUN 2026 | documentation of support | "Isaac Sim is built on NVIDIA Omniverse and uses the Omniverse RTX Renderer, which requires GPUs with hardware RT Cores. The G family of AWS GPU instances is suitable for Isaac Lab workloads. The P family is not, because it uses data center GPUs without RT Cores. See the Isaac Sim 5.1 requirements page for the full list of supported and unsupported hardware." Table: "ml.g5 NVIDIA A10G (Ampere) Yes; ml.g6 NVIDIA L4 (Ada Lovelace) Yes; ml.g6e NVIDIA L40S (Ada Lovelace) Yes; ml.g7e NVIDIA RTX PRO 6000 (Blackwell) Yes; ml.p4d, ml.p4de, ml.p5, ml.p5e, ml.p5en, ml.p6-b200, ml.p6-b300, ml.p6e-gb200 NVIDIA A100 (Ampere), H100 / H200 (Hopper), B200 / B300 / GB200 (Blackwell) No" (accessed 2026-11-20)
- Use in dive: section 13, the first-party source for "data-centre training GPUs lack RT cores", mapped to instance families. Scope it correctly: the sentence "The P family is not [suitable for Isaac Lab workloads]" was true of Isaac Lab on Isaac Sim 5.1. Since Isaac Lab 3.0 (2026-10-20), headless Newton simulation "does not require RTX hardware" (F06-51), so the rule is now about RTX rendering, not about Isaac Lab as a whole [our reading].

**F06-61. MuJoCo's built-in renderers are rasterisers. The classic renderer uses OpenGL, with three context options on Linux: "GLX for rendering to an X11 window, OSMesa for headless software rendering, and EGL for hardware accelerated headless rendering". The newer Filament renderer supports OpenGL, Vulkan, Metal and WebGL and can run headless.**
- Location: MuJoCo docs at 4.0.1, Programming chapter, Rendering (`doc/programming/rendering.rst`), introduction and "OpenGL rendering".
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/programming/rendering.rst | Tier 1, first-party docs at a pinned tag | documentation of support | "MuJoCo provides two built-in 3D rendering backends that support both interactive onscreen viewers and headless offscreen rendering" ... "Filament rendering (mjrf): A modern, physically-based rendering (PBR) engine supporting OpenGL, Vulkan, Metal, and WebGL." ... "On Linux, MuJoCo currently supports GLX for rendering to an X11 window, OSMesa for headless software rendering, and EGL for hardware accelerated headless rendering." (accessed 2026-11-20)
- Use in dive: section 13, renderers that need no RT cores, case 1: a rasteriser. EGL runs on any GPU with an OpenGL driver; OSMesa runs on the CPU with no GPU at all. This is what a LeRobot or LIBERO evaluation container uses ("The container requires Docker GPU access for EGL rendering", LeRobot v0.7.0 simulation docs).

**F06-62. MuJoCo Warp's default camera renderer is a software ray tracer on Warp's BVH (`backend="warp"`). On the default branch after 4.0.1, the docs add an optional OptiX back end, "available on NVIDIA RTX GPUs", and say that when OptiX is unavailable MuJoCo Warp "warns and falls back to backend=\"warp\"". The fallback is the first-party evidence that the Warp path does not depend on RTX hardware.**
- Location: MuJoCo docs, MuJoCo Warp chapter, "Batch Rendering" and "OptiX Backend" (`doc/mjwarp/index.rst` at default-branch commit 23c23e0; the OptiX section is absent at tag 4.0.1).
- Verdict: CARRIED (seed 02 section 3.1, re-fetched), with the seed's open question narrowed: the fallback sentence exists; a sentence naming A100, H100 or B200 as supported does not (U8).
- Evidence: https://github.com/google-deepmind/mujoco (repository root; file `doc/mjwarp/index.rst` read at commit 23c23e0dc1643e99bb2a0abaf5dc4cf873e0bd77) | Tier 1, first-party docs at a pinned SHA | documentation of support | "An optional hardware-accelerated ray-casting backend built on warp-optix is available on NVIDIA RTX GPUs." ... "Pass backend=\"optix\" to mjw.create_render_context (or --render_backend=optix to testspeed). If OptiX is unavailable or the scene uses unsupported features (such as flexes or 3D Gaussian splats), MJWarp warns and falls back to backend=\"warp\"." (accessed 2026-11-20)
- Use in dive: section 13, renderers that need no RT cores, case 2: a ray tracer written as GPU compute kernels. Newton's default-branch docs describe the same split for its camera sensor ("Installing newton[optix] enables experimental OptiX ray tracing with backend=\"optix\"", `docs/concepts/sensors.rst` at commit 9bd0215d9c82508ea8d759c41df1b4577423d6ea; not in v1.8.0).

**F06-63. Isaac Lab's high-fidelity "USD camera" runs out of memory beyond 48 cameras on a 96 GB RTX PRO 6000, while its tiled camera and Warp ray-caster camera scale "to several thousand environments". At low resolutions the ray-caster camera is faster; at higher resolutions the tiled RTX camera is. [author reported]**
- Location: arXiv 2511.04831v1, Section 4.1.2 and Figure 17.
- Verdict: CARRIED (seed 02 section 3.2, re-fetched)
- Evidence: https://arxiv.org/abs/2511.04831v1 | Tier 3, preprint (first-party lab, NVIDIA and collaborators) | benchmark claim (author reported) | "The USD-Camera provides the highest visual fidelity but incurs substantial memory demand. As seen in Figure 17, Out-of-Memory errors occur when simulating more than 48 cameras in parallel, for both RGB and depth modalities. In contrast, the Tiled-Camera and RayCasterCamera have significantly lower memory footprints, enabling scaling to several thousand environments." ... "at lower resolutions, the RayCasterCamera is more efficient, whereas at higher resolutions, the Tiled-Camera achieves superior performance." ... "All experiments are executed on a single RTX Pro 6000." (accessed 2026-11-20)
- Use in dive: section 13, GPU memory per camera environment as the limit: 96 GB / 48 cameras is about 2 GB per full-fidelity camera [derived], against about 7 MB per camera environment for the batched renderers in F06-48.

**F06-64. Tiled rendering is how Isaac Lab renders thousands of cameras: every environment's camera is drawn into one tile of a single large GPU frame buffer in one pass, then cut apart into per-environment images.**
- Location: arXiv 2511.04831v1, Section 2.3 and Figure 5.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2511.04831v1 | Tier 3, preprint | definition | "Tiled rendering of multiple simulated environments. Each environment has a separate camera, and their outputs are spatially tiled into a single GPU frame-buffer." ... "Isaac Lab uses the RTX renderer to implement the TiledCamera sensor class, which batches the rendering" (accessed 2026-11-20)
- Use in dive: section 13, the mechanism behind batched camera simulation and the reason the output is already a GPU tensor of shape (environments, height, width, channels) that the policy network can read without a copy to the CPU.

**F06-65. The Isaac Lab paper's state-only throughput on Isaac Sim and PhysX (the 2.x line): "With eight GPUs and 16384 environments, the DextrAH teacher task reaches over 900,000 frames per second in training, while the Franka cabinet task reaches over 1.6 million frames per second", with scaling "almost perfectly linearly as the number of GPUs increases". Test GPUs: L40 (48 GB), RTX PRO 6000 (96 GB), GeForce 5090 (32 GB). [author reported]**
- Location: arXiv 2511.04831v1, Section 4.1 and 4.1.1.
- Verdict: CARRIED (seed 02 section 3.2, re-fetched). Dated 6 Nov 2025; superseded for single-GPU numbers by the 3.0 benchmark export (F06-47).
- Evidence: https://arxiv.org/abs/2511.04831v1 | Tier 3, preprint | benchmark claim (author reported) | quotes as in the claim, plus "Apart from the GPU, environment throughput can also be dependent on single-core CPU performance due to bottlenecks in some parts of PhysX simulation and the main training loop." (accessed 2026-11-20)
- Use in dive: section 12, multi-GPU scaling, and a machine-load point: GPU physics still has a single-thread CPU bottleneck, which is why the 8-core 9800X3D workstation with a 5090 came close to a two-GPU server.

### I. Sim-to-real: the gap, domain randomisation, system identification

**F06-66. Domain randomisation as introduced in 2017: train on simulated images whose rendering is randomised so widely that "the real world may appear to the model as just another variation". Tobin et al. trained an object detector accurate to 1.5 cm in the real world using only simulated images with non-realistic random textures, and used it for grasping. (History; the paper that introduced the term for this use.)**
- Location: arXiv 1703.06907v1, abstract.
- Verdict: NEW (labelled history, 2017)
- Evidence: https://arxiv.org/abs/1703.06907v1 | Tier 3, preprint (arXiv comment: submitted to IROS 2017; acceptance not confirmed here) | definition and benchmark claim (author reported) | "This paper explores domain randomization, a simple technique for training models on simulated images that transfer to real images by randomizing rendering in the simulator. With enough variability in the simulator, the real world may appear to the model as just another variation." ... "We find that it is possible to train a real-world object detector that is accurate to 1.5 cm and robust to distractors and partial occlusions using only data from a simulator with non-realistic random textures." (accessed 2026-11-20)
- Use in dive: section 14, the plain-words idea of domain randomisation, with its origin. The intuition: if you cannot make the simulator match reality, make it vary so much that reality falls inside the range.

**F06-67. The Isaac Lab paper states what is randomised in practice: for physics, "friction, armature, gravity, and mass"; for rendering, "texture, material, and lighting". The reason given: such parameters "may be difficult to estimate accurately or may vary over time in the real world".**
- Location: arXiv 2511.04831v1, Section 5.3 "Domain Randomization".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2511.04831v1 | Tier 3, preprint (first-party lab) | definition | "Domain Randomization (DR) is a critical component of sim-to-real transfer, where the system parameters are randomized in simulation to promote policy generalization and robustness on deployment. For physics, these include friction, armature, gravity, and mass (Peng et al., 2017), while for rendering they include texture, material, and lighting (Sadeghi and Levine, 2017; Tobin et al., 2017). Such parameters may be difficult to estimate accurately or may vary over time in the real world. By randomizing them over broad distributions during training, policies acquire invariance to these parameters, improving transfer to reality." (accessed 2026-11-20)
- Use in dive: section 14, the two halves of the gap that randomisation covers (physics and appearance), in a first-party sentence.

**F06-68. What Isaac Lab 3.0.0 can randomise today, read from its event functions: rigid-body scale, material (friction and restitution), mass, inertia, centre of mass and collider offsets; scene gravity; actuator gains; joint parameters; fixed-tendon parameters; visual texture materials and visual colours; plus external pushes and randomised reset states.**
- Location: Isaac Lab at v3.0.0, `source/isaaclab/isaaclab/envs/mdp/events.py`, top-level definitions.
- Verdict: NEW
- Evidence: https://github.com/isaac-sim/IsaacLab/blob/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/source/isaaclab/isaaclab/envs/mdp/events.py | Tier 1, code at a pinned tag | code behaviour | definitions present: "randomize_rigid_body_scale", "randomize_rigid_body_material", "randomize_rigid_body_mass", "randomize_rigid_body_inertia", "randomize_rigid_body_com", "randomize_rigid_body_collider_offsets", "randomize_physics_scene_gravity", "randomize_actuator_gains", "randomize_joint_parameters", "randomize_fixed_tendon_parameters", "apply_external_force_torque", "push_by_setting_velocity", "randomize_visual_texture_material", "randomize_visual_color" (accessed 2026-11-20)
- Use in dive: section 14, the current list (the code is the authority), beside the Playground SO-101 list in F06-28. The prose docs page for these events at 3.0.0 was not read; parameter ranges are per task.

**F06-69. Under PhysX, physics parameters such as mass, friction and joint armature "must be modified through the CPU API", and rendering parameters "currently rely on CPU-based USD APIs". Randomisation is therefore a CPU cost inside an otherwise GPU pipeline.**
- Location: arXiv 2511.04831v1, Section 5.3.
- Verdict: NEW (true of the Isaac Sim and PhysX path described in the November 2025 paper; not checked for Newton in 3.0)
- Evidence: https://arxiv.org/abs/2511.04831v1 | Tier 3, preprint (first-party lab) | code behaviour | "due to current PhysX design limitations, only simulation state is accessible directly on the GPU, while simulation parameters (e.g. masses, friction, contact offsets, and joint armature) must be modified through the CPU API. Rendering parameters such as visual materials, lighting intensities, light source locations, and background textures can also be randomized at runtime, though they currently rely on CPU-based USD APIs." (accessed 2026-11-20)
- Use in dive: section 14 compute cost and the machine-load map: domain randomisation loads CPU cores on PhysX. MuJoCo Warp instead exposes per-world model fields as GPU arrays (F06-24 lists `geom_rgba`, `geom_size`, materials and lights as randomisable per world).

**F06-70. Timing is part of the gap and is modelled explicitly: Isaac Lab's "Delayed PD" actuator buffers commanded actions by a configurable number of simulation steps to imitate communication delay, and neural-network actuator models trained on hardware data replace the ideal motor model where needed.**
- Location: arXiv 2511.04831v1, Section 3.2 (actuator models).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2511.04831v1 | Tier 3, preprint (first-party lab) | definition | "communication delay in the control system by buffering desired actions by a configurable number of simulation steps. These delays are important to simulate when approximating the communication delays on real distributed systems." ... "Neural Net actuators utilize a trained neural network for joint control rather than the PD control loop of the Ideal PD actuator. These models can be trained on hardware data to better emulate the dynamic response of the actuator in the real world." (accessed 2026-11-20)
- Use in dive: section 14, the third part of the gap (timing), with the SO-101 instance in F06-27 (0 to 4 ms random command delay) and F06-30 (the system-identification script estimates the serial transport delay).

**F06-71. The SIMPLER authors found a control gap large enough to change task outcomes: using the real controller's PD gains directly in simulation gave inaccurate tracking that ended in "a missed grasp on the coke can"; after system identification the simulated robot grasped the can when replaying the same recorded actions. They treat the gap as two parts, control and visual. (History, 2024.)**
- Location: arXiv 2405.05941v1, Section IV.A "Mitigating the Real-to-Sim Control Gap" and Figure 4.
- Verdict: NEW (labelled history, 2024; peer-review venue not confirmed here)
- Evidence: https://arxiv.org/abs/2405.05941v1 | Tier 3, preprint | ablation | "We find that naively using PD parameter values from real controllers results in inaccurate tracking of the real robot's end-effector movements, which culminates in a missed grasp on the coke can. After system identification, the controller more accurately tracks the motion in simulation: the robot is able to grasp the object when replaying the demonstration's action sequence." (accessed 2026-11-20)
- Use in dive: section 14, evidence that the physics gap is concrete: same commands, wrong gains, the gripper closes on air.

**F06-72. A measured real-to-sim failure from an AWS engagement (post of 2026-09-09): a model fine-tuned on real demonstrations and evaluated in simulation scored 0% success, while models trained on clean simulation data reached 35% to 45% in the same simulator. [vendor claim]**
- Location: AWS Physical AI blog, "Bringing a Frontier World Model to the Convenience Store: Inside Telexistence's DreamZero Experiment on AWS", sections "Fine-Tuning and Evaluating in Simulation" and "Confronting the Real-to-Sim Gap".
- Verdict: CARRIED (seed 03 cites the post; re-fetched)
- Evidence: https://aws.amazon.com/blogs/physical-ai/bringing-a-frontier-world-model-to-the-convenience-store-inside-telexistences-dreamzero-experiment-on-aws/ | Tier 2, first-party vendor blog (AWS), dated 09 SEP 2026 | production report | "The best model reached a 45% success rate" ... "A model trained for 2000 steps on task-aligned pick data reached 35%" ... "When we fine-tuned on Telexistence's real pick_block_color data and evaluated in simulation, success dropped to 0% - and the failure was diagnostic, not disappointing." ... "All success rates, MSE figures, latency measurements, and other quantitative results reported in this post were obtained during internal testing conducted as part of this engagement." (accessed 2026-11-20)
- Use in dive: section 14, the gap runs in both directions: a policy from real data can fail in a simulator that does not match the real robot. The task (pick a coloured block) is close to the dive's thread task. Trial counts behind the percentages are not stated in the post.

### J. Real-to-sim: twins from scans, OpenUSD and SimReady

**F06-73. PolaRiS builds an evaluation scene from a 2 to 5 minute monocular video: camera poses with COLMAP, a 2D Gaussian Splatting model for appearance and mesh geometry, meshes imported into Isaac Sim for contact, splats attached to the robot's links so they move with its kinematics. Reconstruction "typically completes within 30 minutes on an NVIDIA RTX 4090"; human effort is "typically less than 20 minutes" and total wall time "typically less than one hour". [author reported]**
- Location: arXiv 2512.16881v2, Section 4.1 "Environment Creation via Reconstruction".
- Verdict: CARRIED (seed 02 sections 5 and 6.1, re-fetched at v2)
- Evidence: https://arxiv.org/abs/2512.16881v2 | Tier 3, preprint | benchmark claim (author reported) | "We start by capturing a short (2-5 minutes) monocular video recording of the scene." ... "The resulting meshes are imported into IsaacSim to enable realistic contact dynamics and object interactions, while the underlying Gaussian splats D provides the corresponding photometric renders" ... "typically completes within 30 minutes on an NVIDIA RTX 4090" ... "The total human effort required for creating a new evaluation environment is typically less than 20 minutes, and the total wall time for creating a new evaluation environment, including training time of the Gaussian splats, is typically less than one hour." (accessed 2026-11-20)
- Use in dive: section 14, real-to-sim in plain words: film the table, get a twin. The twin is two things glued together: a mesh that physics collides with and a cloud of coloured Gaussian blobs that the camera sees. Compute: one consumer GPU for half an hour.

**F06-74. A scanned twin alone was not enough for PolaRiS: policies are fine-tuned for 1k steps on about 350 simulated demonstrations from 15 other scanned scenes before evaluation ("co-training"), to bridge the remaining real-to-sim gap. Object physics use Isaac Sim defaults and the manufacturer's defaults for the arm.**
- Location: arXiv 2512.16881v2, Sections 4.2 and 5.1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2512.16881v2 | Tier 3, preprint | ablation | "We also create an additional 15 real-to-sim scenes through our pipeline, which we use to collect a dataset of around 350 simulation demonstrations for co-training" ... "We finetune all policies for 1k steps on the co-training dataset using supervised learning, then run 50 rollouts per task in simulation to compute the policy's performance." (accessed 2026-11-20)
- Use in dive: section 14 and section 16, an honest condition on the headline correlation in F06-83: the policy is adapted to the simulator's look before it is scored there.

**F06-75. NVIDIA's 3DGRUT (v1.1.0, 2026-06-10) implements two reconstruction methods. 3DGRT ray traces volumetric Gaussian particles, which supports distorted cameras, rolling shutters, reflections, refraction and shadows, but "requires dedicated ray-tracing hardware and remains slower than 3DGS"; the install notes recommend "an NVIDIA GPU with Ray Tracing (RT) cores". Training averages on an RTX 5090: 3DGRT 479 s (NeRF Synthetic) and 2,869 s (MipNeRF360); 3DGUT 215 s and 686 s. [author reported]**
- Location: nv-tlabs/3dgrut README at tag v1.1.0, introduction, requirements, benchmark tables.
- Verdict: CARRIED (seed 02 section 5.1, re-fetched), with the seed's version corrected: the newest release is v1.1.0, not "v2.0.0".
- Evidence: https://github.com/nv-tlabs/3dgrut/tree/0a5832248698ab8456b181d6ea17fe02eda58637 (tag v1.1.0, README.md) | Tier 1, first-party repository at a pinned tag | definition and benchmark claim (author reported) | "Unlike traditional methods that rely on splatting, 3DGRT performs ray tracing of volumetric Gaussian particles instead." ... "However, 3DGRT requires dedicated ray-tracing hardware and remains slower than 3DGS." ... "For good performance with 3DGRT, we recommend using an NVIDIA GPU with Ray Tracing (RT) cores." Tables "3DGRT Results Produced on RTX 5090": "Average | 33.87 | 0.971 | 479.3 | 347" and "Average | 27.22 | 0.817 | 2869 | 68"; 3DGUT: "Average | 33.88 | 0.970 | 214.6 | 846" and "Average | 27.43 | 0.815 | 686.4 | 317" (columns PSNR, SSIM, Train (s), FPS) (accessed 2026-11-20)
- Use in dive: section 14 compute cost of a twin (minutes to under an hour on one GPU), and section 13: reconstruction by ray tracing is the second workload, after RTX rendering, where RT cores matter.

**F06-76. The 3DGRUT v1.1.0 release added "USD, USDZ, PLY, NuRec, and lightfield export infrastructure" and platform support for "Blackwell, CUDA 12/13, DGX Spark/ARM64". Its README still describes the Isaac Sim path as a beta tied to Isaac Sim 5.0 and warns that "how USD and reconstruction workflows work together is highly likely to change in future versions".**
- Location: 3dgrut release v1.1.0 body, "Notable features"; README at v1.1.0, "Exporting USDZ for use in Omniverse and Isaac Sim".
- Verdict: NEW
- Evidence: https://github.com/nv-tlabs/3dgrut/releases/tag/v1.1.0 | Tier 1, release notes | documentation of support | "Added USD, USDZ, PLY, NuRec, and lightfield export infrastructure with mesh injection and roundtrip tests" ... "Expanded platform compatibility for Blackwell, CUDA 12/13, DGX Spark/ARM64, Windows, and uv-based installs". README: "As a beta feature, Omniverse Kit 107.3 and Isaac Sim 5.0 are able to support rendering 3D Gaussians in a specific custom USDZ-based format" ... "The USD output schema is currently compatible with Isaac Sim 5.0, but how USD and reconstruction workflows work together is highly likely to change in future versions. This is a beta feature." (accessed 2026-11-20)
- Use in dive: section 14, practical caution: the scan-to-Isaac-Sim path is real and moving. The README text lags Isaac Sim by a major version (see F06-77).

**F06-77. Isaac Sim 6.2.0 renders Gaussian splats natively: NuRec environments "are published as USD stages that use OpenUSD ParticleField geometry (3D Gaussian splats and related radiance fields), which Omniverse RTX renders natively together with polygonal scene content". The docs point to 3DGRUT to train splats and export ParticleField USD.**
- Location: Isaac Sim docs 6.2.0, "Neural Volume Rendering" (`assets/usd_assets_nurec.html`).
- Verdict: CARRIED (seed 02 section 5.2 quoted this from a search summary and marked it not verified; now fetched directly)
- Evidence: https://docs.isaacsim.omniverse.nvidia.com/6.2.0/assets/usd_assets_nurec.html | Tier 1, first-party docs | documentation of support | "NuRec (Neural Reconstruction) enables scene rendering in Omniverse using neural volumes derived from real-world images. Compatible environments are published as USD stages that use OpenUSD ParticleField geometry (3D Gaussian splats and related radiance fields), which Omniverse RTX renders natively together with polygonal scene content." ... "To train splats and export ParticleField USD stages for Omniverse, use the open-source 3DGruT project." (accessed 2026-11-20)
- Use in dive: section 14, the current state of splats in Isaac Sim, and section 13: this path is the RTX renderer, so it needs RT cores.

**F06-78. Splats also render without RTX: MuJoCo Warp's batch renderer supports "3D Gaussian Splatting (3DGS): BVH-accelerated ray tracing and alpha compositing of 3D Gaussian splats with per-world grouping and bidirectional physical occlusion", loading standard 3DGS `.ply` files, so a scanned background can sit behind simulated objects in thousands of parallel worlds.**
- Location: MuJoCo docs at 4.0.1, MuJoCo Warp chapter, "Batch Rendering" and "3D Gaussian Splatting (3DGS)".
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/mjwarp/index.rst | Tier 1, first-party docs at a pinned tag | documentation of support | "MJWarp supports rendering 3D Gaussian Splatting (3DGS) scenes composited with simulated physical MuJoCo objects. Splats are raytraced via a dedicated SAH-constructed BVH (`build_splat_bvh`) and evaluated using a single-hit planar slice approximation along each ray." ... "If a camera ray hits a physical body (such as a mesh, primitive, or flex), splats located behind the hit distance (`dist`) are occluded by the physical object" (accessed 2026-11-20)
- Use in dive: section 14, real-to-sim appearance inside the MuJoCo family; no throughput figure with splats is published (U10).

**F06-79. OpenUSD has a ratified standard: "The OpenUSD Core Specification 1.0 is officially ratified." It covers the text grammar and data types, the document model, the composition algorithm, value resolution, the USDA, USDC and USDZ file formats and a compliance framework. Physics and materials are left to separate domain specifications.**
- Location: Alliance for OpenUSD blog, "Foundations of Open 3D Development: Introducing AOUSD Core Specification 1.0" (page shows "Last updated: 2026-08-11"; no publication date printed).
- Verdict: CARRIED (seed 02 section 5.2, re-fetched; quotes extracted by the fetch tool)
- Evidence: https://aousd.org/blog/foundations-of-open-3d-development-introducing-aousd-core-specification-1-0/ | Tier 2, first-party standards body blog | documentation of support | "The OpenUSD Core Specification 1.0 is officially ratified." and the specification "does not dictate the specific vocabulary of a medical textbook or legal contract (that's for domain-specific specs like Physics and Materials)" (accessed 2026-11-20)
- Use in dive: section 14, one entry on the interchange layer: USD is the file a scene, a robot and a scanned twin all arrive in for the Isaac stack; MuJoCo 4.0 ships its own importer and exporter (`pip install "mujoco[usd]"`, F06-3 source). How a physics property is written in USD is not yet a ratified standard.

**F06-80. SimReady assets are what an evaluation harness looks up when it builds a scene: Isaac Lab-Arena 0.3's agentic environment generation "finds SimReady USD assets" to assemble environments from a natural-language task description (marked experimental).**
- Location: isaac-sim/IsaacLab-Arena discussion 1245, "Isaac Lab-Arena 0.3 (Alpha) Release Announcement" (2026-09-10), "Author Scalable Benchmarks".
- Verdict: CARRIED (seed 02 section 6.3, re-fetched). The SimReady Foundation specification pages themselves were not fetched in this pass (U11).
- Evidence: https://github.com/isaac-sim/IsaacLab-Arena/discussions/1245 | Tier 2, first-party announcement | documentation of support | "[NEW] Agentic environment generation (Experimental) - Describe a task in natural language. An agent infers spatial constraints between objects, creates a reviewable specification, finds SimReady USD assets, and builds a family of Arena environments for policy evaluation. Initial examples cover composite pick-and-place." (accessed 2026-11-20)
- Use in dive: section 14, SimReady in one sentence: a USD asset that carries what simulation needs (collision shape, mass, semantic label), so a tool can drop it into a scene without hand work.

### K. Evaluation: offline loss, closed-loop simulation, world-model scoring, real trials

**F06-81. Peer-level data that offline action error does not rank policies (history, 2024): across the SIMPLER tasks, ranking policies by validation action MSE gave Pearson r of 0.308 with real-world success on average (MMRV 0.375), against 0.924 (MMRV 0.056) for closed-loop simulated evaluation with visual matching. The authors: "validation MSE is not a good proxy for a policy's real-world performance". [author reported]**
- Location: arXiv 2405.05941v1, Section VI and Table I (rows "Validation MSE", "SIMPLER-VarAgg", "SIMPLER-VisMatch"; columns Pick Coke Can, Move Near, Drawer, Average).
- Verdict: CARRIED (seed 02 section 6.1 carried the 0.924 and 0.056; re-fetched, and the validation-MSE row added)
- Evidence: https://arxiv.org/abs/2405.05941v1 | Tier 3, preprint (venue not confirmed here) | benchmark claim (author reported) | "Using validation loss for model selection is common in supervised learning. However, our analysis supports an intuition shared by many robotics practitioners: we show that for imitation learning, validation MSE is not a good proxy for a policy's real-world performance, leading to high MMRV and low Pearson r." Table I: "Validation MSE 0.412 0.408 0.306 0.375" (MMRV), "Validation MSE 0.464 0.230 0.231 0.308" (Pearson r), "SIMPLER-VisMatch (ours) 0.976 0.855 0.942 0.924" (Pearson r), "SIMPLER-VisMatch (ours) 0.031 0.111 0.027 0.056" (MMRV); "over ~1500 evaluation episodes" (accessed 2026-11-20)
- Use in dive: section 16, the section's strongest number: 0.31 against 0.92. Offline loss ranks policies barely better than chance; running the policy in a matched simulator ranks them well. Labelled 2024, on RT-1, RT-1-X, RT-2-X and Octo.

**F06-82. The same finding on 2025 vision-language-action models: PolaRiS reports that action MSE "is a poor metric for real-world policy performance and shows low correlation", and that LIBERO scores are "poorly correlated with real-world performance, with nearly all tested policies scoring between 90 and 95% success in Libero, but spanning the full spectrum from high-performing to low-performing policies in the real world". [author reported]**
- Location: arXiv 2512.16881v2, Section 5.2 "Real-to-Sim Correlation in Unseen Environments", Figures 6 and 7.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2512.16881v2 | Tier 3, preprint | benchmark claim (author reported) | "In line with existing literature, we find that MSE is a poor metric for real-world policy performance and shows low correlation. Libero-score too is poorly correlated with real-world performance, with nearly all tested policies scoring between 90 and 95% success in Libero, but spanning the full spectrum from high-performing to low-performing policies in the real world." (accessed 2026-11-20)
- Use in dive: section 16, two separate lessons: offline loss misleads, and a saturated simulated benchmark misleads too. Policies: pi0, pi0-FAST, PaliGemma-binning, pi0.5 on DROID. The numeric correlations for the MSE and LIBERO baselines are in Figure 7 and were not extracted from the figure.

**F06-83. PolaRiS's scanned-twin evaluation correlated with real results at "an average Pearson correlation of r = 0.9" across six paired environments (worst single environment r = 0.81), and at r = 0.98 with RoboArena scores. Protocol: 20 real rollouts per policy per environment as ground truth, 50 simulated rollouts per task. [author reported]**
- Location: arXiv 2512.16881v2, introduction and Sections 5.1 and 5.2.
- Verdict: CARRIED (seed 02 section 6.1, re-fetched at v2)
- Evidence: https://arxiv.org/abs/2512.16881v2 | Tier 3, preprint | benchmark claim (author reported) | "with an average Pearson correlation of r = 0.9. PolaRiS evaluations also strongly correlate (r = 0.98) with policy scores in RoboArena" ... "the worst-case correlation across all six tested environments is r = 0.81" ... "For each environment we run 20 real-world evaluation rollouts per policy to establish a ground-truth ranking of policy performance." (accessed 2026-11-20)
- Use in dive: section 16, closed-loop simulation that tracks reality, with its conditions (four policies; co-training per F06-74; a correlation computed over four policies has little statistical weight of its own).

**F06-84. A 2026 counterweight: the ABC behaviour-cloning study found that training loss and validation action error are "both negatively correlated with real-world performance, with statistically significant Pearson and Spearman correlations", while validation loss "is not significantly correlated". The authors still say offline metrics "cannot reliably predict task success rates or reveal failure modes". [author reported]**
- Location: arXiv 2606.27375v1, Section 4 (offline metrics versus real-world performance), Figures 7 and 8.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2606.27375v1 | Tier 3, preprint | benchmark claim (author reported) | "Training loss and validation action error are both negatively correlated with real-world performance, with statistically significant Pearson and Spearman correlations. Validation action error shows the strongest negative correlation. In contrast, validation loss is not significantly correlated with real-world performance. We note that validation action error is only meaningful when the number of diffusion steps is held fixed" ... "meanwhile, validation loss initially goes down but then increases even though performance improves over time. Offline metrics, such as validation action error and training loss, thus give us a cheap, scalar proxy for evaluating the many small design decisions in this section without having to test everything in the real world. While they cannot reliably predict task success rates or reveal failure modes" (accessed 2026-11-20)
- Use in dive: section 16, the precise form of the claim. Within one model family and one training run, lower action error tends to go with better checkpoints; across different policies, or as a prediction of the success rate itself, it fails. And validation loss can rise while the robot improves. See Contradictions.

**F06-85. Why offline error misses: it "does not fully capture closed-loop effects such as compounding errors, contact dynamics, or recovery ability, and therefore does not always correlate perfectly with real-robot success" (ICRA 2026 REAL-I challenge report).**
- Location: arXiv 2609.13679v2, discussion section on evaluation.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2609.13679v2 | Tier 3, preprint | production report | "NUS-CLEAR used held-out open-loop action prediction as a practical proxy for checkpoint selection and found it useful for detecting overfitting during on-site adaptation. Nevertheless, open-loop error does not fully capture closed-loop effects such as compounding errors, contact dynamics, or recovery ability, and therefore does not always correlate perfectly with real-robot success." ... "Developing offline or lightweight evaluation metrics that reliably predict closed-loop deployment performance therefore remains an important research problem for practical robot learning." (accessed 2026-11-20)
- Use in dive: section 16, the mechanism in three named effects. Open-loop: the policy is shown a recorded observation and its action is compared with the recorded action; its own action never changes the next observation. Closed-loop: its action moves the arm, which changes the next image, so a small error at step 10 becomes a different scene at step 50.

**F06-86. The same lesson in an AWS customer engagement (2026-09-09): "offline MSE does not monotonically predict closed-loop success. A model with low average prediction error can still fail in the loop, while a model with higher MSE can succeed by having learned transferable primitives. Closed-loop evaluation remained the definitive measure." The post also explains the bias: the offline setup feeds ground-truth frames, "so offline rollouts understate the model's true closed-loop influence". [vendor claim]**
- Location: AWS Physical AI blog, Telexistence DreamZero post, "Fine-Tuning and Evaluating in Simulation" and "What surfaced".
- Verdict: CARRIED (seed 03, re-fetched)
- Evidence: https://aws.amazon.com/blogs/physical-ai/bringing-a-frontier-world-model-to-the-convenience-store-inside-telexistences-dreamzero-experiment-on-aws/ | Tier 2, first-party vendor blog (AWS), dated 09 SEP 2026 | production report | quotes as in the claim, plus "because the offline setup feeds the model ground-truth video frames, generated actions deviate only slightly from ground truth by design" (accessed 2026-11-20)
- Use in dive: section 16, a production voice for the claim, with the compute consequence stated in the same post: closed-loop rollouts ran in a simulator on G7e (RTX PRO 6000 Blackwell) while fine-tuning ran on P6-B200.

**F06-87. LIBERO's 2025 successors exist because the original saturated. LIBERO-Plus perturbs seven dimensions (object layout, camera viewpoint, robot initial state, language, lighting, background texture, sensor noise) and reports performance "dropping from 95% to below 30% under modest perturbations". LIBERO-PRO reports models above 90% on standard LIBERO whose "performance collapses to 0.0%" under its generalised setting. [author reported]**
- Location: arXiv 2510.13626v3 (LIBERO-Plus), abstract; arXiv 2510.03827v2 (LIBERO-PRO, revised 25 May 2026), abstract.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2510.13626v3 | Tier 3, preprint (a CVPR 2026 listing under a different subtitle appeared in search results; not confirmed here) | benchmark claim (author reported) | "models exhibit extreme sensitivity to perturbation factors, including camera viewpoints and robot initial states, with performance dropping from 95% to below 30% under modest perturbations. Surprisingly, models are largely insensitive to language variations, with further experiments revealing that models tend to ignore language instructions completely." And https://arxiv.org/abs/2510.03827v2 | Tier 3, preprint | "although existing models achieve over 90% accuracy under the standard LIBERO evaluation, their performance collapses to 0.0% under our generalized setting." (accessed 2026-11-20)
- Use in dive: section 16, what a high benchmark score does not say. Practical: LeRobot v0.7.0 ships a `libero_plus` integration next to `libero` (F06-38), so the perturbed suite is one flag away.

**F06-88. RoboArena is the real-world reference that simulators and world models are scored against: evaluators at seven academic institutions run double-blind pairwise comparisons of policies on the DROID platform, on tasks and scenes of their own choosing, and the preferences are aggregated into a ranking. The paper reports "more than 600 pairwise real-robot evaluation episodes across seven generalist policies".**
- Location: arXiv 2506.18123v2 (revised 29 Nov 2025), abstract.
- Verdict: CARRIED (seed 02 section 6.1, re-fetched)
- Evidence: https://arxiv.org/abs/2506.18123v2 | Tier 3, preprint (the HF-WM paper's reference list cites it as "In Proceedings of the Conference on..."; venue not confirmed here) | definition | "evaluators can freely choose the tasks and environments they evaluate on, enabling easy scaling of diversity, but they are required to perform double-blind evaluations over pairs of policies. Then, by aggregating preference feedback from pairwise comparisons across diverse tasks and environments, we can derive a ranking of policies. We instantiate our approach across a network of evaluators at seven academic institutions using the DROID robot platform. Through more than 600 pairwise real-robot evaluation episodes across seven generalist policies" (accessed 2026-11-20)
- Use in dive: section 16, how real-robot evaluation scales: many labs, A/B pairs, blind. Also the scale of the best public real-world benchmark: hundreds of episodes, not tens of thousands.

**F06-89. RoboWorld (KAIST and Config, arXiv v4 of 15 Jul 2026) scores policies inside a video world model: starting from the first frame of each RoboArena episode, the policy acts, the world model (initialised from Wan2.1-T2V-1.3B) generates what the cameras would see for 30 seconds, and a vision-language model judge (GPT-4o) scores the rollout. Across 8 policies and 4,186 generated rollouts it reports Pearson r = 0.989 and Spearman 0.970 against the RoboArena leaderboard, and "only 100 H100 GPU hours" for the whole benchmark. [author reported]**
- Location: arXiv 2607.01060v4, abstract, Section 5 and Figure 5.
- Verdict: CARRIED (seed 02 section 6.1 cited v3; re-fetched at v4, figures unchanged)
- Evidence: https://arxiv.org/abs/2607.01060v4 | Tier 3, preprint | benchmark claim (author reported) | "produces 4,186 video rollouts, achieving a Pearson correlation of 0.989 and a Spearman correlation of 0.970 with the original real-world leaderboard" ... "We initialize the video world model from Wan2.1-T2V-1.3B" ... "Replicating the RoboArena benchmark in our neural simulator (across 8 different policies) takes only 100 H100 GPU hours, including the computation and communication costs for each policy action generation and world-model rollout" ... "The correlation improves as the number of trials increases" (accessed 2026-11-20)
- Use in dive: section 16, world-model scoring with a cost: 100 H100 GPU-hours for 8 policies is 12.5 GPU-hours per policy [derived], and about 86 GPU-seconds per rollout [derived: 100 x 3600 / 4186]. Loads GPU tensor compute (video generation), no physics engine, no RT cores. Conditions: 8 policies, same distribution the world model was trained on (DROID), judged by a model.

**F06-90. Other world-model evaluators and their reported agreement with real results: WorldGym, Pearson r = 0.78 between world-model and real success rates, with success rates differing "by an average of only 3.3%" (arXiv v3, 30 Sep 2025); HF-WM, Pearson r = 0.983 and MMRV = 0.002 over six RoboArena policies and 540 policy-session evaluations, with GPT-5 as judge (arXiv 9 Oct 2026). A third-party test in the PolaRiS paper found an open-source video model (Ctrl-World) mis-ranked policies (MMRV 0.22) through "heavy hallucinations during object interaction". [author reported]**
- Location: arXiv 2506.00613v3, Section 4 and Figure 4; arXiv 2610.13522v1, Section 5; arXiv 2512.16881v2, Section 5.2.
- Verdict: CARRIED (seed 02 section 6.1 had WorldGym and HF-WM from search summaries, marked not verified; both now read in the PDF)
- Evidence: https://arxiv.org/abs/2506.00613v3 | Tier 3, preprint | benchmark claim (author reported) | "We find that real-world task performance is strongly correlated with the task performance reported by the world model, achieving a Pearson correlation of r = 0.78." ... "The success rates differ by an average of only 3.3%". https://arxiv.org/abs/2610.13522v1 | Tier 3, preprint | "Pearson r = 0.983" ... "MMRV = 0.002" ... "540 policy-session evaluations in total". https://arxiv.org/abs/2512.16881v2 | "Ctrl-World often produces heavy hallucinations during object interaction, making accurate scoring challenging and ultimately leading to clear policy mis-rankings (MMRV: 0.22)." (accessed 2026-11-20)
- Use in dive: section 16, the range: 0.78 to 0.99 from authors of the evaluators, and a failure when a third party tried one on new scenes. Teach it as promising and unsettled. The seed's ICLR 2026 venue for WorldGym was not confirmed in the PDF read here.

**F06-91. 1X's world-model post that frames evaluation as the motivating challenge (17 September 2024) publishes no correlation with real-world success, no count of policies compared and no accuracy figure for world-model evaluation. It states the challenge: "Even the same model weights can experience a rapid degradation in performance in a matter of days", and a shirt-folding model "degrades in performance over the course of 50 days" as the environment drifts. (History; quotes extracted by the fetch tool.)**
- Location: 1X, "1X World Model", 2024-09-17.
- Verdict: NEW (labelled history, 2024). A 2026 1X publication with quantified world-model evaluation was not located in this research (U12).
- Evidence: https://www.1x.tech/discover/1x-world-model | Tier 2, first-party vendor blog | production report | "World models solve a very practical and yet often overlooked challenge when building general-purpose robots: evaluation." ... "This makes careful robotic science in the real world frustratingly hard." (accessed 2026-11-20)
- Use in dive: section 16, the reason real-robot evaluation is not a fixed yardstick: the room changes, so last month's number is not reproducible. Do not attribute a correlation figure to 1X.

**F06-92. Isaac Lab-Arena, NVIDIA's evaluation harness on Isaac Lab, announced v0.3 (alpha) on 2026-09-10 with multi-node evaluation through OSMO, a policy client-server interface and environment variation sweeps. A `release/0.4.0` branch exists with commits as recent as 2026-11-19; no 0.4 announcement was found in the repository's discussions.**
- Location: isaac-sim/IsaacLab-Arena discussion 1245; repository branch list (`release/0.4.0` at commit 2281e1256bd10bf9b62b67ccccec9c87cd51fc6f, committed 2026-11-19).
- Verdict: CARRIED (seed 02 section 6.3, re-fetched), with the 0.4.0 branch added. The repository publishes no GitHub releases or tags, so "current version" rests on branch names (U13).
- Evidence: https://github.com/isaac-sim/IsaacLab-Arena/discussions/1245 | Tier 2, first-party announcement | documentation of support | "We're excited to announce that NVIDIA Isaac Lab-Arena v0.3 is now open source!" ... "V0.3 adds tools to scale policy evaluation beyond one-off success-rate scores into repeatable robustness gates" ... "[NEW] Environment variations - Turn one environment into a controlled perturbation sweep. Vary lighting, backgrounds, camera parameters, object mass, and more across configurable ranges and distributions." (accessed 2026-11-20)
- Use in dive: section 16, the simulated-evaluation harness in the Isaac stack and its framing: a robustness gate (success across a sweep of variations), which is the simulator-side answer to F06-87.

**F06-93. Isaac Lab-Arena's published scaling numbers, camera-free and with a zero-action policy (so no rendering and no policy inference). One RTX 5880 Ada (49 GB): 1 environment 5.41 environment-steps per second; 256 environments 1,092; 1,024 environments 2,390, with the vectorised step time rising from 185 ms to 428 ms. Across GPUs with OSMO, eight independent runs of 256 environments on L40 GPUs: 1,255.2 s on one GPU, 157.8 s on eight, "a 7.95x speedup". [vendor claim]**
- Location: Isaac Lab-Arena docs (main), "Performance and scaling", tables "Single-GPU rollout results" and "OSMO distributed-Run results", "Rollout benchmark scope".
- Verdict: CARRIED (seed 02 section 6.3, re-fetched). One correction: the page says "one NVIDIA L40 GPU" per run; the seed wrote "L40s".
- Evidence: https://isaac-sim.github.io/IsaacLab-Arena/main/pages/references/performance.html | Tier 1, first-party docs (unversioned "main" build; tested revisions named on the page: Arena b0cd0b38e and 4ee056866) | benchmark claim (vendor reported) | "1 | 185.0 ms | 5.41 environment-steps/s", "256 | 234.4 ms | 1,092.18 environment-steps/s", "1,024 | 428.4 ms | 2,390.22 environment-steps/s"; "Executing all eight Runs at once reduced active Arena execution time from 20 minutes 55 seconds to 2 minutes 38 seconds, a 7.95x speedup."; "The workload did not render cameras or run policy inference. Cameras, policies, scene contents, and physics settings can change both throughput and capacity."; "These are preliminary reference measurements collected for this release" (accessed 2026-11-20)
- Use in dive: section 16 compute cost. Two readings: evaluation scenes are heavy (2,390 steps per second for 1,024 environments, against hundreds of thousands for training tasks in F06-47), and independent runs scale across GPUs almost perfectly, which is the shape of a batch array job. One environment alone runs at 5.4 steps per second: the fixed cost per step is 185 ms, so batching is what makes it usable.

**F06-94. LeRobot v0.7.0's evaluation tool, `lerobot-eval`, runs a checkpoint closed-loop in a batched simulated environment, locally or against an environment server in its own Docker image, and reports the success rate with a 95% Wilson confidence interval (`pc_success_ci95`).**
- Location: huggingface/lerobot at v0.7.0: `docs/source/simulation.mdx` ("Evaluate a checkpoint"); `src/lerobot/scripts/lerobot_eval.py` (lines 96, 716, 742); `src/lerobot/utils/eval_stats.py`.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/utils/eval_stats.py | Tier 1, code at a pinned tag | code behaviour | "A success rate measured over `n` episodes is a binomial estimate, and at the episode counts robot evaluations typically use (10 to 50 per task) its sampling uncertainty is large: 9 successes out of 10 episodes is compatible with a true rate anywhere between roughly 60% and 98%. The helpers here attach that uncertainty to the numbers `lerobot-eval` reports, so that two success rates can be compared honestly." (accessed 2026-11-20)
- Use in dive: section 16, the reader's tool for the arm task and first-party guidance on statistics in one place.

**F06-95. LeRobot's stated statistical guidance: use the Wilson score interval, "preferred over the normal-approximation (\"Wald\") interval because it stays inside [0, 1] and keeps its nominal coverage at small n_trials and at rates near 0% or 100%, which is where robot evaluations live"; compare two policies with Fisher's exact test; and remember the interval covers evaluation sampling only, not "variation between training runs (seeds)".**
- Location: `src/lerobot/utils/eval_stats.py` at v0.7.0, module docstring and docstrings of `wilson_interval` and `fisher_exact`.
- Verdict: NEW
- Evidence: https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/utils/eval_stats.py | Tier 1, code at a pinned tag | definition | "Preferred over the normal-approximation (\"Wald\") interval because it stays inside [0, 1] and keeps its nominal coverage at small `n_trials` and at rates near 0% or 100%, which is where robot evaluations live." ... "Answers \"could these two success rates come from the same underlying rate?\" without any normal approximation, which matters at 10 to 50 episodes per task." ... "The intervals describe *evaluation sampling* noise only, i.e. which episodes happened to be drawn. They do not cover variation between training runs (seeds) of the same recipe, which has to be measured by training more than once." (accessed 2026-11-20)
- Use in dive: section 16, the formula the section should show, and the documented example `wilson_interval(9, 10)` = (0.596, 0.982).

**F06-96. How many real trials published work uses: 12 trials for one task in the Playground paper (12 of 12 successes); 20 real rollouts per policy per environment in PolaRiS; 50 trials per task in ABC. A 2025 statistics paper puts the feasible range at "a small feasible sample size (e.g., 10 or 50) due to significant human effort and limited inference throughput of policies".**
- Location: arXiv 2502.08844v1 Section IV.C; arXiv 2512.16881v2 Section 5.1; arXiv 2606.27375v1 Section 4; arXiv 2503.10966v4 abstract.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2503.10966v4 | Tier 3, peer-reviewed (RSS 2025, per the arXiv comment "Accepted to RSS 2025") | definition | "policy comparison is fundamentally constrained by a small feasible sample size (e.g., 10 or 50) due to significant human effort and limited inference throughput of policies." Others: "Our policy achieves a 100% success rate in 12 real-world trials" (2502.08844v1); "we run 20 real-world evaluation rollouts per policy" (2512.16881v2); "Each task is evaluated for 50 trials." (2606.27375v1) (accessed 2026-11-20)
- Use in dive: section 16, the real-robot trial budget the reader should expect: tens per task and policy.

**F06-97. What 50 trials can and cannot tell [derived]. 40 successes in 50 trials: observed rate 80%, 95% Wilson interval 67.0% to 88.8%. A second policy at 45 of 50 (90%, interval 78.6% to 95.7%) overlaps it, and Fisher's exact test on 45/50 against 40/50 gives p = 0.26: not distinguishable. To detect a true 80% against 90% with 80% power at the 5% level takes about 199 trials per policy.**
- Location: arithmetic in the teaching material, section 16.
- Verdict: NEW [derived]
- Evidence: formulas as implemented in https://github.com/huggingface/lerobot/blob/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/utils/eval_stats.py (Wilson interval; two-sided Fisher exact test) | Tier 1, code at a pinned tag | definition | inputs and steps shown in section 5 of this file. The sample-size figure uses the standard two-proportion normal approximation, which is not in the LeRobot file (accessed 2026-11-20)
- Use in dive: section 16, the worked example. The practical line: with 50 trials, a 10-point difference between two good policies is inside the noise; only differences near 20 points clear it (45/50 against 35/50 gives p = 0.023).

**F06-98. Sequential testing is the published way to spend fewer real trials: instead of fixing the number of trials in advance, test after each pair and stop when the evidence is sufficient, without the p-hacking that comes from extending a fixed-size test (STEP, RSS 2025). Earlier guidance from Toyota Research Institute asks papers to report the number of runs, initial conditions and success criteria and to add statistical analysis (2024, history).**
- Location: arXiv 2503.10966v4, abstract; arXiv 2409.09491v2, abstract.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2503.10966v4 | Tier 3, peer-reviewed (RSS 2025, per the arXiv comment) | definition | "our proposed statistical test is sequential, allowing researchers to decide whether or not to run more trials based on intermediate results. This adaptively tailors the number of trials to the difficulty of the underlying comparison, saving significant time and effort without sacrificing probabilistic correctness." And https://arxiv.org/abs/2409.09491v2 | Tier 3, preprint | "it is common for papers to report this number with little to no information regarding the number of runs, the initial conditions, and the success criteria" (accessed 2026-11-20)
- Use in dive: section 16, guidance on getting it right, ending on the reader's next action: decide the comparison and the stopping rule before the first trial. The promotion gate in arXiv 2608.07555 belongs to stream 04 and is not restated here.

### L. What each workload loads on the machine

**F06-99. CPU physics (MuJoCo `mj_step`) loads CPU cores, one world per thread; the documented scaling recipe is one rollout thread per logical core, and since 4.0 collision and solve can also be multi-threaded inside one large scene. [our reading of F06-8, F06-14, F06-15]**
- Location: synthesis of F06-8 (multi-threaded collision), F06-14 (`testspeed --nthread`), F06-15 (650K and 1.8M steps per second on CPUs).
- Verdict: NEW [our reading]
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/programming/samples.rst | Tier 1, first-party docs at a pinned tag | documentation of support | "The optimal nthread usually equals the number of logical cores." and, on the two kinds of threading, "the scenarios for which one would want these different types of multithreading are usually mutually exclusive" (accessed 2026-11-20)
- Use in dive: section 12 "which part of the machine": CPU cores and cache, no GPU. Evaluating one policy on one arm in MuJoCo is a CPU job; the GPU is busy with the policy network.

**F06-100. GPU physics (MJX-JAX, MuJoCo Warp, Newton, PhysX GPU) loads the GPU's general compute cores and its memory, with a CPU side that still matters: MuJoCo Warp's docs warn that reading data back to the host "requires a device-to-host memory copy and pipeline synchronization", and the Isaac Lab paper reports single-core CPU bottlenecks in PhysX and the training loop.**
- Location: MuJoCo docs at 4.0.1, MuJoCo Warp chapter, "Performance implications" under overflow handling; arXiv 2511.04831v1 Section 4.1 (F06-65).
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco/blob/4ed093a9f06b170bd1564942fa37e1bb907d93e3/doc/mjwarp/index.rst | Tier 1, first-party docs at a pinned tag | code behaviour | "requires a device-to-host memory copy and pipeline synchronization" (accessed 2026-11-20)
- Use in dive: section 12 "which part of the machine": GPU compute (CUDA kernels, not tensor-core matrix multiplies in the sense of a transformer), GPU memory proportional to worlds times worst-case contacts (F06-22, F06-23), plus one fast CPU core driving the loop.

**F06-101. Rendering splits three ways by hardware. Rasterisation (MuJoCo's OpenGL or Filament renderers) uses the GPU's graphics pipeline through EGL, or the CPU through OSMesa. Compute ray tracing (MuJoCo Warp's and Newton's Warp back end, Madrona's CUDA ray tracer) uses general GPU compute. RTX rendering (Isaac Sim, OVRTX, the OptiX back ends) uses the RT cores and is what excludes A100 and H100. [our reading of F06-34, F06-50 to F06-52, F06-61, F06-62]**
- Location: synthesis.
- Verdict: NEW [our reading]. The one link not stated by a first party: that the Warp and Madrona ray tracers run on a GPU with no RT cores at all (U8).
- Evidence: https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/requirements.html | Tier 1, first-party docs | documentation of support | "GPUs without RT Cores (A100, H100) are not supported." (accessed 2026-11-20); with F06-51 "Headless Newton simulation does not require RTX hardware" and F06-62 the OptiX fallback sentence.
- Use in dive: section 13, the decision table that gives the section its title: which renderer, which silicon, which instance family.

**F06-102. GPU memory per environment, from the entries above: state-only physics 57 KB to 468 KB per world in MuJoCo Warp (F06-22); whole training process 0.1 MB to 1.8 MB per environment in Isaac Lab state tasks (0.93 GB to 14.74 GB at 8,192 environments, F06-47); one small camera per environment 1.7 MB to 7.8 MB (13.6 GB to 63.7 GB at 8,192 environments, F06-48 and F06-49); one full-fidelity USD camera about 2 GB (out of memory beyond 48 on 96 GB, F06-63). [derived]**
- Location: arithmetic over F06-22, F06-47, F06-48, F06-49, F06-63.
- Verdict: NEW [derived]
- Evidence: https://github.com/isaac-sim/IsaacLab/blob/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/_static/benchmarks/environment-performance-release.csv | Tier 1, first-party benchmark data at a pinned tag | benchmark claim (vendor reported) | inputs: 0.93 GB / 8192 = 0.11 MB; 14.74 GB / 8192 = 1.80 MB; 13.61 GB / 8192 = 1.66 MB; 63.73 GB / 8192 = 7.78 MB; 96 GB / 48 = 2 GB (accessed 2026-11-20)
- Use in dive: sections 12 and 13, one ladder of four rungs spanning four orders of magnitude. It answers "how many environments fit on a 24 GB L4, a 48 GB L40S, a 96 GB RTX PRO 6000".


### M. Simulator comparison (summary of the entries above, no new claims)

| Simulator | Version and date | Physics runs on | Camera renderer | Licence | Published throughput, with hardware | Entries |
|---|---|---|---|---|---|---|
| MuJoCo | 4.0.1, 2026-11-11 | CPU, one world per thread; `mujoco.batch` for many worlds | OpenGL rasteriser (GLX, EGL, OSMesa) or Filament | Apache-2.0 | humanoid 1.8M steps/s on a 64-core AMD 3995WX; 650K on an Apple M3 Max [vendor claim] | F06-1, F06-15, F06-61 |
| MJX-JAX | ships with MuJoCo 4.0.1 | GPU or TPU through JAX | none of its own; the 2025 Playground paper paired it with Madrona | Apache-2.0 | humanoid 950K steps/s on one A100 at batch 8192 [vendor claim] | F06-15, F06-18, F06-33 |
| MuJoCo Warp | v4.0.1, 2026-11-11 | NVIDIA GPU through Warp | software ray tracer on Warp BVH; OptiX back end on the default branch only | Apache-2.0 | humanoid 5.77M steps/s at 8192 worlds; Aloha pot scene 2.51M; one RTX 6000 Ada, data of 2026-09-03 [vendor claim] | F06-19, F06-20, F06-24, F06-62 |
| MuJoCo Playground | v1.0.1, 2026-11-09 | MuJoCo Warp (PyTorch, RSL-RL) | MuJoCo Warp batch renderer | Apache-2.0 | none for 1.0 (U5); the 2025 JAX code: PandaPickCube 140,386 env-steps/s on one A100 [author reported] | F06-25, F06-32 |
| Newton | v1.8.0, 2026-11-11 | NVIDIA GPU through Warp; several solvers, MuJoCo Warp primary | Warp tiled camera sensor | Apache-2.0 | relative figures only (49% less time than 1.7.0 on one micro-benchmark) [vendor claim] | F06-39 to F06-43 |
| Isaac Lab | v3.0.0, 2026-10-20 | Newton, OvPhysX or Isaac Sim PhysX | Newton Warp, OVRTX, or Isaac RTX (legacy) | BSD-3-Clause per the docs header (the GitHub API reports no detected licence) | Cartpole 1,023,698 training FPS on Newton, 557,215 on PhysX; Franka lift 318,651 and 164,777; 8,192 environments, one RTX PRO 6000 Blackwell Server Edition [vendor claim] | F06-45 to F06-50 |
| Isaac Sim | 6.2.0, 2026-10-14 | PhysX (CPU or GPU), Newton | Omniverse RTX; needs RT cores | not recorded in this pass | none as a standalone figure; see Isaac Lab rows | F06-44, F06-52 |
| Genesis | v1.4.7, 2026-11-17 | not read | not read | Apache-2.0 | no throughput figure in the README at this tag (U14) | none |

### N. Wave 3 (2026-11-20): the camera behind the Isaac Lab 3.0 benchmark, and the SO-101 pick-cube physics timestep

Sources: the Isaac Lab release archive at tag v3.0.0 (commit `e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4`, tag re-checked on 2026-11-20; v3.0.0 of 2026-10-20 is still the newest numbered release) and the MuJoCo Playground archive at tag v1.0.1 (commit `084e7957842792725d70866ee840d8fd79f17bbe`, published 2026-11-09, still the newest tag). Nothing was run.

**F06-103. The camera behind the Isaac Lab 3.0 benchmark's manipulation rows (F06-49, and F04-55 in register 04) is one fixed base camera per environment at 64 x 64 pixels: the `rgb64` preset renders RGB for the Newton renderer rows, and `simple_shading_full_mdl64` renders the `simple_shading_full_mdl` data type at the same 64 x 64 for the two RTX renderers. `single_camera` means the base camera only; the wrist camera belongs to the `duo_camera` variant, which the release rows do not use.**
- Location: Isaac Lab at v3.0.0, `source/isaaclab_tasks/isaaclab_tasks/core/lift/config/kuka_allegro/camera_cfg.py` (class `BaseTiledCameraCfg`, lines 110 to 140) and `kuka_allegro_camera_env_cfg.py` (lines 8 to 9, 66 to 71); `docs/source/_static/benchmarks/environment-performance-release.csv`, column `task_presets` of the 2026-10-12 `Isaac-Lift-KukaAllegro-Camera` rows; `docs/source/_static/benchmarks/README.md`.
- Verdict: NEW (closes U7 for the Kuka-Allegro rows)
- Evidence: https://github.com/isaac-sim/IsaacLab/blob/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/source/isaaclab_tasks/isaaclab_tasks/core/lift/config/kuka_allegro/camera_cfg.py | Tier 1, code at a pinned tag | code behaviour | "rgb64 = replace(BASE_CAMERA_CFG, data_types=["rgb"], width=64, height=64)" and "rgb128 = replace(BASE_CAMERA_CFG, data_types=["rgb"], width=128, height=128)" and "rgb256 = replace(BASE_CAMERA_CFG, data_types=["rgb"], width=256, height=256)" and `kuka_allegro_camera_env_cfg.py`: "Each task is exposed as a :class:`~isaaclab_tasks.utils.PresetCfg` whose ``single_camera`` / ``duo_camera`` variants add base (and wrist) cameras plus the matching image observations" and "default = single_camera". CSV `task_presets` values for the three rows F06-49 quotes: "cube,rgb64,single_camera" (newton_mjwarp, newton_renderer) and "cube,simple_shading_full_mdl64,single_camera" (newton_mjwarp with ovrtx; isaacsim_physx with isaacsim_rtx). README: "Camera comparisons use a single camera with `rgb` for the Newton renderer and `simple_shading_full_mdl` for OV RTX and Isaac Sim RTX (`rgb64` and `simple_shading_full_mdl64` for Kuka tasks)." (accessed 2026-11-20)
- Use in dive: sections 8 and 13. F06-49 and F04-55 can now say "one 64 x 64 camera per environment, 8,192 environments" as a fact read from the preset code, with one caution to print: the Newton row renders plain RGB and the RTX rows render a shaded data type, so the renderer comparison is not pixel-for-pixel the same output. Per step that is 8,192 x 64 x 64 = 33.6 million pixels `[derived: 8192 x 4096 = 33,554,432]`. The CSV's own `camera_resolution` column is empty for every camera row and its `quality_notes` read "dirty working tree reported; resolved camera dimensions not recorded": the 64 x 64 comes from the preset definition, not from a recorded measurement of the run. The rows were measured at commit `cfa9e35c2a756849f3fea4bde9eac947f85a8300` (2026-10-11), nine days before the tag; the README says "The release display label does not verify release-tag source commits."

**F06-104. For the Cartpole camera rows (F06-48) the image size is not settled by the files at the tag, and two readings conflict. The task's camera config sets 96 x 96 (the `rgb` and `simple_shading_full_mdl` presets carry no size suffix and inherit `width: int = 96`, `height: int = 96`), at the tag and at the commit the benchmark ran on. The benchmark export labels the same rows as part of a 64-pixel comparison: every camera row's group name ends in `_R64`, its entry key contains `_r64_8192`, and the README calls the camera set "the fixed 64×64 comparison". The export records no resolved size.**
- Location: Isaac Lab at v3.0.0, `source/isaaclab_tasks/isaaclab_tasks/core/cartpole/cartpole_common.py` (class `CartpoleTiledCameraCfg`, lines 57 to 88); the same file at commit `cfa9e35c2a756849f3fea4bde9eac947f85a8300`; `environment-performance-release.csv` columns `task_presets`, `comparison_group_name`, `source_entry_key`, `camera_resolution`, `quality_notes`; benchmarks `README.md`, "October 12 refresh".
- Verdict: UNKNOWN (U7 stays open for the Cartpole rows; narrowed to two candidate sizes)
- Evidence: https://github.com/isaac-sim/IsaacLab/blob/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/source/isaaclab_tasks/isaaclab_tasks/core/cartpole/cartpole_common.py | Tier 1, code and first-party benchmark data at a pinned tag | code behaviour; documentation | "width: int = 96 / height: int = 96" and "default = BaseCartpoleTiledCameraCfg(data_types=["rgb"])" and "simple_shading_full_mdl = BaseCartpoleTiledCameraCfg(data_types=["simple_shading_full_mdl"])" and "rgb = default". CSV, `Isaac-Cartpole-Camera` rows of 2026-10-12: task_presets "rgb" with comparison_group_name "ISAAC_LAB_SINGLE_GPU_GTL_PRESET_NEWTON_WARP_RGB_E8192_R64" and source_entry_key "benchmark_rsl_rl_Isaac-Cartpole-Camera_r64_8192"; camera_resolution empty; quality_notes "dirty working tree reported; resolved camera dimensions not recorded". README: "Available Cable/Cloth camera runs use 128×128 with unspecified shading presets; they do not qualify for the fixed 64×64 comparison. Missing data is not backfilled. Resolved camera dimensions remain empty when metadata does not record them." (accessed 2026-11-20)
- Use in dive: section 13. Write F06-48's camera as "one small camera per environment (64 x 64 by the benchmark's own label; the task's default config is 96 x 96 and the export does not record which was rendered)". `[our reading]` The `R64` in the group name most likely means a 64-pixel render size forced by the benchmark harness (the Kuka rows, whose preset is explicitly 64 x 64, carry the same suffix, and so does the README's phrase), but the harness that would apply it is NVIDIA's internal runner and is not in the repository: `scripts/benchmarks/training.py` at the tag has no camera or resolution argument. Do not print pixels-per-second for the Cartpole rows. The memory pattern does not decide it either: Cartpole with a camera uses 57 GB against the Kuka task's 13.6 GB (F06-48, F06-49), which a 96 x 96 image alone (2.25 times the pixels `[derived: 96 x 96 / (64 x 64)]`) does not explain.

**F06-105. MuJoCo Playground's SO-101 pick-cube environments step physics every 5 ms. The vision task (`SO101PickCubeVision`) acts every 100 ms, so each policy step runs 20 physics steps; the state-only task (`SO101PickCube`) keeps the 20 ms default, 4 physics steps per policy step. The vision task also raises the convex-collision iteration limit to 300.**
- Location: mujoco_playground at tag v1.0.1: `third_party/reaf_sim/reaf/simulation/torch/_src/builders/config.py` (class `Sim`, lines 24 to 45; `apply_sim_config`, lines 48 to 69); `third_party/reaf_sim/reaf/simulation/torch/_src/core/device_layer.py` lines 80 to 95; `mujoco_playground/tasks/manipulation/pick_cube/task.py` lines 279 to 282; `mujoco_playground/tasks/manipulation/pick_cube/so101/task.py` lines 189 to 193 and 312 to 316; `mujoco_playground/_src/rl/env_registry.py` lines 94 to 103.
- Verdict: NEW (closes U4)
- Evidence: https://github.com/google-deepmind/mujoco_playground/blob/084e7957842792725d70866ee840d8fd79f17bbe/third_party/reaf_sim/reaf/simulation/torch/_src/builders/config.py | Tier 1, code at a pinned tag | code behaviour | "control_timestep: float = 0.02 / simulation_timestep: float = 0.005" and "spec.option.timestep = sim.simulation_timestep". Base pick-cube config: "sim=config.Sim( / nconmax=64, / njmax=256, / )," (no timestep override). SO-101 vision env: "cfg = pick_task.pick_cube_pixels_env() / _configure_so101_robot(cfg) / cfg.sim.ccd_iterations = 300 / cfg.sim.control_timestep = 0.1  # 10 Hz control frequency / cfg.sim.impl = impl". SO-101 state env: "cfg = pick_task.pick_cube_env() / _configure_so101_robot(cfg) / return cfg". Substep count, `device_layer.py`: "timestep_ratio = control_timestep / simulation_timestep_seconds" and "self._n_substeps = round(timestep_ratio)". Registry: "register( / "SO101PickCubeVision", / env_rl_config.PickCubeVisionRslRlOnPolicyRunnerCfg(), / env_cfg_fn=so101_pick_cube.so101_pick_cube_pixels_env, / )". (accessed 2026-11-20)
- Use in dive: section 12 worked example and section 14. `[derived]` 0.1 s / 0.005 s = 20 physics steps per policy step for the vision task; 0.02 / 0.005 = 4 for the state task; physics runs at 200 Hz in both. This replaces the 2 ms default of F06-10 in any arithmetic about this environment: the SO-101 task steps 2.5 times more coarsely than MuJoCo's default timestep. The 0 to 4 ms random command delay of F06-27 is therefore under one physics step. The `nconmax=64` and `njmax=256` lines are per-world contact and constraint capacity limits for the MuJoCo Warp backend ("# warp only" in the `Sim` class).

**F06-106. The other solver settings of the SO-101 pick-cube scene come from the base plane model that every Playground flat scene starts from: the `implicitfast` integrator, elliptic friction cones, `impratio="10"`, and the `eulerdamp` flag disabled. The task code sets no integrator, solver or solver-iteration value, so those stay at whatever the model compiles to; the solver iteration count is not written anywhere in the files read.**
- Location: mujoco_playground at tag v1.0.1: `mujoco_playground/_src/objects/assets/primitive/plane.xml` (the `option` element); `mujoco_playground/tasks/manipulation/pick_cube/task.py` lines 32 to 39 (`_create_base_scene`); `third_party/reaf_sim/reaf/simulation/torch/_src/builders/config.py` lines 31 to 40 and 51 to 68; `mujoco_playground/robots/so101/sim/scene.py` lines 38 to 44.
- Verdict: NEW
- Evidence: https://github.com/google-deepmind/mujoco_playground/blob/084e7957842792725d70866ee840d8fd79f17bbe/mujoco_playground/_src/objects/assets/primitive/plane.xml | Tier 1, code at a pinned tag | code behaviour | "<option timestep="0.005" integrator="implicitfast" cone="elliptic" impratio="10"> / <flag eulerdamp="disable"/> / </option>". Base scene: "def _create_base_scene() -> mujoco.MjSpec: / spec = objects.plane()". `Sim` class: "integrator: mujoco.mjtIntegrator | None = None / iterations: int | None = None / ls_iterations: int | None = None / impratio: float | None = None / cone: mujoco.mjtCone | None = None / solver: mujoco.mjtSolver | None = None" and "if sim.integrator is not None: / spec.option.integrator = sim.integrator". Robot model: "a = asset.get( / "github:google-deepmind/mujoco_menagerie/robotstudio_so101/so101.xml", / )". (accessed 2026-11-20)
- Use in dive: section 12, the settings line under the worked example: timestep 5 ms, `implicitfast`, elliptic cones, `impratio` 10. This matches the Menagerie SO-101 model's own switch to `implicitfast` (F06-37) and MuJoCo's recommendation for servo arms (F06-13). `[our reading]` The robot XML is attached to the plane spec as a child, so the plane's `option` block governs the compiled model; this was read from the code path and not confirmed by compiling the model. The Menagerie reference in `scene.py` names no commit, so the robot XML is whatever the asset loader resolves at install time. Still not stated in the files read: the solver type and the number of solver iterations and line-search iterations (all `None` in the config, so MuJoCo's defaults apply; the default values were not re-fetched in this pass).

## 5. Teaching material

Four concept sections. Every number carries the entry it comes from; arithmetic is shown so it can be redone.

### 5.1 Section 12, Physics Simulation

**The plain-words idea.** A physics simulator is a function that takes the state of a scene (every joint angle and speed, the position of every loose object) plus the motor commands, and returns the state a short moment later. That moment is the timestep, 2 ms by default in MuJoCo (F06-10). A training run calls this function billions of times, so the question the section answers is what one call costs and how many can run at once.

**Worked example on the arm task.**

- Steps per policy action. With a 2 ms timestep and a 30 Hz policy, one policy action lasts 33.3 ms, which is 33.3 / 2 = 16.7 physics steps. A simulator needs a whole number, so the choice is 16 steps (31.25 Hz) or 17 steps (29.4 Hz). The shipped Playground SO-101 pick-cube task avoids the question by running its policy at 10 Hz (F06-27): 100 ms / 2 ms = 50 physics steps per action if its timestep is the 2 ms default. That timestep was not read (U4), so 50 is an illustration.
- Steps per episode. A 30 s episode at 2 ms is 30 / 0.002 = 15,000 physics steps, and 900 policy actions at 30 Hz or 300 at 10 Hz.
- One CPU core. No first-party single-thread figure was located (U1). The nearest published number is 1.8 million steps per second for the humanoid model on a 64-core AMD 3995WX at two threads per core (F06-15). Divided by 128 threads that is about 14,000 steps per second per thread [derived; humanoid, a heavier model than a 6-joint arm]. At that rate 15,000 steps take 15,000 / 14,063 = 1.07 s: one 30 s episode in about one second, roughly 28 times faster than real time. Label this an illustration until stream 08 times the SO-101 model with `testspeed` (F06-14).
- One GPU. MuJoCo Warp's nightly data gives 2.51 million steps per second for a two-arm manipulation scene with 8,192 worlds on one RTX 6000 Ada (F06-20). All 8,192 worlds advance together, so 8,192 episodes of 15,000 steps are 122.9 million steps and take 122.9M / 2.51M = 49 s [derived]. That is 8,192 x 30 s = 68 hours of robot time in 49 seconds. Each world alone moves at 2.51M / 8,192 = 306 steps per second, slower than real time (500 steps per second at 2 ms) and about 46 times slower than one CPU thread. This is the latency against throughput trade the MuJoCo docs state in words (F06-16).
- Same model on both. For the humanoid, the 64-core CPU needs 122.9M / 1.8M = 68 s for those 8,192 episodes and the one GPU needs 122.9M / 5.77M = 21 s [derived from F06-15 and F06-20; the two figures come from different MuJoCo versions and dates].
- Memory. 8,192 worlds of the manipulation scene use 692 MB of GPU memory, about 84 KB per world (F06-22).

**The mechanism.** One `mj_step` runs 26 stages in four groups (F06-9). Position: from the joint angles `qpos`, compute where every body is (forward kinematics), build the inertia matrix `M`, find which shapes touch (collision detection in three phases, broad, mid and near, F06-12) and turn the contacts into constraints. Velocity: compute the forces that depend on speed, such as damping and Coriolis terms. Force: compute the motor torques, then solve for the joint acceleration `qacc` that satisfies the equation of motion and the contact constraints together. In symbols, `M * qacc = tau - c + J^T * f`, where `M` is the inertia matrix, `qacc` the joint accelerations, `tau` the applied torques (motors and passive forces), `c` the Coriolis, centrifugal and gravity terms, `J` the constraint Jacobian (how joint motion moves each contact point) and `f` the contact forces the solver has to find. Integrate: advance `qvel` by `qacc * h` and `qpos` by `qvel * h`, where `h` is the timestep; the integrator choice decides how this is done stably (F06-13). The equation is the standard form; the stage list and names are from F06-9.

The SO-101's servo is one line inside the force stage: `torque = kp * (target - angle) - kd * velocity`, clipped to the motor's limit. The identified values are `kp` 218 to 265, `kd` 17.5 to 34.2 and a limit of 2.94 N m, from the STS3215's 30 kg-cm stall torque (F06-31). With `kp` = 218 the servo saturates at an angle error of 2.94 / 218 = 0.0135 rad, under one degree [derived, assuming SI units and unit gear]. Gains this stiff interacting with contact are the case the `discrete` integrator was added for (F06-13).

Contacts set the cost. A free-moving arm is cheap (25.2 million steps per second for an idle Franka at 32,768 worlds); a cluttered scene with household objects is 342 thousand at 2,048 worlds (F06-20). GPUs handle the branching in collision code poorly (F06-17), and MuJoCo Warp makes the user size the contact and constraint buffers up front (F06-23).

**What it costs in compute.**

- CPU physics loads CPU cores, one world per thread (F06-99). Published: 1.8M steps/s on 64 cores, 650K on an M3 Max, humanoid (F06-15).
- GPU physics loads general GPU compute and GPU memory, and no RT cores (F06-100, F06-51). Published: 5.77M (humanoid), 2.51M (manipulation), 342K (clutter) steps/s on one RTX 6000 Ada (F06-20); 57 KB to 468 KB of GPU memory per world (F06-22).
- A full training loop is slower than raw physics because the policy and its update share the GPU: Isaac Lab 3.0 reports 318,651 training frames per second for a Franka lift task at 8,192 environments on Newton and 164,777 on PhysX (F06-47). In the 2025 Playground paper's vision task, physics was 24% of training time and the policy update 57% (F06-33).
- No throughput has been published for the SO-101 task itself (U3, U5).

### 5.2 Section 13, Rendering and Ray Tracing

**The plain-words idea.** A policy that sees needs a camera image at every action, so the simulator has to draw the scene from the camera's viewpoint. There are two ways to draw. Rasterisation projects each triangle onto the image and fills the pixels it covers. Ray tracing sends a ray out through each pixel and asks what it hits, which gives correct shadows and reflections at a higher cost (F06-56). An RT core is a part of some NVIDIA GPUs built to speed up one step of ray tracing: walking the tree of bounding boxes (the BVH, bounding-volume hierarchy) to find which triangle a ray hits (F06-57).

**Worked example on the arm task.**

- Rays per image. The Playground SO-101 task renders one 64x64 wrist image per action (F06-27): 64 x 64 = 4,096 primary rays. A 640x480 image is 307,200 rays, 75 times more (F06-24).
- Frames per episode. At 10 Hz for 30 s the policy sees 300 frames; 15,000 physics steps sit between them.
- Rendering time against physics time. MuJoCo Warp's published render benchmark is about 756 ns per world per 64x64 frame at 8,192 worlds on an RTX 6000 Ada (F06-24). One batch of 8,192 frames therefore takes 8,192 x 756 ns = 6.2 ms, and 300 batches take 1.9 s. The physics for the same 8,192 episodes took 49 s in 5.1. At 64x64 the renderer is a few percent of the simulation time [derived; the render benchmark is a primitives scene, the physics figure a manipulation scene]. At 640x480 the same arithmetic gives 1.9 s x 75 = 139 s, about three times the physics, using the documented linear scaling with resolution (F06-24).
- Memory is the binding cost. The same render benchmark used 44.4 GB for 8,192 worlds, about 5.4 MB per world, against 84 KB per world for the physics (F06-24, F06-22). In Isaac Lab 3.0, adding one camera to Cartpole cut training throughput from 1,023,698 to 152,124 frames per second (6.7 times) and raised GPU memory from 0.93 GB to 57.3 GB (62 times) (F06-47, F06-48). The benchmark's resolution column is empty (U7).

**The mechanism.** Three hardware paths, and the RT-core question only applies to the third (F06-101):

1. Rasterisation: MuJoCo's OpenGL and Filament renderers. On a headless Linux server the context is EGL (GPU) or OSMesa (CPU software rendering) (F06-61).
2. Ray tracing as ordinary GPU compute: MuJoCo Warp, the Newton Warp renderer and Madrona build a BVH and walk it in CUDA kernels (F06-24, F06-34, F06-50). Direct lighting only in the Newton Warp renderer (F06-50). MuJoCo Warp's docs say an unavailable OptiX back end falls back to this path, which is the first-party evidence that it runs without RTX hardware (F06-62). No vendor statement names A100, H100 or B200 as supported for it (U8).
3. RTX ray tracing: Isaac Sim's Omniverse RTX renderer, OVRTX and the OptiX back ends use the RT cores. This is the path behind "GPUs without RT Cores (A100, H100) are not supported" (F06-52) and behind the AWS rule that G families work and P families do not (F06-60).

Many cameras are drawn in one pass by tiling: every environment's camera gets one tile of a single large frame buffer, which is then cut into per-environment images (F06-64).

**What it costs in compute.**

- Which GPUs have RT cores: A10 72, L40S 142, RTX PRO 6000 Blackwell Server Edition 188; the H100 and H200 pages list none (F06-58, F06-59). On AWS that is G5, G6, G6e and G7e against the P families (F06-60).
- The rule changed in 2026 for training, and the sentence to quote is the Isaac Lab 3.0 install guide: "Headless Newton simulation does not require RTX hardware" (F06-51). The AWS post that excludes the P family was written against Isaac Sim 5.1 (F06-60).
- Vision throughput, one RTX PRO 6000 Blackwell Server Edition, 8,192 environments, manipulation task with a 64-pixel camera: 115,889 training frames per second with the Newton Warp renderer, 97,307 with OVRTX, 27,962 with Isaac Sim PhysX plus Isaac RTX; 13.6 GB, 18.6 GB and 24.2 GB (F06-49).
- A full-fidelity USD camera runs out of memory beyond 48 cameras on a 96 GB GPU (F06-63). The memory ladder per environment is in F06-102.

### 5.3 Section 14, Sim-to-Real and Real-to-Sim

**The plain-words idea.** A policy trained in simulation meets a robot whose motors, friction, timing, calibration and camera image all differ a little from the simulated ones. There are two ways to deal with that, used together. System identification measures the real robot and adjusts the simulator's parameters until the simulated arm moves like the real one. Domain randomisation varies the parameters that cannot be measured well, a different value each episode, so the policy learns to work across the whole range and the real robot is one more case inside it (F06-66). Real-to-sim goes the other way: scan a real scene and rebuild it in the simulator, mostly to evaluate policies there.

**Worked example on the arm task.**

- System identification. The shipped SO-101 script fits 24 numbers, four per joint (armature, friction loss, stiffness, damping) times six joints, from one teleoperated episode in which a person moves the arm through its range (F06-30). Results checked into the repository: stiffness 218 to 265, damping 17.5 to 34.2, friction loss near zero on five joints and 0.25 on the gripper (F06-31).
- Calibration. The deploy guide says manual calibration "can easily be off by 1-2+ cm in end-effector height" (F06-29). For a block a few centimetres across (illustration; the cube size range was read as randomised but not recorded here) that is the difference between closing on the block and closing above it, so the task adds a random joint-reading bias each episode (F06-28).
- Timing. The task injects a command delay of 0 to 4 ms (F06-27): at a 2 ms timestep that is 0 to 2 physics steps of stale command.
- What gets randomised per episode, from the code: fingertip friction, PD gains, joint damping, cube size, cube, floor and link colours, base height by plus or minus 2.5 mm, calibration bias, lighting, camera parameters, and per-pixel image noise (F06-28).
- Outcome. The task is described as deployed "zero-shot onto the real robot" and tested on three setups, with no published success rate (F06-26, U3). The only number of this kind is from the 2025 paper on a Franka arm: 12 of 12 (F06-34), whose 95% Wilson interval is 75.8% to 100% [derived].

**The mechanism.** System identification is a least-squares fit. Record the real joint angles `q_real[t, j]` for each time `t` and joint `j` while replaying known commands. Simulate the same commands with parameter vector `theta` (the 24 numbers) to get `q_sim[t, j](theta)`. Minimise `L(theta) = sum over t and j of (q_real[t, j] - q_sim[t, j](theta))^2`. Gauss-Newton does this by repeated linear steps: `theta <- theta - (J^T J)^-1 J^T r`, where `r` is the vector of all the differences and `J` is how each difference changes when each parameter changes, found by re-simulating with each parameter nudged (F06-30; the update rule is the textbook form of the method the docs name).

Domain randomisation is a reset-time function: before each episode, draw each parameter from its range and write it into that world's model. Under PhysX the physics parameters go through a CPU API (F06-69). Actuator and timing gaps are modelled directly: MuJoCo 4.0 adds `pid` and `dcmotor` actuators and actuator delays (F06-7), Isaac Lab has a delayed PD actuator and learned actuator networks (F06-70).

Real-to-sim: PolaRiS turns a 2 to 5 minute phone-style video into a scene. COLMAP recovers camera poses, 2D Gaussian splatting gives appearance and a mesh, the mesh goes into Isaac Sim for contact (F06-73). The scan alone was not enough; policies are briefly co-trained on simulated demonstrations from other scanned scenes first (F06-74). Splats render natively in Isaac Sim 6.2 as OpenUSD ParticleField geometry (F06-77) and in MuJoCo Warp's batch renderer without RTX (F06-78). The scene format underneath is OpenUSD, whose Core Specification 1.0 is ratified (F06-79).

**What it costs in compute.**

- System identification: a CPU job on one logged episode; no timing published (F06-30).
- Randomisation: CPU-side parameter writes at reset in PhysX (F06-69).
- Scene reconstruction: under 30 minutes on one RTX 4090 for PolaRiS (F06-73). 3DGRUT on an RTX 5090: 479 s to 2,869 s for the ray-traced method, 215 s to 686 s for the rasterised one; the ray-traced method wants RT cores (F06-75).
- What a bad gap costs: a model fine-tuned on real data scored 0% in a simulator where simulation-trained models scored 35% to 45% (F06-72).

### 5.4 Section 16, Evaluation

**The plain-words idea.** There are two ways to score a policy. Open-loop: show it recorded camera frames and compare the action it predicts with the action the human took, as a mean squared error (MSE). Closed-loop: let it drive, in a simulator or on the robot, and count how often the block ends in the cup. Open-loop is cheap and misses what matters, because in a recording the next frame never depends on the policy's own mistake. Closed-loop is the measure that counts, and it is a count of successes out of a small number of trials, so it comes with real uncertainty.

**Worked example on the arm task.**

- 40 successes in 50 real trials. Observed rate `p` = 0.80, `n` = 50, `z` = 1.96 for 95%. Wilson interval: centre = `(p + z^2 / 2n) / (1 + z^2 / n)` = (0.80 + 0.0384) / 1.0768 = 0.7786. Half-width = `z * sqrt(p(1 - p)/n + z^2 / 4n^2) / (1 + z^2 / n)` = 1.96 x sqrt(0.0032 + 0.000384) / 1.0768 = 0.1090. Interval: 67.0% to 88.8% (F06-97). The simpler normal-approximation interval gives 0.80 plus or minus 1.96 x sqrt(0.8 x 0.2 / 50) = 68.9% to 91.1%.
- Comparing two checkpoints. 45 of 50 against 40 of 50: Fisher's exact test gives p = 0.26, no evidence of a difference. 45 of 50 against 35 of 50 gives p = 0.023. With 50 trials each, a 10-point gap is invisible and a 20-point gap is visible [derived, F06-97].
- How many trials a 10-point gap needs. About 199 per policy to tell a true 80% from a true 90% with 80% power at the 5% level; about 81 per policy for 60% against 80% [derived, F06-97].
- More trials narrow the interval slowly: 80 of 100 gives 71.1% to 86.7%, 160 of 200 gives 73.9% to 85.0% [derived].
- Small counts in papers: 9 of 10 has an interval of 59.6% to 98.2%; 12 of 12 has 75.8% to 100% [derived; trial counts in F06-96].

**The mechanism.**

- Open-loop metric: `MSE = mean over frames of ||a_pred - a_demo||^2`, with `a_pred` the policy's action and `a_demo` the recorded one. Across policies it ranked poorly against real success: Pearson r = 0.308 in SIMPLER, against 0.924 for closed-loop simulation (F06-81); the same finding on 2025 models (F06-82), from the ICRA 2026 challenge (F06-85) and from an AWS engagement (F06-86). Within one training run, one 2026 study found validation action error did track real performance (F06-84); see section 8.
- Closed-loop in a physics simulator: `lerobot-eval` runs the checkpoint in batched environments and reports the success rate with its Wilson interval (F06-94, F06-95). Benchmarks saturate: nearly all tested policies score 90 to 95% on LIBERO while spanning the range in the real world (F06-82), which is why perturbed successors exist (F06-87).
- Closed-loop in a scanned twin: PolaRiS, r = 0.9 on average against real results (F06-83).
- Closed-loop in a video world model: the policy acts, a video model generates what the camera would see, a vision-language model judges success (F06-89, F06-90). Authors report r between 0.78 and 0.99; a third-party test found one open video model mis-ranked policies (F06-90).
- The real reference: RoboArena's double-blind pairwise comparisons (F06-88).
- Spending fewer real trials: sequential testing stops when the evidence is sufficient (F06-98).

**What it costs in compute.**

- Simulated evaluation, camera-free: 2,390 environment-steps per second at 1,024 environments on one RTX 5880 Ada in Isaac Lab-Arena; eight GPUs gave 7.95 times the throughput for independent runs (F06-93). With cameras and a real policy in the loop the figure is lower and unpublished there.
- World-model evaluation: about 100 H100 GPU-hours for 8 policies and 4,186 rollouts (F06-89), so 12.5 GPU-hours per policy and 100 x 3,600 / 4,186 = 86 GPU-seconds per 30 s rollout [derived]. It loads GPU tensor compute (video generation) and a judge model, and no RT cores.
- Scanned-twin evaluation: 50 simulated rollouts per task in Isaac Sim, which needs RT cores (F06-83, F06-52).
- Real evaluation: 10 to 50 trials per task is the stated feasible range, limited by people (F06-96).

## 6. Stale or wrong in the seed research

| Seed file | Seed claim | What the source says now | Entry |
|---|---|---|---|
| seed 02, section 3 table | MuJoCo Warp humanoid at 8192 worlds: "9.58M non-deterministic" steps/s on RTX PRO 6000 Blackwell (the seed labelled it unofficial) | WRONG as a project figure: it is from the description of pull request 1932 by an external contributor, closed without merging. The project's nightly data: 5.77M steps/s on an RTX 6000 Ada (2026-09-03) | F06-20, F06-21 |
| seed 02, section 3 | Isaac Sim 6.2.0 "Updated Newton to 1.6.1, with MuJoCo and MuJoCo Warp 3.12.0", read as the current versions | STALE: MuJoCo and MuJoCo Warp are at 4.0.1 (2026-11-11), Newton at 1.8.0 (2026-11-11). Isaac Lab 3.0.0 still pins Newton 1.6.1 | F06-1, F06-19, F06-40 |
| seed 02, section 3 table | "Newton 1.0 GA (GTC, 2026-03-16)" | The v1.0.0 tag on GitHub was published 2026-04-13; the NVIDIA blog was not re-fetched, so the March date is unverified here. Contradiction, see section 8 | F06-40 |
| seed 02, section 3 | MuJoCo Playground known only through the February 2025 paper (JAX, MJX, Madrona) | STALE: Playground 1.0.0 (2026-11-06) is a PyTorch and MuJoCo Warp rebuild with a first-party SO-101 pick-cube sim-to-real task and SO-101 system identification | F06-25, F06-26, F06-30 |
| seed 02, section 3 | "The P family is not [compatible], because it uses data center GPUs without RT Cores" presented as the rule for Isaac workloads, with a 2026 exception inferred | STALE in scope: the AWS post was written against Isaac Sim 5.1. Isaac Lab 3.0's install guide: "Headless Newton simulation does not require RTX hardware". The rule still holds for RTX rendering and Isaac Sim itself | F06-51, F06-52, F06-60 |
| seed 02, section 5 | "3DGRUT (NVIDIA, v2.0.0 June 2026)" | WRONG: the newest release is v1.1.0, published 2026-06-10 | F06-75 |
| seed 02, section 5 | 3DGRUT exports custom NuRec USDZ, to be "deprecated and replaced by ParticleField" | Partly STALE: Isaac Sim 6.2.0 docs describe ParticleField rendering as native; the 3DGRUT README at v1.1.0 still describes the Isaac Sim 5.0 beta path | F06-76, F06-77 |
| seed 02, section 6 table | WorldGym "(ICLR 2026)", r = 0.78, within 3.3%: "numbers from search summary, NOT VERIFIED" | Numbers verified from the paper (arXiv v3). The ICLR venue was not confirmed; cite as preprint | F06-90 |
| seed 02, section 6 table | HF-WM r = 0.983, MMRV 0.002, 6 policies, 540 evaluations: not fetched | Verified from arXiv 2610.13522v1 | F06-90 |
| seed 02, section 6 | RoboWorld cited at v3 | v4 of 15 Jul 2026 is the latest; the figures used (r = 0.989, 100 H100 GPU-hours, 4,186 rollouts, 8 policies) are in v4 | F06-89 |
| seed 02, section 6 | Isaac Lab-Arena multi-GPU runs "on L40s" | The page says L40 GPUs (48 GB), a different card from the L40S. The seed's wording reads as a plural but is easy to misquote | F06-93 |
| seed 02, section 6 | LIBERO described as close to saturated, with no successor named | LIBERO-Plus and LIBERO-PRO (2025) are the named successors and both report collapses under perturbation | F06-87 |
| seed 04, section 4 | 1X world-model evaluation presented as current practice | The first-party post located is from 2024-09-17 and publishes no correlation figure; no 2026 quantified publication was located (U12) | F06-91 |

## 7. Mental models worth teaching

1. **A simulator is a step function called billions of times.** State and command in, state 2 ms later out; 15,000 calls per 30 s episode. Everything about cost follows from what one call does and how many run side by side (F06-9, F06-10).
2. **CPU for one fast world, GPU for thousands of slow ones.** One CPU thread steps a world far faster than real time; one GPU world steps slower than real time, but 8,192 of them advance together. Latency against throughput (F06-15, F06-16, F06-20).
3. **Contacts are the cost.** An idle arm runs at 25 million steps per second; a cluttered tabletop at 342 thousand. A pick-and-place task lives at the expensive end (F06-11, F06-17, F06-20).
4. **Physics is cheap in memory, pixels are not.** Tens of kilobytes per world for state, megabytes per world once a camera is added, about 2 GB for one full-fidelity camera. The camera decides how many environments fit on a GPU (F06-22, F06-24, F06-48, F06-102).
5. **Three renderers, one of which needs RT cores.** Rasterisation, ray tracing written as ordinary GPU compute, and RTX. Only the third excludes A100 and H100, so the G-family rule belongs to the renderer choice, and physics alone runs on any recent NVIDIA GPU (F06-51, F06-52, F06-62, F06-101).
6. **Measure what can be measured, randomise the rest.** System identification fits 24 servo numbers from one teleoperated episode; domain randomisation covers friction, colours, lighting, calibration error and delay (F06-28, F06-30, F06-66).
7. **The gap is mostly unglamorous.** On this arm the named sources are a calibration error of 1 to 2 cm, servo gains, and a few milliseconds of command delay (F06-27, F06-29, F06-31, F06-71).
8. **Low action error is a weak promise.** Across policies, open-loop MSE ranks poorly against real success; only running the policy in a loop tests recovery from its own mistakes (F06-81, F06-82, F06-85, F06-86).
9. **A success rate is a count, and counts are noisy.** 40 of 50 means somewhere between 67% and 89%. Two policies ten points apart cannot be told apart with 50 trials each; that takes about 200 (F06-95, F06-97).
10. **Cheap evaluators are calibrated against an expensive one.** Simulators, scanned twins and video world models are all scored by how well they reproduce a real-robot ranking, and each needs that reference to exist (F06-83, F06-88, F06-89, F06-90).

## 8. Contradictions between sources

1. **Does offline action error predict real performance?** SIMPLER (r = 0.308 for MSE), PolaRiS, the REAL-I challenge report and the AWS engagement say it is a poor predictor (F06-81, F06-82, F06-85, F06-86). The ABC study reports statistically significant correlations between validation action error and real performance (F06-84). [our reading] The two are about different comparisons: ABC tracks checkpoints and variants of one policy family on its own data, the others rank different policies. ABC also finds validation loss uncorrelated and warns that offline metrics cannot predict success rates. Teach it as "useful for picking a checkpoint, not for ranking policies".
2. **Do RT cores gate Isaac workloads?** AWS (2026-06-09) says the P family is not compatible (F06-60); the Isaac Sim 6.2.0 requirements page says A100 and H100 are not supported (F06-52); the Isaac Lab 3.0 install guide says headless Newton simulation does not require RTX hardware (F06-51). All three are true for their scope: Isaac Sim and RTX rendering need RT cores, a Newton-only Isaac Lab install does not. No first-party page names a non-RTX data-centre GPU as tested for the Warp renderers (U8).
3. **When did Newton reach 1.0?** The seed has "GTC, 2026-03-16" from an NVIDIA blog; the GitHub v1.0.0 release was published 2026-04-13 (F06-40). The blog was not re-fetched. Also, v1.8.0 is dated 2026-11-11 on GitHub and 2026-11-12 in its changelog heading.
4. **How do splats reach Isaac Sim?** The 3DGRUT README at v1.1.0 describes a beta custom USDZ path tied to Isaac Sim 5.0 (F06-76); the Isaac Sim 6.2.0 docs describe native ParticleField rendering (F06-77). The docs are newer and are the authority for 6.2.
5. **How well do video world models rank policies?** Their authors report r = 0.78 to 0.989 (F06-89, F06-90). The PolaRiS authors, testing someone else's open video model, found it mis-ranked policies (MMRV 0.22) and hallucinated during object interaction (F06-90). Every strong figure is author reported on the authors' own model.
6. **Which MuJoCo Warp throughput?** A pull-request description gives 9.58M steps per second (F06-21); the project's nightly page gives 5.77M on different hardware (F06-20). The nightly page is the first-party figure; its newest row is 11 weeks old (U2).
7. **Isaac Lab's licence.** The docs header states BSD-3-Clause; the GitHub API returns no detected licence for the repository. Not resolved here; the comparison table says so.

## 9. UNKNOWN register

| ID | Unknown | Where it arises | What would close it |
|---|---|---|---|
| U1 | No first-party single-thread MuJoCo steps-per-second figure, and none for the SO-101 model | F06-14, F06-15, section 5.1 | A Tier 0 `testspeed` run on the Menagerie `robotstudio_so101` model (stream 08) |
| U2 | The MuJoCo Warp nightly benchmark page has no row after 2026-09-03; no data at v4.0.1 | F06-20, F06-22, F06-24 | A newer row on the nightly page, or our own run of the benchmark suite |
| U3 | No published success rate for Playground's `SO101PickCubeVision`, nor for NVIDIA's SO-101 typing project | F06-26, F06-55 | A first-party number, or our own trials with a Wilson interval |
| U4 (CLOSED by wave 3, 2026-11-20: 5 ms physics step, 100 ms control step and 20 substeps for the vision task, 20 ms and 4 for the state task, F06-105; integrator and cone settings F06-106; solver iteration counts are not set in the files read) | The physics timestep of the Playground SO-101 environment was not read | F06-27, section 5.1 | Read the SO-101 scene XML and environment config at v1.0.1 |
| U5 | Playground 1.0 publishes no throughput; a profiling suite exists without numbers | F06-25, F06-32 | Run the profiling suite (Tier 0), or a first-party table |
| U6 | Whether a specific EnvHub or LeIsaac SO-101 environment is current; LeIsaac v0.4.0 (2026-04-15) was not read | F06-38 | Read the LeIsaac repository and the EnvHub listing at pinned refs |
| U7 (wave 3, 2026-11-20: CLOSED for the Kuka-Allegro rows, one 64 x 64 base camera, F06-103; STILL OPEN for the Cartpole rows, where the task config says 96 x 96 and the benchmark label says 64, F06-104. Tried: task configs at the tag and at the benchmark commit, the benchmarks README, every CSV column, `scripts/benchmarks/training.py`) | The camera resolution behind the Isaac Lab Cartpole-Camera benchmark rows (the CSV column is empty) | F06-48 | Read the task config at v3.0.0 |
| U8 | No first-party statement that the Newton Warp, MuJoCo Warp or Madrona ray tracers are supported on GPUs without RT cores (A100, H100, B200) | F06-51, F06-62, F06-101 | A vendor support matrix, or a Tier 0 run on a P-family instance |
| U9 | The A100 and B200 product pages and an A10G-specific datasheet were not fetched | F06-58, F06-59 | Fetch those pages |
| U10 | No throughput figure for Gaussian-splat rendering in MuJoCo Warp | F06-78 | A benchmark row, or our own run |
| U11 | The SimReady Foundation specification pages were not fetched | F06-80 | Fetch the specification |
| U12 | No 2026 1X publication with a quantified world-model evaluation result was located | F06-91 | A first-party 1X post or paper with a correlation figure |
| U13 | Isaac Lab-Arena's current version: no tags or releases; a `release/0.4.0` branch exists without an announcement | F06-92 | A release or discussion post |
| U14 | Genesis v1.4.7: no first-party throughput figure in the README; physics and renderer details not read | comparison table | Read the Genesis docs at the tag |
| U15 | The NVIDIA Newton 1.0 blog and its "252x" and "475x" speed-up claims were not re-fetched, so they are not carried | section 6, section 8 | Re-fetch the blog |
| U16 | The MSE and LIBERO correlation values in the PolaRiS comparison figure were not extracted as numbers | F06-82 | Read the figure data in arXiv 2512.16881v2 |
| U17 | Seed rows for Gazebo, CARLA, ManiSkill3, the NuRec docs archive and the World Labs Marble post were not re-fetched and are not carried | seed 02, sections 3 and 5 | Re-fetch each source |
| U18 | Venues not confirmed for SIMPLER, RoboArena, WorldGym and the Playground paper; all cited as preprints | section 3 | Check the proceedings |
| U19 | Units and gear of the SO-101 actuator gains were assumed (SI, unit gear) for the saturation arithmetic | section 5.1 | Read the actuator definitions in the SO-101 XML |
| U20 | Isaac Sim's licence was not recorded; Isaac Lab's licence is reported differently by its docs and the GitHub API | comparison table | Read the LICENSE files at the pinned tags |

## 10. Reading path for Carlos

1. **MuJoCo 4 announcement** (github.com/google-deepmind/mujoco, discussion 3773), the "Then and Now" table and the sim-to-real paragraph. Ten minutes that update the whole MuJoCo picture to November 2026.
2. **MuJoCo docs, "Computation" chapter** at tag 4.0.1 (`doc/computation/index.rst`), the simulation pipeline list. The 26 stages of one step; this is section 12's backbone.
3. **MuJoCo docs, MuJoCo Warp chapter** at tag 4.0.1 (`doc/mjwarp/index.rst`): the performance section (latency against throughput) and "Batch Rendering". Then the nightly benchmark page for the numbers.
4. **MuJoCo Playground v1.0.1**: `tasks/manipulation/pick_cube/so101/deploy/README.md`, then `task.py` in the same directory, then `docs/sysid.rst`. This is the dive's thread task as shipped code: the randomisation list, the 10 Hz loop, the 64x64 camera, the calibration warning.
5. **Isaac Lab v3.0.0 release notes**, then `docs/source/isaaclab/installation.rst` (the hardware split) and `docs/source/concepts/renderers.rst`. One page each for "which back end" and "which renderer".
6. **Isaac Lab release benchmark CSV** (`docs/source/_static/benchmarks/environment-performance-release.csv`). Sort by task; compare the camera rows with the state rows. This is where the cost of a camera is visible.
7. **Isaac Sim 6.2.0 requirements page**, the GPU table and the RT-core sentence. Then the AWS post of 2026-06-09, the instance compatibility paragraph, with its Isaac Sim 5.1 date in mind.
8. **PolaRiS** (arXiv 2512.16881v2): the method figure, the correlation results, and the baseline comparison with MSE and LIBERO. Real-to-sim and evaluation in one paper.
9. **LeRobot v0.7.0, `src/lerobot/utils/eval_stats.py`**: the docstring on the Wilson interval. Twenty lines that carry section 16's statistics.
10. **RoboWorld** (arXiv 2607.01060v4), abstract and the cost paragraph; then the PolaRiS paragraph on Ctrl-World as the counterweight.
11. **AWS Physical AI post of 2026-09-09**, the evaluation section: the open-loop against closed-loop lesson from a customer engagement.

## 11. Source list by tier

**Tier 0 (our experiments):** none in this register. U1, U5 and U8 are candidates for stream 08.

**Tier 1 (code at a pinned ref, official docs, first-party benchmark data)**
- google-deepmind/mujoco at 4.0.1 (4ed093a9f06b170bd1564942fa37e1bb907d93e3) and default branch at 23c23e0dc1643e99bb2a0abaf5dc4cf873e0bd77
- google-deepmind/mujoco_warp at v4.0.1 (2db59f4d929dab714d85fab946d93427d2aa56e7) and commit 917a14b77735944140b66345325c8a14f2fe6be7; nightly benchmark page
- google-deepmind/mujoco_playground at v1.0.1 (084e7957842792725d70866ee840d8fd79f17bbe)
- google-deepmind/mujoco_menagerie at 370c43965323c0944b433b202aac5058b5f907a9
- TheRobotStudio/SO-ARM100 at 141aea7bcac2744d92998e30268c413202a56f96
- newton-physics/newton at v1.8.0 (425db81f01e402b51f96f560e154d529d645c6de) and default branch at 9bd0215d9c82508ea8d759c41df1b4577423d6ea
- isaac-sim/IsaacSim at v6.2.0 (74a9356b20250dd60337d90b4b4d913c9454d32b); Isaac Sim 6.2.0 documentation (requirements, NuRec assets)
- isaac-sim/IsaacLab at v3.0.0 (e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4), including the release benchmark export
- isaac-sim/IsaacLab-Arena at 2281e1256bd10bf9b62b67ccccec9c87cd51fc6f; its performance documentation page
- huggingface/lerobot at v0.7.0 (410c095eacc0011d998a73383eb94abed2715af0)
- nv-tlabs/3dgrut at v1.1.0 (0a5832248698ab8456b181d6ea17fe02eda58637)
- Genesis-Embodied-AI/Genesis at v1.4.7 (0a9e28ac6af9206baf26285f7b71104d670a5e51), README only
- NVIDIA product pages: A10, L4, L40S, RTX PRO 6000 Blackwell Server Edition, H100, H200

**Tier 2 (first-party vendor or lab posts, announcements, pull-request descriptions)**
- MuJoCo 4 announcement, google-deepmind/mujoco discussion 3773 (2026-11-07)
- Isaac Lab-Arena v0.3 announcement, discussion 1245 (2026-09-10)
- mujoco_warp pull requests 1113 (merged) and 1932 (closed, unmerged; external contributor, cited only to trace a seed figure)
- AWS Machine Learning blog, Isaac Lab on Amazon SageMaker AI (2026-06-09)
- AWS Physical AI blog, Telexistence DreamZero experiment (2026-09-09)
- NVIDIA developer page on ray tracing
- Alliance for OpenUSD, Core Specification 1.0 post
- 1X, world model post (2024-09-17; history)

**Tier 3 (papers)**
- Peer-reviewed (venue confirmed from the arXiv comment): STEP, arXiv 2503.10966v4 (RSS 2025)
- Preprints: 2502.08844v1 (MuJoCo Playground), 2511.04831v1 (Isaac Lab), 2512.16881v2 (PolaRiS), 2506.18123v2 (RoboArena), 2607.01060v4 (RoboWorld), 2506.00613v3 (WorldGym), 2610.13522v1 (HF-WM), 2606.27375v1 (ABC), 2609.13679v2 (REAL-I challenge report), 2510.13626v3 (LIBERO-Plus), 2510.03827v2 (LIBERO-PRO)
- History, before 2025: 1703.06907v1 (domain randomisation, 2017), 2405.05941v1 (SIMPLER, 2024), 2409.09491v2 (TRI best practices, 2024)

**Tier 4:** none cited. Searches were used only to locate the sources above.
