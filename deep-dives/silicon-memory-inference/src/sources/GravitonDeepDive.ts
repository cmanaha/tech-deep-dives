import type { Source } from '../components/Cite';

/**
 * Sources for src/sections/GravitonDeepDive.tsx and src/components/GravitonComparison.tsx.
 * Tiers and URLs follow research/2026-10-refresh/03-aws-cpus.md (section 3 and the
 * Sources list). Records shared with other sections reuse their URL, title, publisher
 * and tier. Records accessed 2026-10-17 were fetched during authoring (the R8g GA post,
 * the ONNX Runtime v1.17.0 release, and the EC2 instance specification pages, re-read
 * for per-size vCPU counts). The two QEMU records were added during verification
 * (2026-10-23): they carry the MMLA and BFMMLA matrix shapes, which LLVM's
 * definitions do not state.
 */
export const S = {
  // Tier 1: AWS processor table, guides and EC2 specifications, pinned code
  gravitonReadme: {
    title: 'aws-graviton-getting-started README at commit 8b322a4',
    publisher: 'AWS',
    url: 'https://github.com/aws/aws-graviton-getting-started/blob/8b322a4160b827be202beedaf35ce21b4c635603/README.md',
    tier: 1,
    accessed: '2026-10-16',
  },
  gravitonGuideRepo: {
    title: 'aws-graviton-getting-started repository at commit 8b322a4',
    publisher: 'AWS',
    url: 'https://github.com/aws/aws-graviton-getting-started/tree/8b322a4160b827be202beedaf35ce21b4c635603',
    tier: 1,
    accessed: '2026-10-16',
  },
  gravitonOnnx: {
    title: 'aws-graviton-getting-started machinelearning/onnx.md at commit 8b322a4',
    publisher: 'AWS',
    url: 'https://github.com/aws/aws-graviton-getting-started/blob/8b322a4160b827be202beedaf35ce21b4c635603/machinelearning/onnx.md',
    tier: 1,
    accessed: '2026-10-16',
  },
  gravitonLlamaCpp: {
    title: 'aws-graviton-getting-started machinelearning/llama.cpp.md at commit 8b322a4',
    publisher: 'AWS',
    url: 'https://github.com/aws/aws-graviton-getting-started/blob/8b322a4160b827be202beedaf35ce21b4c635603/machinelearning/llama.cpp.md',
    tier: 1,
    accessed: '2026-10-16',
  },
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
  llvmMatMulFormat: {
    title: 'AArch64InstrFormats.td at tag llvmorg-23.1.3 (SIMDThreeSameVectorMatMul, lines 9259-9265)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/llvm/lib/Target/AArch64/AArch64InstrFormats.td#L9259-L9265',
    tier: 1,
    accessed: '2026-10-16',
  },
  llvmMatMulDefs: {
    title: 'AArch64InstrInfo.td at tag llvmorg-23.1.3 (BFMMLA under HasBF16; SMMLA, UMMLA, USMMLA under HasMatMulInt8)',
    publisher: 'LLVM',
    url: 'https://github.com/llvm/llvm-project/blob/llvmorg-23.1.3/llvm/lib/Target/AArch64/AArch64InstrInfo.td#L1727-L1755',
    tier: 1,
    accessed: '2026-10-17',
  },
  qemuInt8Mmla: {
    title: 'QEMU target/arm/tcg/vec_helper.c at tag v11.1.2 (do_smmla_b to do_mmla_b, lines 2771-2834)',
    publisher: 'QEMU',
    url: 'https://github.com/qemu/qemu/blob/v11.1.2/target/arm/tcg/vec_helper.c#L2771-L2834',
    tier: 1,
    accessed: '2026-10-23',
  },
  qemuBfmmla: {
    title: 'QEMU target/arm/tcg/vec_helper.c at tag v11.1.2 (gvec_bfmmla, lines 3045-3119)',
    publisher: 'QEMU',
    url: 'https://github.com/qemu/qemu/blob/v11.1.2/target/arm/tcg/vec_helper.c#L3045-L3119',
    tier: 1,
    accessed: '2026-10-23',
  },
  onnxRuntime1170: {
    title: 'ONNX Runtime v1.17.0 release (published 2024-02-03)',
    publisher: 'Microsoft',
    url: 'https://github.com/microsoft/onnxruntime/releases/tag/v1.17.0',
    tier: 1,
    accessed: '2026-10-17',
  },

  // Tier 2: AWS News Blog, About Amazon, Arm product page
  r8gPreview: {
    title:
      'AWS News Blog: Join the preview for new memory-optimized, AWS Graviton4-powered Amazon EC2 instances (R8g) (2023-11-28)',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/blogs/aws/join-the-preview-for-new-memory-optimized-aws-graviton4-powered-amazon-ec2-instances-r8g/',
    tier: 2,
    accessed: '2026-10-16',
  },
  r8gGa: {
    title:
      'AWS News Blog: AWS Graviton4-based Amazon EC2 R8g instances: best price performance in Amazon EC2 (2024-07-09)',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/blogs/aws/aws-graviton4-based-amazon-ec2-r8g-instances-best-price-performance-in-amazon-ec2/',
    tier: 2,
    accessed: '2026-10-17',
  },
  graviton5AboutAmazon: {
    title: 'About Amazon: AWS Graviton5 (2025-12-04, updated 2026-06-10 for GA)',
    publisher: 'AWS',
    url: 'https://www.aboutamazon.com/news/aws/aws-graviton-5-cpu-amazon-ec2',
    tier: 2,
    accessed: '2026-10-16',
  },
  m9gGa: {
    title:
      'AWS News Blog: Now available: Amazon EC2 M9g and M9gd instances powered by new AWS Graviton5 processors (2026-06-10)',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/blogs/aws/now-available-amazon-ec2-m9g-and-m9gd-instances-powered-by-new-aws-graviton5-processors/',
    tier: 2,
    accessed: '2026-10-16',
  },
  c9gGa: {
    title:
      'AWS News Blog: Amazon EC2 C9g and C9gd instances powered by AWS Graviton5 processors are now available (2026-06-30)',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/blogs/aws/amazon-ec2-c9g-and-c9gd-instances-powered-by-aws-graviton5-processors-are-now-available/',
    tier: 2,
    accessed: '2026-10-16',
  },
  r9gGa: {
    title:
      'AWS News Blog: Amazon EC2 R9g and R9gd instances powered by AWS Graviton5 processors are now generally available (2026-08-31)',
    publisher: 'AWS',
    url: 'https://aws.amazon.com/blogs/aws/amazon-ec2-r9g-and-r9gd-instances-powered-by-aws-graviton5-processors-are-now-generally-available/',
    tier: 2,
    accessed: '2026-10-16',
  },
  armNeoverseV3: {
    title: 'Arm Neoverse V3 product page',
    publisher: 'Arm',
    url: 'https://www.arm.com/products/silicon-ip-cpu/neoverse/neoverse-v3',
    tier: 2,
    accessed: '2026-10-16',
  },

  // Tier 3: third-party measurement of Graviton4
  chipsAndCheeseGraviton4: {
    title: "Chips and Cheese: Arm's Neoverse V2 in AWS's Graviton 4",
    publisher: 'Chips and Cheese',
    url: 'https://chipsandcheese.com/p/arms-neoverse-v2-in-awss-graviton-4',
    tier: 3,
    accessed: '2026-10-16',
  },
} satisfies Record<string, Source>;
