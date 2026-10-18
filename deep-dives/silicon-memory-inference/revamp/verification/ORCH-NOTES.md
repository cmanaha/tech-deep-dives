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
