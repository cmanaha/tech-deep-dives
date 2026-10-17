# Sources: Silicon, Memory, and Modern Inference

Generated from `src/sources/*.ts` by `src/sources/markdown.ts`. Do not edit by hand:
edit the per-section source file and run the dive tests with `-u`.

Tiers: Tier 0 is our own experiment (logged under `research/`). Tier 1 is official
documentation, a specification, a filing or source code pinned to a commit or tag.
Tier 2 is a vendor press release, blog, product page or keynote; performance figures
from Tier 2 are vendor claims and the page labels them as such. Tier 3 is third-party
analysis, an academic paper or trade press.

Claim registers with the evidence behind each figure, including every UNKNOWN, are in
`research/2026-10-refresh/`.

Total distinct sources: 61.

## Tier 1: official documentation, specification, filing or pinned source code

| Publisher | Source | Accessed | Cited in |
| --- | --- | --- | --- |
| arXiv | [Challenges and Research Directions for Large Language Model Inference Hardware (X. Ma and D. Patterson, Google; arXiv:2601.05047)](https://arxiv.org/abs/2601.05047) | 2026-10-17 | HighBandwidthFlash |
| arXiv | [FlashAccel: Leveraging High-Bandwidth Flash (HBF) for High-Throughput LLM Inference (arXiv:2607.10186v2)](https://arxiv.org/abs/2607.10186) | 2026-10-17 | HighBandwidthFlash |
| arXiv | [FLINT: Efficiently Leveraging High Bandwidth Flash for Capacity-Scalable LLM Inference Acceleration (G. F. Oliveira et al.; arXiv:2608.25062v1)](https://arxiv.org/abs/2608.25062) | 2026-10-17 | HighBandwidthFlash |
| arXiv | [HBF Sucks? A Full-Stack Characterization of High-Bandwidth Flash for KV-Centric LLM Serving (Z. Li et al.; arXiv:2608.11668v4)](https://arxiv.org/abs/2608.11668) | 2026-10-17 | HighBandwidthFlash |
| arXiv | [HBFSim: Fast and Faithful Simulation of High-Bandwidth Flash Under Real GPU Execution (Y. Hu et al.; arXiv:2609.09800)](https://arxiv.org/abs/2609.09800) | 2026-10-17 | HighBandwidthFlash |
| arXiv | [Potential Applications of HBF in LLM Serving Systems (Y. Yin et al.; arXiv:2608.13127v2)](https://arxiv.org/abs/2608.13127) | 2026-10-17 | HighBandwidthFlash |
| arXiv | [SPLASH: Co-Designing Sparse Attention with High-Bandwidth Flash for Efficient Long-Context Inference (arXiv:2609.23816)](https://arxiv.org/abs/2609.23816) | 2026-10-17 | HighBandwidthFlash |
| AWS | [Amazon EC2 accelerated computing instance specifications](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html) | 2026-10-17 | NvidiaBlackwell, NvidiaHopper |
| AWS | [Capacity Blocks for ML: supported instance types and Regions](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html) | 2026-10-17 | NvidiaHopper |
| CXL Consortium | [CXL Consortium press release, CXL 3.0 specification (2022-08-02)](https://computeexpresslink.org/wp-content/uploads/2024/01/CXL_3.0-Specification-Release_FINAL-1.pdf) | 2026-10-16 | HighBandwidthFlash |
| Dao-AILab | [FlashAttention README at tag v2.8.3.post2 (FlashAttention-3 beta)](https://github.com/Dao-AILab/flash-attention/blob/v2.8.3.post2/README.md) | 2026-10-17 | NvidiaHopper |
| Hugging Face | [deepseek-ai/DeepSeek-V3 config.json at revision e815299](https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/e815299b0bcbac849fa540c768ef21845365c9eb/config.json) | 2026-10-16 | HighBandwidthFlash |
| JEDEC | [JEDEC and Industry Leaders Collaborate to Release JESD270-4 HBM4 Standard (2025-04-16)](https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing) | 2026-10-16 | HighBandwidthFlash |
| NVIDIA | [CUDA C++ Best Practices Guide (CUDA 13.4): Occupancy](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html) | 2026-10-17 | NvidiaHopper |
| NVIDIA | [CUDA GPU compute capability list](https://developer.nvidia.com/cuda-gpus) | 2026-10-16 | NvidiaBlackwell, NvidiaHopper |
| NVIDIA | [CUDA Programming Guide v13.4.2: Compute Capabilities](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/compute-capabilities.html) | 2026-10-17 | NvidiaBlackwell, NvidiaHopper |
| NVIDIA | [CUTLASS CHANGELOG at tag v4.8.0](https://github.com/NVIDIA/cutlass/blob/v4.8.0/CHANGELOG.md) | 2026-10-16 | NvidiaBlackwell |
| NVIDIA | [CUTLASS example 92_blackwell_moe_gemm at tag v4.8.0](https://github.com/NVIDIA/cutlass/tree/v4.8.0/examples/92_blackwell_moe_gemm) | 2026-10-16 | NvidiaBlackwell |
| NVIDIA | [NVIDIA Blackwell Tuning Guide (CUDA 13.4)](https://docs.nvidia.com/cuda/blackwell-tuning-guide/index.html) | 2026-10-16 | NvidiaBlackwell, NvidiaHopper |
| NVIDIA | [NVIDIA Form 8-K exhibit 99.1, Q2 fiscal 2027 results (2026-08-26)](https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000073/q2fy27pr.htm) | 2026-10-16 | NvidiaBlackwell |
| NVIDIA | [NVIDIA Hopper Tuning Guide (CUDA 13.4)](https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html) | 2026-10-17 | NvidiaHopper |
| NVIDIA | [PTX ISA 9.4: wgmma (9.7.17) and tcgen05 / Tensor Memory (9.7.18)](https://docs.nvidia.com/cuda/parallel-thread-execution/index.html) | 2026-10-16 | NvidiaBlackwell, NvidiaHopper |
| Open Compute Project | [High Bandwidth Flash (HBF) High-Level Base Die Specification, Version 0.7.0 (2026-08-03)](https://www.opencompute.org/documents/ocp-hbf-architecture-specification-v0-7-0-final-pdf) | 2026-10-17 | HighBandwidthFlash |
| Sandisk | [Future FWD: Sandisk 2025 Investor Day presentation (2025-02-11)](https://documents.sandisk.com/content/dam/asset-library/en_us/assets/public/sandisk/corporate/Sandisk-Investor-Day_2025.pdf) | 2026-10-17 | HighBandwidthFlash |

## Tier 2: vendor press release, blog, product page or keynote

| Publisher | Source | Accessed | Cited in |
| --- | --- | --- | --- |
| AWS | [Amazon EC2 P5 instances](https://aws.amazon.com/ec2/instance-types/p5/) | 2026-10-17 | NvidiaHopper |
| AWS | [Amazon EC2 P6 instances](https://aws.amazon.com/ec2/instance-types/p6/) | 2026-10-17 | NvidiaBlackwell |
| AWS | [Amazon EC2 P6e-GB300 UltraServers (NVIDIA GB300 NVL72) generally available](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-p6e-gb300-ultraservers-nvidia-gb300-nvl72-generally-available) | 2026-10-16 | NvidiaBlackwell |
| AWS | [Announcing up to 45% price reduction for Amazon EC2 NVIDIA GPU-accelerated instances](https://aws.amazon.com/blogs/aws/announcing-up-to-45-price-reduction-for-amazon-ec2-nvidia-gpu-accelerated-instances/) | 2026-10-17 | NvidiaBlackwell, NvidiaHopper |
| DeepSeek-AI | [DeepSeek-V3 Technical Report (arXiv:2412.19437)](https://arxiv.org/abs/2412.19437) | 2026-10-16 | HighBandwidthFlash |
| Micron | [Micron in High-Volume Production of HBM4 Designed for NVIDIA Vera Rubin, PCIe Gen6 SSD and SOCAMM2 (2026-03-16)](https://investors.micron.com/news/press-release/2026/Micron-in-High-Volume-Production-of-HBM4-Designed-for-NVIDIA-Vera-Rubin-PCIe-Gen6-SSD-and-SOCAMM2-03-16-2026/default.aspx) | 2026-10-16 | HighBandwidthFlash |
| NVIDIA | [AWS and NVIDIA to Deliver 2 Million Additional GPUs (2026-08-26)](https://nvidianews.nvidia.com/news/aws-and-nvidia-to-deliver-2-million-additional-gpus-and-next-generation-infrastructure-for-agentic-and-physical-ai) | 2026-10-16 | NvidiaBlackwell |
| NVIDIA | [GTC 2026 live updates (Feynman, Rosa, Kyber)](https://blogs.nvidia.com/blog/gtc-2026-news/) | 2026-10-16 | NvidiaBlackwell |
| NVIDIA | [Inside NVIDIA Blackwell Ultra: The Chip Powering the AI Factory Era](https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/) | 2026-10-17 | NvidiaBlackwell, NvidiaHopper |
| NVIDIA | [Introducing NVFP4 for Efficient and Accurate Low-Precision Inference](https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/) | 2026-10-16 | NvidiaBlackwell |
| NVIDIA | [NVIDIA Blackwell architecture](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/) | 2026-10-16 | NvidiaBlackwell |
| NVIDIA | [NVIDIA DGX B200](https://www.nvidia.com/en-us/data-center/dgx-b200/) | 2026-10-16 | NvidiaBlackwell |
| NVIDIA | [NVIDIA GB200 NVL72](https://www.nvidia.com/en-us/data-center/gb200-nvl72/) | 2026-10-16 | NvidiaBlackwell |
| NVIDIA | [NVIDIA GB300 NVL72](https://www.nvidia.com/en-us/data-center/gb300-nvl72/) | 2026-10-16 | NvidiaBlackwell |
| NVIDIA | [NVIDIA Grace CPU page (Vera CPU: SOCAMM LPDDR5X, 1.2 TB/s, 1.5 TB per CPU)](https://www.nvidia.com/en-us/data-center/grace-cpu/) | 2026-10-16 | HighBandwidthFlash |
| NVIDIA | [NVIDIA H100 Tensor Core GPU](https://www.nvidia.com/en-us/data-center/h100/) | 2026-10-16 | NvidiaHopper |
| NVIDIA | [NVIDIA H200 Tensor Core GPU](https://www.nvidia.com/en-us/data-center/h200/) | 2026-10-17 | NvidiaBlackwell, NvidiaHopper |
| NVIDIA | [NVIDIA HGX platform (HGX B300, HGX B200 and HGX Rubin NVL8 specifications)](https://www.nvidia.com/en-us/data-center/hgx/) | 2026-10-17 | HighBandwidthFlash, NvidiaBlackwell |
| NVIDIA | [NVIDIA Hopper Architecture In-Depth](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/) | 2026-10-17 | NvidiaHopper |
| NVIDIA | [NVIDIA Hopper in Full Production (2022-09-20)](https://nvidianews.nvidia.com/news/nvidia-hopper-in-full-production) | 2026-10-16 | NvidiaHopper |
| NVIDIA | [NVIDIA Supercharges Hopper, the World's Leading AI Computing Platform (2023-11-13)](https://nvidianews.nvidia.com/news/nvidia-supercharges-hopper-the-worlds-leading-ai-computing-platform) | 2026-10-16 | NvidiaHopper |
| NVIDIA | [NVIDIA Vera Rubin NVL72](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/) | 2026-10-17 | NvidiaBlackwell |
| Samsung | [Samsung Ships Industry-First Commercial HBM4 With Ultimate Performance for AI Computing (2026-02-12)](https://news.samsung.com/global/samsung-ships-industry-first-commercial-hbm4-with-ultimate-performance-for-ai-computing) | 2026-10-16 | HighBandwidthFlash |
| Sandisk | [HBF Fact Sheet (Tech Brief, July 2025)](https://documents.sandisk.com/content/dam/asset-library/en_us/assets/public/sandisk/collateral/company/Sandisk-HBF-Fact-Sheet.pdf) | 2026-10-17 | HighBandwidthFlash |
| Sandisk | [Sandisk 2026 Investor Day (2026-08-13), transcript of company presentations published by Stock Analysis](https://stockanalysis.com/stocks/sndk/transcripts/708061-investor-day-2026/) | 2026-10-17 | HighBandwidthFlash |
| Sandisk | [Sandisk and SK hynix Advance Global Standardization of High Bandwidth Flash with Release of First OCP Technical Specification (2026-08-03)](https://www.sandisk.com/company/newsroom/press-releases/2026/2026-08-03-Sandisk-and-sk-hynix-advance-global-standardization-of-hbf) | 2026-10-17 | HighBandwidthFlash |
| Sandisk | [Sandisk to Collaborate with SK hynix to Drive Standardization of High-Bandwidth Flash Memory Technology (2025-08-06)](https://www.sandisk.com/company/newsroom/press-releases/2025/2025-08-06-sandisk-to-collaborate-with-sk-hynix-to-drive-standardization-of-high-bandwidth-flash-memory-technology) | 2026-10-17 | HighBandwidthFlash |
| SK hynix | ["Memory-Centric Server Systems Are the Future": SK hynix Presents Its Next-Generation AI Infrastructure Vision at OCP Global Summit 2026 (2026-10-16)](https://news.skhynix.com/en/ocp-global-summit-2026/) | 2026-10-17 | HighBandwidthFlash |
| SK hynix | [SK hynix HBM4 product page](https://product.skhynix.com/products/dram/hbm/hbm4.go) | 2026-10-16 | HighBandwidthFlash |
| SK hynix | [SK hynix Presents Next Generation NAND Storage Product Strategy at OCP 2025 (2025-10-27)](https://news.skhynix.com/en/sk-hynix-presents-next-generation-nand-storage-product-strategy-at-ocp-2025/) | 2026-10-17 | HighBandwidthFlash |
| SK hynix | [SK hynix Ships Samples of 12-Layer Next-Gen HBM4E (2026-06-18)](https://news.skhynix.com/en/sk-hynix-ships-samples-of-12-layer-next-gen-hbm4e-2/) | 2026-10-16 | HighBandwidthFlash |

## Tier 3: third-party analysis, academic paper or trade press

| Publisher | Source | Accessed | Cited in |
| --- | --- | --- | --- |
| arXiv | [Benchmarking and Dissecting the Nvidia Hopper GPU Architecture (Luo et al., arXiv:2402.13499v1), Table IV](https://arxiv.org/pdf/2402.13499) | 2026-10-17 | NvidiaHopper |
| Blocks & Files | [Kioxia eyes GPU memory stack with high-bandwidth flash push (2026-03-20)](https://www.blocksandfiles.com/flash/2026/03/20/kioxia-eyes-gpu-memory-stack-with-high-bandwidth-flash-push/5210520) | 2026-10-17 | HighBandwidthFlash |
| DIGITIMES | [Samsung signals zHBF push as memory race moves beyond HBM (2026-08-27)](https://www.digitimes.com/news/a20260827VL229/samsung-hbm-bandwidth-capacity-2026.html) | 2026-10-17 | HighBandwidthFlash |
| ServeTheHome | [Oxmiq Labs HBF in AI Compute at Hot Chips 2026 (2026-08-27)](https://www.servethehome.com/oxmiq-labs-hbf-in-ai-compute-at-hot-chips-2026/) | 2026-10-17 | HighBandwidthFlash |
| Tom's Hardware | [Hot Chips 2026: High Bandwidth Flash promises massive bandwidth and capacity, but its usability is extremely limited (2026-08-26)](https://www.tomshardware.com/pc-components/ssds/hot-chips-2026-high-bandwidth-flash-promises-massive-bandwidth-and-capacity-but-its-usability-is-extremely-limited-new-memory-format-strikes-a-balance-between-hbm-and-nand-flash) | 2026-10-17 | HighBandwidthFlash |
| TrendForce | [Sandisk Reportedly Tapes Out First HBF Product, Targets 2027 Samples and 2028 Production (2026-08-14)](https://www.trendforce.com/news/2026/08/14/news-sandisk-reportedly-tapes-out-first-hbf-product-targets-2027-samples-and-2028-production/) | 2026-10-17 | HighBandwidthFlash |
