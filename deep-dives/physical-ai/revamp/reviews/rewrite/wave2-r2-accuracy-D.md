# Accuracy review D, wave 2 round 2: sections 11, 12, 13 and 14

Reviewer D. Accuracy only. Judged against the current source files at HEAD (`40ec772`) and the registers in
`research/2026-11/` (claim, verbatim quote, "Use in dive", Wave 2 / Wave 3 / Rewrite check lines), with
`src/data/registry.json` for provenance badges. Changes read from `git diff e0539f1 HEAD` (section 11),
`git diff 96a0936 HEAD` (section 13 and `GpuEngines.tsx`) and `git show d323325` (sections 12 and 14).
`AugThreeWays.tsx` is unchanged since round 1 (last commit `e24d816`, before `e0539f1`); only its caption in
`Augmentation.tsx` changed.

Version reviewed: the committed blobs `Augmentation.tsx` 86ad1f9 and `Rendering.tsx` 14ddb3f (unchanged at HEAD
`9e659b5`). While this review ran, an uncommitted rewrite of `Augmentation.tsx` and `AugThreeWays.tsx` appeared in the
working tree from another session. It is not reviewed here; its new opener still pairs replay with Isaac Sim ("Of the
cards AWS lists for Isaac Sim, only the RTX PRO 6000 Blackwell in G7e passes both tests"), so check finding 1 of Part
1 against it.

## Part 1. Section 11, Augmentation and Synthetic Data (`src/sections/Augmentation.tsx`)

### Round 1 findings (wave2-r1-accuracy-A.md, Part 3)

| # | Sev | Round 1 finding | Status | Reason |
|---|---|---|---|---|
| 1 | error | Caption claimed each row applies a method to the same frame; stand-in qualifier lost | RESOLVED | Caption now: Row 2's scenes "from a different capture, stand in for simulated replays"; Row 3 "shows no clip" |
| 2 | error | 59.83 s on the H100 with no owner | RESOLVED | "NVIDIA lists that clip at 59.83 s on the H100" |
| 3 | error | FAQ figure stated as weights alone; 8B / 32B note dropped | RESOLVED | "labels the models 8B and 32B where the model cards say 16B and 64B ... which suggests the FAQ figure covers the weights alone" |
| 4 | error | "No part of the machine appears twice ... capacity left over ... buys nothing" | RESOLVED | Sentence removed; the remaining "Each method runs out of a different part of the machine first" sits beside the F05-108 cite, which renders with the our-reading badge |
| 5 | minor | "an estimate; no figure is published" | RESOLVED | Prose sentence removed; caption says "the transform time is our estimate". The figure's own "No published figure" label is unchanged and was carried from before |
| 6 | minor | 250 inside "whose authors report" | RESOLVED | "That is 50,000 / 200 = 250", marked Derived, in its own sentence |
| 7 | minor | "a rejected candidate was simulated in full" | RESOLVED | "A rejected candidate was simulated before it was rejected" |
| 8 | minor | "For the block-in-cup task the scene does not exist yet" | RESOLVED | "Isaac Lab v3.0.0 ships no block-in-cup scene" |
| 9 | minor | SkillGen 90 to 120 minutes without owner | RESOLVED | "NVIDIA gives 90 to 120 minutes ..." |
| 10 | minor | 48 GB card and transfer floor (50 GiB) | RESOLVED | "44 GiB for generation and 50 GiB for transfer ... a 48 GB card needs the 8-bit weights for generation, and offload to host memory as well for transfer" (48 GB = 44.7 GiB; FP8 model-offload transfer floor 44 GiB fits) |
| 11 | minor | "for minutes" true only at 720p | RESOLVED | "One 720p clip of under 8 seconds ..."; h2 "for minutes per 720p clip" |
| 12 | minor | RTX PRO 6000 called "the card that ran the simulated replays" | RESOLVED | "the card of NVIDIA's cube-stacking replays" |
| 13 | minor | DreamGen actions by IDM only | RESOLVED | "an inverse-dynamics model ... or a latent-action model" |
| 14 | minor | FP8 omitted; "unquantified" | RESOLVED | "With the FP8 ... checkpoint it completed all 21 ... at a speed cost the README does not quantify" |

Round 1: 14 of 14 resolved.

### New findings

1. **error.** Opener: "Replay draws camera images in Isaac Sim, NVIDIA's simulator, which does not support GPUs without RT
   cores, the ray-tracing units it renders with; the H100 has none." It carries the conclusion "Of the cards AWS lists
   for Isaac Sim, only G7e's RTX PRO 6000 Blackwell passes both tests" and the table lead-in "Transforms need no new
   card, replay needs RT cores and generation needs memory, and one card has both."
   - Register: F06-52 supports Isaac Sim's RT-core requirement. No entry says Isaac Lab Mimic at v3.0.0 renders its
     cameras through Isaac Sim: F05-89 and F05-90 name the card and the commands, not the renderer. F06-45: in Isaac
     Lab 3.0 Isaac Sim is "now fully optional". F06-50: Isaac Lab 3.0 ships Newton Warp, "a lightweight, kit-less Warp
     ray tracer included in the base install", with the highest throughput in the release benchmarks. F06-101: the
     RT-core requirement follows RTX rendering; the Warp path's status on P-family GPUs is open (U8). Section 13 now
     says "the documented rule reaches as far as Isaac Sim and RTX rendering, so the first question to ask of a
     simulation job is which renderer draws its cameras".
   - The whole argument is new since round 1 (the round 1 text said only "a GPU that simulates, and with
     cameras on one that renders" and pointed to section 13). Stated unscoped, it makes "replay needs RT cores" a fact
     about replay, where it holds for replay in Isaac Sim.
   - Fix: "Replay in Isaac Sim draws its cameras with an RTX renderer, and Isaac Sim does not support GPUs without RT
     cores (the H100 has none); whether Mimic runs on Isaac Lab 3.0's Warp renderer was not established (section 13)",
     and "replay in Isaac Sim needs RT cores" in the table lead-in.

2. **minor.** "Time grows with the grid the model fills in and with the number of passes over it, 35 in the model card's
   examples (section 6, World Models)."
   - Register: F03-95. The 35 is only in the "Use in dive" note; no verbatim line carries it. Section 6 prints it with
     "a figure this research records without the verbatim line" (WorldModels.tsx line 327). The hedge is dropped here.
   - Fix: "... 35 in the model card's examples, a figure recorded without its verbatim line (section 6)".

3. **minor.** "NVIDIA's tasks span 1.1 to 36 GPU-seconds per demonstration." (closing paragraph)
   - Register: F05-90 gives cube stacking at about 15 minutes per 1,000 without cameras, 0.9 s each, which the
     section's own figure prints ("0.9 s each without cameras, 3.6 s with them"). The 1.1 and 36 are the two F05-91
     tasks only. (Round 1 text said "about 1 to 36".)
   - Fix: "NVIDIA's figures span 0.9 to 36 GPU-seconds per demonstration", or "the two tasks above span 1.1 to 36".

4. **minor.** "A policy that reads cameras needs the images, so the hour is the figure for this arm."
   - Register: F05-90 is the Franka cube-stacking task. The round 1 text said "the figure for a policy like this
     arm's"; the new wording reads as an SO-101 time, and two paragraphs later the page says "a figure from another
     task cannot size yours".
   - Fix: "so the camera row, the hour, is the one that matches this arm's policy".

5. **minor.** "Simulated replay starts from a new recording: a few demonstrations made by driving the arm inside the
   simulator, so the episodes recorded at the bench do not feed it."
   - Register: F05-89 says "each human demonstration is cut into subtasks"; the register's own worked example marks
     "record 10 demonstrations in the simulator" as an `[illustration]` (05-data-pipeline.md line 857). No entry states
     that bench episodes cannot feed Mimic. The exclusion clause is new.
   - Fix: "Isaac Lab Mimic's documented path starts from a few demonstrations recorded by driving the arm inside the
     simulator." (drop the exclusion, or mark it as our reading).

6. **minor.** "The gain comes from freeing the workers, so expect it when GPU utilisation in `nvidia-smi`, the share of
   time any kernel is running, sits well below full during training."
   - Register: F05-59 gives the 2.8x and 3.3x with no cause; its use note marks the input-bound reading `[our
     reading]`. F08-30 supports the definition of utilisation. The causal clause states our reading as fact.
   - Fix: "By our reading the gain comes from freeing the workers, so ...".

7. **minor.** "A 48 GB card holds 44.7 GiB, which leaves 0.7 GiB above the 8-bit floor for generation."
   - Register: F08-45 Rewrite check: 48 GB is 44.7 GiB, but the EC2 docs list the L40S, the 48 GB card AWS sells
     (G6e), as 44 GiB. On the cited source's own figure the margin on G6e is zero, not 0.7 GiB.
   - Fix: add "(EC2 lists the L40S, its 48 GB card, at 44 GiB, the floor itself)".

8. **minor.** "A longer episode is several clips, so time one clip of your own episode length before budgeting a
   dataset."
   - Register: F05-97: the transfer rows state no frame count (U14); no entry gives a maximum clip length for
     transfer, and F05-96's Sim-Transfer checkpoint takes up to 600 frames (20 s at 30 fps).
   - Fix: "A longer episode may need several clips, so time one clip of your own episode length ...".

### Checked and holding (new and changed text)

Opener: F06-52 sentence and RTX PRO 6000 as "ideal"; F03-121 58 GiB BF16 generation floor (its use note: "fits a 48 GB
card only in FP8"); 48 GB = 44.7 GiB < 58; AWS list G5 / G6 / G6e / G7e (F06-60, "list of June 2026" keeps the wave 2
scope; G7 at 32 GB fails the memory test anyway); 180.81 / 59.83 = 3.02, "3.0", owner "in NVIDIA's table"; header
"three to four times" covers 3.0, 3.3 (489.90 / 148.65) and 3.8 (786.37 / 207.78 = 3.785); F05-5 "10 episodes per
location"; F05-2 60 s and 60 s; 10 x 120 s = 20 min; section 9 title. Transforms: F05-84 off by default, the
`enable` field (the CLI path `--dataset.image_transforms.` is printed in F05-59, cited in the section), up to 3 of six,
brightness and contrast 0.8 to 1.2, saturation and sharpness 0.5 to 1.5, hue 0.05, 5 degrees, 5%; brightness as a
multiplier is torchvision's ColorJitter behaviour; F05-86 eight camera-fault transforms, none default; F05-85 training
time only; F05-58 quote and "with several cameras ... most expensive"; F05-107 24 vCPUs per GPU (our-reading badge);
F05-87 gpu backend, chunk 32, 15 to 30 s compile, 2.4 GB against 6.3 GB at 480x640, two frames, batch 160; F05-59
2.8x / 3.3x, "names no dataset, camera count, batch size or CPU", owner kept; F08-30 utilisation = share of time a
kernel runs. Replay: F05-89 mechanism and 70% / under 1%; time per kept = time per candidate / yield, 1 / 0.4 = 2.5,
1 / 0.01 = 100; F05-88 owner kept, 50,000 / 200 = 250, 200 / 18 = 11.1 (Derived); F05-90 Franka, RTX PRO 6000
Blackwell, 15 min and 1 h, 300 and 1,000 environments, 40%, 60 / 15 = 4; "do not say whether ... kept or tries" is a
hedge on the quoted lines; 3,600 / 1,000 = 3.6; 3.6 / 0.4 = 9; F05-91 65 to 80%, 18 to 40 min, 19 min at 80% on RTX
6000 Ada, 10 h nut pouring with cameras; 1,140 / 1,000 = 1.14; 36,000 / 1,000 = 36; 36 / 1.14 = 31.6, "30-fold";
F06-57 RT cores take BVH traversal, "the most time consuming part" (= "the costliest step"); F06-58 A10 24 GB, L4 24
GB, L40S 48 GB, RTX PRO 6000 96 GB, A10G as AWS's variant; F05-93 SO-101 asset and stack task, Mimic registration
unchecked (U12) matches "Check that Mimic is registered"; F06-67 friction, mass, lighting "difficult to estimate
accurately or may vary over time"; F06-71 PD gains from the real controller, missed grasp, grasp after sysid,
history 2024; F06-68 visual colours and texture materials; F06-26 "3 different robot setups under various lighting
conditions" and the darker-shadows quote; F05-92 SkillGen 9.5 GB / 22 GB, 24 GB / 48 GB, "not very significant",
90 x 60 / 1,000 = 5.4, 120 x 60 / 1,000 = 7.2, within 3.6 to 9. Generation: F03-95 noise, passes, full attention;
F05-96 transfer inputs and outputs, 832x480; F05-100 "preserving the original motion and actions"; F05-101 four steps,
IDM or latent-action model, pseudo-actions; F05-102 SO-100, 10 and 13 plus 40 and 50, 21% to 45.5%, owner kept;
F05-103 54 x 1,500 = 81,000; 81,000 / 240,000 = 0.3375, "0.34", 20 min; F05-95 Nano 16B middle size, listed for RTX Pro
6000 / H100 / B200 (only Nano lists all three); F03-98 189 frames, 24 fps, 207.78 / 114.85 / 786.37 s, owner kept;
189 / 24 = 7.875; 207.78 / 7.875 = 26.4; F03-96 4x and 32 x 32; 47.25 x 22.5 x 40 = 42,525; 47.25 x 15 x 26 = 18,428
("18,000"); 42,525 / 18,428 = 2.31; 207.78 / 59.83 = 3.47, "3.5"; 2.3 x 2.3 = 5.3 (exact 5.33); 59.83 / 7.875 = 7.6;
F05-29 "named for the SO-101" (wave 3 wording kept), 11,939 / 50 / 30 = 7.96, "8.0"; F05-97 148.65 / 527.89 s, clip
length not stated, toy 50 x 148.65 = 7,432.5 s = 2.06 h; F03-121 58 / 64 GiB BF16, 44 / 50 GiB FP8, startup check,
"Treat the floors as minimums", no resolution, 31 GiB layer offload, Super 150 GiB; F03-123 32 / 128 GB, 8B / 32B
against 16B / 64B, 16 x 2 = 32; F03-124 33.8 GiB one 1280 x 720 image, 50,623 to 52,147 MiB in MiB per its Rewrite
check, notes file, no 189-frame PyTorch peak; F03-126 one GPU per Nano row at 720p, Super eight, "measured setups";
F03-125 FP8 checkpoint, 21 cases, RTX 5070 12 GB, 128 GB host, inference only. Closing: table rows against F05-87,
F05-107, F06-52, F06-60, F06-58, F05-92, F03-121, F05-95, F03-125; "only ... adapter runs under it" (no Nano NIM row
below 31 GiB); 50 x 489.90 = 24,495 s = 6.80 h; 6.8 - 2.1 = 4.7; Diffusers 217.90 / 132.06 s and the methodology
warning (F05-97); F05-66 p5.4xlarge one H100; F05-94 2025 blueprint, 48 GB RTX card, separate 80 GB H100-or-better
node, quote; F08-82 dated price, Region, purchase option, whole instance (its our-reading correction); F05-96
Sim-Transfer 600 frames, 30 fps, 480p; F05-100 Transfer1 pinned. Figure caption against `AugThreeWays.tsx` (MuJoCo
still, scenes from `so101-domain-randomisation.jpg`, empty Row 3, 0.9 / 3.6 / 207.78 s on one log axis).
Cross-references: sections 4, 6, 9, 12 and 14 titles match `sections.json`; section 6 holds compress / denoise / decode
and the 35 passes; section 12 the parallel environments; section 14 the fitting of the simulator.

**Section 11: about 120 claims checked; round 1 14 of 14 resolved; 8 new findings (1 error, 7 minor).**

## Part 2. Section 13, Rendering and Ray Tracing (`src/sections/Rendering.tsx`, shared figure `src/components/GpuEngines.tsx`)

### Round 1 findings (wave2-r1-accuracy-B.md, section 13)

| # | Sev | Round 1 finding | Status | Reason |
|---|---|---|---|---|
| 1 | error | Figure marked general compute cores "not used" for RTX rendering (and for policy training / inference); memory "not used" for video | RESOLVED | `rtx-rendering` is now `rt, general, memory` with "The lighting and shading of what the rays hit run on the general compute cores" (F08-36: SM "optimized for ... ray tracing, as well as lighting and shading"); training, inference and generation add `general` (F08-42: the tensor pipeline executes MMA instructions); decode and encode add `memory`. Section 20's caption ("the others sit idle") stays consistent |
| 2 | error | "and no further"; three-group split not marked as our reading | RESOLVED | "The documented rule reaches as far as Isaac Sim and RTX rendering ..."; "By our reading of the renderers' documentation, ..." |
| 3 | minor | 756 ns unit inferred | RESOLVED | "it records a render time of 756 per world per frame. Taking that as nanoseconds, the unit its physics rows imply" |
| 4 | minor | "A plain rasteriser stops there" widened scope | RESOLVED | Sentence removed; caption: "The rasteriser drawn here stops at projecting and filling". The 16 x 12 toy size, dropped from the caption, is still labelled inside `RenderForm.tsx` ("Drawn at 16 x 12 pixels ... The shipped task renders 64 x 64") |
| 5 | minor | EC2 row "any recent NVIDIA GPU", mapping unlabelled | RESOLVED | Column "EC2 family (our mapping)"; "any NVIDIA GPU of the Turing generation or newer (compute capability 7.5)" (F06-51: "Turing or newer (compute capability 7.5+)") |

Round 1: 5 of 5 resolved.

### New findings

1. **minor.** "Newton Warp pairs with Newton or with PhysX, the physics engine inside Isaac Sim, and only the pairing with
   Newton, with no Isaac Sim underneath, leaves the job with no documented RT-core requirement."
   - Register: F06-50 quote: "Pairs with Newton, OvPhysX, or Isaac Sim PhysX." F06-45: OVPhysX is PhysX packaged as a
     standalone library, with no Isaac Sim. The sentence folds OvPhysX into "the physics engine inside Isaac Sim", and
     the new "only" excludes a kit-less pairing for which no entry records an RT-core requirement either.
   - Fix: "Newton Warp pairs with Newton, with OvPhysX (PhysX as a standalone library) or with Isaac Sim's PhysX;
     paired with Newton, with no Isaac Sim underneath, it leaves the job with no documented RT-core requirement."

2. **minor.** "Per environment, memory spans more than four orders of magnitude, from the physics state alone to one
   full-fidelity camera:"
   - Register: F06-102: "one ladder of four rungs spanning four orders of magnitude". The top rung, about 2 GB, is a
     ceiling (F06-63; the page's own list says "a ceiling on each camera's share"), so "more than four" is not
     established: below about 570 MB per USD camera the span from 57 KB is under four orders.
   - Fix: "about four orders of magnitude".

### Checked and holding (new and changed text)

GpuEngines: every workload's engines and reason against F08-36, F08-42, F06-57 ("its costliest step" = "the most time
consuming part"), F06-100, F06-101, F06-24, F06-62, F08-31, F08-44, F05-108; the physics-batch reason keeps "By our
reading"; figure `cites` carry F08-36 F08-42 F08-43 for every workload; EMPHASIS is blue (#0972d3), matching "outlined
in blue". Section text: header wording; opener (F06-60, F06-57, F06-52, 9 June 2026, P4d to P6e-GB200, four G families);
"documented rule" sentence (F06-101); "The second question" paragraph (F06-47, F06-48, 1,023,698 / 152,124 = 6.73,
57.3 / 0.93 = 61.6); MuJoCo as DeepMind's open-source simulator (F06-61); GPU-units paragraph (F08-42, F06-100, F08-36);
"Policy training and RTX rendering share the general compute cores and memory and differ in one specialised unit
each" (F06-60, consistent with the figure); "GPU physics runs on the general compute cores ... mostly a question about
its renderer" (F06-100); three groups by our reading, Warp as Python-to-GPU compiler (F06-101 our-reading badge,
F06-39); RTX table cell "RT cores for the walk; general compute cores and GPU memory for the rest" (F06-52, F08-36);
"Isaac Sim is the one exception" (F06-52 "not supported" for the application); install-guide quotes and the
headless scope (F06-51); Newton Warp direct lighting and its recommendation quote, OVRTX recommended, Isaac RTX legacy
(F06-50); Tobin quote (F06-66), Franka "a different robot", 12 of 12, author-owned (F06-34); "the order depends on the
comparison and on image size" and the two owned comparisons (F06-50, F06-63); "No vendor sentence ... was located in
this research" (F06-101, F06-62); expandable on MuJoCo Warp's `warp` and `optix` back ends, "available on NVIDIA RTX
GPUs", "warns and falls back", and "The fallback shows that the Warp path does not depend on RTX hardware" (F06-62's
own claim sentence: "The fallback is the first-party evidence that the Warp path does not depend on RTX hardware");
8192 x 756 ns = 6.19 ms; "a card with RTX in its name running a renderer that is not an RTX renderer" (Newton Warp,
F06-48, F06-50); no-camera rung 57 to 468 KB (F06-22) and 0.1 to 1.8 MB across state-only tasks (F06-102, F06-47
rows 0.93 to 14.74 GB); Kuka 13.61 - 7.21 = 6.40 GB (F06-49), 6.40 GB / 8,192 = 0.78 MB, 781,250 / 12,288 = 63.6,
"more than 60"; Cartpole 57.29 - 0.93 = 56.36 GB, 56.36 / 6.40 = 8.8, "about 9"; 96 x 96 / 64 x 64 = 2.25 (F06-104);
G7 predates note, GA 18 June 2026, "4th Gen RT Cores", 32 GB (F08-52, F08-43); 32,000 / 7.0 = 4,571, "4,600";
32,000 / 1.7 = 18,824, "19,000"; ceiling and floor: with M(n) = F + c n measured at n0, the division estimate K n0 /
M0 exceeds the true (K - F) / c exactly when K < M0, so the 32 GB card against Cartpole's 57.3 GB gives a ceiling and
against the Kuka run's 13.6 GB a floor, and "charges the fixed part in proportion to the count" is the right
mechanism; two-count sizing method and "an L40S sold as 48 GB appears there as 44 GiB" (F08-45 Rewrite check: GiB as
printed, not "usable"); second pair of runs at another image size (method); expandable list: AWS post written against
Isaac Sim 5.1 before Isaac Lab 3.0 (2026-10-20, F06-45), verdict scoped to RTX rendering (F06-60 use note), aarch64
DGX Spark only (F06-53); CaptureSlot renders "What will be shown here:", so "captured on our own machines" is a plan,
not a claim of an existing capture. Cross-references: sections 3, 8, 12, 14, 15, 20, 24, 29 titles match
`sections.json`.

**Section 13: about 75 claims checked (changed text and the eight figure rows); round 1 5 of 5 resolved; 2 new
findings (0 error, 2 minor).**

## Part 3. Section 12, Physics Simulation (`src/sections/PhysicsSimulation.tsx`), confirm only

| # | Sev | Round 1 finding | Status | New problem in the fixing sentence? |
|---|---|---|---|---|
| 1 | error | Changes made "on that `option` element" | RESOLVED: "both go through Playground's `Sim` config, which writes its own timestep over the one in that `option` element: a smaller `simulation_timestep` ... or the `discrete` integrator, set in its `integrator` field" | None. F06-105: `spec.option.timestep = sim.simulation_timestep`; F06-106: `if sim.integrator is not None: spec.option.integrator = sim.integrator`; F06-106 now cited |
| 2 | minor | Solver fault condition dropped | RESOLVED: "when the constraint Jacobian J is sparse" | None. F06-2 quote; J is defined earlier in the section (line 402) |
| 3 | minor | "the documented next step" | RESOLVED: "the integrator the documentation names for this case, and the one to try when a grasp goes unstable" | None (F06-13) |
| 4 | minor | Isaac Lab ratio generalised from one row | RESOLVED: "On a Franka arm lifting a cube in Isaac Lab, ..." | None. 318,651 / 164,777 = 1.93; 14.74 / 5.41 = 2.72 (F06-47) |
| 5 | minor | Order-of-magnitude hedge missing from caption | RESOLVED: caption adds "the humanoid model files were not checked to be identical, so compare lengths by order of magnitude only" | None |
| 6 | minor | "Capacity does not bind" | RESOLVED: "Physics memory does not bind at these counts; the vision recipe's camera memory is section 13's to price" | None (F06-22; section 13 prices camera memory) |
| 7 | minor | Newton-only install-guide sentence generalised | RESOLVED: "For Newton the Isaac Lab install guide says so in one line" | None (F06-51) |

**Section 12: 7 of 7 resolved; no new problem in the fixing sentences (about 14 claims checked).**

## Part 4. Section 14, Sim-to-Real and Real-to-Sim (`src/sections/SimToReal.tsx`), confirm only

| # | Sev | Round 1 finding | Status | New problem in the fixing sentence? |
|---|---|---|---|---|
| 1 | error | Warp route on A100 / H100 stated as fact | RESOLVED: "the documented route left for a scanned scene is MuJoCo Warp's renderer, which asks for no RT cores, though no vendor sentence names the A100 or H100 as supported for it (section 13, Rendering and Ray Tracing)" | Minor, see new finding 1 |
| 2 | minor | 1.8 times ignores the 5 V supply | RESOLVED: "1.8 times harder than the real one at 6 V, and more on a 5 V supply, from which the maker expects slightly less torque" | None. F01-5 "(and likely slightly less for a 5V power supply)"; wave 2 "Carry that clause" |
| 3 | minor | "four policies" only in a use note | RESOLVED: "a handful of policies"; claims file updated | None in section 14. Out of scope: section 16 (`Evaluation.tsx` line 251) still prints "The figure rests on four policies" from the same use note |
| 4 | minor | DrEureka figures without owner | RESOLVED: "whose authors report 16 configurations ... in 3 hours" | None (F04-40) |
| 5 | minor | "typically" dropped | RESOLVED: prose "typically under one hour"; table "Typically under 20 minutes, and typically under an hour", "Typically under 30 minutes" | None (F06-73) |
| 6 | minor | Every joint swept | RESOLVED: "sweep each joint except the wrist roll" | None (F01-20) |
| 7 | minor | Friction loss "acts when the joint starts from rest" | RESOLVED: "resists every motion of the joint by the same amount, and shows most when the joint starts from rest"; excitation "starts from rest, where friction loss shows most" | None (F11-211) |
| 8 | minor | Typing project replaces hand calibration | RESOLVED: "The simulator's joint-angle calibration then becomes a fit to recorded data" | None (F06-55) |
| 9 | minor | "it adds" read as the full difference | RESOLVED: "it adds, among others, ..." | None (F06-68, F06-28) |
| 10 | minor | Weighting caveat dropped | RESOLVED: "The library may weight each term; that part was not read." | None (F06-30) |

### New findings

1. **minor.** "... though no vendor sentence names the A100 or H100 as supported for it (section 13, Rendering and Ray
   Tracing)."
   - Register: F06-62 verdict ("a sentence naming A100, H100 or B200 as supported does not" exist, U8) and F06-101.
     Section 13, the section the sentence points to, scopes it: "No vendor sentence naming the A100, H100 or B200 as
     supported for a Warp renderer was located in this research". The fix states the absence as a fact about the
     world.
   - Fix: "though no vendor sentence naming the A100 or H100 as supported for it was located in this research
     (section 13, ...)".

**Section 14: 10 of 10 resolved; 1 new finding in a fixing sentence (0 error, 1 minor) (about 20 claims checked).**

## Totals

| Section | Round 1 resolved | New errors | New minor |
|---|---|---|---|
| 11 | 14 of 14 | 1 | 7 |
| 12 | 7 of 7 | 0 | 0 |
| 13 | 5 of 5 | 0 | 2 |
| 14 | 10 of 10 | 0 | 1 |
