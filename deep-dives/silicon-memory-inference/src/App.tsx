import React, { useState, Suspense } from 'react';
import { DeepDiveLayout } from '@tech-deep-dives/shared';
import Spinner from '@cloudscape-design/components/spinner';

const ThesisAndFraming = React.lazy(() =>
  import('./sections/ThesisAndFraming').then((m) => ({ default: m.ThesisAndFraming }))
);
const MemoryHierarchyPrimer = React.lazy(() =>
  import('./sections/MemoryHierarchyPrimer').then((m) => ({ default: m.MemoryHierarchyPrimer }))
);
const ChipletAndInterconnect = React.lazy(() =>
  import('./sections/ChipletAndInterconnect').then((m) => ({ default: m.ChipletAndInterconnect }))
);
const HostSilicon = React.lazy(() =>
  import('./sections/HostSilicon').then((m) => ({ default: m.HostSilicon }))
);
const NvidiaGpuSilicon = React.lazy(() =>
  import('./sections/NvidiaGpuSilicon').then((m) => ({ default: m.NvidiaGpuSilicon }))
);
const AwsCustomSilicon = React.lazy(() =>
  import('./sections/AwsCustomSilicon').then((m) => ({ default: m.AwsCustomSilicon }))
);
const AlternativeParadigms = React.lazy(() =>
  import('./sections/AlternativeParadigms').then((m) => ({ default: m.AlternativeParadigms }))
);
const InferenceMemoryTechniques = React.lazy(() =>
  import('./sections/InferenceMemoryTechniques').then((m) => ({
    default: m.InferenceMemoryTechniques,
  }))
);
const CommunicationAndScaleOut = React.lazy(() =>
  import('./sections/CommunicationAndScaleOut').then((m) => ({
    default: m.CommunicationAndScaleOut,
  }))
);
const IsolationAndDeterminism = React.lazy(() =>
  import('./sections/IsolationAndDeterminism').then((m) => ({ default: m.IsolationAndDeterminism }))
);
const CapitalMarketsLens = React.lazy(() =>
  import('./sections/CapitalMarketsLens').then((m) => ({ default: m.CapitalMarketsLens }))
);
const GlossaryAndSources = React.lazy(() =>
  import('./sections/GlossaryAndSources').then((m) => ({ default: m.GlossaryAndSources }))
);

const sections = [
  { id: 'thesis', title: '1. Thesis and Framing' },
  { id: 'memory-hierarchy', title: '2. Memory Hierarchy Primer' },
  { id: 'chiplet-interconnect', title: '3. Chiplet and Interconnect' },
  { id: 'host-silicon', title: '4. Host Silicon — Graviton, EPYC, Xeon' },
  { id: 'nvidia-gpu', title: '5. NVIDIA GPU Silicon' },
  { id: 'aws-custom', title: '6. AWS Custom Silicon' },
  { id: 'alternative-paradigms', title: '7. Alternative Paradigms' },
  { id: 'inference-techniques', title: '8. Inference Memory Techniques' },
  { id: 'communication', title: '9. Communication and Scale-Out' },
  { id: 'isolation-determinism', title: '10. Isolation and Determinism' },
  { id: 'capital-markets', title: '11. Capital Markets Lens' },
  { id: 'glossary-sources', title: '12. Glossary and Sources' },
];

const sectionComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
  thesis: ThesisAndFraming,
  'memory-hierarchy': MemoryHierarchyPrimer,
  'chiplet-interconnect': ChipletAndInterconnect,
  'host-silicon': HostSilicon,
  'nvidia-gpu': NvidiaGpuSilicon,
  'aws-custom': AwsCustomSilicon,
  'alternative-paradigms': AlternativeParadigms,
  'inference-techniques': InferenceMemoryTechniques,
  communication: CommunicationAndScaleOut,
  'isolation-determinism': IsolationAndDeterminism,
  'capital-markets': CapitalMarketsLens,
  'glossary-sources': GlossaryAndSources,
};

export function App() {
  const [activeSection, setActiveSection] = useState('thesis');
  const SectionComponent = sectionComponents[activeSection] || ThesisAndFraming;

  return (
    <DeepDiveLayout
      title="Silicon, Memory, and Modern Inference"
      subtitle="Beyond peak FLOPs — a field manual for heterogeneous silicon and inference workloads"
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      <Suspense fallback={<Spinner size="large" />}>
        <SectionComponent />
      </Suspense>
    </DeepDiveLayout>
  );
}
