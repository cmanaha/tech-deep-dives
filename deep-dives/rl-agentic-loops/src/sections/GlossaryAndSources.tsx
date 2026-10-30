import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import { Glossary, GlossaryEntry, SourcesAppendix, Source } from '@tech-deep-dives/shared';
import { Cite, E0_URL } from '../components/Cite';

// Source tiers (RESEARCH-GUIDE.md section 1):
//  0 = our own experiments (listed in the first panel, not in the shared appendix table)
//  1 = source code at a pinned ref, official framework docs, first-party AWS docs and pricing
//  2 = first-party lab and vendor posts and talks (their numbers stay claims)
//  3 = papers (venue or preprint marked) and third-party technical analysis
// All access dates 2026-10-30 unless stated. The full per-file citation list is generated into
// sources.md from the inline Cite components; this array is the curated reading list.

const sources: Source[] = [
  { id: 1, title: 'Ouyang et al., Training language models to follow instructions with human feedback (InstructGPT), arXiv 2203.02155v1, NeurIPS 2022', url: 'https://arxiv.org/abs/2203.02155v1', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
  { id: 2, title: 'Schulman et al., Proximal Policy Optimization Algorithms, arXiv 1707.06347v2, preprint', url: 'https://arxiv.org/abs/1707.06347v2', tier: 3, type: 'academic-paper', accessDate: '2026-10-30' },
];

const glossary: GlossaryEntry[] = [
  { acronym: 'RL', fullForm: 'Reinforcement learning', description: 'Learning from a reward signal on the model\'s own attempts, here by changing the weights.' },
];

export function GlossaryAndSources() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="Every acronym in the dive, and every source it cites, grouped by authority (sources read 2026-10-30)">
            24. Glossary &amp; Sources
          </Header>
        }
      >
        <Box variant="p">
          Our own experiment: <Cite tier={0} href={E0_URL}>E0 log: GRPO smoke test on a DGX Spark</Cite>.
        </Box>
      </Container>
      <Glossary entries={glossary} />
      <SourcesAppendix sources={sources} />
    </SpaceBetween>
  );
}
