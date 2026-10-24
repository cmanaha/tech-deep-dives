# RL and Agentic Learning Loops

**Status: scoped, not built.** Research wave 1 and the scope (v2, revised after three adversarial reviews) are done; there is no app yet (no `package.json`, no `src/`). The build waits on Gate 1 in `RESEARCH-GUIDE.md` section 7.

## Topic

Reinforcement learning (RL) for language models, and the agentic loops that get an RL-like improvement through words instead of weight updates: language feedback, self-reflection, critiques, evolving prompts, playbooks, memories and skills that accumulate across episodes. Written for a technical lead who builds agentic tooling daily and has no formal RL background.

The dive answers four questions: what RL actually does to a model; which parts of that effect a loop can reproduce in text with a frozen model; where the text version falls short; and how to choose between them.

## What the research found so far

Each point carries the claim-register IDs behind it (files in `research/2026-10/`).

- Every method runs one loop: sample, score, update. RL updates the weights, a text loop updates the context a frozen model reads, and a hybrid trains a small model that writes context for a frozen large one (F04-55, F03-105).
- On the tested models and benchmarks, RL with verifiable rewards mostly makes answers the base model could already sample more likely; pass@1 rises while pass@k at large k holds or falls. In controlled or small studies the boundary moved when the parts existed but the combination did not, when training sat at the edge of competence, or when new information entered from a teacher or a tool (F02-40, F02-47, F02-49, F02-50, F02-61, F02-62).
- A frozen model can buy part of RL's sharpening back per query: a training-free sampler nearly matched or beat GRPO's single-shot scores on Qwen2.5-Math-7B at about 8.84 times the tokens per answer (F02-58).
- The best same-model comparison located: on Qwen3 8B over six tasks, reflective prompt evolution (GEPA) reached an aggregate 54.85 against 48.91 for LoRA GRPO and 45.23 for the base model, with 1,839 to 7,051 rollouts against 24,000, and GRPO won the one competition-math task (F03-61, F03-62, F04-46).
- The feedback signal decides whether a text loop learns. On the 50 hardest HumanEval Rust problems with GPT-4, Reflexion without its tests scored 0.52 against a 0.60 no-reflection baseline; with tests, 0.68 (F04-21).
- Text loops are cheap to train and pay on every query. One paper's pair, under the authors' price assumptions, is about $18 against about $10,000 to train and $0.02 against $0.005 per problem to serve, but it compares a frozen 671B API model with an RL-trained 32B model at different accuracy, and the authors attribute the serving gap to model size (F03-91, F03-90). The scope's cost section therefore ships a calculator for one base model at the reader's own rates.
- AWS offers both update targets as managed products: Amazon Bedrock reinforcement fine-tuning trains with GRPO against a customer Lambda reward or, for Nova, a hosted judge (F06-1, F06-4, F06-5), and Bedrock Advanced Prompt Optimization and AgentCore optimization rewrite prompts against a customer metric or evaluator (F06-53, F06-57).

## Files

| Path | What it holds |
|---|---|
| `SCOPE.md` | Thesis, the 24-section plan in seven layers with a depth tag, payoff line and paragraph per section, key sources, adversarial review notes |
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
