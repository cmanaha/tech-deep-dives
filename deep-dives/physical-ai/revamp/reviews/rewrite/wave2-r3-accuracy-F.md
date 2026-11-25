# Accuracy review F, wave 2 round 3: section 11, Augmentation and Synthetic Data

Reviewer F. Accuracy only. Judged against the committed blobs at HEAD (`f914a85`): `src/sections/Augmentation.tsx`
(a8191ea) and `src/components/figures/AugThreeWays.tsx`, read with `git show HEAD:...`, not the working tree.
Changes read from `git diff d6b258e HEAD` for both files. Registers: `research/2026-11/*.md` (claim, verbatim quote,
"Use in dive", Wave 2 / Wave 3 / Rewrite check lines), with `src/data/registry.json` for provenance kinds
(vendor-claim, author-reported, our-reading). Figure media provenance from `public/media/PROVENANCE.md`.
Cross-references against `revamp/tools/sections.json` and the other sections' sources at HEAD.

## Part 1. Round 2 findings (wave2-r2-accuracy-D.md, Part 1)

| # | Sev | Round 2 finding | Status | Reason |
|---|---|---|---|---|
| 1 | error | Replay needs RT cores stated unscoped (opener, conclusion, table lead-in) | RESOLVED | Opener: "Replay whose cameras are drawn in Isaac Sim ... needs RT cores"; table lead-in: "Replay rendered in Isaac Sim and 16-bit generation can share G7e"; row "Simulated replay in Isaac Sim"; new paragraph scopes the card rule to "replay rendered in Isaac Sim" and says the Newton Warp question is open; closing: "on a G-family card if Isaac Sim will draw its cameras". (The new paragraph carries its own minor, new finding 7.) |
| 2 | minor | 35 passes printed without section 6's hedge | RESOLVED | "35 in the model card's examples, a figure to confirm on the card (section 6, World Models)". Section 6 (WorldModels.tsx line 327) still prints 35 with "a figure this research records without the verbatim line" |
| 3 | minor | "NVIDIA's tasks span 1.1 to 36" ignored the 0.9 s row | RESOLVED | "NVIDIA's runs with cameras take 3.6 to 36 GPU-seconds per demonstration": the two runs the registers record with cameras, F05-90 (1 h / 1,000 = 3.6 s) and F05-91 (10 h / 1,000 = 36 s); owner kept |
| 4 | minor | "the hour is the figure for this arm" | RESOLVED | "the camera row, the hour, is the one that matches this arm's policy" (the fix as proposed) |
| 5 | minor | Bench episodes "do not feed" Mimic | RESOLVED | Exclusion dropped: "its documented path starts from a few demonstrations recorded by driving the arm inside the simulator", now cited to F05-89 |
| 6 | minor | Cause of the 2.8x stated as fact | RESOLVED | "By our reading the gain comes from freeing the workers" |
| 7 | minor | 0.7 GiB margin ignored EC2's 44 GiB L40S | RESOLVED | "and EC2 lists the L40S, the 48 GB card of G6e, at 44 GiB, the floor itself" (F08-45 Rewrite check: GiB as printed, not "usable"; the sentence does not say usable) |
| 8 | minor | "A longer episode is several clips" | RESOLVED | "A longer episode may need several clips" (F05-97: frame count of the transfer rows not stated, U14) |

**Round 2: 8 of 8 resolved.**

Round 1 fixes re-checked in the rewritten text: three round 1 corrections were undone by the rewrite (round 1
findings 1, 9 and 14); they are new findings 1, 4 and 5 below. The others hold: owner on 59.83 s (#2), FAQ 8B / 32B
note (#3, see "Checked and holding"), no "buys nothing" sentence (#4), 250 as Derived in its own sentence (#6),
"simulated before it was rejected" (#7), "and no block-in-cup scene" scoped to Isaac Lab v3.0.0 (#8), 44 / 50 GiB
and offload for transfer (#10), "One 720p clip of under 8 seconds" (#11), "the card of NVIDIA's cube-stacking
replays" (#12), inverse-dynamics or latent-action model (#13).

## Part 2. New findings (new or changed text since d6b258e)

1. **error.** Figure caption and figure labels. Caption: "Time per new sample on one log scale: one transformed
   image (an estimate), one replayed demonstration and one generated 720p clip, so each method's cost reads as
   milliseconds, seconds or minutes. The stills are renders from MuJoCo, an open-source physics simulator, and row 3
   has none because no clip was generated." With the figure's new labels "One demonstration" (wide and narrow) and
   SVG title "One demonstration turned into three kinds of extra training data, with the time each takes per new
   sample".
   - Source: `public/media/PROVENANCE.md`: the source frame, `so101-eval-grid.jpg`, is "Twelve replays of the same
     scripted motion"; the row 2 stills, `so101-domain-randomisation.jpg`, are "Six randomised variants of the scene
     ... floor colour, light position and strength, object colours and positions, camera offset, arm tint", a
     different capture, not replays of the shown frame. Round 1 finding 1 (error) required the stand-in qualifier;
     round 2's caption had it ("Row 2's randomised MuJoCo scenes, from a different capture, stand in for simulated
     replays ...; these scenes also vary colour and light") and "at illustrative strengths" for row 1. Both are
     gone. Row 1's filters are outside the defaults the section prints (F05-84: hue within 0.05 of a turn, 18
     degrees; saturation 0.5 to 1.5; brightness 0.8 to 1.2): the figure applies a 28-degree hue rotation,
     saturation 1.6 and a 0.68 darkening. Relabelling the scripted still "One demonstration" (the narrow layout
     drops "scripted motion") adds to the reading that rows 1 and 2 are made from that one demonstration.
   - Fix: add to the caption "Row 1's transforms are drawn at illustrative strengths, some beyond LeRobot's
     defaults; row 2's randomised scenes, from a different capture, stand in for simulated replays and also vary
     colour and light."

2. **error.** Opener: "It runs both jobs and pays in speed: repainting a recorded clip, a new look over the same
   motion, takes it 1.65 to 3.3 times an H100's time at 480p, depending on the software that runs the model."
   - Register: F05-97 (`vendor-claim`): RTX PRO 6000 489.90 s against H100 148.65 s (PyTorch), 217.90 s against
     132.06 s (Diffusers); 489.90 / 148.65 = 3.30, 217.90 / 132.06 = 1.65 (arithmetic holds). This is the first
     appearance of the comparison on the page, and the round 2 opener kept the owner ("in NVIDIA's table it
     writes ..."); the rewrite drops it. The methodology line in F05-97 ("equal model, GPU, and resolution labels
     alone do not establish an identical workload") also means the spread across engines is not established as an
     effect of the software alone; the section prints that caution only in its closing container.
   - Fix: "... takes it 1.65 to 3.3 times an H100's time at 480p on NVIDIA's benchmark rows, depending on the
     inference engine NVIDIA ran."

3. **minor.** Two new sentences in the closing container state NVIDIA's per-clip times with no owner:
   "One PyTorch repaint at 480p holds the RTX PRO 6000 for 489.90 s, so ..." and "The H100 repaints a clip in
   148.65 s where the RTX PRO 6000 takes 489.90 s, so a separate H100 costs less per clip ..."
   - Register: F05-97 `[vendor claim]`. The figures were introduced with an owner earlier ("NVIDIA lists 148.65 s";
     "On NVIDIA's PyTorch rows"), so the owner sits only in earlier paragraphs, the pattern round 1 finding 9
     rated minor. Neither paragraph names NVIDIA.
   - Fix: "On NVIDIA's PyTorch row one repaint at 480p holds ..."; "On NVIDIA's rows the H100 repaints a clip in
     148.65 s ...".

4. **minor.** SkillGen expandable: "One environment on an RTX 6000 Ada makes 1,000 demonstrations in 90 to 120
   minutes, 5.4 to 7.2 GPU-seconds each."
   - Register: F05-92 `[vendor claim]` ("Generation time: ~90 to 120 minutes for one environment ... on a RTX 6000
     Ada GPU"). Round 1 finding 9 asked for the owner in this sentence; round 2's text had "NVIDIA gives 90 to 120
     minutes ...". The rewrite returns it to a plain fact, with the owner only in the sentences before. Arithmetic
     holds (5,400 / 1,000 = 5.4; 7,200 / 1,000 = 7.2).
   - Fix: "NVIDIA gives 90 to 120 minutes for 1,000 demonstrations with one environment on an RTX 6000 Ada, ...".

5. **minor.** Expandable, "Below the NIM floors": "... for inference only and at an unquantified speed cost."
   - Register: F03-125 Use: "at a speed cost the README does not quantify in the lines read (the benchmark runner
     records timings per run; no table is printed)". Round 1 finding 14 objected to "unquantified" as wider than the
     source; round 2 had "at a speed cost the README does not quantify". The rewrite restores "unquantified".
   - Fix: "... for inference only and at a speed cost the README does not quantify."

6. **minor.** Expandable, "Measured peaks on an H100 80 GB": "Nano peaked at 33.8 GiB for a single 1280 x 720 image,
   and at 50,623 to 52,147 MiB served through TensorRT-LLM, NVIDIA's serving runtime, after a 189-frame warm-up. The
   notes record none for a full 189-frame video through PyTorch, the path the timings use."
   - Register: F03-124 (`vendor-claim`), "from notes in NVIDIA's cosmos-framework repository", a notes file written
     for coding agents; Use: "Treat as `[vendor reported, agent-run measurement]`". Round 2's text kept the owner
     ("Both come from notes in NVIDIA's cosmos-framework repository"); the rewrite drops it, and "The notes" now
     refers to nothing named in the prose. Figures themselves hold (MiB as the Rewrite check requires).
   - Fix: "NVIDIA's cosmos-framework notes record Nano peaking at 33.8 GiB ...; they record none for ...".

7. **minor.** New paragraph: "The requirement belongs to the renderer. Isaac Lab 3.0 makes Isaac Sim optional and
   ships Newton Warp, ... Its pages on renderers and installation say neither whether Newton Warp needs RT cores nor
   whether Mimic's camera runs can use it, so the card rule here holds for replay rendered in Isaac Sim ..."
   - Register: F06-52 is a requirement of the Isaac Sim application ("GPUs without RT Cores (A100, H100) are not
     supported"); F06-50: Newton Warp "Pairs with Newton, OvPhysX, or Isaac Sim PhysX". Section 13 states the rule
     as "Isaac Sim is the one exception to the renderer rule: it carries the requirement into every job it runs"
     (Rendering.tsx line 432), and only "Paired with Newton, with no Isaac Sim underneath" leaves no documented
     requirement. "The requirement belongs to the renderer" drops that exception, so a run inside Isaac Sim with
     Newton Warp reads as possibly exempt; F06-101, the renderer-split reading, is `[our reading]` and not cited
     here. Second clause: the Newton Warp half is supported (F06-51 Use, U8); no entry records what those pages say
     about Mimic (round 2: "No entry says Isaac Lab Mimic at v3.0.0 renders its cameras through Isaac Sim"), so the
     absence is a research gap restated as page content.
   - Fix: "The requirement belongs to RTX rendering and to Isaac Sim as a whole (section 13) ... Whether Newton Warp
     needs RT cores is not stated on those pages, and this research did not establish whether Mimic's camera runs
     can use it, so the card rule here holds for replay run in Isaac Sim ...".

8. **minor.** "Isaac Lab Mimic is the replay tool in Isaac Lab, NVIDIA's robot-learning framework built on its
   simulator, and its documented path starts ..."
   - Register: F06-45, cited in the same container: in Isaac Lab 3.0 Isaac Sim "remains the complete path ... but
     now fully optional"; Isaac Lab 3.0 is "one task API across multiple physics, rendering, and visualization
     backends". The opener names "Isaac Sim, NVIDIA's simulator", so "built on its simulator" says v3.0.0 is built
     on Isaac Sim, which the paragraph on Newton Warp then contradicts and which presumes the answer the section
     leaves open (whether Mimic needs Isaac Sim).
   - Fix: "NVIDIA's robot-learning framework, which runs on Isaac Sim or, since 3.0, without it".

9. **minor.** "EC2 sells the H100 singly as p5.4xlarge and the RTX PRO 6000 singly as g7e.8xlarge. ... a separate
   H100 costs less per clip whenever its hourly price is under 3.3 times the single-GPU G7e's ..."
   - Register: F05-66 lists g7e.8xlarge (32 vCPUs, 1 GPU), but F08-45 (and F10-7) also list g7e.2xlarge with
     "1 x NVIDIA RTX PRO Server 6000 GPU | 96 GiB". "The single-GPU G7e" is therefore not one size, and the price
     comparison depends on which one is bought.
   - Fix: "... and the RTX PRO 6000 singly from g7e.2xlarge up (g7e.8xlarge among them) ... under 3.3 times the
     price of the single-GPU G7e size you would run".

10. **minor.** "... but it shows what a published figure gives: a range 36 / 1.1 = 33 times wide, not your task's
    cost."
    - Register: F05-91: 19 min / 1,000 = 1.14 s and 10 h / 1,000 = 36 s; [derived] "a 30-fold spread"; F05-108:
      3,160 down to 100 per GPU-hour (31.6). 36 / 1.1 = 32.7 divides by the rounded 1.1; from the published
      figures the ratio is 36 / 1.14 = 31.6.
    - Fix: "a range 36 / 1.14 = 32 times wide" (or "about 30 times").

## Checked and holding (new and changed text)

H1 and opener: header "of the instances AWS lists for NVIDIA's simulator, only G7e also holds NVIDIA's video model
at 16-bit precision" (F06-60 list G5 / G6 / G6e / G7e; 24 / 24 / 48 / 96 GB per F06-58; 58 GiB BF16 floor per
F03-121; G7, unlisted, is 32 GiB per F08-45 and would fail the memory test anyway, so the missing June 2026 date in
the header does not change the claim); title matches `sections.json`; scenario sentence built from `ARM` and
`TASK_STORY` (`src/lib/task.ts`); three methods by machine part (F05-108 our-reading badge, F05-84, F05-89, F05-96);
tensor cores as the matrix-arithmetic units; F06-52 quote and "the H100 has none"; 58 GiB at 16-bit, more than
48 GB (44.7 GiB); "only the RTX PRO 6000 Blackwell in G7e passes both tests"; 489.90 / 148.65 = 3.30, 217.90 /
132.06 = 1.65. Two answers paragraph: F05-5 "10 episodes per location", F05-2 60 s and 60 s, 10 x 120 s = 20 min,
section 9 title.

Figure: caption cites F05-87 F05-90 F03-98 F05-108; "an estimate, not a published figure: milliseconds per image"
(says this value is unpublished, not that none exists; F05-108 our-reading badge); "0.9 s each, or 3.6 s with
cameras: NVIDIA's totals / 1,000" (900 / 1,000, 3,600 / 1,000, owner kept); 207.78 s, "one 720p clip of under 8
seconds, on one H100" (F03-98, 7.875 s); SVG desc "under a second each, or a few seconds with cameras"; "Outlines
only: no clip was generated"; replay shifts 12 / 264 = 4.5% and 8 / 198 = 4% and 3-degree rotation are within the
defaults; brightness 1.16 within 0.8 to 1.2.

Transforms: brightness "a random factor drawn for each sample" (F05-84 ColorJitter; per-sample on both backends,
F05-87 "batched, per-sample equivalents"); 2.4 GB at `gpu_chunk_size` 32 and 6.3 GB with no limit, 480x640, two
frames, batch 160 (F05-87, code comment; registry kind is code, not vendor-claim); F05-59 owner kept, 2.8x / 3.3x,
"dataset, camera count and CPU unstated" (a subset of "no dataset, camera count, batch size or CPU"); F08-30.

Replay: Mimic definition and documented path (F05-89); subtasks, stitching, success check; MimicGen owner kept,
50,000 / 200 = 250, 200 / 18 = 11; new MimicGen bench sentence: 11 x 120 s = 22 min ("under half an hour"),
11 x 250 = 2,750, 2,750 x 60 / 3,600 = 45.8 ("46"), scoped "At this arm's recorder defaults" (F05-2), and "at
least ... in resets alone" is the reset share of a total of 91.7 h at those defaults, so the bound holds as worded;
yield 70% / under 1% (F05-89 "as high as 70% ... as low as <1%"), 40% owned, 2.5, 100; F05-90 Franka, RTX PRO 6000
Blackwell, 15 min / 1 h, 300 against 1,000 environments, "4 times as long", "Rendering is the difference" (F05-90
[derived] line), 3.6, 9, `--generation_num_trials 1000` leaves kept-or-tries open; F05-91 65 to 80%, 18 to 40 min,
19 min at 80% on the RTX 6000 Ada, 10 h nut pouring with cameras, 1.14 and 36, "may differ in cameras as well as in
task" hedge; F06-57 and F06-52 paragraph (unchanged substance); F06-45 "optional", F06-50 Newton Warp "lightweight
... ray tracer", "direct lighting only", "base install"; F06-60 "data center GPUs without RT Cores", "written for the
earlier Isaac Sim 5.1", June 2026, every P family incompatible; F05-93 SO-101 asset and stack task, "and no
block-in-cup scene"; dropping round 2's "Check that Mimic is registered" removes an instruction, and no remaining
sentence claims Mimic is registered for the SO-101 task (U12 stays unclaimed); F06-67 friction and mass, lighting
for rendering, "difficult to estimate accurately or may vary over time"; F06-71 SIMPLER (unchanged); F06-68 visual
colours and texture materials, "visual domain gap" defined; F06-26 quote; F05-92 9.5 GB / 22 GB, 24 GB / 48 GB,
"not very significant" quoted, 5.4 / 7.2.

Generation: h2 "paid in GPU-minutes per episode" (480p transfer rows 71 to 490 s per clip, F05-97; DreamGen about 20
GPU-minutes, F05-103; a unit of account, not a claim of several minutes); F03-95 noise, passes, decode; F05-96
transfer inputs and outputs; F05-100 motion kept; F05-101 four-step recipe, IDM or latent-action model,
pseudo-actions; F05-102 SO-100, 10 and 13 plus 40 and 50, 21% to 45.5%, and the new sentence 23% to 37% on three
Franka tasks and 37% to 46.4% on four humanoid tasks "all using just 10 to 13 real-world trajectories per task"
(owner carried by "its authors report" / "Their"); "gained less" holds in points (24.5 against 14 and 9.4) and in
ratio (2.17 against 1.61 and 1.25); F05-103 54 x 1,500 = 81,000, 0.3375 h = 20.25 min; chain paragraph moved
unchanged (F05-96 600 frames, 30 fps, 480p; F05-100 Transfer1, two generations); F05-95 4 / 16 / 64 billion, Edge /
Nano / Super, Nano the one listed for RTX PRO 6000, H100 and B200 (Wave 2 dates not contradicted by "current
family"); F03-98 owner kept, 207.78 / 114.85 / 786.37 s, 7.875 s, 26.4; F03-96 4x and 32 x 32, 42,525; 832x480,
18,428; 59.83 owned, 7.6; 2.3, 3.47 ("3.5"), 5.3; F05-29 "named for the SO-101" (Wave 3), 7.96 ("8.0"); F05-97 owned,
"for clips of unstated length", toy 50, 2.06 h; F03-121 58 / 64 GiB BF16, 44 / 50 GiB FP8, container check per
device, "treat them as minimums", no resolution or frame count; 44.7 - 44 = 0.7 GiB; F08-45 L40S 44 GiB as printed;
"plan generation on 80 GB or more" (advice). Expandable: 31 GiB layer offload, Super 150 GiB (F03-121); FAQ item "These
figures for Nano and Super match the weights alone: sixteen billion parameters at 2 bytes each is 32 GB" states the
arithmetic match in view (16 x 2 = 32, 64 x 2 = 128, F03-123 [derived]) and keeps the 8B / 32B against 16B / 64B
note, so round 1 finding 3 stays resolved; F03-126 one GPU per Nano row at 720p, Super's main PyTorch rows on eight,
"measured setups" (register claim wording); F03-125 FP8, 21 cases, RTX 5070 12 GB, 128 GB host, inference only.

Closing: table lead-in (F06-60, F05-90, F05-95); table rows unchanged apart from "at 16-bit precision" and the
reworded 48 GB cell (F03-121); 180.81 / 59.83 = 3.02, 786.37 / 207.78 = 3.78, owned; 50 x 489.90 s = 6.80 h,
6.80 - 2.06 = 4.74 ("4.7"); 489.90 / 217.90 = 2.25 ("2.2"); 50 x 85.84 s = 1.19 h ("1.2"); methodology caution
(F05-97); toy 12 h, 43,200 / 489.90 = 88.2, 43,200 / 217.90 = 198.3; cost-per-clip break-even 148.65 P_H < 489.90
P_G gives 3.30, Diffusers 1.65; F08-82 whole instance, dated price, Region, purchase option, no dollar figure;
"since Isaac Sim does not support the H100" (F06-52); F05-94 2025 blueprint, 48 GB RTX card, separate node with H100
or better and 80 GB, quote; closing actions against F05-59 (`backend=gpu` flag), F05-5, F05-89, F05-90, F05-91; 3.6
to 36 for runs with cameras; "repaint recorded episodes on a card with 80 GB or more" (F03-121 use note).

Cross-references: section 4 (ACT, LearningFromDemonstrations.tsx line 115), section 6 (35 passes, compress /
denoise / decode), section 9 (Collecting Data), section 12 (Isaac Lab counts environments, PhysicsSimulation.tsx
line 573), section 13 (three-way renderer table, Rendering.tsx lines 384 to 420), section 14 (fitting the
simulator, SimToReal.tsx lines 204 to 210); every title matches `sections.json`.

**Section 11: about 130 claims checked; round 2 findings 8 of 8 resolved; 10 new findings (2 error, 8 minor),
three of them (1, 4, 5) round 1 corrections undone by the rewrite.**
