# LLM training systems deep dive: sources

Generated from the inline citations in `src/` by `revamp/tools/gen-sources.mjs`. Do not edit by hand;
change the citation in the section and regenerate.

Code citations are pinned to release tags or commits (PyTorch `v2.15.0`, TorchTitan `v0.4.0`, Megatron-LM
`core_v0.20.0`, DeepSpeed `v0.19.9`, the Neuron SDK documentation at `10832bbcc6b6920b3046a7d7aa59b6b684f6b81a`, among others),
and arXiv links to a paper version. Code links are listed per file; the sections link to exact line ranges.
Tiers follow the dive's RESEARCH-GUIDE.md section 1. Tier 3 papers show their venue, or "preprint".

## Tier 0: our own experiments (logs in research/)

5 sources.

| Source | Accessed | Cited in |
| --- | --- | --- |
| [cmanaha/tech-deep-dives @ bd8184164fc3abbe0390183e11e4236c2940abe7: deep-dives/llm-training-systems/research/2026-10/E1-spark-activation-memory.md](https://github.com/cmanaha/tech-deep-dives/blob/bd8184164fc3abbe0390183e11e4236c2940abe7/deep-dives/llm-training-systems/research/2026-10/E1-spark-activation-memory.md) | 2026-10-30, 2026-10-31 | DataParallel, GlossaryAndSources, MemoryBudget, SetMyRanks, ThreeBudgets, TrainingStep, calculator presets |
| [cmanaha/tech-deep-dives @ bd8184164fc3abbe0390183e11e4236c2940abe7: deep-dives/llm-training-systems/research/2026-10/E2-spark-step-time-recompute.md](https://github.com/cmanaha/tech-deep-dives/blob/bd8184164fc3abbe0390183e11e4236c2940abe7/deep-dives/llm-training-systems/research/2026-10/E2-spark-step-time-recompute.md) | 2026-10-31 | Arithmetic, GlossaryAndSources, MemoryBudget, SetMyRanks, ThreeBudgets |
| [cmanaha/tech-deep-dives @ bd8184164fc3abbe0390183e11e4236c2940abe7: deep-dives/llm-training-systems/research/2026-10/E3-spark-fsdp2-collectives.md](https://github.com/cmanaha/tech-deep-dives/blob/bd8184164fc3abbe0390183e11e4236c2940abe7/deep-dives/llm-training-systems/research/2026-10/E3-spark-fsdp2-collectives.md) | 2026-10-30, 2026-10-31 | DataParallel, GlossaryAndSources, SetMyRanks, Telemetry, calculator presets |
| [cmanaha/tech-deep-dives @ bd8184164fc3abbe0390183e11e4236c2940abe7: deep-dives/llm-training-systems/research/2026-10/E4-spark-checkpoint-staging.md](https://github.com/cmanaha/tech-deep-dives/blob/bd8184164fc3abbe0390183e11e4236c2940abe7/deep-dives/llm-training-systems/research/2026-10/E4-spark-checkpoint-staging.md) | 2026-10-31 | Checkpointing, GlossaryAndSources |
| [cmanaha/tech-deep-dives @ bd8184164fc3abbe0390183e11e4236c2940abe7: deep-dives/llm-training-systems/research/2026-10/wave2-step-maths.md](https://github.com/cmanaha/tech-deep-dives/blob/bd8184164fc3abbe0390183e11e4236c2940abe7/deep-dives/llm-training-systems/research/2026-10/wave2-step-maths.md) | 2026-10-30 | calculator presets |

## Tier 1: source code at a pinned ref, official framework documentation, first-party AWS and NVIDIA documentation, spec sheets and pricing

383 sources.

| Source | Accessed | Cited in |
| --- | --- | --- |
| [AWS What's New, 2025-09-08](https://aws.amazon.com/about-aws/whats-new/2025/09/managed-tiered-checkpointing-amazon-sagemaker-hyperpod/) | 2026-10-31 | Checkpointing |
| [AWS Batch pricing](https://aws.amazon.com/batch/pricing/) | 2026-10-30 | AwsOwnership, ChoosingPath, KubernetesFamily |
| [EC2 Capacity Blocks pricing](https://aws.amazon.com/ec2/capacityblocks/pricing/) | 2026-10-30, 2026-10-31 | Arithmetic, AwsHardware, CapacityCost, Checkpointing, Collectives, DataParallel, SetMyRanks, Sources appendix, TrainingJobs, Trainium, calculator presets |
| [EC2 P4](https://aws.amazon.com/ec2/instance-types/p4/) | 2026-10-31 | AwsHardware |
| [P5](https://aws.amazon.com/ec2/instance-types/p5/) | 2026-10-31 | AwsHardware |
| [P6](https://aws.amazon.com/ec2/instance-types/p6/) | 2026-10-30, 2026-10-31 | AwsHardware, ExpertParallel |
| [Trn1](https://aws.amazon.com/ec2/instance-types/trn1/) | 2026-10-31 | AwsHardware |
| [EC2 Trn2 product page](https://aws.amazon.com/ec2/instance-types/trn2/) | 2026-10-31 | AwsHardware |
| [EC2 Trn3 product page](https://aws.amazon.com/ec2/instance-types/trn3/) | 2026-10-31 | AwsHardware |
| [EC2 UltraServers page](https://aws.amazon.com/ec2/ultraservers/) | 2026-10-31 | AwsHardware |
| [AWS PCS pricing](https://aws.amazon.com/pcs/pricing/) | 2026-10-30, 2026-10-31 | AwsOwnership, SlurmFamily, Trainium |
| [SageMaker HyperPod product page](https://aws.amazon.com/sagemaker/ai/hyperpod/) | 2026-10-31 | FailureRates |
| [SageMaker HyperPod features page](https://aws.amazon.com/sagemaker/ai/hyperpod/features/) | 2026-10-31 | FailureRates |
| [SageMaker AI pricing](https://aws.amazon.com/sagemaker/ai/pricing/) | 2026-10-30 | AwsOwnership, CapacityCost, ChoosingPath, SlurmFamily, TrainingJobs |
| [Neuron 2.33 NeuronCore-v3 architecture](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/neuron-core-v3.html) | 2026-10-31 | AwsHardware |
| [Trainium](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium.html) | 2026-10-30, 2026-10-31 | AwsHardware, CapacityCost, Trainium, calculator presets |
| [Trainium2](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html) | 2026-10-30, 2026-10-31 | Arithmetic, AwsHardware, CapacityCost, MemoryBudget, Sources appendix, calculator presets |
| [Trainium3](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium3.html) | 2026-10-30, 2026-10-31 | AwsHardware, calculator presets |
| [Trn2](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn2-arch.html) | 2026-10-30, 2026-10-31 | AwsHardware, MemoryBudget, calculator presets |
| [Trn3](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn3-arch.html) | 2026-10-30, 2026-10-31 | AwsHardware, calculator presets |
| [CloudWatch User Guide, Container Insights enhanced observability metrics for EKS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-enhanced-EKS.html) | 2026-10-31 | Telemetry |
| [Amazon S3 user guide, directory buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-bucket-high-performance.html) | 2026-10-31 | Storage |
| [Amazon S3 user guide, Mountpoint](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mountpoint.html) | 2026-10-31 | Storage |
| [S3 optimizing performance](https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html) | 2026-10-30, 2026-10-31 | Checkpointing, Sources appendix, Storage, calculator presets |
| [Amazon S3 user guide, S3 Express One Zone performance](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-performance.html) | 2026-10-31 | Checkpointing, Storage |
| [Capacity Blocks pricing and billing](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-pricing-billing.html) | 2026-10-30 | CapacityCost |
| [Find and purchase Capacity Blocks](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-purchase.html) | 2026-10-31 | CapacityCost |
| [EC2 Capacity Blocks for ML](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html) | 2026-10-30, 2026-10-31 | AwsHardware, AwsOwnership, BringUp, CapacityCost, ChoosingPath, Collectives, KubernetesFamily, SlurmFamily, Sources appendix, ThreeBudgets |
| [EC2 On-Demand Capacity Reservations](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html) | 2026-10-31 | CapacityCost |
| [EC2 On-Demand Instance quotas](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html) | 2026-10-30, 2026-10-31 | BringUp, CapacityCost, Checkpointing, ChoosingPath, Collectives, DataParallel, Resuming, SetMyRanks |
| [EC2 user guide, instance store data persistence](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-store-lifetime.html) | 2026-10-31 | Storage |
| [EC2 Spot Instance interruption notices](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html) | 2026-10-30 | CapacityCost |
| [AWS Batch User Guide, EFA](https://docs.aws.amazon.com/batch/latest/userguide/efa.html) | 2026-10-31 | AwsOwnership, KubernetesFamily |
| [AWS Batch User Guide, shared responsibility for EKS nodes](https://docs.aws.amazon.com/batch/latest/userguide/eks-ce-shared-responsibility.html) | 2026-10-30, 2026-10-31 | AwsOwnership, KubernetesFamily |
| [AWS Batch User Guide, EKS compute environments](https://docs.aws.amazon.com/batch/latest/userguide/eks.html) | 2026-10-30, 2026-10-31 | AwsOwnership, ChoosingPath, KubernetesFamily |
| [AWS Batch User Guide, automated job retries](https://docs.aws.amazon.com/batch/latest/userguide/job_retries.html) | 2026-10-31 | AwsOwnership |
| [AWS Batch User Guide, multi-node parallel jobs on EKS](https://docs.aws.amazon.com/batch/latest/userguide/mnp-eks-jobs.html) | 2026-10-30, 2026-10-31 | AwsOwnership, KubernetesFamily |
| [AWS Batch User Guide, running multi-node parallel jobs](https://docs.aws.amazon.com/batch/latest/userguide/mnp-eks-running-mnp-jobs.html) | 2026-10-31 | AwsOwnership, ChoosingPath, KubernetesFamily |
| [AWS Batch User Guide, service jobs](https://docs.aws.amazon.com/batch/latest/userguide/service-jobs.html) | 2026-10-30 | AwsOwnership, TrainingJobs |
| [AWS CLI reference, describe-capacity-block-offerings](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-block-offerings.html) | 2026-10-31 | CapacityCost |
| [DLAMI release notes, 20261027](https://docs.aws.amazon.com/dlami/latest/devguide/aws-deep-learning-ami-gpubaseoss-ul2404-2026-10-28.html) | 2026-10-30 | AwsOwnership, BringUp, Collectives, Resuming, SlurmFamily |
| [EC2 instance family summary, Spot support](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html) | 2026-10-30, 2026-10-31 | Arithmetic, AwsHardware, CapacityCost, Checkpointing, Collectives, ComposingLayouts, ContextParallel, DataParallel, ExpertParallel, FailureRates, FineTuning, GettingStarted, MemoryBudget, PipelineParallel, Precision, SetMyRanks, Sources appendix, Storage, TensorParallel, ThreeBudgets, TrainingStep, Trainium, calculator presets |
| [EKS Best Practices Guide, AI/ML compute](https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html) | 2026-10-31 | KubernetesFamily |
| [EKS Best Practices Guide](https://docs.aws.amazon.com/eks/latest/best-practices/aiml-observability.html) | 2026-10-31 | BringUp, Telemetry, WhatToMeasure |
| [EKS User Guide, Neuron devices](https://docs.aws.amazon.com/eks/latest/userguide/device-management-neuron.html) | 2026-10-31 | AwsOwnership, KubernetesFamily, Trainium |
| [EKS User Guide, Kubernetes versions](https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html) | 2026-10-30, 2026-10-31 | AwsOwnership, KubernetesFamily |
| [EKS User Guide, accelerated compute](https://docs.aws.amazon.com/eks/latest/userguide/ml-compute-management.html) | 2026-10-31 | AwsOwnership, CapacityCost, KubernetesFamily, Sources appendix |
| [EKS-optimized accelerated AMIs](https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html) | 2026-10-31 | AwsOwnership, BringUp, KubernetesFamily |
| [EKS User Guide, node groups](https://docs.aws.amazon.com/eks/latest/userguide/ml-node-groups.html) | 2026-10-30, 2026-10-31 | AwsOwnership, CapacityCost, KubernetesFamily |
| [EKS User Guide, GPU node repair](https://docs.aws.amazon.com/eks/latest/userguide/ml-validate-gpu-node-repair.html) | 2026-10-31 | AwsOwnership, ChoosingPath, KubernetesFamily |
| [EKS User Guide, network topology](https://docs.aws.amazon.com/eks/latest/userguide/ml-workload-topology.html) | 2026-10-30, 2026-10-31 | AwsOwnership, ChoosingPath, KubernetesFamily |
| [CreateFileSystem](https://docs.aws.amazon.com/fsx/latest/APIReference/API_CreateFileSystem.html) | 2026-10-30, 2026-10-31 | Checkpointing, calculator presets |
| [FSx for Lustre user guide, EFA-enabled file systems](https://docs.aws.amazon.com/fsx/latest/LustreGuide/efa-file-systems.html) | 2026-10-31 | Storage, Trainium |
| [FSx for Lustre user guide, data repositories](https://docs.aws.amazon.com/fsx/latest/LustreGuide/fsx-data-repositories.html) | 2026-10-31 | Storage |
| [FSx for Lustre user guide, importing changes](https://docs.aws.amazon.com/fsx/latest/LustreGuide/importing-files.html) | 2026-10-31 | Storage |
| [FSx for Lustre user guide, performance](https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html) | 2026-10-31 | Checkpointing, Storage |
| [SSD performance](https://docs.aws.amazon.com/fsx/latest/LustreGuide/ssd-storage.html) | 2026-10-30, 2026-10-31 | Checkpointing, Sources appendix, Storage, calculator presets |
| [FSx for Lustre user guide, deployment options](https://docs.aws.amazon.com/fsx/latest/LustreGuide/using-fsx-lustre.html) | 2026-10-31 | Storage |
| [AWS ParallelCluster support policy](https://docs.aws.amazon.com/parallelcluster/latest/ug/support-policy.html) | 2026-10-30 | AwsOwnership, ChoosingPath, SlurmFamily |
| [What is AWS ParallelCluster](https://docs.aws.amazon.com/parallelcluster/latest/ug/what-is-aws-parallelcluster.html) | 2026-10-31 | AwsOwnership, ChoosingPath, SlurmFamily |
| [AWS PCS User Guide, AMI release notes](https://docs.aws.amazon.com/pcs/latest/userguide/ami-release-notes.html) | 2026-10-31 | AwsOwnership, SlurmFamily |
| [AWS PCS with Capacity Blocks](https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks.html) | 2026-10-30 | AwsOwnership, CapacityCost, SlurmFamily, Sources appendix |
| [AWS PCS User Guide, custom Slurm settings for clusters](https://docs.aws.amazon.com/pcs/latest/userguide/slurm-custom-settings-cluster.html) | 2026-10-31 | ChoosingPath, SlurmFamily |
| [AWS PCS User Guide, Slurm reboot FAQ](https://docs.aws.amazon.com/pcs/latest/userguide/slurm-reboot-faq.html) | 2026-10-31 | SlurmFamily |
| [AWS PCS User Guide, Slurm reboot](https://docs.aws.amazon.com/pcs/latest/userguide/slurm-reboot.html) | 2026-10-31 | SlurmFamily |
| [AWS PCS User Guide, Slurm versions](https://docs.aws.amazon.com/pcs/latest/userguide/slurm-versions.html) | 2026-10-31 | AwsOwnership, SlurmFamily |
| [AWS PCS User Guide, table of contents](https://docs.aws.amazon.com/pcs/latest/userguide/toc-contents.json) | 2026-10-31 | AwsOwnership, SlurmFamily |
| [AWS PCS troubleshooting, instance replaced after reboot](https://docs.aws.amazon.com/pcs/latest/userguide/troubleshooting_instance-terminated-after-reboot.html) | 2026-10-31 | SlurmFamily |
| [AWS PCS User Guide, custom AMIs](https://docs.aws.amazon.com/pcs/latest/userguide/working-with_ami_custom.html) | 2026-10-30 | AwsOwnership, SlurmFamily |
| [PCS-ready DLAMI](https://docs.aws.amazon.com/pcs/latest/userguide/working-with_ami_pcs-ready-dlami.html) | 2026-10-31 | AwsOwnership, BringUp, SlurmFamily |
| [AWS PCS User Guide, cluster size](https://docs.aws.amazon.com/pcs/latest/userguide/working-with_clusters_size.html) | 2026-10-30, 2026-10-31 | AwsOwnership, CapacityCost, ChoosingPath, SlurmFamily, Sources appendix, calculator presets |
| [AWS PCS User Guide, using EFA](https://docs.aws.amazon.com/pcs/latest/userguide/working-with_networking_efa.html) | 2026-10-31 | AwsOwnership |
| [CreateTrainingJob, ResourceConfig](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateTrainingJob.html) | 2026-10-31 | AwsOwnership |
| [DescribeTrainingJob](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_DescribeTrainingJob.html) | 2026-10-31 | TrainingJobs |
| [SageMaker API reference, InfraCheckConfig](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_InfraCheckConfig.html) | 2026-10-31 | TrainingJobs |
| [SageMaker API reference, RetryStrategy](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_RetryStrategy.html) | 2026-10-31 | AwsOwnership, TrainingJobs |
| [SageMaker API reference, StoppingCondition](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_StoppingCondition.html) | 2026-10-31 | ChoosingPath, TrainingJobs |
| [SMDDP release notes](https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-release-notes.html) | 2026-10-31 | TrainingJobs |
| [SageMaker Developer Guide, Debugger availability change](https://docs.aws.amazon.com/sagemaker/latest/dg/debugger-availability-change.html) | 2026-10-31 | Telemetry |
| [SageMaker Developer Guide, define training metrics](https://docs.aws.amazon.com/sagemaker/latest/dg/define-train-metrics.html) | 2026-10-31 | Telemetry |
| [SageMaker Developer Guide, distributed training](https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-training.html) | 2026-10-30, 2026-10-31 | AwsOwnership, TrainingJobs |
| [SageMaker Developer Guide, train a model](https://docs.aws.amazon.com/sagemaker/latest/dg/how-it-works-training.html) | 2026-10-31 | AwsOwnership, Sources appendix |
| [SageMaker Developer Guide, preconfigured alerts](https://docs.aws.amazon.com/sagemaker/latest/dg/hyperpod-observability-addon-alerts.html) | 2026-10-31 | Telemetry |
| [HyperPod cluster metrics, accelerated compute](https://docs.aws.amazon.com/sagemaker/latest/dg/hyperpod-observability-cluster-metrics.html) | 2026-10-31 | Telemetry |
| [HyperPod Trainium Slurm tutorial](https://docs.aws.amazon.com/sagemaker/latest/dg/hyperpod-trainium-slurm-cluster-pretrain-tutorial.html) | 2026-10-30, 2026-10-31 | AwsOwnership, Trainium |
| [SageMaker HyperPod tiered checkpointing setup](https://docs.aws.amazon.com/sagemaker/latest/dg/managed-tier-checkpointing-setup.html) | 2026-10-31 | Checkpointing |
| [SageMaker HyperPod managed tiered checkpointing](https://docs.aws.amazon.com/sagemaker/latest/dg/managed-tier-checkpointing.html) | 2026-10-31 | Checkpointing, Storage |
| [SageMaker cluster repairs](https://docs.aws.amazon.com/sagemaker/latest/dg/model-checkpoints-cluster-repair.html) | 2026-10-31 | AwsOwnership, TrainingJobs |
| [SageMaker Developer Guide, resume from a checkpoint](https://docs.aws.amazon.com/sagemaker/latest/dg/model-checkpoints-resume.html) | 2026-10-31 | TrainingJobs |
| [SageMaker Developer Guide, checkpoints](https://docs.aws.amazon.com/sagemaker/latest/dg/model-checkpoints.html) | 2026-10-31 | TrainingJobs |
| [SageMaker managed Spot training](https://docs.aws.amazon.com/sagemaker/latest/dg/model-managed-spot-training.html) | 2026-10-30, 2026-10-31 | AwsOwnership, CapacityCost, Sources appendix, TrainingJobs, calculator presets |
| [SMP release notes](https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-release-notes.html) | 2026-10-31 | AwsOwnership, BringUp, TrainingJobs |
| [SageMaker Developer Guide, use SMP v2](https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-use-api-v2.html) | 2026-10-31 | TrainingJobs |
| [SageMaker Developer Guide, SMP v2](https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-v2.html) | 2026-10-31 | TrainingJobs |
| [SageMaker Developer Guide, monitoring with CloudWatch](https://docs.aws.amazon.com/sagemaker/latest/dg/monitoring-cloudwatch.html) | 2026-10-31 | Telemetry |
| [SageMaker Developer Guide, Profiler availability change](https://docs.aws.amazon.com/sagemaker/latest/dg/profiler-availability-change.html) | 2026-10-31 | Telemetry |
| [SageMaker training plans](https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html) | 2026-10-31 | AwsOwnership, BringUp, CapacityCost, ChoosingPath, SlurmFamily, Sources appendix, TrainingJobs, Trainium |
| [SageMaker Developer Guide, checkpointless in-process recovery](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless-in-process-recovery.html) | 2026-10-31 | KubernetesFamily |
| [HyperPod checkpointless training release notes](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless-release-notes.html) | 2026-10-31 | BringUp, KubernetesFamily |
| [SageMaker HyperPod: checkpointless training](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless.html) | 2026-10-31 | FineTuning, KubernetesFamily, Sources appendix, TrainingJobs |
| [HyperPod elastic training guide](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-elastic-training.html) | 2026-10-30, 2026-10-31 | ChoosingPath, KubernetesFamily, Resuming |
| [SageMaker Developer Guide, running jobs with the training operator](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator-usage.html) | 2026-10-30, 2026-10-31 | AwsOwnership, ChoosingPath, KubernetesFamily, Telemetry |
| [HyperPod training operator](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator.html) | 2026-10-31 | AwsOwnership, ChoosingPath, KubernetesFamily, Resuming, Sources appendix, Telemetry |
| [SageMaker Developer Guide, installing metrics exporter packages](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-cluster-observability-slurm-install-exporters.html) | 2026-10-31 | Telemetry |
| [HyperPod task governance](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance.html) | 2026-10-30, 2026-10-31 | AwsOwnership, KubernetesFamily |
| [HyperPod EKS deep health checks](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-deep-health-checks.html) | 2026-10-31 | AwsOwnership, BringUp, ChoosingPath, KubernetesFamily, SlurmFamily, Trainium |
| [SageMaker HyperPod: health monitoring agent](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-health-monitoring-agent.html) | 2026-10-31 | AwsOwnership, ChoosingPath, KubernetesFamily, SlurmFamily, Sources appendix |
| [HyperPod EKS node recovery](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-node-recovery.html) | 2026-10-30, 2026-10-31 | AwsOwnership, KubernetesFamily |
| [SageMaker HyperPod: EKS orchestration](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks.html) | 2026-10-30, 2026-10-31 | AwsOwnership, KubernetesFamily, Sources appendix |
| [HyperPod Slurm FAQ](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-faq-slurm.html) | 2026-10-31 | AwsOwnership, SlurmFamily |
| [HyperPod multi-head node support](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-multihead-slurm.html) | 2026-10-31 | SlurmFamily |
| [SageMaker Developer Guide, HyperPod observability add-on](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-observability-addon.html) | 2026-10-31 | Telemetry |
| [SageMaker HyperPod recipes guide](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-recipes.html) | 2026-10-30, 2026-10-31 | FineTuning, TrainingJobs |
| [HyperPod EKS AMI release notes](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-ami-eks.html) | 2026-10-31 | AwsOwnership, BringUp, KubernetesFamily |
| [HyperPod Slurm AMI release notes](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-ami-slurm.html) | 2026-10-31 | AwsOwnership, BringUp |
| [HyperPod release notes, 2026-04-16](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-notes.html) | 2026-10-30 | AwsOwnership |
| [HyperPod Slurm auto-resume](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html) | 2026-10-31 | AwsOwnership, ChoosingPath, Resuming, SlurmFamily, Sources appendix, Trainium |
| [HyperPod Slurm cluster health checks](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-cluster-health-check.html) | 2026-10-30 | AwsOwnership, ChoosingPath, SlurmFamily |
| [HyperPod Slurm deep health checks](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html) | 2026-10-30, 2026-10-31 | AwsOwnership, BringUp, ChoosingPath, KubernetesFamily, SlurmFamily, Sources appendix, Trainium |
| [SageMaker HyperPod: Slurm orchestration](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-slurm.html) | 2026-10-30, 2026-10-31 | AwsOwnership, SlurmFamily, Sources appendix, TrainingJobs |
| [SageMaker Developer Guide, HyperPod Spot](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-spot.html) | 2026-10-30 | AwsOwnership |
| [SageMaker Trainium training-job tutorial](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-trainium-sagemaker-training-jobs-pretrain-tutorial.html) | 2026-10-31 | AwsOwnership, TrainingJobs, Trainium |
| [SageMaker Developer Guide, get compute capacity for training jobs](https://docs.aws.amazon.com/sagemaker/latest/dg/train-get-capacity.html) | 2026-10-31 | ChoosingPath, TrainingJobs |
| [SageMaker Developer Guide, heterogeneous clusters](https://docs.aws.amazon.com/sagemaker/latest/dg/train-heterogeneous-cluster.html) | 2026-10-31 | TrainingJobs |
| [SageMaker managed warm pools](https://docs.aws.amazon.com/sagemaker/latest/dg/train-warm-pools.html) | 2026-10-30, 2026-10-31 | Arithmetic, AwsOwnership, TrainingJobs, Trainium |
| [Training plans utilization for SageMaker training jobs](https://docs.aws.amazon.com/sagemaker/latest/dg/training-plan-utilization-for-training-jobs.html) | 2026-10-30, 2026-10-31 | AwsOwnership, CapacityCost, TrainingJobs |
| [DCGM User Guide](https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/feature-overview.html) | 2026-10-31 | WhatToMeasure |
| [NCCL 2.32.3 environment variables, NCCL_ALGO](https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/env.html) | 2026-10-31 | BringUp, Collectives, Resuming |
| [NCCL user guide 2.32.3](https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/index.html) | 2026-10-31 | Resuming |
| [NCCL 2.32.3 User Guide, environment variables](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/env.html) | 2026-10-31 | Telemetry |
| [NCCL 2.32.3 User Guide, RAS](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/troubleshooting/ras.html) | 2026-10-31 | Sources appendix, Telemetry |
| [NVIDIA Xid catalog](https://docs.nvidia.com/deploy/xid-errors/analyzing-xid-catalog.html) | 2026-10-31 | BringUp, Sources appendix, WhatToMeasure |
| [NVIDIA DGX Spark hardware overview](https://docs.nvidia.com/dgx/dgx-spark/hardware.html) | 2026-10-31 | Arithmetic |
| [NVIDIA Megatron Bridge 0.7.0 performance archive](https://docs.nvidia.com/nemo/megatron-bridge/0.7.0/performance-summary-archive.html) | 2026-10-31 | Arithmetic, Precision |
| [Nsight Systems User Guide v2026.5](https://docs.nvidia.com/nsight-systems/UserGuide/index.html) | 2026-10-31 | Telemetry |
| [PyTorch tutorial, Flight Recorder for Debugging Stuck Jobs](https://docs.pytorch.org/tutorials/unstable/flight_recorder_tutorial.html) | 2026-10-31 | Telemetry |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: about-neuron/announcements/neuron2.x/announce-eos-nxdt-nxd-core-training.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/about-neuron/announcements/neuron2.x/announce-eos-nxdt-nxd-core-training.rst) | 2026-10-31 | Trainium |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: about-neuron/announcements/neuron2.x/announce-maintenance-nxdt-nxd-core-training.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/about-neuron/announcements/neuron2.x/announce-maintenance-nxdt-nxd-core-training.rst) | 2026-10-31 | FrameworkMap, Trainium |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: about-neuron/announcements/neuron2.x/announcement-end-of-support-nxdt-nxd-core.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/about-neuron/announcements/neuron2.x/announcement-end-of-support-nxdt-nxd-core.rst) | 2026-10-31 | Trainium |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: about-neuron/arch/neuron-features/data-types.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/about-neuron/arch/neuron-features/data-types.rst) | 2026-10-31 | Precision |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: about-neuron/arch/neuron-features/logical-neuroncore-config.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/about-neuron/arch/neuron-features/logical-neuroncore-config.rst) | 2026-10-31 | Trainium |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: about-neuron/arch/neuron-hardware/neuron-core-v3.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/about-neuron/arch/neuron-hardware/neuron-core-v3.rst) | 2026-10-31 | Precision, Trainium |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: about-neuron/arch/neuron-hardware/trainium2.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/about-neuron/arch/neuron-hardware/trainium2.rst) | 2026-10-31 | Precision, Trainium |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: about-neuron/arch/neuron-hardware/trainium3.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/about-neuron/arch/neuron-hardware/trainium3.rst) | 2026-10-31 | Precision, Trainium |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: about-neuron/arch/neuron-hardware/trn2-arch.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/about-neuron/arch/neuron-hardware/trn2-arch.rst) | 2026-10-31 | Trainium |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: archive/nxd-training/index.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/archive/nxd-training/index.rst) | 2026-10-31 | ChoosingPath, FrameworkMap, Trainium |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: includes/torch/trn3-sizing-note.txt](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/includes/torch/trn3-sizing-note.txt) | 2026-10-31 | Trainium |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: neuron-runtime/api/nrt-env-var-reference.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/neuron-runtime/api/nrt-env-var-reference.rst) | 2026-10-31 | Telemetry |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: neuron-runtime/nrt-troubleshoot.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/neuron-runtime/nrt-troubleshoot.rst) | 2026-10-31 | Telemetry |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: release-notes/components/dlamis.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/release-notes/components/dlamis.rst) | 2026-10-31 | FrameworkMap, Trainium |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: release-notes/components/torchneuron.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/release-notes/components/torchneuron.rst) | 2026-10-31 | FrameworkMap, Precision, Trainium |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: release-notes/components/torchtitan-neuron.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/release-notes/components/torchtitan-neuron.rst) | 2026-10-31 | FrameworkMap, Trainium |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: torch/about-pytorch-neuron.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/torch/about-pytorch-neuron.rst) | 2026-10-31 | AwsHardware, FrameworkMap, Precision, Trainium |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: training/torchtitan/about-torchtitan-neuron.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/about-torchtitan-neuron.rst) | 2026-10-30, 2026-10-31 | Arithmetic, AwsHardware, ChoosingPath, FrameworkMap, MemoryBudget, SetMyRanks, Sources appendix, Trainium, calculator presets |
| [aws-neuron/aws-neuron-sdk @ 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a: training/torchtitan/tutorials/tutorial-basic-training.rst](https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/tutorials/tutorial-basic-training.rst) | 2026-10-31 | Trainium |
| [aws-neuron/torchtitan-neuron @ release-2.33.0: torchtitan_neuron/docs/dense-tutorials.md](https://github.com/aws-neuron/torchtitan-neuron/blob/release-2.33.0/torchtitan_neuron/docs/dense-tutorials.md) | 2026-10-31 | Sources appendix, Trainium |
| [aws-neuron/torchtitan-neuron @ release-2.33.0: torchtitan_neuron/docs/neuron_mxfp8.md](https://github.com/aws-neuron/torchtitan-neuron/blob/release-2.33.0/torchtitan_neuron/docs/neuron_mxfp8.md) | 2026-10-31 | Precision |
| [aws-neuron/torchtitan-neuron @ release-2.33.0: torchtitan_neuron/tests/README.md](https://github.com/aws-neuron/torchtitan-neuron/blob/release-2.33.0/torchtitan_neuron/tests/README.md) | 2026-10-31 | Trainium |
| [aws-neuron/torchtitan-neuron @ release-2.33.0: torchtitan/tools/utils.py](https://github.com/aws-neuron/torchtitan-neuron/blob/release-2.33.0/torchtitan/tools/utils.py) | 2026-10-31 | Trainium |
| [torchtitan-neuron release-2.33.0](https://github.com/aws-neuron/torchtitan-neuron/tree/release-2.33.0) | 2026-10-31 | FrameworkMap |
| [aws-neuron/torchtitan-neuron @ release-2.33.0: .github/workflows](https://github.com/aws-neuron/torchtitan-neuron/tree/release-2.33.0/.github/workflows) | 2026-10-31 | Trainium |
| [aws-neuron/torchtitan-neuron @ release-2.33.0: benchmarks](https://github.com/aws-neuron/torchtitan-neuron/tree/release-2.33.0/benchmarks) | 2026-10-31 | Trainium |
| [aws-neuron/torchtitan-neuron @ release-2.33.0: torchtitan_neuron](https://github.com/aws-neuron/torchtitan-neuron/tree/release-2.33.0/torchtitan_neuron) | 2026-10-31 | Trainium |
| [aws/aws-ofi-nccl @ v1.21.1: src/nccl_ofi_net.cpp](https://github.com/aws/aws-ofi-nccl/blob/v1.21.1/src/nccl_ofi_net.cpp) | 2026-10-31 | BringUp |
| [aws-parallelcluster at v3.16.2](https://github.com/aws/aws-parallelcluster/tree/v3.16.2) | 2026-10-31 | SlurmFamily |
| [aws/deep-learning-containers @ 156076c639a310c6e86ddae64a6e1fce8a34087c: .github/config/image/pytorch/2.14-ec2-cuda.yml](https://github.com/aws/deep-learning-containers/blob/156076c639a310c6e86ddae64a6e1fce8a34087c/.github/config/image/pytorch/2.14-ec2-cuda.yml) | 2026-10-30, 2026-10-31 | BringUp, FrameworkMap |
| [aws/deep-learning-containers @ 156076c639a310c6e86ddae64a6e1fce8a34087c: docker/pytorch/2.14/cuda/pyproject.toml](https://github.com/aws/deep-learning-containers/blob/156076c639a310c6e86ddae64a6e1fce8a34087c/docker/pytorch/2.14/cuda/pyproject.toml) | 2026-10-31 | FrameworkMap |
| [deep-learning-containers release v2.16-pt-ec2-2.10.0-tr-gpu-py313](https://github.com/aws/deep-learning-containers/releases/tag/v2.16-pt-ec2-2.10.0-tr-gpu-py313) | 2026-10-31 | BringUp |
| [aws/sagemaker-hyperpod-recipes @ 2.0.11: hyperpod_recipes/recipes_src/training/llama/checkpointless_llama3_70b_pretrain.yaml](https://github.com/aws/sagemaker-hyperpod-recipes/blob/2.0.11/hyperpod_recipes/recipes_src/training/llama/checkpointless_llama3_70b_pretrain.yaml) | 2026-10-31 | KubernetesFamily, Sources appendix, TrainingJobs |
| [sagemaker-hyperpod-recipes v2.0.0 release notes](https://github.com/aws/sagemaker-hyperpod-recipes/releases/tag/v2.0.0) | 2026-10-30 | FineTuning, TrainingJobs |
| [sagemaker-hyperpod-recipes 2.0.11](https://github.com/aws/sagemaker-hyperpod-recipes/tree/2.0.11) | 2026-10-30, 2026-10-31 | AwsOwnership, ChoosingPath, Trainium |
| [aws/sagemaker-hyperpod-recipes @ 2.0.11: hyperpod_recipes/recipes_src/training](https://github.com/aws/sagemaker-hyperpod-recipes/tree/2.0.11/hyperpod_recipes/recipes_src/training) | 2026-10-30, 2026-10-31 | FineTuning, TrainingJobs |
| [aws/sagemaker-hyperpod-recipes @ a9ba8bf184ec8b912936bed828ce7ee8554fab3f: recipes_collection/recipes/training](https://github.com/aws/sagemaker-hyperpod-recipes/tree/a9ba8bf184ec8b912936bed828ce7ee8554fab3f/recipes_collection/recipes/training) | 2026-10-30 | TrainingJobs |
| [v1.5.1](https://github.com/aws/sagemaker-hyperpod-recipes/tree/v1.5.1) | 2026-10-31 | Trainium |
| [v2.0.0](https://github.com/aws/sagemaker-hyperpod-recipes/tree/v2.0.0) | 2026-10-31 | Trainium |
| [aws/sagemaker-python-sdk @ v3.28.0: README.rst](https://github.com/aws/sagemaker-python-sdk/blob/v3.28.0/README.rst) | 2026-10-30, 2026-10-31 | AwsOwnership, TrainingJobs |
| [aws/sagemaker-python-sdk @ v3.28.0: sagemaker-core/src/sagemaker/core/training/configs.py](https://github.com/aws/sagemaker-python-sdk/blob/v3.28.0/sagemaker-core/src/sagemaker/core/training/configs.py) | 2026-10-31 | TrainingJobs |
| [aws/sagemaker-python-sdk @ v3.28.0: sagemaker-train/src/sagemaker/train/aws_batch/training_queue.py](https://github.com/aws/sagemaker-python-sdk/blob/v3.28.0/sagemaker-train/src/sagemaker/train/aws_batch/training_queue.py) | 2026-10-31 | TrainingJobs |
| [aws/sagemaker-python-sdk @ v3.28.0: sagemaker-train/src/sagemaker/train/defaults.py](https://github.com/aws/sagemaker-python-sdk/blob/v3.28.0/sagemaker-train/src/sagemaker/train/defaults.py) | 2026-10-31 | TrainingJobs |
| [aws/sagemaker-python-sdk @ v3.28.0: sagemaker-train/src/sagemaker/train/distributed.py](https://github.com/aws/sagemaker-python-sdk/blob/v3.28.0/sagemaker-train/src/sagemaker/train/distributed.py) | 2026-10-31 | TrainingJobs |
| [aws/sagemaker-python-sdk @ v3.28.0: sagemaker-train/src/sagemaker/train/model_trainer.py](https://github.com/aws/sagemaker-python-sdk/blob/v3.28.0/sagemaker-train/src/sagemaker/train/model_trainer.py) | 2026-10-31 | TrainingJobs |
| [amazon-eks-ami release v20261031](https://github.com/awslabs/amazon-eks-ami/releases/tag/v20261031) | 2026-10-31 | BringUp |
| [awslabs/awsome-distributed-ai @ 3a1002576ccef26e66ba714303b10ccdaa645691: 1.architectures/5.sagemaker-hyperpod/LifecycleScripts/base-config/config.py](https://github.com/awslabs/awsome-distributed-ai/blob/3a1002576ccef26e66ba714303b10ccdaa645691/1.architectures/5.sagemaker-hyperpod/LifecycleScripts/base-config/config.py) | 2026-10-31 | Telemetry |
| [awslabs/awsome-distributed-ai @ 3a1002576ccef26e66ba714303b10ccdaa645691: 1.architectures/5.sagemaker-hyperpod/LifecycleScripts/base-config/observability/dcgm_metrics_config/dcgm-metrics-basic.csv](https://github.com/awslabs/awsome-distributed-ai/blob/3a1002576ccef26e66ba714303b10ccdaa645691/1.architectures/5.sagemaker-hyperpod/LifecycleScripts/base-config/observability/dcgm_metrics_config/dcgm-metrics-basic.csv) | 2026-10-31 | Telemetry |
| [awslabs/awsome-distributed-ai @ 3a1002576ccef26e66ba714303b10ccdaa645691: 1.architectures/5.sagemaker-hyperpod/LifecycleScripts/base-config/observability/install_dcgm_exporter.sh](https://github.com/awslabs/awsome-distributed-ai/blob/3a1002576ccef26e66ba714303b10ccdaa645691/1.architectures/5.sagemaker-hyperpod/LifecycleScripts/base-config/observability/install_dcgm_exporter.sh) | 2026-10-31 | Telemetry |
| [awslabs/awsome-distributed-ai @ 3a1002576ccef26e66ba714303b10ccdaa645691: 1.architectures/5.sagemaker-hyperpod/LifecycleScripts/base-config/observability/install_observability.py](https://github.com/awslabs/awsome-distributed-ai/blob/3a1002576ccef26e66ba714303b10ccdaa645691/1.architectures/5.sagemaker-hyperpod/LifecycleScripts/base-config/observability/install_observability.py) | 2026-10-31 | Telemetry |
| [awslabs/awsome-distributed-ai @ 3a1002576ccef26e66ba714303b10ccdaa645691: examples/training/fsdp/slurm/llama3_1_70b-training.sbatch](https://github.com/awslabs/awsome-distributed-ai/blob/3a1002576ccef26e66ba714303b10ccdaa645691/examples/training/fsdp/slurm/llama3_1_70b-training.sbatch) | 2026-10-31 | ChoosingPath, SlurmFamily |
| [awslabs/awsome-distributed-ai @ 3a1002576ccef26e66ba714303b10ccdaa645691: validation/gpu-cluster-healthcheck/README.md](https://github.com/awslabs/awsome-distributed-ai/blob/3a1002576ccef26e66ba714303b10ccdaa645691/validation/gpu-cluster-healthcheck/README.md) | 2026-10-31 | SlurmFamily |
| [awslabs/awsome-distributed-ai @ 3a1002576ccef26e66ba714303b10ccdaa645691: examples/training](https://github.com/awslabs/awsome-distributed-ai/tree/3a1002576ccef26e66ba714303b10ccdaa645691/examples/training) | 2026-10-30 | FrameworkMap |
| [awslabs/awsome-distributed-ai @ 3a1002576ccef26e66ba714303b10ccdaa645691: validation/gpu-cluster-healthcheck](https://github.com/awslabs/awsome-distributed-ai/tree/3a1002576ccef26e66ba714303b10ccdaa645691/validation/gpu-cluster-healthcheck) | 2026-10-31 | SlurmFamily |
| [awslabs/mountpoint-s3 @ mountpoint-s3-1.24.0: doc/SEMANTICS.md](https://github.com/awslabs/mountpoint-s3/blob/mountpoint-s3-1.24.0/doc/SEMANTICS.md) | 2026-10-31 | Sources appendix, Storage |
| [awslabs/s3-connector-for-pytorch @ c4f482629523d8fd2ec6080f70bda5966f90d89a: s3torchconnector/src/s3torchconnector/_s3client/s3client_config.py](https://github.com/awslabs/s3-connector-for-pytorch/blob/c4f482629523d8fd2ec6080f70bda5966f90d89a/s3torchconnector/src/s3torchconnector/_s3client/s3client_config.py) | 2026-10-30 | calculator presets |
| [awslabs/s3-connector-for-pytorch @ v1.5.0: README.md](https://github.com/awslabs/s3-connector-for-pytorch/blob/v1.5.0/README.md) | 2026-10-31 | Checkpointing, Sources appendix, Storage |
| [awslabs/s3-connector-for-pytorch @ v1.5.0: s3torchconnector/src/s3torchconnector/_s3client/s3client_config.py](https://github.com/awslabs/s3-connector-for-pytorch/blob/v1.5.0/s3torchconnector/src/s3torchconnector/_s3client/s3client_config.py) | 2026-10-31 | Checkpointing, Storage |
| [awslabs/s3-connector-for-pytorch @ v1.5.0: s3torchconnector/src/s3torchconnector/dcp/s3_file_system.py](https://github.com/awslabs/s3-connector-for-pytorch/blob/v1.5.0/s3torchconnector/src/s3torchconnector/dcp/s3_file_system.py) | 2026-10-31 | Checkpointing, Storage |
| [awslabs/s3-connector-for-pytorch @ v1.5.0: s3torchconnector/src/s3torchconnector/dcp/s3_prefix_strategy.py](https://github.com/awslabs/s3-connector-for-pytorch/blob/v1.5.0/s3torchconnector/src/s3torchconnector/dcp/s3_prefix_strategy.py) | 2026-10-31 | Checkpointing |
| [axolotl-ai-cloud/axolotl @ v0.21.1: README.md](https://github.com/axolotl-ai-cloud/axolotl/blob/v0.21.1/README.md) | 2026-10-31 | FineTuning, FrameworkMap |
| [bitsandbytes-foundation/bitsandbytes @ 0.50.2: bitsandbytes/optim/optimizer.py](https://github.com/bitsandbytes-foundation/bitsandbytes/blob/0.50.2/bitsandbytes/optim/optimizer.py) | 2026-10-31 | MemoryBudget |
| [calculon-ai/calculon @ c2aba03022c4870c62a42f127f7e2b97c2ce7de2: calculon/llm.py](https://github.com/calculon-ai/calculon/blob/c2aba03022c4870c62a42f127f7e2b97c2ce7de2/calculon/llm.py) | 2026-10-31 | SetMyRanks |
| [cmanaha/tech-deep-dives @ bd8184164fc3abbe0390183e11e4236c2940abe7: deep-dives/llm-training-systems/research/2026-10/03-frameworks.md](https://github.com/cmanaha/tech-deep-dives/blob/bd8184164fc3abbe0390183e11e4236c2940abe7/deep-dives/llm-training-systems/research/2026-10/03-frameworks.md) | 2026-10-30 | calculator presets |
| [cmanaha/tech-deep-dives @ bd8184164fc3abbe0390183e11e4236c2940abe7: deep-dives/llm-training-systems/research/2026-10/05-aws-infrastructure.md](https://github.com/cmanaha/tech-deep-dives/blob/bd8184164fc3abbe0390183e11e4236c2940abe7/deep-dives/llm-training-systems/research/2026-10/05-aws-infrastructure.md) | 2026-10-30 | calculator presets |
| [deepspeedai/DeepSpeed @ v0.19.9: deepspeed/autotuning/README.md](https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/autotuning/README.md) | 2026-10-30 | SetMyRanks |
| [deepspeedai/DeepSpeed @ v0.19.9: deepspeed/launcher/launch.py](https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/launcher/launch.py) | 2026-10-31 | Collectives, ComposingLayouts |
| [deepspeedai/DeepSpeed @ v0.19.9: deepspeed/runtime/pipe/engine.py](https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/runtime/pipe/engine.py) | 2026-10-31 | FrameworkMap |
| [deepspeedai/DeepSpeed @ v0.19.9: deepspeed/runtime/pipe/module.py](https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/runtime/pipe/module.py) | 2026-10-31 | PipelineParallel, SetMyRanks |
| [deepspeedai/DeepSpeed @ v0.19.9: deepspeed/runtime/pipe/topology.py](https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/runtime/pipe/topology.py) | 2026-10-31 | Collectives, ComposingLayouts |
| [deepspeedai/DeepSpeed @ v0.19.9: deepspeed/runtime/zero/config.py](https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/runtime/zero/config.py) | 2026-10-31 | FrameworkMap |
| [deepspeedai/DeepSpeed @ v0.19.9: deepspeed/runtime/zero/stage_1_and_2.py](https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/runtime/zero/stage_1_and_2.py) | 2026-10-31 | DataParallel, SetMyRanks, Sources appendix |
| [deepspeedai/DeepSpeed @ v0.19.9: deepspeed/sequence/layer.py](https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/sequence/layer.py) | 2026-10-31 | ContextParallel |
| [deepspeedai/DeepSpeed @ v0.19.9: docs/_tutorials/autotp-training.md](https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/docs/_tutorials/autotp-training.md) | 2026-10-31 | FrameworkMap |
| [deepspeedai/DeepSpeed @ v0.19.9: docs/_tutorials/getting-started.md](https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/docs/_tutorials/getting-started.md) | 2026-10-31 | FrameworkMap |
| [deepspeedai/DeepSpeed @ v0.19.9: docs/_tutorials/pipeline.md](https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/docs/_tutorials/pipeline.md) | 2026-10-31 | FrameworkMap |
| [deepspeedai/DeepSpeed @ v0.19.9: docs/_tutorials/ulysses-alst-sequence-parallelism.md](https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/docs/_tutorials/ulysses-alst-sequence-parallelism.md) | 2026-10-31 | FrameworkMap |
| [deepspeedai/DeepSpeed @ v0.19.9: docs/_tutorials/universal-checkpointing.md](https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/docs/_tutorials/universal-checkpointing.md) | 2026-10-31 | FrameworkMap |
| [deepspeedai/DeepSpeed @ v0.19.9: docs/_tutorials/zero.md](https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/docs/_tutorials/zero.md) | 2026-10-31 | FrameworkMap |
| [deepspeedai/DeepSpeed @ v0.19.9: tests/unit/runtime/half_precision/test_fp8.py](https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/tests/unit/runtime/half_precision/test_fp8.py) | 2026-10-31 | FrameworkMap |
| [facebookresearch/HolisticTraceAnalysis @ v0.6.1: hta/trace_analysis.py](https://github.com/facebookresearch/HolisticTraceAnalysis/blob/v0.6.1/hta/trace_analysis.py) | 2026-10-31 | Sources appendix, Telemetry |
| [hiyouga/LLaMA-Factory @ v0.9.5: README.md](https://github.com/hiyouga/LLaMA-Factory/blob/v0.9.5/README.md) | 2026-10-31 | FineTuning |
| [huggingface/accelerate @ v1.15.0: docs/source/concept_guides/sequence_parallelism.md](https://github.com/huggingface/accelerate/blob/v1.15.0/docs/source/concept_guides/sequence_parallelism.md) | 2026-10-31 | FrameworkMap |
| [huggingface/accelerate @ v1.15.0: docs/source/usage_guides/low_precision_training.md](https://github.com/huggingface/accelerate/blob/v1.15.0/docs/source/usage_guides/low_precision_training.md) | 2026-10-31 | FrameworkMap, Precision |
| [huggingface/accelerate @ v1.15.0: docs/source/usage_guides/megatron_lm.md](https://github.com/huggingface/accelerate/blob/v1.15.0/docs/source/usage_guides/megatron_lm.md) | 2026-10-31 | FrameworkMap |
| [huggingface/accelerate @ v1.15.0: src/accelerate/accelerator.py](https://github.com/huggingface/accelerate/blob/v1.15.0/src/accelerate/accelerator.py) | 2026-10-31 | FrameworkMap |
| [huggingface/accelerate @ v1.15.0: src/accelerate/parallelism_config.py](https://github.com/huggingface/accelerate/blob/v1.15.0/src/accelerate/parallelism_config.py) | 2026-10-31 | FrameworkMap |
| [huggingface/accelerate @ v1.15.0: src/accelerate/utils/dataclasses.py](https://github.com/huggingface/accelerate/blob/v1.15.0/src/accelerate/utils/dataclasses.py) | 2026-10-31 | FrameworkMap |
| [Nanotron v0.5](https://github.com/huggingface/nanotron/tree/v0.5) | 2026-10-31 | FrameworkMap |
| [huggingface/transformers @ v5.22.1: src/transformers/training_args.py](https://github.com/huggingface/transformers/blob/v5.22.1/src/transformers/training_args.py) | 2026-10-31 | FrameworkMap |
| [huggingface/trl @ 1b5c75ed94b7387f42532adb090c935166d4878d: pyproject.toml](https://github.com/huggingface/trl/blob/1b5c75ed94b7387f42532adb090c935166d4878d/pyproject.toml) | 2026-10-31 | FineTuning |
| [kubeflow/trainer @ 658725bdae5c7e3a0854d93ac6ff492e109a22ab: README.md](https://github.com/kubeflow/trainer/blob/658725bdae5c7e3a0854d93ac6ff492e109a22ab/README.md) | 2026-10-31 | AwsOwnership, KubernetesFamily |
| [kubernetes-sigs/jobset @ v0.13.0: README.md](https://github.com/kubernetes-sigs/jobset/blob/v0.13.0/README.md) | 2026-10-31 | KubernetesFamily, Sources appendix |
| [kubernetes-sigs/kueue @ 14b792888dcb30cf055bf2618b6260a4989cf85f: README.md](https://github.com/kubernetes-sigs/kueue/blob/14b792888dcb30cf055bf2618b6260a4989cf85f/README.md) | 2026-10-31 | AwsOwnership, ChoosingPath, KubernetesFamily, Sources appendix |
| [meta-llama/llama-models @ 5fdf83110cc9daa7435dfba6eb304892cc0041b8: models/llama3/model.py](https://github.com/meta-llama/llama-models/blob/5fdf83110cc9daa7435dfba6eb304892cc0041b8/models/llama3/model.py) | 2026-10-30 | Arithmetic, calculator presets |
| [meta-llama/llama-models @ 5fdf83110cc9daa7435dfba6eb304892cc0041b8: models/llama3/tokenizer.py](https://github.com/meta-llama/llama-models/blob/5fdf83110cc9daa7435dfba6eb304892cc0041b8/models/llama3/tokenizer.py) | 2026-10-30 | Storage, calculator presets |
| [meta-llama/llama-models @ v0.2.0: models/llama3_1/MODEL_CARD.md](https://github.com/meta-llama/llama-models/blob/v0.2.0/models/llama3_1/MODEL_CARD.md) | 2026-10-31 | Arithmetic, CapacityCost, TrainingStep |
| [meta-llama/llama-models @ v0.2.0: models/llama3/model.py](https://github.com/meta-llama/llama-models/blob/v0.2.0/models/llama3/model.py) | 2026-10-31 | MemoryBudget |
| [meta-llama/llama-models @ v0.2.0: models/llama3/tokenizer.py](https://github.com/meta-llama/llama-models/blob/v0.2.0/models/llama3/tokenizer.py) | 2026-10-30, 2026-10-31 | MemoryBudget, SetMyRanks, TrainingStep |
| [meta-pytorch/torchft @ v0.2.0: README.md](https://github.com/meta-pytorch/torchft/blob/v0.2.0/README.md) | 2026-10-31 | Resuming |
| [meta-pytorch/torchft @ v0.2.0: torchft/manager.py](https://github.com/meta-pytorch/torchft/blob/v0.2.0/torchft/manager.py) | 2026-10-31 | Resuming |
| [meta-pytorch/torchtune @ bd2a0fc7c31430972728494fa01aaeeb0ebf1ba1: README.md](https://github.com/meta-pytorch/torchtune/blob/bd2a0fc7c31430972728494fa01aaeeb0ebf1ba1/README.md) | 2026-10-31 | FrameworkMap |
| [mosaicml/streaming @ v0.13.0: README.md](https://github.com/mosaicml/streaming/blob/v0.13.0/README.md) | 2026-10-31 | Resuming |
| [NVIDIA-NeMo/Automodel @ v0.7.0: README.md](https://github.com/NVIDIA-NeMo/Automodel/blob/v0.7.0/README.md) | 2026-10-31 | FrameworkMap, Precision |
| [NVIDIA-NeMo/Megatron-Bridge @ 04ce2b3efd6f2e387fc244e9f37afd0a1f7952fb: src/megatron/bridge/recipes/llama/h100/llama3.py](https://github.com/NVIDIA-NeMo/Megatron-Bridge/blob/04ce2b3efd6f2e387fc244e9f37afd0a1f7952fb/src/megatron/bridge/recipes/llama/h100/llama3.py) | 2026-10-30 | SetMyRanks |
| [NVIDIA-NeMo/Megatron-Bridge @ v0.7.0: docs/nemo2-migration-guide.md](https://github.com/NVIDIA-NeMo/Megatron-Bridge/blob/v0.7.0/docs/nemo2-migration-guide.md) | 2026-10-31 | FrameworkMap |
| [NVIDIA-NeMo/Megatron-Bridge @ v0.7.0: README.md](https://github.com/NVIDIA-NeMo/Megatron-Bridge/blob/v0.7.0/README.md) | 2026-10-31 | FrameworkMap |
| [NVIDIA-NeMo/Megatron-Bridge @ v0.7.0: src/megatron/bridge/recipes/llama/h100/llama3.py](https://github.com/NVIDIA-NeMo/Megatron-Bridge/blob/v0.7.0/src/megatron/bridge/recipes/llama/h100/llama3.py) | 2026-10-31 | FrameworkMap |
| [Megatron Bridge source tree at v0.7.0](https://github.com/NVIDIA-NeMo/Megatron-Bridge/tree/04ce2b3efd6f2e387fc244e9f37afd0a1f7952fb) | 2026-10-30 | SetMyRanks |
| [NVIDIA-NeMo/RL @ v0.7.0: README.md](https://github.com/NVIDIA-NeMo/RL/blob/v0.7.0/README.md) | 2026-10-31 | FineTuning, FrameworkMap |
| [NVIDIA/dcgm-exporter @ 4.8.4: etc/dcp-metrics-included.csv](https://github.com/NVIDIA/dcgm-exporter/blob/4.8.4/etc/dcp-metrics-included.csv) | 2026-10-31 | Sources appendix, Telemetry |
| [NVIDIA/dcgm-exporter @ 4.8.4: etc/default-counters.csv](https://github.com/NVIDIA/dcgm-exporter/blob/4.8.4/etc/default-counters.csv) | 2026-10-31 | Telemetry, WhatToMeasure |
| [NVIDIA/DCGM @ v4.7.0: dcgmlib/dcgm_fields.h](https://github.com/NVIDIA/DCGM/blob/v4.7.0/dcgmlib/dcgm_fields.h) | 2026-10-31 | Sources appendix, Telemetry, WhatToMeasure |
| [NVIDIA/Megatron-LM @ 685fb8bd970185e9ac3283fe32a5d6667bf4b268: docs/user-guide/features/dist_optimizer.md](https://github.com/NVIDIA/Megatron-LM/blob/685fb8bd970185e9ac3283fe32a5d6667bf4b268/docs/user-guide/features/dist_optimizer.md) | 2026-10-30 | calculator presets |
| [NVIDIA/Megatron-LM @ core_v0.20.0: docs/api-guide/core/dist_checkpointing.md](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/api-guide/core/dist_checkpointing.md) | 2026-10-31 | FrameworkMap |
| [NVIDIA/Megatron-LM @ core_v0.20.0: docs/user-guide/features/context_parallel.md](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/context_parallel.md) | 2026-10-31 | ContextParallel, MemoryBudget |
| [NVIDIA/Megatron-LM @ core_v0.20.0: docs/user-guide/features/dist_optimizer.md](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/dist_optimizer.md) | 2026-10-31 | FineTuning, FrameworkMap, KubernetesFamily, MemoryBudget, SetMyRanks, Sources appendix, ThreeBudgets, TrainingStep |
| [NVIDIA/Megatron-LM @ core_v0.20.0: docs/user-guide/features/low_precision_training.md](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/low_precision_training.md) | 2026-10-31 | FrameworkMap, Precision |
| [NVIDIA/Megatron-LM @ core_v0.20.0: docs/user-guide/features/megatron_fsdp.md](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/megatron_fsdp.md) | 2026-10-31 | FrameworkMap |
| [NVIDIA/Megatron-LM @ core_v0.20.0: docs/user-guide/parallelism-guide.md](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/parallelism-guide.md) | 2026-10-31 | ContextParallel, ExpertParallel, SetMyRanks, Sources appendix, TensorParallel |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/datasets/gpt_dataset.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/datasets/gpt_dataset.py) | 2026-10-31 | Resuming, Storage |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/datasets/indexed_dataset.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/datasets/indexed_dataset.py) | 2026-10-31 | Storage |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/distributed/distributed_data_parallel_config.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/distributed/distributed_data_parallel_config.py) | 2026-10-31 | KubernetesFamily |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/model_parallel_config.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/model_parallel_config.py) | 2026-10-31 | ExpertParallel, MemoryBudget, PipelineParallel, TensorParallel |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/models/gpt/gpt_layer_specs.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/models/gpt/gpt_layer_specs.py) | 2026-10-31 | TensorParallel |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/num_microbatches_calculator.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/num_microbatches_calculator.py) | 2026-10-31 | PipelineParallel, SetMyRanks |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/optimizer/distrib_optimizer.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/optimizer/distrib_optimizer.py) | 2026-10-31 | FrameworkMap |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/optimizer/optimizer_config.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/optimizer/optimizer_config.py) | 2026-10-31 | MemoryBudget |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/parallel_state.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/parallel_state.py) | 2026-10-31 | Collectives, ComposingLayouts, ContextParallel, ExpertParallel |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/pipeline_parallel/combined_1f1b.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/pipeline_parallel/combined_1f1b.py) | 2026-10-31 | ExpertParallel, FrameworkMap, PipelineParallel |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/pipeline_parallel/schedules.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/pipeline_parallel/schedules.py) | 2026-10-31 | FrameworkMap, PipelineParallel |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/rerun_state_machine.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/rerun_state_machine.py) | 2026-10-31 | WhatToMeasure |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/tensor_parallel/cross_entropy.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/tensor_parallel/cross_entropy.py) | 2026-10-31 | MemoryBudget |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/tensor_parallel/layers.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/tensor_parallel/layers.py) | 2026-10-31 | TensorParallel |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/tensor_parallel/mappings.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/tensor_parallel/mappings.py) | 2026-10-31 | TensorParallel |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/transformer/moe/moe_utils.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/moe/moe_utils.py) | 2026-10-31 | ExpertParallel |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/transformer/moe/README.md](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/moe/README.md) | 2026-10-31 | ContextParallel, ExpertParallel, FrameworkMap, PipelineParallel, SetMyRanks, Sources appendix |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/transformer/moe/router.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/moe/router.py) | 2026-10-31 | ExpertParallel |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/core/transformer/transformer_config.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/transformer_config.py) | 2026-10-31 | ExpertParallel, FrameworkMap, PipelineParallel, Precision, SetMyRanks, TensorParallel |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/training/arguments.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py) | 2026-10-31 | Checkpointing, ContextParallel, ExpertParallel, FrameworkMap, MemoryBudget, PipelineParallel, SetMyRanks, Sources appendix, TensorParallel, WhatToMeasure |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/training/checkpointing.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/checkpointing.py) | 2026-10-31 | FrameworkMap |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/training/config/resilience_config.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/config/resilience_config.py) | 2026-10-31 | WhatToMeasure |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/training/config/training_config.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/config/training_config.py) | 2026-10-31 | Checkpointing, FrameworkMap, Resuming |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/training/datasets/data_samplers.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/datasets/data_samplers.py) | 2026-10-31 | Resuming |
| [NVIDIA/Megatron-LM @ core_v0.20.0: megatron/training/utils/common_utils.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/utils/common_utils.py) | 2026-10-31 | TensorParallel |
| [NVIDIA/Megatron-LM @ core_v0.20.0: README.md](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/README.md) | 2026-10-31 | FrameworkMap |
| [NVIDIA/Megatron-LM @ core_v0.20.0: tools/preprocess_data.py](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/tools/preprocess_data.py) | 2026-10-31 | Storage |
| [NVIDIA/nccl-tests @ v2.21.1: doc/PERFORMANCE.md](https://github.com/NVIDIA/nccl-tests/blob/v2.21.1/doc/PERFORMANCE.md) | 2026-10-31 | BringUp, Collectives, DataParallel, Sources appendix |
| [NVIDIA/NeMo @ v2.7.3: examples/llm/auto_configurator/README.md](https://github.com/NVIDIA/NeMo/blob/v2.7.3/examples/llm/auto_configurator/README.md) | 2026-10-30 | BringUp, SetMyRanks |
| [NVIDIA/NeMo @ v2.7.3: nemo/collections/llm/tools/auto_configurator/core/training_config.py](https://github.com/NVIDIA/NeMo/blob/v2.7.3/nemo/collections/llm/tools/auto_configurator/core/training_config.py) | 2026-10-30 | DataParallel, SetMyRanks |
| [NVIDIA/NeMo @ v3.0.0: README.md](https://github.com/NVIDIA/NeMo/blob/v3.0.0/README.md) | 2026-10-30, 2026-10-31 | FrameworkMap, SetMyRanks |
| [NVIDIA/NeMo @ v3.0.0: nemo/collections](https://github.com/NVIDIA/NeMo/tree/v3.0.0/nemo/collections) | 2026-10-31 | FrameworkMap |
| [NVIDIA/TransformerEngine @ v2.21.0: transformer_engine/common/recipe/__init__.py](https://github.com/NVIDIA/TransformerEngine/blob/v2.21.0/transformer_engine/common/recipe/__init__.py) | 2026-10-31 | Precision, Sources appendix |
| [NVIDIA/TransformerEngine @ v2.21.0: transformer_engine/pytorch/cross_entropy.py](https://github.com/NVIDIA/TransformerEngine/blob/v2.21.0/transformer_engine/pytorch/cross_entropy.py) | 2026-10-31 | MemoryBudget |
| [NVIDIA/TransformerEngine @ v2.21.0: transformer_engine/pytorch/quantization.py](https://github.com/NVIDIA/TransformerEngine/blob/v2.21.0/transformer_engine/pytorch/quantization.py) | 2026-10-31 | Precision |
| [NVIDIA/TransformerEngine @ v2.21.0: transformer_engine/pytorch/triton/cross_entropy.py](https://github.com/NVIDIA/TransformerEngine/blob/v2.21.0/transformer_engine/pytorch/triton/cross_entropy.py) | 2026-10-31 | MemoryBudget |
| [ofiwg/libfabric @ v2.6.0: man/fi_info.1.md](https://github.com/ofiwg/libfabric/blob/v2.6.0/man/fi_info.1.md) | 2026-10-31 | BringUp |
| [OpenRLHF/OpenRLHF @ 17fd4a79cc87dfb2f6185ffac634066525bcd917: openrlhf/cli/train_ppo_ray.py](https://github.com/OpenRLHF/OpenRLHF/blob/17fd4a79cc87dfb2f6185ffac634066525bcd917/openrlhf/cli/train_ppo_ray.py) | 2026-10-31 | FineTuning |
| [OpenRLHF/OpenRLHF @ 17fd4a79cc87dfb2f6185ffac634066525bcd917: openrlhf/utils/utils.py](https://github.com/OpenRLHF/OpenRLHF/blob/17fd4a79cc87dfb2f6185ffac634066525bcd917/openrlhf/utils/utils.py) | 2026-10-31 | FineTuning |
| [pytorch/data @ v0.11.0: torchdata/stateful_dataloader/README.md](https://github.com/pytorch/data/blob/v0.11.0/torchdata/stateful_dataloader/README.md) | 2026-10-31 | Resuming |
| [pytorch/pytorch @ v2.10.0: torch/csrc/distributed/c10d/FlightRecorder.hpp](https://github.com/pytorch/pytorch/blob/v2.10.0/torch/csrc/distributed/c10d/FlightRecorder.hpp) | 2026-10-31 | Telemetry |
| [pytorch/pytorch @ v2.11.0: torch/csrc/distributed/c10d/FlightRecorder.hpp](https://github.com/pytorch/pytorch/blob/v2.11.0/torch/csrc/distributed/c10d/FlightRecorder.hpp) | 2026-10-31 | Telemetry |
| [pytorch/pytorch @ v2.15.0: docs/source/distributed.checkpoint.md](https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/distributed.checkpoint.md) | 2026-10-31 | Checkpointing, FrameworkMap |
| [pytorch/pytorch @ v2.15.0: docs/source/distributed.fsdp.fully_shard.md](https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/distributed.fsdp.fully_shard.md) | 2026-10-31 | FrameworkMap |
| [pytorch/pytorch @ v2.15.0: docs/source/distributed.pipelining.md](https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/distributed.pipelining.md) | 2026-10-31 | FrameworkMap |
| [pytorch/pytorch @ v2.15.0: docs/source/distributed.tensor.md](https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/distributed.tensor.md) | 2026-10-31 | FrameworkMap |
| [pytorch/pytorch @ v2.15.0: docs/source/distributed.tensor.parallel.md](https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/distributed.tensor.parallel.md) | 2026-10-31 | FrameworkMap |
| [pytorch/pytorch @ v2.15.0: docs/source/notes/cuda.md](https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/notes/cuda.md) | 2026-10-31 | MemoryBudget |
| [pytorch/pytorch @ v2.15.0: docs/source/notes/randomness.md](https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/notes/randomness.md) | 2026-10-31 | Resuming |
| [pytorch/pytorch @ v2.15.0: docs/source/torch_cuda_memory.md](https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/torch_cuda_memory.md) | 2026-10-31 | WhatToMeasure |
| [pytorch/pytorch @ v2.15.0: docs/source/torch_nccl_environment_variables.md](https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/torch_nccl_environment_variables.md) | 2026-10-31 | Telemetry |
| [pytorch/pytorch @ v2.15.0: pyproject.toml](https://github.com/pytorch/pytorch/blob/v2.15.0/pyproject.toml) | 2026-10-31 | Telemetry |
| [pytorch/pytorch @ v2.15.0: torch/csrc/distributed/c10d/FlightRecorder.cpp](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/csrc/distributed/c10d/FlightRecorder.cpp) | 2026-10-31 | Sources appendix, Telemetry |
| [pytorch/pytorch @ v2.15.0: torch/csrc/distributed/c10d/FlightRecorder.hpp](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/csrc/distributed/c10d/FlightRecorder.hpp) | 2026-10-31 | Telemetry |
| [pytorch/pytorch @ v2.15.0: torch/csrc/distributed/c10d/ProcessGroupNCCL.cpp](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/csrc/distributed/c10d/ProcessGroupNCCL.cpp) | 2026-10-31 | Sources appendix, Telemetry |
| [pytorch/pytorch @ v2.15.0: torch/csrc/distributed/c10d/ProcessGroupNCCL.hpp](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/csrc/distributed/c10d/ProcessGroupNCCL.hpp) | 2026-10-31 | Telemetry |
| [pytorch/pytorch @ v2.15.0: torch/cuda/memory.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/cuda/memory.py) | 2026-10-31 | MemoryBudget, WhatToMeasure |
| [pytorch/pytorch @ v2.15.0: torch/distributed/_mesh_layout.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/_mesh_layout.py) | 2026-10-31 | ComposingLayouts |
| [pytorch/pytorch @ v2.15.0: torch/distributed/checkpoint/filesystem.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/checkpoint/filesystem.py) | 2026-10-31 | Checkpointing, Storage |
| [pytorch/pytorch @ v2.15.0: torch/distributed/checkpoint/staging.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/checkpoint/staging.py) | 2026-10-31 | Checkpointing |
| [pytorch/pytorch @ v2.15.0: torch/distributed/checkpoint/state_dict_saver.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/checkpoint/state_dict_saver.py) | 2026-10-31 | Checkpointing, FrameworkMap, Sources appendix, ThreeBudgets |
| [pytorch/pytorch @ v2.15.0: torch/distributed/device_mesh.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/device_mesh.py) | 2026-10-31 | ComposingLayouts, Sources appendix |
| [pytorch/pytorch @ v2.15.0: torch/distributed/distributed_c10d.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/distributed_c10d.py) | 2026-10-31 | Checkpointing, Telemetry |
| [pytorch/pytorch @ v2.15.0: torch/distributed/elastic/agent/server/api.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/elastic/agent/server/api.py) | 2026-10-31 | Collectives, ComposingLayouts |
| [pytorch/pytorch @ v2.15.0: torch/distributed/flight_recorder/components/utils.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/flight_recorder/components/utils.py) | 2026-10-31 | Telemetry |
| [pytorch/pytorch @ v2.15.0: torch/distributed/fsdp/_fully_shard/_fsdp_api.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/fsdp/_fully_shard/_fsdp_api.py) | 2026-10-31 | DataParallel |
| [pytorch/pytorch @ v2.15.0: torch/distributed/fsdp/_fully_shard/_fsdp_param_group.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/fsdp/_fully_shard/_fsdp_param_group.py) | 2026-10-31 | DataParallel |
| [pytorch/pytorch @ v2.15.0: torch/distributed/fsdp/_fully_shard/_fully_shard.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/fsdp/_fully_shard/_fully_shard.py) | 2026-10-31 | DataParallel, FrameworkMap, Sources appendix |
| [pytorch/pytorch @ v2.15.0: torch/distributed/pipelining/schedules.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/pipelining/schedules.py) | 2026-10-31 | FrameworkMap, PipelineParallel, Sources appendix |
| [pytorch/pytorch @ v2.15.0: torch/distributed/run.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/run.py) | 2026-10-31 | Resuming |
| [pytorch/pytorch @ v2.15.0: torch/distributed/tensor/experimental/_context_parallel/_attention.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/tensor/experimental/_context_parallel/_attention.py) | 2026-10-31 | FrameworkMap |
| [pytorch/pytorch @ v2.15.0: torch/nn/parallel/distributed.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/nn/parallel/distributed.py) | 2026-10-31 | DataParallel |
| [pytorch/pytorch @ v2.15.0: torch/optim/_adafactor.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/optim/_adafactor.py) | 2026-10-31 | MemoryBudget |
| [pytorch/pytorch @ v2.15.0: torch/optim/_muon.py](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/optim/_muon.py) | 2026-10-31 | MemoryBudget |
| [pytorch/pytorch @ v2.5.0: torch/csrc/distributed/c10d/ProcessGroupNCCL.cpp](https://github.com/pytorch/pytorch/blob/v2.5.0/torch/csrc/distributed/c10d/ProcessGroupNCCL.cpp) | 2026-10-30 | Telemetry |
| [pytorch/torchtitan @ v0.4.0: docs/benchmarks/llama3_h100_202412_torchtitan.md](https://github.com/pytorch/torchtitan/blob/v0.4.0/docs/benchmarks/llama3_h100_202412_torchtitan.md) | 2026-10-30, 2026-10-31 | ComposingLayouts, MemoryBudget, SetMyRanks, Sources appendix, Trainium |
| [pytorch/torchtitan @ v0.4.0: docs/debugging.md](https://github.com/pytorch/torchtitan/blob/v0.4.0/docs/debugging.md) | 2026-10-31 | BringUp, Telemetry |
| [pytorch/torchtitan @ v0.4.0: README.md](https://github.com/pytorch/torchtitan/blob/v0.4.0/README.md) | 2026-10-31 | BringUp, FineTuning, FrameworkMap |
| [pytorch/torchtitan @ v0.4.0: torchtitan/components/checkpointer/base.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/components/checkpointer/base.py) | 2026-10-31 | Checkpointing |
| [pytorch/torchtitan @ v0.4.0: torchtitan/components/checkpointer/dcp.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/components/checkpointer/dcp.py) | 2026-10-31 | Checkpointing |
| [pytorch/torchtitan @ v0.4.0: torchtitan/components/optim/optim.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/components/optim/optim.py) | 2026-10-31 | WhatToMeasure |
| [pytorch/torchtitan @ v0.4.0: torchtitan/config/parallelism.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/config/parallelism.py) | 2026-10-31 | DataParallel, FrameworkMap, PipelineParallel, SetMyRanks, Sources appendix, TensorParallel |
| [pytorch/torchtitan @ v0.4.0: torchtitan/config/README.md](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/config/README.md) | 2026-10-31 | FrameworkMap |
| [pytorch/torchtitan @ v0.4.0: torchtitan/distributed/parallelism_context.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/distributed/parallelism_context.py) | 2026-10-31 | Collectives, ComposingLayouts, WhatToMeasure |
| [pytorch/torchtitan @ v0.4.0: torchtitan/distributed/pipeline_parallel.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/distributed/pipeline_parallel.py) | 2026-10-31 | PipelineParallel |
| [pytorch/torchtitan @ v0.4.0: torchtitan/distributed/utils.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/distributed/utils.py) | 2026-10-31 | Resuming, WhatToMeasure |
| [pytorch/torchtitan @ v0.4.0: torchtitan/models/common/activation.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/common/activation.py) | 2026-10-31 | MemoryBudget, TrainingStep |
| [pytorch/torchtitan @ v0.4.0: torchtitan/models/common/config_utils.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/common/config_utils.py) | 2026-10-31 | TensorParallel |
| [pytorch/torchtitan @ v0.4.0: torchtitan/models/common/decoder_sharding.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/common/decoder_sharding.py) | 2026-10-31 | TensorParallel |
| [pytorch/torchtitan @ v0.4.0: torchtitan/models/common/flops.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/common/flops.py) | 2026-10-31 | Arithmetic, BringUp |
| [pytorch/torchtitan @ v0.4.0: torchtitan/models/llama3/flavors.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/llama3/flavors.py) | 2026-10-31 | TensorParallel |
| [pytorch/torchtitan @ v0.4.0: torchtitan/models/llama3/model.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/llama3/model.py) | 2026-10-31 | Arithmetic |
| [pytorch/torchtitan @ v0.4.0: torchtitan/observability/metrics.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/observability/metrics.py) | 2026-10-31 | Arithmetic, WhatToMeasure |
| [pytorch/torchtitan @ v0.4.0: torchtitan/quantization/mxfp8/README.md](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/quantization/mxfp8/README.md) | 2026-10-31 | Precision |
| [pytorch/torchtitan @ v0.4.0: torchtitan/quantization/README.md](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/quantization/README.md) | 2026-10-31 | FrameworkMap, Precision |
| [pytorch/torchtitan @ v0.4.0: torchtitan/tools/garbage_collector.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/tools/garbage_collector.py) | 2026-10-31 | Resuming |
| [pytorch/torchtitan @ v0.4.0: torchtitan/tools/utils.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/tools/utils.py) | 2026-10-31 | Arithmetic, WhatToMeasure |
| [pytorch/torchtitan @ v0.4.0: torchtitan/trainer.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/trainer.py) | 2026-10-31 | PipelineParallel |
| [pytorch/torchtitan @ v0.4.0: torchtitan/training_engine.py](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/training_engine.py) | 2026-10-31 | Checkpointing, DataParallel, Resuming |
| [torchtitan commit 7cdf0aa9](https://github.com/pytorch/torchtitan/commit/7cdf0aa9f9788ed39521edb192e0dcd2815a374e) | 2026-10-31 | FrameworkMap |
| [v0.4.0 release](https://github.com/pytorch/torchtitan/releases/tag/v0.4.0) | 2026-10-30, 2026-10-31 | FineTuning, FrameworkMap, Precision, Trainium |
| [THUDM/slime @ 0b0c277d5b4cc66efc3b6db269e2e5184e8f3b1e: train.py](https://github.com/THUDM/slime/blob/0b0c277d5b4cc66efc3b6db269e2e5184e8f3b1e/train.py) | 2026-10-31 | FineTuning |
| [THUDM/slime @ 0b0c277d5b4cc66efc3b6db269e2e5184e8f3b1e: slime/backends](https://github.com/THUDM/slime/tree/0b0c277d5b4cc66efc3b6db269e2e5184e8f3b1e/slime/backends) | 2026-10-31 | FineTuning |
| [volcengine/verl @ 1876b06d0a3e4e71e06230be10af14492ca8a75b: verl/trainer/config/rollout/rollout.yaml](https://github.com/volcengine/verl/blob/1876b06d0a3e4e71e06230be10af14492ca8a75b/verl/trainer/config/rollout/rollout.yaml) | 2026-10-31 | FineTuning |
| [volcengine/verl @ 1876b06d0a3e4e71e06230be10af14492ca8a75b: verl/trainer/config/actor](https://github.com/volcengine/verl/tree/1876b06d0a3e4e71e06230be10af14492ca8a75b/verl/trainer/config/actor) | 2026-10-31 | FineTuning |
| [405B](https://huggingface.co/api/models/meta-llama/Llama-3.1-405B/revision/b906e4dc842aa489c962f9db26554dcfdde901fe) | 2026-10-30, 2026-10-31 | Arithmetic, FineTuning, Storage, ThreeBudgets, calculator presets |
| [70B](https://huggingface.co/api/models/meta-llama/Llama-3.1-70B/revision/349b2ddb53ce8f2849a6c168a81980ab25258dac) | 2026-10-30, 2026-10-31 | Arithmetic, AwsHardware, Checkpointing, FineTuning, KubernetesFamily, MemoryBudget, Precision, SetMyRanks, Storage, TensorParallel, TrainingStep, calculator presets |
| [8B](https://huggingface.co/api/models/meta-llama/Llama-3.1-8B/revision/d04e592bb4f6aa9cfee91e2e20afa771667e1d4b) | 2026-10-30, 2026-10-31 | Arithmetic, Collectives, DataParallel, FineTuning, GettingStarted, MemoryBudget, Storage, ThreeBudgets, TrainingStep, calculator presets |
| [AWS Price List, AmazonEC2 all Regions, version 20261029175634](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/index.csv) | 2026-10-30, 2026-10-31 | CapacityCost, Trainium, calculator presets |
| [EC2 Price List, us-east-1](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv) | 2026-10-30, 2026-10-31 | Arithmetic, AwsHardware, AwsOwnership, CapacityCost, Checkpointing, ChoosingPath, Collectives, DataParallel, Resuming, SetMyRanks, SlurmFamily, Sources appendix, TrainingJobs, calculator presets |
| [AWS Price List, AmazonEC2 offer 20261029175634, us-east-2](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-2/index.csv) | 2026-10-30 | calculator presets |
| [Amazon EKS Price List, us-east-1](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEKS/20261027191639/us-east-1/index.json) | 2026-10-30, 2026-10-31 | AwsOwnership, CapacityCost, ChoosingPath, KubernetesFamily, calculator presets |
| [AmazonFSx price list](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonFSx/20260911124432/us-east-1/index.json) | 2026-10-30 | Checkpointing, Storage, calculator presets |
| [SageMaker Price List, us-east-1](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonSageMaker/20261029165009/us-east-1/index.csv) | 2026-10-30, 2026-10-31 | AwsOwnership, CapacityCost, ChoosingPath, SlurmFamily, TrainingJobs, calculator presets |
| [AWS Price List, AmazonSageMaker offer 20261029165009, us-east-2](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonSageMaker/20261029165009/us-east-2/index.csv) | 2026-10-30 | Arithmetic, CapacityCost, Trainium, calculator presets |
| [AWS PCS Price List, us-east-1](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AWSPCS/20261027150327/us-east-1/index.json) | 2026-10-30, 2026-10-31 | AwsOwnership, CapacityCost, ChoosingPath, SlurmFamily, calculator presets |
| [amzn-sagemaker-checkpointing 1.1.3 source](https://pypi.org/project/amzn-sagemaker-checkpointing/1.1.3/) | 2026-10-31 | Checkpointing |
| [Slurm sbatch documentation](https://slurm.schedmd.com/sbatch.html) | 2026-10-31 | AwsOwnership, ChoosingPath, Resuming, SlurmFamily |
| [Slurm 26.05 slurm.conf documentation](https://slurm.schedmd.com/slurm.conf.html) | 2026-10-31 | SlurmFamily |
| [Slurm srun manual, --distribution](https://slurm.schedmd.com/srun.html) | 2026-10-31 | Collectives, ComposingLayouts |
| [OCP Microscaling Formats (MX) Specification v1.0, Sections 5.1, 5.2 and 5.4](https://web.archive.org/web/20251208023552/https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf) | 2026-10-31 | Precision |
| [NVIDIA A100](https://www.nvidia.com/en-us/data-center/a100/) | 2026-10-30, 2026-10-31 | AwsHardware, CapacityCost, calculator presets |
| [GB200 NVL72](https://www.nvidia.com/en-us/data-center/gb200-nvl72/) | 2026-10-30, 2026-10-31 | AwsHardware, CapacityCost, Sources appendix, calculator presets |
| [H100](https://www.nvidia.com/en-us/data-center/h100/) | 2026-10-30, 2026-10-31 | Arithmetic, AwsHardware, BringUp, CapacityCost, Checkpointing, ContextParallel, DataParallel, FineTuning, GettingStarted, KubernetesFamily, MemoryBudget, PipelineParallel, Precision, SetMyRanks, Sources appendix, Storage, TensorParallel, ThreeBudgets, TrainingJobs, TrainingStep, Trainium, calculator presets |
| [H200](https://www.nvidia.com/en-us/data-center/h200/) | 2026-10-30, 2026-10-31 | Arithmetic, AwsHardware, MemoryBudget, Precision, SetMyRanks, calculator presets |
| [HGX B200 and B300](https://www.nvidia.com/en-us/data-center/hgx/) | 2026-10-30, 2026-10-31 | Arithmetic, AwsHardware, CapacityCost, Precision, Sources appendix, calculator presets |
| [NVIDIA NVLink](https://www.nvidia.com/en-us/data-center/nvlink/) | 2026-10-30, 2026-10-31 | Collectives, ComposingLayouts, ContextParallel, DataParallel, ExpertParallel, GettingStarted, SetMyRanks, Sources appendix, TensorParallel, ThreeBudgets, calculator presets |

## Tier 2: first-party lab and vendor posts and talks (their performance figures are claims)

19 sources.

| Source | Accessed | Cited in |
| --- | --- | --- |
| [AWS What's New, 2024-12-04](https://aws.amazon.com/about-aws/whats-new/2024/12/task-governance-amazon-sagemaker-hyperpod/) | 2026-10-31 | KubernetesFamily |
| [AWS What's New, 2025-06-30](https://aws.amazon.com/about-aws/whats-new/2025/06/amazon-sagemaker-hyperpod-training-operator/) | 2026-10-31 | KubernetesFamily |
| [AWS What's New, 2025-07-31](https://aws.amazon.com/about-aws/whats-new/2025/07/aws-batch-sagemaker-training-jobs/) | 2026-10-31 | TrainingJobs |
| [What's New: P6e-GB300 UltraServers](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-p6e-gb300-ultraservers-nvidia-gb300-nvl72-generally-available/) | 2026-10-31 | AwsHardware |
| [What's New: Trn3 UltraServers](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/) | 2026-10-31 | AwsHardware |
| [AWS What's New, 2025-12-03](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-sagemaker-hyperpod-checkpointless-training/) | 2026-10-31 | KubernetesFamily |
| [AWS What's New, 2026-03-25](https://aws.amazon.com/about-aws/whats-new/2026/03/aws-batch-quota-management-preemption-sagemaker/) | 2026-10-31 | TrainingJobs |
| [AWS What's New, HyperPod automatic Slurm topology](https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-sagemaker-hyperpod-automatic-slurm-topology/) | 2026-10-31 | SlurmFamily |
| [AWS What's New, 2026-04-08](https://aws.amazon.com/about-aws/whats-new/2026/04/sagemaker-hyperpod-gang-scheduling/) | 2026-10-31 | KubernetesFamily |
| [AWS What's New, PCS supports P6e UltraServers](https://aws.amazon.com/about-aws/whats-new/2026/06/aws-parallel-computing-service/) | 2026-10-30 | SlurmFamily |
| [AWS What's New, custom AMIs for HyperPod Slurm clusters](https://aws.amazon.com/about-aws/whats-new/2026/07/hyperpod-custom-ami-slurm/) | 2026-10-31 | AwsOwnership, SlurmFamily |
| [NVIDIA blog, NCCL 2.4](https://developer.nvidia.com/blog/massively-scale-deep-learning-training-nccl-2-4/) | 2026-10-31 | Collectives |
| [aws-samples/awsome-distributed-training @ 3a1002576ccef26e66ba714303b10ccdaa645691: micro-benchmarks/nccl-tests/README.md](https://github.com/aws-samples/awsome-distributed-training/blob/3a1002576ccef26e66ba714303b10ccdaa645691/micro-benchmarks/nccl-tests/README.md) | 2026-10-30, 2026-10-31 | AwsHardware, BringUp, Collectives, SetMyRanks, Sources appendix, calculator presets |
| [aws-samples/awsome-distributed-training @ 3a1002576ccef26e66ba714303b10ccdaa645691: README.md](https://github.com/aws-samples/awsome-distributed-training/blob/3a1002576ccef26e66ba714303b10ccdaa645691/README.md) | 2026-10-31 | BringUp |
| [aws-samples/awsome-distributed-training @ 3a1002576ccef26e66ba714303b10ccdaa645691: validation/gpu-cluster-healthcheck/README.md](https://github.com/aws-samples/awsome-distributed-training/blob/3a1002576ccef26e66ba714303b10ccdaa645691/validation/gpu-cluster-healthcheck/README.md) | 2026-10-31 | BringUp |
| [facebookresearch/metaseq @ f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7: projects/OPT/chronicles/27_percent_update.md](https://github.com/facebookresearch/metaseq/blob/f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7/projects/OPT/chronicles/27_percent_update.md) | 2026-10-30, 2026-10-31 | BringUp, Checkpointing, FailureRates, Storage |
| [facebookresearch/metaseq @ f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7: projects/OPT/chronicles/56_percent_update.md](https://github.com/facebookresearch/metaseq/blob/f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7/projects/OPT/chronicles/56_percent_update.md) | 2026-10-31 | WhatToMeasure |
| [facebookresearch/metaseq @ f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7: projects/OPT/chronicles/final_update.md](https://github.com/facebookresearch/metaseq/blob/f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7/projects/OPT/chronicles/final_update.md) | 2026-10-31 | FailureRates, Sources appendix |
| [Amazon Science, Gemini authors' post](https://www.amazon.science/blog/more-efficient-recovery-from-failures-during-large-ml-model-training) | 2026-10-31 | Checkpointing, Sources appendix |

## Tier 3: papers (venue or preprint shown) and third-party technical analysis

46 sources.

| Source | Venue | Accessed | Cited in |
| --- | --- | --- | --- |
| [Training Deep Nets with Sublinear Memory Cost, Section 5.4](https://arxiv.org/abs/1604.06174v2) | preprint | 2026-10-31 | MemoryBudget, Sources appendix |
| [Mixed Precision Training, Section 6](https://arxiv.org/abs/1710.03740v3) | ICLR 2018 | 2026-10-31 | Precision, Sources appendix, TrainingStep |
| [Adafactor, Abstract](https://arxiv.org/abs/1804.04235v1) | preprint | 2026-10-30, 2026-10-31 | MemoryBudget, calculator presets |
| [GPipe, Section 2.3](https://arxiv.org/abs/1811.06965v5) | preprint | 2026-10-31 | PipelineParallel, Sources appendix |
| [An Empirical Model of Large-Batch Training, Section 2.4](https://arxiv.org/abs/1812.06162v1) | preprint | 2026-10-30 | DataParallel, Sources appendix |
| [A Study of BFLOAT16 for Deep Learning Training, Section 3](https://arxiv.org/abs/1905.12322v3) | preprint | 2026-10-31 | Precision, TrainingStep |
| [Megatron-LM, Section 3](https://arxiv.org/abs/1909.08053v4) | preprint | 2026-10-31 | Sources appendix, TensorParallel |
| [ZeRO, Section 5](https://arxiv.org/abs/1910.02054v3) | preprint | 2026-10-30, 2026-10-31 | AwsHardware, Checkpointing, Collectives, DataParallel, FineTuning, GettingStarted, MemoryBudget, Precision, SetMyRanks, Sources appendix, ThreeBudgets, TrainingStep, calculator presets |
| [Scaling Laws, Section 2.1](https://arxiv.org/abs/2001.08361v1) | preprint | 2026-10-30, 2026-10-31 | Arithmetic, DataParallel, Sources appendix, ThreeBudgets, TrainingStep |
| [PyTorch Distributed, Section 2.2](https://arxiv.org/abs/2006.15704v1) | VLDB 2020 | 2026-10-30 | DataParallel, Sources appendix |
| [GShard, Section 3.3.2](https://arxiv.org/abs/2006.16668v1) | preprint | 2026-10-30 | ExpertParallel, Sources appendix |
| [Switch Transformers, Section 2.2](https://arxiv.org/abs/2101.03961v3) | JMLR 23 (2022) | 2026-10-30 | ExpertParallel, Sources appendix |
| [PTD-P paper, Section 2.2.2](https://arxiv.org/abs/2104.04473v5) | SC 2021 | 2026-10-30, 2026-10-31 | Arithmetic, Collectives, ComposingLayouts, MemoryBudget, PipelineParallel, SetMyRanks, Sources appendix, TensorParallel, ThreeBudgets, TrainingStep |
| [LoRA, Section 4.2](https://arxiv.org/abs/2106.09685v2) | preprint | 2026-10-31 | FineTuning, Sources appendix |
| [8-bit Optimizers via Block-wise Quantization, Section 1.1](https://arxiv.org/abs/2110.02861v2) | ICLR 2022 | 2026-10-30, 2026-10-31 | MemoryBudget, Sources appendix, calculator presets |
| [Alpa](https://arxiv.org/abs/2201.12023v3) | OSDI 2022 | 2026-10-31 | SetMyRanks |
| [Training Compute-Optimal Large Language Models, Table 3](https://arxiv.org/abs/2203.15556v1) | preprint | 2026-10-31 | Arithmetic, Sources appendix |
| [PaLM, Appendix B](https://arxiv.org/abs/2204.02311v5) | preprint | 2026-10-30, 2026-10-31 | Arithmetic, GettingStarted, Sources appendix, Storage, ThreeBudgets, TrainingStep, WhatToMeasure |
| [OPT, Section 2.5](https://arxiv.org/abs/2205.01068v4) | preprint | 2026-10-31 | Sources appendix, WhatToMeasure |
| [Reducing Activation Recomputation, Table 2](https://arxiv.org/abs/2205.05198v1) | preprint | 2026-10-30, 2026-10-31 | Arithmetic, Collectives, MemoryBudget, PipelineParallel, SetMyRanks, Sources appendix, TensorParallel, ThreeBudgets, TrainingStep |
| [FlashAttention, Section 3.1](https://arxiv.org/abs/2205.14135v2) | preprint | 2026-10-31 | MemoryBudget, Sources appendix, TrainingStep |
| [FP8 Formats for Deep Learning, Table 1](https://arxiv.org/abs/2209.05433v2) | preprint | 2026-10-31 | Precision, Sources appendix |
| [Galvatron](https://arxiv.org/abs/2211.13878v1) | VLDB 2023 | 2026-10-31 | SetMyRanks |
| [PyTorch FSDP, Section 3.2](https://arxiv.org/abs/2304.11277v2) | PVLDB 16(12) | 2026-10-30, 2026-10-31 | Collectives, DataParallel, Sources appendix |
| [QLoRA, abstract](https://arxiv.org/abs/2305.14314v1) | preprint | 2026-10-31 | FineTuning, Sources appendix |
| [ZeRO++, Section 1 and abstract](https://arxiv.org/abs/2306.10209v1) | preprint | 2026-10-30 | DataParallel, Sources appendix |
| [DeepSpeed Ulysses, Section 1](https://arxiv.org/abs/2309.14509v2) | preprint | 2026-10-31 | ContextParallel, Sources appendix |
| [Ring Attention, Section 3](https://arxiv.org/abs/2310.01889v4) | preprint | 2026-10-31 | ContextParallel, Sources appendix |
| [Microscaling Data Formats for Deep Learning, Section 4.1](https://arxiv.org/abs/2310.10537v3) | preprint | 2026-10-31 | Precision, Sources appendix |
| [Zero Bubble Pipeline Parallelism, abstract](https://arxiv.org/abs/2401.10241v1) | preprint | 2026-10-31 | PipelineParallel, Sources appendix |
| [MegaScale, Section 6.1](https://arxiv.org/abs/2402.15627v1) | NSDI 2024, preprint | 2026-10-30, 2026-10-31 | Arithmetic, Checkpointing, FailureRates, Resuming, Sources appendix, Storage, Telemetry, WhatToMeasure |
| [ByteCheckpoint, Section 2.1](https://arxiv.org/abs/2407.20143v4) | NSDI 2025 | 2026-10-30 | Checkpointing, Sources appendix |
| [Llama 3 Herd of Models v1, Table 5](https://arxiv.org/abs/2407.21783v1) | preprint | 2026-10-31 | FailureRates |
| [v2, Table 5](https://arxiv.org/abs/2407.21783v2) | preprint | 2026-10-31 | FailureRates |
| [Table 3](https://arxiv.org/abs/2407.21783v3) | preprint | 2026-10-30, 2026-10-31 | Arithmetic, BringUp, CapacityCost, Checkpointing, Collectives, ComposingLayouts, ContextParallel, DataParallel, FailureRates, GettingStarted, MemoryBudget, PipelineParallel, Precision, Resuming, SetMyRanks, Sources appendix, Storage, Telemetry, TensorParallel, ThreeBudgets, TrainingStep, WhatToMeasure, calculator presets |
| [TorchTitan, Tables 3 and 4](https://arxiv.org/abs/2410.06511v3) | preprint | 2026-10-30, 2026-10-31 | ComposingLayouts, SetMyRanks, Sources appendix |
| [FALCON, Abstract](https://arxiv.org/abs/2410.12588v1) | preprint | 2026-10-31 | Resuming |
| [Revisiting Reliability, Section III](https://arxiv.org/abs/2410.21680v2) | preprint | 2026-10-30, 2026-10-31 | BringUp, Checkpointing, FailureRates, Sources appendix, ThreeBudgets, calculator presets |
| [Section 3.2](https://arxiv.org/abs/2412.19437v2) | preprint | 2026-10-30, 2026-10-31 | Arithmetic, Collectives, ComposingLayouts, ExpertParallel, MemoryBudget, PipelineParallel, Precision, SetMyRanks, Sources appendix, WhatToMeasure, calculator presets |
| [OLMo 2, Section 3](https://arxiv.org/abs/2501.00656v3) | preprint; shorter version at COLM 2025 | 2026-10-31 | Sources appendix, WhatToMeasure |
| [Muon is Scalable for LLM Training: one momentum buffer](https://arxiv.org/abs/2502.16982v1) | preprint | 2026-10-30, 2026-10-31 | MemoryBudget, Sources appendix, calculator presets |
| [MoE Parallel Folding, Section 3.2](https://arxiv.org/abs/2504.14960v3) | preprint | 2026-10-30 | ExpertParallel, SetMyRanks, Sources appendix |
| [Understanding Stragglers, Section 5.1](https://arxiv.org/abs/2505.05713v2) | OSDI 2025 | 2026-10-30, 2026-10-31 | BringUp, Resuming, Sources appendix |
| [Pretraining LLMs with NVFP4, Section 2](https://arxiv.org/abs/2509.25149v2) | preprint | 2026-10-31 | Precision, Sources appendix |
| [Ultra-Scale Playbook](https://huggingface.co/spaces/nanotron/ultrascale-playbook/tree/c93890dd4b22356ee18ed9b863e6f2d0909729bc) | not stated | 2026-10-30, 2026-10-31 | BringUp, FrameworkMap, SetMyRanks, Sources appendix |
| [Calculon, SC23 technical paper](https://web.archive.org/web/2024/https://sc23.supercomputing.org/proceedings/tech_paper/tech_paper_pages/pap552.html) | SC 2023 | 2026-10-31 | SetMyRanks |
