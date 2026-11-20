# 10c Amazon EKS and EC2 Spot for GPU fleets: research register

## 1. Header

- **Research date:** 2026-11-20. Every URL in this file was accessed 2026-11-20.
- **Area:** round 2 of the "Physical AI" dive, stream 10c. Topic A: Amazon EKS as the place a robot arm's GPU and CPU batch workloads run, with Karpenter or EKS Auto Mode adding and removing nodes and a batch scheduler (Kueue, KAI Scheduler, JobSet, Kubeflow Trainer) ordering the jobs. Topic B: EC2 Spot itself, the signals it sends and the configuration AWS recommends, which sections 25 to 28 all rely on.
- **Sections fed:** 28 "Amazon EKS" (main), 24 (the overview and the Spot explanation), and the hand-offs to 25 (AWS Batch), 26 (AWS Parallel Computing Service) and 27 (Amazon SageMaker HyperPod).
- **ID range:** F10-400 to F10-466 for EKS (67 numbers, 61 used) and F10-520 to F10-540 for EC2 Spot (21 used). Entries of register 09 are cited as F09-n and are not repeated unless today's page goes deeper or differs (section 10).
- **Quote policy:** quotes are verbatim from the page as fetched today, with house normalisation: curly quotes become straight quotes, typographic dashes become " - " or a hyphen. Where a quote starts with "+ " or "* " it is a list item in the page's markdown form. Configuration blocks are quoted joined on one line in the Evidence line and printed whole in section 5.
- **How pages were fetched:** AWS documentation pages in their markdown form (page address plus `.md`) with `curl` and a generic client name. Karpenter, Kueue, KAI Scheduler, JobSet and Kubeflow Trainer documentation and examples as raw files from GitHub at the release tags pinned in section 3. Release dates from the GitHub API release lists. What's New posts from the AWS What's New feed and the post pages. The Spot Instance Advisor data file with `curl`, parsed locally. Nothing was taken from a search-engine summary or from memory.
- **Labels:** `[vendor claim]` for savings or performance figures printed by AWS or a project; `[derived]` for arithmetic, inputs shown; `[our reading]` for synthesis and every recommendation.
- **No prices:** where a page prints a price the entry says so and does not copy it.
- **Tiers:** Tier 1 = AWS docs, first-party data files, project docs and examples at a pinned tag, release lists; Tier 2 = What's New posts and AWS blogs.

## 2. Currency table

Newest first-party version or announcement found on 2026-11-20 for every item this register names.

| Item | Newest found | Date | Source |
|---|---|---|---|
| Karpenter, AWS provider | v1.15.3 (bug-fix release) | 2026-11-20 | https://github.com/aws/karpenter-provider-aws/releases/tag/v1.15.3 (F10-400) |
| EKS Auto Mode release notes | Newest heading: DRA for NVIDIA GPUs and EFA, Nitro Sandboxes | November 9, 2026 | https://docs.aws.amazon.com/eks/latest/userguide/auto-change.html (F10-437) |
| DRA on EKS Auto Mode and Karpenter | What's New post | Nov 9, 2026 | https://aws.amazon.com/about-aws/whats-new/2026/11/amazon-eks-auto-mode-karpenter-dra/ |
| EFA and placement groups on Auto Mode and Karpenter | What's New post | Jul 22, 2026 | https://aws.amazon.com/about-aws/whats-new/2026/07/amazon-eks-efa-placement-groups/ (F10-540) |
| EKS-optimised images (amazon-eks-ami) | v20261119 | 2026-11-19 | GitHub API release list for awslabs/amazon-eks-ami (F10-440) |
| EKS node monitoring agent | v1.7.7 | 2026-11-07 | GitHub API release list for aws/eks-node-monitoring-agent (F10-460) |
| NVIDIA GPU Operator | v26.7.3 | 2026-11-17 | GitHub API release list for NVIDIA/gpu-operator (F10-441) |
| NVIDIA device plugin for Kubernetes | v0.20.2 | 2026-11-17 | GitHub API release list for NVIDIA/k8s-device-plugin (F10-441) |
| NVIDIA DRA driver | v0.5.1 | 2026-10-12 | GitHub API release list for kubernetes-sigs/dra-driver-nvidia-gpu (F10-442) |
| DRANET (the DRA network driver used for EFA) | v1.5.0 | 2026-10-03 | GitHub API release list for kubernetes-sigs/dranet (F10-464) |
| Kueue | v0.20.7 | 2026-11-19 | GitHub API release list for kubernetes-sigs/kueue (F10-450) |
| KAI Scheduler | v0.19.0 | 2026-11-11 | GitHub API release list for kai-scheduler/KAI-Scheduler (F10-454) |
| JobSet | v0.13.1 | 2026-11-18 | GitHub API release list for kubernetes-sigs/jobset (F10-456) |
| Kubeflow Trainer | v2.4.0 | 2026-11-06 | GitHub API release list for kubeflow/trainer (F10-457) |
| NVIDIA OSMO | 6.3.1 (unchanged since register 09) | 2026-06-22 | https://github.com/NVIDIA/OSMO/releases/tag/6.3.1 (F10-458) |
| Mountpoint for Amazon S3 CSI driver | v2.9.2 | 2026-10-30 | GitHub API release list for awslabs/mountpoint-s3-csi-driver (F10-463) |
| FSx for Lustre CSI driver | v1.12.0 | 2026-11-12 | GitHub API release list for kubernetes-sigs/aws-fsx-csi-driver (F10-463) |
| EBS CSI driver | v1.68.1 | 2026-11-18 | GitHub API release list for kubernetes-sigs/aws-ebs-csi-driver (F10-463) |
| AWS Node Termination Handler | v1.25.6 | 2026-04-02 | GitHub API release list for aws/aws-node-termination-handler (F10-419) |
| Spot placement score, Local Zones | What's New post | Aug 13, 2026 | https://aws.amazon.com/about-aws/whats-new/2026/08/spot-placement-score-local-zones/ (F10-532) |
| SageMaker HyperPod Spot Instances | What's New post | Nov 24, 2025 | https://aws.amazon.com/about-aws/whats-new/2025/11/amazon-sagemaker-hyperpod-spot-instances (F10-540) |
| Spot Instance Advisor data file | `Last-Modified` header | Fri, 20 Mar 2026 | https://spot-bid-advisor.s3.amazonaws.com/spot-advisor-data.json (F10-538) |
| EC2 Spot interruption notice and rebalance recommendation pages | No date on the pages; content as fetched | 2026-11-20 | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html (F10-520) |

## 3. Pinned sources

### Code and release-pinned documentation

| Repository | Tag | 40-character SHA | Used for |
|---|---|---|---|
| aws/karpenter-provider-aws | v1.15.3 (published 2026-11-20) | 8c91894e993eda682f0785091b79a93da68f9830 | `website/content/en/docs/` concepts (nodepools, nodeclasses, nodeclaims, scheduling, disruption), reference/settings, tasks/odcrs, faq; `examples/v1/` (F10-400 to F10-427) |
| kubernetes-sigs/kueue | v0.20.7 (2026-11-19) | e854ec82e404436b261c81f0341ac9de8508f97c | `site/content/en/docs/concepts/` and `site/static/examples/` (F10-450 to F10-453) |
| kai-scheduler/KAI-Scheduler | v0.19.0 (2026-11-11) | 2305acfc348c9bd9cd1ab813d3feb8dfc4ab9d11 | `docs/queues`, `docs/batch`, `docs/gpu-sharing`, `docs/quickstart` (F10-454, F10-455) |
| kubernetes-sigs/jobset | v0.13.1 (2026-11-18) | 6266f0267a5d1a013ae552ecb209214eab5c55c8 | README and `site/static/examples/failure-policy/` (F10-456) |
| kubeflow/trainer | v2.4.0 (2026-11-06) | a7b05c24ff0f145368529b5d180c223baf965ef5 | README, `docs/operator-guides/runtime.md`, `docs/user-guides/trainjob-lifecycle.md` (F10-457) |
| NVIDIA/OSMO | 6.3.1 (2026-06-22) | ed59b69715e4ee6fff70bcd9d715106358a7205f | Release list only (F10-458) |

### Docs pages read (all accessed 2026-11-20, markdown form)

Amazon EKS User Guide (https://docs.aws.amazon.com/eks/latest/userguide/ plus the page name): automode, auto-change, auto-accelerated, auto-cost-control, auto-controls, auto-migrate-karpenter, auto-networking, auto-odcr, auto-reference, auto-static-capacity, automode-learn-instances, create-node-class, create-node-pool, set-builtin-node-pools, device-management, device-management-nvidia, device-management-nvidia-dra-device-plugin, device-management-nvidia-time-slicing, device-management-nvidia-mig, device-management-efa, ml-eks-optimized-ami, node-health, node-health-nma, node-repair, s3-csi, fsx-csi, ebs-csi, eks-provisioned-control-plane, service-quotas, hybrid-nodes-overview, hybrid-nodes-add-ons, ml-compute-management, managed-node-groups, kubernetes-versions, doc-history.

EKS Best Practices Guide (https://docs.aws.amazon.com/eks/latest/best-practices/ plus the page name): aiml-compute, aiml-storage, aiml-networking, aiml-observability, aiml-performance, karpenter, cas, scalability, scale-control-plane, kubernetes_upstream_slos.

Amazon EC2 User Guide (https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ plus the page name): using-spot-instances, how-spot-instances-work, spot-best-practices, spot-interruptions, interruption-behavior, prepare-for-interruptions, spot-instance-termination-notices, rebalance-recommendations, ec2-fleet-capacity-rebalance, ec2-fleet-allocation-strategy, spot-fleet-allocation-strategy, ec2-fleet-attribute-based-instance-type-selection, spot-placement-score, work-with-spot-placement-score, using-spot-limits, placement-groups, efa-start.

Other AWS docs: AWS Batch User Guide (bestpractice5, bestpractice6); Amazon SageMaker AI Developer Guide (model-managed-spot-training, model-checkpoints, sagemaker-hyperpod-spot). NVIDIA: GPU Operator overview (https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/overview.html).

Data file: https://spot-bid-advisor.s3.amazonaws.com/spot-advisor-data.json (1,190,579 bytes, `Last-Modified` Fri, 20 Mar 2026 23:38:55 GMT).

## 4. Claim register

### A1. Karpenter: version, the NodePool and how it chooses capacity

Karpenter is the open-source node autoscaler that AWS builds for Kubernetes. It watches pods that the scheduler cannot place, launches EC2 instances that fit them, and removes instances that are no longer needed. The user writes two objects: a NodePool (which instances are allowed, how many, and how aggressively to remove them) and an EC2NodeClass (the AWS settings: machine image, subnets, disks). All quotes in A1 to A3 are from the documentation directory `website/content/en/docs` of `aws/karpenter-provider-aws` at tag v1.15.3, the newest tag today.

**F10-400. Karpenter's AWS provider is at v1.15.3, published 20 November 2026 (v1.15.2 on 12 November, v1.15.1 on 23 October). v1.15.3 is a bug-fix release with one action: Karpenter now ignores `EC2NodeClass` selector terms with an empty `tags` map, `name` or `ssmParameter`, and an `EC2NodeClass` whose terms are all empty becomes `NotReady`.**
- Location: GitHub release v1.15.3 of aws/karpenter-provider-aws
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/releases/tag/v1.15.3 | Tier 1, release at tag v1.15.3 (commit 8c91894e993eda682f0785091b79a93da68f9830) | launch announcement | "Karpenter now ignores `EC2NodeClass` selector terms with an empty `tags` map, `name`, or `ssmParameter`. Remove empty selector values before upgrading. An `EC2NodeClass` whose terms are all empty becomes `NotReady` until you fix them" ; release list from the GitHub API: "v1.15.3 2026-11-20T19:27:35Z", "v1.14.4 2026-11-20T00:44:43Z", "v1.9.4 2026-11-19T23:20:39Z", "v1.15.2 2026-11-12T19:03:04Z", "v1.15.1 2026-10-23T22:05:08Z" (accessed 2026-11-20)
- Use in dive: section 28 Amazon EKS, the version line. Sharpens F09-38 (which names v1.15.2).

**F10-401. A NodePool is the Karpenter object that sets the constraints on the nodes Karpenter may create and on the pods that may run on them. Its key fields: `spec.template.spec.requirements` (allowed instance categories, families, sizes, zones, architecture, capacity type), `taints` and `startupTaints`, `expireAfter` (default `720h`, 30 days), `terminationGracePeriod`, `spec.disruption` (`consolidationPolicy`, `consolidateAfter`, `budgets`), `spec.limits`, `spec.weight` and `spec.replicas`. Karpenter does nothing until at least one NodePool exists.**
- Location: Karpenter docs, concepts/nodepools.md, introduction and the annotated example
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/nodepools.md | Tier 1, project docs at tag v1.15.3 | definition | "The NodePool sets constraints on the nodes that can be created by Karpenter and the pods that can run on those nodes." and "Karpenter won't do anything if there is not at least one NodePool configured." and "It is recommended to create NodePools that are mutually exclusive. So no Pod should match multiple NodePools. If multiple NodePools are matched, Karpenter will use the NodePool with the highest [weight](#specweight)." and "expireAfter: 720h | Never" and "consolidationPolicy: WhenEmptyOrUnderutilized | Balanced | WhenEmpty" (accessed 2026-11-20)
- Use in dive: section 28, moving part "NodePool"; the box that node groups are drawn inside.

**F10-402. A NodePool names its purchase options with the label `karpenter.sh/capacity-type`, whose values are `spot`, `on-demand` and `reserved` (`reserved` means capacity reservations: ODCRs and Capacity Blocks, not Reserved Instances). When a NodePool allows several, Karpenter tries `reserved` first, then `spot`, then `on-demand`. When EC2 reports that an instance type has no capacity in a zone, Karpenter caches that answer for 3 minutes and falls back to the next capacity type "generally within milliseconds".**
- Location: Karpenter docs, concepts/nodepools.md, "Capacity Type"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/nodepools.md | Tier 1, project docs at tag v1.15.3 | definition | "If a NodePool is compatible with multiple capacity types, Karpenter will prioritize `reserved` capacity, followed by `spot`, then finally `on-demand`." and "If the provider API (e.g. EC2 Fleet's API) indicates capacity is unavailable, Karpenter caches that result across all attempts to provision EC2 capacity for that instance type and zone for the next 3 minutes." and "If there are no other possible offerings available for a higher priority capacity type, Karpenter will attempt to fallback to a lower priority capacity type, generally within milliseconds." and "Note that the `reserved` capacity type refers to [capacity reservations](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-reservation-overview.html) (on-demand capacity reservations and capacity blocks) not [reserved instances]" (accessed 2026-11-20)
- Use in dive: section 28, the Spot and On-Demand mix in one NodePool; animation step "no Spot capacity, fall back to On-Demand".

**F10-403. How Karpenter picks an instance. It batches pending pods, bin-packs them by CPU, memory and GPUs onto the smallest instance type that fits the batch, adds 59 larger instance types, and passes all 60 options to the EC2 Fleet API with the price-capacity-optimized allocation strategy. For Spot, Fleet picks the type with "both the lowest price combined with the lowest chance of being interrupted", which may not be the cheapest. For On-Demand the same strategy is "effectively equivalent to the `lowest-price` allocation strategy".**
- Location: Karpenter docs, faq.md, "How does Karpenter dynamically select instance types?"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/faq.md | Tier 1, project docs at tag v1.15.3 | definition | "Karpenter batches pending pods and then binpacks them based on CPU, memory, and GPUs required, taking into account node overhead, VPC CNI resources required, and daemonsets that will be packed when bringing up a new node." and "After the pods are binpacked on the most efficient instance type (i.e. the smallest instance type that can fit the pod batch), Karpenter takes 59 other instance types that are larger than the most efficient packing, and passes all 60 instance type options to an API called Amazon EC2 Fleet." and "The EC2 fleet API attempts to provision the instance type based on the [Price Capacity Optimized allocation strategy](https://aws.amazon.com/blogs/compute/introducing-price-capacity-optimized-allocation-strategy-for-ec2-spot-instances/). For the on-demand capacity type, this is effectively equivalent to the `lowest-price` allocation strategy. For the spot capacity type, Fleet will determine an instance type that has both the lowest price combined with the lowest chance of being interrupted. Note that this may not give you the instance type with the strictly lowest price for spot." (accessed 2026-11-20)
- Use in dive: section 28, the answer to "which allocation strategy does Karpenter use"; animation step "Karpenter sends up to 60 instance types to EC2 Fleet".

**F10-404. The pending-pod batch window has two settings on the Karpenter controller: `--batch-idle-duration` (default 1s: the window closes when no new pending pod has arrived for one second) and `--batch-max-duration` (default 10s: the longest a window may stay open). A longer window gives "fewer but larger nodes".**
- Location: Karpenter docs, reference/settings.md, the settings table and "Batching Parameters"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/reference/settings.md | Tier 1, project docs at tag v1.15.3 | definition | "| BATCH_IDLE_DURATION | \-\-batch-idle-duration | The maximum amount of time with no new pending pods that if exceeded ends the current batching window. If pods arrive faster than this time, the batching window will be extended up to the maxDuration. If they arrive slower, the pods will be batched separately. (default = 1s)|" and "| BATCH_MAX_DURATION | \-\-batch-max-duration | The maximum length of a batch window. The longer this is, the more pods we can consider for provisioning at one time which usually results in fewer but larger nodes. (default = 10s)|" (accessed 2026-11-20)
- Use in dive: section 28, the only documented timing in the provisioning sequence before the EC2 launch: 1 to 10 seconds of batching.

**F10-405. The EKS best-practices guide states the Spot mechanism in the same terms: with Spot, Karpenter uses the price-capacity-optimized allocation strategy, which provisions "from the deepest pools for the number of instances that you are launching and have the lowest risk of interruption", then requests from the lowest priced of those pools; "The more instance types you allow Karpenter to utilize, the better EC2 can optimize your spot instance's runtime." By default Karpenter uses every instance type EC2 offers in the cluster's Region and zones.**
- Location: EKS Best Practices Guide, Karpenter, "Avoid overly constraining the Instance Types that Karpenter can provision, especially when utilizing Spot"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/best-practices/karpenter.html | Tier 1, first-party docs | definition | "When using Spot, Karpenter uses the [Price Capacity Optimized](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-allocation-strategy.html) allocation strategy to provision EC2 instances. This strategy instructs EC2 to provision instances from the deepest pools for the number of instances that you are launching and have the lowest risk of interruption. EC2 Fleet then requests Spot instances from the lowest priced of these pools. The more instance types you allow Karpenter to utilize, the better EC2 can optimize your spot instance's runtime. By default, Karpenter will use all Instance Types EC2 offers in the region and availability zones your cluster is deployed in." and "Your pods will remain in a pending state until the spot capacity for the configured instance types is replenished." (accessed 2026-11-20)
- Use in dive: section 28, recommended configuration: do not pin one GPU instance type on Spot.

**F10-406. `minValues` on a requirement tells Karpenter the least flexibility it must keep when it schedules: the docs' Spot example asks for at least 2 instance categories, 5 instance families and 10 instance types. Under the `Strict` policy a NodePool that cannot meet the minimum is skipped; under `BestEffort` the minimum is relaxed. The NodePool comment marks `minValues` as ALPHA. A NodePool and its NodeClaim may carry at most 100 requirements and labels combined.**
- Location: Karpenter docs, concepts/nodepools.md, "Min Values"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/nodepools.md | Tier 1, project docs at tag v1.15.3 | definition | "at least 2 unique instance categories from [c,m,r], 5 unique instance families [eg: \"m5\",\"m5d\",\"r4\",\"c5\",\"c5d\",\"c4\" etc], and 10 unique instance types [eg: \"c5.2xlarge\",\"c4.xlarge\" etc] are required for scheduling the pods." and "# This field is ALPHA and can be dropped or replaced at any time" and "There is currently a limit of 100 on the total number of requirements on both the NodePool and the NodeClaim." (accessed 2026-11-20)
- Use in dive: section 28, a way to enforce Spot diversification in configuration; a limit.

**F10-407. `spec.limits` caps what a NodePool may launch, in CPU, memory, GPUs (`nvidia.com/gpu`) or node count. With no limits there is no cap other than the account's EC2 quotas. When a limit is exceeded Karpenter stops provisioning until nodes terminate. The check is eventually consistent, so a rapid scale-out can overrun it.**
- Location: Karpenter docs, concepts/nodepools.md, "spec.limits"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/nodepools.md | Tier 1, project docs at tag v1.15.3 | documentation of a limit | "If the `NodePool.spec.limits` section is unspecified, it means that there is no default limitation on resource allocation. In this case, the maximum resource consumption is governed by the quotas set by your cloud provider. If a limit has been exceeded, nodes provisioning is prevented until some nodes have been terminated." and "limits: cpu: 1000 memory: 1000Gi nvidia.com/gpu: 2" and "Karpenter provisioning is highly parallel. Because of this, limit checking is eventually consistent, which can result in overrun during rapid scale outs." (accessed 2026-11-20)
- Use in dive: section 28, the budget guard on a GPU NodePool (the equivalent of a Batch `maxvCpus`).

**F10-408. `spec.weight` orders NodePools: Karpenter tries the NodePool with the higher weight first, and no weight equals 0. The documented pattern for reserved or discounted capacity is a high-weight NodePool with a `limits` cap and a default NodePool behind it. The order is not guaranteed: because of pod batching and bin packing, a pod that cannot use the first NodePool forces a node from a lower one and other pods of the batch may land there.**
- Location: Karpenter docs, concepts/scheduling.md, "Weighted NodePools"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/scheduling.md | Tier 1, project docs at tag v1.15.3 | definition | "Karpenter allows you to order your NodePools using the `.spec.weight` field so that the Karpenter scheduler will attempt to schedule one NodePool before another." and "Combined with the `.spec.weight` value, we can tell Karpenter to pull from instance types in the reserved NodePool before defaulting to generic instance types." and "Based on the way that Karpenter performs pod batching and bin packing, it is not guaranteed that Karpenter will always choose the highest priority NodePool given specific requirements." (accessed 2026-11-20)
- Use in dive: section 28, weighted NodePools as the fallback chain (reserved, then Spot, then On-Demand).

**F10-409. Karpenter documents one way to hold a Spot to On-Demand ratio, which it calls "crude": two NodePools carry disjoint values of a made-up label (`capacity-spread`: four values on the Spot NodePool, one on the On-Demand NodePool) and the workload spreads evenly over that label with a topology spread constraint, which gives 4 Spot nodes to 1 On-Demand node.**
- Location: Karpenter docs, concepts/scheduling.md, "On-Demand/Spot Ratio Split"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/scheduling.md | Tier 1, project docs at tag v1.15.3 | definition | "Taking advantage of Karpenter's ability to assign labels to node and using a topology spread across those labels enables a crude method for splitting a workload across on-demand and spot instances in a desired ratio." and "When we spread across our new label evenly, we'll end up with a ratio of 4:1 spot to on-demand nodes." (accessed 2026-11-20)
- Use in dive: section 28, the Spot and On-Demand mix: Karpenter has no percentage field like an Auto Scaling group's base and percentage settings.

**F10-410. For GPUs, Karpenter reads the pod's extended resource request (`nvidia.com/gpu`, `amd.com/gpu`, `aws.amazon.com/neuron`, `aws.amazon.com/neuroncore`, `habana.ai/gaudi`). A device plugin DaemonSet must run on the new node: without it "Karpenter will not see those nodes as initialized". The docs' NodePool example for expensive hardware taints the nodes with `nvidia.com/gpu=true:NoSchedule` so that only pods that tolerate it land there.**
- Location: Karpenter docs, concepts/scheduling.md, "Accelerators/GPU Resources"; concepts/nodepools.md, "Isolating Expensive Hardware"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/scheduling.md | Tier 1, project docs at tag v1.15.3 | documentation of support | "If you are provisioning nodes that will utilize accelerators/GPUs, you need to deploy the appropriate device plugin daemonset. Without the respective device plugin daemonset, Karpenter will not see those nodes as initialized." ; https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/nodepools.md | Tier 1, project docs at tag v1.15.3 | definition | "taints: - key: nvidia.com/gpu value: \"true\" effect: NoSchedule" and "In order for a pod to run on a node defined in this NodePool, it must tolerate `nvidia.com/gpu` in its pod spec." (accessed 2026-11-20)
- Use in dive: section 28, animation step "node Ready, device plugin advertises `nvidia.com/gpu`, pod binds"; the taint in the recommended NodePool.

**F10-411. The provisioning sequence in Karpenter's words: for each batch it creates a NodeClaim (an immutable object that maps one-to-one to an EC2 instance and a node), asks EC2 to create the instance (launch), waits for the node to join and removes the `karpenter.sh/unregistered` taint (registration), then waits for the node and its resources to be ready (initialization). If registration does not succeed within 15 minutes, Karpenter deletes the NodeClaim and the instance and creates another if needed.**
- Location: Karpenter docs, concepts/nodeclaims.md
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/nodeclaims.md | Tier 1, project docs at tag v1.15.3 | definition | "Whenever Karpenter creates a NodeClaim, it asks the cloud provider to create the instance (launch), register and link the created node with the NodeClaim (registration), and wait for the node and its resources to be ready (initialization)." and "NodeClaims are immutable, cluster-scoped resources that map one-to-one with a cloud provider instance and a Kubernetes Node." and "Once this step is completed, Karpenter will remove the `karpenter.sh/unregistered` taint from the Node. If this fails to succeed within 15 minutes, Karpenter will remove the NodeClaim from the cluster and delete the underlying instance, creating another NodeClaim if necessary." (accessed 2026-11-20)
- Use in dive: section 28, the animation's scale-from-zero steps (pending pod, NodeClaim, launch, registration, initialization, pod bound). No first-party figure for the seconds from pending pod to ready GPU node was found (U10c-1).

### A2. Karpenter: disruption, Spot interruption and scale-down

**F10-412. `consolidationPolicy` has three values. `WhenEmpty`: only nodes with no workload pods. `Balanced`: nodes "where the cost savings outweigh the disruption to running pods". `WhenEmptyOrUnderutilized`: any node that can be removed or replaced to cut cost. If the fields are not set, Karpenter uses `consolidationPolicy: WhenEmptyOrUnderutilized` and `consolidateAfter: 0s`. `consolidateAfter` is a timer that restarts whenever a pod is added to or removed from the node; `Never` turns consolidation off for the NodePool.**
- Location: Karpenter docs, concepts/disruption.md, "Automated Graceful Methods" and "Consolidation"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/disruption.md | Tier 1, project docs at tag v1.15.3 | definition | "spec: disruption: consolidationPolicy: WhenEmptyOrUnderutilized consolidateAfter: 0s" and "| `Balanced` | Nodes where the cost savings outweigh the disruption to running pods |" and "Karpenter resets this timer whenever a pod is added to or removed from the node, so a node only becomes a consolidation candidate once it has been stable for the full `consolidateAfter` duration." and "setting it to `Never` disables consolidation for the NodePool entirely" (accessed 2026-11-20)
- Use in dive: section 28, moving part "disruption"; the scale-down step of the animation (the node empties, the `consolidateAfter` timer runs, the node is deleted). Sharpens F09-39 and F09-47: `Balanced` is in open-source Karpenter v1.15, not only in Auto Mode.

**F10-413. Consolidation acts in a fixed order: empty-node consolidation (delete all empty nodes in parallel), then multi-node consolidation (delete two or more nodes, possibly launching one cheaper replacement), then single-node consolidation. A node can be deleted when its pods fit on free capacity elsewhere, or replaced when they fit on free capacity plus one lower-priced node. Scale to zero is the first case: an empty node is deleted once `consolidateAfter` has passed.**
- Location: Karpenter docs, concepts/disruption.md, "Consolidation"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/disruption.md | Tier 1, project docs at tag v1.15.3 | definition | "1. **Empty Node Consolidation** - Delete any entirely empty nodes in parallel 2. **Multi Node Consolidation** - Try to delete two or more nodes in parallel, possibly launching a single replacement whose price is lower than that of all nodes being removed 3. **Single Node Consolidation** - Try to delete any single node, possibly launching a single replacement whose price is lower than that of the node being removed" and "1. **Deletion** - A node is eligible for deletion if all of its pods can run on free capacity of other nodes in the cluster. 2. **Replace** - A node can be replaced if all of its pods can run on a combination of free capacity of other nodes in the cluster and a single lower price replacement node." (accessed 2026-11-20)
- Use in dive: section 28, scale-down and scale to zero. `[our reading]` for the last sentence of the claim: Karpenter has no minimum node count on a dynamic NodePool, so a GPU NodePool with no pods holds no nodes.

**F10-414. Spot nodes are consolidated by deletion only, by default. Replacing a Spot node with a cheaper Spot node needs the `SpotToSpotConsolidation` feature gate (alpha since v0.34, default false). For a one-to-one Spot replacement Karpenter requires at least 15 instance types cheaper than the current one in the launch request, so that it does not walk the fleet down to the cheapest, most interrupted type.**
- Location: Karpenter docs, concepts/disruption.md, "Spot consolidation"; reference/settings.md, "Feature Gates"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/disruption.md | Tier 1, project docs at tag v1.15.3 | definition | "For spot nodes, Karpenter has deletion consolidation enabled by default. If you would like to enable replacement with spot consolidation, you need to enable the feature through the [`SpotToSpotConsolidation` feature flag]" and "Karpenter requires a minimum instance type flexibility of 15 instance types when performing single node spot-to-spot consolidations (1 node to 1 node)." and "We shouldn't continually consolidate down to the lowest priced spot instance which might have very high rates of interruption." ; https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/reference/settings.md | "| SpotToSpotConsolidation | false | Alpha | v0.34.x | |" (accessed 2026-11-20)
- Use in dive: section 28, recommended configuration: leave Spot-to-Spot off for training jobs, since each replacement is one more restart.

**F10-415. Disruption budgets rate-limit voluntary disruption. With none set, Karpenter applies one budget of `nodes: 10%`. A budget may name the reasons it covers (`Drifted`, `Underutilized`, `Empty`), a cron `schedule` (always UTC) and a `duration`; with several budgets the most restrictive wins. A budget of `nodes: "0"` blocks all voluntary disruption on the NodePool. Budgets do not stop expiration, Spot interruption or node repair.**
- Location: Karpenter docs, concepts/disruption.md, "NodePool Disruption Budgets"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/disruption.md | Tier 1, project docs at tag v1.15.3 | definition | "If undefined, Karpenter will default to one budget with `nodes: 10%`. Budgets will consider nodes that are actively being deleted for any reason, and will only block Karpenter from disrupting nodes voluntarily through drift, emptiness, and consolidation. Note that NodePool Disruption Budgets do not prevent Karpenter from terminating expired nodes." and "Karpenter allows specifying if a budget applies to any of `Drifted`, `Underutilized`, or `Empty`." and "Timezones are not currently supported. Schedules are always in UTC." and "allowed_disruptions = roundup(total * percentage) - total_deleting - total_notready" and the example "apiVersion: karpenter.sh/v1 kind: NodePool metadata: name: default spec: disruption: consolidationPolicy: WhenEmptyOrUnderutilized budgets: - nodes: \"20%\" reasons: - \"Empty\" - \"Drifted\" - nodes: \"5\" - nodes: \"0\" schedule: \"@daily\" duration: 10m reasons: - \"Underutilized\"" (accessed 2026-11-20)
- Use in dive: section 28, the budgets snippet (printed in full in section 5).

**F10-416. `expireAfter` is a forceful method: a node starts draining as soon as its age passes the value (default `720h`), and budgets cannot slow it. `terminationGracePeriod` bounds the drain: when it elapses, remaining pods are deleted and the instance is terminated, so the longest node lifetime is the sum of the two fields. The docs advise against `expireAfter` without `terminationGracePeriod` when pods carry the `karpenter.sh/do-not-disrupt` annotation, because a node can stay partly drained forever.**
- Location: Karpenter docs, concepts/disruption.md, "Expiration" and "TerminationGracePeriod"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/disruption.md | Tier 1, project docs at tag v1.15.3 | definition | "Expiration is a forceful disruption method that begins draining a node immediately once its lifetime exceeds the duration set on the owning NodeClaim's `spec.expireAfter` field." and "By default, `expireAfter` is set to `720h` (30 days)." and "The node will begin to drain once its `expireAfter` has elapsed, and it will be forcibly terminated once its `terminationGracePeriod` has elapsed, making the maximum node lifetime the sum of the two fields." and "it is not recommended to set `expireAfter` without also setting `terminationGracePeriod` **if** your cluster has pods with the `karpenter.sh/do-not-disrupt` annotation" (accessed 2026-11-20)
- Use in dive: section 28, a training job longer than the node lifetime is cut by expiration: set `expireAfter` above the longest job or to `Never` on the training NodePool `[our reading]`.

**F10-417. Karpenter's interruption handling is off until the controller is given `--interruption-queue`, the name of an SQS queue that EventBridge rules fill with EC2 events. With it on, Karpenter reacts to five kinds of event: Spot interruption warnings, scheduled change health events (maintenance), instance terminating events, instance stopping events and instance status check failures. On each it taints, drains and terminates the node ahead of the event.**
- Location: Karpenter docs, concepts/disruption.md, "Interruption"; reference/settings.md
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/disruption.md | Tier 1, project docs at tag v1.15.3 | definition | "These interruption events include: * Spot Interruption Warnings * Scheduled Change Health Events (Maintenance Events) * Instance Terminating Events * Instance Stopping Events * Instance Status Check Failures" and "When Karpenter detects one of these events will occur to your nodes, it automatically taints, drains, and terminates the node(s) ahead of the interruption event to give the maximum amount of time for workload cleanup prior to compute disruption." and "Karpenter requires that an SQS queue be provisioned and EventBridge rules and targets be added that forward interruption events from AWS services to the SQS queue." ; https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/reference/settings.md | "Interruption queue is the name of the SQS queue used for processing interruption events from EC2. Interruption handling is disabled if not specified." (accessed 2026-11-20)
- Use in dive: section 28, moving part "interruption queue"; the animation's Spot notice step.

**F10-418. What Karpenter does in the two minutes: on the Spot interruption warning it starts a replacement node at once and drains the interrupted node in parallel. The docs say Karpenter's average node startup time means that "generally" the new node is ready before EC2 reclaims the old one; no number is given. The EKS guide adds that a pod whose termination period is longer than two minutes is cut off before it is rescheduled.**
- Location: Karpenter docs, concepts/disruption.md, "Interruption"; EKS Best Practices Guide, AI/ML Compute, Spot considerations
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/disruption.md | Tier 1, project docs at tag v1.15.3 | definition | "For Spot interruptions, the NodePool will start a new node as soon as it sees the Spot interruption warning. Spot interruptions have a __2 minute notice__ before Amazon EC2 reclaims the instance. Once Karpenter has received this warning it will begin draining the node while in parallel provisioning a new node. Karpenter's average node startup time means that, generally, there is sufficient time for the new node to become ready before EC2 initiates termination for the spot instance." ; https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html | Tier 1, first-party docs | definition | "When Karpenter notices a Spot interruption event, it automatically cordons, taints, drains, and terminates the node(s) ahead of the interruption event to maximize the termination grace period of the pods. At the same time, Karpenter will immediately start a new node so it can be ready as soon as possible." and "For a pod with a termination period longer than two minutes, the old node will be interrupted prior to those pods being rescheduled, which could impact workload availability." (accessed 2026-11-20)
- Use in dive: section 28, the animation's Spot sequence: notice, taint, replacement NodeClaim created, pod gets SIGTERM, checkpoint, pod evicted, pod pending, pod bound on the new node.

**F10-419. Karpenter does not drain on an EC2 rebalance recommendation: it only publishes a Kubernetes event on the node. The docs say that the AWS Node Termination Handler can be run beside Karpenter for that case and warn that it cordons and drains on every recommendation, "potentially causing more node churn in the cluster than with interruptions alone". The EKS best-practices guide advises against running the two together.**
- Location: Karpenter docs, concepts/disruption.md, "Interruption", note; EKS Best Practices Guide, Karpenter, "Enable Interruption Handling when using Spot"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/disruption.md | Tier 1, project docs at tag v1.15.3 | documentation of a limit | "Karpenter publishes Kubernetes events to the node for all events listed above in addition to [__Spot Rebalance Recommendations__](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/rebalance-recommendations.html). Karpenter does not currently support taint, drain, and terminate logic for Spot Rebalance Recommendations." ; https://docs.aws.amazon.com/eks/latest/best-practices/karpenter.html | Tier 1, first-party docs | definition | "It is not advised to use Karpenter interruption handling alongside Node Termination Handler" and "Pods that require checkpointing or other forms of graceful draining, requiring the 2-mins before shutdown should enable Karpenter interruption handling in their clusters." (accessed 2026-11-20)
- Use in dive: section 28, what Karpenter does poorly: the early rebalance signal is not acted on, so a job has two minutes and no more.

**F10-420. The pod annotation `karpenter.sh/do-not-disrupt` blocks voluntary disruption of the pod's node. It takes `"true"` (permanent) or a Go duration such as `"30m"` (protection for that long after the pod starts running). The docs name the ML case: "a long batch job (such as you might have with machine learning) that would need to start over if it were interrupted". It does not protect against the forceful methods: expiration, interruption (Spot), node repair and manual deletion.**
- Location: Karpenter docs, concepts/disruption.md, "Pod-Level Controls"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/disruption.md | Tier 1, project docs at tag v1.15.3 | definition | "| **Duration (Go duration string)** | `karpenter.sh/do-not-disrupt: \"30m\"` | Provides time-based protection for the specified duration after the pod starts running |" and "Nodes with active `karpenter.sh/do-not-disrupt` pods will be excluded from [Consolidation]" and "The `karpenter.sh/do-not-disrupt` annotation does **not** exclude nodes from the forceful disruption methods: [Expiration]({{<ref \"#expiration\" >}}), [Interruption]({{<ref \"#interruption\" >}}), [Node Repair](<ref \"#node-repair\" >), and manual deletion (e.g. `kubectl delete node ...`)." (accessed 2026-11-20)
- Use in dive: section 28, the one-line protection for a training pod; the limit to print beside it (it does not stop a Spot reclaim).

**F10-421. Karpenter's own node auto repair is alpha (feature gate `NodeRepair`, default false, since v1.1). When on, it force-terminates a node whose condition stays unhealthy past a toleration time: `AcceleratedHardwareReady` False for 10 minutes; `StorageReady`, `NetworkingReady`, `KernelReady`, `ContainerRuntimeReady` False for 30 minutes; `Ready` False or Unknown for 30 minutes. It bypasses the drain, and stops repairing when more than 20% of a NodePool's nodes are unhealthy.**
- Location: Karpenter docs, concepts/disruption.md, "Node Auto Repair"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/disruption.md | Tier 1, project docs at tag v1.15.3 | definition | "| AcceleratedHardwareReady | False | 10 minutes |" and "| StorageReady | False | 30 minutes |" and "Once a node has been in an unhealthy state beyond its configured toleration duration, Karpenter will forcefully terminate the node and its corresponding NodeClaim, bypassing the standard drain and grace period procedures" and "it will not perform repairs if more than 20% of nodes in a NodePool are unhealthy" (accessed 2026-11-20)
- Use in dive: section 28, the GPU fault path with self-managed Karpenter; compare F10-462 (EKS node auto repair).

### A3. Karpenter: the EC2NodeClass

**F10-422. An EC2NodeClass holds the AWS settings a NodePool points at through `nodeClassRef`: the node IAM `role`, `subnetSelectorTerms`, `securityGroupSelectorTerms` and `amiSelectorTerms` (required). An `alias` term selects an EKS-optimised image as `family@version`, with families `al2`, `al2023`, `bottlerocket`, `windows2019`, `windows2022`, `windows2025`; the version is `latest` or a pinned release (`al2023@v20240703`, `bottlerocket@v1.20.4`). Only with an alias can Karpenter pick the accelerated (GPU) variant of the image by itself; with custom AMI terms a GPU image needs its own EC2NodeClass.**
- Location: Karpenter docs, concepts/nodeclasses.md, "spec.amiSelectorTerms"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/nodeclasses.md | Tier 1, project docs at tag v1.15.3 | definition | "AMI Selector Terms are __required__ and are used to configure AMIs for Karpenter to use." and "An `alias` term can be used to select EKS-optimized AMIs. An `alias` is formatted as `family@version`." and "Unless using an alias, Karpenter **cannot** detect requirements other than architecture. If you need to specify different AMIs for different kind of nodes (e.g. accelerated GPU AMIs), you should use a separate `EC2NodeClass`." (accessed 2026-11-20)
- Use in dive: section 28, moving part "EC2NodeClass". The EKS best-practices guide says to pin the version in production ("Lock down AMIs in production clusters").

**F10-423. Default disks per image family when `blockDeviceMappings` is not set: AL2023 gets one 20Gi gp3 encrypted volume at `/dev/xvda`; Bottlerocket gets a 4Gi root volume at `/dev/xvda` and a 20Gi data volume at `/dev/xvdb` for container images and logs. A GPU training image is usually larger than 20Gi, so the mapping is one of the fields to set `[our reading]`. The full field list in the docs' example: `volumeSize`, `volumeType`, `iops`, `encrypted`, `kmsKeyID`, `deleteOnTermination`, `throughput`, `snapshotID`, `volumeInitializationRate`.**
- Location: Karpenter docs, concepts/nodeclasses.md, "spec.blockDeviceMappings"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/nodeclasses.md | Tier 1, project docs at tag v1.15.3 | definition | "### AL2023 ```yaml spec: blockDeviceMappings: - deviceName: /dev/xvda ebs: volumeSize: 20Gi volumeType: gp3 encrypted: true ```" and "# Data device: Container resources such as images and logs - deviceName: /dev/xvdb ebs: volumeSize: 20Gi volumeType: gp3 encrypted: true" and "spec: blockDeviceMappings: - deviceName: /dev/xvda ebs: volumeSize: 100Gi volumeType: gp3 iops: 10000 encrypted: true kmsKeyID: \"1234abcd-12ab-34cd-56ef-1234567890ab\" deleteOnTermination: true throughput: 125 snapshotID: snap-0123456789 volumeInitializationRate: 100" (accessed 2026-11-20)
- Use in dive: section 28, the storage line of the recommended EC2NodeClass.

**F10-424. `instanceStorePolicy: RAID0` makes Karpenter stripe the instance's local NVMe disks into one array (`/dev/md/0`, mounted at `/mnt/k8s-disks/0`) and use it for the kubelet and containerd, so the node's ephemeral storage equals the size of the local disks. By default Karpenter and Kubernetes ignore instance-store volumes. On Bottlerocket the automatic setup needs v1.22.0 or later.**
- Location: Karpenter docs, concepts/nodeclasses.md, "spec.instanceStorePolicy"; examples/v1/instance-store-ephemeral-storage.yaml
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/nodeclasses.md | Tier 1, project docs at tag v1.15.3 | definition | "The `instanceStorePolicy` field controls how [instance-store](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html) volumes are handled. By default, Karpenter and Kubernetes will simply ignore them." and "This will set the allocatable ephemeral-storage of each node to the total size of the instance-store volume(s)." and "On AL2023, Karpenter automatically configures the disks via the generated `NodeConfig` object. Like AL2, the device name is `/dev/md/0` and its mount point is `/mnt/k8s-disks/0`." and "This automatic disk configuration is only available on Bottlerocket v1.22.0 and later." ; https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/examples/v1/instance-store-ephemeral-storage.yaml | Tier 1, repository example at tag v1.15.3 | definition | "apiVersion: karpenter.k8s.aws/v1 kind: EC2NodeClass metadata: name: instance-store-ephemeral-storage annotations: kubernetes.io/description: \"EC2NodeClass to provision nodes with instance-store ephemeral storage\" spec: instanceStorePolicy: \"RAID0\" role: \"KarpenterNodeRole-${CLUSTER_NAME}\" # replace with your cluster name subnetSelectorTerms: - tags: karpenter.sh/discovery: \"${CLUSTER_NAME}\" # replace with your cluster name securityGroupSelectorTerms: - tags: karpenter.sh/discovery: \"${CLUSTER_NAME}\" # replace with your cluster name amiSelectorTerms: - alias: al2023@latest # Amazon Linux 2023" (accessed 2026-11-20)
- Use in dive: section 28, the storage snippet: G and P instances with local NVMe get a fast scratch disk for image layers and dataset cache; it is lost with the instance (F10-530).

**F10-425. Reservations: `capacityReservationSelectorTerms` on the EC2NodeClass selects ODCRs by `id`, `tags`, `ownerID` or `instanceMatchCriteria`, and the NodePool must allow `karpenter.sh/capacity-type: reserved`. Support arrived for ODCRs in v1.3, for Capacity Blocks for ML in v1.6 and for interruptible Capacity Reservations in v1.10; the feature is Beta (gate `ReservedCapacity`, default true since v1.6). Karpenter does not match `open` ODCRs unless they are selected. Reserved nodes carry the labels `karpenter.k8s.aws/capacity-reservation-id`, `karpenter.k8s.aws/capacity-reservation-type` (`default` or `capacity-block`) and `karpenter.k8s.aws/capacity-reservation-interruptible`.**
- Location: Karpenter docs, tasks/odcrs.md; concepts/nodeclasses.md, "spec.capacityReservationSelectorTerms"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/tasks/odcrs.md | Tier 1, project docs at tag v1.15.3 | documentation of support | "Karpenter introduced native support for [EC2 On-Demand Capacity Reservations](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html) (ODCRs) in [v1.3](https://github.com/aws/karpenter-provider-aws/releases/tag/v1.3.0), enabling users to select upon and prioritize specific capacity reservations. In [v1.6](https://github.com/aws/karpenter-provider-aws/releases/tag/v1.6.0), this support was expanded to include [EC2 Capacity Blocks for ML]" and "Capacity blocks are modeled as on-demand capacity reservations in EC2. To select capacity blocks, specify them in your `capacityReservationSelectorTerms` in the same way you would for a default ODCR." and "Karpenter does **not** support open matching for ODCRs." and "requirements: - key: karpenter.sh/capacity-type operator: In values: ['reserved', 'on-demand']" and "| `karpenter.k8s.aws/capacity-reservation-type` | `default` or `capacity-block` | The type of capacity reservation |" (accessed 2026-11-20)
- Use in dive: section 28, the reserved rung of the capacity ladder; the P-family Capacity Block path on self-managed Karpenter. Goes deeper than F09-40.

**F10-426. Two EC2NodeClass fields serve multi-node training. `placementGroupSelector` (by `name` or `id`) puts every instance of that EC2NodeClass into one placement group; cluster, partition and spread strategies are supported, and cluster is the one for low-latency networking. `networkInterfaces` attaches extra interfaces by network card and device index, with `interfaceType` `interface` (standard ENA with an IP address) or `efa-only` (the EFA device for RDMA, which consumes no IP address).**
- Location: Karpenter docs, concepts/nodeclasses.md, "spec.placementGroupSelector" and "spec.networkInterfaces"
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/nodeclasses.md | Tier 1, project docs at tag v1.15.3 | documentation of support | "Each EC2NodeClass maps to exactly one placement group - all instances launched from that EC2NodeClass are placed into the resolved placement group." and "- **Cluster** - instances are placed in a single AZ on the same network segment for low-latency, high-throughput networking (e.g., EFA workloads)" and "spec: networkInterfaces: - networkCardIndex: 0 deviceIndex: 0 interfaceType: \"interface\" - networkCardIndex: 0 deviceIndex: 1 interfaceType: \"efa-only\"" and "- __efa-only__: EFA interface that provides only the EFA device for RDMA communication without consuming an IP address" (accessed 2026-11-20)
- Use in dive: section 28, the network line for workload 15 (multi-node pretraining) on self-managed Karpenter.

**F10-427. Verbatim from the repository's examples: a Spot NodePool (capacity type `spot`, `amd64`, `linux`, instance categories `c`, `m`, `r`, generation above 2) with its EC2NodeClass (`al2023@latest`, node role, subnets and security groups found by the `karpenter.sh/discovery` tag). It is a CPU example; the repository has no GPU NodePool example, only a GPU workload (`examples/workloads/gpu-nvidia.yaml`, a Deployment that requests `nvidia.com/gpu: "1"`).**
- Location: aws/karpenter-provider-aws, examples/v1/spot.yaml and examples/workloads/gpu-nvidia.yaml at tag v1.15.3
- Verdict: NEW
- Evidence: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/examples/v1/spot.yaml | Tier 1, repository example at tag v1.15.3 | definition | "--- apiVersion: karpenter.sh/v1 kind: NodePool metadata: name: spot annotations: kubernetes.io/description: \"NodePool for provisioning spot capacity\" spec: template: spec: requirements: - key: karpenter.sh/capacity-type operator: In values: [\"spot\"] - key: kubernetes.io/arch operator: In values: [\"amd64\"] - key: kubernetes.io/os operator: In values: [\"linux\"] - key: karpenter.k8s.aws/instance-category operator: In values: [\"c\", \"m\", \"r\"] - key: karpenter.k8s.aws/instance-generation operator: Gt values: [\"2\"] nodeClassRef: group: karpenter.k8s.aws kind: EC2NodeClass name: default --- apiVersion: karpenter.k8s.aws/v1 kind: EC2NodeClass metadata: name: default annotations: kubernetes.io/description: \"General purpose EC2NodeClass for running Amazon Linux 2 nodes\" spec: role: \"KarpenterNodeRole-${CLUSTER_NAME}\" # replace with your cluster name subnetSelectorTerms: - tags: karpenter.sh/discovery: \"${CLUSTER_NAME}\" # replace with your cluster name securityGroupSelectorTerms: - tags: karpenter.sh/discovery: \"${CLUSTER_NAME}\" # replace with your cluster name amiSelectorTerms: - alias: al2023@latest # Amazon Linux 2023" ; https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/examples/workloads/gpu-nvidia.yaml | "resources: limits: nvidia.com/gpu: \"1\"" ; repository tree at the tag: 22 files under examples/v1, none with "gpu" in the name (accessed 2026-11-20)
- Use in dive: section 28, the EC2NodeClass half of the recommended configuration (the GPU NodePool half is F10-428).

**F10-428. Verbatim from the EKS best-practices guide: a GPU Spot NodePool named `gpu-inference-spot`. Capacity type `spot`; instance categories `g` and `p`; generation greater than 3; `amd64`; more than 20480 MiB of GPU memory through `karpenter.k8s.aws/instance-gpu-memory`; taint `nvidia.com/gpu:NoSchedule`; `expireAfter: 720h`; limits of 100 CPUs and 100Gi of memory; `consolidationPolicy: WhenEmptyOrUnderutilized` with `consolidateAfter: 5m`. The guide writes it for real-time inference; for jobs the same guide says to use `WhenEmpty` with `consolidateAfter: 60m`.**
- Location: EKS Best Practices Guide, AI/ML Compute, "Consider using Amazon EC2 Spot Instances for GPUs with Karpenter" and "Disable Karpenter Consolidation for interruption sensitive Workloads"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html | Tier 1, first-party docs | definition | "apiVersion: karpenter.sh/v1 kind: NodePool metadata: name: gpu-inference-spot spec: template: metadata: labels: role: gpu-spot-worker spec: requirements: - key: karpenter.sh/capacity-type operator: In values: [\"spot\"] # Use Spot Instances - key: karpenter.k8s.aws/instance-category operator: In values: [\"g\", \"p\"] # Diversifies across G-series and P-series - key: karpenter.k8s.aws/instance-generation operator: Gt values: [\"3\"] # Selects instance generations greater than 3 - key: kubernetes.io/arch operator: In values: [\"amd64\"] # Specifies AMD64 architecture, compatible with NVIDIA GPUs - key: karpenter.k8s.aws/instance-gpu-memory operator: Gt values: [\"20480\"] # Ensures more than 20GB (20480 MiB) total GPU memory taints: - key: nvidia.com/gpu effect: NoSchedule nodeClassRef: name: gpu-inference-ec2 group: karpenter.k8s.aws kind: EC2NodeClass expireAfter: 720h limits: cpu: 100 memory: 100Gi disruption: consolidationPolicy: WhenEmptyOrUnderutilized consolidateAfter: 5m # Enables consolidation of underutilized nodes after 5 minutes" and "This example NodePool states, use g and p series instances greater than 3, which have more than 20GB GPU memory." and "disruption: consolidationPolicy: WhenEmpty consolidateAfter: 60m" (accessed 2026-11-20)
- Use in dive: section 28, the GPU Spot NodePool snippet (printed in full in section 5). Goes deeper than F09-39, which quotes two lines of it.

### A4. EKS Auto Mode

EKS Auto Mode is the option in which AWS runs the node layer of an EKS cluster: a managed Karpenter, the machine image, the GPU drivers and device plugins, pod networking, load balancers and block storage. The user still writes NodePools; the NodeClass is a smaller, AWS-defined object.

**F10-430. What Auto Mode manages, in the guide's list: "compute autoscaling, pod and service networking, application load balancing, cluster DNS, block storage, and GPU support", run as core components and not as add-ons. Its nodes are EC2 managed instances that run Bottlerocket variants; AWS chooses and patches the image ("Generally, EKS releases a new AMI each week"), and SSH and SSM access to nodes are disallowed.**
- Location: Amazon EKS User Guide, "Automate cluster infrastructure with EKS Auto Mode"; "Learn about Amazon EKS Auto Mode Managed instances"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/automode.html | Tier 1, first-party docs | definition | "Cluster infrastructure managed by AWS includes many Kubernetes capabilities as core components, as opposed to add-ons, such as compute autoscaling, pod and service networking, application load balancing, cluster DNS, block storage, and GPU support." and "Prevents direct access to the nodes by disallowing SSH or SSM access." and "The nodes use variants of [Bottlerocket](https://aws.amazon.com/bottlerocket) AMIs that are optimized to run containers." ; https://docs.aws.amazon.com/eks/latest/userguide/automode-learn-instances.html | Tier 1, first-party docs | definition | "With EKS Auto Mode, AWS determines the image (AMI) used for your compute nodes." and "Generally, EKS releases a new AMI each week containing CVE and security fixes." (accessed 2026-11-20)
- Use in dive: section 28, moving part "Auto Mode"; goes deeper than F09-48.

**F10-431. Auto Mode has two built-in NodePools, `system` (tainted `CriticalAddonsOnly`, `amd64` and `arm64`) and `general-purpose` (`amd64` only). Both use the `default` NodeClass, On-Demand capacity only, the C, M and R families, generation 5 or newer. They cannot be edited, only enabled or disabled. Neither launches a GPU instance or a Spot instance: a GPU or Spot fleet needs a custom NodePool.**
- Location: Amazon EKS User Guide, "Enable or Disable Built-in NodePools"; "Cost optimization in EKS Auto Mode"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/set-builtin-node-pools.html | Tier 1, first-party docs | definition | "EKS Auto Mode has two built-in NodePools." and "Both built-in NodePools: + Use the default EKS NodeClass + Use only on-demand EC2 capacity + Use the C, M, and R EC2 instance families + Require generation 5 or newer EC2 instances" ; https://docs.aws.amazon.com/eks/latest/userguide/auto-cost-control.html | Tier 1, first-party docs | documentation of a limit | "**Instance families restricted to C, M, and R** - No accelerated (P, G, Inf, Trn) or exotic instance types are permitted." and "**On-demand capacity only** - No Spot instances, which avoids interruption-driven churn but also means no Spot savings." and "The built-in node pools do not have resource `limits` configured." (accessed 2026-11-20)
- Use in dive: section 28, the cluster drawing for Auto Mode: two built-in pools plus the custom GPU pool.

**F10-432. Auto Mode's node defaults: it consolidates underutilized instances, terminates instances after 336 hours (14 days), applies one disruption budget of 10% of nodes, and replaces nodes on drift when a new Auto Mode AMI is released, "roughly once per week". The hard ceiling is a 21-day node lifetime, which can be reduced and not raised. A NodePool with no `terminationGracePeriod` gets 24 hours on its NodeClaims. On Kubernetes 1.37, new NodePools default to `consolidationPolicy: Balanced`.**
- Location: Amazon EKS User Guide, "Create a Node Pool for EKS Auto Mode", "Disruption" and "Termination Grace Period"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/create-node-pool.html | Tier 1, first-party docs | definition | "By default, EKS Auto Mode: + Consolidates underutilized instances. + Terminates instances after 336 hours. + Sets a single disruption budget of 10% of nodes. + Allows Nodes to be replaced due to drift when a new Auto Mode AMI is released, which occurs roughly once per week." and "When a `terminationGracePeriod` is not explicitly defined on an EKS Auto Mode NodePool, the system automatically applies a default 24-hour termination grace period to the associated NodeClaim." ; https://docs.aws.amazon.com/eks/latest/userguide/automode.html | "EKS Auto Mode enforces a 21-day maximum node lifetime to ensure up-to-date software and APIs." (accessed 2026-11-20)
- Use in dive: section 28, the limit that matters for long training: no Auto Mode node outlives 21 days, and the default is 14. Sharpens F09-48, which gives only the 21-day ceiling. `[derived]` 336 hours / 24 = 14 days.

**F10-433. Accelerated families Auto Mode can launch today: trn2, trn1, trn1n, p6-b200, p6-b300, p5, p5e, p5en, p4d, p4de, p3, p3dn, inf2, inf1, g7e, g6, gr6, g6e, g5, g5g, g4ad, g4dn. G7 and the P6e UltraServers are not in the list. Auto Mode also refuses instances with 1 CPU and the nano, micro and small sizes. p6-b200, p6-b300, p5e, p5en and trn2 were added on 10 April 2026.**
- Location: Amazon EKS User Guide, "Learn about Amazon EKS Auto Mode Managed instances", "EKS Auto Mode supported instance reference"; release notes
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/automode-learn-instances.html | Tier 1, first-party docs | documentation of support | "| Accelerated Computing (Trn/P/Inf/G) | trn2, trn1, trn1n, p6-b200, p6-b300, p5, p5e, p5en, p4d, p4de, p3, p3dn, inf2, inf1, g7e, g6, gr6, g6e, g5, g5g, g4ad, g4dn |" and "+ More than 1 CPU + Instance size is not nano, micro or small" ; https://docs.aws.amazon.com/eks/latest/userguide/auto-change.html | "## April 10, 2026 **New supported instance types**: p6-b200, p6-b300, p5e, p5en, trn2, hpc8a, x8aedz, x8i." (accessed 2026-11-20)
- Use in dive: section 28, the supported-family line. Agrees with F09-49 (G7 not supported) and adds the full list.

**F10-434. What a user cannot set in Auto Mode that self-managed Karpenter allows. The image: AWS determines it, and the NodeClass specification has no AMI selector and no user data field. Node access: no SSH, no SSM. The instance metadata service: IMDSv2 with a hop limit of 1, which "cannot be modified". The device plugin configuration: not exposed, so no time-slicing and no MIG. Windows nodes: Linux only. Node labels use the `eks.amazonaws.com/` prefix where Karpenter uses `karpenter.k8s.aws/`. AWS Fault Injection Service cannot send a Spot interruption to an Auto Mode node.**
- Location: Amazon EKS User Guide, "Learn about Amazon EKS Auto Mode Managed instances"; "Create a Node Pool for EKS Auto Mode"; "Use time-slicing with NVIDIA GPUs on Amazon EKS"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/automode-learn-instances.html | Tier 1, first-party docs | documentation of a limit | "| You determine the operating system and image (AMI). | AWS determines the operating system and image. |" and "+ EKS Auto Mode enforces IMDSv2 with a hop limit of 1 by default, adhering to AWS security best practices. + This default configuration cannot be modified in Auto Mode." and "+ Amazon EKS Auto Mode does not support the following AWS Fault Injection Service actions: + `ec2:RebootInstances` + `ec2:SendSpotInstanceInterruptions`" ; https://docs.aws.amazon.com/eks/latest/userguide/create-node-pool.html | "EKS Auto Mode uses different labels than Karpenter. Labels related to EC2 managed instances start with `eks.amazonaws.com`." and "+ EKS Auto Mode only supports Linux" ; https://docs.aws.amazon.com/eks/latest/userguide/device-management-nvidia-time-slicing.html | "EKS Auto Mode manages the NVIDIA device plugin and does not expose its configuration. Because time-slicing requires device plugin configuration, you cannot apply a time-slicing configuration on EKS Auto Mode nodes." (accessed 2026-11-20)
- Use in dive: section 28, "Auto Mode against self-managed Karpenter"; what it does poorly. The absence of AMI and user data fields is `[our reading]` of the printed NodeClass specification.

**F10-435. Spot in Auto Mode is a custom NodePool whose `karpenter.sh/capacity-type` requirement includes `spot`; with no capacity type set, the order is `reserved`, then `spot`, then `on-demand`. Auto Mode handles Spot interruption notices, scheduled maintenance events and status check failures itself, with no queue to set up. The guide's example of a mixed pool is a CI runner NodePool with `values: ["spot", "on-demand"]`, limits of 500 CPUs and consolidation 30 seconds after pods are removed.**
- Location: Amazon EKS User Guide, "Create a Node Pool for EKS Auto Mode", supported labels; "Automate cluster infrastructure with EKS Auto Mode"; "Cost optimization in EKS Auto Mode", "Example: CI runner NodePool"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/auto-cost-control.html | Tier 1, first-party docs | definition | "apiVersion: karpenter.sh/v1 kind: NodePool metadata: name: ci-runners spec: template: spec: nodeClassRef: group: eks.amazonaws.com kind: NodeClass name: default requirements: - key: \"eks.amazonaws.com/instance-category\" operator: In values: [\"c\", \"m\"] - key: \"eks.amazonaws.com/instance-cpu\" operator: Lte values: [\"32\"] - key: \"karpenter.sh/capacity-type\" operator: In values: [\"spot\", \"on-demand\"] limits: cpu: \"500\" memory: 1000Gi disruption: consolidationPolicy: WhenEmptyOrUnderutilized consolidateAfter: 30s" and "+ Permits both Spot and On-Demand capacity" ; https://docs.aws.amazon.com/eks/latest/userguide/create-node-pool.html | "| karpenter.sh/capacity-type | spot | Capacity types include `spot`, `on-demand`, and `reserved`. If you do not specify a capacity type, Karpenter prioritizes `reserved`, then `spot`, then `on-demand`. |" ; https://docs.aws.amazon.com/eks/latest/userguide/automode.html | "+ Automatically handles [EC2 Spot Instance interruption notices](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html), EC2 instance health/scheduled maintenance events, and EC2 instance status check failures" (accessed 2026-11-20)
- Use in dive: section 28, the Spot and On-Demand mix on Auto Mode; the snippet is in section 5. No Auto Mode page prints a GPU Spot NodePool (U10c-2).

**F10-436. The Auto Mode NodeClass (`eks.amazonaws.com/v1`, kind `NodeClass`) sets: `role` or `instanceProfile`, subnet and security group selectors, optional pod subnets, `capacityReservationSelectorTerms`, `ephemeralStorage` (`size` 1 to 59000Gi, `iops` 3000 to 16000, `throughput` 125 to 1000, optional KMS key), `advancedNetworking` (including `networkInterfaces` with `efa-only` interfaces), `placementGroupSelector`, `advancedSecurity.fips`, `certificateBundles` and `tags`. On instances with local NVMe, Auto Mode formats the disks itself and builds a RAID 0 array when there are several.**
- Location: Amazon EKS User Guide, "Create a Node Class for Amazon EKS", "Node Class Specification"; "Learn about Amazon EKS Auto Mode Managed instances", "Considerations"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/create-node-class.html | Tier 1, first-party docs | definition | "ephemeralStorage: size: \"80Gi\" # Range: 1-59000Gi or 1-64000G or 1-58Ti or 1-64T iops: 3000 # Range: 3000-16000 throughput: 125 # Range: 125-1000" and "# Optional: EC2 Placement Group placementGroupSelector: name: \"targeted-pg\"" and "- deviceIndex: 0 interfaceType: efa-only networkCardIndex: 1" ; https://docs.aws.amazon.com/eks/latest/userguide/automode-learn-instances.html | "+ Uses a smaller (20 GiB) Amazon EBS data volume to reduce costs. + Formats and configures the NVMe local storage for ephemeral data use. This includes setting up a RAID 0 array if there are multiple NVMe drives." (accessed 2026-11-20)
- Use in dive: section 28, moving part "NodeClass (Auto Mode)"; storage and network lines of the recommended configuration.

**F10-437. Every 2026 item in the Auto Mode release notes, oldest first: 2 February, disable IPv4 egress from IPv6 pods; 2 April, NodeClass dry-run validation; 10 April, new instance types (F10-433); 5 May, EC2 placement groups; 3 June, interruptible Capacity Reservations; 4 June, cost guidance; 9 June, instance status check monitoring (unhealthy nodes replaced); 30 June, 27 July, 5 August and 12 August, load balancer controller features; 21 July, EFA network interfaces on NodeClass; 27 July, the `Balanced` consolidation policy; 17 August, RBAC for managed controllers; 14 September, a deprecation (volume-modifier annotations, ended 31 October); 1 October, `Balanced` as default on Kubernetes 1.37; 12 October, `advancedCompute` (kubelet settings, sysctls, hugepages); 26 October, Gateway API; 9 November, Nitro Sandboxes and DRA for NVIDIA GPUs and EFA. November 2026 has that one dated entry; the page's newest heading is "November 9, 2026".**
- Location: Amazon EKS User Guide, "Review EKS Auto Mode release notes"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/auto-change.html | Tier 1, first-party docs | launch announcement | "## June 9, 2026 **Feature**: Added instance status check monitoring to EKS Auto Mode. The compute controller now polls EC2 `DescribeInstanceStatus` to detect scheduled maintenance events and instance or system status check failures, automatically replacing unhealthy nodes." and "## May 5, 2026 **Feature**: Added support for EC2 Placement Groups in EKS Auto Mode." and "## June 3, 2026 **Feature**: Added support for Interruptible Capacity Reservations in EKS Auto Mode." and "## July 21, 2026 **Feature**: Added support for static network interface configuration on NodeClass." and "## October 12, 2026 **Feature**: Amazon Elastic Kubernetes Service (Amazon EKS) Auto Mode now supports advanced compute configuration through the new `advancedCompute` field in `NodeClass`." ; headings on the page as fetched, in order: "November 9, 2026", "October 26, 2026", "October 12, 2026", "October 1, 2026", "September 14, 2026", "August 17, 2026", "August 12, 2026", "August 5, 2026", "July 27, 2026", "July 21, 2026", "June 30, 2026", "June 9, 2026", "June 4, 2026", "June 3, 2026", "May 5, 2026", "April 10, 2026", "April 2, 2026", "February 2, 2026" (accessed 2026-11-20)
- Use in dive: section 28, "what changed in 2026". Sharpens F09-47: exact dates for placement groups (5 May) and interruptible reservations (3 June). The resource optimization preview of 17 November (F09-46) is not on this page.

**F10-438. The only timing the Auto Mode tutorial prints for a GPU scale-up is in its sample output: after applying a NodePool for `g6e` and `g6` and a pod that asks for one GPU, "Wait a few seconds", and the node list shows a `g6e.2xlarge` On-Demand node `READY True` at `AGE 76s`. It is one illustration, not a service level.**
- Location: Amazon EKS User Guide, "Deploy an accelerated workload", Step 1
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/auto-accelerated.html | Tier 1, first-party docs | definition | "Wait a few seconds, and check the nodes in your cluster. You should now see a new node provisioned in your Amazon EKS Auto Mode cluster:" and "gpu-dnknr g6e.2xlarge on-demand us-west-2b i-02315c7d7643cdee6 True 76s" and "You can also benefit from cost savings by scaling the cluster to zero. You can configure EKS Auto Mode to terminate instances when no workloads are running." (accessed 2026-11-20)
- Use in dive: section 28, animation timing for scale from zero, labelled as the docs' sample output (76 seconds, one g6e.2xlarge); scale to zero.

**F10-439. AWS's position on running both: "AWS suggests running either EKS Auto Mode or self-managed Karpenter"; both can be installed during a migration, which needs Karpenter v1.1 or later, and the two share the `nodepools.karpenter.sh` and `nodeclaims.karpenter.sh` definitions. An Auto Mode NodePool differs from a Karpenter one in its `nodeClassRef` (`group: eks.amazonaws.com`, `kind: NodeClass`) and its label prefix. Static NodePools (`replicas`) exist in both: no consolidation, only `limits.nodes`, no `weight`, and the mode cannot be switched back.**
- Location: Amazon EKS User Guide, "Learn about Amazon EKS Auto Mode Managed instances"; "Migrate from Karpenter to EKS Auto Mode using kubectl"; "Static Capacity Node Pools in EKS Auto Mode"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/automode-learn-instances.html | Tier 1, first-party docs | definition | "AWS suggests running either EKS Auto Mode or self-managed Karpenter. You can install both during a migration or in an advanced configuration." ; https://docs.aws.amazon.com/eks/latest/userguide/auto-migrate-karpenter.html | "Some CRDs (e.g., `nodepools.karpenter.sh` and `nodeclaims.karpenter.sh`) are shared between EKS Auto Mode and Karpenter." ; https://docs.aws.amazon.com/eks/latest/userguide/auto-static-capacity.html | "**Cannot switch modes**: Once you set `replicas` on a node pool, you cannot remove it." and "**No consolidation**: Nodes in static capacity pools are not considered for consolidation." (accessed 2026-11-20)
- Use in dive: section 28, the choice between the two node layers.

### A5. GPU exposure: images, device plugin, DRA, GPU Operator, sharing

A GPU reaches a pod in three steps: a driver in the node's operating system, a component that tells Kubernetes the node has GPUs (a device plugin, or a DRA driver), and a request in the pod spec.

**F10-440. The EKS-optimised accelerated images, by variant. AL2023 x86_64 NVIDIA: p6-b300, p6-b200, p5, p5e, p5en, p4d, p4de, p3, p3dn, g7, g7e, gr6, g6, g6e, g6f, gr6f, g5, g4dn. Bottlerocket x86_64 `aws-k8s-nvidia`: the same list, with g7 only on EKS 1.37 or later. The AL2023 NVIDIA image ships the driver, the CUDA user mode driver, the container toolkit, fabric manager and a minimal EFA; it does not ship the NVIDIA device plugin or the DRA driver. The Bottlerocket NVIDIA image also ships the device plugin and the MIG manager. One AL2023 image carries two driver versions, 580 (long-term support) and 595 (needed by g7), chosen at first boot. The newest amazon-eks-ami release is v20261119 (19 November 2026).**
- Location: Amazon EKS User Guide, "Use EKS-optimized accelerated Linux AMIs for GPU instances"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html | Tier 1, first-party docs | documentation of support | "| AL2023 x86\_64 NVIDIA | p6-b300, p6-b200, p5, p5e, p5en, p4d, p4de, p3, p3dn, g7, g7e, gr6, g6, g6e, g6f, gr6f, g5, g4dn |" and "| Bottlerocket x86\_64 aws-k8s-nvidia | p6-b300, p6-b200, p5, p5e, p5en, p4d, p4de, p3, p3dn, g7 (EKS 1.37 or later), g7e, gr6, g6, g6e, g6f, gr6f, g5, g4dn |" and "The EKS-optimized AL2023 NVIDIA AMIs do not include the NVIDIA Kubernetes device plugin or the NVIDIA DRA driver, and these must be installed separately." and "The `g7` instance type requires NVIDIA driver version 595 or later, while all other supported GPUs (including `g7e`) require NVIDIA driver version 580." and "The LTS (long-term support) driver version is currently 580, and the production branch driver version is currently 595." ; GitHub API release list for awslabs/amazon-eks-ami: "v20261119 2026-11-19" (accessed 2026-11-20)
- Use in dive: section 28, moving part "node image". Goes deeper than F09-49.

**F10-441. The NVIDIA GPU Operator automates "all NVIDIA software components needed to provision GPU": the drivers, the Kubernetes device plugin, the NVIDIA Container Toolkit, node labelling with GPU Feature Discovery and DCGM-based monitoring. Its newest release is v26.7.3 (17 November 2026); the standalone NVIDIA device plugin is at v0.20.2 (17 November 2026). On EKS images the driver is already present, so the operator's driver and toolkit installs must be disabled on AL2023, and its driver, toolkit and device plugin installs on Bottlerocket.**
- Location: NVIDIA GPU Operator documentation, "About the NVIDIA GPU Operator"; Amazon EKS User Guide, accelerated AMIs page
- Verdict: NEW
- Evidence: https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/overview.html | Tier 1, NVIDIA docs | definition | "The NVIDIA GPU Operator uses the operator framework within Kubernetes to automate the management of all NVIDIA software components needed to provision GPU. These components include the NVIDIA drivers (to enable CUDA), Kubernetes device plugin for GPUs, the NVIDIA Container Toolkit , automatic node labeling using GFD , DCGM based monitoring and others." ; https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html | Tier 1, first-party docs | documentation of support | "When using the [NVIDIA GPU operator](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/overview.html) with the EKS-optimized AL2023 NVIDIA AMIs, you must disable the operator installation of the driver and toolkit, as these are already included in the EKS AMIs." and "you must disable the operator installation of the driver, toolkit, and device plugin as these are already included in the EKS AMIs" ; GitHub API release lists: NVIDIA/gpu-operator "v26.7.3 2026-11-17", NVIDIA/k8s-device-plugin "v0.20.2 2026-11-17" (accessed 2026-11-20)
- Use in dive: section 28, device plugin against GPU Operator: on EKS the operator is needed for the MIG manager and for monitoring, not for the driver `[our reading]`.

**F10-442. DRA (Dynamic Resource Allocation) is the Kubernetes API, generally available in Kubernetes 1.34, in which a driver publishes each device with its attributes (`ResourceSlice`) and a pod claims one through a `ResourceClaim` that names a `DeviceClass`. The EKS guide recommends DRA drivers "for new deployments with Kubernetes versions 1.34 and later" and states support on all four node layers: Auto Mode (built in, Kubernetes 1.36 or later), Karpenter (from v1.15, dynamic provisioning behind feature gates), managed node groups and self-managed nodes. A DRA driver and a device plugin for the same device type must never run on the same node, because each would hand out the device without knowing about the other. The NVIDIA DRA driver is at v0.5.1 (12 October 2026) and now lives at `kubernetes-sigs/dra-driver-nvidia-gpu`.**
- Location: Amazon EKS User Guide, "Manage hardware devices on Amazon EKS"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/device-management.html | Tier 1, first-party docs | documentation of support | "We recommend using DRA drivers for new deployments with Kubernetes versions 1.34 and later." and "DRA is supported with EKS Auto Mode, Karpenter, EKS managed node groups, and self-managed nodes." and "Karpenter supports DRA with both dynamic and static capacity provisioning as of Karpenter version 1.15. Dynamic provisioning requires enabling Karpenter feature gates." and "Dynamic Resource Allocation (DRA) is a Kubernetes feature made generally available in Kubernetes version 1.34 that addresses these limitations." and "DRA drivers and device plugins for the same device type **must** not run simultaneously on the same node." and "Device plugins remain fully supported for all Kubernetes versions." ; GitHub API release list for kubernetes-sigs/dra-driver-nvidia-gpu: "v0.5.1 2026-10-12", "v0.5.0 2026-08-19" (accessed 2026-11-20)
- Use in dive: section 28, device plugin against DRA. Contradicts F09-42, whose source page (the best-practices guide) still says DRA works "not with Karpenter".

**F10-443. Time-slicing lets several pods take turns on one GPU: the device plugin advertises more than one slot per GPU and the GPU's CUDA scheduler multiplexes the work. It gives no memory or compute isolation. The guide's recommended slot count is 2 to 8 per GPU, with `failRequestsGreaterThanOne: true`. Karpenter counts every `nvidia.com/gpu` request as a whole physical GPU even when time-slicing is on. The guide says not to use it for training, and it is not available in Auto Mode.**
- Location: Amazon EKS User Guide, "Use time-slicing with NVIDIA GPUs on Amazon EKS"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/device-management-nvidia-time-slicing.html | Tier 1, first-party docs | definition | "Time-slicing does not offer memory or compute isolation between Pods that share a GPU." and "<tr><td>Replicas</td><td>2-8</td><td>The number of schedulable slots to advertise per physical GPU." and "Karpenter counts each `nvidia.com/gpu` request as a physical GPU even when time-slicing is enabled on the GPU." and "+ You run training workloads. Time-slicing adds context-switching that reduces training efficiency. A checkpointed job that another Pod slows down must retry from its last checkpoint." and "Time-slicing is not available in EKS Auto Mode." and the AL2023 configuration "apiVersion: v1 kind: ConfigMap metadata: name: nvidia-device-plugin-config namespace: nvidia data: config.yaml: | version: v1 sharing: timeSlicing: renameByDefault: false failRequestsGreaterThanOne: true resources: - name: nvidia.com/gpu replicas: 4" (accessed 2026-11-20)
- Use in dive: section 28, GPU sharing; the ConfigMap snippet is in section 5. Goes deeper than F09-41.

**F10-444. MIG (Multi-Instance GPU) is a hardware feature that splits one GPU into isolated instances, each with its own memory and compute. On AWS it exists on p4d, p4de, p5, p5e, p5en, p6-b200, p6-b300 and on the two newest G families, g7 and g7e; not on g5, g6 or g6e. A g7e GPU (96 GB) splits into at most 4 instances of 24 GB (`1g.24gb`); a g7 GPU (32 GB) into 2 of 16 GB (`1g.16gb`). Changing the layout needs a GPU reset. NCCL does not work across MIG instances, so multi-GPU training needs whole GPUs. Karpenter's dynamic provisioning does not launch nodes for MIG claims ("scale-from-zero does not work for MIG workloads"), and MIG cannot be enabled in Auto Mode.**
- Location: Amazon EKS User Guide, "Use multi-instance GPUs (MIG) with NVIDIA GPUs on Amazon EKS"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/device-management-nvidia-mig.html | Tier 1, first-party docs | documentation of support | "MIG is not available on the `g5`, `g6`, or `g6e` families." and "| `1g.24gb` | 1 of 4 | 24 GB | 4 |" and "| `1g.16gb` | 1 of 2 | 16 GB | 2 |" and "When MIG is enabled, MIG instances on different GPUs cannot use GPU-to-GPU peer-to-peer (P2P) communication, and NCCL does not work with MIG." and "The pending Pod is left unscheduled, which is safe but means scale-from-zero does not work for MIG workloads." and "You cannot enable MIG on EKS Auto Mode nodes." and "**Changing MIG configuration requires a GPU reset.**" (accessed 2026-11-20)
- Use in dive: section 28, GPU sharing with isolation. Sharpens F09-41 (which lists Ampere, Hopper, Blackwell without the G7 and G7e families).

**F10-445. MPS (Multi-Process Service) runs several CUDA processes on one GPU at the same moment, which the EKS guide describes as "better isolation than time-slicing". It needs the GPU in `EXCLUSIVE_PROCESS` compute mode, where time-slicing sets `DEFAULT`, so the two cannot share a physical GPU; MPS is the documented way to share a single MIG instance between containers. Through the device plugin, MIG (static), MPS and time-slicing are generally available; through the NVIDIA DRA driver, dynamic MIG, MPS and time-slicing are alpha.**
- Location: EKS Best Practices Guide, AI/ML Compute, "Optimize GPU workloads with MPS"; Amazon EKS User Guide, time-slicing page and "Use the NVIDIA DRA driver or device plugin on Amazon EKS"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html | Tier 1, first-party docs | definition | "Multi-Process Service (MPS) enables concurrent execution of multiple CUDA contexts on a single GPU with better isolation than time-slicing." ; https://docs.aws.amazon.com/eks/latest/userguide/device-management-nvidia-time-slicing.html | "Time-slicing sets the GPU compute mode to `DEFAULT`, while NVIDIA Multi-Process Service (MPS) requires `EXCLUSIVE_PROCESS`." and "To share a single MIG instance across containers, use MPS instead." ; https://docs.aws.amazon.com/eks/latest/userguide/device-management-nvidia-dra-device-plugin.html | "| GPU sharing | (Alpha) Dynamic MIG, MPS, time-slicing. Not available in EKS Auto Mode. | (GA) Static MIG, MPS, time-slicing. Not configurable in EKS Auto Mode. |" (accessed 2026-11-20)
- Use in dive: section 28, the three sharing modes in one table: time-slicing (takes turns, no isolation), MPS (runs together), MIG (hardware walls).

### A6. Batch scheduling on Kubernetes: Kueue, KAI Scheduler, JobSet, Kubeflow Trainer

Karpenter supplies nodes for any pod that is pending. It has no queue, no quota per team and no notion of a job. Those come from a layer above it. Kueue decides when a job may start; KAI Scheduler replaces the pod scheduler for the pods that name it; JobSet and Kubeflow Trainer describe a multi-pod training job as one object.

**F10-450. Kueue's objects (API `kueue.x-k8s.io/v1beta2`, Kueue v0.20.7 of 19 November 2026). A ResourceFlavor describes one kind of node ("spot versus on-demand VMs", x86 versus Arm, GPU model) and ties it to nodes through `spec.nodeLabels` and tolerations. A ClusterQueue holds quota per flavor (`nominalQuota`). A LocalQueue is the namespaced object a team submits to; it points at one ClusterQueue. A Workload is the unit of admission; Kueue creates one for each Job. The smallest working setup in the repository is one flavor, one ClusterQueue with 9 CPUs and 36Gi, and one LocalQueue.**
- Location: Kueue docs at tag v0.20.7: concepts/resource_flavor.md, concepts/local_queue.md, concepts/workload.md; examples/admin/single-clusterqueue-setup.yaml
- Verdict: NEW
- Evidence: https://github.com/kubernetes-sigs/kueue/blob/e854ec82e404436b261c81f0341ac9de8508f97c/site/static/examples/admin/single-clusterqueue-setup.yaml | Tier 1, project example at tag v0.20.7 (commit e854ec82e404436b261c81f0341ac9de8508f97c) | definition | "apiVersion: kueue.x-k8s.io/v1beta2 kind: ResourceFlavor metadata: name: \"default-flavor\" --- apiVersion: kueue.x-k8s.io/v1beta2 kind: ClusterQueue metadata: name: \"cluster-queue\" spec: namespaceSelector: {} # match all. resourceGroups: - coveredResources: [\"cpu\", \"memory\"] flavors: - name: \"default-flavor\" resources: - name: \"cpu\" nominalQuota: 9 - name: \"memory\" nominalQuota: 36Gi --- apiVersion: kueue.x-k8s.io/v1beta2 kind: LocalQueue metadata: namespace: \"default\" name: \"user-queue\" spec: clusterQueue: \"cluster-queue\"" ; https://github.com/kubernetes-sigs/kueue/blob/e854ec82e404436b261c81f0341ac9de8508f97c/site/content/en/docs/concepts/resource_flavor.md | "- Pricing and availability (for example, spot versus on-demand VMs)" and "A ResourceFlavor is an object that represents these resource variations and allows you to associate them with cluster nodes through labels, taints and tolerations." ; https://github.com/kubernetes-sigs/kueue/blob/e854ec82e404436b261c81f0341ac9de8508f97c/site/content/en/docs/concepts/workload.md | "Kueue automatically creates a Workload for each Job object and syncs the decisions and statuses." (accessed 2026-11-20)
- Use in dive: section 28, moving parts "LocalQueue, ClusterQueue, ResourceFlavor, Workload"; the queue drawn above the NodePools. Goes deeper than F09-55.

**F10-451. A Job joins a Kueue queue with one label, `kueue.x-k8s.io/queue-name`. Admission has two phases: quota reservation (the LocalQueue's ClusterQueue must have quota in a flavor that fits the request, and Kueue locks it) and then any admission checks. Once admitted, Kueue writes the chosen flavor's node labels into the pod template's `nodeSelector` and adds its tolerations, so the pods can only land on that kind of node.**
- Location: Kueue docs at tag v0.20.7: concepts/admission.md, concepts/resource_flavor.md; examples/jobs/sample-job.yaml
- Verdict: NEW
- Evidence: https://github.com/kubernetes-sigs/kueue/blob/e854ec82e404436b261c81f0341ac9de8508f97c/site/static/examples/jobs/sample-job.yaml | Tier 1, project example at tag v0.20.7 | definition | "apiVersion: batch/v1 kind: Job metadata: generateName: sample-job- namespace: default labels: kueue.x-k8s.io/queue-name: user-queue spec: parallelism: 3 completions: 3 template: spec: containers: - name: dummy-job image: registry.k8s.io/e2e-test-images/agnhost:2.53 command: [ \"/bin/sh\" ] args: [ \"-c\", \"sleep 60\" ] resources: requests: cpu: \"1\" memory: \"200Mi\" restartPolicy: Never" ; https://github.com/kubernetes-sigs/kueue/blob/e854ec82e404436b261c81f0341ac9de8508f97c/site/content/en/docs/concepts/admission.md | "1. **Quota Reservation:** When a user submits a Workload, it enters a LocalQueue first. This LocalQueue points to a ClusterQueue which is responsible for managing the available resources." and "The Workload is admitted once all [AdmissionCheckStates](/docs/concepts/admission_check/#admissioncheckstates) are in the `Ready` state." ; https://github.com/kubernetes-sigs/kueue/blob/e854ec82e404436b261c81f0341ac9de8508f97c/site/content/en/docs/concepts/resource_flavor.md | "- Kueue adds the ResourceFlavor labels to the `.nodeSelector` of the underlying Workload Pod templates." (accessed 2026-11-20)
- Use in dive: section 28, animation steps "submit to LocalQueue", "quota reserved", "admitted, pods created with the flavor's nodeSelector". A flavor whose `nodeLabels` carry `karpenter.sh/capacity-type: spot` is how a queue targets the Spot NodePool `[our reading]`.

**F10-452. Kueue preemption is set per ClusterQueue with three fields, each `Never` by default: `withinClusterQueue` (`LowerPriority` or `LowerOrNewerEqualPriority`), `reclaimWithinCohort` (`LowerPriority` or `Any`: take back quota that other queues of the cohort borrowed) and `borrowWithinCohort` (preempt in order to borrow, up to a `maxPriorityThreshold`).**
- Location: Kueue docs at tag v0.20.7, concepts/cluster_queue.md, "Preemption"
- Verdict: NEW
- Evidence: https://github.com/kubernetes-sigs/kueue/blob/e854ec82e404436b261c81f0341ac9de8508f97c/site/content/en/docs/concepts/cluster_queue.md | Tier 1, project docs at tag v0.20.7 | definition | "apiVersion: kueue.x-k8s.io/v1beta2 kind: ClusterQueue metadata: name: \"team-a-cq\" spec: preemption: reclaimWithinCohort: Any borrowWithinCohort: policy: LowerPriority maxPriorityThreshold: 100 withinClusterQueue: LowerPriority" and "- `Never` (default): do not preempt Workloads in the cohort." and "- `LowerOrNewerEqualPriority`: only preempt Workloads in the ClusterQueue that either have a lower priority than the pending workload or equal priority and are newer than the pending workload." (accessed 2026-11-20)
- Use in dive: section 28, the preemption snippet; evaluation jobs preempting low-priority simulation sweeps.

**F10-453. Kueue and Karpenter. Kueue's built-in capacity check, the ProvisioningRequest admission check (generally available since Kueue v0.14), is written for the Kubernetes cluster-autoscaler: Kueue creates a ProvisioningRequest, cluster-autoscaler provisions and sets `Provisioned=true`, and only then is the workload admitted. The Kueue page names no other autoscaler. With Karpenter the path is the plain one: Kueue admits on quota, the Job's pods are created and stay pending, and Karpenter launches nodes for the pending pods (F10-403).**
- Location: Kueue docs at tag v0.20.7, concepts/admission_check/provisioning_request.md
- Verdict: NEW
- Evidence: https://github.com/kubernetes-sigs/kueue/blob/e854ec82e404436b261c81f0341ac9de8508f97c/site/content/en/docs/concepts/admission_check/provisioning_request.md | Tier 1, project docs at tag v0.20.7 | definition | "A built-in admission check providing Kueue integration with cluster-autoscaler." and "The Provisioning AdmissionCheck Controller is an AdmissionCheck Controller designed to integrate Kueue with [Kubernetes cluster-autoscaler]" and "The controller is part of Kueue and is enabled by default. The feature is now Generally Available (GA) as of Kueue v0.14." and "- `Provisioned=true`: CA provisioned the capacity and it's ready to use" (accessed 2026-11-20)
- Use in dive: section 28, how the queue and the node autoscaler meet. The last sentence of the claim is `[our reading]`: no first-party page read today states Karpenter support for ProvisioningRequest (U10c-3). Consequence: with Karpenter, quota is the only gate, and a job can be admitted and then wait for Spot capacity.

**F10-454. KAI Scheduler (v0.19.0, 11 November 2026) schedules the pods that set `schedulerName: kai-scheduler` and carry the label `kai.scheduler/queue`. Its Queue object (`scheduling.run.ai/v2`) is hierarchical: only leaf queues take jobs, and each resource (cpu, gpu, memory) has a `quota` (guaranteed), a `limit` (hard cap, -1 for none) and an `overQuotaWeight` (share of spare capacity). Gang scheduling means all of a job's pods are scheduled together or none are; for a plain Job the annotation `kai.scheduler/batch-min-member` sets the minimum number that must be schedulable.**
- Location: KAI Scheduler at tag v0.19.0: docs/queues/README.md, docs/batch/README.md, docs/quickstart/default-queues.yaml, docs/batch/batch-job-min-member.yaml
- Verdict: NEW
- Evidence: https://github.com/kai-scheduler/KAI-Scheduler/blob/2305acfc348c9bd9cd1ab813d3feb8dfc4ab9d11/docs/quickstart/default-queues.yaml | Tier 1, project example at tag v0.19.0 (commit 2305acfc348c9bd9cd1ab813d3feb8dfc4ab9d11) | definition | "apiVersion: scheduling.run.ai/v2 kind: Queue metadata: name: default-parent-queue spec: resources: cpu: limit: -1 overQuotaWeight: 1 quota: 0 gpu: limit: -1 overQuotaWeight: 1 quota: 0 memory: limit: -1 overQuotaWeight: 1 quota: 0 --- apiVersion: scheduling.run.ai/v2 kind: Queue metadata: name: default-queue spec: parentQueue: default-parent-queue resources: cpu: limit: -1 overQuotaWeight: 1 quota: 0 gpu: limit: -1 overQuotaWeight: 1 quota: 0 memory: limit: -1 overQuotaWeight: 1 quota: 0" ; https://github.com/kai-scheduler/KAI-Scheduler/blob/2305acfc348c9bd9cd1ab813d3feb8dfc4ab9d11/docs/queues/README.md | "Only leaf queues (queues with no children) can be used for scheduling jobs." and "| **Quota** | Guaranteed resource allocation | CPU: millicores, Memory: MB, GPU: units |" ; https://github.com/kai-scheduler/KAI-Scheduler/blob/2305acfc348c9bd9cd1ab813d3feb8dfc4ab9d11/docs/batch/README.md | "others require gang scheduling, meaning either all pods are scheduled together or none are scheduled until resources become available" and "This will create a job with parallelism of 6, but requires at least 2 pods to be scheduled together before any pod starts running." ; https://github.com/kai-scheduler/KAI-Scheduler/blob/2305acfc348c9bd9cd1ab813d3feb8dfc4ab9d11/docs/batch/batch-job-min-member.yaml | "apiVersion: batch/v1 kind: Job metadata: name: batch-job-min-member annotations: kai.scheduler/batch-min-member: \"2\" spec: parallelism: 6 completions: 6 template: metadata: labels: kai.scheduler/queue: default-queue spec: schedulerName: kai-scheduler restartPolicy: OnFailure automountServiceAccountToken: false containers: - name: main image: ubuntu args: [\"sleep\", \"infinity\"] resources: limits: nvidia.com/gpu: \"1\" memory: 1Gi" (accessed 2026-11-20)
- Use in dive: section 28, KAI as the alternative to Kueue; queue and gang snippets in section 5. Goes deeper than F09-57.

**F10-455. A KAI fractional-GPU pod asks for its share in an annotation (`gpu-fraction: "0.5"`), not in `resources`. A node autoscaler therefore cannot see the request. KAI's answer is a component, `node-scale-adjuster`, off by default (`--set "global.clusterAutoscaling=true"`), which launches a temporary pod that requests a full GPU so that the autoscaler adds a node; two pending pods of 0.5 GPU produce one such pod. On Karpenter, KAI marks its GPU reservation pods with `karpenter.sh/do-not-disrupt`, which keeps Karpenter from consolidating nodes that host fractional pods.**
- Location: KAI Scheduler at tag v0.19.0: docs/gpu-sharing/gpu-sharing.yaml, docs/gpu-sharing/autoscaling/README.md and karpenter.md
- Verdict: NEW
- Evidence: https://github.com/kai-scheduler/KAI-Scheduler/blob/2305acfc348c9bd9cd1ab813d3feb8dfc4ab9d11/docs/gpu-sharing/gpu-sharing.yaml | Tier 1, project example at tag v0.19.0 | definition | "apiVersion: v1 kind: Pod metadata: name: gpu-sharing labels: kai.scheduler/queue: default-queue annotations: gpu-fraction: \"0.5\" spec: schedulerName: kai-scheduler automountServiceAccountToken: false containers: - name: gpu-workload image: nvidia/cuda:13.0.2-base-ubi8 command: [\"nvidia-smi\"] args: [\"-L\"] resources: limits: memory: 1Gi" ; https://github.com/kai-scheduler/KAI-Scheduler/blob/2305acfc348c9bd9cd1ab813d3feb8dfc4ab9d11/docs/gpu-sharing/autoscaling/README.md | "However, when using GPU Sharing, GPU requests are specified in pod annotations rather than the pod specification. This makes them invisible to the cluster autoscaler." and "GPU sharing autoscaling is disabled by default." and "For example, if there are two pods each requesting 0.5 GPU, only one utility pod will be created, requesting a full GPU." ; https://github.com/kai-scheduler/KAI-Scheduler/blob/2305acfc348c9bd9cd1ab813d3feb8dfc4ab9d11/docs/gpu-sharing/autoscaling/karpenter.md | "KAI annotates these reservation pods with Karpenter's `karpenter.sh/do-not-disrupt` annotation." (accessed 2026-11-20)
- Use in dive: section 28, fractional GPUs and scale from zero: a setting the reader must turn on, or fractional pods stay pending on an empty NodePool.

**F10-456. JobSet (v0.13.1, 18 November 2026; API `jobset.x-k8s.io/v1alpha2`) manages a group of Kubernetes Jobs as one unit: different pod templates for leader and workers, a headless service for stable pod hostnames, and a failure policy. On a failure it recreates all child Jobs, "allowing the workload to resume from the last checkpoint". The failure policy has `maxRestarts` and rules; the repository's host-maintenance example restarts the JobSet without counting against `maxRestarts` when a pod was evicted (pod condition `DisruptionTarget`), which is the condition a node drain produces.**
- Location: kubernetes-sigs/jobset at tag v0.13.1: README.md; site/static/examples/failure-policy/host-maintenance-event-model.yaml
- Verdict: NEW
- Evidence: https://github.com/kubernetes-sigs/jobset/blob/6266f0267a5d1a013ae552ecb209214eab5c55c8/README.md | Tier 1, project README at tag v0.13.1 (commit 6266f0267a5d1a013ae552ecb209214eab5c55c8) | definition | "JobSet is a Kubernetes-native API for managing a group of [k8s Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/) as a unit." and "If any job is marked failed, the entire JobSet will be recreated, allowing the workload to resume from the last checkpoint." and "API version: v1alpha2" ; https://github.com/kubernetes-sigs/jobset/blob/6266f0267a5d1a013ae552ecb209214eab5c55c8/site/static/examples/failure-policy/host-maintenance-event-model.yaml | "apiVersion: jobset.x-k8s.io/v1alpha2 kind: JobSet metadata: name: host-maintenance-event-model spec: failurePolicy: maxRestarts: 0 rules: # The JobSet will restart an unlimited number of times when failure matches the pod failure policy. - action: RestartJobSetAndIgnoreMaxRestarts onJobFailureReasons: - PodFailurePolicy # The JobSet is restarted as normal when the leader job fails and the above rule is not matched. - action: RestartJobSet targetReplicatedJobs: - leader" and "# In such a case, the pods are evicted and the job will fail with a condition # of type DisruptionTarget. podFailurePolicy: rules: - action: FailJob onPodConditions: - type: DisruptionTarget" ; GitHub API release list: "v0.13.1 2026-11-18", "v0.13.0 2026-10-12" (accessed 2026-11-20)
- Use in dive: section 28, the retry half of "checkpoint and requeue" for a multi-pod job: a Spot drain evicts a pod, the JobSet restarts whole, the trainer reloads its checkpoint. That a Karpenter Spot drain sets `DisruptionTarget` is `[our reading]` of Kubernetes eviction behaviour, not a statement on these pages.

**F10-457. Kubeflow Trainer v2 (v2.4.0, 6 November 2026; API `trainer.kubeflow.org/v1alpha1`) splits a training job in two objects. A ClusterTrainingRuntime is the administrator's template (the chart ships `torch-distributed`, `torch-distributed-with-cache`, `deepspeed-distributed`, `jax-distributed`, `mlx-distributed`, `xgboost-distributed` and three torchtune runtimes). A TrainJob is the user's object: a `runtimeRef`, the trainer image and command, and optionally `activeDeadlineSeconds`. Trainer builds on JobSet and integrates with Kueue and KAI Scheduler.**
- Location: kubeflow/trainer at tag v2.4.0: README.md; docs/operator-guides/runtime.md; docs/user-guides/trainjob-lifecycle.md; charts/kubeflow-trainer/files/runtimes/
- Verdict: NEW
- Evidence: https://github.com/kubeflow/trainer/blob/a7b05c24ff0f145368529b5d180c223baf965ef5/docs/user-guides/trainjob-lifecycle.md | Tier 1, project docs at tag v2.4.0 (commit a7b05c24ff0f145368529b5d180c223baf965ef5) | definition | "apiVersion: trainer.kubeflow.org/v1alpha1 kind: TrainJob metadata: name: my-trainjob namespace: my-namespace spec: activeDeadlineSeconds: 3600 # terminate the TrainJob after 1 hour runtimeRef: name: torch-distributed kind: ClusterTrainingRuntime apiGroup: trainer.kubeflow.org trainer: image: docker.io/my-training-image:latest command: - torchrun - train.py" and "When the deadline is reached, all running Pods are terminated, the underlying JobSet is deleted, and the TrainJob status is set to `Failed` with reason `DeadlineExceeded`." ; https://github.com/kubeflow/trainer/blob/a7b05c24ff0f145368529b5d180c223baf965ef5/docs/operator-guides/runtime.md | "Runtimes are template configurations or blueprints that are managed by platform administrators and used by TrainJob to launch the desired training job." ; https://github.com/kubeflow/trainer/blob/a7b05c24ff0f145368529b5d180c223baf965ef5/README.md | "Kubeflow Trainer reuses existing Kubernetes-native building blocks like [JobSet](https://github.com/kubernetes-sigs/jobset) and [LeaderWorkerSet](https://github.com/kubernetes-sigs/lws) for AI workload orchestration." ; GitHub API release list: "v2.4.0 2026-11-06" (accessed 2026-11-20)
- Use in dive: section 28, the TrainJob snippet for workloads 8, 14 and 15.

**F10-458. NVIDIA OSMO is unchanged since register 09: the newest release today is still 6.3.1 (22 June 2026), with 6.3.0 on 5 May 2026. What it deploys on EKS is in F09-65 and F09-66 (KAI Scheduler, the GPU Operator, PostgreSQL, Redis, S3).**
- Location: GitHub API release list for NVIDIA/OSMO
- Verdict: NEW
- Evidence: https://github.com/NVIDIA/OSMO/releases/tag/6.3.1 | Tier 1, release list | launch announcement | GitHub API release list for NVIDIA/OSMO, newest two non-prerelease entries: "6.3.1 2026-06-22", "6.3.0 2026-05-05" (accessed 2026-11-20)
- Use in dive: section 28, hand-off to OSMO; confirms F09-61.

### A7. Node health, storage, network and limits

**F10-460. The EKS node monitoring agent (newest release v1.7.7, 7 November 2026) reads node logs and sets node conditions; the one for GPUs is `AcceleratedHardwareReady`. Faults it raises as a condition, with repair action Replace: `NvidiaDoubleBitError` (a double bit memory error from the driver), `NvidiaNVLinkError`, and `NvidiaXID[Code]Error` (a critical GPU error, Replace or Reboot depending on the code). Faults it only reports as events, with no repair: `NvidiaXID[Code]Warning`, `NvidiaThermalError`, `NvidiaPowerError`, `NvidiaPCIeError`, `NvidiaPageRetirement`, `NvidiaNCCLError`, `NvidiaDeviceCountMismatch`. It is built into Auto Mode and is an add-on elsewhere.**
- Location: Amazon EKS User Guide, "Detect node health issues with the EKS node monitoring agent", "AcceleratedHardware node health issues"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/node-health-nma.html | Tier 1, first-party docs | documentation of support | "| NvidiaDoubleBitError | Condition | A double bit error was produced by the GPU driver. | Replace |" and "| NvidiaNVLinkError | Condition | NVLink errors were reported by the GPU driver. | Replace |" and "| NvidiaXID[Code]Error | Condition | A critical GPU error occurred. | Replace or Reboot |" and "| NvidiaThermalError | Event | Thermal status of GPUs breached the allowed thresholds. | None |" ; https://docs.aws.amazon.com/eks/latest/userguide/node-health.html | "EKS Auto Mode compute includes the EKS node monitoring agent. For other EKS compute types, you can add the EKS node monitoring agent as an EKS add-on or you can manage it with Kubernetes tooling such as Helm." ; GitHub API release list for aws/eks-node-monitoring-agent: "v1.7.7 2026-11-07" (accessed 2026-11-20)
- Use in dive: section 28, moving part "node monitoring agent"; the GPU-fault branch of the animation.

**F10-461. EKS automatic node repair acts on those conditions after a wait: `AcceleratedHardwareReady` unhealthy for 10 minutes, then Replace or Reboot; `ContainerRuntimeReady`, `KernelReady`, `NetworkingReady`, `StorageReady` and `Ready` for 30 minutes, then Replace; `DiskPressure` and `MemoryPressure`, no action. It is always on in Auto Mode and cannot be configured there; it is optional on managed node groups and on Karpenter (feature gate `NodeRepair=true`). It stops when more than 20 percent of a NodePool's nodes are unhealthy.**
- Location: Amazon EKS User Guide, "Automatically repair nodes in EKS clusters"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/node-repair.html | Tier 1, first-party docs | definition | "| AcceleratedHardwareReady | AcceleratedHardwareReady indicates whether accelerated hardware (GPU, Neuron) on the node is functioning correctly. | 10m | Replace or Reboot, depending on the condition reason." and "| StorageReady | StorageReady indicates whether the node's storage subsystem is functioning correctly (disks, filesystems, I/O). | 30m | Replace |" and "By default, EKS automatic node repair stops taking new repair actions when more than 20 percent of the nodes in a group are unhealthy" and "Automatic node repair cannot be configured when using EKS Auto Mode. It is always enabled there, with the default settings described in this topic." (accessed 2026-11-20)
- Use in dive: section 28, timing for the GPU-fault branch: 10 minutes from fault to repair.

**F10-462. Repair is forceful, and the page says what that means for training: on Auto Mode and on Karpenter before v1.15.0 it "deletes the Pods on the unhealthy node with a minimal grace period rather than performing a standard drain, and it bypasses Pod disruption budgets"; "Design workloads that can't be interrupted safely, such as long-running training jobs, to checkpoint and resume." Self-managed Karpenter v1.15.0 and later adds a grace period (5 minutes for a matched GPU XID policy, 10 minutes otherwise), a reboot option (`RebootForRepair`, off by default) that keeps the instance, and a `karpenter.sh/do-not-repair` node annotation. `karpenter.sh/do-not-disrupt` never excludes a node from repair. The replacement launches before the unhealthy node is terminated.**
- Location: Amazon EKS User Guide, "Automatically repair nodes in EKS clusters", the Important note, "Replacement sequence" and "Repair behavior on Karpenter v1.15.0 and later"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/node-repair.html | Tier 1, first-party docs | definition | "On EKS Auto Mode, and on self-managed Karpenter earlier than `v1.15.0`, repair deletes the Pods on the unhealthy node with a minimal grace period rather than performing a standard drain, and it bypasses Pod disruption budgets." and "Design workloads that can't be interrupted safely, such as long-running training jobs, to checkpoint and resume." and "| An `AcceleratedHardwareReady` reason matched by one of the XID repair policies | 5m |" and "A reboot retains the instance, which avoids reprovisioning accelerated capacity that might have limited availability." and "1. Karpenter launches a replacement NodeClaim. The replacement launches before the unhealthy node is terminated, so both nodes exist for a few minutes." and "On every compute type, the `karpenter.sh/do-not-disrupt` annotation doesn't exclude a node from repair." (accessed 2026-11-20)
- Use in dive: section 28, a second reason (after Spot) that every training pod needs a checkpoint. Sharpens F10-421: the Karpenter docs page at v1.15.3 still describes the legacy behaviour (bypassing drain).

**F10-463. Storage for jobs on EKS, three drivers. Mountpoint for Amazon S3 CSI driver (v2.9.2, 30 October 2026) presents a bucket as a volume; static provisioning only, not all POSIX features, not compatible with EKS Hybrid Nodes or Fargate; the best-practices guide names it as the place for checkpoints. FSx for Lustre CSI driver (v1.12.0, 12 November 2026) mounts a Lustre file system, standalone or linked to S3 as a cache; Scratch-SSD storage is "Recommended for workloads that are ephemeral or short-lived (hours)". The EBS CSI driver (v1.68.1, 18 November 2026) provides block volumes, built into Auto Mode.**
- Location: Amazon EKS User Guide, "Access Amazon S3 objects with Mountpoint for Amazon S3 CSI driver", "Use high-performance app storage with Amazon FSx for Lustre"; EKS Best Practices Guide, AI/ML Storage and AI/ML Compute
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/s3-csi.html | Tier 1, first-party docs | documentation of a limit | "+ The Mountpoint for Amazon S3 CSI driver supports only static provisioning. Dynamic provisioning, or creation of new buckets, isn't supported." and "+ The Mountpoint for Amazon S3 CSI driver isn't presently compatible with Amazon EKS Hybrid Nodes." and "+ Volumes mounted with the Mountpoint for Amazon S3 CSI driver don't support all POSIX file-system features." ; https://docs.aws.amazon.com/eks/latest/best-practices/aiml-storage.html | Tier 1, first-party docs | definition | "then deploy FSx for Lustre file system as a standalone high performance cache or as an S3-linked file system to act as a high performance cache for S3 data" and "+ **Scratch-SSD storage**: Recommended for workloads that are ephemeral or short-lived (hours), with fixed throughput capacity per-TiB provisioned." ; https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html | "save intermediate results to persistent storage, such as an Amazon S3 bucket via the [Mountpoint for Amazon S3 CSI Driver](https://docs.aws.amazon.com/eks/latest/userguide/s3-csi.html) while the training job progresses" ; GitHub API release lists: awslabs/mountpoint-s3-csi-driver "v2.9.2 2026-10-30", kubernetes-sigs/aws-fsx-csi-driver "v1.12.0 2026-11-12", kubernetes-sigs/aws-ebs-csi-driver "v1.68.1 2026-11-18" (accessed 2026-11-20)
- Use in dive: section 28, the storage boxes of the cluster drawing: S3 (datasets in, checkpoints out), FSx for Lustre (shared fast file system), local NVMe (scratch, F10-424).

**F10-464. EFA on EKS in one line each. With device plugins, the EFA device plugin advertises interfaces as the extended resource `vpc.amazonaws.com/efa`; the accelerated AL2023 and Bottlerocket images carry only the minimal EFA kernel module and `rdma-core`, and the plugin is installed separately. With DRA, the EFA driver (DRANET, v1.5.0 of 3 October 2026) pairs each EFA interface with the GPU on the same PCIe root; an EFA device goes to one pod at a time. In Auto Mode both are built in, and EFA nodes must sit in a private subnet because a node with several interfaces gets no public IP address.**
- Location: Amazon EKS User Guide, "Manage hardware devices on Amazon EKS"; accelerated AMIs page
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/device-management.html | Tier 1, first-party docs | documentation of support | "The EFA device plugin discovers all available EFA devices on each node and advertises EFA devices as `vpc.amazonaws.com/efa` extended resources." and "EFA devices are allocated to one Pod at a time and cannot be shared between Pods." and "In a public subnet the node joins the cluster but cannot pull images. Run EFA workloads on private subnets with a NAT gateway, or on subnets with the AWS PrivateLink endpoints your workloads need." ; https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html | "When using Amazon Elastic Fabric Adapter (EFA) with the EKS-optimized AL2023 or Bottlerocket NVIDIA AMIs, you must install the EFA device plugin separately." ; GitHub API release list for kubernetes-sigs/dranet: "v1.5.0 2026-10-03" (accessed 2026-11-20)
- Use in dive: section 28, the network line for workload 15; with F10-426 (placement group and `efa-only` interfaces).

**F10-465. Control-plane limits. By default an EKS control plane scales by itself (Standard mode). Provisioned Control Plane lets an administrator fix a tier, XL, 2XL, 4XL or 8XL. On EKS v1.34 and later the tiers give 2000, 4000, 8000 and 16000 API request concurrency seats, pod scheduling rates of 167, 283, 400 and 400 pods per second, and a cluster database of 16, 16, 24 and 24 GB. Each tier is billed per hour on top of the cluster charge (the pricing page prints the rates). The node ceiling per cluster stays the 100,000 announced in July 2025 (F09-53).**
- Location: Amazon EKS User Guide, "Amazon EKS Provisioned Control Plane", "Control Plane Scaling Tiers"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/eks-provisioned-control-plane.html | Tier 1, first-party docs | documentation of a limit | "EKS Provisioned Control Plane offers scaling tiers named using t-shirt sizes (XL, 2XL, 4XL, and 8XL)." and "| XL | 2000 | 167 | 16 | 99.99% |" and "| 8XL | 16000 | 400 | 24 | 99.99% |" and "By default, Amazon EKS clusters use **Standard mode**, where the control plane automatically scales up and down based on your workload demands." and "**Pod scheduling rate** indicates how quickly the default Kubernetes scheduler can schedule pods on nodes, measured in pods per second." (accessed 2026-11-20)
- Use in dive: section 28, limits. For a simulation fan-out the number to read is the pod scheduling rate: 167 pods per second on the smallest provisioned tier `[our reading]`. A pods-per-node limit was not found on the pages read (U10c-4).

**F10-466. EKS Hybrid Nodes in one sentence for this dive: on-premises or edge machines join an EKS cluster as nodes while AWS runs the control plane (F09-52 and register 09 wave 3 hold the limits). The Hybrid Nodes overview and add-ons pages fetched today contain no statement about GPUs, and the Mountpoint for S3 CSI driver does not run on hybrid nodes.**
- Location: Amazon EKS User Guide, "Amazon EKS Hybrid Nodes overview"; "Configure add-ons for hybrid nodes"; S3 CSI page
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/s3-csi.html | Tier 1, first-party docs | documentation of a limit | "+ The Mountpoint for Amazon S3 CSI driver isn't presently compatible with Amazon EKS Hybrid Nodes." ; text search of https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-overview.html and https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-add-ons.html for "gpu" and "nvidia": 0 matches (accessed 2026-11-20)
- Use in dive: section 28, hand-off to the edge; GPU status on hybrid nodes is UNKNOWN from these pages (U10c-5).

**F10-467. On self-managed Karpenter v1.15.0 and later the wait before repair on an unhealthy GPU condition depends on the reason. A reason that matches an XID repair policy waits 10 minutes. A `DCGMError` or `DCGMHealthCode[Code]` reason "is replaced: after 10 minutes on EKS Auto Mode, and after 30 minutes on Karpenter `v1.15.0` and later". The 5 or 10 minutes of F10-462 is a separate timer: the termination grace period once repair has started.**
- Location: Amazon EKS User Guide, node monitoring agent page and "Automatically repair nodes in EKS clusters"
- Verdict: NEW (added from the wave 5 refutation, correction E3)
- Evidence: https://docs.aws.amazon.com/eks/latest/userguide/node-health-nma.html | Tier 1, first-party docs | definition | "is replaced: after 10 minutes on EKS Auto Mode, and after 30 minutes on Karpenter `v1.15.0` and later" ; https://docs.aws.amazon.com/eks/latest/userguide/node-repair.html | Tier 1, first-party docs | definition | "Any other condition or reason, including an `AcceleratedHardwareReady` reason that fell through to the 30-minute wait | 10m" (quotes as read by the refuter, accessed 2026-11-20)
- Use in dive: section 28, node auto repair: two timers, wait then grace period.

### B1. EC2 Spot: the interruption notice and the rebalance recommendation

A Spot Instance is spare EC2 capacity sold at a discount; EC2 can take it back. Two signals precede that: the interruption notice (two minutes before) and, sometimes earlier, the rebalance recommendation.

**F10-520. The Spot Instance interruption notice is "a warning that is issued two minutes before Amazon EC2 stops or terminates your Spot Instance", sent on a best-effort basis in two places: an EventBridge event with `detail-type` "EC2 Spot Instance Interruption Warning" and `source` "aws.ec2", and an item in the instance's metadata. The event's `detail` carries the `instance-id` and the `instance-action`, whose values are `hibernate`, `stop` or `terminate`. With hibernation there is no two-minute warning: hibernation begins at once.**
- Location: Amazon EC2 User Guide, "Spot Instance interruption notices"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html | Tier 1, first-party docs | definition | "A *Spot Instance interruption notice* is a warning that is issued two minutes before Amazon EC2 stops or terminates your Spot Instance. If you specify hibernation as the interruption behavior, you receive an interruption notice, but you do not receive a two-minute warning because the hibernation process begins immediately." and "The interruption notices are made available as an EventBridge event and as items in the [instance metadata](ec2-instance-metadata.md) on the Spot Instance. Interruption notices are emitted on a best effort basis." and the event "{ \"version\": \"0\", \"id\": \"{{12345678-1234-1234-1234-123456789012}}\", \"detail-type\": \"EC2 Spot Instance Interruption Warning\", \"source\": \"aws.ec2\", \"account\": \"{{123456789012}}\", \"time\": \"{{yyyy}}-{{mm}}-{{dd}}T{{hh}}:{{mm}}:{{ss}}Z\", \"region\": \"{{us-east-2}}\", \"resources\": [\"arn:aws:ec2:{{us-east-2a}}:instance/{{i-1234567890abcdef0}}\"], \"detail\": { \"instance-id\": \"{{i-1234567890abcdef0}}\", \"instance-action\": \"{{action}}\" } }" (accessed 2026-11-20)
- Use in dive: section 24 overview and every orchestrator section: the exact event the animation's "Spot notice" step shows (JSON in section 5). Goes deeper than F09-95.

**F10-521. Inside the instance, the notice is the metadata item `spot/instance-action` (`http://169.254.169.254/latest/meta-data/spot/instance-action`, read with an IMDSv2 token). It returns HTTP 404 until the instance is marked, then a JSON object with the action and the approximate UTC time it will happen, for example `{"action": "terminate", "time": "2017-09-18T08:22:00Z"}`. AWS recommends checking it every 5 seconds. An older item, `spot/termination-time`, is kept for backward compatibility.**
- Location: Amazon EC2 User Guide, "Spot Instance interruption notices", "instance-action" and "termination-time"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html | Tier 1, first-party docs | definition | "We recommend that you check for these interruption notices every 5 seconds." and "The `instance-action` item specifies the action and the approximate time, in UTC, when the action will occur." and "{\"action\": \"terminate\", \"time\": \"2017-09-18T08:22:00Z\"}" and "TOKEN=`curl -X PUT \"http://169.254.169.254/latest/api/token\" -H \"X-aws-ec2-metadata-token-ttl-seconds: 21600\"` \ && curl -H \"X-aws-ec2-metadata-token: $TOKEN\" http://169.254.169.254/latest/meta-data/spot/instance-action" and "you receive an HTTP 404 error when you try to retrieve it" and "This item is maintained for backward compatibility; you should use `instance-action` instead." (accessed 2026-11-20)
- Use in dive: section 24, the in-instance poll a training loop can use when no orchestrator relays the event; 5 seconds is AWS's polling interval. In EKS Auto Mode a pod reaches the metadata service only with `hostNetwork: true` (F10-434), so there the signal to use is the pod's SIGTERM `[our reading]`.

**F10-522. The warning is not guaranteed. The EC2 guide: "it is possible that your Spot Instance is interrupted before the warnings can be made available", and tells users to test for an unannounced interruption. The HyperPod guide says the same in stronger words: the two-minute notice comes "in most cases, but this notice is not guaranteed. In some situations, EC2 may terminate Spot Instances immediately without any advance warning."**
- Location: Amazon EC2 User Guide, "Prepare for Spot Instance interruptions"; Amazon SageMaker AI Developer Guide, "Spot instances in Amazon SageMaker HyperPod"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/prepare-for-interruptions.html | Tier 1, first-party docs | documentation of a limit | "While we make every effort to provide these warnings as soon as possible, it is possible that your Spot Instance is interrupted before the warnings can be made available. Test your application to ensure that it handles an unexpected instance interruption gracefully, even if you are monitoring for rebalance recommendation signals and interruption notices." ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-spot.html | Tier 1, first-party docs | documentation of a limit | "Spot Instances can be reclaimed at any time. EC2 provides a best-effort 2-minute interruption notice in most cases, but this notice is not guaranteed. In some situations, EC2 may terminate Spot Instances immediately without any advance warning." (accessed 2026-11-20)
- Use in dive: section 24, why the checkpoint must be periodic and not only written on the notice.

**F10-523. An EC2 instance rebalance recommendation is "a signal that notifies you when a Spot Instance is at elevated risk of interruption". It "can arrive sooner than" the two-minute notice, and it can also arrive together with it: EC2 cannot always send it earlier. It appears as an EventBridge event with `detail-type` "EC2 Instance Rebalance Recommendation" (the `detail` holds only the `instance-id`) and as the metadata item `events/recommendations/rebalance`, which gives the time the signal was emitted. AWS recommends polling it every 5 seconds.**
- Location: Amazon EC2 User Guide, "EC2 instance rebalance recommendations"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/rebalance-recommendations.html | Tier 1, first-party docs | definition | "An EC2 instance *rebalance recommendation* is a signal that notifies you when a Spot Instance is at elevated risk of interruption. The signal can arrive sooner than the [two-minute Spot Instance interruption notice](spot-instance-termination-notices.md), giving you the opportunity to proactively manage the Spot Instance." and "It is not always possible for Amazon EC2 to send the rebalance recommendation signal before the two-minute Spot Instance interruption notice. Therefore, the rebalance recommendation signal can arrive along with the two-minute interruption notice." and "The instance metadata category `events/recommendations/rebalance` provides the approximate time, in UTC, when the rebalance recommendation signal was emitted for a Spot Instance." and "We recommend that you check for rebalance recommendation signals every 5 seconds" and the event "{ \"version\": \"0\", \"id\": \"{{12345678-1234-1234-1234-123456789012}}\", \"detail-type\": \"EC2 Instance Rebalance Recommendation\", \"source\": \"aws.ec2\", \"account\": \"{{123456789012}}\", \"time\": \"{{yyyy}}-{{mm}}-{{dd}}T{{hh}}:{{mm}}:{{ss}}Z\", \"region\": \"{{us-east-2}}\", \"resources\": [\"arn:aws:ec2:{{us-east-2}}:{{123456789012}}:instance/{{i-1234567890abcdef0}}\"], \"detail\": { \"instance-id\": \"{{i-1234567890abcdef0}}\" } }" (accessed 2026-11-20)
- Use in dive: section 24, the optional early step of the Spot animation, drawn as "may arrive earlier, no fixed lead time".

**F10-524. Capacity Rebalancing is the EC2 Fleet, Spot Fleet and Auto Scaling feature that acts on the rebalance recommendation: it launches a replacement Spot Instance before the at-risk one is interrupted. It works only for fleets of type `maintain`. With the `launch-before-terminate` replacement strategy, EC2 terminates the old instance after a `termination-delay` of 120 seconds at least and 7200 seconds at most, and EC2 may still interrupt the old instance with a two-minute warning before the delay ends. AWS advises against combining it with `lowest-price`.**
- Location: Amazon EC2 User Guide, "Use Capacity Rebalancing in EC2 Fleet and Spot Fleet to replace at-risk Spot Instances"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-capacity-rebalance.html | Tier 1, first-party docs | definition | "Capacity Rebalancing helps you maintain workload availability by proactively augmenting your fleet with new Spot Instances before running instances are interrupted by Amazon EC2." and "+ Capacity Rebalancing is available only for fleets of type `maintain`." and "For `termination-delay`, the minimum is 120 seconds (2 minutes), and the maximum is 7200 seconds (2 hours)." and "Note that Amazon EC2 can interrupt the old instances with a two-minute warning before the `termination-delay`." and "We strongly recommend against using the `lowest-price` (EC2 Fleet) or `lowestPrice` (Spot Fleet) allocation strategy in combination with `launch-before-terminate`" (accessed 2026-11-20)
- Use in dive: section 24. Karpenter does not use it (F10-419); it belongs to Auto Scaling groups and fleets, which is where Batch and PCS sit `[our reading]`.

**F10-525. What EC2 does to an interrupted Spot Instance is the interruption behaviour chosen in the request: terminate (the default), stop or hibernate. Stop needs a `persistent` Spot request (or a fleet of type `maintain`); only EC2 can restart the instance, and it does so when capacity returns in the same Availability Zone for the same instance type. While stopped, only the EBS volumes are charged, and they are preserved. Data on instance store volumes is lost when the instance is stopped or terminated.**
- Location: Amazon EC2 User Guide, "Behavior of Spot Instance interruptions"; "Prepare for Spot Instance interruptions"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/interruption-behavior.html | Tier 1, first-party docs | definition | "The default behavior is that Amazon EC2 terminates Spot Instances when they are interrupted." and "The Spot Instance request type must be `persistent`." and "+ Only Amazon EC2 can restart an interrupted stopped Spot Instance." and "Amazon EC2 restarts the stopped instance when capacity is available in the same Availability Zone and for the same instance type as the stopped instance" and "+ While an interrupted Spot Instance is stopped, you are charged only for the EBS volumes, which are preserved." ; https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/prepare-for-interruptions.html | "+ Data on instance store volumes is lost when the instance is stopped or terminated. Back up any important data on instance store volumes to a more persistent storage, such as Amazon S3, Amazon EBS, or Amazon DynamoDB." (accessed 2026-11-20)
- Use in dive: section 24, what survives a reclaim: nothing on local NVMe, and under the default behaviour nothing on the node at all; the checkpoint goes to S3 or a shared file system. Kubernetes and Batch fleets use terminate `[our reading]`.

**F10-526. EC2 lists three reasons for an interruption: capacity (EC2 needs the instance back, mainly to repurpose capacity, also for host maintenance or hardware decommission), price (the Spot price rose above a maximum price the user set) and constraints (a launch group or Availability Zone group can no longer be met). Setting a maximum price makes interruptions more frequent: "your instances will be interrupted more frequently than if you do not specify it".**
- Location: Amazon EC2 User Guide, "Spot Instance interruptions"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-interruptions.html | Tier 1, first-party docs | definition | "Amazon EC2 can interrupt your Spot Instance when it needs it back. EC2 reclaims your instance mainly to repurpose capacity, but it can also occur for other reasons such as host maintenance or hardware decommission." and "You can specify the maximum price in your Spot request. However, if you specify a maximum price, your instances will be interrupted more frequently than if you do not specify it." (accessed 2026-11-20)
- Use in dive: section 24, recommended configuration: do not set a maximum Spot price.

### B2. EC2 Spot: allocation strategies, flexibility, placement score, quotas

**F10-527. EC2 Fleet's Spot allocation strategies, in the guide's order. Price capacity optimized, marked "(recommended)": pick the pools with the highest capacity availability for the number of instances launching, then the lowest priced of those. Capacity optimized: the most available pools only; the guide names "long Continuous Integration (CI), image and media rendering, Deep Learning, and High Performance Compute (HPC)" as workloads with a higher cost of interruption that it suits. Capacity optimized prioritized: the same, honouring a user's instance-type priorities on a best-effort basis. Diversified: spread across all pools. Lowest price, marked "(not recommended)": it has "the highest risk of interruption", and it is the default in the AWS CLI.**
- Location: Amazon EC2 User Guide, "Use allocation strategies to determine how EC2 Fleet or Spot Fleet fulfills Spot and On-Demand capacity", "Allocation strategies for Spot Instances"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-allocation-strategy.html | Tier 1, first-party docs | definition | "**Price capacity optimized** (recommended) The fleet identifies the pools with the highest capacity availability for the number of instances that are launching. This means that Spot Instances are requested from the pools that are most likely to have the lowest chance of interruption in the near term. The fleet then requests Spot Instances from the lowest priced of these pools." and "This works well for workloads that may have a higher cost of interruption associated with restarting work, such as long Continuous Integration (CI), image and media rendering, Deep Learning, and High Performance Compute (HPC) workloads" and "**Diversified** The Spot Instances are distributed across all Spot capacity pools." and "**Lowest price** (not recommended) We don't recommend the **lowest price** allocation strategy because it has the highest risk of interruption for your Spot Instances." and "When using the AWS CLI, this is the default strategy. However, we recommend that you override the default by specifying the **price capacity optimized** allocation strategy." (accessed 2026-11-20)
- Use in dive: section 24, the allocation-strategy table that sections 25 to 28 refer to.

**F10-528. Which strategy AWS recommends, in its words: "We recommend using the `price-capacity-optimized` strategy because this strategy automatically provisions instances from the most-available Spot capacity pools that also have the lowest possible price." For work that is costly to restart the guide's answer is checkpointing first: "By using checkpointing, you make the **price capacity optimized** allocation strategy a good fit for these workloads". Capacity optimized is the option when instance types are similarly priced or "the cost of interruption is so significant that any cost saving is inadequate in comparison to a marginal increase in interruptions".**
- Location: Amazon EC2 User Guide, "Best practices for Amazon EC2 Spot"; allocation strategies page, "Choose the appropriate Spot allocation strategy"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-best-practices.html | Tier 1, first-party docs | definition | "We recommend using the `price-capacity-optimized` strategy because this strategy automatically provisions instances from the most-available Spot capacity pools that also have the lowest possible price." ; https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-allocation-strategy.html | Tier 1, first-party docs | definition | "If your fleet runs workloads that might have a higher cost of interruption associated with restarting work, then you should implement checkpointing so that applications can restart from that point if they're interrupted. By using checkpointing, you make the **price capacity optimized** allocation strategy a good fit for these workloads because it allocates capacity from the lowest priced pools that also offer a low Spot Instance interruption rate." and "You can optionally use the **capacity optimized** strategy if you run workloads that either use similarly priced instance types, or where the cost of interruption is so significant that any cost saving is inadequate in comparison to a marginal increase in interruptions." (accessed 2026-11-20)
- Use in dive: section 24, "the best configuration for Spot" in AWS's words. Karpenter applies this strategy itself (F10-403); Batch names its equivalents `SPOT_PRICE_CAPACITY_OPTIMIZED` and `SPOT_CAPACITY_OPTIMIZED` (F10-537).

**F10-529. The Spot best-practices page, end to end, has seven practices: prepare individual instances for interruptions (an EventBridge rule on both signals that triggers a checkpoint); be flexible about instance types and Availability Zones ("at least 10 instance types for each workload", all zones); use attribute-based instance type selection; use Spot placement scores; use Auto Scaling groups or EC2 Fleet for aggregate capacity; use the price and capacity optimized strategy; use integrated AWS services. A Spot capacity pool is one instance type in one Availability Zone.**
- Location: Amazon EC2 User Guide, "Best practices for Amazon EC2 Spot"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-best-practices.html | Tier 1, first-party docs | definition | "We recommend that you create a rule in [Amazon EventBridge](https://docs.aws.amazon.com/eventbridge/index.html) that captures the rebalance recommendations and interruption notifications, and then triggers a checkpoint for the progress of your workload or gracefully handles the interruption." and "A Spot capacity pool is a set of unused EC2 instances with the same instance type (for example, `m5.large`) and Availability Zone (for example, us-east-1a)." and "A good rule of thumb is to be flexible across at least 10 instance types for each workload. In addition, make sure that all Availability Zones are configured for use in your VPC and selected for your workload." and "If you can only scale horizontally, you should include older generation instance types because they are less in demand from On-Demand customers." (accessed 2026-11-20)
- Use in dive: section 24, the Spot checklist. Goes deeper than F09-95, which quotes only the 10-type rule.

**F10-530. What Spot does not promise, from the same page: not that an instance runs long enough to finish, not immediate availability, not the full capacity asked for. AWS "strongly discourage[s]" Spot for inflexible, stateful, fault-intolerant or tightly coupled work, and also discourages "attempting to fail over to On-Demand Instances to handle interruptions": failing over "can inadvertently drive interruptions for your other Spot Instances", and after an interruption of one instance type in one zone the same combination can be hard to get On-Demand.**
- Location: Amazon EC2 User Guide, "Best practices for Amazon EC2 Spot", introduction
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-best-practices.html | Tier 1, first-party docs | documentation of a limit | "However, Spot does not guarantee that you can keep your running instances long enough to finish your workloads. Spot also does not guarantee that you can get immediate availability of the instances that you are looking for, or that you can always get the aggregate capacity that you requested." and "We strongly discourage using Spot Instances for these workloads or attempting to fail over to On-Demand Instances to handle interruptions or periods of unavailability. Failing over to On-Demand Instances can inadvertently drive interruptions for your other Spot Instances. In addition if Spot Instances for a combination of instance type and Availability Zone get interrupted, it might become difficult for you to get On-Demand Instances with that same combination." (accessed 2026-11-20)
- Use in dive: section 24, the caveat beside every "Spot with On-Demand fallback" snippet. It sits in tension with the fallback patterns that Karpenter (F10-402), HyperPod (F10-540) and the Batch guide (F10-537) document; see section 10.

**F10-531. Attribute-based instance type selection lets a fleet or Auto Scaling group name attributes in place of instance types, and it picks up newly released types by itself. The accelerator attributes in the `InstanceRequirements` structure are `AcceleratorTypes` (for example `gpu`), `AcceleratorCount`, `AcceleratorManufacturers` (for example `nvidia`), `AcceleratorNames` (for example `a100`) and `AcceleratorTotalMemoryMiB`. Price protection is on by default and excludes types far above the cheapest match. Karpenter does not accept attribute-based requests ("Attribute-based requests are currently not possible"); its instance labels play that part.**
- Location: Amazon EC2 User Guide, "Specify attributes for instance type selection for EC2 Fleet or Spot Fleet"; Spot best practices; Karpenter FAQ
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-attribute-based-instance-type-selection.html | Tier 1, first-party docs | definition | "\"AcceleratorTypes\": [ \"gpu\" ], \"AcceleratorCount\": { \"Min\": 0, \"Max\": 0 }, \"AcceleratorManufacturers\": [ \"nvidia\" ], \"AcceleratorNames\": [ \"a100\" ], \"AcceleratorTotalMemoryMiB\": { \"Min\": 0, \"Max\": 0 }," and "When you create a fleet with attribute-based instance type selection, price protection is enabled by default." ; https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-best-practices.html | "Moreover, attribute-based instance type selection enables you to automatically use newly released instance types as they become available." ; https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/faq.md | Tier 1, project docs at tag v1.15.3 | documentation of a limit | "* Attribute-based requests are currently not possible. * You can select instances with special hardware, such as gpu." (accessed 2026-11-20)
- Use in dive: section 24, how to stay flexible across GPU types without listing them; the hand-off note for section 28.

**F10-532. A Spot placement score is a number from 1 to 10 per Region or Availability Zone that says how likely a Spot request of a given size and set of instance types is to succeed there; 10 means "highly likely to succeed". It is a point-in-time recommendation and "does not guarantee available capacity or predict the risk of interruption". Limits: a target capacity ceiling based on recent Spot usage; a cap on new request configurations per 24 hours; at least three instance types per request, a minimum that "doesn't apply to instance types in the P, G, Trn, and Inf families". It costs nothing, and since 13 August 2026 it can include Local Zones.**
- Location: Amazon EC2 User Guide, "Spot placement score"; Spot best practices; What's New, 13 August 2026
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-placement-score.html | Tier 1, first-party docs | definition | "A Spot placement score indicates how likely it is that a Spot request will succeed in a Region or Availability Zone." and "This minimum doesn't apply to instance types in the P, G, Trn, and Inf families." and "There is no additional charge for using the Spot placement score feature." ; https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-best-practices.html | "In return, you receive a score ranging from 1 to 10 for each Region or Availability Zone, indicating the likelihood of successfully provisioning your requested Spot capacity in that location. A score of 10 indicates that your Spot request is highly likely to succeed." and "It does not guarantee available capacity or predict the risk of interruption." ; https://aws.amazon.com/about-aws/whats-new/2026/08/spot-placement-score-local-zones/ | Tier 2, launch announcement | "Posted on: Aug 13, 2026 Today, AWS announces support for AWS Local Zones in Spot placement score" (accessed 2026-11-20)
- Use in dive: section 24, the pre-flight check for a GPU Spot fleet: query the score for the G types the job accepts, per zone, before choosing a Region. It is queried in the EC2 console, the CLI or an SDK.

**F10-533. Spot quotas are counted in vCPUs, per account and Region, by family group. The two that gate a GPU fleet are named "All G and VT Spot Instance Requests" and "All P Spot Instance Requests"; the page prints a default of 0 for both (and 5 for the Standard group), all adjustable. A new account therefore cannot launch one GPU Spot instance until the quota is raised. EC2 adjusts the quotas with usage.**
- Location: Amazon EC2 User Guide, "Spot Instance quotas"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-limits.html | Tier 1, first-party docs | documentation of a limit | "Spot Instance quotas are managed in terms of the *number of virtual central processing units (vCPUs)* that your running Spot Instances are either using or will use pending the fulfillment of open Spot Instance requests." and "| All G and VT Spot Instance Requests | 0 | [Yes](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-3819A6DF) |" and "| All P Spot Instance Requests | 0 | [Yes](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-7212CCBC) |" and "Even though Amazon EC2 automatically adjusts your Spot Instance quotas based on your usage, you can request a quota increase if necessary." (accessed 2026-11-20)
- Use in dive: section 24, the first step of any GPU Spot setup; the reason a NodePool can sit with pending pods and no error from Karpenter other than a launch failure `[our reading]`.

**F10-534. The EKS best-practices guide applies these rules to GPUs. GPU workloads have "fewer options available compared to CPUs", so the first step is to test which instance types the workload can run on; then diversify across G families of generation 4 or higher, sizes and all Availability Zones, bounded by GPU memory; use the Spot placement score when the job can move between Regions. Its list of Spot-suited ML work: hyper-parameter tuning, data augmentation, fine-tuning with checkpoints, batch inference, and "opportunistic" training of small models; it says Spot is "not recommended for production-scale training". For G instances: "being able to diverse across different instance types, sizes, and availability zones is key to being able to stay on Spot for longer."**
- Location: EKS Best Practices Guide, AI/ML Compute, "Consider using Amazon EC2 Spot Instances for GPUs with Karpenter" and "Consider On-Demand, Amazon EC2 Spot or On-Demand Capacity Reservations (ODCRs) for G Amazon EC2 instances"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html | Tier 1, first-party docs | definition | "GPU workloads might be constrained by the instance types they can use, with fewer options available compared to CPUs. As a first step, assess if your workload is instance flexible." and "To avoid this issue, allow broader g-series instances (generation 4 or higher) from NVIDIA across sizes and Availability Zones (AZs), while considering hardware needs like GPU memory or Ray Tracing." and "+ **Fine-tuning models**: Use Spot instances for fine-tuning with robust checkpointing mechanisms to resume from the last saved state, minimizing the impact of instance interruptions." and "though not recommended for production-scale training due to potential disruptions" and "When using Amazon EC2 Spot Instances, being able to diverse across different instance types, sizes, and availability zones is key to being able to stay on Spot for longer." (accessed 2026-11-20)
- Use in dive: sections 24 and 28, AWS's GPU-specific Spot advice; the basis for which of the fifteen workloads go on Spot.

### B3. Checkpointing guidance and what the Spot Instance Advisor file lists

**F10-535. Checkpoint interval and job length advice on first-party pages. EKS best-practices guide: checkpoint when a job runs longer than "a few hours" (its example: more than 1 to 2 hours for small models); for large models use tiers, "fast local every 5-30 minutes for transients, durable hourly for major failures"; save to S3 through the Mountpoint CSI driver; raise the pod's `terminationGracePeriodSeconds` (default 30 seconds) and handle SIGTERM or a preStop hook. AWS Batch guide: on Spot, "We advise against running jobs that take an hour or more"; split or checkpoint into parts of "30 minutes or less".**
- Location: EKS Best Practices Guide, AI/ML Compute, "Implement Checkpointing for Long Running Training Jobs"; AWS Batch User Guide, "Use Amazon EC2 Spot best practices for AWS Batch"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html | Tier 1, first-party docs | definition | "+ **Job duration exceeds a few hours**: For long-running training jobs (e.g., >1-2 hours for small models, or days/weeks for large foundation models with billions of parameters), where progress loss from interruptions is costly. Shorter jobs may not justify the I/O overhead." and "tiered approaches (fast local every 5-30 minutes for transients, durable hourly for major failures) optimize recovery time vs. efficiency" and "extend the terminationGracePeriodSeconds (default is 30 seconds) in Pod specifications to allow more time for graceful shutdown, and handle interruptions using preStop lifecycle hooks and/or SIGTERM signals within your application" ; https://docs.aws.amazon.com/batch/latest/userguide/bestpractice6.html | Tier 1, first-party docs | definition | "+ **Reduce job runtime or checkpoint** - We advise against running jobs that take an hour or more when using Amazon EC2 Spot instances to avoid interruptions. If you divide or checkpoint your jobs into smaller parts that consist of 30 minutes or less, you can significantly reduce the possibility of interruptions." (accessed 2026-11-20)
- Use in dive: sections 24, 25 and 28, the checkpoint interval line of every recommended configuration. No page states one interval for all cases (U10c-6).

**F10-536. SageMaker managed Spot training: set `EnableManagedSpotTraining` to `True` and a `MaxWaitTimeInSeconds` larger than `MaxRuntimeInSeconds`. SageMaker copies checkpoint data from a local path to S3 and back on restart, so the job resumes from the last checkpoint. "Unless your training job will complete quickly, we recommend you use checkpointing with managed spot training." It "does not fall back to on-demand instances": with no Spot capacity the job waits until the maximum wait time and then stops. Intervals lost to an interruption within their first hour are not billed.**
- Location: Amazon SageMaker AI Developer Guide, "Managed Spot Training in Amazon SageMaker AI"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/model-managed-spot-training.html | Tier 1, first-party docs | definition | "SageMaker AI copies checkpoint data from a local path to Amazon S3. When the job is restarted, SageMaker AI copies the data from Amazon S3 back into the local path. The training job can then resume from the last checkpoint instead of restarting." and "Unless your training job will complete quickly, we recommend you use checkpointing with managed spot training." and "Set `EnableManagedSpotTraining` to `True` and specify the `MaxWaitTimeInSeconds`. `MaxWaitTimeInSeconds` must be larger than `MaxRuntimeInSeconds`." and "Managed spot training does not fall back to on-demand instances." and "excludes intervals that were lost to a Spot interruption within their first hour of runtime" (accessed 2026-11-20)
- Use in dive: section 24 overview, the managed alternative for workload 8 (per-task fine-tune) when the reader wants Spot with no cluster.

**F10-537. AWS Batch on Spot, from its best-practices pages. Choose Spot when "The runtime for your jobs is typically 30 minutes or less" or long jobs can restart from a checkpoint; choose On-Demand when jobs run more than an hour and cannot be interrupted. Use the `SPOT_CAPACITY_OPTIMIZED` allocation strategy "If you're concerned about interruptions", diversify sizes and families, and set automated retries: up to 10 are allowed, "we recommend that you set at least 1-3", and a retried job "is placed at the front of the job queue". The documented fallback is a Spot queue first and a resubmission to an On-Demand queue on a reclaim event.**
- Location: AWS Batch User Guide, "Amazon EC2 On-Demand or Amazon EC2 Spot" and "Use Amazon EC2 Spot best practices for AWS Batch"
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/batch/latest/userguide/bestpractice6.html | Tier 1, first-party docs | definition | "+ **Choose the `SPOT_CAPACITY_OPTIMIZED` allocation strategy** - AWS Batch chooses Amazon EC2 instances from the deepest Amazon EC2 Spot capacity pools. If you're concerned about interruptions, this is a suitable choice." and "You can set up to 10 automated retries. For a start, we recommend that you set at least 1-3 automated retries." and "For AWS Batch, if you set the retry parameter, the job is placed at the front of the job queue." and "$ aws batch submit-job --job-name MyJob \ --job-queue MyJQ \ --job-definition MyJD \ --retry-strategy attempts=2" ; https://docs.aws.amazon.com/batch/latest/userguide/bestpractice5.html | Tier 1, first-party docs | definition | "+ The runtime for your jobs is typically 30 minutes or less." and "+ The runtime of your jobs is more than an hour, and you can't tolerate interruptions to your workload." and "If a job gets interrupted, catch the event from Amazon EventBridge and correlate it to a Spot instance reclamation. Then, resubmit the job to an On-Demand queue using an AWS Lambda function or AWS Step Functions." (accessed 2026-11-20)
- Use in dive: section 25 AWS Batch (cross-check with the Batch register) and the Spot comparison in section 24.

**F10-538. The Spot Instance Advisor data file fetched today has `Last-Modified` 20 March 2026 (eight months old) and five interruption-frequency bands: "<5%", "5-10%", "10-15%", "15-20%" and ">20%". For Linux it lists these G and P families: g4ad, g4dn, g5, g5g, g6, g6e, g6f, g7e, gr6, gr6f, p3, p3dn, p4d, p4de, p5, p5en, p6-b200, p6-b300. It has no rows for g7, p5e, p6e-gb200 or p6e-gb300.**
- Location: Spot Instance Advisor public data file (`spot-advisor-data.json`), keys `ranges` and `spot_advisor`
- Verdict: NEW
- Evidence: https://spot-bid-advisor.s3.amazonaws.com/spot-advisor-data.json | Tier 1, first-party data file | documentation of support | response header "Last-Modified: Fri, 20 Mar 2026 23:38:55 GMT", "Content-Length: 1190579"; the `ranges` list holds the labels "<5%", "5-10%", "10-15%", "15-20%", ">20%" for index 0 to 4; family list computed by us from the instance-type keys under `spot_advisor.<region>.Linux` whose family starts with g, gr or p plus a digit (accessed 2026-11-20)
- Use in dive: section 24, which GPU families have Spot interruption data at all. Confirms F09-96 (same file, same date) and adds the full family list.

**F10-539. `[derived]` Bands per family in that file, counting one row per instance size and Region (Linux). All Regions: g5, 136 rows in 17 Regions, 70 in ">20%" and 44 in "<5%"; g6, 136 rows in 17 Regions, 57 in ">20%"; g6e, 72 rows in 9 Regions, 41 in ">20%" and 8 in "<5%"; g7e, 36 rows in 6 Regions, 4 in ">20%" and 9 in "<5%"; g4dn, 147 rows in 21 Regions, 76 in ">20%"; p5, 20 rows in 12 Regions, 17 in "<5%"; p5en, 10 rows in 10 Regions, 8 in "<5%"; p6-b200, 3 rows in 3 Regions, none in "<5%"; p6-b300, 1 row; p3, 33 rows in 11 Regions, all ">20%". US West (Oregon): g5, all 8 sizes ">20%"; g6e, 5 of 8 ">20%". US East (Ohio): g6e, no size above "15-20%" (4 in "5-10%", 2 in "10-15%", 2 in "15-20%"); g7e, 4 of 6 in "<5%".**
- Location: synthesis of F10-538
- Verdict: NEW
- Evidence: F10-538 | counts computed by us from the `r` value (band index) of every Linux row; inputs: g5 {0: 44, 1: 6, 2: 7, 3: 9, 4: 70}; g6 {0: 27, 1: 15, 2: 24, 3: 13, 4: 57}; g6e {0: 8, 1: 6, 2: 9, 3: 8, 4: 41}; g7e {0: 9, 1: 8, 2: 6, 3: 9, 4: 4}; g4dn {0: 23, 1: 13, 2: 15, 3: 20, 4: 76}; p5 {0: 17, 1: 1, 2: 1, 4: 1}; p5en {0: 8, 1: 2}; p6-b200 {1: 1, 2: 2}; p6-b300 {0: 1}; p3 {4: 33}; us-west-2 g5 {4: 8}, g6e {0: 1, 2: 2, 4: 5}; us-east-2 g6e {1: 4, 2: 2, 3: 2}, g7e {0: 4, 1: 1, 3: 1} (accessed 2026-11-20)
- Use in dive: section 24, the picture behind "diversify": in the March 2026 file the common G sizes sit mostly in the highest band, and the band differs by Region for the same family. The file says nothing about whether a Spot request is fulfilled (a "<5%" row for p5 is interruption frequency of instances that ran, not availability) `[our reading]`.

**F10-540. First-party 2025 and 2026 items on GPU fleets and Spot found in the What's New feed: SageMaker HyperPod Spot Instances (24 November 2025; EKS-orchestrated clusters, with Karpenter); EFA and placement groups on EKS Auto Mode and Karpenter (22 July 2026); Spot placement score with Local Zones (13 August 2026); DRA on EKS Auto Mode and Karpenter (9 November 2026). The HyperPod guide adds that with Karpenter it can "automatically fallback to On-Demand when Spot capacity is interrupted or unavailable", that on interruption HyperPod taints the node and evicts pods within the pod's `terminationGracePeriodSeconds`, and that `consolidateAfter` should be non-zero, up to 2 minutes, to leave time for a checkpoint.**
- Location: AWS What's New, 24 November 2025 and 22 July 2026; Amazon SageMaker AI Developer Guide, "Spot instances in Amazon SageMaker HyperPod"
- Verdict: NEW
- Evidence: https://aws.amazon.com/about-aws/whats-new/2025/11/amazon-sagemaker-hyperpod-spot-instances | Tier 2, launch announcement | "Posted on: Nov 24, 2025 Amazon SageMaker HyperPod now supports Spot Instances" and "The feature is available on HyperPod EKS clusters and integrates with Karpenter for intelligent auto-scaling, automatically discovering available Spot capacity and handling instance interruptions." ; https://aws.amazon.com/about-aws/whats-new/2026/07/amazon-eks-efa-placement-groups/ | Tier 2, launch announcement | "Posted on: Jul 22, 2026 Amazon Elastic Kubernetes Service (EKS) now supports Amazon EC2 placement groups and Elastic Fabric Adapter (EFA) network device configuration for node pools on EKS Auto Mode and the open-source Karpenter project" ; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-spot.html | Tier 1, first-party docs | definition | "+ When using Karpenter for automatic scaling, you can configure HyperPod to automatically fallback to On-Demand when Spot capacity is interrupted or unavailable" and "Set it to non zero upto 2 min to allow graceful pod eviction for any checkpointing needs." (accessed 2026-11-20)
- Use in dive: section 24 currency; section 27 Amazon SageMaker HyperPod cross-reference. No 2025 or 2026 AWS blog post on simulation or rendering fleets on GPU Spot was located in this search (U10c-7).


## 5. Configuration blocks

Every block below is verbatim from the first-party page or file named above it, at the pinned tag where one applies. The one assembled configuration in this file is in section 7 and is labelled there.

Block for F10-428: https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html (verbatim, EKS Best Practices Guide, GPU Spot NodePool)

```yaml
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: gpu-inference-spot
spec:
  template:
    metadata:
      labels:
        role: gpu-spot-worker
    spec:
      requirements:
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot"] # Use Spot Instances
        - key: karpenter.k8s.aws/instance-category
          operator: In
          values: ["g", "p"] # Diversifies across G-series and P-series
        - key: karpenter.k8s.aws/instance-generation
          operator: Gt
          values: ["3"] # Selects instance generations greater than 3
        - key: kubernetes.io/arch
          operator: In
          values: ["amd64"] # Specifies AMD64 architecture, compatible with NVIDIA GPUs
        - key: karpenter.k8s.aws/instance-gpu-memory
          operator: Gt
          values: ["20480"] # Ensures more than 20GB (20480 MiB) total GPU memory
      taints:
        - key: nvidia.com/gpu
          effect: NoSchedule
      nodeClassRef:
        name: gpu-inference-ec2
        group: karpenter.k8s.aws
        kind: EC2NodeClass
      expireAfter: 720h
  limits:
    cpu: 100
    memory: 100Gi
  disruption:
    consolidationPolicy: WhenEmptyOrUnderutilized
    consolidateAfter: 5m # Enables consolidation of underutilized nodes after 5 minutes
```

Block for F10-427: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/examples/v1/spot.yaml (verbatim, Karpenter repository example at tag v1.15.3, minus the two leading comment lines)

```yaml
---
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: spot
  annotations:
    kubernetes.io/description: "NodePool for provisioning spot capacity"
spec:
  template:
    spec:
      requirements:
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot"]
        - key: kubernetes.io/arch
          operator: In
          values: ["amd64"]
        - key: kubernetes.io/os
          operator: In
          values: ["linux"]
        - key: karpenter.k8s.aws/instance-category
          operator: In
          values: ["c", "m", "r"]
        - key: karpenter.k8s.aws/instance-generation
          operator: Gt
          values: ["2"]
      nodeClassRef:
        group: karpenter.k8s.aws
        kind: EC2NodeClass
        name: default
---
apiVersion: karpenter.k8s.aws/v1
kind: EC2NodeClass
metadata:
  name: default
  annotations:
    kubernetes.io/description: "General purpose EC2NodeClass for running Amazon Linux 2 nodes"
spec:
  role: "KarpenterNodeRole-${CLUSTER_NAME}" # replace with your cluster name
  subnetSelectorTerms:
    - tags:
        karpenter.sh/discovery: "${CLUSTER_NAME}" # replace with your cluster name
  securityGroupSelectorTerms:
    - tags:
        karpenter.sh/discovery: "${CLUSTER_NAME}" # replace with your cluster name
  amiSelectorTerms:
    - alias: al2023@latest # Amazon Linux 2023
```

Block for F10-424: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/examples/v1/instance-store-ephemeral-storage.yaml (verbatim, the EC2NodeClass document of the example)

```yaml
apiVersion: karpenter.k8s.aws/v1
kind: EC2NodeClass
metadata:
  name: instance-store-ephemeral-storage
  annotations:
    kubernetes.io/description: "EC2NodeClass to provision nodes with instance-store ephemeral storage"
spec:
  instanceStorePolicy: "RAID0"
  role: "KarpenterNodeRole-${CLUSTER_NAME}" # replace with your cluster name
  subnetSelectorTerms:
    - tags:
        karpenter.sh/discovery: "${CLUSTER_NAME}" # replace with your cluster name
  securityGroupSelectorTerms:
    - tags:
        karpenter.sh/discovery: "${CLUSTER_NAME}" # replace with your cluster name
  amiSelectorTerms:
    - alias: al2023@latest  # Amazon Linux 2023
```

Block for F10-415: https://github.com/aws/karpenter-provider-aws/blob/8c91894e993eda682f0785091b79a93da68f9830/website/content/en/docs/concepts/disruption.md (verbatim, Karpenter docs at tag v1.15.3)

```yaml
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: default
spec:
  disruption:
    consolidationPolicy: WhenEmptyOrUnderutilized
    budgets:
    - nodes: "20%"
      reasons:
      - "Empty"
      - "Drifted"
    - nodes: "5"
    - nodes: "0"
      schedule: "@daily"
      duration: 10m
      reasons:
      - "Underutilized"
```

Block for F10-435: https://docs.aws.amazon.com/eks/latest/userguide/auto-cost-control.html (verbatim, EKS User Guide, Auto Mode CI runner NodePool with Spot and On-Demand)

```yaml
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: ci-runners
spec:
  template:
    spec:
      nodeClassRef:
        group: eks.amazonaws.com
        kind: NodeClass
        name: default
      requirements:
        - key: "eks.amazonaws.com/instance-category"
          operator: In
          values: ["c", "m"]
        - key: "eks.amazonaws.com/instance-cpu"
          operator: Lte
          values: ["32"]
        - key: "karpenter.sh/capacity-type"
          operator: In
          values: ["spot", "on-demand"]
  limits:
    cpu: "500"
    memory: 1000Gi
  disruption:
    consolidationPolicy: WhenEmptyOrUnderutilized
    consolidateAfter: 30s
```

Block for F10-443: https://docs.aws.amazon.com/eks/latest/userguide/device-management-nvidia-time-slicing.html (verbatim, the ConfigMap body from the AL2023 procedure, without the `cat <<EOF | kubectl apply -f -` wrapper and its indentation)

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nvidia-device-plugin-config
  namespace: nvidia
data:
  config.yaml: |
    version: v1
    sharing:
      timeSlicing:
        renameByDefault: false
        failRequestsGreaterThanOne: true
        resources:
          - name: nvidia.com/gpu
            replicas: 4
```

Block for F10-450: https://github.com/kubernetes-sigs/kueue/blob/e854ec82e404436b261c81f0341ac9de8508f97c/site/static/examples/admin/single-clusterqueue-setup.yaml (verbatim, Kueue example at tag v0.20.7)

```yaml
apiVersion: kueue.x-k8s.io/v1beta2
kind: ResourceFlavor
metadata:
  name: "default-flavor"
---
apiVersion: kueue.x-k8s.io/v1beta2
kind: ClusterQueue
metadata:
  name: "cluster-queue"
spec:
  namespaceSelector: {} # match all.
  resourceGroups:
  - coveredResources: ["cpu", "memory"]
    flavors:
    - name: "default-flavor"
      resources:
      - name: "cpu"
        nominalQuota: 9
      - name: "memory"
        nominalQuota: 36Gi
---
apiVersion: kueue.x-k8s.io/v1beta2
kind: LocalQueue
metadata:
  namespace: "default"
  name: "user-queue"
spec:
  clusterQueue: "cluster-queue"
```

Block for F10-451: https://github.com/kubernetes-sigs/kueue/blob/e854ec82e404436b261c81f0341ac9de8508f97c/site/static/examples/jobs/sample-job.yaml (verbatim, Kueue example at tag v0.20.7)

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  generateName: sample-job-
  namespace: default
  labels:
    kueue.x-k8s.io/queue-name: user-queue
spec:
  parallelism: 3
  completions: 3
  template:
    spec:
      containers:
      - name: dummy-job
        image: registry.k8s.io/e2e-test-images/agnhost:2.53
        command: [ "/bin/sh" ]
        args: [ "-c", "sleep 60" ]
        resources:
          requests:
            cpu: "1"
            memory: "200Mi"
      restartPolicy: Never
```

Block for F10-452: https://github.com/kubernetes-sigs/kueue/blob/e854ec82e404436b261c81f0341ac9de8508f97c/site/content/en/docs/concepts/cluster_queue.md (verbatim, Kueue docs at tag v0.20.7)

```yaml
apiVersion: kueue.x-k8s.io/v1beta2
kind: ClusterQueue
metadata:
  name: "team-a-cq"
spec:
  preemption:
    reclaimWithinCohort: Any
    borrowWithinCohort:
      policy: LowerPriority
      maxPriorityThreshold: 100
    withinClusterQueue: LowerPriority
```

Block for F10-454: https://github.com/kai-scheduler/KAI-Scheduler/blob/2305acfc348c9bd9cd1ab813d3feb8dfc4ab9d11/docs/quickstart/default-queues.yaml (verbatim, KAI Scheduler at tag v0.19.0, minus the licence header)

```yaml
apiVersion: scheduling.run.ai/v2
kind: Queue
metadata:
  name: default-parent-queue
spec:
  resources:
    cpu:
      limit: -1
      overQuotaWeight: 1
      quota: 0
    gpu:
      limit: -1
      overQuotaWeight: 1
      quota: 0
    memory:
      limit: -1
      overQuotaWeight: 1
      quota: 0
---
apiVersion: scheduling.run.ai/v2
kind: Queue
metadata:
  name: default-queue
spec:
  parentQueue: default-parent-queue
  resources:
    cpu:
      limit: -1
      overQuotaWeight: 1
      quota: 0
    gpu:
      limit: -1
      overQuotaWeight: 1
      quota: 0
    memory:
      limit: -1
      overQuotaWeight: 1
      quota: 0
```

Block for F10-455: https://github.com/kai-scheduler/KAI-Scheduler/blob/2305acfc348c9bd9cd1ab813d3feb8dfc4ab9d11/docs/gpu-sharing/gpu-sharing.yaml (verbatim, KAI Scheduler at tag v0.19.0, minus the licence header)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-sharing
  labels:
    kai.scheduler/queue: default-queue
  annotations:
    gpu-fraction: "0.5"
spec:
  schedulerName: kai-scheduler
  automountServiceAccountToken: false
  containers:
    - name: gpu-workload
      image: nvidia/cuda:13.0.2-base-ubi8
      command: ["nvidia-smi"]
      args: ["-L"]
      resources:
        limits:
          memory: 1Gi
```

Block for F10-454: https://github.com/kai-scheduler/KAI-Scheduler/blob/2305acfc348c9bd9cd1ab813d3feb8dfc4ab9d11/docs/batch/batch-job-min-member.yaml (verbatim, KAI Scheduler at tag v0.19.0, minus the licence header)

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: batch-job-min-member
  annotations:
    kai.scheduler/batch-min-member: "2"
spec:
  parallelism: 6
  completions: 6
  template:
    metadata:
      labels:
        kai.scheduler/queue: default-queue
    spec:
      schedulerName: kai-scheduler
      restartPolicy: OnFailure
      automountServiceAccountToken: false
      containers:
        - name: main
          image: ubuntu
          args: ["sleep", "infinity"]
          resources:
            limits:
              nvidia.com/gpu: "1"
              memory: 1Gi
```

Block for F10-456: https://github.com/kubernetes-sigs/jobset/blob/6266f0267a5d1a013ae552ecb209214eab5c55c8/site/static/examples/failure-policy/host-maintenance-event-model.yaml (verbatim excerpt, lines 1 to 16 of the JobSet example at tag v0.13.1 (the replicatedJobs list follows in the file))

```yaml
apiVersion: jobset.x-k8s.io/v1alpha2
kind: JobSet
metadata:
  name: host-maintenance-event-model
spec:
  failurePolicy:
    maxRestarts: 0
    rules:
      # The JobSet will restart an unlimited number of times when failure matches the pod failure policy.
      - action: RestartJobSetAndIgnoreMaxRestarts
        onJobFailureReasons:
        - PodFailurePolicy
      # The JobSet is restarted as normal when the leader job fails and the above rule is not matched.
      - action: RestartJobSet
        targetReplicatedJobs:
        - leader
```

Block for F10-457: https://github.com/kubeflow/trainer/blob/a7b05c24ff0f145368529b5d180c223baf965ef5/docs/user-guides/trainjob-lifecycle.md (verbatim, Kubeflow Trainer docs at tag v2.4.0)

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: TrainJob
metadata:
  name: my-trainjob
  namespace: my-namespace
spec:
  activeDeadlineSeconds: 3600 # terminate the TrainJob after 1 hour
  runtimeRef:
    name: torch-distributed
    kind: ClusterTrainingRuntime
    apiGroup: trainer.kubeflow.org
  trainer:
    image: docker.io/my-training-image:latest
    command:
      - torchrun
      - train.py
```

Block for F10-520: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html (verbatim from the page's markdown form; double braces mark the page's placeholder values)

```json
{
    "version": "0",
    "id": "{{12345678-1234-1234-1234-123456789012}}",
    "detail-type": "EC2 Spot Instance Interruption Warning",
    "source": "aws.ec2",
    "account": "{{123456789012}}",
    "time": "{{yyyy}}-{{mm}}-{{dd}}T{{hh}}:{{mm}}:{{ss}}Z",
    "region": "{{us-east-2}}",
    "resources": ["arn:aws:ec2:{{us-east-2a}}:instance/{{i-1234567890abcdef0}}"],
    "detail": {
        "instance-id": "{{i-1234567890abcdef0}}",
        "instance-action": "{{action}}"
    }
}
```

Block for F10-521: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html (verbatim, example output of the instance metadata item spot/instance-action)

```json
{"action": "terminate", "time": "2017-09-18T08:22:00Z"}
```

Block for F10-523: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/rebalance-recommendations.html (verbatim from the page's markdown form; double braces mark the page's placeholder values)

```json
{
    "version": "0",
    "id": "{{12345678-1234-1234-1234-123456789012}}",
    "detail-type": "EC2 Instance Rebalance Recommendation",
    "source": "aws.ec2",
    "account": "{{123456789012}}",
    "time": "{{yyyy}}-{{mm}}-{{dd}}T{{hh}}:{{mm}}:{{ss}}Z",
    "region": "{{us-east-2}}",
    "resources": ["arn:aws:ec2:{{us-east-2}}:{{123456789012}}:instance/{{i-1234567890abcdef0}}"],
    "detail": {
        "instance-id": "{{i-1234567890abcdef0}}"
    }
}
```

Block for F10-531: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-attribute-based-instance-type-selection.html (verbatim, the page skeleton of `InstanceRequirements`; the zeros and sample values are the page placeholders, not a recommendation)

```json
"InstanceRequirements": {
    "VCpuCount": {
        "Min": 0,
        "Max": 0
    },
    "MemoryMiB": {
        "Min": 0,
        "Max": 0
    },
    "CpuManufacturers": [
        "intel"
    ],
    "MemoryGiBPerVCpu": {
        "Min": 0.0,
        "Max": 0.0
    },
    "ExcludedInstanceTypes": [
        ""
    ],
    "InstanceGenerations": [
        "current"
    ],
    "SpotMaxPricePercentageOverLowestPrice": 0,
    "OnDemandMaxPricePercentageOverLowestPrice": 0,
    "BareMetal": "included",
    "BurstablePerformance": "included",
    "RequireHibernateSupport": true,
    "NetworkInterfaceCount": {
        "Min": 0,
        "Max": 0
    },
    "LocalStorage": "included",
    "LocalStorageTypes": [
        "hdd"
    ],
    "TotalLocalStorageGB": {
        "Min": 0.0,
        "Max": 0.0
    },
    "BaselineEbsBandwidthMbps": {
        "Min": 0,
        "Max": 0
    },
    "AcceleratorTypes": [
        "gpu"
    ],
    "AcceleratorCount": {
        "Min": 0,
        "Max": 0
    },
    "AcceleratorManufacturers": [
        "nvidia"
    ],
    "AcceleratorNames": [
        "a100"
    ],
    "AcceleratorTotalMemoryMiB": {
        "Min": 0,
        "Max": 0
    },
    "NetworkBandwidthGbps": {
        "Min": 0.0,
        "Max": 0.0
    },
    "AllowedInstanceTypes": [
        ""
    ]
},
```



## 6. The cluster, drawn

### 6.1 Objects and how they nest (EKS with self-managed Karpenter, the main drawing)

1. **Submitter** (a person with `kubectl`, a pipeline, an agent) creates a Job, JobSet or TrainJob in a namespace. With Kueue it carries the label `kueue.x-k8s.io/queue-name` (F10-451); with KAI Scheduler it sets `schedulerName: kai-scheduler` and the label `kai.scheduler/queue` (F10-454).
2. **Control plane** (run by AWS, outside the account's VPC): the API server and the default scheduler. A box with one gauge, the tier, only when Provisioned Control Plane is used (F10-465).
3. **Queue layer** (optional, in the cluster): Kueue's LocalQueue in the namespace, pointing to a ClusterQueue with quota per ResourceFlavor, ClusterQueues grouped in a cohort that lends unused quota (F10-450, F10-452); or KAI's two-level Queue tree with quota, limit and over-quota weight (F10-454). Draw the job as a token that waits here before any pod exists.
4. **Job objects**: Job (one pod template), JobSet (several Jobs restarted as one unit, F10-456), TrainJob over a ClusterTrainingRuntime (F10-457). They create **pods**; a pod that asks for `nvidia.com/gpu` and fits no node is Pending.
5. **Karpenter controller** (a Deployment on a few non-Karpenter nodes or Fargate): watches Pending pods, batches them, and creates **NodeClaims** (F10-404, F10-411). It also reads the **interruption queue**, an SQS queue fed by EventBridge rules (F10-417).
6. **NodePool**: the constraints box. Capacity types, instance categories and generations, GPU memory floor, taints, `limits`, `weight`, the `disruption` block (F10-401, F10-402, F10-407, F10-408, F10-412, F10-415). Draw two for the arm: a GPU Spot NodePool and a GPU On-Demand or reserved NodePool.
7. **EC2NodeClass**: the AWS settings a NodePool points at. Image alias, node role, subnets, security groups, disks, `instanceStorePolicy`, placement group, extra network interfaces, capacity reservations (F10-422 to F10-426).
8. **Nodes**: EC2 instances, one per NodeClaim, labelled with capacity type, zone, instance family and GPU attributes. Draw Spot and On-Demand nodes in different outlines, G instances with one to eight GPU slots, across three Availability Zones.
9. **On each GPU node**: the kubelet, the accelerated image's NVIDIA driver (F10-440), the NVIDIA device plugin DaemonSet that advertises `nvidia.com/gpu` (F10-410, F10-441) or the DRA driver that publishes ResourceSlices (F10-442), the node monitoring agent (F10-460), and the pods. One pod holds whole GPUs unless time-slicing, MPS, MIG or KAI fractions are configured (F10-443 to F10-445, F10-455).
10. **Storage beside the cluster**: a container registry (image pull at pod start), S3 through the Mountpoint CSI driver (datasets in, checkpoints out), FSx for Lustre for a shared POSIX file system, EBS volumes per pod, the node's own NVMe as RAID0 scratch (F10-463, F10-424).
11. **Network**: the VPC subnets named by the EC2NodeClass; for multi-node training a cluster placement group and `efa-only` interfaces (F10-426, F10-464).
12. **Signals in from EC2**: Spot interruption warning, rebalance recommendation, scheduled change, instance state change, all as EventBridge events (F10-417, F10-520, F10-523).

Variant to draw beside it, **EKS Auto Mode**: boxes 5 and 9 move behind the AWS line. There is no Karpenter Deployment, no interruption queue, no device plugin DaemonSet and no node access to draw; the user still writes NodePools and a NodeClass (`eks.amazonaws.com/v1`) (F10-430, F10-434, F10-435, F10-436). Two built-in NodePools exist and neither launches GPUs or Spot (F10-431).

### 6.2 Lifecycle as numbered steps (one single-GPU training Job, Kueue in front, a Spot GPU NodePool at zero nodes)

| Step | What the animation shows | Object state | Entries |
|---|---|---|---|
| 1. Submit | The user applies a Job with the queue label; Kueue holds it and represents it as a Workload in the LocalQueue | Job held, pods not yet created | F10-451 |
| 2. Queue | The Workload waits in the LocalQueue until the ClusterQueue has GPU quota in a flavor; a higher-priority Workload may preempt a lower one | Workload: quota reserved, then admitted | F10-450, F10-451, F10-452 |
| 3. Release | Kueue releases the Job and writes the flavor's node labels into the pod template; the Job creates its pod | Pod `Pending`, unschedulable | F10-451, F10-453 |
| 4. Scale from zero | Karpenter's batch window closes (1 second idle, 10 seconds at most); it bin-packs the batch and sends up to 60 instance types to EC2 Fleet with price-capacity-optimized | NodeClaim created | F10-404, F10-403, F10-405 |
| 5. Launch | EC2 returns one Spot instance; if a type has no capacity in a zone, that answer is cached for 3 minutes and the next option is tried | NodeClaim `Launched` | F10-402, F10-411 |
| 6. Register and initialise | The node joins; the `karpenter.sh/unregistered` taint goes; the device plugin starts and the node advertises `nvidia.com/gpu` | NodeClaim `Registered`, then `Initialized` (deleted and retried after 15 minutes without registration) | F10-411, F10-410 |
| 7. Place | The scheduler binds the pod to the new node; the kubelet pulls the image and mounts S3, FSx or EBS volumes | Pod `ContainerCreating` | F10-463 |
| 8. Run | The training loop runs and writes a checkpoint every N minutes to S3 or FSx, not to the node's NVMe alone | Pod `Running` | F10-535, F10-424, F10-525 |
| 9. Rebalance recommendation (may or may not come first) | EC2 flags the instance at elevated risk; Karpenter only records an event | No change | F10-523, F10-419 |
| 10. Spot notice | EventBridge event "EC2 Spot Instance Interruption Warning" reaches the SQS queue; two minutes on the clock, best effort | Node tainted, NodeClaim deleting | F10-520, F10-417, F10-522 |
| 11. Drain and replace in parallel | Karpenter launches a replacement at once and evicts the pod; the pod gets SIGTERM and has its `terminationGracePeriodSeconds`, capped in practice by the two minutes | Pod `Terminating`, pod condition `DisruptionTarget` | F10-418, F10-535, F10-456 |
| 12. Checkpoint | On SIGTERM the loop writes a last checkpoint if it can finish in time; otherwise the last periodic one stands | Pod exits | F10-535, F10-522 |
| 13. Requeue | The Job controller (or JobSet, whose failure policy can ignore evictions when counting restarts) creates a new pod, which is Pending until the replacement node is ready, then resumes from the checkpoint | Pod `Pending`, then `Running` | F10-456, F10-418 |
| 14. Reclaim | EC2 terminates the instance; everything on its instance store is gone | Node removed | F10-525 |
| 15. Finish | The Job completes; Kueue releases the quota | Job `Complete` | F10-451 |
| 16. Scale down | The node is empty; after `consolidateAfter` Karpenter deletes it, within the disruption budget | NodeClaim deleted, zero nodes | F10-412, F10-413, F10-415 |

No first-party page gives the seconds for steps 4 to 7 on a GPU node (U10c-1); the one printed illustration is an Auto Mode sample showing a node Ready at 76 seconds (F10-438). The animation should mark that span as unmeasured or use a number we measure ourselves.

### 6.3 What changes in the other variants

- **EKS Auto Mode:** steps 4 to 6 and 10 to 11 are the same events with the controller hidden; there is no queue to configure (F10-435). The pod cannot read the instance metadata service unless it uses host networking, so step 12 relies on SIGTERM (F10-434, F10-521). Nodes live 14 days by default, 21 at most (F10-432).
- **KAI Scheduler in place of Kueue:** step 2 happens inside the scheduler (the pod exists and is Pending while its queue is over quota); a fractional-GPU pod needs the `node-scale-adjuster` for step 4 to fire at all (F10-455).
- **Multi-node JobSet or TrainJob:** step 4 must produce N nodes; with a placement group and EFA they come from one EC2NodeClass (F10-426). One Spot notice restarts the whole JobSet (F10-456), which is why the EKS guide keeps large training off Spot (F10-534).
- **GPU fault instead of Spot notice:** the node monitoring agent sets `AcceleratedHardwareReady` to false; after 10 minutes auto repair replaces or reboots the node, with a 5 or 10 minute grace period on Karpenter v1.15 and almost none on Auto Mode (F10-460, F10-461, F10-462).


## 7. Recommended configuration [our reading]

Everything in this section is `[our reading]`: a configuration assembled for the arm's workloads from fields that the first-party pages document. The YAML below is ASSEMBLED, not verbatim; every field exists in the cited entries and every value is our choice. The verbatim first-party blocks are in section 5.

**What AWS and the projects themselves recommend, quoted:**
- "We recommend using the `price-capacity-optimized` strategy" (F10-528). Karpenter already uses it and offers no other (F10-403).
- "A good rule of thumb is to be flexible across at least 10 instance types for each workload." (F10-529)
- For GPUs: "allow broader g-series instances (generation 4 or higher) from NVIDIA across sizes and Availability Zones (AZs)" (F10-534)
- "We strongly discourage using Spot Instances for these workloads or attempting to fail over to On-Demand Instances to handle interruptions" (F10-530)
- "We recommend that you check for these interruption notices every 5 seconds." (F10-521)
- "tiered approaches (fast local every 5-30 minutes for transients, durable hourly for major failures)" (F10-535)
- "Design workloads that can't be interrupted safely, such as long-running training jobs, to checkpoint and resume." (F10-462)
- "AWS suggests running either EKS Auto Mode or self-managed Karpenter" (F10-439)

### 7.1 Choice of node layer

- **EKS Auto Mode** when the team wants no node software to run: GPU drivers, device plugin, Spot handling and repair are included (F10-430, F10-435). Accept: no time-slicing (F10-443), no custom image or node access (F10-434), a 21-day node ceiling (F10-432), no G7 today (F10-433), repair with a minimal grace period (F10-462).
- **Self-managed Karpenter v1.15** when the work needs time-slicing, MPS or KAI fractions, a custom image, G7, a repair grace period, or nodes that live longer than 21 days (F10-443, F10-445, F10-455, F10-440, F10-462, F10-416).

### 7.2 Assembled NodePools for the arm (self-managed Karpenter)

Three NodePools, one EC2NodeClass. Reasoning for each value follows the block.

```yaml
# ASSEMBLED [our reading]. Not from one page. Fields: F10-401, F10-402, F10-407, F10-408, F10-412, F10-415, F10-416, F10-422, F10-424.
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: gpu-spot                      # interruptible work: workloads 2, 3, 6, 7, 8, 10, 13
spec:
  weight: 50                          # tried before gpu-on-demand (F10-408)
  template:
    metadata:
      labels:
        fleet: gpu-spot
    spec:
      requirements:
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot"]
        - key: karpenter.k8s.aws/instance-category
          operator: In
          values: ["g"]               # G only: P Spot is for multi-node work this pool does not run
        - key: karpenter.k8s.aws/instance-generation
          operator: Gt
          values: ["4"]               # generation 5 up: g5, g6, g6e, g7e; the guide also allows generation 4 (F10-534)
        - key: karpenter.k8s.aws/instance-gpu-memory
          operator: Gt
          values: ["20480"]           # same floor as the guide's block (F10-428); set per workload
        - key: kubernetes.io/arch
          operator: In
          values: ["amd64"]
      taints:
        - key: nvidia.com/gpu
          effect: NoSchedule
      nodeClassRef:
        group: karpenter.k8s.aws
        kind: EC2NodeClass
        name: gpu
      expireAfter: 720h               # Karpenter's default (F10-416)
      terminationGracePeriod: 2h      # bounds a drain at expiry; irrelevant to a Spot reclaim (F10-416)
  limits:
    nvidia.com/gpu: 32                # the fleet ceiling, also the budget ceiling (F10-407)
  disruption:
    consolidationPolicy: WhenEmpty    # never move a running job to save money (F10-412, F10-428)
    consolidateAfter: 10m             # keep a warm node between jobs of a sweep; the guide's job value is 60m
    budgets:
      - nodes: "100%"
        reasons: ["Empty"]            # empty nodes may all go at once (F10-415)
      - nodes: "0"
        reasons: ["Drifted"]          # no drift replacement under running jobs; expiry still applies
---
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: gpu-on-demand                 # work that must not be reclaimed: 9, 14, long runs of 8
spec:
  weight: 10
  template:
    metadata:
      labels:
        fleet: gpu-on-demand
    spec:
      requirements:
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["reserved", "on-demand"]   # reserved first when an ODCR is selected (F10-402, F10-425)
        - key: karpenter.k8s.aws/instance-category
          operator: In
          values: ["g", "p"]
        - key: karpenter.k8s.aws/instance-generation
          operator: Gt
          values: ["4"]
      taints:
        - key: nvidia.com/gpu
          effect: NoSchedule
      nodeClassRef:
        group: karpenter.k8s.aws
        kind: EC2NodeClass
        name: gpu
      expireAfter: Never              # do not expire under a multi-day run; patch by drift in a window
      terminationGracePeriod: 48h
  limits:
    nvidia.com/gpu: 8
  disruption:
    consolidationPolicy: WhenEmpty
    consolidateAfter: 60m             # the guide's value for jobs (F10-428)
---
apiVersion: karpenter.k8s.aws/v1
kind: EC2NodeClass
metadata:
  name: gpu
spec:
  amiSelectorTerms:
    - alias: al2023@v20261119         # pinned image, not @latest, so drift is a decision (F10-422, F10-440)
  role: KarpenterNodeRole-CLUSTER     # placeholder
  subnetSelectorTerms:
    - tags:
        karpenter.sh/discovery: CLUSTER   # placeholder; subnets in every Availability Zone (F10-529)
  securityGroupSelectorTerms:
    - tags:
        karpenter.sh/discovery: CLUSTER
  instanceStorePolicy: RAID0          # local NVMe as scratch for images and caches (F10-424)
```

Reasoning, value by value:

- **Spot and On-Demand in separate NodePools, selected by the job, not one mixed pool.** A mixed pool makes Karpenter fall back to On-Demand within milliseconds when Spot is short (F10-402), which is the fail-over AWS discourages (F10-530) and which hides from the user which jobs are paying full price. The job chooses with a node selector on `fleet`, or the Kueue ResourceFlavor does it (F10-451). A mixed pool is right only where finishing on time matters more than cost, and that is a per-job choice.
- **Flexibility.** With generation above 4 and a GPU-memory floor, the pool spans g5, g6, g6e and g7e in every size and zone. Whether that reaches 10 types that the workload can use depends on the floor (F10-529); the March 2026 advisor file shows most of those rows in the highest interruption band (F10-539), so the checkpoint, not the type list, carries the risk.
- **`limits` of 32 GPUs.** A cap is needed because a NodePool without one is bounded only by the EC2 quota (F10-407). 32 is an illustration: four sweeps of eight single-GPU jobs. The account's "All G and VT Spot Instance Requests" quota must cover it in vCPUs, and its printed default is 0 (F10-533).
- **`WhenEmpty`.** `WhenEmptyOrUnderutilized`, Karpenter's default with `consolidateAfter: 0s` (F10-412), would evict a running training pod to repack it. Jobs also carry `karpenter.sh/do-not-disrupt: "true"` as a second guard (F10-420); neither stops a Spot reclaim.
- **`consolidateAfter: 10m`.** Long enough that the next job of a sweep reuses a node that already holds the image; short enough that an idle 8-GPU node is not kept for an hour. HyperPod's guidance for the same field is "non zero upto 2 min" (F10-540); the EKS guide's is 60 minutes for jobs (F10-428). 10 minutes sits between and should be tuned against measured node start time (U10c-1).
- **Interruption queue on.** Without `--interruption-queue` Karpenter does not react to the notice at all (F10-417). No Node Termination Handler beside it (F10-419).

### 7.3 Checkpoint settings

- **Periodic, to durable storage.** Every 10 to 15 minutes to S3 through Mountpoint or to FSx for Lustre for single-GPU fine-tunes; the EKS guide's range for the fast tier is 5 to 30 minutes (F10-535), and Batch's Spot advice is units of work of 30 minutes or less (F10-535). The interval is the work lost per reclaim: at 15 minutes and a ">20%" monthly band it is an accepted loss `[our reading]`.
- **On SIGTERM as well, but never only on SIGTERM.** The notice is best effort (F10-522). Set the pod's `terminationGracePeriodSeconds` to 100 to 110 seconds: above the 30-second default, under the two minutes after which the node is gone (F10-535, F10-418). A checkpoint that takes longer than that to write cannot be a SIGTERM checkpoint.
- **Not on instance store alone.** RAID0 scratch is lost on reclaim (F10-525, F10-424).
- **Retries.** A Job `backoffLimit` that tolerates several reclaims, or a JobSet failure policy that does not count evictions (F10-456). Batch's figure for the same idea is 1 to 3 retries at least (F10-537).

### 7.4 Before the first GPU Spot job

1. Raise the Spot quota for G instances (F10-533).
2. Query the Spot placement score for the accepted G types in each candidate Region and zone (F10-532).
3. Do not set a maximum Spot price (F10-526).
4. Test an interruption before trusting the handler (F10-522); the same EC2 page names AWS Fault Injection Service as the tool.


## 8. Workload fit

Names are those in `src/sections/Workloads.tsx`, in its order. Verdicts are `[our reading]` unless an entry with first-party evidence is cited as such. "On Spot" is the EC2 Spot verdict, which holds for Batch and HyperPod as well as EKS.

| # | Workload (file name) | Fit on EKS | On Spot | Why, with entries |
|---|---|---|---|---|
| 1 | Record and encode | Does not fit: edge | Not applicable | Runs on the computer beside the robot. EKS Hybrid Nodes could make that computer a node, but the pages read state no GPU status for it (F10-466, U10c-5) and nothing is gained for one arm. |
| 2 | Decode and filter | Suits | Suits | Independent shards as an indexed Job behind a Kueue queue; CPU or one GPU each; a reclaim costs one shard. First-party: "data augmentation" and batch work are on the EKS guide's Spot list (F10-534). |
| 3 | Embed and deduplicate | Suits | Suits | Same shape as 2. Small embedding models can share a GPU by time-slicing or KAI fractions on self-managed Karpenter, not on Auto Mode (F10-443, F10-455). |
| 4 | Dataloader decode and augment | Not a scheduler decision | Follows the training job | It runs inside the training pod. EKS's levers are the instance size (vCPUs per GPU through NodePool requirements, F10-401) and the pod's CPU and memory requests. |
| 5 | CPU physics step | Suits | Suits | Many CPU pods; a CPU NodePool is where the 10-type rule is easy to meet, and the repository's own Spot example is a `c`, `m`, `r` pool (F10-427, F10-529). |
| 6 | GPU-parallel physics | Suits | Suits with checkpoints | One GPU per pod, thousands of environments inside it. A reinforcement-learning run checkpoints its policy every few minutes; a reclaim costs the interval (F10-535). |
| 7 | Simulated cameras | Suits | Suits, with a narrower type list | Needs RTX-capable GPUs and more GPU memory, so the NodePool's memory floor shrinks the list; the guide names "GPU memory or Ray Tracing" as the constraints to weigh (F10-534). The advisor file has rows for g6e and g7e (F10-538). |
| 8 | Policy fine-tune | Suits | Suits with checkpoints | The EKS guide lists "Fine-tuning models" on Spot "with robust checkpointing mechanisms" (F10-534, first-party). A TrainJob or plain Job, one node, 1 to 8 GPUs (F10-457). The managed alternative with no cluster is SageMaker managed Spot training (F10-536). |
| 9 | World-model training | Possible | Possible on one node; not for multi-node | Single-node runs behave like 8 with larger checkpoints: the checkpoint must be writable inside two minutes or be periodic only (F10-535, F10-418). The guide: Spot "not recommended for production-scale training" (F10-534). |
| 10 | Closed-loop evaluation | Suits | Suits | Many short, independent rollouts of a policy in simulation; a reclaimed rollout is rerun. Array-style Job with a Kueue quota so evaluation cannot starve training (F10-450, F10-452). |
| 11 | Engine build | Possible | Possible | A short single-GPU job. The constraint is the GPU model, not the scheduler: the engine must be built for the target device, so a cloud G instance serves only when it matches or when the build is for a cloud target. Pin one family in the NodePool, which gives up Spot flexibility (F10-529). |
| 12 | On-robot inference | Does not fit: edge | Not applicable | Runs on the robot's computer. The cloud-side neighbour is a real-time endpoint, which is what the guide's `gpu-inference-spot` block is written for (F10-428). |
| 13 | Generative augmentation | Suits | Suits | Batch inference of a video or world model over a list of clips: the guide's Spot list has "data augmentation" and batch inference (F10-534). Needs large GPU memory, so the same narrow type list as 7. |
| 14 | Robot foundation-model pretraining | Possible on EKS; hand off above one node | Does not fit | Days on 8 GPUs or more. On EKS it wants On-Demand or reserved capacity (ODCRs or Capacity Blocks, F10-425), `expireAfter` off and repair with a grace period (F10-416, F10-462); Auto Mode's 21-day node ceiling and minimal-grace repair count against it (F10-432, F10-462). |
| 15 | World-model pretraining | Possible; hand off | Does not fit | Multi-node with EFA and a placement group: supported in Karpenter and Auto Mode since July 2026 (F10-426, F10-464, F10-540), with JobSet or TrainJob and KAI gang scheduling (F10-454, F10-456). One reclaim restarts every node's work, and AWS discourages Spot for "tightly coupled" work (F10-530, F09-95). HyperPod or PCS carry this with less assembly (sections 26, 27). |


## 9. What it does poorly, and hand-offs

| Limit | Entries | Where it hands off |
|---|---|---|
| Nothing queues jobs out of the box: plain Kubernetes starts every pod it can, so quota, priority between teams and fair sharing need Kueue or KAI installed and configured | F10-450, F10-454 | AWS Batch (queues and fair share are the service, section 25); HyperPod task governance (section 27) |
| Many parts to version and keep compatible on self-managed Karpenter: Karpenter, the image, device plugin or GPU Operator or DRA driver, CSI drivers, scheduler, monitoring agent | section 2 currency table; F10-440, F10-441, F10-442 | EKS Auto Mode for the node layer (F10-430); Batch or HyperPod for the whole stack |
| Auto Mode removes choices GPU work may need: no time-slicing, no custom image, no node access, no G7, 21-day node ceiling, forceful repair | F10-434, F10-443, F10-433, F10-432, F10-462 | Self-managed Karpenter on the same cluster type |
| Kueue's capacity-aware admission (ProvisioningRequest) is written for cluster-autoscaler; with Karpenter a job is admitted on quota and then waits for capacity that may not exist | F10-453, U10c-3 | Batch, whose scheduler and scaling are one service |
| Fractional GPUs are invisible to the autoscaler: Karpenter counts whole `nvidia.com/gpu`; KAI fractions need an extra component | F10-443, F10-455 | Whole-GPU jobs on Batch; or accept one node per fractional group |
| Karpenter ignores the rebalance recommendation and has no capacity-rebalancing mode | F10-419, F10-524 | Auto Scaling group or fleet based services (Batch, PCS) where Capacity Rebalancing exists |
| A Spot reclaim of one node restarts a whole multi-node job | F10-456, F10-530 | On-Demand, ODCRs or Capacity Blocks (F10-425); HyperPod or PCS for resilience features (sections 26, 27) |
| GPU Spot depth is thin and uneven: default quota 0, most common G rows in the highest interruption band in the March 2026 file, no rows for the newest families | F10-533, F10-539, F10-538 | Capacity reservations; another Region chosen with the placement score (F10-532) |
| The two-minute notice is not guaranteed and a pod grace period beyond it is cut | F10-522, F10-418 | No hand-off: periodic checkpoints are the only answer on every service |
| No published time from pending pod to running GPU pod | F10-438, U10c-1 | Measure it; or keep warm nodes with `consolidateAfter` or Auto Mode static capacity |
| Simulation with a display, a robot in the loop, or data capture at the edge | F10-466 | The edge sections of the dive; OSMO for cloud-plus-edge pipelines (F10-458, F09-65) |


## 10. Contradicts or sharpens the first version

| F09 ID | What register 09 says | What today's page says |
|---|---|---|
| F09-38 | Karpenter's AWS provider is at v1.15.2 (12 November 2026) | v1.15.3 was published today, 20 November 2026, a bug-fix release (F10-400). Register 09 did not fetch the Karpenter documentation; this register reads it at the v1.15.3 tag (F10-401 to F10-427). |
| F09-42 | From the best-practices guide: DRA on self-managed nodes is limited to managed node groups, "not with Karpenter" | Contradicted by the EKS User Guide and the 9 November 2026 announcement: Karpenter supports DRA from v1.15 and Auto Mode from Kubernetes 1.36, and the guide recommends DRA drivers for new deployments on 1.34 and later (F10-442). The best-practices page is the stale one. |
| F09-48 | Auto Mode nodes have a 21-day maximum lifetime | The default is 336 hours, 14 days; 21 days is the ceiling. The default `terminationGracePeriod` is 24 hours (F10-432). |
| F09-47 | The 2026 Auto Mode changes, with approximate dates | Exact headings: placement groups 5 May, interruptible Capacity Reservations 3 June, and the rest as listed in F10-437. `Balanced` consolidation is also in open-source Karpenter v1.15 (F10-412). The 17 November resource-optimization preview is not on the release notes page. |
| F09-41 | MIG on A100, H100 and Blackwell GPUs; the A10G does not support it | Sharpened: on AWS, MIG is also available on g7 and g7e, and not on g5, g6 or g6e; time-slicing and MPS limits added (F10-443, F10-444, F10-445). |
| F09-39 | The guide's GPU NodePool pattern, summarised | Printed verbatim (F10-428, section 5). The block is written for inference (`WhenEmptyOrUnderutilized`, 5 minutes); for jobs the same guide gives `WhenEmpty` and 60 minutes. |
| F09-40 | Karpenter uses ODCRs through `capacityReservationSelectorTerms` | Sharpened with versions and labels: ODCRs from v1.3, Capacity Blocks from v1.6, interruptible reservations from v1.10; capacity type `reserved` is tried first (F10-425, F10-402). |
| F09-49 | G7 is not supported in Auto Mode | Agrees: G7 is absent from today's Auto Mode instance list and present in the accelerated image list (F10-433, F10-440). |
| F09-61 | OSMO's newest release is 6.3.1 | Agrees (F10-458). |
| F09-95 | Two minutes' warning, best effort; be flexible across 10 types; Spot is unsuitable for tightly coupled work | Agrees, and sharpened three ways: the warning can be missing altogether (F10-522); the rebalance recommendation has no guaranteed lead (F10-523); AWS also discourages failing over to On-Demand, which sits in tension with the Spot-then-On-Demand patterns that Karpenter, Auto Mode, HyperPod and the Batch guide document (F10-530, F10-402, F10-435, F10-540, F10-537). The dive should print the fallback pattern with that caveat. |
| F09-96 | Spot Instance Advisor file of 20 March 2026; US East (N. Virginia) counts for G5, G6e, G7e | Agrees (same file, same date). Extended to every G and P family and to all Regions; no rows for g7, p5e, p6e (F10-538, F10-539). |
| F09-11 | Batch: avoid Spot for jobs of an hour or more; parts of 30 minutes or less | Agrees (F10-535, F10-537). Not the same advice as the EKS guide, which sets the checkpoint threshold at jobs longer than 1 to 2 hours and a fast tier of 5 to 30 minutes (F10-535). The dive should present them as two first-party figures, not one rule. |

One contradiction inside today's first-party pages, not with register 09: the Karpenter documentation at v1.15.3 describes node repair as force-terminating without a drain (F10-421), while the EKS User Guide says Karpenter v1.15.0 and later applies a grace period of 5 or 10 minutes and adds `RebootForRepair` and `karpenter.sh/do-not-repair` (F10-462). The EKS guide is the more specific and more recent statement `[our reading]`.

## 11. UNKNOWN register

| ID | Unknown | Where it arises | What was searched; what would close it |
|---|---|---|---|
| U10c-1 | Seconds from a pending GPU pod to a running one (launch, registration, device plugin ready, image pull) on Karpenter or Auto Mode | F10-404, F10-418, F10-438 | Karpenter docs at v1.15.3, EKS User Guide Auto Mode pages, best-practices guide: only the batch window (1 second, 10 seconds) and one sample output (76 seconds, On-Demand). Closed by our own measurement on a `g6e` Spot node. |
| U10c-2 | A first-party Auto Mode page that prints a GPU Spot NodePool | F10-435 | Auto Mode pages listed in section 3: the Spot example is a CI pool, the GPU examples are On-Demand. The Karpenter-form block in F10-428 is the nearest. |
| U10c-3 | Whether Karpenter supports Kueue's ProvisioningRequest admission check | F10-453 | Kueue provisioning_request.md at v0.20.7 names cluster-autoscaler only; the Karpenter docs pages read do not mention it. A statement in either project's docs or release notes would close it. |
| U10c-4 | The pods-per-node limit that applies to a GPU node | F10-465 | service-quotas and provisioned control plane pages. Not needed for the arm's fleet. |
| U10c-5 | GPU support on EKS Hybrid Nodes | F10-466 | Overview and add-ons pages have no match for "gpu" or "nvidia". Register 09 wave 3 holds the Hybrid Nodes limits. |
| U10c-6 | One first-party checkpoint interval for GPU training on Spot | F10-535 | EKS guide (5 to 30 minutes fast tier, hourly durable), Batch guide (parts of 30 minutes or less), SageMaker (checkpoint unless the job is quick), EC2 guide (no number). The pages give ranges and no single figure. |
| U10c-7 | A 2025 or 2026 AWS blog post or What's New item about simulation or rendering fleets on GPU Spot | F10-540 | The What's New feed searched for Spot, GPU, Karpenter and EKS items; found HyperPod Spot, EFA and placement groups, DRA, placement score for Local Zones. AWS blog categories were not searched exhaustively. |
| U10c-8 | Current Spot interruption data for G and P families, and any data for g7, p5e, p6e | F10-538 | The advisor file is dated 20 March 2026 and has no rows for those families. The placement score API gives a current likelihood of fulfilment, which needs an AWS call this research did not make. |
| U10c-9 | The share of interruptions that arrive without the two-minute notice | F10-522 | The EC2 and HyperPod pages say it can happen and give no rate. |

## 12. Source list by tier

### Tier 1 (AWS documentation, first-party data, project docs and examples at a pinned tag)

- Amazon EKS User Guide, pages listed in section 3: https://docs.aws.amazon.com/eks/latest/userguide/
- EKS Best Practices Guide, pages listed in section 3: https://docs.aws.amazon.com/eks/latest/best-practices/
- Amazon EC2 User Guide, Spot pages listed in section 3: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/
- AWS Batch User Guide, "Amazon EC2 On-Demand or Amazon EC2 Spot": https://docs.aws.amazon.com/batch/latest/userguide/bestpractice5.html
- AWS Batch User Guide, "Use Amazon EC2 Spot best practices for AWS Batch": https://docs.aws.amazon.com/batch/latest/userguide/bestpractice6.html
- Amazon SageMaker AI Developer Guide, "Managed Spot Training in Amazon SageMaker AI": https://docs.aws.amazon.com/sagemaker/latest/dg/model-managed-spot-training.html
- Amazon SageMaker AI Developer Guide, "Spot instances in Amazon SageMaker HyperPod": https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-spot.html
- Spot Instance Advisor data file: https://spot-bid-advisor.s3.amazonaws.com/spot-advisor-data.json
- Karpenter AWS provider at v1.15.3: https://github.com/aws/karpenter-provider-aws/tree/8c91894e993eda682f0785091b79a93da68f9830
- Kueue at v0.20.7: https://github.com/kubernetes-sigs/kueue/tree/e854ec82e404436b261c81f0341ac9de8508f97c
- KAI Scheduler at v0.19.0: https://github.com/kai-scheduler/KAI-Scheduler/tree/2305acfc348c9bd9cd1ab813d3feb8dfc4ab9d11
- JobSet at v0.13.1: https://github.com/kubernetes-sigs/jobset/tree/6266f0267a5d1a013ae552ecb209214eab5c55c8
- Kubeflow Trainer at v2.4.0: https://github.com/kubeflow/trainer/tree/a7b05c24ff0f145368529b5d180c223baf965ef5
- NVIDIA OSMO release 6.3.1: https://github.com/NVIDIA/OSMO/releases/tag/6.3.1
- NVIDIA GPU Operator documentation, overview: https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/overview.html
- GitHub API release lists (dates only) for the repositories named in section 2.

### Tier 2 (What's New posts, AWS blogs)

- "Amazon SageMaker HyperPod now supports Spot Instances", Nov 24, 2025: https://aws.amazon.com/about-aws/whats-new/2025/11/amazon-sagemaker-hyperpod-spot-instances
- Amazon EKS placement groups and EFA for node pools on Auto Mode and Karpenter, Jul 22, 2026: https://aws.amazon.com/about-aws/whats-new/2026/07/amazon-eks-efa-placement-groups/
- Spot placement score support for Local Zones, Aug 13, 2026: https://aws.amazon.com/about-aws/whats-new/2026/08/spot-placement-score-local-zones/
- DRA on EKS Auto Mode and Karpenter, Nov 9, 2026: https://aws.amazon.com/about-aws/whats-new/2026/11/amazon-eks-auto-mode-karpenter-dra/
- AWS Compute Blog, "Introducing the price-capacity-optimized allocation strategy for EC2 Spot Instances" (linked from the Karpenter FAQ passage quoted in F10-403; the post itself is not quoted): https://aws.amazon.com/blogs/compute/introducing-price-capacity-optimized-allocation-strategy-for-ec2-spot-instances/

### Tier 3 and Tier 4

None used.
