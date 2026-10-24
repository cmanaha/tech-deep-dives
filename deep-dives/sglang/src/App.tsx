import { useState } from 'react';
import { DeepDiveLayout } from '@tech-deep-dives/shared';
import Box from '@cloudscape-design/components/box';

const sections = [{ id: 'thesis', title: '1. Thesis' }];

export function App() {
  const [activeSection, setActiveSection] = useState('thesis');
  return (
    <DeepDiveLayout
      title="SGLang"
      subtitle="Scaffold"
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      <Box variant="p">Scaffold.</Box>
    </DeepDiveLayout>
  );
}
