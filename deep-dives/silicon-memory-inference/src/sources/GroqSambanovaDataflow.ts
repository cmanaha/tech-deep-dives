import type { Source } from '../components/Cite';

/**
 * Sources for Groq, SambaNova and Dataflow (src/sections/GroqSambanovaDataflow.tsx)
 * and its diagram (src/components/DataflowSiliconDiagram.tsx).
 *
 * Register: research/2026-10-refresh/04-other-arch.md, sections 0 and 2 (GS1 to GS25).
 * Records shared with other sections reuse their URL, title, publisher and tier:
 * lpxBlog, lpxProduction, groqNvidiaLicense (ThesisAndFraming.ts, HeterogeneityFact.ts),
 * groqModels, sn40lPaper, sn50Blog (MoeAndSparseActivation.ts), neuronCoreV3
 * (AwsCustomSilicon.ts), nkiOverview (AwsCustomSilicon.ts, AwsCompilersAndTooling.ts),
 * veraRubinNvl72 (NvidiaBlackwell.ts). Records re-read for this section carry 2026-10-17;
 * records added in verification carry 2026-10-18.
 */
export const S = {
  // Groq and NVIDIA Groq 3 LPX (Tier 2: vendor blog, newsroom, product brief, docs).
  lpxBlog: {
    title:
      'Inside NVIDIA Groq 3 LPX: The Low-Latency Inference Accelerator for the NVIDIA Vera Rubin Platform (2026-03-16)',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/inside-nvidia-groq-3-lpx-the-low-latency-inference-accelerator-for-the-nvidia-vera-rubin-platform/',
    tier: 2,
    accessed: '2026-10-17',
  },
  lpxProduction: {
    title: 'NVIDIA Groq 3 LPX Now in Full Production With World-Class Speed for Agentic AI (2026-08-24)',
    publisher: 'NVIDIA',
    url: 'https://nvidianews.nvidia.com/news/nvidia-groq-3-lpx-now-in-full-production-with-world-class-speed-for-agentic-ai',
    tier: 2,
    accessed: '2026-10-17',
  },
  groqNvidiaLicense: {
    title: 'Groq and Nvidia Enter Non-Exclusive Inference Technology Licensing Agreement (2025-12-24)',
    publisher: 'Groq',
    url: 'https://groq.com/newsroom/groq-and-nvidia-enter-non-exclusive-inference-technology-licensing-agreement-to-accelerate-ai-inference-at-global-scale',
    tier: 2,
    accessed: '2026-10-17',
  },
  groqChipBrief: {
    title: 'GroqChip Processor product spec sheet (v1.5)',
    publisher: 'Groq',
    url: 'https://groq.com/product-spec-sheet-groqchip-processor/',
    tier: 2,
    accessed: '2026-10-17',
  },
  groqModels: {
    title: 'GroqCloud docs: Models',
    publisher: 'Groq',
    url: 'https://console.groq.com/docs/models',
    tier: 2,
    accessed: '2026-10-17',
  },

  // NVIDIA Vera Rubin (Tier 2 product page).
  veraRubinNvl72: {
    title: 'NVIDIA Vera Rubin NVL72',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/',
    tier: 2,
    accessed: '2026-10-17',
  },

  // AWS Trainium (Tier 1 docs).
  neuronCoreV3: {
    title: 'AWS Neuron 2.32.0: NeuronCore-v3 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/about-neuron/arch/neuron-hardware/neuron-core-v3.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  nkiOverview: {
    title: 'AWS Neuron 2.32.0: Neuron Kernel Interface (NKI) overview, "How NKI works"',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/nki/index.html',
    tier: 1,
    accessed: '2026-10-18',
  },

  // SambaNova. The SN40L paper is vendor-authored and author-measured; academic
  // papers are Tier 3 under CLAUDE.md.
  sn40lPaper: {
    title:
      'SambaNova SN40L: Scaling the AI Memory Wall with Dataflow and Composition of Experts (arXiv:2405.07518, MICRO 2024)',
    publisher: 'arXiv',
    url: 'https://arxiv.org/abs/2405.07518',
    tier: 3,
    accessed: '2026-10-17',
  },
  sn40lGenBlog: {
    title: "Inference Speed or Throughput? With RDUs, You Don't Have to Choose (2026-01-15)",
    publisher: 'SambaNova',
    url: 'https://sambanova.ai/blog/inference-speed-or-throughput-with-rdus-you-dont-have-to-choose',
    tier: 2,
    accessed: '2026-10-18',
  },
  sn50Blog: {
    title: 'Introducing the SN50 RDU: Purpose-Built for Agentic Inference (2026-02-24)',
    publisher: 'SambaNova',
    url: 'https://sambanova.ai/blog/introducing-the-sn50-rdu-purpose-built-for-agentic-inference',
    tier: 2,
    accessed: '2026-10-17',
  },
  sambanovaSeriesE: {
    title:
      'SambaNova Unveils Fastest Chip for Agentic AI, Collaborates with Intel, and Raises $350M+ (2026-02-24)',
    publisher: 'SambaNova',
    url: 'https://sambanova.ai/press/sambanova-unveils-fastest-chip-for-agentic-ai-collaborates-with-intel-and-raises-350m',
    tier: 2,
    accessed: '2026-10-17',
  },
} satisfies Record<string, Source>;
