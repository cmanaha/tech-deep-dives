# Phase 6 fact-check prompts (orchestrator working file)

Fifteen adversarial fact-check agents, three at a time. Each one owns a group of section files
for the duration of its run, writes its findings to
`deep-dives/sglang/reviews/factcheck/<group>.md`, applies corrections only, and scores each file
for Gate 3 (no section below 7/10, average at least 8/10).

## COMMON

You are an adversarial fact-check agent in a headless build of the SGLang deep dive (repo root
/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/sglang, a git worktree). Nobody will
answer questions; decide from the evidence. Background mode and subagents are allowed; read a
background task's result before you report on it. Do not commit; the orchestrator commits. Never
touch the main checkout at /Users/carlos/workspace/git_repositories/tech-deep-dives.

Privacy rule: never put personal data (names, email addresses, account ids) in any request,
header, User-Agent, URL or query string. If a site demands a contact address, use a Wayback copy
or skip the source. Give this rule to any subagent you start.

Your job is to find what is wrong in the files you own, not to confirm what is right. Assume
every claim is wrong until a source you open yourself shows it right.

Read first: `CLAUDE.md` at the repo root (Writing Style, Diagram Standards, Section Shape,
Acronym Standard), `deep-dives/efa/revamp/source-authority-standard.md`,
`deep-dives/efa/revamp/section-shape-standard.md`, `deep-dives/sglang/revamp/authoring-brief.md`
(Citations, Prose rules, Section plan v2 rules, Diagrams), and the "Cross-section conditions to
keep consistent" block in `deep-dives/sglang/revamp/build-log.md`.

The pin is SGLang v0.5.22, commit baa9befa381511cd4d56f83980951e5a45fffc6d, checked out
read-only at `/tmp/sglang-src` (docs source under `/tmp/sglang-src/docs/docs`). The vLLM
comparison baseline is v0.31.0; if `/tmp/vllm-new` is missing, read vLLM files at the tag through
`gh api repos/vllm-project/vllm/contents/<path>?ref=v0.31.0`. The research registers are in
`deep-dives/sglang/research/2026-10/`; their "Errata" blocks override rows. External pages (AWS
docs, vendor blogs, papers) may be fetched with WebFetch.

Procedure, per file:

1. List every load-bearing claim: every number, default, flag, version, behaviour, and every
   "X does Y" statement about code. For each, open the cited source (the `Cite` href resolves to
   a file and line range at v0.5.22, or to a versioned doc page) and check that it says what the
   sentence says. Check the line range actually contains the evidence.
2. Classify each checked claim: CONFIRMED, WRONG (source says otherwise), UNSUPPORTED (the cited
   source does not carry it), OVERREACH (hedge scope widened, vendor or project number stated as
   fact, "no X exists" from "no X found"), or STALE.
3. Check cross-file consistency against the Cross-section conditions block. A file that
   contradicts it is WRONG.
4. Check the prose rules: no em-dash, en-dash ranges, curly quotes or banned vocabulary (the
   no-ai-tells gate scans whole .tsx files outside `<code>` and `<pre>`, including SVG text and
   comments); no changelog or page-history voice ("previously", "no longer", "an earlier
   version", "now", "recently" as page history); first use of each niche acronym is expanded;
   attribution sits in the link, not the sentence, except in the four cases the Section Shape
   standard allows; vendor and project figures stay attributed.
5. Fix corrections only: WRONG, UNSUPPORTED, OVERREACH and STALE items, and prose-rule
   violations. Fix by correcting the claim to what the source says, narrowing it, or removing it.
   Do not add features, sections, or new claims that need new sources. Do not restructure. If a
   correction touches a diagram, re-verify that diagram with the harness (below) and read both
   PNGs.
6. Score the file after your fixes, 1 to 10, against: factual accuracy at the pin, citation
   coverage for quantitative claims, Section Shape (mental model or practical value; payoff lands
   last; h2 descriptions state the payoff), prose rules, and diagram quality. A score below 8
   needs a one-line reason naming what holds it down.

Write `deep-dives/sglang/reviews/factcheck/<group>.md` as you go (first draft early, so it
survives an interruption): one table per file with columns
`# | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied`, then the
score with a two-line rationale. CONFIRMED rows may be summarised as a count per file; every
other verdict gets its own row. Any GitHub URL you write must be pinned to a tag or SHA, never
`/blob/main` or `/tree/main`.

Harness, only if you touch a diagram (never run `pnpm build`, it writes the shared `dist/`):

```bash
cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/sglang/deep-dives/sglang
npx vite build --outDir /tmp/sglang-dist-<slug> --emptyOutDir
node revamp/tools/shoot.mjs --dist /tmp/sglang-dist-<slug> --port <port> \
     --out /tmp/sglang-shots-<slug> --sections <ids> [--tabs "<Tab label>|<Tab label>"]
```

Checks before you report:

```bash
cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/sglang
pnpm --filter @tech-deep-dives/sglang typecheck
pnpm --filter @tech-deep-dives/sglang lint
bash scripts/gates/no-ai-tells.sh
bash scripts/gates/pinned-refs.sh
bash scripts/gates/svg-a11y.sh
```

Return to the orchestrator only (at most 200 words): per file, the count of claims checked, the
count per non-CONFIRMED verdict, the fixes applied, the score; any item you could not resolve;
and the exact result lines of typecheck and lint.

## Groups

| group | files (under deep-dives/sglang/src/sections/) | section ids | slug | port |
|---|---|---|---|---|
| fc01-framing | ThesisAndFraming.tsx, GettingStarted.tsx, RuntimeProcesses.tsx | thesis,getting-started,runtime | fc01 | 4471 |
| fc02-sched-radix | Scheduler.tsx, RadixCache.tsx | scheduler,radix | fc02 | 4472 |
| fc03-memory | KvMemory.tsx, HiCache.tsx | kv-memory,hicache | fc03 | 4473 |
| fc04-kernels | AttentionBackends.tsx, Quantization.tsx | kernels,quant | fc04 | 4474 |
| fc05-features | StructuredOutput.tsx, SpeculativeDecoding.tsx | structured,spec-decode | fc05 | 4475 |
| fc06-apis-rl | ApiSurfaces.tsx, RlRollout.tsx | apis,rl | fc06 | 4476 |
| fc07-par-pd | Parallelism.tsx, PdDisaggregation.tsx | parallelism,pd | fc07 | 4477 |
| fc08-ep-gateway | WideExpertParallelism.tsx, ModelGateway.tsx | wide-ep,gateway | fc08 | 4478 |
| fc09-k8s-sm | MultiNodeKubernetes.tsx, AwsManagedPaths.tsx | multinode,aws-managed | fc09 | 4479 |
| fc10-eks-ec2 | AwsSelfManagedPaths.tsx, Ec2Instances.tsx | aws-self-managed,ec2 | fc10 | 4480 |
| fc11-efa-eco | PdWideEpOverEfa.tsx, EcosystemUsers.tsx | efa,ecosystem | fc11 | 4481 |
| fc12-vs-vllm | SglangVsVllm.tsx | vs-vllm | fc12 | 4482 |
| fc13-ops-decide | Operations.tsx, DecisionGuide.tsx | ops,decision | fc13 | 4483 |
| fc14-code-a | InsideCodebase.tsx, codebase/CodebaseArchitecture.tsx, codebase/CodebaseScheduler.tsx, codebase/CodebaseRadixMemory.tsx | codebase | fc14 | 4484 |
| fc15-code-b | codebase/CodebaseExecution.tsx, codebase/CodebaseParallelPd.tsx, codebase/CodebaseRust.tsx | codebase | fc15 | 4485 |

For the codebase tabs, pass `--tabs` with the tab labels separated by `|` (labels: "Launch Path &
Argument Resolution", "Scheduler & Batching", "Radix Cache & Memory Pools", "Model Execution &
Attention", "Parallelism, MoE & PD", "Gateway & Rust Frontend").

Known items to settle in the named group (logged during authoring):
- fc10: the claim that every EC2 size listed supports EFA, including p5.4xlarge; the EFA-GDA
  expansion "Elastic Fabric Adapter GPU Direct Async".
- fc09: the documented prefill Service exposes only port 30000 while decode contacts it on 8998
  for bootstrap (stated as our reading of the manifests, not run).
- fc06 and fc13: the `/server_info` key exposure must read as a code reading (not run), with the
  route, the auth level and the redaction lines cited; section 12 holds the key matrix.

The orchestrator owns `GlossaryAndSources.tsx`, `App.tsx`, `README.md`, `sources.md` and
`.gates.json`. Fact-check agents report problems in those files rather than editing them.
