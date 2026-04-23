import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function AwsCompilersAndTooling() {
  return (
    <SectionShell
      title="AWS Compilers and Kernel Tooling"
      subtitle="torch-neuronx, JAX on Neuron, NKI, and the Neuron profiler"
      tldr={[
        'The Neuron SDK is the AWS-owned stack that targets Trainium and Inferentia. torch-neuronx plugs into PyTorch; jax-neuron plugs into JAX; both route through XLA HLO and the Neuron compiler to a NEFF binary.',
        'NKI (Neuron Kernel Interface) is the Python DSL for authoring custom kernels directly against Trainium — conceptually analogous to Triton but targeting SBUF, PSUM, and the systolic array explicitly.',
        'The Neuron compiler handles operator fusion, tiling for SBUF residency, and scheduling across NeuronCores. AOT compilation fixes the schedule before runtime — the source of both performance predictability and the determinism contract.',
        'Neuron profiler tooling (neuron-ls, neuron-top, neuron-profile, the TensorBoard plugin) exposes per-NeuronCore utilization, SBUF residency, collective timing, and host-device interaction.',
        'Neuron Distributed is the AWS-maintained library for tensor-parallel, pipeline-parallel, and ZeRO-style training patterns on Trainium clusters.',
        'Compiler caching, partial graph recompilation, and NEFF caching are first-class — the training loop amortizes compile cost across epochs rather than paying it every step.',
      ]}
      scope={[
        'Neuron SDK architecture: torch-neuronx, tensorflow-neuronx, jax-neuron, libneuronxla, the Neuron runtime.',
        'torch-neuronx flow: PyTorch graph → XLA HLO → Neuron HLO → NEFF. What HLO-level passes the compiler runs.',
        'JAX on Neuron: pjit, shmap, sharding, how XLA partitioning maps to NeuronCores.',
        'NKI Python DSL: kernel programming model, SBUF / PSUM explicit management, tile constructs, mapping to the systolic array.',
        'Neuron compiler passes: operator fusion, loop tiling, memory layout selection, collective operation injection.',
        'Neuron Distributed: tensor parallel, pipeline parallel, sequence parallel, optimizer partitioning — what is shipped vs what the customer writes.',
        'Neuron profiler suite: neuron-ls (device inventory), neuron-top (real-time counters), neuron-profile (trace capture), TensorBoard plugin for visualization.',
        'Compiler cache strategy: persistent NEFF cache, partial recompilation on graph change, CI integration for reproducible builds.',
        'Integration with SageMaker HyperPod for large-cluster training.',
      ]}
      panelistMap="AWS-exclusive territory. This is the 'what do you actually use at AWS when you train on Trainium' answer. Land the point that NKI exists and is first-class — a lot of the audience will assume Trainium is CUDA-less and therefore developer-hostile. It is neither: NKI is the developer surface, and it is more explicit than Triton about the memory hierarchy, which is the point for a systolic-array target."
      evaluationLens={[
        'Is the model going through torch-neuronx with stock operators, or does it need NKI-authored kernels? Most models do not.',
        'Is the compiler cache configured for the training loop — or is the team recompiling the graph every step?',
        'Does the profiler trace show SBUF residency and collective timing, or just wall-clock per epoch?',
        'Is Neuron Distributed the right parallelism strategy — tensor-parallel vs pipeline-parallel vs sequence-parallel — for the target model and cluster shape?',
      ]}
    />
  );
}
