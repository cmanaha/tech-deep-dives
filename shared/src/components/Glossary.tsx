import React, { useState } from 'react';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';

export interface GlossaryEntry {
  acronym: string;
  fullForm: string;
  description: string;
}

export interface GlossaryProps {
  entries: GlossaryEntry[];
  title?: string;
}

// Long code identifiers and flags would otherwise widen a column past a phone screen.
const breakAnywhere: React.CSSProperties = { overflowWrap: 'anywhere' };

export function Glossary({ entries, title = 'Glossary of Acronyms' }: GlossaryProps) {
  const [filterText, setFilterText] = useState('');

  const sorted = [...entries].sort((a, b) => a.acronym.localeCompare(b.acronym));

  const filtered = sorted.filter((entry) => {
    if (!filterText) return true;
    const lower = filterText.toLowerCase();
    return (
      entry.acronym.toLowerCase().includes(lower) ||
      entry.fullForm.toLowerCase().includes(lower) ||
      entry.description.toLowerCase().includes(lower)
    );
  });

  return (
    <Table
      header={
        <Header variant="h2" counter={`(${filtered.length})`}>
          {title}
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
          cell: (item) => (
            <span style={breakAnywhere}>
              <strong>{item.acronym}</strong>
              <Box variant="small" display="block">
                {item.fullForm}
              </Box>
            </span>
          ),
          width: 150,
        },
        {
          id: 'description',
          header: 'Description',
          cell: (item) => <span style={breakAnywhere}>{item.description}</span>,
          minWidth: 170,
        },
      ]}
      items={filtered}
      wrapLines
      sortingDisabled
      variant="embedded"
    />
  );
}
