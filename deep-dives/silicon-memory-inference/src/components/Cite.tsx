import React from 'react';
import Popover from '@cloudscape-design/components/popover';
import Link from '@cloudscape-design/components/link';
import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

/**
 * Inline citation for this dive.
 *
 * Every quantitative claim carries one: a visible tier badge plus a popover
 * with the external link and the date the source was read. Sources live in
 * src/sources/<SectionName>.ts, one file per section, and the Glossary and
 * Sources appendix plus sources.md are generated from those files, so a
 * citation added here reaches the bibliography without a second edit.
 *
 * Tiers follow CLAUDE.md and deep-dives/efa/revamp/source-authority-standard.md:
 *   0  our own experiment on our own hardware, logged under research/
 *   1  official docs, datasheets, specifications, filings, pinned source code
 *   2  vendor press releases, blogs, product pages, keynotes
 *   3  third-party analysis, academic papers, trade press
 */
export type Tier = 0 | 1 | 2 | 3;

export interface Source {
  title: string;
  /** Who published it: 'NVIDIA', 'AWS', 'JEDEC', 'SK hynix', 'arXiv'. */
  publisher: string;
  /** GitHub and Hugging Face links must be pinned to a SHA or tag. */
  url: string;
  tier: Tier;
  /** ISO date the source was read, e.g. '2026-10-16'. */
  accessed: string;
}

/**
 * What kind of figure the citation backs. The kind changes how a reader
 * should weigh the number, so it is visible on the badge.
 *
 *   spec          a published specification or documented behaviour
 *   vendor-claim  a vendor performance figure, not independently measured
 *   roadmap       a figure for a product that is not shipping
 *   measured      a measurement, by the source named
 *   simulated     a simulation or model result, by the source named
 *   derived       our arithmetic on the cited inputs, not a source statement
 */
export type ClaimKind =
  | 'spec'
  | 'vendor-claim'
  | 'roadmap'
  | 'measured'
  | 'simulated'
  | 'derived';

const tierColor: Record<Tier, 'green' | 'blue' | 'grey' | 'severity-medium'> = {
  0: 'green',
  1: 'blue',
  2: 'grey',
  3: 'severity-medium',
};

export const tierDescription: Record<Tier, string> = {
  0: 'Tier 0: our own experiment, logged in research/',
  1: 'Tier 1: official documentation, specification, filing or pinned source code',
  2: 'Tier 2: vendor press release, blog, product page or keynote',
  3: 'Tier 3: third-party analysis, academic paper or trade press',
};

const kindSuffix: Record<ClaimKind, string> = {
  spec: '',
  'vendor-claim': ' claim',
  roadmap: ' roadmap',
  measured: ' measured',
  simulated: ' simulated',
  derived: ' derived',
};

const kindNote: Record<ClaimKind, string> = {
  spec: 'Published specification or documented behaviour.',
  'vendor-claim':
    'Vendor performance claim. The vendor states it; no independent measurement is attached.',
  roadmap: 'Roadmap figure for a product that is not shipping. It can change before launch.',
  measured: 'Measured result, reported by the source named below.',
  simulated: 'Simulated or modelled result, reported by the source named below. No hardware measurement is attached.',
  derived: 'Our arithmetic on the figures in the source below, not a statement the source makes.',
};

export interface CiteProps {
  s: Source;
  kind?: ClaimKind;
  /** Optional qualifier shown in the popover, e.g. 'sparse; dense is half'. */
  note?: string;
}

export function Cite({ s, kind = 'spec', note }: CiteProps) {
  return (
    <>
      {' '}
      <Popover
        triggerType="custom"
        dismissButton={false}
        size="large"
        header={`${s.publisher}: ${kindSuffix[kind].trim() || 'source'}`}
        content={
          <SpaceBetween size="xs">
            <Box variant="small">{kindNote[kind]}</Box>
            {note && <Box variant="small">{note}</Box>}
            <Box variant="small">
              <Link href={s.url} external>
                {s.title}
              </Link>
              <Box variant="small" color="text-body-secondary">
                {tierDescription[s.tier]}. Accessed {s.accessed}.
              </Box>
            </Box>
          </SpaceBetween>
        }
      >
        <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <Badge color={tierColor[s.tier]}>
            {`T${s.tier} ${s.publisher}${kindSuffix[kind]}`}
          </Badge>
        </span>
      </Popover>
    </>
  );
}
