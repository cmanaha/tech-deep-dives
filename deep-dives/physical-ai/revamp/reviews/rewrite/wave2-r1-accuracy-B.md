# Wave 2 round 1 accuracy review B: sections 12, 13 and 14

Reviewer B. Judged against the current source files and the registers in `research/2026-11/`. Accuracy only.

## Section 12, Physics Simulation (`src/sections/PhysicsSimulation.tsx`)

### Findings

1. **error.** "A simulation of this arm that goes unstable at 0.005 s has two documented changes to make on that `option` element: a smaller `timestep`, paid for in calls per simulated second, or `integrator="discrete"`."
   - Register: F06-105 (cited in the same block), F06-106.
   - What the entries say: Playground's `apply_sim_config` writes `spec.option.timestep = sim.simulation_timestep` unconditionally (F06-105 evidence), so the 0.005 in `plane.xml`'s `option` element is overwritten by the `Sim` config's `simulation_timestep`. The `Sim` class also has an `integrator` field that overrides the option when set (F06-106: "if sim.integrator is not None: spec.option.integrator = sim.integrator"). A reader who edits `timestep` on the `option` element changes nothing in the shipped task.
   - Fix: say the two changes are made through Playground's `Sim` config (`simulation_timestep`, `integrator`), or drop "on that `option` element".

2. **minor.** "Rule out the simulator itself first: MuJoCo 4.0.0 shipped a fault in a matrix factorisation that one of its constraint solvers relies on, "causing slow convergence, wrong accelerations and divergence", and 4.0.1 fixed it."
   - Register: F06-2.
   - What the entry says: the fault gave the Newton solver a wrong Hessian factor "when the constraint Jacobian is sparse". The condition is dropped.
   - Fix: add "when the constraint Jacobian is sparse" (or "in some models").

3. **minor.** "Both the Menagerie model and the pick-cube scene select `implicitfast`, the general choice, so `discrete` is the documented next step when a grasp goes unstable."
   - Register: F06-13.
   - What the entry says: the docs say "Choose discrete when stiff springs, position servos or strong damping interact with contacts". They name the case, not a remedy sequence after instability. "the documented next step when a grasp goes unstable" is our reading presented as documentation.
   - Fix: "so `discrete` is the integrator the documentation names for this case, and the one to try when a grasp goes unstable".

4. **minor.** "Inside Isaac Lab that choice is worth a factor of about two in speed and nearly three in memory."
   - Register: F06-47.
   - What the entry says: the "nearly three" is the Franka-lift row only (14.74 / 5.41 = 2.7). The same benchmark's other state-only rows give 7.12 / 0.93 = 7.7 (Cartpole) and 8.04 / 1.74 = 4.6 (Franka reach); speed ratios are 1.8 to 1.9. The general sentence widens one row.
   - Fix: "On the Franka lift task that choice is worth ...", or "about two in speed and three to eight in memory".

5. **minor.** Throughput chart caption: "The top three bars are our single runs, the rest vendor figures from other machines and MuJoCo versions."
   - Register: F08-73, F06-15, F06-20 (no entry carries the dropped clause; it was the page's own hedge).
   - What changed: the before caption also said the humanoid model files "were not checked to be identical, so compare lengths by order of magnitude only". The order-of-magnitude hedge survives in the opener for the 704 and 80 ratios, but not in the caption or beside the 101 cores, 3.2 times and 11 minutes / 36 minutes / 19 hours derived from the same bars.
   - Fix: restore "compare lengths by order of magnitude only" in the caption.

6. **minor.** "even at 468 KB a 48 GB card holds about 48,000,000 / 468 = 100,000 worlds if memory grows in proportion, far past the recipe's 4,096. Capacity does not bind at these counts."
   - Register: F06-22, F04-58.
   - What the entries say: the per-world figures are state-only physics (F06-22: "State-only physics is cheap in memory"). The recipe of F04-58 is the vision task, whose 4,096 worlds also render a camera (section 13 prices that memory). "Capacity does not bind" holds for physics memory only.
   - Fix: "Physics memory does not bind at these counts; the vision recipe's camera memory is section 13's."

7. **minor.** "Physics alone needs ordinary GPU compute and memory, and none of the ray-tracing hardware a simulated camera can call for. The Isaac Lab install guide says so in one line, "Headless Newton simulation does not require RTX hardware""
   - Register: F06-51, F06-100.
   - What the entries say: the guide's sentence covers headless Newton (F06-51 use note: "The sentence covers headless simulation"); it says nothing about PhysX through Isaac Sim, which keeps its own requirements. "says so" equates a Newton-only statement with all GPU physics. (Carried from the before text.)
   - Fix: "For Newton the Isaac Lab install guide says so in one line".

### Checked and correct (summary)

Opener: 57,240 steps/s on one X925, single run, MuJoCo 4.0.1, humanoid stand-in (F08-61, F08-73); 0.005 s humanoid timestep and 57,240 x 0.005 = 286 (F08-61 use note); one-scene jobs on CPU (F06-16); 4,096 x 16 x 3,000 = 196,608,000 (F04-58); 20 substeps and 196,608,000 x 20 = 3,932,160,000 (F06-105); 5.77 million at 8192 worlds on one RTX 6000 Ada, row of 2026-09-03, owner kept (F06-20); 5,765,714 / 8192 = 704; 57,240 / 704 = 81, "about 80"; 5.77M / 57,240 = 101; order-of-magnitude hedge kept. Section 2: state contents; Menagerie derivation and primitive collision shapes (F06-37); default 0.002 s and 500 calls (F06-10); 0.005 s, 2.5 times, 200 calls, 40% (F06-105); "single most important" and too large / too small (F06-10, F06-13); real-time bar (F06-10); 100 ms / 20 substeps, `SO101PickCube` 20 ms / 4 / 50 (F06-105); `round(timestep_ratio)` (F06-105); 30 Hz / 33.3 ms (F07-23, section 3 says "30 times a second, once every 33.3 ms"); 6.67 rounds to 7, 35 ms, 28.6 per second. Section 3: 26 stages in four groups and stage contents (F06-9); solver/iterations/ls_iterations exposed and unset (F06-106); equation and symbols (F11-200); four constraint types, friction loss as a constraint, J rows (F11-211); friction loss on every joint (F11-212; F06-31 "near zero" is non-zero); semi-implicit Euler "standard in physics simulation" (F11-201); toy arithmetic 1.010 and 0.50505; `plane.xml` option `timestep="0.005" integrator="implicitfast"` (F06-106); implicitfast recommendation (F06-13); implicit-in-velocity update keeps the position line (F11-210). Section 4: floating objects quote (F06-11); three collision phases and quote (F06-12); Franka 25.2M at 32768, Aloha pot 2.51M at 8192, clutter 342K at 2048 (F06-20); 769, 306, 167 and 769 / 167 = 4.6; softer constraints and larger timesteps (F06-11); gripper defaults quote (F06-37); discrete quote (F06-13); gains 218 to 265 from teleop data (F06-31); 4.0.1 release (F06-1). Section 5: one world per thread, logical cores (F06-14); latency against throughput (F06-16); `nconmax=64`, `njmax=256` per world (F06-105); scale-with-limits advice and memory quote (F06-23); branchless broad phase (F06-17); 650K, 1.8M at 2 x cores, 950K at 8192 on A100 (F06-15); MJX-Warp quote (F06-18); chart bars and labels match F08-61, F08-73, F06-15, F06-20; 5.77 / 1.8 = 3.2; 3,932,160,000 / 5.77M = 681 s, / 1.8M = 2,184 s, / 57,240 = 68,696 s (11 min, 36 min, 19 h); 466 MB / 8192 = 57 KB, 84 KB, 468 KB, 468 / 84 = 5.6, 48 GB card (F06-22, F06-20); 48,000,000 / 468 = 102,564; Playground paper 24 / 18 / 57% on an RTX 4090, author-owned, 12% (F06-33). Section 6: MJX over MJX-JAX and MJX-Warp and their hardware (F06-18); Isaac Lab on Newton or PhysX, Isaac Sim optional (F06-45, F06-46); 318,651 / 164,777 FPS, 5.41 / 14.74 GB, Franka lift, 8,192 environments, RTX PRO 6000 Blackwell Server Edition, training FPS includes policy updates (F06-47); table versions and dates (F06-1, F06-19, F06-25, F06-18, F06-45, F06-40, F06-44). Section 7: 0.4% and 22.4% memory-stall cycles, A725 28,662 = 0.50 of X925 (F08-61, F08-62; F08-73 wave 2 keeps the workload rows); "stack of matrix-vector products" (F08-62); section 16 has rollouts and about 199 trials per policy; Turing / compute capability 7.5 (F06-51); single-core CPU dependence, author-owned (F06-65); `testspeed` 10,000 steps and `--nthread` (F06-14); scoped "No figure read on 2026-11-20". Figure `PhysStep` labels unchanged from before and consistent with F06-9 and F06-105 (5 ms, 200 steps, 10 decisions of 20). Cross-references: sections 3, 8, 13, 14, 16 titles match `sections.json`.

**Section 12: about 230 claims checked; 7 findings (1 error, 6 minor).**

## Section 13, Rendering and Ray Tracing (`src/sections/Rendering.tsx`, shared figure `src/components/GpuEngines.tsx`)

### Findings

1. **error.** Shared GPU-units figure (`GpuEngines`, default workload "RTX rendering", also used by section 20): the "General compute cores" row reads "not used by this workload" for RTX rendering (`engines: ['rt', 'memory']`).
   - Register: F06-57, F08-36, F08-76 row 7.
   - What the entries say: RT cores "accelerate BVH traversal, the most time consuming part of the ray tracing calculations" (F06-57): one part of the work, not all of it. NVIDIA's profiling guide lists RT cores as a unit shared inside each multiprocessor and says the SM is optimised for "ray tracing, as well as lighting and shading" (F08-36). F08-76 names RT cores as the part loaded first for RTX renderers, not the only one. The section's own prose agrees: the RTX renderer hands "the walk" to RT cores, and "the general compute cores run every other kind of GPU code". Ray generation and hit shading are that other code. The author's doubt is justified: "not used" is unsupported and contradicts F06-57 and F08-36.
   - Same figure, same kind of overstatement (minor): policy training and inference mark the general compute cores "not used" although F08-42 only says the tensor pipeline runs the MMA instructions (non-matmul layers and the optimiser run as ordinary CUDA code); video decode and encode mark GPU memory "not used" while the memory row itself says "shared: every engine works out of it".
   - Fix: add `'general'` to `rtx-rendering` and say why ("RT cores take the BVH walk; generating the rays and shading what they hit run on the general compute cores"), or change the semantics of the outline and caption to "the unit this workload cannot run without". The change also fixes section 20.

2. **error.** "The rule reaches as far as Isaac Sim and RTX rendering, and no further." and "The renderers of Isaac Sim, Isaac Lab and MuJoCo fall into three groups by where the BVH walk runs. ... RTX rendering hands it to the RT cores, the only group whose documentation asks for them."
   - Register: F06-101.
   - What the entry says: the three-way split is "[our reading]", and "The one link not stated by a first party: that the Warp and Madrona ray tracers run on a GPU with no RT cores at all (U8)". The before text said "The grouping is our reading of the renderers' documentation"; the rewrite drops that, and F06-101 renders as "Tier 1" in the registry, so nothing on the page now marks the grouping as ours. "and no further" is a claim about the world that U8 leaves open (the page itself later says "None was located in this research, so run one on a P-family GPU").
   - Fix: restore "By our reading of the renderers' documentation" in the three-groups paragraph, and write the opener as "The documented rule reaches as far as Isaac Sim and RTX rendering."

3. **minor.** "With 8192 worlds ... on an RTX 6000 Ada, it reports about 756 ns per world per frame."
   - Register: F06-24.
   - What the entry says: the nightly row gives `"render": 756.09` with no unit; "The nanosecond unit is inferred from the physics rows". The unit is our inference inside a sentence owned by the project. (The before text owned only the derived 1.3 million frames per second as "our arithmetic from its timing".)
   - Fix: "it reports a render time of 756 per world per frame, in nanoseconds by the unit its physics rows use".

4. **minor.** "A plain rasteriser stops there: nothing in those steps asks what stands between a surface and the light, so each surface gets only its own shade."
   - Register: none (F06-56 gives only "fast at deciding what is visible"). The before scoped this to the figure: "The rasteriser drawn here does only the two steps described above."
   - What changed: the scope widens from the illustration to a class of renderer. Rasterisers draw shadows with a shadow-map pass (MuJoCo's own OpenGL renderer casts shadows), which is general graphics knowledge and not in any register.
   - Fix: "The rasteriser drawn here stops there".

5. **minor.** EC2 table, row "Newton physics batches with no camera": "G or P: any recent NVIDIA GPU", cited to F06-51 only.
   - Register: F06-51 ("The default CUDA 13 stack requires Turing or newer (compute capability 7.5+)").
   - What changed: the before text said "The family column below is our reading of the entries cited in each row." The sentence is gone. Rows 3 and 4 still carry our-reading citations (F08-85, F08-76) and row 2 says "by our reading", but row 1 now shows a Tier 1 badge alone for our mapping to families, and "any recent" stands in for the guide's compute capability 7.5 or newer.
   - Fix: restore the sentence, or write "G or P: any NVIDIA GPU of compute capability 7.5 or newer (our mapping)".

### Checked and correct (summary)

Opener: Isaac Sim draws cameras with the Omniverse RTX renderer, which requires RT cores (F06-60); RT cores and BVH traversal quote (F06-57); Isaac Sim 6.2.0 sentence on A100 and H100 (F06-52); AWS post of 9 June 2026, against Isaac Sim 5.1, eight P families incompatible, four G families compatible (F06-60, wave 2 note on G7 handled later in the section); MuJoCo built-in renderers rasterise (F06-61); headless Newton needs no RTX hardware and the "camera images or an interactive view" scope (F06-51); Warp ray tracers ask for no RT cores in their documentation, no training GPU named (F06-62, F06-24); Cartpole 1,023,698 FPS including updates, 0.93 GB, 0.11 MB per copy (F06-47); 152,124 FPS, 57.3 GB, 7.0 MB per copy, 6.7 and 62 (F06-48: 6.73 and 61.6). Section 2: two cameras (section 3); 10 Hz and one 64x64 wrist image per step (F06-27); pick only. Section 3: rasterisation and ray tracing definitions (F06-56); BVH quote (F06-57); figure caption 16 x 12 against 64 x 64. Section 4: tensor cores (F08-42), physics on general compute (F06-100). Section 5: renderer table rows (F06-61, F06-24, F06-52); Isaac Sim unsupported as a whole (F06-52); install-guide quotes (F06-51); three Isaac Lab renderers, Newton Warp direct lighting and its recommendation quote, OVRTX recommended, Isaac RTX legacy, Newton Warp pairs with PhysX (F06-50); Warp as Python-to-GPU compiler (F06-39); domain-randomisation quote (F06-66); SO-101 randomisation list (F06-28); 12 of 12 real trials, author-owned, CUDA ray tracer (F06-34); "Newton Warp has the highest throughput" quote, Warp ray-caster faster at low resolution and tiled RTX at high (F06-50, F06-63, owners kept); backend="warp" default, optix "available on NVIDIA RTX GPUs", "warns and falls back" (F06-62); scoped "None was located in this research". Section 6: 4,096 and 307,200 rays, 75 times (F06-24); 8,192 x 4,096 = 33,554,432 (F06-103); linear-scaling quote (F06-24); 8192 x 756 ns = 6.19 ms; 6.2 x 75 = 465 ms, labelled extrapolation; tiled rendering and tensor shape (F06-64). Section 7: 96 GB card (F06-58); "64 x 64 or 96 x 96 ... does not record which" follows F06-104's own wording; chart values and labels (F06-47, F06-48); 18% / 2 = 9% (F06-33, author-owned); Kuka 220,831 / 115,889 = 1.91, one fixed 64 x 64 camera (F06-49, F06-103); OVRTX 97,307 at 18.6 GB, 0.84, 18.58 - 13.61 = 4.97 GB, presets rgb64 and simple_shading_full_mdl64 (F06-49, F06-103); 57 to 468 KB (F06-22); 13.61 / 8192 = 1.66 MB, 57.29 / 8192 = 7.0 MB, 63.73 / 8192 = 7.78 MB (F06-102, F06-48); 44.4 GB / 8192 = 5.41 MB (F06-24); USD-Camera out of memory beyond 48 on a 96 GB RTX PRO 6000, 96 / 48 = 2 GB correctly called a ceiling (48 cameras fit together with the physics and learner), "several thousand environments" (F06-63); 64 x 64 x 3 = 12,288 bytes, under a hundredth of 1.66 MB; 2.25 times the pixels against 57.3 / 13.6 = 4.2 (F06-104); whole-process totals (F06-47). Section 8: Capacity Blocks P and Trainium only, no G (F09-91; section 24 says the same); ODCRs cover G instances (F09-40; section 29 covers ODCRs for G fleets); G-only RTX row and its family list (F06-60 with its wave 2 note, F08-85, F08-58); AWS list against Isaac Sim 5.1 predates Isaac Lab 3.0 (F06-60 use note); G7 GA 18 June 2026, "4th Gen RT Cores", 32 GB (F08-52, F08-43); memory first (F08-76, our-reading badge); 57.3 GB fits G7e's 96 GB and not G7's 32 GB (F08-53, F08-43); 32,000 / 6.995 = 4,575, "about 4,600"; 32,000 / 1.66 = 19,277, "19,000"; floor and ceiling: with memory = fixed part + per-environment cost x count, dividing the card by the per-environment average overstates capacity when the measured run used more memory than the card (Cartpole, 57.3 GB against 32 GB: a ceiling) and understates it when the run used less (Kuka, 13.6 GB: a floor), so both labels are right; two-count sizing method; GiB wording follows F08-45's rewrite check (44 GiB for an L40S, not "usable"). Expandable: A10 72 / 24 GB, L4 no count / 24 GB, L40S 142 / 48 GB, RTX PRO 6000 BSE 188 / 96 GB (F06-58); G7 row (F08-43); H100 80 or 94 GB, H200 141 GB, no RT cores on the pages (F06-59); AWS list (F06-60); Isaac Sim tiers 16 GB and 48 GB, half of 96 GB (F06-52, F08-53); aarch64 only on DGX Spark (F06-53). Cross-references: sections 3, 8, 12, 14, 15, 20, 24, 29 titles match `sections.json`.

**Section 13: about 175 claims checked; 5 findings (2 errors, 3 minor).**

## Section 14, Sim-to-Real and Real-to-Sim (`src/sections/SimToReal.tsx`)

### Findings

1. **error.** "It does not support GPUs without RT cores, the ray-tracing units, and names the A100 and H100 among them, so on those GPUs a scanned scene goes through MuJoCo Warp."
   - Register: F06-52, F06-78, F06-101 (U8), F06-62.
   - What the entries say: F06-52 supports the Isaac Sim half. That MuJoCo Warp's ray tracer runs on a GPU with no RT cores at all is "The one link not stated by a first party" (F06-101, U8); F06-62 found no vendor sentence naming A100, H100 or B200 as supported. Section 13 prints exactly that hedge ("None was located in this research, so run one on a P-family GPU before you commit P capacity to it"). This sentence states the open link as fact, on the named GPUs.
   - Fix: "so on those GPUs the documented route left is MuJoCo Warp's renderer, which asks for no RT cores; no vendor sentence names the A100 or H100 as supported for it (section 13)".

2. **minor.** "The arm's bill of materials builds the follower from the 7.4 V version, which its maker rates at 16.5 kg-cm (1.62 N m) at 6 V. On that build the simulated servo can push about 2.94 / 1.62 = 1.8 times harder than the real one"
   - Register: F06-31, F01-4, F01-5; wave 2 row 4 for F01-5 in `wave2-A.md`.
   - What the entries say: every part of the new claim holds. FORCERANGE is "30 kg-cm @ 12V" (F06-31); all twelve servos in the two-arm list are "STS3215 Servo 7.4V", and the follower takes six C001 (F01-4); 16.5 kg.cm at 6 V for the 7.4 V version, 30 kg.cm for the 12 V (F01-5); 16.5 x 0.0980665 = 1.618 N m; 2.94 / 1.62 = 1.815; the fit's 24 parameters exclude the cap (F06-30). The dropped part: F01-5's quote continues "(and likely slightly less for a 5V power supply)", the stock supply is 5 V ("a 12V 5A+ power supply instead of a 5V one"), and the wave 2 check asks the dive to "Carry that clause". On the stock supply the real servo is weaker, so 1.8 is a lower bound, not "about".
   - Fix: "at least 1.8 times harder than the real one, and a little more on the stock 5 V supply, at which the maker expects slightly less torque".

3. **minor.** "The real side is 20 rollouts per policy in each environment, and the correlation runs over four policies, a small sample."
   - Register: F06-83.
   - What the entry says: 20 real rollouts per policy per environment is in the quote. "Four policies" is only in the "Use in dive" note; the claim sentence and the verbatim quote do not carry it, and the wave 2 check (`wave2-B.md` row 83) verified only the quoted strings. Section 16 prints the same number from the same note.
   - Fix: add the paper's sentence that names the four policies to F06-83, or write "a handful of policies" until it is quoted.

4. **minor.** Cost table, domain randomisation cell: "DrEureka, a 2024 method in which a language model proposes the ranges, trained 16 configurations for a quadruped in parallel, in 3 hours of wall-clock against 10 and 20 hours for two methods that try one configuration after another."
   - Register: F04-40 (author reported).
   - What the entry says: the figures hold (16 configurations, 3 against 10 and 20 hours for CEM and BayRn). They are the authors' own; the sentence states them as plain fact, with the owner only in the citation badge.
   - Fix: "... whose authors report 16 configurations trained in parallel in 3 hours of wall-clock against ...".

5. **minor.** "with "typically less than 20 minutes" of a person's effort and under one hour of wall time in all", and the cost table: "Under 20 minutes, and under an hour of wall time in all, for PolaRiS." / "Under 30 minutes on one RTX 4090 for PolaRiS."
   - Register: F06-73.
   - What the entry says: each figure is "typically": "typically completes within 30 minutes", "typically less than 20 minutes", "typically less than one hour". The prose drops it for the hour; the table drops it for all three.
   - Fix: keep "typically" (or "usually") in the prose and the table cells.

6. **minor.** "On this arm it is done by hand: you hold each joint at the middle of its range, then sweep it through its full range while the software records the extremes (section 3)."
   - Register: F01-20.
   - What the entry says: "The wrist roll is treated as a full-turn joint and is not swept." The sentence says every joint is swept.
   - Fix: "then sweep each joint except the wrist roll through its full range".

7. **minor.** Table "Friction loss": "It acts when the joint starts from rest."; excitation paragraph: "and moves from rest for friction loss".
   - Register: F11-211.
   - What the entry says: friction loss is dry, load-independent friction, "an upper limit on the absolute value of the force that friction can generate". It holds the joint at rest and resists it at a constant level while it moves; starts from rest are where it shows most, not the only place it acts.
   - Fix: "It resists every motion of the joint by the same amount, and shows most when the joint starts from rest."

8. **minor.** "NVIDIA's SO-101 typing project ... ships tools that fit the simulated keyboard's pose and the joint-angle calibration from recorded real key presses. Calibration then becomes a fit to recorded data, in place of a pose held by hand."
   - Register: F06-55.
   - What the entry says: "Tools to measure the fixture and fit the simulated keyboard pose and joint-angle calibration from recorded real key presses." It does not say the project replaces LeRobot's hand calibration of the real arm.
   - Fix: "The simulator's joint-angle calibration then becomes a fit to recorded data."

9. **minor.** Expandable: "Set beside the SO-101 task's list, it adds mass, inertia, centre of mass, gravity and pushes."
   - Register: F06-68, F06-28.
   - What the entries say: Isaac Lab's list also has restitution, collider offsets and fixed-tendon parameters, none of which is in the SO-101 list of F06-28. Read as the full difference, the sentence is incomplete.
   - Fix: "it adds, among others, mass, inertia, centre of mass, gravity and pushes."

10. **minor.** System-identification formula and the paragraph after it.
    - Register: F06-30.
    - What changed: the before text said "The library may scale each term before summing; this research did not read that part." The caveat is gone. The source line still marks the formula as the README's words "written as a sum", so the formula is labelled ours, but the scope of the hedge on its weighting is lost.
    - Fix: put back "The library may weight each term; that part was not read."

### Checked and correct (summary)

Opener: model-file values and the two remedies; 24 parameters, four per joint, one teleoperated episode (F06-30); Playground as DeepMind's suite (F06-25). Gap figure labelled illustrative. `SO101PickCubeVision` trained on a simulated wrist camera, "zero-shot onto the real robot" (F06-26, F06-27); gains identified from teleop data (F06-31); gains and passive damping scaled, friction, calibration bias, colours and light redrawn (F06-28); 0 to 4 ms delay (F06-27). Calibration: deploy-guide quote "1-2+ cm" and 10 to 20 mm or more (F06-29); base height plus or minus 2.5 mm for mounting offsets (F06-28); per-episode bias plus step-wise noise (F06-28, F06-29); slam-the-table quote (F06-29). Table rows: 2.94 N m cap (F06-31); passive damping, fingertip sliding / torsional / rolling friction, cube half-extents, colours in high contrast, lighting, camera parameters, `pixel_noise_std=0.02` (F06-28); 5 ms and 100 ms (F06-105); 64 x 64 wrist image (F06-27). Open Duck Mini quote (F06-36); P = 16, I = 0, D = 32 written on connect (F01-16; "loop inside the servo" is F01-16's own reading); 218 to 265 (F06-31). SIMPLER replay and "a missed grasp on the coke can", after sysid grasped (F06-71). 0.25 m/s x 4 ms = 1 mm (toy speed from section 3, which uses 0.25 m/s); sysid estimates the transport delay (F06-30). High-contrast quote; "tested on 3 different robot setups"; darker-shadows quote and the two remedies (F06-26). Tobin 2017 quote, 1.5 cm, non-realistic textures (F06-66). Objective, symbols, per-episode sampling held fixed (F11-202); step-wise noise (F06-28); 197 million steps, 4,096 arms (F04-58: 196,608,000); scoped "no figure for it on this arm was found". Isaac Lab paper list and quote (F06-67); event-function list (F06-68); PhysX "must be modified through the CPU API", scoped to the November 2025 paper (F06-69). Sysid: `mujoco.sysid` in MuJoCo 4.0, `pip install -U "mujoco[sysid]"` (F06-6), `tasks/sysid/so101` (F06-30); PD form and affine-bias actuator (F11-212); I = 0 makes the servo loop PD (F01-16); cap computed from 30 kg-cm at 12 V and not fitted (F06-31, F06-30); 2.94 / 218 = 0.01349 rad = 0.77 degrees, under one degree, with the unit marked as one the files do not state (N m per radian is the only reading consistent with a cap in N m and hinge angles in radians); "set FORCERANGE in constant.py" (F06-31 location); value ranges 218 to 265, 17.5 to 34.2, 0.109 to 0.199, near zero and 0.25 (F06-31); "minimizing rollout tracking error", Gauss-Newton least squares, 24 + 1 = 25 replays stated as a conditional; delay estimate and alignment steps 1 and 2 (F06-30); `pid`, `dcmotor`, delays (F06-7); neural actuators quote (F06-70). Real-to-sim: AWS post of 2026-09-09, 0% against 35% to 45%, owner and "no trial counts" kept (F06-72); PolaRiS 2 to 5 minute video, camera poses, splats with mesh, meshes into Isaac Sim, splats on links, 30-minute RTX 4090 quote, owner kept (F06-73); Isaac Sim default physics and manufacturer's arm defaults, 1k steps on about 350 demonstrations from 15 scenes (F06-74); r = 0.9 over six environments, 0.81 worst, owner kept (F06-83); MuJoCo Warp splat ray tracing and occlusion compositing, no RTX (F06-78; F06-62 confirms splats fall back to the warp backend); Isaac Sim 6.2.0 renders ParticleField splats through RTX (F06-77). Costs: 3DGRUT v1.1.0, docs point to it (F06-77), RTX 5090 averages 479.3 / 2,869 s and 214.6 / 686.4 s, owner kept, 2.23 and 4.18 (F06-75); ray-traced method wants RT cores (F06-75); sysid README publishes no timing (F06-30). Bench order: symptoms (F06-29, F06-26, F06-71); `lerobot-calibrate` (F01-21); no success rate published (F06-26). Cross-references: sections 3, 8, 12, 13, 16 titles match `sections.json`; section 3 holds leader / follower teleoperation, calibration, P = 16 / I = 0 / D = 32 and the 0.25 m/s toy speed.

**Section 14: about 160 claims checked; 10 findings (1 error, 9 minor).**
