"""E2: step time, recomputation cost and MFU against a measured BF16 GEMM ceiling on one GB10.
Llama 3.2 1B shape, random init, AdamW, FP32 params + BF16 autocast (16 bytes/param model state)."""
import torch, torch.nn as nn, torch.nn.functional as F, time, json, gc, sys
from functools import partial
from torch.utils.checkpoint import checkpoint, create_selective_checkpoint_contexts, CheckpointPolicy
from llama_layer import Layer, SHAPES, rope_freqs
torch.manual_seed(0)
S = SHAPES["llama3.2-1b"]; h, L, V = S["h"], S["L"], S["V"]
SEQ, MB, ACC, STEPS, WARM = 2048, 1, 4, 50, 5

def gemm_ceiling():
    out = []
    for n in [2048, 4096, 6144, 8192, 12288, 16384]:
        a = torch.randn(n, n, device="cuda", dtype=torch.bfloat16); b = torch.randn(n, n, device="cuda", dtype=torch.bfloat16)
        for _ in range(3): a @ b
        torch.cuda.synchronize(); it = max(3, int(2e12 // (2 * n**3)) + 1); t = time.perf_counter()
        for _ in range(it): a @ b
        torch.cuda.synchronize(); dt = (time.perf_counter() - t) / it
        out.append(dict(n=n, tflops=2 * n**3 / dt / 1e12)); del a, b
    # training-shaped GEMMs: tokens x h -> ffn, etc.
    for (m, k, n) in [(8192, 2048, 8192), (8192, 8192, 2048), (8192, 2048, 128256 // 4)]:
        a = torch.randn(m, k, device="cuda", dtype=torch.bfloat16); b = torch.randn(k, n, device="cuda", dtype=torch.bfloat16)
        for _ in range(3): a @ b
        torch.cuda.synchronize(); it = 20; t = time.perf_counter()
        for _ in range(it): a @ b
        torch.cuda.synchronize(); dt = (time.perf_counter() - t) / it
        out.append(dict(m=m, k=k, n=n, tflops=2 * m * k * n / dt / 1e12)); del a, b
    torch.cuda.empty_cache(); return out

class Model(nn.Module):
    def __init__(self):
        super().__init__()
        self.emb = nn.Embedding(V, h, device="cuda")
        self.layers = nn.ModuleList([Layer(h, S["ffn"], S["n_heads"], S["n_kv"], dtype=torch.float32) for _ in range(L)])
        self.norm = nn.RMSNorm(h, eps=1e-5, device="cuda")
        nn.init.normal_(self.emb.weight, std=0.02)
    def forward(self, tok, freqs, mode):
        x = self.emb(tok)
        for lyr in self.layers:
            if mode == "none": x = lyr(x, freqs)
            elif mode == "full": x = checkpoint(lyr, x, freqs, use_reentrant=False)
            else: x = checkpoint(lyr, x, freqs, use_reentrant=False, context_fn=sac_ctx)
        return F.linear(self.norm(x), self.emb.weight)  # tied head

aten = torch.ops.aten
SAVE = {aten.mm.default, aten.addmm.default, aten.bmm.default,
        aten._scaled_dot_product_flash_attention.default, aten._scaled_dot_product_efficient_attention.default,
        aten._scaled_dot_product_cudnn_attention.default}
def policy(ctx, op, *a, **k):
    return CheckpointPolicy.MUST_SAVE if op in SAVE else CheckpointPolicy.PREFER_RECOMPUTE
sac_ctx = partial(create_selective_checkpoint_contexts, policy)

def train(mode):
    gc.collect(); torch.cuda.empty_cache(); torch.cuda.reset_peak_memory_stats()
    m = Model(); n_params = sum(p.numel() for p in m.parameters())
    opt = torch.optim.AdamW(m.parameters(), lr=3e-4, betas=(0.9, 0.95), weight_decay=0.1, fused=True)
    freqs = rope_freqs(h // S["n_heads"], SEQ)
    g = torch.Generator(device="cuda"); g.manual_seed(1)
    times, losses = [], []
    for step in range(STEPS):
        torch.cuda.synchronize(); t = time.perf_counter()
        for _ in range(ACC):
            tok = torch.randint(0, V, (MB, SEQ + 1), device="cuda", generator=g)
            with torch.autocast("cuda", dtype=torch.bfloat16):
                logits = m(tok[:, :-1], freqs, mode)
            loss = F.cross_entropy(logits.float().view(-1, V), tok[:, 1:].reshape(-1)) / ACC
            loss.backward()
        torch.nn.utils.clip_grad_norm_(m.parameters(), 1.0)
        opt.step(); opt.zero_grad(set_to_none=True)
        torch.cuda.synchronize(); times.append(time.perf_counter() - t); losses.append(loss.item() * ACC)
    peak = torch.cuda.max_memory_allocated()
    del m, opt; gc.collect(); torch.cuda.empty_cache()
    return n_params, times, losses, peak

if __name__ == "__main__":
    info = dict(torch=torch.__version__, cuda=torch.version.cuda, device=torch.cuda.get_device_name(0))
    print(json.dumps(info), flush=True)
    ceil = gemm_ceiling(); print(json.dumps(dict(gemm=ceil)), flush=True)
    peak_tf = max(c["tflops"] for c in ceil)
    tok_per_step = MB * SEQ * ACC
    res = dict(info=info, gemm=ceil, peak_measured_tflops=peak_tf, seq=SEQ, mb=MB, acc=ACC, steps=STEPS, warm=WARM, runs={})
    modes = sys.argv[1:] or ["none", "full", "selective"]
    for mode in modes:
        n, times, losses, peak = train(mode)
        n_mm = L * sum(p.numel() for p in Layer(h, S["ffn"], S["n_heads"], S["n_kv"], dtype=torch.bfloat16).parameters() if p.dim() == 2) + V * h
        dt = sum(times[WARM:]) / len(times[WARM:]); tps = tok_per_step / dt
        f_dense = 6 * n_mm; f_attn_nc = 12 * L * h * SEQ; f_attn_c = 6 * L * h * SEQ
        r = dict(mode=mode, n_params=n, n_mm=n_mm, step_s=dt, tokens_per_s=tps, peak_GB=peak / 1e9,
                 loss_first=losses[0], loss_last=losses[-1],
                 model_tflops_6N=tps * f_dense / 1e12,
                 model_tflops_6N_attn_causal=tps * (f_dense + f_attn_c) / 1e12,
                 model_tflops_6N_attn_nocausal=tps * (f_dense + f_attn_nc) / 1e12)
        for k in ["6N", "6N_attn_causal", "6N_attn_nocausal"]:
            r["mfu_vs_measured_gemm_" + k] = r["model_tflops_" + k] / peak_tf
        res["runs"][mode] = r; print(json.dumps(r), flush=True)
        json.dump(res, open("out/e2_results.json", "w"), indent=1)
    print("DONE", flush=True)
