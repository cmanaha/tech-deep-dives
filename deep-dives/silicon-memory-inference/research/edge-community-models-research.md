# Community model usage on DGX Spark and Jetson Orin Nano Super — research notes

Researched 2026-07-18 by doc-researcher subagent (14 pages fetched). Tiering per sources.md. Figures below are as-of-fetch; every tokens/sec number cited in the app must carry model + quant + framework + source date.

## DGX Spark — what runs and how fast

### NVIDIA-stated (Tier 2, developer blog 2025-10-24, accessed 2026-07-18)
- Single Spark, Llama 3.1 8B: 10,256.9 t/s prefill / 38.65 t/s decode.
- Dual Spark, Qwen3 235B: 23,477 t/s prefill / 11.73 t/s decode (needs >120 GB incl. overhead across the pair).
- Fine-tuning: Llama 3.2 3B full FT 13,519.5 t/s; Llama 3.1 8B LoRA 6,969.6; Llama 3.3 70B QLoRA 759.8.
- URL: https://developer.nvidia.com/blog/how-nvidia-dgx-sparks-performance-enables-intensive-ai-tasks/
- Official playbooks (Tier 2, github.com/NVIDIA/dgx-spark-playbooks, accessed 2026-07-18): llama.cpp, LM Studio, Ollama (+Open WebUI), vLLM, TensorRT-LLM, SGLang, NIM. NIM default: Llama 3.1 8B Instruct Spark image; Qwen3-32 NIM available. NVIDIA's own UMA caveat: apps still updating for unified memory can hit memory issues below capacity.
- Dual-Spark playbooks: "Connect Two Sparks" + "NCCL for Two Sparks"; measured ~190 Gbps combined RoCE across the QSFP pair (Tier 2, performance_benchmarking_guide.md, accessed 2026-07-18).

### Community-measured (Tier 3)
- llama.cpp maintainer thread (ggml-org/llama.cpp discussion #16578, accessed 2026-07-18): gpt-oss-20B MXFP4 2,008.85 pp / 60.85 tg; gpt-oss-120B MXFP4 ~1,456 pp / ~35 tg; Qwen3 Coder 30B A3B Q8_0 1,654.25 pp / 44.26 tg. Tip: -mcpu=gb10 on LLVM 21+/gcc 15+.
- JetsonHacks bench page (build b6767, 2025-10-31, accessed 2026-07-18): gpt-oss-20B 3,610.56 pp / 79.74 tg; gpt-oss-120B 1,689.47 pp / 52.87 tg; Qwen3 Coder 30B A3B Q8_0 2,933.39 pp / 59.95 tg; Gemma 3 4B Q4_0 5,694.21 pp / 79.83 tg; GLM 4.5 Air Q4_K (67.85 GiB) 841.44 pp / 22.59 tg.
- CONTRADICTION FLAG: gpt-oss-20B decode 60.85 vs 79.74 t/s across the two Tier 3 sources (different builds/settings). Use a range (~50-80 t/s), never a point figure.
- LMSYS in-depth review (2025-10-13, accessed 2026-07-18): Llama 3.1 8B FP8 SGLang 20.5 tg at batch 1 -> 368 tg at batch 32; Llama 3.1 70B FP8 803 pp / 2.7 tg; GPT-OSS 20B Ollama 2,053 pp / 49.7 tg; speculative decoding up to 2x; RTX Pro 6000 Blackwell ~4x Spark decode on GPT-OSS 20B (bandwidth-attributed). LMSYS self-flags results as early-software.
- EXO Labs (Tier 3, ~2025-10, accessed 2026-07-18): Spark framed compute-rich/bandwidth-poor (128 GB @ 273 GB/s, ~100 TFLOPS FP16) vs M3 Ultra (256 GB @ 819 GB/s, 26 TFLOPS); disaggregated prefill-on-Spark decode-on-Mac 2.8x combined.
- Community pattern (LIKELY, 3 independent Tier 3 sources): MoE models dominate community use (gpt-oss, Qwen3 A3B) because dense 70B+ decodes at single-digit t/s.
- Dual-Spark extreme (Tier 4, NVIDIA forum 2026-06-25): GLM-5.2 1-bit UD-IQ1_S 201.82 GiB via llama.cpp RPC, 1.5-8.9 tg — poster calls it not deployable.
- Power observations (Tier 3, llama.cpp discussion #18254): GPU max ~120 W with ~100 W for rest of system, attributed to NVIDIA rep in-thread (unofficial); burn test ~94 W at 80 C.

## Jetson Orin Nano Super — what runs (Jetson AI Lab, NVIDIA-operated, Tier 2, accessed 2026-07-18)
MLC INT4 benchmarks, original -> Super mode (https://www.jetson-ai-lab.com/archive/benchmarks.html, no visible page date):
- Llama 3.1 8B: 14.0 -> 19.14 t/s. Llama 3.2 3B: 27.7 -> 43.07. Qwen2.5 7B: 14.2 -> 21.75. Gemma 2 2B: 21.5 -> 34.97. Gemma 2 9B: 7.2 -> 9.21. Phi 3.5 3.8B: 24.7 -> 38.1. SmolLM2 1.7B: 41.0 -> 64.5.
- VLMs: Qwen2-VL 2B 2.8 -> 4.4 t/s; InternVL2.5 4B 2.5 -> 5.1 (2.04x). ViTs: clip-vit-base-patch32 196 -> 314 fps.
- JetPack 6.2 Super Mode blog (Tier 2, published 2026-01-16, accessed 2026-07-18): up to 2x inference boost; INT8 dense TOPS 20 -> 33 (8 GB module); 1.7x on devkit.
- Whisper/embeddings on Orin Nano Super: UNKNOWN at Tier 2 (AGX Orin tables exist; Nano tables not surfaced).
- Community trends (Tier 4, NOT directly fetched — trends only): 25 W mode as efficiency sweet spot; memory (not thermal) the binding constraint; 8B Q4 fits but leaves near-zero headroom on 8 GB; sub-2B models 35-65 t/s territory.

## Decode-bandwidth relationship (supports roofline narrative)
- LMSYS (Tier 3): 4x decode gap Spark vs RTX Pro 6000 attributed to memory bandwidth, not compute.
- EXO (Tier 3): disaggregation strategy exists because prefill is compute-bound (Spark strong), decode is bandwidth-bound (Mac strong).
- Community (Tier 4, vlaicu.io 2026-06-17): bandwidth is the decode bottleneck; MoE >> dense at equal total size; dense 70B decodes single-digit; speculative decoding 45-85% acceptance nearly doubles decode.
- No fetched source contradicts the batch-1 decode = bandwidth-bound framing.

## Gaps / cautions
1. No NVIDIA-stated dual-Spark parameter ceiling beyond the 405B marketing figure and the 235B worked example.
2. Jetson AI Lab benchmarks page has no visible last-updated date.
3. llama.cpp discussion dates not pinned; treat as launch-era (2025-10) onward.
4. The Register RTX 3090 comparison (205 vs 57 t/s) NOT directly fetched — do not cite.
5. smolhub / ericxliu / navyaai NOT directly fetched — Tier 4 trends only; direct fetch needed before citing any number.

Full tiered source tables in subagent report; key URLs above, all accessed 2026-07-18.
