# E4. Checkpoint staging: `dcp.save`, bare `async_save`, a pinned stager, and the NCCL-only check

**Tier 0 evidence.** Ran 2026-10-31 on the DGX Spark: one rank, one GB10, PyTorch 2.15.0+cu132, saving to the host's local NVMe. Three repetitions per mode in one process, one run of the process.

**Tests:** T04-20, T04-21, C04-2, C04-3. **Narrows:** U04-9 (staging time; API behaviour settled, H100 timing still open). **Caveat that bounds every timing below:** GB10's CPU and GPU share one LPDDR5X memory, so a "device-to-host" copy is a copy within the same memory, and pinned and pageable host memory behave differently than on a discrete H100 on PCIe. The API behaviour and the error check transfer to AWS; the timings do not. The host was also running other services that held about 68 GB of the 121 GB, so first-touch allocation of new pageable memory was slow (see the raw copy rows).

## Software

- PyTorch 2.15.0+cu132, Python 3.12.3, aarch64. Process group `cpu:gloo,cuda:nccl`, world size 1.
- Script: `spark-scripts/e4_ckpt.py`. State dict: 30 FP32 tensors of 33,554,432 elements, 4.03 GB, on the GPU (one 70B rank's share at 256 GPUs is 3.86 GB, 04 W2).
- Modes, each saving `{"m": state_dict}` with a `FileSystemWriter` checkpoint id:
  1. `dcp.save`.
  2. `dcp.async_save` with no stager (thread executor). Per T04-21 it builds `DefaultStager(StagingOptions(False, False, False, False))` (read at `torch/distributed/checkpoint/state_dict_saver.py`, v2.15.0).
  3. `dcp.async_save` with `DefaultStager(StagingOptions(use_pinned_memory=True, use_shared_memory=False, use_async_staging=True, use_non_blocking_copy=True))`, thread executor, one stager reused across the three saves.
  4. As 3 with `use_shared_memory=True` and `AsyncCheckpointerType.PROCESS`, the settings TorchTitan v0.4.0's `async_with_pinned_mem` mode passes (`torchtitan/components/checkpointer/dcp.py` at 45e33cd413b64cb37a7840cfd3c9765d3c639ae1).
- Blocking time: wall time until the call returns. Staged: until `staging_completion` resolves. Total: until the upload future resolves.

## Results (seconds; repetitions 1, 2, 3)

| Mode | Blocking | Staged | Total |
|---|---|---|---|
| `dcp.save` | 4.35, 2.54, 2.60 | n/a | same as blocking |
| `async_save`, no stager (returns a `Future`) | 35.86, 36.20, 8.81 | inside the blocking time | 38.43, 41.75, 12.16 |
| `async_save`, pinned stager, thread (returns `AsyncSaveResponse`) | 0.0009, 0.0007, 0.0008 | 2.52, 2.86, 0.14 | 7.07, 5.39, 2.59 |
| `async_save`, pinned + shared stager, process (TorchTitan's mode) | 0.039, 0.0006, 0.0010 | 1.07, 0.07, 0.07 | 8.44, 2.60, 2.49 |

Reference copies of the same 4.03 GB from GPU tensors into preallocated host tensors: pageable, first copy 28.09 s, second 0.068 s (59 GB/s); pinned, 0.068 s both times (59 GB/s).

### NCCL-only process group

With `init_process_group("nccl")` and no CPU backend, `dcp.async_save` raised at once:

`AssertionError: A CPU backend must be enabled for async save; try initializing process group with 'cpu:gloo,cuda:nccl'`

## Verdicts

- **T04-21 and C04-2 confirmed in behaviour.** Called bare, `async_save` does all of its staging before it returns: training is blocked for the whole device-to-host copy, and on this host that was longer than a synchronous `dcp.save` of the same bytes, because the default stager copies into freshly allocated pageable memory each time and first touch of new pageable memory was slow here. With an explicit pinned stager the call returned in about a millisecond and staging finished in the background; once the stager's pinned buffers existed (repetitions 2 and 3) staging took 0.07 to 0.14 s.
- **C04-3 confirmed at the API.** PyTorch 2.15.0's `async_save` rejects a process group without a CPU backend. A training script that initialises NCCL only, as register 04 reads AWS's HyperPod managed tiered checkpointing example to do, cannot call `torch.distributed.checkpoint.async_save` unchanged. Wave 2 W4 (`wave2-reliability.md`, U04-4) read the library: it has no process-group code, and AWS's example calls `async_save` itself after creating an NCCL-only group, so this rejection applies to the example unchanged.
- **U04-9 narrowed.** The blocking time of the bare call equals the staging copy; how long that copy takes for a 3.9 GB shard on an H100 over PCIe stays open (A3, on hold).

## What the dive uses

Section 18: "`async_save` called bare blocks training for the whole copy; pass a pinned-memory stager, as TorchTitan's `async_with_pinned_mem` mode does", with this run's millisecond-against-seconds contrast labelled as measured on a GB10 with unified memory, and the NCCL-only `AssertionError` quoted. Calculator D's "blocking time" input default for an asynchronous save stays a user input, with this run cited for the shape of the difference, not for H100 numbers.

## Host safety record

Preflight (UTC 18:57:28): 52 GB available. The watchdog's lowest reading was 37 GB available, well above the 15 GB kill line. Exit code 0 for the main run and for the NCCL-only run. Every checkpoint directory was deleted after its save.
