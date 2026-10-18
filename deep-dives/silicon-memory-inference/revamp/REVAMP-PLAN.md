# Silicon, Memory, and Modern Inference: October 2026 Revamp Plan

Stream `silicon`, branch `revamp/2026-10-silicon`. Started 2026-10-16.
Process model: `deep-dives/efa/revamp/REVAMP-PLAN.md` (research refresh, plan,
wave-based authoring with gates between waves). Governing content test:
`deep-dives/efa/revamp/section-shape-standard.md`.

## Artifact index

Research (permanent), `research/2026-10-refresh/`:
- `01-memory.md`: MemoryHierarchyPrimer, HbmAndBandwidthWall, MainMemoryAndCxl,
  KvCacheAndFlashAttention, ComputeInMemory
- `02-nvidia.md`: NvidiaHopper, NvidiaBlackwell, GraceBlackwellUltraServer,
  NvidiaCompilersAndTooling, KernelExecutionLifecycle
- `03-aws-cpus.md`: AwsCustomSilicon, AwsCompilersAndTooling, GravitonDeepDive,
  AmdEpycTurin, IntelXeon6, IsolationNie
- `04-other-arch.md`: CerebrasWaferScale, GroqSambanovaDataflow,
  ChipletAndInterconnect, CommunicationAndScaleOut, DeterminismAOT,
  EdgeSharedMemorySilicon, SmallLanguageModels
- `05-workloads.md`: ThesisAndFraming, HeterogeneityFact,
  RooflineAndArithmeticIntensity, QuantizationAndPrecision,
  MoeAndSparseActivation, DisaggregatedServingAndSpeculative, CapitalMarketsLens
- `hbf.md`: High Bandwidth Flash (new section)
- `flash-cache-tier.md`: flash as a cache tier for inference (new section)

Process (this folder):
- `authoring-brief.md`: the brief every section-authoring agent reads
- `authoring/<Section>.md`: one change report per authored section
- `verification/<Section>.md`: adversarial fact check plus Gate 3 score
- `REVAMP-PLAN.md`: this file

Infrastructure added in this stream:
- `src/components/Cite.tsx`: inline citation with tier badge, kind
  (spec, vendor claim, roadmap, measured, derived) and a popover carrying the
  link and accessed date.
- `src/sources/<Section>.ts`: per-section source records; `src/sources/index.ts`
  collects them for the appendix; `src/sources/markdown.ts` renders sources.md,
  and `src/__tests__/sources.test.ts` fails when sources.md drifts.
- `src/__tests__/sections.test.tsx`: mounts every section for real.
- `scripts/shoot.mjs`: serves a build, screenshots each section at 1440 and
  390, and probes every inline SVG for text overlap, text running out of its
  box, viewBox clipping and page overflow.

## Baseline (2026-10-16, before any edit)

- 30 content sections plus Glossary and Sources; 24 SVG components and 6 React
  Flow diagrams.
- `no-ai-tells` would fail with 660 hits (548 em-dashes, 110 curly quotes or
  entities, 2 banned words) across 55 files. The dive was never opted in.
- `pinned-refs`: 4 branch-pinned GitHub links (TensorRT-LLM `wide_ep` three
  times, CUTLASS example 92 once).
- `svg-a11y`: 24 components use `aria-label` only (warning, not failure).
- Citations are plain links with no tier and no accessed date, except in Edge
  Shared-Memory Silicon. Most quantitative claims carry no citation.
- The rendered probe already finds text running out of boxes in the memory
  hierarchy tower, the HBM stack diagram and the memory technology grid.

## Verdict counts

| Register | Rows | CORRECT | WRONG | STALE | UNKNOWN | NEW |
| --- | --- | --- | --- | --- | --- | --- |
| 01 memory | 197 | 88 | 41 | 27 | 26 | 15 |
| 02 NVIDIA | 175 | 72 | 36 | 10 | 36 | 21 |
| 03 AWS and CPUs | 240 | 110 | 51 | 11 | 42 | 26 |
| 04 other architectures | 229 | 114 | 38 | 17 | 36 | 24 |
| 05 workloads | 194 | 78 | 37 | 33 | 19 | 27 |
| **Total** | **1,035** | **462** | **203** | **98** | **159** | **113** |

Rows with a compound verdict are counted under the first verdict listed.
Fewer than half of the dive's checked claims (45%) were still correct and
sourced; 29% were wrong or stale.

## Headline findings

1. **Sparse figures read as dense in the dive's anchor numbers.** The thesis,
   the roofline table and the Blackwell spec table use NVIDIA's sparse FP8 and
   FP4 numbers without the qualifier; the BF16 roofline row is mislabelled.
   Every FLOPS figure gets a dense value and, where NVIDIA publishes one, a
   labelled sparse value.
2. **NVLink and NVLink-C2C bandwidths are bidirectional aggregates** presented
   as unqualified, and one latency in Disaggregated Serving is derived from a
   bidirectional figure.
3. **The dive stops at Blackwell.** Vera Rubin is in full production
   (NVIDIA 8-K, 2026-08-26), with 288 GB HBM4 per GPU and compute capability
   10.7; Trainium3 is GA with 144 GiB HBM at 4.9 TB/s; Cerebras shipped CS-4
   and listed on Nasdaq; NVIDIA licensed Groq's inference technology and
   announced Groq 3 LPX for Vera Rubin; SambaNova announced SN50. Heterogeneous
   decode (GPU attention plus LPU FFN and drafting) is now a shipping NVIDIA
   design and is direct evidence for this dive's thesis.
4. **MoE arithmetic intensity is described backwards in three places**
   (MoE, Quantization), and MoE's effect on prefill is wrong.
5. **Fabricated or unsourced content flagged by the 2026-08-01 audit (P3) is
   still live**: the B300 MIG row, the Isabelle/250k-lines/30-minute NIE
   figures, the KV-cache worked example that is 2x too large, and the
   DeepSeek-V3.2 415/690 GB figure cited to the wrong source.
6. **Inductor and CUTLASS**: the compiler section routes large matmuls from
   Inductor to CUTLASS. In PyTorch v2.14.1 linear-layer matmuls (`aten.mm`,
   `aten.addmm`) go to ATen (cuBLAS/cuBLASLt) unless max-autotune is on;
   batched, INT8 and FP8 matmuls can still pick a Triton template without it.
   CUTLASS templates also need `"CUTLASS"` in `max_autotune_gemm_backends`
   (code-confirmed by the compiler author; the register's 02 C3 "every matmul"
   is too broad).
7. **Neuron moved**: Neuron 2.32.0 is current, NKI left beta in 2.29.0, NxD
   Inference is in maintenance and vLLM Neuron is the serving path; Inf2 and
   Trn1 lost NxD Inference support.
8. **AWS and CPUs** (03): the Nitro Isolation Engine proof excludes cache side
   channels and scheduling (AWS white paper, June 2026) and covers about
   330,000 lines, not 250,000; confidential computing assigns a whole GPU to
   one confidential VM, not one MIG instance; Graviton5 is DDR5-8800 at
   3.3 GHz with NUMA still present, and M9g/C9g/R9g went GA June to August
   2026; Trainium3 is GA with published specs.
9. **Memory** (01): the KV-cache worked example is 2.68 GB per 8K request and
   85.9 GB at batch 32 (the page says 5 GB and 160 GB); the "no published MoE
   benchmark" PIM warning is false (Samsung, Hot Chips 2023); HyperCIM has no
   in-memory compute product and comes out; the hierarchy tower and the tech
   grid stop at CXL with no flash tier.
10. **Other architectures** (04): batch composition is the main source of
   serving nondeterminism and three GPU "determinism modes" in the diagram do
   not exist as stated; SR 26-2 (2026-04-17) superseded SR 11-7; NVIDIA
   publishes GB10's CPU-GPU link (about 600 GB/s, Hot Chips 2025); DGX Spark
   and Jetson prices moved and Jetson AGX Thor is missing; two SLM arguments
   fail their own arithmetic.
11. **Section numbers in prose are already off by one family** in several
   sections and would break again when two sections are inserted. Prose
   cross-references move to section names.

## Edits per section

Each authoring agent applies its register's claim table and "Recommended
edits" list. The summary below is the orchestrator's checklist, not a
substitute for the register.

| Section | Register | Main edits |
| --- | --- | --- |
| ThesisAndFraming | 05 s1 | dense 1,979 TFLOPS FP8 and ridge 412 with sparse as labelled aside; fix Trainium and Cerebras front-end sentences; add Groq 3 LPX to the heterogeneity list |
| HeterogeneityFact | 05 s2 | drop "coherent", fix Cerebras and Trainium rows, LPX rack and Trn3, cut HyperCIM row |
| RooflineAndArithmeticIntensity | 05 s3 | dense and sparse per cell, add B200/B300/Rubin/MI355X/Trn2/Trn3 rows, fix FP16 arithmetic, precision-step mental model |
| MemoryHierarchyPrimer | 01 s1 | fix tier numbers in tower; add HBF and NVMe flash tiers with sourced numbers from hbf.md and flash-cache-tier.md |
| KernelExecutionLifecycle | 02 s5 | latency table to Tier 3 measured values or cut; two-level scheduler model; cut forward-reference list |
| HbmAndBandwidthWall | 01 s2 | B200/B300/Rubin/MI355X/Trn3 rows replace UNKNOWNs; HBM4 status; fix diagram overflow |
| MainMemoryAndCxl | 01 s3 | MRDIMM generations, LPDDR6, SOCAMM2, CXL 3.x/4.0 status; rebuild MemoryTechGrid with HBF and flash columns |
| HBF (new) | hbf.md | new section, outline below |
| Flash cache tier (new) | flash-cache-tier.md | new section, outline below |
| ChipletAndInterconnect | 04 s3 | cite or cut each of the 28 prose numbers; UCIe 3.0; cut the unsourced Xeon numeric row |
| GravitonDeepDive | 03 s3 | Graviton5 families and GA dates; pin the getting-started link; replace The Register with Tier 1/2 |
| AmdEpycTurin | 03 s4 | per register |
| IntelXeon6 | 03 s5 | per register |
| NvidiaHopper | 02 s1 | AWS row (P5 = H100, P5e/P5en = H200), sparse labels, the 1.9x roofline-delivered number with batch footnote, P5 price cut |
| NvidiaBlackwell | 02 s2 | sparse/dense pairs, compute capability 10.0/10.3, B200 vs B300 practical block, TMEM accumulator model, pin CUTLASS link, successor note |
| GraceBlackwellUltraServer | 02 s3 | bidirectional labels, dense FP4 gain for GB300, EP=64 attributed to NVIDIA, Grace 512 GB/s vs 384 GB/s doc conflict, AWS sizes and sales-only P6e-GB300 |
| EdgeSharedMemorySilicon | 04 s6 | per register |
| NvidiaCompilersAndTooling | 02 s4 | Inductor story, Triton division of labour, CuTe DSL, Gluon, CUDA Tile; pin wide_ep link; cut version-history Alert |
| AwsCustomSilicon | 03 s1 | Trainium3 specs and UltraServer Gen1/Gen2, Trainium4 roadmap, Inferentia status |
| AwsCompilersAndTooling | 03 s2 | Neuron 2.32.0, NKI GA, vLLM Neuron, NxD Inference maintenance |
| CerebrasWaferScale | 04 s1 | CS-4 and WSE-3T, IPO, AWS Bedrock status scoped, current catalog |
| GroqSambanovaDataflow | 04 s2 | NVIDIA licence and Groq 3 LPX, GroqCloud status, SN50 roadmap |
| ComputeInMemory | 01 s5 | per register |
| KvCacheAndFlashAttention | 01 s4 | recompute the worked example from pinned config.json; FA3/FA4; link forward to the flash cache tier section |
| MoeAndSparseActivation | 05 s23 | fix the four backwards sentences, refresh model lineup, Trn3/LPX rows, pin wide_ep at v1.2.1 |
| SmallLanguageModels | 04 s7 | per register |
| QuantizationAndPrecision | 05 s25 | re-source 415/690 GB, TF32 fix, max-magnitude column, MXFP8 row, natively 4-bit checkpoints |
| DisaggregatedServingAndSpeculative | 05 s26 | per-instance vs per-GPU EFA, NVLink one-way, Leviathan formula, Dynamo/llm-d, Vera Rubin + LPX example, KV-per-token range |
| CommunicationAndScaleOut | 04 s4 | per register |
| IsolationNie | 03 s6 | remove fabricated B300 MIG row and unsourced NIE figures; MIG tables from the MIG User Guide |
| DeterminismAOT | 04 s5 | per register |
| CapitalMarketsLens | 05 s30 | EFA market-data claim, CXL latency, SIMM v2.8, NIE "inspectable", cut the research-arc and biography expandables |
| GlossaryAndSources | orchestrator | regenerate sources from the registry, glossary without unsourced numbers, new acronyms |

Shared-file work (orchestrator only): App.tsx navigation (two new sections
after DDR5/MRDIMM/LPDDR5X/CXL, em-dashes out of titles, renumbering),
GlossaryAndSources, README.md, sources.md (generated), `.gates.json`.

## New sections (outline completed after hbf.md and flash-cache-tier.md)

### High Bandwidth Flash (nav id `hbf`, file `HighBandwidthFlash.tsx`)

Register: `research/2026-10-refresh/hbf.md` (8 topics, 26 UNKNOWNs).
Mental model: an HBF stack is a 512 GB read-mostly shelf on the accelerator
package that can be read end to end about 3 times a second (an HBM4 stack:
about 80), so it pays off for data that is large, rarely rewritten and only
partly touched per token.

h2 outline (payoff in each description):
1. A NAND stack wired like HBM: 16 NAND dies on a controller base die, 0.4 to
   3 TB/s and 512 GiB per stack, and which jobs (write order, wear levelling,
   refresh) move from the drive to the host software.
2. Sweeps per second decides what belongs on it: bandwidth over capacity puts
   HBF near 3 per second and HBM4 near 80.
3. What to put on it and what to keep in HBM: MoE expert pools, resident
   models and shared context on HBF; per-token KV cache and activations in HBM
   or SRAM (Google: "infeasible for KV Cache data updated for every query or
   generation token"; a simulated drop-in KV pool wore out at 0.56x the SSD
   pool's life).
4. Reading wears flash too: 24 h power-on retention, host refresh every 24 to
   48 h, read-disturb refresh, and the three datasheet numbers to ask for.
5. Each HBF site trades HBM bandwidth for capacity: one HBM4 stack swapped for
   one HBF stack adds about 476 GB and gives up 1.2 to 1.7 TB/s.
6. What exists and what to plan for: a v0.7.0 specification, one taped-out die,
   device samples targeted for 2027 (roadmap), no accelerator product
   announcement located.

Diagrams: stack cross-section; sweeps-per-second log bars; package comparison
(eight HBM, eight HBF, six HBF plus two HBM); optional placement map (reads per
write against share read per step).

### Flash as a Cache Tier for Inference (nav id `flash-cache-tier`, file `FlashCacheTier.tsx`)

Register: `research/2026-10-refresh/flash-cache-tier.md` (160 rows, 59
sources). Mental model: reading a prefix's KV from a tier beats recomputing it
once the tier delivers more than GPU FLOPS x KV bytes per token / prefill FLOPs
per token. For a dense 70B on an 8x H100 node that is about 17 GB/s per node
(about 2 GB/s per GPU) [derived], so the NVMe already in every P5 and P6 is
fast enough; what flash adds is memory time (about an hour of a busy node's
prefixes against about 100 seconds in HBM, [derived]).

h2 outline (payoff in each description):
1. When reading KV beats recomputing it: one ratio and one number decide
   whether any tier is fast enough before you buy it.
2. How long each tier remembers: match the tier to the gap between a user's
   turns or an agent's tool calls.
3. The flash you already pay for on P5 and P6: 8 x 3,800 GB instance store,
   4.4M random-read IOPS, and the setting that turns it into a KV tier; EBS
   (12,500 MB/s cap) sits below the break-even.
4. Sharing context across nodes: FSx for Lustre with EFA and GDS (1,200 Gb/s
   per client, not Trn2), storage vendors' context-memory products (every TTFT
   multiplier a vendor claim), HyperPod's managed tiered KV cache.
5. Who moves the bytes: GDS or a host bounce, small-block drives and
   GPU-initiated I/O, block layout against I/O size.
6. Flash on the package: the contrast with High Bandwidth Flash.
7. Close on the order of operations (host DRAM tier, local flash with an
   admission filter, shared flash) and what to monitor.

Diagrams: break-even chart (bandwidth needed against prefix length for four
model and GPU pairs, with tier bands); tier ladder (bandwidth and capacity per
GPU); memory clock (how long each tier holds a busy node's prefixes, with
reuse events); block-to-I/O-size diagram.

## Authoring waves

At most three agents run at once (Carlos's rule after the usage-limit stops).
Each agent owns one section file, its diagram components and its source file.
Waves are pipelined: a slot that frees is refilled from the queue.

1. **Wave 1 (research complete first):** the five NVIDIA sections and the
   seven workload sections.
2. **Wave 2:** the six AWS and CPU sections and the seven other-architecture
   sections.
3. **Wave 3 (memory, depends on hbf.md and flash-cache-tier.md):** the two new
   sections, then MemoryHierarchyPrimer and MainMemoryAndCxl (their diagrams
   place HBF and the flash tier), then HbmAndBandwidthWall,
   KvCacheAndFlashAttention and ComputeInMemory.
4. **Shared files:** App.tsx, GlossaryAndSources, README.md, sources.md,
   `.gates.json`.
5. **Verification:** one agent per changed section runs the adversarial fact
   check (try to refute each new or changed quantitative claim against its
   cited source) and scores the section against the section-shape standard
   (Gate 3: no section below 7/10, average at least 8/10). Corrections only.

Gate between waves: the wave's sections mount in the test, typecheck and lint
are clean, the per-file gate hits are zero, and each changed diagram has a
clean probe at 1440 and 390 plus a visual read of the PNGs.

## Budget counters

Updated at each gate.

| Counter | Value |
| --- | --- |
| Research agents dispatched | 5 area (3 resumed after a usage stop) |
| Sections modified | 0 |
| Commits | see git log |

## Cross-section notes for later authors

Collected from change reports so a later section does not contradict an
earlier one.

- Grace-Blackwell: two AWS pages give different EFA bandwidth per GPU for
  P6e-GB200 (400 vs 800 Gbps); the section shows both. Any section quoting EFA
  per GPU for GB200 (Disaggregated Serving, Communication and Scale-Out) must
  use the same pair, not one number.
- Grace-Blackwell: large-scale expert parallelism in TensorRT-LLM is from
  v0.21.0 and EP=64 is NVIDIA's DeepSeek-R1 layout. MoeAndSparseActivation
  still carries the old Wide-EP wording.
- Hopper: P5 = H100; P5e and P5en = H200; p5.4xlarge exists.
- Blackwell: B200 is compute capability 10.0, B300 10.3, Rubin 10.7;
  `compute_100f` builds run on all three.
- Thesis and Framing: anchor is H200 FP8 1,979 TFLOPS dense, ridge about 412
  FLOP/byte [derived]; sparse only as a labelled aside. Branch mispredict
  penalty uses LLVM's 10 to 14 cycles. Groq 3 LPX keeps DRAM behind its SRAM
  (never "SRAM-only") and is in full production since August 2026.
- NVIDIA Compilers and Tooling: Inductor sends linear-layer matmuls to ATen
  (cuBLAS/cuBLASLt) by default; batched, INT8 and FP8 matmuls can still pick
  Triton; CUTLASS is opt-in through `max_autotune_gemm_backends`. Sizes never
  route a matmul to CUTLASS. Kernel Execution Lifecycle and AWS Compilers and
  Tooling must not say "Inductor emits Triton for everything".
- Roofline: Rubin HBM4 per-GPU bandwidth appears three ways on NVIDIA pages: 22 TB/s
  (HGX individual GPU), 19.2 (Vera Rubin NVL72 page) and 16.25 (HGX Rubin NVL8 board,
  130 TB/s / 8). The roofline uses 22. Any section quoting Rubin bandwidth or a Rubin
  ridge names which figure it uses.
- Heterogeneity Fact: Trainium2 already has ISA support for dynamic shapes and control
  flow (Trainium2 architecture page); never write that Trainium3 "adds" them alone.
- AWS Trainium: Trn2 is a 4x4 2D torus per trn2.48xlarge (each chip links to 4
  neighbours; 6 of the other 63 in a Trn2 UltraServer); Trn3 links chips to switches:
  256 GB/s intra-server, 320 GB/s inter-server, 128 GB/s inter-rack, bidirectional per
  chip. Never write "one hop to any chip" for Trn3, and NeuronLink is not a coherent
  memory domain. Trainium3 NeuronLink-v4 per chip appears as 2.56 TB/s, 2,048 GiB/s and
  2 TB/s on three AWS pages; quote the one used with its source. The NCCL v2.28.3-1
  release record (`ncclV2283`) is shared with Communication and Scale-Out.
- Graviton: Graviton5 is one 192-core package that runs as two NUMA nodes on 16xlarge
  and 48xlarge; LLC is 48 MB per NUMA node up to 16xlarge and 96 MB per node on 24xlarge
  and 48xlarge (AWS processor table, README at 8b322a4). Never "NUMA eliminated", never
  "one 192 MB L3". The full fact list for Chiplet and Interconnect is in
  revamp/authoring/GravitonDeepDive.md, "Graviton5 NUMA facts".
- AWS Compilers: Trainium MoE NKI kernels shipped in Neuron 2.28.0 (not 2.27.0); NxD
  Inference is in maintenance and vLLM Neuron is the serving path. No AWS statement
  makes the NEFF deterministic beyond its instruction order, which is fixed at compile
  time; collective latency still depends on HBM load. Determinism: NEFF and GPU
  Reproducibility and Isolation keep the claim scoped to instruction order or source it.
- Intel Xeon 6: AWS r8i (6985P-C, 96 cores, 480 MB L3) runs SNC3: three NUMA nodes,
  each a compute tile with 160 MB L3 and four DDR5-7200 channels. Model weights do not
  fit in L3, so small-batch CPU decode is bound by memory bandwidth, not AMX; Small
  Language Models must not imply otherwise. The bandwidth figure is a "NUMA-local read",
  never "STREAM triad per socket" (DDR5, MRDIMM, LPDDR5X and CXL still says that).
  Topology facts for Chiplet and Interconnect are in revamp/authoring/IntelXeon6.md.
