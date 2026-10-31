# Rendered pass, part C: sections 1 to 4

Source: /tmp/rl-tiles-render-c (full-page tiles, 1400 px tall) and /tmp/rl-shots-render-c (one PNG per diagram), rendered from the committed build.

Note on the supplied tiles: in /tmp/rl-tiles-render-c the last tile of each section/width is the uncropped full page and the earlier tiles start part-way down (t00 at 1440 opens mid-diagram), so the page top was only visible in the full-page file. This pass re-cut every full page into overlapping 1400 px tiles with ffmpeg (/tmp/rl-tiles-pc/<id>-<width>-pNN.png, 100 px overlap) and read both sets.

## 1 one-loop (OneLoop.tsx)
- 1440: ok (t00-t02, p00-p02, svg0). Loop diagram legible, store table fits, expandable open and filled, badges wrap at line ends without breaking a sentence.
- 390: DEFECT, one-loop-390-t00 / t02 (p01-p02): StoreTable (~L281) columns have minWidth 130 + 200 + 200 + 200, so at 390 the scroll clip falls exactly on the boundary after "The weights"; the table reads as a finished two-column table and "The context" and "A small trained model" columns are off-screen with no cut-off cue, while the lead-in asks the reader to read across a row. Diagram svg0 scrolls by design (minWidth 640, viewBox 780, sub-labels about 9 to 10 px), cut-off boxes are the cue, ok.

## 2 getting-started (GettingStarted.tsx)
- 1440: ok (t00-t02, p00-p02, svg0). Route map legible, no label collisions, legend and stage arrows clear; four-ideas grid, badges and the open expandable render clean.
- 390: ok (t00-t03, p00-p03, svg0). Route map scrolls by design (minWidth 760, viewBox 980, 11-unit labels render about 8.5 px, small but readable); cut-off boxes ("13. Me", "Stage 1. The RL vocabulary o") are the scroll cue. Observation, not fixed: the L/A/R legend sits at the far right of the map, so at 390 it is off-screen until the reader scrolls about 460 px sideways. Cosmetic, dive-wide: bare `<ul>`/`<ol>` inside SpaceBetween keep the browser's 1em margins, so the three lists (~L392, ~L487, ~L543) sit in visibly larger gaps than the paragraphs around them; same pattern in five other section files, left alone for consistency.

## 3 policy (LanguageModelAsPolicy.tsx)
- 1440: ok (t00-t03, p00-p03, svg0). Token/response diagram legible with no collisions; RL-term table fits; both expandables open and filled; the TRL `pre` block fits without scroll. Dive-wide: Cite dates sometimes break at the hyphen ("2026-10-" / "30)"), shared Cite component, outside these files.
- 390: ok (t00-t06, p00-p07, svg0). Diagram scrolls by design (minWidth 640, viewBox 760, labels about 8 to 9 px), cut "Respo..." and token boxes are the cue. RL-term table scrolls with the "In a generation call" column cut mid-word at the edge, which is the cue; "Written as" is reached by scrolling. TRL `pre` scrolls (overflowX auto), cut lines are the cue. Inline `pass@k = mean over problems of [ 1 - C(n - c, k) / C(n, k) ]` (~L576) wraps after "[ 1 -"; readable, left as is.

## 4 policy-gradient (PolicyGradient.tsx)
- 1440: ok (t00-t03, p00-p03, svg0, svg1). REINFORCE-vs-RLOO bar diagram and the four-column "one gradient" table diagram legible, no collisions; both expandables open and filled; formula lines fit on one line each.
- 390: DEFECT, policy-gradient-390-t03/t04 (p04): the two multi-line formula blocks are inline `<code>` lines joined by `<br />` inside a paragraph, so at 390 each line wraps and its continuation starts at the left margin like a new equation: RLOO/GRPO block (~L638-L640) becomes four lines ("k - 1 rewards) / (k - 1)", "r_G)) / std(r_1, ..., r_G)"), and the GAE block (~L665-L669) leaves "V(s_t)" and "gamma^l * r_t+l) - V(s_t)" alone on lines, so three equations read as five. Diagrams svg0 and svg1 scroll by design (minWidth 640, viewBox 860, labels about 8 px); "Plain REINFOR" / "update = weight x gra" cut-offs are the cue, ok. Single-line inline formulas (~L424, ~L489, ~L713) wrap mid-expression but read as one formula, left as is.

## Fixes applied and re-checked
- OneLoop.tsx StoreTable: data-column minWidth 200 -> 240. Re-render (/tmp/rl-shots-rpc/one-loop-390.png, tiles /tmp/rl-tiles-pc2/one-loop-390-p02.png): at 390 the clip now falls mid-text in "The weights" ("paid once" / "forgo..."), the same cut-off cue as the section 3 table, and rows are shorter. 1440 (one-loop-1440-p01): table still fits the page, columns rebalanced slightly, no scroll.
- PolicyGradient.tsx: the RLOO/GRPO and GAE formula blocks render each line as a block `<code>` with a 2ch hanging indent (FORMULA_LINE) instead of `<br />`. Re-render (policy-gradient-390-p04): wrapped continuations are indented under their own equation, so the blocks read as two and three equations. 1440: unchanged, one line per equation.
- Wording, numbers, citations and badges untouched.
- Checks: typecheck exit 0, lint exit 0, no-ai-tells PASS, svg-a11y PASS, pre-overflow PASS.
