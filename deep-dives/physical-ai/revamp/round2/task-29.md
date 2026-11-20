# Task: update section 29 (Choosing) for the four orchestrator sections

Work in this git worktree, dive directory `deep-dives/physical-ai/`. FIRST read `revamp/authoring-brief.md` in
full (it binds: evidence and `Cite` rules, prose rules, SVG contract, the check tool, return format) and `SCOPE.md`
section "Round 2 (2026-11-20): the 30-section plan". Never put personal data (names, email addresses, account ids,
hostnames, home-directory paths) in any request, header, User-Agent, URL or query string. No git write commands,
never run `pnpm build`. No dollar figures.

You own `src/sections/Choosing.tsx` (h1 exactly "29. Choosing"), `revamp/claims/choosing.md`,
`revamp/glossary/choosing.json`. Section id `choosing`, check port 4487, slug `choose`. Edit nothing else.

The dive now has one section per orchestrator: 25 AWS Batch, 26 AWS Parallel Computing Service, 27 Amazon
SageMaker HyperPod, 28 Amazon EKS (read all four: `AwsBatch.tsx`, `AwsPcs.tsx`, `HyperPod.tsx`, `Eks.tsx`), and
section 24 is the overview (`AwsOrchestration.tsx`). Section 29 was written when only Batch, HyperPod and EKS
were covered, in one section. Make it consistent with what 24 to 28 now say, with the smallest change that does it:

1. The decision path figure, the rules and the closing table must know four orchestrators: add AWS Parallel
   Computing Service where a workload or a team fits it (a team that already runs Slurm; multi-node training with
   EFA), with entries from `research/2026-11/10b-aws-pcs-hyperpod.md` (F10-200 to F10-245).
2. Where registers `10a`, `10b`, `10c` correct register 09 (each has a section 10 listing the contradictions),
   the page follows register 10: check every sentence of this section that cites one of the F09 entries named
   there and fix the sentence and its citation.
3. Each row of the closing table points to the section that takes its orchestrator apart.
4. Every cross-reference uses the new numbers and titles (`revamp/tools/sections.json`).
5. Define ODCR and Trainium at first use (the reader review found them undefined).

Keep everything else. Run the brief's checks for `choosing` and `node revamp/tools/check-renumber.mjs`; read the
figure PNGs at 1440 and 390. Return at most 200 words in the brief's format.
