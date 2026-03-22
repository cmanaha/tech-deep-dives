import React from 'react';
import Table from '@cloudscape-design/components/table';
import Header from '@cloudscape-design/components/header';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

interface ComparisonItem {
  feature: string;
  [key: string]: string | boolean;
}

interface ComparisonMatrixProps {
  title: string;
  description?: string;
  options: string[];
  items: ComparisonItem[];
}

export function ComparisonMatrix({ title, description, options, items }: ComparisonMatrixProps) {
  return (
    <Table
      header={<Header description={description}>{title}</Header>}
      columnDefinitions={[
        {
          id: 'feature',
          header: 'Feature',
          cell: (row: ComparisonItem) => <strong>{row.feature as string}</strong>,
        },
        ...options.map((opt) => ({
          id: opt,
          header: opt,
          cell: (row: ComparisonItem) => {
            const val = row[opt];
            if (typeof val === 'boolean') {
              return val ? (
                <StatusIndicator type="success">Yes</StatusIndicator>
              ) : (
                <StatusIndicator type="error">No</StatusIndicator>
              );
            }
            return val || '-';
          },
        })),
      ]}
      items={items}
      sortingDisabled
      variant="embedded"
    />
  );
}
