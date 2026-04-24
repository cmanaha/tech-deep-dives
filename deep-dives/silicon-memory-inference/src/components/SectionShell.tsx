import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';

interface SectionShellProps {
  title: string;
  subtitle?: string;
  scope: string[];
  panelistMap: string;
  evaluationLens: string[];
  // Legacy props kept for backward compatibility with not-yet-rewritten scaffolds.
  // These are ignored in the new clean-copy layout.
  tldr?: string[];
  status?: 'scaffold' | 'draft' | 'reviewed';
}

// SectionShell renders scaffold / work-note placeholders for sections whose
// content has not been written yet. Once a section is implemented it should
// drop SectionShell entirely and use Cloudscape Containers directly, like the
// EFA deep dive.
export function SectionShell({
  title,
  subtitle,
  scope,
  panelistMap,
  evaluationLens,
  children,
}: React.PropsWithChildren<SectionShellProps>) {
  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h1" description={subtitle}>{title}</Header>}>
        <Box variant="p">
          This section is a working placeholder. Content will be integrated from vendor
          documentation in a subsequent iteration. The scope below and the working notes that
          follow are internal editorial hints, not reader-facing content.
        </Box>
      </Container>

      {children ? <Container>{children}</Container> : null}

      <Container header={<Header variant="h2">Scope (internal)</Header>}>
        <ul>
          {scope.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </Container>

      <Container header={<Header variant="h2">Panelist map (internal)</Header>}>
        <Box variant="p">{panelistMap}</Box>
      </Container>

      <Container header={<Header variant="h2">Evaluation lens (internal)</Header>}>
        <ul>
          {evaluationLens.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </Container>
    </SpaceBetween>
  );
}
