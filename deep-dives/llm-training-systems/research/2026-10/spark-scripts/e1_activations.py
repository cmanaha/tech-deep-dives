"""E1: activation memory per Llama 3.1 8B layer, measured against 01 W3/W4."""
import torch, json, sys, time, gc
from torch.utils.checkpoint import checkpoint
from torch.nn.attention import sdpa_kernel, SDPBackend
from llama_layer import Layer, SHAPES, rope_freqs
torch.manual_seed(0)
S = SHAPES["llama3.1-8b"]; h = S["h"]; GB = 1e9
results = []
def mem(): return torch.cuda.memory_allocated()

def run(k, s, b, ckpt, fused, backend):
    gc.collect(); torch.cuda.empty_cache(); torch.cuda.reset_peak_memory_stats()
    layers = [Layer(h, S["ffn"], S["n_heads"], S["n_kv"], fused_swiglu=fused) for _ in range(k)]
    freqs = rope_freqs(h // S["n_heads"], s)
    x = torch.randn(b, s, h, device="cuda", dtype=torch.bfloat16) * 0.1
    torch.cuda.synchronize(); m0 = mem(); torch.cuda.reset_peak_memory_stats()
    with sdpa_kernel([backend]):
        y = x
        for L in layers:
            y = checkpoint(L, y, freqs, use_reentrant=False) if ckpt else L(y, freqs)
        torch.cuda.synchronize(); m1 = mem(); pf = torch.cuda.max_memory_allocated()
        y.float().sum().backward()
    torch.cuda.synchronize(); pk = torch.cuda.max_memory_allocated()
    grads = sum(p.grad.numel() * p.grad.element_size() for L in layers for p in L.parameters())
    out = y.numel() * y.element_size()
    r = dict(k=k, s=s, b=b, ckpt=ckpt, fused=fused, backend=str(backend),
             saved_after_fwd_GB=(m1 - m0) / GB, output_GB=out / GB,
             peak_minus_weights_and_grads_GB=(pk - m0 - grads) / GB, peak_fwd_GB=(pf - m0) / GB)
    del layers, x, y; gc.collect(); torch.cuda.empty_cache()
    return r

def logits_run(s, b=1):
    V = S["V"]
    gc.collect(); torch.cuda.empty_cache()
    head = torch.nn.Linear(h, V, bias=False, dtype=torch.bfloat16, device="cuda")
    norm = torch.nn.RMSNorm(h, eps=1e-5, dtype=torch.bfloat16, device="cuda")
    x = (torch.randn(b, s, h, device="cuda", dtype=torch.bfloat16) * 0.1).requires_grad_()
    tgt = torch.randint(0, V, (b * s,), device="cuda")
    torch.cuda.synchronize(); m0 = mem(); torch.cuda.reset_peak_memory_stats()
    logits = head(norm(x)).float()
    loss = torch.nn.functional.cross_entropy(logits.view(-1, V), tgt)
    del logits
    torch.cuda.synchronize(); m1 = mem(); pf = torch.cuda.max_memory_allocated()
    loss.backward(); torch.cuda.synchronize(); pk = torch.cuda.max_memory_allocated()
    grads = sum(p.grad.numel() * p.grad.element_size() for p in list(head.parameters()) + list(norm.parameters())) + x.grad.numel() * 2
    r = dict(kind="logits", s=s, b=b, saved_after_fwd_GB=(m1 - m0) / GB, peak_fwd_GB=(pf - m0) / GB,
             peak_minus_grads_GB=(pk - m0 - grads) / GB, predicted_fp32_logits_GB=4 * s * b * V / GB)
    del head, norm, x; gc.collect(); torch.cuda.empty_cache()
    return r

if __name__ == "__main__":
    print(json.dumps(dict(torch=torch.__version__, cuda=torch.version.cuda, device=torch.cuda.get_device_name(0),
                          cap=torch.cuda.get_device_capability(0))), flush=True)
    # which SDPA backend works on this GPU
    backends = []
    for be in [SDPBackend.FLASH_ATTENTION, SDPBackend.CUDNN_ATTENTION, SDPBackend.EFFICIENT_ATTENTION]:
        try:
            r = run(1, 2048, 1, False, False, be); backends.append(be); print("backend ok", be, flush=True)
        except Exception as e:
            print("backend fails", be, repr(e)[:200], flush=True)
    be = backends[0]
    for fused in [False, True]:
        for s in [2048, 4096, 8192]:
            for b in [1, 2]:
                for ckpt in [False, True]:
                    for k in [1, 2, 4]:
                        if s * b > 16384: continue
                        r = run(k, s, b, ckpt, fused, be)
                        sbh = s * b * h
                        r["coef_saved_per_layer_sbh"] = r["saved_after_fwd_GB"] * GB / k / sbh
                        results.append(r); print(json.dumps(r), flush=True)
    for alt in backends[1:]:
        for k in [1, 2, 4]:
            r = run(k, 8192, 1, False, False, alt); r["coef_saved_per_layer_sbh"] = r["saved_after_fwd_GB"] * GB / k / (8192 * h)
            results.append(r); print(json.dumps(r), flush=True)
    for s in [2048, 4096, 8192]:
        r = logits_run(s); results.append(r); print(json.dumps(r), flush=True)
    json.dump(results, open("out/e1_results.json", "w"), indent=1)
    print("DONE", flush=True)
