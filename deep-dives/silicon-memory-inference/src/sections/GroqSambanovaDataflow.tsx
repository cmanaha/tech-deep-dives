import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function GroqSambanovaDataflow() {
  return (
    <SectionShell
      title="Groq, SambaNova, and Deterministic Dataflow"
      subtitle="Compile-time scheduling and spatial compute as an alternative to SIMT"
      tldr={[
        'Groq LPU (Language Processing Unit) is a deterministic dataflow processor. All execution is compile-time scheduled, with no dynamic arbitration at runtime.',
        'SambaNova RDU (Reconfigurable Dataflow Unit) routes operators across a spatial fabric; operator fusion is a hardware primitive rather than a compiler optimization.',
        'Both architectures trade flexibility for determinism and tail-latency predictability — closer to the Trainium NEFF philosophy than to the GPU SIMT model.',
        'Programming model is compiler-driven. The developer does not schedule kernels; the compiler binds the entire graph to silicon ahead of time.',
      ]}
      scope={[
        'Groq TSP / LPU architecture: streaming tensor processor, memory model, compile-time schedule, jitter envelope.',
        'SambaNova RDU: reconfigurable dataflow unit, operator fusion, memory-adjacent compute.',
        'Compiler flow: graph → scheduled binary → silicon. What happens on dynamic-shape or control-flow-heavy models.',
        'Determinism contract: same input, same binary, same output — same cycle-accurate timing.',
        'Workload fit: low-latency LLM serving with strict p99 targets, real-time streaming, HFT-adjacent inference.',
        'Workload misfit: rapidly changing models, research workloads, models with dynamic shape or branching.',
      ]}
      panelistMap="Adjacent to both Cerebras and Trainium on the determinism axis. Use this section to make the point that determinism is a spectrum, not a binary — and AWS sits on the deterministic side with Trainium NEFF even in the GPU-heavy mainstream."
      evaluationLens={[
        'Is the model architecture stable — or is the team still iterating on operator choice?',
        'Does the workload actually need the tight tail latency these architectures deliver, or would batched GPU serving suffice?',
        'What is the ecosystem cost — SDK maturity, tooling, observability?',
        'Does the compiler handle the target model shape, or is there a conversion step that introduces risk?',
      ]}
    />
  );
}
