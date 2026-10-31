import { useState } from 'react';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';
import Header from '@cloudscape-design/components/header';
import Badge from '@cloudscape-design/components/badge';
import Link from '@cloudscape-design/components/link';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import type { GlossaryEntry, Source, SourceType } from '@tech-deep-dives/shared';

// Dive-local glossary and source tables. This dive grades sources Tier 0 to 3, where the
// shared SourcesAppendix describes a Tier 1 to 4 scheme, so it keeps its own tables built on
// the shared data types.

export function GlossaryTable({ entries }: { entries: GlossaryEntry[] }) {
  const [filterText, setFilterText] = useState('');
  const lower = filterText.toLowerCase();
  const items = [...entries]
    .sort((a, b) => a.acronym.localeCompare(b.acronym))
    .filter(
      (e) =>
        !lower ||
        e.acronym.toLowerCase().includes(lower) ||
        e.fullForm.toLowerCase().includes(lower) ||
        e.description.toLowerCase().includes(lower),
    );

  return (
    <Table
      header={
        <Header variant="h2" counter={`(${items.length})`}>
          Glossary
        </Header>
      }
      filter={
        <TextFilter
          filteringText={filterText}
          onChange={({ detail }) => setFilterText(detail.filteringText)}
          filteringPlaceholder="Search terms"
        />
      }
      columnDefinitions={[
        {
          id: 'term',
          header: 'Term',
          cell: (e) => (
            <>
              <strong>{e.acronym}</strong>
              <Box variant="small" display="block">
                {e.fullForm}
              </Box>
            </>
          ),
          width: 130,
        },
        { id: 'description', header: 'Description', cell: (e) => e.description, minWidth: 170 },
      ]}
      items={items}
      wrapLines
      sortingDisabled
      variant="container"
    />
  );
}

const tierText: Record<1 | 2 | 3, { color: 'green' | 'blue' | 'grey'; text: string }> = {
  1: { color: 'green', text: 'Code at a pinned tag or commit, framework documentation, first-party AWS documentation and pricing' },
  2: { color: 'blue', text: "Lab and vendor posts; their performance figures stay the author's claims" },
  3: { color: 'grey', text: 'Papers, marked with their venue or as a preprint' },
};

const typeLabels: Partial<Record<SourceType, string>> = {
  'official-docs': 'Documentation',
  'source-code': 'Source code',
  'product-page': 'Product page',
  'aws-blog': 'AWS blog',
  whitepaper: 'Whitepaper',
  'aws-open-source': 'AWS open source',
  'academic-paper': 'Paper',
  blog: 'Post',
};

function tierOf(s: Source): 1 | 2 | 3 {
  return s.tier === 1 || s.tier === 2 ? s.tier : 3;
}

export function KeySourcesTable({ sources }: { sources: Source[] }) {
  const counts = sources.reduce<Record<number, number>>((acc, s) => {
    acc[tierOf(s)] = (acc[tierOf(s)] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <SpaceBetween size="m">
      <ColumnLayout columns={3} variant="text-grid">
        {([1, 2, 3] as const).map((tier) => (
          <SpaceBetween key={tier} size="xxs">
            <Badge color={tierText[tier].color}>Tier {tier}</Badge>
            <Box variant="small">{tierText[tier].text}</Box>
            <Box variant="p">
              <strong>{counts[tier] ?? 0}</strong> key sources
            </Box>
          </SpaceBetween>
        ))}
      </ColumnLayout>
      <Table
        header={
          <Header
            variant="h2"
            counter={`(${sources.length})`}
            description="The sources the dive leans on most. sources.md lists every citation."
          >
            Key sources
          </Header>
        }
        columnDefinitions={[
          { id: 'id', header: '#', cell: (s) => s.id, width: 52 },
          {
            id: 'source',
            header: 'Source',
            cell: (s) => (
              <>
                <Link href={s.url} external>
                  {s.title}
                </Link>
                <Box variant="small" display="block">
                  <Badge color={tierText[tierOf(s)].color}>Tier {tierOf(s)}</Badge>{' '}
                  {typeLabels[s.type] ?? s.type}, accessed {s.accessDate}
                </Box>
              </>
            ),
            minWidth: 230,
          },
        ]}
        items={sources}
        wrapLines
        sortingDisabled
        variant="container"
      />
    </SpaceBetween>
  );
}
