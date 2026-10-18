# Verification brief: adversarial fact check and Gate 3 score, one section

You verify one section of the silicon-memory-inference deep dive after its
October 2026 refresh. Your job is to try to break every new or changed
quantitative claim against the source it cites, fix what fails, and score the
section against the section-shape standard. You are the last check before Carlos
reviews the section, so a figure you wave through is a figure he may repeat to
a customer.

Work from the dive root:
`/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/silicon/deep-dives/silicon-memory-inference`.
It is a git worktree. Never cd to the main checkout, never commit, push, stash
or touch git state.

## What you own

- `src/sections/<Section>.tsx`
- the diagram components it imports from `src/components/` that no other
  section imports (check with grep before editing a component)
- `src/sources/<Section>.ts`
- your report, `revamp/verification/<Section>.md`

Everything else is read-only: App.tsx, GlossaryAndSources.tsx, sources.md,
README.md, other sections and their sources. If a fix needs a change outside
your files (a shared record's title, a figure another section repeats), write
it in the report under "For the orchestrator" and do not make it.

## Read first

1. The repo `CLAUDE.md` at `../../CLAUDE.md`: "Section Shape: Mental Model Or
   Practical Value", "Writing Style: No AI Tells", "Fact-Checking & Sources
   Standard".
2. `revamp/authoring-brief.md` sections 2 (citation rules, tiers, kinds) and 5
   (diagrams). The same rules bind your fixes.
3. `revamp/authoring/<Section>.md`, the author's change report: what changed,
   which claims are new, and what the author left open.
4. `revamp/verification/ORCH-NOTES.md`: items the orchestrator flagged for this
   section, if any. Each one gets an explicit verdict in your report.
5. The before-and-after diff:
   `git diff b39b4d377b00ac0267cdb69ff66f84951640a22e -- src/sections/<Section>.tsx`
   (plus its components). b39b4d3 is the commit before the revamp.

## Network requests

Never put personal data in a request: no names, email addresses or account details in a
header, URL, query or body, even when a site asks for a contact address (SEC EDGAR asks for
one in the User-Agent). Use WebFetch, or curl with its default User-Agent. If a site refuses
without contact details, find the same document elsewhere (an archived copy, the company's
investor-relations page) or mark the claim UNVERIFIABLE.

## The job, in order

Write the report skeleton to disk first, then save it after every step. You
can be stopped by a usage limit at any moment, and anything not on disk is
lost.

### 1. List the claims

List every new or changed quantitative claim: numbers with units, dates,
versions, prices, instance facts, counts, ratios, and the arithmetic in
`kind="derived"` citation notes. Include the text inside diagrams and table
rows. Unchanged claims from before the revamp are in scope only when the
author's report or ORCH-NOTES flags them.

### 2. Try to refute each claim

For each claim, open the cited source (WebFetch; for a PDF, fetch it and read
the stated page) and look for the figure. Try to break it:

- Does the source state this number, for this product, at this
  configuration? Watch for dense vs sparse FLOPS, per direction vs
  bidirectional bandwidth, GB vs GiB, per chip vs per instance vs per rack,
  a different SKU or generation, and a different date or version.
- Is the tier right for the URL (Tier 1 docs, specs, filings and pinned code;
  Tier 2 vendor PR, blogs, product pages, vendor technical reports; Tier 3
  third-party analysis, papers and trade press)? Is a vendor performance figure
  marked `vendor-claim` or attributed in the sentence? Is a non-shipping
  product marked `roadmap`?
- For `derived`, recompute the arithmetic from the cited inputs. Rounding
  that changes the stated digits is wrong.
- Is every GitHub and Hugging Face URL pinned to a tag or commit SHA?
- Does a hedge keep its scope ("no benchmark was located" vs "none exists")?

Verdicts: CONFIRMED (the source states it), WRONG (the source contradicts it),
UNSUPPORTED (the source does not state it), MISLABELLED (tier or kind wrong),
UNVERIFIABLE (the fetch failed twice; try an archived copy before using this).
Quote the source text that decides each verdict, with the page or section.

Budget: verify every claim in the list. When a section has more than about 40,
verify all derived and vendor-claim figures plus the claims the section leans
on (its strongest number, every number in a diagram, every comparison), and
sample the rest. Say in the report which were sampled.

### 3. Fix corrections only

- WRONG: replace with the figure the source states, and fix any derived
  number that depended on it.
- UNSUPPORTED: find the right source if a quick search turns one up (fetch it
  and add a record with today's date as `accessed`), or soften the claim to
  what the source states, or cut it. Preserve the scope of every hedge.
- MISLABELLED: fix the tier or kind. If the URL appears in another section's
  source file with a different tier, report it instead of editing their file.
- Also fix any AI tell (em-dash, en-dash range, curly quote, banned word,
  "not just X, but Y", "it's worth noting"), any "Section N" cross-reference
  (use the section name in italics, from `src/sectionTitles.ts`), and any
  overlap or clipping in a diagram.

Do not add content, restructure, or rewrite for style beyond these. "This
section should also cover X" goes in the report under "Backlog", not into
the page.

### 4. Score Gate 3

Score the section after your fixes, 0 to 10, against the section-shape
standard. Score what exists; missing features are backlog, not deductions.
Give a sub-score with one line of evidence for each:

- Accuracy (after fixes): share of checked claims that were confirmed, and
  whether anything load-bearing was wrong.
- Mental model or practical value: does each block give the reader a way to
  think or a thing to do? Name any block that does neither.
- Shape: introduces before dissecting, h2 descriptions state the payoff, the
  strongest number lands more than once, supporting evidence is demoted into
  ExpandableSections, it ends on the reader's next action.
- Writing: no AI tells, things defined by what they are, attribution in the
  link rather than the sentence (except the four load-bearing cases).
- Economy: no padding, no repetition, length fits the content. The author's
  report gives the word count growth.
- Diagrams: rendered SVG with role="img" and a title, legible at 390 px, no
  overlap.

The overall score is your judgement, not an average, and must be justified in
two or three sentences. Gate 3 needs every section at 7 or above and an
average of at least 8. If a correction would lift the section over 7, make it.
If only an enhancement would, put it in the backlog and say so.

### 5. Check before you report

If you changed any file:

```bash
pnpm exec tsc --noEmit 2>&1 | grep -E "<Section>|<YourComponent>|sources/<Section>" || echo "no type errors in my files"
pnpm exec eslint src/sections/<Section>.tsx src/sources/<Section>.ts src/components/<YourComponent>.tsx --max-warnings 0
pnpm exec vitest run src/__tests__/sections.test.tsx -t <Section>
(cd ../.. && for g in no-ai-tells svg-a11y pinned-refs pre-overflow; do bash scripts/gates/$g.sh > /tmp/vf-<Section>-$g.txt 2>&1; echo "$g exit=$?"; grep -E "<Section>|<YourComponent>" /tmp/vf-<Section>-$g.txt; done)
```

Other files may still fail the dive-wide gates; only hits in your files
matter, and there must be none. If you changed a diagram, rebuild and shoot it:

```bash
pnpm exec vite build --outDir /tmp/vf-<Section>-dist --emptyOutDir
node scripts/shoot.mjs --sections <nav-id> --widths 1440,390 --out /tmp/vf-<Section>-shots --dist /tmp/vf-<Section>-dist
```

Read the PNGs. The nav id is in `src/App.tsx`.

### 6. Report

`revamp/verification/<Section>.md`:

```
# Verification: <Section title>

Verified: <date>. Claims checked: N (sampled: M). Confirmed A, wrong B,
unsupported C, mislabelled D, unverifiable E.

## Gate 3 score: X/10
<two or three sentences>
| Criterion | Score | Evidence |

## Claims
| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |

## ORCH-NOTES items
<verdict for each flagged item>

## Fixes applied
<file:line, before, after>

## Checks
<each command and its exit code>

## For the orchestrator
<changes needed in files you do not own>

## Backlog
<enhancements, not done>
```

Reply in at most 120 words: the score, the counts, the fixes, and anything for
the orchestrator.
