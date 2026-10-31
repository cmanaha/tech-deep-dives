# E1. Activation memory per Llama 3.1 8B layer, measured on the DGX Spark

**Tier 0 evidence.** Ran 2026-10-31 on the DGX Spark (one NVIDIA GB10, compute capability 12.1, 128 GB unified memory shared with other services). One run; the measurement is the CUDA caching allocator's byte count, which is deterministic for a fixed program, so repeats were not needed for the coefficients.

**Closes:** U01-11 (Llama activation coefficient measured) and the measurement half of U02-12. **Narrows:** U02-8 (formula against measured memory): the per-layer saved-tensor formula is exact; the transient peaks around the output head are not in the formula.

## Software

- PyTorch 2.15.0+cu132 (CUDA 13.2) from the PyTorch cu132 wheel index, Python 3.12.3, Ubuntu 24.04.4, aarch64, NVIDIA driver 580.159.03.
- Model code: `spark-scripts/llama_layer.py`, a plain-PyTorch Llama decoder layer shaped like TorchTitan v0.4.0's (commit 45e33cd413b64cb37a7840cfd3c9765d3c639ae1): `nn.RMSNorm`, separate Q, K, V and output projections, RoPE through complex multiply, `scaled_dot_product_attention(is_causal=True, enable_gqa=True)` (TorchTitan v0.4.0 `models/common/attention/attention.py` passes `enable_gqa`), and a SwiGLU MLP.
- Two SwiGLU variants. **Eager**: `F.silu(gate) * up`, which is what TorchTitan v0.4.0's `models/common/activation.py` computes (`return F.silu(gate) * up`). **Fused**: a custom autograd function that saves only `gate` and `up` and recomputes SiLU in the backward pass, which is what a fused SwiGLU kernel stores.
- Random BF16 weights (normal, std 0.02), no checkpoint download.
- Script: `spark-scripts/e1_activations.py`. Runner: `spark-scripts/run_exp.sh` (nice 10, timeout 2 h, own process group, memory watchdog every 30 s).

## Shape and method

Llama 3.1 8B layer: h = 4,096, FFN 14,336, 32 query heads, 8 KV heads (T01-1). For k = 1, 2 and 4 layers, sequence s = 2,048, 4,096 and 8,192 and micro-batch b = 1 and 2: build the layers, record `torch.cuda.memory_allocated()` after the input exists (m0), run the forward pass, record it again (m1). The saved activations are m1 minus m0; the per-layer figure is the slope over k, which cancels the input. Then the backward pass runs on `y.float().sum()`. With full activation checkpointing each layer runs under `torch.utils.checkpoint.checkpoint(use_reentrant=False)`.

The coefficient is the saved bytes per layer divided by s x b x h, the unit 01 W3 uses.

## Results

| SwiGLU | Recomputation | Attention backend | Saved per layer, s = 8,192, b = 1 | Coefficient (bytes / sbh) | 01 W3 prediction |
|---|---|---|---|---|---|
| Fused (saves gate and up) | none | FlashAttention | 1.1420 GB | **34.03** | 34.0 |
| Eager (TorchTitan v0.4.0's `F.silu(gate) * up`) | none | FlashAttention | 1.3768 GB | **41.03** | 41.0 (the unfused variant W3 names) |
| Eager | none | cuDNN attention | 1.3768 GB | 41.03 | 41.0 |
| Eager | none | memory-efficient attention | 1.3768 GB | 41.03 | 41.0 |
| Either | full (per layer) | FlashAttention | 0.0671 GB | **2.00** | 2 |

The coefficient is the same at every sequence length (2,048, 4,096, 8,192) and both micro-batch sizes: saved activations are linear in s x b, with no s-squared term, because every SDPA backend on this GPU stores the attention output and a per-row log-sum-exp rather than the s x s matrix. The extra 0.03 sbh over W3's figures is the FP32 per-row statistics W3 ignored (log-sum-exp and the RMSNorm reciprocals).

Full table (all 26 configurations): `spark-raw/e1_results.json`.

### Whole-model figures for Llama 3.1 8B at s = 8,192, b = 1 [derived from the measured per-layer bytes x 32 layers]

| Setting | Measured per layer | 32 layers | 01 W4 |
|---|---|---|---|
| Fused SwiGLU, no recomputation | 1.142 GB | 36.54 GB | 36.51 GB |
| Eager SwiGLU, no recomputation | 1.377 GB | 44.06 GB | not in W4 |
| Full recomputation, stored inputs | 0.067 GB | 2.15 GB | 2.15 GB |

### The output head and FP32 logits

Final RMSNorm plus an output projection of V = 128,256 (BF16 weights), logits cast to FP32, then cross-entropy, one sequence:

| s | Saved after forward | Peak during forward | Peak during backward (gradients excluded) | 4 x s x V (W4's FP32 logits) |
|---|---|---|---|---|
| 2,048 | 1.07 GB | 2.12 GB | 2.10 GB | 1.05 GB |
| 4,096 | 2.13 GB | 4.24 GB | 5.25 GB | 2.10 GB |
| 8,192 | 4.27 GB | 8.47 GB | 11.56 GB | 4.20 GB |

The saved bytes match W4's 4.20 GB plus the 2sbh norm input. The transient peak is the finding: at 8,192 tokens the head and loss reach 8.5 GB during the forward pass (the FP32 logits and the log-softmax output exist together) and 11.6 GB during the backward pass, 2.75 times the saved figure.

## Verdict against the prediction

PASS. RESEARCH-GUIDE section 5 predicted "within 10% of 34.0 sbh per layer without checkpointing and about 2sbh per layer with it; logits 4.2 GB per 8K sequence". Measured: 34.03 sbh with a fused SwiGLU, 2.00 sbh with full checkpointing, 4.27 GB saved for the logits. Two qualifications the page must carry:

1. **The coefficient depends on the SwiGLU implementation.** Eager PyTorch, which is what TorchTitan v0.4.0's model code computes before any compilation, stores 41.0 sbh per layer, 21% above the fused figure. Whether `torch.compile` brings TorchTitan to 34 was not tested.
2. **The logits' peak is not their saved size.** A memory budget that adds 4.2 GB of FP32 logits per 8K sequence undercounts the peak by up to 7 GB on this code path; fused or chunked cross-entropy (U01-6, closed by wave 2 W1) is what removes it.

## What the dive uses

- Section 5 and Calculator B: activation coefficient 34 sbh (fused SwiGLU) with 41 sbh (eager) as the other setting, each labelled with this experiment; full recomputation stores 2 sbh per layer; the logits' transient peak named next to the 4.2 GB.
- Section 14: Calculator C inherits the same coefficients.
- Transfer to H100: the coefficients are byte counts of saved tensors, set by the model code and PyTorch version, not by the GPU; they transfer. Peak memory on another GPU also depends on the allocator's fragmentation and on kernel workspaces, which this experiment does not measure.

## Host safety record

Preflight before the run (UTC 18:45:07): 53 GB available, five GPU processes belonging to other services. Watchdog log: available memory never fell below 46 GB; no kill. Exit code 0. Run time 1 min 30 s.
