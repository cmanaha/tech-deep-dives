# AWS accuracy review, round 2: sections 24 to 29

Reviewed 2026-11-20. Scope: technical errors only, in `AwsOrchestration.tsx` (24), `AwsBatch.tsx` (25), `AwsPcs.tsx` (26), `HyperPod.tsx` (27), `Eks.tsx` (28) and the prose and tables of `Choosing.tsx` (29). Corrections already applied by `research/2026-11/wave5-refutation.md` are not repeated, except finding 5, where that pass confirmed a claim the cited page does not print.

Evidence labels used below:

- **Fetched today**: checked against a first-party page fetched on 2026-11-20 (URL given).
- **Own knowledge**: from the reviewer's knowledge of the service, no page fetched for it. Treat as a lead to confirm.

Pages fetched and found consistent with the dive (no finding): sbatch `--exclusive` allocates all CPUs and GRES (slurm.schedmd.com/sbatch.html), the PCS `create-compute-node-group` option names, `Features` custom setting and `price-capacity-optimized` default, the Capacity Blocks list (no G-family type, P6e-GB200 in the Dallas Local Zone only, 64 instances, eight weeks, 11:30 UTC, no cancel, move or split), the Batch retry and job state rules, the `CreateCluster` field names, Kueue `v1beta2` and its three preemption fields.

---

## Findings, most serious first

### 1. Section 27: the PyTorchJob snippet is rejected by the Kubeflow Training Operator (container name)

- **Where**: `src/sections/HyperPod.tsx` line 642 (snippet lines 619 to 646), and the `ours` note on line 618.
- **Text that is wrong**: `- name: posttrain`, with the note "the job, team and container names ... are ours".
- **What is correct**: a `PyTorchJob` replica spec must contain a container named `pytorch`. The operator's validating webhook rejects the object otherwise ("must have at least one container with name pytorch"). The auto-resume feature the snippet demonstrates requires operator 1.7.0, 1.8.0 or 1.8.1, and the rule is in that code line. The container name is not free to choose.
- **Source**: https://raw.githubusercontent.com/kubeflow/training-operator/v1.8.1/pkg/webhooks/pytorch/pytorchjob_webhook.go ("Make sure there has at least one container named "pytorch""). Operator version requirement: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-run-jobs-kubectl.html (register F10-316).
- **Confidence**: high.
- **Evidence**: Fetched today (both pages).
- **Suggested replacement**: in the YAML, `- name: pytorch`. In the `ours` note: "the job and team names, one replica, the instance type, the image placeholder and the 90-second grace period are ours; every field name is AWS's. The container must be named pytorch: the Kubeflow Training Operator rejects a PyTorchJob without a container of that name."

### 2. Section 28: the Job snippet uses `generateName`, and the section tells the reader to `kubectl apply` it

- **Where**: `src/sections/Eks.tsx` line 413 (`generateName: arm-eval-`), with the instruction on line 54 (`kubectl apply: two Jobs`), line 980 ("Follow one evaluation sweep from kubectl apply to results in S3") and line 1365 ("Then apply one Spot NodePool, one ClusterQueue and the four-pod Job above").
- **Text that is wrong**: the combination. `kubectl apply` refuses an object that has `generateName` and no `name` ("cannot use generate name with apply").
- **What is correct**: an object with `generateName` is submitted with `kubectl create -f`. The Kueue page the snippet is adapted from uses exactly that command.
- **Source**: https://kueue.sigs.k8s.io/docs/tasks/run/jobs/ ("kubectl create -f sample-job.yaml"; the page does not mention `kubectl apply`). The kubectl refusal itself is from own knowledge.
- **Confidence**: high.
- **Evidence**: Kueue page fetched today; kubectl behaviour from own knowledge.
- **Suggested replacement**: keep `generateName` and change the three instructions. Line 54: `kubectl create: two Jobs`. Line 980: "Follow one evaluation sweep from kubectl create to results in S3". Line 1365: "Then apply one Spot NodePool and one ClusterQueue, and submit the four-pod Job above with kubectl create, because a Job that uses generateName cannot be applied."

### 3. Sections 26, 28 and 24: a Capacity Block cannot be combined with a placement group

- **Where**:
  - `src/sections/AwsPcs.tsx` line 871: "Training group | On-Demand or reserved, one subnet, EFA, cluster placement group".
  - `src/sections/Eks.tsx` lines 1063 to 1066: "It goes on a second NodePool with the capacity types `reserved` and `on-demand` ... The nodes come from one EC2NodeClass with a cluster placement group and `efa-only` interfaces."
  - `src/sections/AwsOrchestration.tsx` lines 774 to 776: "Multi-node training on any of the four adds the same two things: a placement group that keeps the nodes close together, and EFA".
- **What is correct**: EC2 does not accept a placement group on an instance launched into a Capacity Block: "Capacity Blocks do not support placement groups. You can't specify a placement group when you launch instances into a Capacity Block, whether you target the Capacity Block by its reservation ID or through a Capacity Reservation Resource Group." Instances in a block are already placed close together in an EC2 UltraCluster. A reader who puts `Placement.GroupId` (the EFA template printed in section 26) into the launch template of a `CAPACITY_BLOCK` group, or a `placementGroupSelector` on the EC2NodeClass that serves a Capacity Block, gets a launch failure. The PCS page for Capacity Block groups lists the launch template requirements and has no placement group among them.
- **Source**: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html (Considerations). https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks-configure-cng.html.
- **Confidence**: high for the EC2 rule. Medium for how Karpenter reacts (whether it fails the launch or is expected to use a second EC2NodeClass was not checked).
- **Evidence**: Fetched today (both pages).
- **Suggested replacement**:
  - Section 26 table row, value: "On-Demand or an ODCR: one subnet, EFA, cluster placement group. On a Capacity Block: one subnet, EFA, no placement group". Why cell, add: "EC2 does not accept a placement group on an instance launched into a Capacity Block; the block already places its instances close together."
  - Section 28: "The nodes come from one EC2NodeClass with `efa-only` interfaces, and with a cluster placement group when the capacity is On-Demand or an ODCR. A Capacity Block takes an EC2NodeClass without a placement group, because EC2 does not accept one there."
  - Section 24: "Multi-node training on any of the four adds EFA (...), and on On-Demand capacity or an ODCR a placement group that keeps the nodes close together. A Capacity Block does not accept a placement group and places its instances close together by itself."

### 4. Section 28: the printed NodePool does not limit the pool to one-GPU sizes, so the picture's reasoning does not hold for it

- **Where**: `src/sections/Eks.tsx` lines 451 to 493 (`SPOT_NODEPOOL`), against line 61 ("G family, sizes with one GPU, all zones") and lines 927 to 929 ("The Spot NodePool is limited to sizes with one GPU, a choice with a reason: Karpenter packs a batch onto the smallest type that fits all of it, so four one-GPU pods arriving together could otherwise share one four-GPU instance and be interrupted together").
- **Text that is wrong**: the snippet's requirements are category `g`, generation above 4, GPU memory above 20480 and `amd64`. Nothing restricts the GPU count, so g5.12xlarge, g6.12xlarge, g6e.12xlarge, g7e.12xlarge and the larger multi-GPU sizes are all eligible. With the NodePool as printed, the four pods of the worked Job can be packed onto one four-GPU instance, which is the outcome the text says the pool was built to avoid, and the figure's "four NodeClaims" does not follow.
- **What is correct**: add the requirement `karpenter.k8s.aws/instance-gpu-count In ["1"]` to the snippet, or state that the recommended pool allows multi-GPU sizes.
- **Source**: register F10-403 (Karpenter FAQ, bin-packing onto the smallest type that fits the batch). The label name `karpenter.k8s.aws/instance-gpu-count` is from own knowledge of Karpenter's well-known labels.
- **Confidence**: high that the snippet lacks the restriction; high on the label name.
- **Evidence**: Own knowledge, plus the register entry. No page fetched today.
- **Suggested replacement**: insert in the snippet, after the `instance-gpu-memory` requirement:

  ```yaml
          - key: karpenter.k8s.aws/instance-gpu-count
            operator: In
            values: ["1"]
  ```

  and add to the `ours` note: "the limit to sizes with one GPU".

### 5. Section 25: "at the front of the queue" is not on the Batch pages

- **Where**: `src/sections/AwsBatch.tsx` lines 225 to 226 ("Batch returns child 1 to `RUNNABLE` at the front of the queue, ahead of children 6 and 7"), line 229 (`RUNNABLE again, front of queue`), lines 853 to 854 ("The retry rule matches, so child 7 returns to the front of the queue"). The figure also draws child 1 in queue position 0 ahead of 6 and 7 (lines 233 to 235, 250 to 252).
- **What is correct**: the two Batch pages that describe a retry say only that the job goes back to `RUNNABLE`: "the job is placed back in the `RUNNABLE` state" and "the job is moved to `RUNNABLE` again". Neither says where in the queue it lands. The caption under the figure says "The order of events is the documented one", which this detail is not. Register F10-57 marks the whole step as `[our reading]`; the refutation pass recorded the position as holding on the cited page, and it does not appear there.
- **Source**: https://docs.aws.amazon.com/batch/latest/userguide/job_retries.html and https://docs.aws.amazon.com/batch/latest/userguide/job_states.html.
- **Confidence**: high that the pages do not print it. Unknown what Batch does in practice.
- **Evidence**: Fetched today (both pages).
- **Suggested replacement**: step 7 caption: "EC2 terminates the instance. The attempt fails with a status reason that begins `Host EC2`, the retry rule matches it, and Batch places child 1 back in `RUNNABLE`. The Batch guide does not say where in the queue a retried job lands; the figure draws it first." Scheduler line: `RUNNABLE again`. Worked case step 6: "The retry rule matches, so child 7 goes back to `RUNNABLE`."

### 6. Sections 26 and 24: instances in a Capacity Block are terminated 30 minutes before the block ends

- **Where**: `src/sections/AwsPcs.tsx` lines 643 to 644 ("When it ends, every instance is terminated and queued jobs stay pending; EC2 sends a warning event 40 minutes before."). `src/sections/AwsOrchestration.tsx` lines 805 to 807 ("up to 64 instances per block, for up to six months, ending at 11:30 UTC").
- **What is correct**: EC2 starts terminating the instances at 11:00 UTC on the final day, 30 minutes before the 11:30 UTC end, and for P6e-GB200 UltraServer blocks the instances must be terminated at least 60 minutes before the end. A job sized to the block's end time loses its last half hour. Section 29 already states the 30 minutes (`Choosing.tsx` lines 756 to 758), so sections 24 and 26 are also inconsistent with it.
- **Source**: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html ("The termination process for instances running in a Capacity Block begins at 11:00AM Coordinated Universal Time (UTC) on the final day of the reservation." and "For `P6e-GB200` UltraServer Capacity Blocks, you must terminate your instances at least 60 minutes before the Capacity Block end time.").
- **Confidence**: high.
- **Evidence**: Fetched today.
- **Suggested replacement**: section 26: "EC2 starts terminating the instances 30 minutes before the block ends (60 minutes for a P6e-GB200 UltraServer block) and sends a warning event 40 minutes before the end. Queued jobs stay pending." Section 24: "ending at 11:30 UTC, with instances terminated from 11:00 UTC".

### 7. Section 28: "passes all 60 options" cannot happen in the pool the figure describes

- **Where**: `src/sections/Eks.tsx` lines 119 to 120 ("it creates four NodeClaims and passes 60 instance type options to EC2 Fleet"), line 124 (`60 types sent to EC2 Fleet`), lines 623 to 625 ("adds 59 larger types, and passes all 60 options to EC2 Fleet").
- **What is correct**: 60 is a ceiling. Karpenter sends the instance types that fit the pods and the NodePool, truncated to 60. A pool of one-GPU x86 G sizes of generation 5 and later with more than 20 GiB of GPU memory holds roughly two dozen types (five each in g5, g6 and g6e, two in gr6, three in g7e, plus G7), so the figure's request carries fewer than 60. The register's own use note for F10-403 already words it "up to 60".
- **Source**: register F10-403 (Karpenter v1.15.3 FAQ). The count of eligible G sizes and the truncation behaviour are from own knowledge.
- **Confidence**: medium to high.
- **Evidence**: Own knowledge, plus the register entry. No page fetched today.
- **Suggested replacement**: step 3 caption: "it creates four NodeClaims and passes every one-GPU G type the NodePool allows to EC2 Fleet (Karpenter sends at most 60 types per request)". Scheduler line: `one-GPU G types sent to EC2 Fleet`. Prose: "packs them by CPU, memory and GPUs onto the smallest instance type that fits the batch, adds larger types up to a total of 60, and passes those options to EC2 Fleet".

### 8. Section 27: the NodePool printed as "remove empty nodes" also moves running pods, and contradicts section 28

- **Where**: `src/sections/HyperPod.tsx` line 780 (title "NodePool: remove empty nodes, but not instantly") and line 793 (`consolidationPolicy: WhenEmptyOrUnderutilized`). Compare `src/sections/Eks.tsx` lines 673 to 674: "Only `WhenEmpty` leaves a running pod alone. By our reading the default can evict a training pod to repack it."
- **What is correct**: `WhenEmptyOrUnderutilized` lets Karpenter remove or replace a node that still runs pods. HyperPod's own page describes its managed Karpenter that way: "Karpenter regularly evaluates cluster for optimization opportunities, shifting workloads to eliminate underutilized nodes." A post-training pod on a node of this pool can therefore be evicted by consolidation, for example P2 on the On-Demand fallback node once a Spot group can supply capacity again. The title promises less than the policy does, and the two sections give opposite advice for the same kind of job.
- **Source**: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-autoscaling.html. Register F10-412 for the meaning of the three policy values.
- **Confidence**: high on what the policy means. Medium on whether HyperPod's managed Karpenter accepts `WhenEmpty` (AWS's printed example uses `WhenEmptyOrUnderutilized`; no page fetched today says which values it accepts).
- **Evidence**: Fetched today (autoscaling overview), plus the register entry.
- **Suggested replacement**: retitle to "NodePool: consolidate nodes, but not instantly", and add after the snippet: "`WhenEmptyOrUnderutilized` is the value AWS prints. It also lets Karpenter move a running pod to a cheaper node, so a run on this pool must checkpoint on a timer for that reason too. Section 28 uses `WhenEmpty` for the same kind of job; no HyperPod page read on 2026-11-20 says whether the managed Karpenter accepts it."

### 9. Section 26: the Spot group command fails unless the launch template carries the AMI and the security groups

- **Where**: `src/sections/AwsPcs.tsx` lines 374 to 383 (`CREATE_SPOT_GROUP`) and the `ours` note on lines 934 to 937.
- **Text that is wrong**: the command gives a custom launch template and no `--ami-id` or `--security-group-ids`, and the text does not say that the template must then provide both.
- **What is correct**: "If neither the command nor the launch template has an AMI or security groups, AWS PCS rejects the request."
- **Source**: https://docs.aws.amazon.com/pcs/latest/userguide/working-with_cng_create.html.
- **Confidence**: high.
- **Evidence**: Fetched today.
- **Suggested replacement**: add to the `ours` note: "The command names no AMI and no security group, so the launch template must carry both, or PCS rejects the request."

### 10. Section 26: the EFA launch template printed for the training group asks for a second network card that the figure's instance type does not have

- **Where**: `src/sections/AwsPcs.tsx` lines 398 to 421 (`EFA_TEMPLATE`, second interface with `"NetworkCardIndex": 1`), against line 58 (train group type `g6e.12xlarge`) and the reading note on lines 971 to 973.
- **What is correct**: the template is AWS's and is correctly copied, but an interface on network card 1 is valid only on instance types with more than one network card (for example p5.48xlarge). g6e.12xlarge has one network card, so the template as printed fails for the group the section draws. The note names the missing comma and not this.
- **Source**: EC2 instance type network specifications (own knowledge; not fetched).
- **Confidence**: medium.
- **Evidence**: Own knowledge, no fetch.
- **Suggested replacement**: extend the note: "Read it as an illustration: the second interface, as the page prints it, lacks a comma after its `SubnetId` line, and it sits on network card 1, which exists only on instance types with more than one network card. For a one-card type such as the g6e.12xlarge in the figure, keep the first interface only."

### 11. Section 26: the copied Lustre user data installs the client with an Amazon Linux 2 command

- **Where**: `src/sections/AwsPcs.tsx` line 392 (`amazon-linux-extras install -y lustre={{latest}}`) and lines 955 to 956.
- **What is correct**: `amazon-linux-extras` exists on Amazon Linux 2 only. On Amazon Linux 2023 the command is not found and the cloud-config step fails. Amazon Linux 2 reached end of support on 30 June 2026. The text says the PCS-ready image already carries the client, which avoids the failure only if the reader removes the line.
- **Source**: the snippet matches the PCS page (register F10-231). The Amazon Linux facts are from own knowledge.
- **Confidence**: medium.
- **Evidence**: Own knowledge, no fetch.
- **Suggested replacement**: "The first command installs the Lustre client the Amazon Linux 2 way; it does not exist on Amazon Linux 2023. The PCS-ready Deep Learning AMI already carries the client, so on that image delete the line and keep the two mount lines (our reading of the two pages together)."

### 12. Section 27: the figure's quotas do not cover the pods team worldmodel runs

- **Where**: `src/sections/HyperPod.tsx` lines 535 to 537 ("each team's allocation holds 2 g7e instances") against lines 139 and 173 to 174 (W1 to W3 run on the held ml.p5.48xlarge group; "W3 starts at once on an idle GPU of the held group").
- **What is correct**: task governance admits a pod against the team's compute allocation for the instance type it selects. With an allocation of g7e instances only, team worldmodel has no quota for p5 GPUs, so W1 to W3 would be admitted only by borrowing, or not at all. The illustration needs a p5 line in that team's allocation.
- **Source**: register F10-320 and F10-322 (allocation per instance type, borrowing).
- **Confidence**: medium.
- **Evidence**: Own knowledge, plus the register entries. No page fetched today.
- **Suggested replacement**: "As an illustration, each team's allocation holds 2 g7e instances, and team worldmodel's also holds the two held p5 instances. With the default borrow limit of 50 percent a team may borrow 1 more g7e instance (50 percent of 2)."

### 13. Section 26: the 5-second requeue delay holds on Slurm 25.11 and later only

- **Where**: `src/sections/AwsPcs.tsx` line 186 ("A requeued job is eligible again after 5 seconds by default") and lines 789 to 790 ("a requeued job is eligible again after 5 seconds by default; on Slurm 25.11 or later `--requeue=expedite` ...").
- **What is correct**: the release notes tie both to 25.11: the `requeue_delay` default of 5 seconds arrived with it, and before 25.11 the delay was tied to credential expiration, 70 seconds. The sentence scopes only the second half.
- **Source**: register F10-223 (PCS release notes for Slurm versions).
- **Confidence**: medium (register only).
- **Evidence**: Register entry, no fetch today.
- **Suggested replacement**: "On Slurm 25.11 or later a requeued job is eligible again after 5 seconds by default (70 seconds on earlier versions), and `--requeue=expedite` puts it back at the highest priority."

### 14. Section 27: scale from zero with the `Schedulable` node selector is assembled, not documented (lead to confirm)

- **Where**: `src/sections/HyperPod.tsx` lines 638 to 640 (node selector `sagemaker.amazonaws.com/node-health-status: Schedulable`) with line 657 ("Karpenter raises a Spot group from the node class from zero").
- **Why it may fail**: open-source Karpenter launches a node for a pending pod only if the NodePool can satisfy every node selector of the pod. A label that is put on the node after it joins, and that the NodePool does not declare, makes the pod incompatible with the pool, and nothing is launched. Whether HyperPod's managed Karpenter treats the health label as known is not stated on the autoscaling overview fetched today. The auto-resume page that prints the selector does not combine it with autoscaling.
- **Source**: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-autoscaling.html and https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-run-jobs-kubectl.html (neither covers the combination). Karpenter behaviour from own knowledge.
- **Confidence**: low. This is a risk to test, not a proven error.
- **Evidence**: Pages fetched today are silent; the mechanism is own knowledge.
- **Suggested replacement**: add after the numbered steps: "The auto-resume node selector and scale from zero are documented on separate pages. Confirm on a small cluster that a pod with the `Schedulable` selector makes Karpenter raise a group from zero before you rely on it."

---

## Verdict per section

- **24, Orchestrating Physical AI on AWS**: two small corrections (placement group with Capacity Blocks, finding 3; termination 30 minutes before the block ends, finding 6). No other technical error found.
- **25, AWS Batch**: one undocumented claim presented as documented (retry goes to the front of the queue, finding 5). The three JSON snippets are valid as printed.
- **26, AWS Parallel Computing Service**: no wrong service behaviour; five snippet and table issues (findings 3, 6, 9, 10, 11) and one version scope (finding 13).
- **27, Amazon SageMaker HyperPod**: one snippet that fails as printed (container name, finding 1), one misleading NodePool (finding 8), one inconsistent illustration (finding 12), one untested combination (finding 14).
- **28, Amazon EKS**: one submit instruction that fails as printed (finding 2), one NodePool that does not do what the text says (finding 4), one overstated figure step (finding 7), and the Capacity Block placement group case (finding 3).
- **29, Choosing (prose and tables only)**: no technical errors found.
