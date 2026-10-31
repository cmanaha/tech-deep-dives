# Phase 6 fact-check and leverage prompts (orchestrator working file)

Eleven review agents, at most three at a time. Each owns a group of section files for the
duration of its run and does two passes in order: an adversarial fact check (corrections only,
Gate 3 score), then the leverage pass (the four verbs, never trading a corrected fact). Findings go
to `deep-dives/llm-training-systems/reviews/factcheck/<group>.md` and
`deep-dives/llm-training-systems/reviews/leverage/<group>.md`.

## COMMON

You are an adversarial reviewer in a headless build of the "Training at Scale: How Large Language
Models Are Trained, and How to Run It on AWS" deep dive (repo root
/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/training, a git worktree). Nobody will
answer questions; decide from the evidence. Do not start subagents: the job caps concurrent agents
at three. Do not commit; the orchestrator commits. Never touch the main checkout at
/Users/carlos/workspace/git_repositories/tech-deep-dives or any other worktree. Today is 2026-10-31.

Privacy rule: never put personal data (names, email addresses, account ids) in any request,
header, User-Agent, URL or query string. If a site demands a contact address, use a Wayback copy
or skip the source.

### Pass 1: fact check

Your job is to find what is wrong in the files you own, not to confirm what is right. Assume
every claim is wrong until a source you open yourself shows it right.

Read first: `CLAUDE.md` at the repo root (Writing Style, Diagram Standards, Section Shape, Acronym
Standard), `deep-dives/efa/revamp/source-authority-standard.md`,
`deep-dives/efa/revamp/section-shape-standard.md`,
`deep-dives/llm-training-systems/revamp/authoring-brief.md` (all of it), the "Cross-section
conditions to keep consistent" block in `deep-dives/llm-training-systems/revamp/build-log.md`, and
each file's claims list in `deep-dives/llm-training-systems/revamp/claims/<section-id>.md` (the
author's own claim-to-source map: a starting point, not evidence).

Sources and pins:
- Framework code at the pinned refs in `deep-dives/llm-training-systems/src/components/Cite.tsx`
  (PyTorch v2.15.0, TorchTitan v0.4.0, Megatron Core core_v0.20.0, DeepSpeed v0.19.9, TorchTitan
  Neuron release-2.33.0 and the rest). Read a file at the ref with
  `gh api 'repos/<owner>/<repo>/contents/<path>?ref=<ref>' --jq .content | base64 -d` or a shallow
  clone into `/tmp/lts-fc-<group>-<repo>` (`git clone --depth 1 --branch <tag>`). Check that the
  cited line range actually contains the evidence.
- Papers at the versioned arXiv link the Cite carries. Check the venue badge against the paper's
  own page or the venue's proceedings.
- The research registers `deep-dives/llm-training-systems/research/2026-10/01-*.md` to `07-*.md`
  and the wave 2 verdict files `wave2-*.md`; a wave 2 verdict overrides the register row it names.
  `RESEARCH-GUIDE.md` section 6 holds the UNKNOWN register with each item's 2026-10-31 result.
- Our own experiments (Tier 0): `research/2026-10/E1-*.md` to `E4-*.md` and the raw JSON in
  `research/2026-10/spark-raw/`. Every Tier 0 number on the page must match those files, with their
  hardware caveat (one GB10, unified memory).
- AWS pages, pricing pages, NVIDIA pages and lab blogs may be fetched with WebFetch.

Procedure, per file:

1. List every load-bearing claim: every number, default, flag, version, venue, price, date,
   behaviour, and every "X does Y" statement about code, a paper or a service. For each, open the
   cited source and check that it says what the sentence says, at the scope the sentence gives it.
   Recompute every derived number from its stated inputs.
2. Classify: CONFIRMED, WRONG, UNSUPPORTED (the cited source does not carry it), OVERREACH (hedge
   scope widened; vendor figure stated as fact; "no X exists" from "no X found"; a protocol's
   prediction presented as a result; a schematic not labelled "Illustrative, not measured"), or
   STALE.
3. Check cross-file consistency against the Cross-section conditions block and the calculators in
   `src/lib/` (a section that prints a number its calculator computes differently is WRONG).
4. Check the prose rules: no em-dash, en-dash ranges, curly quotes or banned vocabulary (the
   no-ai-tells gate scans whole .tsx files outside `<code>` and `<pre>`); no changelog voice;
   first use of each niche acronym expanded in the file; training terms defined at first use;
   attribution in the link, not the sentence, except the four cases the Section Shape standard
   allows; register IDs never printed.
5. Fix corrections only: WRONG, UNSUPPORTED, OVERREACH and STALE items, and prose-rule violations.
   Correct the claim to what the source says, narrow it, or remove it. No new features, no new
   claims that need new sources, no restructuring in this pass. Update the file's
   `revamp/claims/<section-id>.md` lines you corrected.
6. Score the file after your fixes, 1 to 10, against: factual accuracy at the pin, citation
   coverage for quantitative claims, Section Shape, prose rules, diagram quality. A score below 8
   needs a one-line reason.

Write `reviews/factcheck/<group>.md` as you go: one table per file with columns
`# | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied`, then the score
with a two-line rationale. CONFIRMED rows may be a count per file. Any GitHub URL you write must be
pinned to a tag or SHA.

### Pass 2: leverage

Read `deep-dives/efa/revamp/leverage-pass-standard.md` and follow it exactly. Per file: score it one
to five on mental model, practical leverage, rigor, accuracy, economy (write the before-scores to
`reviews/leverage/<group>.md` first); answer the standard's three questions per substantial block;
apply only the four verbs (delete, reorder, demote into an `ExpandableSection`, re-express). Never
trade a sourced number, a documentation-versus-code conflict, a hedge scope, an UNKNOWN hedge, a
vendor attribution, an "Illustrative, not measured" caption, a venue badge, a "not yet run"
protocol label, or the section's strongest number and its repetition. Keep every Cite with its
sentence. Diff the claim set before and after (`git diff` against HEAD); anything new without a
source already on the page comes out. Score again; accuracy must stay at five.

### Harness (if you touch a diagram or a table; never run `pnpm build`)

```bash
cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/training/deep-dives/llm-training-systems
npx vite build --outDir /tmp/lts-dist-<slug> --emptyOutDir
node revamp/tools/shoot.mjs --dist /tmp/lts-dist-<slug> --port <port> \
     --out /tmp/lts-shots-<slug> --sections <ids>
```

Read both PNGs (1440 and 390) of every diagram you touched. The harness also reports tables and
diagrams wider than their container; fix any it reports in your files.

### Checks before you report

```bash
cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/training
pnpm --filter @tech-deep-dives/llm-training-systems typecheck
pnpm --filter @tech-deep-dives/llm-training-systems lint
pnpm --filter @tech-deep-dives/llm-training-systems test
bash scripts/gates/no-ai-tells.sh && bash scripts/gates/pinned-refs.sh && bash scripts/gates/svg-a11y.sh && bash scripts/gates/pre-overflow.sh
```

Return to the orchestrator only (at most 200 words): per file, claims checked, count per
non-CONFIRMED verdict, the Gate 3 score, the leverage before and after scores, the harness result,
anything you could not resolve, and the exact result lines of typecheck, lint and test.

The orchestrator owns `GlossaryAndSources.tsx`, `App.tsx`, `README.md`, `sources.md`, `SCOPE.md`,
`RESEARCH-GUIDE.md`, `src/lib/`, the registers and `.gates.json`. Report problems in those files
rather than editing them.

## Groups

| group | files (under src/sections/) | section ids | slug | port |
|---|---|---|---|---|
| fc01-framing | ThreeBudgets.tsx, GettingStarted.tsx, TrainingStep.tsx | three-budgets,getting-started,step | fc01 | 4701 |
| fc02-arithmetic | Arithmetic.tsx, MemoryBudget.tsx, Precision.tsx | arithmetic,memory,precision | fc02 | 4702 |
| fc03-collectives-dp | Collectives.tsx, DataParallel.tsx, TensorParallel.tsx | collectives,data-parallel,tensor-parallel | fc03 | 4703 |
| fc04-pp-cp-ep | PipelineParallel.tsx, ContextParallel.tsx, ExpertParallel.tsx | pipeline,context-parallel,expert-parallel | fc04 | 4704 |
| fc05-layouts | ComposingLayouts.tsx, SetMyRanks.tsx | composing,set-my-ranks | fc05 | 4705 |
| fc06-frameworks | FrameworkMap.tsx, FineTuning.tsx, Trainium.tsx | frameworks,fine-tuning,trainium | fc06 | 4706 |
| fc07-reliability | FailureRates.tsx, Checkpointing.tsx, Resuming.tsx | failures,checkpointing,resuming | fc07 | 4707 |
| fc08-aws-a | AwsOwnership.tsx, AwsHardware.tsx, CapacityCost.tsx | aws-ownership,aws-hardware,capacity-cost | fc08 | 4708 |
| fc09-aws-b | Storage.tsx, SlurmFamily.tsx, KubernetesFamily.tsx | storage,slurm,kubernetes | fc09 | 4709 |
| fc10-aws-c | TrainingJobs.tsx, ChoosingPath.tsx | training-jobs,choosing | fc10 | 4710 |
| fc11-measure | WhatToMeasure.tsx, Telemetry.tsx, BringUp.tsx | measure,telemetry,bring-up | fc11 | 4711 |

Sections 1 and 2 summarise the others: fc01 checks every number they repeat against the owning
section and its source. Known items to settle per group are appended below by the orchestrator
from the authors' reports.
