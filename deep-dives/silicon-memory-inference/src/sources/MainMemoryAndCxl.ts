import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/MainMemoryAndCxl.tsx and
 * src/components/MemoryTechGrid.tsx. Register:
 * research/2026-10-refresh/01-memory.md section 3, plus hbf.md and
 * flash-cache-tier.md for the High Bandwidth Flash and NVMe flash cells of the
 * grid. Records shared with another section file reuse its URL, title,
 * publisher and tier exactly; records taken only from the register carry its
 * access date, 2026-10-16.
 */
export const S = {
  // JEDEC standards and committee pages (Tier 1)
  jedecDdr5: {
    title:
      'JEDEC Publishes New DDR5 Standard for Advancing Next-Generation High Performance Computing Systems (JESD79-5, 2020-07-14)',
    publisher: 'JEDEC',
    url: 'https://www.jedec.org/news/pressreleases/jedec-publishes-new-ddr5-standard-advancing-next-generation-high-performance',
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
  jedecMrdimmPlans: {
    title: 'JEDEC Unveils Plans for DDR5 MRDIMM and LPDDR6 CAMM Standards (2024-07-22)',
    publisher: 'JEDEC',
    url: 'https://www.jedec.org/news/pressreleases/jedec-unveils-plans-ddr5-mrdimm-and-lpddr6-camm-standards-propel-high-performance',
    tier: 1,
    accessed: '2026-10-16',
  },
  jedecMrdimmRoadmap: {
    title:
      'JEDEC Advances DDR5 MRDIMM Ecosystem with New Memory Interface Logic and Expanded MRDIMM Roadmap (2026-04-30)',
    publisher: 'JEDEC',
    url: 'https://www.jedec.org/news/pressreleases/jedec%C2%AE-advances-ddr5-mrdimm-ecosystem-new-memory-interface-logic-and-expanded',
    tier: 1,
    accessed: '2026-10-16',
  },
  jedecJc40: {
    title:
      'JEDEC JC-40 committee page (JESD82-542 DDR5MRCD02 and JESD82-552 DDR5MDB02 device standards, 2026)',
    publisher: 'JEDEC',
    url: 'https://www.jedec.org/committees/jc-40',
    tier: 1,
    accessed: '2026-10-16',
  },
  jedecSocamm2: {
    title:
      "JEDEC's SOCAMM2: Low Power Compact LPDDR5X Modules Poised to Power Next-Gen AI Servers (JESD328, 2025-10-20)",
    publisher: 'JEDEC',
    url: 'https://www.jedec.org/news/pressreleases/jedec%E2%80%99s-socamm2-low-power-compact-lpddr5x-modules-poised-power-next-gen-ai',
    tier: 1,
    accessed: '2026-10-16',
  },
  jedecJc45: {
    title: 'JEDEC JC-45 DRAM Modules committee page (JESD328 SOCAMM2, Jun 2026)',
    publisher: 'JEDEC',
    url: 'https://www.jedec.org/committees/jc-45',
    tier: 1,
    accessed: '2026-10-16',
  },
  jedecLpddr6: {
    title:
      'JEDEC Releases New LPDDR6 Standard to Enhance Mobile and AI Memory Performance (JESD209-6, 2025-07-09)',
    publisher: 'JEDEC',
    url: 'https://www.jedec.org/news/pressreleases/jedec%C2%AE-releases-new-lpddr6-standard-enhance-mobile-and-ai-memory-performance',
    tier: 1,
    accessed: '2026-10-16',
  },

  // CXL Consortium specification releases (Tier 1)
  cxl2Blog: {
    title: 'CXL Consortium blog: Compute Express Link 2.0 Specification Now Available (2020-12-02)',
    publisher: 'CXL Consortium',
    url: 'https://computeexpresslink.org/blog/compute-express-link-2-0-specification-now-available-2374/',
    tier: 1,
    accessed: '2026-10-23',
  },
  cxl3Spec: {
    title: 'CXL Consortium press release, CXL 3.0 specification (2022-08-02)',
    publisher: 'CXL Consortium',
    url: 'https://computeexpresslink.org/wp-content/uploads/2024/01/CXL_3.0-Specification-Release_FINAL-1.pdf',
    tier: 1,
    accessed: '2026-10-16',
  },
  cxl31Spec: {
    title: 'CXL Consortium press release, CXL 3.1 specification (2023-11-14)',
    publisher: 'CXL Consortium',
    url: 'https://computeexpresslink.org/wp-content/uploads/2024/01/CXL_3.1-Specification-Release_FINAL.pdf',
    tier: 1,
    accessed: '2026-10-16',
  },
  cxl32Spec: {
    title: 'CXL Consortium press release, CXL 3.2 specification (2024-12-03)',
    publisher: 'CXL Consortium',
    url: 'https://computeexpresslink.org/wp-content/uploads/2024/12/CXL_3.2-Spec-Announcement_FINAL-1.pdf',
    tier: 1,
    accessed: '2026-10-16',
  },
  cxl4Spec: {
    title: 'CXL Consortium press release, CXL 4.0 specification (2025-11-18)',
    publisher: 'CXL Consortium',
    url: 'https://computeexpresslink.org/wp-content/uploads/2025/11/CXL_4.0-Specification-Release_FINAL_Website-Copy.pdf',
    tier: 1,
    accessed: '2026-10-16',
  },

  // CPU vendor documentation (Tier 1)
  xeon6980pArk: {
    title: 'Intel Xeon 6980P processor specifications (ARK: 504 MB cache, 12 channels, DDR5-6400 or MRDIMM-8800)',
    publisher: 'Intel',
    url: 'https://www.intel.com/content/www/us/en/products/sku/240777/intel-xeon-6980p-processor-504m-cache-2-00-ghz/specifications.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  xeon6787pArk: {
    title:
      'Intel Xeon 6787P processor specifications (ARK: memory types MRDIMM(8800MT/s), maximum memory speed 8000 MT/s, 8 channels)',
    publisher: 'Intel',
    url: 'https://www.intel.com/content/www/us/en/products/sku/241844/intel-xeon-6787p-processor-336m-cache-2-00-ghz/specifications.html',
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
  epyc9755Page: {
    title: 'AMD EPYC 9755 product page (memory type, DDR5-6400 qualifier, per-socket memory bandwidth)',
    publisher: 'AMD',
    url: 'https://www.amd.com/en/products/processors/server/epyc/9005-series/amd-epyc-9755.html',
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

  // AWS documentation (Tier 1), shared with Flash as a Cache Tier for Inference
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
  gdsOverview: {
    title: 'NVIDIA GPUDirect Storage Overview Guide v1.19.1',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/gpudirect-storage/overview-guide/index.html',
    tier: 1,
    accessed: '2026-10-17',
  },

  // High Bandwidth Flash specification (Tier 1), shared with High Bandwidth Flash
  ocpSpec: {
    title: 'High Bandwidth Flash (HBF) High-Level Base Die Specification, Version 0.7.0 (2026-08-03)',
    publisher: 'Open Compute Project',
    url: 'https://www.opencompute.org/documents/ocp-hbf-architecture-specification-v0-7-0-final-pdf',
    tier: 1,
    accessed: '2026-10-17',
  },

  // CPU vendor product pages and blogs (Tier 2)
  epyc9996Page: {
    title:
      'AMD EPYC 9996 product page (16 channels; RDIMM up to 8000 MT/s, MRDIMM up to 12800 MT/s; 1024 / 1638 GB/s per socket)',
    publisher: 'AMD',
    url: 'https://www.amd.com/en/products/processors/server/epyc/9006-series/amd-epyc-9996.html',
    tier: 2,
    accessed: '2026-10-16',
  },
  amdVeniceBlog: {
    title:
      'AMD blog: Agentic AI: AMD EPYC 9005 CPUs Wins Today, EPYC 9006, formerly code-named "Venice", Takes It to a New Level (2026-07-23)',
    publisher: 'AMD',
    url: 'https://www.amd.com/en/blogs/2026/agentic-ai-amd-epyc-9005-cpus-wins-today-epyc-9006.html',
    tier: 2,
    accessed: '2026-10-17',
  },
  amdAgenticStack: {
    title:
      'AMD Newsroom: AMD EPYC CPUs Deliver for Every Layer of the Agentic AI Stack (2026-09-18; "Venice" in production, OEM platforms on track to launch)',
    publisher: 'AMD',
    url: 'https://newsroom.amd.com/news/amd-epyc-cpus-deliver-every-layer-agentic-ai-stack/',
    tier: 2,
    accessed: '2026-10-23',
  },
  graceCpuPage: {
    title: 'NVIDIA Grace CPU page (Vera CPU: SOCAMM LPDDR5X, 1.2 TB/s, 1.5 TB per CPU)',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/grace-cpu/',
    tier: 2,
    accessed: '2026-10-16',
  },
  graceSuperchipPage: {
    title: 'NVIDIA Grace CPU Superchip (Grace CPU C1 and Superchip specifications)',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/grace-cpu-superchip/',
    tier: 2,
    accessed: '2026-10-17',
  },
  gb200Nvl72: {
    title: 'NVIDIA GB200 NVL72',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/gb200-nvl72/',
    tier: 2,
    accessed: '2026-10-17',
  },
  micronHbm4: {
    title:
      'Micron in High-Volume Production of HBM4 Designed for NVIDIA Vera Rubin, PCIe Gen6 SSD and SOCAMM2 (2026-03-16)',
    publisher: 'Micron',
    url: 'https://investors.micron.com/news/press-release/2026/Micron-in-High-Volume-Production-of-HBM4-Designed-for-NVIDIA-Vera-Rubin-PCIe-Gen6-SSD-and-SOCAMM2-03-16-2026/default.aspx',
    tier: 2,
    accessed: '2026-10-16',
  },

  // AWS and Azure product pages and announcements (Tier 2)
  c9gGa: {
    title:
      'AWS News Blog: Amazon EC2 C9g and C9gd instances powered by AWS Graviton5 processors are now available (2026-06-30)',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/blogs/aws/amazon-ec2-c9g-and-c9gd-instances-powered-by-aws-graviton5-processors-are-now-available/',
    tier: 2,
    accessed: '2026-10-16',
  },
  r8gPage: {
    title: 'Amazon EC2 R8g instances (DDR5-5600; R8gn and R8gb DDR5-6400)',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/ec2/instance-types/r8g/',
    tier: 2,
    accessed: '2026-10-16',
  },
  r8iPage: {
    title: 'Amazon EC2 R8i instances',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/ec2/instance-types/r8i/',
    tier: 2,
    accessed: '2026-10-16',
  },
  m8iPage: {
    title: 'Amazon EC2 M8i instances',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/ec2/instance-types/m8i/',
    tier: 2,
    accessed: '2026-10-17',
  },
  x8iWhatsNew: {
    title: 'AWS What\'s New: Announcing Amazon EC2 Memory optimized X8i instances (2026-01-15)',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/about-aws/whats-new/2026/01/aws-amazon-ec2-x8i-generally-available',
    tier: 2,
    accessed: '2026-10-16',
  },
  azureCxl: {
    title:
      'Azure delivers the first cloud VM with Intel Xeon 6 and CXL memory, now in Private Preview (2025-11-18)',
    publisher: 'Microsoft',
    url: 'https://techcommunity.microsoft.com/blog/sapapplications/azure-delivers-the-first-cloud-vm-with-intel-xeon-6-and-cxl-memory---now-in-priv/4470067',
    tier: 2,
    accessed: '2026-10-16',
  },

  // Memory and flash vendor white papers and releases (Tier 2)
  samsungCmmD: {
    title: 'Samsung CMM-D Utilization in IMDB Applications (white paper, March 2026)',
    publisher: 'Samsung',
    url: 'https://download.semiconductor.samsung.com/resources/white-paper/Samsung_CMM-D_Utilization_in_IMDB_Applications.pdf',
    tier: 2,
    accessed: '2026-10-16',
  },
  samsungKvCxl: {
    title:
      'Optimizing KV Cache Offloading to CMM-D in a CXL Switch-based Memory Pool (white paper, June 2026)',
    publisher: 'Samsung',
    url: 'https://download.semiconductor.samsung.com/resources/white-paper/Optimizing_KV_Cache_Offloading_to_CMM-D_in_a_CXL_Switch-based_Memory_Pool.pdf',
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

  // Papers (Tier 3)
  pond: {
    title: 'Pond: CXL-Based Memory Pooling Systems for Cloud Platforms (arXiv:2203.00241)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2203.00241',
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
