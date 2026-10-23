# Verification: Intel Xeon 6

Verified: 2026-10-23. Claims checked: 79 (sampled: 0, every claim verified). Confirmed 75,
wrong 0, unsupported 3, mislabelled 1, unverifiable 0.

Sources were fetched on 2026-10-23 with curl's default User-Agent and no personal data in any
request. Intel Xeon 6 family brief: both the PDF (cdrdv2 845771) and the HTML brief page returned
200, and the HTML page carries every figure this section cites. The Intel 6700/6500 brief PDF,
the Chips and Cheese r8i article, the EC2 gp/co/mo specification pages, the M8i and R8i product
pages, the Intel Hot Chips 2026 newsroom article and the Xeon 6+ product page all returned 200.
LLVM at llvmorg-23.1.3 and oneDNN at v3.13.4 were read from raw.githubusercontent.com at those
tags, and the IPEX README at commit 6d3ba89. The GitHub API confirmed the commit date and
`archived: true`. GitHub returned 429 for Linux `xstate.rst` at v6.19, so it was read from the
same tag on git.kernel.org (`plain/Documentation/arch/x86/xstate.rst?h=v6.19`).

## Gate 3 score: 8/10

Every load-bearing figure holds against its source: the r8i topology, the 160 MB per node, the
measured latencies and bandwidth, the per-node arithmetic, the AMX and oneDNN mechanics, and the
EC2 sizes. The four fixes were scope and citation corrections, and none changed a number. The
section gives the reader a working model (an r8i chip is three NUMA nodes, and decode is bound
by DRAM bandwidth) plus concrete actions (`numactl` binding, `ONEDNN_VERBOSE`,
`ONEDNN_MAX_CPU_ISA`, drop IPEX). It is held below 9 by length: it grew 27%, and the oneDNN
alert is dense.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 75 of 79 confirmed on first check. The 4 fixes were scope or citation: the r8i AMX FP16 cite, "next P-core Xeon", the h1 description's scope and the brief record title. None was a wrong number. |
| Mental model or practical value | 8 | The NUMA-node model, the decode ceiling (bandwidth / model bytes), the measured cost of not binding, the oneDNN tier check and the IPEX action all earn their place. The roadmap paragraph is the thinnest block, but it still tells the reader which next parts carry a matrix unit. |
| Shape | 8 | The h1 introduces Xeon 6 before the r8i dissection. Every h2 description states its payoff. 160 MB per node lands five times and 230.4 GB/s twice. The instruction list and IPEX are demoted into expandables. It ends on "Before you benchmark". The oneDNN alert could be partly demoted. |
| Writing | 8 | The no-ai-tells gate is clean. Attribution in sentences is load-bearing: "Intel rates" and "AWS claims" are vendor claims, "Intel's own figures" contrasts with AWS's DDR5-7200, the EC2 NUMA silence is the claim itself, and "Chips and Cheese measured" gives the referent for "their Emerald Rapids figure". Some long sentences in the oneDNN alert. |
| Economy | 7 | 1,397 words (+27%). The growth comes from required new blocks (the AWS card, the roadmap, the oneDNN checks), and the author's report shows offsetting cuts. The oneDNN alert packs three tiers, a verbatim string, three failure causes and a cap into one box. |
| Diagrams | 9 | Inline SVG with `role="img"`, `aria-labelledby` and a `<title>`. The probe reported "1 SVG diagram(s), 0 React Flow, ok" at 1440 and 390. I read both PNGs: at 1440 every label sits inside its box and the rotated EMIB labels sit inside the bridges. At 390 the diagram keeps its 640 px minimum and scrolls sideways, as the dive's phone convention requires, with 11 px labels that stay legible. |

## Claims

CC = Chips and Cheese, "A Look into Intel Xeon 6's Memory Subsystem" (r8i, 6985P-C). Brief = Intel Xeon 6 product brief (PDF and HTML read; identical text).

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | P-cores have AVX-512 and AMX ("a matrix unit in every core"); E-cores have neither | xeon6ProductBrief | CONFIRMED | "AVX-512 is only supported on Intel Xeon 6 processors with P-cores"; "AI acceleration in every core. Intel AMX..."; the HTML feature table shows "-" for AMX and AVX-512 in the E-core column (p. 2, 4) | - |
| 2 | AWS lists Granite Rapids for M8i, C8i, R8i and X8i | ec2*Specs | CONFIRMED | Processor column: "Intel Xeon Granite Rapids" for every m8i, c8i, r8i and x8i size | - |
| 3 | The r8i runs a custom 96-core Xeon 6 6985P-C | chipsAndCheeseXeon6 | CONFIRMED | "AWS's r8i instance uses the Xeon 6 6985P-C. This SKU is not listed on Intel's site"; "has 96 Redwood Cove cores" | - |
| 4 | Three compute tiles, two IO dies | chipsAndCheeseXeon6 | CONFIRMED | "The largest Xeon 6 SKUs incorporate three compute dies and two IO dies"; "12 memory controllers, or four per compute die. The Xeon 6 6985P-C falls into that category" | - |
| 5 | SNC3 on r8i | chipsAndCheeseXeon6 | CONFIRMED | "AWS has further configured the chip in SNC3 mode" | - |
| 6 | About 32 cores per node (derived) | chipsAndCheeseXeon6 | CONFIRMED | 96 / 3 = 32. CC notes "CHA count interestingly doesn't match enabled core count", so the even split is an assumption, hedged as "about" and marked derived | - |
| 7 | 160 MB of L3 per tile | chipsAndCheeseXeon6 | CONFIRMED | "each core is able to access a huge 160 MB pool of L3 cache on its tile" | - |
| 8 | Four memory channels per tile | chipsAndCheeseXeon6 | CONFIRMED | "12 memory controllers, or four per compute die". Controllers equal channels, consistent with the brief's 12-channel maximum | - |
| 9 | Each die boundary a job crosses adds latency (measured) | chipsAndCheeseXeon6 | CONFIRMED | "Accessing the L3 on an adjacent die increases latency by about 24 ns. Crossing two die boundaries adds a similar penalty" | - |
| 10 | Even a 1B model's weights do not fit in L3 | derived | CONFIRMED | 2 GB (FP16) and 1 GB (INT8) both exceed 160 MB per node and 480 MB per chip | - |
| 11 | Diagram: compute tiles on Intel 3 | chipsAndCheeseXeon6 | CONFIRMED | "Compute dies ... use the advanced Intel 3 process" | - |
| 12 | Diagram: 2 MB L2 per core, Redwood Cove | chipsAndCheeseXeon6 | CONFIRMED | "96 Redwood Cove cores ... each have 2 MB of L2 cache" | - |
| 13 | Diagram: 40 CHAs at 2.2 GHz per tile (derived) | chipsAndCheeseXeon6 | CONFIRMED | "120 CHA instances running at 2.2 GHz"; 120 / 3 = 40 | - |
| 14 | Diagram footer: 96 cores, 120 CHAs at 2.2 GHz, 480 MB L3, 80 MDF stops at 2.5 GHz | chipsAndCheeseXeon6 | CONFIRMED | "providing 480 MB of total L3"; "80 MDF stops running at 2.5 GHz" | - |
| 15 | Diagram: 4 channels of DDR5-7200 per tile | chipsAndCheeseXeon6 | CONFIRMED | "AWS equipped the Xeon 6 6985P-C with 1.5 TB of Micron DDR5-7200 per socket" | - |
| 16 | Diagram: IO dies carry PCIe 5.0, UPI 2.0, CXL 2.0 and the accelerators | xeon6ProductBrief, chipsAndCheeseXeon6 | CONFIRMED | Brief: "Up to 192 lanes of PCIe 5.0", "Intel UPI 2.0", "Up to 64 lanes of CXL 2.0". CC: "Lower speed IO and accelerators get moved to separate IO dies. Compute dies contain just cores and DRAM controllers" | - |
| 17 | EMIB at the die boundaries; MDF stops carry the mesh across them over a silicon bridge | chipsAndCheeseXeon6 | CONFIRMED | "MDF mesh stops sit at die edges where dies meet with their neighbors"; "EMIB technology, which uses an embedded silicon bridge between dies" | - |
| 18 | Compute tiles hold the cores, L3 and memory controllers; IO dies hold the slower I/O and accelerators | chipsAndCheeseXeon6 | CONFIRMED | As #16; the L3 sits in CHAs at the cores' mesh stops | - |
| 19 | A CHA is an L3 slice and a snoop filter on a core's mesh stop | chipsAndCheeseXeon6 | CONFIRMED | "Cores share a mesh stop with a CHA (Caching/Home Agent), which incorporates a L3 cache slice and a snoop filter" | - |
| 20 | Largest P-core parts reach 128 cores and 504 MB of L3 | xeon6ProductBrief | CONFIRMED | "up to 128 cores per socket with up to 504 MB L3 cache" (p. 2) | - |
| 21 | SNC3 is Intel's default and AWS's choice | chipsAndCheeseXeon6 | CONFIRMED | "SNC3 mode is what AWS chose, and is also Intel's default mode" | - |
| 22 | A node's memory is cached only in its own tile's L3 | chipsAndCheeseXeon6 | CONFIRMED | "accesses to a remote NUMA node are only cached by the remote die's L3" | - |
| 23 | A unified one-node mode also exists | chipsAndCheeseXeon6 | CONFIRMED | "Xeon 6 also supports a unified mode where all of the attached DRAM is exposed in one NUMA node" | - |
| 24 | L3 hit just over 33 ns locally (r8i, measured) | chipsAndCheeseXeon6 | CONFIRMED | "L3 cache, which has a latency of just over 33 ns (~130 cycles)"; the closing arithmetic uses 33.25 ns | - |
| 25 | About 24 ns more one tile away | chipsAndCheeseXeon6 | CONFIRMED | "increases latency by about 24 ns"; 57.63 ns adjacent in CC's own arithmetic | - |
| 26 | Nearly 80 ns two tiles away | chipsAndCheeseXeon6 | CONFIRMED | "increasing latency to nearly 80 ns for a L3 hit" | - |
| 27 | DRAM one tile away 157.44 ns, about 26 ns over local | chipsAndCheeseXeon6 | CONFIRMED | "across one die boundary takes 157.44 ns, for about 26 ns extra over hitting a local one" | - |
| 28 | The r8i uses DDR5-7200 | chipsAndCheeseXeon6 | CONFIRMED | As #15 | - |
| 29 | M8i uses DDR5-7200 | m8iPage | CONFIRMED | "M8i and M8i-flex instances use DDR5 7200MT/s DIMMs" | - |
| 30 | Intel's figures: DDR5-6400, or MRDIMM up to 8,800 MT/s on P-core parts | xeon6ProductBrief | CONFIRMED | P-core column: "MRDIMMs deliver up to 8,800 MT/s"; "DDR5-6400 high-speed memory" (p. 4) | - |
| 31 | 691.62 GB/s on an r8i, each thread reading its own node (measured) | chipsAndCheeseXeon6 | CONFIRMED | "With each thread reading from memory backed by its local NUMA node, I got 691.62 GB/s of DRAM bandwidth" | - |
| 32 | About 2.1x their Emerald Rapids figure (derived) | chipsAndCheeseXeon6 | CONFIRMED | "a step ahead of Emerald Rapids's 323.45 GB/s"; 691.62 / 323.45 = 2.138, so the note's 2.14x and the prose's "about 2.1x" both hold | - |
| 33 | 230.4 GB/s per node (derived) | chipsAndCheeseXeon6 | CONFIRMED | 4 x 7.2 GT/s x 8 B = 230.4 GB/s (arithmetic) | - |
| 34 | 1B FP16 is about 2 GB of weights, 7B about 14 GB (derived) | derived | CONFIRMED | 1e9 x 2 B = 2 GB; 7e9 x 2 B = 14 GB | - |
| 35 | 7B FP16 near 16 tokens/s per node; INT8 doubles it (derived) | derived | CONFIRMED | 14 / 230.4 = 60.8 ms, so 16.5 tokens/s; 7 / 230.4 = 30.4 ms, so 32.9 tokens/s. The note's "about 61 ms", "about 16" and "about 33" all hold | - |
| 36 | Eight tile registers, TMM0 to TMM7, each up to 16 rows of 64 bytes | llvmAmxIntrin, llvmX86Registers | CONFIRMED | amxintrin.h L229: "the maximum size is 16x64=1024 bytes"; X86RegisterInfo.td L425-432: TMM0 to TMM7 | - |
| 37 | One instruction multiplies two tiles into a third | llvmAmxIntrin | CONFIRMED | TDPBSSD doc: multiplies src0 by src1 and sums "with the corresponding 32-bit integer in "dst", and store[s] the 32-bit result back to tile "dst"" | - |
| 38 | A process must first call `arch_prctl(ARCH_REQ_XCOMP_PERM)` | linuxXstate | CONFIRMED | xstate.rst: "ARCH_REQ_XCOMP_PERM allows to request permission for a dynamically enabled feature" | - |
| 39 | oneDNN makes that request itself | oneDnnAmxPermission | CONFIRMED | cpu_isa_traits.cpp L363: `syscall(SYS_arch_prctl, ARCH_REQ_XCOMP_PERM, XFEATURE_XTILEDATA)` | - |
| 40 | Intel rates AMX at up to 2,048 INT8, and 1,024 BF16 or FP16, operations per cycle per core (vendor-claim) | xeon6ProductBrief | CONFIRMED | "up to 2,048 floating point operations per cycle per core for INT8 and 1,024 floating point operations per cycle per core for BF16/FP16" (p. 2). Marked vendor-claim and attributed in the sentence | - |
| 41 | Table: BF16 from Sapphire Rapids, `TDPBF16PS` | llvmX86Td, llvmAmxIntrin | CONFIRMED | X86.td L1243-1245: SPRAdditionalFeatures includes FeatureAMXINT8 and FeatureAMXBF16; amxintrin.h: "corresponds to the TDPBF16PS instruction" | - |
| 42 | Table: INT8 from Sapphire Rapids, `TDPBSSD`/`TDPBSUD`/`TDPBUSD`/`TDPBUUD` | llvmX86Td, llvmAmxIntrin | CONFIRMED | As #41; all four instructions are documented in amxintrin.h | - |
| 43 | Table: FP16 from Granite Rapids, `TDPFP16PS` | llvmX86Td, llvmAmxFp16Intrin | CONFIRMED | "GNRAdditionalFeatures = [FeatureAMXFP16, ..."; amxfp16intrin.h: "corresponds to the TDPFP16PS instruction" | - |
| 44 | Table: FP8 in Diamond Rapids (roadmap) | llvmX86Td | CONFIRMED | DMRAdditionalFeatures includes FeatureAMXFP8. Marked roadmap | - |
| 45 | LDTILECFG, TILELOADD, TILELOADDT1, TILESTORED, TILEZERO, TILERELEASE roles | llvmAmxIntrin | CONFIRMED | Each is documented in amxintrin.h; TILERELEASE: "Release the tile configuration to return to the init state" | - |
| 46 | Tile data is saved as XSTATE component 18 | linuxXstate | CONFIRMED | "AMX TILE_DATA (XSTATE component 18)" | - |
| 47 | oneDNN AMX tiers: AVX10_1_512_AMX (BF16, INT8), AVX10_1_512_AMX_FP16, AVX10_2_AMX_2 | oneDnnIsaTraits | CONFIRMED | hpp L153-160: `avx10_1_512_amx = avx10_1_512 \| amx_int8 \| amx_bf16`; `..._fp16 = ... \| amx_fp16`; `avx10_2_amx_2 = avx10_2 \| ... \| amx_2_bit` | - |
| 48 | LLVM's Diamond Rapids target adds AVX10.2 and AMX-FP8 (roadmap) | llvmX86Td | CONFIRMED | DMRAdditionalFeatures: FeatureAVX10_2 ... FeatureAMXFP8 | - |
| 49 | `ONEDNN_VERBOSE=1` prints `info,cpu,isa` naming the highest tier | oneDnnVerbose, oneDnnMaxCpuIsa | CONFIRMED | verbose.cpp: `verbose_printf("info,cpu,isa:%s\n", cpu::platform::get_isa_info())`; get_isa_info_t walks the tiers "in descending order due to mayiuse check" | - |
| 50 | v3.13.4 prints "Intel AVX10.1 and Intel AMX with bfloat16, float16 and 8-bit integer support" for Granite Rapids | oneDnnMaxCpuIsa | CONFIRMED | cpu_isa_traits.cpp L138-140, the avx512_core_amx_fp16 name, verbatim | - |
| 51 | A lower tier means AMX is hidden, the permission request failed, or a cap is set | oneDnnVerbose, oneDnnMaxCpuIsa | CONFIRMED | mayiuse(amx_tile) requires `cpu().has(Cpu::tAMX_TILE) && x64::amx::is_available()` (hpp), and the cap comes from max_cpu_isa | - |
| 52 | `ONEDNN_MAX_CPU_ISA=AVX10_1_512_AMX` sets the cap | oneDnnMaxCpuIsa, oneDnnEnvPrefix | CONFIRMED | `getenv_string_user("MAX_CPU_ISA")` tries the "ONEDNN_" and "DNNL_" prefixes and lowercases the value; user_option_env "avx10_1_512_amx" | - |
| 53 | The cap is compiled in by ENABLE_MAX_CPU_ISA, default ON | oneDnnBuildOptions | CONFIRMED | `onednn_option(ENABLE_MAX_CPU_ISA ON` | - |
| 54 | IPEX archived; its last commit, on 2026-03-30, adds the archive notice | ipexReadme | CONFIRMED | README: "THIS PROJECT IS ARCHIVED". The GitHub API gives commit 6d3ba89 at 2026-03-30T08:35:22Z, "Add discontinuation notice", with archived: true | - |
| 55 | README reports known security issues; most optimizations are upstream; Intel recommends PyTorch directly | ipexReadme | CONFIRMED | "identified as having known security issues"; "upstreamed most of our features and optimizations"; "We strongly recommend using PyTorch* directly" | - |
| 56 | 6900 P-cores: up to 128 cores, 504 MB L3, 12 channels, DDR5-6400 or MRDIMM 8,800, AVX-512, AMX with FP16 | xeon6ProductBrief | CONFIRMED | P-core column (p. 4) and the 6900 description: "higher core counts, more memory channels" (p. 3). The brief says "Up to 12 memory channels" | "Up to" restored |
| 57 | 6700/6500: up to 86 cores, 336 MB L3, 8 channels, DDR5-6400 or MRDIMM 8,000, AVX-512, AMX with FP16 | xeon6700BriefPdf | CONFIRMED | "up to 86 cores per socket ... up to 336 MB L3 cache per processor"; "Up to eight memory channels with 6,400 MT/s of DDR5 memory and 8,000 MT/s of MRDIMMs"; AMX "for BF16- and FP16-based models" | "Up to" restored |
| 58 | E-cores: up to 288 cores, 216 MB L3, 12 channels, DDR5-6400, AVX2 with VNNI, no AVX-512, no AMX | xeon6ProductBrief | CONFIRMED | "up to 288 cores per socket, with as much as 216 MB L3 cache"; E-core column "Up to 12 memory channels", "Intel AVX2 with VNNI" | "Up to" restored |
| 59 | 6985P-C: 96 cores, 480 MB L3, 12 channels of DDR5-7200, AVX-512, AMX | chipsAndCheeseXeon6 | CONFIRMED | As #3, #14, #15; "enjoy AVX-512 support ... AMX support is present as well" | - |
| 60 | 6985P-C AMX "with FP16" | ec2MemoryOptimizedSpecs + llvmX86Td (note) | UNSUPPORTED as cited | The mo.html specification page states no AMX or FP16; the claim was an inference cited as spec. The R8i page states it directly: "Advanced Matrix Extensions (AMX) with FP16 support on R8i and R8i-flex instances" | Re-cited to `r8iPage` (Tier 2, record shared with MainMemoryAndCxl); r8iAmxNote removed |
| 61 | Xeon 6+: first data-center processor on Intel 18A, launched Q2 2026, up to 288 E-cores, no matrix extension named on its page | intelXeon6Plus | CONFIRMED | "The first Intel 18A processors for data centers ... up to 288 Efficient-cores"; "Launch Date Q2'26". The page has no match for AMX, matrix or AVX | - |
| 62 | "Diamond Rapids, the next P-core Xeon" | intelHotChips2026 | UNSUPPORTED | "the next gen Xeon codenamed Diamond Rapids". The article never says P-core | Softened to "the next-generation Xeon" |
| 63 | Diamond Rapids (roadmap, no launch date): Intel 18A-P, up to 256 cores, 1.28 GB LLC, 16 channels at 12,800 MT/s, PCIe Gen6, CXL 3.0, enhanced AMX | intelHotChips2026 | CONFIRMED | "Intel 18A-P"; "Up to 256 new cores with 1.28 GB LLC"; "16 memory channels with 12800 MT/s"; "128 lanes of PCIe Gen6 and CXL 3.0"; "enhanced Advanced Matrix Extensions (AMX)". No date in the article. Marked roadmap | - |
| 64 | M8i, C8i, R8i (with -flex and d variants) and X8i list Granite Rapids on Nitro v6 | ec2*Specs | CONFIRMED | Hypervisor "Nitro v6" for each family. The list is not exhaustive: n, dn, b, db and ne variants also list Granite Rapids (see Backlog) | - |
| 65 | 96xlarge: 384 vCPUs on 192 cores; 1,536 GiB M8i, 3,072 GiB R8i, 6,144 GiB X8i | ec2*Specs | CONFIRMED | m8i.96xlarge 1536.00 / 384 / 192; r8i.96xlarge 3072.00 / 384 / 192; x8i.96xlarge 6144.00 / 384 / 192; c8i.96xlarge 384 / 192 | - |
| 66 | M8i sustains a 3.9 GHz all-core turbo | m8iPage | CONFIRMED | "a sustained all-core turbo frequency of 3.9 GHz" | - |
| 67 | AWS claims 2.5x the previous generation's memory throughput (vendor-claim) | m8iPage | CONFIRMED | "providing 2.5x higher memory throughput compared to previous generation instances" | - |
| 68 | r8i.96xlarge carries two 6985P-C chips (derived) | ec2MemoryOptimizedSpecs | CONFIRMED | 192 / 96 = 2; 3,072 GiB against CC's "1.5 TB ... per socket" | - |
| 69 | The EC2 instance specifications give no NUMA layout per size | ec2MemoryOptimizedSpecs | CONFIRMED | No occurrence of "NUMA" in gp.html, co.html or mo.html. The silence is scoped to those pages | - |
| 70 | Fit list: about 32 cores and 160 MB of L3 per node | chipsAndCheeseXeon6 | CONFIRMED | As #6, #7 | - |
| 71 | Fit list: up to 6,144 GiB on x8i.96xlarge | ec2MemoryOptimizedSpecs | CONFIRMED | As #65 | - |
| 72 | QAT for crypto and compression, DSA for data movement, IAA for compression and scans | xeon6ProductBrief | CONFIRMED | "QAT enables offload of bulk cryptography and compression"; "DSA 2.0 enables offload of data movement"; "IAA 2.0 enables offloading of memory compression and decompression, scan and filter" | - |
| 73 | One core reads about 30 GB/s from L3, less than a Zen 5 core reads from DRAM (measured) | chipsAndCheeseXeon6 | CONFIRMED | "A single core has about 30 GB/s of L3 bandwidth"; "a Redwood Cove core has less L3 bandwidth than a Zen 5 core does from DRAM" | - |
| 74 | More than 128 cores per socket: only E-core parts, with no AMX | xeon6ProductBrief | CONFIRMED | "Up to 128 cores per socket" (P) vs "Up to 288" (E); AMX only in the P-core column | - |
| 75 | Closing: compare against the 230.4 GB/s per-node ceiling | derived | CONFIRMED | As #33 | - |
| 76 | Closing: the `info,cpu,isa` line names AMX with float16 | oneDnnVerbose | CONFIRMED | As #49, #50 | - |
| 77 | h1 description: "Read an AWS Xeon 6 as three NUMA nodes per chip, each with its own 160 MB of L3" | chipsAndCheeseXeon6 | UNSUPPORTED (scope) | SNC3 and 160 MB per tile are sourced for the r8i 6985P-C only. The author's own report lists SNC3 on M8i, C8i and X8i as unknown | Scoped to "Read the Xeon 6 in an r8i as three NUMA nodes per chip" |
| 78 | No PCIe 5.0 rate is attributed to the brief (ORCH) | xeon6ProductBrief | CONFIRMED | The section and diagram say "PCIe 5.0" with no GT/s figure. The brief gives "32 GT/s per lane" only for CXL 2.0 | - |
| 79 | Brief record title | xeon6ProductBrief | MISLABELLED | Title was "The Intel Xeon 6 Processor Family Product Brief" on the PDF URL; ORCH requires the MainMemoryAndCxl `xeon6Brief` title and URL | Retitled and re-URLed (see Fixes) |

## ORCH-NOTES items

- **Xeon 6 brief, 32 GT/s only for CXL; check any PCIe 5.0 rate attributed to it:** CONFIRMED
  clean. The brief says "Up to 64 lanes of CXL 2.0 with data transfer rates up to 32 GT/s per
  lane" and gives PCIe 5.0 only as lane counts ("Up to 192 lanes of PCIe 5.0 for two-socket
  servers"). The section and diagram name "PCIe 5.0" with no rate. The record had a different
  title and URL (the PDF), so it now reads exactly "Intel Xeon 6 Product Brief (up to 64 lanes of
  CXL 2.0 at up to 32 GT/s per lane)" with
  `https://www.intel.com/content/www/us/en/products/docs/xeon-6-product-brief.html`, matching
  `xeon6Brief` in MainMemoryAndCxl.ts. The HTML page carries every brief figure this section
  cites (128 cores, 504 MB, 288 cores, 216 MB, 12 channels, DDR5-6400, MRDIMM 8,800, the AMX
  ops/cycle, AVX2 with VNNI, UPI 2.0, PCIe 5.0, CXL 2.0, QAT, DSA and IAA), so no claim lost
  support.
- **Granite Rapids (6900P / 6700P) figures:** CONFIRMED. 6900 P-cores: up to 128 cores, 504 MB
  L3, up to 12 channels, DDR5-6400 or MRDIMM up to 8,800 MT/s (brief). 6700/6500: up to 86 cores,
  336 MB, up to 8 channels, MRDIMM 8,000 (6700 brief). AWS 6985P-C: 96 cores, three compute
  tiles, EMIB with MDF (80 stops at 2.5 GHz), SNC3, 12 controllers of DDR5-7200, 480 MB L3 (CC).
  Per-node bandwidth: 4 x 7.2 x 8 = 230.4 GB/s. AMX BF16 and INT8 from SPR, FP16 from GNR (LLVM
  X86.td). Per-core throughput 2,048 INT8 and 1,024 BF16/FP16 ops per cycle, marked vendor-claim.
  UPI 2.0 is named in the diagram without a link count or rate, and PCIe 5.0 without a lane
  count, so neither has a figure to check. "Up to" was restored on three channel counts.
- **Xeon L3 latency (33 / +24 / ~80 ns, r8i, SNC3), Tier 3 measured:** CONFIRMED against CC,
  which names the Xeon 6 6985P-C in AWS r8i in SNC3. Its own arithmetic gives 33.25 ns local and
  57.63 ns adjacent. Chiplet and Interconnect (row "Intel Xeon 6 on AWS r8i (6985P-C)", lines
  74-77, and XEON_L3_NOTE) states the same three figures with the same scope and the measured
  kind: no mismatch. MemoryHierarchyTower's "~33 ns, local hit, Xeon 6 on r8i" also matches.
- **EC2 instance families and figures:** CONFIRMED from the AWS gp, co and mo specification
  pages. M8i, C8i, R8i and X8i (and their variants) list "Intel Xeon Granite Rapids" on Nitro v6.
  Every 96xlarge has 384 vCPUs and 192 cores, with 1,536 GiB (M8i), 768 GiB (C8i, which the
  section does not quote), 3,072 GiB (R8i) and 6,144 GiB (X8i). The M8i page gives 3.9 GHz and
  DDR5-7200, and the 2.5x memory throughput is marked vendor-claim. The section quotes no network
  or EBS bandwidth figures. The r8i FP16 claim was re-cited to the R8i page, which states it.
- **Clearwater Forest / non-shipping parts marked roadmap:** CONFIRMED. The section does not use
  the name Clearwater Forest. Xeon 6+ is presented as launched ("Launch Date Q2'26" on Intel's
  page), so spec is correct. Diamond Rapids and the AMX-FP8 / AVX10.2 rows carry
  `kind="roadmap"` and say "no launch date". "Next P-core Xeon" was softened, because Intel's
  article says only "next gen Xeon".

## Fixes applied

- `src/sources/IntelXeon6.ts:10-16` `xeon6ProductBrief`: before, title "The Intel Xeon 6 Processor Family Product Brief", url `https://cdrdv2-public.intel.com/845771/Intel-Xeon6-ProductBrief.pdf`, accessed 2026-10-17. After, title "Intel Xeon 6 Product Brief (up to 64 lanes of CXL 2.0 at up to 32 GT/s per lane)", url `https://www.intel.com/content/www/us/en/products/docs/xeon-6-product-brief.html`, accessed 2026-10-23.
- `src/sources/IntelXeon6.ts` new record `r8iPage` ("Amazon EC2 R8i instances", AWS, `https://aws.amazon.com/ec2/instance-types/r8i/`, Tier 2, accessed 2026-10-23), the same title, publisher, URL and tier as MainMemoryAndCxl.ts.
- `src/sections/IntelXeon6.tsx` (6985P-C row, units cell): before `with FP16 <Cite ec2MemoryOptimizedSpecs note={r8iAmxNote} /> <Cite llvmX86Td note={r8iAmxNote} />`; after `with FP16 <Cite s={S.r8iPage} />`. The `r8iAmxNote` const was removed.
- `src/sections/IntelXeon6.tsx` h1 description: before "Read an AWS Xeon 6 as three NUMA nodes per chip, ..."; after "Read the Xeon 6 in an r8i as three NUMA nodes per chip, ...".
- `src/sections/IntelXeon6.tsx` (family table, memory cells, lines 48, 69, 90): before "12 channels; ...", "8 channels; ...", "12 channels; DDR5-6400"; after "Up to 12 channels; ...", "Up to 8 channels; ...", "Up to 12 channels; DDR5-6400".
- `src/sections/IntelXeon6.tsx` (roadmap paragraph): before "Diamond Rapids, the next P-core Xeon, is on the roadmap"; after "Diamond Rapids, the next-generation Xeon, is on the roadmap".
- No diagram changes. No AI tells were found in the owned files, so none were fixed.

## Checks

- `pnpm exec tsc --noEmit | grep -E "IntelXeon6|Xeon6Topology|sources/IntelXeon6"`: "no type errors in my files".
- `pnpm exec eslint src/sections/IntelXeon6.tsx src/sources/IntelXeon6.ts src/components/Xeon6Topology.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t IntelXeon6`: exit 0, 1 passed.
- `pnpm exec vitest run src/__tests__/sources.test.ts`: 846 passed. The one failure is "keeps sources.md in sync with the registry", which needs the orchestrator to regenerate sources.md. The same-URL-same-tier check passes.
- Gates from the repo root: no-ai-tells exit=0, svg-a11y exit=0, pinned-refs exit=0, pre-overflow exit=0. None reported a hit in IntelXeon6 or Xeon6Topology.
- `pnpm exec vite build --outDir /tmp/vf-IntelXeon6-dist --emptyOutDir`: exit 0. `node scripts/shoot.mjs --sections xeon-6 --widths 1440,390 ...`: exit 0, "1 SVG diagram(s), 0 React Flow, ok" at both widths. I read both diagram PNGs and found them clean (diagram unchanged; this checked the Diagrams score).

## For the orchestrator

- Regenerate `sources.md`. `IntelXeon6.xeon6ProductBrief` now uses the HTML brief URL and the CXL title, and `IntelXeon6.r8iPage` was added.
- `src/sources/AmdEpycTurin.ts` `xeon6ProductBrief` still points to the PDF (`cdrdv2-public.intel.com/845771/...`) with the title "The Intel Xeon 6 Processor Family Product Brief". The text is the same document. Consider giving it the same title and HTML URL so the bibliography has one entry for the brief.
- `src/sources/CapitalMarketsLens.ts` `xeon6Brief` still has the title "(PCIe 5.0 at 32 GT/s per lane)" (already in ORCH-NOTES).
- Chiplet and Interconnect: no mismatch on the Xeon latencies (see the ORCH-NOTES item above).

## Backlog

- 691.62 GB/s measured against the arithmetic: three nodes x 230.4 GB/s = 691.2 GB/s, the
  12-channel DDR5-7200 peak for one socket. So CC's measurement sits at 100.06% of a one-socket
  theoretical peak. CC does not say which r8i size it measured (a two-socket 96xlarge would have
  twice the peak). A reader who multiplies the per-node figure by three will notice. A one-line
  scope note (CC does not name the instance size) would close it. [SPECULATIVE: whether the run
  spanned one socket or two.]
- The AWS card's family list ("with their -flex and d variants") is accurate but not
  exhaustive. The specification pages also list n, dn, b, db and ne variants of M8i, C8i and R8i
  on Granite Rapids and Nitro v6.
- Economy: the oneDNN alert could keep the verbose check in the alert and move the tier list and
  the `ONEDNN_MAX_CPU_ISA` cap into an ExpandableSection.
- Diamond Rapids core type: if an Intel first-party source names it a P-core part, "P-core" could
  return.
