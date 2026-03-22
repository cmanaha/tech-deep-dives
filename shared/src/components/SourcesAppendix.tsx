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
}

const tierConfig: Record<SourceTier, { label: string; color: 'green' | 'blue' | 'grey' | 'red'; description: string }> = {
  1: { label: 'Tier 1', color: 'green', description: 'Official AWS docs, API reference, source code' },
  2: { label: 'Tier 2', color: 'blue', description: 'AWS blog posts, announcements, product pages' },
  3: { label: 'Tier 3', color: 'grey', description: 'Third-party technical analysis, academic papers, benchmarks' },
  4: { label: 'Tier 4', color: 'red', description: 'Blog posts, tutorials — inspiration only, never cited as fact' },
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

export function SourcesAppendix({ sources, factChecks }: SourcesAppendixProps) {
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
            variant="h1"
            description="Every source graded by authority — Tier 1 sources are ground truth, Tier 4 sources are never cited as fact"
          >
            Sources & Fact-Check Register
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Source quality determines report accuracy. If you see Tier 3-4 sources backing
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
            width: 60,
          },
          {
            id: 'title',
            header: 'Title',
            cell: (item) => (
              <Link href={item.url} external>
                {item.title}
              </Link>
            ),
          },
          {
            id: 'tier',
            header: 'Tier',
            cell: (item) => (
              <Badge color={tierConfig[item.tier].color}>
                {tierConfig[item.tier].label}
              </Badge>
            ),
            width: 100,
          },
          {
            id: 'type',
            header: 'Type',
            cell: (item) => typeLabels[item.type] || item.type,
            width: 160,
          },
          {
            id: 'accessDate',
            header: 'Accessed',
            cell: (item) => item.accessDate,
            width: 120,
          },
        ]}
        items={sources}
        sortingDisabled
        variant="full-page"
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
              cell: (item) => <strong>{item.claim}</strong>,
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
                  <SpaceBetween size="xxs" direction="horizontal">
                    <Badge color={tierConfig[source.tier].color}>
                      #{source.id}
                    </Badge>
                    <Link href={source.url} external>
                      {source.title}
                    </Link>
                  </SpaceBetween>
                );
              },
            },
            {
              id: 'section',
              header: 'Section',
              cell: (item) => item.section,
              width: 200,
            },
          ]}
          items={factChecks}
          sortingDisabled
          variant="full-page"
        />
      )}
    </SpaceBetween>
  );
}
