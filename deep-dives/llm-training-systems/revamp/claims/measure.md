# Claims: section 29, What to Measure in a Run

File: `src/sections/WhatToMeasure.tsx`. Re-opened on 2026-10-31 with plain `curl` (generic User-Agent, no personal data) into a fresh `/tmp` directory and read as text; Cites carry the default accessed date:
- TorchTitan v0.4.0: `torchtitan/observability/metrics.py`, `torchtitan/distributed/utils.py`, `torchtitan/components/optim/optim.py`, `torchtitan/tools/utils.py`, `torchtitan/distributed/parallelism_context.py`.
- Megatron-LM core_v0.20.0: `megatron/training/config/resilience_config.py`, `megatron/training/arguments.py`, `megatron/core/rerun_state_machine.py`.
- PyTorch v2.15.0: `torch/cuda/memory.py`, `docs/source/torch_cuda_memory.md`.
- DCGM v4.7.0 `dcgmlib/dcgm_fields.h`, and dcgm-exporter 4.8.4 `etc/default-counters.csv`.
- metaseq f7ffa5fd `projects/OPT/chronicles/56_percent_update.md`.
- NVIDIA DCGM User Guide feature overview (Profiling Metrics), NVIDIA Xid catalog (page "Last updated on Sep 09, 2026"; columns "Applies to H100" checked for Xid 48, 63, 64, 74, 79), and the EKS Best Practices Guide AI/ML observability page.

Not re-opened by this author: the arXiv papers (OLMo 2 v3, PaLM v5, OPT v4, Llama 3 v3, DeepSeek-V3 v2, MegaScale v1), which rest on wave 2 re-reads dated 2026-10-31 (W6-23 to W6-26, W1-35, W4-10) and the registers.

Calculator agreement: every tokens-per-second and MFU figure is computed at render time through `src/lib/runtime.ts` (`flopsPerToken`, `estimateRun`, `mfuFromThroughput`) with `DEFAULT_MFU` and `INSTANCES['p5.48xlarge'].denseBf16TflopsPerAccelerator` from `src/lib/presets.ts` (989.5 TFLOPS), so the page cannot drift from Calculator A. Rendered values: 8B 6N 8,215 (about 8,200), 70B 6N 935.0 (about 935), TorchTitan count at 8,192 tokens 6,834 and 822.1 (about 6,800 and 820), 4,000 tokens/s reads 19.48% (6N) and 23.41% (TorchTitan), TorchTitan count at 2,048 tokens 8,203 (about 8,200), FLOP-count gap at 8,192 tokens 20%. These match W6-9 (which used 989e12: 8,211 and 934.5) and the build-log condition "The default MFU".

Format: claim | source URL | register, wave 2 row or experiment. "NEW" marks a fact read at a fetched pinned source with no register row. "[our reading]" marks a synthesis the page labels as ours.

## Header and opening

- At 40% MFU, 6 FLOPs per parameter per token (full count, no attention) and the 989.5 TFLOPS dense BF16 peak, one H100 trains Llama 3.1 8B at about 8,200 tokens/s (h1, efficiency h2, efficiency body, reference table) | src/lib/runtime.ts + src/lib/presets.ts (Calculator A) | W6-9, T01-3, T01-14, build-log "The default MFU"
- 4,000 tokens/s for 8B reads as 19.5% MFU by 6N (h1, efficiency h2, body, table, ending) | src/lib/runtime.ts `mfuFromThroughput` | W6-9
- A rank is one training process per accelerator (definition) | none needed; dive glossary term | section 32 glossary
- Source versions in the h1 description: TorchTitan v0.4.0, Megatron Core core_v0.20.0, PyTorch v2.15.0, DCGM v4.7.0, read 2026-10-31 | register 07 pinned-sources table | 07 header

## Three layers of signal

- Three layers: model health (loss, gradient norm, NaN or Inf), job efficiency (tokens/s per accelerator, MFU, step-time shares), hardware health (Xid, ECC and row remapping, throttling, NVLink and EFA counters) [our reading; caption labels it] | register synthesis | W6-31, T07-36 to T07-41
- DCGM profiling fields read the hardware layer | https://github.com/NVIDIA/DCGM/blob/v4.7.0/dcgmlib/dcgm_fields.h#L2610-L2640 | T07-21
- Xid errors are the driver's numbered GPU error reports | https://docs.nvidia.com/deploy/xid-errors/analyzing-xid-catalog.html | T07-25
- Efficiency falling under a healthy loss points at the infrastructure; a loss spike under steady throughput points at model, data or silent hardware fault [our reading] | register synthesis | W6-31, T07-20 use-in-dive
- Megatron Core can re-run a suspect step to attribute an unexpected result | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/rerun_state_machine.py#L21-L30 | T07-20
- Diagram chips (thresholds 20% and 0.5, "straggler, section 19", "Xid 48, 74 or 79: out until reset or reboot", "silent fault: rerun it") restate the cited rows below; caption marks the diagram as our reading | rows below | W6-31
- TorchTitan's default log: global average and maximum loss, gradient norm, tokens/s per device, TFLOPS, MFU, data-loading share, peak memory with retry and OOM counts | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/observability/metrics.py#L509-L575 | T07-1, W6-10

## Job efficiency

- MFU definition and its denominator, deferred to section 4 by name | section 4 (`arithmetic`) | build-log
- Tokens/s per accelerator is the cross-run comparison; MFU inherits the vendor peak's assumptions [our reading] | follows from the definition | T07-2 use-in-dive
- TorchTitan per-device throughput = window tokens / (seconds x non_data_parallel_size), and non_data_parallel_size = cp x tp x pp | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/observability/metrics.py#L115-L135 ; https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/distributed/parallelism_context.py#L653-L655 | T07-2
- TorchTitan's H100 BF16 peak is hard-coded 989e12 | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/tools/utils.py#L109-L144 | T07-2
- TorchTitan omits mfu_percent when has_quantization (for example Float8) | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/observability/metrics.py#L131-L134 | T07-2
- An FP8 run divides by the FP8 dense peak (section 4) | section 4 (`arithmetic`) | build-log
- 70B at about 935 tokens/s by 6N | src/lib/runtime.ts | W6-9
- TorchTitan's count (non-embedding parameters plus attention, no causal discount) at 8,192 tokens: about 6,800 (8B) and 820 (70B); 4,000 reads as about 23% | src/lib/runtime.ts (`nonEmbedding`, `noDiscount`) | W6-9, build-log "The default MFU"
- At 2,048 tokens the counts nearly agree (about 8,200 for 8B), because attention's share grows with sequence length | src/lib/runtime.ts | NEW (our arithmetic through Calculator A)
- 40% is an assumption inside Llama 3 405B's measured 38% to 43% BF16 MFU on H100 | https://arxiv.org/abs/2407.21783v3 (Table 4) | T01-6, W1-35
- The two FLOP counts differ by 20% for 8B at 8,192 tokens; section 31 makes the comparison a bring-up rung | src/lib/runtime.ts; section 31 (`bring-up`) by name | NEW (our arithmetic)
- TorchTitan logs the data-loading share of the window | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/observability/metrics.py#L547-L549 | T07-1, T07-41
- EKS guide: above 20% of training time in data loading, optimise the pipeline | https://docs.aws.amazon.com/eks/latest/best-practices/aiml-observability.html | T07-29, T07-41, W6-17
- A synchronous step runs at its slowest rank's pace and the others book the wait as collective time, so the straggler is the rank with the longest compute [our reading]; section 19 adds the timing | section 19 (`resuming`) by name | T04-6, T04-15
- Megatron Core's log_straggler logs per-GPU throughput and is off by default | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/config/resilience_config.py#L32-L46 | T07-36
- MegaScale: MFU fell gradually over a run because some ranks launched the data-parallel reduce-scatter late, from irregular garbage collection and some PyTorch operations | https://arxiv.org/abs/2402.15627v1 (Sec 6.3) | T04-15, W4-10

## Model health

- OLMo 2, observing OLMo-0424 (the model before OLMo 2): gradient-norm spikes more frequent than loss spikes, larger ones often first; slow upward drift went with more spikes; the authors write that together these would lead to divergence at larger scale (fc11 fact check: the earlier wording attributed the observations to OLMo 2 and said they led to divergence); spike score = share of values 7 or more standard deviations from a rolling average of the last 1,000, on loss and gradient norm | https://arxiv.org/abs/2501.00656v3 (Sec 3) | T07-18, W6-23
- Large runs rolled back, skipped batches or lowered the learning rate; that needs checkpoints about 100 steps back and a loader that can skip a batch range (sections 18 and 19) | sections 18 (`checkpointing`), 19 (`resuming`) by name | T07-38
- PaLM 540B: about 20 loss spikes despite clipping; restart about 100 steps earlier, skip about 200 to 500 batches | https://arxiv.org/abs/2204.02311v5 (Sec 5.1); venue JMLR 2023, 24(240):1-113, https://jmlr.org/papers/v24/22-1144.html | T07-13, W6-25
- OPT-175B: divergence with FP16 loss scaler crashing to 0 and last-layer activation norm spiking; lowered learning rate and restarted | https://arxiv.org/abs/2205.01068v4 (Sec 2.5) | T07-14, W6-24
- OPT team notes: one 10% learning-rate cut stabilised gradient and activation norms | https://github.com/facebookresearch/metaseq/blob/f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7/projects/OPT/chronicles/56_percent_update.md#L43 | T07-15, W6-24
- Llama 3 405B: few loss spikes, no interventions for divergence | https://arxiv.org/abs/2407.21783v3 (Sec 3.4.1) | T07-16, W6-26
- DeepSeek-V3: no irrecoverable loss spikes, no rollbacks | https://arxiv.org/abs/2412.19437v2 (Introduction) | T07-17, W6-26
- TorchTitan's logger docstring says the gradient norm is after clipping | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/observability/metrics.py#L526 | T07-1, W6-10 (C07-3)
- TorchTitan's clip_grad_norm_ returns total_norm computed before clipping | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/distributed/utils.py#L534-L631 | T07-19
- A logged norm above the clip threshold is expected; a run of steps above it means clipping acts every step [our reading] | follows from the two rows above | T07-19 use-in-dive
- TorchTitan reduces a finite-loss flag with MIN across ranks, ANDs a finite gradient-norm check and asserts "Loss or gradient norm is not finite. Stopping before the update." | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/components/optim/optim.py#L163-L192 | T07-19, W6-11
- Megatron Core checks loss and gradients for NaN by default; --no-check-for-nan-in-loss-and-grad turns it off | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L2818-L2823 ; https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/config/resilience_config.py#L20-L29 | T07-20, W6-12
- Rerun state machine is on by default (rerun_mode "validate_results") | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/config/resilience_config.py#L20-L29 | T07-20
- Transient error: not reproducible on the same GPU; persistent: reproducible on the same GPU, not on a different one | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/rerun_state_machine.py#L60-L66 | T07-20
- Exit codes 16 (restart to disambiguate) and 17 (failed validation) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/rerun_state_machine.py#L36-L40 | T07-20
- The module calls itself experimental, alpha-level, not tested at scale | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/rerun_state_machine.py#L21-L30 | T07-20

## Memory

- max_memory_allocated is peak memory occupied by tensors; max_memory_reserved is peak memory held by the caching allocator, which contains the allocated blocks | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/cuda/memory.py#L526-L606 | T07-3
- num_alloc_retries counts failed cudaMalloc calls that forced a cache flush and retry | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/cuda/memory.py#L243-L318 | T07-3
- TorchTitan warns when num_alloc_retries > 0 | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/observability/metrics.py#L72-L95 | T07-1, T07-3
- A rising retry count is fragmentation building before an OOM [our reading] | follows from the retry definition | T07-3 use-in-dive
- Compare the peak with Calculator B in section 5 | section 5 (`memory`) by name | build-log
- Snapshot via _record_memory_history() and _dump_snapshot(...); pytorch.org/memory_viz runs locally and uploads nothing | https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/torch_cuda_memory.md#L1-L39 | T07-4
- The snapshot sees only PyTorch's allocator; NCCL allocates outside it | https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/torch_cuda_memory.md#L16-L19 | T07-4
- torch.cuda.device_memory_used reads raw device usage | https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/torch_cuda_memory.md#L97-L109 | T07-4
- EKS guide's Prometheus example computes total = memory_allocated + memory_reserved | https://docs.aws.amazon.com/eks/latest/best-practices/aiml-observability.html ("Prometheus and Grafana Example") | T07-30, W6-16
- That sum double counts and reads between one and two times the real footprint [our arithmetic from the definitions] | PyTorch memory.py L526-L606 | T07-30, C07-4

## Hardware health

- "GPU utilization" only says a kernel ran in the sample | https://docs.aws.amazon.com/eks/latest/best-practices/aiml-observability.html | T07-29, W6-15
- SM activity (1002) = ratio of cycles an SM has at least one warp assigned | https://github.com/NVIDIA/DCGM/blob/v4.7.0/dcgmlib/dcgm_fields.h#L2620-L2624 | T07-21
- NVIDIA: 0.8 or more necessary but not sufficient; below 0.5 likely ineffective | https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/feature-overview.html (Profiling Metrics) | T07-23, W6-15
- AWS: target 0.8 SM activity as a rule of thumb | https://docs.aws.amazon.com/eks/latest/best-practices/aiml-observability.html | T07-29, W6-15
- Warps waiting on memory requests count as active, so SM activity can read high while little arithmetic runs | https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/feature-overview.html (SM Activity) | T07-23
- Tensor activity (1004) = ratio of cycles any tensor pipe is active | https://github.com/NVIDIA/DCGM/blob/v4.7.0/dcgmlib/dcgm_fields.h#L2633-L2637 | T07-21
- Tensor activity is the closer view of busy matrix units; neither counter replaces MFU [our reading] | follows from the field definitions | T07-23 use-in-dive
- DCGM v4.7.0 renamed profiling fields (SM_ACTIVE to SM_UTIL_RATIO) and keeps the old names as deprecated aliases with the same IDs | https://github.com/NVIDIA/DCGM/blob/v4.7.0/dcgmlib/dcgm_fields.h#L3954 ; https://github.com/NVIDIA/DCGM/blob/v4.7.0/dcgmlib/dcgm_fields.h#L4174-L4176 | T07-22, W6-13
- Each Xid has an immediate and an investigatory resolution bucket; RESTART_APP, RESET_GPU, RESTART_BM, WORKFLOW_ buckets | https://docs.nvidia.com/deploy/xid-errors/analyzing-xid-catalog.html (Table 1, Resolution Buckets) | T07-25, W6-28
- Xid 48 (double-bit ECC, uncorrectable) is WORKFLOW_XID_48 and needs a GPU reset or node reboot; Xid 79 (fallen off the bus) is RESTART_BM | same | T07-25
- Xid table: 48 WORKFLOW_XID_48 / WORKFLOW_XID_48; 63 IGNORE / IGNORE; 64 RESET_GPU / CONTACT_SUPPORT; 74 WORKFLOW_NVLINK_ERR / CONTACT_SUPPORT; 79 RESTART_BM / CONTACT_SUPPORT; all five apply to H100; page last updated 2026-09-09 | same | T07-25, W6-28
- Xid 74 on several GPUs of one node points at one failed peer [our reading of the catalog's Xid 74 note] | same | T07-25
- Clock-event reasons are field 112, a bitmask, alias CLOCK_THROTTLE_REASONS | https://github.com/NVIDIA/DCGM/blob/v4.7.0/dcgmlib/dcgm_fields.h#L585-L592 | T07-26, W6-28
- Power and thermal violation time in ns are fields 240 and 241 | https://github.com/NVIDIA/DCGM/blob/v4.7.0/dcgmlib/dcgm_fields.h#L843-L855 | T07-26
- v4.7.0 marks 240 and 241 deprecated in favour of fields 1617 and 1618, counted in seconds | https://github.com/NVIDIA/DCGM/blob/v4.7.0/dcgmlib/dcgm_fields.h#L3644-L3652 | NEW (fc11 fact check)
- Llama 3 405B: mid-day temperatures acting on DVFS moved throughput 1% to 2% over the day | https://arxiv.org/abs/2407.21783v3 (Sec 3.3.4) | T04-6
- NVLink bytes sent and received are fields 1011 and 1012 | https://github.com/NVIDIA/DCGM/blob/v4.7.0/dcgmlib/dcgm_fields.h#L2676-L2690 | NEW
- NVLink CRC flit, CRC data, replay and recovery error totals are fields 409, 419, 429, 439 | https://github.com/NVIDIA/DCGM/blob/v4.7.0/dcgmlib/dcgm_fields.h#L4104-L4107 | NEW
- dcgm-exporter 4.8.4 lists those four as error counters for pre-Hopper GPUs, and lists the Hopper data-link CRC, recovery and replay totals, fields 497, 498, 499 | https://github.com/NVIDIA/dcgm-exporter/blob/4.8.4/etc/default-counters.csv#L66-L75, https://github.com/NVIDIA/DCGM/blob/v4.7.0/dcgmlib/dcgm_fields.h#L1718-L1731 | NEW (fc11 fact check)
- EFA device counters are covered in the EFA dive, section 17 | ../efa/ (Operations, Observability and Failure Modes) | cross-dive link

## Measurement table and alerts

- Table rows restate the claims above with the same sources; "No range" wherever a source gives none; tensor activity "No range located in the sources read" | rows above | W6-31
- Xid row range "RESET_GPU or RESTART_BM takes the node out; a WORKFLOW_ bucket sends you to that Xid's workflow in the catalog" [our reading] | Xid catalog | T07-25, W6-31 (fc11 fact check: the earlier "any bucket beyond RESTART_APP or IGNORE takes the node out" overreached; WORKFLOW_XID_45 resolves to RESTART_FM or IGNORE, and WORKFLOW_NVLINK_ERR treats some bits as ignorable)
- Alert set: sustained throughput drop, gradient-norm spike (7 SD over 1,000 steps), any NaN or Inf, SM activity below 0.5, data loading above 20%, any Xid whose immediate bucket asks for more than an application restart (RESET_GPU, RESTART_BM, or a WORKFLOW_ bucket such as Xid 48's and 74's) [our reading, labelled] | sources above | W6-31 (see note)
- dcgm-exporter 4.8.4's default set leaves out SM activity, the power and thermal violation counters and the ECC counters | https://github.com/NVIDIA/dcgm-exporter/blob/4.8.4/etc/default-counters.csv#L28-L107 | T07-24, W6-14
- Section 30 turns on what each AWS path leaves off; section 31 takes the first measured step | sections 30 (`telemetry`), 31 (`bring-up`) by name | dispatch notes

## Note for the fact checkers

W6-31 proposes naming the Xid alert "any Xid whose catalog bucket is RESET_GPU, RESTART_BM or CONTACT_SUPPORT". That list mixes the immediate and investigatory columns and misses Xid 48, whose buckets are WORKFLOW_XID_48 in both columns, and Xid 74's immediate WORKFLOW_NVLINK_ERR. The page names the immediate column instead: RESET_GPU, RESTART_BM or a WORKFLOW_ bucket.
- Xid 45 is logged whenever an application is aborted (Control-C, sigkill, GPU resets); WORKFLOW_XID_45 is RESTART_FM alone, IGNORE with other Xids | https://docs.nvidia.com/deploy/xid-errors/analyzing-xid-catalog.html | read 2026-10-31
