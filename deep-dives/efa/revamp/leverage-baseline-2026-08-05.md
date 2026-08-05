# Leverage Baseline, 2026-08-05

Pre-pass scores for three EFA sections, judged against `leverage-pass-standard.md`.

**Reader stance.** Staff-level engineer / solutions architect. Knows networking and distributed
systems. Either evaluating EFA or operating a cluster that already has it. Competent, busy,
skeptical. Did not write this and does not care what it cost to produce.

**Method.** Read each section top to bottom as rendered content, ignoring SVG coordinate code.
Source citations were not independently fetched, so accuracy is scored as "right as far as a
knowledgeable reader can judge," which is what the rubric asks for.

---

## Score table

| Section | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|
| `EfaDevice.tsx` | 3 | 5 | 4 | 5 | 3 |
| `Libfabric.tsx` | 4 | 4 | 4 | 5 | 4 |
| `SrdProtocol.tsx` | 5 | 3 | 5 | 5 | 3 |

---

# 1. `src/sections/SrdProtocol.tsx` (1,300 lines, 7 containers, 3 diagrams)

### Mental model: 5

One trade is named in the second paragraph and the entire section genuinely derives from it:
"**The trade SRD makes:** SRD (Scalable Reliable Datagram) keeps reliability and throws ordering
away... Everything else in this section follows from that single trade."

That is a generative model, not a summary. After reading it I can predict cases the page never
covers: why path diversity improves with cluster size rather than degrading, why a reorder buffer
has to exist somewhere, why a latency-sensitive uncongested RPC would be worse off, why RNR retry
is an SRD-only field. The `SrdVsRoceDiagram` bottom row does the whole argument in one cell:
"What it asks of the fabric: Nothing special. Ordinary lossy Ethernet is enough," with the caption
"The bottom row is the trade. Two transports buy simplicity by requiring a fabric that never
drops. SRD pays for drops instead."

This is the best mental model in the three sections and one of the better ones I have read on this
topic anywhere.

### Practical leverage: 3

The leverage is real but confined to two asides, and the section's center of mass is a correctness
argument rather than an operator's path.

What is genuinely actionable:

- The `ethtool` ratio, inside an Alert at line 1013: "the ratio of `ena_srd_tx_pkts` to
  `ena_srd_eligible_tx_pkts` is what reveals whether traffic is actually riding SRD or silently
  falling back." That is a diagnostic I would run.
- The five hardware counters: `retrans_bytes`, `retrans_pkts`, `retrans_timeout_events`,
  `unresponsive_remote_events`, `impaired_remote_conn_events`.
- `FI_EFA_RECVWIN_SIZE`, with a corrected default of 16 rather than 16384.
- The closing decision: "Reach for ENA Express when the application has to keep its sockets, and
  for EFA when the library underneath it already speaks libfabric."

What defeats it: not one counter carries a threshold, a baseline, or a next step. What retransmit
rate is normal? What do I do when `impaired_remote_conn_events` climbs? Nothing says. Worse, the
section has the ideal triage material and uses it as evidence instead: "`LOCAL_ERROR_UNRESP_REMOTE`
is commented as an unresponsive remote that was previously responsive, while
`LOCAL_ERROR_UNREACH_REMOTE` is an unreachable remote that never returned a response." That is the
difference between "a node died mid-job" and "your security group is wrong," and the section uses
it to prove that "That distinction is a transport-level judgement, made in hardware." The
operational reading is right there and is never taken.

The queue-pair scaling container is model, not leverage. I will never size a queue pair. 16,777,216
is a rhetorical number. The rubric permits keeping such a block if you say plainly what it is for;
the section does not, which is the specific failure the standard calls out.

### Rigor: 5

The strongest of the three, and close to exemplary. The file header states three source rules
before any content. Every claim carries a `SourceRef` with an explicit provenance. Two disclosures
deserve naming:

- "The paper is paywalled and was not read for this page, so nothing here is attributed to it."
- "The arithmetic here is derived, not quoted... The multiplication is ours."

The PFC-deadlock Alert is the rarest thing in this genre, a section refusing to repeat a satisfying
myth: "Deadlock is the charge you will hear levelled at PFC in large fabrics, and the primary
literature is more careful than that... The sound criticism of PFC is head of line blocking,
unfairness and congestion spreading, not deadlock as a routine outcome."

The `RECVWIN_SIZE` conflict string is complete enough to reconstruct the finding from scratch.

### Accuracy: 5

Nothing I can fault. Version, journal, volume and date on Shalev et al. are right, and the file
header explicitly guards the common NSDI misattribution. The 5 Gbps / 10 Gbps single-flow figures
and the 25 Gbps ENA Express figure match AWS documentation. The factor-of-ten p99 figure is landed
three times, which follows the house rule on repeating the strongest number.

### Economy: 3

Judged hard, this is the least dense of the three. Roughly a quarter of the rendered section exists
to win an argument the reader never entered.

The "SRD lives in the Nitro card" container is a three-column proof of a negative. I did not arrive
believing SRD sits on top of ENA. The container's one genuinely useful output, that ENA Express
cannot be enabled from inside the instance, is buried in an `ExpandableSection` beneath the PCI-id
evidence.

The `RECVWIN_SIZE` expandable runs five paragraphs to land one number. The units argument earns its
place because it defends against a plausible misreading. "The help text is two tuning rounds stale,
not one," with two commit refs and dates, is archaeology.

---

### Single strongest thing

The opening trade framing plus the closing "What SRD costs you," which names the bill in three
currencies (programming model, API, uncongested latency) and ends on a choice rather than a
summary. Second place, closely: the PFC-deadlock correction.

### What I would cut first, and how much

The evidentiary apparatus of the "SRD lives in the Nitro card" container (the PCI-id column, the
three-column layout) plus the "How to check any claim on this page yourself" expandable with its
git clone and five `sed`/`grep` commands. **Roughly 20 to 25 percent of the rendered section.**
Promote the ENA Express enablement point and the `ethtool` counters out of the wreckage.

### Knowledge for its own sake

> "ENA claims PCI device IDs 0x0051, 0x0ec2, 0x1ec2, 0xec20 and 0xec21. EFA claims 0xefa0 through
> 0xefa4. The sets do not intersect, and each driver registers its own `pci_driver` with its own
> probe function. EFA is a separate PCI function."

True, pinned, and connected to nothing I would ever decide, configure, size, choose between or
monitor.

Runner-up, the entire "How to check any claim on this page yourself" block. It proves the research
happened. It does not help me check it, because I will not clone `amzn-drivers` to verify a claim I
already accept.

### Forward or backward

**Forward, then backward, then forward.** The first two paragraphs are properly forward: a
collective finishes when its slowest participant finishes, therefore tail latency is the number,
therefore this trade. The switch is at the second h2, and the h2 description names it: "SRD lives in
the Nitro card / Which component owns the transport, **settled from code**." "Settled from code" is
a research-mode phrase in a reader-facing slot. It stays backward through the InfiniBand comparison,
spraying, loss recovery and queue-pair scaling, then swings forward again for the last container.

### One diagram that does not exist and should

**A per-peer reorder window diagram.** Sixteen message slots, the expected message id, an
out-of-order arrival landing past the pointer, the bounce-buffer copy out of the pre-posted receive
buffer, and the spill into `overflow_pke_list` when depth exceeds the window. That model is
currently carried by two dense paragraphs plus a five-paragraph expandable, and it is the only place
in the section where the SRD trade becomes a bounded resource the reader could actually exhaust.
It is also the diagram that would make the 16-versus-16384 correction land in one glance.

---

# 2. `src/sections/Libfabric.tsx` (1,090 lines, 8 containers, 2 diagrams)

### Mental model: 4

The spine is stated and mostly honoured: "Every EFA question eventually becomes a libfabric
question: which fabric was selected, which endpoint type, which protocol the provider chose for a
message size, whether a registration came out of the cache. The rest of this section is those four
questions."

The efa versus efa-direct duality is the single crispest model in the three files: "Same device,
same driver, two different amounts of software between your call and the wire."

The protocol ladder is genuinely predictive. I can take a case the page does not cover, say a
512 KiB send out of CUDA memory with the registration cache disabled and no application descriptor,
and derive the answer: the medium band is gone because the threshold is forced to zero, the
read-based branch is ineligible because neither a descriptor nor the cache is available, so it falls
to the credit-based long protocol. That is exactly the "predict an unfamiliar case" test.

Docked one point because the announced four-question frame is then exceeded without
acknowledgement. GPUDirect Async, version skew and the settings table are three more containers that
are not among the four, and two of them build no model at all.

### Practical leverage: 4

Highest density of tomorrow-actionable material in the three sections.

- Four `fi_info` commands, each with a stated consequence rather than a description. The second is
  the best: "Just the fast fabric. If this prints nothing, efa-direct is not available here and
  every 'use efa-direct' instruction is moot."
- The third is a verification I would run on a new cluster: `fi_info -p efa -f efa-direct -t
  FI_EP_RDM | grep -c 'domain:'`, "Compare it with the EFA interface count you attached at launch.
  They should match."
- The tunables table with three badge states (worth knowing / only with evidence / do not set) is
  the correct shape for this material.
- The best single operational line in all three sections: "Those three names are the ones to grep an
  old launch script for: they end an EFA job before it opens a single endpoint"
  (`FI_EFA_MTU_SIZE`, `FI_EFA_TX_IOV_LIMIT`, `FI_EFA_RX_IOV_LIMIT`).
- A non-obvious coupling that changes behaviour: "turning the cache off makes the read-based
  rendezvous protocol ineligible, and the provider drops silently to the credit-based long
  protocol."
- The staleness test: "grep the pinned source for the first symbol it names. If the symbol is gone,
  the rest of the guidance is from the same era and deserves the same suspicion. The check takes ten
  seconds."
- A named symptom attached to a knob: `FI_EFA_USE_HUGE_PAGE=0` for "multi-process data loaders
  hitting a cannot-allocate-memory error."

Docked one point for having no observability surface whatsoever. The section repeatedly says the
provider logs or warns ("it logs a potential memhooks monitor conflict and switches to userfaultfd";
"the environment variable was set but only eager and runting read protocols are supported"; the fork
handler "prints a message and aborts") and never once tells me where to see any of it. No
`FI_LOG_LEVEL`, no `FI_LOG_PROV`, no example output. A section built entirely on provider behaviour
that never shows the provider talking is leaving its easiest leverage on the floor. "Measure before
moving it" is advice without a method.

### Rigor: 4

Every code reference is pinned to a release tag with line ranges, and the `doc-code-conflict`
provenance is used correctly with a full conflict string on both cases. The scoping Alert is exactly
right and load-bearing: "Because AWS ships a fork of libfabric rather than upstream tags, that
output is the only defaults list guaranteed to describe your host."

Docked one point for tier-mixing inside the tunables table. The `advice` column blends sourced
plugin-cheatsheet guidance with the author's editorial judgment in the same cells, under one blanket
footnote that attributes by category rather than by row. A reader cannot tell that "Do not set for
libfabric 1.18.0 or newer with aws-ofi-nccl 1.7.0 or newer" is the cheatsheet while "The real
rendezvous threshold... Measure before moving it" and "Leave it on" are the author. Both are
probably right. Only one is sourced, and the table does not say which.

### Accuracy: 5

Nothing I can fault on the facts, and the version-scoping discipline is better than most primary
documentation. One presentation collision worth naming, though it is a clarity problem rather than
an error: `FI_EFA_RUNT_SIZE` appears twice with figures a reader will read as contradictory. The
thresholds table says the host value "starts at 0, with the comment that runting is untested on
system memory"; the tunables table says "The parameter definition gives 307200." Both are true under
the parameter-definition-versus-initialiser distinction the section teaches two containers later,
and the section does not apply its own lesson at the point where the confusion first arises.

### Economy: 4

Best of the three, and still carrying two removable containers.

GPUDirect Async is roughly fifty rendered lines about a feature that is opt-in twice over behind a
build flag and an environment variable. It builds one small model ("a handover rather than an
offload") and gives me nothing to do unless I am writing a NCCL plugin.

The version-skew container duplicates `EfaDevice.tsx` almost verbatim. Both sections independently
state that installer 1.49.0 ships libfabric 2.4.0amzn5.0 against upstream v2.6.0, and both close
with a near-identical instruction to name the channel before quoting a version. One of the two
should own it and the other should link.

The "What else changed names or defaults in the 2.x line" expandable is four unrelated facts with no
reason to be adjacent beyond having been found at the same time.

---

### Single strongest thing

The four `fi_info` commands, each with its consequence stated, immediately followed by the "Read the
defaults off the binary you have" Alert. Thirty seconds of typing, and it reframes every number that
follows as provisional until checked locally. That block is forward-written, self-verifying, and the
only place in the three sections that tells the reader to trust their own host over the page.

### What I would cut first, and how much

The GPUDirect Async container entire, plus the version-skew container's overlap with `EfaDevice`.
**Roughly 15 percent of the section.** Keep the amzn-versus-upstream Alert in exactly one of the two
sections.

### Knowledge for its own sake

> "The model to hold is a handover rather than an offload. Every entry in the returned function
> table is a query or an extended open, so libfabric supplies the address handle, the queue buffers
> and the doorbells, and GPU-side code builds and rings the work queue entries itself."

True, pinned to `man/fi_efa.7.md` L285-L305, well written, and connected to nothing an SA or a
cluster operator will ever do. The reader who needs this is writing the plugin, and they are reading
the header, not this page.

### Forward or backward

**Backward-dominant, with two forward islands.** The h1 description is topic, not intent: "How an
application reaches the EFA device, and which of libfabric's several hundred settings change what it
does." The four-questions paragraph is the closest the opening comes to forward, and it is phrased
as document structure ("The rest of this section is those four questions") rather than reader goal.

It turns forward at "fi_info and provider selection," specifically at the code block, and stays
forward through the endpoint-type comparison. It goes backward again for the protocol ladder,
the registration cache internals and GPUDirect Async. It turns forward for the last time at "The
settings that matter," which is where a reader arriving with a real problem would have started.

### One diagram that does not exist and should

**A contract-difference diagram for efa versus efa-direct.** Two columns, one row per obligation
that moves across the line: memory registration (provider-managed cache versus `FI_MR_LOCAL`, you
register), ordering (`FI_ORDER_SAS` versus nothing, you sequence), message size (unbounded versus
capped at the device transmission unit, you segment), completion context (`FI_CONTEXT2` required),
operations available (`FI_TAGGED`, `FI_ATOMIC`, `FI_MULTI_RECV` present versus absent).

That contract is the most consequential choice in the section and it is currently carried entirely
inside one Alert of running prose, "Same endpoint type, a different contract on efa-direct," which
ends with the right sentence in the wrong medium: "Asking for efa-direct is asking to take that work
on." A reader should be able to see how much work, in one glance, before asking.

---

# 3. `src/sections/EfaDevice.tsx` (974 lines, 6 containers, 2 diagrams)

### Mental model: 3

One strong local model, then a fact catalogue.

The counting model is genuinely good and generalizes to instance types the page never mentions:
"they are separate layers with separate owners. EC2 owns the card count, you own the interface
count, libfabric sees the device count, and the collectives plugin invents the rail index on top of
all three."

The rail definition is the clearest I have seen: "So a rail is an ordinal agreed between nodes. Two
EFA devices are on the same rail when they hold the same index in their respective sorted lists.
Every node has to compute the same order or the pairing collapses, which is exactly why the sort
exists."

Past those, the section stops modelling. "What the host owes the device" is three unrelated
resources in a table with no unifying idea. The generation container explicitly declines to give a
model, honestly ("Five ids against four versions cannot be a one to one mapping"), which leaves me
with a rule of thumb rather than a way to predict: "If you need to know which EFA generation an
instance is, read the User Guide table heading for its instance type. If you need to know how the
software will behave on it, read the device id." That is useful. It is not a model.

### Practical leverage: 5

The only section of the three where I could act on it tomorrow across evaluation, build and
operation.

- Sizing a Kubernetes claim: "Size a Kubernetes resource claim from the device count, which is 32
  here. A claim written from the interface count asks for 33 of something the instance has 32 of."
- An arithmetic self-check for sizing sheets: "16 times 400 Gbps is exactly the 6,400 Gbps figure. A
  sizing sheet quoting 17 EFA interfaces overstates the fabric by one card and breaks that
  multiplication, which is the fastest way to spot the error."
- The single most operationally valuable sentence in all three sections: "A missing self-reference
  is the single most common reason a freshly built cluster launches cleanly and then hangs at the
  first collective."
- Design guidance that follows from mechanism: "Since the rule cannot be narrowed, the security
  boundary is membership. Put only the cluster's instances in that security group, and put SSH and
  any other administrative access in a separate group attached alongside."
- A belief correction that changes how I build: "Any page that says EFA requires a cluster placement
  group is stating a recommendation as a rule."
- Address-space sizing with a stated consequence: "a 32-card instance costs one private address
  instead of 32. On a large cluster in a fixed subnet that is the difference between fitting and not
  fitting."
- A Kubernetes failure mode: "Pods that do not request hugepages-2Mi can be admitted and then fail
  at libfabric init."
- A trap in a bandwidth table: "The 6,400 and 3,870 Gbps figures are not additive."

The security-group block is the leverage-pass ideal in miniature: mechanism (no IP, no ports,
MAC-layer addressing), therefore the rule cannot be narrowed, therefore the failure signature
(launches clean, hangs at first collective), therefore the fix (scope membership, split admin
access). That is what every mechanism block in this dive should look like.

### Rigor: 4

Two of the best scoped-inference passages in the whole revamp:

> "Multiply that ratio by the 8 GPUs on the instance and you get eight groups of one GPU plus four
> EFA devices, totalling 32. That multiplication is ours... no AWS source enumerates the groups, so
> treat the grouping as inferred... If your placement decision depends on the exact grouping, read
> it off the running instance from the PCIe topology rather than from this page."

> "That is an argument from the absence of a stated limit rather than a positive AWS statement, so
> treat it as our reading, and keep the Availability Zone boundary as the hard line."

Both name the tier, state the confidence and give the reader an escape hatch. That is the standard
working exactly as intended.

Docked two things, both small and both real:

1. **A decorative code citation on an inference.** The eight-groups paragraph correctly says in
   prose that the multiplication is unsourced, and then attaches
   `<SourceRef provenance="code-derived" doc={docs.eksDevice} code={code.railContract}
   label="inference" />`. `code.railContract` is `nccl_ofi_platform.h` L82-L97, the rail-sorting doc
   comment. It says nothing about GPU-to-EFA PCIe grouping and does not support the claim. The badge
   dresses an admitted inference in code-derived clothing, which the file's own header comment
   forbids: "Nothing here is laundered between the two."
2. **One uncited quantitative claim.** "AWS's own p5 manifests request 5120Mi of hugepages-2Mi,
   which is 2,560 pages, roughly half of what was pre-allocated." No `SourceRef`. It is the only
   uncited number I found across the three files, in a section whose header says "every load-bearing
   claim carries a SourceRef," and in a project whose rule is that every quantitative claim gets an
   inline citation.

Minor third: the driver SHA comment here reads "amzn-drivers master HEAD at the time of reading:
driver r3.3.0" while `SrdProtocol.tsx` calls the identical SHA "the r3.3.0 release tag commit." Same
commit, two different provenance stories, in the same dive.

### Accuracy: 5

Nothing I can fault. The 5128-pages-of-2-MiB figure against the 5120Mi request resolves correctly
(5120 MiB divided by 2 MiB is 2,560 pages, "roughly half"). The P6-B300 arithmetic checks out: 16
EFA-capable cards times 400 Gbps is 6,400 Gbps, and the section uses that as a deliberate
consistency test rather than a coincidence. The `InterfaceType` values and the primary-interface
constraint match the EC2 API.

### Economy: 3

Denser than `SrdProtocol`, looser than `Libfabric`, and inverted in a way that costs it.

The MSI-X block runs a table row plus an h3 plus two paragraphs and ends by admitting it has no
consequence: "AWS documents none of this. It matters because it is the one place where host CPU
count feeds back into EFA resources." Asserting that a fact matters is not the same as saying what
to do with it. Nothing in the section tells me what to check, what to change, or what breaks.

The inline page-buffer-list detail is a driver implementation note with no reader consequence, and
it is followed immediately by an honest admission that its obvious implication is unsupported: "AWS
does not state that as the reason huge pages are pre-allocated, so treat the causal link as our
reading of the code."

The economy inversion: the most useful mechanism content in the section, "Where the generation
actually changes behaviour," which explains why two instance families that look identical on paper
perform differently, is collapsed inside an `ExpandableSection`, while the MSI-X material that leads
nowhere sits at top level with its own h3.

---

### Single strongest thing

The self-referencing security group block. Mechanism, consequence, failure signature and fix in one
container, with the mechanism actually explaining the rule rather than restating it: "EFA traffic is
not IP traffic, so there are no TCP or UDP port numbers to write a narrower rule against... A rule
scoped to a CIDR range and a port is not expressible for this traffic. Self-referencing the group is
the only shape that matches what the device sends."

### What I would cut first, and how much

The MSI-X and inline-PBL material inside "What the host owes the device." **Roughly 12 to 15 percent
of the section.** Keep the huge pages and memory registration rows, which have real failure modes
attached, and promote the generation-behaviour expandable to top level in the space freed.

### Knowledge for its own sake

> "Small registrations get a fast path: if the page list fits in the four-entry inline array carried
> in the admin command, the driver sends it inline instead of building an indirect page list."

True, pinned to `efa_com_cmd.h` L183-L188, and connected to nothing I would ever decide, configure,
size, choose between or monitor.

Runner-up, the MSI-X paragraph: "The split is fixed in a header: the management vector index is 0
and the completion event queue vector base is 1. The number of event queues the driver creates is
then clamped to the vectors it actually received, minus the one spent on admin." I cannot change the
vector count, I cannot observe the clamp, and the section's own honest verdict on shortage is "The
device still works, the interrupt-driven paths just get narrower."

### Forward or backward

**The most forward-written of the three.** The h1 description is literally the reader's question,
in the reader's voice: "I have an instance with EFA. What exactly did I attach, how many of them are
there, and what does the host owe the device?" That is the model the other two sections should
copy.

It stays forward through "Choosing between EFA-only and EFA with ENA" (an h2 named for a decision,
not a subject) and through the four counts. **It switches backward at "What the host owes the
device,"** where the h2 description gives it away by naming device internals rather than a reader
moment, and it stays backward through the driver-version and generation containers. It turns forward
again, decisively, for the final security-group and placement container, which is also the container
that scores highest on leverage. That correlation is not a coincidence and it is the whole argument
for the pass.

### One diagram that does not exist and should

**A cluster boundary diagram for the security group and placement container**, which is currently
the highest-leverage material in the three sections and has no diagram at all.

What it should carry in one picture: the Availability Zone drawn as a hard solid boundary that EFA
traffic cannot cross; the cluster placement group inside it drawn as a dashed, explicitly optional
ring; two or three subnets inside the AZ with instances spread across them, showing that the subnet
line is not a barrier; the self-referencing security group drawn as a closed loop touching every
instance in the cluster; and a second, separate admin security group attached alongside carrying
SSH.

That single image would land four things the section currently spends four paragraphs and two Alerts
on: the AZ is the hard line, the placement group is a recommendation, the subnet is not a boundary,
and the security boundary is group membership rather than rule narrowness.

---

# Ranking, most to least useful

1. **`EfaDevice.tsx`.** Answers the question I actually arrived with, in my own words, and serves
   both the evaluator (attachment modes, address pressure, placement, bandwidth arithmetic) and the
   operator (K8s claim sizing, the security-group hang). Its weakest container is the one written
   backward.
2. **`Libfabric.tsx`.** Best model plus the densest set of things to type, but backward-ordered, and
   it carries a GPUDirect Async container that serves no reader this dive has. Fix the ordering and
   this contends for first.
3. **`SrdProtocol.tsx`.** The best theory and the best rigor in the dive, and the least I can do
   with it. It reads like a section that won an argument.

**What separates the best from the worst.** `EfaDevice` starts from what the reader is trying to do
and lets the mechanism arrive only when a decision needs it, so nearly every fact terminates in
something to attach, size, check or fix. `SrdProtocol` starts from how the technology works and
spends a quarter of its length proving claims the reader never disputed, so its mechanism terminates
in conviction rather than action: it leaves me persuaded that SRD is well designed and no better
equipped to run it on Monday.
