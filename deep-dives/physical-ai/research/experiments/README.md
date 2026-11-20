# Tier 0 experiments

Measured results the dive may cite as Tier 0 (our own experiments). The dive never runs hardware. A separate
profiling project produces results (inputs, configs, outputs) and they land here; sections 21 to 23 consume them.

| Folder | What | Machines | Date | Runs | Status |
|---|---|---|---|---|---|
| `E-seed-profiling-2026-11-19/` | 14 CPU microbenchmark kernels and 3 CPU stand-in workloads (MuJoCo humanoid step, 6x1024 MLP inference, MuJoCo offscreen render) under `perf stat`, top-down level 1; one GPU matmul kernel under Nsight Compute per machine | NVIDIA DGX Spark (Cortex-X925 and Cortex-A725 cores, GB10 GPU), NVIDIA Jetson Orin Nano Super (Cortex-A78AE) | 2026-11-18 to 2026-11-20 | Single run per kernel per core type | Copied from the seed research; see provenance |

## Provenance of `E-seed-profiling-2026-11-19/`

- Copied on 2026-11-20 from the seed research folder: its `bench/` directory (`micro.c`, `workloads.py`, `run.sh`,
  `make_report.py`, `humanoid.xml`, `report.md`, `results/` as `results-pass2/`, `results-v1/` as `results-pass1/`)
  and its `pmu-cards/` directory.
- The six result CSV files are byte-identical to the seed copies; `SHA256SUMS` records their checksums.
- Text edits made to the copies, and only these: the conference session code was removed from titles, comments, the
  bench directory name in quoted paths (now `~/physical-ai-bench`) and the temporary file names in `run.sh` (now
  `/tmp/pai-bench.*`). The report title was changed to say "second pass", which is what `report.md` holds: pass 2
  fixed three benchmark defects (FMA now uses 24 chains, the branch kernel really branches, the cache-level kernels
  size to half of each cache level of the core they run on). Pass 1 CSVs are kept for the record and are superseded.
  No measured value was edited.
- Not copied: the two PDF renderings and the HTML report (same numbers as `report.md`), the web-server folder.

## How to cite these results

- Tier 0, **single run**: every figure comes from one execution per kernel per core type. No repeat count, no
  variance. A section that shows one of these numbers says "one run" next to it.
- One core, one thread, pinned. Throughputs are per core, not per machine.
- The three workloads are CPU stand-ins: a MuJoCo humanoid model (not the SO-101), a 6x1024 MLP (not ACT or a VLA),
  MuJoCo offscreen rendering at 640x480 (whether the GPU took part was not established).
- The top-down level 1 formula is a simplification written for this work and was not yet checked line by line
  against Arm's published method (register 08 records what Arm's method documents say). On the Jetson the
  slots-per-cycle value was derived from the counters themselves, so the four categories summing to 100% there is
  not an independent check.
- One follow-up experiment is recorded only in the seed handoff note, without raw files: built with
  `-funroll-loops`, the X925 triad L1 kernel went from 39.6% to 1.6% front-end bound and from 183 to 246 GB/s. Until
  its raw output lands here it is an UNKNOWN for the dive, not Tier 0.
- GPU: one float32 matmul kernel per machine under Nsight Compute (`basic` set). DGX Spark: 4096x4096, 8.35 ms.
  Details at the end of each PMU card. One pass, not tuned.

## What the profiling project still owes the dive

Listed in `RESEARCH-GUIDE.md`, section "Tier 0 experiments".
