# Wave 5: refutation of the round 2 AWS registers (10a, 10b, 10c)

- **Date:** 2026-11-20. Every URL below was fetched today.
- **Who:** a refuter that did not write registers 10a (AWS Batch), 10b (AWS Parallel Computing Service and SageMaker HyperPod) or 10c (Amazon EKS and EC2 Spot).
- **Method, pass 1 (mechanical):** every `Evidence` line of the 232 register entries was parsed into (URL, quoted strings). All 300 fetchable URLs were downloaded again (AWS docs in markdown form, GitHub files raw at the pinned SHA, What's New and blog pages as HTML) with `curl` and a generic client name. Each of 1,254 quoted strings was searched for in its page after normalising whitespace, quotes, dashes and markdown markers.
- **Method, pass 2 (by hand):** the claims the sections print as a number, default, limit, state name, field name or ordering were re-read against the page text, as were each register's section 10, every "AWS recommends", the Spot sequence per service and every field of the assembled snippets.
- **Verdict words:** CONFIRMED / WRONG / NARROWER than written / STALE / NOT FOUND on the page.

## Pass 1 result

1,180 of 1,254 quotes matched on the first pass. The 74 that did not were read by hand; see "Pass 1 leftovers" below.

## Section 25, AWS Batch (register 10a, `src/sections/AwsBatch.tsx`)

Base for the URLs: `https://docs.aws.amazon.com/batch/latest/` (fetched as `.md`).

| ID | Claim as the register or section states it | URL fetched | Verdict |
|---|---|---|---|
| F10-1 | A managed compute environment wraps launch templates, Auto Scaling groups, Spot Fleets and an ECS cluster; Batch "can terminate instances, stop tasks, or scale the cluster at any time" | userguide/managed_compute_environments | CONFIRMED |
| F10-2 | `type` has five values, `EC2`, `SPOT`, `FARGATE`, `FARGATE_SPOT`, `ECS_MANAGED_INSTANCES`; no multi-node parallel jobs on Spot or ECS Managed Instances | APIReference/API_ComputeResource | CONFIRMED |
| F10-3, F10-4 | `minvCpus` floor, `maxvCpus` ceiling, `desiredvCpus` moved by Batch; docs recommend not setting it, lowering is refused | APIReference/API_ComputeResource, userguide/scaling-updates, userguide/error-desired-vcpus-update | CONFIRMED |
| F09-4 | Batch may exceed `maxvCpus` by at most one instance | APIReference/API_ComputeResource | CONFIRMED ("With any allocation strategy except `BEST_FIT` using On-Demand (`EC2`) compute resources ... never exceeds `maxvCpus` by more than a single instance"). Applies to both environments of the figure, so the "four instances" of `gpu-spot` can be five. The section already prints the rule; no change needed. |
| F10-8 | Default allocation strategy is `BEST_FIT` on ECS; `BEST_FIT` environments "don't support infrastructure updates" | APIReference/API_ComputeResource | CONFIRMED |
| F10-9 | `bidPercentage`: "For most use cases, we recommend leaving this field empty."; `spotIamFleetRole` only with `BEST_FIT` or no strategy | APIReference/API_ComputeResource | CONFIRMED |
| F10-10 | Two pages disagree: allocation-strategies recommends `SPOT_PRICE_CAPACITY_OPTIMIZED`, Spot best practices says "Choose the SPOT_CAPACITY_OPTIMIZED allocation strategy" | userguide/allocation-strategies, userguide/bestpractice6 | CONFIRMED (all four quoted strings present) |
| F10-13 | `imageType` `ECS_AL2023_NVIDIA` exists and is "Default for all GPU instance families" | APIReference/API_Ec2Configuration | CONFIRMED |
| F10-16 | `updatePolicy.jobExecutionTimeoutMinutes` "The default value is 30. The maximum value is 7200." | APIReference/API_UpdatePolicy | CONFIRMED |
| F10-18 | ECS Managed Instances drained "at day 14 from instance launch"; On-Demand environments must precede Spot in the order | userguide/ecs-managed-instances-instance-draining, userguide/ecs-managed-instances-job-queues | CONFIRMED |
| F10-20 | Queue priority: "a higher integer value for the `priority` parameter" is evaluated first, "when associated with the same compute environment" | APIReference/API_CreateJobQueue | CONFIRMED |
| F10-22 | A later compute environment "is scaled up when the preceding ones have reached their maxvCpus, or when the runnable jobs at the front of the job queue cannot be satisfied by any instance types available in the preceding compute environments" | APIReference/API_ComputeEnvironmentOrder | CONFIRMED. The register's inference (a Spot shortage under the ceiling matches neither) is labelled an open question in the section; that label is correct and must stay. |
| F10-23, F10-24, F10-25 | State names and order; `RUNNABLE` "indefinitely"; array parent in `PENDING`; state kept "at least 7 days"; log group `/aws/batch/job` | userguide/job_states | CONFIRMED |
| F10-27 | `jobStateTimeLimitActions`: fields `reason`, `state`, `maxTimeSeconds`, `action`; 600 to 86,400; `CANCEL`; reason `CAPACITY:INSUFFICIENT_INSTANCE_CAPACITY`; 14400 in AWS's example | APIReference/API_JobStateTimeLimitAction, userguide/job_stuck_in_runnable_time_limit_actions | CONFIRMED (all four field names, spelling and nesting as in the section's queue snippet) |
| F10-30 | FIFO or fair share fixed at creation | APIReference/API_CreateJobQueue | CONFIRMED ("can't have a fair-share scheduling policy added"; a policy "can be replaced but can't be removed") |
| F10-31 | `weightFactor` default 1.0, lower earns more | APIReference/API_ShareAttributes | CONFIRMED |
| F10-34 | "Quota management is the only AWS Batch scheduling algorithm to incorporate preemption" | userguide/preemption | CONFIRMED |
| F10-35, F10-66 | Up to 20 quota shares per quota management job queue | userguide/service_limits | CONFIRMED |
| F10-40 | `minScaleDownDelayMinutes` 20 to 10080; "Use 0 to unset"; idle instances billable; three exclusions incl. reclaimed Spot | APIReference/API_ComputeScalingPolicy | CONFIRMED |
| F10-42 | "Consider grouping tasks so the jobs run 3-5 minutes each" | userguide/bestpractice1 | CONFIRMED |
| F10-43 | Job definition maximum 24 KiB | userguide/service_limits | CONFIRMED |
| F10-46 | Timeout minimum 60 seconds; SIGTERM, SIGKILL after 30 seconds; timed-out job "isn't retried" | userguide/job_timeouts, APIReference/API_SubmitJob | CONFIRMED |
| F10-49 | Multi-node parallel job: "up to 1,000 nodes" | userguide/mnp-node-groups | NARROWER than written. See correction B1. |
| F10-52 | Default one attempt; `evaluateOnExit` with no match means retry; `AWS_BATCH_JOB_ATTEMPT` starts at 1 | userguide/job_retries | CONFIRMED |
| F10-53 | "we recommend that you set at least 1-3 automated retries"; a retried job "is placed at the front of the job queue" | userguide/bestpractice6 | CONFIRMED |
| F09-10 | The two retry rules of the section's job definition (`onStatusReason` `Host EC2*` RETRY, `onReason` `*` EXIT) | userguide/bestpractice6 | CONFIRMED, character for character |
| F10-55 | Spot draining "default for new or updated compute environments as of October 9, 2026"; ECS's own page: "Spot Instance draining is turned off by default." | userguide/bestpractice6, AmazonECS developerguide/spot-instance-draining-linux-container | CONFIRMED |
| F10-56 | Standalone tasks on a draining instance "are unaffected"; no documented signal on the Spot notice | AmazonECS developerguide/container-instance-draining | CONFIRMED as quoted. The step from "standalone task" to "Batch job" is the register's reading and the section says so. |
| F10-12 | Spot then On-Demand through two queues, EventBridge and Lambda or Step Functions | userguide/bestpractice5 | CONFIRMED |
| F10-39 | Metric names `JobAttemptRunnableToStartingDuration`, `JobAttemptStartingToRunningDuration` | userguide/using_cloudwatch_metrics | CONFIRMED |
| F10-14 | `batchImageStatus` field | APIReference/API_Ec2Configuration | CONFIRMED |
| F10-65 | "Instance market options (AWS Batch must control Spot Instance configuration)" is in the list of launch template parameters "**ignored** by AWS Batch" | userguide/launch-templates | CONFIRMED |
| F09-5, F09-130 | Array size "between 2 and 10,000"; `arrayProperties.size` | APIReference/API_SubmitJob | CONFIRMED |
| Snippet | Compute environment fields `computeEnvironmentName`, `type`, `state`, `computeResources.{type, allocationStrategy, minvCpus, maxvCpus, instanceTypes, subnets, securityGroupIds, instanceRole, ec2Configuration[].imageType}` | APIReference/API_ComputeResource, API_Ec2Configuration | CONFIRMED |
| Snippet | Job definition fields `containerProperties.resourceRequirements[].{type,value}` with `VCPU`, `MEMORY`, `GPU`; `retryStrategy.{attempts, evaluateOnExit[]}`; `timeout.attemptDurationSeconds`; `Ref::checkpoint` | userguide/job_definition_parameters | CONFIRMED |

Spot end to end on Batch: the notice, the drain default, "no signal documented" and the retry to the front of the queue each hold on the page cited. The link between them (attempt fails with a `Host EC2*` status reason after a reclaim) is not printed on any Batch page beyond the retry example; the section marks it as a reading in the claims file and the wording is acceptable.

## Section 26, AWS Parallel Computing Service (register 10b, `src/sections/AwsPcs.tsx`)

Base: `https://docs.aws.amazon.com/pcs/latest/`. For this section the whole PCS User Guide was downloaded (215 pages from its table of contents), so "no page says" claims were tested against every page, not only the ones the register read.

| ID | Claim | URL fetched | Verdict |
|---|---|---|---|
| F10-202 | Small 32 instances / 256 jobs, Medium 512 / 8192, Large 2048 / 16384; count includes "running, pending, and recently completed jobs"; completed jobs kept "by default, 5 minutes"; size cannot be changed | userguide/working-with_clusters_size, userguide/troubleshooting-job-submission-maxjobcount | CONFIRMED |
| F10-203 | Slurm 26.05, 25.11, 25.05 offered; 25.05 end of life 11/30/2026 | userguide/slurm-versions | CONFIRMED (26.05 EOL 11/30/2027, 25.11 EOL 5/31/2027) |
| F10-207 | `purchaseOption` values `ONDEMAND`, `SPOT`, `CAPACITY_BLOCK`, `INTERRUPTIBLE_CAPACITY_RESERVATION` | APIReference/API_CreateComputeNodeGroup | CONFIRMED |
| F10-209 | Spot allocation strategy: `lowest-price`, `capacity-optimized`, `price-capacity-optimized` "(the default)" | userguide/working-with_cng_create | CONFIRMED |
| F10-213 | Simultaneous multithreading off | userguide (pcs-agent-versions, cng pages) | CONFIRMED |
| F10-217 | "At regular intervals, AWS PCS reviews waiting jobs"; "A job runs only after all required nodes are available. It does not start on a partial allocation." | userguide/scaling-job-level | CONFIRMED |
| F10-218 | `scaleDownIdleTimeInSeconds` "Default: `600`", range 1 to 10000000; per-group override | APIReference/API_ClusterSlurmConfigurationRequest, userguide/working-with_clusters_create, userguide/doc-history | NARROWER in the section than in the register. See correction P1. |
| F10-219 | Scaling log codes `LAUNCHED`/`SCHEDULER_REQUESTED`, `REGISTERED`, `ACTIVE`, `TERMINATED`/`SCHEDULER_REQUESTED`, `TERMINATED`/`EXTERNALLY_TERMINATED` | userguide/monitoring_scaling-logs | CONFIRMED (the table has no status or reason code that names Spot) |
| F10-221 | "approximately 30 minutes until Slurm's ResumeTimeout is reached" | userguide/troubleshooting-compute-node-bootstrap | CONFIRMED (also "The node has approximately 30 minutes to join Slurm" on cng-node-lifecycle-actions-best-practices) |
| F10-222 | Capacity Block expiry: "By default, active jobs are automatically re-queued, but might have errors or fail."; I-ODCR: "Implement checkpointing so jobs can save intermediate results and resume after interruption." | userguide/capacity-blocks-faq, userguide/capacity-reservations-iodcr | CONFIRMED |
| F10-223 | `requeue_delay` "5 seconds by default"; `--requeue=expedite` from 25.11 | userguide/mig-configuration, userguide/slurm-versions_release-notes | CONFIRMED |
| F10-225, snippet | `Features` is a settable compute node group Slurm setting; `slurmCustomSettings=[{parameterName=Features,parameterValue=...}]` | userguide/slurm-custom-settings-cng, userguide/working-with_cng_create | CONFIRMED |
| F10-228, snippet | `sbatch -p demo job.sh`, `squeue --job {{job-id}}` | userguide/getting-started_run-job | CONFIRMED |
| F10-229 | slurmrestd on port 6820 | userguide/monitoring_scheduler-logs, userguide/slurm-metrics-prometheus | CONFIRMED for the port |
| F10-231, snippet | The Lustre user-data block, verbatim | userguide/working-with_file-systems | CONFIRMED verbatim. See note P2. |
| F10-232 | "If you choose multiple subnets, EFA communications won't be available between nodes" | userguide/working-with_cng_create | CONFIRMED |
| F10-233, snippet | EFA launch template block incl. the missing comma; "We recommended you include a **cluster** placement group" | userguide/working-with_networking_efa_create-lt, userguide/working-with_networking_placement-groups | CONFIRMED |
| F10-234 | Capacity Block warning event "40 minutes before" expiry | userguide/capacity-blocks-faq | CONFIRMED |
| F10-239 | 10 compute node groups and 10 queues per cluster by default | userguide/service-endpoints-quotas | CONFIRMED |
| F10-244 | No PCS page documents drain, signal or requeue on a Spot interruption notice | all 215 pages of the PCS User Guide | CONFIRMED, and now on stronger ground: a search of every page for "interrupt", "reclaim", "two-minute", "2-minute" and "rebalance" returns only the I-ODCR page, the login-node advice ("Choose on-demand purchase option to avoid having your instance(s) reclaimed") and the version-upgrade page. |
| Snippet | `aws pcs create-cluster --scheduler type=SLURM,version=26.05 --size SMALL --networking subnetIds=,securityGroupIds= --slurm-configuration scaleDownIdleTimeInSeconds=600,accounting='{mode=STANDARD}'` | userguide/working-with_clusters_create, userguide/slurm-accounting | CONFIRMED (option names and nesting match AWS's printed commands) |
| Snippet | `create-compute-node-group` options `--purchase-option SPOT`, `--custom-launch-template id=,version=`, `--scaling-configuration minInstanceCount=,maxInstanceCount=`, `--instance-configs instanceType=` | userguide/working-with_cng_create | CONFIRMED. One prerequisite is missing from the section; see correction P3. |
| F09-76 (figure) | Two `g6e.12xlarge` nodes talk over EFA | AWSEC2/latest/UserGuide/efa | CONFIRMED: `g6e.12xlarge` is in the EFA supported-types table. |

Spot end to end on PCS: confirmed that AWS documents nothing between "EC2 reclaims the instance" and "the node is logged EXTERNALLY_TERMINATED". The section's figure caption and its "expected and unconfirmed" wording are accurate.

## Section 27, Amazon SageMaker HyperPod (register 10b, `src/sections/HyperPod.tsx`)

Base: `https://docs.aws.amazon.com/sagemaker/latest/`.

| ID | Claim | URL fetched | Verdict |
|---|---|---|---|
| F10-301 | CreateCluster top-level members `InstanceGroups`, `Orchestrator`, `NodeRecovery`, `NodeProvisioningMode`, `AutoScaling` | APIReference/API_CreateCluster | CONFIRMED |
| F10-306 | "Continuous provisioning is the default for new HyperPod clusters on both orchestrators" | dg/sagemaker-hyperpod-scaling-eks, dg/sagemaker-hyperpod-scaling-slurm, APIReference/API_CreateCluster | NARROWER than written. See correction H1. |
| F10-307 | `MinInstanceCount`: "If this threshold isn't met within 3 hours, the instance group rolls back" | APIReference/API_ClusterInstanceGroupSpecification | CONFIRMED |
| F10-308 | Flexible group: "up to 20 instance types" | dg/sagemaker-hyperpod-eks-operate-cli-command-create-cluster | CONFIRMED |
| F10-309 | `CapacityRequirements` `{ "Spot": {} }`; cannot be modified after creation | APIReference/API_ClusterCapacityRequirements, dg/sagemaker-hyperpod-scaling-eks | CONFIRMED |
| F10-310 | Five Spot steps; "best-effort 2-minute interruption notice in most cases, but this notice is not guaranteed" | dg/sagemaker-hyperpod-spot | CONFIRMED as a list. The section's worked case attributes step 5 to a different mechanism; see correction H3. |
| F10-311 | "Karpenter prioritizes Spot instance groups over On-Demand instances"; sorted by Spot placement score; "Set it to non zero upto 2 min ..." is about `consolidateAfter` | dg/sagemaker-hyperpod-spot | CONFIRMED (the tip sits directly under the NodePool example and names `consolidateAfter: 0`) |
| F10-312 | Karpenter prerequisites; "up to 10 instance groups in a `NodeClass`"; "Only on-demand capacity is supported at this time"; DHC "around 60-90 minutes" | dg/sagemaker-hyperpod-eks-autoscaling, -nodeclass, -nodepool | CONFIRMED, including the contradiction with the Spot page |
| F10-314 | `NodeRecovery` `Automatic` or `None` | APIReference/API_CreateCluster | CONFIRMED for the values |
| F10-316 | Two annotations, `restartPolicy: OnFailure`, node selector `sagemaker.amazonaws.com/node-health-status: Schedulable`; Kubeflow Training Operator `1.7.0`, `1.8.0`, or `1.8.1` | dg/sagemaker-hyperpod-eks-run-jobs-kubectl | CONFIRMED |
| F10-318 | DCGM level 4 "~45-90 minutes depending on GPU count"; "about a couple of hours" | dg/sagemaker-hyperpod-resiliency-slurm-deep-health-checks, dg/sagemaker-hyperpod-eks-resiliency-config-tips | CONFIRMED, NARROWER in one respect: the 45-90 minute figure is printed on the Slurm deep-health-check page only. The EKS deep-health-check page lists the same DCGM level 4 test with no duration, and the EKS NodeClass page says "around 60-90 minutes". The section uses 45 to 90 on the EKS path; see correction H4. |
| F10-320 | `SchedulerConfig.{FairShare, PriorityClasses[].{Name, Weight}}`; weight 0 to 100; `ComputeQuotaConfig.{ComputeQuotaResources[].{InstanceType, Count}, PreemptTeamTasks, ResourceSharingConfig.{Strategy, BorrowLimit}}`; `ComputeQuotaTarget.TeamName`; add-on v1.6.1-eksbuild.1 installs Kueue v0.19.2 | APIReference/API_CreateClusterSchedulerConfig, API_CreateComputeQuota, API_PriorityClass, API_ResourceSharingConfig, dg/...governance-setup-task-governance | CONFIRMED, every field name and nesting. Note for the author: `BorrowLimit` has "Default is `50`" and "Valid Range: Minimum value of 0. Maximum value of 10000", and the same member's description still says "The values can be 1 - 500 percent"; the policies page says "up to 10,000%" and "expressed as a percentage of their guaranteed quota". The section's reading is the supported one. |
| F10-321 | Labels `kueue.x-k8s.io/queue-name: hyperpod-ns-{team}-localqueue` and `kueue.x-k8s.io/priority-class: {name}-priority` | dg/...governance-cli | CONFIRMED (the snippet's `training-priority` for a class named `training` is the documented form) |
| F10-327 | "each P5 instance can create 81 IP addresses" under EKS | dg/sagemaker-hyperpod-prerequisites | CONFIRMED |
| F10-329 | Kubernetes 1.30 to 1.35 | dg/sagemaker-hyperpod-eks-prerequisites | CONFIRMED ("1.30, 1.31, 1.32, 1.33, 1.34, and 1.35") |
| Snippet | `AutoScaling: { "Mode": "Enable", "AutoScalerType": "Karpenter" }` | APIReference/API_ClusterAutoScalingConfig | CONFIRMED for names and values; the request is incomplete, see correction H2. |
| Snippet | `OnStartDeepHealthChecks: ["InstanceStress", "InstanceConnectivity"]`, `TrainingPlanArn`, `OverrideVpcConfig.{SecurityGroupIds, Subnets}`, `InstanceCount: 0` | APIReference/API_ClusterInstanceGroupSpecification | CONFIRMED |
| Snippet | `ml.g7e.2xlarge` is a HyperPod instance type | APIReference/API_ClusterInstanceGroupSpecification | CONFIRMED (in the valid-values list) |
| Snippet | HyperpodNodeClass block, "copied" | dg/sagemaker-hyperpod-spot | CONFIRMED verbatim |
| Snippet | NodePool block, AWS prints `consolidateAfter: 0s` | dg/sagemaker-hyperpod-eks-autoscaling-nodepool | CONFIRMED |

## Section 28, Amazon EKS, and EC2 Spot (register 10c, `src/sections/Eks.tsx`)

`Eks.tsx` was no longer a stub when this pass reached it (1,381 lines, four snippets), so it was checked directly. Karpenter pages are the raw files at the pinned commit `8c91894e993eda682f0785091b79a93da68f9830` (tag v1.15.3) of `aws/karpenter-provider-aws`, under `website/content/en/docs/`. Kueue files are at `e854ec82e404436b261c81f0341ac9de8508f97c` (v0.20.7). EKS pages are under `https://docs.aws.amazon.com/eks/latest/`, EC2 pages under `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/`.

| ID | Claim | URL fetched | Verdict |
|---|---|---|---|
| F10-420 | `karpenter.sh/do-not-disrupt` "blocks voluntary disruption of the pod's node"; it does not protect against interruption | Karpenter concepts/disruption.md | NARROWER than the page, and the omission breaks the section's Spot sequence. See correction E1 (the most serious finding of this pass). |
| F10-418 | On a Spot interruption warning Karpenter "will begin draining the node while in parallel provisioning a new node"; "2 minute notice" | Karpenter concepts/disruption.md | CONFIRMED for a pod without the annotation |
| F10-419 | No taint, drain or terminate logic for rebalance recommendations | Karpenter concepts/disruption.md | CONFIRMED ("Karpenter does not currently support taint, drain, and terminate logic for Spot Rebalance Recommendations.") |
| F10-404 | Batching window: idle 1 second, maximum 10 seconds | Karpenter reference/settings.md | CONFIRMED (`BATCH_IDLE_DURATION` default 1s, `BATCH_MAX_DURATION` default 10s) |
| F10-403 | "Karpenter takes 59 other instance types ... and passes all 60 instance type options to an API called Amazon EC2 Fleet"; price-capacity-optimized | Karpenter faq.md | CONFIRMED |
| F10-402 | Order reserved, spot, on-demand; unavailable capacity cached "for the next 3 minutes"; fallback "generally within milliseconds" | Karpenter concepts/nodepools.md | CONFIRMED |
| F10-410 | A NodePool taint `nvidia.com/gpu`: "In order for a pod to run on a node defined in this NodePool, it must tolerate `nvidia.com/gpu` in its pod spec." | Karpenter concepts/nodepools.md | CONFIRMED. See note E4: the section's Job and ResourceFlavor print no toleration. |
| F10-412, F10-415 | Budget `reasons` values `Empty`, `Drifted`, `Underutilized`; `consolidationPolicy`, `consolidateAfter` | Karpenter concepts/disruption.md | CONFIRMED |
| F10-416 | `expireAfter` and `terminationGracePeriod` under `spec.template.spec` | Karpenter concepts/nodepools.md, disruption.md | CONFIRMED |
| Snippet | NodePool requirement keys `karpenter.sh/capacity-type`, `karpenter.k8s.aws/instance-category`, `karpenter.k8s.aws/instance-generation`, `karpenter.k8s.aws/instance-gpu-memory` ("Number of mebibytes of memory on the GPU"), `kubernetes.io/arch`; `nodeClassRef.{group, kind, name}`; `weight`; `limits` | Karpenter concepts/scheduling.md, nodepools.md | CONFIRMED |
| F10-450, snippet | Kueue API version `kueue.x-k8s.io/v1beta2` for ResourceFlavor, ClusterQueue, LocalQueue; `resourceGroups[].coveredResources`, `flavors[].resources[].nominalQuota`; `spec.clusterQueue` | Kueue site/static/examples/admin/single-clusterqueue-setup.yaml | CONFIRMED |
| F10-457, snippet | TrainJob block, `trainer.kubeflow.org/v1alpha1`, `activeDeadlineSeconds`, `runtimeRef` | kubeflow/trainer docs/user-guides/trainjob-lifecycle.md at `a7b05c24ff0f145368529b5d180c223baf965ef5` | CONFIRMED verbatim |
| Section text | "The Job runs in indexed mode" | `Eks.tsx` snippet `EVAL_JOB`; kubernetes.io Job page | WRONG against the section's own snippet. See correction E2. |
| F10-432 | Auto Mode: "Terminates instances after 336 hours"; "21-day maximum node lifetime" | eks userguide/create-node-pool, userguide/automode | CONFIRMED |
| F10-461, F10-462 | "After 10 minutes of an unhealthy GPU condition the node is replaced or rebooted"; Karpenter v1.15.0 and later "allows 5 or 10 minutes" | eks userguide/node-repair, userguide/node-health-nma | NARROWER than written. See correction E3. |
| F10-442 | DRA: Auto Mode "On Kubernetes version 1.36 and later"; recommended for new deployments on 1.34 and later | eks userguide/auto-accelerated, userguide/device-management | CONFIRMED |
| F10-520 | "issued two minutes before Amazon EC2 stops or terminates your Spot Instance"; "check for these interruption notices every 5 seconds"; EventBridge and instance metadata | AWSEC2 spot-instance-termination-notices | CONFIRMED |
| F10-522 | "it is possible that your Spot Instance is interrupted before the warnings can be made available" | AWSEC2 prepare-for-interruptions | CONFIRMED |
| F10-529 | "at least 10 instance types for each workload" | AWSEC2 spot-best-practices | CONFIRMED |
| F10-530 | "We strongly discourage ... attempting to fail over to On-Demand Instances to handle interruptions or periods of unavailability. Failing over to On-Demand Instances can inadvertently drive interruptions for your other Spot Instances." | AWSEC2 spot-best-practices | CONFIRMED, with a scope note. See note E5. |
| F10-533 | "All G and VT Spot Instance Requests", default 0 | AWSEC2 using-spot-limits | CONFIRMED |
| F10-538 | Spot Instance Advisor file: `Last-Modified: Fri, 20 Mar 2026 23:38:55 GMT`, 1,190,579 bytes, bands `<5%` to `>20%` | spot-bid-advisor.s3.amazonaws.com/spot-advisor-data.json (HEAD and body) | CONFIRMED |
| 10c section 10, F09-48 | Auto Mode default lifetime is 14 days, 21 is the ceiling | as F10-432 | CONFIRMED |
| 10c section 10, node repair contradiction | Karpenter docs describe force-termination; the EKS guide gives 5 or 10 minutes from v1.15.0 | eks userguide/node-repair | CONFIRMED that the EKS guide prints the table (5m, 10m) |
| 10c section 10, F09-11 | Batch and EKS give two different Spot job-length figures | batch userguide/bestpractice5, bestpractice6; eks best-practices/aiml-compute | CONFIRMED by pass 1 (quotes present) |

Spot end to end on EKS: the sequence holds on the Karpenter page for an ordinary pod. It does not hold for the pod the section actually prints, because that pod carries `karpenter.sh/do-not-disrupt: "true"` (correction E1).

## Section 24, the overview (`src/sections/AwsOrchestration.tsx`)

Section 24 cites 45 round 2 entries. Every one of their quotes was covered by pass 1. The sentences that the corrections below touch were searched for in section 24 ("1,000 nodes", "both orchestrators", "do-not-disrupt", "After 10 minutes", "45 to 90"): none appears there, so the corrections are confined to sections 25, 27 and 28. Section 24 was not otherwise re-read line by line.

## Pass 1 leftovers

Of the 74 strings that did not match mechanically:

- 34 were parser or markdown artefacts (a list written with "+" on the page and joined in the register, a table cell split across "|", a markdown link cut at "](", a backslash-escaped underscore). Each was found by hand on its page. Examples: F10-17, F10-40, F10-65, F10-66, F10-201, F10-223, F10-228, F10-232, F10-235, F10-308, F10-309, F10-316, F10-405, F10-410, F10-414, F10-420, F10-424, F10-425, F10-443, F10-453, F10-521, F10-529.
- F10-538 (the advisor file's headers and band labels), F10-68 (the reinforcement-learning blog sentence) and F10-400 (the v1.15.3 release note) were re-read by hand and are present.
- About 20 are version-and-date strings from GitHub API release lists (for example "v1.15.3 2026-11-20T19:27:35Z"). The release lists were not re-fetched in this pass, so the currency table's release dates are unverified by the refuter. Nothing in sections 25 to 28 depends on a release date beyond the version labels.

No fabricated quotation was found in any of the three registers.

## Corrections the sections need

Most serious first.

### E1. `Eks.tsx`: the Spot sweep's pod carries `do-not-disrupt`, which stops Karpenter's drain from sending it SIGTERM

The page (Karpenter v1.15.3, `concepts/disruption.md`, the same page F10-420 quotes) says:

> "Like pods with a blocking PDB, pods with an active `karpenter.sh/do-not-disrupt` annotation will **not** be gracefully evicted by the [Termination Controller]. Karpenter will not be able to complete termination of the node until one of the following conditions is met: - All pods with the `karpenter.sh/do-not-disrupt` annotation are removed, or their annotation becomes inactive (duration has elapsed). - All pods with the `karpenter.sh/do-not-disrupt` annotation have entered a terminal phase (`Succeeded` or `Failed`). - The owning NodeClaim's `terminationGracePeriod` has elapsed."

and, on the timing: "pods will be preemptively deleted before the Node's `terminationGracePeriod` has elapsed", with the example of a pod deleted 55 minutes into a 1 hour period.

What the section prints: the `EVAL_JOB` snippet sets `karpenter.sh/do-not-disrupt: "true"` on the sweep's pods; the `SPOT_NODEPOOL` snippet sets `terminationGracePeriod: 2h`; step 3 of the worked case says "The pod receives SIGTERM and spends its grace period, raised from the default 30 seconds to just under the two minutes, writing a last checkpoint to S3"; the cluster figure's caption says "Pod 2 receives SIGTERM and writes a last checkpoint"; and the first consequence under the figure says "On the warning the pod receives SIGTERM".

Reading the quoted rule against those values `[SPECULATIVE: derived from the page, not tested on a cluster]`: on a Spot warning Karpenter starts the drain, skips the annotated pod, and would delete it only about 110 seconds before the 2 hour node grace period ends. EC2 takes the instance at two minutes. The pod gets no SIGTERM from the drain and the 110 second grace period is never used.

Correction, smallest form:
1. `Eks.tsx`, snippet `EVAL_JOB`: delete the two lines `annotations:` and `karpenter.sh/do-not-disrupt: "true"` (and the `metadata:` line above them if it is left empty). In the snippet's `ours` note, change "the `do-not-disrupt` annotation and a grace period of 110 seconds" to "and a grace period of 110 seconds".
2. `Eks.tsx`, disruption table, row `karpenter.sh/do-not-disrupt`: after "that blocks voluntary disruption of the pod's node" add: "A pod that carries it is also not evicted when its node drains, so on a Spot warning it receives no SIGTERM. Use it on On-Demand and reserved pools, never on a Spot pool whose pods checkpoint on SIGTERM."
3. Nothing changes on the Spot pool by removing it: `WhenEmpty` consolidation never touches a node with a running pod, and the pool's budget already sets `Drifted` to 0.
4. Register 10c, section 7.2, the bullet "Jobs also carry `karpenter.sh/do-not-disrupt: "true"` as a second guard (F10-420); neither stops a Spot reclaim" needs the same qualification when the register is next revised. The refuter did not edit it.

The multi-node training case (line 1058, On-Demand and reserved pool) keeps the annotation and is correct as written.

### E2. `Eks.tsx`: "The Job runs in indexed mode" does not match the Job that is printed

The `EVAL_JOB` snippet has `parallelism: 4` and `completions: 4` and no `completionMode`. A Job without that field is `NonIndexed` (the kubernetes.io Job page prints `completionMode: NonIndexed` in its default output). The text under the snippet says "The Job runs in indexed mode, the standard Kubernetes form that hands each pod its own number, and the program uses that number as its seed", and step 4 says "creates a new pod with the same index".

Correction: add `completionMode: Indexed` under `spec:` in `EVAL_JOB`, and add "`completionMode: Indexed`" to the snippet's `ours` list. The same paragraph says "The path `/ckpt` is a volume backed by S3"; the snippet has no `volumes` or `volumeMounts`. Either add them or change the sentence to "The path `/ckpt` would be a volume backed by S3 through the Mountpoint CSI driver; the volume is left out of the block for length."

### H3. `HyperPod.tsx`: the restart after a Spot eviction is attributed to job auto-resume; the Spot page attributes it to Kubernetes

The Spot page's step 5: "Reschedules workloads: Kubernetes automatically reschedules evicted pods on healthy nodes". The auto-resume text on the kubectl page describes nodes that "have passed the SageMaker HyperPod health check" and never mentions Spot. No page read says a Spot eviction is counted against `sagemaker.amazonaws.com/job-max-retry-count`.

Sentences to change:
- Line 669, worked case step "Resumed": "Job auto-resume restarts the job, up to the retry count in the annotation, and the script loads the newest checkpoint." New wording: "Kubernetes reschedules the evicted pod onto it (the job's `restartPolicy: OnFailure` recreates the pod), and the script loads the newest checkpoint. The auto-resume annotations are documented for node faults; no page read says whether a Spot eviction counts against their retry count."
- Line 226, figure caption: "Job auto-resume restarts P2, the first of the two retries its annotation allows" and the scheduler label "P2 restarted, retry 1 of 2". New wording: "Kubernetes reschedules P2 on the new node" and "P2 rescheduled".
The node-fault step later in the same figure is where auto-resume belongs, and it is correct there.

### H2. `HyperPod.tsx`: the create-cluster snippet enables Karpenter autoscaling and omits `ClusterRole`

API Reference, CreateCluster, `ClusterRole`: "The Amazon Resource Name (ARN) of the IAM role that HyperPod assumes to perform cluster autoscaling operations. This role must have permissions for `sagemaker:BatchAddClusterNodes` and `sagemaker:BatchDeleteClusterNodes`. This is only required when autoscaling is enabled and when HyperPod is performing autoscaling operations." AWS's own Spot example passes `--cluster-role` and `--vpc-config`.

Correction: in the snippet add `"ClusterRole": "<your autoscaling role ARN>",` after `"ClusterName"`, and change the `ours` note from "ExecutionRole and LifeCycleConfig are left out for length" to "ExecutionRole, LifeCycleConfig and VpcConfig are left out for length".

### H1. `HyperPod.tsx` line 407: "The default way groups are filled, on both orchestrators"

Three first-party pages disagree for Slurm. The Slurm continuous-provisioning page says both "Continuous provisioning is available as an optional configuration for HyperPod clusters created with Slurm orchestration" and "Continuous provisioning is the default for new clusters." The API Reference for `NodeProvisioningMode` says "This mode is only supported for EKS orchestrated clusters."

Correction: "The default way groups are filled on the EKS path. For Slurm the pages disagree: the Slurm page calls it both optional and the default, and the API Reference says the mode is for EKS-orchestrated clusters only, so set `NodeProvisioningMode` explicitly and confirm it on a test cluster." The claims file line "Continuous provisioning is the default on both orchestrators" needs the same change.

### E3. `Eks.tsx` line 889: "After 10 minutes of an unhealthy GPU condition the node is replaced or rebooted ... Karpenter v1.15.0 and later allows 5 or 10 minutes"

Two different timers are merged. The 10 minutes is the wait before repair acts on `AcceleratedHardwareReady`. The 5 or 10 minutes is the termination grace period Karpenter v1.15.0 and later applies once repair has started. And the wait is not always 10 minutes on Karpenter: the node-health page says a node with a `DCGMError` or `DCGMHealthCode[Code]` reason "is replaced: after 10 minutes on EKS Auto Mode, and after 30 minutes on Karpenter `v1.15.0` and later", and the node-repair table's second row reads "Any other condition or reason, including an `AcceleratedHardwareReady` reason that fell through to the 30-minute wait | 10m".

Correction: "Repair acts after a wait: 10 minutes for an unhealthy GPU condition on Auto Mode; on self-managed Karpenter v1.15.0 and later, 10 minutes when the reason matches an XID repair policy and 30 minutes otherwise. On Auto Mode pods are then deleted "with a minimal grace period rather than performing a standard drain"; Karpenter v1.15.0 and later gives the pods a grace period of 5 or 10 minutes."

### H4. `HyperPod.tsx`: "about 45 to 90 minutes" is the Slurm page's figure, used on the EKS path

The "~45-90 minutes depending on GPU count" duration for DCGM level 4 is printed on the Slurm deep-health-check page. The EKS deep-health-check page lists the same test with no duration, and the EKS NodeClass page says a deep health check "takes around 60-90 minutes". The section prints 45 to 90 five times (lines 251, 420, 859, 944, 988) inside the EKS path and prints 60-90 once.

Correction (one place is enough, line 420): after "which takes about 45 to 90 minutes depending on GPU count" add "(the figure printed for Slurm clusters; the EKS pages give "around 60-90 minutes" for a whole check)".

### B1. `AwsBatch.tsx` line 626: "up to 1,000 nodes"

Page: "You can have up to 1,000 nodes in a single job. This is the default limit for instances in an Amazon ECS cluster. You can request to increase this limit". Correction: "up to 1,000 nodes by default (the ECS cluster instance limit, which can be raised)".

### P1. `AwsPcs.tsx`: the per-group idle-time override needs Slurm 25.11 or later

Page: "For Slurm 25.11 or later, individual compute node groups can override this value with their own `scaleDownIdleTimeInSeconds` setting." The register has the condition; the figure caption ("600 seconds by default, with an override per compute node group") and the consequences paragraph ("a trade you tune per group") drop it. The section's own cluster is on 26.05, so the statement is true for it. Correction: add "(Slurm 25.11 or later)" at the first mention.

### P3. `AwsPcs.tsx`: the Spot compute node group has an unstated account prerequisite

Page `spot-role`: "If you want to create an AWS PCS compute node group that uses **Spot** as its purchase option, you must also have the **AWSServiceRoleForEC2Spot** service-linked role in your AWS account." The Spot group snippet and the recommendation table do not mention it. Correction: one sentence under the Spot group snippet. This is an addition to a recommended configuration, not a wrong claim; the orchestrator may prefer to backlog it.

### Notes that need no change, or only the author's judgment

- **P2.** The Lustre user data is copied verbatim and correctly labelled. Its first command, `amazon-linux-extras install -y lustre={{latest}}`, is an Amazon Linux 2 command, while the PCS sample images for Slurm 26.05 are named `aws-pcs-sample_ami-al2023-*`. The section already says the first command is not needed on the PCS-ready Deep Learning AMI. No change required.
- **E4.** The `gpu-spot` NodePool taints nodes with `nvidia.com/gpu: NoSchedule`, and neither the `EVAL_JOB` pod template nor the `gpu-spot` ResourceFlavor prints a toleration, although the section's own text says Kueue "writes the flavor's node labels and tolerations into the pod template". Every AWS and Karpenter example read today that sets this taint also prints the toleration on the pod. The block still works on EKS because the EKS platform-versions page lists `ExtendedResourceToleration` among the admission controllers "enabled for all" platform versions (fetched for 1.37: https://docs.aws.amazon.com/eks/latest/userguide/platform-versions.md), and that controller adds the toleration to pods that request `nvidia.com/gpu` `[SPECULATIVE on the mechanism: the controller's behaviour is from Kubernetes documentation not re-fetched in this pass]`. Suggested: add a `tolerations` entry to the ResourceFlavor so the printed text and the printed block agree.
- **E5.** F10-530's sentence sits in a paragraph about workloads that Spot does not suit ("inflexible, stateful, fault-intolerant, or tightly coupled", and those "intolerant of occasional periods when the entire target capacity is not completely available"). The section quotes it as general advice. The wording on the page supports that reading; the author may want "for workloads that cannot wait" beside the quote.
- **Batch, `maxvCpus`.** Both environments in the figure use strategies under which Batch may exceed `maxvCpus` by one instance, so "four instances" and "two instances" are the nominal counts. The section already states the rule.
- **HyperPod, `BorrowLimit`.** The API member's prose still says "1 - 500 percent" above a valid range of 0 to 10000. The section prints the range and matches the policies page ("up to 10,000%").
- **Not checked.** Prices (none printed), release dates from GitHub API lists, and anything requiring an AWS account: no API call was made. The ECS-side claim that a Batch job is a standalone task, the `Host EC2*` status reason after a reclaim, and E1's consequence are readings of pages, not observations.

## Counts

103 rows (claims and snippet field checks). CONFIRMED 96, of which two carry a correction because the section uses the confirmed claim wrongly or incompletely (F10-310, correction H3; the HyperPod `AutoScaling` snippet, correction H2). NARROWER than written 6 (F10-49, F10-218 as the section prints it, F10-306, F10-318, F10-420, F10-461 with F10-462). WRONG 1 (the indexed-mode sentence against its own snippet, correction E2). STALE 0. NOT FOUND on the page 0.

Pass 1 separately: 1,254 quoted strings, about 1,234 found on their pages (1,180 mechanically, the rest by hand), about 20 release-list date strings not re-fetched, none found to be invented.
