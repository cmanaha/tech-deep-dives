import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Cite, arxiv, gh, ghTree, researchUrl, E0_URL, TRL_TAG, DIVE_REPO_SHA, ACCESSED } from '../components/Cite';

describe('arxiv', () => {
  it('keeps the version in the abstract URL', () => {
    expect(arxiv('2402.03300v3')).toBe('https://arxiv.org/abs/2402.03300v3');
  });
});

describe('gh and ghTree', () => {
  it('pin files to the given tag, never a branch', () => {
    const url = gh('huggingface/trl', TRL_TAG, '/trl/trainer/grpo_config.py', 'L681-L688');
    expect(url).toBe(
      `https://github.com/huggingface/trl/blob/${TRL_TAG}/trl/trainer/grpo_config.py#L681-L688`,
    );
    expect(url).not.toMatch(/\/(blob|tree)\/(main|master)\//);
  });

  it('omits the fragment when no line range is given', () => {
    expect(gh('huggingface/trl', TRL_TAG, 'pyproject.toml')).not.toContain('#');
  });

  it('pins directories, and the repository root when no directory is given', () => {
    expect(ghTree('volcengine/verl', 'v0.9.1', '/verl/trainer')).toBe(
      'https://github.com/volcengine/verl/tree/v0.9.1/verl/trainer',
    );
    expect(ghTree('volcengine/verl', 'v0.9.1')).toBe('https://github.com/volcengine/verl/tree/v0.9.1');
  });
});

describe('Tier 0 links', () => {
  it('point at a 40-character commit of this repository', () => {
    expect(DIVE_REPO_SHA).toMatch(/^[0-9a-f]{40}$/);
    expect(researchUrl('2026-10/E0-spark-smoke.md')).toBe(E0_URL);
    expect(E0_URL).toBe(
      `https://github.com/cmanaha/tech-deep-dives/blob/${DIVE_REPO_SHA}/deep-dives/rl-agentic-loops/research/2026-10/E0-spark-smoke.md`,
    );
  });
});

describe('Cite', () => {
  it('shows the tier, the venue, the link and the accessed date', () => {
    render(
      <Cite tier={3} href={arxiv('2507.19457v2')} venue="preprint">
        GEPA, Table 1
      </Cite>,
    );
    expect(screen.getByText('Tier 3')).toBeTruthy();
    expect(screen.getByText('preprint')).toBeTruthy();
    const link = screen.getByRole('link', { name: /GEPA, Table 1/ });
    expect(link.getAttribute('href')).toBe('https://arxiv.org/abs/2507.19457v2');
    expect(screen.getByText(`(accessed ${ACCESSED})`)).toBeTruthy();
  });

  it('labels Tier 0 as our own run and marks vendor claims', () => {
    render(
      <>
        <Cite tier={0} href={E0_URL}>
          E0 log
        </Cite>
        <Cite tier={2} href="https://example.com/post" kind="vendor-claim">
          Vendor post
        </Cite>
      </>,
    );
    expect(screen.getByText('Tier 0: our run')).toBeTruthy();
    expect(screen.getByText('vendor claim')).toBeTruthy();
  });

  it('accepts an explicit accessed date', () => {
    render(
      <Cite tier={1} href="https://docs.aws.amazon.com/bedrock/" accessed="2026-10-17">
        Bedrock docs
      </Cite>,
    );
    expect(screen.getByText('(accessed 2026-10-17)')).toBeTruthy();
  });
});
