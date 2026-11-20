# Physical AI dive: technical accuracy review B (sections 9 to 14, 16 to 18)

Reviewed 2026-11-20. Scope: technical errors only, in the rendered text of /tmp/pai-text/ files 09, 10, 11, 12, 13, 14, 16, 17, 18, checked against the claim registers in `deep-dives/physical-ai/research/2026-11/` and, where stated, against the primary source fetched today.

Evidence labels: [AUTHORITATIVE] = first-party page fetched during this review; [REGISTER] = the dive's own register entry (its quote of a first-party source, not re-fetched by me); [SPECULATIVE] = my inference.

Totals: 6 findings. High confidence 2, medium 2, low 2. Ordered by severity.

---

## Finding 1 (section 18, The Fleet). The 60-second figure is described as a cap on deferral and as a fixed wait; it is a no-response timeout

Confidence: high.

Sentences, quoted exactly:

- "By default it notifies every running component before replacing it, the component can answer that now is a bad moment, and the nucleus waits 60 seconds; after that "the deployment proceeds on the device". An episode lasts tens of seconds, so our reading is that the policy component defers until the gripper is empty, with the timeout set above the longest episode."
- "Under a minute each way, on the authors' own plumbing, where a staged deployment's default handshake alone waits 60 seconds."
- Rollout animation, step 3 (`ROLLOUT_STEPS` in `src/sections/Fleet.tsx` line 87): "The nucleus asks the running policy component whether it is safe to update, waits 60 seconds by default, then starts the new version."
- Diagram label: "asked first; default wait 60 s". Figure caption: "The 60-second wait is the documented default."

What is wrong: two different mechanisms are merged.

1. `timeoutInSeconds` (default 60) is how long the nucleus waits for a component that does not answer the notification. It is not a wait that every deployment pays, and it does not bound a deferral.
2. A component that answers with `DeferComponentUpdate` sets its own delay through `recheckAfterMs`; the nucleus waits that long and then asks again. A component can therefore hold an update for as long as it keeps answering, and it lets the update through at once by answering with 0. Nothing requires the deployment timeout to exceed the episode length.

Consequences in the text: (a) "with the timeout set above the longest episode" is the wrong lever. The policy component must subscribe and answer inside the timeout; the episode length is covered by `recheckAfterMs`, repeated. (b) "default handshake alone waits 60 seconds" overstates the cost: a component that acknowledges is replaced without the wait, so the comparison with the 38 s and 41 s medians of the "Learning While Deploying" fleet loop (register entry F07-109, loop latencies of the 16-robot run) does not hold as written. (c) The animation and diagram label present 60 s as a wait that always happens.

Evidence:

- [AUTHORITATIVE] Greengrass developer guide, "Interact with component lifecycle", https://docs.aws.amazon.com/greengrass/v2/developerguide/ipc-component-lifecycle.html (fetched 2026-11-20): "If a component doesn't respond to the component update notification, the nucleus waits the amount of time that you specify in the deployment's component update policy. After that timeout, the nucleus proceeds with the deployment. The default component update timeout is 60 seconds." and, for `recheckAfterMs`: "The amount of time in milliseconds for which to defer the update. The nucleus waits for this amount of time and then sends another `PreComponentUpdateEvent` ... Specify `0` to acknowledge the update. This tells the nucleus that your component is ready for the update."
- [REGISTER] F07-90 (default component update policy: notify, 60 s) quotes the API reference: "The amount of time in seconds that each component on a device has to report that it's safe to update. If the component waits for longer than this timeout, then the deployment proceeds on the device." The register headline ("asks components before updating them and waits 60 seconds") carries the same merge into the section.

Corrected statement: "By default the nucleus notifies every running component before replacing it. A component that subscribes can answer with a deferral of its own length, after which the nucleus asks again, or acknowledge at once. A component that does not answer within 60 seconds (the default timeout) is replaced anyway. So the policy component defers, in short repeated intervals, until the gripper is empty." Replace "default handshake alone waits 60 seconds" with "where a component that never answers the update notification adds up to 60 seconds by default". Diagram label: "asked first; proceeds after 60 s if no answer".

Not checked: whether a deferral period counts against the job's `inProgressTimeoutInMinutes` [SPECULATIVE: it plausibly does, since the execution is already in progress; worth one sentence only after confirming].

---

## Finding 2 (section 18, The Fleet). The exponential rollout rate rises on notifications alone; the text says only on success, and reads the example's two thresholds as "and"

Confidence: high on the documentation text, medium on the consequence drawn for robots.

Sentences, quoted exactly:

- "The rate rises only on evidence of success."
- "start at 5 devices per minute, double once 10 were notified and 5 succeeded"
- "A staged rollout updates a few devices first, widens as successes accumulate and stops when too many fail."
- Animation step 5: "The rollout widens to the fleet group, and the rate grows only as successes are reported." Diagram label: "the rate grows as successes are reported".

What is wrong: the two rate-increase criteria are alternatives. The rate steps up when either the notified count or the succeeded count reaches its threshold. A device is "notified" when the job execution is sent to it, before it has downloaded or started anything. The section itself states the either/or correctly one sentence earlier ("another 1,000 devices have been notified or have succeeded") and then contradicts it. In the documented Greengrass example (10 notified, 5 succeeded, base rate 5 per minute), 10 devices are notified after two minutes, so the rate doubles before any arm can have finished a multi-gigabyte download [SPECULATIVE: my arithmetic from the example's own numbers]. A rollout that must widen only on success sets `numberOfSucceededThings` alone.

Evidence:

- [AUTHORITATIVE] AWS IoT developer guide, "How job configurations work", https://docs.aws.amazon.com/iot/latest/developerguide/jobs-configurations-details.html (fetched 2026-11-20): "The job will start at a rate of 50 job executions per minute and continue at that rate until either 1,000 things have received job execution notifications, or 1,000 successful job executions have occurred." Table row: "Number of notified devices or successful job executions to satisfy a rate increase".
- [REGISTER] F07-93 (AWS's 50, 100, 200, 400 per minute rollout example) carries the same "either ... or" quote. F07-162 (the documented create-deployment example with rollout, abort and timeout) paraphrases it as "after 10 devices have been notified and 5 have succeeded", which is where the "and" comes from.

Corrected statement: "double once 10 devices were notified or 5 succeeded, whichever comes first" and "The rate rises on notifications as well as on successes. To widen only on evidence of success, set `numberOfSucceededThings` and leave `numberOfNotifiedThings` out." Animation and label: "the rate grows as devices are notified or succeed".

---

## Finding 3 (section 18, The Fleet). "A node can take up to 30 minutes to rejoin" drops the condition that limits it

Confidence: medium.

Sentence, quoted exactly: "Running pods keep running, nothing can be changed, and a node can take up to 30 minutes to rejoin."

What is wrong: claim wider than the source. The 30 minutes is the cap on the Systems Manager agent's credential-refresh backoff. It applies to hybrid nodes that authenticate with Systems Manager hybrid activations, and only when the outage was long enough for the credentials to lapse. The section's sentence applies it to any hybrid node after any disconnection. The other credential route, IAM Roles Anywhere, is not covered by the quote.

Evidence: [REGISTER] F09-125 (hybrid node behaviour during a disconnection) is itself scoped ("a node on Systems Manager credentials can take up to 30 minutes to rejoin") and quotes the EKS Best Practices Guide, https://docs.aws.amazon.com/eks/latest/best-practices/hybrid-nodes-host-creds.html: "In SSM agent version 3.3.808.0 and later (released August 2024), the exponential backoff is capped at 30 minutes. Depending on the duration of your network disconnection, it might take up to 30 minutes for SSM to refresh the credentials, and hybrid nodes will not reconnect to the EKS control plane until the credentials are refreshed." Also note the section cites F09-119 (hybrid nodes unfit for intermittent links) for this sentence; the 30-minute figure lives in F09-125.

Corrected statement: "Running pods keep running, nothing can be changed, and a node that authenticates through Systems Manager can take up to 30 minutes to rejoin once its credentials have lapsed."

---

## Finding 4 (sections 17 and 18). Nucleus lite memory: two figures that do not agree, and a version attached to the wrong one

Confidence: medium that the two sections read as inconsistent; low on severity.

Sentences, quoted exactly:

- Section 17: "Nucleus lite (v2.7.0) is a set of small C programs ... AWS measured it at 14.6 MB of memory idle and 15.8 MB with six small components running, on a Raspberry Pi 4."
- Section 18, vocabulary table: "nucleus lite, small C daemons documented at less than 15 MB."

What is wrong: (a) Cross-section consistency. Section 18 gives "less than 15 MB" with no qualifier while section 17 gives AWS's own measurement of 15.8 MB under a light load (and the register adds 15.2 MB peak during a cloud deployment). Both are first-party; read together, section 18's figure is the idle figure only. (b) Attribution in section 17: the measurement was taken on v2.5.0 packages; the file sits in the v2.7.0 tag. The sentence attaches it to "Nucleus lite (v2.7.0)".

Evidence: [REGISTER] F07-85 (nucleus lite is a second runtime for constrained devices): "optimized for minimal memory footprint (uses less than 15MB RAM)". [REGISTER] F07-138 (AWS's own measurement of nucleus lite): "All numbers below were measured against the official `aws-greengrass-lite` v2.5.0 prebuilt `.deb` packages" and row "aarch64 | Raspberry Pi 4 | 14.6 MB | 15.7 MB | **15.8 MB**"; the register's verdict line calls F07-138 "the measurement behind" the headline.

Corrected statement: section 18, "documented at less than 15 MB idle (section 17 gives AWS's measurement: 14.6 MB idle, 15.8 MB with six small components)". Section 17, "AWS measured v2.5.0 at 14.6 MB ...".

---

## Finding 5 (section 18, The Fleet). The abort rule's minimum counts notified devices; the text says executed

Confidence: low (wording follows the field name, but the mechanism differs).

Sentence, quoted exactly: "cancel when 5% of executions fail after at least 100 have executed"

What is wrong: `minNumberOfExecutedThings` is defined by AWS as the number of things that have received the job notification, so the rule can fire while most of those 100 are still downloading. The percentage is then taken over a small number of finished executions. The follow-on sentence ("a minimum of 100 executed devices never fires in a fleet of 20 arms") stays true either way.

Evidence: [REGISTER] F07-94 (a job can cancel itself: the abort criteria) quotes the AWS IoT API reference, `AbortCriteria`: "minNumberOfExecutedThings / The minimum number of things which must receive job execution notifications before the job can be aborted."

Corrected statement: "cancel when 5% of executions fail, once at least 100 devices have been notified".

---

## Finding 6 (section 11, Augmentation and Synthetic Data). The "weights alone" reading of the framework FAQ uses a parameter count the same FAQ contradicts

Confidence: low (it is labelled as the dive's reading; the issue is an unstated conflict in its source).

Sentence, quoted exactly: "The framework FAQ. 32 GB for Nano and 128 GB for Super, with no resolution, precision or workload given. By our reading this is the size of the weights alone: 16B parameters at 2 bytes each is 32 GB."

What is wrong: the FAQ table that prints 32 GB and 128 GB labels the two models "8B" and "32B". The arithmetic 16B x 2 bytes = 32 GB takes the 16B from the model card, which the cited page does not say. With the FAQ's own label the same arithmetic gives 16 GB, so the reading is supported only if the FAQ's parameter labels are wrong.

Evidence: [REGISTER] F03-123 (the Cosmos framework FAQ's GPU memory table): rows "Cosmos3-Nano (8B) | 32 GB" and "Cosmos3-Super (32B) | 128 GB", and the entry's headline: "The table labels the models "8B" and "32B", which differs from the 16B and 64B on the model cards".

Corrected statement: add the condition: "The FAQ labels the models 8B and 32B, where the model cards say 16B and 64B. Taking the model cards' counts, 16B parameters at 2 bytes each is 32 GB, so by our reading this is the size of the weights alone."

---

## Checked and found consistent (no finding)

- Dates flagged in the brief, F07-184 (Device Defender detect closing to new customers) against F07-191 (AWS lifecycle tables for the IoT family): section 18 quotes "August 31, 2026" and attributes it to the Device Defender page. [AUTHORITATIVE] The availability-change page, fetched 2026-11-20, says "will no longer be available to new customers starting August 31, 2026" three times. The "June 30, 2026" in F07-191 is the date column of the General Reference maintenance table, a different date for the same change; section 18 does not print it. FleetWise "announced March 31, 2026", RoboMaker "September 10, 2025" and Greengrass V1 "October 7, 2026" match F07-191, F07-98 and F07-99.
- Section 17 against section 18: Java nucleus 96 MB RAM and 256 MB disk; versions v2.18.4 and v2.7.0; the container recipe (identical text); token exchange service behaviour; "no GPU flag in any of the four recipes"; nucleus lite lacking the Greengrass CLI and the defer calls; episode size (86.1 MB / 50 = 1.72 MB, matching section 9); 6 GB at 100 Mbit/s = 480 s. All agree apart from finding 4.
- Section 10 decode table: [AUTHORITATIVE] NVIDIA's support matrix, fetched 2026-11-20, confirms H100 (7 NVDEC, AV1 no), A100 (5, no), A10 (2, yes), L4 (4, yes), HGX B200 (7, yes) and no H200 row.
- Arithmetic recomputed: Wilson intervals 67.0 to 88.8% and 78.6 to 95.7%; Fisher p = 0.262 and 0.0228; 199 trials per policy; 149.0 / 33.3 = 4.47; 257 to 1, 775 MB per hour and 199 GB per hour in section 9; 57,240 x 0.005 = 286; 5.77M / 8192 = 704; the 6.7x, 62x and 1.9x camera ratios; 7.6 GPU-seconds per second of video; 81,000 GPU-hours for DreamGen; the Robot Data Factory totals; the measured latency chains (108.76 and 138.98 ms).

## Sections with no errors found

- Section 9, Collecting Data: no errors found.
- Section 10, Processing and Curating: no errors found.
- Section 12, Physics Simulation: no errors found.
- Section 13, Rendering and Ray Tracing: no errors found.
- Section 14, Sim-to-Real and Real-to-Sim: no errors found.
- Section 16, Evaluation: no errors found.
- Section 17, Running on the Robot: no errors beyond the version attribution in finding 4.

## Sources, by tier

[AUTHORITATIVE], fetched during this review:
- https://docs.aws.amazon.com/greengrass/v2/developerguide/ipc-component-lifecycle.html
- https://docs.aws.amazon.com/iot/latest/developerguide/jobs-configurations-details.html
- https://docs.aws.amazon.com/iot-device-defender/latest/devguide/dd-detect-availability-change.html
- https://developer.nvidia.com/video-encode-decode-support-matrix

[REGISTER], the dive's own entries, not re-fetched: F03-123, F07-85, F07-90, F07-93, F07-94, F07-98, F07-99, F07-109, F07-138, F07-162, F07-184, F07-191, F09-119, F09-125, and the entries behind the consistency checks in sections 9 to 16.
