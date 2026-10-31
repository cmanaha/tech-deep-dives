# RL and agentic learning loops deep dive: sources

Generated from the inline citations in `src/` by `revamp/tools/gen-sources.mjs`. Do not edit by hand;
change the citation in the section and regenerate.

Code citations are pinned to release tags or commits (TRL `v1.16.0`, verl `v0.9.1`, OpenRLHF
`v0.11.2`, DSPy `3.4.1`, gepa `v0.1.4`, autoresearch `228791fb499afffb54b46200aca536f79142f117`, among others),
and arXiv links to a paper version. Code links are listed per file; the sections link to exact line ranges.
Tiers follow the dive's RESEARCH-GUIDE.md section 1. Tier 3 papers show their venue, or "preprint".

## Tier 0: our own experiments (logs in research/)

9 sources.

| Source | Accessed | Cited in |
| --- | --- | --- |
| [cmanaha/tech-deep-dives @ b763d34a9a5a1e3e28a33daf44b67fb03781a757: deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke.md](https://github.com/cmanaha/tech-deep-dives/blob/b763d34a9a5a1e3e28a33daf44b67fb03781a757/deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke.md) | 2026-10-30 | Choosing, GlossaryAndSources, LanguageModelAsPolicy, RlStepAsSystem, RlvrAndGrpo, SideBySideLab, TwoLeashes |
| [cmanaha/tech-deep-dives @ b763d34a9a5a1e3e28a33daf44b67fb03781a757: deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/](https://github.com/cmanaha/tech-deep-dives/blob/b763d34a9a5a1e3e28a33daf44b67fb03781a757/deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/) | 2026-10-30 | GlossaryAndSources |
| [cmanaha/tech-deep-dives @ b763d34a9a5a1e3e28a33daf44b67fb03781a757: deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/pip-freeze.txt](https://github.com/cmanaha/tech-deep-dives/blob/b763d34a9a5a1e3e28a33daf44b67fb03781a757/deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/pip-freeze.txt) | 2026-10-30 | SideBySideLab |
| [cmanaha/tech-deep-dives @ b763d34a9a5a1e3e28a33daf44b67fb03781a757: deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/run.sh](https://github.com/cmanaha/tech-deep-dives/blob/b763d34a9a5a1e3e28a33daf44b67fb03781a757/deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/run.sh) | 2026-10-30 | SideBySideLab |
| [cmanaha/tech-deep-dives @ b763d34a9a5a1e3e28a33daf44b67fb03781a757: deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/run1/logs.jsonl](https://github.com/cmanaha/tech-deep-dives/blob/b763d34a9a5a1e3e28a33daf44b67fb03781a757/deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/run1/logs.jsonl) | 2026-10-30 | RlStepAsSystem, RlvrAndGrpo, SideBySideLab, TwoLeashes |
| [cmanaha/tech-deep-dives @ b763d34a9a5a1e3e28a33daf44b67fb03781a757: deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/run1/meta.json](https://github.com/cmanaha/tech-deep-dives/blob/b763d34a9a5a1e3e28a33daf44b67fb03781a757/deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/run1/meta.json) | 2026-10-30 | SideBySideLab |
| [cmanaha/tech-deep-dives @ b763d34a9a5a1e3e28a33daf44b67fb03781a757: deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/run2/logs.jsonl](https://github.com/cmanaha/tech-deep-dives/blob/b763d34a9a5a1e3e28a33daf44b67fb03781a757/deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/run2/logs.jsonl) | 2026-10-30 | RlStepAsSystem, RlvrAndGrpo, SideBySideLab, TwoLeashes |
| [cmanaha/tech-deep-dives @ b763d34a9a5a1e3e28a33daf44b67fb03781a757: deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/run2/train.log](https://github.com/cmanaha/tech-deep-dives/blob/b763d34a9a5a1e3e28a33daf44b67fb03781a757/deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/run2/train.log) | 2026-10-30 | SideBySideLab |
| [cmanaha/tech-deep-dives @ b763d34a9a5a1e3e28a33daf44b67fb03781a757: deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/train.py](https://github.com/cmanaha/tech-deep-dives/blob/b763d34a9a5a1e3e28a33daf44b67fb03781a757/deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke/train.py) | 2026-10-30 | SideBySideLab |

## Tier 1: source code at a pinned ref, official framework documentation, first-party AWS documentation and pricing

98 sources.

| Source | Accessed | Cited in |
| --- | --- | --- |
| [Amazon Bedrock pricing, reinforcement fine-tuning](https://aws.amazon.com/bedrock/pricing/) | 2026-10-30 | CostPerImprovement, RlOnAws, Sources appendix |
| [Neuron v2.33.0, NxD Training archive notice](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/archive/nxd-training/index.html) | 2026-10-30 | RlOnAws |
| [Neuron v2.33.0, What is TorchNeuron](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/torch/about-pytorch-neuron.html) | 2026-10-30 | RlOnAws |
| [OpenAI API docs: reinforcement fine-tuning](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning) | 2026-10-30 | Choosing, PreferencesToRewards |
| [Amazon Bedrock AgentCore: episodic memory strategy](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/episodic-memory-strategy.html) | 2026-10-30 | Choosing, RlOnAws, Sources appendix |
| [AgentCore developer guide, evaluations](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html) | 2026-10-30 | RlOnAws |
| [AgentCore developer guide, built-in strategies with overrides](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-custom-strategy.html) | 2026-10-30 | RlOnAws |
| [AgentCore developer guide, episodic memory system prompt](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-episodic-prompt.html) | 2026-10-30 | RlOnAws |
| [AgentCore developer guide, self-managed strategies](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-self-managed-strategies.html) | 2026-10-30 | RlOnAws |
| [AgentCore developer guide, how optimization works](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization-how-it-works.html) | 2026-10-30 | RlOnAws |
| [Amazon Bedrock AgentCore: optimization](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization.html) | 2026-10-30 | Choosing, RlOnAws, Sources appendix |
| [Bedrock user guide: how Advanced Prompt Optimization works](https://docs.aws.amazon.com/bedrock/latest/userguide/advanced-prompt-optimization-how.html) | 2026-10-30 | Choosing, RlOnAws, Sources appendix |
| [Bedrock user guide, customisation methods](https://docs.aws.amazon.com/bedrock/latest/userguide/custom-models.html) | 2026-10-30 | RlOnAws |
| [Amazon Bedrock user guide: prompt caching](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html) | 2026-10-30 | Sources appendix, WhereWordsFallShort, YourLoops |
| [Bedrock user guide, benefits of RFT](https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html) | 2026-10-30 | Choosing, CostPerImprovement, RlOnAws, RlvrAndGrpo, Sources appendix |
| [Bedrock user guide, reward functions for open-weight models](https://docs.aws.amazon.com/bedrock/latest/userguide/reward-functions-open-weight.html) | 2026-10-30 | RlOnAws |
| [Bedrock user guide, reward functions for Nova models](https://docs.aws.amazon.com/bedrock/latest/userguide/reward-functions.html) | 2026-10-30 | RlOnAws |
| [Bedrock user guide, RFT data for open-weight models](https://docs.aws.amazon.com/bedrock/latest/userguide/rft-prepare-data-open-weight.html) | 2026-10-30 | RlOnAws |
| [Bedrock user guide, RFT data for Nova models](https://docs.aws.amazon.com/bedrock/latest/userguide/rft-prepare-data.html) | 2026-10-30 | RlOnAws |
| [Bedrock user guide: create an RFT job](https://docs.aws.amazon.com/bedrock/latest/userguide/rft-submit-job.html) | 2026-10-30 | CostPerImprovement, RlvrAndGrpo, Sources appendix, TwoLeashes |
| [Amazon SageMaker AI: training sessions](https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models-training-sessions.html) | 2026-10-30 | Choosing, RlOnAws, Sources appendix |
| [SageMaker AI developer guide: Model customization](https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models.html) | 2026-10-30 | Choosing, PreferencesToRewards, RlOnAws, Sources appendix |
| [SageMaker AI Developer Guide: Preparing your agent](https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl-agent.html) | 2026-10-30 | AgenticRl, RlOnAws, Sources appendix |
| [SageMaker AI multi-turn RL hyperparameters reference](https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl-hyperparams.html) | 2026-10-30 | Choosing, RlOnAws, RlvrAndGrpo |
| [SageMaker AI developer guide: Open weight model customization](https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-open-weight.html) | 2026-10-30 | PreferencesToRewards, RlOnAws |
| [SageMaker AI developer guide, training sessions SDK reference](https://docs.aws.amazon.com/sagemaker/latest/dg/training-sessions-sdk.html) | 2026-10-30 | RlOnAws |
| [Neuron documentation source, v2.33.0](https://github.com/aws-neuron/aws-neuron-sdk/tree/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a) | 2026-10-30 | RlOnAws |
| [aws/sagemaker-hyperpod-recipes @ a6030c319908c8a1b74cb619b00476f8e6baa04f: hyperpod_recipes/recipes_src/fine-tuning/hydra_config/verl-0_7_0/ppo_trainer.yaml](https://github.com/aws/sagemaker-hyperpod-recipes/blob/a6030c319908c8a1b74cb619b00476f8e6baa04f/hyperpod_recipes/recipes_src/fine-tuning/hydra_config/verl-0_7_0/ppo_trainer.yaml) | 2026-10-30 | RlOnAws |
| [aws/sagemaker-hyperpod-recipes @ a6030c319908c8a1b74cb619b00476f8e6baa04f: hyperpod_recipes/recipes_src/fine-tuning/hydra_config/verl-0_7_0/rollout/rollout.yaml](https://github.com/aws/sagemaker-hyperpod-recipes/blob/a6030c319908c8a1b74cb619b00476f8e6baa04f/hyperpod_recipes/recipes_src/fine-tuning/hydra_config/verl-0_7_0/rollout/rollout.yaml) | 2026-10-30 | RlOnAws |
| [aws/sagemaker-hyperpod-recipes @ a6030c319908c8a1b74cb619b00476f8e6baa04f: hyperpod_recipes/recipes_src/fine-tuning/nova/nova_2_0/nova_lite/RFT/nova_lite_2_0_p5_gpu_rft.yaml](https://github.com/aws/sagemaker-hyperpod-recipes/blob/a6030c319908c8a1b74cb619b00476f8e6baa04f/hyperpod_recipes/recipes_src/fine-tuning/nova/nova_2_0/nova_lite/RFT/nova_lite_2_0_p5_gpu_rft.yaml) | 2026-10-30 | RlOnAws |
| [aws/sagemaker-hyperpod-recipes @ a6030c319908c8a1b74cb619b00476f8e6baa04f: hyperpod_recipes/recipes_src/fine-tuning/qwen-0_7_0/verl-grpo-rlvr-qwen-3-32b-lora.yaml](https://github.com/aws/sagemaker-hyperpod-recipes/blob/a6030c319908c8a1b74cb619b00476f8e6baa04f/hyperpod_recipes/recipes_src/fine-tuning/qwen-0_7_0/verl-grpo-rlvr-qwen-3-32b-lora.yaml) | 2026-10-30 | RlOnAws |
| [SageMaker HyperPod recipes at commit a6030c3 (release 2.0.11): verl GRPO and Nova RFT recipes](https://github.com/aws/sagemaker-hyperpod-recipes/tree/a6030c319908c8a1b74cb619b00476f8e6baa04f) | 2026-10-30 | Sources appendix |
| [aws/sagemaker-hyperpod-recipes @ a6030c319908c8a1b74cb619b00476f8e6baa04f: hyperpod_recipes/recipes_src/fine-tuning](https://github.com/aws/sagemaker-hyperpod-recipes/tree/a6030c319908c8a1b74cb619b00476f8e6baa04f/hyperpod_recipes/recipes_src/fine-tuning) | 2026-10-30 | Choosing, RlOnAws |
| [gepa-ai/gepa-artifact @ cbefbc1aa0f43dd39874ec4bf42211365dbda42e: gepa_artifact/benchmarks/AIME/__init__.py](https://github.com/gepa-ai/gepa-artifact/blob/cbefbc1aa0f43dd39874ec4bf42211365dbda42e/gepa_artifact/benchmarks/AIME/__init__.py) | 2026-10-30 | PromptOptimization |
| [gepa-ai/gepa-artifact @ cbefbc1aa0f43dd39874ec4bf42211365dbda42e: gepa_artifact/benchmarks/AIME/AIME_data.py](https://github.com/gepa-ai/gepa-artifact/blob/cbefbc1aa0f43dd39874ec4bf42211365dbda42e/gepa_artifact/benchmarks/AIME/AIME_data.py) | 2026-10-30 | PromptOptimization |
| [gepa-ai/gepa-artifact @ cbefbc1aa0f43dd39874ec4bf42211365dbda42e: gepa_artifact/gepa/gepa.py](https://github.com/gepa-ai/gepa-artifact/blob/cbefbc1aa0f43dd39874ec4bf42211365dbda42e/gepa_artifact/gepa/gepa.py) | 2026-10-30 | PromptOptimization |
| [gepa-ai/gepa-artifact @ cbefbc1aa0f43dd39874ec4bf42211365dbda42e: scripts/experiment_configs.py](https://github.com/gepa-ai/gepa-artifact/blob/cbefbc1aa0f43dd39874ec4bf42211365dbda42e/scripts/experiment_configs.py) | 2026-10-30 | PromptOptimization |
| [gepa-ai/gepa-artifact @ cbefbc1aa0f43dd39874ec4bf42211365dbda42e: scripts/run_experiments.py](https://github.com/gepa-ai/gepa-artifact/blob/cbefbc1aa0f43dd39874ec4bf42211365dbda42e/scripts/run_experiments.py) | 2026-10-30 | PromptOptimization |
| [gepa-ai/gepa @ v0.1.4: src/gepa/api.py](https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/api.py) | 2026-10-30 | PromptOptimization |
| [gepa-ai/gepa @ v0.1.4: src/gepa/core/engine.py](https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/core/engine.py) | 2026-10-30 | PromptOptimization |
| [gepa-ai/gepa @ v0.1.4: src/gepa/core/state.py](https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/core/state.py) | 2026-10-30 | PromptOptimization |
| [gepa-ai/gepa @ v0.1.4: src/gepa/gepa_utils.py](https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/gepa_utils.py) | 2026-10-30 | PromptOptimization |
| [gepa-ai/gepa @ v0.1.4: src/gepa/strategies/acceptance.py](https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/strategies/acceptance.py) | 2026-10-30 | PromptOptimization |
| [gepa-ai/gepa @ v0.1.4: src/gepa/strategies/instruction_proposal.py](https://github.com/gepa-ai/gepa/blob/v0.1.4/src/gepa/strategies/instruction_proposal.py) | 2026-10-30 | PromptOptimization |
| [gepa at v0.1.4, the version DSPy 3.4.1 pins](https://github.com/gepa-ai/gepa/tree/v0.1.4) | 2026-10-30 | Sources appendix |
| [huggingface/trl @ v1.12.0: trl/experimental/ppo/ppo_config.py](https://github.com/huggingface/trl/blob/v1.12.0/trl/experimental/ppo/ppo_config.py) | 2026-10-30 | LanguageModelAsPolicy |
| [huggingface/trl @ v1.12.0: trl/experimental/ppo/ppo_trainer.py](https://github.com/huggingface/trl/blob/v1.12.0/trl/experimental/ppo/ppo_trainer.py) | 2026-10-30 | LanguageModelAsPolicy, PreferencesToRewards, RlStepAsSystem |
| [huggingface/trl @ v1.12.0: trl/trainer/ppo_trainer.py](https://github.com/huggingface/trl/blob/v1.12.0/trl/trainer/ppo_trainer.py) | 2026-10-30 | Sources appendix |
| [huggingface/trl @ v1.16.0: docs/source/aws_trainium.md](https://github.com/huggingface/trl/blob/v1.16.0/docs/source/aws_trainium.md) | 2026-10-30 | RlOnAws |
| [huggingface/trl @ v1.16.0: docs/source/grpo_trainer.md](https://github.com/huggingface/trl/blob/v1.16.0/docs/source/grpo_trainer.md) | 2026-10-30 | RlvrAndGrpo |
| [huggingface/trl @ v1.16.0: docs/source/paper_index.md](https://github.com/huggingface/trl/blob/v1.16.0/docs/source/paper_index.md) | 2026-10-30 | RlvrAndGrpo |
| [huggingface/trl @ v1.16.0: pyproject.toml](https://github.com/huggingface/trl/blob/v1.16.0/pyproject.toml) | 2026-10-30 | SideBySideLab |
| [huggingface/trl @ v1.16.0: trl/generation/vllm_generation.py](https://github.com/huggingface/trl/blob/v1.16.0/trl/generation/vllm_generation.py) | 2026-10-30 | RlStepAsSystem |
| [huggingface/trl @ v1.16.0: trl/trainer/dpo_config.py](https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/dpo_config.py) | 2026-10-30 | PreferencesToRewards |
| [huggingface/trl @ v1.16.0: trl/trainer/dpo_trainer.py](https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/dpo_trainer.py) | 2026-10-30 | PreferencesToRewards |
| [huggingface/trl @ v1.16.0: trl/trainer/grpo_config.py](https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py) | 2026-10-30 | RlOnAws, RlStepAsSystem, RlvrAndGrpo, SideBySideLab, Sources appendix, TwoLeashes |
| [huggingface/trl @ v1.16.0: trl/trainer/grpo_trainer.py](https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py) | 2026-10-30 | AgenticRl, Hybrids, RlStepAsSystem, RlvrAndGrpo, SideBySideLab, Sources appendix, TwoLeashes |
| [huggingface/trl @ v1.16.0: trl/trainer/kto_trainer.py](https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/kto_trainer.py) | 2026-10-30 | PreferencesToRewards |
| [huggingface/trl @ v1.16.0: trl/trainer/rloo_config.py](https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/rloo_config.py) | 2026-10-30 | TwoLeashes |
| [huggingface/trl @ v1.16.0: trl/trainer/rloo_trainer.py](https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/rloo_trainer.py) | 2026-10-30 | RlvrAndGrpo |
| [huggingface/trl @ v1.16.0: trl/trainer/utils.py](https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/utils.py) | 2026-10-30 | RlvrAndGrpo |
| [TRL v1.13.0 release notes](https://github.com/huggingface/trl/releases/tag/v1.13.0) | 2026-10-30 | LanguageModelAsPolicy |
| [huggingface/trl @ v1.16.0: trl/trainer](https://github.com/huggingface/trl/tree/v1.16.0/trl/trainer) | 2026-10-30 | LanguageModelAsPolicy |
| [karpathy/autoresearch @ 228791fb499afffb54b46200aca536f79142f117: prepare.py](https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/prepare.py) | 2026-10-30 | RewardIsAProxy, TextLoopAsRl, YourLoops |
| [karpathy/autoresearch @ 228791fb499afffb54b46200aca536f79142f117: program.md](https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md) | 2026-10-30 | RewardIsAProxy, TextLoopAsRl, YourLoops |
| [karpathy/autoresearch @ 228791fb499afffb54b46200aca536f79142f117: train.py](https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/train.py) | 2026-10-30 | RewardIsAProxy, YourLoops |
| [autoresearch tree at 228791fb](https://github.com/karpathy/autoresearch/tree/228791fb499afffb54b46200aca536f79142f117) | 2026-10-30 | RewardIsAProxy, Sources appendix |
| [NVIDIA/dgx-spark-playbooks @ c035e0ac7d211509ec131b79b5b6f0f824a9e421: nvidia/playbook-unsloth/README.md](https://github.com/NVIDIA/dgx-spark-playbooks/blob/c035e0ac7d211509ec131b79b5b6f0f824a9e421/nvidia/playbook-unsloth/README.md) | 2026-10-30 | SideBySideLab |
| [NVIDIA/dgx-spark-playbooks @ c035e0ac7d211509ec131b79b5b6f0f824a9e421: nvidia/playbook-vlm-finetuning/assets/ui_image/src/train_image_vlm.py](https://github.com/NVIDIA/dgx-spark-playbooks/blob/c035e0ac7d211509ec131b79b5b6f0f824a9e421/nvidia/playbook-vlm-finetuning/assets/ui_image/src/train_image_vlm.py) | 2026-10-30 | SideBySideLab |
| [NVIDIA/dgx-spark-playbooks @ c035e0ac7d211509ec131b79b5b6f0f824a9e421: nvidia/playbook-vlm-finetuning/assets/ui_image/src/train.yaml](https://github.com/NVIDIA/dgx-spark-playbooks/blob/c035e0ac7d211509ec131b79b5b6f0f824a9e421/nvidia/playbook-vlm-finetuning/assets/ui_image/src/train.yaml) | 2026-10-30 | SideBySideLab |
| [NVIDIA/dgx-spark-playbooks @ c035e0ac7d211509ec131b79b5b6f0f824a9e421: nvidia/playbook-vlm-finetuning/README.md](https://github.com/NVIDIA/dgx-spark-playbooks/blob/c035e0ac7d211509ec131b79b5b6f0f824a9e421/nvidia/playbook-vlm-finetuning/README.md) | 2026-10-30 | SideBySideLab |
| [OpenRLHF/OpenRLHF @ v0.11.2: openrlhf/cli/train_ppo_ray.py](https://github.com/OpenRLHF/OpenRLHF/blob/v0.11.2/openrlhf/cli/train_ppo_ray.py) | 2026-10-30 | RlStepAsSystem |
| [OpenRLHF at v0.11.2](https://github.com/OpenRLHF/OpenRLHF/tree/v0.11.2) | 2026-10-30 | Sources appendix |
| [PrimeIntellect-ai/prime-rl @ v0.10.0: packages/prime-rl-configs/src/prime_rl/configs/orchestrator.py](https://github.com/PrimeIntellect-ai/prime-rl/blob/v0.10.0/packages/prime-rl-configs/src/prime_rl/configs/orchestrator.py) | 2026-10-30 | RlStepAsSystem |
| [PrimeIntellect-ai/prime-rl @ v0.10.0: pyproject.toml](https://github.com/PrimeIntellect-ai/prime-rl/blob/v0.10.0/pyproject.toml) | 2026-10-30 | RlStepAsSystem |
| [prime-rl at v0.10.0](https://github.com/PrimeIntellect-ai/prime-rl/tree/v0.10.0) | 2026-10-30 | Sources appendix |
| [stanfordnlp/dspy @ 3.4.1: dspy/teleprompt/gepa/gepa.py](https://github.com/stanfordnlp/dspy/blob/3.4.1/dspy/teleprompt/gepa/gepa.py) | 2026-10-30 | PromptOptimization |
| [stanfordnlp/dspy @ 3.4.1: dspy/teleprompt/grpo.py](https://github.com/stanfordnlp/dspy/blob/3.4.1/dspy/teleprompt/grpo.py) | 2026-10-30 | PromptOptimization |
| [stanfordnlp/dspy @ 3.4.1: dspy/teleprompt/mipro_optimizer_v2.py](https://github.com/stanfordnlp/dspy/blob/3.4.1/dspy/teleprompt/mipro_optimizer_v2.py) | 2026-10-30 | PromptOptimization |
| [DSPy at 3.4.1 (MIPROv2 and the GEPA integration)](https://github.com/stanfordnlp/dspy/tree/3.4.1) | 2026-10-30 | Sources appendix |
| [stanfordnlp/dspy @ 3.4.1: dspy/teleprompt](https://github.com/stanfordnlp/dspy/tree/3.4.1/dspy/teleprompt) | 2026-10-30 | PromptOptimization |
| [THUDM/slime @ v0.4.0: slime/utils/arguments.py](https://github.com/THUDM/slime/blob/v0.4.0/slime/utils/arguments.py) | 2026-10-30 | RlStepAsSystem |
| [THUDM/slime @ v0.4.0: train.py](https://github.com/THUDM/slime/blob/v0.4.0/train.py) | 2026-10-30 | RlStepAsSystem |
| [slime at v0.4.0](https://github.com/THUDM/slime/tree/v0.4.0) | 2026-10-30 | Sources appendix |
| [verl-project/verl-recipe @ e7f889574b8301cc0f0fc1d57c6d67f31ffeb689: dapo/README.md](https://github.com/verl-project/verl-recipe/blob/e7f889574b8301cc0f0fc1d57c6d67f31ffeb689/dapo/README.md) | 2026-10-30 | RlStepAsSystem |
| [vLLM at v0.28.0, the rollout engine in the E0 run](https://github.com/vllm-project/vllm/tree/v0.28.0) | 2026-10-30 | Sources appendix |
| [volcengine/verl @ v0.9.1: verl/experimental/agent_loop/agent_loop.py](https://github.com/volcengine/verl/blob/v0.9.1/verl/experimental/agent_loop/agent_loop.py) | 2026-10-30 | AgenticRl, WhereWordsFallShort |
| [volcengine/verl @ v0.9.1: verl/experimental/agent_loop/tool_agent_loop.py](https://github.com/volcengine/verl/blob/v0.9.1/verl/experimental/agent_loop/tool_agent_loop.py) | 2026-10-30 | AgenticRl |
| [volcengine/verl @ v0.9.1: verl/trainer/config/actor/actor.yaml](https://github.com/volcengine/verl/blob/v0.9.1/verl/trainer/config/actor/actor.yaml) | 2026-10-30 | RlvrAndGrpo |
| [volcengine/verl @ v0.9.1: verl/trainer/config/ppo_trainer.yaml](https://github.com/volcengine/verl/blob/v0.9.1/verl/trainer/config/ppo_trainer.yaml) | 2026-10-30 | RlStepAsSystem, RlvrAndGrpo |
| [volcengine/verl @ v0.9.1: verl/trainer/config/rollout/rollout.yaml](https://github.com/volcengine/verl/blob/v0.9.1/verl/trainer/config/rollout/rollout.yaml) | 2026-10-30 | RlStepAsSystem, RlvrAndGrpo |
| [volcengine/verl @ v0.9.1: verl/trainer/ppo/core_algos.py](https://github.com/volcengine/verl/blob/v0.9.1/verl/trainer/ppo/core_algos.py) | 2026-10-30 | AgenticRl, RlvrAndGrpo, WhereWordsFallShort |
| [volcengine/verl @ v0.9.1: verl/utils/tokenizer/continuous_token.py](https://github.com/volcengine/verl/blob/v0.9.1/verl/utils/tokenizer/continuous_token.py) | 2026-10-30 | AgenticRl |
| [verl at v0.9.1](https://github.com/volcengine/verl/tree/v0.9.1) | 2026-10-30 | Sources appendix |
| [Claude docs: Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) | 2026-10-30 | AccumulatingExperience, Sources appendix |
| [Claude docs: memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool) | 2026-10-30 | AccumulatingExperience, Sources appendix |
| [Anthropic docs: prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) | 2026-10-30 | Sources appendix, WhereWordsFallShort |
| [AWS Price List API, Nova 2 Lite RFT training hours](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/20261030160456/us-east-1/index.json) | 2026-10-30 | CostPerImprovement, RlOnAws |

## Tier 2: first-party lab and vendor posts and talks (their performance figures are claims)

14 sources.

| Source | Accessed | Cited in |
| --- | --- | --- |
| [GPT-4 Technical Report (OpenAI), Section 5 and Figure 8](https://arxiv.org/abs/2303.08774v6) | 2026-10-30 | WeightsVsContext |
| [Claude 3.7 Sonnet system card, Section 6](https://assets.anthropic.com/m/785e231869ea8b3b/original/claude-3-7-sonnet-system-card.pdf) | 2026-10-30 | RewardIsAProxy, Sources appendix |
| [AWS What's New, Bedrock RFT launch, 2025-12-03](https://aws.amazon.com/about-aws/whats-new/2025/12/bedrock-reinforcement-fine-tuning-66-base-models/) | 2026-10-30 | RlOnAws |
| [AWS What's New, AgentCore optimization preview, 2026-04-30](https://aws.amazon.com/about-aws/whats-new/2026/05/bedrock-agentcore-optimization-preview/) | 2026-10-30 | RlOnAws |
| [AWS What's New, AgentCore optimization GA, 2026-06-17](https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-bedrock-agentcore-new-optimization-capabilities/) | 2026-10-30 | RlOnAws |
| [AWS Machine Learning Blog, AgentCore episodic memory, performance evaluation](https://aws.amazon.com/blogs/machine-learning/build-agents-to-learn-from-experiences-using-amazon-bedrock-agentcore-episodic-memory/) | 2026-10-30 | RlOnAws |
| [AWS Machine Learning Blog, RFT on Bedrock best practices](https://aws.amazon.com/blogs/machine-learning/reinforcement-fine-tuning-on-amazon-bedrock-best-practices/) | 2026-10-30 | CostPerImprovement, RlOnAws, Sources appendix |
| [Huntley, Ralph (author's post)](https://ghuntley.com/ralph/) | 2026-10-30 | RewardIsAProxy, Sources appendix, TextLoopAsRl, YourLoops |
| [gepa-ai/gepa @ v0.1.4: README.md](https://github.com/gepa-ai/gepa/blob/v0.1.4/README.md) | 2026-10-30 | PromptOptimization |
| [karpathy/autoresearch @ 228791fb499afffb54b46200aca536f79142f117: README.md](https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/README.md) | 2026-10-30 | RewardIsAProxy, YourLoops |
| [Thinking Machines, LoRA Without Regret (lab blog)](https://thinkingmachines.ai/blog/lora/) | 2026-10-30 | Sources appendix, WhatRlDoes |
| [verl team, W&B run record DAPO-Qwen2.5-32B](https://wandb.ai/verl-org/DAPO%20Reproduction%20on%20verl/runs/0qjd0wap) | 2026-10-30 | CostPerImprovement, RlStepAsSystem |
| [Anthropic Engineering, Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) | 2026-10-30 | AccumulatingExperience, Sources appendix |
| [DeepSWE post, Sections 2.1 and 2.2](https://www.together.ai/blog/deepswe) | 2026-10-30 | AgenticRl, CostPerImprovement, Sources appendix |

## Tier 3: papers (venue or preprint shown) and third-party technical analysis

102 sources.

| Source | Venue | Accessed | Cited in |
| --- | --- | --- | --- |
| [Sutton and Barto, chapter 2](http://incompleteideas.net/book/RLbook2020.pdf) | textbook | 2026-10-30 | LanguageModelAsPolicy, PolicyGradient |
| [TRPO paper, Section 4](https://arxiv.org/abs/1502.05477v5) | ICML 2015 | 2026-10-30 | TwoLeashes |
| [GAE, Eq. 18](https://arxiv.org/abs/1506.02438v6) | ICLR 2016 | 2026-10-30 | LanguageModelAsPolicy, PolicyGradient, Sources appendix |
| [Christiano et al., Section 2.2.3](https://arxiv.org/abs/1706.03741v4) | NeurIPS 2017 | 2026-10-30 | PreferencesToRewards |
| [PPO paper, Section 3](https://arxiv.org/abs/1707.06347v2) | preprint | 2026-10-30 | Sources appendix, TwoLeashes |
| [Ziegler et al., section 2](https://arxiv.org/abs/1909.08593v2) | preprint | 2026-10-30 | LanguageModelAsPolicy |
| [Stiennon et al., section 3.4, footnote 8](https://arxiv.org/abs/2009.01325v3) | NeurIPS 2020 | 2026-10-30 | LanguageModelAsPolicy, RewardIsAProxy |
| [InstructGPT, Eq. 1](https://arxiv.org/abs/2203.02155v1) | NeurIPS 2022 | 2026-10-30 | LanguageModelAsPolicy, PreferencesToRewards, Sources appendix, TwoLeashes |
| [Snell et al., abstract](https://arxiv.org/abs/2209.15189v1) | preprint | 2026-10-30 | Choosing, Hybrids, WeightsVsContext |
| [Gao et al., Section 2](https://arxiv.org/abs/2210.10760v1) | ICML 2023 | 2026-10-30 | RewardIsAProxy, Sources appendix, TwoLeashes |
| [Algorithm Distillation, Abstract](https://arxiv.org/abs/2210.14215v1) | ICLR 2023 | 2026-10-30 | Sources appendix, WhereWordsFallShort |
| [von Oswald et al., Abstract](https://arxiv.org/abs/2212.07677v2) | ICML 2023 | 2026-10-30 | TextLoopAsRl |
| [Constitutional AI](https://arxiv.org/abs/2212.08073v1) | preprint | 2026-10-30 | PreferencesToRewards |
| [Reflexion, title](https://arxiv.org/abs/2303.11366v4) | NeurIPS 2023 | 2026-10-30 | AccumulatingExperience, GettingStarted, LanguageModelAsPolicy, RewardIsAProxy, Sources appendix, TextLoopAsRl, VerbalReinforcement |
| [Self-Refine, Table 1](https://arxiv.org/abs/2303.17651v2) | NeurIPS 2023 | 2026-10-30 | Sources appendix, TextLoopAsRl, VerbalReinforcement |
| [ProTeGi, Sections 2 and 3](https://arxiv.org/abs/2305.03495v2) | EMNLP 2023 | 2026-10-30 | PromptOptimization, TextLoopAsRl |
| [Voyager, Sections 2 and 4](https://arxiv.org/abs/2305.16291v2) | TMLR 2024 | 2026-10-30 | AccumulatingExperience, Sources appendix, TextLoopAsRl |
| [DPO paper, Section 4](https://arxiv.org/abs/2305.18290v3) | NeurIPS 2023 | 2026-10-30 | PreferencesToRewards, Sources appendix |
| [Let's Verify Step by Step, Sections 1 to 3 and Figure 3](https://arxiv.org/abs/2305.20050v1) | ICLR 2024 | 2026-10-30 | WhatRlDoes |
| [DPT, Abstract](https://arxiv.org/abs/2306.14892v1) | NeurIPS 2023 | 2026-10-30 | Sources appendix, WhereWordsFallShort |
| [Lost in the Middle, Abstract](https://arxiv.org/abs/2307.03172v3) | TACL 2024 | 2026-10-30 | Sources appendix, WhereWordsFallShort |
| [Retroformer, Figure 1](https://arxiv.org/abs/2308.02151v3) | ICLR 2024 | 2026-10-30 | Hybrids, Sources appendix, TextLoopAsRl, VerbalReinforcement |
| [ExpeL, Section 4.2](https://arxiv.org/abs/2308.10144v3) | AAAI 2024 | 2026-10-30 | AccumulatingExperience, Sources appendix, TextLoopAsRl, VerbalReinforcement |
| [Lee et al., abstract](https://arxiv.org/abs/2309.00267v3) | ICML 2024 | 2026-10-30 | PreferencesToRewards, Sources appendix |
| [OPRO, Table 1](https://arxiv.org/abs/2309.03409v3) | ICLR 2024 | 2026-10-30 | PromptOptimization, Sources appendix, TextLoopAsRl |
| [MTOB, abstract](https://arxiv.org/abs/2309.16575v2) | ICLR 2024 | 2026-10-30 | Hybrids |
| [Huang et al., Table 3](https://arxiv.org/abs/2310.01798v2) | ICLR 2024 | 2026-10-30 | Sources appendix, VerbalReinforcement |
| [Shen et al., Abstract](https://arxiv.org/abs/2310.08540v5) | ICML 2024, position paper | 2026-10-30 | TextLoopAsRl |
| [CLIN, Section 3.2](https://arxiv.org/abs/2310.10134v1) | COLM 2024 | 2026-10-30 | AccumulatingExperience, TextLoopAsRl |
| [Sclar et al., abstract](https://arxiv.org/abs/2310.11324v2) | ICLR 2024 | 2026-10-30 | Choosing, Sources appendix, WeightsVsContext |
| [IPO paper, Sections 1 and 4.2](https://arxiv.org/abs/2310.12036v2) | AISTATS 2024 | 2026-10-30 | PreferencesToRewards |
| [Ovadia et al., Table 2](https://arxiv.org/abs/2312.05934v3) | EMNLP 2024 | 2026-10-30 | Sources appendix, WeightsVsContext |
| [KTO paper, Section 1](https://arxiv.org/abs/2402.01306v5) | ICML 2024 | 2026-10-30 | PreferencesToRewards |
| [DeepSeekMath, Eq. 3](https://arxiv.org/abs/2402.03300v3) | preprint | 2026-10-30 | LanguageModelAsPolicy, PolicyGradient, PreferencesToRewards, RlStepAsSystem, RlvrAndGrpo, Sources appendix, TwoLeashes |
| [RLOO, Section 2.3](https://arxiv.org/abs/2402.14740v2) | ACL 2024 | 2026-10-30 | LanguageModelAsPolicy, PolicyGradient, PreferencesToRewards, RlStepAsSystem, RlvrAndGrpo, Sources appendix, TwoLeashes |
| [ORPO paper, abstract](https://arxiv.org/abs/2403.07691v2) | EMNLP 2024 | 2026-10-30 | PreferencesToRewards |
| [Krishnamurthy et al., Abstract](https://arxiv.org/abs/2403.15371v3) | NeurIPS 2024 | 2026-10-30 | Sources appendix, TextLoopAsRl, WhereWordsFallShort, YourLoops |
| [RULER, Table 3](https://arxiv.org/abs/2404.06654v3) | COLM 2024 | 2026-10-30 | Sources appendix, WhereWordsFallShort |
| [Xu et al., abstract](https://arxiv.org/abs/2404.10719v3) | ICML 2024 | 2026-10-30 | PreferencesToRewards |
| [Zhang et al., abstract](https://arxiv.org/abs/2404.10859v2) | COLM 2024 | 2026-10-30 | WeightsVsContext |
| [Revisiting OPRO, abstract](https://arxiv.org/abs/2405.10276v2) | ACL Findings 2024 | 2026-10-30 | PromptOptimization |
| [OpenRLHF, Section 1](https://arxiv.org/abs/2405.11143v6) | EMNLP 2025 System Demonstrations | 2026-10-30 | RlStepAsSystem, Sources appendix |
| [SimPO paper, abstract and Section 2.2](https://arxiv.org/abs/2405.14734v3) | NeurIPS 2024 | 2026-10-30 | PreferencesToRewards |
| [Kamoi et al., Section 4 and Table 4](https://arxiv.org/abs/2406.01297v3) | TACL 2024 | 2026-10-30 | VerbalReinforcement |
| [TextGrad (arXiv v1), Section 2](https://arxiv.org/abs/2406.07496v1) | Nature 2025 | 2026-10-30 | PromptOptimization, Sources appendix, TextLoopAsRl |
| [Ivison et al., Table 2](https://arxiv.org/abs/2406.09279v2) | NeurIPS 2024 | 2026-10-30 | LanguageModelAsPolicy, PreferencesToRewards, RlStepAsSystem, Sources appendix |
| [MIPRO, Section 3](https://arxiv.org/abs/2406.11695v2) | EMNLP 2024 | 2026-10-30 | PromptOptimization, Sources appendix, TextLoopAsRl |
| [BetterTogether, abstract](https://arxiv.org/abs/2407.10930v2) | EMNLP 2024 | 2026-10-30 | Hybrids |
| [Llama 3 report, Section 4.1.4](https://arxiv.org/abs/2407.21783v3) | preprint | 2026-10-30 | PreferencesToRewards, Sources appendix |
| [Kumar et al., Training Language Models to Self-Correct via Reinforcement Learning (SCoRe), arXiv 2409.12917v2, ICLR 2025](https://arxiv.org/abs/2409.12917v2) | ICLR 2025 | 2026-10-30 | Sources appendix, VerbalReinforcement |
| [HybridFlow, Section 2.1](https://arxiv.org/abs/2409.19256v2) | EuroSys 2025 | 2026-10-30 | RlStepAsSystem, Sources appendix |
| [EVOLvE, abstract and Section 4](https://arxiv.org/abs/2410.06238v2) | ICML 2025 | 2026-10-30 | Hybrids |
| [REINFORCE++, abstract](https://arxiv.org/abs/2501.03262v9) | preprint | 2026-10-30 | RlvrAndGrpo |
| [DeepSeek-R1 v1, Section 2.2.4](https://arxiv.org/abs/2501.12948v1) | preprint | 2026-10-30 | RlvrAndGrpo |
| [DeepSeek-R1, Section 1](https://arxiv.org/abs/2501.12948v2) | Nature 2025 | 2026-10-30 | Choosing, CostPerImprovement, RlStepAsSystem, RlvrAndGrpo, Sources appendix, WeightsVsContext, WhatRlDoes |
| [Should You Use Your LLM to Explore or Exploit?, Section 2](https://arxiv.org/abs/2502.00225v4) | UAI 2026 | 2026-10-30 | Sources appendix, WhereWordsFallShort |
| [SWE-RL, Section 2.1](https://arxiv.org/abs/2502.18449v2) | NeurIPS 2025 | 2026-10-30 | AgenticRl, Sources appendix |
| [Search-R1, Table 4](https://arxiv.org/abs/2503.09516v5) | COLM 2025 | 2026-10-30 | AgenticRl, Sources appendix |
| [Baker et al., Table 1](https://arxiv.org/abs/2503.11926v1) | preprint | 2026-10-30 | RewardIsAProxy, Sources appendix |
| [DAPO, Table 1](https://arxiv.org/abs/2503.14476v2) | NeurIPS 2025 | 2026-10-30 | Choosing, RlvrAndGrpo, Sources appendix |
| [Gemma 3 report, Section 3](https://arxiv.org/abs/2503.19786v1) | preprint | 2026-10-30 | PreferencesToRewards |
| [Dr. GRPO, Section 1](https://arxiv.org/abs/2503.20783v2) | COLM 2025 | 2026-10-30 | CostPerImprovement, RlvrAndGrpo, Sources appendix |
| [Dynamic Cheatsheet, Sections 2 and 5](https://arxiv.org/abs/2504.07952v1) | EACL 2026 | 2026-10-30 | AccumulatingExperience, CostPerImprovement, Sources appendix, TextLoopAsRl |
| [ReTool, abstract](https://arxiv.org/abs/2504.11536v2) | ICLR 2026 | 2026-10-30 | AccumulatingExperience, AgenticRl, Sources appendix |
| [Yue et al., abstract](https://arxiv.org/abs/2504.13837v5) | NeurIPS 2025 | 2026-10-30 | LanguageModelAsPolicy, Sources appendix, WeightsVsContext, WhatRlDoes |
| [Schmied et al., Sections 1 and 4.3](https://arxiv.org/abs/2504.16078v1) | ICLR 2026 | 2026-10-30 | Hybrids, Sources appendix, WhereWordsFallShort |
| [RAGEN, Sections 4.1 and 4.2](https://arxiv.org/abs/2504.20073v2) | preprint | 2026-10-30 | AgenticRl, Sources appendix |
| [Which Agent Causes Task Failures and When?, Section 4.4](https://arxiv.org/abs/2505.00212v3) | ICML 2025 | 2026-10-30 | Sources appendix, WhereWordsFallShort |
| [TRAIL (Trace Reasoning and Agentic Issue Localization), Table 1](https://arxiv.org/abs/2505.08638v3) | preprint | 2026-10-30 | WhereWordsFallShort |
| [Qwen3 report, Section 4.2](https://arxiv.org/abs/2505.09388v1) | preprint | 2026-10-30 | PreferencesToRewards |
| [RL Finetunes Small Subnetworks, Table 6](https://arxiv.org/abs/2505.11711v2) | NeurIPS 2025 | 2026-10-30 | WhatRlDoes |
| [Skywork-OR1, Table 5](https://arxiv.org/abs/2505.22312v2) | preprint | 2026-10-30 | RlStepAsSystem, Sources appendix |
| [The Entropy Mechanism of RL for Reasoning, Sections 2.3 and 2.4](https://arxiv.org/abs/2505.22617v1) | preprint | 2026-10-30 | WhatRlDoes |
| [AReaL, Section 1](https://arxiv.org/abs/2505.24298v5) | NeurIPS 2025 | 2026-10-30 | RlStepAsSystem, Sources appendix |
| [ProRL, Sections 1 and 3.2](https://arxiv.org/abs/2505.24864v1) | NeurIPS 2025 | 2026-10-30 | CostPerImprovement, Sources appendix |
| [Spurious Rewards, abstract](https://arxiv.org/abs/2506.10947v2) | ICML 2026 | 2026-10-30 | RlvrAndGrpo, Sources appendix, WhatRlDoes |
| [AlphaEvolve, Table 1](https://arxiv.org/abs/2506.13131v1) | preprint | 2026-10-30 | Choosing, Sources appendix, TextLoopAsRl, YourLoops |
| [Guru cross-domain RL study, Section 4.3](https://arxiv.org/abs/2506.14965v1) | NeurIPS 2025 Datasets and Benchmarks | 2026-10-30 | WhatRlDoes |
| [Reasoning or Memorization, abstract](https://arxiv.org/abs/2507.10532v3) | AAAI 2026 | 2026-10-30 | WhatRlDoes |
| [The Invisible Leash, Section 3.2](https://arxiv.org/abs/2507.14843v5) | preprint | 2026-10-30 | WhatRlDoes |
| [GSPO, Sections 5.1 to 5.3](https://arxiv.org/abs/2507.18071v2) | preprint | 2026-10-30 | RlvrAndGrpo, Sources appendix |
| [GEPA, Table 1](https://arxiv.org/abs/2507.19457v2) | ICLR 2026 | 2026-10-30 | Choosing, CostPerImprovement, PromptOptimization, SideBySideLab, Sources appendix, TextLoopAsRl |
| [Kimi K2 report, Section 3.2.1](https://arxiv.org/abs/2507.20534v2) | preprint | 2026-10-30 | AgenticRl, Sources appendix |
| [Memento, Section 3](https://arxiv.org/abs/2508.16153v2) | preprint | 2026-10-30 | AccumulatingExperience, Hybrids, TextLoopAsRl |
| [RL's Razor, abstract](https://arxiv.org/abs/2509.04259v1) | ICLR 2026 | 2026-10-30 | PolicyGradient, Sources appendix, WeightsVsContext, WhatRlDoes |
| [PipelineRL, Section 3](https://arxiv.org/abs/2509.19128v2) | TMLR 2026 | 2026-10-30 | RlStepAsSystem, Sources appendix |
| [From f(x) and g(x) to f(g(x)), Figure 5](https://arxiv.org/abs/2509.25123v3) | ICLR 2026 | 2026-10-30 | WhatRlDoes |
| [ReasoningBank, Section 3.2](https://arxiv.org/abs/2509.25140v2) | ICLR 2026 | 2026-10-30 | AccumulatingExperience, Sources appendix, TextLoopAsRl, VerbalReinforcement |
| [Advisor Models, Section 4.4.3](https://arxiv.org/abs/2510.02453v3) | ICML 2026 | 2026-10-30 | Choosing, Hybrids, PromptOptimization, Sources appendix, TextLoopAsRl |
| [ACE, Section 4.7](https://arxiv.org/abs/2510.04618v3) | ICLR 2026 | 2026-10-30 | AccumulatingExperience, CostPerImprovement, Sources appendix, TextLoopAsRl |
| [Training-Free GRPO, Table 3](https://arxiv.org/abs/2510.08191v1) | preprint | 2026-10-30 | AccumulatingExperience, CostPerImprovement, GettingStarted, Sources appendix, TextLoopAsRl, VerbalReinforcement |
| [Reasoning with Sampling, Section 5.3](https://arxiv.org/abs/2510.14901v1) | ICLR 2026 | 2026-10-30 | Choosing, CostPerImprovement, OneLoop, Sources appendix, WhatRlDoes |
| [ImpossibleBench, Section 1](https://arxiv.org/abs/2510.20270v1) | ICLR 2026 | 2026-10-30 | RewardIsAProxy, Sources appendix |
| [The Path Not Taken, abstract and Section 2.3](https://arxiv.org/abs/2511.08567v1) | preprint | 2026-10-30 | WhatRlDoes |
| [MacDiarmid et al., abstract](https://arxiv.org/abs/2511.18397v1) | preprint | 2026-10-30 | RewardIsAProxy, Sources appendix |
| [Interplay of pre-training, mid-training and RL, abstract and Section 2.4](https://arxiv.org/abs/2512.07783v1) | ICML 2026 | 2026-10-30 | WhatRlDoes |
| [Adaptation of Agentic AI, Section 1](https://arxiv.org/abs/2512.16301v3) | preprint | 2026-10-30 | OneLoop, TextLoopAsRl |
| [Pass@(k,T), abstract](https://arxiv.org/abs/2604.14877v1) | preprint | 2026-10-30 | AgenticRl, Sources appendix, WhatRlDoes |
| [Curriculum RL beyond the base model, abstract and Section 4.1](https://arxiv.org/abs/2606.22317v1) | preprint | 2026-10-30 | WhatRlDoes |
| [Revisiting scaling laws for reward optimization, abstract and Sections 5.2 and 5.3](https://arxiv.org/abs/2609.38526v1) | preprint | 2026-10-30 | RewardIsAProxy |
| [Compact-Bench, Abstract](https://arxiv.org/abs/2610.31710v2) | preprint | 2026-10-30 | WhereWordsFallShort |
| [FunSearch, main text](https://www.nature.com/articles/s41586-023-06924-6) | Nature 2023 | 2026-10-30 | Sources appendix, TextLoopAsRl, YourLoops |
