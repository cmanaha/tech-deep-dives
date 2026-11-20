# Physical AI: Research Guide

How the research for this dive is organised: the waves and what each answers, the order in which to read the primary
sources, the evidence bar per kind of claim, the open questions, the Tier 0 experiments that the separate profiling
project feeds, and the gates before any app section is written.

Companion to `SCOPE.md`. Bracketed IDs such as (F03-12) point to claim-register entries in `research/2026-11/`.
Dates are absolute. Every source was accessed on 2026-11-20 unless an entry says otherwise.

---

## 1. Where the research stands

<!-- STATE-TABLE: filled at integration -->

## 2. Research waves

### Wave 0. Seed research (before this dive)

Seven research files, a synthesis, a profiling shortlist, an arm-pipeline story, two PMU cards and a benchmark
report, written between 2026-11-17 and 2026-11-20 for a conference talk on the same subject. Strong on numbers and
AWS patterns, thin on teaching, tier-labelled but without pinned versions or verbatim quotes on every claim. The dive
treats it as a lead list: a seed claim enters a register only after its source was fetched again on 2026-11-20.

### Wave 1. Nine registers, three at a time (2026-11-20)

Shared brief: `research/2026-11/wave1-brief.md`. Each register carries a currency table (newest first-party version
of everything it names, with the release date), pinned sources, numbered entries (claim, location, verdict, evidence
with tier, kind and verbatim quote, use in dive), teaching material for its concept sections, a table of what was
stale or wrong in the seed, mental models, contradictions, an UNKNOWN register, a reading path and a tiered source
list.

| Wave | Register | Sections | Seed |
|---|---|---|---|
| A | `01-robot-basics.md` | 3 | none |
| A | `02-imitation-and-vla.md` | 4, 5 | 01 |
| A | `03-world-models-and-jepa.md` | 6, 7 | thin |
| B | `04-rl-and-agentic-loops.md` | 8, 19 | 01, 05 |
| B | `05-data-pipeline.md` | 9 to 11 | 02 |
| B | `06-simulation-and-sim-to-real.md` | 12 to 14, 16 | 02, 04 |
| C | `07-edge-and-fleet.md` | 17, 18 | 04 |
| C | `08-compute-shapes.md` | 20 to 23 | 08, 10, 11, PMU cards, bench |
| C | `09-aws-orchestration.md` | 24, 25 | 03 |

### Wave 2. Refutation and freshness (2026-11-20)

Brief: `research/2026-11/wave2-brief.md`. Three agents, three registers each, none checking a register it wrote.
Each tries to refute every load-bearing claim at its pinned source and checks that every named version is still the
newest. One verdict row per claim: HOLDS, SCOPE NARROWER, WRONG, STALE, UNVERIFIABLE, with the quote.

<!-- WAVE2-RESULTS: filled at integration -->

### Wave 3. Tier 0 experiments (separate profiling project)

See section 5. The dive does not run hardware.

### Wave 4. Pre-build design (after Gate 1)

Per section: the worked example's numbers fixed, the diagram sketched, the first-use order of terms checked against
the reading routes. Then `src/sections/`.

## 3. Reading path for Carlos

<!-- READING-PATH: filled at integration from the nine registers' reading paths -->

## 4. Evidence bar per claim type

| Claim type | What it needs before it ships |
|---|---|
| A product or model version ("the current release is X") | The first-party release page, tag or model card fetched on the access date, with the release date. Never from memory. A register's currency table holds it. |
| A model's architecture or size | The paper at a pinned arXiv version, or the code or model card at a pinned SHA or tag. Where paper and code differ, the code is the authority and both are shown. |
| A default value or behaviour of a framework | The code at a release tag or 40-character SHA, quoted with file and lines. Documentation alone is not enough. |
| A training or inference compute figure | The publisher's own paper, card or README, marked `[author reported]` or `[vendor claim]`, with GPU type, count and conditions. Never compared across publishers as if measured alike. |
| A performance comparison between vendors' products | Shown as each vendor's claim, side by side, labelled. No winner is declared without a Tier 0 measurement. |
| A hardware capability (ray-tracing cores, a codec in hardware, memory) | The vendor's support matrix or instance documentation, fetched on the access date. |
| An AWS service feature or limit | The AWS documentation page or What's New post, with access date. A feature the owner described from memory is unverified until a first-party page states it. |
| A price | The first-party pricing page with access date and Region, or omitted. Prices change; the page shows the date. |
| Our own measurement | Raw outputs in `research/experiments/` with inputs and configuration, the run count stated next to the figure. One run is shown as one run. |
| Arithmetic | `[derived]`, with inputs that each carry a register ID, redoable by hand. |
| A synthesis (shapes, groupings, decision paths) | `[our reading]`, stated as ours, with the entries it rests on. |
| History | A source older than 2025 is labelled as history or as the paper that introduced the concept, and is never the support for "what people use now". |
| An absence | "Not located in this research", with what was searched. Never "does not exist". |

## 5. Tier 0 experiments

The profiling project is separate from this dive. It produces measured results (inputs, configurations, outputs);
the dive consumes them through `research/experiments/`, one folder per experiment, each with a README that states
machine, software versions, command, run count and raw files. The dive never runs hardware, and the profiling
project writes no prose for the page.

### What exists (copied from the seed on 2026-11-20)

`research/experiments/E-seed-profiling-2026-11-19/`: 14 CPU microbenchmark kernels and three CPU stand-in workloads
under `perf stat` with a top-down level 1 breakdown, on a Jetson Orin Nano Super (Cortex-A78AE) and a DGX Spark
(Cortex-X925 and Cortex-A725), one core, **one run each**; one GPU matmul kernel per machine under Nsight Compute.
Limits are listed in `research/experiments/README.md`.

### What the dive asks the profiling project for

The story is one SO-101 task through eight phases. Each row is one card for section 22 and one unit of work for
section 23.

<!-- TIER0-REQUESTS: filled at integration from register 08 -->

## 6. Open questions and UNKNOWN register

<!-- UNKNOWNS: filled at integration -->

## 7. Gates before building the app

The iteration flywheel (ADR-003) puts Gate 1 between research and build. For this dive Gate 1 has five checks.
All five must pass before `src/sections/` exists.

1. **Scope held.** `SCOPE.md` states the reader, thesis, questions and the 26-section plan; every change to the plan
   approved on 2026-11-19 is recorded with its reason; every section names what it gives the reader (mental model or
   practical value); Getting Started sits at position 2 with the reading routes.
2. **Load-bearing claims verified.** Wave 2 has a verdict for every load-bearing claim in the registers. Every
   WRONG, STALE and SCOPE NARROWER is applied to the registers and to `SCOPE.md`. Every number in `SCOPE.md` carries
   a register ID.
3. **UNKNOWNs triaged.** Every UNKNOWN is marked close-by-research, close-by-experiment, accept-as-hedge or cut.
4. **Freshness and Tier 0.** Every product version in the registers was fetched on the access date, none from
   memory; a 15-number spot check against re-fetched sources is recorded; the Tier 0 results on hand are in
   `research/experiments/` with provenance, and sections 22 and 23 carry their condition.
5. **Human approval.** Carlos reads `SCOPE.md` and this guide and approves the section list, or names cuts, and
   answers the open decisions listed in the Gate 1 record.

<!-- GATE1-RECORD: filled at integration -->

## 8. Budget record

<!-- BUDGET: filled at integration -->
