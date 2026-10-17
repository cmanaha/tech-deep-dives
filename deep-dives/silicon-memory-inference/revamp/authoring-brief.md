# Authoring brief: October 2026 revamp of Silicon, Memory, and Modern Inference

Every section-authoring agent reads this file first. The orchestrator's prompt
names the section file you own, the research register to apply, and any
section-specific instructions. Nobody will answer questions; decide using this
brief and the standards it names.

Worktree root (use absolute paths, stay inside it):
`/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/silicon`
Dive root: `deep-dives/silicon-memory-inference` (below, paths are relative to it).

## What you own

- `src/sections/<Section>.tsx`, the section file named in your prompt.
- The diagram components that section imports from `src/components/` (listed in
  your prompt). Nobody else edits them during your run.
- `src/sources/<Section>.ts`, which you create. It holds every source your
  section and its components cite.
- `revamp/authoring/<Section>.md`, your change report.

Edit nothing else. `App.tsx`, `GlossaryAndSources.tsx`, `src/components/Cite.tsx`,
`src/sources/index.ts`, `sources.md`, `README.md` and `.gates.json` belong to
the orchestrator. If one of them needs a change, say so in your change report.
Other agents are editing other section files at the same time: if a build or
typecheck fails on a file you do not own, wait a minute and retry, and never
"fix" their file. Do not commit. Never start a background Bash command.

## Read first

1. `CLAUDE.md` at the worktree root: Writing Style (No AI Tells), Diagram
   Standards, Acronym Standard, Section Shape.
2. `deep-dives/efa/revamp/section-shape-standard.md`: the governing test. A block
   earns its place only if it builds a mental model or is practical to know.
3. `deep-dives/efa/revamp/source-authority-standard.md`: code is the authority,
   then official docs, then everything else.
4. `deep-dives/efa/revamp/leverage-pass-standard.md`: the last editorial pass.
   It may delete, reorder, demote and re-express. It may not assert.
5. `deep-dives/efa/revamp/diagram-plan.md` section 1 (lines 15 to 200): the
   inline SVG authoring contract.
6. Your research register (named in your prompt) and the section of it for
   your file. It holds a claim register with a verdict per claim and a list of
   recommended edits.
7. `src/components/Cite.tsx`: the citation component and its kinds.

## The job, in order

### 1. Apply the register

Apply every STALE, WRONG and NEW verdict for your section, and every
recommended edit, in place. Keep CORRECT claims and re-cite them. Remove CUT
candidates unless removing one would break the section's argument; say which
you kept and why in the change report.

Update in place so the page reads as current to a reader meeting it for the
first time. No changelog voice anywhere in reader text: no "Correction:", no
"previously", no "now", used to mean "since the last revision", no "as of the
last revision", no "updated", no "what changed" boxes. The corrected fact
stays, the story of the correction goes. A version number is fine when it is
the fact the reader needs ("available from CUTLASS 4.2").

### 2. Cite every quantitative claim

Every number, date, version, bandwidth, capacity, price or instance fact carries
an inline citation:

```tsx
import { Cite } from '../components/Cite';
import { S } from '../sources/HbmAndBandwidthWall';

<Box variant="p">
  H200 carries 141 GB of HBM3e at 4.8 TB/s.<Cite s={S.h200Page} />
</Box>
```

`Cite` renders its own leading space. In a table cell:
`cell: (r) => <>{r.bandwidth}<Cite s={r.source} /></>`.

`src/sources/<Section>.ts` looks like this. One record per URL, keyed by a
short camelCase name:

```ts
import type { Source } from '../components/Cite';

export const S = {
  h200Page: {
    title: 'NVIDIA H200 Tensor Core GPU',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/h200/',
    tier: 2,
    accessed: '2026-10-16',
  },
} satisfies Record<string, Source>;
```

Rules:
- Tier comes from the research register. Tier 1 is official docs, datasheets,
  specifications, filings and source code pinned to a commit or tag. Tier 2 is
  vendor press releases, blogs, product pages and keynotes. Tier 3 is
  third-party analysis, papers and trade press. Tier 0 is our own experiment.
  The same URL must carry the same tier in every file, so reuse the register's
  tier exactly, with one exception: academic papers (arXiv, ACM, IEEE,
  USENIX, conference proceedings) are Tier 3 under CLAUDE.md even when a
  register graded them Tier 1 as the primary source for their own method.
  Mark their results `measured` or `simulated` so the reader still sees what
  kind of evidence it is.
- `accessed` is `2026-10-16` for anything taken from the register. If you fetch
  a source yourself, use the date you fetched it.
- `kind` marks what the figure is: `vendor-claim` for a vendor performance
  figure ("up to 4x"), `roadmap` for a product that is not shipping,
  `measured` for a measurement (the source named made it), `simulated` for a
  simulation or model result, `derived` for our
  own arithmetic on cited inputs. Default `spec`.
- A vendor performance claim never reads as a measurement. Keep the
  attribution in the sentence or mark it `vendor-claim`, and preferably both.
- Label every FLOPS figure dense or sparse, and every bandwidth figure per
  direction or bidirectional, whenever the source distinguishes them.
- GitHub and Hugging Face URLs are pinned to a commit SHA or a release tag,
  never `main` or `master`. A CI gate fails on branch links.
- A number you cannot source does not ship. Delete it, or state the silence
  with its scope ("NVIDIA publishes no per-die figure" only when the register
  shows that was checked). Preserve the scope of every hedge.
- Attribution belongs in the link, not the sentence ("AWS documents that..."
  goes), except in the four load-bearing cases the section-shape standard
  lists: the silence is the claim, two sources disagree, the verb carries
  strength ("AWS recommends"), or the source grade matters.
- Replace every plain `<Link>` used as a citation with `Cite`. Keep a `Link`
  only where the reader is being sent somewhere to do something (a repo to
  clone, a guide to follow), and give it a source record too if it backs a
  claim.

### 3. Strip AI tells (section file and its components)

The gate `scripts/gates/no-ai-tells.sh` fails on: the em-dash character and
`&mdash;`; an en-dash (or `&ndash;`) between digits; curly quotes and the
entities `&lsquo; &rsquo; &ldquo; &rdquo;`; and the words delve, tapestry,
seamless, robust, leverage (verb), boasts, underscores, pivotal, harness,
unlock, supercharge, realm, landscape, testament, game-changer, cutting-edge,
best-in-class. Use `&quot;` or `'` and `"` in JSX text. Replace each em-dash
with a comma, colon, parentheses or two sentences, whichever reads best. Also
remove the rhetorical tics CLAUDE.md lists ("it's worth noting", "not just X
but Y", cadence triads).

### 4. Shape the section

- Every h2 `description` states the payoff: the reader's moment or the result,
  not the topic.
- Introduce a thing before dissecting it. Define things by what they are.
- Frame subjects as challenges that can be met. No "The problem:" openers.
- Demote supporting evidence (version lists, long tables of provenance) into an
  `ExpandableSection`.
- Repeat the section's strongest number once.
- End on the reader's next action by ordering blocks, not by appending a
  summary. No key-takeaways boxes. No "Connecting threads" lists of forward
  references.
- Cross-references use the section's name, never its number, because numbers
  shift when sections are added. The current names are in the table at the end
  of this brief.
- Expand every acronym at its first occurrence in your section, unless it is a
  common computing acronym (CPU, GPU, RAM, API, HTTP).
- Hold length flat or bring it down, except where the register requires NEW
  content. Count visible words before and after (strip tags and code) and put
  both numbers in the change report. Growth above about 20% needs a reason per
  added block; prefer demoting detail into an `ExpandableSection` or cutting a
  CUT candidate over adding prose.

### 5. Diagrams

For each SVG component you own:
- `role="img"`, `aria-labelledby="<unique-id>-title"`, and a `<title id=...>`
  that states what the diagram asserts. Remove `aria-label`.
- `viewBox` only, `style={{ width: '100%', height: 'auto' }}`, a full-bleed light
  background rect so it reads in dark mode, fonts at least 10px, `sans-serif`.
- Every number drawn in the SVG is correct per the register and is cited in the
  caption or the surrounding text.
- No em-dashes or curly quotes in SVG text either.

React Flow diagrams (`@xyflow/react`) may stay React Flow; fix their labels and
numbers. Do not add new dependencies.

Verify on the rendered output, never on arithmetic. From the dive root:

```bash
pnpm exec vite build --outDir /tmp/silicon-dist-<section-id> --emptyOutDir
node scripts/shoot.mjs --sections <section-id> --widths 1440,390 \
  --out /tmp/silicon-shots-<section-id> --dist /tmp/silicon-dist-<section-id>
```

The probe prints any overlapping text, text running out of its box, text
clipped by the viewBox, and page-level horizontal overflow. Then Read the PNGs
it writes (full page and one per diagram, at both widths) and look for
collisions the probe cannot see (text crossing lines, labels on arrows,
cramped spacing, unreadable text at 390). Fix and re-shoot until clean. Report
what you saw.

### 6. Leverage pass

After the facts are settled, run the leverage pass on every substantial block:
what it means to the reader, what model it builds (and whether a diagram would
carry it better), and how the reader would use it (decide, configure, size,
choose, monitor). Then diff the claim set: list every assertion in the after
that is not in the before, each with the source it came from. An assertion
without a source comes out.

### 7. Check before you report

From the dive root:

```bash
pnpm exec tsc --noEmit 2>&1 | grep -E "<Section>|<YourComponent>|sources/<Section>" || echo "no type errors in my files"
pnpm exec eslint src/sections/<Section>.tsx src/sources/<Section>.ts src/components/<YourComponent>.tsx --max-warnings 0
pnpm exec vitest run src/__tests__/sections.test.tsx -t <Section>
cd ../.. && bash scripts/gates/no-ai-tells.sh 2>&1 | grep -E "<Section>|<YourComponent>" ; bash scripts/gates/svg-a11y.sh 2>&1 | grep -E "<YourComponent>|<Section>" ; bash scripts/gates/pinned-refs.sh 2>&1 | grep -E "<Section>"
```

The gates scan the whole dive and other files still fail them; only hits in
your files matter, and there must be none.

### 8. Change report

Write `revamp/authoring/<Section>.md`:
- Claims changed: before, after, source key, tier, kind.
- Claims removed and why (unsourceable, CUT candidate, failed the test).
- UNKNOWNs and how the page handles each.
- NEW content added and its sources.
- Diagram changes and what the rendered check showed at 1440 and 390.
- Leverage pass: the claim-set diff (each new assertion and its source).
- Anything the orchestrator must do in a shared file (glossary acronyms you
  introduced, a cross-link target).

Reply with at most 150 words: what the reader now gets, the count of claims
changed and removed, and anything left open.

## Section names for cross-references

| Nav id | Name to use in prose |
| --- | --- |
| thesis | Thesis and Framing |
| heterogeneity | The Heterogeneity Fact |
| roofline | Roofline and Arithmetic Intensity |
| memory-hierarchy | Memory Hierarchy Primer |
| kernel-lifecycle | Anatomy of a Kernel Execution |
| hbm | HBM and the Bandwidth Wall |
| main-memory-cxl | DDR5, MRDIMM, LPDDR5X and CXL |
| hbf | High Bandwidth Flash |
| flash-cache-tier | Flash as a Cache Tier for Inference |
| chiplet-interconnect | Chiplet and Interconnect |
| graviton | Graviton Deep Dive |
| epyc-turin | AMD EPYC Turin |
| xeon-6 | Intel Xeon 6 |
| hopper | NVIDIA Hopper |
| blackwell | NVIDIA Blackwell |
| grace-blackwell | Grace-Blackwell and UltraServer |
| edge-shared-memory | Edge Shared-Memory Silicon |
| nvidia-compilers | NVIDIA Compilers and Kernel Tooling |
| aws-custom | AWS Trainium, Inferentia and Neuron |
| aws-compilers | AWS Compilers and Kernel Tooling |
| cerebras | Cerebras Wafer-Scale |
| groq-sambanova | Groq, SambaNova and Dataflow |
| compute-in-memory | Compute-in-Memory |
| kv-cache | KV Cache and FlashAttention |
| moe | Mixture of Experts and Sparse Activation |
| slm | Small Language Models |
| quantization | Quantization and Precision |
| disaggregated | Disaggregated Serving and Speculative Decoding |
| communication | Communication and Scale-Out |
| isolation | Isolation: NIE and MIG |
| determinism | Determinism: NEFF and GPU Reproducibility |
| capital-markets | Capital Markets Lens |
| glossary-sources | Glossary and Sources |

The sibling dives are linked as `../vllm/` and `../efa/`. The vLLM dive's
section "KV Offloading and LMCache" (nav id `offload`; the shell has no hash routing, so link to `../vllm/` and name the section) owns the software internals of
KV offload; link to it rather than duplicating it.
