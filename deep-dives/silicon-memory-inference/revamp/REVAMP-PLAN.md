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

## Headline findings

Verdict counts are filled in per register as each completes (section below).

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
   Inductor to CUTLASS. In PyTorch v2.14.1 every matmul goes to ATen
   (cuBLAS/cuBLASLt) unless max-autotune is on, and CUTLASS templates also need
   `"CUTLASS"` in `max_autotune_gemm_backends` (code-confirmed, 02 C3).
7. **Neuron moved**: Neuron 2.32.0 is current, NKI left beta in 2.29.0, NxD
   Inference is in maintenance and vLLM Neuron is the serving path; Inf2 and
   Trn1 lost NxD Inference support.
8. **Section numbers in prose are already off by one family** in several
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

### High Bandwidth Flash (nav id `hbf`)
Outline: to be written from `research/2026-10-refresh/hbf.md`.

### Flash as a Cache Tier for Inference (nav id `flash-cache-tier`)
Outline: to be written from `research/2026-10-refresh/flash-cache-tier.md`.

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
