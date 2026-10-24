import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/ComputeInMemory.tsx and src/components/CimDiagram.tsx.
 * Tiers and URLs follow research/2026-10-refresh/01-memory.md section 5 and its
 * source list ([T1-48], [T1-49], [T2-30] to [T2-35], [T3-9], [T1-33]).
 * Records shared with another section file reuse its key, URL, title, publisher
 * and tier: samsungPimHc33 (HbmAndBandwidthWall) and deepseekV3Config
 * (MoeAndSparseActivation, FlashCacheTier). The IEEE Micro paper is Samsung-
 * authored, so its figures are Samsung's own measurements; it is Tier 3 as a paper.
 * Re-read on 2026-10-18 (records carry that date): the Hot Chips 35 slides (slides 3,
 * 7, 12 to 16, 20 read from the PDF text and page renders) and the SK hynix CES 2026
 * release (AiMX footnote). The Hot Chips 33 slides were re-read the same day to check
 * the figures; that record keeps the HBM section's access date so the two stay identical.
 */
export const S = {
  // Standards (Tier 1)
  jedecLpddr6Pim: {
    title:
      'JEDEC Previews LPDDR6 Roadmap Expanding LPDDR into Data Centers and Processing-in-Memory (2026-04-22)',
    publisher: 'JEDEC',
    url: 'https://www.jedec.org/news/pressreleases/jedec%C2%AE-previews-lpddr6-roadmap-expanding-lpddr-data-centers-and-processing-memory',
    tier: 1,
    accessed: '2026-10-16',
  },
  jedecJc426: {
    title: 'JEDEC JC-42.6 Low Power Memories committee page (published document list)',
    publisher: 'JEDEC',
    url: 'https://www.jedec.org/committees/jc-426',
    tier: 1,
    accessed: '2026-10-16',
  },

  // Model configuration (Tier 1, pinned)
  deepseekV3Config: {
    title: 'deepseek-ai/DeepSeek-V3 config.json at revision e815299',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/e815299b0bcbac849fa540c768ef21845365c9eb/config.json',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Samsung PIM (Tier 2 vendor slides and release)
  samsungPimHc33: {
    title:
      'Aquabolt-XL: Samsung HBM2-PIM with in-memory processing for ML accelerators and beyond (Hot Chips 33 slides, 2021-08-13)',
    publisher: 'Samsung',
    url: 'https://www.hc33.hotchips.org/assets/program/conference/day1/20210813_HC33_Aquabolt-XL_PIM_Jin_Kim_slide.pdf',
    tier: 2,
    accessed: '2026-10-16',
  },
  samsungPimHc35: {
    title:
      'Samsung PIM/PNM for Transformer based AI: Energy Efficiency on PIM/PNM Cluster (Hot Chips 35 slides, August 2023)',
    publisher: 'Samsung',
    url: 'https://www.hc2023.hotchips.org/assets/program/conference/day1/PIM/23_HC35_PIM_PNM_Samsung_final.pdf',
    tier: 2,
    accessed: '2026-10-18',
  },
  samsungHbmPimRelease: {
    title:
      "Samsung Develops Industry's First High Bandwidth Memory with AI Processing Power (2021-02-17)",
    publisher: 'Samsung',
    url: 'https://news.samsung.com/global/samsung-develops-industrys-first-high-bandwidth-memory-with-ai-processing-power',
    tier: 2,
    accessed: '2026-10-16',
  },

  // In-memory accelerators (Tier 2)
  dmatrixCorsairBrief: {
    title: 'd-Matrix Corsair product brief (PDF)',
    publisher: 'd-Matrix',
    url: 'https://d-matrix.ai/pdf/d-Matrix-Corsair-Product-Brief-FINAL.pdf',
    tier: 2,
    accessed: '2026-10-16',
  },
  dmatrixProduct: {
    title: 'd-Matrix Corsair product page: In-Memory Computing for AI',
    publisher: 'd-Matrix',
    url: 'https://www.d-matrix.ai/product/',
    tier: 2,
    accessed: '2026-10-16',
  },
  skhynixCes2026: {
    title: 'SK hynix Showcases Next-Generation AI Memory Innovations at CES 2026 (2026-01-06)',
    publisher: 'SK hynix',
    url: 'https://news.skhynix.com/en/sk-hynix-showcases-next-generation-ai-memory-innovations-at-ces-2026/',
    tier: 2,
    accessed: '2026-10-18',
  },

  // Papers (Tier 3)
  aquaboltIeeeMicro: {
    title:
      'Kim et al., Aquabolt-XL HBM2-PIM, LPDDR5-PIM With In-Memory Processing, and AXDIMM With Acceleration Buffer (IEEE Micro 42(3), 2022, DOI 10.1109/MM.2022.3164651)',
    publisher: 'IEEE Micro',
    url: 'https://experts.illinois.edu/en/publications/aquabolt-xl-hbm2-pim-lpddr5-pim-with-in-memory-processing-and-axd/',
    tier: 3,
    accessed: '2026-10-16',
  },
} satisfies Record<string, Source>;
