# 10b AWS PCS and SageMaker HyperPod: research register

## 1. Header

- Research date and access date for every source: 2026-11-20.
- Area: two of the four AWS cluster orchestrators the dive draws. AWS Parallel Computing Service (PCS), which is managed Slurm, in entries F10-200 to F10-245. Amazon SageMaker HyperPod, a persistent cluster of SageMaker-managed instances scheduled by Slurm or by Amazon EKS, in entries F10-300 to F10-334.
- Sections fed: section 26 (PCS), section 27 (HyperPod), and the comparison in section 24 (overview). Sections 25 (Batch) and 28 (EKS) are referenced only at hand-offs.
- Sources: first-party only. AWS documentation (PCS User Guide and API Reference, SageMaker AI Developer Guide and API Reference), AWS What's New posts, one AWS News Blog post, the PCS pricing and FAQ pages. No third-party page is cited. No GitHub repository was pinned (see section 3).
- How pages were fetched: `curl` with a generic client name and no contact address, against the markdown form of each documentation page (the page URL with `.md` appended). 214 PCS User Guide pages, 322 SageMaker Developer Guide pages on HyperPod, and the API Reference pages named in section 12 were downloaded today and searched locally. What's New, blog, pricing and FAQ pages were fetched as HTML and reduced to text. The URLs printed in entries are the public `.html` URLs.
- Quote policy: every quoted string is verbatim from the page as fetched, checked mechanically against the downloaded copy (whitespace-insensitive). House normalisation only: curly quotes to straight quotes, typographic dashes to a hyphen. Markdown escapes that the `.md` form of a page carries (for example `\~` and `\_`) are left as fetched. Two symbols in one formula (F10-328) are written as "x" and "-" in the claim; the quote lines do not contain the formula.
- Prices: no monetary value is copied. Where a page prints a price the entry says so.
- Labels: `[vendor claim]` for a figure AWS reports about itself, `[derived]` for arithmetic with inputs shown, `[our reading]` for an inference or an assembly of several pages. Absence claims ("no page read today documents X") are scoped to the pages downloaded today and each has an UNKNOWN id in section 11.
- IDs: entries F10-246 to F10-289 and F10-335 to F10-399 are unused.

## 2. Currency table

| Item | Newest found | Date | Source |
|---|---|---|---|
| Slurm versions on PCS | 26.05, 25.11 and 25.05 in the versions table; 25.05 reaches end of life on 11/30/2026 | 26.05 added 11 September 2026 (F10-242) | F10-203, https://docs.aws.amazon.com/pcs/latest/userguide/slurm-versions.html |
| PCS in-place Slurm upgrade | supported | 29 and 30 June 2026 | F10-204 |
| PCS CLI filter and job submit plugins | newest PCS feature found | 19 November 2026 | F10-230 |
| PCS GRES, hardware topology, MIG | supported | 11 September 2026 | F10-236 |
| PCS scaling logs | supported | 30 September 2026 | F10-219 |
| PCS node lifecycle actions | supported | 23 July 2026 | F10-214 |
| PCS UltraServers (P6e-GB200, P6e-GB300) | supported through Capacity Blocks | 18 June 2026 | F10-237 |
| PCS-ready Deep Learning AMI | available | 1 June 2026 | F10-212 |
| PCS per-node-group idle time | `scaleDownIdleTimeInSeconds` override per group | 28 May 2026 | F10-218 |
| PCS mixed static and dynamic scaling | supported | 18 May 2026 | F10-208 |
| PCS Regions | 27 | page as fetched 2026-11-20 | F10-241 |
| HyperPod release notes, newest heading | "November 16, 2026" (cluster operations) | 16 November 2026 | F10-332 |
| HyperPod dynamic ENI attachment | `AttachClusterNodeNetworkInterface`, VPC CNI v1.23.3-eksbuild.1 or later | release note 11 November 2026, What's New 18 November 2026 | F10-328 |
| HyperPod Kubernetes versions | 1.30 to 1.35 | page as fetched 2026-11-20 | F10-329 |
| HyperPod training operator Kubernetes versions | 1.28 to 1.33 | page as fetched 2026-11-20 | F10-317 |
| HyperPod task governance add-on | v1.6.1-eksbuild.1, installs Kueue v0.19.2 | page as fetched 2026-11-20 | F10-320 |
| HyperPod health monitoring agent floor for Karpenter | 1.0.742.0_1.0.241.0 | page as fetched 2026-11-20 | F10-312 |
| HyperPod flexible instance groups | up to 20 instance types per group | 16 April 2026 (release note), 17 April 2026 (What's New) | F10-308 |
| HyperPod G7e instances | supported | 27 April 2026 | F10-304 |
| HyperPod Slurm: AMI-based node configuration, MinCount, custom AMIs | supported | 7 May, 27 May, 13 July 2026 | F10-303, F10-307, F10-332 |
| HyperPod EFA-only network interfaces | supported | 1 June 2026 | F10-327 |
| HyperPod managed Karpenter | launched | 18 September 2025 | F10-312, register 09 F09-27 |

## 3. Pinned sources

No source-code repository is pinned in this register: every claim rests on a documentation page, an API Reference page or an announcement, each fetched on 2026-11-20. The documentation has no version tag, so the pin is the access date plus the page's own version markers where it has them:

- PCS User Guide, document history page (https://docs.aws.amazon.com/pcs/latest/userguide/doc-history.html): the dated change log that F10-242 quotes. Newest entry found: 19 November 2026.
- PCS Slurm versions table (https://docs.aws.amazon.com/pcs/latest/userguide/slurm-versions.html) and per-version release notes (https://docs.aws.amazon.com/pcs/latest/userguide/slurm-versions_release-notes.html).
- HyperPod release notes (https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-notes.html): four headings dated 2026 (25 January, 16 April, 11 November, 16 November).
- Version strings that pin behaviour: task governance add-on v1.6.1-eksbuild.1 with Kueue v0.19.2 (F10-320); training operator v1.2.0 for checkpointless training (F10-319); Kubeflow Training Operator 1.7.0, 1.8.0 or 1.8.1 for job auto-resume (F10-316); VPC CNI v1.23.3-eksbuild.1 for dynamic ENI attachment (F10-328).
- Not pinned: the HyperPod CLI repository and the HyperPod Helm chart repository are named by the documentation but were not opened or pinned to a commit today (U10-12). The Karpenter version HyperPod runs is not printed on the pages read (U10-13).

## 4. Claim register

Part A is AWS Parallel Computing Service (F10-200 to F10-289). Part B is Amazon SageMaker HyperPod (F10-300 to F10-399).

### A1. AWS PCS: what it is and the cluster object

**F10-200. AWS Parallel Computing Service (AWS PCS) is managed Slurm: AWS runs the Slurm controller, and the user defines three kinds of object. A cluster has 1 or more queues, each queue is associated with at least 1 compute node group, jobs are submitted to queues and run on EC2 instances that the compute node groups define. The scheduler both schedules the jobs and launches the instances.**
- Location: AWS PCS User Guide, "Concepts in AWS PCS"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/key-concepts.html | Tier 1, first-party docs | definition | "A cluster in AWS PCS has 1 or more queues, associated with at least 1 compute node group. Jobs are submitted to queues and run on EC2 instances defined by compute node groups." and "The scheduler accepts and schedules jobs, and also launches the compute nodes (EC2 instances) that process those jobs." ; https://docs.aws.amazon.com/pcs/latest/userguide/what-is-service.html | Tier 1, first-party docs | definition | "AWS Parallel Computing Service (AWS PCS) is a managed service that makes it easier to run and scale high performance computing (HPC) workloads, and build scientific and engineering models on AWS using Slurm." (accessed 2026-11-20)
- Use in dive: section 26, the opening definition and the three boxes of the cluster drawing (cluster, queue, compute node group).

**F10-201. A PCS cluster is created from five things: a name (3 to 40 characters), a scheduler (type `SLURM` and a version), a controller size (`SMALL`, `MEDIUM` or `LARGE`), one subnet and at least one security group, and an optional Slurm configuration (scale-down idle time, accounting, custom settings, the REST API mode, job submit plugins). The size, the VPC and the subnet cannot be changed after creation, and only 1 cluster per Region per account can be in the `Creating` state at a time.**
- Location: AWS PCS User Guide, "Creating a cluster in AWS PCS"; AWS PCS API Reference, CreateCluster
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/APIReference/API_CreateCluster.html | Tier 1, first-party docs | definition | "{ \"clientToken\": \"{{string}}\", \"clusterName\": \"{{string}}\", \"networking\": { \"networkType\": \"{{string}}\", \"securityGroupIds\": [ \"{{string}}\" ], \"subnetIds\": [ \"{{string}}\" ] }, \"scheduler\": { \"type\": \"{{string}}\", \"version\": \"{{string}}\" }, \"size\": \"{{string}}\", \"slurmConfiguration\": { \"accounting\": { \"defaultPurgeTimeInDays\": {{number}}, \"mode\": \"{{string}}\" }, \"cgroupCustomSettings\": [ { \"parameterName\": \"{{string}}\", \"parameterValue\": \"{{string}}\" } ], \"jobSubmitPlugins\": [ { \"name\": \"{{string}}\", \"scriptSource\": { \"checksum\": \"{{string}}\", \"s3VersionId\": \"{{string}}\", \"scriptLocation\": \"{{string}}\" }, \"type\": \"{{string}}\" } ], \"scaleDownIdleTimeInSeconds\": {{number}}, \"slurmCustomSettings\": [ { \"parameterName\": \"{{string}}\", \"parameterValue\": \"{{string}}\" } ], \"slurmdbdCustomSettings\": [ { \"parameterName\": \"{{string}}\", \"parameterValue\": \"{{string}}\" } ], \"slurmRest\": { \"mode\": \"{{string}}\" } }, \"tags\": { \"{{string}}\" : \"{{string}}\" } }" and "Length Constraints: Minimum length of 3. Maximum length of 40." and "Valid Values: `SMALL | MEDIUM | LARGE`" ; https://docs.aws.amazon.com/pcs/latest/userguide/working-with_clusters_create.html | Tier 1, first-party docs | documentation of a limit | "You can only set the controller size when the cluster is created." and "After you create the cluster, you can't change its VPC." and "There can only be 1 cluster in a `Creating` state per AWS Region per AWS account." ; https://docs.aws.amazon.com/pcs/latest/userguide/working-with_networking_vpc-requirements.html | Tier 1, first-party docs | documentation of a limit | "You can only specify the subnet for a cluster at creation time." (accessed 2026-11-20)
- Use in dive: section 26, the cluster moving part and the CreateCluster snippet.

**F10-202. The controller size fixes how much the managed Slurm controller can track: Small manages up to 32 instances and tracks up to 256 jobs, Medium up to 512 instances and 8192 jobs, Large up to 2048 instances and 16384 jobs. The job count includes running, pending and recently completed jobs (completed jobs stay in Slurm's memory 5 minutes by default), so a burst of short jobs can hit the limit with few jobs visible. The size cannot be changed: a different size means a new cluster.**
- Location: AWS PCS User Guide, "Cluster size in AWS PCS"; "Job submission MaxJobCount limit"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/working-with_clusters_size.html | Tier 1, first-party docs | documentation of a limit | "| Small | Up to 32 | Up to 256 |" and "| Medium | Up to 512 | Up to 8192 |" and "| Large | Up to 2048 | Up to 16384 |" and "You can't change the cluster size after you create the cluster. If you need to change the size, you must create a new cluster." and "The job count includes running, pending, and recently completed jobs." ; https://docs.aws.amazon.com/pcs/latest/userguide/troubleshooting-job-submission-maxjobcount.html | Tier 1, first-party docs | documentation of a limit | "Completed jobs remain in Slurm's memory for a period of time (by default, 5 minutes) before being purged." (accessed 2026-11-20)
- Use in dive: section 26, the controller box of the drawing and the limits table. For the arm: an evaluation sweep of 1,000 array tasks does not fit a Small cluster (256 jobs) `[our reading]`.

**F10-203. Slurm versions PCS supports on 20 November 2026 and their windows: 26.05 (PCS release date 9/10/2026, PCS end of life 11/30/2027), 25.11 (4/9/2026, end of life 5/31/2027) and 25.05 (10/16/2025, end of life 11/30/2026). Versions 24.11, 24.05 and 23.11 are no longer supported. When a version reaches end of life no new cluster can be created with it, and existing clusters may keep running for up to 12 months without guaranteed support. PCS applies Slurm patch versions to the controller automatically.**
- Location: AWS PCS User Guide, "Slurm versions in AWS PCS"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/slurm-versions.html | Tier 1, first-party docs | documentation of support | "| 26.05 | 5/26/2026 | 9/10/2026 | 11/30/2027 | 1.0.0-1 |" and "| 25.11 | 11/6/2025 | 4/9/2026 | 5/31/2027 | 1.0.0-1 |" and "| 25.05 | 5/29/2025 | 10/16/2025 | 11/30/2026 | 1.0.0-1 |" and "| 24.11 | 11/29/2024 | 5/14/2025 | 5/31/2026 |" and "After EOL, no new clusters can be created with that version, though existing clusters can continue running for up to 12 months without guaranteed support." and "AWS PCS is designed to automatically update the Slurm controller with patch versions." (accessed 2026-11-20)
- Use in dive: section 26, the currency line. Print "26.05, 25.11 and 25.05" and note that 25.05 reaches end of life on 30 November 2026, ten days after this research.

**F10-204. Since 29 June 2026 (What's New dated 30 June 2026) the Slurm major version of an existing PCS cluster can be upgraded in place, up to three major versions ahead, without interrupting running jobs: the controller is updated while the fleet keeps running, and existing nodes keep the previous Slurm version until they are drained and replaced.**
- Location: AWS PCS User Guide, "Update the scheduler version of an AWS PCS cluster"; What's New 30 June 2026
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/working-with_clusters_version_update_procedure.html | Tier 1, first-party docs | documentation of support | "The controller is updated while the fleet keeps running. Existing nodes continue using the previous Slurm version until they are drained and replaced. New nodes launched after the update use the target version. Running jobs are not interrupted." ; https://aws.amazon.com/about-aws/whats-new/2026/06/aws-parallel-computing-service-upgrade/ | Tier 2, launch announcement | launch announcement | "Posted on: Jun 30, 2026" and "You can move your clusters up to three Slurm major versions ahead with no disruption to running jobs." ; https://docs.aws.amazon.com/pcs/latest/userguide/doc-history.html | Tier 1, first-party docs | launch announcement | "| June 29, 2026 | New feature: Update the scheduler version of a cluster |" (accessed 2026-11-20)
- Use in dive: section 26, 2026 features; what "managed" buys over a self-run Slurm controller.

**F10-205. PCS runs Slurm in configless mode and the user has no direct access to `slurm.conf`: the controller holds the authoritative `slurm.conf`, `cgroup.conf` and `slurmdbd.conf`, PCS generates them from the cluster, queue and compute node group settings, compute nodes fetch them when `slurmd` starts, and login nodes fetch them through the `sackd` daemon. Only an allow-list of Slurm parameters can be set.**
- Location: AWS PCS User Guide, "Slurm configuration in AWS PCS"; "Configuring custom Slurm settings in AWS PCS"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/slurm-configuration.html | Tier 1, first-party docs | definition | "AWS PCS generates these files from your cluster, queue, and compute node group settings, and updates them as your cluster changes." and "AWS PCS runs Slurm in configless mode. In configless mode, nodes fetch the configuration directly from the cluster controller (`slurmctld`)." ; https://docs.aws.amazon.com/pcs/latest/userguide/slurm-custom-settings.html | Tier 1, first-party docs | documentation of a limit | "AWS PCS implements an allow-list approach to protect service security and operational stability." ; https://docs.aws.amazon.com/pcs/latest/userguide/slurm-accounting.html | Tier 1, first-party docs | documentation of a limit | "You don't have direct access to the `slurm.conf` for your AWS PCS cluster." (accessed 2026-11-20)
- Use in dive: section 26, the controller moving part and "what it does poorly" (a Slurm setting outside the allow-list cannot be used).

### A2. AWS PCS: compute node groups

**F10-206. A compute node group is a set of rules for creating compute nodes: which EC2 instance types, a minimum and a maximum instance count, the purchase option, the subnets, the AMI, security groups, an IAM instance profile and optionally a custom launch template. All instance types in one group must have the same processor architecture and the same number of vCPUs, and, if they have GPUs, the same number of GPUs. The group name is 3 to 25 characters. Creating a group takes several minutes and it cannot join a queue until its status is `ACTIVE`. The instance type of a group cannot be changed by an update.**
- Location: AWS PCS User Guide, "AWS PCS compute node groups"; "Creating a compute node group in AWS PCS"; API Reference, CreateComputeNodeGroup
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/APIReference/API_CreateComputeNodeGroup.html | Tier 1, first-party docs | definition | "{ \"amiId\": \"{{string}}\", \"clientToken\": \"{{string}}\", \"clusterIdentifier\": \"{{string}}\", \"computeNodeGroupName\": \"{{string}}\", \"customLaunchTemplate\": { \"id\": \"{{string}}\", \"version\": \"{{string}}\" }, \"iamInstanceProfileArn\": \"{{string}}\", \"instanceConfigs\": [ { \"instanceType\": \"{{string}}\" } ], \"launchTemplateMode\": \"{{string}}\", \"nodeLifecycleActions\": { \"scriptCachingPolicy\": \"{{string}}\", \"stages\": { \"nodeBootstrapped\": [ { \"arguments\": [ \"{{string}}\" ], \"executionPolicy\": \"{{string}}\", \"name\": \"{{string}}\", \"onError\": \"{{string}}\", \"scriptSource\": { \"checksum\": \"{{string}}\", \"s3VersionId\": \"{{string}}\", \"scriptLocation\": \"{{string}}\" } } ], \"nodeReady\": [ { \"arguments\": [ \"{{string}}\" ], \"executionPolicy\": \"{{string}}\", \"name\": \"{{string}}\", \"onError\": \"{{string}}\", \"scriptSource\": { \"checksum\": \"{{string}}\", \"s3VersionId\": \"{{string}}\", \"scriptLocation\": \"{{string}}\" } } ] } }, \"purchaseOption\": \"{{string}}\", \"scalingConfiguration\": { \"maxInstanceCount\": {{number}}, \"minInstanceCount\": {{number}} }, \"securityGroupIds\": [ \"{{string}}\" ], \"slurmConfiguration\": { \"gresCustomSettings\": [ { \"{{string}}\" : \"{{string}}\" } ], \"scaleDownIdleTimeInSeconds\": {{number}}, \"slurmCustomSettings\": [ { \"parameterName\": \"{{string}}\", \"parameterValue\": \"{{string}}\" } ] }, \"spotOptions\": { \"allocationStrategy\": \"{{string}}\" }, \"sshKeyName\": \"{{string}}\", \"subnetIds\": [ \"{{string}}\" ], \"tags\": { \"{{string}}\" : \"{{string}}\" } }" ; https://docs.aws.amazon.com/pcs/latest/userguide/working-with_cng_create.html | Tier 1, first-party docs | documentation of a limit | "All instance types must have the same processor architecture (x86\_64 or arm64) and number of vCPUs. If the instance types have GPUs, all instance types must have the same number of GPUs." and "You can't add the compute node group to a queue until its status is `ACTIVE`." ; https://docs.aws.amazon.com/pcs/latest/userguide/working-with_cng.html | Tier 1, first-party docs | definition | "A compute node group consists of rules for creating compute nodes. The rules include which Amazon EC2 instance types to use, how many instances to run, whether to use Spot Instances or On-Demand Instances, and which subnets to use." ; https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks-configure-cng.html | Tier 1, first-party docs | documentation of a limit | "You can't change the instance type of a compute node group when you update it." (accessed 2026-11-20)
- Use in dive: section 26, the compute node group moving part and its field list. The same-vCPU, same-GPU-count rule is what limits Spot diversification inside one group (F10-209).

**F10-207. The purchase option of a compute node group takes one of four values: `ONDEMAND` (the default, also used with an On-Demand Capacity Reservation), `SPOT`, `CAPACITY_BLOCK` (an existing EC2 Capacity Block for ML) and `INTERRUPTIBLE_CAPACITY_RESERVATION` (a shared interruptible On-Demand Capacity Reservation). The purchase option is set per group, so a cluster mixes markets by having several groups, not by mixing inside one group.**
- Location: API Reference, CreateComputeNodeGroup, `purchaseOption`; User Guide, "Creating a compute node group in AWS PCS"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/APIReference/API_CreateComputeNodeGroup.html | Tier 1, first-party docs | definition | "Valid Values: `ONDEMAND | SPOT | CAPACITY_BLOCK | INTERRUPTIBLE_CAPACITY_RESERVATION`" ; https://docs.aws.amazon.com/pcs/latest/userguide/working-with_cng_create.html | Tier 1, first-party docs | definition | "Use `--purchase-option` to choose how AWS PCS purchases EC2 instances for your compute node group. On-Demand is the default." and "To use an ODCR, an I-ODCR, or a Capacity Block, you must choose **Launch template configuration** and use a launch template that targets the reservation." ; https://docs.aws.amazon.com/pcs/latest/userguide/working-with_queues.html | Tier 1, first-party docs | definition | "For example, you can create a queue that uses Amazon EC2 On-demand Instances for high priority jobs and another queue that uses Amazon EC2 Spot Instances for low-priority jobs." (accessed 2026-11-20)
- Use in dive: section 26, the Spot and On-Demand mix. The second half of the claim (one market per group) is `[our reading]` of the single `purchaseOption` field; AWS's own example is one On-Demand queue and one Spot queue.

**F10-208. Scaling configuration has three shapes. Static: minimum equals maximum (for example 5 and 5), instances always on. Dynamic: minimum 0 (for example 0 and 10), the group scales from zero and back to zero. Mixed (since 18 May 2026, Slurm 24.05 or later): minimum above 0 and below maximum (for example 2 and 10), a baseline that stays on with scale-out above it. Static capacity is not touched by job-level scaling.**
- Location: User Guide, "Creating a compute node group in AWS PCS"; "Job-level scaling"; Document history
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/working-with_cng_create.html | Tier 1, first-party docs | definition | "Set the minimum (min) equal to the maximum (max) for static capacity (for example, 5 min, 5 max). Set the minimum to 0 for fully dynamic scaling (for example, 0 min, 10 max). With Slurm 24.05 or later, you can set the minimum greater than 0 and less than the maximum for mixed capacity. This maintains a baseline number of instances and scales up as needed (for example, 2 min, 10 max)." ; https://docs.aws.amazon.com/pcs/latest/userguide/scaling-job-level.html | Tier 1, first-party docs | definition | "Static capacity (the minimum you keep always-on) is not affected by job-level scaling." ; https://docs.aws.amazon.com/pcs/latest/userguide/doc-history.html | Tier 1, first-party docs | launch announcement | "| May 18, 2026 | New feature: Mixed scaling capacity for compute node groups |" ; https://docs.aws.amazon.com/pcs/latest/userguide/getting-started_create-cng_workers.html | Tier 1, first-party docs | definition | "A minimum of `0` lets AWS PCS scale the group down to no instances when there are no jobs to run, so you pay for compute only when work is queued." (accessed 2026-11-20)
- Use in dive: section 26, the scale-to-zero setting and the animation's "capacity scales from zero" and "scales down" steps.

**F10-209. Spot in PCS: a group with `purchaseOption` `SPOT` takes a `spotOptions.allocationStrategy` of `lowest-price`, `capacity-optimized` or `price-capacity-optimized`, and the default is `price-capacity-optimized`. The account needs the `AWSServiceRoleForEC2Spot` service-linked role. Several instance types can be listed in one group (`--instance-configs instanceType=c6i.16xlarge instanceType=c6a.16xlarge`) as long as they match in architecture, vCPU count and GPU count.**
- Location: API Reference, SpotOptions; User Guide, "Creating a compute node group in AWS PCS"; "Amazon EC2 Spot role for AWS PCS"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/APIReference/API_SpotOptions.html | Tier 1, first-party docs | definition | "If you don't provide this option, it defaults to **price capacity optimized**." and "Valid Values: `lowest-price | capacity-optimized | price-capacity-optimized`" ; https://docs.aws.amazon.com/pcs/latest/userguide/working-with_cng_create.html | Tier 1, first-party docs | definition | "To use more than one instance type, specify multiple `instanceType` settings separated by spaces, for example `--instance-configs instanceType=c6i.16xlarge instanceType=c6a.16xlarge`." ; https://docs.aws.amazon.com/pcs/latest/userguide/spot-role.html | Tier 1, first-party docs | documentation of a limit | "If you want to create an AWS PCS compute node group that uses **Spot** as its purchase option, you must also have the **AWSServiceRoleForEC2Spot** service-linked role in your AWS account." (accessed 2026-11-20)
- Use in dive: section 26, the Spot configuration snippet. For the arm's GPU simulation fleet the matching rule means, for example, `g6e.4xlarge` (16 vCPUs, 1 GPU) can be pooled only with other 16-vCPU, 1-GPU types `[our reading]`.

**F10-210. A compute node group is configured in one of two launch template modes. `MANAGED` (the console's "standard configuration") needs no launch template: the AMI ID and at least one security group are given on the group. `CUSTOM` (the API default) uses the user's EC2 launch template for what the group cannot express: network interfaces for EFA, capacity reservations, placement groups, block device mappings, user data. Either way PCS builds its own launch template named `pcs-<identifier>-do-not-delete` and launches from that.**
- Location: User Guide, "Creating a compute node group in AWS PCS"; API Reference, CreateComputeNodeGroup, `launchTemplateMode`
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/working-with_cng_create.html | Tier 1, first-party docs | definition | "A launch template can configure settings that aren't available as instance settings. Examples include network interfaces for EFA, capacity reservations, placement groups, block device mappings, and instance metadata options." and "For each compute node group, AWS PCS creates a launch template of its own and uses it to launch compute nodes." and "The launch templates that AWS PCS creates are named `pcs-{{identifier}}-do-not-delete`." and "aws pcs create-compute-node-group --region {{region}} \ --cluster-identifier {{my-cluster}} \ --compute-node-group-name {{my-node-group}} \ --launch-template-mode MANAGED \ --ami-id {{ami-ExampleID1}} \ --subnet-ids {{subnet-ExampleID1}} \ --security-group-ids {{sg-ExampleID1}} \ --ssh-key-name {{my-key-pair}} \ --iam-instance-profile-arn {{arn:InstanceProfile}} \ --scaling-configuration minInstanceCount={{min-instances}},maxInstanceCount={{max-instances}} \ --instance-configs instanceType={{t3.large}}" and "aws pcs create-compute-node-group --region {{region}} \ --cluster-identifier {{my-cluster}} \ --compute-node-group-name {{my-node-group}} \ --subnet-ids {{subnet-ExampleID1}} \ --custom-launch-template id={{lt-ExampleID1}},version='{{launch-template-version}}' \ --iam-instance-profile-arn {{arn:InstanceProfile}} \ --scaling-configuration minInstanceCount={{min-instances}},maxInstanceCount={{max-instances}} \ --instance-configs instanceType={{t3.large}}" ; https://docs.aws.amazon.com/pcs/latest/APIReference/API_CreateComputeNodeGroup.html | Tier 1, first-party docs | definition | "Specifies whether the compute node group uses a custom launch template or a launch template that AWS PCS manages. The default value is `CUSTOM`." (accessed 2026-11-20)
- Use in dive: section 26, the launch template moving part and the two CLI snippets.

**F10-211. Every compute node needs an IAM instance profile whose role may call `pcs:RegisterComputeNodeGroupInstance`, the call a booting node makes to join its cluster; the role name must start with `AWSPCS` or have the path `/aws-pcs/`. A node in a private subnet without a NAT route needs a VPC endpoint for PCS for that same call.**
- Location: API Reference, CreateComputeNodeGroup, `iamInstanceProfileArn`; User Guide, "AWS PCS VPC and subnet requirements and considerations"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/APIReference/API_CreateComputeNodeGroup.html | Tier 1, first-party docs | definition | "The role contained in your instance profile must have the `pcs:RegisterComputeNodeGroupInstance` permission and the role name must start with `AWSPCS` or must have the path `/aws-pcs/`." ; https://docs.aws.amazon.com/pcs/latest/userguide/working-with_networking_vpc-requirements.html | Tier 1, first-party docs | documentation of a limit | "The only required endpoint is for AWS PCS to allow the node to call the `RegisterComputeNodeGroupInstance` API action." (accessed 2026-11-20)
- Use in dive: section 26, the instance profile moving part; the "node registers" step of the animation.

**F10-212. Three AMI routes. The PCS-ready DLAMI (launched 1 June 2026) is AWS-maintained, built on the Deep Learning Base GPU AMI (Ubuntu 24.04), for x86_64 and arm64; it carries the PCS agent, several Slurm versions, NVIDIA drivers, CUDA, EFA drivers and the Lustre client, and it carries no ML framework. The sample AMIs (`aws-pcs-sample_ami-al2023-x86_64`, `aws-pcs-sample_ami-al2023-arm64`) are for demonstration and not recommended for production. A custom AMI must have the PCS agent and Slurm installed.**
- Location: User Guide, "Using PCS-ready DLAMI with AWS PCS"; "Using sample Amazon Machine Images (AMIs) with AWS PCS"; What's New 1 June 2026
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/working-with_ami_pcs-ready-dlami.html | Tier 1, first-party docs | definition | "The source DLAMI provides the operating system (Ubuntu 24.04), NVIDIA GPU drivers, CUDA toolkit, EFA drivers, Lustre client, and other foundational infrastructure." and "PCS-ready DLAMI does not include application software such as AI/ML frameworks (PyTorch, TensorFlow, JAX), compilers, or math libraries." ; https://docs.aws.amazon.com/pcs/latest/userguide/working-with_ami_samples.html | Tier 1, first-party docs | documentation of a limit | "Sample AMIs are for demonstration purposes and are not recommended for production workloads." ; https://aws.amazon.com/about-aws/whats-new/2026/06/aws-pcs-deep-learning-ami/ | Tier 2, launch announcement | launch announcement | "Posted on: Jun 1, 2026" (accessed 2026-11-20)
- Use in dive: section 26, the AMI moving part. For the arm: PyTorch, LeRobot and Isaac Lab go on shared storage or in a derived AMI, because the DLAMI ships none of them `[our reading]`.

**F10-213. PCS disables simultaneous multithreading on every compute node at bootstrap and the setting cannot be changed: on an SMT-capable instance type the usable vCPU count is half the advertised one (96 advertised vCPUs become 48 cores). Graviton types are unaffected.**
- Location: User Guide, "AWS PCS compute node groups"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/working-with_cng.html | Tier 1, first-party docs | documentation of a limit | "AWS PCS disables simultaneous multithreading (SMT), also known as Hyper-Threading on Intel processors, on all compute nodes at bootstrap. You can't change this setting." and "For example, an instance type that advertises 96 vCPUs has 48 usable cores on AWS PCS compute nodes. Instance types that don't support SMT, such as those with AWS Graviton (Arm) processors, are unaffected." (accessed 2026-11-20)
- Use in dive: section 26, "what it does poorly" for CPU-thread-hungry stages: video decode workers and CPU physics on x86 see half the vCPUs the instance page advertises.

**F10-214. Node lifecycle actions (generally available 23 July 2026, PCS agent 1.5.0) run scripts from Amazon S3 or HTTPS as root at two stages of a node's boot: `nodeBootstrapped` (after PCS has configured the node, before `slurmd` starts: the place to mount shared storage) and `nodeReady` (after `slurmd` registers with the controller). Each script has an `onError` of `TERMINATE`, `STOP_SEQUENCE` or `CONTINUE` and an `executionPolicy` of `FIRST_BOOT_ONLY` (default) or `EVERY_BOOT`. AWS maintains ready scripts, among them `mount-fsx-lustre.sh` and `mount-efs.sh`.**
- Location: User Guide, "Run custom scripts with node lifecycle actions in AWS PCS"; "Node lifecycle action examples for AWS PCS"; "Use AWS-maintained scripts for node lifecycle actions in AWS PCS"; What's New 23 July 2026
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/cng-node-lifecycle-actions.html | Tier 1, first-party docs | definition | "| **Node bootstrapped** (`nodeBootstrapped`) | Runs after AWS PCS finishes node setup and before `slurmd` starts." and "| **Node ready** (`nodeReady`) | Runs after `slurmd` starts and the node registers with the Slurm controller." ; https://docs.aws.amazon.com/pcs/latest/userguide/cng-node-lifecycle-actions-examples.html | Tier 1, first-party docs | definition | "aws pcs create-compute-node-group --region {{region}} \ --cluster-identifier {{my-cluster}} \ --compute-node-group-name {{my-cng}} \ --subnet-ids {{subnet-ExampleID1}} \ --custom-launch-template id={{lt-ExampleID1}},version='{{1}}' \ --iam-instance-profile-arn {{arn:InstanceProfile}} \ --scaling-configuration minInstanceCount={{0}},maxInstanceCount={{10}} \ --instance-configs instanceType={{t3.large}} \ --node-lifecycle-actions '{ \"stages\": { \"nodeBootstrapped\": [ { \"name\": \"Mount FSx Lustre\", \"scriptSource\": { \"scriptLocation\": \"s3://{{my-bucket}}/mount-fsx.sh\" }, \"arguments\": [\"fs-{{0abc123}}\", \"/scratch\"], \"executionPolicy\": \"EVERY_BOOT\" }, { \"name\": \"Join Active Directory\", \"scriptSource\": { \"scriptLocation\": \"s3://{{my-bucket}}/configure-ad.sh\" }, \"arguments\": [\"ad.example.com\", \"EXAMPLE\"], \"executionPolicy\": \"FIRST_BOOT_ONLY\" } ], \"nodeReady\": [ { \"name\": \"Configure CloudWatch logging\", \"scriptSource\": { \"scriptLocation\": \"s3://{{my-bucket}}/setup-cloudwatch.sh\" }, \"arguments\": [\"/aws/pcs/{{my-cluster}}\"], \"onError\": \"CONTINUE\" } ] } }'" and "AWS PCS provides per-script error handling (`TERMINATE`, `STOP_SEQUENCE`, or `CONTINUE`) and reboot control (`FIRST_BOOT_ONLY` or `EVERY_BOOT`). The AWS PCS default is `FIRST_BOOT_ONLY`." ; https://docs.aws.amazon.com/pcs/latest/userguide/cng-node-lifecycle-actions-vetted-scripts.html | Tier 1, first-party docs | definition | "s3://aws-pcs-repo-{{region}}/aws-pcs-node-lifecycle-scripts/{{script}}-v{{version}}.sh" ; https://aws.amazon.com/about-aws/whats-new/2026/07/aws-pcs-node-lifecycle-actions/ | Tier 2, launch announcement | launch announcement | "Posted on: Jul 23, 2026 Today, AWS announces the general availability of node lifecycle actions in AWS Parallel Computing Service (PCS)." (accessed 2026-11-20)
- Use in dive: section 26, how storage gets mounted on a node that did not exist a minute earlier; the recommended configuration snippet.

### A3. AWS PCS: queues

**F10-215. A PCS queue is a Slurm partition. Users submit to a queue, never to a node or a node group. A queue is served by 1 or more compute node groups and one compute node group can serve more than 1 queue. A queue name is at most 25 characters, the queue is created with the node group's ID (not its name), creation can take several minutes, and jobs cannot be submitted until the queue is `ACTIVE`.**
- Location: User Guide, "AWS PCS queues"; "Creating a queue in AWS PCS"; API Reference, CreateQueue
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/working-with_queues.html | Tier 1, first-party docs | definition | "In the case of Slurm, an AWS PCS queue is equivalent to a Slurm partition." ; https://docs.aws.amazon.com/pcs/latest/userguide/working-with_queues_create.html | Tier 1, first-party docs | definition | "Select 1 or more compute node groups to service this queue. A compute node group can be associated with more than 1 queue." and "When you create a queue, you must provide the ID of the compute node group and not its name." and "aws pcs create-queue --region {{region-code}} \ --queue-name {{my-queue}} \ --cluster-identifier {{my-cluster}} \ --compute-node-group-configurations \ computeNodeGroupId={{compute-node-group-id}} \ --slurm-configuration \ 'slurmCustomSettings=[{parameterName=Default,parameterValue=YES}]'" ; https://docs.aws.amazon.com/pcs/latest/APIReference/API_CreateQueue.html | Tier 1, first-party docs | definition | "{ \"clientToken\": \"{{string}}\", \"clusterIdentifier\": \"{{string}}\", \"computeNodeGroupConfigurations\": [ { \"computeNodeGroupId\": \"{{string}}\" } ], \"queueName\": \"{{string}}\", \"slurmConfiguration\": { \"slurmCustomSettings\": [ { \"parameterName\": \"{{string}}\", \"parameterValue\": \"{{string}}\" } ] }, \"tags\": { \"{{string}}\" : \"{{string}}\" } }" ; https://docs.aws.amazon.com/pcs/latest/userguide/key-concepts.html | Tier 1, first-party docs | definition | "Users don't submit jobs directly to a compute node or compute node group." (accessed 2026-11-20)
- Use in dive: section 26, the queue moving part, the queue-to-node-group arrows of the drawing, and the CreateQueue snippet.

**F10-216. Slurm partition parameters that can be set on a PCS queue: `AllowAccounts`, `AllowQos`, `Default`, `DefaultTime`, `DenyAccounts`, `DenyQos`, `Exclusive`, `ExclusiveUser`, `GraceTime`, `MaxTime`, `OverSubscribe`, `OverTimeLimit`, `PowerDownOnIdle`, `PreemptMode`, `PriorityJobFactor`, `PriorityTier`, `QOS` and `TRESBillingWeights`. A quality of service named in `AllowQos`, `DenyQos` or `QOS` must already exist in the accounting database.**
- Location: User Guide, "Custom Slurm settings for AWS PCS queues"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/slurm-custom-settings-queue.html | Tier 1, first-party docs | documentation of support | "The following custom Slurm settings are supported at the queue level:" and "QOS values referenced in `AllowQos`, `DenyQos`, or `QOS` settings must already exist in the Slurm accounting database." (accessed 2026-11-20)
- Use in dive: section 26, the queue settings table. `PriorityTier`, `PreemptMode` and `GraceTime` are the three that let an On-Demand training queue preempt a Spot evaluation queue with a grace period `[our reading]`.

### A4. AWS PCS: scaling and the node lifecycle

**F10-217. Scaling in PCS is job-level scaling: at regular intervals PCS reviews waiting jobs, launches EC2 instances for the nodes Slurm has allocated to them, and scales the dynamic capacity back down as instances become idle. A job runs only after all of its nodes are available; it never starts on a partial allocation. PCS provides the capacity either all at once (all nodes or none) or incrementally (holding what it has while it acquires the rest, for jobs larger than one EC2 request can provide). If the full capacity is not available the job stays pending and PCS may release the instances it had launched.**
- Location: User Guide, "Job-level scaling"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/scaling-job-level.html | Tier 1, first-party docs | definition | "At regular intervals, AWS PCS reviews waiting jobs, launches Amazon EC2 instances to satisfy them, and scales dynamic capacity back down as jobs finish and instances become idle." and "A job runs only after all required nodes are available. It does not start on a partial allocation." and "**All at once.** AWS PCS provides all the nodes the job needs together, or none." and "When a job's full capacity isn't available, it doesn't start. AWS PCS might not launch any instances for the job, or it might release instances it had launched. The job remains pending, and AWS PCS re-evaluates it on later intervals until its capacity can be provided." (accessed 2026-11-20)
- Use in dive: section 26, the animation: job arrives, Slurm allocates named nodes, PCS launches instances behind those nodes, job starts when the last node registers. The length of the "regular interval" is not published (U10-1).

**F10-218. The scale-down knob is `scaleDownIdleTimeInSeconds`: the time before an idle node is scaled down. Its API default is 600 seconds and its range is 1 to 10000000. It is set on the cluster and, since 28 May 2026 on Slurm 25.11 or later, a compute node group can override it with its own value. AWS's own examples use 3600 on a cluster, 180 on a cluster with accounting, and 300 on a `p4d.24xlarge` group.**
- Location: API Reference, ClusterSlurmConfigurationRequest; User Guide, "Creating a cluster in AWS PCS"; "Creating a compute node group in AWS PCS"; Document history
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/APIReference/API_ClusterSlurmConfigurationRequest.html | Tier 1, first-party docs | definition | "Default: `600`" and "Valid Range: Minimum value of 1. Maximum value of 10000000." ; https://docs.aws.amazon.com/pcs/latest/userguide/working-with_clusters_create.html | Tier 1, first-party docs | definition | "The cluster-level `scaleDownIdleTimeInSeconds` applies to all compute node groups in the cluster by default. For Slurm 25.11 or later, individual compute node groups can override this value with their own `scaleDownIdleTimeInSeconds` setting." and "aws pcs create-cluster --region {{region}} \ --cluster-name {{my-cluster}} \ --scheduler type=SLURM,version={{25.11}} \ --size {{SMALL}} \ --networking subnetIds={{subnet-ExampleId1}},securityGroupIds={{sg-ExampleId1}} --slurm-configuration scaleDownIdleTimeInSeconds=3600,accounting='{mode=STANDARD}',slurmCustomSettings='[{parameterName=SelectTypeParameters,parameterValue=CR_CPU_Memory}]'" ; https://docs.aws.amazon.com/pcs/latest/userguide/working-with_cng_create.html | Tier 1, first-party docs | definition | "aws pcs create-compute-node-group --region {{region}} \ --cluster-identifier {{my-cluster}} \ --compute-node-group-name {{my-gpu-nodes}} \ --launch-template-mode MANAGED \ --ami-id {{ami-ExampleID1}} \ --subnet-ids {{subnet-ExampleID1}} \ --security-group-ids {{sg-ExampleID1}} \ --iam-instance-profile-arn {{arn:InstanceProfile}} \ --scaling-configuration minInstanceCount={{0}},maxInstanceCount={{10}} \ --instance-configs instanceType={{p4d.24xlarge}} \ --slurm-configuration scaleDownIdleTimeInSeconds={{300}}" ; https://docs.aws.amazon.com/pcs/latest/userguide/doc-history.html | Tier 1, first-party docs | launch announcement | "| May 28, 2026 | New feature: Compute node group-level scale-down idle time |" (accessed 2026-11-20)
- Use in dive: section 26, the scale-down step of the animation and the recommended configuration (a short idle time on Spot simulation groups, a longer one on a GPU training group whose next job is minutes away). The API default (600) and the Slurm 23.11 release note ("The `SuspendTime` defaults to `60`") disagree; print 600 and cite the API reference (U10-2).

**F10-219. The states a PCS compute node passes through, as PCS reports them in its scaling logs (a log type added 30 September 2026): `LAUNCHED` (reason `SCHEDULER_REQUESTED` or `MAINTAIN_MIN_CAPACITY`), `REGISTERED` (the PCS agent registered the node), `ACTIVE` (bootstrap done, `slurmd` running and accepting jobs), then `TERMINATED` with reason `SCHEDULER_REQUESTED` (idle timeout or a user power-down). Failure paths: `LAUNCH_FAILED` with `INSUFFICIENT_CAPACITY` or `LIMIT_EXCEEDED`, `PENDING_REPLACEMENT` (draining after a failed health check or a scheduled EC2 event), `TERMINATED` with `EXTERNALLY_TERMINATED` (the instance was terminated outside PCS and the node is released to be replaced).**
- Location: User Guide, "Scaling logs in AWS PCS"; What's New 30 September 2026
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/monitoring_scaling-logs.html | Tier 1, first-party docs | definition | "| LAUNCHED | SCHEDULER\_REQUESTED | Instance launched to satisfy a scheduler scale-up request |" and "| REGISTERED | REGISTER\_SUCCESS | Node registered successfully via the PCS agent |" and "| ACTIVE | BOOTSTRAP\_SUCCESS | Node bootstrap completed; slurmd is running and accepting jobs |" and "| TERMINATED | SCHEDULER\_REQUESTED | Instance terminated after the scheduler suspended the node (idle timeout or user initiated power-down) |" and "| LAUNCH\_FAILED | INSUFFICIENT\_CAPACITY | Node did not get an instance because there was not enough capacity available |" and "| TERMINATED | EXTERNALLY\_TERMINATED | Instance was terminated outside of PCS; the node was released so it can be replaced |" and "{ \"resource_id\": \"pcs_abc123de45\", \"resource_type\": \"PCS_CLUSTER\", \"event_timestamp\": 1789179816460, \"compute_node_group_id\": \"pcs_abcdef01\", \"scheduler_node_id\": \"compute-1\", \"status_code\": \"LAUNCHED\", \"reason_code\": \"SCHEDULER_REQUESTED\", \"description\": \"Instance launched to satisfy a scheduler scale-up request.\", \"details\": { \"instance_id\": \"i-0abc12345def67890\", \"instance_type\": \"c6i.xlarge\", \"subnet_id\": \"subnet-0123456789abcdef0\" } }" ; https://aws.amazon.com/about-aws/whats-new/2026/09/aws-pcs-scaling-logs/ | Tier 2, launch announcement | launch announcement | "Posted on: Sep 30, 2026" (accessed 2026-11-20)
- Use in dive: section 26, the node state labels of the animation: LAUNCHED, REGISTERED, ACTIVE, TERMINATED. These are PCS's names, distinct from Slurm's own node states (`idle`, `alloc`, `maint`, `IDLE+CLOUD+POWERING_DOWN`, F10-232).

**F10-220. Boot order of a new PCS node: (1) the node boots and the PCS agent calls `RegisterComputeNodeGroupInstance`; (2) the agent caches the lifecycle configuration and downloads the scripts; (3) the PCS configuration phase runs (Slurm configured, Hyper-Threading disabled); (4) `nodeBootstrapped` scripts run in order; (5) `slurmd` starts and the node registers with the controller, at which point it can accept jobs; (6) `nodeReady` scripts run, possibly after a job has already been dispatched to the node.**
- Location: User Guide, "Run custom scripts with node lifecycle actions in AWS PCS", "How execution works"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/cng-node-lifecycle-actions.html | Tier 1, first-party docs | definition | "The node boots and the AWS PCS agent calls `RegisterComputeNodeGroupInstance`." and "`slurmd` starts and the node registers with the Slurm controller. At this point the node is available to accept jobs." and "`nodeReady` scripts run after `slurmd` starts, so there is a brief window in which the scheduler might dispatch a job to the node before your `nodeReady` scripts finish." (accessed 2026-11-20)
- Use in dive: section 26, the "scale from zero" step of the animation, in order. Rule that follows: mount storage in `nodeBootstrapped`, never in `nodeReady`.

**F10-221. Timing facts PCS documents. While a node is being brought up the job shows state `CF` (configuring) in `squeue`; the tutorial's sample output shows a job at `CF 0:47` on node `compute-1` before it reaches `R`. A node that never registers is given approximately 30 minutes: the instance runs until Slurm's `ResumeTimeout` is reached and the node is marked `DOWN`. No nominal launch-to-ready time is published.**
- Location: User Guide, "Run a single node job in AWS PCS"; "Troubleshoot compute node bootstrap and registration problems in AWS PCS"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/getting-started_run-job.html | Tier 1, first-party docs | definition | "1     demo      test ec2-user CF 0:47 1     compute-1" and "Continue to check the status of the job until it reaches the `R` (running) status." ; https://docs.aws.amazon.com/pcs/latest/userguide/troubleshooting-compute-node-bootstrap.html | Tier 1, first-party docs | documentation of a limit | "The EC2 instance runs for approximately 30 minutes until Slurm's ResumeTimeout is reached and marks the node as `DOWN`." (accessed 2026-11-20)
- Use in dive: section 26, the job-state labels of the animation (PD pending, CF configuring, R running) and one honest sentence that the cold-start time is not published (U10-3).

### A5. AWS PCS: losing a node under a running job (Spot, expiry, failure)

**F10-222. The PCS User Guide has no page that describes a Spot interruption step by step. What it does state about a job whose instance goes away: for an expiring Capacity Block, "By default, active jobs are automatically re-queued, but might have errors or fail"; for an interruptible capacity reservation, instances get a 2-minute termination warning, there is no fallback to On-Demand or Spot, and AWS's guidance is to listen for the EventBridge interruption event, implement checkpointing, and set the group's minimum instance count to 0. An instance terminated outside PCS is logged `TERMINATED` / `EXTERNALLY_TERMINATED` and "the node was released so it can be replaced".**
- Location: User Guide, "Frequently asked questions about using Capacity Blocks with AWS PCS"; "Using I-ODCRs with AWS PCS"; "Scaling logs in AWS PCS"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks-faq.html | Tier 1, first-party docs | definition | "Your Slurm settings affect active jobs. By default, active jobs are automatically re-queued, but might have errors or fail." ; https://docs.aws.amazon.com/pcs/latest/userguide/capacity-reservations-iodcr.html | Tier 1, first-party docs | definition | "Consumer instances receive a **2-minute termination warning** when the owner reclaims capacity, making I-ODCRs suitable for fault-tolerant workloads such as batch processing, ML training, and data analysis." and "Implement checkpointing so jobs can save intermediate results and resume after interruption." and "For compute node groups with a dynamic scaling configuration, set the minimum instance count to `0` so the group can scale down gracefully when capacity is reclaimed." ; https://docs.aws.amazon.com/pcs/latest/userguide/monitoring_scaling-logs.html | Tier 1, first-party docs | definition | "| TERMINATED | EXTERNALLY\_TERMINATED | Instance was terminated outside of PCS; the node was released so it can be replaced |" (accessed 2026-11-20)
- Use in dive: section 26, the Spot step of the animation, with its limit stated: the requeue-by-default sentence is written about Capacity Block expiry, and applying it to a Spot reclaim is `[our reading]` (same Slurm mechanism: the node stops responding, Slurm requeues the batch job when `JobRequeue` allows it). Whether PCS drains a Spot node on the two-minute notice or on a rebalance recommendation is not documented (U10-4).

**F10-223. The Slurm requeue controls PCS exposes. `JobRequeue`, `RequeueExit` and `RequeueExitHold` are settable cluster parameters. On Slurm 25.11 and later, expedited requeue is enabled by default: a job that fails because of a node issue can be requeued at the highest scheduling priority with `sbatch --requeue=expedite`. A requeued job becomes eligible again after `requeue_delay`, 5 seconds by default (before 25.11 the delay was tied to credential expiration, 70 seconds). Since 25.05 `requeue_on_resume_failure` is enabled by default, so a job whose node fails to come up goes back to the queue. A job can requeue itself with `scontrol requeue "$SLURM_JOB_ID"`.**
- Location: User Guide, "Release notes for Slurm versions in AWS PCS"; "Custom Slurm settings for AWS PCS clusters"; "Configuring Multi-Instance GPU (MIG) in AWS PCS"; What's New 23 April 2026
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/slurm-versions_release-notes.html | Tier 1, first-party docs | definition | "Expedited requeue is enabled by default. Jobs that fail due to node issues (such as insufficient capacity errors) can be requeued with the highest scheduling priority using `sbatch --requeue=expedite`. This is controlled by the `SchedulerParameters=enable_expedited_requeue` setting." and "The `requeue_delay` parameter is available as a custom cluster setting with a default of 5 seconds. Previously, requeue delay was tied to credential expiration (70 seconds)." and "The Slurm requeue\_on\_resume\_failure SchedulerParameter is now Enabled by default." ; https://docs.aws.amazon.com/pcs/latest/userguide/mig-configuration.html | Tier 1, first-party docs | definition | "if [ -z \"${CUDA_VISIBLE_DEVICES-}\" ]; then scontrol requeue \"$SLURM_JOB_ID\" exit 1 fi" and "A requeued job becomes eligible to run again after the `requeue_delay` scheduler parameter, 5 seconds by default." ; https://aws.amazon.com/about-aws/whats-new/2026/04/aws-pcs-slurm-25-11/ | Tier 2, launch announcement | launch announcement | "This release of Slurm 25.11 introduces expedited re-queue, which can automatically reschedule jobs affected by node issues at the highest priority to help your workloads recover faster." (accessed 2026-11-20)
- Use in dive: section 26, the "checkpoint and requeue" step and the retry settings of the recommended configuration: `#SBATCH --requeue=expedite`, a 5-second requeue delay, and a training script that resumes from its last checkpoint.

**F10-224. Cluster-level Slurm parameters PCS lets a user set include the ones that shape preemption and termination: `PreemptType`, `PreemptMode`, `PreemptParameters`, `PreemptExemptTime`, `KillWait`, `OverTimeLimit`, `UnkillableStepTimeout`, `Prolog`, `Epilog`, `TaskProlog`, `TaskEpilog`, `HealthCheckProgram`, `HealthCheckInterval`, `HealthCheckNodeState`, `SchedulerParameters`, `SelectTypeParameters` (default `CR_CPU`), `MaxArraySize`, `MinJobAge` (minimum 5 seconds), the `Priority*` family for fair-share, and `AccountingStorageEnforce`.**
- Location: User Guide, "Custom Slurm settings for AWS PCS clusters"; "Release notes for Slurm versions in AWS PCS"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/slurm-custom-settings-cluster.html | Tier 1, first-party docs | documentation of support | "The following custom Slurm settings are supported at the cluster level:" and "AWS PCS supports a minimum value of 5 seconds for `MinJobAge`." and "AWS PCS rejects a `MaxArraySize` greater than the cluster's `MaxJobCount`, which depends on the cluster size. If you don't set `MaxArraySize`, it equals `MaxJobCount`." ; https://docs.aws.amazon.com/pcs/latest/userguide/slurm-versions_release-notes.html | Tier 1, first-party docs | definition | "The `SelectTypeParameters` Slurm setting defaults to `CR_CPU`." (accessed 2026-11-20)
- Use in dive: section 26, the custom settings table. `KillWait` is the Slurm interval between SIGTERM and SIGKILL when a job is cancelled or preempted, so it is the knob behind a checkpoint-on-signal handler `[our reading]`; PCS documents that it is settable and prints no value.

**F10-225. Compute-node-group-level Slurm parameters: `CpuSpecList`, `Features`, `Gres`, `MemSpecLimit`, `Parameters` (Slurm 25.11 or later), `RealMemory`, `Sockets` (25.11 or later) and `Weight`. Nodes with lower `Weight` are chosen first. AWS's example sets `Features` to `gpu,nvme`, and its guidance for steering a job onto a particular node group in a shared queue is Slurm features and constraints.**
- Location: User Guide, "Custom Slurm settings for AWS PCS compute node groups"; "Creating a compute node group in AWS PCS"; Capacity Blocks FAQ
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/slurm-custom-settings-cng.html | Tier 1, first-party docs | documentation of support | "The following custom Slurm settings are supported at the compute node group level:" ; https://docs.aws.amazon.com/pcs/latest/userguide/working-with_cng_create.html | Tier 1, first-party docs | definition | "For example, set `Weight` to set scheduling priority. Nodes with lower weights have higher priority." ; https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks-faq.html | Tier 1, first-party docs | definition | "You can use Slurm features and constraints to lock a job to a certain set of nodes. We recommend that you don't set Slurm weights for each compute node group because that only works with nodes that aren't in the `maint` state." (accessed 2026-11-20)
- Use in dive: section 26, how one queue with a Spot group and an On-Demand group prefers Spot: lower `Weight` on the Spot group, or `--constraint` on a `Features` label `[our reading]`.

### A6. AWS PCS: accounting, login nodes, submission, REST

**F10-226. Managed Slurm accounting launched on 15 May 2025 for Slurm 24.11 or later. It is enabled with `accounting='{mode=STANDARD}'`; PCS creates and runs the accounting database in an AWS-owned account, and the user queries it from a login node with `sacct`. `defaultPurgeTimeInDays` sets retention (API default -1, meaning records are kept indefinitely; 0 is not valid). Accounting can be switched on or off on an existing cluster, and it adds two charges.**
- Location: User Guide, "Slurm accounting in AWS PCS"; Document history
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/slurm-accounting.html | Tier 1, first-party docs | definition | "AWS PCS stores your accounting data in a database created in an AWS account that AWS owns. You don't have access to the `slurmdbd.conf.`" and "When you use the AWS PCS API to create a cluster, the default value for `defaultPurgeTimeInDays` is `-1` and `0` isn't a valid value." and "You can enable or disable accounting on existing clusters without rebuilding your infrastructure." ; https://docs.aws.amazon.com/pcs/latest/userguide/doc-history.html | Tier 1, first-party docs | launch announcement | "| May 15, 2025 | New feature: accounting | Slurm accounting is now supported for Slurm 24.11 or later." (accessed 2026-11-20)
- Use in dive: section 26, the accounting moving part. It is the precondition for QOS-based queue rules (F10-216) and for fair-share between the arm's training and evaluation users.

**F10-227. A PCS cluster usually needs at least 1 login node. AWS's suggested form is a compute node group with a static scaling configuration of at least one instance, the On-Demand purchase option "to avoid having your instance(s) reclaimed", a cheaper instance type, the same AMI and the same file system mounts as the compute groups. A standalone EC2 instance running `sackd` can also be a login node, and one login node can connect to several clusters.**
- Location: User Guide, "AWS PCS login nodes"; "Using an AWS PCS compute node group to provide login nodes"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/working-with_login-nodes.html | Tier 1, first-party docs | definition | "An AWS PCS cluster usually needs at least 1 login node to support interactive access and job management." ; https://docs.aws.amazon.com/pcs/latest/userguide/working-with_login-nodes_compute-node-group-for-login.html | Tier 1, first-party docs | definition | "Set a static scaling configuration of at least one EC2 instance in the compute node group." and "Choose on-demand purchase option to avoid having your instance(s) reclaimed." and "Configure the same network file system (Amazon EFS, Amazon FSx for Lustre, etc.) mounts on your login nodes as on your compute instances." (accessed 2026-11-20)
- Use in dive: section 26, the login node box of the drawing (a static node group outside every queue).

**F10-228. Submission is plain Slurm from a login node, usually from a shared directory: `sbatch -p <queue> job.sh`, then `squeue --job <id>`. AWS's two tutorial scripts are a single-node job and a four-node MPI job that uses `--exclusive`, `--nodes=4`, `--ntasks-per-node=1` and `srun`. Job arrays are bounded by `MaxArraySize`, which equals the cluster size's job limit unless set lower (256, 8192 or 16384).**
- Location: User Guide, "Run a single node job in AWS PCS"; "Run a multi-node MPI job with Slurm in AWS PCS"; "Custom Slurm settings for AWS PCS clusters"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/getting-started_run-job.html | Tier 1, first-party docs | definition | "cat << EOF > job.sh #!/bin/bash #SBATCH -J single #SBATCH -o single.%j.out #SBATCH -e single.%j.err echo \"This is job \${SLURM_JOB_NAME} [\${SLURM_JOB_ID}] running on \${SLURMD_NODENAME}, submitted from \${SLURM_SUBMIT_HOST}\" && sleep 60 && echo \"Job complete\" EOF" and "sbatch -p demo job.sh" ; https://docs.aws.amazon.com/pcs/latest/userguide/getting-started_run-mpi-job.html | Tier 1, first-party docs | definition | "cat > hello.sh << EOF #!/bin/bash #SBATCH -J multi #SBATCH -o multi.out #SBATCH -e multi.err #SBATCH --exclusive #SBATCH --nodes=4 #SBATCH --ntasks-per-node=1 srun $HOME/hello EOF" ; https://docs.aws.amazon.com/pcs/latest/userguide/slurm-custom-settings-cluster.html | Tier 1, first-party docs | documentation of a limit | "If you don't set `MaxArraySize`, it equals `MaxJobCount`." (accessed 2026-11-20)
- Use in dive: section 26, the "submit" step and the worked case. No AWS PCS page prints an sbatch script that uses `--array`, `--requeue` together with a checkpoint signal handler; a script of that shape in the dive is `[our reading]` assembled from Slurm options PCS documents (F10-223) (U10-5).

**F10-229. PCS runs Slurm's REST API (`slurmrestd`) as a managed option since 18 November 2025, for Slurm 25.05 or later: jobs can be submitted and monitored over HTTP on port 6820 of the controller's private IP. It is reachable only inside the cluster's VPC, it is HTTP without TLS, it needs JWT tokens carrying POSIX identity claims (tokens from `scontrol token` are rejected), it is not compatible with CLI filter plugins, and it adds no charge.**
- Location: User Guide, "Slurm REST API in AWS PCS"; "Slurm REST API frequently asked questions in AWS PCS"; Document history
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/slurm-rest-api.html | Tier 1, first-party docs | documentation of support | "Your cluster must use Slurm version 25.05 or higher." and "Your cluster security group must allow HTTP traffic on port 6820." and "Connections to the REST API endpoint are not encrypted with TLS." ; https://docs.aws.amazon.com/pcs/latest/userguide/slurm-rest-api-faq.html | Tier 1, first-party docs | documentation of a limit | "No, the REST API endpoint is only accessible from within your VPC using the Slurm controller's private IP address." and "No, there are no additional charges for enabling or using the Slurm REST API feature." ; https://docs.aws.amazon.com/pcs/latest/userguide/doc-history.html | Tier 1, first-party docs | launch announcement | "| November 18, 2025 | New feature: Slurm REST API | Slurm REST API is now supported for Slurm 25.05 or later." (accessed 2026-11-20)
- Use in dive: section 26, the hand-off point: a pipeline (Step Functions, an MLOps tool, a notebook) submits to PCS over REST without a shell on the login node.

**F10-230. Two policy hooks sit at submission. Slurm CLI filter plugins (10 November 2025) run Lua scripts on the client before a job reaches the controller. Slurm job submit plugins (19 November 2026, the newest PCS feature on the day of this research, Slurm 25.11 or later) run one Starlark script per cluster on the controller, which can accept, reject or modify a job and cannot be bypassed by users.**
- Location: User Guide, "Use Slurm Job Submit Plugins to validate and modify jobs in AWS PCS"; Document history
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/slurm-job-submit-plugins.html | Tier 1, first-party docs | documentation of support | "AWS PCS supports Slurm Job Submit Plugins to run custom Starlark scripts that validate and modify jobs on the Slurm controller. Unlike [Slurm CLI Filter Plugins](slurm-cli-filter-plugins.md), Job Submit Plugins can't be bypassed by users." ; https://docs.aws.amazon.com/pcs/latest/userguide/doc-history.html | Tier 1, first-party docs | launch announcement | "| November 19, 2026 | Slurm Job Submit Plugins |" and "| November 10, 2025 | New feature: Slurm CLI filter plugin support |" (accessed 2026-11-20)
- Use in dive: section 26, 2026 features. Arm use `[our reading]`: a job submit script that forces `--requeue` on every job sent to the Spot queue.

### A7. AWS PCS: storage and networking

**F10-231. Shared storage in PCS is whatever the node mounts at boot: Amazon EFS, FSx for Lustre, FSx for NetApp ONTAP, FSx for OpenZFS, Amazon File Cache, or a self-managed NFS server. PCS has no storage object of its own. The mount is done by EC2 launch template user data (`cloud-config`) or, since July 2026, by a `nodeBootstrapped` lifecycle action; the getting-started tutorial was changed on 6 August 2026 to mount with lifecycle actions. A failed or slow mount can keep instances from ever becoming available to run jobs, which costs money.**
- Location: User Guide, "Using network file systems with AWS PCS"; "Create compute node group for jobs"; Document history
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/working-with_file-systems.html | Tier 1, first-party docs | definition | "File system mounts are done using EC2 launch templates. Errors or timeouts in mounting a network file system may prevent instances from becoming available to run jobs. This, in turn, may lead to unexpected costs." and "MIME-Version: 1.0 Content-Type: multipart/mixed; boundary=\"==MYBOUNDARY==\" --==MYBOUNDARY== Content-Type: text/cloud-config; charset=\"us-ascii\" runcmd: - amazon-linux-extras install -y lustre={{latest}} - mkdir -p /{{mount-point-directory}} - mount -t lustre {{filesystem-id}}.fsx.{{region-code}}.amazonaws.com@tcp:/{{mount-name}} /{{mount-point-directory}} --==MYBOUNDARY==--" and "MIME-Version: 1.0 Content-Type: multipart/mixed; boundary=\"==MYBOUNDARY==\" --==MYBOUNDARY== Content-Type: text/cloud-config; charset=\"us-ascii\" packages: - amazon-efs-utils runcmd: - mkdir -p /{{mount-point-directory}} - echo \"{{filesystem-id}}:/ /{{mount-point-directory}} efs tls,_netdev\" >> /etc/fstab - mount -a -t efs defaults --==MYBOUNDARY==--" and "MIME-Version: 1.0 Content-Type: multipart/mixed; boundary=\"==MYBOUNDARY==\" --==MYBOUNDARY== Content-Type: text/cloud-config; charset=\"us-ascii\" runcmd: - mkdir -p /{{mount-point-directory}} - mount -t nfs -o noatime,nfsvers=4.2,sync,rsize=1048576,wsize=1048576 {{filesystem-id}}.fsx.{{region-code}}.amazonaws.com:/fsx/ /{{mount-point-directory}} --==MYBOUNDARY==--" ; https://docs.aws.amazon.com/pcs/latest/userguide/getting-started_create-cng_workers.html | Tier 1, first-party docs | definition | "**mount-fsx-lustre** - Mounts the FSx for Lustre file system at `/shared` for high-performance shared scratch storage." ; https://docs.aws.amazon.com/pcs/latest/userguide/doc-history.html | Tier 1, first-party docs | launch announcement | "| August 6, 2026 | Getting started tutorial uses node lifecycle actions |" (accessed 2026-11-20)
- Use in dive: section 26, the storage box of the drawing and the mount snippets. The tutorial's layout is the one to draw: EFS for `/home`, FSx for Lustre at `/shared`.

**F10-232. Networking of a PCS cluster. The controller reaches the user's VPC through an elastic network interface that PCS creates in the one subnet named at cluster creation. That subnet cannot be in AWS Outposts, AWS Wavelength or a Local Zone, the VPC must use default tenancy, and a cluster is IPv4 or IPv6, not both. Compute node groups may use other subnets of the same VPC, in one Availability Zone or several; with an On-Demand group the order of the subnets is the launch priority. A group with more than one subnet loses EFA between its nodes.**
- Location: User Guide, "AWS PCS VPC and subnet requirements and considerations"; "Creating a compute node group in AWS PCS"; "Job-level scaling"; AWS PCS FAQs
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/working-with_networking_vpc-requirements.html | Tier 1, first-party docs | documentation of a limit | "When you create a Slurm cluster, AWS PCS creates an [Elastic Network Interface(ENI)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html) in the subnet you specified." and "The subnet can't reside in AWS Outposts, AWS Wavelength, or an AWS Local Zone." and "AWS PCS doesn't support a VPC with dedicated instance tenancy." ; https://docs.aws.amazon.com/pcs/latest/userguide/working-with_cng_create.html | Tier 1, first-party docs | documentation of a limit | "If you choose multiple subnets, EFA communications won't be available between nodes, and communication between nodes in different subnets might have increased latency." ; https://docs.aws.amazon.com/pcs/latest/userguide/scaling-job-level.html | Tier 1, first-party docs | definition | "If a subnet can't provide the requested capacity, AWS PCS tries the next subnet in the list, continuing until it finds available capacity." ; https://aws.amazon.com/pcs/faqs/ | Tier 2, product page | documentation of support | "When you configure a node group across multiple Availability Zones, PCS looks across all of them for available capacity as it launches instances." (accessed 2026-11-20)
- Use in dive: section 26, the network box. Two node-group shapes follow `[our reading]`: a multi-subnet Spot group for independent jobs (simulation, evaluation, curation), and a one-subnet EFA group in a cluster placement group for multi-node training.

**F10-233. EFA and placement groups are configured in the launch template, not on the node group: each EFA is a network interface with `"InterfaceType": "efa"`, security groups must be set per interface in `Groups`, and the placement group goes in `Placement.GroupId`. AWS recommends a cluster placement group for an EFA node group. The AMI must have the EFA driver installed and loaded.**
- Location: User Guide, "Create or update an EC2 launch template"; "Placement groups for EC2 instances in AWS PCS"; "Using Elastic Fabric Adapter (EFA) with AWS PCS"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/working-with_networking_efa_create-lt.html | Tier 1, first-party docs | definition | "{ \"Placement\": { \"GroupId\": \"pg-{{PlacementGroupId1}}\" }, \"NetworkInterfaces\": [ { \"DeviceIndex\": 0, \"InterfaceType\": \"efa\", \"NetworkCardIndex\": 0, \"SubnetId\": \"subnet-{{SubnetId1}}\", \"Groups\": [ \"sg-{{SecurityGroupId1}}\", \"sg-{{EfaSecGroupId}}\" ] }, { \"DeviceIndex\": 1, \"InterfaceType\": \"efa\", \"NetworkCardIndex\": 1, \"SubnetId\": \"subnet-{{SubnetId1}}\" \"Groups\": [\"sg-{{EfaSecGroupId}}\"] } ] }" and "Security groups must be added specifically to each EFA interface." ; https://docs.aws.amazon.com/pcs/latest/userguide/working-with_networking_placement-groups.html | Tier 1, first-party docs | definition | "We recommended you include a **cluster** placement group when you configure an AWS PCS compute node group to use Elastic Fabric Adapter (EFA)." ; https://docs.aws.amazon.com/pcs/latest/userguide/working-with_networking_efa.html | Tier 1, first-party docs | documentation of a limit | "The AMI used in the AWS PCS compute node group must have the EFA driver installed and loaded." (accessed 2026-11-20)
- Use in dive: section 26, the EFA snippet for workload 15 (multi-node pretraining). The JSON is printed as the page has it; the second interface in AWS's example lacks a comma after its `SubnetId` line, so it must be corrected before use, and the dive should say the snippet is illustrative.

### A8. AWS PCS: reserved capacity and GPUs

**F10-234. Capacity Blocks for ML work with PCS since 17 September 2025 (Slurm 24.05 or later). The launch template must set `InstanceMarketOptions.MarketType` to `capacity-block`, name the `CapacityReservationId` and the matching instance type; the group's `purchaseOption` is `CAPACITY_BLOCK` and its `maxInstanceCount` must not exceed the block's size. One group takes exactly 1 Capacity Block. Before the block starts the nodes sit in Slurm's `maint` state under a Slurm reservation. When it expires all instances are terminated, queued jobs stay pending, and the group stays attached to its queues with nothing to run on. EC2 sends an expiration warning 40 minutes before the end.**
- Location: User Guide, "Using Amazon EC2 Capacity Blocks for ML with AWS PCS"; "Configure an AWS PCS compute node group to use a Capacity Block"; Capacity Blocks FAQ; Document history
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks-configure-cng.html | Tier 1, first-party docs | definition | "The value `MarketType` of `InstanceMarketOptions` must be set to `capacity-block`." and "The `maxInstanceCount` of the compute node group must not exceed the size of the Capacity Block." ; https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks.html | Tier 1, first-party docs | documentation of a limit | "You can only associate a compute node group with 1 Capacity Block at a time." and "All instances in the compute node group are terminated and active jobs might fail, based on your Slurm settings." ; https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks-faq.html | Tier 1, first-party docs | definition | "Amazon EC2 sends a `Capacity Block Reservation Delivered` event through EventBridge when a Capacity Block reservation starts and a `Capacity Block Reservation Expiration Warning` event 40 minutes before the Capacity Block reservation expires." and "$ sinfo PARTITION AVAIL TIMELIMIT NODES STATE NODELIST fanout up infinite 4 idle node-fanout-[1-4]" and "State=IDLE+CLOUD+POWERING_DOWN" ; https://docs.aws.amazon.com/pcs/latest/userguide/doc-history.html | Tier 1, first-party docs | launch announcement | "| September 17, 2025 | New feature: Capacity Blocks for ML |" (accessed 2026-11-20)
- Use in dive: section 26, the reserved-capacity node group for workloads 14 and 15. A 64-instance block can be split between clusters by giving each group a fixed minimum and maximum (AWS's example: 20 and 16 of 64 `p5.48xlarge`).

**F10-235. On-Demand Capacity Reservations (ODCRs) are used with `purchaseOption` `ONDEMAND` and a launch template that targets the reservation in one of two ways: by reservation ID (strict: if the group asks for more instances than the reservation holds, none are launched beyond it) or by a Capacity Reservation group (PCS may launch additional On-Demand instances when the reservation is used up). An interruptible ODCR (I-ODCR) is used with `purchaseOption` `INTERRUPTIBLE_CAPACITY_RESERVATION` and `MarketType` `interruptible-capacity-reservation`.**
- Location: User Guide, "Using ODCRs with AWS PCS"; "Using I-ODCRs with AWS PCS"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/capacity-reservations-odcr.html | Tier 1, first-party docs | definition | "This approach provides strict capacity control and does not support instance backfilling (If the compute node group requests more instances than available in the ODCR, no additional instances will be launched)." and "This approach supports instance backfilling, allowing AWS PCS to launch additional On-Demand instances if the reservation capacity is exceeded." and "{ \"CapacityReservationSpecification\": { \"CapacityReservationResourceGroupArn\": \"arn:aws:resource-groups:us-east-2:123456789012:group/EXAMPLE-CR-GROUP\" } }" ; https://docs.aws.amazon.com/pcs/latest/userguide/capacity-reservations-iodcr.html | Tier 1, first-party docs | definition | "{ \"CapacityReservationSpecification\": { \"CapacityReservationTarget\": { \"CapacityReservationId\": \"cr-1234567890abcdef1\" } }, \"InstanceMarketOptions\": { \"MarketType\": \"interruptible-capacity-reservation\" } }" and "When the owner reclaims capacity, there is **no fallback** to On-Demand or Spot - consumer instances are terminated." (accessed 2026-11-20)
- Use in dive: section 26, the capacity options table. ODCRs are the only reservation route for the G family on PCS, since Capacity Blocks cover P and Trainium types only (register 09, F09-91) `[our reading]`.

**F10-236. GPUs are scheduled as Slurm generic resources (GRES). On Slurm 26.05 PCS enables GRES autodetection by default on node groups that have GPUs. Since 11 September 2026 a node group also accepts `gresCustomSettings` (records in `gres.conf` form such as `Name=gpu Type=a100 File=/dev/nvidia[0-7]`) together with the `Gres` custom setting, which allows declared GPU types, NVIDIA MIG (Multi-Instance GPU, Slurm 25.11 or later), MPS and shards. A node in AWS's own output reports `Gres=gpu:H100:1`.**
- Location: User Guide, "Configuring custom GRES settings in AWS PCS"; "Release notes for Slurm versions in AWS PCS"; "Configuring Multi-Instance GPU (MIG) in AWS PCS"; What's New 11 September 2026
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/slurm-versions_release-notes.html | Tier 1, first-party docs | documentation of support | "AWS PCS enables Slurm GRES autodetection by default on compute node groups that have GPUs. AWS PCS enables autodetection only when the socket layout of the node is known." and "This lets you configure GPU topology, MIG devices, MPS, shards, and your own generic resources." ; https://docs.aws.amazon.com/pcs/latest/userguide/gres-custom-settings.html | Tier 1, first-party docs | definition | "For example, the record `Name=gpu Type=a100 File=/dev/nvidia[0-7]` declares eight A100 GPUs." ; https://docs.aws.amazon.com/pcs/latest/userguide/mig-configuration.html | Tier 1, first-party docs | documentation of support | "Slurm schedules each MIG profile as its own Generic Resource (GRES) type, so multiple jobs can share one physical GPU with hardware isolation." ; https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks-faq.html | Tier 1, first-party docs | definition | "Gres=gpu:H100:1" ; https://aws.amazon.com/about-aws/whats-new/2026/09/aws-pcs-gres-hardware-topology-mig/ | Tier 2, launch announcement | launch announcement | "Posted on: Sep 11, 2026" (accessed 2026-11-20)
- Use in dive: section 26, the GPU slots inside each instance of the drawing; a job asks with `--gres=gpu:1` or `--gpus` (standard Slurm; no PCS page read today prints a GPU sbatch line, U10-5). MIG is the documented way to pack several small evaluation jobs on one large GPU.

**F10-237. P6e-GB200 and P6e-GB300 UltraServers (PCS support announced 18 June 2026) are attached as Capacity Block node groups, Slurm 25.05 or later. PCS inspects the Capacity Block, identifies the UltraServer type and configures Slurm's `topology/block` plugin by itself, so a job is placed inside one UltraServer and GPU-to-GPU traffic uses NVLink. Jobs must use `--exclusive`, because the NVIDIA IMEX service needs a dedicated domain per job, and the user supplies a Slurm prolog that configures IMEX with the IP addresses of the job's nodes.**
- Location: User Guide, "Configure UltraServer instances"; What's New 18 June 2026
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks-nvidia-imex.html | Tier 1, first-party docs | documentation of support | "When you create a AWS PCS cluster with UltraServer compute node groups, the system inspects the Capacity Block, identifies the UltraServer type, and configures Slurm with the appropriate topology plugin." and "Jobs must use the `--exclusive` flag because IMEX requires a dedicated IMEX domain per job, and restarting the IMEX service would disrupt any other running jobs on the same nodes." ; https://aws.amazon.com/about-aws/whats-new/2026/06/aws-parallel-computing-service/ | Tier 2, launch announcement | launch announcement | "Posted on: Jun 18, 2026" and "You can reserve UltraServers through EC2 Capacity Blocks for ML, associate them with a PCS compute node group via an EC2 launch template, and PCS automatically configures Slurm with the correct topology plugin." (accessed 2026-11-20)
- Use in dive: section 26, one sentence under workload 15. Sharpens F09-109 with the mechanism (topology/block, IMEX prolog, `--exclusive`).

### A9. AWS PCS: observability, limits, price structure, 2026 timeline

**F10-238. What PCS exposes for watching a cluster: scheduler logs (`PCS_SCHEDULER_LOGS`, including `slurmdbd` and `slurmrestd` logs since 22 April 2026), scheduler audit logs (`PCS_SCHEDULER_AUDIT_LOGS`, Slurm 25.11 or later), scaling logs (`PCS_SCALING_LOGS`, opt-in), job completion logs, CloudWatch metrics in the `AWS/PCS` namespace at 1-minute periods, a Slurm OpenMetrics endpoint for Prometheus (Slurm 25.11), and, documented on 17 November 2026, job-level cost in Cost and Usage Reports through split cost allocation data (Slurm 25.11 or later) with tags for job ID, user, Slurm account, queue, compute node group and node.**
- Location: User Guide, "Scaling logs in AWS PCS"; "Monitoring AWS PCS metrics using CloudWatch"; "View costs by job in AWS billing with split cost allocation data"; Document history
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/monitoring-cost-allocation.html | Tier 1, first-party docs | documentation of support | "You can attribute cost to an individual job and aggregate the cost by job, user, Slurm account, queue, compute node group, node, and cluster." and "Your cluster must run Slurm 25.11 or later." ; https://docs.aws.amazon.com/pcs/latest/userguide/monitoring-cloudwatch_metrics.html | Tier 1, first-party docs | definition | "Cluster metrics are sent to CloudWatch at 1-minute periods." ; https://docs.aws.amazon.com/pcs/latest/userguide/monitoring_scaling-logs.html | Tier 1, first-party docs | definition | "Scaling log delivery is opt-in." ; https://docs.aws.amazon.com/pcs/latest/userguide/doc-history.html | Tier 1, first-party docs | launch announcement | "| November 17, 2026 | New topic: view costs by job with split cost allocation data |" and "| April 22, 2026 | New feature: Scheduler audit logs |" (accessed 2026-11-20)
- Use in dive: section 26, the observability line; cost per job answers "what did this evaluation sweep cost".

**F10-239. PCS quotas: 5 clusters per Region (adjustable); 10 compute node groups per cluster and 10 queues per cluster (internal quotas, raised through a support case); 1 cluster in the `Creating` state per Region (not adjustable). EC2 quotas that bind PCS: Spot instance requests, running On-Demand instances, launch templates, launch template versions and EC2 API requests.**
- Location: User Guide, "Endpoints and service quotas for AWS PCS"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/service-endpoints-quotas.html | Tier 1, first-party docs | documentation of a limit | "| Clusters | 5 | Yes | The maximum number of clusters per AWS Region. |" and "| Compute node groups per cluster | 10 | Yes (via support case) | The maximum number of compute node groups per cluster. |" and "| Queues per cluster | 10 | Yes (via support case) | The maximum number of queues per cluster. |" and "| Concurrent cluster creation | 1 | No | The maximum number of clusters in the `Creating` state per AWS Region. |" (accessed 2026-11-20)
- Use in dive: section 26, the limits table. Ten node groups is the binding number for a Spot design that needs one group per vCPU and GPU shape `[our reading]`.

**F10-240. PCS price structure, dimensions only: an hourly cluster controller fee that varies with the controller size; an hourly node management fee for every EC2 instance launched in the compute node groups, in two tiers (an advanced tier for EC2 UltraCluster instance types, the P and TRN families, and a standard tier for all other types); with accounting enabled, an hourly accounting usage fee that varies with controller size and an accounting storage fee per GB-month. EC2, storage and other AWS resources are billed separately. The pricing page prints the values; none is copied here.**
- Location: AWS PCS pricing page
- Verdict: NEW
- Evidence: https://aws.amazon.com/pcs/pricing/ | Tier 2, product page | definition | "Usage of AWS PCS will incur two separate charges - an hourly cluster controller fee and an hourly node management fee for every Amazon Elastic Compute Cloud (Amazon EC2) instance launched within your AWS PCS compute node groups." and "The node management fee is tiered - an advanced tier for Amazon EC2 UltraCluster instance types (P and TRN instance families) and a standard tier for all other Amazon EC2 instance types." and "If you decide to enable this feature, you will incur two additional charges - an hourly accounting usage fee that will vary by the controller size chosen, and an accounting storage fee that is billed in per GB-month increments." (accessed 2026-11-20)
- Use in dive: section 26, the cost-shape paragraph: the controller fee runs whether or not jobs run, so PCS scales compute to zero and never the controller `[our reading]`.

**F10-241. PCS endpoints are listed for 27 Regions on 20 November 2026, among them US East (N. Virginia), US East (Ohio), US West (Oregon), US West (N. California) (added 11 November 2026), Canada (Central) (28 October 2026) and both AWS GovCloud (US) Regions.**
- Location: User Guide, "Endpoints and service quotas for AWS PCS"; Document history
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/service-endpoints-quotas.html | Tier 1, first-party docs | documentation of support | "| US West (N. California) | us-west-1 |" and "| AWS GovCloud (US-West) | us-gov-west-1 |" ; https://docs.aws.amazon.com/pcs/latest/userguide/doc-history.html | Tier 1, first-party docs | launch announcement | "| November 11, 2026 | AWS PCS released in US West (N. California) |" and "| October 28, 2026 | AWS PCS released in Canada (Central) |" (accessed 2026-11-20)
- Use in dive: section 26, availability, one clause. The count 27 is `[derived]`: rows of the endpoints table counted by hand.

**F10-242. PCS feature timeline for 2026, from the User Guide's document history: 26 March (custom slurmdbd and cgroup settings, What's New date); 22 April (scheduler audit logs); 23 April (Slurm 25.11, the default version); 18 May (mixed scaling capacity); 28 May (per-node-group scale-down idle time); 1 June (PCS-ready DLAMI); 18 June (P6e-GB200 and P6e-GB300 UltraServers, What's New date); 29 June (in-place Slurm version update); 23 July (node lifecycle actions, agent 1.5.0); 6 August (managed Prometheus collector topic); 11 September (Slurm 26.05, custom GRES settings, hardware topology, MIG); 30 September (scaling logs, What's New date); 11 November (RHEL 10, Rocky Linux 10 and Ubuntu 26.04); 17 November (cost by job); 19 November (job submit plugins).**
- Location: User Guide, "Document history"; What's New posts named in F10-204, F10-212, F10-214, F10-219, F10-236, F10-237
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/doc-history.html | Tier 1, first-party docs | launch announcement | "| September 11, 2026 | Support for Slurm 26.05, custom GRES settings, and hardware topology |" and "| April 23, 2026 | Updated for Slurm 25.11 |" and "| July 23, 2026 | Updated AWS PCS agent to version 1.5.0 |" and "| November 11, 2026 | Added support for RHEL 10, Rocky Linux 10, and Ubuntu 26.04 |" ; https://aws.amazon.com/about-aws/whats-new/2026/03/aws-pcs-manages-slurmdbd-cgroups-settings/ | Tier 2, launch announcement | launch announcement | "Posted on: Mar 26, 2026" (accessed 2026-11-20)
- Use in dive: section 26, the "what changed in 2026" strip. The Slurm versions table gives 9/10/2026 as the PCS release date of 26.05 and the document history and What's New give 11 September 2026; print 11 September 2026.

**F10-243. The only first-party comparison of PCS with AWS ParallelCluster found today is a mapping of bootstrap hooks: ParallelCluster's `OnNodeStart` corresponds to `nodeBootstrapped`, `OnNodeConfigured` to `nodeReady`, and `OnNodeUpdated` has no PCS equivalent; ParallelCluster scripts run on every boot, PCS scripts on first boot only unless set to `EVERY_BOOT`. No AWS page read today states which of the two to choose.**
- Location: User Guide, "Node lifecycle action examples for AWS PCS", "Migrating from AWS ParallelCluster bootstrap actions"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/cng-node-lifecycle-actions-examples.html | Tier 1, first-party docs | definition | "Many existing AWS ParallelCluster bootstrap scripts work as-is with AWS PCS lifecycle actions." and "| `OnNodeUpdated` | No AWS PCS equivalent |" and "To match ParallelCluster behavior (run on every boot), set `executionPolicy` to `EVERY_BOOT`." (accessed 2026-11-20)
- Use in dive: section 26, one sentence at most. The differences a reader would expect (PCS: AWS runs the controller, API objects, in-place upgrades; ParallelCluster: the head node is the user's EC2 instance with full `slurm.conf` access) are `[our reading]`, see F10-245.

**F10-244. [our reading] How a Spot interruption plays out on PCS, assembled from documented parts: the group is `SPOT` with `price-capacity-optimized` (F10-209); EC2 reclaims an instance; PCS logs the node `TERMINATED` / `EXTERNALLY_TERMINATED` and releases it for replacement (F10-219); Slurm requeues the batch job by default (F10-222), eligible again after 5 seconds and at top priority if it was submitted with `--requeue=expedite` (F10-223); job-level scaling launches a replacement instance for the pending job at its next interval (F10-217); the job restarts from the beginning of its script, so resuming is the script's work, from a checkpoint on FSx for Lustre or S3 (F10-231).**
- Location: synthesis of F10-209, F10-217, F10-219, F10-222, F10-223, F10-231
- Verdict: NEW
- Evidence: F10-209, F10-217, F10-219, F10-222, F10-223, F10-231 | synthesis; no single AWS page states this sequence for Spot, and whether the job gets a signal inside the two-minute window is not documented (U10-4)
- Use in dive: section 26, the Spot frames of the animation, each frame labelled with its entry ID; state the undocumented step in the caption.

**F10-245. [our reading] What PCS does well and poorly for the arm. Well: Slurm semantics (arrays, multi-node jobs that start only when every node is up, partitions with priority and preemption, GRES and MIG) with no controller to run, scale to zero per node group, every EC2 market per group. Poorly: one purchase option per group and a 10-group default cap make Spot diversification coarse; instance types in a group must match in vCPU and GPU count; no documented Spot drain or checkpoint hook; no container-native path (jobs are processes on an AMI); the controller is a fixed size and is billed while idle; SMT is off; storage and its mounts are the user's work; the Slurm allow-list excludes arbitrary `slurm.conf` edits.**
- Location: synthesis of F10-202, F10-205, F10-206, F10-207, F10-213, F10-222, F10-231, F10-239, F10-240
- Verdict: NEW
- Evidence: F10-202, F10-205, F10-206, F10-207, F10-213, F10-222, F10-231, F10-239, F10-240 | synthesis; the clause about containers rests on the absence of any container runtime page in the User Guide's table of contents as fetched today
- Use in dive: section 26, "what it does poorly" and the hand-offs in section 9 of this file.

### B1. SageMaker HyperPod: the cluster and its two orchestrators

**F10-300. A HyperPod cluster is a persistent set of SageMaker-managed instances, organised in instance groups, that takes its scheduler from one of two orchestrators chosen at creation. With Slurm, the cluster contains its own controller node, optional login node and compute nodes, all of them instance groups the user sizes. With Amazon EKS, the HyperPod cluster is only the worker nodes, mapped 1-to-1 to an EKS cluster that provides the control plane.**
- Location: Amazon SageMaker AI Developer Guide, "Orchestrating SageMaker HyperPod clusters with Amazon EKS"; "Getting started with SageMaker HyperPod using the AWS CLI"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks.html | Tier 1, first-party docs | definition | "The high-level architecture of Amazon EKS support in HyperPod involves a 1-to-1 mapping between an EKS cluster (control plane) and a HyperPod cluster (worker nodes) within a VPC, as shown in the following diagram." ; https://docs.aws.amazon.com/sagemaker/latest/dg/smcluster-getting-started-slurm-cli.html | Tier 1, first-party docs | definition | "A Slurm cluster requires at least a controller node (which runs the `slurmctld` daemon and coordinates job scheduling) and one or more compute nodes (which execute jobs). Optionally, you can add a login node to provide users with a dedicated access point for submitting and managing jobs without logging into the controller directly." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-cli-command-create-cluster.html | Tier 1, first-party docs | definition | "// create_cluster.json { \"ClusterName\": {{\"string\"}}, \"InstanceGroups\": [{ \"InstanceGroupName\": {{\"string\"}}, \"InstanceType\": {{\"string\"}}, \"InstanceCount\": {{number}}, \"LifeCycleConfig\": { \"SourceS3Uri\": {{\"s3://amzn-s3-demo-bucket-sagemaker/lifecycle-script-directory/src/\"}}, \"OnCreate\": {{\"on_create.sh\"}} }, \"ExecutionRole\": {{\"string\"}}, \"ThreadsPerCore\": {{number}}, \"OnStartDeepHealthChecks\": [ {{\"InstanceStress\", \"InstanceConnectivity\"}} ] }], \"RestrictedInstanceGroups\": [ { \"EnvironmentConfig\": { \"FSxLustreConfig\": { \"PerUnitStorageThroughput\": {{number}}, \"SizeInGiB\": {{number}} } }, \"ExecutionRole\": {{\"string\"}}, \"InstanceCount\": {{number}}, \"InstanceGroupName\": {{\"string\"}}, \"InstanceStorageConfigs\": [ { ... } ], \"InstanceType\": {{\"string\"}}, \"OnStartDeepHealthChecks\": [ {{\"string\"}} ], \"OverrideVpcConfig\": { \"SecurityGroupIds\": [ {{\"string\"}} ], \"Subnets\": [ {{\"string\"}} ] }, \"ScheduledUpdateConfig\": { \"DeploymentConfig\": { \"AutoRollbackConfiguration\": [ { \"AlarmName\": {{\"string\"}} } ], \"RollingUpdatePolicy\": { \"MaximumBatchSize\": { \"Type\": {{\"string\"}}, \"Value\": {{number}} }, \"RollbackMaximumBatchSize\": { \"Type\": {{\"string\"}}, \"Value\": {{number}} } }, \"WaitIntervalInSeconds\": {{number}} }, \"ScheduleExpression\": {{\"string\"}} }, \"ThreadsPerCore\": {{number}}, \"TrainingPlanArn\": {{\"string\"}} } ], \"VpcConfig\": { \"SecurityGroupIds\": [{{\"string\"}}], \"Subnets\": [{{\"string\"}}] }, \"Tags\": [{ \"Key\": {{\"string\"}}, \"Value\": {{\"string\"}} }], \"Orchestrator\": { \"Eks\": { \"ClusterArn\": {{\"string\"}}, \"KubernetesConfig\": { \"Labels\": { {{\"nvidia.com/mig.config\": \"all-3g.40gb\"}} } } } }, \"NodeRecovery\": \"Automatic\" }" (accessed 2026-11-20)
- Use in dive: section 27, the opening definition and the two cluster drawings (Slurm: controller, login, compute groups inside the cluster; EKS: control plane outside, instance groups inside). Sharpens F09-22.

**F10-301. One `CreateCluster` request carries the whole HyperPod cluster: `InstanceGroups` (each with `InstanceGroupName`, `InstanceType` or `InstanceRequirements`, `InstanceCount`, `MinInstanceCount`, `ExecutionRole`, `LifeCycleConfig`, `InstanceStorageConfigs`, `CapacityRequirements`, `TrainingPlanArn`, `OnStartDeepHealthChecks`, `OverrideVpcConfig`, `SlurmConfig` or `KubernetesConfig`, `ThreadsPerCore`), `RestrictedInstanceGroups`, `Orchestrator` (`Eks` or `Slurm`), `NodeRecovery`, `NodeProvisioningMode`, `AutoScaling` and `VpcConfig`. `InstanceCount` ranges from 0 to 6758, `ThreadsPerCore` is 1 or 2, and a group takes at most 4 storage configurations.**
- Location: Amazon SageMaker API Reference, CreateCluster; ClusterInstanceGroupSpecification
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateCluster.html | Tier 1, first-party docs | definition | "{ \"AutoScaling\": { \"AutoScalerType\": \"{{string}}\", \"Mode\": \"{{string}}\" }, \"ClusterName\": \"{{string}}\", \"ClusterRole\": \"{{string}}\", \"InstanceGroups\": [ { \"AutoPatchConfig\": { \"DeploymentConfig\": { \"AutoRollbackConfiguration\": [ { \"AlarmName\": \"{{string}}\" } ], \"RollingUpdatePolicy\": { \"MaximumBatchSize\": { \"Type\": \"{{string}}\", \"Value\": {{number}} }, \"RollbackMaximumBatchSize\": { \"Type\": \"{{string}}\", \"Value\": {{number}} } }, \"WaitIntervalInSeconds\": {{number}} }, \"DrainPolicy\": { \"DrainTimeoutInSeconds\": {{number}}, \"OnDrainTimeout\": \"{{string}}\" }, \"IdleWaitWindowInSeconds\": {{number}}, \"PatchingStrategy\": \"{{string}}\", \"PatchSchedule\": { \"NextPatchDate\": {{number}} } }, \"CapacityRequirements\": { \"OnDemand\": { }, \"Spot\": { } }, \"ExecutionRole\": \"{{string}}\", \"ImageId\": \"{{string}}\", \"ImageReleaseVersion\": \"{{string}}\", \"InstanceCount\": {{number}}, \"InstanceGroupName\": \"{{string}}\", \"InstanceRequirements\": { \"InstanceTypes\": [ \"{{string}}\" ] }, \"InstanceStorageConfigs\": [ { ... } ], \"InstanceType\": \"{{string}}\", \"KubernetesConfig\": { \"Labels\": { \"{{string}}\" : \"{{string}}\" }, \"Taints\": [ { \"Effect\": \"{{string}}\", \"Key\": \"{{string}}\", \"Value\": \"{{string}}\" } ] }, \"LifeCycleConfig\": { \"OnCreate\": \"{{string}}\", \"OnInitComplete\": \"{{string}}\", \"SourceS3Uri\": \"{{string}}\" }, \"MinInstanceCount\": {{number}}, \"NetworkInterface\": { \"InterfaceType\": \"{{string}}\" }, \"OnStartDeepHealthChecks\": [ \"{{string}}\" ], \"OverrideVpcConfig\": { \"SecurityGroupIds\": [ \"{{string}}\" ], \"Subnets\": [ \"{{string}}\" ] }, \"ScheduledUpdateConfig\": { \"DeploymentConfig\": { \"AutoRollbackConfiguration\": [ { \"AlarmName\": \"{{string}}\" } ], \"RollingUpdatePolicy\": { \"MaximumBatchSize\": { \"Type\": \"{{string}}\", \"Value\": {{number}} }, \"RollbackMaximumBatchSize\": { \"Type\": \"{{string}}\", \"Value\": {{number}} } }, \"WaitIntervalInSeconds\": {{number}} }, \"ScheduleExpression\": \"{{string}}\" }, \"SlurmConfig\": { \"NodeType\": \"{{string}}\", \"PartitionNames\": [ \"{{string}}\" ] }, \"ThreadsPerCore\": {{number}}, \"TrainingPlanArn\": \"{{string}}\" } ], \"NodeProvisioningMode\": \"{{string}}\", \"NodeRecovery\": \"{{string}}\", \"Orchestrator\": { \"Eks\": { \"ClusterArn\": \"{{string}}\" }, \"Slurm\": { \"AccountingDatabase\": { \"Endpoint\": \"{{string}}\", \"Name\": \"{{string}}\", \"Port\": {{number}}, \"SecretArn\": \"{{string}}\" }, \"SlurmConfigStrategy\": \"{{string}}\" } }, \"RestrictedInstanceGroups\": [ { \"EnvironmentConfig\": { \"FSxLustreConfig\": { \"PerUnitStorageThroughput\": {{number}}, \"SizeInGiB\": {{number}} } }, \"ExecutionRole\": \"{{string}}\", \"InstanceCount\": {{number}}, \"InstanceGroupName\": \"{{string}}\", \"InstanceStorageConfigs\": [ { ... } ], \"InstanceType\": \"{{string}}\", \"OnStartDeepHealthChecks\": [ \"{{string}}\" ], \"OverrideVpcConfig\": { \"SecurityGroupIds\": [ \"{{string}}\" ], \"Subnets\": [ \"{{string}}\" ] }, \"ScheduledUpdateConfig\": { \"DeploymentConfig\": { \"AutoRollbackConfiguration\": [ { \"AlarmName\": \"{{string}}\" } ], \"RollingUpdatePolicy\": { \"MaximumBatchSize\": { \"Type\": \"{{string}}\", \"Value\": {{number}} }, \"RollbackMaximumBatchSize\": { \"Type\": \"{{string}}\", \"Value\": {{number}} } }, \"WaitIntervalInSeconds\": {{number}} }, \"ScheduleExpression\": \"{{string}}\" }, \"ThreadsPerCore\": {{number}}, \"TrainingPlanArn\": \"{{string}}\" } ], \"RestrictedInstanceGroupsConfig\": { \"SharedEnvironmentConfig\": { \"FSxLustreConfig\": { \"PerUnitStorageThroughput\": {{number}}, \"SizeInGiB\": {{number}} }, \"FSxLustreDeletionPolicy\": \"{{string}}\" } }, \"Tags\": [ { \"Key\": \"{{string}}\", \"Value\": \"{{string}}\" } ], \"TieredStorageConfig\": { \"InstanceMemoryAllocationPercentage\": {{number}}, \"Mode\": \"{{string}}\" }, \"VpcConfig\": { \"SecurityGroupIds\": [ \"{{string}}\" ], \"Subnets\": [ \"{{string}}\" ] } }" ; https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ClusterInstanceGroupSpecification.html | Tier 1, first-party docs | documentation of a limit | "Valid Range: Minimum value of 0. Maximum value of 6758." and "Valid Range: Minimum value of 1. Maximum value of 2." and "Array Members: Minimum number of 0 items. Maximum number of 4 items." (accessed 2026-11-20)
- Use in dive: section 27, the field list of the instance group moving part. Unlike PCS, `ThreadsPerCore` is the user's choice (F10-213).

**F10-302. Under Slurm each instance group is given a role with `SlurmConfig.NodeType`: `Controller`, `Login` or `Compute`. Exactly one group must be the controller; a compute group names its Slurm partition in `PartitionNames` (at most 1 item in the API reference). At cluster level `Orchestrator.Slurm.SlurmConfigStrategy` is `Managed` (default: the API is the single source of truth and an update is blocked if `slurm.conf` has drifted), `Overwrite` or `Merge` (manual `slurm.conf` edits are kept). This API-driven topology is AWS's recommended approach for new clusters; the older route is a `provisioning_parameters.json` file in Amazon S3.**
- Location: Developer Guide, "Getting started with SageMaker HyperPod using the AWS CLI"; "SageMaker HyperPod references"; API Reference, ClusterSlurmConfig
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/smcluster-getting-started-slurm-cli.html | Tier 1, first-party docs | definition | "{ \"ClusterName\": \"my-hyperpod-cluster\", \"InstanceGroups\": [ { \"InstanceGroupName\": \"my-controller-group\", \"InstanceType\": \"ml.c5.xlarge\", \"InstanceCount\": 1, \"SlurmConfig\": { \"NodeType\": \"Controller\" }, \"ExecutionRole\": \"arn:aws:iam::{{111122223333}}:role/HyperPodExecutionRole\", \"InstanceStorageConfigs\": [ { \"EbsVolumeConfig\": { \"VolumeSizeInGB\": 500 } } ] }, { \"InstanceGroupName\": \"my-login-group\", \"InstanceType\": \"ml.m5.4xlarge\", \"InstanceCount\": 1, \"SlurmConfig\": { \"NodeType\": \"Login\" }, \"ExecutionRole\": \"arn:aws:iam::{{111122223333}}:role/HyperPodExecutionRole\" }, { \"InstanceGroupName\": \"worker-group-1\", \"InstanceType\": \"ml.trn1.32xlarge\", \"InstanceCount\": 1, \"SlurmConfig\": { \"NodeType\": \"Compute\", \"PartitionNames\": [\"partition-1\"] }, \"ExecutionRole\": \"arn:aws:iam::{{111122223333}}:role/HyperPodExecutionRole\", \"InstanceStorageConfigs\": [ { \"FsxLustreConfig\": { \"DnsName\": \"{{fs-0abc123def456789.fsx.us-west-2.amazonaws.com}}\", \"MountPath\": \"/fsx\", \"MountName\": \"{{abcdefgh}}\" } } ] } ], \"Orchestrator\": { \"Slurm\": { \"SlurmConfigStrategy\": \"Managed\" } }, \"VpcConfig\": { \"SecurityGroupIds\": [\"{{sg-0abc123def456789a}}\"], \"Subnets\": [\"{{subnet-0abc123def456789a}}\"] } }" and "| NodeType | Required. The Slurm role for this instance group. Valid values: Controller, Login, Compute. Exactly one instance group must be Controller. |" and "| Managed (default) | Enabled; blocks updates if drift found | Not supported | Single source of truth |" and "This is the recommended approach for new clusters." ; https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ClusterSlurmConfig.html | Tier 1, first-party docs | documentation of a limit | "Array Members: Minimum number of 0 items. Maximum number of 1 item." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-ref.html | Tier 1, first-party docs | definition | "// Save as provisioning_parameters.json. { \"version\": \"1.0.0\", \"workload_manager\": \"slurm\", \"controller_group\": \"{{string}}\", \"login_group\": \"{{string}}\", \"worker_groups\": [ { \"instance_group_name\": \"{{string}}\", \"partition_name\": \"{{string}}\" } ], \"fsx_dns_name\": \"{{string}}\", \"fsx_mountname\": \"{{string}}\" }" (accessed 2026-11-20)
- Use in dive: section 27, the Slurm-orchestrated drawing (controller group, login group, worker group mapped to a partition) and its snippet. The controller in AWS's example is one `ml.c5.xlarge` that the user pays for, where PCS hides the controller behind a size (F10-202).

**F10-303. A HyperPod node is prepared in one of three ways. Omit `LifeCycleConfig` and HyperPod configures the node from the AMI (Slurm plus Docker, Enroot and Pyxis; available for Slurm clusters since 7 May 2026). Give an `OnInitComplete` script to extend that configuration. Or give an `OnCreate` script from an S3 location and own the whole provisioning sequence, including when Slurm starts. The EKS examples use `OnCreate` with a script such as `on_create.sh`.**
- Location: Developer Guide, "Getting started with SageMaker HyperPod using the AWS CLI"; What's New 7 May 2026
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/smcluster-getting-started-slurm-cli.html | Tier 1, first-party docs | definition | "In the simplest case you omit `LifeCycleConfig` entirely and HyperPod automatically configures nodes using AMI-based configuration, setting up Slurm and essential packages such as Docker, Enroot, and Pyxis for running ML workloads, with no scripts or Amazon S3 bucket required." and "For full control over the entire provisioning sequence, the `OnCreate` path lets your scripts own everything, including when Slurm starts." ; https://aws.amazon.com/about-aws/whats-new/2026/05/amazon-sagemaker-hyperpod-ami-based-node/ | Tier 2, launch announcement | launch announcement | "Posted on: May 7, 2026 Amazon SageMaker HyperPod now supports AMI-based configuration that provisions Slurm cluster nodes with the software and configurations needed for a production-ready environment to run AI/ML training workloads." (accessed 2026-11-20)
- Use in dive: section 27, the lifecycle configuration moving part.

**F10-304. Instance types a HyperPod instance group accepts today include the simulation and CPU families the arm needs, with the `ml.` prefix: `ml.g6.*`, `ml.g6e.*`, `ml.g7.*`, `ml.g7e.*` (G7e support announced 27 April 2026), `ml.c8g.*`, `ml.m8g.*`, `ml.c7g.*`, next to `ml.p5.48xlarge`, `ml.p6-b200.48xlarge`, `ml.p6-b300.48xlarge` and `ml.p6e-gb200.36xlarge`. Kubernetes scheduling constraints on instance type must use the `ml.` form.**
- Location: API Reference, ClusterInstanceGroupSpecification, `InstanceType`; What's New 27 April 2026; Developer Guide, "Getting started with Amazon EKS support in SageMaker HyperPod"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ClusterInstanceGroupSpecification.html | Tier 1, first-party docs | documentation of support | "ml.g6e.4xlarge" and "ml.g7e.2xlarge" and "ml.g7.2xlarge" and "ml.c8g.48xlarge" and "ml.m8g.48xlarge" and "ml.p6-b300.48xlarge" ; https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-sagemaker-hyperpod-g7e-r5d/ | Tier 2, launch announcement | launch announcement | "Posted on: Apr 27, 2026 Amazon SageMaker HyperPod now supports G7e and r5d.16xlarge instances." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-prerequisites.html | Tier 1, first-party docs | documentation of a limit | "If you use instance-type labels to define scheduling constraints, ensure that you use the SageMaker AI ML instance types prefixed with `ml.`." (accessed 2026-11-20)
- Use in dive: section 27, the instance box labels. G-family groups run On-Demand or Spot only: no training plan covers them (F09-35).

**F10-305. A restricted instance group (RIG) is a second kind of instance group, listed separately in `RestrictedInstanceGroups`: a specialised, network-isolated environment for foundation model customisation such as Amazon Nova, with its own FSx for Lustre configuration (`EnvironmentConfig.FSxLustreConfig`). It is not the group type for the arm's workloads.**
- Location: Developer Guide, "Creating a SageMaker HyperPod cluster with Amazon EKS orchestration" (console); "Setting up the SageMaker HyperPod observability add-on"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-create-cluster.html | Tier 1, first-party docs | definition | "**Restricted Instance Group (RIG)** is a specialized environment for foundational models customization such as Amazon Nova." ; https://docs.aws.amazon.com/sagemaker/latest/dg/hyperpod-observability-addon-setup.html | Tier 1, first-party docs | definition | "For Restricted Instance Groups (RIG), the Pod Identity Agent is not available due to network isolation constraints." (accessed 2026-11-20)
- Use in dive: section 27, one clause so the reader is not confused by the field in the request syntax.

### B2. HyperPod: provisioning, scaling and Spot

**F10-306. Continuous provisioning is the default for new HyperPod clusters on both orchestrators (`NodeProvisioningMode` `Continuous`). It is a desired-state model: HyperPod records the target count of each instance group, launches instances, retries failed launches in the background, and lets jobs start on the capacity that has arrived. A node reports one of these statuses: `Running`, `Failure`, `Pending`, `ShuttingDown`, `SystemUpdating`, `DeepHealthCheckInProgress`. Billing is per instance: it starts when the instance begins its lifecycle script and stops when it enters a terminating state; a launch that fails for lack of capacity is not billed.**
- Location: Developer Guide, "Continuous provisioning for enhanced cluster operations on Amazon EKS"; "Continuous provisioning for enhanced cluster operations with Slurm"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-scaling-eks.html | Tier 1, first-party docs | definition | "Continuous provisioning is the default for new clusters. You can also explicitly set `--node-provisioning-mode` to `Continuous`." and "**Running**: The node is healthy and registered with the cluster orchestrator (EKS)." and "**Failure**: The node provisioning failed but the system will automatically retry provisioning with a new EC2 instance." and "**Real-time billing updates**: Billing starts when an instance begins executing its lifecycle script and stops when the instance enters a terminating state" and "Billing does not start for instances that fail to launch." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-scaling-slurm.html | Tier 1, first-party docs | definition | "In the previous model, if any instance group could not be fully provisioned, the entire cluster creation or update operation failed and rolled back. With continuous provisioning, the system accepts partial capacity and continues to provision remaining instances asynchronously." (accessed 2026-11-20)
- Use in dive: section 27, the node status labels of the animation (Pending, Running, ShuttingDown) and the billing sentence.

**F10-307. `MinInstanceCount` (MinCount) is the number of instances that must be provisioned before an instance group becomes `InService`. If it is not reached within 3 hours HyperPod rolls the group back to its last good state. It is a gate at start-up and not a standing guarantee. It was extended to Slurm clusters on 27 May 2026.**
- Location: Developer Guide, "Continuous provisioning for enhanced cluster operations on Amazon EKS", "Minimum capacity requirements (MinCount)"; What's New 27 May 2026
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-scaling-eks.html | Tier 1, first-party docs | definition | "MinCount is not a permanent guarantee of minimum capacity. It only ensures that the specified minimum number of instances are available when the instance group first becomes `InService`." and "**Timeout and rollback**: If MinCount cannot be satisfied within 3 hours, the system automatically rolls back the instance group to its last known good state." ; https://aws.amazon.com/about-aws/whats-new/2026/05/amazon-sagemaker-hyperpod-mincount/ | Tier 2, launch announcement | launch announcement | "Posted on: May 27, 2026 Amazon SageMaker HyperPod now supports minimum capacity requirements (MinCount) for clusters using Slurm orchestration with continuous provisioning." (accessed 2026-11-20)
- Use in dive: section 27, the setting for a multi-node training group that is useless below N nodes.

**F10-308. A flexible instance group uses `InstanceRequirements.InstanceTypes` (up to 20 types, in priority order) in place of `InstanceType`; the two are mutually exclusive. HyperPod tries the first type, falls back down the list when capacity is missing, and on scale-down terminates the lowest-priority type first. It needs continuous provisioning, takes several subnets, and cannot be combined with MIG GPU partitioning. When Karpenter drives the group it ignores the list order and picks type and Availability Zone from pod requirements and pricing.**
- Location: Developer Guide, "Continuous provisioning for enhanced cluster operations on Amazon EKS", "Flexible instance groups"; "Using GPU partitions in Amazon SageMaker HyperPod"; release notes 16 April 2026
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-scaling-eks.html | Tier 1, first-party docs | definition | "Terminates instances of the lowest-priority instance type first during scale-down" and "Flexible instance groups are only available for clusters with `NodeProvisioningMode` set to `Continuous`." and "aws sagemaker create-cluster \ --cluster-name $HP_CLUSTER_NAME \ --orchestrator 'Eks={ClusterArn='$EKS_CLUSTER_ARN'}' \ --vpc-config '{ \"SecurityGroupIds\": [\"'$SECURITY_GROUP'\"], \"Subnets\": [\"'$SUBNET_AZ1'\", \"'$SUBNET_AZ2'\"] }' \ --instance-groups '[{ \"InstanceGroupName\": \"flexible-ig\", \"InstanceRequirements\": { \"InstanceTypes\": [\"ml.p5.48xlarge\", \"ml.p4d.24xlarge\", \"ml.g6.48xlarge\"] }, \"InstanceCount\": 10, \"LifeCycleConfig\": { \"SourceS3Uri\": \"s3://'$BUCKET_NAME'\", \"OnCreate\": \"on_create.sh\" }, \"ExecutionRole\": \"'$EXECUTION_ROLE'\" }]' \ --node-provisioning-mode Continuous" and "When Karpenter manages scaling, it uses its own selection logic based on pod requirements and pricing to determine which instance type to provision." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-gpu-partitioning.html | Tier 1, first-party docs | documentation of a limit | "GPU partitioning with MIG is not supported with flexible instance groups (instance groups that use `InstanceRequirements`)." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-notes.html | Tier 1, first-party docs | launch announcement | "You can specify up to 20 instance types per instance group." (accessed 2026-11-20)
- Use in dive: section 27, the instance-diversification setting for Spot. Sharpens F09-29 with the scale-down order, the MIG exclusion and the Karpenter difference.

**F10-309. HyperPod's Spot support is documented for EKS-orchestrated clusters with continuous provisioning: an instance group becomes a Spot group with `"CapacityRequirements": { "Spot": {} }`, and the setting cannot be changed after the group is created. A cluster mixes markets by having Spot groups and On-Demand groups, typically one per Availability Zone. No Slurm-orchestration page of the HyperPod documentation mentions Spot. AWS prints "up to 90% cost savings" `[vendor claim]`.**
- Location: Developer Guide, "Spot instances in Amazon SageMaker HyperPod"; API Reference, ClusterCapacityRequirements
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-spot.html | Tier 1, first-party docs | documentation of support | "By default, Spot Instances on HyperPod work with HyperPod's [continuous provisioning feature](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-scaling-eks.html), which enables SageMaker HyperPod to automatically provision remaining capacity in the background while workloads start immediately on available instances." and "`CapacityRequirements` cannot be modified once an Instance Group is created." and "Capture up to 90% cost savings compared to On-Demand instances" and "Resources: TestCluster: Type: AWS::SageMaker::Cluster Properties: ClusterName: \"SampleCluster\" InstanceGroups: - InstanceGroupName: group1 InstanceType: ml.c5.2xlarge InstanceCount: 1 LifeCycleConfig: SourceS3Uri: \"s3://'$BUCKET_NAME'\" OnCreate: \"on_create_noop.sh\" ExecutionRole: \"'$EXECUTION_ROLE'\", ThreadsPerCore: 1 CapacityRequirements: Spot: {} VpcConfig: Subnets: - \"'$SUBNET1'\" SecurityGroupIds: - \"'$SECURITY_GROUP'\" Orchestrator: Eks: ClusterArn: '$EKS_CLUSTER_ARN' NodeProvisioningMode: \"Continuous\" NodeRecovery: \"Automatic\"" ; https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ClusterCapacityRequirements.html | Tier 1, first-party docs | definition | "Defines the instance capacity requirements for an instance group, including configurations for both Spot and On-Demand capacity types." (accessed 2026-11-20)
- Use in dive: section 27, the Spot instance group snippet. The "no Slurm page mentions Spot" clause is a search result over the 61 downloaded HyperPod pages whose file name contains "slurm" (U10-8), so the dive should say "documented for EKS orchestration". The CLI examples on the Spot page are printed with a missing closing quote after `CapacityRequirements`; the CloudFormation form is the clean one to show. Sharpens F09-28.

**F10-310. What HyperPod does on a Spot interruption, in AWS's order: (1) detects the interruption signal; (2) taints the node so no new pod lands on it; (3) evicts the pods gracefully, respecting each pod's `terminationGracePeriodSeconds`; (4) provisions replacement capacity, retrying until it is available (inside the same instance group when there is no autoscaling; through Karpenter's fallback to other instance groups, On-Demand included, when there is); (5) Kubernetes reschedules the evicted pods. The 2-minute notice is best effort: EC2 may terminate without warning, in which case the node is replaced without graceful eviction.**
- Location: Developer Guide, "Spot instances in Amazon SageMaker HyperPod", "Managing Node Interruption"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-spot.html | Tier 1, first-party docs | definition | "Taints the node: Prevents new pods from being scheduled on the interrupted instance" and "Gracefully evicts pods: Gives running pods time to complete or checkpoint their work (respecting Kubernetes `terminationGracePeriodSeconds`)" and "In the case of non-autoscaling instance groups, HyperPod attempts to scale up within the same instance group until the required capacity becomes available." and "EC2 provides a best-effort 2-minute interruption notice in most cases, but this notice is not guaranteed." and "Without notice (immediate termination): Automatically reattempts node replacement (when Spot capacity becomes available) without graceful eviction" (accessed 2026-11-20)
- Use in dive: section 27, the Spot frames of the animation, five numbered steps. The pod's own `terminationGracePeriodSeconds` (under 120) and a SIGTERM handler that writes a checkpoint are the reader's part `[our reading]`.

**F10-311. With Karpenter, Spot and On-Demand instance groups are listed together in one `HyperpodNodeClass` (at most 10 groups). Karpenter prefers the Spot groups, uses On-Demand as the fallback, and orders its choice by the EC2 Spot placement score of each subnet's Availability Zone. AWS's tip: with `consolidateAfter: 0` consolidation can happen immediately and leave almost no time for graceful eviction, so set it above zero, up to 2 minutes, when pods need to checkpoint.**
- Location: Developer Guide, "Spot instances in Amazon SageMaker HyperPod", "Karpenter based Autoscaling"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-spot.html | Tier 1, first-party docs | definition | "apiVersion: karpenter.sagemaker.amazonaws.com/v1 kind: HyperpodNodeClass metadata: name: multiazg6 spec: instanceGroups: # name of InstanceGroup in HyperPod cluster. InstanceGroup needs to pre-created # before this step can be completed. # MaxItems: 10 - auto-spot-c5-2x-az1 - auto-spot-c5-2x-az2 - auto-spot-c5-x-az3 - auto-ondemand-c5-2x-az1" and "Karpenter prioritizes Spot instance groups over On-Demand instances, using On-Demand as a fallback when specified in the configuration. Instance selection is sorted by EC2 Spot Placement Scores associated with each subnet's availability zone." and "Set it to non zero upto 2 min to allow graceful pod eviction for any checkpointing needs." and "apiVersion: karpenter.sh/v1 kind: NodePool metadata: name: gpunodepool spec: template: spec: nodeClassRef: group: karpenter.sagemaker.amazonaws.com kind: HyperpodNodeClass name: multiazg6 expireAfter: Never requirements: - key: node.kubernetes.io/instance-type operator: Exists - key: \"node.kubernetes.io/instance-type\" // Optional otherwise Karpenter will decide based on Job config resource requirements operator: In values: [\"ml.c5.2xlarge\"] - key: \"topology.kubernetes.io/zone\" operator: In values: [\"us-west-2a\"]" and "aws sagemaker create-cluster \ --cluster-name clusterNameHere \ --orchestrator 'Eks={ClusterArn='$EKS_CLUSTER_ARN'}' \ --node-provisioning-mode \"Continuous\" \ --cluster-role 'arn:aws:iam::YOUR-ACCOUNT-ID:role/SageMakerHyperPodRole' \ --instance-groups '[{ \"InstanceGroupName\": \"auto-spot-c5-2x-az1\", \"InstanceType\": \"ml.c5.2xlarge\", \"InstanceCount\": 0, // For Auto scaling keep instance count as 0 \"CapacityRequirements: { \"Spot\": {} } \"LifeCycleConfig\": { \"SourceS3Uri\": \"s3://'$BUCKET_NAME'\", \"OnCreate\": \"on_create_noop.sh\" }, \"ExecutionRole\": \"'$EXECUTION_ROLE'\", \"ThreadsPerCore\": 1, \"OverrideVpcConfig\": { \"SecurityGroupIds\": [\"'$SECURITY_GROUP'\"], \"Subnets\": [\"'$SUBNET1'\"] } }]' --vpc-config '{ \"SecurityGroupIds\": [\"'$SECURITY_GROUP'\"], \"Subnets\": [\"'$SUBNET'\"] }' --auto-scaling ' { \"Mode\": \"Enable\", \"AutoScalerType\": \"Karpenter\" }'" (accessed 2026-11-20)
- Use in dive: section 27, the recommended Spot configuration: three Spot groups in three Zones plus one On-Demand group, one NodeClass, one NodePool with `consolidateAfter` between 30s and 2m.

**F10-312. Managed Karpenter autoscaling on HyperPod (EKS orchestration) is switched on with `AutoScaling` `{"Mode": "Enable", "AutoScalerType": "Karpenter"}`; HyperPod runs the Karpenter controller, so the cluster can scale to zero nodes with no node kept for the controller. Instance groups are pre-created with `InstanceCount` 0 and Karpenter adds nodes for pending pods. Prerequisites: continuous provisioning, `NodeRecovery` automatic, health monitoring agent 1.0.742.0_1.0.241.0 or above. Documented exclusions on the NodeClass page: instance groups with a training plan or reserved capacity, and instance groups with deep health checks, because a deep health check takes around 60-90 minutes while pods wait. The same page still says "Only on-demand capacity is supported at this time", which the Spot page contradicts.**
- Location: Developer Guide, "Autoscaling on SageMaker HyperPod EKS"; "Create a NodeClass"; "Create a NodePool"; API Reference, ClusterAutoScalingConfig
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-autoscaling.html | Tier 1, first-party docs | definition | "**Scale to zero** - Scale down to zero nodes without maintaining dedicated controller infrastructure." and "Health Monitoring Agent version 1.0.742.0\_1.0.241.0 or above installed." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-autoscaling-nodeclass.html | Tier 1, first-party docs | documentation of a limit | "You can specify up to 10 instance groups in a `NodeClass`." and "Only on-demand capacity is supported at this time. Instance groups with Training plan or reserved capacity are not supported." and "Instance groups with `DeepHealthChecks (DHC)` are not supported. This is because a DHC takes around 60-90 minutes to complete and pods will remain in pending state during that time which can cause over-provisioning." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-autoscaling-nodepool.html | Tier 1, first-party docs | definition | "apiVersion: karpenter.sh/v1 kind: NodePool metadata: name: <nodepool-name> uid: <resource-uid> ... spec: disruption: budgets: - nodes: 90% consolidateAfter: 0s consolidationPolicy: WhenEmptyOrUnderutilized template: spec: expireAfter: 720h nodeClassRef: group: karpenter.sagemaker.amazonaws.com kind: HyperpodNodeClass name: <nodeclass-name> requirements: - key: node.kubernetes.io/instance-type operator: Exists status: conditions: - lastTransitionTime: \"<timestamp>\" message: \"\" observedGeneration: 2 reason: ValidationSucceeded status: \"True\" type: ValidationSucceeded - lastTransitionTime: \"<timestamp>\" message: \"\" observedGeneration: 2 reason: NodeClassReady status: \"True\" type: NodeClassReady - lastTransitionTime: \"<timestamp>\" message: \"\" observedGeneration: 2 reason: Ready status: \"True\" type: Ready" ; https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ClusterAutoScalingConfig.html | Tier 1, first-party docs | definition | "The type of autoscaler to use. Currently supported value is `Karpenter`." (accessed 2026-11-20)
- Use in dive: section 27, scale from zero and scale to zero in the animation; the autoscaling snippet. Print the Spot-with-Karpenter support from the Spot page and note that the NodeClass page has not caught up (U10-9). Sharpens F09-27.

**F10-313. HyperPod Slurm clusters have no documented autoscaler: capacity changes when someone calls `UpdateCluster` with a new `InstanceCount` or `BatchDeleteClusterNodes`. No Slurm-chapter page read today describes power saving, scale to zero on idle, or Karpenter for Slurm. A Slurm-orchestrated HyperPod cluster is therefore a fixed pool between manual scaling calls, with at least the controller instance always running.**
- Location: Developer Guide, "SageMaker HyperPod Slurm cluster operations using the AWS CLI", "Scale down a cluster"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-operate-slurm-cli-command.html | Tier 1, first-party docs | definition | "You scale down by either using the `UpdateCluster` API operation to randomly terminate instances from your instance group down to a specified number, or by terminating specific instances using the `BatchDeleteClusterNodes` API operation." ; https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ClusterAutoScalingConfig.html | Tier 1, first-party docs | documentation of a limit | "Valid Values: `Karpenter`" (accessed 2026-11-20)
- Use in dive: section 27, the Slurm-or-EKS choice and the hand-off to PCS: a team that wants Slurm that scales to zero is described by PCS (F10-208), a team that wants Slurm on a held, health-checked GPU pool by HyperPod. The absence claim is `[our reading]` of a search for "autoscal" across the Slurm chapter (U10-8).

### B3. HyperPod: resilience

**F10-314. Node recovery is one cluster-level switch, `NodeRecovery`: `Automatic` (recommended, and the default) or `None`. With `Automatic` HyperPod reboots or replaces a faulty node when the health monitoring agent, a basic health check or a deep health check finds a problem. With `None` the agent only labels the node. On Slurm the health monitoring agent has been available since 11 September 2025.**
- Location: Developer Guide, "Automatic node recovery" (EKS); "Automatic node recovery and auto-resume" (Slurm)
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html | Tier 1, first-party docs | definition | "We recommend setting the `Automatic` option. By default, the clusters are set up with Automatic node recovery." and "As of September 11, 2025, HyperPod with Slurm orchestration now supports health monitoring agents." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-node-recovery.html | Tier 1, first-party docs | definition | "If set to `None`, the health monitoring agent will label the instances when a fault is detected, but it will not automatically initiate any repair or recovery actions on the affected nodes. This option is not recommended." (accessed 2026-11-20)
- Use in dive: section 27, the "node fails" frame. Confirms F09-24.

**F10-315. Slurm auto-resume is a flag on one job step: `srun --auto-resume=1`. When that step exits non-zero because of a hardware fault, HyperPod runs hardware checks (nvidia-smi, Neuron sysfs, EFA), replaces the faulty node and restarts the step after the replacement; with auto-resume the node is always replaced, never rebooted. Rules that follow from the mechanism: run inside an exclusive allocation, put all environment setup in the single `srun` script so it works on a fresh node, and do not read `$SLURM_JOB_NODELIST` because it may be stale after the resume. A job on GRES-enabled nodes is requeued and restarts from the beginning. A job without the flag simply exits and must be resubmitted.**
- Location: Developer Guide, "Automatic node recovery and auto-resume"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html | Tier 1, first-party docs | definition | "#!/bin/bash #SBATCH --nodes 2 #SBATCH --exclusive srun --auto-resume=1 {{train_auto_resume.sh}}" and "Launch the job with SageMaker HyperPod auto-resume enabled by adding the flag `--auto-resume=1` to indicate that the `srun` command should be automatically retried in case of hardware failure." and "If you use auto-resume, the nodes are always replaced (no reboots) when hardware failures are detected." and "Do not use the `$SLURM_JOB_NODELIST` environment variable provided by Slurm, because its value might be outdated after SageMaker HyperPod auto-resumes the job." and "This process involves stopping the job, placing it back into the job queue, and then restarting the job from the beginning." and "Jobs without auto-resume enabled will simply exit, requiring manual resubmission by administrators or users." and "#!/bin/bash # Filename: train_auto_resume.sh # Sample containerized script to launch a training job with a single srun which can be auto-resumed. # Place your training environment setup here. # Example: Install conda, docker, activate virtual env, etc. # Get the list of nodes for a given job NODE_LIST=$(scontrol show jobid=$SLURM_JOBID | \ # Show details of the SLURM job awk -F= '/NodeList=/{print $2}' | \ # Extract NodeList field grep -v Exc) # Exclude nodes marked as excluded # Determine the master node from the node list MASTER_NODE=$(scontrol show hostname $NODE_LIST | \ # Convert node list to hostnames head -n 1) # Select the first hostname as master node # Get the master node address MASTER_ADDR=$(scontrol show node=$MASTER_NODE | \ # Show node information awk -F= '/NodeAddr=/{print $2}' | \ # Extract NodeAddr awk '{print $1}') # Print the first part of NodeAddr # Torchrun command to launch the training job torchrun_cmd=\"torchrun --nnodes=$SLURM_NNODES \ --nproc_per_node=1 \ --node_rank=$SLURM_NODE \ --master-addr=$MASTER_ADDR \ --master_port={{1234}} \ {{<your_training_script.py>}}\" # Execute the torchrun command in the 'pytorch' Conda environment, # streaming output live /opt/conda/bin/conda run --live-stream -n pytorch $torchrun_cmd" (accessed 2026-11-20)
- Use in dive: section 27, the Slurm resilience snippet and the checkpoint rule: "restarts the job from the last saved checkpoint" is true only if the training script loads its own checkpoint at start.

**F10-316. On EKS the equivalent is job auto-resume through the Kubeflow Training Operator (release 1.7.0, 1.8.0 or 1.8.1): two annotations on the `PyTorchJob`, `sagemaker.amazonaws.com/enable-job-auto-resume: "true"` and `sagemaker.amazonaws.com/job-max-retry-count`, plus `restartPolicy: OnFailure`, and a node selector that keeps pods on nodes labelled `sagemaker.amazonaws.com/node-health-status: Schedulable`.**
- Location: Developer Guide, "Running jobs using kubectl"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-run-jobs-kubectl.html | Tier 1, first-party docs | definition | "apiVersion: \"kubeflow.org/v1\" kind: PyTorchJob metadata: name: pytorch-simple namespace: kubeflow annotations: { // config for job auto resume sagemaker.amazonaws.com/enable-job-auto-resume: \"true\" sagemaker.amazonaws.com/job-max-retry-count: \"2\" } spec: pytorchReplicaSpecs: ...... Worker: replicas: 10 restartPolicy: OnFailure template: spec: nodeSelector: sagemaker.amazonaws.com/node-health-status: Schedulable" and "Training job auto resume requires Kubeflow Training Operator release version `1.7.0`, `1.8.0`, or `1.8.1`." and "You need to add two annotations and set `restartPolicy` to `OnFailure` as follows." (accessed 2026-11-20)
- Use in dive: section 27, the PyTorchJob snippet for workloads 8, 9 and 14.

**F10-317. The HyperPod training operator adds a second job kind, `HyperPodPyTorchJob` (`apiVersion: sagemaker.amazonaws.com/v1`), whose `runPolicy` carries the recovery rules: `jobMaxRetryCount`, a `restartPolicy` that restarts failed processes a set number of times before a full job restart (`numRestartBeforeFullJobRestart`, `maxFullJobRestarts`), and `logMonitoringConfiguration` rules that declare a job hung when a log pattern stops appearing (for example no new batch line within 300 seconds) or throughput stays below a threshold. Supported Kubernetes versions are 1.28 to 1.33 and PyTorch 2.4.0 to 2.7.1. Kueue is optional for it.**
- Location: Developer Guide, "Using the HyperPod training operator"; "Usage"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator-usage.html | Tier 1, first-party docs | definition | "apiVersion: sagemaker.amazonaws.com/v1 kind: HyperPodPyTorchJob metadata: labels: app.kubernetes.io/name: HyperPod app.kubernetes.io/managed-by: kustomize name: &jobname xxx annotations: XXX: XXX ...... spec: nprocPerNode: \"X\" replicaSpecs: - name: 'XXX' replicas: 16 template: spec: nodeSelector: beta.kubernetes.io/instance-type: ml.p5.48xlarge containers: - name: XXX image: XXX imagePullPolicy: Always ports: - containerPort: 8080 # This is the port that HyperPodElasticAgent listens to resources: limits: nvidia.com/gpu: 8 hugepages-2Mi: 5120Mi requests: nvidia.com/gpu: 8 hugepages-2Mi: 5120Mi memory: 32000Mi ...... runPolicy: jobMaxRetryCount: 50 restartPolicy: numRestartBeforeFullJobRestart: 3 evalPeriodSeconds: 21600 maxFullJobRestarts: 1 cleanPodPolicy: \"All\" logMonitoringConfiguration: - name: \"JobStart\" logPattern: \".*Experiment configuration.*\" # This is the start of the training script expectedStartCutOffInSeconds: 120 # Expected match in the first 2 minutes - name: \"JobHangingDetection\" logPattern: \".*\\[Epoch 0 Batch \\d+.*'training_loss_step': (\\d+(\\.\\d+)?).*\" expectedRecurringFrequencyInSeconds: 300 # If next batch is not printed within 5 minute, consider it hangs. Or if loss is not decimal (e.g. nan) for 2 minutes, mark it hang as well. expectedStartCutOffInSeconds: 600 # Allow 10 minutes of job startup time - name: \"NoS3CheckpointingDetection\" logPattern: \".*The checkpoint is finalized. All shards is written.*\" expectedRecurringFrequencyInSeconds: 600 # If next checkpoint s3 upload doesn't happen within 10 mins, mark it hang. expectedStartCutOffInSeconds: 1800 # Allow 30 minutes for first checkpoint upload - name: \"LowThroughputDetection\" logPattern: \".*\\[Epoch 0 Batch \\d+.*'samples\\/sec': (\\d+(\\.\\d+)?).*\" metricThreshold: 80 # 80 samples/sec operator: \"lteq\" metricEvaluationDataPoints: 25 # if throughput lower than threshold for 25 datapoints, kill the job" ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator.html | Tier 1, first-party docs | documentation of support | "Supported Kubernetes versions - 1.28, 1.29, 1.30, 1.31, 1.32, and 1.33" and "While Kueue is not required for this training operator, your cluster administrator can install and configure it for enhanced job scheduling capabilities." (accessed 2026-11-20)
- Use in dive: section 27, the HyperPodPyTorchJob snippet. The operator's supported Kubernetes range (to 1.33) is narrower than HyperPod's own (1.30 to 1.35, F10-329): check before choosing a cluster version.

**F10-318. Deep health checks and their cost in time. On EKS there are three types (`InstanceStress`, `InstanceConnectivity`, `MultiNodeTrainingValidation`), on Slurm two (`InstanceStress`, `InstanceConnectivity`). The longest single test is NVIDIA DCGM diagnostics at level 4, about 45 to 90 minutes depending on GPU count; the EFA loopback test takes about 2 to 5 minutes. AWS's planning figure is "about a couple of hours" for a new instance, which is why its guidance for a small cluster with no spare nodes is to disable deep health checks, and why Karpenter-scaled groups cannot use them. On Slurm a node under test sits in a Slurm maintenance reservation.**
- Location: Developer Guide, "Deep health checks" (Slurm); "Deep health checks" (EKS); "Suggested resilience configurations"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html | Tier 1, first-party docs | definition | "Typical duration: \~45-90 minutes depending on GPU count." and "Typical duration: \~2-5 minutes." and "During deep health checks, affected nodes are placed in a Slurm maintenance reservation to prevent jobs from being scheduled on them." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-config-tips.html | Tier 1, first-party docs | definition | "When the deep health checks are enabled, whenever a new instance is added to the HyperPod cluster (either during create-cluster or through automatic node replacement), the new instance goes through the deep health check process (instance level stress tests) for about a couple of hours." and "**Recommendation**: disable the deep health check config throughout the cluster life cycle. Node auto recovery config is enabled by default." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-deep-health-checks.html | Tier 1, first-party docs | definition | "The `MultiNodeTrainingValidation` deep health check runs the Tiny Megatron and Megatron tests. It runs only on clusters orchestrated by Amazon EKS, on supported EFA-enabled NVIDIA GPU instance types." (accessed 2026-11-20)
- Use in dive: section 27, the health-check moving part with its duration. Adds the durations F09-23 lacks.

**F10-319. Three training-resilience features sit on EKS orchestration and exclude each other in places. Checkpointless training (training operator v1.2.0 or above, built on NVIDIA NeMo, recipes verified on ml.p5 instances) is incompatible with managed tiered checkpointing and with elastic training. Elastic training in turn does not support Spot Instances. Managed tiered checkpointing writes PyTorch checkpoints to CPU memory on the nodes, replicates them to adjacent nodes and persists them periodically to storage such as Amazon S3. Elastic training (`elasticPolicy` on a `HyperPodPyTorchJob`: `minReplicas`, `maxReplicas`, `gracefulShutdownTimeoutInSeconds: 600`, `scalingTimeoutInSeconds: 60`) grows and shrinks a job by checkpointing and resuming at a new world size. AWS reports over 80% less downtime for checkpointless training in internal studies on 16 to over 2,000 GPUs `[vendor claim]`.**
- Location: Developer Guide, "Checkpointless training in Amazon SageMaker HyperPod"; "Special considerations"; "HyperPod managed tiered checkpointing"; "Elastic training"; AWS News Blog 3 December 2025
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless-considerations.html | Tier 1, first-party docs | documentation of a limit | "HyperPod managed tiered checkpointing and elastic training: note that HyperPod checkpointless training is currently incompatible with HyperPod managed tiered checkpointing and elastic training." and "These recipes have been verified on ml.p5 instances." ; https://docs.aws.amazon.com/sagemaker/latest/dg/managed-tier-checkpointing.html | Tier 1, first-party docs | definition | "When you save a checkpoint, the system stores it in allocated memory space across your cluster nodes. It automatically replicates data across adjacent compute nodes for enhanced reliability." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-elastic-training.html | Tier 1, first-party docs | definition | "apiVersion: sagemaker.amazonaws.com/v1 kind: HyperPodPyTorchJob metadata: name: elastic-training-job spec: elasticPolicy: minReplicas: 1 maxReplicas: 4 # Increment amount of pods in fixed-size groups # Amount of pods will be equal to minReplicas + N * replicaIncrementStep replicaIncrementStep: 1 # ... or Provide an exact amount of pods that required for training replicaDiscreteValues: [2,4,8] # How long traing operator wait job to save checkpoint and exit during # scaling events. Job will be force-stopped after this period of time gracefulShutdownTimeoutInSeconds: 600 # When scaling event is detected: # how long job controller waits before initiate scale-up. # Some delay can prevent from frequent scale-ups and scale-downs scalingTimeoutInSeconds: 60 # In case of faults, specify how long elastic training should wait for # recovery, before triggering a scale-down faultyScaleDownTimeoutInSeconds: 30 ... replicaSpecs: - name: pods replicas: 4 # Initial replica count maxReplicas: 8 # Max for this replica spec (should match elasticPolicy.maxReplicas) ..." and "Elastic training does not currently support checkpointless training capabilities, HyperPod managed tiered checkpointing, or Spot instances." ; https://aws.amazon.com/blogs/aws/introducing-checkpointless-and-elastic-training-on-amazon-sagemaker-hyperpod/ | Tier 2, launch announcement | benchmark claim (vendor reported) | "Additionally, based on internal studies on cluster sizes ranging between 16 GPUs to over 2,000 GPUs, checkpointless training showcased significant improvements in recovery times, reducing downtime by over 80% compared to traditional checkpoint-based recovery." (accessed 2026-11-20)
- Use in dive: section 27, one paragraph and the elastic snippet. For the arm these matter only at workload 15; a single-node ACT or SmolVLA fine-tune needs an ordinary checkpoint and auto-resume `[our reading]`. Confirms F09-30 to F09-32, including the Spot exclusion of elastic training.

### B4. HyperPod: task governance (Kueue)

**F10-320. Task governance is an EKS add-on that installs Kueue: add-on v1.6.1-eksbuild.1 and v1.6.0-eksbuild.1 install Kueue v0.19.2, v1.5.0-eksbuild.1 installs v0.18.0. It has two API objects. The cluster policy (`CreateClusterSchedulerConfig`) holds `FairShare` (default `Enabled`), `IdleResourceSharing`, and up to 10 `PriorityClasses`, each a name and a weight from 0 (lowest, the default) to 100. The compute allocation (`CreateComputeQuota`) holds, per team, up to 15 `ComputeQuotaResources` (an instance type with a count, or accelerators, vCPU, memory, or an accelerator partition), `PreemptTeamTasks` (`Never` or `LowerPriority`, default `LowerPriority`), a `ResourceSharingConfig` with `Strategy` (`Lend`, `DontLend`, `LendAndBorrow`) and `BorrowLimit` (percent, default 50, range 0 to 10000), and a `FairShareWeight`.**
- Location: Developer Guide, "Task governance setup"; API Reference, CreateClusterSchedulerConfig, CreateComputeQuota, SchedulerConfig, ComputeQuotaConfig, ResourceSharingConfig, PriorityClass
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateClusterSchedulerConfig.html | Tier 1, first-party docs | definition | "{ \"ClusterArn\": \"{{string}}\", \"Description\": \"{{string}}\", \"Name\": \"{{string}}\", \"SchedulerConfig\": { \"FairShare\": \"{{string}}\", \"IdleResourceSharing\": \"{{string}}\", \"PriorityClasses\": [ { \"Name\": \"{{string}}\", \"Weight\": {{number}} } ] }, \"Tags\": [ { \"Key\": \"{{string}}\", \"Value\": \"{{string}}\" } ] }" ; https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateComputeQuota.html | Tier 1, first-party docs | definition | "{ \"ActivationState\": \"{{string}}\", \"ClusterArn\": \"{{string}}\", \"ComputeQuotaConfig\": { \"ComputeQuotaResources\": [ { \"AcceleratorPartition\": { \"Count\": {{number}}, \"Type\": \"{{string}}\" }, \"Accelerators\": {{number}}, \"Count\": {{number}}, \"InstanceType\": \"{{string}}\", \"MemoryInGiB\": {{number}}, \"VCpu\": {{number}} } ], \"PreemptTeamTasks\": \"{{string}}\", \"ResourceSharingConfig\": { \"AbsoluteBorrowLimits\": [ { \"AcceleratorPartition\": { \"Count\": {{number}}, \"Type\": \"{{string}}\" }, \"Accelerators\": {{number}}, \"Count\": {{number}}, \"InstanceType\": \"{{string}}\", \"MemoryInGiB\": {{number}}, \"VCpu\": {{number}} } ], \"BorrowLimit\": {{number}}, \"Strategy\": \"{{string}}\" } }, \"ComputeQuotaTarget\": { \"FairShareWeight\": {{number}}, \"TeamName\": \"{{string}}\" }, \"Description\": \"{{string}}\", \"Name\": \"{{string}}\", \"Tags\": [ { \"Key\": \"{{string}}\", \"Value\": \"{{string}}\" } ] }" ; https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ResourceSharingConfig.html | Tier 1, first-party docs | definition | "Default is `50`." and "Valid Range: Minimum value of 0. Maximum value of 10000." and "Valid Values: `Lend | DontLend | LendAndBorrow`" ; https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_PriorityClass.html | Tier 1, first-party docs | definition | "A weight of 0 is the lowest priority and 100 is the highest. Weight 0 is the default." ; https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ComputeQuotaConfig.html | Tier 1, first-party docs | definition | "Valid Values: `Never | LowerPriority`" ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-setup-task-governance.html | Tier 1, first-party docs | documentation of support | "| v1.6.1-eksbuild.1 | v0.19.2 |" and "| v1.5.0-eksbuild.1 | v0.18.0 |" (accessed 2026-11-20)
- Use in dive: section 27, the task governance moving part with real field names and defaults. Confirms F09-25 and adds the defaults F09-26 lacks (borrow limit 50, preemption `LowerPriority`, at most 10 priority classes).

**F10-321. How a task meets governance. Creating a compute allocation for team `X` creates the Kubernetes namespace `hyperpod-ns-X` and a Kueue LocalQueue `hyperpod-ns-X-localqueue`. A job joins by carrying two labels, `kueue.x-k8s.io/queue-name: hyperpod-ns-X-localqueue` and `kueue.x-k8s.io/priority-class: <class>-priority`. A job with no priority class is treated as low priority with a task ranking value of 0; a class that is not in the cluster policy makes the submission fail.**
- Location: Developer Guide, "Example HyperPod task governance AWS CLI commands"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-cli.html | Tier 1, first-party docs | definition | "metadata: name: {{job-name}} namespace: hyperpod-ns-{{team-name}} labels: kueue.x-k8s.io/queue-name: hyperpod-ns-{{team-name}}-localqueue kueue.x-k8s.io/priority-class: {{priority-class-name}}-priority" and "If a priority class is not specified, the job is treated as a low priority job, with a task ranking value of 0." and "The namespace in this example, `hyperpod-ns-test-team`, is created in Kubernetes based on the team name provided, `test-team`, when the compute allocation is created." and "hyperpod start-job --job-name hyperpod-cli-test --job-kind kubeflow/PyTorchJob --image docker.io/kubeflowkatib/pytorch-mnist-cpu:v1beta1-bc09cfd --entry-script /opt/pytorch-mnist/mnist.py --pull-policy IfNotPresent --instance-type ml.g5.xlarge --node-count 1 --tasks-per-node 1 --results-dir ./result --priority training-priority" (accessed 2026-11-20)
- Use in dive: section 27, the queue box of the EKS drawing (one LocalQueue per team) and the label snippet.

**F10-322. Governance policies in AWS's words. Idle compute is lent first-come first-serve or by fair-share weight; tasks are ordered first-come first-serve or by task ranking; a task running on borrowed quota "may be preempted by another task of higher priority"; by default the team that lends idle compute preempts the borrowers; a team can borrow up to 10,000% of its allocation. Since 16 March 2026 capacity that no team owns can also be borrowed (unallocated resource sharing). Gang scheduling uses Kueue's `waitForPodsReady`: if not all pods of a workload are ready within the timeout, the workload is evicted and requeued with exponential backoff.**
- Location: Developer Guide, "Policies"; "Using gang scheduling in Amazon SageMaker HyperPod task governance"; What's New 16 March 2026
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-policies.html | Tier 1, first-party docs | definition | "**Task preemption**: Compute is taken over from a task based on priority. By default, the team loaning idle compute will preempt tasks from other teams." and "A team can borrow up to 10,000% of allocated compute." and "**Unallocated resource sharing** enables teams to borrow compute resources that are not allocated to any team through compute quota." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-tasks-gang-scheduling.html | Tier 1, first-party docs | definition | "HyperPod task governance uses Kueue's `waitForPodsReady` feature to implement gang scheduling." and "**Automatic recovery** - If pods aren't ready within the timeout, the workload is evicted and requeued with configurable exponential backoff, rather than hanging indefinitely." ; https://aws.amazon.com/about-aws/whats-new/2026/03/sagemaker-hyperpod-idle-resource-sharing/ | Tier 2, launch announcement | launch announcement | "Posted on: Mar 16, 2026 Amazon SageMaker HyperPod task governance now supports dynamic resource sharing, allowing teams to borrow unallocated compute capacity in HyperPod clusters beyond their guaranteed quotas." (accessed 2026-11-20)
- Use in dive: section 27, the lend, borrow and preempt animation step. Confirms F09-26 and dates the unallocated-sharing feature.

**F10-323. Topology-aware scheduling (task governance v1.2.2-eksbuild.1 or higher) places a job's pods by network proximity using node labels `topology.k8s.aws/network-node-layer-1` to `-layer-3` and `topology.k8s.aws/ultraserver-id`; a job asks with the annotation `kueue.x-k8s.io/podset-required-topology` or `kueue.x-k8s.io/podset-preferred-topology`. The supported instance list is P, Trainium and UltraServer types only; no G type is on it.**
- Location: Developer Guide, "Using topology-aware scheduling in Amazon SageMaker HyperPod task governance"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-tasks-scheduling.html | Tier 1, first-party docs | definition | "apiVersion: batch/v1 kind: Job metadata: name: test-tas-job namespace: hyperpod-ns-{{team-name}} labels: kueue.x-k8s.io/queue-name: hyperpod-ns-{{team-name}}-localqueue kueue.x-k8s.io/priority-class: {{PRIORITY_CLASS}}-priority spec: parallelism: 10 completions: 10 suspend: true template: metadata: labels: kueue.x-k8s.io/queue-name: hyperpod-ns-{{team-name}}-localqueue annotations: kueue.x-k8s.io/podset-required-topology: \"topology.k8s.aws/network-node-layer-3\" or kueue.x-k8s.io/podset-preferred-topology: \"topology.k8s.aws/network-node-layer-3\" spec: nodeSelector: topology.k8s.aws/network-node-layer-3: {{TOPOLOGY_LABEL_VALUE}} containers: - name: dummy-job image: gcr.io/k8s-staging-perf-tests/sleep:v0.1.0 args: [\"3600s\"] resources: requests: cpu: \"100\" restartPolicy: Never" and "To use topology-aware scheduling, make sure that your version of HyperPod task governance is v1.2.2-eksbuild.1 or higher." and "If resources don't share the same topology label, the job will be suspended. The job will be in the waitlist." (accessed 2026-11-20)
- Use in dive: section 27, one sentence under workload 15. The YAML on the page prints both annotations with the word "or" between them; a real manifest keeps one.

**F10-324. GPU sharing on HyperPod is NVIDIA MIG (Multi-Instance GPU): one supported GPU is split into up to seven isolated partitions, on `ml.p4d.24xlarge`, `ml.p4de.24xlarge`, `ml.p5.48xlarge`, `ml.p5e.48xlarge`, `ml.p5en.48xlarge` and P6 B200 types. A team's quota can be expressed in partitions (`AcceleratorPartition` with a `Type` such as `mig-1g.5gb` and a `Count`). No G-family type is on the list, MIG cannot be used in a flexible instance group, and no HyperPod page read today documents time-slicing.**
- Location: Developer Guide, "Using GPU partitions in Amazon SageMaker HyperPod"; "GPU partition quota"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-gpu-partitioning.html | Tier 1, first-party docs | documentation of support | "GPU partitioning with MIG technology supports GPUs and allows you to partition a single supported GPU into up to seven separate GPU partitions." and "**ml.p5.48xlarge** - 8 NVIDIA H100 GPUs (80GB HBM3 per GPU)" ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-policies-compute-allocation-gpu-partitions.html | Tier 1, first-party docs | definition | "aws sagemaker create-compute-quota \ --name \"fractional-gpu-quota\" \ --compute-quota-config '{ \"ComputeQuotaResources\": [ { \"InstanceType\": \"ml.p4d.24xlarge\", \"AcceleratorPartition\": { \"Count\": 4, \"Type\": \"mig-1g.5gb\" } } ], \"ResourceSharingConfig\": { \"Strategy\": \"LendAndBorrow\", \"BorrowLimit\": 100 } }'" (accessed 2026-11-20)
- Use in dive: section 27, GPU sharing. For the arm's small policies on G instances there is no documented fractional-GPU path on HyperPod; that is an EKS-with-KAI or time-slicing question (register 09, F09-41) `[our reading]`.

### B5. HyperPod: reserved capacity, storage, network, platform

**F10-325. A SageMaker training plan attaches to HyperPod per instance group, through the group's `TrainingPlanArn`. AWS advises against putting the primary (controller) instance group on a training plan, because it needs continuous capacity and a plan has a fixed and possibly discontinuous duration. A group on a training plan cannot be scaled by Karpenter.**
- Location: Developer Guide, "Using training plans in SageMaker HyperPod clusters"; "Create an HyperPod cluster on a training plan programmatically"; "Create a NodeClass"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/training-plan-utilization-for-hyperpod.html | Tier 1, first-party docs | definition | "You can select a plan for each of your instance groups. However, we do not recommend using a training plan for the primary instance group of a cluster, as primary nodes require continuous, stable resources that don't align with the fixed duration and potentially discontinuous nature of training plan capacities." ; https://docs.aws.amazon.com/sagemaker/latest/dg/use-training-plan-for-hyperpod-creation-using-api-cli-sdk.html | Tier 1, first-party docs | definition | "# Create a cluster aws sagemaker create-cluster \ --cluster-name {{cluster-name}} \ --instance-groups '[ \ { \ \"InstanceCount\": {{1}},\ \"InstanceGroupName\": \"{{controller-nodes}}\",\ \"InstanceType\": \"{{ml.t3.xlarge}}\",\ \"LifeCycleConfig\": {\"SourceS3Uri\": {{source_s3_uri}}, \"OnCreate\": \"on_create.sh\"},\ \"ExecutionRole\": \"arn:aws:iam::{{customer_account_id}}:role/{{execution_role}}\",\ \"ThreadsPerCore\": {{1}},\ },\ { \ \"InstanceCount\": {{2}}, \ \"InstanceGroupName\": \"{{worker-nodes}}\",\ \"InstanceType\": \"{{p4d.24xlarge}}\",\ \"LifeCycleConfig\": {\"SourceS3Uri\": {{source_s3_uri}}, \"OnCreate\": \"on_create.sh\"},\ \"ExecutionRole\": \"arn:aws:iam::{{customer_account_id}}}:role/{{execution_role}}}\",\ \"ThreadsPerCore\": {{1}},\ \"TrainingPlanArn\": {{training_plan_arn}},\ }]'" ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-autoscaling-nodeclass.html | Tier 1, first-party docs | documentation of a limit | "Instance groups with Training plan or reserved capacity are not supported." (accessed 2026-11-20)
- Use in dive: section 27, the reserved-capacity instance group for workloads 14 and 15. Adds the attachment mechanism to F09-34.

**F10-326. Storage on HyperPod. Under Slurm, shared file systems are declared per instance group in `InstanceStorageConfigs`: `FsxLustreConfig` (`DnsName`, `MountPath`, `MountName`) or `FsxOpenZfsConfig`, plus `EbsVolumeConfig` for a local volume (500 GB on the controller in AWS's example); AWS calls FSx optional for creation and recommended for production. Under EKS, storage is Kubernetes storage: the docs point to FSx for Lustre and Mountpoint for Amazon S3 set-ups in the HyperPod workshop and to the Amazon EBS CSI driver.**
- Location: Developer Guide, "Getting started with SageMaker HyperPod using the AWS CLI"; "Configuring storage for SageMaker HyperPod clusters orchestrated by Amazon EKS"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/smcluster-getting-started-slurm-cli.html | Tier 1, first-party docs | definition | "SageMaker HyperPod supports Amazon FSx for Lustre and FSx for OpenZFS, configured per instance group via `InstanceStorageConfigs`. FSx configuration is optional for cluster creation but recommended for production workloads." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-setup-storage.html | Tier 1, first-party docs | definition | "[Set up a mountpoint for Amazon S3](https://catalog.us-east-1.prod.workshops.aws/workshops/2433d39e-ccfe-4c00-9d3d-9917b729258e/en-US/01-cluster/09-s3-mountpoint) using [Mountpoint for Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mountpoint.html)" (accessed 2026-11-20)
- Use in dive: section 27, the storage box; the `FsxLustreConfig` lines are inside the block for F10-302. EFS on HyperPod was not found on the pages read (U10-10).

**F10-327. Network facts for sizing. HyperPod deploys all cluster instances in a single Availability Zone by default and also documents a multi-AZ set-up. Each P5 instance can take 32 IP addresses under Slurm and 81 under EKS (50 on the primary card plus one on each of the other 31). Since 1 June 2026 an instance group can use EFA-only network interfaces, which carry no IP networking, to stop large clusters from exhausting the subnet.**
- Location: Developer Guide, "Prerequisites for using SageMaker HyperPod"; What's New 1 June 2026
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-prerequisites.html | Tier 1, first-party docs | documentation of a limit | "For Slurm-orchestrated clusters, each P5 instance can create 32 IP addresses (one per network card). For EKS-orchestrated clusters, each P5 instance can create 81 IP addresses (50 from the primary card plus one from each of the remaining 31 cards)." and "HyperPod deploys all cluster instances in a single Availability Zone." and "SageMaker HyperPod supports multi-Availability Zone deployment." ; https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-sagemaker-hyperpod-efa-only/ | Tier 2, launch announcement | launch announcement | "Posted on: Jun 1, 2026 Amazon SageMaker HyperPod now supports EFA-only network interfaces for cluster instance groups, enabling you to configure dedicated Elastic Fabric Adapter (EFA) devices without the traditional Elastic Network Adapter (ENA) for IP networking." (accessed 2026-11-20)
- Use in dive: section 27, the network box. Confirms F09-36 and adds EFA-only interfaces.

**F10-328. Pod density on EKS-orchestrated HyperPod rose in November 2026: the VPC CNI can attach more elastic network interfaces to a node on demand through the new `AttachClusterNodeNetworkInterface` API (release note 11 November 2026, What's New 18 November 2026; VPC CNI `v1.23.3-eksbuild.1` or later). The pod ceiling per node is `maxPods = (number of ENIs x (IPv4 addresses per ENI - 1)) + 2`; the published maximum is 51 pods for `ml.p5.48xlarge` and 110 for `ml.g6e.4xlarge`.**
- Location: Developer Guide, "Increasing pods per node with dynamic ENI attachment"; "Getting started with Amazon EKS support in SageMaker HyperPod"; HyperPod release notes; What's New 18 November 2026
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-notes.html | Tier 1, first-party docs | launch announcement | "## SageMaker HyperPod release notes: November 11, 2026" and "The Amazon VPC CNI can now attach more elastic network interfaces (ENIs) to cluster nodes through the new `AttachClusterNodeNetworkInterface` API." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-prerequisites.html | Tier 1, first-party docs | documentation of a limit | "<tr><td>ml.p5.48xlarge</td><td>51</td></tr>" and "<tr><td>ml.g6e.4xlarge</td><td>110</td></tr>" ; https://aws.amazon.com/about-aws/whats-new/2026/11/sagemaker-hyperpod-higher-pod-density/ | Tier 2, launch announcement | launch announcement | "Posted on: Nov 18, 2026 Amazon SageMaker HyperPod now supports higher pod density per node on EKS-orchestrated clusters, allowing you to get more out of every instance." (accessed 2026-11-20)
- Use in dive: section 27, 2026 features. The formula is printed on the page with a multiplication sign and a minus sign; it is written here with "x" and "-". It matters to the arm when many small CPU-side pods (decode workers, simulation stepping) share a GPU node.

**F10-329. Platform facts for an EKS-orchestrated HyperPod cluster. Supported Kubernetes versions: 1.30, 1.31, 1.32, 1.33, 1.34 and 1.35; VPC CNI 1.18.3 or later. Before the cluster is created a HyperPod Helm chart is installed on the EKS cluster; it bundles the health monitoring agent, the Kubeflow Training Operator, the Kubeflow MPI operator, the `nvidia-device-plugin`, the `neuron-device-plugin` and the `aws-efa-k8s-device-plugin`, and sets up Kueue, storage and MLflow integration.**
- Location: Developer Guide, "Getting started with Amazon EKS support in SageMaker HyperPod"; "Installing packages on the Amazon EKS cluster using Helm"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-prerequisites.html | Tier 1, first-party docs | documentation of support | "SageMaker HyperPod supports Kubernetes versions 1.30, 1.31, 1.32, 1.33, 1.34, and 1.35." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-install-packages-using-helm-chart.html | Tier 1, first-party docs | definition | "The SageMaker HyperPod service team provides a Helm chart package, which bundles key dependencies such as device/EFA plug-ins, plug-ins, [Kubeflow Training Operator](https://www.kubeflow.org/docs/components/training/), and associated permission configurations." and "helm install hyperpod-dependencies HyperPodHelmChart --namespace kube-system" (accessed 2026-11-20)
- Use in dive: section 27, the "what sits on the EKS side" strip of the drawing.

**F10-330. Around the scheduler. Slurm clusters run containers through Docker, Enroot and Pyxis and have an opt-in hung-job detector (the `HYPERPOD_HANG_RULES` environment variable, off by default). EKS clusters have the HyperPod CLI (`hyperpod start-job --job-kind kubeflow/PyTorchJob ... --priority training-priority`), an observability add-on that collects NVIDIA DCGM, node, EFA, Kueue and task-operator metrics into Amazon Managed Service for Prometheus or, from add-on v1.5.0-eksbuild.1, Amazon CloudWatch, and an inference path (deploy from JumpStart, Amazon S3 or FSx with kubectl, the Python SDK, Studio or the CLI).**
- Location: Developer Guide, "Running Docker containers on a Slurm compute node on HyperPod"; "Hung job detection"; "Amazon SageMaker HyperPod observability add-on"; "Deploying models on Amazon SageMaker HyperPod"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-run-jobs-slurm-docker.html | Tier 1, first-party docs | definition | "To run Docker containers with Slurm on SageMaker HyperPod, you need to use [Enroot](https://github.com/NVIDIA/enroot) and [Pyxis](https://github.com/NVIDIA/pyxis)." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-hang-detection.html | Tier 1, first-party docs | definition | "It's off by default and you turn it on for each job with the `HYPERPOD_HANG_RULES` environment variable." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-observability-addon.html | Tier 1, first-party docs | definition | "The add-on collects health and performance metrics from NVIDIA DCGM, instance-level Kubernetes node exporters, Elastic Fabric Adapter, Kubernetes APIs, Kueue, and SageMaker HyperPod task operators." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment.html | Tier 1, first-party docs | definition | "Deploy models from multiple sources including open-weights and gated models from Amazon SageMaker JumpStart and custom models from Amazon S3 and Amazon FSx with support for both single-node and multi-node inference architectures." (accessed 2026-11-20)
- Use in dive: section 27, the surrounding tools, one line each. Inference on HyperPod serves cloud endpoints; the arm's policy runs on the robot (workload 12), so this is for a world-model or VLA served in the cloud during evaluation `[our reading]`.

**F10-331. UltraServers on HyperPod: P6e-GB200 UltraServers give NVLink connectivity across 18 GB200 instances, 72 B200 GPUs in total, on an EKS-based HyperPod cluster. HyperPod labels nodes with their UltraServer and Capacity Block, handles the IMEX configuration, and schedules by the `topology.k8s.aws/ultraserver-id` label.**
- Location: Developer Guide, "Using UltraServers in Amazon SageMaker HyperPod"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-ultraserver.html | Tier 1, first-party docs | documentation of support | "Built on NVIDIA GB200 and NVL72 architecture, these Ultraservers provide NVLink connectivity across 18 GB200 instances in a dual-rack configuration, totaling 72 B200 GPUs." (accessed 2026-11-20)
- Use in dive: section 27, one clause. Contrast with PCS, where the user writes the IMEX prolog (F10-237).

**F10-332. HyperPod in 2026, dated. Release-notes page: 25 January (AMI for EKS 1.34); 16 April (flexible instance groups); 11 November (dynamic ENI attachment); 16 November (cluster operations: every scaling or on-demand deep health check request is tracked, with `ListClusterOperations` and `DescribeClusterOperation`). What's New posts not on that page: 16 March (idle resource sharing in task governance); 27 April (G7e and r5d.16xlarge); 7 May (AMI-based node configuration for Slurm); 27 May (MinCount for Slurm); 1 June (EFA-only network interfaces); 13 July (custom AMIs for Slurm); 18 November (higher pod density).**
- Location: Developer Guide, "Amazon SageMaker HyperPod release notes"; What's New posts
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-notes.html | Tier 1, first-party docs | launch announcement | "## SageMaker HyperPod release notes: November 16, 2026" and "## SageMaker HyperPod release notes: April 16, 2026" and "## SageMaker HyperPod release notes: January 25, 2026" and "Each scaling and on-demand deep health check request creates a cluster operation that tracks the request until HyperPod finishes working on it" ; https://aws.amazon.com/about-aws/whats-new/2026/07/hyperpod-custom-ami-slurm/ | Tier 2, launch announcement | launch announcement | "Posted on: Jul 13, 2026 Amazon SageMaker HyperPod now supports custom AMIs for Slurm-orchestrated clusters" ; https://aws.amazon.com/about-aws/whats-new/2026/04/sagemaker-hyperpod-flexible-instance-groups/ | Tier 2, launch announcement | launch announcement | "Posted on: Apr 17, 2026" (accessed 2026-11-20)
- Use in dive: section 27, the "what changed in 2026" strip. The release-notes page now carries four 2026 headings; register 09 (F09-37) and wave 2 saw three (the 11 November note was absent). Inference-side 2026 posts (data capture 20 May, disaggregated prefill and decode 6 July, model caching 11 September) were seen in search results only and not fetched (U10-11).

**F10-333. [our reading] The HyperPod-on-EKS life of one arm job, assembled from documented parts: a `PyTorchJob` or `HyperPodPyTorchJob` is applied in namespace `hyperpod-ns-<team>` with the queue and priority labels (F10-321); Kueue admits it against the team's quota or by borrowing (F10-320, F10-322); pods go pending; Karpenter adds nodes from Spot instance groups first (F10-311, F10-312); nodes pass `Pending` to `Running` (F10-306); pods run; on a Spot notice HyperPod taints, evicts within `terminationGracePeriodSeconds`, replaces capacity and Kubernetes reschedules (F10-310); the job's auto-resume annotation or `runPolicy` restarts it (F10-316, F10-317) and the script reloads its checkpoint; when pods finish Karpenter consolidates and the groups return to zero (F10-312).**
- Location: synthesis of F10-306, F10-310, F10-311, F10-312, F10-316, F10-317, F10-320, F10-321, F10-322
- Verdict: NEW
- Evidence: F10-306, F10-310, F10-311, F10-312, F10-316, F10-317, F10-320, F10-321, F10-322 | synthesis; no single AWS page walks one job through all of these steps
- Use in dive: section 27, the animation script, each frame carrying its entry ID.

**F10-334. [our reading] What HyperPod does well and poorly for the arm. Well: a held, health-checked GPU pool with automatic node replacement and job resume; multi-team quotas with lending and preemption; training plans per instance group; one cluster for training and cloud inference. Poorly: the features that distinguish it (deep health checks of about two hours, checkpointless training, topology-aware scheduling, MIG, training plans) are built for P-class multi-GPU nodes and none is documented for G-family instances; Slurm orchestration has no autoscaler and no documented Spot; Karpenter excludes training-plan groups and deep-health-checked groups; a persistent cluster bills per provisioned instance whether or not jobs run (F09-33); `ml.` instance naming and the SageMaker quota system sit between the user and EC2.**
- Location: synthesis of F10-309, F10-312, F10-313, F10-318, F10-319, F10-323, F10-324, F10-325
- Verdict: NEW
- Evidence: F10-309, F10-312, F10-313, F10-318, F10-319, F10-323, F10-324, F10-325 | synthesis
- Use in dive: section 27, "what it does poorly", and the hand-offs in section 9 of this file.

**F10-340. A `PyTorchJob` replica spec must contain a container named `pytorch`. The Kubeflow Training Operator's validating webhook (release 1.8.1, one of the releases HyperPod job auto-resume requires, F10-316) rejects the object otherwise with "must have at least one container with name pytorch". The container name is not free to choose.**
- Location: kubeflow/training-operator at tag v1.8.1, `pkg/webhooks/pytorch/pytorchjob_webhook.go`
- Verdict: NEW (added from the round 2 AWS accuracy review, finding 1)
- Evidence: https://raw.githubusercontent.com/kubeflow/training-operator/v1.8.1/pkg/webhooks/pytorch/pytorchjob_webhook.go | Tier 1, project source code at tag v1.8.1 | definition | "// Make sure there has at least one container named \"pytorch\"" and "if !defaultContainerPresent { allErrs = append(allErrs, field.Required(containersPath, fmt.Sprintf(\"must have at least one container with name %s\", trainingoperator.PyTorchJobDefaultContainerName))) }" (accessed 2026-11-20)
- Use in dive: section 27, the PyTorchJob snippet: the container is named `pytorch`.

**F10-341. For a P6e-GB200 UltraServer Capacity Block the instances must be terminated by the user at least 60 minutes before the block's end time. For other Capacity Blocks EC2 begins terminating instances at 11:00 UTC on the final day, 30 minutes before the 11:30 UTC end (F09-90).**
- Location: Amazon EC2 User Guide, "Capacity Blocks for ML", UltraServer considerations
- Verdict: NEW (added from the round 2 AWS accuracy review, finding 6)
- Evidence: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | Tier 1, first-party docs | documentation of a limit | "For P6e-GB200 UltraServer Capacity Blocks, you must terminate your instances at least 60 minutes before the Capacity Block end time." (accessed 2026-11-20)
- Use in dive: section 26, the UltraServer paragraph of the reserved-capacity block.

**F10-342. When a compute node group is created with a custom launch template, each of the AMI and the security groups may come from the command or from the launch template; a value on the command wins. "If neither the command nor the launch template has an AMI or security groups, AWS PCS rejects the request." `--security-group-ids` cannot be given when the launch template defines network interfaces.**
- Location: AWS PCS User Guide, "Creating a compute node group in AWS PCS"
- Verdict: NEW (added from the round 2 AWS accuracy review, finding 9)
- Evidence: https://docs.aws.amazon.com/pcs/latest/userguide/working-with_cng_create.html | Tier 1, first-party docs | definition | "For each option that you omit, AWS PCS uses the value in the launch template." and "If neither the command nor the launch template has an AMI or security groups, AWS PCS rejects the request. You can't specify --security-group-ids if your launch template defines network interfaces." (accessed 2026-11-20)
- Use in dive: section 26, the sentence under the Spot compute node group command, which names neither.

**F10-343. g6e.12xlarge has 1 network card; p5.48xlarge has 32. A launch template interface with `NetworkCardIndex` 1 therefore fits a type such as p5.48xlarge and does not fit g6e.12xlarge `[our reading of the table against the template in F10-233]`.**
- Location: Amazon EC2 instance types guide, "Accelerated computing instances", table "Network specifications", column "Network cards"
- Verdict: NEW (added from the round 2 AWS accuracy review, finding 10)
- Evidence: https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | Tier 1, first-party docs | documentation of limits | table header "Instance type, Baseline / Burst bandwidth (Gbps), EFA, ENA, ENA Express, ENA queues per interface (Default/Maximum), Network cards, Max. network interfaces, IP addresses per interface, IPv6"; row "g6e.12xlarge 100 Gigabit, Yes, Yes, Yes, 32, 1, 10, 30, Yes"; row "p5.48xlarge 3200 Gigabit, Yes, Yes, Yes, 32, 32, 64, 50, Yes" (table cells joined with commas by us, accessed 2026-11-20)
- Use in dive: section 26, the note under the EFA launch template: keep the first interface only for the figure's g6e.12xlarge.

**F10-344. HyperPod describes its managed Karpenter as consolidating nodes that still run pods: "Karpenter regularly evaluates cluster for optimization opportunities, shifting workloads to eliminate underutilized nodes." The NodePool example on the HyperPod NodePool page prints `consolidationPolicy: WhenEmptyOrUnderutilized` with `consolidateAfter: 0s`. The four HyperPod autoscaling pages fetched on 2026-11-20 (overview, NodeClass, NodePool, `ClusterAutoScalingConfig`) contain no other `consolidationPolicy` value and no statement on whether `WhenEmpty` is accepted.**
- Location: SageMaker Developer Guide, "Autoscaling on SageMaker HyperPod EKS" and "Create a NodePool"
- Verdict: NEW (added from the round 2 AWS accuracy review, finding 8)
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-autoscaling.html | Tier 1, first-party docs | definition | "Automatic node consolidation - Karpenter regularly evaluates cluster for optimization opportunities, shifting workloads to eliminate underutilized nodes." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-autoscaling-nodepool.html | Tier 1, first-party docs | definition | "spec: disruption: budgets: - nodes: 90% consolidateAfter: 0s consolidationPolicy: WhenEmptyOrUnderutilized" (accessed 2026-11-20)
- Use in dive: section 27, the paragraph under the NodePool snippet: this policy can move a running pod, and section 28 uses `WhenEmpty` (F10-412).

**F10-345. The FSx for Lustre guide installs the Lustre client differently per Amazon Linux release: on Amazon Linux 2 with `sudo amazon-linux-extras install -y lustre`, on Amazon Linux 2023 with `sudo dnf install -y lustre-client`. The user data PCS prints for mounting FSx for Lustre (F10-231) uses the Amazon Linux 2 command.**
- Location: FSx for Lustre User Guide, "Installing the Lustre client", procedures "To install the Lustre client on Amazon Linux 2023" and "To install the Lustre client on Amazon Linux 2"
- Verdict: NEW (added from the round 2 AWS accuracy review, finding 11)
- Evidence: https://docs.aws.amazon.com/fsx/latest/LustreGuide/install-lustre-client.html | Tier 1, first-party docs | definition | under "To install the Lustre client on Amazon Linux 2023": "Download and install the Lustre client with the following command. sudo dnf install -y lustre-client" ; under "To install the Lustre client on Amazon Linux 2": "Download and install the Lustre client with the following command. sudo amazon-linux-extras install -y lustre" (accessed 2026-11-20)
- Use in dive: section 26, the paragraph under the Lustre user data snippet.

## 5. Configuration blocks

Every block below is verbatim from the page named above it, as fetched on 2026-11-20 in its markdown form. The same text is quoted, joined to one line, in the Evidence line of the entry it belongs to. `{{...}}`, `<...>` and upper-case names are the pages' own placeholders. Nothing was added, removed or reordered.

Block for F10-201: (verbatim from https://docs.aws.amazon.com/pcs/latest/APIReference/API_CreateCluster.html)

```
{
   "clientToken": "{{string}}",
   "clusterName": "{{string}}",
   "networking": { 
      "networkType": "{{string}}",
      "securityGroupIds": [ "{{string}}" ],
      "subnetIds": [ "{{string}}" ]
   },
   "scheduler": { 
      "type": "{{string}}",
      "version": "{{string}}"
   },
   "size": "{{string}}",
   "slurmConfiguration": { 
      "accounting": { 
         "defaultPurgeTimeInDays": {{number}},
         "mode": "{{string}}"
      },
      "cgroupCustomSettings": [ 
         { 
            "parameterName": "{{string}}",
            "parameterValue": "{{string}}"
         }
      ],
      "jobSubmitPlugins": [ 
         { 
            "name": "{{string}}",
            "scriptSource": { 
               "checksum": "{{string}}",
               "s3VersionId": "{{string}}",
               "scriptLocation": "{{string}}"
            },
            "type": "{{string}}"
         }
      ],
      "scaleDownIdleTimeInSeconds": {{number}},
      "slurmCustomSettings": [ 
         { 
            "parameterName": "{{string}}",
            "parameterValue": "{{string}}"
         }
      ],
      "slurmdbdCustomSettings": [ 
         { 
            "parameterName": "{{string}}",
            "parameterValue": "{{string}}"
         }
      ],
      "slurmRest": { 
         "mode": "{{string}}"
      }
   },
   "tags": { 
      "{{string}}" : "{{string}}" 
   }
}
```

Block for F10-206: (verbatim from https://docs.aws.amazon.com/pcs/latest/APIReference/API_CreateComputeNodeGroup.html)

```
{
   "amiId": "{{string}}",
   "clientToken": "{{string}}",
   "clusterIdentifier": "{{string}}",
   "computeNodeGroupName": "{{string}}",
   "customLaunchTemplate": { 
      "id": "{{string}}",
      "version": "{{string}}"
   },
   "iamInstanceProfileArn": "{{string}}",
   "instanceConfigs": [ 
      { 
         "instanceType": "{{string}}"
      }
   ],
   "launchTemplateMode": "{{string}}",
   "nodeLifecycleActions": { 
      "scriptCachingPolicy": "{{string}}",
      "stages": { 
         "nodeBootstrapped": [ 
            { 
               "arguments": [ "{{string}}" ],
               "executionPolicy": "{{string}}",
               "name": "{{string}}",
               "onError": "{{string}}",
               "scriptSource": { 
                  "checksum": "{{string}}",
                  "s3VersionId": "{{string}}",
                  "scriptLocation": "{{string}}"
               }
            }
         ],
         "nodeReady": [ 
            { 
               "arguments": [ "{{string}}" ],
               "executionPolicy": "{{string}}",
               "name": "{{string}}",
               "onError": "{{string}}",
               "scriptSource": { 
                  "checksum": "{{string}}",
                  "s3VersionId": "{{string}}",
                  "scriptLocation": "{{string}}"
               }
            }
         ]
      }
   },
   "purchaseOption": "{{string}}",
   "scalingConfiguration": { 
      "maxInstanceCount": {{number}},
      "minInstanceCount": {{number}}
   },
   "securityGroupIds": [ "{{string}}" ],
   "slurmConfiguration": { 
      "gresCustomSettings": [ 
         { 
            "{{string}}" : "{{string}}" 
         }
      ],
      "scaleDownIdleTimeInSeconds": {{number}},
      "slurmCustomSettings": [ 
         { 
            "parameterName": "{{string}}",
            "parameterValue": "{{string}}"
         }
      ]
   },
   "spotOptions": { 
      "allocationStrategy": "{{string}}"
   },
   "sshKeyName": "{{string}}",
   "subnetIds": [ "{{string}}" ],
   "tags": { 
      "{{string}}" : "{{string}}" 
   }
}
```

Block for F10-210: (verbatim from https://docs.aws.amazon.com/pcs/latest/userguide/working-with_cng_create.html)

```
aws pcs create-compute-node-group --region {{region}} \
    --cluster-identifier {{my-cluster}} \
    --compute-node-group-name {{my-node-group}} \
    --launch-template-mode MANAGED \
    --ami-id {{ami-ExampleID1}} \
    --subnet-ids {{subnet-ExampleID1}} \
    --security-group-ids {{sg-ExampleID1}} \
    --ssh-key-name {{my-key-pair}} \
    --iam-instance-profile-arn {{arn:InstanceProfile}} \
    --scaling-configuration minInstanceCount={{min-instances}},maxInstanceCount={{max-instances}} \
    --instance-configs instanceType={{t3.large}}
```

Block for F10-210: (verbatim from https://docs.aws.amazon.com/pcs/latest/userguide/working-with_cng_create.html)

```
aws pcs create-compute-node-group --region {{region}} \
    --cluster-identifier {{my-cluster}} \
    --compute-node-group-name {{my-node-group}} \
    --subnet-ids {{subnet-ExampleID1}} \
    --custom-launch-template id={{lt-ExampleID1}},version='{{launch-template-version}}' \
    --iam-instance-profile-arn {{arn:InstanceProfile}} \
    --scaling-configuration minInstanceCount={{min-instances}},maxInstanceCount={{max-instances}} \
    --instance-configs instanceType={{t3.large}}
```

Block for F10-214: (verbatim from https://docs.aws.amazon.com/pcs/latest/userguide/cng-node-lifecycle-actions-examples.html)

```
aws pcs create-compute-node-group --region {{region}} \
  --cluster-identifier {{my-cluster}} \
  --compute-node-group-name {{my-cng}} \
  --subnet-ids {{subnet-ExampleID1}} \
  --custom-launch-template id={{lt-ExampleID1}},version='{{1}}' \
  --iam-instance-profile-arn {{arn:InstanceProfile}} \
  --scaling-configuration minInstanceCount={{0}},maxInstanceCount={{10}} \
  --instance-configs instanceType={{t3.large}} \
  --node-lifecycle-actions '{
    "stages": {
      "nodeBootstrapped": [
        { "name": "Mount FSx Lustre", "scriptSource": { "scriptLocation": "s3://{{my-bucket}}/mount-fsx.sh" }, "arguments": ["fs-{{0abc123}}", "/scratch"], "executionPolicy": "EVERY_BOOT" },
        { "name": "Join Active Directory", "scriptSource": { "scriptLocation": "s3://{{my-bucket}}/configure-ad.sh" }, "arguments": ["ad.example.com", "EXAMPLE"], "executionPolicy": "FIRST_BOOT_ONLY" }
      ],
      "nodeReady": [
        { "name": "Configure CloudWatch logging", "scriptSource": { "scriptLocation": "s3://{{my-bucket}}/setup-cloudwatch.sh" }, "arguments": ["/aws/pcs/{{my-cluster}}"], "onError": "CONTINUE" }
      ]
    }
  }'
```

Block for F10-215: (verbatim from https://docs.aws.amazon.com/pcs/latest/userguide/working-with_queues_create.html)

```
aws pcs create-queue --region {{region-code}} \
    --queue-name {{my-queue}} \
    --cluster-identifier {{my-cluster}} \
    --compute-node-group-configurations \
    computeNodeGroupId={{compute-node-group-id}} \
    --slurm-configuration \
    'slurmCustomSettings=[{parameterName=Default,parameterValue=YES}]'
```

Block for F10-215: (verbatim from https://docs.aws.amazon.com/pcs/latest/APIReference/API_CreateQueue.html)

```
{
   "clientToken": "{{string}}",
   "clusterIdentifier": "{{string}}",
   "computeNodeGroupConfigurations": [ 
      { 
         "computeNodeGroupId": "{{string}}"
      }
   ],
   "queueName": "{{string}}",
   "slurmConfiguration": { 
      "slurmCustomSettings": [ 
         { 
            "parameterName": "{{string}}",
            "parameterValue": "{{string}}"
         }
      ]
   },
   "tags": { 
      "{{string}}" : "{{string}}" 
   }
}
```

Block for F10-218: (verbatim from https://docs.aws.amazon.com/pcs/latest/userguide/working-with_clusters_create.html)

```
aws pcs create-cluster --region {{region}} \
    --cluster-name {{my-cluster}} \
    --scheduler type=SLURM,version={{25.11}} \
    --size {{SMALL}} \
    --networking subnetIds={{subnet-ExampleId1}},securityGroupIds={{sg-ExampleId1}}
    --slurm-configuration scaleDownIdleTimeInSeconds=3600,accounting='{mode=STANDARD}',slurmCustomSettings='[{parameterName=SelectTypeParameters,parameterValue=CR_CPU_Memory}]'
```

Block for F10-218: (verbatim from https://docs.aws.amazon.com/pcs/latest/userguide/working-with_cng_create.html)

```
aws pcs create-compute-node-group --region {{region}} \
    --cluster-identifier {{my-cluster}} \
    --compute-node-group-name {{my-gpu-nodes}} \
    --launch-template-mode MANAGED \
    --ami-id {{ami-ExampleID1}} \
    --subnet-ids {{subnet-ExampleID1}} \
    --security-group-ids {{sg-ExampleID1}} \
    --iam-instance-profile-arn {{arn:InstanceProfile}} \
    --scaling-configuration minInstanceCount={{0}},maxInstanceCount={{10}} \
    --instance-configs instanceType={{p4d.24xlarge}} \
    --slurm-configuration scaleDownIdleTimeInSeconds={{300}}
```

Block for F10-219: (verbatim from https://docs.aws.amazon.com/pcs/latest/userguide/monitoring_scaling-logs.html)

```
{
    "resource_id": "pcs_abc123de45",
    "resource_type": "PCS_CLUSTER",
    "event_timestamp": 1789179816460,
    "compute_node_group_id": "pcs_abcdef01",
    "scheduler_node_id": "compute-1",
    "status_code": "LAUNCHED",
    "reason_code": "SCHEDULER_REQUESTED",
    "description": "Instance launched to satisfy a scheduler scale-up request.",
    "details": {
        "instance_id": "i-0abc12345def67890",
        "instance_type": "c6i.xlarge",
        "subnet_id": "subnet-0123456789abcdef0"
    }
}
```

Block for F10-223: (verbatim from https://docs.aws.amazon.com/pcs/latest/userguide/mig-configuration.html)

```
if [ -z "${CUDA_VISIBLE_DEVICES-}" ]; then
    scontrol requeue "$SLURM_JOB_ID"
    exit 1
fi
```

Block for F10-228: (verbatim from https://docs.aws.amazon.com/pcs/latest/userguide/getting-started_run-job.html)

```
cat << EOF > job.sh
#!/bin/bash
#SBATCH -J single
#SBATCH -o single.%j.out
#SBATCH -e single.%j.err

echo "This is job \${SLURM_JOB_NAME} [\${SLURM_JOB_ID}] running on \${SLURMD_NODENAME}, submitted from \${SLURM_SUBMIT_HOST}" && sleep 60 && echo "Job complete"
EOF
```

Block for F10-228: (verbatim from https://docs.aws.amazon.com/pcs/latest/userguide/getting-started_run-mpi-job.html)

```
cat > hello.sh << EOF
#!/bin/bash
#SBATCH -J multi
#SBATCH -o multi.out
#SBATCH -e multi.err
#SBATCH --exclusive
#SBATCH --nodes=4
#SBATCH --ntasks-per-node=1

srun $HOME/hello
EOF
```

Block for F10-231: (verbatim from https://docs.aws.amazon.com/pcs/latest/userguide/working-with_file-systems.html)

```
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="==MYBOUNDARY=="

--==MYBOUNDARY==
Content-Type: text/cloud-config; charset="us-ascii"

runcmd:
- amazon-linux-extras install -y lustre={{latest}}
- mkdir -p /{{mount-point-directory}}
- mount -t lustre {{filesystem-id}}.fsx.{{region-code}}.amazonaws.com@tcp:/{{mount-name}} /{{mount-point-directory}}

--==MYBOUNDARY==--
```

Block for F10-231: (verbatim from https://docs.aws.amazon.com/pcs/latest/userguide/working-with_file-systems.html)

```
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="==MYBOUNDARY=="

--==MYBOUNDARY==
Content-Type: text/cloud-config; charset="us-ascii"

packages:
  - amazon-efs-utils

runcmd:
  - mkdir -p /{{mount-point-directory}}
  - echo "{{filesystem-id}}:/ /{{mount-point-directory}} efs tls,_netdev" >> /etc/fstab
  - mount -a -t efs defaults

--==MYBOUNDARY==--
```

Block for F10-231: (verbatim from https://docs.aws.amazon.com/pcs/latest/userguide/working-with_file-systems.html)

```
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="==MYBOUNDARY=="

--==MYBOUNDARY==
Content-Type: text/cloud-config; charset="us-ascii"

runcmd:
- mkdir -p /{{mount-point-directory}}
- mount -t nfs -o noatime,nfsvers=4.2,sync,rsize=1048576,wsize=1048576 {{filesystem-id}}.fsx.{{region-code}}.amazonaws.com:/fsx/ /{{mount-point-directory}}

--==MYBOUNDARY==--
```

Block for F10-233: (verbatim from https://docs.aws.amazon.com/pcs/latest/userguide/working-with_networking_efa_create-lt.html)

```
{
    "Placement": {
        "GroupId": "pg-{{PlacementGroupId1}}"
    },
    "NetworkInterfaces": [
        {
            "DeviceIndex": 0,
            "InterfaceType": "efa",
            "NetworkCardIndex": 0,
            "SubnetId": "subnet-{{SubnetId1}}",
            "Groups": [
                "sg-{{SecurityGroupId1}}",
                "sg-{{EfaSecGroupId}}"
            ]
        },
        {
            "DeviceIndex": 1,
            "InterfaceType": "efa",
            "NetworkCardIndex": 1,
            "SubnetId": "subnet-{{SubnetId1}}"
            "Groups": ["sg-{{EfaSecGroupId}}"]
        }
    ]
}
```

Block for F10-234: (verbatim from https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks-faq.html)

```
$ sinfo  
PARTITION AVAIL TIMELIMIT NODES STATE NODELIST  
fanout up infinite 4 idle node-fanout-[1-4]
```

Block for F10-235: (verbatim from https://docs.aws.amazon.com/pcs/latest/userguide/capacity-reservations-odcr.html)

```
{
  "CapacityReservationSpecification": {
    "CapacityReservationResourceGroupArn": "arn:aws:resource-groups:us-east-2:123456789012:group/EXAMPLE-CR-GROUP"
  }
}
```

Block for F10-235: (verbatim from https://docs.aws.amazon.com/pcs/latest/userguide/capacity-reservations-iodcr.html)

```
{
  "CapacityReservationSpecification": {
    "CapacityReservationTarget": {
      "CapacityReservationId": "cr-1234567890abcdef1"
    }
  },
  "InstanceMarketOptions": {
    "MarketType": "interruptible-capacity-reservation"
  }
}
```

Block for F10-300: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-cli-command-create-cluster.html)

```
// create_cluster.json
{
    "ClusterName": {{"string"}},
    "InstanceGroups": [{
        "InstanceGroupName": {{"string"}},
        "InstanceType": {{"string"}},
        "InstanceCount": {{number}},
        "LifeCycleConfig": {
            "SourceS3Uri": {{"s3://amzn-s3-demo-bucket-sagemaker/lifecycle-script-directory/src/"}},
            "OnCreate": {{"on_create.sh"}}
        },
        "ExecutionRole": {{"string"}},
        "ThreadsPerCore": {{number}},
        "OnStartDeepHealthChecks": [
            {{"InstanceStress", "InstanceConnectivity"}}
        ]
    }],
    "RestrictedInstanceGroups": [ 
      { 
         "EnvironmentConfig": { 
            "FSxLustreConfig": { 
               "PerUnitStorageThroughput": {{number}},
               "SizeInGiB": {{number}}
            }
         },
         "ExecutionRole": {{"string"}},
         "InstanceCount": {{number}},
         "InstanceGroupName": {{"string"}},
         "InstanceStorageConfigs": [ 
            { ... }
         ],
         "InstanceType": {{"string"}},
         "OnStartDeepHealthChecks": [ {{"string"}} ],
         "OverrideVpcConfig": { 
            "SecurityGroupIds": [ {{"string"}} ],
            "Subnets": [ {{"string"}} ]
         },
         "ScheduledUpdateConfig": { 
            "DeploymentConfig": { 
               "AutoRollbackConfiguration": [ 
                  { 
                     "AlarmName": {{"string"}}
                  }
               ],
               "RollingUpdatePolicy": { 
                  "MaximumBatchSize": { 
                     "Type": {{"string"}},
                     "Value": {{number}}
                  },
                  "RollbackMaximumBatchSize": { 
                     "Type": {{"string"}},
                     "Value": {{number}}
                  }
               },
               "WaitIntervalInSeconds": {{number}}
            },
            "ScheduleExpression": {{"string"}}
         },
         "ThreadsPerCore": {{number}},
         "TrainingPlanArn": {{"string"}}
      }
   ],
    "VpcConfig": {
        "SecurityGroupIds": [{{"string"}}],
        "Subnets": [{{"string"}}]
    },
    "Tags": [{
        "Key": {{"string"}},
        "Value": {{"string"}}
    }],
    "Orchestrator": {
        "Eks": {
            "ClusterArn": {{"string"}},
            "KubernetesConfig": {
                "Labels": {
                    {{"nvidia.com/mig.config": "all-3g.40gb"}}
                }
            }
        }
    },
    "NodeRecovery": "Automatic"
}
```

Block for F10-301: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateCluster.html)

```
{
   "AutoScaling": { 
      "AutoScalerType": "{{string}}",
      "Mode": "{{string}}"
   },
   "ClusterName": "{{string}}",
   "ClusterRole": "{{string}}",
   "InstanceGroups": [ 
      { 
         "AutoPatchConfig": { 
            "DeploymentConfig": { 
               "AutoRollbackConfiguration": [ 
                  { 
                     "AlarmName": "{{string}}"
                  }
               ],
               "RollingUpdatePolicy": { 
                  "MaximumBatchSize": { 
                     "Type": "{{string}}",
                     "Value": {{number}}
                  },
                  "RollbackMaximumBatchSize": { 
                     "Type": "{{string}}",
                     "Value": {{number}}
                  }
               },
               "WaitIntervalInSeconds": {{number}}
            },
            "DrainPolicy": { 
               "DrainTimeoutInSeconds": {{number}},
               "OnDrainTimeout": "{{string}}"
            },
            "IdleWaitWindowInSeconds": {{number}},
            "PatchingStrategy": "{{string}}",
            "PatchSchedule": { 
               "NextPatchDate": {{number}}
            }
         },
         "CapacityRequirements": { 
            "OnDemand": { 
            },
            "Spot": { 
            }
         },
         "ExecutionRole": "{{string}}",
         "ImageId": "{{string}}",
         "ImageReleaseVersion": "{{string}}",
         "InstanceCount": {{number}},
         "InstanceGroupName": "{{string}}",
         "InstanceRequirements": { 
            "InstanceTypes": [ "{{string}}" ]
         },
         "InstanceStorageConfigs": [ 
            { ... }
         ],
         "InstanceType": "{{string}}",
         "KubernetesConfig": { 
            "Labels": { 
               "{{string}}" : "{{string}}" 
            },
            "Taints": [ 
               { 
                  "Effect": "{{string}}",
                  "Key": "{{string}}",
                  "Value": "{{string}}"
               }
            ]
         },
         "LifeCycleConfig": { 
            "OnCreate": "{{string}}",
            "OnInitComplete": "{{string}}",
            "SourceS3Uri": "{{string}}"
         },
         "MinInstanceCount": {{number}},
         "NetworkInterface": { 
            "InterfaceType": "{{string}}"
         },
         "OnStartDeepHealthChecks": [ "{{string}}" ],
         "OverrideVpcConfig": { 
            "SecurityGroupIds": [ "{{string}}" ],
            "Subnets": [ "{{string}}" ]
         },
         "ScheduledUpdateConfig": { 
            "DeploymentConfig": { 
               "AutoRollbackConfiguration": [ 
                  { 
                     "AlarmName": "{{string}}"
                  }
               ],
               "RollingUpdatePolicy": { 
                  "MaximumBatchSize": { 
                     "Type": "{{string}}",
                     "Value": {{number}}
                  },
                  "RollbackMaximumBatchSize": { 
                     "Type": "{{string}}",
                     "Value": {{number}}
                  }
               },
               "WaitIntervalInSeconds": {{number}}
            },
            "ScheduleExpression": "{{string}}"
         },
         "SlurmConfig": { 
            "NodeType": "{{string}}",
            "PartitionNames": [ "{{string}}" ]
         },
         "ThreadsPerCore": {{number}},
         "TrainingPlanArn": "{{string}}"
      }
   ],
   "NodeProvisioningMode": "{{string}}",
   "NodeRecovery": "{{string}}",
   "Orchestrator": { 
      "Eks": { 
         "ClusterArn": "{{string}}"
      },
      "Slurm": { 
         "AccountingDatabase": { 
            "Endpoint": "{{string}}",
            "Name": "{{string}}",
            "Port": {{number}},
            "SecretArn": "{{string}}"
         },
         "SlurmConfigStrategy": "{{string}}"
      }
   },
   "RestrictedInstanceGroups": [ 
      { 
         "EnvironmentConfig": { 
            "FSxLustreConfig": { 
               "PerUnitStorageThroughput": {{number}},
               "SizeInGiB": {{number}}
            }
         },
         "ExecutionRole": "{{string}}",
         "InstanceCount": {{number}},
         "InstanceGroupName": "{{string}}",
         "InstanceStorageConfigs": [ 
            { ... }
         ],
         "InstanceType": "{{string}}",
         "OnStartDeepHealthChecks": [ "{{string}}" ],
         "OverrideVpcConfig": { 
            "SecurityGroupIds": [ "{{string}}" ],
            "Subnets": [ "{{string}}" ]
         },
         "ScheduledUpdateConfig": { 
            "DeploymentConfig": { 
               "AutoRollbackConfiguration": [ 
                  { 
                     "AlarmName": "{{string}}"
                  }
               ],
               "RollingUpdatePolicy": { 
                  "MaximumBatchSize": { 
                     "Type": "{{string}}",
                     "Value": {{number}}
                  },
                  "RollbackMaximumBatchSize": { 
                     "Type": "{{string}}",
                     "Value": {{number}}
                  }
               },
               "WaitIntervalInSeconds": {{number}}
            },
            "ScheduleExpression": "{{string}}"
         },
         "ThreadsPerCore": {{number}},
         "TrainingPlanArn": "{{string}}"
      }
   ],
   "RestrictedInstanceGroupsConfig": { 
      "SharedEnvironmentConfig": { 
         "FSxLustreConfig": { 
            "PerUnitStorageThroughput": {{number}},
            "SizeInGiB": {{number}}
         },
         "FSxLustreDeletionPolicy": "{{string}}"
      }
   },
   "Tags": [ 
      { 
         "Key": "{{string}}",
         "Value": "{{string}}"
      }
   ],
   "TieredStorageConfig": { 
      "InstanceMemoryAllocationPercentage": {{number}},
      "Mode": "{{string}}"
   },
   "VpcConfig": { 
      "SecurityGroupIds": [ "{{string}}" ],
      "Subnets": [ "{{string}}" ]
   }
}
```

Block for F10-302: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/smcluster-getting-started-slurm-cli.html)

```
{
    "ClusterName": "my-hyperpod-cluster",
    "InstanceGroups": [
        {
            "InstanceGroupName": "my-controller-group",
            "InstanceType": "ml.c5.xlarge",
            "InstanceCount": 1,
            "SlurmConfig": {
                "NodeType": "Controller"
            },
            "ExecutionRole": "arn:aws:iam::{{111122223333}}:role/HyperPodExecutionRole",
            "InstanceStorageConfigs": [
                {
                    "EbsVolumeConfig": {
                        "VolumeSizeInGB": 500
                    }
                }
            ]
        },
        {
            "InstanceGroupName": "my-login-group",
            "InstanceType": "ml.m5.4xlarge",
            "InstanceCount": 1,
            "SlurmConfig": {
                "NodeType": "Login"
            },
            "ExecutionRole": "arn:aws:iam::{{111122223333}}:role/HyperPodExecutionRole"
        },
        {
            "InstanceGroupName": "worker-group-1",
            "InstanceType": "ml.trn1.32xlarge",
            "InstanceCount": 1,
            "SlurmConfig": {
                "NodeType": "Compute",
                "PartitionNames": ["partition-1"]
            },
            "ExecutionRole": "arn:aws:iam::{{111122223333}}:role/HyperPodExecutionRole",
            "InstanceStorageConfigs": [
                {
                    "FsxLustreConfig": {
                        "DnsName": "{{fs-0abc123def456789.fsx.us-west-2.amazonaws.com}}",
                        "MountPath": "/fsx",
                        "MountName": "{{abcdefgh}}"
                    }
                }
            ]
        }
    ],
    "Orchestrator": {
        "Slurm": {
            "SlurmConfigStrategy": "Managed"
        }
    },
    "VpcConfig": {
        "SecurityGroupIds": ["{{sg-0abc123def456789a}}"],
        "Subnets": ["{{subnet-0abc123def456789a}}"]
    }
}
```

Block for F10-302: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-ref.html)

```
// Save as provisioning_parameters.json.
{
    "version": "1.0.0",
    "workload_manager": "slurm",
    "controller_group": "{{string}}",
    "login_group": "{{string}}",
    "worker_groups": [
        {
            "instance_group_name": "{{string}}",
            "partition_name": "{{string}}"
        }
    ],
    "fsx_dns_name": "{{string}}",
    "fsx_mountname": "{{string}}"
}
```

Block for F10-308: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-scaling-eks.html)

```
aws sagemaker create-cluster \
--cluster-name $HP_CLUSTER_NAME \
--orchestrator 'Eks={ClusterArn='$EKS_CLUSTER_ARN'}' \
--vpc-config '{
   "SecurityGroupIds": ["'$SECURITY_GROUP'"],
   "Subnets": ["'$SUBNET_AZ1'", "'$SUBNET_AZ2'"]
}' \
--instance-groups '[{
   "InstanceGroupName": "flexible-ig",
   "InstanceRequirements": {
      "InstanceTypes": ["ml.p5.48xlarge", "ml.p4d.24xlarge", "ml.g6.48xlarge"]
   },
   "InstanceCount": 10,
   "LifeCycleConfig": {
      "SourceS3Uri": "s3://'$BUCKET_NAME'",
      "OnCreate": "on_create.sh"
   },
   "ExecutionRole": "'$EXECUTION_ROLE'"
}]' \
--node-provisioning-mode Continuous
```

Block for F10-309: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-spot.html)

```
Resources:
  TestCluster:
    Type: AWS::SageMaker::Cluster
    Properties:
      ClusterName: "SampleCluster"
      InstanceGroups:
        - InstanceGroupName: group1
          InstanceType: ml.c5.2xlarge
          InstanceCount: 1
          LifeCycleConfig:
            SourceS3Uri: "s3://'$BUCKET_NAME'"
            OnCreate: "on_create_noop.sh"
          ExecutionRole: "'$EXECUTION_ROLE'",
          ThreadsPerCore: 1
          CapacityRequirements:
            Spot: {}
      VpcConfig:
        Subnets:
          - "'$SUBNET1'"
        SecurityGroupIds:
          - "'$SECURITY_GROUP'"
      Orchestrator:
        Eks:
          ClusterArn:
            '$EKS_CLUSTER_ARN'
      NodeProvisioningMode: "Continuous"
      NodeRecovery: "Automatic"
```

Block for F10-311: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-spot.html)

```
apiVersion: karpenter.sagemaker.amazonaws.com/v1
kind: HyperpodNodeClass
metadata:
  name: multiazg6
spec:
  instanceGroups:
    # name of InstanceGroup in HyperPod cluster. InstanceGroup needs to pre-created
    # before this step can be completed.
    # MaxItems: 10
    - auto-spot-c5-2x-az1
    - auto-spot-c5-2x-az2
    - auto-spot-c5-x-az3
    - auto-ondemand-c5-2x-az1
```

Block for F10-311: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-spot.html)

```
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
 name: gpunodepool
spec:
 template:
   spec:
     nodeClassRef:
      group: karpenter.sagemaker.amazonaws.com
      kind: HyperpodNodeClass
      name: multiazg6
     expireAfter: Never
     requirements:
        - key: node.kubernetes.io/instance-type
          operator: Exists
        - key: "node.kubernetes.io/instance-type" // Optional otherwise Karpenter will decide based on Job config resource requirements
          operator: In
          values: ["ml.c5.2xlarge"]
        - key: "topology.kubernetes.io/zone"
          operator: In
          values: ["us-west-2a"]
```

Block for F10-311: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-spot.html)

```
aws sagemaker create-cluster \
    --cluster-name clusterNameHere \
    --orchestrator 'Eks={ClusterArn='$EKS_CLUSTER_ARN'}' \
    --node-provisioning-mode "Continuous" \
    --cluster-role 'arn:aws:iam::YOUR-ACCOUNT-ID:role/SageMakerHyperPodRole' \
    --instance-groups '[{
        "InstanceGroupName": "auto-spot-c5-2x-az1",
        "InstanceType": "ml.c5.2xlarge",
        "InstanceCount": 0, // For Auto scaling keep instance count as 0
        "CapacityRequirements: { "Spot": {} }
        "LifeCycleConfig": {
        "SourceS3Uri": "s3://'$BUCKET_NAME'",
        "OnCreate": "on_create_noop.sh"
        },
        "ExecutionRole": "'$EXECUTION_ROLE'",
        "ThreadsPerCore": 1,
        "OverrideVpcConfig": {
            "SecurityGroupIds": ["'$SECURITY_GROUP'"],
            "Subnets": ["'$SUBNET1'"]
         }
    }]' 
--vpc-config '{
    "SecurityGroupIds": ["'$SECURITY_GROUP'"],
    "Subnets": ["'$SUBNET'"] 
}'
--auto-scaling ' {
    "Mode": "Enable",
    "AutoScalerType": "Karpenter"
}'
```

Block for F10-312: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-autoscaling-nodepool.html)

```
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: <nodepool-name>
  uid: <resource-uid>
  ...
spec:
  disruption:
    budgets:
    - nodes: 90%
    consolidateAfter: 0s
    consolidationPolicy: WhenEmptyOrUnderutilized
  template:
    spec:
      expireAfter: 720h
      nodeClassRef:
        group: karpenter.sagemaker.amazonaws.com
        kind: HyperpodNodeClass
        name: <nodeclass-name>
      requirements:
      - key: node.kubernetes.io/instance-type
        operator: Exists
status:
  conditions:
  - lastTransitionTime: "<timestamp>"
    message: ""
    observedGeneration: 2
    reason: ValidationSucceeded
    status: "True"
    type: ValidationSucceeded
  - lastTransitionTime: "<timestamp>"
    message: ""
    observedGeneration: 2
    reason: NodeClassReady
    status: "True"
    type: NodeClassReady
  - lastTransitionTime: "<timestamp>"
    message: ""
    observedGeneration: 2
    reason: Ready
    status: "True"
    type: Ready
```

Block for F10-315: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html)

```
#!/bin/bash
#SBATCH --nodes 2
#SBATCH --exclusive
srun --auto-resume=1 {{train_auto_resume.sh}}
```

Block for F10-315: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html)

```
#!/bin/bash

# Filename: train_auto_resume.sh
# Sample containerized script to launch a training job with a single srun which can be auto-resumed.

# Place your training environment setup here. 
# Example: Install conda, docker, activate virtual env, etc.

# Get the list of nodes for a given job
NODE_LIST=$(scontrol show jobid=$SLURM_JOBID | \ # Show details of the SLURM job
            awk -F= '/NodeList=/{print $2}' | \  # Extract NodeList field
            grep -v Exc)                         # Exclude nodes marked as excluded

# Determine the master node from the node list
MASTER_NODE=$(scontrol show hostname $NODE_LIST | \ # Convert node list to hostnames
              head -n 1)                            # Select the first hostname as master node

# Get the master node address
MASTER_ADDR=$(scontrol show node=$MASTER_NODE | \ # Show node information
              awk -F= '/NodeAddr=/{print $2}' | \ # Extract NodeAddr
              awk '{print $1}')                   # Print the first part of NodeAddr


# Torchrun command to launch the training job
torchrun_cmd="torchrun --nnodes=$SLURM_NNODES \
                       --nproc_per_node=1 \
                       --node_rank=$SLURM_NODE \
                       --master-addr=$MASTER_ADDR \
                       --master_port={{1234}} \
                       {{<your_training_script.py>}}"

# Execute the torchrun command in the 'pytorch' Conda environment, 
# streaming output live
/opt/conda/bin/conda run --live-stream -n pytorch $torchrun_cmd
```

Block for F10-316: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-run-jobs-kubectl.html)

```
apiVersion: "kubeflow.org/v1"
kind: PyTorchJob 
metadata:
    name: pytorch-simple
    namespace: kubeflow
    annotations: { // config for job auto resume
      sagemaker.amazonaws.com/enable-job-auto-resume: "true"
      sagemaker.amazonaws.com/job-max-retry-count: "2"
    }
spec:
  pytorchReplicaSpecs:
  ......
  Worker:
      replicas: 10
      restartPolicy: OnFailure
      template:
          spec:
              nodeSelector:
                  sagemaker.amazonaws.com/node-health-status: Schedulable
```

Block for F10-317: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator-usage.html)

```
apiVersion: sagemaker.amazonaws.com/v1
kind: HyperPodPyTorchJob
metadata:
  labels:
    app.kubernetes.io/name: HyperPod
    app.kubernetes.io/managed-by: kustomize
  name: &jobname xxx
  annotations:
    XXX: XXX
    ......
spec:
  nprocPerNode: "X"
  replicaSpecs:
    - name: 'XXX'
      replicas: 16
      template:
        spec:
          nodeSelector:
            beta.kubernetes.io/instance-type: ml.p5.48xlarge
          containers:
            - name: XXX
              image: XXX
              imagePullPolicy: Always
              ports:
                - containerPort: 8080 # This is the port that HyperPodElasticAgent listens to
              resources:
                limits:
                  nvidia.com/gpu: 8
                  hugepages-2Mi: 5120Mi
                requests:
                  nvidia.com/gpu: 8
                  hugepages-2Mi: 5120Mi
                  memory: 32000Mi
          ......        
  runPolicy:
    jobMaxRetryCount: 50
    restartPolicy:
      numRestartBeforeFullJobRestart: 3 
      evalPeriodSeconds: 21600 
      maxFullJobRestarts: 1
    cleanPodPolicy: "All"
    logMonitoringConfiguration: 
      - name: "JobStart"
        logPattern: ".*Experiment configuration.*" # This is the start of the training script
        expectedStartCutOffInSeconds: 120 # Expected match in the first 2 minutes
      - name: "JobHangingDetection"
        logPattern: ".*\\[Epoch 0 Batch \\d+.*'training_loss_step': (\\d+(\\.\\d+)?).*"
        expectedRecurringFrequencyInSeconds: 300 # If next batch is not printed within 5 minute, consider it hangs. Or if loss is not decimal (e.g. nan) for 2 minutes, mark it hang as well.
        expectedStartCutOffInSeconds: 600 # Allow 10 minutes of job startup time
      - name: "NoS3CheckpointingDetection"
        logPattern: ".*The checkpoint is finalized. All shards is written.*"
        expectedRecurringFrequencyInSeconds: 600 # If next checkpoint s3 upload doesn't happen within 10 mins, mark it hang.
        expectedStartCutOffInSeconds: 1800 # Allow 30 minutes for first checkpoint upload
      - name: "LowThroughputDetection"
        logPattern: ".*\\[Epoch 0 Batch \\d+.*'samples\\/sec': (\\d+(\\.\\d+)?).*"
        metricThreshold: 80 # 80 samples/sec
        operator: "lteq"
        metricEvaluationDataPoints: 25 # if throughput lower than threshold for 25 datapoints, kill the job
```

Block for F10-319: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-elastic-training.html)

```
apiVersion: sagemaker.amazonaws.com/v1
kind: HyperPodPyTorchJob
metadata:
  name: elastic-training-job
spec:
  elasticPolicy:
    minReplicas: 1
    maxReplicas: 4
    # Increment amount of pods in fixed-size groups
    # Amount of pods will be equal to minReplicas + N * replicaIncrementStep
    replicaIncrementStep: 1           
    # ... or Provide an exact amount of pods that required for training
    replicaDiscreteValues: [2,4,8]     

    # How long traing operator wait job to save checkpoint and exit during
    # scaling events. Job will be force-stopped after this period of time
    gracefulShutdownTimeoutInSeconds: 600

    # When scaling event is detected:   
    # how long job controller waits before initiate scale-up.
    # Some delay can prevent from frequent scale-ups and scale-downs
    scalingTimeoutInSeconds: 60

    # In case of faults, specify how long elastic training should wait for
    # recovery, before triggering a scale-down
    faultyScaleDownTimeoutInSeconds: 30
  ...
  replicaSpecs:
    - name: pods
      replicas: 4           # Initial replica count
      maxReplicas: 8        # Max for this replica spec (should match elasticPolicy.maxReplicas)
      ...
```

Block for F10-320: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateClusterSchedulerConfig.html)

```
{
   "ClusterArn": "{{string}}",
   "Description": "{{string}}",
   "Name": "{{string}}",
   "SchedulerConfig": { 
      "FairShare": "{{string}}",
      "IdleResourceSharing": "{{string}}",
      "PriorityClasses": [ 
         { 
            "Name": "{{string}}",
            "Weight": {{number}}
         }
      ]
   },
   "Tags": [ 
      { 
         "Key": "{{string}}",
         "Value": "{{string}}"
      }
   ]
}
```

Block for F10-320: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateComputeQuota.html)

```
{
   "ActivationState": "{{string}}",
   "ClusterArn": "{{string}}",
   "ComputeQuotaConfig": { 
      "ComputeQuotaResources": [ 
         { 
            "AcceleratorPartition": { 
               "Count": {{number}},
               "Type": "{{string}}"
            },
            "Accelerators": {{number}},
            "Count": {{number}},
            "InstanceType": "{{string}}",
            "MemoryInGiB": {{number}},
            "VCpu": {{number}}
         }
      ],
      "PreemptTeamTasks": "{{string}}",
      "ResourceSharingConfig": { 
         "AbsoluteBorrowLimits": [ 
            { 
               "AcceleratorPartition": { 
                  "Count": {{number}},
                  "Type": "{{string}}"
               },
               "Accelerators": {{number}},
               "Count": {{number}},
               "InstanceType": "{{string}}",
               "MemoryInGiB": {{number}},
               "VCpu": {{number}}
            }
         ],
         "BorrowLimit": {{number}},
         "Strategy": "{{string}}"
      }
   },
   "ComputeQuotaTarget": { 
      "FairShareWeight": {{number}},
      "TeamName": "{{string}}"
   },
   "Description": "{{string}}",
   "Name": "{{string}}",
   "Tags": [ 
      { 
         "Key": "{{string}}",
         "Value": "{{string}}"
      }
   ]
}
```

Block for F10-321: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-cli.html)

```
metadata:
    name: {{job-name}}
    namespace: hyperpod-ns-{{team-name}}
    labels:
        kueue.x-k8s.io/queue-name: hyperpod-ns-{{team-name}}-localqueue
        kueue.x-k8s.io/priority-class: {{priority-class-name}}-priority
```

Block for F10-321: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-cli.html)

```
hyperpod start-job --job-name hyperpod-cli-test --job-kind kubeflow/PyTorchJob --image docker.io/kubeflowkatib/pytorch-mnist-cpu:v1beta1-bc09cfd --entry-script /opt/pytorch-mnist/mnist.py --pull-policy IfNotPresent --instance-type ml.g5.xlarge --node-count 1 --tasks-per-node 1 --results-dir ./result --priority training-priority
```

Block for F10-323: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-tasks-scheduling.html)

```
apiVersion: batch/v1
kind: Job
metadata:
  name: test-tas-job
  namespace: hyperpod-ns-{{team-name}}
  labels:
    kueue.x-k8s.io/queue-name: hyperpod-ns-{{team-name}}-localqueue
    kueue.x-k8s.io/priority-class: {{PRIORITY_CLASS}}-priority
spec:
  parallelism: 10
  completions: 10
  suspend: true
  template:
    metadata:
      labels:
        kueue.x-k8s.io/queue-name: hyperpod-ns-{{team-name}}-localqueue
      annotations:
        kueue.x-k8s.io/podset-required-topology: "topology.k8s.aws/network-node-layer-3"
        or
        kueue.x-k8s.io/podset-preferred-topology: "topology.k8s.aws/network-node-layer-3"
    spec:
      nodeSelector:
        topology.k8s.aws/network-node-layer-3: {{TOPOLOGY_LABEL_VALUE}}
      containers:
        - name: dummy-job
          image: gcr.io/k8s-staging-perf-tests/sleep:v0.1.0
          args: ["3600s"]
          resources:
            requests:
              cpu: "100"
      restartPolicy: Never
```

Block for F10-324: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-policies-compute-allocation-gpu-partitions.html)

```
aws sagemaker create-compute-quota \
  --name "fractional-gpu-quota" \
  --compute-quota-config '{
    "ComputeQuotaResources": [
      {
        "InstanceType": "ml.p4d.24xlarge",
        "AcceleratorPartition": {
            "Count": 4,
            "Type": "mig-1g.5gb"
        }
      }
    ],
    "ResourceSharingConfig": { 
      "Strategy": "LendAndBorrow", 
      "BorrowLimit": 100 
    }
  }'
```

Block for F10-325: (verbatim from https://docs.aws.amazon.com/sagemaker/latest/dg/use-training-plan-for-hyperpod-creation-using-api-cli-sdk.html)

```
# Create a cluster         
aws sagemaker create-cluster \
  --cluster-name {{cluster-name}} \
  --instance-groups '[ \
        { \
            "InstanceCount": {{1}},\
            "InstanceGroupName": "{{controller-nodes}}",\
            "InstanceType": "{{ml.t3.xlarge}}",\
            "LifeCycleConfig": {"SourceS3Uri": {{source_s3_uri}}, "OnCreate": "on_create.sh"},\
            "ExecutionRole": "arn:aws:iam::{{customer_account_id}}:role/{{execution_role}}",\
            "ThreadsPerCore": {{1}},\
        },\
        { \
            "InstanceCount": {{2}}, \
            "InstanceGroupName": "{{worker-nodes}}",\
            "InstanceType": "{{p4d.24xlarge}}",\
            "LifeCycleConfig": {"SourceS3Uri": {{source_s3_uri}}, "OnCreate": "on_create.sh"},\
            "ExecutionRole": "arn:aws:iam::{{customer_account_id}}}:role/{{execution_role}}}",\
            "ThreadsPerCore": {{1}},\
            "TrainingPlanArn": {{training_plan_arn}},\
        }]'
```

## 6. The cluster, drawn

Everything in this section is an arrangement of the entries in section 4 for the person drawing the cluster. Where a step is not written by AWS in one place it is marked `[our reading]`.

### 6.1 AWS PCS: objects and nesting

- Account and Region boundary. Inside it, one VPC; the cluster is tied to one subnet named at creation, and compute node groups may use other subnets of the same VPC (F10-232).
- Cluster (F10-201): a managed Slurm controller the user never logs into, drawn as a box with a size label Small, Medium or Large (F10-202: 32 instances and 256 jobs, 512 and 8,192, 2,048 and 16,384). It carries the Slurm version (F10-203), the cluster-wide Slurm settings (F10-224, default `scaleDownIdleTimeInSeconds` 600, F10-218) and optional accounting (F10-226). It reaches the user's VPC through an elastic network interface that PCS creates in that subnet (F10-232), and from outside through the Slurm REST API on port 6820 when enabled (F10-229).
- Queue (F10-215, F10-216): one Slurm partition. A queue points at one or more compute node groups. Draw it as a lane holding pending jobs.
- Compute node group (F10-206): the capacity definition. One purchase option per group (F10-207: `ONDEMAND`, `SPOT`, `CAPACITY_BLOCK`, `INTERRUPTIBLE_CAPACITY_RESERVATION`), a list of instance types, `minInstanceCount` and `maxInstanceCount` (F10-208), subnets, an AMI (F10-212), a launch template (F10-210), an instance profile (F10-211), optional node lifecycle actions (F10-214). Draw it as a row of node slots: filled slots are running EC2 instances, empty slots are Slurm nodes that exist by name and have no instance behind them.
- Node: one EC2 instance in the user's account, running `slurmd` and the PCS agent, with GPUs as GRES slots (F10-236) and one thread per core (F10-213).
- Login node: a static node group (minimum equals maximum) that is in no queue (F10-227).
- Shared storage: Amazon EFS, FSx for Lustre or FSx for OpenZFS, mounted by the launch template's user data (F10-231).
- Not in the drawing because PCS does not have it: a container runtime layer, a second scheduler, a per-team quota object. Slurm accounting and partition limits fill that role (F10-226, F10-216).

### 6.2 AWS PCS: lifecycle

1. Submit. A user on the login node runs `sbatch` against a queue (F10-228), or a client posts the job to the Slurm REST API (F10-229). A job submit plugin can accept, reject or rewrite the job at the controller (F10-230).
2. Queue. The job is pending in the partition (state PD). Priority, partition limits and accounting decide order (F10-216, F10-226).
3. Scale from zero. Slurm allocates the job to named nodes of a compute node group that have no instance yet; PCS launches the instances behind those names (F10-217). The scaling log prints `LAUNCHED` with reason `SCHEDULER_REQUESTED` (F10-219). How often PCS evaluates is described as a regular interval of unpublished length (U10-1).
4. Place. Each instance boots, runs the launch template user data and lifecycle actions, registers (`REGISTERED`), and becomes `ACTIVE` when `slurmd` accepts jobs (F10-219, F10-220). The job shows CF (configuring) until every node is up; a node that does not arrive within about 30 minutes is failed by Slurm's resume timeout (F10-221). AWS publishes no nominal cold-start time (U10-3).
5. Run. Job state R. Processes run directly on the AMI. Multi-node jobs use EFA and a placement group when the launch template sets them (F10-233).
6. Spot notice `[our reading]`. PCS documents what happens when an instance disappears (the node is released and replaced, scaling log `EXTERNALLY_TERMINATED`, F10-219, F10-222) and documents a 2-minute notice for interruptible capacity reservations (F10-222). It does not document whether a Spot notice drains the node or signals the job (U10-4). Draw the node vanishing and the job leaving it; do not draw a drain step.
7. Checkpoint and requeue. The Capacity Block FAQ says active jobs are requeued by default when the block ends (F10-222); `--requeue`, `--requeue=expedite` and `requeue_delay` are the documented controls (F10-223). The job must reload its own checkpoint from shared storage. The Spot sequence as a whole is F10-244 `[our reading]`.
8. Scale down. A node idle for `scaleDownIdleTimeInSeconds` (default 600, overridable per group, F10-218) is powered down by Slurm and its instance terminated: `TERMINATED`, reason `SCHEDULER_REQUESTED` (F10-219). A group with minimum 0 returns to zero instances; the controller stays, and the hourly controller fee is a price dimension of its own (F10-240).

### 6.3 SageMaker HyperPod with Slurm: objects and nesting

- VPC, one Availability Zone by default (F10-327).
- HyperPod cluster (F10-300, F10-301) with `Orchestrator.Slurm` and a `SlurmConfigStrategy` (F10-302).
- Instance groups, each a set of identical `ml.` instances (F10-304) with a Slurm role: exactly one `Controller` group (an instance the user sizes and pays for), an optional `Login` group, and `Compute` groups, each mapped to one partition (F10-302).
- Per group: lifecycle configuration (F10-303), `InstanceStorageConfigs` with FSx for Lustre or FSx for OpenZFS (F10-326), optional `TrainingPlanArn` (F10-325), optional deep health checks (F10-318), `MinInstanceCount` (F10-307).
- Cluster-level: `NodeRecovery` (F10-314), `NodeProvisioningMode` (F10-306).
- Not in the drawing: an autoscaler and a Spot group. Neither is documented for Slurm orchestration (F10-313, F10-309, U10-8).

### 6.4 SageMaker HyperPod with Slurm: lifecycle

1. Submit. `sbatch` from the login or controller node; the training step is launched with `srun --auto-resume=1` inside an exclusive allocation (F10-315). Containers run through Enroot and Pyxis (F10-330).
2. Queue. Standard Slurm partition queue.
3. Scale from zero. Does not exist. The pool is whatever `InstanceCount` says; growing it is an `UpdateCluster` call (F10-313), provisioned continuously with partial capacity usable (F10-306).
4. Place. Slurm places the job on idle nodes of the partition. A new or replaced node that has deep health checks enabled sits in a Slurm maintenance reservation for about 45 to 90 minutes first (F10-318).
5. Run.
6. Spot notice. Not applicable: no Spot documentation for Slurm orchestration (U10-8). The equivalent event is a hardware fault found by the health monitoring agent (F10-314).
7. Checkpoint and requeue. With `--auto-resume=1` the faulty node is replaced (never rebooted) and the step restarts; on GRES-enabled nodes the job is requeued and starts from the beginning. The script reloads its checkpoint (F10-315).
8. Scale down. Manual: `UpdateCluster` to a lower count or `BatchDeleteClusterNodes` (F10-313). Billing stops when the instance enters a terminating state (F10-306).

### 6.5 SageMaker HyperPod with Amazon EKS: objects and nesting

- An Amazon EKS cluster: the control plane, outside the HyperPod cluster, mapped 1-to-1 to it (F10-300). On it: the HyperPod Helm chart (health monitoring agent, device plug-ins, Kubeflow Training Operator, MPI operator, F10-329) and the optional add-ons: task governance with Kueue (F10-320), the training operator (F10-317), observability (F10-330).
- HyperPod cluster: the worker nodes. Instance groups (F10-301), each one instance type or a flexible list of up to 20 (F10-308), each On-Demand or Spot for life (F10-309), optionally on a training plan (F10-325). Restricted instance groups are a separate kind, not used here (F10-305).
- Autoscaling layer (optional): `AutoScaling` with `AutoScalerType` `Karpenter`; one or more `HyperpodNodeClass` objects, each listing up to 10 instance groups, and Karpenter `NodePool` objects that reference them (F10-311, F10-312).
- Governance layer (optional): one cluster policy with priority classes; one compute allocation per team, which creates namespace `hyperpod-ns-<team>` and a Kueue LocalQueue `hyperpod-ns-<team>-localqueue` (F10-320, F10-321).
- Node: one `ml.` instance, labelled with its health status (F10-316) and, on supported types, its network topology layers (F10-323). Pods per node are capped by the ENI formula (F10-328).
- Job objects: `PyTorchJob` (Kubeflow) or `HyperPodPyTorchJob` (F10-316, F10-317).

### 6.6 SageMaker HyperPod with Amazon EKS: lifecycle

The whole sequence is F10-333 `[our reading]`; each step is documented separately.

1. Submit. `kubectl apply` of a `PyTorchJob` or `HyperPodPyTorchJob` in the team namespace, or `hyperpod start-job`, with the queue-name and priority-class labels (F10-321, F10-330).
2. Queue. Kueue holds the workload in the team's LocalQueue and admits it against the team's quota, or by borrowing idle or unallocated capacity up to the borrow limit (F10-320, F10-322). With gang scheduling, a workload whose pods are not all ready within the timeout is evicted and requeued (F10-322).
3. Scale from zero. Admitted pods are pending. Karpenter picks an instance group from the NodeClass, Spot groups first, ordered by Spot placement score per Availability Zone, and raises its count from 0 (F10-311, F10-312).
4. Place. The node goes `Pending` then `Running` (F10-306) and the pod is scheduled on it; a node selector keeps pods on nodes labelled `Schedulable` (F10-316). Topology annotations apply on P-class and UltraServer nodes (F10-323).
5. Run. Billing for the instance started when its lifecycle script began (F10-306).
6. Spot notice. HyperPod detects the signal, taints the node, evicts pods within their `terminationGracePeriodSeconds`, and provisions replacement capacity, falling back through the NodeClass to On-Demand (F10-310). The notice is best effort.
7. Checkpoint and requeue. The pod's SIGTERM handler writes a checkpoint `[our reading]`. Kubernetes reschedules the evicted pods (F10-310); the job auto-resume annotations or the operator's `runPolicy` restart the job up to the retry count (F10-316, F10-317).
8. Scale down. When pods finish, Karpenter consolidates after `consolidateAfter` and the instance groups return to zero; no node is kept for the Karpenter controller (F10-311, F10-312). The EKS control plane remains.

## 7. Recommended configuration [our reading]

Each setting below is our selection, tied to the entry that documents the setting. Where AWS itself recommends something, its words are quoted from the entry's evidence.

### 7.1 AWS PCS, for the arm's cloud workloads

- One cluster, size Small unless more than 32 instances or 256 jobs are expected at once (F10-202). Slurm 26.05 or 25.11, not 25.05, which reaches end of life on 11/30/2026 (F10-203).
- One queue per workload class, each backed by its own compute node groups, because a group has exactly one purchase option and its instance types must match in vCPU and GPU count (F10-206, F10-207): a CPU Spot queue (decode, curation, CPU physics), a G-family Spot queue (GPU-parallel physics, simulated cameras, single-node fine-tunes), an On-Demand or Capacity Block queue for long multi-GPU training (F10-234).
- Spot groups: `minInstanceCount` 0, several instance types of the same shape, allocation strategy left at the default `price-capacity-optimized` (F10-209). The default cap of 10 node groups per cluster limits how finely Spot can be diversified (F10-239).
- `scaleDownIdleTimeInSeconds`: keep the default 600 on Spot simulation groups and raise it on a GPU group whose next job usually follows within minutes, using the per-group override (F10-218). The threshold logic: a value shorter than the gap between consecutive jobs causes a relaunch per job, and the launch-to-`ACTIVE` time is unpublished (U10-3), so measure it from the scaling logs (F10-219) before lowering the value.
- Jobs on Spot groups: submit with `--requeue` and write checkpoints to shared storage (F10-223, F10-231). Treat requeue on a Spot reclaim as expected and unconfirmed (U10-4).
- AMI: the PCS-ready Deep Learning AMI for GPU groups (F10-212). Shared storage mounted in the launch template user data (F10-231). EFA and a cluster placement group only for the multi-node group (F10-233).
- Turn on accounting (F10-226) and scaling logs (F10-219): they are the only first-party way to see why a node did not arrive.
- AWS guidance quoted in entries: the Capacity Block FAQ's "By default, active jobs are automatically re-queued" (F10-222). No PCS page read today prints a recommended Spot configuration (U10-4).

### 7.2 SageMaker HyperPod

- Orchestrator: EKS when the team wants Spot, scale to zero or per-team quotas, because all three are documented only there (F10-309, F10-312, F10-320). Slurm when the team wants a held GPU pool with Slurm commands and accepts manual scaling (F10-313). For new Slurm clusters AWS says of the API-driven topology: "This is the recommended approach for new clusters." (F10-302).
- Provisioning: continuous, which is the default (F10-306); `MinInstanceCount` on a multi-node training group (F10-307).
- Node recovery: `Automatic`. AWS: "We recommend setting the `Automatic` option." (F10-314).
- Deep health checks: on for a held P-class training group, off for Karpenter-scaled groups (not supported there, F10-312) and for small clusters with no spare nodes, where AWS says: "**Recommendation**: disable the deep health check config throughout the cluster life cycle." (F10-318).
- Spot simulation and fine-tune capacity: one Spot instance group per Availability Zone with `InstanceCount` 0, one On-Demand group as fallback, all in one `HyperpodNodeClass` (at most 10 groups), one NodePool (F10-311). `consolidateAfter` above zero. AWS: "Set it to non zero upto 2 min to allow graceful pod eviction for any checkpointing needs." (F10-311). Our value: 60s to 120s, with the pod's `terminationGracePeriodSeconds` below 120 because the Spot notice is at most 2 minutes and best effort (F10-310).
- Jobs: `HyperPodPyTorchJob` with `jobMaxRetryCount` and a hang rule, or a Kubeflow `PyTorchJob` with the two auto-resume annotations and `restartPolicy: OnFailure` (F10-316, F10-317). Check the training operator's Kubernetes range (to 1.33) against the cluster version (F10-317, F10-329).
- Governance: one compute allocation per team; borrow limit left at the default 50 until measured contention says otherwise; preemption default `LowerPriority`; at most 10 priority classes (F10-320). Label every job with its LocalQueue and priority class (F10-321).
- Reserved capacity: a training plan on the P-class training group only, never on the primary group. AWS: "we do not recommend using a training plan for the primary instance group of a cluster" (F10-325). A training-plan group cannot be in a Karpenter NodeClass (F10-325).
- Do not combine: elastic training with Spot; checkpointless training with tiered checkpointing or elastic training (F10-319); MIG with flexible instance groups (F10-308).

## 8. Workload fit

All cells are `[our reading]`, argued from the entries named. The workload names are the ones in `src/sections/Workloads.tsx`; the number in brackets is the workload number in the research brief. "HyperPod" means EKS orchestration unless the cell says Slurm.

| # | Workload | AWS PCS | SageMaker HyperPod | Why (entries) |
|---|---|---|---|---|
| 1 | Record and encode (teleoperation recording, edge) | does not fit | does not fit | Runs at the edge, on the operator's machine next to the robot. Neither service places work outside a Region. |
| 2 | Dataloader decode and augment (video decode into the dataloader) | suits | suits | It is part of the training job and runs on the training node's CPUs. On PCS one thread per core is fixed (F10-213); on HyperPod `ThreadsPerCore` is chosen (F10-301). |
| 3 | Decode and filter, Embed and deduplicate (curation: filter, caption, embed) | suits | possible | Array jobs on CPU and G-family Spot groups that scale to zero (F10-208, F10-217). On HyperPod it works as pods on Karpenter-scaled Spot groups (F10-311), but a persistent ML cluster is heavy for a batch pipeline; Batch (section 25) is the hand-off. |
| 4 | Image augmentation (inside the dataloader) | suits | suits | Same node as training; no scheduler feature involved. |
| 5 | CPU physics step | suits | possible | Thousands of short CPU jobs fit Slurm arrays and Graviton or x86 Spot groups (F10-207). HyperPod accepts `ml.c8g` and `ml.m8g` groups (F10-304) and gains pod density from dynamic ENI attachment (F10-328), but none of its distinguishing features apply to CPU work (F10-334). |
| 6 | GPU-parallel physics | suits | possible | Single-GPU G-family jobs on Spot with requeue (F10-223). On HyperPod: Spot G groups through Karpenter (F10-311); no fractional GPU on G types (F10-324). |
| 7 | Simulated cameras | suits | possible | Same shape as 6; needs a G-family type with ray-tracing cores, which both accept (F10-304 for HyperPod; PCS takes EC2 types directly, F10-206). |
| 8 | Policy fine-tune (ACT, SmolVLA) | suits | possible | One G-family GPU for hours. PCS: Spot group, `--requeue`, checkpoint to shared storage (F10-223). HyperPod: works with auto-resume (F10-316), but its health-check, topology and reservation features target P-class nodes (F10-334), and training plans exclude G types (register 09, F09-35). |
| 9 | World-model training (JEPA class, small model) | suits | suits | Single node to a few nodes. Either service; HyperPod adds automatic node replacement and job resume (F10-314, F10-317). |
| 10 | Closed-loop evaluation | suits | possible | Many independent simulation rollouts: array jobs on Spot (F10-217). On HyperPod as low-priority tasks that borrow idle quota and are preempted first (F10-322). |
| 11 | Engine build (export and quantise for the device) | possible | possible | One short GPU job. The engine must be built for the device's own GPU, so the cloud step is export and calibration only; either scheduler runs it, neither adds anything. |
| 12 | On-robot inference (edge) | does not fit | does not fit | Runs on the robot's computer. HyperPod inference (F10-330) serves cloud endpoints, which is a different workload. |
| 13 | Generative augmentation (with a world model) | possible | suits | Batch inference on large GPUs. HyperPod can host the model and share GPUs with training under one quota system (F10-320, F10-330). On PCS it is an ordinary GPU batch job on On-Demand or a Capacity Block (F10-234). |
| 14 | Robot foundation-model pretraining on one node (VLA post-training) | suits | suits | One 8-GPU P-class node for days. PCS: Capacity Block node group (F10-234). HyperPod: training plan on the instance group, deep health checks, auto-resume (F10-325, F10-318, F10-316). |
| 15 | Robot foundation-model pretraining and World-model pretraining (multi-node) | suits | suits | PCS: EFA, placement group, hardware topology, UltraServers with a user-written IMEX prolog (F10-233, F10-236, F10-237). HyperPod: the workload it was built for: topology-aware scheduling, `MultiNodeTrainingValidation`, checkpointless or tiered checkpointing, UltraServer handling (F10-318, F10-319, F10-323, F10-331). |

Notes on the mapping: `Workloads.tsx` lists curation as two rows ("Decode and filter", "Embed and deduplicate") and pretraining as two rows ("Robot foundation-model pretraining", "World-model pretraining"); the brief's fifteen merge and split them differently, so rows 3 and 15 carry both names. The brief's workload 4 (image augmentation) is inside the "Dataloader decode and augment" row of the file.

## 9. What it does poorly, and hand-offs

### 9.1 AWS PCS

- Spot handling is undocumented at the job level: no page read today says a Spot notice drains the node, signals the job or requeues it (U10-4, F10-222, F10-244). A team that needs a documented Spot sequence gets one from HyperPod on EKS (F10-310) or from EKS with Karpenter (section 28).
- Coarse Spot diversification: one purchase option per node group, instance types in a group must match in vCPU and GPU count, default cap of 10 node groups per cluster (F10-206, F10-207, F10-239).
- No documented container path: jobs are processes on an AMI (F10-245). Container-first teams hand off to Batch (section 25) or EKS (section 28).
- No published cold-start figure; the documented bound is Slurm's resume timeout of about 30 minutes (F10-221, U10-3).
- The controller has its own hourly fee, separate from the nodes (F10-240), so a cluster with zero nodes still has a standing cost `[our reading]`. For a pipeline that runs a few hours a week, Batch (section 25) has no standing controller.
- No per-team quota object beyond Slurm accounting and partition limits (F10-226). Lending and borrowing between teams is HyperPod task governance (F10-320) or Kueue on EKS.
- Hand-off summary: to Batch for container array jobs without a cluster; to HyperPod for a held, health-checked GPU pool with automatic job resume; to EKS for services, operators and fractional GPUs.

### 9.2 SageMaker HyperPod

- Slurm orchestration has no autoscaler and no documented Spot (F10-313, U10-8), and the controller is an instance group the user pays for (F10-302). A team that wants Slurm that scales to zero hands off to PCS (F10-208).
- Its distinguishing features are P-class features: deep health checks that take about two hours, checkpointless training verified on ml.p5, topology-aware scheduling on P, Trainium and UltraServer types, MIG on P types, training plans with no G type (F10-318, F10-319, F10-323, F10-324; register 09, F09-35). For a G-family simulation fleet HyperPod is a managed node pool with Karpenter and little else (F10-334).
- Features exclude each other: Karpenter with deep health checks or training plans (F10-312); elastic training with Spot; checkpointless with tiered checkpointing and elastic training (F10-319); MIG with flexible instance groups (F10-308).
- Documentation lag: the NodeClass page says "Only on-demand capacity is supported at this time" while the Spot page documents Spot with Karpenter (F10-312, U10-9). The Spot page's CLI examples are printed with a missing quote (F10-309).
- Version skew: the training operator supports Kubernetes 1.28 to 1.33 while HyperPod supports 1.30 to 1.35 (F10-317, F10-329).
- IP consumption on EKS: 81 addresses per P5 instance (F10-327), eased by EFA-only interfaces.
- A persistent cluster bills per provisioned instance whether or not jobs run (register 09, F09-33); scale to zero exists only on EKS with Karpenter (F10-312).
- Hand-off summary: to PCS for elastic Slurm; to Batch for stateless array work; to plain EKS for EC2-native instance names, fractional GPU schedulers and anything not `ml.`-prefixed.

## 10. Contradicts or sharpens the first version

| F09 ID | What register 09 says | What today's page says |
|---|---|---|
| F09-22 (HyperPod has two orchestrators) | Slurm clusters have head, login and worker nodes; EKS maps 1-to-1. | Holds. Sharpened by F10-300 and F10-302: the roles are instance groups with `SlurmConfig.NodeType` `Controller`, `Login`, `Compute`; exactly one controller group; `SlurmConfigStrategy` `Managed`, `Overwrite`, `Merge`. |
| F09-23 (deep health checks, EKS) | Three test types on EKS. | Holds. Sharpened by F10-318: Slurm has two types; DCGM level 4 takes about 45 to 90 minutes, EFA about 2 to 5 minutes; AWS's planning figure is "about a couple of hours". |
| F09-24 (automatic node recovery) | `Automatic` recommended. | Holds (F10-314). Added: it is the default. |
| F09-25 (task governance is Kueue, add-on v1.6.1-eksbuild.1 installs v0.19.2) | As stated. | Holds (F10-320). |
| F09-26 (governance policies) | Lending, fair share, borrow up to 10,000%. | Holds. Sharpened by F10-320 and F10-322: API defaults are borrow limit 50, preemption `LowerPriority`, at most 10 priority classes, 15 quota resources per team; unallocated sharing dated 16 March 2026. |
| F09-27 (managed Karpenter) | Scale to zero; three prerequisites. | Holds. Sharpened by F10-312: instance groups with deep health checks, training plans or reserved capacity are excluded; at most 10 groups per NodeClass. Contradiction inside AWS's docs: the NodeClass page says only On-Demand capacity is supported, the Spot page documents Spot with Karpenter (U10-9). |
| F09-28 (Spot on EKS-orchestrated HyperPod) | Taint, evict, replace; On-Demand fallback. | Holds. Sharpened by F10-309 to F10-311: five numbered steps; `CapacityRequirements` is immutable; Karpenter prefers Spot groups and sorts by Spot placement score; `consolidateAfter` tip of up to 2 minutes. |
| F09-29 (flexible instance groups) | Up to 20 types in priority order; EKS only. | Sharpened by F10-308: lowest-priority type terminated first on scale-down; needs continuous provisioning; Karpenter ignores the list order; MIG not supported. The "EKS only" clause was not re-verified today: the flexible-group text read today is on the EKS continuous-provisioning page. |
| F09-30 to F09-32 (checkpointless, tiered checkpointing, elastic training) | As stated, including no Spot with elastic training. | Hold (F10-319). |
| F09-33 (billing per provisioned instance) | As stated, with a monetary example. | Not re-fetched today. F10-306 adds when billing starts and stops. |
| F09-34, F09-35 (training plans; no G types) | As stated. | The eligible-type list was not re-fetched today. F10-325 adds the attachment (`TrainingPlanArn` per instance group), the advice against the primary group, and the Karpenter exclusion. |
| F09-36 (single Availability Zone, 32 and 81 addresses) | Single AZ by default. | Holds (F10-327). Added: multi-AZ deployment is documented; EFA-only interfaces since 1 June 2026. |
| F09-37 (HyperPod news September to November 2026) | The only release note in that window is 16 November 2026. | Contradicted. The release-notes page fetched today also carries a heading dated 11 November 2026 (dynamic ENI attachment), and a What's New post dated 18 November 2026 (higher pod density) (F10-328, F10-332). |
| F09-109 (PCS and UltraServers) | Supported since 18 June 2026 through Capacity Blocks and a launch template. | Holds. Sharpened by F10-237 (mechanism) and by F10-200 to F10-245, which give PCS the depth register 09 lacked. Register 09's phrase "the managed route for a team that schedules with Slurm and does not want HyperPod" stands, with the limits in section 9.1. |

## 11. UNKNOWN register

| ID | What is unknown | What was checked | Entries affected |
|---|---|---|---|
| U10-1 | The length of the "regular interval" at which PCS evaluates scaling. | PCS User Guide scaling pages. | F10-217 |
| U10-2 | Why the API default for `scaleDownIdleTimeInSeconds` is 600 while a Slurm 23.11 release note says SuspendTime defaults to 60. | API Reference and release-notes page; both quoted. | F10-218 |
| U10-3 | A nominal cold-start time for a PCS node (launch to `ACTIVE`). | User Guide, FAQ, What's New. Only the resume timeout is printed. | F10-221 |
| U10-4 | What PCS does on an EC2 Spot interruption notice: drain, signal to the job, requeue. | All 214 User Guide pages searched for Spot interruption handling; the Capacity Block FAQ and interruptible-reservation page describe adjacent cases only. | F10-222, F10-244 |
| U10-5 | An AWS-published PCS `sbatch` example with `--array`, `--requeue`, a checkpoint signal handler or a GPU request line. | User Guide getting-started and MIG pages. | F10-228, F10-236 |
| U10-6 | Why the PCS create-cluster page says "AWS PCS currently supports Slurm 25.11 and 25.05" while the versions table lists 26.05. | Both pages fetched today; the table is taken as current. | F10-203 |
| U10-7 | A first-party statement of when to choose PCS over AWS ParallelCluster. | PCS FAQ and User Guide. | F10-243 |
| U10-8 | Whether HyperPod Slurm orchestration supports Spot Instances or any autoscaling. | 61 downloaded HyperPod pages with "slurm" in the file name searched for "spot" and "autoscal": no match. | F10-309, F10-313 |
| U10-9 | Which of two AWS pages is current on Karpenter and Spot. | NodeClass page ("Only on-demand capacity is supported at this time") against the Spot page (Spot groups in a NodeClass). The Spot page is the more specific and is followed. | F10-311, F10-312 |
| U10-10 | Amazon EFS as HyperPod shared storage. | Slurm getting-started page and EKS storage page name FSx for Lustre, FSx for OpenZFS, Mountpoint for Amazon S3 and EBS. | F10-326 |
| U10-11 | Three HyperPod inference posts of 2026 (20 May, 6 July, 11 September) seen in search results. | Not fetched; not used as evidence. | F10-332 |
| U10-12 | Commit pins for the HyperPod CLI and Helm chart repositories. | Not opened today. | F10-329, F10-330 |
| U10-13 | The Karpenter version HyperPod runs, and the launch date of HyperPod Spot support. | Autoscaling and Spot pages; no version or date printed. | F10-309, F10-312 |
| U10-14 | Time from a pending pod to a `Running` HyperPod node under Karpenter. | Autoscaling pages; the only durations printed are the console set-up ("around 20 minutes") and deep health checks. | F10-312, F10-333 |
| U10-15 | Whether flexible instance groups are available under Slurm orchestration. | Flexible-group text was read on the EKS continuous-provisioning page only. | F10-308 |

## 12. Source list by tier

All accessed 2026-11-20. The entry IDs that cite each source follow it in brackets. Tier 0 (our own experiments): none in this register. Tier 3 and Tier 4: none cited.

### Tier 1, first-party documentation: AWS PCS User Guide

- https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks-configure-cng.html (F10-206, F10-234)
- https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks-faq.html (F10-222, F10-225, F10-234, F10-236)
- https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks-nvidia-imex.html (F10-237)
- https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks.html (F10-234)
- https://docs.aws.amazon.com/pcs/latest/userguide/capacity-reservations-iodcr.html (F10-222, F10-235)
- https://docs.aws.amazon.com/pcs/latest/userguide/capacity-reservations-odcr.html (F10-235)
- https://docs.aws.amazon.com/pcs/latest/userguide/cng-node-lifecycle-actions-examples.html (F10-214, F10-243)
- https://docs.aws.amazon.com/pcs/latest/userguide/cng-node-lifecycle-actions-vetted-scripts.html (F10-214)
- https://docs.aws.amazon.com/pcs/latest/userguide/cng-node-lifecycle-actions.html (F10-214, F10-220)
- https://docs.aws.amazon.com/pcs/latest/userguide/doc-history.html (F10-204, F10-208, F10-218, F10-226, F10-229, F10-230, F10-231, F10-234, F10-238, F10-241, F10-242)
- https://docs.aws.amazon.com/pcs/latest/userguide/getting-started_create-cng_workers.html (F10-208, F10-231)
- https://docs.aws.amazon.com/pcs/latest/userguide/getting-started_run-job.html (F10-221, F10-228)
- https://docs.aws.amazon.com/pcs/latest/userguide/getting-started_run-mpi-job.html (F10-228)
- https://docs.aws.amazon.com/pcs/latest/userguide/gres-custom-settings.html (F10-236)
- https://docs.aws.amazon.com/pcs/latest/userguide/key-concepts.html (F10-200, F10-215)
- https://docs.aws.amazon.com/pcs/latest/userguide/mig-configuration.html (F10-223, F10-236)
- https://docs.aws.amazon.com/pcs/latest/userguide/monitoring-cloudwatch_metrics.html (F10-238)
- https://docs.aws.amazon.com/pcs/latest/userguide/monitoring-cost-allocation.html (F10-238)
- https://docs.aws.amazon.com/pcs/latest/userguide/monitoring_scaling-logs.html (F10-219, F10-222, F10-238)
- https://docs.aws.amazon.com/pcs/latest/userguide/scaling-job-level.html (F10-208, F10-217, F10-232)
- https://docs.aws.amazon.com/pcs/latest/userguide/service-endpoints-quotas.html (F10-239, F10-241)
- https://docs.aws.amazon.com/pcs/latest/userguide/slurm-accounting.html (F10-205, F10-226)
- https://docs.aws.amazon.com/pcs/latest/userguide/slurm-configuration.html (F10-205)
- https://docs.aws.amazon.com/pcs/latest/userguide/slurm-custom-settings-cluster.html (F10-224, F10-228)
- https://docs.aws.amazon.com/pcs/latest/userguide/slurm-custom-settings-cng.html (F10-225)
- https://docs.aws.amazon.com/pcs/latest/userguide/slurm-custom-settings-queue.html (F10-216)
- https://docs.aws.amazon.com/pcs/latest/userguide/slurm-custom-settings.html (F10-205)
- https://docs.aws.amazon.com/pcs/latest/userguide/slurm-job-submit-plugins.html (F10-230)
- https://docs.aws.amazon.com/pcs/latest/userguide/slurm-rest-api-faq.html (F10-229)
- https://docs.aws.amazon.com/pcs/latest/userguide/slurm-rest-api.html (F10-229)
- https://docs.aws.amazon.com/pcs/latest/userguide/slurm-versions.html (F10-203)
- https://docs.aws.amazon.com/pcs/latest/userguide/slurm-versions_release-notes.html (F10-223, F10-224, F10-236)
- https://docs.aws.amazon.com/pcs/latest/userguide/spot-role.html (F10-209)
- https://docs.aws.amazon.com/pcs/latest/userguide/troubleshooting-compute-node-bootstrap.html (F10-221)
- https://docs.aws.amazon.com/pcs/latest/userguide/troubleshooting-job-submission-maxjobcount.html (F10-202)
- https://docs.aws.amazon.com/pcs/latest/userguide/what-is-service.html (F10-200)
- https://docs.aws.amazon.com/pcs/latest/userguide/working-with_ami_pcs-ready-dlami.html (F10-212)
- https://docs.aws.amazon.com/pcs/latest/userguide/working-with_ami_samples.html (F10-212)
- https://docs.aws.amazon.com/pcs/latest/userguide/working-with_clusters_create.html (F10-201, F10-218)
- https://docs.aws.amazon.com/pcs/latest/userguide/working-with_clusters_size.html (F10-202)
- https://docs.aws.amazon.com/pcs/latest/userguide/working-with_clusters_version_update_procedure.html (F10-204)
- https://docs.aws.amazon.com/pcs/latest/userguide/working-with_cng.html (F10-206, F10-213)
- https://docs.aws.amazon.com/pcs/latest/userguide/working-with_cng_create.html (F10-206, F10-207, F10-208, F10-209, F10-210, F10-218, F10-225, F10-232)
- https://docs.aws.amazon.com/pcs/latest/userguide/working-with_file-systems.html (F10-231)
- https://docs.aws.amazon.com/pcs/latest/userguide/working-with_login-nodes.html (F10-227)
- https://docs.aws.amazon.com/pcs/latest/userguide/working-with_login-nodes_compute-node-group-for-login.html (F10-227)
- https://docs.aws.amazon.com/pcs/latest/userguide/working-with_networking_efa.html (F10-233)
- https://docs.aws.amazon.com/pcs/latest/userguide/working-with_networking_efa_create-lt.html (F10-233)
- https://docs.aws.amazon.com/pcs/latest/userguide/working-with_networking_placement-groups.html (F10-233)
- https://docs.aws.amazon.com/pcs/latest/userguide/working-with_networking_vpc-requirements.html (F10-201, F10-211, F10-232)
- https://docs.aws.amazon.com/pcs/latest/userguide/working-with_queues.html (F10-207, F10-215)
- https://docs.aws.amazon.com/pcs/latest/userguide/working-with_queues_create.html (F10-215)

### Tier 1, first-party documentation: AWS PCS API Reference

- https://docs.aws.amazon.com/pcs/latest/APIReference/API_ClusterSlurmConfigurationRequest.html (F10-218)
- https://docs.aws.amazon.com/pcs/latest/APIReference/API_CreateCluster.html (F10-201)
- https://docs.aws.amazon.com/pcs/latest/APIReference/API_CreateComputeNodeGroup.html (F10-206, F10-207, F10-210, F10-211)
- https://docs.aws.amazon.com/pcs/latest/APIReference/API_CreateQueue.html (F10-215)
- https://docs.aws.amazon.com/pcs/latest/APIReference/API_SpotOptions.html (F10-209)

### Tier 1, first-party documentation: Amazon SageMaker AI Developer Guide (HyperPod)

- https://docs.aws.amazon.com/sagemaker/latest/dg/hyperpod-observability-addon-setup.html (F10-305)
- https://docs.aws.amazon.com/sagemaker/latest/dg/managed-tier-checkpointing.html (F10-319)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless-considerations.html (F10-319)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-elastic-training.html (F10-319)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator-usage.html (F10-317)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator.html (F10-317)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-autoscaling-nodeclass.html (F10-312, F10-325)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-autoscaling-nodepool.html (F10-312)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-autoscaling.html (F10-312)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-gpu-partitioning.html (F10-308, F10-324)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-install-packages-using-helm-chart.html (F10-329)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-cli-command-create-cluster.html (F10-300)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-create-cluster.html (F10-305)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-cli.html (F10-321)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-policies-compute-allocation-gpu-partitions.html (F10-324)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-policies.html (F10-322)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-setup-task-governance.html (F10-320)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-tasks-gang-scheduling.html (F10-322)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-tasks-scheduling.html (F10-323)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-prerequisites.html (F10-304, F10-328, F10-329)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-config-tips.html (F10-318)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-deep-health-checks.html (F10-318)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-node-recovery.html (F10-314)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-run-jobs-kubectl.html (F10-316)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-setup-storage.html (F10-326)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks.html (F10-300)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment.html (F10-330)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-observability-addon.html (F10-330)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-operate-slurm-cli-command.html (F10-313)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-prerequisites.html (F10-327)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-ref.html (F10-302)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-notes.html (F10-308, F10-328, F10-332)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html (F10-314, F10-315)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html (F10-318)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-hang-detection.html (F10-330)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-run-jobs-slurm-docker.html (F10-330)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-scaling-eks.html (F10-306, F10-307, F10-308)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-scaling-slurm.html (F10-306)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-spot.html (F10-309, F10-310, F10-311)
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-ultraserver.html (F10-331)
- https://docs.aws.amazon.com/sagemaker/latest/dg/smcluster-getting-started-slurm-cli.html (F10-300, F10-302, F10-303, F10-326)
- https://docs.aws.amazon.com/sagemaker/latest/dg/training-plan-utilization-for-hyperpod.html (F10-325)
- https://docs.aws.amazon.com/sagemaker/latest/dg/use-training-plan-for-hyperpod-creation-using-api-cli-sdk.html (F10-325)

### Tier 1, first-party documentation: Amazon SageMaker API Reference

- https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ClusterAutoScalingConfig.html (F10-312, F10-313)
- https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ClusterCapacityRequirements.html (F10-309)
- https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ClusterInstanceGroupSpecification.html (F10-301, F10-304)
- https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ClusterSlurmConfig.html (F10-302)
- https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ComputeQuotaConfig.html (F10-320)
- https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateCluster.html (F10-301)
- https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateClusterSchedulerConfig.html (F10-320)
- https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateComputeQuota.html (F10-320)
- https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_PriorityClass.html (F10-320)
- https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ResourceSharingConfig.html (F10-320)

### Tier 2, AWS announcements and product pages (What's New posts, the AWS News Blog, the PCS pricing and FAQ pages)

- https://aws.amazon.com/about-aws/whats-new/2026/03/aws-pcs-manages-slurmdbd-cgroups-settings/ (F10-242)
- https://aws.amazon.com/about-aws/whats-new/2026/03/sagemaker-hyperpod-idle-resource-sharing/ (F10-322)
- https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-sagemaker-hyperpod-g7e-r5d/ (F10-304)
- https://aws.amazon.com/about-aws/whats-new/2026/04/aws-pcs-slurm-25-11/ (F10-223)
- https://aws.amazon.com/about-aws/whats-new/2026/04/sagemaker-hyperpod-flexible-instance-groups/ (F10-332)
- https://aws.amazon.com/about-aws/whats-new/2026/05/amazon-sagemaker-hyperpod-ami-based-node/ (F10-303)
- https://aws.amazon.com/about-aws/whats-new/2026/05/amazon-sagemaker-hyperpod-mincount/ (F10-307)
- https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-sagemaker-hyperpod-efa-only/ (F10-327)
- https://aws.amazon.com/about-aws/whats-new/2026/06/aws-parallel-computing-service-upgrade/ (F10-204)
- https://aws.amazon.com/about-aws/whats-new/2026/06/aws-parallel-computing-service/ (F10-237)
- https://aws.amazon.com/about-aws/whats-new/2026/06/aws-pcs-deep-learning-ami/ (F10-212)
- https://aws.amazon.com/about-aws/whats-new/2026/07/aws-pcs-node-lifecycle-actions/ (F10-214)
- https://aws.amazon.com/about-aws/whats-new/2026/07/hyperpod-custom-ami-slurm/ (F10-332)
- https://aws.amazon.com/about-aws/whats-new/2026/09/aws-pcs-gres-hardware-topology-mig/ (F10-236)
- https://aws.amazon.com/about-aws/whats-new/2026/09/aws-pcs-scaling-logs/ (F10-219)
- https://aws.amazon.com/about-aws/whats-new/2026/11/sagemaker-hyperpod-higher-pod-density/ (F10-328)
- https://aws.amazon.com/blogs/aws/introducing-checkpointless-and-elastic-training-on-amazon-sagemaker-hyperpod/ (F10-319)
- https://aws.amazon.com/pcs/faqs/ (F10-232)
- https://aws.amazon.com/pcs/pricing/ (F10-240)

### Read and not cited

- Register 09 of this dive (`research/2026-11/09-aws-orchestration.md`), for section 10 only. It is not a source for any entry here.
- The remaining downloaded pages of the PCS User Guide (214 in total) and of the SageMaker Developer Guide HyperPod chapters (322 in total), searched for the absence claims in section 11.

