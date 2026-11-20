# Claims: section 24, Orchestrating It on AWS

claim | register ID

Spot gives two minutes of warning on a best-effort basis; be flexible across at least 10 instance types; keep Spot away from tightly coupled work | F09-95
A Capacity Block for ML reserves GPU instances for a fixed window, booked ahead and paid up front: start up to eight weeks ahead, offerings in as little as 30 minutes, up to 64 instances per block and 256 across blocks, up to six months, ends 11:30 UTC, cannot be cancelled, moved or split | F09-90
A SageMaker training plan reserves capacity for a HyperPod cluster or a training job: 1 to 182 days, quantities 1 to 64, up to 8 weeks ahead, ends 11:30 AM UTC | F09-34
Savings Plans discounts apply to capacity reservations (a billing construct) | F09-94
Batch owns queue and node provider and removes instances when the queue empties; HyperPod leaves the queue to Slurm or Kueue; on EKS the two are separate (our reading) | F09-13, F09-22, F09-54
The shape-to-orchestrator mapping is the dive's reading; no AWS page comparing Batch, HyperPod and EKS was located (searches of 2026-11-20) | F09-110
Shape A lands on a Batch array job on Spot with retry | F09-5, F09-10
Shape B lands on one Batch job or a SageMaker training job; the AWS sample offers both and picks Batch for back-to-back runs | F09-73
Shape C lands on HyperPod on reserved capacity; AWS's stated case for a persistent cluster | F09-112
Shape D lands on EKS node pools with Kueue quotas and borrowing | F09-55
Shape E has no cloud scheduler; Greengrass delivers it | F07-84
Batch pages on scheduling describe no preemption of a running container job; a queue is FIFO unless a scheduling policy turns on fair share | F09-14
An array job is one submission that spawns 2 to 10,000 children sharing a job definition; each reads AWS_BATCH_JOB_ARRAY_INDEX from 0; 500 evaluation episodes as one array; one failed child fails the parent | F09-5
The documented GPU test job definition (structure, 8 vCPUs, 32000 MiB) and where retryStrategy and timeout sit | F09-129
A GPU resource requirement pins physical GPUs to the container; G6e and G7e sizes are in the supported table | F09-128
Spot retry block: retry on status reason Host EC2*, exit otherwise; 1 to 10 attempts; a retried job goes to the front of the queue | F09-10
Batch has no timeout unless set; timeout is per child; a job ended by its timeout is not retried | F04-50
Spot guidance: avoid jobs of an hour or more, parts of 30 minutes or less | F09-11
SubmitJob sample request and arrayProperties.size | F09-130
Compute environment skeleton with minvCpus 0 and maxvCpus 16; SPOT type needs spotIamFleetRole per the API reference | F09-131
minvCpus 0 holds no instances when the queue is empty; minScaleDownDelayMinutes since 2 March 2026, 20 minutes to 1 week | F09-13
A new EC2 instance takes a few minutes to start | F09-1
maxvCpus is the cap, exceeded by at most one instance | F09-4
SPOT_PRICE_CAPACITY_OPTIMIZED is recommended for most Spot use | F09-3
Multi-node parallel jobs are gang scheduling; only a main-node failure retries; they do not run on Spot compute environments | F09-7, F09-8
Spot draining on by default for compute environments created or updated from 9 October 2026 | F09-12
Quota shares with preemption since 25 March 2026, SageMaker Training jobs only, up to 20 per queue | F09-15
HyperPod: Slurm or EKS, 1-to-1 with an EKS control plane, replaces faulty hardware; deep health checks; automatic node recovery | F09-22, F09-23, F09-24
When a persistent cluster pays (quote) | F09-112
AWS's rule: training jobs for fully managed, HyperPod for teams already on Kubernetes or Slurm | F09-81
Task governance is built on Kueue: add-on v1.6.1-eksbuild.1 installs Kueue v0.19.2 | F09-25
A team can borrow up to 10,000% of its allocation; the lender preempts by default | F09-26
HyperPod managed Karpenter: node groups scale to zero | F09-27
Flexible instance groups: up to 20 instance types in priority order (16 April 2026) | F09-29
Higher pod density per node on EKS-orchestrated clusters since 18 November 2026, tied to MIG slices | F09-115
HyperPod is single-AZ by default; EFA traffic cannot cross zones | F09-36
Checkpointless training: AWS reports over 80% less downtime (16 to over 2,000 GPUs); recipes are language models on 2 or 16 p5.48xlarge nodes; no robotics example located | F09-30
Karpenter AWS provider v1.15.2 (12 November 2026); NodePool and node class | F09-38
EKS Auto Mode: AWS runs scaling, image, patching, GPU drivers; GPU NodePool scales to zero; nodes live at most 21 days | F09-48
Auto Mode NVIDIA NodePool example: g6e and g6, On-Demand, WhenEmpty after 1 hour, 10% disruption budget | F09-132
G5, G6, G6e and G7e have ray-tracing cores | F06-60
Best-practices pattern: Spot and consolidation after 5 minutes for interruptible work; WhenEmpty with a long wait for training | F09-39
G7e supported in Auto Mode; "As of November 2026, G7 is not supported" | F09-49
Capacity Block in Auto Mode: selected by a node class, static NodePool, draining starts 10 minutes before EC2 terminates, 30 minutes before block end | F09-50
Auto Mode resource optimization: preview since 17 November 2026, Deployments and StatefulSets, seven Regions, about 12 hours of history, does not size GPUs | F09-46
Nitro Sandboxes: announced 9 November 2026, generally available on Kubernetes 1.36 or later, microVM per pod | F09-43
A sandbox cannot use a GPU; 5 per parent vCPU, 896 per instance, at least 256 MiB | F09-45
Kueue v0.20.7 (19 November 2026) manages quotas and admission, does not place pods | F09-54
ClusterQueue: nominalQuota, borrowingLimit, lendingLimit; cohorts share unused quota | F09-55
KAI Scheduler v0.19.0 (11 November 2026): full scheduler, gang scheduling, queues, fractional GPUs | F09-57
KAI default fraction mode has no runtime memory isolation | F09-58
Volcano v1.16.0 (14 October 2026): job queues and gang scheduling | F09-59
HyperPod installs Kueue; the EKS guide names KAI; no AWS page read names Volcano | F09-60
OSMO is a workflow orchestrator for physical AI on Kubernetes backends; newest release 6.3.1 (22 June 2026) | F09-62, F09-61
OSMO workflow: DAG of tasks; README example with three tasks on three platforms, 8 GPUs for training | F09-63
OSMO schedules with KAI Scheduler | F09-65
OSMO pools, quotas and HIGH, NORMAL, LOW priorities | F09-64
AWS Physical AI Toolchain: created 9 July 2026, announced 7 October 2026, no tagged releases, independent Terraform modules | F09-69
Sample components: Isaac Lab with 4096 parallel environments on SageMaker and Batch; edge deployment planned | F09-70
The sample's advice on when to use OSMO | F09-72
The sample's OSMO module installs no node autoscaler | F09-74
Capacity Blocks list: P and Trainium types; P6e-GB200 UltraServer blocks in the Dallas Local Zone only | F09-91
No G-family type on the training plans list read on 2026-11-20; availability may change | F09-35
ODCRs cover G instances | F09-40
An ODCR holds capacity for a named type in one AZ for any duration at the On-Demand rate | F09-94
Spot Instance Advisor buckets (file last modified 20 March 2026) for G5, G6e, G7e, G7, P5, P5en, P6-B200 | F09-96
Graviton C8g and M8g Spot buckets in US West (Oregon) | F09-97
G7 and G7e are sold On-Demand, on Spot and under Savings Plans | F09-98
Step Functions submits a Batch job and waits for it | F09-100
Distributed Map runs 10,000 children in parallel with no concurrency set | F09-101
S3 sends object events to EventBridge | F09-102
Lambda GPU-accelerated Event Functions on Lambda Managed Instances since 18 November 2026 | F09-118
Deadline Cloud supports G7 in service-managed fleets since 18 November 2026, g7.2xlarge to g7.48xlarge | F09-117
Greengrass recipe with the token exchange service dependency; credentials expire after an hour by default | F09-133
EKS Hybrid Nodes: unfit for links that drop | F09-119
Hybrid Nodes network guidance: at least 100 Mbps, at most 200 ms | F09-120
Jetson Linux is not in the validated operating system list | F09-52
Billed vCPUs capped at 32 per node since 18 November 2026 | F09-116
A Jetson is a Greengrass core device; a DGX Spark is a hybrid node only when the lab already runs on EKS (our reading) | F09-127
