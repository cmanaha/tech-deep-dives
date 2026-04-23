import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function CommunicationAndScaleOut() {
  return (
    <SectionShell
      title="Communication and Scale-Out"
      subtitle="NCCL, NIXL, EFA, NVLink, and how multi-node inference actually works"
      tldr={[
        'Inside a node the dominant fabric is NVLink / NVSwitch or NV-HBI; across nodes it is EFA with SRD as the reliable transport.',
        'NCCL is the classic collective library; NIXL is the newer transfer layer designed around inference patterns (KV migration, weight sharding, disaggregated serving).',
        'EFA v1 → v4 progressively moved more of the network stack into Nitro hardware and widened the per-instance bandwidth envelope.',
        'Capacity Blocks for ML and SageMaker HyperPod are the operational mechanisms for reserving and landing the scale-out capacity when it matters.',
      ]}
      scope={[
        'Intra-node fabrics: NVLink, NVSwitch, NV-HBI, Infinity Fabric (xGMI), NVLink-C2C.',
        'Inter-node fabrics: EFA v1 through v4, SRD protocol, per-interface bandwidth ceiling per instance family.',
        'Collective libraries: NCCL, RCCL, AWS OFI NCCL, NIXL (inference-oriented transfer layer).',
        'NIXL + EFA integration for KV cache migration and disaggregated prefill-decode.',
        'Scale-out topologies: rail-optimized, fat tree, UltraServer NVL72 rack as a single logical accelerator.',
        'Capacity Blocks for ML, SageMaker HyperPod, and the landing experience for GB200 / GB300 UltraServer and Trn2 UltraServer.',
      ]}
      panelistMap="AWS-favorable. The network is where AWS has spent a decade and where the Nitro story pays off. Cerebras avoids the problem at WSE scale; HyperCIM avoids it by co-locating compute and memory. When the conversation moves past a single chip, this is where AWS leads."
      evaluationLens={[
        'Is the model parallel strategy tensor-parallel, pipeline-parallel, or expert-parallel? Each has a different collective pattern.',
        'What is the tail latency of the collective under realistic contention — not the best-case benchmark?',
        'Does the workload benefit from NIXL-style KV migration, or is it a classic all-reduce workload?',
        'Is the reservation model right — on-demand, Capacity Blocks, HyperPod — for the scale and duration?',
      ]}
    />
  );
}
