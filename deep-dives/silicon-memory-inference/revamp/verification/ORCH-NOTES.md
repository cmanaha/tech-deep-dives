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
- Groq, SambaNova and Dataflow; Disaggregated Serving; MoE; Heterogeneity: NVIDIA describes
  Groq 3 LPX as its own rack "deployed alongside Vera Rubin NVL72", in full production since
  2026-08-24 with customer deployment unconfirmed (Thesis verification). "Inside Vera Rubin" or
  "a GPU rack carries LPX" wording must match that.
- AWS Trainium, Inferentia and Neuron; Isolation: the NeuronCore-v3 architecture page is cited
  for the SBUF and PSUM names and does not contain them (Heterogeneity verification; it re-cited
  them to the page that does, see src/sources/HeterogeneityFact.ts).
- INCIDENT (2026-10-18, HBM verification): one curl request to
  https://www.sec.gov/Archives/edgar/data/2021728/000162828026025762/cerebras-sx1april2026.htm
  sent the User-Agent "tech-deep-dives research c.manaha@gmail.com" (SEC EDGAR asks for a
  contact address). Not reversible. The verification brief now forbids personal data in any
  request; the running verifiers were told. Goes in the final report.
- NVIDIA Hopper: repeats the HBM section's 1.9x decomposition almost word for word (HBM
  verification); judge economy there and consider a cross-link by name instead.
- Flash as a Cache Tier (and Disaggregated): the Mooncake arXiv record's title says v4 but the
  unversioned abs URL now serves v5; pin the URL to the version whose figures are quoted.
- Communication and Scale-Out, Grace-Blackwell: the P6 page's own instance table gives 800 Gbps
  of EFA per GPU against 400 Gbps in its prose (Disaggregated verification).
- Disaggregated scored 7/10 on economy (+63%); ~150 words of cut candidates in its Backlog. If
  the Gate 3 average falls under 8, apply those cuts as section-shape corrections.
- Small Language Models: the B300 MIG wording. NVIDIA's MIG page gives 7 x 34 GB for GB300
  NVL72 and 7 x 32 GB for HGX B300 (Isolation verification; reuse its records).
- Capital Markets Lens: align the list of what the NIE proof leaves out with Isolation (I/O
  device management, live update and migration, concurrency, per the white paper).
