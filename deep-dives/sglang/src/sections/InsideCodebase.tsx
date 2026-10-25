import React, { Suspense, useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Tabs from '@cloudscape-design/components/tabs';
import Spinner from '@cloudscape-design/components/spinner';
import { Cite, sglangTreeUrl } from '../components/Cite';

const CodebaseArchitecture = React.lazy(() =>
  import('./codebase/CodebaseArchitecture').then((m) => ({ default: m.CodebaseArchitecture }))
);
const CodebaseScheduler = React.lazy(() =>
  import('./codebase/CodebaseScheduler').then((m) => ({ default: m.CodebaseScheduler }))
);
const CodebaseRadixMemory = React.lazy(() =>
  import('./codebase/CodebaseRadixMemory').then((m) => ({ default: m.CodebaseRadixMemory }))
);
const CodebaseExecution = React.lazy(() =>
  import('./codebase/CodebaseExecution').then((m) => ({ default: m.CodebaseExecution }))
);
const CodebaseParallelPd = React.lazy(() =>
  import('./codebase/CodebaseParallelPd').then((m) => ({ default: m.CodebaseParallelPd }))
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
            description="Find the file and line behind any behaviour in this dive, so you can confirm it in the code you run (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            27. Inside the Codebase
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Each tab is a reading path through one subsystem of the SGLang source at the v0.5.22 tag:
            the files in the order a request meets them, the abstraction each one owns, and pinned line
            ranges for the behaviour the earlier sections describe. Each tab opens with the behaviour it
            explains and ends on the check you can run. Start with the launch path, then open the tab for
            the subsystem you are about to tune or debug.
          </Box>
          <Box variant="p">
            The runtime lives under{' '}
            <Cite tier={1} href={sglangTreeUrl('python/sglang/srt')}>
              python/sglang/srt/
            </Cite>
            , the Rust crates, among them the opt-in Rust frontend and the radix tree core, under{' '}
            <Cite tier={1} href={sglangTreeUrl('rust')}>
              rust/
            </Cite>
            , and the gateway under{' '}
            <Cite tier={1} href={sglangTreeUrl('sgl-model-gateway')}>
              sgl-model-gateway/
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Tabs
        activeTabId={activeTabId}
        onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
        tabs={[
          { id: 'arch', label: 'Launch Path & Argument Resolution', content: lazy(CodebaseArchitecture) },
          { id: 'scheduler', label: 'Scheduler & Batching', content: lazy(CodebaseScheduler) },
          { id: 'radix', label: 'Radix Cache & Memory Pools', content: lazy(CodebaseRadixMemory) },
          { id: 'execution', label: 'Model Execution & Attention', content: lazy(CodebaseExecution) },
          { id: 'parallel', label: 'Parallelism, MoE & PD', content: lazy(CodebaseParallelPd) },
          { id: 'rust', label: 'Gateway & Rust Frontend', content: lazy(CodebaseRust) },
        ]}
      />
    </SpaceBetween>
  );
}
