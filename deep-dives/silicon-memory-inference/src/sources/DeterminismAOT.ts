import type { Source } from "../components/Cite";

/**
 * Sources for the Determinism: NEFF and GPU Reproducibility section and
 * DeterminismDiagram. Register: research/2026-10-refresh/04-other-arch.md,
 * section 5 (DA1 to DA33). Records shared with other sections reuse their URL,
 * title, publisher and tier exactly. Records dated 2026-10-17 were re-read
 * during authoring.
 */
export const S = {
  // Trainium: what the NEFF fixes, and what the caller must pin
  nkiOverview: {
    title:
      'AWS Neuron 2.32.0: Neuron Kernel Interface (NKI) overview, "How NKI works"',
    publisher: "AWS",
    url: "https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/nki/index.html",
    tier: 1,
    accessed: "2026-10-16",
  },
  neuronCoreV3: {
    title: "AWS Neuron 2.32.0: NeuronCore-v3 Architecture",
    publisher: "AWS",
    url: "https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/about-neuron/arch/neuron-hardware/neuron-core-v3.html",
    tier: 1,
    accessed: "2026-10-16",
  },
  intranodeCollectives: {
    title: "AWS Neuron 2.32.0: Intra-node Collective Communications with AWS Neuron",
    publisher: "AWS",
    url: "https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/neuron-runtime/explore/intranode-collective-comm.html",
    tier: 1,
    accessed: "2026-10-17",
  },
  torchNeuron233: {
    title: "AWS Neuron 2.33.0: What is TorchNeuron? (public beta)",
    publisher: "AWS",
    url: "https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/torch/about-pytorch-neuron.html",
    tier: 1,
    accessed: "2026-10-24",
  },
  neuronRoundingModes: {
    title: "AWS Neuron 2.32.0: Neuron Rounding Modes (RNE and stochastic rounding)",
    publisher: "AWS",
    url: "https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/about-neuron/arch/neuron-features/rounding-modes.html",
    tier: 1,
    accessed: "2026-10-17",
  },
  neuronEnvVars: {
    title:
      "AWS Neuron 2.32.0: JAX NeuronX environment variables (NEURON_RT_STOCHASTIC_ROUNDING_SEED)",
    publisher: "AWS",
    url: "https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/frameworks/jax/api-reference-guide/neuron-envvars.html",
    tier: 1,
    accessed: "2026-10-23",
  },
  vllmNeuronBucketing: {
    title: "AWS Neuron 2.32.0: vLLM Neuron design, Decode Context-Length Bucketing",
    publisher: "AWS",
    url: "https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/vllm-neuron/docs/design/vllm/decode-context-length-bucketing.html",
    tier: 1,
    accessed: "2026-10-17",
  },
  neuronCompilerNotes: {
    title: "AWS Neuron 2.32.0: Component Release Notes for Neuron Graph Compiler",
    publisher: "AWS",
    url: "https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/release-notes/components/compiler.html",
    tier: 1,
    accessed: "2026-10-23",
  },
  nkiLibNotes: {
    title: "AWS Neuron 2.32.0: NKI Library release notes",
    publisher: "AWS",
    url: "https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/release-notes/components/nki-lib.html",
    tier: 1,
    accessed: "2026-10-16",
  },

  // NVIDIA GPU: library guarantees and the framework switches
  cublasReproducibility: {
    title:
      'NVIDIA cuBLAS documentation (CUDA 13.4), section 2.1.4 "Results Reproducibility"',
    publisher: "NVIDIA",
    url: "https://docs.nvidia.com/cuda/cublas/index.html",
    tier: 1,
    accessed: "2026-10-23",
  },
  cudnnReproducibility: {
    title:
      'NVIDIA cuDNN 9.27.0 backend documentation, "Odds and Ends: Reproducibility (Determinism)"',
    publisher: "NVIDIA",
    url: "https://docs.nvidia.com/deeplearning/cudnn/backend/v9.27.0/developer/misc.html",
    tier: 1,
    accessed: "2026-10-23",
  },
  pytorchReproducibility: {
    title:
      'PyTorch docs/source/notes/randomness.md at tag v2.14.1 ("Reproducibility")',
    publisher: "PyTorch",
    url: "https://github.com/pytorch/pytorch/blob/v2.14.1/docs/source/notes/randomness.md",
    tier: 1,
    accessed: "2026-10-17",
  },
  ccclV310: {
    title:
      "NVIDIA/cccl release v3.1.0 (2025-10-14): deterministic reductions in cub::DeviceReduce",
    publisher: "NVIDIA",
    url: "https://github.com/NVIDIA/cccl/releases/tag/v3.1.0",
    tier: 1,
    accessed: "2026-10-16",
  },
  ccclDeterminismBlog: {
    title: "Controlling Floating-Point Determinism in NVIDIA CCCL",
    publisher: "NVIDIA",
    url: "https://developer.nvidia.com/blog/controlling-floating-point-determinism-in-nvidia-cccl/",
    tier: 2,
    accessed: "2026-10-16",
  },

  // Serving engines: batch invariance
  vllmBatchInvariance: {
    title: "vLLM docs/features/batch_invariance.md at tag v0.31.0",
    publisher: "vLLM project",
    url: "https://github.com/vllm-project/vllm/blob/v0.31.0/docs/features/batch_invariance.md",
    tier: 1,
    accessed: "2026-10-17",
  },
  sglangDeterministic: {
    title:
      "SGLang docs/docs/advanced_features/deterministic_inference.mdx at tag v0.5.21",
    publisher: "SGLang",
    url: "https://github.com/sgl-project/sglang/blob/v0.5.21/docs/docs/advanced_features/deterministic_inference.mdx",
    tier: 1,
    accessed: "2026-10-17",
  },

  // MIG, for the SM-count condition
  migConcepts: {
    title: "NVIDIA Multi-Instance GPU User Guide: Concepts",
    publisher: "NVIDIA",
    url: "https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/concepts.html",
    tier: 1,
    accessed: "2026-10-17",
  },

  // Regulatory texts
  sr262Letter: {
    title: "SR 26-2: Revised Guidance on Model Risk Management (2026-04-17)",
    publisher: "Federal Reserve Board",
    url: "https://www.federalreserve.gov/supervisionreg/srletters/SR2602.htm",
    tier: 1,
    accessed: "2026-10-17",
  },
  sr262Guidance: {
    title:
      "SR 26-2 attachment: Revised Guidance on Model Risk Management (footnote 3, scope; section V, validation)",
    publisher: "Federal Reserve Board",
    url: "https://www.federalreserve.gov/supervisionreg/srletters/SR2602a1.pdf",
    tier: 1,
    accessed: "2026-10-17",
  },
  rts6: {
    title:
      "Commission Delegated Regulation (EU) 2017/589 (RTS 6), Articles 5, 9 and 28",
    publisher: "EUR-Lex",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32017R0589",
    tier: 1,
    accessed: "2026-10-17",
  },
  sec17a4: {
    title:
      "17 CFR 240.17a-4, Records to be preserved by certain exchange members, brokers and dealers, paragraph (e)(8)",
    publisher: "eCFR",
    url: "https://www.ecfr.gov/current/title-17/section-240.17a-4",
    tier: 1,
    accessed: "2026-10-17",
  },
  dora: {
    title:
      "Regulation (EU) 2022/2554 (DORA), Article 17: ICT-related incident management process",
    publisher: "EUR-Lex",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32022R2554",
    tier: 1,
    accessed: "2026-10-17",
  },
} satisfies Record<string, Source>;
