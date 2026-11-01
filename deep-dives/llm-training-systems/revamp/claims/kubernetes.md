# Claims: section 25, The Kubernetes Family

File: `src/sections/KubernetesFamily.tsx`. Re-opened on 2026-10-31 (default accessed date): the EKS User Guide pages ml-compute-management, ml-node-groups, ml-validate-gpu-node-repair, ml-workload-topology, device-management-neuron, ml-eks-optimized-ami and kubernetes-versions; the EKS Best Practices Guide AI/ML compute page; the AWS Batch pages eks, eks-ce-shared-responsibility, mnp-eks-jobs, mnp-eks-running-mnp-jobs and efa; the EC2 Capacity Blocks page; the SageMaker pages for HyperPod EKS, its health monitoring agent, deep health checks, node recovery, task governance, training operator and its usage, elastic training, checkpointless training, its in-process recovery and release notes, and the HyperPod EKS AMI release notes; the Kueue, Kubeflow Trainer and JobSet READMEs at their pinned refs; the HyperPod recipe `checkpointless_llama3_70b_pretrain.yaml` at 2.0.11; Megatron Core `distributed_data_parallel_config.py` at core_v0.20.0; and the What's New posts listed below. Register rows cited without re-opening carry `accessed="2026-10-30"` (AWS Batch pricing, the HyperPod Slurm deep health check page, the Llama 3.1 70B model metadata, the NVIDIA H100 page). Fees and rates come from `src/lib/presets.ts` (`EKS_FEES`, `PRICES`, `INSTANCES`), and the checkpointless memory figures come from `memoryBudget` in `src/lib/memory.ts`. They are read at render time, so the page and the calculators share one value.

Format: claim | source URL | register, wave 2 row or experiment

## Introduction and the stack

- The default Kubernetes scheduler places pods one at a time | https://docs.aws.amazon.com/eks/latest/userguide/ml-workload-topology.html | T06-44; W5-41
- Three AWS paths: self-managed EKS, AWS Batch on EKS (schedules from outside onto nodes it creates), HyperPod EKS (your control plane, HyperPod worker nodes) | https://docs.aws.amazon.com/batch/latest/userguide/eks.html and https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks.html | T06-49; T06-2 (matches section 20)
- EKS accelerated AMIs carry the NVIDIA driver, the EFA kernel module and rdma-core; the CUDA runtime and libraries come from the application container | https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html | T06-45; W5-40; fetched 2026-10-31
- The training container stays yours on all three paths | (our reading of the AMI pages and the checkpointless release notes) | our reading
- The checkpointless training container pins NCCL 2.27.5 and aws-ofi-nccl 1.16.0 | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless-release-notes.html | W5-49; fetched 2026-10-31
- Diagram "Five layers under a Kubernetes training job": every chip restates a claim cited in this file; colours follow section 20 | (schematic) | section 20 matrix cells

## Layers 1 and 2: nodes, capacity and devices

- Auto Mode: AWS-managed compute, built-in Karpenter, Bottlerocket images with NVIDIA drivers and device plugins; Karpenter self-managed; node groups are Auto Scaling groups sized in a launch template, named for a known, static training footprint | https://docs.aws.amazon.com/eks/latest/userguide/ml-compute-management.html | T06-42; fetched 2026-10-31
- Auto Mode and Karpenter provision reserved capacity (ODCRs and Capacity Blocks) first, then Spot or On-Demand | https://docs.aws.amazon.com/eks/latest/userguide/ml-compute-management.html | T06-42; fetched 2026-10-31
- Auto Mode fee $2.64192 per p5.48xlarge-hour; cluster $0.10 per hour; extended support $0.50 more | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEKS/20261027191639/us-east-1/index.json | T06-40; T06-41; W5-4 (EKS_FEES)
- Auto Mode on 32 p5.48xlarge (256 H100) for 30 days is $60,870; the cluster fee $72 a month; 4.8% on top of $55.04 On-Demand | EKS price list above and https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv | derived (our arithmetic: 2.64192 x 32 x 720; 0.10 x 720; 2.64192 / 55.04)
- The offer lists no fee for node groups or self-managed Karpenter beyond the cluster-hour | EKS price list above | our reading
- A Capacity Block reaches a node group through a custom launch template targeting the reservation, in a subnet of the block's Availability Zone | https://docs.aws.amazon.com/eks/latest/userguide/ml-node-groups.html | T06-42; fetched 2026-10-31
- EC2 begins shutting instances down 30 minutes before the reservation ends | https://docs.aws.amazon.com/eks/latest/userguide/ml-node-groups.html | T06-42
- NEW: a managed node group on a Capacity Block creates a scheduled scaling policy that drains it 40 minutes before the reservation ends | https://docs.aws.amazon.com/eks/latest/userguide/ml-node-groups.html | fetched 2026-10-31 (not in the registers; affects section 22's end-of-block edges)
- Karpenter may consolidate a fully used GPU node onto a cheaper instance type; recommended consolidationPolicy WhenEmpty with consolidateAfter such as 60m | https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html | G6; U06-9
- Amazon Linux NVIDIA AMIs omit the NVIDIA device plugin; Bottlerocket NVIDIA AMIs include it; with EFA the EFA device plugin is installed separately | https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html | T06-45; W5-40
- Neuron DRA driver recommended on Kubernetes 1.34 and later; publishes topology and EFA locality; allocates connected groups of 1, 4, 8 or 16 devices; DRA not supported on Auto Mode, where the device plugin's integer counts remain | https://docs.aws.amazon.com/eks/latest/userguide/device-management-neuron.html | T06-45; W5-40

## Layer 3: gang admission

- The guide says to add a batch scheduler or queueing system with all-or-nothing admission | https://docs.aws.amazon.com/eks/latest/userguide/ml-workload-topology.html | T06-44; W5-41
- Kueue: no pods start until quota for all, by default; topology-aware placement; fair sharing with borrowing and optional preemption | https://github.com/kubernetes-sigs/kueue/blob/14b792888dcb30cf055bf2618b6260a4989cf85f/README.md#L19-L26 | T06-47; W5-41
- Kueue core APIs v1beta2; used in production | https://github.com/kubernetes-sigs/kueue/blob/14b792888dcb30cf055bf2618b6260a4989cf85f/README.md#L108-L117 | T06-47; fetched 2026-10-31
- Volcano v1.16.0 is integrated by Kubeflow Trainer for topology-aware scheduling (named with its tag only) | https://github.com/kubeflow/trainer/blob/658725bdae5c7e3a0854d93ac6ff492e109a22ab/README.md#L21-L24 | U06-6 (cut at Gate 1: tag only)
- Topology labels network-node-layer-1 to -4 for a gang scheduler's placement domain; the bottom layer (3 or 4) is tightest with the smallest pool; layer 2 widens it; best effort, guarantee via Capacity Block or cluster placement group | https://docs.aws.amazon.com/eks/latest/userguide/ml-workload-topology.html | T06-44; fetched 2026-10-31

## Layer 4: job API

- PyTorchJob deprecated in Kueue; migrate to TrainJob or JobSet | https://github.com/kubernetes-sigs/kueue/blob/14b792888dcb30cf055bf2618b6260a4989cf85f/README.md#L40 | T06-46; C06-7; W5-42
- Training Operator v1 maintained on the release-1.9 branch | https://github.com/kubeflow/trainer/blob/658725bdae5c7e3a0854d93ac6ff492e109a22ab/README.md#L102-L108 | W5-42; fetched 2026-10-31
- Kubeflow Trainer "currently in alpha status, and APIs may change" | https://github.com/kubeflow/trainer/blob/658725bdae5c7e3a0854d93ac6ff492e109a22ab/README.md#L104 | C06-7; W5-42
- TrainJob and Runtimes through the Kubeflow Python SDK | https://github.com/kubeflow/trainer/blob/658725bdae5c7e3a0854d93ac6ff492e109a22ab/README.md#L61-L63 | fetched 2026-10-31
- JobSet v0.13.0 API version v1alpha2 under the Kubernetes deprecation policy | https://github.com/kubernetes-sigs/jobset/blob/v0.13.0/README.md#L33-L35 | fetched 2026-10-31 (new)
- JobSet is a built-in Kueue integration and migration target | https://github.com/kubernetes-sigs/kueue/blob/14b792888dcb30cf055bf2618b6260a4989cf85f/README.md#L34-L40 | T06-47; W5-42
- HyperPodPyTorchJob is the training operator's resource | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator-usage.html | T06-9; W5-47
- HyperPod EKS auto-resumes PyTorchJob | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks.html | T06-2
- JobSet failure policy: max restarts; a failed job recreates the whole JobSet to resume from the last checkpoint; with no policy the JobSet fails | https://github.com/kubernetes-sigs/jobset/blob/v0.13.0/README.md#L19 | fetched 2026-10-31 (new)
- Start a new self-managed cluster on JobSet; TrainJob for its runtimes; PyTorchJob only where it runs | (from the four status lines above) | our reading

## Layer 5 on self-managed EKS

- Node monitoring agent reads Xid from DCGM, sets AcceleratedHardwareReady False; repair replaces or reboots; default on Auto Mode; add-on plus NodeRepair gate on Karpenter | https://docs.aws.amazon.com/eks/latest/userguide/ml-validate-gpu-node-repair.html | T06-43; W5-43
- Node-level condition; wait 10 min on Auto Mode, 30 min on Karpenter v1.15.0 and later (worked example); no drain first on Auto Mode and Karpenter before v1.15.0; stops when too many NodePool nodes are unhealthy | https://docs.aws.amazon.com/eks/latest/userguide/ml-validate-gpu-node-repair.html | T06-43; W5-43; fetched 2026-10-31
- Rescheduling pods and restarting jobs rely on standard Kubernetes mechanisms and the job's restart policy | https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html | G6; U06-9; W5-61

## AWS Batch on EKS

- Orchestration external to the cluster, no operators or custom resources; own tainted nodes; scales to zero by default | https://docs.aws.amazon.com/batch/latest/userguide/eks.html | T06-49; W5-44
- Multi-node parallel jobs are gang scheduling, commonly used for large, tightly coupled work including LLM training | https://docs.aws.amazon.com/batch/latest/userguide/mnp-eks-jobs.html | T06-50; W5-44
- Up to 1,000 instances, one instance type, one pod per node | https://docs.aws.amazon.com/batch/latest/userguide/mnp-eks-running-mnp-jobs.html | W5-44
- No Batch charge | https://aws.amazon.com/batch/pricing/ | T06-49 (accessed 2026-10-30)
- The customer updates the AMI and Kubernetes version | https://docs.aws.amazon.com/batch/latest/userguide/eks-ce-shared-responsibility.html | T06-49
- No Batch page read describes GPU node health handling for EKS compute environments | https://docs.aws.amazon.com/batch/latest/userguide/mnp-eks-running-mnp-jobs.html | U06-7 (accept-as-hedge); G3
- Batch EFA page (no mention of EKS) requires one cluster placement group | https://docs.aws.amazon.com/batch/latest/userguide/efa.html | G3; U06-7
- Capacity Blocks do not support placement groups; whether Batch on EKS relaxes the rule was not located | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | G3
- Batch on EKS fits many independent jobs better than one long pre-training run | (overlay model above) | our reading

## HyperPod EKS

- One EKS cluster maps to one HyperPod cluster of worker nodes | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks.html | T06-2
- Agent checks DCGM policy violations, nvidia-smi errors, EC2 platform logs and GPU count; Neuron monitor and device count; a fault becomes a health label, NoSchedule taint and node condition | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-health-monitoring-agent.html | T06-8; W5-45
- Deep health checks at creation, update or on demand via StartClusterHealthCheck: DCGM level 4, EFA, NCCL on GPU; Neuron hardware check running a training workload and collective tests within and across Trainium nodes | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-deep-health-checks.html | U06-11; W5-45
- DCGM level 4 about 45 to 90 minutes | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html | T06-5; W5-36 (accessed 2026-10-30)
- Automatic node recovery (recommended) reboots or replaces | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-node-recovery.html | T06-6; W5-45
- Task governance: allocations, priorities, lending of idle compute, preemption | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance.html | W5-46
- Task governance GA 2024-12-04 | https://aws.amazon.com/about-aws/whats-new/2024/12/task-governance-amazon-sagemaker-hyperpod/ (Tier 2) | G5; U06-12
- AWS recommends installing Kueue via task governance | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-elastic-training.html | W5-46; fetched 2026-10-31
- Gang scheduling since 2026-04-08: pods not all ready within a set time are pulled back and requeued | https://aws.amazon.com/about-aws/whats-new/2026/04/sagemaker-hyperpod-gang-scheduling/ (Tier 2) | G5; post body read 2026-10-31
- Training operator GA 2025-06-30 | https://aws.amazon.com/about-aws/whats-new/2025/06/amazon-sagemaker-hyperpod-training-operator/ (Tier 2) | G5; U06-12
- The operator restarts failed processes in place before restarting the job | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator.html | T06-9; T06-13; W5-47
- Sample restart policy: numRestartBeforeFullJobRestart 3, evalPeriodSeconds 21600, maxFullJobRestarts 1 | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator-usage.html | T06-12; W5-47; fetched 2026-10-31
- Hang rules: regex with time to first match, maximum gap, or metric threshold; sample's 300 s; logs to sys.stdout | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator-usage.html | T06-12; W5-47
- Elastic training grows and shrinks the number of data-parallel replicas, operator v1.2 or later | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-elastic-training.html | T06-15; W5-48
- Operator lists Kubernetes 1.28 to 1.33, Kueue v0.12.2 or v0.12.3 suggested, PyTorch 2.4.0 to 2.7.1 | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-operator.html | C06-2; W5-50
- HyperPod EKS AMI of 2026-10-16 for Kubernetes 1.31 to 1.36 | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-ami-eks.html | G1; W5-50
- EKS: 1.34 to 1.37 standard, 1.31 to 1.33 extended support | https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html | T06-40
- Treat the operator's table as behind the platform | (the three version claims above) | our reading; C06-2
- A4 protocol: one HyperPod EKS cluster, one ml.p5.48xlarge, deep checks, operator, Llama 3.1 8B fine-tuning recipe at 2.0.11, killed process, stalled log, managed tiered checkpointing example; teardown order | https://github.com/cmanaha/tech-deep-dives/blob/b0194661bd4b1be854e3cbeaa0b53fa2dd7058b3/deep-dives/llm-training-systems/RESEARCH-GUIDE.md (section 5) | A4 (not yet run, on hold); C04-3
- A4 cost: 5 h x $66.048 = $330 plus EKS and EBS | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonSageMaker/20261029165009/us-east-1/index.csv | derived from T05-23; W5-1 (PRICES)

## Checkpointless training

- Needs training operator v1.2.0 or later; built on NVIDIA NeMo | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless.html | T06-14; W5-49
- v1.0.0 on 2025-12-03, v1.0.1 on 2026-04-10 | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless-release-notes.html | W5-49; G5; fetched 2026-10-31
- States replicated across node groups; healthy replicas finish the optimizer step and send states to recovering replicas; in-process, then process-level, then job-level restart with the node replaced, for a permanent node or GPU failure (the page's failure table) or a catastrophic one such as several nodes at once (the page's prose); falls back to storage | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless-in-process-recovery.html | G4; fetched 2026-10-31
- Diagram "How far back a fault sends the job": rung triggers follow the failure-type table; operator path starts at rung 2; JobSet path at rung 3 | same page plus the operator and JobSet rows above | G4; our reading (operator without checkpointless loads its checkpoint)
- num_distributed_optimizer_instances of at least 2 | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless-in-process-recovery.html | G4
- NEW: one redundant replica adds roughly one DCP checkpoint's worth of device memory | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless-in-process-recovery.html | fetched 2026-10-31 (not in G4)
- Megatron: num_distributed_optimizer_instances is the factor by which the DP domain is sharded for the distributed optimizer, default 1 | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/distributed/distributed_data_parallel_config.py#L38-L41 | G4; fetched 2026-10-31
- Recipe: Llama 3 70B, 16 nodes x 8 devices, TP 8, PP 4, SP, async save, two optimizer instances, FP32 grad reduce, bf16-mixed | https://github.com/aws/sagemaker-hyperpod-recipes/blob/2.0.11/hyperpod_recipes/recipes_src/training/llama/checkpointless_llama3_70b_pretrain.yaml#L15-L55 | W5-57; T06-19 to T06-21; fetched 2026-10-31
- Recipe vocabulary 128,256 | same file #L95-L98 | fetched 2026-10-31
- Megatron distributed optimizer: 6 + 12/d bytes per parameter for BF16 params with FP32 grads | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/dist_optimizer.md#L14-L20 | wave2-step-maths W1-50 (Calculator B row adamMixed, gradientDtype fp32)
- 70,553,706,496 parameters | https://huggingface.co/api/models/meta-llama/Llama-3.1-70B/revision/349b2ddb53ce8f2849a6c168a81980ab25258dac | DENSE_MODELS preset (accessed 2026-10-30); same 70B shape as the recipe's Llama 3 70B is our reading
- Model state 19.8 GB per GPU at d = 4, 26.5 GB at d = 2; 6.6 GB extra per 80 GB H100, about 847 GB across 128 GPUs | Calculator B (`memoryBudget`, ZeRO stage 1, TP 8 with SP, PP 4) | derived (our arithmetic); estimate; confirm with a measured step
- H100 80 GB | https://www.nvidia.com/en-us/data-center/h100/ | INSTANCES preset (vendor claim, accessed 2026-10-30)
- Documented recipes NeMo-based on p5.48xlarge | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless.html | W5-49
- Container pins PyTorch 2.6.0 | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless-release-notes.html | fetched 2026-10-31
- Custom PyTorch models integrate with minimal modifications (vendor claim) | https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-sagemaker-hyperpod-checkpointless-training (Tier 2) | G5
- Elastic training does not currently support checkpointless training | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-elastic-training.html | W5-48; fetched 2026-10-31
- Recipe saves asynchronously (L42) every 20 steps (L112) | recipe file #L42 and #L112 | fetched 2026-10-31
- "upwards of 95% training goodput on cluster sizes with thousands of AI accelerators", with no job size, failure rate or baseline (vendor claim) | https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-sagemaker-hyperpod-checkpointless-training (Tier 2) | G5; links section 17

## Ending

- Self-managed recipe (node groups or Karpenter WhenEmpty, plugins, Kueue, JobSet with policy, node repair, last save before the 40 or 30 minute edge) | restates claims above | our reading
- HyperPod EKS recipe (recovery on, deep checks, Kueue via task governance, HyperPodPyTorchJob with log rule, operator version check, checkpointless for NeMo at 6.6 GB per H100) | restates claims above | our reading
- Xid 79 injection through DCGM in AWS's validation procedure | https://docs.aws.amazon.com/eks/latest/userguide/ml-validate-gpu-node-repair.html | T06-43; fetched 2026-10-31
