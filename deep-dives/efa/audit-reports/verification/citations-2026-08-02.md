# Citation re-verification: efa

Run date: 2026-08-02  
Tree: `d4d0262`  
Check: `scripts/audit/verify-citations.sh` (Tier 1.5, deterministic, networked, no LLM)  
Scope: `deep-dives/efa/src/**/*.tsx` and `*.ts`, excluding tests
Also: `deep-dives/efa/research/**/*.md`, GitHub blob and tree URLs only (`pinned-refs-research`)

## Summary

| Metric | Count |
|---|---|
| Documentation citations extracted | 253 |
| Unique documentation URLs checked | 158 |
| URLs resolving cleanly | 157 |
| URLs redirecting to the same page | 1 |
| URLs redirecting to an index (rot) | 0 |
| URLs dead (404 or 410) | 0 |
| URLs blocked (401, 403, 429) | 0 |
| URLs timed out | 0 |
| URLs erroring | 0 |
| Code citations extracted | 377 |
| Unique pinned files checked | 165 |
| Files present and long enough at the pinned ref | 165 |
| Of those, directory references (no line check) | 12 |
| Files present but shorter than the cited line | 0 |
| Files missing at a ref that does resolve | 0 |
| Refs that do not resolve | 0 |
| Fetch 404 with an inconclusive API check | 0 |
| Code fetches blocked | 0 |
| Code fetches erroring | 0 |

## Failures

None. Every documentation URL resolved and every pinned code reference exists at its ref with enough lines for the cited range.

## Documentation URLs

| Status | HTTP | URL | Cited at | Citations | Final URL |
|---|---|---|---|---|---|
| OK | 200 | `https://aws-ia.github.io/terraform-aws-eks-blueprints/patterns/machine-learning/multi-node-vllm/` | src/sections/Sources.tsx:38 | 1 | - |
| OK | 200 | `https://aws.amazon.com/about-aws/whats-new/2024/10/aws-efa-updates-scalability-ai-ml-applications/` | src/sections/EfaDevice.tsx:72 | 1 | - |
| OK | 200 | `https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-p5en-instances-generative-ai-hpc-generally-available/` | src/sections/Sources.tsx:33 | 1 | - |
| OK | 200 | `https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-ec2-trn2-instances-available/` | src/sections/Sources.tsx:36 | 1 | - |
| OK | 200 | `https://aws.amazon.com/about-aws/whats-new/2025/03/amazon-ec2-p5en-instances-n-virginia-jakarta/` | src/sections/Sources.tsx:34 | 1 | - |
| OK | 200 | `https://aws.amazon.com/about-aws/whats-new/2025/05/amazon-ec2-p5en-instances-aws-us-west-n-california-region/` | src/sections/Sources.tsx:35 | 1 | - |
| OK | 200 | `https://aws.amazon.com/about-aws/whats-new/2025/10/capacity-reservation-topology-api-ai-ml-hpc-instance-type/` | src/sections/TopologyApi.tsx:146 | 1 | - |
| OK | 200 | `https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/` | src/data/instances.ts:86 | 1 | - |
| OK | 200 | `https://aws.amazon.com/about-aws/whats-new/2026/01/amazon-g7e-instances-generally-available/` | src/data/instances.ts:74 | 2 | - |
| OK | 200 | `https://aws.amazon.com/about-aws/whats-new/2026/02/announcing-amazon-ec2-hpc8a-instances/` | src/sections/HPC.tsx:52 | 1 | - |
| OK | 200 | `https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-sagemaker-ai-inf-auto-inst/` | src/sections/SageMaker.tsx:169 | 1 | - |
| OK | 200 | `https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-sagemaker-hyperpod-automatic-slurm-topology/` | src/sections/SageMaker.tsx:159 | 1 | - |
| OK | 200 | `https://aws.amazon.com/about-aws/whats-new/2026/04/sagemaker-hyperpod-flexible-instance-groups/` | src/sections/SageMaker.tsx:164 | 1 | - |
| OK | 200 | `https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-ec2-g7-generally-available/` | src/data/instances.ts:80 | 2 | - |
| OK | 200 | `https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-sagemaker-hyperpod-efa-only/` | src/sections/SageMaker.tsx:149 | 1 | - |
| OK | 200 | `https://aws.amazon.com/about-aws/whats-new/2026/7/amazon-sagemaker-hyperpod-dpd/` | src/sections/SageMaker.tsx:154 | 1 | - |
| OK | 200 | `https://aws.amazon.com/ai/machine-learning/trainium/` | src/sections/AIMLTraining.tsx:115 | 1 | - |
| OK | 200 | `https://aws.amazon.com/blogs/containers/unlocking-next-generation-ai-performance-with-dynamic-resource-allocation-on-amazon-eks-and-amazon-ec2-p6e-gb200/` | src/sections/TopologyApi.tsx:152 | 2 | - |
| OK | 200 | `https://aws.amazon.com/blogs/hpc/in-the-search-for-performance-theres-more-than-one-way-to-build-a-network/` | src/sections/NetworkComparison.tsx:69 | 3 | - |
| OK | 200 | `https://aws.amazon.com/blogs/hpc/optimizing-mpi-application-performance-on-hpc7a-by-effectively-using-both-efa-devices/` | src/sections/HPC.tsx:59 | 2 | - |
| OK | 200 | `https://aws.amazon.com/blogs/hpc/second-generation-efa-improving-hpc-and-ml-application-performance-in-the-cloud/` | src/sections/HPC.tsx:66 | 2 | - |
| OK | 200 | `https://aws.amazon.com/blogs/machine-learning/accelerate-pre-training-of-mistrals-mathstral-model-with-highly-resilient-clusters-on-amazon-sagemaker-hyperpod/` | src/sections/SageMaker.tsx:189 | 1 | - |
| OK | 200 | `https://aws.amazon.com/blogs/machine-learning/disaggregated-prefill-and-decode-for-llm-inference-on-sagemaker-hyperpod/` | src/sections/SageMaker.tsx:179 | 1 | - |
| OK | 200 | `https://aws.amazon.com/blogs/machine-learning/how-amazon-scaled-rufus-by-building-multi-node-inference-using-aws-trainium-chips-and-vllm/` | src/sections/SageMaker.tsx:204 | 1 | - |
| OK | 200 | `https://aws.amazon.com/blogs/machine-learning/introducing-amazon-eks-support-in-amazon-sagemaker-hyperpod/` | src/sections/SageMaker.tsx:184 | 1 | - |
| OK | 200 | `https://aws.amazon.com/blogs/machine-learning/new-performance-improvements-in-amazon-sagemaker-model-parallel-library/` | src/sections/SageMaker.tsx:194 | 1 | - |
| OK | 200 | `https://aws.amazon.com/blogs/machine-learning/scale-foundation-model-inference-to-hundreds-of-models-with-amazon-sagemaker-part-1/` | src/sections/SageMaker.tsx:199 | 1 | - |
| OK | 200 | `https://aws.amazon.com/blogs/machine-learning/training-large-language-models-on-amazon-sagemaker-best-practices/` | src/sections/SageMaker.tsx:174 | 1 | - |
| OK | 200 | `https://aws.amazon.com/blogs/storage/improving-amazon-s3-throughput-for-the-aws-cli-and-boto3-with-the-aws-common-runtime/` | src/sections/StorageDataPaths.tsx:126 | 1 | - |
| OK | 200 | `https://aws.amazon.com/blogs/storage/storage-for-i-o-intensive-sql-server-using-amazon-ebs-io2-block-express/` | src/sections/SrdProtocol.tsx:112 | 1 | - |
| OK | 200 | `https://aws.amazon.com/ec2/capacityblocks/pricing/` | src/data/pricing.ts:94 | 1 | - |
| OK | 200 | `https://aws.amazon.com/ec2/instance-types/p5/` | src/sections/Sources.tsx:29 | 1 | - |
| OK | 200 | `https://aws.amazon.com/ec2/instance-types/trn2/` | src/sections/AIMLTraining.tsx:109 | 3 | - |
| OK | 200 | `https://aws.amazon.com/ec2/ultraservers/` | src/data/instances.ts:92 | 2 | - |
| OK | 200 | `https://aws.amazon.com/hpc/efa/` | src/sections/Sources.tsx:32 | 1 | - |
| OK | 200 | `https://aws.amazon.com/new/` | src/sections/SageMaker.tsx:37 | 1 | - |
| OK | 200 | `https://aws.github.io/eks-charts` | src/sections/EKSIntegration.tsx:927 | 1 | `https://aws.github.io/eks-charts/` |
| OK | 200 | `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/faq/training/neuron-training.html` | src/sections/Sources.tsx:16 | 1 | - |
| OK | 200 | `https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html` | src/sections/Sources.tsx:15 | 1 | - |
| OK | 200 | `https://awslabs.github.io/ai-on-eks/` | src/sections/EKSIntegration.tsx:119 | 1 | - |
| OK | 200 | `https://cfd.direct/cloud/openfoam-hpc-aws-efa/` | src/sections/HPC.tsx:72 | 2 | - |
| OK | 200 | `https://conferences.sigcomm.org/sigcomm/2015/pdf/papers/p523.pdf` | src/sections/SrdProtocol.tsx:126 | 1 | - |
| OK | 200 | `https://d1.awsstatic.com/whitepapers/benchmarking-aws-and-hpc-services.pdf` | src/sections/Sources.tsx:41 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-design-patterns.html` | src/sections/StorageDataPaths.tsx:115 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html` | src/sections/StorageDataPaths.tsx:108 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CapacityReservationTopology.html` | src/sections/TopologyApi.tsx:86 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeCapacityReservationTopology.html` | src/sections/TopologyApi.tsx:80 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTopology.html` | src/sections/Sources.tsx:19 | 2 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTypes.html` | src/data/instances.ts:68 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_InstanceTopology.html` | src/sections/TopologyApi.tsx:74 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-how.html` | src/data/pricing.ts:87 | 2 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/cr-cpg.html` | src/sections/TopologyApi.tsx:110 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/detach-efa.html` | src/sections/Operations.tsx:86 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html` | src/sections/Sources.tsx:20 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html` | src/sections/Sources.tsx:21 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-network-bandwidth.html` | src/sections/EnaVsEfa.tsx:87 | 4 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology-examples.html` | src/sections/TopologyApi.tsx:62 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology-prerequisites.html` | src/sections/TopologyApi.tsx:56 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology.html` | src/sections/TopologyApi.tsx:44 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html` | src/data/instances.ts:32 | 11 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html` | src/sections/DataPath.tsx:106 | 4 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html` | src/sections/AIMLTraining.tsx:91 | 6 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nixl.html` | src/sections/AIMLInference.tsx:44 | 3 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html` | src/data/instances.ts:38 | 11 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-verify.html` | src/sections/Operations.tsx:85 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-working-monitor.html` | src/sections/Operations.tsx:81 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html` | src/data/instances.ts:26 | 20 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ena-express.html` | src/sections/EnaVsEfa.tsx:81 | 4 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-topology-works.html` | src/sections/TopologyApi.tsx:50 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html` | src/sections/Sources.tsx:13 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/batch/latest/userguide/eks.html` | src/sections/EKSIntegration.tsx:107 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/batch/latest/userguide/mnp-ce.html` | src/sections/EKSIntegration.tsx:104 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/batch/latest/userguide/multi-node-parallel-jobs.html` | src/sections/EKSIntegration.tsx:101 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-reservation-topology.html` | src/sections/TopologyApi.tsx:92 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/cli/latest/topic/s3-config.html` | src/sections/StorageDataPaths.tsx:118 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html` | src/sections/SrdProtocol.tsx:94 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/ec2/latest/devguide/ec2-api-throttling.html` | src/sections/TopologyApi.tsx:98 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/ec2/latest/devguide/eventual-consistency.html` | src/sections/TopologyApi.tsx:104 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html` | src/data/instances.ts:44 | 4 | - |
| OK | 200 | `https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html` | src/data/instances.ts:56 | 2 | - |
| OK | 200 | `https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html` | src/data/instances.ts:62 | 2 | - |
| OK | 200 | `https://docs.aws.amazon.com/ec2/latest/instancetypes/hpc.html` | src/data/instances.ts:50 | 4 | - |
| OK | 200 | `https://docs.aws.amazon.com/eks/latest/best-practices/aiml-networking.html` | src/sections/DecisionGuide.tsx:109 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/eks/latest/userguide/create-node-class.html` | src/sections/DecisionGuide.tsx:61 | 2 | - |
| OK | 200 | `https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html` | src/sections/EfaDevice.tsx:69 | 4 | - |
| OK | 200 | `https://docs.aws.amazon.com/eks/latest/userguide/device-management-nvidia.html` | src/sections/EKSIntegration.tsx:92 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/eks/latest/userguide/eks-ami-build-scripts.html` | src/sections/EKSIntegration.tsx:82 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html` | src/sections/EKSIntegration.tsx:77 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/eks/latest/userguide/ml-node-pools.html` | src/sections/DecisionGuide.tsx:55 | 2 | - |
| OK | 200 | `https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html` | src/sections/EfaDevice.tsx:68 | 4 | - |
| OK | 200 | `https://docs.aws.amazon.com/fsx/latest/LustreGuide/configure-efa-clients.html` | src/sections/StorageDataPaths.tsx:95 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/fsx/latest/LustreGuide/create-dra-linked-data-repo.html` | src/sections/StorageDataPaths.tsx:103 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/fsx/latest/LustreGuide/doc-history.html` | src/sections/StorageDataPaths.tsx:107 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/fsx/latest/LustreGuide/efa-file-systems.html` | src/sections/StorageDataPaths.tsx:94 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/fsx/latest/LustreGuide/fsx-data-repositories.html` | src/sections/StorageDataPaths.tsx:102 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/fsx/latest/LustreGuide/getting-started.html` | src/sections/StorageDataPaths.tsx:106 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/fsx/latest/LustreGuide/importing-files-dra.html` | src/sections/StorageDataPaths.tsx:104 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/fsx/latest/LustreGuide/limit-access-security-groups.html` | src/sections/StorageDataPaths.tsx:99 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html` | src/sections/StorageDataPaths.tsx:96 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/fsx/latest/LustreGuide/using-fsx-lustre.html` | src/sections/StorageDataPaths.tsx:105 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/parallelcluster/latest/ug/compute-node-initialization-odcr-v3.html` | src/sections/TopologyApi.tsx:140 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks-nvidia-imex.html` | src/sections/TopologyApi.tsx:128 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ClusterNetworkInterface.html` | src/sections/SageMaker.tsx:89 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ProductionVariant.html` | src/sections/SageMaker.tsx:88 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ResourceConfig.html` | src/sections/SageMaker.tsx:87 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-faq.html` | src/sections/SageMaker.tsx:96 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-intro.html` | src/sections/DecisionGuide.tsx:97 | 3 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-release-notes.html` | src/sections/DecisionGuide.tsx:103 | 2 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-data-parallel-support.html` | src/sections/DecisionGuide.tsx:91 | 2 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-training-get-started.html` | src/sections/SageMaker.tsx:73 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/hyperpod-observability-cluster-metrics.html` | src/sections/SageMaker.tsx:127 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/model-checkpoints-cluster-repair.html` | src/sections/SageMaker.tsx:86 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-core-features-v2-expert-parallelism.html` | src/sections/Sources.tsx:18 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-core-features-v2-smddp-allgather.html` | src/sections/SageMaker.tsx:105 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-release-notes.html` | src/sections/SageMaker.tsx:100 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/multi-model-endpoint-instance.html` | src/sections/SageMaker.tsx:143 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/realtime-endpoints-deploy-models.html` | src/sections/SageMaker.tsx:140 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-ami-support-policy.html` | src/sections/SageMaker.tsx:108 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-tasks-scheduling.html` | src/sections/DecisionGuide.tsx:49 | 2 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-prerequisites.html` | src/sections/SageMaker.tsx:131 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-config-tips.html` | src/sections/SageMaker.tsx:118 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-deep-health-checks.html` | src/sections/SageMaker.tsx:113 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-faq-slurm.html` | src/sections/SageMaker.tsx:128 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-dpd.html` | src/sections/SageMaker.tsx:137 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment.html` | src/sections/SageMaker.tsx:134 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-ami-slurm.html` | src/sections/SageMaker.tsx:109 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-ami.html` | src/sections/SageMaker.tsx:110 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html` | src/sections/SageMaker.tsx:123 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-topology.html` | src/sections/SageMaker.tsx:126 | 2 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/train-encrypt.html` | src/sections/SageMaker.tsx:83 | 1 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/train-get-capacity.html` | src/sections/DecisionGuide.tsx:79 | 2 | - |
| OK | 200 | `https://docs.aws.amazon.com/sagemaker/latest/dg/your-algorithms-training-efa.html` | src/sections/DecisionGuide.tsx:85 | 2 | - |
| OK | 200 | `https://docs.aws.amazon.com/wellarchitected/latest/high-performance-computing-lens/data-protection.html` | src/sections/NetworkComparison.tsx:62 | 2 | - |
| OK | 200 | `https://efa-installer.amazonaws.com/aws-efa-installer-1.49.0.tar.gz` | src/sections/EKSIntegration.tsx:115 | 1 | - |
| OK | 200 | `https://github.com/ai-dynamo/nixl` | src/sections/Sources.tsx:46 | 1 | - |
| OK | 200 | `https://github.com/ai-dynamo/nixl/blob/v1.3.2/src/plugins/libfabric/README.md` | src/sections/Sources.tsx:48 | 1 | - |
| OK | 200 | `https://github.com/ai-dynamo/nixl/tree/v1.3.2` | src/sections/Sources.tsx:47 | 1 | - |
| OK | 200 | `https://github.com/amzn/amzn-drivers.git` | src/sections/SrdProtocol.tsx:1230 | 1 | `https://github.com/amzn/amzn-drivers` |
| OK | 200 | `https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/README.md` | src/sections/Sources.tsx:23 | 1 | - |
| OK | 200 | `https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/src/tuner/nccl_ofi_tuner.cpp` | src/sections/Sources.tsx:26 | 1 | - |
| OK | 200 | `https://github.com/aws/aws-ofi-nccl/releases` | src/sections/Sources.tsx:24 | 1 | - |
| OK | 200 | `https://github.com/aws/aws-ofi-nccl/tree/v1.20.0/topology` | src/sections/Sources.tsx:27 | 1 | - |
| OK | 200 | `https://github.com/awslabs/amazon-eks-ami/releases/tag/v20260728` | src/sections/EKSIntegration.tsx:110 | 1 | - |
| OK | 200 | `https://github.com/NVIDIA/nccl/blob/v2.30.7-1/src/graph/search.cc` | src/sections/Sources.tsx:25 | 1 | - |
| OK | 200 | `https://github.com/uccl-project/uccl/tree/v0.1.1/p2p/benchmarks` | src/sections/Sources.tsx:50 | 1 | - |
| OK | 200 | `https://github.com/vllm-project/vllm/tree/v0.26.0/vllm/distributed/kv_transfer/kv_connector/v1/nixl` | src/sections/Sources.tsx:49 | 1 | - |
| OK | 200 | `https://karpenter.sh/docs/concepts/disruption/` | src/sections/DecisionGuide.tsx:73 | 1 | - |
| OK | 200 | `https://karpenter.sh/docs/concepts/nodeclasses/` | src/sections/DecisionGuide.tsx:67 | 2 | - |
| OK | 200 | `https://man7.org/linux/man-pages/man3/ibv_modify_qp.3.html` | src/sections/SrdProtocol.tsx:100 | 1 | - |
| OK | 200 | `https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-1/index.csv` | src/data/pricing.ts:17 | 1 | - |
| OK | 200 | `https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-2/index.csv` | src/data/pricing.ts:24 | 1 | - |
| OK | 200 | `https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/index.json` | src/data/pricing.ts:31 | 1 | - |
| OK | 200 | `https://repost.aws/knowledge-center/s3-upload-large-files` | src/sections/StorageDataPaths.tsx:121 | 1 | - |
| OK | 200 | `https://www.amazonaws.cn/en/new/2024/elastic-fabric-adapter-supports-cross-subnet-communication/` | src/sections/Sources.tsx:37 | 1 | - |
| OK | 200 | `https://www.ernestchiang.com/en/notes/general/aws-srd-scalable-reliable-datagram/` | src/sections/Sources.tsx:44 | 1 | - |
| OK | 200 | `https://www.nvidia.com/en-us/data-center/nvlink/` | src/sections/AIMLTraining.tsx:103 | 2 | - |
| OK | 200 | `https://www.nvidia.com/en-us/networking/products/infiniband/` | src/sections/NetworkComparison.tsx:81 | 1 | - |
| REDIRECT | 202 | `https://doi.org/10.1109/MM.2020.3016891` | src/sections/SrdProtocol.tsx:119 | 1 | `https://ieeexplore.ieee.org/document/9167399/` |

## Pinned code references

| Status | Repo | Ref | Path | Cited lines | Highest line | File lines | Cited at | Citations |
|---|---|---|---|---|---|---|---|---|
| DIR | `amzn/amzn-drivers` | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | `kernel/linux/efa/src` | - | 0 | 0 | src/sections/Operations.tsx:93 | - |
| DIR | `aws-samples/sample-llm-inference-on-eks` | `48b7d85170a9ca5789c6e48488fcba0bb1726949` | `k8s-manifest/lws` | - | 0 | 0 | research/2026-08-refresh/03-efa-eks.md:511 | - |
| DIR | `aws/aws-ofi-nccl` | `v1.20.0` | `src` | - | 0 | 0 | research/2026-08-refresh/01-efa-core.md:450 | - |
| DIR | `aws/aws-ofi-nccl` | `v1.20.0` | `topology` | - | 0 | 0 | research/2026-08-refresh/01-efa-core.md:434 | - |
| DIR | `aws/eks-charts` | `97cf2c16913b8c8125defc9cea1e7824f1b8c950` | `stable/aws-dranet` | - | 0 | 0 | research/2026-08-refresh/03-efa-eks.md:1044 | - |
| DIR | `aws/eks-charts` | `97cf2c16913b8c8125defc9cea1e7824f1b8c950` | `stable/aws-efa-k8s-device-plugin` | - | 0 | 0 | research/2026-08-refresh/03-efa-eks.md:1043 | - |
| DIR | `aws/karpenter-provider-aws` | `v1.14.0` | `pkg` | - | 43 | 0 | src/sections/TopologyApi.tsx:195 | - |
| DIR | `awslabs/ai-on-sagemaker-hyperpod` | `8e4bebe27419ec46c0c6b4194a6278d30997c6df` | `website/docs/00-eks-orchestration` | - | 0 | 0 | research/2026-08-refresh/03-efa-eks.md:880 | - |
| DIR | `awslabs/amazon-eks-ami` | `c029c3d71745a3b3ab202ada94626e7e44c38152` | `templates` | - | 0 | 0 | research/2026-08-refresh/03-efa-eks.md:70 | - |
| DIR | `awslabs/awsome-distributed-ai` | `cb99a28a85c8333ddbad004221230dac967ddbab` | `micro-benchmarks/nccl-tests` | - | 0 | 0 | research/2026-08-refresh/03-efa-eks.md:840 | - |
| DIR | `awslabs/awsome-distributed-ai` | `cb99a28a85c8333ddbad004221230dac967ddbab` | `micro-benchmarks/nccl-tests/kubernetes` | - | 0 | 0 | research/2026-08-refresh/03-efa-eks.md:511 | - |
| DIR | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/rdm` | - | 0 | 0 | research/2026-08-refresh/01-efa-core.md:226 | - |
| OK | `amzn/amzn-drivers` | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | `kernel/linux/efa/CMakeLists.txt` | L36 | 36 | 38 | src/sections/DataPath.tsx:57 | - |
| OK | `amzn/amzn-drivers` | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | `kernel/linux/efa/conf/configure-dkms.sh` | - | 0 | 15 | src/sections/DataPath.tsx:58 | - |
| OK | `amzn/amzn-drivers` | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | `kernel/linux/efa/conf/dkms.conf` | - | 0 | 12 | src/sections/EfaDevice.tsx:85 | - |
| OK | `amzn/amzn-drivers` | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | `kernel/linux/efa/RELEASENOTES.md` | - | 0 | 244 | research/2026-08-refresh/01-efa-core.md:100 | - |
| OK | `amzn/amzn-drivers` | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | `kernel/linux/efa/src/efa_admin_cmds_defs.h` | L1296-L1299 | 1299 | 1346 | src/sections/DataPath.tsx:61 | - |
| OK | `amzn/amzn-drivers` | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | `kernel/linux/efa/src/efa_com_cmd.h` | L183-L188 | 188 | 430 | src/sections/EfaDevice.tsx:84 | - |
| OK | `amzn/amzn-drivers` | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | `kernel/linux/efa/src/efa_data_verbs.c` | - | 756 | 798 | research/2026-08-refresh/01-efa-core.md:124 | - |
| OK | `amzn/amzn-drivers` | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | `kernel/linux/efa/src/efa_io_defs.h` | - | 93 | 455 | research/2026-08-refresh/01-efa-core.md:145 | - |
| OK | `amzn/amzn-drivers` | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | `kernel/linux/efa/src/efa_main.c` | - | 785 | 1031 | research/2026-08-refresh/01-efa-core.md:124 | - |
| OK | `amzn/amzn-drivers` | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | `kernel/linux/efa/src/efa_neuronmem.c` | L157-L166 | 166 | 181 | src/sections/Operations.tsx:106 | - |
| OK | `amzn/amzn-drivers` | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | `kernel/linux/efa/src/efa_nvmem_impl.h` | L294-L306 | 306 | 336 | src/sections/Operations.tsx:105 | - |
| OK | `amzn/amzn-drivers` | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | `kernel/linux/efa/src/efa_sysfs.c` | L34-L51 | 51 | 59 | src/sections/Operations.tsx:104 | - |
| OK | `amzn/amzn-drivers` | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | `kernel/linux/efa/src/efa_verbs.c` | L1333 | 3715 | 4022 | src/sections/DataPath.tsx:68 | - |
| OK | `amzn/amzn-drivers` | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | `kernel/linux/efa/src/efa.h` | - | 99 | 502 | research/2026-08-refresh/01-efa-core.md:149 | - |
| OK | `amzn/amzn-drivers` | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | `kernel/linux/efa/SRD.txt` | - | 0 | 128 | research/2026-08-refresh/01-efa-core.md:34 | - |
| OK | `amzn/amzn-drivers` | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | `kernel/linux/ena/ena_ethtool.c` | L113-L119 | 119 | 2116 | src/sections/Operations.tsx:109 | - |
| OK | `amzn/amzn-ec2-ena-utilities` | `6ecb14cf1dc3f17a375ea72c1aa3dfd72dc5a1e7` | `ena-express/check-ena-express-settings.sh` | L26-L27 | 27 | 384 | src/sections/EnaVsEfa.tsx:64 | - |
| OK | `aws-samples/aws-do-eks` | `1542b55051b3ffc17fe91a796cf5700ed4d82c24` | `Container-Root/eks/deployment/inference/agentic-ai/nemotron/ultra/agg/lws.yaml-template` | L30-L31 | 31 | 295 | src/sections/EKSIntegration.tsx:170 | - |
| OK | `aws-samples/ec2-topology-aware-for-slurm` | `57abd4d9347e8a31b533918639a69b7637dd6328` | `ec2-topology.py` | L196-L202 | 202 | 211 | src/sections/TopologyApi.tsx:174 | - |
| OK | `aws-samples/sample-llm-inference-on-eks` | `48b7d85170a9ca5789c6e48488fcba0bb1726949` | `k8s-manifest/lws/lws-deepseek-v3.2-tp16-p5.yaml` | - | 0 | 162 | research/2026-08-refresh/03-efa-eks.md:528 | - |
| OK | `aws-samples/sample-rlinf-on-eks` | `c8b5e3a39d89de783b5eb97eaa57dc30a6307f33` | `infrastructure/manifests/topology-labeler.yaml` | L80-L92 | 92 | 140 | src/sections/TopologyApi.tsx:188 | - |
| OK | `aws/amazon-vpc-cni-k8s` | `18404b458ea2b4a980e80570d5939d72db917a4a` | `docs/eni-and-ip-target.md` | - | 0 | 54 | research/2026-08-refresh/03-efa-eks.md:785 | - |
| OK | `aws/aws-eks-best-practices` | `828f285d5888010993bd8948bc2b8305181e513d` | `latest/bpg/aiml/aiml_networking.adoc` | - | 43 | 54 | research/2026-08-refresh/03-efa-eks.md:1058 | - |
| OK | `aws/aws-ofi-nccl` | `117aa133f7efed66b0b0438b8181176b1ca63191` | `contrib/scripts/topology_aware/hostfile-topologify.py` | - | 0 | 158 | research/2026-08-refresh/02-ec2-topology-api.md:936 | - |
| OK | `aws/aws-ofi-nccl` | `117aa133f7efed66b0b0438b8181176b1ca63191` | `contrib/scripts/topology_aware/README.md` | - | 0 | 80 | research/2026-08-refresh/02-ec2-topology-api.md:935 | - |
| OK | `aws/aws-ofi-nccl` | `117aa133f7efed66b0b0438b8181176b1ca63191` | `doc/topology-aware.md` | - | 0 | 150 | research/2026-08-refresh/02-ec2-topology-api.md:934 | - |
| OK | `aws/aws-ofi-nccl` | `3c2e20cfb73dc22e29eb2996d260f9b91108b8e8` | `src/tuner/nccl_ofi_tuner.cpp` | - | 0 | 330 | src/sections/NcclOverEfa.tsx:127 | - |
| OK | `aws/aws-ofi-nccl` | `d204003337ff4e66d28bc7463d9570b18bd1ad49` | `src/tuner/nccl_ofi_tuner.cpp` | - | 0 | 260 | src/sections/NcclOverEfa.tsx:122 | - |
| OK | `aws/aws-ofi-nccl` | `faf2e8f2ef9bcbac3ff1fb2f626e96e7a98bc60d` | `src/tuner/nccl_ofi_tuner.cpp` | - | 0 | 315 | src/sections/NcclOverEfa.tsx:126 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `contrib/scripts/topology_aware/hostfile-topologify.py` | L110-L125 | 125 | 158 | src/sections/TopologyApi.tsx:160 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `doc/efa-env-var.md` | - | 69 | 153 | research/2026-08-refresh/01-efa-core.md:296 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `doc/topology-aware.md` | - | 149 | 150 | research/2026-08-refresh/01-efa-core.md:454 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `include/nccl_ofi_environ.h` | L101-L110 | 110 | 205 | src/sections/NcclOverEfa.tsx:107 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `include/nccl_ofi_param.h` | L266-L305 | 390 | 409 | src/sections/NcclOverEfa.tsx:110 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `include/nccl_ofi_platform.h` | L75-L97 | 97 | 187 | src/sections/NcclOverEfa.tsx:103 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `include/rdma/gin/nccl_ofi_gin_gdaki.h` | L15 | 15 | 17 | src/sections/NcclOverEfa.tsx:149 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `include/tuner/nccl_ofi_tuner_process_config.h` | - | 111 | 129 | research/2026-08-refresh/01-efa-core.md:904 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `README.md` | - | 0 | 83 | research/2026-08-refresh/01-efa-core.md:289 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `RELEASENOTES.md` | L10-L16 | 16 | 1102 | src/sections/NcclOverEfa.tsx:152 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `src/Makefile.am` | - | 190 | 192 | research/2026-08-refresh/01-efa-core.md:422 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `src/nccl_ofi_cuda.cpp` | - | 290 | 348 | research/2026-08-refresh/01-efa-core.md:446 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `src/nccl_ofi_gdrcopy.cpp` | - | 0 | 290 | research/2026-08-refresh/01-efa-core.md:302 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `src/nccl_ofi_interface_neuron.cpp` | L323-L390 | 390 | 391 | src/sections/NcclOverEfa.tsx:79 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `src/nccl_ofi_interface_nvidia.cpp` | L661-L830 | 858 | 858 | src/sections/NcclOverEfa.tsx:78 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `src/nccl_ofi_net.cpp` | L188-L195 | 969 | 969 | src/sections/NcclOverEfa.tsx:83 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `src/nccl_ofi_param.cpp` | L10-L20 | 20 | 42 | src/sections/NcclOverEfa.tsx:109 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `src/nccl_ofi_rdma.cpp` | - | 7407 | 7626 | src/sections/AIMLTraining.tsx:69 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `src/nccl_ofi_system.cpp` | L110-L140 | 140 | 185 | src/sections/NcclOverEfa.tsx:92 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `src/nccl_ofi_topo.cpp` | L1128-L1145 | 1172 | 1827 | src/sections/NcclOverEfa.tsx:100 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `src/platform-aws.cpp` | - | 991 | 1089 | research/2026-08-refresh/01-efa-core.md:908 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `src/rdma/gin/nccl_ofi_gin_api.cpp` | L90-L118 | 118 | 565 | src/sections/Libfabric.tsx:84 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `src/rdma/gin/nccl_ofi_gin_gdaki.cpp` | L112-L174 | 175 | 422 | src/sections/Libfabric.tsx:83 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `src/tuner/nccl_ofi_regions.cpp` | - | 2117 | 2209 | research/2026-08-refresh/01-efa-core.md:386 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `src/tuner/nccl_ofi_tuner.cpp` | - | 258 | 260 | research/2026-08-refresh/01-efa-core.md:404 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `topology/g5.48xl-topo.xml` | - | 0 | 26 | src/sections/AIMLTraining.tsx:72 | - |
| OK | `aws/aws-ofi-nccl` | `v1.20.0` | `topology/p4d-24xl-topo.xml` | - | 26 | 40 | src/sections/AIMLTraining.tsx:71 | - |
| OK | `aws/deep-learning-containers` | `4c921b9ecade7322bebb79224bea6f1c5c3d0591` | `.github/config/image/pytorch/2.13-sagemaker-cuda.yml` | L20-L29 | 29 | 40 | src/sections/SageMaker.tsx:217 | - |
| OK | `aws/deep-learning-containers` | `4c921b9ecade7322bebb79224bea6f1c5c3d0591` | `docker/base/cu132/Dockerfile` | L106-L108 | 108 | 185 | src/sections/SageMaker.tsx:216 | - |
| OK | `aws/deep-learning-containers` | `4c921b9ecade7322bebb79224bea6f1c5c3d0591` | `docker/pytorch/Dockerfile.cuda` | L161-L164 | 289 | 300 | src/sections/SageMaker.tsx:224 | - |
| OK | `aws/deep-learning-containers` | `4c921b9ecade7322bebb79224bea6f1c5c3d0591` | `scripts/docker/common/install_efa_amzn2023.sh` | L37-L45 | 60 | 96 | src/sections/SageMaker.tsx:221 | - |
| OK | `aws/deep-learning-containers` | `4c921b9ecade7322bebb79224bea6f1c5c3d0591` | `test/efa/scripts/nccl_allreduce.sh` | L23-L26 | 47 | 114 | src/sections/SageMaker.tsx:226 | - |
| OK | `aws/deep-learning-containers` | `4c921b9ecade7322bebb79224bea6f1c5c3d0591` | `test/efa/test_efa.py` | L1-L10 | 10 | 179 | src/sections/SageMaker.tsx:228 | - |
| OK | `aws/eks-charts` | `97cf2c16913b8c8125defc9cea1e7824f1b8c950` | `stable/aws-efa-k8s-device-plugin/Chart.yaml` | - | 0 | 9 | research/2026-08-refresh/03-efa-eks.md:329 | - |
| OK | `aws/eks-charts` | `97cf2c16913b8c8125defc9cea1e7824f1b8c950` | `stable/aws-efa-k8s-device-plugin/templates/daemonset.yaml` | - | 0 | 91 | research/2026-08-refresh/03-efa-eks.md:344 | - |
| OK | `aws/eks-charts` | `97cf2c16913b8c8125defc9cea1e7824f1b8c950` | `stable/aws-efa-k8s-device-plugin/templates/NOTES.txt` | - | 0 | 1 | research/2026-08-refresh/03-efa-eks.md:284 | - |
| OK | `aws/eks-charts` | `97cf2c16913b8c8125defc9cea1e7824f1b8c950` | `stable/aws-efa-k8s-device-plugin/values.yaml` | - | 0 | 340 | research/2026-08-refresh/03-efa-eks.md:349 | - |
| OK | `aws/eks-charts` | `bfe91c4b9257c80f754ad4b3d6a9a3c239b2b8ec` | `stable/aws-efa-k8s-device-plugin/Chart.yaml` | - | 0 | 9 | src/sections/EKSIntegration.tsx:139 | - |
| OK | `aws/eks-charts` | `bfe91c4b9257c80f754ad4b3d6a9a3c239b2b8ec` | `stable/aws-efa-k8s-device-plugin/templates/daemonset.yaml` | L60-L64 | 64 | 91 | src/sections/EKSIntegration.tsx:140 | - |
| OK | `aws/eks-charts` | `bfe91c4b9257c80f754ad4b3d6a9a3c239b2b8ec` | `stable/aws-efa-k8s-device-plugin/values.yaml` | - | 0 | 340 | src/sections/EKSIntegration.tsx:141 | - |
| OK | `aws/eks-charts` | `c043cef46c7e50a71094e50b43b8225322a750ff` | `stable/aws-dranet/Chart.yaml` | - | 0 | 9 | src/sections/EKSIntegration.tsx:142 | - |
| OK | `aws/eks-charts` | `c043cef46c7e50a71094e50b43b8225322a750ff` | `stable/aws-dranet/templates/daemonset.yaml` | L33-L66 | 66 | 143 | src/sections/EKSIntegration.tsx:144 | - |
| OK | `aws/eks-charts` | `c043cef46c7e50a71094e50b43b8225322a750ff` | `stable/aws-dranet/values.yaml` | L313-L328 | 328 | 328 | src/sections/EKSIntegration.tsx:143 | - |
| OK | `aws/karpenter-provider-aws` | `4b2a2049469190a8a379668794e053207464b740` | `designs/efa-for-static-capacity.md` | - | 0 | 171 | research/2026-08-refresh/03-efa-eks.md:1045 | - |
| OK | `aws/karpenter-provider-aws` | `v1.14.0` | `pkg/apis/v1/ec2nodeclass.go` | L56-L60 | 60 | 738 | src/sections/DecisionGuide.tsx:123 | - |
| OK | `aws/sagemaker-hyperpod-checkpointless-training` | `08c4ff60ef06cfe2a659f4ea38c342c81fd86410` | `examples/llama3/launch/pretrain_llama3_70b_p5.yaml` | L34-L59 | 59 | 135 | src/sections/EKSIntegration.tsx:158 | - |
| OK | `aws/sagemaker-hyperpod-recipes` | `20ea8f4551cd540b5b023b25d41ab414b16fe493` | `launcher/nemo/k8s_templates/training/training.yaml` | L78-L81 | 81 | 265 | src/sections/EKSIntegration.tsx:164 | - |
| OK | `aws/sagemaker-python-sdk` | `9ff3e5fa61b4b57f947957f26cc42964fe437dee` | `sagemaker-train/src/sagemaker/train/container_drivers/common/utils.py` | L45-L60 | 60 | 205 | src/sections/SageMaker.tsx:212 | - |
| OK | `aws/sagemaker-python-sdk` | `9ff3e5fa61b4b57f947957f26cc42964fe437dee` | `sagemaker-train/src/sagemaker/train/container_drivers/distributed_drivers/mpi_utils.py` | L283-L290 | 290 | 302 | src/sections/SageMaker.tsx:214 | - |
| OK | `aws/sagemaker-python-sdk` | `9ff3e5fa61b4b57f947957f26cc42964fe437dee` | `sagemaker-train/src/sagemaker/train/container_drivers/distributed_drivers/torchrun_driver.py` | L51-L63 | 63 | 129 | src/sections/SageMaker.tsx:213 | - |
| OK | `aws/sagemaker-python-sdk` | `v2.257.0` | `src/sagemaker/fw_utils.py` | L85-L91 | 91 | 1219 | src/sections/SageMaker.tsx:215 | - |
| OK | `awslabs/ai-on-eks` | `5e6282cb121f423e734caccb550a9f61c2935584` | `infra/base/terraform/eks.tf` | - | 0 | 528 | research/2026-08-refresh/03-efa-eks.md:1049 | - |
| OK | `awslabs/ai-on-sagemaker-hyperpod` | `8e4bebe27419ec46c0c6b4194a6278d30997c6df` | `website/docs/00-eks-orchestration/validation-and-testing/environment-validation/efa-validation.md` | - | 0 | 182 | research/2026-08-refresh/03-efa-eks.md:850 | - |
| OK | `awslabs/amazon-eks-ami` | `ac5f340c56a9a6943808c9201da87adec9edb1da` | `templates/al2023/provisioners/install-efa.sh` | L53 | 65 | 65 | src/sections/EKSIntegration.tsx:123 | - |
| OK | `awslabs/amazon-eks-ami` | `ac5f340c56a9a6943808c9201da87adec9edb1da` | `templates/al2023/variables-default.json` | L17 | 17 | 43 | src/sections/EKSIntegration.tsx:131 | - |
| OK | `awslabs/amazon-eks-ami` | `c029c3d71745a3b3ab202ada94626e7e44c38152` | `doc/usage/al2023.md` | - | 0 | 97 | research/2026-08-refresh/03-efa-eks.md:1041 | - |
| OK | `awslabs/amazon-eks-ami` | `c029c3d71745a3b3ab202ada94626e7e44c38152` | `Makefile` | - | 0 | 119 | research/2026-08-refresh/03-efa-eks.md:1040 | - |
| OK | `awslabs/amazon-eks-ami` | `c029c3d71745a3b3ab202ada94626e7e44c38152` | `templates/al2023/provisioners/install-efa.sh` | - | 0 | 65 | research/2026-08-refresh/03-efa-eks.md:1037 | - |
| OK | `awslabs/amazon-eks-ami` | `c029c3d71745a3b3ab202ada94626e7e44c38152` | `templates/al2023/template.json` | - | 0 | 349 | research/2026-08-refresh/03-efa-eks.md:1039 | - |
| OK | `awslabs/amazon-eks-ami` | `c029c3d71745a3b3ab202ada94626e7e44c38152` | `templates/al2023/variables-default.json` | - | 0 | 43 | research/2026-08-refresh/03-efa-eks.md:1038 | - |
| OK | `awslabs/aws-c-http` | `e543240bbd28ce39423bbc470785f2f38ff28ecb` | `source/connection_manager.c` | L1102-L1119 | 1119 | 1736 | src/sections/StorageDataPaths.tsx:146 | - |
| OK | `awslabs/aws-c-io` | `fbac3c30fd8c50c05168f41486403a69d91f7600` | `source/posix/socket.c` | L1376-L1392 | 1392 | 2172 | src/sections/StorageDataPaths.tsx:147 | - |
| OK | `awslabs/aws-c-io` | `fbac3c30fd8c50c05168f41486403a69d91f7600` | `source/standard_retry_strategy.c` | L314-L330 | 330 | 497 | src/sections/StorageDataPaths.tsx:148 | - |
| OK | `awslabs/aws-c-s3` | `469cbd020db52c329631a614e3b8401f3fda7717` | `include/aws/s3/private/s3_client_impl.h` | L276 | 276 | 569 | src/sections/StorageDataPaths.tsx:144 | - |
| OK | `awslabs/aws-c-s3` | `469cbd020db52c329631a614e3b8401f3fda7717` | `include/aws/s3/s3_client.h` | L676-L688 | 688 | 1936 | src/sections/StorageDataPaths.tsx:140 | - |
| OK | `awslabs/aws-c-s3` | `469cbd020db52c329631a614e3b8401f3fda7717` | `source/s3_client.c` | L163-L169 | 2691 | 3228 | src/sections/StorageDataPaths.tsx:133 | - |
| OK | `awslabs/aws-c-s3` | `469cbd020db52c329631a614e3b8401f3fda7717` | `source/s3_endpoint.c` | L154-L188 | 188 | 332 | src/sections/StorageDataPaths.tsx:145 | - |
| OK | `awslabs/aws-c-s3` | `469cbd020db52c329631a614e3b8401f3fda7717` | `source/s3_platform_info.c` | L126-L140 | 140 | 520 | src/sections/StorageDataPaths.tsx:143 | - |
| OK | `awslabs/aws-c-s3` | `469cbd020db52c329631a614e3b8401f3fda7717` | `source/s3_util.c` | L65-L68 | 877 | 1030 | src/sections/StorageDataPaths.tsx:138 | - |
| OK | `awslabs/aws-crt-java` | `v0.48.3` | `src/main/java/software/amazon/awssdk/crt/s3/S3ClientOptions.java` | - | 0 | 413 | src/sections/StorageDataPaths.tsx:152 | - |
| OK | `awslabs/aws-crt-python` | `v0.36.1` | `awscrt/s3.py` | L353-L354 | 953 | 953 | src/sections/StorageDataPaths.tsx:151 | - |
| OK | `awslabs/aws-crt-python` | `v0.36.1` | `source/s3_client.c` | L46-L53 | 53 | 432 | src/sections/StorageDataPaths.tsx:150 | - |
| OK | `awslabs/awsome-distributed-ai` | `cb99a28a85c8333ddbad004221230dac967ddbab` | `4.validation_and_observability/3.efa-node-exporter/README.md` | - | 0 | 79 | research/2026-08-refresh/04-efa-sagemaker.md:527 | - |
| OK | `awslabs/awsome-distributed-ai` | `cb99a28a85c8333ddbad004221230dac967ddbab` | `micro-benchmarks/nccl-tests/kubernetes/nccl-tests-gb200.yaml` | - | 0 | 117 | research/2026-08-refresh/03-efa-eks.md:497 | - |
| OK | `awslabs/awsome-distributed-ai` | `cb99a28a85c8333ddbad004221230dac967ddbab` | `micro-benchmarks/nccl-tests/kubernetes/nccl-tests.yaml` | - | 0 | 85 | research/2026-08-refresh/03-efa-eks.md:551 | - |
| OK | `awslabs/awsome-distributed-ai` | `cb99a28a85c8333ddbad004221230dac967ddbab` | `micro-benchmarks/nccl-tests/nccl-tests.Dockerfile` | - | 0 | 130 | research/2026-08-refresh/03-efa-eks.md:131 | - |
| OK | `awslabs/awsome-distributed-ai` | `cb99a28a85c8333ddbad004221230dac967ddbab` | `micro-benchmarks/nccl-tests/README.md` | - | 0 | 325 | research/2026-08-refresh/03-efa-eks.md:132 | - |
| OK | `boto/botocore` | `1.43.62` | `botocore/data/batch/2016-08-10/service-2.json` | - | 0 | 6473 | src/sections/EKSIntegration.tsx:157 | - |
| OK | `boto/s3transfer` | `0.15.0` | `s3transfer/crt.py` | L169-L184 | 184 | 992 | src/sections/StorageDataPaths.tsx:153 | - |
| OK | `bottlerocket-os/bottlerocket-core-kit` | `v15.0.0` | `packages/rdma-core/rdma-core.spec` | L109-L125 | 125 | 196 | src/sections/EKSIntegration.tsx:138 | - |
| OK | `bottlerocket-os/bottlerocket-kernel-kit` | `v7.2.1` | `packages/kmod-6.18-efa/kmod-6.18-efa.spec` | L1-L29 | 29 | 76 | src/sections/EKSIntegration.tsx:132 | - |
| OK | `eksctl-io/eksctl` | `a5cb648e5bd6245a80e6b62b8817ce6fa1e6d7cd` | `userdocs/src/usage/nodegroup-managed.md` | - | 0 | 310 | research/2026-08-refresh/03-efa-eks.md:1047 | - |
| OK | `kubernetes-sigs/dranet` | `v1.2.0` | `pkg/inventory/db.go` | L290 | 290 | 593 | src/sections/EKSIntegration.tsx:151 | - |
| OK | `kubernetes-sigs/dranet` | `v1.4.0` | `site/content/docs/user/aws-eks-efa.md` | L109-L118 | 118 | 118 | src/sections/EKSIntegration.tsx:152 | - |
| OK | `kubernetes/kubernetes` | `v1.34.0` | `staging/src/k8s.io/dynamic-resource-allocation/deviceattribute/attribute.go` | L23-L33 | 33 | 41 | src/sections/EKSIntegration.tsx:145 | - |
| OK | `NVIDIA/k8s-device-plugin` | `v0.18.2` | `cmd/nvidia-device-plugin/main.go` | L114-L118 | 118 | 407 | src/sections/EKSIntegration.tsx:154 | - |
| OK | `NVIDIA/k8s-device-plugin` | `v0.19.0` | `cmd/nvidia-device-plugin/main.go` | L116-L121 | 121 | 410 | src/sections/EKSIntegration.tsx:153 | - |
| OK | `NVIDIA/k8s-device-plugin` | `v0.19.0` | `internal/cdi/cdi.go` | L154-L156 | 156 | 270 | src/sections/EKSIntegration.tsx:155 | - |
| OK | `NVIDIA/nccl` | `v2.21.5-1` | `src/include/nccl_tuner.h` | L58 | 58 | 60 | src/sections/NcclOverEfa.tsx:134 | - |
| OK | `NVIDIA/nccl` | `v2.22.3-1` | `src/include/nccl_tuner.h` | L60 | 60 | 104 | src/sections/NcclOverEfa.tsx:135 | - |
| OK | `NVIDIA/nccl` | `v2.28.9-1` | `src/init.cc` | L428 | 428 | 2778 | src/sections/Operations.tsx:123 | - |
| OK | `NVIDIA/nccl` | `v2.28.9-1` | `src/plugin/net.cc` | L225 | 337 | 526 | src/sections/Operations.tsx:125 | - |
| OK | `NVIDIA/nccl` | `v2.28.9-1` | `src/transport/net_socket.cc` | L720-L721 | 721 | 743 | src/sections/Operations.tsx:126 | - |
| OK | `NVIDIA/nccl` | `v2.30.4-1` | `src/enqueue.cc` | L1893-L1899 | 2066 | 3134 | src/sections/NcclOverEfa.tsx:136 | - |
| OK | `NVIDIA/nccl` | `v2.30.4-1` | `src/graph/search.cc` | L181-L202 | 280 | 1407 | src/sections/AIMLTraining.tsx:68 | - |
| OK | `NVIDIA/nccl` | `v2.30.4-1` | `src/graph/tuning.cc` | L416-L435 | 599 | 611 | src/sections/NcclOverEfa.tsx:140 | - |
| OK | `NVIDIA/nccl` | `v2.30.4-1` | `src/include/plugin/nccl_tuner.h` | L25 | 43 | 61 | src/sections/NcclOverEfa.tsx:133 | - |
| OK | `NVIDIA/nccl` | `v2.30.4-1` | `src/init.cc` | L781-L786 | 786 | 3317 | src/sections/NcclOverEfa.tsx:145 | - |
| OK | `NVIDIA/nvidia-container-toolkit` | `v1.19.1` | `internal/discover/mofed.go` | L25-L36 | 36 | 36 | src/sections/EKSIntegration.tsx:156 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `man/fi_efa.7.md` | - | 681 | 721 | research/2026-08-refresh/01-efa-core.md:180 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `man/fi_mr.3.md` | L1054-L1080 | 1080 | 1115 | src/sections/Operations.tsx:117 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `man/fi_pingpong.1.md` | - | 0 | 181 | src/sections/Operations.tsx:116 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/configure.m4` | L317-L322 | 322 | 434 | src/sections/DataPath.tsx:85 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/docs/efa_fabric_comparison.md` | - | 271 | 284 | research/2026-08-refresh/01-efa-core.md:188 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/efa_data_path_direct_entry.h` | L435-L445 | 445 | 670 | src/sections/DataPath.tsx:89 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/efa_data_path_direct.c` | L130-L132 | 200 | 213 | src/sections/DataPath.tsx:84 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/efa_data_path_direct.h` | - | 0 | 79 | research/2026-08-refresh/01-efa-core.md:197 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/efa_data_path_ops.h` | L216-L219 | 219 | 539 | src/sections/DataPath.tsx:88 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/efa_device.c` | L520-L526 | 526 | 760 | src/sections/EfaDevice.tsx:90 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/efa_domain.c` | L114-L127 | 897 | 1019 | src/sections/Libfabric.tsx:73 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/efa_env.c` | L11-L46 | 262 | 272 | src/sections/Libfabric.tsx:71 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/efa_fork_support.c` | L12-L62 | 192 | 325 | src/sections/Libfabric.tsx:77 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/efa_hmem.c` | - | 116 | 627 | research/2026-08-refresh/01-efa-core.md:248 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/efa_prov_info.c` | L346-L356 | 640 | 795 | src/sections/Operations.tsx:112 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/efa_prov.c` | L106-L133 | 176 | 272 | src/sections/Operations.tsx:111 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/efa_user_info.c` | L626-L668 | 668 | 801 | src/sections/Libfabric.tsx:66 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/efa.h` | L62-L63 | 63 | 323 | src/sections/Libfabric.tsx:67 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/fi_ext_efa.h` | L11 | 11 | 141 | src/sections/AIMLTraining.tsx:76 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/rdm/efa_rdm_mr.c` | L111-L126 | 169 | 828 | src/sections/Operations.tsx:114 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/rdm/efa_rdm_msg.c` | - | 102 | 1121 | research/2026-08-refresh/01-efa-core.md:899 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/efa/src/rdm/efa_rdm_peer.h` | L12 | 12 | 259 | src/sections/Libfabric.tsx:79 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/util/src/util_mem_monitor.c` | L244-L270 | 270 | 562 | src/sections/Libfabric.tsx:75 | - |
| OK | `ofiwg/libfabric` | `v2.6.0` | `prov/util/src/util_mr_cache.c` | L48-L54 | 54 | 640 | src/sections/Libfabric.tsx:76 | - |
| OK | `torvalds/linux` | `2d2338c93da79b3bfe4b6099a931d9468d539952` | `drivers/infiniband/hw/efa/efa_main.c` | L365-L403 | 403 | 706 | src/sections/DataPath.tsx:62 | - |

## Method

- Documentation URLs are fetched with curl following redirects, with a browser User-Agent and a 1.0 second gap between requests (1.5 seconds for GitHub hosts).
- A redirect counts as rot when the final path no longer contains the last path segment of the requested URL, or lands on the site root. That is how a retired page is served without a 404.
- Pinned code references are fetched from `raw.githubusercontent.com` at the exact ref, never at the default branch. A 404 is then classified with one call to the REST commits API, which separates a bad ref from a file that is not in the tree at a good ref.
- Line ranges are checked by counting the lines of the fetched file and comparing against the highest line number in the citation. This proves the line exists. It does not prove the line still says what the prose claims, which stays agent work (lens L1 in the P5 design).
- BLOCKED and TIMEOUT are not failures. They mean the server refused or did not answer, which is not evidence about the content.

## Limitations

- The extractor resolves module-level string constants and `CodeRef` factory functions. A citation assembled at runtime from a value this check cannot see is skipped rather than guessed at.
- URLs inside code samples are checked alongside declared citations. A dead URL in a sample is still a dead URL, but it is not a provenance defect.
- This check confirms that a citation resolves. It does not confirm that the cited text supports the claim.
