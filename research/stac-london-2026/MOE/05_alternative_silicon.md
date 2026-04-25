# MoE on alternative silicon — Tier 1 research notes
Access date: 2026-04-24

Tier legend: **T1** = official vendor docs / press release / pricing page. **T2** = official vendor blog. **T3** = peer-reviewed paper. T4 (random press) excluded by instruction.

## Sources fetched

- [T1] https://www.cerebras.ai/inference — Cerebras Inference product page
- [T1] https://www.cerebras.ai/pricing — Cerebras pricing page (no per-token rates exposed; tier-based)
- [T1] https://www.cerebras.ai/press-release/maverick — "Cerebras beats NVIDIA Blackwell: Llama 4 Maverick" (May 28, 2025)
- [T2] https://www.cerebras.ai/blog/moe-guide-why-moe — "MoE Fundamentals: Sparse Models Are the Future" (Jul 22, 2025)
- [T2] https://www.cerebras.ai/blog/moe-guide-scale — "MoE at Scale: Making Sparse Models Fast on Real Hardware" (Sep 3, 2025)
- [T2] https://www.cerebras.ai/blog/qwen3-235b-2507-instruct-now-available-on-cerebras (Jul 29, 2025)
- [T1] https://groq.com/ — Groq homepage
- [T1] https://groq.com/pricing — GroqCloud pricing
- [T2] https://groq.com/blog/from-speed-to-scale-how-groq-is-optimized-for-moe-other-large-models (May 27, 2025)
- [T2] https://groq.com/llama-4-now-live-on-groq-build-fast-at-the-lowest-cost-without-compromise (Apr 5, 2025)
- [T1] https://sambanova.ai/ — homepage
- [T3] https://arxiv.org/abs/2405.07518 — Prabhakar et al., "SambaNova SN40L: Scaling the AI Memory Wall with Dataflow and Composition of Experts" (ISCA-related; arXiv 2024)
- [T1] https://semiconductor.samsung.com/news-events/news/samsung-develops-industrys-first-high-bandwidth-memory-with-ai-processing-power/ — Samsung HBM-PIM announcement (Feb 2021)
- [T3] IEEE Hot Chips 33 (2021) — "Aquabolt-XL: Samsung HBM2-PIM with in-memory processing for ML accelerators and beyond" (https://ieeexplore.ieee.org/document/9567191)
- [T3] IEEE Micro (2022) — "Aquabolt-XL HBM2-PIM, LPDDR5-PIM With In-Memory Processing, and AXDIMM" (https://ieeexplore.ieee.org/document/9749869)
- [T1] https://www.hypercim.com/ — HyperCIM homepage

## Findings

### 1. Cerebras WSE-3

**MoE is officially documented.** Cerebras has published a multi-part MoE blog series ([T2], Jul–Oct 2025): why-MoE, router strategies, debugging, scale, MoE math, and "REAP" one-shot pruning for trillion-parameter MoE.

**Models served as MoE on Cerebras Inference** ([T1] /inference, accessed 2026-04-24):
- GPT-OSS-120B
- Qwen3-235B Instruct and Qwen3-235B Thinking
- Llama 4 Scout (109B total / 17B active / 16 experts — parameter breakdown sourced from Groq's Llama 4 launch [T2], not Cerebras directly)
- Llama 4 Maverick (400B total / 17B active / 128 experts — same caveat)
- ZAI GLM-4.7

**Throughput claims (T1, /inference page):**
- GPT-OSS-120B: "3,000 tokens/sec"
- Llama 4 Scout: "over 2,000 tokens per second"
- GLM-4.7: "1,000 tokens/sec"
- Qwen3-235B (T2 blog, Jul 29 2025): "over 1,400 tokens per second – 11x faster than the leading GPU cloud"
- Llama 4 Maverick (T1, /press-release/maverick, May 28 2025): "2,522 tokens per second" measured by Artificial Analysis, vs NVIDIA Blackwell at "1,038 tokens per second" on the same model. Same release also reports SambaNova 794 t/s, Groq 549 t/s, Amazon 290 t/s, Google 125 t/s, Azure 54 t/s on Llama 4 Maverick.

**Pricing (T2 blog, Qwen3-235B, Jul 29 2025):** "$0.60 per million input tokens and $1.20 per million output tokens." **The Cerebras pricing page itself ([T1] /pricing) does NOT publish per-token rates** — it advertises Free / Developer ($10) / Enterprise / Cerebras Code Pro ($50/mo, "up to 24M tokens/day") / Cerebras Code Max ($200/mo, "up to 120M tokens/day") tiers only.

**On-wafer SRAM vs HBM economics — what Cerebras officially says.** The MoE-at-scale blog ([T2], Sep 3 2025) explains the architectural fit verbatim: "We have about 900 times more on-chip memory (SRAM) than a latest single GPU." It describes weight streaming: "With weight streaming, we remove model parameters (those heavy tensors) from the wafer entirely. They now live in the external memory units, and we stream them to the wafer during training." It frames the MoE problem as: "sparser MoE networks become more I/O bound and severely underutilize their allocated resources," with throughput degradation "up to 86%" without optimization, mitigated by their Batch Tiling on Attention (BTA) scheme. **Caveat: this blog post is explicitly about training, not inference** — Cerebras has not published an equivalent depth piece on MoE inference internals.

### 2. Groq LPU

**MoE is officially documented** in [T2] "From Speed to Scale: How Groq Is Optimized for MoE & Other Large Models" (May 27 2025). The post states LPUs "interconnect and create one shared resource fabric" via "Groq Compiler and Groq RealScale chip-to-chip interconnect technology" and that this lets the system "efficiently run very large models across a variety of model architectures without bottlenecking output speeds." The post does **NOT** detail expert-routing mechanics, all-to-all communication, or SRAM-only-vs-HBM trade-offs in depth.

**MoE models on GroqCloud** ([T2] Apr 5 2025 launch + [T1] pricing page):
- Llama 4 Scout — "17 billion active parameters, 16 experts, and 109 billion total parameters" — "running at over 460 tokens/s"
- Llama 4 Maverick — "17 billion active parameters, 128 experts, and 400 billion total parameters"
- (Mixtral and DeepSeek are not currently listed on the GroqCloud pricing page accessed 2026-04-24)

**Pricing ([T1] groq.com/pricing):**
- Llama 4 Scout (17Bx16E, 128k): "$0.11" input / "$0.34" output per 1M tokens
- Llama 4 Maverick: $0.50 input / $0.77 output per 1M tokens (sourced from Apr 5 2025 launch [T2]; **not** currently on /pricing page as accessed)

**Architecture-MoE link:** The Groq launch post says directly: "In MoE models, a single token activates only a fraction of the total parameters. MoE architectures are more compute efficient for model training and inference." Groq does not publish — at the URLs fetched — explicit per-LPU SRAM size or aggregate-fabric SRAM figures for MoE serving.

### 3. SambaNova RDU (SN40L)

**MoE/CoE is officially documented** in the [T3] arXiv paper "SambaNova SN40L: Scaling the AI Memory Wall with Dataflow and Composition of Experts" (Prabhakar et al., 2024, arXiv:2405.07518). From the abstract:
- Memory: "a three-tier memory system with on-chip distributed SRAM, on-package HBM, and off-package DDR DRAM"
- Composition of Experts: "Samba-CoE, a CoE system with 150 experts and a trillion total parameters"
- Inference benchmark: "3.7× speedup over a DGX H100 and 6.6× over a DGX A100"
- Configuration: "eight RDU sockets"

**Per-chip SRAM/HBM/DDR sizes and bandwidths are in the full paper but were not extractable from the arXiv abstract; the rendered PDF returned binary-only on fetch.** Marked UNKNOWN below pending direct paper read.

**On the SambaNova homepage ([T1] sambanova.ai, accessed 2026-04-24)**, the only MoE mention is for OpenAI's gpt-oss-120b: "a model that delivers high accuracy in just 120-billion parameter with a Mixture of Experts (MoE) architecture." Throughput claims: DeepSeek-V3.1 "up to 200 tokens / second"; gpt-oss-120b "over 600 tokens per second." SambaNova's current rack is now SN50 (5th-gen), not SN40L — the technology page redirected to SambaRack SN50 marketing.

Also note: **on Cerebras's Llama 4 Maverick benchmark ([T1], May 28 2025), SambaNova was independently measured at 794 t/s** — higher than Cerebras's own 200 t/s claim for DeepSeek-V3.1 on their own page, illustrating per-model variance.

### 4. Samsung HBM-PIM (Aquabolt-XL)

**MoE is NOT specifically addressed in Samsung's official PIM materials.** The Feb 2021 Samsung Newsroom announcement ([T1]) targets generic ML/HPC workloads: "HPC, training and inference," "data centers, high performance computing (HPC) systems and AI-enabled mobile applications." Reported headline figures: "over twice the system performance" vs HBM2 Aquabolt and "reducing energy consumption by more than 70%."

**Architecture ([T3] IEEE Hot Chips 33 / IEEE Micro 2022):**
- "16 PIM-enabled pseudo-channels" with "an In-Memory Processor (IMP) to each pair of the memory banks"
- Base HBM2 Aquabolt bandwidth: 307.2 GB/s per stack (1024-bit bus × 2.4 Gbps/pin)
- Reported speedups in IEEE Micro paper: "microkernel general matrix–vector multiplication and speech recognition applications by 8.9× and 3.5×" on a GPU+Aquabolt-XL system, "reduced energy consumption by over 60%"; on Xilinx Alveo U280, "GEMV and ADD workload performances improved by 2.8×, and long short-term memory workload improved by 2.54×"

**MoE relevance is inferential, not stated by Samsung:** PIM accelerates GEMV — which is exactly what dominates MoE expert FFNs at decode time when batch is small and each expert sees few tokens. Samsung has not published a paper specifically benchmarking PIM on MoE-routed inference. Mark as **[SPECULATIVE]** if used in deep dive narrative.

### 5. HyperCIM

**HyperCIM does NOT publicly document MoE inference.** Their homepage ([T1] hypercim.com, accessed 2026-04-24) positions the LPU as a **data-fabric / multi-database integration accelerator**, not an LLM-inference chip:
- "AI is bottlenecked by data, not compute. GPUs sit idle up to 80% of the time, stalled waiting for data to load."
- LPU delivers "real-time, multi-database connectivity at memory speed"
- "14.8 TB/s throughput at microsecond latency"
- "deterministic sub-10ns latency"
- Target verticals listed: "financial services, e-commerce, telecommunications, hyperscalers, and media platforms"

**No HyperCIM-authored academic paper on MoE / sparse activation surfaces in T1/T3 search.** Adjacent CIM-for-MoE academic work exists (SiDA-MoE MLSys 2024; ISSCC 2025 work by Yue et al. on sparsity-aware CIM macros) but is **not** authored by HyperCIM.

If Tanya Mangoma's panel pitch involves MoE on HyperCIM silicon, that is currently **[UNOFFICIAL]** — not present in HyperCIM's public marketing. Worth confirming live.

## UNKNOWN

- Cerebras: per-token pricing for Llama 4 Scout / Maverick / GPT-OSS-120B / GLM-4.7 — pricing page does not expose them.
- Cerebras: how expert weights are sharded across the WSE-3 wafer (single wafer SRAM = 44 GB on WSE-3 per past disclosures, but Cerebras has not published an inference-architecture whitepaper for MoE specifically).
- Cerebras: active vs total parameter framing for Llama 4 sourced from Cerebras directly (the Maverick press release omits this; we are pulling counts from Groq's launch post).
- Groq: MoE-specific architectural mechanics — expert routing, all-to-all collectives, per-LPU SRAM, fabric scaling math.
- Groq: current GroqCloud price for Llama 4 Maverick (only Scout shown on /pricing as of access date).
- SambaNova: per-chip SRAM size/bandwidth, HBM size/bandwidth, DDR size/bandwidth — in the SN40L paper body, not extractable from arXiv abstract via WebFetch.
- SambaNova: status of SN40L → SN50 transition for CoE/MoE workloads; the website now leads with SN50.
- Samsung: any official MoE benchmark on HBM-PIM. None published as of access date.
- HyperCIM: any MoE positioning at all. None on company site.

## Direct quotes worth using verbatim

> "Artificial Analysis has benchmarked Cerebras' Llama 4 Maverick endpoint at 2,522 tokens per second, compared to NVIDIA Blackwell's 1,038 tokens per second for the same model."
> — Cerebras press release, May 28 2025 [T1] https://www.cerebras.ai/press-release/maverick

> "We have about 900 times more on-chip memory (SRAM) than a latest single GPU."
> — Cerebras, "MoE at Scale: Making Sparse Models Fast on Real Hardware," Sep 3 2025 [T2] https://www.cerebras.ai/blog/moe-guide-scale

> "With weight streaming, we remove model parameters (those heavy tensors) from the wafer entirely. They now live in the external memory units, and we stream them to the wafer during training."
> — Cerebras, ibid. [T2]

> "In MoE models, a single token activates only a fraction of the total parameters. MoE architectures are more compute efficient for model training and inference."
> — Groq, "Llama 4 now live on Groq," Apr 5 2025 [T2]

> "Llama 4 Scout is currently running at over 460 tokens/s" — "$0.11 / M input tokens and $0.34 / M output tokens" (Scout); "$0.50 / M input tokens and $0.77 / M output tokens" (Maverick).
> — Groq, ibid. [T2]

> "Samba-CoE, a CoE system with 150 experts and a trillion total parameters" with "3.7× speedup over a DGX H100 and 6.6× over a DGX A100" using "eight RDU sockets" on a "three-tier memory system with on-chip distributed SRAM, on-package HBM, and off-package DDR DRAM."
> — Prabhakar et al., "SambaNova SN40L: Scaling the AI Memory Wall with Dataflow and Composition of Experts," arXiv:2405.07518 [T3]

> "The HBM-PIM brings processing power directly to where the data is stored by placing a DRAM-optimized AI engine inside each memory bank... the new architecture is able to deliver over twice the system performance while reducing energy consumption by more than 70%."
> — Samsung Newsroom, "Samsung Develops Industry's First High Bandwidth Memory with AI Processing Power," Feb 2021 [T1]

> "AI is bottlenecked by data, not compute. GPUs sit idle up to 80% of the time, stalled waiting for data to load."
> — HyperCIM homepage, accessed 2026-04-24 [T1] https://www.hypercim.com/
