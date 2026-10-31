# Rendered pass: every section at 1440 and 390

Date 2026-10-30. Every one of the 24 sections was rendered from the built app with
`revamp/tools/shoot.mjs` at 1440 px and 390 px, cut into 1400 px tiles, and read image by image by
three agents (part A: sections 5 to 14; part B: 15 to 24; part C: 1 to 4), plus the orchestrator for
section 24 after its fix. Findings and fixes per section are in `part-a.md`, `part-b.md` and
`part-c.md`.

## Result

- Geometry check (harness): 0 text overlaps and 0 viewBox clips in every diagram at both widths,
  re-run on the final build (all 48 section renders "ok").
- At 1440, every section read cleanly except section 24, whose shared glossary and source tables ran
  off the right edge. Fixed with dive-local tables (`src/components/AppendixTables.tsx`).
- At 390, fixes in sections 1, 4 to 9, 11, 12, 14, 16, 19, 21, 23 and 24: tables squeezed to a word
  per line or breaking words mid-character, whole columns hidden with no cue that the table scrolls,
  formula lines wrapping into extra lines, command-line flags breaking after "--", and a chart legend
  off-screen. Every fix is layout only (column widths, nowrap, a hanging indent, legend placement);
  no wording, number, citation or venue badge changed.
- Diagrams with many labels scroll sideways at 390 by design (a min-width container), with the cut
  landing mid-text as the cue and labels at about 8 to 9 px.

## Accepted, recorded for a later iteration

- Section 14's GEPA-against-GRPO table and section 12's Reflexion ablation table still scroll
  sideways at 390 (five numeric columns, and four columns of 376 px min-content, cannot fit 308 px);
  the cut lands mid-header as the scroll cue.
- Section 8's pass@k diagram scrolls at 390 and its curve labels sit at the curve ends, off the
  first screen; fitting them would need a diagram redesign (an enhancement, not a correction).
- Section 20's breakeven marker sits right of the first screen at 390 until the reader scrolls.
- The tile cutter first used `sips`, which centre-crops; every agent re-cut its tiles, and the final
  cutter uses `ffmpeg` (`crop=iw:1400:0:<y>`, 100 px overlap).
