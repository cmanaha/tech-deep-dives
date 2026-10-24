# Change report: IsolationNie (nav id `isolation`, "Isolation: NIE and MIG")

Status: COMPLETE (not committed)

Files: `src/sections/IsolationNie.tsx`, `src/components/IsolationLayers.tsx`,
`src/sources/IsolationNie.ts` (new, 15 records, all cited), this report.

Register: `research/2026-10-refresh/03-aws-cpus.md` section 0 and section 6
(I1 to I35, N24 to N26, Recommended edits 1 to 9); MIG and Blackwell
confidential-computing facts from `research/2026-10-refresh/02-nvidia.md` section 0;
2026-08-01 audit `docs/verification/2026-08-01/P3-silicon-numbers.md` section 4.
Cross-section notes in `revamp/REVAMP-PLAN.md` followed (Neuron determinism note:
no NEFF determinism claimed beyond instruction order).

Shared records reuse URL, title, publisher and tier exactly: `nieWhitepaper`,
`nieComputeBlog`, `migConcepts` (CapitalMarketsLens.ts), `blackwellUltraBlog`
(NvidiaBlackwell.ts and others), `nkiOverview`, `neuronCoreV3`, `trainium2Arch`
(AwsCustomSilicon.ts).

## Fetched during authoring (records carry 2026-10-17)

- NIE white paper (PDF, extracted with pdftotext): four proven properties verbatim
  ("Confidentiality and integrity", "Functional correctness", "Absence of runtime
  errors", "Memory safety"); scope "the first three parts of the VM lifecycle as given
  by the hypercall API: VM creation and configuration, vCPU management, and memory
  management"; EL2/EL1 split and the policy list; "approximately 330,000 lines of
  machine-checked mathematics"; Isabelle/HOL "used for ... seL4"; micro-architectural
  exclusion and mitigations (secret-hiding, speculation barriers, no shared L1);
  assumptions (bootloaders, firmware, Graviton5 hardware); Iris and Verus; "establishes
  Nitro System as the first formally verified cloud hypervisor"; mediation of "all
  access to VM memory, CPU register state, and I/O devices".
- NIE Compute blog (2026-06-11): "implemented in Rust"; "establishes Nitro as the first
  formally verified cloud hypervisor"; "generally available on all Graviton5-based
  instances starting today"; "we plan to make the Nitro Isolation Engine's source code
  and formal proofs available to third parties"; assumptions "the correctness of the
  Rust compiler and hardware". The blog does not name Isabelle/HOL or a line count; both
  are cited to the white paper.
- MIG user guide: Supported GPUs (max instances: 7 datacenter, RTX PRO 6000 Blackwell 4,
  RTX PRO 5000/4500 Blackwell 2; no B300 or HGX B300 row; GB300 DGX Station 252 GB);
  Concepts (memory QoS quote, Table 3); MIG Device Names ("CUDA supports at most 64 MIG
  instances across all GPUs"; CUDA_VISIBLE_DEVICES "at most one per GPU instance";
  R470+ MIG UUIDs); Deployment Considerations (B200 R570 >= 570.133.20; GB300 CUDA 13
  R595 >= 595.58.03); Getting Started (`nvidia-smi mig -lgip`).
- NVIDIA Blackwell Ultra blog: MIG split 2 x 140 / 4 x 70 / 7 x 34 GB, 288 GB HBM3e,
  TEE-I/O and inline NVLink protection.
- NVIDIA Secure AI whitepaper WP-12554-001 v1.3 (PDF): single-GPU and multi-GPU
  pass-through; "The GPUs are not shared among VMs"; Blackwell multi-GPU "the NVLINK
  pathway is also encrypted, and up to eight GPUs"; CPU TEE "AMD SEV-SNP or Intel-TDX".
- Neuron Runtime configuration guide: default reservation of all cores for the current
  process; exclusive reservation quote; `NEURON_RT_VISIBLE_CORES`; the 16-core example
  where a further process fails because one core is free.
- EC2 data protection page: in-transit encryption list and conditions, CLI filter.
  The list includes P5, P5e, P5en, P6-B200, P6-B300, P6e-GB200, Trn1, Trn1n, Trn2,
  Trn2u, Inf2, M9g/M9gd, C9g/C9gd, R9g/R9gd. **Trn3 and P6e-GB300 are not on it** (read
  2026-10-17).

## Word count

Measured on the rendered page (`main`, 1440 px), SVG text and citation badges
excluded, with a Playwright text-node walk (script kept outside the repo).

- Before: 1,072 words with expandables closed, 1,147 open.
- After: 1,348 closed (+26%), 1,449 open (+26%). First draft was 1,779; cut by
  dropping the compose lists and the boundaries expandable, the RTX PRO table rows
  (the prose carries the counts), PSUM and NKI detail, Iris/Verus, TDISP/IDE detail,
  and by demoting confidential computing into an ExpandableSection.

Reasons for growth, per added block:
- Proof Alert (Recommended edit 3, I10 to I13, N24): scope, four properties,
  assumptions and exclusions replace four invented properties; about +80 words. This
  is the register's highest-impact fix.
- NIE mechanism and policy paragraph plus diagram (I2): about +40 words over the old
  "distinct from the Nitro Hypervisor" paragraph.
- "Before you deploy" (N25, N26, Recommended edit 8): about 150 words plus the CLI
  block, replacing about 170 words of compose lists and boundaries text.
- MIG UUID, QoS wording, slice-size note (I17, I18, I19, I24): about +40 words.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| I2 | NIE "sits beneath the Nitro Hypervisor"; "distinct from the Nitro Hypervisor ... NIE is the isolation layer" | NIE is the part of the Nitro Hypervisor that touches guest state; alone at EL2, controls CPU page tables, IOMMU, saved guest CPU state; rest of the hypervisor deprivileged to EL1 beside guests, keeps policy, reaches guests only through the hypercall API; mechanism and policy together were too large to verify. New diagram `NieSplitDiagram` | nieWhitepaper (T1) |
| I1 | "A minimal Rust software module" (uncited) | minimal separation kernel written in Rust that mediates all access to VM memory, CPU register state and I/O devices | nieComputeBlog (T2), nieWhitepaper (T1) |
| I3, I4, I5, I35 | "Announced at re:Invent 2025 alongside Graviton5 and the M9g preview"; diagram "M9g preview Dec 2025", "C9g, R9g, 2026"; aboutamazon link 2026-04-23 | runs on every Graviton5 instance, generally available since June 2026 (prose and diagram) | nieComputeBlog (T2) |
| I6 | Isabelle/HOL "same toolchain used for seL4 and major cryptographic algorithm proofs" | Isabelle/HOL, the theorem prover used for seL4 (cryptographic-proofs clause dropped: not in the source) | nieWhitepaper (T1) |
| I7 | "Roughly 250,000 lines of Isabelle proof script" (prose and diagram) | about 330,000 lines of machine-checked mathematics (June 2026) | nieWhitepaper (T1) |
| I9 | "AWS positions NIE as the first formally verified cloud hypervisor"; h2 description; diagram footer | "AWS calls the result the first formally verified cloud hypervisor, a claim it makes about the Nitro System as a whole"; removed from h2 description and diagram | nieComputeBlog (T2, vendor-claim) |
| I10 to I13, N24 | Alert: VM cannot read/write another VM's memory, observe cache state via timing side channels, escape its scheduling quantum, bypass admission control; "hold mathematically"; "bugs cannot exist by construction" | Alert: scope (VM creation and configuration, vCPU management, memory management); four proven properties (confidentiality and integrity; functional correctness; no runtime errors; memory safety incl. unsafe Rust); assumptions (Rust compiler, more privileged bootloaders and firmware, Graviton5 hardware, proof tools); outside the proof: micro-architectural side channels (mitigated by secret-hiding, speculation barriers, no shared L1) and scheduling (deprivileged hypervisor) | nieWhitepaper (T1), nieComputeBlog (T2) |
| I14, I28 | "Auditors can inspect the Isabelle proof script. Regulators can verify independently."; "NIE: cite the Isabelle proof" | the citable artifact today is the white paper; AWS plans to make NIE source code and formal proofs available to third parties for independent review; "Cite NIE for who can read or write a VM's memory; for latency under contention, measure" | nieWhitepaper (T1), nieComputeBlog (T2) |
| I16 | "covered in Section 29" | cross-reference by name: Determinism: NEFF and GPU Reproducibility | none (internal) |
| I17 | "up to 7 independent GPU instances" | up to seven on data-center parts, four on RTX PRO 6000 Blackwell, two on RTX PRO 5000 and 4500 Blackwell (prose and diagram) | migSupportedGpus (T1) |
| I18 | each instance "a separate CUDA device with its own PCI function" | CUDA sees each instance as its own device, with its own MIG UUID | migDeviceNames (T1) |
| I19 | "no SM sharing, no L2 sharing, no HBM bandwidth sharing"; "deterministic memory bandwidth per tenant" | own SMs, L2 slice, memory, copy engines, decoders; NVIDIA's quote "limit both the available capacity and bandwidth, and provide memory QoS"; SM performance and errors isolated; decode-heavy workload held to its slice's bandwidth | migSupportedProfiles, migConcepts (T1) |
| I20 to I22 | A100 40, A100 80/H100, H200 rows with "~" sizes | same layouts, written as NVIDIA profile names (1g.5gb x 7 and so on), memory merged into the GPU column | migSupportedProfiles (T1) |
| I23 | B200 "7 x ~23 GB, 2 x ~95 GB, 1 x 192 GB" | 1g.23gb x 7, 3g.90gb x 2, 7g.180gb x 1 | migSupportedProfiles (T1) |
| I24 | B300 "7 x ~34, 4 x ~70, 2 x ~140, 1 x 288" (diagram "B300: up to 7 x ~34 GB") | 7 x 34 GB, 4 x 70 GB, 2 x 140 GB, "no published profile names or whole-GPU profile"; GB300 (DGX Station) 252 GB row added from the MIG guide to show slice sizes follow product memory; "the MIG guide has no HGX B300 table" | blackwellUltraBlog (T2), migSupportedProfiles, migSupportedGpus (T1) |
| I25 | "Blackwell extends TEE capabilities to MIG instances"; encrypted GPU memory per MIG instance; attestation of the MIG instance | Blackwell adds TEE-I/O and inline NVLink protection; whole GPUs pass through to one confidential VM (one, or up to eight on Blackwell with NVLink encrypted); GPUs not shared among VMs; CPU-to-GPU traffic encrypted; VM on AMD SEV-SNP or Intel TDX; single-tenant, the opposite of MIG sharing (ExpandableSection) | blackwellUltraBlog (T2), nvidiaSecureAi (T1) |
| I29, I30 | "no cache to share or bandwidth to contend for"; "structural rather than runtime-enforced"; diagram "No cache contention possible" | leads with the runtime's exclusive NeuronCore reservation (quote), `NEURON_RT_VISIBLE_CORES`, a process asking for more cores than are free fails; NEFF fixes memory allocation and instruction order; SBUF has no cache in front; a NeuronCore and its SBUF belong to one process; HBM specified per chip, no per-NeuronCore bandwidth partition located; "Our reading: processes on one chip share its HBM bandwidth, so measure them together" | neuronRuntimeConfig, nkiOverview, neuronCoreV3, trainium2Arch (T1) |
| I32 | diagram "Trainium2, Inferentia2; Trn2 UltraServer (64 chips)" | diagram names no chip generation: "Cores chosen per process with NEURON_RT_VISIBLE_CORES" (the runtime guide is generation-independent) | neuronRuntimeConfig (T1) |
| I33 | text "Pillar 2 (Trainium variant)" vs diagram "Pillar 3, Software" | no pillar numbers anywhere: three boundaries named Host: NIE, GPU: MIG, Trainium: NeuronCores | none |
| I34 | "network-fabric isolation (that is the Nitro card's SRD encryption)" | Nitro hardware on supported types encrypts traffic between instances with 256-bit AEAD, same Region, same or peered VPC, no load balancer or transit gateway in the path | ec2DataProtection (T1) |

## Claims removed

- I8: "checking in approximately 30 minutes on a standard laptop" (UNKNOWN, unsourced).
- I15: MiFID II, DORA, SEC Rule 17a-4, CFTC Part 1.31 list (CUT candidate; 17a-4 and
  1.31 are record-retention rules).
- I26: "no other public cloud currently offers end-to-end" (CUT candidate, unsourced).
- I27: "TEE-I/O: tenant data is encrypted at rest on the GPU" and "cite cryptographic
  attestation" (WRONG/UNKNOWN; restated as in-transit encryption in the expandable).
- I31: diagram "Per-call deterministic output" and "Reproducibility as a first-class
  property" (UNKNOWN; and the cross-section note forbids NEFF determinism beyond
  instruction order).
- "MIG covers per-instance HBM and SM isolation but does not cover NVLink fabric
  outside the confidential-compute domain" (unsourced) and "The three pillars compose;
  ... all three matter" (no content).
- The compose lists ("What the compose buys you"): they restated the diagram as a
  takeaways box. Their fixable content moved: NIE evidence to "Using it as evidence",
  MIG and in-transit checks to "Before you deploy".
- "Trainium NEFF: tenant schedule is compile-time fixed" and "NEFF: cite the binary,
  reproducible separation per call" (overreach; removed).
- Iris and Verus (N24 sub-item): one clause, removed for length; it fails the
  mental-model-or-practical test for this reader. The white paper keeps it.
- TDISP/IDE and bounce-buffer detail in the confidential-computing block: removed for
  length; "CPU-to-GPU traffic is encrypted" carries the fact.
- Kept from the old page without a citation: "Multi-tenant inference is cheaper than
  single-tenant inference" (undisputed framing, no number).

## UNKNOWNs and how the page handles each

- I24, B300 whole-GPU profile: written "no published profile names or whole-GPU
  profile"; the reader is told to read profiles on the instance.
- I25, HBM encryption on Blackwell: not claimed; the page says traffic is encrypted.
- I26, EC2 support for NVIDIA GPU confidential computing: "No EC2 documentation for
  NVIDIA GPU confidential computing was located during this research" (same wording as
  Capital Markets Lens).
- I29, per-NeuronCore HBM bandwidth: scoped silence plus a labelled "Our reading".
- I12, admission control: not mentioned.

## NEW content

- N24: the proof Alert (scope, properties, assumptions, exclusions) and the
  mechanism/policy split. nieWhitepaper (T1), nieComputeBlog (T2).
- N25: in-transit encryption list and the `describe-instance-types` filter, with Trn3
  and P6e-GB300 noted as absent when read. ec2DataProtection (T1).
- N26: `nvidia-smi mig -lgip`, 64 MIG instances across all GPUs,
  `CUDA_VISIBLE_DEVICES` one compute-instance UUID per GPU instance, driver minimums
  for B200 and GB300. migGettingStarted, migDeviceNames, migDeployment (T1).
- The section ends on N25 and N26 ("Before you deploy").

## Diagram

`IsolationLayers.tsx` rewritten: three columns (Host: NIE, GPU: MIG, Trainium:
NeuronCores), each answering Separates / Enforced by / Where / Evidence / Outside it.
`role="img"`, `aria-labelledby="isolation-layers-title"`, `<title>` stating what it
asserts, `aria-label` removed, viewBox 880 x 412 only, full-bleed white rect, 11 to 14 px
sans-serif, wide-diagram phone convention (overflowX wrapper, minWidth 640). Numbers
drawn: 330,000 lines (nieWhitepaper), 7 / 4 / 2 instances (migSupportedGpus), June 2026
(nieComputeBlog), all cited in the caption. No acronym appears in it before the prose
expands it (EL, SM, QoS, NEFF, SBUF rephrased).

New module-private `NieSplitDiagram` in the section file: EL1 row (two guest VMs, the
deprivileged Nitro Hypervisor with its policy list, "Outside the proof"), EL2 row (NIE,
the components it controls, the proof scope), arrows labelled "all guest access" and
"hypercall API only". Same contract; id `nie-split-title`; marker id `nie-ah`.

Rendered check (`scripts/shoot.mjs`, 1440 and 390): probe reports "2 SVG diagram(s),
ok" at both widths (no overlaps, no clipping, no page overflow). Read the PNGs: at
1440 both diagrams are clean, labels sit beside arrows, no text crosses a line. At 390
both diagrams scroll sideways at 640 px as the convention intends. The MIG table first
rendered with the layouts column collapsed to a few characters at 390; fixed by merging
memory into the GPU column, giving layouts `minWidth: 190`, and binding "profile x
count" with non-breaking spaces; re-shot clean. The CLI block scrolls horizontally.

## Leverage pass: claim-set diff (assertions in the after that were not in the before)

| Assertion | Source |
| --- | --- |
| NIE mediates all access to VM memory, CPU register state and I/O devices | nieWhitepaper |
| NIE alone at EL2; controls page tables, IOMMU, saved guest CPU state | nieWhitepaper |
| Rest of the hypervisor deprivileged to EL1; keeps scheduling, resource allocation, device emulation, interrupt controller, guest creation; uses the hypercall API | nieWhitepaper |
| Mechanism and policy together were too large to verify | nieWhitepaper |
| Generally available on all Graviton5 instances since June 2026 | nieComputeBlog |
| About 330,000 lines (June 2026) | nieWhitepaper |
| First-formally-verified claim is about the Nitro System | nieComputeBlog, nieWhitepaper |
| Proof scope: three lifecycle parts | nieWhitepaper |
| Four proven properties | nieWhitepaper |
| Assumptions: Rust compiler, bootloaders and firmware, Graviton5 hardware, proof tools | nieWhitepaper, nieComputeBlog |
| Micro-architectural side channels outside the proof; mitigations | nieWhitepaper |
| Scheduling outside the proof (deprivileged hypervisor decides it) | nieWhitepaper (policy list) |
| Formal verification covers every input within scope, testing the cases tried | nieWhitepaper |
| AWS plans to share source code and proofs with third parties | nieComputeBlog |
| RTX PRO 6000 Blackwell 4 instances; RTX PRO 5000/4500 Blackwell 2 | migSupportedGpus |
| Memory QoS quote; SM performance and error isolation | migConcepts |
| Each instance a CUDA device with its own MIG UUID | migDeviceNames |
| GB300 (DGX Station) 252 GB profiles; no HGX B300 table | migSupportedProfiles, migSupportedGpus |
| B300 288 GB and 7/4/2 split | blackwellUltraBlog |
| Confidential computing: whole GPUs to one VM, up to eight on Blackwell with NVLink encrypted, not shared among VMs, CPU-to-GPU traffic encrypted, SEV-SNP or TDX | nvidiaSecureAi |
| TEE-I/O and inline NVLink protection | blackwellUltraBlog |
| Neuron runtime reserves all cores for the current process by default; exclusivity quote; `NEURON_RT_VISIBLE_CORES`; over-asking process fails | neuronRuntimeConfig |
| NEFF fixes memory allocation and instruction order | nkiOverview |
| SBUF has no cache in front | neuronCoreV3 |
| HBM specified per chip | trainium2Arch |
| Processes on one chip share HBM bandwidth | labelled "Our reading" (inference from the scoped silence) |
| In-transit encryption: AEAD 256-bit, conditions, instance list, Trn3 and P6e-GB300 absent, CLI filter | ec2DataProtection |
| `nvidia-smi mig -lgip` | migGettingStarted |
| 64 MIG instances across all GPUs; one compute-instance UUID per GPU instance | migDeviceNames |
| B200 R570 >= 570.133.20; GB300 CUDA 13 R595 >= 595.58.03 | migDeployment |

No assertion in the after lacks a source or an "Our reading" label.

## Checks run (from the dive root)

- `tsc --noEmit`: no errors in my files. `eslint --max-warnings 0` on my three files:
  clean. `vitest sections.test.tsx -t IsolationNie`: pass.
- `no-ai-tells.sh`, `svg-a11y.sh`, `pinned-refs.sh`: no hits in my files.
- `sources.test.ts`: only "keeps sources.md in sync" fails (orchestrator's snapshot);
  the tier-consistency and record-completeness tests pass for every IsolationNie record.
- Formatted with Prettier `--single-quote --print-width 100`, which matches the house
  style of the finished sections (CapitalMarketsLens passes it).

## For the orchestrator

- `sources.md` needs regenerating from the registry (snapshot test above).
- Glossary acronyms introduced or used here: NIE (Nitro Isolation Engine), MIG
  (Multi-Instance GPU), VM (virtual machine), EL1/EL2 (Exception Level), IOMMU (I/O
  Memory Management Unit), vCPU (virtual CPU), SM (Streaming Multiprocessor), QoS
  (quality of service), TEE-I/O (Trusted Execution Environment for I/O), SEV-SNP
  (Secure Encrypted Virtualization with Secure Nested Paging), TDX (Trust Domain
  Extensions), NEFF (Neuron Executable File Format), SBUF (State Buffer), HBM (High
  Bandwidth Memory), AEAD (Authenticated Encryption with Associated Data), VPC (Virtual
  Private Cloud).
- `App.tsx` nav title still carries a number ("30. Isolation: NIE and MIG"); the h1
  is "Isolation: NIE and MIG".
- Cross-section note for later authors: the EC2 in-transit encryption list (read
  2026-10-17) includes P5, P5e, P5en, P6-B200, P6-B300, P6e-GB200, Trn1, Trn1n, Trn2,
  Trn2u, Inf2 and the Graviton5 families, and omits Trn3 and P6e-GB300. Communication
  and Scale-Out should not say Trn3 traffic is Nitro-encrypted without a newer source.
- Cross-section note: NVIDIA GPU confidential computing passes whole GPUs to one VM
  and is not per-MIG-instance; Determinism and any Blackwell text should not describe
  a per-MIG TEE.
