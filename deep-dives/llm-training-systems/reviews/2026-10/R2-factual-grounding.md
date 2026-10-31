# R2 review: factual grounding of SCOPE.md

- **Reviewer lens:** R2, factual grounding. Every load-bearing claim in the scope is traced to its cited register entry and, for the high-stakes ones, to the primary source; any claim its source does not support is refuted.
- **Date:** 2026-10-30 (also the accessed date for every fetch below).
- **Document reviewed:** `deep-dives/llm-training-systems/SCOPE.md` (316 lines, thesis, 32 sections, Calculators A to D) at commit c5844d7 on branch `feat/llm-training-systems-scope`, with its registers `research/2026-10/00` to `07`.
- **Method:** Layer 1 checked each cited claim against its register entry, looking for missing citations, wrong pointers, widened scope, dropped hedges, tier laundering and [our reading] stated as fact. Layer 2 recomputed every [derived] figure and worked number; the arithmetic is shown in the findings. Layer 3 read the primary source for 46 high-stakes claims (36 holding rows and 10 findings) and quotes what was found: AWS Price List offer files, AWS documentation, arXiv PDFs, and GitHub source pinned to a tag or SHA. Downloads went to `/tmp/r2-review-src/` and were read as text only. Fetches used: about 45 of the 60 budget. In quotes, curly apostrophes, multiplication signs, tildes and minus signs are transliterated to ASCII.

Register entry IDs are written as `T<register>-<n>` (a register entry), `W<n>` (a worked example in that register), `U` (an open unknown) and `C` (a recorded contradiction). Each one carries a short title the first time it appears.

## Findings

**1. MAJOR (SCOPE NARROWER).** Thesis, paragraph 2: "For Llama 3.1 70B on 256 H100 at 8K tokens, two published layouts pass: TP 8 x PP 4 x DP 8 with a pipeline bubble near 1%, and TP 8 x FSDP 32 (T02-50; 02 section 3.2)."
- *Cited:* T02-50 (TorchTitan's published Llama 3.1 runs on H100); 02 section 3.2 (the 70B worked example).
- *Problem:* Only one of the two layouts is published. TP 8 x PP 4 x DP 8 is our derivation. Section 14 labels it correctly ("both survive [derived, 02 section 3.2]"), but the thesis promotes it to "published". The thesis also drops the conditions the 1% rests on: a 4.2M-token global batch, micro-batch 1, ZeRO-1 and interleaving at v = 5. Without interleaving the 1F1B bubble is 4.7%. The published TorchTitan layout has conditions of its own: 96 GB H100s, Float8, local batch 16 with full activation checkpointing, and a sequence length the register could not confirm (U02-5, TorchTitan's sequence length).
- *Evidence:* Register 02 section 3.2 "Result" overstates as well: "Two layouts survive the checks and match a published run". NVIDIA's own 70B recommendation is TP 4 x PP 4 x CP 2 on 64 GPUs (T02-52, the Megatron-Core parallelism guide), which is not the layout in the thesis. The primary source, TorchTitan's benchmark at v0.4.0, line 48, says: "**Table 4** 2D parallelism (FSDP + TP) + torch.compile + Float8. Llama 3.1 70B model. 256 GPUs (FSDP 32, TP 8). Local batch size 16, global batch size 512. Full activation checkpointing." Line 13 says: "Each H100 GPU is equipped with 96GB HBM2e". https://github.com/pytorch/torchtitan/blob/45e33cd413b64cb37a7840cfd3c9765d3c639ae1/docs/benchmarks/llama3_h100_202412_torchtitan.md#L48. Layer 2 holds: (p-1)/m = 3/64 = 4.69%, and 3/(5 x 64) = 0.94%.
- *Fix:* "For Llama 3.1 70B on 256 H100 at 8K tokens and a 4.2M-token batch, two layouts pass the checks: TP 8 x PP 4 x DP 8 with ZeRO-1 and five interleaved chunks per stage, a bubble of about 0.9% at micro-batch 1 [derived], and TP 8 x FSDP 32, the layout TorchTitan published for this model on 96 GB H100s with Float8 (T02-50; 02 section 3.2)." Correct the register 02 section 3.2 "Result" sentence in the same way.

**2. MAJOR (SCOPE NARROWER).** Section 4: "The section's strongest number, landed twice: a real run takes 1.1 to 1.3 times the 6ND estimate at its own throughput."
- *Cited:* 01 W7 (the 6ND rule against Llama 3 405B's published run); T01-5 to T01-7 (Llama 3 compute budget, throughput, and model-card GPU-hours).
- *Problem:* The number holds for one run, Llama 3 405B. The scope states it as a rule for any real run. The same model card contradicts the rule for the other two sizes, and register 01 says so: "For planning, the 405B ratio ... is the only one this research can anchor" (01 W7), and U01-3 (what the model card's GPU-hours include) is open. Section 22 then prices the 70B's 7.0M published hours, which by this rule would imply 1.6 times the estimate. The number is also Calculator A's validation target.
- *Evidence:* Layer 2. For 405B: 6 x 405.85e9 x 15.6e12 = 3.80e25 FLOPs. Dividing by 430e12 FLOP/s and 3,600 gives 24.5M GPU-hours; at 380e12 it gives 27.8M. Then 30.84 / 27.8 = 1.11 and 30.84 / 24.5 = 1.26, so the claim holds for this run. For 8B at 40% MFU: 7.23e23 / (989.5e12 x 0.40) / 3,600 = 0.507M GPU-hours, and 1.46M / 0.507M = 2.88 (2.73 to 3.09 across 38% to 43% MFU). For 70B: 6.35e24 / (989.5e12 x 0.40) / 3,600 = 4.46M, and 7.0M / 4.46M = 1.57 (1.49 to 1.69). Layer 3, the Llama 3.1 model card at 5fdf8311: "39.3M GPU hours", the per-model rows 1.46M, 7.0M and 30.84M, and "the total GPU time required for training each model", with no split by stage. https://github.com/meta-llama/llama-models/blob/5fdf83110cc9daa7435dfba6eb304892cc0041b8/models/llama3_1/MODEL_CARD.md
- *Fix:* "The check against a real run: Llama 3 405B's published GPU-hours are 1.1 to 1.3 times the 6ND estimate at the run's own measured throughput [derived, 01 W7]. The same model card's 8B and 70B hours are about 2.9 and 1.6 times a 40%-MFU estimate, and the card does not say what its hours include (U01-3), so treat the 405B ratio as one anchored data point, not a rule." Calculator A validates against the 405B row only and does not apply the ratio as an overhead factor.

**3. MAJOR (WRONG as a comparison).** Section 8: "flat FSDP over 32 GPUs can move up to about 373 GB per GPU per step across EFA if parameters are re-gathered on every accumulation micro-step, while HSDP with one instance per sharding group moves about 3 GB, a factor of about 120 [derived, 02 section 3.3]."
- *Cited:* 02 section 3.3 (the 8B on four instances worked example); T03-2 to T03-4 (FSDP2 sync defaults, TorchTitan's deferral flag, the `reduce_dtype` change in 2.15).
- *Problem:* The ratio sets two gradient-sync modes against each other. The 373 GB side is FSDP2's default: sync on every micro-batch, and section 8 itself says "The high end is the default". The 3 GB side assumes HSDP's cross-instance all-reduce runs once per step, which is not FSDP2's default. Register 02 labels that assumption "[our reading]" and qualifies the ratio as holding "under these assumptions". The scope drops both. Compared at the same mode, the factor is about 15 at defaults, or about 52 with both sides deferred. The mental model, "cross the slow link once", still holds, but the headline number does not. Calculator C is validated against "the 8B HSDP example", so its validation is affected.
- *Evidence:* Register 02 section 3.3 says: "This assumes the cross-instance all-reduce runs once per step rather than once per micro-step [our reading]." Layer 3, PyTorch v2.15.0 `_fsdp_param_group.py`, lines 269, 273 and 276: `self.reduce_grads: bool = True`, `self.all_reduce_grads: bool = True`, `self.reshard_after_backward: bool = True`. https://github.com/pytorch/pytorch/blob/31a77fc9c0a7c6fff15a1ff58c743f53b1a9d457/torch/distributed/fsdp/_fully_shard/_fsdp_param_group.py#L269-L276. TorchTitan v0.4.0 `parallelism.py`, line 61: `fsdp_defer_gradient_reduction: bool = False`. https://github.com/pytorch/torchtitan/blob/45e33cd413b64cb37a7840cfd3c9765d3c639ae1/torchtitan/config/parallelism.py#L61. Layer 2: HSDP at defaults is 8 micro-steps x 3.01 GB = 24.1 GB, and 373.5 / 24.1 = 15.5. With both sides deferred it is 156 / 3.01 = 51.8. The scope's own pairing is 373.5 / 3.01 = 124.
- *Fix:* "Llama 3.1 8B on four p5.48xlarge with eight accumulation micro-steps, at FSDP2's defaults (gradients synced on every micro-batch): flat FSDP over 32 GPUs moves about 373 GB per GPU per step across EFA, and HSDP with one instance per sharding group about 24 GB, a factor of about 15. With sync deferred to the last micro-batch on both, the figures are about 156 GB against about 3 GB, a factor of about 50 [derived, 02 section 3.3, 03 W1; the 156 GB all-gather count is our reading of the code path, U03-1]." Calculator C takes the sync mode as an input, and its 8B validation row uses the same mode on both sides.

**4. MAJOR (SCOPE NARROWER).** Section 18: "at 16K GPUs the same arithmetic gives 0.79 against 0.93, and restart time dominates [derived, 04 W3]."
- *Cited:* 04 W3 (the optimal checkpoint interval and expected ETTR for the 70B run); T04-9 (Meta's E[ETTR] formula).
- *Problem:* "The same arithmetic" is not the same inputs. The 0.79 row uses a 10-minute restart (u0 = 600 s). The 0.93 row also halves the restart to 5 minutes. So the gap credited to asynchronous saving mixes two changes. At the same 10-minute restart the asynchronous row gives 0.88. The scope also drops the register's caveat that the approximation weakens at this scale: the 16K job's 1.8-hour MTTF is below the validity bound Meta states.
- *Evidence:* The register 04 W3 table at 16,384 GPUs has the rows "60 s | 10 min | 15 min | 0.79" and "2 s | 5 min | 2.7 min | 0.93". It adds: "Note the formula's validity condition ... weakens in the 16K rows." Layer 2, with E[ETTR] = (1 - N r_f (u0 + dt/2)) / (1 + w/dt), dt* = sqrt(2w / (N r_f)), and N r_f = 2,048 x 6.5e-3 / 86,400 = 1.541e-4 per second:
  - w = 60 s, u0 = 600 s: dt* = 882.5 s and E[ETTR] = 0.786.
  - w = 2 s, u0 = 300 s: dt* = 161.1 s and E[ETTR] = 0.930.
  - w = 2 s, u0 = 600 s: E[ETTR] = 0.884.

  Layer 3, Meta's reliability paper (arXiv 2410.21680v2), the ETTR model's stated assumptions: "u0 ~ 5 - 20 mins, and (Nnodes rf)^-1 >~ 0.1 day". 0.1 day is 2.4 hours, against 1.8 hours here. https://arxiv.org/pdf/2410.21680v2
- *Fix:* "at 16K GPUs the same arithmetic gives 0.79 for a 60 s save against 0.88 for a 2 s save at the same 10-minute restart, and 0.93 only if the restart also falls to 5 minutes, so restart time dominates; at this scale the job's 1.8-hour MTTF sits below the formula's stated validity bound of about 0.1 day, so treat the values as indicative [derived, 04 W3]." Calculator D shows the validity warning when 1 / (N r_f) is below 0.1 day.

**5. MAJOR (WRONG).** Section 27: Trn2 is "the lowest dollars per peak BF16 PFLOP-hour on Capacity Blocks among the rows read (T05-10, T05-11, T05-21, T05-37; 05 section 3.2)."
- *Cited:* 05 section 3.2 (dollars per peak BF16 PFLOP-hour on Capacity Blocks); T05-21 (trn2 is sold only through Capacity Blocks).
- *Problem:* The cited table puts Trn1 lowest, not Trn2. Section 22 has it right ("Trainium and GB200 UltraServer blocks lowest on peak"). Section 27 narrows that to Trn2 and inverts the order.
- *Evidence:* Register 05 section 3.2 gives trn1 $3.14, trn2 $3.35, u-p6e-gb200 $4.23 and p5 $6.03. Layer 3, Capacity Blocks pricing page: "trn1.32xlarge US East (N. Virginia) $9.532 USD ($0.596 USD) 16 x AWS Trainium" and "trn2.48xlarge US East (Ohio) $35.7608 USD ($2.235 USD) 16 x AWS Trainium2". https://aws.amazon.com/ec2/capacityblocks/pricing/. Neuron Trainium page: "190 FP16/BF16/cFP8/TF32 TFLOPS". https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium.html. Trainium2 page: "667 BF16/FP16/TF32 TFLOPS". https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html. Layer 2, per PFLOP-hour:
  - trn1: 9.532 / (16 x 0.190) = $3.14 (or $3.12 at the Trainium2 page's figure of 191 for Trainium).
  - trn2: 35.7608 / (16 x 0.667) = $3.35.
  - p5: 47.757 / (8 x 0.9895) = $6.03.
- *Fix:* "and, at peak BF16, the second-cheapest Capacity Block row read, $3.35 per PFLOP-hour against Trn1's $3.14 and p5.48xlarge's $6.03, with Trn2 blocks priced in Ohio and Hyderabad rather than N. Virginia [derived, 05 section 3.2]."

**6. MAJOR (SCOPE NARROWER, unstated basis).** Section 16: "For Llama 3.1 70B before activations: full fine-tuning about 1,270 GB of model state, at least 16 H100 ... [derived, 03 W4]", against section 5's "70B needs 1,128.9 GB [derived, 01 W2]" and section 16's own "Diagram: the 16 bytes per parameter redrawn for full, LoRA and QLoRA".
- *Cited:* 03 W4 (fine-tuning memory for 70B by method); 01 W2 (model state at 16 bytes per parameter); T03-17 (Megatron's distributed-optimizer byte table).
- *Problem:* Two figures for the same model state, with no basis given for either. 1,270 GB uses Megatron's 18 bytes per parameter, which comes from FP32 main gradients. Section 5, the thesis and the section 16 diagram use ZeRO's 16 bytes. A reader sees 1,129 GB in section 5 and 1,270 GB in section 16 for the same 70B full-precision Adam state. Calculator B lists one "Adam mixed precision" row and is validated against both 01 W2 and "register 03's LoRA rows". It cannot reproduce both without a gradient-precision input.
- *Evidence:* Register 03 W4 inputs: "18 bytes per parameter full mixed precision (T03-17, T03-45)". T03-17: "BF16 parameters with FP32 main gradients at 18 bytes per parameter". Layer 2: 70.55e9 x 18 = 1,270 GB, which needs 15.9, so 16, H100 at 80 GB. 70.55e9 x 16 = 1,128.9 GB needs 14.1, so 15.
- *Fix:* "For Llama 3.1 70B before activations: full fine-tuning about 1,129 GB of model state at 16 bytes per parameter (15 H100), or about 1,270 GB at Megatron's 18 bytes with FP32 main gradients (16 H100) [derived, 01 W2, 03 W4; T03-17]". Add a gradient-precision input (BF16 or FP32 main gradients) to Calculator B, and label the diagram's full bar with its byte basis.

**7. MINOR (inconsistent definition).** Section 4: "The N in 6N is the matmul parameter count, which excludes the embedding table: using the full count overstates the 8B model's FLOPs by 7% [derived, 01 W1]."
- *Cited:* 01 W1 (parameter counts); 07 W1 (tokens per second at 40% MFU).
- *Problem:* The scope defines N as the matmul count. The figures that follow use the full count: the 405B budget check (N = 405,853,388,800), section 29's "about 8,200 tokens per second and 70B at about 935", and Calculator A's validation against 07 W1.
- *Evidence:* Layer 2. 8B full N is 8,030,261,248 and N_mm is 7,504,658,432 (01 W1). 989.5e12 x 0.40 / (6 x 8.03e9) = 8,215 tokens/s, while with N_mm it is 8,790. 70B gives 935 with full N and about 949 with N_mm. For 405B, 6 N_mm D = 3.78e25 against 3.80e25 with full N.
- *Fix:* In section 4, add: "Meta's 3.8e25 budget and the tokens-per-second figures in section 29 use the full count." Calculator A states which N it uses and shows the other as a toggle.

**8. MINOR (SCOPE NARROWER).** Section 17: "a 16,384-GPU job one every 1 to 5 hours [derived, 04 W1]."
- *Cited:* 04 W1 (job MTTF by node count and failure rate).
- *Problem:* Rounding 0.7 up to 1 is a 50% shift. The 256-GPU range in the same sentence ("2 to 13 days") includes the 17.5 row, so the 16K range should too.
- *Evidence:* Layer 2, MTTF = 1 / (N r_f) with 2,048 nodes: 1,000 / (2,048 x 17.5) x 24 = 0.67 h, 1.80 h at 6.5, and 5.0 h at 2.34. With 32 nodes the same rates give 1.79, 4.81 and 13.4 days.
- *Fix:* "a 16,384-GPU job one every 0.7 to 5 hours".

**9. MINOR (WRONG).** Section 17: "removing 40 'lemon' nodes, 1.2% of the fleet, cut the failure rate of 512-GPU-plus jobs from 14% to 4% (T04-12)".
- *Cited:* T04-12 (Meta's lemon nodes). The register entry carries the same error.
- *Problem:* The 1.2% is 24 nodes as a share of RSC-1 alone. The 40 nodes span both clusters, so they are not "1.2% of the fleet".
- *Evidence:* Layer 3, arXiv 2410.21680v2, lemon-node paragraph before Observation 11: "successfully identify 40 faulty nodes across RSC-1 (24 nodes) and RSC-2 (16 nodes) ... The identified lemon nodes represent 1.2% of RSC-1's footprint, 13% of daily jobs, and 1.7% of RSC-2's footprint. Our lemon node detection mechanism led to 10% reduction in large job failures (512+ GPUs), from 14% to 4%." https://arxiv.org/pdf/2410.21680v2
- *Fix:* "removing 40 'lemon' nodes (24 on RSC-1, 1.2% of that cluster, and 16 on RSC-2, 1.7%) cut the failure rate of 512-GPU-plus jobs from 14% to 4% (T04-12)". Correct T04-12 the same way.

**10. MINOR (dropped hedge).** Thesis, paragraph 3: "at 256 GPUs failures cost 1% to 4% whatever the design, while at 16K GPUs restart time decides the outcome (04 W3)."
- *Cited:* 04 W3.
- *Problem:* The register states this as "[derived, our reading for the interpretation] ... whatever reasonable checkpoint design is used", for one failure rate (6.5) and one restart time (10 min). The thesis drops "reasonable", the [our reading] label and the conditions. Across the register's own presets, the loss runs from 0.2% to 6.4%.
- *Evidence:* Layer 2, 1 - E[ETTR] for 32 nodes, u0 = 600 s, w = 300, 60, 10 and 2 s:
  - r_f 6.5: 3.9%, 1.8%, 0.8%, 0.45%.
  - r_f 2.34: 2.3% down to 0.2%.
  - r_f 17.5: 6.4% down to 0.9%.
- *Fix:* "at 256 GPUs failures cost about 0.5% to 4% of wallclock at Meta's measured RSC-1 rate across the save designs modelled, so the design changes the interval more than the goodput [derived, our reading, 04 W3]".

**11. MINOR (dropped hedge).** Section 8: "deferring the reduction to the last micro-batch brings it to about 156 GB ... [derived, 03 W1]."
- *Cited:* 03 W1 (FSDP2 bytes per step); U03-1 (the exact FSDP2 all-gather count under deferred reduction).
- *Problem:* The register says "the all-gather count is our reading of the code path, U03-1", and the closing step for that is a Tier 0 trace not yet run. The scope gives 156 GB with no hedge.
- *Fix:* Append "(the all-gather count is our reading of the code path, U03-1)".

**12. MINOR (SCOPE NARROWER).** Section 5: "TorchTitan's measured 70B peak was 67.6 to 71.9 GiB where the formula gives about 39 GB (02 section 3.2, T02-50, U02-8), so formula totals are lower bounds". Section 14 says of TP 8 x FSDP 32 that it is "closest to the 80 GB limit in measurement".
- *Cited:* T02-50; U02-8 (formula against measured memory); U02-5.
- *Problem:* The measurement was on 96 GB H100s, with Float8, local batch 16 per TP group and full activation checkpointing, at a sequence length the register could not confirm. The formula row it is compared with assumes BF16, micro-batch 1 and 8,192 tokens. "Lower bounds" may still be true, but this one comparison does not show it, and the measurement is against 96 GB, not an 80 GB limit.
- *Evidence:* TorchTitan benchmark, lines 13 and 48 (quoted in finding 1). The register T02-50 notes give "96 GB HBM2e" and "Float8".
- *Fix:* Section 5: "TorchTitan's measured 70B peak, on 96 GB H100s with Float8, local batch 16 and full recomputation, was 67.6 to 71.9 GiB, against about 39 GB from the formula for a BF16, micro-batch-1 layout; the inputs differ, so read it as a reminder that buffers and fragmentation add real memory, not as a calibration (T02-50, U02-5, U02-8)." Section 14: replace "closest to the 80 GB limit in measurement" with "measured at 67.6 to 71.9 GiB on 96 GB parts".

**13. MINOR (WRONG word).** Section 18: "Megatron's `--async-save` is silently turned off unless `--use-persistent-ckpt-worker` is also set (T04-38, C04-4)".
- *Cited:* T04-38 (Megatron async save); C04-4. The register says "silently turned off (with a rank-0 warning)".
- *Problem:* The code warns, so it is not silent. The condition also applies only with a distributed checkpoint format.
- *Evidence:* Layer 3, Megatron-LM `megatron/training/arguments.py` at core_v0.20.0, lines 1808 to 1814: `if args.use_dist_ckpt and args.async_save: if not args.use_persistent_ckpt_worker: warn_rank_0('--async-save is not supported without --use-persistent-ckpt-worker. ' 'Disabling --async-save.') args.async_save = False`. https://github.com/NVIDIA/Megatron-LM/blob/685fb8bd970185e9ac3283fe32a5d6667bf4b268/megatron/training/arguments.py#L1808-L1814
- *Fix:* "Megatron turns `--async-save` off, with only a rank-0 warning, for distributed checkpoints unless `--use-persistent-ckpt-worker` is also set (T04-38, C04-4)".

**14. MINOR (WRONG range).** Section 19: "Alibaba's fail-slow episodes ran from seconds to ten hours (T04-49)."
- *Cited:* T04-49 (Alibaba's FALCON fail-slow study).
- *Evidence:* T04-49: "lasting from tens of seconds to nearly ten hours".
- *Fix:* "from tens of seconds to nearly ten hours".

**15. MINOR (mislabelled total).** Section 25: "Auto Mode adds $2.64192 per p5.48xlarge-hour, $60,941.84 a month on 32 instances [derived, 06 section 3.2]".
- *Cited:* 06 section 3.2 (orchestration fees); T06-41 (EKS Auto Mode pricing).
- *Problem:* $60,941.84 includes the $72 EKS cluster fee. The Auto Mode addition alone is $60,869.84. Section 28's "EKS Auto Mode $60,942" is a path total and is fine there.
- *Evidence:* Layer 2: 2.64192 x 32 x 720 = 60,869.84, plus 0.10 x 720 = 72, gives 60,941.84. Layer 3, EKS offer file version 20261027191639: "$2.64192 per hour for EKS Auto Mode management of p5.48xlarge". https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEKS/current/us-east-1/index.csv
- *Fix:* "Auto Mode adds $2.64192 per p5.48xlarge-hour, $60,870 a month on 32 instances, $60,942 with the cluster fee".

**16. MINOR (SCOPE NARROWER).** Section 23: "Instance store: 8 x 3,800 GB NVMe on P5 and P6, ephemeral (T05-42)."
- *Cited:* T05-42 (local NVMe instance store per training instance).
- *Evidence:* T05-42 gives "3 x 7,500 GB on p6e-gb200.36xlarge" and "4 x 1,900 GB on trn1, trn1n and trn2".
- *Fix:* "8 x 3,800 GB NVMe on p5, p5e, p5en, p6-b200 and p6-b300, 3 x 7,500 GB on P6e-GB200 and 4 x 1,900 GB on Trn1 and Trn2, all ephemeral (T05-42)."

**17. MINOR (dropped hedge).** Section 6: "FP8 matched BF16 within run-to-run noise up to GPT 175B in its proposers' runs (T01-43)", and TorchTitan "now offers MXFP8 and NVFP4 on Blackwell only".
- *Cited:* T01-43 (the FP8 paper's own runs); T03-13 (TorchTitan v0.4.0 low-precision formats).
- *Problem:* T01-43 records "with the 175B comparison taken at 75% of training because the baseline had not finished". T03-13 records NVFP4 as "experimental". Both qualifiers are dropped.
- *Evidence:* Layer 3, TorchTitan v0.4.0 release notes (2026-10-28) say "Legacy Float8 training ... have been removed" and list "Experimental NVFP4". https://github.com/pytorch/torchtitan/releases/tag/v0.4.0
- *Fix:* "... up to GPT 175B in its proposers' runs, the 175B comparison taken at 75% of training (T01-43)" and "now offers MXFP8 and experimental NVFP4, on Blackwell only".

**18. MINOR ([our reading] as fact).** Section 14: Megatron Bridge "holds 52.9 GB of model state per GPU with the distributed optimizer and 79.4 GB without it, which is why the recipe turns it on (T03-24, T03-17) [derived, 03 W2]".
- *Cited:* 03 W2 (Megatron Bridge's 70B recipe memory); T03-24 (that recipe's settings).
- *Problem:* The arithmetic holds: 4.41e9 x 12 = 52.9 GB and 4.41e9 x 18 = 79.4 GB. The causal clause is our inference. No source states the recipe's reason, and Megatron-Core's guide recommends the distributed optimizer "for all multi-GPU training" (T02-52) regardless of fit.
- *Fix:* "... and 79.4 GB without it, which would leave under 1 GB for activations [derived, 03 W2]; Megatron-Core's guide recommends the distributed optimizer for all multi-GPU training anyway (T02-52)."

**19. MINOR (SCOPE NARROWER).** Section 13: TorchTitan "with FSDP alone recommended up to about 512 GPUs (T02-49, T02-50)".
- *Cited:* T02-49 (TorchTitan's scaling guidance).
- *Evidence:* T02-49: "FSDP alone is often enough as the first dimension up to about 512 GPUs when communication is faster than compute".
- *Fix:* "with FSDP alone often enough up to about 512 GPUs when communication is faster than compute (T02-49)".

**20. MINOR (SCOPE NARROWER, omission).** Section 27: "the validated configurations are Llama3-8B and Qwen3-32B at TP 4 x FSDP 16 on one trn2.48xlarge (T03-38)", ending "start from TorchTitan Neuron's validated 8B layout on one trn2.48xlarge ... and plan the multi-node run as a measured step."
- *Cited:* T03-38 (TorchTitan Neuron ranks and validated configurations). The entry includes the two-node tutorial.
- *Problem:* The source also validates a two-node run. The scope leaves it out and then treats multi-node as unvalidated.
- *Evidence:* Layer 3, aws-neuron-sdk at 10832bbc, `training/torchtitan/tutorials/tutorial-basic-training.rst` lines 61 to 62, for Qwen3-8B: "Validated on a single ``trn2.48xlarge`` node (64 NeuronCores, TP4 x FSDP16), and on two ``trn2.48xlarge`` nodes (128 NeuronCores, TP4 x FSDP32)." https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/tutorials/tutorial-basic-training.rst#L61-L62
- *Fix:* Add "and Qwen3-8B at TP 4 x FSDP 32 on two trn2.48xlarge (T03-38)". The ending becomes "start from TorchTitan Neuron's validated one-node layout, scale to its validated two-node Qwen3-8B layout, and plan anything larger as a measured step."

## Claims checked and holding

| # | Claim (short) | Section | Entry | Layer | Verdict |
|---|---|---|---|---|---|
| 1 | 6ND for Llama 3 405B = 3.80e25, Meta's stated budget | Thesis, 4 | T01-5, 01 W7 | 1, 2, 3 | HOLDS |
| 2 | 6ND at 380 to 430 TFLOPs covers 80% to 90% of 30.84M GPU-hours (24.5M to 27.8M) | Thesis, 4 | T01-6, T01-7, 01 W7 | 1, 2, 3 | HOLDS |
| 3 | Llama 3 405B MFU 38% to 43%; 43% at 8,192 GPUs, 41% at 16,384, 38% at 131K with CP 16 | 4, 13 | T01-6, T02-46, T02-47 | 1, 3 | HOLDS |
| 4 | H100 BF16 dense 989.5 TFLOPS; NVIDIA prints the 1,979 sparse figure | 4 | T01-27, T01-29 | 1, 3 | HOLDS |
| 5 | 16 bytes per parameter; 8B 128.5 GB, 1.6x an 80 GB H100; 70B 1,128.9 GB | Thesis, 5 | T01-9, 01 W2 | 1, 2 | HOLDS |
| 6 | 8B at 8,192 tokens: 36.5 GB activations, 4.2 GB FP32 logits, 11.5% | 5 | 01 W4 | 2 | HOLDS |
| 7 | Attention 12.5% to 22% of per-token FLOPs at 8K; half at about 57K or 29K | 4 | 01 W6 | 2 | HOLDS |
| 8 | 70B on 1T tokens: about 297,000 H100-hours, 48 days on 32 p5.48xlarge | 4 | 01 W8 | 2 | HOLDS |
| 9 | NVLink 450 GB/s per direction, EFA 50 GB/s per GPU, 9x | Thesis, 2, 7 | T02-68, T02-70 | 1, 2 | HOLDS |
| 10 | TP traffic 8bsh(t-1)/t per layer; TP up to one server (Takeaway #1) | 9 | T02-13, T02-14 | 1, 3 | HOLDS |
| 11 | 70B TP 8: 0.94 GB per layer, 2.1 ms against 13.3 ms, about 16% | 9 | 02 section 3.2 | 2 | HOLDS |
| 12 | Interleaving divides the bubble by v, multiplies traffic by v, needs m a multiple of p | 10 | T02-30 | 1, 3 | HOLDS |
| 13 | PP 16.8 MB per boundary, 0.34 ms against 266 ms | 10 | T02-31, 02 section 3.2 | 2 | HOLDS |
| 14 | Llama 3 trained 405B with PP 16 at 8K without activation recomputation | 10 | T02-32, C02-11 | 1, 3 | HOLDS |
| 15 | 70B step 17.5 s; DP about 1% of step; FSDP 51.3 GB, about 6% | 14 | 02 section 3.2 | 2 | HOLDS |
| 16 | Flat FSDP 8B: 46.7 GB per cycle, about 373 GB over 8 micro-steps | 8 | 02 section 3.3 | 2 | HOLDS (the number; the ratio is finding 3) |
| 17 | FSDP2 reduce-scatters and re-gathers every micro-batch by default; TorchTitan keeps it | 8 | T03-2, T03-3 | 1, 3 | HOLDS |
| 18 | From PyTorch 2.15 an unset `reduce_dtype` reduces FP32 gradients in FP32; about 498 GB | 8 | T03-4, 03 W1 | 1, 2, 3 | HOLDS |
| 19 | Ring Attention overlap: about 2.2K tokens per block on NVLink, 19.8K on EFA | 11 | T02-20, T02-21, 02 section 3.4 | 2 | HOLDS |
| 20 | MoE dispatch-plus-combine about 172 KB per token per layer | 12 | 02 section 3.4 | 2 | HOLDS |
| 21 | Megatron-Core MoE guide's GPU formula disagrees with the code | 12 | T02-72, C02-2 | 1 | HOLDS |
| 22 | Megatron Bridge 70B: 52.9 GB with distributed optimizer, 79.4 GB without | 14 | 03 W2 | 2 | HOLDS (the causal clause is finding 18) |
| 23 | NVIDIA/NeMo repository is speech-only at v3.0.0 | 14 | T03-25 | 1, 3 | HOLDS |
| 24 | Megatron distributed optimizer opt-in (`--use-distributed-optimizer` store_true) | 15 | T03-17 | 1, 3 | HOLDS |
| 25 | Transformer Engine: CC 8.9 FP8, 9.0 block scaling, 10.0 MXFP8 and NVFP4; MXFP8 default on Blackwell | 6 | T01-45 | 1, 3 | HOLDS |
| 26 | TorchTitan v0.4.0 removed its Float8 path | 6 | T03-13 | 1, 3 | HOLDS |
| 27 | Meta r_f 2.34 and 6.50, bad month near 17.5; MTTF 47.7 days (8 GPUs) to 7.9 hours (1,024) | 17 | T04-7, T04-8 | 1, 3 | HOLDS |
| 28 | 256-GPU job interrupted every 2 to 13 days | 17 | 04 W1 | 2 | HOLDS (1.79 to 13.4 days) |
| 29 | Llama 3: 466 interruptions in 54 days, 419 unexpected, about 78% hardware, over 90% effective training time | Thesis, 17 | T04-1, T04-2, T04-4 | 1, 3 | HOLDS |
| 30 | Hardware failures touched under 1% of jobs but 19% of GPU runtime | 17 | T04-11 | 1, 3 | HOLDS |
| 31 | Lemon nodes cut 512-GPU-plus job failures from 14% to 4% | 17 | T04-12 | 3 | HOLDS (the node share is finding 9) |
| 32 | Checkpoint about 988 GB at 14 bytes, 3.86 GB per GPU; 16.5 GB/s for a 60 s save | 18 | 04 W2 | 2 | HOLDS |
| 33 | 256 GPUs: dt* 2.0 h and 21.5 min; E[ETTR] 0.982 and 0.996 | 18 | 04 W3 | 2 | HOLDS (0.9955; rounds to 0.995 or 0.996) |
| 34 | FSx PERSISTENT-1000 at $0.600 per GB-month, 16.5 TiB on the order of $10,000 a month | 18, 23 | T00-1, 05 section 3.5 | 1, 2, 3 | HOLDS ($10,138 to $10,885) |
| 35 | FSx client ceilings 100 Gbps without EFA, 700 with EFA, 1,200 with GDS; trn2 excluded from EFA | 18, 23, 27 | T04-29, T04-30, T05-35 to T05-37 | 1, 3 | HOLDS |
| 36 | DCP `async_save` bare stages synchronously into pageable memory | 18 | T04-20 to T04-22 | 1, 3 | HOLDS |
| 37 | `torchrun --max-restarts` defaults to 0 | 19 | T04-40 | 1, 3 | HOLDS |
| 38 | ByteDance: 3,079 jobs, 42.5% straggling, 10.4% of GPU-hours lost | 19 | T04-47, T04-48 | 1 | HOLDS |
| 39 | Data loading: 70B job about 1 MB/s of tokens; Llama 3 about 11 MB/s against 2 TB/s | 23 | 04 W5 | 1, 2 | HOLDS |
| 40 | Capacity Blocks: up to 64 instances per block, 256 per organization on a date, end 11:30 UTC, termination from 11:00 UTC | 22 | T05-26, T05-27 | 1, 3 | HOLDS |
| 41 | EC2 On-Demand p5 $55.04, p5en $63.296, p6-b200 $113.9328, p6-b300 $142.416; no trn2 On-Demand row | 22 | T05-20, T05-21 | 1, 3 | HOLDS |
| 42 | Capacity Block rates 0.998x (P5en, P6-B200) to 0.443x (Trn1); p5 $47.757 | 22 | T05-22 | 1, 2, 3 | HOLDS |
| 43 | Training jobs 1.15x, HyperPod 1.20x on P5 and P6, training plans 1.15x the Capacity Block rate | Thesis, 22 | T05-23, T05-24 | 1, 2, 3 | HOLDS |
| 44 | 70B's 7.0M H100-hours: $48.2M On-Demand, $41.8M on Capacity Blocks, about 142 days at 2,048 GPUs | 22 | 05 section 3.4 | 2 | HOLDS |
| 45 | 70B needs 1.64 p5, 0.93 p5en, 0.68 trn2 nodes before activations | 21 | 05 section 3.3 | 2 | HOLDS |
| 46 | H200 is H100 compute with 76% more HBM | 21 | T05-14 | 1, 2 | HOLDS (141 / 80 = 1.76) |
| 47 | Trainium2 96 GiB per chip; 24 GiB per logical core at LNC=2 | 21, 27 | T05-10, 03 W3 | 1, 2, 3 | HOLDS |
| 48 | PCS Small $0.5825 per hour plus $0.64 per P or Trn instance-hour; $15,165 a month on 32 p5 | 24, 28 | T06-36 | 1, 2, 3 | HOLDS |
| 49 | PCS sizes 32, 512, 2,048; Slurm 25.05 end of life 2026-11-30 | 24 | T06-31 to T06-35 | 1, 3 | HOLDS |
| 50 | ParallelCluster v3.16 supported to 2028-02-20 | 24 | T06-38 | 1, 3 | HOLDS |
| 51 | HyperPod deep health checks: DCGM level 4 about 45 to 90 minutes | 24 | T06-3 to T06-7 | 1, 3 | HOLDS |
| 52 | EKS $0.10 per cluster-hour, $72 a month | 25, 28 | T06-40 | 1, 2, 3 | HOLDS |
| 53 | HyperPod premium (66.048 - 55.04) x 32 x 24 = $8,454 a day, $253,624 a month | 28 | T05-20, T05-23 | 2, 3 | HOLDS |
| 54 | Warm pools up to 3,600 s; SMP v2.8.0 on 2025-04-01 | 26 | T06-24, T06-26 | 1 | HOLDS |
| 55 | NxD Training end-of-support as of Neuron 2.32; TorchNeuron public beta in 2.33.0 | 27 | T03-34, T03-36 | 1, 3 | HOLDS |
| 56 | At 40% MFU: 8B about 8,200 tokens/s, 70B about 935; 4,000 tokens/s is near 20% MFU | 29 | 07 W1 | 2 | HOLDS (full N; see finding 7) |
| 57 | OLMo 2 spike at 7 standard deviations over 1,000 steps; PaLM about 20 spikes | 29 | T07-18, T07-13 | 1 | HOLDS |
| 58 | SM activity 0.8 target, below 0.5 ineffective; data loading 20% threshold | 29 | T07-23, T07-29, T07-40, T07-41 | 1 | HOLDS |
| 59 | NCCL timeout 10 min, heartbeat 8 min, flight recorder 2,000 entries, about 11 min to teardown (6% of 3.1 h) | 30 | T07-5 to T07-11, 07 W2 | 1, 2, 3 | HOLDS |
| 60 | SageMaker Debugger closed to new customers; Profiler end of support 2027-06-30 | 30 | T07-34 | 1, 3 | HOLDS |
| 61 | Accelerate defaults FSDP version 1; transformers defaults 2 | 15 | T03-40, C03-6 | 1, 3 | HOLDS |
| 62 | PTD-P beat ZeRO-3 without model parallelism by 70% | 13 | T02-43 to T02-45 | 1 | HOLDS |
| 63 | DeepSeek-V3 layout: no TP, PP 16, EP 64, ZeRO-1, 2,048 H800 | 12, 13 | T02-39, T02-40 | 1 | HOLDS |

Layer 3 quotes for the rows marked 3, by row number (sources pinned and read 2026-10-30):

- **Rows 1 to 3, 14, 29.** Llama 3 paper, https://arxiv.org/pdf/2407.21783v3.
  - "3.8 x 10^25 FLOPs" and 15.6T tokens.
  - Table 4: 430 TFLOPs/43%, 400/41%, 380/38%.
  - "466 job interruptions", "47 planned", "419 unexpected", "54-day snapshot", "higher than 90% effective training time", "Approximately 78%".
  - "without activation checkpointing".
- **Row 2.** Llama 3.1 model card at 5fdf8311: 30.84M GPU-hours for 405B.
- **Row 4.** NVIDIA H100 page: "BFLOAT16 Tensor Core * 1,979 teraFLOPS" with "* With sparsity". https://www.nvidia.com/en-us/data-center/h100/
- **Rows 10, 12.** PTD-P, https://arxiv.org/pdf/2104.04473v5.
  - "8bsh (t-1)/t" per layer per device.
  - Interleaving needs micro-batches as an "integer multiple of the degree of pipeline parallelism", "reduces the bubble time by v", and "communication also increases by v".
  - Takeaway #1.
- **Rows 17, 18.** PyTorch v2.15.0 (31a77fc9c0a7c6fff15a1ff58c743f53b1a9d457).
  - `_fsdp_param_group.py` lines 269, 273 and 276, quoted in finding 3.
  - `_fsdp_api.py` line 53: "versionchanged:: 2.15".
  - TorchTitan v0.4.0 `parallelism.py` line 61: `fsdp_defer_gradient_reduction: bool = False`.
- **Row 23.** NVIDIA/NeMo README at fd6a8775 (tag v3.0.0): "NVIDIA NeMo Speech".
- **Row 24.** Megatron-LM `arguments.py` at core_v0.20.0, line 3102: `--use-distributed-optimizer` is `store_true`.
- **Row 25.** Transformer Engine v2.21.0 `transformer_engine/pytorch/quantization.py` (7457e47d):
  - Gates at 8.9 for FP8, 10.0 for MXFP8 and NVFP4, and "9.0 or higher and CUDA >= 12.9".
  - `get_default_fp8_recipe` returns `MXFP8BlockScaling` on Blackwell, else `DelayedScaling`.
- **Row 26.** TorchTitan v0.4.0 release notes: "Legacy Float8 training ... have been removed".
- **Rows 27, 30, 31.** Meta reliability paper, https://arxiv.org/pdf/2410.21680v2.
  - "7.9 hours", "47.7", and r_f 6.50 and 2.34.
  - "~17.5 failures per 1000 node-days" as a 30-day rolling average.
  - "19% of GPU runtime".
  - The lemon-node quote is in finding 9.
- **Row 34.** FSx offer file version 20260911124432: $0.145, $0.210, $0.340 and $0.600 per GB-month for persistent SSD. https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonFSx/current/us-east-1/index.csv
- **Row 35.** FSx performance page: 100 Gbps (non-EFA), 700 Gbps with EFA, 1200 Gbps with EFA and GDS. https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html. FSx EFA page: "excluding the trn2 instance family". https://docs.aws.amazon.com/fsx/latest/LustreGuide/efa-file-systems.html
- **Row 36.** PyTorch v2.15.0 `state_dict_saver.py` line 313: `DefaultStager(StagingOptions(False, False, False, False))`.
- **Row 37.** PyTorch v2.15.0 `run.py` line 564: `--max-restarts` with `default=0`.
- **Row 40.** Capacity Blocks user guide: up to 64 instances per block, 256 across blocks and per organization on a date, end at 11:30 UTC, termination begins 11:00 UTC. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html
- **Rows 41, 53.** EC2 offer file version 20261029175634, us-east-1:
  - p5.48xlarge $55.04, p5en $63.296, p6-b200 $113.9328, p6-b300 $142.416, trn1.32xlarge $21.50.
  - No trn2.48xlarge On-Demand row.
- **Rows 42, 47.** Capacity Blocks pricing page: "p5.48xlarge" $47.757 in N. Virginia. The trn1 and trn2 rows are quoted in finding 5. Trainium2 page: "96 GiB of device memory".
- **Rows 43, 53.** SageMaker offer file version 20261029165009:
  - ml.p5.48xlarge Training $63.296 (SKU PT35MT84SM2K7WNQ), which is 1.15 x 55.04.
  - Cluster $66.048 (SKU KY5ZUKH5T8SX7QMM), which is 1.20 x 55.04.
  - TrainingPlanUpfrontFee $54.92078, which is 1.15 x 47.757.
- **Row 48.** PCS offer file version 20261027150327: Small $0.5825, Medium $3.2579, Large $6.5426 per hour; Advanced instance $0.64.
- **Row 49.** PCS Slurm versions page: 25.05 end of life 11/30/2026, "existing clusters can continue running for up to 12 months without guaranteed support". https://docs.aws.amazon.com/pcs/latest/userguide/slurm-versions.html
- **Row 50.** ParallelCluster support policy: "3.16.x 02/20/2028". https://docs.aws.amazon.com/parallelcluster/latest/ug/support-policy.html
- **Row 51.** HyperPod deep health checks: "DCGM diagnostics at level 4 ... ~45-90 minutes depending on GPU count". https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html
- **Row 52.** EKS offer file version 20261027191639: cluster $0.10 per hour.
- **Row 55.** aws-neuron-sdk at 10832bbc:
  - `archive/nxd-training/index.rst`: "reached end-of-support as of Neuron 2.32".
  - `release-notes/components/torchneuron.rst`: "Neuron 2.33.0 introduces the native torch-neuronx backend as a public beta".
- **Row 59.** PyTorch v2.15.0:
  - `ProcessGroupNCCL.hpp` line 164: `kProcessGroupNCCLDefaultTimeout = std::chrono::milliseconds(10 * 60 * 1000)`.
  - `ProcessGroupNCCL.cpp` line 1773: `TORCH_NCCL_HEARTBEAT_TIMEOUT_SEC, 60 * 8`. Line 1775: `WAIT_TIMEOUT_DUMP_MILSEC, 15 * 1000`. Line 2428: `getDumpTimeout() * 4`.
  - `FlightRecorder.hpp` line 110: `{"TORCH_FR_BUFFER_SIZE", "TORCH_NCCL_TRACE_BUFFER_SIZE"}, 2000)`.
- **Row 60.** "SageMaker Debugger is no longer open to new customers" and "On June 30, 2027, AWS will end support for Amazon SageMaker Profiler". https://docs.aws.amazon.com/sagemaker/latest/dg/debugger-availability-change.html and https://docs.aws.amazon.com/sagemaker/latest/dg/profiler-availability-change.html
- **Row 61.** Accelerate v1.15.0 `dataclasses.py` (6afc1e5e): `FSDP_VERSION` defaults to "1". transformers v5.22.1 `training_args.py` (446a570e): `fsdp_config.get("version", 2)`.

## Verdict

**PASS WITH FIXES.** 20 findings: 0 BLOCKER, 6 MAJOR, 14 MINOR. By verdict class:

- 3 WRONG: finding 5 (Trn2 cheapest), finding 9 (lemon-node share) and finding 3 (HSDP factor, as a comparison).
- 3 WRONG in a word or range: finding 13 ("silently"), finding 14 ("seconds") and finding 15 (Auto Mode total).
- 14 SCOPE NARROWER, dropped hedge, or [our reading] stated as fact: findings 1, 2, 4, 6, 7, 8, 10, 11, 12, 16, 17, 18, 19 and 20.
- 0 UNVERIFIABLE.

63 claims hold, 36 of them checked at the primary source; 10 of the findings also rest on primary evidence.

No finding reverses a section's argument, so none is rated BLOCKER. Four MAJOR findings touch calculator validation targets and should be fixed before the calculators are built:

- finding 2, Calculator A (run time);
- finding 3, Calculator C (parallelism sizing);
- finding 4, Calculator D (checkpointing);
- finding 6, Calculator B (memory).

Fix the two register errors with the scope: T04-12's "1.2% of the fleet" reading and register 02 section 3.2's "match a published run".

One register-level observation, not counted as a finding: register 02 sizes its worked examples with a 128,000-entry vocabulary, while register 01 uses Llama 3.1's 128,256 (C01-1). The effect on every 02 figure is under 0.3%.
