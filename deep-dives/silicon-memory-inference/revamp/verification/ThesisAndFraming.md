# Verification: Thesis and Framing

Verified: 2026-10-18. Claims checked: 32 (sampled: 1, claim 19). Confirmed 25, wrong 1,
unsupported 5, mislabelled 1, unverifiable 0.

## Gate 3 score: 8/10

The anchor numbers are exact and match *Roofline and Arithmetic Intensity* (1,979 TFLOPS
dense FP8, 4.8 TB/s, ridge 412, sparse ridge 825), and the triangle plus the ridge give a
first-time reader a model they can reuse on any chip. The one wrong claim was framing,
not arithmetic: the heterogeneity h2 said a GPU rack carries the LPX chip, while NVIDIA
describes LPX as its own rack deployed alongside Vera Rubin NVL72. Four unsupported
clauses were re-cited or reworded. What keeps it from 9 is shape and economy: the sparse
aside is small text rather than an ExpandableSection, and the closing navigation
paragraph is a long run of section names.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 8 | 25 of 32 confirmed as shipped. Every anchor number is exact. Wrong: the h2 "GPU rack carries a second kind of chip" (fixed). Unsupported clauses (2:4, PSUM, "no global scheduler", compile-time routes, "LPX runs the MoE expert FFNs") re-cited or softened. |
| Mental model or practical value | 8 | The triangle and the 412 vs 2 to 10 anchor build the model. The mispredict alert tells the reader to check that the mechanism exists before porting a tuning result. The weakest block is the "Across chips the spread is wider" list, which names chips without saying which delivery each bets on. |
| Shape | 8 | Introduces each idea before dissecting it. h1 and heterogeneity h2 descriptions state the payoff. 412 lands twice. Ends on the reader's next action ("work out its FLOP per byte ... then open *Roofline and Arithmetic Intensity*"). The sparse aside is not in an ExpandableSection. The "What to ask instead" description restates the topic. |
| Writing | 8 | no-ai-tells gate passes. No "Section N" references. Attribution sits in the links. The one sentence-level attribution, "NVIDIA's 3,958 TFLOPS FP8 headline is 'With sparsity'", is load-bearing because it grades a vendor headline. |
| Economy | 8 | +8% words (1,099 to 1,190, author's count), all from the NEW LPX paragraph and the sparse aside. The closing navigation paragraph is heavy. |
| Diagrams | 8 | React Flow with `role="img"` and an aria-label sentence (React Flow renders HTML nodes, so there is no SVG `<title>`). The 1440 and 390 shots are clean: every label inside its box, arrows clear of text, smallest text legible at 390. No numbers. |

## Claims

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | Headline peak FLOPS often quoted with sparsity | gb300Nvl72 | CONFIRMED | "All Tensor Core specifications are with sparsity unless otherwise noted." (footnote 1) | |
| 2 | A dense model reads every weight per token; an MoE model reads the experts each token selects | deepseekV3Report | CONFIRMED | "671B total parameters with 37B activated for each token" (abstract) | |
| 3 | H200 SXM 1,979 TFLOPS dense FP8 | h200Page, hopperArchBlog (derived) | CONFIRMED | H200 spec table, SXM column: "FP8 Tensor Core² 3,958 TFLOPS"; "² With sparsity." 3,958 / 2 = 1,979 | |
| 4 | Hopper blog lists Tensor Core peaks as dense/sparse pairs at 1:2 (sparseNote) | hopperArchBlog | CONFIRMED | Table 1, H100 SXM5: "Peak FP8 Tensor Core | 2000 TFLOPS | 4000 TFLOPS²"; footnote 2 "Effective TFLOPS / TOPS using the Sparsity feature"; sparsity is "doubling the performance" | |
| 5 | 4.8 TB/s of HBM3e | h200Page | CONFIRMED | "141 gigabytes (GB) of HBM3e memory at 4.8 terabytes per second (TB/s)"; table "GPU Memory Bandwidth 4.8TB/s" | |
| 6 | Ridge about 412 FLOP per byte | h200Page (derived) | CONFIRMED | 1,979 / 4.8 = 412.3. Matches *Roofline and Arithmetic Intensity* ("1,979 / 4.8 = 412") | |
| 7 | 8-bit weights at batch 1 to 5: decode at 2 to 10 FLOP per byte | roofline (derived) | CONFIRMED | 2 FLOP per multiply-add x B per 1-byte weight: 2 to 10. Same model as the Roofline section's decodeNote | |
| 8 | "40 to 200 times below the ridge" | roofline (derived) | CONFIRMED, rounded | 412 / 10 = 41.2, 412 / 2 = 206 (note). The prose rounds 41 and 206 down to 40 and 200. Roofline says "about 200 times" | Added "about" |
| 9 | Doubling bandwidth roughly doubles tokens/s until a latency floor sets the step time | roofline (derived) | CONFIRMED | Follows from min(peak, bandwidth x intensity) below the ridge (rooflineNote) | |
| 10 | 3,958 TFLOPS FP8 is "With sparsity" | h200Page | CONFIRMED | footnote 2 "With sparsity." | |
| 11 | Sparse rate applies only to weights pruned to the 2:4 structured pattern | h200Page | UNSUPPORTED | H200 page says only "With sparsity"; Hopper blog says "fine-grained structured sparsity", no 2:4 | Added sparsityBlog (NVIDIA, T2, record copied from the Roofline section): "sparse Tensor Cores, which require a 2:4 sparsity pattern" |
| 12 | Sparse ridge 825 | h200Page (cited as spec) | MISLABELLED | 3,958 / 4.8 = 824.6 is our arithmetic | Cite now `kind="derived"` with a note: 3,958 / 4.8 = 825 |
| 13 | An SM issues from a warp scheduler and hides a stalled warp's latency by running other warps | cudaBestPractices | CONFIRMED | 11.1 Occupancy: "executing other warps when one warp is paused or stalled is the only way to hide latencies and keep the hardware busy" (CUDA 13.4) | |
| 14 | Trainium2 and Trainium3 add ISA support for dynamic shapes and control flow (orchestrator edit) | trainium2Arch, trainium3Arch | CONFIRMED | Trainium2, Programmability row: "Trainium2 supports dynamic shapes and control flow via NeuronCore-v3 ISA extensions." Trainium3: "Trainium3 supports dynamic shapes and control flow, via ISA extensions of NeuronCore-v4." | |
| 15 | WSE-3 has 900,000 cores | cerebrasS1 | CONFIRMED | "The WSE combines 900,000 compute cores, 44 gigabytes of on-chip memory" (Business) | |
| 16 | Each core runs its own program from 48 kB of local SRAM | cerebrasSdkBlog, cerebrasS1 | CONFIRMED | Blog: "Each PE has its own 48 kB of memory (used by it and no other), containing both instructions and data." S-1: "we can maximize fast, on-chip SRAM" | |
| 17 | A core fires a task when its data arrives | cerebrasSdkBlog | CONFIRMED | "computation is activated by the arrival of data on a processing element (PE)" | |
| 18 | "with no global scheduler" | cerebrasS1, cerebrasSdkBlog | UNSUPPORTED | Neither source mentions a scheduler of any kind. SDK docs describe a per-PE task picker: "the hardware selects the next runnable task" | Replaced with "each core's own task picker chooses what runs next" and added cerebrasSdkDocs (T1, record copied from CerebrasWaferScale.ts) |
| 19 | GPU SM register file filled from SMEM and, on Blackwell, TMEM | ptxIsa | CONFIRMED (sampled) | PTX ISA 9.4 carries the Tensor Memory chapter (9.7.18). The register-file wording was not re-read | |
| 20 | On Trainium the tier is SBUF (State Buffer) and PSUM (Partial Sum buffer) | trainium2Arch | UNSUPPORTED (PSUM, expansions) | Trainium2 page: "SBUF Capacity (MiB)" only. No PSUM, no expansion | Added nkiTrnInf2Arch (T1, same record as AwsCustomSilicon.ts): "two on-chip SRAMs: state buffer (SBUF) and partial sum buffer (PSUM)" |
| 21 | AMX tile register holds at most 16 rows of 64 bytes | clangAmxIntrin | CONFIRMED | amxintrin.h:229 at llvmorg-23.1.3: "AMX tile register size can be configured, the maximum size is 16x64=1024 bytes." | |
| 22 | tcgen05 reads TMEM in fixed data-path layouts | ptxIsa | CONFIRMED | 9.7.18.10.5 Data Path Layout Organization: "Different MMA variants access the tensor memory with different layout organization." | |
| 23 | Mispredict 10 to 14 cycles in LLVM scheduling models | llvmNeoverseV2, llvmZnver4, llvmSapphireRapids | CONFIRMED | llvmorg-19.1.0: NeoverseV2 `MispredictPenalty = 10; ... NOTE: Copied from N2.`; Znver4 `= 13` ("The common case penalty is 13 cycles"); SapphireRapids `= 14` | |
| 24 | "On WSE-3 the compiler fixes the routes" | none (sentence cite was cerebrasInferenceBlog) | UNSUPPORTED | The inference blog never mentions a compiler. SDK docs: "This layout must be defined at compile time"; "You connect a PE to another PE by specifying routes for colors." | Split the sentence and cited cerebrasSdkDocs on this clause |
| 25 | A model larger than one wafer is split at layer boundaries across several CS-3 systems | cerebrasInferenceBlog | CONFIRMED | "When models exceed the memory capacity of a single wafer, we split them at layer boundaries and map them to multiple CS-3 systems." | |
| 26 | Vera Rubin platform includes NVIDIA Groq 3 LPX, a rack of LPUs on Groq technology NVIDIA licenses | groqNvidiaLicense, lpxProduction | CONFIRMED | Groq 2025-12-24: "non-exclusive licensing agreement with Nvidia for Groq's inference technology". NVIDIA: "An extension of the NVIDIA Vera Rubin platform"; "Groq and LPU are used under license from Groq, Inc." Blog: "a new rack-scale inference accelerator for the NVIDIA Vera Rubin platform" | |
| 27 | In full production since August 2026 | lpxProduction | CONFIRMED | 2026-08-24: "NVIDIA Groq 3 LPX ... is now in full production." Correctly not labelled roadmap. The release adds "when-and-if-available"; the page claims production only, not customer availability | |
| 28 | Each LPU's primary working storage is 500 MB of on-chip SRAM | lpxBlog | CONFIRMED | "Each LPU features 500 MB of compiler-managed SRAM"; "500 MB of high-speed on-chip SRAM serves as the primary working storage for inference" | |
| 29 | "Within decode, LPX runs the MoE expert FFNs while Rubin GPUs keep prefill and decode attention" | lpxBlog | UNSUPPORTED as worded | "LPX accelerates latency-sensitive execution within decode, such as sparse MoE expert feed-forward networks (FFNs)"; "while Rubin GPUs continue to handle prefill and decode attention". The FFNs are an example, not the whole remit | Now "runs latency-sensitive work such as the MoE expert FFNs" |
| 30 | One decode step crosses two kinds of silicon | lpxBlog | CONFIRMED | "decode is best thought of as a two-engine loop"; AFD "exchanges intermediate activations for each token" | |
| 31 | h2 description: "a 2026 GPU rack carries a second kind of chip for decode" | lpxBlog, lpxProduction | WRONG | Blog: "Deployed alongside Vera Rubin NVL72"; Fig. 7 "coordinating heterogeneous inference across two racks". Release: "NVIDIA Vera Rubin NVL72 and Groq 3 LPX ... These rack platforms." No page puts LPX inside a GPU rack | Now "NVIDIA's Vera Rubin platform pairs its GPU racks with a rack of a second kind of chip for decode" |
| 32 | Closing: ridge near 412, decode at 2 to 10 | h200Page, roofline | CONFIRMED | Same as claims 6 and 7 | |

Sampled: claim 19 only (qualitative and unchanged; the register graded it CORRECT). Every number was checked.

## ORCH-NOTES items

- **Anchor numbers vs Roofline and Arithmetic Intensity:** CONSISTENT. Dense FP8 1,979 TFLOPS, 4.8 TB/s, ridge 412 and sparse ridge 825 match the Roofline section's table and notes exactly (`RooflineAndArithmeticIntensity.tsx:74`, `:514`). "2 to 10" and "40 to 200 times" use the same 2B FLOP-per-byte model as Roofline's decodeNote. Roofline says "about 200 times below the ridge" at batch 1, so "about" was added here so the two rounded figures (41 and 206) read as approximate. No mismatch.
- **Trainium2 and Trainium3 ISA sentence (orchestrator edit):** CONFIRMED. Trainium2 page, Programmability row: "Trainium2 supports dynamic shapes and control flow via NeuronCore-v3 ISA extensions." Trainium3 page: "Trainium3 supports dynamic shapes and control flow, via ISA extensions of NeuronCore-v4." Note that trainium2Arch was also the only cite for SBUF and PSUM; the PSUM half was unsupported (claim 20, fixed).
- **Rubin HBM4 bandwidth (22 / 19.2 / 16.25 TB/s):** NOT APPLICABLE. The section quotes no Rubin bandwidth or FLOPS figure. The LPX blog it cites gives no HBM4 figure either.
- **"A 2026 GPU rack carries a second kind of chip for decode":** WRONG as worded (claim 31). NVIDIA describes LPX as a separate rack "deployed alongside Vera Rubin NVL72" and "an extension of the NVIDIA Vera Rubin platform". Scope: announced 2026-03-16 (blog) and "in full production" since 2026-08-24 (newsroom). The release offers products "on a when-and-if-available basis" and Nebius "plans to" offer LPX, so production is confirmed and customer deployment is not. The page says "in full production since August 2026", which keeps that scope.
- **Coordinator (Cerebras) items:** the compile-time routing clause is re-cited to `cerebrasSdkDocs` (same key, title and URL as CerebrasWaferScale.ts). This section quotes no Cerebras FLOPS or ridge figure, so the sparse-FP16 label does not apply.

## Fixes applied

- `src/sections/ThesisAndFraming.tsx:75`: "40 to 200 times below the ridge" -> "about 40 to 200 times below the ridge".
- `:82-87` sparse aside: plain `<Cite s={S.h200Page} />` after "Place workloads with the dense figure." -> `<Cite s={S.h200Page} kind="derived" note={sparseRidgeNote} />` and `<Cite s={S.sparsityBlog} />` after "ridge of 825."; new const `sparseRidgeNote` (`:21-22`): 'The H200 page marks FP8 Tensor Core 3,958 TFLOPS "With sparsity". 3,958 / 4.8 = 825 FLOP per byte.'
- `:124-128` WSE-3: "fires a task when its data arrives, with no global scheduler." -> "fires a task when its data arrives; each core's own task picker chooses what runs next." plus `<Cite s={S.cerebrasSdkDocs} />`.
- `:139-140` Data delivery: added `<Cite s={S.nkiTrnInf2Arch} />` after the trainium2Arch cite on SBUF/PSUM.
- `:171` heterogeneity h2 description: "which is why a 2026 GPU rack carries a second kind of chip for decode" -> "which is why NVIDIA's Vera Rubin platform pairs its GPU racks with a rack of a second kind of chip for decode".
- `:198-200` LPX: "Within decode, LPX runs the MoE expert FFNs (feed-forward networks) while Rubin GPUs keep ..." -> "Within decode, LPX runs latency-sensitive work such as the MoE expert FFNs (feed-forward networks), while Rubin GPUs keep ...".
- `:218-221` alert: "On WSE-3 the compiler fixes the routes, and a model larger than one wafer is split ..." -> "On WSE-3 the compiler fixes the routes.<Cite cerebrasSdkDocs/> A model larger than one wafer is split ...".
- `src/sources/ThesisAndFraming.ts`: added `sparsityBlog` (T2), `nkiTrnInf2Arch` (T1) and `cerebrasSdkDocs` (T1), all accessed 2026-10-18, with the same title, URL and tier as their records in RooflineAndArithmeticIntensity.ts, AwsCustomSilicon.ts and CerebrasWaferScale.ts.
- `TriangleDiagram.tsx`: not changed.

## Checks

- `pnpm exec tsc --noEmit | grep ...`: "no type errors in my files".
- `pnpm exec eslint src/sections/ThesisAndFraming.tsx src/sources/ThesisAndFraming.ts src/components/TriangleDiagram.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t ThesisAndFraming`: exit 0 (1 passed, 34 skipped).
- Gates from the repo root: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0, pre-overflow exit 0; no hits in my files.
- `vite build --outDir /tmp/vf-ThesisAndFraming-dist`: exit 0. `shoot.mjs --sections thesis --widths 1440,390`: "0 SVG diagram(s), 1 React Flow, ok" at both widths. The flow0 PNGs at 1440 and 390 show no overlap or clipping. The 390 full page shows no horizontal overflow.
- `vitest run src/__tests__/sources.test.ts`: the sources.md snapshot fails only on the three rows for the records added here (see below). 824 passed.

## For the orchestrator

- Regenerate `sources.md`. The snapshot test now differs on three rows: NKI Trainium/Inferentia2 Architecture Guide (adds ThesisAndFraming, accessed 2026-10-18), Cerebras SDK docs (adds ThesisAndFraming), and NVIDIA Structured Sparsity blog (adds ThesisAndFraming).
- `trainium2Arch` (the Trainium2 page) states SBUF capacity but never mentions PSUM or expands either acronym. Other sections that cite it alone for PSUM, or for "State Buffer" / "Partial Sum buffer", should add the NKI architecture guide.
- LPX placement: NVIDIA describes LPX as its own rack "deployed alongside Vera Rubin NVL72" ("two racks"), not as a chip inside a GPU rack. A grep of other sections found no inside-the-GPU-rack wording, but keep that phrasing out of the glossary and README.
- Glossary acronyms: unchanged from the author's list (no new acronyms added).

## Backlog

- Move the sparse aside into an ExpandableSection.
- Make the "Across chips the spread is wider" list say which delivery each family bets on, so it builds the model instead of naming chips.
- Give the "What to ask instead" h2 a payoff description, and shorten the closing navigation paragraph.
