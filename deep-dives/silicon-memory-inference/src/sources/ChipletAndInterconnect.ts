import type { Source } from "../components/Cite";

/**
 * Sources for src/sections/ChipletAndInterconnect.tsx and src/components/ChipletPathDiagram.tsx.
 * Register: research/2026-10-refresh/04-other-arch.md, section 3 (CI1 to CI39).
 * Records shared with other sections reuse their URL, title, publisher and tier exactly:
 * AMD records and the Turin measurements (AmdEpycTurin), the r8i measurement (IntelXeon6),
 * the Graviton records (GravitonDeepDive), the Blackwell records (NvidiaBlackwell,
 * GraceBlackwellUltraServer), the Hopper blog (NvidiaHopper) and the OCP HBF specification
 * (HighBandwidthFlash). The UCIe, UALink and
 * NVLink Fusion records were re-read during authoring on 2026-10-17.
 */
export const S = {
  // AMD first-party documentation (Tier 1)
  amdTurinArchWhitepaper: {
    title:
      "5th Gen AMD EPYC Processor Architecture (Data Center Solutions white paper, March 2025)",
    publisher: "AMD",
    url: "https://docs.amd.com/api/khub/documents/UIqhAbjRhgnzgzzdVU4pUw/content",
    tier: 1,
    accessed: "2026-10-17",
  },
  epyc9755Page: {
    title:
      "AMD EPYC 9755 product page (memory type, DDR5-6400 qualifier, per-socket memory bandwidth)",
    publisher: "AMD",
    url: "https://www.amd.com/en/products/processors/server/epyc/9005-series/amd-epyc-9755.html",
    tier: 1,
    accessed: "2026-10-17",
  },

  // AWS Graviton (Tier 1 processor table, Tier 2 announcement)
  gravitonReadme: {
    title: "aws-graviton-getting-started README at commit 8b322a4",
    publisher: "AWS",
    url: "https://github.com/aws/aws-graviton-getting-started/blob/8b322a4160b827be202beedaf35ce21b4c635603/README.md",
    tier: 1,
    accessed: "2026-10-16",
  },
  graviton5AboutAmazon: {
    title:
      "About Amazon: AWS Graviton5 (2025-12-04, updated 2026-06-10 for GA)",
    publisher: "AWS",
    url: "https://www.aboutamazon.com/news/aws/aws-graviton-5-cpu-amazon-ec2",
    tier: 2,
    accessed: "2026-10-16",
  },

  // NVIDIA (Tier 2)
  blackwellArchitecture: {
    title: "NVIDIA Blackwell architecture",
    publisher: "NVIDIA",
    url: "https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/",
    tier: 2,
    accessed: "2026-10-16",
  },
  blackwellUltraBlog: {
    title:
      "Inside NVIDIA Blackwell Ultra: The Chip Powering the AI Factory Era",
    publisher: "NVIDIA",
    url: "https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/",
    tier: 2,
    accessed: "2026-10-17",
  },
  hopperArchBlog: {
    title: "NVIDIA Hopper Architecture In-Depth",
    publisher: "NVIDIA",
    url: "https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/",
    tier: 2,
    accessed: "2026-10-17",
  },
  nvlinkFusionTrainium4: {
    title:
      "NVIDIA Technical Blog: AWS Integrates AI Infrastructure with NVIDIA NVLink Fusion for Trainium4 Deployment (2025-12-02)",
    publisher: "NVIDIA",
    url: "https://developer.nvidia.com/blog/aws-integrates-ai-infrastructure-with-nvidia-nvlink-fusion-for-trainium4-deployment/",
    tier: 2,
    accessed: "2026-10-17",
  },

  // Open interconnect standards (Tier 1: the standards bodies)
  ucieSpecs: {
    title: "UCIe Consortium: Specifications (UCIe 1.0, 1.1, 2.0, 3.0)",
    publisher: "UCIe Consortium",
    url: "https://www.uciexpress.org/specifications",
    tier: 1,
    accessed: "2026-10-17",
  },
  ocpSpec: {
    title:
      "High Bandwidth Flash (HBF) High-Level Base Die Specification, Version 0.7.0 (2026-08-03)",
    publisher: "Open Compute Project",
    url: "https://www.opencompute.org/documents/ocp-hbf-architecture-specification-v0-7-0-final-pdf",
    tier: 1,
    accessed: "2026-10-17",
  },
  ualinkFourSpecs: {
    title:
      "UALink Consortium press release: UALink Consortium Publishes Four Specifications (2026-04-07, PDF)",
    publisher: "UALink Consortium",
    url: "https://ualinkconsortium.org/wp-content/uploads/2026/04/UALink-2.0-Specification-PR_FINAL.pdf",
    tier: 1,
    accessed: "2026-10-17",
  },

  // Third-party measurements (Tier 3, never a vendor specification)
  chipsAndCheeseTurin: {
    title:
      "AMD's Turin: 5th Gen EPYC Launched (core-to-core latency on EPYC 9575F)",
    publisher: "Chips and Cheese",
    url: "https://chipsandcheese.com/p/amds-turin-5th-gen-epyc-launched",
    tier: 3,
    accessed: "2026-10-16",
  },
  chipsAndCheeseNps0: {
    title: "Evaluating Uniform Memory Access (NPS0 on a two-socket EPYC 9575F)",
    publisher: "Chips and Cheese",
    url: "https://chipsandcheese.com/p/evaluating-uniform-memory-access",
    tier: 3,
    accessed: "2026-10-17",
  },
  chipsAndCheeseZen5HotChips: {
    title: "Discussing AMD's Zen 5 at Hot Chips 2024",
    publisher: "Chips and Cheese",
    url: "https://chipsandcheese.com/p/discussing-amds-zen-5-at-hot-chips-2024",
    tier: 3,
    accessed: "2026-10-17",
  },
  chipsAndCheeseXeon6: {
    title:
      "A Look into Intel Xeon 6's Memory Subsystem (AWS r8i, Xeon 6 6985P-C)",
    publisher: "Chips and Cheese",
    url: "https://chipsandcheese.com/p/a-look-into-intel-xeon-6s-memory",
    tier: 3,
    accessed: "2026-10-17",
  },
  chipsAndCheeseGraviton4: {
    title: "Chips and Cheese: Arm's Neoverse V2 in AWS's Graviton 4",
    publisher: "Chips and Cheese",
    url: "https://chipsandcheese.com/p/arms-neoverse-v2-in-awss-graviton-4",
    tier: 3,
    accessed: "2026-10-16",
  },
} satisfies Record<string, Source>;
