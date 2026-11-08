# Learning From Feedback: Fine-Tuning, Reinforcement Learning and Agentic Learning Loops

How a language model learns from examples, a teacher's answers, preferences or scores, whether the
change is written into its weights or into the context a frozen model reads, and how to choose
between them.

Interactive single-page app about fine-tuning language models, mostly reinforcement learning (RL),
and the agentic loops that get an RL-like improvement through words instead of weight updates:
reflections, critiques, evolving prompts, playbooks, memories and skills that accumulate across
episodes. It maps every fine-tuning technique by where its learning signal comes from (raw text,
written answers, a teacher, preference pairs, a score on the model's own attempts), builds
supervised fine-tuning (SFT) and distillation before RL, and sets distillation against RL. Written
for a technical reader, level 100 to 200, who builds or runs software and has no formal machine
learning background.

**Status: built.** 27 sections (rebuilt from 24 on 2026-11-07: new sections 3, 4 and 11, reworked
1, 2, 25 and 26). Sources read 2026-10-30, and 2026-11-07 for the fine-tuning rebuild. Framework code is cited at pinned
tags: Hugging Face TRL v1.16.0 (PPO at v1.12.0, the last tag that ships it), verl v0.9.1, OpenRLHF
v0.11.2, slime v0.4.0, prime-rl v0.10.0, vLLM v0.28.0, DSPy 3.4.1 with gepa v0.1.4, and
autoresearch and the SageMaker HyperPod recipes at commit SHAs. arXiv links carry their version.

## The five questions

1. Which fine-tuning technique fits the signal you have? (section 3, then sections 4 and 11)
2. What does RL do to a model? (section 10)
3. Which part of that effect can a loop reproduce in words with a frozen model? (the end of
   section 10, then sections 14 to 19)
4. Where do the words fall short? (section 20, with sections 19 and 21)
5. How do you choose between fine-tuning, a text loop and a hybrid? (section 25)

## Key takeaways

- The signal picks the technique: written answers lead to SFT, a stronger teacher to
  distillation, preference pairs to DPO or RLHF, and a score on the model's own attempts to RL.
  At 32B, distillation from DeepSeek-R1 beat over 10K steps of RL on the same base, 72.6 against
  47.0 pass@1 on AIME 2024; from one Qwen3 8B checkpoint, on-policy distillation beat RL at 1,800
  against 17,920 GPU-hours.
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
- Cost is a breakeven between paying once in training and paying on every query; section 23 ships
  a calculator for the reader's own rates and volume.

## Our own experiment (Tier 0)

E0, a GRPO smoke test on a DGX Spark (2026-10-30): TRL 1.16.0 with vLLM 0.28.0 colocated trained
Qwen2.5-0.5B-Instruct on one GB10 at about 2.1 s per step, with 62% of step time in generation, 6.5% to 6.8% in preparation outside generation (the
trainer's extra forward pass for the default vLLM-trainer mismatch correction, plus the advantages),
and 17 ms of weight sync. At a 4% base rate, 9 and 10 of 20 steps carried no gradient. Results, scripts and raw
logs: `research/2026-10/E0-spark-smoke.md` and `research/2026-10/E0-spark-smoke/`. Sections 5, 7,
9, 22, 24 and 25 place E0's figures. E1 (one task, three learners) ships as a protocol with
predictions in section 24; it was not run.

## Section map

27 sections in the left navigation.

- Framing (1-2): One Loop: What It Learns From and Where It Keeps It; Getting Started.
- Where the signal comes from (3-4): the map of fine-tuning techniques by signal source; learning
  from answers, SFT and distillation.
- The RL vocabulary (5-8): the language model as a policy, policy gradient, PPO's clip and the KL,
  learning from preferences (reward models, RLHF, DPO).
- RL with verifiable rewards (9-13): RLVR and GRPO, what RL does to a model, distillation or RL,
  agentic RL, the reward as a proxy.
- Learning in words (14-19): the text loop as RL on the context, verbal reinforcement and
  self-correction, memories and playbooks, prompt optimisation, the reader's own loops through the
  RL lens, hybrids.
- Limits (20-21): where words fall short, what lives in weights and what lives in context.
- Systems and cost (22-23): the RL step as an inference job inside a training job, cost per
  improvement with the breakeven calculator.
- Practice (24-26): side by side on a DGX Spark, choosing a technique, fine-tuning and learning
  loops on AWS.
- Glossary & Sources (27).

## Layout

| Path | What it holds |
|---|---|
| `SCOPE.md` | Thesis and the 27-section plan (v3), with the v2.1 per-section blocks kept in their 24-section numbering, review notes |
| `RESEARCH-GUIDE.md` | Research waves, evidence bar, the UNKNOWN register with its Gate 1 triage, Tier 0 experiments, the Gate 1 record |
| `research/2026-10/01-*.md` to `06-*.md` | Claim registers: RL foundations, RLVR and agentic RL, learning in words, theory and limits, RL systems, AWS paths |
| `research/2026-10/wave2-*.md` | Wave 2 refutation verdicts; a verdict overrides the register row it names |
| `research/2026-11/07-fine-tuning-signals.md` | Gate 1 register for the fine-tuning rebuild: post-training reports, SFT and distillation sources, TRL at v1.16.0, AWS distillation, provider terms, and the refutation outcomes |
| `research/2026-10/E0-spark-smoke*` | The Tier 0 experiment: write-up, scripts, package versions, raw logs |
| `reviews/` | Scope reviews, the per-section fact checks, Gate 3 scores and the leverage pass |
| `revamp/` | Authoring brief, dispatch plan, build log, per-section claim lists, fact-check and leverage prompts, the rename-and-scope plan, tools (`tools/shoot.mjs` renders sections and reports diagram overlaps; `tools/gen-sources.mjs` writes `sources.md`; `tools/renumber.mjs` and `tools/check-renumber.mjs` renumber in-dive references and check each one against the section it means) |
| `src/` | Vite + React + TypeScript + Cloudscape app; `src/lib/breakeven.ts` is the cost calculator, tested in `src/__tests__/` |
| `sources.md` | Generated from the inline citations, grouped by tier. Regenerate with `node deep-dives/rl-agentic-loops/revamp/tools/gen-sources.mjs` |

## Sources

Sources are tiered: Tier 0 our experiment, Tier 1 pinned code and first-party docs, Tier 2
first-party lab and vendor posts (their figures stay claims), Tier 3 papers (venue or preprint
marked), Tier 4 inspiration only and never cited. See `sources.md` and section 27.

## Build

```bash
pnpm --filter @tech-deep-dives/rl-agentic-loops dev
pnpm --filter @tech-deep-dives/rl-agentic-loops build
bash scripts/ci.sh
```
