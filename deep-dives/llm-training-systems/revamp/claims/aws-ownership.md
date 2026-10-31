# Claims: section 20, Who Owns What on AWS

File: `src/sections/AwsOwnership.tsx`. Re-opened on 2026-10-31 (default accessed date): Slurm `sbatch.html`, the AWS Batch job retries page, the AWS PCS EFA page, the SageMaker warm pools, cluster repair, train-a-model and CreateTrainingJob pages, plus every row wave2-aws re-read on 2026-10-31 (W5-1, W5-2, W5-4, W5-16, W5-28 to W5-30, W5-32 to W5-40, W5-42 to W5-45, W5-47, W5-50, W5-51, W5-53, W5-56, W5-58, G1 to G3, U06-1, U06-10, U06-11). Register rows cited without re-opening carry `accessed="2026-10-30"`. The p5.48xlarge rates, the PCS and EKS fees, and the 1.15 and 1.20 ratios are read at render time from `src/lib/presets.ts` (`PRICES`, `PCS_FEES`, `EKS_FEES`), so the page and the calculators share one value.

Format: claim | source URL | register, wave 2 row or experiment

## Introduction and the three shapes

- A SageMaker training job names the compute instances to deploy for it | https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateTrainingJob.html | T06-23 (re-opened)
- A training job runs its code in a Docker image | https://docs.aws.amazon.com/sagemaker/latest/dg/how-it-works-training.html | T06-23 (re-opened)
- Warm pools keep a finished job's instances, so by default they end with the job (our reading) | https://docs.aws.amazon.com/sagemaker/latest/dg/train-warm-pools.html | T06-26; W5-52
- Your own Slurm on EC2 can be deployed with AWS ParallelCluster | https://docs.aws.amazon.com/parallelcluster/latest/ug/what-is-aws-parallelcluster.html | T06-38; W5-28
- PCS: AWS runs the controller, you bring the AMI | https://docs.aws.amazon.com/pcs/latest/userguide/working-with_ami_custom.html | T06-31; W5-30
- HyperPod Slurm: AWS provisions controller, login and worker nodes on the HyperPod DLAMI | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-slurm.html | T06-3; W5-34
- AWS Batch on EKS schedules from outside the cluster onto nodes it creates, scaling them to zero by default | https://docs.aws.amazon.com/batch/latest/userguide/eks.html | T06-49
- HyperPod EKS: your EKS control plane, HyperPod's worker nodes, one EKS cluster per HyperPod cluster | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks.html | T06-2

## Matrix: SageMaker training jobs

- Queues, priorities and fair share through AWS Batch service jobs; Batch queues, SageMaker runs | https://docs.aws.amazon.com/batch/latest/userguide/service-jobs.html | T06-51
- A job failing on a GPU gets a GPU health check; repair starts only after the job fails | https://docs.aws.amazon.com/sagemaker/latest/dg/model-checkpoints-cluster-repair.html | G2; U06-4
- Reboot when recoverable, otherwise replace; up to 10 attempts; repair not billed | https://docs.aws.amazon.com/sagemaker/latest/dg/model-checkpoints-cluster-repair.html | G2
- After a successful repair the job restarts from the previous checkpoint | https://docs.aws.amazon.com/sagemaker/latest/dg/model-checkpoints-cluster-repair.html | G2
- Managed Spot copies checkpoints between a local path and S3 and has no On-Demand fallback | https://docs.aws.amazon.com/sagemaker/latest/dg/model-managed-spot-training.html | T06-27; W5-51
- RetryStrategy retries an InternalServerError 1 to 30 times | https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_RetryStrategy.html | G2
- Training plans are bought for one target and cannot be interchanged | https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html | T06-30; W5-53
- Any launcher inside the job, torchrun and mpirun included | https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-training.html | T06-23
- EFA follows the instance type and an SDK allowlist, with no EFA field on CreateTrainingJob | ../efa/ section 16 (sibling dive link, not a Cite) | EFA dive, section 16: EFA on SageMaker and HyperPod
- The repair page names GPU errors only | https://docs.aws.amazon.com/sagemaker/latest/dg/model-checkpoints-cluster-repair.html | G2 (scope of the hedge: this page)
- The Trainium training-job tutorial sets a recipe path absent from the recipes at 2.0.11 | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-trainium-sagemaker-training-jobs-pretrain-tutorial.html and https://github.com/aws/sagemaker-hyperpod-recipes/tree/2.0.11 | W5-58; T06-20; T06-52; C06-4
- Training rate 1.15 times EC2 on the four P5 and P6 types read in us-east-1; $63.296 against $55.04 per p5.48xlarge-hour | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonSageMaker/20261029165009/us-east-1/index.csv and https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv | T05-23; W5-1
- Warm pools are billed while kept | https://docs.aws.amazon.com/sagemaker/latest/dg/train-warm-pools.html | T06-26; W5-52
- SDK v3 replaces Estimator with ModelTrainer | https://github.com/aws/sagemaker-python-sdk/blob/v3.28.0/README.rst | T06-28; W5-55
- SMP v2 last released v2.8.0 on 2025-04-01 | https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-release-notes.html | T06-24; W5-56

## Matrix: your own Slurm on EC2

- ParallelCluster has no charge of its own; you pay for the resources it creates | https://docs.aws.amazon.com/parallelcluster/latest/ug/what-is-aws-parallelcluster.html | T06-38; W5-28
- Health checks, node replacement and the Neuron stack are yours on this path | (our reading) | 06 section 3.1
- --requeue makes a job eligible for requeue after node failure; the script restarts from its beginning | https://slurm.schedmd.com/sbatch.html | fetched 2026-10-31
- Any EC2 purchase option, Capacity Blocks included | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | T05-27
- DLAMI Base GPU AMI 20261027 ships EFA installer 1.51.0 and aws-ofi-nccl 1.22.0 | https://docs.aws.amazon.com/dlami/latest/devguide/aws-deep-learning-ami-gpubaseoss-ul2404-2026-10-28.html | T05-43
- 3.16.x supported to 2028-02-20; every user guide page carries a banner recommending PCS | https://docs.aws.amazon.com/parallelcluster/latest/ug/support-policy.html and https://docs.aws.amazon.com/parallelcluster/latest/ug/what-is-aws-parallelcluster.html | T06-38; W5-28

## Matrix: AWS PCS

- AWS updates the Slurm controller with patch versions | https://docs.aws.amazon.com/pcs/latest/userguide/slurm-versions.html | T06-31; W5-29
- Cluster size fixed at creation: Small 32, Medium 512, Large 2,048 instances | https://docs.aws.amazon.com/pcs/latest/userguide/working-with_clusters_size.html | T06-35
- No user guide TOC entry contains "health"; AMI pages name no health agent | https://docs.aws.amazon.com/pcs/latest/userguide/toc-contents.json | T06-37; W5-33
- One Capacity Block per node group; instances terminated at expiry; queued jobs stay pending | https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks.html | T06-34
- Your AMI carries the PCS agent; the PCS-ready DLAMI includes no ML framework | https://docs.aws.amazon.com/pcs/latest/userguide/working-with_ami_custom.html and https://docs.aws.amazon.com/pcs/latest/userguide/working-with_ami_pcs-ready-dlami.html | T06-33; W5-30
- The node group AMI must have the EFA driver installed and loaded; you set up security group, launch template and node group | https://docs.aws.amazon.com/pcs/latest/userguide/working-with_networking_efa.html | fetched 2026-10-31
- No PCS AMI with the Neuron stack located; Trainium runs a customer-built AMI (our reading) | https://docs.aws.amazon.com/pcs/latest/userguide/ami-release-notes.html | U06-10
- Trn instances bill at the advanced node-management tier | https://aws.amazon.com/pcs/pricing/ | T06-53
- Controller $0.5825, $3.2579 or $6.5426 per hour; $0.64 per P or Trn instance-hour | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AWSPCS/20261027150327/us-east-1/index.json | T06-36; W5-2
- Slurm 25.05 end of life on PCS 2026-11-30; a major every six months, about 18 months of support, an upgrade about yearly | https://docs.aws.amazon.com/pcs/latest/userguide/slurm-versions.html | T06-32; W5-32

## Matrix: HyperPod Slurm

- Slurm on HyperPod-provisioned controller, login and worker nodes, shaped by lifecycle scripts | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-slurm.html | T06-3; W5-34
- The health-monitoring agent runs the same checks on Slurm and EKS | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-cluster-health-check.html and https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-health-monitoring-agent.html | T06-4; W5-35
- Deep health checks on join or on demand; the Slurm tables list GPU instances only | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html | T06-5; W5-36; U06-11
- Automatic node recovery is the default and reboots or replaces; under auto-resume, always replaces | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html | T06-6; W5-37
- srun --auto-resume=1 resumes from the last checkpoint; jobs without it exit | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html | T06-7; W5-38
- On-Demand or a training plan for HyperPod | https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html | T06-30
- Custom AMIs for Slurm clusters since 2026-07-13, built on HyperPod's base AMI | https://aws.amazon.com/about-aws/whats-new/2026/07/hyperpod-custom-ami-slurm/ (Tier 2) | W5-34
- October 2026 HyperPod Slurm AMI lists EFA installer 1.50.0 | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-ami-slurm.html | G1
- The agent runs Neuron checks; no Trainium recipe at 2.0.11; the Trainium Slurm tutorial launches a removed script | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-health-monitoring-agent.html, https://github.com/aws/sagemaker-hyperpod-recipes/tree/2.0.11, https://docs.aws.amazon.com/sagemaker/latest/dg/hyperpod-trainium-slurm-cluster-pretrain-tutorial.html | T06-4; T06-20; T06-52; C06-4
- Cluster rate 1.20 times EC2 on the four P5 and P6 types read in us-east-1, $66.048 per p5.48xlarge-hour | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonSageMaker/20261029165009/us-east-1/index.csv | T05-23; W5-1
- Billed per instance-hour for the cluster's life, plus storage; EKS, FSx for Lustre and S3 charged separately | https://aws.amazon.com/sagemaker/ai/pricing/ | T06-18
- Slurm clusters gained the agent on 2025-09-11; older clusters need an AMI update | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html | T06-4; W5-35

## Matrix: self-managed EKS

- The default scheduler places pods one at a time; the guide says to add a gang-capable scheduler | https://docs.aws.amazon.com/eks/latest/userguide/ml-workload-topology.html | T06-44
- Kueue starts no pod until there is quota for all; topology-aware placement; fair sharing | https://github.com/kubernetes-sigs/kueue/blob/14b792888dcb30cf055bf2618b6260a4989cf85f/README.md | T06-47; W5-41
- Node monitoring agent reads Xid from DCGM and sets AcceleratedHardwareReady; on by default in Auto Mode, add-on plus Karpenter gate otherwise | https://docs.aws.amazon.com/eks/latest/userguide/ml-validate-gpu-node-repair.html | T06-43; W5-43
- Automatic node repair replaces or reboots, stops when too many nodes in a NodePool are unhealthy; job restart left to you (our reading) | https://docs.aws.amazon.com/eks/latest/userguide/ml-validate-gpu-node-repair.html | T06-43; W5-43
- Kueue deprecates PyTorchJob for TrainJob or JobSet; Kubeflow Trainer is alpha | https://github.com/kubernetes-sigs/kueue/blob/14b792888dcb30cf055bf2618b6260a4989cf85f/README.md and https://github.com/kubeflow/trainer/blob/658725bdae5c7e3a0854d93ac6ff492e109a22ab/README.md | T06-46; W5-42; C06-7
- Node groups, Karpenter or Auto Mode, reserved capacity first; Capacity Blocks through a launch template in the block's Availability Zone | https://docs.aws.amazon.com/eks/latest/userguide/ml-compute-management.html and https://docs.aws.amazon.com/eks/latest/userguide/ml-node-groups.html | T06-41; T06-42; W5-39
- EKS accelerated AMIs carry the driver and EFA kernel module, not the NVIDIA or EFA device plugins; Auto Mode includes drivers and plugins | https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html and https://docs.aws.amazon.com/eks/latest/userguide/ml-compute-management.html | T05-45; W5-39; W5-40
- Neuron device plugin, or the Neuron DRA driver on Kubernetes 1.34 and later outside Auto Mode | https://docs.aws.amazon.com/eks/latest/userguide/device-management-neuron.html | T06-45; W5-40
- $0.10 per cluster-hour, $0.50 more on extended support; Auto Mode $2.64192 per p5.48xlarge-hour | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEKS/20261027191639/us-east-1/index.json | T06-40; T06-41; W5-4
- Kubernetes 1.34 to 1.37 on standard support, 1.31 to 1.33 on extended | https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html | T06-40

## Matrix: AWS Batch on EKS

- Multi-node parallel jobs on EKS are gang scheduling | https://docs.aws.amazon.com/batch/latest/userguide/mnp-eks-jobs.html | T06-50
- No Batch page read describes GPU node health or EFA setup for multi-node jobs on EKS | https://docs.aws.amazon.com/batch/latest/userguide/mnp-eks-running-mnp-jobs.html | U06-7 (accept-as-hedge); G3
- Retry strategy 1 to 10 attempts covers EC2 instance failure; the page does not name EKS | https://docs.aws.amazon.com/batch/latest/userguide/job_retries.html | fetched 2026-10-31
- On-Demand and Spot compute environments | https://docs.aws.amazon.com/batch/latest/userguide/eks.html | T06-49
- Batch does not update the AMI or the Kubernetes version | https://docs.aws.amazon.com/batch/latest/userguide/eks-ce-shared-responsibility.html | T06-49
- Batch EFA needs the EFA driver and one cluster placement group; examples use Batch container jobs (our reading) | https://docs.aws.amazon.com/batch/latest/userguide/efa.html | G3; U06-7
- No Batch charge; EKS fee applies | https://aws.amazon.com/batch/pricing/ | T06-49
- Up to 1,000 instances per multi-node job, one instance type, one pod per node | https://docs.aws.amazon.com/batch/latest/userguide/mnp-eks-running-mnp-jobs.html | W5-44

## Matrix: HyperPod EKS

- Task governance installs Kueue for team allocations, priorities, borrowing and preemption | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance.html | T06-16; W5-46
- A fault becomes node labels, a NoSchedule taint and a node condition | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-health-monitoring-agent.html | T06-8; W5-45
- Automatic node recovery (recommended) reboots or replaces | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-node-recovery.html | T06-6
- Training operator restarts processes in place, detects hangs, escalates to a full job restart | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator.html and https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator-usage.html | T06-9; T06-12; W5-47
- Spot, training plans, flexible instance groups of up to 20 types (2026-04-16) | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-spot.html and https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-notes.html | T06-11; T06-17
- HyperPod EKS AMI of October 2026 for EKS 1.31 to 1.36, EFA installer 1.50.0 | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-ami-eks.html | G1; W5-50
- Trainium deep health checks: Neuron sysfs, a Neuron hardware check running a training workload, collective tests on one node and across nodes | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-deep-health-checks.html | U06-11
- Operator matrix lists Kubernetes 1.28 to 1.33 and Kueue v0.12.2 and v0.12.3, while AMIs ship 1.31 to 1.36 | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator.html | C06-2; W5-50

## Two recoveries: the node, then the job

- The HyperPod agent watches DCGM policy violations, nvidia-smi errors and the GPU count | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-health-monitoring-agent.html | T06-4
- Deep checks: DCGM level 4 at about 45 to 90 minutes, multi-node NCCL test | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html | T06-5; W5-36
- Auto-resume needs an exclusive allocation, one srun for setup, a node list not taken from $SLURM_JOB_NODELIST; generic-resource nodes requeue from the beginning | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html | T06-7
- The overview's "more than 16 nodes" against no limit on the auto-resume page and FAQ | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-slurm.html and https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-faq-slurm.html | U06-1 (accept-as-hedge); W5-38

## All-or-nothing admission

- A single node count is both minimum and maximum; the script waits in the queue until resources are available and runs once allocated | https://slurm.schedmd.com/sbatch.html | fetched 2026-10-31

## A cluster per job or a cluster per team

- Warm pools: cold start without one; up to 3,600 s; billed; 28 days at most | https://docs.aws.amazon.com/sagemaker/latest/dg/train-warm-pools.html | T06-26
- A 32-instance p5.48xlarge HyperPod cluster costs about $50,725 a day (66.048 x 32 x 24, our arithmetic) | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonSageMaker/20261029165009/us-east-1/index.csv | derived from T05-23; W5-1
- Which shape costs less depends on utilisation (our reading of the rates) | (our reading) | 06 section 3.2

## What your training script owns on every path

- Capacity Block termination starts 11:00 UTC on the final day, 30 minutes before the 11:30 end; P6e-GB200 UltraServer blocks 60 minutes | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | T05-27; W5-16
- Training plans terminate 30 minutes early for training jobs, one hour for HyperPod | https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html | T06-30; W5-16
- SAGEMAKER_CURRENT_CAPACITY_BLOCK_EXPIRATION_TIMESTAMP lets a training job checkpoint first | https://docs.aws.amazon.com/sagemaker/latest/dg/training-plan-utilization-for-training-jobs.html | T06-30
- EKS node groups: schedule scale-to-zero more than 30 minutes before the end | https://docs.aws.amazon.com/eks/latest/userguide/ml-node-groups.html | T06-42
- The operator's hang rules are regular expressions over stdout with a maximum gap; the sample's 300 s; logs must go to sys.stdout | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator-usage.html | T06-12
