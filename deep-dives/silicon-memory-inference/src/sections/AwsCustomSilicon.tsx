import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function AwsCustomSilicon() {
  return (
    <SectionShell
      title="AWS Custom Silicon"
      subtitle="Trainium, Inferentia, and the Neuron compiler"
      tldr={[
        'Trainium and Inferentia are AWS-designed accelerators built around a systolic array, compiler-managed SBUF and PSUM scratchpads, and CC-Cores for collective operations.',
        'The Neuron compiler emits a NEFF (Neuron Executable File Format) binary ahead of time. AOT compilation means the execution schedule is fixed before the workload runs — the source of both performance predictability and determinism.',
        'Determinism is a first-class property. The same NEFF on the same silicon produces the same outputs in the same order, which matters for regulated workloads, post-trade reproducibility, and model evaluation.',
        'Trainium3 extends the line with higher HBM bandwidth, larger SBUF, and tighter CC-Core integration for multi-chip scale-out.',
      ]}
      scope={[
        'Trainium1 → Trainium2 → Trainium3 lineage: what changed in SBUF, PSUM, HBM tier, and CC-Core count.',
        'Inferentia2 — the inference-tuned sibling, Neuron Cores v2, SBUF sizing.',
        'Neuron compiler pipeline: source graph → HLO → Neuron HLO → schedule → NEFF. Where operator fusion and tiling happen.',
        'NEFF AOT vs JIT — when you re-compile, what happens when the graph shape changes, caching strategy.',
        'Memory model: SBUF (state buffer), PSUM (partial sum), HBM, DRAM — who writes what and when.',
        'Collective operations via CC-Cores: on-chip, on-host, cross-host, and how they compose with EFA for multi-node.',
        'Instance families: Trn1, Trn1n, Trn2, Trn2 UltraServer, Inf2 — and the workload match to each.',
      ]}
      panelistMap="AWS-exclusive territory. This is the 'what is AWS uniquely shipping' section. Cerebras ships a wafer, HyperCIM ships compute-in-memory, AWS ships a co-designed compiler + silicon + network stack with formal determinism guarantees."
      evaluationLens={[
        'Is the workload NEFF-cacheable — does it have stable graph shape, or is it dynamic enough to require recompile?',
        'Does the customer need per-call determinism? If yes, Trainium NEFF AOT is a differentiator that GPUs cannot match without giving up throughput.',
        'Is the collective pattern small enough for CC-Cores, or large enough to need EFA + NCCL-style fan-out?',
        'Does the model architecture (attention pattern, activation layout) fit the systolic array shape, or is it fighting it?',
      ]}
    />
  );
}
