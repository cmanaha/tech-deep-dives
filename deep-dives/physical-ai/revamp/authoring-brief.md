# Authoring brief: Physical AI (shared by every section author)

Research date and accessed date for every source: **2026-11-20**.

Repo root: `<repo root>` (a git worktree, branch
`deep-dive/physical-ai`). Dive: `deep-dives/physical-ai/`. You own exactly ONE section file, named in your task,
plus `revamp/claims/<section-id>.md` and `revamp/glossary/<section-id>.json`, plus any shared component your task
names. Edit nothing else: not `App.tsx`, not another section, not `SCOPE.md`, not the registers, not `src/components/`
or `src/lib/` (unless your task names a file there). No git write commands: the orchestrator commits. No web
requests are needed; if you make one, never put personal data (names, email addresses, account ids) in any request,
header, User-Agent, URL or query string. Give any subagent that rule verbatim. Never run `pnpm build` (it writes the
shared `dist/`); never call AWS APIs, SSH anywhere, or send messages.

The talk this dive grew from has a session code (the letters C-M-P followed by the digits 4-0-7). It must never
appear in any file you write.

## 1. Read, in this order

1. `CLAUDE.md` at the repo root: "Writing Style: No AI Tells", "Diagram Standards", "Section Shape", "Explaining
   Concepts", "Acronym Standard".
2. `docs/standards/explaining-concepts.md` (all of it) and `deep-dives/efa/revamp/section-shape-standard.md`.
3. `deep-dives/physical-ai/SCOPE.md`: "The reader", "Thesis", "How sections are built", your section's block in the
   section plan, your section's block in "Numbers by section", and the plan changes C1 to C12 that name your section.
4. `deep-dives/physical-ai/revamp/section-architecture.md`: your section's block. It is the contract: build those
   h2 blocks in that order. `revamp/diagram-plan.md`: the diagrams you owe and the SVG and animation contract.
5. The register entries your block cites, in `research/2026-11/0N-*.md`. Open each entry: the claim, the Location,
   any "Wave 2" or "Wave 3" line under it (a correction there overrides the claim sentence), the verbatim quote and
   "Use in dive". Then read that register's section 5 "Teaching material" for your section (plain-words idea, worked
   example on the arm, mechanism, compute cost) and section 7 "Mental models". `research/2026-11/wave3-unknowns.md`
   and `wave3-iot.md` hold late additions; search them for your section number.
6. One finished section as the quality bar for structure and Cloudscape idiom:
   `deep-dives/rl-agentic-loops/src/sections/PolicyGradient.tsx` (skim: h1 Container with description, h2 Containers,
   module-private diagram functions above the export, `ExpandableSection` for evidence). For inline SVG craft:
   one of `deep-dives/silicon-memory-inference/src/sections/*.tsx`.
7. Sections already written for this dive that yours depends on (your task names them), so you do not re-teach
   and do not contradict them.

## 2. The reader, and the owner's standing corrections

A technical reader in 2026 from IT or software at level 100 to 200. They know what a model, training, weights,
fine-tuning, a GPU, a container, Kubernetes and S3 are, and have heard of vision-language models. They have **no
robotics background**: no control theory, no kinematics, no reinforcement learning beyond the name.

- Do not explain general computing or what training is. Link to the sibling dive that owns it (section 8 below).
- Build every robotics and physical-AI concept before using it. A term the reader meets in a diagram label, a table
  cell, a caption or a header description counts as used.
- The owner's standing correction on this repo, in his words: each concept starts with **what it is, what it looks
  like, when to use it and when not, with the numbers after as support**; "I don't want you to overdo things."
  So: lead with the idea and the picture; numbers support; no walls of figures; no catalogue of every entry in the
  register. A section that prints forty numbers has failed even if all forty are cited.
- Too steep (a term before it is built, a formula before its intuition) and too flat (mechanism, formula or number
  dropped, or talking down) are both failures.
- The page reads as current for a reader meeting it for the first time. No changelog voice: no "Correction:", no
  "previously", no "the seed research said", no "wave 2". The corrected fact stays; the story of the correction goes.
- Define things by what they are. No "not X, but Y" flourishes. Frame the subject as a challenge to meet.

## 3. Section order

**Concept sections (3 to 8, 12 to 14, 16)** use this fixed order, as h2 blocks or inside them:
1. A scene on the arm: what the reader would see at the bench.
2. The idea in plain words, every term explained at first use.
3. One small worked example with real numbers on the thread task. Toy numbers are labelled as illustrations and the
   arithmetic can be redone by hand.
4. The mechanism: which tensor goes where; the formula with every symbol defined before it; then which term carries
   which part of the intuition.
5. What it costs in compute and which part of the machine it loads (this ties to sections 20 to 25).

**Practical sections (9 to 11, 15, 17 to 25)** open by naming the concept section they depend on and do not
re-teach it. They end on what the reader does next.

Every section: an h1 `Header` whose text is exactly `N. Title` from `revamp/tools/sections.json` with a description that states, in one to three plain sentences, what the reader will be able to do. No provenance or access dates in the description; they live in the citations. Every h2 `Header` has a description that states the payoff (the reader's
moment or result), not the topic. Open with two or three sentences on what the thing is and why it matters. Land
the section's strongest number at least twice. Demote supporting evidence, catalogues and long derivations into
`ExpandableSection`. No key-takeaways box, no summary box. Length: 1,200 to 2,500 words of reader text; sections 6
and 7 may reach 3,500; sections 1 and 2 may be shorter.

## 4. The thread task

The story is: an SO-101 arm must pick up a block and place it in a cup. Import the wording from `src/lib/task.ts`
(`ARM`, `TASK_STORY`, `TASK_NAME`, `SIM_TASK`, `SIM_TASK_PLAIN`, `SIM_TASK_GAP`) and state the task in **one place
per section** where practical (define a `const` at the top of your file if you need a variant), so a later switch
of task is a small edit. Where first-party code exists only for the pick half (MuJoCo Playground's
`SO101PickCubeVision`), say so plainly once: the shipped task picks the cube up; placing it in the cup is this
dive's extension.

## 5. Evidence: how register labels render on the page

| In SCOPE or the register | On the page |
| --- | --- |
| `(F03-61)` register ID | `<Cite id="F03-61">short source title</Cite>`. Never print a register ID in reader text. |
| `[vendor claim]`, `[author reported]` | Say whose figure it is in the sentence ("NVIDIA reports", "the authors report"). The `Cite` adds the badge by itself. Never flatten such a figure into plain declarative prose. |
| `[derived]` | Show the arithmetic in the sentence; the `Cite` badge ("derived") marks it. If the register has a `[derived]` entry, cite it. |
| `[our reading]` | Say once, in a plain sentence, that the claim is our own inference; the `Cite` badge ("analysis") marks it. Never "our reading" in the prose. |
| Tier 0 (our measurement) | Name the machine and software version and say "single run" (or "one run per pass, two passes") every time. |
| Hedges | Keep their scope. "Not located in this research" never becomes "does not exist". "The lists read on 2026-11-20 name no G-family type" never becomes "cannot be reserved". |
| UNKNOWN in the register | Does not ship as a fact. |

### The `Cite` component

```tsx
import { Cite, Toy, Derived } from '../components/Cite';

<Cite id="F03-25">V-JEPA 2 paper, section 4.2</Cite>
```

- The ID resolves, through `src/data/registry.json`, to the entry's pinned URL, tier, venue and provenance badge.
  You never type a URL for a register source. The children are the short visible title of the source (paper and
  table, file and lines, doc page): take it from the entry's Evidence and Location lines.
- **A citation marker never splits a definition.** Put the `Cite` after the sentence that defines or states.
- Synthesis entries (`[derived]`, `[our reading]` with no source of their own) render as "our arithmetic" or "our
  reading" with no link; cite the underlying entries beside them when the reader needs the source.
- A number or fact with no register entry does not ship. If you believe an entry is wrong or a needed fact is
  missing, do not fix it from memory: leave it out and report it.
- Sibling dives are plain navigational links, never `Cite`:
  `<Link href="../rl-agentic-loops/">Learning From Feedback dive</Link>`.

### The citation check (it will be run on your section; run it yourself first)

The check renders your section and, for every block of text (a paragraph, list item, table row, figure, heading):
- every number in a block **that carries a citation** must appear in the text of the entries cited **in that block**
  (claim, quote, "Use in dive", wave lines);
- every number in a block with no citation must appear in an entry cited somewhere in the section;
- skipped: integers up to 12, numbers inside a `Cite` label, numbers glued to letters (`H100`, `v0.7.0`, `SO-101`,
  `p5.48xlarge`, `16B`), and numbers wrapped in `<Toy>` or `<Derived>`.

So: write a number the way the entry writes it ("5.77 million", not "5.8M"); cite in the same paragraph, row or
figure as the number; a table row cites in its own last cell (or pass `data-claim` on a wrapper). Wrap an invented
illustration in `<Toy>12.5</Toy>` and say in the prose that it is an illustration. Wrap arithmetic of ours that no
entry prints in `<Derived>4.5</Derived>` and show the arithmetic beside it. Use these two sparingly and honestly:
they are how the check knows a number is not a sourced claim. Figures declare their sources with the `cites` prop.

### No dollar figures

The owner's decision of 2026-11-20: this build ships **no dollar figures at all**, not prices, not cost estimates,
not "$ per task". Where a method needs a price, describe the method and leave the price to the placeholder in
section 23. Entries that carry a price may still be cited for their non-price content.

### Placeholders

Only sections 17, 18, 22, 23 and 24 may contain a placeholder, and only for: measurements the owner's profiling
project will bring (EC2 P, G and Graviton runs, GPU counters, real workloads), the measured hook-up of his own
Jetson and DGX Spark to AWS IoT, and prices. Use `<Placeholder what={...} source={...} />` from
`../components/Blocks`: one plain block saying which measurement or figure will land there and from which source.
Nowhere else: no "coming soon", no empty headings, no draft residue.

## 6. Prose rules the gates enforce

The `no-ai-tells` gate scans the **whole `.tsx` file** (comments, constants, strings) except text inside `<code>`
and `<pre>`: no em-dash (character or `&mdash;`), no en-dash, straight quotes only (use `&quot;` and `&apos;` in JSX
text; no curly characters, no `&ldquo;` `&rdquo;` `&lsquo;` `&rsquo;`), and none of: delve, tapestry, seamless,
robust, leverage, boasts, underscores, pivotal, harness, unlock, supercharge, realm, landscape, testament,
game-changer, cutting-edge, best-in-class (any inflection; write "test setup" for "test harness", "sturdy" or
"holds up" for "robust"). Also avoid: "it's worth noting", "in conclusion", "not just X, but Y", triads for
cadence, emoji. Write plain technical English as `docs/standards/plain-technical-english.md` sets out; the section 1 text in `revamp/style/section-1-reference.md` is the model.

Acronyms: at first use in your section give the full form and then say in plain words what the thing is or does
(for a technique: the challenge it meets and when it is used), even if an earlier section did; one clause is enough
when an earlier section owns it. Common computing acronyms (CPU, GPU, RAM, API, HTTP, SSD, VM) need no expansion.
Robotics, ML and AWS-niche ones always do: VLA, DoF, PD, PID, ACT, CVAE, DDIM, EMA, ViT, JEPA, MPC, CEM, PPO, RL,
HIL-SERL, GOP, CRF, AV1, NVENC, NVDEC, RT cores, USD, MJX, PMU, SMT, OTA, MQTT, TES, EFA, MIG, DCGM, and so on.

JSX: raw `<` and `>` in text fail lint; write `&lt;` `&gt;` or put the text in `<code>`. Every `<pre>` carries
`style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}` (or use `<Snippet>` from `../components/Blocks`, which
does it). Equations go in `<code>` as plain text, or as inline SVG; no LaTeX, no math dependency. Wide tables: wrap
a Cloudscape `Table` or an HTML table in `<div style={{ overflowX: 'auto' }}>` so the page never scrolls sideways
at 390 px.

Configuration snippets (section 24 above all, also 17, 18, 19): only where a first-party source gives one. Use
`<Snippet title mode="copied" | "adapted" source={<Cite id="...">...</Cite>}>{`...`}</Snippet>`. "copied" means
verbatim from the pinned source; "adapted" means you changed names or sizes and say what. Never invent a field.

## 7. Diagrams and animation

Read `revamp/diagram-plan.md` section 1 (the contract) and your section's rows. In short:

- Rendered graphics only. Inline SVG written in your section file as module-private functions above the export.
  Charts are inline SVG too, using `src/lib/scale.ts` (`linear`, `log10Scale`, `decades`, `ticks`, `fmt`). No new
  dependency. No ASCII art, no box-drawing characters.
- SVG contract (the `svg-a11y` gate reads the source text, so these must be literal strings on the `<svg>` tag):
  `viewBox`, `role="img"`, `aria-labelledby="<slug>-title"` matching a `<title id="<slug>-title">` inside, optional
  `<desc>`, `style={{ width: '100%', height: 'auto' }}`. Slugs are unique across the app: prefix with your section
  id (`jepa-train-title`). Paint a light background rect first (`#fbfbfd` or white) so text never relies on the
  page colour. `fontFamily="sans-serif"` explicit, font size at least 12 in viewBox units.
- **Phone legibility is checked**: any line of SVG text painted under 8.5 px tall at a 390 px viewport is a finding.
  Either draw in a narrow viewBox (about 360 to 420 units wide with 12 to 14 unit text), or wrap in
  `<Figure minWidth={640} ...>` so the figure scrolls sideways inside its own box on a phone. Prefer stacking
  vertically over shrinking.
- Wrap every diagram in `<Figure cites="F03-25 F03-74" caption={...}>` (from `../components/Figure`). The caption
  is one or two sentences saying how to read it. Every number drawn in a figure comes from the entries in `cites`.
  A schematic with invented shapes says "Illustrative, not measured" in the caption. Every chart has labelled axes
  with units.
- Animation, only where your diagram-plan row says so: use `<AnimatedFigure name steps={[...captions]} cites
  caption>{(step, reduced) => <svg ...>}</AnimatedFigure>`. It supplies Play, Pause, Back, Step and Reset buttons
  (keyboard reachable), a text caption per step, starts paused, plays once and stops, and under
  `prefers-reduced-motion` shows the final step with no timed playback. You draw the SVG for a given `step`; for
  smooth movement use CSS transitions on `transform` or `opacity` in inline styles and switch them off when
  `reduced` is true (`transition: reduced ? 'none' : 'transform 600ms ease'`). No `requestAnimationFrame` loops, no
  animation that starts by itself, no SMIL `<animate>`. Every step must be legible as a still frame, and the last
  step must make sense on its own (it is what a reduced-motion reader sees first). Hidden elements use
  `opacity: 0`, which the overlap probe ignores.
- No overlapping text or shapes, nothing clipped by the viewBox, at 1440 and 390 px, in every step.

**Verify the rendered output.** Build into a private directory and run the check tool (use the port and slug
from your task):

```bash
cd <repo root>/deep-dives/physical-ai
npx vite build --outDir /tmp/pai-dist-<slug> --emptyOutDir
node revamp/tools/check-section.mjs --dist /tmp/pai-dist-<slug> --port <port> \
     --out /tmp/pai-shots-<slug> --sections <section-id>
```

It prints diagram findings (overlap, box-overflow, clip, tiny-text), page overflow, console errors, unresolved
citations and number findings, and writes a full-page PNG at each width, one PNG per diagram and one per animation
step. **Read the PNGs** of every diagram and every animation step with the Read tool, at both widths. Fix and
re-run until the tool prints no finding for your section and the pictures look right. A number finding is fixed by
citing the right entry in that block, by writing the number as the entry does, or (only when honest) by `<Toy>` or
`<Derived>`; never by deleting a true citation or rewording to dodge the check.

## 8. Cross-references

- Other sections of this dive: plain text, "section 7, JEPA: Predicting in Latent Space" (titles in
  `revamp/tools/sections.json`). No anchors. A few targeted pointers, not one per mention.
- Sibling dives, at most two links per section, each where it helps:
  `../rl-agentic-loops/` (Learning From Feedback: RL basics, policy gradient, PPO, GRPO, reward design, agentic
  loops in text), `../llm-training-systems/` (Training at Scale: distributed training, data loading,
  checkpointing), `../silicon-memory-inference/` (Silicon, Memory & Inference: how a GPU and the memory hierarchy
  execute a model), `../efa/` (EFA: the network fabric for multi-node training), `../vllm/` and `../sglang/`
  (language-model serving). Link nothing else.

## 9. Save early, then self-check

Write a complete first draft of your file to disk as soon as you have one, then refine in place: the process can
stop at any moment.

Before reporting done, from the repo root:

```bash
pnpm --filter @tech-deep-dives/physical-ai typecheck
pnpm --filter @tech-deep-dives/physical-ai lint
bash scripts/gates/no-ai-tells.sh && bash scripts/gates/svg-a11y.sh && bash scripts/gates/pre-overflow.sh && bash scripts/gates/pinned-refs.sh
```

Errors in files other authors are editing at the same moment are not yours; errors in your file are.

Run the explaining-concepts check (its last section) over your text: list every term, acronym and symbol with where
it is explained; every formula has intuition before and decomposition after; toy numbers labelled; no citation
inside a definition; read once as the newcomer and once as an expert.

Write two files:
- `revamp/claims/<section-id>.md`: one line per factual claim in your section: `claim | register ID`.
- `revamp/glossary/<section-id>.json`: an array of `{ "term": "...", "expansion": "..." or null, "meaning": "one
  plain sentence" }` for every acronym and every robotics or physical-AI term your section introduces or relies on.

Return to the orchestrator only, in at most 200 words: what the reader now gets; the count of cited entries; the
diagrams (how many animated) and the check tool's last line for your section at 1440 and 390; any register entry you
could not use or think is wrong; the exact last lines of typecheck and lint.
