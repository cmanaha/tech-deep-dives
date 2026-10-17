# RL and Agentic Learning Loops: Research Guide

How the research for this dive continues from here: the waves and the questions each one answers, the order in which to read the primary sources, the evidence bar per kind of claim, the open questions, the Tier 0 experiments, and the gates before any app code is written.

Companion to `SCOPE.md`. Bracketed IDs such as (F03-61) point to claim-register entries in `research/2026-10/`. Dates are absolute; "accessed" dates on every source are 2026-10-16 or 2026-10-17.

---

## 1. Where the research stands

Wave 1 produced six claim registers, each with a header of pinned sources, numbered entries (claim, location, verdict, evidence with tier and evidence kind, use in dive), mental models, contradictions, an UNKNOWN register, a reading path and a tiered source list.

| File | Area | Entries |
|---|---|---|
| `research/2026-10/01-rl-foundations.md` | RL vocabulary on tokens, policy gradient, PPO, KL, RLHF, reward models, DPO family, RLAIF, RL versus SFT | 93 |
| `research/2026-10/02-rlvr-agentic-rl.md` | GRPO and successors, trainer defaults in TRL and verl, the capability debate, process rewards, agentic RL environments, reward hacking, what RL changes in weights | 90 |
| `research/2026-10/03-learning-in-words.md` | Reflexion, self-correction, experience and memory loops, skill libraries, textual gradients, prompt optimisers including GEPA, ACE, Training-Free GRPO, evolutionary search, Advisor Models | 112 |
| `research/2026-10/04-theory-limits.md` | In-context RL, exploration, credit assignment, context limits and caching, the weights-versus-context boundary, autoresearch, Ralph, the adaptation taxonomy | 80 |
| `research/2026-10/05-rl-systems.md` | The RL step as a system, verl, OpenRLHF, TRL with vLLM, asynchronous designs, cost of named runs, DGX Spark feasibility | see file |
| `research/2026-10/06-aws-paths.md` | Bedrock reinforcement fine-tuning, Nova customisation, SageMaker AI model customisation, HyperPod, Trainium, AgentCore Memory | see file |

Tiers used throughout. Tier 0: our experiments. Tier 1: source code at a pinned tag or 40-character SHA, official framework documentation, first-party AWS documentation and pricing pages. Tier 2: first-party lab or vendor posts and talks, including an author's own post about their own method. Tier 3: academic papers, with peer-reviewed venue or preprint marked, and third-party technical analysis. Tier 4: tutorials, summaries and press, used only to locate primary sources. Code is the authority over documentation, and documentation over blogs.

---

## 2. Research waves

Each wave lists the questions it must answer and what counts as done. A wave is done when every question has a register entry with a verdict, including UNKNOWN with a stated reason.

### Wave 1. Breadth from primary sources (complete)

Answered: what each method's state, update rule and feedback signal are; which same-model comparisons between RL and text loops exist; what the evidence says about RL sharpening versus expanding; where frozen models fail; how RL runs as a system; which AWS services offer RL or managed memory. Output: the six registers above.

### Wave 2. Verification and gap fill

Purpose: make every load-bearing claim in `SCOPE.md` survive an attempt to refute it, and close the UNKNOWNs that a section depends on.

Questions:
1. Do the twelve numbers the scope leans on hardest hold against their sources at the pinned version? The list: GEPA 54.85 against GRPO 48.91 and the rollout budgets (F03-61, F03-62); Training-Free GRPO's $18 against $10,000 and $0.02 against $0.005 (F03-91); the 32B AIME comparison (F03-90); Advisor 38.98 against direct RL 42.38 (F03-108); Reflexion 0.52, 0.60, 0.68 (F04-21); 14.2% step-level blame accuracy (F04-26); RULER effective lengths (F04-32); R1-Zero 15.6% to 77.9% (F02-9); 68.5% to 96.0% unchanged parameters (F02-84); rank-1 LoRA and the bits-per-episode argument (F02-86); AReaL 14.8 hours against 33.6 (F05-10); Bedrock RFT's three models and Regions (F06-2).
2. Does RL-trained self-correction (SCoRe, arXiv 2409.12917) show RL adding an ability prompting lacks, and by how much on which model? (03 U4)
3. Would a GRPO configuration tuned for 100 to 300 training examples close GEPA's gap? Is there any ablation of GRPO budget at small data? (03 U2)
4. Which reflection model did GEPA's Qwen3 8B runs use: the same 8B model or a stronger one? Check the gepa repo's experiment configs at a pinned SHA. (03 U1)
5. What compute did named RL runs use (GPU type, count, hours or dollars, steps), from the runs' own papers? (research 05, section F)
6. What do HyperPod recipes ship for RL and preference methods at a pinned tag, which framework does each wrap, and what does the Neuron SDK document for GRPO, PPO or DPO on Trainium? (research 06)
7. What does AgentCore Memory store, what updates it, and does AWS describe any strategy as learning across episodes? (research 06)
8. Has any frontier lab published base-versus-RL pass@k at large k? (02 U1) What is the same-scaffold base pass@16 for DeepSWE's Qwen3-32B? (02 U2)
9. Do first-party OpenAI docs describe a memory or skills feature with a learning loop? (03 U8)
10. Venues that were not confirmed from a primary page: confirm or keep "preprint". (01 U10, 02 U5, 03 U7, 04 U-11)

Method: one independent agent per register runs a refutation pass, writing `research/2026-10/V1-verify-<area>.md` in the EFA pattern (a verdict per checked claim: HOLDS, SCOPE NARROWER, WRONG, with the quote). Gap-fill questions append new entries to the owning register. Budget: at most 3 agents at once, 6 agents total, each writing to disk as it goes.

### Wave 3. Tier 0 experiments

Purpose: let the reader see RL and a word loop side by side on one task, and close UNKNOWNs that only a measurement can settle. Design in section 5. Output: one log per experiment in `research/experiments/E<n>-<name>/` with inputs, configs, seeds, raw outputs and a NOTES.md, in the pattern of `deep-dives/silicon-memory-inference/research/dgx-spark/NOTES.md`.

### Wave 4. Pre-build design

Purpose: turn the scope into a buildable plan. Questions: which diagrams carry which mental models (a diagram plan following `deep-dives/efa/revamp/diagram-plan.md`); which claims each section cites (a section architecture with citation lists, following `deep-dives/efa/revamp/section-architecture.md`); which interactive elements are worth their weight (the breakeven calculator in section 21 is the only one proposed). Output: `revamp/diagram-plan.md` and `revamp/section-architecture.md` inside this dive.

---

## 3. Reading path for Carlos

Read in this order. Each stage builds the vocabulary the next one assumes. Sections named are the parts of each source that carry the idea; the rest can wait.

**Stage 1. RL as a procedure you can read**
1. **InstructGPT**, Ouyang et al., arXiv 2203.02155v1 (NeurIPS 2022), sections 3.1 and 3.5 and appendix C. The whole RLHF pipeline in one place: SFT, a reward model from comparisons, PPO with a per-token KL to the SFT model, and real hyperparameters. Every later method modifies this one.
2. **Sutton and Barto**, *Reinforcement Learning: An Introduction*, 2nd edition, chapter 13 (policy gradient methods). The policy gradient theorem, REINFORCE, baselines and actor-critic in plain notation. Read after InstructGPT so the maths has a concrete target.

**Stage 2. RL with verifiable rewards, and what it actually does**
3. **DeepSeek-R1**, arXiv 2501.12948v2 and the Nature 2025 version, section 2, then supplementary F.1 (distillation against RL) and G.2 (why process rewards and tree search were dropped). It defines the object the rest of the field argues about.
4. **Yue et al.**, "Does reinforcement learning really incentivize reasoning capacity beyond the base model?", arXiv 2504.13837v5 (NeurIPS 2025), sections 3.1 and 4.1 to 4.4 and the limitations. Teaches how to read a pass@k curve and makes the strongest case for sharpening.
5. **Zhang, Neubig and Yue**, arXiv 2512.07783v1, the four findings in section 1. The controlled reconciliation: when RL adds capability and when it only sharpens.
6. **"LoRA Without Regret"**, Thinking Machines blog, 2025-09-29, the reinforcement learning section. The one-bit-per-episode argument, which explains why RL moves the model so little.

**Stage 3. Learning in words**
7. **Reflexion**, arXiv 2303.11366v4, section 3 for the actor, evaluator and reflector split, section 4.2 for where the HotPotQA signal comes from, and the code ablation (Table 3). The base pattern of every text loop.
8. **Huang et al.**, "Large language models cannot self-correct reasoning yet", arXiv 2310.01798v2, Tables 2 and 3 side by side. The shortest demonstration that the feedback signal does the work.
9. **GEPA**, arXiv 2507.19457v2, Table 1 including the AIME row, appendix E.4 for the GRPO configuration, section 3 for the reflective mutation and Pareto selection. The most direct head-to-head with GRPO.
10. **Advisor Models**, arXiv 2510.02453v3, sections 4.3, 4.4.3 and 4.4.4. RL on a small model whose output is words for a frozen large one; what a static prompt cannot learn; the same-model comparison with direct RL.

**Stage 4. Limits, and the reader's own loops**
11. **Krishnamurthy et al.**, "Can large language models explore in-context?", arXiv 2403.15371v3 (NeurIPS 2024). One bandit, many prompt designs, one success, and the reason (an externally summarised history).
12. **Retroformer**, arXiv 2308.02151v3 (ICLR 2024), introduction and section 4. The paragraph that folds the frozen model into the environment makes "a text loop is RL" precise.
13. **Huntley's Ralph post** (ghuntley.com/ralph) side by side with **autoresearch's program.md** at SHA 228791fb499afffb54b46200aca536f79142f117. Read both against the RL vocabulary: what is the action, the reward, the state, and the hack surface.
14. **Baker et al.**, "Monitoring reasoning models for misbehavior", arXiv 2503.11926v1. What reward hacking looks like in agentic coding, why monitors catch it, and why training against them hides it.

**Stage 5. Systems**
15. **HybridFlow**, arXiv 2409.19256, then **AReaL**, arXiv 2505.24298. The RL step as generation, preparation, training and weight sync, and why asynchronous designs trade staleness for throughput.

---

## 4. Evidence bar per claim type

| Claim type | Minimum evidence | What the page must say with it |
|---|---|---|
| Definition of an algorithm or objective | The paper that introduced it, at a pinned arXiv version, with the equation or section | Nothing beyond the citation |
| Framework default or behaviour | Source code at a release tag or 40-character SHA, file and line | The tag, because defaults move between releases (TRL changed GRPO loss defaults and removed PPOTrainer, F01-76, F02-28) |
| Benchmark result | Paper table or figure at a pinned version | Model family, benchmark, k or sample count, rollout budget; peer-reviewed or preprint |
| "X beats RL" or "X matches RL" | Same base model, same data, stated budgets for both arms | If the base models differ, the page labels it a cross-model comparison (F03-90 is the warning case) |
| Capability-boundary claim | pass@k at large k, preferably with question-level accounting, on at least one non-Qwen family or a contamination-checked benchmark | The family and k; the Qwen contamination caveat where it applies (F02-56) |
| Cost figure | The source's own numbers and its stated price assumptions | The assumptions (for example the $0.5 per GPU-hour in F03-91); any arithmetic labelled derived |
| Systems step-time share | A measured breakdown with table or figure | Whether it is generation alone or generation plus training; an uncited assertion is labelled as such (F05-12) |
| AWS fact | docs.aws.amazon.com or the AWS pricing page (Tier 1); What's New or AWS blog for dates (Tier 2) | Region and date where they vary; AWS performance figures marked as vendor claims (F06-10) |
| Practitioner loop design | The author's own code at a pinned SHA or the author's own post | Third-party guides are Tier 4 (F04-74) |
| Mental model that synthesises several sources | Two or more register entries that support it | Labelled as our reading when no single source states it |
| Tier 0 result | A logged experiment in `research/experiments/` with configs, seeds and raw outputs | Hardware, software versions and number of runs; a result from one seed is labelled as a single run |

Preserve the scope of every hedge. "Not located during this research" never becomes "does not exist".

---

## 5. Tier 0 experiments

### Hardware this plan may assume

Only what the repo documents. An NVIDIA DGX Spark: GB10 superchip, 20 Arm cores, 128 GB of unified LPDDR5X at 273 GB/s shared by CPU and GPU, Ubuntu 24.04.4 LTS, driver 580.159.03, CUDA 13.0, aarch64 (`deep-dives/silicon-memory-inference/research/dgx-spark-tier1-research.md` and `research/dgx-spark/NOTES.md`). A Jetson Orin Nano Super with 8 GB of LPDDR5 (`research/jetson-orin-nano-tier1-research.md`). No other machine is assumed. Whether TRL, vLLM and DSPy run on the Spark's aarch64 and CUDA 13 stack at the pinned versions is recorded in research 05 section G; anything not documented there is settled by experiment E0.

### E0. Smoke test: does the stack run on the Spark?

Question: can TRL's GRPO trainer with vLLM in colocate mode train a 0.5B to 1.5B model on the DGX Spark at the versions pinned in research 05? Steps: install the pinned versions, run 20 GRPO steps on a toy reward, record peak unified-memory use, step time and the generation share of step time. Pass condition: 20 steps complete with logged metrics. If it fails, record the failure and fall back to TRL without vLLM (`use_vllm=False`, F05-18) and accept slower generation. This gates E1 and section 23 of the scope.

### E1. One task, three learners (the side-by-side the reader asked for)

Question: on one task with a programmatic verifier, how do the base model, a GRPO-trained model and a frozen model with a learned prompt or playbook compare, at pass@1 and at large k?

- **Task.** A synthetic task generated fresh for the experiment, so no model has seen it: Countdown-style arithmetic (reach a target number from given numbers) or the composed string-transform task of F02-50. Fresh synthetic data avoids the benchmark contamination that confounds Qwen math results (F02-56). Exact-match verifier in plain Python, outside any agent's write path.
- **Models.** One small Qwen-family instruct model (0.5B to 1.5B) and one non-Qwen control of similar size, because spurious-reward and contamination effects differ by family (F02-53).
- **Arms.** (a) Base model, no training. (b) GRPO with TRL at the pinned tag, LoRA, `loss_type` and `beta` stated, rollouts counted. (c) GEPA through DSPy 3.4.1 with the same model as task model; the reflection model is recorded, since which model reflects changes the reading (03 U1). (d) A playbook loop in the ACE pattern (delta updates, de-duplication) with the same model. (e) Best-of-n with the verifier at inference on the base model, the inference-time version of sharpening (F02-78).
- **Budget.** Arms (b), (c) and (d) get the same number of training rollouts, chosen after E0 from measured step time. Held-out test set of at least 500 problems.
- **Metrics.** pass@1 and pass@k for k in 1, 4, 16, 64 and 256 on the test set; tokens per test query including the learned prompt or playbook; training wall-clock; rollouts used; for (b) the fraction of zero-advantage groups per step (F02-22) and policy entropy (F02-89).
- **What the research predicts**, to be confirmed or refuted: (b) beats (c) and (d) on pass@1 if the gap is skill rather than instructions (F03-62, F03-90); (a) matches or beats (b) at pass@256 (F02-40); (c) and (d) cost more tokens per query than (b) (F03-91); (e) recovers part of (b)'s pass@1 gain at n times the inference cost.
- **Size check.** A 1.5B model in bf16 is about 3 GB of weights [derived: 1.5 billion parameters at 2 bytes], small against 128 GB of unified memory; generation speed on 273 GB/s memory bandwidth is the expected bottleneck, measured in E0.

### E2. Noise floor of a keep-or-revert loop

Question: how much does the metric of an autoresearch-style loop vary between identical runs? The loop keeps any change that improves the metric and has no noise floor (F04-66); without one, part of the kept commits may be noise (04 U-2). Steps: run the autoresearch training script at the pinned SHA, unmodified, five times with the same seed and five with different seeds, on the Spark with its fixed time budget, and record the spread of the final metric. Output: a noise floor the reader can apply to their own keep-or-revert loops. Caveat to record: the reference setup is a single H100, so the Spark numbers are a different configuration.

### E3. Prefix-cache hit rate for an evolving context

Question: how much prefix caching survives when a playbook evolves during a loop? Prompt caching matches exact prefixes, so any edit invalidates what follows (F04-38, F04-40), and ACE's high reuse figure was measured with the context frozen (F04-41); no measurement during adaptation was located (04 U-1). Steps: serve the E1 model with vLLM and prefix caching on; run the E1 playbook loop in two layouts, edits in place within the playbook versus a stable prefix with new lessons appended at the end; record the prefix-cache hit rate from vLLM's metrics per iteration. Output: the cost of edit placement, in the reader's own unit.

### E4. Can a small frozen model explore a bandit?

Question: does the exploration failure measured on large models (F04-8 to F04-12) appear on a small local model, and does an externally summarised history fix it? Steps: a five-armed Bernoulli bandit, 100 rounds, raw history in the prompt versus a per-arm summary table computed in code, 20 runs each; record how often the model never tries the best arm after the first rounds. Small enough for the Jetson as well as the Spark. Output: the "proposers, not statisticians" model reproduced on hardware the reader owns.

---

## 6. Open questions and UNKNOWN register

Consolidated from the six registers. Each item names its source register, why it matters to a section, and how it closes.

| ID | Open question | Register | Feeds section | Closes by |
|---|---|---|---|---|
| U1 | Frontier-scale base-versus-RL pass@k at large k: not located in first-party publications | 02 U1 | 8 | Wave 2 search; otherwise the page keeps the scoped hedge |
| U2 | DeepSWE's same-scaffold base pass@16, so whether RL widened coverage on SWE tasks | 02 U2 | 9 | Wave 2 search |
| U3 | Mechanism of spurious-reward gains: clipping bias, contamination and pre-existing behaviour not tested jointly on clean data | 02 U6 | 8 | Accept as an open debate on the page; E1's non-Qwen control gives a local data point |
| U4 | Whether R1's "aha" marks new capability: word-frequency evidence on both sides | 02 U12 | 7 | Accept as open |
| U5 | GEPA's reflection model in the Qwen3 8B runs | 03 U1 | 14 | Wave 2: pinned gepa repo configs |
| U6 | Whether a small-data-tuned GRPO closes GEPA's gap | 03 U2 | 14 | Wave 2 search; E1 gives one local data point |
| U7 | Same-model, same-budget comparisons with RL for Reflexion, ExpeL, ACE, ReasoningBank, Dynamic Cheatsheet, Training-Free GRPO: none located | 03 U3 | 13, 24 | E1 arm (d) |
| U8 | SCoRe, RL-trained self-correction | 03 U4 | 12, 17 | Wave 2 read |
| U9 | Long-run growth of append-only memories over thousands of tasks | 03 U5 | 13 | Accept as open; scoped hedge |
| U10 | Prefix-cache hit rate for a context that evolves during adaptation | 04 U-1 | 13, 18, 21 | E3 |
| U11 | Run-to-run noise of autoresearch's metric | 04 U-2 | 16 | E2 |
| U12 | How prompt-optimisation gains scale with the target model's size, optimiser held fixed | 04 U-4 | 14, 19 | Wave 2 search; otherwise open |
| U13 | Fresh-context loop against one long compacted session on the same coding task | 04 U-5 | 16, 18 | Accept as open; candidate for a later Tier 0 experiment |
| U14 | Blame-attribution accuracy of self-reflection in single-agent coding loops with test feedback | 04 U-6 | 18 | Wave 2 search |
| U15 | Whether 2026 reasoning models close the explore-exploit gap in the original bandit protocol | 04 U-7 | 18 | Wave 2 search; E4 gives a small-model data point |
| U16 | Measured memory in GB for PPO's four models at a given size | 01 U3 | 6, 20 | E0 measures the GRPO case on the Spark |
| U17 | Which algorithms frontier labs use in production post-training, from first-party sources | 01 U4 | 6, 7 | Accept as open unless a first-party source appears |
| U18 | Whether reward over-optimisation's functional forms hold at frontier scale | 01 U6 | 10 | Accept as open |
| U19 | Weight-update sparsity at full precision, including optimiser state | 02 U7 | 8 | Accept as an open debate |
| U20 | Remaining systems and AWS UNKNOWNs | 05, 06 | 20, 21, 22 | Listed in those registers after their completion |

---

## 7. Gates before building the app

The iteration flywheel (ADR-003) puts Gate 1 between research and build. For this dive Gate 1 has five checks, and all five must pass before any `package.json` or `src/` exists.

1. **Scope held.** `SCOPE.md` has passed its three adversarial reviews (newcomer path, factual grounding, outcome fit) and records what changed. Every section passes the mental-model-or-practical test of `deep-dives/efa/revamp/section-shape-standard.md`.
2. **Load-bearing claims verified.** Wave 2's refutation pass has a verdict for every number in the scope's thesis and section paragraphs; anything WRONG is fixed in the scope, anything SCOPE NARROWER is re-hedged.
3. **UNKNOWNs triaged.** Every UNKNOWN in section 6 is marked close-in-wave-2, close-by-experiment, accept-as-hedge, or cut-the-claim. None is left untriaged.
4. **Tier 0 decision.** E0 has run. If it passed, E1 is scheduled and section 23 stays; if it failed and the fallback also failed, section 23 is cut from the scope.
5. **Human approval.** Carlos reads `SCOPE.md` and this guide and approves the section list, or names cuts. The candidate cuts if scope must shrink: section 15 (search loops), whose core idea also appears in section 16, then section 23 if the experiment is not ready.

After Gate 1, the build starts from `deep-dives/_template/`, with `.gates.json` opting the dive into every Tier 1 gate from the first commit of `src/` (no-ai-tells, svg-a11y, pinned-refs, pinned-refs-research, required-files, pre-overflow), so the ratchet holds from day one. Gates 2 (human review on device) and 3 (no section below 7 of 10, average at least 8) follow the flywheel unchanged.

---

## 8. Budget record for wave 1

Wave 1 used 9 research-agent dispatches: 5 in the first fan-out, 2 re-dispatches of area 05 after a usage stop (split into systems and AWS), and 2 completion agents for those two files. Three agents in the first fan-out and both re-dispatches were cut off by account usage limits; every file they had written to disk was kept and committed, and only unwritten work was re-dispatched. Wave 2 is budgeted at 6 agents, at most 3 at a time, each writing to disk as it goes.
