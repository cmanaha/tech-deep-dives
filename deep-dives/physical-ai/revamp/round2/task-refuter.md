# Task: refute the round 2 AWS registers (you did not write them)

Work in this git worktree, dive directory `deep-dives/physical-ai/`. Today is 2026-11-20. Three research agents
wrote `research/2026-11/10a-aws-batch.md`, `10b-aws-pcs-hyperpod.md` and `10c-aws-eks-spot.md` today (232 entries,
IDs F10-n). Four section authors then built sections 25 to 28 on them. Your job is to try to break the
load-bearing claims, by re-fetching the first-party page behind each and reading it yourself.

Rules: first-party sources only (AWS docs pages, which print as markdown when `.md` is appended to the address;
API references; pinned GitHub tags). Never put personal data (names, email addresses, account ids, hostnames,
home-directory paths) in any request, header, User-Agent, URL or query string; give any subagent that rule
verbatim. No AWS API calls, no SSH, no messages, no git write commands. You may write ONE file:
`research/2026-11/wave5-refutation.md`. Do not edit the registers or any section.

What to check, in this priority (aim for 60 to 80 claims, the ones the sections lean on):
1. Every claim the sections print as a number, a default, a limit, a state name, a field name or an ordering.
   Find them in `revamp/claims/aws-batch.md`, `aws-pcs.md`, `hyperpod.md`, `eks.md` (those that exist) and in the
   `Snippet` blocks and cluster-figure captions of `src/sections/AwsBatch.tsx`, `AwsPcs.tsx`, `HyperPod.tsx`,
   `Eks.tsx`.
2. Every entry listed in each register's section 10 (contradicts or sharpens register 09) and every
   recommendation attributed to AWS ("AWS recommends").
3. Spot behaviour end to end in each service: what happens at the two-minute notice, who signals what.
4. Every field name in every assembled (adapted) configuration snippet: does the field exist in the API reference
   or CRD today, with that spelling and nesting?

For each claim write one row: ID, the claim as the register states it, the URL you fetched, verdict
(CONFIRMED / WRONG / NARROWER than written / STALE / NOT FOUND on the page), and for anything not CONFIRMED the
verbatim sentence that shows it and the exact correction the section needs (file, the sentence to change, the new
wording). Write the file early and keep appending. End the file with a list "Corrections the sections need",
most serious first.

Return at most 200 words: counts per verdict, and the corrections list in short form.
