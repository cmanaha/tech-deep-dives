# Verification: Mixture of Experts and Sparse Activation

Verified: 2026-10-18. Claims checked: 88 (sampled: 0; every claim was checked
against its source). Confirmed 82, wrong 1, unsupported 4, mislabelled 1,
unverifiable 0.

Method: Hugging Face files fetched raw at the pinned SHA (`/raw/<sha>/...`), the
DeepSeek-V3.2 file sizes summed from the Hugging Face tree API at the pinned SHA,
GitHub files fetched raw at the pinned tag, release notes from the GitHub releases
API, PDFs (DeepSeek-V3 report, SN40L paper) through `pdftotext`, vendor and AWS
pages fetched and stripped to text. Every Hugging Face and GitHub URL in the
source file was re-requested and resolves (HTTP 200/206).

## Gate 3 score: 8/10

The section gives the reader one strong model (memory follows total parameters,
bytes and FLOPs follow active ones, per-expert work follows routed tokens) and
carries it through to a sizing order with a cited number (about 6,600 tokens in
flight for DeepSeek-V3 on H200 FP8). Every figure in both diagrams and all eleven
model rows matched its pinned source; the six failures were peripheral (a catalog
phrase, a label, a per-layer claim, two citations pointing at the wrong page, one
record title) and are fixed. It stops short of 9 on economy: it grew 24% and
repeats the Cerebras layer-boundary split three times and the DeepSeek EP32 /
EP320 layout twice.

| Criterion | Score | Evidence |
|---|---|---|
| Accuracy (after fixes) | 9 | 82 of 88 confirmed as written; the one WRONG (Cerebras "other models run as dedicated deployments") and the four UNSUPPORTED were not load-bearing; every diagram number, ratio and derived note recomputes. |
| Mental model or practical value | 9 | "One size becomes three", the 1/32 per-expert intensity and the all-to-all blocks are mental models; the flags, LLM API names, kernel backends and the closing sizing order are practical. No block does neither. |
| Shape | 8 | Lead introduces MoE before the mechanism; h2 descriptions state payoffs; 37B of 671B and 6,600 tokens each land more than once; chart sources and the dense-playbook detail sit in ExpandableSections; it ends on the sizing order. The silicon table is long for a mid-section block. |
| Writing | 8 | No em-dashes, en-dash ranges, curly quotes or banned words (no-ai-tells gate clean). Attribution in prose is load-bearing (NVIDIA and DeepSeek quotes, "AWS positions" as vendor-claim). |
| Economy | 7 | Word count 1,717 to 2,129 (+24%, author's report). Cerebras's layer-boundary split appears in the table, the all-to-all grid and the capacity disclosure; DeepSeek's EP32 / EP320 appears in the roofline block and the disaggregation disclosure. |
| Diagrams | 9 | Two inline SVGs, role="img" with aria-labelledby titles that state the claim; narrow layouts below 560 px. Re-shot at 1440 and 390: probe "2 SVG diagram(s), 0 React Flow, ok" at both; PNGs read, no overlap or clipping, labels legible at 390. The narrow chart drops the k-of-N column (kept in the table). |

## Claims

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
|---|---|---|---|---|---|
| 1 | DeepSeek-V3 holds 671B parameters, activates 37B per token | deepseekV3Readme | CONFIRMED | "671B total parameters with 37B activated for each token" (README l.53; table l.100) | |
| 2 | DeepSeek-V4-Pro, Qwen3.8, Kimi K3 are MoE of 1.6T to 2.8T | deepseekV41Flash, qwen38Readme, kimiK3Readme | CONFIRMED | "# Backbone Params ... 1.6T" (V4.1-Flash README table); "2.4T in total and 95B activated"; "a 2.8T-parameter model" | |
| 3 | 18x fewer bytes than a dense model of its size (671 / 37 = 18.1) | deepseekV3Readme, derived | CONFIRMED | 671 / 37 = 18.14 | |
| 4 | 8 of 256 routed experts, each expert sees about 1/32 of the batch | deepseekV3Config, derived | CONFIRMED | `"num_experts_per_tok": 8`, `"n_routed_experts": 256` | |
| 5 | Caption: 8 of 256 routed plus 1 shared | deepseekV3Config | CONFIRMED | `"n_shared_experts": 1` | |
| 6 | Diagram note and caption: 37B of 671B (5.5%), 8 of 256 (3.1%) | deepseekV3Readme, deepseekV3Config, derived | CONFIRMED | 37 / 671 = 5.51%; 8 / 256 = 3.125% | |
| 7 | Router score is a sigmoid in DeepSeek-V3 | deepseekV3Config | CONFIRMED | `"scoring_func": "sigmoid"` | |
| 8 | Router score is a sigmoid in Kimi K2 | kimiK2Config | CONFIRMED | `"scoring_func": "sigmoid"` | |
| 9 | sqrtsoftplus in DeepSeek-V4 | deepseekV4ProConfig | CONFIRMED | `"scoring_func": "sqrtsoftplus"` (V4-Pro-0813 at 72e1d32; V4-Flash-0731 at 7872f01 says the same) | |
| 10 | DeepSeek-V3 ships FP8 weights, one byte each | deepseekV3Config | CONFIRMED | `"quant_method": "fp8"`, `"fmt": "e4m3"` | |
| 11 | Batch 1 reads about 37 GB per token vs 671 GB dense, 70 GB for dense 70B at 8-bit | deepseekV3Readme, derived | CONFIRMED | parameters x 1 byte | |
| 12 | Router about 0.5% of expert multiply-adds (1.8M vs 396M) | deepseekV3Config, derived | CONFIRMED | `hidden_size` 7168, `n_routed_experts` 256, `moe_intermediate_size` 2048: 7,168 x 256 = 1,835,008; 9 x 3 x 7,168 x 2,048 = 396,361,728; ratio 0.46% | |
| 13 | Mixtral 8x7B 46.7B / 12.9B, 2 of 8 | mixtralBlog, mixtralConfig | CONFIRMED | "Mixtral has 46.7B total parameters but only uses 12.9B parameters per token"; `"num_experts_per_tok": 2`, `"num_local_experts": 8` | |
| 14 | Qwen3-Next-80B-A3B 80B / 3B, 10 of 512 +1 | qwen3NextReadme | CONFIRMED | "80B in total and 3B activated"; "Number of Experts: 512 / Activated Experts: 10 / Shared Experts: 1" (README l.41, 54-56) | |
| 15 | gpt-oss-120b 117B / 5.1B, 4 of 128 | gptOss120bReadme, gptOss120bConfig | CONFIRMED | "(117B parameters with 5.1B active parameters)"; `"experts_per_token": 4`, `"num_local_experts": 128` | |
| 16 | Qwen3-235B-A22B 235B / 22B, 8 of 128 | qwen3Readme | CONFIRMED | "235B in total and 22B activated"; "Number of Experts: 128 / Activated Experts: 8" | |
| 17 | DeepSeek-V4-Flash 284B / 13B, 6 of 256 +1 | deepseekV41Flash, deepseekV4FlashConfig | CONFIRMED | "# Backbone Params 284B", "# Activated Params 13B" (V4-Flash-Base column); config `n_routed_experts` 256, `num_experts_per_tok` 6, `n_shared_experts` 1 | |
| 18 | Llama 4 Maverick 400B / 17B, 1 of 128 +1 | llama4Blog | CONFIRMED | "Llama 4 Maverick models have 17B active parameters and 400B total parameters ... MoE layers use 128 routed experts and a shared expert. Each token is sent to the shared expert and also to one of the 128 routed experts." | |
| 19 | DeepSeek-V3 671B / 37B, 8 of 256 +1 | deepseekV3Readme, deepseekV3Config | CONFIRMED | as rows 1, 4, 5 | |
| 20 | Kimi K2 1T / 32B, 8 of 384 +1 | kimiK2Readme | CONFIRMED | "Total Parameters 1T / Activated Parameters 32B / Number of Experts 384 / Selected Experts per Token 8 / Number of Shared Experts 1" (README l.71-80) | |
| 21 | DeepSeek-V4-Pro 1.6T / 49B, 6 of 384 +1 | deepseekV41Flash, deepseekV4ProConfig | CONFIRMED | "1.6T", "49B" (V4-Pro-Base column); config `n_routed_experts` 384, `num_experts_per_tok` 6, `n_shared_experts` 1 | |
| 22 | Qwen3.8-2.4T-A95B 2.4T / 95B, 10 of 512 +1 | qwen38Readme | CONFIRMED | "2.4T in total and 95B activated"; "Number of Experts: 512 / Number of Activated Experts: 10 Routed + 1 Shared" | |
| 23 | Kimi K3 2.8T / 104B, 16 of 896 +2 | kimiK3Readme | CONFIRMED | "Total Parameters 2.8T / Activated Parameters 104B / Number of Experts 896 / Selected Experts per Token 16 / Number of Shared Experts 2" | |
| 24 | Ratios: V4-Pro 33:1, K2 31:1, K3/Qwen3.8/Qwen3-Next 25 to 27:1, V3 18:1, Mixtral 3.6:1 (and the chart's ratio column) | model cards, derived | CONFIRMED | 32.65, 31.25, 26.9, 25.3, 26.7, 18.1, 3.62; chart also V4-Flash 21.8, gpt-oss 22.9, Qwen3-235B 10.7, Maverick 23.5, rounded as drawn | |
| 25 | DeepSeek-V3 to Kimi K3: total 4.2x, active 2.8x | kimiK3Readme, derived | CONFIRMED | 2,800 / 671 = 4.17; 104 / 37 = 2.81 | |
| 26 | Chart title: totals 46.7B to 2.8T, active 3B to 104B, sparsest read about 3% | derived | CONFIRMED | 49 / 1,600 = 3.06%; 32 / 1,000 = 3.2% | |
| 27 | "DeepSeek-V4 counts are the card's backbone parameters" | deepseekV41Flash | CONFIRMED | row label "# Backbone Params" | |
| 28 | H200 FP8 ridge 412 FLOP/byte, 206 tokens per step, about 6,600 (6,592) in flight | h200Page, derived | CONFIRMED (note clarified) | "FP8 Tensor Core² 3,958 TFLOPS ... GPU Memory Bandwidth 4.8TB/s ... ² With sparsity." 3,958 / 2 = 1,979; 1,979 / 4.8 = 412; 412 / 2 = 206; 206 x 32 = 6,592. The note called 1,979 "Dense FP8" as if the page stated it. | note now shows the halving |
| 29 | DeepSeek decode unit: 40 nodes, 320 GPUs, EP320, one expert per GPU | deepseekV3Report | CONFIRMED | "The minimum deployment unit of the decoding stage consists of 40 nodes with 320 GPUs ... the MoE part uses EP320. For the MoE part, each GPU hosts only one expert" (§3.4.2, p.19) | |
| 30 | Quote "the batch size per expert is relatively small (usually within 256 tokens), and the bottleneck is memory access rather than computation." | deepseekV3Report | CONFIRMED | verbatim (§3.4.2, p.20) | |
| 31 | Prefill EP32 on 32 GPUs; quote "ensures that each expert processes a sufficiently large batch size." | deepseekV3Report | CONFIRMED | "4 nodes with 32 GPUs ... 32-way Expert Parallelism (EP32), which ensures that each expert processes a sufficiently large batch size" (§3.4.1, p.19) | |
| 32 | Dispatch and combine are the all-to-all, twice per MoE layer | deepEpReadme | CONFIRMED | "high-throughput and low-latency all-to-all GPU kernels, which are also known as MoE dispatch and combine" | |
| 33 | NVIDIA DeepSeek-R1 decode: about four routed experts per GPU, 64 GPUs hold all 256 | moeBlog | CONFIRMED | "typically around four experts per GPU, which requires 64 GPUs to accommodate the full 256 routed experts during decoding" | |
| 34 | 1.8 TB/s per GPU bidirectional (900 GB/s each way) | blackwellUltraBlog | CONFIRMED | "Per-GPU Bandwidth: 1.8 TB/s bidirectional (18 links x 100 GB/s)"; Table 1 lists 1,800 for Blackwell and Blackwell Ultra. 900 each way is the halving of a bidirectional figure. | |
| 35 | Quote "If the selected experts reside on GPUs that sit on different nodes ... such as InfiniBand." | moeBlog | CONFIRMED | verbatim | |
| 36 | Wide-EP path carries the all-to-all over MNNVL | wideEpReadme | CONFIRMED | "Custom EP communication kernels optimized for NVIDIA GB200 Multi-Node NVLink (MNNVL)" (README l.15) | |
| 37 | LLM API `moe_expert_parallel_size`, `moe_tensor_parallel_size`, `moe_cluster_parallel_size` | trtllmLlmArgs | CONFIRMED | fields at llm_args.py l.1952-1961 (v1.2.1) | |
| 38 | Their product must equal the MoE world size | trtllmMapping | CONFIRMED | "moe_tp_size * moe_ep_size * moe_cluster_size must equal to moe_world_size" (mapping.py l.121) | |
| 39 | DeepEP "V1 kernels" measured 153 GB/s EP8 NVLink and 51 GB/s EP64 RDMA on H800 with 400 Gb/s CX7, near ~160 and ~50 GB/s maxima | deepEpReadme | UNSUPPORTED (label only) | Numbers verbatim from the "Normal kernels with NVLink and RDMA forwarding" table: "Intranode 8 153 GB/s (NVLink)", "Internode 64 51 GB/s (RDMA)", "H800 (~160 GB/s NVLink maximum bandwidth) ... CX7 InfiniBand 400 Gb/s RDMA network card (~50 GB/s maximum bandwidth)". The README at v1.2.1 never says "V1". | "V1 kernels" to "normal kernels" |
| 40 | 16 CC-Cores per Trainium2 chip orchestrate collectives | trainium2Arch | CONFIRMED | "16 CC-Cores orchestrate collective communication among Trainium2 chips within and across instances" | |
| 41 | Trn3 switches connect every chip to every other, replacing the torus | trn3Arch | CONFIRMED | "The chip-to-chip topology features an all-to-all connectivity design, replacing the previous 2D-torus architecture" | |
| 42 | vLLM Neuron ships Wide-EP | neuronWhatsNew | CONFIRMED | "Wide expert parallelism (Wide-EP) for MoE models" (2.32.0) | |
| 43 | NxDI "now in maintenance mode" | nxdiMoe (cited) | UNSUPPORTED by the cited page | The NxDI MoE page has no "maintenance". What's New (2.32.0) states it: "NxD Inference (NxDI) — now in maintenance mode; no new feature releases are planned." | added `neuronWhatsNew` cite |
| 44 | NxDI still documents EP over All-Gather | nxdiMoe | CONFIRMED | "Currently, Expert Parallelism uses All-Gather to gather all tokens at all ranks" (v2.32.0 page) | |
| 45 | Cerebras splits a larger model at layer boundaries across systems | cerebrasInferenceBlog | CONFIRMED | "When models exceed the memory capacity of a single wafer, we split them at layer boundaries and map them to multiple CS-3 systems." | |
| 46 | vLLM `--enable-expert-parallel` | vllmArgUtils | CONFIRMED | arg_utils.py l.1246 at v0.31.0 | |
| 47 | vLLM MoE backends include `cutlass`, `flashinfer_trtllm`, `flashinfer_cutlass`, `flashinfer_cutedsl` | vllmKernelConfig | CONFIRMED | `MoEBackend = Literal[...]` at kernel.py l.118-141 (v0.31.0); anchor matches | |
| 48 | SGLang `--moe-a2a-backend` takes 12 values at v0.5.21, among them deepep, deepep_v2, flashinfer, mooncake, nixl, mori, pplx | sglangExecArgs | CONFIRMED | `choices=["none","deepep","mooncake","nixl","mori","ascend_fuseep","flashinfer","megamoe","deepep_v2","pplx","ascend_tp","flashinfer_megamoe"]` (12, "none" included) | |
| 49 | Large-scale EP in TensorRT-LLM from v0.21.0 | trtllmV021 | CONFIRMED | "Added large-scale EP support" (release v0.21.0, published 2025-08-04) | |
| 50 | NVFP4 MoE kernels "for mid-high concurrency" from v1.0.0 | trtllmV100 | CONFIRMED | "Add TRTLLM MoE nvfp4 cubins for mid-high concurrency" (release v1.0.0, 2025-09-24) | |
| 51 | GB200 NVL72: 72 GPUs on one NVLink Switch fabric, 130 TB/s per rack | gb200Nvl72 | CONFIRMED | "72 NVIDIA Blackwell GPUs ... NVLink Switch System provides 130 terabytes per second (TB/s)" | |
| 52 | LPX is in full production | lpxProduction | CONFIRMED | "NVIDIA Groq 3 LPX ... is now in full production" (August 24, 2026) | |
| 53 | In decode LPX runs FFN and MoE experts, Rubin GPUs keep prefill and decode attention, Dynamo orchestrates | lpxBlog | CONFIRMED | "LPX accelerates the latency-sensitive portions of the decode loop, including FFN and MoE expert execution, while Rubin GPUs continue to handle prefill and decode attention"; "NVIDIA Dynamo orchestrates the disaggregated decode loop" | |
| 54 | "Activations pass from GPUs to LPUs ... every layer" | lpxBlog | UNSUPPORTED | The blog says AFD "exchanges intermediate activations for each token" and "intermediate activations are handed off to LPUs for FFN/MoE execution, and outputs return to the GPUs"; it never says per layer. | softened to "between GPUs and LPUs ... for each token" |
| 55 | 500 MB SRAM per LPU, up to 512 GB DRAM per tray | lpxBlog | CONFIRMED | "Each LPU features 500 MB of compiler-managed SRAM"; tray table "DRAM via fabric expansion logic Up to 512 GB" | |
| 56 | NKI Library MoE kernels, Router Top-K among them, from Neuron 2.28.0 (February 2026) | nkiLibNotes | UNSUPPORTED (date only) | Kernels: "New core kernels include RoPE, Router Top-K, MoE CTE, MoE TKG, and Cumsum" (NKI-Lib 2.28.0). The NKI-Lib page gives no 2.28.0 date; What's New does: "AWS Neuron SDK 2.28.0 ... Posted on : February 26, 2026". | added `neuronWhatsNew` cite for the month |
| 57 | Blockwise MM Forward MXFP8 from 2.32.0 | nkiLibNotes | CONFIRMED | "Blockwise MM Forward MXFP8 — MXFP8 forward pass for blockwise (dropless) Mixture of Experts" (NKI-Lib 2.32.0, released 08/17/2026) | |
| 58 | Trn2: 64 chips; 1,024 GB/s in-instance plus 256 GB/s across, 1.28 TB/s total; 4x4 2D torus per instance, rings across four | trn2Arch, trainium2Arch | CONFIRMED | "Intra-instance NeuronLink-v3 bandwidth (GB/sec/chip) 1,024 ... Inter-instance ... 256"; "provides 1.28 TB/sec bandwidth per chip"; "4x4, 2D Torus topology"; "Trainium2 chips with the same coordinates in each Trn2 instance are connected in a ring topology" | |
| 59 | AllToAllV in the Neuron Runtime for Trn2 and Trn3 from 2.32.0 | neuronWhatsNew | CONFIRMED | "Runtime & Driver — Adds variable-size collectives (AllGatherV, ReduceScatterV, AllToAllV) ... on Trn2 and Trn3" (2.32.0) | |
| 60 | NKI `all_to_all_v` from 2.29.0 | neuronWhatsNew | CONFIRMED | "Variable-length all-to-all collectives are now available via nki.collectives.all_to_all_v" (under "AWS Neuron SDK 2.29.0") | |
| 61 | MXFP4 weights in vLLM Neuron | neuronWhatsNew | CONFIRMED | "MXFP4 weight quantization (Trn3)" | |
| 62 | Trn3: 64 (Gen1) or 144 (Gen2) chips on NeuronSwitch-v1 | trn3Arch | CONFIRMED | "Gen1 with 64 Trainium3 chips per UltraServer, and Gen2 with 144 chips per UltraServer. Both configurations use NeuronSwitch-v1" | |
| 63 | NeuronSwitch-v1, which AWS positions for MoE (vendor-claim) | trn3Page | CONFIRMED | "NeuronSwitch-v1, an all-to-all fabric ... reducing communication overhead for MoE and tensor-parallel training" | |
| 64 | Cerebras shared inference serves gpt-oss-120b at about 3,000 tokens/s (vendor-claim) | cerebrasModels | CONFIRMED | "gpt-oss-120b 120 billion 65k / 131k ~3000" | |
| 65 | "other models run as dedicated deployments" | cerebrasModels | WRONG | The shared catalog lists a second model, "Qwen 3.8 27B qwen-3.8-27b ... ~1850"; "Many additional model families are available through Dedicated Inference." | "more model families run as dedicated deployments" |
| 66 | GroqCloud production MoE models are gpt-oss-120b and gpt-oss-20b | groqModels | CONFIRMED | Production table: Llama 3.1 8B, Llama 3.3 70B, GPT OSS 120B, GPT OSS 20B, Whisper x2 | |
| 67 | Groq licenses to NVIDIA non-exclusively | groqNvidiaLicense | CONFIRMED | "entered into a non-exclusive licensing agreement with Nvidia for Groq's inference technology" (December 24, 2025) | |
| 68 | CoE routes each request to one of 150 experts, a trillion parameters | sn40lPaper | CONFIRMED | "Samba-CoE, a CoE system with 150 experts and a trillion total parameters" (abstract); "(1) Run the router to determine the expert, (2) Copy the expert from DDR to HBM, and (3) Run the expert" per prompt (§V) | |
| 69 | 8-socket SN40L node measured 3.7x a DGX H100 | sn40lPaper, measured | CONFIRMED | "the 8-socket RDU Node ... achieves an overall speedup of 3.7x over a DGX H100" (abstract) | |
| 70 | SN50 to ship in the second half of 2026 (roadmap) | sn50Blog | CONFIRMED | "will start shipping to customers in the second half of 2026" (February 24, 2026) | |
| 71 | Per socket 520 MiB SRAM, 64 GiB HBM, up to 1.5 TiB DDR; models load DDR to HBM | sn40lPaper | CONFIRMED | "The three memory tiers in SN40L are: 520 MiB of on-chip PMU SRAM, 64 GiB of co-packaged HBM, and up to 1.5 TiB of DDR DRAM ... Models are loaded from DDR to HBM" (§I) | |
| 72 | B300 288 GB of HBM3e per GPU | blackwellUltraBlog | CONFIRMED | "With 288 GB of HBM3e per GPU" | |
| 73 | B200 180 GB (DGX B200 1,440 GB / 8) | dgxB200, derived | CONFIRMED | "GPU 8x NVIDIA Blackwell GPUs GPU Memory 1,440 GB total" | |
| 74 | GB300 NVL72 holds 20 TB | gb300Nvl72 | CONFIRMED | "GPU Memory / Bandwidth 20 TB / Up to 576 TB/s" | |
| 75 | Trn2 UltraServer 6,144 GiB across 64 chips | trn2Arch | CONFIRMED | "Device Memory (GiB) 1,536 6,144" (instance, UltraServer) | |
| 76 | 144-chip Trn3 Gen2 UltraServer 20,736 GiB | trn3Arch | CONFIRMED | "Device Memory (GiB) 9,216 20,736" | |
| 77 | Cerebras 44 GB of SRAM per wafer | cerebrasInferenceBlog | CONFIRMED | "integrate 44GB of SRAM on a single chip" | |
| 78 | DeepSeek-V3.2 690 GB FP8 to 415 GB NVFP4, about 1.66x | deepseekV32Files, deepseekV32Nvfp4Files, deepseekV32Nvfp4Card | CONFIRMED | Tree API at pinned SHAs: 163 safetensors, 689.48 GB and 415.06 GB; card: "reducing the disk size and GPU memory requirements by approximately 1.66x" | |
| 79 | NVFP4: 4-bit with an FP8 scale per 16-value block | nvfp4Blog | CONFIRMED | "4 bits (1 sign, 2 exponent, 1 mantissa) plus 1 shared FP8 scale per 16 value block" | |
| 80 | DeepSeek-V4-Pro stores experts in FP4 | deepseekV4ProConfig | CONFIRMED | `"expert_dtype": "fp4"` | |
| 81 | Kimi K3 trains with MXFP4 weights | kimiK3Readme | CONFIRMED | "quantization-aware training from the SFT stage onward, using MXFP4 weights with MXFP8 activations" | |
| 82 | gpt-oss-120b ships MXFP4 MoE weights | gptOss120bConfig | CONFIRMED | `"quant_method": "mxfp4"`, attention and router in `modules_to_not_convert` | |
| 83 | Dynamo disaggregates prefill and decode for SGLang, TensorRT-LLM, vLLM | dynamoReadme | CONFIRMED | feature matrix "Disaggregated Serving ✅ ✅ ✅" under SGLang, TensorRT-LLM, vLLM (README v1.5.1 l.64-66) | |
| 84 | GPUs run attention over KV, hand activations to LPUs for FFN and MoE; NVIDIA calls it AFD | lpxBlog | CONFIRMED | "attention–FFN disaggregation (AFD)"; "GPUs run attention over the accumulated KV cache, intermediate activations are handed off to LPUs for FFN/MoE execution" | |
| 85 | Prefill about 2 x 37B FLOPs per token vs 2 x 671B dense | deepseekV3Readme, derived | CONFIRMED | arithmetic | |
| 86 | Closing: about 6,600 tokens per step for DeepSeek-V3 on H200 FP8 | h200Page, derived | CONFIRMED | 206 x 256 / 8 = 6,592 | |
| 87 | `llama4Blog` record title "The Llama 4 herd (Llama 4 Scout and Maverick announcement)" | llama4Blog | MISLABELLED | Page title (og:title and h1): "The Llama 4 herd: The beginning of a new era of natively multimodal AI innovation", dated "April 5, 2025" | title replaced, date added, accessed 2026-10-18 |
| 88 | Cerebras: each layer's experts share one wafer's SRAM, so expert routing stays on the wafer | cerebrasInferenceBlog | CONFIRMED (deduction) | Follows from the layer-boundary split in row 45 as long as one layer fits a wafer: a DeepSeek-V3 MoE layer is 256 x 3 x 7,168 x 2,048 bytes = 11.3 GB at FP8, under 44 GB. The blog does not discuss MoE. | |

## ORCH-NOTES items

1. **Llama 4 announcement record (title, date, figures): title MISLABELLED, figures
   CONFIRMED, fixed.** Fetched https://ai.meta.com/blog/llama-4-multimodal-intelligence/
   on 2026-10-18. The page title (og:title and h1) is "The Llama 4 herd: The beginning
   of a new era of natively multimodal AI innovation", dated "April 5, 2025". The
   record's "The Llama 4 herd (Llama 4 Scout and Maverick announcement)" was a
   paraphrase; replaced with the real title plus date, accessed set to 2026-10-18.
   Figures: "Llama 4 Maverick models have 17B active parameters and 400B total
   parameters ... MoE layers use 128 routed experts and a shared expert. Each token is
   sent to the shared expert and also to one of the 128 routed experts." The chart's
   400B / 17B / 1 of 128 +1 all match. The section uses no Llama 4 Scout figure.
2. **Model lineup against pinned revisions: CONFIRMED, all pinned.** All eleven rows
   (claims 13 to 23) match their pinned card or config, read raw at the SHA: Mixtral
   fc7ac94, Qwen3-Next 9c7f2fb, gpt-oss-120b b5c939d, Qwen3-235B 8efa617,
   DeepSeek-V4.1-Flash 314113f (V4-Flash and V4-Pro backbone and active counts),
   DeepSeek-V4-Flash-0731 7872f01, DeepSeek-V4-Pro-0813 72e1d32, DeepSeek-V3 e815299,
   Kimi K2 fd1984e, Qwen3.8 207bd68, Kimi K3 f831ab6; DeepSeek-V3.2 a7e62ac and
   NVFP4 7c0f62c for the file sizes. Every Hugging Face URL in the file carries a
   40-character commit SHA; none uses `main`. The pinned-refs gate passes for this
   file. Llama 4 Maverick is the one row backed only by a Tier 2 blog (see Backlog).
3. **Wide-EP and TensorRT-LLM version claims: CONFIRMED; the corrected claim is gone.**
   v0.21.0 release notes (GitHub API, published 2025-08-04): "Added large-scale EP
   support". v1.0.0 (2025-09-24): "Add TRTLLM MoE nvfp4 cubins for mid-high
   concurrency". The section says "Large-scale EP in TensorRT-LLM from v0.21.0" and
   NVFP4 MoE kernels "for mid-high concurrency" from v1.0.0. The old "Wide-EP (EP > 8)
   shipped in TensorRT-LLM v0.21.0" wording is absent (grep for "EP > 8" and "cubin"
   in the section and both components returns nothing). The wide_ep links are pinned
   to v1.2.1 and the README states the MNNVL kernels.

## Fixes applied

| File:line (after) | Before | After |
|---|---|---|
| src/sections/MoeAndSparseActivation.tsx:59 | "Activations pass from GPUs to LPUs (Language Processing Units) every layer." | "Activations pass between GPUs and LPUs (Language Processing Units) for each token." |
| src/sections/MoeAndSparseActivation.tsx:70-72 | "2.28.0 (February 2026); Blockwise MM Forward ..." cited to nkiLibNotes only | `<Cite s={S.neuronWhatsNew} />` added after "(February 2026)" (What's New: "Posted on : February 26, 2026") |
| src/sections/MoeAndSparseActivation.tsx:109-110 | "other models run as dedicated deployments." | "more model families run as dedicated deployments." |
| src/sections/MoeAndSparseActivation.tsx:346 | note "Dense FP8 1,979 TFLOPS / 4.8 TB/s = 412 ..." | note "FP8 3,958 TFLOPS with sparsity, so 1,979 dense; 1,979 TFLOPS / 4.8 TB/s = 412 ..." |
| src/sections/MoeAndSparseActivation.tsx:405 | "DeepSeek's DeepEP V1 kernels measured" | "DeepSeek's DeepEP normal (high-throughput) kernels measured" |
| src/sections/MoeAndSparseActivation.tsx:421-422 | "now in maintenance mode, still documents EP over All-Gather." (nxdiMoe only) | `<Cite s={S.neuronWhatsNew} />` added after "maintenance mode" |
| src/sources/MoeAndSparseActivation.ts:145-150 | llama4Blog title "The Llama 4 herd (Llama 4 Scout and Maverick announcement)", accessed 2026-10-16 | "The Llama 4 herd: The beginning of a new era of natively multimodal AI innovation (2025-04-05)", accessed 2026-10-18 |

No diagram, table structure or content was added or restructured.

## Checks

Run from the dive root after the last edit:

- `pnpm exec tsc --noEmit`: exit 0; no type errors in my files.
- `pnpm exec eslint src/sections/MoeAndSparseActivation.tsx src/sources/MoeAndSparseActivation.ts src/components/MoeRoutingDiagram.tsx src/components/MoeParamsChart.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t MoeAndSparseActivation`: exit 0 (1 passed, 34 skipped).
- `pnpm exec vitest run src/__tests__/sources.test.ts`: exit 1, one failure only, "keeps sources.md in sync with the registry" (sources.md not regenerated; this section's new records and the llama4Blog title change). The same-tier-per-URL test passes.
- Gates from the repo root: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0, pre-overflow exit 0; no hits in my files.
- No diagram changed; I re-shot anyway for the Diagrams score. `pnpm exec vite build --outDir /tmp/vf-MoeAndSparseActivation-dist --emptyOutDir` exit 0; `node scripts/shoot.mjs --sections moe --widths 1440,390 ...`: "moe @1440: 2 SVG diagram(s), 0 React Flow, ok", "moe @390: 2 SVG diagram(s), 0 React Flow, ok". Read moe-1440-svg0/svg1 and moe-390-svg0/svg1: no overlap, no clipping, legible at 390.

## For the orchestrator

- Regenerate `sources.md`: line 372 still carries the old Llama 4 title and accessed date 2026-10-16.
- `deepEpReadme` title "DeepEP README at tag v1.2.1 (V1 kernel performance tables)" appears in both `src/sources/MoeAndSparseActivation.ts` and `src/sources/CommunicationAndScaleOut.ts`. The README at v1.2.1 names that table "Normal kernels with NVLink and RDMA forwarding" and never says "V1". I left the title unchanged so the two records stay identical; suggest "(normal kernel performance tables)" in both. `CommunicationAndScaleOut.tsx:386-387` says "its V1 kernels measured 153 GB/s" and has the same label problem.
- The H200 FP8 figure is 3,958 TFLOPS "With sparsity" on the page; any section whose derived note calls 1,979 "dense FP8" without showing the halving should show it, as `QuantizationAndPrecision.tsx:352` already does.

## Backlog

- Economy: say Cerebras's layer-boundary split once (it is in the silicon table, the all-to-all grid and the capacity disclosure), and say DeepSeek's EP32 / EP320 layout once.
- Llama 4 Maverick row: add the pinned Hugging Face config (the register cites revision 73d14711, gated) as a Tier 1 source next to the Tier 2 blog.
- Kimi K2 row cites only the README; the pinned config (`num_experts_per_tok` 8, `n_routed_experts` 384, `n_shared_experts` 1) already backs the sigmoid claim and could back the routing column too.
- The narrow (390 px) parameters chart drops the k-of-N column; it is in the table below, but a phone reader of the chart alone loses it.
