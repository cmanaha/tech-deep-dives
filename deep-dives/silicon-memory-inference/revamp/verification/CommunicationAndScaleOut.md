# Verification: Communication and Scale-Out

Verified: 2026-10-18 to 2026-10-23. Claims checked: 62 (sampled: 0). Confirmed 55, wrong 0,
unsupported 6, mislabelled 1, unverifiable 0.

## Gate 3 score: 8/10

Every figure the section leans on holds against its pinned or first-party source: the EFA table,
the NeuronLink-v3 split, DeepEP's 153 and 51 GB/s, and the NCCL, NIXL, Neuron and UALink release
facts. The fixes were scope and wording: the P6 page's internal conflict, the DeepEP kernel label,
the Trn2 "quarter", one uncited clause, the diagram's EFA cell and the UCX default. Growth of
about 46% is mostly required content, the open standards are demoted, and some restatement
remains. Economy is the weakest criterion (7).

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 55 of 62 confirmed; no figure wrong. Six unsupported as worded (P6 page "400 per GPU" omitted its own 3.2 Tbps instance row, DeepEP "V1", Trn2 quarter scoped to all outbound traffic, UCIe clause uncited, diagram "EFA between servers", "SGLang defaults to UCX"), all fixed. One tier question reported |
| Mental model or practical value | 9 | Model: traffic shape picks the library; SRD trades ordering for path spraying; torus versus switch. Practice: trn2.48xlarge needs all 16 EFA interfaces for NIXL, `nki.collectives.all_to_all_v` from 2.29.0, per-GPU EFA from the table. Every block does one of the two |
| Shape | 8 | h1 frames before the stack dissects; every h2 description states a payoff; "a third" and "a quarter" land in the body and again in the close; UEC/UALink and library details sit in ExpandableSections; ends on "Across EFA, use the path built for it" |
| Writing | 8 | no-ai-tells gate clean in my files; things defined by what they are. One attribution fails the deletion test ("On EFA, AWS lists DeepEP v2 ... as a supported library"); left, being style |
| Economy | 7 | +46% visible words, mostly register-required (EFA table, Trainium API, NIXL on Neuron, NCCL EP). The Alert "Pick the library by the shape of the traffic" restates the stack paragraph's collective/transfer definition, and the closing list of libraries per fabric repeats the diagram's EFA and Trainium columns |
| Diagrams | 9 | SVG, role="img", aria-labelledby title stating the assertion; probe "ok" at 1440 and 390, no overlap or clipping; at 390 it scrolls sideways at 640 px per the dive convention, labels small but legible |

## Claims

The section was rewritten, so every claim is new. All claims were checked; none sampled.

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | NCCL implements all-reduce, all-gather, broadcast, reduce, all-to-all, scatter, gather; 2.28.3 adds host APIs ncclAlltoAll, ncclScatter, ncclGather | ncclV2283 | CONFIRMED | Release v2.28.3-1 (2025-10-06): "Introduce new host collective APIs: ncclAlltoAll, ncclScatter, ncclGather." | |
| 2 | NCCL reaches EFA through the aws-ofi-nccl plugin | awsOfiNccl | CONFIRMED | Release v1.21.1 (2026-08-20): "compiling AWS-specific support requires at least Libfabric v1.22.0"; "Vendored the EFA GDA source". README at the same tag: "a plug-in which enables EC2 developers to use libfabric as a network provider while running NVIDIA's NCCL based applications" | |
| 3 | Most collectives run as CUDA kernels on SMs; from 2.28 all-to-all, scatter, gather, all-gather inside one NVLink domain can run on copy engines | ncclV2283 | CONFIRMED | "CE (Copy Engine) Collectives: Reduce SM utilization for alltoall, scatter, gather, and allgather within a single (MN)NVL domain." | |
| 4 | Initial Rubin (sm107) support in v2.32.3-1, without Rubin performance tuning | ncclV2323 | CONFIRMED | v2.32.3-1 (2026-09-17): "Adds initial Rubin platform support including support for sm107"; "does not contain performance model tuning for Rubin" | |
| 5 | NIXL accelerates point-to-point transfers for inference frameworks such as Dynamo | nixlReadme | CONFIRMED | README v1.5.0: "targeted for accelerating point to point communications in AI inference frameworks such as NVIDIA Dynamo" | |
| 6 | Dynamo moves the KV cache from prefill to decode GPU memory with NIXL | dynamoDisaggDoc | CONFIRMED | v1.5.1 doc: "Dynamo leverages NIXL to transfer KV cache directly from the VRAM of the prefill engine to the VRAM of the decode engine." | |
| 7 | libfabric plugin lists AWS EFA as its one validated provider | nixlLibfabric | CONFIRMED | README v1.5.0: "Validated compatibility with: AWS EFA"; "Any other Libfabric providers should also work but have not been validated" | |
| 8 | Plugin moves Trainium device memory with one EFA interface per Neuron device; trn2.48xlarge needs all 16 EFA interfaces; default launch attaches one ENA interface; trn2.3xlarge does not qualify | nixlLibfabric | CONFIRMED | "requires one EFA network interface per Neuron device attached to the instance at launch time"; table "trn2.48xlarge 16 ... Yes, when launched with all 16 EFA NICs attached", "trn2.3xlarge 1 ... No"; "the default aws ec2 run-instances invocation only attaches a single ENA (non-EFA) interface" | |
| 9 | NCCL, NIXL and MPI reach EFA through libfabric, which bypasses the OS kernel | efaUserGuide | CONFIRMED | "AI/ML applications use NCCL and NIXL ... HPC applications use MPI, to interface directly with the Libfabric API. The Libfabric API bypasses the operating system kernel" | |
| 10 | On an in-order transport one lost packet delays every packet behind it | srdHpcBlog | CONFIRMED | "a single packet getting lost messes up the on-time arrival of all the packets behind it in the queue" | |
| 11 | SRD relaxes in-order delivery; sends a block's packets over 64 paths at a time out of hundreds or thousands; higher layers restore order | srdHpcBlog | CONFIRMED | "we relaxed the requirement for in-order packet delivery"; "SRD can push all the packets making up a block of data all at once, over all the possible pathways ... we choose 64 paths at a time from the hundreds or even thousands available"; "we can re-assert it in the higher layers of the stack" | |
| 12 | p5.48xlarge: 8 H100 | ec2AcceleratedSpecs | CONFIRMED | Performance specs: "p5.48xlarge ... 8 x NVIDIA H100 GPU" | |
| 13 | p5.48xlarge: 3,200 Gbps, 400 per GPU (derived 3,200 / 8) | ec2AcceleratedSpecs | CONFIRMED | Network specs: "p5.48xlarge ... 3200 Gigabit ... EFA Yes"; 3,200 / 8 = 400 | |
| 14 | p5.48xlarge: Nitro v4, EFA v2 | efaUserGuide | CONFIRMED | "Nitro v4 (EFA v2)" table: "p5.48xlarge Yes Yes Yes No" | |
| 15 | p6e-gb200.36xlarge: 4 B200 | ec2AcceleratedSpecs | CONFIRMED | "p6e-gb200.36xlarge ... 4 x NVIDIA B200 GPU" | |
| 16 | p6e-gb200.36xlarge: 3,200 Gbps, 800 per GPU (derived 3,200 / 4) | ec2AcceleratedSpecs | CONFIRMED | "p6e-gb200.36xlarge ... 3200 Gigabit"; 3,200 / 4 = 800 | |
| 17 | "the P6 page gives 400 per GPU" | p6Page | UNSUPPORTED (incomplete) | P6 page prose: "400 GB ps per GPU of EFAv4 networking for a total of 28.8 Tbps per P6e-GB200 UltraServer"; UltraServer table "u-p6e-gb200x72 72 ... 28,800"; but its instance table: "p6e-gb200.36xlarge 4 ... Network bandwidth (Tbps) 3.2", which is 800 per GPU. The P6 page gives both figures | Cell now: "the P6 page's prose gives 400 per GPU, its instance table 3.2 Tbps", each cited to p6Page; prose under the table now says the P6 page disagrees with itself |
| 18 | p6e-gb200: Nitro v5 in the instance specification; Nitro v6, EFA v4 in the EFA guide | ec2AcceleratedSpecs, efaUserGuide | CONFIRMED (conflict) | Instance family summary: "P6e-GB200 Nitro v5"; EFA guide "Nitro v6 (EFA v4)" table: "p6e-gb200.36xlarge Yes Yes Yes No" | |
| 19 | p6-b300.48xlarge: 8 B300; 6,400 Gbps, 800 per GPU (derived) | ec2AcceleratedSpecs | CONFIRMED | "p6-b300.48xlarge ... 8 x NVIDIA B300 GPU"; "6400 Gigabit"; 6,400 / 8 = 800 | |
| 20 | p6-b300.48xlarge: Nitro v6, EFA v4 | efaUserGuide | CONFIRMED | "Nitro v6 (EFA v4)": "p6-b300.48xlarge Yes Yes Yes Yes"; spec page hypervisor "P6-B300 Nitro v6" agrees | |
| 21 | trn2.48xlarge: 16 Trainium2 | trn2Arch | CONFIRMED | "Trn2 instances are powered by 16 Trainium2 chips" | |
| 22 | trn2.48xlarge: 3,200 Gbps, 16 x 200 | ec2AcceleratedSpecs | CONFIRMED | "trn2.48xlarge ... 16x 200 Gigabit"; trn2Arch also "EFAv3 bandwidth (Gbps) 3,200" | |
| 23 | trn2.48xlarge: Nitro v5, EFA v3 | efaUserGuide | CONFIRMED | "Nitro v5 (EFA v3)": "trn2.48xlarge Yes Yes No No" | |
| 24 | Trn3 Gen2 UltraServer: 144 Trainium3 | trn3Arch | CONFIRMED | "Gen2 with 144 chips per UltraServer" | |
| 25 | Trn3 Gen2 UltraServer: 28,800 Gbps, scope not stated | trn3Arch | CONFIRMED | Table headers "Trn3 Gen1 UltraServer / Trn3 Gen2 UltraServer": "EFA bandwidth (Gbps) 12,800 / 28,800"; no per-server scope given, as the note says | |
| 26 | No Trn3 row in the EFA guide | efaUserGuide | CONFIRMED | No trn3 instance in any Nitro table (fetched 2026-10-18) | |
| 27 | Trainium2 has 16 CC-Cores per chip | trainium2Arch | CONFIRMED | "16 CC-Cores orchestrate collective communication among Trainium2 chips within and across instances" | |
| 28 | CC-Cores are synchronization processors deciding when data movement engines transfer data | collectives | CONFIRMED | "dedicated synchronization processors"; "The CC cores control when and how data movement engines transfer data" | |
| 29 | NeuronLink-v3: 1,024 GB/s per chip in-instance plus 256 GB/s to other instances of a Trn2 UltraServer | trn2Arch | CONFIRMED | "Intra-instance NeuronLink-v3 bandwidth (GB/sec/chip) 1,024 / 1,024"; "Inter-instance NeuronLink-v3 bandwidth (GB/sec/chip) Not applicable / 256" (256 for the UltraServer column only) | |
| 30 | Each instance a 4x4 2D torus; same-position chips form rings across four instances | trn2Arch | CONFIRMED | "16 Trainium2 chips are connected using a 4x4, 2D Torus topology"; "Trainium2 chips with the same coordinates in each Trn2 instance are connected in a ring topology" | |
| 31 | "a 4x4x4 torus in effect" (derived; AWS does not use the term) | trn2Arch | CONFIRMED | Page uses neither "3D torus" nor "4x4x4"; 4x4 per instance x 4-node ring = 4x4x4; note states AWS does not use the term | |
| 32 | 64-chip scale-up domain | trn2Arch | CONFIRMED | "a total of 64 Trainium2 chips to be interconnected within a Trn2 UltraServer" | |
| 33 | Trn3 replaces the torus with a switched all-to-all fabric, NeuronSwitch-v1, in 64 or 144 chips | trn3Arch | CONFIRMED | "Gen1 with 64 Trainium3 chips per UltraServer, and Gen2 with 144"; "Both configurations use NeuronSwitch-v1 interconnect technology to enable all-to-all connectivity"; "replacing the previous 2D-torus architecture"; "a switched fabric" | |
| 34 | nki.collectives.all_to_all_v from Neuron 2.29.0 | neuronWhatsNew | CONFIRMED | 2.29.0 (2026-04-09): "Variable-length all-to-all collectives are now available via nki.collectives.all_to_all_v." | |
| 35 | Neuron Runtime AllToAllV on Trn2 and Trn3 from 2.32.0 | neuronWhatsNew | CONFIRMED | 2.32.0 (2026-08-17): "Adds variable-size collectives (AllGatherV, ReduceScatterV, AllToAllV)" on Trn2 and Trn3 | |
| 36 | NKI Library MoE kernels shipped in 2.28.0 | neuronWhatsNew | CONFIRMED | 2.28.0 (2026-02-26): "MoE CTE (Context Encoding), MoE TKG (Token Generation)"; the 2.27.0 kernel list has none. Matches AWS Trainium, Inferentia and Neuron claim 46 | |
| 37 | torch.all_to_all_vdev_2d is a PyTorch op built on NVSHMEM | pytorchNvshmem | CONFIRMED | v2.14.1 nvshmem_extension.hpp, namespace c10d::nvshmem_extension, L64: "void all_to_all_vdev_2d(" | |
| 38 | TorchNeuron lists it for a future release | pytorchNative | CONFIRMED | FAQ: "torch.all_to_all_vdev_2d and torch.all_to_all_vdev_2d_offset (MoE Dispatch/Combine ops)" "will be supported in future releases" | |
| 39 | Wide-EP runs over GB200 multi-node NVLink; it is TensorRT-LLM's path on GB200 | wideEpReadme | CONFIRMED | README v1.2.1: "Custom EP communication kernels optimized for NVIDIA GB200 Multi-Node NVLink (MNNVL)" | |
| 40 | Wide-EP is a beta in vLLM Neuron; NxD Inference is in maintenance | neuronWhatsNew | CONFIRMED | vLLM Neuron Beta post (2026-07-20, v0.21.0.1.0.0): "Wide expert parallelism (Wide-EP) for MoE models"; 2.32.0: "NxD Inference (NxDI) - now in maintenance mode" | |
| 41 | NxD Inference documents EP over All-Gather | nxdiMoe | CONFIRMED | v2.32.0: "Currently, Expert Parallelism uses All-Gather to gather all tokens at all ranks" | |
| 42 | Dispatch and combine: two all-to-all exchanges per MoE layer | deepEpReadme | CONFIRMED | "all-to-all GPU kernels, which are also known as MoE dispatch and combine" | |
| 43 | DeepEP (release v1.2.1) "V1 kernels" measured 153 GB/s EP8 dispatch over NVLink and 51 GB/s EP64 dispatch over RDMA, H800 with 400 Gb/s ConnectX-7 | deepEpReadme | UNSUPPORTED (label only) | Numbers verbatim from "Normal kernels with NVLink and RDMA forwarding": "We test normal kernels on H800 ... CX7 InfiniBand 400 Gb/s RDMA network card"; "Intranode 8 153 GB/s (NVLink)", "Internode 64 51 GB/s (RDMA)" (column "Bottleneck bandwidth"). The README at v1.2.1 never says "V1". No latency figure is quoted in this section | "V1 kernels" to "normal kernels" |
| 44 | AWS lists DeepEP v2 from its amazon-contributing fork as a supported library | efaUserGuide | CONFIRMED | "Supported interfaces and libraries": "DeepEP v2" linked to github.com/amazon-contributing/DeepEP | |
| 45 | NCCL EP nccl-ep-v0.1.0, June 2026: dispatch and combine primitives, full multi-node NVLink support, SM-count setting | ncclEp | CONFIRMED | Published 2026-06-08: "optimized dispatch and combine primitives for Expert Parallelism"; "Add full Multi-node-NVLINK (MNNVL) support"; "Allow users to set the number of SMs used by NCCL EP" | |
| 46 | SGLang --moe-a2a-backend values include deepep, mooncake, nixl, mori | sglangExecArgs | CONFIRMED | exec_.py v0.5.21 L710-722: Literal["none","deepep","mooncake","nixl","mori",...] | |
| 47 | EP64 RDMA dispatch ran at a third of the EP8 NVLink rate (derived 51 / 153) | deepEpReadme | CONFIRMED | 51 / 153 = 0.333 | |
| 48 | A Trn2 chip has a quarter of its in-instance bandwidth "for traffic leaving the instance" (derived 256 / 1,024) | trn2Arch | UNSUPPORTED (scope) | 256 / 1,024 = 0.25 is right, but trn2Arch gives the 256 GB/s only for the UltraServer column ("Not applicable" for a standalone trn2.48xlarge, whose outbound traffic goes over EFA) | Scoped to "a quarter of its in-instance NeuronLink bandwidth toward the other instances of an UltraServer" |
| 49 | 8 GPUs in a P5 | ec2AcceleratedSpecs | CONFIRMED | as claim 12 | |
| 50 | Up to 72 GPUs in a P6e-GB200 UltraServer domain | p6Page | CONFIRMED | "customers can access up to 72 Blackwell GPUs within one NVLink domain" | |
| 51 | 16 chips in a trn2.48xlarge | trn2Arch | CONFIRMED | as claim 21 | |
| 52 | UEC Specification 1.0, June 2025: Ethernet-based stack with RDMA for AI and HPC, up to millions of endpoints | uecSpec10 | CONFIRMED | Press release dated June 11, 2025: "a comprehensive, Ethernet-based communication stack"; "Modern RDMA for Ethernet and IP"; "UEC scales to millions of endpoints" | |
| 53 | UALink 200G 1.0, April 2025: read, write, atomic transactions between up to 1,024 accelerators in a pod | ualink10 | CONFIRMED | PR (2025-04-08): "200G per lane scale-up connection for up to 1,024 accelerators within an AI computing pod"; "using read, write, and atomic transactions" | |
| 54 | Common Specification 2.0, April 2026, adds in-network compute | ualinkFourSpecs | CONFIRMED | PR (2026-04-07): "UALink Common Specification 2.0 o Introduces In-Network Compute" | |
| 55 | AWS sat on the UALink board at the 1.0 release | ualink10 | CONFIRMED | "led by a board made up of ... Alibaba, AMD, Apple, Astera Labs, AWS, Cisco, Google, HPE, Intel, Meta, Microsoft, and Synopsys" | |
| 56 | UALink chiplet specification complies with UCIe | (none) | UNSUPPORTED (uncited) | ualinkFourSpecs states it: "UALink Chiplet Specification 1.0 ... Fully compliant with the UCIe 3.0 Specification", but the sentence carries no Cite | Added `<Cite s={S.ualinkFourSpecs} />` |
| 57 | Tier of ualink10, ualinkFourSpecs (Tier 1) | ualink10, ualinkFourSpecs | MISLABELLED | Both URLs are consortium press releases (dateline, media contact), Tier 2 under the brief; uecSpec10, also a consortium press release, is Tier 2. The 2026-10 register grades both UALink releases T1 and UEC T2, and ualinkFourSpecs is shared with ChipletAndInterconnect.ts at Tier 1 | Not changed: re-grading one record would split the same publisher's releases across tiers, and the shared one is outside my files. For the orchestrator |
| 58 | Diagram, Trainium transport: "Trn2 / Trn3; EFA between servers" | trn2Arch, trn3Arch | UNSUPPORTED (scope) | trn2Arch: the four instances of a Trn2 UltraServer link over NeuronLink-v3 ("Inter-instance NeuronLink-v3 bandwidth ... 256"); trn3Arch Gen2: servers "connected via two second-level NeuronSwitch-v1 and NeuronLink-v4". EFA carries traffic beyond the NeuronLink domain, not between every pair of servers | "EFA between servers" to "EFA beyond NeuronLink" |
| 59 | "vLLM and SGLang default to UCX, and EFA needs LIBFABRIC" (uncited, points to Disaggregated Serving) | (cross-reference) | UNSUPPORTED (as worded) | Disaggregated Serving and Speculative Decoding, verified 2026-10-18 (not re-fetched here): "vLLM's NixlConnector defaults to UCX"; "SGLang defaults to Mooncake, and to UCX under NIXL". SGLang's default backend is Mooncake | "vLLM and SGLang default to UCX" to "NIXL in vLLM and SGLang defaults to UCX" |
| 60 | AWS is designing Trainium4 for NVLink 6 through NVLink Fusion (roadmap) | nvlinkFusionTrainium4 | CONFIRMED | NVIDIA Technical Blog (2025-12-02): "AWS is designing Trainium4 to integrate with NVLink 6 and the NVIDIA MGX rack architecture"; "leveraging NVLink Fusion for Trainium4 deployment". Marked `roadmap` | |
| 61 | Diagram, EFA hardware: "Nitro card v5 / v6, v4 on P5" | ec2AcceleratedSpecs, efaUserGuide | CONFIRMED | Hypervisor column: "P5 Nitro v4", "P5en Nitro v5", "P6-B200 Nitro v6", "P6-B300 Nitro v6", "P6e-GB200 Nitro v5"; EFA guide puts p5en in Nitro v5, P6 sizes in Nitro v6 | |
| 62 | "AWS Trainium, Inferentia and Neuron draws both fabrics"; "This research located no AWS announcement of a UEC or UALink product" | (cross-reference; scoped silence) | CONFIRMED | AwsCustomSilicon.tsx renders TrainiumFabricDiagram under "MoE on Trainium: from a torus to switches". The silence keeps its scope ("this research located no") as the register states it | |

## ORCH-NOTES items

- **DeepEP "V1" label: FIXED, figures CONFIRMED.** Line 389 now reads "its normal kernels
  measured". DeepEP README at v1.2.1, "Normal kernels with NVLink and RDMA forwarding": "We test
  normal kernels on H800 ... CX7 InfiniBand 400 Gb/s"; "Intranode 8 153 GB/s (NVLink)";
  "Internode 64 51 GB/s (RDMA)" (column "Bottleneck bandwidth"). The section quotes no DeepEP
  latency figure. The derived "a third" (51 / 153 = 0.333) holds.
- **EFA per GPU on P6e-GB200: FIXED (conflict now named per page).** The EC2 specification gives
  "p6e-gb200.36xlarge ... 3200 Gigabit" for "4 x NVIDIA B200 GPU" (800 per GPU, derived). The P6
  page's prose gives "400 GB ps per GPU of EFAv4 networking for a total of 28.8 Tbps per
  P6e-GB200 UltraServer", but its own instance table gives "Network bandwidth (Tbps) 3.2" for the
  4-GPU size. The cell had only "the P6 page gives 400 per GPU"; it now reads "the P6 page's
  prose gives 400 per GPU, its instance table 3.2 Tbps", and the sentence under the table says
  "AWS's pages disagree on P6e-GB200's Nitro generation and on its EFA per GPU, and the P6 page
  disagrees with itself." The Nitro conflict is CONFIRMED: specification "P6e-GB200 Nitro v5",
  EFA guide lists p6e-gb200.36xlarge under "Nitro v6 (EFA v4)".
- **Trainium3 NeuronLink-v4 per chip: COMPLIANT (no figure quoted).** The section and its
  diagram name NeuronLink-v4 only as a link name (caption cite trn3Arch); no 2.56 TB/s,
  2,048 GiB/s or 2 TB/s figure appears, so nothing needs a page name. trn3Arch confirms
  NeuronLink-v4 alongside NeuronSwitch-v1 ("connected via two second-level NeuronSwitch-v1 and
  NeuronLink-v4"). Consistent with AWS Trainium, Inferentia and Neuron.
- **NCCL v2.28.3-1, NIXL on Neuron, NCCL EP, UEC 1.0, UALink 1.0: CONFIRMED** against the
  pinned releases and press releases (claims 1, 3, 4, 7, 8, 45, 52 to 55). One gap fixed: the
  UCIe clause had no citation (claim 56). Tier question on the UALink releases reported below.
- **Neuron release for the NKI MoE kernels: CONFIRMED as 2.28.0.** Line 351: "the NKI
  Library's MoE kernels shipped in 2.28.0". What's New, 2.28.0 (2026-02-26): "MoE CTE (Context
  Encoding), MoE TKG (Token Generation)".
- **Length (+46%): judged in Economy (7).** Growth is mostly required content; about 60 words of
  restatement are listed in the Backlog.

## Fixes applied

- `src/sections/CommunicationAndScaleOut.tsx:55-57`: "; the P6 page gives 400 per GPU
  <Cite p6Page/>" became "; the P6 page's prose gives 400 per GPU <Cite p6Page/>, its instance
  table 3.2 Tbps <Cite p6Page/>".
- `:204`: added `<Cite s={S.ualinkFourSpecs} />` after "which the UALink chiplet specification
  complies with."
- `:247-248`: "vLLM and SGLang default to UCX (Unified Communication X)" became "NIXL in vLLM
  and SGLang defaults to UCX (Unified Communication X)".
- `:313-314`: "The two AWS pages disagree on P6e-GB200's Nitro generation and on its EFA per GPU."
  became "AWS's pages disagree on P6e-GB200's Nitro generation and on its EFA per GPU, and the P6
  page disagrees with itself."
- `:389`: "its V1 kernels measured" became "its normal kernels measured".
- `:413-414`: "a quarter of its in-instance bandwidth for traffic leaving the instance" became "a
  quarter of its in-instance NeuronLink bandwidth toward the other instances of an UltraServer".
- `src/components/CommunicationStack.tsx:50`: "Trn2 / Trn3; EFA between servers" became "Trn2 /
  Trn3; EFA beyond NeuronLink".

## Checks

- `pnpm exec tsc --noEmit | grep ...`: "no type errors in my files".
- `pnpm exec eslint src/sections/CommunicationAndScaleOut.tsx src/sources/CommunicationAndScaleOut.ts src/components/CommunicationStack.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t CommunicationAndScaleOut`: exit 0
  (1 passed, 34 skipped).
- Gates from the repo root: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0,
  pre-overflow exit 0; no hits for CommunicationAndScaleOut or CommunicationStack in any output.
- `pnpm exec vite build --outDir /tmp/vf-CommunicationAndScaleOut-dist --emptyOutDir`: exit 0.
- `node scripts/shoot.mjs --sections communication --widths 1440,390 ...`: "communication
  @1440: 1 SVG diagram(s), 0 React Flow, ok" and the same at 390; exit 0. PNGs read: at 1440
  every cell label, including the longer "Trn2 / Trn3; EFA beyond NeuronLink", sits inside its
  box with padding; no crossings (the grid has no connectors). At 390 the diagram scrolls
  sideways at 640 px and the page does not overflow.

## For the orchestrator

- `deepEpReadme` title "DeepEP README at tag v1.2.1 (V1 kernel performance tables)" is identical
  in `src/sources/MoeAndSparseActivation.ts` and `src/sources/CommunicationAndScaleOut.ts`; the
  README never says "V1". Rename to "(normal kernel performance tables)" in both at once (the MoE
  verifier raised the same).
- Tier of the UALink press releases: `ualink10` (this file only) and `ualinkFourSpecs` (this file
  and `ChipletAndInterconnect.ts`) are Tier 1 per the register, but both are consortium press
  releases (dateline, media contact), which the brief grades Tier 2, and `uecSpec10`, the UEC
  press release, is Tier 2. Decide once and apply to all three files together; I left them so
  the records stay identical.
- Grace-Blackwell and UltraServer says "AWS gives 400 Gbps of fourth-generation EFA per GPU"
  citing the P6 page; the P6 page's own instance table gives 3.2 Tbps per four-GPU instance (800
  per GPU). It may want the same "the P6 page disagrees with itself" wording used here.
- sources.md: no record or URL added or removed; one new citation of an existing record
  (`ualinkFourSpecs`) if the appendix lists citation sites.

## Backlog

- Economy (about 60 words): the Alert "Pick the library by the shape of the traffic" restates
  the stack paragraph's collective/transfer distinction; it could keep only the production-use
  sentence. The closing "Across EFA, use the path built for it" list repeats the diagram's EFA
  and Trainium columns; the h1's "host control traffic" is never picked up again.
- Writing: "On EFA, AWS lists DeepEP v2 from its amazon-contributing fork as a supported
  library" could drop the attribution ("DeepEP v2, from AWS's amazon-contributing fork, is a
  supported EFA library").
- The EFA table could add p6-b200.48xlarge and p5en.48xlarge (both in the EFA guide) to show the
  Nitro v5 GPU row the diagram's "Nitro card v5 / v6" implies.
