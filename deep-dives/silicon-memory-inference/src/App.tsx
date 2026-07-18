import React, { useState, Suspense } from 'react';
import { DeepDiveLayout } from '@tech-deep-dives/shared';
import Spinner from '@cloudscape-design/components/spinner';

// Framing layer
const ThesisAndFraming = React.lazy(() =>
  import('./sections/ThesisAndFraming').then((m) => ({ default: m.ThesisAndFraming }))
);
const HeterogeneityFact = React.lazy(() =>
  import('./sections/HeterogeneityFact').then((m) => ({ default: m.HeterogeneityFact }))
);
const RooflineAndArithmeticIntensity = React.lazy(() =>
  import('./sections/RooflineAndArithmeticIntensity').then((m) => ({
    default: m.RooflineAndArithmeticIntensity,
  }))
);

// Memory layer
const MemoryHierarchyPrimer = React.lazy(() =>
  import('./sections/MemoryHierarchyPrimer').then((m) => ({ default: m.MemoryHierarchyPrimer }))
);
const KernelExecutionLifecycle = React.lazy(() =>
  import('./sections/KernelExecutionLifecycle').then((m) => ({
    default: m.KernelExecutionLifecycle,
  }))
);
const HbmAndBandwidthWall = React.lazy(() =>
  import('./sections/HbmAndBandwidthWall').then((m) => ({ default: m.HbmAndBandwidthWall }))
);
const MainMemoryAndCxl = React.lazy(() =>
  import('./sections/MainMemoryAndCxl').then((m) => ({ default: m.MainMemoryAndCxl }))
);

// Topology
const ChipletAndInterconnect = React.lazy(() =>
  import('./sections/ChipletAndInterconnect').then((m) => ({ default: m.ChipletAndInterconnect }))
);

// Host silicon
const GravitonDeepDive = React.lazy(() =>
  import('./sections/GravitonDeepDive').then((m) => ({ default: m.GravitonDeepDive }))
);
const AmdEpycTurin = React.lazy(() =>
  import('./sections/AmdEpycTurin').then((m) => ({ default: m.AmdEpycTurin }))
);
const IntelXeon6 = React.lazy(() =>
  import('./sections/IntelXeon6').then((m) => ({ default: m.IntelXeon6 }))
);

// NVIDIA silicon
const NvidiaHopper = React.lazy(() =>
  import('./sections/NvidiaHopper').then((m) => ({ default: m.NvidiaHopper }))
);
const NvidiaBlackwell = React.lazy(() =>
  import('./sections/NvidiaBlackwell').then((m) => ({ default: m.NvidiaBlackwell }))
);
const GraceBlackwellUltraServer = React.lazy(() =>
  import('./sections/GraceBlackwellUltraServer').then((m) => ({
    default: m.GraceBlackwellUltraServer,
  }))
);
const EdgeSharedMemorySilicon = React.lazy(() =>
  import('./sections/EdgeSharedMemorySilicon').then((m) => ({
    default: m.EdgeSharedMemorySilicon,
  }))
);

// NVIDIA compiler stack
const NvidiaCompilersAndTooling = React.lazy(() =>
  import('./sections/NvidiaCompilersAndTooling').then((m) => ({
    default: m.NvidiaCompilersAndTooling,
  }))
);

// AWS custom silicon + compiler stack
const AwsCustomSilicon = React.lazy(() =>
  import('./sections/AwsCustomSilicon').then((m) => ({ default: m.AwsCustomSilicon }))
);
const AwsCompilersAndTooling = React.lazy(() =>
  import('./sections/AwsCompilersAndTooling').then((m) => ({ default: m.AwsCompilersAndTooling }))
);

// Alternative paradigms
const CerebrasWaferScale = React.lazy(() =>
  import('./sections/CerebrasWaferScale').then((m) => ({ default: m.CerebrasWaferScale }))
);
const GroqSambanovaDataflow = React.lazy(() =>
  import('./sections/GroqSambanovaDataflow').then((m) => ({ default: m.GroqSambanovaDataflow }))
);
const ComputeInMemory = React.lazy(() =>
  import('./sections/ComputeInMemory').then((m) => ({ default: m.ComputeInMemory }))
);

// Software memory techniques
const KvCacheAndFlashAttention = React.lazy(() =>
  import('./sections/KvCacheAndFlashAttention').then((m) => ({
    default: m.KvCacheAndFlashAttention,
  }))
);
const MoeAndSparseActivation = React.lazy(() =>
  import('./sections/MoeAndSparseActivation').then((m) => ({
    default: m.MoeAndSparseActivation,
  }))
);
const SmallLanguageModels = React.lazy(() =>
  import('./sections/SmallLanguageModels').then((m) => ({ default: m.SmallLanguageModels }))
);
const QuantizationAndPrecision = React.lazy(() =>
  import('./sections/QuantizationAndPrecision').then((m) => ({
    default: m.QuantizationAndPrecision,
  }))
);
const DisaggregatedServingAndSpeculative = React.lazy(() =>
  import('./sections/DisaggregatedServingAndSpeculative').then((m) => ({
    default: m.DisaggregatedServingAndSpeculative,
  }))
);

// Fabric + runtime
const CommunicationAndScaleOut = React.lazy(() =>
  import('./sections/CommunicationAndScaleOut').then((m) => ({
    default: m.CommunicationAndScaleOut,
  }))
);

// Operational properties
const IsolationNie = React.lazy(() =>
  import('./sections/IsolationNie').then((m) => ({ default: m.IsolationNie }))
);
const DeterminismAOT = React.lazy(() =>
  import('./sections/DeterminismAOT').then((m) => ({ default: m.DeterminismAOT }))
);

// Applied lens + reference
const CapitalMarketsLens = React.lazy(() =>
  import('./sections/CapitalMarketsLens').then((m) => ({ default: m.CapitalMarketsLens }))
);
const GlossaryAndSources = React.lazy(() =>
  import('./sections/GlossaryAndSources').then((m) => ({ default: m.GlossaryAndSources }))
);

const sections = [
  { id: 'thesis', title: '1. Thesis and Framing' },
  { id: 'heterogeneity', title: '2. The Heterogeneity Fact' },
  { id: 'roofline', title: '3. Roofline and Arithmetic Intensity' },
  { id: 'memory-hierarchy', title: '4. Memory Hierarchy Primer' },
  { id: 'kernel-lifecycle', title: '5. Anatomy of a Kernel Execution' },
  { id: 'hbm', title: '6. HBM and the Bandwidth Wall' },
  { id: 'main-memory-cxl', title: '7. DDR5, MRDIMM, LPDDR5X, CXL' },
  { id: 'chiplet-interconnect', title: '8. Chiplet and Interconnect' },
  { id: 'graviton', title: '9. Graviton Deep Dive' },
  { id: 'epyc-turin', title: '10. AMD EPYC Turin' },
  { id: 'xeon-6', title: '11. Intel Xeon 6 Granite Rapids' },
  { id: 'hopper', title: '12. NVIDIA Hopper — H100 / H200' },
  { id: 'blackwell', title: '13. NVIDIA Blackwell — B200 / B300' },
  { id: 'grace-blackwell', title: '14. Grace-Blackwell and UltraServer' },
  { id: 'edge-shared-memory', title: '15. Edge Shared-Memory Silicon — DGX Spark and Jetson Orin Nano' },
  { id: 'nvidia-compilers', title: '16. NVIDIA Compilers and Kernel Tooling' },
  { id: 'aws-custom', title: '17. AWS Trainium, Inferentia, Neuron' },
  { id: 'aws-compilers', title: '18. AWS Compilers and Kernel Tooling' },
  { id: 'cerebras', title: '19. Cerebras WSE-3' },
  { id: 'groq-sambanova', title: '20. Groq, SambaNova, Dataflow' },
  { id: 'compute-in-memory', title: '21. Compute-in-Memory (PIM, HyperCIM)' },
  { id: 'kv-cache', title: '22. KV Cache and FlashAttention' },
  { id: 'moe', title: '23. Mixture of Experts and Sparse Activation' },
  { id: 'slm', title: '24. Small Language Models' },
  { id: 'quantization', title: '25. Quantization and Precision' },
  { id: 'disaggregated', title: '26. Disaggregated Serving and Speculative Decoding' },
  { id: 'communication', title: '27. Communication and Scale-Out' },
  { id: 'isolation', title: '28. Isolation — NIE and MIG' },
  { id: 'determinism', title: '29. Determinism — NEFF and GPU Reproducibility' },
  { id: 'capital-markets', title: '30. Capital Markets Lens' },
  { id: 'glossary-sources', title: '31. Glossary and Sources' },
];

const sectionComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
  thesis: ThesisAndFraming,
  heterogeneity: HeterogeneityFact,
  roofline: RooflineAndArithmeticIntensity,
  'memory-hierarchy': MemoryHierarchyPrimer,
  'kernel-lifecycle': KernelExecutionLifecycle,
  hbm: HbmAndBandwidthWall,
  'main-memory-cxl': MainMemoryAndCxl,
  'chiplet-interconnect': ChipletAndInterconnect,
  graviton: GravitonDeepDive,
  'epyc-turin': AmdEpycTurin,
  'xeon-6': IntelXeon6,
  hopper: NvidiaHopper,
  blackwell: NvidiaBlackwell,
  'grace-blackwell': GraceBlackwellUltraServer,
  'edge-shared-memory': EdgeSharedMemorySilicon,
  'nvidia-compilers': NvidiaCompilersAndTooling,
  'aws-custom': AwsCustomSilicon,
  'aws-compilers': AwsCompilersAndTooling,
  cerebras: CerebrasWaferScale,
  'groq-sambanova': GroqSambanovaDataflow,
  'compute-in-memory': ComputeInMemory,
  'kv-cache': KvCacheAndFlashAttention,
  moe: MoeAndSparseActivation,
  slm: SmallLanguageModels,
  quantization: QuantizationAndPrecision,
  disaggregated: DisaggregatedServingAndSpeculative,
  communication: CommunicationAndScaleOut,
  isolation: IsolationNie,
  determinism: DeterminismAOT,
  'capital-markets': CapitalMarketsLens,
  'glossary-sources': GlossaryAndSources,
};

export function App() {
  const [activeSection, setActiveSection] = useState('thesis');
  const SectionComponent = sectionComponents[activeSection] || ThesisAndFraming;

  return (
    <DeepDiveLayout
      title="Silicon, Memory, and Modern Inference"
      subtitle="A field manual for heterogeneous silicon and the memory-bandwidth-vs-FLOPs tradeoff in modern inference"
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      siblings={[
        { label: 'Elastic Fabric Adapter (EFA)', href: '../efa/' },
        { label: 'vLLM Inference Engine', href: '../vllm/' },
      ]}
    >
      <Suspense fallback={<Spinner size="large" />}>
        <SectionComponent />
      </Suspense>
    </DeepDiveLayout>
  );
}
