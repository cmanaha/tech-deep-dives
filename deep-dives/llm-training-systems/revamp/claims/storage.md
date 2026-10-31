# Claims: section 23, Storage for Training

File: `src/sections/Storage.tsx`. Re-opened on 2026-10-31 (fetched with curl, default user agent, no identifying headers, into `/tmp/stor23-src/`): Megatron Core core_v0.20.0 (685fb8bd970185e9ac3283fe32a5d6667bf4b268) `megatron/core/datasets/indexed_dataset.py`, `megatron/core/datasets/gpt_dataset.py`, `tools/preprocess_data.py`; PyTorch v2.15.0 (31a77fc9c0a7c6fff15a1ff58c743f53b1a9d457) `torch/distributed/checkpoint/filesystem.py`; s3torchconnector v1.5.0 (c4f482629523d8fd2ec6080f70bda5966f90d89a) `README.md`, `dcp/s3_file_system.py`, `_s3client/s3client_config.py`; Mountpoint mountpoint-s3-1.24.0 (12fec077f06acf931309fdab7e7433d5fd2ae189) `doc/SEMANTICS.md`; arXiv 2407.21783v3 HTML (Sec 3.3.1, Table 4); AWS pages: FSx `ssd-storage.html`, `performance.html`, `importing-files.html`, `efa-file-systems.html`, `using-fsx-lustre.html`, `fsx-data-repositories.html`; S3 `optimizing-performance.html`, `s3-express-performance.html`, `directory-bucket-high-performance.html`, `mountpoint.html`; EC2 `ac.html` and `instance-store-lifetime.html`; SageMaker `managed-tier-checkpointing.html`. All tags confirmed against their SHAs with `git ls-remote`. Cited from the register without re-opening, with `accessed="2026-10-30"`: PaLM 2204.02311v5, MegaScale 2402.15627v1, metaseq `27_percent_update.md`, the three Hugging Face model metadata pages, llama-models `tokenizer.py`, the NVIDIA H100 page and the AmazonFSx price file (T00-1).

Every worked number is computed at render time from `src/lib/runtime.ts` (`estimateRun`, Calculator A) and `src/lib/checkpoint.ts` (`checkpointSize`, `checkpointPlan`, Calculator D), with the same inputs as section 18's worked cases: Llama 3.1 70B, 70,553,706,496 parameters, 14 bytes per parameter, 32 p5.48xlarge (256 H100), 512 x 8,192 tokens per step, 989.5 TFLOPS, MFU 0.40, attention 'none', r_f 6.50, u_0 600 s, w_cp 60 s (synchronous) or 2 s (asynchronous). The rendered values (read back from the built page) match the hand arithmetic below. Bytes per token come from a section-local function mirroring Megatron's `optimal_dtype` (vocabulary below 65,500: 2 bytes, else 4).

Format: claim | source URL | register, wave 2 row or experiment

## Introduction (h1)

- Llama 3.1 70B on 256 H100 reads about 0.96 MB/s of tokens and needs 16.5 GB/s to write its checkpoint in 60 s | derived, Calculators A and D | 04 W5, W4-33, 04 W2, W4-20
- The two paths differ by about four orders of magnitude for text pre-training | derived: 16.46 GB/s / 0.957 MB/s = 17,200 | 04 W5 reading, W4-33
- FSx for Lustre is AWS's managed Lustre parallel file system | https://docs.aws.amazon.com/fsx/latest/LustreGuide/using-fsx-lustre.html | T05-35 (definition only, no Cite in the intro)

## What the data loader reads

- About 6 FLOPs per parameter per token, forward and backward | https://arxiv.org/abs/2204.02311v5 Appendix B | T01-18 (accessed 2026-10-30)
- Llama 3.1 70B has 70,553,706,496 parameters | https://huggingface.co/api/models/meta-llama/Llama-3.1-70B | T01-3 (accessed 2026-10-30)
- 40% MFU is an assumption inside Llama 3's measured 38% to 43% | https://arxiv.org/abs/2407.21783v3 Table 4 | T01-6, build-log "default MFU"
- H100 dense BF16 peak 989.5 TFLOPS, half the "with sparsity" figure (vendor claim) | https://www.nvidia.com/en-us/data-center/h100/ | T05-14 (accessed 2026-10-30)
- About 935 tokens/s per GPU; about 239,000 tokens/s for the job; one step of 512 x 8,192 tokens every 17.5 s | derived, `estimateRun` (0.40 x 989.5e12 / (6 x 70,553,706,496) = 935.0; x 256 = 239,360; 4,194,304 / 239,360 = 17.52 s) | 04 W5, W4-33, build-log "default MFU" (935 per H100)
- Megatron's preprocessing writes a `.bin` of token IDs and an `.idx` index | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/tools/preprocess_data.py#L170-L177 | T04-50 (re-opened)
- The training reader memory-maps the `.bin` file (`_MMapBinReader`, `numpy.memmap`) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/datasets/indexed_dataset.py#L392-L402 | T04-50
- Token width `uint16` below 65,500 entries, `int32` otherwise | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/datasets/indexed_dataset.py#L114-L126 | T04-50
- Llama 3's tokenizer has 128,256 entries | https://github.com/meta-llama/llama-models/blob/5fdf83110cc9daa7435dfba6eb304892cc0041b8/models/llama3/tokenizer.py | T01-2 (accessed 2026-10-30, via `SOURCES.llamaTokenizer`)
- 4 bytes per token; 0.96 MB/s whole job; 30 KB/s per instance; 3.7 KB/s per GPU | derived (239,360 x 4 = 957,440 B/s; 935 x 8 x 4 = 29,920 B/s; 935 x 4 = 3,740 B/s) | 04 W5, W4-33
- Llama 3 405B ran at 400 TFLOPs per GPU on 16,384 GPUs | https://arxiv.org/abs/2407.21783v3 Table 4 | T01-6 (re-opened)
- That run would read about 10.8 MB/s in the same format; our model, Meta does not publish bytes per token | derived (400e12 / (6 x 405,853,388,800) = 164.3; x 16,384 x 4 = 10.77 MB/s) | 04 W5, W4-33 (SCOPE NARROWER replacement wording followed)
- Fabric "a sustainable throughput of 2 TB/s and a peak throughput of 7 TB/s" | https://arxiv.org/abs/2407.21783v3 Sec 3.3.1 | T04-5, W4-33 (rated capability)
- 70B checkpoint about 988 GB at 14 bytes per parameter | derived, `checkpointSize` (987.75 GB) | 04 W2, W4-16
- 60 s synchronous save needs 16.5 GB/s, about 17,000 times the token rate | derived, `checkpointPlan` (16.46 GB/s; ratio 17,193 to two significant digits) | 04 W2, W4-20
- Asynchronous save needs 0.77 GB/s over its 21.5-minute interval, about 800 times the tokens | derived, `checkpointPlan` (987.75 GB / 1,289 s = 0.766 GB/s; ratio 800) | 04 W2 as corrected by wave2-reliability G9, W4-18
- Text tokens are cheap; checkpoints are not | mental model from SCOPE section 23 | 04 W5 [our reading]

### Expandable: the data-path arithmetic

- Formula bytes/s = GPUs x MFU x peak / (6N) x bytes per token | derived from `estimateRun` | 04 W5
- 8B: 8,215 tokens/s per GPU, 8.4 MB/s on 256 H100 | derived (0.40 x 989.5e12 / (6 x 8,030,261,248) = 8,215; x 256 x 4 = 8.41 MB/s) | 04 W5
- 8,030,261,248 and 405,853,388,800 parameters | https://huggingface.co/api/models/meta-llama/Llama-3.1-8B, https://huggingface.co/api/models/meta-llama/Llama-3.1-405B | T01-3 (accessed 2026-10-30)
- Counting attention FLOPs gives fewer tokens per second, so these are upper bounds at the stated utilisation | our reading, consistent with build-log "default MFU" (TorchTitan's count gives about 820 for 70B) | W6-9 (no number printed)
- A vocabulary below 65,500 entries halves the bytes per token | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/datasets/indexed_dataset.py#L114-L126 | T04-50

## Two paths, two budgets (diagram and text)

- Diagram numbers: 0.96 MB/s, 30 KB/s per instance, 935 tokens/s per GPU, 4 bytes per token, 3.86 GB per GPU, 30.9 GB per instance, 988 GB, 16.5 GB/s, 0.77 GB/s, 21.5 min, 14 min from 1,200 GiB, 53 s from 19,200 GiB | each matches a prose claim in this file; all computed by Calculators A and D | 04 W2, 04 W5
- Once near the GPUs, the corpus is served from page cache or local NVMe after the first read; the storage budget belongs to the checkpoint path | our reading | 04 W5 reading

## Where storage binds

- Meta: "the highly bursty checkpoint writes that saturate the storage fabric for short durations" is a major challenge | https://arxiv.org/abs/2407.21783v3 Sec 3.3.1 | T04-5
- 3.86 GB per GPU and 30.9 GB per instance, 16.5 GB/s together for a 60 s save | derived, `checkpointSize`, `checkpointPlan` | 04 W2, W4-20, W4-38
- MegaScale: restart read on the critical path, storage bandwidth the bottleneck, one worker per data-parallel group reads and broadcasts | https://arxiv.org/abs/2402.15627v1 Sec 4.4 | T04-14 (accessed 2026-10-30)
- OPT-175B restarts stalled when downloads of a 1.6 TB checkpoint in 992 files of about 1.7 GB started hanging | https://github.com/facebookresearch/metaseq/blob/f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7/projects/OPT/chronicles/27_percent_update.md#L19 | T04-18, W4-29, W4-31 (accessed 2026-10-30)
- Smallest SSD size 1,200 GiB of PERSISTENT-1000 reads the 70B checkpoint in about 14 minutes; 19,200 GiB in about 53 s | derived: `roundUpToFsxSize` via `checkpointPlan`, read time = bytes / (TiB x 1,000 MBps), the same expression section 18 uses (843 s and 52.7 s) | section 18 (committed), W4-21, U04-7
- PERSISTENT-1000 is FSx for Lustre's 1,000 MBps-per-TiB tier | https://docs.aws.amazon.com/fsx/latest/LustreGuide/ssd-storage.html | T04-29, R1 gloss table
- Megatron caches sample and shuffle indices as `.npy` files in a `cache` directory beside the data by default, rank 0 rebuilds them when missing | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/datasets/gpt_dataset.py#L505-L545 | NEW (lines 505 to 509 default path under `path_prefix/cache/`, 511 to 531 cache-hit check, 536 to 545 rank-0 build); extends T04-45
- Keep the corpus and that cache where a replacement node can read them | our reading | T04-45 use note
- S3: at least 3,500 PUT/COPY/POST/DELETE or 5,500 GET/HEAD per second per partitioned prefix, gradual scaling, 503 Slow Down | https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html | T04-27, T05-39, W4-35
- `S3MapDataset` lists every object under its prefix at first access, "might take some time and may give the impression of being unresponsive" | https://github.com/awslabs/s3-connector-for-pytorch/blob/v1.5.0/README.md#L74-L79 | T04-51
- A data repository association created with the import option imports metadata for all objects | https://docs.aws.amazon.com/fsx/latest/LustreGuide/importing-files.html | T05-38, W4-34
- A few hundred large shards keep listing and request counts small | our reading | T04-51 use note
- Non-text data carries far more bytes per example; not covered | our reading | 04 W5 reading

## Pick the tier for each path

- FSx SSD disk throughput 125, 250, 500 or 1,000 MBps per TiB by tier | https://docs.aws.amazon.com/fsx/latest/LustreGuide/ssd-storage.html | T04-29, T05-35, W4-34
- Writes and uncached reads run at the lower of network and disk throughput | https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html | T04-29
- Burst credits are for reads; PERSISTENT-1000 lists no disk burst; size on baseline | https://docs.aws.amazon.com/fsx/latest/LustreGuide/ssd-storage.html | U04-7 (burst closed, G6)
- AWS does not define the MB in bytes on these pages; two significant digits | U04-7 accept-as-hedge text | wave2-reliability G6
- Persistent replaces a failed file server within minutes while clients retry; scratch does not, and clients get an immediate I/O error | https://docs.aws.amazon.com/fsx/latest/LustreGuide/using-fsx-lustre.html | T05-35 (re-opened; the I/O-error quote is NEW to the register: "If clients try to access data that is on the unavailable server or disk, clients experience an immediate I/O error")
- EFA supported on Persistent 2 with a metadata configuration; chosen at creation, cannot be enabled or disabled later; same Availability Zone; Nitro v4 or later, excluding trn2 | https://docs.aws.amazon.com/fsx/latest/LustreGuide/efa-file-systems.html | T05-37, W4-34
- Per-client ceilings 100 Gbps without EFA, 700 over EFA, 1,200 with GPUDirect Storage | https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html | T04-30, T05-36, W4-34
- Each instance writes about 0.51 GB/s (4.1 Gbps) during a 60 s save, so aggregate throughput binds | derived (16.46 / 32 = 0.514 GB/s) | W4-20
- Data repository association lazy-loads on first read, serves later reads itself, can preload a file system or directory in parallel | https://docs.aws.amazon.com/fsx/latest/LustreGuide/importing-files.html | T05-38 (preload sentence NEW: "You can also preload your whole file system or a directory within your file system ... FSx for Lustre loads files from your Amazon S3 data repository in parallel")
- A file system linked to S3 cannot be backed up | https://docs.aws.amazon.com/fsx/latest/LustreGuide/fsx-data-repositories.html | T05-38
- S3 Connector default part size 8 MiB | https://github.com/awslabs/s3-connector-for-pytorch/blob/v1.5.0/s3torchconnector/src/s3torchconnector/_s3client/s3client_config.py#L13-L25 | W4-22, U04-8 closed
- One 70B checkpoint is 117,750 part uploads, about 34 s of one prefix's documented rate | derived, `checkpointPlan` (ceil(987,751,890,944 / 8,388,608) = 117,750; / 3,500 = 33.6 s) | W4-22, build-log calculator note (117,750 exact)
- S3 Express One Zone: directory buckets in one Availability Zone, up to 200,000 reads and 100,000 writes per second by default, more on request through AWS Support | https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-performance.html | T05-40, T04-28, W4-35
- Designed for 99.95% availability within a single Availability Zone | https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-bucket-high-performance.html | T05-40
- A burst target next to the cluster, regional bucket for the kept copy | our reading | T05-40 use note
- Connector provides datasets and checkpoints "without first saving to local storage" | https://github.com/awslabs/s3-connector-for-pytorch/blob/v1.5.0/README.md#L7-L15 | T04-25
- `S3IterableDataset` with `enable_sharding=True` gives each worker on every host a distinct subset; `S3MapDataset` with `DistributedSampler` | https://github.com/awslabs/s3-connector-for-pytorch/blob/v1.5.0/README.md#L327-L350 | T04-51
- Writer defaults to one I/O thread (`thread_count: int = 1`) and subclasses `FileSystemWriter` | https://github.com/awslabs/s3-connector-for-pytorch/blob/v1.5.0/s3torchconnector/src/s3torchconnector/dcp/s3_file_system.py#L271-L303 | T04-26, W4-23
- `FileSystemWriter` is a `BlockingAsyncStager` at v2.15.0, so a bare `async_save` through it blocks for the copy | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/checkpoint/filesystem.py#L973 | W4-13, W4-23, G3, build-log "Async checkpointing"
- Mountpoint built for high read throughput to large objects and sequential writes of new objects | https://github.com/awslabs/mountpoint-s3/blob/mountpoint-s3-1.24.0/doc/SEMANTICS.md#L3 | T05-41, W4-36
- One writer at a time | https://github.com/awslabs/mountpoint-s3/blob/mountpoint-s3-1.24.0/doc/SEMANTICS.md#L84-L85 | T05-41, W4-36
- Mountpoint does not emulate `rename` on general purpose buckets | https://github.com/awslabs/mountpoint-s3/blob/mountpoint-s3-1.24.0/doc/SEMANTICS.md#L8 | T05-41
- Atomic rename only on S3 Express One Zone; rejected where unsupported | https://github.com/awslabs/mountpoint-s3/blob/mountpoint-s3-1.24.0/doc/SEMANTICS.md#L20-L21 | T05-41
- DCP's `FileSystemWriter.finish` writes `.metadata.tmp` and renames it to `.metadata` | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/checkpoint/filesystem.py#L762-L798 | NEW (code, re-read 2026-10-31)
- So `dcp.save` into a Mountpoint path on a general purpose bucket fails at its last step; not run | our reading of both codes | T05-41 derived use note, now with the DCP code side; untested (A3 does not cover it)
- The connector's file system emulates rename with copy and delete | https://github.com/awslabs/s3-connector-for-pytorch/blob/v1.5.0/s3torchconnector/src/s3torchconnector/dcp/s3_file_system.py#L150-L160 | NEW (code)
- For full POSIX semantics AWS recommends FSx for Lustre | https://docs.aws.amazon.com/AmazonS3/latest/userguide/mountpoint.html | T04-51
- Instance store 8 x 3,800 GB on p5, p5e, p5en, p6-b200, p6-b300; 3 x 7,500 GB on p6e-gb200; 4 x 1,900 GB on trn1 and trn2 | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T05-42, W4-37
- 30.4 TB per p5.48xlarge | derived (8 x 3,800 GB) | T05-42 use note
- Instance store lives only as long as the instance; stop, hibernate or terminate erases it | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-store-lifetime.html | NEW source for T05-42's "ephemeral" ("the data does not persist if the instance is stopped, hibernated, or terminated")
- Use instance store as a cache in front of FSx or S3 | our reading | T05-42 use note
- p5.48xlarge host memory 2,048 GiB | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T05-2, W4-38
- 30.9 GB per instance is 1.4% of host memory per copy | derived (30.87e9 / (2,048 x 2^30) = 1.40%) | 04 W2, W4-38
- HyperPod managed tiered checkpointing: CPU memory primary tier, replicates to adjacent nodes, periodically persists to storage such as S3 | https://docs.aws.amazon.com/sagemaker/latest/dg/managed-tier-checkpointing.html | T04-31, T06-15

## Your storage plan

- Megatron `.bin`/`.idx` at 4 bytes per token for a 128K vocabulary; any tier keeps up at 0.96 MB/s | T04-50 and derived above | 04 W5 [our reading]
- Megatron Core's S3 reader needs `mmap` off, downloads the `.idx` to a cache and streams the `.bin` in blocks | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/core/datasets/indexed_dataset.py#L612-L618 and #L716-L724 | NEW (code: `if mmap: assert not object_storage_config`; `elif object_storage_config: assert not mmap`)
- Three floors: write rate, restart read rate, retention | section 18 (committed text) | 04 W2
- $0.600 per GB-month, PERSISTENT-1000, us-east-1, 2026-10-30 | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonFSx/current/us-east-1/index.json | T00-1 (accessed 2026-10-30)
- 60 s save: 16.5 GB/s, 19,200 GiB, $11,520 a month ($12,370 if decimal GB), reads back in about 53 s | derived, `checkpointPlan` (19,200 x 0.6; 19,200 x 2^30 / 1e9 x 0.6) | W4-21
- Asynchronous: 0.77 GB/s, 1,200 GiB at $720 a month, reads back in about 14 minutes | derived, `checkpointPlan` (1,200 x 0.6) | W4-21, G9
- S3 checkpoints: partitioned prefix strategy, more than one I/O thread, or S3 Express One Zone, with a pinned stager | section 18 and T04-26 | W4-22, W4-23
- A3 protocol (not yet run) in section 18: two p5.48xlarge, EFA-enabled PERSISTENT-1000 file system, S3 bucket | section 18 (committed), RESEARCH-GUIDE section 5 | build-log "AWS experiments"
