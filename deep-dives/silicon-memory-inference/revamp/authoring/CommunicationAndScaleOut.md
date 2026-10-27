# Change report: CommunicationAndScaleOut (nav id `communication`)

Register: `research/2026-10-refresh/04-other-arch.md`, section 0 and section 4
(claims CS1 to CS28, Recommended edits 1 to 8).

Files: `src/sections/CommunicationAndScaleOut.tsx` (rewritten),
`src/components/CommunicationStack.tsx` (diagram rebuilt as a layer-by-platform grid),
`src/sources/CommunicationAndScaleOut.ts` (new, 26 records).

Status: COMPLETE. Not committed.

Fetched on 2026-10-17 for this section (records carry that date): AWS HPC SRD blog, NCCL
v2.32.3-1 and nccl-ep-v0.1.0 releases, EFA user guide, Trn3 architecture page (EFA row), NIXL
libfabric plugin README at v1.5.0, UEC 1.0 press release, UALink 200G 1.0 press release (PDF),
UALink "Four Specifications" press release (PDF). Everything else is taken from the register
(2026-10-16) or reused from a finished section's record. Shared records reuse URL, title,
publisher and tier exactly: ec2AcceleratedSpecs, efaUserGuide (CapitalMarketsLens),
trainium2Arch, trn2Arch, trn3Arch, collectives, pytorchNative, ncclV2283 (AwsCustomSilicon),
neuronWhatsNew, nxdiMoe, deepEpReadme, sglangExecArgs, wideEpReadme (MoeAndSparseActivation),
nixlReadme, dynamoDisaggDoc (DisaggregatedServingAndSpeculative), p6Page (GraceBlackwell),
ualinkFourSpecs, nvlinkFusionTrainium4 (ChipletAndInterconnect).

## Findings from the re-fetch that the register does not carry

- EFA user guide: p6e-gb200.36xlarge sits in the "Nitro v6 (EFA v4)" table with GDR Yes and
  GDA No; p5.48xlarge in "Nitro v4 (EFA v2)"; trn2.48xlarge in "Nitro v5 (EFA v3)"; no Trn3
  instance appears in any table. The guide lists "DeepEP v2" from the amazon-contributing fork
  among supported libraries and "NIXL integrates with Libfabric 1.21.0 and later".
- Trn3 architecture page: the "EFA bandwidth (Gbps)" row (12,800 / 28,800) sits under the Gen1
  / Gen2 UltraServer columns with no per-server or per-UltraServer scope. The page shows the
  figure; the section states the scope gap in the citation note.
- NIXL libfabric README v1.5.0: trn2.48xlarge qualifies for Neuron device memory only "when
  launched with all 16 EFA NICs attached"; the default run-instances call attaches a single ENA
  interface; trn2.3xlarge does not qualify; trn3 rows say "Match Neuron device count to EFA
  interface count"; the plugin warns on a mismatch.
- AWS HPC blog (2021-06-22): "we relaxed the requirement for in-order packet delivery" and
  ordering is re-asserted "in the higher layers of the stack". The blog does not say SRD
  reassembles at the receiver, so that phrase is gone (register CS11 flagged it).
- UALink 200G 1.0 press release: AWS was on the consortium board at the 1.0 release. The
  section scopes the board claim to that date.
- UALink 2026-04-07 release: the Common Specification 2.0 "Introduces In-Network Compute"
  (confirms register CS28).
- NCCL v2.32.3-1: "does not contain performance model tuning for Rubin" (known issue).

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| CS1 | Four traffic kinds | Kept, folded into the h1 paragraph with "the shape of the traffic decides which library carries it" | framing, no citation (undisputed) |
| CS2 | Stack: transport "EFA SRD on AWS, NVLink within an UltraServer, NeuronLink-v3 between Trainium chips" | Diagram row: NVLink; EFA with SRD; NeuronLink-v3 / -v4, Trn2 / Trn3, EFA between servers; hardware row adds NeuronSwitch-v1 on Trn3 | trn2Arch, trn3Arch (T1) |
| CS3 | Diagram "Hardware - Nitro v5 / NVSwitch / NeuronLink fabric"; aria-label "Nitro v5" | "Nitro card v5 / v6, v4 on P5"; aria-label removed (title element) | ec2AcceleratedSpecs, efaUserGuide (T1) |
| CS4 | NCCL ops "across NVLink and InfiniBand / EFA" | same op list, EFA "through the aws-ofi-nccl plugin"; popover names the 2.28.3 host APIs; Rubin (sm107) from v2.32.3-1 without Rubin tuning | ncclV2283, awsOfiNccl, ncclV2323 (T1) |
| CS5 | NCCL "launches a CUDA kernel for every collective ... consumes SMs" | most collectives run as CUDA kernels on SMs; from 2.28 all-to-all, scatter, gather and all-gather inside one NVLink domain can run on copy engines | ncclV2283 (T1) |
| CS6 | NIXL "should not consume SMs", "without launching kernels" | purpose kept: point-to-point transfers for inference frameworks such as Dynamo, KV cache from prefill to decode GPU memory; SM claim dropped | nixlReadme, dynamoDisaggDoc (T1) |
| CS7 | NIXL libfabric plugin "validated transport on AWS"; unpinned repo link, accessed 2026-03-22 | plugin lists AWS EFA as its one validated provider; cited to the plugin README at tag v1.5.0; plain Link removed | nixlLibfabric (T1) |
| CS9 | Alert "Why both exist" with SM-waste reasoning | Alert "Pick the library by the shape of the traffic": collective-shaped vs point-to-point; production use kept; SM clause gone with CS6 | framing |
| CS11 | "sprays packets across up to 64 paths and reassembles out-of-order at the receiver", cited to the EFA product page | in-order transport stalls behind one lost packet; SRD relaxes in-order delivery, sprays a block over 64 paths at a time out of hundreds or thousands; higher layers restore order; link to the EFA dive's "SRD: The Transport Protocol" | srdHpcBlog (T2) |
| CS12 | "EFA carries NCCL traffic over the libfabric interface" (EFA product page) | NCCL, NIXL and MPI reach EFA through libfabric, which bypasses the kernel | efaUserGuide (T1) |
| CS13 | "P5: up to 3,200 Gbps aggregate" | table row p5.48xlarge: 8 H100, 3,200 Gbps, 400 per GPU, Nitro v4 / EFA v2 | ec2AcceleratedSpecs (T1; per-GPU derived), efaUserGuide (T1) |
| CS14 | "P6e UltraServer (GB200): EFA v3 with higher bandwidth" | table row p6e-gb200.36xlarge: 4 B200, 3,200 Gbps, 800 per GPU [derived], P6 page 400 per GPU; Nitro v5 in the instance specification vs Nitro v6, EFA v4 in the EFA guide; prose states the two disagreements and points to Grace-Blackwell and UltraServer | ec2AcceleratedSpecs, efaUserGuide (T1), p6Page (T2) |
| CS15 | "Trn2 and Trn2 UltraServer ship EFA v3 alongside NeuronLink-v3" | table row trn2.48xlarge: 16 Trainium2, 3,200 Gbps (16 x 200), Nitro v5 / EFA v3 | trn2Arch, ec2AcceleratedSpecs, efaUserGuide (T1) |
| CS17 | "16 CC-Cores per chip" | kept | trainium2Arch (T1) |
| CS19 | NeuronLink-v3 "1.28 TB/s per chip intra-node, 256 GB/s per chip inter-instance" | 1,024 GB/s to the chips in its instance plus 256 GB/s to the other instances | trn2Arch (T1) |
| CS20 | "composes 64 chips into a 3D Torus" | each instance a 4x4 2D torus, same-position chips in rings across four instances, "a 4x4x4 torus in effect" | trn2Arch (T1; 4x4x4 derived) |
| CS21 | "the same coherent-domain property NVL72 has" | a 64-chip scale-up domain built as a torus, where NVL72 is built on switches; Trn3 replaces the torus with NeuronSwitch-v1 in 64- or 144-chip UltraServers | trn3Arch (T1) |
| CS22 | "MoE NKI kernels shipped in Neuron 2.27.0" | NKI Library MoE kernels shipped in 2.28.0 | neuronWhatsNew (T1) |
| CS23 | `torch.all_to_all_vdev_2d` "documented as roadmap as of Neuron 2.29" | Call `nki.collectives.all_to_all_v` (2.29.0 and later); Neuron Runtime AllToAllV on Trn2 and Trn3 from 2.32.0; `torch.all_to_all_vdev_2d` is a PyTorch op built on NVSHMEM, which TorchNeuron lists for a future release | neuronWhatsNew, pytorchNvshmem, pytorchNative (T1) |
| CS24 | "Neuron MoE EP path uses All-Gather rather than All-to-All-v" | NxD Inference, in maintenance, still documents EP over All-Gather; Wide-EP is a beta in vLLM Neuron | nxdiMoe, neuronWhatsNew (T1) |
| CS25 | "citeable gap relative to NVIDIA's Wide-EP over MNNVL ... worth knowing on stage" | the two facts side by side (Wide-EP over GB200 multi-node NVLink; Neuron Wide-EP beta, NxD Inference All-Gather); "on stage" clause dropped | wideEpReadme, neuronWhatsNew, nxdiMoe (T1) |
| CS26 | "153 GB/s NVLink intranode and 51 GB/s RDMA at EP=64 on H800 / CX7"; unpinned repo link | 153 GB/s for EP8 dispatch over NVLink, 51 GB/s for EP64 dispatch over RDMA, H800 with 400 Gb/s ConnectX-7, measured; release v1.2.1; plain Link removed | deepEpReadme (T1, measured) |
| CS27 | SGLang exposes DeepEP via `--moe-a2a-backend` | values include deepep, mooncake, nixl, mori | sglangExecArgs (T1) |

Prose also lost "Sections 5 and 7 of the kernel lifecycle" and "(Section 17)": cross-references
are by name (Anatomy of a Kernel Execution; AWS Trainium, Inferentia and Neuron).

## Claims removed

- "The hardware layer provides the physical link, encryption, and multi-path resilience" and the
  diagram's "encryption": no register source for encryption; removed rather than cited.
- CS6 NIXL "should not consume SMs" / "without launching kernels" / "leaving the SMs free to run
  attention": UNKNOWN, no primary source (register and 05 row 26.12).
- CS18 CC-Cores "without contending with the NeuronCores": UNKNOWN; replaced by the documented
  role (synchronization processors deciding when the data movement engines transfer data).
- "The exact per-family numbers track the EC2 instance pages": replaced by the table.
- "worth knowing on stage and in customer conversations": rhetorical, no content.
- "The TRT-LLM Wide-EP path uses MNNVL but follows the same architectural pattern": the
  "same pattern" judgement has no source; Wide-EP is stated by what its README says.
- No CUT candidates in the register (edit 8: none).

## UNKNOWNs and how the page handles them

- CS6 (NIXL SM use): claim dropped; the purpose stays.
- CS14 (P6e-GB200 generation): stated as a doc-doc conflict in the table cell and in prose, with
  both pages cited; the per-GPU EFA pair (800 derived vs 400 on the P6 page) is shown as the
  cross-section note requires.
- CS18 (CC-Core contention): dropped.
- Trn3 EFA figure scope (found this pass): shown with a citation note saying the page does not
  state per-UltraServer or per-server.

## NEW content and sources

- CS8 NIXL on Neuron: one EFA interface per Neuron device; trn2.48xlarge needs all 16 EFA
  interfaces at launch (default attaches one ENA interface); trn2.3xlarge does not qualify
  (nixlLibfabric, T1).
- CS10 NCCL EP: nccl-ep-v0.1.0 (June 2026), dispatch and combine primitives, full multi-node
  NVLink support, SM-count setting (ncclEp, T1).
- CS16: P6-B300 6,400 Gbps (ec2AcceleratedSpecs), Trn3 Gen2 UltraServer 28,800 Gbps (trn3Arch),
  in a five-row table with P5, P6e-GB200 and Trn2.
- CS28 open standards (ExpandableSection after the diagram): UEC 1.0 (uecSpec10, T2), UALink 200G
  1.0 up to 1,024 accelerators with read, write and atomic transactions (ualink10, T1), Common
  Specification 2.0 in-network compute (ualinkFourSpecs, T1), AWS on the UALink board at the 1.0
  release (ualink10), Trainium4 and NVLink 6 via NVLink Fusion (nvlinkFusionTrainium4, T2,
  roadmap), no AWS UEC or UALink product located (scoped silence), cross-link to Chiplet and
  Interconnect for UCIe.
- DeepEP v2 from AWS's amazon-contributing fork is listed as an EFA-supported library
  (efaUserGuide, T1, fetched this pass).
- Closing block "Size the expert group to the fast domain first", labelled as our reading: a
  third (51 / 153 GB/s, DeepEP measured, derived) and a quarter (256 / 1,024 GB/s Trn2, derived);
  domain sizes 8 GPUs in P5 (ec2AcceleratedSpecs), up to 72 in a P6e-GB200 UltraServer (p6Page),
  16 chips in trn2.48xlarge (trn2Arch); the per-fabric paths restate facts cited above.

## Diagram

`CommunicationStack` rebuilt. Before: five full-width rows with slash-separated lists, fixed
`height`, `aria-label`, em-dashes in the title and two rows ("NIXL ... without consuming SMs",
"Nitro v5"). After: the same five layers (application, collective library, transfer library,
transport, hardware) as rows and three columns (GPUs in an NVLink domain, GPUs across instances
on EFA, Trainium), so the reader finds which implementation each layer has where the traffic
runs. `role="img"`, `aria-labelledby="comm-stack-title"`, a title stating the assertion,
`viewBox="0 0 900 444"` only, full-bleed white background rect, fonts 11 to 13 px sans-serif,
class prefix `cst-`. Wide-diagram phone convention applied (`overflowX: 'auto'` wrapper, svg
`minWidth: 640`). Every number drawn (64 paths, Nitro v4 / v5 / v6, 4x4 torus, NeuronLink-v3 /
-v4, NeuronSwitch-v1) is cited in the caption and again in the text.

Rendered check (`scripts/shoot.mjs --sections communication --widths 1440,390`, run twice, last
after the final edit): probe "ok" at both widths, no overlap, no text out of box, no viewBox
clipping, no page overflow. PNGs read: at 1440 every cell label sits inside its box with clear
padding, column headers centred above their columns, no crossing lines (the grid has no
connectors). At 390 the diagram keeps a 640 px width and scrolls sideways inside its container;
labels stay legible at about 8 px rendered; the page itself does not overflow. The EFA table
scrolls sideways at 390 (Cloudscape default) with badges inside cells.

## Word count

Visible words, tags and code stripped (same script before and after; the table is counted
separately because the original had none):

| | Before | After |
| --- | --- | --- |
| Prose outside expandables | 611 | 893 |
| Inside ExpandableSections | 84 | 232 |
| EFA table cells | 0 | 79 |
| Diagram text (approximate) | 76 | 133 |

Growth is above 20%. Reasons per added block:
- h1 and stack intro: shorter than before (127 to 81 words for the h1), but the pre-diagram
  paragraph now carries the acronym expansions the diagram needs (NCCL, NIXL, CC-Cores, NKI, EFA,
  SRD).
- h2 descriptions: the brief requires payoff descriptions; they grew from 4 to 8 words to 14 to
  20 words each.
- NIXL on Neuron (CS8, register NEW) and NCCL EP (CS10, register NEW): about 80 words.
- EFA table and the P6e-GB200 conflict sentence (CS13, CS14, CS16, register NEW and required
  conflict): 79 table words plus 28.
- Trainium block (CS19 to CS25): the register requires the bandwidth split, the torus wording,
  the torus versus switch contrast, Trn3, and the API replacement; about 80 words more than the
  wrong original.
- Open standards (CS28, register NEW): about 110 words, demoted into an ExpandableSection.
- DeepEP, NCCL EP, Wide-EP details demoted into an ExpandableSection (as the original DeepEP
  block was).
- Closing block (about 85 words): the section previously ended inside a collapsed DeepEP
  expandable; the brief requires ending on the reader's next action, and this block also lands
  the strongest number a second time.
- Cut to pay for it: the "Why this section" history, the SM-waste reasoning, the vague bandwidth
  sentence, "on stage", the GDA/GIN sentence drafted from CS16 (not required).

## Leverage pass

Per block (meaning, model, use):
- h1: the reader's frame, four traffic kinds; model: the traffic's shape picks the library.
- The stack + diagram: model: each layer has a different implementation inside an NVLink domain,
  across EFA and on Trainium; use: find which library and link your traffic hits. The grid
  carries this better than the old slash lists.
- Open standards (demoted): model of open counterparts to SRD (scale-out) and NVLink (scale-up);
  use: what to expect from AWS (board seat, NVLink Fusion roadmap, no UEC or UALink product
  located).
- NCCL and NIXL: model: collective-shaped versus point-to-point; use: the aws-ofi-nccl plugin,
  the LIBFABRIC backend switch (pointer), the trn2.48xlarge launch requirement, Rubin needing
  v2.32.3-1.
- EFA and SRD: model: SRD trades ordering for spraying; use: size per-GPU network bandwidth from
  the table, know the P6e-GB200 doc conflict.
- Trainium: model: torus versus switch, a quarter of the bandwidth leaves the instance; use: the
  correct API name to search for and the serving path.
- MoE: model: leaving the fast domain costs a third (GPU, DeepEP measured) to a quarter (Trn2);
  use: size the expert group to the domain, then the library per fabric.

Claim-set diff (assertions in the after that were not in the before, with source):
1. NCCL 2.28.3 adds host APIs ncclAlltoAll, ncclScatter, ncclGather: ncclV2283.
2. aws-ofi-nccl plugin carries NCCL onto EFA: awsOfiNccl.
3. Copy-engine all-to-all, scatter, gather, all-gather inside one NVLink domain from 2.28:
   ncclV2283.
4. Initial Rubin (sm107) support in v2.32.3-1, without Rubin performance tuning: ncclV2323.
5. Dynamo moves the KV cache from prefill to decode GPU memory with NIXL: dynamoDisaggDoc.
6. NIXL libfabric plugin lists AWS EFA as its one validated provider: nixlLibfabric.
7. Plugin moves Neuron device memory with one EFA per device; trn2.48xlarge needs all 16 EFA
   interfaces; default launch attaches one ENA interface; trn2.3xlarge does not qualify:
   nixlLibfabric.
8. vLLM and SGLang default to UCX, EFA needs LIBFABRIC: restated from Disaggregated Serving and
   Speculative Decoding (cross-link, not re-cited here).
9. NCCL, NIXL and MPI reach EFA through libfabric, which bypasses the kernel: efaUserGuide.
10. One lost packet delays every packet behind it on an in-order transport; SRD relaxes
    in-order delivery; block sprayed over 64 paths out of hundreds or thousands; higher layers
    restore order: srdHpcBlog.
11. Table rows (accelerator counts, EFA Gbps, Nitro and EFA generations, Trn3 28,800 Gbps, no
    Trn3 row in the EFA guide): ec2AcceleratedSpecs, efaUserGuide, trn2Arch, trn3Arch, p6Page.
12. CC-Cores are synchronization processors deciding when data movement engines transfer data:
    collectives.
13. Trn2 torus and rings, 4x4x4 in effect, Trn3 NeuronSwitch-v1 in 64 or 144 chips: trn2Arch,
    trn3Arch (4x4x4 derived).
14. NVL72 is built on switches: undisputed, uncited (the register's CS21 replacement text).
15. Neuron API facts (2.29.0, 2.32.0, 2.28.0, maintenance, Wide-EP beta): neuronWhatsNew;
    All-Gather: nxdiMoe; NVSHMEM op: pytorchNvshmem; TorchNeuron future release: pytorchNative.
16. DeepEP v2 from AWS's fork is EFA-supported: efaUserGuide.
17. NCCL EP facts: ncclEp.
18. Open standards facts: uecSpec10, ualink10, ualinkFourSpecs, nvlinkFusionTrainium4.
19. "a third" and "a quarter": deepEpReadme, trn2Arch (derived, labelled our reading); domain
    sizes: ec2AcceleratedSpecs, p6Page, trn2Arch.

## For the orchestrator

- Glossary acronyms used in this section (expanded at first textual use): MoE, KV, NCCL, NIXL,
  CC-Cores, NKI, EFA, SRD, UEC, UALink, HPC, UCIe, SM, ENA, UCX, MPI, EP (EP8, EP64), Wide-EP,
  RDMA, NxD Inference, NVSHMEM (product name, unexpanded).
- `efaUserGuide` is shared with CapitalMarketsLens and keeps its title "... (EFA limitations)"
  exactly. This section cites the same page for supported instance tables and libraries; a
  neutral title ("Elastic Fabric Adapter for AI/ML and HPC workloads on Amazon EC2") would fit
  both if you regenerate titles.
- New URLs other sections may reuse: ncclV2323, ncclEp, awsOfiNccl, nixlLibfabric, srdHpcBlog,
  pytorchNvshmem, ualink10, uecSpec10.
- App.tsx nav title "29. Communication and Scale-Out" matches the h1 apart from the number.
- Cross-section notes for REVAMP-PLAN:
  - The EFA guide lists no Trn3 instance; the Trn3 page's EFA row (12,800 / 28,800 Gbps) has no
    per-server or per-UltraServer scope. Quote it with that caveat.
  - The EFA guide marks GDA (GPUDirect Async) Yes on p6-b200 and p6-b300, No on p5.48xlarge and
    p6e-gb200.36xlarge.
  - NIXL on Trainium needs one EFA interface per Neuron device: trn2.48xlarge with all 16 EFA
    interfaces attached at launch; trn2.3xlarge does not qualify (NIXL libfabric README v1.5.0).
    Relevant to Disaggregated Serving's Trainium block.
  - The AWS HPC blog does not say SRD reassembles at the receiver; ordering is left to higher
    layers. Any section saying "reassembles out of order" should change.

## 2026-10-24 TorchNeuron update (stream trainium, orchestrator edit)

Evidence: `research/2026-10-torchneuron/` rows E6, P16, P29, P32, C14, SA23.

Claim-set diff:
- Removed: `torch.all_to_all_vdev_2d` "which the Neuron 2.32.0 TorchNeuron guide lists for a future release" (E6 STALE).
- Added: no implementation in torch-neuronx at v2.33.0 (C14, our search); PyTorch 2.14's TokenSwitch is private and NVIDIA-only (SA23 evidence, PyTorch 2.14 release blog, fetched 2026-10-24); TorchNeuron's `neuron` c10d backend runs collectives on the collective cores inside a node and over EFA between nodes (P16, TorchNeuron release notes, fetched 2026-10-24); NxD Inference ends on Trn2 and Trn3 in Neuron 2.34 (P32), replacing "in maintenance".
