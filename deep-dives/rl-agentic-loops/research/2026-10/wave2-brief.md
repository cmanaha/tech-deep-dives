# Wave 2 brief: refutation pass and gap fill (shared by all six agents)

Date of this pass and accessed date for every source you fetch: **2026-10-30**.

Repo root: `/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/rl-build`. Dive:
`deep-dives/rl-agentic-loops/`. You own exactly one output file, named in your task, under
`deep-dives/rl-agentic-loops/research/2026-10/`. Edit nothing else: not `SCOPE.md`, not the registers,
not another agent's file. The orchestrator applies your verdicts to the scope.

**Privacy: never put personal data (names, email addresses, account ids) in any request, header,
User-Agent, URL or query string.** If a site demands a contact address (SEC EDGAR, some APIs), use a
Wayback copy or skip the source. Any subagent you start gets this rule verbatim.

## Purpose

Gate 1, checks 2 and 3 (`RESEARCH-GUIDE.md` section 7). Every number in the scope's thesis and in the
section paragraphs you are assigned gets a verdict against its primary source at the pinned version.
The aim is to refute: look for the reading under which the scope's sentence is false, too broad, or
attached to the wrong model, benchmark, k, budget or condition.

## Inputs

1. `CLAUDE.md` at the repo root, "Fact-Checking & Sources Standard" and the tier ladder.
2. `deep-dives/efa/revamp/source-authority-standard.md` (code over docs over blogs; hedges keep scope).
3. `deep-dives/rl-agentic-loops/SCOPE.md`: the thesis and your assigned sections.
4. `deep-dives/rl-agentic-loops/RESEARCH-GUIDE.md`: section 2 (wave 2 questions), section 4 (evidence
   bar per claim type), section 6 (UNKNOWN register).
5. The register rows each sentence cites, in `research/2026-10/0N-*.md`. Each row carries the pinned
   source and a verbatim quote.
6. `reviews/2026-10/R2-factual-grounding.md` and `R2b-recheck.md`: 30 numbers already matched at the
   primary source on 2026-10-17. For a number R2 or R2b matched with a verbatim quote, you may carry
   that verdict (write "HOLDS (R2 #n, quote matched 2026-10-17)") without re-fetching, unless the
   scope's current wording adds a condition R2 did not check. Spot re-fetch at least two of them.

## Method

- Fetch the primary source at the pinned version: `arxiv.org/abs/<id>vN` or `arxiv.org/html/<id>vN`
  (the export API rate-limits; always pin vN), GitHub code at the tag or 40-character SHA the register
  names (`gh api` or raw URLs at the tag, never `main`), first-party docs pages. A paper's HTML may
  lack tables; then use the PDF (`arxiv.org/pdf/<id>vN`).
- One row per number (or per numeric claim when several numbers share one sentence and one source).
  Also check the non-numeric load-bearing assertions in your sections where a register row is the
  only support (a default value, "ships with beta 0", "no KL metric listed", a named mechanism).
- Verdicts:
  - **HOLDS**: the source says it, with the scope's conditions.
  - **SCOPE NARROWER**: the source says it only under a condition the scope drops (model, benchmark,
    k, budget, subset, seed count, "author-estimated", "preprint", vendor claim). Give the re-hedged
    replacement sentence.
  - **WRONG**: the source contradicts it, or the number is not there. Give the corrected replacement
    sentence and the quote.
  - **UNVERIFIABLE**: the source cannot be fetched or does not resolve. Say what you tried. The
    orchestrator decides whether the claim ships.
- Watch for: a figure from v1 of a paper where vN changed it; a peer-reviewed label without a venue
  on the arXiv record or the authors' page; a "derived" figure whose arithmetic does not reproduce
  (recompute every `[derived]` number and show the arithmetic); a vendor claim written as fact; a
  cross-model comparison written as same-model.

## Output file format (write to disk as you go; sessions can stop without warning)

```markdown
# Wave 2 refutation: <area>

**Date:** 2026-10-30. **Agent:** W<n>. **Sections:** <list>. **Sources fetched:** <count>.

## Verdicts

| # | Scope location | Claim as written (short) | Register | Source (pinned URL) | Verdict | Quote | Replacement text (for SCOPE NARROWER / WRONG) |
|---|---|---|---|---|---|---|---|

## Gap-fill findings

### G<n>. <question> (RESEARCH-GUIDE wave 2 question q / UNKNOWN Ux)
- Finding, with pinned URL, tier, verbatim quote.
- New register-style entry if it adds a claim the dive can use (claim, location, evidence, tier,
  use in dive).

## UNKNOWN triage proposals

| ID | Proposed triage (close-in-wave-2 / close-by-experiment / accept-as-hedge / cut-the-claim) | Evidence or reason | Hedge text the page should carry, if accepted |
|---|---|---|---|

## Summary
Counts per verdict; the WRONG and SCOPE NARROWER items in one line each.
```

Write the header and the first rows within your first few fetches, then append. Keep quotes verbatim
(render em-dashes as " - " and curly quotes as straight quotes, as the registers do).

## Budget

At most 70 fetches. No subagents unless a single question needs a long separate read. Return to the
orchestrator at most 150 words: counts per verdict, each WRONG item in one line, and which UNKNOWNs
you propose to close.
