# Claims: section 17, Where Words Fall Short (`WhereWordsFallShort.tsx`)

Authored 2026-10-30. One line per assertion: `claim | source URL | register or wave 2 row`.
Every source below was re-opened on 2026-10-30: arXiv abstract pages of 2210.14215v1, 2306.14892v1,
2403.15371v3, 2504.16078v1, 2502.00225v4, 2505.00212v3, 2505.08638v3, 2404.06654v3, 2307.03172v3,
2610.31710v2; the arXiv HTML of 2403.15371v3, 2504.16078v1, 2502.00225v4, 2505.00212v3, 2505.08638v3,
2404.06654v3; the PDFs of 2210.14215v1 and 2306.14892v1; verl `agent_loop.py` and `core_algos.py` at
tag v0.9.1 (raw files, line numbers checked); the Amazon Bedrock prompt-caching user guide; the
Anthropic prompt-caching docs. Venues: AD ICLR 2023 (listed on the ICLR 2023 virtual site); DPT
NeurIPS 2023 (wave 2 G1); Krishnamurthy et al. NeurIPS 2024 (arXiv comments); Explore or Exploit UAI
2026 (arXiv comments); Who&When ICML 2025 (PMLR v267, zhang25cq); RULER COLM 2024 and Lost in the
Middle TACL 2023 (arXiv comments); Greedy Agents, TRAIL and Compact-Bench preprints (no venue on the
record).

Notes for the fact checkers:
- Wave 2 row 23 (DPT WRONG) applied: only AD trains on learning histories; DPT predicts optimal
  actions from in-context datasets that may be random. Detail is in the expandable.
- Row 26 applied: the knowing-doing gap is scoped to Gemma2 27B. The paper's introduction gives 64%
  for the greedy share; Section 4.2 and Figure 5 give 58% against 21%. The page uses 58/21 and states
  the discrepancy in the expandable.
- Row 27 applied. "GPT-5.2" checked: listed in Section 1's model list and in Figure 5. "Every model"
  checked: abstract "all LLMs we study perform worse than a simple linear regression, even in
  non-linear settings"; Figure 2 caption calls linear regression "an upper-bound on the performance
  of any model"; Figure 5 "all configurations are still significantly out-performed by the linear
  baseline". Tool use was tested on the GPT-4 family only, which the expandable says.
- verl line ranges at v0.9.1 match the wave 2 SHA: agent_loop.py L143-L148 (per-sample path) and
  L1093-L1099 (batched path, not cited here); core_algos.py L304-L331 (GRPO outcome advantage).
- Hedges shipped: U13 (fresh context against compaction), U14 narrowed (TRAIL 23.8%, Who&When 14.2%),
  U15 (no rerun on 2026 reasoning models; E4 not run).

## Claims

In-context RL: a policy that improves across episodes inside one context with its weights untouched (definition) | https://arxiv.org/abs/2210.14215v1 | F04-1, SCOPE section 17
Algorithm Distillation trains a transformer on learning histories of an RL algorithm | https://arxiv.org/abs/2210.14215v1 (Abstract) | F04-1, wave2-limits row 23
AD "is able to improve its policy entirely in-context without updating its network parameters" | https://arxiv.org/abs/2210.14215v1 (Abstract) | F04-1, wave2-limits row 23
DPT trains a transformer to predict the optimal action from an in-context dataset of interactions, across many tasks | https://arxiv.org/abs/2306.14892v1 (Abstract) | F04-5, wave2-limits row 23
DPT's in-context dataset may be random interactions, expert demonstrations or an algorithm's rollouts | https://arxiv.org/abs/2306.14892v1 (Section 3, PDF p. 3) | wave2-limits row 23
DPT explores online and is conservative offline "despite not being explicitly trained to do so" | https://arxiv.org/abs/2306.14892v1 (Abstract) | F04-5, wave2-limits row 23
Both models trained on decision tasks with decision targets; a general chat model trained for other targets, so in-context learning from reward is an empirical question | (our reading) | F04-3, F04-5 (synthesis)
DPT authors: "further investigation is required to understand the implications ... for existing foundation models, such as instruction-finetuned models" | https://arxiv.org/abs/2306.14892v1 (Limitations and future work) | F04-7
ED (Expert Distillation) is the same as AD but trained on expert trajectories only; "AD maximizes the episodic return with in-context RL while ED does not learn" | https://arxiv.org/abs/2210.14215v1 (baselines; Figure 4 text) | F04-3
"multi-episodic contexts of 2-4 episodes are necessary to learn a near-optimal in-context RL algorithm" | https://arxiv.org/abs/2210.14215v1 (Figure 7 text) | F04-2
AD's main limitation is long episodes | https://arxiv.org/abs/2210.14215v1 (Conclusion) | F04-4
A context that cannot hold several attempts cannot learn across them in the AD sense (our reading) | (our reading) | F04-2, F04-4 "Use in dive"
DPT "can be viewed as an efficient implementation of Bayesian posterior sampling, a provably sample-efficient RL algorithm" | https://arxiv.org/abs/2306.14892v1 (Abstract) | F04-6
DPT theory assumes the model "fits the pretraining distribution exactly with enough coverage and data" | https://arxiv.org/abs/2306.14892v1 (Section 6) | F04-6
DPT needs optimal-action labels; actions from another RL-trained agent work with "a slight loss in performance" | https://arxiv.org/abs/2306.14892v1 (Limitations and future work) | F04-7 (new detail, read at source)
Across GPT-3.5, GPT-4 and Llama2 with many prompt designs, only GPT-4 with chain-of-thought and an externally summarised history explored satisfactorily | https://arxiv.org/abs/2403.15371v3 (Abstract) | F04-8, wave2-limits rows 1, 24
The summarised history gave the number of plays and average reward of each arm | https://arxiv.org/html/2403.15371v3 (Section 2, prompt design) | F04-8
Configurations with chain-of-thought and unsummarised history did not explore satisfactorily | https://arxiv.org/abs/2403.15371v3 (Abstract) | F04-8, wave2-limits row 24
Greedy = taking the option with the best average reward so far (definition) | https://arxiv.org/html/2403.15371v3 (Figure 1 caption: Greedy "always chooses an arm with the best average reward so far") | F04-9
Gemma2 2B covered 40% of 10 arms, 9B and 27B 65%; "the model prematurely commits to a greedy strategy" | https://arxiv.org/abs/2504.16078v1 (Section 4.2) | F04-11, wave2-limits row 25
Gemma2 27B asked to produce UCB, compute its values and act; 87% of rationales correct; with correct rationales greedy 58% against optimal 21% | https://arxiv.org/abs/2504.16078v1 (Section 4.2, Figure 5) | F04-12, wave2-limits row 26
Knowing-doing measured on Gemma2 27B only, 64 instances, 50 timesteps | https://arxiv.org/abs/2504.16078v1 (Section 4.2) | F04-12, wave2-limits row 26
Introduction gives 64% of actions greedy when rationale is correct (internal inconsistency) | https://arxiv.org/abs/2504.16078v1 (Introduction) | F04-12
UCB adds a bonus to options tried less often (definition of an RL term; the paper's UCB instructions count plays and compute mean rewards and UCB values) | https://arxiv.org/abs/2504.16078v1 (Section 4.2, Figure 22) | F04-12 (gloss)
Exploitation-only: models tested (GPT-5.2 among them) did well on small problems and degraded as problems grew; reasoning models did best | https://arxiv.org/abs/2502.00225v4 (Abstract, Section 1) | F04-17, wave2-limits row 27
On contextual bandits every model tested stayed below a simple linear regression, including with the mitigations tried (code interpreter, in-context summaries); quote "all LLMs we study perform worse than a simple linear regression, even in non-linear settings" | https://arxiv.org/abs/2502.00225v4 (Abstract; Figures 2 and 5) | F04-17, wave2-limits row 27
LLMs useful as proposers of candidate actions in large, semantically meaningful action spaces; the set "can then be used to instantiate an off-the-shelf bandit algorithm" | https://arxiv.org/abs/2502.00225v4 (Abstract, Section 1, Section 4) | F04-17, wave2-limits row 27
Frozen models are strong proposers and weak statisticians; keep counts, averages and choice rule in code (our reading) | (our reading) | register 04 section 5 mental model 3; F04-10, F04-17
Exploration failure measured on GPT-3.5, GPT-4, Llama2 (NeurIPS 2024) and Gemma2 (2025 preprint); no rerun on 2026 reasoning models located; E4 not run | https://arxiv.org/abs/2403.15371v3 ; https://arxiv.org/abs/2504.16078v1 | U15 hedge, wave2-limits G6
"Frontier models can now solve fairly complicated MAB exploit puzzles. In contrast, Gpt-4 and Gpt-3.5 struggle, partially explaining their failure on end-to-end MAB tasks", citing Krishnamurthy et al. and Nie et al. 2024 | https://arxiv.org/html/2502.00225v4 (Section 2, Takeaways) | wave2-limits G6
Tool use tested on GPT-4 family because GPT-5 models were not configured for tool use at the time of writing; code interpreter lifted GPT-4 above GPT-5.2 and made it much slower and more expensive | https://arxiv.org/html/2502.00225v4 (Section 2, Figure 2) | new (read at source)
verl writes the episode reward into the last response position of a zero tensor | https://github.com/volcengine/verl/blob/v0.9.1/verl/experimental/agent_loop/agent_loop.py#L143-L148 | F02-39, wave2-limits row 28, wave2-rlvr row 42
verl's GRPO estimator sums token rewards, normalises against the group for the same prompt index, and multiplies by the response mask (same advantage on every response token) | https://github.com/volcengine/verl/blob/v0.9.1/verl/trainer/ppo/core_algos.py#L304-L331 | new for this section (also cited in section 9, AgenticRl.tsx)
RL assigns credit statistically across many rollouts; a good and a wasted step in one attempt get the same push; recurring steps in high-scoring attempts gain (our reading) | (our reading) | wave2-limits row 28 ("statistically across many rollouts" under the [our reading] label)
Who&When: failure logs from 127 LLM multi-agent systems; best method 53.5% agent, 14.2% decisive step; some methods below random | https://arxiv.org/abs/2505.00212v3 (Abstract) | F04-26, wave2-limits rows 2, 29
Accuracy falls as context length grows, step-level most; all three methods converge to near 0% at maximum context | https://arxiv.org/html/2505.00212v3 (Section 4.4, Finding 4) | F04-26, wave2-limits row 29
TRAIL single-agent SWE-bench traces (CodeAct agent, Claude 3.7 Sonnet backbone): best of eight judge models located the error 23.8% (Gemini 2.5 Pro); three of eight could not fit the traces in context | https://arxiv.org/abs/2505.08638v3 (Table 1; Conclusion) | U14 hedge, wave2-limits G3
Whether a coding agent's own reflection blames the right step when tests fail was not measured in any study located | (hedge) | U14 accept-as-hedge (narrowed), wave2-limits G3
One change per trial and short logs per attempt make credit cheap (our reading; section 15's checklist) | (our reading) | F04-66, F04-26
RULER: threshold is Llama2-7B's score at 4K, 85.6%; effective length = maximum length passing it | https://arxiv.org/html/2404.06654v3 (Table 3 caption) | F04-32, wave2-limits row 30
GPT-4 claimed 128K, effective 64K; scores 96.6, 96.3, 95.2, 93.2, 87.0, 81.2 at 4K to 128K | https://arxiv.org/html/2404.06654v3 (Table 3) | F04-32, wave2-limits row 30
Models all claiming 32K or more; only half held up at 32K | https://arxiv.org/abs/2404.06654v3 (Abstract) | F04-32
Performance "often highest when relevant information occurs at the beginning or end of the input context", degrades in the middle | https://arxiv.org/abs/2307.03172v3 (Abstract) | F04-31, wave2-limits row 31
Claude API: hits need "100 percent identical prompt segments"; hierarchy tools, system, messages; a change invalidates that level and all subsequent levels | https://platform.claude.com/docs/en/build-with-claude/prompt-caching | F04-38, wave2-limits row 32
Bedrock: "Changes to a prompt prefix in subsequent requests result in cache misses." | https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html | F04-40, wave2-limits row 32
Bedrock implicit caching: static first, dynamic last increases the likelihood of an exact prefix match; best effort; "Repeating an identical prompt doesn't guarantee a cache hit" | https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html | F04-40, wave2-limits rows 22, 32
Claude API pricing: cache read 0.1x base input on most models (per-model exceptions in the table footnote), 5-minute cache write 1.25x | https://platform.claude.com/docs/en/build-with-claude/prompt-caching (Pricing) | F04-39
Edit near the top: following tokens go from read price to full input price, and to write price if re-cached; 1.25 / 0.1 = 12.5x the read price (our arithmetic) | (derived from the two multipliers above) | F04-39 (derived)
A loop rewriting the top of its context every iteration pays that on the whole context and never collects the read price (our reading) | (our reading) | F04-39 "Use in dive"
No controlled comparison of a fresh-context loop with one long compacted session on the same task was located | (hedge) | U13 accept-as-hedge, wave2-limits G5
Compact-Bench: replacing full history with a summary mid-task damaged 5-64% of 22 full-history SWE-bench successes depending on the summariser; LLM summaries keep at most 16.0% of recurring details against 79.1% for mechanical extraction | https://arxiv.org/abs/2610.31710v2 (Abstract) | wave2-limits G5 (proposed F04-83)
Bedrock: support for caching "doesn't guarantee a cache hit for any request"; check the cache usage fields in the model response | https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html | F04-40 (new quote, read at source)
Diagram top panel numbers (96.6, 96.3, 95.2, 93.2, 87.0, 81.2; threshold 85.6; 64K effective, 128K claimed) | https://arxiv.org/html/2404.06654v3 (Table 3) | F04-32
Diagram bottom panel (stable prefix, evolving suffix, edit invalidates what follows, start and end used best) is schematic, captioned "Illustrative, not measured" | Anthropic and Bedrock caching docs; https://arxiv.org/abs/2307.03172v3 | F04-31, F04-38, F04-40

## Acronyms expanded in this file

RL (reinforcement learning); AD (Algorithm Distillation); ED (Expert Distillation); DPT (Decision-Pretrained Transformer); UCB (Upper Confidence Bound); GRPO (Group Relative Policy Optimization); TRAIL (Trace Reasoning and Agentic Issue Localization); MAB (multi-armed bandit, inside a quote). Benchmarks glossed: RULER, SWE-bench.
