import type { Source } from '../components/Cite';

/**
 * Sources for the Capital Markets Lens section and TickToTradeDiagram.
 * Register: research/2026-10-refresh/05-workloads.md, Section 30, plus
 * 01-memory.md (CXL latency) and 03-aws-cpus.md (NIE, Graviton5, EPYC, Xeon).
 * Records shared with other sections reuse their URL, title, publisher and tier.
 */
export const S = {
  // Trading path: kernel bypass, EFA scope, tail-latency sources
  moldUdp64: {
    title: 'MoldUDP64 Protocol Specification V 1.00 (UDP multicast downstream packets)',
    publisher: 'Nasdaq',
    url: 'https://www.nasdaqtrader.com/content/technicalsupport/specifications/dataproducts/moldudp64.pdf',
    tier: 1,
    accessed: '2026-10-23',
  },
  amdSdciWhitepaper: {
    title: 'AMD Solarflare X4 Low Latency Using SDCI (white paper, October 2025, Rev 1)',
    publisher: 'AMD',
    url: 'https://www.amd.com/content/dam/amd/en/documents/processor-tech-docs/white-papers/x4-sdci-whitepaper.pdf',
    tier: 2,
    accessed: '2026-10-17',
  },
  efaUserGuide: {
    title: 'Elastic Fabric Adapter for AI/ML and HPC workloads on Amazon EC2',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  libfabricEfaMan: {
    title: 'libfabric fi_efa(7) man page at commit 24fa1dc (EFA provider capabilities)',
    publisher: 'OpenFabrics Interfaces Working Group',
    url: 'https://github.com/ofiwg/libfabric/blob/24fa1dcfaa5cd10fc3d5ca5ea94690e9925c6848/man/fi_efa.7.md',
    tier: 1,
    accessed: '2026-10-16',
  },
  migConcepts: {
    title: 'NVIDIA Multi-Instance GPU User Guide: Concepts',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/concepts.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  chipsAndCheeseTurin: {
    title: "AMD's Turin: 5th Gen EPYC Launched (core-to-core latency on EPYC 9575F)",
    publisher: 'Chips and Cheese',
    url: 'https://chipsandcheese.com/p/amds-turin-5th-gen-epyc-launched',
    tier: 3,
    accessed: '2026-10-16',
  },
  vllmBatchInvariance: {
    title: 'vLLM docs/features/batch_invariance.md at tag v0.31.0',
    publisher: 'vLLM project',
    url: 'https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/batch_invariance.md',
    tier: 1,
    accessed: '2026-10-16',
  },
  neuronEnvVars: {
    title:
      'AWS Neuron 2.32.0: JAX NeuronX environment variables (NEURON_RT_STOCHASTIC_ROUNDING_SEED)',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/frameworks/jax/api-reference-guide/neuron-envvars.html',
    tier: 1,
    accessed: '2026-10-23',
  },
  pond: {
    title: 'Pond: CXL-Based Memory Pooling Systems for Cloud Platforms (arXiv:2203.00241)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2203.00241',
    tier: 3,
    accessed: '2026-10-17',
  },

  // Risk and valuation: Differential Machine Learning and the regulatory texts
  hugeSavine: {
    title: 'Huge and Savine, Differential Machine Learning (arXiv:2005.02347v4, 30 September 2020)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2005.02347v4',
    tier: 3,
    accessed: '2026-10-16',
  },
  smokingAdjoints: {
    title: 'Giles and Glasserman, Smoking adjoints: fast Monte Carlo Greeks (Risk, January 2006)',
    publisher: 'Risk.net',
    url: 'https://www.risk.net/derivatives/interest-rate-derivatives/1500261/smoking-adjoints-fast-monte-carlo-greeks',
    tier: 3,
    accessed: '2026-10-16',
  },
  bcbsD457: {
    title: 'BCBS d457: Minimum capital requirements for market risk (January 2019)',
    publisher: 'Bank for International Settlements',
    url: 'https://www.bis.org/bcbs/publ/d457.htm',
    tier: 1,
    accessed: '2026-10-16',
  },
  euFrtbDelegatedAct: {
    title:
      'Commission Delegated Regulation C(2026) 3647 of 4 June 2026: temporary relief measures and multipliers for own funds requirements for market risk',
    publisher: 'European Commission',
    url: 'https://finance.ec.europa.eu/document/download/d7962418-d7d8-4d03-a999-ec760637a67c_en?filename=crr-delegated-act-2026-3647_en.pdf',
    tier: 1,
    accessed: '2026-10-17',
  },
  praFrtbIma: {
    title:
      'PRA sets out adjustments to its market risk internal model approach under Basel 3.1 (19 June 2026)',
    publisher: 'Bank of England (PRA)',
    url: 'https://www.bankofengland.co.uk/news/2026/june/pra-adjustments-market-risk-internal-model-approach-under-basel31',
    tier: 1,
    accessed: '2026-10-17',
  },
  usCapitalProposal: {
    title:
      'News Release 2026-16: Agencies Request Comment on Proposals to Modernize the Regulatory Capital Framework (19 March 2026)',
    publisher: 'OCC',
    url: 'https://www.occ.gov/news-issuances/news-releases/2026/nr-ia-2026-16.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  simmAnnouncement: {
    title: 'ISDA Publishes ISDA SIMM Methodology, Version 2.8+2512 (12 June 2026)',
    publisher: 'ISDA',
    url: 'https://www.isda.org/2026/06/12/isda-publishes-isda-simm-methodology-version-2-8-2512/',
    tier: 1,
    accessed: '2026-10-16',
  },
  simmMethodology: {
    title: 'ISDA SIMM Methodology, version 2.8+2512 (public PDF)',
    publisher: 'ISDA',
    url: 'https://www.isda.org/a/hhkiE/ISDA-SIMM_v2.82512_PUBLIC.pdf',
    tier: 1,
    accessed: '2026-10-16',
  },
  dmlNotebooks: {
    title: 'differential-machine-learning/notebooks at commit 155055e',
    publisher: 'Huge and Savine (GitHub)',
    url: 'https://github.com/differential-machine-learning/notebooks/tree/155055eb891d151533530b70d039ad636ffeaf4b',
    tier: 1,
    accessed: '2026-10-17',
  },
  dmlAppendices: {
    title: 'differential-machine-learning/appendices at commit 585675e',
    publisher: 'Huge and Savine (GitHub)',
    url: 'https://github.com/differential-machine-learning/appendices/tree/585675ef05debbb9bb727d43f26ffb29e32ff25f',
    tier: 1,
    accessed: '2026-10-16',
  },

  // Where each workload lands: CPUs, isolation, accelerators
  gravitonReadme: {
    title: 'aws-graviton-getting-started README at commit 8b322a4',
    publisher: 'AWS',
    url: 'https://github.com/aws/aws-graviton-getting-started/blob/8b322a4160b827be202beedaf35ce21b4c635603/README.md',
    tier: 1,
    accessed: '2026-10-16',
  },
  m8aznGa: {
    title: "What's New: Amazon EC2 M8azn instances generally available (2026-02-12)",
    publisher: 'AWS',
    url: 'https://aws.amazon.com/about-aws/whats-new/2026/02/aws-m8azn-instances-generally-available/',
    tier: 2,
    accessed: '2026-10-16',
  },
  xeon6Brief: {
    title: 'Intel Xeon 6 Product Brief (up to 64 lanes of CXL 2.0 at up to 32 GT/s per lane)',
    publisher: 'Intel',
    url: 'https://www.intel.com/content/www/us/en/products/docs/xeon-6-product-brief.html',
    tier: 1,
    accessed: '2026-10-23',
  },
  ec2AcceleratedSpecs: {
    title: 'Amazon EC2 accelerated computing instance specifications',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  nieWhitepaper: {
    title: 'Nitro Isolation Engine whitepaper (June 2026)',
    publisher: 'AWS',
    url: 'https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/whitepapers/compliance/nitro-isolation-engine-whitepaper.pdf',
    tier: 1,
    accessed: '2026-10-17',
  },
  nieComputeBlog: {
    title:
      'AWS Nitro Isolation Engine: Formally verifying the hypervisor in the AWS Nitro System (2026-06-11)',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/blogs/compute/aws-nitro-isolation-engine-formally-verifying-the-hypervisor-in-the-aws-nitro-system/',
    tier: 2,
    accessed: '2026-10-17',
  },
  blackwellArchitecture: {
    title: 'NVIDIA Blackwell architecture',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/',
    tier: 2,
    accessed: '2026-10-16',
  },
} satisfies Record<string, Source>;
