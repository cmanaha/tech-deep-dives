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
const LoRAServing = React.lazy(() =>
  import('./sections/LoRAServing').then((m) => ({ default: m.LoRAServing }))
);
const FrontendLanguage = React.lazy(() =>
  import('./sections/FrontendLanguage').then((m) => ({ default: m.FrontendLanguage }))
);
const RlRollout = React.lazy(() =>
  import('./sections/RlRollout').then((m) => ({ default: m.RlRollout }))
);

// Scale-out
const Parallelism = React.lazy(() =>
  import('./sections/Parallelism').then((m) => ({ default: m.Parallelism }))
);
const WideExpertParallelism = React.lazy(() =>
  import('./sections/WideExpertParallelism').then((m) => ({ default: m.WideExpertParallelism }))
);
const PdDisaggregation = React.lazy(() =>
  import('./sections/PdDisaggregation').then((m) => ({ default: m.PdDisaggregation }))
);
const ModelGateway = React.lazy(() =>
  import('./sections/ModelGateway').then((m) => ({ default: m.ModelGateway }))
);
const MultiNodeKubernetes = React.lazy(() =>
  import('./sections/MultiNodeKubernetes').then((m) => ({ default: m.MultiNodeKubernetes }))
);

// Inside the code
const InsideCodebase = React.lazy(() =>
  import('./sections/InsideCodebase').then((m) => ({ default: m.InsideCodebase }))
);

// SGLang on AWS
const AwsDeploymentPaths = React.lazy(() =>
  import('./sections/AwsDeploymentPaths').then((m) => ({ default: m.AwsDeploymentPaths }))
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
  { id: 'apis', title: '12. Talking to SGLang: the APIs' },
  { id: 'lora', title: '13. LoRA & Multi-Adapter Serving' },
  { id: 'frontend', title: '14. The Frontend Language' },
  { id: 'rl', title: '15. SGLang as an RL Rollout Engine' },
  { id: 'parallelism', title: '16. Parallelism: TP, DP Attention & EP' },
  { id: 'wide-ep', title: '17. Wide Expert Parallelism' },
  { id: 'pd', title: '18. PD Disaggregation' },
  { id: 'gateway', title: '19. The Model Gateway' },
  { id: 'multinode', title: '20. Multi-Node & Kubernetes' },
  { id: 'codebase', title: '21. Inside the Codebase' },
  { id: 'aws-paths', title: '22. SGLang on AWS: Deployment Paths' },
  { id: 'ec2', title: '23. EC2 Instances & GPU-Dependent Behaviour' },
  { id: 'efa', title: '24. PD & Wide EP over EFA' },
  { id: 'vs-vllm', title: '25. SGLang & vLLM Compared' },
  { id: 'ecosystem', title: '26. Ecosystem & Production Users' },
  { id: 'ops', title: '27. Operations & Failure Signatures' },
  { id: 'decision', title: '28. Decision Guide' },
  { id: 'sources', title: '29. Glossary & Sources' },
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
  lora: LoRAServing,
  frontend: FrontendLanguage,
  rl: RlRollout,
  parallelism: Parallelism,
  'wide-ep': WideExpertParallelism,
  pd: PdDisaggregation,
  gateway: ModelGateway,
  multinode: MultiNodeKubernetes,
  codebase: InsideCodebase,
  'aws-paths': AwsDeploymentPaths,
  ec2: Ec2Instances,
  efa: PdWideEpOverEfa,
  'vs-vllm': SglangVsVllm,
  ecosystem: EcosystemUsers,
  ops: Operations,
  decision: DecisionGuide,
  sources: GlossaryAndSources,
};

export function App() {
  const [activeSection, setActiveSection] = useState('thesis');
  const SectionComponent = sectionComponents[activeSection] || ThesisAndFraming;

  return (
    <DeepDiveLayout
      title="SGLang: The Serving Runtime Built Around a Shared Prefix Index"
      subtitle="How SGLang v0.5.22 schedules, caches and scales LLM serving, where its design differs from vLLM and why, and how to run it on AWS"
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
