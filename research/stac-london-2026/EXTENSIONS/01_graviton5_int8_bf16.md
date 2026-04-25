# Graviton5 / Neoverse V3 — INT8 / BF16 / SLM acceleration
Access date: 2026-04-24

## Sources fetched [URL + tier]

**[AUTHORITATIVE]**
- AWS What's New, M9g Preview — https://aws.amazon.com/about-aws/whats-new/2025/12/ec2-m9g-instances-graviton5-processors-preview/
- AWS EC2 M9g product page — https://aws.amazon.com/ec2/instance-types/m9g/
- About Amazon, "AWS Graviton5 CPU Amazon EC2" — https://www.aboutamazon.com/news/aws/aws-graviton-5-cpu-amazon-ec2
- arm.com Neoverse V3 product page; arm.com Neoverse CSS page
- Arm developer blog, "Redefining Datacenter Performance for AI" (V3 ML features)
- AWS ML blog, "Accelerate NLP inference with ONNX Runtime on AWS Graviton processors" (Graviton3 baseline)
- aws-graviton-getting-started repo (per-gen feature flags)

**[SECONDARY]**
- The Next Platform, "AWS Graviton5 Strikes A Different Balance For Server CPUs" (Dec 4 2025) — reporting AWS re:Invent presentation
- Tom's Hardware, The Register (192-core Graviton5 coverage)
- TechInsights V3/Graviton5/Cobalt200 summary (paywalled)
- ASRock Rack ARM-AGI page (third-party V3 platform, ISA cross-check)

**[NOT FOUND / FAILED]**
- developer.arm.com Neoverse V3 page returned an entitlement error unauthenticated
- Chips and Cheese has no Graviton5/V3 deep-dive yet (latest V-series piece is V2 in Graviton4)
- aws-graviton-getting-started not yet updated for Graviton5

## Key findings [numbered, each cited]

1. **AWS's official ML uplift number for Graviton5 vs Graviton4 is "up to 35% faster for machine learning workloads."** This is the only ML-specific quantitative claim AWS publishes for M9g. Source: [AUTHORITATIVE — AWS What's New M9g preview page] and [AUTHORITATIVE — aws.amazon.com/ec2/instance-types/m9g/]. The same two pages also state "up to 25% better compute performance," "up to 30% faster for databases," and "up to 35% faster for web applications" vs M8g.

2. **The "ML workloads" claim is generic — AWS does not isolate LLM/SLM inference, does not specify a model, and does not break down the contribution of BF16, INT8, cache, memory bandwidth, or vectorization.** Both the What's New post and the M9g product page omit any precision/kernel breakdown. No AWS-published Graviton5 LLM/SLM throughput or latency number exists as of access date. [AUTHORITATIVE — absence verified.]

3. **Graviton5 uses Arm Neoverse V3 (Poseidon, Armv9.2-A) cores.** [SECONDARY: The Next Platform Dec 4 2025; Tom's Hardware; cross-checked against AUTHORITATIVE Arm CSS page.]

4. **Neoverse V3 retains the V2 ML matmul instruction set: SVE2 with BF16 (BFMMLA), INT8 matrix-multiply-accumulate (SMMLA / UMMLA / I8MM), and SDOT/UDOT.** Arm's "Redefining Datacenter Performance for AI" V3 blog calls out "INT8 Matrix Multiply… for quantized neural networks" and "FMMLA… for low-precision floating point (especially BF16 or FP16) matrix math." [AUTHORITATIVE — Arm developer blog. Cross-checked SECONDARY: ASRock Rack V3 page, "SVE 2, including bf16 and int8 MMLA instructions."]

5. **Neoverse V3 (Poseidon) does NOT ship SME / SME2 as a confirmed enabled feature.** Arm's CSS marketing lists "Arm Scalable Matrix Extensions" as a Neoverse CSS roadmap deliverable, not a Poseidon V3 feature. SME2 is shipping in Arm's client C1 (Lumex CSS) and is positioned for next-gen "Adonis" Neoverse cores. AWS has not claimed SME on Graviton5. [AUTHORITATIVE — Arm CSS page; absence in all AWS materials. Best-evidence reading; Arm V3 TRM was not directly fetchable. See UNKNOWN.]

6. **The "65% / 30%" BF16 / INT8 numbers that get repeated for "Graviton" are Graviton3 numbers, not Graviton5.** AWS's ONNX Runtime blog: "improved inference performance by up to 65% for fp32 inference and up to 30% for int8 quantized inference for several natural language processing (NLP) models on AWS Graviton3-based Amazon EC2 instances." Measured on c7g.4xl with BERT/RoBERTa/GPT2 via BFMMLA/SMMLA/UMMLA enablement. [AUTHORITATIVE — AWS ML blog.] Do not transpose to Graviton5.

7. **aws-graviton-getting-started feature flags for Graviton4: `sve2, sve-int8, sve-bf16, sve-bitperm, sve-crypto`.** Graviton5 is not yet listed; V3/Armv9.2 is a strict superset for these flags. [AUTHORITATIVE.]

8. **Graviton5 platform-level deltas behind the "35% ML" headline beyond ISA: 192 V3 cores/package, 180 MB L3 (5x larger), DDR5-7200 (691.2 GB/s socket bandwidth, +28.6% vs Graviton4), 33% lower inter-core latency, 2.6x more L3 per core.** [AUTHORITATIVE — aboutamazon.com Graviton5; SECONDARY: The Next Platform for DDR5-7200 / 28.6% bandwidth attributed to AWS re:Invent presentation.] For SLMs that are memory-bandwidth-bound during decode, the DDR5-7200 jump and 5x L3 are likely the dominant contributors — not new matmul instructions.

9. **Customer-quoted Graviton5 numbers in AWS materials cluster at 20–35%, not 80%.** Atlassian "30% higher performance and 20% lower latency"; Snowflake ">30%"; Siemens "additional 30%+" on Graviton5; Airbnb "up to 20% vs Graviton4"; Honeycomb "20-25% lower latency, 36% better throughput per core." None are ML/inference-specific. [AUTHORITATIVE — M9g product page testimonials.]

10. **Bedrock / SageMaker integration with Graviton5: no AWS-authoritative integration announced.** SageMaker Real-Time Inference has historically shipped Graviton 3/4 targets, but no Graviton5-specific SageMaker or Bedrock announcement was retrievable. M9g is preview-only; C9g and R9g planned 2026. [AUTHORITATIVE — absence verified.]

## Verdict on Carlos's "80% faster for SLMs" claim

**REFUTED at the stated magnitude. REFINED to: AWS officially claims "up to 35% faster for machine learning workloads" for Graviton5 (M9g) vs Graviton4 (M8g) — not 80%, and not specifically SLM.**

Additional refinements:
- The architectural premise ("Graviton5 / Neoverse V3 ships an INT8 FMA accumulator that's new this generation") is not supported. INT8 SMMLA/UMMLA matrix-multiply-accumulate has been in the Neoverse V-series since V1/V2 and was already exploited on Graviton3 (c7g) in 2023 for "up to 30% int8 quantized inference" gains via ONNX Runtime. Graviton5/V3 inherits these instructions; it does not introduce them.
- The plausible source of an "80%" figure is mis-attribution. Two candidates: (a) Arm's marketing claim of "up to 84% in AI data analytics" for V3 vs V2 (cited by Tom's Hardware, [SECONDARY]) — this is data analytics, not SLM inference; (b) the historical "up to 65% for fp32 inference" Graviton3 BFMMLA number which a reader could round to ~80% if conflated with INT8 quantization gains.
- The honest framing for the STAC London talk: "AWS's first-party number is up to 35% faster ML on M9g vs M8g, with the underlying contributors being a memory subsystem upgrade (DDR5-7200, 5x L3) and continued exploitation of V2-era SVE2 BF16/INT8 MMLA — not a new INT8 accumulator." If you want a higher-confidence SLM number, you have to measure it; AWS hasn't published one.

## UNKNOWN

- Whether Neoverse V3 (Poseidon) implements SME/SME2 as an enabled feature or only as a Neoverse CSS roadmap item. The developer.arm.com V3 TRM page returned an unauthenticated entitlement error. Best-evidence reading is "no enabled SME on V3," but this is not directly confirmed by a fetched primary doc.
- Graviton5's actual SVE2 vector pipeline width (V2 was 4x128b). No fetched source states V3's pipeline configuration explicitly. Likely 4x128b inheritance, but not verified.
- Per-precision (BF16 vs INT8) speedup on Graviton5 vs Graviton4 — AWS has not published a kernel-level breakdown.
- Specific SLM (e.g., Llama 3.2-1B/3B, Phi-3-mini, Qwen2.5-1.5B) tokens/sec or TTFT numbers on M9g. No vendor-cited measurement available.
- Whether AWS Bedrock has any Graviton5-backed inference path. No announcement found.
- Whether SageMaker Real-Time Inference offers M9g endpoints in preview. Not confirmed.
- Graviton5 clock frequency officially — SECONDARY sources cite 3.1 GHz; AWS has not posted a primary frequency spec.

## Direct quotes worth using verbatim

> "up to 35% faster for machine learning workloads"
> — [AUTHORITATIVE] AWS What's New, M9g Preview, Dec 2025 (https://aws.amazon.com/about-aws/whats-new/2025/12/ec2-m9g-instances-graviton5-processors-preview/)

> "up to 25% better compute performance" … "up to 30% faster for databases" … "up to 35% faster for web applications" … "up to 35% faster for machine learning workloads"
> — [AUTHORITATIVE] AWS EC2 M9g product page (https://aws.amazon.com/ec2/instance-types/m9g/)

> "Bfloat16 accelerated SGEMM kernels and int8 MMLA accelerated Quantized GEMM (QGEMM) kernels in ONNX have improved inference performance by up to 65% for fp32 inference and up to 30% for int8 quantized inference for several natural language processing (NLP) models on AWS Graviton3-based Amazon EC2 instances."
> — [AUTHORITATIVE] AWS ML blog, "Accelerate NLP inference with ONNX Runtime on AWS Graviton processors" — note this is **Graviton3**, not Graviton5

> "The AWS team implemented MLAS kernels for bfloat16 fast math and int8 quantized General Matrix Multiply (GEMM) using BFMMLA, SMMLA, and UMMLA instructions, which have higher matrix multiplication throughput compared to DOT instructions."
> — [AUTHORITATIVE] AWS ML blog, ONNX Runtime on Graviton — establishes that the BFMMLA/SMMLA/UMMLA path was already in production on Graviton3

> "Neoverse V3 delivers double-digit performance improvements over Neoverse V2 on cloud and ML applications"
> — [AUTHORITATIVE] arm.com Neoverse V3 product page

> "Neoverse CSS delivers the roadmap of Armv9 features and Neoverse technologies out of the box – including Arm Confidential Compute, AMBA CHI C2C, and Arm Scalable Matrix Extensions, among others."
> — [AUTHORITATIVE] arm.com Neoverse CSS page — note SME framed as a roadmap deliverable, not a confirmed V3 Poseidon feature

> "delivers about 25 percent more performance" (single-socket Graviton5 vs dual-socket Graviton4)
> — [SECONDARY: The Next Platform, Dec 4 2025] reporting AWS re:Invent presentation — useful as a reminder that the headline 25% comparison is socket-vs-socket, not core-vs-core
