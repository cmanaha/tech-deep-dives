import React, { useState, Suspense } from 'react';
import { DeepDiveLayout } from '@tech-deep-dives/shared';
import Spinner from '@cloudscape-design/components/spinner';

// Framing
const OneLoop = React.lazy(() =>
  import('./sections/OneLoop').then((m) => ({ default: m.OneLoop }))
);
const GettingStarted = React.lazy(() =>
  import('./sections/GettingStarted').then((m) => ({ default: m.GettingStarted }))
);
// The RL vocabulary
const LanguageModelAsPolicy = React.lazy(() =>
  import('./sections/LanguageModelAsPolicy').then((m) => ({ default: m.LanguageModelAsPolicy }))
);
const PolicyGradient = React.lazy(() =>
  import('./sections/PolicyGradient').then((m) => ({ default: m.PolicyGradient }))
);
const TwoLeashes = React.lazy(() =>
  import('./sections/TwoLeashes').then((m) => ({ default: m.TwoLeashes }))
);
const PreferencesToRewards = React.lazy(() =>
  import('./sections/PreferencesToRewards').then((m) => ({ default: m.PreferencesToRewards }))
);
// RL with verifiable rewards
const RlvrAndGrpo = React.lazy(() =>
  import('./sections/RlvrAndGrpo').then((m) => ({ default: m.RlvrAndGrpo }))
);
const WhatRlDoes = React.lazy(() =>
  import('./sections/WhatRlDoes').then((m) => ({ default: m.WhatRlDoes }))
);
const AgenticRl = React.lazy(() =>
  import('./sections/AgenticRl').then((m) => ({ default: m.AgenticRl }))
);
const RewardIsAProxy = React.lazy(() =>
  import('./sections/RewardIsAProxy').then((m) => ({ default: m.RewardIsAProxy }))
);
// Learning in words
const TextLoopAsRl = React.lazy(() =>
  import('./sections/TextLoopAsRl').then((m) => ({ default: m.TextLoopAsRl }))
);
const VerbalReinforcement = React.lazy(() =>
  import('./sections/VerbalReinforcement').then((m) => ({ default: m.VerbalReinforcement }))
);
const AccumulatingExperience = React.lazy(() =>
  import('./sections/AccumulatingExperience').then((m) => ({ default: m.AccumulatingExperience }))
);
const PromptOptimization = React.lazy(() =>
  import('./sections/PromptOptimization').then((m) => ({ default: m.PromptOptimization }))
);
const YourLoops = React.lazy(() =>
  import('./sections/YourLoops').then((m) => ({ default: m.YourLoops }))
);
const Hybrids = React.lazy(() =>
  import('./sections/Hybrids').then((m) => ({ default: m.Hybrids }))
);
// Limits and the boundary
const WhereWordsFallShort = React.lazy(() =>
  import('./sections/WhereWordsFallShort').then((m) => ({ default: m.WhereWordsFallShort }))
);
const WeightsVsContext = React.lazy(() =>
  import('./sections/WeightsVsContext').then((m) => ({ default: m.WeightsVsContext }))
);
// Systems and cost
const RlStepAsSystem = React.lazy(() =>
  import('./sections/RlStepAsSystem').then((m) => ({ default: m.RlStepAsSystem }))
);
const CostPerImprovement = React.lazy(() =>
  import('./sections/CostPerImprovement').then((m) => ({ default: m.CostPerImprovement }))
);
// Practice: the lab, the choice and AWS
const SideBySideLab = React.lazy(() =>
  import('./sections/SideBySideLab').then((m) => ({ default: m.SideBySideLab }))
);
const Choosing = React.lazy(() =>
  import('./sections/Choosing').then((m) => ({ default: m.Choosing }))
);
const RlOnAws = React.lazy(() =>
  import('./sections/RlOnAws').then((m) => ({ default: m.RlOnAws }))
);
// Reference
const GlossaryAndSources = React.lazy(() =>
  import('./sections/GlossaryAndSources').then((m) => ({ default: m.GlossaryAndSources }))
);

const sections = [
  { id: 'one-loop', title: '1. One Loop, Three Places to Keep What It Learns' },
  { id: 'getting-started', title: '2. Getting Started' },
  { id: 'policy', title: '3. The Language Model Is Already a Policy' },
  { id: 'policy-gradient', title: '4. Policy Gradient' },
  { id: 'leashes', title: '5. Two Leashes: PPO\'s Clip & the KL' },
  { id: 'preferences', title: '6. From Preferences to Rewards' },
  { id: 'rlvr', title: '7. RLVR & GRPO' },
  { id: 'what-rl-does', title: '8. What RL Does to a Model' },
  { id: 'agentic-rl', title: '9. Agentic RL' },
  { id: 'reward-proxy', title: '10. The Reward Is a Proxy' },
  { id: 'text-loop', title: '11. A Text Loop Is RL on the Context' },
  { id: 'verbal', title: '12. Verbal Reinforcement & Self-Correction' },
  { id: 'experience', title: '13. Memories, Playbooks & Skill Libraries' },
  { id: 'prompt-opt', title: '14. Optimising the Prompt' },
  { id: 'your-loops', title: '15. Your Loops Through the RL Lens' },
  { id: 'hybrids', title: '16. Hybrids' },
  { id: 'words-limits', title: '17. Where Words Fall Short' },
  { id: 'weights-context', title: '18. What Lives in Weights & What Lives in Context' },
  { id: 'rl-systems', title: '19. An RL Step Is an Inference Job Inside a Training Job' },
  { id: 'cost', title: '20. Cost per Improvement' },
  { id: 'lab', title: '21. Side by Side on a DGX Spark' },
  { id: 'choosing', title: '22. Choosing a Text Loop, a Hybrid or a Weight Update' },
  { id: 'aws', title: '23. RL & Learning Loops on AWS' },
  { id: 'sources', title: '24. Glossary & Sources' },
];

const sectionComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
  'one-loop': OneLoop,
  'getting-started': GettingStarted,
  policy: LanguageModelAsPolicy,
  'policy-gradient': PolicyGradient,
  leashes: TwoLeashes,
  preferences: PreferencesToRewards,
  rlvr: RlvrAndGrpo,
  'what-rl-does': WhatRlDoes,
  'agentic-rl': AgenticRl,
  'reward-proxy': RewardIsAProxy,
  'text-loop': TextLoopAsRl,
  verbal: VerbalReinforcement,
  experience: AccumulatingExperience,
  'prompt-opt': PromptOptimization,
  'your-loops': YourLoops,
  hybrids: Hybrids,
  'words-limits': WhereWordsFallShort,
  'weights-context': WeightsVsContext,
  'rl-systems': RlStepAsSystem,
  cost: CostPerImprovement,
  lab: SideBySideLab,
  choosing: Choosing,
  aws: RlOnAws,
  sources: GlossaryAndSources,
};

export function App() {
  const [activeSection, setActiveSection] = useState('one-loop');
  const SectionComponent = sectionComponents[activeSection] || OneLoop;

  return (
    <DeepDiveLayout
      title="Learning From Feedback: RL and Agentic Learning Loops"
      subtitle="What reinforcement learning does to a language model, which part of that effect a loop can reproduce in words with a frozen model, where the words fall short, and how to choose between them"
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      siblings={[
        { label: 'vLLM: The LLM Inference Serving Engine', href: '../vllm/' },
        { label: 'SGLang: The Radix-Tree Serving Runtime', href: '../sglang/' },
        { label: 'Silicon, Memory & Inference', href: '../silicon-memory-inference/' },
      ]}
    >
      <Suspense fallback={<Spinner size="large" />}>
        <SectionComponent />
      </Suspense>
    </DeepDiveLayout>
  );
}
