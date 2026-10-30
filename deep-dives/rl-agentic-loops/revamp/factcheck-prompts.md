# Phase 6 fact-check prompts (orchestrator working file)

Nine adversarial fact-check agents, at most three at a time. Each one owns a group of section files
for the duration of its run, writes its findings to
`deep-dives/rl-agentic-loops/reviews/factcheck/<group>.md`, applies corrections only, and scores
each file for Gate 3 (no section below 7/10, average at least 8/10).

## COMMON

You are an adversarial fact-check agent in a headless build of the "Learning From Feedback: RL and
Agentic Learning Loops" deep dive (repo root
/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/rl-build, a git worktree). Nobody will
answer questions; decide from the evidence. Do not start subagents: the job caps concurrent agents
at three. Do not commit; the orchestrator commits. Never
touch the main checkout at /Users/carlos/workspace/git_repositories/tech-deep-dives or any other
worktree.

Privacy rule: never put personal data (names, email addresses, account ids) in any request,
header, User-Agent, URL or query string. If a site demands a contact address, use a Wayback copy
or skip the source. Give this rule to any subagent you start.

Your job is to find what is wrong in the files you own, not to confirm what is right. Assume
every claim is wrong until a source you open yourself shows it right.

Read first: `CLAUDE.md` at the repo root (Writing Style, Diagram Standards, Section Shape,
Acronym Standard), `deep-dives/efa/revamp/source-authority-standard.md`,
`deep-dives/efa/revamp/section-shape-standard.md`, `deep-dives/rl-agentic-loops/revamp/authoring-brief.md`
(all of it), the "Cross-section conditions to keep consistent" block in
`deep-dives/rl-agentic-loops/revamp/build-log.md`, and each file's claims list in
`deep-dives/rl-agentic-loops/revamp/claims/<section-id>.md` (the author's own claim-to-source map:
a starting point, not evidence).

Sources and pins:
- Framework code at the pinned refs in `deep-dives/rl-agentic-loops/src/components/Cite.tsx`
  (TRL v1.16.0, TRL v1.12.0 for PPO, verl v0.9.1, OpenRLHF v0.11.2, slime v0.4.0, prime-rl v0.10.0,
  vLLM v0.28.0, DSPy 3.4.1, GEPA v0.1.4, autoresearch and HyperPod recipes at their SHAs). Read a
  file at the ref with `gh api 'repos/<owner>/<repo>/contents/<path>?ref=<ref>' --jq .content | base64 -d`
  or a shallow clone into `/tmp/rl-fc-<group>-<repo>` (`git clone --depth 1 --branch <tag>`).
  Check that the cited line range actually contains the evidence.
- Papers at the versioned arXiv link the Cite carries (abs page, HTML or PDF of that version).
  Check the venue badge against the paper's own page or the venue's proceedings.
- The research registers `deep-dives/rl-agentic-loops/research/2026-10/01-*.md` to `06-*.md` and
  the wave 2 verdict files `wave2-*.md`; a wave 2 verdict overrides the register row it names.
  `RESEARCH-GUIDE.md` section 6 holds the UNKNOWN register and its Gate 1 triage.
- Our own experiment (Tier 0): `research/2026-10/E0-spark-smoke.md` and the raw logs under
  `research/2026-10/E0-spark-smoke/run1/` and `run2/` (`steps.jsonl`, `logs.jsonl`, `summary.json`,
  `meta.json`). Every E0 number on the page must match those files.
- AWS pages, pricing pages, vendor and lab blogs may be fetched with WebFetch.

Procedure, per file:

1. List every load-bearing claim: every number, default, flag, version, venue, behaviour, and every
   "X does Y" statement about code, a paper or a service. For each, open the cited source and check
   that it says what the sentence says, at the scope the sentence gives it (model, benchmark, k,
   sample count, setting).
2. Classify each checked claim: CONFIRMED, WRONG (source says otherwise), UNSUPPORTED (the cited
   source does not carry it), OVERREACH (hedge scope widened; vendor, lab or paper number stated as
   fact; "no X exists" from "no X found"; a cross-model comparison not labelled as one; a schematic
   diagram not labelled "Illustrative, not measured"), or STALE.
3. Check cross-file consistency against the Cross-section conditions block. A file that
   contradicts it is WRONG.
4. Check the prose rules: no em-dash, en-dash ranges, curly quotes or banned vocabulary (the
   no-ai-tells gate scans whole .tsx files outside `<code>` and `<pre>`, including SVG text and
   comments); no changelog or page-history voice; first use of each niche acronym is expanded in
   the file; RL terms defined at first use in the section; attribution sits in the link, not the
   sentence, except in the four cases the Section Shape standard allows; vendor and lab figures
   stay attributed; register IDs never printed.
5. Fix corrections only: WRONG, UNSUPPORTED, OVERREACH and STALE items, and prose-rule
   violations. Fix by correcting the claim to what the source says, narrowing it, or removing it.
   Do not add features, sections, or new claims that need new sources. Do not restructure. If a
   correction touches a diagram, re-verify that diagram with the harness (below) and read both
   PNGs. Update the file's `revamp/claims/<section-id>.md` lines you corrected.
6. Score the file after your fixes, 1 to 10, against: factual accuracy at the pin, citation
   coverage for quantitative claims, Section Shape (mental model or practical value; payoff lands
   last; h2 descriptions state the payoff; strongest number landed twice), prose rules, and diagram
   quality. A score below 8 needs a one-line reason naming what holds it down.

Write `deep-dives/rl-agentic-loops/reviews/factcheck/<group>.md` as you go (first draft early, so
it survives an interruption): one table per file with columns
`# | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied`, then the
score with a two-line rationale. CONFIRMED rows may be summarised as a count per file; every
other verdict gets its own row. Any GitHub URL you write must be pinned to a tag or SHA, never
`/blob/main` or `/tree/main`.

Harness, only if you touch a diagram (never run `pnpm build`, it writes the shared `dist/`):

```bash
cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/rl-build/deep-dives/rl-agentic-loops
npx vite build --outDir /tmp/rl-dist-<slug> --emptyOutDir
node revamp/tools/shoot.mjs --dist /tmp/rl-dist-<slug> --port <port> \
     --out /tmp/rl-shots-<slug> --sections <ids>
```

Checks before you report:

```bash
cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/rl-build
pnpm --filter @tech-deep-dives/rl-agentic-loops typecheck
pnpm --filter @tech-deep-dives/rl-agentic-loops lint
pnpm --filter @tech-deep-dives/rl-agentic-loops test
bash scripts/gates/no-ai-tells.sh
bash scripts/gates/pinned-refs.sh
bash scripts/gates/svg-a11y.sh
bash scripts/gates/pre-overflow.sh
```

Return to the orchestrator only (at most 200 words): per file, the count of claims checked, the
count per non-CONFIRMED verdict, the fixes applied, the score; any item you could not resolve;
and the exact result lines of typecheck and lint.

## Groups

| group | files (under deep-dives/rl-agentic-loops/src/sections/) | section ids | slug | port |
|---|---|---|---|---|
| fc01-framing | OneLoop.tsx, GettingStarted.tsx, LanguageModelAsPolicy.tsx | one-loop,getting-started,policy | fc01 | 4601 |
| fc02-foundations | PolicyGradient.tsx, TwoLeashes.tsx, PreferencesToRewards.tsx | policy-gradient,leashes,preferences | fc02 | 4602 |
| fc03-rlvr | RlvrAndGrpo.tsx, WhatRlDoes.tsx | rlvr,what-rl-does | fc03 | 4603 |
| fc04-agentic | AgenticRl.tsx, RewardIsAProxy.tsx | agentic-rl,reward-proxy | fc04 | 4604 |
| fc05-words-a | TextLoopAsRl.tsx, VerbalReinforcement.tsx, AccumulatingExperience.tsx | text-loop,verbal,experience | fc05 | 4605 |
| fc06-words-b | PromptOptimization.tsx, YourLoops.tsx, Hybrids.tsx | prompt-opt,your-loops,hybrids | fc06 | 4606 |
| fc07-limits | WhereWordsFallShort.tsx, WeightsVsContext.tsx | words-limits,weights-context | fc07 | 4607 |
| fc08-systems-cost | RlStepAsSystem.tsx, CostPerImprovement.tsx (and src/lib/breakeven.ts, src/__tests__/breakeven.test.ts) | rl-systems,cost | fc08 | 4608 |
| fc09-lab-aws | SideBySideLab.tsx, Choosing.tsx, RlOnAws.tsx | lab,choosing,aws | fc09 | 4609 |

Sections 1 and 2 summarise the others: fc01 checks every number they repeat against the owning
section and its source.

Known items to settle in the named group (logged during authoring, see `build-log.md`):
- fc01: section 3's strongest number comes from E0 (one 0/1 reward per 124 to 164-token
  completion); Sutton and Barto section 2.9; TRL v1.12.0 `ppo_trainer.py` L786-L798 and
  `ppo_config.py` L264-L267 were checked beyond the register.
- fc02: section 4 added DeepSeekMath's 1.3B comparison (register 01, F01-71) in an expandable
  beyond its scope block: keep only if the source carries it at the stated scope. Section 5 added
  three claims beyond its block: the clip acts only when one batch feeds more than one update
  (DeepSeekMath appendix A.1.5, TRL `num_iterations`, E0 `clip_ratio/region_mean` 0.0); LoRA with
  beta above 0 loads no second model copy (TRL code); TRL's RLOO defaults beta to 0.05. Verify each
  at the pin or cut it.
- fc03: section 7: R1 v1's 71.0% was carried from wave2-rlvr row 8 without re-opening; reading
  `reinforce_pp` as REINFORCE++ is our reading; the TRL paper-index Dr. GRPO recipe omits
  `scale_rewards="none"` (stated as a doc-code conflict) and verl's default `rollout.n=1` reduces its
  GRPO advantage to the raw reward: verify both at the pins. Section 8: the Guru 32B counter-example
  (wave2-rlvr G1) was added beyond the block; Interplay's venue "ICML 2026" comes from the authors'
  README only; 8.84x is landed five times (report it, do not cut: the leverage pass owns repetition).
- fc04: section 9: Search-R1's venue "COLM 2025" comes from its v5 PDF (wave 2 said preprint);
  F02-70's "41%" conflicts with v5's 24% and was left out; check every four-field profile (Search-R1,
  ReTool, RAGEN, SWE-RL, DeepSWE, Kimi K2) against its paper, since wave 2 did not. Section 10: the
  MacDiarmid finding that a hack-detecting penalty in the reward stopped hacking sits beside the
  checklist item "monitors kept out of the reward": check the framing is fair to the source.
- fc05: section 11: TextGrad's venue "Nature 2025" is from Crossref with the quote from arXiv v1;
  the Retroformer quote is in Section 3 of v3; FunSearch's "on the order of 10^6" is in the Nature
  paper's main text, not Methods (fix any citation text that says Methods). Section 12: additions
  beyond the rows (16.3% on MBPP against 1.4% on HumanEval for self-written tests; oracle stopping
  89.7). Section 13: Dynamic Cheatsheet's text (6.7%) and its Table 2 (13.3) disagree for GPT-4o
  full history; the page does not use the figure; ACE appendix numbers 76.2 to 67.3.
- fc06: section 14: additions (gepa-artifact GRPO arm is DSPy GRPO with LoRA on all six tasks; AIME
  feedback includes the worked solution). Section 16: MTOB is "Machine Translation from One Book"
  (the benchmark's own abstract, arXiv 2309.16575); the page says "with One Book": fix. Section 15:
  the search-loop column has no "missing" mark by design.
- fc07: section 17: the Greedy Agents paper's introduction gives 64% where Figure 5 gives 58%, and
  the page states the discrepancy: check it reads as a source conflict, not page history. Section 18:
  GPT-4 calibration error 0.007 against 0.074 was read off a figure; 0.810 for fine-tuning plus
  retrieval; the GPT-4 technical report (2303.08774v6) carries no venue badge: it is a technical
  report, so `venue="preprint"` or a "technical report" wording.
- fc08: section 19: the memory drop is 23.1 and 23.9 GiB; the DeepSeekMath GRPO quote is in
  Section 4.1.1; the logged minimum importance-sampling ratio of 0.0 (run 1 steps 8 to 10, run 2
  steps 8 and 16). Section 20: the calculator's tests (26) and every preset's scope wording; it names DAPO and Dr. GRPO
  without a one-clause gloss, which readers on a shorter route need (section 2 promises glosses): add
  one per method at first mention, worded as section 7 defines them.
- fc09: section 21: every E0 figure against the raw logs. Section 22 was written before sections 20
  and 23 existed: check every pointer to them, and every repeated number, against those files; the
  OpenAI cutoff of January 6, 2027 was added beyond the rows. Section 23: the HyperPod recipe tally
  (149 GRPO recipes, 68 set `adv_estimator: grpo` directly, one uses `n: 16`), and the rank-32 LoRA
  source is the best-practices post of 08 APR 2026.

The orchestrator owns `GlossaryAndSources.tsx`, `App.tsx`, `README.md`, `sources.md`, `SCOPE.md`,
`RESEARCH-GUIDE.md`, the registers and `.gates.json`. Fact-check agents report problems in those
files rather than editing them.
