# Accuracy review, wave 3 round 1, reviewer B: section 18

Read from HEAD (251417f). Source `src/sections/Fleet.tsx` (git show HEAD), before text
`/tmp/pai-text-before/18-fleet.txt`, after text `/tmp/pai-rw/w3-r1b/18-fleet.txt`. Registers:
`research/2026-11/07-edge-and-fleet.md`, `05-data-pipeline.md`, `09-aws-orchestration.md`, `wave3-iot.md`. Cross-references
checked against `revamp/tools/sections.json` and the HEAD sources of sections 5, 9, 16, 17, 19 and 24.

## Section 18, The Fleet (`Fleet.tsx`)

### Errors

**E18-1 (error). The section puts the 6 GB policy in an Orin Nano's 8 GB without checking that it fits, and no entry
supports it.**
- Sentence: "The documented minimums of the nucleus and stream manager add to 96 + 70 = 166 MB, taken from the same 8 GB
  that holds the policy on an Orin Nano, and buy a queue, ..."
- Throughout the section "the policy" is the 6 GB one ("A 6 GB policy", "about 6 GB of weights for pi0.5", "the 6 GB
  policy needs 8 minutes"), and the placeholder names the arm's computer as a Jetson Orin Nano Super. So the sentence
  says pi0.5's weights sit in the Orin Nano's 8 GB next to the 166 MB agent. The section never checks that.
- F07-54 measures nothing. It is a storage prerequisite in NVIDIA's openpi tutorial for the Jetson AGX Thor (128 GB):
  "NVMe SSD recommended (model weights are ~6 GB+)". The size is on disk, a lower bound, before the FP8/NVFP4 engine
  build. No entry shows pi0.5 running on an Orin Nano. F07-117 says the arm's own policies on that board are SmolVLA or
  ACT, and no latency for them was located. F07-171's use line counts the 166 MB "before any policy". F07-36 gives
  8 GB as one pool shared by CPU and GPU. Section 17 (OnRobot.tsx) says a policy of pi0.5's size "leaves little of the
  board for anything else". The use against the 2 GB limit (F07-87) stays in scope, because the register's own use
  lines for F07-54 and F07-87 make that comparison. Putting the policy on the 8 GB board does not.
- Fix: "taken from the Orin Nano's 8 GB, which a 6 GB policy would already nearly fill (section 17); whether pi0.5
  fits there beside the agent is untested".

**E18-2 (error). Five absences found in the pages read are now stated as absences in all of AWS's documentation.**
- "Whether the 2 GB quota counts a `docker:` image is not documented" (routes table). F07-168 says "not stated on any
  page read (UNKNOWN W3-U1)". The before text said "The documentation read does not say".
- "AWS documents the mechanisms, and none of the three routes is a documented pattern for weights." F07-168 says "no
  page read today documents ... an official pattern for larger files". The before text said "using them for
  multi-gigabyte weights is our reading, and none of the three was tested in this research".
- "whether a subdeployment may pin a version different from its parent's is not documented." F07-165 says it is
  "implied by its purpose and was not confirmed from a quote (UNKNOWN W3-U5)". The before text said "The documentation
  read does not say".
- "Whether stream manager resumes an upload after the device reboots is not documented." F07-173 says "not stated on
  the pages read (UNKNOWN W3-U6)".
- Edge table: "The hybrid node pages say nothing about GPUs." Also "The hybrid node pages do not mention GPU
  scheduling". F09-122 scopes this to thirteen pages "read in this research": "never as 'GPUs are unsupported'". The
  before text kept "read in this research".
- Fix: restore the scope in each sentence ("the pages read do not say ...", "the hybrid node pages read say nothing
  about GPUs").
- The F07-168 reading itself is correct: no sentence prints the headline's claim that a `docker:` image does not
  count. The section treats it as the open question, which matches the use line and W3-U1.

**E18-3 (error). One of the two AWS samples cited as following the image route ships its model as an S3 artifact
instead.**
- Sentence: "If a multi-gigabyte `docker:` image deploys, take the image on a steady link: one component version per
  release, a pull the Docker application manager handles, and the pattern of both AWS samples that start a GPU program
  on a Jetson from a recipe."
- F07-157 supports only that both samples start a GPU container from a recipe with `--runtime nvidia`. F07-195 says
  the Physical AI Toolchain sample's inference component "takes `policy.trt` from S3 as an artifact" and mounts it
  with `-v {artifacts:path}/model:/model`. F07-196 and the section's own next paragraph say the same thing (key
  `latest/policy.trt`). That is an artifact route with a container, not a container image with the weights inside.
- Fix: "and the shape of both AWS samples, which start a GPU container from a recipe (the Physical AI Toolchain sample
  mounts its model from an S3 artifact)", or drop the clause.

**E18-4 (error). AWS's own memory figure for nucleus lite is now stated as a plain fact.**
- Sentence: "Nucleus lite, written for constrained devices, uses less than 15 MB and has no deferral to plumb".
- F07-85 quotes AWS's page, which says it "uses less than 15MB RAM". F07-138 records AWS's own measurement as 14.6 MB
  idle and 15.8 MB with six small components, on a Raspberry Pi 4 (marked `[vendor claim]`). The before text said
  "documented at less than 15 MB of memory".
- Fix: "Nucleus lite, written for constrained devices and documented at under 15 MB, has no deferral to plumb".

### Minor

**m18-1. The 2 GB is a limit on one component's artifacts, not something the device software checks.**
- Sentences: the h1 description ("the 2 GB package AWS's device software accepts") and P1 ("three times the 2 GB that
  AWS's device software accepts in one package").
- F07-87 is a Greengrass V2 service quota: "Maximum total size of component artifacts". P3 states it correctly.
- Fix: "the 2 GB one Greengrass component may carry".

**m18-2. "about 6 GB" drops the "+" in F07-54's "~6 GB+".**
- Sentence: "about 6 GB of weights for pi0.5" (P1).
- The figure is a lower bound for the weights on disk in the Thor tutorial. P4 quotes it correctly.
- Fix: "6 GB or more of weights".

**m18-3. "No undo" and "no brake" lose "automatic".**
- Sentences: the h1 description ("an update can be stopped but not undone"); "Across the fleet there is no undo."; and
  item 1, "Without one the fleet has no brake."
- F07-164's use line says a bad policy that is still running "is reverted by a new revision that pins the old
  version", and a deployment can always be cancelled by hand (F07-164). The body says this a sentence later, so the
  reader is not misled for long.
- Fix: "not automatically undone" / "no automatic undo" / "no automatic brake".

**m18-4. The timing claim holds only on the illustrative link.**
- Sentence: "At the example's pace all twenty are notified within 3 minutes, before any arm can have downloaded the
  policy and failed to start it".
- The claim rests on the 100 Mbit/s link (8 minutes for one arm alone). On a 1 Gbit/s link one arm finishes in about
  48 s. The claim also assumes that a notified arm has left `QUEUED`, which no entry states.
- Fix: add "on the illustrative link".

**m18-5. The Docker application manager pulls images; it does not run Docker.**
- Sentence: "The Docker application manager, the Greengrass component that runs Docker for you, pulls it from the
  registry."
- F07-153 says it downloads images and manages ECR credentials. F07-154 says "The Docker daemon started and running
  on the core device before you deploy this component."
- Fix: "the Greengrass component that pulls images for you".

**m18-6. Two cross-references to section 17 overstate what that section did.**
- "section 17, Running on the Robot, set one up beside one arm". Section 17 lays out a plan "not yet run on a device".
- "The Spark is the NVIDIA desk machine whose inference section 17, Running on the Robot, timed." The 116.6 ms there
  is NVIDIA's table (F07-5/F07-6), not our timing.
- Fix: "described one beside one arm"; "whose inference time section 17 reports from NVIDIA's table".

**m18-7. "Nucleus lite cannot use shadows" is wider than both the matrix row and the before text.**
- The feature matrix row (F07-135) is "Interact with device shadows: No". The register reads that "a lite device that
  wants a shadow must speak to the shadow MQTT topics itself `[our reading]`" (F07-135, F07-177). The before text
  said "does not support the component that syncs it".
- Fix: "Nucleus lite has no shadow support of its own".

**m18-8. "takes" hardens "can take".**
- Limits table: "A change to the AWS IoT policy on a device certificate takes 6 to 8 minutes to become effective."
- F07-188 quotes "can take anywhere between 6 and 8 minutes".
- Fix: "can take 6 to 8 minutes".

**m18-9. Our-reading labels dropped on two design statements.**
- "So the files go to Amazon S3, and MQTT carries a short per-episode record". F07-176 marks "MQTT for signals, S3 for
  payloads" as `[our reading]`, because no AWS guidance was located. The before text said so. The size argument is now
  shown in the text, so this is minor.
- "which puts a Java program back on a device whose nucleus was chosen to avoid one". F07-139 marks this as
  `[our reading]`. The before text said "(our reading)".

**m18-10. The four endpoints are only those for basic operation.**
- Sentence: "The device dials out to four endpoints".
- F07-190 lists four endpoints "for basic operation". Its use line adds ECR endpoints for image pulls, which the
  section's recommended private-image route needs.
- Fix: "four endpoints for basic operation, plus ECR's for a private image".

**m18-11. The Java version is cited to an entry that does not carry it (unchanged from the before text).**
- Sentence: "The Java nucleus needs a Java runtime of version 8 or later." It is cited to F07-143, which does not
  state the version. F07-84 does ("Java Runtime Environment (JRE) version 8 or greater").
- Fix: add F07-84.

**m18-12. The caption and the figure disagree.**
- The loop figure's caption says "Episode files go up from the twenty arms into one bucket". The figure and its step
  1 show three arms sending ("Three arms finish an episode"), whose files join the others' in the bucket.
- Fix: "from three of the twenty arms".

### Checked, with no finding

- F07-95 and F07-164 support the brake with no reverse gear. "only QUEUED job executions are canceled"; IN_PROGRESS
  executions "will not be canceled"; a manual cancel leaves devices that "already run the deployment" unchanged; a new
  revision cancels the previous revision's job. The per-arm automatic rollback is stated as one arm only (F07-89,
  F07-163). Only the wording in m18-3 is wide.
- The hundred and the sixteen keep their status and owners. "An illustrative hundred" is marked as an illustration.
  AWS keeps its rate example ("AWS's own rate example steps every 1,000 devices", F07-93). The authors keep the 16
  robots and both latencies ("the authors report ... figures they note depend on network configuration and
  contention", F07-108, F07-109).
- Every setting printed matches F07-162, F07-92 and F07-94: 5 a minute, x2, 10 notified or 5 succeeded, 50 maximum,
  5% after 100, 5 minutes, NOTIFY_COMPONENTS 30 s, validation 60 s, ROLLBACK, constant rate at least 1, base rate 1 to
  1000, factor 1.1 to 5, abort minimum at least 1, threshold up to 100 with two decimals, CANCEL only, timeout 1 minute
  to 7 days.
- The limits table matches F07-87, F07-167, F07-128, F07-169, F07-170 and F07-148 (one cell is m18-8).
- Every derived number reproduces:
  - Download: 6 x 8,000 / 100 = 480 s; 20 x 8 = 160 min; 3 x 8 = 24 min; 120 / 480 = a quarter.
  - Notification pace: 10 / 5 = 2 min; 20 arms notified within 3 min.
  - Store and versions: 6 + 6 = 12 > 10 GB; 5,000 / 24 = 208 days.
  - Recording rate: 2 x 0.86 = 1.72 Mbit/s; 775 / 3,600 = 0.215 MB/s; raw 199 GB/h; 257x.
  - Fleet uplink: 20 x 1.72 = 34 Mbit/s; 100 x 1.72 = 172 Mbit/s.
  - Delivery against recording: 20 x 6 = 120 GB; 20 x 775 MB = 15.5 GB/h; 120 / 15.5 = 7.7 h.
  - Robot Data Factory: 38.41 / 0.215 = 179; 38.41 x 8 = 307 Mbit/s, three times 100.
  - MQTT: 200 x 1,024 / 128 = 1,600 messages; 1,600 is more than a thousand times; 0.215 MB/s against 512 KB/s.
  - Files and uploads: 200 / 387 x 60 = 31 min; 96 + 70 = 166 MB; 200 / 5 = 40 parts.
- The Greengrass hook-up placeholder is word for word the same as before ("What will land here" and "Where it will
  come from" both identical). It now follows the step list instead of preceding it, and the line "Everything above is
  read from documentation and source code; nothing was run on a device" was dropped. The h1 description keeps "not run
  on a device", so the placeholder's meaning is unchanged.
- Cross-references hold: section 5 (VLA); section 9 (the example dataset); "Earlier sections used rollout for one run"
  (sections 8, 16 and 17 use it that way); section 17 (the control loop in the policy container); section 19 (title
  "What the Agent May Touch"); section 24 (prints the TokenExchangeService recipe that calls S3).
- Note, no finding: F07-155's claim sentence says deferring needs an `accessControl` grant, but its quoted evidence is
  generic. The conclusion "cannot defer" still holds, because the socket mount and the two variables are missing.

### Count

About 290 claims checked: every number, quote, qualifier, owner, citation target and cross-reference in the after
text. Findings: 4 errors, 12 minor.
