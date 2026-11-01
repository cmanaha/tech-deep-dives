import React, { useState, Suspense } from 'react';
import { DeepDiveLayout } from '@tech-deep-dives/shared';
import Spinner from '@cloudscape-design/components/spinner';

// Framing
const ThreeBudgets = React.lazy(() =>
  import('./sections/ThreeBudgets').then((m) => ({ default: m.ThreeBudgets }))
);
const GettingStarted = React.lazy(() =>
  import('./sections/GettingStarted').then((m) => ({ default: m.GettingStarted }))
);
// One accelerator: the step, its arithmetic, its memory
const TrainingStep = React.lazy(() =>
  import('./sections/TrainingStep').then((m) => ({ default: m.TrainingStep }))
);
const Arithmetic = React.lazy(() =>
  import('./sections/Arithmetic').then((m) => ({ default: m.Arithmetic }))
);
const MemoryBudget = React.lazy(() =>
  import('./sections/MemoryBudget').then((m) => ({ default: m.MemoryBudget }))
);
const Precision = React.lazy(() =>
  import('./sections/Precision').then((m) => ({ default: m.Precision }))
);
// Many accelerators: splitting the step
const Collectives = React.lazy(() =>
  import('./sections/Collectives').then((m) => ({ default: m.Collectives }))
);
const DataParallel = React.lazy(() =>
  import('./sections/DataParallel').then((m) => ({ default: m.DataParallel }))
);
const TensorParallel = React.lazy(() =>
  import('./sections/TensorParallel').then((m) => ({ default: m.TensorParallel }))
);
const PipelineParallel = React.lazy(() =>
  import('./sections/PipelineParallel').then((m) => ({ default: m.PipelineParallel }))
);
const ContextParallel = React.lazy(() =>
  import('./sections/ContextParallel').then((m) => ({ default: m.ContextParallel }))
);
const ExpertParallel = React.lazy(() =>
  import('./sections/ExpertParallel').then((m) => ({ default: m.ExpertParallel }))
);
const ComposingLayouts = React.lazy(() =>
  import('./sections/ComposingLayouts').then((m) => ({ default: m.ComposingLayouts }))
);
const SetMyRanks = React.lazy(() =>
  import('./sections/SetMyRanks').then((m) => ({ default: m.SetMyRanks }))
);
// The software that implements it
const FrameworkMap = React.lazy(() =>
  import('./sections/FrameworkMap').then((m) => ({ default: m.FrameworkMap }))
);
const FineTuning = React.lazy(() =>
  import('./sections/FineTuning').then((m) => ({ default: m.FineTuning }))
);
// Keeping a run alive
const FailureRates = React.lazy(() =>
  import('./sections/FailureRates').then((m) => ({ default: m.FailureRates }))
);
const Checkpointing = React.lazy(() =>
  import('./sections/Checkpointing').then((m) => ({ default: m.Checkpointing }))
);
const Resuming = React.lazy(() =>
  import('./sections/Resuming').then((m) => ({ default: m.Resuming }))
);
// Running it on AWS
const AwsOwnership = React.lazy(() =>
  import('./sections/AwsOwnership').then((m) => ({ default: m.AwsOwnership }))
);
const AwsHardware = React.lazy(() =>
  import('./sections/AwsHardware').then((m) => ({ default: m.AwsHardware }))
);
const CapacityCost = React.lazy(() =>
  import('./sections/CapacityCost').then((m) => ({ default: m.CapacityCost }))
);
const Storage = React.lazy(() =>
  import('./sections/Storage').then((m) => ({ default: m.Storage }))
);
const SlurmFamily = React.lazy(() =>
  import('./sections/SlurmFamily').then((m) => ({ default: m.SlurmFamily }))
);
const KubernetesFamily = React.lazy(() =>
  import('./sections/KubernetesFamily').then((m) => ({ default: m.KubernetesFamily }))
);
const TrainingJobs = React.lazy(() =>
  import('./sections/TrainingJobs').then((m) => ({ default: m.TrainingJobs }))
);
const Trainium = React.lazy(() =>
  import('./sections/Trainium').then((m) => ({ default: m.Trainium }))
);
const ChoosingPath = React.lazy(() =>
  import('./sections/ChoosingPath').then((m) => ({ default: m.ChoosingPath }))
);
// Operating a run
const WhatToMeasure = React.lazy(() =>
  import('./sections/WhatToMeasure').then((m) => ({ default: m.WhatToMeasure }))
);
const Telemetry = React.lazy(() =>
  import('./sections/Telemetry').then((m) => ({ default: m.Telemetry }))
);
const BringUp = React.lazy(() =>
  import('./sections/BringUp').then((m) => ({ default: m.BringUp }))
);
// Reference
const GlossaryAndSources = React.lazy(() =>
  import('./sections/GlossaryAndSources').then((m) => ({ default: m.GlossaryAndSources }))
);

const sections = [
  { id: 'three-budgets', title: '1. A Training Run Is Three Budgets' },
  { id: 'getting-started', title: '2. Getting Started' },
  { id: 'step', title: '3. One Training Step: What It Computes and Keeps' },
  { id: 'arithmetic', title: '4. Counting the Arithmetic: 6ND, MFU & Run Time' },
  { id: 'memory', title: '5. The Memory Budget' },
  { id: 'precision', title: '6. Precision for Training: BF16, FP8 & Microscaled Formats' },
  { id: 'collectives', title: '7. Collectives & What They Cost' },
  { id: 'data-parallel', title: '8. Data Parallelism & Sharding: DDP, ZeRO, FSDP & HSDP' },
  { id: 'tensor-parallel', title: '9. Tensor & Sequence Parallelism' },
  { id: 'pipeline', title: '10. Pipeline Parallelism & the Bubble' },
  { id: 'context-parallel', title: '11. Long Sequences: Context Parallelism' },
  { id: 'expert-parallel', title: '12. Mixture of Experts: Expert Parallelism' },
  { id: 'composing', title: '13. Composing the Dimensions' },
  { id: 'set-my-ranks', title: '14. Set My Ranks: The Sizing Procedure' },
  { id: 'frameworks', title: '15. The Framework Map' },
  { id: 'fine-tuning', title: '16. Fine-Tuning & Post-Training Runs' },
  { id: 'failures', title: '17. Failure Is the Steady State' },
  { id: 'checkpointing', title: '18. Checkpointing' },
  { id: 'resuming', title: '19. Resuming Correctly' },
  { id: 'aws-ownership', title: '20. Who Owns What on AWS' },
  { id: 'aws-hardware', title: '21. Training Hardware on AWS' },
  { id: 'capacity-cost', title: '22. Capacity & Cost' },
  { id: 'storage', title: '23. Storage for Training' },
  { id: 'slurm', title: '24. The Slurm Family' },
  { id: 'kubernetes', title: '25. The Kubernetes Family' },
  { id: 'training-jobs', title: '26. SageMaker Training Jobs' },
  { id: 'trainium', title: '27. Trainium: The Neuron Path' },
  { id: 'choosing', title: '28. Choosing Your Path' },
  { id: 'measure', title: '29. What to Measure in a Run' },
  { id: 'telemetry', title: '30. The Telemetry Stack on AWS' },
  { id: 'bring-up', title: '31. Bring-Up: From One Node to the Full Run' },
  { id: 'sources', title: '32. Glossary & Sources' },
];

const sectionComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
  'three-budgets': ThreeBudgets,
  'getting-started': GettingStarted,
  'step': TrainingStep,
  'arithmetic': Arithmetic,
  'memory': MemoryBudget,
  'precision': Precision,
  'collectives': Collectives,
  'data-parallel': DataParallel,
  'tensor-parallel': TensorParallel,
  'pipeline': PipelineParallel,
  'context-parallel': ContextParallel,
  'expert-parallel': ExpertParallel,
  'composing': ComposingLayouts,
  'set-my-ranks': SetMyRanks,
  'frameworks': FrameworkMap,
  'fine-tuning': FineTuning,
  'failures': FailureRates,
  'checkpointing': Checkpointing,
  'resuming': Resuming,
  'aws-ownership': AwsOwnership,
  'aws-hardware': AwsHardware,
  'capacity-cost': CapacityCost,
  'storage': Storage,
  'slurm': SlurmFamily,
  'kubernetes': KubernetesFamily,
  'training-jobs': TrainingJobs,
  'trainium': Trainium,
  'choosing': ChoosingPath,
  'measure': WhatToMeasure,
  'telemetry': Telemetry,
  'bring-up': BringUp,
  'sources': GlossaryAndSources,
};

export function App() {
  const [activeSection, setActiveSection] = useState('three-budgets');
  const SectionComponent = sectionComponents[activeSection] || ThreeBudgets;

  return (
    <DeepDiveLayout
      title="Training at Scale: How Large Language Models Are Trained, and How to Run It on AWS"
      subtitle="What one training step costs in arithmetic and memory, how parallelism splits that cost across thousands of accelerators, what keeps a run alive through failures, and which AWS path to run it on"
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      siblings={[
        { label: 'Elastic Fabric Adapter (EFA)', href: '../efa/' },
        { label: 'Silicon, Memory & Inference', href: '../silicon-memory-inference/' },
        { label: 'RL & Agentic Learning Loops', href: '../rl-agentic-loops/' },
      ]}
    >
      <Suspense fallback={<Spinner size="large" />}>
        <SectionComponent />
      </Suspense>
    </DeepDiveLayout>
  );
}
