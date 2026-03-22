import React, { useState } from 'react';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';
import Header from '@cloudscape-design/components/header';

export interface GlossaryEntry {
  acronym: string;
  fullForm: string;
  description: string;
}

export interface GlossaryProps {
  entries: GlossaryEntry[];
  title?: string;
}

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
        <Header counter={`(${filtered.length})`}>
          {title}
        </Header>
      }
      filter={
        <TextFilter
          filteringText={filterText}
          onChange={({ detail }) => setFilterText(detail.filteringText)}
          filteringPlaceholder="Search acronyms..."
        />
      }
      columnDefinitions={[
        {
          id: 'acronym',
          header: 'Acronym',
          cell: (item) => <strong>{item.acronym}</strong>,
          width: 120,
          sortingField: 'acronym',
        },
        {
          id: 'fullForm',
          header: 'Full Form',
          cell: (item) => item.fullForm,
          width: 300,
          sortingField: 'fullForm',
        },
        {
          id: 'description',
          header: 'Description',
          cell: (item) => item.description,
        },
      ]}
      items={filtered}
      sortingDisabled
      variant="embedded"
    />
  );
}
