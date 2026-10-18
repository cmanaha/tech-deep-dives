import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/CerebrasWaferScale.tsx and src/components/CerebrasWaferDiagram.tsx.
 * Tiers and URLs follow research/2026-10-refresh/04-other-arch.md (sections 0 and 1, and the
 * Sources list). Records shared with other sections reuse their URL, title, publisher and
 * tier. Records accessed 2026-10-17 were fetched during authoring.
 */
export const S = {
  // Cerebras: filing, chip and system.
  cerebrasS1: {
    title: 'Cerebras Systems, Form S-1 (filed 2026-04-17)',
    publisher: 'Cerebras Systems (SEC EDGAR)',
    url: 'https://www.sec.gov/Archives/edgar/data/2021728/000162828026025762/cerebras-sx1april2026.htm',
    tier: 1,
    accessed: '2026-10-16',
  },
  wse3Press: {
    title:
      "Cerebras Systems Unveils World's Fastest AI Chip with Whopping 4 Trillion Transistors (WSE-3, 2024-03-13)",
    publisher: 'Cerebras',
    url: 'https://www.cerebras.ai/press-release/cerebras-announces-third-generation-wafer-scale-engine',
    tier: 2,
    accessed: '2026-10-17',
  },
  cerebrasSdkBlog: {
    title: 'Supercharge your HPC Research with the Cerebras SDK',
    publisher: 'Cerebras',
    url: 'https://www.cerebras.ai/blog/supercharge-your-hpc-research-with-the-cerebras-sdk',
    tier: 2,
    accessed: '2026-10-16',
  },
  cerebrasInferenceBlog: {
    title: 'Introducing Cerebras Inference: AI at Instant Speed (2024-08-27)',
    publisher: 'Cerebras',
    url: 'https://www.cerebras.ai/blog/introducing-cerebras-inference-ai-at-instant-speed',
    tier: 2,
    accessed: '2026-10-17',
  },
  cs4Press: {
    title: 'Cerebras Unveils CS-4: Up to 30 Times Faster than GPU-based Solutions (2026-08-18)',
    publisher: 'Cerebras',
    url: 'https://www.nasdaq.com/press-release/cerebras-unveils-cs-4-30-times-faster-gpu-based-solutions-2026-08-19',
    tier: 2,
    accessed: '2026-10-16',
  },
  cs4Blog: {
    title: 'Introducing Cerebras CS-4 (2026-08-18)',
    publisher: 'Cerebras',
    url: 'https://www.cerebras.ai/blog/introducing-cerebras-cs-4',
    tier: 2,
    accessed: '2026-10-17',
  },
  cerebrasChip: {
    title: 'Cerebras WSE-3 Turbo chip page',
    publisher: 'Cerebras',
    url: 'https://www.cerebras.ai/chip',
    tier: 2,
    accessed: '2026-10-17',
  },

  // Cerebras inference catalog and benchmarks.
  cerebrasModels: {
    title: 'Cerebras inference docs: Models overview',
    publisher: 'Cerebras',
    url: 'https://inference-docs.cerebras.ai/models/overview',
    tier: 2,
    accessed: '2026-10-17',
  },
  cerebrasGptOssPage: {
    title: 'Cerebras inference docs: OpenAI GPT OSS (gpt-oss-120b speed and pricing)',
    publisher: 'Cerebras',
    url: 'https://inference-docs.cerebras.ai/models/openai-oss',
    tier: 2,
    accessed: '2026-10-17',
  },
  maverickPress: {
    title: 'Cerebras Beats NVIDIA Blackwell in Llama 4 Maverick Inference (2025-05-28)',
    publisher: 'Cerebras',
    url: 'https://www.cerebras.ai/press-release/maverick',
    tier: 2,
    accessed: '2026-10-17',
  },

  // Model facts.
  gptOss120bReadme: {
    title: 'openai/gpt-oss-120b README at revision b5c939d',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/openai/gpt-oss-120b/blob/b5c939de8f754692c1647ca79fbf85e8c1e70f8a/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
  gptOss120bConfig: {
    title: 'openai/gpt-oss-120b config.json at revision b5c939d (quantization_config)',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/openai/gpt-oss-120b/blob/b5c939de8f754692c1647ca79fbf85e8c1e70f8a/config.json',
    tier: 1,
    accessed: '2026-10-17',
  },
  ocpMx: {
    title: 'OCP Microscaling Formats (MX) Specification v1.0',
    publisher: 'Open Compute Project',
    url: 'https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf',
    tier: 1,
    accessed: '2026-10-17',
  },

  // NVIDIA comparators.
  hopperArchBlog: {
    title: 'NVIDIA Hopper Architecture In-Depth',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/',
    tier: 2,
    accessed: '2026-10-16',
  },
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
  blackwellUltraBlog: {
    title: 'Inside NVIDIA Blackwell Ultra: The Chip Powering the AI Factory Era',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/',
    tier: 2,
    accessed: '2026-10-16',
  },
  gb300Nvl72: {
    title: 'NVIDIA GB300 NVL72',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/gb300-nvl72/',
    tier: 2,
    accessed: '2026-10-16',
  },
  inferenceMaxBlog: {
    title: 'NVIDIA Blackwell Raises Bar in New InferenceMAX Benchmarks (2025-10-09)',
    publisher: 'NVIDIA',
    url: 'https://blogs.nvidia.com/blog/blackwell-inferencemax-benchmark-results/',
    tier: 2,
    accessed: '2026-10-17',
  },

  // AWS path.
  awsCerebrasPress: {
    title:
      'AWS and Cerebras Collaboration Aims to Set a New Standard for AI Inference Speed and Performance in the Cloud (2026-03-13)',
    publisher: 'Amazon',
    url: 'https://press.aboutamazon.com/aws/2026/3/aws-and-cerebras-collaboration-aims-to-set-a-new-standard-for-ai-inference-speed-and-performance-in-the-cloud',
    tier: 2,
    accessed: '2026-10-17',
  },
  cerebrasAwsBlog: {
    title: 'Cerebras Is Coming to AWS Bedrock for Fast AI Inference (2026-03-13)',
    publisher: 'Cerebras',
    url: 'https://www.cerebras.ai/blog/cerebras-is-coming-to-aws',
    tier: 2,
    accessed: '2026-10-17',
  },
  awsMarketplaceListing: {
    title: 'AWS Marketplace: Cerebras Fast Inference Cloud',
    publisher: 'AWS Marketplace',
    url: 'https://aws.amazon.com/marketplace/pp/prodview-ph4bdvplhhz3o',
    tier: 2,
    accessed: '2026-10-17',
  },
  earningsCallSummary: {
    title: 'Summary of the Cerebras Q2 2026 earnings call (2026-08-12)',
    publisher: 'Bitget News',
    url: 'https://www.bitget.com/news/detail/12560605668861',
    tier: 3,
    accessed: '2026-10-17',
  },
} satisfies Record<string, Source>;
