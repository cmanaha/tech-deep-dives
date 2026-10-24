# Verification: AWS Trainium, Inferentia and Neuron

Verified: 2026-10-18. Claims checked: 64 (sampled: 0, every claim checked against a page fetched
today). Confirmed 60, wrong 0, unsupported 4, mislabelled 0, unverifiable 0.

## Gate 3 score: 8/10

The section gives the reader a real mental model: Trn2 is a torus where a chip reaches 6 of the
other 63 directly and routes the rest through other chips, while Trn3 is switched. Each number
traces to a Tier 1 Neuron page, and the closing block tells the reader what to check before
choosing a target. Nothing load-bearing was wrong. The four fixes are scope corrections: one
citation gap (SBUF and PSUM names), one claim softened from "no cache" to "software-managed",
one NCCL note that called an opt-in feature a default, and one Neuron 2.28 pin that the source
states only for NxD Inference. Economy keeps the score from 9: length is +27% and the Trn2
NeuronLink split appears four times.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 60 of 64 confirmed as shipped. None wrong. The 4 unsupported were scope or citation gaps, all fixed. All 7 derived figures recompute (126x, 704, 6 of 63, 4x, the narrowest Trn3 path, plus the Gen1 and Gen2 totals, which match 64 or 144 chips at 144 GiB and 4.9 TB/s) |
| Mental model or practical value | 9 | Torus vs switch, with "placing experts" as the consequence, is the mental model. Tile limits, the vLLM Neuron hardware scope, the 2.28 pin and the rounding seed are things to do. The Trainium4 roadmap sentence is the weakest block, a planning fact with no action attached |
| Shape | 8 | The h1 says what a NeuronCore is before the chip diagram takes it apart. All four h2 descriptions state a payoff. 6 of 63 appears in the h2 description, the paragraph and the diagram. The NeuronLink-v4 conflict is demoted into an ExpandableSection. The section ends on "Before you commit a model to a target" |
| Writing | 8 | no-ai-tells passes. Attribution in sentences is load-bearing each time: "AWS claims" twice (vendor claims), "AWS pages give" (sources disagree), "AWS describes ... optimized for MoE" (vendor framing), "lists no Trn3 instance type" and "gives no rack chip count" (the silence is the claim). One contrast by negation remains, "over EFA ..., not NeuronLink" |
| Economy | 7 | 878 to 1,113 words (+27%, author's count). My fixes add about 4. The growth is the register's NEW items (N1, N2, N3, N5), and the torus vs switch h2 earns it. Repetition: "1,024 GB/s inside plus 256 GB/s across" appears in the chip diagram, the NeuronLink-v3 block, the fabric diagram and the placing-experts note |
| Diagrams | 8 | Both are inline SVG with role="img" and a title that states the assertion. The author's shots (1440, 390) show no overlap or clipping. At 390 both scroll sideways at 640 px and stay readable. Every number drawn matches its source (see claims 5-10, 20, 24, 34-36, 39, 63, 64) |

## Claims

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | NeuronCores: four engines (Tensor, Vector, Scalar, GPSIMD) around software-managed SRAM, the Tensor engine a systolic array | neuronCoreV3 | CONFIRMED | "4 main engines: Tensor, Vector, Scalar, and GPSIMD"; "on-chip SRAM is software-managed to maximize data locality"; Tensor engine "power-optimized systolic array". NeuronCore-v2 page (Inf2, Trn1) says the same: "4 main engines (Tensor/Vector/Scalar/GPSIMD Engines), and on-chip software-managed SRAM memory" | |
| 2 | Compiler fixes memory allocation and instruction order in a NEFF | nkiOverview | CONFIRMED | "eventually generates a NEFF (Neuron Executable File Format)"; "memory allocation and instruction scheduling are done in this stage" | |
| 3 | Dynamic shapes and control flow through ISA extensions on Trainium2 and Trainium3 | trainium2Arch, trainium3Arch | CONFIRMED | "Trainium2 supports dynamic shapes and control flow via NeuronCore-v3 ISA extensions."; "Trainium3 supports dynamic shapes and control flow, via ISA extensions of NeuronCore-v4." | |
| 4 | SBUF (State Buffer) and PSUM (Partial Sum buffer) "have no cache in front" | neuronCoreV3 | UNSUPPORTED (names; "no cache") | The NeuronCore-v3 body has no "SBUF", "State Buffer", "PSUM", "Partial Sum" or "cache". NKI Trn/Inf2 guide: "state buffer (SBUF) and partial sum buffer (PSUM)"; "two software-managed on-chip SRAMs". No fetched page says there is no cache | Added nkiTrnInf2Arch. "have no cache in front" changed to "are software-managed" |
| 5 | Trainium2: 8 NeuronCore-v3 (table, diagram) | trainium2Arch | CONFIRMED | "Every Trainium2 chip contains eight NeuronCore-V3 cores." | |
| 6 | Trainium2 SBUF 28 MiB per core, 224 MiB per chip | nkiTrn2Arch, trainium2Arch | CONFIRMED | "NeuronCore-v3 SBUF capacity is 28MiB (or, 128 partitions of 224KiB)"; table "SBUF Capacity (MiB) / 48 / 224" | |
| 7 | Trainium2 HBM 96 GiB at 2.9 TB/s (table, diagram) | trainium2Arch | CONFIRMED | "96 GiB of device memory with 2.9 TB/sec of bandwidth" | |
| 8 | Trainium3: 8 NeuronCore-v4 | trainium3Arch | CONFIRMED | "A Trainium3 device contains eight NeuronCore-v4 cores." | |
| 9 | Trainium3 SBUF 32 MiB per core, 256 MiB per chip | nkiTrn3Arch, trainium3Arch | CONFIRMED | "The NeuronCore-v4 SBUF capacity is 32 MiB (up from 28 MiB in NeuronCore-v3)"; table "SBUF Capacity (MiB) / 224 / 256" | |
| 10 | Trainium3 HBM 144 GiB at 4.9 TB/s | trainium3Arch | CONFIRMED | "144 GiB of device memory, with 4.9 TB/sec of bandwidth" | |
| 11 | Inferentia2: 2 NeuronCore-v2 | inferentia2Arch | CONFIRMED | "Two NeuronCore-v2 cores, delivering 380 INT8 TOPS, ..." | |
| 12 | Inferentia2 SBUF 24 MiB per core | nkiTrnInf2Arch | CONFIRMED | "a 24MiB SBUF as the main data storage" | |
| 13 | Inferentia2 HBM 32 GiB at 820 GiB/s | inferentia2Arch | CONFIRMED | "32GiB of high-bandwidth device memor (HBM) ... with 820 GiB/sec of bandwidth" (typo is AWS's) | |
| 14 | SBUF 28 MiB per NeuronCore-v3, 32 MiB per NeuronCore-v4 (SBUF block) | nkiTrn2Arch, nkiTrn3Arch | CONFIRMED | as 6 and 9 | |
| 15 | 228 KB of shared memory in a Hopper SM | hopperTuningGuide | CONFIRMED | "shared memory capacity per SM is 228 KB" (Hopper Tuning Guide 13.4) | |
| 16 | About 126 times (derived) | nkiTrn2Arch + hopperTuningGuide | CONFIRMED | 28 x 1,024 / 228 = 125.75, about 126. The note gives the 1 KB = 1,024 bytes convention | |
| 17 | PSUM 2 MiB per NeuronCore on both chips | nkiTrn2Arch, nkiTrn3Arch | CONFIRMED | "PSUM capacity remains the same at 2MiB" (Trn2 guide); "the PSUM capacity remains the same at 2 MiB" (Trn3 guide) | |
| 18 | Moving-tile free dimension 512 on NeuronCore-v2 and v3; 4,096 FP32 or 8,192 BF16 (eight PSUM banks) on NeuronCore-v4 | ncMatmul | CONFIRMED | "On NeuronCore-v2 and -v3, the free dimension size of moving tile must not exceed 512"; "can go up to 4096 for float32 dst or 8192 for bfloat16 dst"; "matching the size of 8x PSUM banks (the entire PSUM)" | |
| 19 | A wider Trainium3 tile has to be split for Trainium2 | ncMatmul | CONFIRMED | Direct consequence of 18 | |
| 20 | 16 CC-Cores per chip on Trainium2 and Trainium3 (text, diagram) | trainium2Arch, trainium3Arch | CONFIRMED | "16 CC-Cores orchestrate collective communication among Trainium2 chips within and across instances"; "16 CC-Cores orchestrate collective communication among Trainium3 devices" | |
| 21 | CC-Cores are dedicated synchronization processors that decide when the data movement engines transfer data | collectives | CONFIRMED | "dedicated synchronization processors responsible for the orchestration of collective communications"; they control when and how the "data movement engines transfer data" | |
| 22 | NCCL collectives mostly run on the SMs that also run the model | ncclV2283 | CONFIRMED (implied) | CE collectives "Reduce SM utilization for alltoall, scatter, gather, and allgather"; "Free up SM capacity for the application to do computation at the same time" | |
| 23 | Popover: NCCL 2.28 "moved" all-to-all and all-gather onto copy engines | ncclV2283 | UNSUPPORTED (overstated) | "To enable the feature for ncclAllGather, ncclAlltoAll, ncclGather, ncclScatter, register buffers into symmetric windows and use the NCCL_CTA_POLICY_ZERO flag in the communicator config_t." The feature is opt-in | Note now says the paths were added, are opt-in, and how to turn them on |
| 24 | NeuronLink-v3 1,024 GB/s per chip inside the instance plus 256 GB/s per chip to other instances (text, both diagrams) | trn2Arch | CONFIRMED | "Intra-instance NeuronLink-v3 bandwidth (GB/sec/chip) 1,024"; "Inter-instance NeuronLink-v3 bandwidth ... 256" | |
| 25 | A Ring hop inside an instance takes about 1 to 2 µs, depending on HBM load | intranodeCollectives | CONFIRMED | "the per-hop latency of Ring/KangaRing is about 1-2 us (HBM load dependent)" | |
| 26 | 15 µs HBM to HBM between Trn2 servers over EFA, ib_write_lat (measured) | collectives | CONFIRMED | "Trn2.48xl instances are backed by the AWS 10p10u network"; "a minimal packet takes 15us (latency) to go from an HBM in one server to an HBM of another"; each chip has a 200 Gbps EFA interface | |
| 27 | Trainium4 (roadmap): at least 6x Trainium3's FP4 performance, 4x its memory bandwidth, NVLink Fusion; no date found | trainium3AboutAmazon | CONFIRMED | "at least 6x the processing performance (FP4), 3x the FP8 performance, and 4x more memory bandwidth"; "being designed to support NVIDIA NVLink Fusion". No date in the article. Marked roadmap, and "AWS claims" sits in the sentence | |
| 28 | NeuronLink-v4 2.56 TB/s per chip | trainium3Arch | CONFIRMED | "NeuronLink-v4 for device-to-device interconnect provides 2.56 TB/sec bandwidth per device"; table "Inter-chip Interconnect (GB/sec/chip) 1280 / 2560" | |
| 29 | NeuronLink-v4 2,048 GiB/s per chip | trn3Arch | CONFIRMED | Table "NeuronLink-v4 bandwidth (GiB/sec/device) 2,048" (Gen1 and Gen2) | |
| 30 | NeuronLink-v4 2 TB/s per chip | trn3Page | CONFIRMED | "an all-to-all fabric using NeuronLink-v4 with 2TB/s of bandwidth per chip" | |
| 31 | Per-level figures sum to 704 GB/s, bidirectional per chip (derived) | trn3Arch | CONFIRMED | 256 + 320 + 128 = 704. Bandwidth summary: "Intra-server 256 GB/s", "Inter-server 320 GB/s", "Inter-rack 128 GB/s" per chip | |
| 32 | MoE dispatch and combine are two all-to-all exchanges | pytorchNative | CONFIRMED (by op name) | "`torch.all_to_all_vdev_2d` and `torch.all_to_all_vdev_2d_offset` (MoE Dispatch/Combine ops)" | |
| 33 | In an all-to-all every chip sends to every other chip | intranodeCollectives | CONFIRMED (paraphrase) | AllToAll: "Each rank starts with N chunks, and ends with the N in a way that the pieces of data were transposed between the ranks" | |
| 34 | trn2.48xlarge: 16 chips in a 4x4 2D torus, each with four neighbours (text, diagram) | trn2Arch, collectives | CONFIRMED | "4x4, 2D Torus topology"; "each chip is connected to 4 neighbors with a NeuronLink." | |
| 35 | Trn2 UltraServer rings same-position chips across four instances, adding two neighbours | trn2Arch, collectives | CONFIRMED | "Trainium2 chips with the same coordinates in each Trn2 instance are connected in a ring topology"; "we extend this to a 3D Torus, with each chip adding connections on the Z dimensions to 2 neighbors" | |
| 36 | Direct links to 6 of the other 63 chips (derived; h2 description, paragraph, diagram) | collectives | CONFIRMED | 4 + 2 = 6 neighbours. 64 - 1 = 63 | |
| 37 | Traffic to the rest is routed through chips in between, which over-subscribes links | intranodeCollectives | CONFIRMED | "data can be directly written to any other rank on a remote chip, where the in-between traffic is routed automatically. The downside of routing is that it leads to link over-subscription." | |
| 38 | Trn3: PCIe switch-based interconnect (NeuronSwitch-v1) carries all chip-to-chip traffic, "replacing Trn2's point-to-point NeuronLink" | trn3Arch | UNSUPPORTED (scope) | "use a PCIe switch-based interconnect architecture for all chip-to-chip communication"; "This replaces the point-to-point NeuronLink topology used in previous generations"; "Both configurations use NeuronSwitch-v1". The page replaces the topology, not the link: Trainium3 still has NeuronLink-v4, which the disclosure quotes | "NeuronLink" changed to "NeuronLink topology" |
| 39 | Four chips per server switch (256 GB/s per chip); switches join a rack's servers (320 GB/s); a direct link to the same-position chip in another rack (128 GB/s); all bidirectional (text, diagram) | trn3Arch | CONFIRMED | "Each server (sled) contains 4 Trainium3 chips connected through an intra-server PCIe switch"; summary table "Bandwidth per chip" 256 / 320 / 128; "chips in corresponding positions across racks are connected via dedicated direct PCIe links"; each figure is called "bidirectional" | |
| 40 | AWS describes this all-to-all topology as optimized for MoE | trn3Arch | CONFIRMED | "especially optimized for workloads that leverage all-to-all communication patterns, such as Mixture of Experts models" | |
| 41 | Four times the bandwidth inside a Trn2 instance as across instances (derived) | trn2Arch | CONFIRMED | 1,024 / 256 = 4 | |
| 42 | On Trn3 the narrowest path is between racks, 128 GB/s against 256 or 320 (derived) | trn3Arch | CONFIRMED | As 39 | |
| 43 | The Trn3 page gives no rack chip count | trn3Arch | CONFIRMED (silence) | The page states no servers or chips per rack. It says only that a rack's servers connect through inter-server PCIe switches | |
| 44 | Runtime AllToAllV on Trn2 and Trn3 from Neuron 2.32.0 | neuronWhatsNew | CONFIRMED | Neuron Release 2.32.0 (2026-08-17): "Adds variable-size collectives (`AllGatherV`, `ReduceScatterV`, `AllToAllV`) for workloads with uneven per-rank data on Trn2 and Trn3" | |
| 45 | `nki.collectives.all_to_all_v` from 2.29.0 | neuronWhatsNew | CONFIRMED | AWS Neuron SDK 2.29.0 (2026-04-09): "Variable-length all-to-all collectives are now available via `nki.collectives.all_to_all_v`." | |
| 46 | NKI Library MoE kernels such as Router Top-K from 2.28.0 | neuronWhatsNew | CONFIRMED | AWS Neuron SDK 2.28.0 (2026-02-26): "Router Top-K (expert selection for MoE), MoE CTE (Context Encoding), MoE TKG (Token Generation)" | |
| 47 | Wide-EP in vLLM Neuron, a beta | neuronWhatsNew | CONFIRMED | vLLM Neuron Beta (2026-07-20): "vLLM Neuron Beta (v0.21.0.1.0.0)"; "Wide expert parallelism (Wide-EP) for MoE models" | |
| 48 | `torch.all_to_all_vdev_2d` and `_offset` listed for future releases; TorchNeuron a closed beta | pytorchNative | CONFIRMED | "TorchNeuron is currently only available as part of a closed Beta program."; "`torch.all_to_all_vdev_2d` and `torch.all_to_all_vdev_2d_offset` (MoE Dispatch/Combine ops) will be supported in future releases." | |
| 49 | Trn3 UltraServer generally available since 2 December 2025 | trn3WhatsNew | CONFIRMED | "Posted on: Dec 2, 2025"; "AWS announces the general availability of" Trn3 UltraServers | |
| 50 | Gen1: 64 chips, 9,216 GiB of HBM at 313.6 TB/s | trn3Arch | CONFIRMED | "four servers with 16 Trainium3 devices per server"; Device Memory 9,216 GiB; Device Memory Bandwidth 313.6 TB/sec | |
| 51 | Gen2: 144 chips, 20,736 GiB at 705.6 TB/s | trn3Arch | CONFIRMED | "36 servers with 4 Trainium3 devices per server"; 20,736 GiB; 705.6 TB/sec | |
| 52 | 362 dense MXFP8 PFLOPS (Gen2) | trn3Arch | CONFIRMED | "The EC2 Trn3 Gen2 UltraServers deliver 362 PetaFLOPS of dense MXFP8 compute"; table "MXFP8/MXFP4 TFLOPS 362,448" | |
| 53 | AWS claims up to 4.4x a Trn2 UltraServer's performance (vendor-claim) | trn3WhatsNew | CONFIRMED | "Trn3 delivers up to 4.4x higher performance ... compared to our Trn2 UltraServers". Marked vendor-claim and attributed in the sentence | |
| 54 | The EC2 instance specification lists no Trn3 instance type | ec2AcceleratedSpecs | CONFIRMED (silence) | Families listed: Trn1, Trn1n, Trn2, Trn2u. No Trn3 | |
| 55 | Trn2 UltraServer: four trn2u.48xlarge, 64 chips, 6,144 GiB, one NeuronLink 3D torus | trn2Arch, collectives | CONFIRMED | UltraServer column: 64 chips, 6,144 GiB device memory, four trn2u.48xlarge; collectives "3D Torus" | |
| 56 | trn2.48xlarge 16 chips, trn2.3xlarge one | ec2AcceleratedSpecs | CONFIRMED | "trn2.48xlarge ... 16 x AWS Trainium2 accelerators"; "trn2.3xlarge ... 1 x AWS Trainium2 accelerators" | |
| 57 | Trn1 and Inf2 remain on EC2 | ec2AcceleratedSpecs | CONFIRMED | trn1.2xlarge, trn1.32xlarge, trn1n.32xlarge; inf2.xlarge to inf2.48xlarge | |
| 58 | NxD Inference dropped Trn1 and Inf2 in 2.29.0, "so serving on either pins to Neuron 2.28" | neuronWhatsNew | UNSUPPORTED (scope) | 2.29.0: "NxD Inference no longer supports Trn1/Inf2. Only Trn2 and newer hardware is supported."; "Pin to Neuron SDK 2.28 for Trn1/Inf2 support." The pin is stated for NxD Inference only, and no fetched note covers other inference paths | "so serving either with it pins to Neuron 2.28" |
| 59 | vLLM Neuron serves Trn2 and Trn3 | neuronWhatsNew | CONFIRMED | "an enhanced vLLM plugin for serving models on Trn2 and Trn3" | |
| 60 | "This research found no announced Inferentia successor" | (register section 0) | CONFIRMED (scope kept) | The hedge is scoped to this research | |
| 61 | Both Trainium generations let you choose stochastic rounding | trainium2Arch, trainium3Arch | CONFIRMED | "user-programmable rounding mode (Round Nearest Even or Stochastic Rounding)" on both pages | |
| 62 | Fix `NEURON_RT_STOCHASTIC_ROUNDING_SEED` when runs must match | neuronEnvVars | CONFIRMED | "Please set `NEURON_RT_STOCHASTIC_ROUNDING_SEED` to a fixed value to ensure reproducibility between runs." | |
| 63 | Diagram: Gen1 64 chips, four servers of 16; Gen2 144 chips, 36 servers of 4 | trn3Arch | CONFIRMED | As 50 and 51 | |
| 64 | Diagram: "16 CC-Cores orchestrate collectives among chips, within and across instances" | trainium2Arch | CONFIRMED | As 20 | |

Tiers: every URL in `src/sources/AwsCustomSilicon.ts` has the same tier in every other source
file that cites it (checked by grep). The only GitHub URL is pinned (`releases/tag/v2.28.3-1`).

## ORCH-NOTES items

- **Trainium3 NeuronLink-v4 per chip (2.56 TB/s, 2,048 GiB/s, 2 TB/s): COMPLIANT.** The
  disclosure "Trainium3's chip-to-chip bandwidth appears three ways" gives each figure with its
  own page: 2.56 TB/s from trainium3Arch ("2.56 TB/sec bandwidth per device"), 2,048 GiB/s from
  trn3Arch ("GiB/sec/device 2,048") and 2 TB/s from trn3Page ("2TB/s of bandwidth per chip"). It
  says the section uses the per-level figures instead, and no merged figure appears anywhere.
  The per-link figures match trn3Arch's bandwidth summary: intra-server 256 GB/s, inter-server
  320 GB/s, inter-rack 128 GB/s, all per chip and called bidirectional. Text and diagram agree.
  [SPECULATIVE] An open question for the orchestrator is below.
- **SBUF and PSUM names cited to the NeuronCore-v3 page: FIXED.** That page's body never names
  them (claim 4). The sentence now cites `nkiTrnInf2Arch`. Its key, title
  ("AWS Neuron: NKI Trainium/Inferentia2 Architecture Guide") and URL are identical to
  `src/sources/HeterogeneityFact.ts`, and `accessed` is now 2026-10-18 to match. The page says
  "two software-managed on-chip SRAMs" and "state buffer (SBUF) and partial sum buffer (PSUM)".
  "have no cache in front" had no source and now reads "are software-managed".
- **Neuron release items: CONFIRMED against the dated version headings of What's New**
  (claims 44 to 48). The 2.28.0 MoE kernels are Router Top-K, MoE CTE and MoE TKG (2026-02-26).
  vLLM Neuron is a beta (v0.21.0.1.0.0, 2026-07-20) and ships Wide-EP. The TorchNeuron page calls
  it a closed beta; the 2025-12-02 What's New entry labels it "Private Preview". The section
  follows the TorchNeuron page and cites it. NxD Inference maintenance status: the section does
  not claim it. The 2.32.0 note says "NxD Inference (NxDI) — now in maintenance mode; no new
  feature releases are planned", so nothing contradicts the page. The section's NxD Inference
  claim is the Trn1/Inf2 drop, now scoped (claim 58).
- **Trn2, Trn3 and Inf2 figures: all CONFIRMED** (claims 5 to 13, 17, 24, 50 to 52, 55, 56).
  FLOPS: the section's only FLOPS figure is 362 dense MXFP8 PFLOPS. The trn3Arch prose labels it
  dense, and the section does too. The section shows no per-chip FLOPS. The per-chip pages
  label only their sparse rows: Trainium2 "2,563 FP8/FP16/BF16/TF32 sparse TFLOPS" against
  unlabelled "1,299 FP8" and "667 BF16"; Trainium3 "2,517 FP16/BF16/TF32 sparse TFLOPS" against
  unlabelled "2,517 MXFP8/MXFP4" and "671 BF16". The Inferentia2 page labels neither.
- **Length (+27%): judged under Economy, 7.** The growth is register-required NEW content. The
  torus vs switch h2 is the section's mental model and earns its words. The cost is repetition
  of the Trn2 NeuronLink split in four places, two of them diagrams.

## Fixes applied

- `src/sections/AwsCustomSilicon.tsx:118-122`: "SBUF (State Buffer) and PSUM (Partial Sum
  buffer), have no cache in front: the compiler or an NKI ... kernel decides what sits in
  them.<Cite neuronCoreV3/>" -> "..., are software-managed: the compiler or an NKI ... kernel
  decides what sits in them.<Cite nkiTrnInf2Arch/><Cite neuronCoreV3/>".
- `src/sections/AwsCustomSilicon.tsx:181` (ncclV2283 popover note): "NCCL 2.28 moved some
  all-to-all and all-gather paths inside an NVLink domain onto copy engines to reduce SM use."
  -> "NCCL 2.28 added copy-engine collectives for all-to-all, all-gather, gather and scatter
  inside one (MN)NVLink domain to reduce SM use. They are opt-in: register buffers into
  symmetric windows and set NCCL_CTA_POLICY_ZERO."
- `src/sections/AwsCustomSilicon.tsx:275-276`: "replacing Trn2's point-to-point NeuronLink." ->
  "replacing Trn2's point-to-point NeuronLink topology." (paragraph re-wrapped).
- `src/sections/AwsCustomSilicon.tsx:360-362`: "dropped them in Neuron 2.29.0 and vLLM Neuron
  serves Trn2 and Trn3, so serving on either pins to Neuron 2.28." -> "dropped them in Neuron
  2.29.0, so serving either with it pins to Neuron 2.28; vLLM Neuron serves Trn2 and Trn3."
- `src/sources/AwsCustomSilicon.ts:68` (`nkiTrnInf2Arch`): accessed 2026-10-16 -> 2026-10-18
  (fetched today; matches HeterogeneityFact.ts).

No diagram changed, so I did not rebuild or re-shoot. Diagram scores use the author's shots in
`/tmp/silicon-shots-aws-custom/` (1440 and 390, both SVGs), which I read.

## Checks

- `pnpm exec tsc --noEmit | grep -E "AwsCustomSilicon|TrainiumChipDiagram|sources/AwsCustomSilicon"`:
  "no type errors in my files".
- `pnpm exec eslint src/sections/AwsCustomSilicon.tsx src/sources/AwsCustomSilicon.ts src/components/TrainiumChipDiagram.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t AwsCustomSilicon`: exit 0 (1 passed,
  34 skipped).
- `scripts/gates/no-ai-tells.sh`: exit 0. `svg-a11y.sh`: exit 0. `pinned-refs.sh`: exit 0.
  `pre-overflow.sh`: exit 0. None reports a hit in my files.

## For the orchestrator

- *Isolation: NIE and MIG* (`IsolationNie.tsx:455-457`) still cites `neuronCoreV3` for the SBUF
  (State Buffer) name. That page's body does not name SBUF. Re-cite to `nkiTrnInf2Arch` (same
  key, title and URL as here and in HeterogeneityFact.ts).
- [SPECULATIVE, own arithmetic; PCI-SIG pages could not be fetched] The trn3Arch summary gives
  the links as "4 x PCIe Gen6 x8" = 256 GB/s, "5 x" = 320 GB/s and "2 x" = 128 GB/s, which is
  64 GB/s per x8 link, all called bidirectional. As I understand the PCIe 6.0 rate (64 GT/s per
  lane), an x8 link carries about 64 GB/s in each direction. If so, AWS's "bidirectional" label
  may really mean per direction, and the bidirectional figures would be twice as large. The
  section repeats AWS's label as written. Before any section builds on these figures, confirm
  with AWS or the PCI-SIG specification.
- TorchNeuron status differs between two Tier 1 AWS pages: "closed Beta program" on the
  TorchNeuron page, "Private Preview" in the 2025-12-02 What's New entry. Any section that
  states it should say which page it follows.
- Trn3 page inconsistency (already in the author's report, confirmed today): the Gen2 overview
  says servers connect "via two second-level NeuronSwitch-v1 and NeuronLink-v4". The
  connectivity sub-sections describe a PCIe switch fabric "for all chip-to-chip communication".
- No new source records. `sources.md` needs no new entry for this section: `nkiTrnInf2Arch` was
  already in this file, and it is now cited from the h1 paragraph as well.

## Backlog

- The table has no per-chip FLOPS. If it adds them, label each one dense or sparse and say
  where AWS leaves a row unlabelled (see the ORCH item above). This is an enhancement.
- The NeuronLink-v4 disclosure could say outright that none of the three headline figures
  matches the 704 GB/s per-level sum, and that AWS does not reconcile them.
- If an AWS page states that no hardware cache sits between HBM and SBUF, the GPU contrast in
  the h1 ("have no cache in front") could come back with that citation.
- At 390 px both diagrams need a sideways scroll. A stacked phone layout for the fabric diagram
  would read better.
- Economy: the 1,024 / 256 GB/s split could sit in the NeuronLink-v3 block and the fabric
  diagram only, and come out of the chip diagram band and the placing-experts note's prose.
