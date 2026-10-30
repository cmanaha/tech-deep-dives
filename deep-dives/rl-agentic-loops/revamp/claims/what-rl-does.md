# Claims: section 8, What RL Does to a Model (`WhatRlDoes.tsx`)

Authored 2026-10-30. One line per assertion: `claim | source URL | register or wave 2 row`.
Every arXiv source below was re-fetched as HTML at the pinned version on 2026-10-30 and the quoted
text matched; the Thinking Machines blog and the ICLR 2026 proceedings page for RL's Razor were
re-fetched the same day. Interplay's venue was read from its authors' README at commit
ab728f05d81de9af38d0ca155a84166b037e355a ("accepted as a Spotlight paper at ICML 2026").

## Intro (h1)

- RLVR: a program checks each answer and the check is the reward; raises single-shot accuracy on math and code | section 7 owns the citations | F02-6, F02-7 (cross-reference only, no number)
- Capability boundary = problems solved in at least one of k samples at large k; RL can move probability inside it (sharpening) or widen it | https://arxiv.org/abs/2504.13837v5 (Sec. 2.2) | F02-40 (definition); SCOPE section 8
- GRPO scores each answer against the others sampled for the same prompt | section 7 owns it | F02-1, F02-2; expansion wave2-rlvr G6
- Training-free sampler nearly matched GRPO single-shot on a math benchmark at about 8.84x tokens per answer | https://arxiv.org/abs/2510.14901v1 (Table 1, Sec. 5.3) | F02-58; wave2-rlvr row 4

## Reading a pass@k curve

- pass@k = share of problems where at least one of k samples passes verification; pass@1 = single-shot | https://arxiv.org/abs/2504.13837v5 (Sec. 2.2) | F02-40
- If RL enhanced reasoning, the RL model should solve more problems than the base at large k | https://arxiv.org/abs/2504.13837v5 (Sec. 2.2: "if RL enhances reasoning, the RL-trained model should succeed in more such problems than the base model") | F02-40, F02-41
- Diagram: schematic only, no numbers; captioned "Illustrative, not measured" | n/a | SCOPE section 8 diagram
- leg_counting (Reasoning Gym): ProRL 28% vs base 4% at one attempt; at 1,024 attempts base 40%, ProRL 30% | https://arxiv.org/abs/2507.14843v5 (Sec. 3.2) | F02-47 (quote in register evidence)
- Expandable: CoT checked by hand for a subset of outputs, unit tests for code; base already correct at k = 128 or 1,024, far from astronomical k where uniform token sampling would stumble on an answer | https://arxiv.org/abs/2504.13837v5 (Sec. 2.2) | F02-41

## The debate

- Across model families, six RL algorithms, math/code/visual benchmarks: RLVR wins at small k, base higher pass@k at large k | https://arxiv.org/abs/2504.13837v5 (abstract) | F02-40; wave2-rlvr rows 1, 23
- Coverage and perplexity: RL reasoning paths already in base sampling distribution; scoped to current RLVR training | https://arxiv.org/abs/2504.13837v5 (abstract: "current training rarely elicit fundamentally new reasoning patterns") | F02-40, F02-44
- Minerva, 32B: base solves about 9% more problems than RL at k = 128 | https://arxiv.org/abs/2504.13837v5 (Sec. 3.1) | F02-40 (register evidence)
- More questions lose a verified success than gain one; budgets up to 8,192 for math comparisons | https://arxiv.org/abs/2507.14843v5 (abstract, Sec. 3.1) | F02-47; wave2-rlvr row 24
- ProRL-1.5B-v2 lost 175, gained 48 | https://arxiv.org/abs/2507.14843v5 (Sec. 3.2) | F02-47; wave2-rlvr row 24
- Retention 0.93 to 0.99; newly solved at most 2% of RLVR successes | https://arxiv.org/abs/2507.14843v5 (Sec. 3.2) | F02-48
- "Three findings show the boundary moving, each in a controlled or small setting" | our reading | SCOPE section 8 [our reading]; register 02 mental model 3
- Composition, Llama-3.1-8B-Instruct, string functions: unseen level 3 near zero to 30%, level 4 to 15%; rejection fine-tuning on same level-2 problems does not generalise | https://arxiv.org/abs/2509.25123v3 (Sec. 1) | F02-50; wave2-rlvr row 25
- On hard levels the pass@k gap widens with k | https://arxiv.org/abs/2509.25123v3 (Fig. 5 caption) | F02-50
- 100M-parameter models from scratch on synthetic data; real pass@128 gains only with pretraining headroom and edge-of-competence RL data | https://arxiv.org/abs/2512.07783v1 (abstract) | F02-49; wave2-rlvr row 26; venue ICML 2026 per authors' README
- Teacher-guided curriculum RL: average pass@256 +9.8 points over base across five model settings | https://arxiv.org/abs/2606.22317v1 (abstract, Sec. 4.1) | F02-61; wave2-rlvr row 27
- Pass@(k,T): Qwen2.5-7B-Instruct, LoRA GRPO on 200 problems, 100 test problems per category, k up to 64; multi-hop (bridge) 0.81 vs 0.77 at k = 64, about four problems, gap widened with k | https://arxiv.org/abs/2604.14877v1 (Sec. 3, Sec. 4.2, Table 2) | F02-62; wave2-rlvr row 41 (replacement text used)
- Synthesis: RL sharpens by default, widens with a new combination, edge data, or outside information | our reading | register 02 mental model 3
- U1 hedge: no frontier lab large-k base-vs-RL comparison located in the sources for this research; Yue name proprietary models as the limit | https://arxiv.org/abs/2504.13837v5 (Sec. 7) | RESEARCH-GUIDE U1 (accept-as-hedge); F02-44; wave2-rlvr G1
- At 32B the answer depends on the benchmark: Yue base ahead at k = 128 on Minerva; Guru Qwen2.5-32B-Base RL above base at every sampled k on AIME, 7B curves cross at k = 64 | https://arxiv.org/abs/2506.14965v1 (Sec. 4.3) | wave2-rlvr G1
- AIME on a Qwen2.5 base carries the family caveat | our reading | wave2-rlvr G1 [our reading]
- Large k differs: 128 or 1,024 (Yue), up to 8,192 (Invisible Leash), 64 (Pass@(k,T)) | Yue Sec. 2.2; Leash Sec. 3.1; Pass@(k,T) Sec. 3 | F02-40, F02-47, wave2-rlvr row 41

## What changes in the weights

- Thinking Machines (Tier 2 lab blog): SFT arguably O(tokens) bits per episode; policy gradient O(1) bits per episode | https://thinkingmachines.ai/blog/lora/ (Reinforcement learning) | F02-86; wave2-rlvr rows 2, 28
- Assuming one bit per completion: ~10,000 problems x 32 samples = 320,000 bits; rank-1 LoRA on Llama-3.1-8B has 3M parameters | https://thinkingmachines.ai/blog/lora/ | F02-86; wave2-rlvr row 28
- In their runs (Llama-3.1-8B base, MATH and GSM) rank-1 LoRA matched full fine-tuning for policy gradient | https://thinkingmachines.ai/blog/lora/ | F02-86; wave2-rlvr row 2 (optional tightening applied)
- RL forgot less than SFT at matched new-task performance on Qwen2.5-3B-Instruct and OpenVLA 7B; forgetting tracked KL between fine-tuned and base on the new task | https://arxiv.org/abs/2509.04259v1 (abstract, Sec. 3) | F02-87; wave2-rlvr row 3; venue ICLR 2026 per wave2-foundations G2
- 11 base models, four families; performance traded against entropy on a fitted curve; 76% of gain and 73% of entropy drop in first 200 of 2,400 steps | https://arxiv.org/abs/2505.22617v1 (Sec. 2.3, 2.4) | F02-89; wave2-rlvr row 29
- Entropy curve as the large-k loss seen from inside the run | our reading | register 02 mental model 6
- Expandable: ten public checkpoints, bf16 tolerance 1e-5, 68.5% to 96.0% unchanged, seven methods, four offline preference methods such as DPO; SFT 6% to 15% sparsity | https://arxiv.org/abs/2505.11711v2 (Sec. 2, Table 1) | F02-84; wave2-rlvr row 30 (replacement text used)
- At 1e-8 the appendix table reads 50.4% to 87.6% | https://arxiv.org/abs/2505.11711v2 (Table 6: min 50.40 mistral-orpo-alpha, max 87.58 Tulu-3-70B-DPO) | wave2-rlvr row 30
- Sparsity as visible trace of an optimisation bias toward the same low-curvature regions, consistent across runs, datasets and recipes; precision amplifies, does not cause | https://arxiv.org/abs/2511.08567v1 (abstract, Sec. 2.3) | F02-85; wave2-rlvr row 31 (replacement text used)
- No update sparsity in float32 with the same performance; bf16 small updates failed to cross the representational threshold | https://arxiv.org/abs/2509.04259v1 (Sec. 6) | wave2-rlvr row 32, G4
- Optimiser state not analysed in any paper read | scope statement | RESEARCH-GUIDE U19 (close-in-wave-2 hedge text)
- Three disagree on sparsity, agree changes are small enough for bf16 to hide many; record precision and tolerance with any sparsity figure | our reading | wave2-rlvr G4

## The trust check

- Qwen2.5-Math-7B, MATH-500: random rewards +21.4, incorrect labels +24.1, ground truth +29.1; spurious rewards often fail on Llama3 and OLMo2 | https://arxiv.org/abs/2506.10947v2 (abstract, Sec. 2.2) | F02-53; wave2-rlvr row 33; venue ICML 2026 per wave2-rlvr G3
- 60% prefix: Qwen2.5-Math-7B 54.60% exact match vs Llama3.1-8B 3.8%; LiveMathBench 202505 completion 0.0% | https://arxiv.org/abs/2507.10532v3 (Sec. 1) | F02-56; wave2-rlvr row 34
- On generated arithmetic only accurate rewards pass the base boundary | https://arxiv.org/abs/2507.10532v3 (abstract) | F02-56
- U3 hedge: mechanism still argued, clipping bias amplifying existing behaviour (code reasoning without execution) vs contamination; both agree no carry to Llama or OLMo | https://arxiv.org/abs/2506.10947v2 (abstract); https://arxiv.org/abs/2507.10532v3 (abstract, Sec. 1) | RESEARCH-GUIDE U3 (accept-as-hedge); F02-54; wave2-rlvr G5
- Three checks as questions (family, contamination, k) | our reading | SCOPE section 8 trust check

## What a frozen model can buy back

- Base pass@K is the ceiling for best-of-K with a perfect verifier; real verifier or voting can only miss successes | https://arxiv.org/abs/2504.13837v5 (Sec. 2.2: "may miss these successes if the correct answer is not selected by the verifier or voting") | wave2-rlvr row 35 ([our reading], definitional)
- Sampler targets base distribution to a power (alpha = 4), MCMC resampling of blocks by base likelihood, no training data, no verifier | https://arxiv.org/abs/2510.14901v1 (Sec. 1, Sec. 4) | F02-58
- Qwen2.5-Math-7B MATH-500: base 0.496, sampler 0.748, GRPO (MATH) 0.785; tested on Qwen2.5-Math-7B, Qwen2.5-7B, Phi-3.5-mini-instruct | https://arxiv.org/abs/2510.14901v1 (Sec. 5.1, Table 1) | F02-58; wave2-rlvr row 4
- About 8.84x tokens, computed for MATH-500 from N_MCMC = 10, T = 679, B = 192; scales with length and settings | https://arxiv.org/abs/2510.14901v1 (Sec. 5.3) | F02-58; wave2-rlvr row 4; wave2-systems-cost row 28
- Forced "Let's solve this using Python.": Qwen2.5-Math-7B 49.4% to 64.4% (+15.0); lowered Llama, OLMo2, Qwen2.5-7B 41.6% to 22.2% | https://arxiv.org/abs/2506.10947v2 (Sec. 5.3, Table 2) | F02-55; wave2-rlvr row 36
- Contamination applies to the prompt gain too | our reading | SCOPE section 8 item 3 [our reading]
- GPT-4-based PRM, 800,000 human step-level labels, 78.2% of a representative MATH test subset at best-of-1,860; ORM 72.4%; majority 69.6%; generator not RL-trained | https://arxiv.org/abs/2305.20050v1 (Sec. 1 to 3, Fig. 3) | F02-64; wave2-rlvr row 37; PRM/ORM expansions per wave2-rlvr G6
- DeepSeek dropped PRMs: steps hard to define, correctness hard to label at scale, model-based PRM leads to reward hacking, benefit limited against compute in large-scale RL; PRM still helps rerank top-N | https://arxiv.org/abs/2501.12948v2 (Supplementary G.2) | F02-13; wave2-rlvr row 38
- Table rows: best-of-K needs verifier, K samples and K verifier calls, capped by base pass@K; power sampling needs only base, ~8.84x; trigger prompt few tokens, helped Qwen2.5-Math and Qwen2.5-1.5B (+10.0, Table 2), hurt Llama, OLMo2, Qwen2.5-7B | as cited in the items above | F02-55, F02-58, F02-64
- Landing: per-query vs once-in-training; neither reaches past base pass@K; where RL went beyond (composition, tool use) the starting model's pass@k stayed below RL at the largest k measured | https://arxiv.org/abs/2509.25123v3 (Fig. 5); https://arxiv.org/abs/2604.14877v1 (Sec. 4.2) | register 02 mental model 4 [our reading]; R2b scope fix (studies read only)
- Next action: measure base pass@k at the affordable K before training; flat curve means the gap needs new information | our reading | SCOPE section 8 item 5
