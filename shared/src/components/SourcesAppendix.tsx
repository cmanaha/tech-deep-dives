import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import Badge from '@cloudscape-design/components/badge';
import Link from '@cloudscape-design/components/link';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

export type SourceTier = 1 | 2 | 3 | 4;

export type SourceType =
  | 'official-docs'
  | 'api-reference'
  | 'source-code'
  | 'product-page'
  | 'announcement'
  | 'aws-blog'
  | 'whitepaper'
  | 'aws-open-source'
  | 'third-party-analysis'
  | 'academic-paper'
  | 'third-party-benchmark'
  | 'blog'
  | 'tutorial';

export interface Source {
  id: number;
  title: string;
  url: string;
  tier: SourceTier;
  type: SourceType;
  accessDate: string;
}

export interface FactCheckItem {
  claim: string;
  sourceId: number;
  section: string;
}

interface SourcesAppendixProps {
  sources: Source[];
  factChecks?: FactCheckItem[];
  /** h1 when this appendix is the section's own title, h2 when the section already has one. */
  headerVariant?: 'h1' | 'h2';
}

const tierConfig: Record<SourceTier, { label: string; color: 'green' | 'blue' | 'grey' | 'red'; description: string }> = {
  1: { label: 'Tier 1', color: 'green', description: 'Official documentation, API reference, source code at a pinned version' },
  2: { label: 'Tier 2', color: 'blue', description: 'First-party blog posts, announcements, product pages' },
  3: { label: 'Tier 3', color: 'grey', description: 'Third-party technical analysis, academic papers, benchmarks' },
  4: { label: 'Tier 4', color: 'red', description: 'Blog posts and tutorials: inspiration only, never cited as fact' },
};

const typeLabels: Record<SourceType, string> = {
  'official-docs': 'Official Docs',
  'api-reference': 'API Reference',
  'source-code': 'Source Code',
  'product-page': 'Product Page',
  'announcement': 'Announcement',
  'aws-blog': 'AWS Blog',
  'whitepaper': 'Whitepaper',
  'aws-open-source': 'AWS Open Source',
  'third-party-analysis': 'Third-Party Analysis',
  'academic-paper': 'Academic Paper',
  'third-party-benchmark': 'Third-Party Benchmark',
  'blog': 'Blog Post',
  'tutorial': 'Tutorial',
};

// Long titles, URLs and code identifiers would otherwise widen a column past a phone screen.
const breakAnywhere: React.CSSProperties = { overflowWrap: 'anywhere' };

export function SourcesAppendix({ sources, factChecks, headerVariant = 'h2' }: SourcesAppendixProps) {
  const tierCounts = sources.reduce(
    (acc, s) => {
      acc[s.tier] = (acc[s.tier] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant={headerVariant}
            description="Every source graded by authority. Tier 1 sources are ground truth; Tier 4 sources are never cited as fact."
          >
            Sources & Fact-Check Register
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Source quality determines report accuracy. If you see Tier 3 or 4 sources backing
            critical claims, treat those claims with appropriate skepticism.
          </Box>
          <ColumnLayout columns={4} variant="text-grid">
            {([1, 2, 3, 4] as SourceTier[]).map((tier) => (
              <div key={tier}>
                <SpaceBetween size="xxs" direction="vertical">
                  <Badge color={tierConfig[tier].color}>{tierConfig[tier].label}</Badge>
                  <Box variant="small">{tierConfig[tier].description}</Box>
                  <Box variant="p">
                    <strong>{tierCounts[tier] || 0}</strong> source{(tierCounts[tier] || 0) !== 1 ? 's' : ''}
                  </Box>
                </SpaceBetween>
              </div>
            ))}
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Table
        header={
          <Header variant="h2" counter={`(${sources.length})`}>
            All Sources
          </Header>
        }
        columnDefinitions={[
          {
            id: 'id',
            header: '#',
            cell: (item) => item.id,
            width: 56,
          },
          {
            id: 'source',
            header: 'Source',
            cell: (item) => (
              <span style={breakAnywhere}>
                <Link href={item.url} external>
                  {item.title}
                </Link>
                <Box variant="small" display="block">
                  <Badge color={tierConfig[item.tier].color}>{tierConfig[item.tier].label}</Badge>{' '}
                  {typeLabels[item.type] || item.type}, accessed {item.accessDate}
                </Box>
              </span>
            ),
            minWidth: 230,
          },
        ]}
        items={sources}
        wrapLines
        sortingDisabled
        variant="container"
      />

      {factChecks && factChecks.length > 0 && (
        <Table
          header={
            <Header
              variant="h2"
              counter={`(${factChecks.length})`}
              description="Every quantitative claim in the deep dive traced to its source"
            >
              Fact-Check Register
            </Header>
          }
          columnDefinitions={[
            {
              id: 'claim',
              header: 'Claim',
              cell: (item) => (
                <span style={breakAnywhere}>
                  <strong>{item.claim}</strong>
                </span>
              ),
              minWidth: 120,
            },
            {
              id: 'source',
              header: 'Source',
              cell: (item) => {
                const source = sources.find((s) => s.id === item.sourceId);
                if (!source) {
                  return (
                    <StatusIndicator type="error">
                      Unverified (no source)
                    </StatusIndicator>
                  );
                }
                return (
                  <span style={breakAnywhere}>
                    <Badge color={tierConfig[source.tier].color}>#{source.id}</Badge>{' '}
                    <Link href={source.url} external>
                      {source.title}
                    </Link>
                  </span>
                );
              },
            },
            {
              id: 'section',
              header: 'Section',
              cell: (item) => <span style={breakAnywhere}>{item.section}</span>,
              minWidth: 100,
            },
          ]}
          items={factChecks}
          wrapLines
          sortingDisabled
          variant="container"
        />
      )}
    </SpaceBetween>
  );
}
