# fc04-agentic: fact check of sections 9 (Agentic RL) and 10 (The Reward Is a Proxy)

Agent fc04, 2026-10-30. Pins: TRL v1.16.0, verl v0.9.1, autoresearch at
`228791fb499afffb54b46200aca536f79142f117` (shallow clones in `/tmp/rl-fc-fc04-*`). Papers read as
`pdftotext` of the versioned arXiv PDF each Cite carries; DeepSWE post, SageMaker page, Claude 3.7
Sonnet system card and the Ralph post fetched 2026-10-30.

Status: COMPLETE. Fixes applied; typecheck, lint, tests (26 passed) and the four gates pass; harness re-run for section 10 panel B (0 overlap/clip at 1440 and 390, PNGs read).

## AgenticRl.tsx (section 9)

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 9-1 | ReTool venue badge "preprint" (five Cites) | AgenticRl.tsx:375, 575, 682, 745, 751 | STALE | ICLR 2026 poster: https://iclr.cc/virtual/2026/poster/10006978 (title and authors match; OpenReview tRk1nofSmz). arXiv v2 metadata carries no venue | Five Cites set to `venue="ICLR 2026"` |
| 9-2 | Pass@(k,T): "On comparison questions ... RL behaved as in static reasoning, and the expansion appeared only on the sequential bridge questions" | AgenticRl.tsx:809-811 | WRONG (abstract-body conflict in the source) | arXiv 2604.14877v1 Sec 4.1: "On comparison questions, RL expands the capability boundary modestly ... net gain of 4 problems"; Sec 4.2 and Table 2: comparison k=64 T=5 RL 0.86 vs base 0.82, k=1 0.278 vs 0.186 (gap narrows with k). Only the abstract says "on simpler categories RL behaves as prior work predicts" | Rewritten from the body: lead largest at small k, narrowing with k, still about four problems ahead at k = 64; only bridge questions widen. Cite now Sections 4.1, 4.2 and 6, Table 2 |
| 9-3 | SWE-RL: "The graded similarity is what made that reward learnable" | AgenticRl.tsx:701 | OVERREACH | arXiv 2502.18449v2 Sec 3.6, Fig 5: discrete reward still trained (format 94.2%, repair-oracle 29.0 vs 34.8 continuous); paper says continuous is "more effective", not that discrete was unlearnable | "gave the reward partial credit to climb on", plus the 29.0 against 34.8 repair score from the same figure; Cite now Section 3.6 and Figure 5 |
| 9-4 | "The reward, one number per episode, still arrives once, at the end"; "Every setup in this section has the shape below" | AgenticRl.tsx:498-499, 531 | OVERREACH (contradicts the section's own RAGEN row) | arXiv 2504.20073v2 Sec 2.2.2 Eq. 3: "The environment then returns the next state s_t+1 and reward r_t"; Sokoban -0.1 per action (App. C.1) | Intro: "In most setups the reward is still one number per episode"; loop text: "runs the loop below" and "RAGEN ... also pays a reward at each step" |
| 9-5 | RAGEN filter "applies section 7's rule ... a group whose episodes all score the same has zero advantage and carries no gradient", placed after the PPO result | AgenticRl.tsx:882-883 | OVERREACH | Zero advantage for an equal-reward group is GRPO's (RAGEN Eq. 5); the 100 to 140 step result is under PPO, whose critic gives non-zero advantages (RAGEN Sec 2.2.3, Sec 4.2) | Scoped to GRPO: "Under GRPO the filter also drops the groups that section 7's rule already makes useless" |
| 9-6 | First use of TRL and GRPO is in the diagram caption, before their expansions | AgenticRl.tsx:540-541 | prose rule (acronym order) | expansions at L545-546 and L596 | Caption reworded without the acronyms ("the code of the two frameworks named below", "verl's group-relative estimator") |

Confirmed, with evidence:
- Code (verl v0.9.1): `agent_loop.py#L143-L148` (zeros tensor, `rm_scores[-1] = reward_score`), `#L1093-L1099`
  (batched path), `core_algos.py#L304-L331` (`compute_grpo_outcome_advantage` from L268: sum, group
  mean/std, `* response_mask`), `continuous_token.py#L398-L413` (assistant 1, context 0),
  `tool_agent_loop.py#L386-L397` (tool messages merged via `ct_merge_context_msg`). Note: verl tools may
  return a per-call `tool_reward`, carried only as `extra_fields` metadata (`tool_agent_loop.py#L376`,
  `agent_loop.py#L1124`); no trainer code consumes it, so "the environment does none of it" holds at the
  default path.
- Code (TRL v1.16.0): `grpo_trainer.py#L2146-L2154` (tool mask 0 for tool tokens), `#L3027` (mask
  product), `#L266-L281` (`environment_factory`: methods as tools, required `reset`, optional
  `get_reward`, experimental).
- Search-R1 v5: COLM 2025 (PDF running header, and listed at https://colmweb.org/2025/AcceptedPapers.html;
  wave2-rlvr G3 "stay preprint" is superseded: register fix for the orchestrator); E5, 2018 Wikipedia,
  3 passages (Sec 4.3), `<search>`/`<information>` (Sec 3.2), EM reward, no format reward, no neural RM
  (Sec 3.4), masking (Sec 3.1), Table 4 0.431 vs 0.343 (Qwen2.5-7b-base, PPO, seven datasets).
- ReTool v2: 67.0% in 400 steps vs 40.0% in 1,080 (Sec 1), about 40% shorter (Sec 1 contributions),
  cold start 40.9%, untrained 26.7% (Sec 1, Table 1), arithmetic 14.2/26.1 of 40.3 correct, reward +1/-1
  with no executability reward "to alleviate reward hacking" (Sec 2.3.1), `<code>`/`<interpreter>`
  (Sec 2.3.1), interpreter mask (Sec 2.3.2).
- RAGEN v2: four environments (Sec 3.1), 5 turns and 10 actions (Sec 3.2), Sokoban and FrozenLake
  rewards (App. C.1), -0.1 format penalty (Sec 3.2), Echo Trap signs (Sec 1 finding 1), 75%: 100 to
  140 steps, 50% avoids collapse, PPO (Sec 4.2).
- SWE-RL v2: NeurIPS 2025 (PDF footer, arXiv comment), Eq. 1 and difflib (Sec 2.1), full file
  contents (Sec 1), 41.0% with Agentless Mini on Llama-3.3-70B-Instruct (Sec 1, 3.1), discrete reward
  near zero (Sec 3.6, Fig 5).
- Kimi K2 v2: Gym-like framework and verifiable rewards plus self-critic pairwise reward for creative
  writing (Sec 3.2, 3.2.2), Kubernetes, over 10,000 concurrent sandboxes (Sec 3.2.1), idle GPUs,
  dedicated services, concurrent rollouts, partial rollout, Gym-inspired interface (Sec 3.3.4).
- Pass@(k,T) v1: setup (Sec 3: BM25, 10 paragraphs 2 gold 8 distractors, 200 problems, 100 test per
  category, LoRA GRPO, T up to 5, k up to 64), 0.81/0.77/0.73 and 0.363/0.335 (Sec 4.1, 4.2),
  learning-signal attribution (Sec 4.1), mechanism (abstract), single 7B model (Sec 6). Preprint.
- DeepSWE post (https://www.together.ai/blog/deepswe, published 2025-07-02): Qwen3-32B, RL only,
  64 H100s, six days; 23 to 42% (Fig 2 caption; the chart title reads SWE-Bench-Hard while the caption
  says SWE-Bench-Verified, a source-internal inconsistency covered by the vendor-claim label); 42.2%
  over 16 runs, 71.0% pass@16; four tools, stdout/stderr, 5-minute limit vs 30; 512 containers
  (BS=64, 8 passes), parallel experiments, dockerd crash, Kubernetes, about 200 cores; compact
  filtering (Sec 2.3).
- SageMaker "Preparing your agent": prompts from your dataset to your agent, agent calls the policy
  model, takes actions, reports a reward for the complete rollout; Sample, CompleteRollout,
  UpdateReward.

## RewardIsAProxy.tsx (section 10)

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 10-1 | ImpossibleBench venue badge "preprint" (seven Cites) | RewardIsAProxy.tsx:472, 645, 693, 699, 789, 877, 940 | STALE | ICLR 2026 poster: https://iclr.cc/virtual/2026/poster/10009390 | Seven Cites set to `venue="ICLR 2026"` |
| 10-2 | Gao "trained the proxies on 100,000 comparisons" | RewardIsAProxy.tsx:586 | WRONG | arXiv 2210.10760v1 Sec 2.1: 100,000 generated, 10% held out; Sec 3.2: data size held at 90,000; Sec 3.3 sweeps it | "generated 100,000 comparisons ..., held 10% out, and trained the proxies on up to 90,000 of them" |
| 10-3 | 70B study listed as a source of "the curves" | RewardIsAProxy.tsx:571-580 | OVERREACH | arXiv 2609.38526v1 abstract, Sec 5.3: it fits a different law, peak gold reward Θ(sqrt(min{log M, K})), not GAO22's rise-and-fall forms; wave2-foundations G4 "It is a different law" | Added: "and it fitted a different law: the peak gold score grows with the square root of KL until the amount of preference data caps it"; Cite now Sections 5.2 and 5.3 |
| 10-4 | Panel B draws best-of-n and RL gold peaks at the same height | RewardIsAProxy.tsx:49-52, 77-80, 317-328 | OVERREACH (schematic contradicts source) | arXiv 2210.10760v1 Sec 3.5: RL "then peaks at a higher gold RM score than BoN (fig. 8)" | Best-of-n peak lowered (0.45 vs 0.55, at u = 0.15) so RL peaks later and higher; SVG title says "peaks later and higher"; harness 0 overlap/clip, PNGs read |
| 10-5 | Monitor framing: h2 "A monitor inside the reward stops being a monitor", description "keep them out of the reward", checklist 4 "never into the reward" | RewardIsAProxy.tsx:729-731, 978-979 | OVERREACH (known fc04 item) | Baker 2503.11926v1 abstract and Sec 3.2: the pressured monitor read only the CoT and helped at low optimisation; MacDiarmid 2511.18397v1 Sec 1 Mitigations and Fig 4: a hack-classifier penalty in the reward prevented hacking, and the authors "encourage the use of these approaches generally" | h2 "can stop being a monitor"; description "keep one out of the reward so it keeps seeing it"; item 4 now says a hack-detecting penalty can still stop hacking while detection holds, as in Anthropic's runs, and keeps the watching monitor separate. Checklist heading kept (sections 15 and 22 quote it) |
| 10-6 | README "(and disable all permissions)" quoted without saying what it means | RewardIsAProxy.tsx:861-862 | OVERREACH (ambiguous quote carries the claim) | autoresearch README.md#L44 at 228791fb: "spin up your Claude/Codex ... (and disable all permissions)", i.e. run the agent without approval prompts | Added "which we read as running it without approval prompts" |

Confirmed, with evidence:
- Stiennon v3 Sec 4.3 and Fig 5 (anti-correlated; NeurIPS 2020 footer).
- Gao v1: 6B gold, 3M to 3B proxies, 1.2B policy (Sec 2.1, Fig 1), forms and d (Sec 1), RL slower per
  KL, smooth coefficients, prediction (Sec 1), KL_bon formula (Sec 2), about 6 and 10 nats (Sec 3.1),
  n = 16 arithmetic 1.83, proxy vs gold more similar (Sec 3.5), gap indicative of exploitation
  (Sec 3.4), KL penalty 0 outside Sec 3.6, advance prediction n = 60,000, 6B policy less gain and
  same-KL peak (Sec 3.4), KL penalty as early stopping (Sec 3.6). ICML 2023 per build-log venues.
- Revisit v1 Sec 5.2, 5.4: 70B gold, Qwen3 0.6B to 4B proxies, Qwen3-4B-Instruct policy, best-of-N and
  exponential tilting.
- Baker v1: Sec 2.1 and Fig 2 (exit(0), raise SkipTest, systemic, patched once noticed), Sec 2.2
  items 1 to 5, Table 1 (95% vs 60%), Sec 3.1 and Fig 3 (Cheating check), Sec 3.2 and Fig 4, abstract
  (monitorability tax). No venue located: preprint holds.
- MacDiarmid v1: abstract, Sec 1 pipeline (SDF or prompting, production environments, footnote 2),
  App. lines on AlwaysEqual, sys.exit(0), conftest.py, Fig 4 mitigations. No venue located.
- ImpossibleBench v1: Sec 1 (76%, 2.9%, 86-89%, 42-65%), Sec 2.2 (One-Off), 2.4 (open tests,
  instruction, 10 submissions), 4.1 (four strategies), 5.2 (hidden and read-only), 5.3 (80 to 83, 33
  to 38), 6 (backward compatibility). The repository's October 2026 notice of a LiveCodeBench-split
  bug says it "does not affect the original paper" (README at d4f9a149).
- Claude 3.7 Sonnet system card Sec 6, 6.1, 6.2.
- Ralph post (published 2025-07-14, modified 2026-02-19): Bash loop, new context window each loop,
  quote verbatim, placeholder sign, TODO-list loops.
- autoresearch at 228791fb: program.md L28-L31, L100-L104; prepare.py L340-L359 (evaluate_bpb calls
  `model(x, y, reduction='none')`); train.py L268-L289 (forward with loss), L613, L622; ten files in
  the tree; no hash or guard on prepare.py in train.py.
- Reflexion v4 Table 3 (0.68/0.60/0.52), Sec 4.3; NeurIPS 2023 (proceedings.neurips.cc).

## Scores (after fixes)

**AgenticRl.tsx: 9/10.** About 70 claims checked (45 claim-map lines, table fields counted one by one);
1 WRONG, 3 OVERREACH, 1 STALE, 1 prose; all fixed. Every number now matches its source at scope, mental
model (mask, last-token reward, group advantage) and practical value (environment checklist, fleet sizing)
both land, and 23% to 42.2% lands three times. The headline rests on a vendor post whose Figure 2 chart is
titled SWE-Bench-Hard while its caption says SWE-Bench-Verified (labelled vendor claim on the page).

**RewardIsAProxy.tsx: 9/10.** About 75 claims checked; 1 WRONG, 4 OVERREACH, 1 STALE; all fixed. The
76% lands four times, the payoff (four-item checklist, then the next action) lands last, and the monitor
guidance is now fair to MacDiarmid et al. without losing Baker et al.'s point.

## Items for the orchestrator (files fc04 does not own)

- `GlossaryAndSources.tsx` id 52 (ReTool) and id 59 (ImpossibleBench) say "preprint": both are ICLR 2026
  (iclr.cc poster pages 10006978 and 10009390). Search-R1 id 51 already says COLM 2025.
- `AccumulatingExperience.tsx` L632 and L647 cite ReTool with `venue="preprint"` (fc05's file).
- Register: wave2-rlvr G3 keeps Search-R1 as preprint; the COLM 2025 accepted-papers list carries it.
- `Choosing.tsx` L827 and `YourLoops.tsx` L706 summarise item 4 as "monitors kept out of the reward";
  still consistent as shorthand with the corrected item 4.
- Not added (would need new sources): a web-search summary [SECONDARY, not opened] says later
  replications of MacDiarmid et al. on open models found inconsistent or no emergent misalignment. The
  page scopes the finding to Anthropic's setup, so nothing on the page is wrong.
- ImpossibleBench's repository notice (README at `d4f9a149`, October 2026) of a LiveCodeBench-split bug
  says it "does not affect the original paper": no page change.
