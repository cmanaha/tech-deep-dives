# PMU card v0: DGX Spark (spark-150b)

Draft for the Physical AI profiling work.
Everything under "Measured" was read from the machine on 2026-11-18. Nothing was installed or changed.
Labels: [MEASURED] read from the box, [INFERRED] my derivation, [TODO] not yet done.

## Identity [MEASURED]

- CPU: 20 cores, two core types. Cortex-X925 on CPUs 5-9 and 15-19, Cortex-A725 on CPUs 0-4 and 10-14.
- GPU: NVIDIA GB10, driver 580.159.03. `nvidia-smi` reports memory as N/A (unified memory).
- Memory: 121 GB unified. Disk: 3.0 TB free of 3.6 TB.
- Kernel 6.17.0-1026-nvidia, CUDA 13.0, Python 3.12.3.
- Caches (lscpu): L1d 64K, L1i 64K, L2 512K (25M total), L3 8M (24M total), 64-byte lines.

## CPU counters [MEASURED]

- Two PMUs, one per core type: `armv8_pmuv3_1` (X925, slots = 10) and `armv8_pmuv3_0` (A725, slots = 5). 78 named events.
- Slot-based top-down events present: stall_slot, stall_slot_frontend, stall_slot_backend, op_retired, op_spec, br_mis_pred_retired, stall_backend_mem.
- Statistical Profiling Extension present (`arm_spe_0`) with load, store and branch filters and min_latency.
- perf 6.17.13 installed. `perf_event_paranoid` is 4, so perf needs sudo; passwordless sudo works.
- Events must be addressed per PMU and pinned to a matching CPU. Asking the X925 PMU for CPU 10 returns nothing.

## TMA level 1: formula and first capture

Formula used [INFERRED, simplified from Arm's top-down method; not yet checked line by line against Arm's telemetry spec]:

- slots = cpu_cycles x slots_per_cycle
- frontend bound = stall_slot_frontend / slots
- backend bound = stall_slot_backend / slots
- retiring = (1 - stall_slot / slots) x (op_retired / op_spec)
- bad speculation = (1 - stall_slot / slots) x (1 - op_retired / op_spec)

First capture [MEASURED]: a pure-Python integer loop, one thread, pinned. This is a smoke test of the counters, not a physical AI workload.

| Core | Frontend | Backend | Retiring | Bad spec | IPC |
|---|---|---|---|---|---|
| X925 (cpu 5) | 5.7% | 35.0% | 57.3% | 1.9% | 5.80 |
| A725 (cpu 0) | 3.0% | 6.7% | 88.2% | 2.0% | 4.44 |

Raw X925: stall_slot 9,423,332,816; frontend 1,316,647,789; backend 8,106,685,027; op_retired 13,274,479,287; op_spec 13,725,215,454; cycles 2,314,855,107; inst_retired 13,417,215,623; stall_backend_mem 3,919,915.
Raw A725: stall_slot 1,554,197,279; frontend 478,022,525; backend 1,076,174,754; op_retired 14,072,096,304; op_spec 14,391,640,420; cycles 3,189,167,971; inst_retired 14,165,908,029; stall_backend_mem 5,193,791.

Reading [INFERRED]: the four categories sum to about 100% on both core types, so the formula is self-consistent here. The wide core leaves a third of its slots idle on this loop while memory stalls are negligible, which points at core-bound, not memory-bound, back-end stalls.

## GPU profiling layers

- Always-on counters [MEASURED]: `nvidia-smi` returns utilization, power (10 W idle), temperature, graphics clock (2392 MHz). Memory clock and memory used are N/A. nvtop is installed.
- Timeline [MEASURED present, TODO run]: Nsight Systems 2025.3.2 (`nsys`).
- Deep per-kernel [MEASURED present, TODO run]: Nsight Compute 2025.3.1 at `/usr/local/cuda/bin/ncu` (not on the non-login PATH). Metric sets: basic (213 metrics), detailed (906), full (7,794). Sections include SpeedOfLight roofline charts including a tensor roofline, MemoryWorkloadAnalysis, WarpStateStats, PmSampling, SchedulerStats.
- Supported chip list includes `gb10b` [MEASURED]. That this is the Spark's GB10 is [INFERRED]; confirm by profiling one kernel.
- CUPTI 13.0 present (`libcupti.so.2025.3.1`), for a custom collector.
- DCGM (`dcgmi`) and `trtexec` are not installed.

## Gaps before this is a real card [TODO]

1. Run one GPU kernel under `ncu` to confirm the GB10 is profiled and which sections populate.
2. TMA levels 2 and 3 (memory-bound split by cache level, core-bound split) from the remaining 78 events.
3. SPE capture for per-kernel memory hotspots and latency.
4. Cache pressure over time for L1, L2, L3.
5. Topology picture with hwloc (cores, caches, the two core types).
6. Arithmetic intensity and a roofline point for one workload.
7. Replace the Python smoke test with real workloads: MuJoCo step, policy inference, a render frame.

## GPU kernel under Nsight Compute [MEASURED 2026-11-20]

Confirmed: `ncu` profiles the GB10. It needs root (`sudo -n /usr/local/cuda/bin/ncu`); without it, ERR_NVGPUCTRPERM.
Kernel: PyTorch float32 matmul 4096x4096 (`~/physical-ai-bench/gpu_kernel.py 4096`), report `~/physical-ai-bench/ncu-matmul.ncu-rep`, set `basic`.

- Kernel launched: `cutlass_80_simt_sgemm_128x128_8x4_nn_align1`, compute capability 12.1.
- Duration 8.35 ms, SM frequency 2.13 GHz, Compute (SM) throughput 70.49%, Memory throughput 50.47%, achieved occupancy 16.62%.
- That is about 16,500 GFLOP/s for this kernel (2 x 4096^3 / 8.35 ms) [INFERRED arithmetic].
