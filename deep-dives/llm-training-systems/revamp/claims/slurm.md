# Claims: section 24, The Slurm Family

File: `src/sections/SlurmFamily.tsx`. 55 `<Cite>` elements. Re-opened on 2026-10-31 (default accessed date): Slurm 26.05 `slurm.conf.html` and `sbatch.html`; the HyperPod Slurm overview, auto-resume, deep health checks, multi-head and Slurm FAQ pages; the PCS slurm-versions, custom settings (cluster and node group), Slurm reboot, reboot FAQ, instance-replaced-after-reboot troubleshooting pages and the user guide table of contents; awsome-distributed-ai at 3a1002576ccef26e66ba714303b10ccdaa645691 (the 70B FSDP sbatch and the gpu-cluster-healthcheck tree and README); plus every wave2-aws row re-read on 2026-10-31 (W5-2, W5-6, W5-16, W5-28 to W5-30, W5-32 to W5-38, U06-10, U06-11). Register rows cited without re-opening carry `accessed="2026-10-30"`: the DLAMI base release page, the ParallelCluster support policy, the PCS custom AMI, cluster size, Capacity Blocks and pricing pages, the HyperPod Slurm cluster health check page, the SageMaker pricing page and the PCS P6e What's New post. Fees and rates are read at render time from `src/lib/presets.ts` (`PRICES`, `PCS_FEES`) through `priceRun` in `src/lib/runtime.ts`, so the table and Calculator A share one value.

Format: claim | source URL | register, wave 2 row or experiment. NEW marks a source first read for this section.

## Introduction

- slurmctld holds the queue and allocates nodes; a backup controller takes over on HyperPod | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-multihead-slurm.html | NEW
- slurmd on every node registers the node with the controller | https://slurm.schedmd.com/slurm.conf.html | NEW
- A single `--nodes` value is both the minimum and the maximum, and the job may wait until all are free | https://slurm.schedmd.com/sbatch.html | T04-41 (page); NEW (this option)
- Section 20 holds the seven-path ownership grid; this section takes its three Slurm columns down | internal link, section 20 | cross-section

## One batch script, four layers

- AWS's Llama 3.1 70B FSDP sample asks for four exclusive nodes and starts torchrun with eight processes per node and a c10d rendezvous | https://github.com/awslabs/awsome-distributed-ai/blob/3a1002576ccef26e66ba714303b10ccdaa645691/examples/training/fsdp/slurm/llama3_1_70b-training.sbatch#L6-L73 | T06-39 (repo); NEW (file)
- The sample adds `--auto-resume=1` only when `/opt/sagemaker_cluster` exists | https://github.com/awslabs/awsome-distributed-ai/blob/3a1002576ccef26e66ba714303b10ccdaa645691/examples/training/fsdp/slurm/llama3_1_70b-training.sbatch#L104-L109 | NEW
- The sample checkpoints every 1,000 steps, stops after 30 and resumes from its write directory | https://github.com/awslabs/awsome-distributed-ai/blob/3a1002576ccef26e66ba714303b10ccdaa645691/examples/training/fsdp/slurm/llama3_1_70b-training.sbatch#L91-L97 | NEW
- Diagram 1 (four layers by three paths): each cell restates a claim below | as below | schematic

## Your own Slurm on EC2

- A DLAMI carries the NVIDIA driver and the EFA installer | https://docs.aws.amazon.com/dlami/latest/devguide/aws-deep-learning-ami-gpubaseoss-ul2404-2026-10-28.html | T05-43
- ParallelCluster deploys the cluster and charges nothing itself | https://docs.aws.amazon.com/parallelcluster/latest/ug/what-is-aws-parallelcluster.html | T06-38; W5-28
- ParallelCluster at v3.16.2 | https://github.com/aws/aws-parallelcluster/tree/v3.16.2 | T06-38; W5-28
- 3.16 line supported to 2028-02-20 | https://docs.aws.amazon.com/parallelcluster/latest/ug/support-policy.html | T06-38; W5-28
- Every ParallelCluster guide page opens with a banner recommending PCS for HPC and AI | https://docs.aws.amazon.com/parallelcluster/latest/ug/what-is-aws-parallelcluster.html | T06-38; W5-28
- HealthCheckProgram runs as root on every responding node at HealthCheckInterval; 0 is off; must exist on every node; acts only if the script acts; killed after HealthCheckTimeout, 60 s default | https://slurm.schedmd.com/slurm.conf.html | NEW
- Hour-long diagnostics run as a separate job on a held node (our reading) | https://slurm.schedmd.com/slurm.conf.html | derived from the 60 s timeout and W5-36
- AWS's GPU health-check suite: lightweight checks for prolog, epilog or sweep; intensive ones for a suspect node | https://github.com/awslabs/awsome-distributed-ai/blob/3a1002576ccef26e66ba714303b10ccdaa645691/validation/gpu-cluster-healthcheck/README.md#L1-L5 | NEW
- The suite includes DCGM level 4, multi-node NCCL all-reduce, EFA loopback, a Slurm prolog and sbatch wrappers | https://github.com/awslabs/awsome-distributed-ai/tree/3a1002576ccef26e66ba714303b10ccdaa645691/validation/gpu-cluster-healthcheck | NEW
- Replacing the failed instance is yours (our reading) | none (absence on this path) | section 20 matrix
- `--requeue` reruns the batch script from the beginning under the same job ID; JobRequeue sets the default | https://slurm.schedmd.com/sbatch.html | T04-41; W4-25

## AWS PCS

- PCS runs slurmctld and updates it with patch versions | https://docs.aws.amazon.com/pcs/latest/userguide/slurm-versions.html | T06-31; W5-29
- Nodes boot your AMI carrying the PCS agent (AWS's installer required) and a compatible Slurm (AWS's installer recommended, not required; fc09 narrowed) | https://docs.aws.amazon.com/pcs/latest/userguide/working-with_ami_custom.html | T06-31; W5-30
- PCS-ready DLAMI on Ubuntu 24.04 with the agent and several Slurm versions, no ML framework | https://docs.aws.amazon.com/pcs/latest/userguide/working-with_ami_pcs-ready-dlami.html | T06-33; W5-30
- No PCS AMI carrying the Neuron stack located; a Trainium node group runs an AMI you build (our reading) | https://docs.aws.amazon.com/pcs/latest/userguide/ami-release-notes.html | U06-10 (closed, not located)
- Size fixed at creation: Small 32, Medium 512, Large 2,048 | https://docs.aws.amazon.com/pcs/latest/userguide/working-with_clusters_size.html | T06-35; W5-31
- SchedMD ships a major every six months; PCS supports each about 18 months from SchedMD's release, 13.5 to 14.7 months after it reaches PCS; one major upgrade a year (our arithmetic from the page's dates; the page says only "at regular intervals"; label added by fc09) | https://docs.aws.amazon.com/pcs/latest/userguide/slurm-versions.html | T06-32; W5-32 (corrected)
- 25.05 end of life on PCS 2026-11-30; no new clusters after EOL; existing ones up to 12 months without guaranteed support | https://docs.aws.amazon.com/pcs/latest/userguide/slurm-versions.html | T06-32; W5-32
- PCS user guide table of contents has no entry containing "health" | https://docs.aws.amazon.com/pcs/latest/userguide/toc-contents.json | T06-37; W5-33
- Supported cluster-level settings include HealthCheckProgram, HealthCheckInterval, HealthCheckNodeState, JobRequeue, Prolog, Epilog | https://docs.aws.amazon.com/pcs/latest/userguide/slurm-custom-settings-cluster.html | NEW
- HealthCheckTimeout is absent, so the 60 s default bounds the check on PCS (our reading) | https://docs.aws.amazon.com/pcs/latest/userguide/slurm-custom-settings-cluster.html; https://slurm.schedmd.com/slurm.conf.html | NEW, derived
- `scontrol reboot` keeps the instance; a reboot from elsewhere makes PCS replace it | https://docs.aws.amazon.com/pcs/latest/userguide/slurm-reboot.html; https://docs.aws.amazon.com/pcs/latest/userguide/troubleshooting_instance-terminated-after-reboot.html | NEW
- `nextstate=DOWN` triggers replacement; unstable GPU: `scontrol reboot ASAP` then `scontrol requeue` | https://docs.aws.amazon.com/pcs/latest/userguide/slurm-reboot-faq.html | NEW
- Deciding a GPU is bad is your health check's job (our reading) | as the two rows above | derived
- Capacity Blocks through the node group launch template, one per node group; instances terminated at block end; queued jobs pend | https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks.html | T06-34
- PCS supports P6e-GB200 and P6e-GB300 UltraServers since 2026-06-18, through Capacity Blocks, with the topology plugin configured (Tier 2) | https://aws.amazon.com/about-aws/whats-new/2026/06/aws-parallel-computing-service/ | T05-8; C05-5

## HyperPod Slurm

- Controller, login and worker nodes on the HyperPod DLAMI shaped by lifecycle scripts | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-slurm.html | T06-3; W5-34
- Custom AMI on HyperPod's base AMI since 2026-07-13 (Tier 2) | https://aws.amazon.com/about-aws/whats-new/2026/07/hyperpod-custom-ami-slurm/ | W5-34
- Several controller nodes; a backup takes over if the primary fails | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-multihead-slurm.html | NEW
- Agent writes ClusterName, SlurmctldHost, PartitionName, NodeName, TaskPlugin and SchedulerParameters; AWS strongly recommends leaving them unchanged | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-faq-slurm.html | NEW
- Health-monitoring agent on every node with the same checks as HyperPod EKS | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-cluster-health-check.html | T06-4; W5-35
- The agent watches DCGM policy violations, nvidia-smi errors and GPU count; Neuron monitor errors and device count on Trainium | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-health-monitoring-agent.html | T06-4
- Slurm clusters gained the agent 2025-09-11; older clusters update the AMI | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html | T06-4; W5-35
- InstanceStress: DCGM level 4 typically about 45 to 90 min, EFA loopback about 2 to 5 min; InstanceConnectivity NCCL all-reduce about 5 to 15 min; maintenance reservation; failed node replaced and re-checked; GPU instances only | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html | T06-5; W5-36
- Trainium deep checks documented for HyperPod EKS, not Slurm | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-deep-health-checks.html | U06-11; T06-52
- Automatic node recovery is the default and reboots or replaces; drain on fault, replace once jobs exit | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html | T06-6; W5-37
- `srun --auto-resume=1` restarts from the last checkpoint after replacement; nodes always replaced under auto-resume; jobs without it exit | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html | T06-7; W5-37; W5-38
- The three-line batch script | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html | T06-7
- Four rules: exclusive allocation and one srun; node list from scontrol; GRES nodes requeue from the beginning; acts on a non-zero step exit | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html | T06-7; W5-38
- A hang must become an exit first (our reading); section 30 covers the timeouts | derived | cross-section
- "more than 16 nodes", quoted from the overview against the auto-resume page and FAQ, which state no count | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-slurm.html; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-faq-slurm.html | U06-1 (accept-as-hedge); C06-8; W5-38
- With deep checks on, a resumed job runs on any available node and waits only if none is free | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html | NEW (this passage)
- Exact node count holds every resume for at least the 45 to 90 min; one spare worker avoids it (our reading); diagram 2 | as the row above plus W5-36 | derived

## Fees

- 32 p5.48xlarge, 30 days, us-east-1: EC2 On-Demand $1,268,122 at $55.04 per instance-hour | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv | W5-6; computed by priceRun
- PCS $0.5825 Small, $3.2579 Medium per hour; $0.64 per P or Trn instance-hour | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AWSPCS/20261027150327/us-east-1/index.json | T06-36; W5-2
- $0.64 is the advanced node-management tier for P and Trn | https://aws.amazon.com/pcs/pricing/ | T06-36
- HyperPod has no separate fee; $66.048 per ml.p5.48xlarge-hour | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonSageMaker/20261029165009/us-east-1/index.csv | T06-18; W5-1
- Billed for every hour the cluster is provisioned, busy or idle: our reading of pricing example #16, which bills a 4-instance cluster for all 720 hours of a month (re-opened 2026-10-31 by fc09; the example states no idle rule) | https://aws.amazon.com/sagemaker/ai/pricing/ | T06-18
- PCS Small $15,165 (1.2%), Medium $17,091 (1.3%), HyperPod premium $253,624 (20.0%); Medium minus Small $1,926; of PCS Small's $15,165, $14,746 (97%) is the per-instance node-management fee (our arithmetic, wording added by fc09) | computed by priceRun from the rows above | Calculator A; W5-1 ratio 1.20

## Ending

- ParallelCluster 3.16 to 2028-02-20; banner advises PCS | as above | T06-38; W5-28
- Capacity Block termination starts 11:00 UTC on the final day, 30 minutes before the end; P6e-GB200 UltraServer instances terminated at least 60 minutes before the end ("you must terminate your instances"; fc09 corrected "stopped") | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | T05-27; W5-16
- A training plan targeting HyperPod terminates one hour before the end | https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html | T06-30; W5-16
- PCS 25.05 EOL 2026-11-30; P6e since 2026-06-18 | as above | T06-32; T05-8
- HyperPod Slurm agent since 2025-09-11; custom AMIs since 2026-07-13 | as above | W5-34; W5-35
- Automatic Slurm topology management announced 2026-04-23 (Tier 2, status line; post read by fc09 2026-10-31: "Posted on: Apr 23, 2026") | https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-sagemaker-hyperpod-automatic-slurm-topology/ | wave2-aws What's New table, T06-new status line
