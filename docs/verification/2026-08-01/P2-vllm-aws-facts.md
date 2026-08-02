# P2 — Adversarial fact verification: vLLM deep dive, five AWS sections

- **Date run:** 2026-08-01
- **Sections authored:** 2026-06-07 (all five carry `accessed 2026-06-07` citations)
- **Method:** Tier-1 only for every number — AWS Price List API / official EC2, EKS, SageMaker and Neuron
  documentation, AWS What's New first-party announcements, upstream project docs (DJL, Karpenter, vLLM).
  No third-party price aggregators used. Region/OS/tenancy matching and `MarketOption=OnDemand`
  filtering were prepared but **not needed** — see "Headline null result" below.
- **Files audited:**
  - `/Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/vllm/src/sections/AwsSageMakerBedrock.tsx` (1,334 lines)
  - `/Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/vllm/src/sections/Ec2TopologyPlacement.tsx` (791 lines)
  - `/Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/vllm/src/sections/AwsEks.tsx` (790 lines)
  - `/Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/vllm/src/sections/AwsGpuEfaNixl.tsx` (633 lines)
  - `/Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/vllm/src/sections/AwsNeuron.tsx` (504 lines)

---

## Headline null result: the stale-price hypothesis does NOT transfer

The brief hypothesised that these five sections carry the same class of error as the sibling deep dive's
~9-month-stale EC2 On-Demand prices (p5.48xlarge published at $98.32 vs a real $55.04; p4d at $32.77 vs
$21.957642).

**Refuted. There is not a single dollar figure in any of the five files.**

Verification performed:

```
grep -n '\$[0-9]'                                    → 0 matches across all five files
grep -niE 'price|pricing|per hour|/hr|hourly|usd|cent' → only qualitative uses:
    "cost at volume", "cost-efficient", "price-sensitive", "verify against current pricing"
```

The only cost-shaped quantity anywhere is `AwsSageMakerBedrock.tsx:1061` — `'~15-40% premium'` — and the
authors already tagged it `[Tier-3, verify]` inline and repeated the warning at line 1085
(*"the cost premium figure is [Tier-3 / third-party] and time- and region-sensitive"*). The sections
consistently defer pricing to first-party pages rather than hard-coding rates. **This is the correct
pattern and the reason the stale-price failure mode did not reproduce here.**

The real defects in these files are a different class: **stale service behaviour and stale version pins**,
not stale prices. Two of them invert an architectural recommendation.

---

## Severity summary

| Severity | Count | Items |
| --- | --- | --- |
| **HIGH — recommendation is now wrong** | 2 | Karpenter placement-group gap (`AwsEks`); SageMaker vLLM-metrics gap (`AwsSageMakerBedrock`) |
| **MEDIUM — number contradicts its own cited Tier-1 source** | 3 | SageMaker real-time payload 6 MB (x2 sites); fused_moe_lora hardware attribution |
| **LOW — stale version pin / misattribution / internal inconsistency** | 8 | EFA installer 1.48.0; Neuron 2.30.0; `consolidateAfter: 300s`; Spot "~60-70% off"; tier-label inconsistency; "exactly one tool"; pinned `v0.10.1` doc URL; redirected EKS URL |
| **UNKNOWN — no Tier-1 source located** | 4 | p5en network-card count; LMI default-value table; SageMaker large-model deploy thresholds; EFA 64-path spraying (deferred to sibling) |
| **VERIFIED CORRECT** | 71 | — |

**Total quantitative / factual claims checked: 88. Wrong or misattributed: 13. Unknown: 4.**

---

## Full claim table

Verdict key: **OK** = matches Tier-1 verbatim or within stated tolerance · **WRONG** = contradicts Tier-1 ·
**STALE** = was right on 2026-06-07, superseded since · **MISATTRIB** = value real but not from the cited
source · **UNSUP** = no Tier-1 source found · **INCONSIST** = internally contradictory

### Ec2TopologyPlacement.tsx — 790 lines, 18 claims, 17 OK

| file:line | Published claim | Verified value (Tier-1) | Verdict |
| --- | --- | --- | --- |
| `Ec2TopologyPlacement.tsx:23,367` | Cluster PG raises single-flow TCP from 5 Gbps to 10 Gbps | *"Instances within a cluster placement group can use up to 10 Gbps for single-flow traffic. Instances that are not within a cluster placement group can use up to 5 Gbps"* — EC2 placement-strategies | **OK** (verbatim) |
| `Ec2TopologyPlacement.tsx:355-361` | CPG = *"logical grouping of instances within a single Availability Zone"* … *"higher per-flow throughput limit … same high-bisection bandwidth segment"* | Verbatim match | **OK** |
| `Ec2TopologyPlacement.tsx:408-410` | CPG cannot span AZs; per-pair throughput *"limited by the slower of the two instances"* | Verbatim match | **OK** |
| `Ec2TopologyPlacement.tsx:402-404` | Docs warn of insufficient-capacity error; recommend single launch request, single instance type | Verbatim match | **OK** |
| `Ec2TopologyPlacement.tsx:414-419` | Mitigation = ODCR created in the CPG; zonal RIs can't target a PG | Verbatim match | **OK** |
| `Ec2TopologyPlacement.tsx:386` | Partition PG: up to seven partitions per AZ | *"maximum of seven partitions per Availability Zone"* | **OK** |
| `Ec2TopologyPlacement.tsx:51,393` | Spread PG: max 7 running instances per AZ per group | *"maximum of seven running instances per Availability Zone per group"* (rack level) | **OK** |
| `Ec2TopologyPlacement.tsx:456-460` | Capacity Blocks *"automatically placed close together inside Amazon EC2 UltraClusters, for low-latency, petabit-scale, non-blocking networking"* | Verbatim match | **OK** |
| `Ec2TopologyPlacement.tsx:465-466` | Up to 64 instances per block; up to 256 across blocks; reservable up to 8 weeks out | *"Each Capacity Block can have up to 64 instances, and you can have up to 256 instances across Capacity Blocks"*; *"start time up to eight weeks in the future"* | **OK** |
| `Ec2TopologyPlacement.tsx:494-500` | API describes *"tree-based hierarchy … physical host placement … within an Availability Zone or Local Zone"* / *"relative proximity"* | Verbatim match | **OK** |
| `Ec2TopologyPlacement.tsx:505-507` | Instances must be `running`; can't get topology in any other state | Verbatim match | **OK** |
| `Ec2TopologyPlacement.tsx:514-516` | *"the network node that is connected to the instance is the last network node in the list (the bottom layer)"* | Verbatim match | **OK** |
| `Ec2TopologyPlacement.tsx:527` | 3 nodes: P3dn, P4d, P4de, P5, P5e, P5en, P6e-GB200, Trn1, Trn1n, Trn2, Trn2u + G6e/G7e + HPC | Exact doc list: `g6e.*`, `g7e.*`, `hpc6a/6id/7g/7a/8a`, `p3dn`, `p4d`, `p4de`, `p5`, `p5e`, `p5en`, `p6e-gb200.36xlarge`, `trn1`, `trn1n`, `trn2`, `trn2u` | **OK** |
| `Ec2TopologyPlacement.tsx:538-539` | Only `p6-b200.48xlarge` and `p6-b300.48xlarge` return 4 nodes | *"Returns 4 network nodes: p6-b200.48xlarge \| p6-b300.48xlarge"* | **OK** |
| `Ec2TopologyPlacement.tsx:561-573` | Proximity rule: find common bottom-layer nodes first, then upper; *"the fewer the number of hops … the closer"* | Verbatim match | **OK** |
| `Ec2TopologyPlacement.tsx:580-584` | `DescribeCapacityReservationTopology` exists; *planning and management mode* vs *post-launch execution mode*; partial node set (1, 2, or 3 nodes) | Comparison table: "Pre-launch (planning and management mode)" / "Post-launch (execution mode)"; *"The response contains 1, 2, or 3 network nodes"* | **OK** |
| `Ec2TopologyPlacement.tsx:643-664` | Rufus quotes: *"gathers this information using the Amazon EC2 DescribeInstanceTopology API to pair nodes based on their underlying network topology"*, leader/follower | Matches AWS ML blog (Tier-2, labelled as such) | **OK** |
| `Ec2TopologyPlacement.tsx:256,283` | *"The other bucket holds exactly one tool that only lets you observe"*; table header *"Six mechanisms"* | Contradicted by the same file at line 580, which introduces `DescribeCapacityReservationTopology` as a second observability API. It is absent from the mechanisms table and from the control-vs-observe diagram. | **INCONSIST** |

**Brief's three targeted questions on this file, answered:**

1. **Does it mention `DescribeCapacityReservationTopology` (GA 2025-10-30)?** **Yes** — `Ec2TopologyPlacement.tsx:580-588`,
   correctly framed as the pre-launch planning sibling with a partial 1/2/3-node set. It is however buried inside a
   collapsed `ExpandableSection` and omitted from the mechanisms table and both diagrams, which is what produces the
   "exactly one tool" contradiction above. The GA date itself is not stated (not an error, an omission).
2. **Does it hard-code `NetworkNodes[1]` / `[2]`?** **No.** The file contains no code that indexes `NetworkNodes`
   (`grep -rn NetworkNodes` over `deep-dives/vllm/` returns only prose and SVG labels). **No bug present.**
   *Gap worth noting:* the file teaches the 3-vs-4-layer distinction at lines 523-547 but never states the
   engineering consequence — that the leaf is `nodes[-1]`, not `nodes[2]`. The sibling EFA dive's research notes
   already document this exact trap and a first-party tool (`hostfile-topologify.py`) that gets it wrong
   (`deep-dives/efa/research/2026-08-refresh/02-ec2-topology-api.md:206,425`). The vLLM section would benefit from
   the same one-line warning.
3. **Does it claim Karpenter supports network-node topology-aware scheduling?** **No.** Lines 726-745 assert the
   opposite and correctly: inference-aware schedulers (llm-d EPP, Gateway API Inference Extension) score on
   KV-cache state, prefix hits, queue depth and latency, not on physical network nodes. **Claim is sound.**
   (The adjacent Karpenter claim in `AwsEks.tsx` is a separate problem — see below.)

### AwsGpuEfaNixl.tsx — 632 lines, 20 claims, 17 OK

| file:line | Published claim | Verified value (Tier-1) | Verdict |
| --- | --- | --- | --- |
| `AwsGpuEfaNixl.tsx:22` | p5.48xlarge: 8x H100; 32 network cards = up to 32 EFA; 3,200 Gbps aggregate | *"p5.48xlarge and p5e.48xlarge instances support 32 network cards and have a total network bandwidth capacity of 3,200 Gbps"*; run-instances example shows 32 EFA devices; P5 product page: "8 H100 / 640 GB HBM3 / 3200 Gbps EFA" | **OK** |
| `AwsGpuEfaNixl.tsx:28` | p5en.48xlarge: 8x H200; **16 network cards** = up to 16 EFA; 3,200 Gbps | GPU count/memory and 3,200 Gbps confirmed (P5en product page: "8 H200 / 1128 GB HBM3e / 3200 Gbps EFA"; EFAv3 on Nitro v5). **The 16-network-card figure has no Tier-1 source** — `efa-acc-inst-types.html` documents P5/P5e, P6-B200, P6e-GB200 and P6-B300 but has no P5en section. | **UNSUP** (file already warns at 376-381 that these are carried from the sibling dive) |
| `AwsGpuEfaNixl.tsx:34` | Up to 6,400 Gbps aggregate on P6-B300 | *"P6-B300 instances have a total network bandwidth capacity of up to 6400 Gbps for EFA traffic"* (8 GPUs, 17 network cards) | **OK** |
| `AwsGpuEfaNixl.tsx:32-35` | P6 = "Highest inter-node bandwidth" | True for B300 (6,400 Gbps). P6-B200 is 3,200 Gbps — same as P5. P6e-GB200 tops out at 1,600 Gbps EFA per instance. The generalisation across the whole P6 family is loose but not a stated number. | **OK (loose)** |
| `AwsGpuEfaNixl.tsx:40` | G6e: EFA on larger sizes, confirm per-size | Correctly hedged; not a hard claim | **OK** |
| `AwsGpuEfaNixl.tsx:180,590` | AWS What's New posted **Mar 19, 2026** | *"Posted on: Mar 19, 2026"* | **OK** |
| `AwsGpuEfaNixl.tsx:181-183` | Quoted: *"AWS announces support for NVIDIA Inference Xfer Library (NIXL) with Elastic Fabric Adapter (EFA) to accelerate disaggregated large language model (LLM) inference on Amazon EC2"* | This is the **body first sentence**, verbatim. (Page headline differs: *"AWS adds support for NIXL with EFA to accelerate LLM inference at scale"* — the article quotes the body, which is legitimate.) | **OK** |
| `AwsGpuEfaNixl.tsx:183-185` | *"on all EFA-enabled EC2 instance types"*, *"at no additional cost"*, frameworks: NVIDIA Dynamo, SGLang, vLLM | Verbatim match (source adds "in all AWS regions") | **OK** |
| `AwsGpuEfaNixl.tsx:308` | NIXL version 1.0.0 or higher | *"NIXL version 1.0.0 or higher"* | **OK** |
| `AwsGpuEfaNixl.tsx:312` | EFA installer version 1.47.0 or higher (announcement floor) | *"EFA installer version 1.47.0 or higher"* | **OK** |
| `AwsGpuEfaNixl.tsx:325` | Only Ubuntu 24.04 and Ubuntu 22.04 base AMIs supported | *"Only Ubuntu 24.04 and Ubuntu 22.04 base AMIs are supported"* | **OK** |
| `AwsGpuEfaNixl.tsx:329-331` | *"the guide currently installs the EFA installer at `1.48.0`"* | Guide now downloads **`aws-efa-installer-1.49.0.tar.gz`**. (1.48.0 is now referenced only as the release that introduced GPG-signed per-package verification and the `--check-signatures` flag.) | **STALE** → 1.49.0 |
| `AwsGpuEfaNixl.tsx:329-330` | EFA supports NIXL 1.0.0 and later | *"EFA supports only NIXL 1.0.0 and later"* | **OK** |
| `AwsGpuEfaNixl.tsx:334-336` | libfabric installs to `/opt/amazon/efa`; build with `-Dlibfabric_path=/opt/amazon/efa` | Verbatim match (Step 5 note + Step 6 meson command) | **OK** |
| `AwsGpuEfaNixl.tsx:247-255` | The `vllm serve` block: `--port 8200`, `--enforce-eager`, `kv_connector: NixlConnector`, `kv_role: kv_both`, `kv_buffer_device: cuda`, `backends: ["LIBFABRIC"]` | Byte-for-byte match with Step 14 producer/consumer configs | **OK** |
| `AwsGpuEfaNixl.tsx:544-547` | Self-referencing security group mandatory, built in Step 1 | Step 1 verbatim: *"security group that allows all inbound and outbound traffic to and from the security group itself"* | **OK** |
| `AwsGpuEfaNixl.tsx:555-557` | Provision an extra **10-20 GiB** for the CUDA toolkit or hit `insufficient disk space` | *"You must provision an additional 10 to 20 GiB of storage for the Nvidia CUDA Toolkit … you will receive an `insufficient disk space` error"* | **OK** |
| `AwsGpuEfaNixl.tsx:560-562` | `nixlbench --backend LIBFABRIC --initiator_seg_type VRAM` across two hosts | Verbatim match (Step 13) | **OK** |
| `AwsGpuEfaNixl.tsx:704-712` (in `Ec2TopologyPlacement`) + this file | Claim that the EFA+NIXL guide **never mentions cluster placement groups** | Confirmed by full read of all 14 steps of `efa-start-nixl.html`: Step 11 launches instances with no PG; Step 12 is passwordless SSH. **Zero occurrences.** | **OK** |
| `AwsGpuEfaNixl.tsx:425` | DLC blog example uses `P4d.24xlarge` (8x A100) | Matches AWS ML blog (Tier-2, labelled) | **OK** |
| `AwsGpuEfaNixl.tsx:464` | llm-d: *"increases tokens per second by up to 70% as concurrency increases compared to using a standard vLLM deployment"* | Verbatim match in AWS ML blog | **OK** |
| `AwsGpuEfaNixl.tsx:471-473` | Benchmark ran on `ml.p6-b200.48xlarge` (Blackwell B200) | Blog: baseline vLLM deployed on `ml.p6-b200.48xlarge` | **OK** |
| `AwsGpuEfaNixl.tsx:479-481` | 4 prefill pods TP=1, 1 decode pod TP=4 | Blog verbatim: *"4 prefill pods each with a tensor parallel degree of 1 and 1 decode pods with a tensor parallel degree of 4"* | **OK** |
| `AwsGpuEfaNixl.tsx:196` | EFA/SRD sprays packets across up to 64 paths | Explicitly deferred to the sibling EFA deep dive; not re-verified in this pass | **UNSUP (deferred)** |
| `AwsGpuEfaNixl.tsx:180,309,312,316,358` vs `572-591` | Same AWS What's New source labelled `[Tier-2]` inline five times but filed under **"Tier-1: AWS / vLLM authoritative"** in the Sources block | Per repo `CLAUDE.md`: Tier 1 = official AWS docs/API/source; Tier 2 = AWS blog posts / re:Invent talks. A first-party What's New announcement is Tier-1. The two labels cannot both be right. | **INCONSIST** |

### AwsEks.tsx — 789 lines, 20 claims, 16 OK

| file:line | Published claim | Verified value (Tier-1) | Verdict |
| --- | --- | --- | --- |
| `AwsEks.tsx:183,419,713` + diagram note `:104-105` | **"Karpenter does not natively create EC2 placement groups"** → therefore EFA multi-node "needs … a pre-provisioned EFA-enabled managed node group with a cluster placement group", "not Karpenter, because of the placement-group gap", "Treat the multi-node tier as standing capacity … not as something you spin up on demand" | Karpenter **v1.14** `EC2NodeClass` exposes **`spec.placementGroupSelector`**, GA, no feature gate: *"Placement Group Selector allows you to select a placement group for instances launched by this EC2NodeClass. Each EC2NodeClass maps to exactly one placement group — all instances launched from that EC2NodeClass are placed into the resolved placement group."* Selects by `name` or `id`; **cluster, partition and spread strategies all supported.** The literal word "create" survives (you must pre-create the PG), but the architectural conclusion does not: Karpenter *can* autoscale nodes into a cluster placement group today. | **WRONG (HIGH)** — recommendation inverted |
| `AwsEks.tsx:219` | DLC image `public.ecr.aws/deep-learning-containers/vllm:0.21.0-gpu-py312-cu130-ubuntu22.04-ec2-v1.0-soci`; vLLM 0.21.0, CUDA 13.0, SOCI | Byte-for-byte match in the EKS quickstart, incl. the doc's own gloss *"vLLM 0.21.0 with GPU support, Python 3.12, CUDA 13.0, Ubuntu 22.04 … SOCI-enabled"* | **OK** |
| `AwsEks.tsx:224` | Karpenter NodePool `gpu-inf`; works on EKS Auto Mode and self-managed Karpenter; example node `g6e.4xlarge` | `nodeSelector: karpenter.sh/nodepool: gpu-inf`; *"instructions … work for both EKS Auto Mode and self-managed Karpenter"*; *"was using a g6e.4xlarge instance, which has 20 Gbps sustained network bandwidth"* | **OK** |
| `AwsEks.tsx:227-228` | Weights: HF → S3, streamed S3 → GPU via Run:ai Model Streamer (`--load-format=runai_streamer`) | Verbatim match | **OK** |
| `AwsEks.tsx:231-232` | Front door Open WebUI; kube-prometheus-stack + community vLLM Grafana dashboard | Verbatim match (Step 5, Step 4) | **OK** |
| `AwsEks.tsx:391,683,690,746` | Grafana `gnetId 25263`, pre-provisioned, no manual import | *"already provisions the community vLLM dashboard (gnetId 25263) under the GPU Monitoring folder, so no extra import is needed"* | **OK** |
| `AwsEks.tsx:638,621` | *"Model loading took … ~5 seconds"*; "sub-10s weight load" | Quickstart log: `Model loading took 9.81 GiB memory and 5.023344 seconds` | **OK** |
| `AwsEks.tsx:667-684` | ServiceMonitor YAML: `monitoring.coreos.com/v1`, label `release: kube-prometheus-stack`, port `http`, path `/metrics`, `interval: 15s` | Byte-for-byte match | **OK** |
| `AwsEks.tsx:688-689` | Metrics `vllm:prompt_tokens_total`, `vllm:generation_tokens_total`, throughput gauges | Verbatim match | **OK** |
| `AwsEks.tsx:243` | DLC blog: `p4d.24xlarge` (8x A100) via managed node groups (eksctl), not Karpenter | Matches AWS ML blog (Tier-2, labelled) | **OK** |
| `AwsEks.tsx:247-248` | Weights on FSx for Lustre; DeepSeek-R1-Distill-Qwen-32B | Matches AWS ML blog (Tier-2, labelled) | **OK** |
| `AwsEks.tsx:453-455` | `karpenter.k8s.aws/instance-category` In `["g","p"]` | Verbatim in EKS Best Practices: AI/ML Compute | **OK** |
| `AwsEks.tsx:456-458` | `karpenter.k8s.aws/instance-generation` Gt `["3"]` | Verbatim | **OK** |
| `AwsEks.tsx:459-461` | `karpenter.k8s.aws/instance-gpu-memory` Gt `["20480"]` (> 20 GiB) | Verbatim in the guide's `gpu-inference-spot` NodePool: `values: ["20480"] # Ensures more than 20GB (20480 MiB) total GPU memory` | **OK** |
| `AwsEks.tsx:462-464` | Taint `nvidia.com/gpu: NoSchedule` | Verbatim | **OK** |
| `AwsEks.tsx:465-467` | `consolidationPolicy: WhenEmpty` + **`consolidateAfter: 300s`**, captioned *"avoid evicting active inference"*, attributed to the AWS best-practices guide (`:474-482`) | The guide gives **two** disjoint examples and this pairing is **neither**: (a) interruption-sensitive → `consolidationPolicy: WhenEmpty` + **`consolidateAfter: 60m`**; (b) Spot GPU inference → `consolidationPolicy: WhenEmptyOrUnderutilized` + `consolidateAfter: 5m`. The article takes the policy from (a) and the duration from (b). 300s is 12x shorter than the guide's own interruption-sensitive recommendation, undercutting the stated rationale. | **MISATTRIB** |
| `AwsEks.tsx:334-337` | Bottlerocket Accelerated AMI ships driver + device plugin pre-installed; AL2023 needs a separate DaemonSet, eksctl automates it | Verbatim match in the best-practices guide | **OK** |
| `AwsEks.tsx:400-404` | Karpenter honours Capacity Blocks / ODCRs via `capacityReservationSelectorTerms` | Confirmed in both the EKS guide and Karpenter v1.14 `EC2NodeClass` | **OK** |
| `AwsEks.tsx:522-528,720-722` | llm-d: up to 70% more tokens/sec under 1024 in / 1024 out, concurrency up to 128, on `ml.p6-b200.48xlarge` / `p5.48xlarge` with 32 EFA interfaces | Blog verbatim: *"input sequence of 1024 input tokens and receiving 1024 output tokens up to a concurrency of 128"*; baseline on `ml.p6-b200.48xlarge`; p5.48xlarge described with 32 EFA interfaces / 4 per GPU | **OK** |
| `AwsEks.tsx:196,263,641,693,740` | Cited URL `…/eks/latest/userguide/ml-realtime-inference-llm-inference-vllm.html` (5 occurrences) | Now **301-redirects** to `…/eks/latest/userguide/ml-inference-load-serve-model.html`. Links still resolve; canonical URL has changed. Content is otherwise intact (the quickstart model has since changed to `Ministral-3-8B-Instruct-2512`, which the section never names, so no downstream error). | **STALE (link)** |

### AwsNeuron.tsx — 503 lines, 12 claims, 11 OK

| file:line | Published claim | Verified value (Tier-1) | Verdict |
| --- | --- | --- | --- |
| `AwsNeuron.tsx:234-239` | *"NxD Inference models are now only supported on Trn2 and newer hardware"*; NKI kernels unsupported on Trn1/Inf2; **pin to Neuron release 2.28** for Trn1/Inf2 | Neuron What's New / NxDI release notes: from **2.29.0**, *"NxD Inference no longer supports Trn1/Inf2. Only Trn2 and newer hardware is supported"*; *"Pin to Neuron SDK 2.28 for Trn1/Inf2 support."* | **OK** |
| `AwsNeuron.tsx:256-258` | Plugin + NxDI targets **Trn2 and Trn3**; **Trn3 support introduced in Neuron 2.27.0** | Trainium3 support added in **2.27.0 (2025-12-19)**; NxDI supports Trn2 and Trn3 from 2.29.0 onward | **OK** |
| `AwsNeuron.tsx:264-267` | Trn1/Inf2 runnable only by pinning SDK 2.28 + matching plugin/vLLM | Consistent with release notes | **OK** |
| `AwsNeuron.tsx:281-286` | *"Latest Neuron SDK at access time: **2.30.0 (2026-05-21)**"* | Latest is now **2.31.0 (2026-07-07)**. Release train since: 2.27.0 (2025-12-19), 2.28.0 (2026-02-26), 2.29.0 (2026-04-09), 2.30.0 (2026-05-21), 2.31.0 (2026-07-07). Claim is explicitly dated "at access time", so it is honest but out of date. | **STALE** → 2.31.0 |
| `AwsNeuron.tsx:179-181` | Neuron SDK revises on *"a roughly six-week cadence"* | Observed intervals: 10, 6, 6, 7 weeks — mean ≈ 6.8. "Roughly six-week" is defensible. | **OK** |
| `AwsNeuron.tsx:272-277` | *"Reported pairings have moved fast (e.g. plugin 0.5.x with Neuron 2.29.0)"* | Explicitly hedged and the reader is told to resolve the triple at install time. No Tier-1 confirmation located. | **UNSUP (self-flagged)** |
| `AwsNeuron.tsx:325` | Cites `docs.vllm.ai/en/**v0.10.1**/getting_started/installation/aws_neuron.html` | Version-pinned doc URL. Current vLLM shipping in the AWS DLC is **0.21.0** (per the EKS quickstart), so this citation is roughly eleven minor releases behind and will drift further. `/en/latest/` or `/en/stable/` would be the durable form. | **STALE (citation)** |
| `AwsNeuron.tsx:146-153` | vllm-neuron is a *"hardware plugin for vLLM on AWS Neuron"* that *"integrates with vLLM by using vLLM's Plugin System"* | Matches the vllm-neuron README | **OK** |
| `AwsNeuron.tsx:23-74` | Feature matrix: continuous batching / prefix caching / EAGLE / multi-LoRA / tool calling / quantization = Supported; multimodal = WIP; **chunked prefill = Not supported**; disaggregated P/D = Not supported; multi-node = fork only | Consistent with the vllm-neuron README feature table and NxDI release notes. The file itself carries an explicit "verify per release" warning at `:176-186` and `:332-334`. Feature-matrix rows move fastest of anything in these five files. | **OK (volatile)** |
| `AwsNeuron.tsx:338-344` | Quantization via `override_neuron_config` inside `additional_config`, **not** `--quantization` | Matches the NxDI vLLM user guide | **OK** |
| `AwsNeuron.tsx:398-405` | Rufus: *"at production scale using tens of thousands of TRN1 instances"* and *"across over tens of thousands of AWS Trainium chips"* | Both strings present in the AWS ML blog and correctly tagged `[Tier-2, AWS ML blog]`. Note the blog itself mixes "instances" and "chips" in the two quotes; the article reproduces both faithfully rather than collapsing them. | **OK** |
| `AwsNeuron.tsx:430-433` | *"cross-node collectives (such as all gather or all reduce) are managed by the Neuron Distributed Inference (NxDI) library, which uses EFA"* | Verbatim, Tier-2 labelled | **OK** |

### AwsSageMakerBedrock.tsx — 1,333 lines, 42 citations, 18 claims checked, 14 OK

| file:line | Published claim | Verified value (Tier-1) | Verdict |
| --- | --- | --- | --- |
| `AwsSageMakerBedrock.tsx:803` | Real-time endpoint: **"6 MB payload"**; 60 s (8 min streaming) | SageMaker Model Hosting FAQs — **the exact page the section cites** — states *"Real-Time Inference is suitable for workloads with millisecond latency requirements, **payload sizes up to 25 MB**, and processing times of up to 60 seconds for regular responses and 8 minutes for streaming responses"* and *"The payload limits are **25 MB for real-time endpoints** and 4 MB for serverless endpoints."* The 6 MB figure is the retired `InvokeEndpoint` limit. Timeouts (60 s / 8 min) are correct. | **WRONG** → 25 MB |
| `AwsSageMakerBedrock.tsx:827-828` | *"Payload ceilings: **6 MB** for `InvokeEndpoint` (HTTP 413 if exceeded), **25 MB** for streaming"* | Same source: 25 MB is the **real-time endpoint** limit, not a streaming-only limit. The split is inverted and the 6 MB half is stale. | **WRONG** |
| `AwsSageMakerBedrock.tsx:804,826` | Asynchronous: 1 GB payload; 60 min timeout | *"Asynchronous Inference is designed for workloads that do not have sub-second latency requirements, payload sizes up to 1 GB, and processing times of up to 60 minutes"* | **OK** |
| `AwsSageMakerBedrock.tsx:806` | Serverless: no GPU → incompatible with vLLM | Serverless Inference is CPU/memory only; 4 MB payload, 1-min `/invocations` timeout, 3-min `/ping` | **OK** |
| `AwsSageMakerBedrock.tsx:851-853` | Container must serve `/invocations` + `/ping` on **port 8080**; vLLM defaults to 8000 so the SageMaker entrypoint translates | Hosting FAQ: *"They implement a web server that responds to `/invocations` and `/ping` on port 8080."* | **OK** |
| `AwsSageMakerBedrock.tsx:1037-1047` **and** `:1065` | *"vLLM's own Prometheus `/metrics` (`vllm:num_requests_waiting`, the TTFT/TPOT histograms, the KV-cache hit rate) is **not surfaced through a SageMaker endpoint**"*; bridging via `PutMetricData` is *"[SPECULATIVE] … a plausible pattern, not an AWS-official one"*; comparison table row `vLLM Prometheus /metrics → SageMaker: 'No (bridge out-of-band)'` | Superseded **2026-06-18** (11 days after authoring) by *"Amazon SageMaker AI Announces New observability capability For Inference Endpoints"*: *"real-time visibility into inference performance metrics, such as **Time to First Token, inter-token latency, queue depth, and tokens per second**"*, diagnosis of *"GPU saturation, **KV cache exhaustion**, or slow scaling operations"*, a SageMaker AI Insights dashboard in CloudWatch, metrics *"published automatically, no instrumentation required"*, plus a regional PromQL endpoint and a pre-configured Grafana template. The gap the section builds an argument around has been closed first-party. | **STALE (HIGH)** — argument now inverted |
| `AwsSageMakerBedrock.tsx:1024` | *"enhanced per-GPU / per-container metrics (March 2026)"* | Directionally consistent with the enhanced-metrics blog; superseded in scope by the 2026-06-18 observability launch above | **OK (superseded)** |
| `AwsSageMakerBedrock.tsx:1067` | Streaming: *"Native SSE + bidi HTTP/2 (Nov 2025)"* | AWS What's New, Nov 2025: *"Amazon SageMaker AI Inference now supports bidirectional streaming"* — *"The client opens an HTTP2 connection to the SageMaker AI runtime"* | **OK** |
| `AwsSageMakerBedrock.tsx:898-903` | Scale-to-zero is Inference-Component-only; plain variant endpoints cannot; `MinInstanceCount: 0` + `ManagedInstanceScaling`; scale-out driven by `NoCapacityInvocationFailures` step policy; cold start **~5-6 minutes** | AWS ML blog: *"Scale down to zero is only supported when using inference components"*; `"MinInstanceCount": 0`; `"ManagedInstanceScaling": {"Status": "ENABLED"}`; `NoCapacityInvocationFailures` triggers the step policy; measured totals **5.028 min** (Llama 3.1 8B) and **6.002 min** (Llama 3.1 70B) | **OK** (5-6 min is exact) |
| `AwsSageMakerBedrock.tsx:698` | LMI **v20 (2026-02-09)**, vLLM **0.15.1**, tag `0.36.0-lmi20.0.0-cu128-v1.0` | DJL LMI release notes: V20, 2-9-2026, *"vLLM has been upgraded to 0.15.1"*, tag `0.36.0-lmi20.0.0-cu128-v1.0` | **OK** |
| `AwsSageMakerBedrock.tsx:699-701` | v19 → vLLM 0.14.0; v18 → 0.12.0; v17 → 0.11.1 | V19 (2-2-2026) 0.14.0; V18 (12-15-2025) 0.12.0; V17 (9-30-2025) 0.11.1 | **OK** |
| `AwsSageMakerBedrock.tsx:486-487` | LMI **v17 (September 2025)** made async mode the default; `OPTION_ASYNC_MODE=true` with `OPTION_ENTRYPOINT=djl_python.lmi_vllm.vllm_async_service` | V17 released 9-30-2025 ✓. v20 remains the newest LMI, so the table is **not** stale. | **OK** |
| `AwsSageMakerBedrock.tsx:705` | ECR account `763104351884`, repo `djl-inference`; LMI-bundled vLLM lags upstream | Account/repo correct. "Lags upstream" is strongly supported: LMI v20 ships vLLM 0.15.1 while the AWS EKS DLC ships **0.21.0**. | **OK** |
| `AwsSageMakerBedrock.tsx:864-872` | vLLM does not natively honour `X-Amzn-SageMaker-Session-Id` for cross-request KV reuse; open RFC | GitHub `vllm-project/vllm#28163` — *"[RFC]: SageMaker Day-0 Compatibility with vLLM"*, **open**, explicitly covers `X-Amzn-SageMaker-Session-Id` and *"efficient KV cache reuse across requests"* | **OK** |
| `AwsSageMakerBedrock.tsx:1236-1240` | fused_moe_lora: *"454% OTPS … and 87% lower TTFT"* for GPT-OSS 20B; AWS tuning adds *"19% higher Output Tokens Per Second"* and *"8% lower Time To First Token"* vs vLLM 0.15.0 | Blog verbatim: *"454% OTPS improvements and 87% lower TTFT for GPT-OSS 20B in vLLM 0.15.0 vs vLLM 0.11.1rc3"*; *"19% higher Output Tokens Per Second (OTPS)"*; *"8% lower Time To First Token (TTFT) for GPT-OSS 20B"* | **OK** |
| `AwsSageMakerBedrock.tsx:1254-1259` | P-EAGLE: all K draft tokens in one forward pass; in vLLM from **0.16.0**; `"parallel_drafting": true`; **up to 1.69x** over EAGLE-3 at concurrency 1, tapering higher | Blog: vLLM 0.16.0+ (PR #32887); `"parallel_drafting": true`; SPEED-Bench 1.69x, MT-Bench 1.55x, HumanEval 1.55x — all peaking at concurrency 1 on one NVIDIA B200 | **OK** |
| `AwsSageMakerBedrock.tsx:1274-1277` | *"every percentage and multiplier above is [Tier-2 / blog-claimed] by AWS, measured on **AWS-chosen hardware (NVIDIA B200)** and models (GPT-OSS 20B/120B, Qwen3-Coder 30B)"* | B200 is correct for **P-EAGLE only**. The fused_moe_lora benchmarks ran on an **H200** (1600 input tokens, 600 output, LoRA rank 32, 8 adapters in parallel). The model list (GPT-OSS 20B/120B, Qwen3-Coder 30B) matches P-EAGLE's published heads. The blanket "measured on … B200" mis-attributes the 454% / 87% / 19% / 8% figures to the wrong accelerator, inside the very paragraph whose purpose is tier discipline. | **WRONG (hardware)** |
| `AwsSageMakerBedrock.tsx:1062` | Spot for inference — EKS: *"Yes (+Karpenter, ~60-70% off)"* | EKS Best Practices: AI/ML Compute states Spot Instances *"are available at **up to a 90% discount** compared to On-Demand prices."* The ~60-70% figure carries no citation and undershoots the only Tier-1 number on the page the neighbouring rows draw from. | **UNSUP / INCONSIST** |
| `AwsSageMakerBedrock.tsx:1061,1085` | Cost vs EC2: SageMaker *"~15-40% premium"* | Explicitly labelled `[Tier-3, verify]` inline and re-flagged at 1085. No first-party figure exists. Correct handling of an unsourceable number. | **OK (self-flagged)** |
| `AwsSageMakerBedrock.tsx:675-686` | LMI config defaults table: `OPTION_MAX_ROLLING_BATCH_SIZE` 256, `OPTION_DTYPE` fp16, `OPTION_MODEL_LOADING_TIMEOUT` 1800 s, etc. | Individual default values not verified against the DJL configuration reference in this pass. Column is headed "Default / example", which blurs whether each value is a default or an illustration. | **UNSUP (unchecked)** |
| `AwsSageMakerBedrock.tsx:838-849` | `VolumeSizeInGB` >= 180 GB for a 70B FP16 (~140 GB); `ModelDataDownloadTimeoutInSeconds` >= 1800 for >40 GB; `ContainerStartupHealthCheckTimeoutInSeconds` >= 1800 | Directional sizing guidance, not a documented threshold set. The 140 GB / 180 GB arithmetic is sound (70B x 2 bytes = 140 GB, plus headroom). Cited to the SageMaker large-model-inference-hosting page but the specific numbers were not located there. | **UNSUP (heuristic)** |
| `AwsSageMakerBedrock.tsx:953-962` | HyperPod inference is EKS-only (Slurm flavour is training-only); tiered KV cache L1 CPU / L2 managed; KEDA + Karpenter; `minReplicaCount: 0` | Consistent with the cited HyperPod model-deployment docs; not line-by-line re-verified | **OK (spot-checked)** |
| `AwsSageMakerBedrock.tsx:920-933` | Autoscaling metrics: `SageMakerVariantInvocationsPerInstance` 60 s; `…ConcurrentRequestsPerModelHighResolution` 10 s; `…InferenceComponentConcurrentRequestsPerCopyHighResolution` 10 s; *"~6x faster scale-out"* | Metric names and 10 s / 60 s resolutions match the AWS faster-autoscaling blog (Tier-2, labelled). The "~6x" is blog-claimed and labelled. | **OK** |

---

## Answers to the brief's remaining questions

**"Any EC2 On-Demand price."** None exists in these files. Nothing to correct. The stale-price failure mode
did not reproduce.

**"Any SageMaker or Bedrock pricing."** None. `AwsSageMakerBedrock.tsx` discusses per-token vs amortised-instance
economics qualitatively (`:1184-1201`) and routes every concrete number to
`https://aws.amazon.com/bedrock/` (`:1207-1211`). No rate is hard-coded.

**"Any claim about which instance types support a feature."** Three checked, all correct: the 3-vs-4
network-node instance lists (`Ec2TopologyPlacement.tsx:527,538`), NIXL-over-EFA on all EFA-enabled types
(`AwsGpuEfaNixl.tsx:357`), and NxDI on Trn2/Trn3 only (`AwsNeuron.tsx:234`). The one instance-support claim
that is *wrong by omission* is the Karpenter placement-group gap in `AwsEks.tsx` — see HIGH-1.

**"Any 'as of' or version-pinned statement."** Five found. Two are now stale (EFA installer 1.48.0 → 1.49.0;
Neuron 2.30.0 → 2.31.0), one is a stale citation URL (`docs.vllm.ai/en/v0.10.1/…`), one is a redirected doc
URL (EKS quickstart, x5 occurrences), and one is still current (LMI v20 / vLLM 0.15.1).

**"Any EFA or instance bandwidth number."** Four checked. Three confirmed against Tier-1 (p5 32 cards /
3,200 Gbps; P6-B300 6,400 Gbps; g6e.4xlarge 20 Gbps). One (p5en 16 network cards) has **no locatable Tier-1
source** and is marked UNKNOWN — `efa-acc-inst-types.html` has no P5en section.

**"Has any claimed AWS service behaviour changed since 2026-06-07?"** Yes, three times:

1. **SageMaker inference observability** (2026-06-18) — closes the vLLM-metrics gap the section argues
   around. HIGH.
2. **Karpenter `placementGroupSelector`** — GA in the v1.14 `EC2NodeClass`; invalidates the "placement-group
   gap" architecture in `AwsEks.tsx`. HIGH. (Not date-stamped by Karpenter, but the docs now describe it as
   generally available with no feature gate.)
3. **EFA installer 1.49.0** — the NIXL guide's pinned download moved from 1.48.0. LOW.

---

## Recommended fixes, in priority order

1. `AwsEks.tsx:104-105,183,412-433,713` — rewrite the "placement-group gap" alert. Karpenter can place nodes
   into a pre-created cluster placement group via `spec.placementGroupSelector` on `EC2NodeClass` (name or id;
   cluster/partition/spread). The remaining true constraint is that the placement group must be created out of
   band (Terraform/CDK/CLI), not that Karpenter is unusable for the multi-node EFA tier.
2. `AwsSageMakerBedrock.tsx:1037-1047,1065` — replace the "not surfaced" claim and the `[SPECULATIVE]`
   `PutMetricData` bridge with the 2026-06-18 SageMaker AI Inference observability capability (TTFT,
   inter-token latency, queue depth, tokens/sec, KV-cache diagnostics, PromQL endpoint, Grafana template).
   Update the comparison-table row from `'No (bridge out-of-band)'`.
3. `AwsSageMakerBedrock.tsx:803,827-828` — real-time endpoint payload is **25 MB**, not 6 MB. Drop the
   inverted 6 MB / 25 MB streaming split.
4. `AwsSageMakerBedrock.tsx:1274-1277` — split the hardware attribution: fused_moe_lora on **H200**,
   P-EAGLE on **B200**.
5. `AwsGpuEfaNixl.tsx:330` — EFA installer **1.49.0**. `AwsNeuron.tsx:282` — Neuron **2.31.0 (2026-07-07)**.
6. `AwsEks.tsx:466-467,474-482` — either use the guide's `consolidateAfter: 60m` for the
   interruption-sensitive rationale, or drop the best-practices attribution for the 300s value.
7. `AwsSageMakerBedrock.tsx:1062` — cite the Tier-1 "up to 90%" Spot discount or drop "~60-70% off".
8. `AwsGpuEfaNixl.tsx` — resolve the Tier-1/Tier-2 split labelling of the NIXL What's New announcement
   (5 inline `[Tier-2]` vs the Tier-1 Sources block).
9. `Ec2TopologyPlacement.tsx:256,283` — "exactly one tool" / "Six mechanisms" contradicts the file's own
   `DescribeCapacityReservationTopology` coverage at `:580`. Promote it into the table, or soften the count.
10. `Ec2TopologyPlacement.tsx:523-547` — add the leaf-index warning: the bottom-layer node is `nodes[-1]`,
    never `nodes[2]`, because `p6-b200.48xlarge` and `p6-b300.48xlarge` return four nodes.
11. `AwsNeuron.tsx:325` — repoint `docs.vllm.ai/en/v0.10.1/…` to `/en/latest/`.
12. `AwsEks.tsx:196,263,641,693,740` — update the EKS quickstart URL to `ml-inference-load-serve-model.html`.
13. `AwsGpuEfaNixl.tsx:28` — either source the p5en 16-network-card figure to Tier-1 or mark it UNKNOWN.

---

## Tier-1 sources consulted

- EC2 User Guide: placement strategies; Capacity Blocks for ML; prerequisites for EC2 topology; how EC2
  topology works; `DescribeInstanceTopology` API reference; get started with EFA and NIXL (all 14 steps);
  maximize network bandwidth with multiple network cards.
- EKS User Guide: Load & Serve Models on Amazon EKS (vLLM quickstart, post-redirect); EKS Best Practices:
  AI/ML Compute (full page, all sections).
- SageMaker Developer Guide: Model Hosting FAQs; invoke a serverless endpoint;
  `InvokeEndpointWithResponseStream` API reference.
- AWS What's New: NIXL with EFA (2026-03-19); SageMaker AI Inference bidirectional streaming (2025-11);
  SageMaker AI inference observability (2026-06-18).
- AWS Neuron docs: Neuron What's New (release train through 2.31.0); NxD Inference release notes.
- DJL Serving: LMI release notes (V15-V20).
- Karpenter v1.14: `EC2NodeClass` concepts / `spec.placementGroupSelector`.
- `vllm-project/vllm` issue #28163.
- Tier-2, used only where the section already labels it Tier-2: AWS ML blogs for llm-d disaggregation,
  vLLM DLCs on EKS, Rufus on Trainium, scale-down-to-zero, fused_moe_lora, P-EAGLE.
