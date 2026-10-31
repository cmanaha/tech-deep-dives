# Claims: section 4, Counting the Arithmetic: 6ND, MFU & Run Time

File: `src/sections/Arithmetic.tsx`. Re-opened on 2026-10-31 (default accessed date): the eight arXiv papers below (PDFs via pdftotext), the Hugging Face metadata at the pinned revisions, the Llama 3.1 model card at llama-models v0.2.0, the TorchTitan v0.4.0 files, NVIDIA's Megatron Bridge 0.7.0 archive, the DGX Spark hardware page, and E2 in this repository. The H100 and HGX pages were re-fetched by wave 2 on 2026-10-31. Register rows cited without re-opening carry `accessed="2026-10-30"`: the H200 page, the Trainium2 page, the EC2 instance-type guide, llama-models model.py, the AWS Price List files, the Capacity Blocks page, the SageMaker warm pools page and the TorchTitan Neuron overview. Every derived figure is computed by `src/lib/runtime.ts` (`flopsPerToken`, `estimateRun`, `priceRun`) or recomputed in TypeScript against it; the diagram and the attention table call `flopsPerToken` at render time.

Format: claim | source URL | register, wave 2 row or experiment

## Introduction

- A run's FLOPs are about 6 per parameter per token | https://arxiv.org/abs/2204.02311v5 (Appendix B) | T01-18; W1-37
- 6ND reproduces Meta's 3.8e25-FLOP budget for Llama 3 405B (landed in the intro, the 405B block and the calculator text) | https://arxiv.org/abs/2407.21783v3 (Section 1) and https://huggingface.co/api/models/meta-llama/Llama-3.1-405B/revision/b906e4dc842aa489c962f9db26554dcfdde901fe | T01-3; T01-5; W1-1; W1-31

## MFU, and the identity that turns FLOPs into time

- MFU is observed tokens per second over the theoretical peak throughput, R = P / (6N + 12LHQT) | https://arxiv.org/abs/2204.02311v5 (Section 4.1, Appendix B) | T01-18; W1-9
- MFU excludes rematerialization; recomputation raises HFU and leaves MFU unchanged | https://arxiv.org/abs/2204.02311v5 (Section 4.1) | T01-19; W1-9
- time = 6ND / (accelerators x dense peak x MFU) is our rearrangement; no source located prints it in this form | derived from https://arxiv.org/abs/2204.02311v5 (Appendix B) | T01-58
- Llama 3.1 70B has 70,553,706,496 parameters | https://huggingface.co/api/models/meta-llama/Llama-3.1-70B/revision/349b2ddb53ce8f2849a6c168a81980ab25258dac | T01-3
- 6ND for 70B on 1T tokens = 4.23e23 FLOPs; at 989.5 TFLOPS and 40% MFU, 297,093 H100-hours, 48.4 days on 256 GPUs (32 p5.48xlarge) | derived (Calculator A preset "70B, 1T tokens, 32 p5.48xlarge") | 01 W8; W1-10
- H100 BF16 1,979 TFLOPS "with sparsity"; dense 989.5 (vendor claim) | https://www.nvidia.com/en-us/data-center/h100/ | T01-27; W1-16; W1-53
- 40% MFU is an assumption inside Llama 3 405B's measured 38% to 43% BF16 MFU on H100 | https://arxiv.org/abs/2407.21783v3 (Table 4) | T01-6; W1-35; build-log "default MFU"
- p5.48xlarge carries 8 H100 GPUs | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T05-1
- Megatron-LM: end-to-end time about 8TP/(nX), recomputation included; GPT-3 175B on 300B tokens, 1,024 A100 at 140 TFLOPS, 34 days (our check 33.9) | https://arxiv.org/abs/2104.04473v5 (Section 5.1) | T01-23; T01-58

## Attention: the term 6N leaves out

- Dense self-attention matmuls add 12LHQT FLOPs per token (6LH(2QT)) | https://arxiv.org/abs/2204.02311v5 (Appendix B) | T01-18; C01-2
- Megatron-LM counts the full s x s score matrix (2Bs^2h for scores, 2Bs^2h over values, forward) | https://arxiv.org/abs/2104.04473v5 (Appendix: Floating-point operations) | T01-17; C01-2
- Kaplan et al. count the attention mask at 2 n_layer n_ctx d_attn forward, half of PaLM's | https://arxiv.org/abs/2001.08361v1 (Table 1) | T01-15; C01-2
- None of the three states a causal discount; a causal kernel computes about half the matrix (our reading) | derived | C01-2; 01 W6
- In Llama 3.1, heads x head dimension = hidden size, so the term is 12Lhs | https://arxiv.org/abs/2407.21783v3 (Table 3) | T01-1
- 8B at 8,192 tokens: 12.5% causal, 22% no-discount of per-token FLOPs (matmul basis); half at 57,256 (causal) or 28,628 tokens | derived (flopsPerToken, attentionCrossoverSequenceLength) | 01 W6; W1-11
- 70B at 8,192 tokens: 7.2% and 13.4%; half at 106,051 or 53,026 tokens | derived | 01 W6
- Against 6N with the full count, the term adds 13% to 27% for 8B at 8,192 tokens (section 3's figure) | derived | 01 W6; section 3 claims
- Diagram: per-token GFLOPs and causal shares for 8B and 70B from 2K to 128K tokens (6N = 45.0 and 417 GFLOPs, matmul basis) | derived (flopsPerToken at render time) | 01 W6
- Meta did not train on long sequences earlier because "the compute in self-attention layers grows quadratically in the sequence length" | https://arxiv.org/abs/2407.21783v3 (Section 3.4.2) | T01-8

## Which parameters, and which FLOPs, count

- The input embedding costs 4 d_model FLOPs per token; the output head (de-embed) is 2 d_model n_vocab | https://arxiv.org/abs/2001.08361v1 (Table 1) | T01-15
- Kaplan's N excludes embedding parameters and C ~ 6N leaves out the context and de-embed terms | https://arxiv.org/abs/2001.08361v1 (Section 2.1) | T01-14
- Full count 8,030,261,248 against 7,504,658,432 in matmuls for 8B: 7% overstatement; 70B 1.5% | https://huggingface.co/api/models/meta-llama/Llama-3.1-8B/revision/d04e592bb4f6aa9cfee91e2e20afa771667e1d4b and llama-models model.py (untied 128,256-entry head) | T01-2; T01-3; T01-4; W1-12
- 405B: 6ND 3.80e25 full count, 3.78e25 matmul count | derived | W1-13 (SCOPE NARROWER wording used)
- Calculator A defaults to the full count, the count of its presets and of section 29's tokens per second | src/lib/runtime.ts | W1-13; W6-9
- TorchTitan v0.4.0 MFU = 100 x FLOPs per token x tokens per second / peak | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/observability/metrics.py#L115-L135 | W6-9
- TorchTitan counts 6 x every parameter but the embedding table, plus attention with no causal discount | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/common/flops.py#L84-L144, #L20-L51, https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/llama3/model.py#L91-L109 | W6-9
- At 40% MFU on H100 and 8,192 tokens: TorchTitan's count about 6,800 (8B) and 820 (70B) tokens/s; 6N full count 8,200 and 935 | derived (estimateRun) | W6-9; build-log "default MFU"
- 4,000 tokens/s on 8B reads about 23% (TorchTitan's count) and 19.5% (6N alone) | derived | W6-9
- Full recomputation costs "the expected 33%" | https://arxiv.org/abs/2205.05198v1 (Section 6.2) | T01-34; W1-56; build-log "recomputation price"
- Korthikanti et al. observe 30% to 40% execution-time overhead for full recomputation in their training runs | https://arxiv.org/abs/2205.05198v1 (Section 1) | T01-34; build-log "recomputation price"
- E2: full recomputation +16.3% and +14.2% step time on one GB10 (1B Llama shape, 2,048 tokens); MFU 29.0% to 24.9% and 27.9% to 24.5% | E2 (research/2026-10/E2-spark-step-time-recompute.md) | E2; build-log "recomputation price"
- Megatron-LM's 52% of peak (1T parameters, 3,072 GPUs) counts the recomputed forward pass and is end to end; closer to HFU (our reading) | https://arxiv.org/abs/2104.04473v5 (Section 5.1) | T01-22; W1-54; C01-5
- Llama 3's 38% to 43% is BF16 MFU citing PaLM's definition | https://arxiv.org/abs/2407.21783v3 (Section 3.3.2) | T01-6; W1-54

## Divide by the dense peak at the training precision

- HGX: dense is half the sparse figure shown; B200 2,250 TFLOPS dense BF16, 4,500 dense FP8 (vendor claim) | https://www.nvidia.com/en-us/data-center/hgx/ | T01-29; W1-53; U01-5
- H200 has the H100's compute (vendor claim) | https://www.nvidia.com/en-us/data-center/h200/ | T01-28
- Trainium2 667 BF16 TFLOPS dense per chip (vendor claim) | https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium2.html | T01-30; T05-17
- 430 TFLOPS at 43% MFU implies a denominator of about 1,000 | https://arxiv.org/abs/2407.21783v3 (Table 4) | T01-6
- TorchTitan v0.4.0 peaks: H100 SXM 989e12; trn2 79e12 x 2 per rank at LNC=2 (632 per chip at four ranks, 5% below 667); unknown GPUs fall back to A100 312e12 with a warning | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/tools/utils.py#L111-L232 | W6-9; T03-38 (four ranks per chip)
- DGX Spark page lists "up to 1 PFLOP ... at FP4 precision with sparsity" and no BF16 peak (vendor claim) | https://docs.nvidia.com/dgx/dgx-spark/hardware.html | E2; U01-5
- E2: measured BF16 GEMM ceiling 96.2 and 97.3 TFLOPS; MFU 29.0% and 27.9% (6N), 30.5% and 29.5% with causal attention | E2 | E2; U01-5
- Under TorchTitan's A100 fallback the same run would print about 9% (29.0% x 96.2 / 312) | derived | E2; W6-9
- Megatron Bridge archive: LLAMA3_70B, 64 H100, FP8, 731 model TFLOP/s per GPU (26.04.01); LLAMA3_8B, 8 B200, FP8-CS, 1,576 (25.11): 36.9% and 35.0% of dense FP8 peak; rows 34% to 42%, most 34% to 38%; FLOP count not stated (vendor claim, our arithmetic) | https://docs.nvidia.com/nemo/megatron-bridge/0.7.0/performance-summary-archive.html | U01-5 (wave2-step-maths); W1-52
- No first-party MFU for dense Llama-class training on H200 or Trainium2 located (calculator MFU description) | wave2-step-maths | U01-5; build-log "default MFU"

## The check against Llama 3 405B

- 405B pre-trained on 15.6T tokens for 3.8e25 FLOPs, on up to 16K H100s | https://arxiv.org/abs/2407.21783v3 (Sections 1, 3.2.1, 3.3.1) | T01-5; W1-1
- N = 405,853,388,800 | https://huggingface.co/api/models/meta-llama/Llama-3.1-405B/revision/b906e4dc842aa489c962f9db26554dcfdde901fe | T01-3
- Meta's scaling law suggests 402B on 16.55T (3.99e25 by 6ND); the paper does not state its counting rule | https://arxiv.org/abs/2407.21783v3 (Section 3.2.1) | T01-57; W1-31
- 380 to 430 TFLOPS per GPU, 38% to 43% MFU over three layouts | https://arxiv.org/abs/2407.21783v3 (Table 4) | T01-6; W1-35
- 3.80e25 at those rates: 24.5M to 27.8M GPU-hours; card's 30.84M is 1.1 to 1.3 times | https://github.com/meta-llama/llama-models/blob/v0.2.0/models/llama3_1/MODEL_CARD.md#L104-L154 | T01-7; W1-14; W1-1
- "Training time is the total GPU time required for training each model"; not split by stage | same card URL | T01-7; U01-3
- 8B and 70B: 1.46M and 7.0M hours, about 2.9 and 1.6 times a 40%-MFU estimate at 15T; "15T+" makes them upper bounds | same card URL and #L46 | W1-15; U01-3
- Calculator preset "Llama 3 405B check": 16,384 H100 at 41% MFU, 26.0M GPU-hours, 66 days | derived (estimateRun) | 01 W7
- PaLM 540B: 46.2% MFU with attention, 45.7% without; 238.3K tokens/s on 6,144 TPU v4; HFU 57.8% | https://arxiv.org/abs/2204.02311v5 (Section 4.1) | T01-20; W1-32
- MegaScale: 55.2% on 12,288 GPUs (175B, 2,048 tokens, batch 6,144) against Megatron-LM's 41.2%; ablation 5.6 of 17.6 points from PTB + SWA, 3.0 from LAMB with batch x3 | https://arxiv.org/abs/2402.15627v1 (Section 6.1, Tables 2 and 3) | T01-24; T01-25; W1-33
- Llama 3 MFU by layout: 43% (8,192 GPUs), 41% (16,384), 38% (16,384 at 131,072 tokens); attention counting not stated | https://arxiv.org/abs/2407.21783v3 (Table 4) | T01-6; U01-10
- DeepSeek-V3: 2.788M H800 GPU-hours, 180K per trillion tokens; no MFU reported | https://arxiv.org/abs/2412.19437v2 (Section 1) | T01-26; W1-34; U01-4

## How many tokens

- Chinchilla Table 3: 1B on 20.2B tokens, 10B on 205.1B, 67B on 1.5T (about 20 per parameter) | https://arxiv.org/abs/2203.15556v1 (Table 3) | T01-56; W1-18
- Smaller Llama 3 models trained "much longer than is compute-optimal"; they "perform better than compute-optimal models at the same inference budget" | https://arxiv.org/abs/2407.21783v3 (Section 1) | T01-57
- Llama 3.1 8B: at least 1,870 tokens per parameter ("15T+" over 8.03B) | https://github.com/meta-llama/llama-models/blob/v0.2.0/models/llama3_1/MODEL_CARD.md#L46 and the 8B metadata URL | T01-57; W1-17

## Calculator A

- Presets reproduce 01 W8 (6N full count, no attention, 40% MFU, 32 instances) and the 405B check | src/lib/presets.ts, src/lib/runtime.ts | 01 W8; 01 W7
- Instance peaks and accelerator counts shown with the preset's own sources (vendor claims for peaks) | SOURCES in src/lib/presets.ts | T01-27 to T01-30; T05-1; T05-10
- Prices: On-Demand and Capacity Block lines from priceRun with region and 2026-10-30 date; a Capacity Block is charged at the rate prevailing at purchase | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv; https://aws.amazon.com/ec2/capacityblocks/pricing/ | T05-20; T05-22; W5-9
- p5en gives the same hours as p5 because the H200 dense peak equals the H100's (our reading) | https://www.nvidia.com/en-us/data-center/h200/ | T01-28; 01 W8
- A2 protocol (not yet run): TorchTitan v0.4.0 FSDP 8, flat FSDP 16, HSDP 8 x 2, with and without deferred reduction, 8 x 8,192 tokens; about 3 hours; $771 On-Demand (2 x 7 x $55.04) or $2,292 Capacity Block (2 x 24 x $47.757) | RESEARCH-GUIDE.md section 5 | A2; T05-20; T05-22; build-log "AWS experiments"
- A5 protocol (not yet run): one ml.trn2.48xlarge, TP 4 x FSDP 16 over 64 ranks, 200 steps; 3 hours at $97.52 = $293; warm-pool keep-alive 0, warm pools are billable | RESEARCH-GUIDE.md section 5; https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/about-torchtitan-neuron.rst; AmazonSageMaker us-east-2 price file; https://docs.aws.amazon.com/sagemaker/latest/dg/train-warm-pools.html | A5; T03-38; T05-23; T06-26
