# Claims: section 20, Cost per Improvement (`src/sections/CostPerImprovement.tsx`, calculator in `src/lib/breakeven.ts`)

Authored 2026-10-30. Re-opened on 2026-10-30 at the pinned version: Training-Free GRPO 2510.08191v1, GEPA 2507.19457v2 (HTML), DeepSeek-R1 2501.12948v2, ProRL 2505.24864v1, Dr. GRPO 2503.20783v2, Reasoning with Sampling 2510.14901v1 (HTML), Dynamic Cheatsheet 2504.07952v1, ACE 2510.04618v3 (PDFs via `https://arxiv.org/pdf/<id>`, text with `pdftotext`); the DeepSWE post; the Bedrock pricing page; the Bedrock RFT job page; the AWS ML blog RFT best-practices post; the AWS Price List API AmazonBedrock offer version 20261030160456 (SKU description "$80.00 per hour for Nova2.0Lite-RFT-Training-Hours in US East (N. Virginia)"); the W&B public GraphQL API for run `0qjd0wap` (16 nodes x 8 GPUs, state finished, 489 logged steps, summed `timing_s/step` 159.56 h, `timing_s/gen` 107.56 h). Venues as used elsewhere in the dive: R1 Nature 2025, Dr. GRPO COLM 2025, GEPA ICLR 2026, ACE ICLR 2026, Dynamic Cheatsheet EACL 2026; ProRL NeurIPS 2025 (neurips.cc virtual poster 117423; fc08 corrected "preprint"); Training-Free GRPO preprint; Reasoning with Sampling ICLR 2026 (dive-wide). Format: `claim | source URL | register or wave 2 row`.

## Intro (h1)
- A weight update pays training once and serves at the trained model's cost; a text loop or a sampler pays little or nothing up front and more per query; volume decides (framing) | - | scope section 20, register 03 M5 (our reading)
- Strongest number, landing 1: at the paper's prices the text loop stays cheaper until about 665,000 served problems, our arithmetic; cross-model (671B DeepSeek-V3.1-Terminus against Qwen2.5-32B), different accuracy | https://arxiv.org/abs/2510.08191v1 (Sec 4.2, Table 3) | F03-91, F03-90; wave2-systems-cost rows 29, 30

## Two cost lines and where they cross
- total = training cost + cost per query x volume; breakeven = (T_A - T_B) / (q_B - q_A); dominance when one option is cheaper on both (arithmetic, implemented and tested in `src/lib/breakeven.ts`) | src/__tests__/breakeven.test.ts | -
- Cost per point of quality = total-cost difference / quality difference (definition used by the calculator) | src/lib/breakeven.ts `priceQualityGap` | -
- "Rollouts" glossed at first use (one run of the system on one example) in the inputs paragraph; the later GEPA paragraph no longer repeats it (fc08) | https://arxiv.org/abs/2507.19457v2 (Sec 2, Problem Statement: rollouts as invocations of the system plus evaluation) | -
- Self-hosted cost per query = hourly server cost / queries actually served per hour, idle hours included (our reading) | - | wave2-systems-cost row 30 (idle-GPU sensitivity)
- Quote: the RL per-problem cost "presupposes continuous GPU availability, which becomes inefficient under fluctuating or low request volumes" | https://arxiv.org/abs/2510.08191v1 (Sec 4.2) | F03-91; wave2-systems-cost row 29

## What a training run costs
- Dr. GRPO (GRPO Done Right) minimal recipe on Qwen2.5-Math-7B: 27 hours on 8 A100s; 216 GPU-hours our arithmetic | https://arxiv.org/abs/2503.20783v2 (Sec 1; Sec 3.2 heading for the expansion) | F02-19; wave2-systems-cost row 25
- Dr. GRPO gloss at first mention: the GRPO variant of section 7 that drops the division by each answer's length and by the group's standard deviation (fc08, required edit) | as section 7 (`RlvrAndGrpo.tsx` successor table, Dr. GRPO Section 3.1) | -
- ProRL: 1.5B model, more than 2k training steps, about 16k GPU-hours on 4 nodes of 8 H100-80GB | https://arxiv.org/abs/2505.24864v1 (Sec 1, Sec 3.2) | F05-41; wave2-systems-cost row 23
- 74 times the 7B recipe's GPU-hours (16,000 / 216 = 74.1), our arithmetic, different GPU generations | derived | F05-41, F02-19
- DeepSeek-R1 post-training 147K H800 GPU-hours, $294K at an assumed $2 per GPU-hour; R1-Zero 101K on 64x8 = 512 GPUs | https://arxiv.org/abs/2501.12948v2 (App. B.4.4, Table 7) | F05-37; wave2-systems-cost row 22
- R1 table covers R1-Zero, SFT data creation and R1; preparatory 30B runs not costed (preset scope) | https://arxiv.org/abs/2501.12948v2 (App. B.4.4) | F05-37; register 05 U14 hedge
- DeepSWE RL-only run on Qwen3-32B, six days on 64 H100s, vendor claim (Agentica and Together AI) | https://www.together.ai/blog/deepswe | F02-63; wave2-systems-cost row 24
- DeepSWE 9,216 GPU-hours = 64 x 6 x 24, our arithmetic, assumes continuous use (post does not say) | derived | wave2-systems-cost row 24
- verl's DAPO reproduction, Qwen2.5-32B: 159.6 h logged step time, 489 steps, 16 nodes x 8 GPUs; the verl team's run, not the DAPO authors' | https://wandb.ai/verl-org/DAPO%20Reproduction%20on%20verl/runs/0qjd0wap | wave2-systems-cost G1 (proposed F05-49)
- About 20,400 GPU-hours of step time (128 x 159.6 = 20,428.8; preset fills 20,429); about 35,000 over the 273.8 h span, our arithmetic | derived | wave2-systems-cost G1
- DAPO expansion: Decoupled Clip and Dynamic sAmpling Policy Optimization | as section 7 (`RlvrAndGrpo.tsx`) | U23 (closed in wave 2) ; gloss added at first mention (fc08, required edit): the GRPO variant of section 7 that raises the upper clip bound, keeps only prompts whose group is neither all right nor all wrong, and averages the loss over every token in the batch (DAPO Sections 3.1 to 3.3, as section 7 words them)
- GEPA vs GRPO with LoRA on Qwen3 8B: GEPA 1,839 to 7,051 rollouts per task (average 3,936), GRPO 24,000; aggregate 54.85 vs 48.91; GEPA ahead on five tasks, behind on AIME-2025 (32.00 vs 38.00) | https://arxiv.org/abs/2507.19457v2 (Table 1; footnote 1 for LoRA) | F03-61; wave2-systems-cost row 21
- A GRPO rollout also pays for its share of the weight update, so price the two sides separately (our reading) | - | -
- Bedrock RFT $80.00 per training hour for gpt-oss-20b and Qwen3 32B (pricing page) and Nova 2 Lite (Price List API, us-east-1); "The entire training workflow is billed at an hourly rate" | https://aws.amazon.com/bedrock/pricing/ ; https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/20261030160456/us-east-1/index.json | F06-16; wave2-aws rows 4, 10, G2 ; "three base models" now cites https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html (Supported models table: Nova 2 Lite, gpt-oss-20B, Qwen3 32B; fc08)
- Nova job "can take a few hours depending on the size of your training data, number of epochs, and complexity of your reward functions" | https://docs.aws.amazon.com/bedrock/latest/userguide/rft-submit-job.html | F06-11; wave2-aws G4
- No typical job length for any model located in this research (hedge) | - | U22 accept-as-hedge; wave2-aws G4
- Early stopping on by default, stops "when performance improvements plateau" (Tier 2) | https://aws.amazon.com/blogs/machine-learning/reinforcement-fine-tuning-on-amazon-bedrock-best-practices/ | wave2-aws G4

## What each query costs
- Dynamic Cheatsheet, Claude 3.5 Sonnet, AIME 2024: 370 tokens at baseline against 1,035 (DC-RS) and 1,831 (DC-Cu); 2.8x and 4.9x our arithmetic; one model, one benchmark | https://arxiv.org/abs/2504.07952v1 (Sec 5, footnote 13; variant names Sec 2.1, 2.2) | F03-35; wave2-systems-cost row 26
- The footnote does not say whether the cheatsheet in the prompt is counted | https://arxiv.org/abs/2504.07952v1 (footnote 13) | wave2-systems-cost row 26
- Dynamic Cheatsheet learns at test time, so the presets set its training cost to 0 (our reading of the design; paper title "Test-Time Learning with Adaptive Memory") | https://arxiv.org/abs/2504.07952v1 | F03-35
- ACE with OpenAI API (GPT-5.1): 91.8% of input tokens from cache during the evaluation stage, billed input-token cost down 82.6% against raw context tokens | https://arxiv.org/abs/2510.04618v3 (Sec 4.7) | F03-79; wave2-systems-cost row 27
- ACE reports the evaluation stage apart from the adaptation stage that builds the playbook | https://arxiv.org/abs/2510.04618v3 (App. A.3, "Adaptation Stage" / "Evaluation Stage") | F03-79 (beyond the register quote)
- Prefix caching for self-hosted models: plain link to the vLLM dive, section 6 | ../vllm/ | -
- Inference-time sampler: about 8.84x the tokens of standard inference in the paper's MATH-500 setting; multiplier moves with output length and sampler settings (pointer to section 8, not re-explained) | https://arxiv.org/abs/2510.14901v1 (Sec 5.3) | F02-58; wave2-systems-cost row 28
- Mental model: text loop cheap to train, pays at serving mostly when on a larger model; same model, penalty is extra tokens, caching narrows; volume decides (labelled our reading) | - | scope section 20 [our reading]; register 03 M5

## One priced pair, across two models
- About $18 of API tokens; frozen 671B DeepSeek-V3.1-Terminus to 82.7 on AIME 2024 (Mean@32) | https://arxiv.org/abs/2510.08191v1 (Table 3; Sec 4.2; Fig 1 caption for 671B) | F03-91, F03-90; wave2-systems-cost row 29
- ReTool replication on Qwen2.5-32B-Instruct: about 20,000 GPU-hours, about $10,000 at assumed $0.5 per GPU-hour; ReTool scores 67.0 | https://arxiv.org/abs/2510.08191v1 (Sec 4.2; Table 3) | F03-91, F03-90; wave2-systems-cost row 29
- Serving: 4 GPUs at $0.5, about 400 problems per hour, $0.005 per problem; text loop 60K input + 8K output tokens, about $0.02 per problem with cache-hit pricing | https://arxiv.org/abs/2510.08191v1 (Sec 4.2) | F03-91; wave2-systems-cost row 29
- Strongest number, landing 2: about 665,000 served problems, our arithmetic, cross-model, different accuracy | https://arxiv.org/abs/2510.08191v1 (Sec 4.2) | wave2-systems-cost row 30
- Authors attribute the serving gap to model size ("a large API-based model ... a dedicated small model") | https://arxiv.org/abs/2510.08191v1 (Sec 4.2) | F03-91; wave2-systems-cost row 31
- Breakeven excludes idle GPU time; 665,467 / 400 = 1,664 hours, about 69 days; lower utilisation raises the RL side's cost per problem above $0.005 | derived | wave2-systems-cost row 30
- GPU type of the $10,000 replication not stated | https://arxiv.org/abs/2510.08191v1 (Sec 4.2) | wave2-systems-cost row 29
- Arithmetic block: 20,000 x 0.5 = 10,000; 4 x 0.5 / 400 = 0.005; (10,000 - 18) / (0.02 - 0.005) = 665,467; 665,467 / 400 = 1,664 | derived; tested in src/__tests__/breakeven.test.ts | wave2-systems-cost rows 29, 30
- Pointer: section 13 compares the two methods on 32B-class models (not restated here) | - | F03-90

## Calculator (presets and their scope text)
- Every preset value carries its source under the field; values the source does not report are left to the reader; values from another source are cleared when a new preset applies | `CostPerImprovement.tsx` `applyPreset` | -
- ReTool / Training-Free GRPO presets: as the pair above; quality notes "AIME 2024, mean of 32 samples" | https://arxiv.org/abs/2510.08191v1 (Table 3 caption "Mean@32") | F03-90, F03-91
- GRPO / GEPA presets on Qwen3 8B: 24,000 and 3,936 (average) rollouts; quality 48.91 and 54.85 aggregate | https://arxiv.org/abs/2507.19457v2 (Table 1) | F03-61
- R1, ProRL, DeepSWE, Dr. GRPO, verl DAPO presets: as the training block above | as above | as above
- Bedrock preset: $80.00 per training hour, hours left empty for the reader (U22 hedge text in the field) | as above | F06-16; wave2-aws G2, G4; U22
- Sampling preset: training 0 (training-free), multiplier 8.84, cost per query copied from the weight-update column as the same model at standard inference (labelled our assumption) | https://arxiv.org/abs/2510.14901v1 (Sec 5.3) | F02-58
- Dynamic Cheatsheet presets: multipliers 2.8 and 4.9 (our arithmetic), training 0 | https://arxiv.org/abs/2504.07952v1 | F03-35; wave2-systems-cost row 26
- Volume starts at 100,000 queries, labelled as a starting value from no source | - | -
- Chart: two lines from the current inputs; at the default inputs it shows the 665,467 breakeven and the 100,000 starting volume; no other number in the diagram is a claim (axis ticks are scale) | derived | wave2-systems-cost row 30
