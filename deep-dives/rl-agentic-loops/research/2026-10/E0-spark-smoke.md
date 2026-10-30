# E0: GRPO smoke test on a DGX Spark (Tier 0)

**Date run:** 2026-10-30, two runs (16:34 and 16:39 UTC). **Result: PASS.** Both runs completed 20
GRPO steps with TRL's `GRPOTrainer` and vLLM in colocate mode on one GB10, with every metric logged.

**Question** (`RESEARCH-GUIDE.md` section 5, E0): can TRL's GRPO trainer with vLLM in colocate mode
train a 0.5B to 1.5B model on the DGX Spark, and where does the step time go?

Scripts and raw outputs: `E0-spark-smoke/` next to this file (`train.py`, `run.sh`,
`pip-freeze.txt`, `run1/`, `run2/`). Paths and host names from the machine are removed from the logs.

## Setup

**Hardware.** One NVIDIA DGX Spark: GB10, aarch64, Ubuntu 24.04, unified memory. vLLM reported
121.69 GiB of device memory. The machine is a live shared host: other services held about 70 GiB of
memory throughout (121.69 GiB device memory less 52.1 GiB `MemAvailable`), and `free` reported 52 GiB available before each run.

**Software** (exact versions from `pip freeze` in the run's virtual environment):

| Package | Version |
| --- | --- |
| trl | 1.16.0 |
| vllm | 0.28.0 (PyPI wheel `manylinux_2_28_aarch64`) |
| torch | 2.13.0+cu130 (CUDA runtime 13.0) |
| transformers | 5.22.1 |
| accelerate | 1.15.0 |
| datasets | 5.1.0 |
| flashinfer-python | 0.6.16.post3 |
| Python | 3.12.3 |

Install, in a fresh virtual environment with every cache inside the run directory:

```bash
python3 -m venv venv
./venv/bin/pip install --upgrade pip
./venv/bin/pip install "vllm==0.28.0" "trl[vllm]==1.16.0"
```

The install resolved in about three minutes with no build from source. NVIDIA's Unsloth container
(which pins `trl==0.26.1`) was not used.

**Model.** `Qwen/Qwen2.5-0.5B-Instruct` in bf16, full fine-tuning (no LoRA), the smallest model the
E0 design allows.

**Task and grader.** Fresh synthetic arithmetic generated from seed 0: "Compute (a + b) * c - d" with
a, b, c, d drawn from 2 to 30, and an instruction to put the final integer inside
`<answer></answer>` tags. Reward 1.0 when the tagged integer equals the target, else 0.0, in plain
Python (`correctness` in `train.py`). 2,000 prompts generated; 20 steps use 40 of them.

**Trainer configuration** (non-default values set in `train.py`; the rest are TRL 1.16.0 defaults,
read back from the trainer and stored in `run*/meta.json`):

| Setting | Value | Set or default |
| --- | --- | --- |
| `max_steps` | 20 | set |
| `per_device_train_batch_size` | 16 completions (2 prompts x 8) | set |
| `num_generations` | 8 | set (TRL default is also 8) |
| `max_completion_length` | 256 | set |
| `learning_rate` | 1e-6 | set |
| `temperature` | 1.0 | set |
| `use_vllm`, `vllm_mode` | True, `colocate` | set |
| `vllm_gpu_memory_utilization` | 0.12 | set (job ceiling) |
| `bf16` | True | set |
| `loss_type` | `dapo` | default |
| `beta` (KL coefficient) | 0.0 | default |
| `epsilon` (clip) | 0.2 | default |
| `scale_rewards` | `group` | default |
| `importance_sampling_level` | `token` | default |
| `steps_per_generation`, `num_iterations` | 1, 1 | default |
| `vllm_enable_sleep_mode` | False | default |
| `vllm_importance_sampling_correction` | True | default |

**Run command.** `run.sh` starts the training under `nice -n 10 timeout 2h` inside its own session
(`setsid`), and a watchdog in the same script samples `MemAvailable` every 10 seconds and stops the
run's own process group if it falls under 15 GiB. The watchdog never fired. Both runs used seed 0.

**Stage timing.** `train.py` wraps TRL's own methods with wall-clock timers (with
`torch.cuda.synchronize()` on entry and exit): `VLLMGeneration.generate` (generation),
`VLLMGeneration.sync_weights` (weight sync into the colocated vLLM engine), `_calculate_rewards`
(scoring), and `_generate_and_score_completions` (the whole preparation path). Training time per step is
the step's wall-clock minus the preparation path, so it holds the loss forward pass, the backward pass
and the optimizer step.

## Results

### Pass condition

| | Run 1 | Run 2 |
| --- | --- | --- |
| Steps completed | 20 of 20 | 20 of 20 |
| Exit code | 0 | 0 |
| Training wall-clock (20 steps) | 40.35 s | 41.26 s |
| Process start to exit | 180 s (includes model download and the first `torch.compile`) | 81 s (compile cache hit: "torch.compile took 0.12 s") |

### Where the step time goes

Medians over steps 2 to 20 (step 1 carries warm-up: 3.02 s and 2.60 s).

| Stage | Run 1 median | Run 2 median | Share of summed step time, run 1 | Run 2 |
| --- | --- | --- | --- | --- |
| Generation (vLLM, 16 completions) | 1.319 s | 1.341 s | 62.0% | 62.9% |
| Training (loss forward, backward, optimizer) | 0.604 s | 0.605 s | 29.9% | 29.5% |
| Other preparation (trainer-side log-probabilities for the vLLM mismatch correction, advantages) | 0.136 s | 0.136 s | 6.8% | 6.5% |
| Weight sync into vLLM | 0.017 s | 0.017 s | 0.9% | 0.8% |
| Scoring (Python reward) | under 0.001 s | under 0.001 s | under 0.1% | under 0.1% |
| **Step wall-clock** | **2.087 s** | **2.110 s** | | |

Step wall-clock ranged from 1.38 s to 2.19 s (run 1) and 1.59 s to 2.32 s (run 2) after step 1. Mean
completion length per step ranged from 124 to 164 tokens; single completions ran from 10 to 256 tokens;
up to 12.5% of a step's completions hit the 256-token cap (mean 4.4% and 5.0%).

The "other preparation" row is the extra forward pass TRL runs when vLLM generates: with
`vllm_importance_sampling_correction=True` (the default) the trainer recomputes the log-probability of
every sampled token, because "the distribution mismatch between vLLM and the training model can be large
and harm the training" (comment in `trl/trainer/grpo_trainer.py` at v1.16.0, in
`_generate_and_score_completions`).

### Memory

| | Run 1 | Run 2 |
| --- | --- | --- |
| `MemAvailable` before start | 53,359 MiB | 53,346 MiB |
| Lowest `MemAvailable` during the run (1 s in-process sampling) | 29,665 MiB | 28,874 MiB |
| Drop at the lowest point | 23,694 MiB | 24,472 MiB |
| `torch.cuda.max_memory_allocated` | 17.23 GiB | 17.89 GiB |
| `torch.cuda.max_memory_reserved` | 17.60 GiB | 18.54 GiB |

vLLM's own startup accounting (run 2, `gpu_worker.py` log line): "Free memory on device (49.35/121.69
GiB) on startup. Desired GPU memory utilization is (0.12, 14.6 GiB). Actual usage is 1.76 GiB for
consumed memory (weights + non-torch), 0.13 GiB for peak activation, and 0.27 GiB for CUDAGraph
memory." It then allocated "Available KV cache memory: 12.71 GiB", "GPU KV cache size: 1,110,640
tokens". Model weights took 0.93 GiB in vLLM. TRL passed `max_num_seqs` 16 and
`max_num_batched_tokens` 4096 to vLLM.

On unified memory the two ways of reading free memory disagreed: before run 1, `torch.cuda.mem_get_info()`
(read during the preflight; that output was not kept in the raw files) returned 11.9 GiB free of 121.7 GiB while `free` reported 52 GiB available; vLLM's startup line
reported 49.35 GiB free. The 0.12 fraction applied to the full 121.69 GiB (14.6 GiB), and vLLM started
without complaint. Per-process memory from `nvidia-smi --query-compute-apps` read zero for the run's
processes, so the table uses `MemAvailable` and PyTorch's counters.

### What the logs show beyond the pass condition

- **Zero-advantage steps.** The base model solved few items: mean reward 0.044 in both runs. In 9 steps
  (run 1) and 10 steps (run 2) of 20, both groups of 8 scored all zero, `frac_reward_zero_std` read 1.0
  and the loss was exactly 0.0: those steps produced no gradient. This is the mechanism behind the
  base-rate check (scope sections 7 and 22) observed on a live run.
- **vLLM and the trainer disagree slightly on the same weights.** The per-token log-probability
  difference between vLLM's sampling and the trainer's recomputation averaged 0.011 per step, with a
  largest single-token difference of 0.92 (run 1) and 1.14 (run 2); TRL's importance-sampling ratio
  ranged up to 2.80 and 2.86. TRL logs these as `sampling/sampling_logp_difference/*` and
  `sampling/importance_sampling_ratio/*`.
- **Policy entropy** (TRL's mean per-token entropy) stayed between 0.19 and 0.32 over the 20 steps.
- **Weight sync is cheap in colocate mode at this size**: 17 ms per step for 0.5B parameters in one
  process.

## What this run does not show

- Learning. Twenty steps at a learning rate of 1e-6 with a 4% base rate are a mechanism test; the reward
  did not move and was not expected to.
- Any model above 0.5B, any output longer than 256 tokens, vLLM sleep mode, LoRA, or server mode.
- Run-to-run variance beyond two runs with the same seed. Sampling is not bit-identical between them
  (10 against 9 zero-gradient steps).

## Implications for E1 and the dive

- E1 can run on this stack. At about 2.1 s per step for 16 completions of up to 256 tokens on a 0.5B
  model, a GRPO arm with the 24,000 rollouts of the GEPA paper's GRPO baseline would be 1,500 steps, or
  roughly 53 minutes of step time [derived: 24,000 / 16 = 1,500 steps x 2.1 s = 3,150 s], before any
  scaling to longer outputs or a larger model, which this run did not measure.
- The generation share (62% on a 0.5B model with short outputs) gives the dive's systems section a
  Tier 0 data point next to the published 72.1% for Skywork-OR1-32B (register 05, F05-42): different
  scale, same ordering of stages.
- Gate 1 check 4 is met: E0 ran and passed, so section 21 stays. E1 to E4 are out of scope for this
  build; section 21 presents E0's results and E1 as a protocol with its predictions.

## Host safety record

- Preflight at 16:30 UTC: five compute processes from other services, 52 GiB available (at least 40 GiB
  required). The same five processes were running after teardown.
- Everything the run wrote lived in one run directory: the virtual environment, `HOME`, `TMPDIR`,
  `HF_HOME`, the pip cache and the logs. No sudo, no service touched.
- Teardown at 16:42 UTC: the run directory was removed with one `rm -r` of that path, no process from the
  run remained, and `free` again reported 52 GiB available.
