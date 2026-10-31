# Phase 6 leverage-pass prompts (orchestrator working file)

Six leverage-pass agents, at most three at a time, run after every section has passed its fact
check. Each owns a group of section files for the duration of its run, writes its scores and change
log to `deep-dives/rl-agentic-loops/reviews/leverage/<group>.md`, and edits only its own files.

## COMMON

You are running the leverage pass on part of the "Learning From Feedback: RL and Agentic Learning
Loops" deep dive (repo root /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/rl-build, a
git worktree). Nobody will answer questions; decide from the page and its sources. Do not start
subagents: the job caps concurrent agents at three. Do not commit;
the orchestrator commits. Never touch the main checkout at
/Users/carlos/workspace/git_repositories/tech-deep-dives or any other worktree.

Privacy rule: never put personal data (names, email addresses, account ids) in any request,
header, User-Agent, URL or query string. Give this rule to any subagent you start.

Read first, in this order:
1. `deep-dives/efa/revamp/leverage-pass-standard.md`. It is the procedure. Follow it exactly,
   including "The four verbs, and the one this pass does not have", the three checks on every
   sentence you write, and the attribution rule.
2. `CLAUDE.md` at the repo root: Writing Style, Diagram Standards, Section Shape.
3. `deep-dives/efa/revamp/section-shape-standard.md`.
4. `deep-dives/rl-agentic-loops/revamp/authoring-brief.md`, "What the reader must get", "Evidence
   markers" and "Prose rules".
5. The "Cross-section conditions to keep consistent" block in
   `deep-dives/rl-agentic-loops/revamp/build-log.md`.
6. For each of your files, its committed fact-check findings under
   `deep-dives/rl-agentic-loops/reviews/factcheck/`. The fact check corrected claims and narrowed
   scopes; the pass must not undo any of it.

Procedure, per file:

1. Score it as a reader would, one to five on each axis: mental model, practical leverage,
   rigor, accuracy, economy (the standard's "How it is measured"). Write the before-scores to
   your findings file first.
2. For every substantial block, answer the standard's three questions in one line each. Then
   apply only the four verbs: delete, reorder, demote (into an `ExpandableSection`), re-express.
   Typical moves on this dive: put the payoff before the mechanism in a block written in
   backward order; demote evidence that proves we did the work into an `ExpandableSection`;
   connect a mechanism to the config field, log metric or failure signature the page already
   names (TRL's `frac_reward_zero_std`, `clip_ratio`, `sampling/importance_sampling_ratio`);
   strip narration attribution ("the paper shows", "the code says") where the link carries it,
   keeping the four load-bearing cases; cut repetition the section already states elsewhere.
3. Never trade: a sourced number, a documentation-versus-code conflict, a hedge scope ("our
   reading", "in their runs", "not located in this research"), an UNKNOWN hedge, a vendor or lab
   attribution on a performance figure, a cross-model label, an "Illustrative, not measured"
   caption, a venue or preprint badge, or the section's strongest number and its repetition. Keep
   every Cite attached to the sentence it can bear; when you move a sentence, its Cite moves with
   it.
4. If you change a diagram, verify it on the rendered output:

   ```bash
   cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/rl-build/deep-dives/rl-agentic-loops
   npx vite build --outDir /tmp/rl-dist-<slug> --emptyOutDir
   node revamp/tools/shoot.mjs --dist /tmp/rl-dist-<slug> --port <port> \
        --out /tmp/rl-shots-<slug> --sections <ids>
   ```

   and read both PNGs of the diagram you touched. The pass may commission a diagram only when the
   section's own published facts carry it; prefer reordering and demotion.
5. Self-check: diff the claim set of the file before and after (`git diff` against HEAD). List
   every assertion in the after that is not in the before, with the source already on the page
   that carries it. Anything without one comes out.
6. Score the file again on the five axes. Accuracy must stay at five; a pass that lowers it
   fails, so revert that change.

Write `deep-dives/rl-agentic-loops/reviews/leverage/<group>.md` as you go (before-scores first, so
a stop loses little): per file, the before and after scores, a short list of moves (verb, block,
why), and the claim-diff list from step 5.

Checks before you report:

```bash
cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/rl-build
pnpm --filter @tech-deep-dives/rl-agentic-loops typecheck
pnpm --filter @tech-deep-dives/rl-agentic-loops lint
bash scripts/gates/no-ai-tells.sh
bash scripts/gates/pinned-refs.sh
bash scripts/gates/svg-a11y.sh
bash scripts/gates/pre-overflow.sh
```

Return to the orchestrator only (at most 200 words): per file, before and after scores on the
five axes, the main moves, the claim-diff count, and the exact result lines of typecheck and lint.

## Groups

| group | files (under deep-dives/rl-agentic-loops/src/sections/) | section ids | slug | port |
|---|---|---|---|---|
| lv01 | OneLoop.tsx, GettingStarted.tsx, LanguageModelAsPolicy.tsx, PolicyGradient.tsx | one-loop,getting-started,policy,policy-gradient | lv01 | 4701 |
| lv02 | TwoLeashes.tsx, PreferencesToRewards.tsx, RlvrAndGrpo.tsx, WhatRlDoes.tsx | leashes,preferences,rlvr,what-rl-does | lv02 | 4702 |
| lv03 | AgenticRl.tsx, RewardIsAProxy.tsx, TextLoopAsRl.tsx, VerbalReinforcement.tsx | agentic-rl,reward-proxy,text-loop,verbal | lv03 | 4703 |
| lv04 | AccumulatingExperience.tsx, PromptOptimization.tsx, YourLoops.tsx, Hybrids.tsx | experience,prompt-opt,your-loops,hybrids | lv04 | 4704 |
| lv05 | WhereWordsFallShort.tsx, WeightsVsContext.tsx, RlStepAsSystem.tsx, CostPerImprovement.tsx | words-limits,weights-context,rl-systems,cost | lv05 | 4705 |
| lv06 | SideBySideLab.tsx, Choosing.tsx, RlOnAws.tsx | lab,choosing,aws | lv06 | 4706 |

Sections 1 and 2 summarise the others; lv01 keeps their claims in agreement with the owners.

The orchestrator owns `GlossaryAndSources.tsx`, `App.tsx`, `README.md`, `sources.md`, `SCOPE.md`,
`RESEARCH-GUIDE.md`, the registers and `.gates.json`. Leverage agents report problems in those
files rather than editing them.
