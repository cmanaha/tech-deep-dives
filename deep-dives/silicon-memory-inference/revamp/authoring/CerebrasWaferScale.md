# Change report: CerebrasWaferScale (nav id `cerebras`)

Register: `research/2026-10-refresh/04-other-arch.md`, section 0 ("What changed in the
world") and section 1 (claims CB1 to CB29, Recommended edits 1 to 8).

Files: `src/sections/CerebrasWaferScale.tsx`, `src/components/CerebrasWaferDiagram.tsx`
(now exports `CerebrasWaferDiagram` and `CerebrasLayerSplitDiagram`),
`src/sources/CerebrasWaferScale.ts` (new, 23 records).

Shared records reuse URL, title, publisher and tier exactly: `cerebrasS1`,
`cerebrasSdkBlog`, `cerebrasInferenceBlog` (ThesisAndFraming.ts / HeterogeneityFact.ts),
`wse3Press` (HeterogeneityFact.ts), `cerebrasModels`, `gptOss120bReadme`,
`gptOss120bConfig` (MoeAndSparseActivation.ts), `ocpMx` (QuantizationAndPrecision.ts),
`hopperArchBlog`, `h100Page`, `h200Page`, `blackwellUltraBlog`, `gb300Nvl72`
(NVIDIA section files). The tier-consistency test passes; only the `sources.md` snapshot
test fails, because the new records are not yet in `sources.md` (orchestrator).

Fetched during authoring (records carry 2026-10-17):
- AWS press release (2026-03-13): "to be deployed on Amazon Bedrock in AWS data centers",
  "available exclusively through Amazon Bedrock", "With AWS Trainium optimized for prefill
  and Cerebras CS-3 optimized for decode", "Elastic Fabric Adapter (EFA) networking", "in
  the next couple of months".
- Cerebras blog "Cerebras is coming to AWS" (2026-03-13): "It computes the KV cache and
  sends it to the WSE via Amazon's high-speed EFA interconnect." No Trainium generation
  named.
- AWS Marketplace listing: "Cerebras Fast Inference Cloud", seller Cerebras Systems Inc.,
  SaaS, usage-based, "drop-in API that is compatible with OpenAI".
- Cerebras models overview: shared catalog `gpt-oss-120b` (~3000) and `qwen-3.8-27b`
  (~1,850); more model families through Dedicated Inference. Pricing page renders no
  figures server-side, so price is cited to the model page instead:
  `inference-docs.cerebras.ai/models/openai-oss`: "$0.35 / M tokens" input, "$0.75 / M
  tokens" output, "~3000" tokens/sec; no precision stated.
- NVIDIA InferenceMAX blog (2025-10-09): "60,000 tokens per second per GPU and 1,000 tokens
  per second per user on gpt-oss" (B200, TensorRT-LLM); "6,000 to 30,000 tokens" per GPU at
  100 TPS/user with speculative decoding (GPU not named in that sentence).
- Cerebras Maverick release (2025-05-28): "2,522 tokens per second", "NVIDIA Blackwell's
  1,038", "8 Blackwell GPUs in a DGX B200", "SambaNova 794 t/s, Amazon 290 t/s, Groq 549
  t/s"; no precision stated.
- Cerebras inference blog: "integrate 44GB of SRAM on a single chip", "split them at layer
  boundaries and map them to multiple CS-3 systems", 20B on one CS-3, 70B on "as few as
  four systems", original 16-bit weights, "OpenAI Chat Completions format"; says nothing
  about where the KV cache lives.
- WSE-3 release: "125 petaflops of peak AI performance" (dense or sparse not stated),
  "External memory: 1.5TB, 12TB, or 1.2PB".
- CS-4 blog: "WSE-3 Turbo", "Direct Wafer Links", "as low as 2 microseconds", "The first CS-4
  shipments begin this quarter", prefill pairing with "AMD Helios and AWS Trainium".
- Cerebras chip page: "250 petaflops of AI compute" (dense or sparse not stated).
- gpt-oss-120b README at b5c939d: "117B parameters with 5.1B active parameters", "fit into a
  single 80GB GPU (like NVIDIA H100 or AMD MI300X)".
- Bitget News summary of the 2026-08-12 earnings call: CEO "expected on AWS's Bedrock
  platform in Q1 2027".
- The CS-4 press release on nasdaq.com timed out twice; its figures (43.2 PB/s, three
  wafers per rack, 2 us CS-4 and 5 us CS-3 latency) carry the register's 2026-10-16 access.
- Web search (2026-10-17) for a Bedrock launch: no AWS What's New post or "now available"
  announcement located; consistent with the register.

## Word count

Counter: `/tmp/cerebras-tools/wc.mjs` (copy of the KernelExecutionLifecycle author's
counter: rendered `main` at 1440, every disclosure open, Cite badges, SVG text and code
excluded). **785 before, 1,044 after (+33%).**

Per block, after (before): intro 179 (162), What the silicon looks like 97 (87), What
changes on one wafer 163 (233, then four properties), When the model outgrows one wafer
226 (new h2; absorbs the old MoE and capacity properties and the old "Capacity and model
fit" expandable), Measured and quoted speed 105 (111), Reaching Cerebras from AWS 267 (192
for the three "Where Cerebras struggles" expandables).

Reasons for growth above 20%, per added block:
- CS-4 sentence in the intro (+45): register NEW CB28 and recommended edit 1.
- Ridge paragraph (+40 over the old "No bandwidth wall" property): CB12 is WRONG; the fix
  needs the two inputs, the batch-1 intensity and the GPU comparison to land the model.
- Capacity and wafer-count paragraphs (+70 over the old capacity property and expandable):
  CB15 and CB16 fixes; the gpt-oss-120b worked example is what shows a catalog model
  leaving one wafer, and "Count wafers before you price" is the practical hook.
- Bedrock paragraph (+60 over the old "Marketplace and supply" text): CB27 and edit 5,
  including status and the KV transfer over EFA.
- Supply paragraph (+40): register NEW CB29.
A first draft reached 1,211 words and was cut back: the duplicated layer-split statement
in the intro, the CUDA library list, the GB200 NVL72 figure, the WSE-3T sentence under the
diagram (the diagram subtitle carries it), and longer h2 descriptions.

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| CB1 | "~900,000 individual cores and ~44 GB of SRAM" | "900,000 cores and 44 GB of SRAM (static RAM) on the same silicon" | cerebrasS1 (T1, spec) |
| CB2 | "~46,225 mm²" | "one 46,225 mm² die" | cerebrasS1 (T1, spec) |
| CB3 | "roughly 57x the area of a flagship GPU die"; diagram "GPU die: ~800 mm²", "~57x a flagship GPU die" | "about 57x an H100 die of 814 mm²"; diagram draws the H100 die at the same scale, labelled 814 mm² | hopperArchBlog (T2, derived 46,225 / 814 = 56.8) |
| CB4 | "no HBM, no DDR, and no external memory in the steady-state inference path. The model is in SRAM." | "Inference keeps the weights in that SRAM; training adds up to 1.2 PB of external memory." Layer split stated in the spine paragraph | cerebrasInferenceBlog (T2), wse3Press (T2, spec) |
| CB5 | "tens of petabytes per second"; diagram "21 PB/s" | "21 PB/s"; CS-4 sentence and diagram subtitle add 43.2 PB/s for WSE-3T | cerebrasS1 (T1), cs4Press (T2, spec) |
| CB6 | "about three orders of magnitude over a Blackwell GPU's HBM3e" | "2,625x the HBM bandwidth of a B200", noted as Cerebras's own comparison | cerebrasS1 (T1, spec with note) |
| CB7 | Cerebras home page link, accessed 2026-04-23 | S-1 and the press releases, per figure | cerebrasS1 (T1) and others |
| CB8 | "Put them in the same wafer and the wall does not exist." | "the bandwidth wall becomes a capacity wall: a model larger than 44 GB is split at layer boundaries across wafers, and the links between wafers become the network to plan around" | cerebrasInferenceBlog (T2) |
| CB10 | "4-8 HBM stacks around it on a silicon interposer"; diagram "HBM stacks: 80-288 GB total" | "HBM stacks beside the die on a silicon interposer: 80 GB on an H100, 288 GB in eight stacks on a B300"; diagram same figures | h100Page (T2), blackwellUltraBlog (T2, spec) |
| CB11 | "Each core has its own SRAM and a connection to its neighbors" | "each core owns 48 kB of SRAM that no other core uses and talks to its neighbours over a two-dimensional mesh; 900,000 cores at 48 kB is about 43 GB" | cerebrasSdkBlog (T2, spec; derived 43.2 GB) |
| CB12 | "ridge point ... moves so far left that decode is compute-bound" | "a ridge of about 6 FLOP per byte. Batch-1 decode in BF16 does about 1 FLOP per weight byte, so it still sits below the ridge; the weight matmuls cross it at a batch of about six, where an H200 in FP8 needs about 200. The WSE-3T doubles compute and bandwidth together, so its ridge stays near 6." | wse3Press (125 PFLOPS, dense/sparse not stated), cerebrasS1 (21 PB/s, derived ridge), h200Page (derived, note cites Thesis and Framing's 412), cs4Press |
| CB13 | "no global scheduler, no cache hierarchy, no warps. The program is the schedule." | "The compiler places the program on specific cores and fixes the routes through the fabric; at run time a core runs a task when its data arrives. With each core's 48 kB private, there is no cache hierarchy to tune and no warps to keep occupied." | cerebrasSdkBlog (T2, spec) |
| CB14 | "Closer to Trainium's NEFF model than to a GPU, but spread across nearly a million cores instead of dozens of SMs" | "As with a Trainium NEFF (Neuron Executable File Format), placement is settled before the model runs." ("dozens of SMs" dropped: current GPUs have 132 or more) | analogy, no number |
| CB15 | "All experts live on-wafer ... no HBM and no network in the path" | "Each layer sits whole on one wafer, so an MoE layer's router and experts share that wafer's SRAM and a token's trip to its expert never leaves it. Only the activation hand-off between layer groups crosses wafers." Same wording family as Mixture of Experts and Sparse Activation | cerebrasInferenceBlog (T2, derived from the layer-boundary split) |
| CB16 | "70B ... must be quantized or ... multi-CS-3 cluster" | "At 16-bit weights one wafer holds a 20B-parameter model; a 70B model runs on as few as four systems, split at layer boundaries." | cerebrasInferenceBlog (T2, spec) |
| CB17 | "chain wafers ... over inter-system links" | CS-4: three WSE-3T per rack, wafer-to-wafer latency as low as 2 us (5 us on CS-3); new layer-split diagram | cs4Press (T2), cs4Blog (T2, spec) |
| CB18 | Maverick row linked to the Artificial Analysis home page | Row dated "May 2025, since retired from the catalog", cited to the Cerebras press release, kind `measured` with a note that the figures are Artificial Analysis's, quoted by Cerebras, and that NVIDIA's is a DGX B200 | maverickPress (T2, measured), cerebrasModels (T2) |
| CB19 | Qwen3-235B-A22B "$0.60 / $1.20 per Mtok" | gpt-oss-120b "About 3,000 tokens/s; $0.35 in and $0.75 out per million tokens" | cerebrasGptOssPage (T2, vendor-claim for speed, spec for price) |
| CB20 | "NVIDIA-cited 60,000 TPS/GPU max throughput" | "B200, TensorRT-LLM: up to 60,000 tokens/s per GPU, or 1,000 per user", note gives the 30,000 per GPU at 100 tokens/s per user point; prose sets NVIDIA's 1,000 per user against Cerebras's about 3,000 | inferenceMaxBlog (T2, vendor-claim), cerebrasGptOssPage (T2, vendor-claim) |
| CB21 | Column header "Cerebras (third-party measured)" | "Cerebras"; only the Maverick row is marked measured | n/a |
| CB22 | Alert: "SambaNova at 794, and Groq at 549 (May 2025)" | One sentence under the table, cited and marked measured, linking Groq, SambaNova and Dataflow | maverickPress (T2, measured) |
| CB24 | "288 GB ... B300 ... 13.4 TB / 20 TB ... NVL72" | "A CS-4 rack holds 132 GB of SRAM; one B300 holds 288 GB of HBM3e and a GB300 NVL72 20 TB." | cs4Press (derived 3 x 44), blackwellUltraBlog, gb300Nvl72 (T2, spec) |
| CB25 | Software ecosystem paragraph | Shortened; adds that the API follows the OpenAI Chat Completions format, so client code ports and the gap bites on custom kernels and models outside the catalog | cerebrasInferenceBlog (T2) |
| CB26 | "sold as inference-as-a-service and as on-premises systems" | "Cerebras sells on-premises systems and cloud inference" | cerebrasS1 (T1) |
| CB27 | "AWS does not currently host CS-3 in EC2 ..." | Bedrock announcement (CS-3 in AWS data centers, exclusively through Bedrock rather than EC2, Trainium prefill, CS-3 decode, EFA, "in the next couple of months"), status ("This research located no AWS launch announcement as of 2026-10-16"; CEO expects Q1 2027 per a trade-press summary), and the AWS Marketplace listing as today's path | awsCerebrasPress (T2), cerebrasAwsBlog (T2), earningsCallSummary (T3), awsMarketplaceListing (T2), cerebrasModels (T2) |

## Claims removed

- CB9 "experts in on-wafer SRAM switch in nanoseconds, not microseconds" (CUT candidate,
  UNKNOWN, misleading for multi-wafer models).
- CB23 the causal sentence in the Alert ("not a marketing artifact; it is a direct
  consequence of skipping the HBM-and-fabric round trip") (CUT candidate; no source
  attributes the gap to a cause). The Alert itself went; its numbers moved into the table
  and the sentence under it.
- Old "Section 23" and "Section 6" numeric cross-references (replaced by section names).
- "dozens of SMs" (wrong for current GPUs; not needed for the NEFF analogy).
- GB200 NVL72's 13.4 TB (cut for length; GB300 NVL72's 20 TB carries the comparison).
- "GPU-to-HBM bandwidth is high (TB/s class)" and "the HBM PHY" (no number to cite; the
  diagram and the 2,625x figure carry the point).

## UNKNOWNs and how the page handles them

- Dense or sparse for 125 PFLOPS (WSE-3) and 250 PFLOPS (WSE-3T): the cite note says
  "Cerebras does not state whether this peak is dense or sparse." The ridge is labelled
  derived.
- Where the KV cache lives on a wafer: stated as a silence scoped to the Cerebras inference
  blog, and used to make the wafer count a floor.
- Serving precision for gpt-oss-120b on Cerebras: "the Cerebras model page states no
  serving precision"; the 62 GB lower bound uses the published MXFP4 checkpoint.
- Definition of Cerebras's tokens/s figure: the cite note says "Our reading: Cerebras lists
  one speed per model without defining it, so it compares with NVIDIA's per-user figure."
- Bedrock launch date: scoped hedge (no AWS launch announcement located as of 2026-10-16)
  plus the Tier 3 earnings-call summary, attributed in the sentence because the grade
  matters.
- CS-4 shipments: "first shipments planned for that quarter" (the announcement's wording);
  shipment was not confirmed.

## NEW content

- CS-4 / WSE-3T (CB28): cs4Press, cs4Blog.
- Revenue concentration (CB29): cerebrasS1, plus the reader action "Get dedicated capacity
  committed in the contract."
- KV transfer in the Bedrock design: cerebrasAwsBlog (fetched), linked to Disaggregated
  Serving and Speculative Decoding.
- gpt-oss-120b worked example (fits one 80 GB H100, needs at least 62 GB, so more than one
  wafer): gptOss120bReadme, gptOss120bConfig, ocpMx (T1, derived).
- "Count wafers before you price" and "Each wafer boundary adds at least 2 us to every
  token" (derived from the layer split and cs4Blog's latency floor).
- Marketplace listing and shared catalog (awsMarketplaceListing, cerebrasModels), ending on
  the action: point an OpenAI client at it and measure at your own concurrency.

## Diagram

`CerebrasWaferDiagram` rewritten: `aria-label` replaced with `aria-labelledby` and a
`<title>` stating the assertion; `viewBox` only; full-bleed white background; all fonts 10
to 13 px `sans-serif`; no em-dashes. The WSE-3 square and the H100 die are drawn to scale by
area (280 and 37 units a side, from 46,225 and 814 mm²); the GPU package is labelled
"schematic, not to scale" (the old diagram said "for scale" but was not). Labels: 900,000
cores, 48 kB each, 21 PB/s, 43.2 PB/s for WSE-3T in the subtitle (the diagram stays WSE-3
and says so), 80 GB H100 and 288 GB B300. Grid cells under the centre label are skipped so
no text sits on a cell.

`CerebrasLayerSplitDiagram` is new (leverage pass, question 2: the section's spine needed a
picture): three wafers holding whole layer groups, each with "router + every expert", and
green activation arrows between them labelled "2 us or more"; the caption under it cites
2 us (CS-4) and 5 us (CS-3).

Both follow the wide-diagram phone convention (`overflowX: 'auto'` wrapper, svg `minWidth:
640`).

Rendered check (`scripts/shoot.mjs`, 1440 and 390): the first run flagged a box-overflow
on "900,000 cores" (its centre fell inside a grid cell); fixed by skipping cells under the
label. Final run: "ok" at both widths. PNGs read at both widths: no text crossing lines,
arrow labels sit above and below the arrows within the 80-unit gap, labels readable at 390
with sideways scroll; page has no horizontal overflow outside the diagram scrollers.

## Leverage pass: claim-set diff

New assertions in the after that were not in the before, each with its source:
1. WSE-3 is 57x an H100 die of 814 mm² (hopperArchBlog, derived).
2. 2,625x a B200's HBM bandwidth (cerebrasS1).
3. Training adds up to 1.2 PB of external memory (wse3Press).
4. CS-4: August 2026, first shipments planned that quarter, three WSE-3T per rack, 250
   PFLOPS and 43.2 PB/s per wafer, same cores and 44 GB, as low as 2 us (cs4Press,
   cerebrasChip for 250 PFLOPS, cs4Blog).
5. Models above one wafer split at layer boundaries (cerebrasInferenceBlog).
6. 80 GB on an H100 (h100Page); 288 GB in eight stacks on a B300 (blackwellUltraBlog).
7. 48 kB private SRAM per core, 2D mesh, 900,000 x 48 kB about 43 GB (cerebrasSdkBlog,
   derived).
8. 125 PFLOPS, ridge about 6 FLOP/byte, batch-1 BF16 decode at about 1 FLOP/byte, crossing
   at a batch of about six, H200 FP8 about 200, WSE-3T ridge unchanged (wse3Press,
   cerebrasS1, h200Page, cs4Press, all derived where arithmetic).
9. Compiler fixes routes; tasks fire on data arrival (cerebrasSdkBlog).
10. 20B on one wafer and 70B on as few as four systems at 16 bits (cerebrasInferenceBlog).
11. 5 us wafer-to-wafer latency on CS-3 (cs4Press).
12. Expert routing stays on one wafer; activations cross wafers (cerebrasInferenceBlog,
    derived).
13. gpt-oss-120b: 117B parameters, fits one 80 GB H100 (gptOss120bReadme); at least 62 GB at
    4.25 bits (gptOss120bConfig, ocpMx, derived); model page states no precision
    (cerebrasGptOssPage).
14. CS-4 rack 132 GB of SRAM (cs4Press, derived); GB300 NVL72 20 TB (gb300Nvl72).
15. The Cerebras inference blog does not say where the KV cache lives (cerebrasInferenceBlog,
    checked on fetch); each wafer boundary adds at least 2 us per token (cs4Blog, derived).
16. gpt-oss-120b about 3,000 tokens/s and $0.35 / $0.75 per million tokens
    (cerebrasGptOssPage); NVIDIA 60,000 per GPU and 1,000 per user, 30,000 at 100 per user
    (inferenceMaxBlog, vendor-claim).
17. Maverick NVIDIA figure is a DGX B200 (maverickPress); Maverick no longer in the
    catalog (cerebrasModels).
18. Bedrock announcement content and the "in the next couple of months" quote
    (awsCerebrasPress); Trainium sends the KV cache to the wafer over EFA
    (cerebrasAwsBlog); no AWS launch announcement located as of 2026-10-16 (register plus a
    2026-10-17 web search); CEO expects Q1 2027 (earningsCallSummary, T3).
19. API follows the OpenAI Chat Completions format (cerebrasInferenceBlog); Marketplace
    listing is usage-billed and OpenAI-compatible (awsMarketplaceListing); shared catalog
    is gpt-oss-120b and qwen-3.8-27b, other models through Dedicated Inference
    (cerebrasModels).
20. MBZUAI 62%, G42 24% of 2025 revenue; OpenAI agreement more than $20 billion for 750
    megawatts; Cerebras sells on-premises and cloud inference (cerebrasS1).

Inferences labelled as ours: "Our reading" on the tokens/s unit; `derived` on every
arithmetic result and on "expert routing stays on one wafer"; "the links between wafers
become the network to plan around" is framing built from items 4, 5 and 11.

## Orchestrator actions

- Regenerate `sources.md` (new records: cs4Press, cs4Blog, cerebrasChip,
  cerebrasGptOssPage, maverickPress, inferenceMaxBlog, awsCerebrasPress, cerebrasAwsBlog,
  awsMarketplaceListing, earningsCallSummary; shared records gain CerebrasWaferScale).
  The `sources.md` snapshot test fails until then.
- Glossary: acronyms used here are already present (WSE, SRAM, HBM, BF16, MXFP4, MoE,
  NEFF, EFA, KV cache). MBZUAI (Mohamed bin Zayed University of Artificial Intelligence) is
  expanded inline; add it if the glossary lists organisations.
- Cross-links by name: Roofline and Arithmetic Intensity is not linked from this section
  any more (Roofline already links here); Mixture of Experts and Sparse Activation, Groq,
  SambaNova and Dataflow, and Disaggregated Serving and Speculative Decoding are.
- For Cross-section notes: Cerebras ridge is about 6 FLOP/byte on both WSE-3 (125 PFLOPS /
  21 PB/s) and WSE-3T (250 / 43.2), dense or sparse not stated. gpt-oss-120b at its MXFP4
  checkpoint needs at least 62 GB, more than one 44 GB wafer. Bedrock-on-Cerebras is
  announced, not launched (no AWS announcement located as of 2026-10-16).
