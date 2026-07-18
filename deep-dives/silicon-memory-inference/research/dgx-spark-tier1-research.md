# DGX Spark / GB10 — Tier 1/2 research notes

Researched 2026-07-18 by doc-researcher subagent (15 pages fetched directly). Tier definitions per sources.md. Cross-reconciled against Tier 0 capture in `research/dgx-spark/` (NOTES.md).

## Verified facts to use in the section

### CPU (GB10 Grace side)
- 20 Arm cores: 10x Cortex-X925 (performance) + 10x Cortex-A725 (efficiency). Tier 1: https://docs.nvidia.com/dgx/dgx-spark/hardware.html and https://www.nvidia.com/en-us/products/workstations/dgx-spark/ (accessed 2026-07-18).
- Armv9.2. Two clusters of 10 cores; each cluster is 5x X925 (2 MB L2 each) + 5x A725 (512 KB L2 each); 16 MB L3 on one cluster, 8 MB on the other. Tier 1: https://docs.nvidia.com/dgx/dgx-spark-porting-guide/overview.html (accessed 2026-07-18). MATCHES our lstopo capture exactly (Tier 0).
- Clock speeds: not published by NVIDIA (Tier 1/2 silent). Tier 0 (our unit, lscpu): X925 max 3900 MHz, A725 max 2808 MHz. Cite as Tier 0 measurement, not vendor spec.

### GPU (Blackwell side)
- Blackwell architecture, 5th-gen Tensor Cores, 4th-gen RT Cores, 6,144 CUDA cores. Tier 1: hardware.html (accessed 2026-07-18).
- Up to 1,000 TOPS / 1 PFLOP at FP4 WITH SPARSITY (product-page footnote confirms sparse). Tier 1: hardware.html + product page (accessed 2026-07-18). No dense figure published (UNKNOWN).
- Tensor/RT core counts: UNKNOWN (only generations stated).
- ~31 TFLOPS FP32: Tier 3 only (ServeTheHome on Hot Chips 2025) — label if used.

### Memory
- 128 GB LPDDR5x, coherent unified system memory, 256-bit bus, 273 GB/s, 4266 MHz (LPDDR5X-8533). All Tier 1: product page + hardware.html + porting guide, consistent (accessed 2026-07-18).
- Conflict noted: Hot Chips 2025 era reporting said ~301 GB/s / LPDDR5X-9400 (Tier 3, pre-shipping). Shipping Tier 1 figure 273 GB/s wins.

### NVLink-C2C (GB10)
- Official: "5x the bandwidth of fifth-generation PCIe", CPU+GPU-coherent memory model. Tier 2: nvidianews announcements (accessed 2026-07-18). NVIDIA publishes NO absolute GB/s figure for GB10 C2C (Tier 1 pages silent; nvlink-c2c page mentions DGX Spark but no number).
- ~600 GB/s bidirectional is a TechInsights derivation (Tier 3, 2025-12-05). Do NOT state as vendor fact. Never reuse the Grace-Hopper 900 GB/s figure for GB10.

### Networking and clustering
- ConnectX-7 at 200 Gbps + 1x RJ-45 10 GbE + Wi-Fi 7 + Bluetooth 5.4. Tier 1: product page + hardware.html (accessed 2026-07-18).
- Two-unit clustering via QSFP cable between ConnectX-7 ports; MPI + NCCL v2.28.3; Slurm or Kubernetes. Tier 1: https://docs.nvidia.com/dgx/dgx-spark/spark-clustering.html (accessed 2026-07-18).
- Two Sparks support models up to 405B params. Tier 1: product page (accessed 2026-07-18).
- NIM multi-node example: MiniMax-M2.5 229B NVFP4 needs >= 115 GiB plus KV cache, i.e. two Sparks. Tier 1: https://docs.nvidia.com/nim/large-language-models/1.15.0/deploy-on-dgx-spark.html (accessed 2026-07-18).
- PCIe 5.0 x8 backhaul to the NIC: Tier 3 (ServeTheHome).
- Tier 0 anomaly (our unit): no ConnectX device enumerates on the PCI bus; two empty NVIDIA bridges present. Likely power-gated with no cable. Keep in UNKNOWN register.

### Power / physical
- 240 W external PSU; GB10 SoC TDP 140 W. Tier 1: product page + hardware.html (accessed 2026-07-18).
- 150 x 150 x 50.5 mm, 1.2 kg. Tier 1: hardware.html (accessed 2026-07-18).
- Tier 0: idle GPU draw observed 10.2 W at 39 C.

### Storage / OS / software
- 1 TB or 4 TB self-encrypting NVMe. Tier 1: hardware.html (accessed 2026-07-18).
- DGX OS 7, Ubuntu-based (Tier 1: dgx-os.html). Tier 0: our unit reports Ubuntu 24.04.4 LTS, driver 580.159.03, CUDA 13.0.
- Stack: DGX Dashboard/JupyterLab, Docker + NVIDIA runtime, Nsight, NGC/NIM (not every NIM has a Spark variant — check DGX Spark Collection). Tier 1: software.html + ngc.html (accessed 2026-07-18).

### Die architecture
- NVIDIA Tier 1 docs silent on die count; Tier 2 newsroom names MediaTek co-design and NVLink-C2C between CPU and GPU but never says "two dies".
- Two-die story (S-die CPU + G-die GPU, CoWoS-R 2.5D interposer, both TSMC N3) is Tier 3: TechInsights teardown 2025-12-05 + ServeTheHome Hot Chips reporting 2025-08-26. Label as Tier 3 if used.
- Memory controller on CPU-side die: LIKELY (Tier 3 aggregate, not independently fetched) — treat as UNKNOWN.

## UNKNOWN register additions
1. GB10 NVLink-C2C absolute bandwidth (vendor-published) — only "5x PCIe Gen 5" exists.
2. Dense FP4 TOPS — only sparse published.
3. Tensor/RT core counts.
4. Vendor-rated CPU clocks (Tier 0 measurement stands in).
5. 273 vs 301 GB/s pre-launch discrepancy — no NVIDIA statement.
6. ConnectX-7 not enumerating on our unit's PCI bus.

## Source list
See the full tiered source table in the subagent report; key Tier 1 URLs above. All accessed 2026-07-18.
