# ADR-003: Deep Dive Iteration Flywheel and Close-Iteration Standard

## Status
Accepted

## Context
The EFA deep dive session (2026-03-22) produced a measurable quality improvement from 5.6/10 to 9.0/10 through a specific cycle of research, drafting, auditing, fixing, and re-auditing. This ADR codifies that cycle as the standard process for all deep dives, and defines the "close iteration" gate that must pass before pushing to git.

The core insight: producing deep dives is software engineering one level up. The same patterns apply but to knowledge artifacts instead of code.

## Decision

### The Flywheel (8 phases, each with verifiable output)

```
RESEARCH → DRAFT → DEEP RESEARCH → INTEGRATE → BUILD CHECK → AUDIT → FIX → RE-AUDIT → CLOSE
   ↑                                                                                      |
   └──────────────────────────────────────────────────────────────────────────────────────┘
```

The audit-fix-audit cycle is the PRE-COMMIT GATE — like running tests before pushing.
All content work (research, drafting, integration) happens first. The quality gate happens last.

| Phase | Action | Verifiable Output | Agent Pattern |
|---|---|---|---|
| 1. Research | Parallel agents with fetch budgets (8-10 per agent) | Research notes with [VERIFIED] tags, source URLs | 3-5 doc-researcher agents in parallel |
| 2. Draft | Scaffold + content, section architecture decided upfront | Sections render, basic structure complete | Main context or single agent |
| 3. Deep Research | Source code analysis, API introspection for unique depth | Code-level findings with file:line citations | 3-4 parallel agents on specific repos |
| 4. Integrate | Add research findings to content, enrich sections | Build passes, new sources in appendix | Agent for edits, main context reviews |
| 5. Build Check | typecheck + lint + build + test all pass | CI-equivalent green | Automated |
| 6. Audit | Score against Open Brain principles + research accuracy | Per-section scores (accuracy, depth, outcome-first) | 2 parallel audit agents (setup + content) |
| 7. Fix | Targeted edits from audit findings only | Scores improve, no regressions | Main context edits, agents for large changes |
| 8. Re-audit | Verify fixes on CURRENT code (not stale) | Updated scores, all "should fix" resolved | Same audit agents, dispatched AFTER fixes saved |
| 9. Close | Re-audit passes, commit, push, deploy | GitHub Pages live, CI green | Main context (git ops always here) |

### Close-Iteration Checklist (all must pass before push)

Every push to main requires these checks. This is the "CI pipeline for knowledge."

#### Accuracy (unit tests)
- [ ] Every quantitative claim has an inline citation
- [ ] Fact-check register in Sources appendix is complete
- [ ] No [UNVERIFIED] claims in the content (or explicitly flagged as such)
- [ ] Source tier: no Tier 4 sources cited as authoritative fact

#### Consistency (integration tests)
- [ ] Numbers match across sections (e.g., P5 bandwidth in Instance Support = Architecture)
- [ ] Acronyms expanded on first sequential occurrence
- [ ] Glossary in Sources appendix covers all acronyms used

#### Framing (lint)
- [ ] Every section leads with the business/engineering outcome
- [ ] "Why should I care?" answered in the first paragraph of each section
- [ ] Decision trees and comparison tables present, not just prose

#### Sources (type check)
- [ ] sources.md lists all cited sources with URLs and access dates
- [ ] Source tier badges assigned to every source
- [ ] All URLs are reachable (not 404)

#### Build (CI pipeline)
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes (zero warnings)
- [ ] `pnpm test` passes
- [ ] `pnpm build` passes

#### Quality (code review)
- [ ] Audit agent scores all sections >= 8/10 on accuracy
- [ ] Audit agent scores all sections >= 7/10 on depth
- [ ] Audit agent scores all sections >= 8/10 on outcome-first
- [ ] No "should fix" items remaining from audit

#### Deployment
- [ ] Bundle size within budget (report gzipped JS + CSS)
- [ ] GitHub Pages deployment succeeds
- [ ] Site accessible and renders correctly

### Scope Control Rules

1. **Fetch budgets**: Every research agent gets a hard limit (8-10 fetches)
2. **"Research only, no action"**: Research agents produce data, human decides action
3. **Audit-then-fix**: Never fix without auditing first. The audit defines the work.
4. **Topic direction**: Carlos initiates new topics. Agents do not suggest.
5. **ADRs are settled**: Decisions in ADRs are not re-debated. AGENTS.md lists them.
6. **Section architecture upfront**: Define sections before writing. New sections require deliberate decision.
7. **Force the close**: Don't let scope creep skip the verification step. Each iteration ends with a commit.

### Anti-Patterns to Avoid

| Anti-Pattern | Detection | Prevention |
|---|---|---|
| Fabricated numbers | Audit finds claims without [VERIFIED] tag | Every number needs inline citation |
| Factual errors carried through | Audit cross-references against authoritative sources | Instance data from DescribeInstanceTypes, not memory |
| Stale audit | Scores don't reflect applied fixes | Audit runs AFTER fixes saved to disk |
| Scope creep | Agent suggests new topics before current closes | Correction captured: focus on current work |
| Git ops in subagents | Permission blocks | Git operations always in main context |

## Consequences

- Each deep dive takes multiple iteration cycles (this is expected, not a failure)
- The flywheel produces measurable improvement per cycle (tracked via audit scores)
- The close-iteration checklist prevents pushing incomplete or inaccurate work
- Budget constraints prevent diminishing-returns research spirals
- The process is agent-executable: an agent can run the flywheel with human-in-the-loop at audit review and close

## Alternatives Considered

- **No formal process**: How the first draft was produced. Score: 5.6/10. Insufficient.
- **Single audit without re-audit**: Misses the "did the fix actually work?" verification. Stale audit risk.
- **Unbounded research**: No fetch limits. Leads to scope creep and diminishing returns.
- **Manual verification only**: Doesn't scale. The audit agent pattern catches things humans miss (e.g., inconsistent numbers across sections).
