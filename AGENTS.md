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
- **Diagrams:** React Flow (architecture), D3.js (custom visualizations)
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

## Acronym Standard
- First occurrence of every acronym in the sequential reading order must expand to its full form: "EFA (Elastic Fabric Adapter)"
- After first expansion, the acronym alone is fine
- Every deep dive includes a Glossary in the Sources appendix section listing all acronyms used
- Niche/domain-specific acronyms always expand: SRD, NCCL, RDMA, MPI, NAPI, DIM, GRO, LRO, QP, CQ, AH, MR, PD, UARN, WQE, etc.
- Common computing acronyms (CPU, GPU, RAM, API, HTTP) do not need expansion

## Settled Decisions (Do Not Re-Debate)

- **ADR-001:** Cloudscape + Vite + React + pnpm monorepo. See `deep-dives/efa/docs/adr/ADR-001-tech-stack.md`. The MDX/static site alternative was evaluated and rejected.
- **No co-author tags** in commits.
- **IaC for all cloud resources.** Every experiment has teardown built in.
