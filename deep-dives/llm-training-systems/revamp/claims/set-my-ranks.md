# Claims: section 14, Set My Ranks: The Sizing Procedure

File: `src/sections/SetMyRanks.tsx`. Re-opened on 2026-10-31 (default accessed date): Megatron-LM core_v0.20.0 `docs/user-guide/parallelism-guide.md`, `docs/user-guide/features/dist_optimizer.md` and `megatron/training/arguments.py` (L3102-L3103); NeMo v2.7.3 `examples/llm/auto_configurator/README.md` and `training_config.py` (L72-L77, L364-L398); DeepSpeed v0.19.9 `deepspeed/autotuning/README.md`. Register rows cited without re-opening carry `accessed="2026-10-30"`. Every worked memory, traffic, bubble and step figure is computed at render time by `src/lib/parallelism.ts` (`evaluateLayout`, `sizeParallelism`, `sizeMoeGrids`) through `src/lib/memory.ts`; the figures below are the values the page prints with the presets' inputs (70B = 70,553,706,496 parameters, 8,192 tokens, 512 sequences, 6N FLOPs per token, MFU 40%, headroom 75%, fused SwiGLU, FP32-upcast logits).

Format: claim | source URL | register, wave 2 row or experiment

## Procedure

- No single source states all twelve steps; the assembly and step 3's position before TP are our reading | (assembled) | 02 section 3.5, SCOPE section 14 [our reading]
- Default headroom target 75% of HBM is our assumption; no source read states one | (none) | W1-24 [our reading]
- Mixed-precision Adam keeps 16 bytes per parameter (2 + 2 for 16-bit weights and gradients, 12 for FP32 master and two moments); the paper's 16-bit format is FP16, BF16 is the same size | https://arxiv.org/abs/1910.02054v3 (Section 3.1) | T01-9; fc05 replaced "BF16" under the paper's cite
- 18 bytes per parameter with Megatron's FP32 main gradients (6 + 12/d with the distributed optimizer) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/dist_optimizer.md#L14-L20 | T03-17 (re-read at tag)
- Llama 3.1 70B has 70,553,706,496 parameters | https://huggingface.co/api/models/meta-llama/Llama-3.1-70B/revision/349b2ddb53ce8f2849a6c168a81980ab25258dac | T01-3
- 70B model state at 16 bytes = 1,128.9 GB, more than 14 x 80 GB | (Calculator C, DDP layout) | 01 W2 [derived]
- ZeRO stages 1 and 2 "same communication volume as DP"; stage 3 "a modest 50% increase"; holds at one micro-batch per step | https://arxiv.org/abs/1910.02054v3 (Section 1) | T02-7; build-log condition "ZeRO-2 under gradient accumulation" (fc05 added the scope)
- Order: distributed optimizer or ZeRO-1, then ZeRO-2, then FSDP, HSDP when cross-instance bytes dominate | (procedure) | SCOPE section 14 step 3, T02-5, T02-9 [our reading]
- Megatron Core guide: begin with DP only, add TP "if the model does not fit" | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/parallelism-guide.md#L237-L241 | T02-52 (re-read at tag)
- TorchTitan: FSDP "often sufficient as the first degree of parallelism when communication is faster than computation (e.g., up to 512 GPUs)" | https://arxiv.org/abs/2410.06511v3 (Section 3.3.1) | T02-49
- TP up to degree g on g-GPU servers (Takeaway #1) | https://arxiv.org/abs/2104.04473v5 (Section 3.2) | T02-14
- SP: "Always enable when using TP" | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/parallelism-guide.md#L225-L230 | W2-20 (re-read at tag)
- Megatron uneven stages: `--decoder-first-pipeline-num-layers` and `--decoder-last-pipeline-num-layers` | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L3041-L3056 | W2-56, W2-5
- Megatron `--account-for-*` flags | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/transformer_config.py#L151-L157 | W2-56, W2-5
- TorchTitan default split gives first and last stages fewer layers | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/config/parallelism.py#L95-L105 | W2-56, wave2-parallelism G2
- DeepSpeed balances stages by parameter count by default | https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/runtime/pipe/module.py#L116-L133 | W2-56
- CP for long sequences, "8K+ Tokens" | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/parallelism-guide.md#L31 | T02-25
- Expert layers on their own grid ETP x EP x EDP x PP, sharing only PP with attention | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/moe/README.md#L332-L336 ; https://arxiv.org/abs/2504.14960v3 (Section 3.2) | T02-41, T02-72
- Dense grid TP x CP x PP x DP equals the world size (world size divisible by TP x PP x CP, DP the quotient) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L468-L495 | T02-72; fc05 re-pointed (L1567-L1571 is the expert-count check)
- Expert grid ETP x EP x EDP x PP equals the world size (world size divisible by ETP x EP x PP, EDP the quotient) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/parallel_state.py#L946-L960 | T02-72; fc05
- Heads must divide by TP; KV heads a multiple or divisor of TP | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/transformer_config.py#L1746-L1773 | T02-15, W2-18
- Global batch divisible by micro-batch x DP | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/num_microbatches_calculator.py#L381-L388 | T02-15
- Interleaved 1F1B bubble (p - 1) / (v x m) | https://arxiv.org/abs/2104.04473v5 (Section 2.2.2) | T02-30
- NVLink 450 GB/s per GPU per direction, our reading of NVIDIA's 900 GB/s | https://www.nvidia.com/en-us/data-center/nvlink/ | T02-70 [our reading, vendor claim]
- EFA 400 GB/s per instance on p5.48xlarge and p5en.48xlarge (3,200 Gbps) | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T05-3
- Cross-instance traffic counted per instance over the whole EFA bandwidth, our reading of how NCCL spreads a crossing over the network cards (section 7); AWS sample: 16 GiB all-reduced across two p5.48xlarge in 66 ms | https://github.com/aws-samples/awsome-distributed-training/blob/3a1002576ccef26e66ba714303b10ccdaa645691/micro-benchmarks/nccl-tests/README.md#L206-L243 | wave2-parallelism orchestrator addendum [our reading]
- Llama 3 rank order [TP, CP, PP, DP] | https://arxiv.org/abs/2407.21783v3 (Section 3.3.2) | T02-46
- "A few hundred steps" is our reading | (assembled) | W6-34 [our reading]
- NeMo Auto Configurator ranked candidates by measured throughput of short runs | https://github.com/NVIDIA/NeMo/blob/v2.7.3/examples/llm/auto_configurator/README.md | T02-54
- Playbook: the faster of TP and PP changed as the authors optimised each implementation | https://huggingface.co/spaces/nanotron/ultrascale-playbook/tree/c93890dd4b22356ee18ed9b863e6f2d0909729bc | T02-58

## Tools

- NeMo heuristics start an 8B model at 8,192 tokens at TP 2 or 4 | https://github.com/NVIDIA/NeMo/blob/v2.7.3/nemo/collections/llm/tools/auto_configurator/core/training_config.py#L364-L398 | T02-55
- TorchTitan published FSDP 8 on one node for Llama 3.1 8B; its Table 1 states no sequence length | https://github.com/pytorch/torchtitan/blob/v0.4.0/docs/benchmarks/llama3_h100_202412_torchtitan.md#L10-L53 | T02-50; fc05 removed "at 8,192 tokens" from this row
- Megatron Core guide: Llama 3 8B on 8 GPUs at CP 2 ("8K seqlen") | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/parallelism-guide.md#L155-L158 | T02-52 (re-read at tag)
- Auto Configurator grid of TP, PP, CP, EP, micro-batch and activation checkpointing; heuristics; divisibility filters; short runs; README "Some of the candidate configurations may not work due to high-memory usage" | https://github.com/NVIDIA/NeMo/blob/v2.7.3/examples/llm/auto_configurator/README.md | T02-54 (re-read at tag)
- README says "four critical hyperparameters" and lists six; code loops over TP, PP, CP, EP, micro-batch | https://github.com/NVIDIA/NeMo/blob/v2.7.3/nemo/collections/llm/tools/auto_configurator/core/training_config.py#L72-L77 | C02-6 (re-read at tag)
- Not located in NVIDIA's current NeMo repositories during this research; NVIDIA/NeMo at v3.0.0 "pivoted to focus on audio, speech, and multimodal LLM" | https://github.com/NVIDIA/NeMo/blob/v3.0.0/README.md | T03-25, T03-27, U03-2 (hedge); fc05 narrowed "speech-only"
- Megatron Bridge v0.7.0 does not carry it | https://github.com/NVIDIA-NeMo/Megatron-Bridge/tree/04ce2b3efd6f2e387fc244e9f37afd0a1f7952fb | T03-27
- DeepSpeed autotuner tunes ZeRO stage, micro-batch and other ZeRO settings | https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/autotuning/README.md#L79-L97 | T02-56, W2-48 (re-read at tag)
- DeepSpeed autotuner takes the model-parallel degree as `mp_size` | https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/autotuning/README.md#L317-L319 | W2-48 (re-read at tag)
- Playbook three steps; sweep of several thousand configurations on 1 to 64 nodes of 8 H100; "After optimizing our PP code, it became the faster option" | https://huggingface.co/spaces/nanotron/ultrascale-playbook/tree/c93890dd4b22356ee18ed9b863e6f2d0909729bc | T02-57, T02-58
- Calculon (SC23) is a parameterized analytical performance model of transformer LLMs | https://web.archive.org/web/2024/https://sc23.supercomputing.org/proceedings/tech_paper/tech_paper_pages/pap552.html | U02-14, wave2-parallelism G6; fc05 moved the input list to the code row
- Calculon code takes TP, PP, DP degrees, per-dimension networks, micro-batch, recomputation, interleaving, optimizer sharding and estimates step time and memory; no CP, EP or FSDP-style sharding; attention multi-head or multi-query only | https://github.com/calculon-ai/calculon/blob/c2aba03022c4870c62a42f127f7e2b97c2ce7de2/calculon/llm/llm.py | wave2-parallelism G6 [our reading of the code]; fc05 corrected the path (calculon/llm.py does not exist)
- Alpa (OSDI 2022), Galvatron (PVLDB 16(3), www.vldb.org/pvldb/vol16-volume-info) search plans automatically | https://arxiv.org/abs/2201.12023v3 ; https://arxiv.org/abs/2211.13878v1 | wave2-parallelism G6

- Headline: for 70B on four p5en.48xlarge the data-parallel layouts fail the memory check or fit only by recomputing (FSDP 32 with full recomputation, 54.6 GB); TP 8 x DP 4 fits at 85.0 GB with no pipeline and no recomputation | (Calculator C) | [derived]; fc05 added "or fit only by recomputing"

## Example 1 (32 p5.48xlarge, 256 H100)

- H100 80 GB | https://www.nvidia.com/en-us/data-center/h100/ | T02-69 [vendor claim]
- Dense BF16 peak 989.5 TFLOPS, half the sparse 1,979 NVIDIA prints | https://www.nvidia.com/en-us/data-center/h100/ | T01-27, U02-7 (hedge text; fc05 added it)
- MFU 40% assumption inside Llama 3's 38% to 43% | https://arxiv.org/abs/2407.21783v3 (Table 4) | T01-6, U01-5
- Compute 17.5 s per step | (Calculator C) | 02 section 3.2 [derived]
- Activation formula confirmed on one GB10 (8B shape) | E1 | E1
- Layout A TP 8 x PP 4 (v 5) x DP 8 ZeRO-1: 38.0 GB; 42.4 GB with FP32 main gradients | (Calculator C) | 02 section 3.2, W2-42 [derived]
- Layout A follows PTD-P's takeaways (TP inside the instance, PP across instances), here with ZeRO-1 | https://arxiv.org/abs/2104.04473v5 (Sections 3.2, 3.3) | T02-14, T02-43; fc05 replaced "is the PTD-P recipe" (PTD-P uses plain DP)
- Layout A bubble 0.94% at m = 64; 4.69% without interleaving | (Calculator C) | T02-30 [derived]
- Layout A DP 0.9% of compute, 61.7 GB per instance; TP 15.3% on NVLink; step 17.7 to 20.7 s | (Calculator C) | W2-42, wave2-parallelism addendum [derived]
- Layout B TP 8 x FSDP 32, b = 16, full recomputation: 43.0 GB; FSDP 410.1 GB per instance, 1.03 s, 5.9% of compute, 4.4% of the 23.4 s step; step 23.4 to 27.1 s | (Calculator C) | W2-44 [derived]
- FSDP2 default: two all-gathers and one reduce-scatter per unit per micro-batch | E3 | E3, T03-2
- Layout B at micro-batch 1: 16 micro-batches, 6,561 GB per instance (820 GB per GPU), 16.4 s, 94% of compute | (Calculator C) | W2-44 [derived]
- Deferred sync at micro-batch 1: 35% of compute; 22.0 GB of state against 4.4 GB (unsharded gradient per rank) | (Calculator C) | E3, T03-3 [derived]
- TorchTitan measured layout B at 67.6 to 71.9 GiB (72.6 to 77.2 GB) on 96 GB H100s, Float8, local batch 16, full recomputation, sequence length not stated | https://github.com/pytorch/torchtitan/blob/v0.4.0/docs/benchmarks/llama3_h100_202412_torchtitan.md#L10-L53 | T02-50, W1-23, U02-5 (hedge)
- Calculator's 43.0 GB = 4.4 GB state + 26.0 GB activations + 12.6 GB logits (FP32 plus BF16 at V = 128,256); register's 38.8 GB used FP32 logits only at V = 128,000 | (Calculator C) | W1-23 (orchestrator note: print the calculator's figure)
- Llama vocabulary 128,256 entries | https://github.com/meta-llama/llama-models/blob/v0.2.0/models/llama3/tokenizer.py#L53-L103 | T01-2
- Formula totals are lower bounds; plan for measured peaks above formula totals | (hedge) | U02-8
- Calculator ranks (CP held at 1: 27 shapes, first TP 8 x PP 2 (v 8) x DP 16 at 17.6 to 20.8 s, A's shape 2nd at 17.7 to 20.7 s, B's 11th at 17.5 to 26.0 s; CP up to 8: 92 shapes, 20th and 53rd); ranges overlap | (Calculator C, computed at render) | [derived; our reading of the calculator for the CP explanation]
- Best micro-batch depends on throughput, memory, p, d and B (Takeaway #3) | https://arxiv.org/abs/2104.04473v5 (Section 3.4) | T02-44
- Megatron Bridge recipe TP 4 x PP 4 x VP 5 x CP 2, SP, micro-batch 1, global batch 512, 8,192 tokens, distributed optimizer on | https://github.com/NVIDIA-NeMo/Megatron-Bridge/blob/04ce2b3efd6f2e387fc244e9f37afd0a1f7952fb/src/megatron/bridge/recipes/llama/h100/llama3.py#L717-L802 | T03-24
- Recipe model state 52.9 GB with distributed optimizer, 79.4 GB without; under 1 GB left of 80 GB | (Calculator C) | W2-46 [derived]
- CP ranks join the DP group for the gradient reduction | (Calculator C comment) | T02-26
- Guide recommends the distributed optimizer "for all multi-GPU training" | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/parallelism-guide.md#L211-L216 | T02-52, W2-46 (re-read at tag)
- `--use-distributed-optimizer` is store_true (off unless passed) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L3102-L3103 | T03-17 (re-read at tag)

## Example 2 (4 p5en.48xlarge, 32 H200)

- H200 141 GB (NVIDIA) and 141 GiB (AWS); calculator takes 141 GB, target 105.8 GB | https://www.nvidia.com/en-us/data-center/h200/ ; https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | W2-52, T05-3 [vendor claim]
- H200 has H100 compute; compute 140.2 s per step | (Calculator C) | T01-28 [derived]
- ZeRO-1 over 32: 308.7 GB of state; ZeRO-2: 172.0 GB | (Calculator C) | W2-50 [derived]
- FSDP 32 no recomputation: 221.4 GB (35.3 state + 179.9 activations + logits) | (Calculator C) | W2-51 [derived]
- FSDP 32 full recomputation: 54.6 GB; 58.0 GB with two gathered BF16 layers | (Calculator C) | W2-51, orchestrator note [derived]
- FSDP 32 traffic: at least 317.5 GB per instance per micro-batch, 0.79 s, against 11.7 s compute per micro-batch with recomputation, about 7%; flat ring 410.1 GB, 1.03 s, about 9%; calculator prints 5,080 GB per step, 9.1% of 140.2 s | (Calculator C) | W2-51 addendum (re-graded from 70%) [derived, our reading]
- HSDP 141.1 GB of state; over NVIDIA's 141 GB, under AWS's 141 GiB (151.4 GB); 160.4 GB with full recomputation | (Calculator C) | W2-52 [derived]
- TP 8 x DP 4 ZeRO-1: 35.3 GB weights and gradients + 26.5 GB optimizer + 22.5 GB activations + 0.8 GB logits = 85.0 GB; 102.6 GB with FP32 gradients | (Calculator C) | W2-53 [derived]
- 64 heads and 8 KV heads divide by 8 | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/transformer/transformer_config.py#L1746-L1773 | W2-18
- TP 8 x DP 4: TP 15.3% on NVLink; DP 211.7 GB per instance, 0.4%; step 140.2 to 162.1 s; ZeRO-2 variant 71.8 GB | (Calculator C) | [derived]
- ZeRO paper counts ZeRO-2 at ZeRO-1's volume, which holds at one micro-batch per step | https://arxiv.org/abs/1910.02054v3 (Section 1) | T02-7
- DeepSpeed reduces ZeRO-2's partitioned gradients every backward pass, ZeRO-1's at the accumulation boundary; ZeRO-2 variant at 128 micro-batches 13,652.1 GB per instance, 24.3% of compute | https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/runtime/zero/stage_1_and_2.py#L2293-L2295 ; Calculator C | build-log condition; fc05 replaced the stale "prices ZeRO-2 like ZeRO-1" row
- TP 8 x PP 2 x DP 2: 66.6 GB first stage, 56.1 GB last; 40 layers per stage; 256 micro-batches; bubble 0.39% | (Calculator C) | W2-54 [derived]
- First stage holds L layers' worth of activations under 1F1B | https://arxiv.org/abs/2205.05198v1 (Section 4.2.3) | W2-23; venue MLSys 2023 (orchestrator note, confirmed on proceedings.mlsys.org by fc04)
- On 32 H100: TP 8 x DP 4 85.0 GB does not fit; 64.1 GB with full recomputation (above 60 GB target); TP 8 x PP 4 57.8 GB no recomputation | (Calculator C) | W2-55 [derived]
- Shortlist: calculator's first shape with CP held at 1 (TP 4 x PP 4 (v 4) x DP 2, 140.6 to 151.3 s) and TP 8 x DP 4 (3rd, 140.2 to 162.1 s) overlap | (Calculator C, computed at render) | [derived]

## Calculator inputs

- Llama 3.1 shapes from Table 3 | https://arxiv.org/abs/2407.21783v3 | T01-1
- DeepSeek-V3 shape | https://arxiv.org/abs/2412.19437v2 (Section 4.2) | T02-71
- trn2.48xlarge 64 ranks at LNC=2; 24 GiB per rank (96 GiB / 4) | https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/about-torchtitan-neuron.rst | T03-38, 03 W3 [derived]
- No first-party MFU for dense Llama-class training on H200 or Trainium2 located | (hedge) | U01-5
- E2: denominator lesson on one GB10 | E2 | E2
- 34 sbh fused and 41 sbh eager per 8B layer, measured on one GB10 | E1 | E1
- Full recomputation factor 4/3 | (sections 4 and 5) | T01-34, T01-37
- A1 protocol cost 2 x 2 x $55.04 = $220; A2 2 x 3 x $55.04 = $330; window $771 On-Demand or $2,292 Capacity Block at $47.757 | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv ; https://aws.amazon.com/ec2/capacityblocks/pricing/ | T05-20, T05-22, RESEARCH-GUIDE section 5
- On-Demand quota for P instances starts at 0 vCPUs | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html | RESEARCH-GUIDE section 5
- AWS sample 487 GB/s bus bandwidth at 16 GiB | https://github.com/aws-samples/awsome-distributed-training/blob/3a1002576ccef26e66ba714303b10ccdaa645691/micro-benchmarks/nccl-tests/README.md#L206-L243 | wave2-parallelism addendum
