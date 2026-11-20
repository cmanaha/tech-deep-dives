import { useMemo } from 'react';
import type { ReactNode } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import Box from '@cloudscape-design/components/box';

/**
 * Typeset mathematics for the Physical AI dive, rendered by KaTeX from a TeX string.
 *
 * `M` is an inline symbol or expression inside a sentence. `Formula` is a displayed equation with
 * a short name above it and its source under it. Both carry `data-num="math"`, which tells the
 * citation check that the digits inside are part of a formula (an exponent, a one half) and not a
 * sourced quantity. KaTeX writes MathML beside the visual layout, so a screen reader reads the
 * formula. A TeX string that does not parse renders as a visible error, which check-section.mjs
 * reports as a finding.
 */

function render(tex: string, display: boolean): string {
  return katex.renderToString(tex, { displayMode: display, throwOnError: false, output: 'htmlAndMathml', strict: 'error' });
}

/** Inline mathematics: a symbol or a short expression inside a sentence. */
export function M({ children }: { children: string }) {
  const html = useMemo(() => render(children, false), [children]);
  return <span data-num="math" data-math="inline" style={{ whiteSpace: 'nowrap' }} dangerouslySetInnerHTML={{ __html: html }} />;
}

interface FormulaProps {
  /** What the formula is, in a few words: "Behaviour cloning loss". */
  name: string;
  /** The TeX source. */
  tex: string;
  /** The citation of the paper or code the formula comes from, at a pinned version. */
  source?: ReactNode;
}

/** A displayed equation. A wide one scrolls sideways inside its own box on a phone. */
export function Formula({ name, tex, source }: FormulaProps) {
  const html = useMemo(() => render(tex, true), [tex]);
  return (
    <div data-math="display" style={{ margin: '4px 0', padding: '10px 14px', background: '#fbfbfd', border: '1px solid #d5dbdb', borderRadius: 8 }}>
      <Box variant="small" color="text-body-secondary">
        <span data-num="math">{name}</span>
      </Box>
      <div
        data-num="math"
        role="math"
        aria-label={name}
        style={{ overflowX: 'auto', overflowY: 'hidden', padding: '6px 0', fontSize: '1.08em' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {source && (
        <Box variant="small" color="text-body-secondary">
          Source: {source}
        </Box>
      )}
    </div>
  );
}
