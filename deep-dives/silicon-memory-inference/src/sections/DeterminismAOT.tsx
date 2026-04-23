import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function DeterminismAOT() {
  return (
    <SectionShell
      title="Determinism — Trainium NEFF and GPU Reproducibility"
      subtitle="Per-call reproducibility as a regulatory and operational feature"
      tldr={[
        'Trainium compiles the graph ahead of time into NEFF (Neuron Executable File Format). The schedule is fixed at compile time; runtime executes it deterministically.',
        'Same NEFF, same input, same silicon produces the same output in the same order — a property regulated workloads can point to.',
        'GPUs can approach determinism through CCCL 3.1, deterministic kernel selection, and careful use of reductions and PRNG — but determinism is opt-in and comes with throughput cost.',
        'Capital markets, healthcare, and audit-sensitive workloads increasingly treat determinism as a first-class requirement, not a nice-to-have.',
      ]}
      scope={[
        'Neuron compiler pipeline: source graph → HLO → Neuron HLO → schedule → NEFF binary.',
        'NEFF AOT vs JIT: when you re-compile, how the cache behaves, recompile cost.',
        'Sources of non-determinism on GPUs: atomic reductions, non-deterministic kernel selection, dynamic shape replay, thread scheduling.',
        'GPU determinism practices: CUDA deterministic mode, cuBLAS / cuDNN determinism flags, CCCL 3.1 collective determinism.',
        'End-to-end determinism: PRNG seeding, reduction order, operator selection, precision contract.',
        'Regulatory mapping: SR 11-7 (model risk), MiFID II (algo governance), FINRA 3110, HIPAA, SEC Rule 17a-4.',
        'Post-trade reconstruction: replaying an inference to produce identical outputs for audit.',
      ]}
      panelistMap="AWS-strong. Determinism as a property of the compiler-silicon contract is the Trainium story at its sharpest. Use this section when the conversation drifts into regulated finance or healthcare — it is a differentiator that is hard to retrofit into a GPU SIMT model."
      evaluationLens={[
        'Is determinism a regulatory requirement, an operational one (debugging, A/B tests), or both?',
        'Does the current runtime produce deterministic outputs under load — or only on a single-threaded path?',
        'Is the PRNG seeded, the reduction order fixed, the operator selection locked?',
        'What happens on a recompile — does the cache hit, or does the schedule change?',
      ]}
    />
  );
}
