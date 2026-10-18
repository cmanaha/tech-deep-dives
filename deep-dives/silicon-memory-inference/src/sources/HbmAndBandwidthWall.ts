import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/HbmAndBandwidthWall.tsx and
 * src/components/HbmStackDiagram.tsx. Tiers and URLs follow
 * research/2026-10-refresh/01-memory.md (section 2 and the Sources list) and
 * 02-nvidia.md (section 0). Records shared with other sections reuse their URL,
 * title, publisher and tier. Records accessed 2026-10-17 were re-fetched during
 * authoring: the HGX page (Rubin 288 GB HBM4 | 22 TB/s; no stack count), the
 * Trainium3 page (144 GiB, 4.9 TB/s; no HBM generation or stack count), the
 * TPU7x page (192 GiB, 7,380 GBps; "The large HBM capacity enables large batch
 * sizes"), the Samsung, Micron and SK hynix HBM4 pages and SK hynix's 2Q26
 * results.
 */
export const S = {
  // NVIDIA (Tier 1 docs, Tier 2 product pages and blogs)
  h100Page: {
    title: 'NVIDIA H100 Tensor Core GPU',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/h100/',
    tier: 2,
    accessed: '2026-10-16',
  },
  h200Page: {
    title: 'NVIDIA H200 Tensor Core GPU',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/h200/',
    tier: 2,
    accessed: '2026-10-16',
  },
  hopperArchBlog: {
    title: 'NVIDIA Hopper Architecture In-Depth',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/',
    tier: 2,
    accessed: '2026-10-16',
  },
  blackwellTuningGuide: {
    title: 'NVIDIA Blackwell Tuning Guide (CUDA 13.4)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/blackwell-tuning-guide/index.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  dgxB200: {
    title: 'NVIDIA DGX B200',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/dgx-b200/',
    tier: 2,
    accessed: '2026-10-16',
  },
  blackwellUltraBlog: {
    title: 'Inside NVIDIA Blackwell Ultra: The Chip Powering the AI Factory Era',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/',
    tier: 2,
    accessed: '2026-10-16',
  },
  hgxPage: {
    title: 'NVIDIA HGX platform (HGX B300, HGX B200 and HGX Rubin NVL8 specifications)',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/hgx/',
    tier: 2,
    accessed: '2026-10-17',
  },
  veraRubinNvl72: {
    title: 'NVIDIA Vera Rubin NVL72',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/',
    tier: 2,
    accessed: '2026-10-16',
  },
  lpxBlog: {
    title:
      'Inside NVIDIA Groq 3 LPX: The Low-Latency Inference Accelerator for the NVIDIA Vera Rubin Platform (2026-03-16)',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/inside-nvidia-groq-3-lpx-the-low-latency-inference-accelerator-for-the-nvidia-vera-rubin-platform/',
    tier: 2,
    accessed: '2026-10-17',
  },

  // AMD, AWS, Google
  amdMi355x: {
    title: 'AMD Instinct MI355X GPU',
    publisher: 'AMD',
    url: 'https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html',
    tier: 2,
    accessed: '2026-10-16',
  },
  amdMi455x: {
    title: 'AMD Instinct MI455X GPU (432 GB HBM4, 12 stacks, 23.3 TB/s, launch date 7/23/2026)',
    publisher: 'AMD',
    url: 'https://www.amd.com/en/products/accelerators/instinct/mi400/mi455x.html',
    tier: 2,
    accessed: '2026-10-16',
  },
  epyc9005Datasheet: {
    title: 'AMD EPYC 9005 Series Server CPUs data sheet (per-SKU cores, clocks, L3, memory)',
    publisher: 'AMD',
    url: 'https://www.amd.com/content/dam/amd/en/documents/epyc-business-docs/datasheets/amd-epyc-9005-series-processor-datasheet.pdf',
    tier: 1,
    accessed: '2026-10-17',
  },
  epyc9755Page: {
    title: 'AMD EPYC 9755 product page (memory type, DDR5-6400 qualifier, per-socket memory bandwidth)',
    publisher: 'AMD',
    url: 'https://www.amd.com/en/products/processors/server/epyc/9005-series/amd-epyc-9755.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  trainium3Arch: {
    title: 'AWS Neuron: Trainium3 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium3.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  tpu7x: {
    title: 'Google Cloud TPU documentation: TPU7x (Ironwood)',
    publisher: 'Google Cloud',
    url: 'https://cloud.google.com/tpu/docs/tpu7x',
    tier: 1,
    accessed: '2026-10-17',
  },

  // JEDEC standards (Tier 1)
  jedecHbm3: {
    title: 'JEDEC Publishes HBM3 Update to High Bandwidth Memory (HBM) Standard (JESD238, 2022-01-27)',
    publisher: 'JEDEC',
    url: 'https://www.jedec.org/news/pressreleases/jedec-publishes-hbm3-update-high-bandwidth-memory-hbm-standard',
    tier: 1,
    accessed: '2026-10-16',
  },
  jedecHbm4: {
    title: 'JEDEC and Industry Leaders Collaborate to Release JESD270-4 HBM4 Standard (2025-04-16)',
    publisher: 'JEDEC',
    url: 'https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing',
    tier: 1,
    accessed: '2026-10-16',
  },
  jedecJc422: {
    title: 'JEDEC JC-42.2 High Bandwidth Memory committee page (published document list)',
    publisher: 'JEDEC',
    url: 'https://www.jedec.org/committees/jc-422',
    tier: 1,
    accessed: '2026-10-16',
  },
  jedecSphbm4: {
    title: 'JEDEC Prepares SPHBM4 Standard to Deliver HBM4-Level Throughput with Reduced Pin Count (2025-12-11)',
    publisher: 'JEDEC',
    url: 'https://www.jedec.org/news/pressreleases/jedec%C2%AE-prepares-sphbm4-standard-deliver-hbm4-level-throughput-reduced-pin-count',
    tier: 1,
    accessed: '2026-10-16',
  },
  jedecDdr5c: {
    title: 'JEDEC Updates JESD79-5C DDR5 SDRAM Standard (2024-04-17)',
    publisher: 'JEDEC',
    url: 'https://www.jedec.org/news/pressreleases/jedec-updates-jesd79-5c-ddr5-sdram-standard-elevating-performance-and-security',
    tier: 1,
    accessed: '2026-10-16',
  },

  // DRAM makers (Tier 2; performance figures are vendor claims)
  samsungHbm4: {
    title: 'Samsung Ships Industry-First Commercial HBM4 With Ultimate Performance for AI Computing (2026-02-12)',
    publisher: 'Samsung',
    url: 'https://news.samsung.com/global/samsung-ships-industry-first-commercial-hbm4-with-ultimate-performance-for-ai-computing',
    tier: 2,
    accessed: '2026-10-17',
  },
  micronHbm4: {
    title:
      'Micron in High-Volume Production of HBM4 Designed for NVIDIA Vera Rubin, PCIe Gen6 SSD and SOCAMM2 (2026-03-16)',
    publisher: 'Micron',
    url: 'https://investors.micron.com/news/press-release/2026/Micron-in-High-Volume-Production-of-HBM4-Designed-for-NVIDIA-Vera-Rubin-PCIe-Gen6-SSD-and-SOCAMM2-03-16-2026/default.aspx',
    tier: 2,
    accessed: '2026-10-17',
  },
  skhynixHbm4: {
    title: 'SK hynix HBM4 product page',
    publisher: 'SK hynix',
    url: 'https://product.skhynix.com/products/dram/hbm/hbm4.go',
    tier: 2,
    accessed: '2026-10-17',
  },
  skhynixQ2: {
    title: 'SK hynix Announces 2Q26 Financial Results (2026-07-29)',
    publisher: 'SK hynix',
    url: 'https://news.skhynix.com/en/q2-2026-business-results/',
    tier: 2,
    accessed: '2026-10-17',
  },
  skhynixHbm4e: {
    title: 'SK hynix Ships Samples of 12-Layer Next-Gen HBM4E (2026-06-18)',
    publisher: 'SK hynix',
    url: 'https://news.skhynix.com/en/sk-hynix-ships-samples-of-12-layer-next-gen-hbm4e-2/',
    tier: 2,
    accessed: '2026-10-16',
  },
  samsungPimHc33: {
    title:
      'Aquabolt-XL: Samsung HBM2-PIM with in-memory processing for ML accelerators and beyond (Hot Chips 33 slides, 2021-08-13)',
    publisher: 'Samsung',
    url: 'https://www.hc33.hotchips.org/assets/program/conference/day1/20210813_HC33_Aquabolt-XL_PIM_Jin_Kim_slide.pdf',
    tier: 2,
    accessed: '2026-10-16',
  },

  // Alternatives (records shared with their sections)
  cerebrasS1: {
    title: 'Cerebras Systems, Form S-1 (filed 2026-04-17)',
    publisher: 'Cerebras Systems (SEC EDGAR)',
    url: 'https://www.sec.gov/Archives/edgar/data/2021728/000162828026025762/cerebras-sx1april2026.htm',
    tier: 1,
    accessed: '2026-10-16',
  },
  cerebrasInferenceBlog: {
    title: 'Introducing Cerebras Inference: AI at Instant Speed (2024-08-27)',
    publisher: 'Cerebras',
    url: 'https://www.cerebras.ai/blog/introducing-cerebras-inference-ai-at-instant-speed',
    tier: 2,
    accessed: '2026-10-17',
  },
  distServe: {
    title:
      'DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language Model Serving (arXiv:2401.09670)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2401.09670',
    tier: 3,
    accessed: '2026-10-16',
  },
} satisfies Record<string, Source>;
