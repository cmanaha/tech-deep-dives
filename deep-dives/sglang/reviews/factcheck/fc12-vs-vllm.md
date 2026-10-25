# fc12-vs-vllm: fact check of section 23 (SGLang and vLLM: what differs, what converged, and how to read the benchmarks)

Pin: SGLang v0.5.22, commit baa9befa381511cd4d56f83980951e5a45fffc6d (`/tmp/sglang-src`). vLLM v0.31.0,
commit db9527a46873454610df6dbedf79a36d6bf1a7f6, read at `/tmp/vllm-v0.31.0` (blob SHAs of `vllm/config/cache.py`
and `vllm/envs.py` match `gh api .../contents/<path>?ref=v0.31.0`; `/tmp/vllm-new` is partial). Checked 2026-10-24.
Paths below are relative to `python/sglang/srt/` (SGLang) or the vLLM repo root (vLLM) unless stated.

Status: in progress (first draft written early so it survives an interruption).

## SglangVsVllm.tsx (section 23)

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
