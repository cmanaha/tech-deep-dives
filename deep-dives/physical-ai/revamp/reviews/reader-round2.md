# Reader review, round 2: sections 20 and 24 to 29

Reader: software and infrastructure engineer, level 100 to 200 on robotics, ML theory, simulation, HPC schedulers (never used Slurm) and GPU scheduling. Read sections 1 and 2 quickly, then 20, 24, 25, 26, 27, 28, 29 in order, from the rendered text in `/tmp/pai-text-r2/`. This is the "compute answer" route that section 2 offers (1, 2, then 20 onward), so nothing from sections 3 to 19 counted as known. Figures were not visible; captions and step captions were. Accuracy is not judged here.

## Scores

| Section | Score |
|---|---|
| 20, Fifteen Workloads, Five Shapes | 7.5 |
| 24, Orchestrating Physical AI on AWS | 7.5 |
| 25, AWS Batch | 8.5 |
| 26, AWS Parallel Computing Service | 8.5 |
| 27, Amazon SageMaker HyperPod | 7 |
| 28, Amazon EKS | 7.5 |
| 29, Choosing | 8 |
| Average | 7.8 |

No section fell below 7. Scale: 10 = followed everything and could explain it to a colleague; 7 = followed the main line, lost a few details; below 7 = lost the main line somewhere.

## Section 20, Fifteen Workloads, Five Shapes: 7.5

Main line followed: fifteen jobs, each fills one part of the machine first, three properties give five shapes. I could explain the parts table and the shapes table to a colleague. I lost detail in the opening figure and in the per-workload evidence list.

Where I got lost:

- "AWS Batch array job on Spot, one child per shard" (opening figure, card 2). First thing on the page after the intro, and array job, Spot, child and shard are all unexplained here. The caption defers the service to section 24, but the card is unreadable until then. "shard" is never defined in section 20 or 24.
- "One GPU: Batch, SageMaker. Many nodes: HyperPod, PCS" (card 4) and "AWS IoT Greengrass, a staged fleet rollout" (card 6). Four product names and "staged rollout" with nothing attached. PCS is an unexpanded acronym at this point.
- "Step 1 of 7" under a figure of six cards, in a section that then says "the loop's eight phases", after section 1 said "eight stages". I did not know whether the loop has six, seven or eight steps, or why the count changed.
- "On-robot inference: run it there, one call per chunk of actions". "chunk" is not explained on this route (section 2 names it as a term section 7 assumes, and says no more).
- "train ACT ... from scratch, or adapt a VLA ... from its checkpoint". Both acronyms are expanded with a pointer, which was enough to keep going. "checkpoint" is used here and only defined in section 24.
- "It ran 390 inferences per second, so it asked for 390 x 25.2 MB = 9.8 GB/s ... streamed 11.71 GB/s ... That is memory bandwidth, full." The paragraph opens with "A part is full when demand equals supply", then shows 9.8 against 11.71. I could redo the arithmetic but did not know why 84% counts as full.
- "The two memory parts differ by machine, which is why they are two parts." The paragraph gives 3.8 times on one and 2.4 times on the other and stops. I did not see how those two ratios show that bandwidth and latency are separate parts; the step from numbers to claim is left to me.
- "then: RTX renderers" (grid, simulated cameras row). RTX is not explained.
- "first: lightly: a small model" (grid, world-model training row). Two colons; I could not parse what "first: lightly" means as a cell value.
- "or have no row in NVIDIA's support matrix". The matrix had only appeared inside a citation label, so "the support matrix" arrived as if already introduced.
- "must keep up with 55.3 MB/s of raw pixels, by our arithmetic". The arithmetic is not shown here and the camera settings it comes from are not on this route. Number with no way to redo it.
- "One step is 26 stages." Number with no meaning attached: nothing says whether 26 is many or what follows from it. MuJoCo is also used here without a word on what it is.
- "One captioning run in the design notes of Cosmos Curator ..., cancelled before it completed, left 32 H100s at about 17% utilisation". The workload is "embed and deduplicate"; captioning had not been mentioned, and I did not know how a cancelled run supports the point.
- The evidence list under "Which part each workload fills first" (Collect through Vendor scale). From "GPU-parallel physics" onward it reads as a catalogue of product names and one number each: MuJoCo Warp, RTX 6000 Ada, Isaac Lab, Isaac Lab-Arena, L40, LeWorldModel, Cosmos3-Nano, GR00T N1, GB200 rack-scale systems. Only Cartpole and Cosmos Curator get a gloss. I kept the "which part" claim and dropped the names.
- "Engine build" listed under shape A, fan-out. The parts list had just said the build "occupies the target device's GPU and CPU for about 2 to 5 minutes" on the robot. I did not know what fans out.
- "2.79 GiB: one eighth of an L4, on g6f.large" and "one B300 training GPU". L4 and B300 are unexplained, and nothing has said a GPU can be sold in eighths.

Is / looks like / when / when not:

- The parts table does it well: "what it is" and "how you see it full" for all eleven parts. This was the strongest block in the section.
- The five shapes are defined by what they are (three properties) and each gets its workloads. Good.
- The fifteen workloads get one clause each on what they do. Enough.
- Not done: the instance families (G6, G6e, G7, G7e, P5, P6-B300) are named as if known. "The H100, the training GPU of EC2's P5 family" is the only one introduced.

Reads as a language model: little. "A computer is several machines sharing a box" is fine. "no cloud GPU at all" and "says nothing about how much" are mild. AV1 is expanded twice in two adjacent paragraphs with the identical parenthesis "(AOMedia Video 1, the codec LeRobot writes by default)".

## Section 24, Orchestrating Physical AI on AWS: 7.5

Main line followed: a place to run is an orchestrator plus a capacity market; most rows land on Batch; four services on three layers; Spot gives two minutes. The four "what it is / reach for it when / look elsewhere when" paragraphs are the best thing in the seven sections. I lost details where terms arrive one or two h2s before their explanation, and in "Glue and the edge".

Where I got lost:

- "HyperPod for a team that already runs Kubernetes or Slurm and wants a persistent cluster" (first h2). Slurm is used here, and again in the table as "a Slurm job array on AWS PCS", before the third h2 says "Slurm is the job scheduler of classic supercomputing". For a reader who has never used it this is the key term of the section.
- "A Batch job on G-family Spot" and "SageMaker HyperPod or AWS PCS, on reserved capacity" (table of fifteen). G family, P family and "reserved capacity" are explained two h2s later in "The capacity markets". PCS is written as an acronym in the figure and the table before it is expanded.
- "post-training on SageMaker HyperPod". "post-training" is not explained; I did not know if it means fine-tuning or something after training.
- "Steps one simulated arm per CPU core to produce rollouts." "rollouts" is not explained.
- "None of the fifteen is a service that stays up." Section 20 had a shape D, "Always on", with two workloads in it. I did not know how both are true.
- The "Job shape" column uses plain words ("Many small independent jobs", "One GPU for hours"), and the letters A to E from section 20 do not appear, until "The edge is shape E" in the last h2. I had to map the two vocabularies myself. Also, dataloader decode sits under Curate in section 20 and under Train here, and generative augmentation sits under "arriving finished" there and under Simulate here.
- Three-layer figure: "Amazon EKS: Kueue or KAI Scheduler, added by you" and "a Karpenter or Auto Mode node pool". Kueue and Karpenter are explained four paragraphs later; KAI Scheduler is never explained in this section. "Savings Plans: a discount on the bill" is all that is ever said about Savings Plans.
- "the regime an AWS post describes as 'the tens-of-nodes tail where failures are statistically frequent'". Tail of what? The quote did not explain itself.
- Comparison table: "from a login node", "Yes, with JobSet, which restarts all workers as one unit", "first in, first out, or fair share". Login node, JobSet and fair share are new here and get no line.
- "up to 64 instances per block, for up to six months, ending at 11:30 UTC". The 11:30 has no meaning attached.
- "the EKS guide's fast tier saves every 5 to 30 minutes". Fast tier of what?
- "The registry, the storage and the desk." One paragraph with managed MLflow, Mountpoint for S3, FSx for Lustre and Amazon DCV. Reads as a catalogue; I did not know what "the desk" meant until the last sentence, and nothing ties the four to the arm's pipeline.
- "The piece that belongs to this section is the return path, the component that sends episodes back", followed by a recipe that lists S3 buckets. The text then says "An uploader replaces the script". I was shown a different thing from the one announced.
- "three limits decide the choice", followed by four facts (dropping links, 100 Mbps and 200 ms, Jetson Linux absent, billed vCPUs capped at 32). I did not know which three, nor why the billing cap is a limit.
- "a Jetson beside a robot is a Greengrass core device". "core device" is not defined.
- "Placeholder, dated 2026-11-20. What will land here: ...". An unfinished block in the reading flow, just before the closing action.

Is / looks like / when / when not:

- Done fully for the four orchestrators ("is ... Reach for it when ... Look elsewhere when ...").
- Done for On-Demand, ODCR, Capacity Block, training plan and Spot as "what it is". "When to use" comes only for Spot and, by implication, ODCR for G families.
- Not done for Step Functions against OSMO, or for MLflow, Mountpoint, FSx, DCV: each is a one-line "what it is" with no "when not".

Reads as a language model: clean. No stock phrases noticed. The phrase "takes it apart" closes four consecutive paragraphs and then appears in sections 25 to 28 as well.

## Section 25, AWS Batch: 8.5

Followed everything on the main line and could explain it. I can picture the cluster (queue, scheduler, two compute environments Spot then On-Demand, S3 and ECR underneath, inside a VPC) and I followed child 7 from SubmitJob through a Spot interruption to its S3 object. The states figure and the "child 7" walk are what made it work.

Where I got lost:

- "AWS's post on NVIDIA Cosmos video models gives Batch the offline side". Offline side of what? The other side is not named.
- "A definition can be at most 24 KiB". Number with nothing attached; I did not know when I would hit it.
- "If a child node dies, Batch takes no action on the other nodes, so your launcher has to notice and end the job." "launcher" is not defined.
- "waits for it, and blocks later infrastructure updates". I did not know what an infrastructure update is at this point (it becomes clearer in the updatePolicy row much later).
- "two Fargate types that cannot run GPU jobs, or ECS_MANAGED_INSTANCES". The last one is a bare constant until the expandable block below.
- "on the ECS side a standalone task on a draining instance is 'unaffected' (that a Batch job is such a task is our reading), and the only signals the Batch guide documents belong to the timeout". Draining and standalone task are not explained, and the sentence carries three ideas. I got the conclusion (the job must save itself) from the next sentence, not from this one.
- "The ECS agent's own default is still off, so an environment untouched since before that date may not drain." The ECS agent has not been introduced, and since the container is "untouched" either way I did not know what draining changes for me.
- "The move to On-Demand in step 3" and "step 6 is the job's own code". The text names steps of the figure that the prose never describes; only step 1 of 11 has a caption I could read.
- "A crash in the script would match the catch-all rule". The retry rules are first shown about a hundred lines later.
- "keep a child under the 30 minutes the Spot guidance names" and, in the next h2, "We advise against running jobs that take an hour or more". Two limits for the same thing; I did not know which to design to.
- "an S3 Files volume (s3filesVolumeConfiguration), which presents an S3 bucket as a file system". Section 24 had "Mountpoint for Amazon S3 presents a bucket as a local file system" and warned it cannot rewrite files. I did not know whether these are the same thing, nor whether the warning applies to the checkpoint volume here.

Is / looks like / when / when not:

- Is: yes, twice (opening and first h2). Looks like: yes, the drawn cluster plus three config blocks. When: three bullet shapes. When not: four bullets. This section meets the standard completely.
- Each object under "Its moving parts" is defined by what it holds. Good.

Reads as a language model: "Get it right by / Get it right with" opens the remedy in four consecutive bullets of "What it does poorly", then the pattern returns in later sections. It reads as a template. Otherwise plain.

Said more than once inside the section: the Spot notice is not passed to the job (the drawn-cluster prose, step 5 of child 7, first bullet of "What it does poorly"); no preemption (first h2, the fine-tune paragraph, second bullet, hand-off); whole GPUs only (first h2, job definition, third bullet, "GPUs are still whole").

## Section 26, AWS Parallel Computing Service: 8.5

I have never used Slurm and I followed this. The six-item vocabulary list at the top (controller, compute node, partition, sbatch and srun, job array, GRES) is the reason: every later paragraph uses only those words. I can picture the cluster (login node, one queue, managed controller, a train group and an eval-spot group, FSx and EFS underneath) and I followed the two-node training job from sbatch through PD, CF, R and back to zero.

Where I got lost:

- "(ONDEMAND, the default; SPOT; CAPACITY_BLOCK; INTERRUPTIBLE_CAPACITY_RESERVATION)". The fourth is a bare constant. It comes back near the end as "written about interruptible capacity reservations" and in a citation as "I-ODCRs", never explained.
- "A queue also carries partition settings such as a time limit and a priority tier." "priority tier" is not explained.
- "with the PCS agent, Slurm, NVIDIA drivers and the Lustre client". The PCS agent is never said to be anything (the state figure later shows it "joined the cluster"), and Lustre is named two paragraphs before FSx for Lustre is explained.
- "AWS's suggested form is one more compute node group: static, On-Demand". "static" is not defined; I guessed minimum equals maximum from the earlier sentence on scaling shape.
- The expandable block on reserved GPUs: "through a reservation group", "sit in a Slurm maintenance state", "sets up Slurm's topology plugin itself", "jobs must use --exclusive" (explained only in the later script). Four Slurm or EC2 terms with no line each. Catalogue, though it is folded away.
- "trained here on two nodes so that eight GPUs share the work", with "#SBATCH --ntasks-per-node=1" and "srun starts one process per node". I did not see how one process per node uses four GPUs, and "--ntasks-per-node", "-J" and "-o ... %j" are the only script lines not explained.
- The section header promises "what happens between sbatch and the checkpoint on disk" and the script has "--requeue" and "--resume", but the four numbered steps of the training job have no step where a node is lost. The failure path is only told for the Spot array.
- "PCS documents three things here." The second ("When a Capacity Block expires, active jobs are requeued") is about a different event from the Spot loss the paragraph is on. I lost the thread for a sentence.
- "OnNodeStart corresponds to nodeBootstrapped, OnNodeConfigured to nodeReady, and OnNodeUpdated has no PCS equivalent." For a reader who has not used ParallelCluster this paragraph is a list of names in the main flow.
- "Read it as an illustration: the second interface, as the page prints it, lacks a comma after its SubnetId line." I stopped to wonder why a block known to be broken is printed.

Is / looks like / when / when not: all four present. "Use it when ... Look elsewhere when ..." in the first h2; the drawn cluster and the CLI blocks show what it looks like. Each moving part is defined by what it is ("A queue is one Slurm partition", "A compute node group is a set of rules for creating nodes").

Reads as a language model: "After this block you can say in two sentences what PCS is" (the "say in two sentences" payoff also heads the first h2 of sections 24, 25 and 27). "the next action is small" (section 25 ends on "Your next action is small."). Otherwise plain.

Said more than once inside the section: the 256-job limit of a Small controller appears five times (size table, the array paragraph, the configuration table, "What it does poorly", the closing action). Design for Spot loss with no warning appears three times.

## Section 27, Amazon SageMaker HyperPod: 7

I kept the main line (a standing cluster AWS repairs; instance groups; Kueue admits by quota, Karpenter adds nodes; a Spot notice becomes taint, evict, replace, resume) and I followed run P2 through its seven states. I can picture the cluster. I lost the thread in "Its moving parts", which is fourteen objects before the picture, and I was unsure throughout why the job I was following belonged on HyperPod.

Where I got lost:

- The running example against the section's own advice. The intro gives "3.4 hours for one 20,000-step run ... on a single ml.g7e.2xlarge", the worked run P2 is one GPU on a g7e Spot group, and the section says "One arm and one fine-tune a week is a SageMaker training job" and "Its best features are built for P-class nodes ... For a fleet of one-GPU G instances it is a managed node pool with Karpenter". Section 24 also said "Look elsewhere for a single one-GPU fine-tune". I did not know whether I was being shown the right use or the wrong one.
- "Team policy post-trains the arm's VLA" / "Creating it for a team named policy creates the namespace hyperpod-ns-policy" / "the cluster policy, and team policy's compute allocation". A team called "policy" next to the cluster policy object, the robot's policy, runPolicy and restartPolicy. I misread "team policy" as a kind of policy three times.
- "about 45 to 90 minutes depending on GPU count", then "for the 60-90 minutes a check takes", then "about a couple of hours". Three figures for one wait; I did not know which to plan with.
- "On EKS a training run is a PyTorchJob (the Kubeflow Training Operator's object) or a HyperPodPyTorchJob (the HyperPod training operator's)". Two operators with near-identical names, and nothing on when to use which. The worked example uses the first without saying why.
- "kueue.x-k8s.io/priority-class: training-priority" in the manifest, against priority classes named "training" and "evaluation" in the cluster policy block, after "A job that names a class missing from the policy fails at submission". I could not tell whether the manifest matches the policy.
- "the Kubeflow MPI operator, and the device plug-ins that expose NVIDIA GPUs, AWS Neuron accelerators and EFA". MPI is not expanded and AWS Neuron is not explained.
- "ordered by the Spot placement score of each group's Availability Zone". Spot placement score is not explained.
- "whether idle compute is shared by fair-share weight" and "PreemptTeamTasks (default LowerPriority)". Neither is explained; the block gives names, defaults and ranges ("default 50, range 0 to 10000") and moves on.
- "On Slurm it is a flag on one job step". "job step" was not in section 26's vocabulary list.
- "each team's allocation holds 2 g7e instances", while team worldmodel is described as running "on a held group of two eight-GPU instances on a training plan". I did not know what worldmodel's g7e allocation is for.
- The h2 promises "through a Spot notice and a failed node". The prose walks the Spot notice in five steps and in run P2; the failed node gets one sentence ("which node recovery handles. Step through both.") and lives only in figure steps I could not read.
- "Section 24 covers the three capacity markets themselves." Section 24 described On-Demand, ODCR, Capacity Block, training plan, Spot and Savings Plans. Which three?
- The node class block is named "multiazg6" and lists "auto-spot-c5-2x-az1"; the cluster block above defines "spot-g7e-az1" and "od-g7e-az1", and the node pool below is "g7e-pool" pointing at "multiazg6". Three naming schemes for one cluster.
- In the NodePool block, "budgets: - nodes: 90%", "expireAfter: 720h" and "consolidationPolicy: WhenEmptyOrUnderutilized" get no explanation; only consolidateAfter does.
- "Deep health checks, checkpointless training, network topology placement and training plans target multi-GPU P instances". "network topology placement" is new in this bullet.
- "Its moving parts" as a whole reads as a catalogue: fourteen bold objects, most with a version range, a default and a limit ("Supported Kubernetes versions are 1.30 to 1.35", "Add-on v1.6.1-eksbuild.1 installs Kueue v0.19.2", "at most 10", "up to 15 resources", "Since 16 March 2026"). I could not tell which of them I would touch for one run until the manifest.

Is / looks like / when / when not: "is" in the opening, "Use it when" and "Leave it when" in the first h2, the drawn cluster for what it looks like. All four present. The two-panel EKS and Slurm figure is a good "what it looks like" before the parts. Individual parts are mostly defined by what they are; cluster policy and compute allocation are defined by their fields.

Reads as a language model: little. "The challenge it meets is the long run on scarce hardware" is fine. "P-class" appears here where section 24 says "P family" and "P-family".

Said more than once inside the section: "45 to 90 minutes" four times; Spot and autoscaling are EKS-only four times; a held node bills with or without work three times.

## Section 28, Amazon EKS: 7.5

The opening chain (a pod asks for a GPU, Pending is the request for a machine, Karpenter launches, Kueue makes jobs wait, the device plugin makes the GPU visible) carried me through the section, and I could repeat it to a colleague. I can picture the cluster (kubectl, one ClusterQueue, Karpenter and kube-scheduler, a Spot NodePool and an On-Demand NodePool, S3) and I followed the four-pod sweep through Held, Requested, Interrupted, Recreated and Gone. I lost detail in the second half of "Its moving parts" and in the multi-node training case.

Where I got lost:

- "Batch GPU work on EKS is therefore Kubernetes plus four pieces", followed by five bullets. I did not know which four.
- "There is no percentage field for a Spot share; the one documented method, which Karpenter calls 'crude', spreads pods over a label." I could not picture what spreading pods over a label does.
- "Preemption is three fields per ClusterQueue, each Never by default: evict lower-priority work in the same queue, take back quota the cohort borrowed, or preempt in order to borrow." The third option did not mean anything to me.
- "Kueue's capacity-aware admission check is written for the Kubernetes cluster-autoscaler". Neither the admission check nor cluster-autoscaler had been introduced.
- "Three neighbours, one clause each." KAI Scheduler, JobSet and Kubeflow Trainer with a version number each. The paragraph says itself that it is a list. Section 27 had a "Kubeflow Training Operator" with a PyTorchJob; here it is "Kubeflow Trainer" with a TrainJob, and nothing says whether these are the same project.
- "The NVIDIA GPU Operator (v26.7.3) is the larger package that installs driver, toolkit, plugin, node labelling and monitoring together; on EKS images its driver and toolkit installs must be switched off." "toolkit" is not explained, Bottlerocket in the sentence before is not explained, and I did not know whether I need the operator at all.
- "MPS (Multi-Process Service). One physical GPU uses either MPS or time-slicing." Of the three sharing mechanisms this one gets no "when": the bullet only says what it excludes.
- The DRA paragraph: "for new deployments with Kubernetes versions 1.34 and later", "from v1.15 behind feature gates", "Auto Mode from Kubernetes 1.36", "still alpha". Four version gates in four sentences. I did not know whether the manifests later in the section use DRA or the device plugin, or which I should start with.
- "the node is replaced or rebooted, forcefully: on Auto Mode pods are deleted 'with a minimal grace period ...', while self-managed Karpenter v1.15.0 and later allows 5 or 10 minutes." Five or ten minutes of what, and what chooses between them?
- "with static provisioning only and not every POSIX file operation". "static provisioning" is not explained.
- "The Job runs in indexed mode, the standard Kubernetes form that hands each pod its own number". The manifest above it has no field that says so, and no volume for "/ckpt", which the next sentence says is S3-backed. I looked for both in the YAML.
- The Spot NodePool carries the taint "nvidia.com/gpu", and the text said a taint is ignored only by "pods with a matching toleration". Neither the Job nor the ResourceFlavor shown has one. I could not see how the pods land on the node.
- "To show the weighted fallback, the picture lets these pods run on either NodePool", and then "The recommended configuration below therefore pins a sweep to Spot and lets it wait." The picture shows the pattern the section advises against. It is said openly, but I had to hold two setups in my head.
- The TrainJob block ("my-trainjob", "torch-distributed", "ClusterTrainingRuntime", "activeDeadlineSeconds: 3600"). It is the documentation's sample, with no node count and nothing that sends it to the second NodePool. I could not follow this job the way I followed the sweep.
- "Interruption queue: On, with no Node Termination Handler beside it". Node Termination Handler is not explained.
- "karpenter.k8s.aws/instance-gpu-memory ... Gt ... 20480" in the NodePool. Not in the list of "Our choices" and not explained; I guessed MiB.
- "KAI's node-scale-adjuster, off by default, must be switched on". A component of a scheduler that got one clause earlier.
- After the hand-off list come two more paragraphs, "NVIDIA OSMO on EKS" and "EKS Hybrid Nodes". Both were covered in section 24. Here Hybrid Nodes has "Two limits" (connection, nothing about GPUs); section 24 said "three limits" and listed different ones.

Is / looks like / when / when not: all four present. "Use it when ... The typical moment ... Look elsewhere when ..." in the first h2. NodePool, EC2NodeClass, Kueue's objects and Auto Mode are each defined by what they are, and Auto Mode gets a full "what it manages / what you still write / what it does not let you set". The disruption table's third column ("For a running GPU job") is the best use of a table in these sections. Not done for MPS, DRA, the GPU Operator and the three "neighbours".

Reads as a language model: "Three consequences follow." (section 26 has the same sentence, section 27 "Two consequences follow."). "After this block you can say in five sentences". One "rather than" inside an AWS quote, which is fine.

Said more than once inside the section: checkpoint on a timer and not only on SIGTERM (first consequence, checkpoint quote, configuration table, first bullet of "What it does poorly", closing action); fail-over to On-Demand is discouraged (third consequence, recommendations, configuration table); the G Spot quota defaults to 0 (four checks, closing action).

## Section 29, Choosing: 8

The six-question path is clear and I could draw it from memory: part picks the family, a deadline sends the job to the robot, coupling and frequency pick the orchestrator, the cost of a stop and fixed dates pick the market. The closing table answers "where does my job go" in one row. The first third re-teaches what sections 24 to 28 already taught, and the last three rules of thumb are news items.

Where I got lost:

- "Ask the questions in this order", with four numbered items, then "Follow six questions" and a figure with six. Items 3 and 4 each hold two questions; I only saw that at the figure.
- Section 20 is titled for its five shapes (A to E) and this section says it joins "part and shape". The path never uses the five shapes; it asks about the three properties directly. "shape B in section 20" appears once, in one table cell. I expected "shape, therefore orchestrator" and had to rebuild the link myself.
- "The EKS best-practices guide: checkpoint a job that runs longer than 1 to 2 hours for a small model." By now I have "30 minutes or less" (Batch), "an hour or more" (Batch, section 25), "every 5 to 30 minutes" (EKS, sections 24 and 28) and this. The rule says the pages differ; the figure then uses "under 30 minutes" without saying why that one.
- "The edge as a node, for desk machines." The text under it is two facts (a 32 vCPU billing cap, Jetson Linux not validated). I did not know what the rule is.
- "Rendering capacity has a managed route. Since 18 November 2026 AWS Deadline Cloud, the managed render farm, supports G7". First mention of this service anywhere I read; nothing says whether it renders simulated cameras or something else.
- "The top of the range is a conversation ... No Rubin-based EC2 instance family is named or documented". Rubin is not explained, and neither sentence is a rule I can apply.
- Record and encode row: "a Step Functions task can submit a Batch job for each" and "The upload jobs: On-Demand or Spot Graviton." Section 24 called the upload "the event that starts the cloud side". I did not know what an "upload job" does.
- GPU-parallel physics row: "SageMaker Training Job for an occasional run; Batch when runs come back to back", "On-Demand with a list of types". Section 24's table has the same workload as "A Batch job on G-family Spot". Two answers for one row; I did not know which is current.
- "RobCo lists ...", "One customer, Telexistence ...", "One customer, RLWRLD, evaluates on g6e". Three customer names with one fact each. Telexistence supports a point; the other two read as name-dropping.
- "Company. Back-to-back runs favour a warm Batch fleet". I did not understand the label "Company" until the second sentence.
- "our cards are single runs of stand-in programs on two edge machines". "cards" comes from sections I did not read on this pass; noted only because it is used bare.

Is / looks like / when / when not: the "Orchestrators" paragraph gives one "is" sentence per service and question 4 gives the "when". "When not" is carried by the path (each branch excludes the others). Enough for a decision section. Graviton is explained here for the first time, after being used in sections 24 and 26.

Reads as a language model: "The top of the range is a conversation." "the answers are small" (after two "next action is small" in sections 25 and 26). "Keeping the choice honest" as a heading. Otherwise plain.

## Cross-cutting

Counts are from the rendered text files.

Said in several sections, could be said once:

- Slurm is introduced as if new five times: section 24 ("the job scheduler of classic supercomputing"), 25 ("the scheduler of high-performance computing clusters"), 26 (the full vocabulary), 27 ("the batch scheduler of classic supercomputing"), 29 ("the job scheduler of classic supercomputing"). The irony is that its first two uses, early in section 24, come before any of these.
- EFA is expanded and explained in sections 20, 24, 26 (twice), 27, 28 and 29. EKS is expanded in 24, 25, 27, 28 and 29. vCPU, VPC, AMI, EC2, EventBridge ("the AWS event bus") and NVLink are each expanded in two or three sections.
- Spot, the two-minute notice and "best effort" are explained in every one of 24 to 29. Section 24 says it "owns the capacity markets"; sections 25, 27, 28 and 29 each define Spot, On-Demand, Capacity Block and ODCR again.
- "At least 10 instance types" (24, 28, 29), price-capacity-optimized (24, 25, 26, 28), the EC2 advice against failing over to On-Demand (24, 28, 29), the Spot quota default of 0 (24, 28), "no G-family type on the Capacity Blocks or training plans lists" (24, 27, 29 twice), checkpoint on a timer and not on the notice (24, 25, 26, 27, 28).
- The AWS quote "the tens-of-nodes tail where failures are statistically frequent" appears in 24, 27 and 29, never explained. The "Training Jobs for a fully managed service, HyperPod for a team that already runs Kubernetes or Slurm" rule appears in 24 and 29.
- EKS Hybrid Nodes is told three times (24, 28, 29) with a different set of limits each time. NVIDIA OSMO is told twice (24, 28). Karpenter and Kueue are each introduced in 24, 27 and 28.
- The sentence "bought differently, even inside one cluster" closes a paragraph in both 24 and 29.
- The six-card loop figure is identical in sections 20 and 24.
- Each of 25 to 28 ends with a hand-off list naming the other three plus 24 and 29. Four near-identical lists.

Things that disagree between sections, from a reader's seat (not an accuracy judgement):

- The fifteen workloads are grouped and ordered one way in sections 20 and 29 and another way in section 24 (dataloader decode under Curate or under Train; generative augmentation under "arriving finished" or under Simulate). Sections 24 and 29 each have a placement table for the same fifteen, and a few rows give different answers (GPU-parallel physics, generative augmentation, simulated cameras).
- Six stages, seven steps, eight phases for the loop (sections 1, 20, 24).
- Where checkpoints go on S3: section 24 says Mountpoint "cannot modify existing" files and points checkpoints to FSx for Lustre; section 25 mounts "an S3 Files volume" for checkpoints; section 28 says the best-practices guide names the Mountpoint driver "as the place for checkpoints". I finished unsure.
- "P family", "P-family", "P-class", "P type" for the same thing.
- Section 2 gives the compute route as "20 to 25" and section 1's question table lists only 24 and 25 for the AWS question; the route figure marks 26 to 29 as well.

Terms that arrive before their explanation across sections:

- Slurm, PCS, G family, P family, Spot and "reserved capacity" in the first two h2s of section 24.
- "post-training" in section 24, explained in 27. "UltraServers" in 24, explained in 26. "Spot placement score" in 27, explained in 28. Graviton in 24 and 26, explained in 29. "checkpoint" in 20, explained in 24. "shard" in 20 and 24, never explained.

Reads as a template across the four orchestrator sections:

- First h2 payoff: "say in two sentences what X is" (24, 25, 26, 27), "say in five sentences" (28).
- "takes it apart" / "taken apart" eleven times across 24 to 29.
- "Three consequences follow" (26, 28), "Two consequences follow" (27), always the paragraph after the cluster figure.
- "Your next action is small" (25), "the next action is small" (26), "the answers are small" (29).
- "Get it right by" four times in a row in section 25.
- "read on 2026-11-20" and its variants: 2 times in section 24, 3 in 25, 6 in 26, 6 in 27, 7 in 28, 7 in 29. Past the second or third it reads as the author's research log and not as something I need.
- The shared skeleton itself (what it is, moving parts, the cluster drawn, one case end to end, recommended configuration, what it does poorly, where it hands off) helped me: by section 27 I knew where to look. The template feel comes from the repeated sentences, not the repeated structure.

Whether 25 to 28 let me picture the cluster and follow one job:

- 25 Batch: yes to both. Child 7 is the clearest job walk of the four.
- 26 PCS: yes to both, for the training job's happy path and the Spot array. No walk of a lost node for the training job.
- 27 HyperPod: picture yes. Run P2 followed through the Spot notice; the failed-node case is in the figure only. The followed job is the one the section says HyperPod is the wrong tool for.
- 28 EKS: picture yes. The four-pod sweep followed fully. The multi-node TrainJob not followed.
