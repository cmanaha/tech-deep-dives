# SGLang handoff: remote KV tiers on AWS (HiCache L3 storage backends)

Written 2026-10-24 by the `kvtier` stream for a later pass on the SGLang dive. Every fact
below was verified on 2026-10-24 and traces to a row in this folder's registers (Mn in
`02-mooncake-remote-tiers.md`, Fn in `03-fsx-lustre-kv-tier.md`, Vn in
`01-valkey-large-object.md`). Pins: SGLang `v0.5.22` (`baa9befa381511cd4d56f83980951e5a45fffc6d`,
released 2026-10-19), Mooncake `v0.3.13.post1` (`719735896c86b56fabec6cf3e825fb2ea640597a`),
NIXL `v1.5.0`, LMCache `v0.5.6`. Code links are tag-pinned; open the register row for the
exact line ranges.

## The model the SGLang dive should carry

HiCache's L3 storage backends all move pages from HiCache's host-memory pool (L2). None of
the built-in L3 backends located at v0.5.22 reads or writes GPU memory directly: `file`
uses Python file I/O on host tensors (F61), `nixl` registers host buffers as `DRAM` (M45,
F62), and `mooncake` registers the host KV pool with Mooncake Store (M43). On AWS, the
remote tier choice is therefore about the link between host memory and the tier, which is
EFA for Mooncake and FSx for Lustre, and HTTPS for S3.

## Facts to carry

| Fact | Row | Pinned source |
| --- | --- | --- |
| `--hicache-storage-backend` accepts `file`, `sim`, `mooncake`, `npu_memcache`, `hf3fs`, `nixl`, `aibrix`, `dynamic`, `eic`, `simm`, `mori`, `shm`, `tensorcast`, `seaweedfs`. The help text lists eight; the choices list is the authority. `dynamic` loads an out-of-tree class (backend_name, module_path, class_name). | M41 | `python/sglang/srt/mem_cache/storage/backend_factory.py` L203-L276; `python/sglang/srt/arg_groups/fields/memory.py` L145-L166 |
| No Valkey or Redis HiCache backend exists at v0.5.22 (grep over `mem_cache`). A Valkey tier needs the `dynamic` backend or LMCache (`--enable-lmcache`); the LMCache route was not traced end to end. | M42 | grep over `python/sglang/srt/mem_cache` at the tag |
| `mooncake` L3 registers the host KV pool with Mooncake Store and moves pages between it and the store's pooled DRAM with the Transfer Engine. Transport from `protocol` in the extra config or `MOONCAKE_PROTOCOL` (default `rdma`); `efa` is the AWS value. Mooncake's SSD offload is switched on from the same config (`enable_ssd_offload`, `ssd_offload_path`). | M43 | `storage/mooncake_store/mooncake_store.py` L152-L182, L231-L240, L703-L726; `srt/environ.py` L824 |
| On AWS the Mooncake EFA transport needs the EFA build of Mooncake (`mooncake-transfer-engine-efa` or `-efa-cuda13`) and the EFA installer's libfabric; the default wheel has no EFA transport. Mooncake's ibverbs `rdma` transport cannot run on EFA (EFA has no RC queue pairs). | M6, M14, M28 | Mooncake `scripts/build_wheel.sh` L264-L291; `docs/source/design/transfer-engine/efa_transport.md` |
| Same-host cross-process GPU transfers over Mooncake EFA can crash in libfabric's shm path; Mooncake documents `FI_EFA_ENABLE_SHM_TRANSFER=0` as the workaround. | M14 | Mooncake `efa_transport.md` at the tag |
| P/D disaggregation: `MOONCAKE_PROTOCOL=efa` with `--disaggregation-transfer-backend mooncake` selects EFA at v0.5.22 with no patch (Mooncake's doc patch applies only to SGLang older than PR 25083). | M44 | `srt/distributed/device_communicators/mooncake_transfer_engine.py` L195-L219 |
| `file` backend: one `.bin` file per page key under `SGLANG_HICACHE_FILE_BACKEND_STORAGE_DIR` (default `/tmp/hicache`), written with numpy `tofile` and read with `readinto` on host tensors; no cuFile. Pointing it at an FSx for Lustre mount gives cross-node reuse. Optional per-process LRU evictor (byte cap or free-space watermark); inert when not configured; cross-instance eviction coordination not examined. | F61, M45 | `mem_cache/hicache_storage.py` L386-L394, L494-L547; `storage/file/lru_file_evictor.py` L1-L66 |
| `nixl` backend: file plugins tried in the order 3FS, POSIX, GDS_MT, GDS when `plugin` is `auto`, so a NIXL build that includes POSIX selects POSIX first: name GDS explicitly to get it. OBJ plugin ("Based on Amazon S3 SDK") for S3. Host buffers are registered as `DRAM`. | F62, M45 | `storage/nixl/nixl_utils.py` L118-L124; `hicache_nixl.py` L294, L608 |
| `seaweedfs` stores one object per page through an S3 API endpoint with boto3; `hf3fs` targets DeepSeek 3FS; `mori` is UMBP local DRAM plus SSD; `eic`, `aibrix`, `simm`, `tensorcast`, `npu_memcache` wrap external caches. | M45 | `storage/<name>/` at the tag |
| `--enable-lmcache` and `--enable-flexkv` replace HiCache's radix cache path; they are not `--hicache-storage-backend` values. | M46 | `arg_groups/fields/memory.py` L237-L262 |
| HiCache design doc still says cross-instance reuse "is the job of L3" at v0.5.22. | M40 | `docs/docs/advanced_features/hicache_design.mdx` L63 |

## AWS-side facts the SGLang dive can link rather than restate

- FSx for Lustre per-client ceilings: 100 Gbps (ENA or non-EFA file system), 700 Gbps
  (EFA), 1,200 Gbps (EFA with GDS); GDS only on P5, P5e, P5en, P6-B200, P6-B300 clients;
  EFA is a create-time choice on Persistent 2 (F18, F20, F22). SGLang's `file` backend
  does not use GDS, so its ceiling on an EFA file system is the 700 Gbps EFA row.
- The Valkey large-object module (`valkey-io/valkey-large-object`, no tags, API
  experimental until 1.0) has no SGLang integration at v0.5.22 (V62).
- The AWS Storage Blog "Accelerate inference with KV cache tiering on AWS" (2026-09-21)
  names SGLang "RadixAttention with external cache backend" on FSx, without configuration
  or measurement (F3, F4, F5).

The vLLM dive (section 7) and the EFA dive (StorageDataPaths) carry the AWS data paths;
link to them.
