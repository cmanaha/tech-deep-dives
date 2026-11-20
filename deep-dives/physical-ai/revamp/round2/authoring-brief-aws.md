# Round 2 authoring brief: the four orchestrator sections (25 to 28)

This adds to `revamp/authoring-brief.md`, which still binds in full (reader, evidence rules, `Cite`, prose rules,
SVG contract, the check tool, what to return). Read that file first, then this one. Where they differ, this one wins.

Today is 2026-11-20. You own exactly ONE section file (named in your task), plus `revamp/claims/<section-id>.md` and
`revamp/glossary/<section-id>.json`. Edit nothing else: not `src/components/`, not the registers, not other sections,
not `App.tsx`. No git write commands. Never run `pnpm build`. No AWS API calls, no SSH, no messages. If you make a
web request, never put personal data (names, email addresses, account ids, hostnames, home-directory paths) in any
request, header, User-Agent, URL or query string; give any subagent that rule verbatim. The talk's session code
(letters C-M-P, digits 4-0-7) never appears. No dollar figures. No placeholders in these four sections.

## Why these sections exist (the owner's words, 2026-11-20)

"I need the orchestration to go deeper in AWS Batch, in PCS, in HyperPod, and in Amazon EKS. I need a far better
explanation for each of those of the individual things that go on it, so you have far more space for driving that
in each one in their own subsection." "I need also to define a bit what is the best configuration, like for example
the Spot, and I want a representation of the cluster. Like I want to see the representation that goes on the
cluster." His standing rules: every concept starts with what it is, what it looks like, when to use it and when
not, numbers after; "I don't want you to overdo things"; introduce each workload by what it does in the robot's
loop, not by profiling vocabulary (no "front end", "back end", "top-down", "retiring" in these sections).

## Read

1. `revamp/authoring-brief.md` (all), `CLAUDE.md` at the repo root (writing style, section shape, explaining
   concepts), `docs/standards/explaining-concepts.md`.
2. Your register (named in your task) from start to end: the entries, section 5 (configuration blocks, verbatim),
   section 6 (the cluster, drawn: objects and lifecycle steps with entry IDs), section 7 (recommended
   configuration), section 8 (workload fit), section 9 (what it does poorly, hand-offs), section 11 (UNKNOWNs:
   these do not ship as facts). Then the entries of `research/2026-11/09-aws-orchestration.md` it points to.
3. `src/components/Cluster.tsx` (the cluster figure you must use), `src/components/Blocks.tsx` (`Snippet`),
   `src/components/Cite.tsx`, `src/components/Figure.tsx`.
4. `src/sections/AwsOrchestration.tsx` (section 24, the overview these sections hang from; it is being reworked in
   parallel, so read it for what it already taught and do not copy its text) and `src/lib/task.ts`.
5. The fifteen workloads as section 20 names them: `src/sections/Workloads.tsx`, the `LOOP` rows near the top.

## The section, in this order (h2 blocks)

1. **What it is and the challenge it meets.** Two or three sentences a newcomer can repeat. Then when to use it
   and when not, in plain words. Name the reader's situation, for example "you have 500 independent simulation
   runs and no cluster".
2. **Its moving parts.** Every object a user creates or sees, each named and explained: what it is, what it
   holds, the two or three fields that matter, its default and its limit. One short block per object (a
   definition list or a compact table reads well). This is "the individual things that go on it": do not skim it.
3. **The cluster, drawn.** One `ClusterFigure` (see below), animated through a real sequence on the arm's work:
   jobs arrive, capacity scales from zero, jobs land on GPUs, a Spot instance gets its two-minute notice, the job
   checkpoints and requeues, replacement capacity arrives, jobs finish, capacity scales back down. Where your
   service behaves differently (no Spot, no scale to zero, a node replaced after a failed health check), draw
   what it really does and say so. Every step caption states what happens and who does it, with the fact that
   makes it true. Put the paragraph that explains the picture before it and the consequences after it.
4. **One worked case for the arm, end to end.** Named in your task. From the command or manifest the user
   submits, through each state, to the result in storage. Use the thread task from `src/lib/task.ts`.
5. **The recommended configuration.** Real, sourced configuration: Spot and On-Demand mix, allocation or
   disruption settings, retries and checkpoints, scaling to zero, storage, networking. Use `Snippet`:
   `mode="copied"` only for text that is verbatim in the register's section 5; `mode="adapted"` for a block you
   assembled from documented fields, with the `ours` prop naming exactly which names and values are this dive's
   choices. Never invent a field: every field name must appear in a register entry. State what AWS itself
   recommends in AWS's words (quoted, cited), and mark the dive's own recommendation as "our reading". One table
   "setting, value, why" is welcome. Keep snippets short enough to read: the fields that matter, not every field.
6. **What it does poorly.** Limits, gaps, sharp edges, each with its entry. Frame as how to get it right.
7. **Where it hands off.** To the other three orchestrators (sections 25 AWS Batch, 26 AWS Parallel Computing
   Service, 27 Amazon SageMaker HyperPod, 28 Amazon EKS), to section 24 (the overview, capacity markets, glue) and
   to section 29 (Choosing). End on the reader's next action.

Open the section by naming what it depends on: section 24, Orchestrating Physical AI on AWS, placed the workloads;
this section takes one scheduler apart. Do not re-teach Spot, On-Demand and Capacity Blocks beyond one clause each:
section 24 owns them. Length: 1,800 to 3,000 words of reader text. Land the section's strongest number twice.
A second small figure is welcome where a part needs one (for example job states as a track, or the vCPU gauge
between its floor and ceiling); inline SVG in your file, under the SVG contract.

## The cluster figure

```tsx
import { ClusterFigure } from '../components/Cluster';
import type { ClusterSpec, JobToken } from '../components/Cluster';

<ClusterFigure spec={SPEC} name="an evaluation sweep on Spot" cites="F10-23 F10-55 ..." caption={<>How to read it.</>} />
```

`src/sections/AwsBatch.tsx` holds a working draft spec you can study. The spec is data:

- `submit`, `queues[]`, `scheduler`, `done`: boxes on the control side. Each `label` at most 34 characters,
  each `sub` at most 38. Use your service's real object names ("Job queue", "Slurm partition", "ClusterQueue").
- `groups[]`: the capacity objects (compute environment, compute node group, instance group, NodePool). `label`
  at most 40 characters (the market tag sits at its right), each line of `sub` at most 48, `market` one of
  `spot | on-demand | reserved | static`, `gpus` per instance (0 draws a CPU-only instance, 1, 4 or 8), `places`
  (how many instance outlines the group shows: at most 4 for one-GPU instances, 2 for eight-GPU instances),
  `type` (instance type painted on each instance, at most 11 characters).
- `stores[]`: one or two shared stores (`label` at most 22 characters, `sub` at most 18). Checkpoints are drawn
  into store 0 at `pos` 0 or 1.
- `network`: one line, at most 52 characters. `jobNoun`: what one token is ("one child job", "one pod").
- `steps[]`: each has `caption` (ReactNode, one to three sentences), `scheduler` (one or two status lines, at most
  34 characters each), `instances` (a map from `"group.place"` to `'launching' | 'running' | 'notice' | 'faulty'`,
  or `{ state, type }` to paint another instance type; absent means no instance), `jobs` (every token with where
  it is: `{ submit: n }`, `{ q: queueIndex, pos: n }`, `{ g: group, i: place, gpu?: k }`, `{ done: n }`, and a
  `tone`: `waiting | running | requeued | done`), and optional `checkpoints`
  (`{ id, at: { g, i, gpu? } | { store, pos } }`).
- A token keeps its `id` across steps and glides. Use at most 8 tokens, labels of one or two characters. Queue,
  submit and done trays hold up to 8 tokens (`pos` 0 to 7). 8 to 11 steps. Every step must read as a still.
- Numbers in captions come from the entries in `cites`. Wrap an illustrative number in `<Toy>` and say so.
- Do not edit `Cluster.tsx`. If it cannot draw something your service needs, draw it in a second small SVG of
  your own and report the gap.

## Checks (run them; fix until clean)

```bash
cd deep-dives/physical-ai
pnpm typecheck && pnpm lint
(cd ../.. && bash scripts/gates/no-ai-tells.sh && bash scripts/gates/svg-a11y.sh && bash scripts/gates/pre-overflow.sh && bash scripts/gates/pinned-refs.sh)
npx vite build --outDir /tmp/pai-dist-<slug> --emptyOutDir
node revamp/tools/check-section.mjs --dist /tmp/pai-dist-<slug> --port <port> --out /tmp/pai-shots-<slug> --sections <section-id>
```

Read the PNG of every animation step at 1440 and 390 with the Read tool. The check must print `ok` for your
section at both widths. Errors in files other authors are editing are not yours.

Save a complete first draft to disk early, then refine in place: the process can stop at any moment. If you are
resumed, read your file first and continue; do not start over.

Return at most 200 words: what the reader now gets; cited entry count; figures; the check tool's last line at 1440
and 390; the last lines of typecheck and lint; any register entry you could not use or think is wrong; anything
that contradicts section 24 as written.
