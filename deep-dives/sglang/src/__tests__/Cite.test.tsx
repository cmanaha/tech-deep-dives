import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Cite,
  sglangUrl,
  sglangTreeUrl,
  sglangDocsSrcUrl,
  sglangDocsUrl,
  SGLANG_TAG,
  ACCESSED,
} from '../components/Cite';

describe('sglangUrl', () => {
  it('pins to the release tag, never a branch', () => {
    const url = sglangUrl('python/sglang/srt/managers/scheduler.py', 'L10-L20');
    expect(url).toBe(
      `https://github.com/sgl-project/sglang/blob/${SGLANG_TAG}/python/sglang/srt/managers/scheduler.py#L10-L20`,
    );
    expect(url).not.toMatch(/\/(blob|tree)\/(main|master)\//);
  });

  it('omits the fragment when no line range is given', () => {
    expect(sglangUrl('python/sglang/srt/server_args.py')).not.toContain('#');
  });

  it('pins directory links to the tag', () => {
    expect(sglangTreeUrl('/python/sglang/srt/mem_cache')).toBe(
      `https://github.com/sgl-project/sglang/tree/${SGLANG_TAG}/python/sglang/srt/mem_cache`,
    );
  });
});

describe('docs links', () => {
  it('cites the tag-pinned mdx source for version-specific claims', () => {
    expect(sglangDocsSrcUrl('advanced_features/hicache', 'L5')).toBe(
      `https://github.com/sgl-project/sglang/blob/${SGLANG_TAG}/docs/docs/advanced_features/hicache.mdx#L5`,
    );
  });

  it('builds the rendered docs page and strips a leading slash', () => {
    expect(sglangDocsUrl('/advanced_features/hicache')).toBe(
      'https://docs.sglang.io/docs/advanced_features/hicache',
    );
  });
});

describe('Cite', () => {
  it('shows the tier, the link and the accessed date', () => {
    render(
      <Cite tier={1} href={sglangUrl('python/sglang/srt/mem_cache/radix_cache.py', 'L40')}>
        radix_cache.py L40
      </Cite>,
    );
    expect(screen.getByText('Tier 1')).toBeTruthy();
    const link = screen.getByRole('link', { name: /radix_cache\.py L40/ });
    expect(link.getAttribute('href')).toContain(
      `/blob/${SGLANG_TAG}/python/sglang/srt/mem_cache/radix_cache.py#L40`,
    );
    expect(screen.getByText(`(accessed ${ACCESSED})`)).toBeTruthy();
  });

  it('marks a documentation versus code conflict visibly', () => {
    render(
      <Cite tier={1} href="https://docs.sglang.io/" kind="doc-code-conflict" accessed="2026-01-01">
        docs page
      </Cite>,
    );
    expect(screen.getByText('docs vs code')).toBeTruthy();
    expect(screen.getByText('(accessed 2026-01-01)')).toBeTruthy();
  });
});
