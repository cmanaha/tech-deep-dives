# Gate 3 apply log, Batch C (October 2026 refresh)

Applier: Gate 3 corrections, accuracy fixes and leverage pass, 2026-10-23.
Input: `gate3-C.md`. Scope: Overview, AIMLInference, HPC, NetworkComparison,
DecisionGuide, EKSIntegration, SageMaker, StorageDataPaths.

STATUS: see last line

Word counts are approximate prose words (JSX text, string attributes and table
cell strings, excluding code, comments and DocRef fields), from one script run
on a pre-edit snapshot of all eight files and on the edited files. All counts in
this log are from the final version of that script.

## 1. DecisionGuide.tsx

### Corrections

| # | Status | Note |
|---|---|---|
| 1 | Applied | SageMaker Alert: "No AWS source located during this research states that training jobs use EC2 cluster placement groups". |
| 2 | Applied | Spot paragraph: "Spot rates do not appear in the EC2 Price List bulk API, or in any credential-free first-party AWS endpoint located during this research". |
| 3 | Applied | SMDDP Alert header "SMDDP covers P4-class instances only, and it has been frozen since April 2025"; body uses the scorer's text. Registry gains `smpRelease` (copied from SageMaker.tsx, accessed 2026-10-23); `ddpRelease` re-dated to 2026-10-23 to match the SageMaker copy. The smpRelease SourceRef reuses the SageMaker section's props (provenance doc-code-conflict, same conflict string, label "doc conflict"). |
| 4 | Applied | Stage 1: "One g5.xlarge, or p5.4xlarge, the smallest P5 size, if you want a single H100 [ac]". |
| 5 | Applied | SMDDP Alert p2 opens "On P4d and P4de, which carry NVIDIA A100 GPUs, NCCL takes up to 24". |
| 6 | Applied | Karpenter h2 description as written by the scorer. |

### Accuracy flags

- SMDDP v2.5.0 against SMDDP 2.6.0 in SMP v2.8.0: resolved by correction 3 (orchestrator decision, aligned with SageMaker.tsx).
- NVLink on trn1.32xlarge: applied per the orchestrator decision. Stage 2: "NVLink on p5.48xlarge, or NeuronLink on trn1.32xlarge, carries every collective [trn1Arch]". Table row 1 reason: "Single node: NVLink or NeuronLink carries every collective" (table cells carry no SourceRef in this table; the Stage 2 and Question 1 citations carry it). New DocRef `trn1Arch` (AWS Neuron v2.33.0 Trn1 architecture page, tier 1, accessed 2026-10-23, quote supplied by the orchestrator: "The Trn1.32xlarge and Trn1n.32xlarge instance size come with a high-bandwidth and low-latency NeuronLink-v2 chip-to-chip interconnect"). Not re-fetched by me.
- Extended to Question 1, which had the same defect ("A single-instance workload runs entirely on NVLink"): now "runs its collectives over NVLink on a multi-GPU instance, or NeuronLink on trn1.32xlarge [trn1Arch]". The uncited "at full speed" is dropped.
- L194 (serving row, "Single P5 or trn1.32xlarge with TP=8"): no NVLink claim in that row; left unchanged.

### Leverage edits

| Verb | Block | Reason |
|---|---|---|
| Delete | Table rows 2 and 6 (zone and placement group restatement) | Economy target: the one-zone, recommended-not-required pair. Row 6 keeps "Hpc7a, which is not Spot eligible". |
| Re-express | Table footer | Becomes the second of the two kept statements: "Every multi-node recommendation above puts all nodes in one Availability Zone, with a cluster placement group recommended rather than required [efa][efaStart]". Replaces the sourcing note. |
| Delete | Question 3, "The Availability Zone is the gate. EFA traffic cannot cross Availability Zones or VPCs" | Restatement of the opener; the consequence "A job that has to span zones cannot use EFA at all [efa]" stays. |
| Delete | Karpenter zonal-pinning bullet, "which is the constraint EFA actually has [efa]" | Restatement; the efa.html citation could only bear the EFA rule, not the Karpenter mechanism. |
| Delete | Stage 3, "One Availability Zone is required. A cluster placement group is recommended, not required [efaStart]" | Restatement. Playbook h2 description re-expressed to "Four stages from one GPU to a hundred nodes, and the stage at which EFA becomes critical." (traces to Stage 3 "EFA is now critical"). |
| Delete | SageMaker Alert, "to keep them physically close and minimize inter-node latency", "That satisfies the one boundary EFA traffic cannot cross [efa]" (re-expressed as "so the zone rule is met for you"), "and remember AWS calls the placement group a recommendation rather than a requirement [efaStart]", "That is the work the platform name hides." | Restatements and a rhetorical line. The SageMaker-specific facts stay. |
| Delete | Spot Alert, bold "The Availability Zone is what makes Spot risky..." and "EFA requires all communicating nodes to reside in the same Availability Zone" | The h2 description already says it; the Alert now opens on the consequence and keeps the cited mechanism. Two Box paragraphs merged into one. |
| Re-express | Spot Alert, "AWS publishes no mapping ... so this page does not name the shared hardware" | Page-referential aside removed; scope weakened to "No AWS mapping from its topology layers to a named rack or spine was located during this research." |
| Reorder (candidate 1) | Karpenter Alert | Labels paragraph moved out of the warning to a plain paragraph after the list; its pointer sentence to the Topology API section deleted (the Topology-Aware Rank Assignment container already routes there). Alert header: "With Karpenter on HyperPod task governance, set TopologyAwareScheduling to false". |
| Re-express (candidate 2) | HyperPod body | Reason first, then the two steps, so the action lands last; the header names the action. Same facts and scope. |
| Re-express (candidate 3) | Capacity Block deadline | "Finish the checkpoint by 11:00 UTC on the final day of an instance block, and by 10:30 UTC on a P6e-GB200 UltraServer block (our arithmetic)." The EventBridge 10-minute warning and the 30/60-minute termination figures are kept (sourced numbers). |
| Reorder (candidate 4) | Capacity Blocks paragraph | Split into booking facts and "The end of a block". The 64-per-block figure and the UltraServer rule are now cited to capacityBlocks (capacity-blocks-how.html, where FC7 DG-08/DG-10 located them); the Organization-wide 256 stays on capacityBlocksUg. |
| Re-express (candidate 5) | ODCR paragraph | Scorer's text: create in the group, size for the expected fleet, growing later raises risk [crCpg]. |

Not applied: consolidating the h1 opener's two paragraphs (they are the kept canonical statement); the Topology-Aware Rank Assignment pointer paragraph (it is that container's next action).

### Claim-set self-check (assertions in the after that are not in the before)

- NeuronLink carries every collective on trn1.32xlarge (Stage 2, Question 1, table row 1): trn1Arch, orchestrator-verified tier 1 page.
- SMDDP 2.6.0 inside SMP v2.8.0, April 1, 2025: smpRelease (same DocRef and conflict text as SageMaker.tsx).
- "no deprecation announcement was located during this research": weakened from "AWS has not announced a deprecation".
- "p5.4xlarge, the smallest P5 size": ac (FC7 DG-20: P5 sizes listed are p5.4xlarge and p5.48xlarge only).
- "Finish the checkpoint by 11:00 UTC on the final day of an instance block": arithmetic from the 11:30 UTC end [capacityBlocksUg] and the 30-minute termination start [capacityBlocks], labelled "our arithmetic" (FC7 DG-12 records the page's own "begins at 11:00AM UTC").
- "size it for the fleet you expect": action connecting the two cr-cpg facts already present; no new fact.
- "so the zone rule is met for you": re-expression of the deleted "That satisfies the one boundary EFA traffic cannot cross".
- "No AWS mapping ... was located during this research": weakened scope.
- Karpenter h2 description and Alert header: trace to the four bullets, "whatever provisioned it" [eksTopologyLabels] and the hyperpodEks steps.
- Otherwise none.

### Diagram text changed

None (no diagrams in this section).

### Length

Prose words: 2079 -> 2001 (-78). The one-zone/placement-group pair is now stated in full twice (h1 opener, table footer), down from ten.

### Scores

| | Mental model | Practical leverage | Rigor | Accuracy | Economy | Gate 3 |
|---|---|---|---|---|---|---|
| Before (scorer) | 4 | 5 | 4 | 4 | 3 | 7 |
| After | 4 | 5 | 4 | 5 | 4 | 8 |

Accuracy 5: both flags resolved. Economy 4: the restatement chain is cut, two pointer/page-referential asides are gone; the opener's two paragraphs still overlap slightly. Rigor stays 4: uncited heuristics remain ("Most inference and fine-tuning workloads are single-node", "Short training runs (<2 hours)", "SRD handles asymmetric traffic patterns"); they are backlog, and the hedge corrections lift what the scorer docked.

Checks: typecheck, lint, no-ai-tells, svg-a11y, pinned-refs, pre-overflow all PASS.

## 2. Overview.tsx

### Corrections

| # | Status | Note |
|---|---|---|
| 1 | Applied via leverage candidate 1 | The positioning clause is deleted rather than attributed (the scorer offered candidate 1 as the alternative fix). The definition reads "is a network interface for EC2 (Elastic Compute Cloud) instances built on OS-bypass: ...", and the attributed result sentence ("AWS describes the result as ...") follows unchanged. |
| 2 | Applied | "with 256-bit encryption, which AWS rates as having no impact on network performance, and it is applied automatically between cluster members". |
| 3 | Applied | "an EFA (EFA with ENA, the Elastic Network Adapter) interface, which creates both an EFA device and an ENA device". |
| 4 | Applied | "RoCE (RDMA over Converged Ethernet, where RDMA is Remote Direct Memory Access). RDMA is a separate question". |

### Leverage edits

| Verb | Block | Reason |
|---|---|---|
| Delete (candidate 1) | Definition, positioning clause | Vendor positioning; the mechanism and the attributed result carry the meaning. |
| Reorder (candidate 2) | Tail-latency paragraph | Leads with the factor of ten, then the hedge ("the one comparative latency figure this research located from AWS"), scope unchanged. |
| Skipped (candidate 3) | "never while it runs" | The scorer rated it low priority and noted the explicit limit has practical value for a reader planning a live change; kept. |

### Claim-set self-check

None. Every sentence in the after is in the before, reordered or with a clause removed; correction 2 adds attribution only.

### Diagram text changed

None.

### Length

Prose words: 647 -> 629 (-18).

### Scores

| | Mental model | Practical leverage | Rigor | Accuracy | Economy | Gate 3 |
|---|---|---|---|---|---|---|
| Before (scorer) | 4 | 3 | 4 | 5 | 4 | 8 |
| After | 4 | 3 | 4 | 5 | 4 | 8 |

Rigor stays 4: both flattened vendor claims are resolved and both acronyms are in order, but "millions of small messages per second" and the StatusIndicator verdicts stay uncited (backlog). Held at 8: the close is still navigation rather than a reader action, and the stack diagram is backlog.

Checks: typecheck, lint, no-ai-tells, svg-a11y, pinned-refs, pre-overflow all PASS.

## 3. AIMLInference.tsx

### Corrections

| # | Status | Note |
|---|---|---|
| 1 | Applied | Opener: "So the figure to work out for your own deployment is how many bytes leave the instance per request, and how many times that happens per response." |
| 2 | Applied | Disaggregated-serving h2 description: "Which transfer library carries the KV-cache, and the two connector settings that put it on EFA." |

### Accuracy flag

- Speculative decoding in time-to-first-token: applied per the orchestrator decision. Both places (the speculative-decoding column and ladder question 4) now say "inter-token latency", cited to a new CodeRef `vllmSpecDecode` (vllm-project/vllm, ref v0.32.0, docs/features/speculative_decoding/README.md, L3). Re-read via `gh api repos/vllm-project/vllm/contents/...?ref=v0.32.0` on 2026-10-23; L3 reads "This document shows how to use Speculative Decoding with vLLM to reduce inter-token latency under medium-to-low QPS (queries per second), memory-bound workloads."

### Leverage edits

| Verb | Block | Reason |
|---|---|---|
| Delete (candidate 1) | NIXL column, "Purpose-built for disaggregated inference transfers." | The adjacent column states it with the reason attached. |
| Reorder (candidate 2) | vLLM conversion caveat | Moved from the NIXL column to the end of the vLLM paragraph, with the action "so compare both settings across the two fleets". It does not claim matching them removes all GPU work. |
| Reorder (candidate 3) | Libfabric 1.21.0 sentence | Moved out of the NIXL column to its own paragraph before the vLLM paragraph, with "so check the Libfabric version in the serving image". "and later" kept; "requires" not introduced. |
| Re-express (candidate 4) | vLLM backend sentence | Reason first, setting last: "LIBFABRIC is the backend that takes NIXL traffic over EFA [efaNixl], and the connector defaults to UCX [vllmBackends], so name it in kv_connector_extra_config with "backends": ["LIBFABRIC"]." |

### Claim-set self-check

- "inter-token latency" (two places): vllmSpecDecode, fetched and pinned in this pass.
- "so check the Libfabric version in the serving image": action attached to the existing efa.html fact; no new fact.
- "so compare both settings across the two fleets": action attached to the existing vllmKvConvert/vllmKvConvertWhen fact; no new fact.
- h2 description: traces to the NIXL/NCCL columns and the backends and kv_role settings in the same container.
- Otherwise none.

### Diagram text changed

None (no diagrams in this section).

### Length

Prose words: 1036 -> 1041 (+5). Two reader actions (version check, block-size comparison) cost about 13 words; the deletions recovered about 8. Not cut further: the remaining candidates for cuts are in unchanged blocks.

### Scores

| | Mental model | Practical leverage | Rigor | Accuracy | Economy | Gate 3 |
|---|---|---|---|---|---|---|
| Before (scorer) | 4 | 4 | 4 | 4 | 4 | 8 |
| After | 4 | 5 | 4 | 5 | 4 | 8 |

Practical 5: the disaggregated container now ends on three concrete checks in configuration order (Libfabric version, backend and roles, block size and layout). Rigor stays 4: the P5 640 GB total, the single-P5 parameter ceilings and "most fine-tuning and inference workloads stop here" stay uncited (unchanged blocks, backlog). Held at 8 by those uncited sizing figures.

Checks: typecheck, lint, no-ai-tells, svg-a11y, pinned-refs, pre-overflow all PASS.

## 4. HPC.tsx

### Corrections

| # | Status | Note |
|---|---|---|
| 1 | Applied | "AWS's launch announcement puts the gain over Hpc7a at up to 40% in performance, up to 25% in price performance and up to 42% in memory bandwidth [hpc8a]." |
| 2 | Applied | "MPAS (Model for Prediction Across Scales), IFS (Integrated Forecasting System)". Confirmed on mpas-dev.github.io/mainFrame.html and on ECMWF's "changes to the ECMWF model" page (both fetched 2026-10-23 with curl's default User-Agent). |
| 3 | Applied | "CONUS (Continental United States)". The multirail blog and NCAR's v4.2.2 benchmark page do not expand it; UCAR's WRF benchmark page (www2.mmm.ucar.edu/wrf/WG2/benchv3/) writes "Continental U.S. (CONUS) domain" for the same 2.5 km case. |
| 4 | Partly applied | LAMMPS expanded ("LAMMPS stands for Large-scale Atomic/Molecular Massively Parallel Simulator", lammps/lammps README via gh api). BWA (Burrows-Wheeler Aligner, bio-bwa.sourceforge.net) and GATK (Genome Analysis Toolkit, broadinstitute/gatk README via gh api) expanded. NAMD skipped: its home page (ks.uiuc.edu/Research/namd/) does not expand the name, so it stays a product name like GROMACS rather than carrying an expansion this research could not confirm. |
| 5 | Applied | "From EFA installer 1.30.0, the installer puts Open MPI 4.1 in /opt/amazon/openmpi and Open MPI 5 in /opt/amazon/openmpi5 by default." (FC8 H-3 and ST-6 record the efa-start.html scope.) |

### Leverage edits

| Verb | Block | Reason |
|---|---|---|
| Delete (candidate 1) | Hpc8a column, "Nitro v6 pairs with EFA v4." | Uncited and says nothing the reader can use; the section now closes on the attributed Hpc7a comparison. |
| Re-express (candidate 2) | MPI support statement | "Running MPICH or any other MPI means running outside that support statement." Same scope, framed as the reader's choice. |
| Skipped (candidate 3) | Intel MPI column order | Low priority per the scorer; the current order is setup order (load the right libfabric, fail fast, then multi-rail), which is also how a reader applies it. |

### Claim-set self-check

- Acronym expansions (MPAS, IFS, CONUS, LAMMPS, BWA, GATK): each from the project or developer page named above, fetched in this pass. They are names, not claims.
- "From EFA installer 1.30.0": narrows the existing efaStart claim to the scope FC8 recorded on that page.
- Otherwise none.

### Diagram text changed

None (no diagrams in this section).

### Length

Prose words: 942 -> 966 (+24). All growth is mandated correction text: six acronym expansions (about 20 words), the Hpc8a attribution and the installer version scope; the Nitro deletion recovers 6.

### Scores

| | Mental model | Practical leverage | Rigor | Accuracy | Economy | Gate 3 |
|---|---|---|---|---|---|---|
| Before (scorer) | 4 | 5 | 4 | 5 | 4 | 8 |
| After | 4 | 5 | 4 | 5 | 4 | 8 |

Rigor stays 4: the vendor figures are attributed, the Open MPI default carries its source's scope, and the uncited closing aside is gone, but the memory-pinning sentence, the "most constrained families" h2 description and the software-upgrade evidence in the message-size paragraph remain. Held at 8: no coupling diagram, and the message-size paragraph still leans on a software-upgrade comparison (backlog).

Checks: typecheck, lint, no-ai-tells, svg-a11y, pinned-refs, pre-overflow all PASS.

## 5. NetworkComparison.tsx

### Corrections

| # | Status | Note |
|---|---|---|
| 1 | Applied via leverage candidate 1 | Latency row, EFA cell: "Lower and more consistent, in AWS's description, and the EC2 User Guide gives no per-message figure [efa]. The one AWS figure located: 15.5 microseconds one-way MPI latency in a cluster placement group, from the 2019 launch post [efaGa2019]". Both hedges (the User Guide's silence; "located") kept. |
| 2 | Applied | Encryption cell: "Automatic between cluster members. AEAD, 256-bit, and no performance impact per AWS [hpcLens]". |

### Accuracy flag

- Footer against the EFA latency cell: applied the scorer's footer per the orchestrator decision: "Every comparative figure here comes from a first-party source. Only the EFA column carries a microsecond latency: no citable source giving one for the other three transports was located, and no NVIDIA page stating per-port InfiniBand rates was located." The file-header comment (not reader-visible) now says the held-out microsecond latencies are the TCP, RoCE/InfiniBand and NVLink ones, and that the EFA cell carries the 2019 figure.

### Leverage edits

| Verb | Block | Reason |
|---|---|---|
| Re-express (candidate 1) | Latency row, EFA cell | Shorter, carries correction 1. |
| Reorder (candidate 2) | Latency and Tail latency rows | Latency now precedes Tail latency, so the latency pair ends on the factor of ten the opener and the Overview make the deciding figure. Row order only; no cell text changed by the move. |

### Claim-set self-check

None. The footer sentence restates the existing hedge with its scope; the cells keep their claims and gain attribution only.

### Diagram text changed

None (no diagrams in this section).

### Length

Prose words: 771 -> 770 (-1).

### Scores

| | Mental model | Practical leverage | Rigor | Accuracy | Economy | Gate 3 |
|---|---|---|---|---|---|---|
| Before (scorer) | 5 | 3 | 4 | 4 | 4 | 8 |
| After | 5 | 3 | 4 | 5 | 4 | 8 |

Accuracy 5: the footer contradiction is gone. Rigor stays 4: the RoCE column's uncited judgements and the NVLink row's missing qualifiers (bidirectional; 6th generation preliminary) are backlog. Practical stays 3: the closing lists still name workload classes rather than checks.

Checks: typecheck, lint, no-ai-tells, svg-a11y, pinned-refs, pre-overflow all PASS.

## 6. EKSIntegration.tsx

### Corrections

| # | Status | Note |
|---|---|---|
| 1 | Applied | Placement-group paragraph in the networking-rules Alert: "AWS recommends a cluster placement group to satisfy the zone rule, without requiring one, because it launches the instances into a low-latency group in a single Availability Zone [efaStart]." |
| 2 | Applied | "leave networkInterfaces unset: Karpenter does not support the combination, and its behaviour is undefined [karpenterDraUnset]." |
| 3 | Applied | IPC_LOCK row: scorer's text, with "located during this research" and "on our reading". |
| 4 | Applied | NCCL_TOPO_FILE row: "No AWS documentation or AWS-authored EFA manifest located during this research sets this variable." |
| 5 | Applied | Pod-contract h2 description ends "and two whose AWS rationale this research did not locate." |
| 6 | Applied | "has no source behind it that this research located." |
| 7 | Applied | "No AWS source located during this research states a reason for those three. The plausible one is rendezvous and launcher addressing rather than the EFA data path; treat that as our reading." |
| 8 | Applied | Provisioning h2 description: "Pick the provisioning path by the limits you can accept: all four end in the same device nodes." |

### Leverage edits

| Verb | Block | Reason |
|---|---|---|
| Demote (candidate 1) | AMI paragraph, ENABLE_EFA gate and template default | Moved into the existing "Inspecting and rebuilding the AMI yourself" disclosure, as its own paragraph just above the `make ... enable_efa=true` block it explains. Main flow keeps the installer line, the component list and "Release v20261019 ships efa 3.3.0-1.amzn2023 on all five AL2023 variants". "at line 53 of the Packer provisioner" is dropped from the prose; the installEfa CodeRef carries the line. |
| Re-express (candidate 2) | Bottlerocket versions | "First, the driver versions differ. AL2023 ... lands EFA driver 3.3.0. Bottlerocket pins installer 1.49.0, whose driver is 3.1.0, and compiles that source, though its RPM Version field reads 3.0.0." |
| Demote (candidate 3) | MOFED Value-field walk across v0.18.2, v0.19.0, v0.19.2, v0.19.3, v0.20.1 | New ExpandableSection "Which releases default to true, in the code", placed after the helm block. Main flow keeps "The code bounds that to three releases, v0.19.0 to v0.19.2; v0.19.3 reverted the default", the doc-code-conflict SourceRef, and the CDI glob sentences ("Enabling it" became "Enabling the flag" because the antecedent moved). |
| Re-express (candidate 4) | "Eight PCIe roots" Alert | Folded into one sentence after the allocationMode paragraph: "A p5.48xlarge has eight such roots, one GPU [karpenterGpuMeta] and four EFA devices [karpenterEfaMeta] on each, which is the documented total of 32 [eksDevice]." Each citation sits on the part it can bear (code for the grouping, the EKS guide for the total). |
| Re-express (candidate 5) | eksctl paragraph | "eksctl is the shortest path, and its efaEnabled setting configures every interface as type efa, so it cannot create efa-only interfaces. For those, use a launch template, a NodeClass or an EC2NodeClass." "remains" (page-history voice) is gone. |
| Re-express (rigor, scorer's axis note) | efa-nv-peermem sentence | The argument from design ("which it would have no reason to do if --minimal had not installed it") is now labelled: "The build points to the latter: it removes efa-nv-peermem again on non-NVIDIA AMIs [installEfaPeermem], which on our reading means --minimal installed it." Scope weakened, per leverage-standard check 3. |

### Claim-set self-check

- None. Every edited sentence restates or weakens a claim already in the section. The PCIe-root sentence re-distributes three existing citations; the disclosure paragraph is moved text.

### Diagram text changed

None.

### Length

Prose words: 5106 -> 5033 (-73). Main-flow reading is shorter still: the two demoted blocks (about 120 words) now sit behind disclosures, and the new disclosure header adds about 15.

### Scores

| | Mental model | Practical leverage | Rigor | Accuracy | Economy | Gate 3 |
|---|---|---|---|---|---|---|
| Before (scorer) | 5 | 5 | 4 | 5 | 3 | 8 |
| After | 5 | 5 | 5 | 5 | 4 | 9 |

Rigor 5: all five unscoped absence claims are scoped, both attribution narrations are gone, and the one argument from design is labelled. Economy 4: the two evidence chains the scorer named are behind disclosures and the PCIe Alert is one sentence; the section is still about 1,600 lines.

Checks: typecheck, lint, no-ai-tells, svg-a11y, pinned-refs, pre-overflow all PASS.

## 7. SageMaker.tsx

### Corrections

| # | Status | Note |
|---|---|---|
| 1 | Applied | Step 1: "Expected output includes provider efa, domain efa_0-rdm, endpoint type FI_EP_RDM and protocol FI_PROTO_EFA [trainEfa]." |
| 2 | Applied | SMDDP body: "It supports ml.p3dn.24xlarge, ml.p4d.24xlarge and ml.p4de.24xlarge, support for optimizing collective communication on P3 has been discontinued, and the optimized AllGather collective is only available for P4 instances [ddpSupport]. In practice it runs only on P4d and P4de, with NVIDIA A100 GPUs and EFA [ddpFaq][smddpTypes]." smddpTypes keeps its code-confirmed provenance. |
| 3 | Applied | h2: "HyperPod inference: the one documented place EFA carries inference traffic". |
| 4 | Applied | Tie-breaker Alert: "the only SageMaker surface where that is documented". |
| 5 | Applied | Step 4: "That is the failure to look for when the instance type is off the allowlist." |
| 6 | Applied, different text | Gate 2 of the four-gates diagram. The scorer's two lines (62 and 64 characters) are longer than the lines they replace (59 and 59), which the orchestrator's diagram rule forbids. Lines 1 to 3 of gate 2 are re-flowed instead, each no longer than the original: line 1 `The image must carry libfabric, aws-ofi-nccl and an NCCL that` (61, was 65), line 2 `matches PyTorch. A Deep Learning Container (DLC) installs` (57, was 59), line 3 `EFA with --skip-kmod, so the host owns the kernel module.` (57, was 59). Same facts: the "matching NCCL" of line 1 and "Container NCCL must match the PyTorch build" of line 3 were one requirement stated twice. |
| 7 | Applied, different placement | "LLM" is expanded at the sentence that first names the subject: "The AWS best-practices blog for training large language models (LLMs) lists five settings". The later "multi-node LLM training" then reads after its expansion. |

### Accuracy flags

- Diagram caption "Gates 1 and 2 fail loudly": verified and fixed. NCCL v2.32.3-1 `src/plugin/net.cc` L328-L329 (read via gh api on 2026-10-23) registers the internal IB and Socket plugins after any external plugin, which is the fall-through the Operations section cites as `internalPlugins` (L320-L339) and EKSIntegration's contract table states ("A missing aws-ofi-nccl shows up as NCCL silently falling back to sockets"). A container with no libfabric cannot use aws-ofi-nccl, so that half of gate 2 fails quietly. Caption: `Gate 1 fails loudly. Gates 2 and 3 can fail quietly, so gate 4 is the only one worth trusting.` (94 characters, was 99). No SourceRef can sit inside the SVG; the evidence is cited in Operations.
- "Three AWS pages disagree": fixed. Git history (a8ca1fa) shows the original third item was "an older Slurm release note", cited to the same amiSlurm page, so the body names two pages. Header: "Two AWS pages disagree about the HyperPod base operating system"; headerDescription ends "worth taking from the release notes".
- "roughly 2023 pins" [SPECULATIVE in the scorer's report]: verified and fixed. NVIDIA/nccl tag v2.7.8-1 points at commit 033d799 dated 2020-07-27 (gh api); aws/aws-ofi-nccl release v1.1.1 was published 2020-11-02 (gh api releases/tags/v1.1.1); the aws-efa-installer-1.30.0.tar.gz object reports Last-Modified 2023-12-20 (curl -I, default User-Agent). Text: "still pins NCCL 2.7.8, EFA installer 1.30.0 and aws-ofi-nccl 1.1.1 [trainEfa], releases that date from 2020 to 2023 [ncclTag278][ofiRel111][installer130]". Three new DocRefs, all tier 1, accessed 2026-10-23. The installer date is the object's Last-Modified header, which a re-upload would move; the DocRef title says so.

### Leverage edits

| Verb | Block | Reason |
|---|---|---|
| Re-express (candidate 1) | `--disable-ngc` item | Version split first ("What follows depends on the installer version."), then the practice, so the action lands last: "Passing --disable-ngc, as the DLC script does for latest and for 1.48.0 and later, forces the standard install on every version." "in place of the standard libnccl-ofi" and "plugin included" kept from the original; the scorer's draft had dropped them. |
| Re-express (candidate 2) | Allowlist versions | Opens on the rule: "Pin SageMaker Python SDK v3.24.0 or later for P5 and P5e: earlier releases leave ...". "The lists above are as read at v3.27.0." follows. |
| Re-express (candidate 3) | Base image | Check led by its reason; the closing restatement "The installed-packages file is then the record to trust." deleted. |
| Demote (candidate 4) | SMDDP release-notes conflict | New ExpandableSection "Where April 2025 comes from" (headerDescription "Two release-notes pages disagree on the last SMDDP release") directly after the conclusion paragraph, with the doc-conflict SourceRef intact. Not moved into "Why AWS built it": that disclosure is about motivation, and a reader looking for the date's evidence would not open it. "The release cadence tells the rest." deleted. |
| Re-express (candidate 5) | Flexible instance groups | "That distribution stays within an Availability Zone, the EFA boundary." |

### Claim-set self-check

- "releases that date from 2020 to 2023": ncclTag278, ofiRel111, installer130, fetched in this pass.
- Caption "Gates 2 and 3 can fail quietly": NCCL v2.32.3-1 net.cc as above; the dive's own Operations and EKSIntegration text. "can" keeps the scope to the libfabric case.
- "Two AWS pages": the body as it stands (amiBase, amiSlurm).
- "In practice it runs only on P4d and P4de": re-expression of the FAQ sentence the scorer quoted, same citation.
- Otherwise none.

### Diagram text changed (screenshot FourGatesDiagram, efa SageMaker section)

- Gate 2, lines 1 to 3, as in correction 6 (each line shorter than the one it replaces).
- Caption at y=504, as in the first accuracy flag (shorter than before).
Geometry unchanged.

### Length

Prose words: 5689 -> 5674 (-15). Main-flow reading is about 85 words shorter (the release-notes paragraph is behind a disclosure); the new dated-pins citation clause adds 7.

### Scores

| | Mental model | Practical leverage | Rigor | Accuracy | Economy | Gate 3 |
|---|---|---|---|---|---|---|
| Before (scorer) | 5 | 5 | 4 | 4 | 3 | 8 |
| After | 5 | 5 | 5 | 5 | 3 | 9 |

Accuracy 5: both flags and the speculative date are resolved against primary sources. Rigor 5: both attribution narrations, both universal "only" claims and the Step 4 overstatement are fixed, and the dated pins are sourced. Economy stays 3: the section is still about 1,700 lines with long version inventories in the main flow (EKS AMI line, Slurm AMI line), which this pass did not touch.

Checks: typecheck, lint, no-ai-tells, svg-a11y, pinned-refs, pre-overflow all PASS.

Sources for the orchestrator to register (Sources.tsx / sources.md are outside this agent's files): the three DocRefs above (NVIDIA/nccl tag v2.7.8-1; aws/aws-ofi-nccl release v1.1.1; aws-efa-installer 1.30.0 tarball), the AIMLInference CodeRef vllmSpecDecode, and DecisionGuide's trn1Arch and smpRelease.

## 8. StorageDataPaths.tsx

### Corrections

| # | Status | Note |
|---|---|---|
| 1 | Applied (section h1) | "Storage Data Paths: FSx for Lustre, S3 and the Common Runtime (CRT)". The companion nav label in App.tsx:52 ("Storage Data Paths: FSx, S3 and the CRT") is outside this agent's files and is unchanged; the orchestrator may want "Storage Data Paths: FSx, S3 and the Common Runtime". |
| 2 | Applied | "1,200 Gbps over EFA with GPUDirect Storage (GDS)". |
| 3 | Applied | Four-paths intro gains "In the two FSx for Lustre rows, LNet is the Lustre network layer."; the later gloss is shortened to "LNet then runs over the EFA device." |
| 4 | Applied | "It transfers data directly between the file system and GPU memory, bypassing the CPU, and the supported clients are a closed list: P5, P5e, P5en, P6-B200 or P6-B300 [fsxEfa]." |
| 5 | Applied | "If you are creating a file system with over 10 GBps of throughput capacity, AWS recommends enabling EFA to optimize throughput per client instance [fsxPerf]. Below that, the ENA path is the documented answer." |
| 6 | Applied | "That lookup is a per-instance-type constant. It reads no interfaces," |
| 7 | Applied | h2 description: "The create-time choices and security group rules that decide whether a client gets 700 Gbps from the file system or stays near the 100 Gbps ENA figure." |
| 8 | Applied | h2 description: "Raising the target opens more connections and shrinks every range request, until the 8 MiB floor binds past roughly 400 Gbps." |
| 9 | Applied | h2 description: "FSx for Lustre claims here come from documentation and S3 client claims from code at pinned commits you can open, and the badge on each claim says which." |
| 10 | Applied | "No warning for this was located in the client source at the pinned commits, and the memory commitment is real:" |

### Accuracy flags

- Security-group fallback stated as behaviour: applied the scorer's text, labelled as our reading: "Our reading of this rule, across the security group and performance pages, is that a file system created with EfaEnabled true can still mount and run at ENA speed when the rules are CIDR-based, so a rule that looks maximally permissive is the one to suspect." The throughput-signal sentence follows as before. "silently keeps you off the fabric" and "with nothing in the console indicating anything is wrong" are gone (the uncited parts).
- "whitepaper" against a User Guide citation: NOT applied as the scorer proposed, because the proposal would misattribute. Fetched on 2026-10-23 (curl, default User-Agent): the S3 User Guide page `optimizing-performance-design-patterns.html` (the s3Paper DocRef) has a "Horizontal scaling and request parallelization for high throughput" section that gives the advice with no figures: no "85", no "8 to 16 MB", no "15 concurrent requests". `optimizing-performance-guidelines.html` has none either. The original whitepaper is still served as a PDF at https://d1.awsstatic.com/whitepapers/AmazonS3BestPractices.pdf ("Best Practices Design Patterns: Optimizing Amazon S3 Performance", initial publication June 1, 2019, "Reviewed for technical accuracy" March 10, 2021), and its text reads: "we suggest making concurrent requests for byte ranges of an object at the granularity of 8-16 MB. Make one concurrent request for each 85-90 MB/s of desired network throughput. To saturate a 10 Gb/s network interface card (NIC), you might use about 15 concurrent requests over separate connections." (the PDF uses en-dashes in the ranges; hyphens here). Fix: the prose keeps "whitepaper", which is correct; the figures now cite a new DocRef `s3Whitepaper` (that PDF, tier 1, accessed 2026-10-23), and one sentence records the current page's silence: "The S3 User Guide section on request parallelization gives the same advice without these figures [s3Paper]." The disclosure header and the comparison paragraphs are unchanged.

### Leverage edits (refresh-touched lines only)

| Verb | Block | Reason |
|---|---|---|
| Reorder (candidate 1) | Comparison table, Latency row, EFA cell | Ordering fact first, so `-e rdm` follows the sentence that explains why the RDM endpoint matters, and the action lands last. Both hedges unchanged. |
| Re-express (candidate 2) | GDS client-list paragraph | "The instance matrix elsewhere in this dive lists many more EFA-capable types than these five, so check whether the clients you already plan to buy are among the five." |
| Not done | "At the pinned commit," (binding-layer Alert) | Kept, per the scorer's rejection (deleting it would widen the claim). |

### Claim-set self-check

- "The S3 User Guide section on request parallelization gives the same advice without these figures": the s3Paper page, fetched in this pass; scoped to that section.
- The whitepaper figures now cite s3Whitepaper, fetched in this pass (verbatim match).
- "In the two FSx for Lustre rows, LNet is the Lustre network layer": moved gloss, already in the section.
- h2 descriptions: trace to L777 and L908-911 (700/100 Gbps), L1114-1117 (8 MiB floor, roughly 400 Gbps), and the boundary container's evidence sentence.
- "Our reading ...": the scorer's text, labelled as inference, built from the cited security group page and the section's own throughput figures.
- Otherwise none.

### Diagram text changed

None. The diagrams carry "CRT", "GDS" and "LNet"; their expansions now come before the diagrams in reading order through corrections 1 to 3, with no diagram edits.

### Length

Prose words: 4473 -> 4501 (+28). The prose bodies are +6; the three replacement h2 descriptions the scorer wrote state payoffs and are 22 words longer than the topic labels they replace. The whitepaper silence sentence adds 13; the attribution and threshold deletions recover about 25.

### Scores

| | Mental model | Practical leverage | Rigor | Accuracy | Economy | Gate 3 |
|---|---|---|---|---|---|---|
| Before (scorer) | 5 | 5 | 4 | 4 | 3 | 8 |
| After | 5 | 5 | 5 | 5 | 3 | 9 |

Accuracy 5: the whitepaper figures cite a page that carries them, and the security-group behaviour is labelled as inference. Rigor 5: all three acronym-order defects, both attribution narrations and the unscoped absence claim are fixed. Economy stays 3: leverage was limited to refresh-touched lines, and the boundary container and binding-layer scope paragraph remain (backlog).

Checks: typecheck, lint, no-ai-tells, svg-a11y, pinned-refs, pre-overflow all PASS.

Add to the sources for the orchestrator to register: s3Whitepaper (https://d1.awsstatic.com/whitepapers/AmazonS3BestPractices.pdf).

## Summary

| Section | Corrections | Accuracy flags | Words before -> after | Gate 3 before -> after |
|---|---|---|---|---|
| DecisionGuide.tsx | 6 of 6 | 2 of 2 (SMDDP; NeuronLink, extended to Question 1) | 2079 -> 2001 (-78) | 7 -> 8 |
| Overview.tsx | 4 of 4 (1 via deletion) | none raised | 647 -> 629 (-18) | 8 -> 8 |
| AIMLInference.tsx | 2 of 2 | 1 of 1 (inter-token latency, vLLM v0.32.0 L3) | 1036 -> 1041 (+5) | 8 -> 8 |
| HPC.tsx | 5 (4 in full; NAMD left unexpanded) | none raised | 942 -> 966 (+24) | 8 -> 8 |
| NetworkComparison.tsx | 2 of 2 | 1 of 1 (footer) | 771 -> 770 (-1) | 8 -> 8 |
| EKSIntegration.tsx | 8 of 8 | none raised | 5106 -> 5033 (-73) | 8 -> 9 |
| SageMaker.tsx | 7 of 7 (diagram text re-flowed to fit) | 2 of 2, plus "roughly 2023" | 5689 -> 5674 (-15) | 8 -> 9 |
| StorageDataPaths.tsx | 10 of 10 | 2 of 2 (whitepaper: re-cited, not renamed) | 4473 -> 4501 (+28) | 8 -> 9 |

Batch after: no section below 8; average 8.5 (68 / 8).

Diagram text changed (screenshot): SageMaker FourGatesDiagram, gate 2 lines 1 to 3 and the caption. Every new line is no longer than the line it replaces. No other diagram text changed.

Sources added in section registries, for the orchestrator to register in Sources.tsx / sources.md:
- DecisionGuide: trn1Arch (AWS Neuron v2.33.0 Trn1 architecture page), smpRelease (copied from SageMaker.tsx).
- AIMLInference: vllmSpecDecode (vllm-project/vllm v0.32.0 docs/features/speculative_decoding/README.md L3).
- SageMaker: ncclTag278 (github.com/NVIDIA/nccl/tree/v2.7.8-1), ofiRel111 (github.com/aws/aws-ofi-nccl/releases/tag/v1.1.1), installer130 (efa-installer.amazonaws.com/aws-efa-installer-1.30.0.tar.gz).
- StorageDataPaths: s3Whitepaper (d1.awsstatic.com/whitepapers/AmazonS3BestPractices.pdf).

Outside this agent's files, left for the orchestrator: App.tsx:52 nav label still reads "Storage Data Paths: FSx, S3 and the CRT".

Network requests: gh api (GitHub: vllm-project/vllm, NVIDIA/nccl, aws/aws-ofi-nccl, lammps/lammps, broadinstitute/gatk, wrf-model/WRF; gh's own authentication, as the brief allowed) and curl with its default User-Agent (mpas-dev.github.io, ecmwf.int, lammps.org, ks.uiuc.edu, bio-bwa.sourceforge.net, gatk.broadinstitute.org, aws.amazon.com HPC blog, www2.mmm.ucar.edu, efa-installer.amazonaws.com HEAD, docs.aws.amazon.com S3 pages and whitepaper redirects, d1.awsstatic.com whitepaper PDF). No email, name or account details were placed in any header, URL, query or body.

STATUS: COMPLETE
