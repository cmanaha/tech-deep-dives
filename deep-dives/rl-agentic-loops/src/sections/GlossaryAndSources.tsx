import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import { Glossary, GlossaryEntry, SourcesAppendix, Source } from '@tech-deep-dives/shared';
import { Cite, E0_URL, researchUrl } from '../components/Cite';

// Source tiers (RESEARCH-GUIDE.md section 1):
//  0 = our own experiments (listed in the first panel, not in the shared appendix table)
//  1 = source code at a pinned ref, official framework docs, first-party AWS docs and pricing
//  2 = first-party lab and vendor posts and talks (their numbers stay claims)
//  3 = papers (venue or preprint marked) and third-party technical analysis
// All access dates 2026-10-30. The full per-file citation list is generated into sources.md from
// the inline Cite components; this array is the curated reading list, grouped by tier.

const sources: Source[] = [
  // Tier 1: framework code at the pinned refs
  { id: 1, title: 'Hugging Face TRL at v1.16.0: GRPO trainer (grpo_trainer.py)', url: 'https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py', tier: 1, type: 'source-code', accessDate: '2026-10-30' },
  { id: 2, title: 'Hugging Face TRL at v1.16.0: GRPO configuration and defaults (grpo_config.py)', url: 'https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py', tier: 1, type: 'source-code', accessDate: '2026-10-30' },
  { id: 3, title: 'Hugging Face TRL at v1.12.0: PPO trainer, the last tag that ships it', url: 'https://github.com/huggingface/trl/blob/v1.12.0/trl/trainer/ppo_trainer.py', tier: 1, type: 'source-code', accessDate: '2026-10-30' },
  { id: 4, title: 'verl at v0.9.1', url: 'https://github.com/volcengine/verl/tree/v0.9.1', tier: 1, type: 'source-code', accessDate: '2026-10-30' },
  { id: 5, title: 'OpenRLHF at v0.11.2', url: 'https://github.com/OpenRLHF/OpenRLHF/tree/v0.11.2', tier: 1, type: 'source-code', accessDate: '2026-10-30' },
  { id: 6, title: 'slime at v0.4.0', url: 'https://github.com/THUDM/slime/tree/v0.4.0', tier: 1, type: 'source-code', accessDate: '2026-10-30' },
  { id: 7, title: 'prime-rl at v0.10.0', url: 'https://github.com/PrimeIntellect-ai/prime-rl/tree/v0.10.0', tier: 1, type: 'source-code', accessDate: '2026-10-30' },
  { id: 8, title: 'vLLM at v0.28.0, the rollout engine in the E0 run', url: 'https://github.com/vllm-project/vllm/tree/v0.28.0', tier: 1, type: 'source-code', accessDate: '2026-10-30' },
  { id: 9, title: 'DSPy at 3.4.1 (MIPROv2 and the GEPA integration)', url: 'https://github.com/stanfordnlp/dspy/tree/3.4.1', tier: 1, type: 'source-code', accessDate: '2026-10-30' },
  { id: 10, title: 'gepa at v0.1.4, the version DSPy 3.4.1 pins', url: 'https://github.com/gepa-ai/gepa/tree/v0.1.4', tier: 1, type: 'source-code', accessDate: '2026-10-30' },
  { id: 11, title: 'karpathy/autoresearch at commit 228791f (program.md, train.py, prepare.py)', url: 'https://github.com/karpathy/autoresearch/tree/228791fb499afffb54b46200aca536f79142f117', tier: 1, type: 'source-code', accessDate: '2026-10-30' },
  { id: 12, title: 'SageMaker HyperPod recipes at commit a6030c3 (release 2.0.11): verl GRPO and Nova RFT recipes', url: 'https://github.com/aws/sagemaker-hyperpod-recipes/tree/a6030c319908c8a1b74cb619b00476f8e6baa04f', tier: 1, type: 'aws-open-source', accessDate: '2026-10-30' },
  // Tier 1: first-party AWS documentation and pricing
  { id: 13, title: 'Amazon Bedrock user guide: reinforcement fine-tuning', url: 'https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html', tier: 1, type: 'official-docs', accessDate: '2026-10-30' },
  { id: 14, title: 'Amazon Bedrock user guide: submit and monitor an RFT job', url: 'https://docs.aws.amazon.com/bedrock/latest/userguide/rft-submit-job.html', tier: 1, type: 'official-docs', accessDate: '2026-10-30' },
  { id: 15, title: 'Amazon Bedrock pricing (reinforcement fine-tuning per training hour)', url: 'https://aws.amazon.com/bedrock/pricing/', tier: 1, type: 'product-page', accessDate: '2026-10-30' },
  { id: 16, title: 'Amazon Bedrock user guide: prompt caching', url: 'https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html', tier: 1, type: 'official-docs', accessDate: '2026-10-30' },
  { id: 17, title: 'Amazon Bedrock user guide: how Advanced Prompt Optimization works', url: 'https://docs.aws.amazon.com/bedrock/latest/userguide/advanced-prompt-optimization-how.html', tier: 1, type: 'official-docs', accessDate: '2026-10-30' },
  { id: 18, title: 'Amazon SageMaker AI: model customisation overview', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models.html', tier: 1, type: 'official-docs', accessDate: '2026-10-30' },
  { id: 19, title: 'Amazon SageMaker AI: multi-turn RL agent integration', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl-agent.html', tier: 1, type: 'official-docs', accessDate: '2026-10-30' },
  { id: 20, title: 'Amazon SageMaker AI: training sessions', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models-training-sessions.html', tier: 1, type: 'official-docs', accessDate: '2026-10-30' },
  { id: 21, title: 'Amazon Bedrock AgentCore: episodic memory strategy', url: 'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/episodic-memory-strategy.html', tier: 1, type: 'official-docs', accessDate: '2026-10-30' },
  { id: 22, title: 'Amazon Bedrock AgentCore: optimization', url: 'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization.html', tier: 1, type: 'official-docs', accessDate: '2026-10-30' },
  // Tier 1: first-party documentation from model providers
  { id: 23, title: 'Claude documentation: prompt caching', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching', tier: 1, type: 'official-docs', accessDate: '2026-10-30' },
  { id: 24, title: 'Claude documentation: memory tool', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool', tier: 1, type: 'official-docs', accessDate: '2026-10-30' },
  { id: 25, title: 'Claude documentation: Agent Skills overview', url: 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview', tier: 1, type: 'official-docs', accessDate: '2026-10-30' },
  // Tier 2: first-party lab and vendor posts (their numbers stay claims)
  { id: 26, title: 'Thinking Machines, LoRA Without Regret (lab blog)', url: 'https://thinkingmachines.ai/blog/lora/', tier: 2, type: 'blog', accessDate: '2026-10-30' },
  { id: 27, title: 'Agentica and Together AI, DeepSWE (vendor post)', url: 'https://www.together.ai/blog/deepswe', tier: 2, type: 'blog', accessDate: '2026-10-30' },
  { id: 28, title: 'Huntley, Ralph Wiggum as a software engineer (practitioner post)', url: 'https://ghuntley.com/ralph/', tier: 2, type: 'blog', accessDate: '2026-10-30' },
  { id: 29, title: 'Anthropic, Claude 3.7 Sonnet system card', url: 'https://assets.anthropic.com/m/785e231869ea8b3b/original/claude-3-7-sonnet-system-card.pdf', tier: 2, type: 'whitepaper', accessDate: '2026-10-30' },
  { id: 30, title: 'Anthropic Engineering, Equipping agents for the real world with Agent Skills', url: 'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills', tier: 2, type: 'blog', accessDate: '2026-10-30' },
  { id: 31, title: 'AWS Machine Learning Blog, Reinforcement fine-tuning on Amazon Bedrock: best practices', url: 'https://aws.amazon.com/blogs/machine-learning/reinforcement-fine-tuning-on-amazon-bedrock-best-practices/', tier: 2, type: 'aws-blog', accessDate: '2026-10-30' },
  // Tier 3: RL foundations
  { id: 32, title: 'Schulman et al., Proximal Policy Optimization Algorithms, arXiv 1707.06347v2, preprint', url: 'https://arxiv.org/abs/1707.06347v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 33, title: 'Schulman et al., High-Dimensional Continuous Control Using Generalized Advantage Estimation, arXiv 1506.02438v6, ICLR 2016', url: 'https://arxiv.org/abs/1506.02438v6', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 34, title: 'Ouyang et al., Training language models to follow instructions with human feedback (InstructGPT), arXiv 2203.02155v1, NeurIPS 2022', url: 'https://arxiv.org/abs/2203.02155v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 35, title: 'Rafailov et al., Direct Preference Optimization: Your Language Model is Secretly a Reward Model, arXiv 2305.18290v3, NeurIPS 2023', url: 'https://arxiv.org/abs/2305.18290v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 36, title: 'Lee et al., RLAIF vs. RLHF: Scaling Reinforcement Learning from Human Feedback with AI Feedback, arXiv 2309.00267v3, ICML 2024', url: 'https://arxiv.org/abs/2309.00267v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 37, title: 'Ivison et al., Unpacking DPO and PPO: Disentangling Best Practices for Learning from Preference Feedback, arXiv 2406.09279v2, NeurIPS 2024', url: 'https://arxiv.org/abs/2406.09279v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 38, title: 'Llama Team, The Llama 3 Herd of Models, arXiv 2407.21783v3, preprint', url: 'https://arxiv.org/abs/2407.21783v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 39, title: 'Gao et al., Scaling Laws for Reward Model Overoptimization, arXiv 2210.10760v1, ICML 2023', url: 'https://arxiv.org/abs/2210.10760v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  // Tier 3: RL with verifiable rewards and what it does to a model
  { id: 40, title: 'Shao et al., DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (GRPO), arXiv 2402.03300v3, preprint', url: 'https://arxiv.org/abs/2402.03300v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 41, title: 'DeepSeek-AI, DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning, arXiv 2501.12948v2, Nature 2025', url: 'https://arxiv.org/abs/2501.12948v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 42, title: 'Yu et al., DAPO: An Open-Source LLM Reinforcement Learning System at Scale, arXiv 2503.14476v2, preprint', url: 'https://arxiv.org/abs/2503.14476v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 43, title: 'Liu et al., Understanding R1-Zero-Like Training: A Critical Perspective (Dr. GRPO), arXiv 2503.20783v2, COLM 2025', url: 'https://arxiv.org/abs/2503.20783v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 44, title: 'Zheng et al., Group Sequence Policy Optimization, arXiv 2507.18071v2, preprint', url: 'https://arxiv.org/abs/2507.18071v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 45, title: 'Ahmadian et al., Back to Basics: Revisiting REINFORCE Style Optimization for Learning from Human Feedback in LLMs (RLOO), arXiv 2402.14740v2, ACL 2024', url: 'https://arxiv.org/abs/2402.14740v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 46, title: 'Yue et al., Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model?, arXiv 2504.13837v5, NeurIPS 2025', url: 'https://arxiv.org/abs/2504.13837v5', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 47, title: 'Shenfeld et al., RL\'s Razor: Why Online Reinforcement Learning Forgets Less, arXiv 2509.04259v1, ICLR 2026', url: 'https://arxiv.org/abs/2509.04259v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 48, title: 'Karan et al., Reasoning with Sampling: Your Base Model is Smarter Than You Think, arXiv 2510.14901v1, preprint', url: 'https://arxiv.org/abs/2510.14901v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 49, title: 'Shao et al., Spurious Rewards: Rethinking Training Signals in RLVR, arXiv 2506.10947v2, ICML 2026', url: 'https://arxiv.org/abs/2506.10947v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 50, title: 'Liu et al., ProRL: Prolonged Reinforcement Learning Expands Reasoning Boundaries in Large Language Models, arXiv 2505.24864v1, preprint', url: 'https://arxiv.org/abs/2505.24864v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  // Tier 3: agentic RL and reward hacking
  { id: 51, title: 'Jin et al., Search-R1 (RL training of LLMs to reason with a search engine), arXiv 2503.09516v5, COLM 2025', url: 'https://arxiv.org/abs/2503.09516v5', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 52, title: 'Feng et al., ReTool: Reinforcement Learning for Strategic Tool Use in LLMs, arXiv 2504.11536v2, preprint', url: 'https://arxiv.org/abs/2504.11536v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 53, title: 'Wei et al., SWE-RL: Advancing LLM Reasoning via Reinforcement Learning on Open Software Evolution, arXiv 2502.18449v2, NeurIPS 2025', url: 'https://arxiv.org/abs/2502.18449v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 54, title: 'Wang et al., RAGEN: Understanding Self-Evolution in LLM Agents via Multi-Turn Reinforcement Learning, arXiv 2504.20073v2, preprint', url: 'https://arxiv.org/abs/2504.20073v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 55, title: 'Kimi Team, Kimi K2: Open Agentic Intelligence, arXiv 2507.20534v2, preprint', url: 'https://arxiv.org/abs/2507.20534v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 56, title: 'Zhai et al., Does RL Expand the Capability Boundary of LLM Agents? A PASS@(k,T) Analysis, arXiv 2604.14877v1, preprint', url: 'https://arxiv.org/abs/2604.14877v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 57, title: 'Baker et al., Monitoring Reasoning Models for Misbehavior and the Risks of Promoting Obfuscation, arXiv 2503.11926v1, preprint', url: 'https://arxiv.org/abs/2503.11926v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 58, title: 'MacDiarmid et al., Natural Emergent Misalignment from Reward Hacking in Production RL, arXiv 2511.18397v1, preprint', url: 'https://arxiv.org/abs/2511.18397v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 59, title: 'Zhong et al., ImpossibleBench: Measuring LLMs\' Propensity of Exploiting Test Cases, arXiv 2510.20270v1, preprint', url: 'https://arxiv.org/abs/2510.20270v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  // Tier 3: learning in words
  { id: 60, title: 'Shinn et al., Reflexion: Language Agents with Verbal Reinforcement Learning, arXiv 2303.11366v4, NeurIPS 2023', url: 'https://arxiv.org/abs/2303.11366v4', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 61, title: 'Madaan et al., Self-Refine: Iterative Refinement with Self-Feedback, arXiv 2303.17651v2, NeurIPS 2023', url: 'https://arxiv.org/abs/2303.17651v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 62, title: 'Huang et al., Large Language Models Cannot Self-Correct Reasoning Yet, arXiv 2310.01798v2, ICLR 2024', url: 'https://arxiv.org/abs/2310.01798v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 63, title: 'Kumar et al., Training Language Models to Self-Correct via Reinforcement Learning (SCoRe), arXiv 2409.12917v2, preprint', url: 'https://arxiv.org/abs/2409.12917v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 64, title: 'Zhao et al., ExpeL: LLM Agents Are Experiential Learners, arXiv 2308.10144v3, AAAI 2024', url: 'https://arxiv.org/abs/2308.10144v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 65, title: 'Wang et al., Voyager: An Open-Ended Embodied Agent with Large Language Models, arXiv 2305.16291v2, TMLR', url: 'https://arxiv.org/abs/2305.16291v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 66, title: 'Ouyang et al., ReasoningBank: Scaling Agent Self-Evolving with Reasoning Memory, arXiv 2509.25140v2, ICLR 2026', url: 'https://arxiv.org/abs/2509.25140v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 67, title: 'Suzgun et al., Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory, arXiv 2504.07952v1, EACL 2026', url: 'https://arxiv.org/abs/2504.07952v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 68, title: 'Zhang et al., Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (ACE), arXiv 2510.04618v3, ICLR 2026', url: 'https://arxiv.org/abs/2510.04618v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 69, title: 'Cai et al., Training-Free Group Relative Policy Optimization, arXiv 2510.08191v1, preprint', url: 'https://arxiv.org/abs/2510.08191v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 70, title: 'Yuksekgonul et al., TextGrad: Automatic "Differentiation" via Text (journal version in Nature), arXiv 2406.07496v1, Nature 2025', url: 'https://arxiv.org/abs/2406.07496v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 71, title: 'Yang et al., Large Language Models as Optimizers (OPRO), arXiv 2309.03409v3, ICLR 2024', url: 'https://arxiv.org/abs/2309.03409v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 72, title: 'Opsahl-Ong et al., Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (MIPRO), arXiv 2406.11695v2, EMNLP 2024', url: 'https://arxiv.org/abs/2406.11695v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 73, title: 'Agrawal et al., GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning, arXiv 2507.19457v2, ICLR 2026', url: 'https://arxiv.org/abs/2507.19457v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 74, title: 'Yao et al., Retroformer: Retrospective Large Language Agents with Policy Gradient Optimization, arXiv 2308.02151v3, ICLR 2024', url: 'https://arxiv.org/abs/2308.02151v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 75, title: 'Asawa et al., How to Train Your Advisor: Steering Black-Box LLMs with Advisor Models, arXiv 2510.02453v3, ICML 2026', url: 'https://arxiv.org/abs/2510.02453v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 76, title: 'Novikov et al., AlphaEvolve: A coding agent for scientific and algorithmic discovery, arXiv 2506.13131v1, preprint', url: 'https://arxiv.org/abs/2506.13131v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 77, title: 'Romera-Paredes et al., Mathematical discoveries from program search with large language models (FunSearch), Nature 2023', url: 'https://www.nature.com/articles/s41586-023-06924-6', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  // Tier 3: limits of in-context learning and the context
  { id: 78, title: 'Laskin et al., In-context Reinforcement Learning with Algorithm Distillation, arXiv 2210.14215v1, ICLR 2023', url: 'https://arxiv.org/abs/2210.14215v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 79, title: 'Lee et al., Supervised Pretraining Can Learn In-Context Reinforcement Learning (DPT), arXiv 2306.14892v1, NeurIPS 2023', url: 'https://arxiv.org/abs/2306.14892v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 80, title: 'Krishnamurthy et al., Can large language models explore in-context?, arXiv 2403.15371v3, NeurIPS 2024', url: 'https://arxiv.org/abs/2403.15371v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 81, title: 'Schmied et al., LLMs are Greedy Agents: Effects of RL Fine-tuning on Decision-Making Abilities, arXiv 2504.16078v1, preprint', url: 'https://arxiv.org/abs/2504.16078v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 82, title: 'Harris et al., Should You Use Your Large Language Model to Explore or Exploit?, arXiv 2502.00225v4, UAI 2026', url: 'https://arxiv.org/abs/2502.00225v4', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 83, title: 'Zhang et al., Which Agent Causes Task Failures and When? On Automated Failure Attribution of LLM Multi-Agent Systems, arXiv 2505.00212v3, ICML 2025', url: 'https://arxiv.org/abs/2505.00212v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 84, title: 'Hsieh et al., RULER: What\'s the Real Context Size of Your Long-Context Language Models?, arXiv 2404.06654v3, COLM 2024', url: 'https://arxiv.org/abs/2404.06654v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 85, title: 'Liu et al., Lost in the Middle: How Language Models Use Long Contexts, arXiv 2307.03172v3, TACL 2023', url: 'https://arxiv.org/abs/2307.03172v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 86, title: 'Ovadia et al., Fine-Tuning or Retrieval? Comparing Knowledge Injection in LLMs, arXiv 2312.05934v3, EMNLP 2024', url: 'https://arxiv.org/abs/2312.05934v3', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 87, title: 'Sclar et al., Quantifying Language Models\' Sensitivity to Spurious Features in Prompt Design, arXiv 2310.11324v2, ICLR 2024', url: 'https://arxiv.org/abs/2310.11324v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  // Tier 3: RL systems
  { id: 88, title: 'Sheng et al., HybridFlow: A Flexible and Efficient RLHF Framework (verl), arXiv 2409.19256v2, EuroSys 2025', url: 'https://arxiv.org/abs/2409.19256v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 89, title: 'Hu et al., OpenRLHF: An Easy-to-use, Scalable and High-performance RLHF Framework, arXiv 2405.11143v6, preprint', url: 'https://arxiv.org/abs/2405.11143v6', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 90, title: 'Fu et al., AReaL: A Large-Scale Asynchronous Reinforcement Learning System for Language Reasoning, arXiv 2505.24298v5, NeurIPS 2025', url: 'https://arxiv.org/abs/2505.24298v5', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 91, title: 'Piché et al., PipelineRL: Faster On-policy Reinforcement Learning for Long Sequence Generation, arXiv 2509.19128v2, preprint', url: 'https://arxiv.org/abs/2509.19128v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 92, title: 'He et al., Skywork Open Reasoner 1 Technical Report, arXiv 2505.22312v2, preprint', url: 'https://arxiv.org/abs/2505.22312v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
];


const glossary: GlossaryEntry[] = [
  // RL vocabulary and algorithms
  { acronym: 'RL', fullForm: 'Reinforcement learning', description: 'Learning from a reward on the model\'s own attempts. In this dive, RL means the update lands in the weights.' },
  { acronym: 'RLHF', fullForm: 'RL from human feedback', description: 'RL against a reward model trained on human preference comparisons between responses.' },
  { acronym: 'RLAIF', fullForm: 'RL from AI feedback', description: 'RLHF with an AI model producing the preference labels in place of people.' },
  { acronym: 'd-RLAIF', fullForm: 'Direct RLAIF', description: 'The AI labeller scores responses during RL itself, with no separate reward model trained first.' },
  { acronym: 'RLVR', fullForm: 'RL with verifiable rewards', description: 'RL where a program computes the reward: a unit test, an answer check, a compiler.' },
  { acronym: 'RFT', fullForm: 'Reinforcement fine-tuning', description: 'The product name AWS and OpenAI use for managed RL on a hosted model.' },
  { acronym: 'MTRL', fullForm: 'Multi-turn RL', description: 'SageMaker AI\'s managed RL in which the customer\'s agent runs each episode and reports its reward.' },
  { acronym: 'SFT', fullForm: 'Supervised fine-tuning', description: 'Training on fixed input-output examples with the next-token loss.' },
  { acronym: 'PPO', fullForm: 'Proximal Policy Optimization', description: 'Policy-gradient algorithm that clips each update\'s probability ratio and uses a learned critic. The classic RLHF optimiser.' },
  { acronym: 'PPO-ptx', fullForm: 'PPO with pretraining mix', description: 'InstructGPT\'s PPO variant, which mixes pretraining gradients into the update to limit regressions.' },
  { acronym: 'TRPO', fullForm: 'Trust Region Policy Optimization', description: 'PPO\'s predecessor, which bounds each update by a KL constraint.' },
  { acronym: 'GAE', fullForm: 'Generalized Advantage Estimation', description: 'Blends the critic\'s value estimates with observed returns, weighted by a parameter lambda.' },
  { acronym: 'GRPO', fullForm: 'Group Relative Policy Optimization', description: 'Samples a group of answers per prompt and scores each against the group\'s mean, so no critic is trained.' },
  { acronym: 'Dr. GRPO', fullForm: 'GRPO Done Right', description: 'GRPO without the per-response length normalisation and the per-group standard-deviation scaling.' },
  { acronym: 'DAPO', fullForm: 'Decoupled Clip and Dynamic sAmpling Policy Optimization', description: 'A GRPO successor with separate upper and lower clip bounds and filtering of groups whose samples all score the same.' },
  { acronym: 'GSPO', fullForm: 'Group Sequence Policy Optimization', description: 'Computes the probability ratio and the clip per sequence rather than per token.' },
  { acronym: 'RLOO', fullForm: 'REINFORCE Leave-One-Out', description: 'Each sample\'s baseline is the mean reward of the other samples for the same prompt.' },
  { acronym: 'KL', fullForm: 'Kullback-Leibler divergence', description: 'A measure of how far one probability distribution is from another; here, how far the trained model has drifted from the starting one.' },
  { acronym: 'DPO', fullForm: 'Direct Preference Optimization', description: 'Trains on preference pairs with a closed-form loss, with no reward model and no sampling during training.' },
  { acronym: 'IPO', fullForm: 'Identity Preference Optimization', description: 'A DPO relative that regularises the preference loss toward a fixed margin.' },
  { acronym: 'KTO', fullForm: 'Kahneman-Tversky Optimization', description: 'A DPO relative that learns from single responses labelled desirable or undesirable, with no pairs.' },
  { acronym: 'ORPO', fullForm: 'Odds Ratio Preference Optimization', description: 'A DPO relative that folds the preference term into SFT and drops the reference model.' },
  { acronym: 'SimPO', fullForm: 'Simple Preference Optimization', description: 'A DPO relative with a length-normalised reward and no reference model.' },
  { acronym: 'BOND', fullForm: 'Best-of-N Distillation', description: 'Trains a policy toward the output distribution of best-of-n sampling. Named in the Gemma 3 report\'s post-training recipe.' },
  { acronym: 'WARM', fullForm: 'Weight Averaged Reward Models', description: 'Averages the weights of several fine-tuned reward models into one.' },
  { acronym: 'WARP', fullForm: 'Weight Averaged Rewarded Policies', description: 'Averages the weights of several RL-trained policies.' },
  { acronym: 'PRM', fullForm: 'Process-supervised reward model', description: 'A reward model that scores each reasoning step.' },
  { acronym: 'ORM', fullForm: 'Outcome-supervised reward model', description: 'A reward model that scores only the final answer.' },
  { acronym: 'SCoRe', fullForm: 'Self-Correction via Reinforcement Learning', description: 'Multi-turn RL that trains a model to correct its own first attempt without outside feedback.' },
  { acronym: 'ProRL', fullForm: 'Prolonged RL', description: 'A recipe for long RL training runs, applied to a 1.5B model.' },
  { acronym: 'UCB', fullForm: 'Upper Confidence Bound', description: 'A bandit rule that picks the action whose estimated value plus an uncertainty bonus is highest.' },
  { acronym: 'MAB', fullForm: 'Multi-armed bandit', description: 'A repeated choice among actions with unknown payoffs: the simplest exploration problem.' },
  { acronym: 'MCMC', fullForm: 'Markov chain Monte Carlo', description: 'Sampling by a random walk whose long-run distribution is the target, used by the training-free sampler of section 8.' },
  { acronym: 'AD', fullForm: 'Algorithm Distillation', description: 'Trains a transformer on the logged learning histories of an RL algorithm, so it improves in context.' },
  { acronym: 'ED', fullForm: 'Expert Distillation', description: 'Algorithm Distillation\'s control: trained on expert episodes rather than on learning histories.' },
  { acronym: 'DPT', fullForm: 'Decision-Pretrained Transformer', description: 'Trained to predict the optimal action from an in-context set of interactions with a task, which may be random.' },
  // Learning in words
  { acronym: 'ICL', fullForm: 'In-context learning', description: 'A frozen model adapting to examples or feedback placed in its context, with no weight update.' },
  { acronym: 'GD', fullForm: 'Gradient descent', description: 'Updating parameters a small step against the gradient of a loss.' },
  { acronym: 'CoT', fullForm: 'Chain of thought', description: 'The reasoning a model writes before its answer or action.' },
  { acronym: 'ACE', fullForm: 'Agentic Context Engineering', description: 'A playbook loop that merges small itemised deltas into an evolving context, with de-duplication.' },
  { acronym: 'GEPA', fullForm: 'Genetic-Pareto', description: 'A reflective prompt optimiser that reads the evaluator\'s text feedback and keeps a Pareto front of candidates.' },
  { acronym: 'MIPRO', fullForm: 'Multi-prompt Instruction PRoposal Optimizer', description: 'Searches instructions and demonstrations with a surrogate model of the score. MIPROv2 is DSPy\'s implementation.' },
  { acronym: 'OPRO', fullForm: 'Optimization by PROmpting', description: 'Keeps a scored history of instructions in a meta-prompt and asks the model for better ones.' },
  { acronym: 'ProTeGi', fullForm: 'Prompt Optimization with Textual Gradients', description: 'Writes natural-language critiques of a prompt and applies them as edits.' },
  { acronym: 'ExpeL', fullForm: 'Experiential Learning agent', description: 'An agent that extracts insights from pairs of successful and failed attempts and edits a list of them.' },
  { acronym: 'CLIN', fullForm: 'CLIN (a continually learning language agent)', description: 'An agent that regenerates a memory of causal lessons after each trial.' },
  { acronym: 'ReAct', fullForm: 'Reasoning and acting', description: 'An agent pattern that interleaves written reasoning with tool calls.' },
  { acronym: 'PAG', fullForm: 'Profile-Augmented Generation', description: 'Adds a written user profile to the prompt; a baseline in the Advisor Models paper.' },
  { acronym: 'RAG', fullForm: 'Retrieval-augmented generation', description: 'Puts the best-matching retrieved chunks into the context at question time.' },
  { acronym: 'TRAIL', fullForm: 'Trace Reasoning and Agentic Issue Localization', description: 'A benchmark of agent traces with annotated errors, used to measure how well a model finds them.' },
  // Systems and numerics
  { acronym: 'TRL', fullForm: 'Transformers Reinforcement Learning', description: 'Hugging Face\'s post-training library (GRPOTrainer, DPOTrainer and others). Pinned here at v1.16.0.' },
  { acronym: 'LoRA', fullForm: 'Low-Rank Adaptation', description: 'Trains small low-rank matrices added to frozen weights instead of the full weights.' },
  { acronym: 'MoE', fullForm: 'Mixture of experts', description: 'A model whose feed-forward layers route each token to a few of many expert sub-networks.' },
  { acronym: 'MTP', fullForm: 'Multi-Token Prediction', description: 'Extra heads that predict tokens beyond the next one; usable for speculative decoding.' },
  { acronym: 'KV', fullForm: 'Key-value', description: 'The attention keys and values cached for every processed token.' },
  { acronym: 'bf16', fullForm: 'bfloat16, a 16-bit floating-point format', description: 'A number format with float32\'s range and fewer mantissa bits. E0 trained in bf16.' },
  { acronym: 'TPU', fullForm: 'Tensor processing unit', description: 'Google\'s machine-learning accelerator.' },
  { acronym: 'EOS', fullForm: 'End of sequence', description: 'The token that ends a generation, where an outcome reward is usually attached.' },
  { acronym: 'HH', fullForm: 'Helpful and harmless', description: 'Anthropic\'s preference dataset of helpfulness and harmlessness comparisons.' },
  // Benchmarks and metrics
  { acronym: 'pass@k', fullForm: 'Pass at k', description: 'The chance that at least one of k samples solves a problem; pass@1 is the single-attempt success rate.' },
  { acronym: 'AIME', fullForm: 'American Invitational Mathematics Examination', description: 'A US competition-math exam with integer answers, used as an RLVR benchmark.' },
  { acronym: 'MATH-500', fullForm: 'MATH-500', description: 'A 500-problem subset of the MATH competition-math benchmark.' },
  { acronym: 'GSM8K', fullForm: 'Grade School Math 8K', description: 'Grade-school math word problems.' },
  { acronym: 'MMLU', fullForm: 'Massive Multitask Language Understanding', description: 'A multiple-choice exam benchmark across academic subjects.' },
  { acronym: 'SWE-bench Verified', fullForm: 'SWE-bench Verified', description: 'Human-validated GitHub issues, scored by whether the repository\'s tests pass after the model\'s patch.' },
  { acronym: 'HumanEval', fullForm: 'HumanEval', description: 'Hand-written Python programming problems scored by unit tests; the Reflexion paper also uses a Rust translation.' },
  { acronym: 'MBPP', fullForm: 'Mostly Basic Python Problems', description: 'Short Python programming problems scored by unit tests.' },
  { acronym: 'HotPotQA', fullForm: 'HotPotQA', description: 'Multi-hop questions over Wikipedia, scored by exact match.' },
  { acronym: 'RULER', fullForm: 'RULER', description: 'A synthetic benchmark that measures the context length at which a model still performs.' },
  { acronym: 'MTOB', fullForm: 'Machine Translation from One Book', description: 'Translating Kalamang, a low-resource language, from one grammar book.' },
  { acronym: 'chrF', fullForm: 'Character n-gram F-score', description: 'A translation score based on character overlap with a reference.' },
  { acronym: 'val_bpb', fullForm: 'Validation bits per byte', description: 'autoresearch\'s one metric; lower is better.' },
];

export function GlossaryAndSources() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Every acronym in the dive, our own experiment, and the reading list grouped by authority (sources read 2026-10-30)"
          >
            24. Glossary &amp; Sources
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Sources carry tiers. Tier 0 is our own experiment; Tier 1 is code at a pinned tag or commit, framework
            documentation and first-party AWS documentation and pricing; Tier 2 is a lab or vendor post, whose
            performance figures stay the author&apos;s claims; Tier 3 is a paper, marked with its venue or as a
            preprint. Every citation in the dive, section by section, is listed in the dive&apos;s{' '}
            <code>sources.md</code>, generated from the inline citations.
          </Box>
          <Box variant="h3">Tier 0: our own experiment</Box>
          <Box variant="p">
            E0, a GRPO smoke test with TRL 1.16.0 and vLLM 0.28.0 colocated on one DGX Spark (Qwen2.5-0.5B-Instruct,
            two runs of 20 steps, single seed, run 2026-10-30):{' '}
            <Cite tier={0} href={E0_URL}>E0 log: GRPO smoke test on a DGX Spark</Cite>. The training script, run
            script, package versions and raw per-step logs:{' '}
            <Cite tier={0} href={researchUrl('2026-10/E0-spark-smoke/')}>E0 scripts and logs</Cite>.
          </Box>
        </SpaceBetween>
      </Container>
      <Glossary entries={glossary} />
      <SourcesAppendix sources={sources} />
    </SpaceBetween>
  );
}
