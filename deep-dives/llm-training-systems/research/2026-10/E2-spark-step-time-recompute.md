# E2. Step time, the price of recomputation, and MFU against a measured denominator on one GB10

**Tier 0 evidence.** Ran 2026-10-31 on the DGX Spark (one NVIDIA GB10, 128 GB unified LPDDR5X at 273 GB/s, shared with other services). Two runs of the same script, minutes apart; both are reported.

**Feeds:** sections 4 (MFU and its denominator) and 5 (recomputation's price). **Tests:** T01-34 and T01-36 on current kernels. **Narrows:** U01-5 only in method; no H100, B200, H200 or Trainium2 number comes from this run.

## Software

- PyTorch 2.15.0+cu132 (CUDA 13.2), Python 3.12.3, aarch64, NVIDIA driver 580.159.03.
- Script: `spark-scripts/e2_steptime.py`, model code `spark-scripts/llama_layer.py` (TorchTitan v0.4.0-shaped layer, eager SwiGLU, `scaled_dot_product_attention` with `enable_gqa`; see E1).
- Model: Llama 3.2 1B's shape (h = 2,048, FFN 8,192, 32 heads, 8 KV heads, 16 layers, V = 128,256, tied embedding and output head), random initialisation. 1,235,814,400 parameters; 1,235,746,816 in matrix multiplications (the 16 layers' projections plus the tied head; the norms excluded).
- Precision: FP32 parameters with `torch.autocast(dtype=torch.bfloat16)`, gradients FP32, `torch.optim.AdamW(fused=True)` with FP32 moments: 16 bytes per parameter of model state, 19.8 GB.
- Batch: sequence 2,048, micro-batch 1, 4 accumulation micro-batches per optimizer step (8,192 tokens per step); gradient clipping at 1.0. Random token ids, so the loss stays near ln(128,256) = 11.76 and is not a learning signal.
- 50 optimizer steps per mode; the first 5 excluded from timing.
- Recomputation modes: none; full (every layer under `torch.utils.checkpoint`); selective at the operator level, TorchTitan's "op" style (a `create_selective_checkpoint_contexts` policy that saves the outputs of `mm`, `addmm`, `bmm` and the SDPA kernels and recomputes everything else).
- Denominator: GB10 has no published dense BF16 peak (RESEARCH-GUIDE section 5), so the script measures one. BF16 square GEMMs from 2,048 to 16,384 and three training-shaped GEMMs; the highest rate is the denominator.

## Results

Measured BF16 GEMM ceiling: 96.2 TFLOPS (run 1) and 97.3 TFLOPS (run 2), both at n = 12,288; training-shaped GEMMs reached 89 to 95 TFLOPS.

| Mode | Step time, run 1 / run 2 (s) | Tokens per second, run 1 / run 2 | Peak allocated (GB) | MFU, 6N only, run 1 / run 2 | MFU with causal attention FLOPs, run 1 / run 2 |
|---|---|---|---|---|---|
| No recomputation | 2.181 / 2.235 | 3,756 / 3,666 | 29.6 | 29.0% / 27.9% | 30.5% / 29.5% |
| Full recomputation | 2.536 / 2.552 | 3,230 / 3,210 | 24.3 | 24.9% / 24.5% | 26.3% / 25.8% |
| Selective (save matmul and attention outputs) | 2.428 / 2.413 | 3,374 / 3,396 | 26.0 | 26.0% / 25.9% | 27.4% / 27.3% |

MFU here is tokens per second x model FLOPs per token, divided by the measured GEMM ceiling, not by a vendor peak. Model FLOPs per token: 6 x N_mm = 7.41e9; with attention added as 6Lhs (causal) it is 7.82e9, as 12Lhs (no causal discount) 8.22e9 (01 W6's term).

Price of recomputation [derived from the table]:
- Full: +16.3% (run 1) and +14.2% (run 2) step time, for 5.4 GB less peak memory (29.6 to 24.3 GB).
- Selective: +11.3% and +8.0% step time, for 3.7 GB less (29.6 to 26.0 GB).

## Verdict against the prediction

**Prediction not met; SCOPE NARROWER for the page.** RESEARCH-GUIDE section 5 predicted that full recomputation adds 25% to 40% to step time (T01-34, T01-36). On this run it added 14% to 16%. Two reasons, both [our reading], neither isolated by the experiment:

1. Full recomputation adds one forward pass of the layers, about a third more layer FLOPs, but the step contains work that is not recomputed: the tied output head and FP32 cross-entropy over 128,256 classes, the embedding, gradient clipping and the AdamW update over 1.24B FP32 parameters.
2. At 28% to 30% of the measured GEMM ceiling the step is far from compute-bound on this host; part of the step time is memory traffic on 273 GB/s unified memory, which a recomputed forward adds less of than it adds FLOPs.

What the page can say: the FLOP cost of full recomputation is about 33% (T01-34, T01-37); the step-time cost measured on one GB10 for a 1B Llama-shaped model at 2,048 tokens was 14% to 16%; the papers' 25% to 40% is from their own models and GPUs. The selective mode bought back 70% of full recomputation's memory saving for 55% to 70% of its time cost on this model, which is a worse trade than the papers report for Megatron's attention-only selective recomputation, because with FlashAttention-style kernels the attention core is never stored in the first place (T01-38), so an "op" policy here can only drop pointwise intermediates.

## The denominator lesson (section 4)

The same run reports 29% "MFU" against the measured GEMM ceiling. Against any larger denominator it would report less, and NVIDIA publishes no dense BF16 figure for GB10 to divide by. The page uses this to show why MFU is defined against a stated dense peak and why a run's MFU is only comparable to another computed against the same denominator and the same FLOP count (6N alone, or 6N plus attention, which here moves MFU by 1.5 points).

## What transfers

The recomputation trade's direction and the memory saved per mode are properties of the model code. The percentages are properties of this GPU, this memory system and this small model at 2,048 tokens; on an H100 at 8,192 tokens the attention and layer matmuls dominate more of the step, which pushes the full-recomputation price toward its FLOP cost. A2 (on hold) would measure it on H100.

## Host safety record

Preflights (UTC 18:46:57 and 19:00:22): 53 GB available each time. The experiment's own peak allocation was 29.6 GB; the watchdog's lowest reading of available memory was 22 GB in both runs, above the 15 GB kill line. Exit code 0 for both runs. Run time about 6.5 minutes each.
