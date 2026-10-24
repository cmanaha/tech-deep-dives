# Gate 3 corrections and leverage pass, batch A (October 2026 EFA refresh)

STATUS: see last line

Input: `gate3-A.md` (Gate 3 scorer, batch A). Sections: DataPath, SrdProtocol, EfaDevice, Libfabric, EnaVsEfa.
Baseline for "changed in this refresh": `git diff b39b4d3 HEAD`.
Word counts are approximate prose words (JSX text outside tags, attributes and code), measured with the same script before and after.

## 1. DataPath.tsx

### Corrections

| # | Status | Note |
|---|---|---|
| 1 | Applied | efa-d04 step 2 title `Write to the SQ` -> `Write send queue`. Width estimate at 13px bold (Helvetica Bold metrics): about 108 px in the 128 px box. |
| 2 | Applied | efa-d04 step 3 sub `one MMIO write` -> `one mapped write`. |
| 3 | Applied | Design-note Alert body: "The driver beside it is the primary source, and the code wins". |
| 4 | Applied | Verbs-objects intro opens on "This table is the vocabulary...". |
| 5 | Applied | Data Path Direct gates: "and both are properties of the host". |
| 6 | Applied | GPUDirect RDMA h2 description: "Which RDMA operations your instance type has, and what decides whether payloads leave GPU memory". |

### Leverage edits (all on blocks changed in this refresh)

| Verb | Block (current lines, approx.) | Reason |
|---|---|---|
| Re-express | "Kernel, once per resource" column, L531-536 | The refreshed lifetime paragraph above it already lists the setup objects (and expands their acronyms for the diagram). The column now says "Every setup step listed above, plus creating the completion queue, is a real transition into the kernel [controlOps]". One list read once instead of three times. |
| Re-express | Data Path Direct gates, last sentence | "a change to either one is the moment to re-check it" names the reader's moment, from the existing "it changes when either of those changes". |
| Re-express | GPUDirect RDMA paragraph, p2pAlign clause | Trailing participle turned into its own instruction: "On that path, register GPU buffers so the buffer address and the registered virtual address sit at the same offset within the peer-to-peer page size; the driver fails the registration otherwise [p2pAlign]". "On that path" keeps the scope on the peer-to-peer route and off the dma-buf route that follows. |
| Reorder | Closing GDRCopy Alert, last sentence | Reassurance first, action last: "A build without GDRCopy still sends straight from GPU memory: peer-to-peer support is what decides whether payloads leave GPU memory, so that is the one to confirm on a new instance." The section ends on the action. |

### Claim-set self-check (assertions in the after that are not in the before)

- "both are properties of the host": re-expression of "neither is a switch you throw"; the two gates it covers (device generation, installed rdma-core) are in the same paragraph with [subCq] [ddpOff] [cqWaitObj].
- "a change to either one is the moment to re-check it": re-expression of "it changes when either of those changes", same paragraph.
- "The driver beside it is the primary source": from "It sits next to the driver that contradicts it" in the same Alert, with the existing doc-code-conflict citation on [deviceCaps].
- "register GPU buffers so ... sit at the same offset": the same condition the before stated as "failing the registration when ... sit at different offsets", same [p2pAlign] citation.
- h2 description: traces to the RDMA operations Alert ("instance type is the thing to check") and the closing Alert ("what decides whether payloads leave GPU memory").
- No new facts, numbers or citations.

### Diagram text changed

- efa-d04 (`PostSendDoorbellSequence`), step 2 title: `Write to the SQ` -> `Write send queue`.
- efa-d04, step 3 sub: `one MMIO write` -> `one mapped write`.
Geometry unchanged. Screenshot efa-d04 to confirm step 2 title fits its 128 px box.

### Length

Prose words (same script before and after): 2070 -> 2061 (-9). The new h2 description is in an attribute and not counted; the column cut is about 25 words.

### Scores

| | Mental model | Practical leverage | Rigor | Accuracy | Economy | Gate 3 |
|---|---|---|---|---|---|---|
| Before (scorer) | 5 | 3 | 4 | 5 | 4 | 8 |
| After | 5 | 3 | 4 | 5 | 5 | 9 |

Practical stays 3: two more actions are stated as actions (alignment, re-check moment), but the closing action still has no typeable command (backlog). Rigor stays 4: the uncited inline-payload and UARN-enforcement sentences need sources this pass cannot add. Every defect the scorer named as holding the section below 9 is resolved.

Checks: typecheck, lint, no-ai-tells, svg-a11y, pinned-refs, pre-overflow all PASS.

## 2. SrdProtocol.tsx

### Corrections

| # | Status | Note |
|---|---|---|
| 1 | Applied | Triage table RNR row: "Occasional RNR (Receiver Not Ready) under load...". |
| 2 | Applied | Storage sentence: "On the storage side, SRD is implemented in the AWS custom Nitro networking card to minimize jitter ..., including for EBS (Elastic Block Store) io2 Block Express [storageBlog] [ebsIops]". |
| 3 | Applied | "Ordering is the other half of the same point: fabrics like InfiniBand..." |
| 4 | Applied, narrowed | The scorer's "SRD takes the opposite route from" strengthens the source's "differs from". Applied as "SRD differs from TCP, InfiniBand and RoCE: instead of preserving packet order it sends packets over as many network paths as possible while avoiding overloaded paths, and leaves message order restoration to the upper layer, because ... [storageBlog]". |
| 5 | Applied, citation added | Latency-tax column re-expressed as given. Deleting "AWS adds that" left the "may be better served" sentence with no provenance, so the same [enaExpress] citation is attached to it as well (rule 4 of the attribution standard: the attribution was the only provenance marker on that sentence). |
| 6 | Applied | "Relaxing ordering is what AWS credits for dropping p99 tail latency by around a factor of ten [hpcBlog]". |
| 7 | Applied | "The commonly quoted version is that a cluster needs...". |
| 8 | Superseded | The sentences it corrects ("the driver only observes the result", "Any guide showing an in-instance command...") are deleted by the ENA Express de-duplication below. The same point survives in EnaVsEfa's "Enable it from the control plane" column, with the scorer's EnaVsEfa correction 9 hedge ("was found ... during this research", "Our reading:"). |
| 9 | Applied | Header "This block is model: why peer count stops being a resource question". |

### Leverage edits

| Verb | Block | Reason |
|---|---|---|
| Reorder | Expandable "Documentation contradicts the code...", third paragraph (changed in the refresh) | The reader who opens the disclosure wants the default for their version. Lead changed to "Which default your version has." and the paragraph opens "On libfabric 2.4.0 the default is 8192, and from 2.5.0 onward it is 16. The 16384 in the help text was the default before two tuning commits, and neither touched the help string." The two commit sentences follow unchanged; the closing "So libfabric 2.4.0 defaults to 8192 and 2.5.0 onward to 16." is deleted (moved to the front). |
| Re-express | "Grep your launch scripts" Alert (changed) | "Unset is the supported answer on libfabric 2.7.0" implied a support statement no source carries. Now "Leave it unset on libfabric 2.5.0 and later, where the default is 16." The version range is the expandable's existing "2.5.0 onward" fact (commit bd987ab2, first released in v2.5.0, in the conflict note); the advice is the same advice with the support claim dropped. |
| Re-express | Expandable, second paragraph (changed) | "which is a useful reminder that a help string is documentation, not behaviour" -> ": the help string is documentation, and the initialiser is the behaviour". Filler and negation out. |
| Delete | Reorder-buffer paragraph, slot clause (rewritten in the refresh) | "Each held packet goes in the slot at its distance from the expected message id, around a ring sized to a power of two [recvwinSlot]" restates efa-d31 directly below (slots labelled next, +1, +2 with ids at their distance); the power-of-two constraint is in the expandable with [recvwinAlloc]. |
| Delete | "What SRD costs you", middle-option paragraph: the 25 Gbps / Region / Availability Zone sentence and the scope note | ENA Express de-duplication. EnaVsEfa owns ENA Express (it has the ENA Express container, the single-flow ladder, and the open question that carries the same Region-versus-Availability-Zone scope split from the same two pages). SrdProtocol keeps the part that serves its own argument: ENA Express puts sockets traffic on SRD and pays the median tax; EFA pays in programming model; the "no equivalent figure for the EFA path was located" hedge; the choice rule. "worth knowing about" also deleted. |
| Delete + re-express | Closing Alert, "ENA Express is switched on outside the instance" | ENA Express de-duplication. Deleted: the driver-accessor paragraph ([enaSrdDecl] [enaSrdGet], the set-function search, the tuning-versus-enablement inference) and the first two bit names; EnaVsEfa's "Enable it from the control plane" and "Three configuration bits" columns carry the same evidence. Kept, because it is this section's trade: the UDP ordering bypass bit with [enaSrdFlags] and the closing action. Added a pointer by name: "The ENA and EFA section covers how to enable it, the MTU it needs and the counters that confirm it is carrying traffic." Header re-expressed from the body's own clause: "ENA Express offers this section's trade as a per-attachment switch". The section still ends on "Turn the bypass on only for a receiver written to tolerate reordering." |

Code citations no longer used in this section, removed from its `code` object: `enaSrdGet`, `enaSrdDecl`, `recvwinSlot`. The orchestrator may want to reconcile `sources.md` / Sources.tsx if they list these against SrdProtocol. `enaSrdDecl` and `recvwinSlot` are no longer cited anywhere in the five sections; EnaVsEfa cites the same getter as `srdGet`.

Not touched (outside the refresh diff and not part of the ENA Express duplication): the InfiniBand/RoCEv2 restatements (only their attribution was corrected), the PFC deadlock Alert, the ENA Express counter sentence in "The five counters" (it serves this section's monitoring argument and labels its interpretation as ours).

### Claim-set self-check (assertions in the after that are not in the before)

- "including for EBS io2 Block Express": from "the EBS documentation repeats it for io2 Block Express [ebsIops]".
- "Ordering is the other half of the same point": re-expression of "AWS makes the ordering half of the same point from the other side"; [hpcBlog] unchanged.
- "SRD differs from TCP, InfiniBand and RoCE: instead of ...": the before's sentence minus the attribution; [storageBlog] unchanged.
- "packets that use ENA Express can show a slight increase ...": the before's "you might notice a slight increase ... when the packet uses ENA Express"; [enaExpress]. Second [enaExpress] on the "may be better served" sentence: same page the before attributed it to ("AWS adds that").
- "what AWS credits for": attribution restored to a tier-2 vendor claim; weakens.
- "commonly quoted": weakens "repeated everywhere".
- "why peer count stops being a resource question": from the Alert body.
- "On libfabric 2.4.0 the default is 8192, and from 2.5.0 onward it is 16": moved from the paragraph's last sentence.
- "Leave it unset on libfabric 2.5.0 and later, where the default is 16": see the leverage table; the fact is on the page, the advice is the before's advice.
- "the help string is documentation, and the initialiser is the behaviour": re-expression; [envRecvwin] [envRecvwinHelp] unchanged.
- "An ENA Express attachment carries three configuration bits, and the third ... decides ...": from "What the attachment carries is three bits ... [enaSrdFlags]. The third decides ...".
- "The ENA and EFA section covers how to enable it, the MTU it needs and the counters ...": navigation pointer; the content is in EnaVsEfa's ENA Express container.
- "ENA Express is the middle option. It puts ordinary TCP and UDP traffic onto SRD without any application change [enaExpress]: you keep sockets and pay the uncongested median tax": all from the before.
- No new facts, numbers or sources.

### Diagram text changed

None.

### Length

Prose words: 3285 -> 3108 (-177). The section grew 51 words in the refresh; it is now 126 below its pre-refresh count (3234).

### Scores

| | Mental model | Practical leverage | Rigor | Accuracy | Economy | Gate 3 |
|---|---|---|---|---|---|---|
| Before (scorer) | 5 | 4 | 4 | 5 | 3 | 7 |
| After | 5 | 5 | 4 | 5 | 4 | 8 |

Practical 5: the reader's version answer leads the disclosure and the Alert now says which versions to leave unset, on top of the triage table, counter shapes and info-logging block. Rigor stays 4: "the card is what performs it" and "The application never blocks for it either" remain uncited (backlog). Economy 4, not 5: the InfiniBand/RoCEv2 container still restates the opening trade and the PFC Alert still argues a point the reader did not bring; both are outside this brief.

Checks: typecheck, lint, no-ai-tells, svg-a11y, pinned-refs, pre-overflow all PASS.

## 3. EfaDevice.tsx

### Corrections

| # | Status | Note |
|---|---|---|
| 1 | Applied | Alert header "Both flavours still consume an ENI (Elastic Network Interface) attachment slot"; body "the ENI attachment limit". |
| 2 | Applied | Rail Alert header expands PCIe (Peripheral Component Interconnect Express). The attribution "AWS documents" in that header stays: it grades the source against "our arithmetic" in the same header. |
| 3 | Applied as decided by the orchestrator | The single-card paragraph ("It is also the right answer on any single-card instance type...") deleted in full. The scorer's replacement sentence was not used. |
| 4 | Applied (with leverage 2) | "So equating 0xefa4 with EFA v4 is unsourced inference." |
| 5 | Applied | "A missing self-reference lets a freshly built cluster launch cleanly and then hang at the first collective." Still uncited (backlog item 3 in gate3-A). |
| 6 | Applied | "Those limits apply to traffic through the EFA device, and do not apply to normal IP traffic from the ENA device of an EFA interface [efa]." |
| 7 | Applied | "is not prohibited by anything on those two pages". |
| 8 | Applied | "One more caution: since EFA and ENA traffic share...". |
| 9 | Applied (with leverage 1) | "Driver r3.3.0 moved this ceiling, adding support for memory region page sizes above 4 GB [releaseNotes]". |
| 10 | Applied | Header "Five PCI device ids against four EFA versions, and no source located maps one to the other"; body "and no AWS source located during this research, and no line of the driver source at the pinned commit, maps a device id to an EFA version number." |

### Leverage edits (all on blocks changed in this refresh)

| Verb | Block | Reason |
|---|---|---|
| Re-express | r3.3.0 paragraph, "What the host owes the device" | Says what the installer fact means for the reader's host: "... and installer 1.50.0 was the first to ship it [changelog], so a host installed from 1.50.0 or later has it. The next section shows how to tell which driver a host runs." |
| Re-express | 0xefa4 paragraph in the device-id Alert | "narrower and still useful" claimed usefulness without delivering it. Now ends "... installer 1.50.0 was the first to ship that driver [changelog], so a driver from an older installer does not carry the 0xefa4 id." |
| Delete | Repository column, r3.4.0 release-note list | Three of the four items (contiguous allocation, admin-queue race, initialisation-order bug) change nothing a reader does; the one that matters, PCIe relaxed ordering, is in the Alert directly below with the same [releaseNotes] citation. Column now: "The amzn-drivers tree carries driver r3.4.0, with the package version recorded in the DKMS (Dynamic Kernel Module Support) configuration [dkms]." |
| Re-express, narrowed | Installer column, Debian 11 clause | The scorer proposed "stay on installer 1.50.0", which is advice the page does not have (upgrading the OS is the other path). Applied the narrower reader-facing form: "On Debian 11, the newest installer you can run is 1.50.0, the last release to support it; 1.51.0 refuses to run there [installer]." The following NGC sentence now names "1.51.0" as its subject, since the old "it" lost its antecedent. |
| Delete | Host-requirements table, "What actually happens" column (huge-pages row changed in the refresh) | Both cells restated the Huge pages and Memory registration limits blocks directly below (5128 pages, hugepages-2Mi, max_mr / page_size_cap, max_mr_size). The table keeps Resource and "How it shows up when it is short", the only content the prose lacks. The `what` field is removed from the `HostRequirement` interface and data. |

### Claim-set self-check (assertions in the after that are not in the before)

- "so a host installed from 1.50.0 or later has it": connects two facts on the page, "installer 1.50.0 was the first to ship [driver 3.3.0] [changelog]" and "installer 1.51.0 ships EFA driver 3.3.1 [installer]".
- "so a driver from an older installer does not carry the 0xefa4 id": from "0xefa4 was added in driver r3.3.0 [releaseNotes]" and "installer 1.50.0 was the first to ship that driver [changelog]".
- "the newest installer you can run is 1.50.0": re-expression of "It refuses to run on Debian 11, which 1.50.0 was the last release to support [installer]".
- "1.51.0 drops its NGC handling": the before's "it" referred to installer 1.51.0; subject made explicit, same [installerScript] citation.
- "no source located", "located during this research", "at the pinned commit": scope narrowed (weakens).
- "on those two pages": scope narrowed (weakens).
- "lets ... launch cleanly and then hang": the before's superlative with "single most common reason" removed (weakens).
- No new facts, numbers or sources.

### Diagram text changed

None.

### Length

Prose words in the component body: 2842 -> 2783 (-59). The deleted table column removes another 63 words of table data that sits above the component and is not in that count, so about -122 in total. The section grew 2 words in the refresh.

### Scores

| | Mental model | Practical leverage | Rigor | Accuracy | Economy | Gate 3 |
|---|---|---|---|---|---|---|
| Before (scorer) | 5 | 5 | 4 | 4 | 4 | 8 |
| After | 5 | 5 | 4 | 5 | 5 | 9 |

Accuracy 5: the unsupported single-card claim is gone. Rigor stays 4: the security-group failure signature is still uncited, though no longer a superlative. Every other item the scorer named (two acronyms, the widened hedges, the table duplication) is resolved.

Checks: typecheck, lint, no-ai-tells, svg-a11y, pinned-refs, pre-overflow all PASS.

## 4. Libfabric.tsx

### Corrections

| # | Status | Note |
|---|---|---|
| 1 | Applied | Stack diagram consumer labels: `NCCL and RCCL` -> `NCCL`; `through the OFI MTL and BTL` -> `through their OFI transport layers` (34 characters at 11px in a 250 px box, about 190 px). |
| 2 | Applied | Ladder intro: "host, CUDA, ROCr (the AMD ROCm runtime) or Neuron". |
| 3 | Applied | Stack h2 description: "Which of the two fabrics your job runs on, and the one field that switches between them." |
| 4 | Applied | "libfabric's own EFA man page frames the split." deleted; the paragraph opens on the fact with [manOverview] unchanged. |
| 5 | Applied, plus antecedent fix | "Four types of protocol can be used, eager, medium, longcts and longread, ... [selectRtm]." The next sentence's "It" lost its antecedent, so it now reads "The selection function checks the read-based branch first". |
| 6 | Applied | "The EFA provider carries a long comment about why this is delicate." deleted. |
| 7 | Applied | "Turning it on has a cost:". |
| 8 | Applied | "NIXL, the newest consumer of all this, integrates with Libfabric 1.21.0 and later, where NCCL and MPI integrate with 1.7.0 and later [efa], on its own getting-started path [nixl]." |
| 9 | Applied | "That is why FI_EFA_INTER_MAX_MEDIUM_MESSAGE_SIZE does nothing for a GPU job, and FI_EFA_RUNT_SIZE is the one that shapes the path." |
| 10 | Applied | "Symbols such as rxr_pkt_post_ctrl appear in older EFA material, and libfabric v2.7.0 has none of them, so a citation to one of those names is a citation to a tree older than the rename." |
| 11 | Applied | "Note the scope in that sentence: on the data path, not everywhere." deleted. |

### Leverage edits (all on blocks changed in this refresh)

| Verb | Block | Reason |
|---|---|---|
| Reorder + demote | GPUDirect Async paragraph (rewritten and roughly tripled in the refresh) | The main flow keeps the model and the three operator facts: "GPUDirect Async: libfabric hands over the queue buffers and the doorbells, and GPU-side code builds and rings the work queue entries itself [manGda]. On aws-ofi-nccl v1.22.0 the instance type is the gate and NCCL_GIN_TYPE=5 is the switch." then the p5en / p6-b200 / p6-b300 gate with its refusal string, the NCCL ranking, and the setup-guide variables, all with their existing citations. Plugin-author internals moved into a new ExpandableSection "How the plugin builds and exposes it" (headerDescription from the page's own "work for whoever writes the plugin"): the FI_EFA_GDA_OPS domain-ops handover and its not-supported error [manGda] [gdaOpen], the build conditions [ginBuild], the `ncclGinPlugin_v14` / device type 5 export [ginExport] [ginDeviceType] [ncclGinTypes] [ncclGinOrder], and the hardware-counter basis of the gate with the OFI_NCCL_GDAKI_EFA_HW_COUNTER override [platformEnv] [gdakiGate] [paramGdaki]. Main-flow words in this block: 245 -> 118. |
| Delete | FI_EFA_MODIFY_EP_OPS sentence (added in the refresh) | Plugin-author API surface that gives no reader anything to decide or check. The scorer offered demotion as the alternative when candidate 1 is taken; deleted instead because economy is the main target and the sentence passes neither the model nor the practice test. `modifyEp` and `modifyEpAttr` removed from the `code` object. |
| Re-express | "Trust the binary" Alert, HIGH_PPS clause (added in the refresh) | "That function also read..." had no visible antecedent. Now "In 2.6.0 the provider read FI_EFA_ENABLE_HIGH_PPS the same way [envHighPps], and 2.7.0 does not read it." |
| Re-express | efa-direct Alert, FI_CONTEXT2 (added in the refresh) | Kept the documentation-versus-code conflict as written and ended the clause on the reader's action: "..., and FI_EFA_TRACK_MR refuses to enable the endpoint [trackMrContext2], so ask for it in your hints if you want either." Shorter than the scorer's proposed form, which stated the consequences twice. |
| Re-express | Version paragraph, upstream sentence (changed in the refresh) | "The ofiwg project has released v2.7.0 ... [man]" asked a man page to bear a release claim. Now "The libfabric citations in this section are pinned to upstream v2.7.0, apart from one that shows 2.6.0 behaviour." `man` removed from the `code` object (no other use). |
| Re-express | "Name the channel" Alert (changed in the refresh) | "So a comparison across channels settles nothing" restated "comparable only within a channel" in the sentence before. Now "The installer release note does not settle it on its own either: the only answer that binds is the binary in front of you." |

Not touched (outside the refresh diff): the three-pass fi_info construction ("96 on a 32-device instance") and the "Two more version-scoped behaviours" expandable, both flagged by the scorer as the remaining economy targets.

### Claim-set self-check (assertions in the after that are not in the before)

- h2 description: from "you select between them with the name field in the fabric attributes. That is the whole switch."
- "through their OFI transport layers": weakens "through the OFI MTL and BTL"; no longer attributes Open MPI component names to Intel MPI.
- "ROCr (the AMD ROCm runtime)": the expansion already in the ladder diagram's `<title>` in this file.
- "The selection function checks...": subject made explicit, same [selectRtm].
- "integrates with Libfabric 1.21.0 and later": the before's "is documented as integrating", same [efa].
- "does nothing for a GPU job": the Alert's own argument (medium band is zero on GPU memory); drops the uncited superlative.
- "older EFA material", "libfabric v2.7.0", "a tree older than the rename": each weakens or pins the before's universal.
- "In 2.6.0 the provider read FI_EFA_ENABLE_HIGH_PPS the same way, and 2.7.0 does not read it": same claim as "also read ... in 2.6.0 and drops it in 2.7.0", same [envHighPps].
- "so ask for it in your hints if you want either": action drawn from the two cited consequences in the same sentence and from the conflict note ("advertises it only when the hints ask for it").
- "libfabric hands over the queue buffers and the doorbells": from "libfabric supplies the address handle, the queue buffers and the doorbells [manGda]".
- "On aws-ofi-nccl v1.22.0 the instance type is the gate and NCCL_GIN_TYPE=5 is the switch": the before's sentence, with the plugin version from the before's build sentence.
- "The three instance types it allows are the platforms it marks as having the EFA hardware completion counter [platformEnv] [gdakiGate]": the before's appositive; [platformEnv] and [gdakiGate] were on that clause in the before.
- "The libfabric citations in this section are pinned to upstream v2.7.0, apart from one...": drops the release claim (weakens).
- "The installer release note does not settle it on its own either": re-expression of the before's clause.
- No new facts, numbers or sources.

### Diagram text changed

- Stack diagram (`LibfabricStackDiagram`), consumer 1 title: `NCCL and RCCL` -> `NCCL`.
- Stack diagram, consumer 2 sub: `through the OFI MTL and BTL` -> `through their OFI transport layers`.
Geometry unchanged. Screenshot the stack diagram to confirm consumer 2's sub label fits its 250 px box.

### Length

Prose words: 3608 -> 3539 (-69). The section grew 217 words in the refresh by this counter (the scorer measured +184 with its own). Separately, about 104 words of the GPUDirect Async block now sit behind a disclosure, so the main reading path is about 170 words shorter.

### Scores

| | Mental model | Practical leverage | Rigor | Accuracy | Economy | Gate 3 |
|---|---|---|---|---|---|---|
| Before (scorer) | 4 | 5 | 4 | 5 | 2 | 7 |
| After | 4 | 5 | 5 | 5 | 3 | 8 |

Rigor 5: the release claim on a man-page citation, the three universal claims and the five attribution narrations are resolved. Economy 3, not 4: the main reading path is much lighter, but the section is still about 150 words above its pre-refresh length and the two scorer-flagged blocks outside the refresh diff remain.

Checks: typecheck, lint, no-ai-tells, svg-a11y, pinned-refs, pre-overflow all PASS.

## 5. EnaVsEfa.tsx

### Corrections

| # | Status | Note |
|---|---|---|
| 1 | Applied | Alert header "Receive aggregation is GRO (Generic Receive Offload), done in software"; body "the Linux stack entry point for GRO". |
| 2 | Applied | "an eBPF (extended Berkeley Packet Filter) hook". |
| 3 | Applied | "GRE (Generic Routing Encapsulation) or IPsec". |
| 4 | Applied | "DPDK (Data Plane Development Kit)". |
| 5 | Applied | "What ENA actually is" h2 description: "Why one flow lands on one core, and where receive aggregation spends host CPU." |
| 6 | Applied, citation added | Header "ENA Express costs tens of microseconds of median latency at idle"; body as given. As in SrdProtocol correction 5, deleting "AWS follows it with a note that" left the "may be better served" sentence with no provenance, so [enaExpress] is attached to it as well. |
| 7 | Applied as decided by the orchestrator, citations placed jointly | "And what the ENA driver carries for SRD is read-only: a statistics structure holding four counters and a configuration bitmap it reads back [srdStats] [srdFlags]. No retransmission, reliability, congestion-control or reordering code for SRD was found in either driver during this research, which is consistent with all of it living below the PCI boundary, in the card. That is why the ethtool counters later in this section are the whole of the ENA driver's view of SRD." Citation check: the pinned `ena_admin_defs.h` was fetched during this pass (see Source note). Lines 512-536 (`srdStats`) hold `struct ena_admin_ena_srd_stats` with the four counters and, under the comment "ENA SRD Statistics Command", `struct ena_admin_ena_srd_info` whose `u64 flags` is commented "ENA SRD configuration bitmap"; lines 162-170 (`srdFlags`) define the three bits. Together they bear "four counters" and "a configuration bitmap it reads back" (the bitmap returns inside the statistics response). The scorer's placement put [srdFlags] alone on "reads back", which the enum definition cannot bear on its own, so both citations sit after the pair. |
| 8 | Applied | efa-substrate diagram label: "No SRD implementation was found in either kernel driver". |
| 9 | Applied | "... and no ena_com_set_ena_srd counterpart was found in the tree during this research. The driver access located is read-only." and "Our reading: an in-instance command for ENA Express is tuning, such as MTU (Maximum Transmission Unit), queue sizes and byte queue limits." |
| 10 | Applied | headerDescription "No set path was found in the drivers, so an API experiment is what settles it"; body "is not visible in the drivers: the SRD accessor located is a getter [srdGet], no SET path was found during this research, and the fetched documentation does not address it." |
| 11 | Applied | "Some secondary write-ups credit ENA with hardware LRO" and "no NETIF_F_LRO feature bit or hardware coalescing path was found in the tree". |
| 12 | Applied | "Our reading is that this is why AWS warns that high packets-per-second workloads may prefer plain enhanced networking [enaExpress]: SRD leaves the single-queue bottleneck in place." |

### Leverage edits

| Verb | Block | Reason |
|---|---|---|
| Delete (clause) | Open question "Is the ENA Express 25 Gbps figure same-Availability-Zone or same-Region?", last paragraph (rewritten in the refresh) | "and the driver cannot settle which one AWS means, because it only reads counters [srdGet]" answered a question no reader asked and leaned on the getter citation again. Now "The two pages give different scopes. If you are sizing on the 25 Gbps figure across Availability Zones, confirm it before you build on it." |
| Re-express | Single-flow ladder, ENA Express note (changed in the refresh) | Sent the reader two containers down for the part they can act on. Now "Capped by the aggregate instance limit. Both AWS pages cover one Availability Zone; across zones, see below." Same-Availability-Zone traffic falls inside both stated scopes (one page says same Availability Zone, the other same Region). |
| (Owner decision) | ENA Express material shared with SrdProtocol | This section keeps the full ENA Express treatment (its own container: enablement, configuration bits, MTU, LLQ trade, counters; the ladder; the scope question). The duplicate in SrdProtocol was reduced to the SRD-specific part plus a pointer to this section by name (see section 2). Nothing in this file was added for it. |

Not touched (outside the refresh diff and not part of the ENA Express duplication): the five-IDs-versus-four-generations open question, which repeats EfaDevice's device-id Alert; the uncited latency and CPU comparisons in "Choosing between them"; the uncited "configured on the ENI attachment through the EC2 control plane" sentence (all in gate3-A backlog).

### Claim-set self-check (assertions in the after that are not in the before)

- "a configuration bitmap it reads back [srdStats] [srdFlags]": new to this paragraph; the bitmap and its read-back were already on the page ("The configuration bitmap carries ... [srdFlags]", "The flags word is surfaced as a pseudo-statistic named ena_srd_mode [srdEthtool]"), and the fetched pinned header (lines 512-536) shows the bitmap inside the statistics-command response.
- "No ... code for SRD was found in either driver during this research": hedged form of the before's "all live below the PCI boundary".
- "the whole of the ENA driver's view of SRD": narrows "the whole of the in-instance view of SRD", which the EFA device's own counters contradicted.
- "No SRD implementation was found in either kernel driver" (diagram), "was found in the tree during this research", "The driver access located is read-only", "the SRD accessor located is a getter", "no SET path was found during this research", "Some secondary write-ups", "was found in the tree": each weakens a universal.
- "Our reading:" / "Our reading is that": labels inference that the before stated as fact.
- "SRD leaves the single-queue bottleneck in place": from "Cause 2 is untouched. The flow still lands on one receive queue on one core." in the same Alert; drops the "adds per-packet work" clause that sat against "SRD work done in the card".
- h2 description: from "One flow lands on one core" (Bandwidth reality) and the GRO Alert ("aggregates after delivery on the host CPU").
- Second [enaExpress] on "may be better served": same page the before attributed it to.
- "Both AWS pages cover one Availability Zone": the bandwidth guide's "within the same Availability Zone" and the ENA Express guide's "within the same Region", both quoted in the open question; an Availability Zone sits inside its Region.
- Acronym expansions (eBPF, GRE, DPDK, GRO header): standard expansions, no new facts.
- No new numbers.

### Diagram text changed

- efa-substrate (`SrdSubstrateDiagram`, `<text className="sb-s" x="440" y="336">`): `Neither kernel driver contains any SRD implementation` -> `No SRD implementation was found in either kernel driver` (55 characters at 11px, centred in a 760 px box). Geometry unchanged. Screenshot to confirm.

### Length

Prose words: 2859 -> 2873 (+14). The growth is the four acronym expansions and the hedged absence wording the corrections require; the only refresh-changed prose (the open-question paragraph) lost a clause.

### Scores

| | Mental model | Practical leverage | Rigor | Accuracy | Economy | Gate 3 |
|---|---|---|---|---|---|---|
| Before (scorer) | 5 | 4 | 3 | 4 | 3 | 7 |
| After | 5 | 4 | 4 | 5 | 4 | 8 |

Accuracy 5: "the whole of the in-instance view", "entire knowledge" and the per-packet-work tension are resolved. Rigor 4, not 5: the choosing-columns comparisons and the control-plane enablement sentence remain uncited. Economy 4: the dive no longer carries the ENA Express material twice; the five-IDs question still repeats EfaDevice.

Checks: typecheck, lint, no-ai-tells, svg-a11y, pinned-refs, pre-overflow all PASS.

## Summary

| Section | Corrections applied / narrowed / superseded / skipped | Prose words before -> after | Gate 3 before -> after |
|---|---|---|---|
| DataPath | 6 / 0 / 0 / 0 | 2070 -> 2061 (-9) | 8 -> 9 |
| SrdProtocol | 7 / 1 (C4) / 1 (C8) / 0 | 3285 -> 3108 (-177) | 7 -> 8 |
| EfaDevice | 10 / 0 / 0 / 0 (C3 per orchestrator: paragraph deleted) | 2842 -> 2783 (-59), plus 63 table words | 8 -> 9 |
| Libfabric | 11 / 0 / 0 / 0 | 3608 -> 3539 (-69); main reading path about -170 | 7 -> 8 |
| EnaVsEfa | 12 / 0 / 0 / 0 (C7 per orchestrator, citations placed jointly) | 2859 -> 2873 (+14) | 7 -> 8 |

Batch: 14664 -> 14364 prose words (-300), plus 63 words of EfaDevice table data. Average Gate 3 score 8.4 (before 7.4); no section below 8.

Diagram text changed (screenshot these): DataPath efa-d04 steps 2 and 3; Libfabric stack diagram consumers 1 and 2; EnaVsEfa efa-substrate bottom label.

Code citations removed from section `code` objects because nothing cites them any more: SrdProtocol `enaSrdGet`, `enaSrdDecl`, `recvwinSlot`; Libfabric `man`, `modifyEp`, `modifyEpAttr`. `sources.md` and Sources.tsx were not touched; reconcile there if they list these.

Source note: one fetch during this pass, `https://raw.githubusercontent.com/amzn/amzn-drivers/9d5ca4021f7c9f8421e404c1e89edb0b1325372c/kernel/linux/common/ena_com/ena_admin_defs.h` on 2026-10-23 [AUTHORITATIVE: pinned source], curl default User-Agent, no personal data. Used only to check what `srdStats` and `srdFlags` can bear in EnaVsEfa correction 7. Build and tests were not run (orchestrator builds).

STATUS: COMPLETE
