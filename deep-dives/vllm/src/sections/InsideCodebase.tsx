import React, { Suspense, useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Tabs from '@cloudscape-design/components/tabs';
import Spinner from '@cloudscape-design/components/spinner';

const CodebaseArchitecture = React.lazy(() =>
  import('./codebase/CodebaseArchitecture').then((m) => ({ default: m.CodebaseArchitecture }))
);
const CodebaseConfig = React.lazy(() =>
  import('./codebase/CodebaseConfig').then((m) => ({ default: m.CodebaseConfig }))
);
const CodebaseScheduler = React.lazy(() =>
  import('./codebase/CodebaseScheduler').then((m) => ({ default: m.CodebaseScheduler }))
);
const CodebaseExecution = React.lazy(() =>
  import('./codebase/CodebaseExecution').then((m) => ({ default: m.CodebaseExecution }))
);
const CodebaseModelLayer = React.lazy(() =>
  import('./codebase/CodebaseModelLayer').then((m) => ({ default: m.CodebaseModelLayer }))
);
const CodebaseDistributed = React.lazy(() =>
  import('./codebase/CodebaseDistributed').then((m) => ({ default: m.CodebaseDistributed }))
);
const CodebaseAdvanced = React.lazy(() =>
  import('./codebase/CodebaseAdvanced').then((m) => ({ default: m.CodebaseAdvanced }))
);
const CodebaseRust = React.lazy(() =>
  import('./codebase/CodebaseRust').then((m) => ({ default: m.CodebaseRust }))
);

const lazy = (Comp: React.LazyExoticComponent<React.FC>) => (
  <Suspense fallback={<Spinner size="large" />}>
    <Comp />
  </Suspense>
);

export function InsideCodebase() {
  const [activeTabId, setActiveTabId] = useState('arch');

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="How vLLM is actually built — module map, process model, and the call paths through the real source (pinned to commit 15652a6b, accessed 2026-06-07)"
          >
            Inside the Codebase
          </Header>
        }
      >
        <Box variant="p">
          This section walks the vLLM source itself, organized by subsystem. Each
          tab covers one part of the engine — what files implement it, the key
          abstractions, and how a request flows through them. It complements the
          conceptual sections above: those explain the ideas, these show the code
          that realizes them.
        </Box>
      </Container>

      <Tabs
        activeTabId={activeTabId}
        onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
        tabs={[
          { id: 'arch', label: 'Architecture & Module Map', content: lazy(CodebaseArchitecture) },
          { id: 'config', label: 'Configuration', content: lazy(CodebaseConfig) },
          { id: 'scheduler', label: 'Scheduler & KV Cache', content: lazy(CodebaseScheduler) },
          { id: 'execution', label: 'Execution & Attention', content: lazy(CodebaseExecution) },
          { id: 'models', label: 'Model Layer, Quant & LoRA', content: lazy(CodebaseModelLayer) },
          { id: 'distributed', label: 'Distributed & KV Transfer', content: lazy(CodebaseDistributed) },
          { id: 'advanced', label: 'Spec Decode, Guided Decode & Compile', content: lazy(CodebaseAdvanced) },
          { id: 'rust', label: 'The Rust Frontend', content: lazy(CodebaseRust) },
        ]}
      />
    </SpaceBetween>
  );
}
