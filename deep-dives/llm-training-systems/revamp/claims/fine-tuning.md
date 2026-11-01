# Claims: section 16, Fine-Tuning & Post-Training Runs

File: `src/sections/FineTuning.tsx`. Re-opened on 2026-10-31 (Cites carry the default accessed date): the LoRA (2106.09685v2) and QLoRA (2305.14314v1) PDFs via pdftotext; the Hugging Face API record for Llama 3.1 70B (revision 349b2ddb53ce8f2849a6c168a81980ab25258dac, 70,553,706,496); Megatron Core `dist_optimizer.md`, Axolotl, LLaMA-Factory, NeMo RL and TorchTitan READMEs at their pinned commits; verl, OpenRLHF, TRL and slime files at the commits the RL dive's register 05 pins; the TorchTitan v0.4.0 release page; the HyperPod checkpointless guide. Not re-opened, `accessed="2026-10-30"`: ZeRO, the NVIDIA H100 page, the EC2 accelerated computing page, the 8B and 405B Hugging Face records, the HyperPod recipes guide, the recipes 2.0.11 tree and the v2.0.0 release notes. Every byte total and GPU count is computed at render time by Calculator B (`memoryBudget` in `src/lib/memory.ts`, frozen-base rows `FROZEN_BASE_BYTES` in `src/lib/presets.ts`); the values below were reproduced with an esbuild bundle of the same library on 2026-10-31.

Format: claim | source URL | register, wave 2 row or experiment

## Header and opening

- Freezing Llama 3.1 70B's weights and storing them in 4 bits takes model state from 15 H100 at 80 GB each to one | Calculator B; https://www.nvidia.com/en-us/data-center/h100/ | 03 W4; W3-21, W3-23 (derived)
- LoRA is low-rank adaptation, small trainable matrices beside frozen weights; QLoRA is LoRA over a base quantised to 4 bits | https://arxiv.org/abs/2106.09685v2 ; https://arxiv.org/abs/2305.14314v1 | T03-43, T03-44; R1 gloss table
- Fine-tuning and post-training (supervised fine-tuning, preference training, RL) defined in words | definitional, no citation | scope section 16
- RL dive owns the algorithms (link only) | ../rl-agentic-loops/ | scope "Connections"

## What a frozen base leaves in memory

- Mixed-precision Adam: 16 bytes per parameter, 2 weights, 2 gradients, 12 optimizer (FP32 master, two moments) | https://arxiv.org/abs/1910.02054v3 (Section 3.1) | T01-9; 01 W2
- 18 bytes per parameter for BF16 parameters with FP32 gradients, Megatron Core's table (not claimed as a default) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/docs/user-guide/features/dist_optimizer.md#L14-L20 | T03-17; W3-9
- LoRA's memory saving: no optimizer state for frozen parameters ("up to 2/3", large Transformer trained with Adam); 25% training speedup on GPT-3 175B from not computing gradients for most parameters | https://arxiv.org/abs/2106.09685v2 (Section 4.2) | T03-43; W3-19
- GPT-3 175B training memory 1.2 TB to 350 GB | https://arxiv.org/abs/2106.09685v2 (Section 4.2) | T03-43; W3-19
- 350 GB = 2 bytes x 175e9 parameters (frozen 16-bit weights) | derived from the paper's figures | T03-43 use-in-dive
- LoRA computes Y = XW + sXL1L2, only L1, L2 trained | https://arxiv.org/abs/2305.14314v1 (Section 2, Equation 3) | NEW (QLoRA Section 2, read 2026-10-31)
- QLoRA: NF4 frozen base, double quantization of the quantization constants, paged optimizers evicting optimizer state to CPU memory | https://arxiv.org/abs/2305.14314v1 (Section 3) | T03-44; W3-20
- NF4 is designed for zero-centred normally distributed data ("information-theoretically optimal") | https://arxiv.org/abs/2305.14314v1 (Section 3) | NEW wording from Section 3
- 65B fine-tuned on a single 48 GB GPU, with full 16-bit fine-tuning task performance reported | https://arxiv.org/abs/2305.14314v1 (abstract) | T03-44; W3-20
- Llama 3.1 70B has 70,553,706,496 parameters | https://huggingface.co/api/models/meta-llama/Llama-3.1-70B | T01-3
- H100 has 80 GB (vendor specification) | https://www.nvidia.com/en-us/data-center/h100/ | T02-69
- Diagram and prose: full 16 bytes 1,128.9 GB (141.1 weights, 141.1 gradients, 846.6 optimizer), 15 H100 at 80 GB; 18 bytes 1,270.0 GB, 16 H100; LoRA 141.1 GB, 2 H100; QLoRA 35.3 GB, 1 H100 (adapters not counted) | Calculator B (`memoryBudget`, `FROZEN_BASE_BYTES`) | 01 W2, 03 W4; W3-21, W3-22, W3-23
- At the EC2 page's 80 GiB (85.9 GB) per H100, full fine-tuning needs 14 (16 bytes) and 15 (18 bytes) | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T02-68; W3-21 (derived)
- QLoRA constants after double quantization add 0.127 bits per parameter; 4.127 bits gives 36.4 GB for 70B | https://arxiv.org/abs/2305.14314v1 (Section 3) | W3-23 (derived)
- QLoRA measurement, 7B LLaMA, FLAN v2, batch size 1, LoRA at "commonly used 0.2%" of weights: LoRA input gradients 567 MB, LoRA parameters 26 MB, 18 MB per sequence with gradient checkpointing, 4-bit base 5,048 MB | https://arxiv.org/abs/2305.14314v1 (Section 2, "Memory Requirement of Parameter-Efficient Finetuning") | NEW (not in register 03; read at the pinned version 2026-10-31)
- Gradient checkpointing is recomputation (section 5's term) | definitional | section 5

### Expandable: how the 70B figures are counted

- Ratios against 80 GB: 14.1, 15.9, 1.76, 0.44; against 80 GiB (85.9 GB): 13.1, 14.8, 1.64, 0.41 | Calculator B | W3-21, W3-22, W3-23 (derived)
- LLaMA-Factory's "estimated" table: 70B full (bf16 or fp16) 1,200 GB, the Freeze/LoRA/GaLore/APOLLO/BAdam/OFT row 160 GB, 4-bit QLoRA 48 GB; per-B columns 18x, 2x, x/2 | https://github.com/hiyouga/LLaMA-Factory/blob/v0.9.5/README.md#L484-L495 | T03-45; W3-24
- The per-B formulas give 1,260, 140 and 35 GB, so the printed cells are rounded or padded | derived | W3-24
- Full figure sits between the 16- and 18-byte bases, the LoRA and QLoRA figures above the weights alone | our reading | 03 W4
- LoRA Section 7.1: parameter budget of 18M, "roughly 35MB if stored in FP16", GPT-3 175B, r = 4 on two attention weight types | https://arxiv.org/abs/2106.09685v2 (Section 7.1) | NEW (adjacent to T03-43)
- 18M is 0.01% of 175B; at 16 bytes about 0.29 GB | derived
- Calculator B charges adapters 16 bytes per trainable parameter (mixed-precision AdamW) | src/lib/memory.ts `optimizerComponents` | 03 W4

## Fine-tuning frameworks configure an engine

- Engines (FSDP2 and DTensor, Megatron Core, DeepSpeed) and front ends that configure them | section 15; our reading | T03-50; W3-27
- FSDP splits model state across data-parallel ranks; FSDP2 is PyTorch's second implementation; ZeRO stages do the same split | definitional; section 8 | T03-1, T03-29; W3-10
- Axolotl v0.21.1: one YAML file for the pipeline; methods include full fine-tuning, LoRA, QLoRA, preference tuning, RL; multi-GPU on FSDP2 or DeepSpeed | https://github.com/axolotl-ai-cloud/axolotl/blob/v0.21.1/README.md#L100-L102 | T03-46; W3-25
- Axolotl composes CP, TP and FSDP within a node and across nodes | https://github.com/axolotl-ai-cloud/axolotl/blob/v0.21.1/README.md#L76 | T03-46
- LLaMA-Factory runs `llamafactory-cli train` with YAML | https://github.com/hiyouga/LLaMA-Factory/blob/v0.9.5/README.md#L636 | T03-47
- LLaMA-Factory runs on DeepSpeed ("Supervised Fine-Tuning with DeepSpeed ZeRO-3 (Weight Sharding)") | https://github.com/hiyouga/LLaMA-Factory/blob/v0.9.5/examples/README.md#L97-L101 | NEW (doc, v0.9.5)
- LLaMA-Factory FSDP+QLoRA "fine-tunes a 70B model on 2x24GB GPUs" | https://github.com/hiyouga/LLaMA-Factory/blob/v0.9.5/README.md#L214 | T03-47; W3-25
- LLaMA-Factory Megatron Core backend via mcore_adapter since 2025-10-26 | https://github.com/hiyouga/LLaMA-Factory/blob/v0.9.5/README.md#L128 | T03-47; W3-25
- 35.3 GB over two cards is about 17.6 GB each | derived (Calculator B)
- A front end's memory and scaling behaviour is its engine's, configured | our reading | T03-50

## RL is an inference job inside a training job

- An RL step generates, trains on the scored answers, then updates the generator's weights; slime's loop shows the sequence | https://github.com/THUDM/slime/blob/0b0c277d5b4cc66efc3b6db269e2e5184e8f3b1e/train.py#L47-L90 | F05-33 (RL dive register 05); line range re-read 2026-10-31
- An RL run, and a preference run that generates its own answers, is an inference job inside a training job | our reading | scope section 16 (narrowed to runs that generate)
- verl v0.9.1: training backend per actor `strategy` fsdp, megatron, veomni, torchtitan | https://github.com/volcengine/verl/tree/1876b06d0a3e4e71e06230be10af14492ca8a75b/verl/trainer/config/actor | F05-24
- verl rollout names hf/vllm/sglang/trtllm, `mode: async` | https://github.com/volcengine/verl/blob/1876b06d0a3e4e71e06230be10af14492ca8a75b/verl/trainer/config/rollout/rollout.yaml#L4-L8 | F05-24
- OpenRLHF v0.11.2: `get_strategy` builds a `DeepspeedStrategy` with `zero_stage=args.ds.zero_stage` | https://github.com/OpenRLHF/OpenRLHF/blob/17fd4a79cc87dfb2f6185ffac634066525bcd917/openrlhf/utils/utils.py#L25-L37 | F05-13 (paper), code line NEW
- OpenRLHF creates vLLM engines for generation | https://github.com/OpenRLHF/OpenRLHF/blob/17fd4a79cc87dfb2f6185ffac634066525bcd917/openrlhf/cli/train_ppo_ray.py#L52-L66 | F05-13, F05-14
- TRL (Transformers Reinforcement Learning, README L1 at 1b5c75ed) v1.16.0: transformers and accelerate in core dependencies; vLLM an optional extra | https://github.com/huggingface/trl/blob/1b5c75ed94b7387f42532adb090c935166d4878d/pyproject.toml#L29-L42 ; #L89-L93 | F05-46
- slime v0.4.0 backends megatron_utils and sglang_utils | https://github.com/THUDM/slime/tree/0b0c277d5b4cc66efc3b6db269e2e5184e8f3b1e/slime/backends | F05-33
- NeMo RL v0.7.0: DTensor or Megatron (Megatron Bridge) training; vLLM or Megatron inference backend | https://github.com/NVIDIA-NeMo/RL/blob/v0.7.0/README.md#L84-L96 | T03-49
- Every post-training framework read in this research reuses a training engine; behaviour is the engine's | our reading | T03-50; W3-26 replacement text
- verl on Megatron behaves as Megatron Core; OpenRLHF as its configured ZeRO stage | our reading (consequence of the row above)
- TitanRL moved out of experimental in v0.4.0, shares the core TrainingEngine, supports pipeline and context parallel training | https://github.com/pytorch/torchtitan/releases/tag/v0.4.0 | T03-15; W3-14
- One model definition shared by the trainer and vLLM | https://github.com/pytorch/torchtitan/blob/v0.4.0/README.md#L153-L157 | T03-15
- TorchTitan is the PyTorch team's reference trainer (gloss) | section 3 wording | T03-10
- Links: RL dive section 19, SGLang dive section 13 | ../rl-agentic-loops/ ; ../sglang/ | titles read from each dive's App.tsx

## Where AWS's recipes start you

- HyperPod recipes are AWS's pre-built training stacks, runnable on HyperPod or as SageMaker training jobs | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-recipes.html | T06-19
- At 2.0.11 the repository is a fine-tuning and post-training collection; its training directory holds six recipes: one open-weight pre-training (checkpointless Llama 3 70B), a Falcon custom-model example, four Nova continued pre-training | https://github.com/aws/sagemaker-hyperpod-recipes/tree/2.0.11/hyperpod_recipes/recipes_src/training | T06-20; W5-57
- v2.0.0 release notes list verl, checkpointless and elastic training among additions | https://github.com/aws/sagemaker-hyperpod-recipes/releases/tag/v2.0.0 | T06-20
- Checkpointless recipe table: Llama3 70B LoRA example on 2 p5.48xlarge; GPT OSS 120B LoRA on 2, full fine-tune on 16 | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless.html | W5-57 (re-read 2026-10-31)
- 2 p5.48xlarge = 16 H100; eight times the two H100 of frozen BF16 70B weights | derived from T02-68 and Calculator B
- GPU count beyond the memory floor is set by activations and target step time | our reading

## Size your run, then pick the engine

- Widget rows for 8B, 70B and 405B (full 16, full 18, LoRA, QLoRA with adapter share) and H100 counts at 80 GB and 80 GiB | Calculator B | 01 W2, 03 W4; W3-21. Reproduced: 8B 128.48 / 144.54 / 16.06 / 4.02 GB; 70B 1,128.86 / 1,269.97 / 141.11 / 35.28 GB (at 0.2% adapters 143.37 and 37.53); 405B 6,493.65 / 7,305.36 / 811.71 / 202.93 GB
- Default adapter share 0.2%, "commonly used" | https://arxiv.org/abs/2305.14314v1 (Section 2) | NEW
- GB is 10^9 bytes, GiB 2^30; H100 80 GB (NVIDIA) and 80 GiB (EC2 page), 85.9 GB | https://www.nvidia.com/en-us/data-center/h100/ ; https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T02-68, T02-69; W3-21
- Llama 3.1 8B and 405B parameter counts | https://huggingface.co/api/models/meta-llama/Llama-3.1-8B ; https://huggingface.co/api/models/meta-llama/Llama-3.1-405B | T01-3
- Section 5's calculator counts activations the same for every optimizer row; for a frozen base that is our assumption | src/lib/memory.ts (`stageActivations` does not read the optimizer choice) | our reading of our calculator
- Engine groupings for the closing list (FSDP or DTensor; Megatron Core; DeepSpeed; Accelerate) | regrouping of the rows above | T03-46, T03-47, T03-49, T03-15, F05-13, F05-24, F05-33, F05-46

## Acronyms expanded in this file

RL, LoRA, QLoRA, FP32, BF16, ZeRO, NF4, EC2, FP16, DTensor, FSDP (FSDP2 glossed), TRL. Used unexpanded as common or as names: GPU, CPU, YAML, GB, GiB, MB, TB, H100, vLLM, SGLang.
