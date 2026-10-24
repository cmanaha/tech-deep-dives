# Verification: Compute-in-Memory

Verified: 2026-10-23. Claims checked: 44 (sampled: 0, every claim verified). Confirmed 39,
wrong 2, unsupported 2, mislabelled 0, unverifiable 0. One further item (C10, the diagram's
single-stack drawing) was a scope error carried by the WRONG verdict on C9 and fixed with it.

Sources read on 2026-10-23, all with default request headers and no personal data: Hot Chips 35
slides PDF (pdftotext plus page renders of slides 3, 12 and 15), Hot Chips 33 slides PDF
(pdftotext plus renders of slides 8, 9 and 13), d-Matrix Corsair product brief PDF, d-Matrix
product page, SK hynix CES 2026 release, IEEE Micro abstract (University of Illinois Experts
page), DeepSeek-V3 `config.json` at the pinned revision, JEDEC press release and JC-42.6 page
(through the `r.jina.ai` reader, as the register did; jedec.org refuses direct fetches), Samsung
2021 release (live site timed out twice; read from the Internet Archive capture of 2025-12-28).

## Gate 3 score: 8/10
The section now builds the model it promises: a DRAM fetch costs about 200x the MAC, in-bank units
see 4x the host's bandwidth so the wall moves out by a fixed ratio, and the Samsung, d-Matrix and
JEDEC blocks each end in something the reader can ask or check. Every figure traced to its source;
the four failures were scoping errors (four-stack totals drawn as one stack, one PIM unit per two
banks, a GEMV range attributed to one profile, an energy figure narrowed to GEMV), none changed the
section's conclusion, and all are fixed. Economy holds it at 8: the +38% is register-driven, but
three status facts and the "wall moves out" line are each said twice.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 8 | 39 of 44 confirmed as written; 2 wrong and 2 unsupported, all scope errors, all fixed; the 200x, GPT-J and MoE figures that carry the section are exact |
| Mental model or practical value | 8 | 200x fetch cost, 4x wall shift, GEMV-shaped experts at small batch, Corsair's 2 GB question, the JEDEC ask; no block does neither |
| Shape | 8 | Introduces CIM before mechanism, h2 descriptions name the payoff, 200x lands in the intro, diagram and MoE ExpandableSection, ends on asking vendors about LPDDR6 PIM |
| Writing | 8 | No AI tells (gate clean); "Samsung measured" attributions mark vendor-measured figures, a load-bearing case; things defined by what they are |
| Economy | 7 | About 1,240 words (+38%), growth tied to register items CM13, CM26 to CM28; repeats: d-Matrix "no deployment scale" (Corsair paragraph and close), AiMX "prototype" (twice), "wall moves out by that ratio" (architecture paragraph, wins bullet, diagram) |
| Diagrams | 8 | Inline SVG, role="img" with a prose title, no overlap at 1440, 640 px sideways scroll at 390 per the dive convention, every drawn number cited in the text |

## Claims

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| C1 | DRAM operand fetch about 200x the MAC energy | samsungPimHc35 | CONFIRMED | Slide 3 "Normalized Energy Cost*": "ALU 1 x (Reference)", RF "1x", PE "2x", "100 - 500 kB Buffer 6x", "DRAM 200 x"; "Source: * Y.-H. Eyeriss, 2016 ISCA" | - |
| C2 | 6x from an on-chip buffer, 1x from a register file | samsungPimHc35 | CONFIRMED | Slide 3, same chart (buffer 100-500 kB 6x; RF 0.5-1.0 kB 1x) | - |
| C3 | Diagram bars 1x / 6x / 200x "to scale; the MAC itself is 1x" | samsungPimHc35 (text) | CONFIRMED | Slide 3. Bars are width x/200 x 210 px: 200x = 210 px, 6x = 6.3 px, 1x clamped to a 2 px minimum (drawn at about 2x so it stays visible). Samsung's own chart breaks the 200x bar; this one does not, so it is the more honest picture | - |
| C4 | Note: neighbouring PE 2x, Eyeriss ISCA 2016 named as Samsung's source, Eyeriss not read | samsungPimHc35 | CONFIRMED | Slide 3 footnote | - |
| C5 | GEMV "60 to 80% of generation latency" profiled "for GPT-J 6B on an A100" | samsungPimHc35 | UNSUPPORTED (as attributed) | Slide 7 bullet: "GEMV portion can be 60-80% of total generation latency"; the slide's own profile "(DeepSpeed + GPT-J 6B, FP16, Input/Output token:7/46)" on A100 shows GEMV_GEN latency "82.27"; slide 9: "GEMV accounts for 82.3% of total computation time (GPU)". The range is the general bullet, not the GPT-J measurement | Split: Samsung puts GEMV at 60 to 80%; its GPT-J 6B A100 profile measured 82% |
| C6 | GEMV at batch 1 uses each weight for one MAC | - | CONFIRMED (definition) | - | - |
| C7 | Wider HBM buses move bytes faster, cross-link by name | - | CONFIRMED | Title matches `src/sectionTitles.ts` | - |
| C8 | 4.92 TB/s bank-level vs 1.23 TB/s host, 4x | samsungPimHc33 | CONFIRMED | Slide 13: "Off-chip and on-chip PIM compute bandwidth is 1.23 TB/s and 4.92 TB/s, respectively." 4.92 / 1.23 = 4.0 | - |
| C9 | "On Samsung's Aquabolt-XL" (figures read as the part's own) | samsungPimHc33 | WRONG (scope: per GPU, not per stack) | Slide 13 picture: the GPU carries "4-HBM-PIM stacks"; slide 7: one HBM2 stack gives "more than 256GB/s". 1.23 TB/s is four stacks (about 307 GB/s each at Aquabolt's rate, [SPECULATIVE] arithmetic), so it is the GPU's host link, not one stack's | Page: "On a GPU carrying four of Samsung's Aquabolt-XL stacks"; cite note states the four-stack scope |
| C10 | Diagram: "HBM2-PIM stack (Aquabolt-XL)" with "host link: 1.23 TB/s" (one stack drawn) | text | WRONG (same scope error) | As C9 | Diagram label "Aquabolt-XL HBM2-PIM, four stacks"; title says "a GPU's four stacks" |
| C11 | Built by modifying Aquabolt HBM2; "the first demonstrator vehicle of PIM" | samsungPimHc33 | CONFIRMED | Slide 5: "The first demonstrator vehicle of PIM is based on HBM2 Aquabolt"; slide 13: "Implemented PIM by modifying a commercial HBM2 design (Aquabolt)" | - |
| C12 | "Each bank gets a programmable unit at its I/O boundary" | samsungPimHc33 | WRONG | Slide 9 "PIM Microarchitecture": one unit sits between an "Even Bank Interface" and an "Odd Bank Interface"; slides 8 and 13 draw each PIM unit between a bank above and a bank below (die photo rows "Even / PIM / Odd"). Slide 8's bullet ("at the I/O boundary of a bank") and the 2021 release ("inside each memory bank") are looser than the drawings | "Each pair of banks, one even and one odd, shares a programmable unit"; diagram subtitle "One unit per two banks", cells "2 banks" |
| C13 | 16-lane FP16 SIMD array of multipliers and adders | samsungPimHc33 | CONFIRMED | Slide 9: "A 16-lane FP16 SIMD FPU array: a pair of 16 FP16 multipliers and adders" | - |
| C14 | Keeps Aquabolt's form factor and timing; drop-in | samsungPimHc33 | CONFIRMED | Slide 8: "Maintain the same form-factor and timing parameters as baseline Aquabolt product"; "drop-in replacement of JEDEC-specification compliant Aquabolt HBM2" | - |
| C15 | Ordinary read/write commands step a stored program; unmodified HBM controller | samsungPimHc33 | CONFIRMED | Slide 8: "DRAM RD/WR command triggers execution of a PIM instruction in PIM mode"; slide 9: "External data (CAS) commands increase CRF PC"; slide 13: "Validated fabricated HBM-PIM in system with unmodified HBM controller" | - |
| C16 | Validated with a GPU and an FPGA | samsungPimHc33 | CONFIRMED | Slide 13: "Integrated the fabricated Aquabolt-XL with an unmodified GPU and Xilinx FPGA". Slide 17 adds that the FPGA build used a "custom memory-controller setting" (a configuration, not a new controller) | - |
| C17 | "a memory and software change, with no new memory controller" [derived] | samsungPimHc33 | CONFIRMED | Follows from C15; slide 12: "Developed PIM SW stack to allow users to run unmodified source code" | - |
| C18 | 8.9x GEMV microkernel, 3.5x speech, GPU host | aquaboltIeeeMicro | CONFIRMED | Abstract: "A graphics processing unit (GPU) system equipped with Samsung Aquabolt-XL HBM2-PIM devices improved microkernel general matrix-vector multiplication and speech recognition applications by 8.9x and 3.5x, respectively" | - |
| C19 | 2.54x LSTM layer on Alveo U280 FPGA host | aquaboltIeeeMicro, samsungPimHc33 | CONFIRMED | Abstract: "In a Xilinx AlveoU280 system ... long short-term memory workload improved by 2.54x"; slide 18: "GEMV 2.82x, Add 2.85x, LSTM* 2.54x" | - |
| C20 | Note: Hot Chips 33 gives 11.2x GEMV | samsungPimHc33 | CONFIRMED | Slide 14: "Performance Gain: 11.2x (Microkernel GEMV) and 3.5x (Speech Recognition Application)" | - |
| C21 | Tier/kind: IEEE Micro Tier 3 `measured`, "Samsung-authored" | aquaboltIeeeMicro | CONFIRMED | Tier 3 per the paper rule; 13 of 14 listed authors are Samsung, the fourteenth (N. S. Kim) is listed by UIUC. "Samsung's own measurements" stands | - |
| C22 | 96 MI100-PIM GPUs, 12 nodes, 200G InfiniBand; note 8 per node, 24 GB (4 stacks) | samsungPimHc35 | CONFIRMED | Slide 13: "Total 96 MI100-PIM GPUs in a cluster", "12 nodes interconnected through 200G InfiniBand network", "8 MI100-PIM GPUs per node", "Capacity : 24GB (4 cubes)" | - |
| C23 | GPT-J runs take 32 input tokens, single GPU, vs ordinary HBM | samsungPimHc35 | CONFIRMED | Slide 12: "GPT-J (6B, 32 input tokens), single AMD MI100-PIM GPU"; "compared to the GPU with a normal HBM" | - |
| C24 | GPT-J 64 out: 2.16x speed-up, 1.79x energy efficiency | samsungPimHc35 | CONFIRMED | Slide 12 render: energy chart (32, 64) 1.79x; performance chart (32, 64) 2.16x. The register's pairing was reversed; the page is right | - |
| C25 | GPT-J 256 out: 2.33x speed-up, 2.24x energy efficiency | samsungPimHc35 | CONFIRMED | Slide 12 render: (32, 256) 2.24x energy, 2.33x speed-up | - |
| C26 | T5-MoE 32 GPUs: 2.71x speed-up, 3.61x energy | samsungPimHc35 | CONFIRMED | Slide 15 render: "32 MI100 GPUs" 3.61x energy, 2.71x speed-up | - |
| C27 | T5-MoE 64 GPUs: 2.06x speed-up, 2.88x energy | samsungPimHc35 | CONFIRMED | Slide 15 render: "64 MI100 GPUs" 2.88x energy, 2.06x speed-up | - |
| C28 | "MoE gain shrinks from 2.71x to 2.06x as the cluster doubles from 32 to 64 GPUs" | samsungPimHc35 | CONFIRMED | Slide 15 | - |
| C29 | GPT-J gain grows with output length (decode-side prediction) [derived] | samsungPimHc35 | CONFIRMED | 2.16x to 2.33x per slide 12; slide 8: "As # of output tokens increases, GEMV operations dominate the inference time" | - |
| C30 | T5-large, DeepSpeed MoE replacing T5LayerFF; experts across GPUs, one process per GPU, ROCm collectives | samsungPimHc35 | CONFIRMED | Slide 14: "DeepSpeed MoE replaces 'T5LayerFF' layers to accelerate T5-large model with PIM"; "Each process is mapped to a GPU"; "ROCm collective communication library" | - |
| C31 | Only expert FFN layers in PIM, gain capped by their share; router and inter-GPU traffic do not speed up | samsungPimHc35 | CONFIRMED (derived from slide 14) | Slide 14: "The MoE layers are updated to use our PimPyLibrary APIs" (Dense to PimDense, Relu to PimRelu); nothing else is moved | - |
| C32 | 2023 results, "no independent replication was located during this research" | samsungPimHc35 | CONFIRMED (hedge scoped) | - | - |
| C33 | DeepSeek-V3: 8 of 256 routed experts | deepseekV3Config | CONFIRMED | `"n_routed_experts": 256`, `"num_experts_per_tok": 8` at e815299 (pinned) | - |
| C34 | 8/256 = 1/32; batch of 32 gives each expert about one token [derived] | deepseekV3Config | CONFIRMED | 32 x 8 / 256 = 1 | - |
| C35 | Corsair: PCIe Gen5 x16, 2,048 DIMC cores | dmatrixCorsairBrief | CONFIRMED | Table 1: "DIMC compute cores 2048"; "PCIe Gen5 x16: 128 GB/s bi-directional" | - |
| C36 | 2 GB at 150 TB/s; up to 256 GB at 400 GB/s; 600 W | dmatrixCorsairBrief | CONFIRMED (vendor-claim, single card) | Table 1: "Performance Memory 2 GB", "Performance Memory bandwidth 150 TB/s", "Capacity Memory Up to 256 GB", "Capacity Memory bandwidth 400 GB/s", "TDP 600 W". Brief is (c) 2024 | - |
| C37 | 375x tier gap [derived] | dmatrixCorsairBrief | CONFIRMED | 150,000 / 400 = 375 | - |
| C38 | Compute sits in the small fast tier | dmatrixCorsairBrief | CONFIRMED | "The integrated Performance Memory of the on-chip memory-compute complex ... 150 TB/s"; "In Performance Mode, Gen AI models fit in Performance Memory" | - |
| C39 | Product page gives no deployment scale; Aviator | dmatrixProduct | CONFIRMED (silence scoped to the page) | Page offers "Request Early Access" and "Contact Sales", no customer or unit count; "Aviator is purpose-built for Corsair. From compiler to runtime" | - |
| C40 | AiMX at CES 2026, accelerator card prototype on GDDR6-AiM, for LLMs; `roadmap` | skhynixCes2026 | CONFIRMED | Footnote: "Accelerator-in-Memory based Accelerator (AiMX): SK hynix's accelerator card prototype featuring a GDDR6-AiM chip which is specialized for large language models (LLMs)" | - |
| C41 | "over 60%" energy reduction; 2021 release "more than 70%" | aquaboltIeeeMicro, samsungHbmPimRelease | CONFIRMED (figure) / UNSUPPORTED (scope) | Abstract: "reduced energy consumption by over 60%", stated for the GPU system, not per operation or for GEMV kernels. Release (2021-02-17): "reducing energy consumption by more than 70%" (also HC33 slide 6) | Dropped "per operation ... on GEMV-class kernels"; now "Energy falls by more than half: Samsung measured over 60% less on its GPU system with Aquabolt-XL" |
| C42 | LPDDR-PIM concept "up to 8x" | samsungPimHc35 | CONFIRMED | Slide 20: "Utilize up to 8x higher in-DRAM bandwidth by multi-bank parallel operation" | - |
| C43 | Samsung PIM Runtime Library and PIM AI Compiler under PyTorch and TensorFlow | samsungPimHc35 | CONFIRMED | Slide 16: "Support existing AI frameworks (e.g., PyTorch and TF)"; "PIM Runtime Library"; "PIM AI Compiler" | - |
| C44 | JEDEC LPDDR6 PIM "nearing completion" (2026-04-22), edge and data-center inference, `roadmap` Tier 1; JC-42.6 lists JESD209-6 (Jul 2025) and no PIM standard | jedecLpddr6Pim, jedecJc426 | CONFIRMED | Release dated "APRIL 22, 2026": "nearing completion of a standard for LPDDR6 Processing-in-Memory (LPDDR6 PIM) technology ... of edge and data-center inference workloads". JC-42.6 "Recent Documents": "JESD209-6 LPDDR6 Standard Jul 2025", no PIM entry. Tier 1 matches the orchestrator's standards-body ruling | - |

HyperCIM: absent from the section, the diagram, the source file, and every other file under
`src/` and `sources.md` (grep, case-insensitive, also for "LPU" in my files). Verdict: CONFIRMED absent.

## ORCH-NOTES items

ORCH-NOTES.md carries no item for this section. The caller's items:

- 200x figure and the 1x / 6x bars: CONFIRMED (C1 to C4). Slide 3 cites Eyeriss; the page says so
  and says Eyeriss was not read. The diagram bars are to scale (1x clamped to 2 px).
- GPT-J pairing: CONFIRMED the author's reading against the rendered slide 12: 2.16x / 1.79x at
  64 output tokens, 2.33x / 2.24x at 256. The register's pairing is reversed. Every table figure
  (C24 to C27) and the 2.71x to 2.06x statement (C28) match slides 12 and 15.
- Aquabolt-XL: HBM2-PIM CONFIRMED; 4.92 vs 1.23 TB/s CONFIRMED as figures but WRONG in scope as
  drawn (four-stack GPU totals, fixed, C9 and C10); 8.9x / 3.5x GPU and 2.54x U280 CONFIRMED;
  "over 60%" CONFIRMED as a figure, its "per operation on GEMV-class kernels" scope UNSUPPORTED
  and fixed (C41). Bank-unit ratio corrected to one unit per two banks (C12).
- d-Matrix Corsair: CONFIRMED and marked vendor-claim (C35 to C39). SK hynix AiMX: CONFIRMED,
  marked roadmap (C40). JEDEC LPDDR6 PIM: CONFIRMED, Tier 1, roadmap (C44).
- HyperCIM: CONFIRMED absent.
- Length +38%: judged under Economy below.

## Fixes applied

- `src/sections/ComputeInMemory.tsx:83-89` (C5). Before: "Samsung profiled GEMV at 60 to 80% of
  generation latency for GPT-J 6B on an A100." After: "Samsung puts GEMV at 60 to 80% of generation
  latency, and in its profile of GPT-J 6B on an A100 GEMV took 82% of the latency." Note now quotes
  the slide 7 bullet, the slide 7 profile (82.27%) and slide 9 (82.3%).
- `src/sections/ComputeInMemory.tsx:111-118` (C9). Before: "On Samsung's Aquabolt-XL the bank-level
  units see 4.92 TB/s where the host sees 1.23 TB/s". After: "On a GPU carrying four of Samsung's
  Aquabolt-XL stacks, the bank-level units see 4.92 TB/s where the host sees 1.23 TB/s". Note states
  the slide 13 four-stack picture and slide 7's per-stack "more than 256GB/s".
- `src/sections/ComputeInMemory.tsx:138-141` (C12). Before: "Each bank gets a programmable unit at
  its I/O boundary". After: "Each pair of banks, one even and one odd, shares a programmable unit at
  the banks' I/O boundary".
- `src/sections/ComputeInMemory.tsx:295-296` (C41). Before: "Energy per operation falls by more than
  half on GEMV-class kernels: Samsung measured over 60% less on its GPU system." After: "Energy falls
  by more than half: Samsung measured over 60% less on its GPU system with Aquabolt-XL."
- `src/components/CimDiagram.tsx` (C10, C12). Title: "a unit beside each DRAM bank ... inside the
  stack" became "a unit beside each pair of DRAM banks ... a GPU's four stacks read operands at
  4.92 TB/s inside the memory". Subtitle "A unit beside each bank" became "One unit per two banks";
  stack label "HBM2-PIM stack (Aquabolt-XL)" became "Aquabolt-XL HBM2-PIM, four stacks"; bank cells
  "bank" became "2 banks".
- `src/sources/ComputeInMemory.ts`: unchanged (tiers, URLs and pins correct; shared records match
  HbmAndBandwidthWall.ts and MoeAndSparseActivation.ts exactly).

## Checks

Run from the dive root on 2026-10-23 after the last edit:
- `pnpm exec tsc --noEmit | grep -E "ComputeInMemory|CimDiagram|sources/ComputeInMemory"`: no type
  errors in my files.
- `pnpm exec eslint src/sections/ComputeInMemory.tsx src/sources/ComputeInMemory.ts src/components/CimDiagram.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t ComputeInMemory`: exit 0, 1 passed.
- Gates from the repo root: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0, pre-overflow
  exit 0; no hits in ComputeInMemory or CimDiagram in any output.
- `pnpm exec vite build --outDir /tmp/vf-ComputeInMemory-dist --emptyOutDir`: exit 0.
- `node scripts/shoot.mjs --sections compute-in-memory --widths 1440,390 --out /tmp/vf-ComputeInMemory-shots --dist /tmp/vf-ComputeInMemory-dist`:
  exit 0, "ok" at both widths. PNGs read: at 1440 "2 banks" cells, "Aquabolt-XL HBM2-PIM, four
  stacks" and the subtitle sit inside their boxes with clear margins, no label touches an arrow; at
  390 the diagram scrolls sideways at 640 px and stays legible; the results table shows all three
  columns.

## For the orchestrator

- Register `research/2026-10-refresh/01-memory.md` CM13: the GPT-J pairing is reversed against
  slide 12 (rendered): (32, 64) is 2.16x speed-up / 1.79x energy, (32, 256) is 2.33x / 2.24x. Any
  other section quoting these should use the slide's pairing.
- Register CM17 and HbmAndBandwidthWall.tsx:645-646 ("they see 4.92 TB/s to the host's 1.23
  TB/s"): the figures are totals for a GPU with four Aquabolt-XL stacks (HC33 slide 13). The HBM
  sentence makes no per-stack claim, so it is not wrong; if that box draws or says "a stack", scope
  it to four stacks.
- HBM section box says PIM units sit "beside the DRAM banks", which stays consistent with one unit
  per two banks.
- `sources.md` regeneration (the author's open snapshot item) still stands; no record changed here.

## Backlog

- Economy cuts (about 40 words) if the Gate 3 average needs them: drop "d-Matrix markets Corsair as a
  product, and its product page gives no deployment scale." from the Corsair paragraph (the closing
  paragraph states it with the same citation); drop "the wall moves out by that ratio and does not
  disappear" from the wins bullet (the architecture paragraph and the diagram carry it).
- Read Eyeriss (ISCA 2016) directly and cite it beside the Samsung slide for the 200x figure.
- T5-MoE expert count (slide 14 names T5-large and DeepSpeed MoE but not the number of experts).
- The 1x bar is clamped to 2 px, so it draws at about a third of the 6x bar rather than a sixth; a
  tick mark instead of a bar would keep "to scale" exact.
