import type { Source } from '../components/Cite';

/**
 * Sources for the AMD EPYC Turin section and EpycTurinTopology.
 * Register: research/2026-10-refresh/03-aws-cpus.md, section 4 (A1 to A45, N17 to N19).
 * Records shared with other sections reuse their URL, title, publisher and tier:
 * amdSdciWhitepaper and chipsAndCheeseTurin (CapitalMarketsLens), m8iPage
 * (HeterogeneityFact), the three EC2 specification pages (GravitonDeepDive).
 */
export const S = {
  // AMD first-party documentation
  amdTurinArchWhitepaper: {
    title: '5th Gen AMD EPYC Processor Architecture (Data Center Solutions white paper, March 2025)',
    publisher: 'AMD',
    url: 'https://docs.amd.com/api/khub/documents/UIqhAbjRhgnzgzzdVU4pUw/content',
    tier: 1,
    accessed: '2026-10-17',
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
  amdSdciWhitepaper: {
    title: 'AMD Solarflare X4 Low Latency Using SDCI (white paper, October 2025, Rev 1)',
    publisher: 'AMD',
    url: 'https://www.amd.com/content/dam/amd/en/documents/processor-tech-docs/white-papers/x4-sdci-whitepaper.pdf',
    tier: 2,
    accessed: '2026-10-17',
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

  // Linux kernel, pinned to release tags
  linuxResctrl: {
    title: 'Linux kernel Documentation/filesystems/resctrl.rst at tag v6.19 (io_alloc, io_alloc_cbm, SDCIAE)',
    publisher: 'Linux kernel',
    url: 'https://github.com/torvalds/linux/blob/v6.19/Documentation/filesystems/resctrl.rst',
    tier: 1,
    accessed: '2026-10-17',
  },
  linuxTph: {
    title: 'Linux kernel drivers/pci/tph.c at tag v6.13 (PCIe TLP Processing Hints; file absent at v6.12)',
    publisher: 'Linux kernel',
    url: 'https://github.com/torvalds/linux/blob/v6.13/drivers/pci/tph.c',
    tier: 1,
    accessed: '2026-10-17',
  },
  linuxNotphParam: {
    title: 'Linux kernel Documentation/admin-guide/kernel-parameters.txt at tag v6.13 (pci=notph)',
    publisher: 'Linux kernel',
    url: 'https://github.com/torvalds/linux/blob/v6.13/Documentation/admin-guide/kernel-parameters.txt#L4689-L4692',
    tier: 1,
    accessed: '2026-10-17',
  },
  linuxBnxtTph: {
    title: 'Linux kernel drivers/net/ethernet/broadcom/bnxt/bnxt.c at tag v6.19 (pcie_enable_tph and steering-tag entries)',
    publisher: 'Linux kernel',
    url: 'https://github.com/torvalds/linux/blob/v6.19/drivers/net/ethernet/broadcom/bnxt/bnxt.c#L11698',
    tier: 1,
    accessed: '2026-10-17',
  },

  // AWS
  m8aLaunchBlog: {
    title: 'AWS News Blog: New general-purpose Amazon EC2 M8a instances are now available (2025-10-08)',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/blogs/aws/new-general-purpose-amazon-ec2-m8a-instances-are-now-available/',
    tier: 2,
    accessed: '2026-10-17',
  },
  ec2AmdPage: {
    title: 'AWS and AMD: Amazon EC2 instances powered by AMD processors (M8a, C8a, R8a, M8azn, X8aedz, Hpc8a)',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/ec2/amd/',
    tier: 2,
    accessed: '2026-10-17',
  },
  ec2GeneralPurposeSpecs: {
    title: 'Amazon EC2 general purpose instance specifications',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  ec2ComputeOptimizedSpecs: {
    title: 'Amazon EC2 compute optimized instance specifications',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  ec2MemoryOptimizedSpecs: {
    title: 'Amazon EC2 memory optimized instance specifications',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/mo.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  ec2HpcSpecs: {
    title: 'Amazon EC2 high performance computing instance specifications',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/hpc.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  m8iPage: {
    title: 'Amazon EC2 M8i instances',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/ec2/instance-types/m8i/',
    tier: 2,
    accessed: '2026-10-17',
  },

  // Intel, for the parts that fill Turin's gaps
  xeon6ProductBrief: {
    title: 'The Intel Xeon 6 Processor Family Product Brief',
    publisher: 'Intel',
    url: 'https://cdrdv2-public.intel.com/845771/Intel-Xeon6-ProductBrief.pdf',
    tier: 1,
    accessed: '2026-10-16',
  },
  xeon6980pArk: {
    title: 'Intel Xeon 6980P processor specifications (ARK: 504 MB cache, 12 channels, DDR5-6400 or MRDIMM-8800)',
    publisher: 'Intel',
    url: 'https://www.intel.com/content/www/us/en/products/sku/240777/intel-xeon-6980p-processor-504m-cache-2-00-ghz/specifications.html',
    tier: 1,
    accessed: '2026-10-23',
  },

  // Third-party measurement and analysis (Tier 3, never an AMD specification)
  chipsAndCheeseTurin: {
    title: "AMD's Turin: 5th Gen EPYC Launched (core-to-core latency on EPYC 9575F)",
    publisher: 'Chips and Cheese',
    url: 'https://chipsandcheese.com/p/amds-turin-5th-gen-epyc-launched',
    tier: 3,
    accessed: '2026-10-16',
  },
  chipsAndCheeseNps0: {
    title: 'Evaluating Uniform Memory Access (NPS0 on a two-socket EPYC 9575F)',
    publisher: 'Chips and Cheese',
    url: 'https://chipsandcheese.com/p/evaluating-uniform-memory-access',
    tier: 3,
    accessed: '2026-10-17',
  },
  chipsAndCheeseZen5HotChips: {
    title: "Discussing AMD's Zen 5 at Hot Chips 2024",
    publisher: 'Chips and Cheese',
    url: 'https://chipsandcheese.com/p/discussing-amds-zen-5-at-hot-chips-2024',
    tier: 3,
    accessed: '2026-10-17',
  },
  chipsAndCheeseStrixPoint: {
    title: "AMD's Strix Point: Zen 5 Hits Mobile (Zen 5 L2 associativity and latency)",
    publisher: 'Chips and Cheese',
    url: 'https://chipsandcheese.com/p/amds-strix-point-zen-5-hits-mobile',
    tier: 3,
    accessed: '2026-10-17',
  },
} satisfies Record<string, Source>;
