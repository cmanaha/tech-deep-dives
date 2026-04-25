# Batch D — Sections 19-24 Polish Audit
Audit date: 2026-04-24
Quality bar reference: deep-dives/efa/src/sections/Architecture.tsx
Project rules: tech-deep-dives/CLAUDE.md

---

## Section 19 — Groq, SambaNova, and dataflow silicon
File: `src/sections/GroqSambanovaDataflow.tsx`

**Discipline:** all clear
- SectionShell wrapper: ABSENT (good)
- TLDR Alert: ABSENT (good)
- status badge: ABSENT (good)
- "Panelist map" Container: ABSENT (good)
- "Evaluation lens" Container: ABSENT (good)

**Acronyms missing expansion:**
- `SRAM` used at line 39 (intro) and line 58 — never expanded (Static Random-Access Memory). First occurrence is line 39.
- `HBM` used at line 39 and `HBM3` at line 61, 130 — never expanded (High-Bandwidth Memory). First niche occurrence line 39.
- `DDR` line 40, 61, 132 — never expanded (Double Data Rate memory).
- `SIMT` line 30 — never expanded (Single Instruction, Multiple Threads).
- `LPU` is expanded at line 81 but used earlier at line 58 unexpanded (first occurrence is line 58, expansion happens later).
- `RDU` is expanded at line 130 ("Reconfigurable Dataflow Unit") — fine.
- `MoE` line 142 — never expanded (Mixture of Experts) inside this section, though framed as "Composition of Experts (CoE)" at line 143. MoE at line 142 still needs an expansion at first niche use.
- `CoE` line 142 — expanded inline ("Composition of Experts") — fine.
- `HFT` line 160 (heading) — never expanded (High-Frequency Trading).
- `CUDA` line 178, `Triton`, `CUTLASS`, `vLLM`, `TensorRT-LLM` line 179 — these are product names, expansion not strictly required by the rule, but `CUDA` is borderline-niche acronym (Compute Unified Device Architecture) and project standard is to expand.

**Citation gaps:**
- Line 58-59: "230 MB of on-chip SRAM per LPU with ~80 TB/s on-chip bandwidth" — the 80 TB/s number has no inline citation. The Groq link at line 94 cites a different claim (per-model throughput).
- Line 60-62: "~520 MB of on-chip SRAM, plus 64 GB of HBM3, plus up to 1.5 TB of DDR" — no inline citation here; the SambaNova arXiv link appears one container down at line 137. Pull the citation up or duplicate.
- Line 92-93: "Llama 4 Scout at 460+ tokens/s at $0.11 / $0.34 per million input / output tokens" — Groq link present but bare URL `https://groq.com/` is not the specific pricing/model page. Link should resolve to `groq.com/pricing` or model-specific page.
- Line 130-133: "hundreds of MB of on-chip SRAM, 64 GB of HBM3, and up to 1.5 TB of DDR-attached memory" — Tier 1 number repeated without inline citation at this exact sentence (citation arrives at the end of the next sentence).
- Line 144-146: "150 experts at 1T parameters total, claimed to deliver 3.7× the performance of an 8-socket DGX H100" — load-bearing quantitative claims with no inline link in this paragraph.

**Other issues:**
- Line 170: forward-reference to "Section 28" — confirm Section 28 still exists and still covers capital-markets framing. If section numbering shifted post-renumber this is a stale reference.
- Line 170: forward-reference to "Section 18" (Cerebras) — same verification.
- Line 102: "competitive with wafer-scale" is editorialized; not a quantitative claim but borderline. Leave.
- Line 110: "Artificial Analysis being the cleanest available" — opinion, no citation. Acceptable as commentary but flag.

**Recommended corrections:**
1. Add an "Acronyms used" inline parenthetical on first occurrence: SRAM (Static Random-Access Memory), HBM (High-Bandwidth Memory), DDR (Double Data Rate), SIMT (Single Instruction, Multiple Threads), LPU (Language Processing Unit) at line 58, MoE (Mixture of Experts), HFT (High-Frequency Trading).
2. At line 58, replace `~80 TB/s on-chip bandwidth` with the figure plus an inline `<Link>` to the Groq architecture page or LPU whitepaper, with access date.
3. Move/duplicate the SambaNova arXiv `<Link>` (currently line 136-138) up to the first place SN40L memory tiers are stated (line 60-62) so the load-bearing tier numbers carry their citation in-paragraph.
4. Replace bare `https://groq.com/` (line 94) with the Groq pricing page or model-specific page; keep `accessed 2026-04-23`.
5. Add an inline citation for the "150 experts / 1T params / 3.7× DGX H100" claim at line 144-146 — the SN40L arXiv paper carries this; cite it inline in this paragraph.
6. Verify Section 18 / Section 28 references at line 170 against the current TOC.

---

## Section 20 — Compute-in-Memory — PIM and HyperCIM
File: `src/sections/ComputeInMemory.tsx`

**Discipline:** all clear
- SectionShell wrapper: ABSENT
- TLDR Alert: ABSENT
- status badge: ABSENT
- "Panelist map" Container: ABSENT
- "Evaluation lens" Container: ABSENT

**Acronyms missing expansion:**
- `PIM` line 21 (heading), 37, 79 — never expanded (Processing-in-Memory).
- `HBM-PIM` line 37 — never expanded inline (HBM is also unexpanded; covered in Section 19 audit but each section must stand alone per first-occurrence-in-sequential-order; if reader enters mid-deck this fails).
- `CIM` line 21, 36, 117, etc — expanded once at line 21 as "Compute-in-Memory" in heading description but never as `CIM` parenthetical. The acronym `CIM` itself is used heavily later (line 117, 160, 161, 196, 198, 220) — its first use as `CIM` (line 117) needs `(Compute-in-Memory)`.
- `DRAM` line 37, 84 — never expanded (Dynamic Random-Access Memory).
- `LPU` line 128 — expanded inline ("Language Processing Unit") — fine.
- `GEMV` line 90 — expanded inline ("matrix-vector multiply") — fine.
- `LSTM` line 91 — never expanded (Long Short-Term Memory).
- `MoE` line 102, 142, 169 — never expanded (Mixture of Experts).
- `ISCA`, `MICRO` line 201 — venue acronyms, conventionally not expanded but technically niche.

**Citation gaps:**
- Line 90-92: "GEMV (matrix-vector multiply) at 8.9× speedup, speech recognition at 3.5×, LSTM inference at 2.54×" — load-bearing numbers; the Samsung Tech Blog link at line 95 is bare (`/news-events/tech-blog/`) not a deep-link to the specific PIM post. The blog index page does not let a reader verify the 8.9× / 3.5× / 2.54× figures.
- Line 84-86: "compute units inside DRAM banks of HBM2 / HBM3 stacks" — Tier 1 architectural claim, no inline citation. Goes through to the same Samsung blog at line 95 but the linked URL is not specific.

**Other issues:**
- Line 136: `https://hypercim.com/` — bare top-level URL. Confirm this is the actual vendor site and ideally deep-link to the product page documenting the LPU framing.
- Line 131-132: "is an LPU (Language Processing Unit) marketed as a multi-database / data-fabric accelerator" — the acronym `LPU` collides with Groq's LPU usage in Section 19. The reuse is real (HyperCIM does call its product an LPU), but a clarifying note that this is HyperCIM's distinct LPU would prevent reader confusion.
- Line 220-221: "lower arithmetic intensity (Section 22)" — verify Section 22 reference.

**Recommended corrections:**
1. Add first-occurrence expansions: PIM (Processing-in-Memory) line 21 or first body use, CIM (Compute-in-Memory) at first acronym use line 117, DRAM (Dynamic Random-Access Memory) line 37, LSTM (Long Short-Term Memory) line 91, MoE (Mixture of Experts) line 102.
2. Replace the Samsung Tech Blog index link at line 95 with the specific Samsung HBM-PIM / Aquabolt-XL product or technical post URL — the reader cannot verify 8.9× / 3.5× / 2.54× from `/news-events/tech-blog/` index.
3. Add a one-line aside disambiguating HyperCIM's LPU from Groq's LPU at line 130-132 ("HyperCIM uses the LPU acronym distinctly from Groq's").
4. Verify forward-reference "Section 22" at line 220.

---

## Section 21 — KV cache and FlashAttention
File: `src/sections/KvCacheAndFlashAttention.tsx`

**Discipline:** all clear
- SectionShell wrapper: ABSENT
- TLDR Alert: ABSENT
- status badge: ABSENT
- "Panelist map" Container: ABSENT
- "Evaluation lens" Container: ABSENT

**Acronyms missing expansion:**
- `KV` / `KV cache` line 39, 47, 60 etc — never expanded (Key/Value cache). Heading at line 39 is the first occurrence — expand to "KV (Key/Value) cache".
- `MHA`, `GQA`, `MQA`, `MLA` line 106 (heading) — heading description says "MHA, GQA, MQA, and MLA — the same idea taken progressively further". `MHA` (Multi-Head Attention), `GQA` (Grouped-Query Attention), `MQA` (Multi-Query Attention), `MLA` (Multi-Head Latent Attention) — `MLA` is expanded at line 154 but the others never are. Table uses `GQA` at lines 22-26 without expansion.
- `FlashAttention` is a product name; not strictly an acronym.
- `SMEM`, `TMEM`, `SBUF` line 60, 185, 274 — never expanded (Shared Memory, Tensor Memory, State Buffer).
- `HBM` line 60, 94, 184, 186 — never expanded.
- `FP16` line 94, `FP8` line 236, 262 — borderline; project rule lists FP8 as niche.
- `GB` (units) — common.
- `TRT-LLM` line 95, 262, 263 — never expanded (TensorRT-LLM); used elsewhere as TensorRT-LLM at line 95 which mixes both forms in same line. `vLLM` and `SGLang` are product names.
- `wgmma`, `tcgen05.mma`, `TMEM` line 200-202, 261 — instruction names; arguably acronyms.
- `NKI` line 204, 270 — never expanded (Neuron Kernel Interface).
- `TRT-LLM` again line 263.
- `OS` line 224 — common, fine.
- `FP8 KV-cache` line 236 — same.

**Citation gaps:**
- Line 91-95: KV cache size formula and "Llama 3 70B (80 layers, 8 KV heads after GQA, 128 head_dim) in FP16 at 8K context: about 5 GB per request. At batch 32 that is 160 GB — exceeding H200's 141 GB" — multiple Tier 1 quantitative claims (Llama 3 architecture numbers, H200 capacity 141 GB), no inline citations in this paragraph. H200 capacity needs an NVIDIA spec link; Llama 3 architecture needs a Meta/HF model-card link.
- Line 22-27: Table rows asserting Q-head / KV-head counts for Llama 2 70B, Llama 3.1 70B, Mistral 7B, Mixtral 8x7B, Qwen3-235B-A22B, DeepSeek-V3. The footnote at line 130-140 cites only DeepSeek-V3 (arXiv link). The other five rows have no inline citation.
- Line 158-160: "DeepSeek-V3 fits its 671B parameters into a deployable footprint" — quantitative, footnote at line 137 covers via the same arXiv link, marginally OK.
- Line 198-203: "FlashAttention v1 (2022)... v3 (2024) targeted Hopper specifically" — version/year claims have no inline citation (Tri Dao FlashAttention paper / repo).
- Line 261-264: "FlashAttention-3 is the production attention kernel on Hopper. Blackwell adds tcgen05 + TMEM staging" — vendor-cited claims, no inline link to NVIDIA TRT-LLM or FlashAttention-3 paper.

**Other issues:**
- Line 91: backslash math notation `2 × num_layers × seq_len × num_kv_heads × head_dim × bytes_per_value` inside `<code>` is fine; readability OK.
- Table footnote line 130: "Numbers from each model's author docs / HuggingFace model card." — generic attribution, not Tier 1 inline. Project rule requires per-claim citation.
- Line 268-275: "FlashAttention equivalents are authored in NKI and ship as first-class kernels in the Neuron SDK" — needs Neuron SDK release note or doc link.

**Recommended corrections:**
1. Expand on first occurrence: KV (Key/Value) at line 39, MHA (Multi-Head Attention) / GQA (Grouped-Query Attention) / MQA (Multi-Query Attention) at line 106 or table top, SMEM / TMEM / SBUF (Shared Memory / Tensor Memory / State Buffer) line 60, HBM (High-Bandwidth Memory) line 60, NKI (Neuron Kernel Interface) line 204.
2. Add an inline `<Link>` to NVIDIA H200 product spec at line 94-95 for the 141 GB number.
3. Add inline `<Link>` references to the HF model cards (or paper) for Llama 2 70B, Llama 3.1 70B, Mistral 7B, Mixtral 8x7B, Qwen3-235B-A22B in either the table footnote (line 130) as discrete per-model links, or as a per-row source column. Currently the table is a quantitative claim without per-row citation.
4. Add an inline citation for FlashAttention v1/v2/v3 (Tri Dao GitHub or papers) at line 198-203, and a TRT-LLM / NVIDIA Hopper attention link at line 261-264.
5. Add an inline citation for the Trainium NKI FlashAttention claim (Neuron SDK doc) at line 270-275.

---

## Section 22 — Mixture of Experts and sparse activation
File: `src/sections/MoeAndSparseActivation.tsx`

**Discipline:** all clear
- SectionShell wrapper: ABSENT
- TLDR Alert: ABSENT
- status badge: ABSENT
- "Panelist map" Container: ABSENT
- "Evaluation lens" Container: ABSENT

**Acronyms missing expansion:**
- `MoE` line 84 (heading) — expanded at line 92 as "*Mixture of Experts* (MoE)". Good.
- `EP` line 27, 256 — expansion is implicit in "Expert parallelism (EP=N)" line 256 — fine for line 256, but earlier table use at line 27 ("Wide-EP (EP > 8)") precedes this expansion. Move first-occurrence expansion to the table or before.
- `MNNVL` line 27, 285 — expanded inline at both places ("Multi-Node NVLink") — good.
- `NVFP4` line 27, 357 — expanded at line 357 ("Blackwell's 4-bit floating point, E2M1, 16-element block size"); first use line 27 unexpanded.
- `BF16`, `FP8`, `INT8` table rows lines 31, 37, 53, 60 — never expanded. Project rule lists these as niche.
- `RDU` line 60 — never expanded in this section (expanded in Section 19; each section should stand alone per project rule).
- `HBM`, `DDR`, `SRAM` table rows — never expanded in this section.
- `CTE`, `TKG` line 35 ("MoE CTE, MoE TKG") — never expanded.
- `EFA`, `NCCL` line 304-305 — never expanded inline in this section.
- `RDMA` line 290 — never expanded (Remote Direct Memory Access).
- `CC-Cores` line 302 — never expanded (Collective Communication Cores).
- `TP`, `PP` referenced in code `--moe_tp_size` line 287 — `TP` (Tensor Parallel) never expanded.
- `GEMM` line 397 — never expanded (General Matrix-Matrix multiply).
- `TRT-LLM-Gen`, `CuTeDSL`, `CUTLASS` line 322-323 — product/library names.
- `DBRX` line 188 — model name.

**Citation gaps:**
- Line 93-96: "DeepSeek-V3 has 671B total parameters but activates only 37B per token. Kimi K2 has 1T total / 32B active. Mixtral 8x7B has 46.7B total / 12.9B active." — Three load-bearing quantitative claims, no inline citation in this paragraph (citations consolidated into footnote at line 170-195, which is acceptable in spirit but project rule says inline-per-claim).
- Line 141-146: "decode reads ~70B parameter bytes per token. On DeepSeek-V3 (671B / 37B active, top-8 of 256 + 1 shared), decode reads roughly 37B bytes per token... about 18× less" — derived numbers, mark as `[SPECULATIVE]` calculation or cite the DeepSeek paper.
- Line 268-272: NVIDIA quote about all-to-all internode being bottlenecked — this IS cited inline (line 274-279). Good.
- Line 286-289: "TensorRT-LLM exposes `--moe_tp_size` / `--moe_ep_size`" — code-level Tier 1 claim, no inline TRT-LLM repo link in this paragraph (the table has it at line 30 but the in-paragraph claim at line 286-289 should also link).
- Line 290-293: "DeepEP from DeepSeek publishes 153 GB/s NVLink intranode and 51 GB/s RDMA at 64-EP on H800/CX7" — inline DeepEP link present, good.
- Line 314: "Cerebras's third-party-measured Llama 4 Maverick throughput (Artificial Analysis: 2,522 tokens/s, May 2025)" — Artificial Analysis named but no inline `<Link>` to the specific benchmark page.
- Line 357-365: NVFP4 and 415 GB / 690 GB cited inline. Good.
- Line 374-378: "B300 (288 GB HBM3e+) versus B200 (180 GB) and the GB300 NVL72's 20 TB aggregate GPU memory... Trn2 UltraServer (six terabytes of aggregate HBM across 64 chips)" — multiple Tier 1 specs, no inline citations in this paragraph.

**Other issues:**
- Line 316: "Zigfrid-on-the-panel" — typo or misspelling; presumably referring to a panelist's name (Zigfrid? Sigfrid?). Verify panelist name and spelling. If this is internal copy that should not appear in production, flag.
- Line 388: "Section 23 covers the disaggregated serving story" — Section 24 is the disaggregated section (per the batch list). Stale section number reference.
- Line 108-109: "Section 5 (Anatomy of a kernel execution)" / "the bandwidth wall (Section 5)" line 108-109 — verify "bandwidth wall" is Section 5 vs Section 6 (Section 20 line 28 says Section 6 is the bandwidth wall). One of the two is wrong.

**Recommended corrections:**
1. Expand on first occurrence in this section: EP (Expert Parallelism) line 27, NVFP4 (NVIDIA 4-bit floating point, E2M1) line 27, BF16 (Brain Float 16) / FP8 (8-bit floating point) / INT8 (8-bit integer), RDU (Reconfigurable Dataflow Unit), HBM, DDR, SRAM in the table, RDMA, CC-Cores, TP / PP, GEMM.
2. Add inline `<Link>` to each parameter-count claim at line 93-96 — Mixtral, DeepSeek-V3, Kimi K2 model cards. The footnote at line 170-195 has these links — either move them adjacent to the claim or add per-claim inline links.
3. Mark the 18× derivation at line 144-146 as `[SPECULATIVE]` or supply the DeepSeek-V3 arXiv reference inline.
4. Add inline TRT-LLM link at line 287-288.
5. Add a specific Artificial Analysis benchmark URL at line 314.
6. Add inline NVIDIA spec link for B300 / B200 / GB300 NVL72 numbers, and AWS Trn2 UltraServer link for "six terabytes of aggregate HBM" at line 374-378.
7. Fix the "Section 23 / Section 24" disaggregated cross-reference at line 388.
8. Resolve "Section 5" vs "Section 6" bandwidth-wall reference at line 108-109 / cross-check with Section 20 line 28.
9. Verify the spelling and identity of "Zigfrid" at line 316 — replace with the verified panelist name or remove the personalized reference.

---

## Section 23 — Quantization and precision
File: `src/sections/QuantizationAndPrecision.tsx`

**Discipline:** all clear
- SectionShell wrapper: ABSENT
- TLDR Alert: ABSENT
- status badge: ABSENT
- "Panelist map" Container: ABSENT
- "Evaluation lens" Container: ABSENT

**Acronyms missing expansion:**
- `FP64`, `FP32`, `TF32`, `BF16`, `FP16`, `FP8`, `NVFP4`, `MXFP4`, `INT8` — table rows lines 21-30 introduce all of these. None are expanded inline. Project rule explicitly lists FP8, FP4, NVFP4, MXFP4, BF16, TF32, INT8 as niche acronyms requiring expansion.
- `E4M3`, `E5M2`, `E2M1`, `E8M0` — exponent/mantissa shorthand, niche.
- `MoE` line 50, 149 — never expanded in this section.
- `OCP` line 29, 113, 143 — never expanded (Open Compute Project); expanded inline at line 145 ("Open Compute Project Microscaling Format") — good for line 145, but line 29 (table) and line 113 (heading) precede the expansion.
- `HBM` line 56, 60 — never expanded.
- `KV-cache` line 211 — KV not expanded.
- `GEMM` not used here.
- `tcgen05.mma` line 131 — instruction shorthand.
- `EP` line 165, 366 — never expanded in this section.
- `GPT-OSS-120B` line 149 — model name.
- `Hopper`, `Blackwell`, `Ampere`, `Trainium` — silicon codenames.

**Citation gaps:**
- Line 130-131: "Memory reduction approximately 3.5× over FP16 and 1.8× over FP8" — quantitative claim. The NVIDIA NVFP4 blog link at line 134 covers this; OK if those exact ratios are in the linked post — verify.
- Line 145-149: "Block size 32, single E8M0 scaling factor per block... GPT-OSS-120B uses MXFP4 on its MoE weights" — the OCP MXFP4 spec needs an inline OCP link; the GPT-OSS-120B claim needs an OpenAI model card link. Currently no inline citation in this paragraph.
- Line 154-156: "DeepSeek-V3.2 at NVFP4 occupies 415 GB versus 690 GB at FP8 — a 1.7× reduction" — citation present at line 158-162, good.
- Line 21-31: Table rows asserting which silicon ships which precision (e.g. "NVFP4 (E2M1) | Blackwell only", "FP8 E4M3 | Hopper / Blackwell / Trainium") — no per-row citation. These are Tier 1 silicon-spec claims.
- Line 240-247: "NVIDIA Wide-EP with NVFP4 MoE on NVL72, AWS Neuron MoE NKI with FP8 on Trn2 UltraServer, vLLM with FlashInfer FP4 cubins" — load-bearing product claims; no inline citations here.

**Other issues:**
- Line 131: claim "Native Tensor Core support via tcgen05.mma" — Tier 1, cited via the NVFP4 blog at line 134. OK if that blog references tcgen05; verify.
- Table at line 21-31 has no `Source` column — adding one would close the per-row citation gap cleanly (mirrors Section 22's pattern).

**Recommended corrections:**
1. Expand on first occurrence (table lines 21-31 plus body): FP64 / FP32 (clarification "32-bit floating point"), TF32 (TensorFloat-32), BF16 (Brain Float 16), FP16 (Half Precision), FP8 (8-bit floating point), NVFP4 (NVIDIA 4-bit floating point), MXFP4 (Microscaling 4-bit floating point), INT8 (8-bit integer). MoE first body use line 50.
2. Add a `Source` column to the format table (lines 99-108) with a per-row Tier 1 link (NVIDIA, OCP, AWS Neuron) — mirrors Section 22's pattern.
3. Add inline `<Link>` for the OCP MXFP4 spec at line 144-149 and an OpenAI GPT-OSS model-card link for the MXFP4 weight claim.
4. Verify that the NVIDIA NVFP4 blog at line 134 actually states "3.5× over FP16 and 1.8× over FP8" — if not, find the source that does or label the ratios as `[SPECULATIVE]` derived.
5. Add inline citations for the production-stack name-drops at line 240-247 (TRT-LLM Wide-EP repo, Neuron SDK release notes, vLLM FlashInfer doc).

---

## Section 24 — Disaggregated serving and speculative decoding
File: `src/sections/DisaggregatedServingAndSpeculative.tsx`

**Discipline:** all clear
- SectionShell wrapper: ABSENT
- TLDR Alert: ABSENT
- status badge: ABSENT
- "Panelist map" Container: ABSENT
- "Evaluation lens" Container: ABSENT

**Acronyms missing expansion:**
- `KV cache` line 33, 63 etc — never expanded in this section.
- `EFA` line 64, 73, 99, 132 — never expanded in this section (Elastic Fabric Adapter).
- `NVLink` line 63, 76 — product name, generally not expanded but worth a parenthetical.
- `NIXL` line 74 — expanded inline at line 74 ("NIXL (NVIDIA Inference Xfer Library)") — good.
- `NCCL` line 75 — never expanded inline (NVIDIA Collective Communications Library).
- `SM` / `SMs` line 75, 77 — never expanded (Streaming Multiprocessor).
- `RDMA` line 77 — never expanded (Remote Direct Memory Access).
- `MoE` line 100, 196 — never expanded in this section.
- `CC-Cores` line 131 — never expanded (Collective Communication Cores).
- `OSS` line 110 — never expanded (Open-Source Software).
- `NVFP4` line 196 — never expanded in this section.
- `Tree-based speculation` — not an acronym.

**Citation gaps:**
- Line 73-74: "Moving that over EFA at 3,200 Gbps on P5 takes milliseconds; over NVLink inside an UltraServer it takes sub-millisecond." — Quantitative bandwidth claim (3,200 Gbps on P5) — no inline citation. Should link to AWS P5 instance spec.
- Line 74-78: NIXL description and "NIXL does GPU-Direct RDMA without activating any SMs" — Tier 1 architectural claim, no inline citation. Should link to NVIDIA NIXL doc.
- Line 95-101: "NVIDIA Dynamo... reference deployment for DeepSeek-R1 MoE on GB200 NVL72" — no inline link; needs NVIDIA Dynamo doc / blog.
- Line 105-110: vLLM disaggregation / NixlConnector — no inline link; needs vLLM doc.
- Line 115-123: SGLang link is present (line 120-124). Good.
- Line 127-134: "Disaggregation on Trainium is in early production... CC-Cores... KV cache transport between Trn2 nodes works over EFA" — Tier 1 architectural claims, no inline AWS/Neuron citation.
- Line 165-167: "When the draft model's acceptance rate is high (typically 60-90% on common tasks)" — quantitative claim, no inline citation.
- Line 169-176: "vLLM and SGLang both ship speculative decoding. NVIDIA TensorRT-LLM supports it. Trainium adds support via NKI-authored draft kernels" — Tier 1 product claims, no inline citations.
- Line 173-174: "Llama 3.2 1B drafting Llama 3.3 70B" — example, not strictly load-bearing; OK without citation.

**Other issues:**
- Line 41: "Sections 23 and 21" cross-reference — should be Sections 23 (Quantization) and 21 (KV cache). Forward/back reference math is correct given the batch numbering, but verify after any renumber.
- Line 100: "DeepSeek-R1" — verify that NVIDIA Dynamo's reference deployment is R1 vs V3 (DeepSeek has shifted; the Dynamo blog the team cited elsewhere referenced DeepSeek-R1 specifically — confirm).
- Line 71-78: Alert claims NIXL "does GPU-Direct RDMA without activating any SMs" — strong architectural claim, must be tier-1 sourced. The NVIDIA Inference Xfer Library doc/repo is the only acceptable cite.
- Line 130-134: "Customer deployments are starting to ship; reference architectures from AWS are emerging" — vague hand-wave, borderline lazy. Either cite a specific AWS blog post / re:Invent talk or remove.

**Recommended corrections:**
1. Expand acronyms on first use in this section: KV (Key/Value) cache line 33, EFA (Elastic Fabric Adapter) line 64, NCCL (NVIDIA Collective Communications Library) line 75, SM (Streaming Multiprocessor) line 75, RDMA (Remote Direct Memory Access) line 77, MoE (Mixture of Experts) line 100, CC-Cores (Collective Communication Cores) line 131, NVFP4 line 196.
2. Add an inline AWS P5 spec link for the 3,200 Gbps figure at line 73.
3. Add an inline NVIDIA NIXL doc/repo `<Link>` at the NIXL alert (line 70-79) — multiple Tier 1 claims here have zero citations.
4. Add inline `<Link>` for NVIDIA Dynamo (developer blog or repo) at line 95-101.
5. Add inline `<Link>` for vLLM disaggregation at line 105-110.
6. Add inline AWS Neuron / blog citation for the Trainium disaggregation claim at line 127-134, OR replace the "starting to ship / emerging" hand-wave with a verifiable claim.
7. Add inline citation (or `[SPECULATIVE]` label) for the "60-90% acceptance rate" claim at line 165 — most likely a Tri Dao / draft-model paper.
8. Add inline citations for the speculative-decoding production claims at line 169-176 (vLLM, SGLang, TRT-LLM, Trainium NKI).
9. Verify "DeepSeek-R1" (line 100) is the correct model used in the NVIDIA Dynamo reference deployment.

---

## Per-section summary

| Section | Discipline | Acronyms missing | Citation gaps | Other issues | Severity |
|---------|------------|------------------|---------------|--------------|----------|
| 19 Groq/SambaNova | clear | 7 (SRAM, HBM, DDR, SIMT, LPU, MoE, HFT) | 5 | 2 forward-ref + bare URL | medium |
| 20 CIM / PIM | clear | 6 (PIM, CIM, DRAM, LSTM, MoE, HBM-PIM) | 2 (Samsung blog index URL, in-paragraph) | LPU collision, forward-ref | medium |
| 21 KV cache / FlashAttn | clear | ~9 (KV, MHA/GQA/MQA, SMEM/TMEM/SBUF, HBM, NKI, TRT-LLM) | 5 (H200 spec, table rows, FA versions, Trainium NKI) | table-wide attribution | high |
| 22 MoE | clear | ~13 (EP, NVFP4, BF16, FP8, INT8, RDU, HBM, DDR, SRAM, RDMA, CC-Cores, TP, GEMM) | 6 (param counts, 18× derivation, TRT-LLM, AA URL, B300/B200 specs) | Section 23/24 ref, "Zigfrid" typo, S5/S6 bandwidth-wall | high |
| 23 Quantization | clear | ~10 (FP64/32, TF32, BF16, FP16, FP8, NVFP4, MXFP4, INT8, MoE, OCP-pre-expansion) | 4 (table per-row, OCP/MXFP4 link, GPT-OSS, ratio verification) | no Source column on table | high |
| 24 Disagg / Spec | clear | ~9 (KV, EFA, NCCL, SM, RDMA, MoE, CC-Cores, NVFP4, OSS) | 7 (P5 3,200 Gbps, NIXL doc, Dynamo, vLLM, Trainium, 60-90%, spec-decoding stacks) | hand-wave at line 130-134, R1 verification | high |

Highest-priority fixes: Sections 22, 23, 24 (multiple uncited Tier 1 quantitative claims). Sections 21 has a load-bearing table without per-row citation. Sections 19-20 are mostly acronym hygiene plus a couple of bare URLs and forward references.

All six sections pass the clean-copy discipline check (no SectionShell, no TLDR Alert, no status badge, no Panelist map, no Evaluation lens).
