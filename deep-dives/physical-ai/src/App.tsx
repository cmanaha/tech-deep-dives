import React, { useState } from 'react';
import { DeepDiveLayout } from '@tech-deep-dives/shared';

// The dive is at Gate 1 (scope and research sign-off). Sections are written after approval;
// the section plan lives in SCOPE.md.
const sections = [{ id: 'status', title: 'Research Status' }];

function Status() {
  return (
    <div>
      This deep dive is in its research phase. The scope, the section plan and the claim registers are in the
      repository under deep-dives/physical-ai.
    </div>
  );
}

const sectionComponents: Record<string, React.FC> = {
  status: Status,
};

export function App() {
  const [activeSection, setActiveSection] = useState('status');
  const SectionComponent = sectionComponents[activeSection] || Status;

  return (
    <DeepDiveLayout
      title="Physical AI"
      subtitle="From a robot's demonstrations to a fleet that learns"
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      <SectionComponent />
    </DeepDiveLayout>
  );
}
