# Change report: GroqSambanovaDataflow (nav id `groq-sambanova`)

Status: DONE.

Register: `research/2026-10-refresh/04-other-arch.md`, section 0 ("What changed in the
world") and section 2 (claims GS1 to GS25, Recommended edits 1 to 7).

Files: `src/sections/GroqSambanovaDataflow.tsx`, `src/components/DataflowSiliconDiagram.tsx`,
`src/sources/GroqSambanovaDataflow.ts` (new, 11 records). Shared records reuse the URL,
title, publisher and tier already in use: `lpxBlog`, `lpxProduction`, `groqNvidiaLicense`
(ThesisAndFraming.ts, HeterogeneityFact.ts), `groqModels`, `sn40lPaper` (Tier 3, publisher
arXiv), `sn50Blog` (MoeAndSparseActivation.ts), `neuronCoreV3` (AwsCustomSilicon.ts),
`veraRubinNvl72` (NvidiaBlackwell.ts). New records: `groqChipBrief` (T2-21),
`sambanovaSeriesE` (T2-27).

## Spine

The section is reframed around Recommended edit 1: Groq's SRAM-first bet ships inside
NVIDIA's Vera Rubin platform as Groq 3 LPX, a decode engine paired with Rubin GPUs, with
DRAM behind the SRAM. SambaNova is the other memory bet (three tiers, whole-model
switching). The strongest number, landed twice (intro and the Groq section): a whole
256-LPU LPX rack holds 128 GB of SRAM, less than half the 288 GB of HBM4 on one Rubin GPU
[derived from lpxBlog and veraRubinNvl72]. Determinism is scoped to Groq only.

## Fetched during authoring (records carry 2026-10-17)

- NVIDIA LPX blog: "500 MB of high-speed on-chip SRAM serves as the primary working
  storage for inference"; "150 TB/s of on-chip memory bandwidth"; tray table "LP30 chips |
  16", "DRAM via fabric expansion logic | Up to 512 GB", "DRAM via host CPU | Up to 256 GB";
  rack table "Total SRAM capacity | 128 GB", "On-chip SRAM bandwidth | 40 PB/s",
  "Scale-up density | 256 chips"; "Matrix execution modules (MXM)", "Vector execution
  modules (VXM)", "Switch execution modules (SXM)", "the MEM block"; "LPX accelerates the
  latency-sensitive portions of the decode loop, including FFN and MoE expert execution,
  while Rubin GPUs continue to handle prefill and decode attention"; "GPUs handle decode
  work that benefits most from throughput and large memory capacity, such as full-context
  attention over the accumulated KV cache"; "LPX is well-suited to act as the
  draft-generation engine"; "NVIDIA Dynamo orchestrates the disaggregated decode loop by
  routing work across GPU and LPU backends"; "plesiosynchronous, chip-to-chip protocol in
  hardware that cancels natural clock drift"; "Reduced execution jitter under variable
  workloads"; "this determinism helps keep time-to-first-token and per-token latency
  stable, even at small batch sizes". The blog never says dense or sparse for its FP8
  figures.
- GroqChip product spec sheet v1.5 (the register URL redirects to a PDF; text extracted
  with pdftotext): "Fully deterministic processor provides predictable and repeatable
  performance with no run-to-run variation", "Process Node 14nm", "230 MB SRAM per chip",
  "Up to 80 TB/s on-die memory bandwidth", "access to model parameters without the need
  for external memory", "Up to 750 TOPs, 188 TFLOPs (INT8, FP16 @900 MHz)".
- GroqCloud models: "GPT OSS 120B", "openai/gpt-oss-120b", speed "500", "$0.15 input",
  "$0.60 output". The page states no serving precision.
- Groq licence press release: "non-exclusive licensing agreement with Nvidia for Groq's
  inference technology"; "Jonathan Ross, Groq's Founder, Sunny Madra, Groq's President"
  join NVIDIA; "Groq will continue to operate as an independent company"; "GroqCloud will
  continue to operate without interruption."
- LPX production release (2026-08-24): "now in full production"; "Nebius is the first AI
  cloud to adopt NVIDIA Groq 3 LPX."
- SN40L paper (arXiv HTML v2): "520 MiB of on-chip PMU SRAM", "hundreds of TBps of
  on-chip memory bandwidth", "64 GiB of co-packaged HBM", HBM "about 2 TB/s per socket"
  (text) and "1.8 TB/s" (Table II), DDR "1.5 TiB at a peak bandwidth of over 200 GB/s",
  "Both memory spaces are software managed", "Models are loaded from DDR to HBM at over 1
  TB/s in a single SN40L Node", 150 experts and a trillion parameters, 8-socket RDU Node
  3.7x over DGX H100 and 6.6x over DGX A100, model switching 15x to 31x. The paper names no
  HBM generation, never calls SN40L "fourth-generation" (only "earlier generations"), and
  never uses "deterministic" or "determinism".
- SN50 blog: "our fifth-generation chip"; "a tiered memory architecture that combines
  large-capacity memory, high-bandwidth memory (HBM), and ultra-fast SRAM"; "five times
  more compute per accelerator and four times more network bandwidth than the previous
  generation"; "The SambaRack SN50 combines 16 SN50 chips"; "averaging just 20 kW";
  "will start shipping to customers in the second half of 2026". No SN50 memory capacity
  or bandwidth.
- SambaNova Series E press release: "$350 million in strategic Series E financing to
  expand manufacturing and cloud capacity"; round "led by Vista Equity Partners and Cambium
  Capital, with strong participation from Intel Capital"; "planned multi-year strategic
  collaboration". It does not mention Intel acquisition talks (the register's GS20 note
  on ended talks is not carried).

## Word count

Same counter both sides (`/tmp/groq-author/wc.mjs`: JSX text plus `description`,
`header`, `headerText` strings; tags, code and citation badges excluded; disclosures
included): **762 before, 1,099 after (+44%)**.

Growth above 20% comes from register NEW and STALE-replacement blocks, each required:
- Groq 3 LPX in Vera Rubin, intro and "The work it takes from the GPU" (GS5, Recommended
  edit 1): about 125 words. This is the section's new spine.
- Groq licence and company status (GS6): about 25 words.
- Groq 3 LPU memory model with DRAM behind it, first-gen comparison, plesiosynchronous
  protocol (GS3, GS4, GS7): about 45 words net of the replaced "SRAM-only" text.
- SN50 roadmap paragraph and Intel investment (GS20): about 75 words.
- "Where to start" closing paragraph (section-shape rule: end on the reader's next
  action): about 55 words.
Cut to hold the rest flat: the "Why one section" paragraph, the long "competitive with
wafer-scale" production paragraph, the 6.6x DGX A100 figure, the 40 PB/s and 640 TB/s rack
figures and the 96 C2C links (left in the LPX blog), the duplicated "Public architectural
documentation" paragraph (folded into the SN50 paragraph and the Alert).

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| GS1 | "Both ... are dataflow architectures ... operands flow ... along compiled-in routes rather than through a register file managed by a scheduler" | "compile the program onto a spatial fabric of functional units, and operands stream between units along routes fixed at compile time" | lpxBlog (T2), sn40lPaper (T3), spec |
| GS2 | Trainium "compile-time scheduled but built around a systolic array, not a spatial dataflow fabric" | "AWS Trainium also schedules at compile time, around a systolic array" | neuronCoreV3 (T1), spec |
| GS3 | "Groq holds all weights in on-chip SRAM"; "no HBM in the inference path"; "There is no DRAM traffic in the inference path"; diagram "all weights in SRAM", "No HBM, no DRAM in the inference path" | "Groq keeps it, weights included, in on-chip SRAM with DRAM behind the chip"; "500 MB ... its primary working storage"; "a 16-LPU tray adds up to 512 GB of DRAM"; diagram "SRAM first, DRAM behind it" and a DRAM box | lpxBlog (T2), spec |
| GS4 | "230 MB of on-chip SRAM per LPU with ~80 TB/s"; diagram "230 MB SRAM per chip, 80 TB/s" | Groq 3 LPU "500 MB ... at 150 TB/s"; "The first GroqChip (14 nm) held 230 MB at up to 80 TB/s and was built to need no external memory"; diagram MEM "500 MB SRAM, 150 TB/s" | lpxBlog (T2), groqChipBrief (T2), spec |
| GS7 | "no out-of-order or speculative behavior ... static schedule ... cycle by cycle" | "compiler schedules computation, data movement and synchronization ahead of time, with no dynamic hardware scheduler at runtime"; plesiosynchronous protocol keeps hundreds of LPUs on one schedule | lpxBlog (T2), spec |
| GS8 | "the model has to fit (or be sharded across multiple LPUs in a rack)" | "Groq spreads it across more LPUs, 256 of which act as one system in an LPX rack" | lpxBlog (T2), spec |
| GS9 | "Llama 4 Scout at 460+ tokens/s at $0.11 / $0.34"; diagram "Llama 4 Scout 460+ tokens/s reported" | "GroqCloud lists gpt-oss-120b at 500 tokens/s for $0.15 per million input tokens and $0.60 per million output tokens"; diagram line removed | groqModels (T2), vendor-claim (speed), spec (price) |
| GS11 | plain `<Link>` to groq.com home, "accessed 2026-04-23" | `Cite` to the GroqCloud models doc | groqModels (T2) |
| GS13 | Alert "What is not public": per-LPU FLOPs, fabric design and scaling envelope "not documented" | Alert "What to verify yourself": no LPU tuning guide or ISA reference located during this research; models page omits serving precision; measure speed and quality yourself | groqModels (T2), spec |
| GS14 | "4th-generation Reconfigurable Dataflow Unit" (CORRECT) | "fourth-generation RDU", marked derived (SN50 is the fifth; the paper never says "fourth") | sn50Blog (T2), derived |
| GS15 | "64 GB of HBM3", "~520 MB", "1.5 TB"; diagram "HBM3 64 GB" | "520 MiB", "64 GiB of HBM", "1.5 TiB"; diagram "HBM 64 GiB" | sn40lPaper (T3), spec |
| GS16 | diagram SRAM "TB/s class", HBM "~3 TB/s", DDR "GB/s class" | SRAM "hundreds of TB/s", HBM "1.8-2 TB/s" (caption names both figures), DDR "over 200 GB/s" | sn40lPaper (T3), spec |
| GS18 | "claimed to deliver 3.7x the performance of an 8-socket DGX H100"; diagram "3.7x DGX H100 (8 sockets)" | "An 8-socket SN40L node measured 3.7x a DGX H100, with model switching 15x to 31x faster" (same wording as Mixture of Experts); diagram line removed | sn40lPaper (T3), measured |
| GS19 | "DDR-attached memory holds cold experts that are paged into HBM and SRAM as routing decisions activate them" | "routes each whole request to one of 150 expert models ... Cold models wait in DDR and load into HBM at over 1 TB/s per node"; diagram "each request is routed to one whole model" | sn40lPaper (T3), spec |
| GS21 | "Both Groq and SambaNova produce the per-token wall-clock time as a property of the compiled schedule" | Groq only: "Groq sets per-token time with the compiled schedule", NVIDIA's jitter and stable-latency statement, Groq's "fully deterministic ... no run-to-run variation". SambaNova: "the SN40L paper makes no determinism claim, and a request for a model not yet in HBM waits for it to load from DDR" | lpxBlog (T2, vendor-claim), groqChipBrief (T2, vendor-claim), sn40lPaper (T3) |
| GS22 | "Section 30", "Section 19" | *Capital Markets Lens*, *Cerebras Wafer-Scale* by name | internal |
| GS23 | tooling paragraph | kept, scoped "No evidence was located during this research", plus "NVIDIA reaches the LPU through Dynamo" | lpxBlog (T2) |
| GS24 | "Neither is currently in EC2" | "Groq hardware reaches other clouds as LPX"; "No AWS deployment of either was located during this research" | lpxProduction (T2), groqModels (T2), sn50Blog (T2), sambanovaSeriesE (T2) |
| GS25 | "Both vendors are thinner than NVIDIA, AWS, and even Cerebras on published architectural detail" | scoped to SambaNova: "the announcement gives no memory capacity or bandwidth, so the SN40L paper stays the architectural reference"; the Groq side moves to the Alert | sn50Blog (T2), sn40lPaper (T3) |

CORRECT claims kept and re-cited: GS1, GS2, GS7, GS8, GS14, GS19, GS23. Title changed to
the nav name "Groq, SambaNova and Dataflow".

## Claims removed and why

- GS12 "For batch-1 inference latency this combination is competitive with wafer-scale":
  CUT candidate (Recommended edit 6), unsupported and contradicted by the 2025 benchmark
  Cerebras Wafer-Scale quotes. Not replaced with the 4.6x derived figure, to avoid a
  dependency on numbers the parallel Cerebras author may restate.
- GS10 diagram "INT8": CUT candidate (Recommended edit 7), no source for production
  precision. The Alert states the models page gives no serving precision.
- "the SRAM-only memory model eliminates the third (HBM round-trips)" and "deterministic
  dataflow eliminates two big sources of variance, cache contention and warp scheduling":
  unsourced mechanism claims; the sourced NVIDIA jitter statement replaces them.
- "Both make their economics by changing the memory access pattern, not by improving
  FLOPs": unsourced framing; the diagram's two "Bet:" lines carry the contrast.
- "Treat production claims as Tier 2 ... verify against third-party benchmarks (Artificial
  Analysis being the cleanest available)": the opinion on Artificial Analysis has no
  source; the Alert keeps the instruction to measure.
- 6.6x DGX A100 (kept in the change report only): older baseline, adds nothing the 3.7x
  H100 figure does not.
- Rack figures 40 PB/s SRAM bandwidth, 640 TB/s scale-up, 315 PFLOPS FP8 and 96 C2C links
  at 112 Gbps: verified, but none changes a reader decision in this section; they stay one
  click away in the LPX blog. Heterogeneity Fact already carries the FP8 rack framing.
- "Marketplace availability ... SambaNova sells appliances and hosted inference": replaced
  by the sourced SambaRack and cloud-capacity statements.

## UNKNOWNs and how the page handles each

- GS10 serving precision on GroqCloud: stated as an absence scoped to the models page.
- GS12 Groq vs wafer-scale latency: removed; no like-for-like comparison was found.
- GS21 SambaNova determinism: the page says the paper makes no determinism claim (verified
  by search of the paper text) and names the DDR-load latency source; it does not say
  SambaNova is non-deterministic.
- GS22 cross-references: resolved by section name.
- SN50 shipments: marked roadmap; "No shipment confirmation was located during this
  research."
- FP8 dense or sparse: no FP8 figure remains in the section.

## NEW content and sources

- NVIDIA Groq 3 LPX inside Vera Rubin, LPX takes decode FFN and MoE expert layers, GPUs
  keep attention over the KV cache, LPX drafts for speculative decoding, Dynamo routes
  between them, full production since August 2026, Nebius first: lpxBlog, lpxProduction.
- 128 GB rack SRAM vs 288 GB HBM4 per Rubin GPU: lpxBlog, veraRubinNvl72, derived (0.44).
- Groq licence, founder and president to NVIDIA, Groq independent and running GroqCloud:
  groqNvidiaLicense.
- First-gen GroqChip 14 nm, 230 MB, 80 TB/s, no external memory, fully deterministic:
  groqChipBrief.
- SN50: fifth generation, tiered memory, five times compute per accelerator vs previous
  generation (vendor-claim), 16 chips per SambaRack, about 20 kW, H2 2026 (roadmap):
  sn50Blog. Intel Capital in the February 2026 Series E and a planned collaboration;
  SambaNova expanding its cloud capacity: sambanovaSeriesE.
- GS17 (SN40L 638 BF16 TFLOPS, 1,040 PCUs, TSMC 5 nm, two dies on CoWoS) was optional and
  is not added: it does not serve the memory-bet comparison, and adding it would push the
  word count further.

## Diagram changes (`DataflowSiliconDiagram.tsx`)

- SVG contract: `role="img"`, `aria-labelledby="dataflow-silicon-title"` with a `<title>`
  stating the assertion; `aria-label` removed; `width`/`height` attributes and
  `preserveAspectRatio` removed; viewBox 880 x 408 only; full-bleed white background rect;
  every font 10 px or larger (the 9 px unit sub-labels are now 11 px); `sans-serif`
  throughout via a `dfs-` prefixed style block.
- Phone convention: wrapped in `<div style={{ overflowX: 'auto' }}>`, svg
  `minWidth: 640, display: block`.
- Groq panel is the Groq 3 LPU in an LPX tray: MXM, VXM, SXM and MEM modules, MEM "500 MB
  SRAM, 150 TB/s", a DRAM box "up to 512 GB per 16-LPU tray" behind the chip, and the Vera
  Rubin split. Removed "all weights in SRAM", "No HBM, no DRAM", "INT8", "Llama 4 Scout".
- SambaNova panel: tier table with column heads, 520 MiB / hundreds of TB/s, 64 GiB /
  1.8-2 TB/s, up to 1.5 TiB / over 200 GB/s; "HBM3" and "~3 TB/s" gone; the DDR-to-HBM load
  rate; Samba-CoE as whole-model routing. "3.7x DGX H100 (8 sockets)" moved to prose with
  the corrected attribution.
- Every number drawn is cited in the caption below the SVG (lpxBlog, sn40lPaper).
- Rendered check (`scripts/shoot.mjs`, built to `/tmp/silicon-dist-groq-sambanova`): probe
  reports "1 SVG diagram(s), 0 React Flow, ok" at 1440 and 390, no overlap, overflow or
  clipping. Read the PNGs: at 1440 both panels are clean, no text crosses a line or box.
  The first render had a 20-unit double-headed arrow whose heads met and read as a
  diamond; the gap was widened to 30 units with smaller markers and the re-shoot is clean.
  At 390 the SVG keeps 640 px and scrolls sideways inside its wrapper; labels stay legible
  and the page has no horizontal overflow.

## Leverage pass

| Block | Reader meaning | Model | Leverage |
| --- | --- | --- | --- |
| What dataflow means | Places both chips against GPU and Trainium | Compiled routes vs runtime warp picking | Read later claims about schedules correctly |
| Two bets (intro) | The section's spine | SRAM-first decode engine beside GPUs; 128 GB vs 288 GB | Know LPX is bought as part of Vera Rubin, not instead of it |
| Diagram + contrast | See both memory bets at once | Same SRAM, different answer for a larger model | Compare tiers by capacity and bandwidth |
| What an LPU is | What the chip holds | SRAM primary, DRAM behind; first gen was SRAM-only | Size what fits per LPU and per tray |
| Work it takes from the GPU | Why the split falls where it does | Capacity-bound work stays on GPUs | Plan disaggregated decode; where to rent (Nebius) |
| What you can call today | The path available now | Groq the company vs Groq the architecture | Price and speed to benchmark against |
| Alert | What the vendor does not tell you | n/a | Measure precision-sensitive quality and speed |
| SN40L, Samba-CoE | Three tiers and whole-model routing | DDR as the cold-model tier | Fit many fine-tuned models on one node |
| SN50 | What is coming and when | n/a | Do not plan on SN50 before shipments |
| Determinism | The capital-markets sentence | Schedule fixed at compile time sets per-token time (Groq) | Which vendor's latency claim to rely on, and its scope |
| Tooling and availability (disclosure) | Integration and location cost | n/a | Library lock-in, cross-cloud networking |
| Where to start | Next action | n/a | Run the benchmark, measure p99.9 end to end |

Claim-set diff (assertions in the after that are not in the before, each with its source):
1. Groq 3 LPX ships in Vera Rubin, built on licensed Groq technology, full production
   since August 2026: groqNvidiaLicense, lpxProduction.
2. In decode LPX runs FFN and MoE expert layers; Rubin GPUs keep attention over the KV
   cache: lpxBlog.
3. Rack holds 128 GB of SRAM, less than half the 288 GB HBM4 of one Rubin GPU: lpxBlog,
   veraRubinNvl72, derived.
4. Groq 3 LPU 500 MB SRAM as primary working storage at 150 TB/s: lpxBlog.
5. 16-LPU tray adds up to 512 GB of DRAM: lpxBlog.
6. First GroqChip 14 nm, built to need no external memory: groqChipBrief.
7. Plesiosynchronous protocol keeps hundreds of LPUs on one schedule: lpxBlog.
8. GPUs keep decode work needing large memory capacity, such as full-context attention
   over the accumulated KV cache: lpxBlog.
9. LPX drafts tokens that the GPUs verify; Dynamo routes work between them: lpxBlog.
10. Nebius is the first AI cloud to adopt LPX: lpxProduction.
11. Founder and president joined NVIDIA; Groq independent, running GroqCloud:
    groqNvidiaLicense.
12. gpt-oss-120b at 500 tokens/s, $0.15 / $0.60 per million tokens: groqModels.
13. Models page omits serving precision; no tuning guide or ISA reference located:
    groqModels (absence scoped to this research).
14. HBM 1.8 to 2 TB/s, DDR over 200 GB/s, SRAM hundreds of TB/s, software-managed tiers,
    DDR-to-HBM load at over 1 TB/s per node, 15x to 31x model switching: sn40lPaper.
15. SN50 fifth generation, five times compute vs previous generation, 16 chips per
    SambaRack, about 20 kW, H2 2026; no memory figures: sn50Blog.
16. Intel Capital in the Series E, planned collaboration, SambaNova expanding cloud
    capacity: sambanovaSeriesE.
17. NVIDIA's reduced-jitter and stable per-token latency statement: lpxBlog
    (vendor-claim). GroqChip "fully deterministic, no run-to-run variation":
    groqChipBrief (vendor-claim).
18. SN40L paper makes no determinism claim; a request for a non-resident model waits for
    the DDR load: sn40lPaper.
19. "Where to start" guidance: built only from 12, 17 and 15 above; "the determinism
    statements describe the chip's execution" restates what the two cited sources cover.

## Checks run

- `tsc --noEmit`: no errors in my files.
- `eslint` on the three files, `--max-warnings 0`: clean.
- `vitest run src/__tests__/sections.test.tsx -t GroqSambanova`: 1 passed.
- `no-ai-tells.sh`, `svg-a11y.sh`, `pinned-refs.sh`: no hits in my files (the gates fail
  on other files).
- `src/__tests__/sources.test.ts` (not edited): title and tier consistency passes for my
  records; the only failure is "keeps sources.md in sync with the registry", which needs
  the orchestrator to regenerate `sources.md`.

## For the orchestrator (shared files)

- Regenerate `sources.md`: new records `groqChipBrief`
  (https://groq.com/product-spec-sheet-groqchip-processor/, T2) and `sambanovaSeriesE`
  (T2), plus GroqSambanovaDataflow added to eight shared records; several shared records
  now carry accessed 2026-10-17.
- Glossary: `SXM` currently means only NVIDIA's GPU module form factor. This section uses
  SXM for the Groq LPU's switch execution module (NVIDIA LPX blog naming), expanded in the
  diagram caption. Add a second sense, or a separate entry.
- Glossary additions: `CoE` (Composition of Experts: routes each request to one of many
  whole expert models; SambaNova Samba-CoE), `MXM` / `VXM` (matrix / vector execution
  module in the Groq LPU), `DDR` (double data rate DRAM; only `DDR5` exists), `ISA`
  is present.
- Glossary `LPU` description "Groq's statically scheduled inference chip" could add "ships
  in NVIDIA Groq 3 LPX for Vera Rubin".
- No cross-link targets added beyond section names in `<em>`: Cerebras Wafer-Scale,
  Disaggregated Serving and Speculative Decoding, Mixture of Experts and Sparse Activation,
  Capital Markets Lens.
