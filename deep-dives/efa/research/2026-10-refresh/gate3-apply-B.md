# Gate 3 apply, batch B (October 2026 refresh)

STATUS: see last line

Input: `deep-dives/efa/research/2026-10-refresh/gate3-B.md`.
Sections: AIMLTraining (first, scored 6), InstanceSupport, Pricing, NcclOverEfa, Operations, TopologyApi.
Refresh diff base for the leverage pass: `b39b4d3`.
Network requests: no personal data sent in any request (logged per fetch below).

## 1. AIMLTraining.tsx (EFA for AI/ML Training)

### Accuracy flags

- A (tensor parallelism traffic): APPLIED. Orchestrator verified against the Megatron-LM paper (Shoeybi et al., arXiv:1909.08053, section 3: "requiring only a few extra all-reduce operations added to the forward and backward pass", read 2026-10-23 at ar5iv). TP column now reads "adds allreduce operations to every forward and backward pass", cited with a new DocRef `docs.megatron` (tier 3, accessed 2026-10-23, SourceRef label "tier 3: paper"; the `SourceTier` type accepts 3). The opening traffic-shape sentence of the Parallelism container carried the same error ("many small all-to-all exchanges"), so it is re-expressed to list the four shapes the columns describe: one large allreduce per step (DP), allreduces added to every forward and backward pass (TP, Megatron), all-to-all exchanges sized by routing (MoE column and its status line), point-to-point activation handoffs (PP). No fetch by this agent. ORCHESTRATOR: the Megatron paper is a new source and needs registering in Sources.tsx / sources.md (not owned here).
- B (opening "communication-bound"): APPLIED as the scorer wrote it.
- C (Inferentia2 EFA path): APPLIED. "the EFA path on Trainium instances"; "AWS Trainium and Inferentia2 chips run on the Neuron SDK" kept. The h2 title "Neuron + EFA (Trainium/Inferentia)" carried the same claim and is now "Neuron + EFA (Trainium)" (no anchor, nav or test references the title; checked with grep).

### Corrections

1. EFA expansion (L147): APPLIED, merged into accuracy B.
2. SRD expansion (L212): APPLIED via leverage candidate 1.
3. GDAKI expansion (L216): APPLIED (kept the GDAKI name in the re-expressed MoE paragraph, so the expansion is still needed).
4. NCCL expansion: APPLIED at the CUDA and NCCL path sentence (first prose use), and the L313 sentence is now "NCCL is the standard for GPU-to-GPU communication."
5. RDMA expansion (fi_send bullet): APPLIED.
6. ROCR expansion: APPLIED.
7. Neuron h2 description: APPLIED as written.
8. Scaling-efficiency hedge: APPLIED as written.

Extra hedge-scope fixes in the same pattern (weakenings only):
- Neuron disclosure: "AWS publishes no figure for the resulting speedup, and it is workload-dependent" became "No AWS figure for the resulting speedup was located during this research, and the speedup is workload-dependent."
- GDRCopy Alert: "AWS gives no minimum GDRCopy version" became "The guide gives no minimum GDRCopy version" (the guide is the cited `efaNccl` page in the preceding sentence).

### Leverage edits

- LC1 re-express (MoE column, L212-220): applied, with one deviation. The scorer's text cited "EFA also supports GPUDirect Async" to `ginGdaki` only; a plugin file cannot bear a claim about what EFA supports, so `gdaOps` (libfabric `fi_ext_efa.h`) stays on that clause and `ginGdaki` on the plugin clause. Dropped: FI_EFA_GDA_OPS, efa-direct, the build condition, and the `gdaOpsDirect` and `ginBuild` citations (all present in the NCCL over EFA section's four GDAKI conditions). Pointer re-expressed to "has the conditions a job has to meet to use it".
- LC2 re-express (env-var paragraph): applied as proposed (two provenance-narration sentences removed; citation kept).
- LC3 delete (cuPointerGetAttributes sentence and its two citations): applied.
- LC4 delete (src/nccl_ofi_rdma.c file-history sentence): applied.
- LC5 re-express (Neuron disclosure header): applied as proposed.
- Delete (Under the Hood, Algorithm selection): the cmpScore guide correction ("Two details follow. cmpScore sorts ... name the wrong function.") removed with its `ncclCmpScore` citation. The scorer's economy note names it as NCCL over EFA material; the NCCL_ALGO entry-point detail stays.
- Re-express (topology Alert, cross-section dedup): reduced to what serves this section (what the XML is, that the plugin supplies one itself when NCCL_TOPO_FILE is unset, packaged on p4d/p4de/g5.48xlarge, written at run time on P5/P5en/P6-B300) plus a pointer to the NCCL over EFA section by name. Dropped the `topoP4d`, `topoG5` and `sortRails` citations and the rail-reordering clause (full treatment kept in NCCL over EFA). Header "Getting NCCL_TOPO_FILE right: leave it unset" unchanged.
- Unused code refs removed from the `code` table (`ncclCmpScore`, `sortRails`, `topoP4d`, `topoG5`, `cudaPointer`, `cudaPointerCall`, `ginBuild`, `gdaOpsDirect`) and the now-unused `nccl` helper and `NCCL_TAG` (lint failed on the unused helper; fixed).

### Claim-set self-check (assertions in the after that are not in the before)

- "Tensor parallelism ... adds allreduce operations to every forward and backward pass": Megatron-LM paper, arXiv:1909.08053 section 3 (orchestrator-verified quote, cited inline).
- "allreduces added to every forward and backward pass" in the traffic-shape list: same source, carried by the TP column citation.
- "all-to-all exchanges sized by routing": restates the MoE column ("based on routing decisions") and its status line ("routing decisions set the all-to-all volume").
- "The NCCL over EFA section has the conditions a job has to meet to use it": the NCCL over EFA GDAKI container ("Four conditions decide whether a job ... gets it").
- "The NCCL over EFA section explains both paths and the rail ordering": NCCL over EFA "Topology XML files versus sort_rails" container.
- Otherwise none. All other changes are deletions, scope weakenings or re-orderings of existing sentences.

### Diagram text changed

None (this section has no SVG).

### Word count (approximate prose, rough counter)

Before 1,792; after 1,709 (net about -83).

### AFTER scores

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 4 | 4 | 4 | 4 | 4 |

- Rigor 4: the TP traffic claim now carries a citation and three absence claims carry their search scope; the DP volume formula, the PP and latency characterisations, the Fabric Manager outcome and the disk-space figures remain uncited (backlog).
- Accuracy 4: flags A to C resolved; "Tensor parallelism is latency-sensitive (many small messages)" is uncited and was left as written (no source fetched to change it).
- Economy 4: duplicated NCCL over EFA material removed (topology detail, cmpScore, linkage and file-history lines).

AFTER Gate 3 score: 7 / 10.

## 2. InstanceSupport.tsx (Instance Support Matrix) and data/instances.ts

### Corrections

1. Placement-group Alert (negation plus "AWS is explicit"): APPLIED as written. "AWS recommends one because ..." kept.
2. Spot hedge scope: APPLIED as written.
3. `instances.ts` c8i.48xlarge row note: APPLIED ("75 Gbps on one card. The C8i ladder runs ...").

### Accuracy flags

- A ("tracks the Nitro version in a straight line"): APPLIED as written (400 / 3,200 / 3,200 / 6,400 Gbps, the diagram's own figures).
- B ("decides ... the RDMA capability ... of every row"): APPLIED with one deviation. The scorer's text said "apart from five named RDMA exceptions", but the generation cards name exceptions on two rungs (Nitro v3: RDMA read on p4d and p4de only; Nitro v5: five read-only types), so a count of five would under-state them. Written as "apart from the RDMA exceptions the generation cards name" (weaker, and traces to the cards).

### Leverage edits

- LC1 re-express (heading list, L345-348): applied as proposed. The verbatim heading names remain in the diagram.
- LC2 reorder (P6e-GB200 first paragraph): verdict sentence moved to open the paragraph, "So" dropped; citations unchanged.
- LC3 re-express (P6e-GB200 second paragraph): applied as proposed; 1,600 Gbps traces to the bandwidth warning directly below.
- LC4 reorder (Trn3): the EFA-table/bandwidth paragraph now leads, the announcement paragraph with the chip figures follows. No sourced number removed.
- LC5 re-express (Trn3 "That is why there is no Trn3 row above."): merged as proposed ("so the matrix carries no Trn3 row").
- Not changed: the "These reconcile" sentence in the P6e-GB200 bandwidth Alert (scorer rigor note) is outside the refresh diff, and the `ac` citation for it is a backlog item.

### Claim-set self-check

None new. Every sentence in the after is a re-order, merge or re-wording of a claim already in the section; the per-Nitro peaks come from the section's diagram rows, "1,600 Gbps EFA ceiling" from the bandwidth Alert.

### Diagram text changed

None.

### Word count

Section prose before 1,228; after 1,235 (+7, from the accuracy A peak list). Data file row note -5 words. Net about +2.

### AFTER scores

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 4 | 5 | 4 | 5 | 4 |

AFTER Gate 3 score: 8 / 10 (accuracy defects in the opening resolved; Trn3 chip figures and the uncited "These reconcile" reading still hold economy and rigor at 4).

## 3. Pricing.tsx (Pricing Analysis)

`data/pricing.ts`: no correction or flag targets it; unchanged.

### Corrections

1. Cost-per-Gbps h2 description: APPLIED as written. To keep the scope next to the table once the filter paragraph moved (LC4), the container's first paragraph is re-expressed: "The rates are us-east-1, Linux, Shared tenancy, On-Demand. What a Gbps of EFA bandwidth costs on each family is the number that decides ..." (scope from the old description; the rest from the old paragraph).
2. Spot Alert hedge: APPLIED as written.
3. "Eligibility is not availability.": DELETED.
4. Cost-per-Gbps Alert header and body negations: APPLIED as written. "AWS does not publish a cost-per-Gbps metric" kept (load-bearing silence claim).
5. "The EFA limitations section is unambiguous: ...": APPLIED ("EFA traffic cannot cross Availability Zones or VPCs (Virtual Private Clouds) [EFA_DOC]"). The following uncited sentence about Outposts and P4d/P4de/DL1 began "The same section adds"; with the antecedent gone it now reads "The EFA limitations section adds" (attribution kept: it is the only provenance marker on that sentence, leverage standard case 4).
6. "cross-AZ redundancy": APPLIED as written.

### Accuracy flags

- A ("That last filter carries weight"): APPLIED ("The MarketOption filter carries weight").
- B ("the way every other rate here is"): APPLIED ("the way every On-Demand rate here is").
- C (h3 "Families sold as whole units"): APPLIED ("Families with no Spot support").
- D [SPECULATIVE] ("bid on"): APPLIED as the neutral re-express the brief allows without a fetch: h2 description "Which families support Spot, and where a real rate comes from"; h3 "Families with Spot support". No claim about Spot's pricing model is made in either.

### Leverage edits

- LC1 reorder: block-hour arithmetic paragraph (with `derived` badge and the "Tier 2 block rate over Tier 1 us-east-1 On-Demand rate" label) moved out of the footer ExpandableSection into the main Capacity Blocks container, under the final-day clock. Rate table stays demoted.
- LC2 re-express: "Schedule the checkpoint and drain to finish before 11:00 UTC on an instance-type block and before 10:30 UTC on an UltraServer block." (both times from the clock column).
- LC3 delete: first sentence of the Tier 2 Alert (the disclosure header carries the tier). Scheduled-update quote kept.
- LC4 reorder: the price-list filter paragraph moved out of the h1 container to sit directly after "The practical rule" Alert, so the page opens on "EFA is free" and the re-pull recipe sits with the rule that asks for it. Visible, not demoted.
- LC5 delete: "Every On-Demand rate on this page is pinned to version 20261022231453." The moved filter paragraph directly below states the version once.

Version string in prose: four occurrences before (h1 paragraph, h2 description, practical rule, table); one in prose plus the table after.

### Claim-set self-check

None new. "The rates are us-east-1, Linux, Shared tenancy, On-Demand" is the old h2 description's scope; the UTC times are from the clock column; everything else is moved or deleted text.

### Diagram text changed

None.

### Word count

Before 1,198; after 1,176 (about -22).

### AFTER scores

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 4 | 5 | 4 | 5 | 4 |

AFTER Gate 3 score: 8 / 10 (all corrections and flags resolved; the per-row `EFA_DOC` citation in the "What EFA itself costs" table and the Outposts sentence that does not bear on price remain, backlog and out of refresh scope respectively).

## 4. NcclOverEfa.tsx (NCCL over EFA: the aws-ofi-nccl Plugin)

### Corrections

1. Diagram 1 layer title (SRD never expanded): APPLIED as written, `title: 'EFA device'`, `sub: 'Nitro hardware, Scalable Reliable Datagram'`. SRD no longer appears anywhere in this section, so no other expansion is needed.
2. RDMA expansion (eager-size sentence): APPLIED via LC3.
3. Provider/platform h2 description: APPLIED as written.
4. DMI expansion: APPLIED.
5. GIN expansion moved to its first use (release-notes paragraph, "kernel-initiated GIN (GPU-Initiated Networking) path"); the GDAKI container lead uses the bare acronym: APPLIED.
6. RMA expansion: APPLIED, inside the new "Which GIN symbols the plugin exports" disclosure (LC1 moved the RMA sentence there).

### Accuracy flags

- A (h2 "Four version numbers"): APPLIED as written.
- B [SPECULATIVE] (NCCL_TUNER_PLUGIN by hand "scoped to NCCL 2.19 and 2.20"): VERIFIED and FIXED. Fetched with `gh api` (default headers, no personal data):
  - NVIDIA/nccl `src/include/nccl_tuner.h` L53 at v2.19.3-1 and at v2.20.5-1: `#define NCCL_TUNER_PLUGIN_SYMBOL "ncclTunerPlugin_v1"`.
  - aws/aws-ofi-nccl `src/tuner/nccl_ofi_tuner.cpp` at v1.22.0 exports only `ncclTunerPlugin_v3` (L185), `ncclTunerPlugin_v6` (L242) and `ncclTunerPlugin_v2` (L274); no v1 symbol.
  - aws/aws-ofi-nccl `RELEASENOTES.md` at v1.22.0, L91 under "# v1.20.0 (2026-06)": "Removed tuner v1 plugin support".
  Sentence now reads: "Pointing it at a path by hand is scoped to NCCL 2.19 and 2.20, which look up the v1 tuner symbol [ncclSymbol219][ncclSymbol220], and to plugin releases before v1.20.0, the release that removed v1 [releaseNotesV120]." Two new CodeRefs `ncclSymbol219` (v2.19.3-1) and `ncclSymbol220` (v2.20.5-1), `src/include/nccl_tuner.h` L53, read 2026-10-23; new constants `NCCL_219`, `NCCL_220`.

### Leverage edits

- LC1 demote (GDAKI opener): lead cut to two sentences (two modes, the v1.21.0 GDAKI export; NCCL 2.32.3 runs host-proxy itself, so the plugin's GIN export matters only for GDAKI). Interface versions 11/13/14, the Libfabric and Libfabric_GDAKI names, the EFA_GDA value 5 and the RMA backend moved into a new ExpandableSection "Which GIN symbols the plugin exports", placed after the lead and before "Four conditions decide whether a job ... gets GDAKI", so that sentence still introduces the list directly. All ten citations kept. Condition 4 still carries NCCL_GIN_TYPE=5.
- LC2 reorder: "your NCCL_ALGO filter narrows the table, the tuner votes inside what is left, and NCCL takes the minimum" lifted into the visible NCCL 2.22 Alert, replacing "your NCCL_ALGO filter and the tuner both apply, in that order"; the same sentence deleted from the end of the "Where NCCL applies your NCCL_ALGO filter" disclosure.
- LC3 re-express: OFI_NCCL_EAGER_MAX_SIZE sentence as proposed.
- LC4 delete: "What cmpScore actually sorts" disclosure removed (research file keeps it); the now-unused `ncclCmpScore` and `ncclSearchSort` CodeRefs removed. The same guide correction was also removed from AI/ML Training.
- LC5 (NCCL_IB_HCA hook): SKIPPED. The "Anything you set wins over the plugin's defaults" Alert directly below the platform-table disclosure already states that rule, with the skip log line and `envSkipLog`, for every injected default; repeating it for one variable grows a section whose prose already grew in the refresh.
- Cross-section topology dedup: this section keeps the one full treatment ("Topology XML files versus sort_rails"); unchanged.
- Not done: "actually" filler in h2 titles and older disclosures (scorer economy note, not a candidate, outside the refresh diff).

### Claim-set self-check

- "NCCL 2.19 and 2.20 ... look up the v1 tuner symbol": NVIDIA/nccl v2.19.3-1 and v2.20.5-1 `src/include/nccl_tuner.h` L53 (fetched this pass, cited).
- "plugin releases before v1.20.0, the release that removed v1": aws-ofi-nccl RELEASENOTES.md at v1.22.0 L91 (already cited in the section as `releaseNotesV120`; line re-read this pass).
- Otherwise none: LC1 to LC4 move, delete or reword existing sentences.

### Diagram text changed (screenshot needed)

- Diagram 1 (PluginStackDiagram), bottom layer box: title "EFA device and SRD" became "EFA device"; subtitle "Nitro hardware" became "Nitro hardware, Scalable Reliable Datagram" (42 characters at 11px in a box whose text area is about 280px wide; geometry unchanged).

### Word count

Before 3,710; after 3,620 (about -90). Against the refresh base the section's prose growth of about 110 words is mostly reversed.

### AFTER scores

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 5 | 5 | 5 | 5 | 4 |

AFTER Gate 3 score: 8 / 10 (acronym and accuracy defects closed, tuner composition model now visible, GDAKI container leads with the conditions; the segfault-archaeology disclosure, the duplicated NCCL_TUNER_PLUGIN explanation and the "Where AWS documentation ends" restatement still cost economy).

## 5. Operations.tsx (Operations, Observability and Failure Modes)

### Corrections

1. Opening "verification is not a troubleshooting step" negation; AMI expansion: APPLIED as written.
2. vendor_part_id Alert (hedge widened, citation asked to bear an absence): APPLIED as written; `pciIds` now bears only the five identifiers, `docs.efa` the four versions, and the absence carries "was located in AWS documentation or the driver source during this research".
3. fi_pingpong expected-result hedge: APPLIED.
4. Three UNKNOWN lines (cache hit rate, topology cost, alert threshold): APPLIED, each with "located during this research".
5. MPI narration sentence deleted; MPI expansion moved to the Intel MPI Alert header: APPLIED.
6. Topology "On current instance types ... does not read a static file": APPLIED, merged with the cross-section dedup (below).
7. SRD expansion moved to the counter table's Network row; the alert list uses bare SRD: APPLIED.
8. EKS expansion moved to the mofed row; the EKS Alert uses bare EKS: APPLIED.
9. VPC expansion moved to the Availability Zone row; Flow Log sentence uses bare VPC: APPLIED.
10. MOFED: diagram chip line 2 "mofed claims the uverbs nodes" became "claims every uverbs node"; mode cell expanded to "NVIDIA device plugin MOFED (Mellanox OpenFabrics Enterprise Distribution) default in containers". Flag names left verbatim: APPLIED.
11. "AWS is explicit that it is a recommendation" became "AWS recommends one rather than requiring it": APPLIED.

Extra, same defect class (weakening only): "AWS documents none of this" (sysfs p2p file) became "No AWS page documenting this file was located during this research".

### Accuracy flags

- A (h2 "Sorted by how quiet the failure is"): APPLIED as written.
- B [SPECULATIVE] (`fi_getinfo(): -61` "almost always the security group"): VERIFIED WRONG and FIXED. Fetched with `gh api` and `curl` (default User-Agent, no personal data):
  - ofiwg/libfabric v2.7.0 `util/pingpong.c`: `pp_init_fabric` (L1777-L1813) calls `pp_ctrl_init` first, which opens a TCP control connection to the peer on default port 47592 (L501-L515, connect at L400); only after that does `pp_getinfo` (L1480-L1494) call `fi_getinfo(..., NULL, NULL, flags, hints, info)`, with no node or service, so the call is local.
  - ofiwg/libfabric v2.7.0 `man/fi_getinfo.3.md` L66-L67: "If no matching fabric information is available, info will be set to NULL and the call will return -FI_ENODATA"; `include/rdma/fi_errno.h` defines FI_ENODATA as ENODATA ("No data available", 61 on Linux).
  - AWS EC2 User Guide `efa-start.html` and `efa-start-nccl.html` (fetched 2026-10-23): neither mentions fi_pingpong or -61. The only fi_getinfo failure text (`efa-start.html`, Intel MPI step) ties "OFI fi_getinfo() failed" to "if EFA is not available", not to the security group.
  Code comment now reads "# A failure at this step looks like this. It is local: no provider matched." A cited paragraph follows the code block: -61 is FI_ENODATA [getinfoEnodata], fi_pingpong makes the call with no node or service [pingpongGetinfo] after its TCP control connection on port 47592 is up [pingpongCtrlPort][pingpongOrder], so the error points at the EFA device or the -p and -e flags, "and a peer the security group blocks would fail earlier, at that control connection" ("would" marks that last clause as our reading of the call order). Four new CodeRefs at libfabric v2.7.0. The sample output line itself is unchanged; the real PP_PRINTERR format is "fi_getinfo(): <file>:<line>, ret=-61 (No data available)" (pingpong.c L119-L121), left as is because the file and line depend on the build. The backlog item (a logged two-node experiment) stays open.

### Leverage edits

- LC1 re-express (checksum Alert): "Step 2 matters because Intel MPI ships its own libfabric ..." as proposed.
- LC2 re-express ("Name the channel" Alert opening): as proposed; the repeated "Installer 1.51.0 ships driver 3.3.1 while the repository is at r3.4.0" removed (both columns directly above carry it).
- LC3 re-express (Signal 1 ATTN clause): as proposed.
- LC4 re-express (repository column): as proposed; consequence traces to the installer column (1.51.0 ships driver 3.3.1).
- LC5 re-express (fabric disclosure): "and installer 1.51.0 ships 2.7.0amzn2.0".
- Cross-section topology dedup: the "Two of these" disclosure's topology paragraph cut to what this section needs (plugin writes the topology on P5 and later unless NCCL_TOPO_FILE is set; platform layer defers and logs; copying a runbook line discards what the plugin knows; the UNKNOWN with its scope) plus "The NCCL over EFA section covers how the plugin builds that topology." Dropped the /proc/self/fd detail (kept in NCCL over EFA). The failure-table row stays as the practical entry.
- Not done: qkey_viol paragraph and the scorer's other economy notes (not candidates, outside the refresh diff).

### Claim-set self-check

- "-61 is FI_ENODATA, which fi_getinfo returns when no provider matches the requested hints": libfabric v2.7.0 `man/fi_getinfo.3.md` L62-L67 (cited).
- "fi_pingpong makes that call with no node or service": libfabric v2.7.0 `util/pingpong.c` L1480-L1494 (cited).
- "after its TCP control connection to the peer on port 47592 is up": `util/pingpong.c` L501-L515 and L1777-L1813 (cited).
- "the error points at the EFA device or the -p and -e flags": follows from the two cited facts (local call, hints from the command line).
- "a peer the security group blocks would fail earlier, at that control connection": our reading of the cited call order, marked with "would".
- "so a host built from installer 1.51.0 runs a driver whose release notes do not list it": installer column (1.51.0 ships 3.3.1) plus "Relaxed ordering is absent from the 3.3.1 notes".
- "The NCCL over EFA section covers how the plugin builds that topology": NCCL over EFA "Topology XML files versus sort_rails".
- Otherwise none.

### Diagram text changed (screenshot needed)

- Diagram 2 (FailureLayerMapDiagram), "Container and scheduler" band, first chip, line 2: "mofed claims the uverbs nodes" became "claims every uverbs node" (shorter; 200px chip at 10px font, geometry unchanged).

### Word count

Before 2,796; after 2,851 (about +55, including the addendum below). The accuracy B paragraph adds about 72 words; the leverage edits and corrections remove about 17. Growth is the cost of replacing a wrong uncited claim with a cited one.

### AFTER scores

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 5 | 5 | 5 | 5 | 4 |

AFTER Gate 3 score: 8 / 10 (every absence claim scoped, the fi_getinfo diagnosis corrected and cited, acronyms in reading order; economy held at 4 by the qkey_viol paragraph and the net word growth).

Addendum (Operations): the -61 paragraph also cites libfabric v2.7.0 `include/rdma/fi_errno.h` L107 (`#define FI_ENODATA ENODATA /* No data available */`) as `fiErrnoEnodata`, so the link from the printed "(No data available)" to FI_ENODATA is carried by a citation. Five new libfabric CodeRefs in total. Checks re-run after the addendum: all pass.

## 6. TopologyApi.tsx (The EC2 Instance Topology API)

### Corrections

1. "No AWS statement and no benchmark quantifies": APPLIED ("No AWS statement or benchmark located during this research quantifies ...").
2. Karpenter search conclusion scope: APPLIED via LC1 ("so in that release Karpenter neither calls the topology API nor emits these labels").
3. capacityBlockId "will cache a wrong answer": APPLIED ("can cache a wrong answer"), matching the cited "might return null".
4. PCS expansion: APPLIED ("AWS PCS (Parallel Computing Service)").
5. Slurm h2 description: APPLIED as written.

Extra, same defect class (weakening only): "AWS publishes no mapping from layer index to a named datacenter construct" became "No AWS mapping from layer index to a named datacenter construct, such as ..., was located during this research" (the "That is the whole published vocabulary" lead-in went with it); "AWS does not publish how often the two diverge" became "no AWS figure for how often the two diverge was located during this research".

### Accuracy flags

- A (reservation-limit disclosure header "on two pages"): APPLIED ("two ways on three pages").
- B (Kubernetes h2 "Karpenter needs the scheduler turned off"): APPLIED ("needs topology-aware scheduling turned off").
- C [SPECULATIVE] (Karpenter "placement group membership through the launch template"): VERIFIED and FIXED. Fetched with `gh api` (no personal data), aws/karpenter-provider-aws at v1.15.0:
  - `pkg/apis/v1/ec2nodeclass.go` L57-L61: `PlacementGroupSelector *PlacementGroupSelector json:"placementGroupSelector,omitempty"` on the EC2NodeClass spec (name or ID, mutually exclusive, L234-L242); the CRD `pkg/apis/crds/karpenter.k8s.aws_ec2nodeclasses.yaml` L518-L526 carries the same field and has no user-facing launchTemplate field.
  - `pkg/providers/launchtemplate/launchtemplate.go` L157-L175: the resolved placement group ID (and partition) is passed into the launch templates Karpenter generates; `pkg/providers/instance/instance.go` L567-L569 confirms the partition sits in the launch template's Placement config.
  Sentence now reads "placement group membership through the EC2NodeClass placementGroupSelector [karpenterPgSelector], which it writes into the launch templates it generates [karpenterPgLaunchTemplate]". Two new CodeRefs at v1.15.0, read 2026-10-23. The zonal clause (topology.kubernetes.io/zone) is unchanged and uncited.

### Leverage edits

- LC1 reorder (Karpenter search paragraph): result first ("Karpenter nodes carry the labels, written by the cloud controller manager ..."), then the zero-occurrence search as evidence, with the version scope restored.
- LC2 delete ("One open contradiction" in "Where the published evidence stops"): applied; the disclosure's headerDescription changed from "Three gaps" to "Two gaps" to match. The p6e-gb200 depth disclosure keeps the conflict and the action.
- LC3 re-express (p6e-gb200 "cannot all describe the same response"): as proposed.
- LC4 delete (second sentence of the kubectl code comment): applied; the cited prose sentence above keeps it.

### Claim-set self-check

- "placement group membership through the EC2NodeClass placementGroupSelector": karpenter-provider-aws v1.15.0 `pkg/apis/v1/ec2nodeclass.go` L57-L61 (fetched, cited).
- "which it writes into the launch templates it generates": karpenter-provider-aws v1.15.0 `pkg/providers/launchtemplate/launchtemplate.go` L157-L175 (fetched, cited).
- "the blog cannot describe the same response as the two pages that say three layers": restates the two paragraphs above it (EC2 prerequisites page and EKS labels page say three; the blog implies four).
- Otherwise none.

### Diagram text changed

None (the edited comment is in a `<pre>` code block, not an SVG).

### Word count

Before 3,510; after 3,518 (about +8: the Karpenter fix and its scope add more than the two deletions remove).

### AFTER scores

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 5 | 5 | 5 | 5 | 4 |

AFTER Gate 3 score: 8 / 10 (hedges and the Karpenter placement-group claim fixed and cited; the uncited "single most common way" superlative and the Slurm 25.11 detail remain, backlog and correctly demoted respectively).

---

## Summary

| Section | Before Gate 3 | After Gate 3 | Corrections applied / skipped | Flags | Prose words before to after |
|---|---|---|---|---|---|
| AIMLTraining | 6 | 7 | 8 / 0 | A, B, C applied (A orchestrator-verified, Megatron-LM cited) | 1,792 to 1,709 |
| InstanceSupport | 8 | 8 | 3 / 0 | A applied; B applied with a corrected count | 1,228 to 1,235 |
| Pricing | 8 | 8 | 6 / 0 | A, B, C applied; D neutral re-express, no fetch | 1,198 to 1,176 |
| NcclOverEfa | 7 | 8 | 6 / 0 | A applied; B verified at NCCL 2.19.3/2.20.5 and plugin v1.22.0, fixed and cited | 3,710 to 3,620 |
| Operations | 8 | 8 | 11 / 0 | A applied; B verified wrong at libfabric v2.7.0, fixed and cited | 2,796 to 2,851 |
| TopologyApi | 8 | 8 | 5 / 0 | A, B applied; C verified at karpenter v1.15.0, fixed and cited | 3,510 to 3,518 |

Batch after: no section below 7, average 7.8 (scorer's own scale; Gate 3's average-of-8 bar is still not met on these numbers).

Leverage candidates skipped: NcclOverEfa LC5 (reason in section 4). Scorer economy notes outside the candidate lists and the refresh diff were not acted on.

For the orchestrator:
- Diagram text to screenshot: NcclOverEfa diagram 1 bottom layer ("EFA device" / "Nitro hardware, Scalable Reliable Datagram"); Operations diagram 2 container band chip ("claims every uverbs node").
- New source to register in Sources.tsx / sources.md: Shoeybi et al., Megatron-LM (arXiv:1909.08053), tier 3, accessed 2026-10-23.
- New code citations (pinned): NVIDIA/nccl v2.19.3-1 and v2.20.5-1 `src/include/nccl_tuner.h` L53; libfabric v2.7.0 `util/pingpong.c` (L501-L515, L1480-L1494, L1777-L1813), `man/fi_getinfo.3.md` L62-L67, `include/rdma/fi_errno.h` L107; karpenter-provider-aws v1.15.0 `pkg/apis/v1/ec2nodeclass.go` L57-L61 and `pkg/providers/launchtemplate/launchtemplate.go` L157-L175.
- Network requests: `gh api` to api.github.com (NVIDIA/nccl, aws/aws-ofi-nccl, ofiwg/libfabric, aws/karpenter-provider-aws) and `curl` with its default User-Agent to docs.aws.amazon.com (efa-start, efa-start-nccl, and two URLs that returned a stub). No personal data was sent in any header, URL or body.
- Checks after every file (typecheck, lint, no-ai-tells, svg-a11y, pinned-refs, pre-overflow): all pass on the final tree. Build and tests not run, per the brief.

STATUS: COMPLETE
