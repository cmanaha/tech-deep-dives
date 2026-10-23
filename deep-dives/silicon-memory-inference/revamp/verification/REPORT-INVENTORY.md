# Revamp report inventory: Silicon, Memory, and Modern Inference

Baseline: commit b39b4d377b00ac0267cdb69ff66f84951640a22e (the commit before the revamp).

## Part 1: Sections changed or added

Reading order and reader titles from `src/App.tsx` and `src/sectionTitles.ts`. Status
from `git diff --stat b39b4d3 -- src/sections/<Section>.tsx` (every section file
changed; HighBandwidthFlash and FlashCacheTier are new files). Content from
`revamp/authoring/<Section>.md` as amended by the fixes in
`revamp/verification/<Section>.md`.

| # | Section | Status | New or updated in this refresh |
| --- | --- | --- | --- |
| 1 | Thesis and Framing | changed | H200 anchors: 1,979 dense FP8 TFLOPS, ridge 412, decode 2 to 10 FLOP/byte; NVIDIA Groq 3 LPX racks pair with Vera Rubin (production August 2026) |
| 2 | The Heterogeneity Fact | changed | Bet table adds NVIDIA Groq 3 LPX (500 MB SRAM per LPU), 144-chip Trn3 UltraServer, 1.2 PB WSE-3 training memory; mispredict 10 to 14 cycles |
| 3 | Roofline and Arithmetic Intensity | changed | Ridge matrix, eight chips at BF16, FP8, FP4 (H200 206 and 412, Rubin NVFP4 1,591); 70B FP8 on one H200 caps near 69 tokens/s |
| 4 | Memory Hierarchy Primer | changed | p5en host DRAM: 75x less bandwidth than HBM for under 2x capacity; ten-tier tower from 256 KB registers to 30.4 TB NVMe, HBF as roadmap |
| 5 | Anatomy of a Kernel Execution | changed | Two schedulers (GigaThread across SMs, a warp scheduler per SM); H800 latencies 29 SMEM, 263 L2, 479 global cycles; CUDA Graphs and PDL shorten launches |
| 6 | HBM and the Bandwidth Wall | changed | Nine-chip table adds Rubin, MI355X, MI455X, Trainium3, TPU7x and sweeps per second; HBM4 ships at up to 3.3 TB/s per stack (Samsung) |
| 7 | DDR5, MRDIMM, LPDDR5X and CXL | changed | Graviton5 DDR5-8800 gives 844.8 GB/s; EPYC 9006 MRDIMM-12800 1,638 GB/s on 16 channels; Vera SOCAMM2 at 1.2 TB/s; CXL adds about 110 ns per load |
| 8 | High Bandwidth Flash | added | HBF stack: 16 NAND dies, 512 GiB, up to 3.072 TB/s; about 3 sweeps/s against HBM4's 80; fits MoE expert pools; samples targeted for 2027 |
| 9 | Flash as a Cache Tier for Inference | added | 30.4 TB of P5/P6 instance-store NVMe as a KV tier: 8K-prefix break-even 17.1 GB/s per node (70B, H100); enable host DRAM first |
| 10 | Chiplet and Interconnect | changed | Turin core to core: 45 ns in a CCD, 150 ns across; UCIe 3.0 at 48 and 64 GT/s; UALink Chiplet Specification 1.0 (April 2026) |
| 11 | Graviton Deep Dive | changed | Graviton5: 192 cores in one package, two NUMA nodes with 96 MB LLC each, DDR5-8800 at 844.8 GB/s, 4.4 GB/s per core (21% below Graviton4) |
| 12 | AMD EPYC Turin | changed | 45 ns inside a CCD, 150 ns across; NPS1 first; X8aedz and Hpc8a; EPYC 9006 in production; SDCI checklist (AMD-measured 55 to 76 ns) |
| 13 | Intel Xeon 6 | changed | r8i's 6985P-C as three SNC3 NUMA nodes (160 MB L3 each, 691.62 GB/s measured); oneDNN v3.13.4 AMX checks; Xeon 6+ (Q2 2026), Diamond Rapids roadmap |
| 14 | NVIDIA Hopper: H100 and H200 | changed | Four P5-family sizes including single-GPU p5.4xlarge; H200's 1.9x split into 1.43x bandwidth and batch; wgmma needs sm_90a; P5 and P5en price cuts (44%, 25%) |
| 15 | NVIDIA Blackwell: B200 and B300 | changed | Per HGX board, B300 trades INT8 (72 to 3 POPS) and FP64 (296 to 10 TFLOPS) for 1.5x dense NVFP4; Vera Rubin shipping |
| 16 | Grace-Blackwell and UltraServer | changed | UltraServer sizes u-p6e-gb200x72 (13,320 GB) and x36; GB300 NVL72 dense NVFP4 1,080 PFLOPS; NUMA binding with CDMM from R580; Vera Rubin NVL72 20.7 TB HBM4 |
| 17 | Edge Shared-Memory Silicon: DGX Spark and Jetson | changed | Jetson AGX Thor (128 GB, 273 GB/s, two-way coherence) joins DGX Spark and Orin Nano Super; size against 122 GB; gpt-oss-120b at 55.37 tokens/s (NVIDIA) |
| 18 | NVIDIA Compilers and Kernel Tooling | changed | PyTorch v2.14.1 Inductor: matmuls go to cuBLAS by default, Triton GEMMs under max-autotune, CUTLASS and CuTe DSL via max_autotune_gemm_backends; Gluon, cuTile 1.6.0 |
| 19 | AWS Trainium, Inferentia and Neuron | changed | Trainium3: 8 NeuronCore-v4, 144 GiB at 4.9 TB/s; Trn2 torus reaches 6 of 63 chips directly, Trn3 is switched; Trn3 UltraServer up to 144 chips |
| 20 | AWS Compilers and Kernel Tooling | changed | neuronx-cc defaults to --auto-cast=none since SDK 2.27.0; TorchNeuron public beta in Neuron 2.33.0; vLLM Neuron serving path; Neuron Explorer replaces Neuron Profiler (2.32.0) |
| 21 | Cerebras Wafer-Scale | changed | CS-4: three WSE-3T per rack, 250 PFLOPS sparse FP16, 2 µs between wafers; ridge 6 FLOP/byte or less; gpt-oss-120b spans wafers; CS-3 on Bedrock announced |
| 22 | Groq, SambaNova and Dataflow | changed | NVIDIA Groq 3 LPX rack: 256 LPUs, 128 GB SRAM against 288 GB HBM4 on one Rubin GPU; SambaNova SN50 targets H2 2026 |
| 23 | Compute-in-Memory | changed | DRAM fetch costs about 200x the MAC; HBM2-PIM: 4.92 against 1.23 TB/s; GPT-J and T5-MoE gains up to 3.61x; d-Matrix Corsair; JEDEC LPDDR6 PIM pending |
| 24 | KV Cache and FlashAttention | changed | KV bytes per token: 327,680 B (Llama 3.1 70B) to 890 B global cache (DeepSeek-V4.1-Flash), a 368x spread; FlashAttention-4 beta for Blackwell |
| 25 | Mixture of Experts and Sparse Activation | changed | Eleven models up to Kimi K3 (2.8T total, 104B active); Trn3 UltraServer and LPX rows; about 6,600 tokens in flight for DeepSeek-V3 on H200 |
| 26 | Small Language Models | changed | Fourteen-model lineup (0.87B to 14B, pinned revisions); naive 4-bit costs Llama 3.2 1B 11 GSM8K points, so start from vendor QAT checkpoints; shipped MTP drafters |
| 27 | Quantization and Precision | changed | MXFP8 rung; INT8 runs at 1/24 of FP8 on B300 and 1/70 on Rubin, so requantize; DeepSeek-V3.2 NVFP4 is 415 GB (1.66x smaller than FP8) |
| 28 | Disaggregated Serving and Speculative Decoding | changed | 8K Llama 3.1 70B KV (2.68 GB) crosses EFA in 6.7 ms per instance, 54 ms per P5 GPU; EFA backend settings; speculative-decoding formula |
| 29 | Communication and Scale-Out | changed | Five-row EFA table (P6-B300 6,400 Gbps, Trn3 Gen2 UltraServer 28,800); NCCL EP v0.1.0; NIXL on trn2.48xlarge needs 16 EFA interfaces; DeepEP 153 versus 51 GB/s |
| 30 | Isolation: NIE and MIG | changed | NIE proof scope (Isabelle/HOL, about 330,000 lines, three of five lifecycle parts); MIG profiles A100 to GB300 (7 x 34 GB); pre-deploy checks |
| 31 | Determinism: NEFF and GPU Reproducibility | changed | Batch, not chip, decides repeatability; vLLM VLLM_BATCH_INVARIANT=1 (beta) and SGLang --enable-deterministic-inference; PyTorch and cuBLAS settings; Neuron rounding seed and bucket pins; replay checklist |
| 32 | Capital Markets Lens | changed | Multicast UDP feeds take kernel bypass (Onload, ef_vi, DPDK), EFA stays in-cluster; FRTB trading-book rule dates (EU 2027, UK IMA 2028); NIE proof's five exclusions |
| 33 | Glossary and Sources | changed | 257 glossary entries; 475 distinct sources generated from the section records by tier (5 T0, 298 T1, 129 T2, 43 T3), each listing citing sections |

## Part 2: New diagrams

From `git diff --name-status b39b4d3 -- src/components` (status A, Cite.tsx excluded),
the importing section file and each component's SVG `<title>`. All eight are inline SVG.

| Component | Section that renders it | What it shows |
| --- | --- | --- |
| HbfStackDiagram | High Bandwidth Flash | One HBF stack: 16 NAND dies on controller base die, 16 UCIe channels, 512 GiB |
| HbfPackageDiagram | High Bandwidth Flash | Four package layouts mixing HBM and HBF stacks, from 192 GB to 4,096 GB |
| HbfSweepsChart | High Bandwidth Flash | Bandwidth over capacity: HBF 1.4 to 5.6 sweeps/s, HBM4 78 to 92, LPDDR5X 0.8 |
| HbfPlacementMap | High Bandwidth Flash | Which inference data fits HBF, placed by reads per write and share read per step |
| FlashTierLadder | Flash as a Cache Tier for Inference | Per-GPU bandwidth (HBM 4,800 to NVMe 2.25 GB/s) and capacity of each KV tier |
| FlashBreakEvenChart | Flash as a Cache Tier for Inference | Break-even tier bandwidth per 8-GPU node by prefix length, against AWS tier rates |
| FlashMemoryClock | Flash as a Cache Tier for Inference | How long HBM, host DRAM and instance store retain new prefixes, against reuse gaps |
| FlashBlockIoDiagram | Flash as a Cache Tier for Inference | Layer-wise (80 x 8 KiB) or page-first (one read) KV layout; BaM's GDS I/O-size curve |

### Substantially redrawn

Metric: deleted lines as a share of the component's line count at b39b4d3, from
`git diff --numstat b39b4d3 -- src/components` at HEAD 22bd90f (re-run after the
Determinism and Capital Markets verification commits; the figures did not move). 30 of
the 31 modified components exceed 40%. The one below it is SparkTopologyCapture (Edge Shared-Memory Silicon, 35%,
13 of 37 lines), the checked-in lstopo capture of a physical DGX Spark; only its
wrapper changed.

| Component | Section | Changed | What it shows |
| --- | --- | --- | --- |
| TriangleDiagram | Thesis and Framing | 41% | React Flow triangle: instruction, operand data and data shape must all reach the functional unit |
| RooflineChart | Roofline and Arithmetic Intensity | 91% | H200 roofline (BF16 ridge 206, FP8 ridge 412) plus a dense ridge-point plot grouped by precision |
| MemoryHierarchyTower | Memory Hierarchy Primer | 77% | 256 KB SM register file down to 30.4 TB NVMe per instance, with HBF beside HBM as a roadmap tier |
| KernelLifecycleDiagram | Anatomy of a Kernel Execution | 85% | Seven stages of one NVIDIA kernel launch, host queue to GigaThread engine to warp scheduler to TMA |
| HbmStackDiagram | HBM and the Bandwidth Wall | 76% | Twelve-high DRAM stack on a base die; 1,024 bits per stack for HBM3/3e, 2,048 for HBM4 |
| MemoryTechGrid | DDR5, MRDIMM, LPDDR5X and CXL | 82% | Six places for bytes: DDR5, MRDIMM, LPDDR5X, CXL (64 GB/s per x16, +110 ns), NVMe, HBF |
| ChipletPathDiagram | Chiplet and Interconnect | 94% | EPYC Turin load path L1, L2, 32 MB L3, GMI, IO die; 45 ns in a CCD, 150 ns across |
| GravitonComparison | Graviton Deep Dive | 77% | Graviton4 one NUMA node (537.6 GB/s) against Graviton5 two nodes (844.8 GB/s, 21% less per core) |
| EpycTurinTopology | AMD EPYC Turin | 79% | 16 CCDs on GMI links to an IO die with 12 DDR5 controllers, NPS4 quadrants, 45 and 150 ns |
| Xeon6Topology | Intel Xeon 6 | 88% | Xeon 6 6985P-C on r8i: three compute tiles, two IO dies, SNC3 NUMA nodes with DDR5-7200 |
| HopperSmDiagram | NVIDIA Hopper: H100 and H200 | 83% | TMA copies HBM to L2 to shared memory; wgmma operand sources; 29, 263 and 479 cycle latencies |
| BlackwellDieDiagram | NVIDIA Blackwell: B200 and B300 | 74% | Two dies over 10 TB/s NV-HBI as one CUDA device; tcgen05.mma accumulates in 256 KB TMEM |
| Nvl72Diagram | Grace-Blackwell and UltraServer | 74% | GB200 NVL72: 36 superchips, 900 GB/s NVLink-C2C, 1.8 TB/s per GPU, DeepSeek-R1 decode on 64 GPUs |
| EdgeSocComparisonDiagram | Edge Shared-Memory Silicon: DGX Spark and Jetson | 75% | Unified LPDDR pools: DGX Spark and AGX Thor 128 GB at 273 GB/s, Orin Nano Super 8 GB at 102 GB/s |
| NvidiaCompilerStack | NVIDIA Compilers and Kernel Tooling | 73% | React Flow PyTorch-to-SASS paths per PyTorch v2.14.1 Inductor: ATen default, Triton GEMM under max-autotune |
| TrainiumChipDiagram | AWS Trainium, Inferentia and Neuron | 81% | Trainium2: eight NeuronCore-v3 (28 MiB SBUF, 2 MiB PSUM), 96 GiB at 2.9 TB/s; Trn2 torus and Trn3 switches |
| AwsCompilerStack | AWS Compilers and Kernel Tooling | 70% | React Flow neuronx-cc stages; NKI kernels skip the first three and enter at the back end |
| CerebrasWaferDiagram | Cerebras Wafer-Scale | 71% | WSE-3 (46,225 mm², 57x an H100 die) to scale; layer-boundary split across wafers, 2 µs CS-4 links |
| DataflowSiliconDiagram | Groq, SambaNova and Dataflow | 72% | Groq 3 LPU 500 MB SRAM at 150 TB/s with LPX beside Vera Rubin NVL72; SambaNova SN40L tiers |
| CimDiagram | Compute-in-Memory | 91% | Conventional bus path against HBM2-PIM: 4.92 TB/s inside the memory, 1.23 TB/s over the host link |
| KvCacheDiagram | KV Cache and FlashAttention | 59% | KV size formula, and MHA, GQA, MQA and MLA shrinking the KV-head term |
| MoeRoutingDiagram | Mixture of Experts and Sparse Activation | 97% | One token's routing: top-k plus shared expert; DeepSeek-V3 reads 37B of 671B (5.5%) |
| MoeParamsChart | Mixture of Experts and Sparse Activation | 92% | Eleven MoE models, active against total, 46.7B to 2.8T; sparsest 33:1 (DeepSeek-V4-Pro) |
| SlmParamsChart | Small Language Models | 61% | Fourteen SLMs from 0.87B to 14B; Gemma 4 E2B and E4B stored against effective parameters |
| PrecisionLadder | Quantization and Precision | 72% | FP64 down to 4-bit; MXFP8, NVFP4 and MXFP4 block scales cost a quarter or half a bit |
| DisaggregatedServingDiagram | Disaggregated Serving and Speculative Decoding | 93% | Prefill and decode pools; KV crosses once via NIXL (GPU) or the Neuron runtime (Trainium); LPX split |
| CommunicationStack | Communication and Scale-Out | 58% | Stack per domain: NVLink, EFA via aws-ofi-nccl and NIXL libfabric, SRD over 64 paths, Neuron collectives |
| IsolationLayers | Isolation: NIE and MIG | 92% | NIE with its Isabelle/HOL proof scope, MIG up to seven partitions, Neuron runtime isolation |
| DeterminismDiagram | Determinism: NEFF and GPU Reproducibility | 84% | Trainium pins (NEFF, rounding seed, bucket, SDK) against NVIDIA deterministic-algorithm settings |
| TickToTradeDiagram | Capital Markets Lens | 71% | Seven tick-to-trade stages; kernel bypass via Onload, ef_vi or DPDK at both ends |

## Part 3: Pinned versions and commits verified against

Extracted by `/tmp/inventory-extract/extract.py` (kept outside the worktree) from the
853 `url` records in `src/sources/*.ts` (475 distinct URLs). "Sections citing it" means
the section source files that hold a record with that URL, the same rule the Sources
appendix uses (`src/sources/index.ts`). Every GitHub URL carries a tag or a commit;
none points at a moving branch. One Hugging Face record is a live API query with no
revision (meta-llama models sorted by creation date, Small Language Models).
Versioned documentation is pinned either in the URL path or, where the vendor serves
only a current page, in the record title ("Pinned in: title").

### GitHub tags and commits

| Repository | Tag or commit | Sections citing it |
| --- | --- | --- |
| ai-dynamo/dynamo | tag `v1.5.1` | Flash as a Cache Tier for Inference; Mixture of Experts and Sparse Activation; Disaggregated Serving and Speculative Decoding; Communication and Scale-Out |
| ai-dynamo/nixl | tag `v1.5.0` | Flash as a Cache Tier for Inference; Disaggregated Serving and Speculative Decoding; Communication and Scale-Out |
| aws-neuron/nki-library | tag `2.32` | AWS Compilers and Kernel Tooling |
| aws-neuron/torch-neuronx | tag `v2.33.0` | AWS Compilers and Kernel Tooling |
| aws/aws-graviton-getting-started | commit `8b322a4160b827be202beedaf35ce21b4c635603` | The Heterogeneity Fact; Memory Hierarchy Primer; DDR5, MRDIMM, LPDDR5X and CXL; Chiplet and Interconnect; Graviton Deep Dive; Grace-Blackwell and UltraServer; Small Language Models; Capital Markets Lens |
| aws/aws-ofi-nccl | tag `v1.21.1` | Communication and Scale-Out |
| cmanaha/tech-deep-dives | commit `d65693b49ca8245ff06cd8c452e47f70a3e8c3ad` | Edge Shared-Memory Silicon: DGX Spark and Jetson |
| Dao-AILab/flash-attention | tag `fa4-v4.0.0.beta35` | Roofline and Arithmetic Intensity; KV Cache and FlashAttention |
| Dao-AILab/flash-attention | tag `v2.8.3.post2` | Roofline and Arithmetic Intensity; NVIDIA Hopper: H100 and H200; KV Cache and FlashAttention |
| deepseek-ai/DeepEP | tag `v1.2.1` | Mixture of Experts and Sparse Activation; Communication and Scale-Out |
| differential-machine-learning/appendices | commit `585675ef05debbb9bb727d43f26ffb29e32ff25f` | Capital Markets Lens |
| differential-machine-learning/notebooks | commit `155055eb891d151533530b70d039ad636ffeaf4b` | Capital Markets Lens |
| intel/intel-extension-for-pytorch | commit `6d3ba89cf9c40eb7184d6092ab7fa9b5231553c1` | Intel Xeon 6 |
| llm-d/llm-d | tag `v0.10.0` | Flash as a Cache Tier for Inference; Disaggregated Serving and Speculative Decoding |
| llvm/llvm-project | tag `llvmorg-19.1.0` | Thesis and Framing; The Heterogeneity Fact |
| llvm/llvm-project | tag `llvmorg-23.1.3` | Thesis and Framing; Anatomy of a Kernel Execution; Graviton Deep Dive; Intel Xeon 6; Small Language Models; Quantization and Precision |
| LMCache/LMCache | tag `v0.5.6` | Flash as a Cache Tier for Inference |
| meta-llama/llama-models | commit `0e0b8c519242d5833d8c11bffc1232b77ad7f301` | Small Language Models |
| meta-llama/llama-models | tag `v0.2.0` | KV Cache and FlashAttention |
| microsoft/onnxruntime | tag `v1.17.0` | Graviton Deep Dive |
| NVIDIA/cccl | tag `v3.1.0` | Determinism: NEFF and GPU Reproducibility |
| NVIDIA/cutlass | tag `v4.8.0` | Anatomy of a Kernel Execution; NVIDIA Blackwell: B200 and B300; NVIDIA Compilers and Kernel Tooling; Quantization and Precision |
| NVIDIA/dgx-spark-playbooks | commit `c035e0ac7d211509ec131b79b5b6f0f824a9e421` | Edge Shared-Memory Silicon: DGX Spark and Jetson |
| NVIDIA/nccl | tag `nccl-ep-v0.1.0` | Communication and Scale-Out |
| NVIDIA/nccl | tag `v2.28.3-1` | AWS Trainium, Inferentia and Neuron; Communication and Scale-Out |
| NVIDIA/nccl | tag `v2.32.3-1` | Communication and Scale-Out |
| NVIDIA/storage-lender | commit `1630d17b50b7130dee27c1f71361ad5af4e434bb` | Flash as a Cache Tier for Inference |
| NVIDIA/TensorRT-LLM | tag `v0.10.0` | NVIDIA Compilers and Kernel Tooling |
| NVIDIA/TensorRT-LLM | tag `v0.21.0` | Grace-Blackwell and UltraServer; Mixture of Experts and Sparse Activation |
| NVIDIA/TensorRT-LLM | tag `v1.0.0` | NVIDIA Compilers and Kernel Tooling; Mixture of Experts and Sparse Activation; Quantization and Precision |
| NVIDIA/TensorRT-LLM | tag `v1.2.1` | Grace-Blackwell and UltraServer; NVIDIA Compilers and Kernel Tooling; KV Cache and FlashAttention; Mixture of Experts and Sparse Activation; Quantization and Precision; Disaggregated Serving and Speculative Decoding; Communication and Scale-Out |
| ofiwg/libfabric | commit `24fa1dcfaa5cd10fc3d5ca5ea94690e9925c6848` | Capital Markets Lens |
| pytorch/pytorch | tag `v2.14.1` | NVIDIA Compilers and Kernel Tooling; Communication and Scale-Out; Determinism: NEFF and GPU Reproducibility |
| qemu/qemu | tag `v11.1.2` | Graviton Deep Dive |
| sgl-project/sglang | tag `v0.5.21` | Flash as a Cache Tier for Inference; Mixture of Experts and Sparse Activation; Disaggregated Serving and Speculative Decoding; Communication and Scale-Out; Determinism: NEFF and GPU Reproducibility |
| torvalds/linux | tag `v6.13` | AMD EPYC Turin |
| torvalds/linux | tag `v6.19` | Anatomy of a Kernel Execution; AMD EPYC Turin; Intel Xeon 6 |
| triton-lang/triton | tag `v3.8.0` | NVIDIA Compilers and Kernel Tooling; AWS Compilers and Kernel Tooling |
| uxlfoundation/oneDNN | tag `v3.13.4` | Anatomy of a Kernel Execution; Intel Xeon 6 |
| vllm-project/vllm | tag `v0.31.0` | Flash as a Cache Tier for Inference; Mixture of Experts and Sparse Activation; Small Language Models; Quantization and Precision; Disaggregated Serving and Speculative Decoding; Determinism: NEFF and GPU Reproducibility; Capital Markets Lens |
| vllm-project/vllm-neuron | tag `v0.24.0.1.1.0` | AWS Compilers and Kernel Tooling |

### Hugging Face revisions

| Model | Revision | Sections citing it |
| --- | --- | --- |
| deepseek-ai/DeepSeek-V3 | `e815299b0bcbac849fa540c768ef21845365c9eb` | High Bandwidth Flash; Flash as a Cache Tier for Inference; Compute-in-Memory; KV Cache and FlashAttention; Mixture of Experts and Sparse Activation; Quantization and Precision |
| deepseek-ai/DeepSeek-V3.2 | `a7e62ac04ecb2c0a54d736dc46601c5606cf10a6` | Mixture of Experts and Sparse Activation; Quantization and Precision |
| deepseek-ai/DeepSeek-V4-Flash-0731 | `7872f01b1d1fe23eabc4c98b48bffcef5a386062` | Mixture of Experts and Sparse Activation |
| deepseek-ai/DeepSeek-V4-Pro-0813 | `72e1d3230f6c080a530b0a1d46f8eb4602340597` | Mixture of Experts and Sparse Activation; Quantization and Precision |
| deepseek-ai/DeepSeek-V4.1-Flash | `314113f8a7dadb388215396ba5fbee2c610a04d6` | Flash as a Cache Tier for Inference; KV Cache and FlashAttention; Mixture of Experts and Sparse Activation; Quantization and Precision; Disaggregated Serving and Speculative Decoding |
| google/gemma-4-12B-it | `707f0a3b8a3c7ad586ed01e27eafbad8a27dd0f7` | Small Language Models |
| google/gemma-4-E2B-it | `3e22461f65e89153144f8adb70e3b8c2cc9845a7` | Small Language Models |
| google/gemma-4-E2B-it-assistant | `2d874ef7d29f9a30599a1e4b3c1cbc9595f005df` | Small Language Models |
| google/gemma-4-E2B-it-qat-q4_0-gguf | `675cff42a74c774d6cb76f76d8eacb49b48c9b93` | Small Language Models |
| google/gemma-4-E4B-it | `ee0ef6023621cff504d758262d4e04895a5af4a2` | Small Language Models |
| HuggingFaceTB/SmolLM3-3B | `a07cc9a04f16550a088caea529712d1d335b0ac1` | Small Language Models |
| meta-llama/Llama-3.1-70B | `349b2ddb53ce8f2849a6c168a81980ab25258dac` | Flash as a Cache Tier for Inference; KV Cache and FlashAttention |
| meta-llama/Llama-3.2-1B | `4e20de362430cd3b72f300e6b0f18e50e7166e08` | Small Language Models |
| meta-llama/Llama-3.2-1B-Instruct-QLORA_INT4_EO8 | `3fdf98b6bc1069f632a468b0676299a0a1b65071` | Small Language Models |
| meta-llama/Llama-3.2-3B | `13afe5124825b4f3751f836b40dafda64c1ed062` | Small Language Models |
| microsoft/Phi-4-mini-instruct | `cfbefacb99257ffa30c83adab238a50856ac3083` | Small Language Models |
| MiniMaxAI/MiniMax-M3-MXFP8 | `c5454eb03678d8710e54a4e0fc681b9f3b4a3dba` | Quantization and Precision |
| mistralai/Ministral-3-14B-Instruct-2512 | `29439f81c2be264d8d393273f99e7db9c0961120` | Small Language Models |
| mistralai/Ministral-3-3B-Instruct-2512 | `b35d4dfe56c142746f54dbd64f579faab2744308` | Small Language Models |
| mistralai/Ministral-3-8B-Instruct-2512 | `5b26027e7b19eeb4b7352e1fed3926375dd2cb4d` | Small Language Models |
| mistralai/Mistral-7B-v0.1 | `27d67f1b5f57dc0953326b2601d68371d40ea8da` | KV Cache and FlashAttention |
| mistralai/Mixtral-8x7B-v0.1 | `fc7ac94680e38d7348cfa806e51218e6273104b0` | KV Cache and FlashAttention; Mixture of Experts and Sparse Activation |
| moonshotai/Kimi-K2-Instruct | `fd1984e2b7a3350dbf7305fe73a4ede25c14de50` | KV Cache and FlashAttention; Mixture of Experts and Sparse Activation |
| moonshotai/Kimi-K2.5 | `4d01dfe0332d63057c186e0b262165819efb6611` | Quantization and Precision |
| moonshotai/Kimi-K3 | `f831ab66814297da540d832a5235f8e904f29d06` | Mixture of Experts and Sparse Activation; Quantization and Precision |
| nvidia/DeepSeek-V3.2-NVFP4 | `7c0f62c6da1da0c81c6e097010cc55854d206812` | Mixture of Experts and Sparse Activation; Quantization and Precision |
| openai/gpt-oss-120b | `b5c939de8f754692c1647ca79fbf85e8c1e70f8a` | Edge Shared-Memory Silicon: DGX Spark and Jetson; Cerebras Wafer-Scale; KV Cache and FlashAttention; Mixture of Experts and Sparse Activation; Quantization and Precision |
| openai/gpt-oss-20b | `6cee5e81ee83917806bbde320786a8fb61efebee` | Small Language Models |
| Qwen/Qwen3-235B-A22B | `8efa61729e24bd65b1d152b5ab5409052aa80e65` | Flash as a Cache Tier for Inference; KV Cache and FlashAttention; Mixture of Experts and Sparse Activation |
| Qwen/Qwen3-Next-80B-A3B-Instruct | `9c7f2fbe84465e40164a94cc16cd30b6999b0cc7` | KV Cache and FlashAttention; Mixture of Experts and Sparse Activation |
| Qwen/Qwen3.5-0.8B | `2fc06364715b967f1860aea9cf38778875588b17` | Small Language Models |
| Qwen/Qwen3.5-2B | `15852e8c16360a2fea060d615a32b45270f8a8fc` | Small Language Models |
| Qwen/Qwen3.5-4B | `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a` | Small Language Models |
| Qwen/Qwen3.5-9B | `c202236235762e1c871ad0ccb60c8ee5ba337b9a` | Small Language Models |
| Qwen/Qwen3.8-2.4T-A95B | `207bd685a7e3696cfaff12ded7c6a7ea0f88c996` | Mixture of Experts and Sparse Activation |

### Versioned documentation

| Document | Version | Pinned in | Pages | Sections citing it |
| --- | --- | --- | --- | --- |
| AWS Neuron SDK documentation | v2.32.0 | URL | 34 | Thesis and Framing; The Heterogeneity Fact; Roofline and Arithmetic Intensity; Memory Hierarchy Primer; Anatomy of a Kernel Execution; HBM and the Bandwidth Wall; AWS Trainium, Inferentia and Neuron; AWS Compilers and Kernel Tooling; Groq, SambaNova and Dataflow; KV Cache and FlashAttention; Mixture of Experts and Sparse Activation; Quantization and Precision; Disaggregated Serving and Speculative Decoding; Communication and Scale-Out; Isolation: NIE and MIG; Determinism: NEFF and GPU Reproducibility; Capital Markets Lens |
| AWS Neuron SDK documentation | v2.33.0 | URL | 1 | AWS Trainium, Inferentia and Neuron; AWS Compilers and Kernel Tooling |
| CUDA C++ Best Practices Guide | CUDA 13.4 | title | 1 | Thesis and Framing; The Heterogeneity Fact; NVIDIA Hopper: H100 and H200 |
| CUDA for Tegra application note | v13.4 | title | 1 | Edge Shared-Memory Silicon: DGX Spark and Jetson |
| CUDA Programming Guide | v13.4.2 | title | 7 | Anatomy of a Kernel Execution; NVIDIA Hopper: H100 and H200; NVIDIA Blackwell: B200 and B300; NVIDIA Compilers and Kernel Tooling; Quantization and Precision |
| cuTile Python | 1.6.0 | title | 1 | NVIDIA Compilers and Kernel Tooling |
| GroqChip Processor product spec sheet | v1.5 | title | 1 | Groq, SambaNova and Dataflow |
| ISDA SIMM Methodology | 2.8+2512 | title | 2 | Capital Markets Lens |
| NVIDIA Blackwell Tuning Guide | CUDA 13.4 | title | 1 | Memory Hierarchy Primer; Anatomy of a Kernel Execution; HBM and the Bandwidth Wall; NVIDIA Hopper: H100 and H200; NVIDIA Blackwell: B200 and B300 |
| NVIDIA cuBLAS documentation | CUDA 13.4 | title | 1 | Determinism: NEFF and GPU Reproducibility |
| NVIDIA cuDNN backend documentation | v9.27.0 | URL | 1 | Determinism: NEFF and GPU Reproducibility |
| NVIDIA GPUDirect Storage Overview Guide and Release Notes | v1.19.1 | title | 2 | Memory Hierarchy Primer; DDR5, MRDIMM, LPDDR5X and CXL; Flash as a Cache Tier for Inference |
| NVIDIA Hopper Tuning Guide | CUDA 13.4 | title | 1 | Memory Hierarchy Primer; Anatomy of a Kernel Execution; NVIDIA Hopper: H100 and H200; AWS Trainium, Inferentia and Neuron |
| NVIDIA Secure AI with Blackwell and Hopper GPUs whitepaper | v1.3 | title | 1 | Isolation: NIE and MIG |
| OCP HBF High-Level Base Die Specification | 0.7.0 | title | 1 | Memory Hierarchy Primer; DDR5, MRDIMM, LPDDR5X and CXL; High Bandwidth Flash; Flash as a Cache Tier for Inference; Chiplet and Interconnect |
| OCP Microscaling Formats (MX) Specification | v1.0 | title | 1 | Cerebras Wafer-Scale; Quantization and Precision |
| PTX ISA | 9.4 | title | 1 | Thesis and Framing; The Heterogeneity Fact; Memory Hierarchy Primer; Anatomy of a Kernel Execution; NVIDIA Hopper: H100 and H200; NVIDIA Blackwell: B200 and B300; Quantization and Precision |

### arXiv versions

| Paper | Version | Pinned in | Sections citing it |
| --- | --- | --- | --- |
| arXiv:2005.02347 (Huge and Savine, Differential Machine Learning) | v4 | URL | Capital Markets Lens |
| arXiv:2402.13499 (Benchmarking and Dissecting the Nvidia Hopper GPU Architecture) | v1 | title only | Memory Hierarchy Primer; Anatomy of a Kernel Execution; NVIDIA Hopper: H100 and H200 |
| arXiv:2407.00079 (Mooncake: A KVCache-centric Disaggregated Architecture for LLM Serving) | v4 | URL | Flash as a Cache Tier for Inference; Disaggregated Serving and Speculative Decoding |
| arXiv:2607.10186 (FlashAccel: Leveraging High-Bandwidth Flash (HBF) for High-Throughput LLM Inference) | v2 | title only | High Bandwidth Flash |
| arXiv:2608.11668 (HBF Sucks? A Full-Stack Characterization of High-Bandwidth Flash for KV-Centric LLM Serving) | v4 | title only | High Bandwidth Flash |
| arXiv:2608.13127 (Potential Applications of HBF in LLM Serving Systems) | v2 | title only | High Bandwidth Flash |
| arXiv:2608.25062 (FLINT: Efficiently Leveraging High Bandwidth Flash for Capacity-Scalable LLM Inference Acceleration) | v1 | title only | Memory Hierarchy Primer; DDR5, MRDIMM, LPDDR5X and CXL; High Bandwidth Flash |

20 arXiv records carry no version in URL or title: 2203.00241 (Pond: CXL-Based Memory Pooling Systems for Cloud Platforms); 2203.04910 (GPU-Initiated On-Demand High-Throughput Storage Access in the BaM System Architecture); 2205.14135 (FlashAttention); 2211.17192 (Fast Inference from Transformers via Speculative Decoding); 2305.13245 (GQA); 2309.06180 (Efficient Memory Management for Large Language Model Serving with PagedAttention); 2401.09670 (DistServe); 2401.10774 (Medusa); 2405.07518 (SambaNova SN40L); 2407.08608 (FlashAttention-3); 2407.21783 (The Llama 3 Herd of Models); 2412.19437 (DeepSeek-V3 Technical Report); 2503.01840 (EAGLE-3); 2503.22017 (Performance Characterizations and Usage Guidelines of Samsung CXL Memory Module Hybrid Prototype); 2509.25149 (Pretraining Large Language Models with NVFP4); 2601.05047 (Challenges and Research Directions for Large Language Model Inference Hardware); 2602.06036 (DFlash: Block Diffusion for Flash Speculative Decoding); 2603.05451 (FlashAttention-4); 2609.09800 (HBFSim); 2609.23816 (SPLASH).

## Part 4: Gate 3 scores

From the "Gate 3 score" heading and the "Economy" criterion row of each
`revamp/verification/<Section>.md`, re-read 2026-10-23 at HEAD 22bd90f. Two reports
(Determinism, Capital Markets Lens) read "pending" at the start of this inventory and were
completed and committed while it was drafted.

| # | Section | Gate 3 score | Economy | Status |
| --- | --- | --- | --- | --- |
| 1 | Thesis and Framing | 8/10 | 8 | |
| 2 | The Heterogeneity Fact | 8/10 | 9 | |
| 3 | Roofline and Arithmetic Intensity | 8/10 | 7 | |
| 4 | Memory Hierarchy Primer | 8/10 | 7 | |
| 5 | Anatomy of a Kernel Execution | 9/10 | 9 | |
| 6 | HBM and the Bandwidth Wall | 8/10 | 6 | |
| 7 | DDR5, MRDIMM, LPDDR5X and CXL | 8/10 | 7 | |
| 8 | High Bandwidth Flash | 8/10 | 8 | |
| 9 | Flash as a Cache Tier for Inference | 8/10 | 6 | |
| 10 | Chiplet and Interconnect | 8/10 | 8 | |
| 11 | Graviton Deep Dive | 8/10 | 7 | |
| 12 | AMD EPYC Turin | 8/10 | 7 | |
| 13 | Intel Xeon 6 | 8/10 | 7 | |
| 14 | NVIDIA Hopper: H100 and H200 | 8/10 | 7 | |
| 15 | NVIDIA Blackwell: B200 and B300 | 8/10 | 6 | |
| 16 | Grace-Blackwell and UltraServer | 8/10 | 7 | |
| 17 | Edge Shared-Memory Silicon: DGX Spark and Jetson | 8/10 | 7 | |
| 18 | NVIDIA Compilers and Kernel Tooling | 8/10 | 7 | |
| 19 | AWS Trainium, Inferentia and Neuron | 8/10 | 7 | |
| 20 | AWS Compilers and Kernel Tooling | 8/10 | 7 | |
| 21 | Cerebras Wafer-Scale | 8/10 | 7 | |
| 22 | Groq, SambaNova and Dataflow | 8/10 | 6 | |
| 23 | Compute-in-Memory | 8/10 | 7 | |
| 24 | KV Cache and FlashAttention | 8/10 | 7 | |
| 25 | Mixture of Experts and Sparse Activation | 8/10 | 7 | |
| 26 | Small Language Models | 8/10 | 7 | |
| 27 | Quantization and Precision | 8/10 | 7 | |
| 28 | Disaggregated Serving and Speculative Decoding | 7/10 | 5 | At the Gate 3 floor (no section below 7) |
| 29 | Communication and Scale-Out | 8/10 | 7 | |
| 30 | Isolation: NIE and MIG | 8/10 | 7 | |
| 31 | Determinism: NEFF and GPU Reproducibility | 8/10 | 8 | Scored 2026-10-23 (commit 131677d) |
| 32 | Capital Markets Lens | 8/10 | 7 | Scored 2026-10-23 (commit 22bd90f) |
| 33 | Glossary and Sources | none | none | MISSING: no `revamp/verification/GlossaryAndSources.md` (and no authoring report) |

Across the 32 scored sections the mean is 8.0 (30 at 8, one at 9, one at 7). This is my
own arithmetic. No section is below the Gate 3 floor of 7; Disaggregated Serving and
Speculative Decoding sits on it, with the lowest economy sub-score (5). Glossary and
Sources has no verification report, so it carries no score.
