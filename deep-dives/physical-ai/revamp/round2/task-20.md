# Task: rework section 20 so the loop comes first, and fix three term-before-definition gaps

You are reworking one section of the published deep dive "Physical AI" (Vite + React + TypeScript + Cloudscape) in
this git worktree; dive directory `deep-dives/physical-ai/`. FIRST read `revamp/authoring-brief.md` in full (it
binds: reader, evidence and `Cite` rules, prose rules, SVG contract, the check tool, what to return), then
`SCOPE.md` section "Round 2 (2026-11-20): the 30-section plan", then `revamp/reviews/reader.md` (the blocks for
sections 5, 7 and 20 and the cross-cutting list at the end). Rule to keep and to hand verbatim to any subagent:
never put personal data (names, email addresses, account ids, hostnames, home-directory paths) in any request,
header, User-Agent, URL or query string. No git write commands, never run `pnpm build`, no AWS calls, no SSH, no
messages. No dollar figures. The talk's session code (letters C-M-P, digits 4-0-7) never appears.

You own: `src/sections/Workloads.tsx` (export `Workloads`; h1 exactly "20. Fifteen Workloads, Five Shapes"),
`revamp/claims/workloads.md`, `revamp/glossary/workloads.json`; and, for the two small fixes below only,
`src/sections/VisionLanguageAction.tsx` and `src/sections/Jepa.tsx`. Section ids `workloads`, `vla`, `jepa`;
check port 4485, slug `wl`. Edit nothing else.

## Section 20

The owner's feedback: in places the dive leans on the profiling view where he wants the physical AI process in
front; the figure of where the five shapes land "is a super crappy graph, that's a decision graph". The reader
review: CPU terms (front end, back end, retire, bound) appear here one section before section 21 builds them;
"triad" is never explained; DGX Spark gets no clause at first use.

Rework so the reader sees, in this order: **what each workload does in the robot's loop first, then its shape,
then where it lands on AWS.**

1. Open with the loop. Mount `LoopOnAws` from `../components/LoopOnAws` with `emphasis="part"` near the top (read
   the component: six stages, each with what it does, the machine part it loads, the AWS service it runs on),
   with `cites` listing the register entries behind its placements (F08-76, F08-78 and the F09 entries you
   verify) and a caption. If the section has a figure that only shows where shapes land as a decision or
   box-and-label diagram, this replaces it.
2. Introduce the fifteen workloads by what they do for the arm (one plain clause each, grouped by loop stage),
   before any machine-part vocabulary.
3. Then the machine parts and the matrix (keep the matrix and the engine picker: they show the thing).
4. Keep top-down and PMU vocabulary out: sections 21 and 22 own it. Where this section needs a CPU term, give
   the plain meaning at first use in a clause ("the front end, the part of a core that fetches and decodes
   instructions") and keep it to the rows that need it. Explain "triad" where it first appears or drop the word.
   Give DGX Spark and any other hardware name a clause at first use.
5. End by pointing to section 24, Orchestrating Physical AI on AWS (the workloads placed on AWS) and the four
   orchestrator sections (25 AWS Batch, 26 AWS Parallel Computing Service, 27 Amazon SageMaker HyperPod,
   28 Amazon EKS), then 29, Choosing.

Do not grow the section: target the same or fewer words. Keep every number cited as it is.

## Two small fixes elsewhere (touch only the named gap)

- Section 5 (`VisionLanguageAction.tsx`): "token" is used before the page defines it. Add a plain clause at its
  first use in this section. Reconcile the three rates in the paragraph the reader could not follow (10 Hz, 15.6
  chunks a second, 120 Hz): say in one or two sentences what each rate counts, using only numbers the cited
  entries already carry. Explain "patches" where 280 tokens per frame is derived, or point to section 7.
- Section 7 (`Jepa.tsx`): give the intuition for why the slow-moving target encoder helps prevent collapse, in
  two or three plain sentences before the mechanism, and add a plain-words sentence to each of the two
  regulariser passages that assume statistics (what variance and covariance mean for a batch of embeddings).
  Use only what the cited register entries support.

Checks: the ones in `revamp/authoring-brief.md` section 7 and 9 for all three section ids
(`--sections workloads,vla,jepa`), plus `node revamp/tools/check-renumber.mjs`. Read the PNGs of the loop figure
at 1440 and 390. Return at most 200 words in the brief's format.
