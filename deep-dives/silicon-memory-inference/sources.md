# Sources — Silicon, Memory, and Modern Inference

Authoritative sources for the deep dive, organized by tier and section theme. Each cited claim in the app links back to an entry here with its access date.

## Sourcing policy (Carlos 2026-04-23)

Authoritative owner documentation is the first-class source. Academic papers are welcome context but are not authoritative for implementation claims — vendor behavior frequently diverges from published designs. When a claim comes from a paper it must also trace to vendor documentation; if it does not, the claim is flagged UNKNOWN.

## Tier definitions

- **Tier 0** — Our own experiments. Code, data, and inputs checked into `research/` or `iac/`.
- **Tier 1** — Official vendor documentation, formal specifications, source code, official reference manuals. The compiler and tooling sections rely almost exclusively on Tier 1.
- **Tier 2** — Vendor blog posts, conference talks (re:Invent, HotChips, MICRO, ISCA), official whitepapers, vendor-authored keynotes.
- **Tier 3** — Peer-reviewed papers, third-party technical analysis with methodology disclosed. Context only — any implementation claim must also trace to Tier 1 or 2.
- **Tier 4** — Blog posts and tutorials. Inspiration only. Never cited as source of truth.

## Primary authoritative sources (Tier 1) by section theme

### AWS Neuron, Trainium, Inferentia
- AWS Neuron SDK documentation — https://awsdocs-neuron.readthedocs-hosted.com/
- NKI (Neuron Kernel Interface) — https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/nki/
- torch-neuronx — https://awsdocs-neuron.readthedocs-hosted.com/en/latest/frameworks/torch/torch-neuronx/
- Neuron profiler reference — https://awsdocs-neuron.readthedocs-hosted.com/en/latest/tools/
- Neuron Distributed — https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/neuronx-distributed/

### NVIDIA compilers and kernel tooling
- CUDA Programming Guide — https://docs.nvidia.com/cuda/cuda-c-programming-guide/
- CUTLASS — https://github.com/NVIDIA/cutlass (README, media/, and in-tree docs)
- CuTe documentation — https://github.com/NVIDIA/cutlass/tree/main/media/docs/cute
- Triton — https://triton-lang.org/main/index.html
- cuDNN — https://docs.nvidia.com/deeplearning/cudnn/
- cuBLAS — https://docs.nvidia.com/cuda/cublas/
- Nsight Compute — https://docs.nvidia.com/nsight-compute/
- Nsight Systems — https://docs.nvidia.com/nsight-systems/

### PyTorch and JAX
- PyTorch documentation — https://pytorch.org/docs/
- torch.compile / Inductor — https://pytorch.org/docs/stable/torch.compiler.html
- JAX documentation — https://docs.jax.dev/

### Edge shared-memory silicon: DGX Spark and Jetson Orin Nano (Section 15)
Tier 0 — our own hardware capture (2026-07-18): lstopo/lscpu/nvidia-smi/lspci evidence bundle from a physical DGX Spark in `research/dgx-spark/` (NOTES.md documents method and findings). Full research notes: `research/dgx-spark-tier1-research.md`, `research/jetson-orin-nano-tier1-research.md`, `research/edge-community-models-research.md`.

Tier 1 (all accessed 2026-07-18):
- DGX Spark product page — https://www.nvidia.com/en-us/products/workstations/dgx-spark/
- DGX Spark User Guide: hardware, clustering, DGX OS, software, NGC — https://docs.nvidia.com/dgx/dgx-spark/
- DGX Spark Porting Guide (CPU cluster topology, L2/L3, UMA) — https://docs.nvidia.com/dgx/dgx-spark-porting-guide/overview.html
- NIM for LLMs: Deploy on DGX Spark — https://docs.nvidia.com/nim/large-language-models/1.15.0/deploy-on-dgx-spark.html
- Jetson Orin Nano Series Modules Data Sheet DS-11105-001_v1.5 (NVIDIA doc; mirrored PDF hosting flagged) — https://www.esys.ir/images/img_Item/3029/Files/Jetson-Orin-Nano-Series-Modules-Datasheet_DS-11105-001_v1.5.pdf
- Jetson Orin Nano Super Developer Kit page — https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/nano-super-developer-kit/
- CUDA for Tegra Application Note (iGPU/CPU shared SoC DRAM, zero-copy, coherency) — https://docs.nvidia.com/cuda/cuda-for-tegra-appnote/index.html
- JetPack 6.2 Release Notes (Super power modes) — https://docs.nvidia.com/jetson/archives/jetpack-archived/jetpack-62/release-notes/index.html

Tier 2: NVIDIA newsroom DGX Spark announcements (2025-01/03/10), NVIDIA developer blog DGX Spark performance (2025-10-24), Jetson Super Boost blog (2024-12-17), Jetson AI Lab benchmarks, dgx-spark-playbooks repo, Getting Started with Edge AI on Jetson (2025-12-11).
Tier 3: TechInsights GB10 packaging teardown (2025-12-05), ServeTheHome Hot Chips 2025 GB10 coverage, LMSYS DGX Spark review (2025-10-13), llama.cpp discussions #16578/#18254, JetsonHacks llama.cpp bench (2025-10-31), EXO Labs disaggregated-inference blog.

## Fact-check register

Will be populated here as each section moves from scaffold to draft. Format per entry:

- Claim
- Section where it appears
- Source (Tier + URL)
- Access date

## UNKNOWN register

Claims we could not verify. Each entry notes what would be needed to close it.
