# 06 AWS paths for RL and for learning loops: research register

**Research date:** 2026-10-17 (every source below: accessed 2026-10-17)
**Area:** 06 of the "RL and agentic learning loops" dive. The AWS paths a reader can take: Amazon Bedrock reinforcement fine-tuning (RFT); Amazon Nova customisation (DPO, PPO, RFT, GRPO); SageMaker AI HyperPod recipes and serverless model customisation; Trainium and the Neuron SDK; managed versions of the "learning in words" loop (AgentCore Memory, Bedrock prompt optimization, Prompt Management, AgentCore evaluations).
**Question this area serves:** given a team that wants a model or an agent to get better from feedback, which AWS service does that, with which models, driven by which signal, and at what status.

**Tiers used** (project standard, code over docs over blogs):
- Tier 1: docs.aws.amazon.com pages; aws.amazon.com product and pricing pages (Tier 1 for pricing, vendor claim for performance); official github.com/aws, github.com/awslabs, github.com/aws-neuron repos at a pinned tag or 40-char SHA; Neuron docs at awsdocs-neuron.readthedocs-hosted.com at a pinned version.
- Tier 2: AWS What's New posts, AWS blogs.
- Tier 4: search-engine summaries, used only to locate pages; never cited as fact.

**Evidence kinds:** definition, documentation of support, pricing, launch announcement, vendor performance claim, code behaviour.

**Quote normalisation:** quotes are verbatim from the fetched page text, except that em-dash and en-dash characters are rendered as " - " and curly quotes as straight quotes. Ellipses mark omissions.

**Verdicts:** NEW (recorded fresh from the primary source); UNKNOWN (unresolved, see the UNKNOWN register); WRONG (a commonly repeated claim that the primary source contradicts, with what is true).

**Reused from earlier registers:** F02-77 (Bedrock RFT uses GRPO; Nova reward Lambda 15-minute limit; SDK MultiTurnRLTrainer) and F04-40 (Bedrock prompt caching invalidates on prefix change). Re-read here where this file depends on them.

## Pinned sources

(filled in as pages are read)

## Claim register

### Amazon Bedrock reinforcement fine-tuning (RFT)

**F06-1. Bedrock offers reinforcement fine-tuning as a managed customisation method, and trains with GRPO.**
- Claim: Bedrock RFT samples several responses per prompt, scores them with a reward function, and updates the model with Group Relative Policy Optimization (GRPO). The customer supplies prompts and a grader, not labelled responses.
- Location: Bedrock User Guide, "Customize a model with reinforcement fine-tuning in Amazon Bedrock", section "How reinforcement fine-tuning works".
- Verdict: NEW (confirms F02-77)
- Evidence: https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html | Tier 1 | definition | "The model receives prompts from your training dataset and generates several responses per prompt. These responses are then scored by a reward function. Amazon Bedrock uses the prompt-response pairs with scores to train the model through policy-based learning using Group Relative Policy Optimization (GRPO). The training loop continues until it reaches the end of your training data or you stop the job at a chosen checkpoint" (accessed 2026-10-17)
- Use in dive: The managed AWS instance of the GRPO loop the dive explains. Lets the reader map "group of samples, scored, relative advantage" onto a console job.

**F06-2. Bedrock RFT supports three base models, each in one Region: Nova 2 Lite (us-east-1), gpt-oss-20B and Qwen3 32B (us-west-2).**
- Claim: The supported-models table lists Amazon Nova 2 Lite (`amazon.nova-2-lite-v1:0:256k`, US East (N. Virginia) us-east-1), OpenAI gpt-oss-20B (`openai.gpt-oss-20b`, US West (Oregon) us-west-2) and Qwen3 32B (`qwen.qwen3-32b`, US West (Oregon) us-west-2).
- Location: Bedrock User Guide, RFT page, section "Supported models for reinforcement fine-tuning"; repeated on "Fine-tune Amazon Nova models with reinforcement fine-tuning" (column "Single-region model support": us-east-1) and "Fine-tune open-weight models using OpenAI-compatible APIs" (section "Supported regions and endpoints").
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html | Tier 1 | documentation of support | table rows "Amazon | Nova 2 Lite | amazon.nova-2-lite-v1:0:256k | US East (N. Virginia) | us-east-1", "OpenAI | gpt-oss-20B | openai.gpt-oss-20b | US West (Oregon) | us-west-2", "Qwen | Qwen3 32B | qwen.qwen3-32b | US West (Oregon) | us-west-2" (accessed 2026-10-17)
- Use in dive: Practical. The model list is short and Region-bound; a startup on another Region or another model family cannot use managed RFT today.

**F06-3. Open-weight RFT on Bedrock runs through OpenAI-compatible fine-tuning APIs on a separate endpoint.**
- Claim: For gpt-oss-20B and Qwen3 32B, the customer uploads data with the Files API, creates a fine-tuning job through the OpenAI-compatible API, lists events and checkpoints, and runs inference through the OpenAI-compatible Responses or Chat Completions APIs. The listed endpoint is `bedrock-mantle.us-west-2.api.aws`.
- Location: Bedrock User Guide, "Fine-tune open-weight models using OpenAI-compatible APIs", sections "Key capabilities", "Reinforcement fine-tuning workflow for open-weight models", "Supported regions and endpoints".
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/bedrock/latest/userguide/fine-tuning-openai-apis.html | Tier 1 | documentation of support | "Amazon Bedrock provides OpenAI compatible API endpoints for fine-tuning foundation models. ... This page highlights using these APIs for reinforcement fine-tuning." "Access checkpoints - Retrieve intermediate model checkpoints created during training" "Endpoint | bedrock-mantle.us-west-2.api.aws" (accessed 2026-10-17)
- Use in dive: Practical. Two different control planes for the same feature: Bedrock CreateModelCustomizationJob for Nova, OpenAI-style fine-tuning jobs for open weights.

**F06-4. The Bedrock RFT reward is either a customer Lambda (RLVR) or a Bedrock-hosted model acting as judge (RLAIF), and the judge is itself compiled into a Lambda.**
- Claim: For Nova, the docs name two modes. RLVR: rule-based graders in Lambda, with console templates for math with ground truth, format validation, and a generic boilerplate. RLAIF: pick a Bedrock-hosted model as judge, write instructions, criteria and scoring guidelines; templates exist for instruction following, summarization of multi-turn dialogs, reasoning evaluation, and RAG faithfulness. The console converts the judge configuration into a Lambda function.
- Location: Bedrock User Guide, "Setting up reward functions for Amazon Nova models", sections "Reinforcement Learning through Verifiable Rewards (RLVR)", "Reinforcement Learning through AI Feedback (RLAIF)".
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/bedrock/latest/userguide/reward-functions.html | Tier 1 | definition | "RLVR optimizes models for objective tasks such as code generation or math reasoning using verifiable rule-based graders or ready-to-use templates." "RLAIF optimizes models for subjective tasks such as instruction following or chatbot interactions using AI-based judges with ready-to-use templates." "The console's Model as Judge option automatically converts your configuration into a Lambda function during training." (accessed 2026-10-17)
- Use in dive: Mental model. The reward is always a function call; "LLM-as-judge" on AWS is a Lambda that happens to call a model. The rubric quality is the reward quality.

**F06-5. For open-weight RFT there is no console judge; the judge, if any, is a Bedrock model called from inside the customer's Lambda.**
- Claim: The open-weight reward page lists only custom Lambda functions. For subjective tasks it tells the customer to call Bedrock foundation models as judges within the Lambda.
- Location: Bedrock User Guide, "Setting up reward functions for open-weight models", section "Custom Lambda functions for reward evaluation".
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/bedrock/latest/userguide/reward-functions-open-weight.html | Tier 1 | documentation of support | "You can set up reward functions using custom Lambda functions." "Subjective tasks - For subjective tasks like instruction following or chatbot interactions, call Amazon Bedrock foundation models as judges within your Lambda function to evaluate response quality based on your criteria." (accessed 2026-10-17)
- Use in dive: Practical. Nova gets templates and a console judge; open weights get a Lambda contract and nothing else.

**F06-6. The reward Lambda contract: input is the conversation plus metadata including the reference answer; output is an aggregate score plus named metrics, each tagged "Reward" or "Metric".**
- Claim: The Lambda receives a list of objects with `id`, `messages` (user and assistant turns) and `metadata` (including `reference_answer` and arbitrary keys). It returns, per `id`, an `aggregate_reward_score` and a `metrics_list` whose entries have `name`, `value` and `type` ("Reward" or "Metric"). The same contract appears on the Nova and open-weight pages. Design guidelines ask for ranking, consistent checks and "non-exploitable" scaling.
- Location: Bedrock User Guide, "Setting up reward functions for Amazon Nova models" and "...for open-weight models", section "Lambda function implementation details".
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/bedrock/latest/userguide/reward-functions.html | Tier 1 | code behaviour (documented interface) | output example `"aggregate_reward_score": 0.85, "metrics_list": [{"name": "accuracy", "value": 0.9, "type": "Reward"}, {"name": "policy_compliance", "value": 0.8, "type": "Metric"}]`; "Maintain stable scaling - Keep scores normalized and non-exploitable" (accessed 2026-10-17)
- Use in dive: Mental model plus practical. The "Metric" type lets a team log a signal without optimising it, which is the cheapest guard against reward hacking the docs offer. [our reading] on the guard framing.

**F06-7. Reward Lambdas may run up to 15 minutes, but AWS asks for seconds.**
- Claim: The reward pages tell customers to raise the Lambda timeout from the 3-second default up to the 15-minute maximum for complex evaluations. The RFT best-practices list says reward functions should "Execute within seconds (not minutes)" and use Lambda's parallel scaling.
- Location: "Setting up reward functions for Amazon Nova models", Note; "Customize a model with reinforcement fine-tuning", section "Reinforcement fine-tuning best practices".
- Verdict: NEW (confirms F02-77 for Bedrock as well as Nova on SageMaker)
- Evidence: https://docs.aws.amazon.com/bedrock/latest/userguide/reward-functions.html | Tier 1 | documentation of support | "Increase the Lambda timeout from default 3 seconds to maximum 15 minutes for complex evaluations." https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html | Tier 1 | "Optimize reward functions - Execute within seconds (not minutes), minimize external API calls, use efficient algorithms, implement proper error handling, and take advantage of Lambda's parallel scaling" (accessed 2026-10-17)
- Use in dive: Practical. Reward latency sits inside every training step; an agentic grader that runs a test suite or a sandbox has a hard 15-minute ceiling per call.

**F06-8. Bedrock RFT data: OpenAI chat-completion JSONL with a `reference_answer`, at least 100 records, at most 20K prompts; or Bedrock invocation logs from S3.**
- Claim: Training data is JSONL in the OpenAI chat completion format ("We only support the OpenAI chat completion format"), each record with `messages` and a `reference_answer` that the grader uses, plus optional grader fields; minimum 100 records. Alternatively, existing Invoke or Converse invocation logs in S3 (minimum 100 prompt examples), filterable by request metadata. The Nova page caps input at 20K prompts.
- Location: "Prepare data for Amazon Nova models", section "Training data requirements and sources"; "Fine-tune Amazon Nova models with reinforcement fine-tuning", Important box.
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/bedrock/latest/userguide/rft-prepare-data.html | Tier 1 | documentation of support | "A minimum of 100 records in training dataset" "reference_answer: In this field, it should contain the expected output or evaluation criteria that your reward function uses to score the model's response." "You can use customer-side stored Invoke/Converse API invocation logs from Amazon S3 for training." https://docs.aws.amazon.com/bedrock/latest/userguide/rft-nova-models.html | Tier 1 | "You can provide a maximum of 20K prompts to Amazon Bedrock for reinforcement fine-tuning the model." (accessed 2026-10-17)
- Use in dive: Practical and a bridge to the learning-loop theme: production traffic logs can become RL prompts, so the deployed agent's own usage feeds the next training run.

**F06-9. AWS's own RFT triage rule: 0 percent reward means do SFT first; above 95 percent means RFT may be unnecessary; start with 100 to 200 examples.**
- Claim: The best-practices list tells customers to measure the base model first, use SFT if rewards are consistently 0 percent, consider skipping RFT if rewards exceed 95 percent, and watch for rewards plateauing below 0.15 or variance rising.
- Location: "Customize a model with reinforcement fine-tuning", section "Reinforcement fine-tuning best practices".
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html | Tier 1 | documentation of support (guidance) | "If rewards are consistently 0 percent, use supervised fine-tuning first to establish basic capabilities. If rewards are greater than 95 percent, reinforcement fine-tuning might be unnecessary" "Start small - Begin with 100-200 examples" "Look for concerning patterns such as rewards plateauing below 0.15" (accessed 2026-10-17)
- Use in dive: Mental model. This is the "RL sharpens what the base model can already sample" result from area 02 stated as operational guidance: a group with all-zero rewards has no relative advantage to learn from. [our reading] for the link to GRPO advantage; the rule itself is AWS's.

**F06-10. AWS claims RFT improves accuracy "by up to 66% on average" over base models; this is a vendor performance claim with no method stated on the page.**
- Claim: The benefits section states the figure without a benchmark, task list or model list on that page.
- Location: "Customize a model with reinforcement fine-tuning", section "Benefits of reinforcement fine-tuning".
- Verdict: NEW (vendor claim; method UNKNOWN, see U1)
- Evidence: https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html | Tier 1 page, vendor performance claim | "Reinforcement fine-tuning improves model accuracy by up to 66% on average compared to base models." (accessed 2026-10-17)
- Use in dive: Cite only as AWS's claim, with the attribution in the sentence ("AWS says up to 66% on average") because the number is a vendor performance claim. Do not restate as a measurement.

**F06-11. Bedrock RFT exposes GRPO hyperparameters: samples per prompt, batch size, epochs, learning rate, prompt and generation lengths, reasoning effort.**
- Claim: The Nova job example sets `batchSize` 64, `epochCount` 2, `evalInterval` 10, `inferenceMaxTokens` 8192, `learningRate` 0.00001, `maxPromptLength` 4096, `reasoningEffort` "high", `trainingSamplePerPrompt` 4. The page says a job "can take a few hours".
- Location: "Create and manage fine-tuning jobs for Amazon Nova models", API and SDK examples.
- Verdict: NEW (example values, not documented defaults)
- Evidence: https://docs.aws.amazon.com/bedrock/latest/userguide/rft-submit-job.html | Tier 1 | documentation of support | `"hyperParameters": {"batchSize": 64, "epochCount": 2, "evalInterval": 10, "inferenceMaxTokens": 8192, "learningRate": 0.00001, "maxPromptLength": 4096, "reasoningEffort": "high", "trainingSamplePerPrompt": 4}` "The RFT job can take a few hours depending on the size of your training data, number of epochs, and complexity of your reward functions." (accessed 2026-10-17)
- Use in dive: Mental model. `trainingSamplePerPrompt` is the GRPO group size; the reader can see the knob the theory talks about.

**F06-12. Bedrock RFT training metrics use actor, critic and validation names, including policy entropy and aborted-response ratio.**
- Claim: The monitoring section lists reward metrics `critic/rewards/mean`, `critic/rewards/max`, `critic/rewards/min`, `val-score/rewards/mean@1`; `actor/entropy`; prompt and response length statistics; `response/aborted_ratio`; `perf/throughput`, `perf/time_per_step`.
- Location: "Create and manage fine-tuning jobs for Amazon Nova models", section "Monitor your RFT training job", "Real-time training metrics".
- Verdict: NEW. [SPECULATIVE, our reading] these metric names match the naming used by the open-source verl trainer; AWS does not say which trainer runs the job.
- Evidence: https://docs.aws.amazon.com/bedrock/latest/userguide/rft-submit-job.html | Tier 1 | documentation of support | "Reward metrics - critic/rewards/mean, critic/rewards/max, critic/rewards/min (reward distribution), and val-score/rewards/mean@1 (validation rewards)" "Model behavior - actor/entropy (policy variation; higher equals more exploratory)" "response/aborted_ratio (incomplete generation rate; 0 equals all completed)" (accessed 2026-10-17)
- Use in dive: Practical. Entropy collapse and rising response length (area 02) are directly observable in the console.

**F06-13. Bedrock's customisation overview lists three methods: supervised fine-tuning, reinforcement fine-tuning, distillation. Continued pre-training is not among them on this page.**
- Claim: The overview page says "Amazon Bedrock currently provides the following customization methods" and lists SFT (labelled pairs), RFT (reward functions, prompts or invocation logs), and distillation (teacher generates responses, student is fine-tuned). Training is billed by tokens processed (training tokens times epochs) plus monthly model storage.
- Location: Bedrock User Guide, "Customize your model to improve its performance for your use case".
- Verdict: NEW for the three-method list. Continued pre-training absence is scoped to this page and this TOC read; whether Bedrock still offers it elsewhere is U2.
- Evidence: https://docs.aws.amazon.com/bedrock/latest/userguide/custom-models.html | Tier 1 | definition | "Instead of providing labeled input-output pairs, you define reward functions that evaluate response quality. The model learns iteratively by receiving feedback scores from these reward functions." "Amazon Bedrock generates responses from the teacher model for the given prompts, and then uses the responses to fine-tune the student model." "You are charged for model training based on the number of tokens processed by the model (number of tokens in training data corpus x number of epochs) and model storage charged per month per model." (accessed 2026-10-17)
- Use in dive: Mental model. The three differ in where the target comes from: SFT from the customer's labels, distillation from a teacher model's outputs, RFT from a score on the model's own samples.


**F06-14. Bedrock RFT launched on 3 December 2025 with Nova 2 Lite only; open-weight support (Qwen3 32B, gpt-oss-20B) and OpenAI-compatible APIs followed on 17 February 2026.**
- Claim: The first What's New post is dated Dec 3, 2025 and names Nova 2 Lite as the launch model. The second, dated Feb 17, 2026, adds `qwen.qwen3-32b` and `openai.gpt-oss-20b`, OpenAI-compatible fine-tuning APIs, Lambda grading and intermediate checkpoints.
- Location: AWS What's New, two posts.
- Verdict: NEW
- Evidence: https://aws.amazon.com/about-aws/whats-new/2025/12/bedrock-reinforcement-fine-tuning-66-base-models/ | Tier 2 | launch announcement | "Posted on: Dec 3, 2025" "At launch, you can use reinforcement fine-tuning with Amazon Nova 2 Lite with support for additional models coming soon." https://aws.amazon.com/about-aws/whats-new/2026/02/amazon-bedrock-reinforcement-fine-tuning-openai/ | Tier 2 | launch announcement | "Posted on: Feb 17, 2026" "Models supported at this launch are: qwen.qwen3-32b and openai.gpt-oss-20b." (accessed 2026-10-17)
- Use in dive: Dating. Managed RL on AWS is under a year old at the time of writing.

**F06-15. The launch post repeats the 66% figure as a delivered result, without the "up to" qualifier the docs use.**
- Claim: The What's New headline and body say RFT "delivers 66% accuracy gains on average over base models". The user guide says "improves model accuracy by up to 66% on average". Neither page states the benchmark.
- Location: What's New Dec 3, 2025, headline and first paragraph; Bedrock User Guide RFT page, "Benefits".
- Verdict: NEW (two first-party wordings of one vendor claim; method UNKNOWN, U1)
- Evidence: https://aws.amazon.com/about-aws/whats-new/2025/12/bedrock-reinforcement-fine-tuning-66-base-models/ | Tier 2 | vendor performance claim | "Reinforcement fine-tuning in Amazon Bedrock delivers 66% accuracy gains on average over base models" (accessed 2026-10-17)
- Use in dive: If the dive cites the number, cite the docs wording ("up to 66% on average"), attributed to AWS in the sentence, since it is a vendor claim.

**F06-16. Bedrock RFT is billed per training hour, not per token; for gpt-oss-20B and Qwen3 32B the rate is $80.00 per training hour plus $1.95 per model per month storage.**
- Claim: The pricing page says "The entire training workflow is billed at an hourly rate", with on-demand token pricing for inference on the resulting model. Tables for US East (N. Virginia) and US West (Oregon) list gpt-oss-20b at $80.00 per training hour, $0.09 per 1M input tokens, $0.39 per 1M output tokens, $1.95 storage per month; Qwen3 32B at $80.00 per training hour, $0.20 input, $0.78 output, $1.95 storage. The Nova pricing page lists Nova 2 Lite with a "Price to train (RFT) Hours" column (SFT is per 1,000 tokens); the amount is rendered by JavaScript and was not captured (U3).
- Location: Amazon Bedrock pricing page, OpenAI and Qwen sections, "Model Customization", "Reinforcement Fine Tuning Pricing"; Amazon Nova pricing page, "Training & Storage".
- Verdict: NEW. Note the Bedrock customisation overview's general billing note (tokens times epochs, F06-13) does not describe RFT; the pricing page governs for RFT.
- Evidence: https://aws.amazon.com/bedrock/pricing/ | Tier 1 (pricing) | pricing | "The entire training workflow is billed at an hourly rate." "Regions: US East (N. Virginia) and US West (Oregon) OpenAI models Price per training hours Price per 1M input tokens Price per 1M output tokens Price to store each trained model per month gpt-oss-20b $ 80.00 $ 0.09 $ 0.39 $ 1.95" "Qwen3 32B $ 80.00 $ 0.20 $ 0.78 $ 1.95" https://aws.amazon.com/nova/pricing/ | Tier 1 (pricing) | pricing | "Price to train (SFT) 1,000 tokens Price to train (RFT) Hours" (accessed 2026-10-17)
- Use in dive: Practical. Hourly billing means reward-function latency and generation length (F06-7, F06-11) become cost directly, because the meter runs while the model waits for the grader. [our reading] for the latency-to-cost link.

**F06-17. No RFT-specific row was found in the Bedrock service quotas table; the only RFT limits found are 100 minimum records and 20K maximum prompts.**
- Claim: A text search of the Bedrock endpoints and quotas page for "reinforcement" and "RFT" returned no rows; "(Model customization)" rows exist for distillation and other jobs. The page itself recommends the Service Quotas console because the table is large.
- Location: AWS General Reference, "Amazon Bedrock endpoints and quotas", section "Amazon Bedrock service quotas".
- Verdict: UNKNOWN for console-only quotas (U4). The scoped finding stands: not found in the General Reference table searched.
- Evidence: https://docs.aws.amazon.com/general/latest/gr/bedrock.html | Tier 1 | documentation of support | "Because Amazon Bedrock has a large number of quotas, we recommend that you view the service quotas using the console instead of using the table below." (accessed 2026-10-17)
- Use in dive: Practical. Check the Service Quotas console before planning concurrent RFT jobs.

### Amazon Nova customisation

**F06-18. For Nova 2, the Nova User Guide lists three customisation techniques: continued pre-training, SFT and RFT. DPO and PPO do not appear in the Nova 2 customisation table of contents.**
- Claim: The Nova 2 "Amazon Nova customization techniques" page says customisation "supports Continuous Pre-Training (CPT), Supervised Fine-Tuning (SFT), and Reinforcement Fine-Tuning (RFT)". A keyword search of both the Nova 2 and Nova 1 user guide tables of contents for "dpo", "ppo", "preference" and "grpo" returned no page titles.
- Location: Amazon Nova User Guide for Nova 2, "Amazon Nova customization techniques"; TOC files of the Nova 2 and Nova 1 user guides.
- Verdict: NEW. The absence of DPO and PPO is scoped to the two Nova user guide TOCs searched; DPO for Nova on SageMaker is not ruled out (U5).
- Evidence: https://docs.aws.amazon.com/nova/latest/nova2-userguide/nova-customization-techniques-2.html | Tier 1 | documentation of support | "Customizing Amazon Nova models supports Continuous Pre-Training (CPT), Supervised Fine-Tuning (SFT), and Reinforcement Fine-Tuning (RFT). Each technique serves different customization needs and can be applied to different Amazon Nova model versions." (accessed 2026-10-17)
- Use in dive: Practical. For Nova, the RL path is RFT (and multi-turn RL, F06-20), not PPO or DPO.

**F06-19. Nova RFT runs in three places: Bedrock (managed), SageMaker AI training jobs, and SageMaker HyperPod; Nova Forge adds a separate "Reinforcement Learning" path.**
- Claim: The Nova 2 user guide TOC has RFT pages under "Customization using SageMaker Training Jobs" (`nova-rft-2-smtj.html`, plus "Implementing reward functions"), under "Customization using SageMaker HyperPod" (`nova-hp-rft-nova2.html`, "Monitoring RFT training"), and under "Nova Forge" ("Reinforcement Learning", `nova-hp-rft-forge.html`). Nova Forge also lists "Continued Pre-Training and Mid-Training" and data mixing for SFT.
- Location: Amazon Nova User Guide for Nova 2, table of contents (toc-contents.json).
- Verdict: NEW (page titles; contents of the SageMaker-side Nova RFT pages not read, U6)
- Evidence: https://docs.aws.amazon.com/nova/latest/nova2-userguide/toc-contents.json | Tier 1 | documentation of support | TOC entries "Customization using SageMaker Training Jobs ... Reinforcement Fine-Tuning (RFT) | nova-rft-2-smtj.html", "Customization using SageMaker HyperPod ... Reinforcement Fine-Tuning (RFT) | nova-hp-rft-nova2.html", "Nova Forge ... Reinforcement Learning | nova-hp-rft-forge.html" (accessed 2026-10-17)
- Use in dive: Practical. The same Nova model can be RL-tuned at three levels of control; the reader picks by how much of the loop they need to own.

**F06-20. Multi-turn RL for Nova is documented for Nova Lite 2.0 in us-east-1 and us-west-2, and rewards the whole trajectory, including tool calls.**
- Claim: The Nova multi-turn RL page defines it as training "across a sequence of interactions rather than grading a single response", evaluating "the entire trajectory of steps the model takes - including tool calls, code execution, and web searches". Supported: Nova Lite 2.0 in us-east-1 and us-west-2. Setup is delegated to the SageMaker Developer Guide.
- Location: Amazon Nova User Guide for Nova 2, "Multi-turn Reinforcement Learning", sections "Overview", "Supported models".
- Verdict: NEW (extends F02-77, which recorded only the SDK class)
- Evidence: https://docs.aws.amazon.com/nova/latest/nova2-userguide/nova-multi-turn-rl.html | Tier 1 | documentation of support | "Instead of evaluating one reply in isolation, multi-turn RL evaluates the entire trajectory of steps the model takes - including tool calls, code execution, and web searches - to reach a final outcome." "Nova Lite 2.0 | us-east-1, us-west-2" (accessed 2026-10-17)
- Use in dive: Mental model. This is the agentic RL of area 02 (trajectory-level reward) as an AWS feature; it partly answers U3 from area 02 (multi-turn exists, but on SageMaker, not in Bedrock RFT).

**F06-21. Bedrock RFT's own pages describe single-response grading; multi-turn RL is a SageMaker AI feature.**
- Claim: The Bedrock reward Lambda receives one conversation and returns one score per `id` (F06-6), and Bedrock RFT's flow is prompt, several responses, score (F06-1). The SageMaker MTRL page draws the contrast: multi-turn RL "is different from single-turn RLHF/RLAIF, where a reward is assigned to one output at a time." The Bedrock RFT page does list "Tasks requiring step-by-step reasoning or multi-turn problem solving" as a use case.
- Location: Bedrock RFT page, "Reinforcement fine-tuning applications and scenarios"; SageMaker Developer Guide, "Multi-turn reinforcement learning".
- Verdict: NEW for the two statements. [our reading] Bedrock RFT trains on one model turn per sample; AWS does not state this outright, and the Bedrock "multi-turn problem solving" bullet sits in tension with it (D-type: two first-party pages read differently). Partly resolves U3 of area 02.
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl.html | Tier 1 | definition | "This is different from single-turn RLHF/RLAIF, where a reward is assigned to one output at a time." https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html | Tier 1 | "Tasks requiring step-by-step reasoning or multi-turn problem solving" (accessed 2026-10-17)
- Use in dive: Practical. An agent that calls tools across turns needs the SageMaker MTRL path, not Bedrock RFT. Flag the Bedrock bullet as ambiguous.

### SageMaker AI model customisation (serverless, training jobs, HyperPod)

**F06-22. SageMaker AI model customisation offers five techniques (SFT, DPO, RFT, MTRL, continuous customisation), two training types (LoRA, full fine-tuning) and three infrastructure options (serverless, training jobs, HyperPod).**
- Claim: The overview page structures the choice on three axes: technique, training type, infrastructure. RFT is "Optimize via reward signals (RLVR or RLAIF)"; MTRL is "Train agents for multi-step agentic tasks"; continuous customisation chains techniques. Serverless is "Fully managed, no instance selection"; training jobs are "Ephemeral jobs where you select instance type" using recipes; HyperPod is "Persistent clusters with fault recovery" using recipes on EKS or Slurm.
- Location: SageMaker AI Developer Guide, "Model customization", section "Overview".
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models.html | Tier 1 | definition | "DPO (Direct Preference Optimization) - Train on preferred vs rejected response pairs." "RFT (Reinforcement Fine-Tuning) - Optimize via reward signals (RLVR or RLAIF)." "MTRL (Multi-Turn Reinforcement Learning) - Train agents for multi-step agentic tasks." "HyperPod - Persistent clusters with fault recovery. Uses Recipes for distributed training on EKS or Slurm." (accessed 2026-10-17)
- Use in dive: The map for the AWS section: one table, three axes.

**F06-23. Serverless customisation also exposes "training session APIs" that give the customer control of the training loop without managing GPUs.**
- Claim: The overview says serverless "also supports training session APIs, which give you full control over your training loop without managing GPU infrastructure." A page "Training session APIs" (`customizing-models-training-sessions.html`) exists in the TOC.
- Location: SageMaker AI Developer Guide, "Model customization", "Overview", Serverless bullet; TOC.
- Verdict: NEW for the statement; the API surface (which primitives, whether custom losses or custom RL algorithms are allowed) is U7.
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models.html | Tier 1 | documentation of support | "Serverless model customization also supports training session APIs, which give you full control over your training loop without managing GPU infrastructure." (accessed 2026-10-17)
- Use in dive: Potentially the middle path between "managed RFT with fixed GRPO" and "run verl on HyperPod". Needs U7 resolved before the dive leans on it.

**F06-24. The serverless open-weight table covers SFT, DPO, RLVR and RLAIF, each with LoRA or full fine-tuning, across Qwen, DeepSeek distills, Gemma 4, Llama 3.x, Ministral 3, Nemotron 3 and gpt-oss.**
- Claim: The "Supported models and customization types" table has columns SFT, DPO, RLVR, RLAIF, each split into LoRA and FFT. Examples: Qwen3 32B and Qwen3 0.6B to 14B have all eight; gpt-oss-20B has all eight; gpt-oss-120B, Llama 3.1 8B, Llama 3.2 1B and 3B, and Nemotron 3 Super 120B are LoRA-only across all four techniques; Qwen3.6 A3B 35B lacks DPO.
- Location: SageMaker AI Developer Guide, "Open weight model customization", section "Supported models and customization types".
- Verdict: NEW (row-level details as read on the access date; the table changes often)
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-open-weight.html | Tier 1 | documentation of support | "The following table shows the supported fine-tuning recipes for each model, including SFT, DPO, RLVR, and RLAIF with LoRA or full fine-tuning (FFT)." Row "OpenAI | GPT OSS 120B | openai-reasoning-gpt-oss-120b | ✓ | | ✓ | | ✓ | | ✓ |" (LoRA columns only) (accessed 2026-10-17)
- Use in dive: Practical. For open weights, SageMaker serverless covers far more models than Bedrock RFT (three models, F06-2).

**F06-25. Serverless training provisions P5, P4de, P4d or G5 instances automatically; the customer does not pick hardware.**
- Claim: The serverless page lists "automatic provisioning of GPU instances (P5, P4de, P4d, G5) based on model size and training requirements" and automatic cleanup after training.
- Location: SageMaker AI Developer Guide, "Serverless model customization", "Key concepts", "Serverless training".
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/customize-model.html | Tier 1 | documentation of support | "This includes automatic provisioning of GPU instances (P5, P4de, P4d, G5) based on model size and training requirements, pre-optimized training recipes that incorporate best practices for each customization technique, real-time monitoring with live metrics and logs accessible through the UI, and automatic cleanup of resources after training completion to optimize costs." (accessed 2026-10-17)
- Use in dive: Practical. No Trainium in the serverless list.

**F06-26. In SageMaker, the RL "evaluator" is either a reward function (code, for RLVR) or a reward prompt (natural language for an LLM judge, for RLAIF), and evaluators are shareable assets with lineage.**
- Claim: Serverless customisation names "evaluators" as assets: "reward functions (code-based logic that scores model outputs ... used in RLVR training and custom scorer evaluation) or reward prompts (natural language instructions that guide an LLM to judge the quality of model responses, used in RLAIF training and LLM-as-a-judge evaluation)". Models, datasets and evaluators can be shared across accounts through AWS RAM, with lineage across SageMaker AI and Bedrock.
- Location: SageMaker AI Developer Guide, "Serverless model customization", "Key concepts" ("AI model customization assets", "Lineage", "Cross-account sharing").
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/customize-model.html | Tier 1 | definition | quoted above; "The ability to share models, datasets, and evaluators across AWS accounts using AWS Resource Access Manager (RAM) while maintaining complete lineage visibility." (accessed 2026-10-17)
- Use in dive: Mental model. AWS treats the grader as a first-class, versioned artefact used both to train and to evaluate, which is the dive's point that the reward is the specification.

**F06-27. SageMaker RLVR is GRPO with exposed clip, KL and group-size knobs, and its dataset schema and preset rewards match the open-source verl trainer's.**
- Claim: The RLVR hyperparameter table includes `clip_ratio` ("GRPO clipping parameter. Limits policy change per update."), `clip_ratio_high` and `clip_ratio_low` (0.0 to 0.5), `kl_loss_coef` (0 to 0.1) and `use_kl_loss`, `rollout_n` (1, 2, 4, 8, 16, 32 "Candidate responses per prompt during rollouts"), `rollout_temperature`, and `global_batch_size` (128 to 1024). The dataset record uses `data_source`, `prompt`, `ability`, and `reward_model` with `style` "rule" and `ground_truth`; preset reward functions are `gsm8k`, `prime_code`, `prime_math`. RLAIF uses `reward_model.style` "llmj" and judge templates such as `cot.jinja` and `evaluate.jinja`.
- Location: SageMaker AI Developer Guide, "RFT", sections "RLVR", "Dataset format", "Preset reward functions", "RLVR LoRA hyperparameters", "RLAIF", "Judge templates".
- Verdict: NEW for the documented fields. [SPECULATIVE, our reading] the schema (`data_source`, `ability`, `reward_model.style`, `ground_truth`) and the three preset names match verl's data format and its `reward_score` modules; checked against the recipes repo in F06-3x below.
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models-rft.html | Tier 1 | documentation of support | "clip_ratio | float | Required | 0.1-1.5 | GRPO clipping parameter. Limits policy change per update." "rollout_n | integer | Required | 1, 2, 4, 8, 16, 32 | Candidate responses per prompt during rollouts." "reward_model.style - set to \"rule\" for programmatic verification" "gsm8k - Grade school math verification", "prime_code - Code correctness verification", "prime_math - Mathematical reasoning verification" (accessed 2026-10-17)
- Use in dive: Mental model. Separate clip-high and clip-low is the DAPO "clip-higher" fix from area 02 surfacing as a console field. [our reading] for the DAPO link.

**F06-28. AWS's own multi-turn RL page teaches RL vocabulary (agent, environment, state, action, reward, policy, episode, trajectory, cumulative reward) with a support-ticket analogy.**
- Claim: The MTRL page defines each term and states that the goal is "to learn a policy (model behavior) that maximizes cumulative reward across the whole sequence rather than optimizing for any one step in isolation". It separates agent from model: "the agent is powered by an AI model, but the two are not the same thing."
- Location: SageMaker AI Developer Guide, "Multi-turn reinforcement learning", sections "A simple analogy", "Key terminology".
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl.html | Tier 1 | definition | "The model is the underlying neural network; the agent is the broader system that uses it to perceive, decide, and act." "Trajectory: the full sequence of states, actions, and rewards recorded across an entire episode." (accessed 2026-10-17)
- Use in dive: A first-party glossary the reader already trusts. Useful for the getting-started section.

**F06-29. SageMaker multi-turn RL supports Nova Lite 2.0 and GPT-OSS-20B (us-east-1, us-west-2), and Gemma-4-31B-it and Qwen 3.6 27B (us-west-2), billed on prefill, sample and train.**
- Claim: The MTRL page's supported-models table lists four models with Regions. Charges have three dimensions: prefill (input tokens per training step, including conversation history), sample (tokens generated during rollout), train (the backward pass).
- Location: SageMaker AI Developer Guide, "Multi-turn reinforcement learning", sections "Supported models", "Pricing".
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl.html | Tier 1 | documentation of support; pricing basis | "Nova Lite 2.0 | IAD (us-east-1), PDX (us-west-2) | GPT-OSS-20B | IAD (us-east-1), PDX (us-west-2) | Gemma-4-31B-it | PDX (us-west-2) | Qwen 3.6 27B | PDX (us-west-2)" "Sample: the cost of the tokens the model generates during the training rollout." (accessed 2026-10-17)
- Use in dive: Practical. Token-metered agentic RL: long multi-turn histories cost prefill on every step, so trajectory length is a budget line. [our reading] on the budget framing.

**F06-30. In SageMaker multi-turn RL, the customer's agent runs the episode and reports the reward; SageMaker serves the policy model and trains it.**
- Claim: SageMaker sends prompts to the customer's agent; the agent calls the policy model through the SageMaker AI Job Runtime Service (`https://job-runtime.sagemaker.region.api.aws`), takes actions such as tool calls, then calls `CompleteRollout` and `UpdateReward`. `Sample` and `SampleWithResponseStream` are OpenAI-compatible. The agent is hosted either on Bedrock AgentCore Runtime ("works best for agents built with the Strands SDK") or anywhere (EKS, EC2, own infrastructure) behind a Lambda forwarder.
- Location: SageMaker AI Developer Guide, "Preparing your agent", sections "Agent code integration overview", "SageMaker AI Job Runtime Service", "Agent deployment options".
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl-agent.html | Tier 1 | documentation of support (documented interface) | "Your agent processes each prompt, calls the policy model for a response, and takes actions in your environment such as calling tools. The policy model is the model being trained." "Based on the outcome, your agent reports a reward back to SageMaker AI to complete the training loop." "UpdateReward | Report the reward score for the complete rollout | After computing reward, typically called with CompleteRollout" "Bring your own agent: Host your agent in any environment, including Amazon EKS, Amazon EC2, or your own infrastructure, and connect it to the training loop through a Lambda forwarder." (accessed 2026-10-17)
- Use in dive: Mental model. The environment and reward live in the customer's agent code; the trainer only sees prompts, sampled turns and one reward per rollout. That is the agent-environment split from area 02 drawn as AWS APIs.

**F06-31. SageMaker training session APIs expose `sample()`, `forward_backward()` and `optim_step()` as calls on a stateful serverless GPU session, so the customer writes the RL algorithm.**
- Claim: The page says existing high-level APIs prevent custom losses and "frontier reinforcement learning (RL) with elastic rollouts". With sessions, the customer opens a session, calls `forward_backward()`, `optim_step()` and `sample()`, and composes them; "The model stays loaded on GPUs across calls". The example builds a LoRA client on `gpt-oss-20b` and runs a loop of `sample(..., num_samples=4)`, `forward_backward(..., loss_fn="ppo")`, `optim_step(AdamParams(learning_rate=5e-5))`, `save_weights_and_get_sampling_client()`. Listed users include "Teams building custom loss functions, such as group relative policy optimization (GRPO), DRO, and DAPO." "Technique-agnostic: Implement SFT, proximal policy optimization (PPO), GRPO, multi-turn RL, or any custom procedure."
- Location: SageMaker AI Developer Guide, "Training session APIs", intro, code sample, "Who it is for", "Key differentiators".
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models-training-sessions.html | Tier 1 | definition; documentation of support | "instead of submitting a complete training script, you open a session and call operations like forward_backward(), optim_step(), and sample() as API calls, and compose them into whatever training procedure your technique requires. The model stays loaded on GPUs across calls, and the service handles distributed execution, gradient synchronization, and tenant isolation." `tc.forward_backward(build_batch(rollouts), loss_fn="ppo").result()` (accessed 2026-10-17)
- Use in dive: The most important AWS fact for a research-minded team: own the algorithm, not the cluster. It sits between Bedrock RFT (fixed GRPO) and HyperPod (own everything).

**F06-32. Training session APIs support GPT-OSS-20B (us-east-1, us-west-2, ap-south-1), Gemma-4-31B-it and Qwen-3.6-27B (us-west-2, ap-south-1), with a default quota of 2 concurrent sessions, and the same prefill, sample, train pricing dimensions.**
- Claim: The supported-models table and quota table as read.
- Location: "Training session APIs", sections "Supported models, pricing, and Regions", "Quotas".
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models-training-sessions.html | Tier 1 | documentation of support | "GPT-OSS-20B | us-east-1, us-west-2, ap-south-1 | Gemma-4-31B-it | us-west-2, ap-south-1 | Qwen-3.6-27B | us-west-2, ap-south-1" "Maximum number of concurrent fine-tuning training sessions | 2 | Yes" (accessed 2026-10-17)
- Use in dive: Practical. Three models; ask for a quota raise before a sweep.

**F06-33. SageMaker multi-turn RL exposes the advantage estimator and the loss as choices: nine advantage methods (including GRPO-style group, RLOO, REINFORCE++, GRPO pass@k) and three losses (importance sampling, PPO, CISPO), with group size 8 by default.**
- Claim: The MTRL hyperparameters reference lists `advantage_method` default `group_based` with values `monte_carlo, group_based, group_based_per_turn, rloo, reinforce_pp, reinforce_pp_baseline, opo, grpo_passk, gpg`; `loss_fn` default `ppo` with values `importance_sampling, ppo, cispo`; `group_size` default 8, range 2 to 32 ("Rollouts per prompt used to compute group-based advantages (GRPO / RLOO)"); `clip_low_threshold` 0.8 and `clip_high_threshold` 1.2 by default; `rollout_timeout` default 600 seconds, range 300 to 86400; `rollout_max_concurrency` default 96; `sampling_max_tokens` per turn default 4096. It recommends `importance_sampling` for newcomers and notes CISPO needs a wide asymmetric clip (example `clip_high_threshold = 6.0`).
- Location: SageMaker AI Developer Guide, "Hyperparameters reference" (multi-turn RL), parameter table and guidance sections "Loss function and clipping range", "Batch size and group size".
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl-hyperparams.html | Tier 1 | documentation of support | "| RL | advantage_method | group_based | monte_carlo, group_based, group_based_per_turn, rloo, reinforce_pp, reinforce_pp_baseline, opo, grpo_passk, gpg | Method for computing advantages for rollouts." "| RL | loss_fn | ppo | importance_sampling, ppo, cispo | RL loss formulation." "| Rollout | rollout_timeout | 600 | [300, 86400] |" (accessed 2026-10-17)
- Use in dive: Mental model. The GRPO successors from area 02 (RLOO, REINFORCE++) appear as a dropdown; the reader can see they are interchangeable advantage estimators over the same rollouts. Practical: an agent episode may run up to 24 hours, against 15 minutes for a Bedrock reward Lambda (F06-7).

**F06-34. AWS states the zero-advantage trap directly: if every rollout in a group gets the same reward, the group produces no gradient.**
- Claim: The guidance says that in sparse-reward environments many groups score identically, "yielding zero advantage for the entire group. Only groups with mixed outcomes produce gradient signal", and "If all rollouts receive the same reward (all succeed or all fail), the advantage is zero and the group produces no gradient signal." Total rollouts per step equal `global_batch_size` times `group_size`.
- Location: "Hyperparameters reference" (multi-turn RL), guidance on reward density and on "Batch size and group size".
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl-hyperparams.html | Tier 1 | definition | "Only groups with mixed outcomes produce gradient signal" "If all rollouts receive the same reward (all succeed or all fail), the advantage is zero and the group produces no gradient signal." "Total rollouts per step = global_batch_size x group_size." (accessed 2026-10-17)
- Use in dive: Mental model, first-party. Pairs with F06-9 (Bedrock: 0 percent reward means SFT first). One idea, stated by two AWS services.

**F06-35. Training session APIs accept four loss functions: `cross_entropy`, and `ppo`, `importance_sampling`, `cispo`, which take log-probabilities and advantages from the caller.**
- Claim: The Python SDK reference table maps `cross_entropy` to one input set and `ppo, importance_sampling, cispo` to inputs including `logprobs, advantages`; the example passes `"advantages": TensorData([0.0, 1.5, 1.5], shape=[3])`. The caller computes advantages, so the advantage estimator (GRPO, RLOO, or other) is customer code.
- Location: SageMaker AI Developer Guide, "Python SDK reference" (training session APIs), loss function inputs table and examples.
- Verdict: NEW for the documented loss list. [our reading] that advantage estimation is the caller's job follows from `advantages` being an input.
- Evidence: https://docs.aws.amazon.com/sagemaker/latest/dg/training-sessions-sdk.html | Tier 1 | documentation of support (documented interface) | "Each loss function requires specific loss_fn_inputs keys." table rows "cross_entropy" and "ppo, importance_sampling, cispo ... logprobs, advantages" (accessed 2026-10-17)
- Use in dive: Practical. GRPO here is about 20 lines of the customer's Python around `sample()`; the service owns the GPUs and the gradient step.

**F06-36. Dates: serverless model customisation (with RL and DPO) launched 3 December 2025; multi-turn RL launched 3 June 2026.**
- Claim: The December post names Nova, Llama, Qwen, DeepSeek and GPT-OSS and four Regions (Europe (Ireland), US East (N. Virginia), Asia Pacific (Tokyo), US West (Oregon)). The June post says MTRL trains "against your own agent environment", supports AgentCore Runtime, EKS, EC2, Fargate or any infrastructure, includes MLflow trajectory tracking and evaluation jobs reporting "reward, pass@k, and trajectory metrics", and bills "only for the tokens processed". No What's New post for training session APIs was found in the search run for this file (U8).
- Location: AWS What's New, two posts.
- Verdict: NEW
- Evidence: https://aws.amazon.com/about-aws/whats-new/2025/12/new-serverless-model-customization-capability-amazon-sagemaker-ai/ | Tier 2 | launch announcement | "Posted on: Dec 3, 2025" "They can use supervised fine-tuning and the latest customization techniques such as reinforcement learning and direct preference optimization." https://aws.amazon.com/about-aws/whats-new/2026/06/multi-turn-reinforcement-learning-on-sagemaker-ai/ | Tier 2 | launch announcement | "Posted on: Jun 3, 2026" "Multi-turn RL extends this by training models against your own agent environment and rewarding the full sequence of decisions an agent makes across a task" (accessed 2026-10-17)
- Use in dive: Dating. Bedrock RFT and SageMaker serverless RL launched the same day; agentic RL followed six months later.

## AWS options table

(to be filled)

## Decision notes

(to be filled)

## UNKNOWN register

(to be filled)

## Reading path

(to be filled)

## Source list by tier

(to be filled)
