# Change report: CapitalMarketsLens (nav id `capital-markets`)

Register: `research/2026-10-refresh/05-workloads.md`, "Section 30 - CapitalMarketsLens"
(claims 30.1 to 30.48 and Recommended edits) and "Cross-section findings for the
integrator" (item 5, section numbers). CXL latency: `01-memory.md` (T7c, P31, C30;
[T3-1] Pond). NIE, Graviton5, EPYC and Xeon: `03-aws-cpus.md` (G10, A21, A38, I2, I3,
I10 to I14, I25, I26). Determinism wording follows `04-other-arch.md` section 5 (DA3,
DA30, DA32, recommended edit 1) so this page does not contradict the Determinism
section.

Files: `src/sections/CapitalMarketsLens.tsx`, `src/components/TickToTradeDiagram.tsx`,
`src/sources/CapitalMarketsLens.ts` (new, 25 records, all cited). Shared records reuse the URL,
title, publisher and tier already in use: `pond` (HeterogeneityFact.ts),
`gravitonReadme`, `blackwellArchitecture` (GraceBlackwellUltraServer.ts),
`ec2AcceleratedSpecs` (several), `xeon6Brief` (FlashCacheTier.ts; its title names PCIe,
so the MRDIMM citation carries a note).

Fetched during authoring (records carry 2026-10-17):
- EFA user guide, "EFA limitations": "EFA traffic can't cross Availability Zones or
  VPCs"; "EFA traffic is not routable"; both apply to the EFA device, not the ENA IP path.
- AMD Solarflare X4 SDCI white paper (Tier 2, as 03 [T2-14]): "Eflatency is implemented
  using ef_vi, a latency-optimized network layer L2 kernel bypass library for AMD
  Solarflare adapters"; sfnt-pingpong "can be accelerated transparently using the Onload
  kernel bypass preload"; "The financial technology (or Fintech) market requires ...
  specialized multicast processing".
- European Commission C(2026) 3647 (4 June 2026): "The market risk requirements laid
  down in Regulation (EU) 2024/1623 will start to apply as of 1 January 2027"; relief
  measures "until 31 December 2029". It also confirms the June 2025 act (postponement to
  1 January 2027) was "the Commission's final possibility to delay". The register's
  finance.ec.europa.eu item had no full URL; this document supersedes it for the
  current date and adds the 2029 relief.
- PRA news, 19 June 2026: "implement its adjustments to the IMA on its
  previously-announced implementation date of 1 January 2028"; "all other rules come
  into force in January 2027".
- OCC News Release 2026-16 (19 March 2026): three proposals, market risk included;
  "Comments on all three proposals must be received by June 18, 2026"; no effective date.
- differential-machine-learning/notebooks README at 155055e: DifferentialML "is the main
  demonstration notebook" and reproduces "the Bachelier example in the section 3.1";
  DifferentialMLTF2 "is an upgrade ... for TensorFlow 2.x"; DifferentialRegression and
  DifferentialPCA as described. No autocallable or Danske netting-set notebook.

Word count (rendered `main`, citation badges and SVG text excluded):
- Expandables closed: 1,773 before, 2,319 after (+31%).
- Expandables open: 2,583 before, 2,414 after (-7%).

Reasons for the visible growth, per block: the three closing questions moved out of a
collapsed ExpandableSection so the section ends on the reader's next action (about 230
words that were already on the page); the FRTB dates paragraph is register NEW (30.23,
about 75 words); the EFA scope paragraph is the 30.9 fix (about 60 words); section names
replace section numbers and acronyms are expanded at first use. Cut to compensate: the
research-arc expandable, the Savine biography, the TF1 graph-mode paragraph, two
failure-table rows and the "10,000-CPU grid" sentence.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| 30.9 | OS-bypass receive via "Solarflare or AWS EFA, DPDK" (prose and diagram stage 2) | Onload or ef_vi on AMD Solarflare adapters, or DPDK; EFA traffic is not routable, cannot cross AZs or VPCs, and libfabric's EFA provider lists no multicast capability, so EFA is the in-cluster fabric and not the feed receive path | amdSdciWhitepaper (T2), efaUserGuide (T1), libfabricEfaMan (T1) |
| 30.10 | CXL "adds 200-400 ns", "a 300 ns hop" | in Pond's estimates, 70 to 90 ns over same-NUMA-node DRAM for an 8 to 16 socket pool, more than 180 ns for rack-scale pooling; the 70 to 90 ns figure repeated in the CXL Alert | pond (T3, simulated) |
| 30.5 | "Cross-CCD ... ~150 ns over intra-CCD" | about 150 ns between cores on different CCDs against about 45 ns within one, measured on an EPYC 9575F | chipsAndCheeseTurin (T3, measured) |
| 30.17 | Alert header "The headline result, vendor-cited" | "The headline result (authors' measurement)" | hugeSavine (T3, measured) |
| 30.22 | "FRTB IMA is the BCBS d457 framework, January 2019, that defines expected-shortfall internal models" | BCBS d457 (January 2019) sets the market-risk framework, including the expected-shortfall internal models approach | bcbsD457 (T1) |
| 30.24 | "ISDA SIMM Methodology v2.4 §A.2" | version 2.8+2512, in effect from 11 July 2026; quote kept ("SIMM uses sensitivities as inputs", Section A paragraph 2) | simmMethodology, simmAnnouncement (T1) |
| 30.25 | "Six risk classes, three sensitivity types (delta, vega, curvature)" | six risk classes; margin is the sum of delta, vega and curvature margins, curvature computed from vega inputs, plus a base correlation margin for credit qualifying risk | simmMethodology (T1) |
| 30.44 | "NIE Isabelle/HOL proof for tenant isolation evidence"; "The Isabelle/HOL proof script for NIE is inspectable" | audit bullet: the NIE white paper states what the Isabelle/HOL proof covers and assumes; Q2: proof covers confidentiality and integrity of each VM's private data across VM creation and configuration, vCPU management and memory management; outside it: micro-architectural side channels such as caches, and scheduling (kept by the deprivileged Nitro Hypervisor); AWS plans to make source and proofs available to third parties | nieWhitepaper (T1), nieComputeBlog (T2) |
| 30.43 | "Graviton5 distributed L3 for cache-friendly working sets" | 96 MB of LLC per NUMA node on 24xlarge and 48xlarge, 48 MB on 16xlarge and smaller | gravitonReadme (T1) |
| 30.4 | Failure row "Hypervisor scheduling jitter ... NIE on Graviton5" | row removed; NIE appears as tenant isolation (trading list) and isolation evidence (audit list, Q2), never as a jitter fix | nieComputeBlog (T2) |
| 30.42 | "Trainium NEFF AOT for bit-exact reproducibility"; "eliminates kernel-selection variance entirely" | "Trainium with the NEFF, rounding seed and batch shape pinned, so a result can be replayed"; failure row: fix the batch shape or turn on batch-invariant serving (vLLM `VLLM_BATCH_INVARIANT=1`, beta), and on Trainium also pin the NEFF and a fixed rounding seed | vllmBatchInvariance (T1), neuronEnvVars (T1) |
| 30.46 | "the cleanest p99.9 story available on a public cloud" | NUMA pinning and MIG each remove one source of contention, neither sets the number; measure p99.9 on the instance and build you will deploy | none (no number; reasoning) |
| 30.47 | "dedicated colocation ... still wins on absolute wall-clock" | labelled "Our reading", with the reason (feed arrives as multicast UDP; EFA traffic not routable and provider lists no multicast) | efaUserGuide, libfabricEfaMan (cited earlier on the page) |
| 30.27 | "no longer a 10,000-CPU grid; it is a fleet of inference accelerators" | "Our reading, since the paper claims faster approximation rather than a change of hardware": the pipeline moves toward small dense-network inference, mapped onto GPUs, Trainium or Inferentia, and CPU AMX or SVE2 | hugeSavine (T3); gravitonReadme (T1) for SVE2 on Graviton4 and Graviton5 |
| 30.31 | org and repo root links | notebooks pinned at 155055e, appendices at 585675e | dmlNotebooks, dmlAppendices (T1) |
| 30.36 | appendices repo "four PDFs" (inside the cut expandable) | "four companion appendices" | dmlAppendices (T1) |
| 30.12 | "keep the working set in tier 5 or above ... never miss to tier 6" | "stays in the last-level cache (LLC) or closer ... misses to DRAM are the exception", pointing to Memory Hierarchy Primer (tier numbers are being restructured in this revamp) | none (definitional) |
| 30.3 | NUMA cost "Tens of ns over local DRAM" | "Every miss pays the remote node's latency" (no number) | none |
| 30.41 | "NPS4 / SNC3" | "Threads and memory pinned to one NUMA node" | none |
| 30.13 | "thousands of market scenarios per day ... millions of pricing function evaluations" | "the values and sensitivities of a derivatives book are recomputed across many market states" | hugeSavine (T3, page 2) |
| 30.21 | quote began "Regulations like ..." | verbatim lowercase "regulations like ..." (mid-sentence in the paper) | hugeSavine (T3) |
| 30.11 | "MRDIMM where Xeon 6 6900P is acceptable" (trading path) and "Xeon 6 6900P with MRDIMM-8800" | MRDIMM kept only in the risk and analytics list: "Xeon 6 with MRDIMM at 8,800 MT/s for bandwidth-bound analytics" | xeon6Brief (T1) |
| 1.21-style | every "Section N" reference (Sections 1-27, 7, 8, 9, 10, 11, 12, 13, 17, 18, 25, 26, 27, 28, 29) | section names from the brief's table | none needed (internal) |

CORRECT claims kept and re-cited: 30.1 (vocabulary table), 30.2 (MIG, migConcepts with
the memory QoS quote), 30.7 (illustrative 1 µs example), 30.13 (workload list), 30.14
(2 to 5 evaluations, footnote 3 p.5), 30.15 (Smoking Adjoints 2006, smokingAdjoints),
30.16 (abstract), 30.18 to 30.20 (Danske benchmark, measured), 30.26 (matrix-by-vector
quote), 30.30 (Huge then at Danske Bank: dropped with the biography), 30.37 (SVE2,
gravitonReadme), 30.39 (NIE on every Graviton5 instance, nieComputeBlog), 30.40 (M8azn
5 GHz, m8aznGa), 30.45 (Blackwell TEE-I/O, blackwellArchitecture).

## Claims removed

- "The broader research arc" expandable (CUT candidate): notebook and appendix
  inventory, the "TF1 code in TF2" paraphrase (30.33), "four PDFs" (30.36), "Axes that
  Matter" (30.35, UNKNOWN), the three-deployable-shapes paragraph. One sentence on the
  regression and PCA notebooks survives in "Reference implementation and where to start".
- "TF1-graph-mode advantage matters for Trainium" (30.38, CUT, speculation).
- Savine biography expandable (CUT): 30.28 and 30.29 go with it.
- "autocallable plus Danske netting set benchmarks" in the notebooks description: the
  README at 155055e lists no such notebook.
- Failure row "NCCL kernel launch consuming SMs ... NIXL" (30.6 UNKNOWN; not a
  capital-markets failure and the NCCL half is stale per 26.12).
- Failure row "Hypervisor scheduling jitter ... NIE" (30.4 UNKNOWN; NIE is isolation).
- "The full round trip is in the low microseconds" (30.8 UNKNOWN) and every per-stage
  latency budget in the diagram (30.48 UNKNOWN). The brief says an unsourceable number
  does not ship, so the diagram shows ownership of each stage instead of an illustrative
  budget.
- "computed daily for every UMR-in-scope counterparty" (SIMM): unsourced.
- "Confidential computing across the stack": unsourced; 03 I26 found no EC2
  documentation for GPU confidential computing.
- "Each piece maps to a specific compliance framework (Section 28 covered the
  mapping)": 03 I15 marks that regulation mapping WRONG/UNKNOWN and a CUT candidate.
- "HBM-class memory on accelerators" and MRDIMM from the trading-path paragraph: the
  trading path needs latency, and MRDIMM latency is UNKNOWN (01 C17).
- "CXL is the most-asked-about memory topic": unsourced superlative.
- The audit-column "Trainium NEFF replay" bullet now lives once, in the regulated
  inference column, to avoid a duplicate.

## UNKNOWNs and how the page handles them

- 30.3 NUMA cost: number dropped; the row states the mechanism only.
- 30.4 NIE and jitter: row removed; NIE never mapped to jitter.
- 30.6 NCCL and SMs: row removed.
- 30.8 and 30.48 latency budgets: removed (see above).
- 30.27 hardware shift: labelled "Our reading" with the paper's actual claim stated.
- 30.35 "Axes that Matter": removed with the expandable.
- 30.38: cut.
- 30.41 NPS4/SNC3: replaced by the mode-independent instruction (pin to one NUMA node).
- 30.42 bit-exact Trainium: replaced with the replay conditions sourced in 04 (NEFF,
  rounding seed, batch shape).
- 30.46 superlative: removed.
- US final FRTB rule: "no final US rule was located during this research" (scoped).
- CXL on EC2: "No EC2 instance with CXL-attached memory was located during this
  research" (01 C30 absence finding, scoped).
- GPU confidential computing on EC2: "no EC2 documentation for GPU confidential
  computing was located during this research" (03 I26, scoped).

## NEW content and its sources

- FRTB application dates (30.23): EU 1 January 2027 with relief to 31 December 2029
  (euFrtbDelegatedAct, T1, fetched); UK PRA IMA 1 January 2028, other Basel 3.1 rules
  January 2027 (praFrtbIma, T1, fetched); US proposal 19 March 2026, comments by 18 June
  2026 (usCapitalProposal, T1, fetched).
- EFA scope paragraph (30.9): efaUserGuide (T1, fetched), libfabricEfaMan (T1, pinned).
- Onload and ef_vi as AMD Solarflare kernel-bypass libraries, and the fintech multicast
  requirement: amdSdciWhitepaper (T2, fetched).
- Determinism fix in the failure table: vllmBatchInvariance, neuronEnvVars (T1, from 04).
- P5en "eight NVIDIA H200 GPUs": ec2AcceleratedSpecs (T1; 02 H33).

## Diagram

`TickToTradeDiagram.tsx` rebuilt. Before: seven equal columns in a 920-unit viewBox with
a fixed 360 px height, `aria-label`, an em-dash in the in-SVG heading, EFA named as a
receive path, and unsourced latency budgets in every box. After: two lanes. The network
stack lane holds stages 1, 2 (in) and 6, 7 (out); the silicon and memory lane holds
stages 3 to 5; elbow connectors run 2 to 3 and 5 to 6 through a clear corridor. Stage 2
reads "Onload, ef_vi or DPDK hands it to user space"; no EFA. No numbers other than stage
numbers. `role="img"`, `aria-labelledby="tick-to-trade-title"` with a `<title>` stating
what the diagram asserts, `viewBox="0 0 760 320"` only, full-bleed white background rect,
`sans-serif`, smallest font 11 units, class prefix `ttt-`, marker `ttt-ah`. Phone
convention applied: `overflowX: 'auto'` wrapper, svg `minWidth: 640`.

Rendered check (`scripts/shoot.mjs --widths 1440,390`): "1 SVG diagram(s), ok" at both
widths, no page-level horizontal overflow. PNGs read: at 1440 every label sits inside its
box with margin, arrows land on box edges without crossing text, the 2-to-3 and 5-to-6
connectors stay in the corridor between lanes and clear of both lane labels. At 390 the
svg holds 640 px and scrolls sideways inside its wrapper; text renders near 9 px and
stays legible; the page itself does not overflow. Full-page PNGs at both widths show the
tables wrapping and the four-column list collapsing to one column on the phone.

## Leverage pass: claim-set diff

Blocks and what they now do for the reader:
- Tick-to-trade: model (network stack owns stages 1, 2, 6, 7; silicon and memory own
  3 to 5, now drawn as two lanes) and practice (EFA is the cluster fabric, not the feed
  path; the feed path is Onload, ef_vi or DPDK).
- Failure table: practice (each failure paired with the knob to set before measuring).
- Where CXL fits: model (capacity tier with a per-access cost) and practice (keep it off
  the trading path; none located on EC2).
- Differential ML: model (AAD gives all sensitivities at 2 to 5 pricings; trained twin
  network turns risk into small dense inference) and practice (FRTB dates, SIMM version,
  pinned repos to run).
- Where each workload lands and the three questions: practice, ordered last as the
  reader's next action.

New assertions in the after that were not in the before, each with its source:
1. EFA traffic is not routable and cannot cross Availability Zones or VPCs: efaUserGuide.
2. libfabric's EFA provider lists no multicast capability: libfabricEfaMan.
3. Onload is a kernel-bypass preload under the sockets API and ef_vi a layer-2 library,
   on AMD Solarflare adapters: amdSdciWhitepaper.
4. Exchange feeds arrive as multicast UDP: amdSdciWhitepaper (note quotes the fintech
   multicast requirement); register 30.9.
5. CXL adds 70 to 90 ns (8 to 16 socket pool) and more than 180 ns (rack scale): pond.
6. No EC2 instance with CXL-attached memory was located: 01-memory C30 (scoped silence).
7. Cross-CCD about 150 ns against about 45 ns within a CCD on EPYC 9575F:
   chipsAndCheeseTurin (measured).
8. MIG instances have dedicated memory and memory bandwidth: migConcepts.
9. Batch-invariant serving in vLLM (`VLLM_BATCH_INVARIANT=1`, beta): vllmBatchInvariance.
10. Fixed rounding seed for Trainium reproducibility: neuronEnvVars.
11. EU 1 January 2027 and relief to 31 December 2029: euFrtbDelegatedAct.
12. UK PRA IMA 1 January 2028, other rules January 2027: praFrtbIma.
13. US proposal 19 March 2026, comments by 18 June 2026: usCapitalProposal; no final rule
    located (scoped silence, register 30.23).
14. SIMM v2.8+2512 in effect 11 July 2026; margin composition: simmAnnouncement,
    simmMethodology.
15. NIE runs on every Graviton5 instance: nieComputeBlog.
16. NIE proof scope and exclusions: nieWhitepaper. AWS plans to share source and
    proofs with third parties: nieComputeBlog.
17. Graviton5 LLC 96 MB per NUMA node (24xlarge, 48xlarge), 48 MB (16xlarge and
    smaller): gravitonReadme.
18. Graviton4 and Graviton5 support SVE2: gravitonReadme.
19. P5en carries eight H200 GPUs: ec2AcceleratedSpecs.
20. DifferentialML reproduces the Bachelier example; DifferentialMLTF2 is the maintained
    TensorFlow 2 upgrade; regression and PCA notebooks; four companion appendices:
    dmlNotebooks, dmlAppendices.
21. No EC2 documentation for GPU confidential computing was located: 03-aws-cpus I26
    (scoped silence).

Two sentences are labelled as our reasoning rather than sourced fact: the hardware
implication of Differential ML (30.27) and the colocation answer (30.47).

## For the orchestrator

- Glossary acronyms used in this section (expanded at first use on the page): HFT, NIC,
  UDP, DPDK, EFA, VPC, SLA, HBM, MIG, NUMA, CCD, NEFF, CXL, OLAP, LLC, FRTB, IMA, CCR,
  CVA, xVA, ISDA, SIMM, RWA, AAD, BCBS, PRA, PCA, NIE, MRDIMM, AMX, SVE2, NVFP4,
  TEE-I/O, RAG, MoE.
- `sources.md` needs regenerating; `src/__tests__/sources.test.ts` reports only the
  sources.md drift for this file (tier-consistency checks pass).
- Tier decisions that differ from register 05: Huge and Savine (arXiv) and Giles and
  Glasserman's "Smoking Adjoints" (an academic paper in Risk) are Tier 3 under the
  brief's academic-paper rule, with results marked `measured`. The arXiv record pins v4
  (`https://arxiv.org/abs/2005.02347v4`).
- Cross-section notes for later authors:
  - EFA is not a market-data receive path: EFA traffic is not routable, cannot cross AZs
    or VPCs, and libfabric's EFA provider lists no multicast capability. Communication
    and Scale-Out should not say otherwise.
  - NIE is isolation evidence, not a jitter fix. Its proof excludes micro-architectural
    side channels and scheduling; source and proofs are planned for third parties, not
    "inspectable" today. Isolation: NIE and MIG should match.
  - Trainium reproducibility is phrased as "NEFF, rounding seed and batch shape pinned",
    matching the Determinism register; no "bit-exact by construction".
  - CXL latency uses Pond's 70 to 90 ns (8 to 16 socket pool) and more than 180 ns
    (rack scale) as `simulated`, with the HeterogeneityFact `pond` record.
