import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Cite, vllmUrl, vllmDocsUrl, VLLM_TAG, ACCESSED } from '../components/Cite';

describe('vllmUrl', () => {
  it('pins to the release tag, never a branch', () => {
    const url = vllmUrl('vllm/v1/core/sched/scheduler.py', 'L10-L20');
    expect(url).toBe(
      `https://github.com/vllm-project/vllm/blob/${VLLM_TAG}/vllm/v1/core/sched/scheduler.py#L10-L20`,
    );
    expect(url).not.toMatch(/\/(blob|tree)\/(main|master)\//);
  });

  it('omits the fragment when no line range is given', () => {
    expect(vllmUrl('vllm/envs.py')).not.toContain('#');
  });
});

describe('vllmDocsUrl', () => {
  it('targets the versioned docs and strips a leading slash', () => {
    expect(vllmDocsUrl('/design/prefix_caching.html')).toBe(
      `https://docs.vllm.ai/en/${VLLM_TAG}/design/prefix_caching.html`,
    );
  });
});

describe('Cite', () => {
  it('shows the tier, the link and the accessed date', () => {
    render(
      <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L40')}>
        cache.py L40
      </Cite>,
    );
    expect(screen.getByText('Tier 1')).toBeTruthy();
    const link = screen.getByRole('link', { name: /cache\.py L40/ });
    expect(link.getAttribute('href')).toContain(`/blob/${VLLM_TAG}/vllm/config/cache.py#L40`);
    expect(screen.getByText(`(accessed ${ACCESSED})`)).toBeTruthy();
  });

  it('marks a documentation versus code conflict visibly', () => {
    render(
      <Cite tier={1} href="https://docs.vllm.ai/" kind="doc-code-conflict" accessed="2026-01-01">
        docs page
      </Cite>,
    );
    expect(screen.getByText('docs vs code')).toBeTruthy();
    expect(screen.getByText('(accessed 2026-01-01)')).toBeTruthy();
  });
});
