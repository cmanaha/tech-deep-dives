# Claims: section 12, Mixture of Experts: Expert Parallelism (`ExpertParallel.tsx`)

One line per claim: `claim | source URL | register, wave 2 row or experiment`. Megatron Core files were
re-opened at core_v0.20.0 (685fb8bd970185e9ac3283fe32a5d6667bf4b268) and DeepSeek-V3 (2412.19437v2) was
re-read on 2026-10-31; rows marked "fetched 2026-10-31, no register row" are new to the registers and
need a fact-check pass. Numbers marked "Calculator C" are computed on the page by
`evaluateMoeGrid` / `routedExpertParameters` in `src/lib/parallelism.ts`.

## Opening

- An MoE layer replaces the feed-forward block with experts and a router that sends each token to k of E; inference-side mechanics linked, not repeated | ../silicon-memory-inference/ (section 25) | SCOPE section 12 block; T02-71 for "replaces FFNs"
- EP places experts on different GPUs; the backward pass repeats both exchanges, four all-to-alls per MoE layer per step | https://arxiv.org/abs/2006.16668v1 (Sec 3.3.2) | T02-37, T02-38 [our reading of dispatch/combine pair]

## Dispatch and combine

- GShard uses AllToAll to reshard tokens to experts and back | https://arxiv.org/abs/2006.16668v1 Sec 3.3.2 | T02-37 (accessed 2026-10-30)
- Bytes leaving a GPU per MoE layer forward about 2 x T x k x h x bytes x (EP-1)/EP; backward the same; no source located that prints it for top-k | derived | T02-38 [derived]
- DeepSeek-V3: hidden 7,168; 8 of 256 routed experts; 58 of 61 layers are MoE (first three dense); 671B total, 37B active | https://arxiv.org/abs/2412.19437v2 Sec 4.2 | T02-71, T01-26, W2-35 (re-read 2026-10-31)
- FP8 dispatch, BF16 combine | https://arxiv.org/abs/2412.19437v2 Sec 3.3.4 | T02-39, W2-35
- Dispatch 57 KB, combine 115 KB, 172 KB per token per MoE layer forward; about 10 MB across 58 layers | Calculator C (`expertTraffic`) | 02 section 3.4, W2-35 [derived]
- 172 KB is 12 times the token's 14 KB BF16 hidden state (172,032 / 14,336) | derived | our arithmetic on T02-71
- Bytes follow k and h, not expert count or size | derived | our reading of T02-38's formula
- Expert traffic is addressed GPU to GPU, so it is priced per GPU over the 50 GB/s EFA share = instance's distinct bytes over 400 GB/s; NVLink 450 GB/s per GPU per direction; 9x | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html ; https://www.nvidia.com/en-us/data-center/nvlink/ | T02-68, T02-70, 02 section 3.4; build-log "Cross-instance pricing"; section 7's GPU-to-GPU rule
- Switch capacity = (tokens per batch / experts) x capacity factor; past capacity a token is dropped and passes through the residual; larger factor costs computation and memory | https://arxiv.org/abs/2101.03961v3 Sec 2.2 | T02-36, W2-38 (accessed 2026-10-30)
- Megatron Core drops tokens only when a capacity factor is set | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/moe/router.py#L1105-L1114 | fetched 2026-10-31, no register row (code)
- Megatron Core's capacity factor defaults to None | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/transformer_config.py#L1024-L1026 | fetched 2026-10-31, no register row (code)
- DeepSeek-V3 dropped no tokens during training, crediting load balancing | https://arxiv.org/abs/2412.19437v2 Sec 2.1.2 ("No Token-Dropping") | fetched 2026-10-31, no register row
- Megatron capacity counts tokens x top-k: get_capacity(num_tokens * router_topk, ...) = ceil(tokens / experts x factor) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/moe/moe_utils.py#L1097-L1102 and #L273 | fetched 2026-10-31, no register row (code)

## Cross the slow link once

- DeepSeek-V3: 2,048 H800, 8 GPUs per node on NVLink and NVSwitch | https://arxiv.org/abs/2412.19437v2 Sec 3.1 | T02-40, W2-34
- PP 16, EP 64 spanning 8 nodes, ZeRO-1 DP, no TP | https://arxiv.org/abs/2412.19437v2 Sec 3.2 | T02-40, W2-34
- Cross-node EP left computation to communication about 1:1 | https://arxiv.org/abs/2412.19437v2 Sec 3.2.1 | T02-34, T02-40
- Node-limited routing: at most M = 4 nodes, chosen by the sum of highest affinity scores per node | https://arxiv.org/abs/2412.19437v2 Sec 2.1.2 | T02-39, W2-34
- IB once per target node to the same in-node index GPU, then NVLink forwarding; combine reverse with accumulation | https://arxiv.org/abs/2412.19437v2 Sec 3.2.2 | T02-39 (combine accumulation re-read 2026-10-31)
- NVLink 160 GB/s, about 3.2x IB 50 GB/s; average 3.2 experts per node at no extra cost; up to 13 experts at the same cost | https://arxiv.org/abs/2412.19437v2 Sec 3.2.2 | T02-39, W2-11 (13 experts re-read 2026-10-31)
- Cross-node dispatch at most 4 x 7,168 x 1 B = 29 KB per token per layer against 57 KB | Calculator C (`crossNodeDispatchBytesPerTokenPerMoeLayer`) | 02 section 3.4 [derived]
- Same pattern as HSDP: cross the slow link once, fan out on the fast one | derived | 02 section 4 mental model 7 [our reading]
- p5.48xlarge 9x vs DeepSeek 3.2x | derived | 02 section 3.4, T02-68, T02-70, T02-39
- EP 64 spans 8 p5.48xlarge; fits a P6e-GB200 UltraServer's 72-GPU NVLink domain | https://aws.amazon.com/ec2/instance-types/p6/ | W2-35 [derived], T05-6, T05-7, W5-19 (accessed 2026-10-30)
- Diagram: token on GPU 6 of instance A, experts on A GPUs 1 and 3 and B GPUs 0, 3 and 4, one EFA copy to B GPU 6 (same index) which forwards over NVLink; illustrative; numbers 450, 50, 4 nodes, 29 KB, 57 KB match prose | as above | schematic

## Two layouts

- Folding: attention TP x CP x DP x PP, experts ETP x EP x EDP x PP, sharing only PP | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/moe/README.md#L332-L336 ; https://arxiv.org/abs/2504.14960v3 Sec 3.2 | T02-41, W2-36
- Folding lifts the EP <= DP constraint | README L326-L327 | T02-41
- Code: ETP defaults to TP; EDP = world / (ETP x EP x PP); RuntimeError otherwise | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/parallel_state.py#L946-L960 | T02-41, T02-72, W2-36
- DeepSeek-V3 grids: attention TP 1 x CP 1 x DP 128 x PP 16 = 2,048; experts ETP 1 x EP 64 x EDP 2 x PP 16 = 2,048 | Calculator C | T02-40 [derived]
- Model state per GPU on 256 p5.48xlarge: 4.2 GB attention grid, 6.4 GB expert grid, 10.6 GB total (16-byte Adam, ZeRO-1 over DP and EDP, averaged over stages) | Calculator C | calculator (no register row; derived)
- Routed-expert parameters 654.5B, 97.5% of 671B: (671 - 37) x 256 / 248 | Calculator C (`routedExpertParameters`) | T01-26, T02-71 [derived]
- Guide formula "Total GPUs = TP x PP x CP x EP x DP" (doc-code conflict) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/parallelism-guide.md#L174-L180 | T02-72 (WRONG), C02-2, W2-36
- Guide's DeepSeek-V3 row 1,024 GPUs, TP 2, PP 16, CP 1, EP 64 gives 2,048 before DP | guide L166-L170 | T02-72, W2-36
- Under the code: attention 2 x 16 x 32 = 1,024 passes; experts at ETP = TP = 2 give 2,048 on 1,024, fails; ETP 1 gives 1,024, EDP 1, passes | Calculator C (`evaluateMoeGrid` on 128 p5.48xlarge) | T02-72 [derived, our reading of the code]

## Set the expert grid

- Guide: EP x TP within a single node (typically 8 GPUs); beyond one node prefer PP over expanding TP/EP | README L182-L197 | T02-42, W2-37
- 72 GPUs on a P6e-GB200 UltraServer | P6 page | T05-6, T05-7
- Guide: EP8 x TP1 outperforms EP4 x TP2 for Mixtral 8x7B | README L207-L216 | T02-42, W2-37
- Guide: ETP recommended 1 for fine-grained MoE | README L524 | T02-42, W2-37
- DeepSeek-V3's 256 experts of intermediate size 2,048 | 2412.19437v2 Sec 4.2 | T02-71
- ETP unset takes the TP degree | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/model_parallel_config.py#L551-L552 | T02-72 (code); lines fetched 2026-10-31
- Number of experts must be a multiple of EP | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L1567-L1571 | fetched 2026-10-31, no register row (code)
- Default token dispatcher is allgather | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/transformer_config.py#L998-L1000 | fetched 2026-10-31, no register row (code)
- Guide: alltoall for EP > 1; flex with DeepEP for cross-node EP removes redundant tokens across nodes | README L307-L313 | fetched 2026-10-31, no register row; "per-node de-duplication" is our reading
- Overlap: one micro-batch's forward beside another's backward, all-to-all hidden by the other's compute | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/pipeline_parallel/combined_1f1b.py#L54-L61 | U03-6 (closed, wave2-frameworks G2)
- --overlap-moe-expert-parallel-comm and --delay-wgrad-compute, both off by default | README L433-L438, L563-L564 | U03-6, G2
- Guide: EP all-to-all can consume 30% to 40% of training time without optimization; no conditions | README L431 | G2 [vendor claim]
- Overlap requires EP > 1, alltoall or flex, BF16 or FP16, no recomputation settings, VPP when PP > 1 | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/transformer_config.py#L3613-L3648 | fetched 2026-10-31, no register row (code); extends G2
- Full recomputation therefore excludes the overlap | derived | our reading of the asserts
- On Hopper with TP > 1 and the overlap the training script warns: TP wants CUDA_DEVICE_MAX_CONNECTIONS=1, the overlap a larger value; set 1 or 32 | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L1392-L1401 | fetched 2026-10-31; same block section 9 cites (L1376-L1405)
- Candidate grids on 256 p5.48xlarge: DeepSeek-V3's degrees 10.6 GB, EP over EFA across 8 instances; TP 8 x PP 8 x DP 32 with ETP 1 x EP 8 x EDP 32, 45.9 GB, NVLink only; activations "not modelled; measure a step" | Calculator C (`evaluateMoeGrid`) | calculator; SCOPE section 12 ending
- Headroom target 60 GB = 75% of 80 GB, an assumption | Calculator B/C default (`DEFAULT_HEADROOM`) | SCOPE Calculator B [our reading]
- Room under the target: about 14 GB (in-instance) against about 49 GB (DeepSeek-V3's degrees) | derived from Calculator C | our arithmetic
- 61 layers divide by neither 8 nor 16, so uneven stages | derived | T02-71; W2-26 (split not published)
- EP: weight 1/N in the MoE layer, peak activation memory about 1 (varies with EP balancing) | README L160-L166 | fetched 2026-10-31 (section 11 cites the same table)
- No activation formula for MoE layers or multi-head latent attention located in this research; Calculator C labels activations "not modelled; measure a step" | SCOPE section 12 and Calculator C | SCOPE block, orchestrator note
- Measure a few hundred steps of each candidate; section 31 runs the comparison | procedure | 02 section 3.5 step 12; SCOPE section 14
