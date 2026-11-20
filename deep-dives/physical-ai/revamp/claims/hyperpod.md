# Claims: section 27, Amazon SageMaker HyperPod

claim | register ID

HyperPod is a persistent cluster of SageMaker-managed instances in instance groups, scheduled by Slurm or by Amazon EKS, chosen at creation | F10-300
With EKS the HyperPod cluster is the worker nodes only, mapped 1-to-1 to one EKS cluster (the control plane) | F10-300
With Slurm the controller, optional login node and compute nodes are instance groups inside the cluster; exactly one controller group; a compute group maps to one partition | F10-300, F10-302
One 20,000-step GR00T N1.7 post-training run took 3.4 hours on one ml.g7e.2xlarge, measured as a SageMaker training job (author reported) | F09-82
AWS names when HyperPod pays: "many concurrent jobs, continuous synthetic generation, reserved capacity, and the tens-of-nodes tail where failures are statistically frequent" | F09-112
HyperPod "bills for every running node whether or not a job is using it" | F09-81
Spot, autoscaling and per-team quotas are documented for EKS orchestration; no Slurm-orchestration page read on 2026-11-20 documents Spot or autoscaling | F10-309, F10-313 (U10-8)
One CreateCluster request holds instance groups, Orchestrator, NodeRecovery, NodeProvisioningMode, AutoScaling and the network | F10-301
The HyperPod Helm chart installs the health monitoring agent, Kubeflow Training Operator, Kubeflow MPI operator and the NVIDIA, Neuron and EFA device plug-ins; Kubernetes 1.30 to 1.35 supported | F10-329
An instance group holds one InstanceType or a flexible list of up to 20 types in priority order | F10-308
A group is On-Demand or Spot for life: CapacityRequirements cannot be changed after creation | F10-309
A training plan attaches per instance group through TrainingPlanArn | F10-325
Instance type names carry the ml. prefix, in Kubernetes scheduling constraints too | F10-304
Continuous provisioning is the default on the EKS path; for Slurm the pages disagree (the Slurm page calls it both optional and the default, the API Reference says the mode is for EKS-orchestrated clusters only), so set NodeProvisioningMode explicitly: target count recorded, failed launches retried, jobs start on arrived capacity; billing starts when the lifecycle script begins | F10-306
MinInstanceCount is a start-up gate; not reached within 3 hours means rollback | F10-307
Deep health checks: InstanceStress (DCGM level 4, about 45 to 90 minutes, the figure printed for Slurm clusters; the EKS pages give "around 60-90 minutes" for a whole check, F10-312), InstanceConnectivity, and on EKS MultiNodeTrainingValidation; AWS plans "about a couple of hours" per new instance | F10-318
NodeRecovery is Automatic (default, recommended: reboot or replace) or None (label only) | F10-314
EKS job auto-resume: two annotations, restartPolicy OnFailure, node selector on the Schedulable health label; Kubeflow Training Operator 1.7.0, 1.8.0 or 1.8.1 | F10-316
Slurm auto-resume: srun --auto-resume=1; node always replaced, never rebooted; a job without the flag exits; environment set-up belongs in the one srun script | F10-315
Managed Karpenter: HyperPod runs the controller, scale to zero with no node kept for it, groups pre-created at InstanceCount 0, requires continuous provisioning and automatic node recovery | F10-312
A HyperpodNodeClass lists at most 10 instance groups; Karpenter prefers Spot groups, falls back to On-Demand, ordered by Spot placement score per Availability Zone | F10-311
Training-plan groups and deep-health-checked groups cannot be in a NodeClass; a deep health check takes around 60-90 minutes while pods wait | F10-312
Task governance is an EKS add-on that installs Kueue; add-on v1.6.1-eksbuild.1 installs Kueue v0.19.2 | F10-320
Cluster policy: up to 10 priority classes, weight 0 to 100; fair share | F10-320
A job with no priority class is low priority; a class missing from the policy fails the submission | F10-321
Compute allocation per team: up to 15 resources, Strategy Lend, DontLend or LendAndBorrow, BorrowLimit default 50 (0 to 10000), PreemptTeamTasks default LowerPriority | F10-320
Creating an allocation for team X creates namespace hyperpod-ns-X and LocalQueue hyperpod-ns-X-localqueue; jobs join with two labels | F10-321
A borrowed task "may be preempted by another task of higher priority"; by default the lending team preempts borrowers; unallocated capacity can be borrowed since 16 March 2026 | F10-322
HyperPodPyTorchJob runPolicy carries a retry count and log rules for hung jobs (for example 300 seconds without a batch line); operator supports Kubernetes 1.28 to 1.33 | F10-317
Shared storage: FSx for Lustre per instance group under Slurm, Kubernetes storage under EKS | F10-326
Checkpointless training: AWS reports over 80% less downtime, internal studies on 16 to over 2,000 GPUs, recipes verified on ml.p5 (vendor claim); incompatible with tiered checkpointing and elastic training; elastic training does not support Spot | F10-319
Spot interruption handling in five steps: detect, taint, evict within terminationGracePeriodSeconds, provision replacement (same group, or Karpenter fallback), Kubernetes reschedules | F10-310
The two-minute Spot notice is best effort; without it the node is replaced with no graceful eviction | F10-310
The animated sequence (apply, admit, scale from zero, run, Spot notice, fallback, resume, node fault, replacement, scale down) is our assembly of documented steps | F10-333
No AWS figure for pending pod to Running node was found on the pages read on 2026-11-20 | F10-312 (U10-14)
The NodeClass page says "Only on-demand capacity is supported at this time"; the Spot page documents Spot groups in a HyperpodNodeClass with Karpenter prioritising them; the section follows the Spot page | F10-312, F10-311 (U10-9)
An AWS example for a larger VLA (pi0) mounts FSx for Lustre at /fsx | F09-83
Slurm capacity changes only through UpdateCluster or BatchDeleteClusterNodes | F10-313
AWS on the API-driven Slurm topology: "This is the recommended approach for new clusters." | F10-302
AWS: "We recommend setting the Automatic option." | F10-314
AWS, small cluster with no spare nodes: "Recommendation: disable the deep health check config throughout the cluster life cycle." | F10-318
AWS: "Set it to non zero upto 2 min to allow graceful pod eviction for any checkpointing needs." | F10-311
Grace period below 120 seconds because the notice is at most two minutes and best effort (our reading) | F10-310
AWS: "we do not recommend using a training plan for the primary instance group of a cluster"; a plan group cannot be scaled by Karpenter | F10-325
A cluster deploys in a single Availability Zone by default; each P5 instance can take 81 IP addresses under EKS | F10-327
FSx is optional for creation and recommended for production | F10-326
HyperPod's distinguishing features target P-class nodes; for G-family fleets it is a managed node pool with Karpenter (our reading) | F10-334
No G-family type is on the training plan list | F09-35
HyperPod bills per provisioned instance; scale to zero only for Karpenter-scaled groups on EKS | F09-33, F10-312
After a Spot eviction Kubernetes reschedules the pod on the replacement node (restartPolicy OnFailure recreates it); the auto-resume annotations are documented for node faults, and no page read says whether a Spot eviction counts against their retry count | F10-310 F10-316
The create-cluster snippet passes ClusterRole (the role HyperPod assumes for autoscaling, required when autoscaling is enabled); ExecutionRole, LifeCycleConfig and VpcConfig are left out for length | F10-301
