# Claims: section 18, The Fleet

claim | register ID

## Title and opening

Title "A 6 GB Policy, a 2 GB Package and No Reverse Gear": pi0.5 "~6 GB+", 2 GB artifact quota, abort cancels only queued executions | F07-54, F07-87, F07-95

pi0.5 has 6 GB or more of weights to send to every arm ("~6 GB+" in NVIDIA's Jetson AI Lab tutorial, which runs it on a Jetson Thor); one component may carry at most 2 GB of artifacts, a third of 6 GB | F07-54, F07-87
AWS's device software installs what it delivers in packages called components | F07-122
The 6 GB is a size on disk, listed among the tutorial's storage prerequisites; it is what a deployment must move, and the 2 GB limit applies to files | F07-54, F07-87
Whether a policy that size fits in a smaller board's memory is a check to make on that board before planning its delivery; no entry places pi0.5 on an Orin Nano, and the section places it on no board | none (scope statement; see F07-36, F07-117)
The 2 GB artifact quota is not adjustable | F07-87
Greengrass is software on the device plus a cloud service; a device that runs it is a core device | F07-120, F07-121
The Java nucleus needs at least 96 MB of RAM; nucleus lite is documented at under 15 MB of memory (AWS's figure) | F07-84, F07-85
A component is a recipe plus artifacts; the recipe says what to fetch and how to start it | F07-122, F07-151
A deployment lists the components and versions a core device or a group should run | F07-123
6 GB over an illustrative 100 Mbit/s site link: 6 GB is 48,000 megabits, 48,000 / 100 = 480 s, 8 minutes for one arm alone; twenty at once share it for 160 minutes (Derived, arithmetic shown); the download cannot keep the example's notification pace (own paragraph after the rate) | F07-162
AWS's example deployment gives each device 5 minutes; a device still in progress at the limit counts as failed | F07-162
An abort cancels only queued executions; devices that took the update keep it; going back is a second deployment | F07-95, F07-164
Twenty arms and a hundred arms are illustrations; AWS's rollout example steps every 1,000 devices; the published fleet loop ran 16 robots | F07-93, F07-108, F07-162
At twenty arms the example's abort rule can never fire because it waits until 100 arms have been notified; its rate notifies the whole group within 3 minutes (10 at 5 a minute, then 10 at 10); its 5-minute limit fails an arm that needs 8 minutes | F07-162, F07-93, F07-94
Nothing in the section has been run on a device | none (scope statement)
The word rollout switches meaning from one run of a policy (sections 3, 8, 17) to the staged spread across a fleet | none (wording)

## Getting 6 GB through a 2 GB package

Artifacts are checked against a digest computed at version creation; a mismatch fails the deployment | F07-152
Lifecycle steps include install, run and startup | F07-128
The mechanisms are documented, and the three routes are designs built from them for weights this size (no absence claimed; F07-168 records that no page read documents such a pattern); the quota page does not say whether the 2 GB counts a docker: image, or give a maximum image size through Greengrass | F07-168
Route choice: image on a steady link if a multi-gigabyte docker: image deploys, split if refused or the link drops often, own S3 fetch last (our design, from the entries cited) | F07-168, F07-84, F07-157, F07-169, F07-170
The 2.18.4 changelog does not say whether a retried image pull resumes a layer | F07-84
Image route: docker: artifact pulled by the Docker application manager (the component that pulls images); since nucleus 2.18.4 an interrupted image pull is retried | F07-153, F07-84
S3 route: key in component configuration, fetched by install with token exchange credentials; install reruns at every start and times out at 120 s by default | F07-128, F07-160, F07-148
Split route: the nucleus checks each artifact's digest and resumes a broken S3 download with an HTTP Range request (which asks only for the missing bytes), retried once a minute with no limit (code read at v2.18.4) | F07-152, F07-169
Split route: weights not already in files of under 2 GB need an install step that joins the pieces, and disk for the joined copy (reasoning, no figure given) | F07-87, F07-170
Component store is 10 GB by default and counts what is stored; two 6 GB versions need 12 GB | F07-170
Both AWS samples that run a model on a Jetson start a GPU container from a recipe; the Physical AI Toolchain sample fetches its model file (policy.trt) as a separate S3 artifact | F07-157, F07-195
AWS's Physical AI Toolchain sample points an inference component at latest/policy.trt and creates no deployment | F07-196
5,000 versions per component per Region; a loop that registers every hourly checkpoint, deployed or not, runs out in about 208 days (5,000 / 24) | F07-167
A new S3 key passed in the deployment's configuration spends no component version, the one point in favour of the S3 route (reasoning from the two entries) | F07-160, F07-167
An image reference with no tag or digest pulls "the latest available version of that image" at deploy time | F07-154
Run lets a deployment complete successfully even if the run script fails soon after | F07-129

## When an update lands in the middle of an episode

NOTIFY_COMPONENTS: the nucleus asks components before replacing them; a component can defer with its own delay; no answer within 60 s and the deployment proceeds | F07-90
Deferral needs IPC, an accessControl policy, the socket mounted and two environment variables (SVCUID, AWS_GG_NUCLEUS_DOMAIN_SOCKET_FILEPATH_FOR_COMPONENT) in a container; AWS's container recipe has none | F07-155
Nucleus lite v2.7.0 README lists 12 IPC operations and not SubscribeToComponentUpdates or DeferComponentUpdate | F07-137
Beside an arm, run the Java nucleus: nucleus lite saves more than 81 MB (96 - 15), little on a board with gigabytes, and gives up the deferral (Derived; advice from the entries) | F07-84, F07-85, F07-137, F07-90
The swap belongs at a moment when the arm can stand still with the gripper empty | none (advice; what the servos do without commands is not claimed)
The AWS IoT jobs service can schedule into a maintenance window; a Greengrass deployment exposes only rollout, abort and timeout settings | F07-179
On lite, an update stays away from a moving arm only if the arms stay idle from the deployment's creation until each has swapped, up to 160 minutes of download on the illustrative link (reasoning; Derived) | F07-137, F07-162
The control loop runs inside the policy container | section 17, Running on the Robot
startup keeps the deployment IN_PROGRESS until the component reports RUNNING or ERRORED, which it does itself with the UpdateState IPC operation | F07-129
Inside a container the report goes through the same mounted socket and variables the deferral needs; UpdateState is among lite's 12 operations, so both nuclei offer it | F07-155, F07-137
A failed deployment rolls the core device back to its previous configuration by default | F07-163
Three errors without recovery leave a component BROKEN until redeployed | F07-130
All four container recipes on AWS's Docker page start the container under Run | F07-156
Core device status is HEALTHY or UNHEALTHY; unhealthy means a component in an error state | F07-131

## Rollout settings for tens of arms

A staged update goes first to a canary group, a few arms that take it before the rest | none (definition; F07-165 use line)
A job execution is a job's instance on one device | F07-178
With all twenty notified within 3 minutes, all can be downloading together, and on the illustrative link none finishes in 8 minutes (reasoning) | F07-93, F07-162

A thing is AWS IoT's record of one device; a thing group is a named set of things | F07-121, F07-123
A group deployment is sent as an AWS IoT job; its options are the same options any AWS IoT Core job takes (paraphrase of "identical to the configuration options for AWS IoT Core jobs") | F07-162, F07-178
The example deployment document: 30 s component wait, rate 5 per minute doubling at 10 notified or 5 succeeded, maximum 50, abort at 5% after 100, 5-minute timeout | F07-161, F07-162
The in-progress timeout starts at IN_PROGRESS; TIMED_OUT counts under failure type ALL; range 1 minute to 7 days | F07-162, F07-94
On the illustrative link one arm needs 8 minutes and twenty together up to 160, so under the example's 5 every arm is marked TIMED_OUT; once the abort can fire, those timeouts alone cross its threshold and cancel a good policy (reasoning) | F07-162, F07-94
Set the timeout above a download measured with as many arms at once as the rate allows, plus install and start-up (advice) | F07-162
The abort cannot fire until minNumberOfExecutedThings devices have been notified | F07-94
Advice: set the minimum to a count the group reaches while most arms are still queued, and the threshold where the first failures you would not accept cross it | F07-94 (advice)
Minimum 5 with a 20% threshold is a toy example (Toy) | none
The rate rises on whichever of notified or succeeded is reached first; notifications reach their count whatever the arms report, so the example doubles after 10 / 5 = 2 minutes and notifies all twenty before any arm can finish its download on the illustrative link (reasoning) | F07-93, F07-162
AWS's rate example steps every 1,000 devices, a fleet fifty times the illustrative twenty (Derived, 1,000 / 20) | F07-93
A device must be programmed to report FAILURE | F07-96
Trial-gate design (startup held through trial episodes, startup timeout raised) is ours, from documented parts, untested | F07-96, F07-128, F07-129
The trial's judge: LeRobot's reinforcement-learning setup offers a small image classifier trained beforehand on success and failure frames, or a person marking success with a gamepad or keyboard (pointer to section 8, Reinforcement Learning for Robots) | F04-74, F04-77
A device runs the union of deployments; a thing and a group deployment that pin different versions fail with "No local or cloud component version satisfies the requirements" | F07-125, F07-126
Subdeployment, which targets a subset of a parent deployment's devices (paraphrase of the definition); the subdeployment page does not say whether one may pin a different version (W3-U5; scope narrowed to that page) | F07-165

## A brake and no reverse gear

The abort saves only arms still queued when failures start; at the example's pace on the illustrative link all twenty are notified within 3 minutes and none can download and fail to start in under 8, so the abort acts only after every arm has been told to update; for tens of arms the canary group is the brake (reasoning on cited entries; no claim about whether a notified arm is still QUEUED) | F07-94, F07-95, F07-162, F07-93
A constant rate may go as low as 1 arm a minute | F07-92
Rollout figure (Toy counts, invented): of twenty arms, three canaries in their own thing group and seventeen in the fleet group; the abort cancels the eight still queued, the seven updated keep the new version, and the two that failed are back on 1.4.0 by the default failure handling | F07-95, F07-163, F07-165

CANCEL is the only abort action; only QUEUED executions are cancelled; in-progress ones are not | F07-94, F07-95
Cancelling a deployment does not change components on devices already running it | F07-164
Default failure handling rolls back one device; across the fleet there is no automatic undo | F07-89, F07-163, F07-164
A new revision for the same target cancels the previous revision's job | F07-164
A new deployment overwrites the previous one; components left out are uninstalled | F07-124
A deployment installs latest supported dependency versions; a nucleus update can restart devices | F07-166

Corrections list (each restates a claim argued and cited earlier in the section):
Name the image by digest in the artifact URI and the docker run line | F07-154
Add the GPU flag both AWS samples pass on a Jetson, --runtime nvidia | F07-157
Start under startup; the policy reports RUNNING with UpdateState only after a warm-up inference or trial episodes (trial design ours) | F07-129, F07-96
Raise startup's 120 s default timeout | F07-128
Grant SubscribeToComponentUpdates and DeferComponentUpdate in an accessControl policy | F07-155, F07-137
Mount the nucleus socket; pass SVCUID and AWS_GG_NUCLEUS_DOMAIN_SOCKET_FILEPATH_FOR_COMPONENT | F07-155
Start the deployment document from the current revision so it lists every component | F07-124
Pin the nucleus, Docker application manager and token exchange service | F07-166
minNumberOfExecutedThings to a count the group reaches while most arms are queued, threshold where the first unacceptable failures cross it; 5 and 20% are toy numbers | F07-94
inProgressTimeoutInMinutes above a measured download plus install and start-up | F07-162
Canary thing group first, fleet group after the canaries' records | F07-125

The AWS pages read describe no managed update of a Linux device's operating system | F07-185
On a Jetson the operating system is Jetson Linux, shipped in NVIDIA's JetPack release; NVIDIA documents image-based OTA tools and no fleet service | F07-44, F07-186

## Episodes back

Example dataset: 775 MB per robot-hour, 0.86 Mbit/s per camera; 1.72 Mbit/s and 0.215 MB/s per arm (Derived); raw 640 x 480 x 3 bytes x 30 fps x 2 cameras x 3,600 s = 199 GB/h, about 257 times (199 GB / 775 MB) | F05-29, F05-30
The return traffic flows whenever the arm records (the per-hour figures assume recording all hour) | F05-30
The raw-video and Robot Data Factory comparisons sit in an expandable panel, "For scale" (placement only) | none
The two limits split the traffic: files to S3, a per-episode record over MQTT (reasoning from the message and rate limits; no AWS guidance located, F07-176 use line) | F07-176, F07-97
Twenty arms send about 34 Mbit/s; an illustrative hundred 172 Mbit/s, more than the illustrative 100 Mbit/s link (Derived, Toy counts) | F05-30
An illustrative hundred arms' 172 Mbit/s exceeds a symmetric 100 Mbit/s link upstream (Derived) | F05-30
120 GB per rollout to twenty arms equals 7.7 hours of their recording at 15.5 GB/h (Derived) | F05-30, F07-54
Robot Data Factory robot at 38.41 MB/s is 307 Mbit/s, about three times the illustrative link (Derived) | F07-106
MQTT message limit 128 KB, 512 KB/s per connection; one arm's 0.215 MB/s fits the rate; a 200 MB file is about 1,600 messages (Derived) | F07-97, F05-20, F05-30
LeRobot video files grow to 200 MB before the next starts | F05-20
Basic Ingest and the S3 rule action; no messaging cost; one object per message with a timestamped key | F07-176
Device shadow: desired, reported, delta; readable offline | F07-177
Fleet indexing makes registry and shadows searchable; one query can find arms on a new policy whose success rate fell (no query syntax quoted) | F07-182
Nucleus lite has no shadow support of its own (matrix row "Interact with device shadows: No") | F07-135, F07-177
LeRobot appends episodes to one MP4 until the size target; a file closes about every 31 minutes at 387 MB per camera-hour (Derived) | F05-19, F05-30
Parquet files are valid only after finalize(), which lerobot-record calls after the last episode, so the rows can be shipped only once a recording session ends | F05-3
The verdict a rollout waits for travels as the per-episode MQTT record, so it does not wait for the Parquet files (reasoning) | F07-176, F05-3
The sentry strategy sets boundaries so each saved episode produces a complete video file; LeRobot uploads to the Hugging Face Hub | F07-112
Stream manager queues and exports in the background; 70 MB RAM beyond the core software | F07-171
Stream manager on lite since 2.2.0; stream manager is itself a Java program (JVM_ARGS setting) | F07-139
Where a small board runs nucleus lite, write the direct component, since stream manager is a Java program needing at least 70 MB where lite is documented at under 15 MB (advice from the three entries) | F07-139, F07-171, F07-85
Export task per file, in order, Success status | F07-172
Multipart above a 5 MB minimum threshold, bandwidth cap, 5 threads, priority 1 to 10, one file at a time per stream | F07-173
A direct uploader uses an AWS SDK with token exchange credentials | F07-175
96 + 70 = 166 MB before any policy loads, little beside a board's gigabytes (no board or policy size named) | F07-84, F07-171
200 MB at 5 MB parts is 40 parts; the stream manager pages do not say whether it resumes an upload after a reboot (W3-U6; scope narrowed to those pages) | F07-102, F07-173
A direct uploader's upload code is yours; AWS's example recipe of that kind (printed in section 24) only lists buckets | F07-175, section 24, Orchestrating Physical AI on AWS
The Learning While Deploying spans show how fast a loop with no staging can close: under a minute each way at the median (41 s, 38 s), with a broadcast learner on the authors' own network and model; staging a 6 GB policy on the illustrative link adds the canary wait to the download | F07-109, F07-162 (reasoning)
Deploy to the whole fleet group at once where a fresher policy is worth more than a brake; stage through the canaries where an arm running a bad policy costs more than the wait (advice) | none (advice)
Learning While Deploying: 16 two-armed robots, uploads at episode boundaries, broadcast every 50 steps; 41 s median (148 s p99) episode to learner; 38 s (55 s) model to robot; network caveat | F07-108, F07-109
Robot Data Factory: 38.41 MB/s, 3.32 TB per robot per day, modelled; about 179 times the arm's 0.215 MB/s (Derived) | F07-106, F05-30
Three canaries downloading 6 GB together on the illustrative link need about 24 minutes before the first trial episode (Derived) | F07-162

## Greengrass core device or EKS hybrid node

Everything so far assumes a Greengrass core device, which takes its deployment whenever it next connects; each machine is placed, as a core device or a hybrid node, before it is hooked up (tie sentence) | F07-123
Hybrid Nodes joins a machine outside AWS's cloud to an EKS cluster as a worker node, so the scheduler that places training pods on cloud GPUs can place a pod on it | F09-119
DGX Spark, NVIDIA's desk-side machine (identification, as in the on-robot and workloads glossaries), which can serve the policy to an arm through LeRobot's remote inference (remote inference moves the checkpoint to a policy server; the Spark as that server is our reasoning) | F07-25
Greengrass treats offline as normal; a device receives the deployment when it next connects | F07-123
Hybrid Nodes "is not a fit for disconnected, disrupted, intermittent or limited (DDIL) environments"; pods keep running; a node on Systems Manager credentials (one of two credential sources) may take up to 30 minutes to rejoin | F09-119, F09-125, F09-120
Greengrass dials out only, port 8883 or 443 | F07-189
Hybrid nodes need private connectivity both ways; guidance 100 Mbps and 200 ms, "not a strict requirement" | F09-120
Pod network Cilium or Calico; VPC CNI incompatible | F09-123
The hybrid node pages read say nothing about GPUs | F09-122
A VPN or AWS Direct Connect, a private link to AWS | F09-120, F09-127
OS table lists Ubuntu 24.04; Jetson Linux and DGX OS are not rows | F09-121
Greengrass names Armv8 (AArch64) and no distribution | F07-140
No documented container recipe passes a GPU flag; two samples add one | F07-156, F07-157
Jetson is a Greengrass core device; DGX Spark a hybrid node only on EKS, wired, with VPN or Direct Connect and someone to run a pod network (our reading badge) | F09-127
RoboMaker end of support September 10, 2025; documentation 404 | F07-98, F07-100
Greengrass V1 ended October 7, 2026 | F07-99
IoT Core, Greengrass V2 and Device Management in no lifecycle list on 2026-11-20 | F07-191
Secure tunneling on both nuclei | F07-183
No AWS page on managed Linux OS update located; NVIDIA documents Jetson Linux update tools and no fleet service (now in "A brake and no reverse gear") | F07-185, F07-186

## The hook-up

None of the AWS posts and samples from 2025 or 2026 that were searched runs a GPU policy container on a Jetson with Greengrass V2 and uploads episodes to S3 (scope: the searches and repositories of F07-199) | F07-199
Placeholder: our own hook-up of a Jetson Orin Nano Super and a DGX Spark, not yet done (wording unchanged; items set one per line) | none
Account side: thing, thing group, IoT policy, token exchange role, role alias (the name through which the certificate reaches the role); automatic or manual provisioning | F07-144, F07-145, F07-148
Four outbound endpoints for basic operation (Greengrass data plane, IoT data, credentials, S3) on 8883 or 443 (MQTT) and 8443 or 443 (HTTPS); a private image adds ECR's endpoints | F07-190
Java nucleus needs Java 8 or later; lite package readme names Ubuntu 24.04 | F07-84, F07-143, F07-142, F07-137
The default token exchange policy has no S3 access; add s3:GetObject, ecr:GetAuthorizationToken, ecr:BatchGetImage, ecr:GetDownloadUrlForLayer, s3:PutObject, s3:AbortMultipartUpload and s3:ListMultipartUploadParts | F07-149, F07-175
Local deployment with the Greengrass CLI | F07-127
Cloud deploy to a thing, then group | F07-125
Uploader and fleet provisioning with a shared claim certificate | F07-174, F07-146

## Lookup panels (at the end of the section)

Deployment limits and defaults:

Recipe 16 KB; documents 7 KB, 31 KB, 6 MB; CreateComponentVersion 1/s; 30/s; 5,000 components | F07-87, F07-167
Polling every 15 s | F07-167
Lifecycle timeouts | F07-128
20 MB free disk; checksum retries 10 | F07-170, F07-169
Rate bounds | F07-92
Abort criteria fields | F07-94
MQTT 128 KB, 100 publishes/s, 512 KB/s | F07-97
Shadow 8 KB | F07-177
Multipart 10,000 parts, 5 MiB to 5 GiB, 48.8 TiB | F07-102
Stream buffer 256 MB | F07-173
Credentials one hour; an IoT policy change can take 6 to 8 minutes | F07-148, F07-188

Retired and neighbouring services panel: RoboMaker, Greengrass V1, lifecycle lists, secure tunneling | F07-98, F07-100, F07-99, F07-191, F07-183
