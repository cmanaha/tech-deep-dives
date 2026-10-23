# Gate 3 quality scoring, batch A (October 2026 EFA refresh)

STATUS: IN PROGRESS

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

