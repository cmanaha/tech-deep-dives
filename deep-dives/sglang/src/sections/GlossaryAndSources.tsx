import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import { Glossary, GlossaryEntry, SourcesAppendix, Source } from '@tech-deep-dives/shared';

// Source tiers (repo convention):
//  1 = source code at a pinned ref, official docs, API reference, release notes
//  2 = project or vendor blogs, talks, product pages (their numbers stay claims)
//  3 = third-party analysis, academic papers, benchmarks
// All access dates 2026-10-24. Code claims are pinned to the SGLang v0.5.22 tag (commit baa9befa).
// The full per-file citation list is generated into sources.md from the inline Cite components;
// this array is the curated reading list.

const sources: Source[] = [
  // SGLang: release, repository and documentation (Tier 1)
  { id: 1, title: 'SGLang v0.5.22 release notes', url: 'https://github.com/sgl-project/sglang/releases/tag/v0.5.22', tier: 1, type: 'announcement', accessDate: '2026-10-24' },
  { id: 2, title: 'SGLang repository at the v0.5.22 tag', url: 'https://github.com/sgl-project/sglang/tree/v0.5.22', tier: 1, type: 'source-code', accessDate: '2026-10-24' },
  { id: 3, title: 'SGLang README at v0.5.22', url: 'https://github.com/sgl-project/sglang/blob/v0.5.22/README.md', tier: 1, type: 'source-code', accessDate: '2026-10-24' },
  { id: 4, title: 'SGLang documentation source at v0.5.22 (docs/docs)', url: 'https://github.com/sgl-project/sglang/tree/v0.5.22/docs/docs', tier: 1, type: 'official-docs', accessDate: '2026-10-24' },
  { id: 5, title: 'SGLang documentation (rendered, tracks the default branch)', url: 'https://docs.sglang.io/', tier: 1, type: 'official-docs', accessDate: '2026-10-24' },
  { id: 6, title: 'SGLang server arguments at v0.5.22 (arg_groups/fields)', url: 'https://github.com/sgl-project/sglang/tree/v0.5.22/python/sglang/srt/arg_groups/fields', tier: 1, type: 'source-code', accessDate: '2026-10-24' },
  { id: 7, title: 'SGLang model gateway at v0.5.22 (sgl-model-gateway)', url: 'https://github.com/sgl-project/sglang/tree/v0.5.22/sgl-model-gateway', tier: 1, type: 'source-code', accessDate: '2026-10-24' },
];

const glossary: GlossaryEntry[] = [
  { acronym: 'SGLang', fullForm: 'SGLang (project name)', description: 'Open-source LLM serving runtime and frontend language from the sgl-project organisation, hosted by LMSYS.' },
  { acronym: 'KV cache', fullForm: 'Key-value cache', description: 'The attention keys and values of every processed token, kept on the GPU so decode does not recompute them.' },
  { acronym: 'TP', fullForm: 'Tensor parallelism', description: 'Splits each layer\'s weights and attention heads across GPUs that compute every token together.' },
  { acronym: 'DP', fullForm: 'Data parallelism', description: 'Runs independent replicas, each serving its own requests. In SGLang, DP attention splits only the attention layers this way.' },
  { acronym: 'EP', fullForm: 'Expert parallelism', description: 'Places different mixture-of-experts experts on different GPUs and routes tokens to them with an all-to-all exchange.' },
  { acronym: 'PD', fullForm: 'Prefill/decode (disaggregation)', description: 'Runs prompt processing and token generation on separate workers and moves the KV cache between them.' },
  { acronym: 'MoE', fullForm: 'Mixture of experts', description: 'A model whose feed-forward layers route each token to a few of many expert sub-networks.' },
  { acronym: 'EFA', fullForm: 'Elastic Fabric Adapter', description: 'The AWS network interface for OS-bypass, RDMA-style traffic between EC2 instances.' },
  { acronym: 'DLC', fullForm: 'Deep Learning Container', description: 'AWS-built container images for ML frameworks and serving runtimes.' },
];

export function GlossaryAndSources() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Look up any acronym in the dive, and find the source behind any claim, graded by how far to trust it"
          >
            29. Glossary &amp; Sources
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This deep dive describes SGLang <strong>v0.5.22</strong>, released 2026-10-19. Every
            source was read on <strong>2026-10-24</strong>. Code claims link to the{' '}
            <code>v0.5.22</code> tag (commit <code>baa9befa</code>), so each one can be checked
            against the exact line it describes. Documentation claims cite the tag-pinned page
            source, because the rendered docs site tracks the default branch.
          </Box>
          <Box variant="p">
            Sources are graded by tier. Tier 1 (source code, official documentation, release notes)
            is the authority, and where the docs and the code disagree the sections follow the code
            and say so. Tier 2 is project and vendor blogs, talks and product pages: their
            performance figures appear in the sections as attributed claims with their stated
            conditions. Tier 3 is papers and third-party analysis. The complete per-file list of
            citations, grouped by tier, is generated into <code>sources.md</code> in the dive&apos;s
            directory.
          </Box>
        </SpaceBetween>
      </Container>

      <Glossary entries={glossary} title="Glossary" />

      <SourcesAppendix sources={sources} />
    </SpaceBetween>
  );
}
