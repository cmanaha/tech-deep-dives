# ADR-001: Tech Stack — Cloudscape + Vite + React + pnpm Monorepo

**Status:** Accepted
**Date:** 2026-03-22
**Deciders:** Carlos

## Context

Each tech deep dive produces an interactive single-page application with architecture diagrams (React Flow), filterable data tables, expandable sections, tab switching, and animated visualizations. The content targets a technical lead audience that benefits from interactive exploration over static reading.

We need a stack that supports:

1. Interactive client-side state: tab switching, expandable/collapsible sections, filterable tables, search within content.
2. Animated architecture diagrams with React Flow and D3.js.
3. AWS-consistent design language (dark mode, accessible components, design tokens).
4. Multiple deep dives sharing common layout and component code.
5. Each deep dive independently buildable and deployable as a static site.

## Decision

**React 18 + TypeScript + Vite + Cloudscape Design System**, organized as a **pnpm workspace monorepo**.

### Why React (not static site / MDX)

The alternative considered was an MDX-based static site generator (Astro, Docusaurus, or plain MDX). This was rejected because:

- **Client-side state is pervasive.** Every deep dive uses tab navigation, expandable detail sections, filterable tables, and interactive diagrams. These require a component model with state management. MDX can embed React components, but when the majority of content is interactive components rather than prose, the MDX abstraction adds friction without benefit.
- **React Flow and D3 require a React runtime.** Architecture diagrams are not static images — they are interactive, zoomable, and animated. React Flow is a React library. Wrapping it in MDX islands adds complexity with no gain.
- **Cloudscape is a React component library.** Using it natively avoids wrapper overhead and gets full TypeScript support, theming, and accessibility out of the box.

### Why Cloudscape

- AWS-consistent design tokens and dark mode with zero custom CSS.
- Accessible by default (WCAG 2.1 AA).
- Rich component set: Tables with filtering/sorting/pagination, Tabs, ExpandableSection, Container, Header, SpaceBetween, ColumnLayout — all directly map to deep dive content patterns.
- As an AWS SA, using the same design system as AWS console ensures visual consistency when referencing AWS concepts.

### Why Vite

- Sub-second HMR for development iteration.
- Optimized production builds with tree-shaking and code splitting.
- First-class TypeScript and React support via `@vitejs/plugin-react`.
- Simple configuration — `vite.config.ts` is under 10 lines per deep dive.

### Why pnpm Workspaces

- **Shared components across deep dives.** `@tech-deep-dives/shared` provides `DeepDiveLayout`, `DiagramViewer`, `PricingTable`, and other reusable components. Each deep dive imports from `workspace:*` — no publishing, no versioning overhead.
- **Independent builds.** Each deep dive is a standalone Vite app with its own `package.json`, `tsconfig.json`, and build output. `pnpm --filter @tech-deep-dives/efa build` builds only the EFA deep dive.
- **Strict dependency isolation.** pnpm's content-addressable store and strict node_modules structure prevent phantom dependencies.
- **Single lockfile.** One `pnpm-lock.yaml` at the root ensures reproducible installs across all packages.

## Consequences

- Every deep dive requires React/TypeScript knowledge to author — no markdown-only path.
- Bundle size is larger than a static site (React runtime + Cloudscape CSS). Acceptable because deep dives are reference material loaded once and explored, not high-traffic landing pages.
- Adding a new deep dive requires scaffolding a Vite app (mitigated by the `_template/` directory).
- Cloudscape pins us to React — migrating to another framework would require rewriting all components. Acceptable given the AWS alignment and the project's scope.
