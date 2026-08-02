import React from 'react';
import Popover from '@cloudscape-design/components/popover';
import Link from '@cloudscape-design/components/link';
import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

/**
 * Provenance of a claim, per the source-authority standard.
 *
 * The standard is: code is the authority, everything else is orientation.
 * A reader must be able to tell, without clicking, whether a claim is
 * something AWS states, something we read out of an implementation, or a
 * place where the two disagree.
 *
 * See deep-dives/efa/revamp/source-authority-standard.md
 */
export type Provenance =
  /** AWS states it. Documentation is the evidence. */
  | 'documented'
  /** AWS states it AND the code agrees. Strongest category. */
  | 'code-confirmed'
  /** AWS documents nothing. The claim comes from reading the implementation. */
  | 'code-derived'
  /** Documentation and code disagree. Code is authoritative. */
  | 'doc-code-conflict';

export type SourceTier = 1 | 2 | 3 | 4;

/** A documentation reference. */
export interface DocRef {
  title: string;
  url: string;
  tier: SourceTier;
  /** ISO date the page was read, e.g. '2026-08-01'. */
  accessed: string;
}

/**
 * A source-code reference. `ref` must be a commit SHA or a release tag,
 * never a branch name, so the citation can be re-fetched and re-verified.
 */
export interface CodeRef {
  /** e.g. 'amzn/amzn-drivers' */
  repo: string;
  /** Commit SHA or release tag. Never 'main'. */
  ref: string;
  /** Path within the repo. */
  path: string;
  /** Optional line or range, e.g. 'L142' or 'L142-L149'. */
  lines?: string;
  /** ISO date the code was read. */
  read: string;
}

export interface SourceRefProps {
  provenance: Provenance;
  doc?: DocRef;
  code?: CodeRef;
  /**
   * For 'doc-code-conflict': what the stale document claims, so the
   * contradiction is visible rather than silently resolved.
   */
  conflict?: string;
  /** Optional short inline label. Defaults to the provenance marker. */
  label?: string;
}

interface ProvenanceStyle {
  marker: string;
  badge: 'green' | 'blue' | 'grey' | 'red' | 'severity-medium';
  heading: string;
  note: string;
}

const provenanceConfig: Record<Provenance, ProvenanceStyle> = {
  documented: {
    marker: 'doc',
    badge: 'blue',
    heading: 'Documented',
    note: 'AWS states this in its own documentation.',
  },
  'code-confirmed': {
    marker: 'doc+code',
    badge: 'green',
    heading: 'Code-confirmed',
    note: 'AWS documents this and the implementation agrees. Strongest category.',
  },
  'code-derived': {
    marker: 'code',
    badge: 'severity-medium',
    heading: 'Derived from source',
    note:
      'No AWS documentation states this. It is read directly out of the implementation at the pinned commit below. Treat it as our inference, not as an AWS statement.',
  },
  'doc-code-conflict': {
    marker: 'doc vs code',
    badge: 'red',
    heading: 'Documentation contradicts the code',
    note:
      'The documentation and the implementation disagree. The code is authoritative here, and the conflicting document is named so you can check both.',
  },
};

const tierLabel: Record<SourceTier, string> = {
  1: 'Tier 1 (official docs, API reference, source code)',
  2: 'Tier 2 (vendor blog, talk, product page)',
  3: 'Tier 3 (third-party analysis, academic paper)',
  4: 'Tier 4 (inspiration only, never cited as fact)',
};

/** Build a permalink to the exact code at the pinned ref. */
export function codeUrl(code: CodeRef): string {
  const base = `https://github.com/${code.repo}/blob/${code.ref}/${code.path}`;
  return code.lines ? `${base}#${code.lines}` : base;
}

/** Short human-readable form, e.g. 'amzn-drivers@r3.3.0 efa_io_defs.h:L142'. */
export function codeLabel(code: CodeRef): string {
  const repoShort = code.repo.split('/').pop() ?? code.repo;
  const fileShort = code.path.split('/').pop() ?? code.path;
  const linePart = code.lines ? `:${code.lines.replace(/^L/, '')}` : '';
  return `${repoShort}@${code.ref} ${fileShort}${linePart}`;
}

/**
 * Inline provenance marker for a single claim.
 *
 * Renders a small badge the reader can see without interacting, plus a popover
 * carrying the full citation: URL and access date for documentation, and
 * repo, pinned ref, path, line and read-date for code.
 */
export function SourceRef({ provenance, doc, code, conflict, label }: SourceRefProps) {
  const config = provenanceConfig[provenance];

  return (
    <Popover
      triggerType="custom"
      dismissButton={false}
      size="large"
      header={config.heading}
      content={
        <SpaceBetween size="xs">
          <Box variant="small">{config.note}</Box>

          {doc && (
            <Box variant="small">
              <Link href={doc.url} external>
                {doc.title}
              </Link>
              <Box variant="small" color="text-body-secondary">
                {tierLabel[doc.tier]}, accessed {doc.accessed}
              </Box>
            </Box>
          )}

          {code && (
            <Box variant="small">
              <Link href={codeUrl(code)} external>
                {codeLabel(code)}
              </Link>
              <Box variant="small" color="text-body-secondary">
                Pinned to {code.ref}, read {code.read}
              </Box>
            </Box>
          )}

          {conflict && (
            <Box variant="small" color="text-status-error">
              Conflicting document says: {conflict}
            </Box>
          )}
        </SpaceBetween>
      }
    >
      <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
        <Badge color={config.badge}>{label ?? config.marker}</Badge>
      </span>
    </Popover>
  );
}
