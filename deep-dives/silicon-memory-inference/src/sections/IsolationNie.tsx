import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function IsolationNie() {
  return (
    <SectionShell
      title="Isolation — Nitro Isolation Engine and MIG"
      subtitle="Hardware-enforced tenant separation for multi-tenant AI inference"
      tldr={[
        'Nitro Isolation Engine (NIE) enforces tenant separation in hardware. The boundary is not a kernel policy — it is a silicon gate.',
        'NIE is formally verified in Isabelle/HOL. The separation properties are theorems, not claims.',
        'NVIDIA MIG partitions a single GPU (H100, H200, B200, B300) into up to seven isolated instances, each with its own SMs, cache partition, and HBM slice.',
        'TEE-I/O extends the confidential-computing boundary to GPU memory, encrypting traffic between CPU and GPU.',
      ]}
      scope={[
        'Nitro architecture: control plane, data plane, Nitro cards, and where the isolation boundary actually sits.',
        'Formal verification of NIE in Isabelle/HOL — what is proven, what assumptions are required.',
        'NVIDIA MIG: partition granularity, resource counters, noisy-neighbor protection inside a single GPU.',
        'Confidential computing: TEE-I/O, encrypted PCIe, attestation flows.',
        'Threat model: tenant-vs-tenant, host-vs-tenant, supply-chain.',
        'Regulatory context: FedRAMP, SOC 2, sovereignty frameworks where formal verification is a differentiator.',
      ]}
      panelistMap="AWS-exclusive. The formal-verification story is unique; every other panelist will handwave about isolation, and this is where you can cite Isabelle/HOL directly. Carry the three-pillar framing: isolation at host (Nitro), at GPU (MIG), at silicon (Trainium per-NEFF contracts)."
      evaluationLens={[
        'Is the isolation requirement tenant-vs-tenant (MIG, NIE) or workload-vs-workload (cgroups, namespaces)?',
        'Does the customer need cryptographic attestation, or policy attestation?',
        'Is the accelerator partitioned — and does the partition survive the workload profile?',
        'What is the failure mode if isolation is breached — and how would it be detected?',
      ]}
    />
  );
}
