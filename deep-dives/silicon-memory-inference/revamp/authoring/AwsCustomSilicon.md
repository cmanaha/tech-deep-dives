# Change report: AwsCustomSilicon (nav id `aws-custom`)

Register: `research/2026-10-refresh/03-aws-cpus.md` section 0 and section 1
(S1 to S30, N1 to N6, Recommended edits 1 to 11).

Files: `src/sections/AwsCustomSilicon.tsx` (rewritten), `src/components/TrainiumChipDiagram.tsx`
(chip diagram rebuilt; second export `TrainiumFabricDiagram` added in the same file, no new
file), `src/sources/AwsCustomSilicon.ts` (new, 22 records).

Status: COMPLETE. Not committed.

Re-fetched on 2026-10-17 (records carry that date): Trainium3 Architecture, Amazon EC2 Trn3
Architecture (three passes: configurations, connectivity sub-sections, routing), Amazon EC2
Trn2 Architecture, What is Neuron Collective Communication, Intra-node Collective
Communications, Native PyTorch for AWS Trainium. Everything else is taken from the register
at its 2026-10-16 date. Shared records reuse URL, title, publisher and tier exactly
(trainium2Arch, trainium3Arch, neuronCoreV3, trn2Arch, trn3Arch, nkiTrn2Arch, nkiTrnInf2Arch,
nkiOverview, neuronWhatsNew, neuronEnvVars, ec2AcceleratedSpecs, hopperTuningGuide, trn3Page).

## Findings from the re-fetch that the register does not carry

- **Trn3 page, internal inconsistency.** The overview names NeuronSwitch-v1 and gives Gen1 as
  four servers of 16 chips and Gen2 as 36 servers of 4. The "Trn3 UltraServer Connectivity
  and Networking" sub-sections describe a PCIe switch fabric with four chips per server (the
  Gen2 layout) and never say whether the 256 / 320 / 128 GB/s figures apply to Gen1. The page
  gives no rack size. The section scopes the per-level figures to "the layout the Trn3 page
  describes" and the diagram labels it Gen2.
- **No hop count for Trn3.** The register's N2 replacement text says Trn3 is "one hop to any
  chip". The page does not say that: it describes an intra-server switch, inter-server
  switches (plural) and direct cross-rack links between same-position chips only. The section
  says traffic goes through switches, never "one hop".
- **Routing on the torus is sourced.** The Intra-node Collective Communications page:
  "data can be directly written to any other rank on a remote chip, where the in-between
  traffic is routed automatically. The downside of routing is that it leads to link
  over-subscription." This carries the torus half of the mental model.
- **Neighbour count.** The collectives page: "each chip is connected to 4 neighbors with a
  NeuronLink"; for UltraServers "each chip adding connections on the Z dimensions to 2
  neighbors". So 6 of the other 63 chips [derived], the section's strongest number.
- The collectives page says CC-Cores control "data movement engines", not "DMA engines"; the
  section uses the page's wording.
- The Trn2 architecture page describes memory pooling for the 16 chips of one instance, not
  across the UltraServer, so "pooling domain" (S16 replacement) is not used for the
  UltraServer either; it is "one NeuronLink 3D torus".
- TorchNeuron is a closed beta. Its FAQ also says "torch native MoE ops will be supported from
  first release" while listing `all_to_all_vdev_2d` and `_offset` for future releases; the
  section states only the second.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| S8 | Inf2 HBM "32 GiB at 0.8 TB/s" | 32 GiB at 820 GiB/s | inferentia2Arch (T1) |
| S9 | Inf2 "production for Mixtral-class serving", "production inference for medium-class models" | Trn1 and Inf2 remain on EC2; NxD Inference dropped them in 2.29.0, vLLM Neuron serves Trn2 and Trn3, so serving pins to Neuron 2.28 | ec2AcceleratedSpecs (T1), neuronWhatsNew (T1) |
| S12 | "a systolic array with explicit SBUF and PSUM scratchpads" | four engines (Tensor, Vector, Scalar, GPSIMD) around software-managed SRAM, the Tensor engine a systolic array | neuronCoreV3 (T1) |
| S13 | CC-Cores carry collectives "without occupying NeuronCore compute" | dedicated synchronization processors that decide when the data movement engines transfer data; the engines move the bytes | collectives (T1) |
| S13 (GPU half) | "On a GPU, NCCL collectives run as kernels on the same SMs" | NCCL collectives mostly run on the SMs that run the model; popover notes 2.28 copy-engine paths (register 04 CS5 STALE) | ncclV2283 (T1) |
| S14 | NeuronLink-v3 "1.28 TB/s per chip intra-node, 256 GB/s inter-instance" (text and diagram) | 1,024 GB/s per chip inside the instance plus 256 GB/s per chip to the other instances, never one figure | trn2Arch (T1) |
| S16 | "a single coherent domain" | "one NeuronLink 3D torus" / NeuronLink domain | trn2Arch, collectives (T1) |
| S17 | "Cross-server HBM-to-HBM latency: 15 µs (vendor-cited)" inside the NeuronLink paragraph | labelled EFA, not NeuronLink, ib_write_lat, measured; Ring hop inside an instance about 1 to 2 µs | collectives (T1, measured), intranodeCollectives (T1) |
| S18 | "when it ships" (text), "including future All-to-All-v for MoE" (diagram) | gone; the shipped collectives are listed in the MoE guidance | neuronWhatsNew (T1) |
| S19 | PSUM free dim "≤ 512" | 512 elements on NeuronCore-v2 and v3; 4,096 FP32 or 8,192 BF16 (eight PSUM banks) on NeuronCore-v4; a wider tile written for Trainium3 has to be split for Trainium2 | ncMatmul (T1) |
| S20 | "roughly two orders of magnitude larger than Hopper's 228 KB SMEM" | about 126 times the 228 KB of a Hopper SM | hopperTuningGuide (T1), nkiTrn2Arch (derived) |
| S21 | Trainium3 "specifications ... remain UNKNOWN" | Trainium3 row in the table | trainium3Arch, nkiTrn3Arch (T1) |
| S22 | "no warp scheduler, no occupancy decision, no runtime branching" | no warp scheduler picks work at run time; dynamic shapes and control flow run through ISA extensions on Trainium2 and Trainium3 | nkiOverview, trainium2Arch, trainium3Arch (T1) |
| S25 | MoE NKI kernels "shipped in Neuron 2.27.0 (December 2025)" | NKI Library MoE kernels such as Router Top-K from 2.28.0 (in the MoE guidance alert) | neuronWhatsNew (T1) |
| S26 | Alert "The MoE all-to-all gap": EP uses All-Gather, All-to-All-v on the roadmap | Alert "How to get MoE dispatch right on Trainium": AllToAllV on Trn2 and Trn3 from 2.32.0, `nki.collectives.all_to_all_v` from 2.29.0, Wide-EP in vLLM Neuron (beta); the remaining gap is the PyTorch-native `all_to_all_vdev_2d` ops, listed for a future TorchNeuron release (closed beta) | neuronWhatsNew, pytorchNative (T1) |
| S27 | "Standard 8-chip Trainium2 instance" | trn2.48xlarge 16 chips, trn2.3xlarge one | ec2AcceleratedSpecs (T1) |
| S28 | Trn2 UltraServer "the headline AWS frontier-training and large-MoE-inference platform" | Trn3 UltraServer card first; Trn2 UltraServer "the previous generation" | trn3WhatsNew (T2), trn3Arch (T1) |
| S29 | Trn1 "previous-gen" | Trn1 remains on EC2; NxD Inference dropped it in 2.29.0 | ec2AcceleratedSpecs, neuronWhatsNew (T1) |
| S30 | "Section 13 covered NVIDIA", "Section 18 covers the compiler stack" | removed with the CUT block; cross-references by name (AWS Compilers and Kernel Tooling; Roofline and Arithmetic Intensity; Mixture of Experts and Sparse Activation; Determinism: NEFF and GPU Reproducibility) | - |
| h1 | "AWS Trainium, Inferentia, and Neuron silicon"; description "...compile-time scheduled determinism" | "AWS Trainium, Inferentia and Neuron"; description states the payoff | - |

CORRECT claims kept and re-cited: S1, S2, S3, S4, S5, S6, S7, S11 (re-expressed as "both
built from NeuronCores", with the core version per chip in the table), S15, S24.

## Claims removed

- S10 Bedrock/SageMaker history of Inf2: UNKNOWN, edit 6.
- S23 "same NEFF, same input, same silicon produces the same output", "a candidate for
  regulated workloads": UNKNOWN, edit 8. Replaced by the sourced practical step (both
  Trainium generations let the user choose stochastic rounding; fix
  `NEURON_RT_STOCHASTIC_ROUNDING_SEED` when runs must match) and a pointer to Determinism:
  NEFF and GPU Reproducibility.
- "Why this section sits where it does": CUT candidate, edit 10.
- "designed by Annapurna Labs": not in the register, no source.
- "SBUF residency is the first-order tuning variable", the "because the compiler ... does not
  rely on a cache" clause, and "There is no cache-coherence protocol to participate in across
  NeuronCores; the schedule says where everything is": no source.
- The "Where Trainium wins, where it does not" disclosure (regulated finance and healthcare
  audit, Mixtral/Llama/Qwen-class serving, "NVIDIA NCCL is more mature", "highly dynamic graphs
  that defeat NEFF caching", "CUDA-specific kernel with no NKI equivalent"): unsourced, and
  the MoE item is stale (S26). Its decision role moves to the closing "Before you commit"
  block, built only from cited facts.
- "General training workloads at sub-frontier scale" (Trn2/Trn1 card): no source.
- "a real and citeable gap relative to NVIDIA NCCL with MNNVL": stale (S26).
- NeuronLink-v3 "1.28 TB/s" as a stand-alone figure (the prompt's rule: the split, never one
  figure).
- The NxD Inference "documents EP over All-Gather" sentence (first draft) was cut for length;
  Mixture of Experts and Sparse Activation carries it.
- Trainium4 "3x the FP8 performance" and Trn3 "3.9x memory bandwidth, 4x performance/watt"
  vendor multipliers: cut for length. The section keeps 6x FP4 and 4x memory bandwidth
  (Trainium4, roadmap) and 4.4x performance (Trn3, vendor claim).

## UNKNOWNs

- S10: cut.
- S16: "coherent" removed; "NeuronLink domain" / "3D torus" used instead.
- S23: cut; practical replacement as above.
- Trn3 rack size and whether the per-level bandwidths apply to Gen1: not stated by the
  Trn3 page. The page says so in the caption and the "Placing experts" paragraph ("The Trn3
  page gives no rack chip count, so confirm it with AWS").
- Inferentia successor: "This research found no announced Inferentia successor" (scope kept
  from register section 0).
- Trainium4 date: "this research found no date or specification sheet".

## NEW content

- N1: Trainium3 row (8 NeuronCore-v4; 32 MiB SBUF per core, 256 MiB per chip; 144 GiB at
  4.9 TB/s): trainium3Arch, nkiTrn3Arch. The UltraServer column of N1 moved to the Trn3 card.
- N2 (edit 11, the section's mental model): new h2 "MoE on Trainium: from a torus to
  switches", the fabric diagram, and "Placing experts" (labelled "our reading of these
  figures"). Sources: trn2Arch, collectives, intranodeCollectives, trn3Arch, pytorchNative.
- N3: NeuronLink-v4 conflict in a disclosure: 2.56 TB/s (trainium3Arch), 2,048 GiB/s
  (trn3Arch), 2 TB/s (trn3Page); the per-level figures sum to 704 GB/s bidirectional
  [derived]. Not merged.
- N4: Trainium4 roadmap sentence (trainium3AboutAmazon, T2, roadmap).
- N5: Trn3 UltraServer card from the trn3Arch table (Gen1 64 chips, 9,216 GiB, 313.6 TB/s;
  Gen2 144 chips, 20,736 GiB, 705.6 TB/s, 362 dense MXFP8 PFLOPS), GA 2 December 2025
  (trn3WhatsNew), 4.4x as a vendor claim (trn3WhatsNew), no Trn3 instance type on the EC2
  instance specification (ec2AcceleratedSpecs, register section 0).
- N6: not used (register: not worth page space).
- PSUM tile scope for NeuronCore-v4 (S19), CC-Core orchestration model (S13), Inf2 software
  status (S9).

## Diagram

`TrainiumChipDiagram` rebuilt: `viewBox="0 0 880 400"`, `role="img"`,
`aria-labelledby="trn2-chip-title"` with an asserting `<title>`, `aria-label`, fixed `height`
and `preserveAspectRatio` removed, full-bleed white rect, Idiom A classes prefixed `trn-`,
fonts 11 to 13 px `sans-serif`, no em-dashes or middle dots. Content changes: HBM blocks no
longer each say "96 GiB total" (the per-chip figure sits once in the subtitle; the caption
says the blocks do not show the stack count); NeuronCore boxes carry SBUF 28 MiB and PSUM
2 MiB; the CC-Core band says "orchestrate collectives among chips, within and across
instances" ("future All-to-All-v" gone); NeuronLink-v3 band states 1,024 GB/s inside the
instance plus 256 GB/s to the other instances (S14).

`TrainiumFabricDiagram` (new, same file): `viewBox="0 0 960 360"`,
`aria-labelledby="trn-fabric-title"`, classes prefixed `tfab-`. Left panel: a 4x4 torus with
wrap-around stubs, the sending chip, its four neighbours, a far chip and one shortest route
through chips in between; the UltraServer ring and the 6-of-63 count below. Right panel: three
four-chip servers, each with its intra-server switch (256 GB/s), all chips wired to the
inter-server switch bar (320 GB/s), one route through the switches, the cross-rack direct
link (128 GB/s) and the Gen1/Gen2 layouts in text.

Both are wide and follow the phone convention (`overflowX: auto` wrapper, `minWidth: 640`).
Every number drawn is cited in the caption or the paragraph above it.

Rendered check (`scripts/shoot.mjs --sections aws-custom --widths 1440,390`, build in
`/tmp/silicon-dist-aws-custom`): "2 SVG diagram(s), 0 React Flow, ok" at both widths after
the last edit (no overlaps, no text out of its box, no viewBox clipping, no page overflow).
PNGs read at 1440: every label inside its box, legend swatches clear of their text, the
orange routes run between chips and below the switch bar without crossing any text. At 390
both diagrams scroll sideways at 640 px and stay legible. Fixed after the first shoot: the
spec table at 390 squeezed the SBUF column to one character per line; columns now carry
`minWidth` and the table scrolls sideways with readable cells.

## Word count

Counter `/tmp/kl-tools/wc.mjs` (rendered, 1440, all disclosures open; excludes nav, Cite
badges, SVG text and code): before 878, after 1,113 (+27%). A first draft reached 1,493 and was
cut back. The growth is register-required NEW content: the torus-versus-switch h2 and its
placement paragraph (N2, edit 11, about 220 words), the Trn3 UltraServer card and Trainium3
row (N1, N5, about 60), the shipped-collectives guidance replacing the gap alert (S25, S26,
about 30 net), Trainium4 (N4, about 30) and the NeuronLink-v4 conflict disclosure (N3, about
35). Cuts that paid for it: the CUT narration block, the unsourced wins/watch-out disclosure,
the third h1 paragraph of an earlier draft, and the separate "What Trainium is, that a GPU is
not" h2 (folded into the h1 intro and the CC-Core block).

## Leverage pass: claim-set diff

Assertions in the after that were not in the before, each with its source:

1. NeuronCore = four engines (Tensor, Vector, Scalar, GPSIMD) around software-managed SRAM; Tensor engine is a systolic array: neuronCoreV3.
2. The compiler fixes memory allocation and instruction order in the NEFF: nkiOverview.
3. Dynamic shapes and control flow through ISA extensions on Trainium2 and Trainium3: trainium2Arch, trainium3Arch.
4. SBUF 32 MiB per NeuronCore-v4, 256 MiB per chip: nkiTrn3Arch, trainium3Arch.
5. PSUM 2 MiB on NeuronCore-v4: nkiTrn3Arch.
6. Moving-tile free dimension 4,096 FP32 / 8,192 BF16 (eight PSUM banks) on NeuronCore-v4; wider Trainium3 tiles split for Trainium2: ncMatmul (the split is the direct consequence of the 512 limit).
7. 16 CC-Cores on Trainium3: trainium3Arch. CC-Cores decide when data movement engines transfer data; engines move the bytes: collectives.
8. NCCL collectives mostly run on SMs; 2.28 copy-engine paths (popover): ncclV2283.
9. Ring hop inside an instance about 1 to 2 µs, HBM-load dependent: intranodeCollectives.
10. 15 µs is EFA, ib_write_lat, measured: collectives.
11. 126x SBUF over Hopper SMEM: hopperTuningGuide plus derived.
12. Trainium3 row: 8 NeuronCore-v4, 144 GiB at 4.9 TB/s: trainium3Arch. Inf2 820 GiB/s: inferentia2Arch.
13. Trainium4 multipliers and NVLink Fusion: trainium3AboutAmazon (roadmap); no date found: register section 0, scoped to this research.
14. NeuronLink-v4 per-chip figures 2.56 TB/s, 2,048 GiB/s, 2 TB/s and the 704 GB/s sum: trainium3Arch, trn3Arch, trn3Page, derived.
15. MoE dispatch and combine are all-to-all ops: pytorchNative. In an all-to-all every chip sends to every other: intranodeCollectives.
16. 4x4 2D torus, four neighbours, same-position ring across four instances, two more neighbours: trn2Arch, collectives. 6 of the other 63: derived.
17. Traffic to non-neighbours is routed through chips in between and over-subscribes links: intranodeCollectives.
18. Trn3: PCIe switch-based interconnect (NeuronSwitch-v1) for all chip-to-chip traffic, replacing point-to-point NeuronLink; four chips per server switch 256 GB/s, inter-server 320 GB/s, cross-rack direct 128 GB/s, bidirectional; AWS describes it as optimized for MoE: trn3Arch.
19. Placing experts (labelled our reading): 4x in-instance vs cross-instance bandwidth so a group within one 16-chip instance avoids the slower links; cross-rack is the narrowest Trn3 path; no rack chip count published, confirm with AWS: trn2Arch, trn3Arch, derived.
20. AllToAllV on Trn2 and Trn3 from 2.32.0; `nki.collectives.all_to_all_v` from 2.29.0; NKI Library MoE kernels from 2.28.0; vLLM Neuron Wide-EP, beta: neuronWhatsNew.
21. `torch.all_to_all_vdev_2d` and `_offset` for future releases; TorchNeuron closed beta; the gap matters only to TorchNeuron code: pytorchNative (the last clause is the register's S26 reading).
22. Trn3 GA 2 December 2025: trn3WhatsNew. Gen1/Gen2 capacity, bandwidth, dense MXFP8 PFLOPS: trn3Arch. 4.4x: trn3WhatsNew (vendor claim). No Trn3 instance type on the EC2 specification: ec2AcceleratedSpecs.
23. Trn2 UltraServer = four trn2u.48xlarge, 6,144 GiB: trn2Arch. trn2.48xlarge 16 chips, trn2.3xlarge one: ec2AcceleratedSpecs.
24. Trn1 and Inf2 on EC2; NxD Inference dropped both in 2.29.0; vLLM Neuron serves Trn2 and Trn3; serving pins to 2.28: ec2AcceleratedSpecs, neuronWhatsNew. No Inferentia successor found: register section 0, scoped.
25. Stochastic rounding is user-selectable on Trainium2 and Trainium3; fix `NEURON_RT_STOCHASTIC_ROUNDING_SEED` for matching runs: trainium2Arch, trainium3Arch, neuronEnvVars.

No assertion in the after lacks a source.

## Checks

- `tsc --noEmit`: no errors in my files. `eslint` on the three files: clean.
- `vitest run src/__tests__/sections.test.tsx -t AwsCustomSilicon`: 1 passed.
- `no-ai-tells`, `svg-a11y`, `pinned-refs`: no hits in my files (the gates still fail on
  other files in the dive).

## For the orchestrator

- Glossary acronyms used in this section (expanded at first use): GPSIMD, NEFF, ISA, NKI,
  SBUF, PSUM, CC-Cores, HBM, SM, NCCL, EFA, MoE, Wide-EP, MXFP8, NxD Inference.
- New shared URL: `ncclV2283` (`https://github.com/NVIDIA/nccl/releases/tag/v2.28.3-1`,
  title "NVIDIA/nccl release v2.28.3-1", NVIDIA, Tier 1). Communication and Scale-Out (register
  04 CS5) should reuse the same record.
- New component export: `TrainiumFabricDiagram` lives in `src/components/TrainiumChipDiagram.tsx`
  (the file this section owns), not in a new file.
- Cross-section notes for REVAMP-PLAN:
  - Trn3 per-chip fabric: 256 GB/s intra-server, 320 GB/s inter-server, 128 GB/s inter-rack,
    all bidirectional, in a layout of four chips per server (Gen2); the Trn3 page gives no
    rack size and no hop count. Never write "one hop to any chip" for Trn3.
  - Trainium3 NeuronLink-v4 per chip appears as 2.56 TB/s, 2,048 GiB/s and 2 TB/s on three
    AWS pages; quote the one you use with its source.
  - A Trn2 UltraServer chip has direct NeuronLink links to 6 of the other 63 chips [derived
    from the collectives page].
  - MoeAndSparseActivation cites "NeuronSwitch-v1, which AWS positions for MoE" to the Trn3
    product page (T2, vendor claim); the same statement is on the Trn3 architecture page
    (T1), which this section cites.
  - KernelExecutionLifecycle cites `trn2Arch` for "NeuronCore-v3 still supports dynamic shapes
    and control flow"; the register (S22) and this section source that to the Trainium2
    architecture page (`trainium2Arch`).

## 2026-10-24 TorchNeuron update (stream trainium, orchestrator edit)

Evidence: `research/2026-10-torchneuron/` rows E6, P10, P14, P23, P38, P52, C14, SA24; plan item 2 in `revamp/TORCHNEURON-2026-10.md`.

Claim-set diff:
- Removed: "`torch.all_to_all_vdev_2d` ... which the Neuron 2.32.0 TorchNeuron guide lists for future releases" (E6 STALE).
- Added: TorchNeuron supports `torch._grouped_mm` and MoE dispatch and combine on `neuron` (P10, about page); a grouped GEMM always forces a torch.compile graph break (P38, compile reference); on TorchTitan Neuron keep the expert computation out of the compiled region, and its EP dispatch runs on an NKI all-to-all-v collective (P52, SA24 evidence, TorchTitan Neuron page); `torch.all_to_all_vdev_2d` has no implementation in torch-neuronx at v2.33.0 (C14, our search, labelled in the Cite note).
- Trn1 and Inf2: PyTorch stays on the deprecated XLA build 2.9.0.2.15.32035 (P23); TorchNeuron supports Trn2 and Trn3 (P14). Replaced "NxD Inference dropped them in Neuron 2.29.0, so serving either with it pins to Neuron 2.28" with the 2.33.0 statement that NxD Inference stays in maintenance mode on Inf2 and Trn1 at Neuron SDK 2.31 (EOS announcement page, fetched 2026-10-24). The two AWS statements differ; the newer page governs.
