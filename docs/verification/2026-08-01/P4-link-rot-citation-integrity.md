# P4 — Link Rot and Citation Integrity Audit

**Date:** 2026-08-01  
**Scope:** `deep-dives/efa`, `deep-dives/silicon-memory-inference`, `deep-dives/vllm` plus each dive's `sources.md`  
**Method:** mechanical and exhaustive. Every unique URL extracted from each dive's `src/**/*.tsx` and its `sources.md`, then probed with `curl -L` (HEAD, falling back to a ranged GET) with a browser User-Agent. All github.com results were re-verified through the GitHub REST API, because github.com rate-limits unauthenticated HEAD floods (HTTP 429) and returns misleading codes under load.

---

## 0. Coverage

| Dive | Unique URLs (src + sources.md) | Sources declared in appendix | Appendix file |
|---|---|---|---|
| efa | 39 | 39 | `src/sections/Sources.tsx` |
| silicon-memory-inference | 101 (93 in `src/`, 24 in `sources.md`) | 69 | `src/sections/GlossaryAndSources.tsx` |
| vllm | 125 | 110 | `src/sections/GlossaryAndSources.tsx` |
| **Portfolio unique** | **258** | **218** | |

---

## 1. Link rot

| Dive | OK | Cosmetic redirect | Real redirect | Redirect-to-landing (rot) | DEAD | Bot-blocked | Placeholder/none |
|---|---|---|---|---|---|---|---|
| efa | 33 | 0 | 0 | 0 | 6 | 0 | 0 |
| silicon-memory-inference | 83 | 2 | 8 | 0 | 3 | 5 | 0 |
| vllm | 102 | 10 | 4 | 1 | 1 | 0 | 7 |

### 1.1 Dead URLs (10 total, all independently confirmed)

| Dive | URL | Where declared | Diagnosis and replacement |
|---|---|---|---|
| efa | `https://github.com/NVIDIA/nccl/blob/master/src/search.cc` | appendix id 32 | Moved. Use `https://github.com/NVIDIA/nccl/blob/master/src/graph/search.cc`. |
| efa | `https://github.com/NVIDIA/uccl/tree/main/benchmark` | appendix id 39 | **Misattributed, not just moved.** There is no `NVIDIA/uccl` repo and there never was. UCCL lives at `https://github.com/uccl-project/uccl`. The EFA appendix title also calls it an NVIDIA benchmark. Both the URL and the attribution need fixing. |
| efa | `https://github.com/ai-dynamo/nixl/blob/main/docs/architecture.md` | appendix id 36 | Removed. `docs/` now holds `nixl.md`, `BackendGuide.md`, `python_api.md`, `telemetry.md`, `tracing.md`. Nearest equivalent: `docs/nixl.md`. |
| efa | `https://github.com/ai-dynamo/nixl/blob/main/src/plugins/xfer/libfabric/README.md` | appendix id 37 | Removed. The `libfabric` plugin directory still exists under `src/plugins/xfer/` but has no README. No direct replacement. |
| efa | `https://github.com/aws/aws-ofi-nccl/blob/master/tuner/nccl_ofi_tuner.cpp` | appendix id 33 | Moved. Use `https://github.com/aws/aws-ofi-nccl/blob/master/src/tuner/nccl_ofi_tuner.cpp`. |
| efa | `https://github.com/vllm-project/vllm/blob/main/vllm/distributed/kv_transfer/kv_connector/nixl_connector.py` | appendix id 38 | Refactored into a package. Use `https://github.com/vllm-project/vllm/tree/main/vllm/distributed/kv_transfer/kv_connector/v1/nixl`. |
| silicon-memory-inference | `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/frameworks/torch/torch-neuronx/` | `sources.md` | Neuron docs restructured. Path no longer resolves. |
| silicon-memory-inference | `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/neuronx-distributed/` | appendix id 32, `sources.md` | Neuron docs restructured. Path no longer resolves; `/en/latest/` itself is 200. |
| silicon-memory-inference | `https://github.com/NVIDIA/cutlass/tree/main/media/docs/cute` | `sources.md` | Moved. Use `https://github.com/NVIDIA/cutlass/tree/main/media/docs/cpp/cute`. |
| vllm | `https://docs.vllm.ai/en/latest/serving/conserving_memory.html` | appendix id 6 | Moved. Use `https://docs.vllm.ai/en/latest/configuration/conserving_memory/` (verified 200). Note: the vllm section prose **already** links the correct new path; only the appendix entry is stale. |

### 1.2 Redirect-to-landing-page (silent AWS docs rot)

| Dive | URL | Lands on | Assessment |
|---|---|---|---|
| vllm | `https://docs.aws.amazon.com/deep-learning-containers/latest/devguide/dlc-vllm-sagemaker.html` (appendix id 59) | `https://docs.aws.amazon.com/deep-learning-containers/latest/devguide/` | **Rot.** Returns 200 but the specific vLLM-DLC-on-SageMaker page is gone; AWS silently drops the reader on the guide index. Any claim citing id 59 is now uncited in practice. |

### 1.3 Other AWS docs page moves (200, but a different page)

| Dive | URL | Redirects to | Assessment |
|---|---|---|---|
| vllm | `https://docs.aws.amazon.com/eks/latest/userguide/ml-realtime-inference-llm-inference-vllm.html` (appendix id 57) | `https://docs.aws.amazon.com/eks/latest/userguide/ml-inference-load-serve-model.html` | The vLLM-specific EKS quickstart was consolidated into a generic "load and serve a model" page. Title in the appendix ("vLLM high-throughput inference quickstart") no longer describes the destination. Update title and URL together. |

### 1.4 Other real redirects (destination still specific and correct)

| Dive | URL | Redirects to |
|---|---|---|
| silicon-memory-inference | `https://awsdocs-neuron.readthedocs-hosted.com/` | `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/` |
| silicon-memory-inference | `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/nki/` | `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/` |
| silicon-memory-inference | `https://docs.jax.dev/` | `https://docs.jax.dev/en/latest/` |
| silicon-memory-inference | `https://docs.nvidia.com/deeplearning/cudnn/` | `https://docs.nvidia.com/deeplearning/cudnn/latest/` |
| silicon-memory-inference | `https://pytorch.org/docs/stable/torch.compiler.html` | `https://docs.pytorch.org/docs/stable/torch.compiler.html` |
| silicon-memory-inference | `https://www.amd.com/content/dam/amd/en/documents/epyc-technical-docs/white-papers/58725.pdf` | `https://docs.amd.com/v/u/en-US/58725` |
| silicon-memory-inference | `https://www.nextplatform.com/2024/09/24/intel-shoots-granite-rapids-xeon-6-into-the-datacenter/` | `https://www.nextplatform.com/compute/2024/09/24/intel-shoots-granite-rapids-xeon-6-into-the-datacenter/1650836` |
| silicon-memory-inference | `https://www.theregister.com/2025/12/04/amazon_graviton_5/` | `https://www.theregister.com/special-features/2025/12/04/amazon-keeps-pressure-on-intel-amd-with-192-core-graviton5/2171527` |
| vllm | `https://blog.vllm.ai/2025/01/27/v1-alpha-release.html` | `https://vllm.ai/blog/2025-01-27-v1-alpha-release` |
| vllm | `https://github.com/llm-d/llm-d-inference-scheduler` | `https://github.com/llm-d/llm-d-router` |
| vllm | `https://huggingface.co/docs/text-generation-inference` | `https://huggingface.co/docs/text-generation-inference/index` |

Notable among these: `https://github.com/llm-d/llm-d-inference-scheduler` (vllm appendix id 83) now redirects to `llm-d-router`. The project renamed; the appendix title "llm-d-inference-scheduler" is stale even though the link resolves.

### 1.5 Bot-blocked (403/400) — not rot, but unverifiable by script

- `https://ai.meta.com/blog/llama-4-multimodal-intelligence/` — silicon-memory-inference (appendix id 93), HTTP 400 anti-bot (likely live in a browser)
- `https://dl.acm.org/doi/10.1145/1498765.1498785` — silicon-memory-inference (appendix id 100), HTTP 403 anti-bot (likely live in a browser)
- `https://hypercim.com/` — silicon-memory-inference (appendix id 83), HTTP 403 anti-bot (likely live in a browser)
- `https://www.intel.com/content/www/us/en/developer/articles/technical/advanced-matrix-extensions-overview.html` — silicon-memory-inference (appendix id 51), HTTP 403 anti-bot (likely live in a browser)
- `https://www.intel.com/content/www/us/en/products/docs/processors/xeon/6th-gen-xeon-processors-product-brief.html` — silicon-memory-inference (appendix id 50), HTTP 403 anti-bot (likely live in a browser)

### 1.6 Placeholders and namespaces (excluded from citation counts)

- `http://0.0.0.0:8000/v1` — vllm, placeholder host or XML namespace, not a citation
- `http://host:8000` — vllm, placeholder host or XML namespace, not a citation
- `http://localhost:8000` — vllm, placeholder host or XML namespace, not a citation
- `http://localhost:8000/v1` — vllm, placeholder host or XML namespace, not a citation
- `http://localhost:8000/v1&quot` — vllm, placeholder host or XML namespace, not a citation
- `http://www.w3.org/2000/svg` — vllm, placeholder host or XML namespace, not a citation
- `http://{your-vllm-server-host}:{your-vllm-server-port}/v1` — vllm, placeholder host or XML namespace, not a citation

---

## 2. Full per-URL status table

Legend: **OK** = 200 direct. **REDIR-OK** = 200 after a cosmetic `.html` to trailing-slash rewrite (mkdocs). **REDIR** = 200 at a materially different URL. **REDIR-ROT** = 200 but landed on a parent index. **DEAD** = 404/410. **BLOCKED** = 403/400 anti-bot. **N/A** = placeholder or XML namespace.

### 2.1 efa (39 URLs)

| # | URL | Appendix tier/id | HTTP | Status | Note |
|---|---|---|---|---|---|
| 1 | `https://aws-ia.github.io/terraform-aws-eks-blueprints/patterns/machine-learning/multi-node-vllm/` | T2 / id 23 | 200 | OK |  |
| 2 | `https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-p5en-instances-generative-ai-hpc-generally-available/` | T2 / id 12 | 200 | OK |  |
| 3 | `https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-trn2-instances-available/` | T2 / id 15 | 200 | OK |  |
| 4 | `https://aws.amazon.com/about-aws/whats-new/2025/03/amazon-ec2-p5en-instances-n-virginia-jakarta/` | T2 / id 13 | 200 | OK |  |
| 5 | `https://aws.amazon.com/about-aws/whats-new/2025/05/amazon-ec2-p5en-instances-aws-us-west-n-california-region/` | T2 / id 14 | 200 | OK |  |
| 6 | `https://aws.amazon.com/blogs/hpc/optimizing-mpi-application-performance-on-hpc7a-by-effectively-using-both-efa-devices/` | T2 / id 27 | 200 | OK |  |
| 7 | `https://aws.amazon.com/blogs/hpc/second-generation-efa-improving-hpc-and-ml-application-performance-in-the-cloud/` | T2 / id 26 | 200 | OK |  |
| 8 | `https://aws.amazon.com/ec2/instance-types/p5/` | T2 / id 8 | 200 | OK |  |
| 9 | `https://aws.amazon.com/ec2/instance-types/trn2/` | T2 / id 9 | 200 | OK |  |
| 10 | `https://aws.amazon.com/ec2/ultraservers/` | T2 / id 10 | 200 | OK |  |
| 11 | `https://aws.amazon.com/hpc/efa/` | T2 / id 11 | 200 | OK |  |
| 12 | `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/faq/training/neuron-training.html` | T1 / id 20 | 200 | OK |  |
| 13 | `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html` | T1 / id 19 | 200 | OK |  |
| 14 | `https://cfd.direct/cloud/openfoam-hpc-aws-efa/` | T3 / id 24 | 200 | OK |  |
| 15 | `https://d1.awsstatic.com/whitepapers/benchmarking-aws-and-hpc-services.pdf` | T2 / id 28 | 200 | OK |  |
| 16 | `https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTopology.html` | T1 / id 29 | 200 | OK |  |
| 17 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html` | T1 / id 30 | 200 | OK |  |
| 18 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html` | T1 / id 31 | 200 | OK |  |
| 19 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html` | T1 / id 4 | 200 | OK |  |
| 20 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html` | T1 / id 3 | 200 | OK |  |
| 21 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html` | T1 / id 2 | 200 | OK |  |
| 22 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html` | T1 / id 1 | 200 | OK |  |
| 23 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html` | T1 / id 6 | 200 | OK |  |
| 24 | `https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html` | T1 / id 5 | 200 | OK |  |
| 25 | `https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html` | T1 / id 7 | 200 | OK |  |
| 26 | `https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-intro.html` | T1 / id 21 | 200 | OK |  |
| 27 | `https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-core-features-v2-expert-parallelism.html` | T1 / id 22 | 200 | OK |  |
| 28 | `https://github.com/NVIDIA/nccl/blob/master/src/search.cc` | T1 / id 32 | 404 | DEAD | GitHub API 404 (moved to src/graph/search.cc) |
| 29 | `https://github.com/NVIDIA/uccl/tree/main/benchmark` | T3 / id 39 | 404 | DEAD | GitHub API 404 (repo NVIDIA/uccl does not exist) |
| 30 | `https://github.com/ai-dynamo/nixl` | T1 / id 35 | 200 | OK |  |
| 31 | `https://github.com/ai-dynamo/nixl/blob/main/docs/architecture.md` | T1 / id 36 | 404 | DEAD | GitHub API 404 (docs/ now holds nixl.md, BackendGuide.md; no architecture.md) |
| 32 | `https://github.com/ai-dynamo/nixl/blob/main/src/plugins/xfer/libfabric/README.md` | T1 / id 37 | 404 | DEAD | GitHub API 404 (path removed; libfabric plugin dir exists but has no README.md) |
| 33 | `https://github.com/aws/aws-ofi-nccl/blob/master/README.md` | T1 / id 17 | 200 | OK |  |
| 34 | `https://github.com/aws/aws-ofi-nccl/blob/master/tuner/nccl_ofi_tuner.cpp` | T1 / id 33 | 404 | DEAD | GitHub API 404 (moved to src/tuner/nccl_ofi_tuner.cpp) |
| 35 | `https://github.com/aws/aws-ofi-nccl/releases` | T1 / id 18 | 200 | OK |  |
| 36 | `https://github.com/aws/aws-ofi-nccl/tree/master/topology` | T1 / id 34 | 200 | OK |  |
| 37 | `https://github.com/vllm-project/vllm/blob/main/vllm/distributed/kv_transfer/kv_connector/nixl_connector.py` | T1 / id 38 | 404 | DEAD | GitHub API 404 (moved to kv_connector/v1/nixl/) |
| 38 | `https://www.amazonaws.cn/en/new/2024/elastic-fabric-adapter-supports-cross-subnet-communication/` | T2 / id 16 | 200 | OK |  |
| 39 | `https://www.ernestchiang.com/en/notes/general/aws-srd-scalable-reliable-datagram/` | T3 / id 25 | 200 | OK |  |

### 2.2 silicon-memory-inference (101 URLs)

| # | URL | Appendix tier/id | HTTP | Status | Note |
|---|---|---|---|---|---|
| 1 | `https://ai.meta.com/blog/llama-4-multimodal-intelligence/` | T2 / id 93 | 400 | BLOCKED | HTTP 400 anti-bot (likely live in a browser) |
| 2 | `https://antoinesavine.com/` | prose only | 200 | OK |  |
| 3 | `https://artificialanalysis.ai/` | T3 / id 114 | 200 | OK |  |
| 4 | `https://arxiv.org/abs/2005.02347` | prose only | 200 | OK |  |
| 5 | `https://arxiv.org/abs/2405.07518` | T3 / id 96 | 200 | OK |  |
| 6 | `https://arxiv.org/abs/2412.19437` | T3 / id 91 | 200 | OK |  |
| 7 | `https://aws.amazon.com/ec2/instance-types/` | prose only | 200 | OK |  |
| 8 | `https://aws.amazon.com/ec2/instance-types/m8i/` | T1 / id 34 | 200 | OK |  |
| 9 | `https://aws.amazon.com/hpc/efa/` | T1 / id 33 | 200 | OK |  |
| 10 | `https://awsdocs-neuron.readthedocs-hosted.com/` | T1 / id 30 | 200 | REDIR | -> https://awsdocs-neuron.readthedocs-hosted.com/en/latest/ |
| 11 | `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/frameworks/torch/torch-neuronx/` | `sources.md` only | 404 | DEAD | HTTP 404 |
| 12 | `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/nki/` | T1 / id 31 | 200 | REDIR | -> https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/ |
| 13 | `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/neuronx-distributed/` | T1 / id 32 | 404 | DEAD | HTTP 404 |
| 14 | `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/release-notes/` | prose only | 200 | OK |  |
| 15 | `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/tools/` | `sources.md` only | 200 | OK |  |
| 16 | `https://blog.exolabs.net/nvidia-dgx-spark/` | T3 / id 136 | 200 | OK |  |
| 17 | `https://chipsandcheese.com/p/a-look-into-intel-xeon-6s-memory` | T3 / id 110 | 200 | OK |  |
| 18 | `https://chipsandcheese.com/p/amds-turin-5th-gen-epyc-launched` | T3 / id 111 | 200 | OK |  |
| 19 | `https://chipsandcheese.com/p/arms-neoverse-v2-in-awss-graviton-4` | T3 / id 113 | 200 | OK |  |
| 20 | `https://chipsandcheese.com/p/discussing-amds-zen-5-at-hot-chips-2024` | T3 / id 112 | 200 | OK |  |
| 21 | `https://chipsandcheese.com/p/evaluating-uniform-memory-access` | prose only | 200 | OK |  |
| 22 | `https://computeexpresslink.org/` | T1 / id 70 | 200 | OK |  |
| 23 | `https://developer.nvidia.com/blog/getting-started-with-edge-ai-on-nvidia-jetson-llms-vlms-and-foundation-models-for-robotics/` | T2 / id 137 | 200 | OK |  |
| 24 | `https://developer.nvidia.com/blog/how-nvidia-dgx-sparks-performance-enables-intensive-ai-tasks/` | T2 / id 129 | 200 | OK |  |
| 25 | `https://developer.nvidia.com/blog/how-nvidia-gb200-nvl72-and-nvidia-dynamo-boost-inference-performance-for-moe-models/` | T2 / id 20 | 200 | OK |  |
| 26 | `https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/` | T2 / id 21 | 200 | OK |  |
| 27 | `https://developer.nvidia.com/blog/nvidia-blackwell-leads-on-new-semianalysis-inferencemax-benchmarks/` | T2 / id 22 | 200 | OK |  |
| 28 | `https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/` | T2 / id 130 | 200 | OK |  |
| 29 | `https://dl.acm.org/doi/10.1145/1498765.1498785` | T3 / id 100 | 403 | BLOCKED | HTTP 403 anti-bot (likely live in a browser) |
| 30 | `https://docs.jax.dev/` | T1 / id 72 | 200 | REDIR | -> https://docs.jax.dev/en/latest/ |
| 31 | `https://docs.nvidia.com/cuda/cublas/` | `sources.md` only | 200 | OK |  |
| 32 | `https://docs.nvidia.com/cuda/cuda-c-programming-guide/` | T1 / id 8 | 200 | OK |  |
| 33 | `https://docs.nvidia.com/cuda/cuda-for-tegra-appnote/index.html` | T1 / id 127 | 200 | OK |  |
| 34 | `https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html` | T1 / id 9 | 200 | OK |  |
| 35 | `https://docs.nvidia.com/deeplearning/cudnn/` | `sources.md` only | 200 | REDIR | -> https://docs.nvidia.com/deeplearning/cudnn/latest/ |
| 36 | `https://docs.nvidia.com/dgx/dgx-spark-porting-guide/overview.html` | T1 / id 122 | 200 | OK |  |
| 37 | `https://docs.nvidia.com/dgx/dgx-spark/` | `sources.md` only | 200 | OK |  |
| 38 | `https://docs.nvidia.com/dgx/dgx-spark/hardware.html` | T1 / id 121 | 200 | OK |  |
| 39 | `https://docs.nvidia.com/dgx/dgx-spark/spark-clustering.html` | T1 / id 123 | 200 | OK |  |
| 40 | `https://docs.nvidia.com/jetson/archives/jetpack-archived/jetpack-62/release-notes/index.html` | T1 / id 128 | 200 | OK |  |
| 41 | `https://docs.nvidia.com/nemo-framework/user-guide/24.09/nemotoolkit/features/moe.html` | T1 / id 14 | 200 | OK |  |
| 42 | `https://docs.nvidia.com/nim/large-language-models/1.15.0/deploy-on-dgx-spark.html` | T1 / id 124 | 200 | OK |  |
| 43 | `https://docs.nvidia.com/nsight-compute/` | `sources.md` only | 200 | OK |  |
| 44 | `https://docs.nvidia.com/nsight-systems/` | `sources.md` only | 200 | OK |  |
| 45 | `https://docs.sglang.ai/` | T1 / id 73 | 200 | REDIR-OK | cosmetic (.html -> trailing slash, mkdocs rewrite) |
| 46 | `https://github.com/NVIDIA/TensorRT-LLM/tree/main/examples/wide_ep` | T1 / id 11 | 200 | OK |  |
| 47 | `https://github.com/NVIDIA/cutlass` | T1 / id 12 | 200 | OK |  |
| 48 | `https://github.com/NVIDIA/cutlass/tree/main/examples/92_blackwell_moe_gemm` | prose only | 200 | OK |  |
| 49 | `https://github.com/NVIDIA/cutlass/tree/main/media/docs/cute` | `sources.md` only | 404 | DEAD | GitHub API 404 (moved to media/docs/cpp/cute) |
| 50 | `https://github.com/ai-dynamo/nixl` | T1 / id 95 | 200 | OK |  |
| 51 | `https://github.com/aws/aws-graviton-getting-started` | prose only | 200 | OK |  |
| 52 | `https://github.com/deepseek-ai/DeepEP` | T1 / id 94 | 200 | OK |  |
| 53 | `https://github.com/differential-machine-learning` | prose only | 200 | OK |  |
| 54 | `https://github.com/differential-machine-learning/appendices` | prose only | 200 | OK |  |
| 55 | `https://github.com/differential-machine-learning/notebooks` | prose only | 200 | OK |  |
| 56 | `https://github.com/ggml-org/llama.cpp/discussions/16578` | T3 / id 133 | 200 | OK |  |
| 57 | `https://groq.com/` | T1 / id 82 | 200 | OK |  |
| 58 | `https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B` | prose only | 200 | OK |  |
| 59 | `https://huggingface.co/Qwen/Qwen2.5-1.5B` | prose only | 200 | OK |  |
| 60 | `https://huggingface.co/deepseek-ai/DeepSeek-V3` | prose only | 200 | OK |  |
| 61 | `https://huggingface.co/google/gemma-2-2b` | prose only | 200 | OK |  |
| 62 | `https://huggingface.co/google/gemma-3-1b-it` | prose only | 200 | OK |  |
| 63 | `https://huggingface.co/meta-llama/Llama-3.2-1B` | prose only | 200 | OK |  |
| 64 | `https://huggingface.co/microsoft/Phi-3-mini-4k-instruct` | prose only | 200 | OK |  |
| 65 | `https://huggingface.co/microsoft/phi-4` | prose only | 200 | OK |  |
| 66 | `https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3` | prose only | 200 | OK |  |
| 67 | `https://hypercim.com/` | T1 / id 83 | 403 | BLOCKED | HTTP 403 anti-bot (likely live in a browser) |
| 68 | `https://lwn.net/Articles/1007283/` | prose only | 200 | OK |  |
| 69 | `https://mistral.ai/news/mixtral-of-experts/` | T2 / id 90 | 200 | OK |  |
| 70 | `https://nvidia.github.io/TensorRT-LLM/` | T1 / id 10 | 200 | OK |  |
| 71 | `https://nvidianews.nvidia.com/news/nvidia-announces-dgx-spark-and-dgx-station-personal-ai-computers` | T2 / id 132 | 200 | OK |  |
| 72 | `https://pytorch.org/docs/` | `sources.md` only | 200 | REDIR-OK | cosmetic (.html -> trailing slash, mkdocs rewrite) |
| 73 | `https://pytorch.org/docs/stable/torch.compiler.html` | T1 / id 71 | 200 | REDIR | host moved -> https://docs.pytorch.org/docs/stable/torch.compiler.html |
| 74 | `https://semiconductor.samsung.com/news-events/tech-blog/` | T2 / id 84 | 200 | OK |  |
| 75 | `https://triton-lang.org/main/index.html` | T1 / id 13 | 200 | OK |  |
| 76 | `https://www.aboutamazon.com/news/aws/aws-graviton-5-cpu-amazon-ec2` | T2 / id 40 | 200 | OK |  |
| 77 | `https://www.amd.com/content/dam/amd/en/documents/epyc-technical-docs/white-papers/58725.pdf` | prose only | 200 | REDIR | host moved -> https://docs.amd.com/v/u/en-US/58725 |
| 78 | `https://www.amd.com/en/products/processors/server/epyc/9005-series.html` | T1 / id 52 | 200 | OK |  |
| 79 | `https://www.arm.com/products/silicon-ip-cpu/neoverse/neoverse-v3` | prose only | 200 | OK |  |
| 80 | `https://www.arm.com/products/silicon-ip-system/neoverse-interconnect/cmn-s3` | T1 / id 60 | 200 | OK |  |
| 81 | `https://www.bis.org/bcbs/publ/d457.htm` | prose only | 200 | OK |  |
| 82 | `https://www.cerebras.ai/` | T1 / id 80 | 200 | OK |  |
| 83 | `https://www.cerebras.ai/inference` | T1 / id 81 | 200 | OK |  |
| 84 | `https://www.databricks.com/blog/introducing-dbrx-new-state-art-open-llm` | T2 / id 92 | 200 | OK |  |
| 85 | `https://www.esys.ir/images/img_Item/3029/Files/Jetson-Orin-Nano-Series-Modules-Datasheet_DS-11105-001_v1.5.pdf` | T1 / id 125 | 200 | OK |  |
| 86 | `https://www.intel.com/content/www/us/en/developer/articles/technical/advanced-matrix-extensions-overview.html` | T1 / id 51 | 403 | BLOCKED | HTTP 403 anti-bot (likely live in a browser) |
| 87 | `https://www.intel.com/content/www/us/en/products/docs/processors/xeon/6th-gen-xeon-processors-product-brief.html` | T1 / id 50 | 403 | BLOCKED | HTTP 403 anti-bot (likely live in a browser) |
| 88 | `https://www.jetson-ai-lab.com/archive/benchmarks.html` | T2 / id 131 | 200 | OK |  |
| 89 | `https://www.lmsys.org/blog/2025-10-13-nvidia-dgx-spark/` | T3 / id 134 | 200 | OK |  |
| 90 | `https://www.nextplatform.com/2024/09/24/intel-shoots-granite-rapids-xeon-6-into-the-datacenter/` | T3 / id 115 | 200 | REDIR | -> https://www.nextplatform.com/compute/2024/09/24/intel-shoots-granite-rapids-xeon-6-into-the-datacenter/1650836 |
| 91 | `https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/nano-super-developer-kit/` | T1 / id 126 | 200 | OK |  |
| 92 | `https://www.nvidia.com/en-us/data-center/gb200-nvl72/` | T1 / id 4 | 200 | OK |  |
| 93 | `https://www.nvidia.com/en-us/data-center/gb300-nvl72/` | T1 / id 5 | 200 | OK |  |
| 94 | `https://www.nvidia.com/en-us/data-center/grace-cpu/` | T1 / id 6 | 200 | OK |  |
| 95 | `https://www.nvidia.com/en-us/data-center/h100/` | T1 / id 1 | 200 | OK |  |
| 96 | `https://www.nvidia.com/en-us/data-center/h200/` | T1 / id 2 | 200 | OK |  |
| 97 | `https://www.nvidia.com/en-us/data-center/hgx/` | T1 / id 3 | 200 | OK |  |
| 98 | `https://www.nvidia.com/en-us/products/workstations/dgx-spark/` | T1 / id 120 | 200 | OK |  |
| 99 | `https://www.nvidia.com/en-us/technologies/multi-instance-gpu/` | T1 / id 7 | 200 | OK |  |
| 100 | `https://www.techinsights.com/blog/nvidia-gb10-superchip-advanced-packaging-analysis` | T3 / id 135 | 200 | OK |  |
| 101 | `https://www.theregister.com/2025/12/04/amazon_graviton_5/` | T3 / id 116 | 200 | REDIR | -> https://www.theregister.com/special-features/2025/12/04/amazon-keeps-pressure-on-intel-amd-with-192-core-graviton5/2171527 |

### 2.3 vllm (125 URLs)

| # | URL | Appendix tier/id | HTTP | Status | Note |
|---|---|---|---|---|---|
| 1 | `http://0.0.0.0:8000/v1` | prose only | 404 | N/A | placeholder host or XML namespace, not a citation |
| 2 | `http://host:8000` | prose only | 000 | N/A | placeholder host or XML namespace, not a citation |
| 3 | `http://localhost:8000` | prose only | 200 | N/A | placeholder host or XML namespace, not a citation |
| 4 | `http://localhost:8000/v1` | prose only | 404 | N/A | placeholder host or XML namespace, not a citation |
| 5 | `http://localhost:8000/v1&quot` | prose only | 404 | N/A | placeholder host or XML namespace, not a citation |
| 6 | `http://www.w3.org/2000/svg` | prose only | 403 | N/A | placeholder host or XML namespace, not a citation |
| 7 | `http://{your-vllm-server-host}:{your-vllm-server-port}/v1` | prose only | 000 | N/A | placeholder host or XML namespace, not a citation |
| 8 | `https://arxiv.org/abs/2211.17192` | T3 / id 111 | 200 | OK |  |
| 9 | `https://arxiv.org/abs/2309.06180` | T3 / id 110 | 200 | OK |  |
| 10 | `https://aws.amazon.com/about-aws/whats-new/2026/03/aws-support-nixl-with-efa/` | T2 / id 70 | 200 | OK |  |
| 11 | `https://aws.amazon.com/bedrock/` | T2 / id 76 | 200 | OK |  |
| 12 | `https://aws.amazon.com/blogs/machine-learning/amazon-sagemaker-inference-launches-faster-auto-scaling-for-generative-ai-models/` | T2 / id 149 | 200 | OK |  |
| 13 | `https://aws.amazon.com/blogs/machine-learning/build-real-time-voice-applications-with-amazon-sagemaker-ai-and-vllm/` | T2 / id 151 | 200 | OK |  |
| 14 | `https://aws.amazon.com/blogs/machine-learning/deploy-llms-on-amazon-eks-using-vllm-deep-learning-containers/` | T2 / id 71 | 200 | OK |  |
| 15 | `https://aws.amazon.com/blogs/machine-learning/efficient-and-cost-effective-multi-tenant-lora-serving-with-amazon-sagemaker/` | T2 / id 147 | 200 | OK |  |
| 16 | `https://aws.amazon.com/blogs/machine-learning/efficiently-serve-dozens-of-fine-tuned-models-with-vllm-on-amazon-sagemaker-ai-and-amazon-bedrock/` | T2 / id 74 | 200 | OK |  |
| 17 | `https://aws.amazon.com/blogs/machine-learning/enhanced-metrics-for-amazon-sagemaker-ai-endpoints-deeper-visibility-for-better-performance/` | T2 / id 150 | 200 | OK |  |
| 18 | `https://aws.amazon.com/blogs/machine-learning/how-amazon-scaled-rufus-by-building-multi-node-inference-using-aws-trainium-chips-and-vllm/` | T2 / id 73 | 200 | OK |  |
| 19 | `https://aws.amazon.com/blogs/machine-learning/introducing-disaggregated-inference-on-aws-powered-by-llm-d/` | T2 / id 72 | 200 | OK |  |
| 20 | `https://aws.amazon.com/blogs/machine-learning/p-eagle-faster-llm-inference-with-parallel-speculative-decoding-in-vllm/` | T2 / id 75 | 200 | OK |  |
| 21 | `https://aws.amazon.com/blogs/machine-learning/supercharge-your-llm-performance-with-amazon-sagemaker-large-model-inference-container-v15/` | T2 / id 146 | 200 | OK |  |
| 22 | `https://aws.amazon.com/blogs/machine-learning/unlock-cost-savings-with-the-new-scale-down-to-zero-feature-in-amazon-sagemaker-inference/` | T2 / id 148 | 200 | OK |  |
| 23 | `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/whats-new.html` | T1 / id 60 | 200 | OK |  |
| 24 | `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/vllm/index.html` | T1 / id 61 | 200 | OK |  |
| 25 | `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/release-notes/components/nxd-inference.html` | T1 / id 62 | 200 | OK |  |
| 26 | `https://blog.vllm.ai/2025/01/27/v1-alpha-release.html` | prose only | 200 | REDIR | host moved -> https://vllm.ai/blog/2025-01-27-v1-alpha-release |
| 27 | `https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models/` | T2 / id 100 | 200 | OK |  |
| 28 | `https://developer.nvidia.com/blog/nvidia-dynamo-accelerates-llm-d-community-initiatives-for-advancing-large-scale-distributed-inference/` | T2 / id 101 | 200 | OK |  |
| 29 | `https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTopology.html` | T1 / id 53 | 200 | OK |  |
| 30 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html` | T1 / id 54 | 200 | OK |  |
| 31 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology-prerequisites.html` | T1 / id 52 | 200 | OK |  |
| 32 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html` | T1 / id 56 | 200 | OK |  |
| 33 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nixl.html` | T1 / id 55 | 200 | OK |  |
| 34 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-topology-works.html` | T1 / id 51 | 200 | OK |  |
| 35 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html` | T1 / id 50 | 200 | OK |  |
| 36 | `https://docs.aws.amazon.com/deep-learning-containers/latest/devguide/dlc-vllm-sagemaker.html` | T1 / id 59 | 200 | REDIR-ROT | 200 but silently redirected to the guide index: https://docs.aws.amazon.com/deep-learning-containers/latest/devguide/ |
| 37 | `https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html` | T1 / id 58 | 200 | OK |  |
| 38 | `https://docs.aws.amazon.com/eks/latest/userguide/ml-realtime-inference-llm-inference-vllm.html` | T1 / id 57 | 200 | REDIR | -> https://docs.aws.amazon.com/eks/latest/userguide/ml-inference-load-serve-model.html |
| 39 | `https://docs.aws.amazon.com/sagemaker/latest/dg/deploy-model-options.html` | T1 / id 135 | 200 | OK |  |
| 40 | `https://docs.aws.amazon.com/sagemaker/latest/dg/endpoint-auto-scaling-add-code-define.html` | T1 / id 140 | 200 | OK |  |
| 41 | `https://docs.aws.amazon.com/sagemaker/latest/dg/endpoint-auto-scaling-policy.html` | T1 / id 139 | 200 | OK |  |
| 42 | `https://docs.aws.amazon.com/sagemaker/latest/dg/hosting-faqs.html` | T1 / id 136 | 200 | OK |  |
| 43 | `https://docs.aws.amazon.com/sagemaker/latest/dg/large-model-inference-hosting.html` | T1 / id 137 | 200 | OK |  |
| 44 | `https://docs.aws.amazon.com/sagemaker/latest/dg/model-deploy-feature-matrix.html` | T1 / id 134 | 200 | OK |  |
| 45 | `https://docs.aws.amazon.com/sagemaker/latest/dg/monitoring-cloudwatch.html` | T1 / id 138 | 200 | OK |  |
| 46 | `https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-autoscaling.html` | T1 / id 143 | 200 | OK |  |
| 47 | `https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-deploy-ftm.html` | T1 / id 142 | 200 | OK |  |
| 48 | `https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment.html` | T1 / id 141 | 200 | OK |  |
| 49 | `https://docs.djl.ai/master/docs/serving/serving/docs/lmi/deployment_guide/configurations.html` | T1 / id 130 | 200 | OK |  |
| 50 | `https://docs.djl.ai/master/docs/serving/serving/docs/lmi/deployment_guide/deploying-your-endpoint.html` | T1 / id 132 | 200 | OK |  |
| 51 | `https://docs.djl.ai/master/docs/serving/serving/docs/lmi/index.html` | T1 / id 89 | 200 | OK |  |
| 52 | `https://docs.djl.ai/master/docs/serving/serving/docs/lmi/release_notes.html` | T1 / id 131 | 200 | OK |  |
| 53 | `https://docs.djl.ai/master/docs/serving/serving/docs/lmi/user_guides/chat_input_output_schema.html` | T1 / id 133 | 200 | OK |  |
| 54 | `https://docs.djl.ai/master/docs/serving/serving/docs/lmi/user_guides/vllm_user_guide.html` | T1 / id 90 | 200 | OK |  |
| 55 | `https://docs.litellm.ai/blog/security-update-march-2026` | T2 / id 104 | 200 | OK |  |
| 56 | `https://docs.lmcache.ai/` | T1 / id 88 | 200 | OK |  |
| 57 | `https://docs.ray.io/en/latest/serve/llm/index.html` | T1 / id 80 | 200 | OK |  |
| 58 | `https://docs.ray.io/en/latest/serve/llm/user-guides/vllm-compatibility.html` | T1 / id 81 | 200 | OK |  |
| 59 | `https://docs.sglang.ai/` | T1 / id 91 | 200 | REDIR-OK | cosmetic (.html -> trailing slash, mkdocs rewrite) |
| 60 | `https://docs.vllm.ai/en/latest/` | T1 / id 1 | 200 | OK |  |
| 61 | `https://docs.vllm.ai/en/latest/api/vllm/config/cache.html` | T1 / id 23 | 200 | REDIR-OK | cosmetic (.html -> trailing slash, mkdocs rewrite) |
| 62 | `https://docs.vllm.ai/en/latest/api/vllm/config/lora.html` | T1 / id 24 | 200 | REDIR-OK | cosmetic (.html -> trailing slash, mkdocs rewrite) |
| 63 | `https://docs.vllm.ai/en/latest/configuration/conserving_memory/` | prose only | 200 | OK |  |
| 64 | `https://docs.vllm.ai/en/latest/configuration/optimization/` | prose only | 200 | OK |  |
| 65 | `https://docs.vllm.ai/en/latest/deployment/frameworks/litellm/` | T1 / id 27 | 200 | OK |  |
| 66 | `https://docs.vllm.ai/en/latest/deployment/frameworks/open-webui/` | T1 / id 28 | 200 | OK |  |
| 67 | `https://docs.vllm.ai/en/latest/deployment/integrations/kserve/` | T1 / id 26 | 200 | OK |  |
| 68 | `https://docs.vllm.ai/en/latest/deployment/integrations/kuberay/` | T1 / id 25 | 200 | OK |  |
| 69 | `https://docs.vllm.ai/en/latest/design/arch_overview/` | T1 / id 2 | 200 | OK |  |
| 70 | `https://docs.vllm.ai/en/latest/design/metrics/` | T1 / id 22 | 200 | OK |  |
| 71 | `https://docs.vllm.ai/en/latest/design/prefix_caching/` | T1 / id 4 | 200 | OK |  |
| 72 | `https://docs.vllm.ai/en/latest/features/lora/` | T1 / id 17 | 200 | OK |  |
| 73 | `https://docs.vllm.ai/en/latest/features/multimodal_inputs.html` | T1 / id 20 | 200 | REDIR-OK | cosmetic (.html -> trailing slash, mkdocs rewrite) |
| 74 | `https://docs.vllm.ai/en/latest/features/quantization/` | prose only | 200 | OK |  |
| 75 | `https://docs.vllm.ai/en/latest/features/speculative_decoding/` | T1 / id 13 | 200 | OK |  |
| 76 | `https://docs.vllm.ai/en/latest/features/structured_outputs/` | T1 / id 18 | 200 | OK |  |
| 77 | `https://docs.vllm.ai/en/latest/features/tool_calling/` | T1 / id 19 | 200 | OK |  |
| 78 | `https://docs.vllm.ai/en/latest/getting_started/installation.html` | prose only | 200 | REDIR-OK | cosmetic (.html -> trailing slash, mkdocs rewrite) |
| 79 | `https://docs.vllm.ai/en/latest/serving/conserving_memory.html` | T1 / id 6 | 404 | DEAD | HTTP 404 |
| 80 | `https://docs.vllm.ai/en/latest/serving/data_parallel_deployment/` | T1 / id 9 | 200 | OK |  |
| 81 | `https://docs.vllm.ai/en/latest/serving/expert_parallel_deployment/` | T1 / id 10 | 200 | OK |  |
| 82 | `https://docs.vllm.ai/en/latest/serving/openai_compatible_server/` | T1 / id 21 | 200 | OK |  |
| 83 | `https://docs.vllm.ai/en/latest/serving/parallelism_scaling/` | T1 / id 8 | 200 | OK |  |
| 84 | `https://docs.vllm.ai/en/latest/usage/metrics.html` | prose only | 200 | REDIR-OK | cosmetic (.html -> trailing slash, mkdocs rewrite) |
| 85 | `https://docs.vllm.ai/en/latest/usage/troubleshooting.html` | T1 / id 7 | 200 | REDIR-OK | cosmetic (.html -> trailing slash, mkdocs rewrite) |
| 86 | `https://docs.vllm.ai/en/stable/configuration/optimization.html` | T1 / id 5 | 200 | REDIR-OK | cosmetic (.html -> trailing slash, mkdocs rewrite) |
| 87 | `https://docs.vllm.ai/en/stable/features/disagg_prefill/` | T1 / id 11 | 200 | OK |  |
| 88 | `https://docs.vllm.ai/en/stable/features/nixl_connector_usage/` | T1 / id 12 | 200 | OK |  |
| 89 | `https://docs.vllm.ai/en/stable/features/quantization/` | T1 / id 14 | 200 | OK |  |
| 90 | `https://docs.vllm.ai/en/stable/features/quantization/fp8.html` | T1 / id 15 | 200 | REDIR-OK | cosmetic (.html -> trailing slash, mkdocs rewrite) |
| 91 | `https://docs.vllm.ai/en/stable/features/quantization/quantized_kvcache.html` | T1 / id 16 | 200 | REDIR-OK | cosmetic (.html -> trailing slash, mkdocs rewrite) |
| 92 | `https://docs.vllm.ai/en/stable/usage/v1_guide/` | T1 / id 3 | 200 | OK |  |
| 93 | `https://docs.vllm.ai/en/v0.10.1/getting_started/installation/aws_neuron.html` | T1 / id 29 | 200 | OK |  |
| 94 | `https://gateway-api-inference-extension.sigs.k8s.io/` | T1 / id 85 | 200 | OK |  |
| 95 | `https://github.com/Inferact/vllm-frontend-rs` | T1 / id 41 | 200 | OK |  |
| 96 | `https://github.com/ai-dynamo/dynamo` | T1 / id 87 | 200 | OK |  |
| 97 | `https://github.com/aws-neuron/upstreaming-to-vllm` | T1 / id 38 | 200 | OK |  |
| 98 | `https://github.com/aws-samples/load-test-llm-with-locust` | T2 / id 152 | 200 | OK |  |
| 99 | `https://github.com/aws/model-hosting-container-standards` | T1 / id 144 | 200 | OK |  |
| 100 | `https://github.com/awslabs/ml-container-creator` | T1 / id 63 | 200 | OK |  |
| 101 | `https://github.com/kubernetes-sigs/gateway-api-inference-extension` | T1 / id 84 | 200 | OK |  |
| 102 | `https://github.com/kubernetes-sigs/inference-perf` | T1 / id 86 | 200 | OK |  |
| 103 | `https://github.com/llm-d/llm-d` | T1 / id 82 | 200 | OK |  |
| 104 | `https://github.com/llm-d/llm-d-inference-scheduler` | T1 / id 83 | 200 | REDIR | -> https://github.com/llm-d/llm-d-router |
| 105 | `https://github.com/vllm-project/guidellm` | T1 / id 40 | 200 | OK |  |
| 106 | `https://github.com/vllm-project/production-stack` | T1 / id 39 | 200 | OK |  |
| 107 | `https://github.com/vllm-project/vllm-neuron` | T1 / id 37 | 200 | OK |  |
| 108 | `https://github.com/vllm-project/vllm/blob/main/docs/serving/online_serving/README.md` | prose only | 200 | OK |  |
| 109 | `https://github.com/vllm-project/vllm/blob/main/vllm/entrypoints/openai/chat_completion/protocol.py` | prose only | 200 | OK |  |
| 110 | `https://github.com/vllm-project/vllm/issues/28163` | T1 / id 145 | 200 | OK |  |
| 111 | `https://github.com/vllm-project/vllm/tree/15652a6b` | T1 / id 30 | 200 | OK |  |
| 112 | `https://github.com/vllm-project/vllm/tree/15652a6b/vllm/model_executor` | T1 / id 33 | 200 | OK |  |
| 113 | `https://github.com/vllm-project/vllm/tree/15652a6b/vllm/v1` | T1 / id 31 | 200 | OK |  |
| 114 | `https://github.com/vllm-project/vllm/tree/main/benchmarks` | T1 / id 34 | 200 | OK |  |
| 115 | `https://github.com/vllm-project/vllm/tree/main/examples/observability/opentelemetry` | T1 / id 36 | 200 | OK |  |
| 116 | `https://github.com/vllm-project/vllm/tree/main/examples/observability/prometheus_grafana` | T1 / id 35 | 200 | OK |  |
| 117 | `https://github.com/vllm-project/vllm/tree/main/vllm/config` | T1 / id 32 | 200 | OK |  |
| 118 | `https://huggingface.co/docs/text-generation-inference` | T1 / id 93 | 200 | REDIR | -> https://huggingface.co/docs/text-generation-inference/index |
| 119 | `https://llm-d.ai/blog/production-grade-llm-inference-at-scale-kserve-llm-d-vllm` | T2 / id 102 | 200 | OK |  |
| 120 | `https://nvidia.github.io/TensorRT-LLM/` | T1 / id 92 | 200 | OK |  |
| 121 | `https://securitylabs.datadoghq.com/articles/litellm-compromised-pypi-teampcp-supply-chain-campaign/` | T3 / id 120 | 200 | OK |  |
| 122 | `https://vllm-project.github.io/2025/12/13/vllm-router-release.html` | T2 / id 43 | 200 | OK |  |
| 123 | `https://vllm.ai/blog/2025-01-27-v1-alpha-release` | T2 / id 42 | 200 | OK |  |
| 124 | `https://www.anyscale.com/blog/ray-serve-llm-anyscale-apis-wide-ep-disaggregated-serving-vllm` | T2 / id 103 | 200 | OK |  |
| 125 | `https://www.prnewswire.com/news-releases/pytorch-foundation-expands-to-umbrella-foundation-and-welcomes-vllm-and-deepspeed-projects-302447897.html` | T2 / id 44 | 200 | OK |  |


---

## 3. Tier integrity

Repo convention (`CLAUDE.md`, and restated verbatim in the header comment of `deep-dives/vllm/src/sections/GlossaryAndSources.tsx`):

```
1 = official docs / API reference / source code
2 = vendor blogs, announcements, product pages
3 = third-party analysis, academic papers, benchmarks
4 = tutorials / unverified posts (never cited as fact)
```

**Result: 28 tier or type mislabels, all 28 in `silicon-memory-inference`, plus 3 lower-severity findings in `vllm`. `efa` has zero tier mislabels.**

### 3.1 Third-party host labelled Tier 1 (the red-line case)

| Dive | id | Title | URL host | Assigned | Should be |
|---|---|---|---|---|---|
| silicon-memory-inference | 125 | "Jetson Orin Nano Series Modules Data Sheet DS-11105-001_v1.5 (NVIDIA doc, mirrored PDF)" | `www.esys.ir` | **Tier 1 / official-docs** | Tier 3, or replace with the NVIDIA-hosted PDF |

This is the single worst finding in the portfolio. `esys.ir` is an Iranian electronics reseller hosting a scraped copy of an NVIDIA datasheet. The entry title admits it ("mirrored PDF"), and `sources.md` even flags it ("mirrored PDF hosting flagged"), yet the appendix ships it as Tier 1 first-party documentation. A mirror is not a primary source: there is no guarantee the PDF matches NVIDIA's published v1.5, and the host can change or remove it at will. Every claim resting on id 125 currently traces to an uncontrolled third party.

### 3.2 Vendor product/marketing pages labelled Tier 1 (17 entries, all in `silicon-memory-inference`)

Every one of these carries `type: 'product-page'` and `tier: 1`, which directly contradicts the stated rule that product pages are Tier 2. `efa` and `vllm` both get this right (0 Tier-1 product pages between them); `silicon-memory-inference` is the outlier.

| id | Title | URL |
|---|---|---|
| 1 | NVIDIA H100 product page | `https://www.nvidia.com/en-us/data-center/h100/` |
| 2 | NVIDIA H200 product page | `https://www.nvidia.com/en-us/data-center/h200/` |
| 3 | NVIDIA HGX overview | `https://www.nvidia.com/en-us/data-center/hgx/` |
| 4 | NVIDIA GB200 NVL72 | `https://www.nvidia.com/en-us/data-center/gb200-nvl72/` |
| 5 | NVIDIA GB300 NVL72 | `https://www.nvidia.com/en-us/data-center/gb300-nvl72/` |
| 6 | NVIDIA Grace CPU | `https://www.nvidia.com/en-us/data-center/grace-cpu/` |
| 33 | AWS EFA page | `https://aws.amazon.com/hpc/efa/` |
| 34 | AWS M8i instance type | `https://aws.amazon.com/ec2/instance-types/m8i/` |
| 50 | Intel Xeon 6 product brief | `https://www.intel.com/.../6th-gen-xeon-processors-product-brief.html` |
| 52 | AMD EPYC 9005 Series | `https://www.amd.com/en/products/processors/server/epyc/9005-series.html` |
| 60 | ARM CMN-S3 | `https://www.arm.com/products/silicon-ip-system/neoverse-interconnect/cmn-s3` |
| 80 | Cerebras | `https://www.cerebras.ai/` |
| 81 | Cerebras Inference | `https://www.cerebras.ai/inference` |
| 82 | Groq | `https://groq.com/` |
| 83 | HyperCIM | `https://hypercim.com/` |
| 120 | NVIDIA DGX Spark product page | `https://www.nvidia.com/en-us/products/workstations/dgx-spark/` |
| 126 | Jetson Orin Nano Super Developer Kit page | `https://www.nvidia.com/.../nano-super-developer-kit/` |

Ids 80-83 are the most consequential of these: `cerebras.ai/`, `cerebras.ai/inference`, `groq.com/` and `hypercim.com/` are bare marketing homepages with no stable content, elevated to the same authority tier as the CUDA Programming Guide. Ids 1-6 and 120/126 are NVIDIA marketing spec tables, which do carry vendor-published numbers but are not documentation and are edited without changelogs.

### 3.3 Cross-dive tier contradiction on the same URL

| URL | `efa` | `silicon-memory-inference` |
|---|---|---|
| `https://aws.amazon.com/hpc/efa/` | Tier **2** (id 11, `product-page`) | Tier **1** (id 33, `product-page`) |

The same page cannot be both. `efa`'s Tier 2 is the correct reading of the convention.

Similarly, `https://docs.sglang.ai/` is Tier 1 in both `silicon-memory-inference` (id 73) and `vllm` (id 91) — consistent, and correct — but both now redirect to `docs.sglang.io` (see section 1.4).

### 3.4 `type` field contradicts publisher or tier (9 entries, all `silicon-memory-inference`)

| id | Title | Declared type | Actual publisher / problem |
|---|---|---|---|
| 20 | NVIDIA Technical Blog — GB200 NVL72 + Dynamo for MoE | `aws-blog` | `developer.nvidia.com` |
| 21 | NVIDIA blog — Introducing NVFP4 | `aws-blog` | `developer.nvidia.com` |
| 22 | NVIDIA blog — Blackwell SemiAnalysis InferenceMAX | `aws-blog` | `developer.nvidia.com` |
| 84 | Samsung Semiconductor Tech Blog | `aws-blog` | `semiconductor.samsung.com` |
| 92 | Databricks DBRX | `aws-blog` | `www.databricks.com` |
| 129 | NVIDIA blog — DGX Spark Performance | `aws-blog` | `developer.nvidia.com` |
| 130 | NVIDIA blog — Jetson Orin Nano Super Boost | `aws-blog` | `developer.nvidia.com` |
| 137 | NVIDIA blog — Getting Started with Edge AI on Jetson | `aws-blog` | `developer.nvidia.com` |
| 131 | Jetson AI Lab benchmarks (NVIDIA-operated) | `third-party-benchmark` | Declared **Tier 2** while typed as a third-party benchmark. The title itself says "NVIDIA-operated", i.e. first-party. Tier 2 is defensible; the `type` string is not. |

Id 22 deserves separate note: it is an NVIDIA blog post *about* a SemiAnalysis benchmark. Tier 2 is right for the NVIDIA post, but any performance number taken from it is a vendor's presentation of a third party's benchmark and should be labelled as vendor-claimed in-section.

### 3.5 `vllm` findings (lower severity, no red-line violations)

| id | Title | Assigned | Issue |
|---|---|---|---|
| 145 | vLLM RFC: SageMaker session affinity (#28163) | Tier 1, `source-code` | A GitHub **issue thread** is neither source code nor official documentation. It is an unmerged proposal. Tier 2 at most, and the `type` should not be `source-code`. Anything cited from it describes intent, not shipped behavior. |
| 152 | `aws-samples/load-test-llm-with-locust` | Tier 2, `aws-open-source` | Internally inconsistent with ids 63 (`awslabs/ml-container-creator`) and 144 (`aws/model-hosting-container-standards`), which are the same class of AWS-org sample repo but assigned Tier 1. Pick one rule. |
| 44 | PyTorch Foundation welcomes vLLM | Tier 2, `announcement` | Host is `www.prnewswire.com`, a paid wire-distribution service, not the foundation's own channel. The content is a first-party release, so Tier 2 is acceptable, but the primary would be the PyTorch Foundation's own post. |

Borderline but defensible, recorded for completeness: id 41 `Inferact/vllm-frontend-rs` at Tier 1 (third-party org, but it is the actual source code of the Rust frontend, so Tier 1 as source code holds); id 103 Anyscale blog at Tier 2 (Anyscale is first-party to Ray but third-party to vLLM).

### 3.6 `efa` findings

Zero tier mislabels. One structural concern instead, covered in section 4.2: the Tier 3 personal blog `ernestchiang.com` carries more load-bearing quantitative claims than any Tier 1 source in the dive.

---

## 4. Orphans and gaps

### 4.1 `efa` — sources never referenced by any `factCheck`

`Sources.tsx` declares **39** sources and **70** `factCheck` entries. The `factChecks` array references only **25 distinct** `sourceId` values. **14 sources are orphans** (confirms the prior audit's count exactly).

| id | Tier | Title |
|---|---|---|
| 2 | 1 | AWS EC2 User Guide — Get started with EFA and MPI |
| 3 | 1 | AWS EC2 User Guide — Get started with EFA and NCCL |
| 6 | 1 | AWS EC2 Placement Groups |
| 13 | 2 | AWS What's New — P5en N. Virginia/Jakarta (Mar 2025) |
| 14 | 2 | AWS What's New — P5en N. California (May 2025) |
| 15 | 2 | AWS What's New — Trn2 GA (Dec 2024) |
| 16 | 2 | AWS What's New — EFA Cross-Subnet (2024) |
| 17 | 1 | aws/aws-ofi-nccl GitHub README |
| 18 | 1 | aws/aws-ofi-nccl Releases |
| 20 | 1 | AWS Neuron Training FAQ |
| 22 | 1 | SageMaker Expert Parallelism |
| 23 | 2 | Multi-Node vLLM EKS Blueprints |
| 29 | 1 | EC2 DescribeInstanceTopology API Reference |
| 35 | 1 | NVIDIA NIXL GitHub Repository |

Id 29 is the notable one: `DescribeInstanceTopology` gets substantial prose treatment in `Architecture.tsx` (the "NCCL does not call the EC2 topology API" discussion) but that claim is fact-checked against source 32 (NCCL source), never against the API reference itself.

### 4.2 `efa` — no inline citations exist anywhere in section prose

**All 39 URLs in `deep-dives/efa/src/` appear exclusively inside `Sources.tsx`.** A direct grep for `href=` across the ten section files (`Overview`, `Architecture`, `InstanceSupport`, `AIMLTraining`, `AIMLInference`, `HPC`, `NetworkComparison`, `Pricing`, `EKSIntegration`, `DecisionGuide`) returns **zero matches**. The `Link` occurrences in those files are Cloudscape component references and prose mentions of "NVLink", not anchors.

This means EFA's entire citation mechanism is the `factChecks` array in the appendix. A reader in the Architecture section who wants the source for "64-path packet spraying in SRD" has no link to follow: they must scroll to the appendix and match the claim string by hand. This is the largest citation-integrity gap in the portfolio and it is structural rather than a per-link defect. Compare `silicon-memory-inference` (24 additional external links in prose beyond the appendix) and `vllm` (every appendix URL also appears in prose — 0 prose orphans).

Fact-check density is also uneven. Citation counts by source:

| sourceId | Publisher | Tier | factChecks citing it |
|---|---|---|---|
| 25 | `ernestchiang.com` (personal blog) | **3** | **12** |
| 8 | EC2 P5 product page | 2 | 8 |
| 9 | EC2 Trn2 product page | 2 | 7 |
| 5 | EC2 accelerated instance specs | 1 | 7 |
| 26 | AWS HPC blog | 2 | 5 |

The single most-cited source in the EFA dive is a Tier 3 personal blog, and it carries nearly every core latency and SRD-protocol number: the ~15 microsecond ping-pong figure, the 64-path spraying claim, the P99.9 85% reduction, the ~25 Gbps vs ~5 Gbps single-flow comparison, the "100x faster retransmission than RFC 6298", and the attribution to the IEEE Micro 2020 SRD paper. The dive's own `factChecks` array names the origin ("SRD described in IEEE Micro 2020 paper by Shalev et al.") yet still points that entry at `sourceId: 25` rather than at the paper. The IEEE Micro paper is **not in the sources array at all**. The dive currently launders primary-source numbers through a third-party summary. [Exact paper title and DOI were not fetched during this audit — locate and verify the IEEE Micro 2020 entry before adding it.]

### 4.3 `silicon-memory-inference` — declared but never cited in prose (8 of 69)

| id | Tier | Title |
|---|---|---|
| 14 | 1 | NeMo MoE feature docs |
| 72 | 1 | JAX documentation |
| 123 | 1 | DGX Spark User Guide — Spark Stacking (clustering) |
| 124 | 1 | NIM for LLMs — Deploy on DGX Spark |
| 125 | 1 | Jetson Orin Nano Datasheet (the `esys.ir` mirror) |
| 128 | 1 | JetPack 6.2 Release Notes |
| 135 | 3 | TechInsights — GB10 packaging analysis |
| 136 | 3 | EXO Labs — DGX Spark + Mac Studio |

Id 135 matters: the glossary entry for `CoWoS-R` explicitly says "teardown analysis reports GB10 uses it (Tier 3)", which is exactly the TechInsights source — but the URL is never linked from that entry or anywhere else in prose.

### 4.4 `silicon-memory-inference` — cited in prose but never declared (24)

These are real external links shipped to readers with no tier grading and no access date:

`https://antoinesavine.com/` · `https://arxiv.org/abs/2005.02347` · `https://aws.amazon.com/ec2/instance-types/` · `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/release-notes/` · `https://chipsandcheese.com/p/evaluating-uniform-memory-access` · `https://docs.nvidia.com/nsight-compute/` · `https://github.com/NVIDIA/cutlass/tree/main/examples/92_blackwell_moe_gemm` · `https://github.com/aws/aws-graviton-getting-started` · `https://github.com/differential-machine-learning` · `https://github.com/differential-machine-learning/appendices` · `https://github.com/differential-machine-learning/notebooks` · `https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B` · `https://huggingface.co/Qwen/Qwen2.5-1.5B` · `https://huggingface.co/deepseek-ai/DeepSeek-V3` · `https://huggingface.co/google/gemma-2-2b` · `https://huggingface.co/google/gemma-3-1b-it` · `https://huggingface.co/meta-llama/Llama-3.2-1B` · `https://huggingface.co/microsoft/Phi-3-mini-4k-instruct` · `https://huggingface.co/microsoft/phi-4` · `https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3` · `https://lwn.net/Articles/1007283/` · `https://www.amd.com/content/dam/amd/en/documents/epyc-technical-docs/white-papers/58725.pdf` · `https://www.arm.com/products/silicon-ip-cpu/neoverse/neoverse-v3` · `https://www.bis.org/bcbs/publ/d457.htm`

All 24 return 200. Three are load-bearing and should be promoted into the sources array with a tier: `chipsandcheese.com/p/evaluating-uniform-memory-access` (Tier 3), the AMD EPYC white paper 58725 PDF (Tier 1), and `bis.org/bcbs/publ/d457.htm` (Basel Committee, Tier 1 for the capital-markets section). `antoinesavine.com` and the three `differential-machine-learning` repos are Tier 3/4 personal material carrying no tier label at all.

### 4.5 `vllm` — zero prose orphans

All 110 declared sources also appear as links in section prose. This is the strongest citation hygiene in the portfolio. `vllm` has **no `factChecks` array at all** (`SourcesAppendix` is called with `sources` only), so there is no claim-to-source register to audit for orphans, but the inline-link coverage compensates.

Nine URLs appear in `vllm` prose without being declared in the sources array; six are cosmetic variants of already-declared docs pages, two are real additions worth declaring (`https://github.com/vllm-project/vllm/blob/main/docs/serving/online_serving/README.md` and `https://github.com/vllm-project/vllm/blob/main/vllm/entrypoints/openai/chat_completion/protocol.py`, both 200), and one is the `http://host:8000` placeholder.

---

## 5. `sources.md` sync

### 5.1 `efa/sources.md` — 11 behind (confirms prior audit)

`sources.md` lists sources **1 to 28**. `Sources.tsx` declares **1 to 39**. Nothing in `sources.md` is missing from the app, so the delta is one-directional: **11 sources exist in the app and not in the file.**

| id | Tier | Title |
|---|---|---|
| 29 | 1 | EC2 DescribeInstanceTopology API Reference |
| 30 | 1 | EC2 Capacity Blocks for ML |
| 31 | 1 | EC2 On-Demand Capacity Reservations |
| 32 | 1 | NVIDIA/nccl source code (search.cc) — **dead link** |
| 33 | 1 | aws/aws-ofi-nccl tuner source — **dead link** |
| 34 | 1 | aws/aws-ofi-nccl topology XML files |
| 35 | 1 | NVIDIA NIXL GitHub Repository |
| 36 | 1 | NIXL Architecture Documentation — **dead link** |
| 37 | 1 | NIXL libfabric Backend README — **dead link** |
| 38 | 1 | vLLM NixlConnector Source — **dead link** |
| 39 | 3 | UCCL KV-Cache Transfer Benchmark — **dead link, misattributed** |

Every one of the six dead EFA links sits inside this 11-source gap. The NIXL and NCCL-internals sources were added to the app in a later wave and never propagated to `sources.md`, and they are exactly the sources that have since rotted. `sources.md` also carries no tier column at all (only a free-text "Type:" field), so it cannot be used to verify tier assignments.

### 5.2 `silicon-memory-inference/sources.md` — not a bibliography

This file is a sourcing-policy document with a partial, theme-organized URL list, not an enumerated bibliography. It contains **24** URLs against **69** in the app.

- **54 app sources absent from `sources.md`** (including every NVIDIA product page, every Chips and Cheese analysis, both arXiv papers, the Roofline paper, and all Tier 3 third-party measurement).
- **9 URLs in `sources.md` absent from the app**: `torch-neuronx`, Neuron `tools/`, cuBLAS, cuDNN, `docs.nvidia.com/dgx/dgx-spark/`, Nsight Compute, Nsight Systems, `cutlass/tree/main/media/docs/cute`, `pytorch.org/docs/`. Two of these are dead (`torch-neuronx`, `media/docs/cute`) and are therefore rotted links that only exist in the doc file, invisible to any app-level check.
- The file's own "Fact-check register" section is an unfilled placeholder: "Will be populated here as each section moves from scaffold to draft." The "UNKNOWN register" is likewise empty. Both have been empty since 2026-04-23.

### 5.3 `vllm` — no `sources.md` at all

`deep-dives/vllm/` has **no `sources.md`**, which violates the per-dive contract in `CLAUDE.md` ("Each deep dive directory contains: ... `sources.md` — All authoritative sources with URLs and access dates"). The appendix component is the only bibliography. In practice `vllm`'s appendix is the best-maintained of the three, so the missing file is a process-compliance gap rather than a content gap — but it means there is no plain-text, diffable source register for the largest dive in the portfolio (110 sources).

---

## 6. Access-date staleness

Reference date 2026-08-01. Six-month threshold: anything stamped before **2026-02-01**.

| Dive | Access dates | Count | Age at 2026-08-01 | Over 6 months? |
|---|---|---|---|---|
| efa | `2026-03-22` (uniform) | 39 | 4.3 months | No |
| silicon-memory-inference | `2026-03-22` | 1 | 4.3 months | No |
| | `2026-04-21` | 1 | 3.4 months | No |
| | `2026-04-23` | 43 | 3.3 months | No |
| | `2026-04-24` | 6 | 3.2 months | No |
| | `2026-07-18` | 18 | 0.5 months | No |
| vllm | `2026-06-07` (uniform) | 110 | 1.8 months | No |
| `efa/sources.md` | `2026-03-22` (uniform) | 28 | 4.3 months | No |
| `silicon-memory-inference/sources.md` | `2026-07-18` (one bulk stamp) | 1 | 0.5 months | No |

**Nothing in the portfolio exceeds the 6-month threshold.** Three observations that matter more than the raw ages:

1. **`efa`'s dates are stale relative to its own content.** All 39 entries read `accessDate: '2026-03-22'`, but `deep-dives/efa/research/2026-08-refresh/` contains a full re-verification wave (`01-efa-core.md` through `07-storage-datapaths.md` plus three `V*-verify-*.md` files). Content was refreshed in the current month; the access stamps were not touched. Six of the 39 URLs are now dead, which means the 2026-03-22 stamp is asserting verification that no longer holds.
2. **The stamps are bulk-assigned, not per-fetch.** 39/39, 110/110, and 43/69 entries share a single date. These are wave timestamps, not evidence that each individual URL was opened on that day. They cannot distinguish "checked and confirmed" from "added in the same batch".
3. **`silicon-memory-inference` id 95 carries `2026-03-22`** while every other source in that dive is 2026-04-23 or later. That is the NIXL repo URL copied over from the `efa` dive with its original stamp, not independently accessed.

---

## 7. Prioritized remediation

**P0 — factually wrong, fix before anything else**

1. `silicon-memory-inference` id 125: replace the `esys.ir` mirror with the NVIDIA-hosted datasheet, or demote to Tier 3. A third-party mirror cannot be Tier 1.
2. `efa` id 39: the URL is dead *and* the attribution is wrong. UCCL is `uccl-project/uccl`, not `NVIDIA/uccl`. Fix the title, the URL, and re-verify the "NIXL outperforms NCCL by 30-50%" claim that depends on it.

**P1 — dead links (10)**

3. Repoint the five relocatable ones (`nccl/src/graph/search.cc`, `aws-ofi-nccl/src/tuner/`, `cutlass/media/docs/cpp/cute`, `vllm .../v1/nixl`, `docs.vllm.ai/en/latest/configuration/conserving_memory/`).
4. Re-source the four with no direct replacement (both NIXL doc pages, both Neuron pages) and re-verify the claims resting on them — notably "NIXL requires libfabric 1.21.0+" and "EFA is the only validated libfabric provider for NIXL", both of which cite the deleted NIXL libfabric README (`efa` id 37).
5. Replace `vllm` id 59 (AWS DLC page silently redirecting to the guide index) and id 57 (EKS vLLM quickstart consolidated into a generic page).

**P2 — tier corrections (28)**

6. Demote the 17 Tier-1 `product-page` entries in `silicon-memory-inference` to Tier 2, and reconcile id 33 (`aws.amazon.com/hpc/efa/`) with `efa` id 11.
7. Fix the 9 `type` fields (8 mislabelled `aws-blog`, 1 tier/type contradiction on id 131).
8. `vllm` id 145: a GitHub issue is not Tier 1 source code.

**P3 — structural**

9. `efa`: add inline citation links to section prose. Zero of ten sections currently link a source.
10. `efa`: add Shalev et al., IEEE Micro 40(6) 2020 as a Tier 3 academic primary and move the SRD numbers off the `ernestchiang.com` summary (12 of 70 factChecks).
11. `efa`: bring `sources.md` up from 28 to 39 entries and add a tier column.
12. `vllm`: create `deep-dives/vllm/sources.md`.
13. `silicon-memory-inference`: promote the 3 load-bearing undeclared prose URLs into the sources array; fill or delete the empty fact-check and UNKNOWN registers in `sources.md`.
14. Re-stamp `efa` access dates to match the 2026-08 refresh wave that already happened.
