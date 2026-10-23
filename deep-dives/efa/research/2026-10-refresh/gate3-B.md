# Gate 3 quality score, batch B (October 2026 refresh)

STATUS: IN PROGRESS

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

