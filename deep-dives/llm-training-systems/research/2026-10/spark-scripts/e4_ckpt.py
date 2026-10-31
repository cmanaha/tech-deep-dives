"""E4: checkpoint staging on one rank: dcp.save, bare async_save, async_save with a pinned stager,
and whether async_save accepts an NCCL-only process group. Run: e4_ckpt.py main | ncclonly"""
import os, sys, time, json, shutil, torch, torch.distributed as dist
import torch.distributed.checkpoint as dcp
from torch.distributed.checkpoint.staging import DefaultStager, StagingOptions
from torch.distributed.checkpoint.state_dict_saver import AsyncCheckpointerType
OUT = os.path.abspath("out/ckpt"); GB = 1e9
os.environ.setdefault("MASTER_ADDR", "127.0.0.1"); os.environ.setdefault("MASTER_PORT", "29533")

def make_sd():
    g = torch.Generator(device="cuda"); g.manual_seed(0)
    return {f"t{i}": torch.randn(33554432, device="cuda", generator=g) for i in range(30)}  # 30 x 128 MiB fp32

def nbytes(sd): return sum(t.numel() * t.element_size() for t in sd.values())

def clean(p): shutil.rmtree(p, ignore_errors=True)

def main():
    dist.init_process_group("cpu:gloo,cuda:nccl", rank=0, world_size=1)
    torch.cuda.set_device(0)
    sd = make_sd(); torch.cuda.synchronize()
    res = dict(torch=torch.__version__, state_dict_GB=nbytes(sd) / GB, runs=[])
    def rec(**kw): res["runs"].append(kw); print(json.dumps(kw), flush=True); json.dump(res, open("out/e4_results.json", "w"), indent=1)
    for i in range(3):
        p = f"{OUT}/sync{i}"; clean(p); torch.cuda.synchronize(); t = time.perf_counter()
        dcp.save({"m": sd}, checkpoint_id=p); torch.cuda.synchronize(); dt = time.perf_counter() - t
        rec(mode="dcp.save", i=i, blocking_s=dt, total_s=dt); clean(p)
    for i in range(3):
        p = f"{OUT}/abare{i}"; clean(p); torch.cuda.synchronize(); t = time.perf_counter()
        f = dcp.async_save({"m": sd}, checkpoint_id=p); blk = time.perf_counter() - t
        f.result(); tot = time.perf_counter() - t
        rec(mode="async_save bare (thread, default stager)", i=i, blocking_s=blk, total_s=tot, returned=type(f).__name__); clean(p)
    for ctype in [AsyncCheckpointerType.THREAD, AsyncCheckpointerType.PROCESS]:
        stager = DefaultStager(StagingOptions(use_pinned_memory=True, use_shared_memory=ctype == AsyncCheckpointerType.PROCESS,
                                              use_async_staging=True, use_non_blocking_copy=True))
        for i in range(3):
            p = f"{OUT}/apin{ctype.name}{i}"; clean(p); torch.cuda.synchronize(); t = time.perf_counter()
            r = dcp.async_save({"m": sd}, checkpoint_id=p, async_stager=stager, async_checkpointer_type=ctype)
            blk = time.perf_counter() - t
            if hasattr(r, "staging_completion"):
                r.staging_completion.result(); stg = time.perf_counter() - t
                r.upload_completion.result(); tot = time.perf_counter() - t
            else:
                stg = None; r.result(); tot = time.perf_counter() - t
            rec(mode=f"async_save pinned stager ({ctype.name})", i=i, blocking_s=blk, staged_s=stg, total_s=tot, returned=type(r).__name__); clean(p)
        stager.close()
    # pure device-to-host copy references
    for pin in [False, True]:
        dst = {k: torch.empty(v.shape, dtype=v.dtype, pin_memory=pin) for k, v in sd.items()}
        for i in range(2):
            torch.cuda.synchronize(); t = time.perf_counter()
            for k, v in sd.items(): dst[k].copy_(v, non_blocking=pin)
            torch.cuda.synchronize(); dt = time.perf_counter() - t
            rec(mode=f"raw D2H copy pinned={pin}", i=i, seconds=dt, GBps=nbytes(sd) / GB / dt)
        del dst
    dist.destroy_process_group()

def ncclonly():
    dist.init_process_group("nccl", rank=0, world_size=1, device_id=torch.device("cuda:0"))
    sd = {"t": torch.randn(1024, device="cuda")}
    r = dict(pg_backend=str(dist.get_backend()))
    try:
        f = dcp.async_save({"m": sd}, checkpoint_id=f"{OUT}/nccl"); f.result(); r["raised"] = None
    except Exception as e:
        r["raised"] = f"{type(e).__name__}: {e}"
    clean(f"{OUT}/nccl"); print(json.dumps(r), flush=True); json.dump(r, open("out/e4_ncclonly.json", "w"), indent=1)
    dist.destroy_process_group()

if __name__ == "__main__":
    {"main": main, "ncclonly": ncclonly}[sys.argv[1]]()
    print("DONE", flush=True)
