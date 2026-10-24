# Change report: ThesisAndFraming (nav id `thesis`)

Register: `research/2026-10-refresh/05-workloads.md`, "Ridge-point reference table",
"Section 1 - ThesisAndFraming" (claims 1.1 to 1.23 and Recommended edits) and
"Cross-section findings for the integrator" (items 1, 4, 5). Cerebras and Groq
records follow `04-other-arch.md` (CB1, CB11, CB13, GS3, GS5 and its Sources list).

Files: `src/sections/ThesisAndFraming.tsx`, `src/components/TriangleDiagram.tsx`,
`src/sources/ThesisAndFraming.ts` (new, 19 records). Shared records reuse the URL,
title, publisher and tier already used elsewhere: `h200Page`, `hopperArchBlog`,
`cudaBestPractices`, `ptxIsa` (NvidiaHopper.ts), `gb300Nvl72` (NvidiaBlackwell.ts,
GraceBlackwellUltraServer.ts), `deepseekV3Report` (Tier 2, as in FlashCacheTier.ts and
HighBandwidthFlash.ts), `trainium2Arch` and `clangAmxIntrin` (titles matched to
KernelExecutionLifecycle.ts).

Fetched during authoring (records carry 2026-10-17):
- NVIDIA LPX blog: "500 MB of high-speed on-chip SRAM serves as the primary working
  storage for inference"; "LPX accelerates latency-sensitive execution within decode,
  such as sparse MoE expert feed-forward networks (FFNs)"; "while Rubin GPUs continue
  to handle prefill and decode attention". Table 2 also lists up to 512 GB of DRAM per
  tray, so the page says "primary working storage", not "SRAM-only".
- NVIDIA newsroom 2026-08-24: "NVIDIA Groq 3 LPX ... is now in full production." LPX
  is shipping, so it carries no roadmap label.
- clang `amxintrin.h` at `llvmorg-23.1.3`: "the maximum size is 16x64=1024 bytes".
- LLVM scheduling models at `llvmorg-19.1.0`: `MispredictPenalty` Neoverse V2 10
  ("NOTE: Copied from N2"), Sapphire Rapids 14, Zen 4 13.

Word count (rendered `main`, nav and citation badges excluded, no disclosures):
1,099 before, 1,190 after (+8%). Growth is the NEW LPX paragraph and the sparse
aside; the pass cut the duplicated heterogeneity paragraph in the opening block, the
SaaS workload, the "Peak FLOPs tells you about the ceiling" line and the
section-number paragraph to hold it there.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| 1.4 | H200 "ships 3,958 TFLOPS of FP8" | "1,979 TFLOPS of dense FP8"; 3,958 only in a labelled "Sparse aside" ("With sparsity", 2:4 pattern) | h200Page (T2, spec); hopperArchBlog (T2, derived: 1:2 dense/sparse pairs) |
| 1.6 | ridge "roughly 825 FLOPs per byte" | "about 412 FLOP per byte"; 825 in the aside as the sparse-based figure | h200Page (T2, derived) |
| 1.2 | "reads the entire model's weights ... once per generated token" | dense model reads every weight once per token; an MoE model reads the experts each token selects | deepseekV3Report (T2) |
| 1.7 | "Decode with a modest batch size lives at 2-10" | "with 8-bit weights at batch 1 to 5, decode sits at 2 to 10 FLOP per byte", with the 2-FLOP multiply-add arithmetic in the note | roofline (T3, derived) |
| 1.8 | "two orders of magnitude below the ridge" | "40 to 200 times below the ridge" (412/10 = 41, 412/2 = 206) | roofline (T3, derived) |
| 1.9 | doubling bandwidth "would roughly double the tokens per second" | adds "until a fixed latency floor sets the step time"; cites the roofline min() | roofline (T3, derived) |
| 1.10 | heterogeneity list with "Groq LPU" | list kept (moved to the heterogeneity block); NEW paragraph: NVIDIA Groq 3 LPX in the Vera Rubin platform, built on licensed Groq technology, full production since August 2026, 500 MB SRAM per LPU, LPX runs MoE expert FFNs while Rubin GPUs keep prefill and decode attention | groqNvidiaLicense, lpxProduction, lpxBlog (T2) |
| 1.11 | SMs "with a warp scheduler and no speculation" | "issues from a warp scheduler and hides a stalled warp's latency by running other warps" | cudaBestPractices (T1) |
| 1.12 | Trainium "does not do it at runtime at all" | Neuron compiler fixes most of the schedule in a NEFF; Trainium3 adds ISA support for dynamic shapes and control flow | trainium3Arch (T1) |
| 1.13 | WSE-3 "bakes the program into per-PE state" | each of 900,000 cores runs its own program from 48 kB of local SRAM and fires a task when its data arrives, with no global scheduler | cerebrasS1 (T1), cerebrasSdkBlog (T2) |
| 1.18 | mispredict "costs 15-20 cycles" | "10 to 14 cycles in LLVM's scheduling models" (per-core values and "compiler cost estimates" in the note) | llvmNeoverseV2, llvmZnver4, llvmSapphireRapids (T1) |
| 1.19 | Trainium slip "a compile-time artifact rather than a runtime surprise" | "most of the schedule is fixed at compile time, so stalls are largely visible in the compiled schedule" | uncited (no number; register wording) |
| 1.20 | WSE-3 "either the plan avoided it or the model does not fit" | compiler fixes the routes; a model larger than one wafer is split at layer boundaries across several CS-3 systems | cerebrasInferenceBlog (T2) |
| 1.21, 1.22 | "Section 3 ... Section 4 ... Section 6 ... Sections 9-18 ... Sections 22-26" | section names, including both flash sections: Roofline and Arithmetic Intensity; Memory Hierarchy Primer, Anatomy of a Kernel Execution, HBM and the Bandwidth Wall, DDR5, MRDIMM, LPDDR5X and CXL, High Bandwidth Flash, Flash as a Cache Tier for Inference; Graviton Deep Dive through Compute-in-Memory; KV Cache and FlashAttention through Disaggregated Serving and Speculative Decoding | none needed (internal) |
| 1.16 | "AMX tile registers on Intel Xeon 6 hold 16 rows of up to 64 bytes" | "An AMX tile register on Intel Xeon holds at most 16 rows of 64 bytes" (the source is not Xeon 6 specific) | clangAmxIntrin (T1, note quotes the line) |

CORRECT claims kept and re-cited: 1.1 (sparse headline, gb300Nvl72), 1.5 (4.8 TB/s,
h200Page), 1.14 (SMEM, TMEM, ptxIsa), 1.15 (SBUF, PSUM, trainium2Arch), 1.17 (tcgen05
TMEM layouts, ptxIsa), 1.23 (triangle labels, re-worded, no numbers).

## Claims removed

- 1.3 SXM expansion "Server PCIe Module": UNKNOWN and a CUT candidate. "H200 SXM" stays as the product name.
- "seven-tier memory hierarchy" (1.22, CORRECT): the count was dropped from the cross-reference so it cannot drift if Memory Hierarchy Primer changes its tier count in this revamp.
- "Section 6 digs into HBM, the tier most actively contested in silicon roadmaps": no source, folded into the name list.
- "with Tier 1 vendor citations" (silicon sections): a claim about other sections' sourcing that this page cannot check.
- The mixed-tenant SaaS workload in the four-workload sentence: cut for length; the other three carry the point.
- "Silicon has never been more varied": unsourced superlative.
- "Peak FLOPs tells you about the ceiling; inference economics live on the floor": cadence line, no content.
- "The silicon spends most of its time waiting for operands": now carried by the 40 to 200x figure.

## UNKNOWNs and how the page handles them

- 1.3: expansion dropped.
- 1.11: replaced with the documented occupancy behaviour (cudaBestPractices), no statement on GPU speculation.
- 1.19: softened to the register's wording ("largely visible in the compiled schedule"); no claim of zero runtime variance.

## NEW content and its sources

- Groq 3 LPX paragraph (1.10, cross-section finding 4): groqNvidiaLicense, lpxProduction, lpxBlog (all T2). Shipping (full production), not roadmap.
- Sparse aside with the 825 ridge (1.4, 1.6, cross-section finding 1): h200Page.
- MoE scope note (1.2): deepseekV3Report.
- Trainium3 dynamic control flow (1.12): trainium3Arch (T1).
- Multi-wafer split (1.20): cerebrasInferenceBlog (T2).
- Opening paragraph stating what the dive gives the reader: no new facts; it restates the triangle and the decode result already on the page.

## Register wording not applied verbatim

- 1.9 suggested "until KV-cache reads or latency floors bind". KV-cache reads are memory traffic and keep decode bandwidth-bound, so they do not end the proportionality; the page keeps the latency floor and the decode note says KV reads lower intensity further.
- 1.21 suggested "Sections 9-21"; the brief requires names, so the page uses section names (numbers have also shifted with the two flash sections).
- Recommended edit 4 says "SRAM-only"; the LPX blog's Table 2 lists DRAM per tray, so the page says SRAM is each LPU's "primary working storage".

## Diagram

`TriangleDiagram.tsx` stays React Flow. Changes: compact triangle layout (Instruction
and Data at the top corners, Shape at the bottom, functional unit in the centre, about
290 x 300 units) so fitView keeps text legible on a phone; a custom node type with
title and subtitle lines (the old `\n` labels never broke lines) and hidden,
non-connectable handles; three separate target handles on the unit so the edges no
longer converge on one left-side point and cross each other; edge labels removed
(their text moved into node subtitles: "fetched, decoded and issued", "operands in the
tier the unit reads", "tile size, stride, alignment, precision", "executes when all
three arrive"; the old "resident in register tier" was wrong for SBUF and scratchpad
designs); `fitView` capped at maxZoom 1.3; zoom-on-pinch and double-click disabled;
square container capped at 440px wide, centred, white background; wrapper carries
`role="img"` and an `aria-label` sentence stating what the diagram asserts (React Flow
renders HTML nodes, so there is no single `<svg>` to hold a `<title>`). No numbers in
the diagram.

Rendered check: `scripts/shoot.mjs` reports "0 diagram(s), ok" at 1440 and 390 (its
probe only measures SVG `<text>`, and the diagram now has none) and no page-level
horizontal overflow. A separate DOM probe over the React Flow nodes
(`/tmp/thesis-tools/rfcheck.mjs`) found no node overlaps, no node clipped by the
container, no text overflowing a node, and a smallest rendered font of 14.3px at 1440
and 10.5px at 390. Before the change the 390 render clipped the Instruction and Data
nodes off both sides with text near 6px, and at 1440 the green edge crossed the
"decoded + issued" label. PNGs read at both widths: every label inside its box,
arrows clear of text, three distinct entry points on the unit.

## Leverage pass: claim-set diff

New assertions in the after, each with its source:

1. Headline FLOPS are often quoted with sparsity: gb300Nvl72 ("All Tensor Core specifications are with sparsity unless otherwise noted.").
2. An MoE model reads only the experts each token selects: deepseekV3Report.
3. H200 dense FP8 1,979 TFLOPS: h200Page sparse figure, halved per hopperArchBlog (derived).
4. Ridge 412 FLOP/byte; 825 from the sparse figure: derived from h200Page.
5. 2 to 10 FLOP/byte at batch 1 to 5 with 8-bit weights; 40 to 200x below the ridge: derived, roofline intensity definition.
6. Doubling bandwidth roughly doubles tokens/s until a latency floor sets the step time: roofline min() (derived).
7. The 3,958 figure applies only to weights pruned to the 2:4 structured pattern: h200Page "With sparsity" plus the register's 2:4 convention.
8. SM hides a stalled warp's latency by running other warps: cudaBestPractices.
9. Trainium3 ISA support for dynamic shapes and control flow: trainium3Arch.
10. WSE-3: 900,000 cores, 48 kB local SRAM per core, task fires on data arrival: cerebrasS1, cerebrasSdkBlog.
11. AMX tile maximum 16 rows of 64 bytes: clangAmxIntrin.
12. Mispredict 10 to 14 cycles in LLVM scheduling models: llvmNeoverseV2, llvmZnver4, llvmSapphireRapids.
13. Model larger than one wafer split at layer boundaries across CS-3 systems: cerebrasInferenceBlog.
14. NVIDIA Groq 3 LPX in the Vera Rubin platform, on licensed Groq technology, full production since August 2026: lpxBlog, groqNvidiaLicense, lpxProduction.
15. Each LPU's primary working storage is 500 MB of on-chip SRAM; LPX runs MoE expert FFNs while Rubin GPUs keep prefill and decode attention: lpxBlog.
16. "One decode step crosses two kinds of silicon": restates 15.

Guidance sentences ("read memory bandwidth first", "Place workloads with the dense
figure", "Check that the mechanism exists before you port a tuning result", "work out
its FLOP per byte the way the anchor number does, then open Roofline and Arithmetic
Intensity") connect facts already on the page to an action and add no facts.

Repeated number: 412 FLOP per byte (anchor paragraph and the closing paragraph), with
2 to 10 beside it both times.

## For the orchestrator (shared files)

- Glossary acronyms used in this section: FLOPS/TFLOPS, FP8 (8-bit floating point),
  HBM/HBM3e (High Bandwidth Memory), MoE (mixture of experts), KV (key-value), FFN
  (feed-forward network), BTB (Branch Target Buffer), SM (Streaming Multiprocessor),
  NEFF (Neuron Executable File Format), ISA (instruction set architecture), WSE-3
  (Wafer-Scale Engine 3), SMEM (shared memory), TMEM (Tensor Memory), SBUF (State
  Buffer), PSUM (Partial Sum buffer), AMX (Advanced Matrix Extensions), LPU (Language
  Processing Unit), RDU (Reconfigurable Dataflow Unit), HFT (high-frequency trading),
  RAG (Retrieval-Augmented Generation). LPX and SXM are NVIDIA product names that
  NVIDIA does not expand on the pages checked.
- `sources.md` needs regenerating: the snapshot test fails only on the new
  ThesisAndFraming rows.
- The Heterogeneity Fact still says "Mispredict cost: ~15-20 cycles"
  (`HeterogeneityFact.tsx:153`); this page uses LLVM's 10 to 14 (register 1.18).
- Groq 3 LPX is in full production (NVIDIA newsroom, 2026-08-24). Sections that mention
  it (Groq, SambaNova and Dataflow; Mixture of Experts; Disaggregated Serving) should
  not label it roadmap, and should say "primary working storage" rather than
  "SRAM-only", since the tray carries DRAM.
- The roofline paper record uses the register's Crossref URL at Tier 3 (academic rule).
  If Roofline and Arithmetic Intensity cites the same paper, it should reuse that URL
  and tier.
