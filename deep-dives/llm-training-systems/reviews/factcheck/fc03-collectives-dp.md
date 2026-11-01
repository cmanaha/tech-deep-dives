# Fact check fc03-collectives-dp (sections 7, 8, 9), 2026-10-31

Files: `src/sections/Collectives.tsx`, `src/sections/DataParallel.tsx`, `src/sections/TensorParallel.tsx`.
Status: done. Sources opened for this pass: shallow clones at the pinned tags (PyTorch v2.15.0,
TorchTitan v0.4.0, Megatron-LM core_v0.20.0, DeepSpeed v0.19.9, nccl-tests v2.21.1, NeMo v2.7.3,
awsome-distributed-training at 3a1002576ccef26e66ba714303b10ccdaa645691), the eleven arXiv papers at
the versions the Cites carry, and the AWS, NVIDIA, Slurm and NCCL pages, all fetched anonymously.
Derived numbers were recomputed with the dive's own calculators (`src/lib/parallelism.ts`,
`src/lib/memory.ts`), bundled with esbuild into `/tmp/lts-fc-fc03-calc/` and run with node.

## Known item: section 8's per-instance byte counts

All CONFIRMED against `collectiveLoad` in `src/lib/parallelism.ts` and
`src/__tests__/parallelism.test.ts` L231-L283: flat FSDP 289.09 GB (0.723 s), HSDP 192.73 GB
(0.482 s), flat FSDP deferred 120.45 GB, HSDP deferred 24.09 GB, FP32 reduce 385.45 GB, HSDP NVLink
337.27 GB (0.749 s). The flat-ring figures in parentheses (373 GB, 156 GB, 498 GB) are 24, 10 and
16 + 8 x 2 collectives of 31/32 x 16.06 = 15.56 GB, our derivation; they are right, but no test
covers them (orchestrator: `src/lib/` is yours). Memory: 74.93 GB fused, 82.45 GB eager
(doesNotFit), 41.71 and 41.95 GB with full recomputation, matching the page's 75, 82 and 42. A2's
two-instance predictions (193, 80, 128, 16.1 GB) are right at 8 micro-batches.

## Items for every group

- Cross-instance collectives priced per instance: consistent in all three files (section 7 24.1 GB
  per instance; section 8 3/4 x 16.06 = 12.05 GB per gather or scatter; section 9 eight TP groups
  sharing 400 GB/s, 18.8 ms). CONFIRMED.
- ZeRO-2 reduce-scatters on every micro-batch under accumulation: section 8 states it (DataParallel.tsx:708-713,
  [stage_1_and_2.py L2293-L2295](https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/runtime/zero/stage_1_and_2.py#L2293-L2295)),
  CONFIRMED. Section 7 stated the ZeRO 2N equality with no micro-batch scope: fixed, C5 below.
- Xid alert rule: none of the three files mentions Xid.
- Tier 3 venues: see the rows below. Kept after checking: PTD-P "SC 2021" (arXiv comment "Accepted
  to SC 2021"), DDP "VLDB 2020" and FSDP "PVLDB 16(12)" (vldb.org PDFs). ZeRO stays "preprint": the
  SC20 proceedings pages (dl.acm.org, computer.org) returned 403 or no content, so the venue could
  not be confirmed. Megatron-LM, Kaplan, McCandlish, Llama 3 and DeepSeek-V3 left as "preprint".

## Collectives.tsx (section 7)

Claims checked: 68 (the claims list) plus the prose checks. CONFIRMED: 61.
Non-CONFIRMED: WRONG 1, UNSUPPORTED 2, OVERREACH 2, STALE 1 (two Cites), prose 1.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| C1 | torchrun gives each node's workers a contiguous range of global ranks, cited to api.py L587-L608 | Collectives.tsx:36, 756 | UNSUPPORTED (range) | [api.py L618-L688](https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/elastic/agent/server/api.py#L618-L688) holds the rank assignment; L587-L608 is the docstring above it | Range and label set to L618-L688; claims line updated |
| C2 | srun follows topology order "with a topology plugin configured" | Collectives.tsx:762-764 | OVERREACH | https://slurm.schedmd.com/srun.html (--distribution): "If a topology plugin is configured and the user does not specify a distribution method, tasks are distributed following topology order rather than node index order" | Added "and no distribution given" and "rather than node index order"; claims line updated |
| C3 | NCCL chooses among ring, tree and newer algorithms "per call" | Collectives.tsx:1019 | UNSUPPORTED | https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/env.html (NCCL_ALGO) lists the algorithms and the override; it does not say per call | "per call" became "itself"; claims line updated |
| C4 | 900 GB/s for Hopper sits "in the same table where it calls its newest per-GPU figure bidirectional" | Collectives.tsx:1043-1045 | WRONG | https://www.nvidia.com/en-us/data-center/nvlink/: the table prints 900 / 1,800 / 3,000 GB/s with no direction; the word "bidirectional" is in the page's prose ("NVLink is a 3 TB/s bidirectional ... interconnect") | Re-expressed: Hopper column of the table; the page's prose calls the newest generation's 3 TB/s bidirectional; 450 per direction stays our reading |
| C5 | ZeRO shards for the same 2 x N elements per step as plain DP | Collectives.tsx:945-947 | OVERREACH | [ZeRO Sec 7.2.1](https://arxiv.org/abs/1910.02054v3) holds at one micro-batch; under accumulation stage 2 reduces every backward ([stage_1_and_2.py L2293-L2295](https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/runtime/zero/stage_1_and_2.py#L2293-L2295)) | Added "at one micro-batch per step"; claims line updated |
| C6 | Sequence-parallelism paper badge "preprint" | Collectives.tsx:942, 954 | STALE | [MLSys 2023 proceedings page](https://proceedings.mlsys.org/paper_files/paper/2023/hash/80083951326cf5b35e5100260d64ed81-Abstract-mlsys2023.html) | venue="MLSys 2023" |
| C7 | EFA used before its expansion (rank diagram, benchmark paragraph) | Collectives.tsx:710 | prose (acronym) | Acronym Standard; first expansion was at L1049 | Expanded at first prose use in the intro |

Score after fixes: **9/10**. Every number traces to a pinned source or to arithmetic the page labels;
the per-instance pricing stays labelled our reading on one vendor sample, and no diagram was touched.

## DataParallel.tsx (section 8)

Claims checked: 77 (the claims list, the known item and the prose checks). CONFIRMED: 70.
Non-CONFIRMED: WRONG 3, OVERREACH 2, STALE 1, prose 1 (plus one Cite kind added).

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| D1 | "An all-reduce cannot finish until every rank has joined it", cited to Section 2.2 | DataParallel.tsx:613-616 | WRONG | [PyTorch Distributed](https://arxiv.org/abs/2006.15704v1) Section 2.3: "As one AllReduce operation cannot start until all processes join, it is considered to be a synchronized communication"; 2.2 is "Data Parallelism" | "finish" became "start", locator 2.3; claims line updated |
| D2 | "989.5 TFLOPS dense BF16 vendor specification" | DataParallel.tsx:866 | OVERREACH | https://www.nvidia.com/en-us/data-center/h100/ lists 1,979 TFLOPS BF16 "with sparsity"; 989.5 is half, our arithmetic (the UNKNOWN-register hedge for the dense figure) | "989.5 TFLOPS dense BF16, half the 1,979 NVIDIA lists with sparsity", as section 9 already says |
| D3 | 82 GB "past the card" | DataParallel.tsx:941 | OVERREACH | H100 page lists 80 GB; Calculator B tests against the smaller of 80 GB and 80 GiB; 82 GB is under 80 GiB (85.9 GB), so "the card" claims more than the calculator checks | "past NVIDIA's 80 GB"; claims line updated |
| D4 | Critical batch grows during training, cited to Section 2.4 | DataParallel.tsx:1105 | WRONG (locator) | [McCandlish et al.](https://arxiv.org/abs/1812.06162v1): 2.4 is "Assumptions and Caveats"; 2.5 "we would expect B to increase during neural network training", 3.1 "increases by an order of magnitude or more over the course of training" | Locator "Sections 2.5 and 3.1"; claims line updated |
| D5 | ZeRO++ badge "preprint" | DataParallel.tsx:805 | STALE | [ICLR 2024 poster page](https://iclr.cc/virtual/2024/poster/18124), same authors, abstract "up to 2.16x better throughput at 384 GPU scale". Its title reads "for Large Model Training" where arXiv v1 reads "Giant"; the page's INT8/INT4 detail is from v1, which the Cite keeps | venue="ICLR 2024"; claims line updated |
| D6 | DDP, ZeRO, FSDP, HSDP first used unexpanded in the roadmap; SwiGLU never expanded | DataParallel.tsx:590-592, 940 | prose (acronym) | Acronym Standard | Expanded at first body use |
| D7 | DeepSpeed ZeRO-2 code Cite missing `kind="code"` | DataParallel.tsx:711 | citation hygiene | The cited lines are code | `kind="code"` added |
| D8 | 82 GB "with TorchTitan v0.4.0's eager" SwiGLU (orchestrator note from fc02) | DataParallel.tsx:941 | WRONG (attribution) | [TorchTitan llama3/model.py L87-L89](https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/llama3/model.py#L87-L89): `local_compile_regions` defaults to `["loss", "fused_binary_activation", "rope"]`, so TorchTitan's default compiles the SwiGLU; 41 sbh is E1's eager, uncompiled measurement, and whether the compiled path stores 34 or 41 sbh was not tested | "with an eager (uncompiled) one"; claims line updated. Collectives.tsx and TensorParallel.tsx carry no such attribution |

Score after fixes: **9/10**. The known item and all four lever figures match Calculator C and its
tests; the deferred-sync and dtype defaults trace to pinned code and E3. No diagram was touched.

## TensorParallel.tsx (section 9)

Claims checked: 77 (the claims list after one added row, and the prose checks). CONFIRMED: 74.
Non-CONFIRMED: WRONG 1, OVERREACH 1, STALE 1 (five Cites).

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| T1 | SP "moves no extra bytes" and takes the 70B layout from 99.4 GB to 61.9 GB | TensorParallel.tsx:874, 901-912 | OVERREACH | [SP paper Sec 4.2.2](https://arxiv.org/abs/2205.05198v1): the full 1/t saving stores only Y_i "and perform[s] an extra all-gather in the backward pass", overlapped; [Megatron layers.py L768-L781](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/tensor_parallel/layers.py#L768-L781). Calculator B's 22.48 GB divides all 33.5 sbh by t, so 61.9 GB assumes that all-gather | h2 description now "for TP's bytes plus an overlapped all-gather per block"; one body sentence with both Cites; claims row added |
| T2 | "--sequence-parallel with --tensor-model-parallel-size 8, the pair the guide shows" | TensorParallel.tsx:1026-1028 | WRONG | [parallelism-guide.md L82-L89](https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/parallelism-guide.md#L82-L89) shows `--tensor-model-parallel-size 4` | "the guide shows the two flags together, there with a size of 4"; claims line updated |
| T3 | SP paper badge "preprint" | TensorParallel.tsx:887, 898, 915, 927, 935 | STALE | MLSys 2023 proceedings page (C6) | venue="MLSys 2023" |

Recomputed and CONFIRMED: 0.9395 GB and 2.09 ms per layer; 855,638,016 weights per layer, 5.26e12
FLOPs, 13.3 ms, 15.7%; TP 16 1.0 GB, 6.6 ms, about 34%; 18.8 ms off-instance; 75 GB per GPU per
micro-batch over 80 layers; 8.8B parameters per GPU; Calculator C 1,202.59 GB, 2.67 s; Calculator B
60.06 / 22.48 GB activations and 99.434 / 61.854 GB totals.

Score after fixes: **9/10**. The SP memory payoff now carries its one extra collective; every code
claim checks at core_v0.20.0 and v0.4.0. No diagram was touched.

## For the orchestrator (files you own)

- The SP paper is MLSys 2023. Its Cites still carry "preprint" in MemoryBudget, TrainingStep,
  Arithmetic, SetMyRanks, ThreeBudgets and PipelineParallel (other groups' files), and in the
  Glossary and Sources appendix if listed there.
- ZeRO++ is ICLR 2024 (title on the ICLR page differs: "Large Model Training").
- ZeRO's SC20 venue could not be confirmed on a proceedings page; left "preprint".
- `src/__tests__/parallelism.test.ts` has no test for the flat-ring figures (373, 156, 498 GB) or
  the section 8 memory figures (74.93, 82.45, 41.71, 41.95 GB).
