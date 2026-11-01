# LLM Training Systems: Research Guide

How the research for this dive continues from here: the waves and the questions each one answers, the order in which to read the primary sources, the evidence bar per kind of claim, the open questions, the Tier 0 experiments, and the gates before any app code is written.

Companion to `SCOPE.md`. Bracketed IDs such as (T02-47) point to claim-register entries in `research/2026-10/`. Wave 1 sources were accessed 2026-10-30; wave 2 re-read every source it cites on 2026-10-31, and the Tier 0 experiments ran on 2026-10-31.

---

## 1. Where the research stands

Wave 1 produced seven claim registers, each with a header of pinned sources, numbered entries (claim, location, verdict, evidence with tier and evidence kind and a verbatim quote, use in dive), worked numbers, mental models, contradictions, an UNKNOWN register, a reading path and a tiered source list. The shared method is in `research/2026-10/wave1-brief.md`; `00-orchestrator-notes.md` holds the one fact fetched during synthesis (FSx for Lustre storage rates).

| File | Area | Entries | Contradictions | UNKNOWNs |
|---|---|---|---|---|
| `01-training-step-maths.md` | The step, 6ND and its corrections, MFU and dense peaks, the memory budget with Llama-specific activation coefficients, mixed precision from FP16 to NVFP4, recomputation, batch size, scaling laws as far as they set hours | 63 | 7 | 13 |
| `02-parallelism.md` | DP, ZeRO, FSDP, HSDP, TP, SP, CP, PP schedules and bubbles, EP, published layouts, sizing tools, collective costs, the assembled 12-step procedure with two worked examples | 72 | 11 | 14 |
| `03-frameworks.md` | PyTorch v2.15.0 distributed, TorchTitan v0.4.0, TorchTitan Neuron, Megatron Core core_v0.20.0 and Megatron Bridge v0.7.0, NeMo's restructuring, DeepSpeed v0.19.9, Accelerate and the Trainer, fine-tuning and post-training frameworks as systems | 53 | 10 | 9 |
| `04-reliability-checkpointing-data.md` | First-party failure statistics, MTTF against node count, ETTR and the Young-Daly interval, checkpoint contents and bytes, DCP and async save from code, tiered and in-memory designs, restart, determinism, stragglers, data-loading arithmetic | 52 | 6 | 12 |
| `05-aws-infrastructure.md` | Training instances with per-accelerator figures, vendor peaks, dated EC2, Capacity Block and SageMaker rates, capacity paths and their limits, placement, storage, images | 48 | 7 | 8 |
| `06-aws-orchestration.md` | Self-managed EC2 and EKS, SageMaker training jobs, HyperPod Slurm and EKS, PCS, Batch, Trainium on each path, the ownership matrix and fee arithmetic | 53 | 8 | 13 |
| `07-observability.md` | What to measure in a run (TorchTitan's metric set, MFU, memory, gradient norm as the leading indicator), hang detection in PyTorch v2.15.0 (collective timeout, heartbeat, flight recorder, `torchfrtrace`), NCCL RAS, DCGM fields and dcgm-exporter defaults, the Xid catalog, loss-spike handling in published runs, and the AWS telemetry layer per path | 41 | 8 | 8 |

Tiers used throughout. Tier 0: our experiments (E1 to E4 on the DGX Spark, 2026-10-31; section 5). Tier 1: source code at a pinned tag or 40-character SHA, official framework documentation, first-party AWS and NVIDIA documentation, spec sheets and price files (a spec sheet's peak FLOPS is a vendor specification and is labelled so). Tier 2: first-party lab or vendor posts and talks. Tier 3: papers, peer-reviewed with venue or preprint, and third-party technical analysis (the Ultra-Scale Playbook is Tier 3). Tier 4: tutorials, summaries and press, used only to locate primary sources. Code is the authority over documentation, documentation over blogs.

What wave 1 settled that the scope builds on:
- The two bills reproduce published arithmetic exactly: Llama 3.1's parameter counts with a 128,256-entry vocabulary (01 W1, C01-1), 6ND against Llama 3 405B's 3.8e25 budget (01 W7), PaLM's MFU and Megatron-LM's 34-day GPT-3 estimate (01 W9).
- The parallelism procedure has a source for every step, and its worked examples reproduce one published layout (TorchTitan's TP 8 x FSDP 32 for 70B) and check another (Megatron Bridge's 70B recipe) (02 section 3.5, T02-50, T03-24).
- Three defaults that change a reader's numbers, each read in code: FSDP2 communicates on every accumulation micro-batch (T03-2), `async_save` called bare stages synchronously into pageable memory (T04-21), Megatron's `--async-save` is turned off, with only a rank-0 warning, without a second flag (T04-38).
- Four documentation errors or drifts the page must handle: Megatron's MoE GPU-count formula (T02-72), the EC2 page's 512 GiB per Trainium2 chip (C05-1), the HyperPod Trainium tutorial calling a removed script (C06-4), and AWS's tiered-checkpointing example against PyTorch's CPU-backend check (C04-3, a code reading, untested).
- The AWS cost structure: SageMaker training jobs at 1.15 times EC2, HyperPod at 1.20 times on P5 and P6, training plans at 1.15 times the Capacity Block rate, Capacity Blocks at or below On-Demand (T05-22 to T05-24), plus path fees (T06-36, T06-40, T06-41).

---

## 2. Research waves

Each wave lists the questions it must answer and what counts as done. A wave is done when every question has a register entry with a verdict, including UNKNOWN with a stated reason.

### Wave 1. Breadth from primary sources (complete, 2026-10-30)

Seven areas, at most three agents at a time, each writing one register (table above). Every arXiv URL carries its version, every code citation a tag and 40-character SHA, every AWS fact a first-party page.

### Wave 2. Refutation and gap fill (complete, 2026-10-31)

**Result.** Six agents, at most three at a time, under the shared brief `research/2026-10/wave2-brief.md`. Every WRONG row is fixed in `SCOPE.md` and every SCOPE NARROWER row carries its replacement text (commits 742549c for W1 to W3, and the Gate 1 commit for W4 to W6). Where a verdict file and a register disagree, the verdict file governs; the registers keep their wave 1 text and the authoring brief points authors at both.

| Agent | File | Slice | Rows | HOLDS | SCOPE NARROWER | WRONG | UNVERIFIABLE | Fetches (of 70) |
|---|---|---|---|---|---|---|---|---|
| W1 | `wave2-step-maths.md` | Thesis arithmetic and sections 3 to 6 | 56 | 40 | 15 | 1 | 0 | 43 |
| W2 | `wave2-parallelism.md` | Sections 7 to 14 | 59 | 46 | 12 | 1 | 0 | 47 |
| W3 | `wave2-frameworks.md` | Sections 15, 16 and 27 | 45 | 34 | 9 | 2 | 0 | 64 |
| W4 | `wave2-reliability.md` | Sections 17 to 19 and 23 | 41 | 29 | 8 | 4 | 0 | 49 |
| W5 | `wave2-aws.md` | Sections 20 to 22, 24 to 26 and 28 | 61 | 55 | 5 | 1 | 0 | 68 |
| W6 | `wave2-observability.md` | Sections 29 to 31 | 35 | 27 | 8 | 0 | 0 | 58 |
| Total | | | 297 | 231 | 57 | 9 | 0 | 329 |

The questions below are the brief wave 2 ran against; the answers are in the verdict files and in section 6.

**Purpose.** Gate 1 checks 2 and 3. Every number in the scope's thesis and section paragraphs gets a verdict against its primary source at the pinned version (HOLDS, SCOPE NARROWER, WRONG, UNVERIFIABLE), and the open questions marked "wave 2" in section 6 are closed or re-triaged. Shape and output format as the RL dive's wave 2 (`deep-dives/rl-agentic-loops/research/2026-10/wave2-brief.md`); output files `research/2026-10/wave2-*.md`.

**Agents.** Six, at most three at a time, each owning a slice of the scope and the wave 2 questions that touch it:
1. Sections 3 to 6 and the thesis's arithmetic (registers 01): recompute every [derived] figure; close U01-6, U01-7, U01-12.
2. Sections 7 to 14 (register 02): recompute both worked examples; close U02-1, U02-2, U02-5, U02-13, U02-14.
3. Sections 15, 16 and 27 (register 03): close U03-3, U03-6, U03-7; re-check every maturity label against the tag.
4. Sections 17 to 19 and 23 (register 04): close U04-1, U04-4 (read the `amzn-sagemaker-checkpointing` 1.1.3 wheel), U04-5 (NCCL determinism documentation), U04-7, U04-8, U04-11.
5. Sections 20 to 22 and 24 to 26 and 28 (registers 05 and 06): re-read every price and status line on its page; close U05-3, U05-4, U06-1, U06-3, U06-4, U06-7, U06-8, U06-10 to U06-12.
6. Sections 29 to 31 (register 07): close U07-3 (documentation half), U07-4, U07-5, U07-6, U07-8; re-read the PyTorch defaults of T07-5 to T07-11 against the tag the dive pins at build time.

**Specific questions beyond the UNKNOWN register.**
- Does any first-party source publish achieved MFU for dense Llama-class training on B200, H200 or Trainium2 (MLPerf Training results, NVIDIA or AWS performance pages)? The scope uses 40% as a labelled assumption everywhere (U01-5).
- Is there a peer-reviewed parallelism planner or simulator whose inputs and outputs match Calculator C closely enough to cite as a cross-check (U02-14)?
- What does each AWS path document about NCCL and EFA versions it pins, so section 31's bring-up can name them (T05-43 to T05-45 cover the images; the managed paths are not read)?
- From the adversarial reviews (`reviews/2026-10/`): which frameworks support uneven first and last pipeline stages, under which settings, and how DeepSeek-V3 split 61 layers across 16 stages (R3 finding 2; section 10, step 5 of section 14); whether launchers other than Megatron Core number ranks so consecutive ranks share an instance (R1 finding 1; section 7); an independent recomputation of section 14's second worked example, Llama 3.1 70B on four p5en.48xlarge, which the R3 reviewer derived (about 85 GB per GPU at TP 8 x DP 4 with ZeRO-1); and a factual re-check of SCOPE v2's changed sentences, which no reviewer has read since the fixes were applied.

**Done when.** Every scope number has a row; every WRONG item is fixed in `SCOPE.md`; every SCOPE NARROWER item is re-hedged with the replacement text; every wave 2 UNKNOWN is closed or moved to accept-as-hedge with its hedge text.

### Wave 3. Tier 0 experiments (DGX Spark group complete, 2026-10-31)

E1 to E4 ran on the DGX Spark on 2026-10-31 (section 5, results table); E5 did not run, because its predicted peak did not fit the memory the live host could spare. A0 to A5 are on hold by Carlos's decision of 2026-10-31 until an AWS account is set up for them; no distributed experiment of any kind ran. Sections that depend on an AWS experiment keep their hedge and ship the experiment as a protocol marked "not yet run".

### Wave 4. Pre-build design (complete, 2026-10-31)

Calculator specifications (inputs, formulas with entry IDs, presets, validation against the worked numbers in the registers and the wave 2 corrections) in `revamp/calculators-spec.md`; the authoring brief every section agent follows in `revamp/authoring-brief.md`; the dispatch order, file names, ids and ports in `revamp/dispatch.md`. The diagram for each section is named in its `SCOPE.md` block and built to the repo's inline SVG contract. The glossary is assembled from the sections as they land. Then Gate 1.

---

## 3. Reading path for Carlos

Read in this order. Each item says what it gives and which sections it feeds. arXiv versions are the pinned ones.

1. **Llama 3, "The Llama 3 Herd of Models", 2407.21783v3, Section 3.3 (infrastructure, scaling and efficiency).** The whole dive in twenty pages from one frontier run: the 4D layout and why it is nested that way (T02-46, T02-47), the batch schedule (T01-8), MFU at three scales (T01-6), the interruption table and the 90% effective training time (T04-1, T04-2). Read it first and every later source fills in one paragraph of it. Feeds sections 1, 4, 10, 13, 17.
2. **PaLM, 2204.02311v5, Appendix B.** The MFU definition and why it beats HFU as a comparison, read early because item 1 reports MFU at three scales (T01-18 to T01-20). Short. Feeds sections 4 and 29.
3. **nccl-tests `doc/PERFORMANCE.md` at its pinned tag.** Algorithm against bus bandwidth and the 2(n-1)/n factor, the one page needed to read any collective benchmark, read before the papers that price their collectives with it (T02-60, T02-61). Feeds sections 7 and 31.
4. **ZeRO, 1910.02054v3, Sections 3 and 5.** Where the 16 bytes per parameter come from and how each stage removes a slice of them at what communication cost (T01-9, T02-6, T02-7). Feeds sections 5 and 8.
5. **Megatron-LM PTD-P, 2104.04473v5, Sections 2 and 3.** Tensor and pipeline parallelism, the bubble, the interleaved schedule and the three takeaways that become steps 4 and 5 of the procedure (T02-13, T02-14, T02-28, T02-30, T02-43). Feeds sections 9, 10, 13, 14.
6. **Korthikanti et al., "Reducing Activation Recomputation", 2205.05198v1, Sections 3 and 4.** The activation-memory formula, sequence parallelism and selective recomputation (T01-31 to T01-34, T02-16 to T02-18). Read with register 01's W3, which adapts the formula to Llama's layer. Feeds sections 5 and 9.
7. **PyTorch FSDP, 2304.11277v2, Sections 3 and 4.** Sharding factor, hybrid sharding and why smaller all-reduces behave better (T02-8 to T02-10). Then PyTorch v2.15.0's `fully_shard` docstring for what the defaults do today (T03-1 to T03-4). Feeds sections 8.
8. **TorchTitan, 2410.06511v3 (ICLR 2025), and the v0.4.0 repository's benchmark document.** How the four dimensions compose on one device mesh in PyTorch-native code, with measured memory and throughput (T02-49, T02-50, T03-10 to T03-14; the paper and repository numbers differ, C02-3). Feeds sections 13, 14, 15.
9. **DeepSeek-V3, 2412.19437v2, Section 3 (infrastructure).** FP8 training with fine-grained scales, DualPipe, node-limited expert routing and a layout with no tensor parallelism (T01-46, T01-47, T02-34, T02-39, T02-40). Read after Megatron PTD-P, because it departs from Megatron's takeaways for reasons it states. Feeds sections 6, 10, 12.
10. **Meta, "Revisiting Reliability in Large-Scale Machine Learning Research Clusters", 2410.21680v2.** The failure-rate model, ETTR and the checkpoint interval formula (T04-7 to T04-12). Feeds sections 17 and 18.
11. **MegaScale, 2402.15627v1.** A production team's view of MFU, stragglers, fault detection and two-stage checkpointing at more than 10,000 GPUs (T01-24, T04-13 to T04-16). Feeds sections 17 to 19 and 29.
12. **TorchTitan `torchtitan/observability/metrics.py` and PyTorch `ProcessGroupNCCL.hpp` lines 60 to 165, both at their pinned tags (v0.4.0 and v2.15.0).** What a modern trainer logs every step and how tokens per second and MFU are computed, then the hang machinery read in code because the tutorial's defaults are stale (T07-1, T07-2, T07-5, T07-7, T07-8, T07-12); register 07 section 7 continues the path. Feeds sections 29 and 30.
13. **AWS: the SageMaker HyperPod resiliency pages, the PCS user guide's cluster and pricing pages, the EKS AI/ML pages, and the EC2 Capacity Blocks pages.** In that order, with register 06's ownership matrix open beside them (T06-4 to T06-7, T06-31 to T06-37, T06-41 to T06-47, T05-26, T05-27). Feeds sections 20 to 28.

Optional, for depth: Kaplan et al. 2001.08361v1 (where 6N per token comes from, section 3); GPipe 1811.06965v5 and Zero Bubble 2401.10241v1 (pipeline schedules); Ring Attention 2310.01889v4 and DeepSpeed-Ulysses 2309.14509v2 (context parallelism); the FP8 formats paper 2209.05433v2 and NVIDIA's NVFP4 pretraining paper 2509.25149v2 (precision); the ByteDance straggler study 2505.05713v2 (stragglers).

---

## 4. Evidence bar per claim type

| Claim type | Minimum evidence | What the page must say with it |
|---|---|---|
| Formula (FLOPs, memory, bytes per collective, bubble) | The paper that introduced it at a pinned arXiv version, with the equation or table | The model shape it assumes (GPT-style 4h MLP, full multi-head attention) and any adaptation, labelled [derived] or [our reading] (01 W3 is the model) |
| Worked number | Every input cited by entry ID; the arithmetic shown in the register | [derived]; the assumptions (MFU 40%, micro-batch, sequence length, attention kernel) next to the number |
| Framework default or behaviour | Source code at a release tag or 40-character SHA, file and line | The tag, because defaults move between releases (T03-4, T03-13, T04-38) |
| Framework maturity | The project's own words at the tag | The label verbatim (alpha, experimental, prototype, beta, end-of-support) |
| Published layout or MFU | The paper or repository document at a pinned version | Model, accelerator, GPU count, sequence length and batch; which document when paper and repository disagree (C02-3) |
| Failure rate, goodput | A first-party operator report with its conditions | Job size, window and counting rule; vendor percentages labelled and kept apart from operator reports (C04-5) |
| AWS fact (feature, limit, status) | docs.aws.amazon.com or an AWS product page (Tier 1); What's New for dates | The date; "preview" or "beta" labels; contradictions between AWS pages named (C05-1, C06-1) |
| AWS price | The AWS Price List offer file with its version, or the AWS pricing page | Region, date and offer version; a Capacity Block's binding price is the one quoted at purchase (C05-7) |
| Peak FLOPS | The vendor's spec sheet | "Vendor specification"; dense or sparse stated, and the dense figure used for MFU (T01-27) |
| Mental model that synthesises several sources | Two or more register entries that support it | Labelled [our reading] when no single source states it |
| Tier 0 result | A logged experiment in `research/` with configs, versions, seeds and raw outputs | Hardware, software versions and number of runs; a single run labelled as such |

Preserve the scope of every hedge. "Not located during this research" never becomes "does not exist".

---

## 5. Tier 0 experiments

### Hardware this plan may assume

- **NVIDIA DGX Spark**, one GB10 superchip: 128 GB of coherent unified LPDDR5X at 273 GB/s (NVIDIA product page and hardware guide, recorded in `deep-dives/silicon-memory-inference/research/dgx-spark-tier1-research.md`); NVIDIA publishes only a sparse FP4 peak (1 PFLOP), no dense BF16 figure (same file). The RL dive's E0 run (`deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke.md`) found vLLM reporting 121.69 GiB of device memory and other services holding about 70 GiB: the Spark is a live shared host with about 52 GiB free, so every experiment below is sized to fit in 40 GiB. On 2026-10-31 the first preflight showed 121 GB total, 68 GB used and 52 GB available; the job's rule kept each experiment's own peak at least 15 GB below available memory, so about 37 GB was the ceiling. One device: single-device memory and step-time experiments only, no multi-GPU collectives.
- **NVIDIA Jetson Orin Nano 8 GB** (`.../jetson-orin-nano-tier1-research.md`): 8 GB LPDDR5 at 68 to 102 GB/s. Too small for any model state worth measuring; not used.
- Software: the RL dive's E0 ran torch 2.13.0+cu130 on aarch64. The registers pin PyTorch v2.15.0; each experiment records the version it actually ran and says so where it differs.

### Group (a): on the DGX Spark (no AWS account, no spend)

**E1. Activation memory per layer: formula against measurement.** Closes U01-11 and U02-12; narrows U02-8. Build k decoder layers of Llama 3.1 8B's shape (h 4,096, FFN 14,336, 32 heads, 8 KV heads, T01-1) with random BF16 weights (no gated download), and run forward plus backward at sequence 2,048, 4,096 and 8,192, micro-batch 1 and 2, with PyTorch's fused SDPA attention, with and without full activation checkpointing. Record `torch.cuda.max_memory_allocated` minus weights, gradients and optimizer state, per layer. Add the output head with V = 128,256 and FP32 logits for the logits term (T01-35). Prediction: within 10% of 34.0 sbh per layer without checkpointing and about 2sbh per layer with it (01 W3, W4); logits 4.2 GB per 8K sequence. Memory: 4 layers of 218M parameters at 16 bytes is about 14 GB plus 4.6 GB of activations at 8K. Runtime under an hour. Feeds sections 5 and 14 (Calculator B's coefficient). Teardown: delete the virtual environment and outputs; nothing persists.

**E2. Step time, the price of recomputation, and an honest MFU on one device.** Feeds sections 4 and 5; tests T01-34 and T01-36 on current kernels. Train a model of Llama 3.2 1B's shape from random initialisation for 50 steps at sequence 2,048 with AdamW in BF16 mixed precision (model state about 20 GB at 16 bytes per parameter); measure tokens per second; compute model FLOPs as 6N_mm plus the attention term (01 W6). Because GB10 has no published dense BF16 peak, measure a BF16 GEMM ceiling with a matmul sweep and report MFU against it, labelled as a measured denominator. Repeat with full and with selective recomputation. Prediction: full recomputation adds 25% to 40% to step time (T01-34, T01-36). The result teaches the denominator problem of section 4 with the reader's own hardware.

**E3. FSDP2 collectives per step under gradient accumulation.** Closes U03-1; confirms T03-2 and T03-3 at the PyTorch version run. Two ranks on CPU with the gloo backend (no GPU needed; the Spark's CPU or any Linux host), a small transformer wrapped with `fully_shard`, 4 micro-batches per optimizer step. Count `all_gather_into_tensor` and `reduce_scatter_tensor` calls per step by wrapping the `torch.distributed` functions, for three settings: default; `set_requires_gradient_sync(False)` on micro-batches 1 to 3; and that plus `set_reshard_after_backward(False)`. Prediction: two all-gathers and one reduce-scatter per micro-batch per FSDP unit by default, and 03 W1's count with deferral. Fallback if FSDP2 refuses a CPU mesh: PyTorch's in-process fake process group, which runs world size above 1 in one process and lets the calls be counted. Feeds section 8's 373 GB against 156 GB.

**E4. Checkpoint staging: `dcp.save`, bare `async_save`, and `async_save` with a pinned stager.** Tests T04-21, C04-2 and C04-3; narrows U04-9. One rank with the process group `cpu:gloo,cuda:nccl`, a 4 GB state dict (one 70B rank's 3.86 GB share at 256 GPUs, 04 W2), saving to local NVMe. Measure the blocking time of each mode. Then create an NCCL-only process group and record whether `async_save` raises, which is the check behind C04-3. Caveat: GB10's unified memory makes pinned and pageable copies behave differently from a discrete H100 on PCIe, so the error check and the defaults transfer to AWS and the timings do not.

**E5 (stretch). One rank of the 70B layout under Megatron's fake process group.** Closes U02-8 for the exact layout and settles C02-5's flag spelling. Megatron-LM at core_v0.20.0 with `--fake-process-group` (the spelling the code defines) emulating rank 0 of TP 8 x PP 4 x DP 8 at 8,192 tokens and micro-batch 1; record peak memory against the formula's 38 GB (02 section 3.2). Needs Transformer Engine on aarch64 for GB10, not confirmed in this research; if the install fails, the failure is recorded and the measurement moves to A2.

### Results of group (a), 2026-10-31

Each experiment ran under the live-host rules of the job brief: a preflight of GPU processes and free memory before each run, one experiment at a time, `nice -n 10` and `timeout 2h`, available memory watched every 30 s, and everything (virtual environment, caches, outputs) inside one scratch directory that was removed at teardown. Every process present at the first preflight was still running at teardown. Software: PyTorch 2.15.0+cu132 (CUDA 13.2), Python 3.12.3, Ubuntu 24.04.4 on aarch64. Random weights only; no model was downloaded. Notes, scripts and raw JSON: `research/2026-10/E1-*.md` to `E4-*.md`, `spark-scripts/`, `spark-raw/`.

| Exp | Prediction | Measured | Verdict | Feeds |
|---|---|---|---|---|
| E1 activation memory | 34.0 sbh per layer within 10%, 2 sbh with full checkpointing, 4.2 GB FP32 logits per 8K sequence | 34.03 sbh with a fused SwiGLU, 41.03 sbh with TorchTitan's eager `F.silu(gate) * up`, 2.00 sbh with full checkpointing, the same across SDPA backends; logits 4.27 GB saved, with transient peaks of 8.5 GB in the forward pass and 11.6 GB in the backward pass at 8K | PASS, with two qualifications (the eager coefficient and the logits peak) | Section 5 and Calculator B (34 sbh default, 41 sbh option), section 14 |
| E2 step time and recomputation | Full recomputation adds 25% to 40% to step time | Llama 3.2 1B shape, s = 2,048, AdamW: measured BF16 GEMM ceiling 96.2 and 97.3 TFLOPS (two runs); step 2.181 and 2.235 s without recomputation, +16.3% and +14.2% with full, +11.3% and +8.0% with selective; MFU against the measured ceiling 29.0% and 27.9% without recomputation (6N only; 30.5% and 29.5% with causal attention FLOPs) | Prediction not met; SCOPE NARROWER: the page states the FLOP cost (about 33%), this measurement, and the papers' range as theirs | Sections 4 and 5 (the denominator lesson; the price of recomputation) |
| E3 FSDP2 collectives | Two all-gathers and one reduce-scatter per unit per micro-batch by default; k + 1 all-gathers under deferral | Default 36 all-gathers and 20 reduce-scatters per 4-micro-batch step for the test model; sync deferred 36 and 5; deferred with resharding after backward off 21 and 5; k + 1 = 5 per non-root unit; in torch 2.15 FSDP2 issues `all_gather_single` and `reduce_scatter_single` | PASS | Section 8 (373 GB against 156 GB), Calculator C, section 30 (flight-recorder coverage) |
| E4 checkpoint staging | Bare `async_save` blocks for the copy; an NCCL-only group is rejected | `dcp.save` 4.35, 2.54 and 2.60 s for a 4.03 GB state dict on the GPU; bare `async_save` blocked 35.86, 36.20 and 8.81 s; pinned stager in a thread blocked about 0.001 s; pinned, shared-memory stager in a separate process 0.039, 0.0006 and 0.0010 s; NCCL-only group: `AssertionError: A CPU backend must be enabled for async save` | T04-21, C04-2 and C04-3 confirmed; U04-9 narrowed (GB10 unified memory; H100 timing is A3's) | Section 18 and Calculator D |
| E5 Megatron fake process group | Rank 0 of TP 8 x PP 4 x DP 8 near 38 GB | Not run | Not run: the formula's 38 GB for one rank, plus allocator and workspace overhead, is above the 37 GB the live host allowed, and Transformer Engine on aarch64 was not confirmed | U02-8 stays narrowed by E1; the exact layout waits for A2 |

An unintended write outside the scratch directory happened once, before the run script set its environment: a package install and the first CUDA smoke test wrote a pip cache and one CUDA JIT cache entry under the account's home directory. Each path was identified by its creation time and removed; the run script then set `HOME`, `CUDA_CACHE_PATH`, `TMPDIR`, `XDG_CACHE_HOME`, `PIP_CACHE_DIR`, `HF_HOME`, `TORCHINDUCTOR_CACHE_DIR` and `TRITON_CACHE_DIR` inside the scratch directory for every later command.

### Group (b): small AWS experiments (ON HOLD, Carlos's decision of 2026-10-31)

None of A0 to A5 ran, including the read-only A0. They wait for an AWS account set up for this work. Each section that depends on one ships it as an expandable protocol marked "not yet run" and keeps its hedge.

Every experiment is one CloudFormation or CDK stack with its teardown built in: delete the stack, then verify with `describe-instances` filtered by the stack tag, `describe-file-systems` and an empty bucket, with an AWS Budgets alarm at 120% of the estimate. Prices are us-east-1 on 2026-10-30 unless stated. On-Demand quotas for P and Trn instances start at 0 vCPUs (T05-31), so a quota request or a Capacity Block comes first.

**A0. Read-only capacity checks.** Closes U05-7 and narrows U05-3: `describe-capacity-block-offerings` for p5e.48xlarge and trn2.48xlarge in us-east-1, `describe-instance-type-offerings` for the reference types. Cost: $0. Teardown: none.

**A1. Collective baselines on p5.** Closes U02-9, narrows U05-8 and U04-5. Two p5.48xlarge in a cluster placement group on the Deep Learning Base GPU AMI release 20261027 (T05-43). nccl-tests `all_reduce_perf`, `reduce_scatter_perf`, `all_gather_perf` and `alltoall_perf` at one node (NVLink) and two nodes (EFA), 8 B to 16 GB; record bus bandwidth and the EFA counters the EFA dive's Operations section names. Repeat one all-reduce size ten times and compare outputs bitwise (U04-5). About 2 hours. Feeds section 7's bandwidth figures and section 31's baseline.

**A2. FSDP layouts for the 8B model.** Puts numbers on section 8 and on U02-8 and U01-5 for H100. TorchTitan v0.4.0 on the same two instances: FSDP 8 on one node; flat FSDP 16 and HSDP (shard 8, replicate 2) on two; each with and without deferred gradient reduction; 8 micro-batches at 8,192 tokens. Record tokens per second, MFU against 989.5 TFLOPS, peak memory, and EFA bytes per step. Predictions from 02 section 3.3 and 03 W1. About 3 hours.

**A3. Checkpoint save paths.** Closes U04-8 and U04-9, tests T04-21 and T04-26. Same two instances, an EFA-enabled FSx for Lustre PERSISTENT-1000 file system of 4.8 TiB (T05-37) and an S3 bucket through s3torchconnector v1.5.0 (T04-25). `dcp.save`, bare `async_save` and pinned `async_save` of the 8B model state (112 GB at 14 bytes per parameter, 04 W2); record blocking time and throughput to each target. About 2 hours.

Cost of A1 to A3 in one 7-hour window [derived]: On-Demand 2 x 7 x $55.04 = $771 if quota and capacity allow (T05-20); otherwise a one-day Capacity Block for two instances, 2 x 24 x $47.757 = $2,292 (T05-22); plus FSx for 8 hours, about $32 to $35 (T00-1). The Capacity Block ends itself at 11:30 UTC (T05-27); the file system and bucket do not, which is what the stack deletion covers.

**A4. HyperPod EKS, smallest real run.** Tests T06-5, T06-6, T06-9, T06-12 and C06-2, closes U04-4 and U06-11. One HyperPod EKS cluster with one ml.p5.48xlarge: time the on-start deep health checks (documented at about 45 to 90 minutes for DCGM level 4, T06-5), install the HyperPod training operator, run one HyperPod recipe for Llama 3.1 8B fine-tuning at release 2.0.11 (T06-20), kill one training process to observe the in-place restart, configure a log-monitoring rule and stall the log to observe hang detection, and run AWS's managed tiered checkpointing example unmodified to settle C04-3. Cost [derived]: 5 hours at the HyperPod rate of $66.048 (T05-23) is $330, plus the EKS control plane at $0.10 per hour (T06-40) and EBS. Teardown: delete the HyperPod cluster, then the EKS cluster, then verify with `list-clusters`.

**A5. Trainium, smallest real run.** Narrows U03-4 and U01-5 for Trainium2. A SageMaker training job on one ml.trn2.48xlarge in us-east-2 running TorchTitan Neuron 0.2.2+neuron.1's validated Llama3-8B layout (TP 4 x FSDP 16, 64 ranks, T03-38) for 200 steps; record tokens per second and MFU against 667 TFLOPS per chip (T05-17). Cost [derived]: 3 hours at $97.52 (T05-23) is $293. Teardown: the job ends itself; set the warm-pool keep-alive to 0 so no instance is kept (T06-26).

Total for group (b) [derived]: about $1,400 on the On-Demand path, about $2,950 if A1 to A3 need a Capacity Block.

### Which sections depend on which experiment

No section is conditional on an experiment: every section stands on wave 1 and wave 2 evidence with its hedges, and E1 to E4 now add measured results to sections 4, 5, 8, 18 and 30. E1, E2 and A2 would replace "formula totals are lower bounds" (sections 5 and 14) with measured ratios; A1 would replace link peaks with measured bus bandwidth (sections 7 and 31); E4 and A3 would replace the code reading of C04-3 with a result (section 18); A4 and A5 would add measured setup and restart times to sections 25 and 27.

---

## 6. Open questions and UNKNOWN register

Every UNKNOWN from the seven registers, with a proposed triage: **closed** (closed by another register in wave 1, with the entry), **wave 2** (a named fetch or code read), **experiment** (E1 to E5 or A0 to A5 above), **hedge** (accept, with the text the page carries), or **cut** (the claim leaves the scope). Carlos approved the triage on 2026-10-31. The last column records what wave 2 and the Tier 0 experiments found (2026-10-31); items whose experiment is on AWS stay on hold with their hedge.

| ID | Question (short) | Triage | Closes by, or hedge text | Result (2026-10-31) |
|---|---|---|---|---|
| U01-1 | Per-model FFN multipliers for Llama 3.1 | hedge | "FFN widths are taken from the Llama 3 paper's Table 3" | Hedge accepted at Gate 1 (Carlos's approval of the triage, 2026-10-31); the page carries the hedge text. |
| U01-2 | Chinchilla's training sequence length | hedge | "The paper does not state the context length behind its FLOP ratios" | Hedge accepted at Gate 1 (Carlos's approval of the triage, 2026-10-31); the page carries the hedge text. |
| U01-3 | What the Llama 3.1 card's GPU-hours include (8B and 70B imply 14% and 26% utilisation) | hedge | "Meta does not split the GPU-hours by stage"; only the 405B ratio is used for planning | Hedge accepted at Gate 1 (Carlos's approval of the triage, 2026-10-31); the page carries the hedge text. |
| U01-4 | H800 dense peak | hedge | "DeepSeek-V3 reports no MFU" | Hedge accepted at Gate 1 (Carlos's approval of the triage, 2026-10-31); the page carries the hedge text. |
| U01-5 | Achieved MFU on B200 and Trainium2 | wave 2, then experiment | MLPerf Training and first-party performance pages; A2 (H100), A5 (Trn2); until then "40% is an assumption" | Narrowed (wave2-step-maths): NVIDIA's own FP8 Llama 3 benchmarks come to about 34% to 42% of dense FP8 peak on H100 and B200 [vendor claim, derived]; MLPerf Training reports time to train, not utilisation; nothing located for H200 or Trn2. E2 adds a Tier 0 lesson on the denominator (29.0% and 27.9% of a measured GEMM ceiling on GB10). A2 and A5: AWS experiments on hold (Carlos, 2026-10-31); the hedge stays and the page ships the protocol marked "not yet run"; 40% stays a labelled assumption. |
| U01-6 | Fused cross-entropy that avoids FP32 logits | wave 2 | Transformer Engine v2.21.0 and Megatron Core fused cross-entropy code | Closed (wave2-step-maths): Transformer Engine's fused cross-entropy keeps a 2.1 GB BF16 copy instead of 4.2 GB of FP32 logits per 8,192-token sequence. E1 measured 4.27 GB saved for the FP32 upcast path at 8K. |
| U01-7 | OCP Microscaling spec v1.0 itself | wave 2 | Fetch the OCP PDF | Closed (wave2-step-maths): OCP MX v1.0, MXFP8 is 32 FP8 values with one shared 8-bit power-of-two scale, 8.25 bits per value. |
| U01-8 | PyTorch release that made `PYTORCH_ALLOC_CONF` primary | cut | Keep the alias fact at v2.15.0 (T01-63); drop the version history | Cut, approved at Gate 1 (2026-10-31). |
| U01-9 | MX formats on Trainium2 | closed | T03-36, T03-53: PyTorch-native training on Trn2 is BF16; MXFP8 is gated on Trainium3 | Closed in wave 1 (entry named). |
| U01-10 | Whether Llama 3's MFU counts attention FLOPs | hedge | "Meta reports MFU without stating whether attention FLOPs are counted" | Hedge accepted at Gate 1 (Carlos's approval of the triage, 2026-10-31); the page carries the hedge text. |
| U01-11 | Llama activation coefficient measured | experiment | E1 | Closed by E1 (Tier 0, DGX Spark, torch 2.15.0+cu132): 34.03 sbh per layer with fused SwiGLU, 41.03 sbh with TorchTitan-style eager SwiGLU, 2.00 sbh with full checkpointing, independent of the attention backend. |
| U01-12 | Optimizer state layouts in code (8-bit Adam, Adafactor, Muon) | wave 2 | bitsandbytes and Megatron Core optimizer code at tags | Closed (wave2-step-maths), except Megatron Core's Muon state layout, which lives in the external `emerging_optimizers` package and was not read; the page names Muon's row as one momentum buffer in the gradient's dtype. |
| U01-13 | Why two Trainium2 peaks differ | hedge | Quote both: 667 TFLOPS per chip page, 632 from the per-core page | Hedge accepted at Gate 1 (Carlos's approval of the triage, 2026-10-31); the page carries the hedge text. |
| U02-1 | DDP's current default bucket size | wave 2 | `torch/nn/parallel/distributed.py` at v2.15.0 | Closed (wave2-parallelism): DDP's default bucket is 25 MiB, with a smaller first bucket. |
| U02-2 | Ulysses head bound and GQA handling in code | wave 2 | `deepspeed/sequence/layer.py` at v0.19.9 | Closed (wave2-parallelism): DeepSpeed asserts at least one KV head per rank, so Ulysses caps at 8 for Llama 3.1 70B. |
| U02-3 | Llama 3.1 `config.json` | closed | 01 W1 reproduces all three parameter counts with V = 128,256 | Closed in wave 1 (entry named). |
| U02-4 | NeMo Auto Configurator after v3.0.0 | closed | T03-25, T03-27; remaining hedge in U03-2 | Closed in wave 1 (entry named). |
| U02-5 | TorchTitan benchmark sequence length and default degrees | wave 2 | `torchtitan/config/parallelism.py` and `models/llama3` at v0.4.0 | Narrowed, accept-as-hedge (wave2-parallelism): the benchmark does not state its sequence length; the 70B preset at the benchmarked commit used 8,192 and the v0.4.0 recipe defaults to 131,072 unless `seq_len` is set. |
| U02-6 | TorchTitan Neuron degrees on Trn2 | closed | T03-37 | Closed in wave 1 (entry named). |
| U02-7 | H100 dense BF16 peak as printed by NVIDIA | hedge | "NVIDIA prints the sparse figure; the dense figure is half" (T01-27, T01-29's footnote for HGX B200) | Hedge accepted at Gate 1 (Carlos's approval of the triage, 2026-10-31); the page carries the hedge text. |
| U02-8 | Formula against measured memory | experiment | E1, E5, A2; until then "formula totals are lower bounds; plan for measured peaks well above them" | Narrowed by E1 (Tier 0): the per-layer saved-tensor formula matches measurement (34.03 against 34.0 sbh, fused SwiGLU; eager SwiGLU 41 sbh); the transient peak around the output head is not in the formula (8.5 GB forward and 11.6 GB backward at 8K against 4.27 GB saved). E5 not run (section 5). A2: AWS experiments on hold (Carlos, 2026-10-31); the hedge stays and the page ships the protocol marked "not yet run"; "plan for measured peaks above formula totals" stays. |
| U02-9 | Achieved bus bandwidth on p5, NVLink and EFA | experiment | A1 | A1: AWS experiments on hold (Carlos, 2026-10-31); the hedge stays and the page ships the protocol marked "not yet run". |
| U02-10 | Llama 3's interleaving depth and micro-batch count | hedge | "Meta does not publish V and M, so the 405B bubble is not computed" | Hedge accepted at Gate 1 (Carlos's approval of the triage, 2026-10-31); the page carries the hedge text. |
| U02-11 | FSDP2 behaviour under gradient accumulation | closed | T03-2, T03-3, 03 W1; the exact count is U03-1 | Closed in wave 1 (entry named). |
| U02-12 | Llama-specific activation constant | closed (derivation) | 01 W3 derives 34.0 and 33.5 sbh; measurement is U01-11 | Closed in wave 1 (derivation); E1 measured the coefficient (U01-11). |
| U02-13 | FSDP hybrid-sharding cross-host formula | wave 2 | Read 2304.11277v2 HTML Sec 3.2.2, else re-derive and label [derived] | Closed (wave2-parallelism): only an all-reduce of each GPU's 1/G shard crosses EFA, 2M(W-G)/(GW) bytes per GPU; the FSDP paper's printed form does not follow from its own definition (C02-1). |
| U02-14 | Academic planners and simulators | wave 2 | Search and register peer-reviewed planners | Closed (wave2-parallelism): Calculon (SC23) registered as the analytical cross-check; Alpa (OSDI 2022) and Galvatron (VLDB 2023) as automatic planners. |
| U03-1 | FSDP2 all-gather count under deferred reduction | experiment | E3 | Closed by E3 (Tier 0, two gloo ranks plus a fake process group, torch 2.15.0): 9 all-gathers and 5 reduce-scatters per micro-batch for the test model by default (36 and 20 per 4-micro-batch step); 36 and 5 with gradient sync deferred; 21 and 5 with resharding after backward also off. |
| U03-2 | A successor to the Auto Configurator elsewhere at NVIDIA | hedge | "Not located in NVIDIA's current NeMo repositories during this research" | Hedge accepted at Gate 1 (Carlos's approval of the triage, 2026-10-31); the page carries the hedge text. |
| U03-3 | Loading a `dp_reshardable` Megatron checkpoint under new TP or PP | wave 2 | `distrib_optimizer.py` load path at core_v0.20.0 | Closed (wave2-frameworks): a default-format Megatron checkpoint resumes after a data-parallel change, and a TP or PP change needs `--dist-ckpt-optim-fully-reshardable` or `--no-load-optim`. |
| U03-4 | TorchTitan Neuron throughput, PP, 70B, Trn3 MXFP8 | wave 2, then experiment | Fork tests and CI; A5 | Narrowed (wave2-frameworks): no Trainium CI, no Neuron benchmark and no PP recipe in the fork; one sample log line (19.57% MFU, instance not stated). A5: AWS experiments on hold (Carlos, 2026-10-31); the hedge stays and the page ships the protocol marked "not yet run". |
| U03-5 | FP8 training in DeepSpeed | hedge | "No FP8 training option was located in DeepSpeed v0.19.9" | Narrowed in passing (wave2-frameworks): DeepSpeed has no FP8 setting of its own; FP8 comes from Transformer Engine layers, which DeepSpeed's tests run under every ZeRO stage. |
| U03-6 | Zero Bubble or DualPipe-style overlap in Megatron Core | wave 2 | `combined_1f1b.py` docstring and the MoE README | Closed (wave2-frameworks): Megatron Core has no Zero Bubble or DualPipe pipeline schedule; it overlaps expert all-to-all across micro-batches with `--overlap-moe-expert-parallel-comm`. |
| U03-7 | Frameworks installed in the AWS PyTorch DLC and the Neuron DLAMI | wave 2 | DLC image config at the pinned SHA; Neuron 2.33.0 DLAMI notes | Closed (wave2-frameworks): the PyTorch 2.14 DLC carries DeepSpeed 0.19.6 and Transformer Engine 2.18.0; Megatron, TorchTitan and the Hugging Face trainers are installed on top. The Neuron 2.33.0 DLAMI carries torch-neuronx 2.14 with TorchTitan. |
| U03-8 | Release cadence as a maturity signal | cut | Drop the cadence column; keep each project's own label | Cut, approved at Gate 1 (2026-10-31). |
| U03-9 | Nanotron at scale | closed (decision) | Named only as the code behind the Ultra-Scale Playbook (section 15) | Closed in wave 1 (decision). |
| U04-1 | Llama 3 Table 5: which of "148" and "30.1%" is the typo | wave 2 | Compare arXiv v1 and v2; else quote counts only | Narrowed, accept-as-hedge (wave2-reliability): Table 5 prints 148 and 30.1% in all three arXiv versions; 148 of 419 is 35.3%; the page quotes counts. |
| U04-2 | Young and Daly verbatim | hedge | Cite the formula through 2410.21680v2 Eq. 3 and Appendix A | Hedge accepted at Gate 1 (Carlos's approval of the triage, 2026-10-31); the page carries the hedge text. |
| U04-3 | What OPT-175B's 1.6 TB checkpoint held | cut | Keep the size and file count; drop any bytes-per-parameter reading | Cut, approved at Gate 1 (2026-10-31). |
| U04-4 | Whether `amzn-sagemaker-checkpointing` needs a CPU backend | wave 2, then experiment | Read the 1.1.3 wheel; A4. Until closed the page says "a code reading, not tested" | Closed (wave2-reliability and E4): the 1.1.3 library has no process-group code and its example passes an NCCL-only group and no stager; E4 reproduced PyTorch v2.15.0's rejection of an NCCL-only group ("A CPU backend must be enabled for async save") and the blocking bare call. A4's end-to-end run on HyperPod: AWS experiments on hold (Carlos, 2026-10-31); the hedge stays and the page ships the protocol marked "not yet run". |
| U04-5 | NCCL run-to-run determinism | wave 2, then experiment | NCCL documentation at a pinned release; A1's repeat test | Accept-as-hedge (wave2-reliability): NCCL's 2.32.3 user guide and PyTorch's reproducibility notes say nothing on bitwise run-to-run results. A1's repeat test: AWS experiments on hold (Carlos, 2026-10-31); the hedge stays and the page ships the protocol marked "not yet run". |
| U04-6 | Gemini's numbers from the paper | hedge | Keep Tier 2 labels from the Amazon Science post | Hedge accepted at Gate 1 (Carlos's approval of the triage, 2026-10-31); the page carries the hedge text. |
| U04-7 | FSx "MBps" decimal or binary; write bursts | wave 2 | FSx performance glossary; until then figures to two significant digits | Units accept-as-hedge (two significant digits); burst closed (documented for reads only, none listed for PERSISTENT-1000); capacity steps added: 1,200 GiB, 2,400 GiB, then 2,400 GiB increments (wave2-reliability). |
| U04-8 | s3torchconnector multipart part size | wave 2 | The Rust client configuration at v1.5.0 | Closed (wave2-reliability): s3torchconnector v1.5.0 defaults to an 8 MiB part size. |
| U04-9 | Device-to-host staging time for a 3.9 GB shard on H100 | experiment | E4 (API behaviour), A3 (timing) | Narrowed by E4 (Tier 0, GB10 unified memory, not H100): bare `async_save` blocked 35.86 s on the first save of a 4.03 GB state dict and 8.81 s later; a pinned stager blocked about 0.001 s; a pinned, shared-memory stager in a separate process 0.0006 to 0.039 s. The H100 timing (A3): AWS experiments on hold (Carlos, 2026-10-31); the hedge stays and the page ships the protocol marked "not yet run". |
| U04-10 | Same as U01-3 | hedge | As U01-3 | Hedge accepted at Gate 1 (Carlos's approval of the triage, 2026-10-31); the page carries the hedge text. |
| U04-11 | Venue years for MegaScale and the ByteDance straggler study | wave 2 | USENIX program pages | Closed (wave2-reliability): MegaScale NSDI 2024; the ByteDance straggler study OSDI 2025. |
| U04-12 | Slurm release behind the `sbatch` page | cut | Cite the flag behaviour without a version claim | Cut, approved at Gate 1 (2026-10-31). |
| U05-1 | P6e-GB300 per-instance figures and price | hedge | "AWS publishes P6e-GB300 figures only relative to P6e-GB200 as of 2026-10-30" | Hedge accepted at Gate 1 (Carlos's approval of the triage, 2026-10-31); the page carries the hedge text. |
| U05-2 | Trn3 instance names, Regions, purchase path | hedge | "Generally available since 2025-12-02; no specification row or public price on 2026-10-30" | Hedge accepted at Gate 1 (Carlos's approval of the triage, 2026-10-31); the page carries the hedge text. |
| U05-3 | trn2.48xlarge On-Demand on EC2 anywhere | wave 2, then experiment | Filter every Region's EC2 offer; A0 | Closed (wave2-aws): trn2.48xlarge has no EC2 On-Demand rate in any US Region; Ohio sells it through Capacity Blocks; the only EC2 On-Demand rate in the Price List is Hyderabad at $103.157 per instance-hour. A0: on hold. |
| U05-4 | Managed Spot pricing for training jobs | wave 2 | SageMaker pricing page and managed Spot doc | Closed as a hedge (wave2-aws): managed Spot training publishes no Spot rate; the saving shows per job as billable against training seconds. Calculator A takes managed Spot as a user-entered discount. |
| U05-5 | Training plans against the 256-instance Capacity Block limit | hedge | "The two limits are documented separately" | Hedge accepted at Gate 1 (Carlos's approval of the triage, 2026-10-31); the page carries the hedge text. |
| U05-6 | EFA and aws-ofi-nccl versions in the PyTorch 2.14 DLC | wave 2 | DLC release notes for the 2.14 image | Accept-as-hedge (wave2-aws G1): the AMI supplies the EFA driver and the container supplies NCCL and aws-ofi-nccl; only container-scoped pages state an NCCL version; section 31 reads versions inside the container. |
| U05-7 | p5e Capacity Blocks in us-east-1 | experiment | A0 | A0 (read-only capacity checks): AWS experiments on hold (Carlos, 2026-10-31); the hedge stays and the page ships the protocol marked "not yet run". |
| U05-8 | Per-direction NVLink and measured UltraCluster bisection | hedge, then experiment | Link the silicon dive for direction; "non-blocking is an AWS vendor claim"; A1 | Hedge accepted; A1: AWS experiments on hold (Carlos, 2026-10-31); the hedge stays and the page ships the protocol marked "not yet run". |
| U06-1 | HyperPod Slurm auto-resume "more than 16 nodes" | wave 2 | HyperPod Slurm FAQ; else quote both pages | Accept-as-hedge (wave2-aws): the Slurm overview ties replacement-and-resume to more than 16 nodes; the auto-resume page and the FAQ state no such limit; the page quotes both. |
| U06-2 | Instances per NVL72 UltraServer, 18 or 17 | closed | T05-6: 18 instances of 4 GPUs; the Slurm page's 17 is the outlier | Closed in wave 1 (entry named). |
| U06-3 | SMP v2 with SDK v3 `ModelTrainer` | wave 2 | SMP "Use the library" page and SDK v3.28.0 source | Closed in code, untested (wave2-aws): SDK v3.28.0's `ModelTrainer` takes SMP v2 settings through `Torchrun(smp=SMP(...))`; the SMP guide documents only the SDK v2 estimator. |
| U06-4 | Training-job resiliency outside Spot and plans; Trainium training-job tutorial | wave 2 | `RetryStrategy` docs; the tutorial page | Closed (wave2-aws G2): a training job that fails on a GPU gets a health check, then a reboot or a replacement, up to 10 unbilled repairs, and restarts from its last checkpoint; the docs' Trainium tutorials call recipe paths removed at v2.0.0. |
| U06-5 | HyperPod fee beyond ml.* rates | closed | T05-23: 1.20 times EC2 on P5 and P6; no separate fee in the material read | Closed in wave 1 (entry named). |
| U06-6 | Volcano and MPI Operator docs | cut | Name both with their tags only; Kueue carries the gang-scheduling section | Cut, approved at Gate 1 (2026-10-31). |
| U06-7 | Batch on EKS GPU health and EFA for MNP jobs | wave 2 | Batch MNP and GPU job pages | Accept-as-hedge (wave2-aws G3): Batch's EFA page needs a cluster placement group and shows ECS-style examples; no page read covers GPU health or EFA setup for multi-node jobs on EKS. |
| U06-8 | Launch date of Batch service jobs for SageMaker | wave 2 | AWS What's New | Closed (wave2-aws G5): Batch service jobs for SageMaker training launched 2025-07-31; quota management and preemption 2026-03-25. |
| U06-9 | EKS Best Practices AI/ML section contents | wave 2 | The five section pages (register 07 covers observability) | Narrowed (wave2-aws G6): the AI/ML Compute section recommends node health checks with automated recovery and Karpenter consolidation off for training nodes; Networking, Storage and Performance not read. |
| U06-10 | A PCS AMI with the Neuron stack | wave 2 | PCS sample AMI and installer pages | Closed as not located (wave2-aws): no PCS AMI with the Neuron stack on the PCS sample AMI and PCS-ready DLAMI pages; a Trainium node group runs a customer-built AMI [our reading]. |
| U06-11 | HyperPod deep health checks on Trainium | wave 2, then experiment | HyperPod EKS deep health check page; A4 | Closed (wave2-aws): HyperPod EKS documents Trainium deep health checks (Neuron sysfs, a Neuron hardware check, NCCOM local and cluster tests); HyperPod Slurm's deep health checks are GPU-only. A4: on hold. |
| U06-12 | Launch dates of HyperPod features | wave 2 | AWS What's New posts | Closed (wave2-aws G5): training operator 2025-06-30; elastic and checkpointless training 2025-12-03; task governance GA 2024-12-04; Spot on HyperPod 2025-11-24; managed tiered checkpointing 2025-09-08; Slurm health-monitoring agent 2025-09-15. |
| U06-13 | PCS Region count | cut | Not needed by any section | Cut, approved at Gate 1 (2026-10-31). |

| U07-1 | Whether the flight recorder's 2,000 entries cover one step of a large FSDP or 4D job | experiment | E3's collective count per step, divided into 2,000; until then "2,000 collectives, the default" with no coverage claim | Closed by E3 [derived from Tier 0 counts]: 2,000 entries cover about 2.5 steps of FSDP collectives for the 8B example at eight micro-batches and about one step for 70B. |
| U07-2 | Whether DCGM's NVLink byte fields include protocol headers (C07-6) | hedge, then experiment | "DCGM's header and user guide disagree on what the NVLink byte counters include"; A1 with DCGM sampling | Hedge accepted; A1 with DCGM sampling: AWS experiments on hold (Carlos, 2026-10-31); the hedge stays and the page ships the protocol marked "not yet run". |
| U07-3 | Whether the HyperPod observability add-on's default mode exports the DCGM fields its own alerts use (C07-8) | wave 2, then experiment | The add-on's metrics reference page; A4 queries AMP for the three fields | Documentation half closed (wave2-observability): four preset alerts read DCGM fields AWS lists as advanced, off by default. The cluster half (A4): AWS experiments on hold (Carlos, 2026-10-31); the hedge stays and the page ships the protocol marked "not yet run". |
| U07-4 | Whether a single-node smoke run before scale-out is a stated first-party practice | wave 2 | TorchTitan docs, the awsome-distributed-ai README at a SHA and the HyperPod recipes README; section 31 carries it as [our reading] until then | Narrowed, accept-as-hedge (wave2-observability): TorchTitan's quick start goes from one GPU to eight to multi-node and its fake process-group mode checks one rank's memory at the target degrees; the smoke run stays [our reading], stated in one first-party source, not two. |
| U07-5 | Which breakdowns Holistic Trace Analysis v0.6.1 computes | wave 2 | Read `hta/trace_analysis.py` at the pinned SHA; section 30 names HTA only after it is read | Closed (wave2-observability): Holistic Trace Analysis v0.6.1 computes temporal, idle-time, overlap, kernel, launch-delay and straggler breakdowns per rank. |
| U07-6 | Recommended Nsight Systems and `NCCL_DEBUG` settings for a run, and their overhead | wave 2 | NCCL environment variables page at a pinned NCCL version and the Nsight Systems user guide | Narrowed (wave2-observability): settings closed (`NCCL_DEBUG=WARN`, bring-up at `INFO` with `NCCL_DEBUG_SUBSYS`, Nsight Systems over a capture window); overhead accept-as-hedge, NVIDIA publishes no figure. |
| U07-7 | When SageMaker Debugger closed to new customers | hedge | "Closed to new customers as of 2026-10-30" | Hedge accepted at Gate 1 (Carlos's approval of the triage, 2026-10-31); the page carries the hedge text. |
| U07-8 | Neuron counterparts to the NCCL watchdog and flight recorder | wave 2 | Neuron 2.33 documentation on collective timeouts and neuron-monitor; link the silicon dive | Closed for the counterparts (wave2-observability): Neuron runtime 30 s execution timeout (`NEURON_RT_EXEC_TIMEOUT`), `NRT_TIMEOUT` and core dumps; no cross-rank matcher located. |

---

## 7. Gates before building the app

The iteration flywheel (ADR-003) puts Gate 1 between research and build. For this dive Gate 1 has five checks, and all five must pass before any `package.json` or `src/` exists.

1. **Scope held.** `SCOPE.md` has passed its three adversarial reviews (newcomer path, factual grounding, outcome fit), applied their fixes, and records them in its "Adversarial review notes". Every section passes the mental-model-or-practical test of `deep-dives/efa/revamp/section-shape-standard.md`.
2. **Load-bearing claims verified.** Wave 2's refutation pass has a verdict for every number in the thesis and section paragraphs; anything WRONG is fixed and anything SCOPE NARROWER is re-hedged.
3. **UNKNOWNs triaged.** Every UNKNOWN in section 6 carries an approved triage; every "wave 2" item is closed or re-triaged.
4. **Tier 0 decision.** Carlos decides which of E1 to E5 run before the build (they cost nothing but machine time) and whether any of A0 to A5 is approved. No section depends on an experiment, so "none" is a valid decision; it leaves the hedges in place.
5. **Human approval.** Carlos reads `SCOPE.md` and this guide and approves the section list, or names cuts. Candidate cuts if the dive must shrink, in order: (1) merge section 11 (context parallelism) into section 9 as a closing block; (2) merge section 26 (training jobs) into section 20's map with its decision note; (3) fold section 30 (the telemetry stack) into section 29's measurement table.

### Gate 1 record (2026-10-31): PASS

The 2026-10-30 record left checks 2 to 5 open. Carlos's decisions of 2026-10-31, given in the build job's brief, are recorded here as the approval for checks 3 to 5: (1) the 32-section list of SCOPE.md v2 is approved with no cuts; (2) the UNKNOWN triage in section 6 is approved; (3) wave 2 is green-lit with six refutation agents; (4) Tier 0 runs the DGX Spark group E1 to E4, and E5 if time and memory allow, while the AWS group A0 to A5, including the read-only A0, is on hold, and no distributed experiment of any kind runs.

| Check | Result | Evidence |
|---|---|---|
| 1. Scope held | PASS | Three independent reviews of Scoping v1 (`reviews/2026-10/R1-newcomer.md`, `R2-factual-grounding.md`, `R3-outcome-fit.md`), both blockers fixed and every finding applied or recorded in SCOPE.md's "Adversarial review notes". Wave 2 then re-read every number in SCOPE.md v2 as it stands, which covers the sentences the review fixes changed. Section count unchanged at 32; Carlos approved the list (decision 1). |
| 2. Load-bearing claims verified | PASS | Six verdict files, `research/2026-10/wave2-*.md`: 297 rows, 231 HOLDS, 57 SCOPE NARROWER, 9 WRONG, 0 UNVERIFIABLE (section 2 table). Every WRONG row (W1-23, W2-4, W3-29, W3-42, W4-9, W4-18, W4-26, W4-28, W5-32) is fixed in SCOPE.md with the verdict file's replacement text, and every SCOPE NARROWER row is re-hedged with its replacement text. |
| 3. UNKNOWNs triaged | PASS | Carlos approved the triage (decision 2). Section 6's result column records every wave 2 item as closed, narrowed with hedge text, or accept-as-hedge, and every experiment item as closed by E1 to E4 or on hold with its hedge. |
| 4. Tier 0 decision | PASS | Decision 4. E1 to E4 ran on 2026-10-31 (section 5 results table): E1 PASS, E2 prediction not met and re-hedged, E3 PASS, E4 confirmed T04-21, C04-2 and C04-3. E5 not run on the memory rule. A0 to A5 on hold; each dependent section ships its protocol marked "not yet run". |
| 5. Human approval | PASS | Decisions 1 to 4, Carlos, 2026-10-31. |

Gate 1 passed on 2026-10-31. The build (package, sections, calculators) starts after the commit that records this table.

Build addendum (2026-10-31): the section 7 author found that W2-9, W2-15 and W2-51 divide cross-instance bytes by one GPU's 50 GB/s share where AWS's own nccl-tests sample shows the whole instance's 400 GB/s carrying the crossing. They are re-graded WRONG on the bandwidth model, with recounted numbers and replacement text in the orchestrator addendum at the end of `research/2026-10/wave2-parallelism.md`; SCOPE.md sections 7, 8 and 14 and the calculator spec carry the recount.

---

## 8. Budget record

Wave 1 used 7 research-agent dispatches, at most three running at once, one per register, with no re-dispatch. Tool uses as reported by each agent: 01 176, 02 163, 03 184, 04 139 (about 70 web fetches), 05 157 (about 85), 06 128 (about 80), 07 137 (about 85); agents 01 to 03 did not report a fetch count. Phase 4 used 3 reviewer dispatches running together: R1 25 tool uses and no web access, R2 107 tool uses and about 45 of its 60 allowed fetches, R3 30 tool uses. The orchestrator made one web request (the AWS Price List FSx offer, T00-1) and read the registers, the sibling dives and the repository standards locally. No experiment ran, no AWS resource was created, and no machine was reached over ssh. Sections modified by the review pass: 31 of the 32 section blocks (all but section 28, Choosing your path) were touched by at least one fix, and the thesis, the calculators block, the depth note and the connections list were revised; section count unchanged.

Wave 2 and Tier 0 (2026-10-31). Six refutation agents, at most three running at once, no re-dispatch, each capped at 70 fetches: W1 used 43, W2 47, W3 64, W4 49, W5 68, W6 58, about 329 in total; each reported 95 to 180 tool uses. The orchestrator made no web requests; it applied the verdicts, ran the four experiments over ssh on the DGX Spark (Python package downloads into the scratch directory were the only network traffic there), and wrote the pre-build design files. No AWS resource was created.
