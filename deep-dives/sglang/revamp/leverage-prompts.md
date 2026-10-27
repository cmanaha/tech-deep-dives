# Phase 6 leverage-pass prompts (orchestrator working file)

Seven leverage-pass agents, three at a time, run after every section has passed its fact check.
Each owns a group of section files for the duration of its run, writes its scores and change log
to `deep-dives/sglang/reviews/leverage/<group>.md`, and edits only its own files.

## COMMON

You are running the leverage pass on part of the SGLang deep dive (repo root
/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/sglang, a git worktree). Nobody will
answer questions; decide from the page and its sources. Do not commit; the orchestrator commits.
Never touch the main checkout at /Users/carlos/workspace/git_repositories/tech-deep-dives.

Privacy rule: never put personal data (names, email addresses, account ids) in any request,
header, User-Agent, URL or query string. Give this rule to any subagent you start.

Read first, in this order:
1. `deep-dives/efa/revamp/leverage-pass-standard.md`. It is the procedure. Follow it exactly,
   including "The four verbs, and the one this pass does not have", the three checks on every
   sentence you write, and the attribution rule.
2. `CLAUDE.md` at the repo root: Writing Style, Diagram Standards, Section Shape.
3. `deep-dives/efa/revamp/section-shape-standard.md`.
4. `deep-dives/sglang/revamp/authoring-brief.md`, "Section plan v2 rules" (the Against vLLM line,
   the strongest number, the term bridges) and "Prose rules".
5. For each of your files, its committed fact-check findings under
   `deep-dives/sglang/reviews/factcheck/`. The fact check corrected claims and narrowed scopes;
   the pass must not undo any of it.

Procedure, per file:

1. Score it as a reader would, one to five on each axis: mental model, practical leverage,
   rigor, accuracy, economy (the standard's "How it is measured"). Write the before-scores to
   your findings file first.
2. For every substantial block, answer the standard's three questions in one line each. Then
   apply only the four verbs: delete, reorder, demote (into an `ExpandableSection`), re-express.
   Typical moves on this dive: put the payoff before the mechanism in a block written in
   backward order; demote evidence that proves we did the work into an `ExpandableSection`;
   connect a mechanism to the counter, log line, flag or failure signature the page already
   names; strip narration attribution ("the docs say", "the code shows") where the link
   carries it, keeping the four load-bearing cases; cut repetition the section already states
   elsewhere.
3. Never trade: a sourced number, a documentation-versus-code conflict, a hedge scope ("read
   from code, not run", "our reading", "no X located during this research"), an UNKNOWN, a
   vendor or project attribution on a performance figure, the "Against vLLM" line, or the
   section's strongest number and its repetition. Keep every Cite attached to the sentence it
   can bear; when you move a sentence, its Cite moves with it.
4. If you change a diagram, verify it on the rendered output:

   ```bash
   cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/sglang/deep-dives/sglang
   npx vite build --outDir /tmp/sglang-dist-<slug> --emptyOutDir
   node revamp/tools/shoot.mjs --dist /tmp/sglang-dist-<slug> --port <port> \
        --out /tmp/sglang-shots-<slug> --sections <ids> [--tabs "<Tab label>|<Tab label>"]
   ```

   and read both PNGs of the diagram you touched. The pass may commission a diagram only when the
   section's own published facts carry it; prefer reordering and demotion.
5. Self-check: diff the claim set of the file before and after (`git diff` against HEAD). List
   every assertion in the after that is not in the before, with the source already on the page
   that carries it. Anything without one comes out.
6. Score the file again on the five axes. Accuracy must stay at five; a pass that lowers it
   fails, so revert that change.

Write `deep-dives/sglang/reviews/leverage/<group>.md` as you go (before-scores first, so a stop
loses little): per file, the before and after scores, a short list of moves (verb, block, why),
and the claim-diff list from step 5.

Checks before you report:

```bash
cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/sglang
pnpm --filter @tech-deep-dives/sglang typecheck
pnpm --filter @tech-deep-dives/sglang lint
bash scripts/gates/no-ai-tells.sh
bash scripts/gates/pinned-refs.sh
bash scripts/gates/svg-a11y.sh
```

Return to the orchestrator only (at most 200 words): per file, before and after scores on the
five axes, the main moves, the claim-diff count, and the exact result lines of typecheck and lint.

## Groups

| group | files (under deep-dives/sglang/src/sections/) | section ids | slug | port |
|---|---|---|---|---|
| lv01 | ThesisAndFraming.tsx, GettingStarted.tsx, RuntimeProcesses.tsx, Scheduler.tsx | thesis,getting-started,runtime,scheduler | lv01 | 4491 |
| lv02 | RadixCache.tsx, KvMemory.tsx, HiCache.tsx, AttentionBackends.tsx | radix,kv-memory,hicache,kernels | lv02 | 4492 |
| lv03 | Quantization.tsx, StructuredOutput.tsx, SpeculativeDecoding.tsx, ApiSurfaces.tsx | quant,structured,spec-decode,apis | lv03 | 4493 |
| lv04 | RlRollout.tsx, Parallelism.tsx, PdDisaggregation.tsx, WideExpertParallelism.tsx | rl,parallelism,pd,wide-ep | lv04 | 4494 |
| lv05 | ModelGateway.tsx, MultiNodeKubernetes.tsx, AwsManagedPaths.tsx, AwsSelfManagedPaths.tsx | gateway,multinode,aws-managed,aws-self-managed | lv05 | 4495 |
| lv06 | Ec2Instances.tsx, PdWideEpOverEfa.tsx, SglangVsVllm.tsx, EcosystemUsers.tsx | ec2,efa,vs-vllm,ecosystem | lv06 | 4496 |
| lv07 | Operations.tsx, DecisionGuide.tsx, InsideCodebase.tsx and codebase/*.tsx | ops,decision,codebase | lv07 | 4497 |

Sections 1 and 2 summarise the others; lv01 keeps their claims in agreement with the owners.
Section 27's tabs are reference material: the pass there is mostly economy and the reading-path
order, not new leverage.

The orchestrator owns `GlossaryAndSources.tsx`, `App.tsx`, `README.md`, `sources.md` and
`.gates.json`. Leverage agents report problems in those files rather than editing them.
