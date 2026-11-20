# Wave 1 brief: claim registers (shared by all nine stream agents)

Date of this pass and accessed date for every source you fetch: **2026-11-20**.

Repo root: `/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/physical-ai` (a git worktree, branch
`deep-dive/physical-ai`). Dive: `deep-dives/physical-ai/`. You own exactly ONE output file, named in your task, under
`deep-dives/physical-ai/research/2026-11/` (stream 08 also owns `deep-dives/physical-ai/research/experiments/`).
Edit nothing else. Do not commit, push, or run git write commands; the orchestrator commits.

**Privacy: never put personal data (names, email addresses, account ids) in any request, header, User-Agent, URL or
query string.** If a site demands a contact address, use another copy of the source or skip it. Any subagent you start
gets this rule verbatim.

**Forbidden:** AWS API calls, SSH to any machine, installs, running hardware benchmarks, messages to anyone, writing
outside your file. Web access is read-only fetches and searches. `gh api` and `curl` of public raw URLs are fine.
Downloaded files (PDFs, repo files) go in a fresh directory under `/tmp`; do not execute anything downloaded.

**Naming:** the dive is "Physical AI". The seed research folder was written for a conference talk and uses a session
code (the letters C-M-P followed by 407) in its folder name and text. That code must never appear in your file: not in
text, paths, quotes or source lists. Refer to the seed only as "the seed research" or by its file number ("seed 02").

## What the dive is

An interactive deep dive for a technical reader at level 100 to 200 (IT or software, knows what a model and training
are, no robotics background). One task threads through every section: **an SO-101 robot arm picks up a block and places
it in a cup.** The owner wants to understand the models (world models and JEPA above all), every phase of the loop,
which part of the computer each workload loads, and how to orchestrate it on AWS, with information current as of
November 2026. His words: "I don't want to say shit that is like three years old."

The 26-section plan is in the seed file `12-deep-dive-split.md`. Your task names the sections your register feeds.

## Read first

1. `CLAUDE.md` at the repo root: "Fact-Checking & Sources Standard", "Quality Rules", "Explaining Concepts".
2. One finished register as the format to copy: `deep-dives/rl-agentic-loops/research/2026-10/05-rl-systems.md`
   (header, pinned-source tables, entries, mental models, UNKNOWN register, reading path, tiered source list).
3. The seed research, READ-ONLY, in the seed research folder, outside this repository (the files your
   task names). Seed labels: [AUTH] first-party, [SEC] secondary, [SPEC] inference, [MEM] from memory.

## Freshness rule (non-negotiable)

Today is 2026-11-20. Your own knowledge of this field is stale; assume every version you remember has a successor.
For every model, simulator, framework, AWS service feature, instance family and device your register names:
**fetch** the newest first-party version or announcement as of November 2026 (GitHub releases page or
`gh api repos/<o>/<r>/releases`, PyPI, the vendor's docs or blog, the arXiv listing) and record its date in a
"Currency table" near the top: item, newest version found, release date, source URL, what the seed research named.
A claim whose source predates 2025 is allowed only as labelled history or as the paper that introduced a concept.
Never write that something is current from memory. If you cannot determine the newest version, say so in the UNKNOWN
register.

## Evidence rules

- **Fetch the primary source.** No number from press paraphrase or from a search-result snippet. A search locates the
  source; the quote comes from the fetched source itself.
- **Pin every source:** arXiv ID with version (`arxiv.org/abs/2506.09985v1`; check the listing for the latest version
  and use it), GitHub code at a release tag or 40-character SHA (never `/blob/main/` or `/tree/main/` or `master`: a
  repository gate fails the build on those URL forms; when you must refer to a repo's default branch, cite the repo
  root URL plus the SHA you read), first-party doc URL with access date 2026-11-20.
- **Seed claims carry over only after you re-fetch their source.** A seed claim that cannot be re-fetched is UNKNOWN,
  with the reason. Where your fetch contradicts the seed, record it under "Stale or wrong in the seed research".
- **Tiers:** Tier 0 our own experiments; Tier 1 source code at a pinned ref, official docs, API references; Tier 2
  first-party vendor or lab blogs and talks; Tier 3 papers ("peer-reviewed (venue)" only when you confirmed the venue,
  otherwise "preprint") and third-party technical analysis; Tier 4 tutorials and press, used only to locate primary
  sources and never cited as fact. Code is the authority over documentation.
- **Labels:** vendor or author performance figures are `[vendor claim]` or `[author reported]`; arithmetic is
  `[derived]` with its inputs shown; synthesis is `[our reading]`. Unverified stays UNKNOWN with the reason. "Not
  located in this research" never becomes "does not exist".
- Quotes are verbatim, with house normalisation: curly quotes become straight quotes, long dashes become " - " or a
  hyphen. Do not use the em-dash or en-dash character anywhere in your file.

## Entry format (stream NN, entries FNN-1, FNN-2, ...)

```markdown
**F03-7. <The claim in one or two plain sentences, with its conditions.>**
- Location: <paper section / file path and lines / doc page heading>
- Verdict: NEW | CARRIED (seed NN, re-fetched) | STALE (superseded by ...) | WRONG (seed said X; source says Y) | UNKNOWN
- Evidence: <pinned URL> | Tier N, <peer-reviewed (venue) / preprint / first-party docs / code> | <evidence kind:
  definition, documentation of support, benchmark claim (author or vendor reported), ablation, production report,
  code behaviour> | "<verbatim quote>" (accessed 2026-11-20)
- Use in dive: section N, and what it supports there.
```

Every entry has all four lines. One claim per entry. Aim for 50 to 90 entries; depth on what the sections need beats
breadth.

## File structure

1. Header (date, area, sections fed, quote policy, verdict vocabulary).
2. Currency table (see the freshness rule).
3. Pinned sources (papers table with arXiv version and venue; code table with tag and 40-character SHA and files read;
   docs list).
4. Claim register, grouped under lettered headings.
5. Teaching material (concept streams 01 to 07; see below).
6. Stale or wrong in the seed research (table: seed file, seed claim, what the source says now, entry ID).
7. Mental models worth teaching (5 to 10, each one or two sentences, each tied to entry IDs).
8. Contradictions between sources.
9. UNKNOWN register (ID, unknown, where it arises, what would close it).
10. Reading path for Carlos: what to read, in order, and which part (section, figure, file), with one line on why.
11. Source list by tier.

### Teaching material (section 5 of your file)

For each concept section your register feeds, collect what the section writer needs, each item tied to entry IDs:
- **The plain-words idea:** what is going on, two to four sentences, no undefined term.
- **One small worked example with real numbers on the arm task** (SO-101 picks up a block and places it in a cup).
  Use the arm's real figures from fetched sources (number of joints, camera resolution and rate, control rate, chunk
  length, model size). Label invented toy numbers as illustrations and keep the arithmetic redoable.
- **The mechanism:** how it works, at the depth of "which tensor goes where", with the formula where one exists and
  every symbol defined.
- **What it costs in compute:** published training and inference figures (GPU type and count, hours, memory,
  latency, parameters), each with an entry ID, and which part of the machine it loads (CPU, memory, GPU tensor cores,
  GPU ray-tracing cores, video decode or encode engines, storage, network).

## Working method

- Write the header and the first entries to disk within your first few fetches, then append as you go. The process can
  be stopped at any moment and anything not on disk is lost. Never hold more than about ten entries in memory.
- arXiv: use `https://arxiv.org/abs/<id>` to find the latest version, then `https://arxiv.org/pdf/<id>vN` (download
  with curl to a fresh /tmp directory, convert with `pdftotext`) or `https://arxiv.org/html/<id>vN`.
- GitHub: `gh api repos/<owner>/<repo>/releases?per_page=5`, `gh api repos/<o>/<r>/commits/<branch> --jq .sha`, raw
  files at `https://raw.githubusercontent.com/<o>/<r>/<sha>/<path>`.
- Budget: about 80 fetches. No subagents unless one question needs a long separate read.
- Before you finish, run `grep -n "blob/main\|tree/main\|blob/master\|tree/master" <your file>` and fix any hit, and
  check that your file contains no em-dash, no en-dash and no session code.
- Return to the orchestrator at most 200 words: entry count, the newest versions you found that differ from the seed,
  the three findings that most change the story, and your open UNKNOWNs.
