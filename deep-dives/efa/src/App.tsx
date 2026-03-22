import React, { useState, Suspense } from 'react';
import { DeepDiveLayout } from '@tech-deep-dives/shared';
import Spinner from '@cloudscape-design/components/spinner';

const Overview = React.lazy(() => import('./sections/Overview').then(m => ({ default: m.Overview })));
const Architecture = React.lazy(() => import('./sections/Architecture').then(m => ({ default: m.Architecture })));
const InstanceSupport = React.lazy(() => import('./sections/InstanceSupport').then(m => ({ default: m.InstanceSupport })));
const AIMLTraining = React.lazy(() => import('./sections/AIMLTraining').then(m => ({ default: m.AIMLTraining })));
const AIMLInference = React.lazy(() => import('./sections/AIMLInference').then(m => ({ default: m.AIMLInference })));
const HPC = React.lazy(() => import('./sections/HPC').then(m => ({ default: m.HPC })));
const NetworkComparison = React.lazy(() => import('./sections/NetworkComparison').then(m => ({ default: m.NetworkComparison })));
const EKSIntegration = React.lazy(() => import('./sections/EKSIntegration').then(m => ({ default: m.EKSIntegration })));
const Pricing = React.lazy(() => import('./sections/Pricing').then(m => ({ default: m.Pricing })));
const DecisionGuide = React.lazy(() => import('./sections/DecisionGuide').then(m => ({ default: m.DecisionGuide })));

const sections = [
  { id: 'overview', title: 'What is EFA?' },
  { id: 'architecture', title: 'Architecture & SRD Protocol' },
  { id: 'instances', title: 'Instance Support Matrix' },
  { id: 'training', title: 'AI/ML Training' },
  { id: 'inference', title: 'AI/ML Inference' },
  { id: 'hpc', title: 'Traditional HPC' },
  { id: 'comparison', title: 'EFA vs Alternatives' },
  { id: 'eks', title: 'EKS & Containers' },
  { id: 'pricing', title: 'Pricing Analysis' },
  { id: 'decision', title: 'Decision Guide' },
];

const sectionComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
  overview: Overview,
  architecture: Architecture,
  instances: InstanceSupport,
  training: AIMLTraining,
  inference: AIMLInference,
  hpc: HPC,
  comparison: NetworkComparison,
  eks: EKSIntegration,
  pricing: Pricing,
  decision: DecisionGuide,
};

export function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const SectionComponent = sectionComponents[activeSection] || Overview;

  return (
    <DeepDiveLayout
      title="Elastic Fabric Adapter (EFA)"
      subtitle="Deep dive into AWS high-performance networking for AI/ML and HPC"
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
