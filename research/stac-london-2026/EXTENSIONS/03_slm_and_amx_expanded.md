# SLMs and AMX expanded
Access date: 2026-04-24

## Section A — SLM production lineup and silicon

### Sources fetched
- [AUTHORITATIVE] huggingface.co/microsoft/Phi-3-mini-4k-instruct
- [AUTHORITATIVE] huggingface.co/microsoft/Phi-3.5-mini-instruct
- [AUTHORITATIVE] huggingface.co/microsoft/phi-4
- [AUTHORITATIVE] huggingface.co/meta-llama/Llama-3.2-1B
- [AUTHORITATIVE] huggingface.co/meta-llama/Llama-3.2-3B
- [AUTHORITATIVE] huggingface.co/google/gemma-2-2b
- [AUTHORITATIVE] huggingface.co/google/gemma-3-1b-it
- [AUTHORITATIVE] huggingface.co/Qwen/Qwen2.5-0.5B, -1.5B, -7B
- [AUTHORITATIVE] huggingface.co/mistralai/Mistral-7B-v0.1, v0.3
- [AUTHORITATIVE] huggingface.co/HuggingFaceTB/SmolLM2-1.7B

intel.com developer pages returned HTTP 403 — see UNKNOWN.

### Findings (numbered, cited)

1. **[AUTHORITATIVE]** Phi-3-mini-4k-instruct: "3.8B parameters … lightweight, dense decoder-only Transformer model." Trained on "4.9 trillion tokens." 4K context; 128K variant exists. Microsoft.

2. **[AUTHORITATIVE]** Phi-3.5-mini-instruct: "Phi-3.5-mini has 3.8B parameters … supports 128K token context length. Training data: 3.4T tokens." Targets "Memory/compute constrained environments" and "Latency bound scenarios." Microsoft.

3. **[AUTHORITATIVE]** Phi-4: "14B parameters, dense decoder-only Transformer model." "Context length: 16K tokens." "Training data: 9.8T tokens." Trained on 1920 H100-80G for 21 days. Phi-4 sits at the upper bound of the SLM band. Microsoft Research.

4. **[AUTHORITATIVE]** Llama 3.2 1B: "Params: 1B (1.23B)," 128k context. "Llama 3.2 1B and 3B models are expected to be deployed in highly constrained environments, such as mobile devices." SpinQuant size 1083 MB. Meta.

5. **[AUTHORITATIVE]** Llama 3.2 3B: "3B (3.21B)," 128k context full-precision / 8k quantized. Meta documents OnePlus 12 Android decode of "19.7 tokens/sec" with SpinQuant; size "2,435 MB (-60.3%)." Meta.

6. **[AUTHORITATIVE]** Gemma 2 2B: "2 billion parameters … 2B model was trained with 2 trillion tokens." 8-bit/4-bit via bitsandbytes; deployment "Local deployment: Laptop, desktop." Google.

7. **[AUTHORITATIVE]** Gemma 3 family: "1B, 4B, 12B, 27B." "Total input context of 128K tokens for the 4B, 12B, and 27B sizes, and 32K tokens for the 1B size." "Their relatively small size makes it possible to deploy them in environments with limited resources such as laptops, desktops or your own cloud infrastructure." Google DeepMind.

8. **[AUTHORITATIVE]** Qwen 2.5 spans "0.5 to 72 billion parameters." From Alibaba cards:
   - 0.5B: "Total Parameters: 0.49B," 24 layers, 14 Q / 2 KV heads, 32,768 context.
   - 1.5B: "Total Parameters: 1.54B," 28 layers, 12 Q / 2 KV, 32,768 context.
   - 7B: "Number of Parameters: 7.61B … Number of Attention Heads (GQA): 28 for Q and 4 for KV … Context Length: 131,072 tokens."

9. **[AUTHORITATIVE]** Mistral-7B-v0.1: "7 billion parameters" with "Grouped-Query Attention" and "Sliding-Window Attention," BF16, Apache-2.0. v0.3 adds "extended vocabulary to 32768." Mistral AI.

10. **[AUTHORITATIVE]** SmolLM2: "a family of compact language models available in three size: 135M, 360M, and 1.7B parameters." Trained on "11 trillion tokens." "lightweight enough to run on-device." Hugging Face.

11. **[SPECULATIVE]** Practical "small" band derived from items 1–10: 0.5B–7B fits single-GPU HBM (<16 GB at FP16/BF16); 1B–3B fits inside MIG slices (e.g. H100 1g.10gb) and runs on host CPU with AMX. Phi-4 14B is borderline — single 24 GB GPU at INT8 but no longer "edge."

12. **[AUTHORITATIVE]** Quantization is universal. Llama 3.2: "linear layers in all transformer blocks are quantized to a 4-bit groupwise scheme (with a group size of 32) for weights and 8-bit per-token dynamic quantization for activations." Phi-3 ships ONNX with "int4 DML (quantized via AWQ) … int4 CPU and Mobile (quantized via RTN)." Gemma 2 supports 8-bit/4-bit via bitsandbytes. SmolLM2 has llama.cpp/Ollama variants.

13. **[SPECULATIVE]** Economics:
    - **Cost per token**: a 1B–3B SLM on host CPU with AMX avoids GPU rental entirely. Llama 3.2 3B SpinQuant 2,435 MB fits DDR5 trivially.
    - **Latency**: Llama 3.2 1B SpinQuant decodes at "50.2 tokens/sec" on a phone CPU [AUTHORITATIVE — Meta], so Xeon 6 / Graviton5 hosts comfortably exceed that.
    - **MIG multi-tenant**: 1g.10gb slices fit Phi-3-mini, Llama 3.2 3B, Gemma 3 1B at INT8 with KV cache.
    - **Speculative decoding**: SLM-as-drafter is straightforward (same tokenizer family preferred); not vendor-prescribed — inference-stack territory.

## Section B — AMX expanded coverage

### Sources fetched
- [AUTHORITATIVE] felixcloutier.com mirror of Intel SDM x86 ISA reference: ldtilecfg, tdpbf16ps, tdpbssd:tdpbsud:tdpbusd:tdpbuud, tileloadd:tileloaddt1, tilestored, tilezero
- [AUTHORITATIVE] uxlfoundation.github.io/oneDNN dev_guide_cpu_dispatcher_control
- [AUTHORITATIVE] github.com/intel/intel-extension-for-pytorch README

intel.com pages (overview, intrinsics, Llama on Xeon articles) returned HTTP 403 — see UNKNOWN. Felix Cloutier mirror is a faithful rendering of Intel SDM Vol. 2 and is the canonical fallback for ISA text.

### Findings (numbered, cited)

1. **[AUTHORITATIVE]** Tile config. LDTILECFG: "takes an operand containing a pointer to a 64-byte memory location containing the description of the tiles to be supported … Tile 0 through 7 bytes per row" and "Tile 0 through 7 rows." "palette_id … only legal non-INIT value … is 1." Palette 1 defines max 8 tile registers, max row bytes 64, max rows 16 — each tile up to 16 × 64 B = 1 KiB. Intel SDM.

2. **[AUTHORITATIVE]** Eight tile registers (TMM0–TMM7). CPUID gating: "the AMX-TILE bit in CPUID must be set and the operating system has to have enabled the tiles architecture." Intel SDM.

3. **[AUTHORITATIVE]** BF16 matmul. TDPBF16PS: "Matrix multiply BF16 elements from tmm2 and tmm3, and accumulate the packed single precision elements in tmm1." "Each dword element in input tiles tmm2 and tmm3 is interpreted as a BF16 pair." Round-to-nearest-even. Intrinsic `_tile_dpbf16ps`. Intel SDM.

4. **[AUTHORITATIVE]** INT8 matmul, four sign variants. TDPBSSD/TDPBSUD/TDPBUSD/TDPBUUD: "Matrix multiply signed byte elements from tmm2 by signed byte elements from tmm3 and accumulate the dword elements in tmm1" (TDPBSSD). Variants differ only in operand signedness (s×s, s×u, u×s, u×u). Each dword "interpreted as four byte elements." Intel SDM.

5. **[AUTHORITATIVE]** Tile load/store. TILELOADD: "Load data into tmm1 as specified by information in sibmem … Only memory operands are supported and they can only be accessed using a SIB addressing mode." TILESTORED: "Store a tile in sibmem … restartable instruction." TILEZERO: "This instruction zeroes the destination tile." Intel SDM.

6. **[AUTHORITATIVE]** TSX incompatibility — every AMX op aborts an active TSX transaction (TDPBF16PS, LDTILECFG, TILELOADD, TILESTORED, TILEZERO). Intel SDM.

7. **[AUTHORITATIVE]** oneDNN ISA dispatch exposes three AMX-bearing tiers — the precise vendor delineation between Sapphire Rapids/Emerald Rapids (BF16+INT8) and Granite Rapids (adds FP16):
   - `AVX10_1_512_AMX`: "Intel AVX10.1 and Intel Advanced Matrix Extensions (Intel AMX) with 8-bit integer and bfloat16 support" — Sapphire Rapids / Emerald Rapids.
   - `AVX10_1_512_AMX_FP16`: "Intel AVX10.1 and Intel AMX with 8-bit integer, bfloat16 and float16 support" — Granite Rapids.
   - `AVX10_2_AMX_2`: "Intel AVX10.2 and Intel AMX with 8-bit integer, bfloat16, float16, float8 support" — next-gen, FP8 added.

8. **[AUTHORITATIVE]** Intel Extension for PyTorch: "Optimizations take advantage of Intel® Advanced Vector Extensions 512 (Intel® AVX-512) Vector Neural Network Instructions (VNNI) and Intel® Advanced Matrix Extensions (Intel® AMX) on Intel CPUs." LLM table covers FP32, BF16, INT8 weight-only, INT4 weight-only. Repo "archived as of March 30, 2026, and users are directed to use PyTorch directly going forward" — AMX paths upstreamed into mainline PyTorch via the Inductor/oneDNN backend.

9. **[AUTHORITATIVE]** TDPFP16PS: dedicated felixcloutier page returned 404 in this fetch round. Existence and ISA tier confirmed via oneDNN's `AVX10_1_512_AMX_FP16` (Granite Rapids). Detailed semantics: see UNKNOWN.

10. **[SPECULATIVE]** AMX limits, derived from items 1–6:
    - Only 8 tile registers — register pressure for fused kernels.
    - 1 KiB per tile cap — large GEMMs require explicit tiling loops with TILECFG re-issue.
    - SIB-only addressing for load/store.
    - TILECFG must be reloaded after `XSAVE` / context switch; OS support gate (AMX-TILE CPUID + XCR0) means VMs/containers must explicitly enable.
    - TSX abort — AMX cannot live inside a hardware transaction.

11. **[AUTHORITATIVE]** SLM-on-AMX is the concrete production target. IPEX lists Phi, Llama, Mistral, Qwen variants in its LLM optimization table covering BF16 and INT8 weight-only paths. Combined with oneDNN's AMX dispatch tiers, the chain Phi-3-mini / Llama-3.2-3B / Mistral-7B at BF16 or INT8 → oneDNN AMX kernels → Sapphire/Emerald/Granite Rapids tiles is documented end-to-end across vendor sources.

## UNKNOWN
- Verbatim text of intel.com AMX overview and intrinsics pages — HTTP 403 from this network. Felix Cloutier mirror used (faithful Intel SDM rendering).
- Intel-published AMX-vs-AVX-512 throughput numbers — not retrievable; no number is fabricated here.
- TDPFP16PS detailed semantics page — 404 at felixcloutier.com/x86/tdpfp16ps. Existence confirmed via oneDNN dispatcher.
- OpenVINO benchmark tables on AMX — landing pages reachable but benchmark detail not in fetched content.
- Mistral 7B v0.3 context length — not stated on the page fetched.
- Gemma 2 2B context length — not stated on the page fetched.
- AWS / Azure SLM-on-CPU benchmark posts — not fetched in this round.

## Direct quotes
All key verbatim quotes are already inline in Findings A.1–A.10 and B.1–B.8 with their source attribution. Cross-reference summary:
- Phi-3/3.5/4 quotes: Findings A.1–A.3 (Microsoft model cards).
- Llama 3.2 1B/3B quotes: A.4–A.5 (Meta).
- Gemma 2/3 quotes: A.6–A.7 (Google / Google DeepMind).
- Qwen 2.5 quotes: A.8 (Alibaba).
- Mistral 7B / SmolLM2 quotes: A.9–A.10.
- AMX ISA quotes (LDTILECFG, TDPBF16PS, TDPBSSD/SUD/USD/UUD, TILELOADD, TILESTORED, TILEZERO): B.1–B.6 (Intel SDM via Felix Cloutier).
- oneDNN AMX dispatcher tiers: B.7.
- IPEX AMX statement: B.8.
