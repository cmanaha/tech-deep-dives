# Fact check fc06-frameworks (sections 15, 16, 27), 2026-10-31

Files: `src/sections/FrameworkMap.tsx`, `src/sections/FineTuning.tsx`, `src/sections/Trainium.tsx`.

Evidence read anonymously (no account token, no identifying header): raw files from raw.githubusercontent.com
at the pins the Cites carry (PyTorch v2.15.0, TorchTitan v0.4.0, Megatron-LM core_v0.20.0, Megatron Bridge
v0.7.0, NeMo AutoModel at 48c88e16, NeMo RL v0.7.0, NeMo v3.0.0, DeepSpeed v0.19.9, Accelerate v1.15.0,
transformers v5.22.1, torchtune, Axolotl v0.21.1, LLaMA-Factory v0.9.5, verl v0.9.1, OpenRLHF v0.11.2, TRL
v1.16.0 at 1b5c75ed, slime v0.4.0, aws-neuron-sdk at 10832bbc, aws-neuron/torchtitan-neuron release-2.33.0,
deep-learning-containers at 156076c6, awsome-distributed-training at 3a100257, sagemaker-hyperpod-recipes trees
at 2.0.11, v2.0.0 and v1.5.1); arXiv text of 2106.09685v2 and 2305.14314v1; AWS pages fetched with curl
(default user agent) and stripped to text locally (HyperPod EKS and Slurm deep health checks, Slurm
auto-resume, the two Trainium tutorials, SageMaker training plans, EKS Neuron device management, FSx for
Lustre EFA, PCS pricing, Capacity Blocks pricing, SageMaker warm pools); Hugging Face model metadata for the
three Llama 3.1 parameter counts. Every number the three pages compute was recomputed against copies of
`src/lib/` (`modelStateBytes`, `memoryBudget`, `evaluateLayout`, presets): the T70 rows (1,128.86 /
1,269.97 / 141.11 / 35.28 GB; 143.37 and 37.53 GB at 0.2% adapters; 36.4 GB with QLoRA constants; GPU
counts 15, 16, 2, 1 at 80 GB and 14, 15, 2, 1 at 80 GiB; the ratio lists), the 8B and 405B rows, the
Trainium layout (64 ranks, 24 GiB per rank, 2.0 GB state and 12.7 GB total for 8B, 4.4 GB for 70B over 256
ranks), the peaks (158 per rank, 632 per chip against 667, the 5.5%), and every price (trn2 Capacity Block
$35.7608 in Ohio and Hyderabad, SageMaker $97.52, training plan $41.12492, Trn1 $9.532, p5 $47.757, $3.35,
$3.14 and $6.03 per PFLOP-hour).

Cross-section conditions:
- "Cross-instance pricing": no text in the three files prices a cross-instance collective per GPU.
- "ZeRO-2 under gradient accumulation": not discussed in the three files.
- "Xid alert rule": not discussed in the three files.
- "41 sbh": not used in the three files.
- Pinned Llama 3.1 metadata links and the FSx price list: untouched.

Known items settled:
- Section 15 TorchTitan Neuron version 0.2.2+neuron.1: CONFIRMED. `assets/version.txt` at release-2.33.0
  reads `0.2.2+neuron.1` and `pyproject.toml` takes the dynamic version from it; the release notes
  (release-notes/components/torchtitan-neuron.rst L11) print "0.2.2+neuron.1 (Beta)".
- Section 16 TRL acronym: the h2 description and the engine table used "TRL" without expansion. TRL's own
  README at v1.16.0 (1b5c75ed) L1 reads "TRL - Transformers Reinforcement Learning"; expanded at first use.
- Section 27 Trainium3 reading: already labelled "our reading, not verified"; kept.

## FrameworkMap.tsx (section 15)

About 118 load-bearing claims checked (one per claims-file line); the CONFIRMED rows are not listed.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | TorchTitan pin sentence at README L219-L220 | FrameworkMap.tsx:67 | WRONG (range) | https://github.com/pytorch/torchtitan/blob/v0.4.0/README.md#L220-L221 | range L220-L221 |
| 2 | 64 ranks per trn2.48xlarge at L203-L208 | FrameworkMap.tsx:82, 1220 | WRONG (range; the LNC=2 sentence ends on L209) | https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/about-torchtitan-neuron.rst#L203-L209 | range L203-L209, label updated |
| 3 | DeepSpeed FP8 one-layer test L20-L92 | FrameworkMap.tsx:153 | WRONG (range; the test body ends on L98) | https://github.com/deepspeedai/DeepSpeed/blob/v0.19.9/tests/unit/runtime/half_precision/test_fp8.py#L20-L98 | range L20-L98 |
| 4 | Accelerate CP code at accelerator.py L4175-L4177 "otherwise does nothing, without an error" | FrameworkMap.tsx:169, 1784 | WRONG (range is docstring; the else branch logs a one-time warning) | https://github.com/huggingface/accelerate/blob/v1.15.0/src/accelerate/accelerator.py#L4200-L4215 | range L4200-L4215; prose now says it runs CP on the torch backend when `cp_size` is above 1 and otherwise logs "Context parallel training is not enabled" once and runs without it |
| 5 | TorchTitan Neuron validated at TP 4 x FSDP 16 on one trn2.48xlarge for Llama3-8B and Qwen3-32B | FrameworkMap.tsx:1222 | OVERREACH (the overview names trn2.48xlarge for Llama3-8B only; Qwen3-32B is "TP4 x FSDP16, full activation checkpointing") | https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/about-torchtitan-neuron.rst#L165-L200 | narrowed to the source's wording |
| 6 | Megatron-LM quote carried by the Bridge cite | FrameworkMap.tsx:1388 | UNSUPPORTED at the cite (the quote is in the Megatron README, not the Bridge README) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/README.md#L16-L22 (L18) | MG_ABOUT cite added after the quote |
| 7 | "no Zero Bubble or DualPipe schedule by name was found in its code" | FrameworkMap.tsx:1618 | OVERREACH (the search covered the pipeline-schedule code, arguments.py and the MoE README, not all of Megatron) | case-insensitive grep for dualpipe and zero bubble at core_v0.20.0: 0 hits in `megatron/core/pipeline_parallel/` schedules.py, combined_1f1b.py, hybrid_cp_schedule.py, utils.py and __init__.py, in `megatron/training/arguments.py`, `transformer_config.py` and the MoE README | narrowed to "in its pipeline-schedule code" |
| 8 | "The code's other optimizer load error names the working flag" | FrameworkMap.tsx:1726 | OVERREACH (that error fires only when loading a GPT checkpoint into a hybrid model) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/checkpointing.py#L2894-L2903 | scope added |
| 9 | "The same settings run FSDP1 under accelerate launch and FSDP2 under the Trainer" | FrameworkMap.tsx:1774 | OVERREACH (inference from two defaults stated as fact) | dataclasses.py L1591-L1593, training_args.py L2780 | labelled "by our reading of the two defaults" |

## FineTuning.tsx (section 16)

63 load-bearing claims checked (one per claims-file line).

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | LLaMA-Factory table: "160 GB for LoRA and the other frozen-base methods" | FineTuning.tsx:781 | OVERREACH (the row is "Freeze/LoRA/GaLore/APOLLO/BAdam/OFT"; "frozen-base" is our label for a row the source does not describe that way) | https://github.com/hiyouga/LLaMA-Factory/blob/v0.9.5/README.md#L484-L495 | row named as the source names it; "the frozen-base figures" becomes "the LoRA and QLoRA figures" |
| 2 | LLaMA-Factory runs "on DeepSpeed or FSDP" | FineTuning.tsx:849 | UNSUPPORTED at the cites (the CLI line and the QLoRA line carry FSDP only) | https://github.com/hiyouga/LLaMA-Factory/blob/v0.9.5/examples/README.md#L97-L101 ("Supervised Fine-Tuning with DeepSpeed ZeRO-3 (Weight Sharding)") | LLAMA_FACTORY_DS cite added |
| 3 | TRL used without expansion | FineTuning.tsx:622, 400 | prose rule (acronym) | https://github.com/huggingface/trl/blob/1b5c75ed94b7387f42532adb090c935166d4878d/README.md#L1 | expanded at first use |
| 4 | QLoRA Cite venue "preprint" | FineTuning.tsx (QLORA cites) | STALE | https://proceedings.neurips.cc/paper_files/paper/2023/hash/1feb87871436031bdc0f2beaa62a049b-Abstract-Conference.html ("Advances in Neural Information Processing Systems 36 (NeurIPS 2023)", same title) | venue="NeurIPS 2023" |
| 5 | ZeRO Cite venue "preprint" | FineTuning.tsx (ZERO cite) | STALE | Crossref 10.1109/SC41405.2020.00024: title "ZeRO: Memory optimizations Toward Training Trillion Parameter Models", container "SC20: International Conference for High Performance Computing, Networking, Storage and Analysis", 2020-11 | venue="SC 2020" in this file; the other five files and glossary entry 78 still print "preprint" (reported) |
| 6 | LoRA Cite venue "preprint" | FineTuning.tsx (LORA cites) | CONFIRMED as left | OpenReview returned a challenge page and the Wayback copy is a script shell, so ICLR 2022 was not confirmed on a proceedings page | none |

## Trainium.tsx (section 27)

91 load-bearing claims checked (one per claims-file line).

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | "the one sample line AWS prints", "The one published step", "The one figure is a sample line in the Qwen3-8B tutorial" | Trainium.tsx:1129-1151 | WRONG (the setup page prints a second line, step 10, 496 tps, 16.54% MFU, 9.14 GiB at 38.10%, for the same config on "all 64 NeuronCores on a trn2.48xlarge (TP4 x FSDP16)") | https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/get-started/setup-torchtitan-neuron.rst#L49-L84 | h2 title and description and the prose now name both sample lines; the setup line implies 24 GiB per rank (9.14 / 0.381, our arithmetic), Trainium2's figure, and 26.13 / 0.1654 = 158 |
| 2 | "its instance is unnamed", "an eager run on an unnamed instance" | Trainium.tsx:1129, 1162 | OVERREACH (the tutorial's launch command is commented "Train Qwen3-8B on a trn2.48xlarge instance (64 NeuronCores)"; the line's memory field is what disagrees) | https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/tutorials/tutorial-basic-training.rst#L102-L117 | re-expressed: the command names trn2.48xlarge while the memory field implies 36 GiB per rank; the Trainium3 reading stays labelled ours |
| 3 | tests README quote truncated to "prefer CPU-runnable config and registry tests" | Trainium.tsx:1147 | OVERREACH (the sentence begins "Keep hardware-specific tests device-guarded", which says hardware tests exist) | https://github.com/aws-neuron/torchtitan-neuron/blob/release-2.33.0/torchtitan_neuron/tests/README.md#L3-L5 | full sentence quoted |
| 4 | TUT_LAUNCH L102-L117 carries the config, layout, batch and sequence-length text | Trainium.tsx:48 | WRONG (range; that text is at L54-L57) | https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/tutorials/tutorial-basic-training.rst#L45-L117 | range L45-L117 |
| 5 | "AWS keeps each TP group on one chip" | Trainium.tsx:942 | OVERREACH (the source is advice: "TP communicates in every layer, so keep each TP group on one device") | https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/about-torchtitan-neuron.rst#L234-L257 (L239) | "AWS recommends keeping each TP group on one chip" |
| 6 | "no first-party MFU for dense Llama-class training on Trainium2 was located" | Trainium.tsx:1213 | OVERREACH once row 1 is fixed (the setup guide prints a first-party MFU on trn2.48xlarge for dense Qwen3-8B, as a sample whose "values will vary") | https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/get-started/setup-torchtitan-neuron.rst#L49-L84 | re-scoped to "no first-party MFU benchmark"; the sample's 16.54% stated with its conversion, about 15.7% against 667 (16.54 x 632 / 667, our arithmetic); the build-log condition "The default MFU" carries the old wording (reported) |

## Scores (Gate 3, after fixes)

| file | score | reason if below 8 |
|---|---|---|
| FrameworkMap.tsx | 8 | |
| FineTuning.tsx | 9 | |
| Trainium.tsx | 9 | |

FrameworkMap holds every claim at its pin after the nine fixes; it scores 8 rather than 9 for length
(about 3,900 rendered words with disclosures closed after the leverage pass, tables included).

## Verdict counts

| file | claims checked | WRONG | UNSUPPORTED | OVERREACH | STALE | prose rule |
|---|---|---|---|---|---|---|
| FrameworkMap.tsx | about 118 | 4 | 1 | 4 | 0 | 0 |
| FineTuning.tsx | 63 | 0 | 1 | 1 | 2 | 1 |
| Trainium.tsx | 91 | 2 | 0 | 4 | 0 | 0 |

## For the orchestrator (files this group does not own)

- `sources.md` and `GlossaryAndSources.tsx` need two new sources: the Neuron 2.33 TorchTitan setup page
  (`training/torchtitan/get-started/setup-torchtitan-neuron.rst` at 10832bbc, L49-L84) and LLaMA-Factory
  v0.9.5 `examples/README.md` L97-L101. The glossary needs TRL (Transformers Reinforcement Learning).
- Glossary entry 91 (QLoRA) still reads "preprint"; the proceedings page confirms NeurIPS 2023. Entry 78
  (ZeRO) reads "preprint"; Crossref 10.1109/SC41405.2020.00024 confirms SC20. FineTuning now prints
  "SC 2020" for ZeRO; MemoryBudget, AwsHardware, DataParallel, TrainingStep, Checkpointing and Precision
  still print "preprint" for the same paper.
- Build-log condition "The default MFU" says no first-party MFU for dense Llama-class training on
  Trainium2 was located. The setup guide prints a sample line on trn2.48xlarge (Qwen3-8B, 16.54% MFU,
  "values will vary"). Section 27 now says "no first-party MFU benchmark"; sections 4, 14, 22, 29 and 31
  may want the same scope.
- LoRA's ICLR 2022 venue was not confirmed (OpenReview served a challenge page), so it stays "preprint".
