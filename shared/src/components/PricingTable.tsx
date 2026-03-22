import React from 'react';
import Table from '@cloudscape-design/components/table';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';

interface PricingRow {
  item: string;
  cost: string;
  notes: string;
  [key: string]: string;
}

interface PricingTableProps {
  title: string;
  description?: string;
  items: PricingRow[];
  columns?: { id: string; header: string }[];
}

export function PricingTable({ title, description, items, columns }: PricingTableProps) {
  const cols = columns || [
    { id: 'item', header: 'Item' },
    { id: 'cost', header: 'Cost' },
    { id: 'notes', header: 'Notes' },
  ];

  return (
    <Table
      header={
        <Header description={description} counter={`(${items.length})`}>
          {title}
        </Header>
      }
      columnDefinitions={cols.map((c) => ({
        id: c.id,
        header: c.header,
        cell: (row: PricingRow) => row[c.id] || '-',
        sortingField: c.id,
      }))}
      items={items}
      sortingDisabled
      variant="embedded"
      empty={<Box textAlign="center">No pricing data available</Box>}
    />
  );
}
