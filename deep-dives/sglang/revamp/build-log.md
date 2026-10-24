# Build log (orchestrator)

Per-section author reports, for the glossary, the fact check and the final report.

| Section | File | Cites | Diagrams (harness 1440/390) | Acronyms expanded | Open items for fact check |
| --- | --- | --- | --- | --- | --- |
| 3 Runtime | RuntimeProcesses.tsx | 68 | 1, 0 overlap/clip | SRT, ZMQ, TP, PP, DP, attention DP, KV, RPC, PD | Code-read, no register row: Rust server has no auth layer and no /metrics (so --api-key protects nothing with SGLANG_RUST_SERVER=1, our reading); multi-tokenizer mode never installs the key middleware; follower-node stub answers /health 200 regardless; scheduler busy-spins idle unless --sleep-on-idle; attention-DP port map; Rust frontend core pinning |
| 4 Scheduler | Scheduler.tsx | 59 | 2, 0 overlap/clip | KV, EOS, TTFT, PD, FCFS, TP, DP, ITL, lpm | Code-read, no row: ratio reset on full idle; ignore_eos charged at ratio 1.0; 4096 cap limits only the charge; evictable cache counts as free room. Some register line ranges off by a few lines (author cited verified lines) |
| 5 Radix cache | RadixCache.tsx | 81 (6 code, 1 doc-code) | 3, 0 overlap/clip | KV, SHA-256, HiCache, LRU, LFU, SLRU, FCFS, LPM, HRRN, PD, TTFT, LMSYS, LLM, CI | 01 E8 hit-rate query: counters carry different labels, author shipped sum(rate)/sum(rate); 02 C14 points to sglang:cache_hit_rate which holds last batch only, followed 01 E8 |
