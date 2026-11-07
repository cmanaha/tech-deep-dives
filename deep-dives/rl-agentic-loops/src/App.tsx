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
// Where the signal comes from
const FineTuningSignals = React.lazy(() =>
  import('./sections/FineTuningSignals').then((m) => ({ default: m.FineTuningSignals }))
);
const LearningFromAnswers = React.lazy(() =>
  import('./sections/LearningFromAnswers').then((m) => ({ default: m.LearningFromAnswers }))
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
// RL with verifiable rewards, and set against distillation
const RlvrAndGrpo = React.lazy(() =>
  import('./sections/RlvrAndGrpo').then((m) => ({ default: m.RlvrAndGrpo }))
);
const WhatRlDoes = React.lazy(() =>
  import('./sections/WhatRlDoes').then((m) => ({ default: m.WhatRlDoes }))
);
const DistillationOrRl = React.lazy(() =>
  import('./sections/DistillationOrRl').then((m) => ({ default: m.DistillationOrRl }))
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
  { id: 'one-loop', title: '1. One Loop: What It Learns From and Where It Keeps It' },
  { id: 'getting-started', title: '2. Getting Started' },
  { id: 'signals', title: '3. Fine-Tuning Techniques: Where the Learning Signal Comes From' },
  { id: 'answers', title: '4. Learning From Answers: Supervised Fine-Tuning & Distillation' },
  { id: 'policy', title: '5. The Language Model Is Already a Policy' },
  { id: 'policy-gradient', title: '6. Policy Gradient' },
  { id: 'leashes', title: '7. Two Leashes: PPO\'s Clip & the KL' },
  { id: 'preferences', title: '8. Learning From Preferences: Reward Models, RLHF & DPO' },
  { id: 'rlvr', title: '9. RLVR & GRPO' },
  { id: 'what-rl-does', title: '10. What RL Does to a Model' },
  { id: 'distill-or-rl', title: '11. Distillation or RL: A Teacher\'s Answers or a Score on Your Own' },
  { id: 'agentic-rl', title: '12. Agentic RL' },
  { id: 'reward-proxy', title: '13. The Reward Is a Proxy' },
  { id: 'text-loop', title: '14. A Text Loop Is RL on the Context' },
  { id: 'verbal', title: '15. Verbal Reinforcement & Self-Correction' },
  { id: 'experience', title: '16. Memories, Playbooks & Skill Libraries' },
  { id: 'prompt-opt', title: '17. Optimising the Prompt' },
  { id: 'your-loops', title: '18. Your Loops Through the RL Lens' },
  { id: 'hybrids', title: '19. Hybrids' },
  { id: 'words-limits', title: '20. Where Words Fall Short' },
  { id: 'weights-context', title: '21. What Lives in Weights & What Lives in Context' },
  { id: 'rl-systems', title: '22. An RL Step Is an Inference Job Inside a Training Job' },
  { id: 'cost', title: '23. Cost per Improvement' },
  { id: 'lab', title: '24. Side by Side on a DGX Spark' },
  { id: 'choosing', title: '25. Choosing a Technique: Fine-Tuning, a Text Loop or a Hybrid' },
  { id: 'aws', title: '26. Fine-Tuning & Learning Loops on AWS' },
  { id: 'sources', title: '27. Glossary & Sources' },
];

const sectionComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
  'one-loop': OneLoop,
  'getting-started': GettingStarted,
  signals: FineTuningSignals,
  answers: LearningFromAnswers,
  policy: LanguageModelAsPolicy,
  'policy-gradient': PolicyGradient,
  leashes: TwoLeashes,
  preferences: PreferencesToRewards,
  rlvr: RlvrAndGrpo,
  'what-rl-does': WhatRlDoes,
  'distill-or-rl': DistillationOrRl,
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

/**
 * The dive's title and subtitle, defined once. Option B of the rename plan, chosen by the
 * assistant on 2026-11-07 and reversible: index.html, README.md, SCOPE.md and the front-page
 * card repeat this text and change with it. index.html's <title> uses the short form
 * "Learning From Feedback: Fine-Tuning, RL and Agentic Learning Loops", since html-validate
 * caps a title at 70 characters.
 */
export const DIVE_TITLE = 'Learning From Feedback: Fine-Tuning, Reinforcement Learning and Agentic Learning Loops';
export const DIVE_SUBTITLE =
  "How a language model learns from examples, a teacher's answers, preferences or scores, whether the change is written into its weights or into the context a frozen model reads, and how to choose between them";

export function App() {
  const [activeSection, setActiveSection] = useState('one-loop');
  const SectionComponent = sectionComponents[activeSection] || OneLoop;

  return (
    <DeepDiveLayout
      title={DIVE_TITLE}
      subtitle={DIVE_SUBTITLE}
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      siblings={[
        {
          label: 'Training at Scale: How Large Language Models Are Trained, and How to Run It on AWS',
          href: '../llm-training-systems/',
        },
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
