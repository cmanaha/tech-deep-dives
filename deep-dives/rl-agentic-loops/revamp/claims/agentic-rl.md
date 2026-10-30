# Claims: section 9, Agentic RL (`src/sections/AgenticRl.tsx`)

Authored 2026-10-30. Every arXiv source below was re-fetched at the pinned version on 2026-10-30 and the passage re-read with `pdftotext`; the DeepSWE post and the SageMaker page were re-fetched the same day. Code was re-read from raw files at verl `v0.9.1` and TRL `v1.16.0`. The four-field profiles of Search-R1, ReTool, RAGEN, SWE-RL and DeepSWE (F02-70 to F02-75, not checked in wave 2) were checked field by field against those fetches. Format: `claim | source URL | register or wave 2 row`.

## Intro
- Agentica and Together AI: Qwen3-32B, RL only, 64 H100s, six days, 23% to 42.2% pass@1 on SWE-Bench Verified (vendor claim) | https://www.together.ai/blog/deepswe (intro; Figure 2 caption "increases from 23→42% (+20%) for Pass@1") | F02-63; wave2-rlvr rows 40, 40b, G2
- SWE-Bench Verified gloss (human-validated GitHub issues scored by the repository's tests) | SCOPE.md section 9 wording; SWE-RL Sec 1 "a human-verified subset of SWE-bench" | scope gloss

## One episode, one reward
- Most setups pay one reward per episode at the end; RAGEN also pays a reward at each step (fact check: the intro and loop text said every setup) | https://arxiv.org/abs/2504.20073v2 (Sec 2.2.2 Eq. 3; App. C.1) | F02-72
- TRL builds a tool mask with 0 for tool-result tokens | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L2146-L2154 (also L1950 comment "0 for tool result tokens, 1 elsewhere") | F02-33; wave2-rlvr row 43
- TRL multiplies the tool mask into the loss mask | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L3027 (used in loss aggregation L3154-L3179) | F02-33; wave2-rlvr row 43 (row cites L2497, the same product for the token count)
- verl marks assistant tokens 1 and context tokens 0 | https://github.com/volcengine/verl/blob/v0.9.1/verl/utils/tokenizer/continuous_token.py#L398-L413 | F02-38; wave2-rlvr row 43 optional note
- verl's tool agent loop adds tool responses as context | https://github.com/volcengine/verl/blob/v0.9.1/verl/experimental/agent_loop/tool_agent_loop.py#L386-L397 (`ct_merge_context_msg`) | F02-38 (new line range, read 2026-10-30)
- Search-R1 masks retrieved tokens from the loss | https://arxiv.org/abs/2503.09516v5 (Sec 3.1) | F02-70
- ReTool masks `<interpreter>` output from the loss | https://arxiv.org/abs/2504.11536v2 (Sec 2.3.2 "Interpreter Feedback Mask") | F02-71 (beyond the register quote; read at the pinned version)
- Search-R1 ablation, Qwen2.5-7B base, PPO: average 0.431 with mask vs 0.343 without, seven QA datasets | https://arxiv.org/abs/2503.09516v5 (Table 4, Sec 5.4) | F02-70 (number beyond the register quote; read at the pinned version)
- verl writes the trajectory reward at the last response position of a zero tensor | https://github.com/volcengine/verl/blob/v0.9.1/verl/experimental/agent_loop/agent_loop.py#L143-L148 | F02-39; wave2-rlvr row 42
- Batched path: score at the last valid response position | https://github.com/volcengine/verl/blob/v0.9.1/verl/experimental/agent_loop/agent_loop.py#L1093-L1099 | F02-39; wave2-rlvr row 42
- verl GRPO sums token rewards, normalises within the group, multiplies by response_mask (same advantage on every mask-1 token) | https://github.com/volcengine/verl/blob/v0.9.1/verl/trainer/ppo/core_algos.py#L304-L331 | F02-35 location (new line range, read 2026-10-30)
- Per-turn credit is left to the advantage estimator; the environment does none of it | verl agent_loop.py L143-L148 (as above) | F02-39 ("the environment does not do it")
- Same push for useful and wasted turns; only comparison across episodes separates them | our reading of the code above | labelled "our reading" (section 17 owns the general statement)
- TRL environment class: methods as tools, `reset`, optional `get_reward` scoring the finished rollout; experimental | https://github.com/huggingface/trl/blob/v1.16.0/trl/trainer/grpo_trainer.py#L266-L281 | F02-33
- Diagram: mask 1/0, reward on last token, advantage A on trained tokens and 0 on tool tokens | same code citations | F02-33, F02-38, F02-39

## Five environments, four fields (table)
- Search-R1: E5 retriever, 2018 Wikipedia dump, 3 passages; `<search>` query; `<information>` passages; exact match, no format reward, no neural RM | https://arxiv.org/abs/2503.09516v5 (Secs 3.1, 3.2, 3.4, 4.3) | F02-70
- ReTool: code sandbox; `<code>` tags; interpreter output or error in `<interpreter>` tags; +1 / -1 on equivalence, no code-executability reward | https://arxiv.org/abs/2504.11536v2 (Sec 2.3, Eq. 2) | F02-71
- RAGEN: bi-arm bandit, Sokoban, FrozenLake, WebShop; `<think>` then `<answer>` moves; up to 5 turns and 10 actions in training; next state and step reward; Sokoban +1/-1/+10/-0.1; FrozenLake +1 else 0; -0.1 format penalty | https://arxiv.org/abs/2504.20073v2 (Sec 2.2.2 Eq. 3, Sec 3.2, Appendix C.1, C.2) | F02-72 (fields beyond the register quote; read at the pinned version)
- SWE-RL: issue plus full file contents plus merged patch; search/replace edits; single turn; -1 bad format else difflib.SequenceMatcher similarity 0 to 1 | https://arxiv.org/abs/2502.18449v2 (Sec 1, Sec 2.1 Eq. 1, Figure 2) | F02-73
- DeepSWE: R2E-Gym, one Docker image per problem, terminal and filesystem; four tools (bash, search, file editor, finish); tool stdout/stderr; 1 if patch passes a selected sample of tests within 5 minutes (official 30), else 0 | https://www.together.ai/blog/deepswe (Secs 2.1, 2.2) | F02-75
- Venues: Search-R1 "COLM 2025" from the v5 PDF running header and the COLM 2025 accepted-papers list (https://colmweb.org/2025/AcceptedPapers.html, fact check 2026-10-30); SWE-RL NeurIPS 2025 (arXiv comment and PDF footer); ReTool ICLR 2026 (https://iclr.cc/virtual/2026/poster/10006978, fact check 2026-10-30); RAGEN, Kimi K2, Pass@(k,T) preprint (no venue located) | arXiv metadata API, PDFs, venue pages | wave2-rlvr G3 said Search-R1 stays preprint: superseded by the COLM list

## Reading across the rows
- No reward pays for tool use; ReTool omits an executability reward to limit reward hacking | https://arxiv.org/abs/2504.11536v2 (Sec 2.3) | F02-71
- Search-R1 uses no format reward and no learned reward model | https://arxiv.org/abs/2503.09516v5 (Sec 3.4) | F02-70
- The model learns to call a tool to the extent it raises the outcome score | our reading | labelled
- SWE-RL: Llama3-SWE-RL-70B on Llama-3.3-70B-Instruct, 41.0% on SWE-Bench Verified with Agentless Mini | https://arxiv.org/abs/2502.18449v2 (Sec 1, Sec 3.1) | F02-73
- SWE-RL: exact-match (discrete) reward stayed approximately zero to the end of training because real patches are diverse, and repair (oracle) came out lower, 29.0 against 34.8 for the continuous reward; page says the graded similarity gave partial credit (fact check: "what made that reward learnable" was an overreach, the discrete variant still trained) | https://arxiv.org/abs/2502.18449v2 (Sec 3.6, Figure 5) | F02-73 (beyond the register quote; read at the pinned version)
- DeepSWE runs a terminal in each task's Docker image and grades by running tests | https://www.together.ai/blog/deepswe (Secs 2.1, 2.2) | F02-75
- Kimi K2: Gym-like framework, unified interface inspired by OpenAI Gym, verifiable-reward tasks plus self-critique rubric reward with pairwise comparison against rubrics for subjective tasks (creative writing) | https://arxiv.org/abs/2507.20534v2 (Secs 3.2, 3.2.2, 3.3.4) | F02-76; wave2-rlvr row 39

## Read an agent's gain as a pass@k curve
- ReTool on Qwen2.5-32B-Instruct: 67.0% AIME 2024 in 400 steps vs 40.0% in 1,080 steps for text-only RL; response length about 40% shorter | https://arxiv.org/abs/2504.11536v2 (abstract, Sec 1) | F02-71; wave2-words row 11 (67.0 is ReTool's own figure)
- ReTool cold-start SFT then RL; cold-start model 40.9%; untrained 26.7% | https://arxiv.org/abs/2504.11536v2 (Sec 1, Sec 2.2) | F03-90 register fix; wave2-words row 11 (cold-start SFT stage)
- Cold start 14.2 of 40.3 points, RL 26.1 | our arithmetic: 40.9 - 26.7; 67.0 - 26.7; 67.0 - 40.9 | derived
- DeepSWE 42.2% averaged over 16 runs; 71.0% pass@16 (vendor claim) | https://www.together.ai/blog/deepswe (intro, Figure 1 caption) | F02-63; wave2-rlvr row 40
- Base pass@16 not located in this research | wave2-rlvr G2, RESEARCH-GUIDE U2 (accept-as-hedge) | U2
- Pass@(k,T) setup: Qwen2.5-7B-Instruct; one search tool, BM25 over 10 paragraphs (2 gold, 8 distractors); LoRA GRPO on 200 problems; 100 test problems per category; k up to 64; T up to 5 | https://arxiv.org/abs/2604.14877v1 (Sec 3) | F02-62; wave2-rlvr row 41
- Bridge questions: 0.81 vs 0.77 at k = 64 (T = 5), about four problems, gap widens with k; k = 1: base 0.363 vs RL 0.335; SFT 0.73 | https://arxiv.org/abs/2604.14877v1 (Secs 4.1, 4.2, Figure 2) | F02-62; wave2-rlvr row 41
- Authors attribute the gap to the learning signal (same 200 problems for SFT and RL) | https://arxiv.org/abs/2604.14877v1 (Sec 4.1) | F02-62
- Mechanism: RL reweights existing strategies toward those whose later reasoning more often reaches a correct answer; gain in integrating retrieved information, not in what is searched | https://arxiv.org/abs/2604.14877v1 (abstract) | F02-62 (beyond the register quote; read at the pinned version)
- Fits section 8's tool condition; clearest boundary expansion located in the agentic setting in this research | our reading; SCOPE section 9 | labelled
- One model; authors did not repeat on other models; on comparison (independent) questions RL's lead over the base was largest at small k and narrowed as k grew, but it still ended about four problems ahead at k = 64 (0.86 vs 0.82, net +4); only on bridge questions did the gap widen with k (fact check: the abstract's "on simpler categories RL behaves as prior work predicts" conflicts with Sec 4.1; the page follows the body) | https://arxiv.org/abs/2604.14877v1 (Secs 4.1, 4.2, 6; Table 2) | F02-62, U11
- Four problems is about one binomial standard error: sqrt(0.8 x 0.2 / 100) = 0.04 | our arithmetic | wave2-rlvr row 41 (derived)
- k stops at 64, below the sample counts of section 8's static-reasoning studies | wave2-rlvr row 41 (128 to 1,024 in Yue et al.) | F02-40, F02-62

## The environment is a fleet
- DeepSWE: 512 Docker containers per RL iteration (BS=64, 8 passes), overloaded Docker's API server and crashed dockerd; moved to Kubernetes; worker nodes about 200 CPU cores | https://www.together.ai/blog/deepswe (Sec 2.2) | F02-75
- Kimi K2: Kubernetes sandboxes, over 10,000 concurrent instances | https://arxiv.org/abs/2507.20534v2 (Sec 3.2.1) | F02-76
- Kimi K2: GPUs idle while waiting on environments; heavy environments as dedicated services; many concurrent rollouts; partial rollout pauses long-tail tasks and resumes them next iteration | https://arxiv.org/abs/2507.20534v2 (Sec 3.3.4) | F02-76
- DeepSWE compact filtering masks trajectories at max context, max steps or timeout; stumbling on correct patches reinforced later steps and led to collapse; reward only when the agent deliberately submits | https://www.together.ai/blog/deepswe (Sec 2.3) | F02-75
- RAGEN Echo Trap: reward variability collapse, entropy drop, gradient spikes | https://arxiv.org/abs/2504.20073v2 (Sec 1 findings, Sec 4.1) | F02-72
- Uncertainty filter: under PPO, keeping 75% of rollouts extends FrozenLake stability from 100 to 140 steps; 50% avoids collapse | https://arxiv.org/abs/2504.20073v2 (Sec 4.2) | F02-72
- Under GRPO, an equal-reward group has zero advantage and no gradient (section 7's rule); the RAGEN 100 to 140 step result is under PPO, so the page scopes the pointer to GRPO | https://arxiv.org/abs/2503.14476v2 (Sec 3.2); RAGEN v2 Eq. 5 | F02-22, F06-34 (owned by section 7; stated here as a pointer, no Cite)

## What you bring to managed multi-turn RL
- SageMaker sends prompts to your agent; the agent calls the policy model, takes actions such as calling tools, reports a reward for the complete rollout; the policy model is the model being trained | https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl-agent.html ("Agent code integration overview"; API table: Sample, CompleteRollout, UpdateReward) | F06-30; wave2-aws row 16
- Service owns the model tokens and update; customer owns sandbox, tools, grader | our reading of F06-30 | F06-30 "Use in dive"
- DeepSWE run started at 23% pass@1 and reached 42.2% (vendor claim, second landing) | https://www.together.ai/blog/deepswe (Figure 2) | F02-63; wave2-rlvr G2
- A task never solved gives a group the same zero and nothing to learn from | section 7 pointer | F02-22

## Notes for the fact check
- Search-R1 venue: the v5 PDF running header reads "Published as a conference paper at COLM 2025"; wave2-rlvr G3 kept it as preprint from the README bibtex. The page shows COLM 2025; the glossary and sources list should agree.
- Search-R1 headline gain: F02-70 quotes 41% (Qwen2.5-7B) over RAG baselines; the v5 abstract and Sec 4.4 say 24% while the contributions list says 41%. The figure is not used on the page.
- Search-R1's title contains a banned word; Cite labels use "Search-R1" only.
- ReTool trains with verl ("we employ the VeRL framework", Sec 2.3.2), so the page describes the masking as the papers' choice rather than as a loop they wrote.
