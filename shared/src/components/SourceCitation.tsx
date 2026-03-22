import React from 'react';
import Popover from '@cloudscape-design/components/popover';
import Link from '@cloudscape-design/components/link';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

interface SourceCitationProps {
  id: number;
  title: string;
  url: string;
  accessDate: string;
  type: 'official-docs' | 'blog' | 'github' | 'paper' | 'experiment';
}

const typeLabels: Record<SourceCitationProps['type'], string> = {
  'official-docs': 'Official Documentation',
  blog: 'Blog Post',
  github: 'GitHub Repository',
  paper: 'Research Paper',
  experiment: 'Our Experiment',
};

export function SourceCitation({ id, title, url, accessDate, type }: SourceCitationProps) {
  return (
    <Popover
      triggerType="custom"
      content={
        <div>
          <StatusIndicator type={type === 'official-docs' || type === 'experiment' ? 'success' : 'info'}>
            {typeLabels[type]}
          </StatusIndicator>
          <p>
            <Link href={url} external>
              {title}
            </Link>
          </p>
          <p style={{ fontSize: '12px', color: '#687078' }}>Accessed: {accessDate}</p>
        </div>
      }
    >
      <sup
        style={{
          cursor: 'pointer',
          color: '#0972d3',
          fontWeight: 600,
          fontSize: '11px',
        }}
      >
        [{id}]
      </sup>
    </Popover>
  );
}
