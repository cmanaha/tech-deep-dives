# Fact check fc07-reliability (sections 17, 18, 19), 2026-10-31

Files: `src/sections/FailureRates.tsx`, `src/sections/Checkpointing.tsx`, `src/sections/Resuming.tsx`;
claims lists `revamp/claims/failures.md`, `revamp/claims/checkpointing.md`, `revamp/claims/resuming.md`.

Evidence read anonymously (no account token, no identifying header):
- Shallow clones: TorchTitan `v0.4.0` (45e33cd413b64cb37a7840cfd3c9765d3c639ae1), TorchFT `v0.2.0`
  (b8a096f9f23589ec93e988e2368a934cab01b890), s3-connector-for-pytorch `v1.5.0`
  (c4f482629523d8fd2ec6080f70bda5966f90d89a).
- Raw files from raw.githubusercontent.com: PyTorch `v2.15.0` DCP (`state_dict_saver.py`, `staging.py`,
  `filesystem.py`, `distributed_c10d.py`, `docs/source/distributed.checkpoint.md`), `torch/distributed/run.py`,
  `docs/source/notes/randomness.md`; Megatron-LM `core_v0.20.0` `arguments.py`, `config/training_config.py`,
  `gpt_dataset.py`, `data_samplers.py`; metaseq at f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7; torchdata and
  Streaming READMEs.
- arXiv HTML at the versioned ids the Cites carry, converted to text: 2410.21680v2, 2407.21783v1, v2 and v3,
  2402.15627v1, 2505.05713v2, 2410.12588v1, 2407.20143v4, 1910.02054v3.
- AWS pages: HyperPod product and features, tiered checkpointing (overview, setup, What's New GA post), auto-resume,
  training operator, elastic training, FSx for Lustre SSD and performance pages, CreateFileSystem API, the pinned
  AmazonFSx offer file 20260911124432, S3 performance and S3 Express, EC2 accelerated computing. NVIDIA H100 page.
  Slurm sbatch. NCCL 2.32.3 environment variables and search index. DLAMI release 20261027. PyPI JSON and sdist for
  the tiered-checkpointing client 1.1.3 (sha256 matched).
- Venues: USENIX proceedings pages (MegaScale NSDI 24 p. 745; Stragglers OSDI 25 p. 483; ByteCheckpoint NSDI 25
  p. 559); SOSP 2023 accepted papers (Gemini); HPCA 2025 main program page and Crossref
  10.1109/HPCA61900.2025.00096, pp. 1259-1274 (Revisiting Reliability); Crossref 10.1109/SC41405.2020.00024
  (ZeRO, "SC20: International Conference for High Performance Computing, Networking, Storage and Analysis",
  pp. 1-16; the SC20 site and IEEE Xplore returned bot challenges, so Crossref's publisher record is the
  confirmation).
- Every printed number the three sections compute was recomputed by bundling `src/lib/checkpoint.ts`,
  `src/lib/runtime.ts` and `src/lib/presets.ts` with esbuild 0.25.12 and running them under node. All match
  the rendered values (MTTF table and chart points, 987.75 GB / 846.6 GB, 3.86 GB per GPU, 30.9 GB per node,
  dt 7,060 s / 403 steps / ETTR 0.98171, async dt 1,289 s / 74 steps / 0.99546, 1.2 h and 3.3 h, 14.7 min /
  0.786, 2.7 min / 0.884, 0.930, 783 s / 0.787, 16.46 GB/s, 19,200 GiB, $11,520 and $12,370, 0.77 GB/s,
  1,200 GiB, 117,750 parts / 33.6 s, 53 s, 9.0 TiB, 1.40% and 14.2 copies, 2.43 h and 6.76 x, $55.04 and
  $47.757, 1.37 points, 5.477, 0.9076, 0.514 GB/s and 4.1 Gbps, 3.09 h, 3.8 and 7.6 per thousand node-days).
- Experiment E4 (`research/` E4-spark-checkpoint-staging.md): every number on the page matches the log
  (35.86 / 36.20 s blocking, 28.09 s then 0.068 s, about 68 of 121 GB in use, the AssertionError text).

Cross-section conditions (build log): "ETTR and intervals", "Llama 3 interruptions" and "Async checkpointing"
hold across the three files. Every-group items: no EFA or NVLink pricing in these files (the only per-instance
figures are storage bandwidth, labelled our arithmetic); ZeRO-2 under accumulation, the Xid alert rule,
Korthikanti, ZeRO++ and the 41 sbh figure do not appear; the pinned Llama 3.1 70B metadata link
(revision 349b2ddb53ce8f2849a6c168a81980ab25258dac) and the FSx offer file 20260911124432 are untouched.
Prose rules: no em-dash, en-dash range, curly quote or banned word found by eye or by `no-ai-tells.sh`; every
niche acronym in reading order is expanded at first use (MTTF and ETTR in 17; DCP, RNG, FSx, NCCL, EFA in 18;
HSDP, TP in 19). RSC-1 and RSC-2 stay as cluster names: the paper never expands RSC in its body.

## FailureRates.tsx (section 17)

49 claims lines plus every derived number checked; 44 CONFIRMED; non-CONFIRMED: WRONG 3, OVERREACH 1, STALE 1 (Meta Sec II, II-B, II-C Observation 2, II-D,
III with Eq. 3, Observation 10, Appendix A Eq. 10 and its assumptions, IV-A; Llama 3 Sec 3.3.1, Table 4,
Sec 3.3.4, Table 5 in v1, v2 and v3; MegaScale Sec 6.3; metaseq notes; HyperPod pages; EC2 page).

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | MegaScale "under 10 minutes ... within 15 minutes ... over 90%" cited to Section 6.2 | FailureRates.tsx:702 | WRONG (location) | 2402.15627v1 Sec 6.3 first paragraph ("The average time required for detecting failure and executing diagnostic tests is less than 10 minutes ... within 15 minutes from the latest checkpoints, maintaining over 90% effective training time rate"); Sec 6.2 holds only the 100 restarts and 90% of faults | Cite reads "MegaScale, Section 6.3"; claims line notes Sec 6.3 |
| 2 | "Hardware failures touched under 1% of jobs but 19% of GPU runtime" cited to Sections II-E and IV-A | FailureRates.tsx:640 | WRONG (location) | 2410.21680v2 Sec III, Observation 4 ("Attributed hardware failures impact 19% of GPU runtime and less than 1% of jobs"); II-E is the taxonomy only | Cite reads "Sections III and IV-A"; claims line updated |
| 3 | Expandable: "the paper does not reconcile the two" (7.9 h measured against the formula) | FailureRates.tsx:551-554 | OVERREACH | 2410.21680v2 Sec III: the projection "matches well with observed MTTF numbers for larger jobs (> 32 GPUs)"; Observation 8: "MTTF projections closely match empirical MTTFs for 4 to 512 servers for RSC-1". The paper claims agreement rather than leaving a gap open | Re-expressed: the paper describes its projection as matching observed MTTFs above 32 GPUs and does not discuss this gap; our reading kept |
| 4 | Revisiting Reliability Cites carry venue "preprint" (12 Cites) | FailureRates.tsx:488 and 11 more | STALE | HPCA 2025 main program (https://hpca-conf.org/2025/main-program/, Kokolis et al., Meta); Crossref 10.1109/HPCA61900.2025.00096, "2025 IEEE International Symposium on High Performance Computer Architecture (HPCA)", pp. 1259-1274 | venue="HPCA 2025" on all 12; constant comment records the confirmation |
| 5 | r_f 6.50 and 2.34 and the 2.5 to 17.5 swing cited to "Sections II-E and III" (body and table caption) | FailureRates.tsx:504, :755 | WRONG (location) | 2410.21680v2 Sec III ("RSC-1 has an r_f of 6.50 ... RSC-2 ... 2.34"; "Failure rate is constantly changing ... 2.5 ... 17.5", 30-day rolling average); II-E is the failure taxonomy and holds no rate | both Cites read "Section III" |
| 6 | Known item: MegaScale "NSDI 2024" in one file and "preprint" in another | all section files | CONFIRMED consistent in .tsx | every MegaScale Cite in `src/sections/*.tsx` reads venue="NSDI 2024"; USENIX NSDI 24 proceedings p. 745. `sources.md` still says "NSDI 2024, preprint" (orchestrator file) | none here; reported |
| 7 | Known item: Llama 3 v1 and v2 cited on purpose | FailureRates.tsx:645-660 | CONFIRMED | Table 5 is identical in v1, v2 and v3 (148 and 30.1%; GPU rows 268, 64%; printed GPU percentages 58.7%), so the v1 and v2 Cites show the inconsistency persists. The known-item note "Table 5 changed across versions" is itself wrong | kept |

Score after fixes: **9/10.** Every number is computed from Meta's rates and reproduces, and every quote sits
at the cited section. Four Cites pointed at the wrong section and one sentence put words in the paper's mouth;
all now match the source.

## Checkpointing.tsx (section 18)

92 claims lines plus Calculator D outputs checked; 86 CONFIRMED; non-CONFIRMED: WRONG 1, UNSUPPORTED 2, STALE 3 (PyTorch DCP `async_save` default stager,
`StagingOptions`, `BlockingAsyncStager`, CPU-backend check and backend default; TorchTitan keys, interval 500,
keep_latest_k 10, async_mode "disabled", pinned-mode stager and process, staging fence; Megatron async-save
disable, NVRx formats; s3torchconnector 8 MiB parts and prefix strategies; FSx tiers, capacity steps,
client ceilings and the $0.600 offer; S3 3,500 PUT per prefix and S3 Express; HyperPod tiered checkpointing,
its example and the 1.1.3 client; Gemini blog; MegaScale Sec 4.4; Llama 3 Sec 3.3.1; E4 log).

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | "2 for the BF16 (bfloat16) weights" cited to ZeRO Section 3.1 | Checkpointing.tsx:980 | WRONG (attribution) | 1910.02054v3 Sec 3.1: "an fp16 copy of the parameters and the gradients, with memory requirements of 2Ψ and 2Ψ bytes respectively", not BF16; section 5 already words it as 16-bit, FP16 in the paper | "2 for the 16-bit weights (FP16 in the paper; BF16 takes the same two bytes)"; claims line updated |
| 2 | ZeRO Cite venue "preprint" | Checkpointing.tsx:984 | STALE | Crossref 10.1109/SC41405.2020.00024, SC20 proceedings, pp. 1-16; FineTuning.tsx already carries "SC 2020" | venue="SC 2020" |
| 3 | Revisiting Reliability Cites carry venue "preprint" (8 Cites) | Checkpointing.tsx throughout | STALE | as section 17 row 4 | venue="HPCA 2025" on all 8 |
| 4 | "a train state of step count and tokens seen" cited only to base.py L36-L41, which names the key, not its contents | Checkpointing.tsx:1020-1027 | UNSUPPORTED at the cited range | TorchTitan v0.4.0 `training_engine.py` L884-L885: `return {"step": self.num_completed_steps, "ntokens_seen": self.ntokens_seen}`; L479 registers the engine as `train_state` | added Cite TT_TRAIN_STATE (training_engine.py L884-L885) |
| 5 | "`--async-save` is off by default" cited to arguments.py L1808-L1814, which holds the disable logic, not the default | Checkpointing.tsx:1353 | UNSUPPORTED at the cited range | Megatron core_v0.20.0 `config/training_config.py` L551: `async_save: bool = False` | added a kind="code" Cite to training_config.py L551-L552; claims line split in two |
| 6 | ByteCheckpoint Cite carries `accessed` 2026-10-30 although re-read | Checkpointing.tsx:1019 | STALE (metadata) | 2407.20143v4 Sec 2.1 re-read 2026-10-31; NSDI 25 page confirmed | `accessed` dropped (default date); claims header updated |

Score after fixes: **9/10.** Every code range, AWS figure and calculator output holds at the pins, and E4
matches its log. The fixes were attribution and citation-range errors, plus two stale venues.

## Resuming.tsx (section 19)

62 claims lines checked; 57 CONFIRMED; non-CONFIRMED: OVERREACH 2, UNSUPPORTED 2, WRONG 1 (torchrun max-restarts and signal forwarding; PyTorch randomness note,
which says nothing on collectives; TorchTitan seeding, determinism and GC; Megatron dataset and sampler order,
exit_signal_handler default; TorchFT manager modes, `min_replica_size` and `batches_committed`; HyperPod
auto-resume, operator and elastic-training pages; Slurm requeue and signal; NCCL_ALGO default and no
reproducibility statement in NCCL 2.32.3; DLAMI 20261027; straggler paper Sec 3.1, 4.1 to 4.4, 5.1, 5.3 to 5.6;
MegaScale Sec 6.3; Llama 3 Sec 3.3.4; FALCON abstract, still a preprint).

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | h1 description "find the slow rank before it costs you a tenth of the cluster" | Resuming.tsx:545 | OVERREACH | 2505.05713v2 Sec 4.1: 10.4% is the GPU-hours wasted across ByteDance's trace, not a per-cluster or per-job cost | "find the slow rank from per-rank step timing", 10.4% figure kept |
| 2 | Intro "Stragglers cost about as much and never stop the job" | Resuming.tsx:566 | UNSUPPORTED (unlabelled inference across two reports) | Llama 3 Sec 3.3.4 (above 90% effective training time) against 2505.05713v2 (10.4%): neither report makes the comparison | labelled "by our reading of the two reports"; claims line added |
| 3 | TorchFT lighthouse and step-granularity membership cited to README L24-L52 | Resuming.tsx:712-718 | UNSUPPORTED at the cited range | TorchFT v0.2.0 README L94-L101 ("lighthouse server that coordinates across the different replica groups ... membership changes at the training step granularity"); L24-L52 has the heartbeats, peer recovery and HSDP | second Cite to README L94-L101 |
| 4 | Ending: schedule GC at the same step interval with "Megatron's `manual_gc`" | Resuming.tsx:1106-1107 | WRONG | Megatron core_v0.20.0 training_config.py L91-L100: with `manual_gc` alone "garbage collection is performed only at the start and the end of the validation routine"; `manual_gc_interval` "Values > 0 will trigger garbage collections between training steps" | "or Megatron's `manual_gc` with a `manual_gc_interval` above 0"; claims line updated |
| 5 | "a straggler costs that much without ever appearing in a failure count" | Resuming.tsx:946 | OVERREACH | 2505.05713v2 Sec 4.1: 10.4% is the waste from all stragglers across the trace, not one straggler's cost | "stragglers cost that much" |

Score after fixes: **9/10.** Every code range and AWS page holds at the pin, and the straggler figures match the
OSDI paper. The page is long; the leverage pass demotes evidence rather than cutting it.

## For the orchestrator (files this group does not own)

- `sources.md` lists MegaScale as "NSDI 2024, preprint"; every .tsx Cite reads NSDI 2024 (confirmed).
- Revisiting Reliability (2410.21680v2) is **HPCA 2025** (HPCA 2025 main program; Crossref
  10.1109/HPCA61900.2025.00096). Still "preprint" in `ThreeBudgets.tsx`, `BringUp.tsx` and
  `GlossaryAndSources.tsx` source 61.
- ZeRO (1910.02054v3) is **SC 2020** (Crossref 10.1109/SC41405.2020.00024). Still "preprint" in sections 1 to 14
  and 21; FineTuning.tsx already reads SC 2020.
- The fc07 known-item note says Llama 3 "Table 5 changed across versions"; it is identical in v1, v2 and v3.
- RESEARCH-GUIDE U04-9 gives "4.35 GB state dict" for E4; the page and the E4 log say 4.03 GB.
- FP16 is now used in section 18's prose; the glossary already lists it (first use is section 6).
- Orchestrator venue note (QLoRA NeurIPS 2023, Reducing Activation Recomputation MLSys 2023, ZeRO++ ICLR 2024,
  ZeRO SC 2020): of these, only ZeRO is cited in sections 17 to 19, and it reads SC 2020.
