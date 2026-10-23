import type { Source } from '../components/Cite';

/**
 * Sources for EdgeSharedMemorySilicon and the diagrams it imports
 * (EdgeSocComparisonDiagram, SparkTopologyCapture).
 *
 * Tiers and URLs follow research/2026-10-refresh/04-other-arch.md (sections 0 and 6, and
 * the Sources list). Records shared with other sections (gb200Nvl72, gptOss120bReadme, blackwellUltraBlog)
 * reuse their URL, title, publisher and tier. Records accessed 2026-10-17 were fetched
 * during authoring: the Hot Chips 2025 GB10 slides, the DGX Spark product page, the
 * GB10 newsroom release, the Jetson Thor blog, the RTX Spark blog and the LMSYS review.
 *
 * Tier 0 records point at our own DGX Spark capture under research/dgx-spark/, pinned to
 * origin/main commit d65693b, where the capture files live.
 */
const tier0Base =
  'https://github.com/cmanaha/tech-deep-dives/blob/d65693b49ca8245ff06cd8c452e47f70a3e8c3ad/deep-dives/silicon-memory-inference/research/dgx-spark/';

export const S = {
  // Tier 0: our own capture of a physical DGX Spark (2026-07-18).
  sparkNotes: {
    title: 'DGX Spark hardware capture, experiment log NOTES.md (captured 2026-07-18)',
    publisher: 'Our experiment',
    url: `${tier0Base}NOTES.md`,
    tier: 0,
    accessed: '2026-10-17',
  },
  sparkLstopo: {
    title: 'DGX Spark hardware capture: lstopo-no-graphics output (captured 2026-07-18)',
    publisher: 'Our experiment',
    url: `${tier0Base}lstopo.txt`,
    tier: 0,
    accessed: '2026-10-17',
  },
  sparkTopologySvg: {
    title: 'DGX Spark hardware capture: lstopo SVG render (captured 2026-07-18)',
    publisher: 'Our experiment',
    url: `${tier0Base}spark-topology.svg`,
    tier: 0,
    accessed: '2026-10-17',
  },
  sparkLscpu: {
    title: 'DGX Spark hardware capture: lscpu output (captured 2026-07-18)',
    publisher: 'Our experiment',
    url: `${tier0Base}lscpu.txt`,
    tier: 0,
    accessed: '2026-10-17',
  },
  sparkNvidiaSmi: {
    title: 'DGX Spark hardware capture: nvidia-smi output (captured 2026-07-18)',
    publisher: 'Our experiment',
    url: `${tier0Base}nvidia-smi.txt`,
    tier: 0,
    accessed: '2026-10-17',
  },

  // Tier 1: NVIDIA documentation, pinned code, datasheet, model card.
  sparkHardware: {
    title: 'DGX Spark User Guide: Hardware Overview',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/dgx/dgx-spark/hardware.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  sparkPortingGuide: {
    title: 'DGX Spark Porting Guide: Overview (CPU cluster and cache layout)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/dgx/dgx-spark-porting-guide/overview.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  tegraAppNote: {
    title: 'CUDA for Tegra application note v13.4 (memory management, I/O coherency, full coherency on Thor)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/cuda-for-tegra-appnote/index.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  twoSparksPlaybook: {
    title: 'dgx-spark-playbooks at commit c035e0a: connect-two-sparks performance benchmarking guide',
    publisher: 'NVIDIA',
    url: 'https://github.com/NVIDIA/dgx-spark-playbooks/blob/c035e0ac7d211509ec131b79b5b6f0f824a9e421/nvidia/connect-two-sparks/assets/performance_benchmarking_guide.md',
    tier: 1,
    accessed: '2026-10-16',
  },
  orinNanoDatasheet: {
    title:
      'Jetson Orin Nano Series Modules Data Sheet DS-11105-001_v1.5 (third-party mirror of the NVIDIA PDF)',
    publisher: 'NVIDIA',
    url: 'https://www.esys.ir/images/img_Item/3029/Files/Jetson-Orin-Nano-Series-Modules-Datasheet_DS-11105-001_v1.5.pdf',
    tier: 1,
    accessed: '2026-10-23',
  },
  gptOss120bReadme: {
    title: 'openai/gpt-oss-120b README at revision b5c939d',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/openai/gpt-oss-120b/blob/b5c939de8f754692c1647ca79fbf85e8c1e70f8a/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Tier 2: NVIDIA slides, product pages, blogs, forum announcements.
  gb10HotChips: {
    title: 'NVIDIA GB10 SoC: AI Supercomputer On Your Desk (A. Skende, Hot Chips 2025 slides, 2025-08-26)',
    publisher: 'NVIDIA',
    url: 'https://hc2025.hotchips.org/assets/program/conference/day2/21_nvidia_skende_final.pdf',
    tier: 2,
    accessed: '2026-10-17',
  },
  gb10Newsroom: {
    title: 'NVIDIA Announces DGX Spark and DGX Station Personal AI Computers (2025-03-18)',
    publisher: 'NVIDIA',
    url: 'https://nvidianews.nvidia.com/news/nvidia-announces-dgx-spark-and-dgx-station-personal-ai-computers',
    tier: 2,
    accessed: '2026-10-17',
  },
  sparkProductPage: {
    title: 'NVIDIA DGX Spark (product page: specifications and clustering table)',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/products/workstations/dgx-spark/',
    tier: 2,
    accessed: '2026-10-17',
  },
  sparkPriceChange: {
    title: '2/23/2026 Price Change Announcement (DGX Spark, NVIDIA Developer Forums, posted 2026-02-25 by NVIDIA staff)',
    publisher: 'NVIDIA',
    url: 'https://forums.developer.nvidia.com/t/2-23-2026-price-change-announcement/361713',
    tier: 2,
    accessed: '2026-10-16',
  },
  spark64Gb: {
    title: 'NVIDIA DGX Spark 64GB Gives Developers More Ways to Build and Scale Local AI (2026-10-02)',
    publisher: 'NVIDIA',
    url: 'https://blogs.nvidia.com/blog/local-ai-dgx-spark-64gb-sync/',
    tier: 2,
    accessed: '2026-10-17',
  },
  sparkPerfBlog: {
    title: "How NVIDIA DGX Spark's Performance Enables Intensive AI Tasks (2025-10-24)",
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/how-nvidia-dgx-sparks-performance-enables-intensive-ai-tasks/',
    tier: 2,
    accessed: '2026-10-16',
  },
  sparkSoftwareBlog: {
    title: 'New Software and Model Optimizations Supercharge NVIDIA DGX Spark (2026-01-05)',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/new-software-and-model-optimizations-supercharge-nvidia-dgx-spark/',
    tier: 2,
    accessed: '2026-10-16',
  },
  rtxSpark: {
    title: 'Sparks Fly: NVIDIA Accelerates Local AI at IFA 2026 (RTX Spark, 2026-09-03)',
    publisher: 'NVIDIA',
    url: 'https://blogs.nvidia.com/blog/local-ai-ifa-next-gen-agents-nv-pair-rtx-spark/',
    tier: 2,
    accessed: '2026-10-17',
  },
  thorBlog: {
    title: 'Introducing NVIDIA Jetson Thor, the Ultimate Platform for Physical AI (2025-08-25)',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/introducing-nvidia-jetson-thor-the-ultimate-platform-for-physical-ai/',
    tier: 2,
    accessed: '2026-10-17',
  },
  t4000Blog: {
    title: 'Accelerate AI Inference for Edge and Robotics with NVIDIA Jetson T4000 and NVIDIA JetPack 7.1 (2026-01-05)',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/accelerate-ai-inference-for-edge-and-robotics-with-nvidia-jetson-t4000-and-nvidia-jetpack-7-1/',
    tier: 2,
    accessed: '2026-10-16',
  },
  orinSuperBoostBlog: {
    title: 'NVIDIA Jetson Orin Nano Developer Kit Gets a Super Boost (2024-12-17)',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/',
    tier: 2,
    accessed: '2026-10-17',
  },
  orinNanoSuperPage: {
    title: 'Jetson Orin Nano Super Developer Kit',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/nano-super-developer-kit/',
    tier: 2,
    accessed: '2026-10-16',
  },
  orinNano2: {
    title: 'NVIDIA Announces Jetson Orin Nano 2 Robotics Computer to Redefine Entry-Level Edge AI (2026-08-25)',
    publisher: 'NVIDIA',
    url: 'https://nvidianews.nvidia.com/news/nvidia-announces-jetson-orin-nano-2-robotics-computer-to-redefine-entry-level-edge-ai',
    tier: 2,
    accessed: '2026-10-16',
  },
  jetsonFaq: {
    title: 'Jetson FAQ: What is the price of Jetson products? (MSRP table)',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/embedded/faq',
    tier: 2,
    accessed: '2026-10-16',
  },
  jetsonAiLab: {
    title: 'NVIDIA Jetson AI Lab: Benchmarks (MLC, INT4)',
    publisher: 'NVIDIA',
    url: 'https://www.jetson-ai-lab.com/archive/benchmarks.html',
    tier: 2,
    accessed: '2026-10-16',
  },
  jetsonEdgeAiBlog: {
    title:
      'Getting Started with Edge AI on NVIDIA Jetson: LLMs, VLMs, and Foundation Models for Robotics (2025-12-11)',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/getting-started-with-edge-ai-on-nvidia-jetson-llms-vlms-and-foundation-models-for-robotics/',
    tier: 2,
    accessed: '2026-10-16',
  },
  gb200Nvl72: {
    title: 'NVIDIA GB200 NVL72',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/gb200-nvl72/',
    tier: 2,
    accessed: '2026-10-17',
  },
  blackwellUltraBlog: {
    title: 'Inside NVIDIA Blackwell Ultra: The Chip Powering the AI Factory Era',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/',
    tier: 2,
    accessed: '2026-10-23',
  },

  // Tier 3: third-party measurement.
  lmsysSpark: {
    title: 'NVIDIA DGX Spark in-depth review (LMSYS Org blog, J. Zhou and R. Chen, 2025-10-13)',
    publisher: 'LMSYS',
    url: 'https://www.lmsys.org/blog/2025-10-13-nvidia-dgx-spark/',
    tier: 3,
    accessed: '2026-10-17',
  },
} satisfies Record<string, Source>;
