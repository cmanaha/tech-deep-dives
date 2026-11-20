import React, { useEffect, useState, Suspense } from 'react';
import { DeepDiveLayout } from '@tech-deep-dives/shared';
import Spinner from '@cloudscape-design/components/spinner';

const OneLoop = React.lazy(() => import('./sections/OneLoop').then((m) => ({ default: m.OneLoop })));
const GettingStarted = React.lazy(() => import('./sections/GettingStarted').then((m) => ({ default: m.GettingStarted })));
const RobotAsComputer = React.lazy(() => import('./sections/RobotAsComputer').then((m) => ({ default: m.RobotAsComputer })));
const LearningFromDemonstrations = React.lazy(() => import('./sections/LearningFromDemonstrations').then((m) => ({ default: m.LearningFromDemonstrations })));
const VisionLanguageAction = React.lazy(() => import('./sections/VisionLanguageAction').then((m) => ({ default: m.VisionLanguageAction })));
const WorldModels = React.lazy(() => import('./sections/WorldModels').then((m) => ({ default: m.WorldModels })));
const Jepa = React.lazy(() => import('./sections/Jepa').then((m) => ({ default: m.Jepa })));
const RobotRl = React.lazy(() => import('./sections/RobotRl').then((m) => ({ default: m.RobotRl })));
const CollectingData = React.lazy(() => import('./sections/CollectingData').then((m) => ({ default: m.CollectingData })));
const ProcessingCurating = React.lazy(() => import('./sections/ProcessingCurating').then((m) => ({ default: m.ProcessingCurating })));
const Augmentation = React.lazy(() => import('./sections/Augmentation').then((m) => ({ default: m.Augmentation })));
const PhysicsSimulation = React.lazy(() => import('./sections/PhysicsSimulation').then((m) => ({ default: m.PhysicsSimulation })));
const Rendering = React.lazy(() => import('./sections/Rendering').then((m) => ({ default: m.Rendering })));
const SimToReal = React.lazy(() => import('./sections/SimToReal').then((m) => ({ default: m.SimToReal })));
const TrainingScales = React.lazy(() => import('./sections/TrainingScales').then((m) => ({ default: m.TrainingScales })));
const Evaluation = React.lazy(() => import('./sections/Evaluation').then((m) => ({ default: m.Evaluation })));
const OnRobot = React.lazy(() => import('./sections/OnRobot').then((m) => ({ default: m.OnRobot })));
const Fleet = React.lazy(() => import('./sections/Fleet').then((m) => ({ default: m.Fleet })));
const AgentsLoop = React.lazy(() => import('./sections/AgentsLoop').then((m) => ({ default: m.AgentsLoop })));
const Workloads = React.lazy(() => import('./sections/Workloads').then((m) => ({ default: m.Workloads })));
const PmuCards = React.lazy(() => import('./sections/PmuCards').then((m) => ({ default: m.PmuCards })));
const Measurements = React.lazy(() => import('./sections/Measurements').then((m) => ({ default: m.Measurements })));
const PricePerformance = React.lazy(() => import('./sections/PricePerformance').then((m) => ({ default: m.PricePerformance })));
const AwsOrchestration = React.lazy(() => import('./sections/AwsOrchestration').then((m) => ({ default: m.AwsOrchestration })));
const Choosing = React.lazy(() => import('./sections/Choosing').then((m) => ({ default: m.Choosing })));
const GlossaryAndSources = React.lazy(() => import('./sections/GlossaryAndSources').then((m) => ({ default: m.GlossaryAndSources })));

export const sections = [
  { id: 'one-loop', title: '1. One Robot, One Loop' },
  { id: 'getting-started', title: '2. Getting Started' },
  { id: 'robot-computer', title: '3. The Robot as a Computer' },
  { id: 'demonstrations', title: '4. Learning From Demonstrations' },
  { id: 'vla', title: '5. Vision-Language-Action Models' },
  { id: 'world-models', title: '6. World Models: Predicting What Happens Next' },
  { id: 'jepa', title: '7. JEPA: Predicting in Latent Space' },
  { id: 'robot-rl', title: '8. Reinforcement Learning for Robots' },
  { id: 'collecting', title: '9. Collecting Data' },
  { id: 'curating', title: '10. Processing and Curating' },
  { id: 'augmentation', title: '11. Augmentation and Synthetic Data' },
  { id: 'physics', title: '12. Physics Simulation' },
  { id: 'rendering', title: '13. Rendering and Ray Tracing' },
  { id: 'sim-to-real', title: '14. Sim-to-Real and Real-to-Sim' },
  { id: 'training-scales', title: '15. Training at Three Scales' },
  { id: 'evaluation', title: '16. Evaluation' },
  { id: 'on-robot', title: '17. Running on the Robot' },
  { id: 'fleet', title: '18. The Fleet' },
  { id: 'agents', title: '19. Agents Running the Loop' },
  { id: 'workloads', title: '20. Fifteen Workloads, Five Shapes' },
  { id: 'pmu-cards', title: '21. Reading a Machine: PMU Cards' },
  { id: 'measurements', title: '22. Our Measurements' },
  { id: 'price-performance', title: '23. Price-Performance and Latency' },
  { id: 'aws-orchestration', title: '24. Orchestrating It on AWS' },
  { id: 'choosing', title: '25. Choosing' },
  { id: 'sources', title: '26. Glossary and Sources' },
];

const sectionComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
  'one-loop': OneLoop,
  'getting-started': GettingStarted,
  'robot-computer': RobotAsComputer,
  'demonstrations': LearningFromDemonstrations,
  'vla': VisionLanguageAction,
  'world-models': WorldModels,
  'jepa': Jepa,
  'robot-rl': RobotRl,
  'collecting': CollectingData,
  'curating': ProcessingCurating,
  'augmentation': Augmentation,
  'physics': PhysicsSimulation,
  'rendering': Rendering,
  'sim-to-real': SimToReal,
  'training-scales': TrainingScales,
  'evaluation': Evaluation,
  'on-robot': OnRobot,
  'fleet': Fleet,
  'agents': AgentsLoop,
  'workloads': Workloads,
  'pmu-cards': PmuCards,
  'measurements': Measurements,
  'price-performance': PricePerformance,
  'aws-orchestration': AwsOrchestration,
  'choosing': Choosing,
  'sources': GlossaryAndSources,
};

export const DIVE_TITLE = 'Physical AI';
export const DIVE_SUBTITLE = "From a robot's demonstrations to a fleet that learns";

function sectionFromHash(): string {
  const id = typeof window === 'undefined' ? '' : window.location.hash.replace(/^#/, '');
  return id in sectionComponents ? id : 'one-loop';
}

export function App() {
  const [activeSection, setActiveSection] = useState(sectionFromHash);
  const SectionComponent = sectionComponents[activeSection] || OneLoop;

  // The address carries the section, so a link to "#jepa" opens section 7 and Back works.
  useEffect(() => {
    const onHash = () => setActiveSection(sectionFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = (id: string) => {
    setActiveSection(id);
    if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`);
    window.scrollTo(0, 0);
  };

  return (
    <DeepDiveLayout
      title={DIVE_TITLE}
      subtitle={DIVE_SUBTITLE}
      sections={sections}
      activeSection={activeSection}
      onSectionChange={go}
      siblings={[
        { label: 'Learning From Feedback', href: '../rl-agentic-loops/' },
        { label: 'Training at Scale', href: '../llm-training-systems/' },
        { label: 'Silicon, Memory & Inference', href: '../silicon-memory-inference/' },
        { label: 'EFA', href: '../efa/' },
      ]}
    >
      <Suspense fallback={<Spinner size="large" />}>
        <SectionComponent />
      </Suspense>
    </DeepDiveLayout>
  );
}
