# P3 — Adversarial verification: quantitative claims in `silicon-memory-inference`

**Date:** 2026-08-01
**Scope:** 5 files under `deep-dives/silicon-memory-inference/src/sections/`
**Method:** Every quantitative claim extracted with `file:line`, then checked against Tier 1 (vendor
official docs / datasheets / official source code / official spec) where reachable. Tier 2 =
vendor blog or talk. Tier 3 = third-party analysis, **never accepted as fact**. Where Tier 1 could
not be reached, the verdict is UNSOURCEABLE, not a guess.

**Result:** 78 claims checked. **11 REFUTED**, **26 UNSOURCEABLE**, 12 PARTLY-CORRECT,
29 CONFIRMED.

---

## 0. Headline findings

1. **`KvCacheAndFlashAttention.tsx:92-97` is refuted by its own formula.** The worked KV-cache
   example is 2x too large, and the conclusion it drives ("exceeding H200's 141 GB") inverts once
   the arithmetic is done correctly.
2. **`IsolationNie.tsx:108` — "first formally verified cloud hypervisor" is refuted by AWS's own
   page**, and contradicts the dive's own sentence 2 lines earlier. The Isabelle/250k-lines/30-min
   figures appear in no AWS source.
3. **Sparse-vs-dense:** the only FLOPS figure in the audited set (`NvidiaBlackwell.tsx:28,60`,
   "14 PFLOPS FP4") is published by NVIDIA only as a `sparse | dense` pair under an explicit
   asterisk. The dive strips the qualifier.
4. **Directional bandwidth:** NVLink 5 "1.8 TB/s" is NVIDIA's *bidirectional aggregate*
   (900 GB/s each way). Unlabeled in two files, and one of them (`DisaggregatedServing...`) uses a
   bandwidth number to derive a latency.
5. **`IsolationNie.tsx:24` — the entire B300 MIG row is fabricated.** NVIDIA's MIG User Guide
   publishes no B300 / Blackwell Ultra profile table as of 2026-08-01.
6. **`ChipletAndInterconnect.tsx`'s single link does not support the paragraph it is attached to.**
7. **`sources.md`'s "Fact-check register" and "UNKNOWN register" are empty stubs**, and none of the
   five audited sections' topics appear anywhere in its Tier 1 list.

---

## 1. Tier 1 sources actually fetched for this pass

| Source | Tier | What it settled |
| --- | --- | --- |
| `https://docs.nvidia.com/cuda/parallel-thread-execution/index.html` §9.7.17 | 1 | TMEM geometry; count of tcgen05 MMA instructions |
| `https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/supported-mig-profiles.html` (rendered) | 1 | All MIG profile tables (A100, H100, H200, B200, RTX PRO Blackwell, Thor) |
| `https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/concepts.html` | 1 | Memory-bandwidth QoS wording; max partitions = 7 |
| `https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/` | 1 | 208B transistors; 10 TB/s chip-to-chip |
| `https://www.nvidia.com/en-us/data-center/dgx-b200/` | 1 | 1,440 GB total; 64 TB/s HBM3e; FP4 sparse\|dense |
| `https://www.nvidia.com/en-us/data-center/dgx-b300/` | 1 | FP4 `144 \| 108 PFLOPS*`; 2.1 TB total |
| `https://www.nvidia.com/en-us/data-center/gb300-nvl72/` | 1 | FP4 `1440 \| 1080²`; 20 TB HBM3e; 576 TB/s; 130 TB/s NVLink |
| `https://www.nvidia.com/en-us/data-center/hgx/` | 1 | HGX B200/B300 FP4 with sparsity footnote |
| `https://www.nvidia.com/en-us/data-center/nvlink/` | 1 | NVLink 5 = 1,800 GB/s over 18 links; gen 6 labelled "bidirectional" |
| `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/accelerated-computing-instances.html` | 1 | P5/P5e/P6-B200/P6-B300/P6e-GB200 EFA Gbps and per-GPU HBM |
| `https://github.com/aws/aws-graviton-getting-started` README | 1 | Graviton4/5 cores, L2, LLC, NUMA nodes, interconnect |
| `https://aws.amazon.com/ec2/nitro/` | 1 | NIE described as "a purpose-built component within the Nitro System" |
| HuggingFace `config.json` for Llama-2-70B, Llama-3.1-70B, Mistral-7B, Mixtral-8x7B, Qwen3-235B-A22B, DeepSeek-V3 | 1 | head counts, layers, `kv_lora_rank` |
| GitHub API `NVIDIA/cutlass` releases + `contents/examples?ref=<tag>` | 1 | Release dates; first tag containing example 92 |
| `https://developer.nvidia.com/blog/introducing-nvfp4-...` | 2 | 3.5x vs FP16, 1.8x vs FP8, 16-value blocks, E4M3+FP32 |
| `https://www.aboutamazon.com/news/aws/aws-graviton-5-cpu-amazon-ec2` | 1 | 192 cores "in a single package"; 33% lower inter-core; "5x larger L3" |
| `https://aws.amazon.com/blogs/aws/amazon-ec2-c9g-and-c9gd-...` | 2 | Graviton5 GA 2026-06-30; DDR5-8800 |
| `https://chipsandcheese.com/p/amds-turin-5th-gen-epyc-launched` | **3** | 45/150/260 ns triple (Tier 3 only — see §7) |

**Could not reach Tier 1 (all returned 403 / timeout / JS-gated):** intel.com Xeon 6 6900P product
brief and ARK, amd.com EPYC 9005 spec pages and architecture whitepaper, developer.arm.com CMN-700
TRM. Every claim depending on those is marked UNSOURCEABLE rather than guessed.

---

## 2. `KvCacheAndFlashAttention.tsx` — the derivation and the table

### 2.1 The KV-cache derivation (lines 88-98)

The formula at line 91 is correct:

```
2 × num_layers × seq_len × num_kv_heads × head_dim × bytes_per_value
```

Substituting the values the section itself states (80 layers, 8 KV heads, head_dim 128, FP16, 8K):

```
2 × 80 × 8192 × 8 × 128 × 2  =  2,684,354,560 bytes  =  2.68 GB  (2.50 GiB)
```

Parameters independently confirmed Tier 1 from `config.json`
(`num_hidden_layers: 80`, `num_attention_heads: 64`, `num_key_value_heads: 8`,
`hidden_size: 8192` → `head_dim = 8192/64 = 128`).

| file:line | Claim | Correct value | Verdict |
| --- | --- | --- | --- |
| `KvCacheAndFlashAttention.tsx:93-94` | "about 5 GB per request" | **2.68 GB / 2.50 GiB** | **REFUTED — 2x too high, contradicted by the formula printed 2 lines above** |
| `KvCacheAndFlashAttention.tsx:95` | "At batch 32 that is 160 GB" | **85.9 GB (80 GiB)** | **REFUTED** |
| `KvCacheAndFlashAttention.tsx:95-97` | "exceeding H200's 141 GB before the model weights even fit" | 86 GB does **not** exceed 141 GB | **REFUTED — the conclusion inverts** |
| `KvCacheAndFlashAttention.tsx:91` | The formula itself | — | CONFIRMED |
| `KvCacheAndFlashAttention.tsx:96` | H200 = 141 GB | AWS: `p5e.48xlarge … 1128 GiB (8 x 141 GiB)` | CONFIRMED (Tier 1) |

The reader-facing point the paragraph is making (KV cache dominates the memory budget) survives, but
only because the H200 *weights* for a 70B FP16 model are ~140 GB — which the paragraph never
mentions. As written, the number is wrong and the argument it supports does not follow from it.

### 2.2 The attention-variant table (lines 21-28), attributed at line 130-131 to
"each model's author docs / HuggingFace model card"

| file:line | Row | Tier 1 `config.json` | Verdict |
| --- | --- | --- | --- |
| `:22` | Llama 2 70B — 64 Q / 8 KV / 8:1 | `num_attention_heads: 64`, `num_key_value_heads: 8` | CONFIRMED |
| `:23` | Llama 3.1 70B — 64 Q / 8 KV / 8:1 | 64 / 8 | CONFIRMED |
| `:24` | Mistral 7B — 32 Q / 8 KV / 4:1 | 32 / 8 | CONFIRMED |
| `:25` | Mixtral 8x7B — 32 Q / 8 KV / 4:1 | 32 / 8 | CONFIRMED |
| `:26` | **Qwen3-235B-A22B — 64 Q / 8 KV / 8:1** | `num_attention_heads: 64`, **`num_key_value_heads: 4`**, `head_dim: 128`, 94 layers | **REFUTED — 4 KV heads, ratio is 16:1 not 8:1** |
| `:27` | DeepSeek-V3 — MLA, `kv_lora_rank=512`, 128 Q heads | `num_attention_heads: 128`, `kv_lora_rank: 512` | CONFIRMED |
| `:130-131` | Blanket attribution "Numbers from each model's author docs / HuggingFace model card" | no per-row link; 1 of 6 rows wrong | **UNSOURCEABLE as an attribution** |
| `:147` | "GQA groups query heads (typically 4:1 or 8:1)" | Qwen3 is 16:1 | PARTLY-CORRECT — range too narrow given the table above it |
| `:159-160` | DeepSeek-V3 "671B parameters" | in the cited arXiv:2412.19437 | CONFIRMED (Tier 1 paper, vendor-authored) |
| `:200-201` | "FlashAttention v3 (2024) targeted Hopper" | not checked against a primary release note | UNSOURCEABLE (low risk) |

The Qwen3 error understates that model's KV-cache compression by exactly 2x — the same direction and
magnitude as the Llama error above. Both push the reader toward over-provisioning.

---

## 3. `NvidiaBlackwell.tsx` — sparse/dense and citation mismatch

### 3.1 The sparse-vs-dense problem (the flagged category)

NVIDIA publishes Blackwell FP4 **only as a pair**, with the qualifier marked by an explicit
footnote character:

- DGX B200: `FP4 Tensor Core: 144 PFLOPS | 72 PFLOPS*` — footnote: `*Shown in sparse | dense`
- DGX B300: `FP4 Tensor Core: 144 PFLOPS | 108 PFLOPS*` — same footnote
- HGX B300: `144 PFLOPS | 108 PFLOPS`, footnote `Specification in Sparse | Dense`
- GB300 NVL72: `1440 | 1080² PFLOPS` — footnotes: *"All Tensor Core specifications are with
  sparsity unless otherwise noted"* and *"² Without sparsity"*

Per GPU that is:

| Part | FP4 sparse / GPU | FP4 dense / GPU |
| --- | --- | --- |
| B200 (DGX/HGX, ÷8) | 18 PFLOPS | 9 PFLOPS |
| B300 (DGX/HGX, ÷8) | 18 PFLOPS | 13.5 PFLOPS |
| B300 (GB300 NVL72, ÷72) | 20 PFLOPS | 15 PFLOPS |

| file:line | Claim | Verdict |
| --- | --- | --- |
| `NvidiaBlackwell.tsx:28` | Table row "FP4 PFLOPS per GPU … B300: 14 PFLOPS" | **PARTLY-CORRECT + QUALIFIER STRIPPED.** Nearest vendor figure is DGX/HGX B300 **dense** 13.5, rounded up. Matches no vendor figure exactly. NVIDIA's headline (sparse) number is 18-20. The dive gives no sparse/dense label where NVIDIA marks one with an asterisk. |
| `NvidiaBlackwell.tsx:59-60` | "FP4 reaching 14 PFLOPS per GPU on B300" | Same. The sparsity qualifier is load-bearing: a reader sizing a cluster off "14 PFLOPS" and a vendor quoting "18 PFLOPS" are 1.3x apart, and neither is the other's number. |
| `NvidiaBlackwell.tsx:28` | B200 FP4 = "—" (blank) | No error (nothing asserted) |

### 3.2 Directional bandwidth

| file:line | Claim | Tier 1 | Verdict |
| --- | --- | --- | --- |
| `NvidiaBlackwell.tsx:24` | "NVLink Gen 5 per GPU: 1.8 TB/s" | NVLink page: `1,800GB/s`, `Maximum Number of Links per GPU: 18` | CONFIRMED **as a number**, but **DIRECTIONAL QUALIFIER MISSING**: this is NVIDIA's bidirectional aggregate (100 GB/s per link bidi → 50 GB/s each way → **900 GB/s unidirectional**). The same NVIDIA page labels gen 6 "3.6 TB/s **bidirectional**", so the convention is explicit upstream and dropped here. |
| `ChipletAndInterconnect.tsx:49` | "NVLink GPU-to-GPU 1.8 TB/s" | same | Same finding, second occurrence |
| GB300 NVL72 cross-check | 130 TB/s NVLink ÷ 72 GPUs = 1.8 TB/s | — | Consistent with NVIDIA's aggregate convention |

### 3.3 Everything else in the file

| file:line | Claim | Verdict / evidence |
| --- | --- | --- |
| `:22` | B200 "up to 180 GB" | CONFIRMED — DGX B200 "1,440 GB total" ÷ 8 = 180 GB; AWS `p6-b200.48xlarge … 1432 GiB (8 x 179 GiB)` |
| `:22` | B300 "288 GB" | CONFIRMED — AWS `p6-b300.48xlarge … 2148 GiB (8 x 268 GiB)`; 268 GiB = 287.8 GB. **Caveat:** NVIDIA's own DGX B300 page says 2.1 TB total (262.5 GB/GPU) and GB300 NVL72 says 20 TB ÷ 72 = 277.8 GB — vendor *usable* figures are lower than the raw 288 |
| `:23` | B200 "~8 TB/s class" | CONFIRMED — DGX B200 "64 TB/s HBM3e bandwidth" ÷ 8 = 8 TB/s |
| `:23` | B300 "8 TB/s" | CONFIRMED — GB300 NVL72 "Up to 576 TB/s" ÷ 72 = 8 TB/s |
| `:26`, `:54`, `:112` | "TMEM, 256 KB per SM" | CONFIRMED — PTX ISA §9.7.17.1: *"512 columns and 128 rows per CTA, with each cell being 32-bits in size"* → 512 × 128 × 4 B = 262,144 B = 256 KB. **Nit:** PTX says *per CTA*, the dive says *per SM* |
| `:29` | B300 AWS family "P6-B300, **P6e UltraServer (GB200)**" | **PARTLY REFUTED** — AWS EC2 docs list `p6e-gb200.36xlarge` as "**4 x NVIDIA B200 GPU**, 740 GiB (4 x 185 GiB)". P6e-GB200 is a B200 product; putting it in the B300 column is a category error. `p6-b300.48xlarge` itself CONFIRMED |
| `:47` | "NVIDIA's 10th-generation data-center GPU architecture" | UNSOURCEABLE — no vendor page fetched states a generation ordinal |
| `:52-54` | NVFP4 "E2M1 … 16-element block scaling" | CONFIRMED (Tier 2) — *"reducing the group size from 32 elements to 16 values per block"* |
| `:53-54` | "roughly halves model footprint at FP8" | PARTLY-CORRECT — NVIDIA's own figure two paragraphs later is 1.8x, not 2x |
| `:58` | "B300 ships 288 GB vs H200's 141 GB" | CONFIRMED — AWS `p5e.48xlarge … 1128 GiB (8 x 141 GiB)` |
| `:82-84`, `ChipletAndInterconnect.tsx:201` | NV-HBI "roughly 10 TB/s aggregate" | CONFIRMED (Tier 1) — *"two reticle-limited dies connected by a 10 terabytes per second (TB/s) chip-to-chip interconnect in a unified single GPU"* |
| `ChipletAndInterconnect.tsx:202` | "208B transistor chip" | CONFIRMED (Tier 1) — "208 billion transistors" |
| `:88-96` | The self-aware warning Alert ("Per-die specifics not directly fetched") | Honest and correct in spirit — but it does not cover the two claims that are actually wrong (`:29` P6e-GB200, `:117-118` CUTLASS) |
| `:114-115` | tcgen05.mma: "**seven** new instructions for matmul" | **REFUTED** — PTX ISA §9.7.17.10.9 defines exactly **four** 5th-gen MMA instructions: `tcgen05.mma`, `tcgen05.mma.sp`, `tcgen05.mma.ws`, `tcgen05.mma.ws.sp`. (The wider `tcgen05.*` family — alloc/dealloc/relinquish/ld/st/cp/fence/commit/wait/shift — is far more than 7 and is not "for matmul".) |
| `:115-116` | "NVIDIA describes as 2x to 4x faster than Hopper's wgmma" | UNSOURCEABLE — attributed to NVIDIA, found in no fetched NVIDIA source |
| `:117-118` | "example 92 (Blackwell MoE GEMM) was the **first** CUTLASS example to ship with the SM100 target" | **REFUTED** (Tier 1, GitHub API) — `examples/` at tag **v3.8.0 (2025-02-21)** already contains `70_blackwell_gemm` … `78_blackwell_emulated_bf16x9_gemm`. Example 92 did not exist yet |
| `:132` | NVFP4 "3.5x over FP16 and 1.8x over FP8" | CONFIRMED (Tier 2) — verbatim match to the cited blog |
| `:132-134` | "NVFP4 reduced DeepSeek-V3.2's footprint from **690 GB FP8 to 415 GB**", cited to the NVFP4 blog | **UNSOURCEABLE + CITATION MISMATCH.** The cited blog contains no DeepSeek-V3.2 footprint figures (it has only DeepSeek-R1-0528 *accuracy* comparisons); the `nvfp4` blog tag index has no such post either. Also internally inconsistent: 690/415 = **1.66x**, not the 1.8x asserted two sentences earlier |
| `:195` | "Workloads that already fit in 141 GB H200" | CONFIRMED |
| `:206-208` | CUTLASS "v4.0.0 (June 2025)" | CONFIRMED — published `2025-06-27` |
| `:206-208` | "**example 92 first appeared in v4.0.0**" | **REFUTED** (Tier 1, GitHub API): `examples?ref=v4.0.0` → 90 entries, highest is `88_hopper_fmha`, no `92_*`. Same for `v4.1.0`. Example 92 first appears in **v4.2.0, published 2025-09-18** |
| `:207` | "simplified MoE API arrived in v4.3.0 (November 2025)" | Release date CONFIRMED — `2025-11-24`. Contents not verified |
| `:208` | "per-decoding scale variant in v4.4.0 (February 2026)" | Release date CONFIRMED — `2026-02-26`. Contents not verified |
| `:208` | "TRT-LLM NVFP4 cubins for MoE shipped in v1.0" | UNSOURCEABLE |

---

## 4. `IsolationNie.tsx` — the MIG table and the NIE proof claims

### 4.1 MIG profile table (lines 19-25) vs NVIDIA MIG User Guide (Tier 1, rendered 2026-08-01)

| file:line | Dive row | NVIDIA's actual profiles | Verdict |
| --- | --- | --- | --- |
| `:20` | A100 40 GB — "7 × ~5 GB · 3 × ~10 GB · 1 × 40 GB" | `1g.5gb`×7, `1g.10gb`×4, `2g.10gb`×3, `3g.20gb`×2, `4g.20gb`×1, `7g.40gb`×1 | CONFIRMED |
| `:21` | A100 80 GB / H100 SXM — "7 × ~10 GB · 3 × ~20 GB · 1 × 80 GB" | `1g.10gb`×7, `1g.20gb`×4, `2g.20gb`×3, `3g.40gb`×2, `4g.40gb`×1, `7g.80gb`×1 | CONFIRMED |
| `:22` | H200 SXM 141 GB — "7 × ~18 GB · 3 × ~35 GB · 1 × 141 GB" | `1g.18gb`×7, `1g.35gb`×4, `2g.35gb`×3, `3g.71gb`×2, `4g.71gb`×1, `7g.141gb`×1 | CONFIRMED |
| `:23` | B200 180 GB — "7 × ~23 GB · **2 × ~95 GB** · **1 × 192 GB**" | `1g.23gb`×7, `1g.45gb`×4, `2g.45gb`×3, **`3g.90gb`×2**, `4g.90gb`×1, **`7g.180gb`×1** | **PARTLY REFUTED.** "7 × ~23 GB" CONFIRMED. "2 × ~95 GB" **REFUTED** — the 2-instance profile is `3g.90gb` (2 × **90** GB). "1 × 192 GB" **REFUTED** — the full profile is `7g.180gb`, and 192 GB also contradicts this row's own "Total HBM: 180 GB" cell |
| `:24` | B300 288 GB — "7 × ~34 GB · 4 × ~70 GB · 2 × ~140 GB · 1 × 288 GB" | **NVIDIA publishes no B300 / Blackwell Ultra MIG profile table.** The guide's Blackwell tables are B200, RTX PRO 6000/5000/4500, Thor iGPU | **UNSOURCEABLE — the whole row.** It also does not follow NVIDIA's own slicing pattern: B200's 4-instance profile is `1g.45gb` (2/8 of memory) and its 2-instance profile is `3g.90gb` (4/8), so B300 analogues would be ~72 GB×4 and ~144 GB×2, not the hand-divided 70/140. Only the 288 GB total is independently CONFIRMED (via AWS) |
| `:139`, `:148-150` | "up to 7 independent GPU instances" | Concepts, Table 3: `Max Partitions … MIG 7` | CONFIRMED |
| `:150-152` | "no SM sharing, no L2 sharing, no HBM bandwidth sharing across instances" | Table 3: `SM Performance Isolation: Yes`, `Memory Bandwidth QoS: Yes`; Concepts: *"Each GPU slice includes dedicated GPU memory resources which limit both the available capacity and bandwidth, and provide memory QoS"*; profile tables show `L2 Cache Size: 1/8` etc. | CONFIRMED in substance. Wording nit: NVIDIA frames it as *QoS and limits*, not as absence of sharing |
| `:169-175` | "deterministic memory bandwidth per tenant" | Same | CONFIRMED |

### 4.2 The Nitro Isolation Engine claims

The section's only supporting link is the aboutamazon Graviton5 announcement. That page states
(verbatim): NIE is *"a formally verified security component"* whose *"minimal, formally verified
codebase uses mathematical proofs to ensure it behaves exactly as defined."* It states **no** line
counts, **no** prover name, **no** checking time. `https://aws.amazon.com/ec2/nitro/` (Tier 1)
states: *"The Nitro Isolation Engine is a purpose-built component within the Nitro System, that is
responsible for enforcing this isolation and proves it with mathematical assurances,"* and lists
the Nitro Hypervisor separately as its own component.

| file:line | Claim | Verdict |
| --- | --- | --- |
| `:89-90` | "A minimal **Rust** software module" | UNSOURCEABLE — no fetched AWS source names the language |
| `:103-105` | "verified using **Isabelle/HOL**" | UNSOURCEABLE — no AWS source names the prover |
| `:106-107` | "Roughly **250,000 lines** of Isabelle proof script" | **UNSOURCEABLE** — appears in neither the cited page nor `aws.amazon.com/ec2/nitro/` |
| `:107-108` | "checking in approximately **30 minutes** on a standard laptop" | **UNSOURCEABLE** |
| `:108` | "AWS positions NIE as the **first formally verified cloud hypervisor**" | **REFUTED.** AWS calls it a *component within the Nitro System*, explicitly alongside (not as) the Nitro Hypervisor. The dive itself says at `:93-95` that NIE is *"Distinct from the Nitro Hypervisor itself"* — the two sentences contradict each other 2 lines apart |
| `:110-119` | Alert enumerating 4 specific proven properties (VM memory, **cache timing side channels**, **scheduling quantum**, **admission control bypass**) | **UNSOURCEABLE** — no proof artifact or property list is public; presented as established fact |
| `:126-127` | "Auditors can inspect the Isabelle proof script. Regulators can verify independently." | **UNSOURCEABLE** — no public proof artifact exists to inspect |
| `:46-48` | MiFID II / DORA / SEC Rule 17a-4 / CFTC Part 1.31 framed as tenant-isolation compliance requirements | UNSOURCEABLE as stated — none of these rules mandate hypervisor tenant isolation; 17a-4 and 1.31 are records-retention rules |
| `:177-187` | TEE-I/O composition "that **no other public cloud currently offers end-to-end**" | UNSOURCEABLE competitive claim |
| `:202-214` | Trainium SBUF partitioning ("no cache to share or bandwidth to contend for") | UNSOURCEABLE — no citation anywhere in the container |

---

## 5. `DisaggregatedServingAndSpeculative.tsx` — 1 link, and it supports none of the numbers

The file's only external link is `https://docs.sglang.ai/` at `:121`, attached to a qualitative
statement. Every quantitative claim in the file is uncited.

| file:line | Claim | Verdict |
| --- | --- | --- |
| `:71-72` | "KV cache size for a long prompt can be hundreds of MB to several GB per request" | CONFIRMED as an order of magnitude by the corrected derivation in §2.1 (2.5 GiB for Llama 3 70B FP16 @ 8K). **Note it disagrees with the sibling section's inflated "5 GB"** |
| `:73` | "over **EFA at 3,200 Gbps on P5**" | **CONFIRMED (Tier 1)** — AWS EC2 docs: `p5.48xlarge … 3200 Gigabit`, 32 network cards, EFA `✓ Yes` |
| `:73-74` | "Moving that over EFA at 3,200 Gbps on P5 **takes milliseconds**" | **PARTLY-CORRECT, unlabeled derivation.** 3,200 Gbps is the **whole-instance aggregate across 32 EFA devices serving 8 GPUs**; one GPU's share is 400 Gbps. 1 GB at 3,200 Gbps ≈ 2.5 ms; at 400 Gbps ≈ 20 ms. "Milliseconds" survives both, so the conclusion holds — but the per-instance-vs-per-GPU conflation is exactly the aggregate-bandwidth error this audit was asked to hunt for, and the derivation carries no `[SPECULATIVE]` marker |
| `:74-75` | "over NVLink inside an UltraServer it takes **sub-millisecond**" | **PARTLY-CORRECT / self-inconsistent at the top of its own range.** NVLink 5 is 1.8 TB/s bidirectional = **900 GB/s one way**. The sentence's own upper bound is "several GB": 1 GB ≈ 1.1 ms one-way, 3 GB ≈ 3.3 ms. Sub-millisecond only holds below ~900 MB |
| `:75-78` | "NCCL launches kernels that consume SMs — NIXL does GPU-Direct RDMA **without activating any SMs**" | UNSOURCEABLE |
| `:98-101` | "The reference deployment for DeepSeek-R1 MoE on GB200 NVL72 uses Dynamo" | UNSOURCEABLE |
| `:107-110` | vLLM "supports prefill / decode disaggregation via experimental flags; pairs with NixlConnector" | UNSOURCEABLE (plausible; no link) |
| `:130-134` | "Neuron runtime supports cross-chip transports via CC-Cores, and KV cache transport between Trn2 nodes works over EFA" | UNSOURCEABLE |
| `:155-157` | "if all k were accepted the speedup is roughly k×" | SPECULATIVE — ignores draft-model cost; acceptable as an upper bound but unlabeled |
| `:165-166` | draft acceptance rate "typically **60-90%** on common tasks" | **UNSOURCEABLE** — the only other numeric range in the file, with no source of any tier |
| `:172-174` | "Llama 3.2 1B drafting Llama 3.3 70B" | Illustrative, not a claim |

---

## 6. `ChipletAndInterconnect.tsx` — worst offender (1 link, 28 prose numbers)

### 6.1 The one link does not support the paragraph it is attached to

`:104-111` cites *Chips and Cheese — Turin launch* (accessed 2026-04-23) for the sentence
*"On Turin the measured numbers are L1D 4 cycles, L2 ~14 cycles, L3 ~46 cycles (CCD-local), DRAM
130-140 ns NPS1."* Fetching that article: it contains **none** of those four figures. What it does
contain is the latency triple used in the *table* (`:25`): *"Intra-CCD latency: ~45ns"*,
*"Inter-CCD latency: ~150ns"*, *"Socket to Socket latency: ~260ns"*, plus DRAM bandwidth figures
(576 GB/s theoretical read, 435 GB/s write, ~52 GB/s single-CCD read) and loaded-latency deltas
(+39 ns single CCD, +31 ns fully loaded).

### 6.2 Claim-by-claim

| file:line | Claim | Verdict |
| --- | --- | --- |
| `:24` | Turin "Up to 16 CCDs (8c each) or 12 CCDs (16c each, Turin Dense) + 1 IO die. Each CCD has its own L3 (32 MB)" | UNSOURCEABLE this pass — amd.com spec pages and the 5th-gen architecture whitepaper returned 403/timeout. Arithmetic is self-consistent (16×8 = 128; 12×16 = 192) |
| `:25` | "Intra-CCD ~45 ns; inter-CCD ~150 ns; cross-socket ~260 ns" | CONFIRMED **against Tier 3 only** (Chips and Cheese). No vendor number found. Per the project's own sourcing policy this must also trace to Tier 1/2 or be flagged UNKNOWN |
| `:30` | Xeon 6 6900P "3 compute tiles (Intel 3) + 2 IO dies (Intel 7) joined by EMIB … MDF at **2.5 GHz**" | UNSOURCEABLE — intel.com product brief and ARK both 403 |
| `:31` | "Local L3 ~33 ns; adjacent tile ~57 ns; two crossings ~80 ns" | **UNSOURCEABLE** — no citation anywhere in the file |
| `:36` | Graviton4 "**7 chiplets (1 compute + 4 DDR + 2 PCIe)** at TSMC N4/N5" | **UNSOURCEABLE and likely a Graviton3 fact carried forward.** AWS's own Graviton table publishes no die count. 1+4+2 is the published **Graviton3** composition (which paired 4 DDR dies with 8x DDR5); AWS lists Graviton4 as **12x DDR5 (24x for 48xlarge)**, which a 4-DDR-chiplet layout does not obviously fit. The "TSMC N4/N5" split is also unsourced |
| `:36` | Graviton4 "96 cores share 36 MB SLC" | **CONFIRMED (Tier 1)** — `aws/aws-graviton-getting-started`: `Cores … 96 per socket (192 for 2-socket 48xlarge)`, `LLC (shared) … 36MB` |
| `:37` | Graviton4 "Cross-core 30-60 ns; cross-socket 138 ns" | UNSOURCEABLE |
| `:42` | Graviton5 "192 cores in single socket" | Cores CONFIRMED (Tier 1: "192 cores"). "single socket" PARTLY — AWS says *"192 cores in a single **package**"* |
| `:42`, `:245-246` | Graviton5 "**192 MB distributed L3 (1 MB / core)**" | **REFUTED / UNSOURCEABLE.** AWS Tier 1 table: `LLC (shared) … 48MB per NUMA (<= 16xlarge), or 96MB per NUMA (24xlarge and 48xlarge)`. AWS's press figure is *"5x larger L3"* vs Graviton4's 36 MB → 180 MB. A flat "192 MB, 1 MB/core" is true of no published configuration except possibly 48xlarge (2 × 96 MB) |
| `:42` | Graviton5 "**NUMA eliminated — single socket**" | **REFUTED (Tier 1).** AWS's own table row: `Memory (NUMA) nodes … 1 (2 for 16xlarge and 48xlarge)`. Graviton5 has 2 NUMA nodes on 16xlarge and 48xlarge |
| `:43`, `:244-245` | "~33% lower inter-core vs Graviton4 (AWS claim)" | **CONFIRMED (Tier 1)** — *"up to 33% lower inter-core latency"* |
| `:41`, `:245` | Graviton5 fabric "CMN-S3" | CONFIRMED (Tier 1) — AWS table: `Interconnect … CMN-S3` |
| `:35`, `:180` | Graviton4 fabric "Arm CMN-700" | CONFIRMED (Tier 1) |
| `:49` | "NVLink GPU-to-GPU 1.8 TB/s" | CONFIRMED as a number; **directional qualifier missing** (see §3.2) |
| `:102-103` | "L1D 4 cycles, L2 ~14 cycles, L3 ~46 cycles (CCD-local), DRAM 130-140 ns NPS1" | **UNSOURCEABLE as cited** — the attached Chips and Cheese article contains none of them (§6.1). Would need AMD's Zen 5 Software Optimization Guide (Tier 1) |
| `:165-166` | "Each CCD owns 32 MB of L3 that is fast (~46 cycles)" | Same — UNSOURCEABLE as cited |
| `:166` | "Crossing a CCD … adding **~100 ns**" | SPECULATIVE derivation (150 − 45 ≈ 105 from `:25`), presented as fact |
| `:167` | "Turin **~261 GB/s per core measured aggregate**" | **UNSOURCEABLE**, and the unit phrase is incoherent ("per core measured aggregate"). Nothing near 261 appears in the cited article; its per-CCD DRAM read is ~52 GB/s and full-socket theoretical read is 576 GB/s |
| `:168` | "cross-CCD core-to-core latency is ~150 ns" | CONFIRMED (Tier 3 only) |
| `:177-179` | Xeon 6 "mesh runs CHA at **2.5 GHz** with MDF at the die boundaries; per-core L3 bandwidth is **~30 GB/s**" | **UNSOURCEABLE** |
| `:191` | "The cross-die hop adds **~24 ns per boundary**" | **SPECULATIVE derivation presented as vendor fact** — it is exactly 57 − 33 from the uncited table at `:31`. A derived delta from two unsourced numbers |
| `:201` | NV-HBI "10 TB/s aggregate stated by NVIDIA at announcement" | CONFIRMED (Tier 1) |
| `:202` | "208B transistor chip" | CONFIRMED (Tier 1) |
| `:226-227` | "Load latency under contention can be **1.5-2x** the unloaded latency" | **PARTLY REFUTED for the part being discussed.** The article cited elsewhere in this same file measures Turin's loaded-vs-unloaded delta at *"about a 39 nanosecond increase"* (single CCD) and *"about a 31 nanosecond increase"* (fully loaded) — roughly 1.3x on a ~120 ns baseline, below the stated range. No source is attached to the 1.5-2x claim |
| `:240-241` | "ARM's CMN-700 snoop filter must be at least **1.5x** the aggregate L2 capacity" | UNSOURCEABLE — developer.arm.com CMN-700 TRM is gated/JS-only |
| `:241-243` | "96 cores × 2 MB L2 = **192 MB** exclusive L2" | Arithmetic CONFIRMED (Tier 1: `L2 cache (per core) … 2MB`, 96 cores) |
| `:243-245` | "the snoop filter **eats ~288 MB of mesh storage** — comparable in area to the 36 MB SLC itself" | **REFUTED — unit/category error.** A snoop filter stores **directory tags**, not cache lines. 288 MB is the *coverage* (1.5 × 192 MB of tracked cache), not SRAM consumed. 288 MB of coverage ≈ 4.5M lines × ~8 B/entry ≈ **~36 MB** of actual storage. The sentence converts coverage into storage and then compares that storage to a data cache — and at 288 MB the comparison it draws ("comparable in area to the 36 MB SLC") would be false by 8x. The *conclusion* (snoop-filter area is comparable to the SLC) happens to be roughly right, but only via the corrected number |
| `:227-229` | AMD NPS modes / Intel SNC3 exist to keep work and memory on the same chiplet | Qualitative, no citation, low risk |
| `:143-145` | "All measured numbers traceable to vendor docs or third-party measurement — see Sections 9-13 for direct citations per row" | **Not satisfied.** Rows `:31`, `:36`, `:37` have no citation in this file, and `sources.md`'s fact-check register is an empty stub |

---

## 7. Third-party numbers presented as vendor spec (flagged category)

| file:line | Number | Actual authority |
| --- | --- | --- |
| `ChipletAndInterconnect.tsx:25` | 45 / 150 / 260 ns Turin latencies | **Tier 3** (Chips and Cheese), cited as such elsewhere in the file but rendered in the table with no tier marker |
| `ChipletAndInterconnect.tsx:31` | 33 / 57 / 80 ns Xeon 6 latencies | No source. Reads as vendor spec |
| `ChipletAndInterconnect.tsx:37` | 30-60 ns / 138 ns Graviton4 | No source. Reads as vendor spec |
| `ChipletAndInterconnect.tsx:167` | "261 GB/s per core" | No source |
| `ChipletAndInterconnect.tsx:179` | "~30 GB/s" per-core L3 on Xeon 6 | No source |
| `ChipletAndInterconnect.tsx:191` | "~24 ns per boundary" | Derived from `:31`, presented as an architectural property of EMIB |
| `IsolationNie.tsx:24` | Entire B300 MIG row | Extrapolated; NVIDIA publishes no such table |
| `NvidiaBlackwell.tsx:132-134` | "690 GB → 415 GB" | Attributed to an NVIDIA blog that does not contain it |
| `IsolationNie.tsx:106-108` | 250,000 lines / 30 minutes / Isabelle | Attributed to AWS; AWS publishes none of it |

---

## 8. Staleness — superseded between 2026-04-23/25 and 2026-08-01

| Item | Status as of 2026-08-01 |
| --- | --- |
| **Graviton5 / M9g** treated as re:Invent-2025 preview (`IsolationNie.tsx:91-93`, `ChipletAndInterconnect.tsx:40-44`) | **GA.** `Amazon EC2 C9g and C9gd instances powered by AWS Graviton5 processors are now available` (AWS News Blog, 2026-06-30), with `DDR5 8800MT/s DIMMs` and "up to 25% higher performance per vCPU vs C8g" |
| **Graviton5 cache / NUMA** described as "192 MB, NUMA eliminated" | AWS now publishes `LLC … 48MB per NUMA (<= 16xlarge), or 96MB per NUMA (24xlarge and 48xlarge)` and `Memory (NUMA) nodes … 1 (2 for 16xlarge and 48xlarge)`, plus `Frequency 3300MHz`, `12x DDR5`, `Armv9.2-a`. **This new Tier 1 data refutes the dive's claim rather than merely updating it** |
| **EFA 3,200 Gbps on P5** as the anchor for KV transport (`DisaggregatedServing…:73`) | Still correct for P5/P5e/P5en/P6-B200, but **`p6-b300.48xlarge` is now 6,400 Gigabit** — the newest Blackwell instance is 2x the figure the section reasons from |
| **NVLink stops at gen 5** (`NvidiaBlackwell.tsx:24`, `ChipletAndInterconnect.tsx:49`) | NVIDIA's NVLink page now documents **gen 6 at "3.6 TB/s bidirectional"** |
| **Blackwell as the current generation**, no successor mentioned | NVIDIA developer blog now carries *"Inside NVIDIA Rubin GPU Architecture: Powering the Era of Agentic AI"*. The B200-vs-B300 framing at `NvidiaBlackwell.tsx:148-168` no longer describes the top of the roadmap |
| **CUTLASS version history stops at v4.4.0 (Feb 2026)** (`NvidiaBlackwell.tsx:206-208`) | CUTLASS is at **v4.6.1 (2026-07-15)**; v4.5.0 (2026-05-13), v4.6.0 (2026-07-13) all shipped since. Examples now run to `95_blackwell_gemm_green_context`, and `93_blackwell_low_latency_gqa` is directly relevant to the KV-cache section |
| **MIG table covers only A100/H100/H200/B200/B300** (`IsolationNie.tsx:19-25`) | NVIDIA's MIG guide now also publishes **RTX PRO 6000 / 5000 / 4500 Blackwell** and **Thor iGPU** profile tables. AWS launched **EC2 G7 (RTX PRO 4500 Blackwell)** on 2026-06-18, so MIG on non-datacenter Blackwell is now an AWS-relevant configuration the section omits |

---

## 9. Governance gap

`deep-dives/silicon-memory-inference/sources.md` declares (line 3) that *"Each cited claim in the
app links back to an entry here with its access date."* In fact:

- The **"Fact-check register"** (line 57) is an unfilled stub: *"Will be populated here as each
  section moves from scaffold to draft."*
- The **"UNKNOWN register"** (line 66) is empty — despite the sourcing policy at line 7 requiring
  that paper- or third-party-only claims *"must also trace to vendor documentation; if it does not,
  the claim is flagged UNKNOWN."* The 26 UNSOURCEABLE claims above should all be in it.
- The Tier 1 list (lines 19-52) covers only Neuron/Trainium, NVIDIA compilers, PyTorch/JAX, and
  DGX Spark/Jetson. **None of the five audited sections' subject matter** (Blackwell silicon,
  chiplet topology, MIG, NIE, disaggregated serving, KV cache) has a single Tier 1 entry.

This is the mechanism that let the Chips-and-Cheese citation mismatch, the NVFP4 citation mismatch,
and the fabricated B300 MIG row all ship: there is no register that would have caught a claim whose
link does not contain it.

---

## 10. Recommended fixes, by severity

**Must fix (wrong numbers a reader would act on):**

1. `KvCacheAndFlashAttention.tsx:93-97` — 5 GB → **2.5 GiB**; 160 GB → **86 GB**; delete or rewrite
   "exceeding H200's 141 GB" (it does not).
2. `KvCacheAndFlashAttention.tsx:26` — Qwen3-235B-A22B KV heads **8 → 4**, ratio **8:1 → 16:1**.
3. `IsolationNie.tsx:23` — B200 MIG "2 × ~95 GB" → **2 × 90 GB (`3g.90gb`)**; "1 × 192 GB" →
   **1 × 180 GB (`7g.180gb`)**.
4. `IsolationNie.tsx:24` — delete the B300 MIG row or mark it explicitly as not published by NVIDIA.
5. `IsolationNie.tsx:108` — remove "first formally verified cloud hypervisor"; AWS calls NIE a
   *component within the Nitro System*, and the dive says so itself at `:93-95`.
6. `IsolationNie.tsx:106-108` — remove or mark `[UNSOURCEABLE]` the 250,000 lines, Isabelle/HOL,
   and 30-minute figures.
7. `NvidiaBlackwell.tsx:117-118` and `:206-208` — example 92 is **not** the first SM100 example
   (`70_blackwell_gemm` shipped in v3.8.0) and did **not** first appear in v4.0.0 (it is v4.2.0,
   2025-09-18).
8. `NvidiaBlackwell.tsx:114-115` — "seven new instructions" → **four** (`tcgen05.mma`, `.mma.sp`,
   `.mma.ws`, `.mma.ws.sp`).
9. `NvidiaBlackwell.tsx:132-134` — the 690 GB → 415 GB DeepSeek-V3.2 figure is not in the cited
   blog and contradicts the 1.8x figure in the same paragraph. Remove or re-source.
10. `NvidiaBlackwell.tsx:29` — P6e-GB200 is a **B200** instance; move it out of the B300 column.
11. `ChipletAndInterconnect.tsx:42`, `:245-246` — Graviton5 "NUMA eliminated" is refuted by AWS's
    own table; "192 MB L3" should be AWS's published `48 MB / 96 MB per NUMA`.
12. `ChipletAndInterconnect.tsx:243-245` — the snoop filter figure confuses **coverage** (288 MB)
    with **storage** (~36 MB of tag SRAM).

**Must label (right number, missing load-bearing qualifier):**

13. `NvidiaBlackwell.tsx:28`, `:60` — FP4 "14 PFLOPS" needs an explicit **dense** label, and should
    match a published figure (13.5 dense on DGX/HGX B300, 15 dense on GB300; 18-20 sparse).
14. `NvidiaBlackwell.tsx:24`, `ChipletAndInterconnect.tsx:49` — NVLink 1.8 TB/s is
    **bidirectional aggregate**; 900 GB/s each way.
15. `DisaggregatedServingAndSpeculative.tsx:73-75` — mark the ms/sub-ms figures `[SPECULATIVE]`,
    and note that 3,200 Gbps is per-instance across 8 GPUs, not per-GPU. Sub-millisecond over
    NVLink does not hold at the "several GB" end of the same sentence's own range.

**Must cite or drop (26 UNSOURCEABLE claims):** all latency/bandwidth numbers at
`ChipletAndInterconnect.tsx:31`, `:37`, `:102-103`, `:167`, `:177-179`, `:191`, `:226-227`,
`:240-241`; the NIE proof-property Alert at `IsolationNie.tsx:110-119`; and every number in
`DisaggregatedServingAndSpeculative.tsx` other than 3,200 Gbps — notably the "60-90%" speculative
acceptance rate at `:165-166`.

**Fix the mechanism:** populate the `sources.md` fact-check and UNKNOWN registers before the next
content pass, and add a check that every inline `<Link>` actually contains the number attached to it
— that single check would have caught findings 9, and the Chips-and-Cheese mismatch at
`ChipletAndInterconnect.tsx:104-111`.
