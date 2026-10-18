# Items for the verification pass (collected by the orchestrator during authoring)

- Roofline: AMD MI355X figures rest on the 2026-10-16 register read (the AMD page timed
  out on re-check). The Trainium3 FP4 marker in the ridge dot plot sits on its FP8
  marker and has no value label.
- Cerebras: the ridge uses WSE-3 "125 PFLOPS". Check whether Cerebras states it as dense
  or sparse; if unstated, the ridge note must say so.
- MoE: the Llama 4 announcement title was not re-fetched.
- Rubin HBM4 bandwidth: 22 / 19.2 / 16.25 TB/s on three NVIDIA pages; every section
  quoting one names it.
- Trainium3 NeuronLink-v4 per chip: 2.56 TB/s / 2,048 GiB/s / 2 TB/s on three AWS pages.
- Glossary: CuTe has no expansion on the pages checked; SXM has two meanings (NVIDIA
  module form factor, Groq switch execution module).
- Length growth above the brief's ~20%: Disaggregated (+63%), Groq/SambaNova (+44%),
  Quantization (+35%), Cerebras (+33%), Capital Markets (+31% visible), Roofline (+29%),
  Xeon 6 (+27%), AWS Custom Silicon (+27%), AWS Compilers (+26%), Isolation (+26%).
  Judge economy in the Gate 3 score.

## Added during verification

- Communication and Scale-Out: the DeepEP "V1" label (around line 386) should read "normal
  kernels", as the MoE verification corrected against DeepEP's README.
- Any section quoting the MI355X: AMD lists BF16 at 2.5 PFLOPS dense (ridge 313 at 8 TB/s);
  "flat or falls" for the ridge at fixed precision was corrected to "within 2x" in Roofline.
- Heterogeneity Fact (and Thesis): the Cerebras SDK blog is cited for compile-time routing and
  does not say it; Cerebras Wafer-Scale now cites the Cerebras SDK documentation for it. Cerebras
  states its PFLOPS as sparse FP16 (CS-4 datasheet footnote), so any Cerebras FLOPS or ridge
  figure elsewhere is sparse.
- NVIDIA Blackwell: NVIDIA's B300 page conflicts on HBM stack count (8 or 12); the section must
  name which page it follows or state the conflict.
