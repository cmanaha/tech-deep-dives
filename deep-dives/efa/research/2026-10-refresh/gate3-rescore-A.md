# Gate 3 re-score, group A (mechanism sections) after commit eb39b7e

STATUS: see last line

Independent re-scorer. Scope: DataPath, SrdProtocol, EfaDevice, Libfabric, EnaVsEfa.
Pass judged: eb39b7e "efa: apply Gate 3 corrections and the leverage pass to the mechanism sections".
BEFORE scores: gate3-A.md. Applier log (gate3-apply-A.md) read only after scoring.

Line numbers below are in the AFTER files (HEAD, which matches eb39b7e for these five sections). "Before" means `eb39b7e^`.

---

## 1. DataPath.tsx (The Data Path: OS-Bypass End to End)

### AFTER Gate 3 score: 9 / 10 (BEFORE 8)

- Every one of the six BEFORE corrections and all four leverage candidates landed as proposed; the lifetime list is now said once in prose and once in the diagram, and the column (L533-536) points back to it.
- Practical value rose without new assertions: the p2p alignment rule is now an instruction (L848-851), the Data Path Direct paragraph names the moment to re-check (L720-722), and the section closes on "so that is the one to confirm on a new instance" (L904-906).
- Held off 10 by two uncited sentences that pre-date the pass (L656-657, L785-786) and one new wording slip (L713-714).

### Axes

| | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|
| BEFORE | 5 | 3 | 4 | 5 | 4 |
| AFTER | 5 | 4 | 4 | 5 | 5 |

Pass verdict: **succeeded.** Model held at its ceiling, leverage +1, accuracy held at 5, economy +1, rigor held. Prose word delta about -4.

### Regressions introduced by eb39b7e (1)

Sentence-by-sentence check of the diff: no new sourced number, no citation moved, no hedge touched, no acronym expansion lost (SQ and MMIO were removed from the diagram, and MMIO is still expanded at L765), no changelog voice, no AI tells (`scripts/gates/no-ai-tells.sh` passes).

1. **L713-714, new assertion slightly wider than its paragraph.** "Two gates decide whether it is live on a given host, and both are properties of the host." The same paragraph ends by locating the second gate in "the rdma-core in the image" (L721-722). In a container deployment that rdma-core is the image's, not the host's. Minor, but it is a claim the before did not make.
   Fix: "Two gates decide whether it is live, and both are fixed by the hardware and the image the job runs on."

### Remaining corrections the pass missed (2)

1. **L785-786, inference stated as fact (leverage standard check 3; CLAUDE.md "Every claim citable").** "A process can only ring doorbells inside its own region." The cited lines show the driver recording the UARN and passing it at queue-pair creation; they cannot show the device enforcing it.
   Replace with: "Our reading of that design is that a process can ring doorbells only inside its own region."
2. **L656-657, uncited claim in the main flow.** "For small messages the payload rides inline in the descriptor, which is what the low-latency queue exists for." The LLQ column (L763-766) repeats it, cited to `mmapQueue`, which shows the write-combined mapping and not inline payload.
   Minimal fix pending a source: delete the sentence at L656-657 (the LLQ column already carries the idea) and change L764 "the descriptor, and for small messages the payload with it," to "the descriptor".

Checked and not counted: L812 "The provider describes the trade in its own parameter help text" reads as narration, but in this dive help text is graded below code (SrdProtocol's 16384 conflict), so the attribution grades the source (leverage standard case 4) and stays.

### Backlog

- A typeable check for the closing action (confirming peer-to-peer support on a new instance) and for "re-check it" at L722.
- Name the two MR (memory region) cache bounding parameters (L824-826) and the 2021 no-op installer flag (L898).
- Sources for the inline-payload claim and the device-side UARN enforcement, which would let both sentences return at full strength.

---

## 2. SrdProtocol.tsx (SRD: The Transport Protocol)

### AFTER Gate 3 score: 8 / 10 (BEFORE 7)

- All nine BEFORE corrections landed: four attribution narrations re-expressed with scope intact ("On the storage side", L721), the factor-of-ten now credited to AWS where it repeats (L1134), RNR expanded in the triage table, the widened hedge removed with the block that carried it.
- Economy improved by about 200 words: the ENA Express driver-accessor evidence and the duplicate scope discussion moved out to the section that owns ENA Express, and the recvwin expandable now opens on the reader's version (L1111-1112).
- Held at 8 by three things the pass introduced: an unexpanded acronym, a cross-reference that promises more than the target delivers, and a "how to choose" paragraph that kept ENA Express's cost and dropped its benefit.

### Axes

| | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|
| BEFORE | 5 | 4 | 4 | 5 | 3 |
| AFTER | 5 | 4 | 4 | 5 | 4 |

Pass verdict: **partial.** Accuracy held at 5, economy +1, rigor held, model already at its ceiling. Leverage did not rise: the clearer recvwin guidance (L1111-1112, L1127) is offset by losing the ENA Express benefit from the paragraph that answers the h2's "how to choose between ENA Express and EFA". Prose word delta about -208.

### Regressions introduced by eb39b7e (3)

1. **L1282, new acronym at its first occurrence in reading order, unexpanded.** "the MTU it needs". No section before this one (Overview, DataPath) uses MTU; its expansion first appears in EnaVsEfa.tsx L812, three sections later.
   Fix: "the MTU (Maximum Transmission Unit) it needs".
2. **L1281, cross-reference strengthened past its target.** "The ENA and EFA section covers how to enable it". That section's "Enable it from the control plane" column (EnaVsEfa.tsx L800-813) says where ENA Express is configured (the ENI attachment, through the EC2 control plane) and names no command or API call.
   Fix: "The ENA and EFA section covers where it is switched on, the MTU (Maximum Transmission Unit) it needs and the counters that confirm it is carrying traffic."
3. **L1262-1265, sourced number deleted from this section.** Removed: "raising the single-flow ceiling from 5 Gbps to up to 25 Gbps within the same Region, up to the aggregate instance limit, and reducing tail latency ... in the same Availability Zone [enaExpress]. Note which of those two carries which scope". Mitigation: the number and the Region-versus-AZ scope conflict survive in full in EnaVsEfa.tsx L781-782 and L1016-1035, so the dive keeps them. The cost is local: the paragraph that does this section's "how to choose" now gives ENA Express a price (the median tax) and no payoff.
   Fix: "ENA Express is the middle option. It puts ordinary TCP and UDP traffic onto SRD without any application change and raises the single-flow ceiling from 5 Gbps to up to 25 Gbps [enaExpress], a figure whose scope the ENA and EFA section examines. You keep sockets and pay the uncongested median tax."

Checked and not counted:
- The deleted `recvwinSlot` sentence: the power-of-two constraint survives at L1104-1106 with its citation, and the slot-at-distance layout is what diagram efa-d31 draws.
- The deleted driver-accessor block took its hedge ("No matching set function was found in the tree during this research") with it, together with the claim it scoped; both survive, correctly hedged, in EnaVsEfa.tsx L800-809.
- L1127 "Leave it unset on libfabric 2.5.0 and later": wider than the before's "on libfabric 2.7.0", but it traces to the page's existing "from 2.5.0 onward it is 16" (L1112) and the conflict note's release mapping. The open-ended "and later" is inherited from that sentence, not added by the pass.

### Remaining corrections the pass missed (2)

1. **L1158-1161, header now duplicates its body.** The new header "This block is model: why peer count stops being a resource question" is followed by "It is the reason peer count stops being a resource question on EFA".
   Replace the body with: "Nothing here is configurable. It is what makes the address-vector behaviour and the flat scaling in the practical sections make sense."
2. **L987 and L998-1000, uncited claims in the main flow (CLAUDE.md "Every claim citable").** "the card is what performs it" can carry the source already on the page; "The application never blocks for it either" is our reading.
   Replace L987 with: "Because drops are expected, recovery is routine, and it happens in the Nitro card, where SRD is implemented [storageBlog]." Replace L998 "The application never blocks for it either:" with "Our reading is that the application does not block for it either:".

### Backlog

- An observable (counter, log line or command) for "arrivals spilling to `overflow_pke_list`" (L1129-1130).
- Demote or cut the PFC deadlock Alert (L926-935), which argues with a claim an EFA reader did not bring.
- L937-942 restates the opening trade (L691-696) a third time after the InfiniBand column; a candidate to fold into the framing paragraph.

---

## 3. EfaDevice.tsx (The EFA Device: Attachment Modes, Network Cards and Rails)

### AFTER Gate 3 score: 9 / 10 (BEFORE 8)

- The accuracy defect is gone: the unsourced single-card attachment guidance was deleted rather than re-worded, and the one-EFA-per-instance rule it leaned on still stands, cited, at L516-519.
- All ten corrections and all five leverage candidates landed. The version material now reads as decisions: "On Debian 11, the newest installer you can run is 1.50.0" (L721-723), "so a host installed from 1.50.0 or later has it" (L696-697), "a driver from an older installer does not carry the 0xefa4 id" (L798-799). The duplicated table column is gone and the facts it carried (5128 pages, `max_mr` and `page_size_cap`) remain cited at L659-681.
- Held off 10 by two uncited failure signatures that pre-date the pass (L373, L857-859); the section still ends on the Capacity Reservation action.

### Axes

| | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|
| BEFORE | 5 | 5 | 4 | 4 | 4 |
| AFTER | 5 | 5 | 4 | 5 | 5 |

Pass verdict: **succeeded.** Model and leverage were already at 5 and held. Accuracy came back to 5, economy +1 (about -140 words), rigor held. The leverage re-expressions add consequence sentences built only from facts already on the page.

### Regressions introduced by eb39b7e (0)

Sentence-by-sentence check, with the three new consequence clauses traced:
- L696-697 "so a host installed from 1.50.0 or later has it": derived from the r3.3.0 note [releaseNotes] and "installer 1.50.0 was the first to ship it" [changelog], with installer 1.51.0 shipping 3.3.1 (L719). It sits after its citations, not between a claim and its evidence. It holds for a host running the installer's out-of-tree module, which is the case the next sentence sends the reader to check.
- L721-723 Debian 11: same claim as the before, re-ordered into the reader's decision.
- L798-799 "a driver from an older installer does not carry the 0xefa4 id": follows from the same two cited facts. It is scoped to the installer's driver and says nothing about the mainline kernel driver.
- The deleted table column held "AWS states that ... 5128 huge pages" with no SourceRef; the same fact is cited at L659-662. The deleted r3.4.0 list items are release-note housekeeping; relaxed ordering survives, cited, at L743-745.
- Acronyms: ENI and PCIe are now expanded in the headers where a reader first meets them. No AI tells.

### Remaining corrections the pass missed (2)

1. **L857-859, uncited failure signature in the main flow.** "A missing self-reference lets a freshly built cluster launch cleanly and then hang at the first collective." The dive has a sourced signature for this case: the provider's unreachable-remote code, whose own help text names security group rules first (SrdProtocol.tsx L798-803).
   Replace with: "A missing self-reference lets a freshly built cluster launch cleanly and fail at its first EFA traffic, with the unreachable-remote error the SRD section decodes."
2. **L373, table cell with no source, now the table's only content for that row.** "Pods that do not request hugepages-2Mi can be admitted and then fail at libfabric init. Fork-heavy Python data loaders can exhaust the pool."
   Replace with: "Our reading: pods that do not request hugepages-2Mi can be admitted and then fail at libfabric init, and fork-heavy Python data loaders can exhaust the pool."

### Backlog

- A documented statement of whether an EFA-only secondary interface is allowed on a single-card instance type, which would let single-card guidance return.
- The command that reads PCIe topology on a running instance (L594-595 says to read it there).
- The "What is in the repository" column (L733-737) and the Alert under it (L741-749) now say the same thing about r3.4.0; one could absorb the other.

---

## 4. Libfabric.tsx (libfabric and the EFA Provider)

### AFTER Gate 3 score: 8 / 10 (BEFORE 7)

- The refresh's main defect is fixed: the 37-line GPUDirect Async paragraph now leads with the operator facts ("the instance type is the gate and NCCL_GIN_TYPE=5 is the switch", L741-742; the three instance types, the refusal string, the setup-guide variables), and the plugin-author internals sit in "How the plugin builds and exposes it" (L755-785).
- All eleven corrections landed: RCCL, MTL and BTL are gone from the stack diagram, ROCr is expanded in visible text (L802-803), five attribution narrations and three universal claims are fixed, and the release claim no longer leans on a man page (L1071-1073).
- Held at 8 because economy is still the weakest axis (the three-pass fi_info construction and the version-scoped expandable remain), and because the HIGH_PPS clause now claims more than its citation carries.

### Axes

| | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|
| BEFORE | 4 | 5 | 4 | 5 | 2 |
| AFTER | 4 | 5 | 4 | 5 | 3 |

Pass verdict: **partial.** Accuracy held at 5, economy +1, leverage held at its ceiling, rigor held. Mental model did not rise: the pass removed what was hiding the model and added no model content. Prose word delta about -41.

Accuracy check made for this re-score [Tier 0, our check]: the ofiwg/libfabric v2.7.0 and v2.6.0 release tarballs were downloaded anonymously from codeload.github.com on 2026-10-23 and grepped. At v2.7.0, `ENABLE_HIGH_PPS` and `enable_high_pps` appear nowhere outside NEWS.md; at v2.6.0 the unregistered reader takes it at `efa_env.c` L62-65. `rxr_` has zero occurrences under `prov/efa` at v2.7.0, and `EFA_RDM_PEER_DEFAULT_REORDER_BUFFER_SIZE` is 16 at `efa_rdm_peer.h` L12. Nothing the page claims was contradicted. The tarballs were deleted after the check.

### Regressions introduced by eb39b7e (1)

1. **L645-648, scope strengthened past the citation.** Before: "That function also read FI_EFA_ENABLE_HIGH_PPS in 2.6.0 [envHighPps] and drops it in 2.7.0", a claim about one function. After: "and 2.7.0 does not read it", a claim about the whole 2.7.0 tree, with no citation after it; `envUnregistered` (L49-66) can show only that this one reader drops it. Our grep above shows the stronger claim is true, so accuracy holds, but the page cannot show it (leverage standard checks 1 and 2).
   Fix (restores the before's scope and gives the clause its evidence): "In 2.6.0 the same reader also took FI_EFA_ENABLE_HIGH_PPS [envHighPps], and the 2.7.0 reader drops it [envUnregistered]." To keep the stronger form, log the tree grep in `research/` and cite it.

Checked and not counted:
- The FI_EFA_MODIFY_EP_OPS sentence and its two citations were deleted outright. The BEFORE candidate said to move it into the expandable if the GDA demotion was taken. Deletion is an allowed verb, and the sentence carried no number, conflict or hedge.
- L892 "does nothing for a GPU job" is narrower than the before's "does nothing", and sits inside an Alert whose premise is GPU-memory traffic. It holds.
- L1111-1113 "libfabric v2.7.0 has none of them" narrows "libfabric today" to the pin; our grep confirms it.
- The deleted sentences "libfabric's own EFA man page frames the split", "The EFA provider carries a long comment", "the code states plainly" and "Note the scope in that sentence" were narration. Each claim they introduced is still cited.

### Remaining corrections (3; the first two were introduced by the pass but fall outside the regression categories)

1. **L1085-1087, dangling reference after an unrequested cut.** The pass deleted "So a comparison across channels settles nothing", leaving "The installer release note does not settle it on its own either", where "it" has no antecedent.
   Replace with: "Neither a comparison across channels nor the installer release note on its own settles whether a given change is in your build: the only answer that binds is the binary in front of you."
2. **L532, new h2 description promises an answer the container does not give.** "Which of the two fabrics your job runs on" is answered in the next container (efa-direct comes first in the fi_info list, L569-582). This container gives only the switch.
   Replace with: `description="What each of the two fabrics adds between your call and the wire, and the one field that switches between them."` (traces to L542-550).
3. **L496, uncited quantitative claim in the h1 description (CLAUDE.md fact-checking standard).** "which of libfabric's several hundred settings change what it does".
   Replace with: `description="How an application reaches the EFA device, and which libfabric settings change what it does."`

### Backlog

- A command or log line that shows which GIN backend a running NCCL job selected.
- `efa.html` now also lists the Expert Parallelism (EP) library and DeepEP among supported libraries (per the BEFORE scorer's 2026-10-23 fetch); L508-511 reproduces the older list.
- Economy candidates: the three-pass fi_info construction (L569-582) and the "Two more version-scoped behaviours" expandable (L1119-1145).

---

## 5. EnaVsEfa.tsx (ENA and EFA: Two Devices, One Nitro Card)

### AFTER Gate 3 score: 8 / 10 (BEFORE 7)

- Both accuracy defects are repaired. "The whole of the in-instance view of SRD" became "the whole of the ENA driver's view" (L692-693), which no longer collides with the EFA counters. The driver's SRD footprint is now described as a statistics structure plus a configuration bitmap (L686-689), which matches the pinned header: `ena_admin_ena_srd_info` carries `u64 flags` beside the four-counter stats struct inside the cited range (fetched anonymously for this re-score, 2026-10-23).
- Five of the BEFORE scorer's six absence-as-fact sentences are now scoped to the search, the getter is no longer cited for an absent setter (L1058, L1064-1068), and the AWS-reason inference is labelled as ours (L978-981). Every unexpanded acronym on the BEFORE list (GRO, eBPF, GRE, DPDK) is fixed.
- Held at 8 by three absence or superlative claims the BEFORE list did not reach (L902, L997, L1142-1148) and by economy: the median-latency Alert still has a near-verbatim twin in SrdProtocol.tsx L1249-1258.

### Axes

| | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|
| BEFORE | 5 | 4 | 3 | 4 | 3 |
| AFTER | 5 | 4 | 4 | 5 | 3 |

Pass verdict: **partial.** Accuracy came back to 5, rigor +1, model held at its ceiling, economy held (about +29 words, all of it hedge text). Leverage did not rise: the only leverage edit, the ladder note, is the one that introduced a regression. This pass was a correctness repair on this section, and it worked as one.

### Regressions introduced by eb39b7e (1)

1. **L440, ladder note: new wording that reads as a wrong scope.** "Both AWS pages cover one Availability Zone; across zones, see below." One of the two pages scopes the 25 Gbps figure to the same Region (L1027-1028), so "both pages cover one Availability Zone" can be read as both pages scoping it to one AZ, which the expandable at L1016-1037 contradicts. The intended claim (same-AZ traffic falls inside both stated scopes) is correct.
   Fix: `note: 'Capped by the aggregate instance limit. Within one Availability Zone, either AWS page applies; across zones, see below.'`

Checked and not counted:
- L686-689 "a configuration bitmap it reads back [srdStats] [srdFlags]": `srdStats` (L512-536) spans `ena_admin_ena_srd_info`, the statistics-command response carrying the flags word, so the citation can bear "reads back".
- L692-693 "the whole of the ENA driver's view of SRD": an absolute, but it sits on the same footing as L808-809 ("The driver access located is read-only"), and ethtool surfaces the whole of that response (ena_srd_mode plus the four counters, L889-893).
- The deleted clause "and the driver cannot settle which one AWS means, because it only reads counters [srdGet]" took a misapplied getter citation with it. Both scope quotations remain verbatim (L1021-1031).

### Remaining corrections the pass missed (4)

1. **L902, universal absence claim.** "Which resource, and what action a high value should trigger, is stated nowhere in code or documentation."
   Replace with: "Which resource, and what action a high value should trigger, is not stated in the driver code at the pinned commit or in any AWS documentation located during this research."
2. **L996-997, absence claim with no scope and no evidence that can bear it.** "and amzn-drivers carries no driver-level link aggregation". The citation before it, `enaDriver`, is the probe registration and cannot show an absence elsewhere in the tree.
   Replace with: "and no driver-level link aggregation was found in amzn-drivers during this research."
3. **L1142-1148, uncited superlatives in the decision columns (design reasoning stated as fact).** "best of the three, because the application writes the descriptor itself..." and "lowest of the three."
   Replace with: "<strong>Latency:</strong> best of the three on our reading, because the application writes the descriptor itself and the kernel sits outside the data path entirely." and "<strong>CPU cost:</strong> lowest of the three on our reading. A send is a store into mapped memory, and the SRD protocol work happens in the card."
4. **L940-943, table footer cannot bear the ENA Express row.** "All four rows sourced from the EC2 instance network bandwidth guide". The ENA Express note's "aggregate instance limit" and two-page scope come from the ENA Express guide (L1027-1031).
   Replace with: "Ceilings sourced from the EC2 instance network bandwidth guide [bandwidth]; the ENA Express note also draws on the ENA Express guide [enaExpress]."

### Backlog

- The "Enable it from the control plane" column (L801-814) names no API call or CLI command.
- A first-party citation for EFA's latency position (`efa.html` says "lower and more consistent latency"), which would let correction 3 drop "on our reading".
- One owner for the ENA Express median-latency material (here L789-797, and SrdProtocol.tsx L1249-1258) and for the five-IDs question (here L1040-1054, and EfaDevice.tsx L780-802).
- Diagram 1 labels every EFA function `1d0f:efa4` while the table lists five IDs.

---

## Comparison with the applier's log (gate3-apply-A.md, read after scoring)

| Section | Applier's AFTER axes (M/L/R/A/E), score | This re-score | Where we differ |
|---|---|---|---|
| DataPath | 5/3/4/5/5, 9 | 5/4/4/5/5, 9 | Leverage. The applier held it at 3 because no action became typeable. I gave +1 for the alignment instruction, the named re-check moment and the closing reorder. Borderline: the +1 rests on framing alone. Both of us flag the "properties of the host" sentence differently: the applier's self-check traced it, but did not notice that the same paragraph puts rdma-core in the image. |
| SrdProtocol | 5/5/4/5/4, 8 | 5/4/4/5/4, 8 | Leverage. The applier credits the recvwin reorder and version-scoped advice with +1. I count those gains and net them against losing ENA Express's benefit from the section's own "how to choose" paragraph. The applier's self-check lists the cross-section pointer as navigation and does not test it against the target section ("how to enable it" against a column that gives no command). It also misses the unexpanded MTU. |
| EfaDevice | 5/5/4/5/5, 9 | 5/5/4/5/5, 9 | None. |
| Libfabric | 4/5/5/5/3, 8 | 4/5/4/5/3, 8 | Rigor. The applier's claim-set self-check calls "2.7.0 does not read it" the "same claim" as "that function ... drops it in 2.7.0". It is a wider claim with no citation that can carry it. This is the failure mode the leverage standard records, here caught by a self-check that read the text and not the scope. The claim turned out true (our tree grep), so accuracy is unaffected. |
| EnaVsEfa | 5/4/4/5/4, 8 | 5/4/4/5/3, 8 | Economy. The applier credits this section with "the dive no longer carries the ENA Express material twice". The cut happened in SrdProtocol, this section grew about 14 words, and the median-latency Alert here (L789-797) still has a near-verbatim twin at SrdProtocol L1249-1258. |

Where the applier was right and the BEFORE scorer was not:
- SrdProtocol correction 4: "takes the opposite route from" would have strengthened the source's "differs from"; the applier narrowed it.
- EnaVsEfa correction 7: the citations were moved jointly because `srdFlags` alone cannot bear "reads back". Our anonymous fetch of the pinned header confirms the joint placement is correct.
- EfaDevice leverage 4: "stay on installer 1.50.0" would have been advice the page lacks; "the newest installer you can run" is the right scope.

## Summary

| Section | BEFORE score | AFTER score | AFTER axes (model / leverage / rigor / accuracy / economy) | Regressions from eb39b7e | Remaining corrections | Pass verdict |
|---|---|---|---|---|---|---|
| DataPath.tsx | 8 | 9 | 5 / 4 / 4 / 5 / 5 | 1 | 2 | Succeeded |
| SrdProtocol.tsx | 7 | 8 | 5 / 4 / 4 / 5 / 4 | 3 | 2 | Partial (leverage flat) |
| EfaDevice.tsx | 8 | 9 | 5 / 5 / 4 / 5 / 5 | 0 | 2 | Succeeded |
| Libfabric.tsx | 7 | 8 | 4 / 5 / 4 / 5 / 3 | 1 | 3 | Partial (model flat) |
| EnaVsEfa.tsx | 7 | 8 | 5 / 4 / 4 / 5 / 3 | 1 | 4 | Partial (leverage flat) |
| **Batch** | **7.4** | **8.4** | | **6** | **13** | |

Batch A clears the Gate 3 bar on these scores: no section below 7, and an average of 8.4 against the bar of 8. Accuracy is 5 in all five sections, so no section fails the leverage test outright. Every regression and remaining correction above is mechanical: one replacement string each, with no new research needed. The two partial-pass sections where leverage stayed flat (SrdProtocol, EnaVsEfa) had little leverage material in their BEFORE candidate lists. Their pass was mostly a correctness repair, and it succeeded as one.

Patterns worth one fix rather than several:
- **Cross-section moves are where this pass slipped.** Two of SrdProtocol's three regressions come from the ENA Express de-duplication (the pointer that over-promises, and the benefit removed from the paragraph that does the choosing). The third, the unexpanded MTU, entered through the same pointer sentence.
- **Self-checks that compare text and not scope.** The applier's claim-set lists say "no new facts" for two sentences whose scope changed (Libfabric L645-648, EnaVsEfa L440). The leverage standard's check 1 needs an explicit before-scope and after-scope per rewritten sentence, not a trace to the before's sentence.
- **Absence claims the BEFORE list did not reach:** EnaVsEfa L902 and L997. The same sweep for "nowhere", "no ... at all" and "carries no" that the BEFORE scorer ran would catch both.

Sources and checks for this re-score:
- [Tier 0, our checks] `scripts/gates/no-ai-tells.sh` passes, and a grep of the five files for em-dash, en-dash, curly quotes and the banned vocabulary found nothing. Word deltas come from `git diff --word-diff=porcelain eb39b7e^ eb39b7e`, which also counts code tokens, so they are approximate.
- [Tier 0, our check] ofiwg/libfabric v2.7.0 and v2.6.0 release tarballs, fetched anonymously from codeload.github.com on 2026-10-23, grepped for `ENABLE_HIGH_PPS`, `enable_high_pps`, `rxr_` and the reorder-buffer default, then deleted.
- [AUTHORITATIVE: pinned source] `amzn/amzn-drivers` at `9d5ca40`, `kernel/linux/common/ena_com/ena_admin_defs.h`, fetched anonymously from raw.githubusercontent.com on 2026-10-23, lines 160-172 and 510-538.
- No request carried personal data. No file other than this report was edited, and nothing was committed.

STATUS: COMPLETE
