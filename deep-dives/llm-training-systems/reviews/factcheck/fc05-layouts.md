# Fact check fc05-layouts (sections 13, 14), 2026-10-31

Files: `src/sections/ComposingLayouts.tsx` (section 13, Composing Layouts), `src/sections/SetMyRanks.tsx`
(section 14, Set My Ranks: The Sizing Procedure), with `revamp/claims/composing.md` and
`revamp/claims/set-my-ranks.md`. Line numbers in the tables are at HEAD (81a9835), before the fixes.

Evidence read anonymously (no account token, no identifying header): raw files from
raw.githubusercontent.com at the pinned refs (PyTorch `v2.15.0` device_mesh.py, _mesh_layout.py and
elastic/agent/server/api.py; TorchTitan `v0.4.0` parallelism_context.py, config/parallelism.py,
models/llama3, docs/benchmarks/llama3_h100_202412_torchtitan.md; Megatron-LM `core_v0.20.0`
parallel_state.py, arguments.py, transformer_config.py, num_microbatches_calculator.py, the parallelism
guide, dist_optimizer.md and the MoE README; DeepSpeed `v0.19.9` pipe/topology.py, pipe/module.py,
launcher/launch.py, zero/stage_1_and_2.py, engine.py, autotuning/README.md; NeMo `v2.7.3`
auto_configurator README and training_config.py, NeMo `v3.0.0` README; Megatron Bridge
`04ce2b3efd6f2e387fc244e9f37afd0a1f7952fb` llama3 recipe; aws-samples awsome-distributed-training
`3a1002576ccef26e66ba714303b10ccdaa645691` nccl-tests README); shallow clones of
calculon-ai/calculon at tag `sc23` (`c2aba03022c4870c62a42f127f7e2b97c2ce7de2`) and Megatron Bridge;
arXiv PDFs at the versioned ids the Cites carry, through pdftotext (2407.21783v3, 2104.04473v5,
2410.06511v3, 2412.19437v2, 1910.02054v3, 2205.05198v1, 2504.14960v3); the Slurm srun manual; EC2
accelerated computing specifications; NVIDIA H100, H200 and NVLink pages; the Hugging Face model API at
the pinned Llama 3.1 70B revision; the EC2 On-Demand price list and Capacity Block pricing page; the
SC23 proceedings page (Wayback); the OSDI 2022 Alpa page; the PVLDB volume 16 index
(https://www.vldb.org/pvldb/vol16-volume-info/). Every number either page computes was re-rendered
through `react-dom/server` against `src/lib/` (Calculator C `evaluateLayout`, `sizeParallelism`,
`sizeMoeGrids`) and the load-bearing ones recomputed by hand.

Cross-section conditions: both files price traffic between instances per instance over 400 GB/s, or per
GPU at 50 GB/s when a group has one member per instance, and NVLink per GPU at 450 GB/s ("Cross-instance
pricing" holds). "ZeRO-2 under gradient accumulation" was contradicted in two places (section 13
"DP reduces gradients once per step", section 14 step 3), fixed below. "Xid alert rule" is not
discussed. The 41 sbh coefficient is attributed only to an eager SwiGLU measured in E1, never to
TorchTitan's default; both worked examples use 34 sbh (fused). The pinned Llama 3.1 metadata link is
unchanged; neither file cites the FSx price list.

## ComposingLayouts.tsx (section 13)

70 load-bearing claims checked (the 66 claim-file rows plus four text claims not in the file); 61
CONFIRMED (2 WRONG, 6 OVERREACH, 1 UNSUPPORTED; one prose fix besides). Confirmed include every Llama 3 statement (Table 4 rows and 43%, 41%, 38% MFU; Sections
3.3.1 and 3.3.2: pods of 3,072 GPUs, 1:7 above the pods, [TP, CP, PP, DP], FSDP's latency tolerance,
the 43% to 41% fall attributed to batch per DP group); DeepSeek-V3 Sections 3.1, 3.2.1, 3.2.2; the
TorchTitan paper Sections 3.3.1 to 3.3.4 and Tables 3 and 4; every pinned code line (device_mesh.py
L190-L196 and L1688, _mesh_layout.py L291-L301, parallelism_context.py L257 and L319-L323, Megatron
parallel_state.py L357, L641, L773-L775, L813-L816, DeepSpeed topology.py L18-L21 and L248, launch.py
L160-L168); PTD-P Sections 1, 3.2, 3.3, 4.1, 5.2 and the Takeaways; the srun block default; and every
derived number (1,203 GB, 2.67 s, 15%; 10.7 GB, 0.21 s, 1.2%; 7.7 GB, 0.15 s, 0.9%; 5,120 collectives;
0.94 GB per layer; 16.8 MB per send; 4.41 GB shard; 61.7 GB per instance; about 24 s against 17.5 s;
"more than 100 times").

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | 530B "ZeRO-3 138 on 640 GPUs" listed under "a batch of 2,240" | ComposingLayouts.tsx:825-828 | WRONG (the 640-GPU row ran at global batch 2,560) | https://arxiv.org/abs/2104.04473v5 Table 2 caption: "did not fit on 560 GPUs when using a microbatch size of 4 with ZeRO-3, so we increased the number of GPUs used to 640 and global batch size to 2560" | "98 on 1,120 GPUs and 48 on 2,240, and 138 on 640 GPUs at a batch of 2,560 because it did not fit on 560 at a micro-batch of 4" |
| 2 | "ZeRO-3 halves at each doubling" | ComposingLayouts.tsx:834 | OVERREACH (144 to 88 is a 39% drop; 88 to 44 and 98 to 48 are 50% and 51%) | same Table 2 | "loses 39% to 51% of its per-GPU throughput at each doubling (our arithmetic)" |
| 3 | PP-outermost: "pipeline neighbours sit 512 ranks apart, across pods" | ComposingLayouts.tsx:976-978 | WRONG (a 3,072-GPU pod holds six 512-GPU stages, so 2 of the 15 stage boundaries cross a pod if ranks fill pods in order) | 2407.21783v3 Sec 3.3.1 (pods of 3,072); arithmetic 8 x 16 x 64 = 8,192, 3,072 / 512 = 6 | "pipeline neighbours sit 512 ranks apart, and a pod holds six stages, so two of the fifteen stage boundaries cross a pod if ranks fill the pods in order (our arithmetic)" |
| 4 | "one pipeline ... is 128 consecutive GPUs, small enough for one pod" | ComposingLayouts.tsx:970-971 | OVERREACH (derivation not labelled; Meta states the order, not the 128-GPU block) | 2407.21783v3 Sec 3.3.2 | "(our arithmetic)" added |
| 5 | "DP reduces gradients once per step" | ComposingLayouts.tsx:869 | OVERREACH (contradicts the build-log condition: ZeRO-2 and FSDP reduce per micro-batch under accumulation; the worked layout is ZeRO-1) | build-log.md "ZeRO-2 under gradient accumulation"; https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/deepspeed/runtime/zero/stage_1_and_2.py#L2293-L2295 | "DP with ZeRO-1 reduces gradients once per step" |
| 6 | srun "with a topology plugin configured it follows topology order instead" | ComposingLayouts.tsx:1024-1026 | OVERREACH ("instead" reads as replacing block placement; the manual changes node order only) | https://slurm.schedmd.com/srun.html --distribution: "tasks are distributed following topology order rather than node index order" | "it takes the nodes in topology order rather than node-index order" |
| 7 | Step 5: "a Slurm cluster with a topology plugin is the first place to look" | ComposingLayouts.tsx:1035 | OVERREACH (topology order changes which instances hold neighbouring ranks, not whether a TP group shares a host under block) | same srun section | "On a Slurm cluster with a topology plugin, also expect the node order, and so which instances hold neighbouring ranks, to follow the topology rather than the node names." |
| 8 | torchrun contiguous ranks, `kind="code"` Cite to api.py L606-L608 | ComposingLayouts.tsx:60, 1017-1019 | UNSUPPORTED as code (L606-L608 is the docstring; the claim itself holds) | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/elastic/agent/server/api.py#L618-L683 (`base_global_rank = group_rank * local_world_size`; cumulative `base_global_rank += local_world_size`; `global_rank=base_global_rank + local_rank`) | Cite re-pointed to L618-L683 |
| 9 | TorchTitan paper "reports the same experiments with different figures" | ComposingLayouts.tsx:737 | OVERREACH (the layouts differ: FSDP 4 x TP 8 x PP 16 at batch 128 against FSDP 8 x TP 8 x PP 8 at batch 256) | 2410.06511v3 Tables 3, 4; https://github.com/pytorch/torchtitan/blob/v0.4.0/docs/benchmarks/llama3_h100_202412_torchtitan.md#L48-L60 | "reports different figures for the same models" |
| 10 | "A docstring in the same function still gives the default" | ComposingLayouts.tsx:771 | prose rule (changelog voice) | n/a | "gives" |

Venues: PTD-P "SC 2021" confirmed by the arXiv comment and fc04's Crossref record; Llama 3, TorchTitan
and DeepSeek-V3 stay "preprint" (TorchTitan's ICLR record could not be opened: OpenReview returned 403,
so no venue was set). Acronyms: every acronym expands at first use in reading order (TP, CP, PP, DP,
MFU, NVLink context, EFA, FSDP, NCCL, GQA, ZeRO, PTD-P, TFLOP/s, HSDP, BF16, EC2).

Score after fixes: **9/10.** Every code range, paper statement and computed figure holds; two wrong
statements sat in supporting evidence (a Table 2 batch and a pod derivation), and both are fixed.

## SetMyRanks.tsx (section 14)

96 load-bearing claims checked (the 89 claim-file rows plus seven text claims not in the file); 81
CONFIRMED (1 WRONG, 4 UNSUPPORTED, 8 OVERREACH, 2 STALE). Confirmed include the Megatron lines (guide L31, L155-L158, L225-L230, L237-L241;
dist_optimizer L14-L20; arguments.py L3041-L3056 and L3102-L3103; transformer_config L151-L157 and
L1746-L1773; num_microbatches L381-L388; MoE README L332-L336), TorchTitan parallelism.py L95-L105 and
benchmarks, DeepSpeed module.py L116-L133, stage_1_and_2.py L2293-L2295, engine.py L2695 and the
autotuner README, NeMo L72-L77 and L364-L398 (TP 2 or 4 for at most 8B at 8,192 tokens) and both
READMEs' quotes, the Megatron Bridge recipe and v0.7.0 tree, the AWS sample (16 GiB in 66 ms), EC2
p5 and p5en specifications, NVLink 900 GB/s, H100 80 GB and 1,979 TFLOPS with sparsity, H200 141 GB,
70,553,706,496 parameters, $55.04 On-Demand and $47.757 Capacity Block, the P-instance quota default of
0, the Playbook quotes, Alpa OSDI 2022, ZeRO Sections 1 and 3.1, Korthikanti Section 4.2.3, MoE
Parallel Folding Section 3.2, E1 (34.03 and 41.03 sbh), E2 and E3 counts. Every computed figure was
re-rendered (1,128.9 GB; 17.5 s; layout A 38.0 GB and 42.4 GB, bubble 0.94% and 4.69%; layout B 43.0
GB, 410.1 GB, 1.03 s, 4.4%; 6,561 GB and 820 GB per GPU at micro-batch 1, 94%, deferred 35%, 22.0 GB
against 4.4 GB; ranking 27 shapes, A 2nd, B 11th, 92 shapes with CP, A 20th, B 53rd; example 2
105.8 GB target, 140.2 s, 308.7, 172.0, 221.4, 54.6, 141.1 and 160.4 GB; TP 8 x DP 4 85.0 GB and
102.6 GB, 211.7 GB per instance, 0.4%, 140.2 to 162.1 s; TP 8 x PP 2 x DP 2 66.6 and 56.1 GB, 0.39%;
H100 85.0, 64.1 and 57.8 GB; shortlist TP 4 x PP 4 (v 4) x DP 2 first at 140.6 to 151.3 s, TP 8 x DP 4
3rd).

Known item, example 2's ZeRO-2 passage: CONFIRMED against Calculator C and by hand. Gradient shard
70,553,706,496 / 8 x 2 bytes = 17.64 GB per GPU; ZeRO-1 sends 2 x 3/4 x 17.64 = 26.46 GB per GPU, x 8
GPUs = 211.7 GB per instance, 0.53 s at 400 GB/s, 0.4% of 140.2 s; ZeRO-2 at 512 / 4 = 128
micro-batches sends 128 reduce-scatters and one all-gather, 129 x 13.23 = 1,706.5 GB per GPU, 13,652.1
GB per instance, 34.1 s, 24.3%.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | Korthikanti Cites `venue="preprint"` (two) | SetMyRanks.tsx:2093, 2211 | STALE | orchestrator note; fc04 confirmed on https://proceedings.mlsys.org/paper_files/paper/2023/hash/80083951326cf5b35e5100260d64ed81-Abstract-mlsys2023.html | `venue="MLSys 2023"` on both |
| 2 | "TP x CP x PP x DP must equal the world size ..., and ETP x EP x EDP x PP" cited to arguments.py L1567-L1571 | SetMyRanks.tsx:101, 1605-1609 | UNSUPPORTED (L1567-L1571 checks num_experts % EP) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L468-L495 (world_size % TP x PP x CP, DP the quotient); https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/parallel_state.py#L946-L960 (world_size % ETP x EP x PP) | two Cites, one per grid |
| 3 | Calculon code link `calculon/llm.py` | SetMyRanks.tsx:122 | WRONG (no such file at the tag) | https://github.com/calculon-ai/calculon/blob/c2aba03022c4870c62a42f127f7e2b97c2ce7de2/calculon/llm/llm.py | path and label now `calculon/llm/llm.py` |
| 4 | Calculon "models TP, PP and DP with ZeRO-1, interleaving and recomputation analytically, returning step time and memory" cited to SC23 | SetMyRanks.tsx:1774-1779 | UNSUPPORTED (the SC23 page says only "a parameterized analytical performance model"; the inputs and outputs are in the code; its optimizer sharding is a flag, not ZeRO-1) | SC23 pap552 abstract (Wayback); llm.py L60-L77, L2130, L2273 | SC23 sentence narrowed to the abstract; "and estimates step time and memory" moved onto the code Cite |
| 5 | Galvatron `venue="VLDB 2023"` | SetMyRanks.tsx:1791 | CONFIRMED, re-labelled to the publisher's form | https://www.vldb.org/pvldb/vol16-volume-info/ (issue 3, pp. 470-479) | `venue="PVLDB 16(3)"`, matching DataParallel.tsx's "PVLDB 16(12)" |
| 6 | h1: "the obvious data-parallel layouts fail the memory check" | SetMyRanks.tsx:1429 | OVERREACH (FSDP 32 with full recomputation fits at 54.6 GB; the h2 says so) | Calculator C, rendered | "fail the memory check or fit only by recomputing" |
| 7 | Step 2: "BF16 (bfloat16) weights and gradients" under ZeRO Section 3.1 | SetMyRanks.tsx:1495 | OVERREACH (the paper says fp16) | https://arxiv.org/abs/1910.02054v3 Sec 3.1 ("2Ψ + 2Ψ + KΨ = 16Ψ", fp16) | "2 each for the 16-bit weights and gradients and 12 for the FP32 ... The ZeRO paper's 16-bit format is FP16; BF16 (bfloat16) is the same size." |
| 8 | Step 3: "its first two stages keep data parallelism's communication volume" | SetMyRanks.tsx:1516 | OVERREACH (contradicts the build-log condition without its scope) | build-log.md "ZeRO-2 under gradient accumulation" | "at one micro-batch per step its first two stages keep ..." |
| 9 | Example 2: "ZeRO-2 costs the same bytes as ZeRO-1 only without gradient accumulation, as the ZeRO paper counts it" | SetMyRanks.tsx:2075-2081 | OVERREACH (puts the scope in the paper's mouth; the paper counts one volume) | 1910.02054v3 Sec 1; stage_1_and_2.py L2293-L2295 | "The ZeRO paper counts ZeRO-2 at ZeRO-1's volume, which holds at one micro-batch per step. DeepSpeed reduces ZeRO-2's partitioned gradients on every backward pass and ZeRO-1's at the accumulation boundary"; DeepSpeed Cite now `kind="code"`. 13,652.1 GB and 24.3% unchanged |
| 10 | "For Llama 3.1 8B at 8,192 tokens" over all three starting points | SetMyRanks.tsx:1702-1714 | OVERREACH (TorchTitan Table 1 states no sequence length; NeMo's heuristic is by model size; Megatron's row is "LLaMA-3 8B ... (8K seqlen)") | TorchTitan benchmarks L22; NeMo training_config.py L375-L379; Megatron guide L155 | "For an 8B model at 8,192 tokens"; TorchTitan "for Llama 3.1 8B, at a sequence length its table does not state"; Megatron "for Llama 3 8B" |
| 11 | "the NVIDIA/NeMo repository became speech-only at v3.0.0" | SetMyRanks.tsx:1736 | OVERREACH (README: "pivoted to focus on audio, speech, and multimodal LLM") | https://github.com/NVIDIA/NeMo/blob/v3.0.0/README.md L33 | "focuses on audio, speech and multimodal LLMs at v3.0.0" |
| 12 | Step 10: "because NCCL spreads a collective's crossing over all of an instance's network cards" stated as fact | SetMyRanks.tsx:1650-1652 | OVERREACH (the mechanism is the dive's reading, section 7, not an NCCL statement cited here) | Collectives section 7; build-log "Cross-instance pricing" | folded into the labelled reading: "That per-instance count is our reading of how NCCL ... spreads a collective's crossing over an instance's network cards (section 7)" |
| 13 | "the H100's dense BF16 peak of 989.5 TFLOPS" with no hedge or Cite | SetMyRanks.tsx:1819-1820 | UNSUPPORTED (U02-7's accepted hedge text missing) | RESEARCH-GUIDE.md U02-7; https://www.nvidia.com/en-us/data-center/h100/ (1,979 TFLOPS BF16, with sparsity) | "(NVIDIA prints the sparse figure, 1,979; the dense figure is half)" plus a vendor-claim Cite |
| 14 | "Layout A is the PTD-P recipe: TP inside..., a four-stage pipeline..., and ZeRO-1" | SetMyRanks.tsx:1883-1885 | OVERREACH (PTD-P uses plain DP; ZeRO-1 is this layout's choice) | 2104.04473v5 Secs 3.2, 3.3 | "Layout A follows PTD-P's takeaways (TP inside the instance, a four-stage pipeline across instances), here with ZeRO-1" |
| 15 | "The micro-batch, which most configurations treat as a tuning value, decides ..." | SetMyRanks.tsx:1910-1911 | UNSUPPORTED (no source surveys configurations) | none | clause deleted |
| 16 | Claims file: ranking (A 6th, B 5th; 30th and 29th), shortlist (TP 4 x PP 2 (v 10) x DP 4, 4th), "Calculator prices ZeRO-2 like ZeRO-1", Calculon path, world-size cite | revamp/claims/set-my-ranks.md | STALE (claims file only; the page renders live values) | rendered page | rows replaced with the rendered values and corrected cites |

Acronyms: TP, SP, PP, CP, DP, ZeRO, FSDP, HSDP, HBM, BF16, FP32, PTD-P, MoE, ETP, EP, EDP, 1F1B, NCCL,
EFA, MFU, GQA and FLOPs expand at first use; DGX, GB10 and H100 are product names.

Score after fixes: **8/10.** Every computed figure matches Calculator C, but the file carried one broken
code link, four unsupported statements (one a code Cite on the wrong lines) and eight overreaches; one printed figure (layout B's TP
share, 15.3%) depends on a Calculator C gap reported below.

## For the orchestrator (files outside this group)

- `ExpertParallel.tsx` cites arguments.py L1567-L1571 for "both grids equal the GPU count"; those lines
  hold only the num_experts % EP check. The world-size checks are arguments.py L468-L495 (dense) and
  parallel_state.py L946-L960 (expert) at core_v0.20.0.
- Calculator C (`src/lib/parallelism.ts`) does not count the TP collectives that full recomputation
  repeats (TP bytes are independent of `layout.recompute`), so a full-recomputation layout's TP share
  (layout B in section 14, printed 15.3%) is likely about 1.5 times the printed value: the recomputed
  forward repeats its two TP collectives per layer, six in all against four (our arithmetic).
- The TorchTitan paper (2410.06511v3) stays "preprint": its ICLR record could not be opened (403).
- ZeRO (1910.02054v3) stays "preprint", as in fc03.

## Orchestrator note applied (2026-10-31)

- 2205.05198v1 carries `venue="MLSys 2023"` on both of its Cites in SetMyRanks.tsx (KORTHIKANTI);
  ComposingLayouts.tsx does not cite it.
- ZeRO++ (2306.10209v1) is cited in neither file.
