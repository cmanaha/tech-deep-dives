# Wave 3 (IoT): from an AWS account to a Jetson and a DGX Spark beside the arm

Access date for every source in this file: 2026-11-20. Nothing here was run: no AWS API call, no install, no device. Entry IDs point into `07-edge-and-fleet.md` (F07-120 to F07-199, block "P. Wave 3 (2026-11-20): AWS IoT path in depth") and `09-aws-orchestration.md` (F09-119 to F09-127, block "Wave 3 (2026-11-20): EKS Hybrid Nodes limits and requirements"). Labels: `[vendor claim]`, `[derived]`, `[our reading]`.

Versions found today: AWS IoT Greengrass nucleus (Java) v2.18.4 (14 October 2026) and Greengrass CLI v2.18.4; nucleus lite v2.7.0 (25 September 2026); stream manager component 2.3.1; stream manager Python SDK v1.1.2 (15 July 2026); AWS IoT Device Client v1.10.1 (14 May 2025); NVIDIA Jetson Linux documentation r39.2.2 (F07-134, F07-171, F07-174, F07-193, F07-186).

## 1. Teaching outline: account, core device, component, deployment, staged rollout, episodes back to S3

Each step says what the reader has at the end of it, in plain words, then the entries that carry the evidence.

### Step 0. The words, before any command

- AWS IoT Greengrass is two halves: a program on the device (the nucleus) and a cloud service that tells it what to run (F07-120).
- A "thing" is the cloud's record of one device. A "core device" is a thing that runs the nucleus. A "thing group" is a named set of things, and it is what a fleet deployment targets (F07-121, F07-125).
- A "component" is the unit of software: a recipe (a JSON or YAML file saying how to install and start it) plus artifacts (the files) (F07-122, F07-151, F07-152).
- A "deployment" is the full list of components a target should run. It is a standing statement, not a one-off push: a device that joins the group later, or comes back online, receives it (F07-123, F07-124).
- There are two nuclei. The Java one has every feature and needs a Java runtime. Nucleus lite is a set of small C daemons, measured by AWS at 15.8 MB on a Raspberry Pi 4 `[vendor claim]`, with a shorter feature list (F07-133, F07-138, F07-135 to F07-137).

### Step 1. The account side: what must exist before a device connects

- Five objects: a thing, a thing group, an AWS IoT policy, an IAM role (the token exchange role) and a role alias that points at it. The installer can create all five, or an operator creates them and the device never holds AWS credentials (F07-144, F07-145).
- Two kinds of policy guard two doors. The AWS IoT policy, attached to the device certificate, says which MQTT topics and Greengrass data-plane calls the device may use. The IAM policy on the token exchange role says which AWS services (S3, ECR, CloudWatch Logs) its components may call (F07-187, F07-188).
- The default role cannot read S3. The first deployment with an S3 artifact fails until `s3:GetObject` is added, and a private ECR image needs three ECR actions (F07-149).
- For more than a handful of devices, fleet provisioning replaces per-device setup: each device ships with a shared claim certificate and trades it for its own on first boot (F07-146).

### Step 2. The device becomes a core device

- Java nucleus: one command with `--provision true` (snippet 1; F07-143). Requirements: Java 8 or later, glibc 2.25 or later, and since 2.16.0 support for cgroups v2 (F07-141).
- Nucleus lite: a `.deb` package and `sudo ./install-greengrass-lite.sh`, with a connection kit downloaded from the console (F07-147). Its package readme names Ubuntu 24.04 (F07-142).
- What AWS names as supported: the architecture "Armv8 (AArch64)", and no Linux distribution list for the Java nucleus. Neither JetPack nor DGX OS is named as tested (F07-140; UNKNOWN W3-U2).
- The network the device needs is outbound only: MQTT on port 8883, or on 443 with an ALPN value, plus HTTPS to four kinds of endpoint (F07-189, F07-190). No VPN and no inbound port. This is the main contrast with an EKS hybrid node (F09-120).
- How a component gets AWS credentials with no access key on disk: the token exchange service trades the device certificate for short-lived credentials of the role (F07-148). A container needs `--network=host` and two environment variables to reach it (F07-150).

### Step 3. The policy becomes a component

- The recipe for a container component: two dependencies (Docker application manager, token exchange service), an artifact whose URI starts with `docker:`, and a lifecycle command that is a plain `docker run` (snippet 2; F07-153).
- Pin the image by digest. A tag can move, and a floating tag means two robots in the same deployment can run different images (F07-154).
- GPU access is not in AWS's documentation. None of the four documented recipes passes a GPU or device flag (F07-156). Two AWS samples do it with `docker run --runtime nvidia` on a Jetson (F07-157); NVIDIA's own command for Jetson and DGX Spark is `--runtime nvidia --gpus all` (F07-11). Which flag set a Greengrass recipe needs on a DGX Spark is UNKNOWN W3-U3.
- `run` or `startup`: the choice decides whether a deployment can tell that the policy loaded. With `run` the deployment succeeds as soon as the command is launched. With `startup` the component reports `RUNNING` or `ERRORED` itself, so it can load the weights, run one warm-up inference and only then say it is healthy (F07-128, F07-129). A component that errors three times becomes `BROKEN` (F07-130). This health gate is `[our reading]` of the documented mechanism; AWS's Docker examples all use `Run`.
- Multi-gigabyte weights meet a hard limit: the artifacts of one component may total 2 GB, and the limit cannot be raised (F07-87, F07-168). Three routes, none tested: split across components, bake the weights into the container image, or have the `install` step fetch them from S3 with token exchange credentials `[our reading]`. Whether the 2 GB quota counts a `docker:` image is UNKNOWN W3-U1.
- What happens on a poor link: the Java nucleus resumes an interrupted S3 download with an HTTP `Range` request and retries once a minute without limit (code at v2.18.4, F07-169). It refuses a download that would push the component store past `componentStoreMaxSizeBytes`, 10 GB by default (F07-170).
- AWS's own machine-learning components (DLR, TensorFlow Lite) are small-model samples, and SageMaker Edge Manager was discontinued on April 26, 2024 (F07-158, F07-159). The reader packages a VLA policy as their own container.

### Step 4. The component reaches one device, then a fleet

- On the desk: a local deployment with the Greengrass CLI, from a folder, with no cloud round trip. Java nucleus only (F07-127, F07-135).
- From the cloud: `create-deployment` with a target (one thing or one thing group), the component versions, and optional configuration changes applied as `reset` then `merge` (snippet 3; F07-160).
- Three per-device policies: ask running components before updating them (`NOTIFY_COMPONENTS`, so a policy can finish its episode before it is replaced), let components validate new configuration, and roll back on failure (the default) (F07-161, F07-163). Nucleus lite lacks the IPC call that lets a component defer an update (F07-137).
- A thing deployment and a group deployment that pin different versions of one component fail on the device (F07-126). That rules out "leave the canary in the fleet group and give it a newer version directly".

### Step 5. Staged rollout

- A deployment to a group is delivered as an AWS IoT job, so the rollout controls are the job's: a starting rate per minute, a factor by which the rate grows once enough devices succeed, a ceiling, an abort rule (cancel when a percentage of executions fail after a minimum number have run) and a per-device timeout (snippet 3; F07-162, F07-178).
- Two numbers in AWS's example do not fit robots `[our reading]`: a 5-minute timeout is shorter than a multi-gigabyte download, and a minimum of 100 executed devices never triggers in a fleet of 20 (F07-162).
- The documented canary is a subdeployment: a smaller thing group under the parent target, updated first (F07-165). Whether it can pin a different version than the parent without the conflict of F07-126 is UNKNOWN W3-U5.
- There are two different undo mechanisms. A device whose install or start-up fails rolls itself back. A policy that starts but behaves badly is reverted by a new deployment revision that pins the old version; cancelling does nothing to devices that already applied it (F07-163, F07-164).
- What the cloud sees is coarse: `HEALTHY` or `UNHEALTHY` per core device, and component states (F07-131). Task success rate is not something Greengrass knows; it has to come back as data (step 6).
- Job scheduling windows and automatic retries exist in AWS IoT Jobs and are not fields of a Greengrass deployment (F07-179).

### Step 6. Episodes come back to Amazon S3

- Two documented ways. Stream manager: a Java component, 70 MB of memory at minimum `[vendor claim]`, to which a component hands "export tasks" (a local file URL, a bucket, a key); it uploads in the background, in parts, with a bandwidth cap and priorities (snippet 4; F07-171 to F07-174). Or the component calls S3 itself with token exchange credentials (F07-175).
- An episode in LeRobot format is Parquet files plus MP4 files, so the upload unit is a file, which is what stream manager's S3 export handles (F07-172). LeRobot's built-in uploader targets the Hugging Face Hub, so the S3 path is custom code either way (F07-112).
- Small signals (episode finished, success flag, policy version) do not need the file path: an MQTT message through Basic Ingest reaches a rule that writes to S3 or another service (F07-176). A device shadow holds small desired and reported state, 8 KB per document, for things like "which policy version should be active" (F07-177); nucleus lite cannot use shadows (F07-135).
- Whether stream manager resumes a multipart upload across a reboot is UNKNOWN W3-U6.

### Step 7. What sits beside this path

- The operating system is a separate layer. AWS documents no managed update of a Linux device's operating system (F07-185); NVIDIA documents APT and image-based over-the-air updates for Jetson Linux and ships tools, not a fleet service (F07-186). DGX Spark's mechanism was not fetched (UNKNOWN W3-U8).
- Fleet tools around jobs: job templates, the Software Package Catalog (an inventory of versions per device), fleet indexing (search), secure tunneling (SSH with no inbound port) (F07-180 to F07-183).
- Status of neighbours in November 2026: AWS IoT FleetWise is in maintenance (announced March 31, 2026), and the detect half of AWS IoT Device Defender is closed to new customers (F07-184, F07-191). SiteWise Edge, the Device Client and Kinesis Video Streams with WebRTC are described in F07-192 to F07-194.
- First-party reference material: the AWS Physical AI Toolchain sample holds an opt-in Greengrass edge stack that is a skeleton (no thing, no certificate, no deployment) (F07-195, F07-196); two 2026 AWS blog posts name Greengrass as the robot-side deployment service without code (F07-197, F07-198); no working 2025 or 2026 sample for a GPU policy container plus episode upload was located (F07-199).
- The Kubernetes alternative: an EKS hybrid node needs a reliable private link with inbound access from the control plane and is documented as unfit for intermittent connectivity (F09-119, F09-120). Goal sentence in F09-127: a Jetson on or beside a robot is a Greengrass core device; a DGX Spark is a hybrid node only where the lab already runs EKS, the machine is on a wired network with a VPN or Direct Connect, and GPU scheduling there has been verified (it has not: F09-122).

## 2. Verbatim configuration snippets

Copied from the pages named, placeholders as the source prints them. None was executed.

### Snippet 1. Install the Java nucleus with automatic provisioning

Source: https://docs.aws.amazon.com/greengrass/v2/developerguide/quick-installation.html (accessed 2026-11-20). Entry F07-143.

```
curl -s https://d2s8p88vqu9w66.cloudfront.net/releases/greengrass-nucleus-latest.zip > greengrass-nucleus-latest.zip
unzip greengrass-nucleus-latest.zip -d GreengrassInstaller && rm greengrass-nucleus-latest.zip
sudo -E java -Droot="/greengrass/v2" -Dlog.store=FILE \
  -jar ./GreengrassInstaller/lib/Greengrass.jar \
  --aws-region region \
  --thing-name MyGreengrassCore \
  --thing-group-name MyGreengrassCoreGroup \
  --thing-policy-name GreengrassV2IoTThingPolicy \
  --tes-role-name GreengrassV2TokenExchangeRole \
  --tes-role-alias-name GreengrassCoreTokenExchangeRoleAlias \
  --component-default-user ggc_user:ggc_group \
  --provision true \
  --setup-system-service true
```

This form needs AWS credentials on the device at install time. The manual path replaces `--provision true` and the naming flags with `--init-config ./GreengrassInstaller/config.yaml` (https://docs.aws.amazon.com/greengrass/v2/developerguide/manual-installation.html, F07-145; the full manual command is on that page and is not reproduced here).

Nucleus lite, from `readme.txt` inside https://github.com/aws-greengrass/aws-greengrass-lite/releases/download/v2.7.0/aws-greengrass-lite-deb-arm64.zip (accessed 2026-11-20, F07-147):

```
sudo ./install-greengrass-lite.sh
```

### Snippet 2. A container component recipe (private Amazon ECR image)

Source: https://docs.aws.amazon.com/greengrass/v2/developerguide/run-docker-container.html (accessed 2026-11-20). Entry F07-153.

```yaml
RecipeFormatVersion: '2020-01-25'
ComponentName: com.example.MyPrivateDockerComponent
ComponentVersion: '1.0.0'
ComponentDescription: 'A component that runs a Docker container from a private Amazon ECR image.'
ComponentPublisher: Amazon
ComponentDependencies:
  aws.greengrass.DockerApplicationManager:
    VersionRequirement: ~2.0.0
  aws.greengrass.TokenExchangeService:
    VersionRequirement: ~2.0.0
Manifests:
  - Platform:
      os: all
    Lifecycle:
        Run: docker run account-id.dkr.ecr.region.amazonaws.com/repository[:tag|@digest]
    Artifacts:
      - URI: "docker:account-id.dkr.ecr.region.amazonaws.com/repository[:tag|@digest]"
```

The documented recipe has no GPU flag (F07-156). The only first-party lines located that add one are in Tier 2 samples. From `greengrass/components/com.aws.jetson.docker/recipe.json` in https://github.com/aws-samples/genai-at-edge/blob/50df60a828a2ae274e959fce1504a18c61189b8b/greengrass/components/com.aws.jetson.docker/recipe.json (accessed 2026-11-20, F07-157; the sample's 12-digit registry account number is replaced here by `<account>`, otherwise verbatim):

```
docker run --runtime nvidia --rm --network host -p 65432:65432 <account>.dkr.ecr.us-east-1.amazonaws.com/genai-jetson:latest python3 /opt/genai-jetson/main.py
```

The same recipe sets `"RequiresPrivilege": "true"`. The sample targets Jetson Linux r35.4.1 and r36.2.0, uses a floating `latest` tag (against F07-154) and the `Run` lifecycle (against the health gate of F07-129). It shows the flag; it is not a template to copy.

### Snippet 3. A create-deployment document with rollout, abort and timeout configuration

Source: https://docs.aws.amazon.com/greengrass/v2/developerguide/create-deployments.html (accessed 2026-11-20). Entries F07-160 to F07-162.

```json
{
  "targetArn": "targetArn",
  "deploymentName": "deploymentName",
  "components": {
    "com.example.IndustrialDashboard": {
      "componentVersion": "1.0.0",
      "configurationUpdate": {
        "reset": [
          "/network/useHttps",
          "/tags"
        ],
        "merge": "{\"tags\":[\"/boiler/1/temperature\",\"/boiler/1/pressure\",\"/boiler/2/temperature\",\"/boiler/2/pressure\"]}"
      }
    }
  },
  "deploymentPolicies": {
    "componentUpdatePolicy": {
      "action": "NOTIFY_COMPONENTS",
      "timeoutInSeconds": 30
    },
    "configurationValidationPolicy": {
      "timeoutInSeconds": 60
    },
    "failureHandlingPolicy": "ROLLBACK"
  },
  "iotJobConfiguration": {
    "abortConfig": {
      "criteriaList": [
        {
          "action": "CANCEL",
          "failureType": "ALL",
          "minNumberOfExecutedThings": 100,
          "thresholdPercentage": 5
        }
      ]
    },
    "jobExecutionsRolloutConfig": {
      "exponentialRate": {
        "baseRatePerMinute": 5,
        "incrementFactor": 2,
        "rateIncreaseCriteria": {
          "numberOfNotifiedThings": 10,
          "numberOfSucceededThings": 5
        }
      },
      "maximumPerMinute": 50
    },
    "timeoutConfig":  {
      "inProgressTimeoutInMinutes": 5
    }
  }
}
```

Applied with the command the same page gives:

```
aws greengrassv2 create-deployment --cli-input-json file://deployment.json
```

Reading (F07-162): start at 5 devices per minute; double the rate once 10 devices were notified and 5 succeeded; never exceed 50 per minute; cancel when 5% of executions fail after at least 100 have executed; each device has 5 minutes. For a small robot fleet the timeout and the minimum of 100 need changing `[our reading]`.

### Snippet 4. Stream manager export of a file to Amazon S3, and the documented alternative

Source: `samples/stream_manager_s3.py` at release tag v1.1.2 (commit 0696cf29dd6b0daba0d5b79ddf484dea9a479044), https://github.com/aws-greengrass/aws-greengrass-stream-manager-sdk-python/blob/v1.1.2/samples/stream_manager_s3.py (accessed 2026-11-20). Entry F07-174. Excerpt: the body of `main` from the client creation to the append; the status-reading loop that follows it in the file is left out.

```python
        stream_name = "SomeStream"
        status_stream_name = "SomeStatusStreamName"
        bucket_name = "SomeBucket"
        key_name = "SomeKey"
        file_url = "file:/path/to/some/file.someExtension"
        client = StreamManagerClient()

        # Try deleting the status stream (if it exists) so that we have a fresh start
        try:
            client.delete_message_stream(stream_name=status_stream_name)
        except ResourceNotFoundException:
            pass

        # Try deleting the stream (if it exists) so that we have a fresh start
        try:
            client.delete_message_stream(stream_name=stream_name)
        except ResourceNotFoundException:
            pass

        exports = ExportDefinition(
            s3_task_executor=[
                S3ExportTaskExecutorConfig(
                    identifier="S3TaskExecutor" + stream_name,  # Required
                    # Optional. Add an export status stream to add statuses for all S3 upload tasks.
                    status_config=StatusConfig(
                        status_level=StatusLevel.INFO,  # Default is INFO level statuses.
                        # Status Stream should be created before specifying in S3 Export Config.
                        status_stream_name=status_stream_name,
                    ),
                )
            ]
        )

        # Create the Status Stream.
        client.create_message_stream(
            MessageStreamDefinition(name=status_stream_name, strategy_on_full=StrategyOnFull.OverwriteOldestData)
        )

        # Create the message stream with the S3 Export definition.
        client.create_message_stream(
            MessageStreamDefinition(
                name=stream_name, strategy_on_full=StrategyOnFull.OverwriteOldestData, export_definition=exports
            )
        )

        # Append a S3 Task definition and print the sequence number
        s3_export_task_definition = S3ExportTaskDefinition(input_url=file_url, bucket=bucket_name, key=key_name)
        logger.info(
            "Successfully appended S3 Task Definition to stream with sequence number %d",
            client.append_message(stream_name, Util.validate_and_serialize_to_json_bytes(s3_export_task_definition)),
        )
```

The sample deletes and recreates both streams on every start, which a real uploader would not do: queued tasks would be lost `[our reading]`. With `StrategyOnFull.OverwriteOldestData` a full stream drops its oldest export tasks, so an uploader that must not lose episodes needs the other strategy or a stream sized for its backlog `[our reading]`.

Documented alternative, with no stream manager (F07-175). The recipe fragments from https://docs.aws.amazon.com/greengrass/v2/developerguide/interact-with-aws-services.html (accessed 2026-11-20), whose example lists buckets with `boto3`:

```
"ComponentDependencies": { "aws.greengrass.TokenExchangeService": { "VersionRequirement": "^2.0.0", "DependencyType": "HARD" } }
"install": "pip3 install --user boto3", "Run": "python3 -u {artifacts:path}/list_s3_buckets.py"
```

and the S3 write permissions the token exchange role needs, as stream manager's own requirements list them in https://docs.aws.amazon.com/greengrass/v2/developerguide/stream-export-configurations.html (accessed 2026-11-20):

```
"Action": [ "s3:PutObject", "s3:AbortMultipartUpload", "s3:ListMultipartUploadParts" ], "Resource": [ "arn:aws:s3:::bucket-1-name/*", "arn:aws:s3:::bucket-2-name/*" ]
```

These two fragments are quoted as joined lines in the register; the pages print them as indented JSON.

## 3. What a hook-up of one Jetson and one DGX Spark would have to measure

Status of every line: NOT MEASURED. No device was touched in this research. Each line names the documented or code-read claim it would test.

Install and footprint
1. Does the Java nucleus v2.18.4 install and start as a system service on JetPack 7.2.2 (Ubuntu 24.04, arm64) and on DGX OS with the one-command installer? Which Java package was needed? (F07-140, F07-141, F07-143; W3-U2)
2. Does the nucleus lite v2.7.0 arm64 `.deb` install on both? (F07-142, F07-147)
3. Resident memory of the Java nucleus, of nucleus lite, and of stream manager 2.3.1 on the 8 GB Orin Nano Super, idle and during a deployment, against the documented 96 MB and 70 MB minimums and AWS's 15.8 MB lite figure. (F07-84, F07-138, F07-171; W3-U4)
4. Time from power-on to all components `RUNNING`, with and without network.

Component and GPU
5. The exact `docker run` flags a recipe needs for GPU access on each machine: `--runtime nvidia` alone, `--gpus all` alone, or both; and whether `RequiresPrivilege` is needed. (F07-156, F07-157, F07-11; W3-U3)
6. Does token exchange work from inside the policy container with `--network=host` and the two environment variables? (F07-150)
7. A `startup` lifecycle that reports `RUNNING` only after a warm-up inference: time from deployment start to `RUNNING`, and does a deliberate engine-load failure produce `ERRORED`, a failed deployment and a rollback? Time to roll back. (F07-129, F07-163)
8. Does a third consecutive crash put the component in `BROKEN`, and what does the cloud show? (F07-130, F07-131)

Large artifacts
9. Is a container image larger than 2 GB accepted as a `docker:` artifact? Record the image size and the result. (F07-168; W3-U1)
10. Deployment wall-clock time for the real policy image and weights on the lab uplink, with the uplink speed recorded; the `inProgressTimeoutInMinutes` that this implies. (F07-162)
11. Pull the network cable in the middle of an S3 artifact download and in the middle of an image pull: does each resume, from where, and after how long? (F07-169; W3-U7 for nucleus lite)
12. Component store size after three policy versions, against the 10 GB default; what gets cleaned up and when. (F07-170)

Rollout
13. A two-device thing group with a subdeployment for one of them: can the subdeployment pin a newer policy version than the parent, or does the device report the version conflict? (F07-126, F07-165; W3-U5)
14. `NOTIFY_COMPONENTS`: can the policy component defer an update until the current episode ends, on the Java nucleus? Confirm the deferral is unavailable on nucleus lite. (F07-161, F07-137)
15. An abort rule sized for two devices (minimum executed 1, threshold 50%): does one failing device cancel the job for the other? (F07-162)
16. Deploy to a device that is powered off; time from power-on to the deployment being applied. (F07-123)

Episodes back to S3
17. Upload one real LeRobot episode set (Parquet and MP4) by stream manager and by a direct multipart upload: throughput, CPU and memory during upload, and the effect on policy inference latency with and without `STREAM_MANAGER_EXPORTER_MAX_BANDWIDTH`. (F07-173, F07-175)
18. Reboot the device mid-upload: does stream manager resume the multipart upload, restart the file, or drop the task? (W3-U6)
19. Fill the export stream past its size with `OverwriteOldestData`: are export tasks lost silently? (F07-174)
20. Round trip of one "episode done" MQTT message through Basic Ingest to an S3 object. (F07-176)

Kubernetes comparison (only if a VPN to a VPC exists)
21. Does `nodeadm install` and `nodeadm init` succeed on DGX OS, and does the node report its GPU to Kubernetes with the NVIDIA device plugin or GPU Operator? vCPUs reported, for the bill. (F09-121, F09-122, F09-124, F09-126; W3-U10, W3-U11)

## 4. UNKNOWNs

Scope of every line: not located in the pages and code read on 2026-11-20. None of these is a statement that the thing does not exist.

| ID | Open question | Where it bites | Entries |
|---|---|---|---|
| W3-U1 | Does the 2 GB "sum of all artifacts for a component" quota count a `docker:` image artifact? No page read says either way, and AWS publishes no maximum image size through Greengrass. | Whether a multi-gigabyte policy image is one component | F07-168 |
| W3-U2 | Is the Java nucleus tested on JetPack 7.2.2 or DGX OS? The requirements page names architectures, no distributions; "Jetson Nano" appears only in a changelog line. | The install step of the hook-up | F07-140, F07-141 |
| W3-U3 | Which GPU flags a Greengrass container recipe needs on a DGX Spark. AWS samples show `--runtime nvidia` on Jetson; NVIDIA's command passes `--runtime nvidia --gpus all`. | The recipe the page prints | F07-156, F07-157, F07-11 |
| W3-U4 | Real memory of the Java nucleus and of stream manager on a Jetson. Only documented minimums (96 MB, 70 MB) and AWS's Raspberry Pi 4 figure for lite were found. | Memory budget on the 8 GB Orin Nano | F07-84, F07-138, F07-171 |
| W3-U5 | Can a subdeployment pin a component version different from its parent's without the thing-versus-group conflict? Implied by its stated purpose, no quote confirms it. | The canary design | F07-126, F07-165 |
| W3-U6 | Does stream manager resume a multipart S3 upload across a device reboot? | Episode upload on robots that are switched off at night | F07-173 |
| W3-U7 | Does nucleus lite resume an interrupted artifact download? Its downloader code was not read; the Java nucleus code was. | Large artifacts on the lite runtime | F07-169 |
| W3-U8 | How DGX Spark's operating system is updated over the air. Not fetched. | The operating-system layer for the second machine | F07-186 |
| W3-U9 | A first-party 2025 or 2026 working sample for a GPU policy container on a Jetson with episode upload. Not located in two searches and four repositories; one Korean-language AWS blog post surfaced by search was not opened. | Whether the dive's hook-up is the first worked example the reader sees | F07-199 |
| W3-U10 | Does AWS Support treat Jetson Linux (JetPack 7.2.2) or DGX OS as "Ubuntu 24.04" for EKS Hybrid Nodes? Neither is a row of the operating system table. Whether the Orin and DGX Spark processors meet ARMv8.2 with the Cryptography Extension was not checked against NVIDIA documentation. | Hybrid node eligibility | F09-121 |
| W3-U11 | GPU support on EKS hybrid nodes, including the NVIDIA GPU Operator on a Jetson. Thirteen pages read contain no mention of GPUs. | Whether the Kubernetes path can run the policy at all | F09-122 |
| W3-U12 | What AWS IoT Greengrass and AWS IoT Core charge per device and per message. The pricing pages were not read in this wave. | The cost line beside the hybrid node price | F09-126 |
| W3-U13 | Amazon ECR endpoint names for the firewall table. Not fetched. | The network allow-list | F07-190 |
| W3-U14 | Whether subdeployments, and the deployment policies as a whole, behave the same on nucleus lite. The subdeployment page does not say. | Choosing lite for the Jetson | F07-165, F07-136 |
| W3-U15 | Whether the kubelet on a disconnected hybrid node restarts a crashed pod locally. The two best-practice pages quoted do not state it in the lines read. | The disconnection comparison | F09-125 |

Still open from earlier waves and touched here: U09-8 (how a Jetson joins an OSMO backend in the hardware-in-the-loop example, and whether that works with EKS Hybrid Nodes), see F09-127.

## 5. Sources used in wave 3 (IoT), for sources.md

Access date for all: 2026-11-20. "New" means the URL does not appear in the register outside the wave 3 block; "cited before" means an earlier wave already lists it and only the access date and entry list change. All are first-party. Tier 3 and Tier 4: none used.

### Tier 1 (official documentation, code and docs at a pinned ref)

- https://docs.aws.amazon.com/freertos/latest/userguide/freertos-ota-dev.html | official documentation | new | F07-185
- https://docs.aws.amazon.com/general/latest/gr/full_shutdown_services.html | official documentation | cited before | F07-191
- https://docs.aws.amazon.com/general/latest/gr/greengrassv2.html | official documentation | cited before | F07-167, F07-168
- https://docs.aws.amazon.com/general/latest/gr/iot-core.html | official documentation | cited before | F07-177
- https://docs.aws.amazon.com/general/latest/gr/maintenance_services.html | official documentation | new | F07-184, F07-191
- https://docs.aws.amazon.com/general/latest/gr/sunset_services.html | official documentation | new | F07-191
- https://docs.aws.amazon.com/greengrass/v2/APIReference/API_CreateDeployment.html | official documentation | new | F07-165
- https://docs.aws.amazon.com/greengrass/v2/APIReference/API_DeploymentIoTJobConfiguration.html | official documentation | cited before | F07-179
- https://docs.aws.amazon.com/greengrass/v2/APIReference/API_IoTJobTimeoutConfig.html | official documentation | new | F07-162
- https://docs.aws.amazon.com/greengrass/v2/developerguide/allow-device-traffic.html | official documentation | new | F07-190
- https://docs.aws.amazon.com/greengrass/v2/developerguide/cancel-deployments.html | official documentation | new | F07-164
- https://docs.aws.amazon.com/greengrass/v2/developerguide/check-deployment-status.html | official documentation | new | F07-164
- https://docs.aws.amazon.com/greengrass/v2/developerguide/component-recipe-reference.html | official documentation | new | F07-128, F07-129, F07-130, F07-132, F07-136, F07-151, F07-152
- https://docs.aws.amazon.com/greengrass/v2/developerguide/create-deployments.html | official documentation | new | F07-124, F07-125, F07-160, F07-161, F07-162, F07-163
- https://docs.aws.amazon.com/greengrass/v2/developerguide/create-subdeployments.html | official documentation | new | F07-165
- https://docs.aws.amazon.com/greengrass/v2/developerguide/device-auth.html | official documentation | new | F07-187
- https://docs.aws.amazon.com/greengrass/v2/developerguide/device-service-role.html | official documentation | new | F07-149
- https://docs.aws.amazon.com/greengrass/v2/developerguide/device-status.html | official documentation | new | F07-131
- https://docs.aws.amazon.com/greengrass/v2/developerguide/dlr-component.html | official documentation | new | F07-158
- https://docs.aws.amazon.com/greengrass/v2/developerguide/docker-application-manager-component.html | official documentation | new | F07-153, F07-154
- https://docs.aws.amazon.com/greengrass/v2/developerguide/fleet-provisioning.html | official documentation | new | F07-146
- https://docs.aws.amazon.com/greengrass/v2/developerguide/gg-cli-deployment.html | official documentation | new | F07-127
- https://docs.aws.amazon.com/greengrass/v2/developerguide/greengrass-cli-component.html | official documentation | new | F07-127
- https://docs.aws.amazon.com/greengrass/v2/developerguide/greengrass-nucleus-component.html | official documentation | cited before | F07-140, F07-141, F07-163, F07-166, F07-167, F07-170
- https://docs.aws.amazon.com/greengrass/v2/developerguide/greengrass-nucleus-lite-component.html | official documentation | cited before | F07-142
- https://docs.aws.amazon.com/greengrass/v2/developerguide/how-it-works.html | official documentation | new | F07-120, F07-121, F07-122, F07-123, F07-133
- https://docs.aws.amazon.com/greengrass/v2/developerguide/install-greengrass-v2-console.html | official documentation | new | F07-147
- https://docs.aws.amazon.com/greengrass/v2/developerguide/interact-with-aws-services.html | official documentation | new | F07-148, F07-175
- https://docs.aws.amazon.com/greengrass/v2/developerguide/interprocess-communication.html | official documentation | new | F07-155
- https://docs.aws.amazon.com/greengrass/v2/developerguide/manage-data-streams.html | official documentation | cited before | F07-171
- https://docs.aws.amazon.com/greengrass/v2/developerguide/manage-deployments.html | official documentation | new | F07-123, F07-124, F07-125, F07-126, F07-166
- https://docs.aws.amazon.com/greengrass/v2/developerguide/manual-installation.html | official documentation | new | F07-145
- https://docs.aws.amazon.com/greengrass/v2/developerguide/operating-system-feature-support-matrix.html | official documentation | cited before | F07-135, F07-183
- https://docs.aws.amazon.com/greengrass/v2/developerguide/perform-machine-learning-inference.html | official documentation | new | F07-158
- https://docs.aws.amazon.com/greengrass/v2/developerguide/quick-installation.html | official documentation | new | F07-143, F07-144
- https://docs.aws.amazon.com/greengrass/v2/developerguide/run-docker-container.html | official documentation | cited before | F07-149, F07-150, F07-153, F07-154, F07-155, F07-156
- https://docs.aws.amazon.com/greengrass/v2/developerguide/sagemaker-edge-manager-component.html | official documentation | new | F07-159
- https://docs.aws.amazon.com/greengrass/v2/developerguide/setting-up.html | official documentation | new | F07-141
- https://docs.aws.amazon.com/greengrass/v2/developerguide/shadow-manager-component.html | official documentation | new | F07-177
- https://docs.aws.amazon.com/greengrass/v2/developerguide/stream-export-configurations.html | official documentation | new | F07-172, F07-173, F07-175
- https://docs.aws.amazon.com/greengrass/v2/developerguide/stream-manager-component.html | official documentation | new | F07-134, F07-139, F07-173
- https://docs.aws.amazon.com/greengrass/v2/developerguide/token-exchange-service-component.html | official documentation | new | F07-148
- https://docs.aws.amazon.com/greengrass/v2/developerguide/update-greengrass-core-v2.html | official documentation | new | F07-185
- https://docs.aws.amazon.com/greengrass/v2/developerguide/upload-components.html | official documentation | new | F07-168
- https://docs.aws.amazon.com/greengrass/v2/developerguide/what-is-iot-greengrass.html | official documentation | new | F07-120
- https://docs.aws.amazon.com/greengrass/v2/developerguide/work-with-streams.html | official documentation | new | F07-173
- https://docs.aws.amazon.com/iot-device-defender/latest/devguide/dd-detect-availability-change.html | official documentation | new | F07-184
- https://docs.aws.amazon.com/iot-sitewise/latest/userguide/gateways.html | official documentation | new | F07-192
- https://docs.aws.amazon.com/iot/latest/developerguide/authorizing-direct-aws.html | official documentation | new | F07-188
- https://docs.aws.amazon.com/iot/latest/developerguide/device-defender.html | official documentation | new | F07-184
- https://docs.aws.amazon.com/iot/latest/developerguide/iot-basic-ingest.html | official documentation | new | F07-176
- https://docs.aws.amazon.com/iot/latest/developerguide/iot-connect-devices.html | official documentation | new | F07-190
- https://docs.aws.amazon.com/iot/latest/developerguide/iot-device-shadows.html | official documentation | new | F07-177
- https://docs.aws.amazon.com/iot/latest/developerguide/iot-indexing.html | official documentation | new | F07-182
- https://docs.aws.amazon.com/iot/latest/developerguide/iot-policies.html | official documentation | new | F07-188
- https://docs.aws.amazon.com/iot/latest/developerguide/job-templates.html | official documentation | new | F07-180
- https://docs.aws.amazon.com/iot/latest/developerguide/jobs-configurations-details.html | official documentation | cited before | F07-179
- https://docs.aws.amazon.com/iot/latest/developerguide/key-concepts-jobs.html | official documentation | new | F07-178, F07-179
- https://docs.aws.amazon.com/iot/latest/developerguide/protocols.html | official documentation | new | F07-189
- https://docs.aws.amazon.com/iot/latest/developerguide/s3-rule-action.html | official documentation | new | F07-176
- https://docs.aws.amazon.com/iot/latest/developerguide/secure-tunneling.html | official documentation | new | F07-183
- https://docs.aws.amazon.com/iot/latest/developerguide/software-package-catalog.html | official documentation | new | F07-181
- https://docs.aws.amazon.com/iot/latest/developerguide/x509-client-certs.html | official documentation | new | F07-187
- https://docs.aws.amazon.com/kinesisvideostreams-webrtc-dg/latest/devguide/what-is-kvswebrtc.html | official documentation | new | F07-194
- https://docs.nvidia.com/jetson/archives/r39.2.2/DeveloperGuide/SD/SoftwarePackagesAndTheUpdateMechanism.html | NVIDIA documentation | new | F07-186
- https://github.com/aws-greengrass/aws-greengrass-cli/releases/tag/v2.18.4 | release page or asset | new | F07-134
- https://github.com/aws-greengrass/aws-greengrass-lite/blob/v2.7.0/README.md | code or docs at a release tag | new | F07-137
- https://github.com/aws-greengrass/aws-greengrass-lite/blob/v2.7.0/docs/RECIPE_SUPPORT_CHANGES.md | code or docs at a release tag | new | F07-136
- https://github.com/aws-greengrass/aws-greengrass-lite/blob/v2.7.0/docs/RESOURCE_LIMITS.md | code or docs at a release tag | new | F07-138
- https://github.com/aws-greengrass/aws-greengrass-lite/blob/v2.7.0/docs/SETUP.md | code or docs at a release tag | new | F07-142
- https://github.com/aws-greengrass/aws-greengrass-lite/releases/download/v2.7.0/aws-greengrass-lite-deb-arm64.zip | release page or asset | new | F07-142, F07-147
- https://github.com/aws-greengrass/aws-greengrass-lite/releases/tag/v2.7.0 | release page or asset | cited before | F07-134
- https://github.com/aws-greengrass/aws-greengrass-nucleus/blob/v2.18.4/src/main/java/com/aws/greengrass/componentmanager/ComponentManager.java | code or docs at a release tag | new | F07-170
- https://github.com/aws-greengrass/aws-greengrass-nucleus/blob/v2.18.4/src/main/java/com/aws/greengrass/componentmanager/builtins/ArtifactDownloader.java | code or docs at a release tag | new | F07-169
- https://github.com/aws-greengrass/aws-greengrass-nucleus/blob/v2.18.4/src/main/java/com/aws/greengrass/componentmanager/builtins/S3Downloader.java | code or docs at a release tag | new | F07-169
- https://github.com/aws-greengrass/aws-greengrass-nucleus/releases/tag/v2.18.4 | release page or asset | cited before | F07-134
- https://github.com/aws-greengrass/aws-greengrass-stream-manager-sdk-python/blob/v1.1.2/samples/stream_manager_s3.py | code or docs at a release tag | new | F07-174
- https://github.com/aws-greengrass/aws-greengrass-stream-manager-sdk-python/blob/v1.1.2/stream_manager/data/__init__.py | code or docs at a release tag | new | F07-173
- https://github.com/awslabs/aws-iot-device-client | official repository (metadata) | new | F07-193
- https://github.com/awslabs/aws-iot-device-client/blob/v1.10.1/README.md | code or docs at a release tag | new | F07-193
- https://docs.aws.amazon.com/eks/latest/best-practices/hybrid-nodes-host-creds.html | official documentation | new | F09-125
- https://docs.aws.amazon.com/eks/latest/best-practices/hybrid-nodes-kubernetes-pod-failover.html | official documentation | new | F09-125
- https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-add-ons.html | official documentation | new | F09-122, F09-123
- https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-creds.html | official documentation | new | F09-124
- https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html | official documentation | new | F09-123
- https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-nodeadm.html | official documentation | new | F09-124
- https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-os.html | official documentation | cited before | F09-121
- https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-overview.html | official documentation | cited before | F09-119, F09-120, F09-127
- https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-prereqs.html | official documentation | new | F09-120

### Tier 2 (first-party blogs, sample repositories, pricing page)

- https://aws.amazon.com/blogs/industries/accelerating-physical-ai-with-aws-and-nvidia-building-production-ready-applications-with-simulation-and-real-world-learning/ | AWS blog | new | F07-197
- https://aws.amazon.com/blogs/industries/deploying-industrial-ai-on-aws-building-the-autonomous-factory/ | AWS blog | new | F07-198
- https://aws.amazon.com/blogs/physical-ai/introducing-aws-physical-ai-toolchain/ | AWS blog | new | F07-198
- https://github.com/aws-samples/aws-iot-greengrass-v2-deploy-nvidia-deepstream | AWS sample repository | new | F07-199
- https://github.com/aws-samples/deploy-yolov8-on-edge-using-aws-iot-greengrass | AWS sample repository | new | F07-199
- https://github.com/aws-samples/genai-at-edge | AWS sample repository | new | F07-157, F07-199
- https://github.com/aws-samples/genai-at-edge/blob/50df60a828a2ae274e959fce1504a18c61189b8b/greengrass/components/com.aws.jetson.docker/recipe.json | AWS sample repository | new | F07-157
- https://github.com/aws-samples/sample-the-physical-ai-toolchain-on-aws/blob/84984decc51cc07fb4ceb8f3fc1f85d523924bf5/cdk/bin/app.ts | AWS sample repository | new | F07-195
- https://github.com/aws-samples/sample-the-physical-ai-toolchain-on-aws/blob/84984decc51cc07fb4ceb8f3fc1f85d523924bf5/cdk/lib/edge-stack.ts | AWS sample repository | new | F07-157, F07-195, F07-196
- https://aws.amazon.com/eks/pricing/ | first-party pricing page | cited before | F09-126

Notes for the sources file:
- GitHub code is pinned: aws-greengrass-nucleus tag v2.18.4 (commit 48ddc8e0ae0c3226c23e66b4eb86a79d8707182c), aws-greengrass-stream-manager-sdk-python tag v1.1.2 (commit 0696cf29dd6b0daba0d5b79ddf484dea9a479044), aws-greengrass-lite tag v2.7.0, aws-iot-device-client tag v1.10.1, aws-samples/genai-at-edge commit 50df60a828a2ae274e959fce1504a18c61189b8b, aws-samples/sample-the-physical-ai-toolchain-on-aws commit 84984decc51cc07fb4ceb8f3fc1f85d523924bf5.
- Repository root URLs without a ref are cited for metadata only (archived flag, last commit date), never for content.
- https://docs.aws.amazon.com/lookout-for-vision/latest/developer-guide/models-devices-setup-core-device.html returned HTTP 404 on 2026-11-20 and is recorded as such in F07-159; it is not a source of any claim.
- Web search was used only to locate first-party pages; no search result is cited as fact.
