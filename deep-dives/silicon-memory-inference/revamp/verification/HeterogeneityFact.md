# Verification: The Heterogeneity Fact

Verified: 2026-10-18. Claims checked: 38 (sampled: 0). Confirmed 27, wrong 0,
unsupported 11, mislabelled 0, unverifiable 0.

## Gate 3 score: 8/10

Nothing load-bearing was wrong. Every number (10 to 14 cycles, 78 and 115 ns, 900,000 cores, 44 GB, 1.2 PB, 500 MB, 512 GB, 256 LPUs, 144 and 64 chips, 10 TFLOPS) matches its source. The 11 unsupported clauses were mostly cited to the wrong page and are now re-cited or softened. The bet table and stall grid give the reader four questions that place any chip, and the section ends on a concrete action: place by FLOP per byte, port by mechanism. It stops at 8 rather than 9 because the five-column table needs a sideways scroll at 390 px and is now dense with badges, and because the cross-reference line does neither job.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 8 | 27 of 38 confirmed as shipped, 0 wrong. Unsupported: 7 citations to pages that do not carry the clause (PTX for HBM, NVFP4 blog for Hopper FP64, Trainium pages for NEFF, NeuronCore-v3 for SBUF/PSUM names and tile sizing, SDK blog for compile-time routes twice), all re-cited. 4 overstatements softened ("no global scheduler", row and column tiling, "sets per-token time", "shipping") |
| Mental model or practical value | 8 | The four delivery questions are reusable on an unfamiliar chip. The stall grid tells the reader where each stall shows up (runtime profile, occupancy, compiled schedule). The closing paragraph gives the action. The small-print cross-reference line ("Each family has its own section...") is navigation only |
| Shape | 8 | The opening paragraph names the execution models before the table. Both h2 descriptions state the payoff. 10 to 14 cycles appears in the stall grid and the closing paragraph. Ends on the reader's next action. Supporting arithmetic sits in Cite notes; no ExpandableSection, but none is clearly needed |
| Writing | 8 | no-ai-tells passes. No "Section N" references. Attribution is in the links. "In LLVM's scheduling models" is the one in-sentence attribution, and it is load-bearing because it marks the figure as a compiler estimate |
| Economy | 9 | 865 to 881 words (+1.8%, author's count). The fixes add about 20 words. No repetition apart from the intended repeat of the number |
| Diagrams | 8 | No SVG or React Flow (probe: "0 SVG diagram(s), 0 React Flow, ok" at 1440 and 390). At 1440 the table fits and every badge sits inline. At 390 the table scrolls inside its container with readable columns, and there is no page-level overflow |

## Claims

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | SVE2 on Graviton4 and Graviton5 | gravitonReadme | CONFIRMED | README.md:84 at 8b322a4: "Graviton4 and Graviton5 support SVE2 and SVE." | |
| 2 | AVX-512 on EPYC Turin | m8aPage | CONFIRMED | "support expanded instruction sets including AVX-512, VNNI, and bfloat16"; "5th Generation AMD EPYC processors (formerly code named "Turin")" | |
| 3 | AMX tiles on Xeon 6 | m8iPage | CONFIRMED | "Intel Xeon 6 processors offer enhanced built-in accelerators such as Advanced Matrix Extensions (AMX)" | |
| 4 | Warp scheduler issues from ready warps; recovery issues from another resident warp | cudaBestPractices | CONFIRMED | 11.1 Occupancy (CUDA 13.4): "executing other warps when one warp is paused or stalled is the only way to hide latencies and keep the hardware busy" | |
| 5 | wgmma (Hopper), tcgen05 (Blackwell) | ptxIsa | CONFIRMED | PTX ISA 9.4: wgmma.mma_async "Requires sm_90a"; "Starting with the Hopper architecture (sm_9x)"; 9.7.18 tcgen05 "5th generation TensorCore", "On architecture sm_100a / sm_100f" | |
| 6 | Registers, SMEM, TMEM (Blackwell), L2, HBM | ptxIsa | UNSUPPORTED (HBM only) | PTX ISA 9.4 has the .reg and .shared state spaces, Tensor Memory (9.7.18.1) and L2 cache operators; "HBM" has 0 hits | Added hopperArchBlog after HBM: "The H100 SXM5 GPU is the world's first GPU with HBM3 memory" |
| 7 | FP8 to FP64 on Hopper | nvfp4Blog | UNSUPPORTED (Hopper FP64) | Blog: "FP8 is supported by Hopper and Blackwell"; FP64 is listed only for Blackwell | Added hopperArchBlog after "FP64 on Hopper": "The FP8, FP16, BF16, TF32, FP64, and INT8 MMA data types are supported." |
| 8 | FP4 to FP64 on Blackwell | nvfp4Blog | CONFIRMED | "support for FP64, FP32/TF32, FP16/BF16, INT8/FP8, FP6, and FP4 data formats" | |
| 9 | B300 cuts FP64 to 10 TFLOPS per 8-GPU board | hgxPage | CONFIRMED | HGX B300 "FP64/FP64 Tensor Core 10 TFLOPS", HGX B200 "296 TFLOPS", columns headed "8x NVIDIA Blackwell Ultra SXM" / "8x NVIDIA Blackwell SXM". Matches *NVIDIA Blackwell: B200 and B300* ("FP64, 8-GPU HGX board", 10 TFLOPS) | |
| 10 | Neuron compiler fixes the schedule in a NEFF | trainium2Arch, trainium3Arch | UNSUPPORTED by cited pages | Neither page mentions the compiler or NEFF (Trainium3 page: no content on compiler, scheduling or NEFF). NKI overview: "eventually generates a NEFF (Neuron Executable File Format)"; "memory allocation and instruction scheduling are done in this stage" | Added nkiOverview (T1, same record as AwsCompilersAndTooling.ts) on the NEFF clause |
| 11 | ISA extensions add dynamic shapes and control flow (Trainium2 and Trainium3) | trainium2Arch, trainium3Arch | CONFIRMED | "Trainium2 supports dynamic shapes and control flow via NeuronCore-v3 ISA extensions."; "Trainium3 supports dynamic shapes and control flow, via ISA extensions of NeuronCore-v4." | |
| 12 | SBUF (State Buffer) and PSUM (Partial Sum buffer), software-managed on-chip SRAM | neuronCoreV3 | UNSUPPORTED (names) | NeuronCore-v3 page: "on-chip SRAM is software-managed to maximize data locality"; SBUF and PSUM appear only in the nav. NKI Trn/Inf2 guide: "two software-managed on-chip SRAMs, a 24MiB SBUF as the main data storage and a 2MiB PSUM"; "state buffer (SBUF) and partial sum buffer (PSUM)" | Added nkiTrnInf2Arch (T1, same record as Thesis and Framing) |
| 13 | Systolic-array tiles sized at compile time to fit SBUF | neuronCoreV3 | UNSUPPORTED (tile sizing) | NeuronCore-v3: "Tensor engines are based on a power-optimized systolic array" (confirms the array only). NKI Trn/Inf2 guide: "systolic array with 128 rows and 128 columns of processing elements, which streams input data from SBUF"; "Layout and tile size requirement for input and output tensors" | Added nkiTrnInf2Arch. "At compile time" rests on nkiOverview in the same row ("memory allocation and instruction scheduling are done in this stage") |
| 14 | 900,000 cores | cerebrasS1 | CONFIRMED | S-1, Business: "The WSE combines 900,000 compute cores, 44 gigabytes of on-chip memory" | |
| 15 | Each core runs its own program | cerebrasSdkBlog | CONFIRMED | "Each PE has its own 48 kB of memory (used by it and no other), containing both instructions and data." SDK docs: "you can configure each PE with a different program" | |
| 16 | A core fires a task when its data arrives | cerebrasSdkBlog | CONFIRMED | "computation is activated by the arrival of data on a processing element (PE)" | |
| 17 | "no global scheduler" | cerebrasS1, cerebrasSdkBlog | UNSUPPORTED | Neither source mentions a scheduler (S-1: 0 hits for "scheduler"). SDK docs describe a per-core choice: "tasks are started by the PE hardware and run until they complete. At that point, the hardware chooses a new task to run." Same verdict as *Thesis and Framing* claim 18 | Now "; each core's own hardware picks its next task" + cerebrasSdkDocs (T1, same record as CerebrasWaferScale.ts) |
| 18 | 44 GB of on-wafer SRAM | cerebrasS1 | CONFIRMED | "44 gigabytes of on-chip memory"; WSE-3 release "44GB on-chip SRAM" | |
| 19 | Larger models split by layer across CS-3 systems | cerebrasInferenceBlog | CONFIRMED | "When models exceed the memory capacity of a single wafer, we split them at layer boundaries and map them to multiple CS-3 systems." (2024-08-27) | |
| 20 | Training adds up to 1.2 PB of external memory | wse3Press | CONFIRMED | "External memory: 1.5TB, 12TB, or 1.2PB"; "With a huge memory system of up to 1.2 petabytes, the CS-3 is designed to train next generation frontier models" | |
| 21 | Row and column tiling over a two-dimensional mesh of cores | cerebrasSdkBlog | UNSUPPORTED (tiling) | Blog: "a two-dimensional rectangular mesh on one single silicon wafer"; no row or column tiling. SDK docs: "specifying a rectangle of active PEs and a code file assigned to each PE". GEMV tutorial 6 splits A's columns across two PEs, no 2D tiling | Now "Work split across a rectangle of cores on a two-dimensional mesh, each core working from its own memory", cited to cerebrasSdkBlog and cerebrasSdkDocs |
| 22 | Routes are fixed at compile time; arriving data decides which task runs next | cerebrasSdkBlog | UNSUPPORTED (routes); CONFIRMED (task) | Blog never mentions routes or compile time. SDK docs: "You connect a PE to another PE by specifying routes for colors."; "This layout must be defined at compile time". Blog: "a task may be activated by its arrival" | cerebrasSdkDocs cited on "Routes are fixed at compile time"; cerebrasSdkBlog kept on the task clause |
| 23 | Mitigation: placement and routing at compile time | cerebrasSdkBlog | UNSUPPORTED | As 22 (ORCH-NOTES item) | cerebrasSdkBlog replaced by cerebrasSdkDocs |
| 24 | Groq 3 LPU: compiler schedules computation, data movement and synchronization; no runtime hardware scheduler | lpxBlog | CONFIRMED | "the compiler explicitly schedules computation, data movement, and synchronization. Instead of relying on dynamic hardware schedulers at runtime" | |
| 25 | 500 MB on-chip SRAM per LPU as primary working storage | lpxBlog | CONFIRMED | "500 MB of high-speed on-chip SRAM serves as the primary working storage for inference" | |
| 26 | Up to 512 GB of DRAM per 16-LPU tray | lpxBlog | CONFIRMED | Table 2: "LP30 chips 16 ... DRAM via fabric expansion logic Up to 512 GB" (the tray also lists "DRAM via host CPU Up to 256 GB") | |
| 27 | FP8 compute across 256 LPUs per rack | lpxBlog | CONFIRMED | "AI inference compute (FP8) 19.2 PFLOPS" per tray; "built around 256 interconnected NVIDIA Groq 3 LPU accelerators". No FLOPS figure shown on the page, so no dense/sparse label needed | |
| 28 | The compiled schedule sets per-token time | lpxBlog | UNSUPPORTED as worded | "For real-time inference, this determinism helps keep time-to-first-token and per-token latency stable" | Now "The compiled schedule helps keep per-token latency stable" |
| 29 | A plesiosynchronous chip-to-chip protocol keeps the LPUs in step | lpxBlog | CONFIRMED | "plesiosynchronous, chip-to-chip protocol in hardware that cancels natural clock drift and aligns hundreds of LPU accelerators to act as a single coordinated system" | |
| 30 | P5 (Hopper), P6 (Blackwell) | ec2AcceleratedSpecs | CONFIRMED | p5.48xlarge "8 x NVIDIA H100 GPU", p5e/p5en "8 x NVIDIA H200 GPU", p6-b200.48xlarge "8 x NVIDIA B200 GPU" | |
| 31 | Trn3 UltraServer of up to 144 Trainium3 chips | trn3Page | CONFIRMED | "Trn3 UltraServers scale up to 144 Trainium3 chips" | |
| 32 | Trn2 UltraServer's 64-chip NeuronLink domain | trn2Arch | CONFIRMED | "a total of 64 Trainium2 chips to be interconnected within a Trn2 UltraServer"; "connected together via the NeuronLink-v3 chip-to-chip interconnect" | |
| 33 | An NVIDIA Groq 3 LPX rack or GroqCloud | lpxProduction, groqNvidiaLicense | CONFIRMED | "NVIDIA Groq 3 LPX ... is now in full production" (2026-08-24); "GroqCloud will continue to operate without interruption" (2025-12-24) | |
| 34 | An M8i fleet with AMX | m8iPage | CONFIRMED | "with FP16 support on M8i and M8i-flex instances" | |
| 35 | Mispredict 10 to 14 cycles in LLVM's scheduling models (note: V2 10 "Copied from N2", Zen 4 13, Sapphire Rapids 14) | llvmNeoverseV2, llvmZnver4, llvmSapphireRapids | CONFIRMED | llvmorg-19.1.0: AArch64SchedNeoverseV2.td:20 `MispredictPenalty = 10; // ... NOTE: Copied from N2.`; X86ScheduleZnver4.td:53 `= 13` ("The common case penalty is 13 cycles", :52); X86SchedSapphireRapids.td:19 `= 14` | |
| 36 | DRAM miss: hundreds of cycles; Pond 78 and 115 ns; about 230 to 350 cycles at 3 GHz (derived) | pond | CONFIRMED | §6.1: "On Intel, we measure 78ns NUMA-local latency"; "On AMD, we measure 115ns NUMA-local latency"; Figure 4 "Local: 115ns" / "Local: 78ns". 78 x 3 = 234, 115 x 3 = 345. Tier 3 correct for arXiv | |
| 37 | h2 description: "answered for five shipping architectures" | lpxProduction | UNSUPPORTED (LPX) | "is now in full production"; "will be offered on a when-and-if-available basis"; Nebius "is the first AI cloud to adopt". Production is confirmed, customer shipment is not | Now "answered for five architectures in production" |
| 38 | Closing: "a 10 to 14 cycle mispredict refill" | as 35 | CONFIRMED | Same figures | |

## ORCH-NOTES items

- **Cerebras SDK blog cited for compile-time routing:** UNSUPPORTED, fixed. The blog covers wavelets, colors, 48 kB per PE and task activation on data arrival. It never mentions routes or compile time. The `cerebrasSdkDocs` record is reused from `src/sources/CerebrasWaferScale.ts` with the same key, title, URL and tier ("Cerebras SDK docs: Wafer-Scale Engine Architecture", https://sdk.cerebras.ai/computing-with-cerebras, T1). It is now cited on "Routes are fixed at compile time" (table) and "Mitigation: placement and routing at compile time" (stall grid). Source text: "This layout must be defined at compile time"; "You connect a PE to another PE by specifying routes for colors." The same blog was also cited for "no global scheduler" and "row and column tiling", neither of which it states (claims 17, 21; fixed).
- **Cerebras PFLOPS sparse label:** NOT APPLICABLE. The section quotes no Cerebras FLOPS or ridge figure.
- **LLVM mispredict penalties at llvmorg-19.1.0:** CONFIRMED, each against the raw file at the tag. AArch64SchedNeoverseV2.td:20 `let MispredictPenalty     =  10; // Extra cycles for mispredicted branch.  NOTE: Copied from N2.` X86ScheduleZnver4.td:53 `let MispredictPenalty = 13;`, with the comment at :51-52 "The branch misprediction penalty is in the range from 11 to 18 cycles, <...>. The common case penalty is 13 cycles." X86SchedSapphireRapids.td:19 `let MispredictPenalty = 14;`. The range is 10 to 14, and the note's three values and the "Copied from N2" comment are exact. The figures match *Thesis and Framing* claim 23.
- **Graviton, Xeon, Hopper/Blackwell SM, Trainium NeuronCore, WSE-3 and Groq LPU facts against the cited pages:** see claims 1 to 34. Five cited pages did not carry the clause they were attached to (claims 6, 7, 10, 12, 13), and each now also cites the page that does. **Consistency with the dedicated sections: no mismatches found.**
  - *Graviton Deep Dive* :416: "Graviton4 adds SVE2".
  - *Intel Xeon 6* :56/:77: "AVX-512; AMX with FP16" for M8i.
  - *AMD EPYC Turin* :134: "Zen 5 runs AVX-512".
  - *NVIDIA Hopper* :331-342: wgmma; "hides a stalled warp's latency by running other warps".
  - *NVIDIA Blackwell: B200 and B300* :197-206: "FP64, 8-GPU HGX board", 10 TFLOPS; tcgen05.mma; TMEM.
  - *AWS Trainium, Inferentia and Neuron* :110-119: compiler fixes order in a NEFF; ISA extensions on Trainium2 and Trainium3; SBUF/PSUM. :334-348: 144-chip Gen2 and 64-chip Trn2 UltraServers.
  - *Cerebras Wafer-Scale* :110-130 and :193-197: 900,000 cores, 44 GB, layer splits, 1.2 PB, compiled routes plus data-triggered tasks.
  - *Groq, SambaNova and Dataflow* :94-102: no dynamic hardware scheduler, 500 MB SRAM, 512 GB per 16-LPU tray, 256 LPUs, plesiosynchronous protocol.
- **Groq 3 LPX placement (Thesis verification, coordinator message):** CONSISTENT on placement. The section never puts LPX inside a GPU rack or inside Vera Rubin. Its wording is "NVIDIA Groq 3 LPU, in the Groq 3 LPX rack" and "an NVIDIA Groq 3 LPX rack or GroqCloud", cited to `lpxProduction`/`lpxBlog`, which use the same keys, titles and URLs as Thesis. The h2 description "five shipping architectures" did overstate LPX status. The release says "is now in full production" and "will be offered on a when-and-if-available basis", so the description now reads "five architectures in production" (claim 37).
- **Rubin HBM4, Trainium3 NeuronLink-v4, MI355X, DeepEP, B300 HBM stacks:** NOT APPLICABLE. The section quotes none of them.
- **Length growth:** +1.8% (author's count), well under 20%.

## Fixes applied

All in `src/sections/HeterogeneityFact.tsx` unless noted:

- :52-54 GPU data cell: "..., L2, HBM (High Bandwidth Memory)<Cite ptxIsa/>" -> "..., L2<Cite ptxIsa/>, HBM (High Bandwidth Memory)<Cite hopperArchBlog/>".
- :59-61 GPU shape cell: "FP8 ... to FP64 on Hopper, FP4 to FP64 on Blackwell<Cite nvfp4Blog/>" -> "FP8 ... to FP64 on Hopper<Cite hopperArchBlog/>, FP4 to FP64 on Blackwell<Cite nvfp4Blog/>".
- :71-72 Trainium instruction cell: added `<Cite s={S.nkiOverview} />` after "NEFF (Neuron Executable File Format)".
- :81 Trainium data cell: added `<Cite s={S.nkiTrnInf2Arch} />` before the neuronCoreV3 cite.
- :89 Trainium shape cell: added `<Cite s={S.nkiTrnInf2Arch} />`.
- :97-101 WSE-3 instruction cell: "...fires a task when its data arrives; no global scheduler<Cite cerebrasS1/><Cite cerebrasSdkBlog/>" -> "...fires a task when its data arrives<Cite cerebrasS1/><Cite cerebrasSdkBlog/>; each core's own hardware picks its next task<Cite cerebrasSdkDocs/>".
- :114-117 WSE-3 shape cell: "Row and column tiling over a two-dimensional mesh of cores<Cite cerebrasSdkBlog/>" -> "Work split across a rectangle of cores on a two-dimensional mesh, each core working from its own memory<Cite cerebrasSdkBlog/><Cite cerebrasSdkDocs/>".
- :122-124 WSE-3 stall cell: "Routes are fixed at compile time; arriving data decides which task runs next<Cite cerebrasSdkBlog/>" -> "Routes are fixed at compile time<Cite cerebrasSdkDocs/>; arriving data decides which task runs next<Cite cerebrasSdkBlog/>".
- :152 LPU stall cell: "The compiled schedule sets per-token time" -> "The compiled schedule helps keep per-token latency stable".
- :202 h2 description: "answered for five shipping architectures" -> "answered for five architectures in production".
- :290-291 stall grid, WSE-3 Mitigation: `<Cite s={S.cerebrasSdkBlog} />` -> `<Cite s={S.cerebrasSdkDocs} />`.
- `src/sources/HeterogeneityFact.ts`: added `nkiOverview` (:40, T1, same as AwsCompilersAndTooling.ts), `nkiTrnInf2Arch` (:47, T1, same as ThesisAndFraming.ts and AwsCustomSilicon.ts), `hopperArchBlog` (:138, T2, same as NvidiaHopper.ts) and `cerebrasSdkDocs` (:159, T1, same as CerebrasWaferScale.ts). Each has accessed 2026-10-18, because each was fetched today.

## Checks

- `pnpm exec tsc --noEmit 2>&1 | grep -E "HeterogeneityFact"`: no hits ("no type errors in my files").
- `pnpm exec eslint src/sections/HeterogeneityFact.tsx src/sources/HeterogeneityFact.ts --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t HeterogeneityFact`: exit 0 (1 passed, 34 skipped).
- `pnpm exec vitest run src/__tests__/sources.test.ts`: tier consistency passes, 828 of 829. Only the sources.md snapshot fails. It needs HeterogeneityFact added to the nkiOverview, nkiTrnInf2Arch, cerebrasSdkDocs and hopperArchBlog rows; it already failed on other sections' new rows.
- Gates from the repo root, `no-ai-tells`, `svg-a11y`, `pinned-refs`, `pre-overflow`: each exit 0, with no HeterogeneityFact hits.
- `pnpm exec vite build --outDir /tmp/vf-HeterogeneityFact-dist --emptyOutDir`: exit 0. `node scripts/shoot.mjs --sections heterogeneity --widths 1440,390 ...`: "heterogeneity @1440: 0 SVG diagram(s), 0 React Flow, ok" and the same at 390. I read both PNGs. At 1440 the table fits with badges inline and the new cites wrap cleanly. At 390 the table scrolls inside its container, with no page-level overflow.

## For the orchestrator

- Regenerate `sources.md`. HeterogeneityFact now also cites nkiOverview, nkiTrnInf2Arch, cerebrasSdkDocs and hopperArchBlog.
- The same citation gap may exist elsewhere: the NeuronCore-v3 page never names SBUF or PSUM ("on-chip SRAM is software-managed" only). Two places cite it for those names:
  - *AWS Trainium, Inferentia and Neuron* (`AwsCustomSilicon.tsx:118-121`, "The two on-chip scratchpads, SBUF (State Buffer) and PSUM ... <Cite neuronCoreV3/>").
  - *Isolation: NIE and MIG* (`IsolationNie.tsx:455-457`, "the core's SBUF (State Buffer) scratchpad ... <Cite neuronCoreV3/>").
  
  `nkiTrnInf2Arch` states both: "two software-managed on-chip SRAMs, a 24MiB SBUF as the main data storage and a 2MiB PSUM".
- The Trainium2 and Trainium3 architecture pages say nothing about the compiler or NEFF. Any section that cites only those two pages for "the compiler fixes the schedule in a NEFF" should add nkiOverview, which says "eventually generates a NEFF" and "memory allocation and instruction scheduling are done in this stage".
- The NVFP4 blog lists FP64 only for Blackwell. A section that cites it for Hopper's FP64 or full format range should cite hopperArchBlog instead: "The FP8, FP16, BF16, TF32, FP64, and INT8 MMA data types are supported."
- The `lpxProduction` record here has accessed 2026-10-16; Thesis has 2026-10-17. Same key, title, URL and tier, so cosmetic only.
- Glossary acronyms for this section are as listed in the author's report. The fixes add none.

## Backlog

- At 390 px the five-column bet table needs a sideways scroll. A per-architecture card layout on narrow screens would read better (enhancement).
- The cross-reference small print ("Each family has its own section, from *Graviton Deep Dive* through ...") is navigation. It could become links, or come out in a later shaping pass.
- The table cells now carry up to three citation badges, the WSE-3 instruction cell among them. Folding shared citations into a row footnote would lighten the table (enhancement).
