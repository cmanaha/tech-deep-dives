# Rendered pass, sections 25 to 27

Date: 2026-10-24. Scope: section ids `ops`, `decision` and `codebase` (all six tabs). Sections
1 to 24 and 28 are logged in `rendered-pass.md` by a separate pass.

## Method

- Build: `npx vite build --outDir /tmp/sglang-dist-rp2 --emptyOutDir` (never `pnpm build`).
- Harness: `node revamp/tools/shoot.mjs` at 1440 and 390, for `ops,decision`, then for
  `codebase` with `--tabs` naming all six tabs. It reports text overlaps and viewBox clipping
  per diagram, and writes full-page and per-diagram PNGs.
- Extra probes (session scripts in /tmp, not committed):
  - DOM probe at both widths: browser console warnings and errors, elements that pass the
    viewport with no clipping ancestor (Cloudscape's off-screen breadcrumb ghosts excluded),
    `pre`/`code` that overflow with no scrolling ancestor, raw entities, `undefined`, `NaN`
    or JSX in visible text, links whose text is a bare URL, expanded ExpandableSections with
    an empty body, empty Containers, and the rendered size of every SVG `text`.
  - The same probe against a Vite dev server, because the production build strips React's
    development warnings.
  - Full-width 390 shots of both diagrams with the scroll wrapper unclipped. The harness's
    element shot crops a diagram that sits in an `overflowX: 'auto'` wrapper to the visible
    part.
  - Expandable count: every ExpandableSection in scope was open in the harness shots (1 in
    Operations, 0 in Decision Guide, 1 per codebase tab except 2 in Gateway & Rust Frontend,
    matching the source).
  - Column widths of the Operations tables at 390 (the declared `minWidth` values apply).
- Every full-page PNG was cut into tiles (1000 px at 1440, 1400 px at 390) and read, plus
  every diagram PNG at both widths.

## Baseline (before fixes)

Harness: every section and tab `ok` at 1440 and 390, 0 overlaps, 0 clips, no horizontal
page overflow. Probe: no console message in the production build; no element past the
viewport; every `pre` in scope carries `overflowX: 'auto'`; no entities, bare-URL links,
empty expandables or empty Containers. One finding: the step numbers of the module map
(codebase, Launch Path tab) rendered at 8.0 CSS px at 390.

## Per section

Counts are harness overlap/clip at 1440 and 390, after fixes.

### 25. Operations (`ops`)
- Harness 1440: 0/0; 390: 0/0. No diagrams. Probe: 0.
- Seen: five symptom tables and the advisories table render with Cloudscape's horizontal
  scroll at 390 (columns 180/220/260/140 px as declared). The first row of "Where a key does
  not reach" is 589 px tall at 390 because of long cell text in a scrolled column; that is
  content density, not a rendering fault. "The nine advisories" expandable opens with its
  table. Cites render with tier badge, title and access date.
- Fixed: nothing needed.

### 26. Decision Guide (`decision`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0.
- Seen: the decision tree renders clean at 1440 (1238 px wide); at 390 it sits in a
  horizontal scroll container at 680 px, smallest label 8.5 px, no collisions. First-week
  list and cites render clean.
- Fixed: nothing needed.

### 27. Inside the Codebase (`codebase`)
- Launch Path & Argument Resolution: harness 1440: 0/0; 390: 0/0. The module map renders
  clean at 1440; at 390 it scrolls at 720 px. Step numbers 1 to 8 rendered at 8.0 px on the
  phone. Fixed: `.cb-arch-step-t` font 10px to 11px and the baseline offset from `y + 3.5`
  to `y + 4` in `src/sections/codebase/CodebaseArchitecture.tsx`; the smallest label is now
  8.8 px at 390 and 13.1 px at 1440, digits centred in their circles, harness still 0/0.
- Scheduler & Batching: 0/0 and 0/0. No diagrams. Tables and expandable clean. Nothing
  needed.
- Radix Cache & Memory Pools: 0/0 and 0/0. No diagrams. The `Tree cache initialized` log
  line scrolls inside its `pre` at 390. Nothing needed.
- Model Execution & Attention: 0/0 and 0/0. No diagrams. Two-line log block scrolls at 390.
  Nothing needed.
- Parallelism, MoE & PD: 0/0 and 0/0. No diagrams. Process-title block fits; the registry
  `curl` scrolls at 390. Nothing needed.
- Gateway & Rust Frontend: 0/0 and 0/0. No diagrams. The `python -c` line and the Rust-mode
  probe block scroll inside their `pre` at both widths. Both expandables open with content.
  Nothing needed.

## Console

- Production build, both widths: no messages.
- Dev server, both widths: no React warning or error. One Cloudscape development warning at
  390, `[AwsUi] [Button] Overriding native attribute [aria-haspopup]`, raised inside
  Cloudscape's own menu dropdown (top navigation collapsed menu). It does not come from any
  file in this dive.

## Left for the owner

- Inline `--flag` code can wrap between its two leading hyphens: `--speculative-num-steps`
  in the Decision Guide at 1440, `--pp-size` and `--attn-dp-size 8` in Parallelism, MoE & PD
  at 390. The break point moves with viewport width, so a fix belongs in a shared style for
  inline `code`, outside this pass's files.
- The harness prints no browser console output, and its 390 element shot crops diagrams that
  sit in a horizontal scroll wrapper. Both are in `revamp/tools/shoot.mjs`, outside this
  pass's files.

## Gates

- `pnpm --filter @tech-deep-dives/sglang typecheck`: `tsc --noEmit`, exit 0, no errors.
- `pnpm --filter @tech-deep-dives/sglang lint`: `eslint src --ext .ts,.tsx --max-warnings 0`,
  exit 0, no output.
- `bash scripts/gates/no-ai-tells.sh`: PASS.
- `bash scripts/gates/svg-a11y.sh`: PASS.
