# Claims: section 28, Amazon EKS

claim | register ID

A pod asks for a GPU with the extended resource nvidia.com/gpu; a device plugin DaemonSet must run on the node or Karpenter does not see it as initialized | F10-410
Karpenter's AWS provider is read at v1.15.3 | F10-400
A NodePool sets what may be launched (requirements, taints, limits, weight, disruption); Karpenter does nothing until one exists | F10-401
Capacity types are spot, on-demand and reserved (capacity reservations); one NodePool tries reserved, then spot, then on-demand; a no-capacity answer is cached 3 minutes and fallback is "generally within milliseconds" | F10-402
spec.limits caps a NodePool (for example in GPUs); with none only EC2 quotas bound it; the check is eventually consistent | F10-407
An EC2NodeClass holds image, role, subnets, security groups and disks | F10-422
instanceStorePolicy RAID0 joins local NVMe into one scratch volume | F10-424
capacityReservationSelectorTerms selects ODCRs and Capacity Blocks; used only when selected and the NodePool allows reserved | F10-425
placementGroupSelector and efa-only interfaces serve multi-node training | F10-426
Batch window: 1 second idle, 10 seconds at most | F10-404
Karpenter bin-packs onto the smallest fitting type, adds 59 larger, passes 60 options to EC2 Fleet with price-capacity-optimized | F10-403
More allowed types give EC2 more room; with too few, pods stay Pending until Spot capacity returns | F10-405
A NodeClaim maps to one instance: Launched, Registered, Initialized; deleted after 15 minutes without registration | F10-411
Weighted NodePools: higher weight first, order not guaranteed | F10-408
No percentage field for a Spot share; the documented label-spread method is called "crude" | F10-409
consolidationPolicy values and default; consolidateAfter timer, default 0s, Never | F10-412
Empty nodes are deleted in parallel once consolidateAfter has passed (scale to zero) | F10-413
Spot-to-Spot consolidation is off by default | F10-414
Disruption budgets: 10% default, "0" blocks voluntary disruption, do not stop expiry, Spot interruption or repair | F10-415
expireAfter default 720h (30 days), forceful; terminationGracePeriod bounds a drain | F10-416
Interruption handling needs --interruption-queue (SQS fed by EventBridge) | F10-417
On a Spot warning Karpenter starts a replacement at once and drains in parallel; no startup number given; a pod grace period over two minutes is cut | F10-418
Karpenter only records the rebalance recommendation as an event; EKS guide advises against Node Termination Handler beside it | F10-419
The rebalance recommendation signals elevated risk and can arrive earlier | F10-523
karpenter.sh/do-not-disrupt blocks voluntary disruption, not expiry, interruption, repair or manual deletion | F10-420
Kueue objects: ResourceFlavor, ClusterQueue (nominalQuota), LocalQueue, Workload; Kueue v0.20.7 | F10-450
A Job joins with the queue-name label; on admission Kueue writes the flavor's node labels and tolerations into the pod template | F10-451
Cohorts share unused quota within borrowingLimit and lendingLimit | F09-55
Preemption: three fields per ClusterQueue, each Never by default | F10-452
With Karpenter, Kueue admits on quota alone; ProvisioningRequest is written for cluster-autoscaler; Karpenter support not stated on pages read | F10-453
KAI Scheduler v0.19.0: hierarchical queues, gang scheduling | F10-454
KAI fractional pods are invisible to the autoscaler unless node-scale-adjuster is on | F10-455
JobSet v0.13.1 recreates all child Jobs on a failure | F10-456
Kubeflow Trainer v2.4.0: TrainJob over a ClusterTrainingRuntime, built on JobSet | F10-457
Accelerated images carry the driver; AL2023 leaves the device plugin to the user, Bottlerocket NVIDIA ships it | F10-440
GPU Operator v26.7.3 installs driver, toolkit, plugin, labelling, monitoring; driver and toolkit installs disabled on EKS images | F10-441
Time-slicing: no isolation, not for training, Karpenter counts whole GPUs, not in Auto Mode | F10-443
MIG: hardware isolation; on g7 and g7e, not g5, g6, g6e; no scale from zero with Karpenter; not in Auto Mode | F10-444
MPS: "better isolation than time-slicing"; exclusive with time-slicing on one GPU; DRA sharing modes are alpha | F10-445
DRA: recommended for new deployments on Kubernetes 1.34 and later; Karpenter from v1.15, Auto Mode from Kubernetes 1.36; never beside a device plugin for the same device | F10-442
Auto Mode manages compute autoscaling, networking, load balancing, DNS, block storage, GPU support; AWS chooses the image; no SSH or SSM | F10-430
Auto Mode built-in NodePools are On-Demand C, M, R only | F10-431
Auto Mode node lifetime: default 336 hours (14 days), ceiling 21 days | F10-432
Auto Mode GPU families; G7 and P6e UltraServers not listed | F10-433
Auto Mode: no image choice, no device plugin configuration (no time-slicing, no MIG) | F10-434
Auto Mode handles Spot interruptions with no queue; Spot needs a custom NodePool; no GPU Spot NodePool printed | F10-435
"AWS suggests running either EKS Auto Mode or self-managed Karpenter"; nodeClassRef and label prefix differ | F10-439
Node monitoring agent sets AcceleratedHardwareReady; acts on double bit, NVLink and critical XID errors; thermal and power only reported | F10-460
Auto repair acts after 10 minutes on the GPU condition; always on and not configurable in Auto Mode | F10-461
Repair is forceful; Karpenter v1.15.0 and later adds a 5 or 10 minute grace period; do-not-disrupt does not exclude repair; AWS says to checkpoint and resume | F10-462
Mountpoint for S3 CSI driver v2.9.2 (static provisioning, partial POSIX, named for checkpoints); FSx for Lustre CSI driver v1.12.0 | F10-463
Instance store data is lost when the instance is stopped or terminated | F10-525
The Spot interruption warning comes two minutes ahead as an EventBridge event | F10-520
The warning is best effort and can be missing | F10-522
Pod terminationGracePeriodSeconds defaults to 30 seconds; handle SIGTERM; checkpoint tiers of 5-30 minutes and hourly | F10-535
Auto Mode tutorial sample output: g6e.2xlarge On-Demand node Ready at 76s | F10-438
AWS discourages failing over to On-Demand to handle interruptions | F10-530
AWS recommends price-capacity-optimized | F10-528
Be flexible across at least 10 instance types and all Availability Zones | F10-529
G instances: diversify across types, sizes and zones; Spot not recommended for production-scale training | F10-534
The EKS guide's GPU Spot NodePool is written for inference (5m consolidation); for jobs WhenEmpty with 60m | F10-428
The Karpenter repository has no GPU NodePool example | F10-427
G Spot quota is counted in vCPUs with a printed default of 0 | F10-533
Spot placement score: 1 to 10 per Region or zone | F10-532
A maximum Spot price makes interruptions more frequent | F10-526
OSMO: workflow orchestrator for physical AI across training, simulation and edge | F09-62
OSMO's deploy script installs KAI Scheduler and the GPU Operator | F09-65
OSMO on AWS: EKS backend with PostgreSQL, Redis and S3 | F09-66
OSMO newest release 6.3.1 | F10-458
Hybrid Nodes: on-premises or edge machines as nodes; pages read say nothing about GPUs; Mountpoint CSI driver not supported there | F10-466
Hybrid Nodes need a reliable connection to AWS | F09-119
