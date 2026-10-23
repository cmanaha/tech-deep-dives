# Authoring log G5: integrations (EKS, SageMaker, EC2 topology API)

STATUS: COMPLETE (see last line)

Agent: G5 authoring agent, October 2026 refresh. Started 2026-10-23.
Files owned: `src/sections/EKSIntegration.tsx`, `src/sections/SageMaker.tsx`,
`src/sections/TopologyApi.tsx`. Base state: commit b39b4d3 content (registers' line numbers).

## Files done

- EKSIntegration.tsx (typecheck and lint clean after the file was finished)
- TopologyApi.tsx (typecheck and lint clean after the file was finished)
- SageMaker.tsx (typecheck and lint clean after the file was finished)

## Line counts (wc -l)

JSX body words (SourceRef tags excluded): EKS 5591 to 5519, TopologyApi 5035 to 5022, SageMaker 6041 to 6042.

| File | Before | After |
|---|---|---|
| EKSIntegration.tsx | 1564 | 1585 |
| SageMaker.tsx | 1720 | 1707 |
| TopologyApi.tsx | 1454 | 1437 |

## Pre-edit spot checks run by G5 (2026-10-23, gh api / curl default UA, no personal data)

Karpenter v1.15.0 drametadata (p5.48xlarge: 32 EFA on 8 roots x 4; 8 GPUs one per same root), options.go L78,
values.yaml L216-L219 and L282-L286, dra.md L188, L191, L340-L370; cloud-provider-aws v1.37.0 instances_v2.go
L95-L117, well_known_labels.go L22, L26; SDK v3.27.0 utils.py L46-L64, torchrun L56-L64, mpi_utils L284-L291,
v3.24.0 has p5/p5e, v3.23.0 has p5 in NCCL list only; DLC f6bed33a base Dockerfile L130-L132, yml L20-L30,
install script L6-L13, L37-L50, L61-L62, Dockerfile.cuda L169-L173, L182-L205, L320-L322, nccl_allreduce.sh
L23-L47, test_efa.py L1-L10, ec2 yml efa_version latest; NVDP v0.19.2 L118 Value true, v0.19.3 and v0.20.1 no
Value, v0.20.1 helm values L38 null; CTK v1.20.1 mofed.go L25-L36; Bottlerocket v1.67.0 Twoliter kits 9.4.1 /
17.2.0, kernel-kit v9.4.1 spec L1, L8, L15, L29, core-kit v17.2.0 rdma-core.spec L111-L136, CHANGELOG v1.67.0
L127-L130; amazon-eks-ami 9c99e21e install-efa.sh L6-L8, L53, L63-L65, pkrvars L11, L18-L19, template.pkr.hcl
L125, L129, Makefile L94-L95, al2023.md L34-L35, L70; release v20261019 (7 efa 3.3.0-1.amzn2023 rows);
aws-ofi-nccl v1.22.0 hostfile-topologify.py L110-L125, doc/topology-aware.md identical to v1.20.0; ai-on-eks
variables.tf L160-L164; awsome-distributed-ai nccl-tests.yaml L21-L24. Live docs: device-management-efa,
ml-workload-topology, create-node-pool, ml-eks-optimized-ami, CLI describe-capacity-reservation-topology,
HyperPod task governance, ec2-capacity-blocks, efa-changelog, SMP and SMDDP release notes, HyperPod Slurm AMI
releases, distributed-training-get-started, API_ResourceConfig, slurm.schedmd.com/spank.html.

## Pin moves applied

| Pin | From | To | File |
|---|---|---|---|
| EKS AMI (amazon-eks-ami) | ac5f340c | 9c99e21e, with the rebuild command fixed (E26) | EKSIntegration.tsx |
| EFA device plugin chart (aws/eks-charts) | bfe91c4b | ab081b33 | EKSIntegration.tsx |
| Bottlerocket kernel-kit / core-kit | v7.2.1 / v15.0.0 | v9.4.1 / v17.2.0 (OS CHANGELOG at v1.67.0) | EKSIntegration.tsx |
| NVIDIA container toolkit | v1.19.1 | v1.20.1 | EKSIntegration.tsx |
| Upstream dranet (latest) | v1.4.0 | v1.5.0 | EKSIntegration.tsx |
| NVIDIA device plugin | v0.19.0, v0.18.2 | added v0.19.2, v0.19.3, v0.20.1 (v0.19.0, v0.18.2 kept) | EKSIntegration.tsx |
| Karpenter (new refs) | none | v1.15.0 | EKSIntegration.tsx |
| EKS AMI release table | v20260728 | v20261019 | EKSIntegration.tsx |
| aws-ofi-nccl (hostfile-topologify.py, doc/topology-aware.md) | v1.20.0 | v1.22.0 (both inline refs; cited lines identical) | TopologyApi.tsx |
| Karpenter (zero-hit search) | v1.14.0 | v1.15.0 | TopologyApi.tsx |
| kubernetes/cloud-provider-aws (new refs) | none | v1.37.0 | TopologyApi.tsx |
| SageMaker Python SDK (container drivers) | master 9ff3e5fa | tag v3.27.0, plus v3.23.0 for the pre-v3.24.0 lists | SageMaker.tsx |
| Deep Learning Containers | 4c921b9e | f6bed33a | SageMaker.tsx |
| EFA installer (NGC behaviour, new refs) | none | 1.51.0 and 1.50.0 tarballs | SageMaker.tsx |

## CLAIM DIFF

Read date for every new or changed SourceRef: 2026-10-23. Tier: T1 = Tier 1. Code URLs are pinned (SHA or tag).

### EKSIntegration.tsx

| file:line | new text (short) | source (pinned) + tier | register row |
|---|---|---|---|
| EKSIntegration.tsx:355, 433 | Diagram row `efa-3.3.0-1.amzn2023`; caption names release v20261019 for the driver version | https://github.com/awslabs/amazon-eks-ami/releases/tag/v20261019 (T1) | E22 |
| EKSIntegration.tsx:462 | Karpenter chip: "DRA from v1.15, feature gated." | device-management-efa.html (T1); karpenter-provider-aws v1.15.0 options.go#L78 (T1 code) | E4 |
| EKSIntegration.tsx:468, 560 | Auto Mode chip kept; caption "Auto Mode has no DRA support, and the aws-dranet chart enforces that with a node affinity rule." | device-management-efa.html (T1); eks-charts c043cef4 stable/aws-dranet/templates/daemonset.yaml#L33-L66 (T1 code) | E4, E3 |
| EKSIntegration.tsx:627 | Table DRA row "Karpenter v1.15 and later, managed node groups, self-managed nodes" | device-management-efa.html comparison table (T1) | E2 |
| EKSIntegration.tsx:662 | "AL2023 (Amazon Linux 2023)" first-use expansion | n/a (acronym) | 04 acronym row |
| EKSIntegration.tsx:682 | Removed the `# eksctl 0.215.0 or later` comment from the shortest-path YAML | source removed from live doc | E16 |
| EKSIntegration.tsx:727-729 | NVIDIA DRA driver on Bottlerocket: disable the bundled plugin first, Bottlerocket 1.63.0 or later | https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html (T1) | E31 |
| EKSIntegration.tsx:746-749 | --minimal line plus "AMI component list names the result EFA minimal, the kernel module and rdma-core"; provenance code-confirmed | ml-eks-optimized-ami.html (T1); amazon-eks-ami 9c99e21e templates/al2023/provisioners/install-efa.sh#L53 (T1 code) | E20 |
| EKSIntegration.tsx:750-751 | enable_efa default true | amazon-eks-ami 9c99e21e templates/al2023/variables-default.pkrvars.hcl#L11 (T1 code) | E21 |
| EKSIntegration.tsx:752-754 | "Release v20261019 ... efa package row reads 3.3.0-1.amzn2023 across all five AL2023 variants" | releases/tag/v20261019 (T1) | E22 |
| EKSIntegration.tsx:779 | plugin "shipped as the libnccl-ofi package" (version dropped) | aws-efa-installer 1.49.0 tarball (T1) | E22 (version-neutral wording) |
| EKSIntegration.tsx:801-802 | Doc quote "EKS-optimized AL2023 AMIs and all Bottlerocket AMIs" ("accelerated" dropped) | device-management-efa.html (T1) | E25 |
| EKSIntegration.tsx:809-811 | Bottlerocket "downloads a pinned 1.49.0 tarball" | bottlerocket-kernel-kit v9.4.1 packages/kmod-6.18-efa/kmod-6.18-efa.spec#L1-L29 (T1 code) | E23 |
| EKSIntegration.tsx:815-817 | AL2023 "pulls the latest installer at build time and lands EFA driver 3.3.0" | amazon-eks-ami 9c99e21e install-efa.sh#L14 (T1 code); releases/tag/v20261019 (T1) | E23 |
| EKSIntegration.tsx:818-820 | Bottlerocket "pins installer 1.49.0, whose driver is 3.1.0, and its RPM Version field reads 3.0.0" | kernel-kit v9.4.1 kmod-6.18-efa.spec#L1-L29 (T1 code); https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html (T1) | E23 |
| EKSIntegration.tsx:821-823 | rdma-core strips every provider except libefa (ref moved; trailing triad sentence cut) | bottlerocket-core-kit v17.2.0 packages/rdma-core/rdma-core.spec#L111-L136 (T1 code) | E24 |
| EKSIntegration.tsx:842-844 | Rebuild command without `nvidia_driver_major_version` | amazon-eks-ami 9c99e21e Makefile#L94-L95 (T1 code) | E26 |
| EKSIntegration.tsx:847-853 | Driver majors default 580 (LTS) and 595 (pb); set nvidia_driver_lts_version and nvidia_driver_pb_version together; Makefile drops undeclared names | amazon-eks-ami 9c99e21e templates/al2023/variables-default.pkrvars.hcl#L18-L19, doc/usage/al2023.md#L34-L35, Makefile#L94-L95 (T1 code) | E26 |
| EKSIntegration.tsx:882 | Alert header "Two networking rules bind here: one Availability Zone and a self-referencing security group"; checklist sentence deleted | efa-start.html (T1, re-read 2026-10-23) | 04 changelog-voice row (871-872), E37 |
| EKSIntegration.tsx:906-909 | "The efaEnabled setting cannot create them, because it configures every interface as type efa, so use a NodeClass, an EC2NodeClass or a launch template instead" | device-management-efa.html (T1) | E32, E15 |
| EKSIntegration.tsx:917-919 | network card 0 cannot be efa-only (citation repointed) | device-management-efa.html (T1) | E15, E33 |
| EKSIntegration.tsx:947-949 | "With the EFA DRA driver, leave networkInterfaces unset: Karpenter documents it as unsupported there" | karpenter-provider-aws v1.15.0 website/content/en/preview/tasks/dra.md#L191 (T1) | E34 (NEW caveat) |
| EKSIntegration.tsx:1031 | efa-only "needs VPC CNI 1.18.5 or later" (only floor kept) | device-management-efa.html (T1) | E16 |
| EKSIntegration.tsx:1063-1067 | DRA recommended on 1.34+ on Karpenter, MNG or self-managed; Auto Mode no DRA; co-install "can silently oversubscribe the same devices" | device-management-efa.html (T1) | E1, E11 |
| EKSIntegration.tsx:1067-1070 | Karpenter supports the driver from v1.15 for static and dynamic provisioning; dynamic behind alpha gates, default off | device-management-efa.html (T1) + karpenter v1.15.0 pkg/operator/options/options.go#L78 (T1 code), charts/karpenter/values.yaml#L216-L219 (T1 code) | E1 |
| EKSIntegration.tsx:1088-1095 | Alert rewritten: charts keep DRA off Auto Mode; nothing in either chart separates DRA from device plugin nodes on Karpenter; give the NodePools separate labels | eks-charts c043cef4 aws-dranet daemonset.yaml#L33-L66, ab081b33 aws-efa-k8s-device-plugin daemonset.yaml#L60-L64 (T1 code); karpenter v1.15.0 dra.md#L340-L370 (T1) | E3 |
| EKSIntegration.tsx:1112-1115 | "chart is version v0.5.33 with app version v0.5.21-eksbuild.13" | eks-charts ab081b33 stable/aws-efa-k8s-device-plugin/Chart.yaml#L4-L5 (T1 code) | E5 |
| (deleted) | "Version floors that bite" Alert (plugin v0.5.6, VPC CNI 1.7.10, eksctl 0.215.0, Bottlerocket 1.28.0) | source page removed (node-efa.html 301) | E16 |
| EKSIntegration.tsx:1185-1191 | Header "three upstream minors behind"; "Upstream kubernetes-sigs/dranet is at v1.5.0, three minor releases past that image"; "sits at chart version 1.0.0" | https://github.com/kubernetes-sigs/dranet/releases/tag/v1.5.0 (T1) | E9, E8 |
| EKSIntegration.tsx:1236-1242 | Info Alert: 32 EFA devices on eight PCIe roots, four per root; eight GPUs one per root (code-derived) | device-management-efa.html (T1); karpenter v1.15.0 pkg/providers/drametadata/zz_generated_efa_metadata.go#L449-L773 and zz_generated_gpu_metadata.go#L1806-L1914 (T1 code) | E13 |
| (deleted) | "genuine internal contradiction" paragraph about the NCCL walkthrough | node-efa.html merged; live walkthrough "Each worker requests all eight GPUs" | E14 |
| EKSIntegration.tsx:1255-1256 | Upstream benchmark caveat cut to one sentence | dranet v1.5.0 site/content/docs/user/aws-eks-efa.md#L109-L118 (T1 code, pin moved) | length trim |
| EKSIntegration.tsx:1301, 1309-1311 | hostNetwork absent from the device management page "including in its workload pod examples and its NCCL test walkthrough"; header "why some AWS samples set it" | device-management-efa.html (T1) | E15 |
| EKSIntegration.tsx:1376-1381 | 5128 pages cited to device-management-efa; "Bottlerocket supports static and transparent huge pages from release 1.64.0"; pre-allocation sentence dropped | device-management-efa.html (T1); https://github.com/bottlerocket-os/bottlerocket/blob/v1.67.0/CHANGELOG.md#L127-L130 (T1) | E17, E18 |
| EKSIntegration.tsx:1386-1387 | "AWS uses the Kubeflow MPI Operator for its NCCL test walkthrough" (citation repointed) | device-management-efa.html (T1) | E19 |
| EKSIntegration.tsx:1397, 1399 | h2 description "Set mofedEnabled=false on every version: ... v0.19.0 to v0.19.2 hand every EFA device to every GPU pod"; MOFED expanded | NVIDIA/k8s-device-plugin tags below (T1 code) | E27, 04 acronym row |
| EKSIntegration.tsx:1405-1414 | Doc statement kept as doc-code-conflict ("from v0.19.0 ... defaults to true", no upper bound) | device-management-efa.html (T1) vs k8s-device-plugin v0.19.3 cmd/nvidia-device-plugin/main.go#L114-L118 (T1 code) | E27 |
| EKSIntegration.tsx:1418-1425 | Value: true in v0.19.0 through v0.19.2; no Value in v0.18.2 and from v0.19.3; v0.20.1 false, Helm mofedEnabled null | k8s-device-plugin v0.19.0 and v0.19.2 main.go#L116-L121, v0.19.3 main.go#L114-L118, v0.20.1 main.go#L115-L119, v0.20.1 deployments/helm/nvidia-device-plugin/values.yaml#L38 (T1 code) | E27 |
| EKSIntegration.tsx:1426-1428 | mofed discoverer globs (ref moved) | NVIDIA/nvidia-container-toolkit v1.20.1 internal/discover/mofed.go#L25-L36 (T1 code) | E28 |
| EKSIntegration.tsx:1434-1436 | Auto Mode unaffected (citation repointed); "Set mofedEnabled=false explicitly whatever version you run" | device-management-efa.html (T1) | E29, E27 |
| EKSIntegration.tsx:1475-1478 | ai-on-eks "defaults to the one-IP layout, policy 1; set efa_network_interfaces_policy to 2 for the eight-IP layout" | ai-on-eks 5e6282cb infra/base/terraform/variables.tf#L160-L164, modules/efa-networkinterfaces-generator/locals.tf#L25-L37 (T1 code) | R11 |
| EKSIntegration.tsx:1488-1491 | "One archived repository to skip"; "still links there" sentence deleted; archive-date aside cut | device-management-efa.html, 0 occurrences (T1) | E40 |
| EKSIntegration.tsx:1535-1537 | "The AWS NCCL test walkthrough deploys the Kubeflow MPI Operator, which runs Allreduce-style distributed jobs ... through the MPIJob custom resource" | device-management-efa.html (T1) | E19 |
| EKSIntegration.tsx:1550 | LD_LIBRARY_PATH ends `:/usr/local/nvidia/lib:$LD_LIBRARY_PATH` | awsome-distributed-ai cb99a28a micro-benchmarks/nccl-tests/kubernetes/nccl-tests.yaml#L21-L24 (T1 code) | R5 |
| EKSIntegration.tsx:78-200 (metadata) | node-efa.html and device-management-nvidia.html DocRefs removed; all eksNode / eksNvidia citations repointed to device-management-efa.html | curl -I node-efa.html: 301 to device-management-efa.html (T1) | E15, E29 |

### TopologyApi.tsx

| file:line | new text (short) | source (pinned) + tier | register row |
|---|---|---|---|
| TopologyApi.tsx:24-30 | ACCESSED/READ 2026-10-23; throttling, consistency, pcsUltra, crTopoGa, containersBlog, slurmDepth, slurmEmit, k8sLabeler keep 2026-08-02 | n/a (dates) | dated-claim sweep |
| TopologyApi.tsx:157-168 | topologify and topologifyDoc pinned to v1.22.0 (L110-L125 and L122-L149 unchanged) | https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/contrib/scripts/topology_aware/hostfile-topologify.py#L110-L125 ; .../blob/v1.22.0/doc/topology-aware.md#L122-L149 (T1 code) | I-09 pin, T3 |
| TopologyApi.tsx:691, 697-700 | headerDescription "Two Tier 1 pages say three layers, a Tier 2 blog implies four"; "The EKS (Elastic Kubernetes Service) topology labels page puts p6e-gb200 in its three-layer row, with network-node-layer-3 as the bottom layer" | https://docs.aws.amazon.com/eks/latest/userguide/ml-workload-topology.html (T1) | T4 |
| TopologyApi.tsx:716 | "All three are AWS authored and cannot all describe the same response"; conflict string names both Tier 1 pages | ml-workload-topology.html, ec2-instance-topology-prerequisites.html (T1); Containers blog (T2) | T4 |
| TopologyApi.tsx:1032-1046 | Heading "two ways on two pages"; "The API reference and the AWS CLI reference both state a maximum of 10 ... MaxResults default of 10 with a valid range of 1 to 10"; CLI-100 conflict leg removed; examples page 20/100 conflict kept | https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeCapacityReservationTopology.html , https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-reservation-topology.html , ec2-instance-topology-examples.html (T1, all re-read 2026-10-23) | T14 |
| TopologyApi.tsx:1053, 1058 | "survives both readings"; "The CLI reference and the examples page also disagree on the flag name" | same (T1) | T14, T15 |
| TopologyApi.tsx:1210-1217 | EKS control plane writes the labels: the AWS cloud controller manager calls DescribeInstanceTopology at registration and writes one network-node-layer-N label per network node, top down (code-confirmed); MNG, self-managed, Karpenter and Auto Mode nodes alike, no add-on, no IAM grant | ml-workload-topology.html (T1) + https://github.com/kubernetes/cloud-provider-aws/blob/v1.37.0/pkg/providers/v1/instances_v2.go#L95-L118 (T1 code) | T20 |
| TopologyApi.tsx:1220-1228 | Alert "EKS labels every node of a supported type, once, at registration": unsupported types get no labels, unsupported Region gets none, set once and never refreshed; zone-id names the same physical zone in every account (zone-id repointed from the aws-ofi-nccl doc) | ml-workload-topology.html (T1); https://docs.aws.amazon.com/eks/latest/userguide/create-node-pool.html (T1) + https://github.com/kubernetes/cloud-provider-aws/blob/v1.37.0/pkg/providers/v1/well_known_labels.go#L22-L26 (T1 code) | T20, T22 |
| TopologyApi.tsx:1230-1235 | HyperPod task governance applies network-node-layer-1 through -4 (layer-4 only on four-layer types) | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-tasks-scheduling.html (T1) | T16 |
| TopologyApi.tsx:1239-1247 | kubectl block adds `-L topology.k8s.aws/network-node-layer-4`; required-topology comment reads "under one layer-3 node" | ml-workload-topology.html Step 1 (T1) | T16 |
| TopologyApi.tsx:1281-1287 | Karpenter v1.15.0 zero hits for network-node-layer and DescribeInstanceTopology; "Its nodes carry them anyway, from the cloud controller manager in the EKS control plane"; Auto Mode / Karpenter well-known-label-table sentence and ml-node-pools.html source removed | https://github.com/aws/karpenter-provider-aws/tree/v1.15.0/pkg (T1 code); ml-workload-topology.html (T1) | T18, T19 |
| TopologyApi.tsx:1299, 1309-1310 | Fallback rescoped: "For Kubernetes on EC2 outside EKS, where no control plane writes the labels"; "On EKS it duplicates what the control plane already writes" | ml-workload-topology.html (T1) | T21 |
| (deleted) | Expandable "Does EKS label every supported type, or only P6e-GB200?" and its doc-conflict SourceRef | resolved by ml-workload-topology.html + CCM v1.37.0 (T1) | T20 |
| TopologyApi.tsx:1383-1384 | "One open contradiction. The depth of p6e-gb200.36xlarge has AWS sources on each side. Read the depth from the response rather than from a table." | n/a (summary of T4) | T20 |
| TopologyApi.tsx:1403-1406 | "Capacity Blocks take no placement group at all, and several blocks, instance or UltraServer, can sit in one Capacity Reservation Resource Group" | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html (T1) | C15, C18 |

### SageMaker.tsx

| file:line | new text (short) | source (pinned) + tier | register row |
|---|---|---|---|
| SageMaker.tsx:24-38 | ACCESSED_OCT / READ_OCT; SDK pinned to tag v3.27.0 (was master SHA); SDK_OLD v3.23.0; DLC_SHA f6bed33a | n/a (pins and dates) | S1, S6, S11-S15 |
| SageMaker.tsx:77-131 | Re-read docs moved to 2026-10-23: trainEfa, distStart, repair, resourceConfig, ddpSupport, ddpRelease, smpRelease, amiPolicy, amiSlurm, deepHealth, topology, observability, eksPrereq, dpd, eksEfa | live pages, 2026-10-23 (T1) | dated-claim sweep |
| SageMaker.tsx:442 | Gate 3 note "P5en, P6-B200, P6-B300, P6e-GB200, Trn2, G6e and G7e." (P5e and the P5 RDMA line dropped) | https://github.com/aws/sagemaker-python-sdk/blob/v3.27.0/sagemaker-train/src/sagemaker/train/container_drivers/common/utils.py#L46-L64 (T1 code) | S2 |
| SageMaker.tsx:641-642 | Table: ml.p5.48xlarge yes/yes, ml.p5e.48xlarge yes/yes | same (T1 code) | S1 |
| SageMaker.tsx:722 | Intro "a hardcoded allowlist that stops at P5e" | same (T1 code) | S1 |
| SageMaker.tsx:753-756 | ResourceConfig members add "an ordered fallback list of up to five instance types (InstancePreferences)" | https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ResourceConfig.html (T1) | S7 |
| SageMaker.tsx:769-770 | Subnet alert: restatement cut to "That is exactly the boundary EFA traffic cannot cross." | train-get-capacity.html (T1, unchanged) | length trim |
| SageMaker.tsx:803-821 | Code block lists include ml.p5e.48xlarge in both and ml.p5.48xlarge in the RDMA list | utils.py v3.27.0 #L46-L64 (T1 code) | S1 |
| SageMaker.tsx:824-833 | "Read at SDK release v3.27.0"; "Releases before v3.24.0 leave ml.p5e.48xlarge off both lists and ml.p5.48xlarge off the second, so pin v3.24.0 or later for P5 and P5e"; torchrun and mpirun refs moved | utils.py v3.23.0 #L46-L61; torchrun_driver.py v3.27.0 #L56-L64; mpi_utils.py v3.27.0 #L284-L291 (T1 code) | S4, S6 |
| SageMaker.tsx:855 | Alert type list without ml.p5e.48xlarge | utils.py v3.27.0 (T1 code) | S3 |
| (deleted) | Expandable "On P5, two AWS-owned repositories disagree about FI_EFA_USE_DEVICE_RDMA" and the dlcRdmaArg ref | resolved at SDK v3.24.0 (T1 code) | S4 |
| SageMaker.tsx:940-946 | Base "pins NCCL 2.29.7-1 and installs whichever EFA installer is latest at build time"; read /opt/amazon/efa_installed_packages, the file the build log quotes; the EFA installer changelog maps the version to components (GDRCopy and the 1.49.0 component comment dropped) | https://github.com/aws/deep-learning-containers/blob/f6bed33af5a829fccdca760f2011466e245090d0/docker/base/cu132/Dockerfile#L130-L132 , .../scripts/docker/common/install_efa_amzn2023.sh#L48-L50 (T1 code); https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html (T1) | S11 |
| SageMaker.tsx:952-955 | PyTorch 2.13 image: "the latest EFA installer at build time"; EC2 variant "identical NCCL, EFA and GDRCopy settings" | .../f6bed33a.../.github/config/image/pytorch/2.13-sagemaker-cuda.yml#L20-L30 (T1 code) | S12 |
| SageMaker.tsx:962-966 | Install flags ref moved to L48 | install_efa_amzn2023.sh @f6bed33a #L48 (T1 code) | S13 |
| SageMaker.tsx:970-976 | Plugin path: "EFA_VERSION=latest takes the first branch" | install_efa_amzn2023.sh @f6bed33a #L6-L13 (T1 code) | S13 |
| SageMaker.tsx:979-991 | Item 3 rewritten. NGC (NVIDIA GPU Cloud) detection by /opt/nvidia/nvidia_entrypoint.sh. Installer 1.51.0 on Ubuntu 22.04/24.04/26.04 installs libnccl-ofi-ngc in place of libnccl-ofi; on any other container prints "This container is not Ubuntu" and does the standard install, plugin included. 1.50.0 has no fallback and no NGC plugin package for Amazon Linux, so an AL2023 NGC base gets no plugin. DLC passes --disable-ngc for latest and 1.48.0+ | https://efa-installer.amazonaws.com/aws-efa-installer-1.51.0.tar.gz (efa_installer.sh L1317-L1350 ngc_pre_install, L760-L798 ngc_filter_package, DEBS libnccl-ofi-ngc-v1/v2/v3 1.22.0) (T1, code-derived, not executed); https://efa-installer.amazonaws.com/aws-efa-installer-1.50.0.tar.gz (ngc_pre_install L1316-L1339, skip at L795-L796, no ngc RPMs) (T1); install_efa_amzn2023.sh @f6bed33a #L37-L46 (T1 code) | coordinator item, 01 I-11, S13 |
| SageMaker.tsx:1006-1009 | Accuracy fix: "LD_LIBRARY_PATH puts the pip-installed cuDNN and NCCL first, then aws-ofi-nccl, Open MPI and the EFA libraries, all ahead of /usr/local/cuda/lib64" (was "puts the EFA stack first") | docker/pytorch/Dockerfile.cuda @f6bed33a #L320-L322 (T1 code) | S14 (non-register accuracy fix) |
| SageMaker.tsx:1009-1020 | nccl-tests and cudart refs moved; connector sentence cut | Dockerfile.cuda @f6bed33a #L182-L205, #L169-L173 (T1 code) | S14 |
| SageMaker.tsx:1078-1081 | Diagnostics claim repointed from the validator lines to the diagnostics block | test/efa/scripts/nccl_allreduce.sh @f6bed33a #L59-L75 (T1 code) | S15 (non-register citation fix) |
| SageMaker.tsx:1095, 1101 | Header "SMDDP (SageMaker Distributed Data Parallel): a P4-era library, frozen since April 2025" | data-parallel-release-notes.html, model-parallel-release-notes.html (T1) | S17, 04 acronym row |
| SageMaker.tsx:1115-1129 | "The SMDDP release notes stop at v2.5.0, dated October 17, 2024, while the release notes of SMP (the SageMaker model parallelism library) record SMDDP 2.6.0 inside SMP v2.8.0, dated April 1, 2025, the newest release of either library located" (doc conflict SourceRef); "unchanged since April 2025"; "no longer available" reworded | https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-release-notes.html , https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-release-notes.html , distributed-data-parallel-support.html (T1) | S17, 04 acronym row (SMP) |
| SageMaker.tsx:1167-1168 | "PyTorch FSDP (Fully Sharded Data Parallel)" | n/a (acronym) | acronym standard |
| SageMaker.tsx:1192-1198 | "As of October 23, 2026, the ... getting-started page says"; "allowlist stopping at P5e" | https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-training-get-started.html (T1) | S18 |
| SageMaker.tsx:1258-1264 | "The September 17, 2026 release puts the Slurm 25.11 AMIs, x86_64 and ARM64, on EFA installer 1.50.0 with rdma-core 64.0amzn0-1, NVIDIA driver 595.91.07, CUDA 13.2 and Slurm 25.11.8. The Default Ubuntu 22.04 and 24.04 variants ... list EFA installer 1.47.0 with rdma-core 61.0-1, the version every release from April 23 to August 29, 2026 carried." "The variant you pick decides the EFA version." | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-ami-slurm.html (T1) | S20 |
| SageMaker.tsx:1301-1302 | Deep health checks: closing restatement sentence cut | n/a | length trim |
| SageMaker.tsx:1364-1365 | "SPANK (Slurm Plug-in Architecture for Node and job (K)control)" | https://slurm.schedmd.com/spank.html (T1 expansion) | 04 acronym row |
| SageMaker.tsx:1380 | "Dated May 27, 2026 and open on the release notes page as of October 23, 2026" | sagemaker-hyperpod-release-ami-slurm.html (T1) | S21 |
| SageMaker.tsx:1430-1431 | Flexible groups: "within an Availability Zone, which is the EFA boundary" ("is unchanged" removed) | flexGroups What's New (T1, unchanged) | changelog voice |
| SageMaker.tsx:1442 | h2 description "Disaggregated prefill and decode (DPD), ..." | n/a (acronym) | 04 acronym row |
| SageMaker.tsx:1523 | "SSM (AWS Systems Manager) access" | n/a (acronym) | 04 acronym row |
| SageMaker.tsx:1664-1668 | Step 1: "On ml.p5.48xlarge and ml.p5e.48xlarge, SDK v3.24.0 or later sets both. On P5en and anything newer, set both yourself." | utils.py v3.27.0 #L46-L64 (T1 code) | S5 |

## Diagrams touched

- EKSIntegration.tsx MinimalFlagDiagram: one row label (same length) and the caption.
- EKSIntegration.tsx NodeLanesDiagram: Karpenter chip (longest line 26 chars, equal to the longest existing chip line) and Auto Mode chip (shorter), caption.
- SageMaker.tsx FourGatesDiagram: gate 3 note drops from three lines to two; box height is fixed at 90 and notes start at y+42, so nothing moves.
- No diagram geometry changed. Rendered-overlap confirmation is left to the orchestrator's Playwright pass.

## Requested orchestrator changes (Sources.tsx, sources.md, README.md)

New Sources entries (all read 2026-10-23):
- Karpenter v1.15.0: website/content/en/preview/tasks/dra.md (L191, L340-L370), pkg/operator/options/options.go L78, charts/karpenter/values.yaml L216-L219, pkg/providers/drametadata zz_generated_efa_metadata.go and zz_generated_gpu_metadata.go. Tier 1 code.
- kubernetes/cloud-provider-aws v1.37.0 pkg/providers/v1/instances_v2.go L95-L118 and well_known_labels.go L22-L26. Tier 1 code.
- EKS User Guide: ml-workload-topology.html ("Place distributed AI/ML workloads with network topology labels") and create-node-pool.html. Tier 1.
- EC2 User Guide: ec2-capacity-blocks.html ("Capacity Blocks for ML") and efa-changelog.html. Tier 1.
- aws/sagemaker-python-sdk tags v3.27.0 and v3.23.0 (container_drivers/common/utils.py). Tier 1 code.
- aws/deep-learning-containers f6bed33af5a829fccdca760f2011466e245090d0. Tier 1 code.
- Bottlerocket CHANGELOG at v1.67.0, kernel-kit v9.4.1, core-kit v17.2.0. Tier 1 code.
- kubernetes-sigs/dranet release v1.5.0. Tier 1.
- amazon-eks-ami 9c99e21e and release v20261019. Tier 1.
- NVIDIA/k8s-device-plugin v0.19.2, v0.19.3, v0.20.1; NVIDIA/nvidia-container-toolkit v1.20.1. Tier 1 code.
- aws-efa-installer 1.50.0 and 1.51.0 tarballs. Tier 1.
- aws/aws-ofi-nccl v1.22.0 (hostfile-topologify.py, doc/topology-aware.md). Tier 1 code.
- SageMaker model-parallel-release-notes.html (SMP v2.8.0 entry). Tier 1.

Replace or retire:
- EKS User Guide node-efa.html (301 to device-management-efa.html) and device-management-nvidia.html: no section cites them any more; point any Sources entry at device-management-efa.html.
- EKS ml-node-pools.html: no longer cited by TopologyApi.tsx.
- Any Sources entry for the DLC 1.49.0 component comment or SDK master 9ff3e5fa.

Glossary additions: AL2023 (Amazon Linux 2023), MOFED (Mellanox OpenFabrics Enterprise Distribution), LTS (long-term support), SMDDP (SageMaker Distributed Data Parallel), SMP (SageMaker model parallelism library), DPD (disaggregated prefill and decode), SPANK (Slurm Plug-in Architecture for Node and job (K)control), SSM (AWS Systems Manager), NGC (NVIDIA GPU Cloud), FSDP (Fully Sharded Data Parallel).

## Rows skipped, with reasons

- S9 (add ml.g7 to gate 1): EFA support on g7 was not verified; the enum alone does not show an EFA device.
- S2 / S3 optional "G7" in the skipped-types lists: same reason as S9.
- S22 optional (HyperPod stops at Kubernetes 1.35, so DRA means 1.34 or 1.35): the existing text already tells the reader to check the 1.34 requirement against the 1.30 to 1.35 range.
- SDK_TAG v2.257.0 to v2.257.7, BOTOCORE_TAG, ADAI_SHA: optional pin moves, cited lines identical, not taken.
- NVLink (TopologyApi, SageMaker): brand name, not an acronym to expand.
- E1 doc-prerequisites inconsistency note: does not change what the reader configures.
- T21 "the DaemonSet is not a refresh mechanism" clause: the labels-set-once fact already sits in the new EKS Alert.
- Kueue layer-3 on four-layer types: the annotation examples keep layer-3; only the comment was made accurate ("under one layer-3 node").
- E6, E7, E8, E10, E12, E30, E33-E36, E38, E39, E41, R1-R4, R6-R10, T1-T3, T5-T13, T15, T17, T22, S8, S10, S15, S16, S19, S23-S25: CORRECT in the register; only pins, dates or citation targets moved where noted.

## Checks (2026-10-23, foreground, repo root)

- `pnpm --filter @tech-deep-dives/efa typecheck`: pass.
- `pnpm --filter @tech-deep-dives/efa lint`: pass (max-warnings 0).
- `pnpm --filter @tech-deep-dives/efa test`: 12 of 12 pass.
- `scripts/gates/no-ai-tells.sh`, `svg-a11y.sh`, `pinned-refs.sh`, `pre-overflow.sh`: all PASS.
- No errors were reported from files owned by other agents.

STATUS: COMPLETE
