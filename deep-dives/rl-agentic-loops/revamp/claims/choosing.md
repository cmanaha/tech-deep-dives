# Claims: section 22, Choosing a Text Loop, a Hybrid or a Weight Update (`Choosing.tsx`)

Authored 2026-10-30. One line per assertion: `claim | source URL | register or wave 2 row`.
Sources re-opened on 2026-10-30 with plain `curl` (no custom headers), text extracted locally:
Bedrock RFT user guide (best practices, GRPO sentence, supported-models table); SageMaker AI
model customization overview; SageMaker AI training session APIs; SageMaker AI MTRL
hyperparameters; Bedrock Advanced Prompt Optimization "how it works"; AgentCore optimization;
AgentCore episodic memory strategy; OpenAI RFT guide; arXiv PDFs 2503.14476v2 (Sec 3.2),
2501.12948v2 (Supplementary F.1, Table 16), 2506.13131v1 (Sec 3.3.1, Sec 6), 2510.14901v1
(Sec 5.3), 2507.19457v2 (Table 1), 2510.02453v3 (Sec 4.4.3, PMLR header); arXiv abstracts
2209.15189v1 and 2310.11324v2; GitHub tree of aws/sagemaker-hyperpod-recipes at
a6030c319908c8a1b74cb619b00476f8e6baa04f (HTTP 200). E0 log read at
`research/2026-10/E0-spark-smoke.md`.

Notes for the fact checkers:
- New beyond the rows: the OpenAI page now adds "Eligible existing customers can create training
  jobs until January 6, 2027" next to "no longer accessible to new users" (wave2-foundations G3
  quoted only the second sentence).
- Numbers carried from owning sections, identical: E0 0.044 / about 4% / 9 and 10 of 20 (section 7);
  8.84x (section 8); 54.85 / 48.91 / 45.23, 1,839 to 7,051 against 24,000, AIME 38.00 against 32.00
  (section 14); about 70% (section 16); 72.6 against 47.0 (section 7); up to 76 points (section 18).
- The decision tree, its three gap kinds, the per-leaf conditions and the "go on" between the
  thresholds are our synthesis of sections 7, 8, 10, 16, 18 and 20 (caption says so).
- AlphaEvolve's "better performance" reason is kept in the quote and the page says no RL figures
  are published (register 03 U6; wave2-aws row 37).
- F02-12 is attached only to "distillation also wins where a stronger teacher exists"; the
  near-zero condition is cited to F06-9 alone (wave2-aws row 35).

## Intro
- Every method runs one loop (sample, score, change); a text loop writes into context, a hybrid trains a small model whose output is words, a weight update changes the model (framing) | SCOPE thesis | thesis (no number)
- On our DGX Spark GRPO run, a base rate of about 4% left 9 of 20 steps (run 1) and 10 of 20 (run 2) with no gradient [Tier 0] | research/2026-10/E0-spark-smoke.md (E0_URL) | E0; build-log cross-section E0 numbers
- GRPO scores each answer against the others sampled for the same prompt (gloss) | section 7 | wave2-rlvr G6 (expansion)

## Diagram
- Three questions in order; exits for no trustworthy signal, near 0%, above 95%; six leaves (text loop, distil the playbook, inference-time sampling, RFT, advisor, distillation or RFT); output format contested [our synthesis] | sections 7, 8, 10, 16, 18, 20; thresholds below | SCOPE section 22
- Diagram numbers: 0% and 95% only, both cited in Q2 | https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html | F06-9; wave2-aws row 5

## Question 1
- Section 18's map and table are the input; three kinds of gap (instructions/facts/procedures to context; sharpening to sampling or RL; skill, per-input, latency, calibration to weights) [our synthesis of section 18] | src/sections/WeightsVsContext.tsx L52-L117, L363-L427 | SCOPE sections 18, 22
- pass@k defined as the chance at least one of k attempts is right | section 8 / 18 definitions | definition
- Per-input behaviour can live in a small advisor's weights | section 16 (Advisor Models) | F03-107; wave2-words row 14
- Formatting moved few-shot accuracy by up to 76 points on LLaMA-2-13B; sensitivity remains after instruction tuning | https://arxiv.org/abs/2310.11324v2 (abstract) | F04-52; wave2-limits (section 18 rows)

## Question 2
- Three grades of signal: programmatic verifier, judge checked against labels, nothing trustworthy; then build the grader against section 10's four checks [our framing per SCOPE] | SCOPE section 22; src/sections/RewardIsAProxy.tsx L904-L990 | SCOPE section 22, section 10 checklist
- A group whose answers all score the same has zero advantage and zero gradient, all passing or all failing | https://arxiv.org/abs/2503.14476v2 (Sec 3.2); https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl-hyperparams.html | F02-22, F06-34; wave2-aws rows 15, 34
- Near 0% nothing to push on; near 100% nothing left to learn | same | F02-22; wave2-aws row 34
- AWS triage rule: consistently 0 percent, use SFT first to establish basic capabilities; above 95 percent RFT might be unnecessary | https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html ("Reinforcement fine-tuning best practices") | F06-9; wave2-aws row 5
- E0 conditions: Qwen2.5-0.5B-Instruct, fresh synthetic arithmetic scored 1 for the exact integer, two runs of 20 steps, 2 prompts x 8 completions per step; mean reward 0.044; 9 and 10 of 20 steps every group zero, no gradient [Tier 0] | E0_URL | E0 (log lines 42-60, 143-145)
- Section 7 turns a base rate into the share of silent groups | src/sections/RlvrAndGrpo.tsx L1089-L1095 | pointer
- Always- or never-solved prompts cost a full group of rollouts and teach nothing; drop or replace them | src/sections/RlvrAndGrpo.tsx L1050-L1064, L1148-L1155 (DAPO Sec 3.2) | F02-22
- Expandable: DAPO quotes "if all outputs ... zero policy gradients", "over-sample and filter out prompts with the accuracy equal to 1 and 0" | https://arxiv.org/abs/2503.14476v2 (Sec 3.2) | F02-22; wave2-rlvr rows 15, 22
- Expandable: SageMaker "If all rollouts receive the same reward (all succeed or all fail), the advantage is zero and the group produces no gradient signal." | https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl-hyperparams.html | F06-34; wave2-aws row 15
- Expandable: E0 used TRL v1.16.0 with vLLM 0.28.0 on one DGX Spark, single seed, learning rate 1e-6; reward did not move [Tier 0] | E0_URL | E0 ("What this run does not show")
- DAPO expansion "Decoupled Clip and Dynamic sAmpling Policy Optimization" | https://arxiv.org/abs/2503.14476v2 | wave2-rlvr G6

## Question 3
- With an API model: text loop, inference-time sampling, advisor [our synthesis] | sections 8, 14, 16 | SCOPE section 22
- OpenAI is winding down its fine-tuning platform; no longer accessible to new users; eligible existing customers can create training jobs until January 6, 2027 | https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning | wave2-foundations G3 (date new, read at source)
- Weight update paid once, served at normal price; inference-time sharpening paid per query [section 8's reading] | src/sections/WhatRlDoes.tsx L848-L856 | SCOPE section 8
- One training-free sampler: about 8.84x the tokens per answer in the MATH-500 setting | https://arxiv.org/abs/2510.14901v1 (Sec 5.3) | F02-58
- A text loop pays for instructions on every call; section 17 covers prompt caching [pointer] | src/sections/WeightsVsContext.tsx L90-L95, L740-L746 | F04-45
- Low volume favours per-query paths; high volume favours paying once [our reading] | SCOPE section 20 mental model | SCOPE section 20

## Six paths
- Inference-time sampling: best-of-K with grader or a verifier-free sampler; neither past base pass@K | src/sections/WhatRlDoes.tsx L760-L870 | F02-58, F02-40; SCOPE section 8
- Inference-time sampling needs no dedicated AWS service, runs against any endpoint [our reading] | SCOPE section 23 | SCOPE section 23 (R2b)
- Text loop: default first move for instructions and procedures [SCOPE] | SCOPE section 22 | SCOPE section 22
- GEPA on Qwen3 8B: 54.85 aggregate vs 48.91 LoRA GRPO vs 45.23 base; 1,839 to 7,051 rollouts vs 24,000; GRPO won AIME-2025 38.00 vs 32.00 | https://arxiv.org/abs/2507.19457v2 (Table 1) | F03-61, F03-62, F04-46; wave2-words rows 3, 6
- Bedrock Advanced Prompt Optimization rewrites prompts against a metric, LLM-as-a-judge rubric or Lambda | https://docs.aws.amazon.com/bedrock/latest/userguide/advanced-prompt-optimization-how.html | F06-57; wave2-aws row 27
- AgentCore optimization recommends changes to system prompts and tool descriptions against a target evaluator | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization.html | F06-53; wave2-aws row 28
- AgentCore Memory episodic strategy writes reflections across episodes | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/episodic-memory-strategy.html | F06-51; wave2-aws row 30
- Advisor: API model, per-input behaviour; in the one same-model test about 70% of direct RL's gain [derived: (38.98 - 31.17) / (42.38 - 31.17)] | https://arxiv.org/abs/2510.02453v3 (Sec 4.4.3) | F03-108; wave2-words row 15
- Advisor on AWS: small open-weight model trained with SageMaker AI RFT or training session APIs (full control of the training loop without managing GPUs) in front of a Bedrock model [our reading] | https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models-training-sessions.html | F06-24, F06-31; wave2-aws rows 18, 19
- SFT or distillation when base scores near zero | https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html | F06-9; wave2-aws row 35
- At 32B, DeepSeek-R1-Distill-Qwen-32B (SFT on R1 outputs, no RL stage) beat Qwen2.5-32B (Qwen's base) after over 10K RL steps on every benchmark in Table 16; 72.6 vs 47.0 AIME 2024 pass@1 | https://arxiv.org/abs/2501.12948v2 (Supplementary F.1, Table 16) | F02-12; wave2-aws row 35; wave2-rlvr rows 9, 10
- That RL run worked, so distillation beat RL from a base RL could train [our reading, per wave 2] | same | wave2-aws row 35
- SageMaker AI model customisation lists SFT and Distillation ("Transfer knowledge from a teacher model to a student model") | https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models.html | F06-22; wave2-aws row 13, G7 item 2
- RFT when gap is skill or sharpening at high volume, own weights, score between thresholds [SCOPE] | SCOPE section 22 | SCOPE section 22
- Whether RL alone adds new reasoning skill is contested | src/sections/WeightsVsContext.tsx L801-L811 (Yue et al.) | F04-49; wave2-limits row 40
- Bedrock RFT trains with GRPO on three base models | https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html | F06-1, F06-2; wave2-aws rows 6, 8
- SageMaker AI model customisation lists RFT | https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models.html | F06-22; wave2-aws row 13
- Self-managed route: HyperPod GRPO recipes at release 2.0.11 | https://github.com/aws/sagemaker-hyperpod-recipes/tree/a6030c319908c8a1b74cb619b00476f8e6baa04f/hyperpod_recipes/recipes_src/fine-tuning | F06-37, F06-38; wave2-aws row 20
- Distil a playbook once it stops changing [our reading of when] | SCOPE section 22 | wave2-aws row 36
- Context distillation fine-tunes the model to give from the task input alone the answer it gave with instructions; gains otherwise disappear "when the context tokens are gone" | https://arxiv.org/abs/2209.15189v1 (abstract) | F04-45; wave2-aws row 36, wave2-words row 43
- AlphaEvolve's authors name distilling the loop's gains into the next generation of base models as a natural next step | https://arxiv.org/abs/2506.13131v1 (Sec 6) | F03-99; wave2-aws row 36
- While the text is changing, context keeps each edit cheap | src/sections/WeightsVsContext.tsx L740-L746 | section 18 reading
- Playbook distillation on AWS: an SFT job on the model's own answers via SageMaker AI model customisation [our reading] | https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models.html | F06-22

## Auditability
- Text can be read, reviewed and deleted; section 18 counts auditability as a context property; weights leave no such record [our reading] | src/sections/WeightsVsContext.tsx L835-L840 | SCOPE section 18 mental model
- AlphaEvolve chosen over deep RL for data-centre scheduling: "not only leads to better performance, but also offers clear advantages in interpretability, debuggability, predictability, and ease of deployment" | https://arxiv.org/abs/2506.13131v1 (Sec 3.3.1) | F03-97; wave2-aws row 37
- No RL figures published | same | register 03 U6; wave2-aws row 37
- Count auditability toward text or code paths when the artifact must be read, approved or rolled back [our reading] | - | SCOPE section 22

## Start with the grader
- AlphaEvolve's main limitation: "handles problems for which it is possible to devise an automated evaluator" | https://arxiv.org/abs/2506.13131v1 (Sec 6) | F03-99; wave2-aws row 38
- Four grader checks (evaluator code the agent cannot edit, hidden or read-only tests, held-out metric, monitors kept out of the reward) | src/sections/RewardIsAProxy.tsx L904-L990 | section 10 (owner)
- Noise floor: score the unchanged system several times, take the spread, accept gains that clear it or repeat | src/sections/YourLoops.tsx L708-L716 | section 15 (owner); F04-66
- Count prompts that pass every time or never at the planned group size | src/sections/RlvrAndGrpo.tsx L1148-L1155 | section 7 (owner)
- Strongest number, landing 4 and 5: 4% base rate, 9 and 10 of 20 steps no gradient [Tier 0]; consistent 0% to SFT, above 95% RFT might be unnecessary | E0_URL; https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html | E0; F06-9
- Run the cheapest loop first; move to a hybrid or weight update when gains stop clearing the floor and Q1, Q3 point there [our reading] | - | SCOPE section 22 ending

Cited claims: 29 `Cite` elements on the page (Tier 0: 4; Tier 1: 14; Tier 3: 11).
