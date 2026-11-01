"""E3: count FSDP2 collectives per optimizer step under gradient accumulation (4 micro-batches).
Run under torchrun --nproc_per_node 2 with gloo on CPU; or 'fake' as argv[1] to use the fake process group."""
import os, sys, json, collections, torch, torch.nn as nn, torch.distributed as dist
from torch.distributed.fsdp import fully_shard
from torch.distributed.device_mesh import init_device_mesh

COUNTS = collections.Counter()
def wrap(name):
    orig = getattr(dist, name)
    def f(*a, **k):
        COUNTS[name] += 1; return orig(*a, **k)
    setattr(dist, name, f)
for n in ["all_gather_single", "reduce_scatter_single", "all_gather_into_tensor", "reduce_scatter_tensor",
          "all_reduce", "all_gather", "reduce_scatter", "broadcast"]:
    if hasattr(dist, n): wrap(n)

class Block(nn.Module):
    def __init__(s, d):
        super().__init__(); s.a = nn.Linear(d, 4 * d); s.b = nn.Linear(4 * d, d)
    def forward(s, x): return x + s.b(torch.relu(s.a(x)))

def build(d=256, n_blocks=4):
    m = nn.Sequential(nn.Linear(d, d), *[Block(d) for _ in range(n_blocks)], nn.Linear(d, d))
    return m

def run(setting, mesh, M=4):
    torch.manual_seed(0)
    m = build()
    for blk in m[1:-1]: fully_shard(blk, mesh=mesh)
    fully_shard(m, mesh=mesh)
    opt = torch.optim.AdamW(m.parameters(), lr=1e-3)
    out = {}
    for step in range(2):
        COUNTS.clear(); per_mb = []
        for mb in range(M):
            last = mb == M - 1
            if setting in ("no_sync", "no_sync_no_reshard"):
                m.set_requires_gradient_sync(last)
            if setting == "no_sync_no_reshard":
                m.set_reshard_after_backward(last)
            before = dict(COUNTS)
            x = torch.randn(8, 256)
            m(x).pow(2).mean().backward()
            per_mb.append({k: COUNTS[k] - before.get(k, 0) for k in COUNTS})
        before = dict(COUNTS); opt.step(); opt.zero_grad()
        out[f"step{step}"] = dict(total=dict(COUNTS), per_microbatch=per_mb,
                                   optimizer={k: COUNTS[k] - before.get(k, 0) for k in COUNTS})
    return out

def main():
    fake = len(sys.argv) > 1 and sys.argv[1] == "fake"
    if fake:
        from torch.testing._internal.distributed.fake_pg import FakeStore
        dist.init_process_group("fake", store=FakeStore(), rank=0, world_size=2)
    else:
        dist.init_process_group("gloo")
    mesh = init_device_mesh("cpu", (dist.get_world_size(),))
    res = dict(torch=torch.__version__, backend=dist.get_backend(), world=dist.get_world_size(),
               fsdp_units="4 Blocks + root (root holds the first and last Linear)", microbatches=4, results={})
    for setting in ["default", "no_sync", "no_sync_no_reshard"]:
        res["results"][setting] = run(setting, mesh)
        if dist.get_rank() == 0: print(setting, json.dumps(res["results"][setting]["step1"]), flush=True)
    if dist.get_rank() == 0:
        json.dump(res, open(f"out/e3_results_{'fake' if fake else 'gloo'}.json", "w"), indent=1)
    dist.destroy_process_group()

if __name__ == "__main__":
    main(); print("DONE", flush=True)
