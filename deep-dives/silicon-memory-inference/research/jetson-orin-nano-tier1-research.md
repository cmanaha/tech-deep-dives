# Jetson Orin Nano Super — Tier 1/2 research notes

Researched 2026-07-18 by doc-researcher subagent (15 sources read, incl. the module datasheet PDF). Tiering per sources.md. Primary Tier 1 source: NVIDIA "Jetson Orin Nano Series Modules Data Sheet" DS-11105-001_v1.5 (Dec 2024), mirrored PDF at https://www.esys.ir/images/img_Item/3029/Files/Jetson-Orin-Nano-Series-Modules-Datasheet_DS-11105-001_v1.5.pdf (NVIDIA-authored document, third-party hosting flagged).

## Verified facts to use in the section (all accessed 2026-07-18)

### CPU
- 6x Arm Cortex-A78AE (Armv8.2, 64-bit), HOMOGENEOUS (no P/E split). Organized as one quad-core cluster + one dual-core cluster (cache/power-island topology, same core type). Tier 1: datasheet, verbatim quote captured.
- Max clock 1.5 GHz base -> 1.7 GHz MAXN_SUPER. Tier 1: datasheet Table 2-2.

### GPU
- Ampere, 1024 CUDA cores, 32 tensor cores (8 GB module). Tier 1: datasheet.
- GPU clock 625 MHz base -> 1020 MHz MAXN_SUPER. Tier 1: datasheet. (A Tier 2 blog said 635; datasheet wins.)
- FP32 1.28 -> 2.08 TFLOPS; FP16 2.56 -> 4.16 TFLOPS (MAXN_SUPER). Tier 1: datasheet.

### AI performance
- INT8 TOPS 8 GB module: sparse 40 -> 67 (MAXN_SUPER); dense 20 -> 33. The marketed "67 TOPS" is SPARSE; consumer pages omit the qualifier. Tier 1: datasheet.
- 4 GB module: sparse 20 -> 34; dense 10 -> 17.
- "Up to 1.7x generative AI uplift" on devkit. Tier 2: NVIDIA blogs 2024-12-17.

### Memory
- 8 GB LPDDR5, 128-bit bus (4 GB module is 64-bit). Tier 1: datasheet.
- Bandwidth: "theoretical peak memory bandwidth on Orin Nano 8GB is 68 GB/s or 102 GB/s (MAXN_SUPER)" (verbatim). Tier 1: datasheet 2.4.
- Memory clock 2133 -> 3199 MHz. Tier 1: datasheet.

### Unified memory model (CUDA for Tegra appnote, Tier 1: https://docs.nvidia.com/cuda/cuda-for-tegra-appnote/index.html)
- "In Tegra devices, both the CPU (Host) and the iGPU share SoC DRAM memory" (verbatim) - contrasted with dGPU over PCIe/NVLink.
- Duplicate allocations and host-device copies can be avoided; mapped memory = zero-copy.
- Unified Memory on Tegra needs coherency/cache-maintenance ops at kernel launch/sync; I/O coherency exists on compute capability >= 7.2; cudaStreamAttachMemAsync() prefetch hints recommended.
- Unified Memory NOT supported when a discrete GPU is attached to a Tegra device.

### Power
- Devkit envelope 7-25 W. Tier 1: product page.
- Post-Super modes (8 GB module, JetPack 6.2): 15 W, 25 W, MAXN SUPER (uncapped). 4 GB: 10 W, 25 W, MAXN SUPER. Tier 1: JetPack 6.2 release notes.
- Super = software/firmware unlock (JetPack), NO hardware change. Tier 2: Super Boost blog 2024-12-17.

### Price and lineage
- Devkit $249 (was $499 before 2024-12-17). Tier 1 product/buy pages + Tier 2 blogs.
- Module 1K pricing at 2022 launch: from $199 (Tier 1 press release "starting at $199"); current per-unit module price UNKNOWN (distributor-only).
- Lineage: (1) Jetson Nano 2019, Maxwell 128-core, 4xA57, 4 GB LPDDR4 25.6 GB/s, $99 devkit. Tier 2: 2019 blog. (2) Jetson Orin Nano, Sep 2022, Ampere, up to 40 sparse TOPS. Tier 1: press release. (3) Jetson Orin Nano Super, Dec 2024, same silicon, MAXN_SUPER unlock, 67 sparse TOPS, $249.
- NVIDIA claims "up to 140x Jetson Nano" on the modules page; compares INT8 TOPS to FP16 GFLOPS with no methodology. Flag if used.

### Software
- JetPack 6.2: L4T 36.4.3, CUDA 12.6, TensorRT 10.3, cuDNN 9.3. Tier 1: release notes (updated 2025-01-15).
- NVIDIA edge AI blog (Tier 2, 2025-12-11): Orin Nano 8GB suited to models "up to nearly 4B parameters"; SLMs Llama 3.2 3B, Phi-3; VLMs Qwen2.5-VL-3B, VILA 1.5-3B, Gemma-3 4B.

## UNKNOWN register additions
1. Whisper-class ASR officially benchmarked on Orin Nano tier: not found at Tier 1/2.
2. Current standalone module unit price (2026): not published.
3. Pre-Super $499 devkit launch date (March 2023 per JetsonHacks, unverified).
4. jetson-ai-lab.com/models page tagged 100B+ models as "Orin 8GB" in one fetch: filter-checkbox artifact, DISCOUNTED; spot-check before ever citing that page.

Full tiered source tables in subagent report. Datasheet + product page + CUDA for Tegra appnote + JetPack 6.2 release notes are the citation backbone.
