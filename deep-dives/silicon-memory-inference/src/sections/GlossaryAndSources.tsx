import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function GlossaryAndSources() {
  return (
    <SectionShell
      title="Glossary and Sources"
      subtitle="Vocabulary and authoritative reference list"
      tldr={[
        'Glossary covers 14 categories: memory architecture, chiplet topology, cache hierarchy, NUMA, compute and ML architecture, precision formats, LLM inference, communication, isolation, capital markets, AWS-specific, vendor products, computing concepts, and less-common terms.',
        'Sources are tiered: Tier 1 (official docs, specs, source code), Tier 2 (vendor blogs, conference talks), Tier 3 (peer-reviewed papers, third-party analysis), Tier 4 (tutorials and blog posts — inspiration only, never cited as fact).',
        'Every quantitative claim in this deep dive must trace to Tier 1, 2, or 3 with an access date; unverified claims are flagged UNKNOWN.',
      ]}
      scope={[
        'Rendered glossary of every acronym and term introduced, alphabetized and cross-linked to the section where it first appears.',
        'Full source bibliography: vendor docs (AMD SoG, Intel datasheets, NVIDIA H100/B200 whitepapers, AWS Neuron docs), arXiv papers, formal specs (CXL 3.0, JEDEC HBM), and re:Invent / HotChips talks.',
        'Fact-check register: every quantitative claim with source and access date.',
        'UNKNOWN register: claims we could not verify and what would be needed to close them.',
      ]}
      panelistMap="Reference material for everyone. Hands the audience a shared vocabulary so follow-up questions stay concrete rather than drifting into vendor-specific marketing."
      evaluationLens={[
        'When a claim is repeated on stage, does it appear here with a citation?',
        'When a term is used without explanation, is it defined here?',
        'When a comparison is made, are all vendors cited at the same tier?',
      ]}
    />
  );
}
