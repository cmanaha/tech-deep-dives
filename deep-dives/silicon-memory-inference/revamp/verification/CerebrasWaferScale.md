# Verification: Cerebras Wafer-Scale

Verified: 2026-10-18. Claims checked: 60 (sampled: 0; every claim, including diagram labels, was checked against its source). Confirmed 55, wrong 2, unsupported 2, mislabelled 1, unverifiable 0.

## Gate 3 score: 8/10

After fixes the section is accurate and gives the reader one clear model: a wafer turns the bandwidth wall into a capacity wall, so count wafers and price the links between them. It ends on a concrete AWS action. Its one load-bearing error is fixed: the ridge, built on a peak Cerebras's own datasheet marks as sparse, had been presented as if dense. It is held at 8 rather than 9 by length (+39% over the pre-revamp text), a ridge block that now carries five citations, and no supporting evidence demoted into an ExpandableSection.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 8 | 55 of 60 confirmed. One load-bearing error: the ridge treated 125 PFLOPS as possibly dense, but the CS-4 datasheet footnotes the doubled WSE-3T figure "compute shown as sparse FP16". So "batch-1 BF16 still sits below the ridge" was unsupported. Fixed to a ceiling of 6. |
| Mental model or practical value | 8 | Capacity wall, the layer split, "Count wafers before you price", Bedrock status and the Marketplace path all give a way to think or a thing to do. "Software coverage" is the thinnest block, but it still tells the reader that client code ports. |
| Shape | 7 | The intro comes before the dissection, the 44 GB figure recurs, and the section ends on "Point an OpenAI client at it...". But two h2 descriptions restate the topic ("A wafer and an H100 die at the same scale...", "Per-request speed on a wafer...") and nothing is demoted into an ExpandableSection. |
| Writing | 8 | The no-ai-tells gate passes. Attribution sits in the sentence only in the load-bearing cases: the silences ("the Cerebras inference blog does not say where it lives", "no Cerebras dense figure was located") and the trade-press grade on the Q1 2027 and dense-FP16 estimates. |
| Economy | 7 | 785 words before the revamp, 1,044 after authoring, 1,088 after this pass (+39%). Most growth is required new content (CS-4, Bedrock, gpt-oss-120b fit). The ridge block is now dense. |
| Diagrams | 9 | Two inline SVGs with role="img", aria-labelledby and a title. The wafer and the H100 die are drawn at true area scale. The probe reports "ok" at 1440 and 390. Read at both widths: no overlap. At 390 the reader scrolls sideways, per the dive convention. |

## Claims

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | WSE-3 "one 46,225 mm² die" (also diagram) | cerebrasS1 | CONFIRMED | "the entire 46,225 mm2 of silicon" (S-1) | |
| 2 | "about 57x an H100 die of 814 mm²" (derived 56.8) | hopperArchBlog | CONFIRMED | "a die size of 814 mm2"; 46,225 / 814 = 56.8. The Hot Chips 2024 deck also gives "57x" against H100 | |
| 3 | 900,000 cores (also diagram) | cerebrasS1 | CONFIRMED | "The WSE combines 900,000 compute cores, 44 gigabytes of on-chip memory" | |
| 4 | 44 GB of SRAM | cerebrasS1 | CONFIRMED | same sentence | |
| 5 | 21 PB/s (also diagram) | cerebrasS1 | CONFIRMED | "21 petabytes of memory bandwidth" | |
| 6 | "2,625x the HBM bandwidth of a B200" | cerebrasS1 | CONFIRMED | "2,625 times more memory bandwidth than NVIDIA's B200 package" | |
| 7 | Inference keeps the weights in SRAM | cerebrasInferenceBlog | CONFIRMED | "integrate 44GB of SRAM on a single chip", "eliminating the need for external memory" | |
| 8 | Training adds up to 1.2 PB of external memory | wse3Press | CONFIRMED | "External memory: 1.5TB, 12TB, or 1.2PB"; "a huge memory system of up to 1.2 petabytes" | |
| 9 | CS-4 announced August 2026 | cs4Press | CONFIRMED | "SUNNYVALE, Calif., Aug. 18, 2026" (cerebras.ai copy of the release; the nasdaq.com copy timed out twice) | |
| 10 | First shipments planned for that quarter | cs4Press | CONFIRMED | "First CS-4 shipments begin this quarter." | |
| 11 | Three WSE-3T per rack | cs4Press, cs4Datasheet | CONFIRMED | Datasheet: "3 × WSE-3 Turbos per system" | |
| 12 | Same cores and 44 GB | cs4Datasheet | CONFIRMED | "900,000 cores; 44 GB SRAM" (per wafer) | |
| 13 | 250 PFLOPS, with the note "Cerebras does not state whether this peak is dense or sparse" | cs4Press, cerebrasChip | WRONG (note) | CS-4 datasheet spec table: "AI Compute 250 PFLOPS*", footnote "compute shown as sparse FP16". The chip page and the system page do not say, but the datasheet does | Now "250 PFLOPS of sparse FP16", cited to the new cs4Datasheet record. cerebrasChip is dropped (it is no longer cited) |
| 14 | 43.2 PB/s (also diagram subtitle) | cs4Press, cs4Datasheet | CONFIRMED | Datasheet: "Memory Bandwidth 43.2 PB/s" per wafer | |
| 15 | Twice the compute and bandwidth | cs4Press | CONFIRMED | "The WSE-3T doubles AI compute to 250 PFLOPS per wafer"; system page: "Twice the compute. Twice the bandwidth." | |
| 16 | Wafer to wafer "as low as 2 µs" (also diagram) | cs4Blog | CONFIRMED | "CS-4 reduces wafer-to-wafer interconnect latency to as low as 2 microseconds." | |
| 17 | A model larger than 44 GB is split at layer boundaries | cerebrasInferenceBlog | CONFIRMED | "we split them at layer boundaries and map them to multiple CS-3 systems." | |
| 18 | 80 GB on an H100 (also diagram) | h100Page | CONFIRMED | H100 SXM "80GB" | |
| 19 | "288 GB in eight stacks on a B300" (diagram: 288 GB) | blackwellUltraBlog | CONFIRMED (body); the source contradicts itself | "HBM configuration: Eight 12-Hi stacks". The editor's note says the post was updated "to show the proper 12 HBM stacks instead of 8" | None. Raised for the orchestrator (dive-wide) |
| 20 | 48 kB of SRAM per core that no other core uses (also diagram) | cerebrasSdkBlog | CONFIRMED | "Each PE has its own 48 kB of memory (used by it and no other)" | |
| 21 | Two-dimensional mesh | cerebrasSdkBlog | CONFIRMED | "a two-dimensional rectangular mesh on one single silicon wafer" | |
| 22 | 900,000 x 48 kB = about 43 GB (derived) | cerebrasSdkBlog | CONFIRMED | 900,000 x 48,000 B = 43.2 GB | |
| 23 | WSE-3 "peaks at 125 PFLOPS", note "Cerebras does not state..." | wse3Press | MISLABELLED | The announcement says only "125 petaflops of peak AI performance". The Hot Chips 2024 deck says "125 Petaflops of AI compute", with no footnote. The CS-4 release says "The WSE-3T doubles AI compute to 250 PFLOPS", and the datasheet marks 250 as sparse FP16 | The note now says the announcement does not label it, and that the CS-4 datasheet marks the doubled figure sparse FP16 |
| 24 | Ridge "about 6 FLOP per byte" (derived) | cerebrasS1 | CONFIRMED (arithmetic) | 125 / 21 = 5.95. This is a sparse-peak ridge | The prose now calls 6 a ceiling |
| 25 | "Batch-1 decode in BF16 ... still sits below the ridge; the weight matmuls cross it at a batch of about six" | cerebrasS1 (derived) | UNSUPPORTED | Holds only at the sparse peak. No Cerebras dense figure was located in the WSE-3 release, the Hot Chips deck or the CS-4 datasheet. The Register (Tier 3) lists "Dense FP16 / 12.5 PFLOPS", which gives 12.5 / 21 = 0.6, below batch 1 | Now "cross the ridge by a batch of six", plus one sentence giving the trade-press dense estimate (Tier 3, kind derived). The h2 description and the h3 are changed to match |
| 26 | H200 in FP8 needs about 200 (derived) | h200Page | CONFIRMED | "FP8 Tensor Core 3,958 TFLOPS", footnote "With sparsity"; dense 1,979 / 4.8 TB/s = 412; 2 FLOP/byte per sequence gives B = 206 | |
| 27 | WSE-3T ridge stays near 6 (250 / 43.2 = 5.8) | cs4Press | CONFIRMED | Inputs as in #13 and #14 | |
| 28 | "The compiler places the program on specific cores and fixes the routes through the fabric" | cerebrasSdkBlog | UNSUPPORTED by the cited source | The SDK blog covers wavelets and colors only. SDK docs: "This layout must be defined at compile time", "specifying a rectangle of active PEs and a code file assigned to each PE", "You connect a PE to another PE by specifying routes for colors" | Added the cerebrasSdkDocs record (Tier 1) and cited it on this clause |
| 29 | A core runs a task when its data arrives | cerebrasSdkBlog | CONFIRMED | "computation is activated by the arrival of data on a processing element (PE)" | |
| 30 | 20B on one wafer at 16 bits; 70B on as few as four systems | cerebrasInferenceBlog | CONFIRMED | "20B models fit on a single CS-3 while 70B models fit on as few as four systems"; "native 16-bit weights" | |
| 31 | "Wafer-to-wafer latency: as low as 2 µs on CS-4 and 5 µs on CS-3" | cs4Press | CONFIRMED | "I/O latency shrinks from five microseconds to as low as two microseconds." | Caption now reads "I/O latency between wafers", the release's term for the 5 µs |
| 32 | Expert routing stays on one wafer (derived) | cerebrasInferenceBlog | CONFIRMED (derivation) | Follows from "split them at layer boundaries" | |
| 33 | gpt-oss-120b has 117B parameters and fits on one 80 GB H100 | gptOss120bReadme | CONFIRMED | "(117B parameters with 5.1B active parameters)", "fit into a single 80GB GPU (like NVIDIA H100 or AMD MI300X)" | |
| 34 | MXFP4 at 4.25 bits per weight | gptOss120bConfig, ocpMx | CONFIRMED | Config: "quant_method": "mxfp4", modules_to_not_convert = self_attn, router, embed_tokens, lm_head. OCP MX v1.0 table: MXFP4 "FP4 (E2M1) 4 32 E8M0 8", so 4 + 8/32 = 4.25 | |
| 35 | Needs at least 62 GB, more than one wafer (derived) | gptOss120bConfig | CONFIRMED | 117e9 x 4.25 / 8 = 62.2 GB | |
| 36 | The Cerebras model page states no serving precision | cerebrasGptOssPage | CONFIRMED | The page never mentions FP16, BF16, MXFP4, FP8 or quantization | |
| 37 | A CS-4 rack holds 132 GB of SRAM (derived) | cs4Press | CONFIRMED | 3 x 44 GB | |
| 38 | One B300 holds 288 GB of HBM3e | blackwellUltraBlog | CONFIRMED | "Max HBM capacity ... 288 GB HBM3E" | |
| 39 | GB300 NVL72 20 TB | gb300Nvl72 | CONFIRMED | "GPU Memory / Bandwidth: 20 TB / Up to 576 TB/s" | |
| 40 | The inference blog does not say where the KV cache lives | cerebrasInferenceBlog | CONFIRMED | The KV cache is not mentioned anywhere in the post | |
| 41 | Each wafer boundary adds at least 2 µs to every token (derived) | cs4Blog | CONFIRMED (derivation) | Floor from "as low as 2 microseconds" | |
| 42 | gpt-oss-120b is in the shared catalog | cerebrasModels | CONFIRMED | Shared Inference lists `gpt-oss-120b` ~3000 | |
| 43 | About 3,000 tokens/s (vendor-claim) | cerebrasGptOssPage | CONFIRMED | "~3000" tokens/sec, undefined. The "Our reading" note fits | |
| 44 | $0.35 in, $0.75 out per million tokens | cerebrasGptOssPage | CONFIRMED | "$0.35 / M tokens", "$0.75 / M tokens" (Developer pricing) | |
| 45 | B200, TensorRT-LLM: up to 60,000 per GPU, or 1,000 per user (vendor-claim) | inferenceMaxBlog | CONFIRMED | "NVIDIA B200 sets the pace with 60,000 tokens per second per GPU and 1,000 tokens per second per user on gpt-oss" | |
| 46 | 30,000 per GPU at 100 per user, with speculative decoding (note) | inferenceMaxBlog | CONFIRMED | "tripling throughput at 100 tokens per second per user", "boosting per-GPU speeds from 6,000 to 30,000 tokens". That sentence names no GPU; the surrounding text is about the B200 | |
| 47 | Maverick "since retired from the catalog" | cerebrasModels | CONFIRMED | Maverick is not listed | |
| 48 | Maverick 2,522 vs NVIDIA Blackwell 1,038 (measured) | maverickPress | CONFIRMED | "benchmarked Cerebras' Llama 4 Maverick endpoint at 2,522 tokens per second", "NVIDIA Blackwell's 1,038 tokens per second" | |
| 49 | "NVIDIA Blackwell, DGX B200: 1,038"; note "The release ties the NVIDIA figure to eight Blackwell GPUs in a DGX B200" | maverickPress | WRONG | The release ties DGX B200 to NVIDIA's own claim: "8 Blackwell GPUs in a DGX B200 could demonstrate 1,000 tokens per second (TPS) per user". It names no system for the 1,038 | Cell now "NVIDIA Blackwell: 1,038 tokens/s"; the note is corrected |
| 50 | SambaNova 794, Groq 549 | maverickPress | CONFIRMED | "SambaNova: 794 t/s", "Groq: 549 t/s" | |
| 51 | March 2026: CS-3 in AWS data centers, exclusively through Bedrock "rather than as EC2 instances", Trainium prefill, CS-3 decode, EFA | awsCerebrasPress | CONFIRMED | "to be deployed on Amazon Bedrock in AWS data centers", "available exclusively through Amazon Bedrock", "AWS Trainium optimized for prefill and Cerebras CS-3 optimized for decode", "Elastic Fabric Adapter (EFA) networking". The release does not mention EC2; "rather than EC2" is our reading of "exclusively" | |
| 52 | Trainium sends the KV cache to the wafer over EFA | cerebrasAwsBlog | CONFIRMED | "It computes the KV cache and sends it to the WSE via Amazon's high-speed EFA interconnect." | |
| 53 | Launch due "in the next couple of months" | awsCerebrasPress | CONFIRMED | Takeaways: "launching in the next couple of months" | |
| 54 | No AWS launch announcement located as of 2026-10-16 | (scoped hedge) | CONFIRMED | Re-searched 2026-10-18: no What's New post or GA announcement located. Hedge scope kept | |
| 55 | Trade-press summary: CEO expects Q1 2027 | earningsCallSummary (T3) | CONFIRMED | "the solution is expected on AWS's Bedrock platform in Q1 2027" (2026-08-12) | |
| 56 | API follows the OpenAI Chat Completions format | cerebrasInferenceBlog | CONFIRMED | "Built on the familiar OpenAI Chat Completions format" | |
| 57 | Cerebras sells on-premises systems and cloud inference | cerebrasS1 | CONFIRMED | "purchase Cerebras AI supercomputers for on-premises deployments"; "access Cerebras compute through consumption-based models" | |
| 58 | MBZUAI 62%, G42 24% of 2025 revenue | cerebrasS1 | CONFIRMED | "MBZUAI ... accounted for 62.0% of our total revenue"; G42 "accounted for 24.0% and 85.0% ... 2025 and 2024" | |
| 59 | OpenAI agreement > $20 billion for 750 MW | cerebrasS1 | CONFIRMED | "valued at more than $20 billion dollars"; "deploy 750 megawatts" | |
| 60 | Marketplace listing: usage-billed, OpenAI-compatible; shared catalog gpt-oss-120b and qwen-3.8-27b, others through Dedicated Inference | awsMarketplaceListing, cerebrasModels | CONFIRMED | "Pricing is based on actual usage"; "drop-in, OpenAI-compatible API"; "Many additional model families are available through Dedicated Inference." | |

## ORCH-NOTES items

- **WSE-3 125 PFLOPS dense or sparse (and WSE-3T 250 PFLOPS).** Verdict: Cerebras does state it, for the WSE-3T. The CS-4 datasheet (linked as "Datasheet" from cerebras.ai/system) footnotes "AI Compute 250 PFLOPS*" with "compute shown as sparse FP16". For the WSE-3, the announcement ("125 petaflops of peak AI performance") and the Hot Chips 2024 deck do not label it. The CS-4 release says the WSE-3T "doubles AI compute to 250 PFLOPS", so 125 is half a sparse FP16 figure. No CS-3 datasheet was located. The chip page and the system page are silent. The section's "Cerebras does not state" note was therefore wrong for the WSE-3T and incomplete for the WSE-3; both are fixed. The ridge is now presented as a sparse-peak ceiling, and a scoped silence covers the missing dense figure ("no Cerebras dense figure was located"). One Tier 3 estimate, from The Register: "Dense FP16 / 12.5 PFLOPS", "the same 10x sparsity we saw with the WSE-3", no source cited. It gives a dense ridge of about 0.6.
- **Length (+33%).** The author's count was 1,044, or 1,088 after this pass (+39% over 785). Most of the growth is required new content (CS-4, Bedrock status, the gpt-oss-120b fit). My ridge correction added 44 words. Scored 7 for economy.
- **Roofline cross-check.** The Roofline and Arithmetic Intensity section quotes no Cerebras ridge. Its only mention is qualitative ("Cerebras wafer-scale engines ... change the denominator"). There is nothing to reconcile.

## Fixes applied

- `src/sections/CerebrasWaferScale.tsx:12-24`: replaced `denseSparseNote` with `wse3PeakNote` and `sparseNote`. The ridge note now says both peaks are sparse FP16. Added `denseEstimateNote` (The Register, 12.5 / 21 = 0.6).
- `:116-123` (intro, CS-4): "(250 PFLOPS, 43.2 PB/s)" with "does not state" notes on cs4Press and cerebrasChip. Now "twice the compute and bandwidth: 250 PFLOPS of sparse FP16 (16-bit floating point) and 43.2 PB/s", cited to cs4Press and cs4Datasheet.
- `:166` h2 description: "crosses the ridge at a batch of about six" is now "crosses the ridge by a batch of six".
- `:174` h3: "The ridge drops to about 6 FLOP/byte" is now "The ridge drops to 6 FLOP/byte or less".
- `:176-190` ridge paragraph: "Batch-1 decode ... still sits below the ridge; ... cross it at a batch of about six" is replaced. It now says the peak counts sparsity (cs4Datasheet), that no Cerebras dense figure was located, so 6 is a ceiling, and that the weight matmuls "cross the ridge by a batch of six". It adds one sentence: "A trade-press estimate puts dense FP16 at a tenth of the peak, a ridge near 0.6 that even batch 1 crosses" (registerCs4, kind derived).
- `:195-197` compiled routes: added the `cerebrasSdkDocs` citation to the compile-time placement and routes clause.
- `:79` Maverick cell: "NVIDIA Blackwell, DGX B200: 1,038" is now "NVIDIA Blackwell: 1,038". `aaNote` is corrected so it no longer ties DGX B200 to the 1,038.
- `:224` caption: "Wafer-to-wafer latency: ... 5 µs on CS-3" is now "I/O latency between wafers: as low as 2 µs on CS-4, 5 µs on CS-3."
- `src/sources/CerebrasWaferScale.ts`: added `cs4Datasheet` (Tier 1, 2026-10-18), `cerebrasSdkDocs` (Tier 1, 2026-10-18) and `registerCs4` (Tier 3, 2026-10-18). Removed `cerebrasChip`, which is no longer cited.
- `src/components/CerebrasWaferDiagram.tsx`: unchanged. Every number in it is confirmed.

## Checks

- `pnpm exec tsc --noEmit | grep -E "CerebrasWaferScale|CerebrasWaferDiagram"`: no hits ("no type errors in my files").
- `pnpm exec eslint src/sections/CerebrasWaferScale.tsx src/sources/CerebrasWaferScale.ts src/components/CerebrasWaferDiagram.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t CerebrasWaferScale`: exit 0 (1 passed, 34 skipped).
- Gates from the repo root: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0, pre-overflow exit 0. No Cerebras hits in any of them.
- `pnpm exec vitest run src/__tests__/sources.test.ts`: tier consistency passes (821 of 822). Only the sources.md snapshot fails: it needs the new records `cs4Datasheet`, `cerebrasSdkDocs` and `registerCs4` added and `cerebrasChip` removed.
- `pnpm exec vite build --outDir /tmp/vf-CerebrasWaferScale-dist --emptyOutDir`: exit 0. `node scripts/shoot.mjs --sections cerebras --widths 1440,390 ...`: "2 SVG diagram(s), ok" at both widths. PNGs read: no overlap. The diagram was not edited, so this was a scoring check.
- Word count (`/tmp/cerebras-tools/wc.mjs`): 1,088.

## For the orchestrator

- Regenerate `sources.md`: add cs4Datasheet, cerebrasSdkDocs and registerCs4; drop cerebrasChip.
- `cerebrasSdkBlog` is cited for compile-time placement or routing in *Thesis and Framing* ("On WSE-3 the compiler fixes the routes", around line 210) and *The Heterogeneity Fact* ("Mitigation: placement and routing at compile time", around line 284). The blog does not say this. The SDK docs page (sdk.cerebras.ai/computing-with-cerebras, "This layout must be defined at compile time") does; reuse the `cerebrasSdkDocs` record.
- The Blackwell Ultra blog contradicts itself on B300 stacks: the body says "Eight 12-Hi stacks", while the editor's note says it was updated "to show the proper 12 HBM stacks instead of 8". *HBM and the Bandwidth Wall*, *NVIDIA Blackwell* and this section all say eight. Decide dive-wide whether to keep "eight" (it matches the spec bullet and 288 / 36 GB) or drop the stack count.
- Cross-section note: the Cerebras compute peaks (125 and 250 PFLOPS) are sparse FP16 per the CS-4 datasheet. Any section quoting them should say so.
- The nasdaq.com copy of the CS-4 release (cs4Press URL) timed out twice. The same release loads at https://www.cerebras.ai/press-release/cerebras-unveils-cs-4-up-to-30-times-faster-than-gpu-based-solutions-3347356. Consider switching the URL in the record and in sources.md.

## Backlog

- Two h2 descriptions state the topic rather than the payoff ("What the silicon looks like", "Measured and quoted speed").
- Demote the Maverick row and the supply/revenue detail into an ExpandableSection to recover economy.
- The Q1 2027 Bedrock date rests on a Tier 3 summary. The Cerebras Q2 2026 8-K (sec.gov) or the call transcript may carry it at Tier 1 or 2.
