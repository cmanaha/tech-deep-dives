# Verification: Groq, SambaNova and Dataflow

Verified: 2026-10-18. Claims checked: 56 (sampled: 0; every claim was checked). Confirmed 45,
wrong 2, unsupported 9, mislabelled 0, unverifiable 0.

Sources were re-fetched on 2026-10-18 as raw text (curl plus HTML-to-text, pdftotext for PDFs):
NVIDIA LPX blog, NVIDIA LPX production release, Groq licence release, Vera Rubin NVL72 page,
GroqChip spec sheet v1.5 (PDF), GroqCloud models page, SN40L arXiv v2 HTML and abstract page,
SN50 blog, SambaNova Series E release, NeuronCore-v3 doc, NKI overview. Two more sources were
fetched to check the module labels and one premise: Groq's ISCA 2020 TSP paper (archived copy of
Groq's own PDF) and a SambaNova blog (2026-01-15).

## Gate 3 score: 8/10

After the fixes every number on the page matches its source, and the strongest one is exact: a
128 GB LPX rack against 288 GB of HBM4 on one Rubin GPU. Of the two wrong claims, one was
load-bearing in context: "15x to 31x" for model switching sat next to the DGX H100 baseline, but
the 31x is against DGX A100. The LPX placement wording ("inside" the platform, LPX "runs" the
FFN and MoE layers) was tightened to NVIDIA's terms. Economy is what keeps the section off 9.
Growth is +44% (the author's count), most of it required NEW LPX content, but a few lines give
the reader neither a way to think nor something to do.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 8 | 45 of 56 confirmed as shipped. The anchor numbers are exact: 128 GB, 288 GB, 500 MB, 150 TB/s, 512 GB, every SN40L tier, $0.15 / $0.60, 500 tokens/s. Wrong: the switching range against DGX H100, and "about 500 MB" for 520 MiB (545 MB). Nine unsupported phrasings were re-cited or scoped. |
| Mental model or practical value | 8 | The two memory bets, the diagram, and "128 GB is less than half of one GPU's HBM, so LPX is a decode engine paired with GPUs" build the model. The Alert and "Where to start" give the reader actions. Neither test is passed by the Intel Capital / Series E sentence or the founder-and-president clause. |
| Shape | 8 | Introduces dataflow and both chips before dissecting them. 128 vs 288 lands twice. Tooling and availability are demoted into an ExpandableSection. Ends on "Where to start". The "Two memory bets, side by side" h2 description restates the topic rather than a payoff. |
| Writing | 8 | no-ai-tells passes. No "Section N" references. Sentence attribution stays only where it is load-bearing: "NVIDIA lists" and "Groq calls" grade vendor claims; "the SN40L paper makes no determinism claim" is a silence claim. The second intro paragraph carries eight acronyms and four facts in one block. |
| Economy | 6 | 762 to 1,099 words (+44%, author's counter). The scope fixes here add about 25 words (my estimate). The FFN/MoE split appears in the intro, the diagram, its caption and the Groq section. The HBM text-vs-table note repeats in the caption and the SambaNova paragraph. Cut candidates are under Backlog. |
| Diagrams | 9 | Inline SVG with `role="img"`, `aria-labelledby` and a `<title>`. Probe: "1 SVG diagram(s), 0 React Flow, ok" at 1440 and 390. PNGs read: no text crosses a box or line. At 390 the SVG keeps 640 px inside its scroll wrapper and the 11 px labels stay legible. |

## Claims

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | Groq and SambaNova compile onto a spatial fabric; operands stream along routes fixed at compile time | lpxBlog, sn40lPaper | CONFIRMED | Blog: "Groq's spatial execution model, where the compiler explicitly schedules computation, data movement, and synchronization". Paper §III-A: "Tensors are tiled and streamed through this pipeline"; "usable by automatic place-and-route algorithms within the compiler" | |
| 2 | AWS Trainium also schedules at compile time, around a systolic array | neuronCoreV3 | UNSUPPORTED (first half) | NeuronCore-v3: "Tensor engines are based on a power-optimized systolic array" (confirms the array); the page never mentions compile-time scheduling and says it "supports control flow, dynamic shapes". NKI overview: "memory allocation and instruction scheduling are done in this stage" (compiler back-end) | Cited nkiOverview (T1, same record as AwsCustomSilicon.ts) on the compile-time clause |
| 3 | Groq keeps the working set, weights included, in on-chip SRAM with DRAM behind | lpxBlog | CONFIRMED | "the compiler and runtime place the active working set, including weights, activations, and KV state, into on-chip memory"; Table 2 "DRAM via fabric expansion logic Up to 512 GB" | |
| 4 | "Groq's bet ships inside NVIDIA's Vera Rubin platform as ... a rack of LPUs" | groqNvidiaLicense, lpxProduction | UNSUPPORTED as worded | Release: "An extension of the NVIDIA Vera Rubin platform". Blog: "Deployed alongside Vera Rubin NVL72"; "a dedicated low-latency inference path alongside Vera Rubin NVL72". VR page: "five racks ... NVIDIA Vera Rubin NVL72, NVIDIA Vera CPU, NVIDIA Groq 3 LPX" | Now "ships in NVIDIA's Vera Rubin platform as the NVIDIA Groq 3 LPX, its own rack of LPUs deployed alongside the Vera Rubin NVL72 GPU racks"; lpxBlog cite added |
| 5 | Built on licensed Groq technology | groqNvidiaLicense | CONFIRMED | "non-exclusive licensing agreement with Nvidia for Groq's inference technology"; NVIDIA: "Groq and LPU are used under license from Groq, Inc." | |
| 6 | In full production since August 2026 | lpxProduction | CONFIRMED | 2026-08-24: "NVIDIA Groq 3 LPX ... is now in full production" | |
| 7 | "In decode, LPX runs the FFN and MoE expert layers while Rubin GPUs keep attention over the KV cache" | lpxBlog | UNSUPPORTED as worded | "LPX accelerates the latency-sensitive portions of the decode loop, including FFN and MoE expert execution, while Rubin GPUs continue to handle prefill and decode attention"; "such as sparse MoE expert feed-forward networks (FFNs) and other pointwise operations". The source gives these as examples, not the whole of LPX's work | Now "LPX takes latency-sensitive work such as the FFN ... and MoE ... expert layers" |
| 8 | Diagram: "LPUs run decode's FFN and MoE expert layers;" (and the SVG title) | lpxBlog | UNSUPPORTED as worded | Same as 7 | Now "LPUs accelerate decode work such as FFN and MoE experts;". Title scoped to "a Groq 3 LPX rack deployed alongside Vera Rubin NVL72" |
| 9 | Whole LPX rack holds 128 GB of SRAM | lpxBlog | CONFIRMED | Table 1: "Total SRAM capacity 128 GB" | |
| 10 | 288 GB of HBM4 on one Rubin GPU | veraRubinNvl72 | CONFIRMED | Spec table, Rubin GPU column: "288 GB HBM4 \| 19.2 TB/s" | |
| 11 | Derived: 128 / 288 = 0.44, "less than half" (twice) | lpxBlog, veraRubinNvl72, derived | CONFIRMED | 128 / 288 = 0.444 | |
| 12 | Each Groq 3 LPU: 500 MB SRAM, primary working storage (body, diagram MEM) | lpxBlog | CONFIRMED | "500 MB of high-speed on-chip SRAM serves as the primary working storage for inference" | |
| 13 | 150 TB/s per LPU (body, diagram MEM) | lpxBlog | CONFIRMED | "pairs 150 TB/s of on-chip memory bandwidth with ... C2C communication per LPU"; tray "SRAM bandwidth 2.4 PB/s" / 16 = 150 TB/s | |
| 14 | 16-LPU tray adds up to 512 GB of DRAM (body, diagram) | lpxBlog | CONFIRMED | Table 2: "LP30 chips 16 ... DRAM via fabric expansion logic Up to 512 GB" (plus "DRAM via host CPU Up to 256 GB", not used) | |
| 15 | Diagram module labels MXM matrix multiply, VXM vector pointwise, SXM switch moves data, MEM SRAM | lpxBlog (caption) | CONFIRMED | Groq ISCA 2020 (Groq authors, Groq-hosted PDF): "vector execution module (VXM) ... point-wise arithmetic"; "matrix execution module (MXM) ... MACC (multiply-accumulate) arrays"; "switch execution module (SXM) ... transposition, permutation, shifting and rotation"; MEM slices hold "220 MiBytes of on-chip SRAM". GroqChip spec sheet: "MXM: FP32 ... VXM: FP16, FP32". NVIDIA blog uses the same four names | |
| 16 | 256 LPUs act as one system in an LPX rack | lpxBlog | CONFIRMED | "Scale-up density 256 chips"; "aligns hundreds of LPU accelerators to act as a single coordinated system" | |
| 17 | "Both chips carry about 500 MB of SRAM" | lpxBlog, sn40lPaper | WRONG (minor rounding) | Groq 3 LPU 500 MB; SN40L "520 MiB" = 545 MB, so "about 500 MB" understates SN40L by 9% | Now "about half a gigabyte of SRAM" |
| 18 | "SambaNova pages it from the HBM and DDR behind each socket" | sn40lPaper | UNSUPPORTED (verb) | The paper describes software-managed tiers and symbols "spilled to DDR", plus model copies DDR to HBM; it describes no demand paging | Now "holds it in the HBM and DDR behind each socket" |
| 19 | The LPU compiler schedules computation, data movement and synchronization ahead of time; no dynamic hardware scheduler | lpxBlog | CONFIRMED | "the compiler explicitly schedules computation, data movement, and synchronization. Instead of relying on dynamic hardware schedulers at runtime" | |
| 20 | First GroqChip (14 nm): 230 MB at up to 80 TB/s, built to need no external memory | groqChipBrief | CONFIRMED | "Process Node 14nm"; "230 MB SRAM per chip"; "Up to 80 TB/s on-die memory bandwidth"; "access to model parameters without the need for external memory". "First" is corroborated by Groq ISCA 2020: "The first-generation Groq TSP ... in 14nm ASIC" | |
| 21 | A plesiosynchronous protocol cancels clock drift, so hundreds of LPUs run one schedule | lpxBlog | CONFIRMED | "plesiosynchronous, chip-to-chip protocol in hardware that cancels natural clock drift and aligns hundreds of LPU accelerators" | |
| 22 | GPUs keep decode work that needs large memory capacity, such as full-context attention over the KV cache | lpxBlog | CONFIRMED | "GPUs handle decode work that benefits most from throughput and large memory capacity, such as full-context attention over the accumulated KV cache" | |
| 23 | LPX can draft tokens that the GPUs verify; Dynamo routes work between them | lpxBlog | CONFIRMED | "LPX is well-suited to act as the draft-generation engine"; GPUs handle "token verification"; "Dynamo orchestrates the disaggregated decode loop by routing work across GPU and LPU backends" | |
| 24 | Nebius is the first AI cloud to adopt LPX | lpxProduction | CONFIRMED (scope added) | "Nebius is the first AI cloud to adopt NVIDIA Groq 3 LPX"; also "Nebius ... plans to bring NVIDIA Groq 3 LPX to Nebius Token Factory" | Added "and plans to offer it through its Token Factory inference platform" |
| 25 | Non-exclusive licence; founder and president to NVIDIA; Groq independent, running GroqCloud | groqNvidiaLicense | CONFIRMED | "Jonathan Ross, Groq's Founder, Sunny Madra, Groq's President ... will join Nvidia"; "Groq will continue to operate as an independent company"; "GroqCloud will continue to operate without interruption". The 2026-08-24 release still names Groq as an independent "inference cloud" | |
| 26 | GroqCloud lists gpt-oss-120b at 500 tokens/s (vendor-claim) | groqModels | CONFIRMED | "GPT OSS 120B openai/gpt-oss-120b 500" (SPEED T/SEC); "Token Speed ~500 tps" | |
| 27 | $0.15 per M input, $0.60 per M output | groqModels | CONFIRMED | "$0.15 input $0.60 output" (PRICE PER 1M TOKENS) | |
| 28 | Models page omits serving precision; no LPU tuning guide or ISA reference located | groqModels | CONFIRMED | Page text has no "precision", "quantiz" or "FP8". The hedge is scoped "during this research" | |
| 29 | SN40L is SambaNova's fourth-generation RDU | sn50Blog, derived | UNSUPPORTED (derivation) | The SN50 blog says "fifth-generation" and "Just like the SN40L RDU", but never states that SN40L is the generation before SN50. SambaNova 2026-01-15: "the fourth generation of our Reconfigurable Dataflow Unit (RDU), the SN40L" | Replaced the derived cite with new record sn40lGenBlog (T2, spec) |
| 30 | 520 MiB SRAM at hundreds of TB/s per socket (body, diagram) | sn40lPaper | CONFIRMED | "520 MiB of on-chip PMU SRAM"; PMUs "in aggregate provide hundreds of TBps of on-chip memory bandwidth" | |
| 31 | 64 GiB HBM at about 1.8 to 2 TB/s (body, diagram, caption) | sn40lPaper | CONFIRMED | "64 GiB of capacity with a peak bandwidth of about 2 TB/s per socket" (§IV); Table II "HBM Bandwidth 1.8 TB/s" | |
| 32 | Up to 1.5 TiB DDR at over 200 GB/s (body, diagram) | sn40lPaper | CONFIRMED | "The DDR tier can have a peak memory capacity of 1.5 TiB at a peak bandwidth of over 200 GB/s" | |
| 33 | Software manages the HBM and DDR tiers | sn40lPaper | CONFIRMED | "Both memory spaces are software managed" | |
| 34 | CoE routes each whole request to one of 150 expert models, a trillion parameters (body, diagram) | sn40lPaper | CONFIRMED | "Samba-CoE, a CoE system with 150 experts and a trillion total parameters"; the router "dynamically assigns each input prompt to the most relevant expert" | |
| 35 | Cold models wait in DDR and load into HBM at over 1 TB/s per node; one node hosts more models than its HBM holds (body, diagram) | sn40lPaper | CONFIRMED | "Models are loaded from DDR to HBM at over 1 TB/s in a single SN40L Node"; "DGXs run out of memory at 150 experts" | |
| 36 | 8-socket SN40L node measured 3.7x a DGX H100 | sn40lPaper, measured | CONFIRMED (scope added to note) | Abstract: "the 8-socket RDU Node ... achieves an overall speedup of 3.7x over a DGX H100". Table V: 3.7x is "BS = 8, 20 output tokens"; the H100 column runs 2.6x to 3.7x | Note now names the case and the 2.6x-3.7x range |
| 37 | "with model switching 15x to 31x faster" (in the DGX H100 sentence) | sn40lPaper | WRONG (baseline) | Table V "Model Switching Time 31x [vs DGX A100] 15x [vs DGX H100]"; §VI-C "31x faster than DGX A100 ... and 16x faster than H100" | Now "with model switching 15x faster"; the note records 31x against DGX A100 |
| 38 | Vendor-authored paper (MICRO 2024), Tier 3, measured | sn40lPaper | CONFIRMED | arXiv comments: "2024 57th IEEE/ACM International Symposium on Microarchitecture (MICRO)"; all authors SambaNova | |
| 39 | SN50 is the fifth-generation RDU and keeps tiered memory | sn50Blog | CONFIRMED | "our fifth-generation chip, the SN50"; "Just like the SN40L RDU, the SN50 RDU features a tiered memory architecture" | |
| 40 | Claims five times the compute per accelerator of the previous generation (vendor-claim) | sn50Blog | CONFIRMED | "deliver five times more compute per accelerator and four times more network bandwidth than the previous generation" | |
| 41 | A SambaRack holds 16 SN50 chips (roadmap) | sn50Blog | CONFIRMED | "The SambaRack SN50 combines 16 SN50 chips" | |
| 42 | "at about 20 kW" | sn50Blog | UNSUPPORTED as worded | "averaging just 20 kW of power in a SambaRack". The source gives an average, not a rating | Now "and averages 20 kW" |
| 43 | Shipping planned for the second half of 2026 (roadmap) | sn50Blog | CONFIRMED | "will start shipping to customers in the second half of 2026" | |
| 44 | h2 description: "what SN50 promises for late 2026" | sn50Blog | UNSUPPORTED as worded | The source says "the second half of 2026" | Now "for the second half of 2026" |
| 45 | No shipment confirmation located during this research | (hedge) | CONFIRMED | A 2026-10-18 search found only "planned" or "later this year" statements (Series E release: "The SN50 will be shipping to customers later this year"). The hedge keeps its scope | |
| 46 | The announcement gives no memory capacity or bandwidth | sn50Blog | CONFIRMED | No "GB", "GiB" or "TB/s" anywhere in the blog text | |
| 47 | Intel Capital joined the February 2026 Series E, alongside a planned collaboration with Intel | sambanovaSeriesE | CONFIRMED | "February 24, 2026"; "led by Vista Equity Partners and Cambium Capital, with strong participation from Intel Capital"; "a planned collaboration with Intel" | |
| 48 | NVIDIA lists reduced execution jitter and per-token latency stable at small batch (vendor-claim) | lpxBlog | CONFIRMED | "Reduced execution jitter under variable workloads"; "keep time-to-first-token and per-token latency stable, even at small batch sizes" | |
| 49 | Groq calls the first GroqChip fully deterministic, no run-to-run variation (vendor-claim) | groqChipBrief | CONFIRMED | "Fully deterministic processor provides predictable and repeatable performance with no run-to-run variation" | |
| 50 | The SN40L paper makes no determinism claim | sn40lPaper | CONFIRMED | The string "determinis" does not occur in the v2 HTML text. The claim is scoped to the paper | |
| 51 | A request for a model not in HBM waits for it to load from DDR | sn40lPaper | CONFIRMED | Copy time is part of CoE latency: "Figures 1(a) and 1(b) show the time breakdown for expert switching vs. model execution" | |
| 52 | No evidence located that Triton, FlashAttention, CUTLASS, vLLM or TensorRT-LLM targets Groq or SambaNova; NVIDIA reaches the LPU through Dynamo | lpxBlog | CONFIRMED | A 2026-10-18 search found no vLLM or other plugin for either vendor. Blog: Dynamo routes "across GPU and LPU backends" | |
| 53 | GroqCloud sells inference through an API | groqModels | CONFIRMED | Per-model "PRICE PER 1M TOKENS" and "RATE LIMITS (DEVELOPER PLAN)" | |
| 54 | "Groq hardware reaches other clouds as LPX" | lpxProduction | UNSUPPORTED (tense) | "Nebius ... plans to bring NVIDIA Groq 3 LPX"; "Groq plans to be among the platform's earliest adopters"; products "offered on a when-and-if-available basis". No customer deployment is confirmed | Now "LPX is set to bring the architecture to other clouds" |
| 55 | SambaNova sells SambaRack systems and is expanding its own cloud capacity | sn50Blog, sambanovaSeriesE | CONFIRMED | "SambaRack SN50 system"; "$350 million in strategic Series E financing to expand manufacturing and cloud capacity" | |
| 56 | No AWS deployment of either located during this research | (hedge) | CONFIRMED | A 2026-10-18 search found only SambaNova's AWS Marketplace listing (2025-05-29), which SambaNova's docs describe as contract and billing terms; the service runs on SambaCloud. The cross-cloud networking point holds | |

## ORCH-NOTES items

- **LPX placement ("inside Vera Rubin"):** FIXED. The intro said Groq's bet "ships inside
  NVIDIA's Vera Rubin platform as ... a rack of LPUs". NVIDIA's words are "An extension of the
  NVIDIA Vera Rubin platform" (release), "Deployed alongside Vera Rubin NVL72" (blog) and "five
  racks ... NVIDIA Groq 3 LPX" (VR page). The page now says "ships in NVIDIA's Vera Rubin
  platform as the NVIDIA Groq 3 LPX, its own rack of LPUs deployed alongside the Vera Rubin NVL72
  GPU racks". The diagram title says "a Groq 3 LPX rack deployed alongside Vera Rubin NVL72".
  Status: "in full production since August 2026" is confirmed and needs no roadmap label.
  Customer deployment is now scoped in two places: Nebius "plans to offer it" (claim 24), and
  Availability reads "is set to bring" (claim 54). The FFN and MoE work is now presented as
  examples, matching NVIDIA (claims 7 and 8).
- **LPU figures:** CONFIRMED, every one. SRAM per chip: 500 MB for Groq 3 and 230 MB for the 14 nm
  GroqChip. Bandwidth: 150 TB/s and 80 TB/s. Chips: 16 per tray, 256 per rack. 128 GB per rack,
  512 GB of DRAM per tray. The single tokens-per-second figure (500 for gpt-oss-120b on
  GroqCloud) is marked vendor-claim. No FP8 or FLOPS figure remains in the section.
- **SambaNova SN40L and SN50 figures:** SN40L tiers, the load rate, the 150 experts, the trillion
  parameters and 3.7x are all CONFIRMED. 3.7x is marked measured, with the batch-8 case and the
  2.6x-3.7x range added to the note. The switching range was WRONG against DGX H100 and is fixed
  to 15x. "Fourth-generation" now cites SambaNova directly. SN50: "roadmap" sits on the 16-chip,
  20 kW and H2 2026 sentence, "vendor-claim" on the 5x compute, and "claims" in the sentence.
  "About 20 kW" is now "averages 20 kW".
- **MXM, VXM, SXM and MEM labels:** CONFIRMED against Groq's own documentation. These are the
  matrix, vector and switch execution modules and the SRAM MEM slices in Groq's ISCA 2020 TSP
  paper ("Think Fast", Groq authors, archived Groq-hosted PDF). The GroqChip spec sheet also
  names MXM and VXM numerics. The diagram's sub-labels (matrix multiply, vector pointwise,
  switch moves data) match both. No change.
- **Length (+44%):** scored under Economy (6). Cut candidates are under Backlog. Economy holds
  the section at 8 rather than 9; it does not threaten the Gate 3 floor.

## Fixes applied

- `src/sections/GroqSambanovaDataflow.tsx:31-34`: "AWS Trainium also schedules at compile time,
  around a systolic array.<Cite neuronCoreV3/>" -> "... schedules at compile time<Cite
  nkiOverview/>, around a systolic array.<Cite neuronCoreV3/>".
- `:40-48`: "ships inside NVIDIA's Vera Rubin platform as the NVIDIA Groq 3 LPX, a rack of LPUs
  ... built on licensed Groq technology" -> "ships in NVIDIA's Vera Rubin platform as the NVIDIA
  Groq 3 LPX, its own rack of LPUs ... deployed alongside the Vera Rubin NVL72 GPU racks, built on
  licensed Groq technology"; added `<Cite s={S.lpxBlog} />`. "In decode, LPX runs the FFN ... and
  MoE ... expert layers while" -> "In decode, LPX takes latency-sensitive work such as the FFN ...
  and MoE ... expert layers, while".
- `:78`: "Both chips carry about 500 MB of SRAM" -> "about half a gigabyte of SRAM".
- `:80`: "SambaNova pages it from the HBM and DDR" -> "SambaNova holds it in the HBM and DDR".
- `:116-117`: "Nebius is the first AI cloud to adopt LPX." -> "... to adopt LPX and plans to offer
  it through its Token Factory inference platform."
- `:144` h2 description: "what SN50 promises for late 2026" -> "for the second half of 2026".
- `:154`: `<Cite s={S.sn50Blog} kind="derived" note="SambaNova calls SN50 its fifth-generation
  chip; SN40L is the generation before it." />` -> `<Cite s={S.sn40lGenBlog} />`.
- `:165-167`: "with model switching 15x to 31x faster" -> "with model switching 15x faster". The
  measured note now adds: "author-measured on Samba-CoE ... 3.7x is the batch-8,
  20-output-token case; Table V gives 2.6x to 3.7x against DGX H100 across its cases, and model
  switching 15x against DGX H100 (31x against DGX A100)."
- `:173-174`: "A SambaRack holds 16 SN50 chips at about 20 kW, and shipping" -> "A SambaRack holds
  16 SN50 chips and averages 20 kW, and shipping".
- `:222-223`: "and Groq hardware reaches other clouds as LPX." -> "and LPX is set to bring the
  architecture to other clouds."
- `src/components/DataflowSiliconDiagram.tsx:45-52` `<title>`: "and on the Vera Rubin platform it
  runs decode's FFN and MoE expert layers while Rubin GPUs keep attention" -> "In a Groq 3 LPX
  rack deployed alongside Vera Rubin NVL72, LPUs accelerate latency-sensitive decode work such as
  the FFN and MoE expert layers, while Rubin GPUs keep attention".
- `DataflowSiliconDiagram.tsx:145`: "LPUs run decode's FFN and MoE expert layers;" -> "LPUs
  accelerate decode work such as FFN and MoE experts;".
- `src/sources/GroqSambanovaDataflow.ts`: added `nkiOverview` (AWS, T1, accessed 2026-10-18;
  same title and URL as AwsCustomSilicon.ts and five other files). Added `sn40lGenBlog`
  ("Inference Speed or Throughput? With RDUs, You Don't Have to Choose (2026-01-15)", SambaNova,
  T2, accessed 2026-10-18). Header comment updated.

## Checks

- `pnpm exec tsc --noEmit | grep -E "GroqSambanovaDataflow|DataflowSiliconDiagram|sources/GroqSambanovaDataflow"`: "no type errors in my files".
- `pnpm exec eslint src/sections/GroqSambanovaDataflow.tsx src/sources/GroqSambanovaDataflow.ts src/components/DataflowSiliconDiagram.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t GroqSambanovaDataflow`: 1 passed, exit 0.
- Gates (from repo root): no-ai-tells exit=0, svg-a11y exit=0, pinned-refs exit=0, pre-overflow exit=0; no hits in my files.
- `vitest run src/__tests__/sources.test.ts`: 830 passed, 1 failed ("keeps sources.md in sync with the registry"). The failure is expected because `sources.md` needs regenerating; see below.
- `pnpm exec vite build --outDir /tmp/vf-GroqSambanovaDataflow-dist --emptyOutDir`: exit 0.
- `node scripts/shoot.mjs --sections groq-sambanova --widths 1440,390 ...`: "groq-sambanova @1440: 1 SVG diagram(s), 0 React Flow, ok" and the same "ok" at 390. I read the 1440 and 390 PNGs. The new 56-character diagram line fits its panel with margin to spare.

## For the orchestrator

- Regenerate `sources.md`. Add the new record `sn40lGenBlog`
  (https://sambanova.ai/blog/inference-speed-or-throughput-with-rdus-you-dont-have-to-choose,
  T2) and add GroqSambanovaDataflow to the NKI overview row.
- `src/sections/MoeAndSparseActivation.tsx:52`: "In decode, LPX runs the FFN and MoE experts
  while Rubin ..." overstates the split in the same way as claims 7 and 8 here. NVIDIA: "LPX
  accelerates the latency-sensitive portions of the decode loop, including FFN and MoE expert
  execution". Suggest "LPX takes latency-sensitive work such as the FFN and MoE experts".
- Any section that says Nebius or another cloud "offers" or "runs" LPX: NVIDIA's release says
  Nebius "plans to bring" it. Only production is confirmed.
- Glossary: the `SXM` and `MXM, VXM` entries are already present and agree with Groq's ISCA 2020
  naming. `LPU` could add "ships in NVIDIA Groq 3 LPX, a rack deployed alongside Vera Rubin
  NVL72" (author's suggestion, still open).

## Backlog

Cut candidates if the orchestrator wants Economy above 6 (none was cut, because cutting is not a
correction):
- The Intel Capital / Series E sentence (about 20 words). It gives the reader no mental model and
  no action.
- "its founder and its president joined NVIDIA" (about 10 words). The licence and Groq's
  independence carry the "company vs architecture" point without it.
- The intro's FFN/MoE split sentence (about 30 words). The same split appears in the diagram and
  in "The work it takes from the GPU". The intro could keep only the 128 GB vs HBM point.
- The caption's "about 2 TB/s in its text and 1.8 TB/s in its table" (about 15 words). It repeats
  the 1.8 to 2 TB/s range in the SambaNova paragraph.

Enhancements:
- Availability could note that SambaNova is in AWS Marketplace (2025-05-29) as a procurement path:
  contract and billing only, with the service still on SambaCloud. That is practical for an
  AWS buyer.
- Give the "Two memory bets, side by side" h2 a payoff description (the reader's moment) rather
  than a topic restatement.
