import React, { useState, Suspense } from 'react';
import { DeepDiveLayout } from '@tech-deep-dives/shared';
import Spinner from '@cloudscape-design/components/spinner';

// Framing
const ThesisAndFraming = React.lazy(() =>
  import('./sections/ThesisAndFraming').then((m) => ({ default: m.ThesisAndFraming }))
);
const InferenceWorkload = React.lazy(() =>
  import('./sections/InferenceWorkload').then((m) => ({ default: m.InferenceWorkload }))
);

// Engine internals (conceptual)
const V1Architecture = React.lazy(() =>
  import('./sections/V1Architecture').then((m) => ({ default: m.V1Architecture }))
);
const SchedulerBatching = React.lazy(() =>
  import('./sections/SchedulerBatching').then((m) => ({ default: m.SchedulerBatching }))
);
const PagedAttentionKV = React.lazy(() =>
  import('./sections/PagedAttentionKV').then((m) => ({ default: m.PagedAttentionKV }))
);
const PrefixCaching = React.lazy(() =>
  import('./sections/PrefixCaching').then((m) => ({ default: m.PrefixCaching }))
);
const KVOffloadingLMCache = React.lazy(() =>
  import('./sections/KVOffloadingLMCache').then((m) => ({ default: m.KVOffloadingLMCache }))
);
const Quantization = React.lazy(() =>
  import('./sections/Quantization').then((m) => ({ default: m.Quantization }))
);

// Distributed & disaggregated (conceptual)
const DistributedInference = React.lazy(() =>
  import('./sections/DistributedInference').then((m) => ({ default: m.DistributedInference }))
);
const DisaggregatedServing = React.lazy(() =>
  import('./sections/DisaggregatedServing').then((m) => ({ default: m.DisaggregatedServing }))
);
const SpeculativeDecoding = React.lazy(() =>
  import('./sections/SpeculativeDecoding').then((m) => ({ default: m.SpeculativeDecoding }))
);

// API & features
const OpenAICompatServer = React.lazy(() =>
  import('./sections/OpenAICompatServer').then((m) => ({ default: m.OpenAICompatServer }))
);
const LoRAServing = React.lazy(() =>
  import('./sections/LoRAServing').then((m) => ({ default: m.LoRAServing }))
);

// Inside the codebase (tabbed mega-section)
const InsideCodebase = React.lazy(() =>
  import('./sections/InsideCodebase').then((m) => ({ default: m.InsideCodebase }))
);

// Ecosystem
const RayServeLLM = React.lazy(() =>
  import('./sections/RayServeLLM').then((m) => ({ default: m.RayServeLLM }))
);
const ProductionStack = React.lazy(() =>
  import('./sections/ProductionStack').then((m) => ({ default: m.ProductionStack }))
);
const LlmdKServe = React.lazy(() =>
  import('./sections/LlmdKServe').then((m) => ({ default: m.LlmdKServe }))
);
const NvidiaDynamo = React.lazy(() =>
  import('./sections/NvidiaDynamo').then((m) => ({ default: m.NvidiaDynamo }))
);
const GatewaysAppLayer = React.lazy(() =>
  import('./sections/GatewaysAppLayer').then((m) => ({ default: m.GatewaysAppLayer }))
);
const ObservabilityBench = React.lazy(() =>
  import('./sections/ObservabilityBench').then((m) => ({ default: m.ObservabilityBench }))
);

// AWS layer
const AwsNeuron = React.lazy(() =>
  import('./sections/AwsNeuron').then((m) => ({ default: m.AwsNeuron }))
);
const AwsGpuEfaNixl = React.lazy(() =>
  import('./sections/AwsGpuEfaNixl').then((m) => ({ default: m.AwsGpuEfaNixl }))
);
const Ec2TopologyPlacement = React.lazy(() =>
  import('./sections/Ec2TopologyPlacement').then((m) => ({ default: m.Ec2TopologyPlacement }))
);
const AwsEks = React.lazy(() => import('./sections/AwsEks').then((m) => ({ default: m.AwsEks })));
const AwsSageMakerBedrock = React.lazy(() =>
  import('./sections/AwsSageMakerBedrock').then((m) => ({ default: m.AwsSageMakerBedrock }))
);

// Alternatives, ops, decision, reference
const WhenNotVllm = React.lazy(() =>
  import('./sections/WhenNotVllm').then((m) => ({ default: m.WhenNotVllm }))
);
const OperationsFailureModes = React.lazy(() =>
  import('./sections/OperationsFailureModes').then((m) => ({ default: m.OperationsFailureModes }))
);
const DecisionGuide = React.lazy(() =>
  import('./sections/DecisionGuide').then((m) => ({ default: m.DecisionGuide }))
);
const GlossaryAndSources = React.lazy(() =>
  import('./sections/GlossaryAndSources').then((m) => ({ default: m.GlossaryAndSources }))
);

const sections = [
  { id: 'thesis', title: '1. Thesis & Framing' },
  { id: 'workload', title: '2. The Inference Workload' },
  { id: 'v1-arch', title: '3. The V1 Engine Architecture' },
  { id: 'scheduler', title: '4. Scheduler & Continuous Batching' },
  { id: 'paged', title: '5. PagedAttention & KV-Cache' },
  { id: 'prefix', title: '6. Automatic Prefix Caching' },
  { id: 'offload', title: '7. KV-Cache Offloading & LMCache' },
  { id: 'quant', title: '8. Quantization & Precision' },
  { id: 'distributed', title: '9. Distributed Inference' },
  { id: 'disagg', title: '10. Disaggregated Prefill / Decode' },
  { id: 'spec-decode', title: '11. Speculative Decoding' },
  { id: 'server', title: '12. The OpenAI-Compatible Server' },
  { id: 'lora', title: '13. LoRA & Multi-Adapter Serving' },
  { id: 'codebase', title: '14. Inside the Codebase' },
  { id: 'ray', title: '15. Orchestration: Ray & Ray Serve LLM' },
  { id: 'prod-stack', title: '16. Kubernetes: Production-Stack & Router' },
  { id: 'llm-d', title: '17. Kubernetes: llm-d, KServe & Gateway API' },
  { id: 'dynamo', title: '18. NVIDIA Dynamo & the Ecosystem' },
  { id: 'gateways', title: '19. Gateways & Application Layer' },
  { id: 'observability', title: '20. Observability & Benchmarking' },
  { id: 'neuron', title: '21. vLLM on AWS Neuron' },
  { id: 'gpu-efa', title: '22. vLLM on AWS GPUs, EFA & NIXL' },
  { id: 'topology', title: '23. EC2 Topology & Placement Groups' },
  { id: 'eks', title: '24. vLLM on Amazon EKS' },
  { id: 'sagemaker', title: '25. vLLM on SageMaker & vs Bedrock' },
  { id: 'alternatives', title: '26. When Not vLLM' },
  { id: 'ops', title: '27. Operations & Failure Modes' },
  { id: 'decision', title: '28. Decision Guide' },
  { id: 'sources', title: '29. Glossary & Sources' },
];

const sectionComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
  thesis: ThesisAndFraming,
  workload: InferenceWorkload,
  'v1-arch': V1Architecture,
  scheduler: SchedulerBatching,
  paged: PagedAttentionKV,
  prefix: PrefixCaching,
  offload: KVOffloadingLMCache,
  quant: Quantization,
  distributed: DistributedInference,
  disagg: DisaggregatedServing,
  'spec-decode': SpeculativeDecoding,
  server: OpenAICompatServer,
  lora: LoRAServing,
  codebase: InsideCodebase,
  ray: RayServeLLM,
  'prod-stack': ProductionStack,
  'llm-d': LlmdKServe,
  dynamo: NvidiaDynamo,
  gateways: GatewaysAppLayer,
  observability: ObservabilityBench,
  neuron: AwsNeuron,
  'gpu-efa': AwsGpuEfaNixl,
  topology: Ec2TopologyPlacement,
  eks: AwsEks,
  sagemaker: AwsSageMakerBedrock,
  alternatives: WhenNotVllm,
  ops: OperationsFailureModes,
  decision: DecisionGuide,
  sources: GlossaryAndSources,
};

export function App() {
  const [activeSection, setActiveSection] = useState('thesis');
  const SectionComponent = sectionComponents[activeSection] || ThesisAndFraming;

  return (
    <DeepDiveLayout
      title="vLLM: The LLM Inference Serving Engine"
      subtitle="A field manual for high-throughput LLM serving: engine internals, distributed and disaggregated serving, the ecosystem, and the AWS deployment paths"
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      siblings={[
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
