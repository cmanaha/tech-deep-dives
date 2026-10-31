# Build log (orchestrator)

Per-section author reports, for the glossary, the fact check and the final report.

| Section | File | Cites | Diagrams (harness 1440/390) | Acronyms expanded | Open items for fact check |
| --- | --- | --- | --- | --- | --- |
| 3 Training step | TrainingStep.tsx | 34 | 1 (step timeline drawn to scale, narrow layout at 390), 0 overlap/clip/overflow | FLOPs, MFU, BF16, FP32, TFLOPS, ZeRO, MLP; FP16 glossed | 18-byte row cites Megatron's table without claiming it is the default; strongest number 128.5 GB (1.6 x one H100) landed five times |
| 4 Arithmetic | Arithmetic.tsx | 55 | 1 (attention's share of per-token FLOPs, 8B and 70B from 2K to 128K, stacked bars; narrow layout), 0 overlap/clip/overflow | FLOPs, MFU, HFU, TFLOPS, BF16, FP32, FP8, MXFP8, FP4, PFLOP, EC2, EFA, FSDP, HSDP, TP, LNC, TPU | About 2,830 words with four expandables, above the 2,500 target: leverage pass to trim; A2 and A5 protocols marked not yet run |
| 5 Memory budget | MemoryBudget.tsx | 65 (37 sources) | 1 (stacked bars, seven layouts against 60, 80 and 141 GB, values from `memoryBudget`; narrow layout), 0 overlap/clip/overflow; lever table stacks on narrow screens | BF16, FP32, FP8, ZeRO, FSDP, DDP, TP, SP, PP, CP, 1F1B, MLP, FLOPs, HFU, MFU, EFA, HSDP | Prints the papers' recomputation cost as 30% to 40% (no paper states 25%); U02-8 hedged until A2; Megatron's Muon state layout unread; 43.0 GB (calculator, BF16 logits added) against the register's 39 GB |
| 6 Precision | Precision.tsx | 75 | 1 (scale ladder: model, tensor, block and tile, runs of 32 and 16; stacked below 680px), 0 overlap/clip/overflow | FP8, BF16, FP16, FP32, TFLOPS, MXFP8, NVFP4, OCP, MX, MFU, cFP8, TF32 | C03-10 (MXFP8 on Neuron: release notes against the fork's code) open, hedged; U01-13 (two Trainium2 peaks) hedged; uses a source outside the register, Megatron Bridge 0.7.0 performance archive (731 TFLOP/s per GPU, 70B FP8 on 64 H100), labelled vendor claim, proposed T01-64: fact check must open it |
| 7 Collectives | Collectives.tsx | 47 | 4 figures (9 SVGs: before-and-after grids, all-reduce decomposition, link hierarchy, crossing count; narrow layouts), harness 0/0/0 | NCCL, EFA, DDP, ZeRO, AMI, BF16, TP | Per-instance pricing of the crossing is our reading (AWS nccl-tests sample as evidence); keeps 0.62 s only as the per-GPU count in an expandable; A1 protocol marked not yet run |
| 8 Data parallel | DataParallel.tsx | 45 | 6 (five sharding cards on two instances, one bar chart of GB leaving each instance per step with flat-ring whiskers), 0 overlap/clip/overflow | DP, DDP, MiB, BF16, EFA, FP32, ZeRO, FSDP, FSDP2, HSDP, INT8, INT4, FLOPs, MFU, vCPUs | Per-instance numbers match Calculator C (289, 193, 120, 24.1 GB); HSDP deferred needs 82.45 GB without recomputation with the eager SwiGLU, so the page recommends full recomputation (42 GB); HSDP's time gain may be smaller than its byte gain (about 0.75 s of NVLink gathers), our reading pending A2; new derived figures: 205 GB with sync off alone (E3 counts), A2's two-instance predictions; 2,566 words |
| 9 Tensor parallel | TensorParallel.tsx | 44 | 3 (layer with TP, layer with SP, time bars; narrow layouts), 0 overlap/clip/overflow | TP, SP, DP, MLP, KV, GQA, MFU, FLOPs, TFLOPS, BF16, EC2, EFA, FSDP, MoE | 70B TP 8: 0.94 GB per layer per micro-batch, 2.1 ms on NVLink against 13.3 ms at 40% MFU (W2-17); one-GPU-per-instance TP group 18.8 ms (per-GPU share, g = 1); SP 99.4 to 61.9 GB matches Calculator B; TP 16 across instances not priced |
| 10 Pipeline | PipelineParallel.tsx | 53 | 1 interactive schedule chart (GPipe, 1F1B, interleaved; m control; simulated from the schedule rules; narrow layout; 18 control settings probed), 0 overlap/clip/overflow | PP, TP, DP, MFU, FLOPs, TFLOPS, 1F1B, EFA, BF16, MLP, MoE, ZeRO-1 | U02-10 (Llama 3's V and M) hedged; Calculator B's interleaved factor 1 + (p-1)/(pv) gives 1.375 L at m = p where the simulated schedule holds L, so the slider starts at m = 8 (calculator caveat for section 14); eleven Tier 1 code facts new to the registers (marked NEW in the claims file); at 390 the steady-state forward blocks are narrow and unnumbered |
| 11 Context parallel | ContextParallel.tsx | 40 | 4 (three design cards: ring, Ulysses, Llama 3 all-gather; ring overlap threshold chart, log scale), 0 overlap/clip/overflow | CP, SP, TP, PP, DP, ZeRO, BF16, GQA, KV, EFA, EC2, FLOPs, TFLOPS, MFU | Dense 989.5 TFLOPS as half the sparse figure rests on U02-7 (open), stated; register line fixes: W2-31 at L713 to L718, Ulysses analysis is Sec 3.2 not 3.1 (T02-22); Megatron's guide runs 70B at 8K with CP 2 where Llama 3 used CP 1, both stated; 'TP and Ulysses split the same heads' and the (g+1)/P rule labelled our reading |
| 12 Expert parallel | ExpertParallel.tsx | 38 | 1 (node-limited dispatch of one token across two p5.48xlarge; narrow layout), 0 overlap/clip/overflow | MoE, EP, EFA, EC2, FP8, BF16, FP16, ZeRO, HSDP, TP, CP, DP, PP, ETP, EDP | Glossary must add ETP and EDP; T02-72 shown as a doc-code conflict (the guide's example works only with ETP 1, per Calculator C); U03-6 closed (overlap flag, no DualPipe); twelve Megatron core_v0.20.0 code claims without a register row; about 2,600 words |
| 13 Composing | ComposingLayouts.tsx | 51 | 1 (nested mesh of Llama 3 405B: DP 64, PP 16, CP 1, TP 8), 0 overlap/clip/overflow | TP, CP, PP, DP, MFU, FLOPs, EFA, NCCL, FSDP, FSDP2, HSDP, ZeRO, EP, GQA, PTD-P, SP, BF16, TFLOP/s, EC2 | W2-4 stated corrected (PP outermost in Megatron, TorchTitan, DeepSpeed; DP outermost in Llama 3); Llama 3's pod placement and CP 16 crossing servers labelled our reading; 70B TP about 1.2 TB per GPU per step from Calculator C; about 2,990 words |
| 14 Set my ranks | SetMyRanks.tsx | 71 | 1 (12-step decision flow in three passes; narrow version below 760px) and Calculator C's UI (rank, check and MoE modes, 10 presets), 0 overlap/clip/overflow | TP, SP, PP, CP, DP, KV, HBM, BF16, FP32, ZeRO, FSDP, HSDP, DDP, PTD-P, MoE, ETP, EP, EDP, 1F1B, EFA, NCCL, FLOPs, MFU, GQA, VP, MLP, EC2, LNC, vCPU | Every worked number computed live by Calculator C; the author found ZeRO-2 priced like ZeRO-1, which the orchestrator fixed in the calculator (one gradient reduce-scatter per micro-batch, DeepSpeed v0.19.9 stage_1_and_2.py L2293 to L2295; new test, mutation-checked) and in the page's example 2 text; CP-heavy layouts rank first when CP is allowed, so the UI defaults to CP 1 (step 6); calculator error messages carry register IDs, which the page strips |
| 15 Framework map | FrameworkMap.tsx | 111 (110 Tier 1, 1 Tier 3) | 1 (three engines with front ends and maturity labels at pinned tags, ended or moved projects; phone layout), 0 overlap/clip/overflow | FSDP, DTensor, ZeRO, TP, PP, CP, EP, SP, HSDP, DDP, DP, NxD, RL, BF16, FP32, FP8, MXFP8, NVFP4, MoE, 1F1B, DCP, LNC, VP, EC2, DLAMI, AMI, DLC, ALST | Glossary must add DLC and ALST; eight code or doc lines without a register row (marked NEW), one is Megatron's FSDP2 flag whose help text reads 'Set to enable FSDP ZeRO-2'; TorchTitan Neuron shown as 0.2.2+neuron.1 (package version) against the pinned release-2.33.0 tag: fact check confirms both; about 2,800 words |
| 16 Fine-tuning | FineTuning.tsx | 39 (30 sources) | 1 (70B model state by method, to scale in 80 GB cells) and 1 widget on Calculator B's frozen-base rows, 0 overlap/clip/overflow | RL, LoRA, QLoRA, FP32, BF16, ZeRO, NF4, EC2, FP16, DTensor, FSDP | 1,128.9 GB on the 16-byte basis (15 H100 at 80 GB) and 1,270.0 GB on the 18-byte basis (16) both printed with basis; sources new to the registers: QLoRA Sec 2 activation figures, LoRA Sec 7.1 (18M adapter parameters), OpenRLHF utils.py L25 to L37; about 2,000 words |
| 17 Failures | FailureRates.tsx | 29 | 1 (job MTTF against GPU count, log axes, three Meta rates and the Llama 3 405B point; narrow layout), 0 overlap/clip/overflow | MTTF, ETTR, HBM (RSC-1 and RSC-2 used as names; the paper never expands RSC) | Every MTTF from jobMttfSeconds and FAILURE_RATES; three facts beyond the registers checked at source (Observation 2 quote, 8 GPUs per server on Meta's clusters, Meta's three causes of lost time); EC2 instance page keeps its 2026-10-30 access date (not re-opened) |
| 18 Checkpointing | Checkpointing.tsx | 69 | 1 (synchronous against asynchronous save around one failure; narrow layout) and Calculator D's UI, 0 overlap/clip/overflow | BF16, FP32, ZeRO, RNG, MTTF, ETTR, MFU, EC2, EFA, S3, EKS, DCP, NCCL, HDFS, SOSP, vCPU, TFLOPS | Interval and ETTR from Calculator D at render (2.0 h and 403 steps at 60 s, ETTR 0.982; 21.5 min and 74 steps at 2 s, 0.995); new point: save is asynchronous, load is not (smallest FSx size reads 988 GB back in about 14 min, longer than the 10-minute restart); A3 protocol not yet run; U04-2 (Young and Daly papers unread) hedged; RSC-1 unexpanded; over 2,500 words with the three expandables |
| 19 Resuming | Resuming.tsx | 53 (40 sources) | 1 (one slow rank stretches every step, and what each rank's timers show; narrow layout), 0 overlap/clip/overflow | NCCL, EKS, DCP, DDP, FSDP, HSDP, TP, MFU, AMI, EFA | Strongest number: 10.4% of GPU-hours wasted to stragglers (ByteDance trace), five times; A1 protocol not yet run (narrows U04-5); NEW code facts: TorchTitan v0.4.0 disables automatic GC and collects every 50 steps, Megatron leaves it off; about 2,700 words |
| 20 AWS ownership | AwsOwnership.tsx | 151 | 1 (ownership grid: seven paths in three cluster shapes, ten concerns, coloured AWS-run, team-run or not documented; wide and narrow layouts), 0 overlap/clip/overflow | EFA, EC2, EKS, PCS, AMI, DLAMI, S3, SDK, NCCL, SMP, UTC, DCGM, Xid, DRA | Strongest number: termination starts 30 minutes before a Capacity Block ends (W5-16), three times; rates read from presets; U06-1 (auto-resume above 16 nodes) hedged; Batch on EKS health, fabric and Trainium cells not documented (U06-7); glossary adds UTC |
| 21 AWS hardware | AwsHardware.tsx | 67 | 1 (scale-up domains of 8, 16, 64, 72 and 144 accelerators to scale with the EFA edge; layout below 700px) and one instance table from the 12 INSTANCES presets (stacked cards on narrow screens), 0 overlap/clip/overflow | EC2, HBM, MFU, EFA, TP, NCCL, NVMe, TFLOPS, BF16, FP8, cFP8, MXFP8, LNC, FP4, DP, ZeRO-1 | All figures imported from presets, none disagrees with its source; new doc conflict: P6e-GB200 EFA 3,200 Gbps per instance (800 per GPU) on the EC2 page against 28.8 Tbps per UltraServer (about 400 per GPU) on the P6 page, preset follows EC2, page prints both; EC2 page's 2,148 GiB total is not 8 x 268 (claims file); C05-1 in the text, C05-2 to C05-4 and U01-13 in a disclosure |
| 22 Capacity and cost | CapacityCost.tsx | 54 sites (60 claim rows) | 1 (Capacity Block window and final-day edges, 11:00 and 10:30 UTC; narrow layout) and Calculator A's cost panel on estimateRun and priceRun, 0 overlap/clip/overflow | EC2, vCPU, MFU, UTC, PCS, EKS, BF16, S3 | 70B on 15T at 40% MFU on 2,048 H100: 91 days, $30.7M On-Demand, $26.6M on blocks ($47.757 per p5 hour); Meta's 7.0M hours as the hedge (U01-3); U05-5 hedged; A0 protocol not yet run (U05-7); block and plan limits (64 instances, 256 per organization) defined in the section, not in presets; reserved windows priced by calling priceRun with window hours |
| 23 Storage | Storage.tsx | 48 | 1 (data path and checkpoint path for 70B on 256 H100, restore edge dashed; narrow layout), 0 overlap/clip/overflow | S3, EC2, NVMe, FLOPs, MFU, BF16, TFLOPS, EFA, DCP, POSIX | 0.96 MB/s of tokens against 16.5 GB/s for a 60 s save, about 17,000 times; checkpoint numbers from Calculators A and D match section 18; NEW code readings: DCP's FileSystemWriter renames .metadata.tmp at the end of every save and Mountpoint rejects renames on general purpose buckets, so dcp.save into Mountpoint fails there in our reading (not run); Megatron rebuilds its index cache on rank 0; Megatron streams from S3 with mmap off; U04-7 hedged; about 2,620 words |

## Calculators (`src/lib/`, 2026-10-31)

presets.ts, runtime.ts (A), memory.ts (B), parallelism.ts (C), checkpoint.ts (D); 156 tests plus the 8
Cite tests, `Tests  164 passed (164)`. Mutation check (each restored, suite green after): memory 34 to
35 sbh fails 18 tests; runtime 6N to 5N fails 20; checkpoint sqrt(2w) to sqrt(w) fails 7; parallelism
bubble (p-1) to p fails 2. Calculator C prices cross-instance collectives per instance (condition
below); W2-44's shares stay about 6%, 94% and DP 0.88%.

Discrepancies the calculator author recorded (spec or register against recomputation), for the
owning sections and the fact check:
- 01 W4: 1.377 GB from E1's measured 41.03 sbh, 1.376 GB from the rounded 41.0 (both tested).
- Section 16: 1,129 GB at 16 bytes per parameter against register 03 W4's 1,270 GB at 18 bytes; the
  section must say which basis it prints.
- W1-23: TP 8 x FSDP 32 at 16 sequences with full recomputation, 38.8 GB in the register (FP32 logits
  only, V = 128,000, 34 sbh) against 43.0 GB in the calculator (FP32 and BF16 logits, V = 128,256,
  33.5 sbh); both fit.
- G7: flat FSDP 32 with full recomputation, 58.0 GB with 3.42 GB of gathered layers counted, 54.6 GB
  in the calculator, which leaves gathered layers to headroom; section 14 must say which it prints.
- G5: the "2.7 to 15 minutes" dt* range is not wholly below u_0 (15 min = 900 s against a 600 s
  restart); it is below 3 x u_0, so the regime warning still fires; section 18 words it that way.
- W4-22: 117,749 parts from the rounded 987.75 GB; the exact byte count needs 117,750.

## Cross-section conditions to keep consistent

Facts that more than one section states. A section that contradicts one of these is wrong; the owner
section and source are named so the fact check can trace it.

- **Pinned versions** (every section): PyTorch v2.15.0, TorchTitan v0.4.0, Megatron Core core_v0.20.0,
  Megatron Bridge v0.7.0, DeepSpeed v0.19.9, TorchTitan Neuron release-2.33.0, Neuron SDK 2.33, NCCL
  user guide 2.32.3, dcgm-exporter 4.8.4, DCGM v4.7.0, HyperPod recipes 2.0.11. Constants in
  `src/components/Cite.tsx`.
- **The default MFU** (sections 4, 14, 22, 29, 31): 40% is a labelled assumption inside Llama 3's
  measured BF16 range on H100; no first-party MFU for dense Llama-class training on H200 or Trainium2
  was located (wave2-step-maths, U01-5). Tokens per second at 40% depend on the FLOP count: 6N only
  gives about 8,200 (8B) and 935 (70B) per H100; TorchTitan's count at 8,192 tokens gives about 6,800
  and 820 (wave2-observability W6-9).
- **Activation coefficient** (sections 3, 5, 14): 34 sbh per layer with a fused SwiGLU, 41 sbh with
  TorchTitan v0.4.0's eager `F.silu(gate) * up`, 2 sbh with full recomputation, all measured on one
  GB10 in E1; the logits' transient peak (8.5 GB forward, 11.6 GB backward at 8K) is above their 4.2
  GB saved size.
- **Recomputation price** (sections 4, 5): FLOP cost about 33%; E2 measured +14% to +16% step time
  for full recomputation on one GB10 (1B Llama shape, 2,048 tokens); the papers' figures stay theirs:
  about 30% extra runtime (Chen et al., T01-36) and 36% to 39% for full-layer recomputation
  (Korthikanti et al., T01-34), printed as "30% to 40%". No paper states 25%.
- **FSDP2 collective counts** (sections 8, 14, 30): default two all-gathers and one reduce-scatter per
  unit per micro-batch; with gradient sync deferred, k + 1 all-gathers and one reduce-scatter per unit
  for k micro-batches (E3). Flight recorder 2,000 entries is about 2.5 steps for the 8B example at
  eight micro-batches and about one step for 70B [derived from E3].
- **Async checkpointing** (sections 18, 23, 25): bare `async_save` blocks for the whole copy (E4: 35.86
  s first save of 4.03 GB on GB10); a pinned stager blocks about a millisecond; an NCCL-only process
  group is rejected ("A CPU backend must be enabled for async save"); initialise with
  "cpu:gloo,cuda:nccl" (no explicit backend does not add CPU at v2.15.0, wave2-reliability G2).
- **ETTR and intervals** (sections 17, 18): 70B on 256 GPUs at r_f 6.50 and a 10-minute restart: 2.0
  h for a 60 s save, 21.5 min for an assumed 2 s save, ETTR 0.982 against 0.995.
- **Llama 3 interruptions** (sections 1, 17): one unexpected interruption every 3.1 hours over a
  54-day window of Llama 3 405B pre-training on up to 16K GPUs; 466 interruptions, 419 unexpected.
- **Capacity Block edges** (sections 20, 22, 28): termination starts 11:00 UTC on the final day, 30
  minutes before the 11:30 end; 60 minutes early for P6e-GB200 UltraServer blocks; one hour for a
  training plan targeting HyperPod, 30 minutes for training jobs (wave2-aws W5-16).
- **Trainium deep health checks** (sections 20, 25, 27): documented on HyperPod EKS; HyperPod Slurm's
  are GPU-only (wave2-aws U06-11).
- **ZeRO-2 under gradient accumulation** (sections 8, 14, 15, Calculator C): ZeRO-1 and ZeRO-2 send
  the same bytes as DP only at one micro-batch per step; DeepSpeed reduces ZeRO-2's partitioned
  gradients on every backward pass (stage_1_and_2.py L2293 to L2295 at v0.19.9; engine.py L2695 sets
  partition_grads for stage 2), ZeRO-1 at the accumulation boundary.
- **AWS experiments** (sections 7, 8, 18, 22, 23, 25, 27, 31): A0 to A5 are protocols marked "not yet
  run"; never present a prediction as a result.
- **Cross-instance pricing** (sections 7, 8, 14, 21, 31, Calculator C): traffic between instances is
  counted per instance over the instance's EFA bandwidth (400 GB/s on p5.48xlarge and p5en.48xlarge),
  at least (M-1)/M x S per all-gather or reduce-scatter and 2(M-1)/M x S per all-reduce across M
  instances, a flat ring (n-1)/n x S; inside the instance, per GPU over NVLink at 450 GB/s. Groups with
  one member per instance give the same answer as 50 GB/s per GPU. Worked numbers: 8B gradients across
  four p5.48xlarge at least 24.1 GB per instance, about 60 ms (section 7); section 8 flat FSDP at least
  289 GB per instance per step at defaults (373 GB flat ring) against HSDP 193 GB, deferred at least
  120 GB (156 GB) against 24.1 GB; section 14 example 2 flat FSDP 32 7% to 9% of compute. Evidence:
  AWS's nccl-tests sample, 16 GiB all-reduced across two p5.48xlarge in 66 ms (wave2-parallelism,
  orchestrator addendum). Labelled our reading; A1 (not yet run) would measure it.
