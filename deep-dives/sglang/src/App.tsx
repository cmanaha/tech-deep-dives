import React, { useState, Suspense } from 'react';
import { DeepDiveLayout } from '@tech-deep-dives/shared';
import Spinner from '@cloudscape-design/components/spinner';

// Framing
const ThesisAndFraming = React.lazy(() =>
  import('./sections/ThesisAndFraming').then((m) => ({ default: m.ThesisAndFraming }))
);
const GettingStarted = React.lazy(() =>
  import('./sections/GettingStarted').then((m) => ({ default: m.GettingStarted }))
);

// Runtime and the index
const RuntimeProcesses = React.lazy(() =>
  import('./sections/RuntimeProcesses').then((m) => ({ default: m.RuntimeProcesses }))
);
const Scheduler = React.lazy(() =>
  import('./sections/Scheduler').then((m) => ({ default: m.Scheduler }))
);
const RadixCache = React.lazy(() =>
  import('./sections/RadixCache').then((m) => ({ default: m.RadixCache }))
);
const KvMemory = React.lazy(() =>
  import('./sections/KvMemory').then((m) => ({ default: m.KvMemory }))
);
const HiCache = React.lazy(() =>
  import('./sections/HiCache').then((m) => ({ default: m.HiCache }))
);
const AttentionBackends = React.lazy(() =>
  import('./sections/AttentionBackends').then((m) => ({ default: m.AttentionBackends }))
);
const Quantization = React.lazy(() =>
  import('./sections/Quantization').then((m) => ({ default: m.Quantization }))
);

// Request features
const StructuredOutput = React.lazy(() =>
  import('./sections/StructuredOutput').then((m) => ({ default: m.StructuredOutput }))
);
const SpeculativeDecoding = React.lazy(() =>
  import('./sections/SpeculativeDecoding').then((m) => ({ default: m.SpeculativeDecoding }))
);
const ApiSurfaces = React.lazy(() =>
  import('./sections/ApiSurfaces').then((m) => ({ default: m.ApiSurfaces }))
);
const RlRollout = React.lazy(() =>
  import('./sections/RlRollout').then((m) => ({ default: m.RlRollout }))
);

// Scale-out
const Parallelism = React.lazy(() =>
  import('./sections/Parallelism').then((m) => ({ default: m.Parallelism }))
);
const PdDisaggregation = React.lazy(() =>
  import('./sections/PdDisaggregation').then((m) => ({ default: m.PdDisaggregation }))
);
const WideExpertParallelism = React.lazy(() =>
  import('./sections/WideExpertParallelism').then((m) => ({ default: m.WideExpertParallelism }))
);
const ModelGateway = React.lazy(() =>
  import('./sections/ModelGateway').then((m) => ({ default: m.ModelGateway }))
);
const MultiNodeKubernetes = React.lazy(() =>
  import('./sections/MultiNodeKubernetes').then((m) => ({ default: m.MultiNodeKubernetes }))
);

// SGLang on AWS
const AwsManagedPaths = React.lazy(() =>
  import('./sections/AwsManagedPaths').then((m) => ({ default: m.AwsManagedPaths }))
);
const AwsSelfManagedPaths = React.lazy(() =>
  import('./sections/AwsSelfManagedPaths').then((m) => ({ default: m.AwsSelfManagedPaths }))
);
const Ec2Instances = React.lazy(() =>
  import('./sections/Ec2Instances').then((m) => ({ default: m.Ec2Instances }))
);
const PdWideEpOverEfa = React.lazy(() =>
  import('./sections/PdWideEpOverEfa').then((m) => ({ default: m.PdWideEpOverEfa }))
);

// Compare, operate, decide
const SglangVsVllm = React.lazy(() =>
  import('./sections/SglangVsVllm').then((m) => ({ default: m.SglangVsVllm }))
);
const EcosystemUsers = React.lazy(() =>
  import('./sections/EcosystemUsers').then((m) => ({ default: m.EcosystemUsers }))
);
const Operations = React.lazy(() =>
  import('./sections/Operations').then((m) => ({ default: m.Operations }))
);
const DecisionGuide = React.lazy(() =>
  import('./sections/DecisionGuide').then((m) => ({ default: m.DecisionGuide }))
);

// Reference
const InsideCodebase = React.lazy(() =>
  import('./sections/InsideCodebase').then((m) => ({ default: m.InsideCodebase }))
);
const GlossaryAndSources = React.lazy(() =>
  import('./sections/GlossaryAndSources').then((m) => ({ default: m.GlossaryAndSources }))
);

const sections = [
  { id: 'thesis', title: '1. Thesis & Framing' },
  { id: 'getting-started', title: '2. Getting Started' },
  { id: 'runtime', title: '3. The SGLang Runtime' },
  { id: 'scheduler', title: '4. The Scheduler' },
  { id: 'radix', title: '5. RadixAttention & the Radix Cache' },
  { id: 'kv-memory', title: '6. KV Memory & GPU-Picked Defaults' },
  { id: 'hicache', title: '7. HiCache: GPU, Host & Storage' },
  { id: 'kernels', title: '8. Attention Backends & Kernels' },
  { id: 'quant', title: '9. Quantization & KV Precision' },
  { id: 'structured', title: '10. Structured Output' },
  { id: 'spec-decode', title: '11. Speculative Decoding' },
  { id: 'apis', title: '12. APIs, LoRA & the Admin Plane' },
  { id: 'rl', title: '13. SGLang as an RL Rollout Engine' },
  { id: 'parallelism', title: '14. Parallelism: TP, DP Attention & EP' },
  { id: 'pd', title: '15. PD Disaggregation' },
  { id: 'wide-ep', title: '16. Wide Expert Parallelism' },
  { id: 'gateway', title: '17. The Model Gateway' },
  { id: 'multinode', title: '18. Multi-Node & Kubernetes Orchestrators' },
  { id: 'aws-managed', title: '19. SGLang on SageMaker AI & HyperPod' },
  { id: 'aws-self-managed', title: '20. SGLang on EKS & EC2' },
  { id: 'ec2', title: '21. EC2 Instances, Images & GPU Defaults' },
  { id: 'efa', title: '22. PD & Wide EP over EFA' },
  { id: 'vs-vllm', title: '23. SGLang & vLLM Compared' },
  { id: 'ecosystem', title: '24. Ecosystem & Production Users' },
  { id: 'ops', title: '25. Operations & Failure Signatures' },
  { id: 'decision', title: '26. Decision Guide' },
  { id: 'codebase', title: '27. Inside the Codebase' },
  { id: 'sources', title: '28. Glossary & Sources' },
];

const sectionComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
  thesis: ThesisAndFraming,
  'getting-started': GettingStarted,
  runtime: RuntimeProcesses,
  scheduler: Scheduler,
  radix: RadixCache,
  'kv-memory': KvMemory,
  hicache: HiCache,
  kernels: AttentionBackends,
  quant: Quantization,
  structured: StructuredOutput,
  'spec-decode': SpeculativeDecoding,
  apis: ApiSurfaces,
  rl: RlRollout,
  parallelism: Parallelism,
  pd: PdDisaggregation,
  'wide-ep': WideExpertParallelism,
  gateway: ModelGateway,
  multinode: MultiNodeKubernetes,
  'aws-managed': AwsManagedPaths,
  'aws-self-managed': AwsSelfManagedPaths,
  ec2: Ec2Instances,
  efa: PdWideEpOverEfa,
  'vs-vllm': SglangVsVllm,
  ecosystem: EcosystemUsers,
  ops: Operations,
  decision: DecisionGuide,
  codebase: InsideCodebase,
  sources: GlossaryAndSources,
};

export function App() {
  const [activeSection, setActiveSection] = useState('thesis');
  const SectionComponent = sectionComponents[activeSection] || ThesisAndFraming;

  return (
    <DeepDiveLayout
      title="SGLang: The Radix-Tree Serving Runtime, and Where It Differs from vLLM"
      subtitle="How SGLang v0.5.22 schedules, caches and scales LLM serving, which of its defaults a vLLM user already knows, and how to run it on AWS"
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      siblings={[
        { label: 'vLLM: The LLM Inference Serving Engine', href: '../vllm/' },
        { label: 'Elastic Fabric Adapter (EFA)', href: '../efa/' },
        { label: 'Silicon, Memory & Inference', href: '../silicon-memory-inference/' },
      ]}
    >
      <Suspense fallback={<Spinner size="large" />}>
        <SectionComponent />
      </Suspense>
    </DeepDiveLayout>
  );
}
