import type { Source } from '../components/Cite';

/**
 * Sources for the Intel Xeon 6 section and its Xeon6Topology diagram.
 * Register: research/2026-10-refresh/03-aws-cpus.md, section 5.
 * Records shared with other sections reuse their URL, title, publisher and tier exactly.
 */
export const S = {
  // Intel product briefs, Tier 1 (vendor technical documentation)
  xeon6ProductBrief: {
    title: 'The Intel Xeon 6 Processor Family Product Brief',
    publisher: 'Intel',
    url: 'https://cdrdv2-public.intel.com/845771/Intel-Xeon6-ProductBrief.pdf',
    tier: 1,
    accessed: '2026-10-17',
  },
  xeon6700BriefPdf: {
    title: 'Intel Xeon 6700/6500-Series Processors with P-Cores, product brief (PDF)',
    publisher: 'Intel',
    url: 'https://www.intel.com/content/dam/www/central-libraries/us/en/documents/2025-02/xeon-6-granite-rapids-product-brief.pdf',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Intel roadmap and newer parts, Tier 2
  intelHotChips2026: {
    title: 'Intel Outlines Architectures for Agentic AI at Hot Chips 2026 (2026-08-24)',
    publisher: 'Intel',
    url: 'https://www.intel.com/content/www/us/en/newsroom/news/client-computing/intel-outlines-architectures-for-agentic-ai-at-hot-chips-2026.html',
    tier: 2,
    accessed: '2026-10-17',
  },
  intelXeon6Plus: {
    title: 'Intel Xeon 6+ processors product page',
    publisher: 'Intel',
    url: 'https://www.intel.com/content/www/us/en/products/details/processors/xeon/6-plus-series.html',
    tier: 2,
    accessed: '2026-10-17',
  },

  // Third-party measurement on AWS r8i, Tier 3
  chipsAndCheeseXeon6: {
    title: "A Look into Intel Xeon 6's Memory Subsystem (AWS r8i, Xeon 6 6985P-C)",
    publisher: 'Chips and Cheese',
    url: 'https://chipsandcheese.com/p/a-look-into-intel-xeon-6s-memory',
    tier: 3,
    accessed: '2026-10-17',
  },

  // AWS, shared with GravitonDeepDive and HeterogeneityFact
  ec2GeneralPurposeSpecs: {
    title: 'Amazon EC2 general purpose instance specifications',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  ec2ComputeOptimizedSpecs: {
    title: 'Amazon EC2 compute optimized instance specifications',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  ec2MemoryOptimizedSpecs: {
    title: 'Amazon EC2 memory optimized instance specifications',
    publisher: 'AWS',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/mo.html',
    tier: 1,
    accessed: '2026-10-17',
  },
  m8iPage: {
    title: 'Amazon EC2 M8i instances',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/ec2/instance-types/m8i/',
    tier: 2,
    accessed: '2026-10-17',
  },

  // AMX in LLVM and Clang, Tier 1 (source pinned to a tag), shared with KernelExecutionLifecycle
  llvmAmxIntrin: {
    title: 'Clang amxintrin.h at tag llvmorg-23.1.3 (tile size, LDTILECFG, TILELOADD, TDPBF16PS)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/clang/lib/Headers/amxintrin.h',
    tier: 1,
    accessed: '2026-10-17',
  },
  llvmAmxFp16Intrin: {
    title: 'Clang amxfp16intrin.h at tag llvmorg-23.1.3 (TDPFP16PS)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/clang/lib/Headers/amxfp16intrin.h',
    tier: 1,
    accessed: '2026-10-17',
  },
  llvmX86Registers: {
    title: 'LLVM X86RegisterInfo.td at tag llvmorg-23.1.3 (tile registers TMM0 to TMM7)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/llvm/lib/Target/X86/X86RegisterInfo.td',
    tier: 1,
    accessed: '2026-10-17',
  },
  llvmX86Td: {
    title: 'LLVM X86.td at tag llvmorg-23.1.3 (per-generation feature lists: SPR, GNR, DMR)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/llvm/lib/Target/X86/X86.td#L1243-L1310',
    tier: 1,
    accessed: '2026-10-16',
  },

  // Linux AMX permission, Tier 1, shared with KernelExecutionLifecycle
  linuxXstate: {
    title: 'Linux kernel Documentation/arch/x86/xstate.rst at tag v6.19 (AMX TILE_DATA, ARCH_REQ_XCOMP_PERM)',
    publisher: 'Linux kernel',
    url: 'https://github.com/torvalds/linux/blob/v6.19/Documentation/arch/x86/xstate.rst',
    tier: 1,
    accessed: '2026-10-17',
  },

  // oneDNN at release tag v3.13.4, Tier 1 (source pinned to a tag)
  oneDnnAmxPermission: {
    title: 'oneDNN src/cpu/x64/cpu_isa_traits.cpp at tag v3.13.4, lines 357-374 (AMX permission request)',
    publisher: 'UXL Foundation',
    url: 'https://github.com/uxlfoundation/oneDNN/blob/v3.13.4/src/cpu/x64/cpu_isa_traits.cpp#L357-L374',
    tier: 1,
    accessed: '2026-10-17',
  },
  oneDnnIsaTraits: {
    title: 'oneDNN src/cpu/x64/cpu_isa_traits.hpp at tag v3.13.4 (AMX dispatch tiers)',
    publisher: 'UXL Foundation',
    url: 'https://github.com/uxlfoundation/oneDNN/blob/v3.13.4/src/cpu/x64/cpu_isa_traits.hpp',
    tier: 1,
    accessed: '2026-10-16',
  },
  oneDnnMaxCpuIsa: {
    title: 'oneDNN src/cpu/x64/cpu_isa_traits.cpp at tag v3.13.4, lines 31-197 (MAX_CPU_ISA cap, ISA names, highest usable tier)',
    publisher: 'UXL Foundation',
    url: 'https://github.com/uxlfoundation/oneDNN/blob/v3.13.4/src/cpu/x64/cpu_isa_traits.cpp#L31-L197',
    tier: 1,
    accessed: '2026-10-17',
  },
  oneDnnVerbose: {
    title: 'oneDNN src/common/verbose.cpp at tag v3.13.4, lines 100-190 (VERBOSE header with the ISA line)',
    publisher: 'UXL Foundation',
    url: 'https://github.com/uxlfoundation/oneDNN/blob/v3.13.4/src/common/verbose.cpp#L100-L190',
    tier: 1,
    accessed: '2026-10-17',
  },
  oneDnnEnvPrefix: {
    title: 'oneDNN src/common/utils.cpp at tag v3.13.4, lines 112-126 (ONEDNN_ and DNNL_ environment prefixes)',
    publisher: 'UXL Foundation',
    url: 'https://github.com/uxlfoundation/oneDNN/blob/v3.13.4/src/common/utils.cpp#L112-L126',
    tier: 1,
    accessed: '2026-10-17',
  },
  oneDnnBuildOptions: {
    title: 'oneDNN cmake/options.cmake at tag v3.13.4, lines 333-335 (ENABLE_MAX_CPU_ISA defaults to ON)',
    publisher: 'UXL Foundation',
    url: 'https://github.com/uxlfoundation/oneDNN/blob/v3.13.4/cmake/options.cmake#L333-L335',
    tier: 1,
    accessed: '2026-10-17',
  },

  // IPEX archive, Tier 1 (repository README pinned to the archiving commit)
  ipexReadme: {
    title: 'intel-extension-for-pytorch README at commit 6d3ba89 (2026-03-30, repository archived)',
    publisher: 'Intel',
    url: 'https://github.com/intel/intel-extension-for-pytorch/blob/6d3ba89cf9c40eb7184d6092ab7fa9b5231553c1/README.md',
    tier: 1,
    accessed: '2026-10-17',
  },
} satisfies Record<string, Source>;
