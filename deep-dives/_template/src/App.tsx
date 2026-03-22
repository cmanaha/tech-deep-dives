import React, { useState } from 'react';
import { DeepDiveLayout } from '@tech-deep-dives/shared';

// Define your sections here. Each section maps to a component.
const sections = [
  { id: 'overview', title: 'Overview' },
  { id: 'architecture', title: 'Architecture' },
  { id: 'tradeoffs', title: 'Trade-offs' },
  { id: 'pricing', title: 'Pricing' },
  { id: 'decision', title: 'Decision Guide' },
];

function Overview() {
  return <div>Overview section — start with the business problem this technology solves.</div>;
}

function Architecture() {
  return <div>Architecture section — how it works, key components, data flow.</div>;
}

function Tradeoffs() {
  return <div>Trade-offs section — alternatives, limitations, when NOT to use.</div>;
}

function Pricing() {
  return <div>Pricing section — cost model, optimization strategies, gotchas.</div>;
}

function DecisionGuide() {
  return <div>Decision guide — flowchart or criteria for choosing this technology.</div>;
}

const sectionComponents: Record<string, React.FC> = {
  overview: Overview,
  architecture: Architecture,
  tradeoffs: Tradeoffs,
  pricing: Pricing,
  decision: DecisionGuide,
};

export function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const SectionComponent = sectionComponents[activeSection] || Overview;

  return (
    <DeepDiveLayout
      title="TOPIC"
      subtitle="Interactive technical deep dive into TOPIC"
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      <SectionComponent />
    </DeepDiveLayout>
  );
}
