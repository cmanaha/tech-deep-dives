# Claims: section 23, RL & Learning Loops on AWS (`src/sections/RlOnAws.tsx`)

Authored 2026-10-30. Every AWS page below was re-fetched on 2026-10-30 with plain `curl` (no custom headers) and read as text: Bedrock user guide (reinforcement-fine-tuning, reward-functions, reward-functions-open-weight, rft-prepare-data, rft-prepare-data-open-weight, custom-models, advanced-prompt-optimization-how), Bedrock pricing page, AWS Price List API AmazonBedrock us-east-1 version 20261030160456 (SKU description "$80.00 per hour for Nova2.0Lite-RFT-Training-Hours in US East (N. Virginia)"), What's New 2025-12-03 RFT launch, AWS ML blog RFT best practices (08 APR 2026), SageMaker AI developer guide (customizing-models, model-customize-open-weight, model-customize-mtrl-agent, model-customize-mtrl-hyperparams, customizing-models-training-sessions, training-sessions-sdk), AgentCore developer guide (episodic-memory-strategy, memory-episodic-prompt, memory-custom-strategy, memory-self-managed-strategies, optimization, optimization-how-it-works, evaluations), What's New AgentCore optimization preview (Apr 30, 2026) and GA (Jun 17, 2026), AWS ML blog on AgentCore episodic memory (21 JAN 2026), Neuron v2.33.0 rendered docs (about-pytorch-neuron, what-is-neuron, archive/nxd-training/index). Code read at pins: `aws/sagemaker-hyperpod-recipes` tag 2.0.11 = `a6030c319908c8a1b74cb619b00476f8e6baa04f` (tag ref and latest release re-checked unauthenticated; tree re-fetched, not truncated; all 149 `verl-grpo-*.yaml` fetched and tallied); `huggingface/trl` v1.16.0 (`docs/source/aws_trainium.md`, `trl/trainer/grpo_config.py`). The Neuron v2.33.0 docs-source search (GRPO 0, PPO 0) is wave 2 W6's, run 2026-10-30, not re-run. Format: `claim | source URL | register or wave 2 row`.

## Intro (h1)
- AWS services split into weight-changing (training) and text-changing (frozen model) loops across Bedrock, SageMaker AI, AgentCore, Neuron/Trainium at three levels (framing, our map) | - | scope section 23
- Bedrock RFT scores samples with a rule-based Lambda or an LLM judge | https://docs.aws.amazon.com/bedrock/latest/userguide/reward-functions.html | F06-4; wave2-aws row 7
- Advanced Prompt Optimization takes a Lambda function or an LLM-as-a-judge rubric (or natural-language criteria) as its metric | https://docs.aws.amazon.com/bedrock/latest/userguide/advanced-prompt-optimization-how.html | F06-57; wave2-aws row 27
- One grader, two update targets (our reading; landing 1) | the two URLs above | F06-57 use-in-dive; U15 accept-as-hedge (no shared Lambda contract claimed)

## Two stacks, three levels (diagram)
- Acronym gloss: SFT on labelled answers, DPO on preferred/rejected pairs, RFT against a grader; Bedrock runs RFT with GRPO; LoRA adapter (definitions) | https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models.html ; https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html | F06-22, F06-1
- On Trainium the documented RL route is Hugging Face's TRL | https://github.com/huggingface/trl/blob/v1.16.0/docs/source/aws_trainium.md | F06-61; wave2-aws row 26, G6
- Diagram cells restate the cited facts below ($80.00, rank-32 LoRA, 100 records, release 2.0.11, P5/P4, TorchNeuron public beta, episodic default verdict); the grader band carries "one grader, two update targets (our reading)" (landing 2) | as below | -

## Weights, managed: Bedrock RFT
- Bedrock RFT: model generates several responses per prompt, reward function scores them, trains with GRPO | https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html | F06-1; wave2-aws row 6
- GRPO compares responses within the prompt's group, so no separate value model (definition) | - | section 7 owns the mechanism
- Nova: RLVR rule-based graders; RLAIF judges; console Model as Judge converts the configuration into a Lambda during training | https://docs.aws.amazon.com/bedrock/latest/userguide/reward-functions.html | F06-4; wave2-aws row 7
- Open-weight models: custom Lambda only; judges are Bedrock models called inside your Lambda | https://docs.aws.amazon.com/bedrock/latest/userguide/reward-functions-open-weight.html | F06-5; wave2-aws row 7
- Three base models, each listed in one Region: Nova 2 Lite us-east-1; gpt-oss-20B and Qwen3 32B us-west-2 | https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html | F06-2; wave2-aws row 8
- At least 100 training records, both model families | https://docs.aws.amazon.com/bedrock/latest/userguide/rft-prepare-data.html ; https://docs.aws.amazon.com/bedrock/latest/userguide/rft-prepare-data-open-weight.html | F06-8; wave2-aws row 9
- Whole training workflow billed hourly; $80.00 per training hour for gpt-oss-20b and Qwen3 32B (pricing page) and Nova 2 Lite (Price List API) | https://aws.amazon.com/bedrock/pricing/ ; https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/20261030160456/us-east-1/index.json | F06-16; wave2-aws rows 4, 10, G2
- AWS's best-practices post: rank-32 LoRA adapters; EarlyStopping enabled by default, stops when improvements plateau, monitoring validation metrics (Tier 2 vendor statement, attributed in the sentence) | https://aws.amazon.com/blogs/machine-learning/reinforcement-fine-tuning-on-amazon-bedrock-best-practices/ | wave2-aws G4 (G4 says "same post"; re-opened: both statements are in the best-practices post of 08 APR 2026, not the OpenAI-compatible walkthrough)
- "improves model accuracy by up to 66% on average compared to base models" (vendor claim, attributed; no benchmark, task or model in the statement) | https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html | F06-10; wave2-aws row 11, G3; 06 U1 accept-as-hedge
- Figure first published when Nova 2 Lite was the only supported model ("At launch, you can use reinforcement fine-tuning with Amazon Nova 2 Lite") | https://aws.amazon.com/about-aws/whats-new/2025/12/bedrock-reinforcement-fine-tuning-66-base-models/ | F06-14, F06-15; wave2-aws G3 triage hedge text
- Expandable: pricing heading "US East (N. Virginia) and US West (Oregon)" for open-weight rates vs model table us-west-2 only; plan from the model table (our reading) | pricing page ; RFT page | F06-16 note; wave2-aws row 8

## Weights, serverless: SageMaker AI
- Six techniques: SFT, DPO, RFT (RLVR or RLAIF), MTRL, continuous customisation, distillation (teacher to student) | https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models.html | F06-22; wave2-aws row 13, G7
- Bedrock lists distillation as a customisation method | https://docs.aws.amazon.com/bedrock/latest/userguide/custom-models.html | F06-13; wave2-aws G7 item 2
- MTRL: agent calls the policy model, acts in your environment, reports a reward for the complete rollout (CompleteRollout, UpdateReward) | https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl-agent.html | F06-30; wave2-aws row 16
- Training sessions: sample(), forward_backward(), optim_step() composed by you; model stays loaded on GPUs; service handles distributed execution and gradient synchronisation | https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models-training-sessions.html | F06-31; wave2-aws row 18
- RL losses (ppo, importance_sampling, cispo) require logprobs and advantages as inputs; advantage estimator is your code (our reading) | https://docs.aws.amazon.com/sagemaker/latest/dg/training-sessions-sdk.html | F06-35; 06 U7 accept-as-hedge
- Expandable: advantage_method default group_based, nine values incl. rloo, reinforce_pp, grpo_passk (AWS does not expand the last two; REINFORCE++ and pass@k GRPO are our reading); loss_fn three values, default ppo | https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl-hyperparams.html | F06-33; wave2-aws row 14

## Weights, self-managed: HyperPod recipes and Trainium
- Recipes back SageMaker AI training jobs (you pick instances) and persistent HyperPod clusters with fault recovery | https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models.html | F06-22
- Qwen3 32B LoRA GRPO recipe: inherits verl PPO trainer config where `adv_estimator: gae` | https://github.com/aws/sagemaker-hyperpod-recipes/blob/a6030c319908c8a1b74cb619b00476f8e6baa04f/hyperpod_recipes/recipes_src/fine-tuning/hydra_config/verl-0_7_0/ppo_trainer.yaml#L80-L81 | F06-38; wave2-aws row 20 (inheritance via recipe L2 and default.yaml L2-L3)
- Override "switch from GAE (upstream default) to GRPO", `adv_estimator: grpo` | .../qwen-0_7_0/verl-grpo-rlvr-qwen-3-32b-lora.yaml#L33-L35 | F06-38; wave2-aws row 20
- Rollouts with vLLM (`rollout.name: vllm`) | same recipe #L50-L51 | F06-38
- 8 responses per prompt, default in shared rollout.yaml (`n: 8`), not overridden by this recipe | .../hydra_config/verl-0_7_0/rollout/rollout.yaml#L104-L105 | F06-38; scoped to this recipe because a re-tally on 2026-10-30 found `verl-grpo-rlvr-deepseek-r1-distilled-qwen-7b-fft.yaml` sets `n: 16`
- Empty `lambda_arn` reward slot (`reward_manager: prime`) | same recipe #L98-L102 | F06-38
- Scope narrowed on purpose: 68 of 149 GRPO recipes set `adv_estimator: grpo` directly; the other 81 inherit `/hydra_config/verl/algorithm/grpo` (older config family), so the PPO-trainer inheritance is stated for the Qwen3 32B example only | tree and files at the pinned SHA | re-tally 2026-10-30
- Every GRPO recipe targets P5 or P4: 149 files, every file lists a P5 or P4 type; types ml.p5.48xlarge 147, ml.p4de.24xlarge 95, ml.p4d.24xlarge 28, ml.p5e.48xlarge 2, ml.p5en.48xlarge 2; no path in the 3,788-entry tree matches trn1/trn2/trn3/trainium/neuron | https://github.com/aws/sagemaker-hyperpod-recipes/tree/a6030c319908c8a1b74cb619b00476f8e6baa04f/hyperpod_recipes/recipes_src/fine-tuning | F06-43; wave2-aws row 21 (re-tallied 2026-10-30, identical counts)
- Nova 2 Lite RFT recipe: `rollout_strategy.type: off_policy_async`, `age_tolerance: 2` | .../nova/nova_2_0/nova_lite/RFT/nova_lite_2_0_p5_gpu_rft.yaml#L29-L34 | F06-41; wave2-aws row 22
- "about two policy versions old" is our reading; the recipe does not define the unit | same file | F06-41; 06 U12 accept-as-hedge
- GRPO and PPO not found in the Neuron v2.33.0 documentation searched | https://github.com/aws-neuron/aws-neuron-sdk/tree/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a | F06-44; wave2-aws rows 23, 24 (pin v2.33.0), G6
- DPO tutorial's library (NxD Training) has reached end of support ("end-of-support as of Neuron 2.32"); tutorial listed as "Llama3 8B DPO/ORPO alignment" | https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/archive/nxd-training/index.html | F06-45; wave2-aws row 25
- TRL v1.16.0: torch-neuronx registers the `neuron` device; TRL trainers run on it | https://github.com/huggingface/trl/blob/v1.16.0/docs/source/aws_trainium.md#L3 | F06-61; wave2-aws row 26
- TorchNeuron public beta for Neuron 2.33, on Trn2 and Trn3 (AWS's statement, not TRL's) | https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/torch/about-pytorch-neuron.html | F06-47; wave2-aws row 26
- TRL GRPO example generates with Transformers in the training process, on one NeuronCore | https://github.com/huggingface/trl/blob/v1.16.0/docs/source/aws_trainium.md#L53-L82 | F06-61
- Expandable: pad_to_multiple_of = 128 on the neuron device | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_config.py#L1055-L1057 | F06-61
- Expandable: about 12 minutes compile per new size on one NeuronCore, about 25 s per step after (Hugging Face's report, Qwen3-0.6B) | https://github.com/huggingface/trl/blob/v1.16.0/docs/source/aws_trainium.md#L82 | F06-61
- Expandable: bucket lengths before the first run (guidance from the two facts above) | - | F06-61 use-in-dive

## Words, managed
- APO inputs: up to 10 templates per job, up to 100 evaluation samples per template, ground truth, evaluation metric as LLM-judge rubric, Lambda or natural-language criteria; loop repeats per proprietary internal parameters | https://docs.aws.amazon.com/bedrock/latest/userguide/advanced-prompt-optimization-how.html | F06-57; wave2-aws row 27
- Inference and Lambda run in your account at public prices; no separate APO service charge | same URL | F06-57
- AgentCore optimization: recommendations rewrite system prompts and tool descriptions from traces and a target evaluator | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization.html | F06-53; wave2-aws row 28
- AgentCore Evaluations scores traces with LLM-as-a-Judge (built-in and custom evaluators) | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html | F06-55; wave2-aws row 28
- Batch evaluation against test cases and/or A/B test with statistical significance; every recommendation requires approval | https://aws.amazon.com/about-aws/whats-new/2026/05/bedrock-agentcore-optimization-preview/ | F06-54; wave2-aws row 28
- Route 100% of traffic to the winner; new traces seed the next iteration | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization-how-it-works.html | F06-53
- Recommendations, batch evaluations, A/B tests GA since 2026-06-17 | https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-bedrock-agentcore-new-optimization-capabilities/ | F06-54; wave2-aws row 29

## Words, a managed store: AgentCore episodic memory
- Detects episode completion, writes structured records, generates reflections across episodes; "giving models a way to learn from history" | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/episodic-memory-strategy.html | F06-51; wave2-aws row 30
- AWS's own test (Tier 2, vendor claim, attributed): Claude 3.7 agent; tasks sampled from tau2-bench, retail and airline; memory from historical interactions; four parallel attempts per query | https://aws.amazon.com/blogs/machine-learning/build-agents-to-learn-from-experiences-using-amazon-bedrock-agentcore-episodic-memory/ | wave2-aws G1; RESEARCH-GUIDE Q7 close-in-wave-2
- Retail Pass^1 (succeeded at least once in four): 77.20% Cross Episodes Reflection Memory vs 65.80% No Memory | same URL (table) | wave2-aws G1
- Airline Pass^3 (at least three of four): 43.00% Episodes as ICL Example vs 41% reflection, 24% baseline | same URL (table; text "43.0% vs 41.0% for reflection") | wave2-aws G1
- Pass^1 of four = pass@4 in this dive's notation (our reading) | - | -
- No curve over successive episodes; blog reports no task counts or seeds | same URL | wave2-aws G1 "what it does not show"
- Default prompt: "Start with Yes or No" on whether the acting party achieved its stated goal | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-episodic-prompt.html | F06-52; wave2-aws row 31
- Verdict reads the transcript with no external check, weak signal per sections 10 and 12 (our reading) | - | scope section 23
- Extraction, consolidation and reflection steps overridable for episodic, with own instructions and model | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-custom-strategy.html | F06-50; wave2-aws row 31
- Override can point the judge at transcript evidence; cannot run tests; programmatic grader needs self-managed (our reading) | - | wave2-aws row 32 (R2b #33)
- Self-managed strategy: own extraction pipeline, batch APIs (BatchCreateMemoryRecords etc.) | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-self-managed-strategies.html | F06-50; wave2-aws row 32

## Words, self-run, and two paths with no dedicated service
- Any loop from sections 13 to 15 runs on Bedrock models with nothing AWS-specific beyond the model API (our reading) | - | scope section 23
- On the pages read, none of the words-side services is described as changing weights | episodic-memory-strategy ; advanced-prompt-optimization-how | F06-59; wave2-aws row 33
- AWS's "learn" on these pages means retrieved text or edited prompts (our reading) | - | F06-59 use-in-dive
- Inference-time sampling and advisor have no dedicated service among those covered (our reading) | - | scope section 23
- SageMaker AI RFT (RLVR, RLAIF) supported on models as small as Qwen3 0.6B | https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-open-weight.html | F06-24; wave2-aws row 19
- Training sessions run on the larger models they list (gpt-oss-20b, gemma-4-31B-it, Qwen3.6-27B, Qwen3.8-27B) | https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models-training-sessions.html | F06-32 (stale), wave2-aws row 18

## One grader, two update targets (ending)
- Rule-based Lambda or LLM judge drives RFT's weight update; Lambda or LLM-as-a-judge rubric drives APO's prompt rewrite; one grader, two update targets (our reading; landing 3) | reward-functions ; advanced-prompt-optimization-how | F06-4, F06-57
- The pages read do not say one Lambda runs unchanged in both | same | 06 U15 accept-as-hedge
- Path table: services per section 22 path; sampling, advisor and playbook-distillation mappings marked our reading | as cited above | scope sections 22, 23
- Ending: grader first ($80.00 per training hour and 100 records, landing of the number); agent for MTRL; algorithm for training sessions; evaluator (and approval) for managed words loops | as cited above | scope section 23
