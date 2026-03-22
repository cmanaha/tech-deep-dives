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
- **Freshness verification** — See ADR-002. Claims age; code and experiments don't. Tier 0 (our experiments) > Tier 1 (official docs) > Tier 2 (blogs) > Tier 3 (analysis).
- **No co-author tags** in commits.

## Tech Stack
- **Frontend**: Vite + React 18 + TypeScript + Cloudscape Design System
- **Diagrams**: React Flow for architecture diagrams, D3.js for custom visualizations
- **Build**: pnpm workspaces
- **CI**: GitHub Actions — lint, typecheck, build per deep-dive
- **Deploy**: Static — GitHub Pages or S3+CloudFront (TBD)

## Content Philosophy
- **Outcome-first**: Start with "what business problem does this solve?" then work backward to mechanism.
- **Right complexity level**: Technical lead audience — skip basics, focus on architecture decisions, trade-offs, pricing implications, and when-to-use guidance.
- **Visual-first**: Prefer diagrams, animations, and interactive elements over walls of text.
- **Comparative**: Always show alternatives and trade-offs, not just the happy path.

## Iteration Flywheel (ADR-003)
RESEARCH → DRAFT → DEEP RESEARCH → INTEGRATE → BUILD CHECK → AUDIT → FIX → RE-AUDIT → CLOSE

- Content work first: research, draft, deep research, integrate — get the content right
- Quality gate last: audit-fix-audit is the pre-commit gate (like tests before push)
- Audit: parallel agents score against Open Brain principles + research accuracy
- Fix: targeted edits from audit findings only (not speculative improvement)
- Re-audit: verify fixes on CURRENT code (dispatch AFTER saves, not before)
- Close: re-audit passes, commit, push, deploy — see checklist in ADR-003
- Scope control: fetch budgets, "research only" instructions, Carlos drives topics, ADRs are settled
- Git operations: always main context (not subagents)
- Anti-pattern: never fabricate numbers — every quantitative claim needs inline citation
