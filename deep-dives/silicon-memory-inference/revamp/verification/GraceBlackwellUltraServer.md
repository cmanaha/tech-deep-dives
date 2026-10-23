# Verification: Grace-Blackwell and UltraServer

Verified: 2026-10-23. Claims checked: 54 (sampled: 0). Confirmed 48, wrong 0, unsupported 4,
mislabelled 2, unverifiable 0.

Fetched on 2026-10-23 with curl's default User-Agent or the GitHub API: the AWS P6 page, EC2
accelerated instance specification, Capacity Blocks page, P6e-GB300 What's New post; NVIDIA GB200
NVL72, GB300 NVL72, Vera Rubin NVL72, NVLink-C2C, Grace CPU Superchip and Blackwell architecture
pages; the Blackwell Ultra and MoE/Dynamo blogs; the TensorRT-LLM wide_ep README at v1.2.1, the
v0.21.0 release and the v1.2.1 tag ref; the aws-graviton-getting-started README at 8b322a4; the
NVIDIA R580 (580.65.06) data center release notes. SEC EDGAR refused the default request for the
NVIDIA Q2 FY27 8-K exhibit (HTTP 403, "Undeclared Automated Tool"); I read the Wayback Machine copy
(snapshot 2026-10-03) instead. No personal data was sent in any request.

## Gate 3 score: 8/10

Every figure the section leans on holds against its source: the NVL72 configuration and memory
totals, dense and sparse FP4 on both racks, the 1.8 TB/s non-blocking fabric, the 64-of-72 expert
layout, the UltraServer sizes, and the CDMM and NUMA guidance. The fixes were labels and scope:
the P6 page's own instance table was missing from the EFA conflict, "soldered" had no source, the
each-way and aggregate NVLink figures lacked their derivation and direction, and two phrases
overreached their sources (Rubin production, CDMM platforms). Economy is the weakest criterion:
growth of about 40% is mostly register-required, but the caption and the GB300 table cell are
dense.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 48 of 54 confirmed; nothing wrong. Four unsupported as worded (EFA conflict incomplete, "soldered", "full production at partners", CDMM platform scope) and two mislabelled (900 GB/s each way cited as spec, 130 TB/s with no direction), all fixed. None load-bearing for a purchase decision |
| Mental model or practical value | 9 | Model: one NVLink domain, so the boundary to plan around is its edge; 64 of 72 GPUs for NVIDIA's DeepSeek-R1 layout. Practice: x72 versus x36 for the layout, `numactl -m 0,1` or CDMM, GDRCopy for online EPLB, arm64 host builds, plan offload at 384 GB/s, GB300 through sales. Every block does one of the two |
| Shape | 8 | h1 introduces superchip and rack before the diagram dissects them; every h2 description states a payoff; 1.8 TB/s and 64-of-72 each land at least twice (h2 description, body, diagram); the EFA arithmetic sits in an ExpandableSection; ends on the UltraServer table's "Pick it for" column |
| Writing | 8 | no-ai-tells clean in my files; things defined by what they are ("P6e-GB200 is AWS's GB200 NVL72"). Attributions in sentences are the conflict case ("Two NVIDIA pages disagree", "the P6 page's prose gives") or a verbatim quote. The P6e-GB300 "Pick it for" cell stacks four citations in two sentences and reads heavily |
| Economy | 7 | Visible prose about 620 to 870 words (+40%, author's count), plus about 30 words from my fixes. Growth is register-required (UltraServer table, NUMA/CDMM, Rubin, both EFA figures). The diagram caption lists a citation for every drawn figure and runs long; the P6-B200 comparison at the end of the ExpandableSection is a second thought inside one paragraph |
| Diagrams | 9 | Inline SVG, `role="img"`, `aria-labelledby` title stating the assertion; probe "1 SVG diagram(s), 0 React Flow, ok" at 1440 and 390; at 1440 the new "bidirectional" line under "130 TB/s aggregate" sits inside the switch box with padding; at 390 it scrolls sideways at 640 px per the dive convention and stays legible |

## Claims

All claims were checked; none sampled. Section text and diagram text are both in scope (the
section and diagram were rebuilt, so every claim is new).

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | Superchip: one Grace CPU with two Blackwell GPUs on one compute module | gb200Nvl72, p6Page | CONFIRMED | GB200 spec table: "GB200 Grace Blackwell Superchip ... 1 Grace CPU \| 2 Blackwell GPU". P6: "2 GPUs and 1 CPU are co-located within one compute module" | |
| 2 | NVLink-C2C is the chip-level member of the NVLink family and joins them coherently | nvlinkC2c | CONFIRMED | "Extending NVLink to chip-level integration"; "extends the industry-leading NVLink technology to a chip-to-chip interconnect"; "high-bandwidth, coherent data transfers" | |
| 3 | NVLink-C2C at 900 GB/s bidirectional (text, column header, diagram) | blackwellArchitecture | CONFIRMED | "the NVIDIA Grace CPU over a high-speed link, 900 gigabytes per second (GB/s) of bidirectional bandwidth" | |
| 4 | GB200 NVL72: 36 superchips, 72 GPUs, 36 Grace CPUs, one NVLink domain (text, diagram title, legend) | gb200Nvl72 | CONFIRMED | "Configuration 36 Grace CPU \| 72 Blackwell GPUs"; "a 72-GPU NVIDIA NVLink domain" | |
| 5 | 13.4 TB HBM3e and 17 TB LPDDR5X per rack (text, diagram subtitle) | gb200Nvl72 | CONFIRMED | "GPU Memory \| Bandwidth 13.4 TB HBM3E \| 576 TB/s"; "CPU Memory \| Bandwidth 17 TB LPDDR5X \| 14 TB/s" | |
| 6 | Non-blocking NVLink Switch fabric, 1.8 TB/s bidirectional per GPU (text, h2 description, diagram) | blackwellUltraBlog | CONFIRMED | "Per-GPU Bandwidth: 1.8 TB/s bidirectional (18 links x 100 GB/s)"; "576 GPUs in non-blocking compute fabric" | |
| 7 | 900 GB/s each way (text, ExpandableSection, diagram) | blackwellUltraBlog | MISLABELLED (kind) | The blog gives only the bidirectional 1.8 TB/s; 900 each way is our halving, cited as a spec | Note added to the intro cite (as in Chiplet and Interconnect); ExpandableSection and caption cites now `derived`, note "1.8 TB/s bidirectional per GPU / 2" |
| 8 | Aggregate NVLink bandwidth 130 TB/s (text, diagram) | gb200Nvl72 | MISLABELLED (direction) | GB200: "NVLink Bandwidth 130 TB/s"; Blackwell Ultra blog lists "72-GPU NVL72 configurations with 130 TB/s aggregate bandwidth" under the bidirectional per-GPU spec. 72 x 1.8 = 129.6, so it is a sum of bidirectional figures; neither page labels it | Text "130 TB/s bidirectional" with a `derived` cite stating the sum and that neither page labels it; diagram line "bidirectional" under "130 TB/s aggregate" |
| 9 | GB300 NVL72 raises GPU memory to 20 TB | gb300Nvl72 | CONFIRMED | "GPU Memory \| Bandwidth 20 TB \| Up to 576 TB/s" | |
| 10 | Dense NVFP4 720 to 1,080 PFLOPS; sparse 1,440 on both | gb200Nvl72, gb300Nvl72 | CONFIRMED | GB200: "NVFP4 Tensor Core 1,440 \| 720 PFLOPS", footnote "Specification in sparse \| dense". GB300: "FP4 Tensor Core 1440 \| 1080 [2] PFLOPS", "1. All Tensor Core specifications are with sparsity unless otherwise noted. 2. Without sparsity." GB300 labels the row "FP4"; the cite note says so | |
| 11 | Vera Rubin NVL72: 72 GPUs, 36 CPUs, 20.7 TB HBM4 | veraRubinNvl72 | CONFIRMED | "Configuration 72 NVIDIA Rubin GPUs \| 36 NVIDIA Vera CPUs"; "GPU Memory \| Bandwidth 20.7 TB HBM4 \| 1,400 TB/s" | |
| 12 | Vera Rubin "is in full production at partners" | nvidiaQ2Fy27 | UNSUPPORTED (as worded) | Archived 8-K exhibit (Aug. 26, 2026): "Vera Rubin, now in full production"; "the NVIDIA Vera Rubin platform is ramping into full production with racks running at partners including CoreWeave, Google Cloud, Microsoft Azure, Oracle Cloud Infrastructure and Nebius." Production is NVIDIA's; racks run at partners | "is in full production, with racks running at partners" |
| 13 | As of October 2026 the EC2 specification lists no Rubin instance | ec2AcceleratedSpecs | CONFIRMED | Families list (2026-10-23) ends the P line at "P6e-GB200 p6e-gb200.36xlarge"; no Rubin or p6e-gb300 row. Hedge scoped to the page | |
| 14 | 186 GB HBM3e per GPU (diagram, derived) | gb200Nvl72 | CONFIRMED | Superchip column "372 GB HBM3E"; 372 / 2 = 186 | |
| 15 | Grace: 72 Neoverse V2 cores, 480 GB LPDDR5X on the module (diagram) | gb200Nvl72, graceSuperchipPage | CONFIRMED | GB200: "72 Arm Neoverse V2 cores"; "Up to 480 GB LPDDR5X". Grace page: "120GB, 240GB and 480GB on-module memory options available" | |
| 16 | Diagram: 256 routed experts at about 4 per GPU needs 64 GPUs; 72-GPU domain holds it with 8 to spare | moeBlog | CONFIRMED | "typically around four experts per GPU, which requires 64 GPUs to accommodate the full 256 routed experts during decoding"; 72 - 64 = 8 | |
| 17 | Beyond the domain: EFA (diagram; "On AWS the network beyond the domain is EFA") | p6Page | CONFIRMED | "P6e UltraServers and P6 instances use fourth-generation Elastic Fabric Adapter networking (EFAv4)" | |
| 18 | MoE all-to-all: every GPU sends tokens to experts on other GPUs | moeBlog | CONFIRMED | "Each incoming token is routed to the selected experts, which then perform computations and exchange results via all-to-all GPU communication" | |
| 19 | DeepSeek-R1 sends each token to eight of 256 routed experts | moeBlog | CONFIRMED | "each token is sent to eight experts out of the full pool of 256" | |
| 20 | Quote: "If the selected experts reside on GPUs ... such as InfiniBand." | moeBlog | CONFIRMED | Verbatim in "Leveraging NVIDIA GB200 NVL72 NVLink architecture" | |
| 21 | Wide-EP carries the all-to-all over GB200 MNNVL | wideEpReadme | CONFIRMED | v1.2.1: "Custom EP communication kernels optimized for NVIDIA GB200 Multi-Node NVLink (MNNVL)" | |
| 22 | Large-scale EP shipped in TensorRT-LLM v0.21.0 (August 2025) | trtllmV021 | CONFIRMED | GitHub API: v0.21.0 published_at 2025-08-04; notes: "Added large-scale EP support" | |
| 23 | Wide-EP configuration example is DeepSeek R1 at 32-way EP | wideEpReadme | CONFIRMED | "Set to number of total experts + EP size, such as 288 for DeepSeek R1, 32-way EP." | |
| 24 | Each Grace carries up to 480 GB LPDDR5X | gb200Nvl72 | CONFIRMED | Superchip column: "Up to 480 GB LPDDR5X \| Up to 512 GB/s" | |
| 25 | "soldered on the compute module it shares with its two GPUs" | p6Page | UNSUPPORTED ("soldered") | No fetched page says soldered. P6: "2 GPUs and 1 CPU are co-located within one compute module"; Grace page: "on-module memory options" | "as on-module memory" with a graceSuperchipPage cite quoting the column, then "on the compute module it shares with its two GPUs" (p6Page) |
| 26 | The memory draws about 16 W at up to 500 GB/s | graceSuperchipPage | CONFIRMED | "It delivers up to 500 GB/s in only about 16W, approximately one fifth the power of conventional DDR5 memory" | |
| 27 | Up to 512 GB/s per GB200 superchip | gb200Nvl72 | CONFIRMED | "Up to 480 GB LPDDR5X \| Up to 512 GB/s" | |
| 28 | Up to 384 GB/s for a 480 GB Grace | graceSuperchipPage | CONFIRMED | Grace CPU C1 column: "Up to 384 GB/s for 480GB Up to 512 GB/s for 120GB, 240GB" | |
| 29 | C2C's 900 GB/s bidirectional is the figure Hopper's NVLink gives a whole GPU | blackwellUltraBlog | CONFIRMED | Table 1 "(in BiDir GB/s)": "NVLink (GPU-GPU) 900 1,800 1,800"; "NVLink-C2C (CPU-GPU) 900 900 900" | |
| 30 | GPU memory on GB200 and GB300 NVL72 appears as NUMA nodes; bind to CPU nodes with `numactl -m 0,1` | wideEpReadme | CONFIRMED | "GPU memory is also on NUMA nodes on GB200/GB300 NVL72 and the system can also use that. Bind memory to CPU nodes to avoid GPU memory being used as host memory. numactl -m 0,1 <command>" | |
| 31 | CDMM, from the R580 driver, keeps GPU memory out of the NUMA map | wideEpReadme | UNSUPPORTED (scope) | README and NVIDIA's R580 notes (580.65.06, "Hardware and Software Support"): "The R580 Driver introduces Coherent Driver-Based Memory Management (CDMM) for GB200 platforms ... CDMM avoids OS onlining of the GPU memory and the exposing of the GPU memory as a NUMA node to the OS." The mechanism holds; both documents scope it to GB200, while the sentence follows "GB200 and GB300" | "(CDMM, introduced for GB200 platforms in the R580 driver)" |
| 32 | With CDMM on, online EPLB needs GDRCopy | wideEpReadme | CONFIRMED | "When CDMM mode is on, GPU memory doesn't exist in NUMA nodes. In that case, if online EPLB is needed, GDRCopy needs to be installed." R580 notes: "To use GDRCopy with CDMM, please use version 2.5.1 or later" | |
| 33 | Each Grace has 72 Arm Neoverse V2 cores | gb200Nvl72 | CONFIRMED | "72 Arm Neoverse V2 cores" (superchip column) | |
| 34 | Neoverse V2 is the core Graviton4 uses | gravitonReadme | CONFIRMED | README at 8b322a4, "Building for Graviton" table: "Core ... Graviton4 ... Neoverse-V2" | |
| 35 | The P6e-GB200 host is arm64 | ec2AcceleratedSpecs | CONFIRMED | Family summary: "P6e-GB200 Nitro v5 NVIDIA Grace (arm64)" | |
| 36 | P6e-GB200 is AWS's GB200 NVL72 | p6Page | CONFIRMED | "P6e UltraServers, accelerated by NVIDIA GB200 NVL72" | |
| 37 | UltraServer: EC2 unit joining instances over the accelerator interconnect | capacityBlocks | CONFIRMED | "UltraServers connect multiple Amazon EC2 instances within a low-latency, high-bandwidth accelerator interconnect." | |
| 38 | Only as an UltraServer, of 72 or 36 GPUs | p6Page | CONFIRMED | "*P6e-GB200 instances are only available in UltraServers"; UltraServer table rows u-p6e-gb200x72 (72) and u-p6e-gb200x36 (36) | |
| 39 | p6e-gb200.36xlarge: four B200 (4 x 185 GiB) on a Grace arm64 host | ec2AcceleratedSpecs | CONFIRMED | "p6e-gb200.36xlarge 960.00 Nvidia Grace CPU 144 144 1 4 x NVIDIA B200 GPU 740 GiB (4 x 185 GiB)". Unit question under Backlog | |
| 40 | P6e-GB200 UltraServers can be reserved through Capacity Blocks for ML | capacityBlocks | CONFIRMED | "UltraServer Capacity Blocks Instance type ... Trn2 ✓ P6e-GB200 ✓" | |
| 41 | "Beyond it, AWS gives 400 Gbps of fourth-generation EFA per GPU" | p6Page | UNSUPPORTED (incomplete) | P6 prose: "400 GB ps per GPU of EFAv4 networking for a total of 28.8 Tbps per P6e-GB200 UltraServer". Its own instance table: "p6e-gb200.36xlarge 4 740 HBM3e 144 960 3 x 7.5 3.2 60 Yes*" under "Network bandwidth (Tbps)", 800 per GPU. The sentence credited the 3.2 Tbps only to the instance specification | "the P6 page's prose gives 400 Gbps ..."; "The P6 page's own instance table and the instance specification both give 3.2 Tbps", each cited |
| 42 | 50 GB/s, 18 times less (derived) | p6Page | CONFIRMED | 400 / 8 = 50 GB/s; 900 / 50 = 18 | |
| 43 | 3.2 Tbps per four-GPU p6e-gb200.36xlarge | ec2AcceleratedSpecs, p6Page | CONFIRMED | Spec network table: "P6e-GB200 p6e-gb200.36xlarge 2 3200 Gigabit"; P6 instance table 3.2 | p6Page cite added (claim 41) |
| 44 | 100 GB/s per GPU, 9 times less (derived) | ec2AcceleratedSpecs | CONFIRMED | 3,200 / 4 = 800 Gbps = 100 GB/s; 900 / 100 = 9 | |
| 45 | Neither EFA figure carries a direction label | p6Page, ec2AcceleratedSpecs | CONFIRMED | Neither page states a direction for EFA bandwidth | |
| 46 | Nine 8-GPU P6-B200 nodes get 400 Gbps per GPU in NVLink domains of eight; a 64-GPU layout spans eight nodes | p6Page | CONFIRMED | "3.2 Tbps per P6-B200 instance"; instance table "p6-b200.48xlarge 8 ... 3.2"; "8x NVIDIA Blackwell GPUs ... up to 14.4 TBp/s of total bidirectional NVLink bandwidth" (8 x 1.8); 64 / 8 = 8 | "the same 400 Gbps" to "400 Gbps", since "the same" now points at a contested figure |
| 47 | u-p6e-gb200x72: 72 B200, 13,320 GB, 28,800 Gbps aggregate EFA | p6Page | CONFIRMED | "u-p6e-gb200x72 72 13,320 2,592 17,280 405 28,800 1,080 Yes" | |
| 48 | u-p6e-gb200x36: 36 B200, 6,660 GB, 14,400 Gbps | p6Page | CONFIRMED | "u-p6e-gb200x36 36 6,660 1,296 8,640 202.5 14,400 540 Yes" | |
| 49 | P6e-GB300: close to 20 TB GPU memory per UltraServer; P6 page lists no sizes or per-GPU memory | p6Page | CONFIRMED | "With close to 20TB of GPU memory per UltraServer"; neither the instance nor the UltraServer table has a P6e-GB300 row | |
| 50 | No P6e-GB300 EFA figure on the P6 page (aggregate column) | p6Page | CONFIRMED | No P6e-GB300 aggregate. The prose "P6e UltraServers and P6 instances provide 400 GB ps per GPU" is generic and predates the GB300 and B300 rows (P6-B300 is "6.4 Tbps", 800 per GPU, on the same page) | |
| 51 | P6e-GB300: 1.5x GPU memory and 1.5x FP4 without sparsity vs P6e-GB200 (vendor-claim) | p6eGb300Ga | CONFIRMED | Posted Dec 2, 2025: "provide 1.5x GPU memory and 1.5x FP4 compute (without sparsity) compared to P6e-GB200". The P6 page repeats it | |
| 52 | Ask your AWS sales representative | p6eGb300Ga | CONFIRMED | "To get started with P6e-GB300 UltraServers, please contact your AWS sales representative." | |
| 53 | P6e-GB300 absent from the EC2 specification and the UltraServer Capacity Blocks table | ec2AcceleratedSpecs, capacityBlocks | CONFIRMED | No p6e-gb300 row in the specification; UltraServer Capacity Blocks lists Trn2 and P6e-GB200 only | |
| 54 | Tiers, kinds and pins for all 16 records | all | CONFIRMED | AWS docs, 8-K exhibit and pinned GitHub (wide_ep at v1.2.1, release tag v0.21.0, Graviton README at SHA 8b322a4) Tier 1; product pages, What's New and NVIDIA blogs Tier 2. Every shared URL has the same tier in every other source file (grep). The vendor-claim on 1.5x is marked | |

## ORCH-NOTES items

- **EFA per GPU on P6e-GB200 and P6e-GB300: FIXED (both figures named, P6 self-conflict
  stated).** The ExpandableSection credited 400 Gbps to "AWS" and the 3.2 Tbps only to the
  instance specification. It now follows Communication and Scale-Out's wording: "the P6 page's
  prose gives 400 Gbps of fourth-generation EFA per GPU" (P6: "400 GB ps per GPU of EFAv4
  networking for a total of 28.8 Tbps per P6e-GB200 UltraServer") and "The P6 page's own instance
  table and the instance specification both give 3.2 Tbps per four-GPU p6e-gb200.36xlarge" (P6
  instance table "3.2" under "Network bandwidth (Tbps)"; specification "3200 Gigabit"), each cited,
  with both ratios (18x and 9x) and their derived notes kept. Records reused: p6Page,
  ec2AcceleratedSpecs, the same URLs and tiers as Communication and Disaggregated Serving. The
  UltraServer table's 28,800 and 14,400 Gbps are the P6 page's UltraServer table, which agrees
  with the 400 figure. P6e-GB300: the section gives no EFA figure and says the P6 page has none,
  which holds for an aggregate; the P6 page's generic "P6e UltraServers ... 400 GB ps per GPU"
  prose is the only candidate. NVIDIA's GB300 NVL72 page gives 800 Gb/s per GPU through ConnectX-8
  for its reference rack (not an AWS figure, not quoted).
- **GB200 and GB300 NVL72 figures: CONFIRMED, two labels fixed.** FP4: GB200 "1,440 \| 720
  PFLOPS" footnoted "sparse \| dense"; GB300 "1440 \| 1080" with 1080 footnoted "Without
  sparsity"; the text labels dense and sparse. NVLink 5: 1.8 TB/s per GPU labelled bidirectional;
  the 900 GB/s each-way figure is now marked as our halving (claim 7); 130 TB/s is now labelled
  bidirectional, with a derived note (72 x 1.8 = 129.6) saying neither page labels it (claim 8),
  in the text and the diagram. NVLink-C2C 900 GB/s labelled bidirectional in text, column header
  and diagram (Blackwell architecture page: "900 gigabytes per second (GB/s) of bidirectional
  bandwidth"). Grace LPDDR5X: 480 GB per Grace, 17 TB per rack, 512 vs 384 GB/s shown as a
  conflict with both cited. HBM per GPU: 186 GB (derived 372 / 2) for GB200 in the diagram; no
  per-GPU HBM is quoted for GB300. B300 stack count: not mentioned in this section, so nothing to
  align with NVIDIA Blackwell; its GB300 rack figures (1,440 sparse, 1,080 dense) match.
- **AWS UltraServer sizes: CONFIRMED.** u-p6e-gb200x72 (72 GPUs, 13,320 GB, 28,800 Gbps) and
  u-p6e-gb200x36 (36, 6,660, 14,400) match the P6 page's UltraServer table verbatim. P6e-GB300 has
  no size on the P6 page, in the specification or in Capacity Blocks; the section says so.
- **Rubin and Vera figures: COMPLIANT (no bandwidth or Vera memory quoted).** The section quotes
  only Vera Rubin NVL72's shape and "20.7 TB HBM4" (Vera Rubin NVL72 page). No Rubin HBM4
  bandwidth appears, so no page needs naming; the same page gives 19.2 TB/s per GPU. No Vera
  LPDDR5X or SOCAMM capacity appears (the Vera Rubin NVL72 page gives "Up to 1.5 TB LPDDR5X" per
  superchip). The production sentence was reworded to the filing (claim 12).
- **CDMM and the NUMA view: CONFIRMED against NVIDIA's documentation, scope fixed.** NVIDIA's
  R580 release notes (580.65.06, "Hardware and Software Support") state: "The R580 Driver
  introduces Coherent Driver-Based Memory Management (CDMM) for GB200 platforms. With CDMM, the
  driver manages GPU memory instead of the OS. CDMM avoids OS onlining of the GPU memory and the
  exposing of the GPU memory as a NUMA node to the OS." The wide_ep README at v1.2.1 repeats this
  and adds "GPU memory is also on NUMA nodes on GB200/GB300 NVL72 ... Bind memory to CPU nodes"
  with `numactl -m 0,1`, and "When CDMM mode is on ... if online EPLB is needed, GDRCopy needs to
  be installed." The section matched these except for scope: CDMM is documented for GB200
  platforms, so the parenthesis now says so.

## Fixes applied

- `src/sections/GraceBlackwellUltraServer.tsx:107-118`: the intro cite for "1.8 TB/s
  bidirectional, 900 GB/s each way" gained the note "1.8 TB/s bidirectional per GPU (18 links x
  100 GB/s); 900 GB/s each way is half of that."; "aggregate NVLink bandwidth is 130 TB/s." became
  "aggregate NVLink bandwidth is 130 TB/s bidirectional." with a `derived` blackwellUltraBlog cite
  ("72 GPUs x 1.8 TB/s bidirectional = 129.6 TB/s, which NVIDIA gives as 130 TB/s aggregate;
  neither page labels the aggregate's direction.").
- `:130-131`: "is in full production at partners" became "is in full production, with racks
  running at partners".
- `:159-166` (diagram caption): "; non-blocking 1.8 TB/s per GPU [cite]" now continues "; 900 GB/s
  each way and the aggregate's direction [derived cite: 1.8 / 2 = 900; 72 x 1.8 = 129.6, given as
  130]".
- `:235-241`: "soldered on the compute module it shares with its two GPUs. [p6Page]" became "as
  on-module memory [graceSuperchipPage, note quoting the C1 column], on the compute module it
  shares with its two GPUs. [p6Page]".
- `:270`: "(CDMM, from the R580 driver)" became "(CDMM, introduced for GB200 platforms in the R580
  driver)".
- `:314-321`: the each-way NVLink cite is now `derived` ("1.8 TB/s bidirectional per GPU / 2.");
  "Beyond it, AWS gives 400 Gbps" became "Beyond it, the P6 page's prose gives 400 Gbps"; "The
  instance specification's 3.2 Tbps per four-GPU p6e-gb200.36xlarge [ec2] works out to" became
  "The P6 page's own instance table and the instance specification both give 3.2 Tbps per four-GPU
  p6e-gb200.36xlarge [p6Page] [ec2], which works out to".
- `:329`: "get the same 400 Gbps per GPU" became "get 400 Gbps per GPU".
- `src/components/Nvl72Diagram.tsx:152-154`: added a "bidirectional" line (class `nvl-sc`, y=288)
  under "130 TB/s aggregate" in the switch box.
- `src/sources/GraceBlackwellUltraServer.ts`: unchanged (no new record; the fixes reuse existing
  records).

## Checks

- `pnpm exec tsc --noEmit 2>&1 | grep -E "GraceBlackwellUltraServer|Nvl72Diagram|sources/GraceBlackwellUltraServer"`:
  no match, "no type errors in my files".
- `pnpm exec eslint src/sections/GraceBlackwellUltraServer.tsx src/sources/GraceBlackwellUltraServer.ts src/components/Nvl72Diagram.tsx --max-warnings 0`:
  exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t GraceBlackwellUltraServer`: exit 0 (1
  passed, 34 skipped).
- Gates from the repo root: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0,
  pre-overflow exit 0; no hits for GraceBlackwellUltraServer or Nvl72Diagram in any output.
- `pnpm exec vite build --outDir /tmp/vf-GraceBlackwellUltraServer-dist --emptyOutDir`: exit 0.
- `node scripts/shoot.mjs --sections grace-blackwell --widths 1440,390 --out /tmp/vf-GraceBlackwellUltraServer-shots --dist /tmp/vf-GraceBlackwellUltraServer-dist`:
  "grace-blackwell @1440: 1 SVG diagram(s), 0 React Flow, ok" and the same at 390; exit 0. PNGs
  read: at 1440 the new "bidirectional" line sits centred under "130 TB/s aggregate" inside the
  switch box with clear space above the box edge; the stubs end at the box's left edge and cross
  no text. At 390 the diagram scrolls sideways at 640 px and stays legible; the full page shows the
  revised ExpandableSection and table wrapping inside their containers.

## For the orchestrator

- `sources.md` needs regenerating (`vitest -u` on `src/__tests__/sources.test.ts`) for the new
  cites with notes on existing records (blackwellUltraBlog derived twice, graceSuperchipPage,
  p6Page); no new URL. The author's earlier sources.md and GlossaryAndSources items still stand.
- Other sections carry the two NVLink labels fixed here: `MemoryHierarchyPrimer.tsx:173` ("900
  GB/s each way" cited to blackwellUltraBlog as a spec, not derived), `MoeAndSparseActivation.tsx:42`
  ("130 TB/s per rack") and `EdgeSharedMemorySilicon.tsx:359` ("130 TB/s of aggregate bandwidth")
  give the aggregate without a direction. Disaggregated Serving and Chiplet and Interconnect
  already mark the halving.
- Any section that says CDMM applies to GB300: NVIDIA's R580 notes and the wide_ep README scope it
  "for GB200 platforms".

## Backlog

- The GB200 NVL72 page's own rack total, "17 TB LPDDR5X \| 14 TB/s", is about 389 GB/s per Grace
  (14,000 / 36), which agrees with the Grace page's 384 GB/s and not with the superchip column's
  512 GB/s. It would strengthen "plan against the lower figure" with NVIDIA's own arithmetic.
- The EC2 specification lists P6e-GB200 GPU memory as "740 GiB (4 x 185 GiB)"; the P6 page's
  column is "GPU memory (GB) 740". 185 GiB is 198.6 GB, above the 192 GB of HBM3e the Blackwell
  Ultra blog gives a Blackwell GPU (Table 2), so the specification's GiB label is probably wrong.
  The section quotes the specification verbatim; a later pass could use the P6 page's GB or name
  the unit conflict.
- NVIDIA's R580 notes add practical CDMM facts the section omits: NVIDIA recommends CDMM for
  Kubernetes clusters ("to resolve potential memory over-reporting"), the switch is
  `NVreg_CoherentGPUMemoryMode=driver`, GDRCopy needs 2.5.1 or later, and "GPU Direct Storage is
  not supported with CDMM".
- The h1 reads "Grace-Blackwell and the NVL72 UltraServer"; the nav and `sectionTitles.ts` read
  "Grace-Blackwell and UltraServer".
- The P6e-GB300 "Pick it for" cell carries four citations in two sentences; splitting the
  "how to get it" half into the prose above the table would read more cleanly.
