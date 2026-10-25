import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import { Glossary, GlossaryEntry, SourcesAppendix, Source } from '@tech-deep-dives/shared';

// Source tiers (repo convention):
//  1 = source code at a pinned ref, official docs, API reference, release notes
//  2 = project or vendor blogs, talks, product pages (their numbers stay claims)
//  3 = third-party analysis, academic papers, benchmarks
// All access dates 2026-10-24. Code claims are pinned to the SGLang v0.5.22 tag (commit baa9befa).
// The full per-file citation list is generated into sources.md from the inline Cite components;
// this array is the curated reading list.

const sources: Source[] = [
  // SGLang: release, repository and documentation (Tier 1)
  { id: 1, title: 'SGLang v0.5.22 release notes', url: 'https://github.com/sgl-project/sglang/releases/tag/v0.5.22', tier: 1, type: 'announcement', accessDate: '2026-10-24' },
  { id: 2, title: 'SGLang repository at the v0.5.22 tag', url: 'https://github.com/sgl-project/sglang/tree/v0.5.22', tier: 1, type: 'source-code', accessDate: '2026-10-24' },
  { id: 3, title: 'SGLang README at v0.5.22', url: 'https://github.com/sgl-project/sglang/blob/v0.5.22/README.md', tier: 1, type: 'source-code', accessDate: '2026-10-24' },
  { id: 4, title: 'SGLang documentation source at v0.5.22 (docs/docs)', url: 'https://github.com/sgl-project/sglang/tree/v0.5.22/docs/docs', tier: 1, type: 'official-docs', accessDate: '2026-10-24' },
  { id: 5, title: 'SGLang documentation (rendered, tracks the default branch)', url: 'https://docs.sglang.io/', tier: 1, type: 'official-docs', accessDate: '2026-10-24' },
  { id: 6, title: 'SGLang server arguments at v0.5.22 (arg_groups/fields)', url: 'https://github.com/sgl-project/sglang/tree/v0.5.22/python/sglang/srt/arg_groups/fields', tier: 1, type: 'source-code', accessDate: '2026-10-24' },
  { id: 7, title: 'SGLang model gateway at v0.5.22 (sgl-model-gateway)', url: 'https://github.com/sgl-project/sglang/tree/v0.5.22/sgl-model-gateway', tier: 1, type: 'source-code', accessDate: '2026-10-24' },
  // vLLM comparison pin and AWS (Tier 1)
  { id: 8, title: 'vLLM repository at the v0.31.0 tag (comparison baseline)', url: 'https://github.com/vllm-project/vllm/tree/v0.31.0', tier: 1, type: 'source-code', accessDate: '2026-10-24' },
  { id: 9, title: 'AWS Deep Learning Containers at commit 23970ab (SGLang images)', url: 'https://github.com/aws/deep-learning-containers/tree/23970abd5b8919ea3e1add74692a0d056b2fcbd9', tier: 1, type: 'aws-open-source', accessDate: '2026-10-24' },
  { id: 10, title: 'Amazon SageMaker: custom inference code with hosting services', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/your-algorithms-inference-code.html', tier: 1, type: 'official-docs', accessDate: '2026-10-24' },
  { id: 11, title: 'Amazon SageMaker HyperPod: deploy models', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-deploy-ftm.html', tier: 1, type: 'official-docs', accessDate: '2026-10-24' },
  { id: 12, title: 'Amazon EKS: manage EFA devices on Amazon EKS', url: 'https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html', tier: 1, type: 'official-docs', accessDate: '2026-10-24' },
  { id: 13, title: 'Amazon EC2 accelerated computing instance specifications', url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html', tier: 1, type: 'official-docs', accessDate: '2026-10-24' },
  { id: 14, title: 'Amazon EC2: EFA and NIXL', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nixl.html', tier: 1, type: 'official-docs', accessDate: '2026-10-24' },
  // Project blog and paper (Tier 2 and Tier 3)
  { id: 15, title: 'LMSYS blog: Fast and Expressive LLM Inference with RadixAttention and SGLang (project claims)', url: 'https://lmsys.org/blog/2024-01-17-sglang/', tier: 2, type: 'blog', accessDate: '2026-10-24' },
  { id: 16, title: 'Zheng et al., SGLang: Efficient Execution of Structured Language Model Programs, arXiv 2312.07104v2', url: 'https://arxiv.org/abs/2312.07104v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-24' },
];

const glossary: GlossaryEntry[] = [
  // Runtime and scheduling
  { acronym: 'SGLang', fullForm: 'SGLang (project name)', description: 'Open-source LLM serving runtime from the sgl-project organisation, hosted by LMSYS. Its repository also carries a frontend language, marked deprecated at v0.5.22.' },
  { acronym: 'SRT', fullForm: 'SGLang Runtime', description: 'The serving engine inside SGLang: tokenizer, per-GPU schedulers and detokenizer. This dive is about the runtime.' },
  { acronym: 'RadixAttention', fullForm: 'RadixAttention', description: 'The attention layer every SGLang model calls. The prefix cache it is named after is a separate object, the radix cache.' },
  { acronym: 'HiCache', fullForm: 'Hierarchical cache', description: 'SGLang\'s tiering of the radix tree across GPU memory (L1), host memory (L2) and a storage backend (L3).' },
  { acronym: 'KV cache', fullForm: 'Key-value cache', description: 'The attention keys and values of every processed token, kept on the GPU so decode does not recompute them.' },
  { acronym: 'Retraction', fullForm: 'Retraction', description: 'SGLang\'s name for preemption: when KV memory runs out, running requests are re-queued and later recomputed.' },
  { acronym: 'ZMQ', fullForm: 'ZeroMQ', description: 'The messaging library SGLang\'s processes use to pass requests and outputs between the tokenizer, schedulers and detokenizer.' },
  { acronym: 'RPC', fullForm: 'Remote procedure call', description: 'A call made to code in another process or machine.' },
  { acronym: 'IPC', fullForm: 'Inter-process communication', description: 'Data exchange between processes on one host, for example CUDA IPC handles for GPU memory.' },
  { acronym: 'FCFS', fullForm: 'First-come-first-served', description: 'SGLang\'s default schedule policy: waiting requests are admitted in arrival order.' },
  { acronym: 'LPM', fullForm: 'Longest prefix match', description: 'An opt-in SGLang schedule policy that admits the waiting request with the longest cached prefix first.' },
  { acronym: 'HRRN', fullForm: 'Highest response ratio next', description: 'A scheduling rule that weighs waiting time against expected service time.' },
  { acronym: 'LRU', fullForm: 'Least recently used', description: 'An eviction order that removes the entry used longest ago. The radix cache\'s default.' },
  { acronym: 'LFU', fullForm: 'Least frequently used', description: 'An eviction order that removes the entry used fewest times.' },
  { acronym: 'SLRU', fullForm: 'Segmented LRU', description: 'An LRU variant with a probationary and a protected segment.' },
  { acronym: 'EOS', fullForm: 'End of sequence', description: 'The token that ends a generation.' },
  { acronym: 'TTFT', fullForm: 'Time to first token', description: 'Latency from request arrival to the first output token.' },
  { acronym: 'ITL', fullForm: 'Inter-token latency', description: 'Time between consecutive output tokens of one request.' },
  { acronym: 'TPOT', fullForm: 'Time per output token', description: 'Average decode time per generated token.' },
  { acronym: 'TPS', fullForm: 'Tokens per second', description: 'A throughput measure.' },
  { acronym: 'FSM', fullForm: 'Finite state machine', description: 'The grammar state a structured-output backend advances one token at a time.' },
  { acronym: 'EBNF', fullForm: 'Extended Backus-Naur Form', description: 'A notation for context-free grammars, accepted as a structured-output constraint.' },
  { acronym: 'MTP', fullForm: 'Multi-token prediction', description: 'Extra model heads that propose several next tokens, used as a speculative-decoding draft.' },
  { acronym: 'TBO', fullForm: 'Two-batch overlap', description: 'SGLang\'s split of a batch into two micro-batches so one computes while the other communicates. The counterpart of vLLM\'s DBO.' },
  { acronym: 'SBO', fullForm: 'Single-batch overlap', description: 'SGLang\'s overlap of communication and compute inside one batch.' },
  { acronym: 'DBO', fullForm: 'Dual-batch overlap', description: 'vLLM\'s counterpart of SGLang\'s two-batch overlap.' },
  // Parallelism and disaggregation
  { acronym: 'TP', fullForm: 'Tensor parallelism', description: 'Splits each layer\'s weights and attention heads across GPUs that compute every token together.' },
  { acronym: 'PP', fullForm: 'Pipeline parallelism', description: 'Splits a model\'s layers into stages on different GPUs.' },
  { acronym: 'DP', fullForm: 'Data parallelism', description: 'Runs independent replicas, each serving its own requests. Attention DP splits only the attention layers this way inside one TP group.' },
  { acronym: 'EP', fullForm: 'Expert parallelism', description: 'Places different mixture-of-experts experts on different GPUs and routes tokens to them with an all-to-all exchange.' },
  { acronym: 'MoE', fullForm: 'Mixture of experts', description: 'A model whose feed-forward layers route each token to a few of many expert sub-networks.' },
  { acronym: 'EPLB', fullForm: 'Expert-parallel load balancer', description: 'Rebalances which GPU holds which expert; at v0.5.22 it counts forward passes, not requests.' },
  { acronym: 'CP, DCP', fullForm: 'Context parallelism, decode context parallelism', description: 'Split the tokens of one request across GPUs, during prefill (CP) or for the KV cache in decode (DCP).' },
  { acronym: 'PCP', fullForm: 'Prefill context parallelism', description: 'vLLM\'s term for context parallelism during prefill, the counterpart of SGLang\'s prefill CP.' },
  { acronym: 'PD', fullForm: 'Prefill/decode disaggregation', description: 'Runs prompt processing and token generation on separate servers and moves the KV cache between them.' },
  { acronym: 'EPD', fullForm: 'Encoder-prefill-decode disaggregation', description: 'Adds a separate encoder stage, for multimodal inputs, in front of PD.' },
  // Attention, kernels and number formats
  { acronym: 'MHA, GQA', fullForm: 'Multi-head and grouped-query attention', description: 'Attention with one KV head per query head (MHA), or with query heads sharing fewer KV heads (GQA).' },
  { acronym: 'MLA', fullForm: 'Multi-head latent attention', description: 'DeepSeek\'s attention that stores a compressed latent per token in place of full keys and values.' },
  { acronym: 'DSA', fullForm: 'DeepSeek Sparse Attention', description: 'DeepSeek\'s attention that reads only a selected subset of past tokens.' },
  { acronym: 'FA3, FA4', fullForm: 'FlashAttention 3 and 4', description: 'Attention kernel generations. SGLang uses its own fork of FA3.' },
  { acronym: 'TRT-LLM', fullForm: 'TensorRT-LLM', description: 'NVIDIA\'s inference library, the source of the trtllm attention kernels SGLang can select.' },
  { acronym: 'CUTLASS', fullForm: 'CUDA Templates for Linear Algebra Subroutines', description: 'NVIDIA\'s template library for GEMM and related kernels.' },
  { acronym: 'CuTe DSL', fullForm: 'CuTe domain-specific language', description: 'NVIDIA\'s Python interface for writing CUTLASS-style kernels.' },
  { acronym: 'GEMM', fullForm: 'General matrix multiply', description: 'The matrix multiplication behind linear layers.' },
  { acronym: 'JIT, AOT', fullForm: 'Just-in-time, ahead-of-time', description: 'Kernels compiled when first needed (JIT) or before the server starts (AOT).' },
  { acronym: 'ROCm', fullForm: 'ROCm', description: 'AMD\'s GPU software stack.' },
  { acronym: 'AITER', fullForm: 'AI Tensor Engine for ROCm', description: 'AMD\'s kernel library for ROCm.' },
  { acronym: 'LSE', fullForm: 'Log-sum-exp', description: 'The softmax normaliser attention kernels return so partial results can be merged.' },
  { acronym: 'SM90, SM100, SM103, SM120', fullForm: 'CUDA compute capability 9.0, 10.0, 10.3, 12.0', description: 'NVIDIA GPU generations: Hopper (SM90, H100 and H200), data-centre Blackwell (SM100 B200, SM103 B300) and RTX PRO Blackwell (SM120). SGLang picks defaults by this number.' },
  { acronym: 'MPS', fullForm: 'Metal Performance Shaders', description: 'Apple\'s GPU compute framework, used for SGLang on Apple Silicon.' },
  { acronym: 'NPU', fullForm: 'Neural processing unit', description: 'A dedicated AI accelerator, for example Huawei Ascend.' },
  { acronym: 'XPU', fullForm: 'Intel GPU device type', description: 'PyTorch\'s device name for Intel GPUs.' },
  { acronym: 'TPU', fullForm: 'Tensor Processing Unit', description: 'Google\'s AI accelerator.' },
  { acronym: 'AMX', fullForm: 'Advanced Matrix Extensions', description: 'Intel CPU instructions for matrix math.' },
  { acronym: 'FP8, FP4', fullForm: '8-bit and 4-bit floating point', description: 'Reduced-precision formats for weights, activations and the KV cache.' },
  { acronym: 'E4M3, E5M2, E2M1', fullForm: 'Exponent and mantissa bit counts', description: 'FP8 with 4 exponent and 3 mantissa bits (E4M3, maximum 448) or 5 and 2 (E5M2); FP4 with 2 and 1 (E2M1).' },
  { acronym: 'FNUZ', fullForm: 'FP8 variant on AMD MI300', description: 'An E4M3 encoding with no infinity, used by AMD\'s MI300.' },
  { acronym: 'NVFP4, MXFP4, MXFP8', fullForm: 'Block-scaled low-precision formats', description: 'NVIDIA\'s 4-bit format with 16-value blocks (NVFP4) and the OCP microscaling formats (MXFP4, MXFP8).' },
  { acronym: 'OCP', fullForm: 'Open Compute Project', description: 'The industry body that published the microscaling (MX) formats.' },
  { acronym: 'BF16, FP16', fullForm: 'Bfloat16, half precision', description: '16-bit floating-point formats.' },
  { acronym: 'W8A8, W4A8, W4A16', fullForm: 'Weight and activation bit widths', description: 'Quantization schemes named by weight bits and activation bits.' },
  { acronym: 'ModelOpt', fullForm: 'NVIDIA Model Optimizer', description: 'NVIDIA\'s quantization toolkit that produces FP8 and FP4 checkpoints.' },
  { acronym: 'LoRA', fullForm: 'Low-rank adaptation', description: 'Small adapter matrices fine-tuned on top of a frozen base model.' },
  { acronym: 'SGMV', fullForm: 'Segmented gather matrix-vector multiplication', description: 'A kernel that applies different LoRA adapters to different requests in one batch.' },
  // Networking and KV transfer
  { acronym: 'RDMA', fullForm: 'Remote direct memory access', description: 'Reading or writing another host\'s memory without involving its CPU.' },
  { acronym: 'EFA', fullForm: 'Elastic Fabric Adapter', description: 'The AWS network interface for OS-bypass, RDMA-style traffic between EC2 instances.' },
  { acronym: 'EFA-GDA', fullForm: 'Elastic Fabric Adapter GPU Direct Async', description: 'GPU-initiated EFA traffic, the NCCL GIN backend on P5en, P6-B200 and P6-B300.' },
  { acronym: 'NCCL', fullForm: 'NVIDIA Collective Communications Library', description: 'The library for all-reduce, all-to-all and other collectives across GPUs.' },
  { acronym: 'GIN', fullForm: 'GPU-Initiated Networking', description: 'NCCL\'s interface for network operations issued from GPU kernels.' },
  { acronym: 'NVSHMEM', fullForm: 'NVIDIA\'s OpenSHMEM library', description: 'A GPU-initiated communication library used by DeepEP.' },
  { acronym: 'IBGDA', fullForm: 'InfiniBand GPU Direct Async', description: 'GPU-initiated RDMA over InfiniBand.' },
  { acronym: 'MNNVL', fullForm: 'Multi-node NVLink', description: 'NVLink across hosts, as in GB200 and GB300 racks.' },
  { acronym: 'NIXL', fullForm: 'NVIDIA Inference Xfer Library', description: 'NVIDIA\'s point-to-point transfer library for KV movement, with UCX and libfabric backends.' },
  { acronym: 'OFI', fullForm: 'OpenFabrics Interfaces', description: 'The libfabric API, as in the aws-ofi-nccl plugin.' },
  { acronym: 'CUDA VMM', fullForm: 'CUDA virtual memory management', description: 'CUDA\'s API for reserving and mapping GPU virtual address ranges.' },
  { acronym: 'GDS', fullForm: 'GPUDirect Storage', description: 'Direct transfer between storage and GPU memory.' },
  { acronym: 'S3', fullForm: 'Amazon Simple Storage Service', description: 'AWS object storage.' },
  // Gateway, orchestration and AWS
  { acronym: 'SMG', fullForm: 'Shepherd Model Gateway', description: 'The SGLang gateway\'s moved-out successor in its own repository; SGLang keeps an in-tree 0.3.2 copy.' },
  { acronym: 'EPP', fullForm: 'Endpoint picker', description: 'llm-d\'s routing component that picks a worker per request.' },
  { acronym: 'LWS', fullForm: 'LeaderWorkerSet', description: 'The Kubernetes API that starts a leader pod and its workers as one unit.' },
  { acronym: 'RBG', fullForm: 'RoleBasedGroup', description: 'A Kubernetes API for groups of pods with distinct roles, such as prefill and decode.' },
  { acronym: 'DRA', fullForm: 'Dynamic Resource Allocation', description: 'Kubernetes\' API for requesting devices such as GPUs and network adapters.' },
  { acronym: 'OME', fullForm: 'Open Model Engine', description: 'A Kubernetes operator for model serving that supports SGLang.' },
  { acronym: 'JWT, OIDC', fullForm: 'JSON Web Token, OpenID Connect', description: 'Token formats and the identity protocol the gateway can use for admin routes.' },
  { acronym: 'TLS', fullForm: 'Transport Layer Security', description: 'Encryption for network connections.' },
  { acronym: 'EC2', fullForm: 'Amazon Elastic Compute Cloud', description: 'AWS virtual machines, including the GPU instance families this dive maps.' },
  { acronym: 'EKS', fullForm: 'Amazon Elastic Kubernetes Service', description: 'AWS\'s managed Kubernetes.' },
  { acronym: 'DLC', fullForm: 'Deep Learning Container', description: 'AWS-built container images for ML frameworks and serving runtimes, including two SGLang lines.' },
  { acronym: 'AL2023', fullForm: 'Amazon Linux 2023', description: 'The base OS of one SGLang DLC line.' },
  { acronym: 'AMI', fullForm: 'Amazon Machine Image', description: 'The boot image of an EC2 instance.' },
  { acronym: 'ECR', fullForm: 'Elastic Container Registry', description: 'AWS\'s container image registry.' },
  { acronym: 'IAM', fullForm: 'Identity and Access Management', description: 'AWS\'s permission system.' },
  { acronym: 'LMI', fullForm: 'Large Model Inference', description: 'SageMaker AI\'s managed inference containers.' },
  { acronym: 'NVMe', fullForm: 'NVM Express', description: 'The storage interface of local instance SSDs.' },
  // Ecosystem and security
  { acronym: 'LMSYS', fullForm: 'Large Model Systems Organization', description: 'The research organisation that hosts SGLang.' },
  { acronym: 'RL', fullForm: 'Reinforcement learning', description: 'Training that samples model outputs and updates the weights from rewards; SGLang serves the sampling side.' },
  { acronym: 'FSDP', fullForm: 'Fully Sharded Data Parallel', description: 'PyTorch\'s sharded training strategy.' },
  { acronym: 'CVE', fullForm: 'Common Vulnerabilities and Exposures', description: 'The public identifier system for security vulnerabilities.' },
  { acronym: 'NVD', fullForm: 'National Vulnerability Database', description: 'The US database of CVE records.' },
  { acronym: 'OCI', fullForm: 'Oracle Cloud Infrastructure', description: 'Oracle\'s cloud.' },
  { acronym: 'PAI, EAS', fullForm: 'Platform for AI, Elastic Algorithm Service', description: 'Alibaba Cloud\'s ML platform and its model-serving service.' },
  { acronym: 'TGI', fullForm: 'Text Generation Inference', description: 'Hugging Face\'s serving engine.' },
  { acronym: 'PyPI', fullForm: 'Python Package Index', description: 'The public Python package repository.' },
  { acronym: 'CI', fullForm: 'Continuous integration', description: 'Automated builds and tests on every change.' },
];

export function GlossaryAndSources() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Look up any acronym in the dive, and find the source behind any claim, graded by how far to trust it"
          >
            28. Glossary &amp; Sources
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This deep dive describes SGLang <strong>v0.5.22</strong>, released 2026-10-19. Every
            source was read on <strong>2026-10-24</strong>. Code claims link to the{' '}
            <code>v0.5.22</code> tag (commit <code>baa9befa</code>), so each one can be checked
            against the exact line it describes. Documentation claims cite the tag-pinned page
            source, because the rendered docs site tracks the default branch.
          </Box>
          <Box variant="p">
            Sources are graded by tier. Tier 1 (source code, official documentation, release notes)
            is the authority, and where the docs and the code disagree the sections follow the code
            and say so. Tier 2 is project and vendor blogs, talks and product pages: their
            performance figures appear in the sections as attributed claims with their stated
            conditions. Tier 3 is papers and third-party analysis. The complete per-file list of
            citations, grouped by tier, is generated into <code>sources.md</code> in the dive&apos;s
            directory.
          </Box>
        </SpaceBetween>
      </Container>

      <Glossary entries={glossary} title="Glossary" />

      <SourcesAppendix sources={sources} />
    </SpaceBetween>
  );
}
