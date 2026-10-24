# Gate 3 quality scoring, batch A (October 2026 EFA refresh)

STATUS: see last line

Scorer: Gate 3 quality scorer (constrained audit: score what exists, corrections only, enhancements to backlog).
Sections: DataPath, SrdProtocol, EfaDevice, Libfabric, EnaVsEfa.
Baseline for "changed in this refresh": `git diff b39b4d3 HEAD`.
Governing documents: `deep-dives/efa/revamp/section-shape-standard.md`, `deep-dives/efa/revamp/leverage-pass-standard.md`, CLAUDE.md "Writing Style: No AI Tells" and "Section Shape".

---

## 1. DataPath.tsx (The Data Path: OS-Bypass End to End)

### Gate 3 score: 8 / 10

- The spine is a real, predictive model and it is carried visually: "The split is by lifetime" (L523) plus three rendered diagrams (efa-d01 what the bypass deletes, efa-d03 kernel on the control plane only, efa-d04 six steps with the kernel absent). A reader can predict which call costs a system call without having read the driver.
- Practical value lands in three places: the 4096-byte threshold to compare scatter-gather entries against before turning the MR (memory region) cache off (L816-819), the instance-type check before designing around RDMA write (L853-861), and "confirm peer-to-peer support on a new instance" (L901-903), which is also the closing block, so the section ends on an action.
- Supporting evidence is correctly demoted: the two-kernel-driver question, the Data Path Direct internals and the capability-bit evidence each sit in an ExpandableSection.
- Held below 9 by small rule defects (two niche acronyms in a diagram never expanded before use, one negation definition, one topic-restating h2 description) and by the refreshed lifetime paragraph now repeating a list the column below it and the diagram already carry.

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 5 | 3 | 4 | 5 | 4 |

- Practical 3: the actions are named but rarely made typeable. "Confirm peer-to-peer support" has no command; "the maximum cached count and maximum cached size parameters" (L825-826) are not named; the 2021 no-op installer flag (L895) is not named.
- Rigor 4: two claims sit uncited between cited ones: "A process can only ring doorbells inside its own region" (L786-787, an inference from the driver recording the UARN, User Access Region Number, which the cited driver lines cannot show the device enforcing) and "For small messages the payload rides inline in the descriptor" (L657-658).
- Accuracy 5: nothing found wrong. One phrasing is ambiguous rather than wrong: "keeps queue-pair count linear in the number of peers, where a connected transport goes quadratic" (L625-626) is correct only read cluster-wide.

### Corrections

1. **L339, diagram efa-d04 step 2 label: niche acronym never expanded.** "SQ" appears only here and is never expanded anywhere in the section (prose says "send queue").
   Replace `title: 'Write to the SQ'` with `title: 'Write send queue'`. (16 characters in a 128-wide box at 13px bold; confirm with `gate-content-overflow`.)
2. **L340, diagram efa-d04 step 3 label: acronym used before its expansion.** "MMIO" is first read here; it is expanded only at L766.
   Replace `sub: 'one MMIO write'` with `sub: 'one mapped write'` (matches the diagram title's "a single memory-mapped write").
3. **L881-883, Alert body: definition by negation.** "which is exactly why it reads like a primary source. It is not one, and the code wins"
   Replace with: "which is exactly why it reads like a primary source. The driver beside it is the primary source, and the code wins"
4. **L603-604, verbs-objects intro: negation clause ahead of the positive definition.** "None of them is a setting you tune: this table is the vocabulary..."
   Replace with: "This table is the vocabulary the registration, mapping and completion material below is written in, and its last column is the lifetime split made concrete."
5. **L714-715, Data Path Direct gates (changed in this refresh): negation inside the sentence.** "Two gates decide whether it is live on a given host, and neither is a switch you throw."
   Replace with: "Two gates decide whether it is live on a given host, and both are properties of the host."
6. **L834, h2 description restates the topic instead of the payoff.** "Taking host memory out of the copy path as well" is a definition of GPUDirect RDMA.
   Replace with: `description="Which RDMA operations your instance type has, and what decides whether payloads leave GPU memory"` (traces to L853 and L901-902).

### Leverage candidates (blocks changed in this refresh)

1. **Re-express, L531-538 (left column "Kernel, once per resource").** The refresh made the lifetime paragraph (L523-526) list the setup objects; the column directly below lists them again and the diagram label at L317 a third time. The reader reads one list three times in one container.
   Proposed column text: "Every setup step in that list, plus creating the completion queue, is a real transition into the kernel [controlOps], and teardown runs the same way in reverse."
2. **Reorder, L901-903 (closing GDRCopy Alert, changed).** The section's final clause is "a build without GDRCopy still sends straight from GPU memory", a reassurance, while the action sits mid-sentence. Put the action last.
   Proposed: "A build without GDRCopy still sends straight from GPU memory: peer-to-peer support is what decides whether payloads leave GPU memory, so that is the one to confirm on a new instance."
3. **Re-express, L846-849 (p2pAlign clause, added in this refresh).** A registration failure signature is buried as a trailing participle in the definition paragraph. Framed as how to get it right, it becomes something to check.
   Proposed, as its own sentence after the p2p citation: "Register GPU buffers so the buffer address and the registered virtual address sit at the same offset within the peer-to-peer page size; the driver fails the registration otherwise [p2pAlign]."
4. **Re-express, L714-723 (Data Path Direct gates, changed).** The paragraph states the consequence ("it changes when either of those changes") but not the reader's moment. Using only text already present:
   Proposed last sentence: "So which of the two descriptor paths a job runs on follows from the device generation and from the rdma-core in the image, and a change to either one is the moment to re-check it."

### Backlog (enhancements, not corrections)

- A command that confirms peer-to-peer support on a new instance (the closing action has no typeable form).
- Name the 2021 installer flag that is now a no-op, and the two MR-cache bounding parameters.
- A citation for the inline-payload claim (L657-658) and for device-side enforcement of the UARN boundary (L786-787).
- A pointer from "0xefa0 devices" (L715) to the EfaDevice section's instance-to-device-id mapping.

---

## 2. SrdProtocol.tsx (SRD: The Transport Protocol)

### Gate 3 score: 7 / 10

- The governing model is stated once and everything hangs off it: "SRD (Scalable Reliable Datagram) keeps reliability and throws ordering away" (L694-699), with the strongest number, p99 down by around a factor of ten, landed four times (L697, L1142, L1221, L1229). The page is forward-ordered: readings on a running cluster (L711-874) come before the mechanism, as the intro promises (L701-707).
- Practical value is the best in this batch: the six-row triage table maps each completion error to the check it sends you to (L575-626, now including FI_EFA_ERR_PEER_ABORTED 4127), the counter table reads the five counters as shapes, the `FI_LOG_LEVEL=info FI_LOG_PROV=efa` block shows the diagnosis that only appears at info level (L787-808), and "Grep your launch scripts for FI_EFA_RECVWIN_SIZE" (L1133-1139) is a direct action. The section ends on an action ("Turn it on only for a receiver written to tolerate reordering", L1308-1309).
- Held to 7 by attribution narration that survived the earlier attribution commit (four sentences open on "AWS states / makes / documents"), by one flattened vendor number at L1142, by a hedge widened in the closing Alert (L1296-1299), and by economy: the InfiniBand/RoCEv2 container restates the opening trade twice (L911-914 and L941-947), and the closing Alert carries driver-accessor evidence that is not demoted.

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 5 | 4 | 4 | 5 | 3 |

- Rigor 4: the factor-of-ten vendor claim is attributed at L695 and flattened at L1142; "the driver only observes the result" (L1298) is stronger than the search it follows; "The application never blocks for it either" (L1004-1006) and "the card is what performs it" (L993) carry no citation; "Unset is the supported answer" (L1136) implies a support statement no source carries.
- Accuracy 5: the 4,096 against 16,777,216 arithmetic checks (512 x 8 = 4,096; 512^2 x 8^2 = 16,777,216). The recvwin guidance scoped to libfabric 2.7.0 matches the installer's 2.7.0amzn2.0 as stated in EfaDevice.tsx L728.
- Economy 3: 1,317 lines. Besides the two restatements, the PFC (Priority Flow Control) deadlock Alert (L930-939) argues with a claim the reader of an EFA page did not bring.

### Corrections

1. **L624, triage table RNR row "What to check next": niche acronym used before expansion.** "RNR" is first read here; it is expanded only at L1011.
   Replace "Occasional RNR under load is the receiver being outrun" with "Occasional RNR (Receiver Not Ready) under load is the receiver being outrun".
2. **L723-728: attribution narration.** "AWS states it for the storage case in its own words: to minimize jitter and to ensure the fastest response to network congestion fluctuations, SRD is implemented in the AWS custom Nitro networking card [storageBlog], and the EBS (Elastic Block Store) documentation repeats it for io2 Block Express [ebsIops]."
   "In its own words" and "AWS states" fail the delete test; "for the storage case" is scope and stays. Replace with: "On the storage side, SRD is implemented in the AWS custom Nitro networking card to minimize jitter and to ensure the fastest response to network congestion fluctuations, including for EBS (Elastic Block Store) io2 Block Express [storageBlog] [ebsIops]."
3. **L911-914: attribution narration.** "AWS makes the ordering half of the same point from the other side: fabrics like InfiniBand..."
   Replace with: "Ordering is the other half of the same point: fabrics like InfiniBand and protocols like TCP send packets in order, and one lost packet holds up everything queued behind it [hpcBlog]."
4. **L941-947: attribution narration.** "AWS makes the comparison itself, in first-party words: SRD differs from protocols like TCP, InfiniBand or RoCE, and instead of preserving packet order..."
   Replace with: "SRD takes the opposite route from TCP, InfiniBand and RoCE: instead of preserving packet order it sends packets over as many network paths as possible while avoiding overloaded paths, and leaves message order restoration to the upper layer, because that layer has a better understanding of the required ordering semantics [storageBlog]."
5. **L1258-1264: attribution narration.** "AWS documents the good-case cost on the ENA Express path: when network traffic is light you might notice... AWS adds that applications with high packets-per-second requirements..."
   Replace with: "SRD is tuned for the bad case. The good-case cost shows on the ENA Express path: when network traffic is light, packets that use ENA Express can show a slight increase in median packet latency, of tens of microseconds [enaExpress]. Applications with high packets-per-second requirements that need to optimize for latency during uncongested periods may be better served by standard enhanced networking."
6. **L1142-1143: vendor performance claim flattened into declarative prose.** "Relaxing ordering is what dropped p99 tail latency by around a factor of ten [hpcBlog]" reads as a measurement; the source is a tier-2 AWS blog, attributed at L695 but not here.
   Replace with: "Relaxing ordering is what AWS credits for dropping p99 tail latency by around a factor of ten [hpcBlog]".
7. **L1192: universal claim from a local search.** "The version repeated everywhere is that a cluster needs..."
   Replace with: "The commonly quoted version is that a cluster needs..." (matches the Alert header).
8. **L1296-1299: hedge scope widened in the next sentence, and an inference stated as fact.** The hedged "No matching set function was found in the tree during this research" is followed by the unhedged "the driver only observes the result" and "Any guide showing an in-instance command to enable it is describing tuning, not enablement."
   Replace the last two sentences with: "ENA Express is configured on the network interface attachment through the EC2 control plane, and the driver code read for this section only reads the result back. Our reading: an in-instance command in a guide is tuning, and enablement happens on the attachment."
9. **L1165, Alert header: definition by negation.** "This block is model, not a knob" (the body's first sentence already says nothing here is configurable).
   Replace with: `header="This block is model: why peer count stops being a resource question"`.

### Leverage candidates (blocks changed in this refresh)

1. **Reorder, L1119-1128 (expandable, "Why the help text says 16384", rewritten in this refresh).** The reader who opens the disclosure wants the default for their version; it arrives as the last sentence after the commit history.
   Proposed opening: "On libfabric 2.4.0 the default is 8192, and from 2.5.0 onward it is 16. The 16384 in the help text was the default before two tuning commits, and neither touched the help string." The two commit sentences follow unchanged, and "So libfabric 2.4.0 defaults to 8192 and 2.5.0 onward to 16." is deleted.
2. **Re-express, L1136 (Alert, changed from "current libfabric" to "libfabric 2.7.0").** "Unset is the supported answer" implies a support statement no source carries, and a reader on 2.5.0 or 2.6.0 cannot tell whether it applies.
   Proposed: "Leave it unset on libfabric 2.5.0 and later, where the default is 16." (traces to L1128).
3. **Re-express, L1102-1105 (changed).** "which is a useful reminder that a help string is documentation, not behaviour" is filler plus a negation.
   Proposed: "Both lines are in the same file [envRecvwin] [envRecvwinHelp]: the help string is documentation, and the initialiser is the behaviour."
4. **Delete, L1064-1066 (slot clause, rewritten in this refresh).** "Each held packet goes in the slot at its distance from the expected message id, around a ring sized to a power of two [recvwinSlot]" restates what diagram efa-d31 shows directly below it (slots labelled next, +1, +2), and the power-of-two constraint the reader needs is already in the expandable (L1114). The paragraph then reads: "...that do not fit the current window [robuf]. Out-of-order arrivals are copied out of the pre-posted receive buffers into a separate bounce-buffer pool. That copy is on in a default build..."

Noted outside the refresh diff (not candidates under this brief): the PFC deadlock Alert (L930-939) and the driver-accessor half of the closing Alert (L1290-1300) are the next demotion targets for a leverage pass.

### Backlog (enhancements, not corrections)

- Name the observable for "arrivals spilling to `overflow_pke_list`" (L1137-1138): the Alert's evidence for a deeper window has no counter, log line or command attached.
- A citation for "ENA Express is configured on the network interface attachment through the EC2 control plane" (L1296-1297), likely the ENA Express user-guide page already in `docs`.
- Citations for "the card is what performs it" (L993) and "The application never blocks for it" (L1004).

---

## 3. EfaDevice.tsx (The EFA Device: Attachment Modes, Network Cards and Rails)

### Gate 3 score: 8 / 10

- Opens on the reader's confusion and resolves it with a model: "Four different numbers get called the same thing... they are separate layers with separate owners" (L402-407), carried by the counting-layers diagram, and the strongest number ("a p5.48xlarge reports 32, 33, 32") lands three times (L404, L508, L536-539). The P6-B300 expandable (L607-634) runs the model on a second instance type and gives a check ("16 times 400 Gbps is exactly the 6,400 Gbps figure").
- Practical value is dense: size a Kubernetes resource claim from the device count (L537-539), read registration limits with `ibv_devinfo` (L689-690), compare `modinfo` against the installer changelog (L763-767), scope the group rather than the rule (L870-876), and the section ends on the Capacity Reservation action (L919-922).
- Rail internals are correctly demoted into an ExpandableSection, and inference is labelled as ours where it appears (L596-602, L697-698, L893-895).
- Held to 8 by one unsupported derivation in the attachment guidance (L462-464), two unexpanded acronyms in headers, a widened hedge (L891-893), and table-plus-prose duplication in "What the host owes the device".

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 5 | 5 | 4 | 4 | 4 |

- Accuracy 4: "It is also the right answer on any single-card instance type. If the instance has one network card, the EFA device has to live on the primary interface" (L462-464) carries no citation and does not follow from the two cited rules (one EFA per instance on single-card types; EFA-only cannot be primary). The section's own P5 example puts an EFA-only interface on card 0 at device index 1 (L533). The EC2 User Guide page `efa.html`, fetched for this audit on 2026-10-23, has no statement tying EFA-only interfaces to multi-card instance types. This is not shown wrong [SPECULATIVE that it is wrong], but nothing on the page supports it.
- Rigor 4: the uncited superlative at L866-868 and the widened hedge at L891-893 (both in Corrections).
- Economy 4: the host-requirements table's "What actually happens" column (L374-382) says what the two h3 blocks below it (L665-699) say again.

### Corrections

1. **L487, Alert header: niche acronym before its expansion.** "ENI" is first read in the header; the body expands it at L488, and no earlier section expands it.
   Replace with `header="Both flavours still consume an ENI (Elastic Network Interface) attachment slot"` and change the body's "the ENI (Elastic Network Interface) attachment limit" to "the ENI attachment limit".
2. **L585, Alert header: acronym expanded only inside a collapsed disclosure.** "PCIe" is expanded at L553-554 inside the closed "What a rail actually is" ExpandableSection, so a reader who does not open it meets "PCIe" bare here.
   Replace with `header="AWS documents four EFA devices sharing a PCIe (Peripheral Component Interconnect Express) root with one GPU. The eight groups of four are our arithmetic."`
3. **L462-464: claim not traceable to a source (CLAUDE.md "Every claim citable").** See the accuracy note above.
   Replace the paragraph with: "On a single-card instance type the instance supports only one EFA [efa], so this choice is made once for the whole instance." (Keeps only documented facts; restore the stronger guidance only with a source that bears it.)
4. **L803: universal claim from a local search.** "So the widely repeated equivalence between 0xefa4 and EFA v4 is unsourced inference."
   Replace with: "So equating 0xefa4 with EFA v4 is unsourced inference."
5. **L866-868: uncited superlative stated as fact.** "A missing self-reference is the single most common reason a freshly built cluster launches cleanly and then hangs at the first collective."
   Replace with: "A missing self-reference lets a freshly built cluster launch cleanly and then hang at the first collective."
6. **L882-885: attribution narration.** "The same page adds a distinction worth keeping: those limits apply to traffic through the EFA device..."
   Replace with: "Those limits apply to traffic through the EFA device, and do not apply to normal IP traffic from the ENA device of an EFA interface [efa]."
7. **L891-893: hedge scope widened.** The evidence is two pages (efa.html's limits list and the multi-card launch examples), but the sentence says "is not prohibited by anything AWS publishes".
   Replace with: "is not prohibited by anything on those two pages".
8. **L627 (P6-B300 expandable): attribution narration.** "One more caution on the same page: since EFA and ENA traffic share..."
   Replace with: "One more caution: since EFA and ENA traffic share the same underlying resources, bandwidth used by one will reduce the bandwidth that is available to the other [efaAcc]."
9. **L701-702 (changed in this refresh): attribution narration.** "Driver r3.3.0 moved this ceiling: its release notes list adding driver support for memory region page sizes above 4 GB [releaseNotes]."
   Replace with: "Driver r3.3.0 moved this ceiling, adding support for memory region page sizes above 4 GB [releaseNotes]."
10. **L792 and L798-800: hedge scope widened.** The Alert header says "no AWS source maps one to the other" and the body says "no AWS source and no line of driver source maps a device id to an EFA version number at all". The research can support only what it located; the same question in EnaVsEfa.tsx (L1043) is scoped correctly ("No source in the repository states that mapping").
    Replace the header with `header="Five PCI device ids against four EFA versions, and no source located maps one to the other"`, and the body clause with: "and no AWS source located during this research, and no line of the driver source at the pinned commit, maps a device id to an EFA version number."

### Leverage candidates (blocks changed in this refresh)

1. **Re-express, L700-706 (r3.3.0 paragraph, changed).** The refresh added "Installer 1.50.0 was the first to ship driver 3.3.0" but left the reader to work out what that means for their host.
   Proposed (with correction 9 applied): "Driver r3.3.0 moved this ceiling, adding support for memory region page sizes above 4 GB [releaseNotes], and installer 1.50.0 was the first to ship it [changelog], so a host installed from 1.50.0 or later has it. The next section shows how to tell which driver a host runs."
2. **Re-express, L803-808 (0xefa4 paragraph, changed).** "What you can say is narrower and still useful" claims usefulness and then does not say what to do with it.
   Proposed: "What you can say is narrower: 0xefa4 was added in driver r3.3.0 alongside 800 and 1600 Gbps link-speed reporting [releaseNotes], and installer 1.50.0 was the first to ship that driver [changelog], so a driver from an older installer does not carry the 0xefa4 id."
3. **Delete, L745-748 (repository column, rewritten in this refresh).** Of the four r3.4.0 release-note items, three ("improve contiguous memory allocation for receive and completion queues, and fix an admin-queue race and an initialisation-order bug") change nothing a reader does, and the one that matters, PCIe relaxed ordering, is repeated in the Alert directly below (L755-756).
   Proposed column text: "The amzn-drivers tree carries driver r3.4.0, with the package version recorded in the DKMS (Dynamic Kernel Module Support) configuration [dkms]."
4. **Re-express, L730-731 (installer column, changed).** The Debian 11 fact is a decision for one group of readers, written as a description.
   Proposed: "On Debian 11, stay on installer 1.50.0, the last release to support it; 1.51.0 refuses to run there [installer]."
5. **Delete a column, L659 with rows L370-385 (host-requirements table; the huge-pages row changed in this refresh).** The "What actually happens" column says what the Huge pages and Memory registration limits blocks below it say again (5128 pages, `max_mr` / `page_size_cap`). The "How it shows up when it is short" column carries the only content the prose lacks.
   Proposed: keep the table as two columns, Resource and "How it shows up when it is short".

### Backlog (enhancements, not corrections)

- A source for the single-card attachment guidance, or a documented statement of whether an EFA-only secondary interface is allowed on a single-card instance type.
- The command that reads the PCIe topology on a running instance (L601-602 tells the reader to read the grouping off the instance but gives no command).
- A source for the security-group failure signature (the provider help text quoted in SrdProtocol.tsx L802-805 is a candidate).

---

## 4. Libfabric.tsx (libfabric and the EFA Provider)

### Gate 3 score: 7 / 10

- The model is real and stated forward: two fabrics on one device, selected by one field ("That is the whole switch", L553), a size ladder that collapses to two protocols on accelerator memory (diagram plus the success Alert at L876-884), and the composition of NCCL buffer, scheduler stripe and ladder (L848-874), which lets a reader predict what a striped GPU send hits.
- Practical value is the highest in the batch: six numbered `fi_info` / logging commands each with what a null result means (L609-634), three greps against `ofi_*.log` with severity attached (L980-994), three abort strings that name a dead job's cause (L1033-1041), a 12-row tunables table with badges, and a closing Alert that ends on "the ones to grep an old launch script for" (L1221-1228).
- Held to 7 by the refresh itself: prose grew +184 words, most of it in the GPUDirect Async paragraph (L739-775), now a single 37-line paragraph whose plugin-author internals (`FI_EFA_MODIFY_EP_OPS`, `ncclGinPlugin_v14`, device type 5, build conditions) bury the three operator facts (instance gate, `NCCL_GIN_TYPE=5`, setup-guide variables). Rule 7 (demote supporting evidence) and rule 13 (word count that grows) both apply. Five attribution narrations and three universal claims also remain.

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 4 | 5 | 4 | 5 | 2 |

- Rigor 4: "The ofiwg project has released v2.7.0" (L1062-1064) is still cited to `code.man`, the whole `man/fi_efa.7.md` at the tag, which can show the tag exists but not a release (the 2026-08-05 after-review raised the same point at v2.6.0). Three universal claims with no search behind them (Corrections 9 and 10).
- Accuracy 5: nothing load-bearing found wrong. The NIXL and NCCL/MPI libfabric minimums (L1130-1132) match the EC2 User Guide `efa.html` fetched for this audit on 2026-10-23. One diagram-label imprecision: "Open MPI, Intel MPI ... through the OFI MTL and BTL" (L144) names Open MPI component types for Intel MPI too; Correction 1 removes it.
- Economy 2: besides the GPUDirect Async paragraph, the three-pass `fi_info` construction (L573-583, "96 on a 32-device instance") and the "Two more version-scoped behaviours" expandable (L1111-1138) carry material the 2026-08-05 after-review already marked as cuttable.

### Corrections

1. **L143-144, stack diagram labels: niche acronyms never expanded.** "RCCL", "MTL" and "BTL" appear only here.
   Replace `{ title: 'NCCL and RCCL', ...}` with `{ title: 'NCCL', ...}`, and `sub: 'through the OFI MTL and BTL'` with `sub: 'through their OFI transport layers'` (this also stops attributing Open MPI component types to Intel MPI).
2. **L792 (changed in this refresh): acronym unexpanded at its first visible use.** The only expansion of ROCr is inside the SVG `<title>` (L307), which is not rendered as visible text.
   Replace "host, CUDA, ROCr or Neuron" with "host, CUDA, ROCr (the AMD ROCm runtime) or Neuron".
3. **L535, h2 description restates the topic.** "One device, two fabrics, three consumers, and a provider chosen at runtime from a list."
   Replace with: `description="Which of the two fabrics your job runs on, and the one field that switches between them."` (traces to L552-553).
4. **L545: attribution narration.** "libfabric's own EFA man page frames the split."
   Delete the sentence; the paragraph opens "The efa fabric implements a set of wire protocols to support more capabilities and features beyond the EFA device capabilities." with the `manOverview` citation unchanged.
5. **L799-802: attribution narration.** "The selection function's own comment names the options: four types of protocol can be used..."
   Replace with: "Four types of protocol can be used, eager, medium, longcts and longread, each with a tagged and non-tagged version and some with a delivery-complete version [selectRtm]."
6. **L959: attribution narration.** "The EFA provider carries a long comment about why this is delicate."
   Delete the sentence; the paragraph opens "Both Open MPI and libfabric use the same live binary patching..."
7. **L1007: attribution narration.** "Turning it on has a cost the code states plainly:"
   Replace with: "Turning it on has a cost:"
8. **L1130-1133: attribution narration.** "NIXL, the newest consumer of all this, is documented as integrating with Libfabric 1.21.0 and later"
   Replace with: "NIXL, the newest consumer of all this, integrates with Libfabric 1.21.0 and later, where NCCL and MPI integrate with 1.7.0 and later [efa], on its own getting-started path [nixl]."
9. **L882-883: universal superlative with no search behind it.** "the most commonly copied EFA setting that does nothing"
   Replace the sentence with: "That is why FI_EFA_INTER_MAX_MEDIUM_MESSAGE_SIZE does nothing for a GPU job, and FI_EFA_RUNT_SIZE is the one that shapes the path."
10. **L1103-1105: two universal claims.** "appear in a great deal of EFA material and libfabric today has none of them, so a citation to one of those names is a citation to a tree nobody is running"
    Replace with: "Symbols such as rxr_pkt_post_ctrl appear in older EFA material, and libfabric v2.7.0 has none of them, so a citation to one of those names is a citation to a tree older than the rename."
11. **L1121-1122: a sentence correcting a misreading the page never invited.** "Note the scope in that sentence: on the data path, not everywhere."
    Delete it.

Checked and not counted: "used to live under an rxr_ prefix. It now sits..." (L1099-1100) is code history that powers the dating check, not page history.

### Leverage candidates (blocks changed in this refresh)

1. **Reorder and demote, L739-775 (GPUDirect Async paragraph, rewritten and roughly tripled in this refresh).** The page itself says the table calls are "work for whoever writes the plugin" (L750-751); the operator facts arrive in the last eight lines. Keep the operator part in the flow and move the internals into an ExpandableSection.
   Proposed main-flow text (every clause from L739-774): "What you get back for that work, beyond the shorter path, is GPUDirect Async: GPU-side code builds and rings the work queue entries itself [manGda]. On aws-ofi-nccl v1.22.0 the instance type is the gate and NCCL_GIN_TYPE=5 is the switch. The plugin's kernel-initiated GIN (GPU-Initiated Networking) backend is allowed only on p5en, p6-b200 and p6-b300 and refuses elsewhere with "gin GDAKI: not supported on this platform" [platformEnv] [gdakiGate] [gdakiRefuse], and NCCL ranks it below its own GIN proxy, so a job runs it only when NCCL_GIN_TYPE=5 selects it [ncclGinPriority] [ncclGinType]. The plugin's setup guide also asks for NCCL_SYM_GIN_KERNELS_ENABLE=0 and the NVIDIA driver's PeerMappingOverride option [ginGuide]."
   Proposed ExpandableSection, headerText "How the plugin builds and exposes it": the FI_EFA_GDA_OPS handover and its not-supported error on other fabrics, the build conditions, the `ncclGinPlugin_v14` / device type 5 export, and `OFI_NCCL_GDAKI_EFA_HW_COUNTER` as a bring-up override, all with their existing citations.
2. **Delete, L746-750 (FI_EFA_MODIFY_EP_OPS sentence, added in this refresh).** "The same open with FI_EFA_MODIFY_EP_OPS returns a call that changes an enabled endpoint's queue key, the only attribute it supports" gives no reader anything to decide or check; it is plugin-author API surface. If candidate 1 is taken, it goes into the expandable instead of being deleted.
3. **Re-express, L642-651 (Alert additions in this refresh).** "That function also read FI_EFA_ENABLE_HIGH_PPS" has no antecedent: no function is named in the visible text. The HIGH_PPS fact is the practical one (an environment variable that stops being read), and it is currently the hardest clause to parse.
   Proposed: "Two more never appear in it, because the provider reads them straight from the environment: FI_EFA_USE_HW_CNTR, which lets efa-direct counters use the device's hardware completion counters, with a software counter as the fallback [cntrOpen] [hwCntrGate], and FI_EFA_USE_SQ_REQ_ID_64_BIT, both 1 by default in libfabric 2.7.0 [envDefaults] [envUnregistered]. In 2.6.0 the same environment reader also took FI_EFA_ENABLE_HIGH_PPS [envHighPps]; 2.7.0 drops it."
4. **Re-express as guidance, L721-732 (FI_CONTEXT2, added in this refresh).** The fact is framed as a documentation conflict; the reader's moment is writing hints.
   Proposed: "Ask for FI_CONTEXT2 in your hints if you want inject or FI_EFA_TRACK_MR. From libfabric 2.7.0 it is optional, although the man page lists it as required, and without it the endpoint leaves your context buffer alone and disables inject [conflict] [context2Info], and FI_EFA_TRACK_MR refuses to enable the endpoint [trackMrContext2]." (The "advertises it only when the hints ask for it" basis is already in the conflict text at L727.)
5. **Re-express, L1062-1064 (upstream sentence, changed in this refresh).** "The ofiwg project has released v2.7.0" is cited to a man page that cannot bear a release claim, and the reader needs only the pin.
   Proposed: "The libfabric citations in this section are pinned to upstream v2.7.0, apart from one that shows 2.6.0 behaviour. That is the tree to read when you want to know what the EFA provider does." (Drops the `code.man` citation from this sentence; weakens, adds nothing.)

### Backlog (enhancements, not corrections)

- The EC2 User Guide `efa.html` (cited at L514, accessed 2026-08-01) now also lists the Expert Parallelism (EP) library and DeepEP among supported libraries (fetched 2026-10-23); the L511-514 sentence reproduces the older list.
- A source-backed statement of whether RCCL reaches EFA through aws-ofi-nccl, if the stack diagram should name it again.
- A command or log line that shows which GIN backend a running NCCL job selected.

---

## 5. EnaVsEfa.tsx (ENA and EFA: Two Devices, One Nitro Card)

### Gate 3 score: 7 / 10

- Three strong models, each drawn: two PCI devices behind one attachment (diagram 1 plus the device-ID table and "lspci with numeric IDs" as the check, L475-476), "who holds the pen" (same write-combined BAR 2, different writer, L567-625), and SRD below both devices as a shared substrate (L668-691).
- Practical value is good and mostly typeable: the `ethtool -S eth0 | grep ena_srd` block with the tx-versus-eligible ratio (L877-888), MTU 8900 or lower with the reason UDP needs it set by hand (L825-844), the large-LLQ versus deep-ring trade (L846-856), and a closing paragraph that ends on the decision rule ("Start from the programming model", L1157-1161).
- Held to 7 by rigor and accuracy, not shape. Several absence findings are written as facts about the world, one of them cited to the getter it searched from, which is the exact failure the leverage-pass standard records ("no matching set function anywhere in the tree, cited to the getter itself"). "The whole of the in-instance view of SRD" (L689-690) is wrong for the EFA device, whose own five SRD counters SrdProtocol.tsx documents. A niche acronym in an Alert header is unexpanded.
- The refresh barely touched this section (+3 words: a diagram label, a ladder note, the NIC expansion, one rewritten sentence).

### Leverage axes (BEFORE)

| Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|
| 5 | 4 | 3 | 4 | 3 |

- Rigor 3: absence claims stated as universals (L389, L685-690, L802, L1052, L1060); an inference presented as AWS's reason (L970-972); comparative latency and CPU claims in the closing columns (L1135-1141) rest on design reasoning with no citation.
- Accuracy 4: "That is why the ethtool counters later in this section are the whole of the in-instance view of SRD" (L689-690) is contradicted by the EFA device's own counters (`retrans_pkts`, `retrans_timeout_events` and three more, SrdProtocol.tsx L822-833). "The ENA driver's entire knowledge of SRD is a read-only statistics structure... holding four counters" (L685-687) is contradicted on the same page by the configuration bitmap the driver reads back (L811-813, L873-875). "SRD adds per-packet work" (L972) sits against "plus SRD work done in the card" (L1117-1118).
- Economy 3: the ENA Express material (median-latency cost, three configuration bits, enablement outside the instance, single-flow 5/10/25 Gbps) is also carried, near-verbatim in places, by SrdProtocol.tsx L1258-1311; the five-IDs-versus-four-generations question repeats EfaDevice.tsx L792-811.

### Corrections

1. **L746, Alert header: niche acronym (on the CLAUDE.md list) before its expansion.** "GRO" is expanded only in the body (L747-748).
   Replace with `header="Receive aggregation is GRO (Generic Receive Offload), done in software"` and change the body's "the Linux stack entry point for GRO (Generic Receive Offload)" to "the Linux stack entry point for GRO".
2. **L741: niche acronym unexpanded.** "an eBPF hook" -> "an eBPF (extended Berkeley Packet Filter) hook".
3. **L912: niche acronym unexpanded.** "for protocols such as GRE or IPsec" -> "for protocols such as GRE (Generic Routing Encapsulation) or IPsec".
4. **L535 (evidence expandable): niche acronym unexpanded.** "for Linux, FreeBSD and DPDK" -> "for Linux, FreeBSD and DPDK (Data Plane Development Kit)".
5. **L697, h2 description restates the topic.** "The baseline the other two are measured against: queue model, interrupt layout, offload list." lists contents.
   Replace with: `description="Why one flow lands on one core, and where receive aggregation spends host CPU."` (traces to L739-740, L753 and L954-955).
6. **L782-789, Alert: attribution narration in header and body.** "The same AWS guide documents a median latency cost" / "In the same guide:" / "AWS follows it with a note that..."
   Replace with `header="ENA Express costs tens of microseconds of median latency at idle"` and body: "When network traffic is light, packets that use ENA Express can show a slight increase in median packet latency, tens of microseconds [enaExpress]. Applications with high packets-per-second requirements that need to optimize for latency during uncongested periods may be better served by plain enhanced networking. SRD is a congestion play, and it costs tens of microseconds at idle."
7. **L685-690: universal absence claim cited to a struct, and an inaccurate scope.** Replace from "And the ENA driver's entire knowledge" to the end of the paragraph with: "And what the ENA driver carries for SRD is read-only: a statistics structure holding four counters [srdStats] and a configuration bitmap it reads back [srdFlags]. No retransmission, reliability, congestion-control or reordering code for SRD was found in either driver during this research, which is consistent with all of it living below the PCI boundary, in the card. That is why the ethtool counters later in this section are the whole of the ENA driver's view of SRD."
8. **L389, diagram efa-substrate label: universal absence.** "Neither kernel driver contains any SRD implementation" -> "No SRD implementation was found in either kernel driver" (52 characters at 11px in a 760-wide box).
9. **L796-805: universal absence, and an inference stated as fact.** "and the tree carries no ena_com_set_ena_srd counterpart. Reading is the whole of the driver's access." and "Any in-instance command you find for ENA Express is tuning: MTU (Maximum Transmission Unit), queue sizes, byte queue limits."
   Replace with: "and no ena_com_set_ena_srd counterpart was found in the tree during this research. The driver access located is read-only." and "Our reading: an in-instance command for ENA Express is tuning, such as MTU (Maximum Transmission Unit), queue sizes and byte queue limits."
10. **L1052 and L1059-1061: absence cited to the getter (the leverage-pass standard's named failure).** headerDescription "The drivers have no set path, so an API experiment is what settles it" and body "is visible nowhere in the drivers, because the drivers have no SET path at all [srdGet]".
    Replace with `headerDescription="No set path was found in the drivers, so an API experiment is what settles it"` and body: "is not visible in the drivers: the SRD accessor located is a getter [srdGet], and no SET path was found during this research".
11. **L750-753: universal claims from a local search.** "Secondary write-ups routinely credit ENA with hardware LRO" and "the tree carries no NETIF_F_LRO feature bit and no hardware coalescing path".
    Replace with "Some secondary write-ups credit ENA with hardware LRO" and "and no NETIF_F_LRO feature bit or hardware coalescing path was found in the tree".
12. **L967-974: inference presented as AWS's reasoning, and in tension with L1117-1118.** "This is exactly why AWS warns that high packets-per-second workloads may prefer plain enhanced networking [enaExpress]: SRD adds per-packet work without removing the single-queue bottleneck."
    Replace with: "Our reading is that this is why AWS warns that high packets-per-second workloads may prefer plain enhanced networking [enaExpress]: SRD leaves the single-queue bottleneck in place."

### Leverage candidates (blocks changed in this refresh)

1. **Delete a clause, L1026-1028 (rewritten in this refresh).** "and the driver cannot settle which one AWS means, because it only reads counters [srdGet]" answers a question no reader asked (a driver was never going to settle a documentation scope) and leans on the getter citation again.
   Proposed: "The two pages give different scopes. If you are sizing on the 25 Gbps figure across Availability Zones, confirm it before you build on it."
2. **Re-express, L440 (ladder note, changed).** "Two AWS pages give different scopes, see below" sends the reader two containers down for the part they can act on. Same-Availability-Zone traffic falls inside both stated scopes (one page says same Availability Zone, the other same Region).
   Proposed: `note: 'Capped by the aggregate instance limit. Both AWS pages cover one Availability Zone; across zones, see below.'`

No other block in this section changed in the refresh beyond acronym and label wording, so no further candidates are listed under this brief.

### Backlog (enhancements, not corrections)

- The "Enable it from the control plane" column (L794-806) names no API call or CLI command for enabling ENA Express.
- A citation for the EFA latency and CPU comparisons in "Choosing between them" (L1135-1141); `efa.html` states "lower and more consistent latency" for EFA.
- Diagram 1 labels every EFA function `1d0f:efa4`; the table lists five IDs.
- Decide which section owns the ENA Express material now carried both here and in SrdProtocol.tsx L1258-1311.

---

## Summary

| Section | Gate 3 score | Mental model | Practical leverage | Rigor | Accuracy | Economy | Corrections | Leverage candidates |
|---|---|---|---|---|---|---|---|---|
| DataPath.tsx | 8 | 5 | 3 | 4 | 5 | 4 | 6 | 4 |
| SrdProtocol.tsx | 7 | 5 | 4 | 4 | 5 | 3 | 9 | 4 |
| EfaDevice.tsx | 8 | 5 | 5 | 4 | 4 | 4 | 10 | 5 |
| Libfabric.tsx | 7 | 4 | 5 | 4 | 5 | 2 | 11 | 5 |
| EnaVsEfa.tsx | 7 | 5 | 4 | 3 | 4 | 3 | 12 | 2 |

Batch A: no section below 7; the batch average is 7.4, below the Gate 3 average bar of 8 if that bar is applied to this batch alone. Every correction above is mechanical (acronym, attribution, hedge scope, negation, description) except two accuracy items that need a decision: EfaDevice L462-464 (single-card attachment guidance with no source) and EnaVsEfa L685-690 ("the whole of the in-instance view of SRD", contradicted by the EFA counters).

Cross-section patterns worth one pass rather than five:
- Absence-from-search written as absence-in-the-world: SrdProtocol L1298, EfaDevice L798-800 and L891-893, Libfabric L1104, EnaVsEfa L389, L685-690, L802, L1052, L1060.
- Attribution narration ("AWS states", "the code states plainly", "the man page frames"): SrdProtocol 4, EfaDevice 3, Libfabric 5, EnaVsEfa 1.
- The ENA Express material is duplicated between SrdProtocol and EnaVsEfa.

Source note: one external fetch was made, the EC2 User Guide page https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html on 2026-10-23 [AUTHORITATIVE], with no personal data in the request. It was used for the EfaDevice single-card check and the Libfabric supported-library list. Everything else in this report is read from the section files and `git diff b39b4d3 HEAD`.

STATUS: COMPLETE
