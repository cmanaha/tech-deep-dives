# 2026-10 refresh: integrations (03)

Accessed/read date for every verification below: 2026-10-23.
Scope: EKS (EFA device plugin, aws-dranet, EKS AMI, Bottlerocket, Karpenter, Auto Mode,
NVIDIA device plugin, sample repos), EC2 topology API (DescribeInstanceTopology,
DescribeCapacityReservationTopology), SageMaker (training jobs, HyperPod, inference,
SMDDP, SDK, DLC), capacity (ODCR, Capacity Blocks for ML, placement groups).
Page files: deep-dives/efa/src/sections/EKSIntegration.tsx, SageMaker.tsx, TopologyApi.tsx,
plus capacity / placement-group claims in other sections.
Network hygiene: no personal data sent in any request (gh with default auth, curl default UA).

STATUS: COMPLETE (see last line)

## Per-area findings (appended as each sub-area completes)

### 1A. EKS device layer (EFA device plugin chart, aws-dranet, EKS user guide, Karpenter DRA) — checkpoint 1

Raw evidence (all read 2026-10-23):

- aws/eks-charts `stable/aws-efa-k8s-device-plugin`: four commits since the pin. Newest
  `ab081b33b8a1f6627e699d4aa48e43d73d138bce` (2026-09-15, "add latest EFA instance types #1364").
  Chart.yaml at new SHA: `version: v0.5.33`, `appVersion: "v0.5.21-eksbuild.13"` (was v0.5.30 / v0.5.20).
  Diff old..new touches only Chart.yaml, README.md, values.yaml (image tag + 4 allowlist entries:
  r9g.48xlarge, r9g.metal-48xl, r9gd.48xlarge, r9gd.metal-48xl). templates/daemonset.yaml unchanged:
  Auto Mode `eks.amazonaws.com/compute-type NotIn auto` still L60-L63, `hostNetwork: true` still L64.
  Allowlist size at new SHA: 308 list lines under supportedInstanceLabels (page says "roughly 300": still fine).
  Allowlist includes p5.48xlarge, p5.4xlarge, p5e, p5en, p6-b200, p6-b300, p6e-gb200.36xlarge, p6e-gb300.36xlarge.
- aws/eks-charts `stable/aws-dranet`: still exactly one commit, `c043cef46c7e` (2026-04-30); chart 1.0.0,
  image `v1.2.0-eksbuild.2`. Unchanged. DRANET_CHART_SHA stays.
- kubernetes-sigs/dranet upstream releases: v1.3.0 (2026-05-28), v1.4.0 (2026-07-17), **v1.5.0 (2026-10-03)**.
  The page's "two upstream minors behind" is now three.
- EKS user guide source (awsdocs/amazon-eks-user-guide, `latest/ug/ml/device-management-efa.adoc`) changed
  2026-08-03 in commit `ede1f91d7dbc937f66b99adfcaac42a996169661`, after the page's 2026-08-01 access.
  The LIVE page (https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html, fetched 2026-10-23)
  is newer than that repo commit. Live text, verbatim:
  - "We recommend using DRA drivers for new deployments with Kubernetes versions 1.34 and later on Karpenter,
    EKS managed node groups, or self-managed nodes. Karpenter supports DRA with both dynamic and static capacity
    provisioning as of Karpenter version 1.15, though dynamic provisioning requires enabling Karpenter feature
    gates. ... DRA is not currently supported with EKS Auto Mode."
  - Comparison table, EKS Compute row: DRA = "Karpenter, managed node groups, self-managed nodes";
    plugin = "EKS Auto Mode, Karpenter, managed node groups, self-managed nodes".
  - EKS-optimized AMIs row: "AL2023, Bottlerocket" for both (was "AL2023 (NVIDIA, Neuron), Bottlerocket").
  - DRA prerequisites still say "static capacity provisioned by Karpenter" (internal inconsistency with the
    intro paragraph; the intro is the newer text).
  - Coexistence warning now gives the consequence: "Doing so can cause silent oversubscription of the
    underlying devices to multiple pods on the same node."
  - "Using EKS-optimized AMIs with EFA" now reads "The EKS-optimized AL2023 AMIs and all Bottlerocket AMIs
    include the host-level components" (the word "accelerated" was dropped; matches the code finding that
    standard AL2023 variants also carry efa).
  - NVIDIA DRA on Bottlerocket: "To use the NVIDIA DRA driver on Bottlerocket, you must first disable the NVIDIA
    device plugin that is bundled with the Bottlerocket NVIDIA variants, which requires Bottlerocket version
    1.63.0 or later."
  - eksctl: "You cannot use eksctl's efaEnabled setting to create nodes with efa-only interfaces, because
    efaEnabled configures every interface as type efa. Use a NodeClass, an EC2NodeClass, or a launch template
    instead". The older sentence ("If you need to customize the per-device EFA configuration when using eksctl,
    it is recommended to use eksctl's support for launch templates") is still present too.
  - Unchanged and still verbatim on the live page: efaEnabled creates EFA-type interfaces + EFA security group +
    installs the device plugin; SG must allow all in/out to itself; "Do not specify SubnetId in the launch
    template when using EKS managed node groups"; WARM_ENI_TARGET/WARM_IP_TARGET cluster-wide; p5.48xlarge
    "four EFA devices that share the same PCIe root with one GPU"; allocationMode ExactCount default / All;
    MOFED v0.19.0 paragraph and "EKS Auto Mode does not enable MOFED by default".
- Karpenter (aws/karpenter-provider-aws) **v1.15.0, released 2026-10-10**: release notes list
  "nvidia and efa driver dra support (#9550)" and "add aws specific feature gates implementation with
  --aws-feature-gates flag (#9482)".
  - `pkg/operator/options/options.go` @v1.15.0 L78: `--aws-feature-gates` / `AWS_FEATURE_GATES` default
    `"NodeClassCEL=false,DRANVIDIAGPU=false,DRAEFA=false,RebootForRepair=false"`; struct fields L42-L43.
  - `charts/karpenter/values.yaml` @v1.15.0 L216-L219: `settings.enableDRA: false`, "enableDRA is ALPHA and is
    disabled by default. Setting this to true will enable every AWS DRA driver feature gate
    (awsFeatureGates.draNVIDIAGPU and awsFeatureGates.draEFA) and set ignoreDRARequests to false";
    L282-L286 `awsFeatureGates.draEFA: null` ("ALPHA ... disabled by default").
  - `website/content/en/preview/tasks/dra.md` @v1.15.0 (in-repo doc, orientation tier):
    L29-L30 "Static NodePools launch nodes without simulating pods ... DRA does not require explicit Karpenter
    support for static NodePools."; L89 aws-dranet needs a `nvidia.com/gpu` NoSchedule toleration on tainted GPU
    nodes ("The DaemonSet doesn't tolerate the nvidia.com/gpu taint by default"); L188 "each of the eight GPUs in a
    p5.48xlarge shares a PCIe root with four EFAs"; L191 "Configuring spec.networkInterfaces on an EC2NodeClass
    used for EFA DRA workloads is currently unsupported and results in undefined behavior. Leave it unset.";
    L340-L370 keep DRA and device-plugin NodePools apart by node label.
  - `pkg/providers/drametadata/zz_generated_efa_metadata.go` @v1.15.0 L449 onward: p5.48xlarge `Count: 32`,
    devices on 8 pcieRoots (pci0000:44, 55, 66, 77, 88, 99, aa, bb), exactly 4 per root.
    `zz_generated_gpu_metadata.go` @v1.15.0 L1806: p5.48xlarge 8 GPUs, one on each of the same 8 roots.
    => The "8 x 4 = 32 is our inference" alert can be upgraded: AWS-maintained code now encodes 8 roots x 4 EFA
    for p5.48xlarge (code-derived, scraped metadata), and the Karpenter doc states it.
    Same table: p5e.48xlarge 32 EFA, p5en.48xlarge 16, p6-b200.48xlarge 8, p6-b300.48xlarge 16 (all 8 GPUs).

### 1B. EKS AMI, Bottlerocket, NVIDIA device plugin — checkpoint 2

- awslabs/amazon-eks-ami: `templates/al2023/provisioners/install-efa.sh` has NOT changed since the pin
  `ac5f340c` (2026-07-08). At main HEAD `9c99e21e6d07a733596b85d197a065815603e5f0` (read 2026-10-23) the cited
  lines are identical: L6 `if [ "$ENABLE_EFA" != "true" ]`, L14 `EFA_VERSION="latest"`, L53
  `sudo ./efa_installer.sh --minimal -y`, L63-L64 erase efa-nv-peermem on non-NVIDIA. AMI_SHA can stay.
- `templates/al2023/variables-default.json` was REMOVED at HEAD by `cc8976736809c76f909be882d021edbb0af3b0b5`
  (2026-09-08, "Use Hashicorp's HCL2 for the AL2023 Template"). Replacement file
  `templates/al2023/variables-default.pkrvars.hcl` @HEAD L11 `enable_efa = "true"`; per-version files
  `variables-1.34.pkrvars.hcl` / `variables-1.35.pkrvars.hcl` carry only `source_ami_filter_name`. Claim
  ("enable_efa true with no per-Kubernetes-version override") still holds. The old citation at ac5f340 L17 still
  resolves (pinned SHA), so the pin can stay; if moved, use the .pkrvars.hcl path.
- **NVIDIA driver variable renamed**: `be7adc2e0c06b72b14d45390846f5593e85787cd` (2026-09-15, "feat(nvidia): dual
  nvidia driver versions in a single AMI (#2819)"). At HEAD, template.pkr.hcl L125/L129 declare
  `nvidia_driver_lts_version` and `nvidia_driver_pb_version`; variables-default.pkrvars.hcl L18-L19 default
  580 / 595. `nvidia_driver_major_version` no longer exists (it existed at ac5f340: template.json L31,
  variables-default.json L24 = "580"). The Makefile @HEAD L94-L95 only forwards make variables whose names
  appear in the Packer template, so `nvidia_driver_major_version=580` on the page's make line is now silently
  dropped. doc/usage/al2023.md @HEAD L34-L35: lts and pb "Must be set together"; L70 "default to major
  versions 580 and 595". Makefile L26-L27 error text example is `k8s=1.35`.
- EKS AMI release **v20261019** (published 2026-10-21): efa row `3.3.0-1.amzn2023` with colspan=5 (all five AL2023
  variants: x86_64 NVIDIA, NEURON, STANDARD, arm64 NVIDIA, STANDARD) for every K8s minor 1.31 to 1.37.
  Release ships Kubernetes 1.37 and 1.36 AMIs on kernel 6.18; 1.33-1.35 on 6.12.
  (v20260728's 3.1.0 row is still true at that tag; the "AL2023 lands EFA driver 3.1.0" comparison is stale.)
- Bottlerocket: current OS release **v1.67.0** (2026-10-13) Twoliter.toml pins kernel-kit **9.4.1**, core-kit
  **17.2.0**. (The page's pins 7.2.1 / 15.0.0 are exactly what Bottlerocket v1.64.0 shipped.)
  - kernel-kit `packages/kmod-6.18-efa/kmod-6.18-efa.spec` @v9.4.1 (identical at v9.6.0): L1
    `%global efa_installer_ver 1.49.0`, L8 `Version: 3.0.0`, L15 Source0 installer tarball, L28-L29 extract
    `efa-*.rpm` driver sources. Bump commit `2bce339135f195aa12766b7fb30ba0ca13272fcc` (2026-08-17,
    "kmod-6.18-efa: update to v1.49.0"), first tag containing it v9.0.0. The RPM `Version:` label was not
    bumped, so the package says 3.0.0 while the sources come from installer 1.49.0, whose EFA driver is 3.1.0
    (EFA changelog per 01-software-stack.md; and EKS AMI v20260728 built from 1.49.0 shows efa 3.1.0).
    [code-derived inference: the compiled module is the 1.49.0 driver source; the label is stale]
    Also packages kmod-6.1-efa and kmod-6.12-efa exist.
  - core-kit `packages/rdma-core/rdma-core.spec` @v17.2.0: `Version: 65.0` (was 60.1 at v15.0.0); provider
    strip block "Exclude specific RDMA providers (keeping only libefa)" now L119-L136 (unused libs L111-L117).
    Claim "strips every provider except libefa" still true.
- NVIDIA k8s-device-plugin: **MOFED default reverted.** Releases: v0.19.1 (04-23), v0.19.2 (05-27),
  **v0.19.3 (2026-06-22)**, v0.20.0 (08-19), v0.20.1 (09-22).
  `cmd/nvidia-device-plugin/main.go`: `Value: true` present at v0.19.0 L118, v0.19.1 L118, v0.19.2 L118; absent
  at v0.19.3 L114-L118, v0.20.0 L115-L119, v0.20.1 L115-L119 (Go zero value false). Revert commit
  `2ffedc34b7a8b4c79e2c8afd1c4197826b032052` (2026-06-10, "revert default enablement of features mofed, gdrcopy
  and mofed (#1837)"); v0.19.3 release notes list it. Helm values @v0.20.1 L38 `mofedEnabled: null`.
  CDI append still present @v0.20.1 internal/cdi/cdi.go L170-L172.
  The live EKS doc still says "Starting with NVIDIA k8s-device-plugin v0.19.0, the --mofed-enabled flag
  defaults to true" with no upper bound => doc-code conflict. Affected window is v0.19.0-v0.19.2 only.
- NVIDIA container toolkit: latest v1.20.1 (2026-09-19). `internal/discover/mofed.go` @v1.20.1 L25-L35 unchanged
  (globs `/dev/infiniband/uverbs*` L30 and `/dev/infiniband/rdma_cm` L31). CTK_TAG may move to v1.20.1 with
  the same line range L25-L36 (or L25-L35).

### 1C. EKS docs restructure, Auto Mode, hugepages — checkpoint 3

- `https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html` now returns **HTTP 301 to
  device-management-efa.html** (curl -I, 2026-10-23). The "Run machine learning training on Amazon EKS with EFA"
  page no longer exists as a separate page; every `docs.eksNode` citation now lands on the device management page.
  (The awsdocs GitHub source still has `latest/ug/ml/node-efa.adoc` with v0.5.6 / 1.7.10 / nr_hugepages, but the
  repo was last pushed 2026-09-16 and the live site has moved past it, so the repo is not the current doc.)
- Live merged page, NCCL test walkthrough: "Each worker requests all eight GPUs, all EFA devices, and
  hugepages-2Mi on its node, so each worker consumes an entire instance." and "The vpc.amazonaws.com/efa: 32
  request claims all EFA devices on a p5.48xlarge. On the EKS-optimized AL2023 accelerated AMIs, the device plugin
  aligns the allocated EFA devices with their topologically-local GPUs automatically." => the documentation
  contradiction the page describes (narrates 4 per worker, YAML says 32) is gone.
  Also new: a DRA variant of the NCCL MPIJob ("Because each worker in this test consumes a whole node, the
  template requests every EFA device and every GPU with allocationMode: All and omits a topology constraint");
  "Use the same mechanism for GPUs that you use for EFA: DRA claims for both, or device plugin resources for
  both."; mpirun line now exports NCCL_TUNER_PLUGIN=/opt/amazon/ofi-nccl/lib/x86_64-linux-gnu/libnccl-ofi-tuner.so,
  NCCL_BUFFSIZE=8388608, NCCL_P2P_NET_CHUNKSIZE=524288.
- Still on the live page: "You can assign up to one EFA per network card, and an EFA counts as a network
  interface"; "pre-allocate 5128 pages of 2 MiB, which you request as hugepages-2Mi resources"; Kubeflow MPI
  Operator for the NCCL tests (wording now "runs Allreduce-style distributed jobs ... through the MPIJob custom
  resource", the "recommend" verb is gone); network card 0 cannot be efa-only; VPC CNI 1.18.5 for efa-only.
- NOT on the live docs any more: device plugin v0.5.6 floor for P6-B200, VPC CNI 1.7.10 floor, eksctl 0.215.0 floor,
  Bottlerocket 1.28.0 EFA floor, "Bottlerocket ... vm.nr_hugepages by sysctl". (`ml-hugepages.html`, the new
  "Configure hugepages in Amazon EKS clusters" page, does not mention Bottlerocket or EFA's 5128.)
- Bottlerocket now has a first-class hugepages settings API: CHANGELOG @v1.67.0 L130, v1.64.0 (2026-07-27)
  "Add support for static and transparent hugepages" (bottlerocket-core-kit#952; corndog hugepages.rs). Bottlerocket
  v1.66.0 (2026-09-18): "Add opt-in NVIDIA GPU DRA support for Kubernetes 1.34-1.37 NVIDIA variants"; v1.64.0
  "Add setting to enable/disable nvidia-device-plugin". Exact TOML key names not verified at a pinned tag.
- EKS Auto Mode NodeClass (`create-node-class.html`, live 2026-10-23; source commits 2026-09-09): all four
  placement-group behaviours on the page are still verbatim (AZ pinning race, spread 7-instance limit with drift
  blocked, consolidation can move pods unless nodeSelector on eks.amazonaws.com/placement-group-id, deleted PG =>
  nodes drifted and running indefinitely). Static interface constraints (primary must be `interface`, IP/prefix
  counts only on card 0, no IPv6, no public IP with >1 interface, no post-launch IPs/ENIs) unchanged.
  NEW: `advancedCompute.hugepages` on the Auto Mode NodeClass (static 2Mi/1Gi `pages`, and `transparent`), plus
  kubelet and sysctl settings; `capacityReservationSelectorTerms` "Selects on-demand capacity reservations and
  capacity blocks for EKS Auto Mode to prioritize". Auto Mode still has no DRA ("DRA is not currently supported
  with EKS Auto Mode").
- `ml-eks-optimized-ami.html` live: AL2023 NVIDIA AMI component list now includes "NVIDIA GDRCopy driver" and
  "EFA minimal (kernel module and rdma-core)" => AWS now documents the --minimal split the page derived from code
  (upgrade to code-confirmed). GPU Operator rule and per-generation custom AMI advice are unchanged. "When using
  EFA with the EKS-optimized AL2023 or Bottlerocket NVIDIA AMIs, you must install the EFA device plugin separately."
- Karpenter `EC2NodeClass.spec.networkInterfaces`: commit 1de6d8c6 (2026-04-01) is in v1.11.0 (published
  2026-04-06) and not in v1.10.0: "added in v1.11" CORRECT. designs/efa-for-static-capacity.md unchanged since
  1de6d8c6, so KARPENTER_SHA can stay for the design-doc citation.

- Repo states: aws-samples/aws-efa-eks archived=true, pushed_at 2024-10-15T19:59:27Z (unchanged). The live
  device-management-efa page no longer contains any link to aws-efa-eks (0 matches); it links the NCCL tests to
  "awsome-distributed-training" (old name; GitHub resolves to awslabs/awsome-distributed-ai, not archived).
- EC2 `efa-acc-inst-types.html` live: p5/p5e 32 cards, 3,200 Gbps total, up to 800 Gbps IP, shared; use case 1
  "up to 3200 Gbps ... EFA and up to 100 Gbps of IP ... with one private IP address"; use case 2 "up to 800 Gbps of
  IP ... with 8 private IP address. You can't auto-assign public IP addresses"; P6-B200 8 GPUs, 8 network cards;
  P6-B300 "8 GPUs and 17 network cards, where the primary network card supports only an ENA network interface".
  All page claims sourced here CORRECT.

## EKS claim register (sub-area 1)

File: deep-dives/efa/src/sections/EKSIntegration.tsx. Evidence read 2026-10-23.

| ID | Claim (as on page, short) | Location | Verdict | Evidence (tier) | Replacement text / fact |
|---|---|---|---|---|---|
| E1 | AWS recommends DRA for 1.34+ with MNG/self-managed and sends Karpenter + Auto Mode to the device plugin, "since the EFA DRA driver is not supported with either" | EKSIntegration.tsx:1038-1042 | STALE | Live https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html (Tier 1); karpenter-provider-aws v1.15.0 release notes "nvidia and efa driver dra support (#9550)" (Tier 1 code release) | "AWS recommends the DRA driver for new deployments on Kubernetes 1.34 or later on Karpenter, managed node groups or self-managed nodes. Karpenter supports it for both static and dynamic provisioning from v1.15, with dynamic provisioning behind feature gates. EKS Auto Mode does not support DRA, so Auto Mode clusters stay on the device plugin." Note: the doc's own prerequisites line still says "static capacity provisioned by Karpenter"; the intro sentence is the newer text. |
| E2 | Comparison table row "EKS compute": DRA = "Managed node groups, self-managed nodes" | EKSIntegration.tsx:611-615 | STALE | same live doc table (Tier 1) | DRA: "Karpenter (v1.15+), managed node groups, self-managed nodes". Plugin row unchanged. |
| E3 | Alert: "The Auto Mode half is enforced by the charts. The Karpenter half is a support statement" ... "Enforce that half yourself" | EKSIntegration.tsx:1060-1064 | STALE | Auto Mode NotIn clause still in both charts (efa chart @ab081b33 daemonset.yaml L60-L63; aws-dranet @c043cef L33-L66) (Tier 1 code); Karpenter now supports DRA (E1) | Keep the Auto Mode half (still code-enforced). Replace the Karpenter half with the new constraint: on Karpenter, keep DRA and device-plugin nodes apart with separate NodePool labels, because the chart has no clause that does it for you (Karpenter docs @v1.15.0 website/content/en/preview/tasks/dra.md L340-L370, orientation tier). |
| E4 | Node-lane diagram chips: Karpenter "AWS says no DRA driver here." | EKSIntegration.tsx:448 | STALE | as E1 | e.g. "DRA from v1.15, behind a feature gate." Auto Mode chip L454 "AWS says no DRA driver here either" stays CORRECT. |
| E5 | Device plugin "at version v0.5.30 with app version v0.5.20" as of pinned chart commit | EKSIntegration.tsx:1083-1085 | STALE (pin moves) | aws/eks-charts @ab081b33b8a1f6627e699d4aa48e43d73d138bce stable/aws-efa-k8s-device-plugin/Chart.yaml L4-L5 (Tier 1 code) | "chart version v0.5.33 with app version v0.5.21-eksbuild.13" |
| E6 | Allowlist of roughly 300 instance types; DaemonSet healthy with zero pods on unlisted types | EKSIntegration.tsx:1118-1121 | CORRECT | values.yaml @ab081b33: 308 entries (Tier 1 code) | none; r9g/r9gd added 2026-09-15 shows the list keeps moving |
| E7 | Same affinity block excludes Auto Mode; DaemonSet sets hostNetwork: true (L60-L64) | EKSIntegration.tsx:1124-1127, 140 | CORRECT | daemonset.yaml unchanged between bfe91c4b and ab081b33; L60-L64 (Tier 1 code) | none |
| E8 | aws-dranet chart: one commit, 2026-04-30, chart 1.0.0, image v1.2.0-eksbuild.2 | EKSIntegration.tsx:1164-1166 | CORRECT | aws/eks-charts commits?path=stable/aws-dranet => only c043cef46c7e (Tier 1 code) | none |
| E9 | "Upstream kubernetes-sigs/dranet has since released v1.3.0 and v1.4.0" / header "two upstream minors behind" | EKSIntegration.tsx:1163, 1166-1167 | STALE | kubernetes-sigs/dranet releases: v1.5.0 published 2026-10-03 (Tier 1 code release) | "has since released v1.3.0, v1.4.0 and v1.5.0"; header "three upstream minors behind" |
| E10 | ResourceSlices under driver dra.net, DeviceClass efa.networking.k8s.aws | EKSIntegration.tsx:~1155-1160 | CORRECT | live doc + Karpenter dra.md @v1.15.0 L91 (Tier 1) | none |
| E11 | "The two cannot coexist: do not install the EFA DRA driver on nodes where the EFA device plugin is running" | EKSIntegration.tsx:1040-1042 | CORRECT, consequence NEW | live doc: "Doing so can cause silent oversubscription of the underlying devices to multiple pods on the same node." (Tier 1) | add the stated consequence: silent oversubscription of devices to multiple pods |
| E12 | p5.48xlarge 4 EFA share a PCIe root with one GPU; allocationMode All; ExactCount default | EKSIntegration.tsx:~1201-1207 | CORRECT | live doc (Tier 1) | none |
| E13 | Alert "8 times 4 equals 32 is our inference ... AWS never enumerates how many such groups a p5.48xlarge has" | EKSIntegration.tsx:1214-1222 | STALE | karpenter-provider-aws @v1.15.0 pkg/providers/drametadata/zz_generated_efa_metadata.go L449-L773 (p5.48xlarge Count 32, 8 pcieRoots x 4) and zz_generated_gpu_metadata.go L1806-L1914 (8 GPUs, one per same root) (Tier 1 code); website/content/en/preview/tasks/dra.md L188 "each of the eight GPUs in a p5.48xlarge shares a PCIe root with four EFAs" (in-repo doc) | Re-label as code-derived from AWS-maintained Karpenter metadata: 8 PCIe roots, each 1 GPU + 4 EFA = 32. Keep "AWS EC2 docs do not state it" only if scoped to EC2/EKS docs. |
| E14 | "AWS documentation contains a genuine internal contradiction: the NCCL walkthrough narrates each worker requesting four EFAs while the YAML requests 32" | EKSIntegration.tsx:1223-1227 | WRONG (now) | node-efa.html 301 -> device-management-efa.html; walkthrough now: "Each worker requests all eight GPUs, all EFA devices ... consumes an entire instance" and "The vpc.amazonaws.com/efa: 32 request claims all EFA devices on a p5.48xlarge" (Tier 1) | Delete the contradiction paragraph. |
| E15 | `docs.eksNode` citation: "EKS User Guide: Run machine learning training on Amazon EKS with EFA", node-efa.html | EKSIntegration.tsx:70-74 | STALE | curl -I: HTTP 301 Location device-management-efa.html (Tier 1) | Repoint every eksNode citation to device-management-efa.html, or drop the claims it alone supported (E16, E17). |
| E16 | Version floors: plugin v0.5.6 for P6-B200; VPC CNI 1.7.10 for multi-EFA; eksctl 0.215.0; Bottlerocket 1.28.0 | EKSIntegration.tsx:1133-1137 (and code comment L668) | UNKNOWN (source removed) | live merged page carries only "Amazon VPC CNI version 1.18.5 or later is required" for efa-only (Tier 1). Floors survive only in the stale GitHub .adoc. | Keep only VPC CNI 1.18.5 for efa-only with the live citation; drop the rest or re-source them. All four are far below current releases (plugin v0.5.21, Bottlerocket 1.67.0), so dropping costs the reader nothing. |
| E17 | "Bottlerocket pre-allocates nothing, so you set vm.nr_hugepages by sysctl in node user data instead" | EKSIntegration.tsx:1371-1372 | UNKNOWN (source removed) + NEW | live docs silent; Bottlerocket CHANGELOG @v1.67.0 L130: v1.64.0 "Add support for static and transparent hugepages" (Tier 1 code) | "Bottlerocket 1.64.0 and later configure static huge pages through the kernel hugepages settings rather than a raw sysctl" (exact setting keys still to verify at a tag). Whether Bottlerocket pre-allocates for EFA: no source located. |
| E18 | EC2 instances with the EFA driver pre-allocate 5128 2MiB huge pages | EKSIntegration.tsx:1367-1369 | CORRECT (citation moves) | live device-management-efa: "pre-allocate 5128 pages of 2 MiB" (Tier 1) | repoint citation |
| E19 | "AWS recommends the Kubeflow MPI Operator for NCCL tests" / "AWS uses the Kubeflow MPI Operator for its NCCL test walkthrough" | EKSIntegration.tsx:1515-1516, 1377-1378 | CORRECT (wording) | live doc: "Step 1: Deploy the Kubeflow MPI Operator ... runs Allreduce-style distributed jobs ... through the MPIJob custom resource" (Tier 1) | "recommends" is no longer the doc's verb; "AWS uses" (L1377) is exact. Reword L1515 to "AWS's NCCL test walkthrough deploys the Kubeflow MPI Operator". |
| E20 | AMI runs `sudo ./efa_installer.sh --minimal -y` at L53; guard L6-L8; peermem erase L63-L65 | EKSIntegration.tsx:731-734, 812-816 | CORRECT, now also documented | install-efa.sh unchanged since ac5f340 (HEAD 9c99e21e L6, L53, L63-L64) (Tier 1 code); ml-eks-optimized-ami.html lists "EFA minimal (kernel module and rdma-core)" (Tier 1 doc) | Upgrade provenance to code-confirmed by citing ml-eks-optimized-ami. |
| E21 | enable_efa default true, no per-version override (variables-default.json L17) | EKSIntegration.tsx:735-736, 131 | CORRECT (file renamed at HEAD) | HEAD 9c99e21e templates/al2023/variables-default.pkrvars.hcl L11 `enable_efa = "true"`; variables-1.34/1.35.pkrvars.hcl hold only source_ami_filter_name (Tier 1 code) | Pin can stay at ac5f340; if moved, new path is variables-default.pkrvars.hcl L11. |
| E22 | "Release v20260728 ... efa package row reads 3.1.0-1.amzn2023 across all five AL2023 variants" ; diagram row "efa kernel driver (efa-3.1.0-1.amzn2023)" | EKSIntegration.tsx:736-738, 341 | STALE | release v20261019: efa `3.3.0-1.amzn2023` colspan=5 for K8s 1.31-1.37 (Tier 1 artifact) | "Release v20261019 ... efa 3.3.0-1.amzn2023 across all five AL2023 variants"; diagram "efa-3.3.0-1.amzn2023". |
| E23 | "AL2023 ... lands EFA driver 3.1.0, while the Bottlerocket kernel module spec pins installer 1.47.0 and builds version 3.0.0"; "downloads a pinned 1.47.0 tarball" | EKSIntegration.tsx:794-803 | STALE | kernel-kit @v9.4.1 (shipped in Bottlerocket v1.67.0 per Twoliter.toml) kmod-6.18-efa.spec L1 `efa_installer_ver 1.49.0`, L8 `Version: 3.0.0` (Tier 1 code); EKS AMI v20261019 efa 3.3.0 | "AL2023 pulls the latest installer at build time and lands EFA driver 3.3.0 (installer 1.50.0). The Bottlerocket kernel module spec pins installer 1.49.0, whose driver source is 3.1.0, while its RPM Version field still reads 3.0.0." The independence point gets stronger: two minor versions apart. |
| E24 | Bottlerocket builds its own rdma-core and strips every provider except libefa | EKSIntegration.tsx:803-805, 138 | CORRECT (pin moves) | core-kit @v17.2.0 packages/rdma-core/rdma-core.spec L119-L136 (Tier 1 code); rdma-core now 65.0 | none |
| E25 | Doc says "AL2023 accelerated AMIs and all Bottlerocket AMIs include the host-level components" (doc-code conflict quote) | EKSIntegration.tsx:785-792 | STALE (quote) | live doc now: "The EKS-optimized AL2023 AMIs and all Bottlerocket AMIs include the host-level components ... installed by the aws-efa-installer" (Tier 1) | drop "accelerated" from the quoted doc text; the Bottlerocket conflict itself still stands. |
| E26 | Rebuild command `make k8s=1.36 ... nvidia_driver_major_version=580 enable_efa=true` | EKSIntegration.tsx:826-830 | WRONG (now) | amazon-eks-ami be7adc2e (2026-09-15, dual NVIDIA drivers #2819); HEAD template.pkr.hcl L125, L129; Makefile L94-L95 forwards only declared vars; doc/usage/al2023.md L34-L35, L68-L70 (Tier 1 code) | `make k8s=1.36 os_distro=al2023 enable_accelerator=nvidia enable_efa=true` (drivers default to 580 lts / 595 pb; override with nvidia_driver_lts_version and nvidia_driver_pb_version, set together). `nvidia_driver_major_version` is silently ignored now. |
| E27 | MOFED: "starting with v0.19.0, --mofed-enabled defaults to true" (doc) + code v0.19.0 explicit true, v0.18.2 zero value | EKSIntegration.tsx:1388-1407 | STALE (doc-code conflict) | NVIDIA/k8s-device-plugin main.go: `Value: true` at v0.19.0/v0.19.1/v0.19.2 L118; absent at v0.19.3 L114-L118, v0.20.0 L115-L119, v0.20.1 L115-L119; revert 2ffedc34 (#1837), v0.19.3 release notes (Tier 1 code); live EKS doc still says v0.19.0+ defaults true (Tier 1 doc) | "v0.19.0 to v0.19.2 default --mofed-enabled to true. v0.19.3 (June 2026) reverted it, and v0.20.x defaults to false. The EKS documentation still describes the v0.19.0 behaviour without an upper bound. Set mofedEnabled=false anyway: it costs nothing and protects any cluster pinned to v0.19.0-v0.19.2." H2 description (L1388) needs the same reframing. |
| E28 | mofed discoverer injects uverbs* and rdma_cm | EKSIntegration.tsx:1408-1411, 156 | CORRECT | nvidia-container-toolkit @v1.20.1 internal/discover/mofed.go L25-L35 (globs L30-L31) (Tier 1 code) | none (CTK pin may move to v1.20.1) |
| E29 | "EKS Auto Mode does not enable MOFED by default and is unaffected" (docs.eksNvidia) | EKSIntegration.tsx:1416-1418 | CORRECT (citation moves) | sentence now lives on device-management-efa.html; device-management-nvidia.html is a short hub page with no MOFED text (Tier 1) | repoint to device-management-efa.html |
| E30 | GPU Operator must not install driver/toolkit on AL2023 NVIDIA AMIs | EKSIntegration.tsx:1433-1436 | CORRECT | ml-eks-optimized-ami.html live (Tier 1) | none |
| E31 | Layer cake: Bottlerocket NVIDIA carries the device plugin; on AL2023 NVIDIA you install device plugin + DRA driver yourself | EKSIntegration.tsx:711-714 | CORRECT, NEW nuance | ml-eks-optimized-ami.html; device-management-efa: NVIDIA DRA on Bottlerocket requires disabling the bundled plugin, Bottlerocket 1.63.0+; Bottlerocket CHANGELOG v1.66.0 "opt-in NVIDIA GPU DRA support for Kubernetes 1.34-1.37" (Tier 1) | optional: "Bottlerocket 1.63.0+ can turn its bundled plugin off to run the NVIDIA DRA driver instead." |
| E32 | eksctl: "You cannot use eksctl to create nodes and node groups that use EFA-only interfaces" | EKSIntegration.tsx:884-888 | STALE (wording) | live doc: "You cannot use eksctl's efaEnabled setting to create nodes with efa-only interfaces, because efaEnabled configures every interface as type efa. Use a NodeClass, an EC2NodeClass, or a launch template instead" (Tier 1) | narrow to "eksctl's efaEnabled setting cannot create efa-only interfaces, because it makes every interface type efa". |
| E33 | Do not specify SubnetId in launch template with MNG; card 0 cannot be efa-only | EKSIntegration.tsx:893-897 | CORRECT | live doc (Tier 1) | none |
| E34 | Karpenter two modes (dynamic all-EFA vs static networkInterfaces) + design doc caveats + placementGroupSelector | EKSIntegration.tsx:905-930 | CORRECT, NEW caveat | live doc; design doc unchanged since 1de6d8c6 (Tier 1); Karpenter dra.md @v1.15.0 L191: "Configuring spec.networkInterfaces on an EC2NodeClass used for EFA DRA workloads is currently unsupported and results in undefined behavior. Leave it unset." | add: with Karpenter DRA, leave networkInterfaces unset. |
| E35 | "EC2NodeClass.spec.networkInterfaces, added in v1.11" | EKSIntegration.tsx:905, 448 | CORRECT | commit 1de6d8c6 in v1.11.0 (2026-04-06), not in v1.10.0 (Tier 1 code) | none |
| E36 | Auto Mode static interface constraints and four placement-group edge cases | EKSIntegration.tsx:~932-955 | CORRECT | live create-node-class.html (Tier 1) | none |
| E37 | Security group self-referencing; placement group recommended not required (efa-start quote) | EKSIntegration.tsx:~858-873 | CORRECT (EKS half) | live device-management-efa (Tier 1). efa-start quote not re-fetched here (owned by 01/core agent). | none |
| E38 | WARM_IP_TARGET / WARM_ENI_TARGET cluster-wide, no per node group | EKSIntegration.tsx:~1003-1012 | CORRECT | live doc (Tier 1) | none |
| E39 | p5/p5e 32 cards, 3,200 Gbps, 800 IP, layouts 100 Gbps/1 IP and 800 Gbps/8 IPs; p6-b200 8; p6-b300 17 cards primary ENA-only => 16 | EKSIntegration.tsx:~962-990, 1103-1107 | CORRECT | live efa-acc-inst-types.html (Tier 1) | none |
| E40 | "AWS documentation still links there [aws-efa-eks] for the device plugin" | EKSIntegration.tsx:~1471 | STALE | live device-management-efa.html: 0 occurrences of aws-efa-eks (Tier 1) | delete the sentence; keep "archived, last push 2024-10-15" (still true). |
| E41 | Batch MNP is ECS-only (NodeProperties shape doc); NodeRangeProperty still carries a generic eksProperties member | EKSIntegration.tsx:1482-1496 | CORRECT | botocore 1.43.62 and 1.43.118 botocore/data/batch/2016-08-10/service-2.json: NodeProperties note "Node properties can't be specified for Amazon EKS based job definitions." identical; NodeRangeProperty members identical incl. eksProperties with the same generic doc (Tier 1 code/model) | none; BOTOCORE_TAG may move to 1.43.118 with no text change |

### 2A. EC2 topology API — checkpoint 4

- botocore EC2 model diff, `botocore/data/ec2/2016-11-15/service-2.json` at tag **1.43.62** vs **1.43.118** (newest
  tag on 2026-10-23), walking every shape reachable from DescribeInstanceTopology and
  DescribeCapacityReservationTopology (script: /tmp/r03/scripts/topo_diff.py):
  - Operations unchanged. InstanceTopology members unchanged (InstanceId, InstanceType, GroupName, NetworkNodes,
    AvailabilityZone, ZoneId, CapacityBlockId). CapacityReservationTopology members unchanged
    (CapacityReservationId, CapacityBlockId, State, InstanceType, GroupName, NetworkNodes, AvailabilityZoneId,
    AvailabilityZone). No new field, no new filter, no new level.
  - DescribeInstanceTopologyMaxResults min 1 max 100; DescribeCapacityReservationTopologyMaxResults min 1 max 10
    (unchanged).
  - **Only change**: DescribeCapacityReservationTopologyRequest.CapacityReservationIds documentation, 1.43.62
    "Constraints: Maximum 100 explicitly specified Capacity Reservation IDs." -> 1.43.118 "Maximum 10".
    The live AWS CLI reference (generated from this model) now also reads "Maximum 10 explicitly specified
    Capacity Reservation IDs" (fetched 2026-10-23). The page's "CLI reference states 100" conflict is resolved.
  - NetworkNodes docs unchanged: "The nodes are hashed based on your account. Instances from different accounts
    running under the same server will return a different hashed list of strings." null/empty when type
    unsupported or not running. CapacityBlockId "only supported for UltraServer instances". Eventual-consistency
    note about null capacityBlockId still on both operations.
- EC2 User Guide `ec2-instance-topology-prerequisites.html` live 2026-10-23: 3-node list unchanged (g6e.*,
  g7e.*, hpc6a.48xlarge, hpc6id.32xlarge, hpc7g.*, hpc7a.*, hpc8a.96xlarge, p3dn, p4d, p4de, p5.48xlarge, p5e, p5en,
  p6e-gb200.36xlarge, trn1.2xlarge, trn1.32xlarge, trn1n, trn2.48xlarge, trn2u.48xlarge); 4-node list unchanged
  (p6-b200.48xlarge, p6-b300.48xlarge). p6e-gb300 and p5.4xlarge are NOT listed. CR topology still "not supported in
  Israel (Tel Aviv) and AWS GovCloud (US-West)". Region list now also names "AWS European Sovereign Cloud
  (Germany)".
- `how-ec2-instance-topology-works.html`: "Some instance types comprise 4 network nodes ... others ... 3";
  "Depending on the type of Capacity Reservation, you might see only 1, 2, or 3 network nodes"; prefix rule
  ("If the instance is in a Capacity Reservation, the first nodes will match the corresponding Capacity
  Reservation topology, followed by additional nodes"); examples still render `"CapacityBlockId": "null"`.
- `ec2-instance-topology-examples.html`: still "paginated, with up to 20 instances or Capacity Reservations per
  page by default. You can specify up to 100 ... using the --max-results parameter" (conflicts with the CR API's
  max 10), and still writes `--capacity-reservation-id` (singular). Those two conflicts remain.

### 2B. Topology labels on EKS, Karpenter — checkpoint 5

- **NEW EKS User Guide page** `https://docs.aws.amazon.com/eks/latest/userguide/ml-workload-topology.html`
  ("Place distributed AI/ML workloads with network topology labels", live 2026-10-23), verbatim:
  "The AWS cloud controller manager, which Amazon EKS runs in the cluster control plane, calls
  DescribeInstanceTopology when a node registers and writes one label per network node in the response, numbered
  from the top of the hierarchy down. Because the control plane does this, the labels do not depend on how you
  provisioned the node. They are applied to EKS managed node group nodes, self-managed nodes, Karpenter nodes, and
  EKS Auto Mode nodes alike, with no add-on to install and no IAM permission for you to grant."
  Also: layer-4 "Present only on instance types whose topology has four layers. On those types, this is the bottom
  layer."; "The labels are set once, at registration ... does not refresh them afterward"; "In an unsupported AWS
  Region, no node receives these labels"; families table 3-layer (g6e, g7e, hpc6a, hpc6id, hpc7a, hpc7g, hpc8a, p3dn,
  p4d, p4de, p5, p5e, p5en, p6e-gb200, trn1, trn1n, trn2, trn2u) vs 4-layer (p6-b200, p6-b300);
  "Topology placement is a best-effort optimization, not a guarantee of bandwidth ... For a guarantee that the
  instances of a job are placed together, reserve them together with a Capacity Block or a cluster placement group.";
  "Pair topology placement with gang scheduling".
  `create-node-pool.html` (Auto Mode well-known labels) now says "EKS Auto Mode nodes also carry ... the
  topology.k8s.aws/network-node-layer-* labels on supported instance types", and lists topology.k8s.aws/zone-id.
- Code confirms it: kubernetes/cloud-provider-aws **v1.37.0** (2026-09-01)
  `pkg/providers/v1/well_known_labels.go` L22 `LabelZoneID = "topology.k8s.aws/zone-id"`, L26
  `LabelNetworkNodePrefix = "topology.k8s.aws/network-node-layer-"`; `pkg/providers/v1/instances_v2.go` L95-L117:
  skips if `network-node-layer-1` already set, else calls GetNodeTopology and writes one label per returned
  NetworkNodes entry (`layer := index + 1`), i.e. depth-agnostic; `pkg/providers/v1/topology.go` L87-L133:
  DescribeInstanceTopology with the single instance ID, handles UnsupportedOperation / UnauthorizedOperation by
  backing off for the Region, L43 default "require a response" pattern `^(hpc|trn|p)[0-9]+...`. The label constant
  already existed at v1.34.3, so this behaviour predates the August read; the August page simply lacked the doc.
- Karpenter v1.15.0 full source tarball (codeload, tag v1.15.0): zero files contain `network-node-layer`,
  `DescribeInstanceTopology` or `DescribeCapacityReservationTopology`. "Karpenter neither calls the topology API nor
  emits these labels" still true at v1.15.0 (labels come from the CCM, not Karpenter).

- HyperPod task governance page (live 2026-10-23,
  https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-tasks-scheduling.html):
  label list is now `network-node-layer-1` through `network-node-layer-4` plus `ultraserver-id`; TAS requires
  "HyperPod task governance is v1.2.2-eksbuild.1 or higher"; supported ml. types: p3dn, p4d, p4de, p5, p5e, p5en,
  p6e-gb200, p6-b300, trn1.2xlarge, trn1.32xlarge, trn1n, trn2, trn2u (no ml.p6-b200 listed). The section
  "Topology-aware scheduling with Karpenter" still reads "TAS is not supported with Karpenter autoscaling. TAS is
  enabled by default ... disable TAS" with the kueue-manager-config steps; adds "The controller restart takes
  approximately 20 seconds ... You do not need to delete and resubmit jobs."
- HyperPod Slurm topology page (sagemaker-hyperpod-topology.html): automatic plugin selection, topology.yaml on
  Slurm 25.11+, topology.conf on 24.x, BlockSizes=18 example, --segment / --exclusive=topo, flat default for mixed
  clusters: all still present. Supported families sentence now names G6e, G7e, P4d, P4de, P5, P5e, P5en, P6e-GB200,
  Trn1, Trn1n, Trn2.
- aws/aws-ofi-nccl `contrib/scripts/topology_aware/hostfile-topologify.py` L110-L114 identical at v1.20.0 and
  v1.21.1 (still `NetworkNodes[1]` / `NetworkNodes[2]`, comment "NetworkNodes[2] (layer iii) is the bottom layer").
  The doc-code conflict on 4-layer types still stands at the newest release.
- aws-samples/ec2-topology-aware-for-slurm HEAD = 57abd4d9 (pin), aws-samples/sample-rlinf-on-eks HEAD = c8b5e3a3
  (pin). Pins unchanged.

## Topology claim register (sub-area 2)

File: deep-dives/efa/src/sections/TopologyApi.tsx.

| ID | Claim (short) | Location | Verdict | Evidence (tier) | Replacement text / fact |
|---|---|---|---|---|---|
| T1 | 3-node list (G6e, G7e, Hpc6a/6id/7g/7a/8a, p3dn, p4d, p4de, p5, p5e, p5en, p6e-gb200, Trn1/1n/2/2u) | TopologyApi.tsx:607-613 | CORRECT | ec2-instance-topology-prerequisites.html live (Tier 1) | none |
| T2 | 4-node: p6-b200.48xlarge and p6-b300.48xlarge only | TopologyApi.tsx:618-624 | CORRECT | same (Tier 1); EKS ml-workload-topology.html table (Tier 1) | none |
| T3 | aws-ofi-nccl sorter hard-codes NetworkNodes[1]/[2]; wrong on 4-layer types; impact unmeasured | TopologyApi.tsx:643-662 | CORRECT (pin may move) | hostfile-topologify.py L110-L114 identical at v1.21.1 (Tier 1 code) | none; pin can move to v1.21.1 with same lines if 01 agent moves aws-ofi-nccl |
| T4 | p6e-gb200 depth stated two ways (EC2 prereq 3 vs Containers blog layer-1..4) | TopologyApi.tsx:686-715, 1401-1404 | CORRECT, strengthened | EKS ml-workload-topology.html now also places p6e-gb200 in the three-layer row with bottom layer network-node-layer-3 (Tier 1) | "Two Tier 1 pages (EC2 prerequisites, EKS topology labels) say three layers; only the Tier 2 blog implies four." Advice (read depth at run time) unchanged. |
| T5 | All InstanceTopology fields optional; NetworkNodes null/empty if unsupported or not running | TopologyApi.tsx:803, ~880-886 | CORRECT | botocore 1.43.118 InstanceTopology docs unchanged (Tier 1 code/model) | none |
| T6 | Node IDs are per-account hashes | TopologyApi.tsx:846-860 | CORRECT | botocore 1.43.118 NetworkNodes doc; EKS ml-workload-topology "hashed for each AWS account ... cannot be compared across accounts" (Tier 1) | none |
| T7 | Absent Capacity Block rendered as string "null" in every AWS example | TopologyApi.tsx:871-877 | CORRECT | how-it-works (6) and examples (19) occurrences of `"CapacityBlockId": "null"` (Tier 1) | none |
| T8 | capacityBlockId UltraServer only, may be null right after launch | TopologyApi.tsx:887-894 | CORRECT | botocore 1.43.118 operation docs (Tier 1) | none |
| T9 | MaxResults caps at 100, InstanceId.N caps at 100 | TopologyApi.tsx:896-899 | CORRECT | DescribeInstanceTopologyMaxResults max 100 (Tier 1 model) | none |
| T10 | Throttle defaults UNKNOWN | TopologyApi.tsx:921-929 | NOT RE-CHECKED (UNKNOWN stays) | no new source located | none |
| T11 | CR topology: 1, 2 or 3 nodes; prefix guarantee | TopologyApi.tsx:966-985 | CORRECT | how-it-works live (Tier 1) | none |
| T12 | zoneId vs availabilityZoneId rename | TopologyApi.tsx:1007-1010 | CORRECT | botocore 1.43.118 shapes (Tier 1) | none |
| T13 | CR topology not in Tel Aviv or GovCloud (US-West) | TopologyApi.tsx:1018-1022 | CORRECT | prerequisites live (Tier 1) | none |
| T14 | "AWS states the reservation limit three ways on three pages": API ref 10; CLI ref 100; examples 20/100 | TopologyApi.tsx:1026-1050 | STALE | botocore 1.43.62 said "Maximum 100"; 1.43.118 says "Maximum 10"; live CLI reference now "Maximum 10 explicitly specified Capacity Reservation IDs" (Tier 1) | Drop the CLI-100 leg: "The API reference and the CLI reference both state a maximum of 10 reservation IDs and a MaxResults range of 1 to 10. The User Guide examples page still says 20 by default and up to 100 per page for both APIs." Heading becomes "two ways on two pages". Advice (chunk in tens) unchanged. |
| T15 | CLI synopsis plural vs User Guide singular flag | TopologyApi.tsx:1062-1066 | CORRECT | examples page still writes `--capacity-reservation-id` (Tier 1) | none |
| T16 | HyperPod task governance applies ... network-node-layer-1 through -3 and ultraserver-id | TopologyApi.tsx:1213-1216 | STALE (minor) | task governance page now lists layer-1 to layer-4 plus ultraserver-id (Tier 1) | "network-node-layer-1 through -4 (layer-4 only on four-layer types)" |
| T17 | TAS not supported with Karpenter autoscaling; disable via kueue-manager-config | TopologyApi.tsx:1255-1263 | CORRECT | task governance page live (Tier 1) | none |
| T18 | "A search of the full aws/karpenter-provider-aws v1.14.0 release for network-node-layer returns zero" ; Karpenter neither calls the API nor emits labels | TopologyApi.tsx:1265-1270, 191-196 | CORRECT (pin moves) | v1.15.0 tarball: zero hits for network-node-layer / DescribeInstanceTopology / DescribeCapacityReservationTopology (Tier 1 code) | update ref to v1.15.0 |
| T19 | "The EKS well-known label tables for Auto Mode and self-managed Karpenter list ... with no network node layer" | TopologyApi.tsx:1269-1273 | STALE | create-node-pool.html: "EKS Auto Mode nodes also carry ... the topology.k8s.aws/network-node-layer-* labels on supported instance types" (Tier 1) | "Karpenter does not emit them, but every EKS node of a supported type gets them anyway, from the cloud controller manager in the EKS control plane." |
| T20 | "Does EKS label every supported type, or only P6e-GB200? AWS says both ... No EKS User Guide page ... was located. Until one exists, treat automatic labelling as verified for HyperPod task governance and for P6e-GB200" | TopologyApi.tsx:1310-1340, 1401-1404 | STALE (resolved) | EKS ml-workload-topology.html (Tier 1 doc) + kubernetes/cloud-provider-aws v1.37.0 instances_v2.go L95-L117, well_known_labels.go L26 (Tier 1 code) => code-confirmed | "EKS labels every node of a supported instance type, whatever provisioned it (managed node groups, self-managed, Karpenter, Auto Mode). The AWS cloud controller manager in the EKS control plane calls DescribeInstanceTopology at registration and writes one network-node-layer-N label per returned node, depth-agnostic, once. No add-on, no IAM grant. Unsupported Region => no labels." Remove the "two open contradictions" second leg. |
| T21 | Labeler DaemonSet as "portable fallback ... for clusters outside HyperPod task governance and P6e-GB200" | TopologyApi.tsx:1283-1308 | STALE (scope) | as T20 | Rescope to non-EKS Kubernetes on EC2 (or self-run CCM without the label code); on EKS it is redundant. The labels are set once at registration, so a DaemonSet is also not a refresh mechanism. |
| T22 | topology.k8s.aws/zone-id published in EKS label docs | TopologyApi.tsx:1217-1220 | CORRECT | create-node-pool.html: "topology.k8s.aws/zone-id use2-az1 ... identifies the same physical zone in every AWS account"; CCM well_known_labels.go L22 (Tier 1) | none |

### 3A. SageMaker training jobs, SDK allowlist, endpoints — checkpoint 6

- botocore SageMaker model `botocore/data/sagemaker/2017-07-24/service-2.json`, 1.43.62 vs 1.43.118
  (script /tmp/r03/scripts/sm_diff.py):
  - ProductionVariant: no members added or removed; still no EFA field. ProductionVariantInferenceAmiVersion enum
    unchanged (5 values). ProductionVariantInstanceType enum unchanged (277).
  - ClusterNetworkInterface, InstancePlacementConfig, ClusterInstanceGroupSpecification: unchanged.
    InstancePlacementConfig doc still "Only applicable for UltraServer capacity."
  - **ResourceConfig gained `InstancePreferences`, `SelectedInstanceCount`, `SelectedInstanceType`.**
    InstancePreferences doc: "An ordered list of ML compute instance types for the training job, in priority order.
    SageMaker launches the training job on the first instance type in the list that has available capacity ...
    Exactly one instance type is selected for the job." "mutually exclusive with InstanceType, InstanceGroups,
    InstancePlacementConfig, and EnableManagedSpotTraining, and supports only Flexible Training Plans (FTP) and
    On-Demand capacity."
  - TrainingInstanceType enum 145 -> 225 (adds c7i-flex, c8i(-flex), m7i-flex, m8i(-flex), r6i, r8i(-flex), and
    **ml.g7.2xlarge..48xlarge**). No new P or Trn type. ClusterInstanceType 201 -> 209 (adds ml.g7.*, ml.c8a.16xlarge,
    ml.m8a.16xlarge).
  - `AdditionalEnis.EfaEnis` exists in both versions but is reachable only from InstanceMetadata (cluster event
    metadata) and InstanceRequirementsEniConfiguration, not from CreateTrainingJob or ProductionVariant.
- aws/sagemaker-python-sdk: master HEAD `510e390ac82743075036ce887536390829f44026` (2026-10-23); releases v3.27.0
  (2026-10-21), v3.24.0 (2026-10-07), v2.257.7 (2026-10-07).
  **Allowlist changed**: commit `d0abf3263c413e7aad7c774d3c0054a2c8726fdd` (2026-10-06, "fix: Add ml.p5e.48xlarge and
  ml.p5.48xlarge to EFA instance lists (#5492)"), first released in v3.24.0. Same edit in four files
  (sagemaker-train container_drivers/common/utils.py, sagemaker-core modules/train/container_drivers/common/utils.py,
  and both remote_function bootstrap_runtime_environment.py). At v3.27.0
  `sagemaker-train/src/sagemaker/train/container_drivers/common/utils.py`:
  L46-L56 SM_EFA_NCCL_INSTANCES = g4dn.8xlarge, g4dn.12xlarge, g5.48xlarge, p3dn, p4d, p4de, **p5, p5e**, trn1.32xlarge;
  L58-L64 SM_EFA_RDMA_INSTANCES = p4d, p4de, **p5, p5e**, trn1.32xlarge.
  Still absent from both: p5en, p6-b200, p6-b300, p6e-gb200, trn2, g6e, g7e (and the new ml.g7).
  torchrun_driver.py @v3.27.0 L56-L64 (was L51-L63); mpi_utils.py @v3.27.0 L284-L291 (was L283-L290). Logic unchanged.
- SMDDP list in v2 SDK: `src/sagemaker/fw_utils.py` L85-L91 identical at v2.257.0 and v2.257.7 (p3.16xlarge, p3dn,
  p4d, p4de, local_gpu).

### 3B. DLC, SMDDP/SMP, HyperPod — checkpoint 7

- aws/deep-learning-containers main HEAD `f6bed33af5a829fccdca760f2011466e245090d0` (read 2026-10-23).
  **EFA no longer pinned**: `66e28a8dcb` (2026-10-09, "float efa to latest in the cu132 base (#6847)") and
  `bede711904` (2026-10-05, "... move non-base images to efa latest ..."). At HEAD:
  - docker/base/cu132/Dockerfile L130 `ARG NCCL_VERSION="2.29.7-1"`, L131-L132 "# Resolved at build time; the
    installer logs the version it landed on." `ARG EFA_VERSION="latest"`; GDRCopy 2.6 (L34) userspace only, L165
    "GDRCopy userspace library (kernel module is provided by the host)". The old comment "EFA installer 1.49.0 vends
    libfabric 2.4.0amzn5.0 and aws-ofi-nccl 1.20.0" is gone.
  - .github/config/image/pytorch/2.13-sagemaker-cuda.yml L20-L30: cuda 13.3.0, torch 2.13.0, deepspeed 0.19.2,
    transformer_engine 2.17.0, nccl 2.30.7-1, **nccl_tests_version v2.20.0** (new), **efa_version "latest"**,
    gdrcopy 2.6 (flash_attn line no longer present in the grep window).
  - scripts/docker/common/install_efa_amzn2023.sh: L6-L13 plugin path branch (L7 now treats "latest" as >=1.44.0),
    L37-L46 --disable-ngc gate (L44 treats "latest" as >=1.48.0), L48 `./efa_installer.sh -y --skip-kmod
    --skip-limit-conf --no-verify ${EFA_EXTRA_ARGS}`, **L49-L50 new: logs the landed version from
    /opt/amazon/efa_installed_packages**, L61-L62 /etc/nccl.conf NCCL_DEBUG=INFO, NCCL_SOCKET_IFNAME=^docker0,lo.
  - docker/pytorch/Dockerfile.cuda: libcudart symlink L170-L172 (was L161-L164); nccl-tests block L182-L204, now
    built from tag `${NCCL_TESTS_VERSION}` instead of master (was L171-L182); LD_LIBRARY_PATH L320-L322 (was
    L287-L289).
  - test/efa/scripts/nccl_allreduce.sh and test/efa/test_efa.py unchanged since May/June 2026: RDMA arg for p4d,
    p4de, p5.48xlarge; four grep signatures; GDRDMA only on p4d*/p5*; PERFORMANCE_THRESHOLD="3".
- SMDDP / SMP (live 2026-10-23):
  - data-parallel-release-notes.html: newest entry still SMDDP v2.5.0, October 17, 2024.
  - model-parallel-release-notes.html: entries SMP **v2.8.0 (April 01, 2025)**, v2.7.0 (December 04, 2024), v2.6.1
    (October 31, 2024), v2.6.0 (October 17, 2024). v2.8.0 text: "Upgraded SMDDP library to 2.6.0", pre-installed
    "The SMDDP library v2.6.0", "EFA v1.36.0", "AWS-OFI-NCCL v1.13.2", PyTorch 2.5.1, CUDA 12.4.
    => the page's "latest SMP release is v2.6.0, dated the same day" is wrong, and SMDDP has a v2.6.0 that the SMDDP
    release notes page does not list (doc-doc conflict). No SMDDP/SMP release dated after April 2025 was located.
  - distributed-data-parallel-support.html: still ml.p3dn.24xlarge*, ml.p4d.24xlarge, ml.p4de.24xlarge; P3
    discontinued; AllGather P4 only; TensorFlow >2.11.0 not available.
  - distributed-training-get-started.html: still "to achieve the most performant distributed training job in
    SageMaker AI, we recommend P4d and P4de instances equipped with NVIDIA A100 GPUs".
- your-algorithms-training-efa.html: still the fi_info check (provider efa, domain efa_0-rdm, FI_EP_RDM,
  FI_PROTO_EFA); no instance list on that page.
- HyperPod Slurm AMI releases (sagemaker-hyperpod-release-ami-slurm.html): newest release **September 17, 2026**:
  Slurm 25.11 variants (x86_64 and ARM64) on **EFA installer 1.50.0**, rdma-core 64.0, NVIDIA driver 595.91.07,
  CUDA default 13.2, Slurm 25.11.8, kernel 6.8.0-1063-aws; the "Default" Ubuntu 22.04 and new Ubuntu 24.04 (kernel
  6.17.0-1020-aws) variants still list EFA installer 1.47.0. Releases Apr 23 - Aug 29, 2026 all EFA 1.47.0.
  The May 27, 2026 "Known issue: auto-resume on Slurm 25.11 ... A fix is under investigation." is still present;
  no fix entry found.
- HyperPod EKS AMI support policy: unchanged (1.0.x-1.3.x, all EFA installer 1.47.0, NVIDIA 580.x, CUDA 12.8,
  kernel 6.1.x; 1.x supported until January 2027; windows 12/6 months/next patch; custom AMIs excluded).
- HyperPod EKS prerequisites: unchanged (K8s 1.30-1.35, VPC CNI 1.18.3+, only CNI, private subnets). Note: EKS now
  ships 1.36 and 1.37 AMIs, HyperPod still stops at 1.35, so the DRA path (1.34+) is available only on 1.34-1.35.
- DPD: unchanged (ml.p5, p5e, p5en, p6-b200, p6-b300; Inference Operator 3.2+; LMCache 0.4.3, vLLM 0.19.0, NIXL 1.0.0).
- Deep health checks: EFA latency/bandwidth on GPU and Trainium; StartClusterHealthCheck; flexible-group scoping
  rules: unchanged. Cluster metrics: EFA Exporter under advanced mode: unchanged. Training cluster repair: up to 10
  times, not billed: unchanged.

## SageMaker claim register (sub-area 3)

File: deep-dives/efa/src/sections/SageMaker.tsx.

| ID | Claim (short) | Location | Verdict | Evidence (tier) | Replacement text / fact |
|---|---|---|---|---|---|
| S1 | SDK allowlist "stopped growing at P5"; table: p5 NCCL yes / RDMA no, p5e no / no; code block shows the two lists | SageMaker.tsx:731, 650-651, 811-826 | STALE | aws/sagemaker-python-sdk v3.27.0 sagemaker-train/src/sagemaker/train/container_drivers/common/utils.py L46-L64; change d0abf326 (#5492), first in v3.24.0 (2026-10-07) (Tier 1 code) | Lists now: NCCL = g4dn.8xl, g4dn.12xl, g5.48xl, p3dn, p4d, p4de, p5, p5e, trn1.32xl; RDMA = p4d, p4de, p5, p5e, trn1.32xl. Table rows: p5 yes/yes, p5e yes/yes (SDK v3.24.0+). Intro: "a hardcoded allowlist that stopped at P5e" (and note SDK versions before v3.24.0 behave as before). |
| S2 | Gate 3 diagram: "Silently skipped for: P5e, P5en, P6-B200, P6-B300, P6e-GB200, Trn2, G6e and G7e. P5 misses the RDMA list only." | SageMaker.tsx:450-451 | STALE | same (Tier 1 code) | "Silently skipped for: P5en, P6-B200, P6-B300, P6e-GB200, Trn2, G6e, G7e and G7." (drop the P5 line for SDK v3.24.0+) |
| S3 | Alert "On ml.p5e.48xlarge, ml.p5en ... the SDK driver leaves the settings ... unset" | SageMaker.tsx:858-861 | STALE | same | remove ml.p5e from the list; add ml.g7 if desired |
| S4 | ExpandableSection "On P5, two AWS-owned repositories disagree about FI_EFA_USE_DEVICE_RDMA" | SageMaker.tsx:868-885 | STALE (resolved at SDK v3.24.0) | SDK v3.24.0+ RDMA list includes ml.p5.48xlarge (Tier 1 code); DLC nccl_allreduce.sh still sets RDMA for p5.48xlarge | Either delete, or reduce to "SDK releases before v3.24.0 (October 2026) omit P5 from the RDMA list; v3.24.0 and later set FI_EFA_USE_DEVICE_RDMA=1 and RDMAV_FORK_SAFE=1 on P5 and P5e." |
| S5 | Getting started step 1: "On ml.p5.48xlarge expect FI_PROVIDER to be set and FI_EFA_USE_DEVICE_RDMA to be left to you. On anything newer, expect to set both yourself." | SageMaker.tsx:1679-1681 | STALE | same | "On ml.p5.48xlarge and ml.p5e.48xlarge, SDK v3.24.0 or later sets both. On P5en and anything newer, set both yourself." |
| S6 | torchrun driver sets FI_PROVIDER on list 1, FI_EFA_USE_DEVICE_RDMA + RDMAV_FORK_SAFE on list 2, always NCCL_SOCKET_IFNAME and NCCL_PROTO; mpirun builds same -x flags | SageMaker.tsx:~829-835 | CORRECT (pin moves) | torchrun_driver.py @v3.27.0 L56-L64; mpi_utils.py @v3.27.0 L284-L291 (Tier 1 code) | none |
| S7 | ResourceConfig members: count, groups, placement, type, keep-alive, training plan, volume; no EFA field | SageMaker.tsx:762-766 | STALE (minor) + NEW | botocore 1.43.118 ResourceConfig adds InstancePreferences, SelectedInstanceCount, SelectedInstanceType (Tier 1 model) | add "an ordered instance-type fallback list (InstancePreferences)". Still no EFA field (CORRECT). |
| S8 | InstancePlacementConfig applies only to UltraServer capacity | SageMaker.tsx:~766-768 | CORRECT | botocore 1.43.118 doc (Tier 1) | none |
| S9 | Gate 1 diagram: ResourceConfig accepts p3dn ... g7e, c5n.18xlarge | SageMaker.tsx:420-421 | CORRECT, NEW type | TrainingInstanceType enum 1.43.118 adds ml.g7.* (Tier 1 model) | optional: add g7 (it is in the enum; no EFA claim checked for g7 here) |
| S10 | ProductionVariant has no EFA field; InferenceAmiVersion names driver/CUDA/toolkit only | SageMaker.tsx:~1580-1590 + diagram | CORRECT | botocore 1.43.118: ProductionVariant members unchanged, InferenceAmiVersion enum unchanged (5) (Tier 1 model) | none |
| S11 | DLC "CUDA 13.2 base pins NCCL 2.29.7-1, EFA installer 1.49.0 and GDRCopy 2.6, and carries ... comment: EFA installer 1.49.0 vends libfabric 2.4.0amzn5.0 and aws-ofi-nccl 1.20.0" | SageMaker.tsx:971-975 | STALE | DLC @f6bed33a docker/base/cu132/Dockerfile L130-L132 `EFA_VERSION="latest"` (Tier 1 code); commits 66e28a8dcb, bede711904 | "The CUDA 13.2 base pins NCCL 2.29.7-1 and GDRCopy 2.6 and, since October 2026, installs whatever EFA installer is latest at build time. The build logs the version it landed on, and /opt/amazon/efa_installed_packages in the image records it." The 1.49.0 component mapping moves to a sourced installer changelog citation (01 agent) if kept. |
| S12 | PyTorch 2.13 SageMaker image: CUDA 13.3.0, torch 2.13.0, NCCL 2.30.7-1, EFA installer 1.49.0, GDRCopy 2.6, DeepSpeed 0.19.2, TE 2.17.0 | SageMaker.tsx:981-983 | STALE (EFA only) | 2.13-sagemaker-cuda.yml @f6bed33a L20-L30 `efa_version: "latest"`, nccl_tests_version v2.20.0 (Tier 1 code) | "... NCCL 2.30.7-1, EFA installer latest at build time, GDRCopy 2.6 ..." |
| S13 | Install script: --skip-kmod --skip-limit-conf --no-verify; plugin path branch at 1.44.0; --disable-ngc gated on 1.48.0+; /etc/nccl.conf defaults | SageMaker.tsx:~985-1010 | CORRECT (pin moves) | install_efa_amzn2023.sh @f6bed33a L48, L6-L13, L37-L46, L61-L62 (Tier 1 code) | Add: with EFA_VERSION=latest both gates take the new branch. |
| S14 | Dockerfile: libcudart symlink; bundled all_reduce_perf; LD_LIBRARY_PATH order | SageMaker.tsx:~1015-1030 | CORRECT (pin moves) | Dockerfile.cuda @f6bed33a L170-L172, L182-L204 (now built from tag v2.20.0, not master), L320-L322 (Tier 1 code) | none |
| S15 | AWS EFA test: four signatures, GDRDMA on P4d/P5, 3 GB/s threshold, RDMA arg for p4d/p4de/p5 | SageMaker.tsx:~1050-1075 | CORRECT | test/efa/scripts/nccl_allreduce.sh unchanged since 2026-05-26 (Tier 1 code) | none |
| S16 | SMDDP supports p3dn, p4d, p4de; P3 discontinued; AllGather P4 only; TF >2.11 dropped | SageMaker.tsx:1118-1128, 1140-1143 | CORRECT | distributed-data-parallel-support.html live (Tier 1) | none |
| S17 | "The latest SMDDP release is v2.5.0, dated October 17, 2024 ... latest model parallelism library release is v2.6.0, dated the same day"; heading "frozen since October 2024"; "unchanged since October 2024" | SageMaker.tsx:1117, 1137-1146 | WRONG | model-parallel-release-notes.html live: SMP v2.6.1 (Oct 31 2024), v2.7.0 (Dec 4 2024), v2.8.0 (Apr 1 2025) which "Upgraded SMDDP library to 2.6.0"; data-parallel-release-notes.html still tops out at v2.5.0 (Tier 1, doc vs doc) | "The SMDDP release notes stop at v2.5.0 (October 17, 2024), but the SMP release notes ship SMDDP 2.6.0 inside SMP v2.8.0 (April 1, 2025), the newest release of either library located. Treat SMDDP as frozen since April 2025: still scoped to the same three instance types." Heading: "frozen since April 2025". |
| S18 | Distributed-training getting-started page still recommends P4d/P4de (as of August 1, 2026) | SageMaker.tsx:1208-1215 | CORRECT (date moves) | distributed-training-get-started.html live 2026-10-23 (Tier 1) | change "As of August 1, 2026" to the new access date, and "allowlist stopping at P5" to "P5e" |
| S19 | HyperPod EKS AMI 1.0.x-1.3.x, EFA 1.47.0, NVIDIA 580.126.09-580.167.08, CUDA 12.8, kernel 6.1.x, K8s 1.30-1.35, 1.x until Jan 2027 | SageMaker.tsx:1264-1268 | CORRECT | sagemaker-hyperpod-ami-support-policy.html live (Tier 1) | none |
| S20 | "The July 9, 2026 release carries EFA installer 1.47.0, rdma-core 61.0-1, NVIDIA driver 580.159.04, Slurm 25.11.4, kernel 6.8.0-1057-aws" (latest Slurm AMI implied) | SageMaker.tsx:1274-1278 | STALE | sagemaker-hyperpod-release-ami-slurm.html: September 17, 2026 release, Slurm 25.11 variants EFA installer 1.50.0, rdma-core 64.0, NVIDIA 595.91.07, Slurm 25.11.8, kernel 6.8.0-1063-aws; Default Ubuntu 22.04/24.04 variants still 1.47.0 (Tier 1) | "The September 17, 2026 Slurm 25.11 AMI carries EFA installer 1.50.0 with rdma-core 64.0, NVIDIA driver 595.91.07 and Slurm 25.11.8; the Default Ubuntu 22.04 and 24.04 variants in the same release still list 1.47.0. Every release from April 23 to August 29, 2026 was on 1.47.0." |
| S21 | Slurm 25.11 auto-resume known issue still live | SageMaker.tsx:1394-1400 | CORRECT (date moves) | release-ami-slurm page live, May 27 entry, "A fix is under investigation", no fix entry (Tier 1) | "still live ... as of October 23, 2026" |
| S22 | HyperPod EKS: VPC CNI 1.18.3+, only CNI, private subnets, K8s 1.30-1.35 | SageMaker.tsx:~1422-1427 | CORRECT | sagemaker-hyperpod-eks-prerequisites.html live (Tier 1) | none; optional NEW: EKS itself is now at 1.37, HyperPod still 1.35, so DRA on HyperPod means 1.34 or 1.35 |
| S23 | DPD: five types, Inference Operator 3.2+, vLLM 0.19.0 / LMCache 0.4.3 / NIXL 1.0.0 | SageMaker.tsx:~1460-1475 + diagram | CORRECT | sagemaker-hyperpod-model-deployment-dpd.html live (Tier 1) | none |
| S24 | Deep health checks EFA latency/bandwidth; StartClusterHealthCheck; flexible group scoping; metrics EFA Exporter advanced mode | SageMaker.tsx:~1300-1330, 1405-1410 | CORRECT | live pages (Tier 1) | none |
| S25 | Training cluster repair up to 10 times, not billed, restarts from checkpoint | SageMaker.tsx:~905-910 | CORRECT | model-checkpoints-cluster-repair.html live (Tier 1) | none |

### 4A. Capacity Blocks for ML and On-Demand Capacity Reservations (checkpoint 8, read 2026-10-23)

All Tier 1 unless marked. Pages fetched with curl default User-Agent:
- CB-HOW https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-how.html
- CB-UG https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html
- CB-PURCHASE .../capacity-blocks-purchase.html, CB-LAUNCH .../capacity-blocks-launch.html, CB-EXTEND .../capacity-blocks-extend.html, CB-MONITOR .../capacity-blocks-monitor.html, CB-BILL .../capacity-blocks-pricing-billing.html
- CR-CPG https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/cr-cpg.html, CR-UG .../ec2-capacity-reservations.html
- EFA-START https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html
- TOPO-OVERVIEW .../ec2-instance-topology.html
- PC-ODCR https://docs.aws.amazon.com/parallelcluster/latest/ug/compute-node-initialization-odcr-v3.html
- WN-CRRG [Tier 2, What's New] https://aws.amazon.com/about-aws/whats-new/2026/08/capacity-reservation-resource-groups-ec2/ (posted 2026-08-25)

Overlap note: 02-instances-pricing.md already registers the Pricing.tsx Capacity Block rows (X-09 end time / cancellation WRONG, X-14 placement groups NEW, U-3 price rise UNKNOWN). The C-rows below agree with those and cover the other files.

Facts, verbatim where it matters:
- CB-HOW, every mechanic on DecisionGuide.tsx:472-479 and Pricing.tsx:360-369 still holds: "Reserve a start time up to 8 weeks in advance"; "one to 14 days or a multiple of 7 days, up to 182 days (Examples: 21 days, 28 days)"; "up to 64 instances per Capacity Block"; "up to 256 instances across multiple Capacity Blocks"; "each UltraServer corresponds to one Capacity Block. You can request multiple UltraServers through a single request."; "With 30 minutes (for instance types) or 60 minutes (for UltraServer types) left in your Capacity Block reservation, any instances that are running in the Capacity Block begin terminating ... An event is emitted through EventBridge 10 minutes before the termination process begins."
- CB-UG Considerations (all new to the page or absent from it):
  - "Capacity Blocks do not support placement groups. You can't specify a placement group when you launch instances into a Capacity Block, whether you target the Capacity Block by its reservation ID or through a Capacity Reservation Resource Group." CR-CPG repeats "Capacity Blocks do not support placement groups."
  - Placement inside a block is automatic: "Instances that run inside a Capacity Block are automatically placed close together inside Amazon EC2 UltraClusters, for low-latency, petabit-scale, non-blocking networking." This is a vendor description, not a measured property; keep it attributed.
  - "Capacity Blocks end at 11:30AM Coordinated Universal Time (UTC). The termination process for instances running in a Capacity Block begins at 11:00AM Coordinated Universal Time (UTC) on the final day of the reservation." CB-PURCHASE: "All Capacity Blocks end at 11:30AM UTC".
  - "Capacity Block cancellations aren't allowed." CB-PURCHASE: "Capacity Blocks can't be canceled after you reserve them." Also "Capacity Block can't be moved or split".
  - "For P6e-GB200 UltraServer Capacity Blocks, you must terminate your instances at least 60 minutes before the Capacity Block end time."
  - "The total number of instances that can be reserved in Capacity Blocks across all accounts in your AWS Organization can't exceed 256 instances on a particular date." The 256 cap is Organization-wide per date, not per account.
  - "If impairment is detected on an UltraServer Capacity Block, you are notified but generally your instances are not terminated on the Capacity Block." Remediation is terminate-all plus a support case.
  - "UltraServer Capacity Blocks can't be shared across AWS accounts or within your AWS Organization."
  - Default tenancy only; offerings "can start in as soon as 30 minutes"; "Instances in a Capacity Block don't count against your On-Demand Instances limits."
  - Supported instance Capacity Blocks: p6-b300.48xlarge, p6-b200.48xlarge, p5.4xlarge, p5.48xlarge, p5e.48xlarge, p5en.48xlarge, p4d.24xlarge, p4de.24xlarge, trn1.32xlarge, trn2.3xlarge, trn2.48xlarge. UltraServer Capacity Blocks: Trn2 (us-east-2) and P6e-GB200 (US East (Dallas) Local Zone us-east-1-dfw-2a). Per-Region checkmarks did not survive text extraction; 02-instances-pricing.md owns the Region mapping.
- CB-MONITOR: "Forty minutes before your Capacity Block reservation ends, you receive another EventBridge event that tells you that any instances running in the reservation will begin to terminate in 10 minutes." That fits instance types (30 + 10). For UltraServer blocks CB-HOW implies 70 minutes (60 + 10) and CB-MONITOR does not distinguish. Doc-internal inconsistency; no code to settle it. Practical for a drain hook on an UltraServer block: do not wait for the event, schedule from the 11:30 UTC end time minus 60 minutes.
- CB-EXTEND: extensions in 1-day steps up to 14 days and 7-day steps up to 182 days total; request "up to a minimum of 1 hour or a maximum of 57 days before it expires"; "There is no limit to the number of extensions"; reservation ID unchanged; extension "not guaranteed"; payment must clear within 12 hours or 35 minutes before the end, whichever first, else the block ends on the original date.
- CB-BILL: price set by supply and demand at purchase, charged up front, fixed after purchase; "Savings Plans and Reserved Instance discounts don't apply to Capacity Blocks."; payment within 5 minutes to 12 hours, else `payment-failed` and the block is released.
- CB-LAUNCH: launch by reservation ID with `--instance-market-options MarketType='capacity-block'`, or (UltraServers) by Capacity Reservation Resource Group ARN; the instance must be in the block's Availability Zone. EKS managed and self-managed node group pages exist for Capacity Blocks (CB-UG Related resources).
- WN-CRRG [Tier 2, What's New 2026-08-25] and CB-UG [Tier 1]: Capacity Reservation Resource Groups now accept instance and UltraServer Capacity Blocks and interruptible Capacity Reservations; EC2 Fleet and Auto Scaling groups can prioritise across reservation types and fall back to On-Demand.
- CR-CPG: "You can create Capacity Reservations in placement groups that use the following strategies: Cluster Precision Time"; "Spread and Partition placement groups do not support Capacity Reservations."; an existing reservation outside a placement group cannot be modified into one; increasing reserved capacity in a placement group is allowed "However, you increase your chances of getting an insufficient capacity error." CR-UG overview still says only "Capacity Reservations can be created in cluster placement groups" (omits Precision Time). CR-CPG is the specific page; TopologyApi.tsx wording matches it.
- CR-UG: immediate-use reservations have "no term commitment" and can be cancelled any time. Future-dated reservations carry a commitment: "During the commitment duration, you can't decrease the instance count or commitment duration below your initial commitment. You can cancel the Capacity Reservation, but a cancellation charge might apply". Minimum commitment and lead time were not read in this pass. The page's "ODCRs: open-ended duration" holds for immediate-use reservations only.
- EFA-START still carries the quoted sentence "To ensure that capacity is available as you scale your cluster's instances, you can create a Capacity Reservation for your cluster placement group."
- TOPO-OVERVIEW still says "you can't use it to launch a new instance physically close to an existing instance. To influence instance placement, you can create Capacity Reservations in cluster placement groups."
- PC-ODCR still says "the zonal Reserved Instances aren't placed in the same UC (or spine), which can cause insufficient capacity errors (ICEs) when using placement groups." Note the context is a trn1.32xlarge example; the page generalises it, which is fine as worded.

## Capacity claim register (sub-area 4)

| ID | Claim | Location | Verdict | Evidence (tier) | Replacement |
|---|---|---|---|---|---|
| C1 | "Both are documented against a cluster placement group" (Capacity Blocks and ODCRs) | DecisionGuide.tsx:464-469 | WRONG for Capacity Blocks | CB-UG and CR-CPG (Tier 1): "Capacity Blocks do not support placement groups." | "On-Demand Capacity Reservations are documented against a cluster placement group [EFA-START]. Capacity Blocks take no placement group: you can't specify one when launching into a block. Their instances are placed together inside EC2 UltraClusters automatically [CB-UG]. Pick on duration." |
| C2 | 8 weeks ahead; 1-14 days or multiples of 7 up to 182; 64 per block; 256 across blocks | DecisionGuide.tsx:472-474 | CORRECT | CB-HOW, CB-PURCHASE (Tier 1) | none; optional NEW (C19) on the Organization-wide scope of 256 |
| C3 | One UltraServer equals one Capacity Block | DecisionGuide.tsx:474-476 | CORRECT | CB-HOW (Tier 1) | none |
| C4 | Termination starts 30 min (instance types) or 60 min (UltraServer) before end; EventBridge event 10 min before termination | DecisionGuide.tsx:476-479 | CORRECT | CB-HOW (Tier 1); CB-MONITOR states the warning at 40 min before end without an UltraServer case | none; optional NEW (C17) |
| C5 | ODCR: open-ended duration | DecisionGuide.tsx:482 | CORRECT for immediate-use; incomplete | CR-UG (Tier 1): future-dated reservations carry a commitment and a possible cancellation charge | optional: "open-ended for an immediate-use reservation; a future-dated one commits you to a minimum term" |
| C6 | ODCR placement group chosen at creation; expanding raises insufficient-capacity risk | DecisionGuide.tsx:483-487 | CORRECT | CR-CPG (Tier 1) | none |
| C7 | Decision rule: defined training burst (days-weeks) goes to Capacity Blocks | DecisionGuide.tsx:492 | CORRECT | CB-UG: "We recommend Capacity Blocks when you need GPUs to support your ML workloads for days or weeks at a time" (Tier 1) | none |
| C8 | "Capacity Blocks: time-limited GPU reservations for training bursts" | DecisionGuide.tsx:440-441 | CORRECT (doc wording), narrow | CB-UG supported list includes trn1.32xlarge, trn2.3xlarge, trn2.48xlarge and Trn2 UltraServers (Tier 1) | optional: "time-limited accelerator reservations (GPU and Trainium)" |
| C9 | EFA-START quote: Capacity Reservation for your cluster placement group | EfaDevice.tsx:894-897; InstanceSupport.tsx:526-529; Pricing.tsx:467-472 | CORRECT | EFA-START live (Tier 1) | none |
| C10 | Capacity Block documented mechanics list | Pricing.tsx:357-371 | CORRECT | CB-HOW (Tier 1); agrees with 02-instances-pricing.md | none |
| C11 | "None of the three appears in the Capacity Blocks documentation": UTC clock end time, no cancellation, 15 percent rise | Pricing.tsx:374-381 | WRONG for end time and cancellation; price rise UNKNOWN | CB-UG, CB-PURCHASE (Tier 1) verbatim above; see 02 X-09 and U-3 | Move end time and no-cancel into the documented list: "Every block ends at 11:30 UTC on its final day and termination starts at 11:00 UTC. A block cannot be cancelled, moved or split." Keep only the price rise as unsettled (02 owns that row). |
| C12 | Capacity Blocks presented as one path to secure capacity next to ODCR for a cluster placement group | Pricing.tsx:466-478 | CORRECT; missing the placement-group exclusion | CB-UG (Tier 1); 02 X-14 | add the C1 sentence |
| C13 | "to influence placement you create Capacity Reservations in cluster placement groups" | TopologyApi.tsx:547-552 | CORRECT | TOPO-OVERVIEW live (Tier 1) | none |
| C14 | Capacity Reservations only in cluster or precision time placement groups; spread and partition unsupported | TopologyApi.tsx:1365-1371 | CORRECT | CR-CPG live (Tier 1) | none; optional: add "Capacity Blocks do not support placement groups at all" here, since this paragraph names the control path for EFA |
| C15 | Topology APIs add value for jobs spanning multiple placement groups, reservations or Capacity Blocks | TopologyApi.tsx:1420-1427 | CORRECT, strengthened | CB-UG (Tier 1): no placement group can be attached to a block, so for a Capacity Block fleet topology is the only rank-ordering signal the customer controls | optional: say so |
| C16 | Zonal Reserved Instances not placed in the same spine; ICE when a placement group is attached | TopologyApi.tsx:1434-1440 | CORRECT | PC-ODCR live (Tier 1) | none |
| C17 | (absent) UltraServer drain timing | DecisionGuide.tsx:476-479, Pricing.tsx:364-368 | NEW (doc-internal inconsistency) | CB-HOW: event 10 min before termination, termination at 60 min for UltraServers; CB-MONITOR: warning "Forty minutes before your Capacity Block reservation ends"; CB-UG: P6e-GB200 "must terminate your instances at least 60 minutes before the Capacity Block end time" (all Tier 1). The 10:30 UTC figure is our arithmetic [DERIVED: 11:30 UTC end minus 60 minutes] | "On a P6e-GB200 UltraServer block, finish the checkpoint and terminate by 10:30 UTC on the final day. Schedule from the clock rather than waiting for the EventBridge warning, whose documented timing does not distinguish UltraServer blocks." |
| C18 | (absent) Capacity Reservation Resource Groups accept Capacity Blocks | DecisionGuide.tsx capacity section; TopologyApi.tsx:1420-1427 | NEW | CB-UG (Tier 1); WN-CRRG (Tier 2, 2026-08-25) | "Several blocks can sit in one Capacity Reservation Resource Group, and a launch can target the group. EC2 Fleet and Auto Scaling can order reservation types and fall back to On-Demand." |
| C19 | (absent) 256-instance cap scope | DecisionGuide.tsx:473-474; Pricing.tsx:362 | NEW | CB-UG (Tier 1): "across all accounts in your AWS Organization can't exceed 256 instances on a particular date" | "Up to 256 across blocks, counted across every account in the AWS Organization on any one date." |
| C20 | (absent) Savings Plans and RI discounts | DecisionGuide.tsx:490-497 decision rules | NEW (budget) | CB-BILL (Tier 1): "Savings Plans and Reserved Instance discounts don't apply to Capacity Blocks." | add to the Capacity Blocks rule: "priced at purchase, paid up front, outside Savings Plans" |
| C21 | Capacity planning advice for the coupled phase | Operations.tsx:515 | CORRECT (advice, no fact) | n/a | none |
| C22 | Source ids 30 and 31 (Capacity Blocks, ODCR) and id 2 (efa-start) accessDate 2026-03-22 | Sources.tsx:9, 20-21 | STALE (date only) | pages live 2026-10-23 (Tier 1) | accessDate '2026-10-23' |
| C23 | Claims-table row and ODCR glossary: placement group chosen when the reservation is created | Sources.tsx:138, 190 | CORRECT | CR-CPG (Tier 1) | none |
| C24 | CAPACITY_BLOCK_DOC accessed 2026-08-01; DecisionGuide docs.capacityBlocks | data/pricing.ts:85-90; DecisionGuide.tsx:41-45 | STALE (date only) | CB-HOW live (Tier 1) | accessed '2026-10-23'; add CB-UG as a second DocRef for the Considerations facts (02 proposes CAPACITY_BLOCK_UG_DOC) |

### 5A. Other pinned sample repos in EKSIntegration.tsx (checkpoint 9, read 2026-10-23)

Every file fetched at its pin with `gh api ... contents/<path>?ref=<SHA>`; all eight resolved.

- aws/sagemaker-hyperpod-checkpointless-training @08c4ff60ef06cfe2a659f4ea38c342c81fd86410
  `examples/llama3/launch/pretrain_llama3_70b_p5.yaml` L34-L59: L34 `hostNetwork: True`, L36
  `beta.kubernetes.io/instance-type: ml.p5.48xlarge`, L42 `privileged: true`, L55 and L59
  `vpc.amazonaws.com/efa: 32` (limits and requests), plus `hugepages-2Mi: 5120Mi` and `nvidia.com/gpu: 8`. Last
  commit touching the file 24520b41 (2025-12-09), before the pin. Pin stays.
- aws/sagemaker-hyperpod-recipes @20ea8f4551cd540b5b023b25d41ab414b16fe493
  `launcher/nemo/k8s_templates/training/training.yaml` L78-L81: `spec:` then `{{- if $config.hostNetwork }}`
  `hostNetwork: {{ $config.hostNetwork }}`. A user-set knob, as the page says. File last touched 1d2f3f97
  (2026-03-18). Pin stays.
- aws-samples/aws-do-eks @1542b55051b3ffc17fe91a796cf5700ed4d82c24
  `.../nemotron/ultra/agg/lws.yaml-template` L30-L31: `hostNetwork: true`, `dnsPolicy: ClusterFirstWithHostNet`.
  The file changed after the pin (3fd75f29f153074f830221a7af92182d9ff33e50, 2026-10-20, frontend
  do-not-disrupt annotations); L30-L31 are identical there and the same pair recurs at L240-L241. Pin stays.
- awslabs/awsome-distributed-ai @cb99a28a85c8333ddbad004221230dac967ddbab (2026-07-31):
  - `micro-benchmarks/nccl-tests/kubernetes/nccl-tests.yaml`: L9 `slotsPerWorker: 8`; Launcher L11-L12 replicas 1;
    Worker L58-L59 replicas 2; L63 `node.kubernetes.io/instance-type: "p5.48xlarge"`; mpirun L26-L44
    `-np 16 -N 8 --bind-to none -x PATH -x LD_LIBRARY_PATH -x FI_PROVIDER=efa -x FI_EFA_FORK_SAFE=1 -x
    NCCL_DEBUG=INFO`; L45-L56 `all_reduce_perf -b 8 -e 16G -f 2 -g 1 -c 1 -n ...`; L21-L24 PATH and
    LD_LIBRARY_PATH; L75/L80 `vpc.amazonaws.com/efa: 32`. The page's LD_LIBRARY_PATH string omits the trailing
    `:/usr/local/nvidia/lib:$LD_LIBRARY_PATH` that L24 carries. Cosmetic; the page says "actually exports", so the
    full value is the honest one.
  - `.../kubernetes/nccl-tests-gb200.yaml`: L103 and L107 `vpc.amazonaws.com/efa: 4 #p6e has 4 NICs`, L21
    `slotsPerWorker: 4`, Worker replicas 18 (L77). "requests only 4" CORRECT.
  - `micro-benchmarks/nccl-tests/nccl-tests.Dockerfile`: L3-L4 `nvcr.io/nvidia/cuda:${CUDA_VERSION}-devel-ubuntu22.04`
    (CUDA 13.0.2), L6 GDRCopy v2.5.2 built L71-L73, L7 EFA installer 1.48.0, L88-L91
    `./efa_installer.sh -y -g -d --skip-kmod --skip-limit-conf --no-verify --disable-build-ngc`, L8 comment
    "plugin is bundled with EFA", L9 NCCL v2.30.4-1 built L101, L10 nccl-tests v2.18.3 built L108. "CUDA devel base,
    GDRCopy, a full EFA installer run, NCCL, nccl-tests" CORRECT. "Full" is right in the sense the page means
    (no `--minimal`, so the plugin lands); the run still skips the kernel module, as a container must.
  - Newer commits touch the directory: 39848da1 (2026-09-01, repo reorg; these paths unchanged) and
    **0b55ba5f073051f685f4258591b9d3a3326403c5 (2026-09-07, "chore(nccl-tests): update NCCL and EFA stack")**.
    At 0b55ba5f: nccl-tests.yaml and nccl-tests-gb200.yaml are byte-identical to the pin; the Dockerfile moves to
    CUDA 13.1.2 (L3), GDRCopy v2.6 (L6), EFA installer 1.50.0 (L7), NCCL v2.31.2-1 (L8), nccl-tests v2.20.0 (L9),
    installer call L95 with `--disable-ngc` instead of `--disable-build-ngc`, and L98-L99 a build-time check that the
    bundled plugin is `aws-ofi-nccl 1.21.1`. Page claims still hold at either SHA. Optional pin move (ADAI_SHA) for
    freshness only.
  - Repo rename: `gh api repos/awslabs/awsome-distributed-training` resolves to `awslabs/awsome-distributed-ai`.
    "transferred and renamed, so older links resolve to it" CORRECT.
- eksctl-io/eksctl @a5cb648e5bd6245a80e6b62b8817ce6fa1e6d7cd `userdocs/src/usage/nodegroup-managed.md` L164-L173:
  managed node group on hpc6a.48xlarge with `efaEnabled: true` (L171) and `placement: groupName: eks-efa-testing`
  (L172-L173). File last touched f4fce83c (2024-12-02). Pin stays.
- awslabs/ai-on-eks @5e6282cb121f423e734caccb550a9f61c2935584 `infra/base/terraform/eks.tf`: L101
  `efa_instance_types = ["p5.48xlarge", "p5e.48xlarge", "p5en.48xlarge", "p6-b200.48xlarge", "p6-b300.48xlarge",
  "p6e-gb200.36xlarge"]`; L111-L116 `module "efa_network_interfaces"` with source
  `./modules/efa-networkinterfaces-generator` and `use_case = var.efa_network_interfaces_policy`. eks.tf last
  touched 4beef2bb (2026-07-12), before the pin.
  - NEW, code-derived: `infra/base/terraform/variables.tf` L160-L164 `efa_network_interfaces_policy` "1 = IP
    Optimized, 2 = Bandwidth Optimized", **default = 1**, unchanged at the newest commit to that file (a003ada9,
    2026-10-16). Module `locals.tf` L25-L37 at the pin: on p5.48xlarge use case 1 is one ENA plus 32 efa-only
    (one IP); use case 2 is one ENA plus seven more ENA on cards 4, 8, ... 28 at device index 1, with EFA on every
    card (eight IPs). Both keep all 32 EFA devices; the switch moves IP count and ENA bandwidth only. A reader who
    starts from the blueprint gets the IP-optimized layout unless they set the variable to 2.
  - Same variables.tf L165-L169 pins `aws_efa_k8s_device_plugin_version` default "0.5.26", behind the eks-charts
    chart at v0.5.33 (E5). Context only; no page claim depends on it.

## Sample-repo claim register (sub-area 5)

| ID | Claim | Location | Verdict | Evidence (tier) | Replacement |
|---|---|---|---|---|---|
| R1 | Checkpointless example hard-codes hostNetwork: True on a p5 pretraining job requesting 32 EFA | EKSIntegration.tsx:1307-1309 | CORRECT | checkpointless-training @08c4ff60 pretrain_llama3_70b_p5.yaml L34-L59 (Tier 1 code) | none |
| R2 | HyperPod recipes expose hostNetwork as a user-settable knob | EKSIntegration.tsx:1309-1311 | CORRECT | recipes @20ea8f45 training.yaml L78-L81 (Tier 1 code) | none |
| R3 | aws-do-eks multi-node inference template pairs hostNetwork with dnsPolicy ClusterFirstWithHostNet | EKSIntegration.tsx:1311-1313 | CORRECT | aws-do-eks @1542b550 lws.yaml-template L30-L31; same at 3fd75f29 (Tier 1 code) | none |
| R4 | NCCL MPIJob: launcher + N workers, slotsPerWorker 8, mpirun -np 16 -N 8 on two p5.48xlarge, all_reduce_perf 8 B to 16 GB | EKSIntegration.tsx:1514-1519 | CORRECT | awsome-distributed-ai @cb99a28a nccl-tests.yaml L9, L26-L56, L58-L63 (Tier 1 code) | none |
| R5 | Exported env: FI_PROVIDER=efa, FI_EFA_FORK_SAFE=1, NCCL_DEBUG=INFO, PATH, LD_LIBRARY_PATH | EKSIntegration.tsx:1521-1528 | CORRECT, LD_LIBRARY_PATH truncated | nccl-tests.yaml L21-L24, L35-L44 (Tier 1 code) | optional: append `:/usr/local/nvidia/lib:$LD_LIBRARY_PATH` to the shown LD_LIBRARY_PATH so the block matches the manifest |
| R6 | GB200 reference manifest requests only 4 EFA | EKSIntegration.tsx:1110-1112 | CORRECT | nccl-tests-gb200.yaml L103, L107 (Tier 1 code) | none |
| R7 | Reference image: CUDA devel base, GDRCopy, full EFA installer run, NCCL, nccl-tests; plugin comes from the installer | EKSIntegration.tsx:1530-1536 | CORRECT | nccl-tests.Dockerfile @cb99a28a L3-L10, L71-L73, L88-L91, L101, L108 (Tier 1 code) | none; at 0b55ba5f the image verifies the bundled plugin is aws-ofi-nccl 1.21.1 (L98-L99) |
| R8 | awsome-distributed-ai transferred and renamed; older links resolve | EKSIntegration.tsx:1461-1464 | CORRECT | GitHub API redirect awesome-distributed-training -> awsome-distributed-ai (Tier 1) | none |
| R9 | eksctl accepts an explicit placement group name alongside efaEnabled | EKSIntegration.tsx:887-889 | CORRECT | eksctl @a5cb648e nodegroup-managed.md L171-L173 (Tier 1 in-repo doc; it is a config example, so it shows accepted syntax, not behaviour) | none |
| R10 | ai-on-eks declares the EFA instance list and a generator module with a bandwidth-optimized vs IP-optimized switch | EKSIntegration.tsx:1452-1457 | CORRECT | ai-on-eks @5e6282cb eks.tf L101, L111-L116 (Tier 1 code) | none |
| R11 | (absent) blueprint default for that switch | EKSIntegration.tsx:1452-1457 | NEW | ai-on-eks @5e6282cb variables.tf L160-L164 default 1; modules/efa-networkinterfaces-generator/locals.tf L25-L37 (Tier 1 code) | "The blueprint defaults to the IP-optimized layout (policy 1: one IP, every card EFA). Set efa_network_interfaces_policy = 2 for the eight-IP layout; both keep all 32 EFA devices on a p5.48xlarge." |

## Source inventory (consolidated, all read 2026-10-23)

Code (Tier 1, code is the authority):

| Repo / artifact | Page pin (constant) | Current ref (date) | Status |
|---|---|---|---|
| aws/eks-charts stable/aws-efa-k8s-device-plugin | bfe91c4b9257c80f754ad4b3d6a9a3c239b2b8ec (EFA_CHART_SHA) | ab081b33b8a1f6627e699d4aa48e43d73d138bce (2026-09-15), chart v0.5.33 / app v0.5.21-eksbuild.13 | moves |
| aws/eks-charts stable/aws-dranet | c043cef46c7e50a71094e50b43b8225322a750ff (DRANET_CHART_SHA) | same, still the only commit (2026-04-30) | stays |
| kubernetes-sigs/dranet | v1.2.0 (DRANET_SHIPPED), v1.4.0 (DRANET_LATEST) | v1.5.0 (2026-10-03) | DRANET_LATEST moves |
| awslabs/amazon-eks-ami | ac5f340c56a9a6943808c9201da87adec9edb1da (AMI_SHA, 2026-07-08) | main 9c99e21e6d07a733596b85d197a065815603e5f0; release v20261019 (2026-10-21) | moves if E26 is fixed |
| bottlerocket-os/bottlerocket-kernel-kit | v7.2.1 (BR_KERNEL_TAG) | v9.4.1 (in Bottlerocket v1.67.0, 2026-10-13) | moves |
| bottlerocket-os/bottlerocket-core-kit | v15.0.0 (BR_CORE_TAG) | v17.2.0 (in Bottlerocket v1.67.0) | moves |
| NVIDIA/k8s-device-plugin | v0.19.0 (NVDP_NEW), v0.18.2 (NVDP_OLD) | v0.20.1 (2026-09-22); revert in v0.19.3 (2026-06-22) | add refs |
| NVIDIA/nvidia-container-toolkit | v1.19.1 (CTK_TAG) | v1.20.1 (2026-09-19) | moves |
| kubernetes/kubernetes | v1.34.0 (K8S_TAG) | not re-checked; tag is immutable and the cited DRA attribute API is historical | stays |
| boto/botocore | 1.43.62 (BOTOCORE_TAG) | 1.43.118 | optional move |
| aws/karpenter-provider-aws | 4b2a2049469190a8a379668794e053207464b740 (KARPENTER_SHA, design doc); v1.14.0 (TopologyApi) | v1.15.0 (2026-10-10) | design-doc pin stays; TopologyApi ref moves; new refs for DRA |
| kubernetes/cloud-provider-aws | not cited | v1.37.0 (2026-09-01) | new citation |
| aws/aws-ofi-nccl | v1.20.0 (TopologyApi) | v1.21.1 | optional move |
| aws-samples/ec2-topology-aware-for-slurm | 57abd4d9347e8a31b533918639a69b7637dd6328 | same (HEAD) | stays |
| aws-samples/sample-rlinf-on-eks | c8b5e3a39d89de783b5eb97eaa57dc30a6307f33 | same (HEAD) | stays |
| aws/sagemaker-python-sdk | 9ff3e5fa61b4b57f947957f26cc42964fe437dee (SDK_SHA); v2.257.0 (SDK_TAG) | v3.27.0 (2026-10-21); v2.257.7 (2026-10-07) | SDK_SHA moves; SDK_TAG optional |
| aws/deep-learning-containers | 4c921b9ecade7322bebb79224bea6f1c5c3d0591 (DLC_SHA) | f6bed33af5a829fccdca760f2011466e245090d0 | moves |
| aws/sagemaker-hyperpod-checkpointless-training | 08c4ff60ef06cfe2a659f4ea38c342c81fd86410 (CKPT_SHA) | file unchanged since 2025-12-09 | stays |
| aws/sagemaker-hyperpod-recipes | 20ea8f4551cd540b5b023b25d41ab414b16fe493 (RECIPES_SHA) | file unchanged since 2026-03-18 | stays |
| aws-samples/aws-do-eks | 1542b55051b3ffc17fe91a796cf5700ed4d82c24 (DO_EKS_SHA) | file changed 3fd75f29 (2026-10-20), cited lines identical | stays |
| awslabs/awsome-distributed-ai | cb99a28a85c8333ddbad004221230dac967ddbab (ADAI_SHA, 2026-07-31) | 0b55ba5f073051f685f4258591b9d3a3326403c5 (2026-09-07) | optional move |
| eksctl-io/eksctl | a5cb648e5bd6245a80e6b62b8817ce6fa1e6d7cd (EKSCTL_SHA) | file unchanged since 2024-12-02 | stays |
| awslabs/ai-on-eks | 5e6282cb121f423e734caccb550a9f61c2935584 (AI_ON_EKS_SHA) | eks.tf unchanged since 2026-07-12; variables.tf a003ada9 (2026-10-16), EFA lines identical | stays |

Documentation (Tier 1 unless marked), live on 2026-10-23:
- EKS User Guide: device-management-efa.html (node-efa.html now 301-redirects here), ml-workload-topology.html (new), create-node-class.html, create-node-pool.html, ml-eks-optimized-ami.html, ml-hugepages.html, device-management-nvidia.html.
- EC2 User Guide: ec2-instance-topology.html, how-ec2-instance-topology-works.html, ec2-instance-topology-prerequisites.html, ec2-instance-topology-examples.html, efa-acc-inst-types.html, efa-start.html, capacity-blocks-how.html, ec2-capacity-blocks.html, capacity-blocks-purchase.html, capacity-blocks-launch.html, capacity-blocks-extend.html, capacity-blocks-monitor.html, capacity-blocks-pricing-billing.html, cr-cpg.html, ec2-capacity-reservations.html. AWS CLI reference describe-capacity-reservation-topology.
- SageMaker Developer Guide: HyperPod task governance scheduling, HyperPod topology (Slurm), HyperPod Slurm AMI releases, HyperPod EKS AMI policy and prerequisites, DPD, deep health checks, cluster metrics, model-checkpoints-cluster-repair, data-parallel and model-parallel release notes, distributed-data-parallel-support, distributed-training-get-started, your-algorithms-training-efa.
- ParallelCluster User Guide: compute-node-initialization-odcr-v3.html.
- In-repo docs (orientation only, never proof): Karpenter website/content/en/preview/tasks/dra.md @v1.15.0; amazon-eks-ami doc/usage/al2023.md @9c99e21e; aws-ofi-nccl doc/topology-aware.md; dranet site/content/docs/user/aws-eks-efa.md.
- Tier 2: AWS What's New 2026-08-25 "Capacity Reservation Resource Groups now support Amazon EC2 Capacity Blocks and interruptible Capacity Reservations"; Karpenter v1.15.0 and NVIDIA v0.19.3 GitHub release notes (release notes, not code).

## Pin-move table

"Verified" = the file was fetched at the new ref on 2026-10-23 and the cited lines say what the page says (or what the replacement text says, where the claim changed).

| File | Constant / ref | Old ref | New ref | Per-citation path:lines at the new ref | Verified |
|---|---|---|---|---|---|
| EKSIntegration.tsx | EFA_CHART_SHA | bfe91c4b9257c80f754ad4b3d6a9a3c239b2b8ec | ab081b33b8a1f6627e699d4aa48e43d73d138bce | efaChart stable/aws-efa-k8s-device-plugin/Chart.yaml L4-L5 (v0.5.33 / v0.5.21-eksbuild.13; text change E5); efaDs templates/daemonset.yaml L60-L64; efaValues values.yaml (308 allowlist entries) | yes |
| EKSIntegration.tsx | AMI_SHA | ac5f340c56a9a6943808c9201da87adec9edb1da | 9c99e21e6d07a733596b85d197a065815603e5f0 (needed only with the E26 fix; otherwise stays) | installEfa install-efa.sh L53; installEfaGuard L6-L8; installEfaPeermem L63-L65 (file unchanged since ac5f340); amiVars becomes templates/al2023/variables-default.pkrvars.hcl L11; new refs for E26: template.pkr.hcl L125 and L129, variables-default.pkrvars.hcl L18-L19, Makefile L94-L95, doc/usage/al2023.md L34-L35 and L68-L70 | yes |
| EKSIntegration.tsx | DRANET_CHART_SHA | c043cef4... | stays | dranetChart, dranetValues L313-L328, dranetDs L33-L66 | yes (unchanged) |
| EKSIntegration.tsx | DRANET_SHIPPED | v1.2.0 | stays | dranetDb pkg/inventory/db.go L290 | not re-read (tag immutable, chart still ships v1.2.0) |
| EKSIntegration.tsx | DRANET_LATEST | v1.4.0 | v1.5.0 | dranetBench site/content/docs/user/aws-eks-efa.md L109-L118 (file identical at both tags) | yes |
| EKSIntegration.tsx | NVDP_NEW / NVDP_OLD | v0.19.0 / v0.18.2 | stay (they document the history); add NVDP_REVERT v0.19.3 and NVDP_CURRENT v0.20.1 | v0.19.3 cmd/nvidia-device-plugin/main.go L114-L118; v0.20.1 main.go L115-L119; v0.20.1 internal/cdi/cdi.go L170-L172; v0.20.1 deployments/helm/nvidia-device-plugin/values.yaml L38 `mofedEnabled: null` | yes |
| EKSIntegration.tsx | CTK_TAG | v1.19.1 | v1.20.1 | mofed internal/discover/mofed.go L25-L36 (globs L30-L31; content unchanged) | yes |
| EKSIntegration.tsx | BR_KERNEL_TAG | v7.2.1 | v9.4.1 | brKmod packages/kmod-6.18-efa/kmod-6.18-efa.spec L1-L29 (L1 installer 1.49.0, L8 Version 3.0.0, L15 Source0, L28-L29 extract) | yes |
| EKSIntegration.tsx | BR_CORE_TAG | v15.0.0 | v17.2.0 | brRdma packages/rdma-core/rdma-core.spec L109-L125 becomes L111-L136 (unused libs L111-L117, libefa-only strip L119-L136); Version 65.0 | yes |
| EKSIntegration.tsx | BOTOCORE_TAG | 1.43.62 | 1.43.118 (optional) | batchModel botocore/data/batch/2016-08-10/service-2.json NodeProperties and NodeRangeProperty (identical text) | yes |
| EKSIntegration.tsx | KARPENTER_SHA | 4b2a2049... | stays (designs/efa-for-static-capacity.md unchanged since 1de6d8c6) | add new refs at v1.15.0: pkg/operator/options/options.go L78; charts/karpenter/values.yaml L216-L219, L282-L286; pkg/providers/drametadata/zz_generated_efa_metadata.go L449-L773; zz_generated_gpu_metadata.go L1806-L1914; website/content/en/preview/tasks/dra.md L188, L191 (orientation) | yes |
| EKSIntegration.tsx | CKPT_SHA, RECIPES_SHA, DO_EKS_SHA, EKSCTL_SHA, AI_ON_EKS_SHA | as on page | stay | R1-R3, R9-R11 paths and lines in 5A | yes |
| EKSIntegration.tsx | ADAI_SHA | cb99a28a85c8333ddbad004221230dac967ddbab | 0b55ba5f073051f685f4258591b9d3a3326403c5 (optional, freshness only) | ncclTests nccl-tests.yaml and ncclGb200 nccl-tests-gb200.yaml byte-identical; ncclDockerfile nccl-tests.Dockerfile L3-L9 (CUDA 13.1.2, GDRCopy v2.6, EFA 1.50.0, NCCL v2.31.2-1, nccl-tests v2.20.0), L95 installer call, L98-L99 plugin 1.21.1 check | yes |
| TopologyApi.tsx | topologify / topologifyDoc ref | v1.20.0 | v1.21.1 (optional) | contrib/scripts/topology_aware/hostfile-topologify.py L110-L125 identical; doc/topology-aware.md L122-L149 identical (149 lines both) | yes |
| TopologyApi.tsx | karpenter ref | v1.14.0 `pkg` | v1.15.0 `pkg` | full v1.15.0 tarball: zero hits for network-node-layer, DescribeInstanceTopology, DescribeCapacityReservationTopology | yes |
| TopologyApi.tsx | new ref (T19, T20) | none | kubernetes/cloud-provider-aws v1.37.0 | pkg/providers/v1/instances_v2.go L95-L117; pkg/providers/v1/well_known_labels.go L22, L26; pkg/providers/v1/topology.go L87-L133 | yes |
| TopologyApi.tsx | slurm / k8sLabeler | 57abd4d9 / c8b5e3a3 | stay (both are HEAD) | unchanged | yes |
| TopologyApi.tsx | ACCESSED / READ | 2026-08-02 | 2026-10-23 | n/a | n/a |
| SageMaker.tsx | SDK_SHA | 9ff3e5fa61b4b57f947957f26cc42964fe437dee | tag v3.27.0 | allowlist sagemaker-train/src/sagemaker/train/container_drivers/common/utils.py L45-L60 becomes L46-L64 (NCCL list L46-L56, RDMA list L58-L64); torchrun distributed_drivers/torchrun_driver.py L51-L63 becomes L56-L64; mpi distributed_drivers/mpi_utils.py L283-L290 becomes L284-L291 | yes |
| SageMaker.tsx | SDK_TAG | v2.257.0 | v2.257.7 (optional) | src/sagemaker/fw_utils.py L85-L91 identical | yes |
| SageMaker.tsx | DLC_SHA | 4c921b9ecade7322bebb79224bea6f1c5c3d0591 | f6bed33af5a829fccdca760f2011466e245090d0 | dlcBase docker/base/cu132/Dockerfile L106-L108 becomes L130-L132; dlcPytorch .github/config/image/pytorch/2.13-sagemaker-cuda.yml L20-L29 becomes L20-L30; dlcInstall scripts/docker/common/install_efa_amzn2023.sh L44-L48 becomes L48-L50; dlcPluginPath L7-L12 becomes L6-L13; dlcNgc L37-L45 becomes L37-L46; dlcNcclConf L59-L60 becomes L61-L62; dlcLdPath docker/pytorch/Dockerfile.cuda L287-L289 becomes L320-L322; dlcNcclTests L171-L182 becomes L182-L204; dlcCudart L161-L164 becomes L170-L172; dlcValidate, dlcRdmaArg, dlcThreshold (test/efa/scripts/nccl_allreduce.sh) and dlcEfaTest (test/efa/test_efa.py) unchanged lines | yes |
| SageMaker.tsx | ACCESSED / READ | 2026-08-01 | 2026-10-23 | n/a | n/a |
| data/pricing.ts, DecisionGuide.tsx, Sources.tsx | CAPACITY_BLOCK_DOC accessed; docs.capacityBlocks; source ids 2, 30, 31 accessDate | 2026-08-01 / 2026-03-22 | 2026-10-23 | URLs unchanged and live | yes |

## NEW items that change what a reader types, chooses, budgets or checks

1. **Capacity Blocks take no placement group** (C1, C12, C14, C15). CB-UG and CR-CPG, Tier 1. Placement inside a block is automatic, inside UltraClusters (a vendor description). DecisionGuide.tsx:464-469 is WRONG as written.
2. **Capacity Block clock**: every block ends at 11:30 UTC and termination starts at 11:00 UTC on the final day. P6e-GB200 UltraServer blocks must be empty 60 minutes before the end, which works out to 10:30 UTC [DERIVED]. Blocks cannot be cancelled, moved or split (C11, C17). Pricing.tsx:374-381 is WRONG on two of its three items.
3. **Capacity Block budget facts**: the 256-instance cap is counted across the whole AWS Organization on each date (C19). Savings Plans and RI discounts do not apply (C20). Extensions come in the same increments and are not guaranteed (CB-EXTEND).
4. **Capacity Reservation Resource Groups now take Capacity Blocks** (C18; Tier 1 CB-UG, Tier 2 What's New 2026-08-25). One launch target can span several blocks, with Fleet or ASG fallback to On-Demand.
5. **Karpenter v1.15.0 supports EFA DRA**: alpha, feature-gated (DRAEFA / settings.enableDRA). Leave networkInterfaces unset with it (E1-E4, E34). Separately, mixing the DRA driver and the device plugin on one node causes "silent oversubscription" (E11).
6. **EKS AMI rebuild command**: `nvidia_driver_major_version` is silently dropped. Use nvidia_driver_lts_version and nvidia_driver_pb_version, set together (E26).
7. **NVIDIA device plugin MOFED default**: true only in v0.19.0-v0.19.2. It was reverted in v0.19.3, and v0.20.x defaults to false. The EKS documentation still says v0.19.0+ defaults to true (E27, doc-code conflict).
8. **EKS labels every supported node with topology.k8s.aws/network-node-layer-N**, through the control-plane CCM. This covers MNG, self-managed, Karpenter and Auto Mode. No labeler DaemonSet is needed (T19, T20; code-confirmed at cloud-provider-aws v1.37.0).
9. **SageMaker SDK EFA allowlists now include p5 and p5e in both lists** (v3.24.0+). p5en, p6 and trn2 are still absent (S1). ResourceConfig also has an ordered InstancePreferences fallback list (S7).
10. **SMDDP 2.6.0 exists**, inside SMP v2.8.0 (April 1, 2025). The SMDDP notes stop at v2.5.0 (S17).
11. **HyperPod Slurm AMI split**: the Slurm 25.11 variants carry EFA installer 1.50.0, while the Default variants stay on 1.47.0 (S20).
12. **ai-on-eks defaults to the IP-optimized interface layout** (policy 1). Both layouts keep all 32 EFA devices on a p5.48xlarge (R11).
13. **Future-dated ODCRs carry a commitment** and a possible cancellation charge, so "open-ended" applies to immediate-use reservations only (C5).

## UNKNOWN list (what was tried)

- T10, the DescribeInstanceTopology and DescribeCapacityReservationTopology throttle defaults. Tried: botocore 1.43.118 model, the four EC2 topology User Guide pages and the CLI reference. None publishes a rate. Not re-searched beyond those.
- E16, the removed version floors (device plugin v0.5.6 for P6-B200, VPC CNI 1.7.10, eksctl 0.215.0, Bottlerocket 1.28.0). Tried: the live device-management-efa page (it now carries only VPC CNI 1.18.5 for efa-only). The floors survive only in the awsdocs GitHub .adoc, which lags the live site.
- E17, whether Bottlerocket pre-allocates huge pages for EFA, and the exact hugepages setting keys at a pinned tag. Tried: Bottlerocket CHANGELOG @v1.67.0 (feature exists since v1.64.0), the corndog hugepages.rs (read on the default branch only, so the keys are not pinned), ml-hugepages.html and device-management-efa.html (both silent on Bottlerocket).
- SageMaker.tsx:929-933 hedge: does the pre-training GPU health check exercise EFA or only NCCL over any transport? Not re-checked in this pass. The page already says no source was found, which preserves the hedge's scope.
- C11 / 02 U-3, the "roughly 15 percent Capacity Block price rise in January 2026". Tried: CB-HOW, CB-UG, CB-PURCHASE, CB-BILL, and the What's New search for "capacity blocks" (Aug-Oct 2026). No first-party statement found. 02-instances-pricing.md owns the rate arithmetic.
- C5, the minimum commitment term and lead time for future-dated Capacity Reservations. Only the ec2-capacity-reservations.html overview was read, and it states no numbers. Do not put a figure on the page without reading the future-dated reservation page.
- C17, the EventBridge warning time for UltraServer blocks. CB-MONITOR says 40 minutes before the end with no UltraServer case, while CB-HOW implies 70. There is no code to settle it.
- CB per-Region support matrix: the checkmarks did not survive text extraction. 02-instances-pricing.md owns it.

## Verdict counts (all registers, 123 rows)

| Register | CORRECT | STALE | WRONG | NEW | UNKNOWN |
|---|---|---|---|---|---|
| EKS E1-E41 | 23 | 14 | 2 | 0 | 2 |
| Topology T1-T22 | 16 | 5 | 0 | 0 | 1 |
| SageMaker S1-S25 | 15 | 9 | 1 | 0 | 0 |
| Capacity C1-C24 | 16 | 2 | 2 | 4 | 0 |
| Sample repos R1-R11 | 10 | 0 | 0 | 1 | 0 |
| Total | 80 | 30 | 5 | 5 | 3 |

Standalone NEW rows are counted as NEW. NEW facts attached to CORRECT or STALE rows (E11, E31, E34, S7, S9, S22, C5) are listed in the NEW section but counted under their row verdict.

## Personal data statement

No personal data was sent in any request. All GitHub reads used `gh` with its existing authentication and no added headers. All web reads used `curl` with its default User-Agent and no contact address. No form, query or body contained the user's email, name or account details.

STATUS: COMPLETE
