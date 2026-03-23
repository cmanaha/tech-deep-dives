# ADR-003: Deep Dive Iteration Flywheel and Close-Iteration Standard

## Status
Accepted (revised from initial version after sequential analysis of logical gaps)

## Context
The EFA deep dive session (2026-03-22) produced a measurable quality improvement from 5.6/10 to 9.0/10 through iterative cycles. This ADR codifies the process, learned from what worked AND what went wrong.

The core insight: producing deep dives is software engineering one level up. The same patterns apply but to knowledge artifacts instead of code.

Post-session analysis identified 12 logical gaps in the initial flywheel design, including: budget/scope controls as rules instead of gates, no distinction between corrections and enhancements, human review implicit rather than explicit, audit agents able to expand scope, and the close checklist being advisory rather than enforced.

## Decision

### The Flywheel (with three explicit gates)

```
RESEARCH → DRAFT → DEEP RESEARCH → INTEGRATE
                                       ↓
                            ═══ GATE 1: SCOPE/BUDGET ═══
                            (within budget? scope locked? findings triaged?)
                                       ↓
                            BUILD CHECK → DEPLOY PREVIEW
                                       ↓
                            HUMAN REVIEW (on device)
                                       ↓
                            ═══ GATE 2: HUMAN APPROVAL ═══
                            (scope confirmed? feedback = structured findings)
                                       ↓
                            AUDIT → FIX → RE-AUDIT
                                       ↓
                            ═══ GATE 3: QUALITY ═══
                            (no section < 7? avg >= 8? all corrections resolved?)
                                       ↓
                                     CLOSE
```

### Phase Details

| Phase | Action | Budget/Scope Control |
|---|---|---|
| 1. Research | Parallel agents, authoritative sources | Max 5 agents, 8-10 fetches each |
| 2. Draft | Scaffold + content, sections decided upfront | Section count locked at this phase |
| 3. Deep Research | Source code, API introspection | Max 4 agents, 8-10 fetches each |
| 4. Integrate | Add research findings to content | **TRIAGE**: not all findings go in. Which are in-scope for THIS iteration? |
| **GATE 1** | **Scope/Budget checkpoint** | Research budget spent? Scope unchanged from draft? New sections = new iteration |
| 5. Build Check | typecheck + lint + test + build | Mechanical — all must pass |
| 6. Deploy Preview | GitHub Pages or dev server | Accessible for human review |
| 7. Human Review | Carlos reviews on device | Feedback enters as structured findings |
| **GATE 2** | **Human approval** | Scope confirmed. Carlos's feedback split: corrections (this iteration) vs enhancements (backlog) |
| 8. Audit | Score existing content against principles | **CONSTRAINED**: score what exists. "Add X" → backlog. Don't request new features. |
| 9. Fix | Corrections from audit + human review | Corrections ONLY. No new scope. No rewrites. |
| 10. Re-audit | Verify fixes on CURRENT saved code | Pass/fail: no section below 7, average >= 8 |
| **GATE 3** | **Quality gate** | All corrections resolved? Scores pass? Build green? |
| 11. Close | Commit, push, deploy final | Iteration complete. Backlog items become next iteration's scope. |

### Budget Counters (tracked throughout, hard stops at gates)

| Metric | Tracked At | Hard Stop |
|---|---|---|
| research_fetches_used | Phases 1, 3 | Gate 1 |
| agents_spawned | All phases | Gate 1 |
| sections_modified vs sections_locked | Phases 2-4 | Gate 1 (new sections = new iteration) |
| lines_changed_in_fix | Phase 9 | Gate 3 (if fix becomes rewrite, split) |
| audit_findings_fixed / total | Phase 9-10 | Gate 3 |

### What the Audit Can and Cannot Do

**CAN**: Score accuracy (1-10), depth (1-10), outcome-first (1-10) per section. Identify factual errors. Flag unsourced claims. Check cross-section consistency. Verify acronym expansion.

**CANNOT**: Request new sections. Suggest new topics. Propose architectural changes. Add scope. Any "you should also cover X" goes to backlog with a note for the next iteration.

### Corrections vs Enhancements (the key distinction)

| Type | Example | This Iteration? |
|---|---|---|
| **Correction** | "Latency figure is wrong — says 2-5μs, should be 15.5μs" | Yes — fix it now |
| **Correction** | "Inf2 EFA claim is factually false" | Yes — remove it now |
| **Correction** | "Section leads with mechanism, not outcome" | Yes — reframe it |
| **Enhancement** | "Missing topology-aware rank assignment section" | No — backlog for next iteration |
| **Enhancement** | "Should add Karpenter integration" | No — backlog |
| **Enhancement** | "The startup playbook would be valuable" | No — backlog |

In this session, enhancements were treated as corrections (added 4 new sections during "fix" phase). That's scope creep. The revised process splits them.

### Close-Iteration Checklist

Every push to main requires these checks.

#### Accuracy (unit tests)
- [ ] Every quantitative claim has an inline citation
- [ ] Fact-check register complete (claims with sources vs without)
- [ ] No fabricated numbers (the original sin — caught at 5.6/10)
- [ ] Source tier: no Tier 4 cited as authoritative fact

#### Consistency (integration tests)
- [ ] Numbers match across sections
- [ ] Acronyms expanded on first sequential occurrence
- [ ] Glossary complete in Sources appendix

#### Framing (lint)
- [ ] Every section leads with business/engineering outcome
- [ ] Decision trees and comparison tables present

#### Sources (type check)
- [ ] sources.md lists all cited sources with URLs and access dates
- [ ] All URLs reachable

#### Build (CI)
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes (zero warnings)
- [ ] `pnpm test` passes
- [ ] `pnpm build` passes

#### Quality (code review)
- [ ] No section below 7/10 on any axis
- [ ] Average across sections >= 8/10
- [ ] All "should fix" corrections resolved
- [ ] Enhancements logged to backlog, not smuggled into fixes

#### Scope (budget)
- [ ] Research budget not exceeded
- [ ] No new sections added after scope lock (Gate 1)
- [ ] Fix phase made corrections only, not enhancements

### Anti-Patterns (from session evidence)

| Anti-Pattern | What Happened | Prevention |
|---|---|---|
| Fabricated numbers | 2-5μs latency with no source | Every number needs citation. Audit catches uncited claims. |
| Scope creep via audit | Audit requested 4 new sections as "fixes" | Split corrections vs enhancements. Enhancements → backlog. |
| Research without triage | 4 agents produced findings, all integrated | Gate 1: triage which findings are in-scope. |
| Stale audit | Audit ran on pre-fix code | Re-audit dispatched AFTER fixes saved to disk. |
| Advisory close gate | First commit at 5.6/10 with errors | Close checklist enforced before push. |
| Unbounded integration | 50 research findings → all crammed in | Integration budget: triage at Gate 1. |

## Consequences

- Each deep dive takes multiple iteration cycles (expected, not failure)
- Enhancements accumulate in backlog — next iteration picks them up
- The three gates are explicit decision points, not just checklists
- Budget tracking prevents diminishing-returns spirals
- Human review is an explicit phase, not an interruption
- The process is agent-executable with human-in-the-loop at Gates 2 and 3

## Alternatives Considered

- **No formal process**: Produced 5.6/10 content with fabricated numbers. Insufficient.
- **Single gate at close only**: Misses scope creep during integration. Gates need to be throughout.
- **Unbounded research**: No fetch limits → rabbit holes and context exhaustion.
- **Audit as feature request channel**: Led to 4 new sections mid-iteration. Split corrections from enhancements.
