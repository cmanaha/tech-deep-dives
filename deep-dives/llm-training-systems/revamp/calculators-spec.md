# Calculator specification (orchestrator working file)

Four calculators, pure TypeScript functions in `src/lib/`, each with a unit test file in
`src/__tests__/` that checks it against the worked numbers in the research registers. The section
files (4, 5, 14, 18, 22) render UI on top of these functions; no formula lives in a section file.
Every function is plain data in, plain data out (Humble Object: the React layer only reads inputs
and prints outputs). Invalid input throws a `RangeError` naming the field; no function returns
`null` or `NaN`.

Sources for every formula and preset: `SCOPE.md` "Calculators and interactive elements", the
section blocks 4, 5, 14, 18 and 22, the wave 2 verdict files (which override the registers), and
the register worked-number sections named below. Tier 0 coefficients come from
`research/2026-10/E1-spark-activation-memory.md` and `E3-spark-fsdp2-collectives.md`.

## Shared data: `src/lib/presets.ts`

- Models: Llama 3.1 8B, 70B, 405B (L, h, FFN, heads, KV heads, V = 128,256, total parameters and
  matmul-only parameters, from 01 W1 and T01-1/T01-4); DeepSeek-V3 as an MoE preset with the shapes
  register 02 holds (total and activated parameters, experts, top-k, layers 61) for the MoE mode;
  Llama 3.2 1B (E2's model) optional. Custom shapes allowed.
- Accelerators and instances (05 section 3.1, wave2-aws): p5.48xlarge (8 x H100 80 GB, dense BF16
  989.5 TFLOPS, FP8 1,979, NVLink 450 GB/s per GPU per direction, EFA 400 Gbps per GPU = 50 GB/s),
  p5en.48xlarge (8 x H200 141 GB), p6-b200.48xlarge, p6-b300.48xlarge, trn2.48xlarge (16 chips, 64
  ranks at LNC=2, 24 GiB per rank, 667 TFLOPS BF16 per chip), and the rest of the 05 section 3.1
  table. Each row carries ranks per instance, HBM per rank (state GB or GiB as the source does and
  convert explicitly), dense BF16 peak per rank, scale-up link bandwidth per rank, EFA per rank, and
  the citation (URL + tier) for each number, so the UI can render the source.
- Prices (05 section 3.2 and wave2-aws): EC2 On-Demand, Capacity Block, SageMaker training job,
  HyperPod and training plan per instance-hour, us-east-1 2026-10-30/31 unless stated, each with its
  source and the date; path fees (PCS controller and per-instance, EKS cluster-hour, EKS Auto Mode
  per instance-hour).
- Failure-rate presets (T04-7): 2.34, 6.50 and 17.5 failures per thousand node-days.

## Calculator A: run time and accelerator-hours (`src/lib/runtime.ts`, section 4; cost panel in 22)

Inputs: parameter count N (full or matmul-only toggle), layers L, hidden h, tokens D, sequence
length s, attention mode (causal 6Lhs or no-discount 12Lhs per token; 01 W6), accelerator dense
peak, accelerator count, MFU (default 0.40, labelled assumption).
Outputs: FLOPs per token (dense 6N, attention), total FLOPs, accelerator-hours, wall-clock days,
tokens per second per accelerator, and (cost panel) dollars per path from the price presets.
Validation tests (each with its register reference in the test name):
- 6ND for Llama 3 405B at D = 15.6T (01 W7): 3.80e25 FLOPs; matmul-only 3.78e25 (wave2-step-maths
  W1-13). No overhead factor is applied anywhere.
- 01 W8: Llama 3.1 70B on 1T tokens at 40% MFU on H100 = about 297,000 H100-hours, 48 days on 256
  GPUs; 70B on 15T tokens = about 4.46M H100-hours.
- 07 W1: tokens per second per H100 at 40% MFU: about 8,200 for 8B and about 935 for 70B with 6N
  only (full N, no attention term); with TorchTitan's FLOP count (attention added, embedding table
  left out) at s = 8,192: about 6,800 for 8B and about 820 for 70B, and 4,000 tokens per second for
  8B reads as about 23% MFU (wave2-observability W6-9). The UI states which count it uses.
- 01 W6 attention share for 8B at 8,192 tokens: 12.5% (causal) and 22% (no discount) of per-token
  FLOPs; crossover at about 57K (causal) and 29K tokens.
- FP8 upper bound (section 6): 297,000 falls to about 148,500 at the same MFU against the FP8 peak.
- Cost panel (section 22): 4.46M H100-hours priced at about $30.7M On-Demand and $26.6M on Capacity
  Blocks for p5.48xlarge, and about 91 days at 2,048 GPUs. Every price row carries its Region (the Trn2
  block rate is Ohio, the P6e-GB200 rate the Dallas Local Zone; wave2-aws W5-11). SageMaker managed
  Spot training publishes no rate, so the panel takes it as a user-entered discount (U05-4).

## Calculator B: the memory budget (`src/lib/memory.ts`, section 5; reused by 14 and 16)

Inputs: model shape; optimizer row (Adam mixed precision 16 bytes per parameter with BF16
gradients; 18 with FP32 main gradients; DeepSeek-style BF16 moments 14; 8-bit Adam 10; Muon 12;
Adafactor without momentum about 8; frozen base for LoRA and 4-bit QLoRA with the adapter fraction
as an input; the byte rows from wave2-step-maths W1-50 and register 03 W4); ZeRO stage (0, 1, 2, 3
/ FSDP) and its degree; TP degree with or without SP; PP degree with interleaved chunks (the first
stage holds p micro-batches' worth of activations under 1F1B, i.e. L layers' worth whatever p is,
T01-62); CP degree; recomputation mode (none, full, selective); activation coefficient (34 sbh
fused SwiGLU default, 41 sbh eager, both measured in E1); micro-batch b; sequence length s; logits
mode (FP32 upcast 4sbV, fused BF16 2sbV); headroom target as a fraction of HBM (default 0.75, an
assumption).
Outputs: model state per rank (weights, gradients, optimizer separately), activations per rank,
logits per rank, total, headroom on the chosen accelerator, and a flag "confirm with a measured
step" past the headroom target. Every output carries GB (1e9) and the accelerator's capacity in
the unit its source uses, converted explicitly.
Validation tests:
- 01 W2: Llama 3.1 8B model state 128.5 GB at 16 bytes; 70B 1,128.9 GB at 16 and about 1,270 GB at
  18.
- 01 W4: 8B at s = 8,192, b = 1, no parallelism: 1.141 GB per layer, 36.51 GB for 32 layers (34 sbh);
  41 sbh gives 1.377 GB per layer (E1); TP 8 + SP 4.56 GB; full recomputation 2.15 + 1.14 = 3.29
  GB; FP32 logits 4.20 GB; 70B per layer 2.248 GB (33.5 sbh), 179.85 GB for 80 layers; TP 8 + SP
  22.48 GB.
- 01 W5: 8B on one p5.48xlarge FSDP 8, s = 8,192, b = 1: 16.06 + 36.51 + 6.30 = 58.9 GB; 70B TP 8 +
  SP, ZeRO-1 over DP 32: 35.28 + 3.31 + 22.48 + 0.79 = 61.9 GB.
- 02 section 3.2 and wave2-parallelism W2-42: TP 8 x PP 4 x DP 8 with ZeRO-1 for 70B on 256 H100 at
  b = 1: about 38 GB per GPU with BF16 gradients, about 43 GB with FP32 main gradients.
- Section 16 / register 03 W4: 70B full fine-tuning 1,129 GB, LoRA about 141 GB, 4-bit QLoRA about
  35 GB before activations.

## Calculator C: parallelism sizing (`src/lib/parallelism.ts`, section 14)

Inputs: model, instance and count (ranks and HBM per rank from presets), sequence length, global
batch in tokens or sequences, headroom target, gradient dtype.
Enumerates: TP (divisors of ranks per instance that divide heads, with the KV-head rule T02-15),
PP (divides L, or uneven first/last stages flagged per wave2-parallelism W2-56), interleaved chunks
v, CP, DP or FSDP degree (world size / (TP x CP x PP)), ZeRO stage, micro-batch b (global batch
divisible by b x DP), recomputation mode, FSDP gradient-sync mode (every micro-batch or deferred:
deferral adds a full unsharded gradient per rank, T03-3).
For each candidate: memory through Calculator B; estimated step time = compute (Calculator A's
identity at the stated MFU) x recomputation factor (4/3 for full, about 1.0x for selective with a
stated assumption) x (1 + bubble (p-1)/(v x m)) + exposed communication as a range [0, full] where
full = sum over dimensions of bytes per link / link bandwidth (TP 8bsh(t-1)/t elements per layer
per micro-batch in BF16 over NVLink, T02-13; DP and FSDP bytes per section 8 and E3's counts:
default 2 all-gathers and 1 reduce-scatter per unit per micro-batch, deferred k + 1 all-gathers
and 1 reduce-scatter; PP bsh/t per micro-batch per boundary over EFA, T02-31; CP K and V per
attention layer). Cross-instance collectives are priced per instance (wave2-parallelism, orchestrator
addendum of 2026-10-31): a group spanning M instances with g members on each moves at least
(M-1)/M x S per all-gather or reduce-scatter and 2(M-1)/M x S per all-reduce out of each instance,
8/g such groups share the instance's EFA bandwidth (400 GB/s on p5.48xlarge and p5en.48xlarge), and
a flat ring's (n-1)/n x S per instance is the upper value. For g = 1 this equals the per-GPU count
over 50 GB/s. In-instance traffic stays per GPU over NVLink. ZeRO-2 reduce-scatters gradients once per micro-batch (DeepSpeed v0.19.9
stage_1_and_2.py L2293-L2295), ZeRO-1 once per step. Ranks survivors by the midpoint of the range and shows per-link shares.
MoE mode: model state per GPU on the attention grid and the expert grid, expert-parallel bytes per
token per MoE layer with node-limited routing (02 section 3.4: about 172 KB forward
dispatch-plus-combine for DeepSeek-V3), the world-size check on both grids (T02-41, T02-72);
activation memory labelled "not modelled; measure a step"; output worded as candidate grids.
Output ends with "measure these two or three".
Validation tests:
- 02 section 3.2: Llama 3.1 70B on 32 p5.48xlarge at 8,192 tokens and a 4.2M-token global batch:
  TP 8 x PP 4 x DP 8 with ZeRO-1 and v = 5 passes at about 38 GB (bubble 4.7% at v = 1, 0.94% at
  v = 5, m = 64); TP 8 x FSDP 32 passes with full recomputation; DP traffic about 1% of a 17.5 s step;
  FSDP traffic about 6% with one micro-batch per rank and about 94% at 16 micro-batches with
  per-micro-batch sync (wave2-parallelism W2-44).
- Section 14 example 2 and wave2-parallelism G7: Llama 3.1 70B on 4 p5en.48xlarge (32 H200): ZeRO-1
  308.7 GB and ZeRO-2 172.0 GB per GPU fail; HSDP inside one instance 141.1 GB fails; TP 8 x DP 4
  with ZeRO-1 about 85 GB passes (about 103 GB with FP32 gradients); TP 8 x PP 2 x DP 2 about 67 GB
  passes; on 32 H100 the same TP 8 x DP 4 fails at 85 GB and fits at about 64 GB only with full
  recomputation (W2-55).
- Section 8: Llama 3.1 8B on 4 p5.48xlarge, 8 micro-batches, per instance per step across EFA:
  flat FSDP 32 at least 289 GB at defaults (373 GB flat ring), HSDP 193 GB; deferred: at least
  120 GB (156 GB flat ring) and 24.1 GB; FP32 reduce at least 385 GB (498 GB flat ring)
  (03 W1, E3, wave2-parallelism addendum on W2-15).
- Section 14 example 2: flat FSDP 32 for 70B on 4 p5en.48xlarge with full recomputation, at least
  317.5 GB per instance per micro-batch (410.1 GB flat ring), 0.79 to 1.03 s against 11.68 s of
  compute, 6.8% to 8.8% (wave2-parallelism addendum on W2-51).
- T03-38: trn2.48xlarge, TP 4 x FSDP 16 for Llama3-8B on 64 ranks of 24 GiB passes the memory check.

## Calculator D: checkpoint interval and storage (`src/lib/checkpoint.ts`, section 18)

Inputs: checkpoint bytes (12 to 14 bytes per parameter, from Calculator B's optimizer row; 04 W2),
node count, failure rate (preset or custom, failures per thousand node-days), step time, save mode
(synchronous or asynchronous), blocking time w_cp, restart time, drain budget for asynchronous saves.
Outputs: MTTF = 1 / (N_nodes x r_f); Young-Daly interval dt* = sqrt(2 w_cp / (N_nodes r_f)) in time
and in steps; expected ETTR using the same model 04 W3 uses (state the formula in the code
comment, from 2410.21680v2 Eq. 3 and Appendix A); two regime warnings (wave2-reliability G5): job
MTTF below 0.1 day (the regime Meta checked against Monte Carlo, not a stated bound), and dt* below
about three times the restart time u_0 (Appendix A assumes dt >> u_0);
storage write bandwidth target (bytes / w_cp when synchronous, bytes / drain budget when
asynchronous); FSx for Lustre PERSISTENT-1000 capacity that delivers it (1,000 MBps per TiB; AWS
does not define the MB in bytes, so compute with decimal MB and show two significant digits,
U04-7), rounded up to a valid size (1,200 GiB, 2,400 GiB, then increments of 2,400 GiB; W4-21),
and its monthly cost at $0.600 per GB-month on the provisioned size (T00-1); S3 part uploads at the
connector's 8 MiB default part size (U04-8) and the seconds of one prefix's 3,500 PUT per second.
Validation tests (04 W1 to W3, wave2-reliability, 00-orchestrator-notes):
- 256-GPU job (32 p5.48xlarge) MTTF 2 to 13 days across the presets; 16,384 GPUs 0.7 to 5 hours.
- 70B checkpoint at 14 bytes per parameter about 988 GB, 3.86 GB per GPU on 256 GPUs.
- 70B on 256 GPUs at r_f 6.50 and u_0 = 10 minutes: interval 2.0 hours (7,060 s) for a 60 s
  blocking save, 21.5 minutes (1,289 s) for 2 s; ETTR 0.98171 and 0.99546, printed 0.982 and 0.995
  (W4-18; 0.996 was a rounding error).
- 16K GPUs: ETTR 0.79 (60 s save) against 0.88 (2 s save) at a 10-minute restart, 0.93 at 5 minutes;
  MTTF 1.8 hours triggers both warnings (dt* 2.7 to 15 minutes is below u_0).
- 16.46 GB/s for a 60 s save of the 70B checkpoint; 16.46 TiB at PERSISTENT-1000 (decimal MB),
  rounded up to 19,200 GiB; $11,520 a month at $0.600 on 19,200 GB-months (W4-21: "on the order of
  $10,000 to $12,000").
- Asynchronous drain target for the 2 s row: 987.75 GB over its 1,289 s interval = 0.77 GB/s
  (wave2-reliability G9, replacing 04 W2's 0.34 GB/s).
- S3 at 8 MiB parts: 987.75 GB is 117,749 part uploads, 33.6 s at 3,500 PUT per second (W4-22).

## Tests

`src/__tests__/<calculator>.test.ts`, vitest, one `describe` per register section, each expected
value with a tolerance that matches the register's rounding (state it), plus input-validation tests
(a `RangeError` on non-positive counts, MFU outside (0, 1], degrees that do not multiply to the world
size). Mutation check before reporting: change one coefficient in each calculator (for example 34 to
35, 6 to 5, sqrt(2 w) to sqrt(w)) and confirm at least one test fails, then restore it; record the
result in the build log.
