import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function ComputeInMemory() {
  return (
    <SectionShell
      title="Compute-in-Memory — PIM and HyperCIM"
      subtitle="Arithmetic inside the memory array and the attack on data-movement energy"
      tldr={[
        'Processing-in-Memory (PIM) places arithmetic units inside the memory array so the operation happens where the data lives.',
        'Samsung HBM-PIM integrates compute units inside HBM banks, reducing the energy per operation by eliminating most of the bus traffic.',
        'HyperCIM takes the approach further — compute is first-class at the memory-array level, not an add-on.',
        'The bet: most of the energy in AI inference is spent moving data, not computing on it. Eliminate the move and the energy envelope changes qualitatively.',
        'The trade: limited operator set, analog or mixed-signal precision constraints, tight coupling between algorithm and hardware.',
      ]}
      scope={[
        'Samsung HBM-PIM: compute inside the HBM bank, integration with host CPU or accelerator, supported primitives.',
        'HyperCIM architecture: compute-in-memory substrate, analog vs digital CIM, operator support.',
        'Energy argument: typical per-operation energy for matmul vs per-byte energy for a DRAM access; why CIM moves the ratio.',
        'Precision trade-off: analog CIM introduces noise; digital CIM avoids it but at area cost.',
        'Workload fit: transformer attention, matmul-heavy dense kernels, quantization-friendly models.',
        'Workload misfit: operators outside the supported set, models requiring high-precision accumulation.',
        'Integration path: accelerator-adjacent, host-adjacent, or as a discrete device.',
      ]}
      panelistMap="Tanya Mangoma's home turf. Have the energy framing ready — data movement as the dominant cost in modern inference is the strongest version of the CIM argument. Be specific about where CIM fits (attention, matmul) and where it does not."
      evaluationLens={[
        'What is the operator set supported natively, and does the target model live inside it?',
        'Is the precision model digital or analog — and does the workload tolerate the noise floor?',
        'What is the end-to-end energy per inference, measured — not the single-kernel figure?',
        'How does the CIM device integrate with the rest of the stack — as an accelerator, as memory, or as a hybrid?',
      ]}
    />
  );
}
