# Fact check fc04-pp-cp-ep (sections 10, 11, 12), 2026-10-31

Files: `src/sections/PipelineParallel.tsx`, `src/sections/ContextParallel.tsx`, `src/sections/ExpertParallel.tsx`.

Evidence read anonymously (no account token, no identifying header): shallow clones of Megatron-LM
`core_v0.20.0` (685fb8bd970185e9ac3283fe32a5d6667bf4b268), TorchTitan `v0.4.0`, DeepSpeed `v0.19.9`;
PyTorch `v2.15.0` `torch/distributed/pipelining/schedules.py` from raw.githubusercontent.com; arXiv PDFs at
the versioned ids the Cites carry, through pdftotext; NVIDIA H100 and NVLink pages, EC2 accelerated
computing specifications and the EC2 P6 page through WebFetch; venues on the publisher pages
(Crossref record 10.1145/3458817.3476209 for SC 2021, proceedings.neurips.cc for GPipe,
proceedings.mlsys.org for Korthikanti, jmlr.org/papers/v23/21-0998 for Switch). Every printed number
the page computes was recomputed with vite-node against `src/lib/` (Calculator C `evaluateLayout`,
`evaluateMoeGrid`, `routedExpertParameters`), and the section 10 schedule simulation was re-run at all
seven slider stops for all three schedules (idle time equals `(p - 1)/(v x m)` exactly; stage-1 peak 80
layers for 1F1B, 110 for interleaved v = 2, m x 20 for GPipe).

Cross-section conditions: no text in the three files contradicts "Cross-instance pricing" (all three
price EFA per GPU at 50 GB/s or per instance at 400 GB/s, NVLink per GPU at 450 GB/s), "ZeRO-2 under
gradient accumulation" (not discussed) or "Xid alert rule" (not discussed). Pinned versions match.

## PipelineParallel.tsx (section 10)

78 load-bearing claims checked; 73 CONFIRMED (every Megatron, TorchTitan, DeepSpeed and PyTorch line
range contains its evidence; every paper statement found at the cited section; every derived number
recomputed: 4.7%, 0.94%, 37.5% and 27.3%, 7 + 14 x 8 + 7, 855.6M, 5.26e12, 13.3 ms, 266 ms, 16.8 MB,
0.34 ms, 134 MB, 84 MB, 1.7 ms, 2.1 GB, 0.04 s, 0.21 s, 17.5 s, 17.0 s, 0.8 s, 0.16 s, 38.6 / 20.9 /
12.1 GB, 22.8 GB, 11.4 GB, 5.7 GB, 26.2 GB, 1.375 L).

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | GPipe Cite venue "preprint" | PipelineParallel.tsx:682 | STALE | https://proceedings.neurips.cc/paper/2019/hash/093f65e080a295f8076b1c5722a46aa2-Abstract.html ("Advances in Neural Information Processing Systems 32 (NeurIPS 2019)") | venue="NeurIPS 2019" |
| 2 | Korthikanti Cite venue "preprint" | PipelineParallel.tsx:1053 | STALE | https://proceedings.mlsys.org/paper_files/paper/2023/hash/80083951326cf5b35e5100260d64ed81-Abstract-mlsys2023.html ("Proceedings of Machine Learning and Systems 5 (MLSys 2023)") | venue="MLSys 2023" |
| 3 | DualPipe bubble `(PP/2 - 1)(F&B + B - 3W)` printed with F, B, W, F&B undefined | PipelineParallel.tsx:870 | prose rule (term undefined at first use) | 2412.19437v2 Table 2 caption defines all four | added the caption's definitions in one clause |
| 4 | Claims file: model state 21.0 GB at p = 2 | revamp/claims/pipeline.md:91 | WRONG (claims file only; the page renders 20.9 from Calculator C, 20.95 GB) | vite-node `evaluateLayout` | claims line corrected to 20.9 |
| 5 | Known item: narrow forward blocks at 390 px | PipelineParallel.tsx:336-475 | CONFIRMED legible | /tmp/lts-shots-fc04/pipeline-390-svg0.png: forward blocks about 9 px wide carry no number by design (`labelFits`), colour and legend identify them, backward blocks numbered, no collision or clip | none |
| 6 | PTD-P venue "SC 2021" | throughout | CONFIRMED | Crossref 10.1145/3458817.3476209, container "Proceedings of the International Conference for High Performance Computing, Networking, Storage and Analysis", 2021-11 | none |
| 7 | Llama 3 7 + 14 x 8 + 7 per pipeline rank | PipelineParallel.tsx:706 | CONFIRMED (derived) | 2407.21783v3 Sec 3.3.2 ("the first model chunk on the first stage has only the embedding") holds for any V x layers-per-chunk = 8, so the per-rank counts are 7, 8 and 7 whatever V is | none |
| 8 | Zero Bubble venue "preprint" | PipelineParallel.tsx:854 | CONFIRMED as preprint | the ICLR 2024 version is titled "Zero Bubble (Almost) Pipeline Parallelism" (OpenReview tuzTN0eIO5); the cited v1 is the preprint, so no venue set | none |

Score after fixes: **9/10.** Every code range and paper claim holds at the pin and every printed number
is computed from Calculator C or re-derived; only the venue badges and one undefined formula needed work.

## ContextParallel.tsx (section 11)

56 load-bearing claims checked; 53 CONFIRMED (Megatron overview L19, L29-L34, L32; guide L31 and
L182-L196; MoE README L160-L166 and L218-L222; parallel_state L713-L718; arguments L3186-L3191;
DeepSpeed layer.py L35-L37, L286-L288, L544-L547 and no replication path in the file; Ring Attention
Sec 3 and Table 2; Ulysses Sec 1 and 3.2; Llama 3 Tables 3 and 4, Secs 3.2 and 3.3.2; H100 1,979
TFLOPS with sparsity and 80 GB; NVLink 900 GB/s with the halving labelled ours; p5.48xlarge 8 H100 and
3,200 Gbps; 403 / 134 / 503 / 906 MB, 3.2 / 1.6 GB, (g + 1)/P; 2,199, 19,790, 275, 2,474, 880, 7.9K,
110, 990, 6.6x; memory table 38.0, 426, 41.3, 57.1 GB and 63.8 GB; steps 59.6 to 62.6 s and 42.5 to
46.9 s; bubbles 15% and 9.4%; CP traffic 601 GB, 1.503 s, 3.87%; 18.9 s and 38.9 s; about 6%).

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | "Linear layers and norms have no operations across tokens, so they run unchanged" cited to overview L34 | ContextParallel.tsx:511-515 | UNSUPPORTED at L34 (the statement is on L19; L34 carries only the memory half) | Megatron-LM core_v0.20.0 docs/user-guide/features/context_parallel.md#L19, #L34 | Cite now L19-L34, labelled "L19 and L34" |
| 2 | "the one measured step in this dive, on a single GB10, cost 14% to 16% more (sections 4 and 5)" | ContextParallel.tsx:900-903 | UNSUPPORTED (Tier 0 number with no Tier 0 Cite; "the one measured step" overstated, E3 and E4 also measured steps; unified-memory and model-shape caveat missing) | research/2026-10/E2-spark-step-time-recompute.md L3, L11-L13, L31 | reworded to "this dive's one measurement of it, on a single GB10 with unified memory and a 1B Llama-shaped model at 2,048 tokens", Tier 0 Cite to E2 added |
| 3 | Calculator "prices CP as Llama 3 runs it, one all-gather ... and one reduce-scatter of their gradients" | ContextParallel.tsx:793-796 | OVERREACH (Llama 3 Sec 3.3.2 describes only the forward all-gather; the backward reduce-scatter is Megatron's, overview L19) | 2407.21783v3 Sec 3.3.2; context_parallel.md#L19 | attribution narrowed to the forward all-gather |
| 4 | Ring Attention and Ulysses venues "preprint" | ContextParallel.tsx:582, 597 | CONFIRMED as preprint (no proceedings page confirmed in this pass) | OpenReview search returned only workshop and CoRR records for Ring Attention | none |

Score after fixes: **9/10.** Numbers, code lines and hedges hold; three citation-scope fixes.

## ExpertParallel.tsx (section 12)

64 load-bearing claims checked; 57 CONFIRMED (Megatron router.py L1105-L1114, transformer_config
L998-L1000, L1024-L1026, L3613-L3648, moe_utils L273 and L1097-L1102, parallel_state L946-L960,
model_parallel_config L551-L552, arguments L1392-L1401 and L1567-L1571, MoE README L160-L166,
L182-L197, L207-L216, L307-L313, L326-L327, L332-L336, L431, L433-L438, L524, L563-L564, guide
L166-L170 and L174-L180, combined_1f1b L54-L61; `--delay-wgrad-compute` needs the overlap, which needs
EP above 1 (transformer_config L3685-L3688); DeepSeek-V3 Secs 2.1.2, 3.1, 3.2, 3.2.1, 3.2.2, 4.2;
Switch Sec 2.2 and venue JMLR 23(120), 2022; Folding Sec 3.2; 57 / 115 / 172 KB, 12x, 10 MB, 29 KB,
9x, DP 128, EDP 2, 4.2 / 6.4 / 10.6 GB, 45.9 GB, 654.5B, 97.5%, 1,024 / 2,048 grid checks, 60 GB, 49
and 14 GB; section 25 title of the sibling dive).

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | FP8 dispatch, BF16 combine cited to "Section 3.3.4" | ExpertParallel.tsx:578 (and the source comment, L18) | WRONG (the paper has no Section 3.3.4; "Low-Precision Communication" is in 3.3.3) | 2412.19437v2 table of contents and Sec 3.3.3 | Cite label and comment now Section 3.3.3 |
| 2 | "each MoE layer runs four all-to-alls per step" | ExpertParallel.tsx:522 | WRONG (per micro-batch; a step with gradient accumulation or a pipeline runs it m times) | the section's own dispatch/combine count; 2006.16668v1 Figure 8 caption | "for every micro-batch" |
| 3 | GShard "an AllToAll to reshard tokens to experts and another to bring them back", Sec 3.3.2 | ExpertParallel.tsx:548-552 | UNSUPPORTED in part (Sec 3.3.2 covers only the dispatch resharding; the combine AllToAll is in Figure 8's caption) | 2006.16668v1 Sec 3.3.2; Figure 8 caption "MoE dispatch and combine represents cross-partition communication with AllToAll" | Cite now "Section 3.3.2 and Figure 8", accessed date set to the re-read |
| 4 | "at most M = 4 nodes" cited to Sec 2.1.2 | ExpertParallel.tsx:702-706 | UNSUPPORTED in part (2.1.2 defines M; the value 4 is in 4.2 and 3.2.2) | 2412.19437v2 Secs 2.1.2, 4.2 | Cite now "Sections 2.1.2 and 4.2" |
| 5 | "one P6e-GB200 UltraServer, whose 72 Blackwell GPUs share one NVLink domain" | ExpertParallel.tsx:733-738 | OVERREACH (the page says "up to 72 Blackwell GPUs within one NVLink domain" and lists a 36-GPU UltraServer) | https://aws.amazon.com/ec2/instance-types/p6/ | "one 72-GPU P6e-GB200 UltraServer, which puts up to 72 Blackwell GPUs in one NVLink domain"; accessed date set to the re-read |
| 6 | "The configuration rejects the overlap unless ..." (list read as complete) | ExpertParallel.tsx:934-941 | OVERREACH (further checks exist: shared-expert overlap off, MTP at most one layer, torch 2.6 or later) | transformer_config.py L3613-L3657 | "Among its checks, the configuration rejects ..." |
| 7 | Training script "warns when TP is above 1 together with the overlap" | ExpertParallel.tsx:946-948 | WRONG (incomplete: the condition is TP or CP above 1 on pre-Blackwell GPUs) | arguments.py L1379-L1380, L1392-L1401 | "when TP or CP is above 1"; "TP and CP want CUDA_DEVICE_MAX_CONNECTIONS=1" |
| 8 | GShard, Folding venues "preprint" | ExpertParallel.tsx:550, 767 | CONFIRMED as preprint (no proceedings page confirmed in this pass) | OpenReview search, no ICLR record returned for GShard | none |

Score after fixes: **9/10.** Two wrong section or scope statements and five citation-scope fixes, none of
which touched a computed number; every Calculator C figure matches the page.

## For the orchestrator (files outside this group)

- Korthikanti et al. (2205.05198v1) is confirmed MLSys 2023 on proceedings.mlsys.org; GPipe
  (1811.06965v5) is confirmed NeurIPS 2019 on proceedings.neurips.cc. Section 10 now carries those
  venues; Arithmetic.tsx, Collectives.tsx, MemoryBudget.tsx, SetMyRanks.tsx, TensorParallel.tsx,
  ThreeBudgets.tsx and TrainingStep.tsx still pass "preprint" for 2205.05198v1, so sources.md will list
  "MLSys 2023, preprint" until they agree.

## Orchestrator note applied (2026-10-31)

- 2205.05198v1 carries venue="MLSys 2023" on its one Cite in these files (PipelineParallel.tsx,
  KORTHIKANTI); ContextParallel.tsx and ExpertParallel.tsx do not cite it.
- ZeRO++ (2306.10209v1) is not cited in these files.
- 41 sbh / TorchTitan eager SwiGLU: no such attribution in these files or their claims lists; section 10
  uses 34 sbh, the fused-SwiGLU coefficient, and sections 11 and 12 use Calculator C's default (fused).
