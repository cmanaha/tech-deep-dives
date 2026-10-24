import type { Source } from '../components/Cite';

/**
 * Sources for AWS Compilers and Kernel Tooling (AwsCompilersAndTooling.tsx,
 * AwsCompilerStack.tsx and TorchNeuronStackDiagram.tsx). Registers:
 * research/2026-10-refresh/03-aws-cpus.md sections 0 and 2, and
 * research/2026-10-torchneuron/ (01-primary-sources.md, 02-code.md,
 * 03-semianalysis.md). Records shared with other sections reuse their URL,
 * title, publisher and tier exactly; pages re-read for this section carry the
 * date they were fetched.
 */

// torch-neuronx source at the v2.33.0 release tag (the only tag; the published
// wheel 2.14.3.0.281 carries the same Python code, register 02 row C31).
const TNX = 'https://github.com/aws-neuron/torch-neuronx/blob/v2.33.0';
const DOCS = 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0';

export const S = {
  // Compiler and NKI documentation (Tier 1)
  neuronCompiler: {
    title: 'AWS Neuron 2.33.0: Neuron Graph Compiler overview (neuronx-cc)',
    publisher: 'AWS',
    url: `${DOCS}/compiler/index.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  compilerCli: {
    title: 'AWS Neuron 2.33.0: Neuron Compiler CLI Reference Guide (neuronx-cc)',
    publisher: 'AWS',
    url: `${DOCS}/compiler/neuronx-cc/api-reference-guide/index.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  nkiOverview: {
    title: 'AWS Neuron 2.33.0: Neuron Kernel Interface (NKI) overview, "How NKI works"',
    publisher: 'AWS',
    url: `${DOCS}/nki/index.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  nkiTrn2Arch: {
    title: 'AWS Neuron 2.32.0: NKI Trainium2 Architecture Guide',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/nki/guides/architecture/trainium2_arch.html',
    tier: 1,
    accessed: '2026-10-16',
  },
  nkiTrnInf2Arch: {
    title: 'AWS Neuron 2.32.0: NKI Trainium/Inferentia2 Architecture Guide',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/nki/guides/architecture/trainium_inferentia2_arch.html',
    tier: 1,
    accessed: '2026-10-23',
  },
  ncMatmul: {
    title: 'AWS Neuron 2.32.0: NKI API reference, nki.isa.nc_matmul',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/nki/api/generated/nki.isa.nc_matmul.html',
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
  intranodeCollectives: {
    title: 'AWS Neuron 2.32.0: Intra-node Collective Communications with AWS Neuron',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/neuron-runtime/explore/intranode-collective-comm.html',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Releases, lifecycle and frameworks (Tier 1)
  neuronWhatsNew: {
    title: "AWS Neuron 2.32.0: What's New in the AWS Neuron SDK (releases 2.27.0 to 2.32.0)",
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/about-neuron/whats-new.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  whatsNew233: {
    title: "AWS Neuron 2.33.0: What's New",
    publisher: 'AWS',
    url: `${DOCS}/about-neuron/whats-new.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  releaseNotes233: {
    title: 'AWS Neuron 2.33.0: Release Notes (component versions)',
    publisher: 'AWS',
    url: `${DOCS}/release-notes/index.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  whatIsNeuron233: {
    title: 'AWS Neuron 2.33.0: What is AWS Neuron?',
    publisher: 'AWS',
    url: `${DOCS}/about-neuron/what-is-neuron.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  pytorchXlaNotes233: {
    title: 'AWS Neuron 2.33.0: PyTorch NeuronX (XLA build) component release notes',
    publisher: 'AWS',
    url: `${DOCS}/release-notes/components/pytorch.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  noXlaTraining: {
    title: 'AWS Neuron 2.33.0: Announcing no further support for PyTorch/XLA training on Trainium',
    publisher: 'AWS',
    url: `${DOCS}/about-neuron/announcements/neuron2.x/announce-no-support-pytorch-xla-training.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  nxdiArchive: {
    title: 'AWS Neuron 2.33.0: NxD Inference release notes (archived)',
    publisher: 'AWS',
    url: `${DOCS}/release-notes/archive/nxd-inference.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  neuronCache: {
    title: 'AWS Neuron 2.32.0: Neuron Persistent Cache',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/about-neuron/arch/neuron-features/neuron-caching.html',
    tier: 1,
    accessed: '2026-10-17',
  },

  // TorchNeuron documentation (Tier 1)
  torchNeuron233: {
    title: 'AWS Neuron 2.33.0: What is TorchNeuron? (public beta)',
    publisher: 'AWS',
    url: `${DOCS}/torch/about-pytorch-neuron.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  torchIndex233: {
    title: 'AWS Neuron 2.33.0: TorchNeuron, native PyTorch on AWS Neuron (what changes are needed)',
    publisher: 'AWS',
    url: `${DOCS}/torch/index.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  torchNeuronNotes: {
    title: 'AWS Neuron 2.33.0: TorchNeuron component release notes',
    publisher: 'AWS',
    url: `${DOCS}/release-notes/components/torchneuron.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  torchCompileRef: {
    title: 'AWS Neuron 2.33.0: torch.compile backend reference',
    publisher: 'AWS',
    url: `${DOCS}/torch/compile/reference-torch-compile.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  torchBestPractices: {
    title: 'AWS Neuron 2.33.0: Best practices for TorchNeuron',
    publisher: 'AWS',
    url: `${DOCS}/torch/reference/best-practices-pytorch-neuron.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  torchtitanAbout: {
    title: 'AWS Neuron 2.33.0: What is TorchTitan Neuron?',
    publisher: 'AWS',
    url: `${DOCS}/training/torchtitan/about-torchtitan-neuron.html`,
    tier: 1,
    accessed: '2026-10-24',
  },

  // vLLM Neuron (Tier 1)
  vllmNeuronNotes233: {
    title: 'AWS Neuron 2.33.0: vLLM Neuron component release notes',
    publisher: 'AWS',
    url: `${DOCS}/release-notes/components/vllm-neuron.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  vllmTorchNeuronDesign: {
    title: 'AWS Neuron 2.33.0: How vLLM Neuron is integrated with TorchNeuron',
    publisher: 'AWS',
    url: `${DOCS}/vllm-neuron/docs/design/compilation/how_vllm_is_integrated_with_torchneuron.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  vllmNeuronRepo: {
    title: 'vllm-project/vllm-neuron release v0.29.0.1.2.0 (Apache-2.0)',
    publisher: 'vLLM',
    url: 'https://github.com/vllm-project/vllm-neuron/releases/tag/v0.29.0.1.2.0',
    tier: 1,
    accessed: '2026-10-24',
  },
  vllmNeuronCoreReq: {
    title: 'vllm-neuron v0.29.0.1.2.0: requirements/core.txt (libtorch-neuronx-lite, vllm==0.29.0)',
    publisher: 'vLLM',
    url: 'https://github.com/vllm-project/vllm-neuron/blob/v0.29.0.1.2.0/requirements/core.txt#L5-L14',
    tier: 1,
    accessed: '2026-10-24',
  },
  vllmTorchPin: {
    title: 'vLLM v0.29.0: pyproject.toml, torch == 2.13.0',
    publisher: 'vLLM',
    url: 'https://github.com/vllm-project/vllm/blob/v0.29.0/pyproject.toml#L10',
    tier: 1,
    accessed: '2026-10-24',
  },

  // TorchNeuron source code at tag v2.33.0 (Tier 1)
  torchNeuronxRepo: {
    title: 'aws-neuron/torch-neuronx at release tag v2.33.0 (Apache-2.0)',
    publisher: 'AWS',
    url: 'https://github.com/aws-neuron/torch-neuronx/tree/v2.33.0',
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxDeviceRegistration: {
    title: 'torch-neuronx v2.33.0: torch_neuronx/__init__.py, PrivateUse1 renamed to "neuron"',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/__init__.py#L268-L277`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxEntryPoints: {
    title: 'torch-neuronx v2.33.0: pyproject.toml, torch.backends and torch_dynamo_backends entry points',
    publisher: 'AWS',
    url: `${TNX}/pyproject.toml#L12-L16`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxEagerOptLevel: {
    title: 'torch-neuronx v2.33.0: KernelExecution.cpp, eager compiles at -O1',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/csrc/core/KernelExecution.cpp#L100-L106`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxGraphCompileFlags: {
    title: 'torch-neuronx v2.33.0: KernelExecution.cpp, torch.compile graphs at -O2 with --auto-cast=none',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/csrc/core/KernelExecution.cpp#L173-L190`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxDispatchCacheKey: {
    title: 'torch-neuronx v2.33.0: CacheKeyGenerator.cpp, eager cache key (shapes, dtypes, strides)',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/csrc/core/cache/CacheKeyGenerator.cpp#L95-L118`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxAotAutograd: {
    title: 'torch-neuronx v2.33.0: neuron_dynamo_backend/backend.py, AOTAutograd forward and backward compilers',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/neuron_dynamo_backend/backend.py#L1893-L1904`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxDynamicUnread: {
    title: 'torch-neuronx v2.33.0: neuron_dynamo_backend/backend.py, options.setdefault("dynamic", False)',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/neuron_dynamo_backend/backend.py#L1859-L1862`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxFallbackLogDropped: {
    title: 'torch-neuronx v2.33.0: NeuronLogging.h, OPERATOR_FALLBACK log category returns without output',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/csrc/core/NeuronLogging.h#L60-L63`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxLoweringFailWarn: {
    title: 'torch-neuronx v2.33.0: NeuronDispatcher.cpp, TORCH_NEURONX_WARN when a Python lowering fails, then CPU fallback',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/csrc/core/dispatch/NeuronDispatcher.cpp#L2987-L2989`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxFallbackOnlyUnimplemented: {
    title: 'torch-neuronx v2.33.0: NeuronDispatcher.cpp, TORCH_NEURONX_FALLBACK_ONLY_FOR_UNIMPLEMENTED_OPS',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/csrc/core/dispatch/NeuronDispatcher.cpp#L2305-L2314`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxCompileRaises: {
    title: 'torch-neuronx v2.33.0: torch_neuronx/__init__.py, TORCH_NEURONX_DISABLE_FALLBACK_EXECUTION set to 1',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/__init__.py#L78`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxNeffCacheDir: {
    title: 'torch-neuronx v2.33.0: PersistentCacheBackend.cpp, TORCH_NEURONX_NEFF_CACHE_DIR default /tmp/neff_cache',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/csrc/core/cache/PersistentCacheBackend.cpp#L22-L28`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxNeffCacheDisable: {
    title: 'torch-neuronx v2.33.0: PersistentCacheBackend.cpp, TORCH_NEURONX_NEFF_DISABLE_CACHE',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/csrc/core/cache/PersistentCacheBackend.cpp#L55-L59`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxDisableNeffCacheHelper: {
    title: 'torch-neuronx v2.33.0: utils.py, is_neff_cache_disabled() reads TORCH_NEURONX_DISABLE_NEFF_CACHE (no caller)',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/utils.py#L370-L378`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxEnvVarsDoc: {
    title: 'torch-neuronx v2.33.0: docs/environment_variables.md (in-repo list, TORCH_NEURONX_DISABLE_NEFF_CACHE)',
    publisher: 'AWS',
    url: `${TNX}/docs/environment_variables.md#L84`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxNeffKeyCompilerVersion: {
    title: 'torch-neuronx v2.33.0: torch_neuronx/__init__.py, NEURONXCC_VERSION enters the persistent NEFF cache key',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/__init__.py#L151-L158`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxNkiCustomOp: {
    title: 'torch-neuronx v2.33.0: nki_hop.py, nki_op builds a torch.library custom op',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/nki_hop.py#L1248-L1258`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxNkiCustomCall: {
    title: 'torch-neuronx v2.33.0: vendored torch-mlir fx_importer.py, NKI kernel as a stablehlo.custom_call',
    publisher: 'AWS',
    url: `${TNX}/third_party/torch-mlir/python/torch_mlir/extras/fx_importer.py#L1831-L1877`,
    tier: 1,
    accessed: '2026-10-24',
  },
  nkiTorchHook: {
    title: 'nki 0.7.0 wheel (Neuron pip repository): nki/framework/kernel.py routes calls on neuron tensors to torch-neuronx',
    publisher: 'AWS',
    url: 'https://pip.repos.neuron.amazonaws.com/nki/nki-0.7.0%2B37713544100.gfede04bb-cp312-cp312-linux_x86_64.whl',
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxC10dBackend: {
    title: 'torch-neuronx v2.33.0: distributed/backend.py, c10d backend "neuron" registered',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/distributed/backend.py#L46-L50`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxFp8Trn2: {
    title: 'torch-neuronx v2.33.0: utils.py, float8_e4m3fn and float8_e8m0fnu reported unsupported on trn2',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/utils.py#L542-L560`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxPlatforms: {
    title: 'torch-neuronx v2.33.0: PlatformUtils.cpp, instance families and compiler targets',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/csrc/core/utils/PlatformUtils.cpp#L37-L69`,
    tier: 1,
    accessed: '2026-10-24',
  },
  tnxProfilerPlugin: {
    title: 'torch-neuronx v2.33.0: profiler/Registration.cpp, Kineto profiler factory',
    publisher: 'AWS',
    url: `${TNX}/torch_neuronx/csrc/profiler/Registration.cpp#L21-L24`,
    tier: 1,
    accessed: '2026-10-24',
  },
  torchtitanCompileBackend: {
    title: 'aws-neuron/torchtitan-neuron at tag release-2.33.0: compile_backend.py, default backend "neuron"',
    publisher: 'AWS',
    url: 'https://github.com/aws-neuron/torchtitan-neuron/blob/release-2.33.0/torchtitan_neuron/compile_backend.py#L33-L36',
    tier: 1,
    accessed: '2026-10-24',
  },

  // Tools (Tier 1)
  devToolsNotes: {
    title: 'AWS Neuron 2.32.0: Component Release Notes for Neuron Developer Tools (Neuron Explorer)',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/release-notes/components/dev-tools.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  devTools233: {
    title: 'AWS Neuron 2.33.0: Neuron Developer Tools component release notes',
    publisher: 'AWS',
    url: `${DOCS}/release-notes/components/dev-tools.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  neuronTopGuide: {
    title: 'AWS Neuron 2.32.0: neuron-top User Guide',
    publisher: 'AWS',
    url: 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/tools/neuron-sys-tools/neuron-top-user-guide.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  explorerCapture: {
    title: 'AWS Neuron 2.33.0: Capture profiles with Neuron Explorer',
    publisher: 'AWS',
    url: `${DOCS}/tools/neuron-explorer/how-to-profile-workload.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  explorerDeviceTrace: {
    title: 'AWS Neuron 2.33.0: Neuron Explorer device profiles overview',
    publisher: 'AWS',
    url: `${DOCS}/tools/neuron-explorer/overview-device-profiles.html`,
    tier: 1,
    accessed: '2026-10-24',
  },
  observerNotes: {
    title: 'AWS Neuron 2.33.0: Neuron Observer component release notes',
    publisher: 'AWS',
    url: `${DOCS}/release-notes/components/observer.html`,
    tier: 1,
    accessed: '2026-10-24',
  },

  // Triton, for the contrast with NKI (Tier 1, shared with NVIDIA Compilers and Kernel Tooling)
  gluonIntro: {
    title: 'Introduction to Gluon tutorial at Triton tag v3.8.0',
    publisher: 'Triton',
    url: 'https://github.com/triton-lang/triton/blob/v3.8.0/python/tutorials/gluon/01-intro.py',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Vendor and partner posts (Tier 2): every coverage or speed figure is a vendor claim
  pytorchBlog: {
    title: 'Introducing TorchNeuron: Native PyTorch backend for AWS Trainium (PyTorch blog, AWS authors)',
    publisher: 'AWS',
    url: 'https://pytorch.org/blog/introducing-torchneuron-native-pytorch-backend-for-aws-trainium/',
    tier: 2,
    accessed: '2026-10-24',
  },
  hfBlog: {
    title: 'TorchNeuron: running HF models on AWS Trainium is easier than ever',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/blog/hf-torchneuron',
    tier: 2,
    accessed: '2026-10-24',
  },
  trlTrainium: {
    title: 'TRL v1.16.0: Training on AWS Trainium',
    publisher: 'Hugging Face',
    url: 'https://huggingface.co/docs/trl/v1.16.0/en/aws_trainium',
    tier: 2,
    accessed: '2026-10-24',
  },

  // Third-party analysis (Tier 3), attributed in the sentence
  semiAnalysis: {
    title: "Amazon's Trainium Takes a Strike at the Training King",
    publisher: 'SemiAnalysis',
    url: 'https://newsletter.semianalysis.com/p/amazons-trainium-takes-a-strike-at',
    tier: 3,
    accessed: '2026-10-24',
  },
} satisfies Record<string, Source>;
