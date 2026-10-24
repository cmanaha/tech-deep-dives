# Gate 3 quality score, batch B (October 2026 refresh)

STATUS: COMPLETE (summary table at the end)

Scorer: Gate 3 quality scorer (constrained audit: score what exists, corrections against written rules only).
Sections: InstanceSupport, Pricing, NcclOverEfa, AIMLTraining, Operations, TopologyApi.
Standards: `deep-dives/efa/revamp/section-shape-standard.md`, `deep-dives/efa/revamp/leverage-pass-standard.md`, CLAUDE.md "Writing Style: No AI Tells" and "Section Shape".
Refresh diff base: `b39b4d3`.

---

## 1. InstanceSupport.tsx (Instance Support Matrix)

Reader-visible rows also read from `deep-dives/efa/src/data/instances.ts` (row notes, use cases, generation cards).

### Gate 3 score: 8 / 10

- The spine is a usable model stated in the first bold sentence (L147-148, "EFA support is a property of the Nitro hypervisor generation") and carried by the generation diagram plus the four generation cards (L343-372). A reader can place an unfamiliar type by its Nitro version.
- Practical value is high and typeable: three CLI commands (L270-293) with the "surprising rows" they confirm (L300-302), per-row caveats that change sizing (hpc7a.96xlarge needs two interfaces on separate cards, c8i.48xlarge is 75 Gbps on one card), and the P6-B300 16 x 400 arithmetic (L420-429).
- Supporting conflicts are correctly demoted into four ExpandableSections; the strongest number (6,400 Gbps) lands four times. The section ends on an action (Capacity Reservation for the placement group, L514-515).
- Held at 8 by: an opening sentence that overstates what the Nitro version decides (L150-154, see accuracy flags), a negation-plus-narration opener in the closing Alert (L502-503), a universal claim about Spot prices (L466-468), and a Trn3 paragraph whose chip-compute figures (L439-443) bear on neither EFA sizing nor the model.

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 4 | 5 | 4 | 4 | 4 |

- Mental model 4: the Nitro ladder is clear and visual; the P6e-GB200 "two independent sharing axes" model (L489-497) exists only as a dense prose list of index pairs.
- Rigor 4: the 3,200 Gbps and 17-card figure attributed to the accelerated computing page (L408-409) carries only the `efaAcc` citation, and "These reconcile ... comes from the GPU sharing topology" (L411-413) is our reading sitting between two cited facts without a label. Spot universal claim (L466-468).
- Accuracy 4: "tracks the Nitro version in a straight line" (L153-154) contradicts the section's own diagram (3,200 Gbps on both Nitro v4 and Nitro v5); "decides ... the RDMA capability ... of every row" (L150-151) contradicts the five named read-only exceptions in the EFA v3 card.
- Economy 4: Trainium3 compute specs (petaflops, HBM, memory bandwidth, L439-443) in a networking matrix; the verbatim heading list (L345-348) repeats the diagram and its footnote (L89).

### Corrections

1. **L502-503, placement-group Alert: definition by negation plus attribution narration.** "AWS is explicit: it is not an absolute requirement to launch your EFA-enabled instances into a cluster placement group." Deleting "AWS is explicit" leaves the claim unchanged, and the claim is phrased as what it is not.
   Replace with: "A cluster placement group is optional for EFA-enabled instances." (Keep the next sentence, "AWS recommends one because ...", where "recommends" is load-bearing.)
2. **L466-468, Spot ExpandableSection: hedge scope widened to a claim about the world.** "Spot prices themselves are not published in any credential-free AWS endpoint" asserts an absence the research can only report as not located (research file `02-instances-pricing.md` U-9).
   Replace with: "No credential-free AWS endpoint carrying Spot prices was located during this research, so no Spot rate or savings percentage appears here."
3. **`instances.ts` L688, c8i.48xlarge row note: negation that reads as page history.** "75 Gbps on one card, not 200 Gbps on two." A first-time reader has no "200 Gbps on two" to unlearn; the clause is the residue of an earlier row value.
   Replace with: "75 Gbps on one card. The C8i ladder runs 32xlarge 50 Gbps, 48xlarge 75 Gbps, 96xlarge 100 Gbps, and EFA switches on at 48xlarge."

### Accuracy flags (outside the written-rule list, listed for the fix pass)

A. **L153-154, opening paragraph.** "and the ceiling tracks the Nitro version in a straight line" contradicts the diagram directly below (Nitro v4 and Nitro v5 both peak at 3,200 Gbps).
   Replace with: "and the peak steps up with the Nitro version: 400 Gbps on Nitro v3, 3,200 Gbps on Nitro v4 and v5, 6,400 Gbps on Nitro v6."
B. **L150-151, opening paragraph.** "That single fact decides the EFA generation, the RDMA (Remote Direct Memory Access) capability and the bandwidth ceiling of every row below" overstates: the EFA v3 card names five read-only exceptions on Nitro v5.
   Replace with: "That single fact decides the EFA generation of every row below, and with it the RDMA (Remote Direct Memory Access) capability and the bandwidth ceiling, apart from five named RDMA exceptions."

### Leverage candidates (blocks changed in this refresh)

1. **Re-express, L345-348 (heading list, changed).** The reader gets the source three times (verbatim headings, the SourceRef, the diagram footnote at L89) before the useful RDMA ladder. One sentence carries the provenance.
   Proposed: "Each Nitro version pairs with one EFA generation, and the EC2 User Guide files every supported type under a heading that names both [docs.efa]." Then continue with "RDMA follows the same ladder: ...".
2. **Reorder, L389-399 (P6e-GB200 first paragraph, changed).** The verdict ("So three first-party statements give EFA v4, and the hypervisor version is the contested part") is the last sentence; a reader opening the disclosure wants it first. Move it to open the paragraph, then the four citations.
3. **Re-express, L401-406 (P6e-GB200 second paragraph, changed).** "What you size on is listed per type ... and the bandwidth ceiling follows below" points elsewhere instead of naming the number.
   Proposed: "Size on what the User Guide lists for this type: RDMA read and write [docs.efa] and the 1,600 Gbps EFA ceiling in the warning below. If the hypervisor version itself matters, ask your account team which page governs the hardware you will be assigned." (1,600 Gbps traces to L409-410.)
4. **Reorder, L445-452 above L438-444 (Trn3, changed paragraph).** The networking figures a reader opens this for (12,800 and 28,800 Gbps per UltraServer, no per-instance figure) sit behind four chip-compute figures. Lead with the changed paragraph; the announcement paragraph follows as context.
5. **Re-express, L448 (Trn3, changed).** "That is why there is no Trn3 row above." is a sentence about the page.
   Proposed: merge into the previous sentence: "... or in the us-east-1 price list as of 2026-10-23, so the matrix carries no Trn3 row."

### Backlog (enhancements, not corrections)

- A small diagram for the P6e-GB200 two sharing axes (card-index pairs versus GPU-shared pairs, L489-497).
- An `ac` citation on the 3,200 Gbps / 17-card figure in the bandwidth Alert (L408-409).
- A Trn3 row once a trn3 instance type appears in the EFA tables.

---

## 2. Pricing.tsx (Pricing Analysis)

Reader-visible rows also read from `deep-dives/efa/src/data/pricing.ts` (cost table notes, HPC notes, price history, Capacity Block rates). Derived percentages checked: 113.666/113.9328 = 99.8%, 63.158/63.296 = 99.8%, 129.168/142.416 = 90.7%, 47.757/55.04 = 86.8%. All four hold.

### Gate 3 score: 8 / 10

- The section carries one clear model, "A price is a claim with an expiry date" (L284), and proves it with the p5.48xlarge $98.32 to $55.04 history (L264-281); the cost-per-Gbps table (L137-177) turns "EFA is free" into the number that decides between network-optimized instances and the accelerator premium.
- The refresh made Capacity Blocks practical: a final-day clock with exact UTC times (L376-393), and block-hour cost as a share of On-Demand (L414-416). The HPC region finding (L202-204, four families have no us-east-1 rows) is the kind of fact that changes what a reader quotes.
- Ends on the reader's action (L490-491, "Settle the path, then rebuild the cost-per-Gbps column against a version you cite").
- Held at 8 by one h2 description that restates scope (L125), a universal Spot claim (L307-308), attribution narration and an unexpanded "AZ" in the closing container (L458-461), and the price-list version string repeated in prose four times.

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 4 | 5 | 4 | 4 | 4 |

- Rigor 4: the "What EFA itself costs" table attaches `EFA_DOC` to every row (L110-114), including "EFA-capable types skew toward the largest size in each family", which the EFA page cannot bear. Spot universal claim (L307-308).
- Accuracy 4: "That last filter carries weight" (L81) points at "no license", while the sentence is about MarketOption; "the way every other rate here is" (L309) contradicts the Tier 2 Capacity Block rates, which carry no price list version; the h3 "Families sold as whole units" (L316) states as fact what L325-326 labels as our reading for the HPC families.
- Economy 4: version 20261022231453 appears at L79, L125, L287 and in the table; the Outposts and P4d cross-type sentence (L461-463) is placement material that does not bear on price, and the placement-group quote repeats the InstanceSupport closing Alert.

### Corrections

1. **L125, h2 description restates scope instead of the payoff.** "us-east-1, Linux, Shared tenancy, On-Demand. Price list version 20261022231453."
   Replace with: `description="What a Gbps of EFA costs on each family, the number that decides between network-optimized instances and the accelerator premium"` (traces to L133-135; the scope stays in the L77-84 paragraph).
2. **L307-308, Spot Alert: hedge scope widened.** "Spot rates do not appear in the EC2 Price List bulk API or in any credential-free first-party AWS endpoint."
   Replace with: "Spot rates do not appear in the EC2 Price List bulk API, and no credential-free first-party AWS endpoint carrying them was located during this research."
3. **L337, definition by negation.** "Eligibility is not availability."
   Delete the sentence; the next sentence ("For a multi-node EFA job every instance has to land in one Availability Zone ...") carries the point.
4. **L178 and L182, negation in an Alert header and body.** Header "The cost-per-Gbps column is our arithmetic, not an AWS figure"; body "It is a comparison aid, not a price."
   Replace the header with: "The cost-per-Gbps column is our arithmetic". Replace the body sentence with: "It is a comparison aid." (The `derived` badge and "AWS does not publish a cost-per-Gbps metric", a load-bearing silence claim, keep the provenance.)
5. **L458-459, attribution narration that fails the delete test.** "The EFA limitations section is unambiguous: "EFA traffic can't cross Availability Zones or VPCs.""
   Replace with: "EFA traffic cannot cross Availability Zones or VPCs (Virtual Private Clouds) [EFA_DOC]." (Also expands VPC, never expanded in this section.)
6. **L461, acronym never expanded.** "cross-AZ redundancy" is the only use of AZ in the section.
   Replace with: "That is the rule that removes redundancy across Availability Zones from an EFA cluster."

### Accuracy flags (outside the written-rule list, listed for the fix pass)

A. **L81.** "That last filter carries weight" refers to MarketOption, which is not the last filter listed. Replace with: "The MarketOption filter carries weight".
B. **L309.** "the way every other rate here is" also covers the Capacity Block rates, which come from the Tier 2 pricing page with no version. Replace with: "the way every On-Demand rate here is".
C. **L316, h3.** "Families sold as whole units" asserts for hpc6a through hpc8a the inference that L325-326 labels "Our reading". Replace with: "Families with no Spot support".
D. **L297 and L330, "bid on".** [SPECULATIVE: from model knowledge, not fetched in this pass] Spot has not used a bidding model since AWS changed Spot pricing in late 2017. Replace "Which families you can bid on" with "Which families support Spot", and the h3 "Families you can bid on" with "Families with Spot support".

### Leverage candidates (blocks changed in this refresh)

1. **Reorder, L413-417 (block-hour arithmetic, added).** The h2 description promises "what an hour costs against On-Demand", and the answer sits inside a footer ExpandableSection. Move this paragraph, with its `derived` badge and its "Tier 2 block rate over Tier 1 On-Demand rate" label, into the main container under the final-day clock; the rate table stays demoted.
2. **Re-express, L391-392 (final-day clock, changed).** "Schedule the checkpoint and drain from the clock." names the action without the times the column just gave.
   Proposed: "Schedule the checkpoint and drain to finish before 11:00 UTC on an instance-type block and before 10:30 UTC on an UltraServer block." (Both times trace to L377-388.)
3. **Delete, L404-405 first sentence (Tier 2 Alert, changed).** "These rates come from the Capacity Blocks product pricing page, a Tier 2 source; every On-Demand rate above comes from the Price List bulk API." The disclosure header (L398) already reads "Published Capacity Block rates (Tier 2, product pricing page)". Keep the scheduled-update quote and the arithmetic.
4. **Reorder, L77-85 (filter paragraph, changed version string).** The filter list is the recipe for the re-pull that "The practical rule" (L282-289) asks for, and as the page's second block it puts method ahead of the cost answer. Move it to sit directly after "The practical rule", or into an ExpandableSection there titled for the re-pull.
5. **Delete, L286-287 last sentence (practical-rule Alert, changed).** "Every On-Demand rate on this page is pinned to version 20261022231453." is the third prose statement of the version; the h1-adjacent paragraph and the table carry it.

### Backlog (enhancements, not corrections)

- A rendered timeline of the Capacity Block final day (11:30 end, 11:00 instance-type termination start, 10:30 UltraServer, the two warning times that disagree).
- Per-row citations in the "What EFA itself costs" table instead of one `EFA_DOC` on every row.
- A sourced Spot rate path, if one is found, with its own date.

---

## 3. NcclOverEfa.tsx (NCCL over EFA: the aws-ofi-nccl Plugin)

### Gate 3 score: 7 / 10

- Strong, predictive models carried visually and in prose: the five-layer stack with each layer's variable prefix (diagram 1, L183-280), "the tuner biases a choice NCCL still makes, one cell at a time, and a zero cost is a vote rather than a measured time" (L961-963), and "A rail is an ordinal that both ends agree on, held in software" (L924-925) with the XML-versus-sort_rails split (L938-941).
- Practical value is front-loaded and typeable: the "short version" settings (L622-628), the stale-advice table (L724-739), the log-line table (L1204-1212), the exact-case grep strings (L1214-1229) and a closing two-column checklist (L1304-1345), so the section ends on the reader's action. The refreshed GDAKI block is now a four-condition list that ends on the variable to set (NCCL_GIN_TYPE=5, L1294).
- Held to 7 by economy and rule defects. The tuner container carries six ExpandableSections, two of which answer third-party guides or release-note archaeology rather than the reader's job (segfault fix L1049-1070, cmpScore L1091-1109). The GDAKI opener (L1242-1259) puts four interface versions, two export names and a device-type value ahead of the four conditions. Prose grew by about 109 words in a section that was already the longest in the dive. Two acronyms from the CLAUDE.md niche list (SRD, RDMA) are never expanded, RMA and DMI are never expanded, GIN is used before its expansion, and one h2 description restates the topic.

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 5 | 5 | 5 | 4 | 3 |

- Rigor 5: every mechanism claim is pinned to a tag or commit, doc-code conflicts are marked, and the one untraced consequence is labelled inference (L1127-1132). Minor gap: the first drift item, "NCCL looks for a network plugin symbol beyond the exported range and falls back to its own transport" (L1163-1164), carries no citation, while `code.ncclNetVersions` exists.
- Accuracy 4: the h2 description "Four version numbers have to agree" (L1141) disagrees with the body's "Those three plus the instance type" (L1178-1179); see accuracy flag B for a scope question on L697.
- Economy 3: the two disclosures above; the "Where AWS documentation ends" disclosure (L630-643) restates the intro's last sentence (L617-619); the NCCL_TUNER_PLUGIN explanation appears in the Alert (L690-698) and again in the table row (L527-531); the added chunk-size sentence (L1008-1013) is off-topic for its disclosure; "actually" recurs nine times in headers and prose.

### Corrections

1. **L210, diagram 1 layer title: SRD (niche list) never expanded in this section.** `title: 'EFA device and SRD'`, `sub: 'Nitro hardware'`.
   Replace with `title: 'EFA device'` and `sub: 'Nitro hardware, Scalable Reliable Datagram'` (42 characters at 11px fits the roughly 280px text area; confirm with `gate-content-overflow`).
2. **L718, RDMA (niche list) never expanded; this is its first prose use.** "which turns eager messages off on the RDMA protocol"
   Replace with: "which turns eager messages off on the RDMA (Remote Direct Memory Access) protocol". (Leverage candidate 3 below carries the same expansion if applied instead.)
3. **L767, h2 description restates the topic.** "Two decisions the plugin makes before a single collective runs: which provider, and which platform."
   Replace with: `description="Why leaving FI_PROVIDER unset gets you the efa filter, and what decides the defaults your instance type receives"` (traces to L780-781 and L807-809).
4. **L793, acronym never expanded.** "It reads the DMI product name out of sysfs"
   Replace with: "It reads the DMI (Desktop Management Interface) product name out of sysfs".
5. **L1153, GIN used before its expansion at L1242 (changed in this refresh).** "and needs libfabric 2.6.0 or later for the kernel-initiated GIN path"
   Replace with: "and needs libfabric 2.6.0 or later for the kernel-initiated GIN (GPU-Initiated Networking) path"; at L1242 drop the second expansion: "The plugin&apos;s GIN subsystem lets GPU kernels start network transfers, in two modes."
6. **L1252, acronym never expanded (changed in this refresh).** "over an RMA backend the plugin also exports"
   Replace with: "over an RMA (Remote Memory Access) backend the plugin also exports".

### Accuracy flags (outside the written-rule list, listed for the fix pass)

A. **L1141, h2 description count.** "Four version numbers have to agree, and only one place tells you what is actually loaded." The body names three versions plus the instance type (L1178-1179), and NCCL's version comes from its own banner (L1178).
   Replace with: `description="Three versions and the instance type have to agree, and the startup banners are where you read what the running process loaded."`
B. **L697, scope question.** [SPECULATIVE: inference from the section's own statements, not traced] "Pointing it at a path by hand is scoped to NCCL 2.19 and 2.20." The section also says the v1 tuner interface was removed in plugin v1.20.0 (L1013-1014). If NCCL 2.19 and 2.20 bind the v1 symbol, plugin v1.22.0 offers them nothing to load, and the sentence needs a plugin-version scope ("... and to plugin releases before v1.20.0"). Check the tuner symbol at an NCCL 2.19 or 2.20 tag before editing.

### Leverage candidates (blocks changed in this refresh)

1. **Demote, L1242-1259 (GDAKI opener, rewritten).** The reader came for "what has to line up", and the opener spends ten citations on interface versions 11, 13 and 14, two export names and a device-type value before the list starts. Keep a three-sentence lead and move the symbol detail into an ExpandableSection ("Which GIN symbols the plugin exports") directly after it.
   Proposed lead: "The plugin&apos;s GIN subsystem lets GPU kernels start network transfers, in two modes: host-proxy GIN, and GDAKI (GPUDirect Async Kernel-Initiated), a separate export from v1.21.0 [ginGdakiExportFirst]. NCCL 2.32.3 runs the host-proxy path itself [ncclGinProxySkip], so with that release the plugin&apos;s GIN export matters only for GDAKI. Four conditions decide whether a job that uses NCCL&apos;s device API with GIN gets it [ncclDevGinConnect]." (Condition 4 already carries "NCCL_GIN_TYPE=5 ... EFA_GDA backend", so the value 5 is not lost.)
2. **Reorder, L1043-1045 (last sentence of the rewritten NCCL_ALGO-filter disclosure).** "Your filter and the tuner compose: the filter narrows the table, the tuner votes inside what is left, and NCCL takes the minimum of that." is the payoff of the whole tuner container and sits behind a disclosure. Lift it into the visible Alert, replacing its last sentence (L971-972).
   Proposed Alert ending: "On those versions your NCCL_ALGO filter narrows the table, the tuner votes inside what is left, and NCCL takes the minimum."
3. **Re-express, L717-719 (OFI_NCCL_EAGER_MAX_SIZE, added).** An orphan fact dropped between two sentences about the cheatsheet; the reader is not told what to do with it. The knob diagram already classes it "only with measurements in hand" (L318, L470).
   Proposed: "OFI_NCCL_EAGER_MAX_SIZE is one to change only with measurements in hand: it defaults to -1, which turns eager messages off on the RDMA (Remote Direct Memory Access) protocol [paramEager]."
4. **Delete, L1091-1109 ("What cmpScore actually sorts", changed).** It corrects what third-party guides say about a GPU-search sort function; it changes nothing the reader sets, reads in a log, or checks, and the tuner model above already says where algorithm selection happens. The research file keeps it.
5. **Re-express, L834-837 (NCCL_IB_HCA on p6-b200 and p6-b300, added).** The mechanism is stated with no hook. The Alert at L852-860 already says any value you set wins and the plugin logs the skip; connect the two.
   Proposed sentence appended after the `ibHcaNote` citation: "Like every injected default, an NCCL_IB_HCA you set yourself wins over this one, and the plugin logs that it skipped its own [envSkipLog]."

### Backlog (enhancements, not corrections)

- A rendered flow of the cost-table pipeline (filter, initialise, modelled times, tuner vote, minimum); the composition model exists only as prose.
- A rendered gate chain for the four GDAKI conditions (instance, build, fabric, NCCL).
- A single grep command for the checklist's log lines.
- A citation on the first drift item (L1163-1164).

---

## 4. AIMLTraining.tsx (EFA for AI/ML Training)

### Gate 3 score: 6 / 10

- The section has a usable sizing method and lands it: bytes on the wire per step divided by documented bandwidth (L174-181, 2.2 s at 100 Gbps against about 70 ms at 3,200 Gbps), the TP-intra-node, PP-and-DP-inter-node layout rule (L228-239), and a scaling-efficiency-to-cost conversion (L488-492). It ends on the reader's action: time one step on one node and one at target count (L502-505).
- The visible practical payoff is right: two variables worth setting (L322-331) and "leave NCCL_TOPO_FILE unset" framed as how to get it right (L460-475).
- Below 7 because the model the h1 description promises ("decided by which parallelism strategy you run and what it puts on the wire") carries an uncited and, by our reading, wrong traffic shape for tensor parallelism (L190-191), the opening sentence contradicts that same description (L146), and the Neuron intro gives Inferentia2 an EFA path that the Instance Support section rules out (L258-260). The "Under the Hood" disclosure (L352-429) carries plugin internals the file's own header comment (L18-20) assigns to the NCCL over EFA section, and the refresh grew it. EFA, SRD, RDMA, GDAKI and ROCR are never expanded and NCCL is used before its expansion; one h2 description restates mechanism; one hedge is widened.

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 4 | 4 | 3 | 3 | 3 |

- Rigor 3: the parallelism columns carry no citation for the DP volume formula (L171), the TP and PP traffic characterisations (L189-199) or "SRD's multi-path routing handles asymmetric traffic well" (L212); the prerequisite Alerts carry uncited load-bearing numbers and outcomes (Fabric Manager version match, L442-445; "10-20 GiB", "30 GiB", "fails silently", L448-450). The Under the Hood disclosure, by contrast, is cited line by line.
- Accuracy 3: see accuracy flags A to C.
- Economy 3: the env-var paragraph (L332-345) and the Under the Hood disclosure restate NCCL over EFA material, including the cmpScore guide correction (L416-420); the MoE column carries libfabric extension names and build conditions (L212-220) in a strategy overview.

### Corrections

1. **L147, EFA never expanded in this section.** "and EFA&apos;s job is to keep scaling efficiency close to linear."
   Replace with: "and the job of EFA (Elastic Fabric Adapter) is to keep scaling efficiency close to linear."
2. **L212, SRD (niche list) never expanded.** "SRD&apos;s multi-path routing handles asymmetric traffic well."
   Replace with: "The multi-path routing of SRD (Scalable Reliable Datagram) handles asymmetric traffic well."
3. **L216, GDAKI never expanded (changed in this refresh).** "through the GDAKI export of its GIN (GPU-Initiated Networking) subsystem"
   Replace with: "through the GDAKI (GPUDirect Async Kernel-Initiated) export of its GIN (GPU-Initiated Networking) subsystem" (moot if leverage candidate 1 is applied).
4. **L295, NCCL used before its expansion at L313.** "where a collective occupies GPU streaming multiprocessors" sits in "the CUDA and NCCL path".
   Replace "the CUDA and NCCL path" with "the CUDA and NCCL (NVIDIA Collective Communications Library) path", and at L313 replace "NVIDIA NCCL (Collective Communications Library) is the standard" with "NCCL is the standard".
5. **L377, RDMA (niche list) never expanded; first prose use (changed in this refresh).** "off by default on the plugin&apos;s RDMA protocol at v1.22.0"
   Replace with: "off by default on the plugin&apos;s RDMA (Remote Direct Memory Access) protocol at v1.22.0".
6. **L368, niche acronym never expanded.** "for CUDA, ROCR and Neuron memory"
   Replace with: "for CUDA, ROCR (the AMD ROCm runtime) and Neuron memory".
7. **L251, h2 description restates the mechanism instead of the payoff.** "Trainium reaches EFA through Neuron CCL and libfabric, and runs collectives on cores dedicated to communication"
   Replace with: `description="Which Trainium instance to pick for multi-node training, and why its collectives run on cores separate from compute"` (traces to L266-268 and L291-292).
8. **L495-496, hedge scope widened.** "No scaling efficiency band for EFA on P5, and none for TCP at the same scale, traces to a benchmark that can be cited, so this page quotes neither."
   Replace with: "No scaling efficiency band for EFA on P5, or for TCP at the same scale, was traced to a citable benchmark during this research, so this page quotes neither."

### Accuracy flags (outside the written-rule list, listed for the fix pass)

A. **L190-191, tensor parallelism traffic.** [SPECULATIVE: model knowledge, not fetched in this pass] "Tensor parallelism ... requires all-to-all communication every forward/backward pass." Megatron-style tensor parallelism synchronises with allreduce inside each layer's forward and backward pass; all-to-all is the MoE pattern the next column describes. Verify against the Megatron-LM paper before editing; if confirmed, replace with: "requires allreduce communication inside every forward and backward pass". The claim is uncited either way.
B. **L146, opening sentence.** "Distributed training is <strong>communication-bound</strong>." contradicts the h1 description (L140), which says whether the fabric matters depends on the strategy.
   Replace with: "Distributed training grows more <strong>communication-bound</strong> as it scales." (The next sentence, "As you scale from 1 node to N nodes, the fraction of each step spent synchronizing grows", already carries the mechanism.)
C. **L258-260, Inferentia2 and EFA.** "AWS Trainium and Inferentia2 chips run on the Neuron SDK ... so the EFA path on these instances is Neuron CCL, then libfabric, then the device." The Instance Support section (InstanceSupport.tsx L482-487) states no Inf2 size appears in the EFA tables and multi-node Inf2 runs over ENA.
   Replace "the EFA path on these instances" with "the EFA path on Trainium instances".

### Leverage candidates (blocks changed in this refresh)

1. **Re-express, L212-220 (GPUDirect Async in the MoE column, changed).** A reader choosing a parallelism layout gets two libfabric extension names, a fabric name and a build condition, none of which they can act on from this page; the NCCL over EFA section owns the conditions.
   Proposed: "The multi-path routing of SRD (Scalable Reliable Datagram) handles asymmetric traffic well. EFA also supports GPUDirect Async, which the aws-ofi-nccl plugin consumes through its GIN (GPU-Initiated Networking) subsystem [ginGdaki]; the NCCL over EFA section has the full sequence."
2. **Re-express, L332-345 (env-var paragraph, changed).** Two sentences of provenance narration ("The plugin publishes its own cheatsheet ... Read against it") stand between the reader and the list; the citation already carries the source.
   Proposed: "The rest of the usual EFA environment block either applies only to plugin releases from 2023 and earlier or is best left at its defaults: FI_PROVIDER=efa applies to aws-ofi-nccl 1.5.0 and older, FI_EFA_USE_DEVICE_RDMA=1 can be left out on libfabric 1.18.0 or later with aws-ofi-nccl 1.7.0 or later, and NCCL_BUFFSIZE and the channel-count knobs work best at their defaults [envCheatsheet]. Leave NCCL_TUNER_PLUGIN unset too: on EC2 the plugin&apos;s CUDA build sets it to its own library [tunerPluginEnv][tunerPluginCall]. The NCCL over EFA section walks the block line by line and says which layer owns each variable."
3. **Delete, L406-410 (last sentence of "GPU memory support is decided once per process", added).** "It resolves cuPointerGetAttributes, which finds the GPU that owns a buffer, at initialisation rather than linking it" is a linkage detail with no setting, decision or log line attached.
4. **Delete, L394-395 (file-history sentence, changed).** "The code is in src/nccl_ofi_rdma.cpp, named nccl_ofi_rdma.c before the plugin moved to C++ in v1.15.0." is plugin file history; the four citations in the paragraph already name the file.
5. **Re-express, L285 (Neuron disclosure header, changed).** "Neuron architecture advantage" puts the dive's voice behind a claim the body itself grades as AWS description with no published speedup figure (L290-297); "collectives communication" is also a slip.
   Proposed: `headerText="Neuron collectives run on dedicated collective communication (CC) cores"`.

### Backlog (enhancements, not corrections)

- Citations for the DP volume formula, the TP and PP traffic characterisations, the Fabric Manager version-match outcome and the disk-space figures, or the visual "unverified" flag the CLAUDE.md sources standard asks for.
- A rendered diagram of the hybrid layout (TP on NVLink inside a node, PP and DP across EFA), the section's central decision, which exists only as prose.
- Land the 70 ms against 2.2 s figure a second time, in the scaling-efficiency container, so the section's strongest number is repeated.

---

## 5. Operations.tsx (Operations, Observability and Failure Modes)

### Gate 3 score: 8 / 10

- The opening gives the section's model in two sentences and every block hangs off it: the stack degrades instead of failing, so "A healthy run and a silent fallback to TCP look identical from the outside" (L611-618). "Logs record intent. Counters record traffic." (L863) turns that into a monitoring rule. Two diagrams carry it: the bottom-up triage tree (L173-297) and the failure-layer map with silent and loud failures (L304-431).
- Practical value is dense and typeable: four bring-up checks, each with expected output (L645-798); three signals with one grep and one counter diff (L873-884); the five network counters to alert on, and why the rest are noise (L1243-1295); the "Ten things to get right" table, ordered correct-configuration first (L1037-1054), which applies rule 10 by construction. It ends on the reader's action: collect the five network counters yourself on EKS (L1321-1324).
- UNKNOWN is used honestly, and the opening Alert scopes it correctly (L625-626). Several later absence claims drop that scope (L670-671, L795, L1088, L1123-1124, L1290). Six acronyms are used before their expansion or never expanded (AMI, SRD, EKS, VPC, MOFED, plus MPI's expansion sitting in a narration sentence), and two negation constructions remain (L617-619, L1114).

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 5 | 5 | 4 | 4 | 4 |

- Rigor 4: the vendor_part_id Alert cites a 12-line PCI table (`pciIds`) for "no AWS source and no line of driver source maps one to the other" (L669-671), which is the citation-cannot-bear-its-claim pattern in the leverage standard. The other absence claims listed above lose the "located during this research" scope.
- Accuracy 4: see accuracy flags A and B.
- Economy 4: the topology explanation appears in the table row (L512-518) and again in the "Two of these" disclosure (L1113-1125), and NCCL over EFA and AI/ML Training carry it too. The qkey_viol paragraph (L989-995) explains an absence with nothing to act on. The "Name the channel" Alert opens by repeating the two columns above it (L1180).

### Corrections

1. **L617-620, definition by negation; also AMI never expanded (first use).** "so verification is not a troubleshooting step you reach for when something looks wrong. It belongs in the bring-up checklist alongside the checks that stop a job outright, and it runs again after every AMI rebuild or container change."
   Replace with: "so verification belongs in the bring-up checklist alongside the checks that stop a job outright, and it runs again after every AMI (Amazon Machine Image) rebuild or container change."
2. **L669-673, hedge scope widened and a citation asked to bear an absence.** "The driver registers five device identifiers and AWS documents four EFA versions, and no AWS source and no line of driver source maps one to the other [pciIds]. Use vendor_part_id ... to name the generation [efa]."
   Replace with: "The driver registers five device identifiers [pciIds] and AWS documents four EFA versions [efa], and no mapping between the two was located in AWS documentation or the driver source during this research. Use vendor_part_id to predict software behaviour, and the EC2 User Guide instance table heading to name the generation."
3. **L795-796, hedge scope widened.** "No AWS source publishes an expected fi_pingpong result for any instance type"
   Replace with: "No AWS source located during this research publishes an expected fi_pingpong result for any instance type".
4. **L1088-1089, L1123-1124, L1290-1291, the same widening on three UNKNOWN lines.**
   L1088: replace "no AWS or libfabric source gives a cache hit rate" with "no AWS or libfabric source located during this research gives a cache hit rate".
   L1123-1124: replace "No AWS or plugin source quantifies the difference." with "No AWS or plugin source located during this research quantifies the difference."
   L1290-1291: replace "No AWS source publishes a numeric level" with "No AWS source located during this research publishes a numeric level".
5. **L714-715, attribution narration that fails the delete test.** "This check appears in both the MPI (Message Passing Interface) and the NCCL getting-started walkthroughs." The next sentence already carries the documentation and its citation.
   Delete the sentence, and move the MPI expansion to the Alert header at L887: `header="The same check exists for Intel MPI (Message Passing Interface)"`.
6. **L1114, negation plus "current".** "On current instance types the plugin does not read a static file. It writes a NCCL topology into an anonymous in-memory file,"
   Replace with: "On P5 and later the plugin writes a NCCL topology into an anonymous in-memory file," (traces to the topo row, L517).
7. **L474, SRD used before its expansion at L1248-1249.** In the Network (SRD) row: "retrans_timeout_events counts times SRD traffic timed out"
   Replace with: "retrans_timeout_events counts times SRD (Scalable Reliable Datagram) traffic timed out", and at L1248-1249 write "times SRD traffic timed out".
8. **L579, EKS used before its expansion at L1320.** "the EKS guide gives the v0.19.0 default with no upper bound"
   Replace with: "the EKS (Elastic Kubernetes Service) guide gives the v0.19.0 default with no upper bound", and at L1320 write "for anyone running EFA on EKS:".
9. **L543, VPC used before its expansion at L1298.** "EFA traffic cannot cross Availability Zones or VPCs"
   Replace with: "EFA traffic cannot cross Availability Zones or VPCs (Virtual Private Clouds)", and at L1298 write "You can create a VPC Flow Log".
10. **L328 and L576, MOFED never expanded (diagram chip changed in this refresh).** Diagram chip line 2 "mofed claims the uverbs nodes"; table mode "NVIDIA device plugin mofed default in containers".
    Replace the chip line with `'claims every uverbs node'`, and the mode cell with "NVIDIA device plugin MOFED (Mellanox OpenFabrics Enterprise Distribution) default in containers". The flag names mofed-enabled, mofedEnabled and MOFED_ENABLED stay verbatim.
11. **L544, attribution narration.** "and AWS is explicit that it is a recommendation rather than a requirement"
    Replace with: "and AWS recommends one rather than requiring it" (the strength verb is the load-bearing form).

### Accuracy flags (outside the written-rule list, listed for the fix pass)

A. **L1028, h2 description.** "Sorted by how quiet the failure is." The rows are not in that order: huge page starvation (loud in the diagram) is fourth, ahead of the silent security-group and Availability Zone rows, and the silent mofed row is last.
   Replace the description with: "Ten configurations to get right, the failure each prevents, and the check that tells you which you have."
B. **L789-790, code-block comment.** [SPECULATIVE: model knowledge, not fetched in this pass] "Failure looks like this, and it is almost always the security group. fi_getinfo(): -61 (No data available)". fi_getinfo matches providers locally and returns -61 (FI_ENODATA) when no provider fits the hints, so this output points at a local provider or endpoint-type problem; a blocked security group would show as a stalled exchange. Confirm with a two-node run against a blocked peer, logged in `research/`, before editing. The comment is uncited either way.

### Leverage candidates (blocks changed in this refresh)

1. **Re-express, L1220-1224 (checksum Alert, changed).** The inserted dated sentence left "Step 2 matters for the same reason" without its antecedent.
   Proposed: "... so confirm your version is listed before you rely on step 4. Step 2 matters because Intel MPI ships its own libfabric, and at debug level 1 and above the printed libfabric version is suffixed with impi when the internal one is in use [start]."
2. **Re-express, L1180-1181 (opening of the "Name the channel" Alert, changed).** "Installer 1.51.0 ships driver 3.3.1 while the repository is at r3.4.0." repeats the two columns directly above.
   Proposed opening: "Both channels are correct, one minor release apart, and features sit in that gap." (then "Hardware support moves the same way: ...").
3. **Re-express, L834-837 (Signal 1, ATTN clause added).** The new fact is a reader instruction phrased as a log-level property.
   Proposed: "The reason is usually a few lines earlier, where NCCL logs Failed to initialize NET plugin [pluginFailed] at the ATTN level, so run with NCCL_DEBUG=INFO: WARN hides it [debugLevels]."
4. **Re-express, L1173-1174 (repository column, changed).** "Relaxed ordering is absent from the 3.3.1 notes." stops short of the consequence the column exists to show.
   Proposed: "Relaxed ordering is absent from the 3.3.1 notes, so a host built from installer 1.51.0 runs a driver whose release notes do not list it."
5. **Re-express, L756 (fabric disclosure, changed).** "the installer this section pins ships 2.7.0amzn2.0" refers to the page rather than to the thing the reader installs.
   Proposed: "and installer 1.51.0 ships 2.7.0amzn2.0" (traces to L1159).

### Backlog (enhancements, not corrections)

- A logged two-node experiment for the fi_pingpong failure signature (accuracy flag B).
- A node-level collector snippet for the five network counters on EKS; the closing action has no typeable form.
- One shared topology explanation, referenced from NCCL over EFA, AI/ML Training and this section, in place of three copies.

---

## 6. TopologyApi.tsx (The EC2 Instance Topology API)

### Gate 3 score: 8 / 10

- This is the best-shaped section in the batch. It introduces the subject before dissecting it ("The situation:" and "The answer:", L539-557; rule 5 applied, with no "The problem:" opener) and states the single rule to carry: read the array from the end (L558-563). Strong predictive models follow: shared prefix depth as distance (L601-606), the reservation node set as a prefix that launch only appends to (L972-980), and per-account hashing with every consequence spelled out (L853-870). All three are carried by diagrams d10, d10b and d11.
- Practical value is concrete: three CLI commands with "command 2 is the one to keep" (L815-851), the sequential-mapper flag for both Open MPI versions (L779-794), defensive-parsing rules (L872-911), the Karpenter disable procedure (L1270-1279), and a closing action that points back to command 2 (L1432-1436). Pitfalls are attached to the correct approach throughout ("Watch for hard-coded indexes", L647).
- Held at 8 by two widened hedges, one introduced by this refresh (L1284-1285 dropped "In that release" from the Karpenter search finding), one strengthened source hedge ("might return null" becomes "will cache a wrong answer", L899-900), an unexpanded PCS, one h2 description that restates mechanism, and two count or wording slips in headers.

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 5 | 5 | 4 | 4 | 4 |

- Rigor 4: the hedge widenings above; uncited claims "This is the single most common way topology-aware ranking ends up doing nothing" (L790-791) and the Karpenter launch-template sentence (L1290-1292).
- Accuracy 4: see accuracy flags A to C.
- Economy 4: the p6e-gb200 contradiction appears twice with the same action (L690-723 and L1386-1389); the Slurm 25.11 / HyperPod / PCS disclosure (L1146-1195) is detail, correctly demoted.

### Corrections

1. **L663-664, hedge scope widened.** "No AWS statement and no benchmark quantifies what the mis-indexed grouping costs on a real job."
   Replace with: "No AWS statement or benchmark located during this research quantifies what the mis-indexed grouping costs on a real job."
2. **L1284-1285, hedge scope widened by this refresh.** The search is scoped to v1.15.0, and the conclusion drops the scope: "Karpenter neither calls the topology API nor emits these labels."
   Replace with: "In that release Karpenter neither calls the topology API nor emits these labels."
3. **L899-900, source hedge strengthened.** The cited reference says the field "might return null"; the page says automation "will cache a wrong answer".
   Replace with: "Post-launch automation that reads it once and caches the answer can cache a wrong answer".
4. **L1188, acronym never expanded.** "AWS PCS takes the same approach"
   Replace with: "AWS PCS (Parallel Computing Service) takes the same approach".
5. **L1075, h2 description restates the mechanism of the first paragraph.** "The network node hash becomes the switch name, verbatim"
   Replace with: `description="Which Slurm topology plugin fits your fleet, tree or block, and how the network node hash becomes the switch name"` (traces to L1107-1134 and L1083-1086).

### Accuracy flags (outside the written-rule list, listed for the fix pass)

A. **L1033, disclosure header count (changed in this refresh).** "AWS states the reservation limit two ways on two pages": the body cites three pages (API reference and CLI reference agree; the User Guide examples page differs). Replace with: `headerText="AWS states the reservation limit two ways on three pages"`.
B. **L1203, h2 description.** "Karpenter needs the scheduler turned off": the body disables topology-aware scheduling in HyperPod task governance (L1273-1278), not the scheduler. Replace with: `description="One kubectl command tells you whether the labels are there, and Karpenter needs topology-aware scheduling turned off"`.
C. **L1290-1292, uncited and possibly dated.** [SPECULATIVE: model knowledge, not fetched in this pass] "placement group membership through the launch template": Karpenter's v1 API does not take user-supplied launch templates as far as this scorer knows. Verify against the karpenter-provider-aws v1.15.0 tree already pinned in `code.karpenter` before keeping the sentence.

### Leverage candidates (blocks changed in this refresh)

1. **Reorder, L1281-1287 (Karpenter search paragraph, changed).** The reader running Karpenter needs "its nodes carry the labels anyway" first; the zero-occurrence search is the evidence. Leading with the result also restores the version scope (correction 2).
   Proposed: "Karpenter nodes carry the labels anyway, from the cloud controller manager in the EKS control plane [eksTopo]. A search of the full aws/karpenter-provider-aws v1.15.0 release for network-node-layer returns zero occurrences, and so does a search for DescribeInstanceTopology [karpenter], so in that release Karpenter neither calls the topology API nor emits these labels."
2. **Delete, L1386-1389 ("One open contradiction", changed).** It restates the p6e-gb200 disclosure at L690-723, including the same action (read the depth from the response). The "Where the published evidence stops" disclosure keeps its two other gaps.
3. **Re-express, L717 (p6e-gb200 disclosure, changed).** "All three are AWS authored and cannot all describe the same response." hides that the split is two against one.
   Proposed: "All three are AWS authored, and the blog cannot describe the same response as the two pages that say three layers."
4. **Delete, L1239 second sentence of the code comment (changed).** "Layer 4 exists only on four-layer types." repeats the cited prose sentence two lines above it (L1234-1235); the code comment keeps "See which layer each node sits on."

### Backlog (enhancements, not corrections)

- A rendered consumer-chain diagram (API response, rank map, topology.conf, Kubernetes labels), the scope the file header assigns to this section.
- A citation for "the single most common way topology-aware ranking ends up doing nothing" (L790-791), or drop the superlative.
- A logged API call confirming whether the live response returns the string "null" for CapacityBlockId, as the published examples do.

---

## Summary

| Section | Gate 3 score | Mental model | Practical leverage | Rigor | Accuracy | Economy | Corrections | Accuracy flags | Leverage candidates |
|---|---|---|---|---|---|---|---|---|---|
| InstanceSupport | 8 | 4 | 5 | 4 | 4 | 4 | 3 | 2 | 5 |
| Pricing | 8 | 4 | 5 | 4 | 4 | 4 | 6 | 4 | 5 |
| NcclOverEfa | 7 | 5 | 5 | 5 | 4 | 3 | 6 | 2 | 5 |
| AIMLTraining | 6 | 4 | 4 | 3 | 3 | 3 | 8 | 3 | 5 |
| Operations | 8 | 5 | 5 | 4 | 4 | 4 | 11 | 2 | 5 |
| TopologyApi | 8 | 5 | 5 | 4 | 4 | 4 | 5 | 3 | 4 |

- Batch average: 7.5. Gate 3 (no section below 7, average at least 8) is not met by this batch: AIMLTraining scores 6, and the average is 7.5.
- Cross-section patterns for the fix pass:
  - Widened hedges ("no AWS source publishes" without "located during this research") recur in five of six sections. One was introduced by this refresh (TopologyApi L1284-1285).
  - Niche acronyms are used before expansion, or never expanded, in every section except InstanceSupport: SRD, RDMA, RMA, DMI, GIN, GDAKI, MOFED, PCS, plus EKS, VPC and AMI ordering.
  - The topology-file explanation appears in NcclOverEfa, AIMLTraining and Operations.
  - The Spot-rate universal claim appears in both InstanceSupport and Pricing.
- AIMLTraining needs the most: its parallelism traffic model (tensor parallelism as all-to-all) and its Inferentia2 EFA path should be checked before any leverage work, because the leverage pass may not proceed with an accuracy defect open.

STATUS: COMPLETE
