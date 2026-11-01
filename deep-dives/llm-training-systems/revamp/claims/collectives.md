# Claims: section 7, Collectives & What They Cost

File: `src/sections/Collectives.tsx`. Re-opened on 2026-10-31 (raw files at the pinned tags, pages via curl with no identifying headers): nccl-tests `doc/PERFORMANCE.md` at v2.21.1, Megatron Core `parallel_state.py` at core_v0.20.0, PyTorch `api.py` at v2.15.0, DeepSpeed `launch.py` and `topology.py` at v0.19.9, TorchTitan `parallelism_context.py` at v0.4.0, Slurm `srun.html`, NCCL 2.32.3 `env.html`, the NCCL 2.4 blog, the Llama 3.1 8B Hugging Face metadata at its pinned revision, and the awsome-distributed-training nccl-tests README at 3a1002576ccef26e66ba714303b10ccdaa645691. NVLink page, EC2 instance page, DeepSeek-V3, ZeRO Section 7.1 and the FSDP paper carry 2026-10-31 because wave 2 re-read them (W2-7, W2-11, W2-12, W2-14). Rows cited from the register without re-opening carry `accessed="2026-10-30"`. Derived figures were recomputed in Python.

Format: claim | source URL | register, wave 2 row or experiment

## Intro and ranks

- Per GPU on a p5.48xlarge, NVLink bandwidth is nine times the GPU's share of EFA | https://www.nvidia.com/en-us/data-center/nvlink/ ; https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T02-68, T02-70, W2-7 [derived]
- TP 8 x PP 4 x DP 8 = 256 ranks = 32 p5.48xlarge of 8 H100 each | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | W2-10 (arithmetic), T02-68
- torchrun gives each node's workers a contiguous range of global ranks | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/elastic/agent/server/api.py#L618-L688 | W2-3, wave2-parallelism G1
- DeepSpeed's launcher numbers ranks node by node in hostfile order | https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/launcher/launch.py#L160-L168 | W2-3, G1
- Slurm srun: block distribution (consecutive tasks share a node) is the default when tasks exceed nodes; with a topology plugin and no distribution given, tasks follow topology order rather than node index order | https://slurm.schedmd.com/srun.html | G1
- TorchTitan unflattens the world mesh as (pp, dp_replicate, dp_shard, cp, tp), row-major, tp fastest | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/distributed/parallelism_context.py#L319-L323 | W2-3, G1
- DeepSpeed ProcessTopology is row-major; PipeModelDataParallelTopology axes pipe, data, model | https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/runtime/pipe/topology.py#L18-L21 and #L247-L248 | W2-4, G1
- Megatron Core default order "tp-cp-ep-dp-pp" | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/parallel_state.py#L641 | T02-51, W2-58
- Megatron Core: "the caller should make sure adjacent ranks are on the same DGX box" | same file #L813-L816 | T02-51
- Megatron Core order string: "leftmost token = smallest stride = most adjacent ranks" (docstring of `_inject_gtp_remat_axis`, same file) | same file #L608 | W2-58
- Megatron Core docstring still gives the default as tp-dp-pp (docs side of a conflict; signature wins) | same file #L773-L775 | T02-51, C02-4
- A TP group of eight is eight consecutive ranks = one p5.48xlarge; a DP group takes the same local GPU from every instance; rank = 8 x DP index + TP index for TP 8 x DP 4 | derived from the five code rows above | W2-3, G1 [our reading]
- Check once per cluster: log global rank and hostname at start-up; a Slurm cluster with a topology plugin is the first place to look | srun.html for the topology case | G1 ("[our reading], not a quoted recommendation")
- Four codebases orientation paragraph (PyTorch DDP and FSDP2 with TorchTitan; Megatron Core with Megatron Bridge; DeepSpeed) | none (orientation) | R1 finding 5, SCOPE section 7

## Five operations and the identity

- Definitions of all-reduce, reduce-scatter, all-gather, all-to-all, send and receive by before and after | https://github.com/NVIDIA/nccl-tests/blob/v2.21.1/doc/PERFORMANCE.md#L33-L145 | T02-60, T02-61
- Bytes per rank: all-reduce 2(n-1)/n S; reduce-scatter, all-gather, all-to-all (n-1)/n S | same file #L134-L145 | T02-61, W2-8
- S for reduce-scatter and all-gather is the per-rank count times n | same file #L81 | T02-61
- Send and receive: the whole buffer once, one rank to one | definition | none (nccl-tests SendRecv factor 1 is in the AWS README table, not cited)
- Where the dive meets each collective (list) | pointers to sections 8 to 12 | T02-64 [our reading, assembled]
- Llama 3: all-gather and reduce-scatter in FSDP, point-to-point in PP | https://arxiv.org/abs/2407.21783v3 Sec 3.3.3 | T02-63 (accessed 2026-10-30)
- Megatron TP: two all-reduces per layer forward and two backward, every micro-batch | https://arxiv.org/abs/2104.04473v5 Sec 3.2 | T02-13 (accessed 2026-10-30)
- DeepSeek-V3 sends tokens to experts with a cross-node all-to-all | https://arxiv.org/abs/2412.19437v2 Sec 3.2.2 | T02-39, W2-11
- A bandwidth-optimal all-reduce is a reduce-scatter then an all-gather | https://arxiv.org/abs/1910.02054v3 Sec 7.1 | T02-4, W2-12
- Each half moves (n-1)/n; all-reduce 2(n-1)/n, independent of ring or tree | PERFORMANCE.md #L52-L63, #L39 | T02-60, W2-8
- Sequence parallelism replaces TP all-reduces with reduce-scatter plus all-gather at the same bytes | https://arxiv.org/abs/2205.05198v1 Sec 4.2.2 (venue MLSys 2023, proceedings.mlsys.org, confirmed 2026-10-31) | T02-16 (accessed 2026-10-30)
- ZeRO stages 1 and 2 move 2N elements per step, the same as plain DP, at one micro-batch per step (section 8 covers accumulation) | https://arxiv.org/abs/1910.02054v3 Sec 7.2.1 | T02-7 (accessed 2026-10-30)
- Reduce-scatter plus all-gather measured slower than one all-reduce of the same data | https://arxiv.org/abs/2205.05198v1 Sec 6.2 | T02-17 (accessed 2026-10-30)
- 2(n-1)/n = 1.75 at 8 ranks, 1.94 at 32 | arithmetic | [derived]

## Reading a benchmark

- algbw = S/t; busbw = algbw x collective factor, comparable to hardware peak regardless of rank count | PERFORMANCE.md #L16-L29 | T02-60
- busbw should reflect the hardware bottleneck (NVLink, PCI, QPI or network) | PERFORMANCE.md #L145 | T02-61
- Small sizes measure latency, large sizes bandwidth | PERFORMANCE.md #L5-L12 | new (same pinned file as T02-60)
- AWS sample, 2 x p5.48xlarge, 16 ranks: 17,179,869,184 B, 66,132 us, algbw 259.78, busbw 487.09 GB/s; 16,777,216 B at busbw 105.52 | https://github.com/aws-samples/awsome-distributed-training/blob/3a1002576ccef26e66ba714303b10ccdaa645691/micro-benchmarks/nccl-tests/README.md#L206-L243 (rows L232, L242) | NEW, not in any register (Tier 2 vendor sample, kind vendor-claim)
- The sample states no NCCL or EFA version | same README | NEW
- Arithmetic check 17.18 GB / 0.0661 s = 259.8; x 2 x 15/16 = 487 | arithmetic | [derived]
- Ring latency linear in GPU count; NCCL 2.4 double binary trees, full bandwidth, logarithmic latency | https://developer.nvidia.com/blog/massively-scale-deep-learning-training-nccl-2-4/ | T02-62, W2-57 (re-fetched 2026-10-31)
- NCCL chooses among ring, tree and newer algorithms itself (the page does not say per call); NCCL_ALGO overrides (lists Ring, Tree, CollnetChain, CollnetDirect, NVLS, NVLSTree, PAT) | https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/env.html | NEW (NCCL 2.32.3 user guide, pinned version per build-log)
- Bytes term decides a large gradient all-reduce, latency term the small TP messages | our reading | T02-62 use note [our reading]

## Bandwidth hierarchy

- H100 (Hopper) NVLink 900 GB/s per GPU in the table; the page's prose calls the newest generation's 3 TB/s (the table's last column) bidirectional; 450 GB/s per direction | https://www.nvidia.com/en-us/data-center/nvlink/ | T02-70, W2-7 [our reading for "per direction"]
- p5.48xlarge 3,200 Gb/s EFA | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T02-68, W2-7
- 400 GB/s per instance, 50 GB/s per GPU, ratio 9; neither page prints 450 or 50; AWS does not state per direction | arithmetic on the two pages | W2-7 [derived]
- DeepSeek H800: NVLink 160 GB/s, IB 50 GB/s, about 3.2x; each token to at most 4 nodes | https://arxiv.org/abs/2412.19437v2 Sec 3.2.2 | T02-39, W2-11
- Section 21 gives EFA per accelerator for other instances | cross-reference | SCOPE section 21
- NCCL ties each ring or tree to a NIC and tries to keep the same NIC across nodes when several NICs exist (NCCL_CROSS_NIC default 2) | NCCL 2.32.3 env.html | NEW
- Sample's 487 GB/s two-instance all-reduce busbw is close to ten times one GPU's 50 GB/s | ADT README L242; arithmetic | NEW [derived]
- Collectives that sum or gather combine inside the instance and spread the crossing over its cards (price per instance at 400 GB/s); all-to-all and send/receive pay each GPU's 50 GB/s share, nine times NVLink | our reading of NCCL_CROSS_NIC and the AWS sample | NEW [our reading]; replaces W2-9's "[our reading]" that a flat ring is bounded by 50 GB/s per GPU (see open item below)

## Pricing a collective

- time on a link = bytes that cross it / its bandwidth, against section 4's compute time | SCOPE section 7 | U02-9 hedge
- Llama 3.1 8B has 8,030,261,248 parameters | https://huggingface.co/api/models/meta-llama/Llama-3.1-8B/revision/d04e592bb4f6aa9cfee91e2e20afa771667e1d4b | T01-3 (re-fetched 2026-10-31)
- BF16 gradients 16.06 GB | arithmetic | 01 W2 [derived]
- One p5.48xlarge: 2 x 7/8 x 16.06 = 28.1 GB per GPU, 62 ms at 450 GB/s | arithmetic | W2-9 [derived]
- Four p5.48xlarge: 2 x 31/32 x 16.06 = 31.1 GB per GPU | arithmetic | W2-9 [derived]
- Four p5.48xlarge: at least 2 x 3/4 x 16.06 = 24.1 GB must leave each instance, about 60 ms at 400 GB/s | arithmetic, instance as one rank in the nccl-tests all-reduce formula | NEW [derived, our reading]
- Assumptions: BF16 gradients reduced in BF16, one all-reduce per step, link peaks, no overlap | stated | RESEARCH-GUIDE section 4
- Achieved bus bandwidth on p5 at the pinned software was not measured for this research | hedge | U02-9 (A1 on hold)
- FSDP paper counts 2M(W-1)/W cross-host traffic per GPU for full replication | https://arxiv.org/abs/2304.11277v2 Sec 3.2.2 | T02-9, W2-14
- Under that count: 31.1 GB / 50 GB/s = 0.62 s, ten times the in-instance time | arithmetic | W2-9 [derived]
- Same count on the sample: 2 x 15/16 x 17.18 = 32.2 GB per GPU, 0.64 s, against 66 ms measured in the sample; per-instance count 17.2 GB / 400 GB/s = 43 ms | arithmetic on ADT README L242 | NEW [derived]

## A1 protocol (not yet run)

- Measures nccl-tests all_reduce, reduce_scatter, all_gather, alltoall from 8 B to 16 GB on one and two p5.48xlarge, bus bandwidth and EFA counters, ten repeats compared bitwise | RESEARCH-GUIDE.md section 5 (GUIDE_URL) | A1, U02-9, U04-5, U05-8
- Deep Learning Base GPU AMI release 20261027 ships EFA installer 1.51.0 and aws-ofi-nccl 1.22.0 | https://docs.aws.amazon.com/dlami/latest/devguide/aws-deep-learning-ami-gpubaseoss-ul2404-2026-10-28.html | T05-43 (accessed 2026-10-30)
- Capacity Blocks do not support placement groups | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | T05-27 (accessed 2026-10-30)
- Prediction: one instance near 450 GB/s; two instances all-reduce in the range of the sample's 487 GB/s; all-to-all at most about 94 GB/s (100 GB/s algbw x 15/16) | our reading and arithmetic | NEW [our reading, derived]; presented as a prediction, never a result
- p5.48xlarge On-Demand $55.04 per hour, us-east-1, 2026-10-30; 2 x 2 x 55.04 = $220 | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv | T05-20 (accessed 2026-10-30) [derived]
- On-Demand quota for P instances starts at 0 vCPUs | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html | T05-31 (accessed 2026-10-30)
- A1 with two other experiments in a 7-hour window: $771 On-Demand or $2,292 for a one-day Capacity Block at $47.757 per instance-hour (US East N. Virginia, 2026-10-30); a block is charged at the price at purchase | https://aws.amazon.com/ec2/capacityblocks/pricing/ ; RESEARCH-GUIDE section 5 | T05-20, T05-22 (accessed 2026-10-30)
- Teardown: one stack, verified by listing instances by tag | RESEARCH-GUIDE section 5 group (b) | A1

## Ending

- TP four all-reduces per layer per micro-batch (action list) | https://arxiv.org/abs/2104.04473v5 Sec 3.2 | T02-13
- DP gradient reduction once per step, or per micro-batch when sync is not deferred (section 8 gives the defaults) | pointer | build-log condition "FSDP2 collective counts" (E3)
- Section 31 runs nccl-tests on one instance and two and reads bus bandwidth against these figures | cross-reference | W6-32
- Links: EFA dive section 9 (NCCL over EFA: the aws-ofi-nccl Plugin); vLLM dive section 9 (Distributed Inference); SGLang dive section 14 (Parallelism: TP, DP Attention & EP) | sibling App.tsx section arrays | SCOPE "Connections to existing deep dives"

## Open item for the fact check (affects sections 8, 14 and Calculator C)

The scope's worked number for this section ("across four instances a flat ring ... bounded by 50 GB/s of EFA per GPU, about 0.62 s, ten times longer") rests on W2-9's [our reading] that a flat ring's bus bandwidth equals each GPU's network share, which is also how the FSDP paper counts cross-host traffic (2M(W-1)/W, 3M(W-1)/W). AWS's own sample output contradicts that count: two p5.48xlarge all-reduce 16 GiB in 66 ms at 487 GB/s bus bandwidth, where the per-GPU count allows no less than 0.64 s. The page therefore prices the crossing per instance (400 GB/s on p5) for collectives that combine first, and keeps the 0.62 s only as the per-GPU count inside an expandable. Section 8's "flat FSDP about 373 GB per GPU per step across EFA" and its factors of 15 and 50 use the same per-GPU count and likely overstate flat FSDP's cross-instance bytes per GPU by about the GPUs-per-instance factor; Calculator C should be checked for the same assumption. A1 would settle it on current releases.
