import React, { useState, Suspense } from 'react';
import { DeepDiveLayout } from '@tech-deep-dives/shared';
import Spinner from '@cloudscape-design/components/spinner';

const Overview = React.lazy(() => import('./sections/Overview').then(m => ({ default: m.Overview })));
const DataPath = React.lazy(() => import('./sections/DataPath').then(m => ({ default: m.DataPath })));
const SrdProtocol = React.lazy(() => import('./sections/SrdProtocol').then(m => ({ default: m.SrdProtocol })));
const EfaDevice = React.lazy(() => import('./sections/EfaDevice').then(m => ({ default: m.EfaDevice })));
const Libfabric = React.lazy(() => import('./sections/Libfabric').then(m => ({ default: m.Libfabric })));
const EnaVsEfa = React.lazy(() => import('./sections/EnaVsEfa').then(m => ({ default: m.EnaVsEfa })));
const TopologyApi = React.lazy(() => import('./sections/TopologyApi').then(m => ({ default: m.TopologyApi })));
const InstanceSupport = React.lazy(() => import('./sections/InstanceSupport').then(m => ({ default: m.InstanceSupport })));
const AIMLTraining = React.lazy(() => import('./sections/AIMLTraining').then(m => ({ default: m.AIMLTraining })));
const AIMLInference = React.lazy(() => import('./sections/AIMLInference').then(m => ({ default: m.AIMLInference })));
const HPC = React.lazy(() => import('./sections/HPC').then(m => ({ default: m.HPC })));
const NetworkComparison = React.lazy(() => import('./sections/NetworkComparison').then(m => ({ default: m.NetworkComparison })));
const EKSIntegration = React.lazy(() => import('./sections/EKSIntegration').then(m => ({ default: m.EKSIntegration })));
const Pricing = React.lazy(() => import('./sections/Pricing').then(m => ({ default: m.Pricing })));
const DecisionGuide = React.lazy(() => import('./sections/DecisionGuide').then(m => ({ default: m.DecisionGuide })));
const Sources = React.lazy(() => import('./sections/Sources').then(m => ({ default: m.Sources })));

/**
 * Nav order follows the revamp plan in revamp/section-architecture.md:
 * framing, then mechanism, then placement and topology, then workloads,
 * then platform surfaces, then comparison and reference.
 *
 * The former 'architecture' section is deliberately no longer routed. It has
 * been split into Data Path, SRD, The EFA Device and libfabric, and its
 * original text carried three claims those sections now correct (proof of
 * OS bypass by absence, RDMA read and write being software-emulated, and
 * Data Path Direct removing rdma-core entirely). Routing both would have
 * published a page that contradicts itself.
 *
 * Architecture.tsx stays on disk because its NCCL tuning and operational
 * gotchas content has not been migrated yet. That content moves to the
 * planned 'NCCL over EFA' and 'Operations and Failure Modes' sections in the
 * next wave, at which point the file is deleted.
 */
const sections = [
  { id: 'overview', title: 'What is EFA?' },
  { id: 'datapath', title: 'The Data Path: OS-Bypass End to End' },
  { id: 'srd', title: 'SRD: The Transport Protocol' },
  { id: 'device', title: 'The EFA Device: Attachment, Cards and Rails' },
  { id: 'libfabric', title: 'libfabric and the EFA Provider' },
  { id: 'ena', title: 'ENA and EFA: Two Devices, One Nitro Card' },
  { id: 'topology', title: 'The EC2 Instance Topology API' },
  { id: 'instances', title: 'Instance Support Matrix' },
  { id: 'training', title: 'AI/ML Training' },
  { id: 'inference', title: 'AI/ML Inference' },
  { id: 'hpc', title: 'Traditional HPC' },
  { id: 'comparison', title: 'EFA vs Alternatives' },
  { id: 'eks', title: 'EKS & Containers' },
  { id: 'pricing', title: 'Pricing Analysis' },
  { id: 'decision', title: 'Decision Guide' },
  { id: 'sources', title: 'Sources' },
];

const sectionComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
  overview: Overview,
  datapath: DataPath,
  srd: SrdProtocol,
  device: EfaDevice,
  libfabric: Libfabric,
  ena: EnaVsEfa,
  topology: TopologyApi,
  instances: InstanceSupport,
  training: AIMLTraining,
  inference: AIMLInference,
  hpc: HPC,
  comparison: NetworkComparison,
  eks: EKSIntegration,
  pricing: Pricing,
  decision: DecisionGuide,
  sources: Sources,
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
      siblings={[
        { label: 'Silicon, Memory & Inference', href: '../silicon-memory-inference/' },
        { label: 'vLLM Inference Engine', href: '../vllm/' },
      ]}
    >
      <Suspense fallback={<Spinner size="large" />}>
        <SectionComponent />
      </Suspense>
    </DeepDiveLayout>
  );
}
