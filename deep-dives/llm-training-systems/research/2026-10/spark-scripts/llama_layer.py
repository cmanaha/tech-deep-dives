"""Llama 3.x decoder layer in plain PyTorch, shaped like TorchTitan v0.4.0's
(RMSNorm, GQA attention through SDPA with enable_gqa, RoPE, SwiGLU MLP).
Random weights; no checkpoint download."""
import torch, torch.nn as nn, torch.nn.functional as F

class SwiGLUFused(torch.autograd.Function):
    """Saves only gate and up; recomputes silu in backward (what a fused kernel stores)."""
    @staticmethod
    def forward(ctx, gate, up):
        ctx.save_for_backward(gate, up)
        return F.silu(gate) * up
    @staticmethod
    def backward(ctx, g):
        gate, up = ctx.saved_tensors
        gf = gate.float(); sig = torch.sigmoid(gf); silu = gf * sig
        d_up = (g.float() * silu).to(up.dtype)
        d_gate = (g.float() * up.float() * sig * (1 + gf * (1 - sig))).to(gate.dtype)
        return d_gate, d_up

def rope_freqs(head_dim, seqlen, theta=500000.0, device="cuda"):
    inv = 1.0 / (theta ** (torch.arange(0, head_dim, 2, device=device).float() / head_dim))
    t = torch.arange(seqlen, device=device).float()
    f = torch.outer(t, inv)
    return torch.polar(torch.ones_like(f), f)  # complex64 [s, hd/2]

def apply_rope(x, freqs):  # x [b, s, H, hd]
    xc = torch.view_as_complex(x.float().reshape(*x.shape[:-1], -1, 2))
    out = torch.view_as_real(xc * freqs[None, :, None, :]).flatten(-2)
    return out.type_as(x)

class Layer(nn.Module):
    def __init__(self, h, ffn, n_heads, n_kv, fused_swiglu=False, dtype=torch.bfloat16):
        super().__init__()
        self.h, self.nh, self.nkv, self.hd = h, n_heads, n_kv, h // n_heads
        kw = dict(bias=False, dtype=dtype, device="cuda")
        self.attn_norm = nn.RMSNorm(h, eps=1e-5, dtype=dtype, device="cuda")
        self.wq = nn.Linear(h, n_heads * self.hd, **kw)
        self.wk = nn.Linear(h, n_kv * self.hd, **kw)
        self.wv = nn.Linear(h, n_kv * self.hd, **kw)
        self.wo = nn.Linear(n_heads * self.hd, h, **kw)
        self.ffn_norm = nn.RMSNorm(h, eps=1e-5, dtype=dtype, device="cuda")
        self.w1 = nn.Linear(h, ffn, **kw); self.w3 = nn.Linear(h, ffn, **kw); self.w2 = nn.Linear(ffn, h, **kw)
        self.fused = fused_swiglu
        for p in self.parameters():
            if p.dim() == 2: nn.init.normal_(p, std=0.02)
    def forward(self, x, freqs):
        b, s, _ = x.shape
        y = self.attn_norm(x)
        q = self.wq(y).view(b, s, self.nh, self.hd); k = self.wk(y).view(b, s, self.nkv, self.hd)
        v = self.wv(y).view(b, s, self.nkv, self.hd)
        q, k = apply_rope(q, freqs), apply_rope(k, freqs)
        o = F.scaled_dot_product_attention(q.transpose(1, 2), k.transpose(1, 2), v.transpose(1, 2),
                                           is_causal=True, enable_gqa=self.nh > self.nkv)
        x = x + self.wo(o.transpose(1, 2).reshape(b, s, -1))
        z = self.ffn_norm(x)
        g, u = self.w1(z), self.w3(z)
        a = SwiGLUFused.apply(g, u) if self.fused else F.silu(g) * u
        return x + self.w2(a)

SHAPES = {
    "llama3.1-8b": dict(h=4096, ffn=14336, n_heads=32, n_kv=8, L=32, V=128256),
    "llama3.2-1b": dict(h=2048, ffn=8192, n_heads=32, n_kv=8, L=16, V=128256),
}
