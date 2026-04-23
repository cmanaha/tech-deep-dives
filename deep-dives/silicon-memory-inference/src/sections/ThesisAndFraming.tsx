import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function ThesisAndFraming() {
  return (
    <SectionShell
      title="Thesis and Framing — Beyond peak FLOPs"
      subtitle="Inference is memory-bound, and silicon has never been more heterogeneous"
      tldr={[
        'Peak FLOPs is the last number that matters for inference. The ridge point sits far to the left of most decode workloads.',
        'To land on the FLOPs, three things have to arrive at the functional unit at the same time: the instruction, the data, and the right data shape.',
        'Silicon has never been more heterogeneous. Each architecture optimizes a different subset of (instruction delivery, data delivery, shape fit, power, determinism).',
        'Workload character selects the architecture. OLTP and business-logic workloads lean on branch prediction and retirement; transformer decode leans on wide tensor pipes and staged memory.',
        'Mispredict or stall costs are architecture-specific. A front-end bubble on a Xeon core is a different event from a pipeline bubble on a tensor core or a Trainium systolic array.',
      ]}
      scope={[
        'Arithmetic intensity and the roofline model — define ridge point, memory-bound, compute-bound.',
        'The instruction-data-shape triangle — why all three must align.',
        'Heterogeneity as the organizing fact — the list of live architectures and what each one bets on.',
        'Workload taxonomy — OLTP, batch analytics, training, prefill, decode, real-time inference, HFT.',
        'Retirement and stall semantics across out-of-order cores, tensor pipes, systolic arrays, and dataflow fabrics.',
        'Why FLOPs-first vendor marketing misleads and what to ask instead.',
      ]}
      panelistMap="This is the shared lens for the whole panel. Land the framing here and every subsequent answer has a consistent yardstick — AWS, Cerebras, and HyperCIM can each describe what their silicon does without the audience reaching for peak FLOPs."
      evaluationLens={[
        'What is the arithmetic intensity of the workload being pitched? Where does it sit on the roofline?',
        'How does the instruction reach the functional unit — front-end width, ISA, compile-time vs runtime scheduling?',
        'How does the data reach the unit — tier count, bandwidth, staging, prefetch, page walk cost?',
        'Is the data shape native or translated? Tile size, precision, layout, stride, alignment.',
        'What happens on a miss or stall — stall cost, bubble recovery, replay, retry, compensation?',
      ]}
    />
  );
}
