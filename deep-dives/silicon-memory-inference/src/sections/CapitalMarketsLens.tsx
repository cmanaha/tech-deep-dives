import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function CapitalMarketsLens() {
  return (
    <SectionShell
      title="Capital Markets Lens"
      subtitle="Jitter, tail latency, and why capital markets ask different questions"
      tldr={[
        'Capital markets do not optimize median latency. They optimize the 99.9th and 99.99th percentile under load.',
        'Tick-to-trade budgets are measured in microseconds, sometimes nanoseconds; a single page fault or coherence stall can break the SLA.',
        'CXL attached memory solves the wrong problem for HFT — it adds capacity when the workload already has capacity and needs less latency, not more.',
        'Determinism becomes a regulatory feature: post-trade reconstruction, model-risk, and audit all benefit from reproducible inference.',
      ]}
      scope={[
        'Latency hierarchy in canonical units — L1 ~1 ns, LLC ~10 ns, DRAM ~100 ns, NVMe ~10 µs, network ~50-500 µs.',
        'Jitter sources: OS scheduling, interrupts, TLB misses, coherence traffic, NUMA crossings, noisy neighbors.',
        'Tail-latency contributors unique to AI inference: KV cache page fault, token-level speculation misses, collective stragglers.',
        'Colocation, kernel bypass, cpu pinning, hugepages, isolcpus — the classic HFT toolkit and how it maps to modern silicon.',
        'Where CXL fits in finance (analytics, backtest, reporting) and where it does not (tick-to-trade path).',
        'Where HBM + on-die SRAM inference wins (compact deterministic models with tight latency SLAs).',
        'Regulated inference: post-trade reconstruction, SR 11-7 model risk, FINRA Rule 3110, MiFID II.',
      ]}
      panelistMap="Carlos's background. This is home turf — speak from the trader seat and the architecture seat simultaneously. Use this section to reframe questions that drift into throughput when the underlying constraint is jitter."
      evaluationLens={[
        'What is the p99.9 latency target, and what is the contribution of each hop to it?',
        'Is the bottleneck median throughput or tail behavior? The answers diverge quickly at scale.',
        'Does the workload need capacity (analytics) or latency (tick-to-trade)? Pick the silicon accordingly.',
        'Is the determinism requirement regulatory, operational, or both?',
      ]}
    />
  );
}
