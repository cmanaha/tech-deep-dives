# Verification: Anatomy of a Kernel Execution

Verified: 2026-10-23. Claims checked: 45 (sampled: 0, every claim checked). Confirmed 42,
wrong 1, unsupported 2, mislabelled 0, unverifiable 0. All three fixed; after fixes 45 of 45
confirmed.

Sources were fetched on 2026-10-23 with curl's default User-Agent or WebSearch. No personal
data went into any request. GitHub raw rate-limited one request (xstate.rst); the same file
at the same tag came from git.kernel.org (`plain/Documentation/arch/x86/xstate.rst?h=v6.19`).

## Gate 3 score: 9/10

Accuracy holds after fixes. The one wrong figure was a rounding slip in the derived SMEM-to-HBM
gap (16.5 printed as "about 16"), and the two unsupported items were citation gaps (Rubin's
328 KB, the GigaThread name in the lanes table), not wrong facts. The two-scheduler model, the
measured-distance table and "Which lever to pull" give the reader a way to think and a thing
to do. The one shape gap is that no supporting evidence is demoted into an ExpandableSection.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 42 of 45 confirmed on first read; 1 wrong (derived ratio rounding), 2 unsupported (citation scope), all fixed. No load-bearing figure was wrong: 29 / 41 / 263 / 479 cycles match Table IV exactly. |
| Mental model or practical value | 9 | Two schedulers at two levels (grid vs issue cycle), "Getting both levels right" (occupancy check, launch failure), lanes "who fixes the order", and a profile-symptom-to-lever close. The NVIDIA and Xeon "host" cells in the lanes table are descriptive, but they set up the contrast the block draws. |
| Shape | 8 | Defines a kernel before the stages; h2 descriptions state the payoff ("the distance every staging and fusion decision works against"); 479 vs 29 lands in the intro, stage 5, the table and the diagram; ends on "Which lever to pull". No ExpandableSection. The latency caption is short, so little needs demoting. |
| Writing | 9 | no-ai-tells gate clean. Things are defined by what they are. Attribution sits in the sentence only where it grades the source (Luo et al., "not vendor specifications") or states a silence (tuning guides give no per-level latency; no NVIDIA document checked describes the driver path). |
| Economy | 9 | 1,749 to 1,634 visible words (down 7%, author's count). No repeated blocks. |
| Diagrams | 9 | Inline SVG, `role="img"`, `aria-labelledby` plus an asserting `<title>`. Shot on 2026-10-23: "1 SVG diagram(s), 0 React Flow, ok" at 1440 and 390. At 1440 every label sits inside its box and no edge label crosses a line. At 390 it scrolls sideways inside its wrapper (minWidth 680, the dive's phone convention) and the visible text stays legible. |

## Claims

Sources: CUDA Programming Guide v13.4.2 (page header "v13.4.2"), Hopper and Blackwell Tuning
Guides 13.4 ("Tuning Guide 13.4 documentation"), PTX ISA 9.4 ("PTX ISA 9.4 documentation"),
Neuron docs `latest` (serving Neuron 2.33.0), code at llvmorg-23.1.3, Linux v6.19,
oneDNN v3.13.4 and CUTLASS v4.8.0 (every tag resolves: HTTP 200 on its release page).

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | SMEM about 29 cycles, H800 PCIe (table, intro, diagram), measured, T3 | luoHopperBench | CONFIRMED | Table IV "Latency clocks of different memory scopes": "Shared ... H800 29.0" (arXiv:2402.13499v1; the unversioned URL serves the identical v1 PDF, and the abs page lists only [v1]) | - |
| 2 | L1 about 41 cycles | luoHopperBench | CONFIRMED | Table IV "L1 Cache ... 40.7" | - |
| 3 | L2 about 263 cycles | luoHopperBench | CONFIRMED | Table IV "L2 Cache ... 263.0" | - |
| 4 | HBM about 479 cycles "(global memory; HBM2e on the H800)" | luoHopperBench | CONFIRMED | Table IV "Global ... 478.8"; Table III H800 PCIe "Mem. Type HBM2e", "Comp. Capability 9.0 (Hopper)" | - |
| 5 | "a gap of about 16 times"; derived note 478.8 / 29.0 = 16.5 | luoHopperBench (derived) | WRONG (rounding) | 478.8 / 29.0 = 16.51. "About 16" drops the stated half, and the note itself says 16.5 | "about 16.5 times" |
| 6 | 64K 32-bit registers per SM on Hopper and B200 | hopperTuningGuide, blackwellTuningGuide | CONFIRMED | Both 1.4.1.1: "The register file size is 64K 32-bit registers per SM." | - |
| 7 | TMEM 256 KB per SM (table, stage 6) | blackwellUltraBlog | CONFIRMED | "Blackwell and Blackwell Ultra ... The new Tensor Cores are tightly integrated with 256 KB of Tensor Memory (TMEM) per SM" | - |
| 8 | tcgen05.mma reads B from SMEM, A from SMEM or TMEM, accumulates into TMEM | ptxIsa | CONFIRMED | 9.7.18 tcgen05.mma: "d-tmem specifies the address of the destination and the accumulation matrix D in the Tensor Memory. The address operand a-tmem specifies the address of the matrix A in the Tensor Memory. ... a-desc and b-desc ... represent the matrices A and B in shared memory" | - |
| 9 | wgmma: B from SMEM, A from SMEM or registers, accumulator in registers | ptxIsa | CONFIRMED | 9.7.17.5.1: "matrix A ... can be either in registers or in the shared memory. The input matrix B ... must be in the shared memory"; "Register operand d represents the accumulator matrix" | - |
| 10 | SMEM up to 228 KB per SM on Hopper and B200 | hopperTuningGuide, blackwellTuningGuide | CONFIRMED | Hopper: "shared memory capacity per SM is 228 KB"; Blackwell: "For devices of compute capability 10.0 shared memory capacity per SM is 228 KB" | - |
| 11 | "up to 328 KB on Rubin" | computeCapabilities | UNSUPPORTED (Rubin naming) | CC appendix: "10.7 ... 328 KB"; "For devices of compute capability 10.7, kernels that use the 328 KB shared-memory configuration must explicitly enable cudaSharedMemoryModeAllowOversizedSharedMemory". No "Rubin" string on the page. CUTLASS v4.8.0 CHANGELOG: "Added initial Rubin support (SM107)" | Note on the computeCapabilities cite; reused NVIDIA Blackwell's cutlassChangelog record (same key, title, URL, tier, accessed) with the quoted note |
| 12 | L1 shares one 256 KB array per SM with SMEM on Hopper and B200 | hopperTuningGuide, blackwellTuningGuide | CONFIRMED | Hopper: "combined L1 cache, texture cache, and shared memory to 256 KB"; Blackwell: "B200 ... has the same the maximum capacity of the combined L1 cache, texture cache, and shared memory of 256 KB" | - |
| 13 | L2 50 MB on H100, 126 MB on GB200 | hopperTuningGuide, blackwellTuningGuide | CONFIRMED | "from 40 MB in the A100 GPU to 50 MB in the H100 GPU"; "The NVIDIA GB200 GPU increases the L2 cache capacity to 126 MB." | - |
| 14 | 80 GB at 3.35 TB/s on H100 SXM | h100Page | CONFIRMED | Spec table, SXM column: "GPU Memory 80GB", "GPU Memory Bandwidth 3.35TB/s" | - |
| 15 | 141 GB at 4.8 TB/s on H200 | h200Page | CONFIRMED | "141 gigabytes (GB) of HBM3e memory at 4.8 terabytes per second (TB/s)" | - |
| 16 | Async copy CC 8.0 and later; TMA 9.0 (Hopper) and later; issuing thread keeps computing | cudaAsyncCopies | CONFIRMED | 4.12.1 "LDGSTS (CC 8.0+"; 4.12.2 "compute capability 9.0 (Hopper) and later ... have a tensor memory accelerator (TMA)"; "This allows the initiating thread to continue computing while the hardware asynchronously copies the data." | - |
| 17 | Up to 32 blocks and 64 warps per SM on Hopper and B200 | hopperTuningGuide, blackwellTuningGuide | CONFIRMED | Hopper: "maximum number of concurrent warps per SM ... 64", "maximum number of thread blocks per SM is 32"; Blackwell: "64 for compute capability 10.0", "32 for devices of compute capability 10.0" | - |
| 18 | GigaThread engine, NVIDIA's GPU-wide work scheduler (stage 3 prose, diagram) | blackwellUltraBlog | CONFIRMED | "Enhanced GigaThread Engine: Next-generation work scheduler providing ... optimized workload distribution across all 160 SMs" | - |
| 18a | Lanes table: "The GigaThread engine places blocks on SMs" | cudaHardwareMultithreading, tuning guides | UNSUPPORTED (citation) | None of the three cited pages names the GigaThread engine | Added the blackwellUltraBlog cite. Scope note: the Hopper sources checked (Hopper blog, Hopper tuning guide) do not name it either; see Backlog |
| 19 | Blocks spread across SMs in no guaranteed order; every thread of a block on one SM | cudaProgrammingModel | CONFIRMED | "Different thread blocks within the grid are scheduled among the available SMs and may be executed in any order"; "All threads of a thread block are executed by a single SM" | - |
| 20 | Warps of 32 threads | cudaProgrammingModel, cudaHardwareMultithreading | CONFIRMED | 3.2.2.1: "threads in groups of 32 parallel threads called warps" | - |
| 21 | Warp scheduler picks a ready warp each issue cycle; switching costs nothing; SM issues from another warp during memory waits | cudaHardwareMultithreading | CONFIRMED | "At each instruction issue cycle, a warp scheduler selects a warp with threads ready to execute its next instruction"; "switching between warps incurs no cost"; 3.2.5 "the SM switches to execute another warp while memory operations complete" | - |
| 22 | Residency falls with registers or SMEM per block; one block over the SM fails to launch | cudaHardwareMultithreading | CONFIRMED | "depends on the amount of registers and shared memory used by the kernel"; "If there are not enough resources available per SM to process at least one block, the kernel will fail to launch." | - |
| 23 | Shared memory is per thread block; global memory is reachable by every SM | cudaProgrammingModel | CONFIRMED | "Shared memory allocations are done at the thread block level"; global memory "is accessible to all SMs in the GPU" | - |
| 24 | PCIe Gen5 on H100 | hopperArchBlog | CONFIRMED | "H100 incorporates a PCI Express Gen 5 x16 lane interface" | - |
| 25 | PCIe Gen6 on Blackwell Ultra; NVLink-C2C to a Grace CPU | blackwellUltraBlog | CONFIRMED | "NVLink-C2C for coherent interconnect to an NVIDIA Grace CPU, and x16 PCI-Express Gen 6 interface for connection to host CPUs" | - |
| 26 | Diagram "132 ON AN H100 SXM" | hopperArchBlog | CONFIRMED | "The H100 SXM5 GPU has 132 SMs" | - |
| 27 | CUDA Graph defined once, launched repeatedly; setup paid at instantiation; lower CPU launch cost than a stream | cudaGraphs | CONFIRMED | "This allows a graph to be defined once and then launched repeatedly"; "CPU launch costs are reduced compared to streams, because much of the setup is done in advance"; "these overhead costs can be paid once for the entire graph during instantiation" | - |
| 28 | PDL from CC 9.0; a dependent kernel launches before the one it depends on in the same stream finishes; hides its launch latency | cudaPdl | CONFIRMED | "to launch before the primary kernel it depends on in the same CUDA stream has finished executing. Available starting with devices of compute capability 9.0"; "hide the launch latency of secondary_kernel behind" | - |
| 29 | torch-neuronx to an XLA graph, neuronx-cc compiles it to a NEFF, loaded by the Neuron Runtime | neuronCompiler | CONFIRMED (substance) | "neuronx-cc: The newer XLA-based compiler ... (Trn1, Inf2, Trn1n, Trn2)"; "compiled into a NEFF file (Neuron Executable File Format), which is then loaded by the Neuron Runtime"; "Compile an XLA HLO graph into a NEFF file with neuronx-cc." The verbs "traces" and "ahead of time" are not verbatim, but compile-then-load says the same | - |
| 30 | Compiler back end fixes memory allocation and instruction order; XLA front end performs operator fusion | nkiOverview | CONFIRMED | "How NKI works": "done in the compiler front-end, using XLA, including ... operator fusion"; "memory allocation and instruction scheduling are done in this stage" (back end) | - |
| 31 | NeuronCore-v3 supports dynamic shapes and control flow | trn2Arch | CONFIRMED | "Trainium2 supports dynamic shapes and control flow via NeuronCore-v3 ISA extensions." | - |
| 32 | DMA engines fill SBUF from HBM; SBUF 28 MiB per NeuronCore-v3; PSUM 2 MiB | nkiTrn2Arch | CONFIRMED | "data movement between HBM and SBUF is performed using on-chip DMA (Direct Memory Access) engines"; "NeuronCore-v3 SBUF capacity is 28MiB ... PSUM capacity remains the same at 2MiB" | - |
| 33 | SBUF and PSUM names; Tensor engine reads SBUF, writes PSUM, which accumulates near memory | nkiTrnInf2Arch | CONFIRMED | "the two on-chip SRAMs: state buffer (SBUF) and partial sum buffer (PSUM)"; "TensorE must read input matrices from SBUF and write output matrices to PSUM. PSUM also allows near-memory accumulation" | Expansion cased "Partial Sum buffer" to match the five other sections |
| 34 | Eight tile registers | llvmX86Registers | CONFIRMED | X86RegisterInfo.td lines 425-432: `def TMM0` to `def TMM7` | - |
| 35 | Tiles up to 16 rows of 64 bytes (1 KB); LDTILECFG configures them; TILELOADD fills them from memory | llvmAmxIntrin | CONFIRMED | Line 229: "the maximum size is 16x64=1024 bytes"; the LDTILECFG doc: configuration holds "the number of bytes per row, and the number of rows"; "Load tile rows from memory ... corresponds to the TILELOADD instruction" | - |
| 36 | TDPBF16PS multiplies BF16 tiles | llvmAmxIntrin | CONFIRMED | Line 218: "corresponds to the <c> TDPBF16PS </c> instruction" (amx-bf16 target) | - |
| 37 | TDPFP16PS adds FP16 from Granite Rapids | llvmAmxFp16Intrin, llvmX86Td | CONFIRMED | amxfp16intrin.h: "corresponds to the \c TDPFP16PS instruction"; X86.td: `GNRAdditionalFeatures = [FeatureAMXFP16,` (SPR list has AMXTILE, AMXINT8, AMXBF16 only) | - |
| 38 | Linux: request AMX permission with arch_prctl(ARCH_REQ_XCOMP_PERM) before use | linuxXstate | CONFIRMED | xstate.rst v6.19: "an application must explicitly ask permission to use it"; `syscall(SYS_arch_prctl, ARCH_REQ_XCOMP_PERM, ARCH_XCOMP_TILEDATA)` | - |
| 39 | oneDNN makes that request itself | oneDnnAmxPermission | CONFIRMED | cpu_isa_traits.cpp v3.13.4 lines 357-373, `init()`: `syscall(SYS_arch_prctl, ARCH_REQ_XCOMP_PERM, XFEATURE_XTILEDATA)`; called once at line 393 | - |
| 40 | Tuning guides give no per-level latency; no register or TMEM latency located for this page | hopperTuningGuide, blackwellTuningGuide | CONFIRMED | Neither guide gives a cycle or ns figure for any level. The only latency text is "improvement in terms of both latency and bandwidth" (L1/SMEM union). Hedge scoped to "for this page" | - |
| 41 | Seven stages, two on the host and five on the device | (internal) | CONFIRMED | Diagram: stages 1-2 in the HOST band, 3-7 in the GPU band | - |
| 42 | PTX ISA 9.4, wgmma 9.7.17, tcgen05 9.7.18 (record title) | ptxIsa | CONFIRMED | "PTX ISA 9.4 documentation"; "9.7.17. Asynchronous Warpgroup Level Matrix Multiply-Accumulate Instructions"; "9.7.18. TensorCore 5th Generation Family Instructions" | - |
| 43 | Programming Guide v13.4.2 and tuning guides CUDA 13.4 (record titles) | cuda* records | CONFIRMED | Page headers "v13.4.2" and "v13.4" | - |
| 44 | Every GitHub URL pinned | llvm*, linuxXstate, oneDnnAmxPermission, cutlassChangelog | CONFIRMED | Tags llvmorg-23.1.3, v6.19, v3.13.4, v4.8.0 each resolve; pinned-refs gate has no hit in this file | - |
| 45 | Measured latencies match NVIDIA Hopper's diagram and Memory Hierarchy Primer's tower | luoHopperBench | CONFIRMED | HopperSmDiagram.tsx: "SMEM ~29, L1 ~41", "~263", "~479 cycles (Tier 3)"; MemoryHierarchyTower.tsx: "~29", "~41", "~263", "~479 cycles", "H800, measured". All three share the same record (title, URL, tier 3) | - |

## ORCH-NOTES items

ORCH-NOTES carries no item addressed to this section. The orchestrator named these items for
an explicit verdict:

- **Measured latencies labelled measured, Tier 3, paper and table named, matching NVIDIA Hopper
  and Memory Hierarchy Primer.** CONFIRMED. Every latency cite carries `kind="measured"` on the
  Tier 3 `luoHopperBench` record, titled "... (Luo et al., arXiv:2402.13499v1), Table IV". The
  caption names "Luo et al." and "an H800 PCIe". The values (29.0, 40.7, 263.0, 478.8) match
  Table IV and both other sections (rows 1 to 4, 45). The section shows no H100 or B200
  latency, and it states that the tuning guides give none (row 40, confirmed).
- **Kernel launch, PDL, CUDA Graphs, TMA, wgmma and tcgen05 against the CUDA guide and PTX ISA
  at a stated version.** CONFIRMED, against Programming Guide v13.4.2 and PTX ISA 9.4 (rows
  8, 9, 16, 19 to 23, 27, 28, 42, 43). The driver submit path (stage 2) is labelled as "our
  model" in the prose and the caption, a correctly scoped silence.
- **x86 AMX path and the Trainium path against pinned Linux, Clang and Neuron docs.**
  CONFIRMED (rows 29 to 39). LDTILECFG, TILELOADD and TDPBF16PS were checked in amxintrin.h at
  llvmorg-23.1.3. The XFEATURE_XTILEDATA request via arch_prctl was checked in xstate.rst at
  v6.19 and in oneDNN v3.13.4 lines 357-373. NEFF, NKI, SBUF and PSUM were checked against the
  Neuron docs (latest, Neuron 2.33.0). The SBUF and PSUM names cite `nkiTrnInf2Arch`, the
  record HeterogeneityFact.ts and AwsCustomSilicon.ts use, with the same URL, title, publisher
  and tier. That page holds the names ("state buffer (SBUF) and partial sum buffer (PSUM)").
  The cell also cites `nkiTrn2Arch` for the 28 MiB and 2 MiB.
- **Every GitHub URL pinned.** CONFIRMED (row 44), including the added cutlassChangelog.
- **SBUF/PSUM cited to the NeuronCore-v3 page that lacks them (Heterogeneity finding).** Does
  not apply here: this section never cites the NeuronCore-v3 page for the names.

## Fixes applied

- `src/sections/KernelExecutionLifecycle.tsx:242`: "a gap of about 16 times." changed to "a
  gap of about 16.5 times." (derived 478.8 / 29.0 = 16.51, as the note states).
- `src/sections/KernelExecutionLifecycle.tsx:61-65`: the bare `<Cite s={S.computeCapabilities} />` on "up to 328 KB on Rubin" now carries the note "Compute capability 10.7: 328 KB of shared memory per SM, with an explicit opt-in." and a new cite to `S.cutlassChangelog` with the note "4.8.0: Added initial Rubin support (SM107)."
- `src/sources/KernelExecutionLifecycle.ts:69-75`: added `cutlassChangelog`, a copy of
  NvidiaBlackwell.ts's record ('CUTLASS CHANGELOG at tag v4.8.0', NVIDIA,
  `https://github.com/NVIDIA/cutlass/blob/v4.8.0/CHANGELOG.md`, tier 1, accessed 2026-10-16).
- `src/sections/KernelExecutionLifecycle.tsx:149`: the lanes-table NVIDIA dispatch cell gained
  `<Cite s={S.blackwellUltraBlog} />` for the GigaThread engine name.
- `src/sections/KernelExecutionLifecycle.tsx:184`: "PSUM (Partial Sum Buffer, 2 MiB)" changed
  to "PSUM (Partial Sum buffer, 2 MiB)", matching HeterogeneityFact, AwsCustomSilicon and
  MemoryHierarchyPrimer.
- `src/sections/KernelExecutionLifecycle.tsx:426, 456`: acronym standard. PDL first appears in
  the "Shortening the lifecycle" h2 description, so the expansion moved there ("PDL
  (Programmatic Dependent Launch)") and the body reads "PDL, available from compute
  capability 9.0".

The diagram was not changed.

## Checks

- `pnpm exec tsc --noEmit | grep -E "KernelExecutionLifecycle|KernelLifecycleDiagram|sources/KernelExecutionLifecycle"`: "no type errors in my files" (exit 0)
- `pnpm exec eslint src/sections/KernelExecutionLifecycle.tsx src/sources/KernelExecutionLifecycle.ts src/components/KernelLifecycleDiagram.tsx --max-warnings 0`: exit 0
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t KernelExecutionLifecycle`: 1 passed, 34 skipped (exit 0)
- `pnpm exec vitest run src/__tests__/sources.test.ts`: 839 passed, 1 failed. The failure is the sources.md snapshot, and its only diff line is the cutlassChangelog row's "cited in" list, which gains KernelExecutionLifecycle. URL, title, publisher and tier consistency all pass. sources.md is not mine (see below).
- Gates from the repo root: no-ai-tells exit=0, svg-a11y exit=0, pinned-refs exit=0, pre-overflow exit=0; no hit names KernelExecutionLifecycle or KernelLifecycleDiagram in any output.
- `pnpm exec vite build --outDir /tmp/vf-KernelExecutionLifecycle-dist --emptyOutDir`: exit 0
- `node scripts/shoot.mjs --sections kernel-lifecycle --widths 1440,390 ...`: "kernel-lifecycle @1440: 1 SVG diagram(s), 0 React Flow, ok" and "@390: ... ok" (exit 0). PNGs read: clean at 1440; at 390 it scrolls horizontally inside its wrapper, and the text is legible.

## For the orchestrator

- Regenerate `sources.md` (`vitest -u` on `src/__tests__/sources.test.ts`). The cutlassChangelog
  row's "cited in" list now includes KernelExecutionLifecycle. Nothing else differs.
- The `luoHopperBench` URL (`https://arxiv.org/pdf/2402.13499`) is unversioned while the title
  says v1. As of 2026-10-23 only v1 exists (identical PDF, abs page lists [v1]), so the figures
  hold. If the dive pins arXiv versions after the Mooncake finding, change it to
  `.../pdf/2402.13499v1` in MemoryHierarchyPrimer.ts, NvidiaHopper.ts and this file together,
  so the shared record stays identical.

## Backlog

- The GigaThread engine is named only by the Blackwell Ultra blog among the sources checked.
  The diagram places it over an H100-labelled SM row, and the lanes row reads "Hopper and
  Blackwell". A search turned up NVIDIA's Kepler GK110 whitepaper, which describes "thread
  block level scheduling (e.g., the GigaThread engine)". The H100 whitepaper was not fetched.
  A Hopper-era NVIDIA source for the name would close the scope fully. This is an enhancement,
  not a correction.
- Register and TMEM load latency: "None located" stands. A future microbenchmark source (or a
  Tier 0 experiment) could fill both cells and add B200 equivalents.
