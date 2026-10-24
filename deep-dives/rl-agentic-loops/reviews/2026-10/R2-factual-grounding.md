# R2 Adversarial Review: Factual Grounding

- **Lens:** factual grounding. Every claim in SCOPE.md checked for support by its cited register entry, and the most load-bearing claims checked against the primary source.
- **Date:** 2026-10-17
- **Document reviewed:** `deep-dives/rl-agentic-loops/SCOPE.md` (Scoping v1, 2026-10-17)
- **Registers:** `research/2026-10/01-rl-foundations.md` to `06-aws-paths.md`
- **Rules applied:** `CLAUDE.md` (Source Authority, Fact-Checking, Section Shape), `deep-dives/efa/revamp/source-authority-standard.md`
- **Claims checked against registers:** 164 cited claims (every parenthetical citation group in SCOPE.md, 218 distinct IDs including range endpoints), plus 6 uncited claims
- **Claims checked against primary sources:** 25 claims across 23 sources (arXiv HTML or PDF at the pinned version, code at the pinned tag or SHA, docs.aws.amazon.com and aws.amazon.com pages), listed at the end
- **Findings:** 5 BLOCKER, 14 MAJOR, 16 MINOR

All cited IDs resolve: every ID and every range endpoint in SCOPE.md exists in its register.

## Findings

### Batch 1 (Thesis, sections 3 to 12)

**1. BLOCKER. Section 6: the 60 petaflop/s-days figure is attached to the wrong model.**
- Location: section 6, "InstructGPT's outputs at 1.3B were preferred to 175B GPT-3's (F01-50), for 60 petaflop/s-days of post-training against 3,640 for GPT-3 pretraining (F01-52)".
- Cited: F01-50, F01-52.
- What the register says (F01-52, quoting InstructGPT 2203.02155 Sec 5.1): "training our 175B SFT model requires 4.9 petaflops/s-days and training our 175B PPO-ptx model requires 60 petaflops/s-days, compared to 3,640 petaflops/s-days for GPT-3". The 60 is the 175B PPO-ptx model, not the 1.3B model whose outputs were preferred; and it excludes the 4.9 for SFT. F01-50 also carries the scope "In human evaluations on our prompt distribution", which the sentence drops.
- Replacement: "On the authors' own prompt distribution, human raters preferred the 1.3B InstructGPT model's outputs to 175B GPT-3's (F01-50). Post-training is cheap next to pretraining: the 175B PPO-ptx model took 60 petaflop/s-days, plus 4.9 for its SFT stage, against 3,640 for GPT-3 pretraining (F01-52)."

**2. BLOCKER. Section 10: best-of-n does not sit "on the same curve" as RL.**
- Location: section 10, "on a predictable curve in the square root of KL from the start, and best-of-n selection at inference sits on the same curve (F01-54 to F01-56, F02-78)".
- Cited: F01-55, F02-78.
- What the register says (F02-78, quoting Gao et al. 2210.10760v1): "for best-of-n (BoN) sampling, R_bon(d) = d(alpha_bon - beta_bon d), and for reinforcement learning, R_RL(d) = d(alpha_RL - beta_RL log d)" and "reinforcement learning tends to be slower than best-of-n sampling at both optimization and overoptimization." The source gives two different functional forms. It also records the setting as synthetic (6B gold RM, proxy RMs 3M to 3B, F01-55), which "predictable" without scope drops.
- Replacement: "In a synthetic study with a 6B reward model standing in for humans, optimising against a smaller proxy first raised the gold score and then lowered it, on fitted curves in the square root of KL from the start. Best-of-n selection at inference over-optimises the same way, on a curve of its own that rises and falls faster per unit of KL than RL's (F01-54 to F01-56, F02-78)."

**3. MAJOR. Thesis: the one-bit argument is a Tier 2 information argument, and it is not what the forgetting result rests on.**
- Location: Thesis, "RL supplies about one bit per episode, which is why a rank-1 adapter can absorb it and why it forgets less than supervised fine-tuning (F02-86, F02-87)".
- Cited: F02-86, F02-87.
- What the register says: F02-86 is a Tier 2 lab blog (Thinking Machines, "LoRA Without Regret") whose argument is hedged: "Supervised learning arguably provides O(number of tokens) bits per episode ... policy gradient ... provides only O(1) bits per episode", and the 320,000-bit figure is computed "Assuming each completion yields a single bit". F02-87 (RL's Razor) attributes lower forgetting to KL, not to bit count: "the degree of forgetting is determined by the distributional shift, measured as the KL-divergence ... on-policy RL is implicitly biased towards KL-minimal solutions", tested on Qwen2.5-3B-Instruct and OpenVLA 7B. No source links the bit count to forgetting; the "which is why ... forgets less" causal chain is ours.
- Replacement: "Policy gradient carries roughly one bit per episode on Thinking Machines' information argument, and in their runs a rank-1 LoRA adapter matched full fine-tuning (F02-86). Separately, RL forgot less than supervised fine-tuning at matched task performance on a 3B language model and a 7B robotics model, and the forgetting tracked the KL to the base model (F02-87). [our reading] Both results say RL moves the model little."

**4. MAJOR. Thesis: the "falls short" sentence states five general limits from single studies, without a label.**
- Location: Thesis, "It falls short where the gap is reasoning skill, behaviour that must vary per input, exploration, or long-horizon credit assignment (F03-62, F03-90, F03-107, F04-8, F04-26)".
- Cited: F03-62, F03-90, F03-107, F04-8, F04-26.
- What the register says: F03-62 is one task (AIME-2025, GRPO 38.00 vs GEPA 32.00, Qwen3 8B). F03-90 compares RL on Qwen2.5-32B-Instruct with the text loop on Qwen3-32B and its own verdict carries "the caveat that the 32B models differ". F04-8 tested GPT-3.5, GPT-4 and Llama2 on bandits. F04-26 measures blame attribution on multi-agent failure logs (Who&When), which is diagnosis, not a loop's learning. The first half of the paragraph carries "On the tested models and benchmarks"; this half has no scope and no label, so a synthesis across five single studies reads as a law.
- Replacement: "[our reading] It falls short where the gap is reasoning skill, behaviour that must vary per input, exploration, or long-horizon credit assignment: in the studies read, GRPO beat prompt evolution on the one competition-math task (F03-62), RL lifted a 32B model far more than a text loop on a different 32B model (F03-90), a trained advisor learned per-user preferences that a static prompt did not (F03-107), only one GPT-4 configuration explored a bandit satisfactorily (F04-8), and the best method located the decisive step in a long failure log 14.2% of the time (F04-26)."

**5. MINOR. Thesis: the Reflexion ablation number needs its conditions.**
- Location: Thesis, "A Reflexion loop without its tests scored below no reflection at all, 0.52 against 0.60 (F04-21)".
- Cited: F04-21.
- What the register says: "On the 50 hardest HumanEval Rust problems with GPT-4: baseline 0.60; removing test generation (reflect without tests) 0.52", "ablation (measured, n=50)". At n = 50, 0.52 against 0.60 is four problems.
- Replacement: "On the 50 hardest HumanEval Rust problems with GPT-4, a Reflexion loop without its tests scored below no reflection at all, 0.52 against 0.60 (F04-21)".

**6. MINOR. Section 3: "where most confusion between papers comes from" has no source.**
- Location: section 3, "which is where most confusion between papers comes from (F01-9)".
- Cited: F01-9.
- What the register says: F01-9 records that in TRL's PPO code the two framings mix ("the reward-model score is added at the final token, and every token also gets a per-token KL penalty"). It says nothing about the frequency or source of confusion between papers.
- Replacement: "Practical value: the reader can open any RL paper and tell which framing (token or response) its equations use, and see that running code mixes the two: TRL's PPO adds the score at the last token and a KL penalty at every token (F01-9)."

**7. MAJOR. Section 5: the clip removes the incentive, it does not limit the move.**
- Location: section 5, "The clipped ratio with epsilon 0.2 limits how far one update moves any token's probability (F01-27, F01-29)".
- Cited: F01-27.
- What the register says (PPO 1707.06347 Sec 3): the clip "removes the incentive for moving r_t outside of the interval [1 - epsilon, 1 + epsilon] ... we only ignore the change in probability ratio when it would make the objective improve, and we include it when it makes the objective worse." The register's own claim line reads "before the gradient stops rewarding it". The ratio can and does leave the interval; F01-29 also records that epsilon = 0.2 was tuned on 7 MuJoCo tasks, not language.
- Replacement: "The clipped ratio with epsilon 0.2 stops rewarding an update once it has moved a token's probability ratio more than 20% from the sampling policy; the ratio can still go further, but the gradient no longer pushes it there (F01-27). The 0.2 comes from robot-control ablations (F01-29)."

**8. MAJOR. Section 6: "several times the compute" is a [derived] wall-clock ratio without the label.**
- Location: section 6, "with PPO ahead once carefully tuned and at several times the compute (F01-72, F01-73)".
- Cited: F01-73.
- What the register says: "PPO training with a 13B reward model and 13B policy ... takes 3 days on a 256-size pod ... DPO training ... for a 13B model takes 9 hours", and "(The 8x is [SPECULATIVE: own arithmetic, 72 h vs 9 h, excluding RM training].)" The source compares wall-clock; the register does not record the DPO hardware, so "compute" is not established. The gap is also small: "PPO outperforms DPO by an average of 0.7 points" on Tulu 2 13B.
- Replacement: "The DPO-versus-PPO evidence: PPO ahead once carefully tuned (F01-72), by an average of 0.7 points in a controlled 13B comparison where data quality mattered more, at roughly 8x the wall-clock [derived: 72 hours against 9, excluding reward-model training] (F01-73)."

**9. MAJOR. Section 7: "only worked from bases of 32B and up" generalises DeepSeek's own bases, and the dive's other entries contradict it.**
- Location: section 7, "a result that only worked from bases of 32B and up, while distillation beat RL for small models (F02-9, F02-11, F02-12)".
- Cited: F02-11.
- What the register says: F02-11 is DeepSeek's report on its own checkpoints: "we experimented with smaller-scale models, specifically a 7B dense model and a 16B Mixture-of-Experts (MoE) model ... these configurations consistently failed to yield meaningful improvements when evaluated on the AIME benchmark". Other entries the SCOPE cites show R1-Zero-style RL working on 7B bases: F02-19, "Dr. GRPO's minimal recipe reaches 43.3% on AIME 2024 from Qwen2.5-Math-7B", and F02-40 lists SimpleRLZoo and Oat-Zero checkpoints on Qwen2.5-7B.
- Replacement: "DeepSeek-R1-Zero's AIME 2024 pass@1 rising from 15.6% to 77.9% under RL alone (F02-9, arXiv v2 and Nature; v1 reported 71.0%). On DeepSeek's own checkpoints the recipe failed at 7B dense and 16B MoE and worked from 32B up (F02-11), and for a 32B model distillation from R1 beat RL on every benchmark reported (F02-12); a Qwen2.5-Math-7B base did respond to RL in other work, a family-specific case section 8 returns to (F02-19, F02-53)."

**10. MAJOR. Section 8: the "three conditions" are a synthesis stated as a closed rule.**
- Location: section 8, "The boundary moves under three conditions: the parts exist but not the combination (F02-50), training sits at the edge of competence with pretraining headroom (F02-49), or new information enters from a teacher, a tool or the environment (F02-61, F02-62)."
- Cited: F02-49, F02-50, F02-61, F02-62.
- What the register says: each condition comes from one study in a narrow setting. F02-50: "a synthetic string-function setup on Llama-3.1-8B-Instruct". F02-49: "100M-parameter Qwen2.5-style models pretrained on 30B synthetic GSM-Infinite tokens". F02-62: "The study is small: 200 training problems, 100 test problems per category, one base model", verdict "NEW (scope limited; see U11)". No source states that these three are the conditions.
- Replacement: "[our reading] Three findings show the boundary moving, each in a controlled or small setting: when the parts exist but not the combination (synthetic string functions on Llama-3.1-8B-Instruct, F02-50), when training sits at the edge of competence with pretraining headroom (100M-parameter models on synthetic data, F02-49), and when new information enters from a teacher or a tool (F02-61; one small study on Qwen2.5-7B-Instruct, F02-62)."

**11. MAJOR. Section 9: DeepSWE's 42.2% is a vendor-reported figure, stated as fact.**
- Location: section 9, "DeepSWE trained Qwen3-32B with RL only, on 64 H100s for six days, to 42.2% pass@1 on SWE-Bench Verified (F02-63)". The same run is reused as a cost input in section 21 ("DeepSWE at 64 H100s for six days (F02-63)").
- Cited: F02-63.
- What the register says: "Tier 2 (first-party vendor and lab blog) | benchmark claim", source the Together AI blog, "It reports 42.2% Pass@1 and 71.0% Pass@16". The SCOPE's own convention is "[vendor claim] marks a vendor performance figure", and CLAUDE.md says "Never flatten a vendor performance claim into declarative prose."
- Replacement: "Agentica and Together AI report training Qwen3-32B with RL only, on 64 H100s for six days, to 42.2% pass@1 on SWE-Bench Verified [vendor claim] (F02-63)."

**12. MAJOR. Section 9: the agentic boundary expansion drops the register's scope limit.**
- Location: section 9, "On multi-hop search, tool-use RL pushed pass@k above the base at large k, the clearest boundary expansion in the agentic setting (F02-62)".
- Cited: F02-62.
- What the register says: "NEW (scope limited; see U11)", "The study is small: 200 training problems, 100 test problems per category, one base model", Limitation: "we did not repeat the full pipeline on Qwen2.5-14B-Instruct or LLaMA-3.1-8B-Instruct".
- Replacement: "In one small study (Qwen2.5-7B-Instruct, 200 training problems), tool-use RL on multi-hop search pushed pass@k above the base at large k, the clearest boundary expansion located in the agentic setting (F02-62)."

**13. MAJOR. Section 12: ReasoningBank does not "contrast" failures with successes; the rule is ours.**
- Location: section 12, "Failures help as memory when the update contrasts them with successes on the same task, and hurt as free-floating reflections (ExpeL 39.0 to 29.0 with reflections included; ReasoningBank 46.5 to 49.7 with failures contrasted) (F03-20, F03-30)".
- Cited: F03-30 (and F03-20).
- What the register says: F03-30: "achieving 46.5 on success-only traces and further improving to 49.7 when failures are included" (WebArena-Shopping, Gemini-2.5-flash). F03-28: ReasoningBank distils "from successes and failures judged by an LLM, with no ground truth" and consolidates "with a simple addition operation". Nothing records a same-task contrast. The register's support for the contrast mechanism is Training-Free GRPO, which "only writes lessons from groups that contain both winners and losers (F03-86)". The general rule is a synthesis without a label.
- Replacement: "[our reading] Failures help as memory when the update compares them with successes, and hurt as free-floating reflections: ExpeL fell from 39.0 to 29.0 on HotpotQA when reflections were added to its success/failure pairs (F03-20); ReasoningBank rose from 46.5 to 49.7 on WebArena-Shopping when LLM-judged failures were included (F03-30); Training-Free GRPO writes lessons only from groups with both winners and losers (F03-86)."

**14. MINOR. Section 12: Self-Refine's math numbers need the model.**
- Location: section 12, "Self-Refine's math score stays at 64.1 with self-feedback and reaches 68.9 with oracle feedback (F03-9, F03-10)".
- Cited: F03-9, F03-10.
- What the register says: the pair is GPT-3.5 ("GPT-3.5 64.1 -> 64.1"; oracle "64.06 -> 68.9 (GPT-3.5)"). For GPT-4 the oracle gain is 92.9 to 93.8.
- Replacement: "Self-Refine's math score with GPT-3.5 stays at 64.1 with self-feedback and reaches 68.9 with oracle feedback (F03-9, F03-10)".

**15. MINOR. Section 10: CoT-monitor pressure hides the hack under strong optimisation; at low optimisation it helped.**
- Location: section 10, "Training against a chain-of-thought monitor hides the hack rather than removing it (F02-80)".
- Cited: F02-80.
- What the register says: "Adding the CoT monitor to the reward produces a better agent at low optimisation. With more optimisation the agent keeps hacking at a significant rate while the monitor's recall falls to near zero".
- Replacement: "Training against a chain-of-thought monitor helps at low optimisation, and under stronger optimisation hides the hack rather than removing it (F02-80)."

### Batch 2 (sections 13 to 25, and cross-document checks)

**16. BLOCKER. Sections 13 and 21: the serving-cost reversal is a large-API-model versus small-model gap, attributed to text loop versus RL.**
- Location: section 13, "Training-Free GRPO gives the cleanest cost pair, about $18 of tokens against about $10,000 of GPU time for an RL replication, which reverses at serving, $0.02 against $0.005 per problem (F03-91)"; section 21, "Serving side: $0.02 against $0.005 per problem for the text loop versus the RL model (F03-91) ... The breakeven under the paper's prices is about 660,000 served problems [derived]" and the mental model "text loops are cheap to train and pay at serving; RL is expensive to train and cheap to serve".
- Cited: F03-91 (and F03-90).
- What the primary source says (2510.08191v1, Table 2 and Sec 4.2, fetched): the $18 run is Training-Free GRPO on the 671B DeepSeek-V3.1-Terminus with a code interpreter ("+ Training-Free GRPO ≈ $18 DAPO-100 DeepSeek-V3.1-Terminus CI 82.7"); the $10,000 is ReTool on Qwen2.5-32B-Instruct ("ReTool ≈ $10,000 Qwen2.5-32B-Instruct CI 67.0"). The $0.005 assumes "4 x GPUs at the price of $0.5 per GPU-hour" and "presupposes continuous GPU availability"; the $0.02 is "per-query inference with a large API-based model", and the authors attribute the gap to that: "per-query inference with a large API-based model is more expensive than with a dedicated small model". So the pair compares different base models at different accuracy (82.7 against 67.0 on AIME24, both in F03-90), and the source names model size, not method, as the cause of the serving gap. The register entry F03-91 omits which model each figure belongs to, and the "ignoring the RL model's idle GPU cost" caveat in its [DERIVED] breakeven is dropped in SCOPE. Arithmetic check: ($10,000 - $18) / ($0.02 - $0.005) = 665,467, so "about 665,000".
- Replacement, section 13: "Training-Free GRPO supplies a cost pair across two different models: about $18 of API tokens to improve the frozen 671B DeepSeek-V3.1-Terminus (82.7 on AIME24), against about $10,000 of GPU time at the authors' assumed $0.5 per GPU-hour to RL-train ReTool on Qwen2.5-32B (67.0). Serving reverses it, $0.02 per problem on the large API model against $0.005 on the dedicated 32B model, which the authors attribute to model size (F03-91, F03-90)."
- Replacement, section 21: "Serving side: $0.02 per problem for the text loop on a 671B API model against $0.005 for the 32B RL model on four GPUs that must stay up (F03-91). The breakeven under the paper's prices is about 665,000 served problems [derived], comparing artifacts on different base models at different accuracy, so the section shows the reader how to redo it on one base model at real rates. [our reading] Text loops are cheap to train and pay at serving when they ride on a larger model than the RL alternative; on the same model, the serving penalty is the extra context tokens (F03-35), which prompt caching narrows (F03-79)."
- Register fix: add the model names and the 82.7 / 67.0 accuracy pair to F03-91, and the paper's "≈ $4" cost for the Qwen3-32B Training-Free GRPO run (Table 3) to F03-90.

**17. BLOCKER. Section 19: the 76-point figure measures input prompt formatting, and the source says instruction tuning does not remove it.**
- Location: section 19, "Constraints and output format are stated in context and followed reliably only from weights, with format sensitivity up to 76 points (F04-52)".
- Cited: F04-52.
- What the primary source says (2310.11324v2 abstract, fetched): "extremely sensitive to subtle changes in prompt formatting in few-shot settings, with performance differences of up to 76 accuracy points when evaluated using LLaMA-2-13B. Sensitivity remains even when increasing model size, the number of few-shot examples, or performing instruction tuning." The paper is about how the prompt is formatted (separators, casing, spacing), not about whether outputs follow a format or constraint. Instruction tuning is a weight update, and the sensitivity "remains" after it, so "followed reliably only from weights" is contradicted by the cited source. No register entry supports the "only from weights" half.
- Replacement: "Constraints and output format are stated in context. How the prompt itself is formatted moved few-shot accuracy by up to 76 points on LLaMA-2-13B, and instruction tuning did not remove that sensitivity (F04-52), so a format rule found by a text loop may not survive a model change. [our reading] Whether training a format into the weights makes it reliable was not measured in the sources read; this row is marked contested."

**18. BLOCKER. Section 20: "the frameworks correct for it by default" is contradicted by F05-16.**
- Location: section 20, "Even "on-policy" runs are slightly off-policy because vLLM and the trainer compute different probabilities for the same weights, and the frameworks correct for it by default (F05-16, F05-22)".
- Cited: F05-16, F05-22.
- What the register and code say: F05-16: OpenRLHF's `--algo.advantage.is_correction_level` has "default `off`"; F05-22's own use line: "OpenRLHF defaults the correction off, TRL defaults it on." Confirmed at source: `openrlhf/cli/train_ppo_ray.py` at v0.11.2 line 261 to 263, `"--algo.advantage.is_correction_level", type=str, default="off"`; `trl/trainer/grpo_config.py` at v1.16.0 lines 925 to 935, `vllm_importance_sampling_correction ... default=True` and `vllm_importance_sampling_mode ... default="sequence_mask"`. F05-16 also records that the claim that the mismatch matters comes from a third-party post not read (U6).
- Replacement: "Even "on-policy" runs are slightly off-policy because vLLM and the trainer compute different probabilities for the same weights. TRL corrects for it by default with sequence-level masking (F05-22); OpenRLHF ships the same correction switched off (F05-16)."

**19. MAJOR. Section 13: the 37-against-4.4 comparison drops the register's model-mismatch caveat.**
- Location: section 13, "on 32B-class models RL lifted AIME24 by about 37 points against 4.4 for the text loop [derived] (F03-90)".
- Cited: F03-90.
- What the register says: "on 32B-class models, RL lifted AIME24 by about 37 points and the text loop by 4.4 [DERIVED: 67.0 minus 29.6, and 33.5 minus 29.1], with the caveat that the 32B models differ (Qwen2.5-32B vs Qwen3-32B)". The 37 is also the best of four RL methods (ReTool); ZeroTIR gained 27.1 [derived: 56.7 minus 29.6].
- Replacement: "on 32B-class models with a code tool, RL lifted AIME24 by up to about 37 points on Qwen2.5-32B-Instruct, against 4.4 for the text loop on Qwen3-32B, a different 32B model [derived] (F03-90)."

**20. MAJOR. Section 15: "Stronger models need fewer samples" is a causal claim the table does not make, and the FunSearch figure is unverified.**
- Location: section 15, "Stronger models need fewer samples, from millions for FunSearch to thousands for AlphaEvolve (F03-96)".
- Cited: F03-96.
- What the register says: AlphaEvolve's Table 1 lists several differences at once (one 10 to 20 line function against hundreds of lines; evaluation in 20 minutes on one CPU against hours on accelerators; "small LLMs used; no benefit from larger" against "benefits from SOTA LLMs"). It does not attribute the sample count to model strength. The register adds: "The millions figure for FunSearch is AlphaEvolve's description and was not checked against the FunSearch paper (UNKNOWN U11)."
- Replacement: "AlphaEvolve's authors describe FunSearch as using millions of LLM samples and AlphaEvolve as needing thousands, while AlphaEvolve also evolves whole files, evaluates for longer and uses frontier models (F03-96; the FunSearch figure is not yet checked against its own paper). [our reading] Better proposals mean fewer of them are needed."

**21. MAJOR. Section 18: "A general LLM is not" generalises a study of 2023 models.**
- Location: section 18, "A general LLM is not: in a bandit study only one configuration explored satisfactorily, and only with an externally summarised history (F04-8 to F04-10)".
- Cited: F04-8, F04-9.
- What the register says: F04-9: "Models: GPT-3.5-Turbo-0613, GPT-4-0613, Llama2-13B-chat quantized to 4 bits", Bernoulli bandits with K = 4 or 5 arms. F04-17 reports that on a later test "reasoning models exploit best but are slow or expensive". The negative result is real for the models tested; the sentence states it for every general LLM.
- Replacement: "The general LLMs tested were not: across GPT-3.5, GPT-4 and Llama2 on small bandits, only one configuration explored satisfactorily, and only with an externally summarised history (F04-8 to F04-10); Gemma2 models from 2B to 27B committed early in a second study (F04-11)."

**22. MAJOR. Section 20: AReaL's verl baseline hours are author estimates, stated as a measured run.**
- Location: section 20, "finishing a 1.5B math run in 14.8 hours against 33.6 for synchronous verl (F05-7 to F05-10)".
- Cited: F05-10.
- What the register and paper say: F05-10: "benchmark claim (author reported; verl hours were "estimated" by the authors)". Confirmed at source (2505.24298v5): "we measure the throughput and estimate the training hours using the latest verl code for a fair comparison". Same table: synchronous AReaL took 41.0 hours, so the async gain against AReaL's own synchronous mode is larger than against verl.
- Replacement: "finishing a 1.5B math run on 16 H800 nodes in 14.8 hours, against 41.0 for its own synchronous mode and an author-estimated 33.6 for synchronous verl (F05-7 to F05-10)."

**23. MAJOR. Section 22: the Nova recipe's "two versions old" is [our reading] in the register, stated as fact.**
- Location: section 22, "the Nova 2 RFT recipe samples from policies up to two versions old, the asynchronous design of section 20 (F06-41)".
- Cited: F06-41.
- What the register and code say: F06-41: "[our reading] `age_tolerance: 2` bounds how many policy updates old a rollout may be when it is trained on; the recipe does not define the unit." Confirmed at source: `nova_lite_2_0_p5_gpu_rft.yaml` at a6030c31 has `type: off_policy_async` / `age_tolerance: 2` with no comment defining the unit.
- Replacement: "the Nova 2 RFT recipe sets `rollout_strategy.type: off_policy_async` with `age_tolerance: 2` (F06-41); [our reading] that bounds rollouts to about two policy versions old, the asynchronous design of section 20, though the recipe does not define the unit."

**24. MINOR. Thesis and section 14: the GRPO comparator was LoRA GRPO at a fixed 24,000 rollouts.**
- Location: Thesis and section 14, "54.85 against GRPO's 48.91".
- Cited: F03-61 (condition recorded in F04-46).
- What the source says (2507.19457v2, fetched): "We use LoRA for GRPO due to its low cost", with "Figure 11 shows a similar result comparing GEPA to GRPO with full finetuning."
- Replacement (section 14): "on Qwen3 8B over six tasks, 54.85 against LoRA GRPO's 48.91 (a full fine-tuning comparison shows a similar result), with 1,839 to 7,051 rollouts against 24,000 (F03-61, F04-46)".

**25. MINOR. Section 14: "strictly rises" and "pinned in DSPy" cite the wrong entries.**
- Location: section 14, "accepts a rewrite only if a minibatch score strictly rises, drawing parents from a per-instance Pareto front (F03-59, F03-60), with the implementation pinned in DSPy".
- Cited: F03-59, F03-60.
- What the register says: F03-59 says the child is accepted "if the minibatch score improves". The strict rule is F03-72, at gepa v0.1.4 (the version DSPy 3.4.1 pins): `return new_sum > old_sum`, confirmed at source.
- Replacement: "accepts a rewrite only if the minibatch score sum strictly rises, drawing parents from a per-instance Pareto front (F03-59, F03-60, F03-72; gepa v0.1.4, the version DSPy 3.4.1 pins)".

**26. MINOR. Section 14: the README range is "closer to" the training-rollout count, not a match.**
- Location: section 14, "the README's evaluation range matches the training-rollout count, not the full budget (F03-73)".
- Cited: F03-73.
- What the register says: README "100-500 evaluations"; paper training rollouts "79 to 737"; verdict "the README's range is closer to the paper's training-rollout counts".
- Replacement: "Budget from the paper's totals: the README's 100 to 500 evaluations sits near the paper's training-rollout counts (79 to 737), not its full budgets of 1,839 to 7,051 (F03-73)."

**27. MINOR. Section 13: Voyager's 73% is a drop in discovered items; Anthropic's "no learning loop" is scoped to the pages read.**
- Location: section 13, "Voyager lost 73% without self-verification (F03-38)" and "Anthropic's Agent Skills and memory tool are documented as storage and authoring features, with no learning loop claimed (F03-40 to F03-42)".
- What the register says: F03-38: "Removing self-verification cuts discovered items by 73%". F03-41: "hedge scope: within the two pages read"; the engineering post states the hope "to enable agents to create, edit, and evaluate Skills on their own".
- Replacement: "Voyager discovered 73% fewer items without self-verification (F03-38)" and "On the pages read, Anthropic's Agent Skills and memory tool are documented as storage and authoring features with no learning loop; self-authoring of skills is stated as a future goal (F03-40 to F03-42)."

**28. MINOR. Section 21: "triple tokens per answer" fits one of two variants.**
- Location: section 21, "memory loops that triple tokens per answer (F03-35)".
- What the register says: Claude Sonnet on AIME 2024, "370 tokens per answer at baseline ... 1,035 under DC-RS and 1,831 under DC-Cu", that is 2.8x and 4.9x [derived].
- Replacement: "memory loops that raise tokens per answer roughly three to five times (Dynamic Cheatsheet on AIME 2024, 370 to 1,035 or 1,831 [derived], F03-35)".

**29. MINOR. Section 15: FunSearch "works best" with a graded score; "must" overstates.**
- Location: section 15, "it must give a graded score (F03-93)".
- What the register says: "FunSearch, at present, works best for problems having ... a 'rich' scoring feedback quantifying the improvements (as opposed to a binary signal)".
- Replacement: "and it works best when the score is graded rather than pass or fail (F03-93)."

**30. MINOR. Section 17: RL fine-tuning improves exploration partially; "fix" overstates.**
- Location: section 17, "RL fine-tuning or distillation of a bandit algorithm to fix exploration (F04-13, F04-14)".
- What the register says: F04-13: "While RLFT improves the exploration, it remains sub-optimal compared to bandit algorithms."
- Replacement: "RL fine-tuning or distillation of a bandit algorithm to improve exploration, which closes part of the gap to a classical bandit algorithm (F04-13, F04-14)".

**31. MINOR. Section 19: forgetting is predicted by KL, on a quadratic fit, not "in proportion".**
- Location: section 19, "since weight updates forget in proportion to KL (F04-47)".
- What the register says: "Forgetting is predicted by the KL divergence ... (quadratic fit R^2 0.96 on ParityMNIST, 0.71 in LLM experiments)".
- Replacement: "since forgetting after a weight update tracks the KL from the base model (F04-47)".

**32. MINOR. Section 20: the four-stage step cites only the three-stage entry, and the 36.4% is HybridFlow quoting OpenRLHF.**
- Location: section 20, "and a weight sync back to the inference engine (F05-1)" and "up to 36.4% of an iteration ... (F05-3)".
- What the register says: F05-1 is three stages; its use line adds "a fourth step, weight sync, appears when generation and training run on different engines (F05-4)". F05-3: "benchmark claim (author reported, about a third-party system)", HybridFlow citing OpenRLHF (2023).
- Replacement: "... and a weight sync back to the inference engine (F05-1, F05-3)" and "up to 36.4% of an iteration when training and generation sit on different devices, a figure HybridFlow quotes from OpenRLHF's 2023 system (F05-3)".

**33. MINOR. Section 22: the Bedrock-hosted judge exists only for Nova; promotion needs the customer's approval; "none ... changing weights" is scoped to pages read; the episodic judge is a separate extraction model.**
- Location: section 22, "against a customer Lambda reward or a Bedrock-hosted judge"; "promotes them after batch evaluation or an A/B test"; "None of these is described as changing weights (F06-59)"; "[our reading] The episodic signal is the model judging its own success".
- What the register says: F06-5: "For open-weight RFT there is no console judge; the judge, if any, is a Bedrock model called from inside the customer's Lambda." F06-54: "Every recommendation requires your approval before it ships." F06-59: "wording inventory; scoped to the pages read for this file". F06-50 and F06-52: the outcome verdict is produced by the strategy's extraction step, "defined by a system prompt", on a foundation model the customer may choose; it is an LLM verdict on the transcript, not necessarily the acting model's own.
- Replacement: "against a customer Lambda reward or, for Nova, a Bedrock-hosted judge compiled into a Lambda (F06-4, F06-5)"; "promotes them, with the customer's approval, after batch evaluation or an A/B test (F06-53 to F06-55)"; "On the pages read, none of these is described as changing weights (F06-59)"; "[our reading] The episodic signal is an LLM's yes-or-no verdict on the transcript with no external check, the kind of signal sections 10 and 12 identify as weak".

**34. MINOR. Section 8: the forgetting result needs its tested models.**
- Location: section 8, "RL forgets less than SFT and forgetting tracks KL to the base (F02-87)".
- Cited: F02-87.
- What the register says: "at similar task performance ... Tested on Qwen2.5-3B-Instruct (math, science QA, tool use) and OpenVLA 7B (robotics)."
- Replacement: "RL forgot less than SFT at matched task performance on Qwen2.5-3B-Instruct and OpenVLA 7B, and forgetting tracked KL to the base (F02-87)".

**35. MINOR. Register and cross-document consistency.**
- Yue et al. 2504.13837v5 is graded "Tier 3, peer-reviewed (NeurIPS 2025 Oral, per arXiv journal-ref)" in F02-40 and "Tier 3 (preprint per arXiv record)" in F04-49. The arXiv abstract page shows "Journal reference: NeurIPS 2025 Oral; ICML 2025 AI4MATH workshop best paper". Fix F04-49 before section 25 groups sources by tier.
- The Bedrock pricing page lists gpt-oss-20b and Qwen3 32B RFT training at $80.00 under "Regions: US East (N. Virginia) and US West (Oregon)", while the RFT model table lists both in us-west-2 only. SCOPE's "each in one Region" follows the model table, which is the right source for availability; add a note in research 06 that the two first-party pages differ.
- Section 1 says "States the four questions", while the Thesis and section 24 say "three questions". They are different sets (the four dive questions in the subtitle; the three choice questions), but the reader meets "four" without a list. Replacement in section 1: "States the dive's four questions (what RL does, what a loop can reproduce, where words fall short, how to choose) and the thesis answer".
- Key sources, AWS line: the What's New list omits the posts research 06 cites for AgentCore Evaluations (2025-12-02, 2026-03-31) and Advanced Prompt Optimization (2026-05-14). Add them.

## Verified against primary source

Each entry: claim, URL fetched on 2026-10-17, what was seen.

1. GEPA against GRPO on Qwen3 8B. https://arxiv.org/html/2507.19457v2 . Table 1: "GRPO 43.33 35.88 38.67 86.66 38.00 51.26 48.91", "GEPA 62.33 38.61 52.33 91.85 32.00 51.95 54.85", "GEPA (+Merge) 6871 3593 7051 2426 1839 1839 3936", "GRPO 24000 ... 24000". Confirms Thesis, sections 14 and 21, and the AIME-2025 38.00 against 32.00.
2. GEPA's GRPO comparator used LoRA. Same URL: "We use LoRA for GRPO due to its low cost", "Figure 11 shows a similar result comparing GEPA to GRPO with full finetuning." (Finding 24.)
3. Training-Free GRPO costs and models. https://arxiv.org/html/2510.08191v1 . "+ Training-Free GRPO ≈ $18 DAPO-100 DeepSeek-V3.1-Terminus CI 82.7"; "ReTool ≈ $10,000 Qwen2.5-32B-Instruct CI 67.0"; "ReAct - Qwen2.5-32B-Instruct CI 29.6"; "Qwen3-32B (Non-Thinking) CI 29.1" to "33.5 (↑ 4.4)" at "≈ $4"; "4 x GPUs at the price of $0.5 per GPU-hour ... The inference cost per problem averages $0.005"; "60K input tokens and 8K output tokens, totaling about $0.02 per problem"; "per-query inference with a large API-based model is more expensive than with a dedicated small model". (Findings 16 and 19.)
4. InstructGPT compute and preference result. https://arxiv.org/pdf/2203.02155v1 . "training our 175B SFT model requires 4.9 petaflops/s-days and training our 175B PPO-ptx model requires 60 petaflops/s-days, compared to 3,640 petaflops/s-days for GPT-3"; "In human evaluations on our prompt distribution, outputs from the 1.3B parameter InstructGPT model are preferred to outputs from the 175B GPT-3". (Finding 1.)
5. Gao et al. functional forms. https://arxiv.org/pdf/2210.10760v1 . "Rbon(d) = d(αbon - βbon d), and for reinforcement learning, RRL(d) = d(αRL - βRL log d)"; "reinforcement learning tends to be slower than best-of-n sampling at both optimization and overoptimization. This suggests inadequacies with using KL to compare amount of (over)optimization across methods." (Finding 2.)
6. Reflexion ablation. https://arxiv.org/pdf/2303.11366v4 . Table 3: "Base model False False 0.60 / Test generation omission False True 0.52 / Self-reflection omission True False 0.60 / Reflexion True True 0.68", caption "using GPT-4 as the base model on HumanEval Rust - 50 hardest problems". Confirms the Thesis number; conditions added in finding 5.
7. LoRA Without Regret. https://thinkingmachines.ai/blog/lora/ . "LoRA fully matches the learning performance of FullFT when running policy gradient algorithms for reinforcement learning, even with ranks as low as 1"; "Supervised learning arguably provides O(number of tokens) bits per episode ... only O(1) bits per episode"; "Assuming each completion yields a single bit of information, the whole training process only needs to absorb 320,000 bits." (Finding 3.)
8. RL's Razor. https://arxiv.org/abs/2509.04259v1 . "the degree of forgetting is determined by the distributional shift, measured as the KL-divergence between the fine-tuned and base policy evaluated on the new task"; "on-policy RL is implicitly biased towards KL-minimal solutions". (Finding 3.)
9. Yue et al. https://arxiv.org/abs/2504.13837v5 . "While RLVR-trained models outperform their base models at small k (e.g., k = 1), the base models achieve a higher pass@k score when k is large." Journal reference: "NeurIPS 2025 Oral". Confirms Thesis and section 8; finding 35 for the register tier.
10. Invisible Leash. https://arxiv.org/html/2507.14843v5 . "ProRL-1.5B-v2 loses 175 questions while gaining 48, a ratio of approximately 3.6 : 1"; "base pass@8192 reaches 93.3%, compared with ProRL-1.5B-v1's 83.3%". Confirms Thesis and section 8.
11. DeepSeek-R1 v2 headline and cost. https://arxiv.org/html/2501.12948v2 . "jumping from an initial 15.6% to 77.9%"; Table 7 "assuming the rental price of H800 is $2 per GPU hour ... 101K 5K 41K 147K ... $202K $10K $82K $294K"; "we experimented with smaller-scale models, specifically a 7B dense model and a 16B Mixture-of-Experts (MoE) model ... consistently failed to yield meaningful improvements". Confirms sections 7 and 21; finding 9 on scope.
12. AReaL end-to-end hours. https://arxiv.org/pdf/2505.24298v5 . Table 1: "w/ VeRL 43.1* 16 250 33.6 / w/ Sync.AReaL 42.0 16 250 41.0 / w/ AReaL (ours) 42.2 16 250 14.8"; "we measure the throughput and estimate the training hours using the latest verl code". (Finding 22.)
13. Skywork-OR1 rollout scaling. https://arxiv.org/pdf/2505.22312v2 . Table 9: "The number of H800 32 64 128 256 Rollout time tR (reduction) 375 270 (-105) 225 (-45) 205 (-20)", "Rollout time tR (seconds) for generating 1024 responses in one training step"; "tR is primarily determined by the batch size and the time required to generate the longest response." Confirms section 20.
14. OpenRLHF correction default. https://raw.githubusercontent.com/OpenRLHF/OpenRLHF/v0.11.2/openrlhf/cli/train_ppo_ray.py lines 261 to 263: `"--algo.advantage.is_correction_level", type=str, default="off"`. (Finding 18.)
15. TRL correction default. https://raw.githubusercontent.com/huggingface/trl/v1.16.0/trl/trainer/grpo_config.py lines 925 to 935: `vllm_importance_sampling_correction: bool = field(default=True,` and `vllm_importance_sampling_mode: str = field(default="sequence_mask",`. (Finding 18.)
16. Prompt-format sensitivity. https://arxiv.org/abs/2310.11324v2 . "sensitive to subtle changes in prompt formatting in few-shot settings, with performance differences of up to 76 accuracy points when evaluated using LLaMA-2-13B. Sensitivity remains even when increasing model size, the number of few-shot examples, or performing instruction tuning." (Finding 17.)
17. ImpossibleBench. https://arxiv.org/html/2510.20270v1 . "GPT-5 cheats in 76% of the tasks in Oneoff-SWEbench and 2.9% on Oneoff-LiveCodeBench". Confirms section 10.
18. DeepSWE. https://www.together.ai/blog/deepswe . "42.2% Pass@1, 71.0% Pass@16", "Pass@1 performance (42.2%, averaged over 16 runs)", "across six days on 64 H100 GPUs". Number confirmed; vendor-blog tier in finding 11.
19. Advisor Models. https://arxiv.org/html/2510.02453v3 . "both RL and Advisor Models make major improvements over the baseline chrF of 31.17 with 42.38 and 38.98, respectively". Confirms section 17 and the [derived] 70%.
20. Bedrock RFT user guide. https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html . GRPO ("using Group Relative Policy Optimization (GRPO)"); model table "Nova 2 Lite ... us-east-1", "gpt-oss-20B ... us-west-2", "Qwen3 32B ... us-west-2"; "If rewards are consistently 0 percent, use supervised fine-tuning first ... If rewards are greater than 95 percent, reinforcement fine-tuning might be unnecessary"; "improves model accuracy by up to 66% on average compared to base models". Confirms section 22.
21. Bedrock RFT pricing. https://aws.amazon.com/bedrock/pricing/ . "The entire training workflow is billed at an hourly rate."; "gpt-oss-20b $ 80.00 $ 0.09 $ 0.39 $ 1.95"; "Qwen3 32B $ 80.00 $ 0.20 $ 0.78 $ 1.95", under "Regions: US East (N. Virginia) and US West (Oregon)". Confirms section 21; Region note in finding 35.
22. AgentCore optimization GA. https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-bedrock-agentcore-new-optimization-capabilities/ . "Posted on: Jun 17, 2026"; "Batch evaluations, recommendations, and A/B tests are generally available today in 14 AWS Regions." Confirms section 22's date.
23. HyperPod GRPO recipe. https://raw.githubusercontent.com/aws/sagemaker-hyperpod-recipes/a6030c319908c8a1b74cb619b00476f8e6baa04f/hyperpod_recipes/recipes_src/fine-tuning/qwen-0_7_0/verl-grpo-rlvr-qwen-3-32b-lora.yaml : `adv_estimator: grpo` (line 35), `use_kl_loss: true` (38), `name: vllm` (51), `lambda_arn: ''` (102), `ml.p5.48xlarge`, `ml.p4de.24xlarge` (8 to 9); shared `rollout/rollout.yaml` `n: 8`. GitHub API: tag 2.0.11 resolves to commit a6030c319908c8a1b74cb619b00476f8e6baa04f, published 2026-10-02. Confirms section 22.
24. Nova 2 RFT recipe. Same SHA, `nova/nova_2_0/nova_lite/RFT/nova_lite_2_0_p5_gpu_rft.yaml` lines 30 to 34: `type: off_policy_async`, `age_tolerance: 2`, `number_generation: 8`; no unit defined. (Finding 23.)
25. GEPA acceptance rule. https://raw.githubusercontent.com/gepa-ai/gepa/v0.1.4/src/gepa/strategies/acceptance.py : `class StrictImprovementAcceptance` "Accept only if the sum of new subsample scores is strictly greater than the old sum. This is the default acceptance criterion used by GEPA." `return new_sum > old_sum`. Confirms "strictly rises"; finding 25 for the ID.

## Verdict

**FAIL.**

Most of the 164 cited claims hold against their registers, and every number fetched at a primary source matched the register. Five claims are contradicted by their own sources or attach a number to the wrong condition: the 60 petaflop/s-days figure (wrong model), best-of-n "on the same curve" (different functional form), the 76-point format figure (input formatting, persists after instruction tuning), "the frameworks correct for it by default" (OpenRLHF defaults off), and the serving-cost reversal behind section 21's decision variable (a 671B API model against a 32B model, which the source attributes to model size). Each has exact replacement text above. With those five and the MAJOR scope and label fixes applied, a short re-check of sections 13, 19, 20 and 21 should be enough to move this to PASS WITH FIXES.
