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
const CodebaseServerArgs = React.lazy(() =>
  import('./codebase/CodebaseServerArgs').then((m) => ({ default: m.CodebaseServerArgs }))
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
const CodebaseStructuredSpec = React.lazy(() =>
  import('./codebase/CodebaseStructuredSpec').then((m) => ({ default: m.CodebaseStructuredSpec }))
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
            21. Inside the Codebase
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Each tab is a reading path through one subsystem of the SGLang source at the v0.5.22 tag:
            the files in the order a request meets them, the abstraction each one owns, and pinned line
            ranges for the behaviour the earlier sections describe. Start with the module map, then open
            the tab for the subsystem you are about to tune or debug.
          </Box>
          <Box variant="p">
            The runtime lives under{' '}
            <Cite tier={1} href={sglangTreeUrl('python/sglang/srt')}>
              python/sglang/srt/
            </Cite>
            , the Rust server crates (the opt-in Rust frontend and the radix tree core) under{' '}
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
          { id: 'arch', label: 'Architecture & Module Map', content: lazy(CodebaseArchitecture) },
          { id: 'args', label: 'Server Arguments & Hooks', content: lazy(CodebaseServerArgs) },
          { id: 'scheduler', label: 'Scheduler & Batching', content: lazy(CodebaseScheduler) },
          { id: 'radix', label: 'Radix Cache & Memory Pools', content: lazy(CodebaseRadixMemory) },
          { id: 'execution', label: 'Model Execution & Attention', content: lazy(CodebaseExecution) },
          { id: 'structured-spec', label: 'Structured Output & Speculative Decoding', content: lazy(CodebaseStructuredSpec) },
          { id: 'parallel', label: 'Parallelism, MoE & PD', content: lazy(CodebaseParallelPd) },
          { id: 'rust', label: 'The Rust Side', content: lazy(CodebaseRust) },
        ]}
      />
    </SpaceBetween>
  );
}
