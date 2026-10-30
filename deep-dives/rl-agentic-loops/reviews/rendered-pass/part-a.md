# Rendered pass, part A (sections 5 to 14)

Source: screenshots of the committed build in /tmp/rl-tiles-render-a (full-page tiles, 1400 px tall) and /tmp/rl-shots-render-a (one PNG per diagram), at 1440 px and 390 px. Harness geometry check: 0 text overlaps, 0 viewBox clips. This pass covers what geometry cannot see.

Note on the inputs: the pre-cut tiles in /tmp/rl-tiles-render-a are not a clean tiling (sips --cropOffset ignored the offset, so tNN tiles start at arbitrary depths and the last tile is the uncropped full page). This pass re-tiled every full-page PNG with a Playwright clip script (1400 px tiles, 1300 px step, 100 px overlap) into /tmp/rpa-tiles and read those.

Dive-wide observation (not a per-section defect): every diagram uses an overflowX scroll wrapper with minWidth 640 to 700 on an 860 to 900 viewBox, so at 390 the SVG text renders at about 8 px and the only scroll cue is content cut at the right edge (Playwright hides scrollbars; iOS shows them only while scrolling). Legible, small. Citation dates can wrap at the hyphen ("2026-" / "10-30") at both widths; that comes from the shared Cite component, outside these ten files.

## 5 leashes (TwoLeashes.tsx)
- 1440: ok (tiles t00-t03; both diagrams, gradient table, entropy chart read clean).
- 390: (a) leashes-390-t07 / leashes-390-svg1: entropy chart legend (Run 1 / Run 2, legend at viewBox x 600-760 in EntropyChart) and the "Training step" axis title sit off-screen to the right, so the visible part shows two unlabeled lines. (b) leashes-390-t05/t06: GradientTable has no column minWidth, so columns squeeze to one or two words per line and "added here" badge stacks under PPO; the fourth column is off-screen. Two-leashes diagram (svg0): ok apart from the dive-wide 8 px text.

## 6 preferences (PreferencesToRewards.tsx)
- 1440: ok (t00-t04; RLHF/DPO pipeline diagram, gradient table, all expandables open and filled).
- 390: preferences-390-t04/t05: GradientTable (columns without minWidth) squeezes Sample source and Scorer to one or two words per line, rows run 10+ lines tall, the "added here" badge breaks onto two lines inside the badge, and the Weight column is off-screen. Pipeline diagram (svg0): ok apart from the dive-wide 8 px text and right-edge cut.

## 7 rlvr (RlvrAndGrpo.tsx)
- 1440: ok (t00-t05; GRPO advantage diagram, four tables, both expandables).
- 390: (a) rlvr-390-t08: the "Our arithmetic" table (columnDefinitions near line 1130, minWidth 180/140/140) shows two of three columns; the "No gradient, G = 16" column sits wholly off-screen with no cut text to hint at it, while the next paragraph argues from that column ("Doubling the group cuts the silent share"). (b) rlvr-390-t07: the SageMaker multi-turn RL table (line 1040, minWidth 170/100/220/240) shows Setting and Default only; Choices and "Term in this section" are wholly off-screen with no cue, and the lead-in points the reader at "the right-hand column". The successor table and the TRL/verl table cut mid-text at the edge, so their scroll is visible: ok. Advantage diagram (svg0): ok apart from the dive-wide 8 px text.

## 8 what-rl-does (WhatRlDoes.tsx)
- 1440: ok (t00-t03; pass@k diagram, buy-back table, three expandables).
- 390: (a) what-rl-does-390-t08: the "Three ways to buy sharpening back per query" table (BUY_BACK, columns without minWidth) squeezes to one word per line, rows run 8 to 12 lines, and the fourth column "Where it was shown" shows two or three letters per line ("Cap / by / bas"). (b) what-rl-does-390-t01 / svg0: pass@k diagram scrolls by design and is cut mid-axis-label, so the scroll cue is there, but the first screen shows two unlabeled curves: the "Base model" / "After RL" labels, markers 2 and 3, and key items 2 and 4 are all off-screen right. Noted, not fixed: the curve labels sit at the curve ends, so keeping them on the first screen needs a redesign, not a layout fix.

## 9 agentic-rl (AgenticRl.tsx)
- 1440: ok (t00-t03; episode/loss-mask diagram, code expandable, five-environments table).
- 390: agentic-rl-390-t03/t04: the "Five environments, four fields" table (columnDefinitions near line 456, no minWidth) squeezes Setup to about 60 px, so venue badges break inside the badge ("COLM / 2025", "NeurIPS / 2025", "ICLR / 2026") and each Setup cell runs 8 to 10 lines; Observation and Reward columns sit wholly off-screen with no cut text as a cue. Episode diagram (svg0): scrolls by design, cut mid-label so the cue shows; ok apart from the dive-wide 8 px text. Code block in the expandable scrolls (pre with overflowX auto): ok.

## 10 reward-proxy (RewardIsAProxy.tsx)
- 1440: ok (t00-t03; two-panel over-optimisation chart side by side, hacks table, three expandables).
- 390: ok (t00-t09; the two panels stack through ColumnLayout and fit the column with no scroll, text about 8.5 px; hacks table fits in two columns).

## 11 text-loop (TextLoopAsRl.tsx)
- 1440: ok (t00-t05; terms table, three-stores grid, five-fields table with 20 rows, expandable).
- 390: text-loop-390-t04 to t06: the "Five fields describe every loop" table (FiveFieldTable, minWidth 170/160/200/170/160/170) shows Method and "State that persists" only, with the column edge landing on the card edge, so Update rule, Feedback signal, What stays frozen and Cost (four of six columns, 20 rows) are hidden with no cut text as a cue; the paragraph after it opens "The update-rule column carries...". Terms table: cut mid-text, cue visible, ok. Three-stores grid (svg0): scrolls by design (minWidth 700 on a 920 viewBox), cut mid-chip so the cue shows, text about 8 px; ok.

## 12 verbal (VerbalReinforcement.tsx)
- 1440: ok (t00-t03; Reflexion loop diagram, ablation table, SCoRe table in its expandable).
- 390: (a) verbal-390-t04/t05, severe: the SCoRe table in "SCoRe's first and second attempts" (columnDefinitions near line 395, no minWidth) breaks every word and number mid-character: headers read "Be / nch / ma / rk", "C / h / a / n / ge", numbers split as "52. / 6%" and "-1 / 1. / 2". Unreadable. (b) verbal-390-t02: the Reflexion ablation table (near line 294, no minWidth) pushes the pass@1 column, which carries the section's key 0.52, off the right edge with one glyph showing. Reflexion loop diagram (svg0): scrolls by design (minWidth 680 on a 900 viewBox), cut mid-box so the cue shows; ok apart from the dive-wide 8 px text.

## 13 experience (AccumulatingExperience.tsx)
- 1440: ok (t00-t03; update-rule scale diagram, method table, two expandables, checklist).
- 390: ok (t00-t07). Update-rule table (minWidth 150/280/180) scrolls with the second column cut mid-text, so the cue is visible; Source column reached by scrolling. Scale diagram (svg0): scrolls by design (minWidth 680 on a 900 viewBox), cut mid-box, the Regenerate band and "context collapse" card off the first screen; text about 8 px.

## 14 prompt-opt (PromptOptimization.tsx)
- 1440: ok (t00-t03; GEPA-vs-GRPO table, GEPA loop diagram, two expandables, checklist).
- 390: prompt-opt-390-t02/t03: the GEPA-against-GRPO table (Task, Base model, LoRA GRPO, GEPA, GEPA rollouts) shows the first three columns with the edge landing between columns, so the GEPA column, which carries the section's headline 54.85, and the rollouts column are hidden with no cut text as a cue. GEPA loop diagram (svg0): scrolls by design (minWidth 680 on a 900 viewBox), cut mid-box, steps 3 to 6 off the first screen; text about 8 px; ok.

## Fixes applied (sizing only; no wording, numbers, citations or badges changed)

Cause, measured in the browser: Cloudscape tables with no column minWidth squeeze to the 308 px column at 390, and inside an ExpandableSection the inherited `word-break: break-word` lets them break mid-word. Tables whose minWidths put a column boundary on the card edge hide whole columns with no cut text. Fix: column minWidths so text reads at word level and the 390 cut lands mid-text in the second or third column; at 1440 every changed table still fits its container (checked at 1069 px, the width with the side nav open).

- leashes: GradientTable minWidth 150/220/220/260; EntropyChart legend moved under the title at the left (viewBox 860x300 to 860x320, plot shifted down 20) so Run 1 / Run 2 show on a phone without scrolling.
- preferences: GradientTable minWidth 150/220/220/260.
- rlvr: SageMaker table Setting minWidth 170 to 250 (Default header now cut mid-word as a cue); arithmetic table 180/140/140 to 94/107/107, so all three columns fit at 390 with whole words.
- what-rl-does: BuyBackTable minWidth 150/220/200/240.
- agentic-rl: five-environments table minWidth 170/220/200/200/240; venue badges stay on one line.
- text-loop: FiveFieldTable State 160 to 200 and Feedback signal 170 to 160 (sum 1060, fits at 1440 with nav open).
- verbal: AblationTable Setup minWidth 150; ScoreTable minWidth 150/200/110/120/110 (no more mid-word breaks).
- prompt-opt: ResultTable Task minWidth 155; the GRPO header is cut at 390 and its numbers stay whole.

Verified: rebuilt to /tmp/rl-dist-rpa, re-shot all eight changed sections at both widths with shoot.mjs (0 overlaps, 0 clips), measured each table's column visibility with a Playwright probe, and read the re-rendered crops at 390 and 1440.

## Residual, not fixed
- prompt-opt 390: GEPA and GEPA rollouts columns still need a sideways scroll; five numeric columns cannot fit 308 px, and any cut through a number column would show truncated numbers.
- verbal 390: pass@1 still needs a sideways scroll (the four columns' min-content is 376 px); the cut now lands in the "Written reflection" header.
- what-rl-does 390: pass@k curve labels sit at the curve ends, off the first screen. Needs a diagram redesign.
- Dive-wide: diagram text renders at about 8 px at 390 on the min-width scroll containers; citation dates wrap at the hyphen (shared Cite component).
