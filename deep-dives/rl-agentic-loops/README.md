# RL and Agentic Learning Loops

**Status: scoped, not built.** Research wave 1 and the scope are done; there is no app yet (no `package.json`, no `src/`). The build waits on Gate 1 in `RESEARCH-GUIDE.md` section 7.

## Topic

Reinforcement learning (RL) for language models, and the agentic loops that get an RL-like improvement through words instead of weight updates: language feedback, self-reflection, critiques, evolving prompts, playbooks, memories and skills that accumulate across episodes. Written for a technical lead who builds agentic tooling daily and has no formal RL background.

The dive answers four questions: what RL actually does to a model; which parts of that effect a loop can reproduce in text with a frozen model; where the text version falls short; and how to choose between them.

## What the research found so far

Each point carries the claim-register IDs behind it (files in `research/2026-10/`).

- Every method runs one loop: sample, score, update. RL updates the weights, a text loop updates the context a frozen model reads, and a hybrid trains a small model that writes context for a frozen large one (F04-55, F03-105).
- On the tested models and benchmarks, RL with verifiable rewards mostly makes answers the base model could already sample more likely; pass@1 rises while pass@k at large k holds or falls. The boundary moves when the parts exist but the combination does not, when training sits at the edge of competence, or when new information enters (F02-40, F02-47, F02-49, F02-50, F02-61).
- The best same-model comparison located: on Qwen3 8B over six tasks, reflective prompt evolution (GEPA) scored 54.85 against GRPO's 48.91 with 1,839 to 7,051 rollouts against 24,000, and GRPO won the hardest math task (F03-61, F03-62).
- The feedback signal decides whether a text loop learns. Reflexion without its tests scored 0.52 against a 0.60 no-reflection baseline; with tests, 0.68 (F04-21).
- Text loops are cheap to train and pay on every query; RL is expensive to train and cheap to serve. One paper's pair: about $18 against about $10,000 to train, $0.02 against $0.005 per problem to serve, under the authors' price assumptions (F03-91).
- AWS offers RL as a managed product: Amazon Bedrock reinforcement fine-tuning trains with GRPO against a customer Lambda or a model-as-judge reward (F06-1, F06-4).

## Files

| Path | What it holds |
|---|---|
| `SCOPE.md` | Thesis, the 25-section plan in seven layers with a depth tag and a paragraph per section, key sources, adversarial review notes |
| `RESEARCH-GUIDE.md` | Research waves and their questions, the reading path, the evidence bar per claim type, the UNKNOWN register, Tier 0 experiments, gates before the build |
| `research/2026-10/01-rl-foundations.md` | Claim register: RL vocabulary on tokens, policy gradient, PPO, KL, RLHF, DPO family, RLAIF |
| `research/2026-10/02-rlvr-agentic-rl.md` | Claim register: GRPO and successors, trainer defaults, the capability debate, agentic RL, reward hacking |
| `research/2026-10/03-learning-in-words.md` | Claim register: Reflexion to GEPA, ACE, Training-Free GRPO, evolutionary search, Advisor Models |
| `research/2026-10/04-theory-limits.md` | Claim register: in-context RL, exploration, credit assignment, context limits, autoresearch, Ralph, the adaptation taxonomy |
| `research/2026-10/05-rl-systems.md` | Claim register: the RL step as a system, frameworks, asynchronous designs, run costs, DGX Spark feasibility |
| `research/2026-10/06-aws-paths.md` | Claim register: Bedrock reinforcement fine-tuning, Nova and SageMaker AI customisation, HyperPod, Trainium, AgentCore Memory |
| `reviews/2026-10/` | The three adversarial reviews of the scope |
| `sources.md` | Every source used, grouped by tier, with access dates |

## Sources

See `sources.md`. Sources are tiered: Tier 0 our experiments, Tier 1 pinned code and first-party docs, Tier 2 first-party lab and vendor posts, Tier 3 papers (peer-reviewed or preprint marked), Tier 4 inspiration only.
