import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function IsolationAndDeterminism() {
  return (
    <SectionShell
      title="Isolation and Determinism"
      subtitle="Multi-tenant safety and per-call reproducibility as first-class properties"
      tldr={[
        'Three AWS pillars: Nitro Isolation Engine (formally verified in Isabelle/HOL), NVIDIA MIG for GPU partitioning, and Trainium NEFF AOT for compile-time determinism.',
        'Isolation protects tenants from each other. Determinism protects an execution from itself across time.',
        'Regulated workloads (finance, healthcare, audit) need both — multi-tenant safety and the ability to replay an inference and get the same answer.',
        'GPUs can approach determinism with CCCL 3.1 and careful kernel selection, but Trainium offers it as a default.',
      ]}
      scope={[
        'Nitro Isolation Engine (NIE): hardware-enforced tenant separation, formal verification in Isabelle/HOL, threat model.',
        'NVIDIA MIG: partitioning an H100 / H200 / B200 / B300 into isolated instances, when MIG is enough vs when it is not.',
        'TEE-I/O and confidential computing on GPU: where the encrypted boundary actually sits.',
        'Trainium NEFF AOT: compile-time schedule, deterministic execution, how the Neuron compiler enforces it.',
        'GPU determinism practices: CCCL 3.1, cuBLAS deterministic mode, algorithm selection constraints.',
        'What breaks determinism on GPUs: atomic reductions, non-deterministic kernel selection, dynamic shape replay, thread scheduling.',
        'Regulatory mapping: what SR 11-7, FINRA, MiFID II, and HIPAA ask for that determinism helps answer.',
      ]}
      panelistMap="AWS ownership territory. Cerebras and HyperCIM may mention their own determinism stories, but the NIE formal-verification story is unique to AWS. Carry the three-pillar answer and the regulatory framing."
      evaluationLens={[
        'Is the workload subject to model-risk or audit requirements that need replayability?',
        'Is multi-tenant isolation a latency concern (noisy neighbor) or a security concern (tenant separation)?',
        'If determinism is required, is it end-to-end — including PRNG seeding, reduction order, and kernel selection — or only nominally?',
        'Does the chosen silicon make determinism the default or the exception?',
      ]}
    />
  );
}
