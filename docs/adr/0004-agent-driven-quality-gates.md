# ADR-004: Two-Tier Quality Gates — Deterministic Gates and Agent-Driven Advisories

Status: Accepted
Date: 2026-04-21
Branch of origin: `cicd`
Supersedes: nothing
Related: ADR-003 (Iteration Flywheel)

## Context

The 2026-04-21 EFA deep-dive audit surfaced a class of bugs that no static-source review caught: live-rendered DOM problems (deep-link routing not wired, React Flow node-stacking from `extent: 'parent'` clamping, Cloudscape column-layout overflow, Pricing orphan-div outside its `ColumnLayout`, Network Comparison h3-wraps-StatusIndicator visual-hierarchy break, Feature Comparison table with no responsive strategy). The bugs were real and shipped to production despite the source code being structurally clean.

The audit was performed by Playwright-driven sub-agents — first a single monolithic agent (which truncated under context pressure), then 11 parallel per-section agents (which mostly worked but exposed two truths):

1. Live browser-level audit catches a class of bug that source review fundamentally cannot. We need browser-level gates.
2. LLM-driven audit produces non-deterministic verdicts (the same code can pass on Tuesday and fail on Thursday because an LLM judged differently). That is incompatible with what a CI gate is supposed to be.

We need both kinds of validation, and they must be architecturally separated.

## Decision

Adopt a two-tier quality-gate architecture:

### Tier 1 — Deterministic gates

Run via `bash scripts/ci.sh` (alias: `pnpm gates`). Composed of:

- TypeScript strict mode (`pnpm typecheck`)
- ESLint with `react/no-unescaped-entities` for JSX text (`pnpm lint`)
- Vitest unit tests (`pnpm test`)
- Vite build (`pnpm build`)
- HTML5 validator on every `index.html` and `dist/index.html` (`scripts/gates/html-validate.sh`)

Properties:
- No LLM. No agents. No network beyond pnpm/npm package fetches.
- Same input produces the same verdict, every time.
- Fast enough to run freely during a coding session.
- This is the "keep the rhythm" tool.

`ci.sh` is a local-development tool. It is not invoked by `.github/workflows/`. The GitHub Actions CI workflow is owned and maintained separately by Carlos and intentionally keeps Claude/agents out of the merge path.

### Tier 2 — Agent-driven advisory audits

Run via `bash scripts/audit.sh` (aliases: `pnpm audit`, `pnpm audit:playwright`, `pnpm audit:agents`, `pnpm audit:all`). Two backends:

- `--with-playwright`: deterministic browser-level invariants. Tests live in `deep-dives/{topic}/playwright/gate-*.test.ts`. Same-input-same-verdict like Tier 1, but require a running browser and are slower than ci.sh, so they live in the session-runner rather than the per-commit gate.
- `--with-agents`: LLM-driven advisory audits. Three agent types (render-auditor, diagram-auditor, route-auditor) consume three skills (render-audit-section, diagram-audit-reactflow, route-integrity-check). Findings get written as structured markdown artifacts to disk, never streamed back into orchestrator context.

Properties:
- Opt-in via explicit flag. Never runs accidentally.
- Never blocks any commit or merge.
- Outputs land as markdown files in `deep-dives/{topic}/audit-reports/`. Reviewable, diffable, and re-readable across sessions without consuming agent context.
- Used during coding sessions when we want deeper validation than ci.sh provides.

## The Ratchet Principle

Every time the agent layer finds a real bug, encode it as a deterministic gate. The agent surface shrinks over time as more bug classes become scripted Playwright invariants or static lint rules. Agents stay as the frontier detector; deterministic gates are the ratchet that locks gains in.

Concrete examples from the 2026-04-21 audit cycle:
- Agent finding: deep-link routing is not wired (no `useEffect(location.hash)` in App.tsx) → becomes Playwright test `gate-deep-links.test.ts`.
- Agent finding: React Flow GPU 4-7 stacked at identical positions due to `extent: 'parent'` clamping → becomes Playwright test `gate-react-flow-invariants.test.ts` with a node-overlap assertion.
- Agent finding: raw `&` in `<title>` of EFA index.html → captured by `html-validate` Tier 1 gate (immediate ratchet).
- Agent finding: `<500ns` written as raw text in JSX → captured by ESLint `react/no-unescaped-entities` Tier 1 rule (preventive ratchet).

Without the ratchet, agent advisories would surface the same bugs every audit. With the ratchet, agents redirect to new frontiers.

## Why Agents Are Not Part of `ci.sh`

The temptation to make agents part of the merge gate is high — they find real bugs and produce useful reports. We explicitly resist this for three reasons:

1. **Determinism**. CI gates must produce the same verdict on the same input every time. LLM judgments do not satisfy that contract. A merge gate that sometimes fails and sometimes passes for the same code is worse than no gate.
2. **Speed**. Agent runs take minutes to tens of minutes per topic. Per-commit invocation would crater development velocity.
3. **Cost**. Per-commit LLM invocations multiply by every push. Agent advisories run on demand or on a schedule, not on every commit.

The right place for agents is the session runner. Carlos and Claude run them when we want to be thorough; they do not run themselves.

## Why CI Workflow Is Decoupled From `ci.sh`

`scripts/ci.sh` is a session tool. `.github/workflows/ci.yml` is platform infrastructure. They have overlapping but distinct purposes:

- `ci.sh` evolves session-by-session; it can break, get patched, get extended without ceremony.
- The GitHub Actions workflow is a stable contract with the team's merge process. It changes only deliberately, with full review.

Coupling them would mean every change to `ci.sh` (which we make freely) would also affect the workflow (which we change carefully). Decoupling lets `ci.sh` stay aggressive and the workflow stay conservative.

If `ci.sh` and the workflow happen to run a similar set of gates, that is fine. If they diverge (e.g. the workflow adds a deploy step `ci.sh` does not), that is also fine. They share the principle (deterministic, fast, no LLM) but not the implementation.

## Output Convention

Every audit run writes artifacts under:

```
deep-dives/{topic}/audit-reports/
├── playwright/
│   └── gate-{name}-{viewport}.md
├── render/
│   └── {section}-{viewport}.md
├── diagrams/
│   └── {diagram}-{viewport}.md
├── routes/
│   └── route-integrity.md
├── screenshots/
│   └── *.png
└── SUMMARY.md
```

The session runner produces `SUMMARY.md` as the human-readable verdict. Individual report files are referenced for triage. Carlos and Claude read SUMMARY.md only; per-report markdown is read on demand. This is the "context stays on disk, not in working memory" principle.

## Implementation Phases

Phase 1 (complete): `ci.sh` + ESLint rule + html-validate gate. Foundation laid in commits `7926d2b`, `48679df`, `c774038`, `b94eb57` on the `cicd` branch.

Phase 2 (next session): Install `@playwright/test`, write seven invariant test files, write `scripts/audit/run-playwright.sh` that audit.sh dispatches.

Phase 3 (subsequent session): Use the `skill-creator` and `agent-builder` plugins (eval-driven, not hand-rolled) to author three skill/agent pairs. Wire `scripts/audit/run-agents.sh`.

Phase 4: Apply the EFA bug fixes (deep-link routing, Pricing W3, NetworkTopologyDiagram stacking, NetworkComparison W1, EFADataPathDiagram label wrap). Each fix lands with the corresponding gate already in place to prevent regression.

## Consequences

**Positive**:
- CI stays fast and deterministic; agents stay opt-in and powerful.
- Bug discovery and bug prevention are separate concerns with separate tooling.
- Future deep dives inherit the architecture from day one (template + shared scripts).
- `audit-reports/` directory becomes a historical record of what each audit found and when.
- The ratchet principle ensures agent value compounds rather than evaporates.

**Negative**:
- Two scripts (`ci.sh` and `audit.sh`) instead of one. Slightly more surface to learn.
- Agent runs are session-driven — if Carlos forgets to run them, drift can accumulate. Mitigation: `audit.sh` cron job (out of scope for now; possible later).
- Tier 2 outputs are markdown not structured JSON. If we ever want machine consumption, schema needs to be tightened.

**Neutral**:
- Tier 1 gates may temporarily fail when a new bug class is observed before the gate to catch it is written. This is normal and expected during the ratchet's first turn.

## Alternatives Considered

**Alternative A: Single ci.sh that runs everything including agents**.
Rejected because of the determinism, speed, and cost concerns above.

**Alternative B: GitHub Actions workflow that calls ci.sh**.
Rejected because Carlos owns the workflow as a stable contract; ci.sh evolves session-by-session and would force coupled change cadence. The workflow can independently run a similar (but separately authored) set of steps.

**Alternative C: Agent-only validation, no Playwright invariants**.
Rejected because deterministic invariants are what enable the ratchet. Without them, agents would re-discover the same bugs every audit.

**Alternative D: Playwright invariants in ci.sh, agents in audit.sh**.
Rejected because Playwright requires a running browser, takes 10+ seconds to spin up, and sometimes flakes. ci.sh must stay fast and dependable. Playwright belongs with the session runner.

## References

- Source audit findings (2026-04-21): summary in this session's git log on `cicd` branch.
- Diagram audit findings: `Network Topology stacking due to extent:'parent' clamp`, identified by parallel Playwright agent.
- Per-section audit fan-out experiment (11 agents, 8 returned, 3 truncated): demonstrated that narrow-scope per-section agents avoid the context-pressure failures of monolithic audits — informs the agent design in Phase 3.
