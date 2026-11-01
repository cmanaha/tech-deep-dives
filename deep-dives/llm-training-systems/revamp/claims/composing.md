# Claims: section 13, Composing the Dimensions

File: `src/sections/ComposingLayouts.tsx`. Re-opened on 2026-10-31, with no identifying headers: the four arXiv papers (Llama 3 2407.21783v3, PTD-P 2104.04473v5, TorchTitan 2410.06511v3, DeepSeek-V3 2412.19437v2; PDFs via pdftotext); raw files at the pinned tags: PyTorch v2.15.0 `torch/distributed/device_mesh.py`, `torch/distributed/_mesh_layout.py` and `torch/distributed/elastic/agent/server/api.py`; TorchTitan v0.4.0 `torchtitan/distributed/parallelism_context.py` and `docs/benchmarks/llama3_h100_202412_torchtitan.md`; Megatron Core core_v0.20.0 `megatron/core/parallel_state.py`; DeepSpeed v0.19.9 `deepspeed/runtime/pipe/topology.py` and `deepspeed/launcher/launch.py`; the Slurm `srun.html` page, the AWS accelerated computing specifications and the NVIDIA NVLink page. Every Cite carries the default accessed date, 2026-10-31.

W2-4 (the claim that Llama 3, TorchTitan and Megatron Core agree on TP, CP, PP, DP) is wrong as fixed in SCOPE: TP is innermost everywhere, but PP is outermost in Megatron Core, TorchTitan and DeepSpeed, and DP is outermost in Llama 3. The section states both orders. Cross-instance figures follow the build-log condition "Cross-instance pricing": one member per instance prices each GPU's 50 GB/s share; several members per instance price per instance over 400 GB/s.

Every per-level figure is computed at render time by Calculator C (`evaluateLayout` in `src/lib/parallelism.ts`, with `rankFacts`, `shapeOf`, `DENSE_MODELS` and `INSTANCES` from `src/lib/presets.ts`) for Llama 3.1 70B on 32 p5.48xlarge, TP 8 x PP 4 (v 5) x DP 8, ZeRO-1, 512 sequences of 8,192 tokens, micro-batch 1, no recomputation: TP 1,203 GB per GPU per step (2.67 s, 15% of 17.5 s compute), PP 10.7 GB (0.21 s, 1.2%), DP 7.7 GB per GPU (0.15 s, 0.9%). Probe: /tmp/lts-mesh-scratch/probe.test.ts.

Format: claim | source URL | register, wave 2 row or experiment

## Introduction and h1

- Llama 3 405B on 8,192 GPUs as TP 8 x CP 1 x PP 16 x DP 64 at 43% MFU | https://arxiv.org/abs/2407.21783v3 (Table 4) | T02-47; W2-39
- EFA is nine times slower per GPU than NVLink on a p5.48xlarge (50 vs 450 GB/s) | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html; https://www.nvidia.com/en-us/data-center/nvlink/ | T02-68; T02-70 [derived, as section 7]
- TP sends about 1.2 TB per GPU per step, more than 100 times either outer dimension (h1, nesting h2, closing line) | Calculator C `evaluateLayout` | [derived]

## The device mesh: one axis per parallelism

- A device mesh is an n-dimensional array of ranks, with communication run per mesh dimension | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/device_mesh.py#L190-L196 | new (PyTorch DeviceMesh code)
- 8 x 1 x 16 x 64 = 8,192 | arithmetic on Table 4 | [derived]
- Figure 5: 16 GPUs as TP 2 x CP 2 x PP 2 x DP 2; GPU 0 groups with GPUs 1, 2, 4 and 8 | https://arxiv.org/abs/2407.21783v3 (Figure 5) | new
- PyTorch's default mesh strides are the suffix product of the shape (row-major, last axis fastest) | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/_mesh_layout.py#L291-L301 | new (PyTorch DeviceMesh code)
- PyTorch's example mesh: mesh_shape=(2, 8), mesh_dim_names=("dp", "tp") | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/device_mesh.py#L1688 | new (PyTorch DeviceMesh code)
- Launchers give each instance a consecutive block of ranks | section 7 (link) | W2-3
- Meta's server: eight H100 GPUs joined by NVLink | https://arxiv.org/abs/2407.21783v3 (Sec 3.3.1) | T02-47
- p5.48xlarge holds eight GPUs and 3,200 Gbps of EFA (50 GB/s per GPU) | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T02-68
- One member per instance pays each GPU's 50 GB/s share; several members per instance are priced per instance over 400 GB/s | section 7 (link) | orchestrator addendum; build-log "Cross-instance pricing"

## Published layouts, read on the grid

- 8,192 GPUs = 1,024 p5.48xlarge | arithmetic | W2-39 [derived]
- 8,192 GPUs: TP 8 x CP 1 x PP 16 x DP 64 at 8,192 tokens, 43% | https://arxiv.org/abs/2407.21783v3 (Table 4) | T02-47; W2-39
- 16,384 GPUs: TP 8 x CP 1 x PP 16 x DP 128, 41% | https://arxiv.org/abs/2407.21783v3 (Table 4) | T02-47; W2-16; W2-39
- 131,072 tokens: TP 8 x CP 16 x PP 16 x DP 8 on 16,384 GPUs, 38% | https://arxiv.org/abs/2407.21783v3 (Table 4) | T02-47; W2-32
- 16M tokens per batch; 2,048 x 8,192 and 128 x 131,072; DP x sequences per DP group 64 x 32, 128 x 16, 8 x 16 | https://arxiv.org/abs/2407.21783v3 (Table 4) | T02-47 [derived]
- Meta attributes 43% to 41% to the smaller batch per DP group | https://arxiv.org/abs/2407.21783v3 (Sec 3.3.2) | W2-16
- CP 16 takes one GPU per server when TP 8 fills it, so its all-gathers cross servers | Table 4 grid | [our reading]
- Meta accepts CP's exposed all-gather latency because GQA keeps keys and values small | https://arxiv.org/abs/2407.21783v3 (Sec 3.3.2) | T02-24
- Meta used a memory-consumption estimator and a performance-projection tool; no release located | https://arxiv.org/abs/2407.21783v3 (Sec 3.3.2) | T02-48
- DeepSeek-V3: 2,048 H800, eight per node on NVLink, InfiniBand between nodes | https://arxiv.org/abs/2412.19437v2 (Sec 3.1) | T02-40; W2-34
- DeepSeek-V3: PP 16, EP 64 over 8 nodes, ZeRO-1 DP, no TP thanks to memory optimizations | https://arxiv.org/abs/2412.19437v2 (Sec 3.2) | T02-40; W2-34
- Attention DP 2,048 / 16 = 128; experts EP 64 x 2 copies | arithmetic | [derived]
- Cross-node EP gives a computation-to-communication ratio of about 1:1, which DualPipe hides | https://arxiv.org/abs/2412.19437v2 (Sec 3.2.1) | new
- At most four nodes per token, InfiniBand once to the same in-node index, then NVLink | https://arxiv.org/abs/2412.19437v2 (Sec 3.2.2) | T02-39; W2-34 (route detail new)
- TorchTitan mesh built as (pp, dp_replicate, dp_shard, cp, tp) | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/distributed/parallelism_context.py#L319-L323 | W2-4 (fixed); G1
- dp_replicate and dp_shard are HSDP's replicate and shard axes | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/distributed/parallelism_context.py#L257 | W2-4 (fixed)
- FSDP alone often sufficient up to about 512 GPUs; TP usually capped at 8 inside NVLink; CP just outside TP | https://arxiv.org/abs/2410.06511v3 (Sec 3.3.1 to 3.3.4) | T02-49; W2-40
- Published runs: 8B FSDP 8 on 8 and FSDP 128 on 128; 70B FSDP 32 x TP 8 on 256; 405B FSDP 8 x TP 8 x PP 8 on 512 | https://github.com/pytorch/torchtitan/blob/v0.4.0/docs/benchmarks/llama3_h100_202412_torchtitan.md#L23-L60 | T02-50; W2-45
- Hosts of eight H100s with 400 Gb/s per GPU (50 GB/s, the p5.48xlarge share) | https://github.com/pytorch/torchtitan/blob/v0.4.0/docs/benchmarks/llama3_h100_202412_torchtitan.md#L12-L14 | T02-50 [derived conversion]
- 8B FSDP 128 has eight members per host (per-instance pricing); 70B and 405B leave one FSDP member per host | arithmetic | orchestrator addendum [derived]
- Paper: 405B as FSDP 4 x TP 8 x PP 16 at batch 128; 70B at 897 and 1,010 tokens/s/GPU | https://arxiv.org/abs/2410.06511v3 (Tables 3, 4) | C02-3
- Repository: 405B as FSDP 8 x TP 8 x PP 8 at batch 256; 70B at 829 and 876 | https://github.com/pytorch/torchtitan/blob/v0.4.0/docs/benchmarks/llama3_h100_202412_torchtitan.md#L48-L60 | C02-3
- The repository document records the torch, torchao and torchtitan commits | https://github.com/pytorch/torchtitan/blob/v0.4.0/docs/benchmarks/llama3_h100_202412_torchtitan.md#L71-L77 | T02-50
- Megatron Core default order "tp-cp-ep-dp-pp" | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/parallel_state.py#L641 | T02-51; W2-58; W2-4 (fixed)
- Leftmost axis gets stride 1 | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/parallel_state.py#L357 | W2-58
- Keeping adjacent ranks on one machine is left to the caller | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/parallel_state.py#L813-L816 | T02-51; W2-58
- Docstring gives the default as tp-dp-pp | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/parallel_state.py#L773-L775 | C02-4

## Why the largest runs split the model as well as the data

- Takeaway #1: TP up to the GPUs of one server, PP across servers | https://arxiv.org/abs/2104.04473v5 (Sec 3.2) | T02-14
- Takeaway #2: model-parallel size TP x PP just large enough to fit, DP to scale | https://arxiv.org/abs/2104.04473v5 (Sec 3.3) | T02-43
- A poor TP/PP split cost up to 2x throughput, even with fast inter-server links | https://arxiv.org/abs/2104.04473v5 (Sec 1) | T02-14
- PTD-P beat ZeRO-3 without model parallelism by 6% and 24%, then 70% after doubling GPUs at fixed batch; attributed to less cross-node communication | https://arxiv.org/abs/2104.04473v5 (Sec 5.2) | T02-45; W2-41 (hedged: evidence for splitting the model, order separate)
- Table 2: 175B ZeRO-3 144, 88, 44 TFLOP/s on 384, 768, 1,536 vs PTD-P 153, 149, 141 (MP 96); 530B ZeRO-3 98 on 1,120, 48 on 2,240, and 138 on 640 at batch 2,560 (did not fit on 560 at micro-batch 4) vs PTD-P 171, 167, 159 on 560, 1,120, 2,240 (MP 280) | https://arxiv.org/abs/2104.04473v5 (Table 2 and its caption) | new; fc05 corrected the 640-GPU batch
- ZeRO-3 loses 39% to 51% per GPU at each doubling (144 to 88, 88 to 44, 98 to 48) | arithmetic on Table 2 | [derived]; fc05 replaced "halves"

## Nest innermost-fastest

- Innermost needs most bandwidth and least latency, stays in a server; outermost may span a multi-hop network | https://arxiv.org/abs/2407.21783v3 (Sec 3.3.2) | T02-46; W2-39
- TP: two all-reduces forward and two backward per layer per micro-batch | https://arxiv.org/abs/2104.04473v5 (Sec 3.2) | T02-13
- PP: one activation slice per micro-batch per stage boundary | https://arxiv.org/abs/2104.04473v5 (Sec 4.1) | T02-13; PTDP Sec 4.1
- DP with ZeRO-1 reduces gradients once per step (ZeRO-2 and FSDP do so per micro-batch under accumulation) | section 8 (link); build-log condition "ZeRO-2 under gradient accumulation" | [cross-ref]; fc05 scoped to ZeRO-1
- Per-level table (1,203 GB, 10.7 GB, 7.7 GB; 2.67, 0.21, 0.15 s; 15%, 1.2%, 0.9%) | Calculator C `evaluateLayout` | [derived]
- Assumed 40% MFU sits inside Llama 3's 38% to 43% | https://arxiv.org/abs/2407.21783v3 (Table 4) | T02-47
- NVLink 450 GB/s per GPU per direction, our reading of 900 GB/s | https://www.nvidia.com/en-us/data-center/nvlink/ | T02-70 (vendor claim)
- TP spread one GPU per instance: about 24 s per step against 17.5 s compute | Calculator C bytes / 50 GB/s | [derived]
- TP bytes 8bsh(t-1)/t per layer per micro-batch | https://arxiv.org/abs/2104.04473v5 (Sec 3.2) | T02-13
- PP bytes bsh/t per boundary per direction with scatter-gather | https://arxiv.org/abs/2104.04473v5 (Sec 4.1) | T02-13; PTDP Sec 4.1
- ZeRO-1 DP: reduce-scatter plus all-gather of a 70.55B / 32 BF16 shard; per instance over 400 GB/s gives the same time | Calculator C; section 8 (link) | orchestrator addendum [derived]
- Llama 3 nests [TP, CP, PP, DP] with DP outermost | https://arxiv.org/abs/2407.21783v3 (Sec 3.3.2) | T02-46; W2-4 (fixed)
- DeepSpeed pipeline topology row-major over pipe, data, model | https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/runtime/pipe/topology.py#L18-L21; https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/runtime/pipe/topology.py#L248 | W2-4 (fixed); G1
- Pods of 3,072 GPUs with full bisection, 1:7 oversubscribed above; parallelism and scheduler keep traffic inside a pod | https://arxiv.org/abs/2407.21783v3 (Sec 3.3.1) | new
- One pipeline (TP 8 x PP 16) is 128 consecutive GPUs, small enough for one pod; DP spans pods | arithmetic on the grid | [derived]
- DP outermost because FSDP tolerates latency (prefetch, asynchronous reduction) | https://arxiv.org/abs/2407.21783v3 (Sec 3.3.2) | T02-46
- PP-outermost with the same degrees: 512-GPU blocks per stage, pipeline neighbours 512 ranks apart, six stages per 3,072-GPU pod, two of fifteen stage boundaries cross a pod if ranks fill pods in order | arithmetic | [derived]; fc05 corrected "across pods"
- Put outermost the axis that best tolerates distance; read distance from the EC2 instance topology | EFA dive section 7 (link) | [our reading]

## Write your layout as a mesh

- TP 8 x PP 4 x DP 8 = 256 ranks = 32 p5.48xlarge | arithmetic | [derived]
- torchrun gives each node a contiguous block of global ranks | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/elastic/agent/server/api.py#L618-L683 | W2-3; G1; fc05 re-pointed from the docstring (L606-L608) to the code
- DeepSpeed's launcher numbers ranks node by node in hostfile order | https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/launcher/launch.py#L160-L168 | W2-3
- srun places consecutive tasks on one node by default when tasks outnumber nodes; with a topology plugin configured it takes nodes in topology order rather than node-index order | https://slurm.schedmd.com/srun.html (--distribution) | W2-3
- On a topology-plugin cluster, expect node order (which instances hold neighbouring ranks) to follow the topology | srun.html (--distribution) | [our reading]
- Log global rank and hostname; one check per cluster | sources above | [our reading]
