# Learning From Feedback: RL and Agentic Learning Loops

Interactive single-page app about reinforcement learning (RL) for language models and the agentic
loops that get an RL-like improvement through words instead of weight updates: reflections,
critiques, evolving prompts, playbooks, memories and skills that accumulate across episodes. Written
for a technical lead who builds agentic tooling daily and has no formal RL background.

**Status: built.** 24 sections, every source read 2026-10-30. Framework code is cited at pinned
tags: Hugging Face TRL v1.16.0 (PPO at v1.12.0, the last tag that ships it), verl v0.9.1, OpenRLHF
v0.11.2, slime v0.4.0, prime-rl v0.10.0, vLLM v0.28.0, DSPy 3.4.1 with gepa v0.1.4, and
autoresearch and the SageMaker HyperPod recipes at commit SHAs. arXiv links carry their version.

## The four questions

1. What does RL do to a model? (section 8)
2. Which part of that effect can a loop reproduce in words with a frozen model? (the end of
   section 8, then sections 11 to 16)
3. Where do the words fall short? (section 17)
4. How do you choose between a text loop, a hybrid and a weight update? (section 22)

## Key takeaways

- Every method runs one loop: sample attempts, score them, change something so the next attempts
  score better. RL changes the weights, a text loop changes the context a frozen model reads, and a
  hybrid trains a small model that writes context for a frozen large one.
- On the tested models and benchmarks, RL with verifiable rewards mostly makes answers the base
  model could already sample more likely: pass@1 rises while pass@k at large k holds or falls. A
  frozen model can buy part of that back per query, at about 8.84 times the tokens in one paper's
  MATH500 setting.
- The best same-model comparison located: on Qwen3 8B over six tasks, reflective prompt evolution
  (GEPA) reached 54.85 against 48.91 for LoRA GRPO and 45.23 for the base model, with 1,839 to 7,051
  rollouts against 24,000; GRPO won AIME-2025.
- The signal decides whether either kind of loop learns, and it is the surface that gets gamed. A
  Reflexion loop without its tests scored below no reflection at all (0.52 against 0.60 on the 50
  hardest HumanEval Rust problems with GPT-4).
- Words fall short where the gap is reasoning skill, behaviour that varies per input, exploration,
  or long-horizon credit assignment.
- Cost is a breakeven between paying once in training and paying on every query; section 20 ships
  a calculator for the reader's own rates and volume.

## Our own experiment (Tier 0)

E0, a GRPO smoke test on a DGX Spark (2026-10-30): TRL 1.16.0 with vLLM 0.28.0 colocated trained
Qwen2.5-0.5B-Instruct on one GB10 at about 2.1 s per step, with 62% of step time in generation, a
6.5% to 6.8% extra forward pass for the default vLLM-trainer mismatch correction, and 17 ms of
weight sync. At a 4% base rate, 9 and 10 of 20 steps carried no gradient. Results, scripts and raw
logs: `research/2026-10/E0-spark-smoke.md` and `research/2026-10/E0-spark-smoke/`. Sections 3, 5,
7, 19, 21 and 22 place E0's figures. E1 (one task, three learners) ships as a protocol with
predictions in section 21; it was not run.

## Section map

24 sections in the left navigation.

- Framing (1-2): One Loop, Three Places to Keep What It Learns; Getting Started.
- The RL vocabulary (3-6): the language model as a policy, policy gradient, PPO's clip and the KL,
  preferences to rewards (RLHF, DPO, AI feedback).
- RL with verifiable rewards (7-10): RLVR and GRPO, what RL does to a model, agentic RL, the reward
  as a proxy.
- Learning in words (11-16): the text loop as RL on the context, verbal reinforcement and
  self-correction, memories and playbooks, prompt optimisation, the reader's own loops through the
  RL lens, hybrids.
- Limits (17-18): where words fall short, what lives in weights and what lives in context.
- Systems and cost (19-20): the RL step as an inference job inside a training job, cost per
  improvement with the breakeven calculator.
- Practice (21-23): side by side on a DGX Spark, choosing, RL and learning loops on AWS.
- Glossary & Sources (24).

## Layout

| Path | What it holds |
|---|---|
| `SCOPE.md` | Thesis, the 24-section plan with depth, payoff and content per section, review notes |
| `RESEARCH-GUIDE.md` | Research waves, evidence bar, the UNKNOWN register with its Gate 1 triage, Tier 0 experiments, the Gate 1 record |
| `research/2026-10/01-*.md` to `06-*.md` | Claim registers: RL foundations, RLVR and agentic RL, learning in words, theory and limits, RL systems, AWS paths |
| `research/2026-10/wave2-*.md` | Wave 2 refutation verdicts; a verdict overrides the register row it names |
| `research/2026-10/E0-spark-smoke*` | The Tier 0 experiment: write-up, scripts, package versions, raw logs |
| `reviews/` | Scope reviews, the per-section fact checks, Gate 3 scores and the leverage pass |
| `revamp/` | Authoring brief, dispatch plan, build log, per-section claim lists, fact-check and leverage prompts, tools (`tools/shoot.mjs` renders sections and reports diagram overlaps; `tools/gen-sources.mjs` writes `sources.md`) |
| `src/` | Vite + React + TypeScript + Cloudscape app; `src/lib/breakeven.ts` is the cost calculator, tested in `src/__tests__/` |
| `sources.md` | Generated from the inline citations, grouped by tier. Regenerate with `node deep-dives/rl-agentic-loops/revamp/tools/gen-sources.mjs` |

## Sources

Sources are tiered: Tier 0 our experiment, Tier 1 pinned code and first-party docs, Tier 2
first-party lab and vendor posts (their figures stay claims), Tier 3 papers (venue or preprint
marked), Tier 4 inspiration only and never cited. See `sources.md` and section 24.

## Build

```bash
pnpm --filter @tech-deep-dives/rl-agentic-loops dev
pnpm --filter @tech-deep-dives/rl-agentic-loops build
bash scripts/ci.sh
```
