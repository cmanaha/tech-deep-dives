import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import Badge from '@cloudscape-design/components/badge';

interface SectionShellProps {
  title: string;
  subtitle?: string;
  tldr: string[];
  scope: string[];
  panelistMap: string;
  evaluationLens: string[];
  status?: 'scaffold' | 'draft' | 'reviewed';
}

// SectionShell renders the invariants every section in this deep dive must carry:
// TLDR, scope, panelist-map callout, evaluation-lens callout, and status badge.
// Content authors fill in the detailed prose inside the children slot as sections
// mature from scaffold to draft to reviewed.
export function SectionShell({
  title,
  subtitle,
  tldr,
  scope,
  panelistMap,
  evaluationLens,
  status = 'scaffold',
  children,
}: React.PropsWithChildren<SectionShellProps>) {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={subtitle}
            actions={<Badge color={statusColor(status)}>{status}</Badge>}
          >
            {title}
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="info" header="TLDR">
            <ul>
              {tldr.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </Alert>
          <Box variant="h3">Scope of this section</Box>
          <ul>
            {scope.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </SpaceBetween>
      </Container>

      {children ? <Container>{children}</Container> : null}

      <Container header={<Header variant="h2">Panelist map</Header>}>
        <Box variant="p">{panelistMap}</Box>
      </Container>

      <Container header={<Header variant="h2">Evaluation lens</Header>}>
        <Box variant="p">
          When a customer or vendor pitches an architecture that touches this section, ask:
        </Box>
        <ul>
          {evaluationLens.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </Container>
    </SpaceBetween>
  );
}

function statusColor(status: 'scaffold' | 'draft' | 'reviewed'): 'grey' | 'blue' | 'green' {
  if (status === 'reviewed') return 'green';
  if (status === 'draft') return 'blue';
  return 'grey';
}
