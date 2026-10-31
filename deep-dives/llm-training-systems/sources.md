# LLM training systems deep dive: sources

Status: scoped, not built. This list is generated from the tiered source lists (section 8) of the seven wave 1 claim registers in `research/2026-10/` and the orchestrator note `00-orchestrator-notes.md`. Every source was accessed 2026-10-30. When the app is built, regenerate this file from the inline citations in `src/`, as the RL dive does.

Each line is copied from its register and keeps the register's entry IDs (T01-3 is entry 3 of register 01), so every source traces to the claims it supports. Code is pinned to a release tag and 40-character SHA, arXiv papers to a version. A vendor peak FLOPS figure is a vendor specification and a vendor performance figure is a claim; the registers label both. Tiers follow `RESEARCH-GUIDE.md` section 1. A source used by several registers appears once per register, with that register's files and entries.

## Tier 0: our own experiments

None yet. Experiments E1 to E5 (DGX Spark) and A0 to A5 (AWS) are proposed in `RESEARCH-GUIDE.md` section 5 and have not been run.

## Tier 1: source code and in-repository documentation at a pinned tag or SHA

**From register 01, the training step and its maths**

- meta-llama/llama-models v0.2.0 (5fdf83110cc9daa7435dfba6eb304892cc0041b8): `models/llama3_1/MODEL_CARD.md`, `models/llama3/model.py`, `models/llama3/tokenizer.py`, `models/llama3/args.py` (T01-2, T01-3, T01-4, T01-7, T01-35)
- NVIDIA/TransformerEngine v2.21.0 (7457e47d26d9d02dfb783007335dfbe75e1b90a8): `transformer_engine/common/recipe/__init__.py`, `transformer_engine/pytorch/quantization.py` (T01-44, T01-45)
- pytorch/pytorch v2.15.0 (31a77fc9c0a7c6fff15a1ff58c743f53b1a9d457): `docs/source/notes/cuda.md` (T01-63)

**From register 02, parallelism**

- NVIDIA/Megatron-LM core_v0.20.0 (685fb8bd970185e9ac3283fe32a5d6667bf4b268): `megatron/training/arguments.py`, `megatron/core/parallel_state.py`, `megatron/core/transformer/transformer_config.py`, `megatron/core/num_microbatches_calculator.py` (T02-15, T02-25, T02-26, T02-41, T02-51, T02-72).
- NVIDIA/NeMo v2.7.3 (1d4ee423806d461f9146ae982f9da8eb32495ae7): `nemo/collections/llm/tools/auto_configurator/core/training_config.py` (T02-54, T02-55); NeMo v3.0.0 (fd6a877539710e2b98f28c43272ff81312f83417) tree listing only (T02-55).
- pytorch/torchtitan v0.4.0 (45e33cd413b64cb37a7840cfd3c9765d3c639ae1): `torchtitan_recipes/models/llama3.py` (T02-59).
- NVIDIA/nccl-tests v2.21.1 (afd59abab774a6a4b492eb344bd0c845a0b7bb4d): `doc/PERFORMANCE.md` (T02-60, T02-61).
- deepspeedai/DeepSpeed v0.19.9 (8d4f29c75f4a4b30d4db00a94b4aebfdff5107f3): `deepspeed/autotuning/README.md` (T02-56).

**From register 03, frameworks**

- pytorch/pytorch v2.15.0 = 31a77fc9c0a7c6fff15a1ff58c743f53b1a9d457: `torch/distributed/fsdp/_fully_shard/_fully_shard.py`, `_fsdp_param_group.py`, `_fsdp_api.py`; `torch/distributed/pipelining/schedules.py`; `torch/distributed/tensor/experimental/_context_parallel/_attention.py`; `torch/distributed/checkpoint/state_dict_saver.py`; `docs/source/distributed.tensor.md`, `distributed.pipelining.md`, `distributed.tensor.parallel.md`, `distributed.checkpoint.md`, `distributed.fsdp.fully_shard.md` (T03-1 to T03-9)
- pytorch/torchtitan v0.4.0 = 45e33cd413b64cb37a7840cfd3c9765d3c639ae1: `README.md`, `RELEASE.md`, `torchtitan/config/parallelism.py`, `torchtitan/config/README.md`, `torchtitan/training_engine.py`, `torchtitan/distributed/fsdp.py`, `torchtitan/quantization/README.md`, `torchtitan/quantization/mxfp8/README.md`, `torchtitan/components/checkpointer/base.py`, `dcp.py`, `README.md`, `torchtitan_recipes/README.md`, `run_train.sh`, `torchtitan/models/llama3/README.md`; v0.3.0 `torchtitan/components/quantization/float8.py` (existence only) (T03-3, T03-10 to T03-15, T03-51)
- aws-neuron/torchtitan-neuron release-2.33.0 = b7582e986586051d7be85d03956afe169624aeda: `assets/version.txt`, `torchtitan_neuron/models/llama3/config_registry.py`, `torchtitan_neuron/docs/neuron_mxfp8.md`, `torchtitan_neuron/docs/qwen3_235b_full_ep128.md` (T03-37, T03-38, T03-53)
- NVIDIA/Megatron-LM core_v0.20.0 = 685fb8bd970185e9ac3283fe32a5d6667bf4b268: `README.md`, `docs/user-guide/features/dist_optimizer.md`, `low_precision_training.md`, `megatron_fsdp.md`, `docs/api-guide/core/dist_checkpointing.md`, `megatron/training/arguments.py`, `megatron/training/config/training_config.py`, `megatron/training/checkpointing.py`, `megatron/core/transformer/transformer_config.py`, `megatron/core/optimizer/distrib_optimizer.py`, `megatron/core/pipeline_parallel/schedules.py`, `combined_1f1b.py`, `megatron/core/optimizer/__init__.py`, `megatron/core/distributed/distributed_data_parallel_config.py` (W2) (T03-16 to T03-22)
- NVIDIA-NeMo/Megatron-Bridge v0.7.0 = 04ce2b3efd6f2e387fc244e9f37afd0a1f7952fb: `README.md`, `docs/nemo2-migration-guide.md`, `src/megatron/bridge/recipes/llama/h100/llama3.py` (T03-23, T03-24, T03-26, T03-27)
- NVIDIA/NeMo v3.0.0 = fd6a877539710e2b98f28c43272ff81312f83417: `README.md`, `nemo/collections/` (T03-25, T03-27)
- NVIDIA-NeMo/Automodel v0.7.0 = 48c88e16798246e8c7f1b9ea3974bfc488bd0849: `README.md` (T03-27, T03-28)
- NVIDIA-NeMo/RL v0.7.0 = 81aa43dda4765b0429cf31dab44441e4e4383911: `README.md` (T03-27, T03-49)
- deepspeedai/DeepSpeed v0.19.9 = 8d4f29c75f4a4b30d4db00a94b4aebfdff5107f3: `deepspeed/runtime/zero/config.py`, `deepspeed/runtime/pipe/engine.py`, `schedule.py`, `docs/_tutorials/zero.md`, `pipeline.md`, `ds-sequence.md`, `ulysses-alst-sequence-parallelism.md`, `autotp-training.md`, `universal-checkpointing.md`, `getting-started.md` (T03-29 to T03-33)
- aws-neuron/aws-neuron-sdk v2.33.0 = 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a (first-party AWS documentation source): `archive/nxd-training/index.rst`, `release-notes/2.33.0.rst`, `release-notes/components/nxd-training.rst`, `torchneuron.rst`, `torchtitan-neuron.rst`, `about-neuron/announcements/neuron2.x/` (four NxDT announcements), `torch/about-pytorch-neuron.rst`, `training/torchtitan/about-torchtitan-neuron.rst`, `training/torchtitan/tutorials/tutorial-basic-training.rst` (T03-34 to T03-38, T03-51)
- huggingface/accelerate v1.15.0 = 6afc1e5ee217051fde702b23de2813344dc0fd33: `src/accelerate/parallelism_config.py`, `accelerator.py`, `utils/dataclasses.py`, `docs/source/concept_guides/sequence_parallelism.md`, `docs/source/usage_guides/low_precision_training.md`, `megatron_lm.md` (T03-39 to T03-41)
- huggingface/transformers v5.22.1 = 446a570e62b04a89ea001604ada7366baac2ea67: `src/transformers/training_args.py` (T03-40, T03-42)
- axolotl-ai-cloud/axolotl v0.21.1 = 240c1b22e0556b54f90f282fae7621ba91f15b9b: `README.md` (T03-46)
- hiyouga/LLaMA-Factory v0.9.5 = 7af909522a951e3ad9f022ea6f88b6755257eaa5: `README.md` (T03-45, T03-47)
- meta-pytorch/torchtune default-branch HEAD bd2a0fc7c31430972728494fa01aaeeb0ebf1ba1: `README.md`; tag v0.6.1 = a6290a5b40758f13bca61c386bc8756a49ef417e (T03-48)

**From register 04, reliability, checkpointing and data**

- pytorch/pytorch v2.15.0 (31a77fc9c0a7c6fff15a1ff58c743f53b1a9d457): `torch/distributed/checkpoint/state_dict_saver.py`, `torch/distributed/checkpoint/staging.py`, `torch/distributed/run.py`, `docs/source/distributed.checkpoint.md`, `docs/source/notes/randomness.md`; plus `state_dict_saver.py` at v2.4.0 (d990dada86a8ad94882b5c23e859b88c0c255bda) and v2.7.1 (e2d141dbde55c2a4370fac5165b0561b6af4798b).
- pytorch/torchtitan v0.4.0 (45e33cd413b64cb37a7840cfd3c9765d3c639ae1): `torchtitan/components/checkpointer/{README.md, base.py, dcp.py}`, `torchtitan/trainer.py`, `torchtitan/training_engine.py`, `torchtitan/distributed/utils.py`.
- NVIDIA/Megatron-LM core_v0.20.0 (685fb8bd970185e9ac3283fe32a5d6667bf4b268): `megatron/training/config/training_config.py`, `megatron/training/arguments.py`, `megatron/core/datasets/indexed_dataset.py`, `megatron/core/datasets/gpt_dataset.py`, `megatron/training/datasets/data_samplers.py`, `tools/preprocess_data.py`.
- awslabs/s3-connector-for-pytorch v1.5.0 (c4f482629523d8fd2ec6080f70bda5966f90d89a): `README.md`, `CHANGELOG.md`, `s3torchconnector/src/s3torchconnector/dcp/s3_file_system.py`, `s3torchconnector/src/s3torchconnector/dcp/s3_prefix_strategy.py`.
- meta-pytorch/torchft v0.2.0 (peeled b8a096f9f23589ec93e988e2368a934cab01b890): `README.md`.
- pytorch/data v0.11.0 (377e64c1be69a9be6649d14c9e3664070323e464): `README.md`, `torchdata/stateful_dataloader/README.md`.
- mosaicml/streaming v0.13.0 (peeled adeeeebe8f5d42cb429c05bd4e62df2176ef20ab): `README.md`.

**From register 05, AWS infrastructure**

- awslabs/mountpoint-s3, tag `mountpoint-s3-1.24.0`, commit 12fec077f06acf931309fdab7e7433d5fd2ae189: `doc/SEMANTICS.md` (T05-41)
- aws/deep-learning-containers, commit 156076c639a310c6e86ddae64a6e1fce8a34087c (default-branch HEAD, no release tag used): `.github/config/image/pytorch/2.14-ec2-cuda.yml`, `docs/src/data/pytorch/2.14-cuda-ec2.yml`, `docs/src/data/pytorch/2.14-cuda-sagemaker.yml`, `docs/src/data/pytorch-training/2.10-gpu-ec2.yml`, `docker/pytorch/Dockerfile.cuda`, `docker/pytorch/2.14/cuda/pyproject.toml`, `scripts/docker/common/install_efa_amzn2023.sh` (T05-44)

**From register 06, AWS orchestration**

- aws/sagemaker-hyperpod-recipes `2.0.11` (a6030c319908c8a1b74cb619b00476f8e6baa04f): tree; `hyperpod_recipes/recipes_src/training/llama/checkpointless_llama3_70b_pretrain.yaml` (T06-20, T06-21, T06-52). Tag `v1.5.1` (a9ba8bf184ec8b912936bed828ce7ee8554fab3f) and `v2.0.0` (fa19961ddefd4f026450b284f15410612ecb72d5): trees; v2.0.0 release notes https://github.com/aws/sagemaker-hyperpod-recipes/releases/tag/v2.0.0 (T06-20)
- aws/sagemaker-hyperpod-cli `v3.13.0` (2db84ee3807e9a003f3de220b64a2701c935ea2d): `README.md` (T06-22)
- aws/sagemaker-python-sdk `v3.28.0` (94899a91d3e2e44771cb43c23cdc9923b2459cfe): `README.rst` (T06-28)
- aws/aws-parallelcluster `v3.16.2` (1937c1a3968d6ffa98459b35516a85a2ac166332): release metadata (T06-38)
- awslabs/awsome-distributed-ai (formerly aws-samples/awsome-distributed-training) at 3a1002576ccef26e66ba714303b10ccdaa645691: tree (T06-39)
- kubeflow/trainer `v2.3.0` (658725bdae5c7e3a0854d93ac6ff492e109a22ab): `README.md`; `v1.9.4` (4445c12aa62e4345b0c2c6ac9b215a70eca46ed7): release metadata (T06-46)
- kubernetes-sigs/kueue `v0.20.4` (peeled 14b792888dcb30cf055bf2618b6260a4989cf85f): `README.md` (T06-46, T06-47)
- volcano-sh/volcano `v1.16.0` (peeled 41f27d567fb5bdaf2cab01e1caaf48f7e266eefb) and kubeflow/mpi-operator `v0.8.2` (peeled fd6ab218ce3e49b81b6a411614d09c9deb029ae9): release metadata only (U06-6)

**From register 07, observability**

- pytorch/pytorch v2.15.0 (31a77fc9c0a7c6fff15a1ff58c743f53b1a9d457): `torch/csrc/distributed/c10d/ProcessGroupNCCL.hpp`, `ProcessGroupNCCL.cpp`, `ProcessGroup.hpp`, `FlightRecorder.hpp`, `FlightRecorder.cpp`, `torch/distributed/constants.py`, `torch/distributed/distributed_c10d.py`, `torch/distributed/flight_recorder/fr_trace.py`, `components/types.py`, `components/utils.py`, `components/config_manager.py`, `components/builder.py`, `pyproject.toml`, `torch/cuda/memory.py`, `torch/nn/utils/clip_grad.py`, `docs/source/torch_nccl_environment_variables.md`, `docs/source/torch_cuda_memory.md` (T07-3 to T07-11, T07-30).
- pytorch/pytorch older tags for T07-10: v2.5.0 (32f585d9346e316e554c8d9bf7548af9f62141fc), v2.7.0 (134179474539648ba7dee1317959529fbd0e7f89), v2.8.0 (ba56102387ef21a3b04b357e5b183d48f0afefc7), v2.9.0 (0fabc3ba44823f257e70ce397d989c8de5e362c1), v2.10.0 (449b1768410104d3ed79d3bcfe4ba1d65c7f22c0), v2.11.0 (70d99e998b4955e0049d13a98d77ae1b14db1f45), v2.12.0 (0d62256a2b23365f8e1604297eb23a6545102aa8), v2.13.0 (cf30153c4c131c8164ee7798e5022d810682e2cb), v2.14.0 (2b3ec34829036a65cd9d1398ea72a0167dc37470): `ProcessGroupNCCL.cpp` and/or `FlightRecorder.hpp`.
- pytorch/torchtitan v0.4.0 (45e33cd413b64cb37a7840cfd3c9765d3c639ae1): `torchtitan/observability/metrics.py`, `torchtitan/observability/METRICS.md`, `torchtitan/tools/utils.py`, `torchtitan/components/optim/optim.py`, `torchtitan/distributed/utils.py`, `torchtitan/training_engine.py`, `torchtitan/trainer.py` (T07-1, T07-2, T07-19).
- NVIDIA/Megatron-LM core_v0.20.0 (685fb8bd970185e9ac3283fe32a5d6667bf4b268): `megatron/training/arguments.py`, `megatron/training/config/resilience_config.py`, `megatron/core/rerun_state_machine.py`, `megatron/training/training.py` (T07-20).
- NVIDIA/DCGM v4.7.0 (9fae2867e6e5264fa0fca22a07dc898d591baa21): `dcgmlib/dcgm_fields.h` (T07-21, T07-22, T07-26).
- NVIDIA/dcgm-exporter 4.8.4 (fafd151148052628061a80450b4ee037a5fa0c3c): `etc/default-counters.csv`, `etc/dcp-metrics-included.csv` (T07-24, T07-32).
- facebookresearch/HolisticTraceAnalysis v0.6.1 (c925565fbe1e796433d3b5506f3ee925811d4569): tag pinned, not read (U07-5).

## Tier 1: first-party documentation, specifications and pricing

**From orchestrator note**

- AWS Price List bulk offer for AmazonFSx, us-east-1, offer version 20260911124432: https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonFSx/current/us-east-1/index.json (T00-1)

**From register 01, the training step and its maths**

- Hugging Face model API metadata for meta-llama/Llama-3.1-8B, -70B, -405B at the revisions in section 1 (T01-3)
- NVIDIA H100 product page https://www.nvidia.com/en-us/data-center/h100/ (T01-27) [vendor specification]
- NVIDIA H200 product page https://www.nvidia.com/en-us/data-center/h200/ (T01-28) [vendor specification]
- NVIDIA HGX page https://www.nvidia.com/en-us/data-center/hgx/ (T01-29) [vendor specification]
- AWS Neuron documentation, Trainium2 Architecture https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html (T01-30) [vendor specification]
- AWS Neuron documentation, NeuronCore-v3 Architecture https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/neuron-core-v3.html (T01-51) [vendor specification]

**From register 02, parallelism**

- Megatron-LM core_v0.20.0: `docs/user-guide/parallelism-guide.md`, `docs/user-guide/features/context_parallel.md`, `megatron/core/transformer/moe/README.md` (T02-25, T02-42, T02-52, T02-53, T02-72).
- NeMo v2.7.3: `examples/llm/auto_configurator/README.md` (T02-54).
- torchtitan v0.4.0: `docs/benchmarks/llama3_h100_202412_torchtitan.md` (T02-50).
- https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html (T02-68)
- https://aws.amazon.com/ec2/instance-types/p5/ (T02-68)
- https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/about-neuron/announcements/neuron2.x/announce-maintenance-nxdt-nxd-core-training.html (T02-65)
- https://www.nvidia.com/en-us/data-center/h100/ (T02-69; vendor specification)
- https://www.nvidia.com/en-us/data-center/nvlink/ (T02-70; vendor specification)

**From register 03, frameworks**

- NVIDIA-NeMo/Run v0.12.0: tree listing via GitHub API (T03-27)
- Release records (GitHub releases API): torchtitan v0.4.0 (2026-10-28), Megatron-Bridge v0.7.0 (2026-10-30), DeepSpeed v0.19.9 (2026-10-29), accelerate v1.15.0 (2026-09-09); NeMo v3.0.0 has no release object (T03-10, T03-13, T03-15, T03-23, T03-25, T03-33, T03-51)

**From register 04, reliability, checkpointing and data**

- https://docs.aws.amazon.com/sagemaker/latest/dg/managed-tier-checkpointing.html and https://docs.aws.amazon.com/sagemaker/latest/dg/managed-tier-checkpointing-setup.html
- https://aws.amazon.com/about-aws/whats-new/2025/09/managed-tiered-checkpointing-amazon-sagemaker-hyperpod/
- https://pypi.org/pypi/amzn-sagemaker-checkpointing/json
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-performance.html and https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-bucket-high-performance.html
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/mountpoint.html
- https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html and https://docs.aws.amazon.com/fsx/latest/LustreGuide/ssd-storage.html
- https://slurm.schedmd.com/sbatch.html
- https://aws.amazon.com/sagemaker/ai/hyperpod/ and https://aws.amazon.com/sagemaker/ai/hyperpod/features/ (T04-52)

**From register 05, AWS infrastructure**

- https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html (T05-1 to T05-6, T05-8 to T05-10, T05-30, T05-42)
- https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html (T05-26, T05-27, T05-34, T05-46)
- https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-purchase.html (T05-26)
- https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-pricing-billing.html (T05-27)
- https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html (T05-28)
- https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/cr-concepts.html (T05-28)
- https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html (T05-30)
- https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html (T05-31)
- https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html (T05-32)
- https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html (T05-29)
- https://docs.aws.amazon.com/fsx/latest/LustreGuide/using-fsx-lustre.html (T05-35)
- https://docs.aws.amazon.com/fsx/latest/LustreGuide/ssd-storage.html (T05-35)
- https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html (T05-36)
- https://docs.aws.amazon.com/fsx/latest/LustreGuide/efa-file-systems.html (T05-37)
- https://docs.aws.amazon.com/fsx/latest/LustreGuide/fsx-data-repositories.html (T05-38)
- https://docs.aws.amazon.com/fsx/latest/LustreGuide/importing-files.html (T05-38)
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html (T05-39)
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-performance.html (T05-40)
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-bucket-high-performance.html (T05-40)
- https://docs.aws.amazon.com/dlami/latest/devguide/aws-deep-learning-x86-base-gpu-ami-ubuntu-24-04.html (T05-43)
- https://docs.aws.amazon.com/dlami/latest/devguide/aws-deep-learning-ami-gpubaseoss-ul2404-2026-10-28.html (T05-43)
- https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html (T05-8, T05-45)
- Neuron documentation at Neuron 2.33.0: https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium.html (T05-19), .../trainium2.html (T05-17), .../trainium3.html (T05-18), .../trn2-arch.html (T05-10, T05-11), .../trn3-arch.html (T05-12); release index https://awsdocs-neuron.readthedocs-hosted.com/en/latest/release-notes/index.html (header)
- https://aws.amazon.com/ec2/instance-types/p4/ (T05-1), https://aws.amazon.com/ec2/instance-types/p5/ (T05-2, T05-3), https://aws.amazon.com/ec2/instance-types/p6/ (T05-4 to T05-8, T05-33), https://aws.amazon.com/ec2/instance-types/trn1/ (T05-9, T05-19), https://aws.amazon.com/ec2/instance-types/trn2/ (T05-10, T05-11, T05-17), https://aws.amazon.com/ec2/instance-types/trn3/ (T05-12, T05-18)
- https://aws.amazon.com/ec2/ultraclusters/ (T05-33), https://aws.amazon.com/ec2/ultraservers/ (C05-4)
- https://aws.amazon.com/ec2/capacityblocks/pricing/ (T05-22)
- AmazonEC2 version 20261029175634: us-east-1, us-east-2, us-west-2 `index.csv` (T05-20, T05-21); region index https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/region_index.json
- AmazonSageMaker version 20261029165009: us-east-1, us-east-2 `index.csv` (T05-23 to T05-25); region index https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonSageMaker/current/region_index.json
- https://www.nvidia.com/en-us/data-center/a100/ (T05-13)
- https://www.nvidia.com/en-us/data-center/h100/, https://www.nvidia.com/en-us/data-center/h200/ (T05-14)
- https://www.nvidia.com/en-us/data-center/hgx/ (T05-15)
- https://www.nvidia.com/en-us/data-center/gb200-nvl72/, https://www.nvidia.com/en-us/data-center/gb300-nvl72/ (T05-16)

**From register 06, AWS orchestration**

- SageMaker AI Developer Guide: `sagemaker-hyperpod.html`, `sagemaker-hyperpod-slurm.html`, `sagemaker-hyperpod-eks.html`, `sagemaker-hyperpod-resiliency-slurm-cluster-health-check.html`, `sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html`, `sagemaker-hyperpod-resiliency-slurm-auto-resume.html`, `sagemaker-hyperpod-eks-resiliency-health-monitoring-agent.html`, `sagemaker-hyperpod-eks-resiliency-node-recovery.html`, `sagemaker-eks-operator.html`, `sagemaker-eks-operator-usage.html`, `sagemaker-eks-elastic-training.html`, `sagemaker-eks-checkpointless.html`, `sagemaker-eks-checkpointless-release-notes.html`, `managed-tier-checkpointing.html`, `sagemaker-hyperpod-eks-operate-console-ui-governance.html`, `sagemaker-hyperpod-spot.html`, `sagemaker-hyperpod-recipes.html`, `sagemaker-hyperpod-eks-run-jobs-hyperpod-cli.html`, `hyperpod-trainium-slurm-cluster-pretrain-tutorial.html`, `sagemaker-hyperpod-release-notes.html`, `distributed-training.html`, `model-parallel-v2.html`, `model-parallel-release-notes.html`, `data-parallel-release-notes.html`, `train-warm-pools.html`, `model-managed-spot-training.html`, `train-heterogeneous-cluster.html`, `training-plan-utilization-for-training-jobs.html`, `reserve-capacity-with-training-plans.html`; TOC `toc-contents.json` (locating only). All under https://docs.aws.amazon.com/sagemaker/latest/dg/
- AWS PCS User Guide: `what-is-service.html`, `slurm-versions.html`, `working-with_ami_pcs-ready-dlami.html`, `working-with_ami_custom.html`, `capacity-blocks.html`, `working-with_clusters_size.html`, `cng-node-lifecycle-actions-vetted-scripts.html`, `toc-contents.json`. All under https://docs.aws.amazon.com/pcs/latest/userguide/
- Amazon EKS User Guide: `ml-on-eks.html`, `ml-compute-management.html`, `ml-node-groups.html`, `ml-validate-gpu-node-repair.html`, `device-management-neuron.html`, `ml-workload-topology.html`, `kubernetes-versions.html`; TOC (locating only). All under https://docs.aws.amazon.com/eks/latest/userguide/ ; `ml-node-pools.html` fetched, not cited. EKS Best Practices Guide index https://docs.aws.amazon.com/eks/latest/best-practices/aiml.html (U06-9)
- AWS Batch User Guide: `eks.html`, `mnp-eks-jobs.html`, `service-jobs.html`, `eks-ce-shared-responsibility.html`, TOC. All under https://docs.aws.amazon.com/batch/latest/userguide/
- AWS ParallelCluster User Guide (v3): https://docs.aws.amazon.com/parallelcluster/latest/ug/what-is-aws-parallelcluster.html , https://docs.aws.amazon.com/parallelcluster/latest/ug/support-policy.html
- SageMaker AI pricing: https://aws.amazon.com/sagemaker/ai/pricing/ (T06-17, T06-18, T06-23). HyperPod pricing URL https://aws.amazon.com/sagemaker/ai/hyperpod/pricing/ returned HTTP 404.
- AWS PCS pricing: https://aws.amazon.com/pcs/pricing/ (T06-35, T06-36, T06-53)
- AWS Batch pricing: https://aws.amazon.com/batch/pricing/ (T06-49)
- AWS Price List API: index https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/index.json ; `AWSPCS` us-east-1 offer version 20261027150327 (T06-36); `AmazonEKS` us-east-1 offer version 20261027191639 (T06-40, T06-41)

**From register 07, observability**

- PyTorch tutorial "Flight Recorder for Debugging Stuck Jobs": https://docs.pytorch.org/tutorials/unstable/flight_recorder_tutorial.html (T07-12)
- NVIDIA DCGM User Guide, Feature Overview: https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/feature-overview.html (T07-23)
- NVIDIA Xid catalog: https://docs.nvidia.com/deploy/xid-errors/analyzing-xid-catalog.html (T07-25)
- NVIDIA NCCL 2.32.3 RAS: https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/troubleshooting/ras.html (T07-27)
- Amazon CloudWatch, Container Insights enhanced observability metrics for EKS: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-enhanced-EKS.html (T07-28)
- Amazon EKS Best Practices Guide, AI/ML Observability: https://docs.aws.amazon.com/eks/latest/best-practices/aiml-observability.html (T07-29, T07-30)
- SageMaker AI Developer Guide: `sagemaker-hyperpod-observability-addon.html`, `hyperpod-observability-cluster-metrics.html`, `hyperpod-observability-addon-alerts.html`, `sagemaker-hyperpod-eks-cluster-observability.html`, `sagemaker-hyperpod-cluster-observability-slurm.html`, `monitoring-cloudwatch.html`, `training-metrics.html`, `train-debugger.html`, `debugger-availability-change.html`, `train-use-sagemaker-profiler.html`, `profiler-availability-change.html`, `debugger-profiling-report.html`, `mlflow.html`, all under https://docs.aws.amazon.com/sagemaker/latest/dg/ (T07-31 to T07-34)

## Tier 2: first-party lab and vendor posts, talks and announcements

**From register 01, the training step and its maths**

- None used.

**From register 02, parallelism**

- https://developer.nvidia.com/blog/massively-scale-deep-learning-training-nccl-2-4/ (T02-62)

**From register 04, reliability, checkpointing and data**

- facebookresearch/metaseq at f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7 (repository HEAD on 2026-10-30; no tags): `projects/OPT/chronicles/{README.md, 10_percent_update.md, 27_percent_update.md, 56_percent_update.md, final_update.md}` (T04-17, T04-18).
- Amazon Science blog on Gemini, 2023-10-25: https://www.amazon.science/blog/more-efficient-recovery-from-failures-during-large-ml-model-training (T04-33, T04-34).

**From register 05, AWS infrastructure**

- https://aws.amazon.com/about-aws/whats-new/2025/11/amazon-ec2-p6-b300-instances-nvidia-blackwell-ultra-gpus-available/ (T05-47)
- https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-p6e-gb300-ultraservers-nvidia-gb300-nvl72-generally-available/ (T05-8)
- https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/ (T05-48)
- https://aws.amazon.com/about-aws/whats-new/2026/06/aws-parallel-computing-service/ (T05-8, C05-5)

**From register 06, AWS orchestration**

- None cited. The RL dive register's Tier 2 sources are reused only through its entry IDs.

**From register 07, observability**

- facebookresearch/metaseq at f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7 (no tags; HEAD on 2026-10-30, same SHA as register 04): `projects/OPT/chronicles/10_percent_update.md`, `56_percent_update.md` (T07-15).

## Tier 3: papers (venue or preprint as recorded in each register) and third-party technical analysis

**From register 01, the training step and its maths**

- Peer-reviewed: 2104.04473v5 Megatron-LM (SC 2021); 1710.03740v3 Mixed Precision Training (ICLR 2018); 2110.02861v2 8-bit Optimizers (ICLR 2022)
- First-party lab technical reports (preprint): 2407.21783v3 Llama 3; 2412.19437v2 DeepSeek-V3; 2204.02311v5 PaLM; 2203.15556v1 Chinchilla; 2001.08361v1 Kaplan et al.; 1812.06162v1 McCandlish et al.; 2509.25149v2 NVFP4 (NVIDIA); 2502.16982v1 Muon (Moonshot AI)
- Other preprints (venue not confirmed on the arXiv page): 1910.02054v3 ZeRO; 2205.05198v1 Reducing Activation Recomputation; 2205.14135v2 FlashAttention; 2402.15627v1 MegaScale; 1604.06174v2 Training Deep Nets with Sublinear Memory Cost; 2209.05433v2 FP8 Formats for Deep Learning; 2310.10537v3 Microscaling Data Formats; 1905.12322v3 A Study of BFLOAT16; 1804.04235v1 Adafactor

**From register 02, parallelism**

- 2006.15704v1 PyTorch Distributed (VLDB 2020) (T02-1 to T02-3)
- 2304.11277v2 PyTorch FSDP (PVLDB 16(12)) (T02-8 to T02-10)
- 2104.04473v5 Megatron PTD-P (SC 2021) (T02-13, T02-14, T02-28 to T02-32, T02-43 to T02-45)
- 2006.09503v3 PipeDream-2BW and PipeDream-Flush (ICML 2021) (T02-29)
- 2101.03961v3 Switch Transformers (JMLR 23, 2022) (T02-36)
- 1910.02054v3 ZeRO (T02-4 to T02-7)
- 2306.10209v1 ZeRO++ (T02-11)
- 1909.08053v4 Megatron-LM (T02-12)
- 2205.05198v1 Reducing Activation Recomputation (T02-16 to T02-19)
- 2310.01889v4 Ring Attention (T02-20, T02-21)
- 2309.14509v2 DeepSpeed-Ulysses (T02-22, T02-23)
- 2407.21783v3 Llama 3 (first-party lab) (T02-24, T02-35, T02-46 to T02-48, T02-63, T02-66, T02-67)
- 1811.06965v5 GPipe (T02-27)
- 2401.10241v1 Zero Bubble (T02-33)
- 2412.19437v2 DeepSeek-V3 (first-party lab) (T02-34, T02-39, T02-40, T02-71)
- 2006.16668v1 GShard (T02-37)
- 2504.14960v3 MoE Parallel Folding (T02-41)
- 2410.06511v3 TorchTitan (T02-49, T02-50)
- Hugging Face Ultra-Scale Playbook, nanotron Space revision c93890dd4b22356ee18ed9b863e6f2d0909729bc: https://huggingface.co/spaces/nanotron/ultrascale-playbook/tree/c93890dd4b22356ee18ed9b863e6f2d0909729bc (T02-57, T02-58)

**From register 03, frameworks**

- 2106.09685v2, LoRA: Low-Rank Adaptation of Large Language Models, preprint (no venue in arXiv metadata) (T03-43)
- 2305.14314v1, QLoRA: Efficient Finetuning of Quantized LLMs, preprint (arXiv comment "Extended NeurIPS submission") (T03-44)
- 2410.06511v3, TorchTitan, peer-reviewed, ICLR 2025, confirmed from https://iclr.cc/virtual/2025/poster/29620 (C03-8; content used via T02-49, T02-50)

**From register 04, reliability, checkpointing and data**

- 2407.21783v3, The Llama 3 Herd of Models (preprint, first-party lab).
- 2410.21680v2, Revisiting Reliability in Large-Scale Machine Learning Research Clusters (preprint, first-party operator).
- 2402.15627v1, MegaScale (NSDI, per acknowledgements).
- 2407.20143v4, ByteCheckpoint (NSDI 2025, per the paper's footnote).
- 2505.05713v2, Understanding Stragglers in Large Model Training Using What-if Analysis (OSDI, per acknowledgements).
- 2410.12588v1, FALCON (preprint).
- Gemini, SOSP 2023, DOI 10.1145/3600006.3613145 (not read; 403).
- Young, CACM 17, 1974, and Daly, FGCS 22(3), 2006 (bibliographic only; not read).

**From register 07, observability**

- 2204.02311v5, PaLM, preprint (T07-13)
- 2205.01068v4, OPT, preprint (T07-14)
- 2407.21783v3, The Llama 3 Herd of Models, preprint (T07-16)
- 2412.19437v2, DeepSeek-V3 Technical Report, preprint (T07-17)
- 2501.00656v3, 2 OLMo 2 Furious, peer-reviewed (COLM 2025, shorter version, per arXiv comments) (T07-18)
- Via other registers: 2402.15627v1, MegaScale, peer-reviewed NSDI 2024 (register 04)

## Not evidence: used only to locate or date sources

**From register 05, AWS infrastructure**

- One web search (aws.amazon.com only) to find the P6e-GB300 and PCS What's New URLs; no claim rests on it.

**From register 06, AWS orchestration**

- Releases and commit dates for the repositories above; `api.github.com/repositories/698678789` (repository rename, T06-39)
