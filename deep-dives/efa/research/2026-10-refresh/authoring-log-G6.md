# Authoring log G6: workloads, comparison and decision guide (October 2026 refresh, wave 2)

STATUS: COMPLETE (six owned files edited; typecheck, lint, test and the four gates pass)

Files owned: `src/sections/DecisionGuide.tsx`, `AIMLInference.tsx`, `Overview.tsx`, `HPC.tsx`,
`NetworkComparison.tsx`, `StorageDataPaths.tsx`.
Baseline: commit b39b4d3 (register line numbers). Every new or changed claim was re-read on 2026-10-23 at its
source: AWS and NVIDIA pages fetched with curl's default User-Agent and converted to text; code from
raw.githubusercontent.com at the pinned tag, with the first and last cited line printed and read. No personal data
(email, name, account details) was sent in any header, URL, query or body.

## Files done

All six. Diff stat: 219 insertions, 99 deletions.

| File | Lines before | Lines after | Prose words before -> after (approx.) |
| --- | --- | --- | --- |
| DecisionGuide.tsx | 600 | 643 | 1681 -> 1732 (+51) |
| AIMLInference.tsx | 224 | 268 | 802 -> 806 (+4) |
| Overview.tsx | 180 | 182 | 577 -> 577 (0) |
| HPC.tsx | 274 | 274 | 744 -> 751 (+7) |
| NetworkComparison.tsx | 366 | 371 | 716 -> 741 (+25) |
| StorageDataPaths.tsx | 1319 | 1345 | 4961 -> 5004 (+43) |

Most of the line growth is DocRef and CodeRef constants: 6 new DocRefs in DecisionGuide, 4 CodeRefs in
AIMLInference, 1 DocRef and 1 CodeRef in StorageDataPaths, plus a multi-line `doc()` helper. Word counts come from a
script that strips tags and code-shaped lines. It still counts some multi-line `doc()` title arguments, so
StorageDataPaths is overstated by about 15 words. The prose that remains comes from rows the brief made mandatory:
C17, C19 and C20 in DecisionGuide (about 55 words, offset by cutting the efa-start quote), B-25 in AIMLInference
(offset by cutting the Alert clause, the "different libraries" tail and the getting-started clause), and acronym
expansions (BBR, SHARP, NVMe, EC2, LoRA/QLoRA, UCX). Nothing was added beyond the register rows.

## Pin moves applied

| Repo | Old | New | Where | Lines re-read at the new tag |
| --- | --- | --- | --- | --- |
| ai-dynamo/nixl | v1.3.2 (Sources only) | v1.5.0 | AIMLInference `code.nixlPostWrite` (new) | `src/utils/libfabric/libfabric_rail.cpp` L1366 `nixl_status_t` (`nixlLibfabricRail::postWrite` opens at L1367), L1415 `ret = fi_writemsg(endpoint, &msg, fi_flags \| FI_REMOTE_CQ_DATA);` |
| vllm-project/vllm | v0.26.0 (Sources only) | v0.32.0 | AIMLInference `code.vllmBackends`, `code.vllmKvRole` (new) | `nixl/base_worker.py` L525-L527 `get_from_extra_config("backends", ["UCX"])`; `nixl/connector.py` L97-L103 kv_both deprecation warning |
| NVIDIA/nccl | none in this file | v2.32.3-1 | AIMLInference `code.ncclP2pKernel` (new) | `src/enqueue/enqueue.cc` L1241 `scheduleP2pTasksToPlan`, L1248 `plan->kernelFn = ncclDevKernelForFunc[ncclDevFuncId_P2p()]`, L1249 |
| ofiwg/libfabric | none in this file | v2.7.0 | StorageDataPaths `code.rdmOrder` (new) | `prov/efa/src/efa_prov_info.c` L642-L648, reorder-buffer comment and `tx_attr->msg_order`. G2 and G3 use L642-L649; L649 is blank |

Doc access dates moved to 2026-10-23 only on pages I re-read against every claim the file cites them for:
- AIMLInference: all three (`ACCESSED` constant).
- DecisionGuide: `efa`, `efaStart`, `capacityBlocks` (also 03 pin-move row 669), `hyperpodEks`, and the six new DocRefs.
- Overview: `efa`.
- HPC: `efa`, `efaStart`.
- NetworkComparison: `efa`, `nvlink`.
- StorageDataPaths: `fsxEfa`, `fsxClients` (GDS list re-read; other claims per register B-27), and the new `efa`.

StorageDataPaths storage pins (S3_SHA, IO_SHA, HTTP_SHA, PY_TAG, JAVA_TAG, XFER_TAG) were left unchanged on purpose.
See B-17 and B-19.

## Diagrams touched

StorageDataPaths only, text changes inside existing shapes. No geometry changed.
- Diagram 1 (`ThreeDataPathsDiagram`), FSx EFA lane, "What the bytes traverse" column (x 220 to 546). The three lines
  are re-wrapped as "LNet runs over the EFA device. The Lustre client kernel" / "module still handles metadata.
  GPUDirect Storage moves file" / "data to GPU memory on P5, P5e, P5en, P6-B200, P6-B300.". Estimated widths at 11px
  Helvetica metrics: 270, 298 and 294 px. The widest line already in the diagram is 301 px ("Full userspace TCP,
  TLS and HTTP over ENA, spread across").
- Diagram 2 (`CreateTimeDoorsDiagram`), Persistent 2 SSD column: "P5, P5e, P5en, P6-B200, P6-B300 clients."
  measures 206 px. The column's existing widest line is 213 px, and 254 px are available.
- Orchestrator: please confirm both in the 1440 and 390 screenshots.

## CLAIM DIFF

Line numbers are in the edited files. Tier follows the dive standard: Tier 1 is code at a pin or official AWS docs.

| file:line | New text (short) | Source (pinned) + tier | Register row |
| --- | --- | --- | --- |
| AIMLInference.tsx:104-107 | Over EFA, NIXL posts each transfer from a host thread through libfabric, so the transfer takes no SM | code-derived: https://github.com/ai-dynamo/nixl/blob/v1.5.0/src/utils/libfabric/libfabric_rail.cpp#L1366-L1415 (Tier 1 code) | 04 A2, B-07 |
| AIMLInference.tsx:108-109 | NCCL launches a GPU kernel for each point-to-point send and receive (claim unchanged, citation added) | code-derived: https://github.com/NVIDIA/nccl/blob/v2.32.3-1/src/enqueue/enqueue.cc#L1241-L1249 (Tier 1 code) | 04 A2 (row 113 evidence, re-pinned) |
| AIMLInference.tsx:114-115 | NIXL reaches EFA through its libfabric backend; integrates with Libfabric 1.21.0 and later (re-expressed; getting-started clause cut) | documented: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html ("NIXL integrates with Libfabric 1.21.0 and later") (Tier 1) | 04 B-06 (CORRECT) |
| AIMLInference.tsx:128-130 | Alert: no supporting benchmark located during this research; clause about the wrong organization removed | none (hedge, scope kept) | 04 A2, changelog voice |
| AIMLInference.tsx:136-140 | Name the libfabric backend with "backends": ["LIBFABRIC"], because the connector defaults to UCX | code-derived: https://github.com/vllm-project/vllm/blob/v0.32.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl/base_worker.py#L525-L527 (Tier 1 code) | 04 B-25 |
| AIMLInference.tsx:139-141 | LIBFABRIC is the backend that takes NIXL traffic over EFA | documented: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nixl.html ("NIXL backend to LIBFABRIC, which enables NIXL traffic to go over EFA") (Tier 1) | 04 B-25 |
| AIMLInference.tsx:141-143 | Set kv_role to kv_producer on prefill, kv_consumer on decode | code: connector.py L97-L103 at v0.32.0 (the deprecation message names both values) (Tier 1 code) | 04 B-24, B-25 |
| AIMLInference.tsx:143-150 | The AWS sample sets kv_both on both, a value the connector logs as deprecated | doc-code-conflict: efa-start-nixl.html (sample commands set "kv_role":"kv_both" for producer and consumer) vs https://github.com/vllm-project/vllm/blob/v0.32.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl/connector.py#L97-L103 (Tier 1 both) | 04 B-25 |
| AIMLInference.tsx (removed) | "a proxy coordinates the KV-cache handoff over EFA with no GPU compute cycles" | removed (unsourced, scope overreach) | 04 A2, B-07 |
| DecisionGuide.tsx:401 | Alert header: network-node topology labels come from the EKS control plane | see next row | 03 T19, T20 (cross-file consequence, see note) |
| DecisionGuide.tsx:405-410 | On a supported instance type, the AWS cloud controller manager that EKS runs in the control plane writes the network-node labels once, when the node registers, whatever provisioned it | documented: https://docs.aws.amazon.com/eks/latest/userguide/ml-workload-topology.html (Tier 1) | 03 T19, T20 |
| DecisionGuide.tsx:412-416 | In HyperPod task governance, TAS is on by default and not supported with Karpenter autoscaling; disable via kueue-manager-config and restart Kueue | documented: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-tasks-scheduling.html (Tier 1) | 04 A4(a), B-16 |
| DecisionGuide.tsx:498 | Alert header: a reservation takes a placement group, and a block places its own instances | as the next two rows | 03 C1 |
| DecisionGuide.tsx:499-501 | An On-Demand Capacity Reservation can be created for a cluster placement group, to keep capacity available as the cluster scales | documented: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html (Tier 1) | 03 C1, C9 |
| DecisionGuide.tsx:501-504 | A Capacity Block takes no placement group, and you cannot specify one when launching into it. AWS places a block's instances close together inside EC2 UltraClusters itself | documented: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html (Tier 1; vendor description kept attributed to AWS) | 03 C1 |
| DecisionGuide.tsx:509-510 | Up to 256 across blocks, counted across every account in the AWS Organization on any one date | documented: ec2-capacity-blocks.html (Tier 1) | 03 C19 |
| DecisionGuide.tsx:512-515 | Termination 30 min (instance types) or 60 min (UltraServer) before end, EventBridge event 10 min before (unchanged) | documented: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-how.html (Tier 1, accessed date moved) | 03 C4 |
| DecisionGuide.tsx:515-518 | Every block ends at 11:30 UTC; a P6e-GB200 UltraServer block needs its instances terminated at least 60 minutes before the end | documented: ec2-capacity-blocks.html (Tier 1) | 03 C17 (end time also C11) |
| DecisionGuide.tsx:518-519 | Finish the checkpoint by 10:30 UTC on the final day (our arithmetic) | derived, labelled in the sentence: 11:30 UTC minus 60 minutes | 03 C17 |
| DecisionGuide.tsx:522-523 | ODCRs: open-ended duration (claim unchanged, citation moved off efa-start, which does not state duration) | documented: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html (Tier 1) | 03 C5 (see skipped) |
| DecisionGuide.tsx:523-526 | Placement group chosen at creation; expanding raises insufficient-capacity risk (claim unchanged, citation added) | documented: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/cr-cpg.html (Tier 1) | 03 C6 |
| DecisionGuide.tsx:532-534 | Capacity Blocks are paid up front, and Savings Plans and Reserved Instance discounts do not apply to them | documented: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-pricing-billing.html (Tier 1) | 03 C20 |
| DecisionGuide.tsx:551-552 | LoRA (Low-Rank Adaptation) or QLoRA (quantized LoRA) | expansion only | 04 acronym table |
| Overview.tsx:70-71 | EC2 (Elastic Compute Cloud) | expansion only | 04 acronym table |
| Overview.tsx:74-76 | EFA provides lower and more consistent latency and higher throughput for cloud-based AI, ML and HPC workloads | documented: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html (Tier 1, near-verbatim) | 04 B-01 |
| NetworkComparison.tsx:131 | BBR (Bottleneck Bandwidth and Round-trip propagation time) | expansion only; verified against IETF draft-cardwell-iccrg-bbr-congestion-control-02 | 04 acronym table |
| NetworkComparison.tsx:156-158 | Latency row: lower and more consistent latency for AI, ML and HPC workloads. AWS publishes no per-message figure | documented: efa.html (Tier 1) | 04 B-31 |
| NetworkComparison.tsx:187-189 | NVLink 900 GB/s per GPU (4th gen, Hopper), 1,800 GB/s (5th gen, Blackwell), 3,000 GB/s (6th gen, Vera Rubin) | https://www.nvidia.com/en-us/data-center/nvlink/ specification table (DocRef tier 2 in this file; Sources.tsx id 45 grades it tier 3) | 04 B-30 |
| NetworkComparison.tsx:320-321 | SHARP (Scalable Hierarchical Aggregation and Reduction Protocol) | expansion verified on https://www.nvidia.com/en-us/networking/products/infiniband/ (already the cited DocRef, access date left at 2026-08-02) | 04 acronym table, U-8 |
| HPC.tsx:168-169 | MPICH and any other MPI sit outside that support statement (replaces the unsourced "MPICH runs over the same libfabric provider") | scope of efa.html support list (Tier 1), no new claim | 04 B-13 |
| HPC.tsx (removed) | MPICH column (`--with-libfabric`, `FI_PROVIDER=efa`) | removed, unsourced | 04 B-13, U-3 |
| HPC.tsx (removed) | Open MPI `--mca mtl ofi`, "EFA is selected automatically" | removed, unsourced | 04 B-12, U-2 |
| HPC.tsx:175-178 | EFA installer installs Open MPI 4.1 in /opt/amazon/openmpi and Open MPI 5 in /opt/amazon/openmpi5 by default; `module load openmpi5` puts Open MPI 5 on the PATH | documented: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html Steps 3 and 4 (Tier 1) | 04 B-12 |
| HPC.tsx:184-187 | I_MPI_OFI_LIBRARY_INTERNAL=0 makes Intel MPI load the libfabric the EFA installer ships instead of its own; I_MPI_OFI_PROVIDER=efa makes a misconfigured node fail at start-up instead of falling back to TCP | documented: efa-start.html Step 5 (Tier 1; the page shows the PMPI_Init fatal error) | 04 B-11 |
| HPC.tsx (removed) | `FI_PROVIDER=efa` for Intel MPI, "point it at the system libfabric" | replaced by the row above | 04 B-11 |
| HPC.tsx:188-189 | I_MPI_MULTIRAIL=1 on instances with two or more EFA interfaces is the setting behind the WRF result (claim unchanged, re-expressed) | multirail blog, already cited at HPC.tsx:141 (Tier 2) | 04 B-11 |
| HPC.tsx:253-254 | NVMe (Non-Volatile Memory Express) | expansion only | 04 acronym table |
| HPC.tsx:260 | Header "Hpc8a (AMD, Nitro v6)", dated word "newest" dropped | none | 04 B-09 (dated wording) |
| StorageDataPaths.tsx:208 | Diagram 1: GDS on P5, P5e, P5en, P6-B200, P6-B300 | documented: https://docs.aws.amazon.com/fsx/latest/LustreGuide/efa-file-systems.html ("Use an Amazon EC2 P5, P5e, P5en, P6-B200, or P6-B300 client instance") (Tier 1) | 04 B-26 |
| StorageDataPaths.tsx:369 | Diagram 2: "P5, P5e, P5en, P6-B200, P6-B300 clients." | as above | 04 B-26 |
| StorageDataPaths.tsx:639 | Scope table: GDS clients P5, P5e, P5en, P6-B200 or P6-B300 only | efa-file-systems.html; also https://docs.aws.amazon.com/fsx/latest/LustreGuide/configure-efa-clients.html (Tier 1) | 04 B-26 |
| StorageDataPaths.tsx:683 | Latency cell: AWS publishes no per-message figure for EFA, so baseline it with fi_pingpong. SRD delivers out of order, and the libfabric RDM endpoint restores message order in software | footer at :1299-1301: documented efa.html (Tier 1) and code-derived https://github.com/ofiwg/libfabric/blob/v2.7.0/prov/efa/src/efa_prov_info.c#L642-L648 (Tier 1 code) | 04 A5, B-20 |
| StorageDataPaths.tsx (removed) | "Single-digit microsecond class ... reorders in the transport" | removed (unsourced figure, wrong layer) | 04 A5, B-20 |
| StorageDataPaths.tsx:841 | Badge "five instance types" | efa-file-systems.html (Tier 1) | 04 B-26 |
| StorageDataPaths.tsx:847 | AWS names the GDS client instances exhaustively: P5, P5e, P5en, P6-B200 or P6-B300 | efa-file-systems.html (Tier 1) | 04 B-26 |
| StorageDataPaths.tsx:852-854 | "five instance types" ... "among the five" | derived count of the list above | 04 B-26 |
| StorageDataPaths.tsx:1043 | "(network interface card)" dropped from the quoted CRT comment | none (NIC is expanded at EnaVsEfa.tsx:704 by G2) | 04 acronym table |
| StorageDataPaths.tsx:1187-1189 | At the pinned commit, the C client never consults its instance table internally | code at S3_SHA 469cbd02 (unchanged pin) | 04 B-17 |

Note on the Karpenter Alert (DecisionGuide.tsx:399-418). This change is not one of my assigned rows. A4(a) closed
the Alert apart from the HyperPod scope. But plan correction 7 (03 T19, T20, T21) makes its header and second
paragraph wrong: "labels come from HyperPod task governance or a labeler DaemonSet you run". I rewrote that Alert
around the EKS control-plane labelling, cited to the EKS page I re-read. The register also gives code evidence for
the same behaviour (kubernetes/cloud-provider-aws v1.37.0 `pkg/providers/v1/instances_v2.go` L95-L117). I did not
fetch that code or add it as a citation. G5 owns the matching TopologyApi rows, so please check the two sections
agree after wave 2.

## Register rows: applied versus skipped

Applied: 04 A2, A4(a) / B-16, A5 / B-20, B-01, B-07, B-11, B-12, B-13, B-17, B-24 (pin and role wording), B-25,
B-26, B-30, B-31, the acronym rows for my files (EC2, NVMe, SHARP, BBR, LoRA/QLoRA, NIC), and the changelog-voice row
AIMLInference.tsx:96-98. 03 C1, C17, C19, C20. 02 O-07, O-09, O-12 and O-14 were checked: no wording drift, no change.

Skipped, with reasons:
- 04 B-18: CORRECT at the latest release. Storage material stays as is.
- 04 B-19: CORRECT at the latest release. The brief keeps storage material as is apart from dated claims, so the
  binding pins (PY_TAG v0.36.1, JAVA_TAG v0.48.3, XFER_TAG 0.15.0) were not moved.
- 04 B-17 extension (aws-c-s3 v1.1.0 memory-pool use of the table): per the brief, the sentence is scoped to its pin
  instead. The v1.1.0 behaviour is on the backlog in REVAMP-2026-10.md.
- 03 C5 (future-dated ODCR commitment): it changes nothing a reader of this guide configures. The ODCR page lists
  future-dated reservations only for families C, G, I, M, R, T, U and X, so P, Trn and Hpc reservations are
  immediate-use, with no term commitment. "Open-ended duration" holds for them. Citation corrected (row above).
- 03 C18 (Capacity Reservation Resource Groups): launch mechanics. It does not change the Blocks-against-ODCR
  choice this block teaches, and G5 owns C18 in TopologyApi.
- 04 B-06 optional addition (NIXL 1.0.0 and later in the efa.html support list), B-27 optional Intelligent-Tiering
  sentence (already present in the scope table), B-35 optional `I_MPI_MULTIRAIL` version note: optional rows, not
  assigned.
- 03 C8 optional (Capacity Blocks cover Trainium too): not assigned.

## Requested orchestrator changes (Sources.tsx, sources.md, README.md)

1. Glossary additions for acronyms these files expand: UCX (Unified Communication X; source: openucx/ucx README),
   LoRA (Low-Rank Adaptation), QLoRA (quantized LoRA), SHARP (Scalable Hierarchical Aggregation and Reduction
   Protocol; NVIDIA InfiniBand page), BBR (Bottleneck Bandwidth and Round-trip propagation time). UTC if G1 has not
   requested it.
2. Appendix sources for pages the DecisionGuide cites but the appendix may lack: capacity-blocks-pricing-billing.html,
   cr-cpg.html, ml-workload-topology.html (G5 may already request it), efa-start-nixl.html if absent. Ids 30 and 31
   are already dated 2026-10-23.
3. Source 45 (NVLink page): accessDate 2026-10-23. The NetworkComparison row cites the sixth generation (3,000 GB/s,
   Vera Rubin). Fact-check row 109 is scoped to P5 and can stay. If the comparison row has a fact-check entry, add the
   sixth generation there. NetworkComparison's DocRef grades the page tier 2 and Sources.tsx grades it tier 3; I left
   the file's grading alone. Please pick one.
4. Source 46 (NIXL libfabric_rail.cpp) cites L1310-L1336 at v1.5.0. My in-prose citation is L1366-L1415
   (`nixlLibfabricRail::postWrite` through its `fi_writemsg` call). Both are host-posted paths, so either is
   correct. Pick one if you want them to agree.
5. Fact-check row 117 ("vLLM NixlConnector: prefiller as producer, decoder as consumer"): source 38 at v0.32.0 is
   consistent. If you add a row for the backend default, it is base_worker.py L525-L527 at v0.32.0.
6. Fact-check rows or glossary entries that say "single-digit microsecond" for EFA, or say SRD reorders. I found none
   in Sources.tsx; a sources.md mention should follow A5.
7. ODCR glossary entry: "open-ended duration" matches the DecisionGuide.
8. If sources.md lists a source for the MPICH or `--mca mtl ofi` recipes, mark both as removed from the HPC section.

## Checks (run from the worktree root, foreground)

| Check | Exit |
| --- | --- |
| `pnpm --filter @tech-deep-dives/efa typecheck` | 0 |
| `pnpm --filter @tech-deep-dives/efa lint` | 0 |
| `pnpm --filter @tech-deep-dives/efa test` | 0 (12 of 12) |
| `bash scripts/gates/no-ai-tells.sh` | 0 |
| `bash scripts/gates/svg-a11y.sh` | 0 |
| `bash scripts/gates/pinned-refs.sh` | 0 |
| `bash scripts/gates/pre-overflow.sh` | 0 |

No failures, so none came from files other agents own. Build, preview and Playwright were not run (orchestrator).

STATUS: COMPLETE
