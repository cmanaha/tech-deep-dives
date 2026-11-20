# Round 2 research brief (shared by the three AWS research agents)

Research date and accessed date for every source: **2026-11-20**. Today is 20 November 2026.

Dive: `deep-dives/physical-ai/` in this git worktree. You own exactly ONE new file, named in your task, under
`deep-dives/physical-ai/research/2026-11/`. Edit nothing else. No git write commands. Never call AWS APIs
(no `aws` CLI calls against an account), never SSH anywhere, never send messages.

**Personal data rule (give it verbatim to any subagent you start):** never put personal data (names, email
addresses, account ids, hostnames, home-directory paths) in any request, header, User-Agent, URL or query string.
If a site asks automated clients for contact details, use a generic client name and no address, or use another
source.

The talk this dive grew from has a session code (letters C-M-P and digits 4-0-7). It never appears in your file.
No dollar figures in your file: where a page prints a price, say that it prints one and do not copy the value.

## Why this research exists

The owner read the published dive and said the AWS part must go far deeper: "I need the orchestration to go deeper
in AWS Batch, in PCS, in HyperPod, and in Amazon EKS. I need a far better explanation for each of those of the
individual things that go on it." "I need also to define a bit what is the best configuration, like for example the
Spot, and I want a representation of the cluster." Each orchestrator gets its own section, built in this order:
what it is and the challenge it meets; its moving parts, each named and explained; a drawn, animated representation
of the cluster (queue, scheduler, node groups, instances, GPUs, jobs, storage, network; jobs arrive, capacity scales
from zero, a Spot instance gets its two-minute notice, the job checkpoints and requeues, capacity scales down); one
worked case end to end for a robot arm's workloads; the recommended configuration with real, sourced configuration
snippets (Spot and On-Demand mixes, allocation or disruption settings, retries and checkpoints, scaling to zero,
storage, networking); what it does poorly; where it hands off to the others.

So the register must hold, for your service(s): (a) a precise definition of every object a user creates or sees,
with its key fields, defaults and limits; (b) the exact lifecycle and timing facts the animation needs (states a
job passes through, what triggers scale-up and scale-down, what happens on a Spot interruption, in what order);
(c) verbatim configuration (JSON, YAML, CLI, Slurm conf) from first-party pages, enough to assemble a recommended
configuration without inventing a field; (d) what AWS recommends, in AWS's words; (e) limits and what it does
poorly; (f) the newest 2026 features with dates.

## Source rules

- First-party only, fetched today. AWS documentation (docs.aws.amazon.com: append `.md` to a page address to get
  its markdown form, which prints code blocks verbatim; or download with `curl -sL` and read the text), API
  references, AWS What's New, AWS blogs, the service's GitHub repositories at a pinned tag or 40-character SHA,
  Kubernetes project docs at a pinned tag, NVIDIA docs. Nothing from memory. Nothing older than 2025 unless it is
  still the current documentation page (a docs page has no age: it states current behaviour) or labelled history.
- Find the newest version or announcement of everything you name and put it in a currency table.
- Quotes are verbatim from the page as fetched, with house normalisation: curly quotes become straight quotes,
  typographic dashes become " - " or a hyphen. No em-dash or en-dash characters anywhere in your file.
- If a fact cannot be found first-party, record it as UNKNOWN with what you searched. Never fill from memory.
- Vendor savings and performance figures are `[vendor claim]`. Arithmetic of yours is `[derived]` with inputs shown.
  Recommendations and synthesis are `[our reading]`.

## Read first

1. `research/2026-11/09-aws-orchestration.md`: section 1 (header), and the existing entries on your service(s)
   (A Batch, B HyperPod, C EKS, D schedulers, E OSMO, G capacity markets, wave 4 configuration sources), and
   section 12 (the workload table, 16 rows). Do not re-record what is already there unless you go deeper or the
   page changed. If today's page contradicts an existing F09 entry or sharpens it, add an entry and list it in
   your "Contradicts or sharpens the first version" section with the F09 ID.
2. The fifteen workloads, by number (from `src/sections/Workloads.tsx`): 1 teleoperation recording and encoding;
   2 video decode into the dataloader; 3 curation (filter, caption, embed); 4 image augmentation; 5 CPU physics
   stepping; 6 GPU-parallel physics; 7 simulated cameras (rasterised or ray-traced); 8 per-task policy fine-tune
   (ACT, SmolVLA); 9 world-model (JEPA class) training; 10 closed-loop evaluation in simulation; 11 export and
   quantise for the device; 12 on-robot policy inference; 13 generative augmentation with a world model;
   14 VLA post-training on one node; 15 multi-node pretraining. (Open the file and use its exact names if they
   differ.) Workloads 1 and 12 run at the edge; say so and do not force them onto a cloud scheduler.

## Entry format (the parser depends on it; copy it exactly)

```
**F10-<n>. <One or two sentences: the claim, complete, with every number that matters written out.>**
- Location: <document, page or section title; file and lines for code>
- Verdict: NEW
- Evidence: <URL> | Tier 1, first-party docs | <evidence kind> | "<verbatim quote>" and "<verbatim quote>" ; <second URL> | Tier 2, launch announcement | <kind> | "<quote>" (accessed 2026-11-20)
- Use in dive: <which new section (25 AWS Batch, 26 AWS Parallel Computing Service, 27 Amazon SageMaker HyperPod, 28 Amazon EKS, or 24 the overview) and what it supports: a moving part, an animation step, a snippet, a limit>
```

- The entry line starts at column 0 with `**F10-<n>. ` and ends with `**`. Use ONLY the ID range given in your
  task. One blank line between entries. Entries sit under `### ` headings (a heading ends the previous entry).
- The Evidence line is ONE line. The first URL on it is the entry's link. Tiers: Tier 1 = AWS docs, API reference,
  source and docs at a pinned ref, NVIDIA and Kubernetes project docs; Tier 2 = What's New posts, AWS blogs,
  product pages. Evidence kinds: definition, documentation of support, documentation of a limit, launch
  announcement, benchmark claim (vendor reported), production report, code behaviour.
- A configuration block is quoted in full inside the Evidence line, joined into one line (as F09-128 to F09-133
  do), AND printed again verbatim as a fenced block in your file's "Configuration blocks" section under a line
  `Block for F10-<n>:` with its URL, so a section author can copy it with its line breaks. Never invent or
  "fix" a field. If you adapt nothing, say "verbatim".
- Synthesis entries (`[our reading]`, `[derived]`) start the claim with that label, give
  `- Location: synthesis of F10-a, F10-b` and `- Evidence: F10-a, F10-b | ...` with no URL.
- Every number the dive may print must appear in the entry's text exactly as the dive should print it.

## File layout

```
# 10<letter> <title>: research register
## 1. Header            (date, area, sections fed, quote policy, how pages were fetched)
## 2. Currency table    (item | newest found | date | source)
## 3. Pinned sources    (repositories with tag and 40-character SHA; docs pages list)
## 4. Claim register    (### sub-headings by topic; the entries)
## 5. Configuration blocks   (fenced blocks, verbatim, each under "Block for F10-n:" and its URL)
## 6. The cluster, drawn     (for each service: the objects to draw and how they nest; the lifecycle as numbered
                              steps with the entry IDs behind each step: submit, queue, scale from zero, place,
                              run, Spot notice, checkpoint and requeue, scale down)
## 7. Recommended configuration [our reading]   (per service: the configuration you would give the arm's
                              workloads, each setting tied to entry IDs; what AWS itself recommends, quoted)
## 8. Workload fit            (the fifteen workloads x your service(s): suits / possible / does not fit, with the
                              entry IDs and `[our reading]` where it is synthesis)
## 9. What it does poorly, and hand-offs (limits, gaps, where another service takes over; entry IDs)
## 10. Contradicts or sharpens the first version (F09 ID | what register 09 says | what today's page says)
## 11. UNKNOWN register
## 12. Source list by tier
```

Write the file to disk early (after the first ten entries) and keep appending: the process can stop at any moment.
Aim for 50 to 90 entries, depth over breadth: the objects and their fields, lifecycle, Spot behaviour and
configuration matter most.

## Return to the orchestrator

At most 200 words: the file path, entry count and ID range used, the five facts most useful for a cluster
animation, anything that contradicts register 09, and the UNKNOWNs.
