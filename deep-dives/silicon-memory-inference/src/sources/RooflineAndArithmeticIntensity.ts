import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/RooflineAndArithmeticIntensity.tsx and
 * src/components/RooflineChart.tsx. Tiers and URLs follow
 * research/2026-10-refresh/05-workloads.md (section 3, the ridge-point
 * reference table and the Sources list), 02-nvidia.md (sections 0 to 2) and
 * 03-aws-cpus.md (sections 0 and 1). Records shared with other sections reuse
 * their URL, title, publisher and tier. The HGX page was re-fetched during
 * authoring (accessed 2026-10-17) for the B200 and B300 BF16 and FP8 rows and
 * the HGX Rubin NVL8 board figures. The AMD MI355X page, the FlashAttention-4
 * README and the NVIDIA structured-sparsity blog were fetched in the
 * verification pass (accessed 2026-10-18).
 */
export const S = {
  roofline: {
    title:
      'Roofline: An Insightful Visual Performance Model for Multicore Architectures (Williams, Waterman, Patterson, CACM 52(4), 2009), Crossref record',
    publisher: 'ACM',
    url: 'https://api.crossref.org/works/10.1145/1498765.1498785',
    tier: 3,
    accessed: '2026-10-16',
  },
  trainium2Arch: {
    title: 'AWS Neuron 2.32.0: Trainium2 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/about-neuron/arch/neuron-hardware/trainium2.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  trainium3Arch: {
    title: 'AWS Neuron 2.32.0: Trainium3 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/about-neuron/arch/neuron-hardware/trainium3.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  flashAttentionReadme: {
    title: 'FlashAttention README at tag v2.8.3.post2 (FlashAttention-3 beta)',
    publisher: 'Dao-AILab',
    url: 'https://github.com/Dao-AILab/flash-attention/blob/v2.8.3.post2/README.md',
    tier: 1,
    accessed: '2026-10-16',
  },
  fa4Readme: {
    title: 'FlashAttention README at tag fa4-v4.0.0.beta35 (FlashAttention-4 in CuTeDSL for Hopper and Blackwell)',
    publisher: 'Dao-AILab',
    url: 'https://github.com/Dao-AILab/flash-attention/blob/fa4-v4.0.0.beta35/README.md',
    tier: 1,
    accessed: '2026-10-18',
  },
  fa4Release: {
    title: 'FlashAttention release fa4-v4.0.0.beta35 (FlashAttention-4 beta, 2026-10-14)',
    publisher: 'Dao-AILab',
    url: 'https://github.com/Dao-AILab/flash-attention/releases/tag/fa4-v4.0.0.beta35',
    tier: 1,
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
  hopperArchBlog: {
    title: 'NVIDIA Hopper Architecture In-Depth',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/',
    tier: 2,
    accessed: '2026-10-16',
  },
  sparsityBlog: {
    title: 'Structured Sparsity in the NVIDIA Ampere Architecture and Applications in Search Engines (2023-07-03)',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/structured-sparsity-in-the-nvidia-ampere-architecture-and-applications-in-search-engines/',
    tier: 2,
    accessed: '2026-10-18',
  },
  dgxB200: {
    title: 'NVIDIA DGX B200',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/dgx-b200/',
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
    accessed: '2026-10-16',
  },
  amdMi355x: {
    title: 'AMD Instinct MI355X GPU',
    publisher: 'AMD',
    url: 'https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html',
    tier: 2,
    accessed: '2026-10-18',
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
