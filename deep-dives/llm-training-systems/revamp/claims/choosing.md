# Claims: section 28, Choosing Your Path

File: `src/sections/ChoosingPath.tsx`. 51 `<Cite>` elements. Re-opened on 2026-10-31 (default accessed date): the SageMaker StoppingCondition API reference, the training plans page, train-get-capacity, the ParallelCluster "What is" page, the EKS GPU node repair page, the EC2 Capacity Blocks page, the HyperPod Slurm auto-resume page, and Slurm `sbatch.html`. Rows cited without re-opening carry `accessed="2026-10-30"`: the SageMaker AI pricing page, the EKS network topology page, the HyperPod Slurm cluster health check page, the training operator usage page, the HyperPod elastic training page, the ParallelCluster support policy, the PCS cluster size page, the AWS Batch pricing page and the EC2 On-Demand quotas page. Every other cited page is one a sibling section re-opened on 2026-10-31 and is cited with the same URL and pin.

Fees and rates are read at render time from `src/lib/presets.ts` (`PRICES`, `PCS_FEES`, `EKS_FEES`, `INSTANCES`, `SOURCES`) through `priceRun` in `src/lib/runtime.ts` for 32 p5.48xlarge over 720 hours with a Small PCS controller, the same call section 24 makes, so the page, the diagram and Calculator A's cost panel (section 22) print one value. No experiment (A0 to A5) is used; the hedges that depend on one stay.

Format: claim | source URL | register, wave 2 row, experiment or sibling section.

## Header and introduction

- PCS adds 1.2% to the EC2 bill on 32 p5.48xlarge for 30 days; HyperPod adds 20.0% [our arithmetic] | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AWSPCS/20261027150327/us-east-1/index.json and https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonSageMaker/20261029165009/us-east-1/index.csv | T06-36; T05-23; W5-1; W5-2; W5-5; section 24 prints the same shares
- EC2 On-Demand bill $1,268,122 (55.04 x 32 x 720) [our arithmetic] | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv | T05-20; W5-6
- PCS $15,165 a month and HyperPod $253,624 a month on that fleet [our arithmetic] | PCS and SageMaker Price Lists above | T06-36; T05-23; W5-2; W5-5; SCOPE.md section 28 reference bill
- Every path runs the same step and collectives; paths differ in who does the work around the step; the tree is our reading of sections 20 to 27 | sections 3, 7, 20 | cross-section

## Diagram (Four questions, seven paths)

- Seven paths in three shapes: training jobs; own Slurm on EC2; PCS; HyperPod Slurm; self-managed EKS (Auto Mode as its fee variant); Batch on EKS; HyperPod EKS | section 20 matrix | cross-section; register 06 section 3.3
- A cluster per job bills only while the job runs; a standing cluster bills its whole life, idle included | section 20 idle-time block; https://aws.amazon.com/sagemaker/ai/pricing/ | T06-18; T06-23
- Leaf fee lines: $0 plus controller (own Slurm); $15,165 (1.2%) Small controller (PCS); $253,624 (20.0%) (HyperPod Slurm); $72 and $60,942 Auto Mode (self-managed EKS); $72 (Batch on EKS); $253,624 + $72 (HyperPod EKS); 1.15x EC2 while a job runs (training jobs) [our arithmetic] | Price Lists above; https://aws.amazon.com/batch/pricing/ | T06-36; T06-40; T06-41; T06-49; T05-23; W5-1 to W5-5; register 06 section 3.2
- "When" and "Yours" lines on each leaf | sections 24, 25, 26 | cross-section [our reading]
- Batch on EKS leaf: GPU health and EFA not in the pages read | https://docs.aws.amazon.com/batch/latest/userguide/mnp-eks-running-mnp-jobs.html | U06-7 (accept-as-hedge); section 25
- Capacity box: P and Trn quotas start at 0; a plan serves only its target | see "Start on your leaf" | T05-31; T06-30
- Script box: checkpoints, save before the edge, per-step log line | section 20 "three things" | cross-section
- Question 4 band: no managed path read ships a current Trainium training recipe; Trainium deep checks documented on HyperPod EKS only | section 27; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-deep-health-checks.html | T06-20; T06-52; U06-11 (closed); build-log cross-section condition

## Fee disclosure

- Formulas: EC2 55.04 x 32 x 720; training jobs (63.296 - 55.04) per instance-hour run; PCS 0.5825 x 720 + 0.64 x 32 x 720; HyperPod (66.048 - 55.04) x 32 x 720; EKS 0.10 x 720; Auto Mode 2.64192 x 32 x 720 + $72 [our arithmetic] | EC2, SageMaker, PCS and EKS Price Lists (URLs in `SOURCES`) | T05-20; T05-23; T06-36; T06-40; T06-41; W5-1; W5-2; W5-4
- HyperPod premium about $8,454 a day | SageMaker Price List | W5-5 [our arithmetic]
- A Small PCS controller holds up to 32 instances | https://docs.aws.amazon.com/pcs/latest/userguide/working-with_clusters_size.html | T06-35; W5-31
- ParallelCluster adds no fee; you pay for the resources created | https://docs.aws.amazon.com/parallelcluster/latest/ug/what-is-aws-parallelcluster.html | T06-38; W5-28
- AWS Batch adds no charge of its own | https://aws.amazon.com/batch/pricing/ | T06-49

## Question 1: how long the cluster has to exist

- Training-job instances are provisioned at job start, released at completion, paid per second | https://docs.aws.amazon.com/sagemaker/latest/dg/train-get-capacity.html | T06-23; re-opened 2026-10-31
- Training rate 1.15 x EC2 On-Demand, $63.296 against $55.04 per p5.48xlarge-hour | SageMaker and EC2 Price Lists | T05-23; W5-1
- One job runs at most 28 days | https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_StoppingCondition.html | T06-23; re-opened 2026-10-31
- Fine-tuning and post-training runs of hours or days fit inside the limit | sections 16 and 26 | cross-section (section 26 prints the same sentence)
- A HyperPod cluster is billed per instance-hour for as long as it exists | https://aws.amazon.com/sagemaker/ai/pricing/ | T06-18
- Training job 4.2% below the HyperPod rate per busy hour (63.296 against 66.048) [our arithmetic] | SageMaker Price List | T05-23; W5-1; section 26 prints the same figure
- Idle hours and per-job start-up separate the two shapes | section 20 | cross-section [our reading]

## Question 2: Slurm or Kubernetes

- A single `--nodes` value is both minimum and maximum; the job waits until the nodes are free | https://slurm.schedmd.com/sbatch.html | T04-41; re-opened 2026-10-31
- The default Kubernetes scheduler lacks gang scheduling; the EKS guide tells training users to add a batch scheduler or queueing system with it | https://docs.aws.amazon.com/eks/latest/userguide/ml-workload-topology.html | T06-44; W5-41
- Kueue starts no pod until there is quota for all of them, by default | https://github.com/kubernetes-sigs/kueue/blob/14b792888dcb30cf055bf2618b6260a4989cf85f/README.md#L19-L26 | T06-47; W5-41
- The team's existing operations pick the family; the family is costly to reverse, the path inside it cheaper | sections 24 and 25 | [our reading]; SCOPE.md section 28 question 2
- AWS's 70B sbatch is one script for every Slurm cluster and adds auto-resume only when `/opt/sagemaker_cluster` exists | https://github.com/awslabs/awsome-distributed-ai/blob/3a1002576ccef26e66ba714303b10ccdaa645691/examples/training/fsdp/slurm/llama3_1_70b-training.sbatch#L104-L109 | T06-39 (repo); section 24 (file)

## Question 3: who owns node health and the job restart

- Node recovery and job recovery are separate; the job must have written its checkpoint | section 20 | cross-section
- ParallelCluster charges nothing itself; its guide recommends PCS for HPC and AI workloads | https://docs.aws.amazon.com/parallelcluster/latest/ug/what-is-aws-parallelcluster.html | T06-38; W5-28; re-opened 2026-10-31
- PCS leaves GPU health checks and requeue to Slurm settings you configure (`HealthCheckProgram`, `JobRequeue`) | https://docs.aws.amazon.com/pcs/latest/userguide/slurm-custom-settings-cluster.html | T06-37; W5-33; section 24
- PCS $0.5825 per hour Small controller plus $0.64 per P or Trn instance-hour | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AWSPCS/20261027150327/us-east-1/index.json | T06-36; W5-2
- HyperPod Slurm runs a health-monitoring agent on every node | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-health-monitoring-agent.html and https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-cluster-health-check.html | T06-4; T06-8; W5-35
- Deep health checks screen nodes before they join; DCGM diagnostics typically 45 to 90 minutes | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html | T06-5; W5-36
- Default recovery reboots or replaces; `srun --auto-resume=1` restarts the step after faulty nodes are replaced | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html | T06-6; T06-7; W5-37 (scope narrower: replacement guaranteed only under auto-resume); W5-38; re-opened 2026-10-31
- HyperPod rate $66.048 against $55.04; about $8,454 a day, $253,624 a month, 20.0% [our arithmetic] | SageMaker and EC2 Price Lists | T05-23; W5-1; W5-5
- EKS node monitoring agent reads Xid from DCGM; repair replaces or reboots; on by default in Auto Mode, add-on plus Karpenter gate otherwise | https://docs.aws.amazon.com/eks/latest/userguide/ml-validate-gpu-node-repair.html | T06-43; W5-43; re-opened 2026-10-31
- Gang admission, job API and job restart stay with the team on self-managed EKS | section 25 | T06-46; T06-47; SCOPE.md section 28 question 3
- EKS $0.10 per cluster-hour ($72 a month); Auto Mode $2.64192 per p5.48xlarge-hour, $60,942 a month with the cluster fee [our arithmetic] | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEKS/20261027191639/us-east-1/index.json | T06-40; T06-41; W5-4
- Batch on EKS creates its nodes and scales them to zero by default when the queue is empty | https://docs.aws.amazon.com/batch/latest/userguide/eks.html | T06-49; W5-44
- No Batch page read describes GPU node health handling for EKS compute environments | https://docs.aws.amazon.com/batch/latest/userguide/mnp-eks-running-mnp-jobs.html | U06-7 (accept-as-hedge)
- Batch on EKS fits many independent jobs beside a training cluster | section 25 | [our reading, section 25's]
- HyperPod EKS: health agent and deep checks, Trainium included | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-deep-health-checks.html | U06-11 (closed); W5-45
- The training operator restarts failed processes in place before restarting the job | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator.html | T06-9; W5-47
- PCS and self-managed EKS suit a team that has or will build burn-in, restart and (PCS) GPU checks; HyperPod a team that would otherwise build all of it | sections 24 and 25 | [our reading]; register 06 section 3.3

## Question 4: GPU or Trainium

- NxD Training reached end-of-support as of Neuron 2.32 | https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/archive/nxd-training/index.rst#L21-L27 | T03-34; W3-28
- The supported stack is TorchTitan Neuron on TorchNeuron, PyTorch's native Neuron backend | https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/about-torchtitan-neuron.rst#L19-L26 | T03-38
- Both in beta at Neuron 2.33.0 | section 27 | cross-section
- The HyperPod recipes repository holds no Trainium training recipe at 2.0.11 [our check of its tree] | https://github.com/aws/sagemaker-hyperpod-recipes/tree/2.0.11 | T06-20; W5-58; T06-52
- trn2.48xlarge Capacity Blocks are offered in US East (Ohio) and Asia Pacific (Hyderabad) | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | T05-27; W5-16; re-opened 2026-10-31
- HyperPod EKS documents Trainium deep checks including a Neuron hardware check running a training workload; HyperPod Slurm's deep checks list GPU instances only | HyperPod EKS and Slurm deep health check pages | U06-11 (closed); T06-5; T06-52; build-log cross-section condition

## Start on your leaf

- Default Running On-Demand P and Trn quotas are 0 | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html | T05-31; W5-13
- SageMaker quotas for training jobs or HyperPod must exceed a plan's instance count | https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html | T06-30; re-opened 2026-10-31
- Capacity Blocks: up to 64 instances each, 256 across an organization's blocks on any date | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | T05-27; W5-16; re-opened 2026-10-31
- A training plan is specific to its target and cannot be interchanged | https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html | T06-30; W5-53; re-opened 2026-10-31
- Capacity Block termination begins 11:00 UTC on the final day, 30 minutes before the 11:30 end | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | T05-27; W5-16; build-log cross-section condition
- Training plan edge: 30 minutes before the end for training jobs, one hour for HyperPod | https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html | T06-30; W5-16; build-log cross-section condition
- A per-step log line is what the training operator's hang detection matches | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator-usage.html | T06-12; W5-47
- Training jobs first action: per-rank files under `/opt/ml/checkpoints`, stop mid-run, resume on the same prefix | section 26 | cross-section
- ParallelCluster 3.16 supported to 2028-02-20 | https://docs.aws.amazon.com/parallelcluster/latest/ug/support-policy.html | T06-38; W5-28
- Own Slurm and PCS: `HealthCheckProgram`, burn-in job, `JobRequeue` or `--requeue`; next cluster on PCS or HyperPod Slurm | section 24 | cross-section
- A different PCS size means a new cluster | https://docs.aws.amazon.com/pcs/latest/userguide/working-with_clusters_size.html | T06-35; W5-31
- `OnStartDeepHealthChecks` InstanceStress and InstanceConnectivity | HyperPod Slurm deep health checks page | T06-5; W5-36
- `srun --auto-resume=1` inside one exclusive allocation | HyperPod Slurm auto-resume page | T06-7; W5-38
- Keep a spare worker so a resume skips a replacement's checks | HyperPod Slurm deep health checks page; section 24 | [our reading, section 24's]
- Self-managed EKS recipe and the over-capacity admission test | section 25 | cross-section
- Batch on EKS: test GPU fault handling and EFA placement yourself | section 25 | U06-7 (accept-as-hedge)
- Install Kueue through task governance | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-elastic-training.html | T06-15; W5-48
- Training operator support table lists Kubernetes 1.28 to 1.33 | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator.html | T06-9; C06-2; W5-50
- Pin Neuron 2.33.0; run a validated one-node layout first | about-torchtitan-neuron.rst L37-L60 and L165-L200 at the pinned commit | T03-38
- Next: section 31, Bring-Up: From One Node to the Full Run | internal reference | cross-section
