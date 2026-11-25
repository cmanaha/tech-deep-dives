# Accuracy review, wave 1 round 3 (confirming pass): sections 5 to 8, plus one line of section 11

Text reviewed: HEAD (943e5af) for `VisionLanguageAction.tsx`, `WorldModels.tsx`, `Jepa.tsx`, `RobotRl.tsx`,
`Augmentation.tsx` (the working tree matches HEAD for these files). Fix diff: `git show 943e5af -- src research
revamp/claims`. Round 2 findings: `revamp/reviews/rewrite/wave1-r2-accuracy.md`. Registers:
`research/2026-11/*.md` at HEAD; links checked against `src/data/registry.json`. Each edited sentence was read in
its paragraph. Unchanged text was not re-reviewed.

## Round 2 findings

| ID | Verdict | Reason |
|---|---|---|
| 5-N1 (opening covers GR00T 2, a one-network model) | RESOLVED | Now "In most of the models covered here, the parameter count ... is, or is nearly, the sum of two networks". The section later describes GR00T 2 as one transformer (F02-44), and "most" leaves room for it. The rest of the paragraph is unchanged (pi0 3B + 300M, F02-32). |
| 6-N1 (35 passes stated flat at first use) | RESOLVED | First mention now "running a transformer of billions of parameters tens of times", keeping "in NVIDIA's Cosmos 3 examples". 35 now first appears with the hedge "a figure this research records without the verbatim line" (Denoise item, F03-95). The later mentions ("At those 35 passes", "visit their tokens 35 times") come after the hedge in reading order. "Tens of times" agrees with F03-95's Use line (35) and with the unchanged "tens of times per clip" later on. |
| 6-N2 (caption: wrong divisor for the last bar) | RESOLVED | Caption adds "(for the last bar, by the number of candidate steps)". The last row of `CANDIDATES` is LeWorldModel, "22 to 65 microseconds per step". F03-118 divides 0.98 s by 45,000 or 15,000 candidate steps. The list item under the chart says the same. |
| 6-N3 (LeRobot world-action models offered with no timing behind them) | RESOLVED as asked, with a NEW error | The round 2 replacement was applied word for word: "for none of which this research found a published inference time". The rate implication is now hedged, but the hedge itself is wrong against register 03. See N1 below. |
| 7-N1 ("corrects prediction errors" stronger than the quote) | RESOLVED | Now "replanning from the real frame makes the plan robust to prediction errors". F03-110 quote: "closed-loop MPC providing robustness to prediction errors". |
| 7-N2 (citation label names a file its link does not open) | RESOLVED | Label is now "vjepa2 notebooks, world_model_wrapper.py and mpc_utils.py". The registry link opens `world_model_wrapper.py`. F03-29's Location names both files, and its quote holds the `mpc_utils.py` zero-rotation lines that support "rotation held fixed". |
| 8-N1 (6.7 widened from one Cartpole pair to all Cartpole rows) | RESOLVED | Now "knowing that in the same file Newton's Cartpole rows lose a factor of 6.7 to the camera". This is the register's own wording (F06-48 claim: "cut Newton's Cartpole training throughput from 1,023,698 to 152,124, a factor of 6.7"; 1,023,697.6 / 152,123.9 = 6.73). Two paragraphs earlier the section defines Newton as "the Newton physics and renderer pair". Residual, not counted: F06-48 also has a Newton-physics row with the OVRTX renderer (127,990, a factor of 8.0). "Newton's physics-and-renderer Cartpole pair" would close even that reading. |
| 8-N2 ("the GPU ... differ" where the recipe names no GPU) | RESOLVED | Now "The robot, the task, the simulator and the environment count differ from the recipe's, and the recipe names no GPU". F04-58 quotes the config (`nworld: int = 4096`, no GPU named; the README's CPU fallback). U12 leaves the wall-clock open. 8,192 against 4,096 environments (F04-55 and F04-58). The paragraph's `Derived` figures are unchanged: 196,608,000 / 28,000 = 7,022; / 116,000 = 1,695. |
| 6-m13 follow-up 1 (F03-124 Use line still "50 to 52 GiB") | RESOLVED | The Rewrite check line now reads "Print the source's MiB figures: 50,623 to 52,147 MiB. The same applies to the "50 to 52 GiB" in the Use line." That line overrides both the claim sentence and the Use line. |
| 6-m13 follow-up 2 (section 11 and `claims/augmentation.md` print 50.6 to 52.1 GiB) | RESOLVED | `Augmentation.tsx` line 334: "sits at 50,623 to 52,147 MiB when served through TensorRT-LLM, NVIDIA's serving runtime, after a 189-frame warm-up". This matches the F03-124 quote ("50,623-52,147 MiB after the default 720x1280x189 warm-up"). "Sits at" rather than "peaks" keeps the quote's wording. `claims/augmentation.md` line 33 matches. A grep of `src`, `revamp/claims` and `research` finds no "50.6", "52.1 GiB" or "50 to 52" left, except in F03-124's claim sentence and Use line, which the correction line overrides. |

Resolved: 10 of 10.

## New findings

### N1. `error`. Section 6, `WorldModels.tsx` line 877, bullet "An action several times a second"

- Quoted text: "Today that is a VLA such as GR00T N1.7, the newest GR00T with released weights and code, or one of the
  world-action models LeRobot v0.7.0 packages, for none of which this research found a published inference time
  (section 5, Vision-Language-Action Models, lists both): ..."
- Entries: F02-84. LeRobot's `cosmos3` package has two policy types, `cosmos3_nano` and `cosmos3_edge`, "built on
  NVIDIA Cosmos 3". F03-127 is the Cosmos3-Edge model card, Tier 1, vendor reported. Its table includes a "Policy
  DROID" column: "H100 SXM 80 GB | ... | 1.41 s" and "Jetson AGX Thor T5000 ... | 6.32 s", under "All results
  were measured using a single GPU and a batch size of 1". The claim sentence reads: "a DROID policy call in
  6.32 s on the T5000, against ... 1.41 s on an H100 80 GB".
- What is wrong: this research did find a published inference time for the model behind one of the packaged
  world-action models. It is NVIDIA's figure, timed in NVIDIA's runtime (vLLM-Omni) and not through LeRobot, but
  it falsifies "for none of which this research found". Round 2's basis for 6-N3 covered the register 02
  entries (F02-84 to F02-96) and missed F03-127. The other five packages (`flux3`, `fastwam`, `lawam`,
  `longwam`, `lingbot_va`) do lack a time in the register: F02-88, F02-90, F02-93, F02-94, F02-96 and F07-29
  hold none.
- Suggested fix, either one:
  (a) Narrow the hedge to what the register supports: "... or one of the world-action models LeRobot v0.7.0
  packages, whose LeRobot guides, as read for this research, print no inference time (section 5, Vision-Language-Action Models, lists
  both): ..."
  (b) Keep the scope and print the one figure with its owner: "... packages; the only published inference time
  this research found for any of them is NVIDIA's for Cosmos3-Edge as a DROID policy, 1.41 s a call on an H100
  80 GB at batch 1 (section 5, ...)", adding `<Cite id="F03-127">Cosmos3-Edge model card</Cite>` (F03-127 is in
  `registry.json`).

## Bookkeeping, not accuracy, not counted

- `revamp/claims/world-models.md` line 70 still records "a transformer of billions of parameters 35 times"
  (the text now says "tens of times"). Line 65 does not record the new absence clause of the 6-N3 fix.
  `claims/robot-rl.md` line 17 already matches the 8-N1 wording.

## Counts

| Section | Edited sentences checked | Claims checked | New error | New minor |
|---|---|---|---|---|
| 5 `vla` | 1 | 3 | 0 | 0 |
| 6 `world-models` | 3 (opening, caption, bullet) | 12 | 1 (N1) | 0 |
| 7 `jepa` | 2 (prose, citation label) | 4 | 0 | 0 |
| 8 `robot-rl` | 2 | 9 | 0 | 0 |
| 11 `augmentation` | 1 (plus claims line and F03-124 line) | 4 | 0 | 0 |

NEW FINDINGS: 1
