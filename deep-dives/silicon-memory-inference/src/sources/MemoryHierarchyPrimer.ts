import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/MemoryHierarchyPrimer.tsx and
 * src/components/MemoryHierarchyTower.tsx. Register:
 * research/2026-10-refresh/01-memory.md section 1, plus hbf.md row 6.6 and
 * flash-cache-tier.md table 6b for the High Bandwidth Flash and NVMe flash
 * tiers. Records shared with another section file reuse its URL, title,
 * publisher and tier exactly; records taken only from the register carry
 * its access date, 2026-10-16.
 */
export const S = {
  // NVIDIA documentation (Tier 1)
  hopperTuningGuide: {
    title: 'NVIDIA Hopper Tuning Guide (CUDA 13.4)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  blackwellTuningGuide: {
    title: 'NVIDIA Blackwell Tuning Guide (CUDA 13.4)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/blackwell-tuning-guide/index.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  ptxIsa: {
    title: 'PTX ISA 9.4: wgmma (9.7.17) and tcgen05 / Tensor Memory (9.7.18)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/cuda/parallel-thread-execution/index.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  gdsOverview: {
    title: 'NVIDIA GPUDirect Storage Overview Guide v1.19.1',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/gpudirect-storage/overview-guide/index.html',
    tier: 1,
    accessed: '2026-10-17',
  },

  // CPU documentation (Tier 1)
  intelOrm: {
    title:
      'Intel 64 and IA-32 Architectures Optimization Reference Manual, document 248966-050 (change document: Golden Cove 48 KB L1D, 2 MB server MLC)',
    publisher: 'Intel',
    url: 'https://cdrdv2-public.intel.com/821613/355308-Optimization-Reference-Manual-050-Changes-Doc.pdf',
    tier: 1,
    accessed: '2026-10-16',
  },
  xeon6980pArk: {
    title: 'Intel Xeon 6980P processor specifications (ARK: 504 MB cache, 12 channels, DDR5-6400 or MRDIMM-8800)',
    publisher: 'Intel',
    url: 'https://www.intel.com/content/www/us/en/products/sku/240777/intel-xeon-6980p-processor-504m-cache-2-00-ghz/specifications.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  xeon6Brief: {
    title: 'Intel Xeon 6 Product Brief (up to 64 lanes of CXL 2.0 at up to 32 GT/s per lane)',
    publisher: 'Intel',
    url: 'https://www.intel.com/content/www/us/en/products/docs/xeon-6-product-brief.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  epyc9005Datasheet: {
    title: 'AMD EPYC 9005 Series Server CPUs data sheet (per-SKU cores, clocks, L3, memory)',
    publisher: 'AMD',
    url: 'https://www.amd.com/content/dam/amd/en/documents/epyc-business-docs/datasheets/amd-epyc-9005-series-processor-datasheet.pdf',
    tier: 1,
    accessed: '2026-10-17',
  },
  gravitonReadme: {
    title: 'aws-graviton-getting-started README at commit 8b322a4',
    publisher: 'AWS',
    url: 'https://github.com/aws/aws-graviton-getting-started/blob/8b322a4160b827be202beedaf35ce21b4c635603/README.md',
    tier: 1,
    accessed: '2026-10-16',
  },

  // AWS Neuron and EC2 documentation (Tier 1)
  trainium2Arch: {
    title: 'AWS Neuron: Trainium2 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  trainium3Arch: {
    title: 'AWS Neuron: Trainium3 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium3.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  neuronCoreV3: {
    title: 'AWS Neuron: NeuronCore-v3 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/neuron-core-v3.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  nkiTrn2Arch: {
    title: 'AWS Neuron: NKI Trainium2 Architecture Guide',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/guides/architecture/trainium2_arch.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  nkiTrn3Arch: {
    title: 'AWS Neuron: NKI Trainium3 Architecture Guide',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/guides/architecture/trainium3_arch.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  ec2AcceleratedSpecs: {
    title: 'Amazon EC2 accelerated computing instance specifications',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  fsxPerformance: {
    title: 'Amazon FSx for Lustre performance: throughput to individual client instances',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Specifications (Tier 1)
  ocpSpec: {
    title: 'High Bandwidth Flash (HBF) High-Level Base Die Specification, Version 0.7.0 (2026-08-03)',
    publisher: 'Open Compute Project',
    url: 'https://www.opencompute.org/documents/ocp-hbf-architecture-specification-v0-7-0-final-pdf',
    tier: 1,
    accessed: '2026-10-17',
  },
  cxl3Spec: {
    title: 'CXL Consortium press release, CXL 3.0 specification (2022-08-02)',
    publisher: 'CXL Consortium',
    url: 'https://computeexpresslink.org/wp-content/uploads/2024/01/CXL_3.0-Specification-Release_FINAL-1.pdf',
    tier: 1,
    accessed: '2026-10-16',
  },

  // Vendor product pages, blogs, white papers and transcripts (Tier 2)
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
    accessed: '2026-10-16',
  },
  blackwellArchitecture: {
    title: 'NVIDIA Blackwell architecture',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/',
    tier: 2,
    accessed: '2026-10-16',
  },
  micronHbm4: {
    title:
      'Micron in High-Volume Production of HBM4 Designed for NVIDIA Vera Rubin, PCIe Gen6 SSD and SOCAMM2 (2026-03-16)',
    publisher: 'Micron',
    url: 'https://investors.micron.com/news/press-release/2026/Micron-in-High-Volume-Production-of-HBM4-Designed-for-NVIDIA-Vera-Rubin-PCIe-Gen6-SSD-and-SOCAMM2-03-16-2026/default.aspx',
    tier: 2,
    accessed: '2026-10-16',
  },
  sandiskFactSheet: {
    title: 'HBF Fact Sheet (Tech Brief, July 2025)',
    publisher: 'Sandisk',
    url: 'https://documents.sandisk.com/content/dam/asset-library/en_us/assets/public/sandisk/collateral/company/Sandisk-HBF-Fact-Sheet.pdf',
    tier: 2,
    accessed: '2026-10-17',
  },
  sandiskInvestorDay2026: {
    title: 'Sandisk 2026 Investor Day (2026-08-13), transcript of company presentations published by Stock Analysis',
    publisher: 'Sandisk',
    url: 'https://stockanalysis.com/stocks/sndk/transcripts/708061-investor-day-2026/',
    tier: 2,
    accessed: '2026-10-17',
  },
  samsungCmmD: {
    title: 'Samsung CMM-D Utilization in IMDB Applications (white paper, March 2026)',
    publisher: 'Samsung',
    url: 'https://download.semiconductor.samsung.com/resources/white-paper/Samsung_CMM-D_Utilization_in_IMDB_Applications.pdf',
    tier: 2,
    accessed: '2026-10-16',
  },
  r8gPreview: {
    title:
      'AWS News Blog: Join the preview for new memory-optimized, AWS Graviton4-powered Amazon EC2 instances (R8g) (2023-11-28)',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/blogs/aws/join-the-preview-for-new-memory-optimized-aws-graviton4-powered-amazon-ec2-instances-r8g/',
    tier: 2,
    accessed: '2026-10-16',
  },
  m9gGa: {
    title:
      'AWS News Blog: Now available: Amazon EC2 M9g and M9gd instances powered by new AWS Graviton5 processors (2026-06-10)',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/blogs/aws/now-available-amazon-ec2-m9g-and-m9gd-instances-powered-by-new-aws-graviton5-processors/',
    tier: 2,
    accessed: '2026-10-16',
  },

  // Third-party measurement, papers and analysis (Tier 3)
  luoHopperBench: {
    title: 'Benchmarking and Dissecting the Nvidia Hopper GPU Architecture (Luo et al., arXiv:2402.13499v1), Table IV',
    publisher: 'arXiv',
    url: 'https://arxiv.org/pdf/2402.13499',
    tier: 3,
    accessed: '2026-10-16',
  },
  chipsAndCheeseXeon6: {
    title: "A Look into Intel Xeon 6's Memory Subsystem (AWS r8i, Xeon 6 6985P-C)",
    publisher: 'Chips and Cheese',
    url: 'https://chipsandcheese.com/p/a-look-into-intel-xeon-6s-memory',
    tier: 3,
    accessed: '2026-10-17',
  },
  pond: {
    title: 'Pond: CXL-Based Memory Pooling Systems for Cloud Platforms (arXiv:2203.00241), Figure 4',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2203.00241',
    tier: 3,
    accessed: '2026-10-17',
  },
  maPatterson: {
    title:
      'Challenges and Research Directions for Large Language Model Inference Hardware (X. Ma and D. Patterson, Google; arXiv:2601.05047)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2601.05047',
    tier: 3,
    accessed: '2026-10-17',
  },
  flint: {
    title:
      'FLINT: Efficiently Leveraging High Bandwidth Flash for Capacity-Scalable LLM Inference Acceleration (G. F. Oliveira et al.; arXiv:2608.25062v1)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2608.25062',
    tier: 3,
    accessed: '2026-10-17',
  },
  hbfSim: {
    title:
      'HBFSim: Fast and Faithful Simulation of High-Bandwidth Flash Under Real GPU Execution (Y. Hu et al.; arXiv:2609.09800)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2609.09800',
    tier: 3,
    accessed: '2026-10-17',
  },
} satisfies Record<string, Source>;
