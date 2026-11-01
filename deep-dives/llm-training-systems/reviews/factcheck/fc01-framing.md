# Fact check fc01-framing (sections 1, 2, 3), 2026-10-31

Files: `src/sections/ThreeBudgets.tsx` (section 1, A Training Run Is Three Budgets), `src/sections/GettingStarted.tsx`
(section 2, Getting Started), `src/sections/TrainingStep.tsx` (section 3, One Training Step: What It Computes and
Keeps); claims lists `revamp/claims/three-budgets.md`, `revamp/claims/getting-started.md`, `revamp/claims/step.md`.

Evidence read anonymously (plain curl, no account token, no identifying header):
- arXiv PDFs at the versions the Cites carry, converted with pdftotext into `/tmp/lts-fc-fc01-papers/`: 2104.04473v5
  (PTD-P), 2407.21783v3 (Llama 3), 1910.02054v3 (ZeRO), 2205.05198v1 (Korthikanti), 2001.08361v1 (Kaplan),
  2204.02311v5 (PaLM), 2410.21680v2 (Meta reliability), 2205.14135v2 (FlashAttention), 1710.03740v3 (Mixed Precision
  Training), 1905.12322v3 (BF16 study).
- Code at the pins by raw.githubusercontent.com into `/tmp/lts-fc-fc01-code/`: TorchTitan v0.4.0
  `torchtitan/models/common/activation.py` and `torchtitan/models/llama3/model.py`; PyTorch v2.15.0
  `torch/distributed/checkpoint/state_dict_saver.py`; Megatron-LM core_v0.20.0 `docs/user-guide/features/dist_optimizer.md`;
  llama-models v0.2.0 `models/llama3/tokenizer.py` and `models/llama3_1/MODEL_CARD.md`.
- Pages into `/tmp/lts-fc-fc01-web/`: NVIDIA H100 and NVLink pages, EC2 `instancetypes/ac.html`, EC2 Capacity Blocks
  user guide, Hugging Face model metadata for Llama 3.1 405B, 8B and 70B at the pinned revisions, the JMLR page for
  PaLM (https://jmlr.org/papers/v24/22-1144.html, "24(240):1-113, 2023"), Crossref for PTD-P
  (https://api.crossref.org/works/10.1145/3458817.3476209: "SC '21").
- Owning sections' current files (already fact-checked): Arithmetic.tsx (4), MemoryBudget.tsx (5), Collectives.tsx (7),
  DataParallel.tsx (8), TensorParallel.tsx (9), FailureRates.tsx (17), AwsOwnership.tsx (20), AwsHardware.tsx (21),
  FrameworkMap.tsx (15), FineTuning.tsx (16), ChoosingPath.tsx (28), WhatToMeasure.tsx (29), BringUp.tsx (31),
  GlossaryAndSources.tsx (32 notation); SCOPE.md blocks 1 to 3; E1 and E2.

## ThreeBudgets.tsx (section 1)

Claims checked: 38 (the claims list's rows plus the venue badges and the diagram's figures). Non-CONFIRMED: 3, all fixed:
WRONG 1, OVERREACH 2. One citation aligned with section 7 (known item; the claim itself was supported).

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | PaLM Appendix B badge "preprint" | ThreeBudgets.tsx:618 | WRONG (venue) | https://jmlr.org/papers/v24/22-1144.html ("Journal of Machine Learning Research 24(240):1-113, 2023"; orchestrator known item) | venue="JMLR 2023" |
| 2 | TP all-reduces cited to PTD-P "Sections 2.3 and 3.3.2", where section 7 cites Sec 3.2 (known item) | ThreeBudgets.tsx:816-817 | CONFIRMED, cite aligned | 2104.04473v5 Sec 3.2 states all three parts: "two all-reduce operations each in the forward and backward pass", "twice each in the forward and backward pass for each layer", "per layer per device for each microbatch" (Sec 2.3 has the count without "per layer", Sec 3.3.2 the micro-batch frequency); Collectives.tsx:897-898 and :1246-1247 cite Sec 3.2 | Cite now "Section 3.2", as section 7; the DP "once per batch" cite stays Sec 3.3.2 (it says so verbatim). Source comment L22 updated |
| 3 | ZeRO-3 / FSDP "about 50% more communication volume than plain data parallelism" | ThreeBudgets.tsx:792-793 | OVERREACH (scope) | 1910.02054v3 Sec 1 ("a modest 50% increase in communication volume"), Sec 7.2.2 (two all-gathers plus one reduce-scatter per forward and backward, 3Ψ against 2Ψ); DataParallel.tsx:707-717 scopes the stage equalities to one micro-batch per step; build-log "FSDP2 collective counts" (k + 1 all-gathers with deferred sync) | "when each step is one micro-batch" added |
| 4 | "A framework that keeps 32-bit main gradients beside 16-bit weights pays 18 bytes per parameter" | ThreeBudgets.tsx:717-718 | OVERREACH (minor) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/dist_optimizer.md#L14-L20 (18 is the "bf16 parameters, fp32 gradients" row; the fp16 row is "fp16 parameters, fp16 gradients", 20) | "With BF16 (bfloat16) weights and 32-bit main gradients the count is 18 bytes per parameter"; source comment L41 says BF16 |

CONFIRMED (34), by group, each against its source and the owning section: 6 FLOPs per parameter per token (Kaplan
Sec 2.1 "C ≈ 6N"; PaLM App. B "2N for forward and 4N for backward"); 405,853,388,800 and 8,030,261,248 parameters (HF
`safetensors.total` at the pinned revisions); 15.6T tokens and 3.8e25 FLOPs (Llama 3 Sec 1); 6ND = 3.7988e25 = 3.80e25
(recomputed; matches section 4); 16 bytes = 2 + 2 + 12 (ZeRO Sec 3.1 "2Ψ + 2Ψ + KΨ = 16Ψ", K = 12); 128.48 GB, / 80 =
1.61 (recomputed; H100 page "GPU Memory 80GB"); quote "a single GPU failure may require a restart of the entire job" (Sec
3.3.4, verbatim); up to 16K H100 (Sec 3.3.1); 466, 47, 419 in a 54-day snapshot, 54 x 24 / 419 = 3.09 h; "higher than 90%
effective training time" (Sec 3.3.4; same wording as FailureRates.tsx:461-463); p5.48xlarge 8 x H100 and "3200 Gigabit"
EFA (ac.html); NVLink 900 GB/s per Hopper GPU, 450 per direction labelled our reading (NVLink page; Collectives.tsx:1043-1056
words it the same); 50 GB/s and nine times, labelled our arithmetic; "AWS does not state whether ... per direction" (same
as section 7); seven paths in three shapes and the script's three duties (AwsOwnership.tsx:1688-1689, 2075-2140); Capacity
Block 11:00 and 11:30 UTC (Capacity Blocks page, verbatim); 2 sbh with full recomputation (Korthikanti Table 2); E1 34.03,
41.03, 2.00 sbh (E1 table); "the expected 33%" (Korthikanti Sec 6.2; build-log "Recomputation price"); E2 +16.3% and
+14.2%, Llama 3.2 1B shape, 2,048 tokens, two runs (E2); 16/d (ZeRO Sec 5.3); 16.1 GB per GPU (recomputed); async_save
docstring (state_dict_saver.py L233-L234 at v2.15.0); DP all-reduce "once per batch" (PTD-P Sec 3.3.2); 38% to 43% BF16
MFU (Table 4, Sec 3.3.2); MTTF = (N_nodes r_f)^-1 with r_f per node-day (Meta Sec III); every section pointer. Venues:
ZeRO SC 2020 (confirmed list), Korthikanti MLSys 2023 (confirmed list), PTD-P SC 2021 (Crossref "SC '21"), Meta HPCA 2025
(the PDF's own header "2025 IEEE International Symposium on High-Performance Computer Architecture (HPCA)"); Kaplan and Llama
3 stay preprint. Diagram: every number appears in the prose; the caption labels the even spacing "illustrative, not measured".

Cross-section conditions: the 40% MFU assumption, the Llama 3 interruption figures, the Capacity Block edges, the
activation coefficients (no TorchTitan attribution in this file) and per-GPU framing of the nine-times ratio all match
their owners. No Xid, ZeRO-2 or Trainium MFU text in this file. Register IDs are not printed.

Gate 3 score after fixes: **9**. Every figure traces to the owning section and its source; one scope narrowing and one
venue badge were the only defects. Prose rules pass.

## GettingStarted.tsx (section 2)

Claims checked: 46 (the claims list's rows, the route lists against SCOPE.md section 2, and every pointer against the
section file it names). Non-CONFIRMED on the page: 2, both fixed: WRONG 1 (venue, on two Cites), OVERREACH 1.
Claims-file corrections: 2 (STALE 1, WRONG 1).

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | PaLM Appendix B badge "preprint" (two Cites) | GettingStarted.tsx:735, 787 | WRONG (venue) | https://jmlr.org/papers/v24/22-1144.html | venue="JMLR 2023" on both |
| 2 | "Collectives that combine data inside the instance first can spread their crossing over the instance's whole 400 GB/s" stated as fact | GettingStarted.tsx:847-849 | OVERREACH (hedge dropped) | Collectives.tsx:1088-1092 ("This split is our reading of the NCCL documentation and the AWS sample"); build-log "Cross-instance pricing" ("Labelled our reading; A1 (not yet run) would measure it") | "our reading, which section 7 sets out and prices" |
| 3 | Claims list: section 31 described "from its draft (being written)" | revamp/claims/getting-started.md | STALE (claims file) | BringUp.tsx:198 (rung 4 "Collective baseline", section 7), :773 and :798 (measured step against Calculator A, MFU as section 29 computes it) | Rows re-pointed to the committed file; the page's sentence (GettingStarted.tsx:968-970) holds |
| 4 | Claims list: "6ND ... expanded before the lists" | revamp/claims/getting-started.md | WRONG (claims file) | 6ND appears only inside section 4's title in the route lists; it is a formula, not an acronym | Claims row reworded |

CONFIRMED (44): reader profile and assumed background (SCOPE.md section 2, verbatim in meaning); 2 FLOPs per parameter
per token forward (PaLM App. B); sibling titles and numbers (silicon `App.tsx` ids roofline 3, hbm 6, communication 29;
EFA array positions 8 and 9; vLLM 9; SGLang 14); section 32 lists each term with its section and repeats the notation
(GlossaryAndSources.tsx:125-127, 268-286); the four idea cards (6 and 16 per parameter from PaLM and ZeRO Sec 3.1; 8.03
billion; 128.5 GB and 1.6; TP 8 x PP 4 x DP 8 = 256 = 32 x 8 on ac.html; all-reduce = reduce-scatter + all-gather, ZeRO
Sec 7.1 L729-L731 of the text; NVLink 900 and 450 our reading; 3,200 Gb/s = 400 GB/s, 50 per GPU, nine times our
arithmetic); the six stages and their contents (SCOPE.md section 2); TP inside every layer of every micro-batch,
DP and PP once per step or per micro-batch (AwsHardware.tsx:819-826, PTD-P Sec 3.2 and 3.3.2); three engines
(FrameworkMap.tsx:1322); Llama 3 interruption sentence (Sec 3.3.1 and 3.3.4); ownership differs per path (ChoosingPath.tsx
h1, AwsOwnership.tsx); three layers of signal (WhatToMeasure.tsx:251); restart ownership labelled our reading; calculator
wiring (CapacityCost.tsx:36 imports estimateRun and priceRun; parallelism.ts imports memoryBudget and runtime; Storage.tsx:13
imports checkpointPlan); routes identical to SCOPE.md section 2 (stops, extras, the one-of family, sections 19 and 29 to
31 on no route); each "ends on" line against its section's h1; the section 21 TP gloss quoted verbatim
(AwsHardware.tsx:821); every reason in "What each route keeps" against the section it names (section 9 h1, section 21 h1
including the p5.48xlarge count for 70B, DataParallel.tsx sharding-group h2, FineTuning.tsx h1, ChoosingPath.tsx:1001
"Capacity comes first"). Venue: ZeRO SC 2020. Diagram: generated from the same BANDS and ROUTES data as the lists; the
caption says "Compiled from the dive's own sections, not measured".

Gate 3 score after fixes: **9**. A survey whose every pointer matches the section it names; the one hedge it had dropped
is restored. Prose rules pass.

## TrainingStep.tsx (section 3)

Claims checked: 58 (the claims list's rows, the notation table against section 32 and SCOPE.md, and the diagram's
figures). Non-CONFIRMED: 7, all fixed: WRONG 3 (one venue on three Cites, one rounding, one notation clash), OVERREACH 1,
STALE 0, prose 3 (notation set, provenance line, two acronyms).

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | PaLM Appendix B badge "preprint" (three Cites) | TrainingStep.tsx:535, 551, 617 | WRONG (venue) | https://jmlr.org/papers/v24/22-1144.html | venue="JMLR 2023" on all three |
| 2 | 41.03 sbh tied to "the eager F.silu(gate) * up that the model code of TorchTitan v0.4.0 ... computes", with no word that TorchTitan compiles it by default (known item) | TrainingStep.tsx:681-697 | OVERREACH | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/llama3/model.py#L87-L89 (`local_compile_regions` default `["loss", "fused_binary_activation", "rope"]`); activation.py L34-L35 (`@local_compile("fused_binary_activation", ...)` on `BinaryActivationFn.__call__`) and L166-L177 (`return F.silu(gate) * up`); E1 L59 ("before any compilation ... Whether torch.compile brings TorchTitan to 34 was not tested"); MemoryBudget.tsx:1441-1449 (owner's wording) | Added "TorchTitan v0.4.0's Llama 3 config wraps that function in a torch.compile region by default [Cite L87-L89], and whether the compiled region stores 34 sbh or 41 was not tested" (TrainingStep.tsx:690-697), as section 5 says it |
| 3 | 8B activations "44.1 GB at 41 sbh" | TrainingStep.tsx:697 and :392 (table) | WRONG (derived from stated input) | 41 x 8,192 x 4,096 x 32 = 44.02e9 B = 44.0 GB; 44.06 GB is the measured 41.03 (E1 whole-model table), while the 34-sbh figure beside it, 36.5 GB, rounds the same at 34 or 34.03 | 44.0 GB in the prose and in the two-bills table |
| 4 | Notation table carries an 18th row, "bytes per parameter", absent from section 32's notation table and from SCOPE.md section 3's notation block (known item) | TrainingStep.tsx:487-500 (before) | prose / consistency | GlossaryAndSources.tsx:269-286 (17 symbols, N to w_cp); SCOPE.md section 3 block | Row removed, so the two tables list the same 17 symbols with the same meanings; its Megatron Cite and the 18-byte figure moved to the "Model state" line of "Your model's two bills" (TrainingStep.tsx:931-937), where the 18N figure had no Cite |
| 5 | "the same paper counts accelerators as n = p x t x d", where the notation table defines n as the ranks in one collective | TrainingStep.tsx:870 (after the reorder) | WRONG (notation clash in-file) | 2104.04473v5 Sec 3.1 uses n for the number of GPUs; the dive's n is section 7's | "counts the accelerators as p x t x d" |
| 6 | h1 provenance names only "papers, Meta's llama-models v0.2.0 and our DGX Spark run" while the section cites TorchTitan v0.4.0 code, Megatron Core core_v0.20.0 docs and NVIDIA and AWS pages | TrainingStep.tsx:497 | prose (authoring brief: name the pinned versions) | Cites at L50-L58 | "(papers, NVIDIA and AWS pages, TorchTitan v0.4.0, Megatron Core core_v0.20.0 and Meta's llama-models v0.2.0, read 2026-10-31, and our DGX Spark run)" |
| 7 | RMSNorm and SiLU unexpanded (in the expandable) | TrainingStep.tsx:739, 755 | prose (acronym rule) | glossary expansion for RMSNorm (GlossaryAndSources.tsx:171) | "RMSNorm, root mean square normalization"; "SiLU (sigmoid linear unit)"; report SiLU for the glossary |

CONFIRMED (51): 2N forward and 4N backward, two matmuls per forward matmul (PaLM App. B); gradients with respect to input
and weights (PTD-P Appendix, "gradients with respect to both input and weight"); 6N (Kaplan Sec 2.1); N = 8,030,261,248;
2N s = 1.32e14, 4N s = 2.63e14, 6N s = 3.95e14, 6N = 4.82e10 (recomputed); 0.997 s at 989.5 TFLOPS x 0.40 (recomputed);
1,979 TFLOPS BF16 with the "* With sparsity" footnote (H100 page); 38% to 43% and 430 TFLOPS at 43% (Table 4); 12LHQT
attention term (PaLM App. B "6LH(2QT)"), 1.29e10 per token, 5.00e14 (+27%) and 4.48e14 (+13%) (recomputed); 16 bytes
(ZeRO Sec 3.1); 128.5 GB and 1.6; sbh scaling (Korthikanti Sec 4.1); FlashAttention keeps the output and softmax statistics
(Sec 3.1); the 34 sbh derivation (12 + 4,096/h + 6F/h = 12 + 1 + 21; eager + 2F/h = 41; 70B 12 + 0.5 + 21 = 33.5, recomputed);
E1 conditions (one to four layers, random BF16 weights, allocator count, s = 2,048 to 8,192, b = 1 and 2, three attention
backends, 0.03 from FP32 per-row statistics, one run, PyTorch 2.15.0); 36.5 GB; 4.27 GB saved, 8.5 and 11.6 GB peaks,
gradients excluded (E1 head table); 165 GB, twice 80 (recomputed); p5.48xlarge eight H100 (ac.html); GPT-2 1.5B, 60 GB at
sequence 1K and batch 32, at least 24 GB (ZeRO Sec 3.1 and 3.2); buffers and fragmentation (Sec 3.2); B = b x m x d and m
(PTD-P Sec 3.1); 64 x 32 x 8,192 = 16.8M against "16M" (Table 4); L 32, h 4,096, 32 heads, 8 KV heads; 70B L 80, h 8,192
(Table 3); V = 128,256 (tokenizer.py L53 `num_reserved_special_tokens = 256`, L103 `n_words`) against Table 3's 128,000;
15T+ (MODEL_CARD.md L46); 18 bytes (Megatron table row "bf16 parameters, fp32 gradients"); mixed precision with an FP32
master (MPT Sec 3.1); FP16 10 mantissa bits and the 2,048 ratio (MPT Sec 3.1); BF16 (1, 8, 7) with FP32's range, no loss
scaling, an FP32 copy for the update (BF16 study Sec 3 and Table 1); 256 for BF16 labelled our arithmetic; 70B N =
70,553,706,496 (HF at revision 349b2ddb), 4.23e11, 3.47e15, 8.76 s, 1,128.9 GB and 14.1, 179.9 GB at 33.5 sbh (recomputed);
the diagram's bands (16.06, 16.06, 96.36, 36.51 GB) and its caption ("illustrative, not measured" for the update width and
the straight-line activations). Venues: ZeRO SC 2020, Korthikanti MLSys 2023, PTD-P SC 2021 (Crossref), Mixed Precision
Training ICLR 2018 (the PDF's own header "Published as a conference paper at ICLR 2018"); Kaplan, Llama 3, FlashAttention
and the BF16 study stay preprint (no venue confirmed in this pass).

Cross-section conditions: activation coefficient (34 / 41 eager / 2 sbh, TorchTitan compile hedge now matching section 5),
default MFU and the notation table (now the same 17 symbols as section 32) all hold.

Gate 3 score after fixes: **9**. All arithmetic recomputes from its stated inputs; the defects were a rounding, a
notation clash, a missing compile hedge and a venue badge.

## Reported to the orchestrator (files this group does not own)

- GlossaryAndSources.tsx glossary: the SwiGLU entry uses "SiLU" without an expansion; section 3 now expands it as "SiLU
  (sigmoid linear unit)", so the glossary may add SiLU.
- `revamp/build-log.md` section 1 row says section 1 cites "Megatron-LM (1909.08053v4)"; the file cites PTD-P
  (2104.04473v5), now Section 3.2 as section 7 does.

## Checks (after both passes)

- `pnpm --filter @tech-deep-dives/llm-training-systems typecheck`: `tsc --noEmit`, no errors.
- `pnpm --filter @tech-deep-dives/llm-training-systems lint`: `eslint src --ext .ts,.tsx --max-warnings 0`, no output.
- `pnpm --filter @tech-deep-dives/llm-training-systems test`: `Test Files  6 passed (6)`, `Tests  168 passed (168)`.
- Gates: no-ai-tells, pinned-refs, svg-a11y, pre-overflow all exit 0.
- Harness (`/tmp/lts-dist-fc01`, port 4701, `/tmp/lts-shots-fc01`): three-budgets, getting-started and step "ok" at
  1440 and 390 (one SVG each, no overlap, clip or overflow reported). No diagram was edited; two tables in section 3
  changed (one cell, one row removed).
