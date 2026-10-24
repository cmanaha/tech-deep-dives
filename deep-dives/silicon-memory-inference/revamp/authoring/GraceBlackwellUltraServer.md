# Change report: GraceBlackwellUltraServer (nav id `grace-blackwell`)

Register: `research/2026-10-refresh/02-nvidia.md` section 3 (G1 to G27), plus
section 0 (GB300 on AWS, Vera Rubin, AWS Rubin instance) and section 6 (pinned
TensorRT-LLM URL at v1.2.1).

Files: `src/sections/GraceBlackwellUltraServer.tsx`, `src/components/Nvl72Diagram.tsx`
(rebuilt), `src/sources/GraceBlackwellUltraServer.ts` (new, 16 records).

Re-fetched on 2026-10-17 to confirm load-bearing labels (records carry that date):
GB200 NVL72 page (NVFP4 "1,440 | 720 PFLOPS", footnote "Specification in sparse | dense";
13.4 TB HBM3E; 17 TB LPDDR5X; 130 TB/s; superchip "Up to 480 GB LPDDR5X | Up to 512 GB/s",
"372 GB HBM3E", "72 Arm Neoverse V2 cores"), GB300 NVL72 page ("1440 | 1080" with the
second value footnoted "Without sparsity"; 20 TB), Grace CPU Superchip page (Grace CPU C1
column "Up to 384 GB/s for 480GB"; "up to 500 GB/s in only about 16W"; "on-module
memory"), NVLink-C2C page ("Extending NVLink to chip-level integration"; coherent), AWS P6
page (UltraServer table, "400 GB ps per GPU of EFAv4", "co-located within one compute
module", "P6e-GB200 instances are only available in UltraServers", no P6e-GB300 sizes,
network figure or per-GPU memory), P6e-GB300 What's New ("contact your AWS sales
representative"), EC2 instance spec page (p6e-gb200.36xlarge 4 x B200, 740 GiB (4 x 185
GiB), Grace arm64, Nitro v5, 3200 Gigabit; no p6e-gb300 row), Capacity Blocks page
(UltraServer table lists Trn2 and P6e-GB200 only), NVIDIA MoE blog (quotes in G9, G10,
G12), TensorRT-LLM wide_ep README at v1.2.1 (MNNVL, CDMM, NUMA, `numactl -m 0,1`, GDRCopy,
"DeepSeek R1, 32-way EP"), TensorRT-LLM v0.21.0 release page ("Added large-scale EP
support"), Vera Rubin NVL72 page (72 Rubin / 36 Vera, 20.7 TB HBM4).

Finding the register does not contain: the 384 GB/s figure lives on the Grace CPU
**Superchip** page (`grace-cpu-superchip/`, Grace CPU C1 column), not on `grace-cpu/`. The
record cites the superchip URL.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| G1 | Grace with "one or more Blackwell GPUs" | one Grace CPU with two Blackwell GPUs on one compute module | gb200Nvl72 (T2), p6Page (T2) |
| G2 | NVLink-C2C "900 GB/s of coherent bandwidth" (text, column, diagram) | 900 GB/s bidirectional, coherent | blackwellArchitecture (T2), nvlinkC2c (T2), blackwellUltraBlog (T2, note on Table 1) |
| G3 | C2C is "the same protocol that connects GPUs to each other" | the chip-level member of the NVLink family | nvlinkC2c (T2) |
| G5 | "1.8 TB/s through the NVSwitch fabric", "full bisection bandwidth" | 1.8 TB/s bidirectional, 900 GB/s each way, non-blocking NVLink Switch fabric (text and diagram) | blackwellUltraBlog (T2) |
| G7 | 17.3 TB LPDDR5X | 17 TB, the figure NVIDIA prints | gb200Nvl72 (T2) |
| G8 | GB300 NVL72 "raises ... FP4 PFLOPS to 1,440" | dense NVFP4 720 to 1,080 PFLOPS; sparse stays 1,440 on both racks; both labelled | gb200Nvl72, gb300Nvl72 (T2) |
| G10 | DeepSeek-R1 "recommends EP=64" (text and diagram) | NVIDIA's DeepSeek-R1 decode layout, about four routed experts per GPU, 64 GPUs for 256 | moeBlog (T2) |
| G15 | "Wide-EP up to 64 ships in TRT-LLM v0.21.0 onward" | large-scale EP shipped in TensorRT-LLM v0.21.0 (August 2025) | trtllmV021 (T1) |
| G16 | h2 "Why NVL72 was sized for 72", "MoE-sized, by design", "made specifically for MoE" | h2 "Why 72 GPUs fits MoE"; intent claim removed | moeBlog (T2) for the fit |
| G17 | "~500 GB/s per CPU" | up to 512 GB/s per GB200 superchip vs up to 384 GB/s for a 480 GB Grace, shown as a conflict with both cited; plan against the lower | gb200Nvl72 (T2), graceSuperchipPage (T2) |
| G18 | "Fits in a 16 W envelope" | the memory draws about 16 W at up to 500 GB/s; on-module (soldered) | graceSuperchipPage (T2) |
| G19 | "same package as the GPU" (twice) | same compute module | p6Page (T2) |
| G21 | outside the domain "EFA / InfiniBand at much lower bandwidth" | 400 Gbps EFAv4 per GPU = 50 GB/s, 18x below NVLink each way; InfiniBand dropped for AWS (kept only inside NVIDIA's quote) | p6Page (T2, derived) |
| G22 | "Capacity Blocks for ML pricing applies" | P6e-GB200 UltraServers can be reserved through Capacity Blocks for ML | capacityBlocks (T1) |
| G23 | P6e-GB300 "288 GB / GPU, 20 TB aggregate, higher FP4 PFLOPS, same NVLink topology" | close to 20 TB per UltraServer; 1.5x GPU memory and 1.5x FP4 without sparsity vs P6e-GB200; the P6 page gives no sizes or per-GPU memory | p6Page (T2), p6eGb300Ga (T2, vendor-claim) |
| (xref) | "(Section 16)", "Section 7 covered LPDDR5X economics" | NVIDIA Compilers and Kernel Tooling; DDR5, MRDIMM, LPDDR5X and CXL | - |

CORRECT claims kept and re-cited: G4, G5, G6, G7, G9, G11, G12 (verbatim quote), G13, G20,
G22.

## Claims removed

- G14 "EP > 8 was previously rare": UNKNOWN, CUT candidate.
- G16 design-intent claim: UNKNOWN; reframed as fit.
- "eliminates an entire class of host-side bottlenecks": CUT candidate. Replaced with the
  practical fact the EC2 spec supports: the host is arm64, so host binaries and images
  need arm64 builds.
- "The CPU runs orchestration, tokenization, KV-cache scheduling": unsourced role list.
- "For traditional collective patterns ... already strong. The architectural decision
  that matters more": framing with no source; one sentence on all-to-all remains.
- "Targeted at frontier training and large-scale MoE inference" and "The right pick when
  the workload needs either the larger HBM or the FP4 throughput": unsourced; replaced by
  the table's "Pick it for" column.
- "the CUDA address space spans both" and "KV-cache offload, embedding stores ... all
  benefit": not in the register. Kept only the coherence (nvlinkC2c) and the topology
  reading that an offloaded KV cache returns over NVLink-C2C.
- GB300 "same NVLink topology": AWS gives no figure for it.
- "The 72-GPU domain is large enough to host DeepSeek-class MoE end-to-end": merged into
  the sourced 64-of-72 sentence.

## UNKNOWNs

- G14: cut.
- G15: version kept (v0.21.0 "Added large-scale EP support"); "up to 64" cut, since the
  README states no maximum and its example is 32-way EP.
- G16: reframed as fit, not intent.

## NEW content

- G24: UltraServer table, u-p6e-gb200x72 (72 GPUs, 13,320 GB, 28,800 Gbps EFA) and
  u-p6e-gb200x36 (36 GPUs, 6,660 GB, 14,400 Gbps) (p6Page T2); p6e-gb200.36xlarge is 4 x
  B200 at 4 x 185 GiB on a Grace arm64 host (ec2AcceleratedSpecs T1); P6e-GB200 only in
  UltraServers (p6Page).
- G25: P6e-GB300 through the AWS sales representative (p6eGb300Ga T2); absent from the
  EC2 instance spec (ec2AcceleratedSpecs T1) and the UltraServer Capacity Blocks table
  (capacityBlocks T1).
- G26: GPU memory appears to the OS as NUMA nodes on GB200/GB300 NVL72; bind host memory
  to CPU nodes (`numactl -m 0,1`); CDMM from R580 keeps GPU memory out of the NUMA map;
  with CDMM on, online EPLB needs GDRCopy (wideEpReadme T1).
- G27: Vera Rubin NVL72 keeps 72 GPUs / 36 CPUs with 20.7 TB HBM4 (veraRubinNvl72 T2), in
  full production at partners (nvidiaQ2Fy27 T1), no Rubin EC2 instance as of October 2026
  (ec2AcceleratedSpecs T1). Rubin NVLink 6 figures left out: the two NVIDIA pages
  disagree (3 vs 3.6 TB/s per GPU) and the NVL72 page's NVLink row has no direction label.
- G21 numbers, in an ExpandableSection inside the AWS block.
- **Doc-vs-doc conflict found during authoring (not in the register):** the P6 page gives
  400 Gbps EFAv4 per GPU and 28,800 Gbps per 72-GPU UltraServer (1.6 Tbps per four-GPU
  instance), while both the EC2 instance spec and the P6 page's instance table list 3.2
  Tbps of network bandwidth per p6e-gb200.36xlarge (800 Gbps per GPU). The page shows
  both, giving 18x and 9x, and states that neither EFA figure carries a direction label.
- Wide-EP README link (pinned v1.2.1) as the place to start, with its 32-way EP example
  (wideEpReadme T1).

## Diagram

`Nvl72Diagram.tsx` rebuilt. `viewBox="0 0 880 430"`, `role="img"`,
`aria-labelledby="nvl72-title"` with an asserting `<title>`, `aria-label` removed, fixed
`height` removed, full-bleed white rect, Idiom A classes prefixed `nvl-`, fonts 11 to 13px
sans-serif (the 9px GPU labels are gone), no em-dashes or arrows-as-text. Content:
36 superchip tiles (two GPU squares and one Grace bar each, with a legend) inside a dashed
"One NVLink domain" boundary; six row stubs into an NVLink Switch box (non-blocking,
1.8 TB/s per GPU bidirectional, 900 GB/s each way, 130 TB/s aggregate); a superchip
detail panel (Grace, 72 Neoverse V2, 480 GB LPDDR5X; NVLink-C2C 900 GB/s bidirectional,
coherent; two GPUs at 186 GB HBM3e each, derived from 372 GB per superchip); below the
boundary, the DeepSeek-R1 layout box (64 GPUs, 8 to spare) and an arrow out to "Beyond
the domain: EFA". The 72 low-opacity lines that crossed the GPU labels are gone. Every
figure is cited in the caption the section renders under the SVG.

Mobile: the SVG keeps `minWidth: 640` inside an `overflowX: auto` wrapper, as in
BlackwellDieDiagram.

Rendered check (`scripts/shoot.mjs`, build in /tmp/silicon-dist-grace-blackwell): probe
reported "1 diagram(s), ok" at 1440 and 390 (no overlaps, no viewBox clipping, no
page-level horizontal overflow). PNGs read: at 1440 every label sits inside its box, the
C2C label sits between the two link lines with clear space on both sides, the switch text
is centred with padding, the legend swatches clear their labels. At 390 the diagram
scrolls sideways inside its wrapper and stays legible; the UltraServer table scrolls
inside the Cloudscape table. Fixed after the first shoot: duplicated "36 superchips" in
the subtitle, and the UltraServer column width (code names were breaking).

## Leverage pass: claim-set diff

New assertions in the after that were not in the before, each with its source:

1. Two GPUs per superchip, on one compute module: gb200Nvl72, p6Page.
2. NVLink-C2C is the chip-level member of the NVLink family and coherent: nvlinkC2c.
3. 900 GB/s bidirectional (C2C), 1.8 TB/s bidirectional and 900 GB/s each way (NVLink 5), non-blocking: blackwellArchitecture, blackwellUltraBlog.
4. GB300 dense 720 to 1,080, sparse 1,440 on both: gb200Nvl72, gb300Nvl72.
5. Vera Rubin NVL72 shape and 20.7 TB HBM4: veraRubinNvl72. Full production: nvidiaQ2Fy27. No Rubin EC2 instance: ec2AcceleratedSpecs.
6. 186 GB per GPU: gb200Nvl72, derived (372 / 2).
7. DeepSeek-R1 eight of 256 experts; about four per GPU, 64 GPUs: moeBlog.
8. On AWS the network beyond the domain is EFA: p6Page.
9. Large-scale EP in v0.21.0, August 2025: trtllmV021 (date from the register's GitHub API read, 2025-08-04).
10. Wide-EP kernels for GB200 MNNVL; example at 32-way EP; NUMA/CDMM/GDRCopy/`numactl`: wideEpReadme.
11. 512 vs 384 GB/s, 16 W at up to 500 GB/s, on-module: gb200Nvl72, graceSuperchipPage.
12. Hopper NVLink also 900 bidirectional: blackwellUltraBlog Table 1.
13. P6e-GB200 host is arm64; 4 x B200 at 4 x 185 GiB per p6e-gb200.36xlarge; 3.2 Tbps per instance; no P6e-GB300 row: ec2AcceleratedSpecs.
14. UltraServer definition: capacityBlocks. Sizes, memory, EFA, 400 Gbps per GPU, only-in-UltraServers, P6-B200 400 Gbps per GPU: p6Page.
15. P6e-GB200 on Capacity Blocks; P6e-GB300 absent: capacityBlocks.
16. P6e-GB300 1.5x / 1.5x / close to 20 TB / sales rep: p6eGb300Ga (vendor-claim for the multipliers), p6Page.
17. 18x and 9x ratios: derived from 13 and 14, with the per-direction reading stated in the text.

Our readings, labelled as such in prose or as `derived`: "the UltraServer size is the
NVLink domain size" (capacityBlocks definition plus the P6 sizes); "a 64-GPU layout
splits across two domains on the 36-GPU size" (derived from 7 and 14); "a KV cache
offloaded to Grace memory returns over NVLink-C2C" (topology); "plan offload bandwidth
against the lower figure" and "host binaries need arm64 builds" are actions drawn from
11 and 13, adding no facts.

Length: reader-visible prose rose from about 620 to about 870 words (descriptions from
37 to about 95, now stating payoffs). The growth is the register's NEW items (G24 to G27),
the G17 conflict, the G21 numbers and the caption that cites the diagram's figures; the
cut list above removed the rest.

## For the orchestrator

- `sources.md` needs regenerating (`vitest -u` on `src/__tests__/sources.test.ts`) for
  the 16 records here. New URLs not yet in any other file: wide_ep README at v1.2.1 (T1),
  TensorRT-LLM v0.21.0 release tag (T1), aws-graviton-getting-started README at
  8b322a4 (T1), NVLink-C2C page (T2), Grace CPU Superchip page (T2), NVIDIA MoE blog (T2).
- `GlossaryAndSources.tsx` still lists the wide_ep example on `main` (id 11) and the MoE
  blog as type `aws-blog` (id 20); both are the orchestrator's.
- Glossary acronyms used here: NVLink-C2C, NVL72, HBM3e, HBM4, LPDDR5X, NVFP4, PFLOPS,
  MoE, EP, EPLB (only in this report), MNNVL, EFA, EFAv4, KV, NUMA, CDMM, GDRCopy (name).
- Other sections still carry claims this register corrected: `MoeAndSparseActivation.tsx:26`
  ("Wide-EP (EP > 8) shipped in TensorRT-LLM v0.21.0 ... NVFP4 cubins ... in v1.0").
- The EFA per-GPU conflict above (400 vs 800 Gbps) is worth adding to the register and
  to `Communication and Scale-Out` if that section quotes P6e EFA figures.
- Cross-links by name: NVIDIA Compilers and Kernel Tooling; DDR5, MRDIMM, LPDDR5X and CXL;
  Graviton Deep Dive; the vLLM dive's KV Offloading and LMCache (`../vllm/`).
