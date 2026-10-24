# Gate 3 residual fixes, group B

Input: research/2026-10-refresh/gate3-rescore-B.md (6 regressions, 19 remaining corrections).
Scope: AIMLTraining, InstanceSupport, Pricing, NcclOverEfa, Operations, TopologyApi (plus data/instances.ts, data/pricing.ts).
Backlog items and the NcclOverEfa "Economy edits" list are out of scope (neither regressions nor remaining corrections).

## Items

Verification fetches (2026-10-23, curl default User-Agent, no personal data):
- https://raw.githubusercontent.com/ofiwg/libfabric/v2.7.0/prov/efa/src/efa_domain.c L803-L808: FI_EFA_GDA_OPS returns -FI_EOPNOTSUPP with "Only efa direct supports FI_EFA_GDA_OPS" unless info_type is EFA_INFO_DIRECT. Confirmed.
- https://raw.githubusercontent.com/aws/aws-ofi-nccl/v1.22.0/src/platform-aws.cpp L88-L105 (p4d.24xlarge and p4de.24xlarge rows with p4d-24xl-topo.xml, p4de-24xl-topo.xml) and L248-L250 (g5.48xlarge row with g5.48xl-topo.xml). Confirmed.
- https://raw.githubusercontent.com/aws/aws-ofi-nccl/v1.22.0/src/nccl_ofi_rdma.cpp L7199-L7210: write_topo_file only when this->topo->max_group_size > 1. Confirmed.
- https://raw.githubusercontent.com/NVIDIA/nccl/v2.32.3-1/src/plugin/net.cc L40-L42 (ncclNetVersion {12..6}) and L333-L337 (ncclNetPluginRegisterInternal for ncclNetIb and ncclNetSocket). Confirmed.
- https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html: network table rows g6.8xlarge, gr6.8xlarge and vt1.24xlarge at 25 Gigabit with EFA Yes; p6e-gb200.36xlarge at 3200 Gigabit, EFA Yes, 17 network cards. Confirmed.
- Megatron-LM GPU paper (arXiv:2104.04473): quote verified by the orchestrator (ar5iv, read 2026-10-23); not re-fetched.

### AIMLTraining.tsx
- Regression 1 (GPUDirect Async lost its efa-direct condition): applied as given. Restored `gdaOpsDirect` (libfabric v2.7.0 efa_domain.c L803-L808, re-fetched); sentence now "on the efa-direct fabric only" with both citations.
- Regression 2 (packaged topology list on topoEnv): applied as given. Added `topoRows` (platform-aws.cpp L88-L105) and `topoRowG5` (L248-L250) at v1.22.0, re-fetched; prose carries "at v1.22.0".
- Regression 3 (NCCL expansion in a closed disclosure, not at first use): applied as given. Expansion moved to the first reading-order use ("The section on NCCL (NVIDIA Collective Communications Library) over EFA ..."); Neuron disclosure back to "the CUDA and NCCL path".
- Remaining 1 (TP/PP characterisation inverted): applied as given. New paragraph, StatusIndicator "EFA carries the pipeline stages between nodes; keep TP on NVLink", intro "you know what the fabric has to carry". New DocRef `megatronGpu` (tier 3, accessed 2026-10-23).
- Remaining 2 (tuner version history duplicated from NCCL over EFA): applied as given. Cut to the consequence plus the NCCL 2.22.3 scope (tunerV3, tunerV6) and a pointer to the NCCL over EFA section by name; `tunerV2` dropped from `code`.
- Remaining 3 (Disk space Alert, uncited 10-20 GiB, 30 GiB, "fails silently"): applied as given (deleted). AMI was expanded only there and is not used elsewhere in the section.
- Remaining 4 (Fabric Manager "takes all 8 GPUs out" outcome uncited): applied as given. Sentence deleted, exact-match instruction kept. Backlog for the orchestrator: an NVIDIA Fabric Manager user guide citation.
- Remaining 5 (two launcher lines behind a closed disclosure): applied as given. Lead sentence and `<pre>` moved under the stack paragraph; disclosure renamed "The rest of the usual EFA environment block".
- Remaining 6 (regression fixes 1 to 3): covered above.

### InstanceSupport.tsx
- Remaining 1 (P6e-GB200 reconciliation unlabelled): applied as given. "Our arithmetic reconciles them from the sharing rules below: eight physical cards at 400 Gbps each give 3,200 Gbps, and four GPU-shared pairs at 400 Gbps each give the 1,600 Gbps EFA ceiling." Both factors trace to the sharing Alert ([1,2]..[15,16] at 400; [1,3] [5,7] [9,11] [13,15] at 400).
- Remaining 2 (25 Gbps floor on efaAcc): applied as given. `docs.ac` attached after the three small types, `docs.efaAcc` kept on p6-b300. ac.html rows for g6.8xlarge, gr6.8xlarge and vt1.24xlarge confirmed (25 Gigabit, EFA Yes).
- Remaining 3 (3,200 Gbps and 17 cards uncited): applied as given. `docs.ac` attached after "17 network cards"; ac.html row for p6e-gb200.36xlarge confirmed (3200 Gigabit, 17 network cards).

### Pricing.tsx (and data/pricing.ts)
- Regression 1 (SKU used before its expansion): applied as given. Expansion now in the "Instance premium" row note (first rendered use); the MarketOption paragraph uses "SKU" bare.
- Regression 2 (h2 description repeated by the first paragraph): applied as given. Paragraph is now "The rates are us-east-1, Linux, Shared tenancy, On-Demand." only.
- Remaining 1 (EFA_DOC attached to rows it cannot bear): applied by the report's citation path rather than the "No source" flag. Row 4 note is now "You pay for the instances." (skew claim deleted). The Source column is per-row (`doc` field on CostItem). The placement-group row is cited to a new Tier 1 DocRef `PLACEMENT_GROUPS_DOC` (EC2 User Guide placement-groups.html, fetched 2026-10-23, which reads "Pricing There is no charge for creating a placement group."), and its note is re-expressed to what that page bears: "Creating a placement group carries no charge." (the uncited "scheduling constraint" characterisation is gone).
- Remaining 2 ("Skipping it is legal and usually a mistake."): applied as given, delete option. The verbatim quote already carries "not an absolute requirement" and "we do recommend".
- Remaining 3 (promoted percentages lost their expiry date): applied as given. "... at the block rates scheduled to change in January 2027: a block hour costs ..." (traces to the footer quote).

### NcclOverEfa.tsx
- Remaining 1 (drift-list "falls back to its own transport" uncited): applied as given. `ncclNetInternal: nccl('src/plugin/net.cc', 'L333-L337')` added beside `ncclNetVersions` (NCCL v2.32.3-1, re-fetched), and both attached after "falls back to its own transport".
- "Economy edits the pass could still make": not applied. The report files them outside regressions and remaining corrections ("not rule corrections"), so they are outside this brief.

### Operations.tsx
- Regression 1 (unlabelled security-group inference): applied as given. "Our reading of that order: the error points at the EFA device or the -p and -e flags, and a security group that blocks the control port fails earlier, at that control connection."
- Remaining 1 (topology file "On P5 and later"): applied as given, plus one citation placement. Added `topoGate: plugin('src/nccl_ofi_rdma.cpp', 'L7199-L7210')` (v1.22.0, re-fetched). Topology paragraph now opens "Where a GPU has more than one EFA device ..." with topoMemfd and topoGate. Topo row fix text replaced as given; `topoGate` also added to that row's source cell beside `topoDefer`, so the new condition in the row carries the citation that bears it.
- Remaining 2 ("registers an InfiniBand device and nothing else"): applied as given ("... and no network device").
- Remaining 3 (conflict SourceRef on the installer clause): applied as given. `docs.installer` (already in the registry, cited at the version table) now sits on "installer 1.51.0 ships 2.7.0amzn2.0"; the doc-code-conflict SourceRef moved to "The line shows which of the two fabrics you got".
- Remaining 4 (SRD and EKS rendered before expansion): applied as given. Counter group label "Network (SRD, Scalable Reliable Datagram)", meaning cell "times SRD traffic timed out"; failure table fix cell "EKS (Elastic Kubernetes Service) Auto Mode leaves it off.", detect cell "the EKS guide gives ...".

### TopologyApi.tsx
- Remaining 1 (universal "is inferring it" beside a scoped hedge): applied as given. "Treat any page that names layer iii a top-of-rack switch as inference unless it cites an AWS source."
- Remaining 2 ("Nothing in the documentation binds ..."): applied as given. "No documentation binding layer i, ii or iii to a spine, aggregation or leaf tier was located during this research."
- Remaining 3 (uncited "single most common way" superlative): applied as given (sentence deleted; the preceding sentence carries the action).

## Tally

- Regressions: 6 of 6 applied as given.
- Remaining corrections: 19 of 19 closed. 17 applied as given. 2 applied with a documented variation: Pricing remaining 1 (cited the placement-groups page instead of the "No source" flag, note re-expressed to what that page bears) and Operations remaining 1 (`topoGate` also attached to the topo row's source cell). AIMLTraining remaining 6 is the umbrella for regressions 1 to 3, counted there.
- Skipped: none. Out of scope: Backlog items in every section, NcclOverEfa "Economy edits".

## New sources for the orchestrator to register in the appendix

- Tier 3: Narayanan et al., "Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM", arXiv:2104.04473, https://arxiv.org/abs/2104.04473, accessed 2026-10-23 (AIMLTraining `docs.megatronGpu`).
- Tier 1: Amazon EC2 User Guide, "Placement groups for your Amazon EC2 instances", https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html, accessed 2026-10-23 (data/pricing.ts `PLACEMENT_GROUPS_DOC`).
- Code refs (pinned, new keys): aws/aws-ofi-nccl v1.22.0 src/platform-aws.cpp L88-L105 and L248-L250 (AIMLTraining `topoRows`, `topoRowG5`); ofiwg/libfabric v2.7.0 prov/efa/src/efa_domain.c L803-L808 (AIMLTraining `gdaOpsDirect`); aws/aws-ofi-nccl v1.22.0 src/nccl_ofi_rdma.cpp L7199-L7210 (Operations `topoGate`, same range as AIMLTraining `writeTopoGate`); NVIDIA/nccl v2.32.3-1 src/plugin/net.cc L333-L337 (NcclOverEfa `ncclNetInternal`).
- Removed code ref: AIMLTraining `tunerV2` (aws-ofi-nccl v1.22.0 src/tuner/nccl_ofi_tuner.cpp L140-L159) no longer cited in that section.

## Backlog noted while applying

- AIMLTraining: an NVIDIA Fabric Manager user guide citation for the version-mismatch outcome (sentence deleted for now).

## SVG text changed

None. No diagram file or SVG text was touched.

## Checks (foreground, repo root, 2026-10-23)

- pnpm --filter @tech-deep-dives/efa typecheck: exit 0
- pnpm --filter @tech-deep-dives/efa lint: exit 0 (--max-warnings 0)
- bash scripts/gates/no-ai-tells.sh: PASS
- bash scripts/gates/svg-a11y.sh: PASS
- bash scripts/gates/pinned-refs.sh: PASS
- bash scripts/gates/pre-overflow.sh: PASS
- Build and test not run, per the brief.

STATUS: COMPLETE
