# fc11-aws-a: fact-check of AwsNeuron.tsx, AwsGpuEfaNixl.tsx and Ec2TopologyPlacement.tsx

Status: DONE. Fixes applied; typecheck, lint and the four static gates pass.

Pin: vLLM v0.31.0 (db9527a46873454610df6dbedf79a36d6bf1a7f6), source at /tmp/vllm-new.
External pins, fetched 2026-10-18 into /tmp/fc11-dl: vllm-neuron `v0.24.0.1.1.0`
(ed3580d01e8632897b29986ab7532d8c5925846f; README, pyproject, requirements/core.txt, features
guide, configuration reference, migration guide, platform.py, spec_decode/eagle.py, the
gpt-oss multinode_DI example, release bodies via `gh api`); vLLM `v0.24.0`
(platforms/__init__.py, arg_utils.py); Neuron docs `/en/v2.32.0/` (What's New, vLLM Neuron
index, NxD Inference release notes, NxD Inference vLLM page) plus `/en/latest/` What's New for
the "latest release" check; cloud-provider-aws `v1.37.0`; llm-d Router `v1.0.0`; Karpenter
`v1.15.0` and the v1.11.0 release body; aws-neuron/upstreaming-to-vllm repo metadata. AWS pages
(unversioned, read 2026-10-18): EC2 accelerated-computing instance specifications, EC2 P6
product page, EFA overview (supported instance types), EFA and NIXL guide, EFA and NCCL guide,
EFA installer changelog, placement strategies, Capacity Reservations in cluster placement
groups, Capacity Blocks for ML, How EC2 topology works, topology prerequisites, the
DescribeInstanceTopology, DescribeCapacityReservationTopology and InstanceTopology API pages,
EKS EFA guide, What's New (NIXL with EFA, P6e-GB300 GA), the Rufus, llm-d and vLLM DLC blogs,
ECR Public tag list for deep-learning-containers/vllm.

Abbreviations: `VN/` = `https://github.com/vllm-project/vllm-neuron/blob/v0.24.0.1.1.0/`, `V/` = `https://github.com/vllm-project/vllm/blob/v0.31.0/`,
`EC2UG/` = `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/`.

Harness: not run. No diagram was edited (no SVG geometry, label or `<title>` changed).

## Checks the orchestrator asked for

**Instance specs (GPU count, network bandwidth, network cards, NVLink domain).** Every row was
checked against the EC2 accelerated-computing specifications page
(`https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html`, "Accelerators" and "Network
specifications" tables). GPU count and per-GPU memory: CONFIRMED for all eight rows (P5 8x H100
80 GiB; P5e and P5en 8x H200 141 GiB; P6-B200 8x B200 179 GiB; P6-B300 8x B300 268 GiB;
P6e-GB200 4x B200 185 GiB; G6e 1x to 8x L40S 44 GiB). Network: p5/p5e.48xlarge 3200 Gigabit on
32 cards, p5en 3200 on 16, p6-b200 3200 on 8, p6-b300 6400 on 17, CONFIRMED. G6e EFA from 8xlarge
(25 to 400 Gbps), none on xlarge/2xlarge/4xlarge, CONFIRMED. The page states no "EFA device
count"; it states network cards, which is what the specs table carries. NVLink domain (72 GPUs
per P6e-GB200 UltraServer) is attributed to the EC2 P6 product page, which says so. P6e-GB300 is
still absent from the specs table on 2026-10-18, CONFIRMED. Fixes: P6e-GB200 network (G1),
two derived figures removed (G2, G3).

**NIXL pull by default, push as the alternative, LIBFABRIC on EFA.** CONFIRMED in all three
files: `NixlConnector = NixlPullConnector` (`V/vllm/distributed/kv_transfer/kv_connector/v1/nixl/connector.py#L408`),
READ in `pull_worker.py#L552-L565`, WRITE from the `nixl-push-writer` thread in
`push_worker.py#L146-L152` and `#L714-L724`, default backend `["UCX"]` in
`base_worker.py#L560-L562`, LIBFABRIC selected through `kv_connector_extra_config.backends`
(`V/docs/features/nixl_connector_usage.md#L39-L52`), the AWS guide's LIBFABRIC sentence
verbatim. The Neuron path (`NeuronNixlConnector`, LIBFABRIC, `libcuda.so.1` and
`libfabric.so.1`) CONFIRMED at `VN/docs/guides/features-guide.md#L298-L313` and
`VN/vllm_neuron/vllm/platform.py#L753-L769`.

**vllm-neuron pins vLLM 0.24.0.** CONFIRMED three ways: README version table
(`VN/README.md#L127-L131`), `vllm==0.24.0` in `VN/requirements/core.txt`, and the Neuron 2.32.0
What's New ("Upgraded to vLLM 0.24.0 (vllm-neuron 0.24.0.1.1.0)"). v0.24.0.1.1.0 is still the
newest plugin tag and 2.32.0 the newest SDK on 2026-10-18 (checked `/en/latest/` What's New:
latest release 2.32.0; the only later post is vLLM Omni Neuron Beta, 2026-09-30). The page
never implies a Trainium server runs v0.31.0; the admission-flag example is right at both pins
(`V/vllm/engine/arg_utils.py#L1692-L1698`; absent from v0.24.0 `arg_utils.py`).

**DescribeCapacityReservationTopology versus DescribeInstanceTopology, node labels.** CONFIRMED:
DCRT reads pending or active reservations "before it is launched" and takes reservation IDs and
filters; DescribeInstanceTopology reads running instances and takes filters, instance IDs and
placement-group names; neither places anything; partial 1, 2 or 3 node sets for reservations;
3 versus 4 nodes per type (prerequisites page); account-hashed node IDs and `capacityBlockId`
(InstanceTopology page). Labels: `topology.k8s.aws/network-node-layer-<n>` numbered from 1 at the
top (`https://github.com/kubernetes/cloud-provider-aws/blob/v1.37.0/pkg/providers/v1/well_known_labels.go#L23-L26`,
`instances_v2.go#L95-L118`; `topology.go#L89-L90` calls DescribeInstanceTopology), so on P6-B200 and
P6-B300 the bottom layer is `-4`. The EKS-documentation hedge stays scoped: a web search found
only AWS blogs (the AWS China EKS GPU blog and the HyperPod task-governance blog) describing the
labels, no EKS User Guide page.

**Scope boundary.** No duplicated EFA-fabric or memory-tier explanation found. AwsGpuEfaNixl
names OS-bypass, SRD and the libfabric provider and links to the EFA dive; per-GPU HBM links to
the Silicon dive; AwsNeuron links Trainium hardware to the Silicon dive. One overlap to note for
the orchestrator, left in place: Ec2TopologyPlacement "OBSERVABILITY: the two topology APIs"
covers ground the EFA dive's "The EC2 Instance Topology API" section also covers (account-hashed
IDs, reservation topology, the bottom-layer rule, node labels). It is EC2 placement rather than
the fabric, it is this section's subject, and the page already sends readers to the EFA section
for the field-level depth, so no cut was made.

## AwsNeuron.tsx

90 claims checked: 87 CONFIRMED, 2 WRONG, plus 1 Section Shape demotion. Notable CONFIRMED rows:
the EAGLE3-only statement holds against the features guide's "EAGLE3 and DFlash are supported"
(`VN/docs/guides/features-guide.md#L526`) because the code asserts `method == "eagle3"`
(`VN/vllm_neuron/vllm/spec_decode/eagle.py#L44-L45`) and the migration guide says EAGLE3 only
(`#L47`); code wins, so the page is right. The Trn1/Inf2 "two AWS pages disagree" statement
holds (README row 0.5.3 versus the 2.29.0 breaking change in the NxD Inference release notes).

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| N1 | EPD is "encode, prefill and decode on separate servers" | AwsNeuron.tsx:127 | WRONG | `VN/docs/guides/features-guide.md#L828-L837`: VE pool plus one Prefill+Decode pool; "EPD is strictly two-way; prefill and decode stay co-located in one PD engine" | Reworded to a vision-encoder pool with prefill and decode together on a second pool; cite added in the table footnote |
| N2 | Code comment: "AWS Neuron documentation publishes no versioned URLs" | AwsNeuron.tsx:15-17 | WRONG | The file's own constants use `/en/v2.32.0/`, which resolve (HTTP 200) | Comment corrected (not reader-facing) |
| N3 | Rufus leader/follower grid and NxDI collectives paragraph | AwsNeuron.tsx:764-796 | Section Shape | Describes a Trn1 + NxD Inference stack the 1.x plugin does not list, and repeats section 23's DescribeInstanceTopology quote | Demoted into an ExpandableSection; the scale paragraph and the "What carries over" alert stay visible |

**Score: 8/10.** Accurate at the plugin tag and the 2.32.0 docs; every quantitative claim cited.
Section Shape: the file is 2,636 to 4,223 words against `145314b` (+60%). Every block passes at
least one test except the Rufus internals (N3), which fail both for a reader designing on the 1.x
plugin and are now behind a disclosure. The vLLM 0.24.0 pin is the hammered number; the section
ends on the next step. What keeps it from 9: length is still well above the pre-revamp file.

## AwsGpuEfaNixl.tsx

78 claims checked: 73 CONFIRMED, 2 WRONG, 3 OVERREACH.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| G1 | P6e-GB200: "per-instance EFA bandwidth not confirmed in a first-party source" | AwsGpuEfaNixl.tsx:71 | WRONG | EC2 specs Network table: `p6e-gb200.36xlarge` 3200 Gigabit, EFA yes, 17 network cards (`https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html`); the P6 product page lists 3.2 Tbps too | "3,200 Gbps across 17 network cards" |
| G2 | P5en "200 Gbps per card by division, against 100 on P5"; "half the network cards" | AwsGpuEfaNixl.tsx:52-53 | OVERREACH | Derived figure; the specs table lists bandwidth and card count only | Derived numbers removed; "the same 3,200 Gbps, on 16 network cards rather than 32" |
| G3 | P6-B300 "Twice the network bandwidth of P6-B200" | AwsGpuEfaNixl.tsx:65 | OVERREACH | Ratio derived from the specs table (the 2x is the product page's wording, not the cited page's) | "6,400 Gbps against the 3,200 of P6-B200" |
| G4 | With `kv_buffer_device: cuda`, EFA moves KV by GPUDirect RDMA, GPU to GPU (stated for every EFA instance) | AwsGpuEfaNixl.tsx:292-300, 558-559 | OVERREACH | `EC2UG/efa.html` supported-types table: GDR Yes on p5/p5e/p5en/p6-b200/p6-b300.48xlarge and p6e-gb200.36xlarge, No on every g6e size (and on p5.4xlarge) | Narrowed to the P5/P6 sizes in the table, G6e named as EFA without GDR, cite added |
| G5 | Two-host test runs `nixlbench ... --initiator_seg_type VRAM --target_seg_type VRAM` | AwsGpuEfaNixl.tsx:818 | WRONG | `EC2UG/efa-start-nixl.html` Step 13: the cross-instance test passes `--initiator_seg_type VRAM` only, with etcd on host 1; the `--target_seg_type VRAM` form is the single-instance, two-terminal test | Command and wording corrected |

**Score: 8/10.** Pull/push, roles, side channel and the AWS guide's `kv_both` conflict are all
code-confirmed; instance specs now attributed to the specs table with nothing derived. Section
Shape holds (mental model in the data path, practical value in the config and bring-up order,
next action last). The diagram (unchanged) already shows pull by default.

## Ec2TopologyPlacement.tsx

66 claims checked: 60 CONFIRMED, 4 OVERREACH, 1 UNSUPPORTED, 1 prose-rule item.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| T1 | "That 2x single-flow headroom is the headline reason it is the default lever" | Ec2TopologyPlacement.tsx:457-462 | OVERREACH | `EC2UG/placement-strategies.html`: AWS's stated reason is low latency, high throughput and mostly intra-group traffic; the 10 Gbps limit is a single-flow TCP rule, while EFA and NCCL traffic is not single-flow TCP | Replaced with AWS's own recommendation, quoted |
| T2 | "The most common mistake an SA sees is asking a topology API to launch close" | Ec2TopologyPlacement.tsx:323-324 | UNSUPPORTED | No source for frequency | Reduced to the supported statement: a topology API cannot launch close |
| T3 | Three-node list includes "P5" | Ec2TopologyPlacement.tsx:644 | OVERREACH | `EC2UG/ec2-instance-topology-prerequisites.html` lists p5.48xlarge, not p5.4xlarge | "(48xlarge only; p5.4xlarge is not listed)" |
| T4 | Multi-node tensor- and pipeline-parallel serving "runs NCCL collectives every layer" (and table row "TP/PP collectives") | Ec2TopologyPlacement.tsx:340-341, 50 | OVERREACH | PP passes activations at stage boundaries; per-layer collectives are TP's | Split TP (collectives per layer) from PP (stage boundary); table row says "traffic" |
| T5 | Keeping pools in one proximity domain costs "near zero" | Ec2TopologyPlacement.tsx:855 | OVERREACH | Contradicts the page's own capacity warning (placement-strategies: insufficient capacity error when scaling) | "the cost is the capacity planning in the panels above" |
| T6 | `PG` and `EPP` first appear unexpanded in Diagram 1 SVG text | Ec2TopologyPlacement.tsx:142-202 | Prose rule | Acronym Standard (first occurrence in reading order) | Expanded in the Diagram 1 h2 description, which renders first; the later "(placement group)" expansion removed; "SA" expanded in the playbook h2 |

**Score: 8/10.** The two topology APIs, the layer counts, the label numbering and the EPP
fail-open rule are confirmed against docs and pinned code. Section Shape holds: control versus
observe is the mental model, the playbook is the next action and lands last. Diagrams unchanged
and consistent with the docs' NN1 to NN7 example.

## Items for the orchestrator

- GlossaryAndSources / sources.md: new source used in AwsGpuEfaNixl, "AWS EC2 User Guide: EFA
  supported instance types" (`EC2UG/efa.html`), read 2026-10-18.
- Overlap note above (topology API coverage shared with the EFA dive), no edit made.
