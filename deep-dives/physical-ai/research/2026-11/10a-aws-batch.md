# 10a AWS Batch in depth for GPU work: research register

## 1. Header

- **Research date:** 2026-11-20. Every URL in this file was accessed 2026-11-20.
- **Area:** round 2 of the "Physical AI" dive, stream 10a. AWS Batch as the scheduler for a robot arm's GPU and CPU batch workloads: every object a user creates, the job lifecycle, Spot behaviour, scaling, configuration.
- **Sections fed:** 25 "AWS Batch" (main), 24 (the overview), and the hand-offs to 26 (AWS Parallel Computing Service), 27 (Amazon SageMaker HyperPod) and 28 (Amazon EKS).
- **ID range:** F10-1 to F10-199. Entries of register 09 are cited as F09-n and are not repeated unless today's page goes deeper or differs (section 10).
- **Quote policy:** quotes are verbatim from the page as fetched today, with house normalisation: curly quotes become straight quotes, typographic dashes become " - " or a hyphen. Ellipses mark omissions. Placeholders that the docs print in double braces (for example `{{your-compute-environment-name}}`) are kept as printed.
- **How pages were fetched:** the AWS Batch User Guide (all 326 pages of its table of contents) and the AWS Batch API Reference pages named below were downloaded in their markdown form (page address plus `.md`) with `curl` and a generic client name, then read as text. What's New posts and AWS blog posts were downloaded as HTML with `curl` and the article body extracted. Nothing was taken from a summariser, and no AWS API was called.
- **Labels:** `[vendor claim]` for savings or performance figures printed by AWS; `[derived]` for arithmetic, inputs shown; `[our reading]` for synthesis and every recommendation.
- **No prices:** where a page prints a price the entry says so and does not copy it.
- **Tiers:** Tier 1 = AWS docs and API reference; Tier 2 = What's New posts, AWS blogs, product pages.

## 2. Currency table

Newest first-party version or announcement found on 2026-11-20 for every item this register names.

| Item | Newest found | Date | Source |
|---|---|---|---|
| AWS Batch User Guide, document history | Newest row: AWSBatchFullAccess policy update | November 4, 2026 | https://docs.aws.amazon.com/batch/latest/userguide/document_history.html |
| Batch on EKS security context settings | What's New post | Nov 13, 2026 | https://aws.amazon.com/about-aws/whats-new/2026/11/aws-batch-eks-security-context/ (F09-21) |
| Spot Instance draining on by default (ECS compute environments) | Docs statement only, no post found | October 9, 2026 | https://docs.aws.amazon.com/batch/latest/userguide/bestpractice6.html |
| CloudWatch job metrics (`AWS/Batch`) | What's New post (doc history row: October 1, 2026) | Oct 6, 2026 | https://aws.amazon.com/about-aws/whats-new/2026/10/aws-batch-job-cloudwatch-metrics/ |
| EKS access entry authentication | What's New post (doc history row: October 1, 2026) | Oct 5, 2026 | https://aws.amazon.com/about-aws/whats-new/2026/10/aws-batch-access-entries/ |
| Bulk cancel and terminate (50 jobs per call) | What's New post | Sep 17, 2026 | https://aws.amazon.com/about-aws/whats-new/2026/09/aws-batch-bulk-cancellation/ |
| ECS Managed Instances compute environments | What's New post (doc history row: August 24, 2026) | Aug 25, 2026 | https://aws.amazon.com/about-aws/whats-new/2026/08/aws-batch-on-ecs-managed-instances/ |
| Ordered allocation strategies (`BEST_FIT_PROGRESSIVE_ORDERED`, `SPOT_CAPACITY_OPTIMIZED_PRIORITIZED`) | What's New post | Jun 22, 2026 | https://aws.amazon.com/about-aws/whats-new/2026/06/batch-ordered-allocation-strategies/ |
| S3 Files volumes in job definitions | Docs statement (default for EC2 compute environments created after this date) | June 19 2026 | https://docs.aws.amazon.com/batch/latest/userguide/s3files-volumes.html |
| Quota management and preemption (SageMaker Training queues) | What's New post | Mar 25, 2026 | https://aws.amazon.com/about-aws/whats-new/2026/03/aws-batch-quota-management-preemption-sagemaker/ |
| AMI status and AWS Health planned lifecycle events | What's New post | Mar 25, 2026 | https://aws.amazon.com/about-aws/whats-new/2026/03/aws-batch-ami-status-aws-health/ |
| Configurable scale-down delay (`minScaleDownDelayMinutes`) | What's New post | Mar 2, 2026 | https://aws.amazon.com/about-aws/whats-new/2026/03/aws-batch-configurable-scale-down-delay/ |
| Queue and share utilization in job queue snapshots | What's New post | Feb 13, 2026 | https://aws.amazon.com/about-aws/whats-new/2026/02/aws-batch-provides-job-queue-share-utilization/ |
| Unmanaged compute environments for EKS | What's New post | Feb 4, 2026 | https://aws.amazon.com/about-aws/whats-new/2026/02/aws-batch-on-eks-unmanaged-compute-environments/ |
| Array job status summary in `ListJobs` | What's New post (its address says 2026/01) | Feb 3, 2026 | https://aws.amazon.com/about-aws/whats-new/2026/01/aws-batch-array-job-status-summary/ |
| Default image for new ECS compute environments: Amazon Linux 2023 | Docs statement | January 12, 2026 | https://docs.aws.amazon.com/batch/latest/APIReference/API_Ec2Configuration.html |
| Default instance bundles (`default_x86_64`, `default_arm64`) | What's New post | Aug 18, 2025 | https://aws.amazon.com/about-aws/whats-new/2025/08/aws-batch-default-instance-types/ |
| Service environments and service jobs (SageMaker Training) | Document history row | July 30, 2025 | https://docs.aws.amazon.com/batch/latest/userguide/document_history.html |
| Resource-aware scheduling (consumable resources) | What's New post | Feb 27, 2025 | https://aws.amazon.com/about-aws/whats-new/2025/02/aws-batch-resource-aware-scheduling/ |
| Amazon ECS container agent | v1.108.3 | 2026-11-16 | https://github.com/aws/amazon-ecs-agent/releases/tag/v1.108.3 |
| Newest AWS HPC blog post in the AWS Batch category | "How Regeneron built a multi-executor Omics platform..." (not about GPU work; title only read) | 03 Nov 2026 | https://aws.amazon.com/blogs/hpc/category/compute/aws-batch/feed/ |
| Newest AWS post found on GPU Spot with Batch | Parakeet-TDT transcription on Batch | 22 APR 2026 | https://aws.amazon.com/blogs/machine-learning/cost-effective-multilingual-audio-transcription-at-scale-with-parakeet-tdt-and-aws-batch/ |
| Newest AWS post found on checkpointed Spot for long jobs | Resilient HPC and ML on Spot (Slurm) | 04 AUG 2026 | https://aws.amazon.com/blogs/hpc/resilient-hpc-and-ml-on-aws-running-tightly-coupled-workloads-on-spot-instances/ |

## 3. Pinned sources

### Code and release-pinned documentation

| Repository | Tag | 40-character SHA | Used for |
|---|---|---|---|
| aws/amazon-ecs-agent | v1.108.3 (published 2026-11-16) | 51cd882c8ea69d61d659378b1fb0b7fe585d6915 | README table of agent settings: `ECS_ENABLE_SPOT_INSTANCE_DRAINING` and `ECS_CONTAINER_STOP_TIMEOUT` defaults (F10-55, F10-56) |

### Docs pages read (all accessed 2026-11-20, markdown form)

AWS Batch User Guide (https://docs.aws.amazon.com/batch/latest/userguide/ plus the page name): managed_compute_environments, unmanaged_compute_environments, scaling-updates, infrastructure-updates, error-desired-vcpus-update, allocation-strategies (through F09-3), launch-templates, launch-template-examples, gpu-jobs, batch-gpu-ami, ecs_managed_instances, when-to-use-ecs-managed-instances, ecs-managed-instances-compute-environments, ecs-managed-instances-job-queues, ecs-managed-instances-instance-draining, create-compute-environment-ecs-managed-instances, create-job-definition-ecs-managed-instances, eks, daemonset-on-batch-eks-nodes, create-eks-gpu-job-definition, mnp-eks-running-mnp-jobs, job_queues, job-queue-template, job_queue_viewing_status, job_states, job_stuck_in_runnable, job_stuck_in_runnable_capacity, job_stuck_in_runnable_time_limit_actions, job_stuck_in_runnable_common_causes, job_scheduling, share-identifiers, scheduling-policies, fair-share-scheduling, scheduling-policy-template, resource-aware-scheduling, quota-management, quota-shares, preemption, what-are-service-environments, service-job-status, job_definition_parameters, multi-container-jobs, example-test-gpu, example-mnp-job-definition, example-use-parameters, example_array_job, array_jobs, job_dependencies, job_retries, job_timeouts, job_env_vars, multi-node-parallel-jobs, mnp-node-groups, job-lifecycle, mnp-ce, mnp-env-vars, efs-volumes, s3files-volumes, memory-management, using_cloudwatch_metrics, cloudwatch-container-insights-default-behavior, batch-host-logs-verify, batch_job_events, batch-job-queue-blocked-events, batch-cwe-target, cwe-input-transformer, bestpractice1, bestpractice2, bestpractice4, bestpractice5, bestpractice6, service_limits, document_history. The whole guide (326 pages) was downloaded and searched for the absence checks in F10-44, F10-65 and the UNKNOWN register.

AWS Batch API Reference (https://docs.aws.amazon.com/batch/latest/APIReference/API_ plus the name): ComputeResource, ComputeScalingPolicy, Ec2Configuration, UpdatePolicy, ManagedInstancesProvider, ComputeEnvironmentOrder, CreateComputeEnvironment, CreateJobQueue, JobStateTimeLimitAction, FairsharePolicy, ShareAttributes, SubmitJob, TerminateJob.

Other AWS docs: Amazon EC2 User Guide (spot-instance-termination-notices, interruption-behavior); Amazon ECS Developer Guide (spot-instance-draining-linux-container, container-instance-draining).

## 4. Claim register

### A. Compute environments: the capacity object

**F10-1. A managed compute environment is a wrapper around resources that Batch creates in the user's account: EC2 launch templates, EC2 Auto Scaling groups, EC2 Spot Fleets and an Amazon ECS cluster. Instances launch into the user's subnets and register with that ECS cluster. Batch warns that it "can terminate instances, stop tasks, or scale the cluster at any time", so nothing else may run on them.**
- Location: AWS Batch User Guide, "Managed compute environments"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/managed_compute_environments.html | Tier 1, first-party docs | definition | "AWS Batch creates and manages multiple AWS resources on your behalf and within your account, including Amazon EC2 Launch Templates, Amazon EC2 Auto Scaling Groups, Amazon EC2 Spot Fleets, and Amazon ECS Clusters." and "Managed compute environments launch Amazon EC2 instances into the VPC and subnets that you specify and then registers them with an Amazon ECS cluster." and "AWS Batch assumes full control of the compute resources in a managed compute environment and can terminate instances, stop tasks, or scale the cluster at any time." (accessed 2026-11-20)
- Use in dive: section 25, the moving parts and the drawing: a compute environment box contains an Auto Scaling group (or Spot Fleet) and an ECS cluster; the instances inside are ECS container instances. This is what "Batch runs on ECS" means.

**F10-2. The compute resource `type` has five values: `EC2`, `SPOT`, `FARGATE`, `FARGATE_SPOT` and `ECS_MANAGED_INSTANCES`. `SPOT` needs a Spot Fleet role only in some cases (F10-9). Multi-node parallel jobs are not supported on Spot Instances or on ECS Managed Instances.**
- Location: AWS Batch API Reference, "ComputeResource", member `type`
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/APIReference/API_ComputeResource.html | Tier 1, first-party docs | definition | "The type of compute environment: EC2, SPOT, FARGATE, FARGATE_SPOT, or ECS_MANAGED_INSTANCES." and "Valid Values: EC2 | SPOT | FARGATE | FARGATE_SPOT | ECS_MANAGED_INSTANCES" and "Multi-node parallel jobs aren't supported on Spot Instances or Amazon ECS Managed Instances." (accessed 2026-11-20)
- Use in dive: section 25, the first table: the five kinds of capacity a compute environment can hold. Sharpens F09-8 (MNP is excluded from ECS Managed Instances too).

**F10-3. `minvCpus`, `desiredvCpus` and `maxvCpus` are the three scaling numbers of an EC2 or Spot compute environment. `maxvCpus` is required and is the ceiling. `minvCpus` is the floor Batch keeps running "even if the compute environment is DISABLED". `desiredvCpus` is the current target and Batch moves it "between the minimum and maximum values based on job queue demand".**
- Location: AWS Batch API Reference, "ComputeResource", members `maxvCpus`, `minvCpus`, `desiredvCpus`
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/APIReference/API_ComputeResource.html | Tier 1, first-party docs | definition | "The maximum number of vCPUs that a compute environment can support." and "The minimum number of vCPUs that a compute environment should maintain (even if the compute environment is DISABLED)." and "The desired number of vCPUS in the compute environment. AWS Batch modifies this value between the minimum and maximum values based on job queue demand." (accessed 2026-11-20)
- Use in dive: section 25, the scaling dial in the animation: a gauge with a floor (`minvCpus`), a ceiling (`maxvCpus`) and a needle (`desiredvCpus`) that Batch moves. A compute environment is sized in vCPUs even when the scarce thing is GPUs.

**F10-4. `desiredvCpus` is Batch's own dial. The docs recommend not setting it: change `minvCpus` instead. A user can only raise it; lowering it returns the error "Manually scaling down compute environment is not supported. Disconnecting job queues from compute environment will cause it to scale-down to minvCpus".**
- Location: AWS Batch User Guide, "Perform scaling updates" and "Error message when you update the desiredvCpus setting"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/scaling-updates.html | Tier 1, first-party docs | definition | "We recommend not using desiredvCpus to initiate a scaling update as AWS Batch will dynamically adjust desiredvCpus. Instead you should update minvCpus." and "The new value must be greater than or equal to the current desiredvCpus." ; https://docs.aws.amazon.com/batch/latest/userguide/error-desired-vcpus-update.html | Tier 1, first-party docs | documentation of a limit | "Manually scaling down compute environment is not supported. Disconnecting job queues from compute environment will cause it to scale-down to minvCpus" (accessed 2026-11-20)
- Use in dive: section 25, recommended configuration: leave `desiredvCpus` out (or 0) and let the queue drive it. The error text also documents the one manual way to force scale-down: disconnect the queue.

**F10-5. `instanceTypes` accepts instance families (`c5`, `p3`), exact sizes (`c5.8xlarge`), or one of three bundles in which Batch picks: `default_x86_64` (from the m6i, c6i, r6i and c7i families), `default_arm64` (from m6g, c6g, r6g and c7g) and `optimal`, which is "Semantically equivalent to default_x86_64". None of the bundles contains a GPU family, and all types in one compute environment must share an architecture.**
- Location: AWS Batch API Reference, "ComputeResource", member `instanceTypes`; What's New post "AWS Batch now supports default instance type options" (Posted on: Aug 18, 2025)
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/APIReference/API_ComputeResource.html | Tier 1, first-party docs | definition | "You can specify instance families to launch any instance type within those families (for example, c5 or p3), or you can specify specific sizes within a family (such as c5.8xlarge)." and "default_x86_64 to choose x86 based instance types (from the m6i, c6i, r6i, and c7i instance families) that matches the resource demands of the job queue." and "default_arm64 to choose ARM based instance types (from the m6g, c6g, r6g, and c7g instance families)" and "optimal Semantically equivalent to default_x86_64" and "you can't mix x86 and ARM instances in the same compute environment" ; https://aws.amazon.com/about-aws/whats-new/2025/08/aws-batch-default-instance-types/ | Tier 2, launch announcement | "the existing 'optimal' option (which applies to M, C, and R EC2 instance familes) will continue to be supported and is not being deprecated" (accessed 2026-11-20)
- Use in dive: section 25, a pitfall attached to the right approach: a GPU compute environment must name its GPU families or sizes; `optimal` and the default bundles never launch a GPU instance. `[our reading]` of the family lists quoted.

**F10-6. A GPU compute environment must contain only GPU families: "All instance types in a compute environment that run GPU jobs must be from the p3, p4, p5, p6, g3, g3s, g4, g5, g6, gr6, g7, or g7e instance families. If this isn't done a GPU job might get stuck in the RUNNABLE status." A job that asks for no GPU can still land on a GPU instance and "might block GPU jobs from running". Batch schedules GPUs only on NVIDIA instance types.**
- Location: AWS Batch User Guide, "Run GPU jobs"
- Verdict: NEW (goes deeper than F09-128, which recorded the table and the warning in summary)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/gpu-jobs.html | Tier 1, first-party docs | documentation of a limit | "All instance types in a compute environment that run GPU jobs must be from the p3, p4, p5, p6, g3, g3s, g4, g5, g6, gr6, g7, or g7e instance families. If this isn't done a GPU job might get stuck in the RUNNABLE status." and "Jobs that don't use the GPUs can be run on GPU instances. However, they might cost more to run on the GPU instances than on similar non-GPU instances. Depending on the specific vCPU, memory, and time needed, these non-GPU jobs might block GPU jobs from running." and "For GPU jobs AWS Batch only supports instance types that have NVIDIA GPUs." (accessed 2026-11-20)
- Use in dive: section 25, recommended configuration: one compute environment (and one queue) for GPU jobs, a separate one for CPU jobs such as decode and curation. The family list as printed names g6 and g7e but not g6e; the table on the same page lists g6e sizes (F10-7), so the list and the table disagree (section 10).

**F10-7. The GPU instance table in the Batch user guide lists, among others: g6.xlarge (1 GPU, 24 GiB GPU memory, 4 vCPUs, 16 GiB), g6e.xlarge (1 GPU, 48 GiB, 4 vCPUs, 32 GiB), g6e.12xlarge (4 GPUs, 192 GiB), g6e.48xlarge (8 GPUs, 384 GiB), g7.2xlarge (1 GPU, 32 GiB, 8 vCPUs), g7.48xlarge (8 GPUs, 256 GiB), g7e.2xlarge (1 GPU, 96 GiB, 8 vCPUs, 64 GiB), g7e.48xlarge (8 GPUs, 768 GiB, 192 vCPUs, 2048 GiB), p5.48xlarge (8 GPUs, 640 GiB, 192 vCPUs, 2 TiB), p5en.48xlarge (8 GPUs, 1128 GiB) and p6-b200.48xlarge (8 GPUs, 1440 GiB, 192 vCPUs, 2 TiB). The table has no row for p5.4xlarge, P6-B300 or P6e.**
- Location: AWS Batch User Guide, "Run GPU jobs", instance table
- Verdict: NEW (extends F09-128 with the G7, P5en and P6 rows and the absent rows)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/gpu-jobs.html | Tier 1, first-party docs | documentation of support | "| g6e.xlarge | 1 | 48 GiB | 4 | 32 GiB | Up to 20 Gbps |" and "| g7.2xlarge | 1 | 32 GiB | 8 | 32 GiB | Up to 60 Gbps |" and "| g7e.2xlarge | 1 | 96 GiB | 8 | 64 GiB | Up to 50 Gbps |" and "| g7e.48xlarge | 8 | 768 GiB | 192 | 2048 GiB | 1600 Gbps |" and "| p5.48xlarge | 8 | 640 GiB | 192 | 2 TiB | 3200 Gbps |" and "| p5en.48xlarge | 8 | 1128 GiB | 192 | 2 TiB | 3200 Gbps |" and "| p6-b200.48xlarge | 8 | 1440 GiB | 192 | 2 TiB | 100 Gbps |" (accessed 2026-11-20)
- Use in dive: section 25, the instance menu for the arm's jobs: 24 GiB (g6), 32 GiB (g7), 48 GiB (g6e), 96 GiB (g7e) single-GPU sizes. The absence of a row is not a statement that Batch cannot launch the type; see the UNKNOWN register (U10-3). The page prints 100 Gbps for p6-b200.48xlarge, which is out of line with the P5 rows; quote it only as the page's figure.

**F10-8. The allocation strategy decides which instance type Batch launches when the best-fitting one is not available. On ECS-backed compute environments the default is `BEST_FIT`; on EKS compute environments the parameter is required. `BEST_FIT` compute environments cannot take infrastructure updates. The two ordered strategies (`BEST_FIT_PROGRESSIVE_ORDERED` for On-Demand, `SPOT_CAPACITY_OPTIMIZED_PRIORITIZED` for Spot) launched on 22 June 2026 and read the order of the `instanceTypes` list; a family in the list is expanded by size with `BEST_FIT_PROGRESSIVE` logic, and an explicit size listed with its family keeps its listed position.**
- Location: AWS Batch API Reference, "ComputeResource", member `allocationStrategy`; What's New post "AWS Batch now supports customer-ordered instance allocation strategies" (Posted on: Jun 22, 2026)
- Verdict: NEW (adds the default, the EKS rule, the launch date and the family-expansion rule to F09-3)
- Evidence: https://docs.aws.amazon.com/batch/latest/APIReference/API_ComputeResource.html | Tier 1, first-party docs | definition | "This parameter is required for Amazon EKS compute environments. For Amazon ECS compute environments, if this parameter isn't specified, the BEST_FIT allocation strategy is used by default." and "Compute resources that use a BEST_FIT allocation strategy don't support infrastructure updates and can't update some parameters." and "When an instance family is specified, sizes within that family are expanded using BEST_FIT_PROGRESSIVE logic - preferring sizes that best fit the jobs, with larger sizes as fallback. Instance types that cannot meet the resource requirements of the jobs are skipped." and "in [\"m7a.4xlarge\", \"m7a\", \"m6a\"], m7a.4xlarge is always placed first and is excluded from the m7a family expansion" and "When Spot Instance capacity pools are similarly available, priority order is respected. When capacity is constrained, AWS Batch selects from the most available pools regardless of priority to minimize the likelihood of Spot Instance interruptions." ; https://aws.amazon.com/about-aws/whats-new/2026/06/batch-ordered-allocation-strategies/ | Tier 2, launch announcement | "AWS Batch now offers the Best Fit Progressive Ordered (BFPO) and Spot Capacity Optimized Prioritized (SCOP) allocation strategies" (accessed 2026-11-20)
- Use in dive: section 25, the allocation-strategy table and the recommended configuration: never leave the default (`BEST_FIT`) on a GPU compute environment, because it waits for one type and blocks updates. For a list of GPU families the ordered strategies let the author say "g7e first, then g6e".

**F10-9. Two Spot fields. `bidPercentage` caps the Spot price as a percentage of On-Demand; empty means 100%, and the reference says "For most use cases, we recommend leaving this field empty." `spotIamFleetRole` is required only when a `SPOT` compute environment uses `BEST_FIT` or names no strategy; to tag Spot Instances at creation it must use the `AmazonEC2SpotFleetTaggingRole` managed policy.**
- Location: AWS Batch API Reference, "ComputeResource", members `bidPercentage` and `spotIamFleetRole`
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/APIReference/API_ComputeResource.html | Tier 1, first-party docs | definition | "If you leave this field empty, the default value is 100% of the On-Demand price. For most use cases, we recommend leaving this field empty." and "The Amazon Resource Name (ARN) of the Amazon EC2 Spot Fleet IAM role applied to a SPOT compute environment. This role is required if the allocation strategy set to BEST_FIT or if the allocation strategy isn't specified." and "the Spot Fleet IAM role specified here must use the newer AmazonEC2SpotFleetTaggingRole managed policy" (accessed 2026-11-20)
- Use in dive: section 25, the Spot snippet: with `SPOT_PRICE_CAPACITY_OPTIMIZED` the recommended configuration has neither field.

**F10-10. Which Spot strategy AWS recommends depends on the page. The allocation-strategies page says "We recommend that you use SPOT_PRICE_CAPACITY_OPTIMIZED rather than SPOT_CAPACITY_OPTIMIZED in most instances." The Spot best-practices page still says "Choose the SPOT_CAPACITY_OPTIMIZED allocation strategy" and adds "If you're concerned about interruptions, this is a suitable choice." Both pages agree on diversifying instance types.**
- Location: AWS Batch User Guide, "Instance type allocation strategies" and "Use Amazon EC2 Spot best practices for AWS Batch"
- Verdict: NEW (a disagreement between two pages of the same guide; F09-3 quoted only the first)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/bestpractice6.html | Tier 1, first-party docs | definition (guidance) | "Choose the SPOT_CAPACITY_OPTIMIZED allocation strategy - AWS Batch chooses Amazon EC2 instances from the deepest Amazon EC2 Spot capacity pools. If you're concerned about interruptions, this is a suitable choice." and "Diversify instance types - To diversify your instance types, consider compatible sizes and families, then let AWS Batch choose based on price or availability." ; https://docs.aws.amazon.com/batch/latest/userguide/allocation-strategies.html | Tier 1, first-party docs | definition (guidance) | "We recommend that you use SPOT_PRICE_CAPACITY_OPTIMIZED rather than SPOT_CAPACITY_OPTIMIZED in most instances." (accessed 2026-11-20)
- Use in dive: section 25, the Spot recommendation, stated honestly: the strategy page recommends price-capacity-optimized for most cases; the best-practices page names capacity-optimized for readers who care most about interruptions. `[our reading]`: for GPU Spot, where interruptions cost a checkpoint interval, either is defensible and the instance-type list matters more than the choice between them.

**F10-11. What Batch says about Spot versus On-Demand: use On-Demand when "The runtime of your jobs is more than an hour, and you can't tolerate interruptions", when there is a strict service-level objective, or when "The instances that you require are more likely to see interruptions"; use Spot when "The runtime for your jobs is typically 30 minutes or less" or "Long running jobs can be restarted from a checkpoint if interrupted". The page has no GPU-specific Spot guidance.**
- Location: AWS Batch User Guide, "Amazon EC2 On-Demand or Amazon EC2 Spot"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/bestpractice5.html | Tier 1, first-party docs | definition (guidance) | "Most AWS Batch customers use Amazon EC2 Spot instances because of the savings over On-Demand instances. However, if your workload runs for multiple hours and can't be interrupted, On-Demand instances might be more suitable for you." and "The runtime of your jobs is more than an hour, and you can't tolerate interruptions to your workload." and "The instances that you require are more likely to see interruptions." and "The runtime for your jobs is typically 30 minutes or less." and "Long running jobs can be restarted from a checkpoint if interrupted." (accessed 2026-11-20)
- Use in dive: section 25, the Spot decision in AWS's words. The third On-Demand bullet is the closest the Batch guide comes to a statement about scarce GPU types; no sentence in the Batch user guide names GPU Spot (U10-1).

**F10-12. Batch's documented Spot-then-On-Demand pattern is two queues, not one: submit to a queue on Spot compute environments, catch the interruption from EventBridge, and resubmit to an On-Demand queue with Lambda or Step Functions. The same page says to use different instance types, sizes and Availability Zones for the On-Demand compute environment.**
- Location: AWS Batch User Guide, "Amazon EC2 On-Demand or Amazon EC2 Spot"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/bestpractice5.html | Tier 1, first-party docs | definition (guidance) | "You can mix both purchasing models by submitting on Spot instance first and then use On-Demand instance as a fallback option. For example, submit your jobs on a queue that's connected to compute environments that are running on Amazon EC2 Spot instances. If a job gets interrupted, catch the event from Amazon EventBridge and correlate it to a Spot instance reclamation. Then, resubmit the job to an On-Demand queue using an AWS Lambda function or AWS Step Functions." and "Use different instance types, sizes, and Availability Zones for your On-Demand compute environment to maintain Amazon EC2 Spot instance pool availability and decrease the interruption rate." (accessed 2026-11-20)
- Use in dive: section 25, the fallback design, beside the one-queue alternative of F10-22. This is where Step Functions enters the Batch section.

**F10-13. `ec2Configuration.imageType` selects the machine image. Defaults: `ECS_AL2023` for non-GPU families and `ECS_AL2023_NVIDIA` "Default for all GPU instance families"; on EKS, `EKS_AL2023` and `EKS_AL2023_NVIDIA`. `ECS_AL2023_NVIDIA` does not support p3 and g3 types. Batch changed the default for new ECS compute environments from Amazon Linux 2 to Amazon Linux 2023 on 12 January 2026 and blocked new compute environments on Batch-provided Amazon Linux 2 images from 30 June 2026. One or two `ec2Configuration` values can be given.**
- Location: AWS Batch API Reference, "Ec2Configuration" and "ComputeResource" member `ec2Configuration`
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/APIReference/API_Ec2Configuration.html | Tier 1, first-party docs | definition | "ECS_AL2023_NVIDIA Amazon Linux 2023 (GPU): Default for all GPU instance families and can be used for all non AWS Graviton-based instance types." and "ECS_AL2023_NVIDIA doesn't support p3 and g3 instance types." and "On January 12, 2026, AWS Batch changed the default AMI for new Amazon ECS compute environments from Amazon Linux 2 to Amazon Linux 2023. Effective June 30, 2026, AWS Batch will block creation of new Amazon ECS compute environments using Batch-provided Amazon Linux 2 AMIs." and "EKS_AL2023_NVIDIA Amazon Linux 2023 (accelerated): Default for GPU instance families and can be used for all non AWS Graviton-based instance types." ; https://docs.aws.amazon.com/batch/latest/APIReference/API_ComputeResource.html | Tier 1, first-party docs | definition | "If Ec2Configuration isn't specified, the default is ECS_AL2023 for EC2 (ECS) compute environments and EKS_AL2023 for EKS compute environments. One or two values can be provided." (accessed 2026-11-20)
- Use in dive: section 25, the snippet line `"ec2Configuration": [{"imageType": "ECS_AL2023_NVIDIA"}]` and why it can usually be left out for a GPU-only compute environment (Batch matches the image type to the instance type). Older examples that show `ECS_AL2` are out of date.

**F10-14. Batch does not patch a compute environment's image by itself: "AWS Batch doesn't automatically upgrade the AMIs in a compute environment after it's created." Since 25 March 2026 `DescribeComputeEnvironments` reports `batchImageStatus` as `LATEST` or `UPDATE_AVAILABLE` for Batch-provided default images, and Batch publishes AWS Health planned lifecycle events for image deprecations.**
- Location: AWS Batch User Guide, "Managed compute environments"; API Reference, "Ec2Configuration", member `batchImageStatus`; What's New post "AWS Batch now provides AMI status and supports AWS Health Planned Lifecycle Events" (Posted on: Mar 25, 2026)
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/managed_compute_environments.html | Tier 1, first-party docs | documentation of a limit | "AWS Batch doesn't automatically upgrade the AMIs in a compute environment after it's created. For example, it doesn't update the AMIs in your compute environment when a newer version of the Amazon ECS optimized AMI is released. You're responsible for the management of the guest operating system." ; https://aws.amazon.com/about-aws/whats-new/2026/03/aws-batch-ami-status-aws-health/ | Tier 2, launch announcement | "The AMI status indicator shows whether you're using the latest AMI (LATEST) or if an update is available (UPDATE_AVAILABLE)" (accessed 2026-11-20)
- Use in dive: section 25, "what it does poorly" (the user owns image currency on EC2 compute environments) and the hand-off to ECS Managed Instances, where AWS patches (F10-17).

**F10-15. Updating a compute environment comes in three kinds. A scaling update (only `minvCpus`, `maxvCpus`, `desiredvCpus` or `minScaleDownDelayMinutes` changed) adds or removes instances. An infrastructure update (instance types, allocation strategy, image, launch template, subnets, security groups, placement group, instance role, tags, `bidPercentage`, `type`) replaces instances, and needs the `AWSServiceRoleForBatch` service-linked role and any strategy except `BEST_FIT`. Otherwise a blue/green update (a new compute environment swapped into the queue) is the route.**
- Location: AWS Batch User Guide, "Perform scaling updates" and "Perform infrastructure updates"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/infrastructure-updates.html | Tier 1, first-party docs | definition | "Infrastructure updates replace the instances in your compute environment with new instances that have updated settings." and "Infrastructure updates require the AWSServiceRoleForBatch service-linked role and an allocation strategy of BEST_FIT_PROGRESSIVE, BEST_FIT_PROGRESSIVE_ORDERED, SPOT_CAPACITY_OPTIMIZED, SPOT_PRICE_CAPACITY_OPTIMIZED, or SPOT_CAPACITY_OPTIMIZED_PRIORITIZED. If your environment doesn't meet these requirements, use blue/green updates instead." ; https://docs.aws.amazon.com/batch/latest/userguide/scaling-updates.html | Tier 1, first-party docs | definition | "Scaling updates adjust the capacity of your compute environment by adding or removing instances. This is the fastest update strategy and doesn't require replacing existing instances." (accessed 2026-11-20)
- Use in dive: section 25, a moving part ("changing the cluster") and a second reason to avoid `BEST_FIT`.

**F10-16. `updatePolicy` says what happens to running jobs during an infrastructure update: `terminateJobsOnUpdate` (default `false`) and `jobExecutionTimeoutMinutes` (default 30, maximum 7200). With the defaults a running job gets 30 minutes and is then terminated; the docs say to configure a retry strategy so such jobs run again.**
- Location: AWS Batch API Reference, "UpdatePolicy"; User Guide, "Perform infrastructure updates", "Job handling during updates"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/APIReference/API_UpdatePolicy.html | Tier 1, first-party docs | definition | "Specifies the job timeout (in minutes) when the compute environment infrastructure is updated. The default value is 30. The maximum value is 7200." and "Specifies whether jobs are automatically terminated when the compute environment infrastructure is updated. The default value is false." ; https://docs.aws.amazon.com/batch/latest/userguide/infrastructure-updates.html | Tier 1, first-party docs | definition | "When you set terminateJobsOnUpdate=false, running jobs continue for the specified timeout period with a default timeout of 30 minutes, and jobs are terminated if they exceed the timeout." and "To retry jobs that are terminated during an update, configure a job retry strategy." and "aws batch update-compute-environment \ --compute-environment {{your-compute-environment-name}} \ --compute-resources updateToLatestImageVersion={{true}} \ --update-policy terminateJobsOnUpdate={{false}},jobExecutionTimeoutMinutes={{60}}" (accessed 2026-11-20)
- Use in dive: section 25, recommended configuration: a compute environment that runs multi-hour fine-tunes sets `jobExecutionTimeoutMinutes` above the longest job, or an image update will cut the job at 30 minutes. `[derived]`: 7200 minutes / 60 = 120 hours = 5 days maximum.

**F10-17. An ECS Managed Instances compute environment keeps everything in a `managedInstancesProvider` block. Spot is a field, not a type: `capacityOptionType` is `ON_DEMAND` (default) or `SPOT`. `instanceRequirements.allowedInstanceTypes` takes types or families (the docs' example names `g5`). `infrastructureOptimization.scaleInAfter` is the idle time before termination, `-1` or 0 to 3600 seconds. `capacityReservations` targets On-Demand Capacity Reservations. Nine classic fields are invalid, among them `allocationStrategy`, `minvCpus`, `desiredvCpus`, `instanceTypes` and `ec2Configuration`.**
- Location: AWS Batch User Guide, "Compute environments on Amazon ECS Managed Instances"
- Verdict: NEW (the field-level view behind F09-2)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/ecs-managed-instances-compute-environments.html | Tier 1, first-party docs | definition | "there is no ECS_MANAGED_INSTANCES_SPOT type" and "capacityOptionType Optional. The capacity pricing model. Valid values are ON_DEMAND (default) and SPOT." and "allowedInstanceTypes - A list of specific instance types or instance families (for example, m5.large or g5). When specified, only these instance types are used." and "scaleInAfter - The number of seconds an instance must be idle before Amazon ECS terminates it. Valid values are -1 (to disable scale-in) or 0-3600 (seconds of idle time before termination)." and "The following computeResources parameters are not valid for Amazon ECS Managed Instances compute environments and must not be specified: allocationStrategy bidPercentage desiredvCpus minvCpus imageId instanceTypes instanceRole ec2Configuration ec2KeyPair" and "Set maxvCpus to at least the vCPU count of the largest instance type that your jobs need. Otherwise, jobs that don't fit on running instances stay in the RUNNABLE state." (accessed 2026-11-20)
- Use in dive: section 25, the third compute environment kind, drawn with fewer knobs. `[derived]`: 3600 seconds = 1 hour is the longest idle hold, against 10080 minutes (1 week) for `minScaleDownDelayMinutes` on EC2 compute environments (F10-40).

**F10-18. Two lifecycle rules specific to ECS Managed Instances. ECS starts draining every instance 14 days after launch, and a job running on it then fails with the stop reason "Task stopped during instance draining"; the docs say to set a retry strategy. In a job queue that mixes On-Demand and Spot ECS Managed Instances compute environments, every On-Demand environment must come before any Spot one, the reverse of the usual Spot-first order.**
- Location: AWS Batch User Guide, "Instance draining and task interruptions" and "Job queues on Amazon ECS Managed Instances"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/ecs-managed-instances-instance-draining.html | Tier 1, first-party docs | documentation of a limit | "Amazon ECS Managed Instances initiates draining at day 14 from instance launch. When Amazon ECS drains an instance that is running a job, the job's task fails with the stop reason Task stopped during instance draining. Configure a retry strategy on the job or job definition to rerun the job." ; https://docs.aws.amazon.com/batch/latest/userguide/ecs-managed-instances-job-queues.html | Tier 1, first-party docs | documentation of a limit | "For Amazon ECS Managed Instances job queues, Spot compute environments cannot be ordered before On-Demand compute environments in the computeEnvironmentOrder." and "You cannot mix Amazon ECS Managed Instances compute environments with Fargate or Amazon EC2 compute environments in the same job queue." (accessed 2026-11-20)
- Use in dive: section 25, limits of the managed kind: no Spot-first fallback queue, and a 14-day ceiling on any single instance, which matters only for very long jobs.

**F10-19. An unmanaged compute environment is an empty ECS cluster (or, on EKS, a namespace) that Batch schedules into while the user launches and scales the instances. The user reads the cluster ARN with `describe-compute-environments` and registers instances with `ECS_CLUSTER` in user data. Fargate is not supported in unmanaged compute environments.**
- Location: AWS Batch User Guide, "Unmanaged compute environments"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/unmanaged_compute_environments.html | Tier 1, first-party docs | definition | "In an unmanaged compute environment, you manage your own compute resources." and "Find the Amazon ECS cluster that's associated with the environment and then manually launch your container instances into that Amazon ECS cluster." and "#!/bin/bash echo \"ECS_CLUSTER={{ecsClusterArn}}\" >> /etc/ecs/ecs.config" and "AWS Fargate resources aren't supported in unmanaged compute environments." (accessed 2026-11-20)
- Use in dive: section 25, the fourth kind, in one sentence: Batch keeps the queue, the user keeps the fleet. Multi-node parallel jobs are excluded (F09-8).

### B. Job queues and job states: where a job waits and what it passes through

**F10-20. A job queue holds submitted jobs until the scheduler can place them. Its fields: `priority` (an integer; "Job queues with a higher priority ... are evaluated first when associated with the same compute environment"), `state` (`ENABLED` accepts jobs; `DISABLED` accepts none but lets queued jobs finish), `computeEnvironmentOrder` or `serviceEnvironmentOrder` (never both), an optional `schedulingPolicyArn`, and optional `jobStateTimeLimitActions`. `jobQueueType` is one of `EKS`, `ECS`, `ECS_FARGATE`, `SAGEMAKER_TRAINING`, `ECS_MANAGED_INSTANCES`.**
- Location: AWS Batch API Reference, "CreateJobQueue", request body
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/APIReference/API_CreateJobQueue.html | Tier 1, first-party docs | definition | "The priority of the job queue. Job queues with a higher priority (or a higher integer value for the priority parameter) are evaluated first when associated with the same compute environment. Priority is determined in descending order. For example, a job queue with a priority value of 10 is given scheduling preference over a job queue with a priority value of 1." and "If the job queue state is ENABLED, it is able to accept jobs. If the job queue state is DISABLED, new jobs can't be added to the queue, but jobs already in the queue can finish." and "Valid Values: EKS | ECS | ECS_FARGATE | SAGEMAKER_TRAINING | ECS_MANAGED_INSTANCES" and "A job queue can't have both a serviceEnvironmentOrder and a computeEnvironmentOrder field." (accessed 2026-11-20)
- Use in dive: section 25, the queue as a moving part. Queue priority only matters between queues that share a compute environment: `[our reading]` a "fine-tune" queue at priority 10 and a "nightly evaluation" queue at priority 1 on the same GPU compute environment is the Batch way to say fine-tunes go first, without preempting anything already running (F10-34).

**F10-21. A job queue maps to up to three compute environments, tried in ascending `order`. They must be all EC2-type (`EC2` or `SPOT`) or all Fargate-type, never mixed, must share one CPU architecture, and must be `VALID` when attached.**
- Location: AWS Batch API Reference, "CreateJobQueue", member `computeEnvironmentOrder`; "ComputeEnvironmentOrder"
- Verdict: NEW (the rules around the "3 per queue" quota in F09-6)
- Evidence: https://docs.aws.amazon.com/batch/latest/APIReference/API_CreateJobQueue.html | Tier 1, first-party docs | documentation of a limit | "You can associate up to three compute environments with a job queue. All of the compute environments must be either EC2 (EC2 or SPOT) or Fargate (FARGATE or FARGATE_SPOT); EC2 and Fargate compute environments can't be mixed." and "All compute environments that are associated with a job queue must share the same architecture." ; https://docs.aws.amazon.com/batch/latest/APIReference/API_ComputeEnvironmentOrder.html | Tier 1, first-party docs | definition | "Compute environments are tried in ascending order." (accessed 2026-11-20)
- Use in dive: section 25, the drawing: one queue, an arrow to compute environment 1, then 2, then 3. An x86 GPU compute environment and a Graviton CPU compute environment cannot sit behind one queue.

**F10-22. When a queue has several compute environments, Batch scales up a later one only in two cases: the earlier ones "have reached their maxvCpus", or "the runnable jobs at the front of the job queue cannot be satisfied by any instance types available in the preceding compute environments". A Spot compute environment that is short of Spot capacity but under its `maxvCpus` matches neither sentence.**
- Location: AWS Batch API Reference, "ComputeEnvironmentOrder", description
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/APIReference/API_ComputeEnvironmentOrder.html | Tier 1, first-party docs | definition | "If two or more compute environments are associated with a job queue, a later compute environment is scaled up when the preceding ones have reached their maxvCpus, or when the runnable jobs at the front of the job queue cannot be satisfied by any instance types available in the preceding compute environments." (accessed 2026-11-20)
- Use in dive: section 25, how the "Spot first, On-Demand second" queue behaves, stated as AWS states it. `[our reading]`: order 1 Spot with a `maxvCpus` sized to the share of work that should run on Spot, order 2 On-Demand; the spill to On-Demand is driven by the Spot ceiling, and the docs do not promise a spill when Spot capacity is merely unavailable (U10-2). The two-queue resubmit pattern (F10-12) is the documented answer to that case.

**F10-23. The first three job states. `SUBMITTED`: in the queue, not yet evaluated by the scheduler. `PENDING`: waiting on a dependency on another job or resource; an array parent also sits in `PENDING` while its children run. `RUNNABLE`: no outstanding dependencies, "ready to be scheduled to a host", started "as soon as sufficient resources are available in one of the compute environments that are mapped to the job's queue"; a job can stay `RUNNABLE` indefinitely.**
- Location: AWS Batch User Guide, "Job states"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/job_states.html | Tier 1, first-party docs | definition | "A job that's submitted to the queue, and has not yet been evaluated by the scheduler. The scheduler evaluates the job to determine if it has any outstanding dependencies on the successful completion of any other jobs. If there are dependencies, the job is moved to PENDING. If there are no dependencies, the job is moved to RUNNABLE." and "Array job parents are updated to PENDING when any child job is updated to RUNNABLE and remain in PENDING status while child jobs are running." and "A job that resides in the queue, has no outstanding dependencies, and is therefore ready to be scheduled to a host. Jobs in this state are started as soon as sufficient resources are available in one of the compute environments that are mapped to the job's queue. However, jobs can remain in this state indefinitely when sufficient resources are unavailable." (accessed 2026-11-20)
- Use in dive: section 25, animation steps 1 to 3. `RUNNABLE` is the state a job is in during the whole scale-from-zero wait: the instance is launching while the job shows `RUNNABLE`.

**F10-24. `STARTING` begins when the job has been scheduled to a host and covers the container image pull: "The amount of time it takes to pull an image for your job is equivalent to the amount of time your job will be in the STARTING state." It is outside the job timeout: "STARTING is not included in timeouts; duration starts at RUNNING." `RUNNING` is the container running on an ECS container instance; the exit code decides the outcome (0 is success), and a failed attempt with attempts left returns the job to `RUNNABLE`.**
- Location: AWS Batch User Guide, "Job states"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/job_states.html | Tier 1, first-party docs | definition | "These jobs have been scheduled to a host and the relevant container initiation operations are underway. After the container image is pulled and the container is up and running, the job transitions to RUNNING." and "For example, if it takes three minutes to pull the image for your job, your job will be in the STARTING state for three minutes." and "STARTING is not included in timeouts; duration starts at RUNNING." and "If the job associated with a failed attempt has any remaining attempts left in its optional retry strategy configuration, the job is moved to RUNNABLE again." (accessed 2026-11-20)
- Use in dive: section 25, animation steps 4 and 5, and the place to show a multi-GB simulator image costing minutes: the job sits in `STARTING` for as long as the pull takes. The "three minutes" is the docs' illustration, not a measurement (U09-1 stays open).

**F10-25. The two terminal states are `SUCCEEDED` (exit code 0) and `FAILED` ("The job has failed all available attempts"). Batch keeps the state of finished jobs "for at least 7 days". Logs go to the CloudWatch Logs group `/aws/batch/job`, in a stream named from the job definition name and the ECS task ID, and "By default, these logs never expire."**
- Location: AWS Batch User Guide, "Job states"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/job_states.html | Tier 1, first-party docs | definition | "The job has successfully completed with an exit code of 0. The job state for SUCCEEDED jobs is persisted in AWS Batch for at least 7 days." and "The job has failed all available attempts. The job state for FAILED jobs is persisted in AWS Batch for at least 7 days." and "The log group is /aws/batch/job, and the log stream name format is as follows: {{first200CharsOfJobDefinitionName}}/default/{{ecs_task_id}}. This format might change in the future." and "By default, these logs never expire." (accessed 2026-11-20)
- Use in dive: section 25, animation step 6 and a limit: Batch is not the system of record for experiments. Job history older than 7 days must live elsewhere (an experiment tracker, F09-103, or EventBridge events written to a store).

**F10-26. A job at the head of the queue that cannot be placed blocks the queue. Batch then sends a "Job queue blocked" event and writes a reason into the job's `statusReason`. The reasons fall into capacity, misconfiguration and invalid compute environment; the capacity one reads `CAPACITY:INSUFFICIENT_INSTANCE_CAPACITY - Service cannot fulfill the capacity requested for instance type [instanceTypeName]`.**
- Location: AWS Batch User Guide, "Jobs stuck in a RUNNABLE status" and "Jobs stuck in RUNNABLE due to capacity"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/job_stuck_in_runnable.html | Tier 1, first-party docs | definition | "If AWS Batch detects that you have a RUNNABLE job at the head and blocking the queue, you'll receive a Job queue blocked events event from Amazon CloudWatch Events with the reason. The same reason is also updated into the statusReason field as a part of ListJobs and DescribeJobs API calls." and "Specific reasons are inferred by AWS Batch based on the state of connected compute environments and fall into three categories: capacity issues, misconfiguration, and invalid compute environments." ; https://docs.aws.amazon.com/batch/latest/userguide/job_stuck_in_runnable_capacity.html | Tier 1, first-party docs | definition | "CAPACITY:INSUFFICIENT_INSTANCE_CAPACITY - Service cannot fulfill the capacity requested for instance type [instanceTypeName]" and "All connected compute environments have insufficient capacity errors." (accessed 2026-11-20)
- Use in dive: section 25, what a GPU shortage looks like from inside Batch: a `RUNNABLE` job with this `statusReason`, and a FIFO queue stopped behind it. This is the head-of-line blocking that fair share (F10-30) and time-limit actions (F10-27) exist to relieve.

**F10-27. `jobStateTimeLimitActions` on a job queue cancels a job that has stayed at the head of the queue in `RUNNABLE` with a given `statusReason` for `maxTimeSeconds`, between 600 (10 minutes) and 86,400 (24 hours). `RUNNABLE` is the only state supported, and `CANCEL` the only action for ECS, EKS and Fargate queues (`TERMINATE` for SageMaker Training queues). Three reasons support it: `CAPACITY:INSUFFICIENT_INSTANCE_CAPACITY`, `MISCONFIGURATION:COMPUTE_ENVIRONMENT_MAX_RESOURCE` and `MISCONFIGURATION:JOB_RESOURCE_REQUIREMENT`.**
- Location: AWS Batch API Reference, "JobStateTimeLimitAction"; User Guide, "Automatic remediation with jobStateTimeLimitActions"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/APIReference/API_JobStateTimeLimitAction.html | Tier 1, first-party docs | definition | "Specifies an action that AWS Batch will take after the job has remained at the head of the queue in the specified state for longer than the specified time." and "The minimum value is 600 (10 minutes) and the maximum value is 86,400 (24 hours)." and "The state of the job needed to trigger the action. The only supported value is RUNNABLE." and "For job queues connected to a ECS, FARGATE or EKS compute environment, the only supported value is CANCEL, which will cancel the job." ; https://docs.aws.amazon.com/batch/latest/userguide/job_stuck_in_runnable_time_limit_actions.html | Tier 1, first-party docs | definition | "you can set the jobStateTimeLimitActions parameter to wait up to 4 hours for any job in the RUNNABLE state that is waiting for sufficient capacity to become available. You can do this by setting statusReason to CAPACITY:INSUFFICIENT_INSTANCE_CAPACITY and maxTimeSeconds to 14400 before cancelling the job and allowing the next job to advance to the head of the job queue." (accessed 2026-11-20)
- Use in dive: section 25, recommended configuration for a GPU queue: a time-limit action on the capacity reason, so that one job that asks for an unavailable type does not hold the queue for ever. A cancelled job emits an event (F10-63) that a workflow can use to resubmit elsewhere. The action cancels; it does not move the job to another queue.

**F10-28. The job queue snapshot (`GetJobQueueSnapshot`) returns the first 100 `RUNNABLE` jobs in the order the scheduler will take them: by submission time on a FIFO queue, "based on the job priority and share usage" on a fair-share queue. Since 13 February 2026 the snapshot also carries queue utilization, and for fair-share queues the capacity used per share; the console shows the top 20 active shares.**
- Location: AWS Batch User Guide, "View a job queue in AWS Batch"; What's New post "AWS Batch now provides Job Queue and Share Utilization Visibility" (Posted on: Feb 13, 2026)
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/job_queue_viewing_status.html | Tier 1, first-party docs | definition | "This section provides a static list of the first 100 RUNNABLE jobs that are in queue." and "For first-in-first-out (FIFO) job queues, the ordering of the jobs is based on the submission time. For fair-share scheduling job queues, the ordering of the jobs is based on the job priority and share usage." and "aws batch get-job-queue-snapshot --job-queue my-sm-training-fifo-jq" ; https://aws.amazon.com/about-aws/whats-new/2026/02/aws-batch-provides-job-queue-share-utilization/ | Tier 2, launch announcement | "This feature introduces queue utilization data in job queue snapshots, revealing compute capacity used by your first-in-first-out (FIFO) and fair share job queues, along with capacity consumption by individual fair share allocations." (accessed 2026-11-20)
- Use in dive: section 25, observability of the queue itself: the answer to "what runs next and who is using the GPUs".

**F10-29. Cancel and terminate are different. `CancelJob` applies to jobs that have not reached `STARTING`; `TerminateJob` stops a `STARTING` or `RUNNING` job, which goes to `FAILED`. Cancelled or terminated jobs are not retried. Since 17 September 2026 `CancelJobs`, `TerminateJobs` and `TerminateServiceJobs` take up to 50 job IDs per call.**
- Location: AWS Batch API Reference, "TerminateJob"; User Guide, "Automated job retries"; What's New post "AWS Batch now supports bulk job cancellation and termination" (Posted on: Sep 17, 2026)
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/APIReference/API_TerminateJob.html | Tier 1, first-party docs | definition | "Terminates a job in a job queue. Jobs that are in the STARTING or RUNNING state are terminated, which causes them to transition to FAILED. Jobs that have not progressed to the STARTING state are cancelled." ; https://docs.aws.amazon.com/batch/latest/userguide/job_retries.html | Tier 1, first-party docs | definition | "Jobs that are cancelled or terminated aren't retried." ; https://aws.amazon.com/about-aws/whats-new/2026/09/aws-batch-bulk-cancellation/ | Tier 2, launch announcement | "enabling you to cancel or terminate up to 50 jobs with a single API call" (accessed 2026-11-20)
- Use in dive: section 25, a 2026 feature and an operational fact: stopping a 500-child evaluation sweep is now 10 calls of 50, or one call on the array parent.

### C. Scheduling: who goes next

**F10-30. A queue with no scheduling policy is FIFO and stays FIFO: the API reference says such a queue "can't have a fair-share scheduling policy added", and a policy once attached "can be replaced but can't be removed". On a fair-share queue every job must carry a `shareIdentifier`; a queue can have at most 500 active share identifiers.**
- Location: AWS Batch API Reference, "CreateJobQueue", member `schedulingPolicyArn`; "SubmitJob", member `shareIdentifier`
- Verdict: NEW (adds the irreversibility and the 500 limit to F09-14)
- Evidence: https://docs.aws.amazon.com/batch/latest/APIReference/API_CreateJobQueue.html | Tier 1, first-party docs | documentation of a limit | "Job queues that don't have a fair-share scheduling policy are scheduled in a first-in, first-out (FIFO) model. After a job queue has a fair-share scheduling policy, it can be replaced but can't be removed." and "A job queue without a fair-share scheduling policy is scheduled as a FIFO job queue and can't have a fair-share scheduling policy added. Jobs queues with a fair-share scheduling policy can have a maximum of 500 active share identifiers." ; https://docs.aws.amazon.com/batch/latest/APIReference/API_SubmitJob.html | Tier 1, first-party docs | definition | "If the job queue has a fair-share scheduling policy, then this parameter must be specified." (accessed 2026-11-20)
- Use in dive: section 25, a decision to take when the queue is created, not later: FIFO or fair share is fixed at creation.

**F10-31. Fair share ranks share identifiers by recent usage. The scheduler tracks usage per share identifier as `(T * weightFactor)`, where T is vCPU usage over time, and "picks jobs with the lowest usage". `weightFactor` defaults to 1.0, ranges from 0.0001 to 999.9999, and lower means more compute. `shareDecaySeconds` is the look-back window: values under 600 become 600 (10 minutes) and the maximum is 604800 (1 week). Share identifiers are per queue and usage is not aggregated across queues.**
- Location: AWS Batch User Guide, "Use share identifiers to identify workloads"; API Reference, "FairsharePolicy" and "ShareAttributes"
- Verdict: NEW (the formula, ranges and the window; F04-51 holds the weight example)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/share-identifiers.html | Tier 1, first-party docs | definition | "The AWS Batch scheduler tracks usage for each share identifier by using the (T * weightFactor) formula, where T is the vCPU usage over time. The scheduler picks jobs with the lowest usage from the share identifier." and "Share identifiers are unique within a job queue and are not aggregated across job queues." ; https://docs.aws.amazon.com/batch/latest/APIReference/API_FairsharePolicy.html | Tier 1, first-party docs | definition | "A value less than 600, including zero (0), indicates the default minimum time window (600 seconds). The maximum supported value is 604800 (1 week)." ; https://docs.aws.amazon.com/batch/latest/APIReference/API_ShareAttributes.html | Tier 1, first-party docs | definition | "The smallest supported value is 0.0001, and the largest supported value is 999.9999." (accessed 2026-11-20)
- Use in dive: section 25, the fair-share formula with its decomposition: T is what a share has used, the weight scales it, the smallest product goes next. Usage is counted in vCPUs: `[our reading]` on a GPU queue the share that ran 8-vCPU single-GPU jobs and the share that ran 192-vCPU eight-GPU jobs are compared by vCPU, which tracks GPU count only roughly.

**F10-32. `computeReservation` (0 to 99) holds back part of the queue's maximum vCPUs for share identifiers that are not yet active. The reserved ratio is `(computeReservation/100)^ActiveFairShares`: a value of 50 reserves 50% with one active share, 25% with two and 12.5% with three; a value of 25 reserves 25%, 6.25% and 1.56%.**
- Location: AWS Batch API Reference, "FairsharePolicy", member `computeReservation`
- Verdict: NEW (the worked numbers; F09-14 has only the formula)
- Evidence: https://docs.aws.amazon.com/batch/latest/APIReference/API_FairsharePolicy.html | Tier 1, first-party docs | definition | "The reserved ratio is (computeReservation/100)^ActiveFairShares where ActiveFairShares is the number of active share identifiers." and "For example, a computeReservation value of 50 indicates that AWS Batch reserves 50% of the maximum available vCPU if there's only one share identifier. It reserves 25% if there are two share identifiers. It reserves 12.5% if there are three share identifiers. A computeReservation value of 25 indicates that AWS Batch should reserve 25% of the maximum available vCPU if there's only one share identifier, 6.25% if there are two fair share identifiers, and 1.56% if there are three share identifiers." and "The minimum value is 0 and the maximum value is 99." (accessed 2026-11-20)
- Use in dive: section 25, the worked example for the formula, in AWS's own numbers. `[derived]` check: (50/100)^2 = 0.25; (25/100)^3 = 0.015625, printed by AWS as 1.56%.

**F10-33. `schedulingPriority` (0 to 9999, set in the job definition or as `schedulingPriorityOverride` at submission) orders jobs inside one share identifier: higher goes first. It has no effect on a FIFO queue and no effect across share identifiers.**
- Location: AWS Batch API Reference, "SubmitJob", member `schedulingPriorityOverride`; User Guide, "Job definition parameters", "Scheduling priority"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/APIReference/API_SubmitJob.html | Tier 1, first-party docs | definition | "The scheduling priority for the job. This only affects jobs in job queues with a fair-share policy. Jobs with a higher scheduling priority are scheduled before jobs with a lower scheduling priority. This overrides any scheduling priority in the job definition and works only within a single share identifier." and "The minimum supported value is 0 and the maximum supported value is 9999." (accessed 2026-11-20)
- Use in dive: section 25, three levels of ordering to keep apart: queue `priority` (between queues), share usage (between share identifiers), `schedulingPriority` (inside one share).

**F10-34. Batch does not preempt container jobs. The docs say "Quota management is the only AWS Batch scheduling algorithm to incorporate preemption", and quota management "is only supported for job queues connected to a SAGEMAKER_TRAINING service environment". On an ECS or EKS queue a running job keeps its GPU until it exits, times out, is terminated or loses its Spot instance.**
- Location: AWS Batch User Guide, "Preemption" and "Quota management"
- Verdict: NEW (the explicit sentence behind F09-15's reading)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/preemption.html | Tier 1, first-party docs | documentation of a limit | "Quota management is the only AWS Batch scheduling algorithm to incorporate preemption, where AWS Batch stops a SCHEDULED, STARTING, or RUNNING job to create capacity for a RUNNABLE job." ; https://docs.aws.amazon.com/batch/latest/userguide/quota-management.html | Tier 1, first-party docs | documentation of a limit | "Quota management is only supported for job queues connected to a SAGEMAKER_TRAINING service environment." (accessed 2026-11-20)
- Use in dive: section 25 "what it does poorly" and the hand-off to sections 27 and 28 (HyperPod task governance and Kueue or KAI preempt pods; Batch container queues do not). Register 09 inferred this from two pages; today's page states it.

**F10-35. Quota management in detail (SageMaker Training queues only). A quota share is a virtual queue nested under the job queue; up to 20 per queue; each has 1 to 5 capacity limits expressed as instance counts of SageMaker Training instance types. Its idle capacity follows one of three strategies: `RESERVE`, `LEND`, or `LEND_AND_BORROW` with a borrow limit. Cross-share preemption returns lent capacity when the owner's jobs arrive; in-share preemption lets a higher-priority job displace a lower one. A preempted job goes back to `RUNNABLE` without limit unless `preemptionRetriesBeforeTermination` is set.**
- Location: AWS Batch User Guide, "Quota shares" and "Preemption"
- Verdict: NEW (field-level detail under F09-15)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/quota-shares.html | Tier 1, first-party docs | definition | "Quota shares are virtual queues that are nested under a job queue. A maximum of 20 can be attached to any job queue." and "a quota share requires at least one capacity limit be provided and supports a maximum of 5 capacity limits. Each capacity limit should be expressed as instance limits for supported SageMaker Training job instances types." and "If a quota share's idle compute can be lent to other quota shares, and jobs from the quota share should be allowed to borrow idle compute, select LEND_AND_BORROW with a configured borrow limit." ; https://docs.aws.amazon.com/batch/latest/userguide/preemption.html | Tier 1, first-party docs | definition | "The default is for preempted jobs to be re-queued as RUNNABLE without limit. To limit the number of preemptions a job experiences, set preemptionRetriesBeforeTermination on job submission. When preemptionRetriesBeforeTermination is set to 0, jobs go to FAILED on their first preemption." (accessed 2026-11-20)
- Use in dive: section 25, the SageMaker Training side of Batch, drawn as a second, smaller diagram: queue, quota shares, service environment, training jobs. Service jobs have one extra state, `SCHEDULED` (F10-60).

**F10-36. Consumable resources (resource-aware scheduling, launched 27 February 2025) let a job wait for a countable thing outside the compute environment. The user creates a named resource with a total count; a job definition asks for a quantity of up to 5 such resources; Batch starts the job only when all are free. It works with FIFO and fair-share queues, on ECS, EKS and Fargate, and with array and multi-node parallel jobs.**
- Location: AWS Batch User Guide, "Resource-aware scheduling"; What's New post "AWS Batch now supports resource aware scheduling" (Posted on: Feb 27, 2025)
- Verdict: NEW (the limit of 5 and the launch date; F04-52 holds the concept)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/resource-aware-scheduling.html | Tier 1, first-party docs | definition | "Batch keeps track of how many consumable resources are available for the jobs in your job queues and makes sure that a job is scheduled to run only when all the required consumable resources are available for the job to run successfully." and "Resource-aware scheduling is available for both FIFO and Fair-share scheduling policies and can be used with all compute platforms supported by Batch including EKS, ECS, and Fargate." ; https://aws.amazon.com/about-aws/whats-new/2025/02/aws-batch-resource-aware-scheduling/ | Tier 2, launch announcement | "you can associate up to 5 CRs with your AWS Batch jobs" and "consumable resources (CRs) such as third-party license tokens, database access bandwidth, budgetary limits, and more" (accessed 2026-11-20)
- Use in dive: section 25, a moving part with a robot-arm use `[our reading]`: a consumable resource named for the one physical arm, count 1, so that only one hardware-in-the-loop job runs at a time; or a count of simulator licence seats.

### D. Scaling: from zero and back

**F10-37. Batch scales a managed compute environment from the queue: it moves `desiredvCpus` "between the minimum and maximum values based on job queue demand", and for GPU jobs "you can specify the number of GPUs each job requires, and AWS Batch scales up instances accordingly". On EKS the docs call it "built-in scaling logic to scale Kubernetes nodes based on job queue load". No page read today publishes the scaling algorithm, an evaluation interval or a launch rate.**
- Location: AWS Batch API Reference, "ComputeResource", member `desiredvCpus`; User Guide, "Document history" (row "GPU scheduling") and "Amazon EKS compute environments"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/APIReference/API_ComputeResource.html | Tier 1, first-party docs | definition | "AWS Batch modifies this value between the minimum and maximum values based on job queue demand." ; https://docs.aws.amazon.com/batch/latest/userguide/document_history.html | Tier 1, first-party docs | documentation of support | "AWS Batch adds GPU scheduling. With this feature, you can specify the number of GPUs each job requires, and AWS Batch scales up instances accordingly." ; https://docs.aws.amazon.com/batch/latest/userguide/eks.html | Tier 1, first-party docs | definition | "AWS Batch has built-in scaling logic to scale Kubernetes nodes based on job queue load with optimizations in terms of job capacity allocations." (accessed 2026-11-20)
- Use in dive: section 25, animation step "scale from zero": the trigger is `RUNNABLE` jobs in the queue, summed by their vCPU, memory and GPU requests. The dive can say what triggers scaling; it cannot print how fast Batch reacts (U10-4).

**F10-38. Scale to zero is `minvCpus` 0: with an empty queue the compute environment holds no instances. A non-zero `minvCpus` keeps instances up with no jobs, even when the compute environment is `DISABLED`; the docs use it as a test trick ("This forces AWS Batch to scale up at least one instance without waiting for a job submission. Set minvCpus back to zero after testing to avoid unnecessary costs."). A `minvCpus` pool serves single-node jobs only: for a multi-node parallel job Batch "creates new instance capacity".**
- Location: AWS Batch User Guide, "Step 4: Verify and troubleshoot" (host-level logs tutorial) and "Managed compute environments"; API Reference, "ComputeResource", member `minvCpus`
- Verdict: NEW (the ECS-side statement; F09-13 quoted the EKS page)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/batch-host-logs-verify.html | Tier 1, first-party docs | definition | "To test log collection before a full rollout, set minvCpus to a non-zero value in your compute environment. This forces AWS Batch to scale up at least one instance without waiting for a job submission. Set minvCpus back to zero after testing to avoid unnecessary costs." ; https://docs.aws.amazon.com/batch/latest/userguide/managed_compute_environments.html | Tier 1, first-party docs | documentation of a limit | "if you specify a minvCpu value greater than zero then AWS Batch creates an instance pool for use with non-MNP jobs only. If a multi-node parallel job is submitted, AWS Batch creates new instance capacity to run the multi-node parallel jobs." and "AWS Batch recommends creating dedicated compute environments for running multi-node parallel (MNP) jobs and non-MNP jobs." (accessed 2026-11-20)
- Use in dive: section 25, the two ends of the gauge: 0 for cost, a small non-zero floor for latency. A warm pool does not shorten the start of a multi-node job.

**F10-39. Documented start-up timing is qualitative. A new EC2 instance takes "a few minutes" against "about 30 seconds" on Fargate (F09-1). On top of the launch, every user data script in the launch template "must finish before an instance can register with Amazon ECS and start running jobs", and the image pull is spent in `STARTING` (F10-24). Since 1 October 2026 two CloudWatch metrics measure it per queue: `JobAttemptRunnableToStartingDuration` (wait for capacity) and `JobAttemptStartingToRunningDuration` (image pull and container start).**
- Location: AWS Batch User Guide, "Common causes of jobs stuck in RUNNABLE without a statusReason" and "Using CloudWatch Metrics with AWS Batch"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/job_stuck_in_runnable_common_causes.html | Tier 1, first-party docs | documentation of a limit | "If your launch template includes a user data script that takes a long time to complete, instances can time out before they register with Amazon ECS." and "All user data scripts must finish before an instance can register with Amazon ECS and start running jobs." ; https://docs.aws.amazon.com/batch/latest/userguide/using_cloudwatch_metrics.html | Tier 1, first-party docs | definition | "JobAttemptRunnableToStartingDuration | The time a job attempt spent in RUNNABLE before it started. | Milliseconds" and "JobAttemptStartingToRunningDuration | The time a job attempt spent in STARTING before it began running. | Milliseconds" (accessed 2026-11-20)
- Use in dive: section 25, the honest cold-start line: three stacked waits (instance launch, user data, image pull) and the two metrics that let a reader measure their own. U09-1 stays open; these metrics are how to close it in a Tier 0 experiment.

**F10-40. `scalingPolicy.minScaleDownDelayMinutes` keeps each instance for a set time after its last job finishes: minimum 20, maximum 10080 (1 week), 0 to unset. The delay is per instance. It does not apply to instances replaced in an infrastructure update, to newly launched instances that have not yet run a job, or to "Spot instances reclaimed due to interruption". Idle instances held by the delay are billed.**
- Location: AWS Batch API Reference, "ComputeScalingPolicy"
- Verdict: NEW (the API definition and its three exclusions; F09-13 quoted the launch post)
- Evidence: https://docs.aws.amazon.com/batch/latest/APIReference/API_ComputeScalingPolicy.html | Tier 1, first-party docs | definition | "The minimum time (in minutes) that AWS Batch keeps instances running in the compute environment after their jobs complete. For each instance, the delay period begins when the last job finishes. If no new jobs are placed on the instance during this delay, AWS Batch terminates the instance once the delay expires." and "Valid Range: Minimum value of 20. Maximum value of 10080. Use 0 to unset and disable the scale down delay." and "Idle instances retained during the scale-down delay period are billable at standard EC2 pricing." and "The scale down delay does not apply to: Instances being replaced during infrastructure updates Newly launched instances that have not yet run any jobs Spot instances reclaimed due to interruption" (accessed 2026-11-20)
- Use in dive: section 25, animation step "scale down" and a snippet line. `[derived]`: 10080 minutes / 60 / 24 = 7 days. How long an instance stays when no delay is set is not stated on any page read today (U10-5).

**F10-41. Batch's own checklist for scale starts at "50 thousand or more vCPUs": check EC2 quotas ("Amazon EC2 Spot and Amazon On-Demand instances have separate quotas"), check the EBS quota (each instance has a gp2 or gp3 root volume against a default of 300 TiB per Region), prefer S3 for storage, and ramp up in steps. The page gives no instances-per-minute figure.**
- Location: AWS Batch User Guide, "Checklist to run at scale"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/bestpractice2.html | Tier 1, first-party docs | definition (guidance) | "Before you run a large workload on 50 thousand or more vCPUs, consider the following checklist." and "Remember that Amazon EC2 Spot and Amazon On-Demand instances have separate quotas." and "Each instance uses a GP2 or GP3 volume for the operating system. By default, the quota for each AWS Region is 300 TiB." and "Breaks might occur even when scaling from 1 thousand to 5 thousand vCPUs." (accessed 2026-11-20)
- Use in dive: section 25, limits. `[derived]`: 50,000 vCPUs is 12,500 four-vCPU g6.xlarge instances (50,000 / 4) or about 260 eight-GPU 192-vCPU instances (50,000 / 192 = 260.4); a robot arm's evaluation sweep is far below the scale at which AWS's checklist begins. The binding limit for GPU work is the account's EC2 quota for G and P instances, which is separate for Spot and On-Demand.

**F10-42. Batch says which jobs it suits badly. Jobs of a few seconds: "the overhead to schedule the batch job might take longer than the runtime of the job itself"; the advice is to pack tasks so that each job runs 3 to 5 minutes. Jobs that must start at once: "AWS Batch is a scheduler and optimizes for cost performance, job priority, and throughput", and for a response "in under a few seconds" the docs point to a service on ECS or EKS.**
- Location: AWS Batch User Guide, "When to use AWS Batch"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/bestpractice1.html | Tier 1, first-party docs | definition (guidance) | "If a job runs for only a few seconds, the overhead to schedule the batch job might take longer than the runtime of the job itself. As a workaround, binpack your tasks together before you submit them in AWS Batch." and "Consider grouping tasks so the jobs run 3-5 minutes each." and "AWS Batch is a scheduler and optimizes for cost performance, job priority, and throughput. AWS Batch might require time to process your requests. If you need a response in under a few seconds, then a service-based approach using Amazon ECS or Amazon EKS is more suitable." (accessed 2026-11-20)
- Use in dive: section 25 "what it does poorly" and the sizing rule for the arm's evaluation sweep `[our reading]`: one array child should hold enough episodes to run 3 to 5 minutes or more (a single 20-second rollout per child wastes the scheduler), and stay under 30 minutes on Spot (F09-11).

### E. Jobs: what is submitted

**F10-43. A job definition is the template of a job: `type` (`container` or `multinode`), then exactly one way of describing the containers: `containerProperties` (one container, the older form), `ecsProperties` (one or more containers), `eksProperties` (a pod) or `nodeProperties` (a multi-node job), plus top-level `retryStrategy`, `timeout`, `schedulingPriority`, `parameters` and `platformCapabilities`. The definition is limited to 24 KiB and a `SubmitJob` payload to 30 KiB.**
- Location: AWS Batch User Guide, "Job definition parameters for ContainerProperties", "Create job definitions using EcsProperties" and "Resource: AWS Batch service quotas"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/multi-container-jobs.html | Tier 1, first-party docs | definition | "The legacy job definition structure, using ContainerProperties, remains supported. If you currently have workflows using this structure, you can continue to run them." ; https://docs.aws.amazon.com/batch/latest/userguide/job_definition_parameters.html | Tier 1, first-party docs | definition | "If the job runs on Amazon EKS resources, then you must not specify nodeProperties." and "Any retry strategy that's specified during a SubmitJob operation overrides the retry strategy defined here." ; https://docs.aws.amazon.com/batch/latest/userguide/service_limits.html | Tier 1, first-party docs | documentation of a limit | "Maximum job definition size (for RegisterJobDefinition API operations) | 24 KiB" and "Maximum job payload size (for SubmitJob API operations) | 30 KiB" (accessed 2026-11-20)
- Use in dive: section 25, the job definition as a moving part: what is fixed in the template and what a submission may override (retry strategy, timeout, resource requirements, parameters).

**F10-44. A job asks for GPUs as whole devices. `resourceRequirements` type `GPU` is "The number of physical GPUs to reserve for the container", and the total for a job cannot exceed the GPUs on the instance. On EKS the request is `nvidia.com/gpu` in the pod's limits and the docs state: "resource value that you set must be a whole number. You can't use fractions of GPU." The Batch user guide and API reference pages read today contain no mention of time-slicing, MPS or MIG.**
- Location: AWS Batch User Guide, "Job definition parameters for ContainerProperties" (`resourceRequirements`) and "Create an Amazon EKS GPU job definition"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/job_definition_parameters.html | Tier 1, first-party docs | definition | "The number of physical GPUs to reserve for the container. The number of GPUs reserved for all containers in a job cannot exceed the number of available GPUs on the compute resource that the job is launched on." and "\"resourceRequirements\" : [ { \"type\": \"GPU\", \"value\": \"{{number}}\" } ]" ; https://docs.aws.amazon.com/batch/latest/userguide/create-eks-gpu-job-definition.html | Tier 1, first-party docs | documentation of a limit | "Only nvidia.com/gpu is supported at this time and resource value that you set must be a whole number. You can't use fractions of GPU." (accessed 2026-11-20)
- Use in dive: section 25 "what it does poorly" and the hand-off to section 28: a curation stage that needs 0.25 of a 48 GB GPU per model (F05-71) cannot be expressed in Batch; the Batch way is one whole GPU per job with several models run inside the container. How the absence was checked: a search of all 326 user guide pages and the API pages for "time-slic", "fractional", "MIG", "MPS" and "multi-instance GPU" returned no page.

**F10-45. `linuxParameters` carries the settings a PyTorch dataloader and a simulator need on EC2-backed jobs: `sharedMemorySize` is "the size (in MiB) of the /dev/shm volume" and maps to Docker's `--shm-size`; `devices` passes host devices into the container (the EFA device in F09-9 uses it). None of this applies on Fargate.**
- Location: AWS Batch User Guide, "Job definition parameters for ContainerProperties", `linuxParameters`
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/job_definition_parameters.html | Tier 1, first-party docs | definition | "The value for the size (in MiB) of the /dev/shm volume. This parameter maps to the --shm-size option to docker run." and "This parameter isn't applicable to jobs that run on Fargate resources." (accessed 2026-11-20)
- Use in dive: section 25, a snippet line for the fine-tune job definition: dataloader workers pass tensors through `/dev/shm`, so a training job sets `sharedMemorySize` `[our reading]`. The docs give no default value on this page; Docker's own default applies and is not quoted here.

**F10-46. The job timeout in full: `attemptDurationSeconds` counts from the attempt's `startedAt` (so `STARTING` is outside it), the minimum is 60 seconds and there is no maximum; at expiry the container gets SIGTERM and, 30 seconds later, SIGKILL; a timed-out job "isn't retried", while an attempt that fails by itself restarts the countdown on the next attempt. For a multi-node parallel job the timeout covers the whole job. Terminations are best effort and, when many jobs time out together, are processed first in, first out, in batches.**
- Location: AWS Batch User Guide, "Job timeouts"; "Job definition parameters", "Timeout"
- Verdict: NEW (extends F04-50 with the countdown restart, the MNP rule and the best-effort note)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/job_timeouts.html | Tier 1, first-party docs | definition | "On the compute resource, your job's container receives a SIGTERM signal to give your application a chance to shut down gracefully. If the container is still running after 30 seconds, a SIGKILL signal is sent to forcefully shut down the container." and "There's no maximum timeout value for an AWS Batch job." and "If a job is terminated for exceeding the timeout duration, it isn't retried. If a job attempt fails on its own, then it can retry if retries are enabled, and the timeout countdown is started over for the new attempt." and "Timeout terminations are handled on a best-effort basis." ; https://docs.aws.amazon.com/batch/latest/userguide/job_definition_parameters.html | Tier 1, first-party docs | definition | "For multi-node parallel (MNP) jobs, the timeout applies to the whole job, not to the individual nodes." (accessed 2026-11-20)
- Use in dive: section 25, recommended configuration: every job definition carries a timeout, because the default is none. The SIGTERM-then-30-seconds sequence is documented for the timeout; it is the only place the Batch guide documents a signal to the container.

**F10-47. `ecsProperties` lets one job run several containers, and the docs pitch it at simulation: "you can model hardware, sensors, 3D environments and other simulations in separate containers". It works on ECS, EKS and Fargate. ECS Managed Instances job definitions must use `ecsProperties` with `platformCapabilities` set to `MANAGED_INSTANCES`.**
- Location: AWS Batch User Guide, "Create job definitions using EcsProperties" and "Tutorial: Create a managed compute environment using Amazon ECS Managed Instances", "Next steps"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/multi-container-jobs.html | Tier 1, first-party docs | definition | "With AWS Batch job definitions using EcsProperties, you can model hardware, sensors, 3D environments and other simulations in separate containers. You can use this feature to logically organize your workload components, and separate them from the main application. This feature can be used with AWS Batch on Amazon Elastic Container Service (Amazon ECS), Amazon Elastic Kubernetes Service (Amazon EKS), and AWS Fargate." ; https://docs.aws.amazon.com/batch/latest/userguide/create-compute-environment-ecs-managed-instances.html | Tier 1, first-party docs | definition | "Create a job definition with platformCapabilities set to MANAGED_INSTANCES and using ecsProperties." (accessed 2026-11-20)
- Use in dive: section 25, the worked case for closed-loop evaluation `[our reading]`: one job with a simulator container and a policy-server container, which is the multi-container reason AWS's own embodied AI post gives for choosing Batch (F09-114).

**F10-48. Dependencies. A job can depend on up to 20 other jobs; it waits in `PENDING` and goes straight to `FAILED` if a dependency fails. Array jobs add two dependency types: `SEQUENTIAL` (no job ID; children run one after another from index 0) and `N_TO_N` (with a job ID; child i waits for child i of the other array). Since 3 February 2026 `ListJobs` returns a `statusSummary` with the count of children in each state.**
- Location: AWS Batch User Guide, "Job dependencies" and "Array jobs"; What's New post "AWS Batch now provides Array Job Status Summary in ListJobs API" (Posted on: Feb 3, 2026)
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/job_dependencies.html | Tier 1, first-party docs | definition | "If any of the job dependencies fail, the dependent job automatically transitions from PENDING to FAILED." and "Job A can express a dependency on up to 20 other jobs that must succeed before it can run." and "For array jobs, you can specify a SEQUENTIAL type dependency without specifying a job ID so that each child array job completes sequentially, starting at index 0. You can also specify an N_TO_N type dependency with a job ID. That way, each index child of this job must wait for the corresponding index child of each dependency to complete before it can begin." ; https://aws.amazon.com/about-aws/whats-new/2026/01/aws-batch-array-job-status-summary/ | Tier 2, launch announcement | "the response now includes a statusSummary field that shows the count of child jobs in each state: SUBMITTED, PENDING, RUNNABLE, STARTING, RUNNING, SUCCEEDED, and FAILED" (accessed 2026-11-20)
- Use in dive: section 25, the worked case as a small graph `[our reading]`: array A decodes shard i, array B embeds shard i with `N_TO_N` on A; a fine-tune job, then an evaluation array that depends on the fine-tune job. Dependencies give Batch a pipeline without a workflow service, with one caution: a failed dependency fails everything downstream.

**F10-49. A multi-node parallel job is described by `nodeProperties`: `numNodes`, `mainNode` (an index) and `nodeRangeProperties`, each with `targetNodes` (a range such as `0:3`) and a `container`. Limits: up to five node groups, up to 1,000 nodes in a job ("the default limit for instances in an Amazon ECS cluster"), and "all node groups in a multi-node parallel job must use the same instance type". If the job definition names an `instanceType`, the compute environment must be able to launch it.**
- Location: AWS Batch User Guide, "Node groups", "Job definition parameters" (`nodeProperties`) and "Compute environment considerations for MNP"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/mnp-node-groups.html | Tier 1, first-party docs | documentation of a limit | "You can use AWS Batch to specify up to five distinct node groups for each job." and "You can have up to 1,000 nodes in a single job. This is the default limit for instances in an Amazon ECS cluster." and "Currently all node groups in a multi-node parallel job must use the same instance type." ; https://docs.aws.amazon.com/batch/latest/userguide/mnp-ce.html | Tier 1, first-party docs | documentation of a limit | "If you specify an instance type for a node group in a multi-node parallel job, your compute environment must launch that instance type." (accessed 2026-11-20)
- Use in dive: section 25, the multi-node job as a moving part, with the docs' own example block (two p3.2xlarge nodes, Block for F10-49).

**F10-50. The life of a multi-node job: the main node launches first and reaches `RUNNING`; only then are the child nodes launched, "in random order", each reading the main node's address from `AWS_BATCH_JOB_MAIN_NODE_PRIVATE_IPV4_ADDRESS`. When the main node exits the job is finished and all children are stopped. "If a child node dies, AWS Batch doesn't take any action on the other nodes in the job": the application must notice and end the job.**
- Location: AWS Batch User Guide, "Job lifecycle for MNP jobs"
- Verdict: NEW (the ordering and the child-failure rule; F09-7 has the retry rule)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/job-lifecycle.html | Tier 1, first-party docs | definition | "The main node is launched first and it moves to the STARTING status." and "When the main node reaches the RUNNING status after the node's container is running, the child nodes are launched and they also move to the STARTING status. The child nodes come up in random order. There are no guarantees on the timing or ordering of child node launch." and "If the main node exits, the job is considered finished, and all of the child nodes are stopped. If a child node dies, AWS Batch doesn't take any action on the other nodes in the job. If you don't want your job to continue with a reduced number of nodes, you must factor this into your application code." (accessed 2026-11-20)
- Use in dive: section 25, the second animation (a gang of nodes) and "what it does poorly": no node replacement inside a running job, where HyperPod replaces nodes (F09-23). A distributed training launcher on Batch must treat a lost worker as fatal and restart from a checkpoint.

**F10-51. Multi-node jobs use the ECS `awsvpc` network mode: each node's container gets its own network interface and private address, with no public address, so the compute environment must sit in private subnets behind a NAT gateway. The compute environment may have at most five security groups, and security groups in a launch template are not used for these jobs.**
- Location: AWS Batch User Guide, "Compute environment considerations for MNP with AWS Batch"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/mnp-ce.html | Tier 1, first-party docs | documentation of a limit | "AWS Batch multi-node parallel jobs use the Amazon ECS awsvpc network mode, which gives your multi-node parallel job containers the same networking properties as Amazon EC2 instances." and "Your compute environment might have no more than five security groups associated with it." and "Unlike regular AWS Batch jobs, multi-node parallel jobs do not use security groups specified in launch templates." and "Multi-node parallel jobs that run on compute resources within public subnets don't have outbound network access." (accessed 2026-11-20)
- Use in dive: section 25, the networking line of the multi-node configuration, beside the placement group and EFA facts in F09-8 and F09-9.

**F10-52. Retry semantics. An attempt begins when the job is placed into `RUNNING`. `attempts` is 1 to 10 and the default is one attempt, no retry. `evaluateOnExit` holds up to 10 rules that match on `onStatusReason`, `onReason` or `onExitCode` (glob patterns up to 512 characters that may end in `*`) with action `RETRY` or `EXIT`; when no rule matches, "the job is retried", which is why the documented patterns end with a catch-all `EXIT`. `AWS_BATCH_JOB_ATTEMPT` starts at 1.**
- Location: AWS Batch User Guide, "Automated job retries"; "Job definition parameters", "Retry strategy"
- Verdict: NEW (the matching rules and the default-on-no-match; F09-10 has the Spot pattern)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/job_retries.html | Tier 1, first-party docs | definition | "When a job is submitted to a job queue and placed into the RUNNING state that's considered an attempt. By default, each job is given one attempt to move to either the SUCCEEDED or FAILED job state." and "If evaluateOnExit is specified, it can contain up to 10 retry strategies. If evaluateOnExit is specified, but none of the retry strategies match, then the job is retried. For jobs that don't match to exit, add a final entry that exits for any reason." and "The first attempt is numbered 1, and subsequent attempts are in ascending order (for example, 2, 3, 4)." ; https://docs.aws.amazon.com/batch/latest/userguide/job_definition_parameters.html | Tier 1, first-party docs | definition | "Contains a glob pattern to match against the StatusReason that's returned for a job. The pattern can be up to 512 characters in length." and "Specifies the action to take if all of the specified conditions (onStatusReason, onReason, and onExitCode) are met. The values aren't case sensitive." (accessed 2026-11-20)
- Use in dive: section 25, the retry snippet explained field by field. The page's own example retries on `onReason` "AGENT" and on `onStatusReason` "Task failed to start" (Block for F10-52), two infrastructure causes worth adding beside `Host EC2*`.

**F10-53. How many attempts AWS suggests: "You can set up to 10 automated retries. For a start, we recommend that you set at least 1-3 automated retries." The Spot example on the same page uses 5; a 2026 AWS post that runs GPU inference on Spot uses 2. A retried job is placed "at the front of the job queue".**
- Location: AWS Batch User Guide, "Use Amazon EC2 Spot best practices for AWS Batch"; AWS Machine Learning blog, "Cost-effective multilingual audio transcription at scale with Parakeet-TDT and AWS Batch", 22 APR 2026
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/bestpractice6.html | Tier 1, first-party docs | definition (guidance) | "You can set up to 10 automated retries. For a start, we recommend that you set at least 1-3 automated retries." and "For AWS Batch, if you set the retry parameter, the job is placed at the front of the job queue. That is, the job is given priority." ; https://aws.amazon.com/blogs/machine-learning/cost-effective-multilingual-audio-transcription-at-scale-with-parakeet-tdt-and-aws-batch/ | Tier 2, first-party blog | production report | "If an instance is reclaimed, AWS Batch automatically retries the job (configured with up to 2 retry attempts in the job definition)." (accessed 2026-11-20)
- Use in dive: section 25, the number in the recommended retry strategy and the animation step "requeue": the interrupted job re-enters `RUNNABLE` ahead of jobs that were already waiting.

### F. A Spot interruption, end to end

**F10-54. The notice. EC2 issues a Spot Instance interruption notice "two minutes before Amazon EC2 stops or terminates your Spot Instance", as an EventBridge event (`EC2 Spot Instance Interruption Warning`) and in the instance metadata on the instance; EC2 recommends checking "every 5 seconds", and notices "are emitted on a best effort basis". By default an interrupted Spot Instance is terminated.**
- Location: Amazon EC2 User Guide, "Spot Instance interruption notices" and "Behavior of Spot Instance interruptions"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html | Tier 1, first-party docs | definition | "A Spot Instance interruption notice is a warning that is issued two minutes before Amazon EC2 stops or terminates your Spot Instance." and "We recommend that you check for these interruption notices every 5 seconds." and "The interruption notices are made available as an EventBridge event and as items in the instance metadata on the Spot Instance. Interruption notices are emitted on a best effort basis." and "\"detail-type\": \"EC2 Spot Instance Interruption Warning\"" ; https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/interruption-behavior.html | Tier 1, first-party docs | definition | "The default behavior is that Amazon EC2 terminates Spot Instances when they are interrupted." (accessed 2026-11-20)
- Use in dive: section 25, animation step "Spot notice": a two-minute timer on one instance. "Best effort" means a job design cannot assume the full two minutes.

**F10-55. What Batch does on the notice. For compute environments on ECS created or updated from 9 October 2026, Spot Instance draining is on: the container instance goes to `DRAINING`, which "allows existing jobs to continue but prevents new jobs from being placed on the instance". The ECS guide and the ECS agent's own table still give the agent default as off (`ECS_ENABLE_SPOT_INSTANCE_DRAINING` default `false` in agent v1.108.3), so the Batch default is something Batch sets, and a compute environment untouched since before 9 October 2026 may not have it.**
- Location: AWS Batch User Guide, "Use Amazon EC2 Spot best practices for AWS Batch"; Amazon ECS Developer Guide, "Configuring Amazon ECS Linux container instances to receive Spot Instance notices"; aws/amazon-ecs-agent README at v1.108.3
- Verdict: NEW (sharpens F09-12 with the ECS-side default and what it implies for older compute environments)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/bestpractice6.html | Tier 1, first-party docs | documentation of support | "Enable Amazon ECS Spot Instance draining (default for new or updated compute environments as of October 9, 2026) - For compute environments that use Amazon ECS and Spot Instances, AWS Batch enables Spot Instance draining by default." and "You can override this default by setting ECS_ENABLE_SPOT_INSTANCE_DRAINING=false in your launch template user data." ; https://docs.aws.amazon.com/AmazonECS/latest/developerguide/spot-instance-draining-linux-container.html | Tier 1, first-party docs | definition | "Spot Instance draining is turned off by default." and "Amazon ECS does not receive a notice from Amazon EC2 when instances are removed by Auto Scaling Capacity Rebalancing." ; https://github.com/aws/amazon-ecs-agent/blob/51cd882c8ea69d61d659378b1fb0b7fe585d6915/README.md | Tier 1, source at a pinned ref | code behaviour | "| ECS_ENABLE_SPOT_INSTANCE_DRAINING | true | Whether to enable Spot Instance draining for the container instance." with default columns "false | false" (accessed 2026-11-20)
- Use in dive: section 25, animation: the noticed instance turns "draining" and takes no new job. No What's New post for the 9 October 2026 change was found; the Batch best-practices page is the only source for the date (U10-6).

**F10-56. What the running container sees during the two minutes is not specified by Batch. Draining does not stop it: on ECS, standalone tasks on a draining instance "are unaffected" and "continue running". No page read today says that Batch or ECS sends SIGTERM to a job's container when the Spot notice arrives. The only signal sequence the Batch guide documents is the timeout's (SIGTERM, then SIGKILL after 30 seconds, F10-46); the ECS agent's stop timeout, the wait between the two signals when the agent stops a container, defaults to 30 seconds (`ECS_CONTAINER_STOP_TIMEOUT`).**
- Location: Amazon ECS Developer Guide, "Draining Amazon ECS container instances"; aws/amazon-ecs-agent README at v1.108.3
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/container-instance-draining.html | Tier 1, first-party docs | definition | "Any standalone tasks in the PENDING or RUNNING state are unaffected; you must wait for them to stop on their own or stop them manually. The container instance will remain in DRAINING status." and "Standalone tasks continue running because they might complete naturally." ; https://github.com/aws/amazon-ecs-agent/blob/51cd882c8ea69d61d659378b1fb0b7fe585d6915/README.md | Tier 1, source at a pinned ref | code behaviour | "| ECS_CONTAINER_STOP_TIMEOUT | 10m | Instance scoped configuration for time to wait for the container to exit normally before being forcibly killed. | 30s | 30s |" (accessed 2026-11-20)
- Use in dive: section 25, the most important design consequence of the animation `[our reading]`: a Batch job on Spot must not wait to be told. Either it checkpoints on a timer (so at most one interval is lost), or the container itself polls the instance metadata every 5 seconds (F10-54) and writes a checkpoint when the notice appears. That Batch jobs are ECS standalone tasks is our reading of F10-1 and F10-24 ("running as a container job on an Amazon ECS container instance"); whether the container receives SIGTERM at instance termination is U10-7.

**F10-57. `[our reading]` After the two minutes. The instance is terminated; the attempt fails with a status reason that begins `Host EC2` (the pattern AWS's retry example matches); with attempts left the job returns to `RUNNABLE`, at the front of the queue; Batch launches replacement capacity through the allocation strategy; the new attempt starts with `AWS_BATCH_JOB_ATTEMPT` one higher. The scale-down delay never keeps a reclaimed instance.**
- Location: synthesis of F09-10, F10-24, F10-40, F10-52, F10-53
- Verdict: NEW
- Evidence: F09-10, F10-24, F10-40, F10-52, F10-53 | `[our reading]` of five first-party statements placed in order; the exact text of the status reason beyond the `Host EC2*` pattern is not printed on any Batch page read today
- Use in dive: section 25, animation steps "attempt fails", "requeue", "replacement instance", "resume from checkpoint". The full status-reason string is U10-8.

**F10-58. What AWS says about checkpoints and job length on Spot, with numbers. Batch guide: avoid Spot jobs of an hour or more; parts of 30 minutes or less (F09-11). A 4 August 2026 AWS HPC post on checkpointed Spot (run under Slurm, not Batch) reports, with three injected interruptions: a 3 hour 25 minute STAR-CCM+ job took 3 hours 54 minutes (14% longer) for a 55% lower job cost, with 141 seconds per checkpoint and an average recovery of 8 minutes; a GROMACS job checkpointing every 20 minutes took 27% longer for 58% lower cost `[vendor claim]`. Its rule: checkpoint time "should be significantly shorter than the run time between checkpoints".**
- Location: AWS HPC blog, "Resilient HPC and ML on AWS: Running Tightly Coupled Workloads on Spot Instances", 04 AUG 2026
- Verdict: NEW
- Evidence: https://aws.amazon.com/blogs/hpc/resilient-hpc-and-ml-on-aws-running-tightly-coupled-workloads-on-spot-instances/ | Tier 2, first-party blog | benchmark claim (vendor reported) | "The original simulation took 3 hours 25 mins on On-Demand instances. Running with Spot pricing and checkpointing every 1000 iterations (needing only 141 seconds for each checkpointing save with FSx for Lustre enabling parallel input/output with STAR-CCM+), increased the runtime to 3 hours 54 mins - a 14% wall-time overhead. Despite this overhead, the 61% Spot discount at run time still delivered a 55% reduction in job cost. Across the 3 injected Spot interruptions, the average recovery time was 8 minutes" and "only a 48 mins (27%) increase in runtime (from 2:11 hours to 2:59 hours) while delivering 58% cost savings" and "The time required to save checkpoints should be significantly shorter than the run time between checkpoints to minimize overhead." (accessed 2026-11-20)
- Use in dive: section 25 (and 26, since the post's scheduler is Slurm): the shape of the Spot trade for a multi-hour job, in AWS's numbers. The interruptions were injected, three per run; this is not an observed interruption rate.

**F10-59. A complete first-party GPU Spot configuration for Batch from 2026: allocation strategy `SPOT_PRICE_CAPACITY_OPTIMIZED`, type `SPOT`, three interchangeable single-GPU types (g6.xlarge, g6.2xlarge, g5.xlarge), `MinvCpus` 0, image type `ECS_AL2023_NVIDIA`, 2 retry attempts, jobs submitted by an EventBridge rule on S3 upload. The post ran 1,000 files on 100 g6.xlarge instances and gives the reason the workload suits Spot: the jobs "are stateless and idempotent".**
- Location: AWS Machine Learning blog, "Cost-effective multilingual audio transcription at scale with Parakeet-TDT and AWS Batch", 22 APR 2026
- Verdict: NEW
- Evidence: https://aws.amazon.com/blogs/machine-learning/cost-effective-multilingual-audio-transcription-at-scale-with-parakeet-tdt-and-aws-batch/ | Tier 2, first-party blog | production report | "DefaultComputeEnv: Type: AWS::Batch::ComputeEnvironment Properties: Type: MANAGED State: ENABLED ComputeResources: AllocationStrategy: SPOT_PRICE_CAPACITY_OPTIMIZED Type: SPOT BidPercentage: 100 InstanceTypes: - \"g6.xlarge\" - \"g6.2xlarge\" - \"g5.xlarge\" MinvCpus: !Ref DefaultCEMinvCpus MaxvCpus: !Ref DefaultCEMaxvCpus # ... remaining configuration unchanged" and "Diversifying instance types (G6 xlarge, G6 2xlarge, G5 xlarge) can improve Spot availability. Setting MinvCpus: 0 makes sure the environment scales to zero when idle" and "Since ASR jobs are stateless and idempotent, they are well-suited for Spot." and "This triggers an Amazon EventBridge rule that submits a job to AWS Batch." and "distributed across 100 g6.xlarge instances processing 10 files each" (accessed 2026-11-20)
- Use in dive: section 25, the recommended Spot configuration has a first-party precedent on GPUs: same strategy, a list of same-memory single-GPU types, floor at zero. The workload is speech transcription, not robotics; the configuration pattern is what transfers. The post prints prices; they are not copied here.

### G. Batch on EKS, SageMaker Training queues, storage, observability, limits

**F10-60. Batch in front of SageMaker Training (service environments and service jobs). A service job passes through one state container jobs lack, `SCHEDULED`: "Service job successfully submitted to SageMaker AI", while SageMaker acquires instances; `STARTING` then means the training job is downloading data and images. A service environment's capacity is a number of instances; an account can hold 50 service environments, one per job queue; a service job can have up to 10 attempts.**
- Location: AWS Batch User Guide, "Mapping AWS Batch service job status to SageMaker AI status", "What are service environments in AWS Batch" and "Resource: AWS Batch service quotas"
- Verdict: NEW (the state mapping and the capacity unit under F09-16)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/service-job-status.html | Tier 1, first-party docs | definition | "| SCHEDULED | InProgress | Pending | Service job successfully submitted to SageMaker AI |" and "| STARTING | InProgress | Downloading | SageMaker Training job downloading data and images. Training job capacity has been acquired and job initialization begins. |" ; https://docs.aws.amazon.com/batch/latest/userguide/what-are-service-environments.html | Tier 1, first-party docs | definition | "Each service environment has a maximum capacity limit expressed in number of instances, which directly controls how many SageMaker Training jobs can run concurrently." and "You can create up to 50 service environments per account, with each job queue supporting only one associated service environment." ; https://docs.aws.amazon.com/batch/latest/userguide/service_limits.html | Tier 1, first-party docs | documentation of a limit | "Maximum number of attempts with retry strategy for a service job | 10" (accessed 2026-11-20)
- Use in dive: section 25, the SageMaker Training path as a second lifecycle: SUBMITTED, RUNNABLE, SCHEDULED, STARTING, RUNNING, SUCCEEDED or FAILED. Here Batch owns no instances at all: it is a queue and a quota system, and SageMaker owns the machines.

**F10-61. Batch on EKS, the objects. Batch turns each job into a pod spec and creates pods on nodes it launches into the user's cluster; it deletes the pod when the job ends. Its nodes carry a taint with key `batch.amazonaws.com/batch-node`, so only pods that tolerate it (Batch's own, or a DaemonSet the user writes) land there. Limits: 5 compute environments per EKS cluster; for multi-node jobs on EKS, up to 1000 instances per job and one instance type per job. Access entry authentication (5 October 2026) is the recommended way for Batch to reach the cluster. ECS Managed Instances is not available for EKS compute environments.**
- Location: AWS Batch User Guide, "Amazon EKS compute environments", "Run a DaemonSet on AWS Batch managed nodes", "Running MNP jobs" (EKS); What's New post "AWS Batch now supports Amazon EKS access entry authentication" (Posted on: Oct 5, 2026)
- Verdict: NEW (adds the taint key, pod deletion, MNP-on-EKS limits and access entries to F09-19)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/eks.html | Tier 1, first-party docs | definition | "AWS Batch translates jobs into podspecs and then creates the requests to place pods on nodes managed by AWS Batch in your Amazon EKS cluster." and "When a pod has completed its execution, AWS Batch deletes the pod it created to maintain a lower load on the Kubernetes system." and "AWS Batch can authenticate to your Amazon EKS cluster through either aws-auth ConfigMap or the Amazon EKS access entry API (recommended)." ; https://docs.aws.amazon.com/batch/latest/userguide/daemonset-on-batch-eks-nodes.html | Tier 1, first-party docs | definition | "tolerations: - key: \"batch.amazonaws.com/batch-node\" operator: \"Exists\"" ; https://docs.aws.amazon.com/batch/latest/userguide/mnp-eks-running-mnp-jobs.html | Tier 1, first-party docs | documentation of a limit | "Up to 1000 instances can be used for a single MNP job." and "You can use only one instance type in each MNP job." ; https://docs.aws.amazon.com/batch/latest/userguide/ecs_managed_instances.html | Tier 1, first-party docs | documentation of a limit | "AWS Batch does not support Amazon ECS Managed Instances for Amazon EKS compute environments." ; https://aws.amazon.com/about-aws/whats-new/2026/10/aws-batch-access-entries/ | Tier 2, launch announcement | "AWS Batch creates one access entry per cluster and associates the AWSBatchClusterPolicy with it." (accessed 2026-11-20)
- Use in dive: sections 25 and 28, the overlay drawn: one EKS control plane, a fenced group of Batch nodes (tainted), other node groups beside them. The What's New post is dated Oct 5, 2026; the document history row for the same feature says October 1, 2026.

**F10-62. Storage a Batch job can mount, by mechanism. In the job definition: a host path (`volumes[].host.sourcePath`), an Amazon EFS file system (`efsVolumeConfiguration`, with access points and IAM authorisation) and, for compute environments created after 19 June 2026, an S3 Files volume (`s3filesVolumeConfiguration`), which presents an S3 bucket as a file system over NFS port 2049 on Fargate, EC2 and ECS Managed Instances. Through the launch template's user data, then a host path: FSx for Lustre (the docs print the mount script) and Mountpoint for Amazon S3 (a January 2026 AWS post prints the install-and-mount commands). On EKS: a `persistentVolumeClaim`.**
- Location: AWS Batch User Guide, "Amazon EFS volumes", "Amazon S3 Files volumes", "Reference: Amazon EC2 launch template examples"; AWS HPC blog, "Optimize Nextflow Workflows on AWS Batch with Mountpoint for Amazon S3", 13 JAN 2026
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/s3files-volumes.html | Tier 1, first-party docs | documentation of support | "You can use S3 Files volumes with Fargate, Amazon EC2, and Amazon ECS Managed Instances compute environments." and "Any Amazon EC2 compute environment created after June 19 2026 includes this support by default." and "The mount target security group must allow inbound NFS traffic (TCP port 2049) from the compute environment security group." ; https://docs.aws.amazon.com/batch/latest/userguide/launch-template-examples.html | Tier 1, first-party docs | documentation of support | "This example MIME multi-part file configures the compute resource to install the lustre2.10 package from the Extras Library and mount an existing FSx for Lustre file system at /scratch and a mount name of fsx. This example is for Amazon Linux 2." ; https://docs.aws.amazon.com/batch/latest/userguide/efs-volumes.html | Tier 1, first-party docs | documentation of support | "You can use Amazon EFS file systems with AWS Batch to export file system data across your fleet of container instances. That way, your jobs have access to the same persistent storage." ; https://aws.amazon.com/blogs/hpc/optimize-nextflow-workflows-on-aws-batch-with-mountpoint-for-amazon-s3/ | Tier 2, first-party blog | documentation of support | "In the User Data section add the bash commands that will install the Mountpoint client and mount your S3 bucket" (accessed 2026-11-20)
- Use in dive: section 25, the storage row of the drawing: checkpoints on EFS or S3 (they must outlive the instance), datasets from S3 through S3 Files or Mountpoint, scratch on the instance. The FSx for Lustre script in the docs targets Amazon Linux 2, which is no longer the default image (F10-13); the dive should say the Lustre client install line needs the Amazon Linux 2023 form and not print the old one as current. Instance store volumes are not described on the EC2 compute environment pages read today (for ECS Managed Instances there is `localStorageConfiguration.useLocalStorage`, F10-17 source page); see U10-9.

**F10-63. Batch and events. Every job state change after submission emits a `Batch Job State Change` event (source `aws.batch`); a blocked queue emits `Batch Job Queue Blocked`. In the other direction a Batch job queue is an EventBridge target: a rule on an S3 upload can submit a job, with the input transformer passing bucket and key into the job's `parameters`, which the job definition reads as `Ref::name` in its command. The target form lets the rule set job name, job definition, array size and attempts. All resources must be in one Region.**
- Location: AWS Batch User Guide, "Job state change events", "Job queue blocked events", "AWS Batch jobs as EventBridge targets", "Parameter substitution"
- Verdict: NEW (the Batch-side facts beside F09-100 and F09-102)
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/batch-cwe-target.html | Tier 1, first-party docs | documentation of support | "a job is submitted whenever an object is uploaded to a specified Amazon S3 bucket. Each time this happens, the EventBridge input transformer passes the bucket and key name of the object to AWS Batch parameters." and "In this scenario, all of related AWS resources must be in the same Region." ; https://docs.aws.amazon.com/batch/latest/userguide/batch_job_events.html | Tier 1, first-party docs | definition | "Anytime that an existing (previously submitted) job changes states, an event is created." and "Events aren't created for the initial job submission." and "\"detail-type\": \"Batch Job State Change\"" ; https://docs.aws.amazon.com/batch/latest/userguide/example-use-parameters.html | Tier 1, first-party docs | definition | "The Ref:: declarations in the command section are used to set placeholders for parameter substitution." (accessed 2026-11-20)
- Use in dive: section 25, the worked case's first arrow: "an episode file lands in S3, a rule submits the decode job with the object key as a parameter". Two routes, both first-party: EventBridge rule straight to the queue (simple, one job per object) or EventBridge to Step Functions, which submits and waits (F09-100) when the upload starts a multi-step pipeline. The docs' own example job definition for parameters is an ffmpeg transcode (Block for F10-63).

**F10-64. Observability built in. Logs: CloudWatch Logs group `/aws/batch/job` (F10-25). Metrics, since October 2026: the `AWS/Batch` namespace, dimension `JobQueueName`, counts per state transition (`JobsSubmitted`, `JobsMovedToRunnable`, `JobsMovedToRunning`, `JobsMovedToFailed`, `JobsRetried`, and others) and durations in milliseconds; they are "best-effort" and not for billing. Container Insights on the underlying ECS cluster follows the account default (disabled) unless set on the compute environment. The metric list on the page has no GPU utilisation metric; a 2026 AWS post adds the CloudWatch agent for "GPU/CPU/memory monitoring".**
- Location: AWS Batch User Guide, "Using CloudWatch Metrics with AWS Batch" and "Default behavior" (Container Insights); What's New post "AWS Batch now publishes job metrics to Amazon CloudWatch" (Posted on: Oct 6, 2026)
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/using_cloudwatch_metrics.html | Tier 1, first-party docs | definition | "AWS Batch publishes these metrics under the AWS/Batch namespace at no additional charge." and "All metrics are published with the JobQueueName dimension." and "These metrics are provided on a best-effort basis and are intended for monitoring and observability rather than billing, auditing, or reconciliation." and "JobsRetried | The number of job attempts that were retried. | Count | Emitted when a job attempt fails and the job is returned to RUNNABLE to be retried." ; https://docs.aws.amazon.com/batch/latest/userguide/cloudwatch-container-insights-default-behavior.html | Tier 1, first-party docs | definition | "The Amazon ECS default is disabled unless you have changed your account setting." ; https://aws.amazon.com/blogs/machine-learning/cost-effective-multilingual-audio-transcription-at-scale-with-parakeet-tdt-and-aws-batch/ | Tier 2, first-party blog | production report | "an Amazon CloudWatch agent configuration for GPU/CPU/memory monitoring" (accessed 2026-11-20)
- Use in dive: section 25, the observability row. `JobsRetried` on a Spot queue is a free interruption counter `[our reading]`. The What's New post is dated Oct 6, 2026; the document history row says October 1, 2026.

**F10-65. Launch templates and Batch: what is honoured and what is ignored. A launch template can set the image, key pair, security groups, tags, block devices and user data (in MIME multi-part form). Batch ignores five of its fields: instance type, instance role, network interface subnets, "Instance market options (AWS Batch must control Spot Instance configuration)" and disable API termination. A compute environment can have a default template plus up to 10 overrides for named instance types or families. Batch writes `ECS_CLUSTER` and `ECS_INSTANCE_ATTRIBUTES` itself and the user must not set them.**
- Location: AWS Batch User Guide, "Use Amazon EC2 launch templates with AWS Batch"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/launch-templates.html | Tier 1, first-party docs | documentation of a limit | "The following launch template parameters are ignored by AWS Batch: Instance type (specify your desired instance types when you create your compute environment) Instance role (specify your desired instance role when you create your compute environment) Network interface subnets (specify your desired subnets when you create your compute environment) Instance market options (AWS Batch must control Spot Instance configuration) Disable API termination (AWS Batch must control instance lifecycle)" and "You can specify up to ten (10) override launch templates per compute environment." and "Amazon EC2 user data in launch templates must be in the MIME multi-part archive format." and "Do not set the following values in your launch template user data. These values are managed by AWS Batch and conflicts can cause scheduling and scaling issues: ECS_CLUSTER ECS_INSTANCE_ATTRIBUTES" (accessed 2026-11-20)
- Use in dive: section 25, launch template as a moving part, and a conflict to flag: the April 2025 HPC post behind F09-17 tells the reader to set `InstanceMarketOptions.MarketType` to `capacity-block` in the launch template, while today's user guide lists instance market options as ignored (section 10, U10-10). The words "Capacity Block" appear on no page of the Batch user guide today.

**F10-66. Fixed Batch quotas not in F09-6: 50 compute environments per Region across ECS and EKS; 24 KiB per job definition; 50k consumable resources; 50 service environments; 1 job queue per quota-management service environment; 20 quota shares per queue; 30 KiB per `SubmitServiceJob` request. The page ends by pointing at the EC2 and ECS quotas that apply underneath.**
- Location: AWS Batch User Guide, "Resource: AWS Batch service quotas"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/service_limits.html | Tier 1, first-party docs | documentation of a limit | "Maximum number of compute environments across Amazon ECS and Amazon EKS. | 50" and "Maximum job definition size (for RegisterJobDefinition API operations) | 24 KiB" and "Maximum number of consumable resources | 50k" and "Maximum number of quota shares for each quota management job queue. | 20" and "Depending on how you use AWS Batch, additional quotas might apply." (accessed 2026-11-20)
- Use in dive: section 25, the limits table, with F09-6. The quotas that bite a GPU user are EC2's per-family vCPU quotas (separate for Spot and On-Demand, F10-41), not Batch's.

**F10-67. Batch features of 2026, dated from What's New: unmanaged EKS compute environments (Feb 4); array job status summary in `ListJobs` (Feb 3); queue and share utilization in snapshots (Feb 13); configurable scale-down delay (Mar 2); AMI status and AWS Health planned lifecycle events (Mar 25); quota management and preemption for SageMaker Training jobs (Mar 25); ordered allocation strategies (Jun 22); ECS Managed Instances (Aug 25); bulk cancel and terminate, 50 jobs per call (Sep 17); EKS access entries (Oct 5); CloudWatch job metrics (Oct 6); EKS security context settings (Nov 13). From the docs only: S3 Files volumes by default for compute environments created after June 19 2026; Spot draining by default from October 9, 2026; default image Amazon Linux 2023 from January 12, 2026.**
- Location: AWS What's New posts named in the currency table; AWS Batch User Guide pages cited in F10-13, F10-55, F10-62
- Verdict: NEW (extends F09-21 back to January 2026)
- Evidence: https://aws.amazon.com/about-aws/whats-new/2026/06/batch-ordered-allocation-strategies/ | Tier 2, launch announcement | "Posted on: Jun 22, 2026" ; https://aws.amazon.com/about-aws/whats-new/2026/09/aws-batch-bulk-cancellation/ | Tier 2, launch announcement | "Posted on: Sep 17, 2026" ; https://aws.amazon.com/about-aws/whats-new/2026/02/aws-batch-provides-job-queue-share-utilization/ | Tier 2, launch announcement | "Posted on: Feb 13, 2026" ; https://aws.amazon.com/about-aws/whats-new/2026/03/aws-batch-ami-status-aws-health/ | Tier 2, launch announcement | "Posted on: Mar 25, 2026" ; https://aws.amazon.com/about-aws/whats-new/2026/10/aws-batch-job-cloudwatch-metrics/ | Tier 2, launch announcement | "Posted on: Oct 6, 2026" (accessed 2026-11-20)
- Use in dive: section 25, the "new in 2026" strip. The listing of What's New was assembled from two web searches, not from a complete index (the What's New tag feed for Batch stops at August 2025), so a 2026 post may be missing (U10-11).

### H. First-party evidence for the arm's workloads on Batch

**F10-68. AWS has published Isaac Lab reinforcement learning on Batch. The 17 March 2025 HPC post trains on a single GPU (cartpole: 100 epochs in "two to three minutes" on a G6e instance; a robot arm opening a drawer: 1500 epochs in "approximately 10-15 minutes"; a humanoid: "several hours") and scales out with multi-node parallel jobs. The main node aggregates updates and writes checkpoints and logs to Amazon EFS; the container is built from the Isaac Sim base image and pushed to Amazon ECR; launch templates, EFS and a NAT gateway come from a CloudFormation template.**
- Location: AWS HPC blog, "Scale Reinforcement Learning with AWS Batch Multi-Node Parallel Jobs", 17 MAR 2025
- Verdict: NEW
- Evidence: https://aws.amazon.com/blogs/hpc/scale-reinforcement-learning-with-aws-batch-multi-node-parallel-jobs/ | Tier 2, first-party blog | production report | "The cartpole example is simple and requires only 100 epochs for training. It executes within two to three minutes on a single GPU system, such as an Amazon Elastic Cloud Compute (EC2) G6e instance. The more intricate robot arm example requires 1500 epochs and approximately 10-15 minutes to train on the same system." and "An Amazon Elastic File System (EFS) provides durable storage between batch runs, and the main node aggregates training updates from across the MNP cluster and persists them to Amazon EFS, including checkpoints for the trained behavior models as well as logs." (accessed 2026-11-20)
- Use in dive: section 25, the worked case has a first-party precedent for a robot arm in GPU-parallel simulation on Batch, with EFS as the checkpoint store. The timings are the post's `[vendor claim]` for its examples, with no instance size given beyond "G6e". Being multi-node, this pattern is On-Demand only (F09-8).

**F10-69. AWS positions Batch as the offline half of running Cosmos world models: a 24 November 2025 HPC post gives two patterns, a NIM on EKS for latency and "Containerized models on AWS Batch for high-throughput, offline workloads", where Batch "provisions GPU compute resources only when inference jobs execute, then terminates instances upon completion", named for "dataset augmentation or nightly synthetic data generation".**
- Location: AWS HPC blog, "Running NVIDIA Cosmos world foundation models on AWS", 24 NOV 2025
- Verdict: NEW
- Evidence: https://aws.amazon.com/blogs/hpc/running-nvidia-cosmos-world-foundation-models-on-aws/ | Tier 2, first-party blog | documentation of support | "Batch inference: Containerized models on AWS Batch for high-throughput, offline workloads" and "The NIM-on-EKS pattern prioritizes response latency and sustained availability with persistent GPU-backed pods, while the AWS Batch pattern optimizes cost efficiency and elastic throughput through ephemeral, job-triggered compute provisioning." and "Through dynamic scaling, AWS Batch provisions GPU compute resources only when inference jobs execute, then terminates instances upon completion. This pay-per-use model eliminates costs associated with idle infrastructure, particularly valuable for intermittent workloads like dataset augmentation or nightly synthetic data generation." (accessed 2026-11-20)
- Use in dive: sections 25 and 24, first-party evidence for generative augmentation on Batch and for the Batch-to-EKS hand-off (offline on Batch, served on EKS). An earlier post than the 28 September 2026 one in F09-84, with the same assignment.

## 5. Configuration blocks

Every block below is verbatim from the page named, as fetched on 2026-11-20 (placeholders in double braces are the docs' own). Nothing is adapted. Short blocks are also quoted inside the entry's Evidence line; the longer ones are printed only here, under the entry whose page they come from. Blocks already in register 09 (F09-129 GPU test job definition, F09-130 SubmitJob, F09-131 compute environment skeleton) are not repeated.

Block for F10-9: A Spot compute environment as the API reference prints it (old style: `bidPercentage` 20 and a Spot Fleet role; no allocation strategy, so `BEST_FIT`). Shown for the field names; F10-9 and F10-8 say why the recommended form drops both fields. Verbatim. https://docs.aws.amazon.com/batch/latest/APIReference/API_CreateComputeEnvironment.html

```json
POST /v1/createcomputeenvironment HTTP/1.1
Host: batch.us-east-1.amazonaws.com
Accept-Encoding: identity
Content-Length: [content-length]
Authorization: [authorization-params]
X-Amz-Date: 20161128T223813Z
User-Agent: aws-cli/1.11.21 Python/2.7.12 Darwin/16.1.0 botocore/1.4.78

{
  "computeEnvironmentName": "M4Spot",
  "state": "ENABLED",
  "type": "MANAGED",
  "computeResources": {
    "subnets": [
      "subnet-220c0e0a",
      "subnet-1a95556d",
      "subnet-978f6dce"
    ],
    "type": "SPOT",
    "spotIamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-role",
    "tags": {
      "Name": "Batch Instance - M4Spot",
      "Department": "Marketing"
    },
    "desiredvCpus": 4,
    "minvCpus": 0,
    "instanceTypes": [
      "m4"
    ],
    "securityGroupIds": [
      "sg-cf5093b2"
    ],
    "instanceRole": "ecsInstanceRole",
    "maxvCpus": 128,
    "bidPercentage": 20,
    "ec2KeyPair": "id_rsa"
  },
  "serviceRole": "arn:aws:iam::123456789012:role/AWSBatchServiceRole"
}
```

Block for F10-16: Infrastructure update with an update policy. Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/infrastructure-updates.html

```sh
aws batch update-compute-environment \
    --compute-environment {{your-compute-environment-name}} \
    --compute-resources updateToLatestImageVersion={{true}} \
    --update-policy terminateJobsOnUpdate={{false}},jobExecutionTimeoutMinutes={{60}}

```

Block for F10-4: Scaling update (the docs change `minvCpus` and `maxvCpus`, not `desiredvCpus`). Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/scaling-updates.html

```sh
aws batch update-compute-environment \
    --compute-environment {{your-compute-environment-name}} \
    --compute-resources minvCpus={{2}},maxvCpus={{8}}

```

Block for F10-17: ECS Managed Instances compute environment targeting capacity reservations. Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/create-compute-environment-ecs-managed-instances.html

```sh
$ aws batch create-compute-environment \
    --compute-environment-name {{my-reserved-managed-instances-ce}} \
    --type MANAGED \
    --state ENABLED \
    --compute-resources '{
      "type": "ECS_MANAGED_INSTANCES",
      "maxvCpus": 512,
      "managedInstancesProvider": {
        "infrastructureRoleArn": "arn:aws:iam::{{123456789012}}:role/{{ecsInfrastructureRole}}",
        "instanceLaunchTemplate": {
          "ec2InstanceProfileArn": "arn:aws:iam::{{123456789012}}:instance-profile/{{ecsInstanceProfile}}",
          "networkConfiguration": {
            "subnets": ["{{subnet-abcde012}}", "{{subnet-bcde012a}}"],
            "securityGroups": ["{{sg-abcde012}}"]
          },
          "instanceRequirements": {
            "allowedInstanceTypes": ["m5.xlarge", "m5.2xlarge"]
          },
          "capacityReservations": {
            "reservationGroupArn": "arn:aws:ec2:{{us-east-1}}:{{123456789012}}:capacity-reservation-group/{{my-reservation-group}}",
            "reservationPreference": "RESERVATIONS_FIRST"
          }
        }
      }
    }'
```

Block for F10-19: User data that registers a self-managed instance with an unmanaged compute environment. Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/unmanaged_compute_environments.html

```sh
#!/bin/bash
echo "ECS_CLUSTER={{ecsClusterArn}}" >> /etc/ecs/ecs.config
```

Block for F10-27: Job queue template, including `jobStateTimeLimitActions`. Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/job-queue-template.html

```json
{
   "computeEnvironmentOrder": [ 
      { 
         "computeEnvironment": "",
         "order": 0
      }
   ],
   "jobQueueName": "",
   "jobStateTimeLimitActions": [ 
      { 
         "state": "RUNNABLE",
         "action": "CANCEL",
		 "maxTimeSeconds": 0,
         "reason": ""

      }
   ],
   "priority": 0,
   "schedulingPolicyArn": "",
   "state": "ENABLED",
   "tags": { 
      "KeyName": ""
   }
}
```

Block for F10-31: Fair-share scheduling policy template. Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/scheduling-policy-template.html

```json
{
    "name": "",
    "fairsharePolicy": {
        "shareDecaySeconds": 0,
        "computeReservation": 0,
        "shareDistribution": [
            {
                "shareIdentifier": "",
                "weightFactor": 0.0
            }
        ]
    },
    "tags": {
        "KeyName": ""
    }
}
```

Block for F10-44: GPU job definition for ECS Managed Instances (`ecsProperties`, one whole GPU). Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/create-job-definition-ecs-managed-instances.html

```sh
$ aws batch register-job-definition \
    --job-definition-name {{my-gpu-managed-instances-job-def}} \
    --type container \
    --platform-capabilities MANAGED_INSTANCES \
    --ecs-properties '{
      "taskProperties": [{
        "containers": [{
          "image": "{{123456789012}}.dkr.ecr.{{us-east-1}}.amazonaws.com/{{my-gpu-image}}:latest",
          "name": "main",
          "command": ["nvidia-smi"],
          "resourceRequirements": [
            {"type": "VCPU", "value": "4"},
            {"type": "MEMORY", "value": "16384"},
            {"type": "GPU", "value": "1"}
          ]
        }],
        "executionRoleArn": "arn:aws:iam::{{123456789012}}:role/{{ecsTaskExecutionRole}}"
      }]
    }'
```

Block for F10-44: GPU job definition for Amazon EKS (`nvidia.com/gpu`, whole number). Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/create-eks-gpu-job-definition.html

```sh
$ cat <<EOF > ./batch-eks-gpu-jd.json
{
    "jobDefinitionName": "MyGPUJobOnEks_Smi",
    "type": "container",
    "eksProperties": {
        "podProperties": {
            "hostNetwork": true,
            "containers": [
                {
                    "image": "nvcr.io/nvidia/cuda:10.2-runtime-centos7",
                    "command": ["nvidia-smi"],
                    "resources": {
                        "limits": {
                            "cpu": "1",
                            "memory": "1024Mi",
                            "nvidia.com/gpu": "1"
                        }
                    }
                }
            ]
        }
    }
}
EOF

$ aws batch register-job-definition --cli-input-json file://./batch-eks-gpu-jd.json
```

Block for F10-48: Array job with an `N_TO_N` dependency (the docs' block lacks a comma after `containerOverrides`; printed as published). Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/example_array_job.html

```json
{
    "jobName": "JobC",
    "jobQueue": "ProdQueue",
    "jobDefinition": "JobC-Memory-Intensive-Processing:1",
    "containerOverrides": {
        "resourceRequirements": [
            {
                "type": "MEMORY",
                "value": "32768"
            },
            {
                "type": "VCPU",
                "value": "1"
            }
        ]
   }
    "arrayProperties": {
        "size": 10000
    },
    "dependsOn": [
        {
            "jobId": "{{JobB_job_ID}}",
            "type": "N_TO_N"
        }
    ]
}

```

Block for F10-49: Multi-node parallel job definition (the docs' example). Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/example-mnp-job-definition.html

```json
{
  "jobDefinitionName": "gromacs-jobdef",
  "jobDefinitionArn": "arn:aws:batch:us-east-2:{{123456789012}}:job-definition/gromacs-jobdef:1",
  "revision": 6,
  "status": "ACTIVE",
  "type": "multinode",
  "parameters": {},
  "nodeProperties": {
    "numNodes": 2,
    "mainNode": 0,
    "nodeRangeProperties": [
      {
        "targetNodes": "0:1",
        "container": {
          "image": "{{123456789012}}.dkr.ecr.us-east-2.amazonaws.com/gromacs_mpi:latest",
          "resourceRequirements": [
              {
                  "type": "MEMORY",
                  "value": "24000"
              },
              {
                  "type": "VCPU",
                  "value": "8"
              }
          ],
          "command": [],
          "jobRoleArn": "arn:aws:iam::{{123456789012}}:role/ecsTaskExecutionRole",
          "ulimits": [],
          "instanceType": "p3.2xlarge"
        }
      }
    ]
  }
}
```

Block for F10-52: `evaluateOnExit` with two retry rules and a final exit rule. Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/job_retries.html

```json
"evaluateOnExit": [
    {
        "action": "RETRY",
        "onReason": "AGENT"
    },
    {
        "action": "RETRY",
        "onStatusReason": "Task failed to start"
    },
    {
        "action": "EXIT",
        "onReason": "*"
    }
]
```

Block for F10-53: Retry only when the host is lost (the Spot pattern; same block as F09-10). Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/bestpractice6.html

```json
"retryStrategy": {
    "attempts": 5,
    "evaluateOnExit":
    [{
        "onStatusReason" :"Host EC2*",
        "action": "RETRY"
    },{
      "onReason" : "*",
        "action": "EXIT"
    }]
}

```

Block for F10-53: Retry strategy at submission. Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/bestpractice6.html

```sh
$ aws batch submit-job --job-name MyJob \
    --job-queue MyJQ \
    --job-definition MyJD \
    --retry-strategy attempts=2

```

Block for F10-61: Toleration for a DaemonSet on Batch-managed EKS nodes. Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/daemonset-on-batch-eks-nodes.html

```yaml
tolerations:
  - key: "batch.amazonaws.com/batch-node"
    operator: "Exists"
```

Block for F10-62: EFS volume in a job definition. Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/efs-volumes.html

```json
{
    "containerProperties": [
        {
            "image": "{{amazonlinux:2}}",
            "command": [
                "ls",
                "-la",
                "{{/mount/efs}}"
            ],
            "mountPoints": [
                {
                    "sourceVolume": "{{myEfsVolume}}",
                    "containerPath": "{{/mount/efs}}",
                    "readOnly": {{true}}
                }
            ],
            "volumes": [
                {
                    "name": "{{myEfsVolume}}",
                    "efsVolumeConfiguration": {
                        "fileSystemId": "{{fs-12345678}}",
                        "rootDirectory": "{{/path/to/my/data}}",
                        "transitEncryption": "{{ENABLED}}",
                        "transitEncryptionPort": {{integer}},
                        "authorizationConfig": {
                            "accessPointId": "{{fsap-1234567890abcdef1}}",
                            "iam": "{{ENABLED}}"
                        }
                    }
                }
            ]
        }
    ]
}
```

Block for F10-62: S3 Files volume in a job definition (`ecsProperties`). Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/s3files-volumes.html

```json
{
    "ecsProperties": {
        "taskProperties": [
            {
                ...,
                "taskRoleArn": "arn:aws:iam::{{<account>}}:role/{{<job-role-name>}}",
                "containers": [
                    {
                        ...,
                        "mountPoints": [
                            {
                                "sourceVolume": "{{myS3FilesVolume}}",
                                "containerPath": "{{/mnt/s3data}}",
                                "readOnly": {{false}}
                            }
                        ]
                    }
                ],
                "volumes": [
                    {
                        "name": "{{myS3FilesVolume}}",
                        "s3filesVolumeConfiguration": {
                            "fileSystemArn": "arn:aws:s3files:{{<region>}}:{{<account>}}:file-system/{{<fs-id>}}",
                            "rootDirectory": "{{/keypath/in/s3}}"
                        }
                    }
                ]
            }
        ]
    }
}
```

Block for F10-62: Launch template user data that mounts FSx for Lustre (written for Amazon Linux 2; see F10-62). Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/launch-template-examples.html

```text
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="==MYBOUNDARY=="

--==MYBOUNDARY==
Content-Type: text/cloud-config; charset="us-ascii"

runcmd:
- file_system_id_01={{fs-0abcdef1234567890}}
- region={{us-east-2}}
- fsx_directory={{/scratch}}
- amazon-linux-extras install -y lustre2.10
- mkdir -p ${fsx_directory}
- mount -t lustre ${file_system_id_01}.fsx.${region}.amazonaws.com@tcp:{{fsx}} ${fsx_directory}

--==MYBOUNDARY==--
```

Block for F10-62: Host path volume and mount point that expose the Lustre mount to the container (the docs' block ends with a trailing comma; printed as published). Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/launch-template-examples.html

```json
{
    "volumes": [
        {
            "host": {
                "sourcePath": "{{/scratch}}"
            },
            "name": "{{Scratch}}"
        }
    ],
    "mountPoints": [
        {
            "containerPath": "{{/scratch}}",
            "sourceVolume": "{{Scratch}}"
        }
    ],
}
```

Block for F10-65: Launch template that enlarges and encrypts the root volume. Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/launch-templates.html

```json
{
    "LaunchTemplateName": "increase-container-volume-encrypt",
    "LaunchTemplateData": {
        "BlockDeviceMappings": [
            {
                "DeviceName": "/dev/xvda",
                "Ebs": {
                    "Encrypted": true,
                    "VolumeSize": 100,
                    "VolumeType": "gp2"
                }
            }
        ]
    }
}
```

Block for F10-65: Launch template user data that changes ECS agent settings (the pattern for any `ecs.config` line, including `ECS_ENABLE_SPOT_INSTANCE_DRAINING`). Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/launch-template-examples.html

```text
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="==MYBOUNDARY=="

--==MYBOUNDARY==
Content-Type: text/x-shellscript; charset="us-ascii"

#!/bin/bash
echo ECS_IMAGE_CLEANUP_INTERVAL=60m >> /etc/ecs/ecs.config
echo ECS_IMAGE_MINIMUM_CLEANUP_AGE=60m >> /etc/ecs/ecs.config

--==MYBOUNDARY==--
```

Block for F10-63: Job definition with parameter substitution (`Ref::`). Verbatim. https://docs.aws.amazon.com/batch/latest/userguide/example-use-parameters.html

```json
{
    "jobDefinitionName": "ffmpeg_parameters",
    "type": "container",
    "parameters": {"codec": "mp4"},
    "containerProperties": {
        "image": "my_repo/ffmpeg",
        "resourceRequirements": [
            {
                "type": "MEMORY",
                "value": "2000"
            },
            {
                "type": "VCPU",
                "value": "2"
            }
        ],
        "command": [
            "ffmpeg",
            "-i",
            "Ref::inputfile",
            "-c",
            "Ref::codec",
            "-o",
            "Ref::outputfile"
        ],
        "jobRoleArn": "arn:aws:iam::{{123456789012}}:role/ECSTask-S3FullAccess",
        "user": "nobody"
    }
}
```

Block for F10-59: CloudFormation fragment of a GPU Spot compute environment (the post elides the rest with a comment). Verbatim. https://aws.amazon.com/blogs/machine-learning/cost-effective-multilingual-audio-transcription-at-scale-with-parakeet-tdt-and-aws-batch/

```yaml
DefaultComputeEnv:
  Type: AWS::Batch::ComputeEnvironment
  Properties:
    Type: MANAGED
    State: ENABLED
    ComputeResources:
      AllocationStrategy: SPOT_PRICE_CAPACITY_OPTIMIZED
      Type: SPOT
      BidPercentage: 100
      InstanceTypes:
        - "g6.xlarge"
        - "g6.2xlarge"
        - "g5.xlarge"
      MinvCpus: !Ref DefaultCEMinvCpus
      MaxvCpus: !Ref DefaultCEMaxvCpus
      # ... remaining configuration unchanged
```

Block for F10-54: the EventBridge event for a Spot interruption. Verbatim. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html

```json
{
    "version": "0",
    "id": "{{12345678-1234-1234-1234-123456789012}}",
    "detail-type": "EC2 Spot Instance Interruption Warning",
    "source": "aws.ec2",
    "account": "{{123456789012}}",
    "time": "{{yyyy}}-{{mm}}-{{dd}}T{{hh}}:{{mm}}:{{ss}}Z",
    "region": "{{us-east-2}}",
    "resources": ["arn:aws:ec2:{{us-east-2a}}:instance/{{i-1234567890abcdef0}}"],
    "detail": {
        "instance-id": "{{i-1234567890abcdef0}}",
        "instance-action": "{{action}}"
    }
}
```

## 6. The cluster, drawn

### 6.1 Objects and how they nest (EC2-backed Batch, the main drawing)

1. **Submitter** (a person, an EventBridge rule, a Step Functions state, an agent) calls `SubmitJob` with a job name, a job queue and a job definition (F09-130, F10-63).
2. **Job definition**: the template. Image, command, vCPU, memory and whole GPUs, shared memory, volumes, retry strategy, timeout (F10-43 to F10-46, F10-52).
3. **Job queue**: an ordered list of waiting jobs with a `priority` against other queues, an optional fair-share policy, an optional time limit for jobs stuck at the head (F10-20, F10-27, F10-30). Draw the job as a token carrying its state.
4. **Scheduler** (inside the Batch service, not in the account): takes the head of the queue (FIFO) or the share with the lowest recent usage (fair share), and decides placement and scaling (F10-31, F10-37).
5. **Compute environments**, up to three behind a queue, in order (F10-21, F10-22). Each is a box in the user's account holding an Auto Scaling group or Spot Fleet and one ECS cluster (F10-1), with a vCPU gauge: floor `minvCpus`, needle `desiredvCpus`, ceiling `maxvCpus` (F10-3).
6. **Instances** inside a compute environment: EC2 instances from the `instanceTypes` list, picked by the allocation strategy, running the ECS agent on the image chosen by `ec2Configuration`, shaped by the launch template (F10-5, F10-8, F10-13, F10-65). Draw GPUs as slots on the instance: 1 on g6e.xlarge, 4 on g6e.12xlarge, 8 on g6e.48xlarge (F10-7).
7. **Job containers** on an instance, each pinned to whole GPUs (F10-44). Several jobs share an instance when their requests fit; a multi-node job takes whole instances, one container each (F09-7).
8. **Storage** beside the cluster: an image registry (pulled during `STARTING`), S3 (through S3 Files, Mountpoint or the SDK), EFS or FSx for Lustre for checkpoints and shared data (F10-62).
9. **Network**: the user's VPC and subnets; instances need a route to the ECS endpoint (F10-1); multi-node jobs add one network interface per node, a cluster placement group and optionally EFA (F10-51, F09-8, F09-9).
10. **Signals out**: CloudWatch Logs `/aws/batch/job`, CloudWatch metrics in `AWS/Batch`, EventBridge job state change and queue blocked events (F10-25, F10-64, F10-63).

Variants to draw smaller: ECS Managed Instances (no Auto Scaling group, no image choice, a `managedInstancesProvider` block, F10-17); Batch on EKS (the instances are tainted nodes in the user's EKS cluster and the containers are pods, F10-61, F09-19); SageMaker Training queue (no instances in the drawing at all: queue, quota shares, service environment, training jobs, F10-35, F10-60).

### 6.2 Lifecycle as numbered steps (single-node job on a Spot compute environment at zero)

| Step | What the animation shows | Job state | Entries |
|---|---|---|---|
| 1. Submit | A job token enters the queue | `SUBMITTED` | F10-23 |
| 2. Dependencies | Token waits if it depends on another job; an array parent waits here while children run | `PENDING` | F10-23, F10-48 |
| 3. Ready | Token at the head of the queue (FIFO) or chosen by share usage (fair share) | `RUNNABLE` | F10-23, F10-31 |
| 4. Scale from zero | Scheduler raises `desiredvCpus`; the allocation strategy picks a type from the list; an instance launches, runs its user data and registers with the ECS cluster. Documented time: "a few minutes" | still `RUNNABLE` | F10-37, F10-8, F10-39, F09-1 |
| 5. Place | The job is assigned to the instance; the image is pulled | `STARTING` (outside the timeout) | F10-24 |
| 6. Run | Container runs with its whole GPUs; the timeout clock starts; logs flow | `RUNNING` | F10-24, F10-44, F10-46 |
| 7. Spot notice | EC2 gives the instance two minutes (best effort) | `RUNNING` | F10-54 |
| 8. Drain | The instance turns `DRAINING`: no new jobs land on it; the running container is not stopped by the drain | `RUNNING` | F10-55, F10-56 |
| 9. Checkpoint | The job saves state: on its own timer, or because it polls the instance metadata. Nothing in the docs says Batch tells it | `RUNNING` | F10-56, F09-11, U10-7 |
| 10. Reclaim | The instance is terminated; the attempt fails with a `Host EC2...` status reason | attempt ends | F10-57, F09-10 |
| 11. Requeue | `evaluateOnExit` matches `Host EC2*` and attempts remain: the job returns to the front of the queue | `RUNNABLE` | F10-52, F10-53 |
| 12. Replace | The scheduler launches replacement capacity (possibly another type from the list, or the next compute environment if the first is at its ceiling) | `RUNNABLE`, then `STARTING` | F10-8, F10-22 |
| 13. Resume | New attempt, `AWS_BATCH_JOB_ATTEMPT` is 2; the script loads the last checkpoint from EFS or S3 | `RUNNING` | F10-52, F10-62 |
| 14. Finish | Exit code 0 | `SUCCEEDED` (kept at least 7 days) | F10-25 |
| 15. Scale down | The instance has no job. With a scale-down delay it stays 20 minutes to 1 week after its last job; then it is terminated and the gauge returns to `minvCpus` | none | F10-40, F10-38 |

Failure branches worth one frame each: a job stuck at the head for lack of capacity (`RUNNABLE` with `CAPACITY:INSUFFICIENT_INSTANCE_CAPACITY`, cancelled after `maxTimeSeconds`, F10-26, F10-27); a timeout (SIGTERM, 30 seconds, SIGKILL, no retry, F10-46); retries exhausted (`FAILED`, F10-25).

### 6.3 Lifecycle of a multi-node parallel job (On-Demand only)

1. Submit; `RUNNABLE`; Batch provisions all instances for the job, new capacity even if a warm pool exists (F10-38).
2. Main node launches first and reaches `RUNNING` (F10-50).
3. Child nodes launch in random order and read the main node's address from an environment variable (F10-50).
4. The application waits for all nodes, then trains.
5. A child dies: Batch does nothing; the application must end the job (F10-50). The main node fails: with retries, the whole job is attempted again (F09-7).
6. Main node exits: all children are stopped; the job takes the main node's status (F10-50).

### 6.4 Lifecycle of a SageMaker Training service job

`SUBMITTED`, `RUNNABLE`, `SCHEDULED` (handed to SageMaker, capacity pending), `STARTING` (downloading data and images), `RUNNING`, then `SUCCEEDED` or `FAILED`. With quota management a `SCHEDULED`, `STARTING` or `RUNNING` job can be preempted and returns to `RUNNABLE` (F10-60, F10-35, F10-34).

## 7. Recommended configuration [our reading]

Everything in this section is `[our reading]`: a configuration assembled for the arm's workloads from fields that the first-party pages document. The JSON below is ASSEMBLED, not verbatim; each field exists in the cited entries, and every value is our choice. Angle-bracket placeholders are ours. Numbers marked illustrative are sizing examples, not recommendations from AWS.

**What AWS itself recommends, quoted:**
- "We recommend that you use SPOT_PRICE_CAPACITY_OPTIMIZED rather than SPOT_CAPACITY_OPTIMIZED in most instances." (F10-10; the best-practices page names `SPOT_CAPACITY_OPTIMIZED`, same entry)
- `bidPercentage`: "For most use cases, we recommend leaving this field empty." (F10-9)
- "Diversify instance types" (F10-10)
- "We advise against running jobs that take an hour or more when using Amazon EC2 Spot instances" and parts "of 30 minutes or less" (F09-11)
- "we recommend that you set at least 1-3 automated retries" (F10-53)
- "We recommend not using desiredvCpus to initiate a scaling update" (F10-4)
- "AWS Batch recommends creating dedicated compute environments for running multi-node parallel (MNP) jobs and non-MNP jobs." (F10-38)
- "Consider grouping tasks so the jobs run 3-5 minutes each." (F10-42)

**Layout for the arm: three compute environments, two queues.**

| Piece | Setting | Why (entries) |
|---|---|---|
| `gpu-spot` compute environment | type `SPOT`; `SPOT_PRICE_CAPACITY_OPTIMIZED`; `instanceTypes` a list of same-GPU-memory single-GPU sizes from G families only (for 48 GiB jobs: g6e.xlarge, g6e.2xlarge, g6e.4xlarge; add g7e sizes if 96 GiB is acceptable); `minvCpus` 0; no `bidPercentage`, no `spotIamFleetRole`, no `desiredvCpus` | F10-8, F10-9, F10-10, F10-6, F10-7, F10-38, F10-4, F10-59 |
| `gpu-ondemand` compute environment | type `EC2`; `BEST_FIT_PROGRESSIVE` (or `BEST_FIT_PROGRESSIVE_ORDERED` to prefer a type); same families; `minvCpus` 0; never the default `BEST_FIT` | F10-8, F10-15 |
| `cpu-spot` compute environment | type `SPOT`; `default_arm64` or `default_x86_64`; for decode and curation jobs with no GPU | F10-5, F10-6 |
| `sim-eval` queue (interruptible: evaluation sweeps, synthetic data, generative augmentation) | order 1 `gpu-spot`, order 2 `gpu-ondemand`; `gpu-spot`'s `maxvCpus` is the Spot budget, since the spill to order 2 is documented for a full compute environment, not for a Spot shortage | F10-21, F10-22, U10-2 |
| `train` queue (fine-tunes that must finish) | `gpu-ondemand` only, higher `priority` than `sim-eval` so it is evaluated first on the shared On-Demand compute environment; nothing running is preempted | F10-20, F10-34 |
| Both queues | `jobStateTimeLimitActions`: cancel a job stuck at the head for `CAPACITY:INSUFFICIENT_INSTANCE_CAPACITY` | F10-26, F10-27 |
| Scale-down | `minScaleDownDelayMinutes` 20 on `gpu-ondemand` when fine-tunes and evaluations arrive in waves (the minimum; keeps the image cached and skips a launch); unset on `gpu-spot` for one-off sweeps | F10-40, F09-13 |
| Updates | `updatePolicy.jobExecutionTimeoutMinutes` above the longest fine-tune on `gpu-ondemand` | F10-16 |
| Job definition, evaluation child | 1 GPU; retry on `Host EC2*` only, catch-all `EXIT`; a timeout; each child sized to run 3 to 30 minutes | F09-10, F10-52, F10-46, F10-42, F09-11 |
| Job definition, fine-tune | 1 GPU; `sharedMemorySize`; an EFS (or S3 Files) volume for checkpoints; a timeout; on Spot only if it checkpoints on a timer and resumes when `AWS_BATCH_JOB_ATTEMPT` is above 1 | F10-45, F10-62, F10-56, F10-52 |
| Fair share (only if several people or agents share the queue; fixed at queue creation) | one `shareIdentifier` per person or agent, `computeReservation` above 0 so a newcomer is not starved | F10-30, F10-31, F10-32 |

Assembled compute environment (not verbatim; fields from F10-3, F10-8, F10-13, F10-40, F09-131):

```json
{
  "computeEnvironmentName": "gpu-spot",
  "type": "MANAGED",
  "state": "ENABLED",
  "computeResources": {
    "type": "SPOT",
    "allocationStrategy": "SPOT_PRICE_CAPACITY_OPTIMIZED",
    "minvCpus": 0,
    "maxvCpus": 64,
    "instanceTypes": ["g6e.xlarge", "g6e.2xlarge", "g6e.4xlarge"],
    "subnets": ["<subnet-a>", "<subnet-b>", "<subnet-c>"],
    "securityGroupIds": ["<security-group>"],
    "instanceRole": "ecsInstanceRole",
    "ec2Configuration": [{ "imageType": "ECS_AL2023_NVIDIA" }]
  }
}
```

`maxvCpus` 64 is illustrative. `[derived]`: 64 vCPUs / 4 vCPUs per g6e.xlarge (F10-7) = 16 single-GPU instances at most, plus the documented overshoot of one instance (F09-4). Because the three listed sizes have 4, 8 and 16 vCPUs for the same single GPU (F10-7), a vCPU ceiling does not fix the GPU count: 64 vCPUs is 16 GPUs on g6e.xlarge and 4 GPUs on g6e.4xlarge. That is a property of sizing GPU fleets in vCPUs (F10-3).

Assembled job queue (not verbatim; fields from the template in section 5, Block for F10-27, and F10-27):

```json
{
  "jobQueueName": "sim-eval",
  "state": "ENABLED",
  "priority": 1,
  "computeEnvironmentOrder": [
    { "order": 1, "computeEnvironment": "gpu-spot" },
    { "order": 2, "computeEnvironment": "gpu-ondemand" }
  ],
  "jobStateTimeLimitActions": [
    {
      "state": "RUNNABLE",
      "action": "CANCEL",
      "maxTimeSeconds": 14400,
      "reason": "CAPACITY:INSUFFICIENT_INSTANCE_CAPACITY"
    }
  ]
}
```

`computeEnvironment` is shown by name for readability; the API reference defines it as the compute environment's ARN (F10-21 source page). 14400 seconds (4 hours) is the value in AWS's own example (F10-27); the allowed range is 600 to 86,400.

Assembled job definition for one evaluation child (not verbatim; fields from F09-129, F10-44, F10-45, F10-46, the retry block of F09-10):

```json
{
  "jobDefinitionName": "arm-eval",
  "type": "container",
  "containerProperties": {
    "image": "<account>.dkr.ecr.<region>.amazonaws.com/<simulator-image>:<tag>",
    "command": ["python", "evaluate.py", "--checkpoint", "Ref::checkpoint"],
    "resourceRequirements": [
      { "type": "VCPU", "value": "4" },
      { "type": "MEMORY", "value": "28000" },
      { "type": "GPU", "value": "1" }
    ],
    "linuxParameters": { "sharedMemorySize": 8192 }
  },
  "retryStrategy": {
    "attempts": 3,
    "evaluateOnExit": [
      { "onStatusReason": "Host EC2*", "action": "RETRY" },
      { "onReason": "*", "action": "EXIT" }
    ]
  },
  "timeout": { "attemptDurationSeconds": 3600 }
}
```

Notes on the values: `attempts` 3 sits in AWS's "at least 1-3" (F10-53). `MEMORY` 28000 MiB is illustrative and deliberately under the 32 GiB of a g6e.xlarge, because the agent cannot offer the full installed memory to jobs (the docs' memory management page: installed memory "doesn't always translate" to available memory, and 32 MiB is reserved); the exact usable figure for g6e.xlarge is not published and should be read from the instance. `sharedMemorySize` 8192 MiB and the 3600-second timeout are illustrative.

Multi-node training on Batch (when used at all): a dedicated On-Demand compute environment with one instance type, a cluster placement group in one Availability Zone, private subnets with a NAT gateway, at most five security groups, EFA device passed in the job definition, `minvCpus` 0 (F10-38, F10-49, F10-51, F09-8, F09-9).

## 8. Workload fit

Names are those in `src/sections/Workloads.tsx`, in its order. Verdicts are `[our reading]` unless an entry with first-party evidence is cited as such.

| # | Workload (file name) | Fit on Batch | Why, with entries |
|---|---|---|---|
| 1 | Record and encode | Does not fit: edge | Runs on the computer beside the robot. Batch enters only after upload: an S3 event submits an indexing or validation job (F10-63, F09-102). |
| 2 | Decode and filter | Suits | Independent shards, CPU or one GPU each: an array job on Spot with the `Host EC2*` retry (F09-5, F09-10), sized 3 to 30 minutes per child (F10-42, F09-11). First-party: AWS's Cosmos architecture puts the curator on Batch (F09-84). |
| 3 | Embed and deduplicate | Suits, with a limit | Same shape as 2, `N_TO_N` after it (F10-48). Limit: whole GPUs only, so a stage that needs a fraction of a GPU wastes the rest unless several models share one container (F10-44). |
| 4 | Dataloader decode and augment | Not a Batch decision | It runs inside the training job; Batch's only lever is the instance size (vCPUs per GPU, F10-7) and `sharedMemorySize` (F10-45). |
| 5 | CPU physics step | Suits | CPU array jobs on `default_arm64` or `default_x86_64` Spot (F10-5); pack many short rollouts per child (F10-42). |
| 6 | GPU-parallel physics | Suits | One GPU per job; first-party precedent: Isaac Lab training on Batch, a robot arm task in 10 to 15 minutes on a G6e instance `[vendor claim]` (F10-68). Scale-out across nodes uses multi-node jobs, On-Demand only (F09-8). |
| 7 | Simulated cameras | Suits | G-family compute environment (F10-6); a multi-GB simulator image shows up as time in `STARTING` (F10-24), so a scale-down delay or a non-zero floor pays for itself between waves (F10-40). |
| 8 | Policy fine-tune | Suits | One GPU for hours: On-Demand queue, or Spot with timer checkpoints to EFS or S3 (F10-11, F10-56, F10-62). First-party: GR00T fine-tune on Batch on g6e.4xlarge (F09-114), a named customer (F09-89). Alternative path: a Batch queue in front of SageMaker Training jobs (F10-60). |
| 9 | World-model training | Suits when it is one node; possible beyond | One to eight GPUs on one instance is an ordinary job. 16 to 32 GPUs is a multi-node job: On-Demand, same instance type, no node replacement (F10-49, F10-50). |
| 10 | Closed-loop evaluation | Suits (the best fit) | Array job, one child per checkpoint and seed (F09-5); simulator and policy as two containers of one job (F10-47); Spot with retries; dependency on the fine-tune job (F10-48). |
| 11 | Engine build | Possible for the export step only | ONNX export fits a small job; the engine itself is built on the device (register 07). |
| 12 | On-robot inference | Does not fit: edge | Runs on the robot. Batch also says it is not for responses "in under a few seconds" (F10-42). |
| 13 | Generative augmentation | Suits | First-party: AWS's Cosmos post names Batch for offline generation and nightly synthetic data (F10-69, F09-84). Restartable clips on Spot. |
| 14 | Robot foundation-model pretraining | Does not fit well | Many nodes for days: Batch multi-node jobs have no Spot, no preemption, no node replacement, and the Capacity Block path is unclear in today's docs (F09-8, F10-34, F10-50, F10-65, U10-10). Hand off to HyperPod or Slurm. |
| 15 | World-model pretraining | Does not fit well | Same reasons as 14. |

The brief's numbering differs from the file's in two rows: the brief's "VLA post-training on one node" corresponds to row 8's larger sibling (one eight-GPU instance, an ordinary Batch job on On-Demand or a SageMaker Training job behind a Batch queue, F10-60), and the brief's "multi-node pretraining" covers rows 14 and 15.

## 9. What it does poorly, and hand-offs

| Limit | Entries | Where it hands off |
|---|---|---|
| No preemption of container jobs; priority only orders the queue | F10-34, F10-20 | HyperPod task governance, Kueue or KAI on EKS (sections 27, 28) |
| Whole GPUs only; no fractional GPU, time-slicing, MPS or MIG in the docs | F10-44 | EKS with the NVIDIA device plugin or KAI (section 28) |
| Multi-node jobs: On-Demand only, one instance type, child failure ignored, whole-job restart | F09-8, F10-49, F10-50, F09-7 | HyperPod (node replacement), PCS and Slurm (sections 26, 27) |
| Spot notice is not relayed to the job as a documented signal | F10-56, U10-7 | The job's own code; on Slurm, the scheduler requeues (F10-58) |
| One-queue Spot-to-On-Demand spill is documented for a full compute environment, not for a Spot shortage | F10-22, U10-2 | Two queues and a resubmit through EventBridge and Step Functions (F10-12) |
| Head-of-line blocking on FIFO queues | F10-26 | Fair share; `jobStateTimeLimitActions` (F10-27) |
| Cold start of "a few minutes" plus image pull; not for jobs of seconds or instant starts | F10-39, F10-42 | A service on ECS or EKS; Lambda for small steps |
| Capacity sized in vCPUs, also for GPU fleets; fair share counts vCPUs | F10-3, F10-31 | Quota shares count instances (SageMaker Training queues only, F10-35) |
| The user patches images on EC2 compute environments | F10-14 | ECS Managed Instances (F10-17), with its own limits (F10-18) |
| Capacity Blocks: not named in the user guide; the launch-template field the 2025 post uses is listed as ignored | F10-65, F09-17, U10-10 | SageMaker training plans, HyperPod (section 27) |
| Job history kept "at least 7 days"; no experiment record | F10-25 | MLflow (F09-103), an event archive |
| Fair share or FIFO is fixed when the queue is created | F10-30 | A new queue |

## 10. Contradicts or sharpens the first version

| F09 ID | What register 09 says | What today's page says |
|---|---|---|
| F09-3 | The docs recommend `SPOT_PRICE_CAPACITY_OPTIMIZED` for most Spot use | True of the allocation-strategies page. The Spot best-practices page of the same guide says "Choose the SPOT_CAPACITY_OPTIMIZED allocation strategy". The dive should cite the strategy page and not say "AWS recommends" without it (F10-10). Also new: `BEST_FIT` is the default on ECS, is required-to-be-set on EKS, and blocks infrastructure updates (F10-8). |
| F09-8 | MNP jobs do not run on Spot or unmanaged compute environments | Also not on ECS Managed Instances (F10-2). |
| F09-12 | Draining is on by default from 9 October 2026 | Confirmed on the Batch page. Sharpened: the ECS guide and the ECS agent table still give the agent default as off, so this is Batch's setting for new or updated compute environments; and draining does not stop or signal the running job (F10-55, F10-56). |
| F09-13 | `minScaleDownDelayMinutes` keeps an instance 20 minutes to 1 week | Confirmed. Sharpened with three exclusions (infrastructure updates, instances that never ran a job, reclaimed Spot instances) and "Use 0 to unset" (F10-40). |
| F09-14 | "the two pages read here describe no preemption of a running container job" | Today's preemption page states it outright: quota management "is the only AWS Batch scheduling algorithm to incorporate preemption" (F10-34). Also new: FIFO or fair share cannot be changed after queue creation (F10-30). |
| F09-17 | Batch uses a Capacity Block through a launch template with `InstanceMarketOptions.MarketType` `capacity-block` (April 2025 HPC post) | Today's user guide lists "Instance market options" among launch template parameters that are "ignored by AWS Batch", and no user guide page mentions Capacity Blocks. The post and the guide are in tension; the dive should present the Capacity Block path as described by a 2025 post and not confirmed by the current guide (F10-65, U10-10). |
| F09-21 | CloudWatch job metrics and EKS access entries "both 1 October" | 1 October is the document history date. The What's New posts are dated Oct 6, 2026 (metrics) and Oct 5, 2026 (access entries) (F10-61, F10-64). |
| F09-128 | GPU job in a compute environment with other families may stay `RUNNABLE` | Confirmed, with a wrinkle: the page's family list names g6 and g7e but not g6e, while its table lists g6e sizes (F10-6, F10-7). Treat the list as incomplete, not as excluding g6e; AWS's own posts run Batch on g6e (F09-114). |
| F09-2 | ECS Managed Instances: four needs send the user back to EC2 compute environments | Confirmed. Added: instances are drained at day 14, On-Demand must precede Spot in a queue, idle hold is at most 3600 seconds (F10-17, F10-18). |
| Section 12, row 2 (0.25 GPU per model in curation) | Batch array job for curation | Still workable, but Batch allocates whole GPUs (F10-44): the fraction has to be realised inside one container. |

## 11. UNKNOWN register

| ID | Unknown | Where it arises | What was searched; what would close it |
|---|---|---|---|
| U10-1 | Any AWS Batch statement specific to Spot for GPU instance types (availability, interruption, advice) | F10-11 | The Spot and On-Demand best-practices pages and a search of the user guide; none names GPU Spot. Interruption data per type is in register 09 (F09-96). |
| U10-2 | Whether a queue ordered Spot then On-Demand spills to On-Demand when Spot capacity is unavailable but the Spot compute environment is under `maxvCpus` | F10-22 | ComputeEnvironmentOrder and CreateJobQueue pages give only the two documented triggers. A Tier 0 test or an AWS statement would close it. |
| U10-3 | Whether Batch GPU scheduling supports p5.4xlarge, P6-B300 and P6e, which have no row in the GPU table | F10-7 | The "Run GPU jobs" table and family list. The instance-type compute table page lists only the default bundles' CPU families and has no GPU rows. |
| U10-4 | How fast Batch reacts to a new `RUNNABLE` job (evaluation interval), and any limit on instances launched per minute | F10-37, F10-41 | User guide searched for "scale up", "scales up", "idle"; no figure. |
| U10-5 | How long an idle instance stays when no scale-down delay is set | F10-40 | Same search. A 2017 What's New title ("Accelerated Scale-Down of AWS Batch Managed Compute Environments") surfaced in a web search and was not fetched: older than 2025. |
| U10-6 | A What's New post or document history row for "Spot Instance draining on by default" (9 October 2026) | F10-55 | Two web searches and the document history page; only the best-practices page carries the date. |
| U10-7 | Whether a Batch job's container receives SIGTERM (and how long before SIGKILL) when its Spot instance is reclaimed | F10-56 | Batch user guide (only the timeout documents signals), ECS draining pages (standalone tasks unaffected). A Tier 0 test with a signal handler would close it. |
| U10-8 | The full `statusReason` string of an attempt lost to a Spot reclaim | F10-57 | The user guide prints only the pattern `Host EC2*`. |
| U10-9 | How an EC2 compute environment exposes instance store (NVMe) volumes to jobs | F10-62 | Launch template pages (no instance store example); only ECS Managed Instances has a documented field. |
| U10-10 | Whether Capacity Blocks work with Batch today, given that the user guide lists instance market options as ignored | F10-65, F09-17 | User guide searched for "capacity block", "capacity-block", "CapacityReservation": matches only on ECS Managed Instances pages (On-Demand Capacity Reservations). The HPC post was not re-fetched today (register 09 fetched it today). |
| U10-11 | Completeness of the 2026 What's New list for Batch | F10-67 | The What's New tag feed for Batch ends at Aug 18, 2025; the 2026 list comes from two web searches. |
| U09-1 | Cold-start time for a GPU job with a multi-GB image | F10-39 | Still open; the October 2026 metrics give the means to measure it. |
| U09-2 | Multi-node parallel job with EFA inside a Capacity Block | F10-65 | Still open, and now wider (U10-10). |

## 12. Source list by tier

### Tier 1 (AWS documentation, API reference, source at a pinned ref)

- AWS Batch User Guide, pages listed in section 3: https://docs.aws.amazon.com/batch/latest/userguide/
- AWS Batch API Reference, pages listed in section 3: https://docs.aws.amazon.com/batch/latest/APIReference/
- Amazon EC2 User Guide, "Spot Instance interruption notices": https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html
- Amazon EC2 User Guide, "Behavior of Spot Instance interruptions": https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/interruption-behavior.html
- Amazon ECS Developer Guide, "Configuring Amazon ECS Linux container instances to receive Spot Instance notices": https://docs.aws.amazon.com/AmazonECS/latest/developerguide/spot-instance-draining-linux-container.html
- Amazon ECS Developer Guide, "Draining Amazon ECS container instances": https://docs.aws.amazon.com/AmazonECS/latest/developerguide/container-instance-draining.html
- aws/amazon-ecs-agent README at v1.108.3: https://github.com/aws/amazon-ecs-agent/blob/51cd882c8ea69d61d659378b1fb0b7fe585d6915/README.md

### Tier 2 (What's New posts, AWS blogs)

- What's New posts listed in the currency table (2025 and 2026), all under https://aws.amazon.com/about-aws/whats-new/
- AWS Machine Learning blog, 22 APR 2026: https://aws.amazon.com/blogs/machine-learning/cost-effective-multilingual-audio-transcription-at-scale-with-parakeet-tdt-and-aws-batch/
- AWS HPC blog, 04 AUG 2026: https://aws.amazon.com/blogs/hpc/resilient-hpc-and-ml-on-aws-running-tightly-coupled-workloads-on-spot-instances/
- AWS HPC blog, 13 JAN 2026: https://aws.amazon.com/blogs/hpc/optimize-nextflow-workflows-on-aws-batch-with-mountpoint-for-amazon-s3/
- AWS HPC blog, 24 NOV 2025: https://aws.amazon.com/blogs/hpc/running-nvidia-cosmos-world-foundation-models-on-aws/
- AWS HPC blog, 17 MAR 2025: https://aws.amazon.com/blogs/hpc/scale-reinforcement-learning-with-aws-batch-multi-node-parallel-jobs/
- AWS HPC blog, AWS Batch category feed (used to list posts): https://aws.amazon.com/blogs/hpc/category/compute/aws-batch/feed/

### Tier 3 and Tier 4

None cited. Web search was used only to locate first-party pages.
