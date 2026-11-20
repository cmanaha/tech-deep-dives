# 05 The data pipeline: research register

## 1. Header

- **Research date:** 2026-11-20. Every URL in this file was accessed 2026-11-20.
- **Area:** stream 05 of the "Physical AI" dive. How robot data is collected (leader-arm teleoperation, hand-held rigs, fleets, human video), how LeRobot stores it (dataset format v3.0, video codecs), how it is processed and curated (decode, filter, embed, deduplicate), how it is multiplied (image transforms, demonstration multiplication in simulation, generative augmentation), and which part of the machine each stage loads.
- **Sections fed:** section 9 "Collecting Data", section 10 "Processing and Curating", section 11 "Augmentation and Synthetic Data".
- **Seed research:** seed 02 sections 1, 2 and 4, and seed 11 ("The data workload"). A seed claim is carried only where its source was re-fetched today.
- **Reader:** knows computers (IT or software), has no robotics background.
- **Quote policy:** quotes are verbatim from the pinned version, with house normalisation: curly quotes become straight quotes, typographic dashes become " - " or a hyphen, arrows are written "->", multiplication signs become "x". Ellipses mark omissions. Code is quoted with its file and line numbers at the pinned ref.
- **Verdicts:** NEW (recorded fresh from the primary source); CARRIED (seed NN, re-fetched); STALE; WRONG; UNKNOWN (see section 9).
- **Labels:** `[derived]` arithmetic with inputs shown; `[vendor claim]` and `[author reported]` for performance figures from the party that built the thing; `[our reading]` for synthesis; `[illustration]` for invented toy numbers.

### Tiers

| Tier | What it covers |
|---|---|
| Tier 0 | Our experiments (none in this file) |
| Tier 1 | Source code at a pinned tag or 40-character SHA; official docs; API responses; vendor support matrices |
| Tier 2 | First-party vendor or lab blogs and talks |
| Tier 3 | Papers ("peer-reviewed (venue)" only where the venue was confirmed, otherwise "preprint"); third-party technical analysis |
| Tier 4 | Tutorials and press. Used only to locate primary sources |

Code is the authority over documentation.

<!-- CURRENCY -->

<!-- PINNED -->

## 4. Claim register

Code URLs for LeRobot use `https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/` (tag v0.7.0, SHA confirmed today with `gh api repos/huggingface/lerobot/git/ref/tags/v0.7.0`). Paths below are relative to that root.

<!-- GROUP-A -->

### B. The LeRobot dataset format at v0.7.0

**F05-14. The LeRobot dataset format version at tag v0.7.0 is "v3.0". The default branch read today (`039e05183f38b02d28c5f6ac9dbc7ef1680728cd`, commit of 2026-11-20) holds the same value, so no newer format version was found.**
- Location: `src/lerobot/datasets/dataset_metadata.py` line 64 (tag v0.7.0 and default-branch head)
- Verdict: CARRIED (seed 02 section 2.1, re-fetched from code)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/dataset_metadata.py | Tier 1, code | code behaviour | `CODEBASE_VERSION = "v3.0"` (accessed 2026-11-20). The docs page states "`LeRobotDataset v3.0` is included in `lerobot >= 0.4.0`." (`docs/source/lerobot-dataset-v3.mdx` line 28).
- Use in dive: section 9, the format name and version the reader will see in `meta/info.json`.

**F05-15. A v3.0 dataset has three kinds of content: tabular signals (joint states, actions, timestamps) in Parquet files, camera frames encoded into MP4 files, and metadata as JSON and Parquet.**
- Location: `docs/source/lerobot-dataset-v3.mdx` lines 58-62, tag v0.7.0
- Verdict: CARRIED (seed 02 section 2.1, re-fetched)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/lerobot-dataset-v3.mdx | Tier 1, first-party docs | definition | "**Tabular data**: Low-dimensional, high-frequency signals (states, actions, timestamps) stored in **Apache Parquet**. ... **Visual data**: Camera frames concatenated and encoded into **MP4**. Frames from the same episode are grouped; videos are sharded per camera for practical sizes. ... **Metadata**: JSON/Parquet records describing schema (feature names, dtypes, shapes), frame rates, normalization stats, and **episode segmentation** (start/end offsets into shared Parquet/MP4 files)." (accessed 2026-11-20)
- Use in dive: section 9, the three-part picture of a dataset on disk.

**F05-16. The on-disk layout is six paths: `meta/info.json`, `meta/stats.json`, `meta/tasks.parquet`, `meta/episodes/chunk-XXX/file-XXX.parquet`, `data/chunk-XXX/file-XXX.parquet` and `videos/<camera key>/chunk-XXX/file-XXX.mp4`.**
- Location: `src/lerobot/datasets/utils.py` lines 96-103 and 174-177, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/utils.py | Tier 1, code | code behaviour | `INFO_PATH = "meta/info.json"` / `STATS_PATH = "meta/stats.json"` / `EPISODES_DIR = "meta/episodes"` / `DATA_DIR = "data"` / `VIDEO_DIR = "videos"` / `CHUNK_FILE_PATTERN = "chunk-{chunk_index:03d}/file-{file_index:03d}"` / `DEFAULT_TASKS_PATH = "meta/tasks.parquet"` / `DEFAULT_EPISODES_PATH = EPISODES_DIR + "/" + CHUNK_FILE_PATTERN + ".parquet"` / `DEFAULT_DATA_PATH = DATA_DIR + "/" + CHUNK_FILE_PATTERN + ".parquet"` / `DEFAULT_VIDEO_PATH = VIDEO_DIR + "/{video_key}/" + CHUNK_FILE_PATTERN + ".mp4"` (accessed 2026-11-20)
- Use in dive: section 9, the directory-tree diagram.

**F05-17. Many episodes share one file. The writer appends each new episode's video to the current MP4 until the file would reach the size target, then starts the next file; episode boundaries live in metadata, not in file names. Version 2 stored one file per episode.**
- Location: `src/lerobot/datasets/dataset_writer.py` lines 547-569; `docs/source/lerobot-dataset-v3.mdx` lines 19-22 and 64, tag v0.7.0
- Verdict: CARRIED (seed 02 section 2.1, re-fetched from code)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/dataset_writer.py | Tier 1, code | code behaviour | `if latest_size_in_mb + ep_size_in_mb >= self._meta.video_files_size_in_mb:` / `chunk_idx, file_idx = update_chunk_file_indices(chunk_idx, file_idx, self._meta.chunks_size)` ... `else:` / `concatenate_video_files([latest_path, ep_path], latest_path,)`. Docs: "**File-based storage**: Many episodes per Parquet/MP4 file (v2 used one file per episode)." and "To scale to millions of episodes, tabular rows and video frames from multiple episodes are **concatenated** into larger files. Episode-specific views are reconstructed **via metadata**, not file boundaries." (accessed 2026-11-20)
- Use in dive: section 9, why a 50-episode dataset is two MP4 files and one Parquet file (F05-27).

**F05-18. The size defaults at v0.7.0 are: at most 1,000 files per chunk directory, 100 MB per data Parquet file, 200 MB per video file.**
- Location: `src/lerobot/datasets/utils.py` lines 92-94 and 206-208, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/utils.py | Tier 1, code | code behaviour | `DEFAULT_CHUNK_SIZE = 1000  # Max number of files per chunk` / `DEFAULT_DATA_FILE_SIZE_IN_MB = 100  # Max size per file` / `DEFAULT_VIDEO_FILE_SIZE_IN_MB = 200  # Max size per file` (accessed 2026-11-20). A dataset written by an earlier release can carry another value in its own `info.json`: the public dataset in F05-27 records `"video_files_size_in_mb": 500`.
- Use in dive: section 9, the numbers on the layout diagram. Section 12 or later (storage): file count is frames times bytes per frame divided by 200 MB, not episode count.

**F05-19. When a chunk directory holds its 1,000th file, the file index returns to 0 and the chunk index goes up by one.**
- Location: `src/lerobot/datasets/utils.py` lines 329-335, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/utils.py | Tier 1, code | code behaviour | `def update_chunk_file_indices(chunk_idx: int, file_idx: int, chunks_size: int) -> tuple[int, int]:` / `if file_idx == chunks_size - 1:` / `file_idx = 0` / `chunk_idx += 1` / `else:` / `file_idx += 1` (accessed 2026-11-20)
- Use in dive: section 9, one line under the layout diagram.

**F05-20. Every frame row carries five bookkeeping columns that the recorder fills in: `timestamp` (float32), `frame_index`, `episode_index`, `index` and `task_index` (all int64).**
- Location: `src/lerobot/utils/constants.py` lines 109-115, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/utils/constants.py | Tier 1, code | code behaviour | `# Dataset meta-features (auto-populated by the recording pipeline)` / `DEFAULT_FEATURES = { "timestamp": {"dtype": "float32", "shape": (1,), "names": None}, "frame_index": {"dtype": "int64", "shape": (1,), "names": None}, "episode_index": {"dtype": "int64", "shape": (1,), "names": None}, "index": {"dtype": "int64", "shape": (1,), "names": None}, "task_index": {"dtype": "int64", "shape": (1,), "names": None}, }` (accessed 2026-11-20)
- Use in dive: section 9, the frame-row table.

**F05-21. For an SO-100/SO-101 two-camera dataset a frame row holds `action` (6 float32: the six joint targets), `observation.state` (6 float32: the six measured joint positions) and the five bookkeeping columns. The two camera features have dtype "video": their pixels are in the MP4 files, not in the Parquet row.**
- Location: `meta/info.json` of the hub dataset `lerobot/svla_so101_pickplace` at revision `f641879e22172be7e8161d5e6c1503c2d2feb657`
- Verdict: NEW
- Evidence: https://huggingface.co/datasets/lerobot/svla_so101_pickplace/resolve/f641879e22172be7e8161d5e6c1503c2d2feb657/meta/info.json | Tier 1, first-party dataset metadata (Hugging Face LeRobot organisation) | code behaviour (a file the recorder wrote) | `"action": { "dtype": "float32", "shape": [6], "names": ["shoulder_pan.pos", "shoulder_lift.pos", "elbow_flex.pos", "wrist_flex.pos", "wrist_roll.pos", "gripper.pos"]` ... `"observation.images.up": { "dtype": "video", "shape": [480, 640, 3], ... "video.codec": "av1", "video.pix_fmt": "yuv420p", ... "video.fps": 30,` (accessed 2026-11-20). The file records `"robot_type": "so100_follower"` although the dataset name says SO-101; the two arms share one follower class in LeRobot (stream 01, F01-9).
- Use in dive: section 9, the frame-row table with real column names.

**F05-22. The per-episode metadata rows say where each episode sits inside the shared files: which data file, the first and last global frame index, and per camera which video file plus the start and end time of the episode inside that file.**
- Location: `src/lerobot/datasets/dataset_writer.py` lines 497-500 and 586-589, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/dataset_writer.py | Tier 1, code | code behaviour | `"data/chunk_index": chunk_idx,` / `"data/file_index": file_idx,` / `"dataset_from_index": global_frame_index,` / `"dataset_to_index": global_frame_index + ep_num_frames,` and `f"videos/{video_key}/chunk_index": chunk_idx,` / `f"videos/{video_key}/file_index": file_idx,` / `f"videos/{video_key}/from_timestamp": latest_duration_in_s,` / `f"videos/{video_key}/to_timestamp": latest_duration_in_s + ep_duration_in_s,` (accessed 2026-11-20)
- Use in dive: section 9, the "episode index" table that makes shared files usable.

**F05-23. To fetch a camera frame, the reader takes the frame's timestamp inside its episode, adds the episode's `from_timestamp` offset for that camera, and asks the decoder for that time in the shared MP4. The default tolerance between the requested and the decoded timestamp is 0.0001 s.**
- Location: `src/lerobot/datasets/dataset_reader.py` lines 429-446; `src/lerobot/datasets/lerobot_dataset.py` line 61, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/dataset_reader.py | Tier 1, code | code behaviour | `shifted_query_ts = shift_timestamps(query_ts, ep[f"videos/{vid_key}/from_timestamp"])` / `video_path = self.root / self._meta.get_video_file_path(ep_idx, vid_key)` / `frames = decode_video_frames(video_path, shifted_query_ts, self._tolerance_s, self._video_backend,` and `lerobot_dataset.py`: `tolerance_s: float = 1e-4,` (accessed 2026-11-20)
- Use in dive: section 9 and section 10, "which number goes where" for one training sample.

**F05-24. `meta/stats.json` holds per-feature statistics used to normalise inputs and outputs. At v0.7.0 the running-statistics class computes mean, standard deviation, min, max and the quantiles 0.01, 0.10, 0.50, 0.90 and 0.99.**
- Location: `src/lerobot/datasets/compute_stats.py` lines 31-56; `docs/source/lerobot-dataset-v3.mdx` line 82, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/compute_stats.py | Tier 1, code | code behaviour | `DEFAULT_QUANTILES = [0.01, 0.10, 0.50, 0.90, 0.99]` and class docstring "standard deviation, min, max, and approximate quantiles." Docs: "**`meta/stats.json`**: global feature statistics (mean/std/min/max) used for normalization; exposed as `dataset.meta.stats`." (accessed 2026-11-20). The public dataset in F05-27, written by an earlier release, has only `min, max, mean, std, count` per feature; `src/lerobot/scripts/augment_dataset_quantile_stats.py` exists at the tag to add quantiles to such datasets.
- Use in dive: section 10, "compute statistics" as a curation step whose output training depends on.

**F05-25. Image statistics are computed on a sample, not on every frame: the number of sampled frames grows as the dataset length to the power 0.75, between 100 and 10,000, and frames larger than 300 pixels on the long side are subsampled toward 150.**
- Location: `src/lerobot/datasets/compute_stats.py` lines 219-252, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/compute_stats.py | Tier 1, code | code behaviour | `def estimate_num_samples(dataset_len: int, min_num_samples: int = 100, max_num_samples: int = 10_000, power: float = 0.75) -> int:` ... "- at 10000, num_samples=1000" ... `return max(min_num_samples, min(int(dataset_len**power), max_num_samples))` and `def auto_downsample_height_width(img: np.ndarray, target_size: int = 150, max_size_threshold: int = 300):` (accessed 2026-11-20)
- Use in dive: section 10, why the statistics pass is cheap next to decode.

**F05-26. Older datasets are converted with one script, `convert_dataset_v21_to_v30`, which merges per-episode Parquet and MP4 files into shared files and writes the episode offsets. A v2.1 dataset is refused at load time with a message naming that script.**
- Location: `docs/source/lerobot-dataset-v3.mdx` lines 304-317; `src/lerobot/datasets/utils.py` lines 36-45; `src/lerobot/scripts/convert_dataset_v21_to_v30.py`, tag v0.7.0
- Verdict: CARRIED (seed 02 section 2.1, re-fetched)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/lerobot-dataset-v3.mdx | Tier 1, first-party docs | documentation of support | "python -m lerobot.scripts.convert_dataset_v21_to_v30 --repo-id=<HF_USER/DATASET_ID>" ... "Aggregates parquet files: `episode_000000.parquet`, `episode_000001.parquet`, ... -> **`file-000.parquet`**, ..." / "Aggregates mp4 files: `episode_000000.mp4`, `episode_000001.mp4`, ... -> **`file-000.mp4`**, ..." / "Updates `meta/episodes/*` (chunked Parquet) with per-episode lengths, tasks, and byte/frame offsets." Code message: "We introduced a new format since v3.0 which is not backward compatible with v2.1." (accessed 2026-11-20). No converter for versions before v2.1 is in `src/lerobot/scripts/` at the tag (U6).
- Use in dive: section 9, one sentence on migration.

**F05-27. A public 50-episode SO-101 pick-and-place dataset, `lerobot/svla_so101_pickplace`, is nine files and 86.1 MB in total: 11,939 frames at 30 fps from two 640x480 cameras stored as AV1 in two MP4 files (45.5 MB and 40.1 MB), one 0.37 MB Parquet file of frame rows, and metadata.**
- Location: Hugging Face hub API, dataset `lerobot/svla_so101_pickplace`, revision `f641879e22172be7e8161d5e6c1503c2d2feb657` (last modified 2025-09-27); `meta/info.json`
- Verdict: NEW
- Evidence: https://huggingface.co/api/datasets/lerobot/svla_so101_pickplace/tree/main?recursive=true | Tier 1, hub API response for a first-party dataset (Hugging Face LeRobot organisation) | production report | file sizes in bytes: `data/chunk-000/file-000.parquet 369943`, `meta/episodes/chunk-000/file-000.parquet 72560`, `meta/info.json 3401`, `meta/stats.json 5914`, `meta/tasks.parquet 2246`, `videos/observation.images.side/chunk-000/file-000.mp4 45541633`, `videos/observation.images.up/chunk-000/file-000.mp4 40124489`; `info.json`: `"total_episodes": 50, "total_frames": 11939, ... "fps": 30` (accessed 2026-11-20). The dataset predates v0.7.0 and its `info.json` does not record GOP size or CRF, so the encoder settings behind these bytes are not known (U1).
- Use in dive: section 9, the worked example. This is the "real arm dataset" the page weighs.

**F05-28. [derived] That dataset is 6.6 minutes of robot time and its video costs about 775 MB per robot-hour for two cameras (about 387 MB per camera-hour, 0.86 Mbit/s per camera, 3,588 bytes per camera frame). The same frames uncompressed would be 199 GB per hour, a ratio of about 257 to 1. The joint data is about 31 bytes per frame, 3.3 MB per hour.**
- Location: arithmetic on F05-27
- Verdict: NEW
- Evidence: inputs from F05-27 | Tier 1 inputs, arithmetic ours | [derived] | 11,939 frames / 30 fps = 397.97 s = 0.11055 h. Video bytes 45,541,633 + 40,124,489 = 85,666,122. 85,666,122 / 0.11055 h = 774.9 MB/h. 85,666,122 / (11,939 x 2) = 3,588 bytes per camera frame. Raw RGB frame 640 x 480 x 3 = 921,600 bytes; 921,600 / 3,588 = 257. Raw rate 921,600 x 2 cameras x 30 fps x 3,600 s = 199.07 GB/h. Bitrate 85,666,122 x 8 / 397.97 s / 2 = 0.861 Mbit/s. Parquet 369,943 / 11,939 = 31.0 bytes per frame. Mean episode length 11,939 / 50 = 238.8 frames = 7.96 s.
- Use in dive: section 9, the strongest number of the collection section: an hour of two-camera arm data is under 1 GB encoded and about 200 GB raw. One dataset, one scene, one encoder setting: label it as an example, not a constant.

**F05-29. LeRobot can also read a dataset stored as Lance tables: `meta/` stays, a `frames` table holds the tabular data and a `videos` table holds the MP4 files as blobs. The format is read-only in LeRobot; conversion copies the videos without re-encoding.**
- Location: `docs/source/lerobot-dataset-v3.mdx` lines 354-366, tag v0.7.0
- Verdict: CARRIED (seed 02 section 2.1, re-fetched from the docs at the tag)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/lerobot-dataset-v3.mdx | Tier 1, first-party docs | documentation of support | "The layout keeps `meta/` unchanged and adds a `frames` table for the tabular data and a `videos` table holding the MP4s as blobs. `\"storage_format\": \"lance\"` in `meta/info.json` selects the reader" ... "**Convert at about the cost of a file copy.** Videos are not re-encoded, so items are bit-identical to the source. DROID converts in 34 minutes." ... "The format is read-only: record and edit datasets in the default format, then convert them with the [`lerobot-lancedb`](https://pypi.org/project/lerobot-lancedb/) package" (accessed 2026-11-20). "34 minutes" is a [vendor claim] with no hardware stated.
- Use in dive: section 10, one line: curation columns (scores, embeddings) can be added next to the frames without rewriting video.

**F05-30. Streaming mode trains without downloading the dataset first: `--dataset.streaming=true` fetches whole episodes (Parquet rows and compressed MP4 byte ranges) into a bounded in-memory pool, and each selected frame is still visited once per epoch.**
- Location: `docs/source/lerobot-dataset-v3.mdx` lines 135-139; `docs/source/training_dataset_streaming.mdx` "How an epoch is read", tag v0.7.0
- Verdict: CARRIED (seed 02 section 2.1, re-fetched from the docs at the tag)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/training_dataset_streaming.mdx | Tier 1, first-party docs | documentation of support | "Set `--dataset.streaming=true` to train without first downloading the dataset's Parquet and video files. Episodes are fetched on the fly into a bounded in-memory pool, and every selected frame is still visited exactly once per epoch" and "Parquet columns and compressed MP4 byte ranges are prefetched from the same byte-aware admission frontier." (accessed 2026-11-20)
- Use in dive: section 9 (format) and section 10 (what the loader does when the data sits in object storage).

**F05-31. Streaming defaults in code: off by default, 8 episodes prefetched per worker, an 8 GB byte budget, 2 decode threads, a queue of 8 decoded samples. If the pool size is unset, a rank mixes 32 episodes split across its workers.**
- Location: `src/lerobot/configs/default.py` lines 57-70; `docs/source/training_dataset_streaming.mdx` "Workers, shards and concurrency", tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/configs/default.py | Tier 1, code | code behaviour | `streaming: bool = False` / `streaming_episode_pool_size: int | None = None` / `streaming_prefetch_episodes: int = 8` / `streaming_byte_budget_gb: float = 8.0` / `streaming_decode_threads: int = 2` / `streaming_decoded_queue_size: int = 8`. Docs: "If you do not set it, the rank mixes 32 episodes and each of the N workers gets 32/N of them." (accessed 2026-11-20)
- Use in dive: section 10, the memory and CPU knobs of the streaming loader.

**F05-32. Streaming needs an index of every MP4 (a "sidecar") that maps frames to byte ranges. If no published sidecar exists, LeRobot builds one locally on the first run; `lerobot-build-mp4-sidecar` builds it ahead of time.**
- Location: `docs/source/training_dataset_streaming.mdx` "MP4 sidecars and the first run", tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/training_dataset_streaming.mdx | Tier 1, first-party docs | documentation of support | "Video streaming uses an MP4 index sidecar. Dataset initialization first checks the revision-keyed local cache, then looks for a valid published sidecar. If neither is available, LeRobot builds the sidecar locally while holding a process lock and installs it atomically." (accessed 2026-11-20). "Maps frames to byte ranges" is [our reading] of "MP4 index" together with "compressed MP4 byte ranges" in F05-30.
- Use in dive: section 10, why the first streaming run starts slower than later ones.

### C. Codecs: how the camera frames are compressed and read back

**F05-33. LeRobot v0.7.0 encodes camera video with the SVT-AV1 software encoder by default: codec `libsvtav1`, pixel format `yuv420p`, GOP size 2, CRF 30, and SVT-AV1 preset 12 when no preset is given.**
- Location: `src/lerobot/configs/video.py` lines 47 and 89-93 and 109-110, tag v0.7.0
- Verdict: CARRIED (seed 02 section 2.2; the seed took the GOP value from a secondary summary, now read from code)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/configs/video.py | Tier 1, code | code behaviour | `LIBSVTAV1_DEFAULT_PRESET: int = 12` / `vcodec: str = "libsvtav1"  # Video codec name. "auto" picks a hardware codec if available, else libsvtav1.` / `pix_fmt: str = "yuv420p"  # Pixel format (e.g. yuv420p).` / `g: int | None = 2  # GOP size (keyframe interval).` / `crf: int | float | None = 30  # Quality level. Lower means better quality and larger files.` / `if self.preset is None and self.vcodec == "libsvtav1": self.preset = LIBSVTAV1_DEFAULT_PRESET` (accessed 2026-11-20)
- Use in dive: section 9, the codec box: four settings, each explained in one line.

**F05-34. A GOP (group of pictures) size of 2 means a keyframe, a frame stored whole, every second frame. The docs define the option as "a keyframe every `g` frames".**
- Location: `docs/source/video_encoding_parameters.mdx`, "Tuning parameters" table, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/video_encoding_parameters.mdx | Tier 1, first-party docs | definition | "`g` | `int` | `2` | GOP size - a keyframe every `g` frames. Emitted as FFmpeg option `g`." and "The defaults are tuned to balance **compression ratio**, **visual quality**, and **decoding/seek speed** for typical robotics datasets." (accessed 2026-11-20)
- Use in dive: section 9, the GOP definition at first use.

**F05-35. Why GOP size matters for training: a training batch asks for frames at random positions, and to produce one frame a decoder must start at the previous keyframe and decode every frame up to the one requested. LeRobot's own code says so.**
- Location: `src/lerobot/datasets/video_utils.py`, docstrings of `decode_video_frames_pyav` (lines 187-189) and `decode_video_frames_torchcodec` (lines 434-438), tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/video_utils.py | Tier 1, code | definition | "Video benefits from inter-frame compression. Instead of storing every frame individually, the encoder stores a reference frame (or a key frame) and subsequent frames as differences relative to that key frame. As a consequence, to access a requested frame, we need to load the preceding key frame, and all subsequent frames until reaching the requested frame. The number of key frames in a video can be adjusted during encoding to take into account decoding time and video size in bytes." (accessed 2026-11-20). [derived] With GOP 2 the worst case is 2 decoded frames per requested frame; with a GOP of 250 (a common streaming-video setting, [illustration]) the worst case is 250 and the average about 125.
- Use in dive: section 9 and section 10, the mechanism that links a recording-time setting to training-time CPU load.

**F05-36. Video encoding at record time goes through PyAV (the Python binding to FFmpeg); it is the only encoding backend at v0.7.0.**
- Location: `src/lerobot/configs/video.py` lines 95-97, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/configs/video.py | Tier 1, code | code behaviour | `video_backend: str = "pyav"  # Encoding backend. Only "pyav" is currently supported.` (accessed 2026-11-20). `pyproject.toml` line 153 pins `av>=15.0.0,<16.0.0`.
- Use in dive: section 9, names the library under the recorder.

**F05-37. At training time the default decode backend is torchcodec (the PyTorch project's video decoder) wherever it is installed and can load FFmpeg; PyAV is the fallback. LeRobot runs torchcodec on the CPU.**
- Location: `src/lerobot/utils/import_utils.py` lines 91-105; `src/lerobot/configs/default.py` line 50; `src/lerobot/datasets/video_utils.py` lines 136-146, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/video_utils.py | Tier 1, code | code behaviour | "backend (str, optional): Backend to use for decoding. Defaults to \"torchcodec\" when available in the platform; otherwise, defaults to \"pyav\"." / "Currently supports torchcodec on cpu and pyav." and `default.py`: `video_backend: str = field(default_factory=get_safe_default_video_backend)`; `import_utils.py`: `if importlib.util.find_spec("torchcodec"):` ... `return "torchcodec"` (accessed 2026-11-20). `pyproject.toml` lines 123-125 pin `torchcodec>=0.3.0,<0.18.0` on Linux x86_64 and macOS arm64 and `torchcodec>=0.11.0,<0.18.0` on Linux aarch64.
- Use in dive: section 10, "decode runs on CPU cores in the dataloader workers" is a statement about LeRobot's default path, from code.

**F05-38. The torchcodec path converts each requested timestamp to a frame index (`round(timestamp x average fps)`) and fetches those frames in one call; decoders are kept in a cache of 100 open files per process by default.**
- Location: `src/lerobot/datasets/video_utils.py` lines 290-299 and 448-455, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/video_utils.py | Tier 1, code | code behaviour | `frame_indices = [round(ts * average_fps) for ts in timestamps]` / `frames_batch = decoder.get_frames_at(indices=frame_indices)` and `DEFAULT_DECODER_CACHE_SIZE = 100` with "Each cached entry retains a torchcodec ``VideoDecoder`` plus an open ``fsspec`` file handle - on the order of a few MB per entry." (accessed 2026-11-20)
- Use in dive: section 10, the last step of "timestamp to pixels" (F05-23).

**F05-39. The code warns against GPU decode inside dataloader workers: setting the torchcodec device to CUDA outside the main process leads to CUDA initialisation errors.**
- Location: `src/lerobot/datasets/video_utils.py` line 432, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/datasets/video_utils.py | Tier 1, code | code behaviour | "Note: Setting device=\"cuda\" outside the main process, e.g. in data loader workers, will lead to CUDA initialization errors." (accessed 2026-11-20)
- Use in dive: section 10, why the GPU's hardware decoder is not simply switched on in the stock training loop.

**F05-40. LeRobot lists six hardware encoders it can use at record time: `h264_videotoolbox` and `hevc_videotoolbox` (macOS), `h264_nvenc` and `hevc_nvenc` (NVIDIA), `h264_vaapi` (Linux Intel/AMD) and `h264_qsv` (Intel Quick Sync). `vcodec=auto` picks the first one available and falls back to `libsvtav1`. No AV1 hardware encoder is in the list.**
- Location: `src/lerobot/configs/video.py` lines 33-45 and 182-190, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/configs/video.py | Tier 1, code | code behaviour | `HW_VIDEO_CODECS = [ "h264_videotoolbox",  # macOS "hevc_videotoolbox",  # macOS "h264_nvenc",  # NVIDIA GPU "hevc_nvenc",  # NVIDIA GPU "h264_vaapi",  # Linux Intel/AMD "h264_qsv",  # Intel Quick Sync ]` / `VALID_VIDEO_CODECS: frozenset[str] = frozenset({"h264", "hevc", "libsvtav1", "libaom-av1", "auto", *HW_VIDEO_CODECS})` / `logger.warning("No hardware encoder available, falling back to software encoder 'libsvtav1'")` (accessed 2026-11-20)
- Use in dive: section 9, the "CPU too slow to encode" escape hatch, and the cost: a hardware-encoded dataset is H.264 or HEVC, not AV1.

**F05-41. The trade the docs state: `libsvtav1` gives the smallest files at high CPU use; software `h264` gives files "~30-50% larger" at medium CPU use; hardware encoders give the largest files at very low CPU use.**
- Location: `docs/source/streaming_video_encoding.mdx` section 4 "Choosing a Codec", tag v0.7.0
- Verdict: CARRIED (seed 02 section 2.2, re-fetched at the tag)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/streaming_video_encoding.mdx | Tier 1, first-party docs | documentation of support, [vendor claim] for the size figure | "`libsvtav1` (default) | High | Smallest | Best | Default. Best compression but most CPU-intensive" / "`h264` | Medium | ~30-50% larger | Good | Software H.264. Lower CPU" / "HW encoders | Very Low | Largest | Good | Offloads to dedicated hardware. Best for CPU-constrained systems" and "`libsvtav1` is the default because it provides the best training performance; other vcodecs can reduce CPU usage and be faster, but they typically produce larger files and may affect training time." (accessed 2026-11-20)
- Use in dive: section 9, the codec comparison table.

**F05-42. By default the recorder writes each frame as a PNG and encodes the episode to MP4 after it ends. With `--dataset.streaming_encoding=true` frames go straight to an encoder thread during capture, which makes saving an episode near-instant and puts the encode load on the CPU during the control loop.**
- Location: `docs/source/streaming_video_encoding.mdx` sections 1 to 3; `src/lerobot/configs/dataset.py` lines 65-73, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/streaming_video_encoding.mdx | Tier 1, first-party docs | documentation of support | "Capture frame -> write PNG to disk -> (at episode end) read PNG's -> encode to MP4 -> delete PNG's" / "Capture frame -> queue to encoder thread -> encode to MP4 directly" / "Streaming encoding means the CPU is encoding video **during** the capture loop, not after." Code: `streaming_encoding: bool = False` / `encoder_queue_maxsize: int = 30` / `encoder_threads: int | None = None` (accessed 2026-11-20)
- Use in dive: section 9, the two recording paths and where the CPU load falls.

**F05-43. The docs size the encode load in pixels per second: two 640x480 cameras at 30 fps are 55 million pixels per second ("Low", "Works on most systems"); two 1920x1080 cameras are 373 million ("High", "Requires powerful high-end CPU"). When the encoder falls behind, frames are dropped, not blocked.**
- Location: `docs/source/streaming_video_encoding.mdx` section 3, tag v0.7.0
- Verdict: CARRIED (seed 02 section 2.2, re-fetched at the tag)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/streaming_video_encoding.mdx | Tier 1, first-party docs | documentation of support | "2camsx 640x480x3 @30fps | 55M | Low | Works on most systems" / "2camsx 1920x1080x3 @30fps | 373M | High | Requires powerful high-end CPU" / "New frames are **dropped** (not blocked) - the capture loop continues uninterrupted" / "If ~5% of frames are missing, your system is likely overloaded" (accessed 2026-11-20). [derived] 640 x 480 x 3 x 30 x 2 = 55.3 million; the docs count the three colour channels.
- Use in dive: section 9, the arm task's two 640x480 cameras sit in the lightest row; the dropped-frame warning is the practical check.

### D. Hardware video engines: which GPUs can encode and decode which codec

All rows in this group are from one page, NVIDIA's "Video Encode and Decode Support Matrix", fetched 2026-11-20 as HTML and parsed row by row: https://developer.nvidia.com/video-encode-decode-support-matrix. The page carries no revision date; the pin is the access date. NVENC is NVIDIA's name for the fixed-function video encoder circuit on a GPU and NVDEC for the decoder circuit; both are separate from the cores that run neural networks. "AV1 decode" below is the pair of columns "AV1 8 Bit / 10 Bit" in the decode table; "AV1 encode" is the column "AV1 YUV 4:2:0" in the encode table.

**F05-44. The A100 has no hardware video encoder and cannot hardware-decode AV1: 0 NVENC, 5 NVDEC, AV1 decode NO.**
- Location: support matrix, "Server (Data Center)" tab, encode table row "NVIDIA A100" and decode table row "NVIDIA A100"
- Verdict: CARRIED (seed 02 section 2.2, re-fetched)
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode row: "NVIDIA A100 | Ampere | 7th Gen | 0 | 0 | 0 | N/A ..."; decode row: "NVIDIA A100 | Ampere | 4th Gen | 1 | 5 | 5 | ... AV1: NO | NO" (accessed 2026-11-20)
- Use in dive: section 10, the decode table; EC2 P4d.

**F05-45. The H100 (SXM, PCIe and NVL rows alike) has no hardware video encoder and cannot hardware-decode AV1: 0 NVENC, 7 NVDEC, AV1 decode NO.**
- Location: support matrix, "Server (Data Center)" tab, rows "NVIDIA H100 SXM", "NVIDIA H100 PCIe", "NVIDIA H100 NVL"
- Verdict: CARRIED (seed 02 section 2.2, re-fetched)
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode row: "NVIDIA H100 SXM | Hopper | N/A | 1 | 0 | 0 | N/A ..."; decode row: "NVIDIA H100 SXM | Hopper | 4th Gen | 1 | 7 | 7 | ... AV1: NO | NO" (accessed 2026-11-20)
- Use in dive: section 10, the strongest row of the table: LeRobot's default codec is AV1 (F05-33) and the most common training GPU cannot hardware-decode it. EC2 P5.

**F05-46. The Blackwell data-centre parts (HGX B200, HGX B300, GB200, GB300) have no hardware video encoder and 7 NVDEC engines that decode AV1.**
- Location: support matrix, "Server (Data Center)" tab, rows "NVIDIA HGX B200", "NVIDIA HGX B300", "NVIDIA GB200", "NVIDIA GB300"
- Verdict: CARRIED (seed 02 section 2.2, re-fetched; B300 and GB300 rows are new)
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode rows: "NVIDIA HGX B200 | Blackwell | N/A | 1 | 0 | 0 | N/A ..." and the same for HGX B300, GB200, GB300; decode rows: "NVIDIA HGX B200 | Blackwell | 6th Gen | 1 | 7 | 7 | ... AV1: YES | YES" and the same for HGX B300, GB200, GB300 (accessed 2026-11-20)
- Use in dive: section 10, the decode table; EC2 P6-B200, P6-B300, P6e-GB200.

**F05-47. The H200 has no row in the matrix as fetched today (the string "H200" does not occur in the page), so its engine count and AV1 decode support are not established here.**
- Location: support matrix, whole page (text search)
- Verdict: UNKNOWN (U2)
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | absence in the fetched page | `grep -c "H200"` on the fetched HTML returns 0 (accessed 2026-11-20). The H200 is a Hopper-generation part, so "same as H100" is a reasonable guess [our reading], but the matrix does not say it.
- Use in dive: section 10, leave the P5e/P5en row marked "not listed by NVIDIA" in the table.

**F05-48. The L4 has 2 NVENC and 4 NVDEC engines, and both encodes and decodes AV1.**
- Location: support matrix, "Server (Data Center)" tab, row "NVIDIA L4"
- Verdict: CARRIED (seed 02 section 2.2, re-fetched)
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode row: "NVIDIA L4 | Ada Lovelace | 8th Gen | 1 | 2 | 2 | Unrestricted | ... AV1 YUV 4:2:0: YES"; decode row: "NVIDIA L4 | Ada Lovelace | 5th Gen | 1 | 4 | 4 | ... AV1: YES | YES" (accessed 2026-11-20)
- Use in dive: section 10, EC2 G6: the cheapest card with a full AV1 path.

**F05-49. The L40S has 3 NVENC and 3 NVDEC engines, and both encodes and decodes AV1.**
- Location: support matrix, "Server (Data Center)" tab, row "NVIDIA L40S"
- Verdict: CARRIED (seed 02 section 2.2, re-fetched)
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode row: "NVIDIA L40S | Ada Lovelace | 8th Gen | 1 | 3 | 3 | Unrestricted | ... AV1 YUV 4:2:0: YES"; decode row: "NVIDIA L40S | Ada Lovelace | 5th Gen | 1 | 3 | 3 | ... AV1: YES | YES" (accessed 2026-11-20)
- Use in dive: section 10, EC2 G6e.

**F05-50. The RTX PRO 6000 Blackwell Server Edition has 4 NVENC and 4 NVDEC engines, and both encodes and decodes AV1.**
- Location: support matrix, "Server (Data Center)" tab, row "NVIDIA RTX PRO 6000 Blackwell Server Edition"
- Verdict: CARRIED (seed 02 section 2.2, re-fetched)
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode row: "NVIDIA RTX PRO 6000 Blackwell Server Edition | Blackwell | 9th Gen | 1 | 4 | 4 | Unrestricted | ... AV1 YUV 4:2:0: YES"; decode row: "... | Blackwell | 6th Gen | 1 | 4 | 4 | ... AV1: YES | YES" (accessed 2026-11-20). The page also lists "NVIDIA RTX PRO 4500 Blackwell Server Edition" with 3 NVENC and 3 NVDEC.
- Use in dive: section 10, EC2 G7e.

**F05-51. The T4 has 1 NVENC and 2 NVDEC engines and no AV1 in either direction.**
- Location: support matrix, "Server (Data Center)" tab, row "Tesla T4"
- Verdict: CARRIED (seed 02 section 2.2, re-fetched)
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode row: "Tesla T4 | Turing | 7th Gen | 1 | 1 | 1 | Unrestricted | ... AV1 YUV 4:2:0: NO"; decode row: "Tesla T4 | Turing | 4th Gen | 1 | 2 | 2 | ... AV1: NO | NO" (accessed 2026-11-20)
- Use in dive: section 10, EC2 G4dn.

**F05-52. The A10 has 1 NVENC and 2 NVDEC engines; it decodes AV1 and cannot encode it. The matrix lists "NVIDIA A10", not "A10G", the name AWS uses for the G5 card.**
- Location: support matrix, "Server (Data Center)" tab, row "NVIDIA A10"
- Verdict: NEW
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode row: "NVIDIA A10 | Ampere | 7th Gen | 1 | 1 | 1 | Unrestricted | ... AV1 YUV 4:2:0: NO"; decode row: "NVIDIA A10 | Ampere | 5th Gen | 1 | 2 | 2 | ... AV1: YES | YES" (accessed 2026-11-20). Applying the A10 row to the A10G is [our reading]; the string "A10G" does not occur in the page (U3).
- Use in dive: section 10, EC2 G5 row, with the A10/A10G caveat.

**F05-53. Jetson Thor modules (T2000, T3000, T4000, T5000) have hardware H.264 and HEVC encode, no AV1 encode, and hardware AV1 decode. T2000, T3000 and T4000 have one encoder and one decoder engine; T5000 has two of each.**
- Location: support matrix, "Jetson / IGX" tab, encode and decode tables
- Verdict: NEW
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode rows: "Jetson T5000 | Thor | 9.1th Gen | N/A | 1 | 2 | Unrestricted | ... HEVC B Frame support: YES | AV1 YUV 4:2:0: NO", "Jetson T4000 | Thor | 9.1th Gen | N/A | 1 | 1 | Unrestricted | ... AV1 YUV 4:2:0: NO"; decode rows: "Jetson T5000 | Thor | 6.1th Gen | N/A | 1 | 2 | ... AV1: YES | YES" (accessed 2026-11-20). No Jetson Orin module is in the matrix.
- Use in dive: section 9, recording on a Thor: the hardware encoder gives H.264 or HEVC, so an AV1 dataset still means CPU encode.

**F05-54. The DGX Spark has one NVENC and one NVDEC engine, with AV1 in both directions.**
- Location: support matrix, "DGX" tab, row "DGX Spark"
- Verdict: NEW
- Evidence: https://developer.nvidia.com/video-encode-decode-support-matrix | Tier 1, vendor support matrix | documentation of support | encode row: "DGX Spark | Blackwell | 9th Gen | 1 | 1 | 1 | Unrestricted | ... AV1 YUV 4:2:0: YES"; decode row: "DGX Spark | Blackwell | 6th Gen | D | 1 | 1 | 1 | ... AV1: YES | YES" (accessed 2026-11-20)
- Use in dive: section 9 and section 10, the desk-side machine in the dive's hardware set.

