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

(Rows for Isaac Lab-Arena, papers and docs are added below as they are fetched.)

## 3. Pinned sources

See the tables at the end of this section; they are completed as the register grows.

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
- Use in dive: section 13, a ray tracer that is ordinary GPU compute: it walks a tree in CUDA kernels and does not call the RTX hardware path (see F06 section G for the RT-core question). Also the cost shape: a 64x64 image is 4,096 rays; a 640x480 image is 307,200 rays, 75 times more [derived].

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

**F06-49. On a manipulation task with a 64-pixel camera (Kuka arm with Allegro hand lifting a cube, 8,192 environments, same GPU): Newton plus Newton Warp renderer 115,889 training FPS at 13.6 GB; Newton plus OVRTX 97,307 at 18.6 GB; Isaac Sim PhysX plus Isaac RTX 27,962 at 24.2 GB. The same task without a camera: Newton 220,831 at 7.2 GB; Isaac Sim PhysX 60,757 at 17.1 GB. [vendor claim]**
- Location: same CSV, `Isaac-Lift-KukaAllegro-Camera` and `Isaac-Lift-KukaAllegro` rows of 2026-10-12.
- Verdict: NEW
- Evidence: https://github.com/isaac-sim/IsaacLab/blob/e3f7d9ff1f5d7f8280de3ece9000b7117f66bcf4/docs/source/_static/benchmarks/environment-performance-release.csv | Tier 1, first-party benchmark data at a pinned tag | benchmark claim (vendor reported) | rows: "Isaac-Lift-KukaAllegro-Camera, newton_mjwarp, newton_renderer, 115888.50, vram 13.61, presets cube,rgb64,single_camera"; "newton_mjwarp, ovrtx, 97306.60, vram 18.58, cube,simple_shading_full_mdl64,single_camera"; "isaacsim_physx, isaacsim_rtx, 27962.00, vram 24.22"; "Isaac-Lift-KukaAllegro, newton_mjwarp, none, 220831.00, vram 7.21"; "isaacsim_physx, none, 60756.60, vram 17.13" (accessed 2026-11-20)
- Use in dive: section 13, the manipulation-task version of F06-48: on a contact-heavy task the camera halves throughput (220,831 to 115,889, a factor of 1.9 [derived]) instead of dividing it by seven, because physics already dominates.

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

