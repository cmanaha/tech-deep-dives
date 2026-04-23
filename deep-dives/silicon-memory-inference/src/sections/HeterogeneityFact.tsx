import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function HeterogeneityFact() {
  return (
    <SectionShell
      title="The Heterogeneity Fact"
      subtitle="Instruction, data, and data shape must arrive at the unit together"
      tldr={[
        'Silicon has never been more heterogeneous. Each architecture optimizes a different subset of the triangle: instruction delivery, data delivery, and data-shape fit.',
        'To land on a FLOP you need three things simultaneously — the instruction decoded at the unit, the operand staged from the right memory tier, and the shape (tile, precision, layout, alignment) native to the unit.',
        'Workload character selects the bet. Enterprise OLTP and business-logic code leans on branch prediction, speculation, and retirement ordering. Transformer decode leans on wide tensor pipes, predictable streaming, and staged memory.',
        'Retirement and stall semantics are architecture-specific. A mispredict on an out-of-order core is a different event from a pipeline bubble on a tensor core or a systolic array. The cost of being wrong is not portable.',
        'Peak FLOPs is the last number that matters. Ask first how the instruction reaches the unit, how the data reaches the unit, and what happens when either is late.',
      ]}
      scope={[
        'The instruction-data-shape triangle as an organizing frame.',
        'Front-end heterogeneity: branch prediction, BTB, TAGE, speculation depth, fetch width — and their irrelevance on dataflow architectures.',
        'Back-end heterogeneity: ROB, retirement, load-store queue, register rename — versus compile-time scheduled tensor pipes and systolic arrays.',
        'Data-shape fit: tile size, precision, layout, stride, alignment. Why NVFP4 is not drop-in on a core that thinks in BF16.',
        'Stall and bubble semantics per architecture class. What happens when an operand is late on a Xeon, on a GPU SM, on a Trainium array, on a WSE-3.',
        'Why "compare FLOPs" is not a comparison. What to compare instead.',
      ]}
      panelistMap="Foundational for the whole panel. Land this before any vendor-specific question — it makes the rest of the conversation vocabulary-clean. Especially useful when Cerebras or HyperCIM describe a completely different execution model; this section primes the audience to hear it as 'different triangle' rather than 'strange chip'."
      evaluationLens={[
        'Which vertex of the triangle is this architecture betting on — instruction, data, or shape?',
        'What does the architecture do when the other two vertices are not aligned?',
        'Is the workload front-end bound, memory-bound, or shape-mismatch bound? The fix for each is different.',
        'Is the ISA expressive enough to emit the kernel the model needs, or does the compiler have to fall back?',
        'What is the cost of a stall on this architecture, and who pays for it — hardware, compiler, or programmer?',
      ]}
    />
  );
}
