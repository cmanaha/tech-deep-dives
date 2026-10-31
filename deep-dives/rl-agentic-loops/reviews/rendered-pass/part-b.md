# Rendered pass, part B (sections 15 to 24)

Source: /tmp/rl-tiles-render-a (1400 px tiles) and /tmp/rl-shots-render-a (per-diagram PNGs), current committed build.
Format: per section, one line per width: "ok" or the defect (tile, what, where in file).

Harness note: in /tmp/rl-tiles-render-a every tNN=00 tile is a center crop, not the page top (sips treats `--cropOffset 0` as unset and centers), and the last tile per width is the whole page uncropped (crop taller than the remainder fails). The page top was in no tile. Re-tiled correctly into /tmp/rl-tiles-rpb-b (offset 0 passed as 1; last tile cropped to the remainder) with /tmp/rl-tools-rpb/tile.sh; same count, 127 tiles. Part A's tiles have the same flaw.

## 15 your-loops (YourLoops.tsx)
- 1440: ok (t00-t03, svg0). Map diagram renders full width, tags and legend legible.
- 390: ok (t00-t06, svg0). Map scrolls sideways by design (minWidth 700, viewBox 900, 11 px text renders about 8.6 px, readable); cut-off right column is the scroll cue. `pre` in "The lines behind the noise reading" scrolls sideways (overflowX auto), acceptable.

## 16 hybrids (Hybrids.tsx)
- 1440: ok (t00-t03, svg0). Advisor/student diagram has about 80 px of empty band above its first label (viewBox 0 0 900 350, content starts near y 60); cosmetic, not fixed.
- 390: DEFECT, t04: the chrF table (ChrfTable, Hybrids.tsx ~L276) squashes the "Arm" column to one or two words a line (a row runs 7 lines) and clips the "Gain over baseline" column at the right edge ("Gai/ove/bas", "+7.8", "+11"). No column has a minWidth. Diagram svg0 scrolls by design (minWidth 680, about 8.3 px labels), ok. Code sketch `pre` scrolls, ok.

## 17 words-limits (WhereWordsFallShort.tsx)
- 1440: ok (t00-t03, svg0). RULER chart and prefix-caching strip legible; edit marker sits inside the system-prompt cell by design.
- 390: ok (t00-t07, svg0). Chart scrolls by design (minWidth 680, viewBox 900); smallest labels ("score (%)", threshold note) render about 8 to 9 px, small but readable; cut-off right side is the scroll cue.

## 18 weights-context (WeightsVsContext.tsx)
- 1440: ok (t00-t03, svg0). Map renders at about 1.6x (viewBox 760), legend and dashed contested rows clear.
- 390: ok (t00-t07, svg0). Map scrolls by design (minWidth 640, about 9.3 px labels); store headers sit off-screen until scrolled, cut-off column is the cue. "Mark every row" table wraps into two narrow but readable columns.

## 19 rl-systems (RlStepAsSystem.tsx)
- 1440: ok (t00-t04, svg0). Sync/async timeline legible; rollout-time table fits.
- 390: DEFECT, t06 and t09: command-line flags in inline `code` break after their leading dashes, leaving "--" orphaned at a line end and the flag name on the next line ("--" / "algo.advantage.is_correction_level" at ~L797; "--" / "train.colocate_all", "--" / "colocate", "--" / "release-train", "--" / "use-tis" at ~L969-L1011). Diagram svg0 scrolls by design (minWidth 680, labels about 8.5 px), ok. Rollout-time table fits at 390.

## 20 cost (CostPerImprovement.tsx)
- 1440: ok (t00-t03, svg0). Calculator two-column layout aligned; inputs, preset selects, citations and results all inside their columns; chart legend, breakeven label and volume marker legible.
- 390: ok (t00-t06, svg0). Calculator stacks to one column; inputs full width, select text truncates with an ellipsis ("ReTool RL on Qwen2.5-32B (Training-...") which is Cloudscape's normal behaviour; results text wraps cleanly. Chart scrolls by design (minWidth 600, viewBox 760, labels about 8.7 px). Observation, not fixed: at 390 the breakeven circle and its label sit right of the visible window until the reader scrolls; making the chart fit would shrink labels to about 4.5 px.

## 21 lab (SideBySideLab.tsx)
- 1440: ok (t00-t03, svg0, svg1). E0 stacked bars, callout leaders and median column legible; E1 five-arm diagram clean; code blocks fit.
- 390: ok (t00-t07, svg0, svg1). Both diagrams scroll by design (minWidth 680, viewBox 860, labels about 8 px); at first view only the Generation segment and the left half of the arms show, cut edge is the cue. Install and GRPOConfig `pre` blocks scroll sideways (overflowX auto). Minor, t02: inline `nvidia-smi` breaks at its hyphen ("nvidia-" / "smi"); same class as the section 19 flag breaks.

## 22 choosing (Choosing.tsx)
- 1440: ok (t00-t03, svg0). Decision tree, amber exits, six path boxes and legend all inside their boxes.
- 390: ok (t00-t07, svg0). Tree scrolls by design (minWidth 680, viewBox 900, path sub-labels about 9 px); cut-off third column and legend are the scroll cue.

## 23 aws (RlOnAws.tsx)
- 1440: ok (t00-t04, svg0). Two-stacks diagram clean, path table fits, expandables filled. t04 is a 9 px remainder strip.
- 390: DEFECT, t07/t08: the "Each path from section 22" table (RlOnAws.tsx ~L869, columns without minWidth) renders 356 px wide in a 308 px card: cells squeeze to two words a line (rows run 7 to 12 lines) and the "What you bring" column is cut mid-word ("grade", "evalu", "Labell"). Probe: table 356 px, scroller 308 px. Diagram svg0 scrolls by design (minWidth 720, viewBox 900, about 9 px text); the whole Words stack column is off-screen at first view, with the cut Weights column as the cue.

Probe (Playwright, 390 px, /tmp/rl-tools-rpb/probe-tables.mjs): Hybrids chrF table 362 px in a 308 px scroller (columns 92/96/76/99 px); the cut shows "+7.8" and "+11" for +7.81 and +11.21, a misreadable number.

## 24 sources (GlossaryAndSources.tsx; report only, not edited)
- 1440: DEFECTS. (a) t00-t02: Glossary table (shared `Glossary` component) is 1660 px wide in a 1111 px scroller; Description lines do not wrap and are cut at the right edge on almost every row ("Advancement of", "an evolving cont"). (b) t03-t07: "All Sources" table is 1457 px in 1111 px; the Title column (1071 px, no wrap) pushes Tier, Type and Accessed wholly off-screen, so the reader sees only # and Title with no cue that three columns exist. (c) t02/t03: the shared SourcesAppendix header text carries em-dashes ("graded by authority — Tier 1...", Tier 4 card "tutorials — inspiration only") and describes a Tier 1-4 scheme (Tier 1 "Official AWS docs", Tier 4 "Blog posts") that differs from this dive's Tier 0-3 scheme stated in the section intro; Tier 0 (E0) is not counted in the cards.
- 390: DEFECTS. t00-t03: Glossary shows Acronym and a cut Full Form; Description wholly off-screen. t03-t07: All Sources shows # and a cut Title only. Same root cause: both shared tables render without wrapLines/column widths. Tier cards stack cleanly.

## Fixes applied (layout only; no wording, numbers, citations or badges changed)
- Hybrids.tsx ChrfTable: column minWidth 200/140/80/110. At 390 the table now scrolls (530 px in 308): Arm column whole, rows 2 to 3 lines, Weights column cut mid-text as the scroll cue, no truncated numbers. 1440 unchanged (fits, 1069 px). Verified /tmp/rl-tiles-rpb-after/hybrids-390-t04.png.
- RlOnAws.tsx path table: column minWidth 160/260/220. At 390 it scrolls (640 px in 308): Path column whole, rows 3 to 5 lines, second column cut mid-text as the cue. 1440 unchanged (1069 px). Verified aws-390-t07/t08.
- RlStepAsSystem.tsx: local `Flag` helper (`<code style={{ whiteSpace: 'nowrap' }}>`) on the eight `--flag` spans, so "--" never ends a line alone. Longest, --algo.advantage.is_correction_level, fits the 390 column (ends about 5 px inside the text edge). Verified rl-systems-390-t06/t09; probe reports no wrapped flag.
- SideBySideLab.tsx: `nvidia-smi` code span nowrap. Verified lab-390-t02.
- Re-shot hybrids, rl-systems, lab, aws at both widths with shoot.mjs: 0 overlaps, 0 clips, no page overflow.
- Checks after the fixes: typecheck, lint (0 warnings), tests (26 of 26), no-ai-tells, svg-a11y and pre-overflow all exit 0.

## Orchestrator follow-up: section 24

- The shared `Glossary` and `SourcesAppendix` components are replaced in this dive by
  `src/components/AppendixTables.tsx` (`GlossaryTable`, `KeySourcesTable`), which keep the shared data
  types. The glossary is two columns (term with its full form beneath, then the description) with
  line wrapping; the source table is two columns (number, then the title link with a line beneath
  for tier, type and accessed date) with line wrapping. Both fit 390 without sideways scrolling and
  wrap at 1440. The tier legend now describes this dive's Tiers 1 to 3 in the section intro's words,
  with no em-dashes, and the table is headed "Key sources" with a pointer to `sources.md`, since the
  curated list is not every citation. The second h1 the shared appendix added is gone.
- Verified by rendering section 24 at 1440 and 390 (ffmpeg tiles, 11 and 18): glossary and key
  sources read cleanly at both widths.
- The same shared-component defects remain in the efa, vllm and sglang dives, which use the shared
  components; `shared/` is outside this job's scope (open item for Carlos).
