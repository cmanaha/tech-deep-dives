# Accuracy review G, wave 2 round 3 confirming pass: section 11, Augmentation and Synthetic Data

Reviewer G. Accuracy only. Judged against the committed blobs at HEAD (`6ae9f55`): `src/sections/Augmentation.tsx`
and `src/components/figures/AugThreeWays.tsx`, read with `git show HEAD:...`, not the working tree (the uncommitted
changes in the tree are section 15 files only). Changes read from `git diff f914a85 HEAD` for both files. Registers:
`research/2026-11/*.md` (claim, verbatim quote, "Use in dive", Wave 2 / Rewrite check lines; wave2-B verdicts for
every cited entry are HOLDS), with `public/media/PROVENANCE.md` for the figure stills and `src/sections/Rendering.tsx`
and `src/sections/WorldModels.tsx` at HEAD for the cross-references.

## Part 1. Round 3 findings (wave2-r3-accuracy-F.md, Part 2)

| # | Sev | Round 3 finding | Status | Reason |
|---|---|---|---|---|
| 1 | error | Figure caption lost the stand-in and illustrative-strength qualifiers; "One demonstration" labels | RESOLVED | Caption now carries the proposed sentence verbatim: "Row 1's transforms are drawn at illustrative strengths, some beyond LeRobot's defaults; row 2's randomised scenes, from a different capture, stand in for simulated replays and also vary colour and light." Holds against the figure code (dark 0.68 < 0.8, hue 28 degrees > 18, saturation 1.6 > 1.5; bright 1.16, 3-degree rotation and 4.5% shift within) and PROVENANCE (`so101-domain-randomisation.jpg`: floor colour, light, object colours, a separate capture). Labels "One scripted episode" (wide and narrow) and title "One scripted episode beside three kinds of extra training data" match PROVENANCE ("Twelve replays of the same scripted motion"). The unchanged `<desc>` keeps one derivation phrase: new finding 3. |
| 2 | error | Opener's 1.65 to 3.3 lost its owner | RESOLVED | "... at 480p on NVIDIA's benchmark rows, depending on the inference library NVIDIA ran." Owner restored; 489.90 / 148.65 = 3.30, 217.90 / 132.06 = 1.65 (F05-97). "Depending on the library NVIDIA ran" names which row, not a cause, and the closing prints the methodology caution. |
| 3 | minor | Two closing sentences printed NVIDIA's per-clip times with no owner | RESOLVED | "On NVIDIA's PyTorch row one repaint at 480p holds ..."; "On NVIDIA's rows the H100 repaints a clip in 148.65 s ...". (A third, new sentence of the same kind was added by a clarity edit: new finding 2.) |
| 4 | minor | SkillGen time as plain fact | RESOLVED | "NVIDIA gives 90 to 120 minutes for 1,000 demonstrations with one environment on an RTX 6000 Ada, 5.4 to 7.2 GPU-seconds each" (F05-92 quote; 5,400 / 1,000, 7,200 / 1,000). |
| 5 | minor | "unquantified speed cost" | RESOLVED | "at a speed cost the README does not quantify" (F03-125 Use). |
| 6 | minor | Measured peaks lost the cosmos-framework owner | RESOLVED | "NVIDIA's cosmos-framework notes record Nano peaking at 33.8 GiB ...; They record none for a full 189-frame video through PyTorch". MiB kept for the TensorRT-LLM figure (F03-124 Rewrite check). |
| 7 | minor | "The requirement belongs to the renderer"; Mimic gap stated as page content | RESOLVED | "The requirement belongs to RTX rendering and to Isaac Sim as a whole" matches section 13 ("Isaac Sim is the one exception to the renderer rule", Rendering.tsx line 432) and F06-52 / F06-60. "Whether Newton Warp needs RT cores is not stated on its pages" sits within U8 and the wave2-B hedge ("it does not state that the Warp camera renderer is supported on GPUs without RT cores"); "this research did not establish whether Mimic's camera runs can use it" states the gap as a research gap. |
| 8 | minor | "built on its simulator" | RESOLVED | "NVIDIA's robot-learning framework, which runs on Isaac Sim or, since 3.0, without it" (F06-45 "now fully optional"; F06-52 Use: Isaac Lab stopped requiring Isaac Sim in 3.0). F06-45 is cited in the same container. |
| 9 | minor | "the single-GPU G7e" is not one size | RESOLVED | "the RTX PRO 6000 singly from g7e.2xlarge up, g7e.8xlarge among them" (F08-45 and F10-7: g7e.2xlarge, 1 GPU; F05-66: g7e.8xlarge, 1 GPU), "the price of the single-GPU G7e size you would run"; F08-45 now cited. "From g7e.2xlarge up" reads as where the single-GPU sizes start; g7e.48xlarge is 8 GPUs (F10-7), so it is not a claim that every larger size is single-GPU. |
| 10 | minor | 36 / 1.1 = 33 | RESOLVED | "1.14 GPU-seconds against 36" and "36 / 1.14 = 32" (19 min x 60 / 1,000 = 1.14; 10 h x 3,600 / 1,000 = 36; 36 / 1.14 = 31.6, rounds to 32). No other "1.1" remains in the section. |

**Round 3: 10 of 10 resolved.**

## Part 2. New findings (changed sentences, read in context)

1. **minor.** Opener, the new definition of replay: "A policy that misses the block in a new place needs new
   positions, and replay makes them: a recorded demonstration re-run in a simulator with the block moved, kept only
   if the simulated physics says it succeeded."
   - Register: F05-89 (cited): "the tool transforms the subtask segments to fit a new scene, stitches them into a
     candidate demonstration, runs it in the simulator, and keeps it only if a success check passes"; F05-88: "by
     adapting the human segments to new object positions". F05-89's documented path starts from demonstrations
     recorded by driving the arm inside the simulator. "Re-run ... with the block moved" says the recorded motion is
     played again unchanged in a moved scene, which is the open-loop replay of the SIMPLER paragraph, not what Mimic
     does (the figure's own row 2 says "Changes where the block starts and how the arm moves"); following "Recordings
     of the SO-101 ... at one bench", "a recorded demonstration" also reads as a bench recording, which no entry says
     Mimic takes. The "kept only if" clause is supported in substance: F05-89's boolean success check is run on the
     simulated outcome, and the section's own mechanism paragraph says "Physics decides where the block ends up".
   - Fix: "replay makes them: a few demonstrations recorded in a simulator are fitted to new block positions and
     re-run there, each kept only if a success check on the simulated result passes."

2. **minor.** Closing, the clarity edit that introduces the transfer times: "Repainting an existing 480p clip takes
   the RTX PRO 6000 489.90 s against the H100's 148.65 s, so the illustrative 50 clips take 50 x 489.90 s = 6.8
   GPU-hours on it against 2.1 on the H100 ..."
   - Register: F05-97 `[vendor claim]`, PyTorch rows (Diffusers: 217.90 s and 132.06 s). This is the first time
     489.90 s appears in the section, and the sentence names neither NVIDIA nor the engine. The sentence before it
     is framed "On NVIDIA's PyTorch rows" but is about text-to-video and ends at an F05-98 citation; the PyTorch scope
     of 489.90 is only stated one paragraph later ("than on its PyTorch row"). Same pattern as round 3 finding 3,
     which the correction fixed in the two other sentences. Arithmetic holds (24,495 s = 6.80 h; 7,432.5 s = 2.06 h;
     difference 4.74).
   - Fix: "On NVIDIA's PyTorch transfer rows, repainting an existing 480p clip takes the RTX PRO 6000 489.90 s
     against the H100's 148.65 s, ..."

3. **minor.** Figure `<desc>` (unchanged text, now out of step with the corrected title and caption): "One overhead
   frame of a demonstration feeds three rows. Image transforms show the same frame ..., Replay in a simulator shows
   three scenes with the block in a new place each time; ..."
   - Source: `public/media/PROVENANCE.md`: row 2's stills are `so101-domain-randomisation.jpg`, a different capture
     from the `so101-eval-grid.jpg` frame. The title was changed from "turned into" to "beside" and the caption now
     says row 2 stands in from a different capture, but the description a screen reader announces still says the
     frame "feeds" all three rows. The visible caption carries the qualifier, hence minor.
   - Fix: "One overhead frame of a scripted episode sits beside three rows; row 2's scenes come from a different
     capture and stand in for simulated replays."

## Checked and holding (changed text)

Opener: "It runs on a GPU that renders" unchanged in substance from round 3; 1.65 / 3.3 owned (above). Caption and
labels (above). Transforms: "the stored video stays as recorded and the transforms apply as each frame is loaded"
(F05-85 "applied during training time only, not during recording ... raw images are stored without transforms";
F05-85 Use "inside the training input path, after decode"; both backends apply after decode, F05-87). Replay: Isaac
Lab description (F06-45); "on the same RTX 6000 Ada" (F05-91 "on a RTX ADA 6000" for both quotes); 1.14 and 32
(above); Newton Warp paragraph (F06-45, F06-50 "direct lighting", "included in the base install", F06-51, U8;
section 13 title "Rendering and Ray Tracing" matches `sections.json`). SkillGen (above). Generation: DreamGen pairing
"one with 10 real demonstrations plus 40 generated and one with 13 plus 50" matches F05-102: 40 and 50 trajectories
collected for strawberry pick-and-place and tic-tac-toe "respectively", 25% kept as real (40 x 0.25 = 10; 50 x 0.25 =
12.5, printed 13), and "40 and 50 neural trajectories for the two SO-100 tasks, respectively", so 10 + 40 and 13 + 50;
21% to 45.5% owned ("its authors report"). "35 in the examples on Cosmos 3's model card, a count to confirm there for
your model" keeps the confirm hedge (F03-95 Use "35 in the model card's examples", no verbatim line; section 6,
WorldModels.tsx line 327, still prints 35 with "a figure this research records without the verbatim line"). F03-124
and F03-125 sentences (above). Closing: "The inference library moves that gap" is the round 3 "The engine moves that
gap" renamed, with NVIDIA's caution still printed after it (F05-97); 489.90 / 217.90 = 2.25 ("2.2"); 50 x (217.90 -
132.06) s = 1.19 h ("1.2"); 12 x 3,600 / 489.90 = 88.2; 12 x 3,600 / 217.90 = 198.3; break-even 148.65 P_H < 489.90
P_G gives 3.30, Diffusers 1.65; no dollar figure; F05-66 p5.4xlarge single H100.

**Section 11: about 50 claims checked; round 3 findings 10 of 10 resolved; 3 new findings (0 error, 3 minor).**
