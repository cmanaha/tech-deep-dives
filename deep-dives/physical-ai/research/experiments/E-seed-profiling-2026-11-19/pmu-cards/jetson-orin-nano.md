# PMU card v0: Jetson Orin Nano Super (tailnet jetson-ricky, hostname carlos-desktop)

Draft for the Physical AI profiling work.
Everything under "Measured" was read from the machine on 2026-11-18 over the home network. Later the same day the packages were upgraded and perf and hwloc installed (see System state).
Labels: [MEASURED] read from the box, [INFERRED] my derivation, [TODO] not yet done.

## Identity [MEASURED]

- Board: NVIDIA Jetson Orin Nano Engineering Reference Developer Kit Super.
- CPU: 6 x Cortex-A78AE, one core type. GPU: Orin integrated (`nvgpu`).
- Memory: 7.6 GB shared between CPU and GPU. Disk: 24 GB free of 57 GB.
- L4T R36.4.7 (JetPack 6 generation), kernel 5.15.148-tegra, CUDA 12.6, TensorRT 10.3, Python 3.10.12.
- Power mode: MAXN_SUPER. Idle board power about 4.8 W (tegrastats VDD_IN).
- Caches (lscpu): L1d 64K, L1i 64K, L2 256K (1.5M total), L3 2M (4M total), 64-byte lines.

## CPU counters [MEASURED]

- One PMU: `armv8_cortex_a78`, CPUs 0-5, 57 named events.
- Slot-based top-down events are listed: stall_slot, stall_slot_frontend, stall_slot_backend, op_retired, op_spec, br_mis_pred_retired, stall_backend_mem.
- The PMU reports slots = 0, so the kernel does not give slots-per-cycle. [MEASURED 2026-11-18] Derived it as (stall_slot + op_spec) / cpu_cycles = 6.000 on this box. The same derivation gives 10.0 and 5.0 on the DGX Spark's X925 and A725, matching what that kernel reports, so the method holds. Slots = 6 for the A78AE here.
- No Statistical Profiling Extension: `CONFIG_ARM_SPE_PMU is not set`.
- `perf_event_paranoid` is 2. Passwordless sudo works.
- perf: installed 2026-11-18 from Ubuntu `linux-tools-generic`. The `perf` wrapper refuses the tegra kernel, so call the binary directly: `/usr/lib/linux-tools-5.15.0-204/perf` (version 5.15.224). It reads the A78 PMU events on the tegra kernel. [MEASURED]
- hwloc installed. Topology [MEASURED]: two packages, 4 cores sharing one 2 MB L3 and 2 cores sharing a second 2 MB L3; one NUMA node, 7620 MB.

## TMA level 1: first capture [MEASURED]

Same formula as the DGX Spark card, slots = 6. Pure-Python integer loop (60M iterations), one thread pinned to cpu 2. Smoke test of the counters, not a physical AI workload.

| Core | Frontend | Backend | Retiring | Bad spec | IPC |
|---|---|---|---|---|---|
| A78AE (cpu 2) | 29.6% | 5.7% | 63.9% | 0.8% | 3.87 |

Raw: stall_slot 56,161,260,687; frontend 47,022,409,719; backend 9,138,850,968; op_retired 101,685,918,652; op_spec 102,955,248,849; cycles 26,519,419,560. Second run: inst_retired 98,277,245,522; cycles 25,404,711,102; stall_backend_mem 11,868,220; br_mis_pred_retired 9,146,586.

Reading [INFERRED]: on the same interpreter loop this core is front-end bound (about 30% of slots) where the Spark's X925 was back-end bound and its A725 mostly retiring. Because slots was derived from these same counters, the four categories summing to 100% is not an independent check here.

## System state [MEASURED 2026-11-18]

- 344 packages upgraded (apt upgrade, exit 0). No NVIDIA L4T, kernel, CUDA or TensorRT package was in the set. fwupd held back.
- Reboot flagged as required by libc6, network-manager, gnome-shell. Not rebooted yet.
- ssh, tailscaled, docker, ollama, nvargus-daemon active after the upgrade.

## GPU profiling layers

- Always-on counters [MEASURED]: `tegrastats` gives per-core CPU load and frequency, GPU load (GR3D_FREQ), RAM, temperatures, and power rails (VDD_IN, VDD_CPU_GPU_CV, VDD_SOC). `jtop` is installed. `nvidia-smi` exists but reports "Not Supported" / N/A for almost every field on this GPU, so it is not usable here.
- GPU sysfs [MEASURED]: `/sys/devices/platform/bus@0/17000000.gpu/` exposes `load`, `counters`, devfreq.
- Timeline [MEASURED present, TODO run]: Nsight Systems 2024.5.4 (`nsys`).
- Deep per-kernel [MEASURED present, TODO run]: Nsight Compute 2024.3.1 at `/usr/local/cuda/bin/ncu` and `/opt/nvidia/nsight-compute/2024.3.1/ncu`.
- The newer Nsight Compute on the DGX Spark lists chip `ga10b` as supported. That `ga10b` is the Orin GPU, and that the 2024.3.1 build here profiles it, are [INFERRED]; confirm by profiling one kernel.
- CUPTI 12.6 present (`libcupti.so.2024.3.1`). `trtexec` present for TensorRT timing.

## Differences from the DGX Spark that the card must show

- One core type here versus two there.
- No SPE here, so per-kernel memory latency sampling is not available on the CPU side.
- 7.6 GB shared memory versus 121 GB.
- GPU counters come from tegrastats and sysfs here, from nvidia-smi there.

## Gaps before this is a real card [TODO]

1. Reboot to finish the upgrade, then re-run the smoke test.
2. Run one GPU kernel under `ncu` to confirm it profiles the Orin GPU.
3. Check the slots = 6 value against Arm's documentation for the A78AE.
4. TMA levels 2 and 3, cache pressure over time.
5. Real workloads: policy inference under TensorRT, MuJoCo step, the SO-101 arm control loop.

## GPU kernel under Nsight Compute [MEASURED 2026-11-20]

Confirmed: `ncu` 2024.3.1 profiles the Orin GPU. It needs root, and under sudo it must still see the cuDSS path and the
user-site Python packages: `. ~/physical-ai-bench/env.sh` then
`sudo -n env LD_LIBRARY_PATH=$LD_LIBRARY_PATH PYTHONUSERBASE=/home/carlos/.local /usr/local/cuda/bin/ncu ...`.
Kernel: PyTorch float32 matmul 2048x2048 (`~/physical-ai-bench/gpu_kernel.py 2048`), report `~/physical-ai-bench/ncu-matmul.ncu-rep`, set `basic`.

- Kernel launched: `ampere_sgemm_128x128_nn`, compute capability 8.7.
- Duration 42.31 ms, SM frequency 306 MHz, Compute (SM) throughput 74.49%, Memory throughput 48.27%, achieved occupancy 33.10%.
- The 306 MHz clock is far below what an unprofiled run reaches (about 1,080 GFLOP/s unprofiled vs about 406 here) [INFERRED arithmetic].
  [TODO] Pin the GPU clock or check devfreq before comparing durations across machines.
