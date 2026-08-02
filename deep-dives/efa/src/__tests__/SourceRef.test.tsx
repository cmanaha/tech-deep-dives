import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SourceRef, codeUrl, codeLabel } from '@tech-deep-dives/shared';
import type { CodeRef } from '@tech-deep-dives/shared';

/**
 * The citation component is the mechanism that makes every claim in this dive
 * falsifiable, so its link construction is load-bearing. A code citation that
 * points at the wrong place is worse than no citation, because it looks checked.
 */

const efaOpcodes: CodeRef = {
  repo: 'amzn/amzn-drivers',
  ref: 'r3.3.0',
  path: 'kernel/linux/efa/efa_io_defs.h',
  lines: 'L142',
  read: '2026-08-01',
};

describe('codeUrl', () => {
  it('builds a permalink pinned to the ref, not to a branch', () => {
    expect(codeUrl(efaOpcodes)).toBe(
      'https://github.com/amzn/amzn-drivers/blob/r3.3.0/kernel/linux/efa/efa_io_defs.h#L142'
    );
  });

  it('omits the line fragment when no lines are given', () => {
    const { lines, ...noLines } = efaOpcodes;
    expect(lines).toBe('L142');
    expect(codeUrl(noLines)).toBe(
      'https://github.com/amzn/amzn-drivers/blob/r3.3.0/kernel/linux/efa/efa_io_defs.h'
    );
  });

  it('preserves a line range', () => {
    expect(codeUrl({ ...efaOpcodes, lines: 'L142-L149' })).toMatch(/#L142-L149$/);
  });

  it('never emits a branch-shaped ref for a pinned citation', () => {
    // Guards the pinned-refs ci.sh gate at the component level.
    const url = codeUrl(efaOpcodes);
    expect(url).not.toContain('/blob/main/');
    expect(url).not.toContain('/blob/master/');
  });
});

describe('codeLabel', () => {
  it('shortens repo and path to a readable citation', () => {
    expect(codeLabel(efaOpcodes)).toBe('amzn-drivers@r3.3.0 efa_io_defs.h:142');
  });

  it('drops the line suffix when absent', () => {
    const { lines, ...noLines } = efaOpcodes;
    expect(lines).toBe('L142');
    expect(codeLabel(noLines)).toBe('amzn-drivers@r3.3.0 efa_io_defs.h');
  });
});

describe('SourceRef markers', () => {
  it('marks a code-derived claim distinctly from a documented one', () => {
    const { unmount } = render(<SourceRef provenance="documented" />);
    expect(screen.getByText('doc')).toBeTruthy();
    unmount();

    render(<SourceRef provenance="code-derived" code={efaOpcodes} />);
    expect(screen.getByText('code')).toBeTruthy();
  });

  it('marks a documentation-versus-code conflict', () => {
    render(
      <SourceRef
        provenance="doc-code-conflict"
        code={efaOpcodes}
        conflict="SRD.txt (2019) says only Send is supported"
      />
    );
    expect(screen.getByText('doc vs code')).toBeTruthy();
  });

  it('honours an explicit label override', () => {
    render(<SourceRef provenance="code-confirmed" label="verified" />);
    expect(screen.getByText('verified')).toBeTruthy();
    expect(screen.queryByText('doc+code')).toBeNull();
  });
});
