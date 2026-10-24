# Change report: KernelExecutionLifecycle (nav id `kernel-lifecycle`)

Register: `research/2026-10-refresh/02-nvidia.md` section 5 (K1 to K24) and
section 0; Trainium lane from `03-aws-cpus.md` sections 1 and 2 (S1, S2, S4, S12,
S13, S22, C1, C3, C4, C11, C21, C26); AMX lane from `03-aws-cpus.md` section 5
(X5, X20, X21, X22, X24).

Files: `src/sections/KernelExecutionLifecycle.tsx`,
`src/components/KernelLifecycleDiagram.tsx` (rebuilt),
`src/sources/KernelExecutionLifecycle.ts` (new, 25 records). Eleven URLs are
shared with NvidiaHopper.ts, NvidiaBlackwell.ts, GraceBlackwellUltraServer.ts,
FlashCacheTier.ts, NvidiaCompilersAndTooling.ts and ThesisAndFraming.ts, with
identical URL, title, publisher and tier (checked by script; sources.test.ts passed
218/218 when run).

Fetched during authoring on 2026-10-17 (records carry that date):
- CUDA Programming Guide v13.4.2, Programming Model: "All threads of a thread block
  are executed by a single SM"; "Different thread blocks within the grid are
  scheduled among the available SMs and may be executed in any order"; "Shared
  memory allocations are done at the thread block level"; global memory "is
  accessible to all SMs in the GPU".
- Same guide, Advanced Kernel Programming 3.2.2.2 (Hardware Multithreading): "When
  an SM is given one or more thread blocks to execute, it partitions them into
  warps"; "At each instruction issue cycle, a warp scheduler selects a warp with
  threads ready to execute its next instruction"; "switching between warps incurs no
  cost"; residency "depends on the amount of registers and shared memory used by the
  kernel"; "If there are not enough resources available per SM to process at least
  one block, the kernel will fail to launch"; 3.2.5: "the SM switches to execute
  another warp while memory operations complete".
- Same guide, Asynchronous Data Copies: "LDGSTS (CC 8.0+"; TMA "compute capability
  9.0 (Hopper) and later"; "This allows the initiating thread to continue computing
  while the hardware asynchronously copies the data."
- Same guide, CUDA Graphs: "A graph is defined separately from its execution";
  "defined once and then launched repeatedly"; overhead "paid once for the entire
  graph during instantiation"; CPU launch costs reduced compared to streams.
- Same guide, Programmatic Dependent Launch: a "dependent secondary kernel to launch
  before the primary kernel it depends on in the same CUDA stream has finished";
  "hide the launch latency of secondary_kernel behind the execution of
  primary_kernel"; "Available starting with devices of compute capability 9.0".
- Blackwell Tuning Guide: CC 10.0 64 warps, 32 blocks, 228 KB SMEM, 256 KB combined,
  64K registers; "The NVIDIA GB200 GPU increases the L2 cache capacity to 126 MB."
- Blackwell Ultra blog: "Enhanced GigaThread Engine: Next-generation work scheduler
  providing ... optimized workload distribution across all 160 SMs"; "x16
  PCI-Express Gen 6"; NVLink-C2C to Grace; 256 KB TMEM per SM.
- Hopper architecture blog: "H100 incorporates a PCI Express Gen 5 x16 lane
  interface". It does not mention warp schedulers or the GigaThread engine.
- NKI Trainium/Inferentia2 architecture guide: "TensorE must read input matrices
  from SBUF and write output matrices to PSUM"; "PSUM also allows near-memory
  accumulation"; DMA moves HBM to SBUF. NKI Trainium2 guide: SBUF 28 MiB per
  NeuronCore-v3, PSUM 2 MiB, DMA engines between HBM and SBUF.
- Code at tags: clang `amxintrin.h` at llvmorg-23.1.3 line 229 ("the maximum size is
  16x64=1024"), LDTILECFG, TILELOADD, TILESTORED, TDPBF16PS; `amxfp16intrin.h`
  TDPFP16PS; `X86RegisterInfo.td` TMM0 to TMM7 (lines 425-432); Linux v6.19
  `xstate.rst` ("an application must explicitly ask permission", ARCH_REQ_XCOMP_PERM);
  oneDNN v3.13.4 `src/cpu/x64/cpu_isa_traits.cpp` lines 357-374 (`init()` calls
  `arch_prctl(ARCH_REQ_XCOMP_PERM, XFEATURE_XTILEDATA)`).

Pin choice: the 02-nvidia register cites AMX code at llvmorg-21.1.0 and xstate.rst at
v6.12 (T1-27, T1-28). The orchestrator pointed the AMX lane at 03-aws-cpus, which
pins llvmorg-23.1.3 and v6.19 (T1-41, T1-42), so those pins are used, matching what
the Intel Xeon 6 section should cite.

## Length

Before: 1,749 visible prose words. After: 1,634 (down 7%). Measured on the rendered
page at 1440 with every disclosure open, excluding nav, Cite badges, SVG text and
code (`/tmp/kl-tools/wc.mjs`). The diagram's own text is not counted either way.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| K2 | L1 / SMEM "~20-30 cycles", "~10-15 ns" | SMEM about 29 cycles, L1 about 41 cycles (H800 PCIe); ns dropped | luoHopperBench (T3, measured) |
| K3, K23 | "On Hopper SMEM is up to 228 KB per SM, sharing 256 KB with L1" | "Up to 228 KB per SM on Hopper and B200; up to 328 KB on Rubin"; L1 "shares one 256 KB array per SM with SMEM on Hopper and B200" | hopperTuningGuide, blackwellTuningGuide, computeCapabilities (T1) |
| K5 | TMEM "dedicated tensor-core operand storage" | "tcgen05.mma accumulates here; operand A may come from here", 256 KB per SM | ptxIsa (T1), blackwellUltraBlog (T2) |
| K6 | L2 "~150-300 cycles", "~75-150 ns", "H100 L2 is 50 MB" | About 263 cycles; "50 MB on H100, 126 MB on GB200"; ns dropped | luoHopperBench (T3, measured); hopperTuningGuide, blackwellTuningGuide (T1) |
| K7 | HBM "~300-600 cycles", "~150-300 ns"; H200 4.8 TB/s | About 479 cycles (global memory; HBM2e on the H800); H100 SXM 80 GB at 3.35 TB/s, H200 141 GB at 4.8 TB/s | luoHopperBench (T3, measured); h100Page, h200Page (T2) |
| K8 | Host row "PCIe Gen5 / NVLink-C2C", "~1-3 us" | Row removed from the table; stage 1-2 prose names the link: PCIe Gen5 on H100, PCIe Gen6 on Blackwell Ultra, NVLink-C2C to a Grace CPU | hopperArchBlog, blackwellUltraBlog (T2) |
| K10 | "warp scheduler allocates blocks to SMs" | GigaThread engine (NVIDIA's GPU-wide work scheduler) spreads thread blocks across SMs in no guaranteed order; each SM splits blocks into warps and a warp scheduler picks a ready warp at each issue cycle. New block "Getting both levels right" and a rebuilt diagram carry the two-level model | blackwellUltraBlog (T2); cudaProgrammingModel, cudaHardwareMultithreading (T1) |
| K11 | NVIDIA lane "Async copy -> SMEM -> tensor core via wgmma or tcgen05.mma over TMEM" | "TMA or async copy fills SMEM; wgmma accumulates in registers (Hopper), tcgen05.mma in TMEM (Blackwell)" | cudaAsyncCopies, ptxIsa (T1) |
| K13 | "No runtime scheduling ... walks it deterministically"; "makes Trainium deterministic at runtime"; "reproducible per-call" | "The compiler back end fixes memory allocation and instruction order inside the NEFF, so there is no warp scheduler to tune. NeuronCore-v3 still supports dynamic shapes and control flow"; reproducibility handed to Determinism: NEFF and GPU Reproducibility | nkiOverview, trn2Arch (T1) |
| K14 | "TDPBF16PS / TDPFP16PS executes 16x16 tile matmul" | Eight tile registers of up to 16 rows of 64 bytes (1 KB); LDTILECFG, TILELOADD; TDPBF16PS for BF16, TDPFP16PS adds FP16 from Granite Rapids | llvmAmxIntrin, llvmX86Registers, llvmAmxFp16Intrin, llvmX86Td (T1, code) |
| K15 | "AMX state managed by XSAVE/XRSTOR" | "On Linux a process must request AMX permission with arch_prctl(ARCH_REQ_XCOMP_PERM) before using it; oneDNN makes that request itself" | linuxXstate, oneDnnAmxPermission (T1, code) |
| K16 | Stage 2 "host-pinned command buffer and ringing a doorbell across PCIe" | "How the CUDA driver does this is our model, since no NVIDIA document checked for this page describes it: it writes the launch into a queue the GPU reads and signals the GPU across the host link" | NVLink-C2C / PCIe naming: hopperArchBlog, blackwellUltraBlog (T2) |
| K18 | "64 concurrent warps with 32 threads each (Hopper Tuning Guide, accessed 2026-04-24)" | "up to 32 blocks and 64 warps per SM on Hopper and B200" | hopperTuningGuide, blackwellTuningGuide (T1) |
| K19 | "Async copy (Hopper), TMA (Hopper), tcgen05 (Blackwell)" | "Async copy (compute capability 8.0 and later) and the TMA bulk tensor copy (9.0, Hopper, and later)"; tcgen05.mma on Blackwell | cudaAsyncCopies, ptxIsa (T1) |
| K20 | "tcgen05.mma operating on a tile resident in TMEM" | "tcgen05.mma reads B from SMEM and A from SMEM or TMEM, and accumulates into TMEM"; wgmma: B from SMEM, A from SMEM or registers, accumulator in registers | ptxIsa (T1) |
| K21 | Alert: "typical industry ranges ... remain UNKNOWN here pending the per-vendor sections" | Caption: "Latencies are microbenchmark measurements by Luo et al. on an H800 PCIe, not vendor specifications. NVIDIA's Hopper and Blackwell tuning guides give no per-level latency, and no figure for registers or TMEM was located for this page." | luoHopperBench (T3, measured) |
| Trainium lane | "PyTorch -> torch-neuronx -> XLA HLO -> Neuron compiler emits NEFF"; "descriptor-driven"; "SBUF / PSUM staged by compiler; systolic array consumes pre-tiled operands" | torch-neuronx traces to an XLA graph, neuronx-cc compiles a NEFF ahead of time, the Neuron Runtime loads it; DMA engines fill SBUF (28 MiB per NeuronCore-v3) from HBM; Tensor engine reads SBUF, writes PSUM (2 MiB), which accumulates near memory | neuronCompiler, nkiTrn2Arch, nkiTrnInf2Arch (T1) |
| Fusion compiler | "torch.compile / Inductor ..., the Neuron compiler ..., oneDNN ..." | torch.compile with Inductor on NVIDIA; on Trainium the XLA front end of neuronx-cc, which performs operator fusion (oneDNN dropped: no source) | nkiOverview (T1) |
| Intro | "seven-stage pipeline"; "span four orders of magnitude" | Seven stages kept; replaced the unsourced span with the measured gap: about 479 cycles from HBM against about 29 from SMEM, about 16 times | luoHopperBench (T3, measured; derived 478.8 / 29.0 = 16.5) |

CORRECT claims kept and re-cited: K3, K5, K11, K14, K15, K18 (each above), and the
50 MB and 4.8 TB/s parts of K6 and K7.

## Claims removed

- K1 register "1 cycle", "~0.5 ns at 2 GHz": UNKNOWN; latency cell reads "None
  located", scoped in the caption. The row stays for its 64K-register size.
- K4 TMEM latency "few cycles", "~ns class": UNKNOWN; "None located".
- K8 host latency "~1-3 us" and "protocol setup, not raw bandwidth": no cited input,
  removed with the row.
- K9 cross-host row ("~10-50 us", "SRD spraying", NCCL / NIXL / EFA): no cited
  input; removed. Communication and Scale-Out owns scale-out.
- K12 "16 CC-Cores carry collectives": CORRECT, removed in the leverage pass. It sits
  outside the kernel lifecycle and the AWS Trainium section carries it.
- K17 stage 3 "tens of nanoseconds": UNKNOWN, removed.
- K22 diagram scale row ("~us", "~10s of ns", "~ns per op"): UNKNOWN, removed with
  the rebuild.
- CUT candidates, both removed: the "Connecting threads" container (forward
  references by section number) and the process-meta Alert.
- Other unsourced figures: stage 1 "in microseconds"; stage 5 "10s ... 100s of
  nanoseconds"; stage 7 "another 100s of nanoseconds, often more than the matmul".
- Navigation narration: "Why this section" (with "Section 4", "Sections 6-18") and
  every other number-based cross-reference (Sections 2, 4, 14, 16, 22).
- Lanes ColumnLayout claims with no source: "eviction is hardware-cached", "a
  pipeline bubble visible only to the profiler", "a slip visible at compile time"
  (C13 UNKNOWN), "reproducible per-call" (S23 UNKNOWN), "front-end mispredict and
  cache miss costs replace the GPU's warp stall as the dominant loss". Replaced by
  the sourced "Where the order is decided" paragraph.
- AMX "Tile registers loaded from L1" (X22 UNKNOWN, cut).
- The lanes "Source" column, "All vendor-cited rows accessed 2026-04-24" and the
  three plain `Link` citations: replaced by `Cite`.

## UNKNOWNs and how the page handles each

- K1, K4: "None located" cells; the caption scopes it to the tuning guides and the
  benchmark checked for this page.
- K8, K9: latencies removed. No estimate shipped, because no cited input supports one.
- K13: re-expressed as the compiler fixing instruction order, with dynamic shapes and
  control flow stated (S22, C11); bitwise determinism left to the Determinism section.
- K16: kept as a labelled model in prose ("our model, since no NVIDIA document
  checked for this page describes it") and in the diagram caption ("Stage 2 as drawn
  is our model of the driver path").
- K17, K22: removed.

## NEW content and its sources

- K23: B200 shares Hopper's per-SM limits (32 blocks, 64 warps, 64K registers, 228 KB
  SMEM in 256 KB); Rubin up to 328 KB SMEM. blackwellTuningGuide, computeCapabilities
  (T1).
- K24: CUDA Graphs and PDL in "Shortening the lifecycle". cudaGraphs, cudaPdl (T1,
  fetched).
- K10 mental model: "Getting both levels right" (grid/block sizes feed scheduler 1,
  resident warps feed scheduler 2; launch failure when one block exceeds the SM).
  cudaHardwareMultithreading (T1).
- "Which lever to pull": closing guidance mapping profile symptoms to stages (graphs
  or PDL for stages 1 to 3, fusion for stage 7 into stage 5, resident warps for an
  in-SM stall). No new facts.

## Diagram

`KernelLifecycleDiagram.tsx` rebuilt. The old one was 1240 x 360 with a fixed
`height`, `aria-label`, an em-dash and arrow glyphs in the SVG title text, an
unsourced "Scale" row, and seven 160-unit columns that shrank to about 3px text at
390. The new one: `viewBox="0 0 880 480"`, `role="img"`,
`aria-labelledby="kernel-lifecycle-title"` with an asserting `<title>`, no
`aria-label`, full-bleed white rect, Idiom A classes prefixed `kl-`, fonts 11 to
13px `sans-serif`, `width: 100%`, `height: auto`, and `minWidth: 680` inside an
`overflowX: auto` wrapper (same mobile pattern as HopperSmDiagram). Layout: a HOST
CPU band (1 Host issue, 2 Driver submit), the host link ("PCIe or NVLink-C2C"), a
GPU band with stage 3 as a full-width "Block dispatch: the GigaThread engine
(scheduler 1 of 2)" bar feeding "INSIDE EACH SM (132 ON AN H100 SXM)" with stages 4
to 7 (stage 4 "Scheduler 2 of 2"), and an "L2 cache and HBM, shared by every SM"
strip with "operands in" (into stage 5) and "results out" (from stage 7) carrying the
measured 263 / 479 / 29 cycle figures. The two scheduler stages share purple; data
movement teal; the math green. Every number drawn is cited in the caption.

Rendered check (`scripts/shoot.mjs`, build in /tmp/silicon-dist-kernel-lifecycle):
"1 SVG diagram(s), 0 React Flow, ok" at 1440 and at 390 (no overlaps, no box
overflow, no viewBox clipping, no page-level horizontal overflow). PNGs read: at 1440
every label sits inside its box with padding, the edge labels ("PCIe or NVLink-C2C",
"thread blocks", "operands in", "results out") sit beside their arrows, nothing
crosses text. At 390 the diagram scrolls inside its wrapper and the visible part is
legible; both tables scroll inside the Cloudscape table (column `minWidth`s) rather
than squeezing cells.

## Leverage pass

Block by block: the intro now defines a kernel and states the section's strongest
number (about 479 cycles from HBM against 29 from SMEM, repeated in stage 5, the
table and the diagram). The stage blocks carry the model; the two-scheduler block is
the mental-model fix and gains the practical hook (what each scheduler takes as
input, the occupancy check). The latency table is the distances the staging and
fusion choices work against. The lanes block answers who fixes the instruction order
on each silicon class and carries the one practical AMX step (`arch_prctl`). The
last block ends on the reader's next action: which lever to pull for which profile
symptom.

Claim-set diff (assertions in the after that were not in the before):

1. The GigaThread engine is NVIDIA's GPU-wide work scheduler: blackwellUltraBlog.
2. Thread blocks are scheduled among SMs in no guaranteed order; all threads of a
   block run on one SM: cudaProgrammingModel.
3. The SM partitions blocks into warps; a warp scheduler picks a ready warp at each
   instruction issue cycle; switching warps costs nothing; the SM issues from another
   warp while memory operations complete: cudaHardwareMultithreading.
4. Residency depends on registers and shared memory per block; a kernel whose single
   block exceeds the SM fails to launch: cudaHardwareMultithreading.
5. B200 per-SM limits (32 blocks, 64 warps, 64K registers, 228 KB SMEM, 256 KB
   combined); GB200 L2 126 MB: blackwellTuningGuide. Hopper 64K registers:
   hopperTuningGuide.
6. Rubin up to 328 KB SMEM per SM: computeCapabilities.
7. Async copy from CC 8.0, TMA from CC 9.0, issuing thread keeps computing:
   cudaAsyncCopies.
8. wgmma and tcgen05.mma operand and accumulator placement: ptxIsa.
9. Shared memory is allocated per thread block; global memory is reachable by every
   SM: cudaProgrammingModel.
10. H100 PCIe Gen5: hopperArchBlog. Blackwell Ultra PCIe Gen6, NVLink-C2C to Grace,
    TMEM 256 KB per SM: blackwellUltraBlog.
11. H100 SXM has 132 SMs (diagram label): hopperArchBlog.
12. SMEM 29, L1 41, L2 263, global memory 479 cycles on an H800 PCIe: luoHopperBench
    (measured); "about 16 times" derived from it.
13. H100 SXM 80 GB at 3.35 TB/s; H200 141 GB: h100Page, h200Page.
14. torch-neuronx to an XLA graph, neuronx-cc to a NEFF, loaded by the Neuron Runtime:
    neuronCompiler.
15. The neuronx-cc back end does memory allocation and instruction scheduling; its XLA
    front end does operator fusion: nkiOverview.
16. NeuronCore-v3 supports dynamic shapes and control flow: trn2Arch.
17. DMA engines move HBM to SBUF; SBUF 28 MiB per NeuronCore-v3; PSUM 2 MiB:
    nkiTrn2Arch. Tensor engine reads SBUF and writes PSUM; PSUM accumulates near
    memory: nkiTrnInf2Arch.
18. Linux requires `arch_prctl(ARCH_REQ_XCOMP_PERM)` before AMX use: linuxXstate.
    oneDNN makes that call itself: oneDnnAmxPermission.
19. Eight tile registers: llvmX86Registers. Up to 16 x 64 = 1,024 bytes per tile,
    LDTILECFG, TILELOADD, TDPBF16PS: llvmAmxIntrin. TDPFP16PS: llvmAmxFp16Intrin.
    AMX-FP16 from Granite Rapids: llvmX86Td.
20. CUDA Graphs are defined once and launched repeatedly, setup paid at
    instantiation, lower CPU launch cost than streams: cudaGraphs.
21. PDL from CC 9.0 launches a dependent kernel before the one it depends on in the
    same stream finishes, hiding its launch latency: cudaPdl.

Guidance sentences ("check resident warps per SM first", "Which lever to pull") are
actions drawn from items 3, 4, 9, 20 and 21; they add no facts. The stage 2 driver
path is labelled as our model.

## For the orchestrator

- `sources.md` may need regenerating for the 14 URLs no other file cites (`vitest -u` on
  `src/__tests__/sources.test.ts`). The test passed 218/218 locally when I ran it.
- New shared URLs other sections may cite, with tiers used here: T1 CUDA Programming
  Guide v13.4.2 chapters (Programming Model, Advanced Kernel Programming, Asynchronous
  Data Copies, CUDA Graphs, Programmatic Dependent Launch); T1 Neuron pages
  (Trainium2 Architecture, NKI Trainium2 and Trainium/Inferentia2 Architecture
  Guides, Neuron Graph Compiler overview, NKI overview); T1 code: clang
  `amxintrin.h`, `amxfp16intrin.h`, `X86RegisterInfo.td`, `X86.td#L1243-L1310` at
  llvmorg-23.1.3, Linux `xstate.rst` at v6.19, oneDNN `cpu_isa_traits.cpp` at v3.13.4
  (publisher "UXL Foundation"). The Intel Xeon 6 and AWS Trainium agents should reuse
  these titles for the same URLs.
- Glossary acronyms and terms used here: SM, SMEM, TMEM, TMA, HBM, HBM2e, NEFF, SBUF
  (State Buffer), PSUM (Partial Sum Buffer), DMA, XLA (Accelerated Linear Algebra),
  AMX (Advanced Matrix Extensions), BF16 (bfloat16), FP16, PDL (Programmatic
  Dependent Launch), CUDA Graphs, GigaThread engine, NVLink-C2C, wgmma, tcgen05.mma,
  LDTILECFG, TILELOADD, TDPBF16PS, TDPFP16PS.
- The h1 is now "Anatomy of a Kernel Execution", matching the nav title in `App.tsx`
  ("5. Anatomy of a Kernel Execution").
- Cross-links by name: Memory Hierarchy Primer, NVIDIA Hopper, Determinism: NEFF and
  GPU Reproducibility, KV Cache and FlashAttention, NVIDIA Compilers and Kernel
  Tooling, AWS Compilers and Kernel Tooling.
