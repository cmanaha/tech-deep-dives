# Leverage pass: silicon-memory-inference FlashCacheTier, "Sharing context across nodes" and "Building the tier, in order"

Date: 2026-10-24. Scope: `deep-dives/silicon-memory-inference/src/sections/FlashCacheTier.tsx`, the two containers
named above plus the FlashTierLadder caption. Standards: `deep-dives/efa/revamp/leverage-pass-standard.md`,
`section-shape-standard.md`, repo CLAUDE.md. Facts were taken as settled by `factcheck-silicon.md` (including
"## Applied"). No source was fetched during this pass, so every sentence below traces to text already in the
section. `src/sources/FlashCacheTier.ts` is unchanged: no record lost its last citation.

Word count method: JSX tags and `<Cite>` elements stripped (cite notes are popover text, not counted), h2
description and ExpandableSection header text counted. "Default-visible" counts disclosure bodies as collapsed.
Script kept outside the repo.

## Before

| Container | Mental model | Practical leverage | Rigor | Accuracy | Economy |
| --- | --- | --- | --- | --- | --- |
| Sharing context across nodes | 3 | 4 | 5 | 5 | 3 |
| Building the tier, in order | 4 | 5 | 5 | 5 | 4 |

Sharing, MM 3: the create-time EFA choice that decides the FSx break-even sat mid-paragraph, after the client
lists and before sizing, S3, NIXL and EFS, all inside one 26-line paragraph. The intro put Mooncake's result
after the Dynamo router weights, so "it" was ambiguous. Economy 3: sizing arithmetic was inline, and the
container closed on a hedge, with the vendor checklist one sentence earlier.

Building, economy 4: "Size it larger than the GPU KV pool" repeated the Dynamo recommendation that follows it.
"The filter earns its place" restated the directive just before it. The monitor block listed both counters
before saying how to read either one.

Visible prose words: Sharing 887 (779 default-visible), Building 334, ladder caption 65. The two containers
total 1,221 (1,113 default-visible).

## Per-block answers

Q1 = what it means to the reader, Q2 = model and whether it is visible, Q3 = how the reader acts on it,
including what to watch.

| Block | Q1 | Q2 | Q3 |
| --- | --- | --- | --- |
| Sharing h2 description | Why to read on | Should name the decision, but named only the service | Now names the decision: create FSx with EFA |
| Intro paragraph | When a shared tier pays | Local tiers need affinity routing; local DRAM reaches about half the theoretical hit rate; pooling recovers it. Prose only; the hit-rate figure is a candidate chart (not commissioned) | Decide whether to add a shared tier; the Dynamo router weights are a default to know; watch the hit rate (Building's llm-d ratio) |
| Shared flash on AWS (FSx) | Which shared flash clears the break-even | The create-time EFA choice puts FSx either side of 2.1 GB/s per GPU. Visible: the ladder's three FSx rows | Create the file system with EFA (cannot be added later); use GDS on P5/P6; trn2 is not an EFA client |
| FSx sizing and latency (disclosure) | How big to make it, and how far to trust a latency figure | Throughput sets capacity; the hot set must fit the RAM cache | Size to 153.6 TiB or 62.4 TiB for one full-rate GDS client; treat the 100 to 500 µs figure as a blog claim |
| S3 and EFS | The object tier, and the EFS pitfall in llm-d's guide | S3 suits prefetched large chunks; NIXL uses one plugin architecture for storage and GPUs | KVBM G4 or NIXL `obj` for S3; choose General Purpose on EFS; eviction is the operator's job |
| Pooled DRAM on AWS | The fastest shared tier, and who provides it | Peer DRAM at the EFA line rate (the ladder's 50 GB/s row); Mooncake registers GPU memory, Valkey clients register host memory | Install the `-efa` wheel; treat Valkey as pre-release and self-managed |
| The managed option | Buy instead of build | L1 local CPU plus cluster-wide L2 | `kvCacheSpec.enableL2Cache` with `tieredstorage`; treat flash inside it as undocumented |
| CMX (disclosure) | A roadmap shared flash tier | G3.5 between G3 and G4 | None on AWS; understanding only. Left as is |
| Reading a vendor's claim | Predict a 20x TTFT headline | 20x = prefix length x link: 65.6 GB at 198 Gb/s is 2.65 s | Ask for hit rate, p95 TTFT, link speed and context length |
| Building h2 description | The order of steps | Payoff already stated | Unchanged |
| Step 1, host DRAM | How big | Bigger than the device cache, or KVBM churns | Size above 100 GB and above the GPU KV pool |
| Step 2, local flash | When to add it, and keep the filter | Most blocks are never reused; endurance budget | Keep the filter on; know the second-sighting default (code) against the docs |
| Step 3, shared flash | Which connector actually shares on FSx | A shared `root_dir` or LMCache backends share; KVBM G3 is private | Create FSx with EFA; pick vLLM `fs` or LMCache; do not expect KVBM G3 to share |
| What to monitor | Whether each step pays | Load vs store bytes; hit rate vs TTFT | The two vLLM counters, the llm-d hit-rate ratio, and comparing against about 17 GB/s per node |
| Ladder caption | Where each row's figure comes from | Source key for the ladder | Lookup only. No edit: "HBF" is expanded in sections 7 and 8, before this one, so the acronym rule holds |

## Edits (verb, location)

1. Re-express, Sharing h2 description: "a cache shared by every node" became "a shared cache"; "which AWS service allows
   one GPU instance up to 150 GB/s" became "why FSx for Lustre allows one GPU instance up to 150 GB/s only if
   created with EFA".
2. Reorder and re-express, intro paragraph: the Dynamo router-weight clause moved up to join the routing sentence;
   SGLang now comes before Mooncake; "which is why" became "because"; Mooncake's request gains now close the
   paragraph ("They report it lets Kimi handle ...").
3. Reorder, "Shared flash on AWS.": "EFA is set only when the file system is created" now sits directly before
   "that choice puts the per-GPU ceiling ...", and the client lists follow it. `fsxEfa` is now cited on each
   clause it bears (one cite became two).
4. Demote, FSx sizing sentence: moved into the existing latency disclosure, which is renamed "FSx sizing and
   latency figures". Delete: its lead "Size it for throughput:", which step 3 still says ("sized for
   throughput").
5. Reorder, S3, NIXL and EFS sentences: split out of the FSx paragraph into their own paragraph after the
   disclosure, with the lead "S3 and EFS.". Text unchanged.
6. Delete, Valkey "with no tags": the cite note on the same sentence already says "no tags and no releases".
7. Reorder, "The managed option.": the AWS-measured result now comes before the docs-versus-What's-New conflict,
   so the paragraph ends on "treat flash inside it as undocumented".
8. Delete and reorder, "Reading a vendor's claim.": deleted "Storage vendors sell flash as context memory" and
   "reports them". The Nebius and WEKA sentence is re-expressed ("replayed production agentic coding traffic on
   one 8x B300 node for 8 hours"). The hedge now follows both vendors' results, and the container ends on "Ask any
   vendor for hit rate, p95 TTFT, link speed and context length."
9. Re-express, step 1: "Size it larger than the GPU KV pool." folded into the lead ("Host DRAM tier first, larger
   than the GPU KV pool.").
10. Reorder and delete, step 2: the reasons (Mooncake trace, endurance) now follow "Keep the admission filter on:"
    directly, and the code-versus-docs default closes the step. Deleted "The filter earns its place:".
11. Re-express, step 3: "FSx for Lustre with EFA and GDS" became "FSx for Lustre created with EFA, used with GDS".
    Items are separated by semicolons.
12. Reorder and delete, "What to monitor.": each counter is now followed by how to read it. Deleted the
    attribution "llm-d computes", which was narration; the `llmd` cite still carries the formula. The block still
    ends on the bandwidth comparison, about 17 GB/s per node.

Not edited: the FlashTierLadder caption, the pooled DRAM paragraph beyond edit 6, the CMX disclosure, and the
NIXL cross-links.

## After

| Container | Mental model | Practical leverage | Rigor | Accuracy | Economy |
| --- | --- | --- | --- | --- | --- |
| Sharing context across nodes | 4 | 4 | 5 | 5 | 4 |
| Building the tier, in order | 4 | 5 | 5 | 5 | 5 |

Sharing: the h2 description, the FSx paragraph and step 3 now all carry the create-time EFA decision. The
strongest number lands twice in the container: 150 GB/s in the description, and 1,200 Gb/s (150 GB/s) in the
FSx paragraph next to its per-GPU 18.75. The container ends on the vendor checklist. Mental model stays at 4,
not 5, because the AWS options still run across four paragraphs rather than in one visible comparison.
Leverage stays at 4: the page still does not say what the Mooncake/Valkey memory-registration contrast changes
for the reader, and saying it would be new inference.

Visible prose words: Sharing 880 (729 default-visible), Building 329, ladder caption 65. The two containers
total 1,209, down 12 (1,058 default-visible, down 55).

## Claim-set diff

Assertions in the after that were not in the before: none. Each re-expressed sentence and its "before" source:

- h2 "allows one GPU instance up to 150 GB/s only if created with EFA": joins two before claims, "1,200 Gb/s (150
  GB/s) with EFA and GDS" against 100 Gb/s without EFA (`fsxPerformance`), and "EFA is set only when the file
  system is created" (`fsxEfa`). It states EFA as a necessary condition, never a sufficient one, and keeps the
  "allows ... up to" ceiling wording from fact-check correction 5.
- "because its authors found" stands for "which is why"; "They report it lets Kimi" stands for "The Mooncake
  authors report that it lets Kimi". The attribution is kept, because these are the system authors' own results.
- Step 3 "created with EFA": the same `fsxEfa` fact applied to the build step.
- "Track the hit rate, X over Y": the formula is unchanged, and so is its `llmd` cite.

Weakened or deleted (allowed): "Storage vendors sell flash as context memory"; that the Nebius and WEKA run
"reports them" (link speed and context length); "Size it for throughput" inside the disclosure; "no tags" in
prose (the cite note keeps it).

Kept, checked mechanically against the before file: every source key (same set; `fsxEfa` cited once more),
every number, the doc-versus-code conflicts (Dynamo router weights, Dynamo admission filter), the doc-versus-doc
conflicts (HyperPod tiering, llm-d EFS mode, Storage Blog FSx latency), and every "located in this research"
hedge (6 before, 6 after).

## Verification

From the worktree root: typecheck 0, lint 0, test 0 (909 of 909, including the sources.md sync test, since no
record was dropped), no-ai-tells 0, svg-a11y 0, pinned-refs 0.
