# Claims: section 24, Orchestrating Physical AI on AWS

claim | register ID

An array job is one submission that spawns 2 to 10,000 children, each reading its own index; 500 evaluation episodes as one array of 500 children | F09-5
AWS's robotics reference architecture puts simulation on Batch across GPU Auto Scaling groups, trains on SageMaker, deploys with Greengrass, which sends sensor data back | F09-78
The Cosmos 3 architecture: curation on Batch, post-training on HyperPod, serving on EKS | F09-84
AWS's rule on the SO-101: Training Jobs for a fully managed service, HyperPod for a team that already runs Kubernetes or Slurm; a Training Job bills for the job's duration and shuts instances down | F09-81
Greengrass is software on the device that receives components from the cloud | F07-84
The placement of the fifteen workloads is the dive's reading; no AWS page comparing Batch, HyperPod and EKS was located | F09-110
Record and encode runs at the edge; the S3 object event starts the cloud side | F08-76, F09-102
Decode and filter, Embed and deduplicate: Batch array jobs on Spot; Batch allocates whole GPUs | F09-84, F09-5, F10-44
CPU physics step: Batch array on Spot (CPU bundles) or a Slurm job array on PCS | F10-5, F10-228
GPU-parallel physics: one GPU job on Batch | F09-78, F10-68
Simulated cameras: G-family with ray-tracing cores, a narrower type list on Spot | F09-78, F10-534
Generative augmentation: offline generation on Batch; HyperPod for a shared pool | F10-69, F09-112
Dataloader decode and augment is part of the training job; engine build runs on the target device | F08-76
Policy fine-tune: one Batch job or a SageMaker Training Job | F09-81, F09-73
World-model training (small): one GPU for hours | F08-76
Pretraining rows: HyperPod or PCS on reserved capacity | F09-112, F10-234, F09-84, F09-109
On-robot inference: no cloud scheduler, Greengrass delivers | F07-84
Layer names per service: job queue and compute environment (Batch), queue as Slurm partition and compute node group (PCS), Slurm or Kueue and instance group (HyperPod), Kueue or KAI and NodePool (EKS) (our reading) | F10-21, F10-215, F10-206, F10-300, F10-320, F10-401, F10-450
Batch scales to zero with minvCpus 0; does not preempt container jobs; multi-node jobs do not run on Spot | F10-38, F10-34, F09-8
PCS is managed Slurm; node groups scale to zero; jobs are processes on an AMI; no step-by-step Spot interruption page | F10-200, F10-208, F10-245, F10-222
HyperPod is a persistent cluster with two orchestrators, automatic node recovery; "the tens-of-nodes tail where failures are statistically frequent"; features built for P-class nodes, bills per provisioned instance (our reading) | F10-300, F10-314, F09-112, F10-334
EKS: NodePools via Karpenter or Auto Mode; Kueue holds quota per team; nothing queues by default | F10-401, F10-430, F10-450
Side-by-side, what you submit | F09-130, F10-228, F10-300, F10-451
Side-by-side, where work waits | F09-14, F10-215, F10-320, F10-450
Side-by-side, who starts instances | F10-37, F10-217, F10-313, F10-312, F10-401
Side-by-side, scale to zero (PCS controller has its own hourly fee; HyperPod only on EKS with managed Karpenter) | F10-38, F10-208, F10-240, F10-312, F10-313, F09-48
Side-by-side, Spot | F09-10, F10-207, F10-222, F10-309, F10-402
Side-by-side, multi-node training | F09-8, F10-49, F10-50, F10-217, F10-314, F10-456
Side-by-side, what you operate | F10-14, F10-245, F10-300, F10-430
Multi-node training uses a placement group and EFA | F10-233, F10-426
ODCR: capacity for a named type in one Availability Zone, any duration, charged at the On-Demand rate | F09-94
Capacity Block for ML: up to eight weeks ahead, paid up front, up to 64 instances per block, up to six months, ends 11:30 UTC, cannot be cancelled, moved or split | F09-90
SageMaker training plan reserves capacity for a HyperPod cluster or a training job | F09-34
Spot notice two minutes before, as an EventBridge event and instance metadata, best effort | F10-520
An instance can be interrupted before the warning is available | F10-522
Rebalance recommendation: elevated risk, can arrive sooner than or together with the notice | F10-523
"at least 10 instance types for each workload"; G families of generation 4 or higher across sizes and zones | F10-529, F10-534
price-capacity-optimized is the recommended strategy; Karpenter applies it | F10-528, F10-403
Checkpoint figures: Batch parts "of 30 minutes or less"; EKS guide fast tier every 5 to 30 minutes | F10-535
AWS discourages Spot for tightly coupled work and discourages failing over to On-Demand | F10-530
Default Spot quota of 0 for G and for P instances | F10-533
Capacity Blocks and training plans lists name no G-family type; P and Trainium types; ODCRs cover G instances | F09-91, F09-35, F09-40
Family table: Spot Instance Advisor buckets (file of 20 March 2026), Capacity Block and training plan lists | F09-96, F09-97, F09-98, F09-91, F09-34, F09-35
S3 sends object events to EventBridge | F09-102
Step Functions submits a Batch job and waits; Distributed Map runs 10,000 children with no concurrency set | F09-100, F09-101
OSMO is a workflow orchestrator for physical AI on Kubernetes backends | F09-62
Managed MLflow: one record from a training job, a HyperPod pod or a Batch job | F09-103
Mountpoint reads and creates files, cannot modify existing ones; FSx for Lustre for full POSIX | F09-106
DCV is the remote-desktop protocol for an interactive simulation workstation | F09-104
Greengrass recipe with TokenExchangeService; credentials expire after an hour by default | F09-133
EKS Hybrid Nodes limits and the Greengrass or hybrid node reading | F09-119, F09-120, F09-52, F09-116, F09-127
