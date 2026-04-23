import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function AlternativeParadigms() {
  return (
    <SectionShell
      title="Alternative Paradigms"
      subtitle="Wafer-scale SRAM, deterministic dataflow, and compute-in-memory"
      tldr={[
        'Cerebras WSE-3 puts the whole model in on-wafer SRAM, eliminating the HBM hop entirely for models that fit.',
        'Groq LPU is a deterministic dataflow processor — compile-time schedule, zero dynamic scheduling, tight tail latency.',
        'SambaNova RDU is a reconfigurable dataflow unit designed around operator fusion and long pipelines.',
        'Samsung HBM-PIM and HyperCIM move arithmetic into or next to the memory array, attacking the data-movement energy cost directly.',
      ]}
      scope={[
        'Cerebras WSE-3: die-scale architecture, on-wafer SRAM capacity, programming model, and the class of models it serves well.',
        'Groq LPU: deterministic execution model, compile-time scheduling, TSP architecture, why variance is near zero.',
        'SambaNova RDU: reconfigurable dataflow, spatial compute, operator fusion as a hardware primitive.',
        'Samsung HBM-PIM: arithmetic units inside the HBM bank, bandwidth-adjacent compute.',
        'HyperCIM: compute-in-memory primitives, analog vs digital CIM, where each fits.',
        'When each alternative wins — capacity fit, determinism requirement, energy per inference, or a specific operator class.',
        'Where each alternative struggles — flexibility, ecosystem maturity, model portability.',
      ]}
      panelistMap="Cerebras (Zigfrid) and HyperCIM (Tanya) directly occupy two of these paradigms. Anticipate comparative questions here and carry your references so the contrast is fair, not adversarial."
      evaluationLens={[
        'Does the model fit the memory budget of the alternative without partitioning? If yes, the classic HBM bottleneck disappears.',
        'Does the workload need hard determinism? Groq and Trainium both deliver it; GPUs generally do not at the kernel level.',
        'Is the operator mix a dataflow-friendly long pipeline, or is it dynamic and branchy?',
        'What is the energy per inference — and how is it measured? Ask for the benchmark, not the marketing slide.',
      ]}
    />
  );
}
