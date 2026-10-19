# Phase 6 fact-check prompts (orchestrator working file)

Twelve adversarial fact-check agents, three at a time. Each one owns a group of section files
for the duration of its run, writes its findings to
`deep-dives/vllm/research/2026-10-refresh/factcheck/<group>.md`, applies corrections only,
and scores each file for Gate 3.

## COMMON

You are an adversarial fact-check agent in a headless revamp of the vLLM deep dive (repo root
/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/vllm). Nobody will answer questions;
decide from the evidence. Background mode and subagents are allowed; read a background task's
result before you report on it. Do not commit; the orchestrator commits.

Your job is to find what is wrong in the files you own, not to confirm what is right. Assume
every claim is wrong until a source you open yourself shows it right.

Read first: `CLAUDE.md` at the repo root (Writing Style, Diagram Standards, Section Shape,
Acronym Standard), `deep-dives/efa/revamp/source-authority-standard.md`,
`deep-dives/efa/revamp/section-shape-standard.md`, and the "Cross-file facts every author uses
the same way" block in `deep-dives/vllm/revamp/REVAMP-PLAN.md`.

The pin is vLLM v0.31.0, commit db9527a46873454610df6dbedf79a36d6bf1a7f6, checked out at
`/tmp/vllm-new` (docs under `/tmp/vllm-new/docs`). Release notes are in
`/tmp/vllm-release-notes/`. External pages (AWS docs, Ray, llm-d, Dynamo, vendor blogs) may be
fetched with WebFetch.

Procedure, per file:

1. List every load-bearing claim: every number, default, flag, version, behaviour, and every
   "X does Y" statement about code. For each, open the cited source (the `Cite` href resolves
   to a file and line range at v0.31.0, or to a versioned doc page) and check that it says what
   the sentence says. Check the line range actually contains the evidence.
2. Classify each checked claim: CONFIRMED, WRONG (source says otherwise), UNSUPPORTED (the
   cited source does not carry it), OVERREACH (hedge scope widened, vendor number stated as
   fact, "no X exists" from "no X found"), or STALE.
3. Check cross-file consistency against the Cross-file facts block. A file that contradicts it
   is WRONG.
4. Check the prose rules: no em-dash, en-dash ranges, curly quotes or banned vocabulary (the
   no-ai-tells gate also scans SVG <title> text and URL strings); no changelog or page-history
   voice ("previously", "no longer", "an earlier version", "was not checked for this page");
   first use of each niche acronym is expanded; attribution sits in the link, not the sentence,
   except in the four cases the Section Shape standard allows.
5. Fix corrections only: WRONG, UNSUPPORTED, OVERREACH and STALE items, and prose-rule
   violations. Fix by correcting the claim to what the source says, narrowing it, or removing
   it. Do not add features, sections, or new claims that need new sources. Do not restructure.
   If a correction touches a diagram, re-verify that diagram with the harness (below) and read
   both PNGs.
6. Score the file after your fixes, 1 to 10, against: factual accuracy at the pin, citation
   coverage for quantitative claims, Section Shape (mental model or practical value; payoff
   lands last; h2 descriptions state the payoff), prose rules, and diagram quality. A score
   below 7 needs a one-line reason naming what still holds it down.

Write `deep-dives/vllm/research/2026-10-refresh/factcheck/<group>.md` as you go (first draft
early, so it survives an interruption): one table per file with columns
`# | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied`, then the
score with a two-line rationale. CONFIRMED rows may be summarised as a count per file; every
other verdict gets its own row. Any GitHub URL you write must be pinned to a tag or SHA, never
`/blob/main` or `/tree/main`.

Harness, only if you touch a diagram:

```bash
cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/vllm/deep-dives/vllm
npx vite build --outDir /tmp/vllm-dist-<slug> --emptyOutDir
node /tmp/vllm-shoot.mjs --dist /tmp/vllm-dist-<slug> --port <port> --out /tmp/vllm-shots-<slug> --sections <ids>
```

Checks before you report:

```bash
cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/vllm
pnpm --filter @tech-deep-dives/vllm typecheck
pnpm --filter @tech-deep-dives/vllm lint
```

Return to the orchestrator only (at most 200 words): per file, the count of claims checked,
the count per non-CONFIRMED verdict, the fixes applied, the score; any item you could not
resolve; and the exact result lines of typecheck and lint.

## Groups

| group | files (under deep-dives/vllm/src/sections/) | section ids | slug | port |
|---|---|---|---|---|
| fc01-framing | ThesisAndFraming.tsx, InferenceWorkload.tsx, V1Architecture.tsx | thesis,workload,v1-arch | fc01 | 4871 |
| fc02-memory | SchedulerBatching.tsx, PagedAttentionKV.tsx, PrefixCaching.tsx | scheduler,paged,prefix | fc02 | 4872 |
| fc03-offload-quant | KVOffloadingLMCache.tsx, Quantization.tsx | offload,quant | fc03 | 4873 |
| fc04-dist-disagg | DistributedInference.tsx, DisaggregatedServing.tsx | distributed,disagg | fc04 | 4874 |
| fc05-features | SpeculativeDecoding.tsx, OpenAICompatServer.tsx, LoRAServing.tsx | spec-decode,server,lora | fc05 | 4875 |
| fc06-code-a | codebase/CodebaseArchitecture.tsx, codebase/CodebaseConfig.tsx, codebase/CodebaseScheduler.tsx, InsideCodebase.tsx | codebase | fc06 | 4876 |
| fc07-code-b | codebase/CodebaseExecution.tsx, codebase/CodebaseModelLayer.tsx | codebase | fc07 | 4877 |
| fc08-code-c | codebase/CodebaseDistributed.tsx, codebase/CodebaseAdvanced.tsx, codebase/CodebaseRust.tsx | codebase | fc08 | 4878 |
| fc09-k8s | RayServeLLM.tsx, ProductionStack.tsx, LlmdKServe.tsx | ray,prod-stack,llm-d | fc09 | 4879 |
| fc10-eco | NvidiaDynamo.tsx, GatewaysAppLayer.tsx, ObservabilityBench.tsx | dynamo,gateways,observability | fc10 | 4880 |
| fc11-aws-a | AwsNeuron.tsx, AwsGpuEfaNixl.tsx, Ec2TopologyPlacement.tsx | neuron,gpu-efa,topology | fc11 | 4881 |
| fc12-aws-b | AwsEks.tsx, AwsSageMakerBedrock.tsx | eks,sagemaker | fc12 | 4882 |
| fc13-decide | WhenNotVllm.tsx, OperationsFailureModes.tsx, DecisionGuide.tsx | alternatives,ops,decision | fc13 | 4883 |

For the codebase tabs, pass `--tabs` prefixes to the harness (for example
`--tabs "Architecture"`); the harness splits `--tabs` on commas.

The orchestrator owns `GlossaryAndSources.tsx`, `App.tsx`, `README.md`, `sources.md` and
`.gates.json`. Fact-check agents report problems in those files rather than editing them.
