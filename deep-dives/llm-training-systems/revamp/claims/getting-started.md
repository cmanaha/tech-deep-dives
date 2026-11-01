# Claims: section 2, Getting Started

File: `src/sections/GettingStarted.tsx`. 10 `<Cite>` elements on 7 sources. Every cited source was re-opened on 2026-10-31 with plain `curl` (no identifying headers) into a fresh `/tmp` directory and read as text, so every Cite carries the default accessed date: the EC2 accelerated computing page (`ac.html`), NVIDIA's NVLink and H100 pages, the Llama 3.1 8B Hugging Face metadata at revision d04e592bb4f6aa9cfee91e2e20afa771667e1d4b, PaLM v5 (PDF, Appendix B), ZeRO v3 (PDF, Sections 3.1 and 7.1) and Llama 3 Herd of Models v3 (HTML, Sections 3.3.1 and 3.3.4).

The section is a survey. Apart from the cited figures below, its statements are pointers to other sections of this dive; each pointer was checked against the section file named (h1 description or the line given). Routes are SCOPE.md section 2's four routes verbatim, with R1's route fixes (`reviews/2026-10/R1-newcomer.md`, findings 6, 7, 8, 24) already folded into SCOPE.md. Section titles are copied from `src/App.tsx`; sibling-dive titles from each sibling's `src/App.tsx`.

Format: claim | source URL | register, wave 2 row, experiment or sibling section.

## Who the dive is written for

- Reader profile and assumed background (memory as capacity and bandwidth; links with a bandwidth each; attention plus MLP with attention and KV heads; serving-engine tensor parallelism; Adam by name; no calculus beyond one gradient per weight) | SCOPE.md section 2 | scope
- A forward pass costs about 2 FLOPs per parameter per token (PaLM: "6N matmul FLOPs per token seen (2N for forward and 4N for backward)"); applying it to a prompt is the dive's reading, as section 3 states | https://arxiv.org/abs/2204.02311v5 (Appendix B) | T01-18; W1-51 (HOLDS)
- Sibling links: Silicon dive section 6, HBM and the Bandwidth Wall; section 3, Roofline and Arithmetic Intensity; section 29, Communication and Scale-Out; EFA dive section 8, Instance Support Matrix; section 9, NCCL over EFA: the aws-ofi-nccl Plugin; vLLM dive section 9, Distributed Inference; SGLang dive section 14, Parallelism: TP, DP Attention & EP | sibling `src/App.tsx` arrays (EFA titles are unnumbered; numbered by array position, as section 7 does) | scope "Connections"
- Section 32 lists every term and acronym with its defining section and repeats section 3's notation | `src/sections/GlossaryAndSources.tsx` (glossary and notation arrays) | section 32

## Four ideas to hold

- Model state (weights, gradients, optimizer state) persists across steps; activations live from a forward pass to its backward pass; every memory lever acts on one of the two | section 3 (`TrainingStep.tsx`, h2 "What the step keeps, and for how long") | T01-9; T01-10; section 3
- About 6 FLOPs per parameter per token, 2 forward and 4 backward | https://arxiv.org/abs/2204.02311v5 (Appendix B) | T01-18; W1-37
- 16 bytes per parameter of model state for mixed-precision Adam: 2 + 2 + 12 (FP32 copy, momentum, variance) | https://arxiv.org/abs/1910.02054v3 (Section 3.1: "2Ψ + 2Ψ + KΨ = 16Ψ bytes", K = 12) | T01-9; W1-30
- Llama 3.1 8B has 8,030,261,248 parameters (printed 8.03 billion) | https://huggingface.co/api/models/meta-llama/Llama-3.1-8B/revision/d04e592bb4f6aa9cfee91e2e20afa771667e1d4b (`safetensors.total`) | T01-3
- 128.5 GB of model state, 1.6 times one 80 GB H100 [derived: 16 x 8,030,261,248 = 128.48e9 bytes; / 80e9 = 1.61] | https://www.nvidia.com/en-us/data-center/h100/ ("GPU Memory 80GB", vendor specification) | 01 W2; T01-27; section 3's figure
- MFU defined as the share of the accelerators' peak arithmetic a run achieves (gloss) | section 4 (`Arithmetic.tsx`); PaLM Appendix B | T01-18; R1 finding 3 wording
- Rank, world size, degree; degrees multiply to the world size; TP 8 x PP 4 x DP 8 = 256 ranks = 32 p5.48xlarge of eight H100 each [derived] | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html ("p5.48xlarge ... 8 x NVIDIA H100 GPU | 640 GiB (8 x 80 GiB)") | T02-68; section 7 (`Collectives.tsx` L738-L745) uses the same example
- Five collectives (all-reduce, reduce-scatter, all-gather, all-to-all, send and receive), priced as bytes over link bandwidth | section 7 (`Collectives.tsx`, h2 "Five operations") | section 7
- An all-reduce is a reduce-scatter followed by an all-gather ("a two-step approach ... reduce-scatter ... all-gather ... The result of these two steps is an all-reduce") | https://arxiv.org/abs/1910.02054v3 (Section 7.1) | T02-4; section 7 cites the same passage
- HBM inside the accelerator, NVLink or NeuronLink inside the instance, EFA between instances | SCOPE.md section 2 (d); section 7 | scope
- H100 NVLink 900 GB/s per GPU (Hopper column); 450 GB/s per direction is our reading of the table, where NVIDIA calls the sixth-generation figure bidirectional | https://www.nvidia.com/en-us/data-center/nvlink/ (vendor specification) | T02-70 [our reading]
- p5.48xlarge has 3,200 Gb/s of EFA = 400 GB/s per instance, 50 GB/s per GPU [derived] | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html ("p5.48xlarge | 2 | 3200 Gigabit | Yes" in the EFA column) | T02-68 [derived]
- Per GPU, NVLink is nine times EFA [derived, our arithmetic from the two pages] | NVLink page and ac.html above | T02-68; T02-70; build-log "Cross-instance pricing"; section 7 h1 and L1053
- Collectives that combine inside the instance first can spread their crossing over the instance's 400 GB/s | section 7 (`Collectives.tsx` L1073-L1090, L1116) | build-log "Cross-instance pricing" (our reading, section 7)
- Section 21 gives the per-instance figures for the other training instances | section 7 (`Collectives.tsx` L1069-L1070); section 21 (`AwsHardware.tsx`) | section 21

## The path, and why in this order

- Six stages with their section ranges, contents and one stage-level mental model each; the reasons for the order | SCOPE.md section 2 ("The path, and why in this order"); R1 finding 12 wording | scope
- Tensor parallelism fires inside every layer of every micro-batch and stays on NVLink; data and pipeline parallelism fire once per step or per micro-batch and can cross EFA | section 9 h1; section 21 (`AwsHardware.tsx` L819-L826); SCOPE.md thesis | T02-13; T02-14; T02-64
- Three engines (PyTorch distributed, DeepSpeed, Megatron Core) implement the parallelism; every other framework mapped configures one | section 15 (`FrameworkMap.tsx` h1 and L496) | section 15
- Llama 3 405B trained on up to 16K H100 GPUs (Sec 3.3.1); 466 interruptions in a 54-day snapshot, 419 unexpected (Sec 3.3.4); one unexpected interruption every 3.1 hours [derived: 54 x 24 / 419 = 3.09] | https://arxiv.org/abs/2407.21783v3 (Sections 3.3.1 and 3.3.4) | T04-1; T04-4; build-log "Llama 3 interruptions"; section 17 h1
- On AWS the step is the same on every path; ownership of the cluster around it differs (who keeps it standing, replaces a broken node, restarts the job) | section 28 (`ChoosingPath.tsx` intro); section 20 | section 20; section 28
- Three layers of signal: model health, job efficiency, hardware health | section 29 (`WhatToMeasure.tsx` L167-L192) | section 29
- Bring-up checks earlier estimates rung by rung from one node | section 31 draft (`BringUp.tsx` h1 and rung table L198-L201); section 28 closing line | section 31 (being written; referred to by number and title)
- Restart ownership is what differs most between paths [our reading of sections 20 to 28] | section 28 question 3 ("Who owns node health and restart?") | scope [our reading]

## Reading map diagram

- Stage bands, section membership and route marks are generated from the same `BANDS` and `ROUTES` data as the route lists; no number other than section numbers appears in the diagram | SCOPE.md section 2 | scope
- Sections 19 and 29 to 31 are on no shorter route | SCOPE.md section 2 routes | scope

## How the sections feed each other

- Calculator A (section 4) feeds section 22's cost panel | `CapacityCost.tsx` imports `estimateRun`, `priceRun` from `src/lib/runtime.ts` | build-log section 22 row
- Calculator B is the memory check inside Calculator C | `src/lib/parallelism.ts` imports `memoryBudget` from `./memory` | calculators-spec
- Calculator C prices bytes per link with section 7's model and section 21's per-instance bandwidths, and takes compute time from section 4's identity | `src/lib/parallelism.ts` imports `flopsPerToken`, `denseRuntimeInputs` from `./runtime`, `DEFAULT_MFU` and instance presets from `./presets`; section 21 renders the same `INSTANCES` | build-log "Cross-section conditions: Cross-instance pricing"
- Section 17's failure rates feed Calculator D (section 18), which sizes section 23's storage | `FailureRates.tsx` and `Checkpointing.tsx` use `FAILURE_RATES` and `src/lib/checkpoint.ts`; `Storage.tsx` imports `checkpointPlan` | build-log sections 17, 18, 23
- Section 20 frames sections 24 to 26 and 28 | `ChoosingPath.tsx` ("Sections 20 to 27 take each path apart") | scope
- Section 31 compares a measured step against section 4's MFU estimate and section 7's collective arithmetic, using section 29's metrics | `BringUp.tsx` draft rungs 4 ("Collective baseline", section 7) and 7 ("Throughput and MFU", sections 4, 29) | scope; section 31 (being written)

## Four shorter routes

- Route lists, in reading order, and the conditional sections (11 when activations outgrow TP and recomputation, 12 for MoE, 6 for FP8; one family of 24 to 27 on the budget route) | SCOPE.md section 2 | scope; R1 findings 6, 7, 8, 24
- "Ends on" lines: two or three layouts worth measuring (section 14 h1); one of seven AWS paths with its fee and the work it leaves (section 28 h1 and "Four questions, seven paths"); a sized run, the engine to reuse and the path (sections 16, 26, 28 h1); the checkpoint interval (section 18 h1) | the section files named | sibling sections
- Gloss example: section 21 introduces tensor parallelism as "splitting every layer's matrices across the accelerators of one instance; section 9" | `AwsHardware.tsx` L820-L821 | section 21; R1 finding 7 gloss
- Ranks route: section 9 sets one layer's TP traffic against its compute (section 9 h1); section 21 supplies memory per accelerator, peak arithmetic and the fast-link domain (section 21 h1); CP joins when activations still do not fit (section 11 h1; SCOPE.md section 11 ending) | section files | R1 finding 6; R3 (section 11 ending)
- Budget route: memory bill sets the accelerator floor, as section 21 counts p5.48xlarge for 70B's model state (section 21 h1); checkpoint interval sizes section 23's storage (Storage.tsx uses Calculator D) | section files | R1 finding 7
- Fine-tuning route: section 8's sharding argument rests on section 7's identity (`DataParallel.tsx` L643-L653, L701) and on keeping gathers on NVLink (`DataParallel.tsx` L729, L764); section 16 picks a framework by the engine it reuses (section 16 h1, L818-L826); capacity comes first (`ChoosingPath.tsx` L352, L394) | section files | R1 finding 8
- Theory route ends on sections 17 and 18, the third budget's arithmetic | SCOPE.md section 2 | R1 finding 24

## Acronyms expanded in this file

NCCL, EFA, HBM, MLP, KV, FLOPs, TP, DP (via the SGLang title gloss and again as data parallelism), EP (via the SGLang title gloss), MFU, PP, BF16, FP8, DDP, ZeRO, FSDP, HSDP, MoE. Section titles in the route lists carry 6ND, MFU, BF16, FP8, DDP, ZeRO, FSDP, HSDP and AWS, all expanded before the lists. EC2 appears only in the constant name, not in reader text.
