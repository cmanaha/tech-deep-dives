# E3. FSDP2 collectives per optimizer step under gradient accumulation

**Tier 0 evidence.** Ran 2026-10-31 on the DGX Spark's CPU (no GPU used): two processes on one host, gloo backend, launched by `torchrun --nproc_per_node 2`; repeated in one process with PyTorch's fake process group (world size 2), which gave identical counts. Single host, no network: the experiment counts calls, it does not time them.

**Closes:** U03-1 (FSDP2 all-gather count under deferred reduction). **Confirms:** T03-2 and T03-3 at PyTorch 2.15.0. **Feeds:** U07-1 (flight-recorder coverage per step).

## Software

- PyTorch 2.15.0+cu132, Python 3.12.3, aarch64.
- Script: `spark-scripts/e3_fsdp_counts.py`. It replaces the `torch.distributed` functions FSDP2 calls with counting wrappers. At 2.15.0 FSDP2 issues its collectives through `dist.all_gather_single` and `dist.reduce_scatter_single` (`torch/distributed/fsdp/_fully_shard/_fsdp_collectives.py`, classes `DefaultAllGather` and `DefaultReduceScatter`); a first run that wrapped only `all_gather_into_tensor` and `reduce_scatter_tensor` counted zero, which is how the call path was found.
- Model: `nn.Sequential(Linear, 4 x Block, Linear)`, each Block (two Linear layers with a residual) wrapped with `fully_shard`, then the root wrapped: 5 FSDP units, the root holding the first and last Linear. AdamW. 4 micro-batches per optimizer step; counts taken on the second step.

## Results (per optimizer step, 4 micro-batches)

| Setting | All-gathers per micro-batch | Reduce-scatters per micro-batch | All-gathers per step | Reduce-scatters per step |
|---|---|---|---|---|
| Default (`fully_shard` defaults) | 9, 9, 9, 9 | 5, 5, 5, 5 | 36 | 20 |
| `set_requires_gradient_sync(False)` on micro-batches 1 to 3 | 9, 9, 9, 9 | 0, 0, 0, 5 | 36 | 5 |
| That plus `set_reshard_after_backward(False)` on micro-batches 1 to 3 | 9, 4, 4, 4 | 0, 0, 0, 5 | 21 | 5 |

No collective ran in `optimizer.step()`. gloo and the fake process group gave the same numbers.

Reading the counts per unit. Default, per micro-batch: 5 forward all-gathers (one per unit) plus 4 backward all-gathers (the 4 non-root units; FSDP2 does not reshard the root after the forward pass, so the root is not gathered again), and one reduce-scatter per unit. So at defaults each non-root unit is all-gathered twice and reduce-scattered once on every micro-batch. With both deferral settings, the first micro-batch is unchanged (9), and every later one skips the forward all-gathers (the parameters stayed unsharded after the previous backward pass) but repeats the 4 backward all-gathers, because `reshard_after_forward=True` still reshards after each forward pass.

## Verdict against the prediction

PASS. Predicted "two all-gathers and one reduce-scatter per micro-batch per FSDP unit by default, and 03 W1's count with deferral". 03 W1 assumed that with deferral each non-first micro-batch skips its forward all-gather but repeats the backward one, giving k + 1 all-gathers per unit for k micro-batches: measured 2 + 1 + 1 + 1 = 5 = k + 1 per non-root unit at k = 4. Section 8's 156 GB (9 all-gathers and 1 reduce-scatter at k = 8) and its 373 GB at defaults (16 all-gathers and 8 reduce-scatters) rest on counts this run confirms.

## Derived uses [derived from the per-unit counts above]

- Gradient sync off alone (no `set_reshard_after_backward(False)`) removes reduce-scatters only: for section 8's 8B example at k = 8 that is 16 all-gathers and 1 reduce-scatter, 17 x 15.56 = 264.5 GB per step across EFA in flat FSDP, between the 373 GB default and the 156 GB with both settings.
- Collectives per step for a model with L FSDP-wrapped layers plus a root, at defaults, k micro-batches: (2L + 1) x k all-gathers plus (L + 1) x k reduce-scatters. For Llama 3.1 8B (L = 32) at k = 8: 520 + 264 = 784 FSDP collectives per step; for 70B (L = 80) at k = 8: 1,288 + 648 = 1,936. PyTorch's flight recorder keeps the last 2,000 collectives by default (T07-8), so it holds about 2.5 steps of the 8B job and about one step of the 70B job (U07-1), counting FSDP's collectives only.

## What transfers

The counts are set by FSDP2's scheduling logic, not by the backend or the device, so they hold on NCCL over NVLink and EFA at PyTorch 2.15.0. Timing and overlap do not come from this run.

## Host safety record

Preflight (UTC 18:53:53): 52 GB available. Peak use was under 1 GB of host memory. Exit code 0 for both runs (gloo and fake). The first gloo run, with the wrong function names wrapped, also exited 0 and is kept only as the reason the wrapper list grew.
