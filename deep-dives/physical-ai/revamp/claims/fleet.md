# Claims: section 18, The Fleet

claim | register ID

## Title and opening

Title "A 6 GB Policy, a 2 GB Package and No Reverse Gear": pi0.5 "~6 GB+", 2 GB artifact quota, abort cancels only queued executions | F07-54, F07-87, F07-95

pi0.5's weights are "~6 GB+" in NVIDIA's Jetson AI Lab tutorial on Jetson Thor, three times the 2 GB a component's artifacts may total | F07-54, F07-87
The 2 GB artifact quota is not adjustable | F07-87
Greengrass is software on the device plus a cloud service; a device that runs it is a core device | F07-120, F07-121
The Java nucleus needs at least 96 MB of RAM; nucleus lite uses less than 15 MB | F07-84, F07-85
A component is a recipe plus artifacts; the recipe says what to fetch and how to start it | F07-122, F07-151
A deployment lists the components and versions a core device or a group should run | F07-123
6 GB over an illustrative 100 Mbit/s site link: 6 x 8,000 / 100 = 480 s, 8 minutes for one arm alone; twenty at once share it for 160 minutes (Derived, arithmetic shown) | F07-162
AWS's example deployment gives each device 5 minutes; a device still in progress at the limit counts as failed | F07-162
An abort cancels only queued executions; devices that took the update keep it; going back is a second deployment | F07-95, F07-164
Twenty arms and a hundred arms are illustrations; AWS's rollout example steps every 1,000 devices; the published fleet loop ran 16 robots | F07-93, F07-108, F07-162
At twenty arms the example's abort rule can never fire, its rate notifies the whole group within 3 minutes (10 at 5 a minute, then 10 at 10), and its 5-minute limit fails an arm that needs 8 minutes | F07-162, F07-93, F07-94
Nothing in the section has been run on a device | none (scope statement)
The word rollout switches meaning from one run of a policy (sections 3, 8, 17) to the staged spread across a fleet | none (wording)

## Getting 6 GB through a 2 GB package

Artifacts are checked against a digest computed at version creation; a mismatch fails the deployment | F07-152
Lifecycle steps include install, run and startup | F07-128
None of the three routes is a documented pattern for weights; whether the quota counts a docker: image is not documented; no published maximum image size | F07-168
Route choice: image on a steady link if a multi-gigabyte docker: image deploys, split if refused or the link drops often, own S3 fetch last (our design, from the entries cited) | F07-168, F07-84, F07-157, F07-169, F07-170
The 2.18.4 changelog does not say whether a retried image pull resumes a layer | F07-84
Image route: docker: artifact pulled by the Docker application manager; since nucleus 2.18.4 an interrupted image pull is retried | F07-153, F07-84
S3 route: key in component configuration, fetched by install with token exchange credentials; install reruns at every start and times out at 120 s by default | F07-128, F07-160, F07-148
Split route: the nucleus checks each artifact's digest and resumes a broken S3 download with an HTTP Range request, retried once a minute with no limit (code read at v2.18.4) | F07-152, F07-169
Component store is 10 GB by default and counts what is stored; two 6 GB versions need 12 GB | F07-170
Both AWS samples that run a policy on a Jetson start it as a container | F07-157
AWS's Physical AI Toolchain sample points an inference component at latest/policy.trt and creates no deployment | F07-196
5,000 versions per component per Region; about 208 days at one per hour (5,000 / 24) | F07-167
An image reference with no tag or digest pulls "the latest available version of that image" at deploy time | F07-154
Run lets a deployment complete successfully even if the run script fails soon after | F07-129

## When an update lands in the middle of an episode

NOTIFY_COMPONENTS: the nucleus asks components before replacing them; a component can defer with its own delay; no answer within 60 s and the deployment proceeds | F07-90
Deferral needs IPC, an accessControl policy, the socket mounted and two environment variables (SVCUID, AWS_GG_NUCLEUS_DOMAIN_SOCKET_FILEPATH_FOR_COMPONENT) in a container; AWS's container recipe has none | F07-155
Nucleus lite v2.7.0 README lists 12 IPC operations and not SubscribeToComponentUpdates or DeferComponentUpdate | F07-137
The swap belongs at a moment when the arm can stand still with the gripper empty | none (advice; what the servos do without commands is not claimed)
The AWS IoT jobs service can schedule into a maintenance window; a Greengrass deployment exposes only rollout, abort and timeout settings | F07-179
The control loop runs inside the policy container | section 17, Running on the Robot
startup keeps the deployment IN_PROGRESS until the component reports RUNNING or ERRORED | F07-129
A failed deployment rolls the core device back to its previous configuration by default | F07-163
Three errors without recovery leave a component BROKEN until redeployed | F07-130
All four container recipes on AWS's Docker page start the container under Run | F07-156
Core device status is HEALTHY or UNHEALTHY; unhealthy means a component in an error state | F07-131

## Rollout settings for tens of arms

A thing is AWS IoT's record of one device; a thing group is a named set of things | F07-121, F07-123
A group deployment is sent as an AWS IoT job; its options are identical to IoT Core job options | F07-162, F07-178
The example deployment document: 30 s component wait, rate 5 per minute doubling at 10 notified or 5 succeeded, maximum 50, abort at 5% after 100, 5-minute timeout | F07-161, F07-162
The in-progress timeout starts at IN_PROGRESS; TIMED_OUT counts under failure type ALL; range 1 minute to 7 days | F07-162, F07-94
In our reading, a healthy arm on an 8-minute download would time out under 5 minutes and count toward the abort | F07-162, F07-94
The abort cannot fire until minNumberOfExecutedThings devices have been notified | F07-94
Minimum 5 with a 20% threshold is a toy example (Toy) | none
The rate rises on whichever of notified or succeeded is reached first | F07-93
A device must be programmed to report FAILURE | F07-96
Trial-gate design (startup held through trial episodes, startup timeout raised) is ours, from documented parts, untested | F07-96, F07-128, F07-129
A device runs the union of deployments; a thing and a group deployment that pin different versions fail with "No local or cloud component version satisfies the requirements" | F07-125, F07-126
Subdeployment definition; whether one may pin a different version is not documented | F07-165

## A brake and no reverse gear

The abort saves only arms still queued when failures start; at the example's pace all twenty are notified within 3 minutes, before any can download and fail to start; for tens of arms the canary group is the brake (reasoning on cited entries) | F07-94, F07-95, F07-162, F07-93
A constant rate may go as low as 1 arm a minute | F07-92

CANCEL is the only abort action; only QUEUED executions are cancelled; in-progress ones are not | F07-94, F07-95
Cancelling a deployment does not change components on devices already running it | F07-164
Default failure handling rolls back one device | F07-89, F07-163
A new revision for the same target cancels the previous revision's job | F07-164
A new deployment overwrites the previous one; components left out are uninstalled | F07-124
A deployment installs latest supported dependency versions; a nucleus update can restart devices | F07-166

## Episodes back

Example dataset: 775 MB per robot-hour, 0.86 Mbit/s per camera; 1.72 Mbit/s and 0.215 MB/s per arm (Derived); raw 199 GB/h, about 257 times | F05-29, F05-30
Twenty arms send about 34 Mbit/s; an illustrative hundred 172 Mbit/s, more than the illustrative 100 Mbit/s link (Derived, Toy counts) | F05-30
An illustrative hundred arms' 172 Mbit/s exceeds a symmetric 100 Mbit/s link upstream (Derived) | F05-30
120 GB per rollout to twenty arms equals 7.7 hours of their recording at 15.5 GB/h (Derived) | F05-30, F07-54
Robot Data Factory robot at 38.41 MB/s is 307 Mbit/s, about three times the illustrative link (Derived) | F07-106
MQTT message limit 128 KB, 512 KB/s per connection; one arm's 0.215 MB/s fits the rate; a 200 MB file is about 1,600 messages (Derived) | F07-97, F05-20, F05-30
LeRobot video files grow to 200 MB before the next starts | F05-20
Basic Ingest and the S3 rule action; no messaging cost; one object per message with a timestamped key | F07-176
Device shadow: desired, reported, delta; readable offline | F07-177
Fleet indexing makes registry and shadows searchable | F07-182
Nucleus lite cannot use shadows | F07-135
LeRobot appends episodes to one MP4 until the size target; a file closes about every 31 minutes at 387 MB per camera-hour (Derived) | F05-19, F05-30
Parquet files are valid only after finalize() | F05-3
The sentry strategy sets boundaries so each saved episode produces a complete video file; LeRobot uploads to the Hugging Face Hub | F07-112
Stream manager queues and exports in the background; 70 MB RAM beyond the core software | F07-171
Stream manager on lite since 2.2.0 | F07-139
Export task per file, in order, Success status | F07-172
Multipart above a 5 MB minimum threshold, bandwidth cap, 5 threads, priority 1 to 10, one file at a time per stream | F07-173
A direct uploader uses an AWS SDK with token exchange credentials | F07-175
96 + 70 = 166 MB, taken from the 8 GB of an Orin Nano (Derived) | F07-84, F07-171, F07-36
200 MB at 5 MB parts is 40 parts; resume after reboot is not documented | F07-102, F07-173
A staged rollout pays the same download as a broadcast and adds the canary wait | F07-109, F07-162 (reasoning)
Learning While Deploying: 16 two-armed robots, uploads at episode boundaries, broadcast every 50 steps; 41 s median (148 s p99) episode to learner; 38 s (55 s) model to robot; network caveat | F07-108, F07-109
Robot Data Factory: 38.41 MB/s, 3.32 TB per robot per day, modelled; about 179 times the arm's 0.215 MB/s (Derived) | F07-106, F05-30
Three canaries downloading 6 GB together on the illustrative link need about 24 minutes before the first trial episode (Derived) | F07-162

## Greengrass core device or EKS hybrid node

Hybrid Nodes joins an on-premises machine to an EKS cluster as a worker node | F09-119
Greengrass treats offline as normal; a device receives the deployment when it next connects | F07-123
Hybrid Nodes "is not a fit for disconnected, disrupted, intermittent or limited (DDIL) environments"; pods keep running; rejoin up to 30 minutes | F09-119, F09-125
Greengrass dials out only, port 8883 or 443 | F07-189
Hybrid nodes need private connectivity both ways; guidance 100 Mbps and 200 ms, "not a strict requirement" | F09-120
Pod network Cilium or Calico; VPC CNI incompatible | F09-123
Hybrid node pages say nothing about GPUs | F09-122
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

No first-party AWS post or sample from 2025 or 2026 showing a GPU policy container on a Jetson with episode upload to S3 was located | F07-199
Placeholder: our own hook-up of a Jetson Orin Nano Super and a DGX Spark, not yet done | none
Account side: thing, thing group, IoT policy, token exchange role, role alias (the name through which the certificate reaches the role); automatic or manual provisioning | F07-144, F07-145, F07-148
Four outbound endpoints (Greengrass data plane, IoT data, credentials, S3) on 8883 or 443 (MQTT) and 8443 or 443 (HTTPS) | F07-190
Java nucleus needs Java 8 or later; lite package readme names Ubuntu 24.04 | F07-143, F07-142, F07-137
The default token exchange policy has no S3 access; add s3:GetObject, ecr:GetAuthorizationToken, ecr:BatchGetImage, ecr:GetDownloadUrlForLayer, s3:PutObject and multipart | F07-149, F07-175
Local deployment with the Greengrass CLI | F07-127
Cloud deploy to a thing, then group | F07-125
Uploader and fleet provisioning with a shared claim certificate | F07-174, F07-146

## Limits panel

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
Credentials one hour; IoT policy change 6 to 8 minutes | F07-148, F07-188
