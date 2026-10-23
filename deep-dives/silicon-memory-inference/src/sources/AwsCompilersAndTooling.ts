import type { Source } from '../components/Cite';

/**
 * Sources for AWS Compilers and Kernel Tooling (AwsCompilersAndTooling.tsx and
 * AwsCompilerStack.tsx). Register: research/2026-10-refresh/03-aws-cpus.md
 * sections 0 and 2. Records shared with other sections reuse their URL, title,
 * publisher and tier exactly; pages re-read for this section carry the date
 * they were fetched.
 */
export const S = {
  // Compiler and NKI documentation (Tier 1)
  neuronCompiler: {
    title: 'AWS Neuron: Neuron Graph Compiler overview (neuronx-cc)',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/compiler/index.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  compilerCli: {
    title: 'AWS Neuron: Neuron Compiler CLI Reference Guide (neuronx-cc)',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/compiler/neuronx-cc/api-reference-guide/index.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  compilerNotes: {
    title: 'AWS Neuron 2.32.0: Component Release Notes for Neuron Graph Compiler',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/release-notes/components/compiler.html',
    tier: 1,
    accessed: '2026-10-23',
  },
  nkiOverview: {
    title: 'AWS Neuron: Neuron Kernel Interface (NKI) overview, "How NKI works"',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/index.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  nkiTrn2Arch: {
    title: 'AWS Neuron: NKI Trainium2 Architecture Guide',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/guides/architecture/trainium2_arch.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  nkiTrnInf2Arch: {
    title: 'AWS Neuron: NKI Trainium/Inferentia2 Architecture Guide',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/guides/architecture/trainium_inferentia2_arch.html',
    tier: 1,
    accessed: '2026-10-23',
  },
  ncMatmul: {
    title: 'AWS Neuron: NKI API reference, nki.isa.nc_matmul',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/api/generated/nki.isa.nc_matmul.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  nkiLibraryRepo: {
    title: 'aws-neuron/nki-library at release tag 2.32 (Apache-2.0)',
    publisher: 'AWS',
    url: 'https://github.com/aws-neuron/nki-library/tree/2.32',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Hardware pages, for dynamic shapes and control flow (Tier 1)
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
  intranodeCollectives: {
    title: 'AWS Neuron: Intra-node Collective Communications with AWS Neuron',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/explore/intranode-collective-comm.html',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Releases, frameworks and libraries (Tier 1)
  neuronWhatsNew: {
    title: "AWS Neuron: What's New in the AWS Neuron SDK (releases 2.27.0 to 2.32.0)",
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/whats-new.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  neuronReleaseNotes: {
    title: 'AWS Neuron 2.32.0: Release Notes (component versions)',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/release-notes/index.html',
    tier: 1,
    accessed: '2026-10-23',
  },
  pytorchNotes: {
    title: 'AWS Neuron 2.32.0: Component Release Notes for Neuron PyTorch Framework',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/release-notes/components/pytorch.html',
    tier: 1,
    accessed: '2026-10-23',
  },
  jaxNeuronx: {
    title: 'AWS Neuron 2.32.0: JAX Support on Neuron (JAX NeuronX)',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/frameworks/jax/index.html',
    tier: 1,
    accessed: '2026-10-23',
  },
  pytorchNative: {
    title: 'AWS Neuron 2.32.0: Native PyTorch for AWS Trainium (TorchNeuron)',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/frameworks/torch/pytorch-native-overview.html',
    tier: 1,
    accessed: '2026-10-23',
  },
  torchNeuron233: {
    title: 'AWS Neuron 2.33.0: What is TorchNeuron? (public beta)',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/torch/about-pytorch-neuron.html',
    tier: 1,
    accessed: '2026-10-23',
  },
  torchNeuronxRepo: {
    title: 'aws-neuron/torch-neuronx at release tag v2.33.0 (Apache-2.0)',
    publisher: 'AWS',
    url: 'https://github.com/aws-neuron/torch-neuronx/tree/v2.33.0',
    tier: 1,
    accessed: '2026-10-23',
  },
  vllmNeuronRepo: {
    title: 'vllm-project/vllm-neuron release v0.24.0.1.1.0 (Apache-2.0)',
    publisher: 'vLLM',
    url: 'https://github.com/vllm-project/vllm-neuron/releases/tag/v0.24.0.1.1.0',
    tier: 1,
    accessed: '2026-10-17',
  },
  neuronCache: {
    title: 'AWS Neuron: Neuron Persistent Cache',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-features/neuron-caching.html',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Tools (Tier 1)
  devToolsNotes: {
    title: 'AWS Neuron: Component Release Notes for Neuron Developer Tools (Neuron Explorer)',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/release-notes/components/dev-tools.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  neuronTopGuide: {
    title: 'AWS Neuron: neuron-top User Guide',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/tools/neuron-sys-tools/neuron-top-user-guide.html',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Triton, for the contrast with NKI (Tier 1, shared with NVIDIA Compilers and Kernel Tooling)
  gluonIntro: {
    title: 'Introduction to Gluon tutorial at Triton tag v3.8.0',
    publisher: 'Triton',
    url: 'https://github.com/triton-lang/triton/blob/v3.8.0/python/tutorials/gluon/01-intro.py',
    tier: 1,
    accessed: '2026-10-17',
  },
} satisfies Record<string, Source>;
