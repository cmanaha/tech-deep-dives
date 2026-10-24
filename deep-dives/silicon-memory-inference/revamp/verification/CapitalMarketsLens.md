# Verification: Capital markets lens

Verified: 2026-10-23. Claims checked: 43 (sampled: 0). Confirmed 39, wrong 1,
unsupported 3, mislabelled 0, unverifiable 0. Two record titles were also wrong (`pond`
named Figure 4, `xeon6Brief` named a PCIe rate) and one cited URL was dead (`neuronEnvVars`
at `/en/latest/`); all three are fixed.

## Gate 3 score: 8/10

Every figure on the page now traces to its source at the stated location, and the NIE answer
a risk team would repeat to a regulator lists all five things the proof leaves out, in the same
terms as *Isolation: NIE and MIG*. The one wrong claim (the Danske result called a "risk"
approximation where the paper charts values, "not derivatives") and the three unsupported ones
were fixable as corrections. Economy holds it at 8: the page is +31% visible and carries about
150 words of cut candidates (Backlog).

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 39 of 43 confirmed on first read; the wrong Danske wording and the incomplete NIE exclusion list were load-bearing and are fixed; CXL 70 to 90 ns, CCD 45/150 ns, FRTB, SIMM dates all confirmed at the cited page |
| Mental model or practical value | 8 | Tick-to-trade lanes (model: who owns which stage), EFA scope (practice: not the feed path), failure table (knob per failure), Differential ML (risk as small dense inference), workload lists (practice). The first intro paragraph mostly restates the framing paragraph after it |
| Shape | 8 | Introduces before dissecting; h2 descriptions name the payoff; 70 to 90 ns lands twice; the reference implementation sits in an ExpandableSection; ends on "Decide workload by workload" |
| Writing | 8 | no-ai-tells gate clean; attribution kept only where quotes need it ("Huge and Savine:", "In the authors' words") or it grades the source ("in Pond's estimates", "Our reading"). The intro's three "Different ..." sentences lean on cadence |
| Economy | 7 | +31% visible words (authoring report); the NIE correction adds about 20 more; about 150 words of cut candidates listed in Backlog |
| Diagrams | 9 | TickToTradeDiagram: role="img", aria-labelledby title stating the assertion, no figures drawn; shoot probe "ok" at 1440 and 390; at 390 it scrolls sideways inside its wrapper per the dive convention, labels legible, no overlap seen in the PNGs |

## Claims

Sources read 2026-10-23 with curl (default User-Agent, or the generic "Mozilla/5.0" for the
AMD PDF, which timed out twice with the default) or WebFetch. No personal data in any request.
PDFs read with pdftotext; page numbers are PDF pages.

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | Exchange feeds arrive as multicast UDP | amdSdciWhitepaper | UNSUPPORTED (UDP, exchange) | p1: "The financial technology (or Fintech) market requires low latency, wire speed packet performance, deterministic packet jitter, and specialized multicast processing." Says multicast, not UDP, not exchange feeds | New record `moldUdp64` (Nasdaq MoldUDP64 spec, T1): "MoldUDP64 transmitters send Downstream packets via UDP multicast to transport the normal data stream sent to the listeners." |
| 2 | Onload as a preload under the sockets API or ef_vi as a layer-2 library, on AMD Solarflare adapters | amdSdciWhitepaper (T2) | CONFIRMED | p1: "Eflatency is implemented using ef_vi, a latency-optimized network layer L2 kernel bypass library for AMD Solarflare adapters. Sfnt-pingpong is written using the BSD sockets API ... It can be accelerated transparently using the Onload kernel bypass preload." Header: "OCTOBER 2025 / REV 1" | |
| 3 | EFA traffic is not routable and cannot cross AZs or VPCs (prose, trading list "within one Availability Zone and VPC", Q3) | efaUserGuide (T1) | CONFIRMED | EFA limitations: "EFA traffic can't cross Availability Zones or VPCs. This does not apply to normal IP traffic from the ENA device"; "EFA traffic is not routable." | |
| 4 | libfabric's EFA provider lists no multicast capability | libfabricEfaMan (T1, pinned 24fa1dc) | CONFIRMED | RDM capabilities: "FI_MSG, FI_TAGGED, FI_SEND, FI_RECV, FI_RMA, FI_WRITE, FI_READ, FI_ATOMIC, FI_DIRECTED_RECV, FI_MULTI_RECV, and FI_SOURCE"; DGRAM "only supports FI_MSG". The word "multicast" does not occur in the file | |
| 5 | MIG instances each with dedicated memory and memory bandwidth (note quote) | migConcepts (T1) | CONFIRMED | "Each GPU slice includes dedicated GPU memory resources which limit both the available capacity and bandwidth, and provide memory QoS." | |
| 6 | About 150 ns between CCDs against about 45 ns within one, measured on an EPYC 9575F | chipsAndCheeseTurin (T3, measured) | CONFIRMED | "Intra-CCD latency: ~45ns Inter-CCD latency: ~150ns Socket to Socket latency: ~260ns" on the 9575F. Matches *AMD EPYC Turin* and *Chiplet and Interconnect* | |
| 7 | vLLM `VLLM_BATCH_INVARIANT=1`, beta | vllmBatchInvariance (T1, v0.31.0) | CONFIRMED | "Batch invariance is currently in beta."; "export VLLM_BATCH_INVARIANT=1" | |
| 8 | Trainium: set a fixed rounding seed (note); "rounding seed ... pinned" in the regulated list | neuronEnvVars (T1) | CONFIRMED at v2.32.0; cited URL dead | The `/en/latest/` URL returns the Read the Docs 404 page ("Documentation page not found", http-status 404). At `/en/v2.32.0/`: "Please set NEURON_RT_STOCHASTIC_ROUNDING_SEED to a fixed value to ensure reproducibility between runs." | Record repointed to the v2.32.0 URL and title used by DeterminismAOT.ts; note made verbatim |
| 9 | CXL adds 70 to 90 ns over same-NUMA-node DRAM for an 8 to 16 socket pool, more than 180 ns for rack-scale pooling (simulated); 70 to 90 ns repeated in the Alert | pond (T3, simulated) | CONFIRMED; record title WRONG | v4 PDF p1, Section 1 (Introduction): "analysis of CXL topologies lead us to estimate that CXL will add 70-90ns to access latencies over same-NUMA-node DRAM with a pool size of 8-16 sockets, and add more than 180ns for rack-scale pooling." Not in the abstract (arXiv abs page abstract has no "70-90"). Figure 4 (p4) is "Performance slowdowns when memory latency increases by 182-222%". p6 Section 4.1 repeats "8-and 16-socket pools adding only 70-90ns relative to NUMA-local DRAM" | Title made location-free (see For the orchestrator); location moved into the note |
| 10 | No EC2 instance with CXL-attached memory was located during this research | none (scoped silence) | CONFIRMED as scoped | Same scoped sentence in *DDR5, MRDIMM, LPDDR5X and CXL* | |
| 11 | Values and sensitivities of a derivatives book recomputed across many market states (page 2) | hugeSavine (T3) | CONFIRMED | p2: "the values and risk sensitivities of Derivatives trading books are repeatedly computed in many different market states" | |
| 12 | "It takes the time of 2 to 5 evaluations in practice to compute thousands of differentials with an efficient implementation" (footnote 3, page 5) | hugeSavine | CONFIRMED | p5 footnote 3, verbatim | |
| 13 | One reverse pass yields every sensitivity at 2 to 5 times the cost of one pricing, however many risk factors feed it | hugeSavine | CONFIRMED | p5 footnote 3: "the critical constant time property of adjoint differentiation" | |
| 14 | AAD began displacing bumping with Giles and Glasserman's "Smoking Adjoints" in Risk, January 2006 | smokingAdjoints (T3) | CONFIRMED (date) | Risk.net: "Michael Giles and Paul Glasserman 01 Jan 2006". The appendices README at 585675e: "Introduced to finance by the ground breaking Smoking Adjoints (Giles and Glasserman, Risk 2006)" | |
| 15 | Abstract quote "Differential ML is a general extension of supervised learning ..." | hugeSavine | CONFIRMED | p1 abstract, verbatim | |
| 16 | Danske benchmark: twin network on 8,192 samples gives a "virtually perfect" risk approximation, where a vanilla network needs 65,536 samples for a much rougher one | hugeSavine (measured) | WRONG (risk) | p12, Section 2.3: "a twin network trained on 8192 (8k) samples ... compared to a vanilla net, trained on 65536 (64k) samples"; "The twin approximation is virtually perfect with on only 8k examples. The classical deep approximation is much more rough with 64k examples."; "We have shown in this figure the predicted values, not derivatives" | "risk approximation" -> "approximation of the book's values"; "needs 65,536 samples for" -> "trained on 65,536 samples gives" |
| 17 | Standard errors 12.85M (classical, 64k) and 1.77M (differential, 8k), test range 200M | hugeSavine (measured) | CONFIRMED | p12: "Standard errors are 12.85M with classical 64k and 1.77M with differential 8k, for a range of 200M for the 128 test examples" | |
| 18 | "differential ML performs up to thousandfold better on small datasets" (page 10) | hugeSavine (measured) | CONFIRMED | p10, verbatim (the authors' summary of their results) | |
| 19 | "The twin network has the same degree of approximation as orders of magnitude slower nested Monte-Carlo" (Section 2.3, page 13) | hugeSavine (measured) | CONFIRMED, case | p13: "Again in this very representative example, the twin network has the same degree ..." (lowercase, mid-sentence) | "The" -> "the", as the author did for claim 20 |
| 20 | "regulations like XVA, CCR, FRTB or SIMM-MVA, where ..." (page 2) | hugeSavine | CONFIRMED | p2, verbatim | |
| 21 | "a few matrix by vector products in limited dimension, and differentiation is performed in similar time by backpropagation" (page 2) | hugeSavine | CONFIRMED | p2: "Inference is as fast as a few matrix by vector products in limited dimension, and differentiation is performed in similar time by backpropagation." | |
| 22 | BCBS d457, January 2019, market-risk framework including the expected-shortfall internal models approach | bcbsD457 (T1) | CONFIRMED | "Date Published 14 January 2019"; "an internal models approach that relies upon the use of expected shortfall models" | |
| 23 | EU: new market-risk requirements from 1 January 2027, relief until 31 December 2029 | euFrtbDelegatedAct (T1) | CONFIRMED | C(2026) 3647 final, "Brussels, 4.6.2026": FRTB application deferred "to 1 January 2027"; "the duration of the relief measures should be three years, i.e. until 31 December 2029" (recitals 2 and 4) | |
| 24 | UK PRA: IMA from 1 January 2028, other Basel 3.1 rules from January 2027 | praFrtbIma (T1) | CONFIRMED | "Published on 19 June 2026": "implement its adjustments to the IMA on its previously-announced implementation date of 1 January 2028. No other changes are being proposed and all other rules come into force in January 2027" | |
| 25 | US agencies proposed capital rules, market risk included, 19 March 2026; comments by 18 June 2026; no final rule located | usCapitalProposal (T1) | CONFIRMED; silence scoped | "News Release 2026-16 / March 19, 2026"; "The market risk aspect of the framework would apply only to banks with significant trading activity"; "Comments on all three proposals must be received by June 18, 2026." | |
| 26 | SIMM version 2.8+2512, in effect from 11 July 2026; "SIMM uses sensitivities as inputs" (Section A, paragraph 2) | simmMethodology, simmAnnouncement (T1) | CONFIRMED | PDF p2, A.2: "SIMM uses sensitivities as inputs." ISDA: "SIMM version 2.8+2512 has an effective date of 11 July 2026." | |
| 27 | Six risk classes; margin = delta + vega + curvature margins, curvature from vega inputs, plus base correlation margin for credit qualifying | simmMethodology | CONFIRMED | A.5: "There are six risk classes"; "the sum of the Delta Margin, the Vega Margin, the Curvature Margin and the Base Corr Margin (if applicable)"; "the BaseCorrMargin term is only present in the Credit (Qualifying) risk class"; C.3 para 30 defines the vega sensitivity "used as input into the vega and curvature margin calculations" | |
| 28 | SVE2 on Graviton4 and Graviton5 | gravitonReadme (T1, 8b322a4) | CONFIRMED | "Graviton4 and Graviton5 support SVE2 and SVE." | |
| 29 | DifferentialML (main notebook) reproduces the Bachelier example; DifferentialMLTF2 is the maintained TF2 upgrade; regression and PCA notebooks | dmlNotebooks (T1, 155055e) | CONFIRMED | README: "the main demonstration notebook ... reproduction of the Bachelier example"; "DifferentialML.ipynb will no longer be maintained going forward ... implemented directly in the TensorFlow 2 notebook"; DifferentialRegression, DifferentialPCA | |
| 30 | Four companion appendices, from Longstaff-Schwartz to unsupervised training in production systems | dmlAppendices (T1, 585675e) | CONFIRMED | Tree at 585675e: App1-LSM.pdf ... App4-UnsupervisedTraining.pdf (plus dixon.pdf, not an appendix); readMe: App1 "Longstaff-Schwartz (2001)", App4 "training algorithms in production systems ... without supervision" | |
| 31 | NIE runs on every Graviton5 instance | nieComputeBlog (T2) | CONFIRMED | "generally available on all Graviton5-based instances starting today" (11 JUN 2026). Matches *Graviton Deep Dive* and *Isolation: NIE and MIG* | |
| 32 | M8azn (AMD EPYC Turin) at up to 5 GHz | m8aznGa (T2) | CONFIRMED | "powered by fifth generation AMD EPYC (formerly code named Turin) processors, offering the highest maximum CPU frequency, 5GHz in the cloud" (Feb 12, 2026). Matches *AMD EPYC Turin* ("at up to 5 GHz") | |
| 33 | Xeon 6 with MRDIMM at 8,800 MT/s | xeon6Brief (T1) | UNSUPPORTED as stated (drops "up to"); record title WRONG | Brief: "MRDIMMs deliver up to 8,800 MT/s"; "an expected data transfer rate of up to 8,800 megatransfers per second". *Intel Xeon 6* gives 8,800 for 6900P and 8,000 for 6700/6500. The brief's only 32 GT/s is "Up to 64 lanes of CXL 2.0 with data transfer rates up to 32 GT/s per lane"; PCIe 5.0 appears only as lane counts | "at up to 8,800 MT/s"; note verbatim; title retitled. No PCIe 5.0 rate rests on this record |
| 34 | Graviton5 LLC 96 MB per NUMA node on 24xlarge and 48xlarge, 48 MB on 16xlarge and smaller | gravitonReadme (T1) | CONFIRMED | "48MB per NUMA (<= 16xlarge), or 96MB per NUMA (24xlarge and 48xlarge)". Matches *Graviton Deep Dive* table | |
| 35 | P5en carries eight NVIDIA H200 GPUs | ec2AcceleratedSpecs (T1) | CONFIRMED | "P5en p5en.48xlarge ... 8 x NVIDIA H200 GPU 1128 GiB (8 x 141 GiB)" | |
| 36 | NIE white paper states what the Isabelle/HOL proof covers and assumes (audit list) | nieWhitepaper (T1) | CONFIRMED | p14 "Scope of the Nitro Isolation Engine formal verification"; p22-23 gaps and assumptions | |
| 37 | Q2: proof covers confidentiality and integrity of each VM's private data across VM creation and configuration, vCPU management and memory management | nieWhitepaper | CONFIRMED | p14: "covers the first three parts of the VM lifecycle as given by the hypercall API: VM creation and configuration, vCPU management, and memory management"; property 1 "Confidentiality and integrity" | |
| 38 | Q2: outside the proof are micro-architectural side channels and scheduling (presented as the full list) | nieWhitepaper | UNSUPPORTED as a complete list | p9: the API's other two parts are "I/O device management" and "Live update and live migration"; p14: proof covers "the first three parts"; p23: "Concurrency - The current proofs use sequential reasoning and don't model concurrent execution across multiple physical CPUs." | Q2 now names all five exclusions in *Isolation: NIE and MIG*'s terms |
| 39 | AWS plans to make NIE source code and proofs available to third parties | nieComputeBlog (T2) | CONFIRMED | "we plan to make the Nitro Isolation Engine's source code and formal proofs available to third parties for independent inspection and review" | |
| 40 | Blackwell TEE-I/O for confidential computing | blackwellArchitecture (T2) | CONFIRMED | "NVIDIA Blackwell is the first TEE-I/O capable GPU in the industry" | |
| 41 | No EC2 documentation for GPU confidential computing was located | none (scoped silence) | CONFIRMED as scoped | Register 03 I26; hedge keeps its scope | |
| 42 | 1 us every time vs 800 ns most of the time and 5 us once in a thousand | none | CONFIRMED as illustrative | A hypothetical, phrased as one (register 30.7) | |
| 43 | Diagram: seven stages, multicast UDP feed, Onload/ef_vi/DPDK, NIC transmit ring; no latency figures drawn | as claims 1 to 4 | CONFIRMED | No number appears in the SVG | |

Not sampled: all 43 checked.

## ORCH-NOTES items

- **NIE proof exclusions (ORCH-NOTES :53): WRONG as a complete list, FIXED.** Q2 listed only side channels and scheduling. The white paper's API has five parts (p8-9); the proof "covers the first three parts" (p14), so "I/O device management" and "Live update and live migration" are outside it, and "The current proofs use sequential reasoning and don't model concurrent execution across multiple physical CPUs" (p23). Q2 now names I/O device management, live update and live migration, concurrency, micro-architectural side channels and scheduling, in *Isolation: NIE and MIG*'s wording. `nieWhitepaper` and `nieComputeBlog` now match IsolationNie.ts exactly (title, url, tier, accessed 2026-10-17).
- **`xeon6Brief` (ORCH-NOTES :74, :85): title WRONG, FIXED; claim UNSUPPORTED as stated, FIXED.** Retitled to exactly "Intel Xeon 6 Product Brief (up to 64 lanes of CXL 2.0 at up to 32 GT/s per lane)". The brief's only 32 GT/s figure is the CXL 2.0 line; PCIe 5.0 appears only as lane counts ("Up to 192 lanes of PCIe 5.0 for two-socket servers"). This section rests no PCIe rate on the record. Its one claim, MRDIMM "at 8,800 MT/s", drops the brief's "up to" ("MRDIMMs deliver up to 8,800 MT/s"), and *Intel Xeon 6* gives 8,000 MT/s for 6700/6500 parts; now "at up to 8,800 MT/s".
- **`pond` (ORCH-NOTES :85): title WRONG, FIXED; the premise is also off.** The quoted sentence is in neither Figure 4 nor the abstract. It is in Section 1 (Introduction), PDF page 1 of v4 (21 Oct 2022); the arXiv abstract has no "70-90". Figure 4 (p4) plots slowdowns at "182-222%" latency increase and carries the local DRAM latencies HeterogeneityFact cites through the same record, so a location-free title fits all four users and the location goes in each note. Exact title under For the orchestrator.
- **Tick-to-trade and latency figures:** the diagram draws no latency figure. The prose has three: the 1 us / 800 ns / 5 us comparison (illustrative, phrased as a hypothetical), CCD 45/150 ns (measured, Chips and Cheese, T3) and CXL 70 to 90 ns / more than 180 ns (simulated, Pond, T3). No exchange or regulator latency or clock-sync rule (SEC, FINRA, CAT, MiFID II) appears in the section, so none needed quoting. The regulatory figures present are dates (EU, PRA, US agencies via OCC, BCBS, ISDA SIMM), all Tier 1 under the standards-body and regulator ruling and all confirmed from the rule or announcement text (claims 22 to 27).
- **Cross-section matches:** no mismatch. Graviton5 LLC 96 MB / 48 MB and NIE on every Graviton5 instance match *Graviton Deep Dive*; MRDIMM matches *Intel Xeon 6* after the "up to" fix; M8azn up to 5 GHz on Turin and CCD 45/150 ns on the EPYC 9575F match *AMD EPYC Turin* (and *Chiplet and Interconnect*); P5en with eight H200 matches *NVIDIA Hopper*.
- **Length (+31% visible):** scored under Economy (7); cut candidates with word counts in Backlog.
- **Dead `neuronEnvVars` link (coordinator):** FIXED. `/en/latest/...neuron-envvars.html` serves the Read the Docs 404 page. The record is now the DeterminismAOT.ts one (title "AWS Neuron 2.32.0: JAX NeuronX environment variables (NEURON_RT_STOCHASTIC_ROUNDING_SEED)", `/en/v2.32.0/` url, tier 1, accessed 2026-10-23). That page carries the cited sentence: "Please set NEURON_RT_STOCHASTIC_ROUNDING_SEED to a fixed value to ensure reproducibility between runs."

## Fixes applied

Section, `src/sections/CapitalMarketsLens.tsx`:
- :169-172 (claim 1): added `<Cite s={S.moldUdp64} note="Nasdaq's feed transport: 'MoldUDP64 transmitters send Downstream packets via UDP multicast to transport the normal data stream sent to the listeners.'" />` before the AMD citation on "Exchange feeds arrive as multicast UDP".
- :111 (claim 8): neuronEnvVars note "NEURON_RT_STOCHASTIC_ROUNDING_SEED: set to a fixed value to ensure reproducibility between runs." -> "'Please set NEURON_RT_STOCHASTIC_ROUNDING_SEED to a fixed value to ensure reproducibility between runs.'"
- :267 (claim 9): pond note now starts "Section 1, page 1:".
- :339-340 (claim 16): `a "virtually perfect" risk approximation, where a vanilla network needs 65,536 samples for a much rougher one` -> `a "virtually perfect" approximation of the book's values, where a vanilla network trained on 65,536 samples gives a much rougher one`.
- :349 (claim 19): quote "The twin network ..." -> "the twin network ..." (verbatim case).
- :489-491 (claim 33): "MRDIMM ... at 8,800 MT/s" -> "at up to 8,800 MT/s"; note "The product brief lists MRDIMM support at 8,800 MT/s." -> "'MRDIMMs deliver up to 8,800 MT/s.'"
- :549-552 (claim 38): "..., and the paper names what sits outside it: micro-architectural side channels such as caches, and scheduling, which the deprivileged Nitro Hypervisor keeps." -> "... The paper names what sits outside it: I/O device management, live update and live migration, which the proof does not yet cover; concurrent execution across physical CPUs, because the proofs reason sequentially; micro-architectural side channels such as caches; and scheduling, which the deprivileged Nitro Hypervisor keeps."

Sources, `src/sources/CapitalMarketsLens.ts`:
- New `moldUdp64`: "MoldUDP64 Protocol Specification V 1.00 (UDP multicast downstream packets)", Nasdaq, https://www.nasdaqtrader.com/content/technicalsupport/specifications/dataproducts/moldudp64.pdf, tier 1 (an exchange's own protocol specification), accessed 2026-10-23.
- `neuronEnvVars`: replaced with the DeterminismAOT.ts record (title, `/en/v2.32.0/` url, tier 1, accessed 2026-10-23).
- `pond`: title "... (arXiv:2203.00241), Figure 4" -> "Pond: CXL-Based Memory Pooling Systems for Cloud Platforms (arXiv:2203.00241)".
- `xeon6Brief`: title "Intel Xeon 6 Product Brief (PCIe 5.0 at 32 GT/s per lane)" -> "Intel Xeon 6 Product Brief (up to 64 lanes of CXL 2.0 at up to 32 GT/s per lane)"; accessed 2026-10-23.
- `nieWhitepaper`, `nieComputeBlog`: accessed 2026-10-16 -> 2026-10-17, matching IsolationNie.ts exactly.

TickToTradeDiagram.tsx: unchanged.

## Checks

- `pnpm exec tsc --noEmit | grep -E "CapitalMarketsLens|TickToTradeDiagram|sources/CapitalMarketsLens"`: no hits ("no type errors in my files").
- `pnpm exec eslint src/sections/CapitalMarketsLens.tsx src/sources/CapitalMarketsLens.ts src/components/TickToTradeDiagram.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t CapitalMarketsLens`: exit 0 (1 passed, 34 skipped).
- Gates from the repo root: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0, pre-overflow exit 0; no hits for CapitalMarketsLens or TickToTradeDiagram.
- `pnpm exec vitest run src/__tests__/sources.test.ts`: 855 passed, 1 failed, the sources.md sync snapshot only. Tier-consistency tests pass.
- `pnpm exec vite build --outDir /tmp/vf-CapitalMarketsLens-dist --emptyOutDir`: exit 0. `node scripts/shoot.mjs --sections capital-markets --widths 1440,390 ...`: "1 SVG diagram(s), 0 React Flow, ok" at both widths. PNGs read: no overlap or clipping; at 390 the SVG scrolls sideways inside its wrapper with labels legible.

## For the orchestrator

- **`pond` title, exact:** `Pond: CXL-Based Memory Pooling Systems for Cloud Platforms (arXiv:2203.00241)` in MainMemoryAndCxl.ts, MemoryHierarchyPrimer.ts and HeterogeneityFact.ts. Their notes quoting the 70 to 90 ns sentence (MainMemoryAndCxl.tsx:383, MemoryHierarchyPrimer.tsx:445) can start "Section 1, page 1:" as this section's now does. The MainMemoryAndCxl verification report (row 43) calls the sentence the abstract; it is Section 1. The URL is unversioned and serves v4; pinning `https://arxiv.org/abs/2203.00241v4` in all four files together is optional.
- **sources.md:** regenerate. The sync snapshot shows the new Nasdaq `moldUdp64` row, the retitled `pond` and `xeon6Brief` rows, and the old `/en/latest/` Neuron row gone.
- **Reusable record:** `moldUdp64` (Nasdaq MoldUDP64 spec, T1) backs "exchange feeds arrive as multicast UDP" if Communication and Scale-Out says it.

## Backlog

Cut candidates (economy, not corrections), about 150 visible words:
- Intro paragraph 1, the three "Different ..." sentences (about 40 words): the framing paragraph after it says the same, and the triad reads as cadence.
- "Stages 3, 4 and 5 ..." paragraph (39 words): the diagram's lower lane label says it; keeping only its second sentence saves about 20.
- "Risk and valuation" paraphrase of page 2 ("the values and sensitivities ... many market states", about 20 words): the "Where the regulated workloads live" quote repeats it verbatim from the same page.
- "The silicon implication" Alert (128 words, the longest block): the section-name mapping could shrink to the silicon families plus one cross-reference (about 40 words saved).
- Q3 restates the EFA scope from the tick-to-trade block ("while EFA traffic is not routable and its libfabric provider lists no multicast", 14 words); "and EFA cannot receive it" carries it.
- Option: Q2 (now 120 words) could point to *Isolation: NIE and MIG* by name for the exclusion list (about 50 words saved), if one copy of that list is preferred.

Enhancements, not done:
- Name the Danske example as the paper does ("a real netting set from Danske Bank's portfolio") rather than "benchmark".
- No final US market-risk rule was located; [SECONDARY: governancedocs.com via WebSearch] says none had issued as of 19 September 2026. Re-check next iteration.
