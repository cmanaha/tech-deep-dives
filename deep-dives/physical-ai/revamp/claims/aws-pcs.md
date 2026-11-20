# Claims: section 26, AWS Parallel Computing Service

claim | register ID

PCS is managed Slurm: AWS runs the controller; the user defines a cluster, queues and compute node groups; jobs run on EC2 instances the groups describe; the scheduler also launches the instances | F10-200
A compute node group with a minimum of 0 scales from zero and back; equal minimum and maximum means always-on nodes | F10-208
The controller has its own hourly fee, set by its size, whether or not jobs run | F10-240
A cluster is created from a name, a Slurm version, a size, one subnet and a security group; size, VPC and subnet are fixed at creation | F10-201
PCS generates Slurm's configuration files; only an allow-list of Slurm parameters can be set | F10-205
Controller sizes: Small up to 32 instances and 256 jobs, Medium up to 512 and 8192, Large up to 2048 and 16384; the job count includes running, pending and recently completed jobs (5 minutes by default); the size cannot be changed | F10-202
A queue is one Slurm partition, points at one or more compute node groups, and a group can serve more than one queue | F10-215
A queue carries partition settings such as a time limit and a priority tier | F10-216
A compute node group holds instance types, minimum and maximum counts, subnets, an image and one purchase option; all types in a group share architecture, vCPU count and GPU count | F10-206
The purchase option is one field with four values, ONDEMAND the default; mixing markets means several groups (our reading); AWS's example is an On-Demand queue and a Spot queue | F10-207
The launch template carries EFA interfaces, placement groups, capacity reservations and user data | F10-210
The PCS-ready Deep Learning AMI carries the PCS agent, Slurm, NVIDIA drivers and the Lustre client, and no ML framework | F10-212
GPUs are Slurm GRES, autodetected on Slurm 26.05 | F10-236
PCS switches simultaneous multithreading off on every node: 96 advertised vCPUs become 48 cores; Graviton types are unaffected | F10-213
The login node is a static On-Demand compute node group with the same image and mounts, attached to no queue | F10-227
PCS has no storage object; nodes mount EFS or FSx for Lustre at boot from launch template user data; a failed mount can keep instances from accepting jobs | F10-231
Managed accounting: PCS runs the database, sacct queries it from the login node | F10-226
Node states in the scaling log: LAUNCHED, REGISTERED, ACTIVE, TERMINATED (SCHEDULER_REQUESTED or EXTERNALLY_TERMINATED) | F10-219
Job states CF then R; a node that never registers is given about 30 minutes (Slurm's resume timeout); no nominal cold-start time is published | F10-221
scaleDownIdleTimeInSeconds defaults to 600 and can be overridden per compute node group | F10-218
ODCRs are targeted by ID (strict) or by a reservation group (extra On-Demand instances allowed) | F10-235
A Capacity Block takes one group; maximum count no larger than the block; nodes wait in a maintenance state; at expiry instances are terminated and jobs stay pending; warning event 40 minutes before | F10-234
UltraServers attach as Capacity Block groups; PCS configures the topology plugin; jobs need --exclusive and a user-supplied IMEX script | F10-237
PCS has supported P6e-GB200 and P6e-GB300 UltraServers since 18 June 2026 | F09-109
Job-level scaling: at regular intervals PCS reviews waiting jobs and launches instances; a job starts only when all its nodes are available | F10-217
A job in a shared queue is steered to a group with Slurm features and constraints | F10-225
Storage must be mounted before slurmd starts, because the node can accept jobs from then | F10-220
sbatch -p queue script, squeue --job id; AWS's multi-node script uses --exclusive, --nodes, --ntasks-per-node and srun | F10-228
EFA and the placement group are set in the launch template; AWS recommends a cluster placement group for an EFA group; security groups per interface | F10-233
An externally terminated instance is logged EXTERNALLY_TERMINATED and its node released for replacement; active jobs are requeued by default when a Capacity Block expires but "might have errors or fail"; AWS advises checkpointing for interruptible reservations | F10-222
A requeued job is eligible after 5 seconds by default; --requeue=expedite on Slurm 25.11 or later | F10-223
The Spot interruption sequence on PCS is our reading; no page documents drain, signal or requeue on a Spot notice | F10-244
Slurm 26.05, 25.11 and 25.05 are offered; 25.05 reaches end of life on 11/30/2026; AWS patches the controller | F10-203
The Slurm major version can be upgraded in place without interrupting running jobs | F10-204
Spot allocation strategy defaults to price-capacity-optimized | F10-209
A group with more than one subnet loses EFA between its nodes | F10-232
Node lifecycle actions run scripts at two boot stages; nodeBootstrapped runs before slurmd starts | F10-214
Default quotas: 10 compute node groups and 10 queues per cluster | F10-239
Jobs are processes on the AMI; no container runtime page in the User Guide as read (our reading) | F10-245
ParallelCluster hook mapping: OnNodeStart to nodeBootstrapped, OnNodeConfigured to nodeReady, OnNodeUpdated has no equivalent; no AWS page read says which to choose | F10-243
Managed Slurm REST API on port 6820, reachable only inside the cluster's VPC | F10-229
g6e.12xlarge has four GPUs (figure, instance type is this dive's choice) | F09-76
g6e.xlarge has one GPU (figure, instance type is this dive's choice) | F08-45
