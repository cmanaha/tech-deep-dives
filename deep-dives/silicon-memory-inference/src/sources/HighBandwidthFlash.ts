import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/HighBandwidthFlash.tsx and its diagrams
 * (src/components/Hbf*.tsx). Tiers, titles and URLs follow
 * research/2026-10-refresh/hbf.md (Sources list); records marked M: in that
 * register come from research/2026-10-refresh/01-memory.md and keep its
 * accessed date. hgxPage reuses the NvidiaBlackwell record unchanged.
 *
 * The register grades arXiv papers Tier 1 for their own method and results; the
 * dive grades academic papers Tier 3 (authoring brief), and every result taken from
 * one is cited with kind 'simulated'. The 2025 Investor Day deck is a vendor
 * presentation, so it is Tier 2 here although the register grades it Tier 1.
 */
export const S = {
  // Specification (Tier 1) and the 2025 investor deck (Tier 2)
  ocpSpec: {
    title: 'High Bandwidth Flash (HBF) High-Level Base Die Specification, Version 0.7.0 (2026-08-03)',
    publisher: 'Open Compute Project',
    url: 'https://www.opencompute.org/documents/ocp-hbf-architecture-specification-v0-7-0-final-pdf',
    tier: 1,
    accessed: '2026-10-17',
  },
  sandiskInvestorDay2025: {
    title: 'Future FWD: Sandisk 2025 Investor Day presentation (2025-02-11)',
    publisher: 'Sandisk',
    url: 'https://documents.sandisk.com/content/dam/asset-library/en_us/assets/public/sandisk/corporate/Sandisk-Investor-Day_2025.pdf',
    tier: 2,
    accessed: '2026-10-17',
  },

  // Vendor press releases, fact sheets and transcripts
  sandiskFactSheet: {
    title: 'HBF Fact Sheet (Tech Brief, July 2025)',
    publisher: 'Sandisk',
    url: 'https://documents.sandisk.com/content/dam/asset-library/en_us/assets/public/sandisk/collateral/company/Sandisk-HBF-Fact-Sheet.pdf',
    tier: 2,
    accessed: '2026-10-17',
  },
  sandiskSkHynixMou: {
    title:
      'Sandisk to Collaborate with SK hynix to Drive Standardization of High-Bandwidth Flash Memory Technology (2025-08-06)',
    publisher: 'Sandisk',
    url: 'https://www.sandisk.com/company/newsroom/press-releases/2025/2025-08-06-sandisk-to-collaborate-with-sk-hynix-to-drive-standardization-of-high-bandwidth-flash-memory-technology',
    tier: 2,
    accessed: '2026-10-17',
  },
  sandiskOcpRelease: {
    title:
      'Sandisk and SK hynix Advance Global Standardization of High Bandwidth Flash with Release of First OCP Technical Specification (2026-08-03)',
    publisher: 'Sandisk',
    url: 'https://www.sandisk.com/company/newsroom/press-releases/2026/2026-08-03-Sandisk-and-sk-hynix-advance-global-standardization-of-hbf',
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
  skhynixOcp2025: {
    title: 'SK hynix Presents Next Generation NAND Storage Product Strategy at OCP 2025 (2025-10-26)',
    publisher: 'SK hynix',
    url: 'https://news.skhynix.com/en/sk-hynix-presents-next-generation-nand-storage-product-strategy-at-ocp-2025/',
    tier: 2,
    accessed: '2026-10-17',
  },
  skhynixOcp2026: {
    title:
      '"Memory-Centric Server Systems Are the Future": SK hynix Presents Its Next-Generation AI Infrastructure Vision at OCP Global Summit 2026 (2026-10-16)',
    publisher: 'SK hynix',
    url: 'https://news.skhynix.com/en/ocp-global-summit-2026/',
    tier: 2,
    accessed: '2026-10-17',
  },

  // Papers (author-simulated results)
  maPatterson: {
    title:
      'Challenges and Research Directions for Large Language Model Inference Hardware (X. Ma and D. Patterson, Google; arXiv:2601.05047)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2601.05047',
    tier: 3,
    accessed: '2026-10-17',
  },
  hbfSucks: {
    title:
      'HBF Sucks? A Full-Stack Characterization of High-Bandwidth Flash for KV-Centric LLM Serving (Z. Li et al.; arXiv:2608.11668v4)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2608.11668',
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
  flashAccel: {
    title:
      'FlashAccel: Leveraging High-Bandwidth Flash (HBF) for High-Throughput LLM Inference (arXiv:2607.10186v2)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2607.10186',
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
  splash: {
    title:
      'SPLASH: Co-Designing Sparse Attention with High-Bandwidth Flash for Efficient Long-Context Inference (arXiv:2609.23816)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2609.23816',
    tier: 3,
    accessed: '2026-10-17',
  },
  potentialApps: {
    title: 'Potential Applications of HBF in LLM Serving Systems (Y. Yin et al.; arXiv:2608.13127v2)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2608.13127',
    tier: 3,
    accessed: '2026-10-17',
  },

  // Trade press (Tier 3)
  tomsOxmiq: {
    title:
      'Hot Chips 2026: High Bandwidth Flash promises massive bandwidth and capacity, but its usability is extremely limited (2026-08-26)',
    publisher: "Tom's Hardware",
    url: 'https://www.tomshardware.com/pc-components/ssds/hot-chips-2026-high-bandwidth-flash-promises-massive-bandwidth-and-capacity-but-its-usability-is-extremely-limited-new-memory-format-strikes-a-balance-between-hbm-and-nand-flash',
    tier: 3,
    accessed: '2026-10-17',
  },
  sthOxmiq: {
    title: 'Oxmiq Labs HBF in AI Compute at Hot Chips 2026 (2026-08-27)',
    publisher: 'ServeTheHome',
    url: 'https://www.servethehome.com/oxmiq-labs-hbf-in-ai-compute-at-hot-chips-2026/',
    tier: 3,
    accessed: '2026-10-17',
  },
  trendforceTapeout: {
    title:
      'Sandisk Reportedly Tapes Out First HBF Product, Targets 2027 Samples and 2028 Production (2026-08-14)',
    publisher: 'TrendForce',
    url: 'https://www.trendforce.com/news/2026/08/14/news-sandisk-reportedly-tapes-out-first-hbf-product-targets-2027-samples-and-2028-production/',
    tier: 3,
    accessed: '2026-10-17',
  },
  blocksFilesKioxia: {
    title: 'Kioxia eyes GPU memory stack with high-bandwidth flash push (2026-03-20)',
    publisher: 'Blocks & Files',
    url: 'https://www.blocksandfiles.com/flash/2026/03/20/kioxia-eyes-gpu-memory-stack-with-high-bandwidth-flash-push/5210520',
    tier: 3,
    accessed: '2026-10-17',
  },
  digitimesSamsung: {
    title: 'Samsung signals zHBF push as memory race moves beyond HBM (2026-08-27)',
    publisher: 'DIGITIMES',
    url: 'https://www.digitimes.com/news/a20260827VL229/samsung-hbm-bandwidth-capacity-2026.html',
    tier: 3,
    accessed: '2026-10-17',
  },

  // Reused from 01-memory.md (accessed 2026-10-16)
  jedecHbm4: {
    title: 'JEDEC and Industry Leaders Collaborate to Release JESD270-4 HBM4 Standard (2025-04-16)',
    publisher: 'JEDEC',
    url: 'https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing',
    tier: 1,
    accessed: '2026-10-16',
  },
  deepseekV3Config: {
    title: 'deepseek-ai/DeepSeek-V3 config.json at revision e815299',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/e815299b0bcbac849fa540c768ef21845365c9eb/config.json',
    tier: 1,
    accessed: '2026-10-16',
  },
  samsungHbm4: {
    title: 'Samsung Ships Industry-First Commercial HBM4 With Ultimate Performance for AI Computing (2026-02-12)',
    publisher: 'Samsung',
    url: 'https://news.samsung.com/global/samsung-ships-industry-first-commercial-hbm4-with-ultimate-performance-for-ai-computing',
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
  skhynixHbm4: {
    title: 'SK hynix HBM4 product page',
    publisher: 'SK hynix',
    url: 'https://product.skhynix.com/products/dram/hbm/hbm4.go',
    tier: 2,
    accessed: '2026-10-16',
  },
  skhynixHbm4e: {
    title: 'SK hynix Ships Samples of 12-Layer Next-Gen HBM4E (2026-06-18)',
    publisher: 'SK hynix',
    url: 'https://news.skhynix.com/en/sk-hynix-ships-samples-of-12-layer-next-gen-hbm4e-2/',
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
  graceCpuPage: {
    title: 'NVIDIA Grace CPU page (Vera CPU: SOCAMM LPDDR5X, 1.2 TB/s, 1.5 TB per CPU)',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/grace-cpu/',
    tier: 2,
    accessed: '2026-10-16',
  },
  cxl3Spec: {
    title: 'CXL Consortium press release, CXL 3.0 specification (2022-08-02)',
    publisher: 'CXL Consortium',
    url: 'https://computeexpresslink.org/wp-content/uploads/2024/01/CXL_3.0-Specification-Release_FINAL-1.pdf',
    tier: 1,
    accessed: '2026-10-16',
  },
  deepseekV3Report: {
    title: 'DeepSeek-V3 Technical Report (arXiv:2412.19437)',
    publisher: 'DeepSeek-AI',
    url: 'https://arxiv.org/abs/2412.19437',
    tier: 2,
    accessed: '2026-10-16',
  },
} satisfies Record<string, Source>;
