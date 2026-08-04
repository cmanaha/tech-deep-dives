# AGENTS.md — Tech Deep Dives

Cross-tool agent onboarding document. Any MCP-compatible tool (Claude Code, Cursor, Kiro, etc.) should read this before working in this repo.

## What This Repo Is

A monorepo of interactive technical deep dives. Each deep dive is a standalone Cloudscape-powered React single-page app covering one AWS technology in depth — architecture, trade-offs, pricing, decision guidance.

## Monorepo Structure

```
tech-deep-dives/
├── shared/                    # @tech-deep-dives/shared — reusable components
│   └── src/
│       ├── components/        # DeepDiveLayout, DiagramViewer, PricingTable, etc.
│       ├── hooks/             # Shared React hooks
│       ├── layouts/           # App shell, navigation, theming
│       └── utils/             # Shared utilities
├── deep-dives/                # One directory per topic
│   ├── efa/                   # Elastic Fabric Adapter deep dive
│   │   ├── src/               # React app source
│   │   ├── research/          # Raw research notes with source citations
│   │   ├── iac/               # CloudFormation/CDK for experiments
│   │   ├── docs/adr/          # Architecture Decision Records
│   │   └── sources.md         # All authoritative sources used
│   └── _template/             # Scaffold for new deep dives
├── .github/workflows/ci.yml   # CI: lint, typecheck, test, build
├── package.json               # Root — workspace scripts
├── pnpm-workspace.yaml        # Workspace config
├── CLAUDE.md                  # Claude-specific instructions
└── AGENTS.md                  # This file
```

## Tech Stack

- **Runtime:** React 18 + TypeScript (strict mode)
- **UI:** Cloudscape Design System (AWS design tokens, dark mode, accessible)
- **Diagrams:** Rendered graphics only — never ASCII art. Inline SVG (default), React Flow for node/edge graphs, D3 for data viz, Cloudscape for simple panels. See **Diagram Standards** below.
- **Build:** Vite 6 with `@vitejs/plugin-react`
- **Package Manager:** pnpm 9 with workspaces
- **Lint:** ESLint 9 + typescript-eslint
- **Test:** Vitest + @testing-library/react
- **CI:** GitHub Actions — lint, typecheck, test, build

## Build Commands

```bash
# Install all dependencies
pnpm install

# Build all deep dives
pnpm build

# Dev server for a specific deep dive
pnpm --filter @tech-deep-dives/efa dev

# Lint all packages
pnpm lint

# Typecheck all packages
pnpm typecheck

# Run tests
pnpm test

# Target a specific deep dive
pnpm --filter @tech-deep-dives/efa build
pnpm --filter @tech-deep-dives/efa typecheck
pnpm --filter @tech-deep-dives/efa test
```

## How to Add a New Deep Dive

1. Copy `deep-dives/_template/` to `deep-dives/{topic}/`.
2. Update `package.json`: change `@tech-deep-dives/TOPIC` to `@tech-deep-dives/{topic}`.
3. Update `index.html`: set the title and meta description.
4. Build sections in `src/sections/` — one component per major topic area.
5. Wire sections into `src/App.tsx` using the sections array and `DeepDiveLayout`.
6. Create `research/` for raw research notes with full source citations.
7. Create `sources.md` listing all authoritative sources with URLs and access dates.
8. Verify: `pnpm --filter @tech-deep-dives/{topic} build` passes.

## Shared Components Available

Import from `@tech-deep-dives/shared`:

- **`DeepDiveLayout`** — App shell with sidebar navigation, header, dark mode toggle. Pass `sections`, `activeSection`, `onSectionChange`, `title`, `subtitle`.
- Other components in `shared/src/components/` — check the source for the current inventory.

## Content Philosophy

- **Outcome-first:** Start with "what business problem does this solve?" then work backward to mechanism.
- **Authoritative sources only:** AWS docs, official repos, peer-reviewed papers. Blog posts for inspiration only, never as source of truth.
- **Every claim citable:** If it cannot be traced to a source, it does not go in the app.
- **Visual-first:** Prefer diagrams, animations, and interactive elements over walls of text.
- **Comparative:** Always show alternatives and trade-offs, not just the happy path.
- **Right complexity level:** Technical lead audience — skip basics, focus on architecture decisions, trade-offs, pricing implications, and when-to-use guidance.
- **Fact-checking & sources:** Every quantitative claim (bandwidth numbers, latency figures, percentages, pricing) must have an inline citation linking to the Sources appendix. Every deep dive app includes a Sources appendix section as the last navigation item. Sources are graded by authority: Tier 1 (official AWS docs, API reference, source code), Tier 2 (AWS blog posts, re:Invent talks), Tier 3 (third-party technical analysis, academic papers), Tier 4 (blog posts, tutorials — inspiration only, never cited as fact). Numbers without citations are unverified claims — flag them visually.

## Section Shape: Mental Model Or Practical Value

The governing test for every deep dive. Any tool authoring or editing a section
follows this. Full standard, with worked examples, in
`deep-dives/efa/revamp/section-shape-standard.md`.

**Content earns its place when it does at least one of two things.**

1. **It builds a mental model.** It gives the reader a way to think about how
   something works, and to predict what a system they have never touched will
   do. Theory is welcome here. "SRD keeps reliability and gives up ordering, and
   everything else follows from that trade" is a mental model.
2. **It is practical to know.** It changes what the reader types, chooses,
   budgets or checks. A default that differs from its documentation. An
   environment variable that quietly does nothing on current versions.

Content doing neither comes out, however hard it was to establish. The question
is never how much work a fact cost us; it is whether it gives the reader a way
to think, or something to do. When a section is hard to shape, the usual cause
is material that passes neither test.

**Writing rules that follow from it:**

- **Write for a technical reader meeting the page for the first time.** No page
  history, no "Correction:", no "an earlier version said". The corrected fact
  stays, the story of the correction goes.
- **Define things by what they are.** "This is B, C and D, because X" carries
  meaning; "this is not A" carries almost none and is a clear AI tell. The same
  test applies inside a sentence: "Why more nodes make the fabric better, not
  worse" says everything in "Why more nodes make the fabric better".
- **Frame the subject as a challenge rather than a problem.** A challenge can be
  met. Opening with "The problem:" sets a negative tone before the first fact.
- **Introduce a thing before dissecting it.** Two or three sentences on what it
  is and why it matters, before the mechanism.
- **Frame guidance as how to get it right.** Name a pitfall attached to the
  correct approach it protects, rather than organising a section around what
  breaks.
- **Cite evidence for authority or for conflict**, and say where it comes from.
  Citations on undisputed claims add weight without adding trust.
- **Every h2 description states the payoff**, naming the reader's moment or the
  result rather than restating the topic.
- **Repeat the section's strongest number.** One figure, landed more than once.
- **Demote supporting evidence into an `ExpandableSection`** so the argument
  reads clean and the curious reader can open it.
- **End on the reader's next action**, reached by ordering blocks so the payoff
  lands last rather than by appending a summary.
- **No key-takeaways boxes.** A summary box lets the body stay unfocused.
- **Preserve the scope of every hedge.** "No AWS benchmark was located during
  this research" is honest; "no AWS benchmark exists" is a claim about the world
  that the research cannot support.

## Acronym Standard
- First occurrence of every acronym in the sequential reading order must expand to its full form: "EFA (Elastic Fabric Adapter)"
- After first expansion, the acronym alone is fine
- Every deep dive includes a Glossary in the Sources appendix section listing all acronyms used
- Niche/domain-specific acronyms always expand: SRD, NCCL, RDMA, MPI, NAPI, DIM, GRO, LRO, QP, CQ, AH, MR, PD, UARN, WQE, etc.
- Common computing acronyms (CPU, GPU, RAM, API, HTTP) do not need expansion

## Diagram Standards

- **No ASCII art — ever.** Diagrams must be rendered graphics, never ASCII / Unicode box-drawing (┌─┐ │ └─┘ ► ▼ →) inside `<pre>` or `<code>`. ASCII diagrams break word-wrap on mobile, fail accessibility, and read as unfinished. `<pre>` / `<code>` is for real code or config snippets only.
- **Pick the rendering tool that fits the diagram** (author's judgment — no single mandated tool):
  - **Inline SVG** — a small local React component: `<svg viewBox="..." role="img">` with a `<title>` (and `<desc>` where useful), `width: 100%`, `height: auto`. The default for one-off structural diagrams — timelines, hierarchies, decision trees, sequence/flow, box-and-arrow. Most flexible; used throughout `silicon-memory-inference`.
  - **React Flow (`@xyflow/react`)** — node-and-edge architecture/flow graphs, especially interactive ones (pan/zoom, auto-layout). Used in `efa`. Reach for it when there are many nodes/edges or interactivity helps.
  - **D3 + SVG** — data-driven charts (rooflines, distributions, scaled axes).
  - **Cloudscape primitives** (`ColumnLayout` / `Container` / `Box`) — simple labeled panels that are really structured layouts, not graphs.
  - Don't add a new heavy dependency when inline SVG, React Flow, or Cloudscape already cover the need.
- **No overlapping text or components.** After authoring any diagram, verify there are NO collisions: text overflowing its shape, labels overlapping each other or connector lines, edges crossing through labels, or content clipped by the `viewBox`. Overlap is acceptable only when clearly intentional (e.g. deliberately layered/stacked depth). Practical rules: size every box to its longest label, pad text generously, keep a minimum gap between nodes, and confirm against the *rendered* output (Playwright DOM/visual audit) instead of trusting hand-computed coordinates.
- **Accessible & responsive:** every diagram scales to its container width, stays legible on a phone, and (for SVG) carries `role="img"` plus a `<title>`.

## Writing Style: No AI Tells

Reader-facing prose must read like a careful human wrote it, not like an LLM. These are banned in any section content:

- **No em-dashes.** Never use the em-dash character or the `&mdash;` entity in prose. The em-dash is the clearest LLM tell. Use a comma, a colon, parentheses, or two sentences. A plain hyphen in a compound word (multi-node, OS-bypass) is fine.
- **No en-dash in ranges.** Write "5 to 6" or "5-6" with a plain hyphen, not the en-dash form.
- **Straight quotes only.** Use ' and " in reader text, not curly/smart quotes.
- **No LLM vocabulary:** delve, tapestry, seamless, robust, leverage (as a verb), boasts, underscores, pivotal, harness, unlock, supercharge, realm, landscape, testament, game-changer, cutting-edge, best-in-class. Say the plain thing.
- **No rhetorical tics:** "it's worth noting", "in conclusion", "needless to say", the "not just X, but Y" flourish, the three-item triad used only for cadence, or emoji.
- Write declaratively: short, concrete sentences over hedged or flowery ones.

Exempt: code, config, and real CLI output are left verbatim. This applies to every deep dive, and every section gets a final pass to strip these tells before it ships.

## Settled Decisions (Do Not Re-Debate)

- **ADR-001:** Cloudscape + Vite + React + pnpm monorepo. See `deep-dives/efa/docs/adr/ADR-001-tech-stack.md`. The MDX/static site alternative was evaluated and rejected.
- **No co-author tags** in commits.
- **IaC for all cloud resources.** Every experiment has teardown built in.
