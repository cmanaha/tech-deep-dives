import React, { useState } from 'react';
import { DeepDiveLayout } from '@tech-deep-dives/shared';
import { Overview } from './sections/Overview';
import { Architecture } from './sections/Architecture';
import { InstanceSupport } from './sections/InstanceSupport';
import { AIMLTraining } from './sections/AIMLTraining';
import { AIMLInference } from './sections/AIMLInference';
import { HPC } from './sections/HPC';
import { NetworkComparison } from './sections/NetworkComparison';
import { EKSIntegration } from './sections/EKSIntegration';
import { Pricing } from './sections/Pricing';
import { DecisionGuide } from './sections/DecisionGuide';

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

const sectionComponents: Record<string, React.FC> = {
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
      <SectionComponent />
    </DeepDiveLayout>
  );
}
