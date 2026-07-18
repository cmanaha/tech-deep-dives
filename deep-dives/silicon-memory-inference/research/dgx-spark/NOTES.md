# Tier 0 Experiment Log — DGX Spark hardware capture

- Host: spark-150b (NVIDIA_DGX_Spark, DMI sys_vendor NVIDIA)
- Access: SSH over Tailscale (100.98.194.87), captured 2026-07-18 (device local time 2026-07-17 22:45 PT)
- Method: read-only inspection. Installed `hwloc` via apt (only mutation made to the device). Commands: `lstopo --of svg`, `lstopo-no-graphics`, `lscpu`, `cat /proc/cpuinfo`, `free -h`, `cat /proc/meminfo`, `nvidia-smi`, `nvidia-smi -q`, `nvidia-smi topo -m`, `lspci -nn`, `cat /etc/os-release`, DMI product name.
- Artifacts in this directory: spark-topology.svg (lstopo render), lstopo.txt, lscpu.txt, cpuinfo.txt, free.txt, meminfo.txt, nvidia-smi.txt, nvidia-smi-q.txt, nvidia-topo.txt, os-release.txt.

## Verified Tier 0 findings

### CPU complex (lscpu.txt, cpuinfo.txt, lstopo.txt)
- 20 cores, 1 socket, no SMT: 10x Arm Cortex-X925 (max 3900 MHz, min 1378) + 10x Arm Cortex-A725 (max 2808 MHz, min 338). Stepping r0p1 on both.
- Topology is NOT one P-cluster plus one E-cluster. lstopo shows two mixed clusters, each with 5 cores at 512 KB L2 (A725) and 5 cores at 2048 KB L2 (X925):
  - L3 cluster 0: 8 MB L3, cores P#0-9 (5x 512 KB L2 + 5x 2 MB L2)
  - L3 cluster 1: 16 MB L3, cores P#10-19 (same mix)
  - Asymmetric L3 slices (8 MB vs 16 MB) between the two clusters.
- Totals cross-check lscpu: L2 25 MiB over 20 instances, L3 24 MiB over 2 instances, L1d/L1i 64 KB per core.
- ISA flags include sve, sve2, i8mm, svei8mm, bf16, svebf16, bti, paca/pacg. SVE2 plus BF16/INT8 matrix extensions are present (relevant to the Graviton section comparison).

### Memory (free.txt, meminfo.txt, lstopo.txt, nvidia-topo.txt)
- Single NUMA node 0 holding all 20 CPUs and 122 GB (host view of the 128 GB LPDDR5X after carve-outs).
- `nvidia-smi` reports Memory-Usage "Not Supported": there is no dedicated VRAM pool to report; GPU and CPU share the unified LPDDR5X.
- `nvidia-smi topo -m`: GPU0 CPU affinity 0-19, NUMA affinity 0. One memory domain for the whole superchip.

### GPU and software (nvidia-smi.txt, nvidia-smi-q.txt, os-release.txt)
- GPU: NVIDIA GB10 (PCI ID 10de:2e12), enumerated at PCI 000f:01:00.0.
- Driver 580.159.03, CUDA 13.0. Idle draw observed 10.2 W at 39 C, perf state P0. Power cap reads N/A.
- OS: Ubuntu 24.04.4 LTS (Noble) per os-release (DGX OS base image).

### I/O (lspci output, lstopo.txt)
- Samsung NVMe (144d:a810), Realtek 10 GbE (10ec:8127, enP7s7), MediaTek Wi-Fi 7 (14c3:7925, wlP9s9).

## UNKNOWN / to reconcile against Tier 1

1. No Mellanox/ConnectX device enumerates in `lspci -nn` on this unit, while the official DGX Spark spec lists a ConnectX-7 for dual-unit clustering. PCI domains 0000 and 0002 expose NVIDIA bridges (10de:22ce) with no endpoint behind them, consistent with a power-gated NIC with no QSFP cable attached. Close by: attaching a cable or checking `dmesg`/firmware doc for ConnectX power management on DGX Spark.
2. lscpu "Model name" order lists X925 first but per-core mapping to P# ranges comes from L2 sizes in lstopo (512 KB = A725, 2 MB = X925); NVIDIA does not publish per-cluster mapping. Treat cluster composition as Tier 0 observation.
3. Asymmetric L3 (8 MB + 16 MB) is observed, not documented in any NVIDIA public spec found so far.
4. Memory bandwidth (273 GB/s claim) is NOT verified by this capture; needs Tier 1 citation or a Tier 0 STREAM-class benchmark run (not performed; read-only session).
