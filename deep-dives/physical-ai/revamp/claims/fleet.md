# Claims: section 18, The Fleet

claim | register ID

"A hundred robots" is an illustration: AWS's rollout example steps at 1,000 devices and the published fleet loop has 16 robots | F07-93, F07-108
Greengrass is "an open source Internet of Things (IoT) edge runtime and cloud service ..."; a program on the device plus a cloud service | F07-120
On 2026-11-20 AWS IoT Core, Greengrass V2 and Device Management appear in none of AWS's maintenance, sunset or full-shutdown lists | F07-191
AWS RoboMaker's end-of-support date is September 10, 2025 | F07-98
No first-party statement of what replaces RoboMaker was located in this research; its documentation returned HTTP 404 | F07-100
AWS IoT Greengrass V1 ended on October 7, 2026 | F07-99
Secure tunneling gives a session to a device with no inbound port, on both nuclei | F07-183
Fleet indexing makes the registry, shadows and connectivity searchable | F07-182
Device Defender detect "will no longer be available to new customers starting August 31, 2026"; audit remains | F07-184
AWS IoT FleetWise is in maintenance, announced March 31, 2026 | F07-191
No AWS page describing a managed Linux operating system update was located; NVIDIA documents update tools for Jetson Linux and no fleet service | F07-185, F07-186
A thing is "a representation of a specific device or logical entity"; a core device "is an AWS IoT thing" | F07-121
The nucleus is "a mandatory component and the minimum requirement ..."; the Java nucleus needs at least 96 MB of RAM | F07-84
Nucleus lite is documented at less than 15 MB of RAM | F07-85
A component is a recipe plus artifacts (vendor wording) | F07-122
A deployment (vendor wording); an offline device "receives the deployment the next time it connects" | F07-123
"To deploy to multiple core devices, specify a thing group that includes those devices." | F07-125
A shadow has desired, reported and delta parts, at most 8 KB per document; nucleus lite does not support the shadow manager | F07-177
A job is "a remote operation that is sent to and run on one or more devices" | F07-178
A new deployment overwrites the previous one for the same target; a component left out is uninstalled | F07-124
A device runs the union of deployments that target it; thing and group deployments that pin different versions of one component fail on the device | F07-125, F07-126
One component's artifacts may total at most 2 GB and the limit cannot be raised | F07-87
The policy weights in NVIDIA's Jetson Thor tutorial are "~6 GB+" | F07-54
Three routes around the limit (container image, S3 fetch by the component, split artifacts) are our reading of documented mechanisms; none tested; the documentation read does not say whether the quota counts a docker: image | F07-168
The install lifecycle step runs again at every Greengrass start and defaults to a 120 s timeout | F07-128
The container recipe (snippet): two dependencies, a docker: artifact URI, a plain docker run in Run | F07-153
RecipeFormatVersion is the first recipe field (only value 2020-01-25) | F07-151
AWS recommends a tag or digest in the image URI "To ensure that all of your core devices run the same version of an image" | F07-154
None of the documented Docker recipes passes a GPU flag, and all use Run | F07-156
At v2.18.4 the Java nucleus resumes an S3 artifact download with an HTTP Range request and retries once a minute with no limit (code read, not run); lite's downloader was not read | F07-169
The component store defaults to a 10 GB maximum | F07-170
"AWS IoT Greengrass uses AWS IoT Core jobs to send deployments to core devices ..." | F07-162
Rollout rate: constant maximumPerMinute (minimum 1) or exponential with baseRatePerMinute 1 to 1000 and incrementFactor 1.1 to 5 | F07-92
AWS's example: base 50 per minute, factor 2, a step every 1,000 devices: 50, 100, 200, 400 per minute | F07-93
Abort criteria: failure type, minimum number of devices, threshold percentage; only action CANCEL | F07-94
"only QUEUED job executions are canceled"; in-progress executions "will not be canceled" | F07-95
Reverting is a new deployment revision that pins the previous version; cancelling does not change devices that already applied it | F07-164
By default components are notified first and the nucleus waits 60 seconds, then "the deployment proceeds on the device"; deferring until the gripper is empty is our reading | F07-90
The two defer operations are absent from nucleus lite's README list at v2.7.0 | F07-137
Default failure handling rolls the core device back to its previous configuration | F07-163
run versus startup: with run a deployment can succeed although the script fails soon after; with startup the component reports RUNNING or ERRORED; the health gate is our reading | F07-129
The cloud sees a core device as HEALTHY or UNHEALTHY | F07-131
A subdeployment "targets a smaller subset of devices within a parent deployment"; the documentation read does not say whether it can pin a different version than its parent | F07-165
The create-deployment document (snippet) and its reading: 5 per minute, double after 10 notified and 5 succeeded, at most 50 per minute, cancel at 5% after 100 executed, 5 minutes per device; the 5-minute timeout and the minimum of 100 do not fit a small robot fleet (our reading; 6 GB at 100 Mbit/s is 8 minutes) | F07-162
The example sets the component update wait to 30 seconds; validation and ROLLBACK policies | F07-161
MQTT limits: 128 KB per message, 100 publish requests per second, 512 KB per second; one raw 640x480 frame is 921,600 bytes, seven times the message limit | F07-97
Section 9's example dataset is 86.1 MB for 50 episodes (about 1.7 MB each, our arithmetic) | F05-29
A per-episode record can go over MQTT to a rule that writes to S3; "messages for signals, S3 for files" is our reading; no AWS page read states when to keep data off MQTT | F07-176
S3 multipart upload: up to 10,000 parts of 5 MiB to 5 GiB | F07-102
LeRobot's built-in uploader targets the Hugging Face Hub | F07-112
Stream manager S3 export: one export task per file (file URL, bucket, key) | F07-172
Stream manager knobs: multipart threshold minimum 5 MB, bandwidth cap, 5 export threads, per-stream priority; resume across reboot not stated in the pages read | F07-173
Stream manager "requires a minimum of 70 MB RAM in addition to the AWS IoT Greengrass Core software" | F07-171
Stream manager supports nucleus lite since 2.2.0 and is a Java program | F07-139
A component can call S3 itself with token exchange credentials; AWS's example lists buckets; multipart through the SDK is our reading; write actions s3:PutObject and the multipart actions | F07-175
On arm64 the Java nucleus lists Armv8 (AArch64) and names no distribution | F07-140
Nucleus lite ships an arm64 package whose readme names Ubuntu 24.04 | F07-142
Learning While Deploying: 16 two-armed robots upload complete episodes at episode boundaries; the learner broadcasts a policy every 50 training steps (author reported) | F07-108
Its latencies on an 8-hour, 16-robot run: 41 s median (148 s p99) episode to learner; 38 s median (55 s p99) model to robot (author reported) | F07-109
Sizing model: 38.41 MB/s, seven 1920x1080 30 fps streams, 3.32 TB per robot per day; 120 robots 4.61 GB/s and 11.95 PB per 30 days (author reported, modelled) | F07-106
EKS Hybrid Nodes "is not a fit for disconnected, disrupted, intermittent or limited (DDIL) environments" | F09-119
During a disconnection pods keep running, nothing can be changed, and rejoining can take up to 30 minutes | F09-125
A Greengrass device connects outbound on port 8883 or 443 | F07-189
A hybrid node needs private connectivity in both directions; guidance at least 100 Mbps and at most 200 ms, "not a strict requirement" | F09-120
The hybrid node operating system table lists Ubuntu 24.04; Jetson Linux and DGX OS are not rows | F09-121
Two AWS samples add a GPU flag to docker run | F07-157
The hybrid node pages read say nothing about GPUs | F09-122
On a hybrid node the reader installs a pod network (Cilium or Calico) | F09-123
A Jetson beside a robot is a Greengrass core device; a DGX Spark is a hybrid node only under three conditions (our reading) | F09-127
No first-party 2025 or 2026 AWS post or sample with working Greengrass V2 code for a GPU policy container on a Jetson plus episode upload was located | F07-199
Account side: thing, thing group, IoT policy, token exchange role, role alias; automatic or manual provisioning | F07-144, F07-145
Network: four kinds of outbound endpoint, 8883 or 443 for MQTT, 8443 or 443 for HTTPS | F07-190
The Java nucleus installs with one documented command | F07-143
The default token exchange policy "doesn't include access to files in S3 buckets"; s3:GetObject and three ECR actions are added | F07-149
A local deployment is made on the device with no cloud round trip | F07-127
AWS's S3 export sample for stream manager (Python SDK v1.1.2) | F07-174
Fleet provisioning: a shared claim certificate traded for the device's own on first connection | F07-146
