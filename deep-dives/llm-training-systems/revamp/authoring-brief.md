# Authoring brief: LLM training systems (shared by every authoring agent)

Research date and accessed date for every citation you add: **2026-10-31** (the `ACCESSED` default
of the `Cite` component). A register row you cite without re-opening its source keeps the register's
date: pass `accessed="2026-10-30"` explicitly in that case.

Repo root: `/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/training`. Dive:
`deep-dives/llm-training-systems/`. You own exactly one section file, named in your task (plus, only
where the task says so, one helper module and its test). Edit nothing else: not `App.tsx`, not the
glossary, not `sources.md`, not another section, not `SCOPE.md`, not the registers, not `src/lib/`
unless the task gives it to you. Run no git command that changes state; the orchestrator commits. Do
not start subagents (the job caps concurrent agents at three). Never touch the main checkout at
`/Users/carlos/workspace/git_repositories/tech-deep-dives` or any other worktree.

**Privacy: never put personal data (names, email addresses, account ids) in any request, header,
User-Agent, URL or query string.** If a site demands a contact address, use a Wayback copy or skip it.

## Inputs, in reading order

1. `CLAUDE.md` at the repo root: "Writing Style: No AI Tells", "Diagram Standards", "Section Shape",
   "Acronym Standard", "Fact-Checking & Sources Standard".
2. `deep-dives/efa/revamp/section-shape-standard.md` (the governing test) and
   `deep-dives/efa/revamp/leverage-pass-standard.md` (the four verbs; never assert; attribution in the
   link).
3. `deep-dives/efa/revamp/source-authority-standard.md` (code is the authority; hedges keep scope).
4. `deep-dives/efa/revamp/diagram-plan.md`, section 1 only: the SVG contract.
5. `deep-dives/llm-training-systems/SCOPE.md`: read the Thesis, the "How to read the evidence markers"
   paragraph, section 2's block (the reader and the four routes), YOUR section's block, the
   "Calculators and interactive elements" block if your section hosts one, and the "Connections to
   existing deep dives" block. Find your block with `grep -n '^\*\*<n>\. ' SCOPE.md`. The block is the
   contract: build what it promises, in its order, and nothing it does not promise.
6. The wave 2 verdict files `research/2026-10/wave2-*.md`. A verdict there (SCOPE NARROWER, WRONG, a
   closed UNKNOWN, a new finding) overrides the register row it names. SCOPE.md already carries most
   replacements; search the wave 2 files for every register ID your block cites anyway.
7. The register rows your block cites, in `research/2026-10/01-*.md` to `07-*.md` (and
   `00-orchestrator-notes.md` for T00-1). Each row has the pinned source and a verbatim quote. The
   quote is your evidence; re-open the source for anything the quote does not settle.
8. Tier 0 results, where your block or task names them: `research/2026-10/E1-spark-activation-memory.md`,
   `E2-spark-step-time-recompute.md`, `E3-spark-fsdp2-collectives.md`, `E4-spark-checkpoint-staging.md`,
   with raw JSON in `research/2026-10/spark-raw/`. Every Tier 0 number on the page must match those
   files, with the hardware and the caveats the file states (one GB10, unified memory, single run or
   two runs as stated).
9. `RESEARCH-GUIDE.md` section 6 (UNKNOWN register with its Gate 1 result): an UNKNOWN closed in
   wave 2 or by an experiment ships with its finding; accept-as-hedge ships with its hedge text;
   cut does not ship.
10. A finished sibling section for structure: `deep-dives/rl-agentic-loops/src/sections/RlStepAsSystem.tsx`
    (Container with an h1 Header and description, then h2 Containers, diagrams as module-private
    functions above the export, `ExpandableSection` for evidence).

## What the reader must get

- The reader is a technical lead who knows systems, networking, GPUs, inference engines and agents
  in practice, knows NCCL and EFA by name, and has not run large-scale distributed training (scope
  section 2). Define every training term at first use in your section, even if an earlier section
  defined it: one clause is enough ("the bubble, the idle time at the start and end of a pipelined
  step"). R1's gloss table (`reviews/2026-10/R1-newcomer.md`, finding 11) lists the glosses the
  shorter reading routes need.
- The page reads as current for a reader meeting it for the first time. No changelog voice: no
  "Correction:", no "previously", no "an earlier version", no "what changed" boxes, no "wave 2".
- The h1 Header text is the section's navigation title exactly, starting with its number (see the
  titles list below). The screenshot harness waits for it.
- The h1 Header description states the payoff and ends with the provenance "(sources read
  2026-10-31)". If the section cites framework code, name the pinned versions instead, for example
  "(PyTorch v2.15.0 and TorchTitan v0.4.0, read 2026-10-31)"; if it shows Tier 0 results, say so
  ("and our DGX Spark runs").
- Every h2 Header description states the payoff (the reader's moment or result), not the topic.
- Open with two or three sentences on what the thing is and why it matters, before the mechanism.
  Frame it as a challenge to meet, never "The problem:".
- Define things by what they are. No "not X, but Y" flourishes.
- Land the section's strongest number at least twice (the scope block often names it). End on the
  reader's next action, reached by ordering blocks so the payoff lands last. No key-takeaways boxes,
  no summary box.
- Demote supporting evidence, long derivations, catalogues and disputes into `ExpandableSection`.
- Every worked number shows its inputs and assumptions next to it (MFU 40% assumption, sequence
  length, micro-batch, precision, gradient dtype, attention kernel), as RESEARCH-GUIDE section 4
  requires.
- Section length: aim for 1,200 to 2,500 words of reader text (sections 1, 2 and 28 may be shorter;
  14 may be longer). Reframe rather than pad.
- Links to other sections of this dive are plain text ("section 8, Data Parallelism & Sharding"): the
  app has no in-page anchors. Links to sibling dives are plain navigational `Link`s, never `Cite`:
  `<Link href="../efa/">EFA dive, section N: Title</Link>`. Published sibling dives: `../efa/`,
  `../silicon-memory-inference/`, `../vllm/`, `../sglang/`, `../rl-agentic-loops/`; link nothing
  else. Read the exact section number and title from the sibling's `src/App.tsx` `sections` array
  before you write the link. Do not re-explain what a sibling dive covers.

### Section titles (for cross-references)

1 A Training Run Is Three Budgets; 2 Getting Started; 3 One Training Step: What It Computes and Keeps;
4 Counting the Arithmetic: 6ND, MFU & Run Time; 5 The Memory Budget; 6 Precision for Training: BF16,
FP8 & Microscaled Formats; 7 Collectives & What They Cost; 8 Data Parallelism & Sharding: DDP, ZeRO,
FSDP & HSDP; 9 Tensor & Sequence Parallelism; 10 Pipeline Parallelism & the Bubble; 11 Long
Sequences: Context Parallelism; 12 Mixture of Experts: Expert Parallelism; 13 Composing the
Dimensions; 14 Set My Ranks: The Sizing Procedure; 15 The Framework Map; 16 Fine-Tuning &
Post-Training Runs; 17 Failure Is the Steady State; 18 Checkpointing; 19 Resuming Correctly; 20 Who
Owns What on AWS; 21 Training Hardware on AWS; 22 Capacity & Cost; 23 Storage for Training; 24 The
Slurm Family; 25 The Kubernetes Family; 26 SageMaker Training Jobs; 27 Trainium: The Neuron Path; 28
Choosing Your Path; 29 What to Measure in a Run; 30 The Telemetry Stack on AWS; 31 Bring-Up: From One
Node to the Full Run; 32 Glossary & Sources.

## Evidence markers: how the scope's labels render on the page

| Scope label | On the page |
| --- | --- |
| `(T02-47)` register ID, `W2-44` wave 2 row | A `Cite` to the pinned source the row names. Never print a register or row ID. |
| `[derived]` | Plain words: "our arithmetic from the paper's figures", with the arithmetic in an `ExpandableSection` or the sentence. |
| `[our reading]` | Plain words: "our reading of these sources" or "our reading of the code", never brackets. |
| `[vendor claim]` | Attribute in the sentence ("AWS states ...", "NVIDIA lists ...") and pass `kind="vendor-claim"`. Spec-sheet peaks are "vendor specification". |
| E1 to E4 | A `Cite tier={0}` to the experiment file, with the hardware in the sentence ("on one GB10"). |
| AWS experiments A0 to A5 | Where your block depends on one, keep the hedge and ship the experiment as an `ExpandableSection` titled "<id> protocol (not yet run)": what it would measure, on what, the prediction, and the cost from RESEARCH-GUIDE section 5. Never present a protocol's prediction as a result. |
| Hedges | Keep their scope word for word in meaning: "not located in this research" never becomes "does not exist"; "in their runs" stays. |

## Citations: use the dive's `Cite` component

`import { Cite, arxiv, gh, ghTree, researchUrl, E1_URL, PYTORCH_TAG, ... } from '../components/Cite';`
(see the file for the full list of pinned tags and helpers). It renders a tier badge, an optional
kind or venue badge, the external link and "(accessed DATE)".

```tsx
<Cite tier={3} href={arxiv('2407.21783v3')} venue="preprint">Llama 3 Herd of Models, Section 3.3</Cite>
<Cite tier={1} href={gh('pytorch/pytorch', PYTORCH_TAG, 'torch/distributed/checkpoint/state_dict_saver.py', 'L300-L321')} kind="code">PyTorch state_dict_saver.py L300-L321</Cite>
<Cite tier={1} href="https://docs.aws.amazon.com/...">EC2 Capacity Blocks user guide</Cite>
<Cite tier={1} href="https://www.nvidia.com/en-us/data-center/h100/" kind="vendor-claim">NVIDIA H100 specification</Cite>
<Cite tier={0} href={E1_URL}>E1: activation memory per layer on one GB10</Cite>
```

- Tiers: 0 = our experiments; 1 = code at a pinned tag or SHA, official framework docs, first-party
  AWS and NVIDIA docs, spec sheets and price files (a spec sheet's peak is a vendor specification);
  2 = first-party lab or vendor posts and talks (their performance numbers stay claims); 3 = papers
  (pass `venue` = the confirmed venue, or `"preprint"`) and third-party technical analysis (the
  Ultra-Scale Playbook is Tier 3). Tier 4 sources are never cited.
- Every quantitative claim, default, flag behaviour and version-specific fact carries a `Cite` built
  from its register row (or wave 2 row). If a number has no row and you cannot verify it at a fetched
  pinned source, it does not ship.
- arXiv links always carry the version (`arxiv('2104.04473v5')`); the sources generator fails on an
  unversioned arXiv URL. GitHub links always go through `gh()` / `ghTree()` with a tag or 40-character
  SHA; never `/blob/main/`, `/tree/main/`, `/blob/master/`.
- `kind="code"` marks a fact read from source that no doc states; `kind="doc-code-conflict"` marks the
  docs side of a conflict (cite the code side next to it); `kind="vendor-claim"` marks a vendor
  performance figure or spec-sheet peak.
- Prices: state region, date and that a Capacity Block's binding price is the one quoted at purchase.

## Prose rules the gate enforces (`scripts/gates/no-ai-tells.sh`)

The gate scans the **whole `.tsx` file**, including comments, constants and URLs, except text inside
`<code>` and `<pre>`. So: no em-dash (character or `&mdash;`), no en-dash ranges, straight quotes only
(no curly characters, no `&ldquo;` `&rdquo;` `&lsquo;` `&rsquo;`; use `&quot;` and `&apos;` in JSX
text), and none of: delve, tapestry, seamless, robust, leverage, boasts, underscores, pivotal,
harness, unlock, supercharge, realm, landscape, testament, game-changer, cutting-edge,
best-in-class (any inflection). Write "test suite" for "test harness". If a URL you must cite contains
a banned word, do not cite it; report it to the orchestrator. Avoid the rhetorical tics in CLAUDE.md
and emoji.

Expand every niche acronym on first use in your file, for example "MFU (model FLOPs utilization)",
"FSDP (Fully Sharded Data Parallel)", "ZeRO (Zero Redundancy Optimizer)", "HSDP (hybrid sharded data
parallel)", "TP (tensor parallelism)", "PP (pipeline parallelism)", "CP (context parallelism)", "EP
(expert parallelism)", "DCP (PyTorch Distributed Checkpoint)", "ETTR (effective training time
ratio)", "MTTF (mean time to failure)", "DCGM (NVIDIA Data Center GPU Manager)", "PCS (AWS Parallel
Computing Service)", "NCCL (NVIDIA Collective Communications Library)", "EFA (Elastic Fabric
Adapter)". The scope's section 32 block lists every expansion; take them from there, never invent
one. Common computing acronyms (CPU, GPU, API, HTTP, LLM) need no expansion; the AWS service names
EC2, EKS, S3 and FSx expand at first use. Report every acronym you used so the glossary lists it.

JSX: raw `<` and `>` in text fail lint; write `&lt;` `&gt;` or wrap in `<code>`. Every `<pre>` carries
`style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}` (gate `pre-overflow`). Equations: write
them in plain text inside `<code>` (for example `<code>time = 6ND / (accelerators x peak x MFU)</code>`)
or as an inline SVG; no LaTeX and no new math dependency. Tables: Cloudscape `Table` or a plain
`<table>` inside `<div style={{ overflowX: 'auto' }}>` so a phone scrolls the table, not the page.

## Diagrams

- Contract: `viewBox`, `style={{ width: '100%', height: 'auto' }}`, `role="img"`,
  `aria-labelledby="<slug>-title"` naming exactly ONE id that matches a `<title id="<slug>-title">`
  inside that svg. Optional `<desc id="<slug>-desc">` with `aria-describedby`. Prefix every class name
  and marker id with the diagram slug. Paint a light background rect first so text never relies on the
  page colour (dark mode). Fonts at least 10px, `sans-serif` explicit. No ASCII art. Ids must be unique
  across the app: prefix slugs with your section id (for example `memory-stack-title`).
- Every number inside a diagram matches a cited claim in the prose. Schematic diagrams carry an
  "Illustrative, not measured" caption in a `Box variant="small"` below the SVG.
- Phone legibility: a 900-unit viewBox scales by about 0.37 at a 390px viewport. If the smallest label
  would paint under 8px there, wrap the SVG in `<div style={{ overflowX: 'auto' }}>` and give it
  `style={{ width: '100%', minWidth: 640, height: 'auto' }}`, or split it.
- **Verify the rendered output** of every diagram you add. Build into a private directory and run the
  harness with the port and slug from your task, so parallel agents do not collide (never run
  `pnpm build`, it writes the shared `dist/`):

  ```bash
  cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/training/deep-dives/llm-training-systems
  npx vite build --outDir /tmp/lts-dist-<slug> --emptyOutDir
  node revamp/tools/shoot.mjs --dist /tmp/lts-dist-<slug> --port <port> \
       --out /tmp/lts-shots-<slug> --sections <section-id>
  ```

  It prints text overlaps, clipping in viewBox units, and any table or diagram wider than its
  container, and writes full-page PNGs at 1440 and 390 plus one PNG per diagram. Read the PNGs of
  every diagram you touched with the Read tool. Fix every collision, clip, overflow or illegible label
  and re-run until the report is clean and the PNGs look right.

## Calculators (sections 4, 5, 14, 18 and 22 only)

The formulas live in `src/lib/` (`runtime.ts`, `memory.ts`, `parallelism.ts`, `checkpoint.ts`,
`presets.ts`), already written and tested (`revamp/calculators-spec.md`). Import them; never
re-implement a formula in a section file. Build the UI with Cloudscape form controls (`Select`,
`Input`, `Slider` or `Input type="number"`, `Toggle`, `ColumnLayout`, `KeyValuePairs` or `Table`):
inputs with sensible defaults from the presets, outputs that update live, the formula shown in
`<code>`, each input's source as a `Cite`, and the label "estimate; confirm with a measured step"
wherever an input is an assumption. If a function you need is missing, report it; do not edit
`src/lib/`.

## Checks before you report done

```bash
cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/training
pnpm --filter @tech-deep-dives/llm-training-systems typecheck
pnpm --filter @tech-deep-dives/llm-training-systems lint
F=deep-dives/llm-training-systems/src/sections/<YourFile>.tsx
grep -nE '/(blob|tree)/(main|master)/' $F                              # must print nothing
grep -nE 'arxiv\.org/(abs|html|pdf)/[0-9]{4}\.[0-9]{4,5}([^v0-9]|$)' $F # must print nothing
grep -nE '—|&mdash;|&ndash;|&ldquo;|&rdquo;|&lsquo;|&rsquo;|[‘’“”]' $F    # must print nothing
grep -noiE '(^|[^[:alnum:]_-])(delve|tapestry|seamless|robust|leverag|boast|underscore|pivotal|harness|unlock|supercharg|realm|landscape|testament|game-chang|cutting-edge|best-in-class)' $F  # must print nothing
bash scripts/gates/no-ai-tells.sh && bash scripts/gates/svg-a11y.sh && bash scripts/gates/pre-overflow.sh
```

Typecheck and lint may report errors in files other agents are editing at the same moment. Only errors
in your file are yours to fix.

## Save early

Sessions can stop without warning (usage limits). Write a first complete draft of your file to disk as
soon as you have one, then refine it in place, so a stop loses as little as possible.

## Self-check and report

Diff the claim set: list every assertion in your text with the register row, wave 2 row, experiment
file or file:line it came from. Anything without a source comes out. Write that list to
`deep-dives/llm-training-systems/revamp/claims/<section-id>.md` (you own that file too): one line per
claim, `claim | source URL | register, wave 2 row or experiment`. The fact checkers start from it.

Return to the orchestrator only (at most 200 words): what the reader now gets from the section, the
number of cited claims, diagrams added and the harness result (overlap, clip and overflow counts at
1440 and 390), the acronyms you expanded, any register item you could not resolve, and the exact
result lines of typecheck and lint.
