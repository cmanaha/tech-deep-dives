# Fact check: EFA dive, StorageDataPaths, "KV cache over the fabric" (commit 82aa4a4, 2026-10-24)

Scope: every claim added or changed by commit 82aa4a4 ("efa: add the KV cache over the fabric
container to StorageDataPaths") in `deep-dives/efa/src/sections/StorageDataPaths.tsx`,
`deep-dives/efa/src/sections/Sources.tsx` and `deep-dives/efa/sources.md`. Line numbers are at
82aa4a4. Checked against the cited artifact itself, never against the registers
(01-valkey-large-object.md, 02-mooncake-remote-tiers.md, 03-fsx-lustre-kv-tier.md).

How it was checked (2026-10-24):

- Every cited file fetched from raw.githubusercontent.com at the pinned tag or SHA and read at the
  cited line range. Tags confirmed as tags (not branches) with `git ls-remote`: valkey 9.1.2
  (7f1dffed), rdma-core v65.0 (58e40801), Mooncake v0.3.13.post1 (71973589), LMCache v0.5.6
  (3e11e108), llm-d-kv-cache v1.0.0 (b788775c), dynamo v1.6.0 (701da252), nixl v1.5.0 (1683cf3b),
  vllm v0.31.0 (db9527a4), sglang v0.5.22 (35ce3132). valkey-large-object pins vdma at exactly
  72c3a088 in its Cargo.toml L17-L18, so the vdma citations are the code the module runs.
- AWS pages fetched live: FSx for Lustre `performance.html`, `configure-efa-clients.html`,
  `efa-file-systems.html`.
- GitHub state via `gh api`: valkey-large-object releases (0) and tags (0); LMCache PR 5556 and
  valkey-glide PR 7412 both `open`, heads 7e5987f8 and 7644df8b (match the page); Valkey issue 4743
  comment 5766728140; libfabric issue 12328; Mooncake PR 2448; Mooncake commit history of
  efa_context.cpp and efa_transport.md up to v0.3.13.post1; PyPI JSON for the Mooncake EFA wheels.
- Linux v6.17 `drivers/infiniband/hw/efa/efa_verbs.c` and `drivers/infiniband/core/cma.c` read for
  the rdma_cm question in row 31. That reading is labelled [SPECULATIVE] below: nothing was run.
- Deterministic gates run on the worktree: `no-ai-tells.sh`, `pinned-refs.sh`, `svg-a11y.sh`, all
  exit 0. No build and no Playwright run; the diagram's rendered geometry was not re-verified.

Verdict counts: 47 HOLDS, 7 PARTLY, 1 FAILS.

## Part 1: claim by claim

### Intro, caption, FSx for Lustre

| # | Claim | Location | Cited source | Verdict | Evidence |
|---|---|---|---|---|---|
| 1 | An engine can keep KV beyond its instance so another instance reuses a prefix; two kinds of remote tier carry it over EFA: a shared file system and pooled DRAM on other instances | StorageDataPaths.tsx:1671-1674 | none (framing) | HOLDS | Undisputed framing; each tier is cited below. Dynamo's private per-worker file (row 12) is the one case where "another instance reuses" does not apply, and the page says so at L1696-1697. |
| 2 | FSx for Lustre figures are AWS per-client maximums | :1677 | label | HOLDS | performance.html column header is "Maximum throughput per client, Gbps" [AWS docs]. |
| 3 | Matching connectors to the FSx figures, and the core Valkey entry, is our reading of code | :1677-1678 | label | HOLDS | Correct scope label. Style note in Part 2 (C9). |
| 4 | LNet runs over the EFA device | :1683 | docs.fsxClients | HOLDS | configure-efa-clients.html: `sudo lnetctl net add --net efa --if device_name --peer-credits 32` [AWS docs]. |
| 5 | An EFA client gets up to 700 Gbps, or 1,200 Gbps with GDS | :1684-1685 | docs.fsxPerf | HOLDS | performance.html table: "EFA-enabled / EFA / 700 Gbps"; "EFA-enabled / EFA with GDS / 1200 Gbps" [AWS docs]. |
| 6 | GDS needs a P5, P5e, P5en, P6-B200 or P6-B300 client with NVIDIA GDS driver 2.24.2 or later | :1686-1687 | docs.fsxClients | HOLDS | "Requirements: Amazon EC2 P5, P5e, P5en, P6-B200, or P6-B300 instance / NVIDIA GDS driver version 2.24.2 or higher" [AWS docs]. p6e-gb200.36xlarge is in the EFA-interface table but not the GDS list, so the five-type list is right. |
| 7 | By our reading of the connector code, the 1,200 Gbps path needs cuFile I/O | :1690 | the connector refs | HOLDS | Labelled inference. "Needs" is a necessary condition, which is the right strength: LMCache's own docstring warns cuFile itself "will fall back to POSIX I/O" where GPUDirect is unsupported (gds_backend.py v0.5.6 L234-L235), so cuFile is not sufficient. |
| 8 | LMCache's GDS backend issues cuFile I/O | :1691 | lmcc gds_backend.py L1015-L1097 | HOLDS | L1040-L1046 `self.gds_module.CuFile(tmp_path, "r+", ...)` then `f.write(addr, ...)`; L1089-L1096 `CuFile(gds_path, "r", ...)` then `f.read(gpu_pointer, ...)`. `gds_module = cufile` when `use_gds` (default True, L272-L283) and `gds_backend == "cufile"` (L318-L326); `use_gds=False` gives an mmap plus GPU memcpy fallback (L339-L341). |
| 9 | llm-d's fs backend issues cuFile I/O with `gds_mode` set (default disabled) | :1692-1693 | llmdc worker.py L442-L468 | PARTLY | The cited lines show only the option: `gds_mode = extra_config.get("gds_mode", "disabled")` and the seven valid modes. No cuFile call is in that file or range. The cuFile half lives in `csrc/storage/backends/fs_gds/cufile_loader.hpp` (v1.0.0 L61-L108: "CuFileApi is a runtime wrapper for the NVIDIA cuFile (GDS) library ... Loads libcufile.so via dlopen"). **Fix:** add a second code-derived ref, `llmdc('kv_connectors/llmd_fs_backend/csrc/storage/backends/fs_gds/cufile_loader.hpp', 'L61-L108')`. The same lines show "the same wheel works with or without GDS ... If the library or any symbol is missing, m_handle stays null", which is a backlog item (B3). |
| 10 | Dynamo KVBM disk tier: its NIXL agent creates GDS_MT | :1693-1695 | dync worker.rs L94-L114, nixlc gds_mt_engine.cpp L29-L54 | PARTLY | Cited range shows `if use_gds { ... agent.create_backend("GDS_MT", &gds_params)?; }` (L107-L110): conditional, and the condition is outside the range. L144-L145: `let need_disk = should_allocate_offload && leader_meta.num_disk_blocks > 0; let agent = build_agent(worker_id, need_disk)?;`. The claim is right; the citation cannot show it. **Fix:** widen to `'L94-L145'`. Scope kept correctly: the page says "creates", and which backend serves a given transfer was not traced. |
| 11 | NIXL GDS_MT does cuFile I/O | :1695 | nixlc gds_mt_engine.cpp L29-L54 | HOLDS | L45-L54: `cuFileRead(req->fh, req->addr, ...)` / `cuFileWrite(...)`. |
| 12 | The Dynamo disk-tier file is private to one worker | :1696-1697 | dync disk.rs L398-L470 | HOLDS | `mkostemp` template `dynamo-kvbm-disk-cache-XXXXXX`, `fallocate`, then unlink after NIXL registration ("when this process terminates, the file will be automatically deleted by the OS"). Allocated per worker in worker.rs L196-L204. |
| 13 | vLLM's fs tier does POSIX I/O from host memory | :1697-1701 | vllmc io.py L90-L218, manager.py L109-L128 | HOLDS | `os.open(tmp_path, O_CREAT\|O_EXCL\|O_WRONLY\|O_TRUNC\|o_direct)`, `os.write`, `os.replace`; manager arg `primary_kv_view: Memoryview of the primary tier's CPU KV cache`. Both files are byte-identical at v0.32.0, so the v0.31.0 pin is not stale. |
| 14 | SGLang's file backend does POSIX I/O from host memory | :1700-1701 | sglc hicache_storage.py L484-L547 | HOLDS | `open(tensor_path, "rb", buffering=0)` + `readinto` (get); `value.contiguous().view(dtype=torch.uint8).numpy().tofile(tmp_path)` (set). `.numpy()` needs a CPU tensor. |

### Pooled DRAM: Mooncake

| # | Claim | Location | Cited source | Verdict | Evidence |
|---|---|---|---|---|---|
| 15 | Transfer Engine selects EFA with protocol `efa` | :1706-1707 | mcc multi_transport.cpp L516-L520 | HOLDS | `#ifdef USE_EFA else if (std::string(proto) == "efa") { transport = new EfaTransport(); }`. |
| 16 | Posts one-sided `fi_write` and `fi_read` from the engine side on one RDM endpoint per EFA device | :1707-1709 | mcc efa_context.cpp L1146-L1158 | HOLDS | L1146-L1157: `fi_read(shared_ep_, ...)` for READ, else `fi_write(shared_ep_, ...)`. `shared_ep_` is created once per context (L241 `if (shared_ep_) return 0;`, L290 `fi_endpoint`), one context per device (efa_transport.cpp L1275-L1276). "Engine side": the Store client that issues Put/Get opens the remote segment and submits READ/WRITE requests itself (mooncake-store/src/transfer_task.cpp L1091-L1110). |
| 17 | In a CUDA build, GPU buffers register with `FI_HMEM_CUDA`, so loaded KV can land in GPU memory | :1709-1711 | mcc efa_context.cpp L534-L592 | HOLDS | `#if defined(USE_CUDA) ... if (... attributes.type == cudaMemoryTypeDevice) { iface = FI_HMEM_CUDA; ...}` then `fi_mr_regattr`. The `-efa` wheel is the CUDA build (build_wheel.sh L269-L270, description "AWS EFA, CUDA version"). |
| 18 | Buffers go on every EFA device when the page-table budget allows | :1711-1713 | mcc efa_transport.cpp L306-L315 | HOLDS | L306-L315: "if total PTE usage per NIC fits within the PTE budget, register ALL chunks on ALL NICs ... Otherwise fall back to disjoint per-NIC partition"; `use_full_coverage = (total_pages_per_nic <= getMaxPteEntries())`. |
| 19 | ... or on the nearest ones with `MC_EFA_NIC_SELECTION=local` | :1713-1716 | mcc config.cpp L623-L634, efa_transport.cpp L1284-L1300 | PARTLY | Subject is "Buffers", but local selection narrows only a single-chunk GPU buffer. efa_transport.cpp L317: "Optionally narrow a single-chunk DEVICE buffer"; L328: "Host memory is deliberately excluded"; L333: `if (!local_nic_map_.empty() && resolved_name.rfind("cpu", 0) != 0)`; L339: `if (chunks.size() <= 1 && local_nics)`. Host buffers, which is what a DRAM pool registers, stay on every NIC. **Fix:** "or, for a GPU buffer, on the NICs nearest its GPU with `MC_EFA_NIC_SELECTION=local`", and add `mcc('mooncake-transfer-engine/src/transport/efa_transport/efa_transport.cpp', 'L317-L346')`. |
| 20 | The default build omits the EFA transport; install an EFA wheel such as `mooncake-transfer-engine-efa` | :1716-1719 | mcc common.cmake L100, build_wheel.sh L264-L291 | HOLDS | `option(USE_EFA "option for using AWS EFA transport" OFF)`; build_wheel.sh renames the package to `mooncake-transfer-engine-efa` (also `-efa-cuda13`, `-efa-non-cuda`). PyPI: `mooncake-transfer-engine-efa` 0.3.13.post1 and `-efa-cuda13` 0.3.13.post1 are published. |
| 21 | Set `FI_EFA_ENABLE_SHM_TRANSFER=0` for same-host GPU transfers between processes, which libfabric's shm path can crash | :1719-1722 | ProjectRef docs.mooncakeShm (efa_transport.md L388-L415) | **FAILS** | The cited doc does say it: L410-L411 "Until libfabric#12328 is fixed, set `FI_EFA_ENABLE_SHM_TRANSFER=0` on such processes". That paragraph is stale at the pinned tag, and the code at the same tag disagrees. (a) libfabric issue 12328 was closed 2026-06-12 after the maintainers found the cause in the application: "caps needs to have FI_HMEM set if gpu buffers are going to be used"; the reporter replied "FI_HMEM works!" [project issue thread]. (b) Mooncake PR 2448, merged 2026-06-16, "fix(efa): declare FI_HMEM in caps for GPU builds", targets exactly "cross-process, same-node GPU-to-GPU transfers" and says it "keeps the fast intra-node SHM path enabled, unlike the `FI_EFA_ENABLE_SHM_TRANSFER=0` workaround" [project PR]. (c) At v0.3.13.post1, efa_context.cpp L75-L89 adds `\| FI_HMEM` to `hints_->caps` under `USE_CUDA`/`USE_HIP`, with the comment "without FI_HMEM in caps the SHM sub-provider ... SIGSEGVs ... See https://github.com/ofiwg/libfabric/issues/12328" [Tier 1 code at tag]. (d) The doc's last edit to that warning predates the fix: commit 268622fa (2026-06-04) wrote it, and PR 2448 touched only the code. So the advice disables the same-host shm fast path for no benefit, and "libfabric's shm path can crash" puts the cause on libfabric when it was a missing capability bit in the caller. It also breaks the source-authority standard: an in-repo doc (rung 3) is the only evidence for a behaviour claim. **Fix (minimal):** delete ", and set `FI_EFA_ENABLE_SHM_TRANSFER=0` ... `<ProjectRef doc={docs.mooncakeShm} />`" and end the sentence after the wheel citations. **Fix (keeps the practical value):** turn it into a doc-code conflict: "The project's EFA guide still has same-host GPU processes set `FI_EFA_ENABLE_SHM_TRANSFER=0`; at this tag a CUDA build declares `FI_HMEM`, the fix for that crash, so the setting only gives up the same-host shm path" with `<SourceRef provenance="doc-code-conflict" code={mcc('mooncake-transfer-engine/src/transport/efa_transport/efa_context.cpp', 'L75-L89')} doc={docs.mooncakeShm} conflict="set FI_EFA_ENABLE_SHM_TRANSFER=0 until libfabric issue 12328 is fixed" />`. Whether FI_HMEM also cures the second symptom in the issue thread (a host-to-GPU cross-process hang) was not separately confirmed [SPECULATIVE that it does: the closing repro was "mooncake-like" and the reporter confirmed the fix without splitting cases]. |

### Pooled DRAM: Valkey large-object module

| # | Claim | Location | Cited source | Verdict | Evidence |
|---|---|---|---|---|---|
| 22 | The client sends a RESP command over TCP naming its registered buffer | :1725-1727 | vloc commands/mod.rs L22-L84 | HOLDS | `parse_efa_addresses`: "must be `(rkey, addr, len)` triples". README L21-L25 lists `BLOB.RDMA_SET key total_len [CRC crc32c] rkey1 addr1 len1 ...` and `BLOB.RDMA_GET key rkey1 addr1 len1 ...`. "Over TCP" is the normal Valkey client connection; the glide PR 7412 body says the "RESP channel acts as a control plane" [project PR]. |
| 23 | The server posts `fi_writemsg` with `FI_DELIVERY_COMPLETE` for a GET, so the reply cannot overtake the payload, or `fi_read` for a SET | :1727-1731 | vloc transport/session.rs L36-L91, vdmac connection.rs L43-L99 | HOLDS | session.rs: `write` = "DMA write: push `len` bytes ... into client memory" (`Direction::ToPeer`), `read` = "pull ... from client memory" (`Direction::FromPeer`). connection.rs L43-L45: "Post an `fi_writemsg`, the `dma.get` direction. Under `FI_DELIVERY_COMPLETE` the completion fires only once the peer has applied the write, so a reply can't race ahead of the payload landing"; L74 `fi_writemsg(self.endpoint, &message, u64::from(FI_DELIVERY_COMPLETE))`; L78 "Post an `fi_read`, the `dma.set` direction". mod.rs L194-L224: `lo_rdma_get` replies through the engine after the transfer (`NoReply` on the async path). |
| 24 | ... over efa-direct | :1731-1732 | vdmac configuration.rs L7-L48 | HOLDS | `#[serde(rename = "efa-direct")] EfaDirect`: "the `efa` provider's `efa-direct` fabric, which uses device RMA with no software wire protocol". README L101: `fabric-provider` default `EfaDirect`. |
| 25 | Located clients register host memory, so KV lands there today | :1732-1735 | lmcprc rdma_worker_pool.py L137-L159, lmcprc l1_memory_manager.py L2 | HOLDS | rdma_worker_pool.py L103 `self._l1_memory = (ctypes.c_ubyte * l1_size).from_address(l1_base)` ("the L1 manager owns the memory"), L156 `client.register_rdma_region(self._l1_memory)`. glide endpoint.rs L756-L785: plain `fi_mr_reg(...)` with no `iface`, which the efa provider treats as host memory (Mooncake's comment at efa_context.cpp L537-L538: "fi_mr_reg() hardcodes iface=FI_HMEM_SYSTEM"); no `fi_mr_regattr` or `FI_HMEM` anywhere in endpoint.rs. The module's own client design doc stages GPU bytes to host first (docs/RDMA_CLIENT_INTEGRATIONS_DESIGN.md L54, L81-L89). Rigor note: lmcL1Host points at the module docstring ("CPU pinned-DRAM L1 memory manager."), a rung-3 artifact; the allocator code is at L109-L114 (C10 in Part 2). |
| 26 | Doc-code conflict: the module README describes an optional EFA RDMA transport to GPU memory; neither located client registers GPU memory | :1736-1741 | glidec endpoint.rs L756-L785 vs docs.vloReadme L1-L3 | PARTLY | Substance holds: README L3 "optional EFA RDMA transport to GPU memory"; both clients register host memory (row 25). The `conflict` prop is rendered as "Conflicting document says: {conflict}" (shared/src/components/SourceRef.tsx L168-L171), so the popover reads "Conflicting document says: ... neither located client registers GPU memory", which attributes our code reading to the README. **Fix:** `conflict="an optional EFA RDMA transport to GPU memory"`; the prose sentence already carries the code side. |
| 27 | As of 2026-10-24 the module is unreleased | :1742-1743 | ProjectRef docs.vloReleases | HOLDS | `gh api .../releases` length 0; `.../tags` length 0. Repo created 2026-08-07, last push 2026-10-22. |
| 28 | With an experimental API until 1.0 | :1743-1744 | ProjectRef docs.vloGovernance | HOLDS | Comment 5766728140, 2026-09-21: "In the core team meeting today, we decided to accept it as a repo under the valkey-io organization. The API will initially be experimental/beta until the module is releasing an 1.0 version and commits to maintaining it." [project issue thread]. |
| 29 | Its client support is in open pull requests | :1744-1747 | ProjectRef docs.lmcachePr, docs.glidePr | HOLDS | Both PRs `open`, not draft, heads 7e5987f8 and 7644df8b. Nuance, not an error: the low-level `glide-rdma` crate is already on valkey-glide `main`; PR 7412 integrates it into glide-core, and its body says "there will be two more PRs after this one" for the ffi and Python layers that LMCache's adapter needs. So part of the client path is in pull requests not yet opened (B6). |

### What makes a KV store EFA-capable, and the disclosure

| # | Claim | Location | Cited source | Verdict | Evidence |
|---|---|---|---|---|---|
| 30 | The EFA verbs provider accepts UD queue pairs through standard verbs and SRD through its direct-verbs extension | :1752-1755 | rdmac verbs.c L2268-L2305, L2057-L2061 | HOLDS | `efa_create_qp`: `if (attr->qp_type != IBV_QPT_UD) { ... "Unsupported QP type %d" ... errno = EOPNOTSUPP; return NULL; }`; `efa_create_qp_ex` the same. L2057-L2061: `if (attr->qp_type == IBV_QPT_DRIVER && efa_attr->driver_qp_type != EFADV_QP_DRIVER_TYPE_SRD) { "Driver QP type must be SRD"; return EOPNOTSUPP; }`. `efadv_create_qp_ex` and `efadv_create_driver_qp` accept only `IBV_QPT_DRIVER` (L2322, L2354). |
| 31 | RC stacks "stop at creation" / "stop at queue-pair creation on EFA", applied to core Valkey RDMA and Mooncake's rdma transport | prose :1755-1756; band :991-997; SVG `<title>` :920-922 | same rdma-core refs; valkeyc rdma.c L366-L381 | PARTLY | Holds for a raw ibverbs stack: Mooncake's rdma endpoint calls `ibv_create_qp` with `IBV_QPT_RC` (rdma_endpoint.cpp L138-L143), which `efa_create_qp` rejects with EOPNOTSUPP. Core Valkey is an rdma_cm stack (`rdma_create_id(..., RDMA_PS_TCP)` at rdma.c L1114 and L1580, then `rdma_create_qp(cm_id, ...)` on the cm_id's device), and it likely never reaches queue-pair creation on EFA. The EFA kernel driver reports `IB_LINK_LAYER_UNSPECIFIED` (efa_verbs.c v6.17 L2316-L2319) and sets no core capability flags in `efa_get_port_immutable` (L1907-L1920), while `cma_validate_port` (cma.c v6.17 L671-L760) maps an Ethernet-bound IP to an RDMA device only through RoCE or iWARP; so binding or resolving the instance's IP finds no EFA device, and `rdma_create_qp` has no EFA context to run on [SPECULATIVE: our reading of kernel source, not run]. The verdict "core Valkey RDMA does not run on EFA" stands either way; the named failure point is unproven for Valkey, and a reader checking an error log would look in the wrong place. **Fix (weakens only):** band line 1 "RC (Reliable Connected) verbs stacks do not run on EFA"; band line 2 "Core Valkey RDMA and Mooncake's rdma transport are built on RC queue pairs."; prose "so stacks built on RC (Reliable Connected) queue pairs cannot run on it"; SVG title "RDMA stacks built on reliable connected verbs queue pairs do not run on EFA." Keep EOPNOTSUPP in the disclosure, where it is tied to `efa_create_qp`. |
| 32 | Mooncake's ibverbs `rdma` transport is one such stack, and its `efa` transport replaces it on EFA | :1756-1758 | ProjectRef docs.mooncakeNoRc (efa_transport.md L650-L654) | HOLDS | L652: "it does not support the RC (Reliable Connection) queue pairs that Mooncake's RDMA (`rdma`) transport is built on. Attempting to create an RC QP on an EFA device fails (`EOPNOTSUPP`)". Code agrees (row 37), so the rung-3 doc is backed. |
| 33 | Core Valkey RDMA creates RC queue pairs, so by our reading of both codebases it is another; no AWS or Valkey document stating so was located during this research | :1758-1761 | valkeyc rdma.c L366-L381 | HOLDS | L375 `init_attr.qp_type = IBV_QPT_RC;`, L378 `ret = rdma_create_qp(cm_id, pd, &init_attr);`. Labelled as our reading; hedge scope kept ("was located during this research"). See row 31 for the failure point. |
| 34 | Both pools open a libfabric RDM endpoint on the efa provider | :1761-1763 | mcc efa_context.cpp L75-L103, vdmac endpoint.rs L95-L120 | HOLDS | Mooncake: `hints_->ep_attr->type = FI_EP_RDM; hints_->fabric_attr->prov_name = strdup("efa");`. vdma: `(*(*hints).ep_attr).type_ = fi_ep_type_FI_EP_RDM;`, `prov_name` from `Provider::as_str` = `"efa"`, fabric pinned to `efa-direct`. |
| 35 | That endpoint is the userspace path of the section's EFA and SRD lane and the first thing to look for in a KV store's transport | :1763-1765 | reasoning | HOLDS | Guidance scoped to "first thing to look for", not "only route". Ties to the existing lane text "Userspace libfabric writes work queue entries straight to the EFA device". |
| 36 | rdma-core v65.0: `efa_create_qp` and `efa_create_qp_ex` return EOPNOTSUPP for any type but UD; a driver queue pair must be SRD | :1771-1775 | rdmac verbs.c L2268-L2305, L2057-L2061 | HOLDS | As row 30. |
| 37 | Valkey 9.1.2 sets `IBV_QPT_RC` before `rdma_create_qp`; Mooncake's rdma endpoint sets the same type | :1775-1778 | valkeyc rdma.c L366-L381, mcc rdma_endpoint.cpp L138 | HOLDS | rdma.c L375/L378 as row 33; rdma_endpoint.cpp L138 `attr.qp_type = IBV_QPT_RC;`, L143 `ibv_create_qp(context_.pd(), &attr)`. |
| 38 | Cross-links: per-engine configuration in section 7 (KV-Cache Offloading & Tiers) of the vLLM dive; bandwidth per GPU against the recompute break-even on the tier ladder in section 9 (Flash as a Cache Tier for Inference) of the Silicon, Memory & Inference dive | :1782-1791 | sibling dives | HOLDS | vllm/src/App.tsx L113 `{ id: 'offload', title: '7. KV-Cache Offloading & Tiers' }`; silicon-memory-inference/src/App.tsx L157 `'9. Flash as a Cache Tier for Inference'`; FlashCacheTier.tsx carries the per-GPU ceilings and the "Break-even 2.1 GB/s per GPU" note (L17-L25). |

### Diagram `KvOverFabricDiagram`

| # | Claim | Location | Cited source | Verdict | Evidence |
|---|---|---|---|---|---|
| 39 | Mooncake lane: Mooncake Store, engine-side Transfer Engine posts the transfer, protocol efa; fi_write / fi_read, one RDM endpoint per EFA device, to and from a peer's DRAM segment; lands in GPU or host memory, GPU buffers registered with FI_HMEM_CUDA | :878-880 | prose rows 15-17 | HOLDS | As rows 15-17. |
| 40 | Valkey lane: server posts after a Valkey command over TCP; fi_writemsg / fi_read for GET / for SET on efa-direct, "into the client's registered buffer"; lands in host memory today, clients located so far register host memory | :885-887 | prose rows 22-25 | PARTLY | "into" is true for GET only; for SET the server's `fi_read` pulls out of the client's buffer (session.rs `read`: "pull `len` bytes from client memory"). The Mooncake lane above it says "to and from". **Fix:** "to and from the client's buffer" (31 characters at 11px, about 192 of the 232 usable units by the authoring log's 6.2-per-character estimate, so it fits). |
| 41 | FSx lane: Lustre client on the engine instance, LNet over EFA; cuFile or POSIX I/O, GDS path up to 1,200 Gbps, POSIX path up to 700 Gbps; GPU through cuFile and GDS, host through POSIX I/O | :892-894 | prose rows 4-14 | HOLDS | Figures match performance.html. Mapping "POSIX path" to the EFA row is our reading, and the caption at L1677 says so. |
| 42 | Diagram numbers are cited in the prose | :893 | docs.fsxPerf at :1685 | HOLDS | Only 1,200 Gbps and 700 Gbps appear in the diagram; both are cited at L1684-L1685. |
| 43 | SVG `<title>` body (apart from the last sentence, row 31) | :913-922 | prose | HOLDS | Restates rows 15-25 and 4-7 without adding a claim; "at up to 1,200 Gbps per client" matches the AWS column. `role="img"` and `aria-labelledby` present; svg-a11y gate passes. |

### Changes to existing content

| # | Claim | Location | Cited source | Verdict | Evidence |
|---|---|---|---|---|---|
| 44 | ThreeDataPathsDiagram FSx EFA lane: "LNet runs over the EFA device. GPUDirect Storage moves file data directly between the file system and GPU memory on P5, P5e, P5en, P6-B200, P6-B300." | :465-467 | docs.fsxClients, docs.fsxEfa (cited elsewhere in the section) | HOLDS | efa-file-systems.html: "enabling direct data transfer between the file system and the GPU memory, bypassing the CPU" and "Use an Amazon EC2 P5, P5e, P5en, P6-B200, or P6-B300 client instance." Removing the uncited "kernel module handles metadata" clause was correct. New lines are shorter than the old ones, so no new overflow risk. |
| 45 | Comparison table, CPU cost, FSx: "Low on the GPUDirect Storage path, since the CPU is bypassed for data movement." | :1084 | docs.fsxEfa | HOLDS | Same AWS sentence. The deleted second sentence was uncited. The row now says nothing about the non-GDS EFA path (B7). |
| 46 | Boundary h2 description: "FSx for Lustre service claims here come from documentation, and S3 client and KV-tier claims from code at pinned commits you can open, and the badge on each claim says which." | :1643 | n/a | PARTLY | Not every KV-tier claim comes from code: rows 21, 27-29 and 32 carry the new `project` badge (project documents, a releases page, an issue comment, pull requests). The description also chains three "and" clauses. **Fix:** "FSx for Lustre service claims come from AWS documentation. S3 client and KV-tier claims come from code at pinned commits or from the project's own documents. The badge on each claim says which." |

### Glossary, appendix, links

| # | Claim | Location | Cited source | Verdict | Evidence |
|---|---|---|---|---|---|
| 47 | Glossary RC: "Verbs queue-pair type with a hardware connection per peer. The EFA verbs provider does not create it, so RDMA stacks built on RC queue pairs do not run on EFA" | Sources.tsx:286 | rdma-core (no SourceRef in glossary) | HOLDS | Matches rows 30 and 36. "Do not run" is already the safe wording that row 31 asks the band to use. |
| 48 | Glossary UD: "without connections or delivery guarantees. EFA exposes it alongside SRD" | Sources.tsx:287 | rdma-core | HOLDS | Correct. Style note in Part 2 (C7). |
| 49 | Glossary RESP: request and reply protocol of Redis and Valkey; in the module it carries the command over TCP while object bytes move by RDMA | Sources.tsx:288 | README, glide PR | HOLDS | As row 22. |
| 50 | Appendix rows 57-62: titles, URLs, tiers, types | Sources.tsx:72-77; sources.md:109-114 | each URL | HOLDS | Every URL resolves at its pinned tag or SHA. Titles match content (60: rdma.c "rdma_cm and RC queue pairs" matches L375-L378; 62: gds_backend.py "cuFile reads and writes" matches L1040-L1096). Tier 1 "official-docs" for the Mooncake guide (58) follows the dive's convention for project docs; the source-authority standard ranks in-repo docs below code, which is what made row 21 possible (C3). |
| 51 | sources.md counts: 61 sources, 40 Tier 1, 109 glossary entries, 30 orphans | sources.md:16-19, 71, 149, 189 | Sources.tsx | HOLDS | Counted in Sources.tsx: 61 `{ id:` rows (ids 1-62, no 39), 40 at tier 1, 15 at tier 2, 109 `{ acronym:` rows; 61 - 31 referenced ids = 30 orphans. |
| 52 | Every new GitHub link pinned to a SHA or tag; none on Valkey's `unstable` | all new refs | n/a | HOLDS | All CodeRefs use the 13 tag/SHA constants at :60-72; doc links are pinned except the releases page, the issue comment and the two PR pages, which are status pages, not code. No `unstable`, `main` or `master` in the diff. Gate gap: `pinned-refs.sh` only matches `/(blob\|tree)/(main\|master)/`, so a link to Valkey's `unstable` would pass it (B8). |
| 53 | ProjectRef popover: "The open-source project states this in its own repository. It is not an AWS statement." | StorageDataPaths.tsx:334-361 | n/a | HOLDS | Fixes the old mislabel (SourceRef's 'documented' popover reads "AWS states this in its own documentation", shared/src/components/SourceRef.tsx L81). Style note in Part 2 (C8). |
| 54 | Glossary coverage: RC, UD, RESP added; KV, RDMA, RDM, SRD, GDS, NIXL, LNet, RMA already present; efa-direct introduced earlier in the dive | Sources.tsx | n/a | HOLDS | efa-direct is introduced in Libfabric.tsx L155, L227, L543, which comes before Storage in App.tsx order. |
| 55 | Accessed-date bumps on docs.fsxPerf and docs.fsxClients to 2026-10-24 | StorageDataPaths.tsx:227-243 | the two AWS pages | HOLDS | Both pages were re-read for this check and still carry every figure the section cites to them (700 / 1,200 / 100 Gbps, the 5 Gbps per-server note, the 10 GBps recommendation, the GDS requirements, lnetctl, the 1,024-connection limit). |

## Part 2: Gate 3 quality score

Read against `deep-dives/efa/revamp/section-shape-standard.md` (rules 1-14),
`deep-dives/efa/revamp/leverage-pass-standard.md` (five axes, attribution test, the three checks)
and the repo CLAUDE.md writing rules. Style gates pass (`no-ai-tells.sh`, `svg-a11y.sh`,
`pinned-refs.sh`, exit 0). A manual scan of the diff found no em-dash, en-dash, curly quote or
banned word.

### Whole section, StorageDataPaths: 7/10 as committed, 8/10 once C1 to C6 land

What earns the score. The section opens on the decision (the "Start here" alert: Persistent 2
with EFA, chosen at create time). It builds three models a reader can predict with: four data paths
with four ceilings, create-time doors, and the S3 throughput target as a divisor. It repeats its
strongest number (7 times, 700 / 1,200 Gbps). It treats documentation-versus-code conflicts as
content, with both sides cited, and frames guidance as how to get it right ("Write the security
group rules by group ID", "Spread the keys before you raise the target"). It ends on "Choosing a
path" and the order to answer the questions in (rule 11). There is no changelog voice and no
key-takeaways box, and hedges keep their scope ("No warning for this was located in the client
source at the pinned commits").

What holds it at 7. One practical instruction in the new container is wrong at its own pinned
version (C1). The new container sits after "The boundary of this section", so the reader is told
where the section stops and then gets a new topic (C12). Two vendor maximums still read as
measurements (C14). One sentence overstates what separates the two FSx rows (C15). Economy is the
weakest shape axis: the S3 Common Runtime material is about half the section, and the new
container came in at about 578 reader words against its 450 target.

### New container "KV cache over the fabric": leverage axes

| Axis | Score (1-5) | Reason |
|---|---|---|
| Mental model | 4 | "Who posts the RDMA operation, and where loaded KV lands" sorts three unlike systems on two questions a reader can ask of any fourth. "RC queue pairs stop on EFA; a libfabric RDM endpoint is the way in" is a predictive test. The diagram carries both. Not 5: the tiers are not set against each other on sharing, capacity or durability, which is what a tier choice turns on (and is scoped to the vLLM dive by design). |
| Practical leverage | 4 | Concrete things to type or choose: a cuFile connector for the 1,200 Gbps row, `gds_mode`, the `-efa` wheel, `MC_EFA_NIC_SELECTION`, and the RDM-endpoint check before planning a store onto EFA. One instruction (`FI_EFA_ENABLE_SHM_TRANSFER=0`) is wrong at the pinned tag and gives up a fast path (C1). No monitoring hook is named (B1, B3). |
| Rigor | 3 | Every code link pinned, inference labelled ("by our reading"), hedges scoped, and a new ProjectRef badge that stops project documents being shown as AWS statements. Against that: a behaviour claim rests on an in-repo doc alone, against the source-authority standard, while the code at the same tag disagrees (C1). Two citations cannot bear their claim (C4). A docstring stands in for allocator code (C10). The conflict popover attributes our reading to the README (C5). |
| Accuracy | 3 | One FAILS (C1) and two scope overstatements: the named failure point for core Valkey RDMA (C2) and "Buffers" for a GPU-only knob (C3). Under the leverage standard, accuracy below 5 fails the pass. It reaches 5 once C1 to C3 land. |
| Economy | 3 | About 578 words against the 450 target. The Mooncake paragraph packs six facts and nine citations into one block. The maturity sentence carries four badges. C1's minimal fix removes about 20 words. The authoring log already names the Mooncake multi-NIC sentence and the maturity sentence as the two to demote into the disclosure. |

### Corrections (wrong, against the standard, or AI tells). Each has a location and a minimal fix

| # | Location | What is wrong | Minimal fix |
|---|---|---|---|
| C1 | StorageDataPaths.tsx:1719-1722 | FAILS (row 21). The `FI_EFA_ENABLE_SHM_TRANSFER=0` advice is stale at v0.3.13.post1: the CUDA build declares `FI_HMEM` (efa_context.cpp L75-L89), the fix for libfabric issue 12328 (Mooncake PR 2448). The cause is also put on libfabric's shm path when it was the caller's missing capability bit. And a rung-3 doc is the only evidence for a behaviour claim. | Delete the clause and its ProjectRef, or turn it into the doc-code-conflict sentence given in row 21. |
| C2 | :991, :994, :920-922, :1755-1756 | PARTLY (row 31). "Stop at queue-pair creation" is unproven for core Valkey, an rdma_cm stack that most likely fails earlier [SPECULATIVE]. | Band: "RC (Reliable Connected) verbs stacks do not run on EFA" / "Core Valkey RDMA and Mooncake's rdma transport are built on RC queue pairs." Prose: "...cannot run on it." SVG title: "...do not run on EFA." Keep EOPNOTSUPP in the disclosure. |
| C3 | :1713-1716 | PARTLY (row 19). `MC_EFA_NIC_SELECTION=local` narrows only a single-chunk GPU buffer; host buffers stay on every NIC. | "or, for a GPU buffer, on the NICs nearest its GPU with `MC_EFA_NIC_SELECTION=local`", and add `efa_transport.cpp` L317-L346. |
| C4 | :404-405 (`code.llmdGdsMode`, `code.dynGdsMt`) | PARTLY (rows 9, 10). The citations cannot bear the claim: llm-d's range has no cuFile call; Dynamo's range shows `if use_gds` without the line that sets it. | Add `llmdc('kv_connectors/llmd_fs_backend/csrc/storage/backends/fs_gds/cufile_loader.hpp', 'L61-L108')`. Change `dynGdsMt` to `'L94-L145'`. |
| C5 | :1740 | PARTLY (row 26). The `conflict` prop renders after "Conflicting document says:", so our code reading ("neither located client registers GPU memory") is attributed to the README. | `conflict="an optional EFA RDMA transport to GPU memory"`. |
| C6 | :886 | PARTLY (row 40). "into the client's registered buffer" holds for GET only. | "to and from the client's buffer". |
| C7 | Sources.tsx:287 | Rule 4, negative definition: UD "without connections or delivery guarantees". | "Connectionless, best-effort verbs queue-pair type: each message is one datagram addressed to a peer queue pair. EFA exposes it alongside SRD". |
| C8 | StorageDataPaths.tsx:344 (ProjectRef popover) | Rule 4: "It is not an AWS statement." defines by absence, and the first sentence already says whose statement it is. | Delete the second sentence. |
| C9 | :1677-1678 | Rule 1: "the core Valkey entry" has no referent for a first-time reader, and "matching ... and the core Valkey entry, is" has a plural subject with a singular verb. | "...matching connectors to them, and the core Valkey line in the band below the diagram, are our reading of code." |
| C10 | :431 (`code.lmcL1Host`) | Source-authority standard: a module docstring (L2) is cited as proof that the L1 arena is host memory. | Point it at the allocator code, `lmcprc('lmcache/v1/distributed/memory_manager/l1_memory_manager.py', 'L109-L114')`. |
| C11 | :1643 | PARTLY (row 46). "KV-tier claims from code at pinned commits" leaves out the project-document claims the new badge marks, and the sentence chains three "and" clauses. | "FSx for Lustre service claims come from AWS documentation. S3 client and KV-tier claims come from code at pinned commits or from the project's own documents. The badge on each claim says which." |
| C12 | Container order, :1639-1795 | Rules 11 and 3: "The boundary of this section" now sits between two content containers, so the reader hits the scope statement and then a new topic. | Swap the two containers: "KV cache over the fabric" goes before "The boundary of this section", which then sits directly before "Choosing a path" as it did before this commit. |
| C13 | :1706, :1725 | Rule 3, introduce before dissecting: Mooncake Store and the Valkey large-object module are dissected without a clause saying what they are. The module first appeared in August 2026, so most readers have not met it. | One clause each, from the projects' own descriptions (orientation, not behaviour): "Mooncake Store, a DRAM pool spread over the engine instances whose master only allocates space," and "The Valkey large-object module, a Valkey module that stores large values such as KV tensors in a DRAM pool," (README L3). |
| C14 | :510-512 (ThreeDataPathsDiagram `<title>`), :1196 (h2 description). Pre-existing (register 03 row F71) | Tier laundering per the leverage standard: "reaches 700 Gbps per client" and "whether a client gets 700 Gbps" present an AWS maximum as a delivered figure. | "allows up to 700 Gbps per client, or 1,200 Gbps with GPUDirect Storage (AWS per-client maximums)" and "whether a client can reach the 700 Gbps maximum". |
| C15 | :1186-1187. Pre-existing | Overstated: "The only difference between them is a field in the create-file-system call". The next container (L1204-L1206) adds a client-side install, and EFA also changes capacity increments (L1326-L1331). | "On the service side, the difference between them is one field in the create-file-system call, and the gap it produces is 7 times per client." |

Not corrections, recorded so they are not raised again: the attribution in "the module README
describes" (C5's prop) and in "no AWS or Valkey document stating so was located" is load-bearing
(a conflict and a silence). "By our reading" labels are required by the leverage standard's third
check. "As of 2026-10-24" and "today" are dated hedges, not changelog voice.

## Backlog ("add X", out of scope for a corrections-only fix)

- B1. Name the failure signature for each RC stack as a monitoring hook: EOPNOTSUPP from
  `ibv_create_qp` for Mooncake's rdma transport, and whatever rdma_cm returns for core Valkey. That
  needs an experiment on an EFA instance logged in `research/`; row 31's kernel reading is the
  hypothesis.
- B2. Mooncake EFA wheels deliberately leave libfabric and libefa out of the bundle (Mooncake commit
  3a1117bc, "exclude libfabric/libefa from auditwheel bundle"), so the AWS EFA installer's
  libfabric has to be on the library path. That is practical, but it needs its own citation.
- B3. llm-d's cuFile loader degrades without error when libcufile is missing ("the same wheel works
  with or without GDS", cufile_loader.hpp v1.0.0 L61-L108). A check that GDS actually engaged would
  be the monitoring hook for the 1,200 Gbps row.
- B4. cuFile compatibility mode: cuFile falls back to POSIX where GDS is unavailable (LMCache's
  docstring says so; an NVIDIA source is needed before the page can). Pair it with a
  `gdscheck`-style verification step.
- B5. Valkey large-object throughput figures (register 01 row V65), once a first-party benchmark
  exists to set against the PR author's numbers.
- B6. Re-check row 29 when the glide ffi and Python PRs open or merge and when valkey-large-object
  tags its first release.
- B7. The comparison table's FSx CPU-cost cell now covers only the GDS path. Add a sourced
  statement for the EFA path without GDS.
- B8. Ratchet: `scripts/gates/pinned-refs.sh` matches only `main` and `master`. Add Valkey's
  `unstable` and other non-main default branches (for example `mainline`) to `RE_UNPINNED`.
- B9. Pin consistency: the container cites vLLM v0.31.0 while Sources.tsx rows 38 and 54 cite
  v0.32.0. The fs-tier files are byte-identical between the two, so re-pinning is safe in the next
  pass.
- B10. The section h1 ("Storage Data Paths: FSx for Lustre, S3 and the Common Runtime") and its
  description do not cover the pooled-DRAM tiers the new container adds. Decide whether the title
  names them or the pooled-DRAM half moves to the Inference section.
- B11. Promote ProjectRef into `@tech-deep-dives/shared` (or add a 'project' provenance to
  SourceRef), so the vLLM and silicon dives stop using 'documented', which reads "AWS states this",
  for project documents.
- B12. Playwright render check of `kvf-tiers-title` at 1440 and 390 and the overflow gates. Not run
  in this check.
- B13. If C1 takes the doc-code-conflict route, add the doc's runtime check (libfabric reports
  "Opened fabric: shm" alongside "Opened fabric: efa", efa_transport.md L390) as the way to see
  which same-host path is live.

## Sources used in this check, by tier

- Tier 1, source code at pinned tags or SHAs: rdma-core v65.0 `providers/efa/verbs.c`; valkey 9.1.2
  `src/rdma.c`; Mooncake v0.3.13.post1 (`multi_transport.cpp`, `efa_context.cpp`,
  `efa_transport.cpp`, `config.cpp`, `rdma_endpoint.cpp`, `common.cmake`, `build_wheel.sh`,
  `mooncake-store/src/transfer_task.cpp`); valkey-large-object 7510b948 (`src/commands/mod.rs`,
  `src/transport/session.rs`, `Cargo.toml`); momentohq/vdma 72c3a088 (`connection.rs`,
  `configuration.rs`, `endpoint.rs`); LMCache 7e5987f8 (`rdma_worker_pool.py`,
  `l1_memory_manager.py`) and v0.5.6 (`gds_backend.py`); valkey-glide 7644df8b
  (`glide-rdma/src/endpoint.rs`); llm-d-kv-cache v1.0.0 (`worker.py`, `cufile_loader.hpp`); dynamo
  v1.6.0 (`worker.rs`, `disk.rs`); nixl v1.5.0 (`gds_mt_engine.cpp`); vllm v0.31.0 and v0.32.0
  (`tiering/fs/io.py`, `manager.py`); sglang v0.5.22 (`hicache_storage.py`); Linux v6.17
  (`drivers/infiniband/hw/efa/efa_verbs.c`, `drivers/infiniband/core/cma.c`).
- Tier 1, AWS documentation: FSx for Lustre User Guide `performance.html`,
  `configure-efa-clients.html`, `efa-file-systems.html` (accessed 2026-10-24).
- Project documents (in-repo, orientation only under the source-authority standard): Mooncake
  `docs/source/design/transfer-engine/efa_transport.md` at v0.3.13.post1; valkey-large-object
  `README.md` and `docs/RDMA_CLIENT_INTEGRATIONS_DESIGN.md` at 7510b948.
- Project records (issues, pull requests, release metadata): Valkey issue 4743 comment
  5766728140; libfabric issue 12328 and its comment thread; Mooncake PR 2448; LMCache PR 5556;
  valkey-glide PR 7412; GitHub releases and tags API for valkey-large-object; Mooncake commit
  history via the GitHub API; PyPI JSON for `mooncake-transfer-engine-efa` and `-efa-cuda13`.
- [SPECULATIVE], our inference: the rdma_cm failure point for core Valkey on EFA (row 31), and
  FI_HMEM also curing the cross-process hang in libfabric issue 12328 (row 21).
