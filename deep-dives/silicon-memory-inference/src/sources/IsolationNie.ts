import type { Source } from '../components/Cite';

/**
 * Sources for Isolation: NIE and MIG (IsolationNie.tsx and IsolationLayers.tsx).
 * Register: research/2026-10-refresh/03-aws-cpus.md section 6 (I1 to I35, N24 to
 * N26), with MIG and Blackwell facts from 02-nvidia.md section 0. Records shared
 * with other sections reuse their URL, title, publisher and tier exactly; pages
 * re-read for this section carry the date they were fetched.
 */
export const S = {
  // Nitro Isolation Engine
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
  ec2DataProtection: {
    title: 'Amazon EC2 User Guide: Data protection in Amazon EC2 (encryption in transit)',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/data-protection.html',
    tier: 1,
    accessed: '2026-10-17',
  },

  // NVIDIA MIG and confidential computing
  migConcepts: {
    title: 'NVIDIA Multi-Instance GPU User Guide: Concepts',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/concepts.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  migSupportedGpus: {
    title: 'NVIDIA Multi-Instance GPU User Guide: Supported GPUs',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/supported-gpus.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  migSupportedProfiles: {
    title: 'NVIDIA Multi-Instance GPU User Guide: Supported MIG Profiles (updated 2026-10-13)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/supported-mig-profiles.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  migDeviceNames: {
    title: 'NVIDIA Multi-Instance GPU User Guide: MIG Device Names',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/mig-device-names.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  migDeployment: {
    title: 'NVIDIA Multi-Instance GPU User Guide: Deployment Considerations',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/deployment-considerations.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  migGettingStarted: {
    title: 'NVIDIA Multi-Instance GPU User Guide: Getting Started with MIG',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/getting-started-with-mig.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  migProductPage: {
    title: 'NVIDIA Multi-Instance GPU (MIG) product page, "MIG Specifications"',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/technologies/multi-instance-gpu/',
    tier: 2,
    accessed: '2026-10-18',
  },
  blackwellUltraBlog: {
    title: 'Inside NVIDIA Blackwell Ultra: The Chip Powering the AI Factory Era',
    publisher: 'NVIDIA',
    url: 'https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/',
    tier: 2,
    accessed: '2026-10-17',
  },
  nvidiaSecureAi: {
    title:
      'NVIDIA Secure AI with Blackwell and Hopper GPUs (whitepaper WP-12554-001 v1.3, August 2025)',
    publisher: 'NVIDIA',
    url: 'https://docs.nvidia.com/nvidia-secure-ai-with-blackwell-and-hopper-gpus-whitepaper.pdf',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Trainium and the Neuron runtime
  neuronRuntimeConfig: {
    title:
      'AWS Neuron 2.32.0: Neuron Runtime configuration guide (NeuronCore reservation, NEURON_RT_VISIBLE_CORES)',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/neuron-runtime/guides/configuration-guide.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  nkiOverview: {
    title: 'AWS Neuron 2.32.0: Neuron Kernel Interface (NKI) overview, "How NKI works"',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/nki/index.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  nkiTrnInf2Arch: {
    title: 'AWS Neuron 2.32.0: NKI Trainium/Inferentia2 Architecture Guide',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/nki/guides/architecture/trainium_inferentia2_arch.html',
    tier: 1,
    accessed: '2026-10-18',
  },
  neuronCoreV3: {
    title: 'AWS Neuron 2.32.0: NeuronCore-v3 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/about-neuron/arch/neuron-hardware/neuron-core-v3.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  trainium2Arch: {
    title: 'AWS Neuron 2.32.0: Trainium2 Architecture',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/about-neuron/arch/neuron-hardware/trainium2.html',
    tier: 1,
    accessed: '2026-10-16',
  },
} satisfies Record<string, Source>;
