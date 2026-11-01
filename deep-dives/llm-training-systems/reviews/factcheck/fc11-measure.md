# Fact check fc11-measure (sections 29, 30, 31), 2026-10-31

Files: `src/sections/WhatToMeasure.tsx`, `src/sections/Telemetry.tsx`, `src/sections/BringUp.tsx`;
claims lists `revamp/claims/measure.md`, `revamp/claims/telemetry.md`, `revamp/claims/bring-up.md`.

Status: complete. Gate 3 scores: WhatToMeasure.tsx 9, Telemetry.tsx 8, BringUp.tsx 9 (rationale under each table).

Evidence read anonymously (curl with its default user agent or a shallow https clone, no identifying header,
no account token):
- Raw files at the pinned refs: PyTorch `v2.15.0` (`ProcessGroupNCCL.hpp`, `ProcessGroupNCCL.cpp`,
  `FlightRecorder.hpp`, `FlightRecorder.cpp`, `distributed_c10d.py`, `flight_recorder/components/utils.py`,
  `torch_nccl_environment_variables.md`, `pyproject.toml`, `torch/cuda/memory.py`, `torch_cuda_memory.md`), plus
  `FlightRecorder.hpp` at v2.10.0 and v2.11.0 and `ProcessGroupNCCL.cpp` at v2.5.0; TorchTitan `v0.4.0` (shallow
  clone, 45e33cd413b64cb37a7840cfd3c9765d3c639ae1: `observability/metrics.py`, `distributed/utils.py`,
  `distributed/parallelism_context.py`, `components/optim/optim.py`, `tools/utils.py`, `config/configs.py`,
  `trainer.py`, `training_engine.py`, `models/common/flops.py`, `docs/debugging.md`, `README.md`); Megatron-LM
  `core_v0.20.0` (`resilience_config.py`, `arguments.py`, `rerun_state_machine.py`); DCGM `v4.7.0`
  `dcgmlib/dcgm_fields.h`; dcgm-exporter `4.8.4` `etc/default-counters.csv`, `etc/dcp-metrics-included.csv`;
  HolisticTraceAnalysis `v0.6.1`; aws-neuron-sdk 10832bbc (`nrt-env-var-reference.rst`, `nrt-troubleshoot.rst`,
  `tools/neuron-sys-tools/nccom-test.rst`, `training/torchtitan/get-started/setup-torchtitan-neuron.rst`);
  awsome-distributed-ai 3a100257 (HyperPod base-config `config.py`, `observability/install_observability.py`,
  `install_dcgm_exporter.sh`, `otel_config/config-head-template.yaml`, `config-compute-template.yaml`,
  `dcgm-metrics-basic.csv`, nccl-tests and gpu-cluster-healthcheck READMEs, top README); nccl-tests `v2.21.1`
  `doc/PERFORMANCE.md`; aws-ofi-nccl `v1.21.1`; libfabric `v2.6.0`; metaseq f7ffa5fd (27% and 56% updates);
  deep-learning-containers at DLC_SHA; NeMo `v2.7.3` Auto Configurator README.
- arXiv at the versioned ids: 2501.00656v3 (OLMo 2, Sec 3), 2204.02311v5 (PaLM 5.1), 2205.01068v4 (OPT 2.5),
  2407.21783v3 (Llama 3, 3.3.4, 3.4.1, Table 4), 2412.19437v2 (DeepSeek-V3), 2402.15627v1 (MegaScale 3.6, 5.2,
  6.3), 2410.21680v2 (Revisiting Reliability), 2505.05713v2 (Stragglers). Venues: PaLM JMLR 24(240):1-113, 2023
  (jmlr.org/papers/v24/22-1144.html); OLMo 2 "preprint; shorter version at COLM 2025" (arXiv comment and the
  COLM 2025 accepted-papers page); Stragglers OSDI 2025 (USENIX technical sessions page).
- Vendor pages fetched 2026-10-31: NVIDIA Xid catalog (last updated Sep 09, 2026), DCGM User Guide (feature
  overview), H100 product page, NCCL RAS and env pages (unversioned and nccl_2323 identical), Nsight Systems
  User Guide; AWS: EKS Best Practices AI/ML observability, Container Insights enhanced observability for EKS,
  HyperPod observability add-on, cluster metrics, alerts, Slurm exporter install, training operator and its usage
  page, HyperPod Slurm and EKS deep health checks, HyperPod Slurm and EKS AMI release notes, EKS accelerated AMI
  page and amazon-eks-ami v20261031 release, PCS-ready DLAMI, DLAMI 20261027 notes, checkpointless release notes,
  SMP release notes, DLC v2.16 release, SageMaker CloudWatch metrics, define-train-metrics, Debugger and Profiler
  availability pages, EC2 On-Demand quotas, Capacity Blocks guide, SageMaker training plans.
- Every derived number recomputed by bundling `src/lib/runtime.ts` and `presets.ts` with esbuild and running
  them under node: peak 989.5 TFLOPS, 8B 6N 8,214.76 tokens/s (4,000 reads as 19.48% MFU), 70B 934.99, TorchTitan
  count 8B at 8,192 tokens 6,834.2 (23.41%), 70B 822.1, 8B at 2,048 tokens 8,203, count gap 20.2%; 600 s + 60 s =
  11 min; heartbeat 8 to 16 min detect, 16 to 24.5 min kill; 784 and 1,936 FSDP collectives, 2.55 and 1.03 steps;
  3.1 h between Llama 3 interruptions, 11 min about 6%; p5 450 GB/s NVLink and 50 GB/s EFA per rank, 400 GB/s per
  instance; sample 66,132 us, 259.78 GB/s per instance, 65%, 43 ms floor; A4 5 h x $66.048 = $330; 800/64 =
  12.5 points. Every one matches what the page prints.

Every-group items: section 31 prices the cross-instance collective per instance (`algbw x 2(M-1)/M` against
400 GB/s), consistent with the build-log rule. No text in the three files mentions ZeRO-2 under accumulation or
TorchTitan's compiled SwiGLU. The Xid rule in sections 29, 30 and 31 is the section 29 bucket rule (immediate
bucket RESET_GPU, RESTART_BM or WORKFLOW_*). Pinned Llama 3.1 and FSx URLs untouched.

## WhatToMeasure.tsx (section 29, What to Measure in a Run)

84 claim lines plus every derived number checked. Non-CONFIRMED: WRONG 2, OVERREACH 2, STALE 1.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | OLMo 2's gradient-norm spikes came more often than loss spikes ... "together they led to divergence" | WhatToMeasure.tsx:882-887 | WRONG (attribution and tense) | OLMo 2 Sec 3: the observations are of OLMo-0424, and the authors write that these "would lead to divergence" at larger scale | re-expressed: "In the training of OLMo-0424, the model before OLMo 2 ... the OLMo 2 authors write that together these would lead to divergence at larger scale" |
| 2 | PaLM Cite venue "preprint" | :905 | WRONG (venue) | jmlr.org/papers/v24/22-1144.html: JMLR 24(240):1-113, 2023 | `venue="JMLR 2023"`; claims line updated |
| 3 | Xid table range "any bucket beyond RESTART_APP or IGNORE takes the node out" | :564 | OVERREACH | Xid catalog: WORKFLOW_XID_45 resolves to RESTART_FM alone or IGNORE; WORKFLOW_NVLINK_ERR treats bits 0, 23 and 30 as ignorable | "RESET_GPU or RESTART_BM takes the node out; a WORKFLOW_ bucket sends you to that Xid's workflow in the catalog (our reading)" |
| 4 | NVLink CRC, replay, recovery error totals are fields 409, 419, 429, 439 (read as the H100 counters) | :1157-1175, table :579 | OVERREACH (GPU generation) | dcgm-exporter 4.8.4 default-counters.csv L66-L75 lists those four "for pre-Hopper GPUs" and the Hopper data-link counters 497, 498, 499 (dcgm_fields.h L1718-L1731) | sentence and table row add the Hopper fields with both cites |
| 5 | Power and thermal violation time, fields 240 and 241 | :1124-1128, table | STALE | dcgm_fields.h v4.7.0 L3644-L3652 marks both deprecated for 1617 and 1618, counted in seconds | clause added with the cite; table row "(240, 241; deprecated for 1617, 1618)" |

Acronym order (standard, not verdicts): DCGM appeared in the h1 description before its expansion, now expanded
there (:704); SM appeared in the three-layer diagram before its expansion, now expanded in the paragraph above
the diagram (:734) and left plain at its later use.

Confirmed among the rest: TorchTitan tokens per second and MFU formula, 989 TFLOPS H100 BF16 constant, MFU
dropped under quantized recipes, the logged norm being the pre-clip total against a docstring that says after,
the MIN-reduced finite check and its assertion text, data-loading share; Megatron Core NaN check default, rerun
state machine diagnostics, exit codes 16 and 17 and its alpha disclaimer, `log_straggler` off; PyTorch allocator
peaks; DCGM 1002, 1004, 1011, 1012, 112 and the v4.7.0 renames; DCGM guide 0.8 and 0.5 thresholds; EKS guide
(GPU utilization meaning, 0.8, 20% data loading); every Xid table bucket; Llama 3 (MFU 38% to 43%, 1% to 2%
diurnal, few spikes), MegaScale 6.3, PaLM 5.1, OPT 2.5 and 56% update, DeepSeek-V3. Score 9: five fixes, none
to the section's argument; the Xid alert rule literally includes Xid 45 (below, unresolved).

## Telemetry.tsx (section 30, The Telemetry Stack on AWS)

68 claim lines plus every derived number checked. Non-CONFIRMED: WRONG 5, UNSUPPORTED 2, OVERREACH 6.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | "other backends wait 30" cited to ProcessGroupNCCL.hpp L164-L165 | Telemetry.tsx:836 | UNSUPPORTED (cite) | the hpp lines define the NCCL default only; distributed_c10d.py L2515-L2519: "10 minutes for NCCL and 30 minutes for other backends" | second Cite added |
| 2 | "ByteDance raised MegaScale's NCCL timeout after network interfaces that went down for several seconds failed jobs", after the `init_process_group` advice | :879-885 | OVERREACH | MegaScale 6.3: the timeout is NCCL's own (3.6: retransmit timer and retry count), its default "will make NCCL timeout very quickly and return a completion error"; the symptom was "training stall or training speed drop" | re-expressed as NCCL's transport timeout, separate from the PyTorch one |
| 3 | "The PyTorch timeout is the floor that holds on every path" | :890-899 | OVERREACH | TorchTitan v0.4.0 configs.py L129-L145 (300 s init, 100 s train), trainer.py L496-L504 applies 100 s after the first step | replaced with a sentence stating TorchTitan's two timeouts, with code cites, and "read the timeout your framework sets" |
| 4 | "TorchTitan v0.4.0 writes into its `dump_folder`" | :1069-1078 | OVERREACH (imprecise; buffer size implied as PyTorch's) | distributed/utils.py L471-L491 sets TORCH_FR_BUFFER_SIZE=20000, DUMP_ON_TIMEOUT=1 and TORCH_FR_DUMP_TEMP_FILE=`<dump_folder>/comm_traces/rank_` | "keeps 20,000 entries and points the dumps at `comm_traces/rank_` under its `dump_folder`", code cite added |
| 5 | TEARDOWN_ON_TIMEOUT default cited to ProcessGroupNCCL.cpp L2122 | :988 | WRONG (line) | L2122 is RETHROW_CUDA_ERRORS; TEARDOWN_ON_TIMEOUT is L2123 | L2122-L2123 |
| 6 | Flight-recorder entry fields cited L116-L167 | :1007 | WRONG (line) | `sizes_` is at L170 | L116-L170 |
| 7 | "If the reference rank is itself the culprit, the tool lists many healthy ranks" | :1123 | OVERREACH (a TODO comment stated as documented behaviour) | utils.py L461-L464 is a code comment with a TODO | "A comment in the matcher warns that ..." |
| 8 | HyperPod Slurm: "a Slurm exporter and Prometheus on the head node"; diagram "Prometheus on the head node" | :1318-1335, diagram :513, :521 | WRONG at the pinned commit (doc-code conflict) | install_observability.py L45-L84 installs node and Slurm exporters plus an OpenTelemetry collector on the controller, node, DCGM and EFA exporters plus a collector on compute; config-head-template.yaml L27-L44 remote-writes to Amazon Managed Service for Prometheus | doc Cite marked `doc-code-conflict`, code sentence with two code Cites, diagram cells "OpenTelemetry collector on each node" |
| 9 | SageMaker training-job GPU metrics have "a `Normalized` variant"; one idle host moves the "averaged normalized value" about 1.6 points | :1357-1366 | WRONG | SageMaker CloudWatch page: the Normalized metrics are "provided only for endpoints that host active inference components"; job metrics are summed, 0 to 800% on eight GPUs | variant removed; 1/64 of the 0-800% range, 12.5 points, our arithmetic |
| 10 | A4 cost "plus $0.10 per hour for EKS and EBS storage" | :1305-1313 | WRONG (prose: the $0.10 is the control plane only) and UNSUPPORTED (the $0.10 had no cite) | RESEARCH-GUIDE A4 and the AmazonEKS price list (EKS_FEES source) | "plus the EKS control plane at $0.10 per hour and EBS (Amazon Elastic Block Store) storage", EKS price-list Cite added |
| 11 | Container Insights "Metrics are collected and ingested every 60 seconds"; diagram "CloudWatch, every 60 s by default" | :1223, diagram :484, :490 | OVERREACH (page scope) | page: "By default, GPU metrics are collected and ingested at 60-second intervals" | "GPU metrics ..." in prose and both diagram layouts |
| 12 | A4 prediction: all four series present with advanced metrics on | :1294-1300 | OVERREACH (H100) | dcp-metrics-included.csv L57-L65 lists the NVLink recovery field among the pre-Hopper counters | hedge added: the NVLink series is the least certain, with the cite; alias hedge kept |

Acronym order (standard): Xid now defined at its first use (:1121), SM and ECC expanded in the GPU-counters h2
description (:1153), EKS expanded before the map diagram (:1213), EBS expanded in the A4 cost line.

Known items: FlightRecorder v2.10.0 (L106-L107, default 0) and v2.11.0 (L109-L110, default 2000) dating
confirmed; the NVLink alert field is a deprecated v4.7.0 alias (L4107), hedge kept. Confirmed among the rest:
every PyTorch default in the defaults list, the 600 s + 60 s teardown, heartbeat windows, the dump paths and
the tutorial's conflict with the code, torchfrtrace, E3 counts, NCCL RAS, HyperPod add-on defaults and preset
alerts, lifecycle switches and basic counter file, HTA, NCCL debug variables, Nsight, Neuron runtime timeout and
dumps. Score 8: thirteen fixes, two of them a doc-code conflict and a non-existent metric variant.

## BringUp.tsx (section 31, Bring-Up: From One Node to the Full Run)

67 claim lines plus every derived number checked. Non-CONFIRMED: OVERREACH 1.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | "no first-party MFU for dense Llama-class training on H200 or Trainium2 was located" | BringUp.tsx:826-833 | OVERREACH (scope) | Neuron 2.33 setup-torchtitan-neuron.rst L60-L84: one sample step line, `mfu: 16.54%`, Qwen3-8B install check on trn2.48xlarge, "values will vary" | "No first-party MFU benchmark ... was located; for Trainium2, ... prints one sample step line ... 16.54% MFU ... values will vary", Cite added, pointer to section 27 |

Standard fixes: NCCL and EFA appeared in the ladder diagram before their expansions, now expanded in the opening
paragraph (:396) and plain later; "AL2023" is now "Amazon Linux 2023" (:571); `algbw` is defined at first use
with PERFORMANCE.md L16-L20 (:641); "NCCOM tests" now follows a definition of nccom-test from the Neuron SDK
2.33 user guide L14 (:691). No first-party letter expansion of NCCOM was located (nccom-test.rst, the HyperPod
EKS deep-check page); the glossary was not edited.

Known items: section 31's versions agree with section 7 (same AWS sample, labelled vendor) and section 27; every
NEW claim in bring-up.md was opened at its source. Confirmed among the rest: On-Demand P and Trn quota default 0,
Capacity Blocks and training plans eight weeks ahead, OPT 27% update, HyperPod deep-check timings and triggers,
the healthcheck README's two sets, Revisiting Reliability (40 nodes, 14% to 4%, HPCA 2025), every version in the
per-path list, the p5 sample arithmetic, TorchTitan fake mode and quick start, the Stragglers 10.4% (OSDI
2025). Score 9.

## Unresolved, for the orchestrator

1. NCCOM has no first-party letter expansion in the sources read; the glossary entry needs a decision.
2. Section 29's Xid rule literally includes Xid 45 (immediate WORKFLOW_XID_45; the catalog calls it often a
   Ctrl-C or sigkill, not a bug). The rule is kept; an alert on it will be noisy.
3. `Arithmetic.tsx` (section 4, fc02's file) still says no first-party MFU for Trainium2 was located, without the
   "benchmark" scope.
4. The Telemetry map's "Training process, on every path" row shows PyTorch's 10-minute timeout and 2,000
   entries; TorchTitan v0.4.0 changes both. The prose now says so; the diagram row was left as PyTorch's defaults.
