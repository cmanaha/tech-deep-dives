# Build log (orchestrator)

Per-section author reports, for the glossary, the fact check and the final report.

| Section | File | Cites | Diagrams (harness 1440/390) | Acronyms expanded | Open items for fact check |
| --- | --- | --- | --- | --- | --- |

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
  for full recomputation on one GB10 (1B Llama shape, 2,048 tokens); the papers' 25% to 40% stays
  theirs.
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
- **AWS experiments** (sections 7, 8, 18, 22, 23, 25, 27, 31): A0 to A5 are protocols marked "not yet
  run"; never present a prediction as a result.
