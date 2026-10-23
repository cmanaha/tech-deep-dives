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

STATUS: see last line

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
- Held at 7 by economy and by rule defects. The one-zone, placement-group-recommended-not-required pair is restated ten times (L236-237, L242-248, L284-288, L182, L206, L317-320, L372-375, L435-436, L575-577, L618-627). Three hedges are wider than the research behind them (L487, L600-601, L623-624). The refreshed Karpenter Alert puts good news (labels arrive with no work) under a warning icon. Stage 2 says NVLink carries every collective on a Trainium instance, and the SMDDP Alert still calls v2.5.0 the latest release after the SageMaker section's refresh moved it to April 2025 (accuracy flags).

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 4 | 5 | 4 | 4 | 3 |

- Rigor 4: the refreshed blocks are cited to the right pages (FC7 DG-01 to DG-22 hold). Outside them are uncited heuristics: "Most inference and fine-tuning workloads are single-node" (L265), "Short training runs (<2 hours)" (L457), "SRD handles asymmetric traffic patterns" (L218), plus corrections 1-3 (hedge scope). One citation placement is loose: "Up to 64 instances per block" (L508) sits under capacityBlocksUg, while FC7 DG-08 locates the 64 figure on capacity-blocks-how.html (capacityBlocks).
- Accuracy 4: see the two accuracy flags. Everything diff-touched holds.
- Economy 3: the AZ/placement-group repetition above, two pointer paragraphs that only route elsewhere (L349-353, L409), and page-referential asides ("so this page does not name the shared hardware", L449; table footer L317-324 on sourcing).

### Corrections

1. **L623-624, hedge wider than the research** (FC7 surfaced it outside the diff; still present at HEAD).
   Replace "No AWS source states that training jobs use EC2 cluster placement groups" with "No AWS source located during this research states that training jobs use EC2 cluster placement groups".
2. **L485-487, universal claim from a local search (rule 14).**
   Replace "Spot rates are not published in the EC2 Price List bulk API or in any credential-free first-party AWS endpoint, so" with "Spot rates do not appear in the EC2 Price List bulk API, or in any credential-free first-party AWS endpoint located during this research, so". (Pricing.tsx:307-308 carries the same unscoped phrase; outside this batch.)
3. **L600-602, universal claim from a local search plus a negation definition** ("frozen rather than deprecated: AWS has not announced a deprecation"; a release-notes page cannot evidence the absence of an announcement elsewhere). This sentence also carries the cross-section conflict in the accuracy flag below, so the replacement resolves both; it needs the `smpRelease` DocRef that SageMaker.tsx already defines.
   Replace "The library is frozen rather than deprecated: AWS has not announced a deprecation, and the latest release is v2.5.0, dated October 17, 2024 [ddpRelease]" with "The library is frozen: its own release notes stop at v2.5.0, dated October 17, 2024 [ddpRelease], the model parallelism library's release notes record SMDDP 2.6.0 inside SMP v2.8.0, dated April 1, 2025 [smpRelease], and no deprecation announcement was located during this research". The Alert header at L593 ("and it is frozen at v2.5.0") becomes "and it has been frozen since April 2025", matching SageMaker.tsx:1098.
4. **L552-554, definition by absence** ("There is no p5.xlarge"). FC7 DG-20 confirms the P5 sizes listed are p5.4xlarge and p5.48xlarge only.
   Replace "One g5.xlarge, or p5.4xlarge if you want a single H100. There is no p5.xlarge [ac]." with "One g5.xlarge, or p5.4xlarge, the smallest P5 size, if you want a single H100 [ac]."
5. **L606, page-history residue** ("The underlying number holds inside that scope." answers a challenge the reader never saw).
   Replace "The underlying number holds inside that scope. P4d and P4de carry NVIDIA A100 GPUs, NCCL takes up to 24" with "On P4d and P4de, which carry NVIDIA A100 GPUs, NCCL takes up to 24".
6. **L361, h2 description restates the topic** ("What Karpenter provisions for EFA, and where network-node ranking comes from instead").
   Replace with: `description="The four Karpenter settings an EFA fleet needs, and why the network-node labels need none of them"` (traces to the four bullets L372-397 and "whatever provisioned it", L407).

### Accuracy flags (for the fact-check track; not written-rule corrections)

- **L593 and L600-603, SMDDP "frozen at v2.5.0" / "the latest release is v2.5.0, dated October 17, 2024" contradicts the refreshed SageMaker section.** SageMaker.tsx:1098 and :1118-1132 (changed in this refresh, cited to the SMP release notes as a doc conflict) record SMDDP 2.6.0 inside SMP v2.8.0, dated April 1, 2025, and title the library "frozen since April 2025". DecisionGuide was not updated with it. Correction 3 carries the aligned text.
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

---

## 6. EKSIntegration.tsx (EFA on EKS: the AMI, the device layer and the pod contract)

Refresh diff (-76 words): pins and versions re-read (AMI v20261019, efa 3.3.0, chart v0.5.33, dranet v1.5.0, Bottlerocket 1.49.0 tarball); eksctl version-floor line and the "Version floors that bite" Alert deleted; the "8 times 4 is our inference" Alert replaced by a code-derived "Eight PCIe roots" Alert (L1239-1246); NVIDIA driver-major variables paragraph added (L846-854); placement-group Alert header made positive and its checklist sentence deleted (L882-898); eksctl efa-only reasoning rewritten (L906-911); Karpenter DRA guidance added (L947-952, L1066-1073, L1091-1099); MOFED section rebuilt around the v0.19.0 to v0.19.2 window (L1400-1439); ai-on-eks policy switch added (L1478-1481); archive-date aside removed (L1491-1494); huge pages Bottlerocket sentence re-sourced (L1383-1384).

### Gate 3 score: 8 / 10

- The opener (L657-663) is one of the strongest models in the dive: the node image stops at the kernel driver and rdma-core, the container image carries the fabric stack, and "everything below is a consequence". The layer-cake diagram carries it visually, and "you count against an integer and you match against attributes" (L1061-1062) does the same for device plugin against DRA.
- Practical leverage is at the ceiling: the shortest-path Alert (L671-695), the driver-major variables with the silently dropped name (L846-854), the "not additive" bandwidth arithmetic (L1002-1003), the separate-NodePools recipe (L1096-1098), `mofedEnabled=false` on every version (h2 description L1400, L1438-1439), and a closing triage list ordered by the split (L1562-1583), which is the reader's next action.
- Doc-versus-code conflicts are framed at the moment of trust (Bottlerocket build, `--minimal` exclusions, the MOFED version bound) and pinned to tags or SHAs.
- Held at 8 by hedge scopes widened in five places in the pod-contract material, two attribution narrations in refreshed text, and economy: evidence chains sit in the main flow (L746-754, L1421-1427) where the reader needs only their conclusion.

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 5 | 5 | 4 | 5 | 3 |

- Rigor 4: corrections 3-7 (unscoped absence claims); L790-792 uses an argument from design as proof ("which it would have no reason to do if --minimal had not installed it"), which the leverage standard's check 3 classes as inference rather than evidence.
- Accuracy 5: FC6 PARTIAL rows for this file (E-03, E-06, E-07) are applied at HEAD; nothing found wrong.
- Economy 3: about 1,600 lines; provenance chains in the main flow; the placement-group recommendation restated in full again (L891-895), as in the Decision Guide.

### Corrections

1. **L891-895, attribution narration in a refreshed Alert** ("and it writes the status verbatim:" fails the delete-the-attribution test; "AWS recommends" stays, case 3).
   Replace the paragraph with: "AWS recommends a cluster placement group to satisfy the zone rule, without requiring one, because it launches the instances into a low-latency group in a single Availability Zone [efaStart]."
2. **L948-949, attribution narration** ("Karpenter documents the combination as unsupported", FC6 E-06 wording; "documents" carries only provenance).
   Replace with: "With the EFA DRA driver and dynamic provisioning, leave networkInterfaces unset: Karpenter does not support the combination, and its behaviour is undefined [karpenterDraUnset]."
3. **L607, contract table, IPC_LOCK row: universal absence claims and an unlabelled inference (rule 14).**
   Replace the detail with: "Present in several AWS sample manifests. No AWS documentation located during this research states it as a requirement. Memory pinning for RDMA registration is the likely motive, on our reading, and no AWS statement of it was located."
4. **L613, contract table, NCCL_TOPO_FILE row: universal absence claim.**
   Replace "No AWS documentation and no AWS-authored EFA manifest sets this variable." with "No AWS documentation or AWS-authored EFA manifest located during this research sets this variable."
5. **L1269, h2 description: universal absence claim.**
   Replace "and two that no AWS documentation explains." with "and two whose AWS rationale this research did not locate."
6. **L1315-1316, universal absence claim.** Replace "has no source behind it." with "has no source behind it that this research located."
7. **L1328-1330, universal absence claims.**
   Replace "No AWS source states a reason for those three. The plausible one is rendezvous and launcher addressing rather than the EFA data path, but nobody has written that down, so treat it as our reading." with "No AWS source located during this research states a reason for those three. The plausible one is rendezvous and launcher addressing rather than the EFA data path; treat that as our reading."
8. **L873, h2 description summarises the diagram instead of the payoff** ("Four mechanisms, four sets of limitations, one node-level result.").
   Replace with: `description="Pick the provisioning path by the limits you can accept: all four end in the same device nodes."` (traces to the diagram title, L490-492).

### Leverage candidates (blocks changed in this refresh)

1. **Demote, L750-754 (ENABLE_EFA gate, template default, five-variant release check)** into the existing "Inspecting and rebuilding the AMI yourself" disclosure. The reader needs what lands on the node; the gate and override chain prove it is always on. Main-flow text that remains: "The AL2023 EKS AMI build runs the standard AWS EFA installer with one flag, <code>sudo ./efa_installer.sh --minimal -y</code>, and the AMI component list names the result EFA minimal, the kernel module and rdma-core [installEfa]. Release v20261019 ships efa 3.3.0-1.amzn2023 on all five AL2023 variants, standard ones included [amiRelease]."
2. **Re-express, L815-820 (three Bottlerocket version numbers in one clause).** A reader cannot tell which driver Bottlerocket runs. Proposed: "First, the driver versions differ. AL2023 pulls the latest installer at build time and lands EFA driver 3.3.0 [installEfaLatest][amiRelease]. Bottlerocket pins installer 1.49.0, whose driver is 3.1.0, and compiles that source, though its RPM Version field reads 3.0.0 [brKmod][efaChangelog]." ("Compiles that source" restates L809-811.)
3. **Demote, L1421-1427 (the Value-field walk across v0.18.2, v0.19.0, v0.19.2, v0.19.3, v0.20.1)** into an ExpandableSection titled "Which releases default to true, in the code". The action (set false on every version) and the doc-versus-code bound already sit in the h2 description and L1438-1439; the five pins are the evidence. Keep in the main flow: "The code bounds that to three releases, v0.19.0 to v0.19.2 [nvdpNew][nvdpLastTrue]; v0.19.3 reverted the default [nvdpRevert]." and the CDI glob sentences (L1428-1431), which L1434 depends on.
4. **Re-express, L1239-1246 (Alert to one sentence).** The header already states the model; the body is provenance. Proposed, appended to L1236: "A p5.48xlarge has eight such roots, one GPU and four EFA devices on each, which is the documented total of 32 [eksDevice][karpenterEfaMeta][karpenterGpuMeta]."
5. **Re-express, L906-911.** "A launch template is where you go" and then three options in the next sentence; "remains" reads as page history. Proposed: "eksctl is the shortest path, and its efaEnabled setting configures every interface as type efa, so it cannot create efa-only interfaces. For those, use a launch template, a NodeClass or an EC2NodeClass [eksDevice]. eksctl also accepts an explicit placement group name alongside efaEnabled [eksctlDocs]."

### Backlog

- Name the Karpenter DRA alpha feature gates and the Helm value that enables them (the cited options.go L78 and values.yaml L216-L219 carry them), so "gated, default off" becomes typeable.
- Bottlerocket huge pages: the refreshed sentence (L1383-1384) says support exists from 1.64.0 but not what a Bottlerocket node sets to provide hugepages-2Mi; needs a source.
- A rendered PCIe-root diagram (eight roots, one GPU and four EFA each) for the DRA alignment block.

---

## 7. SageMaker.tsx (EFA on SageMaker AI and HyperPod)

Refresh diff (+19 words): SDK allowlist re-read at v3.27.0 with ml.p5 and ml.p5e now on both lists and a "pin v3.24.0 or later" rule (L803-834, table L638-651, diagram gate 3 L442, Step 1 L1668-1671); the "two AWS repositories disagree on P5" disclosure deleted; DLC base and PyTorch image now "latest EFA installer at build time" with the efa_installed_packages check (L940-958); `--disable-ngc` rewritten around installer 1.50.0 and 1.51.0 behaviour (L982-994); log-signature count corrected to three plus two (L1034, L1053-1064); SMDDP retitled "frozen since April 2025" with a doc conflict on SMP v2.8.0 (L1098-1132); Slurm AMI line re-dated to September 2026 with "the variant you pick decides the EFA version" (L1261-1267); InstancePreferences added to ResourceConfig (L754-755); SPANK, SSM, NGC, FSDP and DPD expanded.

### Gate 3 score: 8 / 10

- The intro (L719-726) and the three-contracts diagram turn "SageMaker handles EFA" into three answers with named owners per stage, and the four-gates diagram carries the predictive model for training jobs: gate 3 fails quietly, so gate 4 (the log) is the only evidence (L519).
- Practical leverage is high and the refresh raised it: pin SDK v3.24.0 or later for P5 and P5e (L827-828), read /opt/amazon/efa_installed_packages because the changelog lags (L942-949), `--disable-ngc` with its version behaviour (L982-994), the three-plus-two grep signatures and the GDRDMA reading (L1053-1064), the 3 GB/s CI floor (L1067-1074), the EFA exporter switched on before an incident (L1399-1404), and a five-step close (L1661-1705) that ends on the reader's next action.
- Hedges are handled well where the research is thin: "Absence of documentation is not the same as documented absence" (L1551) and "undocumented rather than unsupported" (L1569) keep scope exactly.
- Held at 8 by attribution narration in two places, two universal "only" claims that the section's own hedges scope more narrowly, a Step 4 sentence that asserts what an earlier Alert calls an open question, one unexpanded acronym in a diagram, and two internal inconsistencies (accuracy flags).

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 5 | 5 | 4 | 4 | 3 |

- Rigor 4: corrections 1-5; "which are roughly 2023 pins" (L791) dates NCCL 2.7.8, EFA installer 1.30.0 and aws-ofi-nccl 1.1.1 without a source, and NCCL 2.7.8 is older than that [SPECULATIVE: scorer's knowledge, unfetched].
- Accuracy 4: two flags below; FC6's PARTIAL and FAILS rows for this file (S-04, S-11, S-20, S-23, S-24) are applied at HEAD.
- Economy 3: about 1,700 lines; long version inventories in the main flow (EKS AMI line L1251-1255, Slurm AMI line), and a release-notes conflict in the SMDDP body that supports a conclusion the h2 already states.

### Corrections

1. **L1043, attribution narration** ("AWS documents the check [trainEfa]." is provenance only).
   Delete the sentence and move the citation: "Expected output includes provider efa, domain efa_0-rdm, endpoint type FI_EP_RDM and protocol FI_PROTO_EFA [trainEfa]."
2. **L1105-1112, attribution narration** ("The support page lists ..., adds that ..., and states that ...", "The FAQ says ..."; agreement between sources is not one of the load-bearing cases).
   Replace from "The support page lists" to "the SDK source agrees [smddpTypes]." with: "It supports ml.p3dn.24xlarge, ml.p4d.24xlarge and ml.p4de.24xlarge, support for optimizing collective communication on P3 has been discontinued, and the optimized AllGather collective is only available for P4 instances [ddpSupport]. In practice it runs only on P4d and P4de, with NVIDIA A100 GPUs and EFA [ddpFaq][smddpTypes]."
3. **L1447, h2 title states a universal the section scopes elsewhere** (rule 14; the description and the DPD diagram title both say "documented").
   Replace "HyperPod inference: the only place EFA carries inference traffic" with "HyperPod inference: the one documented place EFA carries inference traffic".
4. **L1640-1641, same universal.** Replace "HyperPod on the EKS orchestrator is the only SageMaker surface where that exists" with "HyperPod on the EKS orchestrator is the only SageMaker surface where that is documented".
5. **L1698-1699, hedge widened against the section's own Alert** (L860-862 calls TCP fallback on off-allowlist types "an open question"; Step 4 asserts the cause).
   Replace "That is the failure the allowlist causes." with "That is the failure to look for when the instance type is off the allowlist."
6. **L425 (four-gates diagram, gate 2), acronym not expanded at first use.** "DLC" is first read here; the prose spells out Deep Learning Container only later.
   Replace lines 2-3 of gate 2 with 'A Deep Learning Container (DLC) installs EFA with --skip-kmod,' and 'so the host owns the kernel module. Its NCCL must match PyTorch.' (64 characters, about the existing longest line in that box; confirm with `gate-content-overflow`.)
7. **L876, acronym not expanded** (first reader-visible "LLM" in the dive). Replace "multi-node LLM training performance" with "multi-node LLM (large language model) training performance". Low priority if the team treats LLM as a common acronym.

### Accuracy flags (for the fact-check track; not written-rule corrections)

- **L519 diagram caption, "Gates 1 and 2 fail loudly", against gate 2's own failure case** ("A bring-your-own container with no libfabric", L429). The dive says elsewhere that a missing aws-ofi-nccl makes NCCL fall back to sockets silently (EKSIntegration.tsx:589 and :1578-1580). [SPECULATIVE: scorer's reading] A container with no libfabric cannot load aws-ofi-nccl, so that half of gate 2 fails quietly. Proposed after a check: "Gate 1 fails loudly. Gates 2 and 3 can fail quietly. That is why gate 4 is the only one worth trusting."
- **L1279, ExpandableSection header "Three AWS pages disagree about the HyperPod base operating system"**, while the body (L1284-1292) names two pages, the AMI overview and the Slurm release notes. Either the third page was lost or the header overcounts; the headerDescription ("worth taking from the third") has the same problem.

### Leverage candidates (blocks changed in this refresh)

1. **Re-express, L982-994 (`--disable-ngc`, the longest refreshed block).** The action is in the bold lead, then about 110 words of version behaviour, then the DLC practice. Ordering the version split before the practice lets the action land last. Proposed body: "The installer treats any container holding /opt/nvidia/nvidia_entrypoint.sh as NGC, and the nvidia/cuda amzn2023 base images carry that file. What follows depends on the installer version. 1.51.0 installs libnccl-ofi-ngc on an Ubuntu 22.04, 24.04 or 26.04 container and otherwise prints "This container is not Ubuntu" and does the standard install [installer151]; 1.50.0 has no such fallback and ships no NGC plugin package for Amazon Linux, so an AL2023 NGC base gets EFA with no NCCL plugin [installer150]. Passing --disable-ngc, as the DLC script does for latest and for 1.48.0 and later, forces the standard install on every version [dlcNgc]."
2. **Re-express, L823-828 (allowlist versions).** "Read at SDK release v3.27.0" is a provenance-only sentence and the reader's rule ("pin v3.24.0 or later") sits mid-paragraph. Proposed opening: "Pin SageMaker Python SDK v3.24.0 or later for P5 and P5e: earlier releases leave ml.p5e.48xlarge off both lists and ml.p5.48xlarge off the second [allowlistOld]. The lists above are as read at v3.27.0 [allowlist]." The torchrun and mpirun sentences follow unchanged.
3. **Re-express, L941-949 (base image).** Lead the check with its reason and drop the closing restatement. Proposed: "The CUDA 13.2 base pins NCCL 2.29.7-1 and installs whichever EFA installer is latest at build time [dlcBase], so read /opt/amazon/efa_installed_packages, the file the build log quotes, to see which version landed [dlcInstallLog]. The EFA installer changelog maps released versions to their libfabric, aws-ofi-nccl and driver versions, and can lag a new installer: 1.51.0 was not listed on 2026-10-23 [efaChangelog]." ("The installed-packages file is then the record to trust" is removed; the first sentence already says it.)
4. **Demote, L1117-1127 (SMDDP release-notes conflict)** into the existing "Why AWS built it" disclosure, keeping the conclusion in the body: "TensorFlow support has ended ... [ddpSupport]. No AWS deprecation notice was found, so treat SMDDP as frozen: documented, scoped to those three instance types, and unchanged since April 2025." The reader's decision (do not build on SMDDP for P5 and later) is already in the h2 and the first paragraph; the conflict is the evidence for "April 2025" and stays intact behind the disclosure.
5. **Re-express, L1433-1434** ("Note the phrasing: within an Availability Zone, which is the EFA boundary."). "Note the phrasing" points at the source's wording rather than at the fact. Proposed: "That distribution stays within an Availability Zone, the EFA boundary."

### Backlog

- Restore or remove the third page in the base-OS disclosure (accuracy flag 2).
- A source for the date of the documented Dockerfile's pins, or drop "roughly 2023".
- Cross-check NCCL_PROTO=simple as "mandatory" (L882-883) against the NCCL over EFA section's current guidance before the next refresh.

---

## 8. StorageDataPaths.tsx (Storage Data Paths: FSx for Lustre, S3 and the CRT)

Refresh diff (dated-claim fixes only): P6-B300 added to every GPUDirect Storage client list (diagram L220-221, create-time diagram L382, scope table L652, h3 badge "five instance types" L854, L860, L865-867); the Latency row's EFA cell rewritten from "Single-digit microsecond class" to the EC2 User Guide's silence, the 2019 launch figure, `fi_pingpong -p efa -e rdm` and RDM reordering (L696), with three new footer citations (L1312-1317); "At the pinned commit," added to the binding-layer Alert (L1200); the NIC expansion dropped at L1056 (expanded earlier in nav order); fsxEfa, fsxClients and efa re-read 2026-10-23.

### Gate 3 score: 8 / 10

- The decision and the number arrive before any mechanism: the "Start here" Alert (L762-772) names the one file system configuration that reaches the fabric and says it is create-time only, and 7 times and 12 times (L777-779) are landed again at L805 against the four-path diagram ("Two rows in that diagram are the same AWS service").
- Practical leverage is high: the security-group-by-ID Alert gives a throughput signal to check (L895-911), the throughput-target section turns a code reading into a counter-intuitive rule (L1114-1121) and a 503 warning tied to prefix layout (L1124-1158), and the close ends on the reader's action twice ("Two decisions to get right" L1320-1340, then "The order to answer these in" L1344-1354).
- Rigor is visible: code claims are pinned, the blog-versus-code conflict is scoped to the trees read (L1227-1233), and the S3/DRA corner case is labelled "our reading" (L953-955).
- Held at 8 by three acronyms read before their expansion (CRT in the h1, GDS, LNet), three h2 descriptions that tease or restate, two attribution narrations, an unlabelled inference in the security-group Alert, and prose that names a whitepaper the citation no longer points to.

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 5 | 5 | 4 | 4 | 3 |

- Mental model 5: four paths with four ceilings, the CPU ceiling that separates an object path from a fabric path (L1026-1040), and the target as a divisor that shrinks range size (L1086-1121) each let the reader predict an unseen system.
- Rigor 4: correction 10 and accuracy flag 1 are absence or behaviour claims stated wider than the evidence, against careful labelling elsewhere in the same section.
- Accuracy 4: two flags below. FC8 S-4 and S-5 (latency cell) are applied at HEAD; S-9 (instance table never consulted internally) holds at the pinned commit.
- Economy 3: about 1,360 lines. The boundary container (L1261-1284) and "They are quoted here because ..." (L1021-1023) talk about the page rather than the subject, and the binding-layer scope paragraph (L1227-1233) restates the table header's scope.

### Corrections

1. **L757, acronym used before its expansion.** "CRT" is read in the h1 (and the nav label, App.tsx:52, and the diagram lane L241) before "AWS Common Runtime (CRT)" at L986.
   Replace the h1 with "Storage Data Paths: FSx for Lustre, S3 and the Common Runtime (CRT)". Optional companion in App.tsx:52: "Storage Data Paths: FSx, S3 and the Common Runtime".
2. **L225 (diagram, rendered at L802), acronym never expanded.** "GDS" is first read in the diagram's "1,200 Gbps with GDS". No line in the section writes "GPUDirect Storage (GDS)".
   At L777, the first prose use, replace "1,200 Gbps over EFA with GPUDirect Storage" with "1,200 Gbps over EFA with GPUDirect Storage (GDS)".
3. **L219 and L232 (diagram, rendered at L802), acronym before its gloss.** "LNet" is read in the diagram. The gloss "LNet, the Lustre network layer" waits until L824-825.
   Replace L799-800 with "A GPU instance in a cluster has four ways to move bytes, and they differ in what the bytes traverse before they leave the host. Two of them reach the fabric. In the two FSx for Lustre rows, LNet is the Lustre network layer."
   Then shorten L824-825 to "LNet then runs over the EFA device."
4. **L858-860, attribution narration** ("AWS describes it as enabling ..." carries provenance only, and this is a mechanism description rather than a vendor performance figure).
   Replace "GPUDirect Storage builds on EFA, so an EFA-enabled Persistent 2 file system is the prerequisite. AWS describes it as enabling direct data transfer between the file system and the GPU memory, bypassing the CPU, and it names the client instances exhaustively: P5, P5e, P5en, P6-B200 or P6-B300 [fsxEfa]." with "GPUDirect Storage builds on EFA, so an EFA-enabled Persistent 2 file system is the prerequisite. It transfers data directly between the file system and GPU memory, bypassing the CPU, and the supported clients are a closed list: P5, P5e, P5en, P6-B200 or P6-B300 [fsxEfa]."
5. **L963-966, attribution narration** ("AWS also gives a threshold for when to bother:" fails the delete test; "AWS recommends" stays, because the verb carries strength).
   Replace with "If you are creating a file system with over 10 GBps of throughput capacity, AWS recommends enabling EFA to optimize throughput per client instance [fsxPerf]. Below that, the ENA path is the documented answer."
6. **L1214, negation inside a definition** ("a per-instance-type constant, not discovery"). The next sentence already says what it does not read.
   Replace "That lookup is a per-instance-type constant, not discovery. It reads no interfaces," with "That lookup is a per-instance-type constant. It reads no interfaces,".
7. **L814, h2 description restates the topic** and carries an unsourced claim. "show up as support cases" is [DERIVED] in research 07 §4.1.
   Replace with "The create-time choices and security group rules that decide whether a client gets 700 Gbps from the file system or stays near the 100 Gbps ENA figure." (traces to L777 and L908-911).
8. **L1080, h2 description teases instead of stating the result** ("One knob, four effects, and a relationship that runs the opposite way to intuition.").
   Replace with "Raising the target opens more connections and shrinks every range request, until the 8 MiB floor binds past roughly 400 Gbps." (traces to L1114-1117).
9. **L1266, h2 description restates the topic** ("What this section leaves to a storage dive, and which half of it you can check for yourself.").
   Replace with "FSx for Lustre claims here come from documentation and S3 client claims from code at pinned commits you can open, and the badge on each claim says which." (traces to L1278-1282).
10. **L1117, absence-in-the-world claim from a source read (rule 14).**
    Replace "Nothing warns about this, and the memory commitment is real:" with "No warning for this was located in the client source at the pinned commits, and the memory commitment is real:".

### Accuracy flags (for the fact-check track; not written-rule corrections)

- **L904-909, inference presented as behaviour.** "Get it wrong and the file system still works: created with EfaEnabled true, mounted successfully, running at ENA speed, with nothing in the console indicating anything is wrong" has no citation. Research 07 §4.1 marks the fallback reading [DERIVED]. The cited security-group page says only that CIDR rules "do not satisfy EFA requirements".
  Proposed, using the section's own label from L953-955: "Our reading of this rule, across the security group and performance pages, is that a file system created with EfaEnabled true can still mount and run at ENA speed when the rules are CIDR-based, so a rule that looks maximally permissive is the one to suspect." The throughput-signal sentence that follows stays as written.
- **L1238-1254, the named source does not match the citation.** The prose says "the AWS performance whitepaper" (headerDescription L1238, L1242, L1250, L1252, L1254). The `s3Paper` DocRef was re-pinned on 2026-08-02 to the S3 User Guide page "Performance design patterns, horizontal scaling and request parallelization", because the whitepaper path redirects (code comment L133-136).
  Replace "whitepaper" with "S3 User Guide" in those five places, for example "The S3 User Guide suggests making concurrent requests ...".
  Not re-fetched for this score: whether the 85 to 90 MB/s and 15-request figures appear verbatim on the User Guide page.

### Leverage candidates (blocks changed in this refresh)

1. **Reorder, L696 (Latency row, EFA cell).** Put the ordering fact first so the `-e rdm` flag follows the sentence that explains why the RDM endpoint matters, and the reader's action lands last.
   Proposed: "SRD delivers out of order, and the libfabric RDM endpoint restores message order in software. The EC2 User Guide gives no per-message latency for EFA, and the one AWS figure located (15.5 microseconds of one-way MPI latency) comes from the 2019 launch, so baseline it with fi_pingpong -p efa -e rdm." Both hedges keep their scope.
2. **Re-express, L864-867 (GDS client list).** "The list being closed is what matters when you read ..." spends a clause on why the paragraph exists.
   Proposed: "The instance matrix elsewhere in this dive lists many more EFA-capable types than these five, so check whether the clients you already plan to buy are among the five."

Considered and rejected: deleting "At the pinned commit," at L1200 (FC8 ST-2). Deletion would widen the claim to every release. FC8 S-9 records that aws-c-s3 v1.3.1 does read the platform table, for default memory sizing below 10 Gbps. The pass may not add FC8's replacement sentence, because that text is not in the section. It goes to the backlog.

### Backlog

- Say what changed after the pinned commit at L1200. FC8 ST-2 drafted the sentence, citing aws-c-s3 v1.3.1 `source/s3_client.c`.
- Name the environment variable at L1120 ("an environment variable that AWS does document"). The reader is told an escape hatch exists but not what to type.
- Carry the 2019 post's cluster placement group condition with the 15.5 microsecond figure (L696; FC8 N-3 quotes "When used in this way [Cluster Placement Group]").
- Gloss fi_pingpong at its first use in nav order (FC8 ST-3), or point to the Operations section that introduces it.
- Economy: fold the boundary container (L1261-1284) into one sentence under the comparison table, or demote it.

---

## Summary

| Section | Gate 3 score | Mental model | Practical leverage | Rigor | Accuracy | Economy | Corrections | Leverage candidates | Accuracy flags |
|---|---|---|---|---|---|---|---|---|---|
| Overview.tsx | 8 | 4 | 3 | 4 | 5 | 4 | 4 | 3 | 0 |
| AIMLInference.tsx | 8 | 4 | 4 | 4 | 4 | 4 | 2 | 4 | 1 |
| HPC.tsx | 8 | 4 | 5 | 4 | 5 | 4 | 5 | 3 | 0 |
| NetworkComparison.tsx | 8 | 5 | 3 | 4 | 4 | 4 | 2 | 2 | 1 |
| DecisionGuide.tsx | 7 | 4 | 5 | 4 | 4 | 3 | 6 | 5 | 2 |
| EKSIntegration.tsx | 8 | 5 | 5 | 4 | 5 | 3 | 8 | 5 | 0 |
| SageMaker.tsx | 8 | 5 | 5 | 4 | 4 | 3 | 7 | 5 | 2 |
| StorageDataPaths.tsx | 8 | 5 | 5 | 4 | 4 | 3 | 10 | 2 | 2 |

Batch C has no section below 7. The batch average is 7.875 (63 / 8), just under the Gate 3 average bar of 8 if that bar is applied to this batch alone. DecisionGuide is the only 7. Its corrections plus the SMDDP accuracy flag are what would lift it.

Corrections total 44, almost all mechanical:
- acronym order (Overview 2, HPC 3, SageMaker 2, Storage 3)
- attribution narration and flattened vendor claims (Overview 2, HPC 1, NetworkComparison 2, EKSIntegration 2, SageMaker 2, Storage 2)
- absence-from-search written as absence-in-the-world (DecisionGuide 3, EKSIntegration 5, SageMaker 3, Storage 1)
- h2 descriptions (AIMLInference 1, DecisionGuide 1, EKSIntegration 1, Storage 3)

Accuracy flags needing a decision (8):
- AIMLInference: speculative-decoding round trips placed in time-to-first-token.
- NetworkComparison: the footer excludes microsecond figures that the EFA cell now carries.
- DecisionGuide: SMDDP "latest v2.5.0" against SMDDP 2.6.0 in SMP v2.8.0; NVLink claimed for trn1.32xlarge.
- SageMaker: "Gates 1 and 2 fail loudly"; "Three AWS pages" with two in the body.
- StorageDataPaths: the security-group fallback stated as behaviour; "whitepaper" against a User Guide citation.

Cross-section consistency: the 15.5 microsecond 2019 figure now appears in NetworkComparison and StorageDataPaths with the same hedge, and neither carries the source's placement-group condition.

Source note: no external fetch was made for this report. Everything is read from the section files, `git diff b39b4d3 HEAD`, and the FC6, FC7 and FC8 fact-check reports and research notes in this directory. Tier labels on research claims ([DERIVED], [T1]) are quoted from those notes.

STATUS: COMPLETE
