# 02 Parallelism and the "set my ranks" procedure: research register

## 1. Header

- **Research date:** 2026-10-30. Every URL in this file was accessed 2026-10-30.
- **Area:** 02 of the LLM training systems dive. Data parallelism (DDP), ZeRO and FSDP (with HSDP and ZeRO++), tensor and sequence parallelism, context parallelism, pipeline parallelism and its schedules, expert parallelism, how the degrees combine, the communication each one adds (which collective, how many bytes, on which link), every published sizing procedure or tool, and the "set my ranks" decision procedure with two worked examples (Llama 3.1 70B on 256 H100 at 8K sequence; Llama 3.1 8B on 8 and on 32 H100).
- **Out of scope here (link, do not re-research):**
  - EFA, aws-ofi-nccl and NCCL environment configuration: `deep-dives/efa/src/sections/NcclOverEfa.tsx`; the per-strategy wire table: `deep-dives/efa/src/sections/AIMLTraining.tsx` (h2 "Parallelism Strategies & EFA Impact"); EFA bandwidth per instance: `InstanceSupport.tsx`; rank ordering and topology: `TopologyApi.tsx`.
  - NVLink, EFA and Trainium collectives as hardware: `deep-dives/silicon-memory-inference/src/sections/CommunicationAndScaleOut.tsx`; MoE sparsity for inference: `MoeAndSparseActivation.tsx`; Trainium chips: `AwsCustomSilicon.tsx`.
  - The 16 bytes per parameter memory accounting, activation memory formula and FLOPs per token: area 01 (`01-training-step-maths.md`). This file uses those results only where the rank-sizing check needs them, and cites the paper directly.
  - Framework configuration details (flags, config files): area 03 (`03-frameworks.md`). Instance specifications in depth: area 05.
- **Reader:** ex-EC2/Compute tech lead, strong on systems, networking, GPUs and inference; has not run large-scale distributed training.
- **Quote policy:** quotes are verbatim from the pinned version (PDF text via `pdftotext -layout`, or raw page text via `curl` with default user agent), with house-style normalisation: curly quotes become straight quotes, typographic dashes become " - ", inline maths is shown as plain text, ellipses mark omissions. A quote seen only through a WebFetch summary is marked "quote via WebFetch summary, not verified verbatim".
- **Verdicts:** NEW (recorded fresh from the primary source); CORRECT (a commonly repeated claim the primary source confirms); WRONG (a commonly repeated claim the primary source contradicts, with the true statement); STALE (true for an older version, with the version boundary); UNKNOWN (unresolved, see section 6).
- **Arithmetic:** any number not printed in a source is labelled [derived] with its inputs and the entry IDs they come from. A step of the decision procedure that no single source states is labelled [our reading].

### Tiers

| Tier | What it covers |
|---|---|
| Tier 0 | Our experiments (none in this file) |
| Tier 1 | Source code at a pinned tag or 40-char SHA; official framework documentation; first-party AWS and NVIDIA documentation and spec sheets (a spec-sheet peak FLOPS or bandwidth is a vendor specification and is labelled so) |
| Tier 2 | First-party lab or vendor blog posts and talks |
| Tier 3 | Papers ("peer-reviewed (venue)" only where the venue was confirmed from arXiv metadata or the paper's own page; otherwise "preprint"); third-party technical analysis (the Hugging Face Ultra-Scale Playbook sits here) |
| Tier 4 | Tutorials, summaries, press. Used only to locate primary sources, never as evidence |

Code over docs over blogs. Author and vendor performance numbers are claims, not measurements.

**Evidence kinds:** definition, formula, documentation of support, default value, benchmark claim (author or vendor reported), ablation, production report, code behaviour, pricing.

### Pinned sources

All accessed 2026-10-30. Venue column: "peer-reviewed" only where confirmed; the confirmation source is named.

**Papers (arXiv ID with version)**

PDFs were fetched from `arxiv.org/pdf/<id>` and the version read from the arXiv stamp in the text (2104.04473 from its abstract page); every citation below and in the register uses the versioned `abs` URL.

| arXiv | Paper | Venue | Entries |
|---|---|---|---|
| 2006.15704v1 | PyTorch Distributed: Experiences on Accelerating Data Parallel Training | peer-reviewed, VLDB 2020 (arXiv comment "To appear in VLDB 2020") | T02-1 to T02-3 |
| 1910.02054v3 | ZeRO: Memory Optimizations Toward Training Trillion Parameter Models | preprint (no venue in arXiv metadata) | T02-4 to T02-7 |
| 2304.11277v2 | PyTorch FSDP: Experiences on Scaling Fully Sharded Data Parallel | peer-reviewed, PVLDB 16(12) (paper's PVLDB Reference Format) | T02-8 to T02-10 |
| 2306.10209v1 | ZeRO++: Extremely Efficient Collective Communication for Giant Model Training | preprint | T02-11 |
| 1909.08053v4 | Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism | preprint | T02-12 |
| 2205.05198v1 | Reducing Activation Recomputation in Large Transformer Models | preprint | T02-16 to T02-19 |
| 2310.01889v4 | Ring Attention with Blockwise Transformers for Near-Infinite Context | preprint | T02-20, T02-21 |
| 2309.14509v2 | DeepSpeed Ulysses | preprint | T02-22, T02-23 |
| 2407.21783v3 | The Llama 3 Herd of Models | preprint, first-party lab | T02-24, T02-35, T02-46 to T02-48, T02-63, T02-66, T02-67 |
| 1811.06965v5 | GPipe | preprint (arXiv comment "Work in progress") | T02-27 |
| 2006.09503v3 | Memory-Efficient Pipeline-Parallel DNN Training (PipeDream-2BW, PipeDream-Flush) | peer-reviewed, ICML 2021 (PDF footer "Proceedings of the 38th International Conference on Machine Learning") | T02-29 |
| 2104.04473v5 | Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM (PTD-P) | peer-reviewed, SC 2021 (arXiv comment "Accepted to SC 2021") | T02-13, T02-14, T02-28 to T02-32, T02-43 to T02-45 |
| 2401.10241v1 | Zero Bubble Pipeline Parallelism | preprint | T02-33 |
| 2412.19437v2 | DeepSeek-V3 Technical Report | preprint, first-party lab | T02-34, T02-39, T02-40, T02-71 |
| 2006.16668v1 | GShard | preprint | T02-37 |
| 2101.03961v3 | Switch Transformers | peer-reviewed, JMLR 23 (2022) (PDF header) | T02-36 |
| 2504.14960v3 | MoE Parallel Folding: Heterogeneous Parallelism Mappings for Efficient Large-Scale MoE Model Training with Megatron Core | preprint | T02-41 |
| 2410.06511v3 | TorchTitan | preprint | T02-49, T02-50 |

**Code and in-repository documentation (tag and 40-char SHA; all tags are lightweight, no peeled SHA)**

| Repository | Tag | SHA | Files read | Entries |
|---|---|---|---|---|
| NVIDIA/nccl-tests | v2.21.1 | afd59abab774a6a4b492eb344bd0c845a0b7bb4d | `doc/PERFORMANCE.md` | T02-60, T02-61 |
| NVIDIA/Megatron-LM | core_v0.20.0 | 685fb8bd970185e9ac3283fe32a5d6667bf4b268 | `megatron/training/arguments.py`, `megatron/core/parallel_state.py`, `megatron/core/transformer/transformer_config.py`, `megatron/core/num_microbatches_calculator.py`, `megatron/core/transformer/moe/README.md`, `docs/user-guide/parallelism-guide.md`, `docs/user-guide/features/context_parallel.md` | T02-15, T02-25, T02-26, T02-41, T02-42, T02-51 to T02-53, T02-72 |
| pytorch/torchtitan | v0.4.0 | 45e33cd413b64cb37a7840cfd3c9765d3c639ae1 | `docs/benchmarks/llama3_h100_202412_torchtitan.md`, `torchtitan_recipes/models/llama3.py` | T02-50, T02-59 |
| deepspeedai/DeepSpeed | v0.19.9 | 8d4f29c75f4a4b30d4db00a94b4aebfdff5107f3 | `deepspeed/autotuning/README.md` | T02-56 |
| NVIDIA/NeMo | v2.7.3 | 1d4ee423806d461f9146ae982f9da8eb32495ae7 | `examples/llm/auto_configurator/README.md`, `nemo/collections/llm/tools/auto_configurator/core/training_config.py` | T02-54, T02-55 |
| NVIDIA/NeMo | v3.0.0 | fd6a877539710e2b98f28c43272ff81312f83417 | tree listing only (no auto-configurator path) | T02-55 |

**Documentation and vendor pages (unversioned web pages)**

- https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html (T02-68)
- https://aws.amazon.com/ec2/instance-types/p5/ (T02-68)
- https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/about-neuron/announcements/neuron2.x/announce-maintenance-nxdt-nxd-core-training.html (T02-65; versioned path)
- https://www.nvidia.com/en-us/data-center/h100/ (T02-69)
- https://www.nvidia.com/en-us/data-center/nvlink/ (T02-70)
- https://developer.nvidia.com/blog/massively-scale-deep-learning-training-nccl-2-4/ (T02-62, Tier 2)
- https://huggingface.co/spaces/nanotron/ultrascale-playbook/tree/c93890dd4b22356ee18ed9b863e6f2d0909729bc, content served from https://nanotron-ultrascale-playbook.static.hf.space/index.html (T02-57, T02-58, Tier 3)

---

## 2. Claim register

### A. Data parallelism (DDP): one gradient all-reduce per step, overlapped with backward

**T02-1. In data parallelism every rank holds a full model replica and the gradients are averaged with an all-reduce; ring and tree all-reduce are the standard algorithms, and the all-reduce is synchronous (no rank can finish until all join).**
- Location: 2006.15704v1, Sec 2.2 "Data Parallelism".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2006.15704v1 | Tier 3, peer-reviewed (VLDB 2020) | definition | "The AllReduce operation expects each participating process to provide an equally-sized tensor, collectively applies a given arithmetic operation (e.g., sum, prod, min, max) to input tensors from all processes, and returns the same result tensor to each participant. ... communication libraries have implemented more sophisticated and more efficient algorithms, such as ring-based AllReduce [2] and tree-based AllReduce [22]. As one AllReduce operation cannot start until all processes join, it is considered to be a synchronized communication" (accessed 2026-10-30)
- Use in dive: the opening mental model of the parallelism section (the slowest rank sets the pace). Builds a mental model.
- Link: `deep-dives/efa/src/sections/AIMLTraining.tsx`, h2 "Parallelism Strategies & EFA Impact" (DDP row and its 2 x model_size x (N-1)/N per step).

**T02-2. PyTorch DDP overlaps the gradient all-reduce with the backward pass by grouping gradients into buckets and launching an asynchronous all-reduce on a bucket as soon as all its gradients are ready; buckets are filled in the reverse order of `model.parameters()` to approximate backward order.**
- Location: 2006.15704v1, Sec 3.2.3 "Overlap Computation with Communication", Algorithm 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2006.15704v1 | Tier 3, peer-reviewed (VLDB 2020) | definition (system design) | "The AllReduce operation on gradients can start before the local backward pass finishes. With bucketing, DDP only needs to wait for all contents in the same bucket before launching communications. ... If hooks of all gradients in the same buckets have fired, the last hook will trigger an asynchronous AllReduce on that bucket." "PyTorch v1.5.0 addresses this problem by using the reverse order of model.parameters() as the bucketing order, assuming that, layers are likely registered according to the same order as they are invoked in the forward pass." (accessed 2026-10-30)
- Use in dive: why DP communication is mostly hidden behind compute on a single node and becomes exposed only when the last bucket's all-reduce outlasts the remaining backward work. Builds a mental model.

**T02-3. DDP's default bucket size is 25 MB, and the paper names bucket size as the key trade-off (larger buckets amortise per-collective overhead but delay the first all-reduce); it tells applications to measure it.**
- Location: 2006.15704v1, Sec 4.2 (bucket allreduce paragraph).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2006.15704v1 | Tier 3, peer-reviewed (VLDB 2020) | default value | "Bucket Allreduce is the main source of communication overhead in DDP. On one hand, packing more gradients into the same bucket would reduce the amortized system overhead of communication. One the other hand, using a large bucket size would result in longer lead time for reduction, as each bucket needs to wait for more gradients. Hence, bucket size is the key trade-off. By default, each bucket is 25MB in size. Applications should measure their impact empirically and set it to the optimal value for their use cases." (accessed 2026-10-30)
- Use in dive: practical to know (the `bucket_cap_mb` knob). The current default in PyTorch code was not re-read at a pinned release in this pass (U02-1).

**T02-4. Data-parallel communication per step is 2 x Psi elements per rank for a model of Psi parameters, because a bandwidth-optimal all-reduce is a reduce-scatter (Psi) followed by an all-gather (Psi); it is bandwidth-bound for large models.**
- Location: 1910.02054v3, Sec 7.1 "Data Parallel Communication Volume".
- Verdict: CORRECT (the commonly quoted "DP moves twice the model per step" figure)
- Evidence: https://arxiv.org/abs/1910.02054v3 | Tier 3, preprint | formula | "For a large model size, the all-reduce communication is entirely communication bandwidth bound ... State-of-art implementation of all-reduce uses a two-step approach, where the first step is a reduce-scatter operation, which reduces different part of the data on different process. The next step is an all-gather operation where each process gathers the reduced data on all the process. ... Both reduce-scatter and all-gather are implemented using a pipelined approach, that results in a total data movement of Psi elements (for a data with Psi elements) for each. Therefore, the standard DP incurs 2Psi data movement during each training step." (accessed 2026-10-30)
- Use in dive: the DP row of the communication table. The exact per-rank figure is 2 x Psi x (n-1)/n (T02-60); ZeRO's 2Psi is the large-n limit. In bytes, multiply by the gradient dtype size (2 for BF16 gradients, 4 for FP32 reduction). Builds a mental model and feeds the parallelism calculator.

### B. ZeRO, FSDP, HSDP and ZeRO++: sharding the replicated state

**T02-5. Mixed-precision Adam holds 2Psi bytes of FP16 weights, 2Psi of FP16 gradients and K x Psi of optimizer state with K = 12 (FP32 master weights, momentum, variance): 16Psi bytes per replica before activations.**
- Location: 1910.02054v3, Sec 3.1 "Model States: Optimizer States, Gradients and Parameters".
- Verdict: CORRECT (the "16 bytes per parameter" figure)
- Evidence: https://arxiv.org/abs/1910.02054v3 | Tier 3, preprint | formula | "Let's use K to denote the memory multiplier of the optimizer states, i.e., the additional memory required to store them is KPsi bytes. Mixed-precision Adam has K = 12. In total, this results in 2Psi + 2Psi + KPsi = 16Psi bytes of memory requirement." (accessed 2026-10-30; the first clause is quote via pdftotext with the line break at "memory" rejoined)
- Use in dive: the input to every per-rank memory check in section 3. Area 01 owns the derivation; this file uses the figure.

**T02-6. ZeRO stage 1 (optimizer-state partitioning, Pos) cuts model-state memory per rank from 4Psi + KPsi to 4Psi + KPsi/Nd, about 4x at large Nd; stage 2 (adds gradients, Pos+g) to 2Psi + 14Psi/Nd, about 8x; stage 3 (adds parameters, Pos+g+p) to 16Psi/Nd, linear in the data-parallel degree.**
- Location: 1910.02054v3, Sec 1 (stage list), Sec 5.1 to 5.3, Figure 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/1910.02054v3 | Tier 3, preprint | formula | "1) Optimizer State Partitioning (Pos): 4x memory reduction, same communication volume as DP; 2) Add Gradient Partitioning (Pos+g): 8x memory reduction, same communication volume as DP; 3) Add Parameter Partitioning (Pos+g+p): Memory reduction is linear with DP degree Nd. For example, splitting across 64 GPUs (Nd = 64) will yield a 64x memory reduction. There is a modest 50% increase in communication volume." "the memory consumption after optimizing state partition reduces from 4Psi + KPsi to 4Psi + KPsi/Nd". "the memory footprint further down to 2Psi + 14Psi/Nd ≈ 2Psi" (accessed 2026-10-30)
- Use in dive: the memory calculator's sharding selector. Builds a mental model: each stage removes one replicated tensor class.

**T02-7. ZeRO stages 1 and 2 move the same bytes per step as plain DP (a reduce-scatter of gradients, Psi, then an all-gather of updated parameters, Psi); stage 3 moves 3Psi, 1.5x DP, because parameters are all-gathered once in forward and again in backward, plus the gradient reduce-scatter.**
- Location: 1910.02054v3, Sec 7.2.1 and 7.2.2.
- Verdict: CORRECT (the "ZeRO-3 costs 1.5x DP" figure)
- Evidence: https://arxiv.org/abs/1910.02054v3 | Tier 3, preprint | formula | "instead of an all-reduce, ZeRO only requires a scatter-reduce operation on the gradients, incurring communication volume of Psi. After each process updates the partition of the parameters that it is responsible for, an all-gather is performed to collect all the updated parameters from all the data parallel process. This also incurs a communication volume of Psi. So the total communication volume per training step is Psi + Psi = 2Psi, exactly the same as the baseline DP." "this all-gather needs to happen once again for the backward propagation in the reverse order. ... The total volume is therefore 3Psi which is 1.5x compared to the baseline." (accessed 2026-10-30)
- Use in dive: the ZeRO rows of the communication table, and the reason ZeRO-1 is close to free while ZeRO-3 is a bandwidth decision. Builds a mental model.

**T02-8. PyTorch FSDP generalises ZeRO-3 with a sharding factor F: F = 1 is full replication (DDP), F = W (world size) is full sharding, and 1 < F < W is hybrid sharding; FSDP materialises one unit's parameters at a time during forward.**
- Location: 2304.11277v2, Sec 3.2 "Sharding Strategies", Sec 3.1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2304.11277v2 | Tier 3, peer-reviewed (PVLDB 16(12)) | definition | "we introduce the sharding factor F as the number of ranks over which parameters are sharded. By setting the sharding factor to 1, FSDP fully replicates the model and simplifies to vanilla data parallelism ... By setting the sharding factor equal to the number of devices (i.e., global world size W), FSDP fully shards the model, with each device only holding 1/W of the model. Hybrid sharding occurs when the sharding factor ranges between 1 and W." (accessed 2026-10-30; quote via pdftotext, two-column layout, words rejoined across lines)
- Use in dive: FSDP and ZeRO-3 are one idea; HSDP is the knob between DDP and ZeRO-3. Builds a mental model.

**T02-9. In hybrid sharding (HSDP) the gradient reduce-scatter runs inside each sharding group, followed by an all-reduce across replication groups; mapping sharding groups to hosts keeps all-gather and reduce-scatter on the intra-host link and leaves only the replica all-reduce on the network. The paper gives cross-host traffic per GPU as 2M(W-1)/(GW) for hybrid, against 2M(W-1)/W for full replication and 3M(W-1)/W for full sharding.**
- Location: 2304.11277v2, Sec 3.2.2 "Hybrid Sharding", Eq. 1, Figure 4.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2304.11277v2 | Tier 3, peer-reviewed (PVLDB 16(12)) | formula | "For gradient reduction, the single reduce-scatter over all ranks becomes a reduce-scatter within each of the sharded groups followed by an all-reduce within each of the replicated groups to reduce the sharded gradients." "Hybrid sharding can take advantage of datacenter locality for accelerated training and can reduce cross host traffic ... consider a cluster as a group of W accelerators grouped into hosts of of G accelerators each ... we can set F = W/G [sic, see C02-1] to limit the AllGather (and ReduceScatter) operations within the same host, while creating a replication group for accelerators with the same local rank across hosts. For an M-sized model, we can then compute the total cross-host traffic per GPU in the hybrid setup to be 2M (W-1)/(GW), a drastic reduction compared to full replication's 2M (W-1)/W and full sharding's 3M (W-1)/W." (accessed 2026-10-30; fractions reconstructed from pdftotext output where the layout splits numerator and denominator; verify against the PDF before quoting on the page)
- Use in dive: HSDP is the default answer when a model's 16Psi does not fit on one GPU but does fit across one node's GPUs. Practical to know.

**T02-10. FSDP's paper motivates hybrid sharding for medium-sized models that run out of memory with full replication but leave memory unused under full sharding, and reports that smaller-world-size all-reduces perform better than global ones because of stragglers and network interference.**
- Location: 2304.11277v2, Sec 3.2.2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2304.11277v2 | Tier 3, peer-reviewed (PVLDB 16(12)) | benchmark claim (author reported, qualitative) | "since the AllReduce collectives used in hybrid sharding operates at a smaller world size, they empirically achieve a better performance than invoking collectives at the global scale (in the case of full replication and full sharding), due to straggler effects and larger network interference." "These models are large enough to cause out of memory issues when trained with full replication but are not large enough to fully utilize accelerator memory when used with full sharding, leading to both runtime overhead and memory waste." (accessed 2026-10-30)
- Use in dive: the 8B worked example on 4 nodes (section 3). Practical to know.

**T02-11. ZeRO++ cuts ZeRO-3's cross-node volume from 3M to 0.75M with three changes: INT8-quantized forward weight all-gather (qwZ, M to 0.5M), a secondary intra-node copy of weights so the backward all-gather stays in the node (hpZ, M to 0), and an INT4 all-to-all based gradient reduce-scatter that reduces inside the node first (qgZ, M to 0.25M). Authors report up to 2.16x throughput at 384 GPUs.**
- Location: 2306.10209v1, Sec 1 ("Communication Volume Reduction"), abstract.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2306.10209v1 | Tier 3, preprint | formula plus benchmark claim (author reported) | "By incorporating all three components above, we reduce the cross-node communication volume from 3M down to 0.75M. More specifically, for forward all-gather operation on model weights, by applying INT8 quantization, we reduce the communication size from M to 0.5M. During backward all-gather on weights, with our secondary copy of model parameters, we reduce the communication size from M to 0. By replacing backward fp16 reduce-scatter on gradients to our novel all-to-all based INT4 reduce-scatter, we reduce cross-node communication from M to 0.25M." "Collectively, ZeRO++ reduces communication volume of ZeRO by 4x, enabling up to 2.16x better throughput at 384 GPU scale." (accessed 2026-10-30)
- Use in dive: the option for ZeRO-3 on slow inter-node links, and a second illustration of the hierarchy principle (keep the expensive step inside the node). The hpZ copy costs memory, so it is a memory-for-bandwidth trade. Practical to know.

### C. Tensor parallelism and sequence parallelism: all-reduces inside every layer

**T02-12. Megatron tensor parallelism splits the first MLP GEMM by columns and the second by rows, so the nonlinearity runs locally and only one all-reduce is needed per block in forward (operator g) and one in backward (operator f); attention is split by heads the same way. A transformer layer costs two all-reduces in forward and two in backward.**
- Location: 1909.08053v4, Sec 3 "Model Parallel Transformers", Figures 3 and 4.
- Verdict: CORRECT
- Evidence: https://arxiv.org/abs/1909.08053v4 | Tier 3, preprint | definition | "we partition the first GEMM in this column parallel fashion and split the second GEMM along its rows so it takes the output of the GeLU layer directly without requiring any communication ... This approach splits both GEMMs in the MLP block across GPUs and requires only a single all-reduce operation in the forward pass (g operator) and a single all-reduce in the backward pass (f operator)." "f is an identity operator in the forward pass and all reduce in the backward pass while g is an all reduce in the forward pass and identity in the backward pass." "partitioning the GEMMs associated with key (K), query (Q), and value (V) in a column parallel fashion such that the matrix multiply corresponding to each attention head is done locally on one GPU." "This enables us to perform all GEMMs in a simple transformer layer using only two all-reduces in the forward path and two in the backward path" (accessed 2026-10-30)
- Use in dive: the TP diagram (column then row, one collective per block). Builds a mental model.

**T02-13. Tensor-parallel traffic is 8bsh(t-1)/t per layer per device per micro-batch (b micro-batch size, s sequence length, h hidden size, t TP degree; in elements), and l_stage times that per pipeline stage; it scales with activations, not with parameters, and is paid on every micro-batch.**
- Location: 2104.04473v5, Sec 3.2 "Tensor and Pipeline Model Parallelism".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2104.04473v5 | Tier 3, peer-reviewed (SC 2021) | formula | "Tensor model parallelism, on the other hand, uses all-reduce communication (two all-reduce operations each in the forward and backward pass, see §2.3). ... With tensor model parallelism, tensors of total size bsh need to be all-reduced among t model replicas twice each in the forward and backward pass for each layer, leading to a total communication of 8bsh (t-1)/t per layer per device for each microbatch. Each device typically has multiple layers; the total amount of tensor-parallel-communication per device for each microbatch is then l_stage · 8bsh (t-1)/t, where l_stage is the number of layers in a pipeline stage." (accessed 2026-10-30)
- Use in dive: the TP row of the communication table and the parallelism calculator. The "8" is 4 all-reduces x 2 (each ring all-reduce moves 2(t-1)/t of the tensor, T02-60); multiply by 2 bytes for BF16 activations [our reading of the formula's units: the paper counts tensor elements]. Builds a mental model.

**T02-14. Megatron's Takeaway #1: use tensor parallelism up to the GPU count of one server and pipeline parallelism across servers, because TP's per-layer all-reduces are impractical on slower inter-node links.**
- Location: 2104.04473v5, Sec 3.2, "Takeaway #1"; Sec 1 guiding principles.
- Verdict: CORRECT (the "keep TP inside the node" rule)
- Evidence: https://arxiv.org/abs/2104.04473v5 | Tier 3, peer-reviewed (SC 2021) | formula-backed guidance plus ablation | "Thus, when t is larger than the number of GPUs in a single node, the overhead of performing tensor model parallelism across slower inter-node links can be impractical. We see these results empirically in §5.4." "Takeaway #1: When considering different forms of model parallelism, tensor model parallelism should generally be used up to degree g when using g-GPU servers, and then pipeline model parallelism can be used to scale up to larger models across servers." "sub-optimal combinations of tensor and pipeline model parallelism can lead to up to 2× lower throughput, even with high-bandwidth network links between servers" (accessed 2026-10-30)
- Use in dive: step 2 of the decision procedure (section 3). Practical to know.
- Link: `deep-dives/efa/src/sections/AIMLTraining.tsx` (Model Parallelism row: "keep TP on NVLink").

**T02-15. Megatron-Core rejects a configuration unless attention heads divide by the TP degree, and unless the number of query groups (KV heads under GQA) is a multiple or a divisor of the TP degree; the world size must divide by TP x PP x CP, and the global batch must divide by micro-batch x data-parallel size.**
- Location: Megatron-LM core_v0.20.0, `megatron/core/transformer/transformer_config.py` lines 1746 to 1773; `megatron/training/arguments.py` lines 468 to 487; `megatron/core/num_microbatches_calculator.py` lines 381 to 386.
- Verdict: NEW
- Evidence: https://github.com/NVIDIA/Megatron-LM/blob/685fb8bd970185e9ac3283fe32a5d6667bf4b268/megatron/core/transformer/transformer_config.py#L1746-L1773 | Tier 1, code | code behaviour | "if self.num_attention_heads % self.tensor_model_parallel_size != 0: raise ValueError( f"num_attention_heads ({self.num_attention_heads}) must be a multiple of " f"tensor_model_parallel_size ({self.tensor_model_parallel_size})."" and "if ( self.num_query_groups % self.tensor_model_parallel_size != 0 and self.tensor_model_parallel_size % self.num_query_groups != 0 ): raise ValueError( f"num_query_groups ({self.num_query_groups}) must be a multiple or divisor of "". Also https://github.com/NVIDIA/Megatron-LM/blob/685fb8bd970185e9ac3283fe32a5d6667bf4b268/megatron/training/arguments.py#L468-L487: "total_model_size = ( args.tensor_model_parallel_size * args.pipeline_model_parallel_size * args.context_parallel_size * args.gtp_weight_remat_size" ... "assert args.world_size % total_model_size == 0". And https://github.com/NVIDIA/Megatron-LM/blob/685fb8bd970185e9ac3283fe32a5d6667bf4b268/megatron/core/num_microbatches_calculator.py#L381-L386: "assert global_batch_size % micro_batch_times_data_parallel_size == 0, ( 'global batch size ({}) is not divisible by micro batch size ({})' ' times data parallel size ({})'" (accessed 2026-10-30)
- Use in dive: the divisibility constraints of the decision procedure, from code rather than folklore. For Llama 3.1 (8 KV heads, T02-67) TP of 1, 2, 4 or 8 passes both checks; TP 16 would also pass the query-group check (16 is a multiple of 8) but violates T02-14. Practical to know.

**T02-16. Sequence parallelism splits the non-tensor-parallel regions (layer norm, dropout) along the sequence dimension and replaces each TP all-reduce with an all-gather plus a reduce-scatter (four of each per layer per forward and backward); because a ring all-reduce is a reduce-scatter plus an all-gather, the bytes moved are the same, so SP adds no communication volume.**
- Location: 2205.05198v1, Sec 4.2.2 "Sequence Parallelism", Figure 5.
- Verdict: CORRECT (the "SP is free in bandwidth" claim), with a measured caveat in T02-17
- Evidence: https://arxiv.org/abs/2205.05198v1 | Tier 3, preprint | formula | "g is an all-gather in the forward pass and a reduce-scatter in the backward pass, and ḡ is a reduce-scatter in the forward pass and an all-gather in the backward pass. ... Tensor parallelism requires four all-reduces in a single forward and backward pass whereas tensor together with sequence parallelism requires four all-gathers and four reduce-scatters in a single forward and backward pass. ... However, we note that a ring all-reduce is composed of two steps: a reduce-scatter followed by an all-gather. As a result, the communication bandwidth used for tensor parallelism and tensor together with sequence parallelism are the same. Therefore, sequence parallelism does not introduce any communication overhead." (accessed 2026-10-30)
- Use in dive: SP always rides with TP; the TP row's bytes do not change when SP is on. Builds a mental model.

**T02-17. The same paper measured that a reduce-scatter plus all-gather executes slower than one all-reduce of the same data, so SP's per-layer speedup (7.7 ms to 7.2 ms forward, 6%) comes from running layer norm and dropout on 1/t of the data; SP's main value is memory.**
- Location: 2205.05198v1, Sec 6.2 (Table 4 discussion).
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2205.05198v1 | Tier 3, preprint | ablation (author reported) | "reducing the forward time from 7.7ms to 7.2ms, a 6% speedup. This improvement comes from the layer-norm and dropout layers being performed on 1/t of the data. We also found that even though the amount of data moved is the same, the execution of reduce-scatter and all-gather combined is slower than an all-reduce alone, reducing the improvement from sequence parallelism. Note that this speedup is an additional benefit to the primary advantage of using sequence parallelism, which is the memory savings that allow for less recomputation of activations." (accessed 2026-10-30)
- Use in dive: a doc-level claim (T02-16) against a measurement; the dive should state both. Practical to know.

**T02-18. Activation memory per transformer layer (bytes, 16-bit activations, GPT-style layer with a 4h MLP and a attention heads) is sbh(34 + 5as/h) with no parallelism, sbh(10 + 24/t + 5as/(ht)) with TP, sbh(34/t + 5as/(ht)) with TP plus SP, sbh(34/t) with TP plus SP plus selective recomputation, and 2sbh with full recomputation.**
- Location: 2205.05198v1, Table 2 "Activations Memory Per Transformer Layer"; Sec 4 and 5.
- Verdict: NEW (area 01 owns the derivation; recorded here because the per-rank memory check needs it)
- Evidence: https://arxiv.org/abs/2205.05198v1 | Tier 3, preprint | formula | Table 2 rows: "no parallelism: sbh(34 + 5as/h)"; "tensor parallel (baseline): sbh(10 + 24/t + 5as/(ht))"; "tensor + sequence parallel: sbh(34/t + 5as/(ht))"; "tensor parallel + selective activation recomputation: sbh(10 + 24/t)"; "tensor parallel + sequence parallel + selective activation recomputation: sbh(34/t)"; "full activation recomputation: sbh(2)" (accessed 2026-10-30; table cells reconstructed from pdftotext output)
- Use in dive: the activation term of the memory check. Caveat [our reading]: the constant 34 is derived for a GPT layer (4h GeLU MLP, full multi-head attention); Llama's SwiGLU MLP (3.5h for 70B, T02-67) and GQA change the constant, so the worked examples in section 3 treat it as an approximation and say so.

**T02-19. With 1F1B pipelining the first stage holds activations for p micro-batches of L/p layers each, so it stores L layers' worth regardless of the pipeline degree: total first-stage activation memory is (sbhL/t)(34 + 5as/h) with TP plus SP. Megatron's interleaved schedule multiplies this by (1 + (p-1)/(pm)), m being the number of model chunks per device.**
- Location: 2205.05198v1, Sec 4.2.3 "Pipeline Parallelism", Eq. 5.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2205.05198v1 | Tier 3, preprint | formula | "pipeline parallelism does not uniformly divide the total memory required for activations by p. ... To keep the pipeline pressurized and avoid extra idle time, the first stage must store activations for p microbatches ... Each stage contains L/p layers so the first stage must store p × L/p = L layers worth of activations regardless of the pipeline parallel size p." "the interleaving schedule developed in Megatron-LM [13] requires storing activations for L(1 + (p-1)/(pm)) layers where m is the number of interleaving stages." (accessed 2026-10-30)
- Use in dive: the single most useful correction to the naive "PP divides activations by p" intuition. The per-rank memory check in section 3 uses it. Builds a mental model and is practical to know.

### D. Context parallelism: splitting the sequence, and paying for attention's cross-token reach

**T02-20. Ring Attention splits the sequence into blocks across hosts arranged in a ring; each host computes attention for its query block against one key-value block while sending that block to the next host and receiving the previous host's, so the transfer is hidden whenever computing one block takes longer than moving it.**
- Location: 2310.01889v4, Sec 3 "Ring Attention with Blockwise Parallel Transformers", Figure 2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2310.01889v4 | Tier 3, preprint | definition | "We leverage this property by conceptualizing all hosts as forming a ring structure ... each host efficiently coordinates by concurrently sending key-value blocks being used for attention computation to the next host while receiving key-value blocks from the preceding host, effectively overlapping transferring of blocks with blockwise computation. ... If the computation time exceeds the time required for transferring key-value blocks, this results in no additional communication cost." (accessed 2026-10-30)
- Use in dive: the ring-pass mental model for CP. Builds a mental model.

**T02-21. Ring Attention's overlap condition is block size c >= F/B (F the host's FLOPS, B the unidirectional link bandwidth), with a minimum sequence per device of s = 6c. The paper's Table 2: A100 over NVLink (312 TF, 300 GB/s) needs c of about 1.0K and s of about 6.2K tokens per device; A100 over InfiniBand (12.5 GB/s) needs c of about 24.5K and s of about 149.5K.**
- Location: 2310.01889v4, Sec 3 "Arithmetic Intensity Between Hosts", Table 2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2310.01889v4 | Tier 3, preprint | formula plus derived table (author computed) | "the following condition must hold: 4dc^2/F ≥ 4cd/B. This implies that the block size, denoted as c, should be greater than or equal to F/B. Effectively, this means that the block size needs to be larger than the ratio of FLOPs over bandwidth." "Our analysis shows that the model needs to have a sequence length of s = 6c, which is six times the minimal block size." "For GPUs connected via InfiniBand, which offers lower bandwidth, the requirements are more strict." Table 2 rows (FLOPS TF, HBM GB, interconnect GB/s, minimal block size x1e3, minimal sequence length x1e3): "A100 NVLink 312 80 300 1.0 6.2"; "A100 InfiniBand 312 80 12.5 24.5 149.5". (accessed 2026-10-30; table values reconstructed from pdftotext column order)
- Use in dive: a clean F/B intuition that tells the reader when CP across nodes hides its traffic and when it does not. Practical to know. The H100 on EFA version of this number is [derived] in section 3.

**T02-22. DeepSpeed-Ulysses partitions the sequence across P GPUs and uses an all-to-all before attention so each GPU holds the full sequence for a subset of heads, and a second all-to-all after it; per-link volume is 4Nh/P per layer (3Nh for Q, K, V plus Nh for the output), constant when N and P grow together. The paper contrasts this with 4Nh per link for Megatron's sequence parallelism.**
- Location: 2309.14509v2, Sec 3 "DeepSpeed-Ulysses Core Design", Sec 3.1 "Communication Analysis".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2309.14509v2 | Tier 3, preprint | formula | "it employs all-to-all communication collective on the partitioned queries, keys and values such that each GPU receives the full sequence but only for a non-overlapping subset of the attention heads." "the communication volume transmitted per link for an all-to-all for aggregate message of size M over P GPUs is M/P. For a transformer model with hidden size h, sequence length of N, and parallelism degree of P, DS-Sequence performs all-to-all for the QKV projections with an aggregate message size of 3Nh before the attention computation, and another all-to-all for output context projection with a size Nh for each transformer layer. Therefore, DeepSpeed sequence parallelism incurs an aggregate communication volume per link of 4Nh/P" (accessed 2026-10-30)
- Use in dive: the all-to-all alternative to the ring. Builds a mental model.

**T02-23. Ulysses' parallel degree is bounded by the attention head count, because each GPU must own whole heads after the all-to-all; the paper describes the head split but does not state the bound or a GQA rule in its text.**
- Location: 2309.14509v2, Sec 1 and Sec 3 (head-partition description); no explicit limit statement located.
- Verdict: UNKNOWN for the paper's own wording (U02-2); the bound follows from the mechanism in T02-22 [our reading]
- Evidence: https://arxiv.org/abs/2309.14509v2 | Tier 3, preprint | definition | "each GPU receives the full sequence but only for a non-overlapping subset of the attention heads. This allows the participating GPUs to compute attention for different attention heads in parallel." A text search of the PDF for "limit", "GQA", "grouped" and "multi-query" found no statement of the head-count bound. (accessed 2026-10-30)
- Use in dive: the "head-count limit" of the brief. With Llama 3.1's 8 KV heads (T02-67), a Ulysses degree above 8 needs KV heads replicated or a hybrid with a ring [our reading; DeepSpeed code not read in this pass].

**T02-24. Llama 3 used context parallelism with an all-gather of K and V (not a ring), splitting each sequence into 2 x CP chunks so rank i holds chunks i and 2 x CP - 1 - i for causal-mask load balance. Meta accepted the exposed all-gather because GQA makes K and V much smaller than Q and attention compute is O(S^2) against O(S) for the all-gather, and because all-gather supports arbitrary masks such as the document mask.**
- Location: 2407.21783v3, Sec 3.3.2 "Context parallelism for long sequences".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2407.21783v3 | Tier 3, preprint, first-party lab | production report | "we partition the input sequence into 2 × CP chunks so each CP rank receives two chunks for better load balancing. The i-th CP rank received both the i-th and the (2 × CP - 1 - i)-th chunks. Different from existing CP implementations that overlap communication and computation in a ring-like structure (Liu et al., 2023a), our CP implementation adopts an all-gather based method where we first all-gather the key (K) and value (V) tensors, and then compute attention output for the local query (Q) tensor chunk. Although the all-gather communication latency is exposed in the critical path, we still adopt this approach for two main reasons: (1) it is easier and more flexible to support different types of attention masks in all-gather based CP attention, such as the document mask; and (2) the exposed all-gather latency is small as the communicated K and V tensors are much smaller than Q tensor due to the use of GQA (Ainslie et al., 2023). Hence, the time complexity of attention computation is an order of magnitude larger than all-gather (O(S^2) versus O(S), where S represents the sequence length in the full causal mask), making the all-gather overhead negligible." (accessed 2026-10-30)
- Use in dive: GQA turns CP's K/V traffic into a small fraction of the hidden-state size (8 KV heads of 64 for 70B: 1/8 of Q, T02-67). Builds a mental model and is practical (CP is cheap on GQA models).

**T02-25. Megatron-Core's CP splits inputs and all activations along the sequence (unlike SP, which splits only layer norm and dropout), all-gathers K and V in forward and reduce-scatters their gradients in backward, implemented as ring point-to-point; it lists p2p, a2a, allgather and a2a+p2p as communication types (default p2p). NVIDIA's guide puts the CP threshold at "8K+" tokens and says CP divides both compute and activation memory per GPU by the CP degree.**
- Location: Megatron-LM core_v0.20.0, `docs/user-guide/features/context_parallel.md` lines 19 to 34; `megatron/training/arguments.py` lines 3186 to 3191; `docs/user-guide/parallelism-guide.md` lines 112 to 125.
- Verdict: NEW
- Evidence: https://github.com/NVIDIA/Megatron-LM/blob/685fb8bd970185e9ac3283fe32a5d6667bf4b268/docs/user-guide/features/context_parallel.md | Tier 1, official framework documentation at a pinned SHA | definition | "Unlike prior SP (sequence parallelism), which only splits the sequence of Dropout and LayerNorm activations, CP partitions the network inputs and all activations along the sequence dimension. ... CP therefore requires an additional all-gather across GPUs to collect the full sequence of KV. Correspondingly, reduce-scatter is applied to the activation gradients of KV in backward propagation. ... The all-gather and reduce-scatter are implemented as point-to-point communications in a ring topology. Exchanging KV can also leverage MQA or GQA to reduce communication volume". "With CP, each GPU computes on part of the sequence, which scales down both compute and communication by the CP degree. ... The activation memory footprint per GPU is also smaller by the CP degree". Code: https://github.com/NVIDIA/Megatron-LM/blob/685fb8bd970185e9ac3283fe32a5d6667bf4b268/megatron/training/arguments.py#L3186-L3191 "group.add_argument('--cp-comm-type', nargs='+', type=str, default=["p2p"], help='Inter-gpu communication type for context parallelism: ' 'p2p, a2a, allgather or a2a+p2p." (accessed 2026-10-30)
- Use in dive: the four CP variants map to T02-20 (p2p ring), T02-22 (a2a Ulysses), T02-24 (allgather, Llama 3) and a hierarchical mix. Practical to know.

**T02-26. CP replicates weights across the CP group, so Megatron-Core folds CP ranks into the data-parallel group for the weight-gradient all-reduce; CP adds no parameter memory saving and does not add batch parallelism.**
- Location: Megatron-LM core_v0.20.0, `megatron/core/parallel_state.py`, `initialize_model_parallel` docstring (context_parallel_size); `megatron/training/arguments.py` lines 494 to 499 (`data_parallel_size` and `batch_parallel_size`).
- Verdict: NEW
- Evidence: https://github.com/NVIDIA/Megatron-LM/blob/685fb8bd970185e9ac3283fe32a5d6667bf4b268/megatron/core/parallel_state.py | Tier 1, code (docstring plus code) | code behaviour | "Context parallelism partitions sequence length, so it has no impact on weights, which means weights are duplicated among GPUs in a context parallel group. Hence, weight gradients all-reduce is required in backward. For simplicity, we piggyback GPUs of context parallelism on data parallel group for weight gradient all-reduce." and https://github.com/NVIDIA/Megatron-LM/blob/685fb8bd970185e9ac3283fe32a5d6667bf4b268/megatron/training/arguments.py#L494-L499 "args.data_parallel_size = args.world_size // total_model_size" with "args.batch_parallel_size = args.world_size // ( args.tensor_model_parallel_size * args.pipeline_model_parallel_size * args.context_parallel_size )" (accessed 2026-10-30)
- Use in dive: in the worked examples, CP=2 halves activations but leaves the 16 bytes per parameter of model state untouched unless the optimizer is sharded over DP x CP. Practical to know.

### E. Pipeline parallelism: bubbles, schedules and the memory they cost

**T02-27. GPipe splits a mini-batch into M micro-batches across K partitions; the idle "bubble" is O((K-1)/(M+K-1)) and the authors found it negligible when M >= 4K.**
- Location: 1811.06965v5, Sec 2.3 "Performance Optimization".
- Verdict: CORRECT (the "M >= 4 x stages" rule of thumb)
- Evidence: https://arxiv.org/abs/1811.06965v5 | Tier 3, preprint | formula plus benchmark claim | "partitioning introduces some idle time per accelerator, which we refer to as the bubble overhead. This bubble time is O((K-1)/(M+K-1)) amortized over the number of micro-steps M. In our experiments, we found the bubble overhead to be negligible when M ≥ 4 × K." (accessed 2026-10-30; fraction reconstructed from pdftotext)
- Use in dive: the origin of the most quoted pipeline rule of thumb. Practical to know.

**T02-28. With p stages and m micro-batches, the GPipe-style bubble is (p-1)(t_f + t_b) against ideal time m(t_f + t_b), so the bubble fraction is (p-1)/m and m must be much larger than p; GPipe must stash activations for all m micro-batches.**
- Location: 2104.04473v5, Sec 2.2.1 "Default Schedule".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2104.04473v5 | Tier 3, peer-reviewed (SC 2021) | formula | "In this schedule, the pipeline bubble consists of p - 1 forward passes at the start of a batch, and p - 1 backward passes at the end. The total amount of time spent in the pipeline bubble is then t_pb = (p - 1) · (t_f + t_b). The ideal processing time for the batch is t_id = m · (t_f + t_b). Therefore, the fraction of ideal computation time spent in the pipeline bubble is: Bubble time fraction (pipeline bubble size) = t_pb/t_id = (p-1)/m. For the bubble time fraction to be small, we thus need m ≫ p. However, for such large m, this approach has a high memory footprint as it requires stashed intermediate activations ... to be kept in memory for all m microbatches" (accessed 2026-10-30)
- Use in dive: the bubble formula the parallelism calculator uses. Note the denominator differs from T02-27: (p-1)/m is bubble over ideal time; (p-1)/(m+p-1) is bubble over total time [our reading]. Builds a mental model.

**T02-29. 1F1B (PipeDream-Flush) keeps the same bubble as GPipe but caps in-flight micro-batches at the pipeline depth p, so activation stashing is bounded by p rather than by m.**
- Location: 2104.04473v5, Sec 2.2.1; 2006.09503v3, Sec 3.2 "Weight Updates with Flushes (PipeDream-Flush)".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2104.04473v5 | Tier 3, peer-reviewed (SC 2021) | formula | "The time spent in the bubble is the same for this new schedule, but the number of outstanding forward passes is at most the number of pipeline stages for the PipeDream-Flush schedule. As a result, this schedule requires activations to be stashed for p or fewer microbatches (compared to m microbatches for the GPipe schedule)." Also https://arxiv.org/abs/2006.09503v3 | Tier 3, peer-reviewed (ICML 2021) | definition | "With PipeDream-Flush, the total number of in-flight "active" input activations is less than or equal to the pipeline depth, giving it lower memory footprint than GPipe, which has to maintain input activations proportional to the number of microbatches over which gradients are averaged (m)." (accessed 2026-10-30)
- Use in dive: why every modern framework defaults to 1F1B; combined with T02-19, the first stage holds p micro-batches of L/p layers. Builds a mental model.

**T02-30. The interleaved 1F1B schedule gives each device v model chunks, cutting the bubble to (1/v)(p-1)/m at the cost of v times more pipeline communication, and requires the number of micro-batches to be an integer multiple of p.**
- Location: 2104.04473v5, Sec 2.2.2 "Schedule with Interleaved Stages".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2104.04473v5 | Tier 3, peer-reviewed (SC 2021) | formula | "This new schedule ... requires the number of microbatches in a batch to be an integer multiple of the degree of pipeline parallelism (number of devices in the pipeline). For example, with 4 devices, the number of microbatches in a batch must be a multiple of 4." "If each device has v stages (or model chunks), then the forward and backward time for a microbatch for each stage or chunk will now be t_f/v and t_b/v. The pipeline bubble time thus reduces to t_pb^int. = (p-1)·(t_f+t_b)/v, and the bubble time fraction is then: ... = (1/v) · (p-1)/m. This means that the new schedule reduces the bubble time by v. This reduced pipeline bubble size, however, does not come for free: this schedule requires extra communication. Quantitatively, the amount of communication also increases by v." (accessed 2026-10-30)
- Use in dive: the v knob in the worked examples. Megatron's MoE guide gives the valid range as the divisors of num_layers/PP and calls a middle value the usual best balance (T02-42). Llama 3 relaxed the multiple-of-p requirement (T02-35). Practical to know.

**T02-31. Pipeline point-to-point traffic is bsh elements per micro-batch per stage boundary in each direction; when TP is also used, Megatron's scatter/gather optimization sends 1/t of it per rank over each rank's own network card and re-assembles with an all-gather over NVLink, cutting the cross-node volume to bsh/t per rank.**
- Location: 2104.04473v5, Sec 3.2 and Sec 4.1 "Communication Optimizations", Figure 9.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2104.04473v5 | Tier 3, peer-reviewed (SC 2021) | formula | "With pipeline parallelism, the total amount of communication that needs to be performed between every pair of consecutive devices (for either the forward or backward pass) for each microbatch is bsh, where s is the sequence length and h is the hidden size." "we can instead split the tensor on the send side into equal-sized chunks, and then only send one chunk to the corresponding rank on the next node using the rank's own InfiniBand card ... Then, on the receive side, we can perform an all-gather over NVLink, which is much faster than the InfiniBand interconnect, to re-materialize the full tensor. ... Quantitatively, with the scatter-gather communication optimization, the total amount of communication that needs to be performed between every pair of consecutive stages is reduced to bsh/t" (accessed 2026-10-30)
- Use in dive: the PP row of the communication table, and the reason PP is the dimension to put across EFA (small, point-to-point, once per micro-batch per boundary). Builds a mental model; feeds the calculator.
- Link: `deep-dives/efa/src/sections/AIMLTraining.tsx` (Model Parallelism row: "EFA carries the pipeline stages between nodes").

**T02-32. Activation recomputation is "required" to train reasonably large models with pipeline parallelism, per Megatron; checkpointing every one or two transformer layers is usually optimal for memory.**
- Location: 2104.04473v5, Sec 3.5 "Activation Recomputation".
- Verdict: STALE as a blanket rule. True for full recomputation on the paper's A100 setups (2021); the boundary is sequence parallelism with selective recomputation (2205.05198, 2022, T02-18) and Llama 3's 405B pre-training at 8K tokens on H100 "without activation checkpointing" (2407.21783, 2024, T02-35).
- Evidence: https://arxiv.org/abs/2104.04473v5 | Tier 3, peer-reviewed (SC 2021) | guidance | "Activation recomputation is required to train reasonably large models with pipeline parallelism to keep memory footprint acceptably low." "If a model stage has l layers, and if c is the number of checkpoints, the total memory footprint is going to be c · A_input + l/c · A_intermediate. ... For most cases, checkpointing every 1 or 2 transformer layers is optimal." (accessed 2026-10-30)
- Use in dive: a 2021 statement that SP plus selective recomputation (T02-18) and Llama 3's "8K without activation checkpointing" (T02-35) later relaxed. The dive should present it as the A100-era default. Practical to know.

**T02-33. Zero Bubble pipelining splits the backward pass into B (gradient for the input) and W (gradient for the weights). ZB-H1 keeps 1F1B's peak activation memory (p x M_B) and cuts the bubble to (p-1)(T_F + T_B - T_W), about a third of 1F1B's; ZB-H2 reaches zero bubble at (2p-1) x M_B and bypasses the synchronisation before the optimizer step. Authors report up to 23% throughput over 1F1B at similar memory and 31% with relaxed memory.**
- Location: 2401.10241v1, abstract; Sec 2.1, 2.2, 2.3 and Table 2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2401.10241v1 | Tier 3, preprint | formula plus benchmark claim (author reported) | "The key idea behind this improvement is to split the backward computation into two parts, one that computes gradient for the input and another that computes for the parameters." "ZB-H1 ... ensures that the maximum peak memory usage over all workers doesn't exceed that of 1F1B ... the bubble size is reduced to a third of 1F1B's size." "When we permit a larger memory footprint than 1F1B and have a sufficient number of microbatches, it's possible to achieve a zero bubble schedule, which we label as ZB-H2." Table 2: "1F1B: Bubble size (p - 1)(T_F + T_B + T_W), Peak activations memory pM_B; ZB-H1: (p - 1)(T_F + T_B - T_W), pM_B; ZB-H2: (p - 1)(T_F + T_B - 2T_W), (2p - 1)M_B". "our method outperforms the 1F1B schedule up to 23% in throughput under a similar memory limit. This number can be further pushed to 31% when the memory constraint is relaxed." (accessed 2026-10-30)
- Use in dive: the modern answer to the bubble; in Table 2, T_B is the input-gradient part only, so 1F1B's full backward is T_B + T_W. Builds a mental model.

**T02-34. DeepSeek's DualPipe feeds micro-batches from both ends of the pipeline and overlaps one forward chunk with one backward chunk (attention, all-to-all dispatch, MLP, all-to-all combine, PP send), giving a bubble of (PP/2 - 1)(F&B + B - 3W) against 1F1B's (PP - 1)(F + B), at the cost of two copies of the parameters and PP + 1 micro-batches of activations; it needs PP stages and micro-batches divisible by 2 only.**
- Location: 2412.19437v2, Sec 3.2.1 "DualPipe and Computation-Communication Overlap", Table 2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2412.19437v2 | Tier 3, preprint, first-party lab | formula | "For DeepSeek-V3, the communication overhead introduced by cross-node expert parallelism results in an inefficient computation-to-communication ratio of approximately 1:1." "we divide each chunk into four components: attention, all-to-all dispatch, MLP, and all-to-all combine. Specially, for a backward chunk, both attention and MLP are further split into two parts, backward for input and backward for weights, like in ZeroBubble". Table 2: "1F1B (PP - 1)(F + B) 1× PP; ZB1P (PP - 1)(F + B - 2W) 1× PP; DualPipe (Ours) (PP/2 - 1)(F&B + B - 3W) 2× PP + 1". "Although DualPipe requires keeping two copies of the model parameters, this does not significantly increase the memory consumption since we use a large EP size during training. ... DualPipe only requires that the pipeline stages and micro-batches be divisible by 2, without requiring micro-batches to be divisible by pipeline stages." (accessed 2026-10-30)
- Use in dive: DualPipe is a communication-hiding schedule first and a bubble reducer second; it fits MoE with cross-node EP. Builds a mental model.

**T02-35. Llama 3 changed its pipeline schedule to make N (contiguous micro-batches per stage) tunable so batch size is not tied to stage count, removed one transformer layer from the first and last stages to balance embedding and loss work, used interleaving with V stages per rank (bubble (PP-1)/(V x M)), made point-to-point asynchronous, and trained at 8K sequence "without activation checkpointing".**
- Location: 2407.21783v3, Sec 3.3.2 "Pipeline parallelism improvements", Figure 6.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2407.21783v3 | Tier 3, preprint, first-party lab | production report | "Current implementations have constraints on supported batch size per GPU, requiring it to be divisible by the number of pipeline stages." "Memory imbalance. ... The first stage consumes more memory due to the embedding and the warm-up micro-batches." "we modify our pipeline schedule as shown in Figure 6, which allows setting N flexibly ... To balance the pipeline, we reduce one Transformer layer each from the first and the last stages, respectively. ... To reduce pipeline bubbles, we use an interleaved schedule (Narayanan et al., 2021) with V pipeline stages on one pipeline rank. Overall pipeline bubble ratio is (PP-1)/(V*M). Further, we adopt asynchronous point-to-point communication in PP ... With these optimizations, we could pre-train Llama 3 on sequences of 8K tokens without activation checkpointing." (accessed 2026-10-30)
- Use in dive: the production version of T02-30, and evidence that recomputation is optional at 8K on H100 with these changes. Practical to know.

### F. Expert parallelism: all-to-all sized by routing

**T02-36. Switch Transformer sets expert capacity = (tokens per batch / number of experts) x capacity factor; tokens beyond capacity are dropped (passed through the residual), and a larger capacity factor reduces drops at the cost of computation and communication.**
- Location: 2101.03961v3, Sec 2.2 "Efficient Sparse Routing", Eq. 3, Figure 3.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2101.03961v3 | Tier 3, peer-reviewed (JMLR 23, 2022) | formula | "The expert capacity - the number of tokens each expert computes - is set by evenly dividing the number of tokens in the batch across the number of experts, and then further expanding by a capacity factor, expert capacity = (tokens per batch / number of experts) × capacity factor. A capacity factor greater than 1.0 creates additional buffer to accommodate for when tokens are not perfectly balanced across experts. If too many tokens are routed to an expert (referred to later as dropped tokens), computation is skipped and the token representation is passed directly to the next layer through the residual connection. Increasing the expert capacity is not without drawbacks, however, since high values will result in wasted computation and memory." (accessed 2026-10-30)
- Use in dive: the capacity factor is the static buffer size of the all-to-all; it multiplies dispatch bytes. Builds a mental model.

**T02-37. GShard uses AllToAll to reshard tokens to experts and back, and measured that AllToAll cost on its 2D TPU mesh grows roughly as O(sqrt(D)) in the number of partitions D, unlike AllReduce which stays roughly flat.**
- Location: 2006.16668v1, Sec 3.3.2 (AllToAll operator), Sec 5.3 "Performance scaling of communication primitives", Figure 9.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2006.16668v1 | Tier 3, preprint | benchmark claim (author reported, TPU) | "Two critical collective communication operators in the MoE model are AllReduce and AllToAll. AllReduce is used in accumulating partial results, and AllToAll is used in resharding". "AllToAll, on the other hand, gets more expensive as the number of partitions grows, but in a sublinear manner. On our 2D TPU cluster, AllToAll cost is roughly O(sqrt(D)), where D is the number of partitions" (accessed 2026-10-30; the sqrt symbol is reconstructed, pdftotext shows "O( D)")
- Use in dive: all-to-all is topology-sensitive in a way all-reduce is not. The TPU figure does not transfer to EFA; it is a mental model only.

**T02-38. Expert-parallel traffic per MoE layer per rank, forward: dispatch sends each local token's hidden state to each of its k routed experts, and combine returns the same volume; backward repeats both. With T local tokens, hidden size h, top-k routing and EP degree E, the bytes leaving a rank per layer are about 2 x T x k x h x bytes_per_element x (E-1)/E in forward and the same in backward, before capacity-factor padding and per-node de-duplication.**
- Location: [derived] from T02-36 (capacity), T02-34 (dispatch and combine as separate components), T02-39 (FP8 dispatch, BF16 combine), and the all-to-all definition in nccl-tests (T02-60).
- Verdict: NEW [derived; no single source located that prints this formula for top-k routing during this research]
- Evidence: inputs as listed | Tier 3 inputs | formula [derived] | Assumes uniform routing; the (E-1)/E factor is the share of a token's experts that live on other ranks under uniform placement [our reading].
- Use in dive: the EP row of the communication table. Worked example for DeepSeek-V3 (h = 7168, k = 8, FP8 dispatch) is in section 3 only as an order of magnitude. Builds a mental model.

**T02-39. DeepSeek-V3 limits each token to at most M = 4 nodes (chosen by the sum of the top expert affinities per node), sends it over InfiniBand once per target node to the GPU with the same in-node index, then forwards over NVLink; NVLink (160 GB/s) is about 3.2x IB (50 GB/s), so a token can reach an average of 3.2 experts per node at no extra cost. Dispatch is in FP8; combine stays in BF16.**
- Location: 2412.19437v2, Sec 2.1.2 "Node-Limited Routing"; Sec 3.2.2 "Efficient Implementation of Cross-Node All-to-All Communication"; Sec 3.3.4 "Low-Precision Communication".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2412.19437v2 | Tier 3, preprint, first-party lab | production report | "we ensure that each token will be sent to at most M nodes, which are selected according to the sum of the highest K_r/M affinity scores of the experts distributed on each node." "NVLink offers a bandwidth of 160 GB/s, roughly 3.2 times that of IB (50 GB/s). To effectively leverage the different bandwidths of IB and NVLink, we limit each token to be dispatched to at most 4 nodes, thereby reducing IB traffic. For each token, when its routing decision is made, it will first be transmitted via IB to the GPUs with the same in-node index on its target nodes. Once it reaches the target nodes, we will endeavor to ensure that it is instantaneously forwarded via NVLink to specific GPUs that host their target experts". "we quantize the activation before MoE up-projections into FP8 and then apply dispatch components ... For both the forward and backward combine components, we retain them in BF16" (accessed 2026-10-30)
- Use in dive: hierarchical all-to-all is the EP analogue of HSDP and ZeRO++ (cross the slow link once, fan out on the fast link). The 160 and 50 GB/s are H800 cluster figures, not H100 or EFA. Builds a mental model.
- Link: `deep-dives/silicon-memory-inference/src/sections/MoeAndSparseActivation.tsx` (MoE sparsity for inference).

**T02-40. DeepSeek-V3 trained on 2,048 H800 GPUs with 16-way pipeline parallelism, 64-way expert parallelism spanning 8 nodes and ZeRO-1 data parallelism, without tensor parallelism; the cross-node EP made computation to communication roughly 1:1, which DualPipe was built to hide.**
- Location: 2412.19437v2, Sec 3.1 "Compute Clusters", Sec 3.2 "Training Framework".
- Verdict: CORRECT (the commonly quoted "no TP, PP16, EP64, ZeRO-1" layout)
- Evidence: https://arxiv.org/abs/2412.19437v2 | Tier 3, preprint, first-party lab | production report | "DeepSeek-V3 is trained on a cluster equipped with 2048 NVIDIA H800 GPUs. Each node in the H800 cluster contains 8 GPUs connected by NVLink and NVSwitch within nodes." "DeepSeek-V3 applies 16-way Pipeline Parallelism (PP) (Qi et al., 2023a), 64-way Expert Parallelism (EP) (Lepikhin et al., 2021) spanning 8 nodes, and ZeRO-1 Data Parallelism (DP)". "we meticulously optimize the memory footprint during training, thereby enabling us to train DeepSeek-V3 without using costly Tensor Parallelism (TP)." (accessed 2026-10-30)
- Use in dive: [derived] attention layers run DP = 2048 / 16 = 128; expert layers run EP 64 x expert-DP 2 (2048 / (16 x 64)) (inputs: this entry). The MoE scale story. Builds a mental model.

**T02-41. Megatron-Core's MoE Parallel Folding gives attention layers a TP x CP x DP x PP grid and MoE layers an independent ETP x EP x EDP x PP grid, with only the PP grouping shared; this removes the older constraint that EP be a sub-group of DP. Authors report 49.3% MFU for Mixtral 8x22B and 39.0% for Qwen2-57B-A14B on H100.**
- Location: 2504.14960v3, Sec 3.2 "MoE Parallel Folding", abstract; Megatron-LM core_v0.20.0 `megatron/core/transformer/moe/README.md` lines 325 to 355; `megatron/core/parallel_state.py` lines 946 to 960.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2504.14960v3 | Tier 3, preprint | definition plus benchmark claim (author reported) | "previous methods place the EP group in a sub-group of DP, which greatly restricts the scalability of MoE. The maximum degree of expert parallelism is bounded by the degree of data parallelism." "for the attention layers, we form a four-dimensional parallel group comprising TP × CP × DP × PP. For the MoE layers, we define another four-dimensional group consisting of TP × EP × DP × PP. ... The only restriction is that the number of PP groups and members of each PP group for the Attention and MoE layer must be consistent." "We achieve up to 49.3% Model Flops Utilization (MFU) for the Mixtral 8x22B model and 39.0% MFU for the Qwen2-57B-A14B". Code: https://github.com/NVIDIA/Megatron-LM/blob/685fb8bd970185e9ac3283fe32a5d6667bf4b268/megatron/core/parallel_state.py#L946-L960 "expert_tensor_model_pipeline_parallel_size = ( expert_tensor_parallel_size * expert_model_parallel_size * pipeline_model_parallel_size * expert_gtp_remat_size ) expert_data_parallel_size = world_size // expert_tensor_model_pipeline_parallel_size" (accessed 2026-10-30)
- Use in dive: for MoE, "world size = product of degrees" holds separately for the attention grid and the expert grid. Practical to know (see C02-2 for the doc that gets this wrong).

**T02-42. Megatron-Core's MoE guidance: minimise model parallelism and maximise data parallelism; keep EP x TP inside the NVLink domain; use PP (with virtual stages) to scale across nodes; prefer EP over TP for expert layers (ETP = 1 recommended for fine-grained MoE); turn on CP at 8K tokens and above.**
- Location: Megatron-LM core_v0.20.0, `megatron/core/transformer/moe/README.md` lines 170 to 224 and line 524.
- Verdict: NEW
- Evidence: https://github.com/NVIDIA/Megatron-LM/blob/685fb8bd970185e9ac3283fe32a5d6667bf4b268/megatron/core/transformer/moe/README.md | Tier 1, official framework documentation at a pinned SHA | guidance | "Guideline 1: Minimize Model Parallelism, Maximize Data Parallelism ... Keep TP/EP/PP as small as possible while avoiding OOM". "Guideline 2: Keep EP and TP Communication Within NVLink Domain ... Ensure EP×TP fits within a single node (typically 8 GPUs) ... When scaling beyond one node, prefer PP over expanding TP/EP across nodes". "For very large MoE models like DeepSeek-V3, the EP communication may exceed the NVLink bandwidth. In this case, consider using 1F1B A2A Overlap". "**VPP Size Tuning:** - Valid values: all divisors of `num_layers / PP_size` - Example: `num_layers=24, PP=4` → valid VPP sizes: `{1, 2, 3, 6}` - Trade-off: Larger VPP = fewer bubbles but more P2P communications - Recommendation: A middle value often gives the best balance". "Guideline 4: Prefer EP over TP for Expert Layers ... For Mixtral 8x7B, EP8×TP1 outperforms EP4×TP2." "Guideline 5: Enable Context Parallelism (CP) for Long Sequences ... Sequence length ≥ 8K tokens". "--expert-tensor-parallel-size ... Same as TP(Recommended to set to 1 for fine-grained MoE models)" (accessed 2026-10-30)
- Use in dive: the MoE branch of the decision procedure. Practical to know.

### G. Combining the degrees: published layouts and the order they nest in

**T02-43. Megatron's Takeaway #2: choose the total model-parallel size M = t x p just large enough that parameters and intermediate state fit in GPU memory, then scale with data parallelism; TP all-reduces run every micro-batch, while DP all-reduces run once per batch.**
- Location: 2104.04473v5, Sec 3.3.2 "Data and Tensor Model Parallelism", Takeaway #2.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2104.04473v5 | Tier 3, peer-reviewed (SC 2021) | guidance | "With tensor model parallelism, all-reduce communication needs to be performed for every microbatch. This can be expensive across multi-GPU servers. On the other hand, data parallelism only needs to perform expensive all-reduce communication once per batch. Moreover, with tensor model parallelism, each model-parallel rank performs a subset of the computation in each model layer, and thus for insufficiently-large layers, modern GPUs might not perform these sub-matrix computations with peak efficiency. Takeaway #2: When using data and model parallelism, a total model-parallel size of M = t · p should be used so that the model's parameters and intermediate metadata fit in GPU memory; data parallelism can be used to scale up training to more GPUs." (accessed 2026-10-30)
- Use in dive: step 3 of the decision procedure ("smallest model-parallel size that fits"). Practical to know.

**T02-44. With n GPUs, t = 1 and data-parallel size d, the pipeline bubble is (n-d)/b' where b' = B/b (global batch over micro-batch), so growing d shrinks the bubble; the DP ring all-reduce cost grows only as (d-1)/d. The optimal micro-batch size depends on the model, p, d and B, and Megatron estimates step time as (b'/b + p - 1)(t_f(b) + t_b(b)) [sic: b' here is B/d].**
- Location: 2104.04473v5, Sec 3.3.1 "Pipeline Model Parallelism", Sec 3.4 "Microbatch Size", Eq. 1, Takeaway #3.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2104.04473v5 | Tier 3, peer-reviewed (SC 2021) | formula | "The number of microbatches per pipeline is m = B/(d · b) = b'/d, where b' := B/b. With total number of GPUs n, the number of pipeline stages is p = n/(t · d) = n/d. The pipeline bubble size is: (p-1)/m = (n/d - 1)/(b'/d) = (n - d)/b'." "Overall throughput will thus increase if the all-reduce communication needed for data parallelism does not drastically increase with higher d, which should hold since the communication time for a ring-based implementation scales with (d-1)/d = 1 - 1/d." "the total time spent computing a batch, ignoring communication cost, is (as before, define b' as B/d): (b'/b + p - 1) · (t_f(b) + t_b(b))." "Takeaway #3: The optimal microbatch size b depends on the throughput and memory footprint characteristics of the model, as well as the pipeline depth p, data-parallel size d, and batch size B." (accessed 2026-10-30)
- Use in dive: the parallelism calculator's step-time model, and the tension it encodes (more DP shrinks the bubble but is capped by the global batch, T02-47). The paper reuses b' with two meanings (B/b in 3.3.1, B/d in 3.4); the dive should define symbols once. Builds a mental model.

**T02-45. Megatron reports that its PTD-P layout outperforms ZeRO-3 (without model parallelism) by 70% for 175B and 530B models, attributing the gap to less cross-node communication; its 1T-parameter run reached 502 PFLOP/s on 3,072 A100s (52% of peak per GPU).**
- Location: 2104.04473v5, abstract and Sec 1.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2104.04473v5 | Tier 3, peer-reviewed (SC 2021) | benchmark claim (author reported) | "We also compared to ZeRO [36], and found that our approach outperforms ZeRO-3 by 70% for models with 175 and 530 billion parameters due to less cross-node communication." "Our approach allows us to perform training iterations on a model with 1 trillion parameters at 502 petaFLOP/s on 3072 GPUs (per-GPU throughput of 52% of theoretical peak)." (accessed 2026-10-30)
- Use in dive: the A100-era evidence that pure sharding loses to TP plus PP at very large scale. The comparison predates FSDP2, HSDP and ZeRO++; the dive should date it. Practical to know.

**T02-46. Llama 3 nests its four dimensions as [TP, CP, PP, DP] from innermost to outermost: the innermost needs the most bandwidth and least latency and stays inside a server; DP (FSDP) is outermost because it tolerates latency by prefetching weights and reducing gradients asynchronously. Its FSDP shards optimizer states and gradients but does not reshard parameters after forward, avoiding the backward all-gather.**
- Location: 2407.21783v3, Sec 3.3.2 "Network-aware parallelism configuration", "Parallelism for Model Scaling", Figure 5.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2407.21783v3 | Tier 3, preprint, first-party lab | production report | "The innermost parallelism requires the highest network bandwidth and lowest latency, and hence is usually constrained to within the same server. The outermost parallelism may spread across a multi-hop network and should tolerate higher network latency. Therefore, based on the requirements for network bandwidth and latency, we place parallelism dimensions in the order of [TP, CP, PP, DP]. DP (i.e., FSDP) is the outermost parallelism because it can tolerate longer network latency by asynchronously prefetching sharded model weights and reducing gradients." "Our use of FSDP for Llama 3 shards optimizer states and gradients, but for model shards we do not reshard after forward computation to avoid an extra all-gather communication during backward passes." (accessed 2026-10-30)
- Use in dive: the nesting rule of the decision procedure (step 6). The "no reshard after forward" choice is ZeRO-2-like for parameters: it trades the memory of a full parameter shard per PP stage for one fewer all-gather [our reading]. Builds a mental model and is practical.

**T02-47. Llama 3 405B's published layouts: 8,192 GPUs as TP 8 x CP 1 x PP 16 x DP 64 at 8,192 tokens (430 TFLOPs/GPU, 43% BF16 MFU); 16,384 GPUs as TP 8 x CP 1 x PP 16 x DP 128 at 8,192 tokens (400, 41%); 16,384 GPUs as TP 8 x CP 16 x PP 16 x DP 8 at 131,072 tokens (380, 38%); always 16M tokens per batch. Meta attributes the 43% to 41% drop to the smaller batch per DP group needed to hold global tokens constant.**
- Location: 2407.21783v3, Table 4 and Sec 3.3.2 "GPU utilization".
- Verdict: CORRECT (the commonly quoted 38-43% MFU)
- Evidence: https://arxiv.org/abs/2407.21783v3 | Tier 3, preprint, first-party lab | production report | Table 4 columns "GPUs TP CP PP DP Seq. Len. Batch size/DP Tokens/Batch TFLOPs/GPU BF16 MFU" with rows "8,192 8 1 16 64 8,192 32 16M 430 43%"; "16,384 8 1 16 128 8,192 16 16M 400 41%"; "16,384 8 16 16 8 131,072 16 16M 380 38%". "we achieve an overall BF16 Model FLOPs Utilization (MFU; Chowdhery et al. (2023)) of 38-43% for the configurations shown in Table 4. The slight drop in MFU to 41% on 16K GPUs with DP=128 compared to 43% on 8K GPUs with DP=64 is due to the lower batch size per DP group needed to keep the global tokens per batch constant during training." Sec 3.3.1: "Llama 3 405B is trained on up to 16K H100 GPUs, each running at 700W TDP with 80GB HBM3, using Meta's Grand Teton AI server platform ... Each server is equipped with eight GPUs and two CPUs. Within a server, the eight GPUs are connected via NVLink." (accessed 2026-10-30; table rows reconstructed from pdftotext column order)
- Use in dive: the GPU (H100, 80 GB HBM3, 700 W, 8 per server on NVLink) matches p5.48xlarge's (T02-68), unlike TorchTitan's 96 GB parts (T02-50), so these are the most transferable published layouts for p5; the network differs (Meta RoCE, not EFA). [derived] each row multiplies out exactly: 8 x 1 x 16 x 64 = 8,192; 8 x 1 x 16 x 128 = 16,384; 8 x 16 x 16 x 8 = 16,384; 64 x 32 x 8,192 = 16.8M tokens. Global batch caps DP: at 16M tokens and 8K sequence there are 2,048 sequences, so DP x sequences-per-DP-rank cannot exceed 2,048. Practical to know.

**T02-48. Llama 3 ran FP32 gradient accumulation across micro-batches and FP32 reduce-scatter of gradients across FSDP ranks for convergence, and built an internal memory-consumption estimator and performance-projection tool to choose its parallelism; neither tool is published.**
- Location: 2407.21783v3, Sec 3.3.2 "Network-aware parallelism configuration" and "Numerical stability".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2407.21783v3 | Tier 3, preprint, first-party lab | production report | "Identifying the optimal parallelism configuration with minimal communication overhead while avoiding GPU memory overflow is challenging. We develop a memory consumption estimator and a performance-projection tool which helped us explore various parallelism configurations and project overall training performance and identify memory gaps effectively." "we use FP32 gradient accumulation during backward computation over multiple micro-batches and also reduce-scatter gradients in FP32 across data parallel workers in FSDP." (accessed 2026-10-30; "not published" means no release was located during this research)
- Use in dive: FP32 reduce-scatter doubles the DP gradient bytes against BF16 (T02-4); the calculator should take the reduction dtype as an input. Practical to know.

**T02-49. TorchTitan's guidance: FSDP alone is often enough as the first dimension up to about 512 GPUs when communication is faster than compute; beyond that, collective latency grows with world size, so add TP (usually capped at 8, inside NVLink) and then PP; CP goes in the DeviceMesh dimension just outside TP.**
- Location: 2410.06511v3, Sec 3.3.1 to 3.3.4.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2410.06511v3 | Tier 3, preprint | guidance | "FSDP (ZeRO) is a general technique applicable to any model architecture and is often sufficient as the first degree of parallelism when communication is faster than computation (e.g., up to 512 GPUs). However, with larger scales, collective latency increases linearly with the world size, limiting efficiency. To overcome this, model parallelism like TP and PP can be combined with FSDP." "TP introduces blocking collectives and is typically limited to intra-node scaling (e.g., NVLink), with degrees usually capped at 8. Scaling beyond 4192 GPUs requires combining TP with PP." "Pipeline Parallelism (PP) reduces communication bandwidth requirements by transmitting only activations and gradients between stages in a peer-to-peer manner." "we can combine CP with 3D paralleism, where TP usually keeps the innner-most DeviceMesh dimension, and CP applies in the next outer DeviceMesh dimension." (accessed 2026-10-30)
- Use in dive: a second, independent statement of the nesting order (agrees with T02-46), and a scale threshold for adding TP. Practical to know.

**T02-50. TorchTitan's published Llama 3.1 runs on H100 (Grand Teton hosts: 96 GB HBM2e, 500 W, 400 Gb/s RDMA per GPU): 8B on 8 GPUs with FSDP 8, local batch 2, selective activation checkpointing, 76.8 to 82.4 GiB peak; 8B on 128 GPUs with FSDP 128, 61.8 to 67.0 GiB; 70B on 256 GPUs with FSDP 32 x TP 8, local batch 16, full activation checkpointing, Float8, 67.6 to 71.9 GiB; 405B on 512 GPUs with FSDP 8 x TP 8 x PP 8, where interleaved 1F1B delivered 128 tokens/s/GPU against 100 for 1F1B (28% [derived]).**
- Location: torchtitan v0.4.0, `docs/benchmarks/llama3_h100_202412_torchtitan.md` (Hardware, Tables 1 to 5); paper 2410.06511v3 Sec 3.2, Tables 1 to 4.
- Verdict: NEW (the paper and the repository document disagree on several numbers, C02-3)
- Evidence: https://github.com/pytorch/torchtitan/blob/45e33cd413b64cb37a7840cfd3c9765d3c639ae1/docs/benchmarks/llama3_h100_202412_torchtitan.md | Tier 1, official framework documentation at a pinned SHA | benchmark claim (author reported) | "Each H100 GPU is equipped with 96GB HBM2e with 2.4 TB/sec peak memory bandwidth." "Hosts are inter-connected with backend RDMA network with 400 Gb/s per GPU." "We used the default 500W power limit". "Table 1 1D Parallelism (FSDP). Llama 3.1 8B model. 8 GPUs. Local batch size 2, global batch size 16. Selective activation checkpointing." rows "FSDP | 5,762 | 82.4", "FSDP + torch.compile + Float8 | 8,532 | 76.8". "Table 4 2D parallelism (FSDP + TP) + torch.compile + Float8. Llama 3.1 70B model. 256 GPUs (FSDP 32, TP 8). Local batch size 16, global batch size 512. Full activation checkpointing." rows "2D | 829 | 71.9", "2D + AsyncTP | 876 | 67.6". "Table 5 ... Llama 3.1 405B model. 512 GPUs (FSDP 8, TP 8, PP8). Local batch size 32, global batch size 256." rows "1F1B | 100 | 82.5", "Interleaved 1F1B | 128 | 72.7". "We note that the 1D Llama 3.1 8B model training on 8 or 128 H100 GPUs without Float8 achieves 33% to 39% MFU" (accessed 2026-10-30)
- Use in dive: the closest published analogue to both worked examples, with the caveat that these H100s have 96 GB, not p5's 80 GB (T02-68, T02-69). The 70B layout's 67.6 to 71.9 GiB peak sits close to an 80 GB card's capacity, so the worked example in section 3 does not assume it transfers unchanged [our reading]. Local batch 16 on the 70B run is per TP group of 8 GPUs, given global 512 = 32 FSDP ranks x 16 [derived]. Practical to know.

**T02-51. Megatron-Core's default rank order is "tp-cp-ep-dp-pp" (tensor parallel ranks adjacent, pipeline outermost), and its docstring tells callers to make adjacent ranks share a node; the same docstring still states the default as "tp-dp-pp".**
- Location: Megatron-LM core_v0.20.0, `megatron/core/parallel_state.py` line 641 (signature), lines 773 to 775 and 813 to 816 (docstring).
- Verdict: NEW (doc-code drift inside one file, C02-4)
- Evidence: https://github.com/NVIDIA/Megatron-LM/blob/685fb8bd970185e9ac3283fe32a5d6667bf4b268/megatron/core/parallel_state.py#L641 | Tier 1, code | code behaviour | signature: "order: str = "tp-cp-ep-dp-pp","; docstring: "order (str, default=tp-dp-pp): The rank initialization order of parallelism. Now we support tp-dp-pp and tp-pp-dp orders." and "Note that for efficiency, the caller should make sure adjacent ranks are on the same DGX box. For example if we are using 2 DGX-1 boxes with a total of 16 GPUs, rank 0 to 7 belong to the first box and ranks 8 to 15 belong to the second box." (accessed 2026-10-30)
- Use in dive: the same innermost-is-fastest rule as Llama 3 (T02-46) expressed as code; on AWS, consecutive ranks on one instance is the launcher's job. Practical to know.
- Link: `deep-dives/efa/src/sections/TopologyApi.tsx` (rank ordering and Slurm topology plugins).

### H. Published sizing procedures and tools, and what each prescribes

**T02-52. Megatron-Core's parallelism guide prescribes a four-step "start simple" order (DP only; add TP if the model does not fit; add PP for very large models; add CP for long sequences), always-on sequence parallelism with TP, and a distributed optimizer "for all multi-GPU training". Its recommended table lists Llama 3 8B on 8 GPUs as TP 1, PP 1, CP 2 and Llama 3 70B on 64 GPUs as TP 4, PP 4, CP 2 (DP 2, micro-batch 1, global batch 512, 8,192 tokens).**
- Location: Megatron-LM core_v0.20.0, `docs/user-guide/parallelism-guide.md` lines 151 to 158, 182 to 197, 211 to 252.
- Verdict: NEW
- Evidence: https://github.com/NVIDIA/Megatron-LM/blob/685fb8bd970185e9ac3283fe32a5d6667bf4b268/docs/user-guide/parallelism-guide.md | Tier 1, official framework documentation at a pinned SHA | guidance | "| **LLaMA-3** | 8B | 8 | 1 | 1 | 2 | 1 | CP=2 for long context (8K seqlen) |" "| **LLaMA-3** | 70B | 64 | 4 | 4 | 2 | 1 | Balanced TP+PP for 70B scale |" "# TP=4, PP=4, CP=2, DP=2 => 4 × 4 × 2 × 2 = 64 GPUs" with "--micro-batch-size 1 \ --global-batch-size 512". "### Start Simple 1. Begin with **Data Parallelism** (DP) only. 2. Add **Tensor Parallelism** (TP) if the model does not fit. 3. Add **Pipeline Parallelism** (PP) for very large models. 4. Add **Context Parallelism** (CP) for long sequences." "### Communication Bottlenecks - Reduce **TP** degree (increases memory per GPU). - Increase **PP** degree (may reduce efficiency). - Use **CP** instead of larger TP for long sequences." "Recommended for all multi-GPU training: --use-distributed-optimizer". "Always enable when using TP: --sequence-parallel" (accessed 2026-10-30)
- Use in dive: a vendor-published starting layout for both reference models; the 70B row is the nearest NVIDIA-documented neighbour of worked example 1. Practical to know.

**T02-53. Megatron-Core's MoE guide gives a memory-first procedure: step 1 finds the feasible mappings under GPU memory using a table of how each strategy divides activation, weight and optimizer memory, then selects among them by communication. Per the table: TP divides all three by N (activations only with SP on); PP divides weights and optimizer state but not peak activations ("1, >1 with virtual pipeline"); CP divides activations and, with the distributed optimizer, optimizer state, but not weights; DP divides only optimizer state, and only with the distributed optimizer. It suggests emulating a large job on one GPU to test memory.**
- Location: Megatron-LM core_v0.20.0, `megatron/core/transformer/moe/README.md` lines 148 to 168.
- Verdict: NEW
- Evidence: https://github.com/NVIDIA/Megatron-LM/blob/685fb8bd970185e9ac3283fe32a5d6667bf4b268/megatron/core/transformer/moe/README.md | Tier 1, official framework documentation at a pinned SHA | guidance | "### Step 1: Find the feasible parallel mapping under the memory capacity of the GPU ... The consumption of memory consists of three parts: - Activation memory - Weight and gradient memory - Optimizer states memory". Table rows: "| TP | 1/N (with SP on) | 1/N | 1/N | High |"; "| EP | ~1 (varies with EP balancing) | 1/N in MoELayer| 1/N | Medium |"; "| PP | 1 (>1 with virtual pipeline) | 1/N | 1/N | Medium |"; "| CP | 1/N | 1 | 1/N (with distributed optimizer) | Medium |"; "| DP | 1 | 1 | 1/N (with distributed optimizer) | Low |". "We provide the argument of `--fake-init-process-group` to emulate distributed training on one GPU." (accessed 2026-10-30)
- Use in dive: the clearest one-table summary of what each degree divides, from a Tier 1 source; it matches T02-19 (PP leaves peak activations at about L layers' worth on stage 1). The flag name in the README does not match the code (C02-5). Builds a mental model and is practical.

**T02-54. NeMo's Auto Configurator (NeMo 2.x) generates a grid of TP, PP, CP, EP, micro-batch size and activation-checkpointing candidates from model-size and sequence-length heuristics, filters them by divisibility (global batch by micro-batch x GPUs / model-parallel size, attention heads by TP, layers by PP) and a min/max model-parallel size, then runs short jobs and ranks measured throughput; the README warns some candidates may run out of memory.**
- Location: NeMo v2.7.3, `examples/llm/auto_configurator/README.md`; `nemo/collections/llm/tools/auto_configurator/core/training_config.py` lines 72 to 95 (filter) and 225 to 400 (heuristics).
- Verdict: NEW
- Evidence: https://github.com/NVIDIA/NeMo/blob/1d4ee423806d461f9146ae982f9da8eb32495ae7/examples/llm/auto_configurator/README.md | Tier 1, official framework documentation at a pinned SHA | documentation of support | "After Auto Configurator generates the base configuration, it searches over four critical hyperparameters that have a great impact on training throughput but do not affect model convergence. These hyperparameters include Tensor Parallelism (TP), Pipeline Parallelism (PP), Context Parallelism (CP), Expert Parallelism (EP), Micro Batch Size (MBS), and Activation Checkpointing Layers (ActCkpt)." "Some of the candidate configurations may not work due to high-memory usage or other issues." "This is an early version of the Auto Configurator". Code: https://github.com/NVIDIA/NeMo/blob/1d4ee423806d461f9146ae982f9da8eb32495ae7/nemo/collections/llm/tools/auto_configurator/core/training_config.py#L80-L95 "mod_gbs = params.gbs % (mbs * num_gpus / model_parallelism) mod_att_heads = att_heads % tp mod_layers = (multiplier * num_layers) % pp" (accessed 2026-10-30)
- Use in dive: the measure-don't-model approach (heuristic grid plus short runs). The README says "four critical hyperparameters" and then lists six (C02-6). Practical to know.

**T02-55. For 80 GB GPUs at 8,192 tokens, NeMo's heuristics start a model of 8 to 13B parameters at TP 2 or 4, PP 1 or 2, micro-batch 1 or 2, global batch 256, and a 23 to 45B model at TP 8, PP 4 to 8; the 8,192-token table stops at 45B. Llama 3.1 8B (8.03B parameters, T02-67) falls in the 8 to 13B bucket by its size test. The auto-configurator files are absent from the NeMo v3.0.0 tree.**
- Location: NeMo v2.7.3, `training_config.py` lines 364 to 398; NeMo v3.0.0 (fd6a877539710e2b98f28c43272ff81312f83417) file listing.
- Verdict: NEW
- Evidence: https://github.com/NVIDIA/NeMo/blob/1d4ee423806d461f9146ae982f9da8eb32495ae7/nemo/collections/llm/tools/auto_configurator/core/training_config.py#L364-L398 | Tier 1, code | code behaviour | "elif seq_length == 8192: ... elif model_size_in_b <= 8.0: self.tp = [2, 4] self.pp = [x for x in self.valid_pp if 1 <= x <= 2] self.mbs = [1, 2] self.gbs = 256 elif model_size_in_b <= 13.0: self.tp = [2, 4] self.pp = [x for x in self.valid_pp if 1 <= x <= 2] self.mbs = [1, 2] self.gbs = 256 ... elif model_size_in_b <= 45.0: self.tp = [8] self.pp = [x for x in self.valid_pp if 4 <= x <= 8] self.mbs = [1] self.min_model_parallel = 32 self.max_model_parallel = 64 self.gbs = 256". A `git ls-tree` of NeMo v3.0.0 returned no path containing "auto_conf". (accessed 2026-10-30; the 8.03B figure is [derived] in T02-67)
- Use in dive: NeMo's heuristic starts the 8B model with TP, while TorchTitan (T02-50) and Megatron's own guide (T02-52) start it with sharded DP or CP and no TP: published tools disagree on the 8B starting point, which is why the procedure ends with a measured sweep. Where the auto-configurator lives after NeMo 3.0 is for area 03 (U02-4).

**T02-56. DeepSpeed's Autotuner tunes only ZeRO stage, micro-batch size per GPU and other ZeRO settings, not TP or PP (model parallelism is an input, `mp_size`); it profiles the model's parameters and activation memory, walks ZeRO stages 0 to 3 estimating the minimum memory per GPU for each, and stops when a higher stage stops improving the metric. Offload is not tuned.**
- Location: DeepSpeed v0.19.9, `deepspeed/autotuning/README.md` lines 79 to 97 and 317 to 319.
- Verdict: NEW
- Evidence: https://github.com/deepspeedai/DeepSpeed/blob/8d4f29c75f4a4b30d4db00a94b4aebfdff5107f3/deepspeed/autotuning/README.md | Tier 1, official framework documentation at a pinned SHA | documentation of support | "Currently, the DeepSpeed Autotuner tunes ZeRO stages, micro-batch size per GPU, and ZeRO configurations (offloading is not yet supported) on top of other configurations such as optimizer, scheduler, fp16 defined by the user in the DeepSpeed configuration file." "the Autotuner explores ZeRO stages in the order of `[0, 1, 2, 3]`. For each ZeRO stage, the Autotuner estimates the minimal memory required per GPU to train the model, and compares it with the available GPU memory." "The exploration of different ZeRO stages would stop if the optimal setup for the current ZeRO stage is no better than that of the previous ZeRO stage tuned". "If model parallelism is used, set the `mp_size` in the autotuning configuration to be the model parallelism degree. `mp_size` defaults to 1 which means no model parallelism is used." (accessed 2026-10-30)
- Use in dive: DeepSpeed's tool encodes the "lowest ZeRO stage that fits" rule (T02-7) but leaves the model-parallel layout to the user. Practical to know.

**T02-57. The Hugging Face Ultra-Scale Playbook's three-step procedure: (1) fit one model instance in memory (under 10B: one technique across 8 GPUs, such as TP or ZeRO-3 with full recompute; 10 to 100B: TP 8 with PP, TP 8 with ZeRO-3, or ZeRO-3 alone; at 512+ GPUs pure ZeRO-3 becomes inefficient; at 1024+ GPUs TP 8 with ZeRO-2 and PP; CP across nodes for long sequences; EP across nodes for MoE); (2) reach the target global batch with DP, gradient accumulation or CP; (3) optimise throughput by raising TP toward the node size, then ZeRO-3 DP, then PP when DP communication bottlenecks, and sweep micro-batch size.**
- Location: Hugging Face Ultra-Scale Playbook (nanotron Space at revision c93890dd4b22356ee18ed9b863e6f2d0909729bc), section "Finding the Best Training Configuration".
- Verdict: NEW
- Evidence: https://huggingface.co/spaces/nanotron/ultrascale-playbook/tree/c93890dd4b22356ee18ed9b863e6f2d0909729bc (content served from https://nanotron-ultrascale-playbook.static.hf.space/index.html) | Tier 3, third-party technical analysis (Hugging Face, not a framework doc) | guidance | "For models under 10B parameters, you can use a single parallelism technique, e.g. tensor parallelism or ZeRO-3/DP with full recompute across 8 GPUs. For models between 10B-100B parameters requiring more than 8 GPUs, you have several options: Combining tensor parallelism (TP=8) with pipeline parallelism Combining tensor parallelism (TP=8) with data parallelism (ZeRO-3) Using only ZeRO-3 (i.e., pure data parallelism) At 512+ GPU scale, pure data parallelism/ZeRO-3 will start to becomes inefficient due to communication cost - it can be better to then combine DP with either tensor or pipeline parallelism. At 1024+ GPU scale, a recommended setup may be tensor parallelism (TP=8) with data parallelism (ZeRO-2) and pipeline parallelism." "Scale up tensor parallelism (using the fast intra-node bandwidth) until we reach a degree close to the node size, so that we can reduce other forms of parallelism. Increase data parallelism with ZeRO-3 while keeping the target batch size. When data parallelism communication starts to become a bottleneck, transition to using pipeline parallelism." (accessed 2026-10-30)
- Use in dive: the most complete published step-by-step procedure; the dive's procedure in section 3 follows its three-step shape and cites the Tier 1 sources for each step. Practical to know.

**T02-58. The Playbook's benchmark sweep (several thousand configurations on 1 to 64 nodes of 8 H100, 4,096-token sequences, 1M-token global batch) found efficiency falls as node count rises, especially for small models capped by the global batch, and that which of TP or PP wins flipped as the authors optimised each implementation.**
- Location: Ultra-Scale Playbook, "Benchmarking thousands of configurations".
- Verdict: NEW
- Evidence: https://huggingface.co/spaces/nanotron/ultrascale-playbook/tree/c93890dd4b22356ee18ed9b863e6f2d0909729bc | Tier 3, third-party technical analysis | benchmark claim (author reported) | "We actually ran benchmarks ourselves on several thousand distributed configurations ... (namely, 1-64 nodes of 8xH100s)". "All the following benchmarks were conducted with a sequence length of 4,096 and a global batch size of 1M tokens." "as we increase the number of nodes (higher parallelism), we observe a decrease in efficiency. This effect is particularly pronounced for smaller models ... we're constrained by our global batch size limit of 1M." "When we first implemented both parallelism strategies, tensor parallelism outperformed pipeline parallelism. After optimizing our PP code, it became the faster option." (accessed 2026-10-30)
- Use in dive: the honest closing caveat of any sizing procedure: the formulas pick candidates, and the implementation decides the winner. Practical to know.

**T02-59. TorchTitan v0.4.0's verified Llama 3 recipes set the 70B model to TP 8 with full activation recomputation and 8 sequences per micro-batch per data-parallel rank, and leave the 8B model on default parallelism (FSDP across all ranks) with the default activation policy.**
- Location: torchtitan v0.4.0, `torchtitan_recipes/models/llama3.py` lines 39 to 110.
- Verdict: NEW
- Evidence: https://github.com/pytorch/torchtitan/blob/45e33cd413b64cb37a7840cfd3c9765d3c639ae1/torchtitan_recipes/models/llama3.py#L39-L110 | Tier 1, code | default value | "def llama3_8b(seq_len: int | None = None) -> Trainer.Config: parallelism = ParallelismConfig()" ... "activation_remat=DefaultActivationRematConfig()"; "def llama3_70b(seq_len: int | None = None) -> Trainer.Config: parallelism = ParallelismConfig(tensor_parallel_degree=8)" ... "num_tokens_per_microbatch_per_dp_rank = 8 * model_config.max_context_length" ... "activation_remat=FullActivationRematConfig()" (accessed 2026-10-30)
- Use in dive: code-level confirmation of T02-50's layouts. That `ParallelismConfig()` defaults to FSDP over all ranks is [our reading] from T02-49 and the paper; the config class was not read (U02-5). Practical to know.

### I. What a collective costs, and which link carries it

**T02-60. For an all-reduce of S bytes over n ranks, each with outgoing bandwidth B, the best possible time is t = (S/B) x 2(n-1)/n, independent of ring or tree, because each element needs n-1 additions and n assignments; nccl-tests reports bus bandwidth busbw = algbw x 2(n-1)/n so the figure can be compared to the hardware link.**
- Location: NVIDIA/nccl-tests v2.21.1, `doc/PERFORMANCE.md` lines 33 to 63.
- Verdict: CORRECT (the 2(n-1)/n factor)
- Evidence: https://github.com/NVIDIA/nccl-tests/blob/afd59abab774a6a4b492eb344bd0c845a0b7bb4d/doc/PERFORMANCE.md#L33-L63 | Tier 1, official tool documentation at a pinned SHA | formula | "**Note : this is independent of the algorithm used (ring, tree, or other) as long as they use point-to-point operations (send/receive).**" "In all cases, we need n-1 additions and n assignments for each element. Since every step is on a different rank except potentially one (the last input and the first output), we need 2(n-1) data transfers (x number of elements) to perform an allReduce operation. Considering that each rank has a bandwidth to the outside world of _B_, the time to perform an allReduce operation of _S_ elements is at best : `t = (S*2*(n-1)) / (n*B)`" "`B = S/t * (2*(n-1)/n) = algbw * (2*(n-1)/n)`" (accessed 2026-10-30)
- Use in dive: the one formula every row of the communication table reduces to. Builds a mental model and feeds the calculator.
- Link: `deep-dives/efa/src/sections/AIMLTraining.tsx` (DP row uses the same 2 x size x (N-1)/N).

**T02-61. Reduce-scatter and all-gather each cost (n-1)/n of the full array S per rank (S being the total, recvcount or sendcount x n), all-to-all also (n-1)/n, broadcast and reduce 1; bus bandwidth should reflect the bottleneck link (NVLink, PCI, QPI or network).**
- Location: NVIDIA/nccl-tests v2.21.1, `doc/PERFORMANCE.md` lines 65 to 145.
- Verdict: NEW
- Evidence: https://github.com/NVIDIA/nccl-tests/blob/afd59abab774a6a4b492eb344bd0c845a0b7bb4d/doc/PERFORMANCE.md#L65-L145 | Tier 1, official tool documentation at a pinned SHA | formula | "The perfect reduceScatter time with a rank bandwidth of B would therefore be : `t = S*(n-1) / (B*n)`" "Note that here, S is the size in bytes of the total array, which for NCCL is equal to `recvcount*sizeof(datatype)*n`". "* AllReduce : 2*(_n_-1)/_n_ * ReduceScatter : (_n_-1)/_n_ * AllGather : (_n_-1)/_n_ * Broadcast : 1 * Reduce : 1 * AlltoAll: (_n_-1)/_n_" "The bus bandwidth should reflect the speed of the hardware bottleneck : NVLink, PCI, QPI, or network." (accessed 2026-10-30)
- Use in dive: converts ZeRO's Psi units (T02-7) and FSDP's per-unit all-gathers into seconds. Practical to know: read busbw from nccl-tests against the link you expect the collective to use.

**T02-62. Ring all-reduce reaches full bandwidth but its latency grows linearly with the number of GPUs; NCCL 2.4 added double binary trees with full bandwidth and logarithmic latency (up to 180x lower latency than ring at 24,576 GPUs on Summit), and NCCL switches back to rings where rings give more bandwidth.**
- Location: NVIDIA Technical Blog, "Massively Scale Your Deep Learning Training with NCCL 2.4", body paragraphs.
- Verdict: NEW
- Evidence: https://developer.nvidia.com/blog/massively-scale-deep-learning-training-nccl-2-4/ | Tier 2, first-party vendor blog | benchmark claim (vendor reported) plus definition | "Allreduce operations, used to sum gradients over multiple GPUs, have usually been implemented using rings [1] [2] to achieve full bandwidth. The downside of rings is that latency scales linearly with the number of GPUs, preventing scaling above hundreds of GPUs." "NCCL 2.4 now adds double binary trees, which offer full bandwidth and a logarithmic latency even lower than 2D ring latency." "The difference from ring increases with the scale, with up to 180x improvement at 24k GPUs." "NCCL automatically switches back to rings when that pattern results in greater bandwidth." (accessed 2026-10-30)
- Use in dive: ring versus tree is a latency choice, not a bytes choice (T02-60); for the large DP all-reduce the bytes term dominates, for small TP messages the latency term matters [our reading]. Builds a mental model.
- Link: `deep-dives/efa/src/sections/NcclOverEfa.tsx` (algorithm and tuner selection over EFA).

**T02-63. Llama 3's outer dimensions, PP and DP, cross a multi-hop network with latency up to tens of microseconds; Meta forked NCCL (NCCLX) and tuned chunking and data transfer for that latency, and gave small control messages higher priority.**
- Location: 2407.21783v3, Sec 3.3.3 "Collective Communication".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2407.21783v3 | Tier 3, preprint, first-party lab | production report | "Recall that the order of parallelism dimensions is [TP, CP, PP, DP], where DP corresponds to FSDP. The outermost parallelism dimensions, PP and DP, may communicate through a multi-hop network, with latency up to tens of microseconds. The original NCCL collectives - all-gather and reduce-scatter in FSDP, and point-to-point in PP - require data chunking and staged data copy." "we address a subset of these inefficiencies by tuning chunking and data transfer to fit our network latencies, which can be as high as tens of microseconds for a large cluster. We also allow small control messages to traverse our network at a higher priority" (accessed 2026-10-30)
- Use in dive: which collectives leave the server in a well-ordered layout: FSDP all-gather and reduce-scatter, PP send and receive. Builds a mental model.

**T02-64. Which link each parallelism uses on a well-ordered layout [our reading, assembled from T02-14, T02-25, T02-42, T02-46, T02-49, T02-51]: TP and SP (all-reduce, or all-gather plus reduce-scatter, every layer, every micro-batch) on NVLink inside the instance; CP (K/V all-gather or ring send/receive per attention layer) on NVLink when CP x TP <= 8, otherwise over EFA; EP (all-to-all per MoE layer) on NVLink when EP x ETP <= 8, otherwise hierarchical over EFA then NVLink; PP (send and receive of bsh/t per micro-batch per boundary) over EFA; DP or FSDP (gradient reduce-scatter and parameter all-gather per step or per unit) over EFA, or inside the instance for the sharding group under HSDP.**
- Location: synthesis; no single source states the full mapping.
- Verdict: NEW [our reading]
- Evidence: entries listed | Tier 1 and Tier 3 inputs | synthesis | (accessed 2026-10-30)
- Use in dive: the central diagram of the parallelism section (dimensions as rings nested from NVLink outward to EFA). Builds a mental model.
- Link: `deep-dives/efa/src/sections/AIMLTraining.tsx` and `deep-dives/silicon-memory-inference/src/sections/CommunicationAndScaleOut.tsx`.

### J. Inputs for the worked examples: model shapes, instance and accelerator figures

**T02-65. On Trainium, AWS put the NeuronX Distributed Training (NxDT) and NxD Core training APIs in maintenance mode from Neuron 2.30.0 and recommends native PyTorch distributed primitives (DTensor, FSDP, DDP) and TorchTitan from Neuron 2.31 with PyTorch 2.12; native PyTorch on Neuron is described as a private beta in that announcement.**
- Location: AWS Neuron documentation v2.33.0, announcement "NxDT and NxD Core Training APIs are now in maintenance mode starting with Neuron 2.30".
- Verdict: NEW
- Evidence: https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/about-neuron/announcements/neuron2.x/announce-maintenance-nxdt-nxd-core-training.html | Tier 1, first-party AWS documentation | documentation of support | "Starting with Neuron Release 2.30.0 , NxDT and NxD Core Training APIs are in maintenance mode. Future releases will address critical security issues only and we will gradually end support." "Customers are recommended to use native PyTorch with standard distributed primitives (DTensor, FSDP, DDP) and TorchTitan starting with Neuron 2.31 and PyTorch 2.12." "Native PyTorch on Neuron is currently available as a Private Beta." (accessed 2026-10-30)
- Use in dive: on Trainium the parallelism vocabulary of this file applies through FSDP, DTensor and TorchTitan; which degrees TorchTitan Neuron supports on Trn2 is area 03's question (U02-6). Practical to know.
- Link: `deep-dives/silicon-memory-inference/src/sections/AwsCompilersAndTooling.tsx` (Neuron 2.33, TorchNeuron); `deep-dives/efa/src/sections/AIMLTraining.tsx` (Trainium multi-node instances).

**T02-66. Llama 3's batch schedule for 405B: 4M tokens at 4,096-token sequences, doubled to 8M tokens at 8,192 tokens after 252M tokens, doubled again to 16M after 2.87T tokens.**
- Location: 2407.21783v3, Sec 3.4.1 "Initial Pre-Training".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2407.21783v3 | Tier 3, preprint, first-party lab | production report | "we use an initial batch size of 4M tokens and sequences of length 4,096, and double these values to a batch size of 8M sequences of 8,192 tokens after pre-training 252M tokens. We double the batch size again to 16M after pre-training on 2.87T tokens." (accessed 2026-10-30)
- Use in dive: the global batch is a training-recipe input that caps DP (T02-47); the worked examples use 4M tokens (512 sequences of 8,192) for 70B as a stated assumption, since no 70B-specific batch is published in the paper text read here [our reading]. Practical to know.

**T02-67. Llama 3 8B: 32 layers, model dimension 4,096, FFN dimension 14,336, 32 attention heads, 8 key/value heads; 70B: 80 layers, 8,192, 28,672, 64 heads, 8 KV heads; 405B: 126 layers, 16,384, 53,248, 128 heads, 8 KV heads; all SwiGLU, vocabulary 128,000, RoPE.**
- Location: 2407.21783v3, Table 3 "Overview of the key hyperparameters of Llama 3".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2407.21783v3 | Tier 3, preprint, first-party lab | definition | Table 3 rows (8B, 70B, 405B): "Layers 32 80 126"; "Model Dimension 4,096 8192 16,384"; "FFN Dimension 14,336 28,672 53,248"; "Attention Heads 32 64 128"; "Key/Value Heads 8 8 8"; "Activation Function SwiGLU"; "Vocabulary Size 128,000"; "Positional Embeddings RoPE (θ = 500, 000)" (accessed 2026-10-30; table reconstructed from pdftotext column order). The Llama 3.1 `config.json` on Hugging Face was not read (gated repository; U02-3).
- Use in dive: [derived] parameter counts, with head dimension h/heads = 128 and untied input and output embeddings (an assumption, U02-3): per layer, attention = h x h (Q) + 2 x h x (8 x 128) (K, V) + h x h (O); MLP = 3 x h x FFN. 8B: attention 2 x 4,096^2 + 2 x 4,096 x 1,024 = 41,943,040; MLP 3 x 4,096 x 14,336 = 176,160,768; per layer 218,103,808; x 32 = 6.979B; embeddings 2 x 128,000 x 4,096 = 1.049B; total about 8.03B. 70B: attention 2 x 8,192^2 + 2 x 8,192 x 1,024 = 150,994,944; MLP 3 x 8,192 x 28,672 = 704,643,072; per layer 855,638,016; x 80 = 68.451B; embeddings 2 x 128,000 x 8,192 = 2.097B; total about 70.55B. Norm weights are negligible. The vocabulary in the released checkpoint may be padded above 128,000; a padding of a few hundred tokens would move either total by under 0.1% [our reading; config not read]. Feeds every number in section 3.

**T02-68. AWS documents p5.48xlarge as 8 NVIDIA H100 GPUs with 640 GiB of accelerator memory (8 x 80 GiB), 3,200 Gigabit network bandwidth with EFA, 192 vCPUs and 2,048 GiB of memory; the P5 product page lists 640 GB HBM3, 3200 Gbps EFA and "900 GB/s NVSwitch" GPU peer to peer.**
- Location: Amazon EC2 instance types guide, accelerated computing specifications (p5.48xlarge rows); P5 product page, instance table.
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | Tier 1, first-party AWS documentation | definition | performance row "p5.48xlarge | 2048.00 | AMD EPYC 7R13 | 192 | 96 | 2 | 8 x NVIDIA H100 GPU | 640 GiB (8 x 80 GiB)"; network row "p5.48xlarge | 3200 Gigabit | ✓ Yes" (EFA column). Also https://aws.amazon.com/ec2/instance-types/p5/ | Tier 1, first-party AWS product page | vendor specification | "p5.48xlarge | 192 | 2 TiB | 8 H100 | 640 GB | HBM3 | 3200 Gbps EFA | Yes | 900 GB/s NVSwitch". "Both instances support up to 900 GB/s of NVSwitch GPU interconnect (total of 3.6 TB/s bisectional bandwidth in each instance), so each GPU can communicate with every other GPU in the same instance with single-hop latency." (accessed 2026-10-30; table cells via HTML-to-text extraction)
- Use in dive: [derived] EFA per GPU = 3,200 Gb/s / 8 = 400 Gb/s = 50 GB/s per GPU per direction, against NVLink 450 GB/s per direction (T02-70): NVLink is 9x the per-GPU EFA bandwidth on p5 [derived, inputs T02-68, T02-70]. The page uses GB where the guide uses GiB (C02-7). Practical to know.
- Link: `deep-dives/efa/src/sections/InstanceSupport.tsx` (EFA bandwidth per instance).

**T02-69. NVIDIA lists H100 SXM with 80 GB of GPU memory at 3.35 TB/s, BF16 Tensor Core at 1,979 teraFLOPS "with sparsity", FP8 at 3,958 teraFLOPS with sparsity, up to 700 W, and NVLink at 900 GB/s.**
- Location: NVIDIA H100 product page, specifications table (H100 SXM column).
- Verdict: NEW
- Evidence: https://www.nvidia.com/en-us/data-center/h100/ | Tier 1, first-party NVIDIA spec sheet | vendor specification | "BFLOAT16 Tensor Core * | 1,979 teraFLOPS"; "FP8 Tensor Core * | 3,958 teraFLOPS"; "GPU Memory | 80GB"; "GPU Memory Bandwidth | 3.35TB/s"; "Max Thermal Design Power (TDP) | Up to 700W (configurable)"; "Interconnect | NVIDIA NVLink™: 900GB/s"; "* With sparsity" (accessed 2026-10-30)
- Use in dive: dense BF16 is [derived] 1,979 / 2 = 989.5 TFLOPS, assuming the sparsity footnote denotes 2:4 structured sparsity doubling the dense rate; the page does not print the dense figure (area 01 owns peak FLOPS; U02-7). Vendor specification, not a measurement.

**T02-70. NVIDIA's NVLink page gives fourth-generation NVLink (Hopper) 900 GB/s per GPU over 18 links, with 8-GPU NVLink domains, and describes the sixth-generation 3 TB/s per-GPU figure in the same table as "bidirectional".**
- Location: NVIDIA NVLink and NVLink Switch page, Specifications table and the sixth-generation paragraph.
- Verdict: NEW
- Evidence: https://www.nvidia.com/en-us/data-center/nvlink/ | Tier 1, first-party NVIDIA product page | vendor specification | "NVLink Bandwidth per GPU | 900 GB/s | 1,800 GB/s | 3,000 GB/s | Maximum Number of Links per GPU | 18 | 18 | 36 | Supported NVIDIA Architectures/Platforms | NVIDIA Hopper™ | NVIDIA Blackwell | NVIDIA Vera Rubin"; "NVLink GPU Domains | 8 | 8 | 72"; "NVLink is a 3 TB/s bidirectional, direct GPU-to-GPU interconnect" (accessed 2026-10-30)
- Use in dive: [our reading] by the page's own convention the per-GPU figure is bidirectional, so H100 has 450 GB/s per direction; the worked examples use 450 GB/s for one-way transfer time. NVIDIA does not state "450" on this page. Practical to know.
- Link: `deep-dives/silicon-memory-inference/src/sections/CommunicationAndScaleOut.tsx`.

**T02-71. DeepSeek-V3: 61 transformer layers, hidden dimension 7,168, 128 attention heads; every FFN except the first three is a MoE layer with 1 shared and 256 routed experts (expert intermediate dimension 2,048), 8 routed experts active per token, each token sent to at most 4 nodes.**
- Location: 2412.19437v2, Sec 4.2 "Hyper-Parameters".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2412.19437v2 | Tier 3, preprint, first-party lab | definition | "We set the number of Transformer layers to 61 and the hidden dimension to 7168. ... In MLA, we set the number of attention heads n_h to 128 and the per-head dimension d_h to 128. ... We substitute all FFNs except for the first three layers with MoE layers. Each MoE layer consists of 1 shared expert and 256 routed experts, where the intermediate hidden dimension of each expert is 2048. Among the routed experts, 8 experts will be activated for each token, and each token will be ensured to be sent to at most 4 nodes." (accessed 2026-10-30)
- Use in dive: inputs for the EP order-of-magnitude in section 3 (58 MoE layers = 61 - 3 [derived]). Builds a mental model.

**T02-72. Megatron-Core's parallelism guide states "Total GPUs = TP × PP × CP × EP × DP". The code does not multiply EP onto the dense grid: the dense grid is TP x PP x CP x DP = world size, and the expert grid is a separate factorisation ETP x EP x EDP x PP = world size, with ETP defaulting to TP.**
- Location: Megatron-LM core_v0.20.0, `docs/user-guide/parallelism-guide.md` lines 174 to 180 (doc); `megatron/training/arguments.py` lines 468 to 497 and `megatron/core/parallel_state.py` lines 946 to 960 (code).
- Verdict: WRONG (doc formula; the code is the authority). True statement: world size = TP x CP x PP x DP for attention and dense layers, and world size = ETP x EP x EDP x PP for expert layers.
- Evidence: https://github.com/NVIDIA/Megatron-LM/blob/685fb8bd970185e9ac3283fe32a5d6667bf4b268/docs/user-guide/parallelism-guide.md#L174-L180 | Tier 1, official framework documentation | definition | "The total number of GPUs is calculated as: ``` Total GPUs = TP × PP × CP × EP × DP ```". Against https://github.com/NVIDIA/Megatron-LM/blob/685fb8bd970185e9ac3283fe32a5d6667bf4b268/megatron/core/parallel_state.py#L946-L960 | Tier 1, code | code behaviour | "if expert_tensor_parallel_size is None: expert_tensor_parallel_size = tensor_model_parallel_size ... expert_tensor_model_pipeline_parallel_size = ( expert_tensor_parallel_size * expert_model_parallel_size * pipeline_model_parallel_size * expert_gtp_remat_size ) expert_data_parallel_size = world_size // expert_tensor_model_pipeline_parallel_size if world_size % expert_tensor_model_pipeline_parallel_size != 0: raise RuntimeError(" (accessed 2026-10-30)
- Use in dive: the guide's own DeepSeek-V3 row (1,024 GPUs, TP 2, PP 16, EP 64) gives 2 x 16 x 64 = 2,048 under its formula before DP, so it cannot hold; under the code it is valid only with `--expert-tensor-parallel-size 1` (1 x 64 x 16 = 1,024, EDP 1) [derived, our reading of the code]. Practical to know: the calculator must model two grids for MoE.

---

## 3. Worked numbers

Conventions for this section. Bytes are decimal (1 GB = 1e9 bytes). "Per GPU" means per rank. Activation figures use T02-18's GPT-layer constant 34 as an approximation for Llama's SwiGLU and GQA layer (the Llama-specific constant belongs to area 01). Attention is assumed to run as a fused flash-style kernel that does not store the s x s score matrix, so the 5as/h term of T02-18 is dropped, which is what selective recomputation achieves [our reading]. Every number not printed in a source is [derived]; inputs carry entry IDs.

### 3.1 Inputs

| Symbol | Value | Source |
|---|---|---|
| Psi (70B) | 70.55e9 parameters | [derived] T02-67 |
| Psi (8B) | 8.03e9 parameters | [derived] T02-67 |
| L, h, heads, KV heads (70B) | 80, 8,192, 64, 8 | T02-67 |
| L, h, heads, KV heads (8B) | 32, 4,096, 32, 8 | T02-67 |
| Vocabulary v | 128,000 | T02-67 |
| Model state | 16 bytes per parameter (2 weights + 2 gradients + 12 optimizer) | T02-5 |
| HBM per GPU | 80 GB (AWS lists 80 GiB) | T02-68, T02-69, C02-7 |
| GPUs per p5.48xlarge | 8 | T02-68 |
| NVLink per GPU per direction | 450 GB/s | [our reading] T02-70 (900 GB/s bidirectional) |
| EFA per GPU per direction | 50 GB/s | [derived] 3,200 Gb/s / 8 / 8 bits, T02-68 |
| BF16 dense peak | 989.5 TFLOPS (vendor specification, halved from the sparse figure) | [derived] T02-69 |
| Working MFU for time estimates | 40% | assumption, inside Llama 3's published 38-43% (T02-47) |
| Effective FLOPS per GPU | 396 TFLOPS | [derived] 0.40 x 989.5 |
| Sequence length s | 8,192 | brief |

### 3.2 Worked example 1: Llama 3.1 70B on 32 p5.48xlarge (256 H100), 8,192 tokens

**Global batch (assumption).** 512 sequences of 8,192 tokens = 4.19M tokens per step, the global batch both NVIDIA's guide (T02-52) and TorchTitan (T02-50) use for 70B. Llama 3 trained 405B at 4M to 16M tokens (T02-66).

**Step 1: does plain DP fit?** Model state = 16 x 70.55e9 = 1,128.8 GB [derived, T02-5, T02-67], 14x one GPU's 80 GB. No.

**Step 2: TP inside the node.** TP = 8: 64 heads and 8 KV heads both divide by 8, so Megatron's checks pass (T02-15); TP stays on NVLink (T02-14, T02-49). With TP 8 and SP, a model-parallel rank holds Psi/8 = 8.82e9 parameters before PP [derived].

**Step 3: smallest PP that fits (T02-43), with the optimizer sharded over DP (T02-6, T02-52 distributed optimizer).** Activations on the first pipeline stage do not shrink with p (T02-19): per layer at micro-batch b = 1, sbh x 34/t = 8,192 x 1 x 8,192 x 34 / 8 = 285 MB; x 80 layers = 22.8 GB [derived, T02-18, T02-19, T02-67].

| Layout (TP x PP x DP) | Params per rank | Weights + grads (4 B/param) | Optimizer (12 B/param / DP) | Activations, stage 1 | Model state + activations |
|---|---|---|---|---|---|
| 8 x 1 x 32, ZeRO-1 | 8.82e9 | 35.3 GB | 3.3 GB | 22.8 GB | 61.4 GB |
| 8 x 2 x 16, ZeRO-1 | 4.41e9 | 17.6 GB | 3.3 GB | 22.8 GB | 43.8 GB |
| 8 x 4 x 8, ZeRO-1 | 2.205e9 | 8.8 GB | 3.3 GB | 22.8 GB (26.2 GB with v = 5, T02-19) | 34.9 GB (38.3 GB) |
| 8 x 1 x 32, FSDP (ZeRO-3) | 8.82e9 | 16 x 8.82e9 / 32 = 4.4 GB (all model state) | included | 22.8 GB | 27.2 GB plus gathered layers |

All values [derived] from the inputs above. The stage-1 embedding adds about 131M parameters per rank (128,000 x 8,192 / 8), under 1 GB [derived]; the last stage adds FP32 logits of 4sbv/t = 4 x 8,192 x 128,000 / 8 = 0.52 GB per micro-batch (T02-19's 4sbv/t term) [derived]. Every row fits under 80 GB on paper. The formulas omit communication buffers, allocator fragmentation and framework workspace, and TorchTitan's measured peak for its TP 8 x FSDP 32 layout was 67.6 to 71.9 GiB on 96 GB parts with local batch 16 and full recomputation (T02-50), well above a formula estimate for that layout [derived: about 39 GB at 16 sequences, 2sbhL/t checkpoints = 21.5 GB plus one layer's working set and logits; sequence length of that run not confirmed, U02-5]. The procedure therefore treats a formula total above about 60 GB of 80 as unproven until a measured step confirms it [our reading; no source states a headroom figure].

**Step 4: communication check per layout.** Time = bytes / per-GPU link bandwidth (T02-60, T02-61), compared with compute.

- Compute per GPU per step: 6 x Psi x tokens / GPUs = 6 x 70.55e9 x 4.19e6 / 256 = 6.93e15 FLOP; at 396 TFLOPS about 17.5 s per step [derived; attention FLOPs excluded, area 01 owns them].
- TP (NVLink): 8bsh(t-1)/t elements per layer per micro-batch (T02-13) = 8 x 67.1e6 x 7/8 = 470e6 elements = 0.94 GB in BF16 per layer per micro-batch; at 450 GB/s, 2.1 ms. Compute per layer per micro-batch per GPU = 6 x 855.6e6 x 8,192 / 8 = 5.26e12 FLOP, 13.3 ms at 396 TFLOPS. TP traffic is about 16% of layer compute if none of it overlaps [derived, T02-13, T02-67, T02-70].
- PP (EFA, layouts with p > 1): bsh/t per micro-batch per boundary per direction with scatter/gather (T02-31) = 67.1e6 / 8 x 2 bytes = 16.8 MB, 0.34 ms at 50 GB/s, against about 266 ms of compute per micro-batch on a 20-layer stage (p = 4). Negligible [derived].
- DP for 8 x 4 x 8 with ZeRO-1 (EFA): reduce-scatter of gradients plus all-gather of updated parameters over the 2.205e9-parameter shard, 2 x 2.205e9 x 2 bytes x 7/8 = 7.7 GB per GPU per step in BF16 (11.6 GB if gradients are reduced in FP32 as Llama 3 did, T02-48); 0.15 to 0.23 s at 50 GB/s against 17.5 s of compute, about 1% before overlap [derived, T02-7, T02-60].
- DP for 8 x 1 x 32 with FSDP (EFA): 3 x 8.82e9 x 2 bytes x 31/32 = 51.3 GB per GPU per gather-and-reduce cycle, 1.03 s at 50 GB/s, about 6% of a 17.5 s step if parameters are gathered once per step; each extra gradient-accumulation micro-step that re-gathers parameters adds the all-gather share again [derived, T02-7, T02-8].

**Step 5: pipeline bubble (8 x 4 x 8).** Micro-batch 1, DP 8: m = 512 / 8 = 64 micro-batches per pipeline, a multiple of p = 4 as the interleaved schedule requires (T02-30). Bubble with 1F1B: (p-1)/m = 3/64 = 4.7% of ideal time (T02-28), about 0.8 s of a 17.5 s step. Interleaved with v = 5 chunks (20 layers per stage, 4 per chunk; 5 divides 20, T02-42): 3/(5 x 64) = 0.94%, at five times the PP traffic, still under 2 ms per micro-batch boundary [derived]. GPipe's ratio over total time, (p-1)/(m+p-1) = 3/67 = 4.5% (T02-27), describes the same idle time.

**Step 6: nesting and placement.** Ranks ordered TP innermost (8 GPUs of one instance), then PP, then DP outermost (T02-46, T02-51). Each instance holds one TP group; PP neighbours and DP peers sit on other instances and talk over EFA (T02-64).

**Result.** Two layouts survive the checks and match a published run: TP 8 x PP 4 x DP 8 with ZeRO-1, micro-batch 1, interleaved v = 5 (bubble about 1%, DP traffic about 1% of step time, stage-1 memory about 38 GB on paper); and TP 8 x FSDP 32 without PP (TorchTitan's published 70B layout on 256 H100, T02-50; no bubble, FSDP traffic about 6% of step time, and the one closest to the 80 GB limit in measurement). NVIDIA's own 70B recommendation for 64 GPUs is TP 4 x PP 4 x CP 2 x DP 2 (T02-52); scaled to 256 GPUs it becomes DP 8 [derived]. Choosing between them is a measured step (T02-58).

### 3.3 Worked example 2: Llama 3.1 8B on one p5.48xlarge (8 H100) and on four (32 H100)

**Global batch (assumption).** 256 sequences of 8,192 tokens = 2.1M tokens, NeMo's heuristic for this size and sequence length (T02-55).

**Model state.** 16 x 8.03e9 = 128.5 GB [derived, T02-5]: plain DDP does not fit on one 80 GB GPU even before activations.

**Activations per sequence (b = 1, no TP).** sbh x 34 = 8,192 x 4,096 x 34 = 1.14 GB per layer, x 32 layers = 36.5 GB; FP32 logits 4sv = 4 x 8,192 x 128,000 = 4.2 GB; with full recomputation the stored checkpoints drop to 2sbhL = 2.1 GB plus one layer's 1.14 GB working set [derived, T02-18, T02-19, T02-67].

| Layout on 8 GPUs | Model state per GPU | + activations (b = 1, flash) | Fits 80 GB on paper |
|---|---|---|---|
| DDP | 128.5 GB | - | no |
| ZeRO-1 over 8 | 4 x 8.03 + 12 x 8.03/8 = 44.2 GB | 84.9 GB | no |
| ZeRO-2 over 8 | 2 x 8.03 + 14 x 8.03/8 = 30.1 GB | 70.8 GB | marginal |
| FSDP (ZeRO-3) over 8 | 16 x 8.03/8 = 16.1 GB | 56.8 GB | yes |
| TP 2 x DP 4, ZeRO-1 (NeMo's starting grid) | 4 x 4.015 + 12 x 4.015/4 = 28.1 GB | 28.1 + (36.5 + 4.2)/2 = 48.5 GB with SP | yes |

All [derived] (T02-6, T02-18, T02-55). TorchTitan's measured FSDP 8 run at local batch 2 with selective recomputation peaked at 76.8 to 82.4 GiB on 96 GB parts (T02-50), which would not fit an 80 GB H100; at micro-batch 1 or with full recomputation it should [our reading].

**One instance (8 GPUs): FSDP 8, micro-batch 1.** FSDP traffic stays on NVLink: 3 x 8.03e9 x 2 bytes x 7/8 = 42.2 GB per GPU per gather-and-reduce cycle, 94 ms at 450 GB/s, against about 1.0 s of compute per sequence per GPU (6 x 8.03e9 x 8,192 = 3.95e14 FLOP at 396 TFLOPS) [derived, T02-7, T02-60, T02-70]. A 256-sequence batch takes 256 / 8 = 32 accumulation steps, about 32 s of compute per step [derived]. No PP, so no bubble.

**Four instances (32 GPUs).** 256 / 32 = 8 sequences per GPU per step, 8 accumulation steps at micro-batch 1 [derived].

- Flat FSDP over 32 GPUs: each gather-and-reduce cycle moves 3 x 8.03e9 x 2 x 31/32 = 46.7 GB per GPU and is bounded by EFA, 0.93 s at 50 GB/s against about 1.0 s of compute per micro-batch; if parameters are re-gathered on each of the 8 micro-steps, up to about 373 GB per GPU per step crosses EFA against about 8 s of compute [derived, T02-7, T02-61, T02-68]. Overlap would have to be near perfect.
- HSDP (shard within each instance, F = 8, replicate across 4; T02-8, T02-9): all-gathers and reduce-scatters stay on NVLink as in the one-instance case; only the all-reduce of each GPU's 1/8 gradient shard crosses EFA, 2 x (8.03e9 / 8) x 2 bytes x 3/4 = 3.0 GB per GPU per step, about 60 ms at 50 GB/s against about 8 s of compute [derived, T02-9, T02-60]. This assumes the cross-instance all-reduce runs once per step rather than once per micro-step [our reading].

**Result.** One instance: FSDP 8 (TorchTitan's 8B layout, T02-50, T02-59) at micro-batch 1, or TP 2 x DP 4 if starting from NeMo's grid (T02-55); NVIDIA's guide lists CP 2 instead (T02-52). Four instances: HSDP with the sharding group equal to one instance, which cuts cross-instance bytes by a factor of about 120 against flat FSDP under these assumptions [derived: 373 / 3.0]. This is the FSDP paper's stated use case (T02-10).

### 3.4 Smaller worked numbers used elsewhere in the dive

- **Ring Attention overlap threshold on H100 (T02-21).** c >= F/B: over NVLink, 989.5e12 / 450e9 = 2.2K tokens per block, s = 6c = 13.2K tokens per device; over EFA at 50 GB/s per GPU, 19.8K tokens per block and 119K per device [derived, T02-21, T02-69, T02-70, T02-68]. T02-21's derivation assumes K and V each have the full hidden size; with 8 KV heads of 64 (70B) the K/V block is 1/8 of that, which lowers the threshold by about 8x [our reading]. Read with T02-24 (Llama 3 accepted an exposed all-gather for the same reason).
- **Llama 3 405B layouts multiply out (T02-47).** 8 x 1 x 16 x 64 = 8,192; 8 x 1 x 16 x 128 = 16,384; 8 x 16 x 16 x 8 = 16,384; 64 DP ranks x 32 sequences x 8,192 tokens = 16.8M tokens [derived].
- **DeepSeek-V3 expert-parallel bytes, order of magnitude (T02-38, T02-39, T02-71).** Per token per MoE layer in forward, dispatch in FP8: 8 experts x 7,168 x 1 byte = 57 KB; combine in BF16: 8 x 7,168 x 2 bytes = 115 KB; together about 172 KB, before node de-duplication. Over InfiniBand, node-limited routing sends at most 4 copies of the dispatch (4 x 7,168 x 1 byte = 29 KB per token per layer). Across 58 MoE layers that is about 10 MB of forward dispatch-plus-combine per token before de-duplication [derived; 58 = 61 - 3 dense layers, T02-71].
- **EFA versus NVLink on p5.** 450 GB/s against 50 GB/s per GPU per direction, 9x [derived, T02-68, T02-70]. DeepSeek's H800 cluster ratio was 3.2x (T02-39). The larger gap on p5 strengthens every "keep it inside the instance" rule in section 4 [our reading].

### 3.5 The "set my ranks" procedure, assembled

Each step names its source; steps marked [our reading] are assembled from several sources and stated by none of them alone. The shape follows the Ultra-Scale Playbook's three steps (T02-57): fit, reach the batch, then optimise.

1. **Gather inputs.** Parameters Psi, layers L, hidden h, attention heads and KV heads, sequence s, target global batch in tokens, GPUs per instance, HBM per GPU, NVLink and EFA bandwidth per GPU (T02-67 to T02-70; T02-66 for the batch).
2. **Check model state against HBM.** 16 x Psi (T02-5). If it fits one GPU with room for activations, DDP is an option; otherwise shard.
3. **Shard model state over data-parallel ranks before adding model parallelism.** ZeRO-1 or the distributed optimizer first (no extra bytes, T02-7; "recommended for all multi-GPU training", T02-52), then ZeRO-2, then FSDP or ZeRO-3 at 1.5x DP bytes (T02-7). Keep the sharding group inside one instance when cross-instance bytes dominate (HSDP, T02-9, T02-10). DeepSpeed's autotuner automates exactly this walk (T02-56). [our reading for the ordering relative to step 4; T02-57 and T02-49 put sharded DP first for under-10B and up-to-512-GPU cases, T02-43 and T02-52 put TP first for larger models]
4. **If sharded DP alone does not fit or its bytes do not overlap, add TP up to the instance size.** TP must divide heads and be a multiple or divisor of KV heads (T02-15); keep TP <= 8 on p5 (T02-14, T02-49); always add SP with TP (T02-16, T02-52).
5. **If it still does not fit, add PP across instances, smallest p that fits.** Layers must divide by p (Megatron-LM core_v0.20.0 `megatron/training/arguments.py` lines 862 to 863, "number of layers of the model must be divisible pipeline model parallel size", read with T02-15; NeMo's filter applies the same test, T02-54); stage-1 activations stay at L layers' worth (T02-19, T02-53), so PP mainly divides weights and optimizer state. Use activation recomputation where needed (T02-18, T02-32).
6. **Add CP for long sequences.** At 8K tokens and above per NVIDIA (T02-25, T02-42); CP divides activations, not weights (T02-26, T02-53); choose ring, all-gather or all-to-all by mask and head layout (T02-20 to T02-25).
7. **For MoE, set EP for the expert grid separately.** EP x ETP inside the NVLink domain where possible, ETP = 1 for fine-grained experts, node-limited or hierarchical dispatch across instances (T02-39, T02-41, T02-42).
8. **Satisfy the divisibility constraints.** World size = TP x CP x PP x DP for the dense grid and ETP x EP x EDP x PP for the expert grid (T02-15, T02-41); global batch divisible by micro-batch x DP (T02-15); interleaved schedules need micro-batches a multiple of p (T02-30) unless the framework lifts it (T02-35).
9. **Check the pipeline bubble.** (p-1)/(v x m) (T02-30, T02-35); raise m through the global batch or v through interleaving; or use Zero Bubble or DualPipe schedules (T02-33, T02-34).
10. **Check communication per link.** Bytes per step per GPU for each dimension (T02-4, T02-7, T02-13, T02-31, T02-22, T02-38), divided by the per-GPU bandwidth of the link it rides (T02-60, T02-61, T02-64), against compute per step. [our reading]
11. **Nest ranks innermost-fastest.** TP, then CP, then PP (or EP), then DP (T02-46, T02-49, T02-51).
12. **Measure.** Run the two or three surviving layouts for a few hundred steps and pick by measured throughput (NeMo's method, T02-54; the Playbook's lesson that implementation quality flips the winner, T02-58).


---

## 4. Mental models worth teaching

1. **Every parallelism trades a replicated or full-size object for a collective, and the collective's bytes times its frequency decide which link it can live on.** DP: 2 x Psi per step (T02-4); ZeRO-3: 3 x Psi per step (T02-7); TP: 8bsh(t-1)/t per layer per micro-batch (T02-13); PP: bsh/t per boundary per micro-batch (T02-31); CP: K/V per attention layer (T02-24, T02-25); EP: k copies of each token's hidden state per MoE layer (T02-38).
2. **Frequency matters as much as size.** TP fires inside every layer of every micro-batch, PP once per micro-batch per boundary, DP once per step; this is why TP lives on NVLink and DP tolerates EFA (T02-14, T02-43, T02-46).
3. **Nest innermost-fastest.** TP, then CP, then PP, then DP, with the innermost inside one instance; Llama 3, TorchTitan and Megatron-Core's default rank order agree (T02-46, T02-49, T02-51).
4. **An all-reduce is a reduce-scatter plus an all-gather.** That single identity explains why sequence parallelism and ZeRO stages 1 and 2 cost no extra bytes, and why ZeRO-3 costs exactly one extra all-gather (T02-4, T02-7, T02-16).
5. **Pipeline parallelism divides weights, not peak activations.** Under 1F1B the first stage holds about L layers of activations whatever p is (T02-19, T02-53).
6. **The bubble is (p-1)/(v x m), and the global batch caps m.** More micro-batches or more chunks per device shrink it; the training recipe's batch size, not the cluster, sets the ceiling (T02-28, T02-30, T02-47).
7. **Cross the slow link once, fan out on the fast one.** HSDP, ZeRO++'s secondary partition, Megatron's scatter/gather for PP and DeepSeek-V3's node-limited routing are one idea applied four times (T02-9, T02-11, T02-31, T02-39).
8. **Long sequences hide their own communication.** Attention compute grows with s^2 while CP traffic grows with s, and GQA shrinks K and V further (T02-21, T02-24).
9. **MoE runs two parallel layouts in one model.** Attention and dense layers on TP x CP x DP x PP, experts on ETP x EP x EDP x PP, sharing only PP (T02-41, T02-72).
10. **Published tools disagree on the starting point; the measured run decides.** NeMo starts an 8B model at TP 2 or 4, TorchTitan at FSDP 8, NVIDIA's guide at CP 2 (T02-50, T02-52, T02-55, T02-58).

## 5. Contradictions

**C02-1. FSDP paper, internal: sharding factor for host-local sharding.** 2304.11277v2 defines F as "the number of ranks over which parameters are sharded" (T02-8), which makes host-local sharding F = G (GPUs per host), yet Sec 3.2.2 says "we can set F = W/G to limit the AllGather (and ReduceScatter) operations within the same host" (T02-9). With W/G hosts, F = W/G would shard across hosts. The surrounding text (replication groups of same-local-rank GPUs across hosts) matches F = G [our reading]. Resolution: treat F = G as intended; the cross-host traffic formula should be re-derived before it is quoted on the page (U02-13).

**C02-2. Megatron-Core doc versus code: total GPU formula for MoE.** `docs/user-guide/parallelism-guide.md` says "Total GPUs = TP × PP × CP × EP × DP"; `parallel_state.py` factorises the expert grid separately (T02-72). Code wins. The guide's DeepSeek-V3 row is only valid with expert TP 1.

**C02-3. TorchTitan paper versus repository benchmark document.** 2410.06511v3 (arXiv v3 of 7 June 2025) Tables 1 to 4 and the v0.4.0 `docs/benchmarks/llama3_h100_202412_torchtitan.md` describe the same experiments with different numbers: 8B on 8 GPUs 6,258 / 6,674 / 9,409 tokens/s (paper) against 5,762 / 6,667 / 8,532 (doc); 70B 2D 897 and 1,010 (paper) against 829 and 876 (doc); 405B 3D "FSDP degree 4, TP degree 8, PP degree 16 ... global batch size 128" (paper) against "FSDP 8, TP 8, PP8 ... global batch size 256" (doc); 1D MFU "33% to 42%" (paper) against "33% to 39%" (doc). Neither states which supersedes the other. The dive should cite the repository document at the pinned SHA, which also records the torch, torchao and torchtitan commits used (T02-50), and name the paper's figures as a different run.

**C02-4. Megatron-Core docstring versus signature: rank order default.** `initialize_model_parallel` defaults `order` to "tp-cp-ep-dp-pp"; its docstring says "default=tp-dp-pp" and "Now we support tp-dp-pp and tp-pp-dp orders" (T02-51). Code wins.

**C02-5. Megatron-Core MoE README versus argument parser: the single-GPU memory emulation flag.** The README names `--fake-init-process-group` (T02-53); `megatron/training/arguments.py` at the same SHA defines `--fake-process-group` (line 3200) and reads `args.fake_process_group` (line 1750). A text search of `arguments.py` found no `fake-init-process-group`. Code wins; whether argparse would reject the README spelling depends on whether unknown arguments are ignored in that entry point [our reading].

**C02-6. NeMo Auto Configurator README, internal.** It says it "searches over four critical hyperparameters" and then lists six: TP, PP, CP, EP, micro-batch size and activation checkpointing layers (T02-54). The code's grid loops over TP, PP, CP, EP and micro-batch size (`training_config.py` lines 72 to 76). Code wins.

**C02-7. AWS documentation versus AWS product page versus NVIDIA: memory units.** The EC2 instance types guide gives p5.48xlarge "640 GiB (8 x 80 GiB)"; the P5 product page gives "640 GB HBM3" (T02-68); NVIDIA gives "80GB" per H100 (T02-69). 80 GiB is about 7% more than 80 GB. The worked examples use 80 GB as the conservative figure; usable capacity after driver and framework reservations is lower than either and was not located in a first-party source (U02-9).

**C02-8. Sequence parallelism: bytes versus time.** 2205.05198v1 says SP "does not introduce any communication overhead" because the bytes equal a ring all-reduce (T02-16), and in the same paper measures that reduce-scatter plus all-gather "is slower than an all-reduce alone" (T02-17). Both are true at different levels; the dive should not repeat the first without the second.

**C02-9. Bubble ratio definitions.** GPipe gives O((K-1)/(M+K-1)), the bubble over total time (T02-27); Megatron gives (p-1)/m, the bubble over ideal compute time (T02-28); Llama 3 gives (PP-1)/(V x M) (T02-35). They describe the same idle time with different denominators, and quoted percentages are not comparable unless the denominator is stated [our reading].

**C02-10. Megatron PTD-P paper, internal: symbol b'.** Sec 3.3.1 defines b' := B/b; Sec 3.4 redefines b' as B/d inside Eq. 1 (T02-44). The dive should use separate symbols.

**C02-11. Recomputation with pipelines: 2021 versus 2024.** 2104.04473v5 calls activation recomputation "required" with PP (T02-32); Llama 3 pre-trained 405B with PP 16 at 8K tokens "without activation checkpointing" (T02-35). Version drift, recorded as STALE on T02-32.

## 6. UNKNOWN register

**U02-1. DDP's current default bucket size.** The 25 MB figure comes from the 2020 paper (T02-3). Not re-read in `torch/nn/parallel/distributed.py` at a pinned PyTorch release. Close: wave 2 fetch of that file at the release area 03 pins.

**U02-2. Ulysses' head-count bound in DeepSpeed's own words and code, and its GQA handling.** The paper's text has no explicit limit (T02-23). Close: read `deepspeed/sequence/layer.py` at v0.19.9 for the head-divisibility assertion and any KV-head replication.

**U02-3. Llama 3.1 `config.json`.** Not read (gated Hugging Face repository); exact vocabulary size, whether input and output embeddings are tied, and the published parameter counts were therefore derived from Table 3 (T02-67). Close: read the config at a pinned revision with authorised access, or accept the hedge "about 8.0B and 70.6B parameters, derived from the paper's architecture table".

**U02-4. Where NeMo's Auto Configurator lives after NeMo v3.0.0.** Present in v2.7.3, absent from the v3.0.0 tree (T02-55). Close: area 03's NeMo and Megatron Bridge research.

**U02-5. TorchTitan run details.** The sequence length of the benchmark tables and the defaults of `ParallelismConfig()` (assumed FSDP over all ranks) were not read (T02-50, T02-59). Close: read `torchtitan/config/parallelism.py` and `torchtitan/models/llama3/flavors.py` at v0.4.0.

**U02-6. Which parallelism degrees TorchTitan Neuron supports on Trn2.** The Neuron 2.33 announcement recommends native PyTorch and TorchTitan (T02-65) but the support matrix was not read. Close: area 03.

**U02-7. H100 SXM dense BF16 peak as printed by NVIDIA.** The product page prints only the sparse figure (T02-69). Close: area 01 or 05 (H100 datasheet PDF or Hopper architecture whitepaper).

**U02-8. Formula versus measured memory.** The formula estimate for TorchTitan's 70B layout is about 39 GB against 67.6 to 71.9 GiB measured on 96 GB parts (section 3.2). The gap (communication buffers, allocator caching, Float8 weight copies, loss computation) is not explained by any source read. Close: a Tier 0 memory snapshot of one 70B layout on p5 (or on one GPU with Megatron's fake process group, T02-53), or accept the hedge "formula totals are lower bounds; plan for measured peaks well above them".

**U02-9. Achieved bus bandwidth on p5 for all-reduce over NVLink and over EFA, and usable HBM per GPU.** The worked examples divide by 450 GB/s and 50 GB/s, which are link peaks. Close: the EFA dive's measured or documented nccl-tests figures if it has them (link), otherwise a small AWS experiment (nccl-tests all_reduce_perf on 1 and 2 p5.48xlarge) with teardown.

**U02-10. Llama 3's V and M per configuration.** Table 4 gives batch per DP rank but the interleaving depth V and micro-batch count M were not located in the text read, so the 405B bubble cannot be computed from the paper. Close: accept as a hedge.

**U02-11. FSDP2 behaviour under gradient accumulation.** Whether `fully_shard` re-gathers parameters and reduce-scatters gradients on every micro-step by default decides whether flat FSDP on 4 nodes moves 47 GB or 373 GB per GPU per step (section 3.3). Close: read the PyTorch `fully_shard` documentation and source at the release area 03 pins (`reshard_after_forward`, `set_requires_gradient_sync`).

**U02-12. Llama-specific activation constant.** Section 3 uses 34 from T02-18 for a SwiGLU, GQA layer. Close: area 01's activation-memory derivation.

**U02-13. FSDP hybrid cross-host traffic formula.** The fraction layout in the PDF text extraction and the F = W/G inconsistency (C02-1) leave the printed formula uncertain. Close: read the arXiv HTML rendering of 2304.11277v2 Sec 3.2.2, or re-derive and label [derived].

**U02-14. Academic performance models and automated planners beyond Megatron's Eq. 1.** The brief asks for "any academic performance model"; this pass recorded only PTD-P's analytical step-time model (T02-44) and the tools' heuristics (T02-54 to T02-56). Automated parallelism planners and simulators were not searched or read. Close: a wave 2 search for peer-reviewed planners with arXiv IDs, recording what each takes as input and prescribes.

## 7. Reading path for a newcomer

1. **nccl-tests `doc/PERFORMANCE.md` (v2.21.1).** Ten minutes that give the cost of every collective as a multiple of size over bandwidth; everything after this is "which collective, how big, how often" (T02-60, T02-61).
2. **PyTorch DDP paper, 2006.15704v1, Sec 3.** The simplest parallelism and the overlap idea everything else reuses (T02-1 to T02-3).
3. **ZeRO, 1910.02054v3, Sec 5 and 7.** Memory per stage and the 2Psi versus 3Psi argument; the vocabulary for FSDP (T02-5 to T02-7).
4. **Megatron-LM, 1909.08053v4, Sec 3.** Column and row splits in two pages (T02-12).
5. **Megatron PTD-P, 2104.04473v5, Sec 2 and 3.** Bubble formulas, TP bytes, the three takeaways; the paper most sizing guidance descends from (T02-13, T02-14, T02-28 to T02-31, T02-43 to T02-45).
6. **Reducing Activation Recomputation, 2205.05198v1, Sec 4.** Sequence parallelism and the first-stage activation result that corrects the PP intuition (T02-16 to T02-19).
7. **PyTorch FSDP, 2304.11277v2, Sec 3.2.** Hybrid sharding, the layout most single-to-few-node jobs end up on (T02-8 to T02-10).
8. **Llama 3, 2407.21783v3, Sec 3.3.** A production 4D layout on 80 GB H100s with its reasons (T02-24, T02-35, T02-46 to T02-48, T02-63).
9. **TorchTitan benchmark document and paper Sec 3.3.** The same models as the worked examples, on PyTorch-native parallelism (T02-49, T02-50).
10. **Megatron-Core parallelism guide and MoE README at core_v0.20.0.** The vendor's own procedure and memory table (T02-42, T02-52, T02-53).
11. **Ring Attention 2310.01889v4 Sec 3, Ulysses 2309.14509v2 Sec 3.** The two CP families (T02-20 to T02-22).
12. **Zero Bubble 2401.10241v1 and DeepSeek-V3 2412.19437v2 Sec 3.2.** Where pipeline scheduling and MoE communication went next (T02-33, T02-34, T02-39, T02-40).
13. **Hugging Face Ultra-Scale Playbook, "Finding the Best Training Configuration".** Tier 3; read last, as a synthesis to check one's own procedure against (T02-57, T02-58).

## 8. Source list by tier

**Tier 1: code at a pinned SHA**
- NVIDIA/Megatron-LM core_v0.20.0 (685fb8bd970185e9ac3283fe32a5d6667bf4b268): `megatron/training/arguments.py`, `megatron/core/parallel_state.py`, `megatron/core/transformer/transformer_config.py`, `megatron/core/num_microbatches_calculator.py` (T02-15, T02-25, T02-26, T02-41, T02-51, T02-72).
- NVIDIA/NeMo v2.7.3 (1d4ee423806d461f9146ae982f9da8eb32495ae7): `nemo/collections/llm/tools/auto_configurator/core/training_config.py` (T02-54, T02-55); NeMo v3.0.0 (fd6a877539710e2b98f28c43272ff81312f83417) tree listing only (T02-55).
- pytorch/torchtitan v0.4.0 (45e33cd413b64cb37a7840cfd3c9765d3c639ae1): `torchtitan_recipes/models/llama3.py` (T02-59).

**Tier 1: official framework and tool documentation at a pinned SHA**
- NVIDIA/nccl-tests v2.21.1 (afd59abab774a6a4b492eb344bd0c845a0b7bb4d): `doc/PERFORMANCE.md` (T02-60, T02-61).
- Megatron-LM core_v0.20.0: `docs/user-guide/parallelism-guide.md`, `docs/user-guide/features/context_parallel.md`, `megatron/core/transformer/moe/README.md` (T02-25, T02-42, T02-52, T02-53, T02-72).
- NeMo v2.7.3: `examples/llm/auto_configurator/README.md` (T02-54).
- deepspeedai/DeepSpeed v0.19.9 (8d4f29c75f4a4b30d4db00a94b4aebfdff5107f3): `deepspeed/autotuning/README.md` (T02-56).
- torchtitan v0.4.0: `docs/benchmarks/llama3_h100_202412_torchtitan.md` (T02-50).

**Tier 1: first-party AWS and NVIDIA documentation (unversioned pages, accessed 2026-10-30)**
- https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html (T02-68)
- https://aws.amazon.com/ec2/instance-types/p5/ (T02-68)
- https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/about-neuron/announcements/neuron2.x/announce-maintenance-nxdt-nxd-core-training.html (T02-65)
- https://www.nvidia.com/en-us/data-center/h100/ (T02-69; vendor specification)
- https://www.nvidia.com/en-us/data-center/nvlink/ (T02-70; vendor specification)

**Tier 2: first-party vendor blog**
- https://developer.nvidia.com/blog/massively-scale-deep-learning-training-nccl-2-4/ (T02-62)

**Tier 3: peer-reviewed papers (venue confirmed)**
- 2006.15704v1 PyTorch Distributed (VLDB 2020) (T02-1 to T02-3)
- 2304.11277v2 PyTorch FSDP (PVLDB 16(12)) (T02-8 to T02-10)
- 2104.04473v5 Megatron PTD-P (SC 2021) (T02-13, T02-14, T02-28 to T02-32, T02-43 to T02-45)
- 2006.09503v3 PipeDream-2BW and PipeDream-Flush (ICML 2021) (T02-29)
- 2101.03961v3 Switch Transformers (JMLR 23, 2022) (T02-36)

**Tier 3: preprints**
- 1910.02054v3 ZeRO (T02-4 to T02-7)
- 2306.10209v1 ZeRO++ (T02-11)
- 1909.08053v4 Megatron-LM (T02-12)
- 2205.05198v1 Reducing Activation Recomputation (T02-16 to T02-19)
- 2310.01889v4 Ring Attention (T02-20, T02-21)
- 2309.14509v2 DeepSpeed-Ulysses (T02-22, T02-23)
- 2407.21783v3 Llama 3 (first-party lab) (T02-24, T02-35, T02-46 to T02-48, T02-63, T02-66, T02-67)
- 1811.06965v5 GPipe (T02-27)
- 2401.10241v1 Zero Bubble (T02-33)
- 2412.19437v2 DeepSeek-V3 (first-party lab) (T02-34, T02-39, T02-40, T02-71)
- 2006.16668v1 GShard (T02-37)
- 2504.14960v3 MoE Parallel Folding (T02-41)
- 2410.06511v3 TorchTitan (T02-49, T02-50)

**Tier 3: third-party technical analysis**
- Hugging Face Ultra-Scale Playbook, nanotron Space revision c93890dd4b22356ee18ed9b863e6f2d0909729bc: https://huggingface.co/spaces/nanotron/ultrascale-playbook/tree/c93890dd4b22356ee18ed9b863e6f2d0909729bc (T02-57, T02-58)

**Repository links (not re-researched)**
- `deep-dives/efa/src/sections/AIMLTraining.tsx`, `NcclOverEfa.tsx`, `TopologyApi.tsx`, `InstanceSupport.tsx`
- `deep-dives/silicon-memory-inference/src/sections/CommunicationAndScaleOut.tsx`, `MoeAndSparseActivation.tsx`, `AwsCompilersAndTooling.tsx`
