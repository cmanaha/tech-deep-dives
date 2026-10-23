# Gate 3 Quality Score, Batch C (October 2026 refresh)

Scorer: Gate 3 quality scorer, 2026-10-23. Scope: Overview, AIMLInference, HPC,
NetworkComparison, DecisionGuide, EKSIntegration, SageMaker, StorageDataPaths.

Governing standards: `deep-dives/efa/revamp/section-shape-standard.md`,
`deep-dives/efa/revamp/leverage-pass-standard.md`, CLAUDE.md "Writing Style: No
AI Tells" and "Section Shape". Diff base for "changed in this refresh":
`b39b4d3..HEAD` (HEAD = 24fc4b2, "efa: close the NCCL fact check report").

Scores what exists. Corrections are against written rules only, with exact
replacement text. Leverage candidates are limited to blocks the refresh diff
touched and may not assert anything absent from the section. Enhancements are
in each section's BACKLOG.

STATUS: IN PROGRESS

---

## 1. Overview.tsx (What is Elastic Fabric Adapter?)

Refresh diff: three blocks touched, L76-83 (definition sentence, vendor-claim attribution), L86-88 (tail-figure hedge scoped to "this research located"), L155-163 (Hardware column: attach at launch or while stopped, cited to create-efa.html).

### Gate 3 score: 8 / 10

- The opening paragraph (L70-73) frames a challenge, not a problem: per-message kernel cost, and which workloads live inside it. It then lands the one model the whole dive hangs on: the tail decides the step time (L88-89), with the factor-of-ten p99 figure carried twice (L87, L170).
- The 30-second mental model (L145-188) is a real three-layer map (hardware, SRD, libfabric), each column ending on the section that takes it apart. Practical facts are present and short: attach at launch or while stopped (L156-157), encryption is automatic and there is nothing to switch on (L96-98), no charge for EFA itself (L98-100), RDMA read/write is an instance-type question (L172-174).
- The hedge on the tail figure is correctly scoped (L86, "this research located"), and the "AWS describes" attribution at L81 is load-bearing under rule 4 (vendor performance claim with no published figure).
- Held at 8 by two vendor claims still flattened into declarative prose (L77-79 positioning line, L95-96 "no impact on network performance"), two acronyms used a few words before their expansion (ENA, RDMA), and an ending that is navigation (the libfabric column) rather than a reader action, which is tolerable for an overview but not a payoff.

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 4 | 3 | 4 | 5 | 4 |

- Mental model 4: "the tail decides the step time" and the three-layer stack are both predictive; neither is drawn, and the overview is the place a single stack diagram would carry most.
- Practical 3: four checkable facts, none of them made typeable (how to confirm RDMA read/write on an instance is deferred to Data Path).
- Rigor 4: "millions of small messages per second" (L71-72) is an uncited quantity; the StatusIndicator verdicts (L123, L132, L140, e.g. "Enables cloud HPC migration") are uncited judgements; two vendor claims read as declarative fact (corrections 1 and 2).
- Accuracy 5: every cited claim matches FC7's re-read of efa.html and create-efa.html.
- Economy 4: dense; the only dilution is signposting clauses that restate where things live.

### Corrections

1. **L76-79, vendor positioning claim flattened into declarative prose** (rule: never flatten a vendor performance claim; attribution is load-bearing under case 4). Current: "is a network interface for EC2 (Elastic Compute Cloud) instances that enables applications to reach the <strong>performance of an on-premises AI/ML or HPC cluster</strong> with the scalability of the cloud."
   Replace with: "is a network interface for EC2 (Elastic Compute Cloud) instances that AWS positions as giving applications the <strong>performance of an on-premises AI/ML or HPC cluster</strong> with the scalability of the cloud." (Leverage candidate 1 below is an alternative fix that deletes the clause instead.)
2. **L95-96, vendor performance claim flattened.** Current: "with 256-bit encryption, with no impact on network performance, and it is applied automatically between cluster members"
   Replace with: "with 256-bit encryption, which AWS rates as having no impact on network performance, and it is applied automatically between cluster members"
3. **L159-160, acronym used before its expansion.** "ENA" first appears in "an EFA (EFA with ENA) interface"; the expansion follows eight words later.
   Replace "an EFA (EFA with ENA) interface, which creates both an EFA device and an ENA (Elastic Network Adapter) device" with "an EFA (EFA with ENA, the Elastic Network Adapter) interface, which creates both an EFA device and an ENA device".
4. **L170-172, acronym used before its expansion.** "RDMA" first appears inside the RoCE expansion; its own expansion is the next sentence.
   Replace "and RoCE (RDMA over Converged Ethernet). RDMA (Remote Direct Memory Access) is a separate question" with "and RoCE (RDMA over Converged Ethernet, where RDMA is Remote Direct Memory Access). RDMA is a separate question".

### Leverage candidates (blocks changed in this refresh)

1. **Delete, L77-79** ("that enables applications to reach the performance of an on-premises AI/ML or HPC cluster with the scalability of the cloud. It achieves this through"). The reader's first definition of EFA spends its clause on positioning; the mechanism and the attributed result follow immediately and carry the meaning. Proposed: "<strong>EFA (Elastic Fabric Adapter)</strong> is a network interface for EC2 (Elastic Compute Cloud) instances built on <strong>OS-bypass</strong>: applications talk directly to the network hardware, skipping the kernel network stack entirely. AWS describes the result as lower and more consistent latency and higher throughput than the operating system's TCP/IP path [efa]." Resolves correction 1.
2. **Reorder, L86-88.** Lead with the section's strongest number rather than with the hedge. Proposed: "Relaxing in-order packet delivery dropped p99 tail latency by around a factor of ten [hpcBlog], the one comparative latency figure this research located from AWS. A collective finishes when its slowest member finishes, so the tail is what decides the step time." Hedge scope unchanged.
3. **Delete, L157** ("never while it runs"). "At launch or while the instance is stopped" already says it; the trailing clause is there for rhythm (section-shape rule 4, inside-a-sentence test). Low priority: the explicit limit has some practical value for a reader planning a live change.

### Backlog

- One rendered diagram of the three-layer stack (application, libfabric/aws-ofi-nccl, SRD on the Nitro card) for the 30-second mental model.
- A source for "millions of small messages per second" (L71-72), or a softer quantity.
- A closing pointer that routes the reader by question (training, inference, HPC, "do I need EFA at all") to the Decision Guide.

---

## 2. AIMLInference.tsx (EFA for AI/ML Inference)

Refresh diff: one container touched, L118-168 (NIXL column rewritten around code-pinned host posting and the vLLM conversion caveat; Libfabric 1.21.0 sentence trimmed; "Different patterns, so different libraries" deleted; Alert loses the wrong-organization aside; vLLM integration paragraph replaced with the LIBFABRIC backend setting, `kv_role` values and the AWS-sample doc-code conflict).

### Gate 3 score: 8 / 10

- The opening (L96-102) reframes the reader's question from "does the model fit" to "what crosses the network per request, and how often", which is the predictive model the rest of the section applies pattern by pattern.
- The refreshed vLLM paragraph (L152-168) is the section's best block: one setting to type (`"backends": ["LIBFABRIC"]`, because the connector defaults to UCX), one per-role value (`kv_producer` / `kv_consumer`), and a doc-versus-code conflict framed at the moment the reader copies the AWS sample.
- The strongest number lands twice (h2 description L173 and L186-188: one added millisecond becomes a second per response), and the section ends on a five-question ladder (L256-282) whose first "yes" decides the architecture, a clean next action.
- Held at 8 by one "not X, it is Y" construction in the opener, one h2 description that restates its title, uncited sizing numbers in unchanged blocks, and a speculative-decoding latency claim that reads wrong (see accuracy flag).

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 4 | 4 | 4 | 4 | 4 |

- Mental model 4: bytes-per-request, NCCL steady collectives versus NIXL bursty point-to-point, and the per-token multiplier are all predictive; none is drawn.
- Practical 4: typeable config (L154-161), a sizing exercise (L176-179, L188-190), the zone boundary (L246-249, L268-272), and the closing ladder.
- Rigor 4: the changed NIXL/vLLM block is code-pinned and FC7 holds it. Unchanged blocks carry uncited figures and judgements: "the 640 GB of total GPU memory in a P5 instance" (L176-177), "Roughly 300B parameters at fp16, or roughly 600B at fp8 and int8, fit on a single P5" (L237-238), "multi-node inference runs acceptably on standard networking" (L245-246), "most fine-tuning and inference workloads stop here" (L260).
- Accuracy 4: see the accuracy flag below. Also L237-238 counts weights only; at 300B fp16 the weights take about 600 of 640 GB before any KV-cache, so "fit" is true of weights and tight for serving [scorer's arithmetic from the section's own figures].
- Economy 4: one redundant fragment (L118) and the vLLM caveat placed mid-comparison (L121-125).

### Corrections

1. **L100-102, "not X, it is Y" construction** (rule 4, define by what it is; the contrast with model size is already made at L96-97).
   Current: "So the figure to work out for your own deployment is not the model size. It is how many bytes leave the instance per request, and how many times that happens per response."
   Replace with: "So the figure to work out for your own deployment is how many bytes leave the instance per request, and how many times that happens per response."
2. **L106, h2 description restates the title** ("The model fits on every node and the KV-cache still crosses the wire on every request" repeats "Disaggregated serving puts the KV-cache on the wire").
   Replace with: `description="Which transfer library carries the KV-cache, and the two connector settings that put it on EFA."` (traces to L116-133 and L153-161).

### Accuracy flag (for the fact-check track; not a written-rule correction)

- **L213-215 and L276, speculative decoding and time-to-first-token.** "every round-trip adds to time-to-first-token, which is what EFA shortens here" and "The verification loop runs per token and lands in time-to-first-token". [SPECULATIVE: scorer's reading] Draft-and-verify rounds run during decode, after prefill has produced the first token, so the round-trips land in time between output tokens rather than time to the first one. L276's own "runs per token" already implies this. Recommend a fact check against a primary source before Gate 3 closes; if it holds, replace "time-to-first-token" with "the time between output tokens" in both places.

### Leverage candidates (blocks changed in this refresh)

1. **Delete, L118** ("Purpose-built for disaggregated inference transfers."). The adjacent column says the same thing with the reason attached (L141-143, "NIXL is designed for bursty point-to-point transfers in inference"); the NIXL column then opens on the mechanism.
2. **Reorder, L121-125 into the vLLM paragraph (after L168).** The vLLM conversion caveat interrupts the NIXL-versus-NCCL SM comparison; it belongs with the settings the reader is choosing for the two fleets. Proposed sentence at the end of the vLLM paragraph: "When prefill and decode use different block sizes or KV layouts, vLLM runs a conversion on the decode GPU [vllmKvConvert][vllmKvConvertWhen], so compare those two settings across the prefill and decode fleets." Scope unchanged (it does not claim matching them removes all GPU work).
3. **Reorder, L131-134 into the vLLM paragraph (before L153).** The Libfabric version floor and the LIBFABRIC backend setting are one check on one image; together they read as the reader's configuration step. Proposed: "NIXL reaches EFA through its libfabric backend and integrates with Libfabric 1.21.0 and later [efa], so check the Libfabric version in the serving image." The "and later" scope is kept; "requires" is not introduced.
4. **Re-express, L153-159.** The sentence states the action first and stacks two reasons behind "because". Leading with the reason lets the setting land last. Proposed: "<strong>vLLM integration:</strong> vLLM implements disaggregated serving through NixlConnector. LIBFABRIC is the backend that takes NIXL traffic over EFA [efaNixl], and the connector defaults to UCX (Unified Communication X) [vllmBackends], so name it in <code>kv_connector_extra_config</code> with <code>"backends": ["LIBFABRIC"]</code>."

### Backlog

- A rendered prefill-to-decode diagram showing the KV-cache crossing EFA once per request, with the backend choice on the arrow.
- A citation for the P5 GPU memory total (L176-177) and for the single-P5 parameter ceilings (L237-238).
- A worked bytes-per-request example (KV-cache bytes per token times prompt length) to make the opener's figure computable.

---

## 3. HPC.tsx (EFA for Traditional HPC)

Refresh diff: L167-191 (MPI support scope restated; three-column MPI layout cut to two; Open MPI column replaced with installer paths and `module load openmpi5`; Intel MPI column rewritten with `I_MPI_OFI_PROVIDER=efa` fail-fast and version-scoped `I_MPI_MULTIRAIL=1`; MPICH column deleted), L254-256 (NVMe expansion), L261 ("newest" dropped from the Hpc8a header).

### Gate 3 score: 8 / 10

- The opening (L82-85) and the coupling split (L94-97) give a model the reader can apply to code they own: time inside MPI calls is what the fabric acts on, so measure where wall time goes before buying.
- "Measured performance" (L122-160) is well built: each result names the pair it compares, CFD Direct is attributed as the third party it is, and each column ends on what to do (record parallel efficiency; one environment variable; re-measure after upgrades). The multi-rail figure (10% at 32 instances, over 30% at 192) lands twice (L141-142, L238-239).
- The refreshed MPI wiring (L166-191) is the most practical block in the section: two install paths, one command, two Intel MPI variables with their reasons, and a version range for multi-rail, all cited.
- Held at 8 by the Hpc8a vendor figures stated as fact (L264-266), unexpanded niche acronyms in the workload lists, a dropped source qualifier on the Open MPI default, and a close on an uncited aside ("Nitro v6 pairs with EFA v4", L266-267) rather than on the purchase decision.

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 4 | 5 | 4 | 5 | 4 |

- Practical 5: typeable settings with reasons, version ranges, install paths, purchase constraints (no Spot, no Dedicated Hosts, no metal), and a metric to record.
- Rigor 4: correction 1 (vendor figures); the message-size paragraph (L206-211) uses a software-upgrade comparison (new EFA stack against old) as directional evidence for EFA's per-message advantage, which that citation cannot bear beyond "agrees in direction"; memory registration pinning (L201-203), "Nitro v6 pairs with EFA v4" (L266-267) and "the most constrained families on EC2" (h2 description, L219) are uncited.
- Accuracy 5: FC8 holds every diff-touched claim; nothing found wrong.
- Economy 4: the Collectives column (p4d, FSDP, Megatron-LM) is GPU training evidence inside the HPC section; it earns its place only through "re-measure after upgrades".

### Corrections

1. **L264-266, vendor performance claim flattened into declarative prose** (tier 2 What's New post read as a measurement; the standard's own Trn2 example).
   Current: "The gain over Hpc7a is up to 40% in performance, up to 25% in price performance and up to 42% in memory bandwidth [hpc8a]."
   Replace with: "AWS's launch announcement puts the gain over Hpc7a at up to 40% in performance, up to 25% in price performance and up to 42% in memory bandwidth [hpc8a]."
2. **L103, niche acronyms not expanded at first use** (first reader-visible use of both is here; WRF on the same line is expanded).
   Replace "WRF (Weather Research and Forecasting), MPAS, IFS:" with "WRF (Weather Research and Forecasting), MPAS (Model for Prediction Across Scales), IFS (Integrated Forecasting System):".
3. **L140, niche acronym not expanded.** Replace "WRF v4.2.2 CONUS 2.5 km on hpc7a" with "WRF v4.2.2 CONUS (Continental United States) 2.5 km on hpc7a".
4. **L105 and L114, product acronyms not expanded at first use** (lower priority; GROMACS, OpenFOAM, ANSYS, ABAQUS and LS-DYNA read as product names and can stay).
   Replace "GROMACS, LAMMPS, NAMD:" with "GROMACS, LAMMPS (Large-scale Atomic/Molecular Massively Parallel Simulator), NAMD (Nanoscale Molecular Dynamics):" and "BWA, GATK:" with "BWA (Burrows-Wheeler Aligner), GATK (Genome Analysis Toolkit):". [Expansions for corrections 2-4 are standard project names from the scorer's knowledge; confirm each against the project's home page when applying.]
5. **L175-176, source qualifier dropped, so the claim is wider than its citation** (rule 14; FC8 H-3 and ST-6 record that efa-start.html scopes the default to "From EFA 1.30.0").
   Replace "The EFA installer installs Open MPI 4.1 in <code>/opt/amazon/openmpi</code> and Open MPI 5 in <code>/opt/amazon/openmpi5</code> by default." with "From EFA installer 1.30.0, the installer puts Open MPI 4.1 in <code>/opt/amazon/openmpi</code> and Open MPI 5 in <code>/opt/amazon/openmpi5</code> by default."

### Leverage candidates (blocks changed in this refresh)

1. **Delete, L266-267** ("Nitro v6 pairs with EFA v4."). Uncited, the section says nothing about what EFA v4 changes for the reader, and it is the last sentence of the section, so the purchase decision closes on trivia. After the delete the Hpc8a column ends on its (attributed) comparison with Hpc7a.
2. **Re-express, L168-169** ("MPICH and any other MPI sit outside that support statement."). Describes the statement rather than the reader's choice. Proposed: "Running MPICH or any other MPI means running outside that support statement." Same scope; points at the decision.
3. **Reorder, L184-190 (Intel MPI column).** Three settings in one paragraph; the version-scoped multi-rail rule is the one the WRF result and the Hpc7a column point back to, but it sits last behind two clauses. Proposed order: multi-rail sentence first ("Intel MPI 2021.6 to 2021.11 needs ..."), then the two `I_MPI_OFI_*` settings. Low priority: the current order (load the right libfabric, then fail fast, then multi-rail) is also defensible as setup order.

### Backlog

- A one-line check command that confirms MPI picked the EFA provider (for example a `fi_info -p efa` step) next to the Intel MPI settings.
- A coupling diagram (rank waits per timestep against independent ranks) for the workload split.
- An EFA-against-TCP message-size result to replace the software-upgrade figure as evidence in the message-size paragraph.

---

## 4. NetworkComparison.tsx (EFA vs Alternatives)

Refresh diff: four reader-visible edits, all in the table or the "Where EFA loses" column: L137 (BBR expanded), L160-167 (Latency row EFA cell rewritten around the 2019 launch-post figure, 15.5 microseconds one-way MPI latency), L193-198 (NVLink bandwidth gains architecture names and the 6th-generation 3,000 GB/s figure), L328-329 (SHARP expanded).

### Gate 3 score: 8 / 10

- The opener (L263-268) is a model a reader can predict with: each transport is defined by its assumption about the network beneath it, and on EC2 that leaves EFA or TCP. "SRD is tuned for the bad case, and you pay for that tuning in the good one" (L335-336) closes the trade-off column on the same model, with the ENA Express quiet-case cost as its evidence.
- The table is well sourced where it carries numbers, and its rows are framed as what changes when you switch (h2 description, L276). The factor-of-ten tail figure carries the EFA column.
- The section ends on two choice lists (L352-375), which is the reader's next action, though the lists are generic.
- Held at 8 by two vendor claims flattened in table cells (Latency, Encryption) and by a footer (L293-295) that the refreshed Latency cell now contradicts: the footer says per-column microsecond latencies stay out, and the EFA column now carries one.

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 5 | 3 | 4 | 4 | 4 |

- Mental model 5: the four-assumptions framing, path diversity growing with job size (L319-321), and the bad-case/good-case trade are all predictive.
- Practical 3: the concrete levers are the single-flow ceiling (5/10/25 Gbps) and "on EC2 that leaves EFA or TCP"; the closing lists name workload classes, not checks.
- Rigor 4: the RoCE column carries uncited judgements ("Strong, and PFC pauses can cascade on RoCE", L155; "nothing about SRD closes that gap", L327); the NVLink row omits two qualifiers FC8 found on the cited page (bidirectional; 6th generation preliminary); vendor claims flattened (corrections 1-2).
- Accuracy 4: the footer contradiction below. Nothing else found wrong; FC8 holds all diff-touched cells.
- Economy 4: the footer spends its words on what the page leaves out (sourcing method) rather than on the reader.

### Corrections

1. **L162, vendor performance claim flattened** (and consistent with the Overview's "AWS describes" handling of the same efa.html sentence).
   Replace "Lower and more consistent latency for AI, ML and HPC workloads [efa]." with "Lower and more consistent latency for AI, ML and HPC workloads, in AWS's description [efa]."
2. **L230, vendor performance claim flattened.** Replace "Automatic between cluster members. AEAD, 256-bit, no performance impact [hpcLens]" with "Automatic between cluster members. AEAD, 256-bit, and no performance impact per AWS [hpcLens]".

### Accuracy flag (created by this refresh; not a written-rule correction)

- **L293-295 footer against the L163-166 Latency cell.** The footer says "Per-column microsecond latencies stay out because no citable source giving them for these four transports was located"; the refreshed EFA cell now carries 15.5 microseconds. A reader sees a figure the footer says is absent. Proposed footer, same hedge scope, no new claim: "Every comparative figure here comes from a first-party source. Only the EFA column carries a microsecond latency: no citable source giving one for the other three transports was located, and no NVIDIA page stating per-port InfiniBand rates was located." (The file-header comment at L19-20 says the same thing and should change with it; that comment is not reader-visible.)

### Leverage candidates (blocks changed in this refresh)

1. **Re-express, L160-167 (Latency, EFA cell).** At about 40 words it is the longest cell in a table read across rows; the cell can say the same thing in fewer words and carry correction 1. Proposed: "Lower and more consistent, in AWS's description, and the EC2 User Guide gives no per-message figure [efa]. The one AWS figure located: 15.5 microseconds one-way MPI latency in a cluster placement group, from the 2019 launch post [efaGa2019]". Both hedges (silence of the User Guide; "located") are kept.
2. **Reorder, L146-172 (Tail latency and Latency rows).** The generic Latency row follows the specific tail row, so the table reads strongest-first and then dilutes it. Putting Latency above Tail latency ends the latency pair on the factor of ten, which the opener and the Overview both make the deciding figure. Low priority.

### Backlog

- NVLink row: add "bidirectional" and mark the 6th-generation figure as preliminary, both from the cited NVIDIA page (FC8 N-4); state the unit difference against the EFA Gbps figure so the row compares.
- A rendered diagram of the four network assumptions (switch in the box, lossless fabric, in-order shared network, lossy many-path fabric).
- A sourced figure or citation for the RoCE column's tail and latency cells.

---

## 5. DecisionGuide.tsx (Decision Guide)

Refresh diff (+62 words, the largest growth in this batch): L398-419 (Karpenter Alert rewritten: labels now come from the EKS control plane's cloud controller manager, HyperPod topology-aware scheduling paragraph moved second), L494-539 (capacity planning: new Alert on reservation-versus-block placement, Capacity Blocks paragraph gains the Organization-wide 256 count, 11:30 UTC end and the P6e-GB200 10:30 UTC checkpoint arithmetic; ODCR paragraph re-cited with the "modifying or adding" risk; Capacity Blocks decision rule gains up-front billing), L551-552 (LoRA and QLoRA expanded).

### Gate 3 score: 7 / 10

- The model is sound and early: EFA costs nothing and constrains a lot (h1, L233-240); the Three Questions (L253-295) end the conversation for single-node or compute-bound work before any configuration, and "EFA pays off in proportion to the share of wall clock a job spends in collectives" (L271-272) is predictive. The Spot container's co-location model (L424, L435-442) explains why interruptions arrive together.
- Practical leverage is the highest in the batch: Karpenter fields and disruption settings (L372-397), the HyperPod ConfigMap change (L412-416), Spot-ineligible families by name (L460-465), Capacity Block windows, limits and end-of-block deadline (L507-519), up-front billing with no Savings Plan discount (L532-534), and a close on "Build the EFA stack into the image, then confirm the provider line on the first run" (L634-635).
- Held at 7 by economy and by rule defects. The one-zone, placement-group-recommended-not-required pair is restated ten times (L236-237, L242-248, L284-288, L182, L206, L317-320, L372-375, L435-436, L575-577, L618-627). Three hedges are wider than the research behind them (L487, L600-601, L623-624). The refreshed Karpenter Alert puts good news (labels arrive with no work) under a warning icon. And Stage 2 says NVLink carries every collective on a Trainium instance (accuracy flag).

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 4 | 5 | 4 | 4 | 3 |

- Rigor 4: the refreshed blocks are cited to the right pages (FC7 DG-01 to DG-22 hold). Outside them are uncited heuristics: "Most inference and fine-tuning workloads are single-node" (L265), "Short training runs (<2 hours)" (L457), "SRD handles asymmetric traffic patterns" (L218), plus corrections 1-3 (hedge scope). One citation placement is loose: "Up to 64 instances per block" (L508) sits under capacityBlocksUg, while FC7 DG-08 locates the 64 figure on capacity-blocks-how.html (capacityBlocks).
- Accuracy 4: see the accuracy flag. Everything diff-touched holds.
- Economy 3: the AZ/placement-group repetition above, two pointer paragraphs that only route elsewhere (L349-353, L409), and page-referential asides ("so this page does not name the shared hardware", L449; table footer L317-324 on sourcing).

### Corrections

1. **L623-624, hedge wider than the research** (FC7 surfaced it outside the diff; still present at HEAD).
   Replace "No AWS source states that training jobs use EC2 cluster placement groups" with "No AWS source located during this research states that training jobs use EC2 cluster placement groups".
2. **L485-487, universal claim from a local search (rule 14).**
   Replace "Spot rates are not published in the EC2 Price List bulk API or in any credential-free first-party AWS endpoint, so" with "Spot rates do not appear in the EC2 Price List bulk API, or in any credential-free first-party AWS endpoint located during this research, so". (Pricing.tsx:307-308 carries the same unscoped phrase; outside this batch.)
3. **L600-602, universal claim from a local search plus a negation definition** ("frozen rather than deprecated: AWS has not announced a deprecation"; a release-notes page cannot evidence the absence of an announcement elsewhere).
   Replace "The library is frozen rather than deprecated: AWS has not announced a deprecation, and the latest release is v2.5.0, dated October 17, 2024" with "The library is frozen: the latest release is v2.5.0, dated October 17, 2024, and no deprecation announcement was located during this research".
4. **L552-554, definition by absence** ("There is no p5.xlarge"). FC7 DG-20 confirms the P5 sizes listed are p5.4xlarge and p5.48xlarge only.
   Replace "One g5.xlarge, or p5.4xlarge if you want a single H100. There is no p5.xlarge [ac]." with "One g5.xlarge, or p5.4xlarge, the smallest P5 size, if you want a single H100 [ac]."
5. **L606, page-history residue** ("The underlying number holds inside that scope." answers a challenge the reader never saw).
   Replace "The underlying number holds inside that scope. P4d and P4de carry NVIDIA A100 GPUs, NCCL takes up to 24" with "On P4d and P4de, which carry NVIDIA A100 GPUs, NCCL takes up to 24".
6. **L361, h2 description restates the topic** ("What Karpenter provisions for EFA, and where network-node ranking comes from instead").
   Replace with: `description="The four Karpenter settings an EFA fleet needs, and why the network-node labels need none of them"` (traces to the four bullets L372-397 and "whatever provisioned it", L407).

### Accuracy flag (for the fact-check track; not a written-rule correction)

- **L563, with L175-176 and L194: "NVLink carries every collective" applied to trn1.32xlarge.** [SPECULATIVE: scorer's knowledge, unfetched] Trainium instances connect their chips with NeuronLink, not NVLink; the dive itself names NeuronLink for Trn2 (AIMLTraining.tsx:274). Proposed after a fact check: "NVLink on p5.48xlarge, or NeuronLink on trn1.32xlarge, carries every collective", with a Tier 1 citation for Trn1's interconnect. The table's "Single node: NVLink carries all GPU communication" (L175) needs the same treatment.

### Leverage candidates (blocks changed in this refresh)

1. **Reorder, L404-410 out of the warning Alert.** The refreshed first paragraph is good news (labels are written for you, whatever provisioned the node) under a warning icon, ahead of the actual hazard. Move it to a plain paragraph after the Karpenter list, and give the Alert a header that names the action in L412-416: `header="With Karpenter on HyperPod task governance, set TopologyAwareScheduling to false"`.
2. **Re-express, L412-416 (action first).** Proposed: "When Karpenter provisions nodes for HyperPod task governance, set TopologyAwareScheduling to false in the kueue-manager-config ConfigMap and restart the Kueue controller: topology-aware scheduling is on by default there and is not supported with Karpenter autoscaling [hyperpodEks]." Same facts, same scope ("there" becomes "for HyperPod task governance").
3. **Re-express, L515-519 (the deadline, the paragraph's most usable number).** The 10:30 UTC arithmetic hangs only off the P6e-GB200 clause, and a P5 reader gets no deadline of their own although both inputs are in the paragraph (30 minutes for instance types, 11:30 UTC end). Proposed: "Every block ends at 11:30 UTC [capacityBlocksUg]. Instance blocks start terminating 30 minutes before the end, so finish the checkpoint by 11:00 UTC on the final day; a P6e-GB200 UltraServer block needs its instances terminated at least 60 minutes before the end [capacityBlocksUg], so finish by 10:30 UTC there (our arithmetic)." (FC7 DG-14 proposes the same.)
4. **Reorder, L507-519 (split one eight-fact paragraph in two).** Booking facts (8 weeks ahead, durations, 64 and 256, one UltraServer per block) in one paragraph; end-of-block facts (termination timing, EventBridge warning, deadline from candidate 3) in a second, so the deadline lands as its own block just before the decision rules.
5. **Re-express, L522-526 (ODCR, as how to get it right).** Proposed: "<strong>ODCRs:</strong> open-ended duration [odcr]. Create the reservation in the placement group, since that is when the group is chosen, and size it for the fleet you expect: growing reserved capacity in the group later, by modifying a reservation or by adding one, raises insufficient-capacity risk [crCpg]." No new fact; the action connects the two already there.

### Backlog

- Consolidate the ten restatements of the one-zone rule and the placement-group recommendation into the opening (L242-248) and the table footer, as a leverage pass on unchanged blocks (economy is the axis this section loses most on).
- FC7 DG-24: one Karpenter bullet clause on leaving `placementGroupSelector` unset for a NodeClass that targets a Capacity Block, once Karpenter's behaviour is verified.
- A rendered flow for the Three Questions (multi-node, communication-bound, one zone) ending on EFA or no EFA.
- A citation or softer wording for the uncited heuristics (L218, L265, L457).

