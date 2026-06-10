# CLAUDE.md — Tech Deep Dives

## Project Purpose
Interactive web-based technical deep-dives for a WW SA Lead (ex-EC2/Compute Tech Lead). Each deep dive produces a Cloudscape-powered single-page app optimized for mobile and desktop consumption.

## Monorepo Structure
```
tech-deep-dives/
├── shared/              # Shared Cloudscape components, hooks, layouts
│   ├── src/components/  # Reusable deep-dive components (DiagramViewer, PricingTable, etc.)
│   ├── src/hooks/       # Shared React hooks
│   ├── src/utils/       # Shared utilities
│   └── src/layouts/     # App shell, navigation, theming
├── deep-dives/          # One directory per deep dive
│   └── {topic}/         # Each is a standalone Vite+React+Cloudscape app
├── .claude/             # Claude agents and skills for this project
└── .github/workflows/   # CI/CD
```

## Deep Dive Standards
Each deep dive directory contains:
- `README.md` — Topic summary, key takeaways, sources
- `sources.md` — All authoritative sources with URLs and access dates
- `src/` — Vite + React + TypeScript + Cloudscape app
- `research/` — Raw research notes, experiment logs
- `iac/` — IaC templates (CDK/CloudFormation) for any cloud experiments

## Fact-Checking & Sources Standard
- Every quantitative claim (bandwidth numbers, latency figures, percentages, pricing) must have an inline citation linking to the Sources appendix
- Every deep dive app includes a Sources appendix section as the last navigation item
- Sources are graded by authority: Tier 1 (official AWS docs, API reference, source code), Tier 2 (AWS blog posts, re:Invent talks), Tier 3 (third-party technical analysis, academic papers), Tier 4 (blog posts, tutorials — inspiration only, never cited as fact)
- Numbers without citations are unverified claims — flag them visually

## Acronym Standard
- First occurrence of every acronym in the sequential reading order must expand to its full form: "EFA (Elastic Fabric Adapter)"
- After first expansion, the acronym alone is fine
- Every deep dive includes a Glossary in the Sources appendix section listing all acronyms used
- Niche/domain-specific acronyms always expand: SRD, NCCL, RDMA, MPI, NAPI, DIM, GRO, LRO, QP, CQ, AH, MR, PD, UARN, WQE, etc.
- Common computing acronyms (CPU, GPU, RAM, API, HTTP) do not need expansion

## Quality Rules
- **Authoritative sources only** — AWS docs, official repos, peer-reviewed papers. Blog posts for inspiration only, never as source of truth.
- **Every claim citable** — If it can't be traced to a source, it doesn't go in the app.
- **Experiment verification** — When we test something ourselves, log the experiment (inputs, outputs, configs) in `research/`.
- **IaC for all cloud resources** — Never leave resources running. Every experiment has teardown built in.
- **Freshness verification** — See ADR-002. Claims age; code and experiments don't. Tier 0 (our experiments) > Tier 1 (official docs/API/source code) > Tier 2 (AWS blogs/talks) > Tier 3 (third-party analysis/papers) > Tier 4 (tutorials — inspiration only).
- **No co-author tags** in commits.

## Tech Stack
- **Frontend**: Vite + React 18 + TypeScript + Cloudscape Design System
- **Diagrams**: Rendered graphics only — never ASCII art. Inline SVG (default), React Flow for node/edge graphs, D3 for data viz, Cloudscape for simple panels. See **Diagram Standards** below.
- **Build**: pnpm workspaces
- **CI**: GitHub Actions — lint, typecheck, build per deep-dive (owned by Carlos, decoupled from `scripts/ci.sh`)
- **Deploy**: Static — GitHub Pages or S3+CloudFront (TBD)

## Diagram Standards
- **No ASCII art — ever.** Diagrams must be rendered graphics, never ASCII / Unicode box-drawing (┌─┐ │ └─┘ ► ▼ →) inside `<pre>` or `<code>`. ASCII diagrams break word-wrap on mobile, fail accessibility, and read as unfinished. `<pre>` / `<code>` is for real code or config snippets only.
- **Pick the rendering tool that fits the diagram** (author's judgment — no single mandated tool):
  - **Inline SVG** — a small local React component: `<svg viewBox="..." role="img">` with a `<title>` (and `<desc>` where useful), `width: 100%`, `height: auto`. The default for one-off structural diagrams — timelines, hierarchies, decision trees, sequence/flow, box-and-arrow. Most flexible; used throughout `silicon-memory-inference`.
  - **React Flow (`@xyflow/react`)** — node-and-edge architecture/flow graphs, especially interactive ones (pan/zoom, auto-layout). Used in `efa`. Reach for it when there are many nodes/edges or interactivity helps.
  - **D3 + SVG** — data-driven charts (rooflines, distributions, scaled axes).
  - **Cloudscape primitives** (`ColumnLayout` / `Container` / `Box`) — simple labeled panels that are really structured layouts, not graphs.
  - Don't add a new heavy dependency when inline SVG, React Flow, or Cloudscape already cover the need.
- **No overlapping text or components.** After authoring any diagram, verify there are NO collisions: text overflowing its shape, labels overlapping each other or connector lines, edges crossing through labels, or content clipped by the `viewBox`. Overlap is acceptable only when clearly intentional (e.g. deliberately layered/stacked depth). Practical rules: size every box to its longest label, pad text generously, keep a minimum gap between nodes, and confirm against the *rendered* output (the Playwright DOM/visual audit — `gate-react-flow-invariants`, `gate-content-overflow`, `gate-no-hydration-warnings`) instead of trusting hand-computed coordinates.
- **Accessible & responsive:** every diagram scales to its container width, stays legible on a phone, and (for SVG) carries `role="img"` plus a `<title>`.

## Writing Style: No AI Tells
Reader-facing prose must read like a careful human wrote it, not like an LLM. These are banned in any section content:
- **No em-dashes.** Never use the em-dash character or the `&mdash;` entity in prose. The em-dash is the clearest LLM tell. Use a comma, a colon, parentheses, or two sentences instead. A plain hyphen in a compound word (multi-node, OS-bypass) is fine.
- **No en-dash in ranges.** Write "5 to 6" or "5-6" with a plain hyphen, not the en-dash form.
- **Straight quotes only.** Use ' and " in reader text, not curly/smart quotes.
- **No LLM vocabulary:** delve, tapestry, seamless, robust, leverage (as a verb), boasts, underscores, pivotal, harness, unlock, supercharge, realm, landscape, testament, game-changer, cutting-edge, best-in-class. Say the plain thing.
- **No rhetorical tics:** "it's worth noting", "in conclusion", "needless to say", the "not just X, but Y" flourish, the three-item triad used only for cadence, or emoji.
- Write declaratively: short, concrete sentences over hedged or flowery ones.
Exempt: code, config, and real CLI output are left verbatim. This applies to every deep dive, and every section gets a final pass to strip these tells before it ships.

## Two-Tier Quality Gates (ADR-004)
- **Tier 1 — `scripts/ci.sh` (alias `pnpm gates`)**: deterministic local-dev gates. No LLM, no agents. Runs typecheck → lint → unit tests → build → html-validate. Fast enough for the every-commit rhythm during a session. **Never coupled to .github/workflows/** — that workflow is owned and maintained separately by Carlos.
- **Tier 2 — `scripts/audit.sh` (alias `pnpm audit`)**: session runner. Two opt-in backends:
  - `--with-playwright` runs deterministic browser-DOM invariants (gate-routes, gate-deep-links, gate-no-hydration-warnings, gate-react-flow-invariants, gate-content-overflow, gate-responsive-collapse, gate-single-active-nav).
  - `--with-agents` runs LLM-driven advisory audits (render-auditor, diagram-auditor, route-auditor) that write structured markdown to `deep-dives/{topic}/audit-reports/` rather than streaming findings into orchestrator context.
- **Ratchet principle**: every time the agent layer finds a real bug, encode it as a Tier 1 deterministic gate. Agents stay as the frontier detector; deterministic gates are the ratchet that locks gains in.
- See `docs/adr/0004-agent-driven-quality-gates.md` for the full rationale.

## Content Philosophy
- **Outcome-first**: Start with "what business problem does this solve?" then work backward to mechanism.
- **Right complexity level**: Technical lead audience — skip basics, focus on architecture decisions, trade-offs, pricing implications, and when-to-use guidance.
- **Visual-first**: Prefer diagrams, animations, and interactive elements over walls of text.
- **Comparative**: Always show alternatives and trade-offs, not just the happy path.

## Iteration Flywheel (ADR-003)
Three explicit gates, budget controls throughout:

```
RESEARCH → DRAFT → DEEP RESEARCH → INTEGRATE
  → [GATE 1: SCOPE/BUDGET] → BUILD → DEPLOY PREVIEW
  → HUMAN REVIEW → [GATE 2: HUMAN APPROVAL]
  → AUDIT → FIX → RE-AUDIT → [GATE 3: QUALITY] → CLOSE
```

- **Gate 1 (scope/budget)**: research budget spent? scope unchanged? findings triaged?
- **Gate 2 (human approval)**: Carlos reviews on device. Feedback split: corrections (now) vs enhancements (backlog)
- **Gate 3 (quality)**: no section below 7/10, average >= 8/10, all corrections resolved
- **Audit is CONSTRAINED**: score what exists, don't request new features. "Add X" → backlog.
- **Fix = corrections only**: not enhancements, not rewrites. New scope = new iteration.
- **Budget counters**: fetches used, agents spawned, sections modified, lines changed in fix
- **Anti-pattern**: never fabricate numbers — every quantitative claim needs inline citation
