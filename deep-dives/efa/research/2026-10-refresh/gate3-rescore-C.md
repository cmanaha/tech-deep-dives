# Gate 3 independent re-score, group C (after commit 2dca933)

STATUS: see last line

Scope: DecisionGuide, Overview, AIMLInference, HPC, NetworkComparison, EKSIntegration, SageMaker, StorageDataPaths.
Pass judged: commit 2dca933 ("efa: apply Gate 3 corrections and the leverage pass to the workload, platform and guide sections").
BEFORE scores: gate3-C.md. Scorer did not read gate3-apply-C.md until all sections were scored.

Method: each file read in full at HEAD; the 2dca933 diff read hunk by hunk; new citations spot-checked by fetching the cited page (fetches listed per section). AI-tell grep (em-dash, en-dash, curly quotes, the CLAUDE.md banned list) over all eight files at HEAD: zero hits.

---

## 1. DecisionGuide.tsx (Decision Guide)

### AFTER Gate 3 score: 8 / 10 (BEFORE 7)

- All six BEFORE corrections and both accuracy flags are closed: the SMDDP Alert now carries the SMDDP-2.6.0-in-SMP-v2.8.0 doc conflict and a scoped "no deprecation announcement was located" hedge; NeuronLink replaces NVLink for trn1.32xlarge in the table, Question 1 and Stage 2, cited to the Neuron Trn1 architecture page.
- Economy rose: the one-zone / placement-group pair is down from ten restatements to the opener, the table footer and the places where it changes an action (Karpenter zonal pinning, the Capacity Block Alert, the SageMaker Alert); the pointer and "the work the platform name hides" asides are gone. The Capacity Blocks block is split into booking facts and end-of-block facts, and now gives every reader a deadline (11:00 UTC instance blocks, 10:30 UTC P6e-GB200).
- Held at 8, not 9, by uncited heuristics in unchanged blocks (L278, L452, L230, L475-477), one negation definition left in the opener (L257-258), and a Question 1 claim that NVLink carries collectives on any multi-GPU instance.

### Axes

| Axis | BEFORE | AFTER |
|---|---|---|
| Mental model | 4 | 4 |
| Practical leverage | 5 | 5 |
| Rigor | 4 | 4 |
| Accuracy | 4 | 5 |
| Economy | 3 | 4 |

- Model holds at 4: the Three Questions and "pays off in proportion to the share of wall clock in collectives" are unchanged; no diagram added (backlog item stands).
- Leverage holds at the ceiling; the instance-block deadline and the ODCR "create in the group and size it for the fleet you expect" are real additions inside it.
- Rigor holds at 4: new citations bear their claims (see fetch notes); the uncited heuristics listed above are unchanged.
- Accuracy 5: both BEFORE flags resolved and verified against the fetched pages. The Question 1 NVLink scope (correction 2 below) is a pre-existing generalisation, not a wrong fact on any instance the section names.

**Did the pass succeed by the leverage test?** Partly. Accuracy rose to 5 and economy rose a point, rigor held, but mental model and leverage did not rise (leverage was already at 5; model had no candidate in the BEFORE list). As a corrections pass it fully succeeded; as a leverage pass it is neutral-to-positive with no loss.

### Fetches (spot-checks of citations new or moved in 2dca933)

- trn1-arch.html (Neuron v2.33.0): "high-bandwidth, low-latency NeuronLink-v2 chip-to-chip interconnect, which utilizes a 2D Torus topology", "useful for collective communication between the Trainium chips". Bears "NeuronLink on trn1.32xlarge carries every collective". It cannot bear the NVLink half of L272-274 or L563-565; the NVLink half carried no citation before either, so this is not a regression.
- capacity-blocks-how.html: lists "up to 8 weeks in advance", "one to 14 days or a multiple of 7 days, up to 182 days", "up to 64 instances per Capacity Block", "each UltraServer corresponds to one Capacity Block", the 30 / 60 minute termination and the EventBridge event 10 minutes before. The re-cited first Capacity Blocks paragraph (L502-505) is fully borne.
- ec2-capacity-blocks.html: "Capacity Blocks end at 11:30AM Coordinated Universal Time (UTC)", the 256 per-Organization-per-date limit, the P6e-GB200 60-minute rule, and "Capacity Blocks do not support placement groups". It also states "The termination process ... begins at 11:00AM Coordinated Universal Time (UTC) on the final day of the reservation", so the new 11:00 UTC deadline at L518 is documented, not only "our arithmetic".

### Regressions introduced by 2dca933: 0

Checked hunk by hunk: every new sentence traces to text already in the BEFORE file or to the two newly declared DocRefs (`smpRelease`, `trn1Arch`), and both were fetched or are already used by SageMaker.tsx. Two hedges were narrowed, none widened (L445-446 "was located during this research", L480-482 "located during this research"). Deleted material is restatement (zone rule, placement group recommendation, section pointers) or a reason clause ("to keep them physically close and minimize inter-node latency"); no sourced number, conflict, hedge or UNKNOWN was lost. No acronym lost its first expansion (ODCR is expanded in Pricing.tsx:477, earlier in nav order). No changelog voice, no AI tells.

### Remaining corrections

1. **L257-259, negation inside a definition** (shape rule 4). Current: "A cluster placement group is the recommended way to satisfy that rule and keep latency low, and it is not an absolute requirement [efaStart]."
   Replace with: "A cluster placement group is the recommended way, rather than a required one, to satisfy that rule and keep latency low [efaStart]."
2. **L271-274, scope wider than the instances the section names** (accuracy, [SPECULATIVE: scorer's knowledge, unfetched]: A10G-based G5 multi-GPU sizes connect GPUs over PCIe, not NVLink; the section recommends G5 at L224 and L553). Current: "A single-instance workload runs its collectives over NVLink on a multi-GPU instance, or NeuronLink on trn1.32xlarge".
   Replace with: "A single-instance workload runs its collectives inside the instance: over NVLink on a P-family GPU instance, or NeuronLink on trn1.32xlarge". Confirm the G5 interconnect against the accelerated-computing spec table before applying.
3. **L445-446, dangling pronoun introduced by the hedge rewrite.** "No AWS mapping from its topology layers" has no antecedent for "its" now that "AWS" is an adjective. Replace with: "No AWS mapping from the EC2 topology layers to a named rack or spine was located during this research."
4. **L518-519, label weaker than the evidence** (optional; the fetched considerations page states the 11:00 UTC start directly). Replace "Finish the checkpoint by 11:00 UTC on the final day of an instance block, and by 10:30 UTC on a P6e-GB200 UltraServer block (our arithmetic)." with "Termination begins at 11:00 UTC on the final day [capacityBlocksUg], so finish the checkpoint before then on an instance block, and by 10:30 UTC on a P6e-GB200 UltraServer block (our arithmetic)."

### Backlog

- Sources or softer wording for L278 ("Most inference and fine-tuning workloads are single-node"), L452 ("Short training runs (<2 hours)"), L230 ("SRD handles asymmetric traffic patterns"), L475-477 (Spot Placement Score queried "in a placement group"; [SPECULATIVE] the API scores Regions and zones, so check whether placement-group targeting exists).
- A rendered flow for the Three Questions.
- Table h2 description (L309) could name the payoff ("three of the eight need no EFA").

---

## 2. Overview.tsx (What is Elastic Fabric Adapter?)

### AFTER Gate 3 score: 8 / 10 (BEFORE 8)

- All four BEFORE corrections are closed: the on-premises positioning clause is deleted (leverage candidate 1), "which AWS rates as having no impact on network performance" restores the vendor attribution, and ENA and RDMA are expanded at first read.
- The tail paragraph now leads with the factor of ten and keeps the "this research located" hedge intact (candidate 2), so the section's strongest number opens its own paragraph and is landed again in the SRD column (L167).
- Held at 8: the model is still prose-only, practical leverage is four checkable facts with nothing typeable, "millions of small messages per second" and the three StatusIndicator verdicts stay uncited, and the section still ends on a pointer to the libfabric section.

### Axes

| Axis | BEFORE | AFTER |
|---|---|---|
| Mental model | 4 | 4 |
| Practical leverage | 3 | 3 |
| Rigor | 4 | 4 |
| Accuracy | 5 | 5 |
| Economy | 4 | 4 |

- Rigor holds at 4 rather than rising: both vendor-flattening defects are fixed, but the uncited quantity at L71 and the verdicts at L120, L129, L137 remain.
- Economy holds: one positioning clause gone, five routing clauses ("The EFA Device section covers ...", "the Pricing section carries ...", "the libfabric section is where ...") remain.

**Did the pass succeed by the leverage test?** Neutral. Accuracy held at 5, economy held, rigor held, nothing lost; model and leverage did not rise because no BEFORE candidate targeted them. A clean corrections pass.

### Regressions introduced by 2dca933: 0

Every changed sentence is a deletion, a reorder or a re-attribution of text already present. The hedge at L84-85 keeps "this research located". The deleted positioning clause was an uncited-in-effect vendor claim, not a number. Acronym order improved. No AI tells.

### Remaining corrections

1. **L144, h2 description routes instead of stating the payoff** (shape rule 8). Current: "Three layers, and the section that takes each apart".
   Replace with: `description="What you attach, what holds the tail down, and why your application code stays as it is"` (traces to L153-158, L166-167 and L179-180).

### Backlog

- A rendered three-layer stack diagram for the 30-second mental model.
- A source for "millions of small messages per second" (L71) or a softer quantity.
- A closing block that routes by the reader's question (training, inference, HPC, "do I need EFA at all") to the Decision Guide, so the section ends on an action rather than on the libfabric pointer.
- Optional: delete "never while it runs" (L154) as rhythm (BEFORE candidate 3, not applied; defensible to keep).

---

## 3. AIMLInference.tsx (EFA for AI/ML Inference)

### AFTER Gate 3 score: 8 / 10 (BEFORE 8)

- Both BEFORE corrections are closed (the "not the model size" construction is gone; the disaggregated-serving h2 description now names the library and the two settings), and the accuracy flag is resolved: speculative-decoding round-trips now land in inter-token latency in both places (L222, L285).
- The four leverage candidates were applied as written: the redundant "Purpose-built" fragment is gone, the Libfabric floor becomes a check on the serving image (L152-154), the vLLM paragraph states reason then setting, and the block-size / KV-layout conversion now closes the vLLM paragraph as "compare both settings across the two fleets". The configuration block now reads as one ordered set of things to check.
- Held at 8 by uncited sizing figures in a file whose own header says every load-bearing claim carries a SourceRef (640 GB at L184, the 300B / 600B ceilings at L246-247, "runs acceptably on standard networking" at L254-255), a description that does not match its second column (L240), and no diagram for the bytes-per-request model.

### Axes

| Axis | BEFORE | AFTER |
|---|---|---|
| Mental model | 4 | 4 |
| Practical leverage | 4 | 4 |
| Rigor | 4 | 4 |
| Accuracy | 4 | 5 |
| Economy | 4 | 5 |

- Leverage stays at 4: two new reader actions (check Libfabric in the image, compare block size and KV layout across fleets) sharpen existing ones; nothing measurable or monitorable was added.
- Accuracy 5: the time-to-first-token error is fixed and the new wording matches the fetched vLLM doc. The 300B fp16 ceiling is true of weights (about 600 of 640 GB, scorer's arithmetic) and tight for serving; listed as a correction for precision rather than scored as wrong.
- Economy 5: the section is short, and every block now either builds the per-request model or sets something.

**Did the pass succeed by the leverage test?** Mostly. Accuracy rose to 5, economy rose, rigor held, leverage held at 4 and the model held at 4. Neither model nor leverage rose a full point, so it falls short of the full test, with no loss on any axis.

### Fetch (spot-check of the one new citation)

- vllm v0.32.0 `docs/features/speculative_decoding/README.md` L3: "This document shows how to use Speculative Decoding with vLLM to reduce inter-token latency under medium-to-low QPS (queries per second), memory-bound workloads." It bears "speculative decoding acts on inter-token latency". "Every round-trip adds to inter-token latency" (L222) is a one-step inference from it, and a sound one.

### Regressions introduced by 2dca933: 1 (minor)

1. **L223 and L286, provenance label on the new citation.** `vllmSpecDecode` is a documentation page (a README under `docs/`) and is rendered as `provenance="code-derived"`; Sources.tsx id 54 likewise types it `source-code`. A reader is told the claim came from reading code. Fix: render it as documentation, keeping the tag pin, for example `<SourceRef provenance="documented" doc={docs.vllmSpecDecodeDoc} />` with `vllmSpecDecodeDoc: { title: 'vLLM documentation (v0.32.0): Speculative Decoding', url: 'https://github.com/vllm-project/vllm/blob/v0.32.0/docs/features/speculative_decoding/README.md#L3', tier: 1, accessed: ACCESSED }`, and set the Sources.tsx id 54 type to `official-docs`. Then re-express L221-224 so the citation sits on what it bears: "Each model fits on its own node, and speculative decoding exists to cut inter-token latency [vllmSpecDecodeDoc], so every draft-to-verifier round-trip lands there, and that round-trip is what EFA shortens."

Nothing else in the diff adds an unsourced assertion, widens a hedge or drops a citation; the "No benchmark ... was located during this research" hedge (L145-147) is untouched.

### Remaining corrections

1. **L184-185, uncited quantitative claim** (CLAUDE.md fact-checking standard; the file header at L15-18 makes the same promise). Add a citation after "P5 instance" to the accelerated-computing spec table, the source the Decision Guide already uses for P5 sizes: declare `ac: { title: 'EC2 instance types: Accelerated computing', url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html', tier: 1, accessed: ACCESSED }` and insert `<SourceRef provenance="documented" doc={docs.ac} />`. Confirm 640 GB of accelerator memory for p5.48xlarge on that page when applying.
2. **L246-247, uncited sizing presented without its basis.** Replace "Roughly 300B parameters at fp16, or roughly 600B at fp8 and int8, fit on a single P5." with "Roughly 300B parameters at fp16, or roughly 600B at fp8 and int8, fit on a single P5 by weight alone: about 600 GB against 640 GB, which leaves little for the KV-cache (our arithmetic)."
3. **L240, description contradicts its second column.** The batch column (L254-258) is multi-node on standard networking, not intra-node links carrying everything. Replace with: `description="Two serving shapes that skip EFA: one node where NVLink carries everything, and batch work loose enough on latency to run on standard networking across zones."`
4. **L279-281, clause that restates its own sentence** (shape rule 4, inside-a-sentence test). Replace "AWS recommends a cluster placement group to satisfy that and keep latency low; it is a recommendation, and the hard boundary is the zone" with "AWS recommends a cluster placement group to satisfy that and keep latency low; the hard boundary is the zone".

### Backlog

- A rendered prefill-to-decode diagram with the KV-cache crossing EFA once per request and the backend choice on the arrow.
- A worked bytes-per-request example to make the opener's figure computable.
- Sources or softer wording for "multi-node inference runs acceptably on standard networking" (L254-255) and "most fine-tuning and inference workloads stop here" (L269).

---

## 4. HPC.tsx (EFA for Traditional HPC)

### AFTER Gate 3 score: 9 / 10 (BEFORE 8)

- All four reasons the BEFORE score was held at 8 are closed: the Hpc8a vendor figures carry "AWS's launch announcement puts the gain ..." (tier 2 no longer read as a measurement), MPAS, IFS, CONUS, LAMMPS, BWA and GATK are expanded at first read, the Open MPI default carries its "From EFA installer 1.30.0" scope, and the uncited "Nitro v6 pairs with EFA v4" close is deleted.
- The MPI support sentence now points at the reader's choice ("Running MPICH or any other MPI means running outside that support statement"), and the MPI wiring block remains the most typeable block in batch C: two install paths, one command, two Intel MPI variables with reasons, and a version range for multi-rail.
- Not 10: the model is prose-only (no coupling diagram), the "Choosing the instance" h2 description carries an uncited superlative, and the section closes on a vendor figure in the last column rather than on the purchase decision.

### Axes

| Axis | BEFORE | AFTER |
|---|---|---|
| Mental model | 4 | 4 |
| Practical leverage | 5 | 5 |
| Rigor | 4 | 5 |
| Accuracy | 5 | 5 |
| Economy | 4 | 4 |

- Rigor 5: the three BEFORE rigor defects that were rule violations (vendor figure, dropped source qualifier, uncited Nitro line) are fixed; what remains uncited is an undisputed mechanism (memory registration pins pages, L202-204) and one description superlative (correction 1 below).
- Economy holds at 4: the Collectives column is still GPU-training evidence inside the HPC section, earning its place only through "re-measure after upgrades".

**Did the pass succeed by the leverage test?** Partly. Rigor rose a point and accuracy held at 5, economy held; model and leverage did not rise (leverage was already at 5, and no model candidate was proposed). A successful corrections pass with no loss.

### Fetch

- efa-start.html: "From EFA 1.30.0, both Open MPI 4.1 and Open MPI 5 are installed by default", "Open MPI 4.1 is installed to /opt/amazon/openmpi. Open MPI 5 is installed to /opt/amazon/openmpi5", `module load openmpi5`, `I_MPI_OFI_LIBRARY_INTERNAL=0`, and `I_MPI_OFI_PROVIDER` set to `efa` making Intel MPI fail instead of defaulting to TCP/IP. L175-179 and L185-188 are fully borne.

### Regressions introduced by 2dca933: 0

The five changed lines are four acronym expansions (all standard project names: Model for Prediction Across Scales, Integrated Forecasting System, Continental United States, Large-scale Atomic/Molecular Massively Parallel Simulator, Burrows-Wheeler Aligner, Genome Analysis Toolkit), one scope restoration (narrower, not wider), one re-attribution, one re-expression, and one deletion of an uncited sentence. No new assertion.

### Remaining corrections

1. **L220, h2 description: uncited superlative and an uncited judgement** ("the price-performance answer and the most constrained families on EC2"). Replace with: `description="What each dedicated HPC family gives you, and the purchase limits (no Spot, no Dedicated Hosts, no metal sizes) that come with all of them."` (traces to L224-226 and the four columns).

### Backlog

- NAMD (L105) is still unexpanded. The BEFORE report proposed "Nanoscale Molecular Dynamics" subject to a check against the project's home page; if the project presents NAMD as a name rather than an acronym, leaving it matches the GROMACS and LS-DYNA treatment.
- A one-line provider check next to the Intel MPI settings. The fetched efa-start.html documents one: `I_MPI_DEBUG` at level 1 or higher prints the libfabric provider, `efa` on EFA and `tcp;ofi_rxm` on TCP. Adding it is a new fact, so it needs the citation attached in the same edit.
- A closing block for "Choosing the instance" that ends on the decision (which family for which constraint) rather than on the Hpc8a vendor figure.
- A coupling diagram (rank waits per timestep against independent ranks).

---

## 5. NetworkComparison.tsx (EFA vs Alternatives)

### AFTER Gate 3 score: 8 / 10 (BEFORE 8)

- Both BEFORE corrections and the accuracy flag are closed: the Latency cell carries "in AWS's description", the Encryption cell carries "per AWS", and the footer no longer denies the microsecond figure the EFA column carries ("Only the EFA column carries a microsecond latency: no citable source giving one for the other three transports was located").
- The latency pair now reads Latency then Tail latency (candidate 2), so the table's latency rows end on the factor of ten, the figure the opener and the Overview both make decisive. The Latency cell was tightened as proposed with both hedges ("the EC2 User Guide gives no per-message figure"; "the one AWS figure located") intact.
- Held at 8: practical leverage is still two workload lists, the RoCE column carries uncited judgements, and the NVLink row drops the "preliminary" qualifier its source puts on the specification table (correction 1).

### Axes

| Axis | BEFORE | AFTER |
|---|---|---|
| Mental model | 5 | 5 |
| Practical leverage | 3 | 3 |
| Rigor | 4 | 4 |
| Accuracy | 4 | 5 |
| Economy | 4 | 4 |

- Accuracy 5: the footer contradiction is gone. Nothing found wrong.
- Rigor holds at 4: vendor flattening fixed, but the uncited RoCE cells (L170 "Strong, and PFC pauses can cascade", L328 "nothing about SRD closes that gap"), the uncited opener claim "on-premises InfiniBand still wins on point-to-point latency" (L267-268), and the dropped NVLink qualifier remain.

**Did the pass succeed by the leverage test?** Neutral-positive. Accuracy rose to 5; model, rigor and economy held; leverage did not rise (no BEFORE candidate targeted the closing lists). No loss.

### Fetch

- nvidia.com/en-us/data-center/nvlink/: the spec table gives "NVLink Bandwidth per GPU" as 900 GB/s (Hopper), 1,800 GB/s (Blackwell), 3,000 GB/s (Vera Rubin), and carries "Preliminary specifications; may be subject to change." The table does not label the per-GPU figures bidirectional; only the page's generic "3 TB/s bidirectional" sentence does. So the BEFORE backlog item's "bidirectional" qualifier is not supported for the table figures; the "preliminary" qualifier is.

### Regressions introduced by 2dca933: 0

The diff swaps two rows, re-attributes two vendor claims, rewrites one cell with both hedges kept, rewrites the footer with its "was located" scope kept, and updates a non-reader-visible file comment to match. No new assertion; no hedge widened.

### Remaining corrections

1. **L195-196, source qualifier dropped** (rule 14 and the leverage standard's "never trades a hedge scope"; the cited page marks its specification table preliminary). Replace "3,000 GB/s (6th gen, Vera Rubin)" with "3,000 GB/s (6th gen, Vera Rubin, from a specification table NVIDIA marks preliminary)".
2. **L332, universal absence stated as fact** (rule 14). Replace "EFA has no switch-side collective offload." with "No switch-side collective offload for EFA was located in AWS documentation during this research."

### Backlog

- Sources or softer wording for the RoCE column's tail cell (L170), "nothing about SRD closes that gap" (L328), and the opener's InfiniBand latency claim (L267-268).
- Replace the two generic closing lists with checks a reader can run (for example "time inside collectives above X share of the step"), sourced from the training and HPC sections.
- A rendered diagram of the four network assumptions.

---

## 6. EKSIntegration.tsx (EFA on EKS: the AMI, the device layer and the pod contract)

### AFTER Gate 3 score: 9 / 10 (BEFORE 8)

- All eight BEFORE corrections are closed: five absence claims now carry "located during this research" or "this research did not locate" (L607, L613, L1264, L1311, L1323), the argument-from-design at the efa-nv-peermem sentence is relabelled "on our reading" and moved out from between claim and citation (L787-789), two attribution narrations are gone (L894-896, L948-950), and the provisioning h2 description states the choice (L876).
- Economy improved where the BEFORE report said it would: the ENABLE_EFA gate and template default moved into the existing rebuild disclosure, the "Eight PCIe roots" Alert collapsed into one sentence on the DRA alignment paragraph, and the five-release Value walk moved into its own disclosure while the main flow keeps the bound (v0.19.0 to v0.19.2, reverted in v0.19.3) and the action (mofedEnabled=false on every version).
- Not 10: two more universal claims from local reading remain (L577, L1382-1383), the section is still about 1,600 lines, and one Karpenter warning is narrowed to dynamic provisioning where its source carries no such qualifier (fact-check flag).

### Axes

| Axis | BEFORE | AFTER |
|---|---|---|
| Mental model | 5 | 5 |
| Practical leverage | 5 | 5 |
| Rigor | 4 | 4 |
| Accuracy | 5 | 5 |
| Economy | 3 | 4 |

- Rigor holds at 4 on the remaining two rule-14 claims below, which the BEFORE report did not list; every claim the BEFORE report listed is fixed.
- Economy 4: main-flow evidence chains are demoted; length is the remaining drag.

**Did the pass succeed by the leverage test?** Yes, within ceilings. Model and leverage were already at 5 and held; accuracy held at 5; economy rose a point; rigor held while closing every listed defect. The Bottlerocket version sentence (L812-817) and the eksctl paragraph (L907-911) now say which driver each platform runs and what to use instead, which is leverage gained inside an axis already at its maximum.

### Fetches

- karpenter-provider-aws v1.15.0 `website/content/en/preview/tasks/dra.md` around L188-191: "each of the eight GPUs in a p5.48xlarge shares a PCIe root with four EFAs" and "Configuring spec.networkInterfaces on an EC2NodeClass used for EFA DRA workloads is currently unsupported and results in undefined behavior. Leave it unset." The re-expressed L948-950 sentence is borne for the dynamic case (see the flag below for scope).
- amazon-eks-ami at the pinned SHA, `install-efa.sh`: `sudo ./efa_installer.sh --minimal -y` at L53, and an `rpm -e --nodeps efa-nv-peermem` block on non-NVIDIA AMIs. The relabelled "on our reading means --minimal installed it" (L788-789) is a fair, labelled inference from that block.
- efa-start.html (fetched for HPC): "It is not an absolute requirement ... we do recommend ... as it launches the instances into a low-latency group in a single Availability Zone." Bears L894-896.

### Regressions introduced by 2dca933: 0

Every hunk is a hedge narrowing, an attribution removal that keeps the claim, a demotion into a disclosure with citations moved intact, or a re-expression of sentences already present. The documentation-versus-code MOFED conflict (L1406-1411) is untouched and its bound stays in the main flow. The PCIe-root sentence (L1236-1240) moves provenance from prose into the code-derived links, which is what the attribution rule asks; the "generated metadata" origin is still visible from the link labels. No acronym lost its first expansion; no AI tells.

### Remaining corrections

1. **L577, universal claim from a local search** (rule 14). Current: "AWS sets both to the same number in every example it publishes." Replace with: "AWS sets both to the same number in every example this research located."
2. **L1382-1383, universal claim from a local reading** (rule 14). Current: "no operator CRD (Custom Resource Definition) has an EFA-specific field". Replace with: "none of those four operators' CRDs (Custom Resource Definitions) carries an EFA-specific field that this research located".

### Accuracy flag (for the fact-check track)

- **L947-952, scope narrower than the cited warning.** The Karpenter v1.15.0 warning covers "an EC2NodeClass used for EFA DRA workloads", with no dynamic-provisioning qualifier. The section scopes it to "the EFA DRA driver and dynamic provisioning", then offers "static capacity" as an efa-only route under DRA. If "static capacity" means a Karpenter static NodePool using an EC2NodeClass with networkInterfaces, the cited warning appears to cover it too. Check the EKS device-management page's wording for the static case before deciding; the qualifier predates 2dca933 (FC6 E-06).

### Backlog

- Name the Karpenter DRA alpha feature gates and the Helm value that enables them (BEFORE backlog; still open).
- A source for the aws-efa-eks archive date (L1498) and for the repository transfer (L1491-1492).
- A rendered PCIe-root diagram (eight roots, one GPU and four EFA each) for the DRA alignment block.

---

## 7. SageMaker.tsx (EFA on SageMaker AI and HyperPod)

### AFTER Gate 3 score: 8 / 10 (BEFORE 8)

- All seven BEFORE corrections are applied and both accuracy flags are closed: the four-gates caption now reads "Gate 1 fails loudly. Gates 2 and 3 can fail quietly", the base-OS disclosure header counts the two pages its body names, "roughly 2023 pins" is replaced by "releases that date from 2020 to 2023" with three new citations that check out, and DLC and LLM are expanded at first read.
- The leverage candidates landed: "Pin SageMaker Python SDK v3.24.0 or later for P5 and P5e" now leads its paragraph, the base-image check states its reason first, the --disable-ngc block orders the version split before the practice, and the SMDDP release-notes conflict sits in its own disclosure ("Where April 2025 comes from") with the conclusion in the body.
- Held at 8 because the pass introduced two defects: the re-expressed SMDDP scope sentence now attaches the SDK citation to "runs only on P4d and P4de", which the SDK code contradicts, and the flexible-instance-group sentence now says the distribution "stays" within one zone where the source says training "benefits from" it.

### Axes

| Axis | BEFORE | AFTER |
|---|---|---|
| Mental model | 5 | 5 |
| Practical leverage | 5 | 5 |
| Rigor | 4 | 4 |
| Accuracy | 4 | 4 |
| Economy | 3 | 3 |

- Accuracy holds at 4 only on net: two inherited errors fixed, one new contradiction introduced (regression 1). With regression 1 fixed this is a 5.
- Rigor holds at 4: the three new release-date citations and the moved fi_info citation are good; regressions 1 and 2 are new check-1 and check-2 failures.
- Economy holds at 3: the SMDDP conflict is demoted and two closing restatements are cut, but the EKS AMI line and Slurm AMI line version inventories (L1261-1277) stay in the main flow and the section is still about 1,700 lines.

**Did the pass succeed by the leverage test?** Not yet. Model and leverage held at their ceiling, economy held, rigor held, but the pass wrote a sentence that is wrong against its own citation. Fixing regression 1 brings accuracy to 5 and the pass then succeeds.

### Fetches

- GitHub API: NVIDIA/nccl tag v2.7.8-1 commit dated 2020-07-27 (committer); aws/aws-ofi-nccl release v1.1.1 published 2020-11-02. HEAD on aws-efa-installer-1.30.0.tar.gz: `Last-Modified: Wed, 20 Dec 2023`. "Releases that date from 2020 to 2023" (L794-797) is borne; the DocRef titles say honestly that the installer date is a Last-Modified header.
- sagemaker-python-sdk v2.257.0 `src/sagemaker/fw_utils.py` L85-91: `SM_DATAPARALLEL_SUPPORTED_INSTANCE_TYPES = ("ml.p3.16xlarge", "ml.p3dn.24xlarge", "ml.p4d.24xlarge", "ml.p4de.24xlarge", "local_gpu")`.
- data-parallel-faq.html: "The SMDDP library only supports GPU instances, more specificcally, P4d and P4de instances with NVIDIA A100 GPUs and EFA."
- What's New, HyperPod flexible instance groups (April 2026): "provide multiple subnets across availability zones in a single instance group" and "Training customers benefit from multi-subnet distribution within an availability zone to avoid subnet exhaustion."

### Regressions introduced by 2dca933: 2

1. **L1107-1115, citation cannot bear the claim, a source disagreement flattened, and a new internal contradiction.** The pass replaced "The support page lists ... The FAQ says the library only supports ... P4d and P4de ..., and the SDK source agrees" with "It supports ml.p3dn.24xlarge, ml.p4d.24xlarge and ml.p4de.24xlarge ... In practice it runs only on P4d and P4de, with NVIDIA A100 GPUs and EFA [ddpFaq] [code-confirmed ddpSupport + smddpTypes]". The SDK allowlist the second citation points to accepts ml.p3.16xlarge and ml.p3dn.24xlarge as well (fetch above), so it cannot bear "runs only on P4d and P4de"; "in practice" asserts observed behaviour that no cited source records; and the sentence now contradicts L1122 ("scoped to those three instance types") and the h2 description ("the three supported instance types"). The support page and the FAQ disagree about P3dn, which is attribution case 2, so naming the two sources was load-bearing. (This text was the BEFORE report's correction 2, applied as written; the BEFORE report misread the case.)
   Replace L1107-1113 from "It supports ml.p3dn.24xlarge" to the end of the code-confirmed SourceRef with:
   "The support page lists ml.p3dn.24xlarge, ml.p4d.24xlarge and ml.p4de.24xlarge, notes that support for optimizing collective communication on P3 has been discontinued, and makes the optimized AllGather collective P4-only [ddpSupport]; the SDK's own allowlist accepts all three [code-confirmed ddpSupport + smddpTypes]. The FAQ is narrower and names only P4d and P4de, with NVIDIA A100 GPUs and EFA [ddpFaq]."
2. **L1443-1444, scope strengthened** (check 1). The source says training "benefit[s] from multi-subnet distribution within an availability zone" and that the feature accepts "multiple subnets across availability zones"; "That distribution stays within an Availability Zone" turns a stated benefit into a guarantee. Replace with: "The training benefit is stated for distribution within one Availability Zone, the EFA boundary, and the feature also accepts subnets across zones, so keep an EFA training group's subnets in one zone."

### Remaining corrections

1. **L1480-1486, attribution narration and a vendor figure carried by "Same post"** (attribution rule; the figure keeps its attribution under case 4). Replace "The four bands in the diagram are the AWS blog's own description of the transport, with NIXL selecting the RDMA operation and the libfabric provider exposing EFA as kernel-bypass GPUDirect RDMA that keeps the host CPU off the data path [dpdBlog]. Same post, the quantified claim: on ml.p5.48xlarge with 3,200 Gbps of EFA, an 8,000-token transfer for Llama 3.3 70B takes single-digit milliseconds [dpdBlog]." with "In that transport, NIXL selects the RDMA operation and the libfabric provider exposes EFA as kernel-bypass GPUDirect RDMA that keeps the host CPU off the data path [dpdBlog]. AWS's blog puts an 8,000-token transfer for Llama 3.3 70B on ml.p5.48xlarge, with 3,200 Gbps of EFA, at single-digit milliseconds [dpdBlog]."
2. **L1183-1185, attribution narration** ("Note the order rule on that page:"). Replace with: "Initialize PyTorch Distributed with the SMDDP backend first, then run the SMP initialization [smpSmddp]." (moving the existing smpSmddp citation from L1183 to the end of this sentence, and ending the previous sentence after "DeepSpeed" with the same citation kept).
3. **L1321-1322, provenance-only sentence.** Delete "Both log samples are quoted from the deep health checks page [deepHealth]." and attach that citation to the code block's following sentence: "The failure is a fabric bandwidth threshold failure rather than a GPU failure: expected minimum 80, NCCL test output 30 [deepHealth]."

### Backlog

- Four-gates diagram: gate 2 is still drawn in the neutral style while the caption now says it can fail quietly; consider the amber treatment for its "Falls out here" note, and align the SVG `<title>` (L466-470), which still names only the third gate as silent.
- Demote the EKS AMI line and Slurm AMI line inventories (L1259-1279) into a disclosure, keeping "The variant you pick decides the EFA version" in the main flow.
- Cross-check NCCL_PROTO=simple as "mandatory" (L888-889) against the NCCL over EFA section's current guidance (BEFORE backlog; still open).

---

## 8. StorageDataPaths.tsx (Storage Data Paths: FSx for Lustre, S3 and the Common Runtime)

### AFTER Gate 3 score: 9 / 10 (BEFORE 8)

- All ten BEFORE corrections and both accuracy flags are closed: CRT is expanded in the h1 (and in the nav label), GDS and LNet are glossed before the diagram that uses them, three h2 descriptions now state results (700 against 100 Gbps; the 8 MiB floor past roughly 400 Gbps; which claims are documentation and which are code), the security-group fallback is labelled "Our reading", and the "whitepaper" prose now cites the whitepaper itself, verified below.
- The decision and the number still arrive before any mechanism (7 times and 12 times at L784, landed again at L812), the Latency cell now explains the RDM endpoint before telling the reader to baseline with `-e rdm`, and the close still ends on two set-once decisions and a question order.
- Not 10: economy is unchanged at 3 (the boundary container and the "They are quoted here because" aside talk about the page, and the new boundary description now repeats the body below it), and the 15.5 microsecond figure still travels without the placement-group condition its source attaches.

### Axes

| Axis | BEFORE | AFTER |
|---|---|---|
| Mental model | 5 | 5 |
| Practical leverage | 5 | 5 |
| Rigor | 4 | 4 |
| Accuracy | 4 | 5 |
| Economy | 3 | 3 |

- Accuracy 5: the behaviour-stated-as-fact and the named-source mismatch are both fixed and verified.
- Rigor holds at 4 on two small scope and label defects (corrections 1 and 2 below); the absence claims are now scoped to the trees and commits read.

**Did the pass succeed by the leverage test?** Yes, within ceilings. Accuracy rose to 5; model and leverage held at 5; rigor and economy held. The GDS-list re-expression (L870-871) turns a sentence about why the paragraph exists into the check the reader runs.

### Fetches

- `https://d1.awsstatic.com/whitepapers/AmazonS3BestPractices.pdf` (downloaded, text-extracted): "Initial publication date: June 2019", "Reviewed for technical accuracy ... March 10, 2021", and "8-16 MB. Make one concurrent request for each 85-90 MB/s of desired network throughput. To saturate a 10 Gb/s network interface card (NIC), you might use about 15 concurrent requests". The new `s3Whitepaper` citation at L1249 bears all three figures.
- S3 User Guide, optimizing-performance-design-patterns.html: the request-parallelization section recommends concurrent byte-range or part downloads and measuring before raising concurrency, with no 8 to 16 MB, 85 to 90 MB/s or 15-request figure. The new sentence "gives the same advice without these figures" (L1249-1251) is borne.

### Regressions introduced by 2dca933: 0

The diff closes corrections and flags with narrower or labelled wording; no hedge widened; the one new assertion (the User Guide gives the same advice without the figures) was verified. "Nothing in the console indicating anything is wrong" was deleted along with the unlabelled inference, which removes an unsourced claim rather than a sourced one.

### Remaining corrections

1. **L702, source qualifier dropped** (rule 14; NetworkComparison.tsx:153 carries the same figure with the condition). Replace "the one AWS figure located (15.5 microseconds of one-way MPI latency) comes from the 2019 launch" with "the one AWS figure located (15.5 microseconds of one-way MPI latency in a cluster placement group) comes from the 2019 launch".
2. **L142-147, tier label on the new citation** (introduced by 2dca933; not a claim regression). `s3Whitepaper` is declared tier 1, while this dive's sources.md files AWS whitepapers under "Tier 2: AWS product pages, blogs, announcements, whitepapers". Change the fourth `doc(...)` argument from `1` to `2`.
3. **L1284-1287, body now repeats the h2 description written by the pass** (shape rule 13, word count; the description at L1271 already says it). Delete "The two halves are also different classes of evidence: FSx for Lustre here is documentation-sourced, because the service side has no open-source artifact to read, and the S3 client is code-sourced at pinned commits you can open. The badge on each claim says which one you are looking at." If the "no open-source artifact to read" reason is wanted, move only that clause into the description.
4. **L1023-1026, block talks about the page** (shape rule 1). Delete "They are quoted here because they are the clearest available statement of the CPU ceiling that separates an object path from a fabric path, and they come from the people who wrote the client." The preceding sentence ("These are code comments, so they are evidence of the authors' intent rather than proof of behaviour.") keeps the evidence grade.

### Backlog

- Name the environment variable at L1123 ("an environment variable that AWS does document"); the reader is told an escape hatch exists but not what to type.
- Say what changed after the pinned commit at L1203 (FC8 ST-2 drafted the sentence, citing aws-c-s3 v1.3.1).
- A source for "The Deep Learning AMIs pre-install the Lustre client, the EFA driver and the GDS driver" (L888-890).
- Fold the boundary container (L1267-1289) into one sentence under the comparison table.

---

## Comparison with the applier's log (gate3-apply-C.md, read after all eight sections were scored)

| Section | Applier AFTER | Re-score AFTER | Where we differ |
|---|---|---|---|
| DecisionGuide.tsx | 8 (4/5/4/5/4) | 8 (4/5/4/5/4) | Same axes. The re-score adds a G5 NVLink scope note and a dangling "its" from the hedge rewrite. |
| Overview.tsx | 8 (4/3/4/5/4) | 8 (4/3/4/5/4) | Same. |
| AIMLInference.tsx | 8 (4/5/4/5/4) | 8 (4/4/4/5/5) | The applier scores leverage 5 for the three configuration checks; the re-score keeps 4, because those checks sharpen actions that were already there. Economy is the reverse. The re-score also finds the `code-derived` label on a documentation README. |
| HPC.tsx | 8 (4/5/4/5/4) | 9 (4/5/5/5/4) | Rigor. The applier keeps 4 for memory pinning, the h2 superlative and the software-upgrade evidence. The re-score reads memory pinning as undisputed and the message-size paragraph as correctly scoped ("agrees in direction"), which leaves one description fix. Both readings are defensible. |
| NetworkComparison.tsx | 8 (5/3/4/5/4) | 8 (5/3/4/5/4) | Same axes. The NVIDIA page fetched here supports "preliminary" (now a correction) and does not support "bidirectional" for the table figures (the BEFORE backlog item should drop it). |
| EKSIntegration.tsx | 9 (5/5/5/5/4) | 9 (5/5/4/5/4) | Rigor. The re-score finds two more universal claims from local reading (L577, L1382-1383) that neither the BEFORE report nor the applier listed, plus a fact-check flag on the Karpenter DRA warning's scope. |
| SageMaker.tsx | 9 (5/5/5/5/3) | 8 (5/5/4/4/3) | The applier's claim-set self-check describes "In practice it runs only on P4d and P4de" as a "re-expression of the FAQ sentence ..., same citation" and lists "Otherwise none". Neither entry holds. The SDK allowlist behind the code-confirmed citation accepts ml.p3.16xlarge and ml.p3dn.24xlarge. "Stays within an Availability Zone" turns a stated benefit into a guarantee. The applier did not fetch the cited code to check the first, and its self-check missed the second. |
| StorageDataPaths.tsx | 9 (5/5/5/5/3) | 9 (5/5/4/5/3) | Rigor. The 15.5 microsecond figure still lacks its placement-group condition (open in the BEFORE backlog), and the new whitepaper DocRef is tier 1 where sources.md files whitepapers as tier 2. The applier's whitepaper fix was correct: the PDF and the User Guide page were both verified here. |

The applier's process held up well. It refused one wrong BEFORE fix: renaming "whitepaper" to "S3 User Guide" would have misattributed the figures. It re-flowed diagram text to stay inside the box, verified dates with primary sources, and skipped NAMD on evidence. Both SageMaker regressions are the same failure: a self-check that diffed the text but did not re-read what the moved citation can prove. The SMDDP one was inherited from the BEFORE report's own correction 2.

---

## Summary

| Section | BEFORE score | AFTER score | AFTER axes (model / leverage / rigor / accuracy / economy) | Regressions from 2dca933 | Remaining corrections |
|---|---|---|---|---|---|
| DecisionGuide.tsx | 7 | 8 | 4 / 5 / 4 / 5 / 4 | 0 | 4 (one optional) |
| Overview.tsx | 8 | 8 | 4 / 3 / 4 / 5 / 4 | 0 | 1 |
| AIMLInference.tsx | 8 | 8 | 4 / 4 / 4 / 5 / 5 | 1 (minor: provenance label) | 4 |
| HPC.tsx | 8 | 9 | 4 / 5 / 5 / 5 / 4 | 0 | 1 |
| NetworkComparison.tsx | 8 | 8 | 5 / 3 / 4 / 5 / 4 | 0 | 2 |
| EKSIntegration.tsx | 8 | 9 | 5 / 5 / 4 / 5 / 4 | 0 | 2 (+1 fact-check flag) |
| SageMaker.tsx | 8 | 8 | 5 / 5 / 4 / 4 / 3 | 2 (SMDDP scope against its SDK citation; flexible-group "stays") | 3 |
| StorageDataPaths.tsx | 8 | 9 | 5 / 5 / 4 / 5 / 3 | 0 | 4 |

- Batch AFTER: no section below 8; average 8.375 (67 / 8), up from 7.875.
- Regressions: 3. Two are substantive and both are in SageMaker.tsx; fix them first, because they are the only places 2dca933 made the page less accurate. The third (AIMLInference) is a provenance label.
- Remaining corrections: 21, against written rules. They are mostly rule 14 scope (EKS 2, NetworkComparison 1, Storage 1), attribution narration (SageMaker 3), descriptions (Overview, AIMLInference, HPC), uncited figures (AIMLInference 2) and economy (Storage 2, AIMLInference 1).
- Leverage test by section: succeeded within ceilings for EKSIntegration and StorageDataPaths. Corrections succeeded but model and leverage did not rise for DecisionGuide, Overview, AIMLInference, HPC and NetworkComparison; none of these lost anything. SageMaker does not yet pass because it introduced an accuracy defect; it passes once regression 1 is fixed.
- No pass in this batch raised mental model. Every BEFORE candidate was a delete, reorder or re-express on refresh-touched lines, and no diagram was commissioned, so the model axis had no path to move. The diagram items in each backlog are where that axis is.
- Fetches for this report: Neuron trn1-arch (v2.33.0), EC2 capacity-blocks-how and ec2-capacity-blocks, efa-start, NVIDIA NVLink page, vLLM v0.32.0 speculative-decoding README, Karpenter v1.15.0 dra.md, amazon-eks-ami install-efa.sh at the pinned SHA, GitHub API (nccl tag v2.7.8-1, aws-ofi-nccl v1.1.1), HEAD on the EFA installer 1.30.0 tarball, sagemaker-python-sdk v2.257.0 fw_utils.py, SMDDP FAQ, HyperPod flexible instance groups What's New, the S3 best-practices whitepaper PDF, and the S3 User Guide design-patterns page. No personal data in any request; curl and WebFetch defaults only.

STATUS: COMPLETE
